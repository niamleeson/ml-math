module.exports = {
  "math-13-10": {
    "id": "math-13-10",
    "title": "Metric-space topology",
    "tagline": "Topology begins gently: decide what it means for points to be near, and open sets follow.",
    "connections": {
      "buildsOn": [
        "sets",
        "functions",
        "Euclidean distance"
      ],
      "leadsTo": [
        "continuity in topological spaces",
        "quotient spaces",
        "manifolds"
      ],
      "usedWith": [
        "norms",
        "sequences",
        "neighborhoods"
      ]
    },
    "motivation": "<p>You already know distance on the number line: $2.01$ is close to $2$, while $7$ is not. A <b>metric space</b> keeps that familiar idea but lets the points be vectors, functions, strings, or data records.</p><p>Topology then asks a softer question than exact distance: which points count as nearby? Once we know the open balls, we know open sets, limits, continuity, and the shape information that survives small deformations.</p>",
    "definition": "<p>A <b>metric</b> on a set $X$ is a function $d:X\\times X\\to[0,\\infty)$ such that $d(x,y)=0$ exactly when $x=y$, $d(x,y)=d(y,x)$, and $d(x,z)\\le d(x,y)+d(y,z)$. The open ball centered at $x$ with radius $r>0$ is $B_r(x)=\\{y\\in X:d(x,y)<r\\}$. A set $U\\subseteq X$ is <b>open</b> if every $x\\in U$ has some ball $B_r(x)\\subseteq U$.</p><p>The key fact is that metrics create topology: unions of open sets are open because each point keeps the ball it had in one member of the union, and finite intersections are open because a point in both sets can use the smaller of the two available radii.</p><p><b>Assumptions that matter:</b> distances must satisfy all metric axioms; the radius in an open ball is positive; openness is relative to the ambient metric space; and different metrics can sometimes produce the same open sets.</p>",
    "worked": {
      "problem": "In $\\mathbb{R}$ with $d(x,y)=|x-y|$, prove that $(1,4)$ is open and that $[1,4]$ is not open.",
      "skills": [
        "open balls",
        "intervals",
        "counterexamples"
      ],
      "strategy": "Interior points have room on both sides; endpoints of a closed interval do not.",
      "steps": [
        {
          "do": "Choose a point $x\\in(1,4)$",
          "result": "$1<x<4$",
          "why": "the point lies strictly between the endpoints"
        },
        {
          "do": "Measure its distance to the nearer endpoint",
          "result": "$m=\\min(x-1,4-x)>0$",
          "why": "both distances are positive"
        },
        {
          "do": "Choose a radius",
          "result": "$r=m/2$",
          "why": "half the nearest-endpoint distance stays safely inside"
        },
        {
          "do": "Test any $y$ with $|y-x|<r$",
          "result": "$1<y<4$",
          "why": "moving less than $r$ cannot reach either endpoint"
        },
        {
          "do": "Conclude for $(1,4)$",
          "result": "$(1,4)$ is open",
          "why": "every point has an inside ball"
        },
        {
          "do": "Test $[1,4]$ at $x=1$",
          "result": "B_r(1)=(1-r,1+r)$",
          "why": "every positive radius includes numbers below $1$"
        },
        {
          "do": "Compare with $[1,4]$",
          "result": "$B_r(1)\\nsubseteq[1,4]$",
          "why": "points like $1-r/2$ fall outside"
        }
      ],
      "verify": "The argument used an arbitrary interior point for $(1,4)$ and a single failed endpoint for $[1,4]$.",
      "answer": "$(1,4)$ is open in $\\mathbb{R}$, but $[1,4]$ is not open.",
      "connects": "Metric topology turns distance-to-the-boundary into the formal idea of openness."
    },
    "practice": [
      {
        "problem": "In $\\mathbb{R}$, find an open ball centered at $3$ that lies inside $(2,5)$.",
        "steps": [
          {
            "do": "Compute distance to the left endpoint",
            "result": "$3-2=1$",
            "why": "the ball cannot reach $2$"
          },
          {
            "do": "Compute distance to the right endpoint",
            "result": "$5-3=2$",
            "why": "the right side has more room"
          },
          {
            "do": "Take the smaller distance",
            "result": "$1$",
            "why": "the nearest boundary controls the radius"
          },
          {
            "do": "Choose a safe radius",
            "result": "$r=0.5$",
            "why": "any positive radius below $1$ works"
          },
          {
            "do": "Write the ball",
            "result": "$B_{0.5}(3)=(2.5,3.5)$",
            "why": "all points stay inside $(2,5)$"
          }
        ],
        "answer": "One valid answer is $B_{0.5}(3)$; in fact any radius $0<r\\le1$ with strict containment using $r<1$ works."
      },
      {
        "problem": "In $\\mathbb{R}^2$ with Euclidean distance, is the disk $U=\\{(x,y):x^2+y^2<9\\}$ open?",
        "steps": [
          {
            "do": "Choose a point $p=(x,y)\\in U$",
            "result": "$x^2+y^2<9$",
            "why": "the point is strictly inside the radius-$3$ disk"
          },
          {
            "do": "Compute its distance from the origin",
            "result": "$\\|p\\|=\\sqrt{x^2+y^2}<3$",
            "why": "the boundary has radius $3$"
          },
          {
            "do": "Measure room to the boundary",
            "result": "$3-\\|p\\|>0$",
            "why": "inside points have positive margin"
          },
          {
            "do": "Choose a radius",
            "result": "$r=(3-\\|p\\|)/2$",
            "why": "half the margin is safe"
          },
          {
            "do": "Use the triangle inequality",
            "result": "$\\|q\\|\\le\\|p\\|+\\|q-p\\|<\\|p\\|+r<3$",
            "why": "nearby points remain inside"
          }
        ],
        "answer": "Yes. The open disk is open."
      },
      {
        "problem": "With the discrete metric $d(x,y)=0$ if $x=y$ and $1$ otherwise, show every subset $A\\subseteq X$ is open.",
        "steps": [
          {
            "do": "Choose a point $a\\in A$",
            "result": "$a$ is one element of the subset",
            "why": "openness is checked point by point"
          },
          {
            "do": "Choose radius",
            "result": "$r=1/2$",
            "why": "this radius is smaller than the distance to every different point"
          },
          {
            "do": "Compute the ball",
            "result": "$B_{1/2}(a)=\\{a\\}$",
            "why": "only $a$ has distance less than $1/2$ from itself"
          },
          {
            "do": "Compare with $A$",
            "result": "$\\{a\\}\\subseteq A$",
            "why": "the chosen point belongs to $A$"
          },
          {
            "do": "Conclude",
            "result": "$A$ is open",
            "why": "every point of $A$ has a contained ball"
          }
        ],
        "answer": "Every subset is open in a discrete metric space."
      },
      {
        "problem": "In $\\mathbb{R}$, prove that $\\mathbb{Q}$ is not open with the usual metric.",
        "steps": [
          {
            "do": "Choose a rational point",
            "result": "$q\\in\\mathbb{Q}$",
            "why": "openness would need a ball around every rational"
          },
          {
            "do": "Take any radius",
            "result": "$r>0$",
            "why": "we must show no radius works"
          },
          {
            "do": "Pick an irrational nearby",
            "result": "$q+\\frac{r}{2\\sqrt2}$",
            "why": "a nonzero rational multiple of $1/\\sqrt2$ is irrational"
          },
          {
            "do": "Measure the distance",
            "result": "$\\left|q+\\frac{r}{2\\sqrt2}-q\\right|=\\frac{r}{2\\sqrt2}<r$",
            "why": "the point lies in the ball"
          },
          {
            "do": "Compare with $\\mathbb{Q}$",
            "result": "$q+\\frac{r}{2\\sqrt2}\\notin\\mathbb{Q}$",
            "why": "the ball is not contained in the rationals"
          }
        ],
        "answer": "$\\mathbb{Q}$ is not open in the usual topology on $\\mathbb{R}$."
      },
      {
        "problem": "For data vectors $a=(1,2)$ and $b=(4,6)$, compute the Euclidean distance and decide whether $b\\in B_6(a)$.",
        "steps": [
          {
            "do": "Subtract coordinates",
            "result": "$b-a=(3,4)$",
            "why": "distance uses the displacement vector"
          },
          {
            "do": "Square the differences",
            "result": "$3^2+4^2=9+16$",
            "why": "Euclidean distance sums squared coordinate changes"
          },
          {
            "do": "Take the square root",
            "result": "$d(a,b)=\\sqrt{25}=5$",
            "why": "the distance is the length of the displacement"
          },
          {
            "do": "Compare with the radius",
            "result": "$5<6$",
            "why": "membership in an open ball uses strict inequality"
          },
          {
            "do": "State membership",
            "result": "$b\\in B_6(a)$",
            "why": "the vector is within radius $6$"
          }
        ],
        "answer": "The distance is $5$, so $b$ lies in the open ball $B_6(a)$."
      }
    ],
    "applications": [
      {
        "title": "Nearest-neighbor search",
        "background": "Similarity search starts by choosing a metric, because nearest only means nearest after distance is defined.",
        "numbers": "For vectors $(1,2)$ and $(4,6)$, Euclidean distance is $5$; for $(1,2)$ and $(2,2)$ it is $1$, so the second vector is nearer."
      },
      {
        "title": "Feature standardization",
        "background": "Distances can be dominated by large-scale features, so preprocessing often changes the metric geometry before learning.",
        "numbers": "If age differs by $10$ and income differs by $10000$, raw squared distance includes $10000^2$; after scaling income by $10000$, that contribution becomes $1^2$."
      },
      {
        "title": "Clustering",
        "background": "Algorithms such as k-means assume that small metric balls capture local similarity.",
        "numbers": "Centers $0$ and $10$ on the line split at $5$ because a point $x=4$ has distances $4$ and $6$, so it joins center $0$."
      },
      {
        "title": "Robust metrics",
        "background": "Manhattan distance is common when coordinate-wise absolute changes matter more than diagonal geometry.",
        "numbers": "Between $(1,2)$ and $(4,6)$, $L^1$ distance is $|3|+|4|=7$, while Euclidean distance is $5$."
      },
      {
        "title": "Topology of data clouds",
        "background": "Topological data analysis grows balls around data points and watches when components merge.",
        "numbers": "Points at $0$, $0.2$, and $1.0$ with radius $0.15$ connect the first two balls but leave the third separate."
      },
      {
        "title": "Continuity of models",
        "background": "A model is continuous when nearby inputs lead to nearby outputs, and the metric defines nearby.",
        "numbers": "If $|f(x)-f(y)|\\le2|x-y|$, then inputs within $0.01$ force outputs within $0.02$."
      }
    ],
    "applicationsClose": "Metric topology is the quiet foundation beneath neighborhoods, continuity, clustering, and the shape of data.",
    "takeaways": [
      "A metric supplies distances; open balls turn those distances into topology.",
      "A set is open when every one of its points has a small ball still inside the set.",
      "Openness depends on the ambient metric space.",
      "In ML, changing the metric changes what the model treats as local."
    ]
  },
  "math-13-11": {
    "id": "math-13-11",
    "title": "Quotient spaces",
    "tagline": "A quotient space is what you get when you decide which points should count as the same.",
    "connections": {
      "buildsOn": [
        "metric-space topology",
        "equivalence relations",
        "functions"
      ],
      "leadsTo": [
        "homotopy",
        "covering spaces",
        "projective spaces"
      ],
      "usedWith": [
        "partitions",
        "continuous maps",
        "identifications"
      ]
    },
    "motivation": "<p>You already know a simple identification: on a clock, hour $12$ and hour $0$ name the same position. Quotient spaces make that idea precise for geometric objects.</p><p>Instead of studying a space point by point, we first declare some points equivalent, then study the space of equivalence classes. This is how an interval becomes a circle, a square becomes a torus, and periodic features become honest topology.</p>",
    "definition": "<p>Let $X$ be a topological space and let $\\sim$ be an equivalence relation on $X$. The <b>quotient set</b> $X/{\\sim}$ consists of equivalence classes $[x]$. The quotient map $q:X\\to X/{\\sim}$ sends each point to its class. A subset $V\\subseteq X/{\\sim}$ is open exactly when $q^{-1}(V)$ is open in $X$.</p><p>This definition is chosen so the quotient map is automatically continuous: if $V$ is open in the quotient, then by definition its preimage is open in $X$. It is also the largest topology with that property, meaning we identify points without adding unnecessary extra restrictions.</p><p><b>Assumptions that matter:</b> the relation must be reflexive, symmetric, and transitive; openness is tested by pulling back along $q$; and quotient spaces can behave badly if identifications are wild, so simple geometric examples are the safest first guide.</p>",
    "worked": {
      "problem": "Show that identifying the endpoints of $[0,1]$ produces a circle-like quotient, and compute the class of $0$, $1$, and $0.25$.",
      "skills": [
        "equivalence classes",
        "quotient maps",
        "endpoint identification"
      ],
      "strategy": "The only nontrivial identification is $0\\sim1$; all interior points keep their own class.",
      "steps": [
        {
          "do": "State the relation",
          "result": "$0\\sim1$ and every point is equivalent to itself",
          "why": "the endpoints are glued"
        },
        {
          "do": "Find the class of $0$",
          "result": "$[0]=\\{0,1\\}$",
          "why": "endpoint gluing puts them together"
        },
        {
          "do": "Find the class of $1$",
          "result": "$[1]=\\{0,1\\}$",
          "why": "equivalent points have the same class"
        },
        {
          "do": "Find the class of $0.25$",
          "result": "$[0.25]=\\{0.25\\}$",
          "why": "no other point is identified with it"
        },
        {
          "do": "Interpret geometrically",
          "result": "the quotient bends the interval into a loop",
          "why": "the two loose ends become one point"
        }
      ],
      "verify": "Every point of the interval has exactly one class, and only the two endpoints share a class.",
      "answer": "$[0]=[1]=\\{0,1\\}$, while $[0.25]=\\{0.25\\}$; geometrically the quotient is a circle.",
      "connects": "Quotients let topology model gluing as a precise operation on points and open sets."
    },
    "practice": [
      {
        "problem": "For integers, define $a\\sim b$ if $a-b$ is divisible by $3$. List the equivalence classes.",
        "steps": [
          {
            "do": "Compute the class of $0$",
            "result": "$[0]=\\{\\ldots,-6,-3,0,3,6,\\ldots\\}$",
            "why": "these integers leave remainder $0$"
          },
          {
            "do": "Compute the class of $1$",
            "result": "$[1]=\\{\\ldots,-5,-2,1,4,7,\\ldots\\}$",
            "why": "these leave remainder $1$"
          },
          {
            "do": "Compute the class of $2$",
            "result": "$[2]=\\{\\ldots,-4,-1,2,5,8,\\ldots\\}$",
            "why": "these leave remainder $2$"
          },
          {
            "do": "Check coverage",
            "result": "every integer is in one of the three classes",
            "why": "division by $3$ has three remainders"
          },
          {
            "do": "Check separation",
            "result": "the classes do not overlap",
            "why": "an integer cannot have two different remainders"
          }
        ],
        "answer": "The quotient $\\mathbb{Z}/3\\mathbb{Z}$ has three classes: $[0]$, $[1]$, and $[2]$."
      },
      {
        "problem": "On $[0,2]$, identify $0\\sim2$. Find the classes of $0$, $2$, $1.5$, and describe the quotient.",
        "steps": [
          {
            "do": "Apply the endpoint identification",
            "result": "$[0]=\\{0,2\\}$",
            "why": "the endpoints are glued"
          },
          {
            "do": "Use equality of classes",
            "result": "$[2]=\\{0,2\\}$",
            "why": "equivalent points share a class"
          },
          {
            "do": "Check the interior point",
            "result": "$[1.5]=\\{1.5\\}$",
            "why": "it is not identified with another point"
          },
          {
            "do": "Count the geometric effect",
            "result": "one interval with endpoints glued",
            "why": "this creates one loop"
          },
          {
            "do": "Name the shape",
            "result": "circle",
            "why": "a segment closed end-to-end is a circle"
          }
        ],
        "answer": "The quotient is circle-like, with $[0]=[2]$ and interior points singleton classes."
      },
      {
        "problem": "Let $q: [0,1]\\to [0,1]/{0\\sim1}$. If $V$ is the quotient image of $(0.2,0.8)$, is $V$ open?",
        "steps": [
          {
            "do": "Pull back the set",
            "result": "$q^{-1}(V)=(0.2,0.8)$",
            "why": "no endpoints are involved in this image"
          },
          {
            "do": "Check openness in $[0,1]$",
            "result": "$(0.2,0.8)$ is open relative to $[0,1]$",
            "why": "it equals $[0,1]\\cap(0.2,0.8)$"
          },
          {
            "do": "Use the quotient definition",
            "result": "$V$ is open",
            "why": "a quotient set is open when its preimage is open"
          },
          {
            "do": "Check endpoint issue",
            "result": "none",
            "why": "the glued class $[0]=[1]$ is not in $V$"
          },
          {
            "do": "Conclude",
            "result": "$V$ is an open arc",
            "why": "it avoids the glued point"
          }
        ],
        "answer": "Yes. $V$ is open in the quotient."
      },
      {
        "problem": "In a square, identify the left edge to the right edge in the same direction. What surface is formed before any top-bottom gluing?",
        "steps": [
          {
            "do": "Name the square coordinates",
            "result": "$[0,1]\\times[0,1]$",
            "why": "this gives horizontal and vertical directions"
          },
          {
            "do": "State the identification",
            "result": "$(0,y)\\sim(1,y)$",
            "why": "left and right edges match at equal height"
          },
          {
            "do": "Track a horizontal segment",
            "result": "its ends meet",
            "why": "moving left or right wraps around"
          },
          {
            "do": "Track the vertical direction",
            "result": "top and bottom remain unglued",
            "why": "there are still two boundary circles"
          },
          {
            "do": "Name the surface",
            "result": "cylinder",
            "why": "one wrapped direction and one open direction make a cylinder"
          }
        ],
        "answer": "The quotient is a cylinder."
      },
      {
        "problem": "A periodic feature records angle $\\theta$ with $0\\le\\theta\\le2\\pi$ and identifies $0\\sim2\\pi$. Are $0.1$ and $2\\pi-0.1$ close on the quotient circle? Use arc distance.",
        "steps": [
          {
            "do": "Compute direct angular difference",
            "result": "$2\\pi-0.2$",
            "why": "going the long way around is almost a full turn"
          },
          {
            "do": "Compute wrapped difference",
            "result": "$2\\pi-(2\\pi-0.2)=0.2$",
            "why": "the short way crosses the glued point"
          },
          {
            "do": "Choose arc distance",
            "result": "$0.2$",
            "why": "circle distance uses the shorter arc"
          },
          {
            "do": "Compare with ordinary interval distance",
            "result": "$2\\pi-0.2\\approx6.083$",
            "why": "the unglued interval misses periodic closeness"
          },
          {
            "do": "Interpret",
            "result": "the points are close",
            "why": "they lie near the same glued endpoint"
          }
        ],
        "answer": "Yes. Their quotient-circle distance is $0.2$ radians."
      }
    ],
    "applications": [
      {
        "title": "Periodic features",
        "background": "Time of day and angles wrap around, so quotient thinking prevents midnight from looking far from 11:59 pm.",
        "numbers": "Times $23.9$ and $0.1$ hours differ by $23.8$ on a line but only $0.2$ hours on the quotient circle."
      },
      {
        "title": "Image boundaries in simulations",
        "background": "Some simulations use periodic boundary conditions, effectively gluing opposite sides of a rectangle.",
        "numbers": "On a width-$100$ grid, positions $x=99$ and $x=1$ are distance $2$ with wraparound, not $98$."
      },
      {
        "title": "Torus parameter spaces",
        "background": "A torus appears when two independent periodic coordinates are both quotiented to circles.",
        "numbers": "Angles $(0.1,6.2)$ and $(2\\pi-0.1,0.0)$ differ by about $(0.2,0.083)$ after wrapping."
      },
      {
        "title": "Clustering cyclic data",
        "background": "Clustering hour-of-day as a line can split natural midnight clusters; quotient geometry fixes that.",
        "numbers": "Samples at $23.8$, $0.0$, and $0.2$ have circular mean near $0$, not near $8$."
      },
      {
        "title": "Robotics configuration spaces",
        "background": "A robot joint angle has $0$ and $2\\pi$ as the same physical pose, so its configuration space is a quotient.",
        "numbers": "A joint at $359^\\circ$ is only $2^\\circ$ from $1^\\circ$, not $358^\\circ$."
      },
      {
        "title": "Data augmentation by symmetry",
        "background": "When examples are considered equivalent under flips or rotations, learning sometimes works on a quotient of input space.",
        "numbers": "If four rotations of one image are treated as equivalent, an orbit can contain $4$ images but one quotient class."
      }
    ],
    "applicationsClose": "Quotients are the mathematics of respectful forgetting: we forget distinctions that should not matter and keep the shape that remains.",
    "takeaways": [
      "A quotient space replaces points by equivalence classes.",
      "Open sets in the quotient are defined by open preimages under the quotient map.",
      "Gluing endpoints of an interval gives a circle; gluing square edges gives cylinders and tori.",
      "Many ML features with periodicity or symmetry are best understood through quotient geometry."
    ]
  },
  "math-13-12": {
    "id": "math-13-12",
    "title": "Homotopy",
    "tagline": "Homotopy says two maps are the same if one can be continuously deformed into the other.",
    "connections": {
      "buildsOn": [
        "quotient spaces",
        "continuous maps",
        "intervals"
      ],
      "leadsTo": [
        "the fundamental group",
        "homology",
        "deformation retracts"
      ],
      "usedWith": [
        "paths",
        "loops",
        "connectedness"
      ]
    },
    "motivation": "<p>You already have a physical picture: a rubber band loop can slide around a table without cutting or jumping. Homotopy turns that motion into math.</p><p>The central question is not whether two maps are equal point by point, but whether one can be changed into the other through a continuous movie. This is the kind of equality topology loves: flexible, shape-aware, and very useful for detecting holes.</p>",
    "definition": "<p>Two continuous maps $f,g:X\\to Y$ are <b>homotopic</b>, written $f\\simeq g$, if there is a continuous map $H:X\\times[0,1]\\to Y$ with $H(x,0)=f(x)$ and $H(x,1)=g(x)$. The parameter $t\\in[0,1]$ is time, so $H(\\cdot,t)$ is the map at time $t$.</p><p>For paths with fixed endpoints, we additionally require the endpoints to stay fixed during the deformation. Homotopy is an equivalence relation: constant movie gives reflexivity, running the movie backward gives symmetry, and playing two movies in sequence gives transitivity.</p><p><b>Assumptions that matter:</b> the whole movie $H$ must be continuous; fixed-endpoint homotopy keeps endpoints fixed for all $t$; and obstacles in the target space can prevent a deformation even when two curves look close.</p>",
    "worked": {
      "problem": "Show that the two paths $f(s)=(s,0)$ and $g(s)=(s,s)$ from $(0,0)$ to $(1,0)$ and $(1,1)$ in $\\mathbb{R}^2$ are homotopic as maps $[0,1]\\to\\mathbb{R}^2$.",
      "skills": [
        "constructing homotopies",
        "linear interpolation",
        "continuity"
      ],
      "strategy": "In a convex space, interpolate between the two maps point by point.",
      "steps": [
        {
          "do": "Write a candidate homotopy",
          "result": "$H(s,t)=(1-t)f(s)+tg(s)$",
          "why": "linear interpolation starts at $f$ and ends at $g$"
        },
        {
          "do": "Substitute the formulas",
          "result": "$H(s,t)=(1-t)(s,0)+t(s,s)$",
          "why": "use the given paths"
        },
        {
          "do": "Simplify coordinates",
          "result": "$H(s,t)=(s,ts)$",
          "why": "combine coordinate-wise"
        },
        {
          "do": "Check time $0$",
          "result": "$H(s,0)=(s,0)=f(s)$",
          "why": "the movie starts at $f$"
        },
        {
          "do": "Check time $1$",
          "result": "$H(s,1)=(s,s)=g(s)$",
          "why": "the movie ends at $g$"
        },
        {
          "do": "Check continuity",
          "result": "$H$ is continuous",
          "why": "its coordinate functions are polynomials in $s$ and $t$"
        }
      ],
      "verify": "At each time $t$, the path is the line from $(0,0)$ to $(1,t)$, so the deformation moves smoothly.",
      "answer": "A homotopy is $H(s,t)=(s,ts)$, so $f\\simeq g$ as maps into $\\mathbb{R}^2$.",
      "connects": "Homotopy records continuous deformation, not rigid equality."
    },
    "practice": [
      {
        "problem": "Show that any two points $a,b\\in\\mathbb{R}^n$ are joined by a path.",
        "steps": [
          {
            "do": "Define a candidate path",
            "result": "$p(t)=(1-t)a+tb$",
            "why": "linear interpolation moves from $a$ to $b$"
          },
          {
            "do": "Evaluate at $t=0$",
            "result": "$p(0)=a$",
            "why": "the path starts at $a$"
          },
          {
            "do": "Evaluate at $t=1$",
            "result": "$p(1)=b$",
            "why": "the path ends at $b$"
          },
          {
            "do": "Check continuity",
            "result": "$p$ is continuous",
            "why": "coordinate functions are linear"
          },
          {
            "do": "Conclude",
            "result": "$\\mathbb{R}^n$ is path connected",
            "why": "every pair of points has such a path"
          }
        ],
        "answer": "The path $p(t)=(1-t)a+tb$ connects $a$ to $b$."
      },
      {
        "problem": "Show that the maps $f(x)=x$ and $g(x)=0$ from $[0,1]$ to $\\mathbb{R}$ are homotopic.",
        "steps": [
          {
            "do": "Choose interpolation",
            "result": "$H(x,t)=(1-t)x+t\\cdot0$",
            "why": "move each output toward zero"
          },
          {
            "do": "Simplify",
            "result": "$H(x,t)=(1-t)x$",
            "why": "the second term vanishes"
          },
          {
            "do": "Check $t=0$",
            "result": "$H(x,0)=x$",
            "why": "this is $f$"
          },
          {
            "do": "Check $t=1$",
            "result": "$H(x,1)=0$",
            "why": "this is $g$"
          },
          {
            "do": "Check continuity",
            "result": "$H$ is continuous",
            "why": "multiplication and subtraction are continuous"
          }
        ],
        "answer": "They are homotopic by $H(x,t)=(1-t)x$."
      },
      {
        "problem": "For paths in $\\mathbb{R}^2$, homotope $f(s)=(s,0)$ to $g(s)=(s,1)$ without fixing endpoints.",
        "steps": [
          {
            "do": "Use interpolation",
            "result": "$H(s,t)=(1-t)(s,0)+t(s,1)$",
            "why": "slide the segment upward"
          },
          {
            "do": "Simplify",
            "result": "$H(s,t)=(s,t)$",
            "why": "coordinate-wise combination"
          },
          {
            "do": "Check start",
            "result": "$H(s,0)=(s,0)$",
            "why": "this is $f$"
          },
          {
            "do": "Check end",
            "result": "$H(s,1)=(s,1)$",
            "why": "this is $g$"
          },
          {
            "do": "Observe endpoints",
            "result": "$H(0,t)=(0,t)$ and $H(1,t)=(1,t)$",
            "why": "endpoints move because this is not fixed-endpoint homotopy"
          }
        ],
        "answer": "A homotopy is $H(s,t)=(s,t)$."
      },
      {
        "problem": "Explain why the unit circle loop $\\ell(s)=(\\cos 2\\pi s,\\sin 2\\pi s)$ is homotopic to a constant loop in $\\mathbb{R}^2$.",
        "steps": [
          {
            "do": "Choose the constant point",
            "result": "$c(s)=(0,0)$",
            "why": "the plane includes the disk inside the circle"
          },
          {
            "do": "Shrink radially",
            "result": "$H(s,t)=(1-t)\\ell(s)$",
            "why": "multiply the loop radius by $1-t$"
          },
          {
            "do": "Check start",
            "result": "$H(s,0)=\\ell(s)$",
            "why": "radius is $1$"
          },
          {
            "do": "Check end",
            "result": "$H(s,1)=(0,0)$",
            "why": "radius is $0$"
          },
          {
            "do": "Check the target",
            "result": "$H(s,t)\\in\\mathbb{R}^2$",
            "why": "the plane has no missing center blocking the shrink"
          }
        ],
        "answer": "In $\\mathbb{R}^2$, the loop contracts to a point by $H(s,t)=(1-t)\\ell(s)$."
      },
      {
        "problem": "A path in embedding space moves from vector $u=(1,0)$ to $v=(0,1)$. Give a straight-line homotopy from the constant map at $u$ to the constant map at $v$.",
        "steps": [
          {
            "do": "Define the first constant map",
            "result": "$f(x)=u$",
            "why": "every input maps to $(1,0)$"
          },
          {
            "do": "Define the second constant map",
            "result": "$g(x)=v$",
            "why": "every input maps to $(0,1)$"
          },
          {
            "do": "Interpolate",
            "result": "$H(x,t)=(1-t)u+tv$",
            "why": "embedding space is treated as Euclidean"
          },
          {
            "do": "Compute coordinates",
            "result": "$H(x,t)=(1-t,t)$",
            "why": "combine the vectors"
          },
          {
            "do": "Check endpoints in time",
            "result": "$H(x,0)=(1,0)$ and $H(x,1)=(0,1)$",
            "why": "the movie starts and ends correctly"
          }
        ],
        "answer": "Use $H(x,t)=(1-t,t)$."
      }
    ],
    "applications": [
      {
        "title": "Deformation in robot planning",
        "background": "Robotics cares whether one path can slide into another without crossing an obstacle.",
        "numbers": "In an empty square, paths from $(0,0)$ to $(1,1)$ can interpolate linearly; at $t=0.5$, midpoint between paths is the average of coordinates."
      },
      {
        "title": "Contractible feature spaces",
        "background": "If a data domain is convex, every loop can shrink, so homotopy sees no hole.",
        "numbers": "A loop of radius $1$ in the full plane shrinks to radius $0.3$ at time $t=0.7$ using radius $1-t$."
      },
      {
        "title": "Obstacles create classes",
        "background": "Removing an obstacle can make loops non-homotopic because they cannot pass through the missing region.",
        "numbers": "A circle of radius $1$ around the origin in $\\mathbb{R}^2\\setminus\\{0\\}$ cannot use the radial shrink after radius reaches $0$."
      },
      {
        "title": "Morphing shapes",
        "background": "Computer graphics blends one shape into another through a continuous movie, the practical cousin of homotopy.",
        "numbers": "Vertex $(2,0)$ moved to $(2,3)$ by interpolation is at $(2,1.2)$ when $t=0.4$."
      },
      {
        "title": "Optimization paths",
        "background": "Training traces a path through parameter space; homotopy language separates path shape from exact timing.",
        "numbers": "A two-step path $(0,0)\\to(1,0)\\to(1,1)$ can be deformed to the straight path $(t,t)$ in a convex square."
      },
      {
        "title": "Topological data analysis",
        "background": "Persistent loops are meaningful because they resist being filled in by a homotopy within the observed space.",
        "numbers": "Eight points around a circle of radius $1$ suggest a loop; adding a center point lets triangles fill it and makes contraction possible."
      }
    ],
    "applicationsClose": "Homotopy is topology's patient movie camera: it watches whether a shape can change continuously without tearing through forbidden places.",
    "takeaways": [
      "A homotopy is a continuous deformation $H:X\\times[0,1]\\to Y$ from one map to another.",
      "Linear interpolation gives homotopies in convex spaces.",
      "Fixed-endpoint homotopy is stricter because endpoints must stay still.",
      "Holes and obstacles are detected by homotopies that cannot exist."
    ]
  },
  "math-13-13": {
    "id": "math-13-13",
    "title": "The fundamental group",
    "tagline": "The fundamental group turns loops based at a point into algebra that can count holes.",
    "connections": {
      "buildsOn": [
        "homotopy",
        "loops",
        "groups"
      ],
      "leadsTo": [
        "covering spaces",
        "homology groups",
        "topological invariants"
      ],
      "usedWith": [
        "path composition",
        "identity elements",
        "inverses"
      ]
    },
    "motivation": "<p>You already know that a loop can go around a hole once, twice, or not at all. The <b>fundamental group</b> makes that intuition algebraic.</p><p>We fix a base point, look at loops that start and end there, and treat two loops as the same when one can be deformed into the other while keeping the base point fixed. Composition is just doing one loop after another.</p>",
    "definition": "<p>For a topological space $X$ with base point $x_0$, the <b>fundamental group</b> $\\pi_1(X,x_0)$ is the set of fixed-endpoint homotopy classes of loops $\\ell:[0,1]\\to X$ with $\\ell(0)=\\ell(1)=x_0$. The product $[\\ell][m]$ is the class of the loop that travels $\\ell$ first and then $m$.</p><p>The constant loop is the identity because doing nothing before or after a loop changes only the timing. The inverse of a loop is the same loop run backward. Associativity holds up to reparameterization, which homotopy ignores.</p><p><b>Assumptions that matter:</b> loops share the same base point; homotopies keep that base point fixed; path-connected spaces have isomorphic fundamental groups at different base points, but the isomorphism depends on a connecting path; and $\\pi_1$ can be nonabelian in complicated spaces.</p>",
    "worked": {
      "problem": "Compute the product of winding numbers for two loops in $S^1$: one winds $2$ times and the next winds $-1$ time.",
      "skills": [
        "winding numbers",
        "loop composition",
        "group operation"
      ],
      "strategy": "For the circle, $\\pi_1(S^1)\\cong\\mathbb{Z}$ and composition adds winding numbers.",
      "steps": [
        {
          "do": "Name the invariant",
          "result": "$\\pi_1(S^1)\\cong\\mathbb{Z}$",
          "why": "circle loops are classified by winding number"
        },
        {
          "do": "Record the first loop",
          "result": "$2$",
          "why": "it goes around counterclockwise twice"
        },
        {
          "do": "Record the second loop",
          "result": "$-1$",
          "why": "negative means once clockwise"
        },
        {
          "do": "Compose the loops",
          "result": "$2+(-1)=1$",
          "why": "circle loop composition adds winding numbers"
        },
        {
          "do": "Interpret",
          "result": "one counterclockwise winding remains",
          "why": "the clockwise loop cancels one of the two positive turns"
        }
      ],
      "verify": "A loop followed by its reverse has winding $1+(-1)=0$, matching the identity class.",
      "answer": "The product has winding number $1$.",
      "connects": "The fundamental group converts loop composition into a group calculation."
    },
    "practice": [
      {
        "problem": "What is the identity element in $\\pi_1(X,x_0)$?",
        "steps": [
          {
            "do": "Identify the special loop",
            "result": "$c(t)=x_0$",
            "why": "the loop stays at the base point"
          },
          {
            "do": "Compose before a loop $\\ell$",
            "result": "$c*\\ell$",
            "why": "first wait, then travel"
          },
          {
            "do": "Compare with $\\ell$",
            "result": "$[c*\\ell]=[\\ell]$",
            "why": "reparameterizing time removes the waiting"
          },
          {
            "do": "Compose after $\\ell$",
            "result": "$[\\ell*c]=[\\ell]$",
            "why": "waiting at the end also changes only timing"
          },
          {
            "do": "State the identity",
            "result": "$[c]$",
            "why": "it leaves every class unchanged"
          }
        ],
        "answer": "The identity is the homotopy class of the constant loop at $x_0$."
      },
      {
        "problem": "If a loop on $S^1$ has winding number $3$, what is the winding number of its inverse?",
        "steps": [
          {
            "do": "Record the loop",
            "result": "$3$",
            "why": "three counterclockwise turns"
          },
          {
            "do": "Define the inverse",
            "result": "run the loop backward",
            "why": "group inverse reverses traversal"
          },
          {
            "do": "Change the sign",
            "result": "$-3$",
            "why": "backward traversal reverses orientation"
          },
          {
            "do": "Add to check",
            "result": "$3+(-3)=0$",
            "why": "a loop followed by its inverse is identity"
          },
          {
            "do": "Interpret identity",
            "result": "$0$ windings",
            "why": "zero means contractible on the circle only as a based group identity class"
          }
        ],
        "answer": "The inverse has winding number $-3$."
      },
      {
        "problem": "In $\\mathbb{R}^2$, what is $\\pi_1(\\mathbb{R}^2,(0,0))$?",
        "steps": [
          {
            "do": "Use contractibility",
            "result": "$\\mathbb{R}^2$ contracts to $(0,0)$",
            "why": "radial shrinking is allowed"
          },
          {
            "do": "Take any loop $\\ell$",
            "result": "$\\ell(t)\\in\\mathbb{R}^2$",
            "why": "loops have no obstacle"
          },
          {
            "do": "Shrink it",
            "result": "$H(s,u)=(1-u)\\ell(s)$",
            "why": "move all points toward the origin"
          },
          {
            "do": "End at the constant loop",
            "result": "$H(s,1)=(0,0)$",
            "why": "the loop becomes trivial"
          },
          {
            "do": "State the group",
            "result": "trivial group",
            "why": "all loops are homotopic to the identity"
          }
        ],
        "answer": "$\\pi_1(\\mathbb{R}^2,(0,0))$ is the trivial group."
      },
      {
        "problem": "A loop in $\\mathbb{R}^2\\setminus\\{0\\}$ winds once counterclockwise, then twice clockwise. What class in $\\pi_1$ does it represent?",
        "steps": [
          {
            "do": "Use the known group",
            "result": "$\\pi_1(\\mathbb{R}^2\\setminus\\{0\\})\\cong\\mathbb{Z}$",
            "why": "punctured plane has circle-like loops"
          },
          {
            "do": "Record the first part",
            "result": "$+1$",
            "why": "counterclockwise once"
          },
          {
            "do": "Record the second part",
            "result": "$-2$",
            "why": "clockwise twice"
          },
          {
            "do": "Add windings",
            "result": "$1-2=-1$",
            "why": "composition adds integers"
          },
          {
            "do": "Interpret",
            "result": "one clockwise winding",
            "why": "net winding is negative one"
          }
        ],
        "answer": "The loop represents class $-1$."
      },
      {
        "problem": "A circular sensor path samples angles $0,\\pi/2,\\pi,3\\pi/2,2\\pi$. What winding number does it suggest?",
        "steps": [
          {
            "do": "Start angle",
            "result": "$0$",
            "why": "base point at one full-turn coordinate"
          },
          {
            "do": "End angle",
            "result": "$2\\pi$",
            "why": "the angle increases by one full turn"
          },
          {
            "do": "Compute total change",
            "result": "$2\\pi-0=2\\pi$",
            "why": "winding compares angle change to a full turn"
          },
          {
            "do": "Divide by $2\\pi$",
            "result": "$1$",
            "why": "one full turn"
          },
          {
            "do": "Interpret",
            "result": "winding number $1$",
            "why": "the sampled loop goes once counterclockwise"
          }
        ],
        "answer": "The suggested winding number is $1$."
      }
    ],
    "applications": [
      {
        "title": "Detecting holes",
        "background": "The fundamental group distinguishes a disk from a punctured disk because loops around the missing point cannot shrink.",
        "numbers": "A loop with angle change $2\\pi$ has winding $1$; in a disk with the center present it can shrink, but in a punctured disk it cannot."
      },
      {
        "title": "Robot motion around obstacles",
        "background": "Path classes tell planners whether routes go around obstacles in different ways.",
        "numbers": "A route with winding $0$ around a pole can shrink away; winding $1$ wraps once and must cross the pole to become winding $0$."
      },
      {
        "title": "Phase unwrapping",
        "background": "Signal processing tracks how many times an angle wraps around the circle.",
        "numbers": "Angles $0,1.5,3.1,4.7,6.3$ have total change about $6.3$, so winding is about $6.3/(2\\pi)\\approx1.00$."
      },
      {
        "title": "Configuration spaces",
        "background": "A rotating joint has circle topology, and loop classes count full rotations of the joint.",
        "numbers": "Moving from $0$ through $4\\pi$ and back to the same physical pose represents winding $2$."
      },
      {
        "title": "Topological signatures",
        "background": "In data analysis, loop-like structure motivates invariants beyond connected components.",
        "numbers": "Points on a ring with no center suggest one independent loop, consistent with a nontrivial $\\pi_1$ pattern."
      },
      {
        "title": "Complex-valued models",
        "background": "Some models use phases on the unit circle; tracking phase loops can reveal discontinuities or vortices.",
        "numbers": "If phase around a square changes by $\\pi/2$ on each side, total change is $2\\pi$, giving index $1$."
      }
    ],
    "applicationsClose": "The fundamental group is loop memory: it remembers how paths wrap when ordinary coordinates forget.",
    "takeaways": [
      "$\\pi_1(X,x_0)$ is built from based loops modulo fixed-endpoint homotopy.",
      "Loop composition gives the group operation; the constant loop is the identity.",
      "For the circle, the fundamental group is $\\mathbb{Z}$ via winding number.",
      "Nonzero winding detects a hole that a loop cannot cross."
    ]
  },
  "math-13-14": {
    "id": "math-13-14",
    "title": "Covering spaces",
    "tagline": "A covering space unwraps a space locally, so every small neighborhood looks like separate stacked copies.",
    "connections": {
      "buildsOn": [
        "the fundamental group",
        "quotient spaces",
        "continuous maps"
      ],
      "leadsTo": [
        "deck transformations",
        "universal covers",
        "fiber bundles"
      ],
      "usedWith": [
        "local homeomorphisms",
        "path lifting",
        "winding numbers"
      ]
    },
    "motivation": "<p>You have seen maps that wrap: the real line can wind around a circle by sending $t$ to angle $2\\pi t$. Nearby points behave simply, but globally the line covers the circle over and over.</p><p>A <b>covering space</b> makes this precise. It is a map that looks like many separate copies over every small open patch. That local simplicity is why covering spaces explain winding numbers and lift circular motion to straight-line motion.</p>",
    "definition": "<p>A continuous surjection $p:E\\to B$ is a <b>covering map</b> if every point $b\\in B$ has an open neighborhood $U$ such that $p^{-1}(U)$ is a disjoint union of open sets in $E$, and each piece maps homeomorphically onto $U$ by $p$. The space $E$ is a covering space of $B$.</p><p>The standard example is $p:\\mathbb{R}\\to S^1$ given by $p(t)=(\\cos 2\\pi t,\\sin 2\\pi t)$. A short arc on the circle lifts to infinitely many short intervals on the line, one near each integer translate.</p><p><b>Assumptions that matter:</b> covering maps are local, not necessarily one-to-one globally; neighborhoods must be evenly covered; path lifting needs a chosen starting point in the fiber; and connected covering spaces encode subgroups of the fundamental group under good hypotheses.</p>",
    "worked": {
      "problem": "For $p(t)=(\\cos2\\pi t,\\sin2\\pi t)$, lift the circle loop $\\ell(s)=(\\cos2\\pi s,\\sin2\\pi s)$ starting at $\\tilde\\ell(0)=0$.",
      "skills": [
        "covering maps",
        "path lifting",
        "winding"
      ],
      "strategy": "Match the angle of the loop with a real-valued lifted coordinate.",
      "steps": [
        {
          "do": "Write the covering map",
          "result": "$p(t)=(\\cos2\\pi t,\\sin2\\pi t)$",
          "why": "one unit on the line is one full circle turn"
        },
        {
          "do": "Compare with the loop",
          "result": "$\\ell(s)=(\\cos2\\pi s,\\sin2\\pi s)$",
          "why": "the loop uses the same angle formula"
        },
        {
          "do": "Choose the lift",
          "result": "$\\tilde\\ell(s)=s$",
          "why": "this starts at $0$ and has the right angle"
        },
        {
          "do": "Check the projection",
          "result": "$p(\\tilde\\ell(s))=p(s)=\\ell(s)$",
          "why": "the lifted path maps down to the loop"
        },
        {
          "do": "Compute the endpoint",
          "result": "$\\tilde\\ell(1)=1$",
          "why": "one circle winding lifts from $0$ to $1$"
        }
      ],
      "verify": "The endpoint changed by $1$, exactly the loop's winding number.",
      "answer": "The lift is $\\tilde\\ell(s)=s$, starting at $0$ and ending at $1$.",
      "connects": "Covering spaces turn circular winding into ordinary displacement upstairs."
    },
    "practice": [
      {
        "problem": "For the same covering map, lift the constant loop at $(1,0)$ starting at $2$.",
        "steps": [
          {
            "do": "Identify the base point",
            "result": "$p(2)=(1,0)$",
            "why": "integers map to angle $0$"
          },
          {
            "do": "Choose a constant lift",
            "result": "$\\tilde c(s)=2$",
            "why": "the lift must start at $2$"
          },
          {
            "do": "Project it",
            "result": "$p(\\tilde c(s))=p(2)=(1,0)$",
            "why": "constant upstairs maps to constant downstairs"
          },
          {
            "do": "Check the start",
            "result": "$\\tilde c(0)=2$",
            "why": "the chosen fiber point is respected"
          },
          {
            "do": "Check the endpoint",
            "result": "$\\tilde c(1)=2$",
            "why": "zero winding gives no displacement"
          }
        ],
        "answer": "The lift is $\\tilde c(s)=2$."
      },
      {
        "problem": "Lift a circle loop of winding $3$ starting at $0$.",
        "steps": [
          {
            "do": "Write the downstairs loop",
            "result": "$\\ell(s)=(\\cos6\\pi s,\\sin6\\pi s)$",
            "why": "winding $3$ uses angle $2\\pi\\cdot3s$"
          },
          {
            "do": "Choose the lift",
            "result": "$\\tilde\\ell(s)=3s$",
            "why": "the real coordinate records turns"
          },
          {
            "do": "Check projection",
            "result": "$p(3s)=(\\cos6\\pi s,\\sin6\\pi s)$",
            "why": "projection matches the loop"
          },
          {
            "do": "Check start",
            "result": "$\\tilde\\ell(0)=0$",
            "why": "the starting lift is correct"
          },
          {
            "do": "Find endpoint",
            "result": "$\\tilde\\ell(1)=3$",
            "why": "three turns move three sheets"
          }
        ],
        "answer": "The lifted path is $\\tilde\\ell(s)=3s$ and ends at $3$."
      },
      {
        "problem": "Under $p(t)=e^{2\\pi i t}$, what points in $\\mathbb{R}$ lie over $(1,0)$?",
        "steps": [
          {
            "do": "Set the circle point",
            "result": "$p(t)=(1,0)$",
            "why": "this means angle is a full integer turn"
          },
          {
            "do": "Translate to cosine and sine",
            "result": "$\\cos2\\pi t=1$ and $\\sin2\\pi t=0$",
            "why": "coordinates of $(1,0)$"
          },
          {
            "do": "Solve the angle condition",
            "result": "$2\\pi t=2\\pi k$",
            "why": "full turns land at $(1,0)$"
          },
          {
            "do": "Divide by $2\\pi$",
            "result": "$t=k$",
            "why": "the lift coordinate is an integer"
          },
          {
            "do": "State the fiber",
            "result": "$p^{-1}(1,0)=\\mathbb{Z}$",
            "why": "all integer sheets lie above the base point"
          }
        ],
        "answer": "The fiber over $(1,0)$ is $\\mathbb{Z}$."
      },
      {
        "problem": "For the double cover $p:S^1\\to S^1$ given by $p(z)=z^2$, how many points lie over $1$?",
        "steps": [
          {
            "do": "Solve $z^2=1$",
            "result": "$z=1$ or $z=-1$",
            "why": "square roots of $1$ on the unit circle"
          },
          {
            "do": "Count the fiber",
            "result": "$2$ points",
            "why": "a double cover has two sheets"
          },
          {
            "do": "Check both points",
            "result": "$1^2=1$ and $(-1)^2=1$",
            "why": "both project to the base point"
          },
          {
            "do": "Interpret locally",
            "result": "small arcs lift to two small arcs",
            "why": "one near $1$ and one near $-1$"
          },
          {
            "do": "State answer",
            "result": "$p^{-1}(1)=\\{1,-1\\}$",
            "why": "the fiber has exactly two points"
          }
        ],
        "answer": "There are two points over $1$: $1$ and $-1$."
      },
      {
        "problem": "A phase trajectory unwraps from $0.2$ to $2.7$ in the real cover of the circle. What winding change does this represent?",
        "steps": [
          {
            "do": "Compute real displacement",
            "result": "$2.7-0.2=2.5$",
            "why": "the cover coordinate counts turns"
          },
          {
            "do": "Separate integer and fractional parts",
            "result": "$2.5=2+0.5$",
            "why": "two full turns plus half a turn"
          },
          {
            "do": "Read full winding",
            "result": "$2$",
            "why": "integer displacement gives completed windings"
          },
          {
            "do": "Compute final angular offset",
            "result": "$0.5\\cdot2\\pi=\\pi$",
            "why": "half a turn changes phase by $\\pi$"
          },
          {
            "do": "Interpret",
            "result": "two full wraps plus a half-turn",
            "why": "the endpoint is opposite the starting phase"
          }
        ],
        "answer": "The path completes $2$ full windings and ends a half-turn later."
      }
    ],
    "applications": [
      {
        "title": "Phase unwrapping",
        "background": "Signals measured modulo $2\\pi$ become easier to analyze after lifting them to a real-valued cover.",
        "numbers": "Observed phases $6.1,0.1,0.3$ can lift to $6.1,6.383,6.583$, avoiding a fake jump of about $-6.0$."
      },
      {
        "title": "Robot joints",
        "background": "A revolute joint has circular state, but controllers often unwrap it to track total rotations.",
        "numbers": "Angles $350^\\circ$ to $10^\\circ$ are a $20^\\circ$ move, not $-340^\\circ$, after choosing the lifted path."
      },
      {
        "title": "Winding number computation",
        "background": "Covering spaces explain why a lifted endpoint records winding.",
        "numbers": "A loop lift from $0$ to $-2$ has winding $-2$, meaning two clockwise turns."
      },
      {
        "title": "Texture coordinates",
        "background": "Computer graphics maps a covering plane onto repeated textures on a torus or surface.",
        "numbers": "Texture coordinate $u=2.3$ and $u=0.3$ show the same horizontal phase but differ by two repeats."
      },
      {
        "title": "Periodic optimization",
        "background": "Optimizing angles is easier when local steps are lifted to a line and then wrapped back.",
        "numbers": "A gradient step from $6.20$ by $+0.15$ gives lifted $6.35$, which wraps to $0.067$ radians on the circle."
      },
      {
        "title": "Data on circles",
        "background": "Circular measurements such as heading or time can be locally unwrapped before smoothing.",
        "numbers": "Headings $358^\\circ,1^\\circ,4^\\circ$ unwrap to $358^\\circ,361^\\circ,364^\\circ$, a smooth sequence with $3^\\circ$ increments."
      }
    ],
    "applicationsClose": "Covering spaces let us do local straight-line reasoning upstairs while remembering circular or multi-sheeted structure downstairs.",
    "takeaways": [
      "A covering map looks locally like disjoint copies of the base.",
      "The map $\\mathbb{R}\\to S^1$ unwraps the circle into a line.",
      "A lifted loop's endpoint records winding information.",
      "Phase unwrapping and periodic optimization are practical covering-space ideas."
    ]
  },
  "math-13-15": {
    "id": "math-13-15",
    "title": "Simplicial complexes",
    "tagline": "Simplicial complexes build shapes from vertices, edges, triangles, and their higher-dimensional cousins.",
    "connections": {
      "buildsOn": [
        "sets",
        "metric-space topology",
        "graphs"
      ],
      "leadsTo": [
        "homology groups",
        "persistent homology",
        "mesh geometry"
      ],
      "usedWith": [
        "combinatorics",
        "incidence matrices",
        "polyhedra"
      ]
    },
    "motivation": "<p>You already know how a triangle is made from three edges and three vertices. A <b>simplicial complex</b> keeps building from that idea: points, line segments, filled triangles, filled tetrahedra, and so on.</p><p>This combinatorial language is perfect for data. We can start with a cloud of points, connect nearby points, fill triangles when triples are mutually close, and obtain a shape whose holes can be counted algebraically.</p>",
    "definition": "<p>An <b>$k$-simplex</b> is the convex hull of $k+1$ affinely independent vertices: a $0$-simplex is a vertex, a $1$-simplex is an edge, a $2$-simplex is a filled triangle, and a $3$-simplex is a filled tetrahedron. A <b>simplicial complex</b> $K$ is a collection of simplices such that every face of a simplex in $K$ is also in $K$, and the intersection of any two simplices is a common face or empty.</p><p>The face rule is essential: if a filled triangle $[a,b,c]$ is present, then its three edges and three vertices must be present too. That rule lets boundary maps and homology be defined cleanly.</p><p><b>Assumptions that matter:</b> a simplex includes its interior; complexes are closed under taking faces; vertex order matters for oriented calculations but not for the underlying shape; and data-built complexes depend strongly on the distance threshold.</p>",
    "worked": {
      "problem": "A complex has vertices $a,b,c$ and the filled triangle $[a,b,c]$. List all simplices and compute the Euler characteristic $\\chi=V-E+F$.",
      "skills": [
        "faces",
        "counting simplices",
        "Euler characteristic"
      ],
      "strategy": "A filled triangle forces all lower-dimensional faces to be included.",
      "steps": [
        {
          "do": "List vertices",
          "result": "$a,b,c$",
          "why": "these are the three $0$-simplices"
        },
        {
          "do": "Count vertices",
          "result": "$V=3$",
          "why": "there are three vertices"
        },
        {
          "do": "List edges",
          "result": "$[a,b],[b,c],[a,c]$",
          "why": "all triangle faces of dimension $1$ are included"
        },
        {
          "do": "Count edges",
          "result": "$E=3$",
          "why": "there are three sides"
        },
        {
          "do": "List filled faces",
          "result": "$[a,b,c]$",
          "why": "the triangle itself is one $2$-simplex"
        },
        {
          "do": "Compute Euler characteristic",
          "result": "$\\chi=3-3+1=1$",
          "why": "use $V-E+F$"
        }
      ],
      "verify": "A filled triangle is topologically a disk, and a disk has Euler characteristic $1$.",
      "answer": "The simplices are $3$ vertices, $3$ edges, and $1$ filled triangle; $\\chi=1$.",
      "connects": "Simplicial complexes turn geometry into countable building blocks."
    },
    "practice": [
      {
        "problem": "A graph complex has vertices $1,2,3$ and edges $[1,2]$, $[2,3]$. List its simplices and compute $\\chi$.",
        "steps": [
          {
            "do": "List vertices",
            "result": "$1,2,3$",
            "why": "given vertices are $0$-simplices"
          },
          {
            "do": "Count vertices",
            "result": "$V=3$",
            "why": "three vertices"
          },
          {
            "do": "List edges",
            "result": "$[1,2]$ and $[2,3]$",
            "why": "given edges are $1$-simplices"
          },
          {
            "do": "Count edges",
            "result": "$E=2$",
            "why": "two edges"
          },
          {
            "do": "Count filled triangles",
            "result": "$F=0$",
            "why": "no $2$-simplex is listed"
          },
          {
            "do": "Compute",
            "result": "$\\chi=3-2+0=1$",
            "why": "apply $V-E+F$"
          }
        ],
        "answer": "The complex has $\\chi=1$."
      },
      {
        "problem": "Four vertices form a square boundary with no diagonal and no filled face. Compute $V$, $E$, $F$, and $\\chi$.",
        "steps": [
          {
            "do": "Count vertices",
            "result": "$V=4$",
            "why": "four corners"
          },
          {
            "do": "Count boundary edges",
            "result": "$E=4$",
            "why": "one edge per side"
          },
          {
            "do": "Count filled faces",
            "result": "$F=0$",
            "why": "the square interior is not filled by triangles"
          },
          {
            "do": "Compute Euler characteristic",
            "result": "$\\chi=4-4+0=0$",
            "why": "use alternating counts"
          },
          {
            "do": "Interpret",
            "result": "one loop",
            "why": "a circle-like boundary has Euler characteristic $0$"
          }
        ],
        "answer": "$V=4$, $E=4$, $F=0$, and $\\chi=0$."
      },
      {
        "problem": "If a complex contains edge $[u,v]$, what faces must it contain?",
        "steps": [
          {
            "do": "Identify the simplex",
            "result": "$[u,v]$ is a $1$-simplex",
            "why": "it has two vertices"
          },
          {
            "do": "List its proper faces",
            "result": "$[u]$ and $[v]$",
            "why": "faces come from subsets of vertices"
          },
          {
            "do": "Apply the face rule",
            "result": "$[u]$ and $[v]$ must be in the complex",
            "why": "complexes are closed under faces"
          },
          {
            "do": "Include the edge",
            "result": "$[u,v]$ remains in the complex",
            "why": "the simplex itself is also present"
          },
          {
            "do": "State the required set",
            "result": "$[u]$, $[v]$, and $[u,v]$",
            "why": "these are the necessary simplices"
          }
        ],
        "answer": "It must contain the two endpoint vertices $[u]$ and $[v]$."
      },
      {
        "problem": "A tetrahedron includes vertices, edges, triangular faces, and one filled $3$-simplex. Count $V$, $E$, $F$, $T$ and compute $V-E+F-T$.",
        "steps": [
          {
            "do": "Count vertices",
            "result": "$V=4$",
            "why": "a tetrahedron has four corners"
          },
          {
            "do": "Count edges",
            "result": "$E=\\binom42=6$",
            "why": "choose two vertices for an edge"
          },
          {
            "do": "Count triangular faces",
            "result": "$F=\\binom43=4$",
            "why": "choose three vertices for a face"
          },
          {
            "do": "Count tetrahedra",
            "result": "$T=1$",
            "why": "there is one filled $3$-simplex"
          },
          {
            "do": "Compute alternating sum",
            "result": "$4-6+4-1=1$",
            "why": "filled ball-like objects have Euler characteristic $1$"
          }
        ],
        "answer": "$V=4$, $E=6$, $F=4$, $T=1$, so the alternating sum is $1$."
      },
      {
        "problem": "Four data points have distances $d(1,2)=0.4$, $d(2,3)=0.5$, $d(1,3)=0.7$, and all distances to point $4$ exceed $1.2$. In a Vietoris-Rips complex at threshold $0.6$, which edges appear?",
        "steps": [
          {
            "do": "Apply the threshold to $d(1,2)$",
            "result": "$0.4\\le0.6$",
            "why": "edge $[1,2]$ appears"
          },
          {
            "do": "Apply the threshold to $d(2,3)$",
            "result": "$0.5\\le0.6$",
            "why": "edge $[2,3]$ appears"
          },
          {
            "do": "Apply the threshold to $d(1,3)$",
            "result": "$0.7>0.6$",
            "why": "edge $[1,3]$ does not appear"
          },
          {
            "do": "Check point $4$",
            "result": "all distances exceed $1.2>0.6$",
            "why": "no edge touches point $4$"
          },
          {
            "do": "List edges",
            "result": "$[1,2]$ and $[2,3]$",
            "why": "only pairs within threshold are connected"
          }
        ],
        "answer": "The edges are $[1,2]$ and $[2,3]$; point $4$ is isolated."
      }
    ],
    "applications": [
      {
        "title": "Mesh models",
        "background": "Computer graphics stores surfaces as triangle meshes, which are simplicial complexes in practical form.",
        "numbers": "A mesh with $1000$ vertices, $2994$ edges, and $1996$ triangular faces has $\\chi=1000-2994+1996=2$, sphere-like."
      },
      {
        "title": "Vietoris-Rips complexes",
        "background": "TDA often builds a complex from data by connecting points whose pairwise distances are below a scale.",
        "numbers": "Three points with all pairwise distances at most $0.5$ form a filled triangle at threshold $0.5$."
      },
      {
        "title": "Network clique complexes",
        "background": "A graph can become a complex by filling every clique, letting triangles in a network count as filled relations.",
        "numbers": "A $4$-clique contributes $4$ vertices, $6$ edges, $4$ triangles, and $1$ tetrahedron."
      },
      {
        "title": "Finite-element methods",
        "background": "Engineering simulations divide domains into simple pieces so equations can be solved locally.",
        "numbers": "A square split by one diagonal has $4$ vertices, $5$ edges, and $2$ triangles, so $\\chi=1$."
      },
      {
        "title": "Image segmentation",
        "background": "Pixel grids can be converted to cubical or simplicial complexes to analyze connected regions and holes.",
        "numbers": "A $2\\times2$ block of active pixels has one connected component and no central hole after filling the four squares."
      },
      {
        "title": "Sensor coverage",
        "background": "Coverage problems model sensors as disks and approximate their nerve by simplicial complexes.",
        "numbers": "If three sensors pairwise overlap and share a common overlap, their nerve includes one filled triangle."
      }
    ],
    "applicationsClose": "Simplicial complexes are the bridge from finite data and meshes to the algebraic tools that measure shape.",
    "takeaways": [
      "A $k$-simplex has $k+1$ vertices.",
      "A simplicial complex must include every face of each simplex.",
      "Euler characteristic is an alternating count of simplices.",
      "Data complexes depend on a scale parameter, which persistent homology will vary."
    ]
  },
  "math-13-16": {
    "id": "math-13-16",
    "title": "Homology groups",
    "tagline": "Homology counts holes by comparing cycles with boundaries.",
    "connections": {
      "buildsOn": [
        "simplicial complexes",
        "linear algebra",
        "groups"
      ],
      "leadsTo": [
        "persistent homology",
        "Betti numbers",
        "topological features"
      ],
      "usedWith": [
        "boundary maps",
        "cycles",
        "quotient groups"
      ]
    },
    "motivation": "<p>You can often see a hole before you can prove it: a square outline has a loop, while a filled square does not. <b>Homology</b> gives a careful algebraic test for that difference.</p><p>The idea is beautifully economical. First find cycles, chains with no boundary. Then ignore cycles that are themselves boundaries of higher-dimensional pieces. What remains is the hole information.</p>",
    "definition": "<p>For a simplicial complex, the chain group $C_n$ is the free abelian group generated by oriented $n$-simplices. The boundary map $\\partial_n:C_n\\to C_{n-1}$ sends each simplex to its oriented boundary. The <b>cycle group</b> is $Z_n=\\ker\\partial_n$, the chains with zero boundary. The <b>boundary group</b> is $B_n=\\operatorname{im}\\partial_{n+1}$, the cycles that bound higher-dimensional chains. The homology group is $$H_n=Z_n/B_n.$$</p><p>The crucial identity is $\\partial_n\\partial_{n+1}=0$: the boundary of a boundary cancels. For a triangle, the boundary edges have endpoints that appear once positive and once negative, so the total boundary of that boundary is zero.</p><p><b>Assumptions that matter:</b> orientations determine signs but not Betti numbers; coefficients may be integers or a field such as $\\mathbb{Z}_2$; $H_0$ counts connected components; $H_1$ counts one-dimensional holes when using field coefficients through its rank.</p>",
    "worked": {
      "problem": "Compute $H_1$ over $\\mathbb{Z}_2$ for a triangle boundary with three vertices and three edges but no filled triangle.",
      "skills": [
        "cycles",
        "boundaries",
        "Betti numbers"
      ],
      "strategy": "Find the edge cycle, then check whether any filled $2$-simplex makes it a boundary.",
      "steps": [
        {
          "do": "Count edges",
          "result": "$C_1$ has dimension $3$",
          "why": "there are three independent edge generators over $\\mathbb{Z}_2$"
        },
        {
          "do": "Form the full boundary loop",
          "result": "$e_{12}+e_{23}+e_{31}$",
          "why": "each vertex touches two selected edges"
        },
        {
          "do": "Take its boundary",
          "result": "$0$",
          "why": "over $\\mathbb{Z}_2$, each vertex appears twice and cancels"
        },
        {
          "do": "Identify $Z_1$",
          "result": "$Z_1$ has dimension $1$",
          "why": "the connected triangle graph has one independent cycle"
        },
        {
          "do": "Check $2$-simplices",
          "result": "none",
          "why": "there is no filled triangle"
        },
        {
          "do": "Identify $B_1$",
          "result": "$B_1=0$",
          "why": "no $2$-chain can have the loop as boundary"
        },
        {
          "do": "Compute homology",
          "result": "$H_1=Z_1/B_1\\cong\\mathbb{Z}_2$",
          "why": "one nonbounding cycle remains"
        }
      ],
      "verify": "A triangle outline is circle-like, so one $1$-dimensional hole is expected.",
      "answer": "$H_1\\cong\\mathbb{Z}_2$, with Betti number $\\beta_1=1$.",
      "connects": "Homology detects the loop because it is a cycle but not a boundary."
    },
    "practice": [
      {
        "problem": "Compute $\\beta_0$ for a complex with edges $[1,2]$, $[2,3]$ and isolated vertex $4$.",
        "steps": [
          {
            "do": "Find the first component",
            "result": "$1,2,3$",
            "why": "edges connect these vertices"
          },
          {
            "do": "Find the second component",
            "result": "$4$",
            "why": "no edge touches vertex $4$"
          },
          {
            "do": "Count components",
            "result": "$2$",
            "why": "$H_0$ records connected components"
          },
          {
            "do": "Translate to Betti number",
            "result": "$\\beta_0=2$",
            "why": "over a field, rank of $H_0$ equals component count"
          },
          {
            "do": "State homology shape",
            "result": "$H_0$ has rank $2$",
            "why": "two independent component classes remain"
          }
        ],
        "answer": "$\\beta_0=2$."
      },
      {
        "problem": "A filled triangle has three vertices, three edges, and one $2$-simplex. What is $\\beta_1$?",
        "steps": [
          {
            "do": "Identify the boundary loop",
            "result": "three-edge cycle",
            "why": "the triangle edges form a cycle"
          },
          {
            "do": "Check the filled face",
            "result": "$[1,2,3]$ is present",
            "why": "a $2$-simplex fills the loop"
          },
          {
            "do": "Take its boundary",
            "result": "$\\partial[1,2,3]$ is the three-edge loop",
            "why": "the cycle is a boundary"
          },
          {
            "do": "Compare cycles modulo boundaries",
            "result": "the loop becomes zero in $H_1$",
            "why": "boundaries are quotiented out"
          },
          {
            "do": "State Betti number",
            "result": "$\\beta_1=0$",
            "why": "no one-dimensional hole remains"
          }
        ],
        "answer": "$\\beta_1=0$ for a filled triangle."
      },
      {
        "problem": "A square boundary has $4$ vertices and $4$ edges, with no filled face. For a connected graph, use $\\beta_1=E-V+1$.",
        "steps": [
          {
            "do": "Record vertices",
            "result": "$V=4$",
            "why": "four corners"
          },
          {
            "do": "Record edges",
            "result": "$E=4$",
            "why": "four boundary sides"
          },
          {
            "do": "Use connected graph formula",
            "result": "$\\beta_1=E-V+1$",
            "why": "one component is assumed"
          },
          {
            "do": "Substitute",
            "result": "$\\beta_1=4-4+1$",
            "why": "plug in counts"
          },
          {
            "do": "Compute",
            "result": "$\\beta_1=1$",
            "why": "one independent loop"
          }
        ],
        "answer": "The square boundary has $\\beta_1=1$."
      },
      {
        "problem": "Two disjoint triangle boundaries have no filled faces. Compute $\\beta_0$ and $\\beta_1$.",
        "steps": [
          {
            "do": "Count components",
            "result": "$2$",
            "why": "the two triangles are disjoint"
          },
          {
            "do": "Set $\\beta_0$",
            "result": "$\\beta_0=2$",
            "why": "$H_0$ counts components"
          },
          {
            "do": "Count loops per triangle",
            "result": "$1$ each",
            "why": "each boundary has one nonfilled cycle"
          },
          {
            "do": "Add loop counts",
            "result": "$1+1=2$",
            "why": "homology over disjoint unions adds ranks"
          },
          {
            "do": "Set $\\beta_1$",
            "result": "$\\beta_1=2$",
            "why": "two independent one-dimensional holes"
          }
        ],
        "answer": "$\\beta_0=2$ and $\\beta_1=2$."
      },
      {
        "problem": "A graph built from data has $V=10$, $E=12$, and $C=2$ connected components. Assuming no filled triangles, compute $\\beta_1$.",
        "steps": [
          {
            "do": "Recall graph formula",
            "result": "$\\beta_1=E-V+C$",
            "why": "cycle rank for a graph"
          },
          {
            "do": "Substitute counts",
            "result": "$\\beta_1=12-10+2$",
            "why": "use edges, vertices, and components"
          },
          {
            "do": "Compute",
            "result": "$\\beta_1=4$",
            "why": "four independent graph cycles"
          },
          {
            "do": "Check nonnegativity",
            "result": "$4\\ge0$",
            "why": "cycle ranks cannot be negative"
          },
          {
            "do": "Interpret",
            "result": "four loop features",
            "why": "without filled triangles, graph cycles survive in $H_1$"
          }
        ],
        "answer": "$\\beta_1=4$."
      }
    ],
    "applications": [
      {
        "title": "Connected components",
        "background": "The earliest homology feature is just component counting, used in clustering and segmentation.",
        "numbers": "If a threshold graph has components of sizes $5$, $3$, and $2$, then $\\beta_0=3$."
      },
      {
        "title": "Loop detection",
        "background": "Homology detects ring-like structure in point clouds without choosing a single center.",
        "numbers": "A square boundary with $V=4$ and $E=4$ gives $\\beta_1=1$, signaling one loop."
      },
      {
        "title": "Mesh validation",
        "background": "Graphics and CAD systems check whether a mesh has unexpected holes.",
        "numbers": "A closed sphere-like mesh with $V=100$, $E=294$, $F=196$ has $\\chi=2$, consistent with no handles."
      },
      {
        "title": "Sensor coverage",
        "background": "Coverage holes can be detected from intersection complexes of sensor ranges.",
        "numbers": "If four sensors form a square with adjacent overlaps but no diagonal overlaps, the nerve has $\\beta_1=1$, indicating a coverage gap."
      },
      {
        "title": "Image analysis",
        "background": "Binary images can be studied by components and holes, robust descriptors for shapes.",
        "numbers": "A digit 8 often has one component and two holes, so roughly $\\beta_0=1$, $\\beta_1=2$."
      },
      {
        "title": "Feature engineering",
        "background": "Betti numbers summarize shape as numerical features for downstream models.",
        "numbers": "A dataset snapshot with $\\beta_0=4$ and $\\beta_1=1$ can be encoded as vector $(4,1)$ before classification."
      }
    ],
    "applicationsClose": "Homology turns visible shape questions into algebraic bookkeeping: cycles that do not bound are holes that matter.",
    "takeaways": [
      "Cycles have zero boundary; boundaries come from one dimension higher.",
      "Homology is $H_n=Z_n/B_n$.",
      "$H_0$ counts connected components and $H_1$ counts independent loops over field coefficients.",
      "Filling a loop with a simplex makes that loop vanish in homology."
    ]
  },
  "math-13-17": {
    "id": "math-13-17",
    "title": "Persistent homology",
    "tagline": "Persistent homology watches topological features appear and disappear as the scale changes.",
    "connections": {
      "buildsOn": [
        "homology groups",
        "simplicial complexes",
        "metric-space topology"
      ],
      "leadsTo": [
        "persistence diagrams",
        "TDA pipelines",
        "manifold hypothesis"
      ],
      "usedWith": [
        "filtrations",
        "Betti numbers",
        "barcodes"
      ]
    },
    "motivation": "<p>One scale rarely tells the whole truth. If balls around data points are tiny, every point is alone; if they are huge, everything merges into one blob. The interesting shape lives in how features persist across scales.</p><p><b>Persistent homology</b> turns that movie into birth and death times for components, loops, and higher-dimensional holes. Long lifetimes often signal structure; short lifetimes often signal noise.</p>",
    "definition": "<p>A <b>filtration</b> is a nested sequence of complexes $K_{r_1}\\subseteq K_{r_2}\\subseteq\\cdots$ indexed by scale $r$. Persistent homology tracks how homology classes are born at one scale and die at a later scale. A feature with birth $b$ and death $d$ has persistence $d-b$ and appears as interval $[b,d)$ in a barcode or point $(b,d)$ in a persistence diagram.</p><p>The nesting matters: once a simplex appears, it stays. This lets homology classes be mapped forward from one scale to the next, so we can say that the same feature persists rather than merely recounting from scratch.</p><p><b>Assumptions that matter:</b> the filtration must be nested; thresholds and coefficient fields affect the result; infinite death means a feature never dies within the observed filtration; and persistence is descriptive, not automatic proof that a feature is meaningful.</p>",
    "worked": {
      "problem": "Three points on a line are at positions $0$, $1$, and $3$. In a Vietoris-Rips filtration using edge threshold $r$, find when connected components merge.",
      "skills": [
        "filtrations",
        "components",
        "barcodes"
      ],
      "strategy": "Components are born at $r=0$ and merge when edges appear at pairwise distances.",
      "steps": [
        {
          "do": "List pairwise distances",
          "result": "$d(0,1)=1$, $d(1,3)=2$, $d(0,3)=3$",
          "why": "edges appear when $r$ reaches these values"
        },
        {
          "do": "Start at $r=0$",
          "result": "$3$ components",
          "why": "each point begins alone"
        },
        {
          "do": "Add the first edge",
          "result": "$r=1$ connects $0$ and $1$",
          "why": "the smallest distance is $1$"
        },
        {
          "do": "Update components",
          "result": "$2$ components remain",
          "why": "two points merge into one component"
        },
        {
          "do": "Add the next useful edge",
          "result": "$r=2$ connects $1$ and $3$",
          "why": "this merges the remaining point"
        },
        {
          "do": "Update components",
          "result": "$1$ component remains",
          "why": "all points are connected"
        },
        {
          "do": "Record finite bars",
          "result": "deaths at $1$ and $2$",
          "why": "two components die by merging into older components"
        }
      ],
      "verify": "The edge at distance $3$ appears later but does not change components because all points are already connected.",
      "answer": "There are three $H_0$ births at $0$; two finite component bars die at $r=1$ and $r=2$, and one component persists.",
      "connects": "Persistent homology records not just how many components exist, but how long they survive."
    },
    "practice": [
      {
        "problem": "Four line points $0$, $0.4$, $1.5$, $1.8$ use Rips edge threshold $r$. When do $H_0$ merges occur?",
        "steps": [
          {
            "do": "Compute adjacent distances",
            "result": "$0.4$, $1.1$, and $0.3$",
            "why": "line points merge by nearest gaps first"
          },
          {
            "do": "Sort the useful gaps",
            "result": "$0.3,0.4,1.1$",
            "why": "smallest edges appear first"
          },
          {
            "do": "Start components",
            "result": "$4$",
            "why": "each point is born at $0$"
          },
          {
            "do": "Merge at $r=0.3$",
            "result": "$3$ components",
            "why": "points $1.5$ and $1.8$ connect"
          },
          {
            "do": "Merge at $r=0.4$",
            "result": "$2$ components",
            "why": "points $0$ and $0.4$ connect"
          },
          {
            "do": "Merge at $r=1.1$",
            "result": "$1$ component",
            "why": "the two clusters connect"
          }
        ],
        "answer": "Finite $H_0$ deaths occur at $0.3$, $0.4$, and $1.1$."
      },
      {
        "problem": "A persistence interval has birth $0.6$ and death $1.4$. Compute its persistence and midpoint.",
        "steps": [
          {
            "do": "Subtract birth from death",
            "result": "$1.4-0.6$",
            "why": "persistence is lifetime"
          },
          {
            "do": "Compute lifetime",
            "result": "$0.8$",
            "why": "the feature lasts across $0.8$ units of scale"
          },
          {
            "do": "Add birth and death",
            "result": "$0.6+1.4=2.0$",
            "why": "midpoint averages the endpoints"
          },
          {
            "do": "Divide by $2$",
            "result": "$1.0$",
            "why": "midpoint of the interval"
          },
          {
            "do": "Interpret",
            "result": "bar $[0.6,1.4)$ centered at $1.0$",
            "why": "the feature is most visually centered near scale $1.0$"
          }
        ],
        "answer": "Persistence is $0.8$ and midpoint is $1.0$."
      },
      {
        "problem": "A diagram has $H_1$ points $(0.2,0.25)$, $(0.4,1.3)$, and $(0.9,1.0)$. Which loop is most persistent?",
        "steps": [
          {
            "do": "Compute first lifetime",
            "result": "$0.25-0.2=0.05$",
            "why": "death minus birth"
          },
          {
            "do": "Compute second lifetime",
            "result": "$1.3-0.4=0.9$",
            "why": "death minus birth"
          },
          {
            "do": "Compute third lifetime",
            "result": "$1.0-0.9=0.1$",
            "why": "death minus birth"
          },
          {
            "do": "Compare lifetimes",
            "result": "$0.9$ is largest",
            "why": "largest persistence is farthest from the diagonal"
          },
          {
            "do": "Identify the feature",
            "result": "point $(0.4,1.3)$",
            "why": "it survives the longest"
          }
        ],
        "answer": "The loop born at $0.4$ and dying at $1.3$ is most persistent."
      },
      {
        "problem": "For a triangle of three points with all pairwise distances $1$, describe $H_1$ in a Rips filtration where the filled triangle appears as soon as all three edges appear.",
        "steps": [
          {
            "do": "Start at small $r<1$",
            "result": "three isolated vertices",
            "why": "no edges exist"
          },
          {
            "do": "Reach $r=1$",
            "result": "three edges appear",
            "why": "all pairwise distances equal $1$"
          },
          {
            "do": "Add the $2$-simplex",
            "result": "filled triangle appears at $r=1$",
            "why": "Rips fills cliques"
          },
          {
            "do": "Check loop lifetime",
            "result": "birth and death both at $1$",
            "why": "the loop is filled immediately"
          },
          {
            "do": "Interpret persistence",
            "result": "$0$",
            "why": "no positive-length $H_1$ bar remains"
          }
        ],
        "answer": "The apparent triangle loop has zero persistence in the Rips complex because it is filled immediately."
      },
      {
        "problem": "A noisy circle has one $H_1$ interval $[0.35,1.20)$ and noise intervals $[0.20,0.27)$ and $[0.50,0.56)$. Which should a model keep with a persistence cutoff $0.2$?",
        "steps": [
          {
            "do": "Compute main lifetime",
            "result": "$1.20-0.35=0.85$",
            "why": "long bar"
          },
          {
            "do": "Compute first noise lifetime",
            "result": "$0.27-0.20=0.07$",
            "why": "short bar"
          },
          {
            "do": "Compute second noise lifetime",
            "result": "$0.56-0.50=0.06$",
            "why": "short bar"
          },
          {
            "do": "Compare with cutoff",
            "result": "$0.85>0.2$, while $0.07<0.2$ and $0.06<0.2$",
            "why": "keep only bars above the cutoff"
          },
          {
            "do": "State kept feature",
            "result": "$[0.35,1.20)$",
            "why": "it is the only persistent loop"
          }
        ],
        "answer": "Keep the interval $[0.35,1.20)$ and discard the two short noise intervals."
      }
    ],
    "applications": [
      {
        "title": "Noise filtering",
        "background": "Persistence separates fleeting topological artifacts from longer-lived structure.",
        "numbers": "Bars of lengths $0.03$, $0.05$, and $0.7$ suggest keeping the $0.7$ feature if the cutoff is $0.1$."
      },
      {
        "title": "Clustering across scale",
        "background": "$H_0$ persistence is a multiscale view of hierarchical clustering.",
        "numbers": "Line gaps $0.2$, $0.4$, and $2.0$ produce component deaths at those values, showing a large cluster separation at $2.0$."
      },
      {
        "title": "Shape classification",
        "background": "Persistence diagrams can become features for classifying shapes or point clouds.",
        "numbers": "A circle sample might have one $H_1$ bar of length $0.9$, while a disk sample has no $H_1$ bar longer than $0.1$."
      },
      {
        "title": "Sensor networks",
        "background": "Persistent holes can identify coverage gaps that remain over a range of communication radii.",
        "numbers": "A hole bar $[15,40)$ meters lasts $25$ meters of radius, stronger evidence than a bar $[15,17)$."
      },
      {
        "title": "Molecular data",
        "background": "TDA has been used to summarize geometry in proteins and materials where loops and cavities matter.",
        "numbers": "A cavity born at radius $1.2$ angstroms and dying at $2.8$ has persistence $1.6$ angstroms."
      },
      {
        "title": "Model diagnostics",
        "background": "Embeddings can be probed for loops, branches, or disconnected clusters across scales.",
        "numbers": "If class embeddings have $H_0$ deaths mostly below $0.3$ except one at $1.5$, the class may contain two separated subgroups."
      }
    ],
    "applicationsClose": "Persistent homology adds time to homology: features matter not only because they exist, but because they endure.",
    "takeaways": [
      "A filtration is a nested sequence of complexes indexed by scale.",
      "A persistence interval $[b,d)$ has lifetime $d-b$.",
      "Long bars often represent stable structure; short bars often represent noise.",
      "$H_0$ persistence mirrors hierarchical clustering, while $H_1$ persistence tracks loops."
    ]
  },
  "math-13-18": {
    "id": "math-13-18",
    "title": "The manifold hypothesis & TDA",
    "tagline": "The manifold hypothesis says high-dimensional data may live near a low-dimensional shape, and TDA helps test that shape.",
    "connections": {
      "buildsOn": [
        "persistent homology",
        "homology groups",
        "metric-space topology"
      ],
      "leadsTo": [
        "representation learning",
        "geometric deep learning",
        "topological regularization"
      ],
      "usedWith": [
        "dimension reduction",
        "nearest-neighbor graphs",
        "persistence diagrams"
      ]
    },
    "motivation": "<p>Modern data often arrives with thousands of coordinates: pixels, embeddings, gene counts, or user features. The hopeful observation is that real examples may not fill the whole ambient space. They may lie near a lower-dimensional curve, surface, or branching shape.</p><p>The <b>manifold hypothesis</b> gives that hope a geometric name. Topological data analysis adds a practical question: as we thicken the data, do we see components, loops, or voids that persist long enough to be more than noise?</p>",
    "definition": "<p>The <b>manifold hypothesis</b> says that many high-dimensional datasets concentrate near a low-dimensional manifold or stratified space embedded in a much larger ambient space. A persistence diagram summarizes the topology of a filtered complex built from the data: each point $(b,d)$ records a feature born at scale $b$ and dying at scale $d$.</p><p>For ML, the workflow is concrete: choose a metric on representations, build a filtration such as Vietoris-Rips, compute persistent homology, and turn long-lived features into diagnostics or features. A loop in a diagram can mean circular variation, such as rotation angle, seasonality, or phase.</p><p><b>Assumptions that matter:</b> the metric on data or embeddings must be meaningful; sampling density affects what topology is visible; noise creates short bars; high-dimensional Rips complexes can be expensive; and TDA suggests structure but must be checked against domain knowledge and predictive performance.</p>",
    "worked": {
      "problem": "A two-dimensional embedding of images has one $H_1$ persistence point $(0.18,0.92)$ and noise points $(0.10,0.14)$ and $(0.35,0.41)$. Compute lifetimes and decide what the diagram suggests about the data manifold using cutoff $0.20$.",
      "skills": [
        "persistence diagrams",
        "lifetimes",
        "ML interpretation"
      ],
      "strategy": "Long lifetimes are far from the diagonal; compare each death minus birth with the cutoff.",
      "steps": [
        {
          "do": "Compute the main lifetime",
          "result": "$0.92-0.18=0.74$",
          "why": "persistence is death minus birth"
        },
        {
          "do": "Compute the first noise lifetime",
          "result": "$0.14-0.10=0.04$",
          "why": "short feature near the diagonal"
        },
        {
          "do": "Compute the second noise lifetime",
          "result": "$0.41-0.35=0.06$",
          "why": "another short feature"
        },
        {
          "do": "Apply the cutoff",
          "result": "$0.74>0.20$, while $0.04<0.20$ and $0.06<0.20$",
          "why": "only the main feature survives the rule"
        },
        {
          "do": "Interpret topology",
          "result": "one persistent loop",
          "why": "a loop suggests circular variation in the embedding"
        },
        {
          "do": "Connect to ML",
          "result": "possible one-dimensional circular factor",
          "why": "examples may vary by angle, phase, or cyclic pose"
        }
      ],
      "verify": "The main point is far from the diagonal compared with the two short-lived points, so the conclusion is driven by one robust feature.",
      "answer": "Keep the $H_1$ feature $(0.18,0.92)$ with lifetime $0.74$; the embedding suggests one meaningful loop-like factor in the data.",
      "connects": "The manifold hypothesis becomes testable when representation geometry produces persistent topological signatures."
    },
    "practice": [
      {
        "problem": "A dataset has $500$ pixel dimensions but PCA shows the first two coordinates explain $82\\%$ of variance. What does this suggest, and what does it not prove?",
        "steps": [
          {
            "do": "Read ambient dimension",
            "result": "$500$",
            "why": "the raw data lives in a high-dimensional space"
          },
          {
            "do": "Read explained variance",
            "result": "$82\\%$ in two coordinates",
            "why": "most linear variation lies in a plane"
          },
          {
            "do": "State the suggestion",
            "result": "low-dimensional structure",
            "why": "the data may concentrate near a two-dimensional set"
          },
          {
            "do": "State the limitation",
            "result": "not proof of a manifold",
            "why": "variance does not check topology or smoothness"
          },
          {
            "do": "Name a next check",
            "result": "compute neighborhood or persistence structure",
            "why": "TDA can test connectedness and loops across scales"
          }
        ],
        "answer": "It suggests low-dimensional structure, but it does not prove the data lies on a manifold."
      },
      {
        "problem": "An embedding has $H_0$ death times $0.05,0.06,0.07,1.20$. Interpret the large death time.",
        "steps": [
          {
            "do": "List small deaths",
            "result": "$0.05,0.06,0.07$",
            "why": "nearby points or tiny clusters merge early"
          },
          {
            "do": "Identify the large death",
            "result": "$1.20$",
            "why": "one merge occurs much later"
          },
          {
            "do": "Compare scales",
            "result": "$1.20/0.07\\approx17.14$",
            "why": "the large gap is over seventeen times the largest small death"
          },
          {
            "do": "Interpret components",
            "result": "two macro-clusters",
            "why": "a late merge suggests separated groups"
          },
          {
            "do": "Connect to ML",
            "result": "possible class, domain, or subgroup split",
            "why": "the representation may separate data into two regions"
          }
        ],
        "answer": "The death at $1.20$ suggests two large clusters remain separate until a much larger scale."
      },
      {
        "problem": "A circular latent factor is sampled at angles $0^\\circ,90^\\circ,180^\\circ,270^\\circ$. Using unit-circle coordinates, compute the four points.",
        "steps": [
          {
            "do": "Use angle $0^\\circ$",
            "result": "$(\\cos0,\\sin0)=(1,0)$",
            "why": "rightmost point"
          },
          {
            "do": "Use angle $90^\\circ$",
            "result": "$(0,1)$",
            "why": "top point"
          },
          {
            "do": "Use angle $180^\\circ$",
            "result": "$(-1,0)$",
            "why": "leftmost point"
          },
          {
            "do": "Use angle $270^\\circ$",
            "result": "$(0,-1)$",
            "why": "bottom point"
          },
          {
            "do": "Interpret shape",
            "result": "four samples around a loop",
            "why": "the latent factor is cyclic"
          }
        ],
        "answer": "The points are $(1,0)$, $(0,1)$, $(-1,0)$, and $(0,-1)$."
      },
      {
        "problem": "A persistence diagram for embeddings has $H_1$ lifetimes $0.03,0.08,0.62,0.11$. With a cutoff of $0.10$, how many loop features remain?",
        "steps": [
          {
            "do": "Compare $0.03$ with cutoff",
            "result": "$0.03<0.10$",
            "why": "discard"
          },
          {
            "do": "Compare $0.08$ with cutoff",
            "result": "$0.08<0.10$",
            "why": "discard"
          },
          {
            "do": "Compare $0.62$ with cutoff",
            "result": "$0.62>0.10$",
            "why": "keep"
          },
          {
            "do": "Compare $0.11$ with cutoff",
            "result": "$0.11>0.10$",
            "why": "keep"
          },
          {
            "do": "Count kept loops",
            "result": "$2$",
            "why": "two lifetimes exceed the threshold"
          }
        ],
        "answer": "Two loop features remain."
      },
      {
        "problem": "A model maps a noisy circle to embeddings. Before training, the main $H_1$ bar is $[0.2,1.1)$. After training, it is $[0.25,0.45)$. Compute the persistence drop and interpret.",
        "steps": [
          {
            "do": "Compute before persistence",
            "result": "$1.1-0.2=0.9$",
            "why": "original lifetime"
          },
          {
            "do": "Compute after persistence",
            "result": "$0.45-0.25=0.20$",
            "why": "trained lifetime"
          },
          {
            "do": "Compute drop",
            "result": "$0.90-0.20=0.70$",
            "why": "loss of loop persistence"
          },
          {
            "do": "Compare relative size",
            "result": "$0.20/0.90\\approx0.222$",
            "why": "about $22.2\\%$ of the original persistence remains"
          },
          {
            "do": "Interpret",
            "result": "the representation flattened or filled the loop",
            "why": "the cyclic factor may be less visible after training"
          }
        ],
        "answer": "Persistence dropped by $0.70$; the learned embedding may have suppressed the loop structure."
      }
    ],
    "applications": [
      {
        "title": "Manifold learning",
        "background": "Algorithms such as Isomap and UMAP are motivated by the idea that local neighborhoods reveal a low-dimensional data shape.",
        "numbers": "If each point keeps $15$ nearest neighbors out of $10000$ samples, the graph uses local geometry rather than all $49,995,000$ possible pairs."
      },
      {
        "title": "Embedding diagnostics",
        "background": "TDA can check whether a neural embedding preserves meaningful topology from the data.",
        "numbers": "A rotation dataset with one expected loop should show an $H_1$ bar such as $[0.18,0.92)$, lifetime $0.74$, not only bars below $0.05$."
      },
      {
        "title": "Class separation",
        "background": "Persistent $H_0$ reveals whether classes form separated components or mixed clouds.",
        "numbers": "If within-class merges die by $0.2$ but class-to-class merge dies at $1.4$, the separation scale is $7$ times larger."
      },
      {
        "title": "Cyclic factors in vision",
        "background": "Objects rotating through angle form circular structure in representation space when pose is preserved.",
        "numbers": "Images at $0^\\circ,90^\\circ,180^\\circ,270^\\circ$ map naturally to four points around a unit circle with adjacent distance $\\sqrt2\\approx1.414$."
      },
      {
        "title": "Topological regularization",
        "background": "Some training methods penalize losing or creating topological features in latent spaces.",
        "numbers": "If the target has one loop bar of length $0.8$ and the model output has length $0.2$, a simple penalty could include $(0.8-0.2)^2=0.36$."
      },
      {
        "title": "Anomaly detection",
        "background": "Points far from a learned manifold or causing new short-lived components can be treated as anomalies.",
        "numbers": "If normal neighbor distances average $0.10$ and one point's nearest neighbor is $0.65$, it may create an $H_0$ bar lasting about $0.65$."
      },
      {
        "title": "Single-cell biology",
        "background": "Cell states often progress along branches or cycles, and TDA can summarize those trajectories.",
        "numbers": "A cell-cycle loop with persistence $1.3$ versus noise loops $0.1$ and $0.2$ supports a real cyclic biological process."
      },
      {
        "title": "Representation comparison",
        "background": "Two models can be compared by their persistence diagrams, not just accuracy.",
        "numbers": "Model A has main loop lifetime $0.75$ and accuracy $0.91$; model B has lifetime $0.10$ and accuracy $0.91$, suggesting different geometry with equal predictive score."
      }
    ],
    "applicationsClose": "The capstone lesson is this: topology can become an ML diagnostic when distances, scales, and domain meaning are handled with care.",
    "takeaways": [
      "The manifold hypothesis says high-dimensional data often concentrates near lower-dimensional structure.",
      "Persistence diagrams summarize multiscale topology with birth and death coordinates.",
      "Long bars in embeddings can reveal loops, clusters, or cyclic latent factors.",
      "TDA complements ML metrics; it does not replace validation, labels, or domain judgment."
    ]
  }
};
