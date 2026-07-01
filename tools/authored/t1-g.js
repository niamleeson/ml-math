module.exports = {
  "math-01-56": {
    "id": "math-01-56",
    "title": "Convergence tests",
    "tagline": "When an infinite sum has no last term, tests tell us whether it still lands somewhere finite.",
    "connections": {
      "buildsOn": [
        "sequences",
        "series",
        "the geometric series",
        "limits at infinity"
      ],
      "leadsTo": [
        "power series",
        "Taylor series",
        "error bounds for approximations"
      ],
      "usedWith": [
        "improper integrals",
        "comparison",
        "absolute convergence",
        "ratio and root limits"
      ]
    },
    "motivation": "<p>You already know how to add finitely many numbers. The surprise is that some infinite sums also settle: $1+\\tfrac12+\\tfrac14+\\cdots=2$. Others, like $1+\\tfrac12+\\tfrac13+\\cdots$, keep growing forever, even though the terms go to zero.</p><p><b>Convergence tests</b> are a set of careful shortcuts. Instead of trying to add infinitely many terms, we compare their long-run size, ratio, or shape to series we already understand. It is like judging whether a long road eventually levels out by checking its slope and landmarks rather than walking forever.</p>",
    "definition": "<p>An infinite series $\\sum_{n=1}^{\\infty}a_n$ <b>converges</b> if the partial sums $s_N=\\sum_{n=1}^{N}a_n$ approach a finite limit. The most used tests are: term test $a_n\\to0$ is necessary; geometric $\\sum ar^{n}$ converges when $|r|<1$; $p$-series $\\sum 1/n^p$ converges when $p>1$; comparison and limit comparison transfer behavior from a known positive series; ratio and root tests examine exponential-like decay.</p><p><b>Assumptions that matter:</b> the term test can only prove divergence, not convergence; comparison tests usually require nonnegative terms; absolute convergence of $\\sum |a_n|$ implies convergence of $\\sum a_n$; alternating series need decreasing terms whose limit is zero.</p>",
    "worked": {
      "problem": "Determine whether $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{3n+1}{n^3+2}$ converges.",
      "skills": [
        "limit comparison",
        "$p$-series",
        "asymptotic size"
      ],
      "strategy": "The numerator behaves like $n$ and the denominator like $n^3$, so compare with $1/n^2$.",
      "steps": [
        {
          "do": "Choose a comparison series",
          "result": "$b_n=\\dfrac{1}{n^2}$",
          "why": "$\\frac{3n+1}{n^3+2}$ has leading size $3n/n^3=3/n^2$"
        },
        {
          "do": "Form the limit comparison ratio",
          "result": "$\\dfrac{a_n}{b_n}=\\dfrac{3n+1}{n^3+2}\\cdot n^2$",
          "why": "limit comparison checks whether the two series have the same long-run scale"
        },
        {
          "do": "Multiply the factors",
          "result": "$\\dfrac{3n^3+n^2}{n^3+2}$",
          "why": "one fraction is easier to limit"
        },
        {
          "do": "Divide top and bottom by $n^3$",
          "result": "$\\dfrac{3+1/n}{1+2/n^3}$",
          "why": "this exposes the terms that vanish"
        },
        {
          "do": "Take the limit",
          "result": "$3$",
          "why": "$1/n\\to0$ and $2/n^3\\to0$"
        },
        {
          "do": "Use the known comparison",
          "result": "$\\sum 1/n^2$ converges",
          "why": "a $p$-series converges when $p=2>1"
        }
      ],
      "verify": "The comparison limit is finite and positive, so both positive series share behavior; since $\\sum 1/n^2$ converges, the given series converges.",
      "answer": "$\\displaystyle\\sum_{n=1}^{\\infty}\\frac{3n+1}{n^3+2}$ converges.",
      "connects": "Convergence tests turn an infinite task into a finite diagnosis: identify the long-run shape and borrow a known result."
    },
    "practice": [
      {
        "problem": "Test $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{5}{2^n}$.",
        "steps": [
          {
            "do": "Identify the form",
            "result": "$\\sum_{n=1}^{\\infty}5(1/2)^n$",
            "why": "the ratio between consecutive terms is constant"
          },
          {
            "do": "Name the ratio",
            "result": "$r=\\frac12$",
            "why": "geometric series depend on $|r|$"
          },
          {
            "do": "Check the convergence condition",
            "result": "$|r|=\\frac12<1$",
            "why": "geometric series converge exactly in this case"
          },
          {
            "do": "Compute the sum",
            "result": "$5\\cdot\\dfrac{1/2}{1-1/2}=5$",
            "why": "the first displayed term is $5/2$"
          }
        ],
        "answer": "Converges, with sum $5$."
      },
      {
        "problem": "Test $\\displaystyle\\sum_{n=2}^{\\infty}\\frac{1}{n\\ln n}$.",
        "steps": [
          {
            "do": "Choose the integral test",
            "result": "$f(x)=\\dfrac{1}{x\\ln x}$",
            "why": "the terms are positive and decreasing for $x>1$"
          },
          {
            "do": "Set up the improper integral",
            "result": "$\\int_2^{\\infty}\\dfrac{dx}{x\\ln x}$",
            "why": "integral behavior matches the series behavior"
          },
          {
            "do": "Substitute $u=\\ln x$",
            "result": "$du=dx/x$",
            "why": "this removes the $x$ in the denominator"
          },
          {
            "do": "Integrate",
            "result": "$\\int_{\\ln 2}^{\\infty}\\dfrac{du}{u}=\\lim_{B\\to\\infty}(\\ln B-\\ln(\\ln2))$",
            "why": "the antiderivative is $\\ln u$"
          },
          {
            "do": "Take the limit",
            "result": "$\\infty$",
            "why": "$\\ln B$ grows without bound"
          }
        ],
        "answer": "Diverges by the integral test."
      },
      {
        "problem": "Test $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{\\sqrt n}$.",
        "steps": [
          {
            "do": "Separate the magnitudes",
            "result": "$b_n=1/\\sqrt n$",
            "why": "alternating convergence looks at the positive sizes"
          },
          {
            "do": "Check the limit of magnitudes",
            "result": "$\\lim_{n\\to\\infty}b_n=0$",
            "why": "terms must shrink to zero"
          },
          {
            "do": "Check monotonicity",
            "result": "$b_{n+1}<b_n$",
            "why": "square roots increase, so reciprocals decrease"
          },
          {
            "do": "Apply the alternating series test",
            "result": "the series converges",
            "why": "decreasing magnitudes with limit zero are enough"
          },
          {
            "do": "Check absolute convergence",
            "result": "$\\sum 1/\\sqrt n=\\sum 1/n^{1/2}$ diverges",
            "why": "a $p$-series with $p=1/2\\le1$ diverges"
          }
        ],
        "answer": "Converges conditionally, not absolutely."
      },
      {
        "problem": "Test $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{n!}{4^n}$.",
        "steps": [
          {
            "do": "Choose the ratio test",
            "result": "$a_n=\\dfrac{n!}{4^n}$",
            "why": "factorials are built for ratios"
          },
          {
            "do": "Form the next-term ratio",
            "result": "$\\dfrac{a_{n+1}}{a_n}=\\dfrac{(n+1)!}{4^{n+1}}\\cdot\\dfrac{4^n}{n!}$",
            "why": "the ratio test asks how a term changes from one step to the next"
          },
          {
            "do": "Cancel common factors",
            "result": "$\\dfrac{n+1}{4}$",
            "why": "$n!$ and $4^n$ cancel"
          },
          {
            "do": "Take the limit",
            "result": "$\\infty$",
            "why": "$(n+1)/4$ grows without bound"
          },
          {
            "do": "Apply the ratio test",
            "result": "diverges",
            "why": "ratio limit greater than $1$ means terms do not shrink fast enough"
          }
        ],
        "answer": "Diverges by the ratio test."
      },
      {
        "problem": "Test $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(0.01n)^n}{n!}$, a toy bound that appears in approximation error estimates.",
        "steps": [
          {
            "do": "Choose the root test",
            "result": "$a_n=\\dfrac{(0.01n)^n}{n!}$",
            "why": "the $n$th power suggests roots"
          },
          {
            "do": "Take the $n$th root",
            "result": "$\\sqrt[n]{a_n}=\\dfrac{0.01n}{\\sqrt[n]{n!}}$",
            "why": "roots undo the outside power"
          },
          {
            "do": "Use Stirling's scale",
            "result": "$\\sqrt[n]{n!}\\sim n/e$",
            "why": "factorials grow like $(n/e)^n$ at root scale"
          },
          {
            "do": "Compute the limiting root",
            "result": "$0.01e\\approx0.0272$",
            "why": "the $n$ factors cancel in the approximation"
          },
          {
            "do": "Apply the root test",
            "result": "converges absolutely",
            "why": "the limiting root is less than $1$"
          }
        ],
        "answer": "Converges absolutely; the terms decay very fast."
      }
    ],
    "applications": [
      {
        "title": "Stopping an infinite feature expansion",
        "background": "Kernel and basis expansions often keep only the terms whose tail is small enough. A convergence test tells you whether the remaining tail can be controlled.",
        "numbers": "For a geometric tail $\\sum_{n=6}^{\\infty}0.2^n=0.2^6/(1-0.2)=0.00008$, so dropping terms after degree $5$ costs less than $10^{-4}$."
      },
      {
        "title": "Bounding Taylor approximation error",
        "background": "Taylor methods approximate nonlinear functions by polynomials; convergence tests justify that more terms really improve the approximation.",
        "numbers": "For $e^{0.5}$, the next neglected term after degree $4$ is $0.5^5/5!=0.0002604$, already below $3\\times10^{-4}$."
      },
      {
        "title": "Analyzing optimization schedules",
        "background": "SGD convergence proofs often require learning rates whose sums behave differently: enough total motion, but shrinking noise.",
        "numbers": "$\\sum 1/t$ diverges while $\\sum 1/t^2$ converges, so $\\eta_t=1/t$ satisfies the classic pair $\\sum\\eta_t=\\infty$, $\\sum\\eta_t^2<\\infty$."
      },
      {
        "title": "Discounted reinforcement learning",
        "background": "A discounted return is an infinite geometric series when rewards are bounded.",
        "numbers": "If rewards are at most $2$ and $\\gamma=0.95$, then total return is at most $2/(1-0.95)=40$."
      },
      {
        "title": "Numerical linear algebra iterations",
        "background": "Iterative solvers repeatedly add corrections; convergence is often geometric when the error contracts.",
        "numbers": "If the error shrinks by $0.3$ each step from $10$, after $8$ steps it is $10(0.3)^8=0.0006561$."
      },
      {
        "title": "Dropout-style random paths",
        "background": "Expected contributions from long computational paths can form a series when each extra step is less likely.",
        "numbers": "If each extra link survives with probability $0.8$ and contributes size $0.1^k$, the tail is $\\sum (0.08)^k=1/(1-0.08)=1.087$ from $k=0$."
      }
    ],
    "applicationsClose": "The same question keeps returning in different clothes: do the infinitely many small pieces add up to something finite?",
    "takeaways": [
      "A series converges when its partial sums approach a finite limit.",
      "The term test proves only divergence; a zero term limit is necessary but not enough.",
      "Comparison, ratio, root, integral, and alternating tests each recognize a different long-run pattern."
    ]
  },
  "math-01-57": {
    "id": "math-01-57",
    "title": "Power series",
    "tagline": "A function can be built from infinitely many powers, but only inside the interval where the powers behave.",
    "connections": {
      "buildsOn": [
        "series",
        "convergence tests",
        "polynomials",
        "limits"
      ],
      "leadsTo": [
        "Taylor series",
        "Maclaurin series",
        "series solutions of differential equations"
      ],
      "usedWith": [
        "ratio test",
        "intervals of convergence",
        "term-by-term differentiation",
        "term-by-term integration"
      ]
    },
    "motivation": "<p>Polynomials are friendly: they are easy to evaluate, differentiate, and integrate. Power series ask a bold question: can we let a polynomial have infinitely many terms and still keep those friendly rules?</p><p>The answer is yes, but with a boundary. A <b>power series</b> behaves beautifully near its center and may fail farther away. The radius of convergence is the safe zone, like the range over which a local map is trustworthy.</p>",
    "definition": "<p>A power series centered at $c$ has the form $$\\sum_{n=0}^{\\infty}a_n(x-c)^n.$$ For each fixed $x$, this becomes an ordinary numerical series. The set of $x$ values where it converges is its <b>interval of convergence</b>, usually $|x-c|<R$ plus endpoint checks. The number $R$ is the <b>radius of convergence</b>.</p><p><b>Assumptions that matter:</b> the radius usually comes from the ratio or root test; endpoints must be tested separately; inside $|x-c|<R$, power series may be differentiated and integrated term by term; outside that interval the same formula may not represent a finite value.</p>",
    "worked": {
      "problem": "Find the radius and interval of convergence of $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(x-2)^n}{n3^n}$.",
      "skills": [
        "ratio test",
        "endpoint checks",
        "alternating series"
      ],
      "strategy": "Use the ratio test for the open interval, then test the two endpoints one at a time.",
      "steps": [
        {
          "do": "Name the term",
          "result": "$a_n=\\dfrac{(x-2)^n}{n3^n}$",
          "why": "the ratio test needs consecutive terms"
        },
        {
          "do": "Form the ratio",
          "result": "$\\left|\\dfrac{a_{n+1}}{a_n}\\right|=\\left|\\dfrac{(x-2)^{n+1}}{(n+1)3^{n+1}}\\cdot\\dfrac{n3^n}{(x-2)^n}\\right|$",
          "why": "compare term $n+1$ to term $n$"
        },
        {
          "do": "Cancel common factors",
          "result": "$\\dfrac{|x-2|}{3}\\cdot\\dfrac{n}{n+1}$",
          "why": "powers and $3^n$ simplify"
        },
        {
          "do": "Take the limit",
          "result": "$\\dfrac{|x-2|}{3}$",
          "why": "$n/(n+1)\\to1$"
        },
        {
          "do": "Impose ratio less than $1$",
          "result": "$|x-2|<3$",
          "why": "the ratio test gives convergence inside"
        },
        {
          "do": "Convert to an open interval",
          "result": "$-1<x<5$",
          "why": "subtract and add $3$ around center $2$"
        },
        {
          "do": "Test $x=-1$",
          "result": "$\\sum\\dfrac{(-3)^n}{n3^n}=\\sum\\dfrac{(-1)^n}{n}$",
          "why": "left endpoint becomes alternating harmonic"
        },
        {
          "do": "Classify $x=-1$",
          "result": "converges",
          "why": "alternating harmonic converges"
        },
        {
          "do": "Test $x=5$",
          "result": "$\\sum\\dfrac{3^n}{n3^n}=\\sum\\dfrac1n$",
          "why": "right endpoint becomes harmonic"
        },
        {
          "do": "Classify $x=5$",
          "result": "diverges",
          "why": "the harmonic series diverges"
        }
      ],
      "verify": "A point like $x=2$ gives the zero series after the first powers, safely convergent; a far point like $x=8$ has ratio $2>1$, so it cannot converge.",
      "answer": "Radius $R=3$; interval of convergence $[-1,5)$.",
      "connects": "The open interval comes from exponential-size behavior; the endpoints require the older convergence tests."
    },
    "practice": [
      {
        "problem": "Find the interval of convergence of $\\displaystyle\\sum_{n=0}^{\\infty}(x+1)^n$.",
        "steps": [
          {
            "do": "Recognize the geometric form",
            "result": "$\\sum ((x+1))^n$",
            "why": "the ratio is $x+1$"
          },
          {
            "do": "Apply the geometric condition",
            "result": "$|x+1|<1$",
            "why": "geometric series converge when the absolute ratio is less than $1$"
          },
          {
            "do": "Solve the inequality",
            "result": "$-2<x<0$",
            "why": "subtract $1$ from all parts"
          },
          {
            "do": "Test $x=-2$",
            "result": "$\\sum (-1)^n$",
            "why": "terms do not approach zero"
          },
          {
            "do": "Test $x=0$",
            "result": "$\\sum 1$",
            "why": "terms do not approach zero"
          }
        ],
        "answer": "Interval $(-2,0)$; radius $1$."
      },
      {
        "problem": "Find the interval of convergence of $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{x^n}{n}$.",
        "steps": [
          {
            "do": "Use the ratio test",
            "result": "$\\left|\\dfrac{x^{n+1}}{n+1}\\cdot\\dfrac{n}{x^n}\\right|=|x|\\dfrac{n}{n+1}$",
            "why": "consecutive terms simplify"
          },
          {
            "do": "Take the limit",
            "result": "$|x|$",
            "why": "$n/(n+1)\\to1$"
          },
          {
            "do": "Find the open interval",
            "result": "$|x|<1$",
            "why": "ratio less than $1$ gives convergence"
          },
          {
            "do": "Test $x=1$",
            "result": "$\\sum 1/n$ diverges",
            "why": "harmonic series"
          },
          {
            "do": "Test $x=-1$",
            "result": "$\\sum (-1)^n/n$ converges",
            "why": "alternating harmonic series"
          }
        ],
        "answer": "Interval $[-1,1)$; radius $1$."
      },
      {
        "problem": "Find the interval of convergence of $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{n(x-4)^n}{5^n}$.",
        "steps": [
          {
            "do": "Form the ratio",
            "result": "$\\left|\\dfrac{(n+1)(x-4)^{n+1}}{5^{n+1}}\\cdot\\dfrac{5^n}{n(x-4)^n}\\right|$",
            "why": "ratio test handles the $n$ factor"
          },
          {
            "do": "Simplify",
            "result": "$\\dfrac{|x-4|}{5}\\cdot\\dfrac{n+1}{n}$",
            "why": "cancel common powers"
          },
          {
            "do": "Take the limit",
            "result": "$\\dfrac{|x-4|}{5}$",
            "why": "$(n+1)/n\\to1$"
          },
          {
            "do": "Solve the open interval",
            "result": "$-1<x<9$",
            "why": "$|x-4|<5$"
          },
          {
            "do": "Test both endpoints",
            "result": "$x=-1$ gives $\\sum n(-1)^n$ and $x=9$ gives $\\sum n$",
            "why": "in both cases terms do not approach zero"
          }
        ],
        "answer": "Interval $(-1,9)$; radius $5$."
      },
      {
        "problem": "Differentiate $\\displaystyle f(x)=\\sum_{n=0}^{\\infty}\\frac{x^{n+1}}{n+1}$ for $|x|<1$.",
        "steps": [
          {
            "do": "Differentiate one term",
            "result": "$\\dfrac{d}{dx}\\left(\\dfrac{x^{n+1}}{n+1}\\right)=x^n$",
            "why": "the power rule cancels $n+1$"
          },
          {
            "do": "Differentiate the series",
            "result": "$f'(x)=\\sum_{n=0}^{\\infty}x^n$",
            "why": "term-by-term differentiation is valid inside the radius"
          },
          {
            "do": "Recognize the geometric series",
            "result": "$\\sum_{n=0}^{\\infty}x^n$",
            "why": "ratio $x$"
          },
          {
            "do": "Sum it",
            "result": "$\\dfrac{1}{1-x}$",
            "why": "valid for $|x|<1$"
          },
          {
            "do": "State the domain",
            "result": "$|x|<1$",
            "why": "differentiation preserves the same radius"
          }
        ],
        "answer": "$f'(x)=1/(1-x)$ for $|x|<1$."
      },
      {
        "problem": "A model uses $\\sum_{n=0}^{\\infty}(0.8x)^n$ as a response curve. For what $x$ does the formula converge, and what is its value at $x=1$?",
        "steps": [
          {
            "do": "Identify the ratio",
            "result": "$r=0.8x$",
            "why": "the series is geometric"
          },
          {
            "do": "Apply the convergence condition",
            "result": "$|0.8x|<1$",
            "why": "geometric convergence requires absolute ratio below $1$"
          },
          {
            "do": "Solve for $x$",
            "result": "$|x|<1.25$",
            "why": "divide by $0.8$"
          },
          {
            "do": "Substitute $x=1$",
            "result": "$r=0.8$",
            "why": "the input is inside the interval"
          },
          {
            "do": "Compute the sum",
            "result": "$\\dfrac{1}{1-0.8}=5$",
            "why": "geometric sum formula"
          }
        ],
        "answer": "Converges for $-1.25<x<1.25$; at $x=1$ the value is $5$."
      }
    ],
    "applications": [
      {
        "title": "Local function approximators",
        "background": "Power series let software replace a hard function with powers and coefficients near a center.",
        "numbers": "For $1/(1-x)=\\sum x^n$, at $x=0.2$, five terms give $1+0.2+0.04+0.008+0.0016=1.2496$ versus exact $1.25$."
      },
      {
        "title": "Neural activation approximations",
        "background": "Fast inference libraries approximate smooth activations with polynomials over a safe interval.",
        "numbers": "Using $\\tanh x\\approx x-x^3/3+2x^5/15$ at $x=0.5$ gives $0.4625$, close to $\\tanh(0.5)=0.4621$."
      },
      {
        "title": "Generating functions",
        "background": "Discrete math encodes a sequence as coefficients of a power series, then manipulates the series algebraically.",
        "numbers": "$1/(1-x)^2=\\sum_{n=0}^{\\infty}(n+1)x^n$; the coefficient of $x^4$ is $5$."
      },
      {
        "title": "Signal filters",
        "background": "Digital filters often appear as power series in a delay variable, where convergence means the impulse response is summable.",
        "numbers": "$1+0.7z+0.7^2z^2+\\cdots$ converges for $|z|<1/0.7\\approx1.429$."
      },
      {
        "title": "Uncertainty propagation",
        "background": "A nonlinear measurement can be expanded around a nominal value to estimate how small perturbations change the output.",
        "numbers": "$1/(1-\\epsilon)=1+\\epsilon+\\epsilon^2+\\cdots$; for $\\epsilon=0.05$, three terms give $1.0525$ versus exact $1.05263$."
      },
      {
        "title": "Iterative algorithms",
        "background": "When an update operator has small norm, inverse-like expressions become power series.",
        "numbers": "If $A$ has effective size $0.2$, then $(I-A)^{-1}\\approx I+A+A^2$ leaves a tail bounded by $0.2^3/(1-0.2)=0.01$."
      }
    ],
    "applicationsClose": "Power series are polynomials with a safety radius: inside it, algebra and calculus become wonderfully reusable.",
    "takeaways": [
      "A power series is $\\sum a_n(x-c)^n$ centered at $c$.",
      "The ratio or root test usually gives the radius; endpoints need separate tests.",
      "Inside the radius, term-by-term differentiation and integration are valid."
    ]
  },
  "math-01-58": {
    "id": "math-01-58",
    "title": "Taylor series",
    "tagline": "A smooth function can be rebuilt near a point from its value, slope, curvature, and higher derivatives.",
    "connections": {
      "buildsOn": [
        "derivatives",
        "power series",
        "factorials",
        "linear approximation"
      ],
      "leadsTo": [
        "Maclaurin series",
        "Taylor's theorem with remainder",
        "optimization approximations"
      ],
      "usedWith": [
        "higher-order derivatives",
        "error bounds",
        "polynomial approximation",
        "local linearization"
      ]
    },
    "motivation": "<p>Linear approximation says a function near $a$ behaves like $f(a)+f'(a)(x-a)$. That is already powerful, but it throws away curvature. If the curve bends, one line only tells the first part of the story.</p><p>A <b>Taylor series</b> keeps asking for more local information: value, slope, curvature, third derivative, and so on. Each derivative adds another correction term, giving a polynomial that can shadow the function very closely near the center.</p>",
    "definition": "<p>If $f$ has derivatives of all orders near $a$, its Taylor series about $a$ is $$\\sum_{n=0}^{\\infty}\\frac{f^{(n)}(a)}{n!}(x-a)^n=f(a)+f'(a)(x-a)+\\frac{f''(a)}{2!}(x-a)^2+\\cdots.$$ The coefficient is chosen so that the polynomial's $n$th derivative at $a$ matches $f^{(n)}(a)$.</p><p><b>Assumptions that matter:</b> having all derivatives is not by itself enough to guarantee the series equals the function; equality needs the remainder to go to zero. The approximation is local: it is usually best near $a$, and the radius of convergence still matters.</p>",
    "worked": {
      "problem": "Find the Taylor polynomial of degree $3$ for $f(x)=\\ln x$ about $a=1$.",
      "skills": [
        "derivatives",
        "Taylor coefficients",
        "local approximation"
      ],
      "strategy": "Compute derivatives at the center, then place them into the Taylor formula one coefficient at a time.",
      "steps": [
        {
          "do": "Evaluate the function",
          "result": "$f(1)=\\ln 1=0$",
          "why": "this is the constant term"
        },
        {
          "do": "Differentiate once",
          "result": "$f'(x)=1/x$",
          "why": "slope gives the linear coefficient"
        },
        {
          "do": "Evaluate the first derivative",
          "result": "$f'(1)=1$",
          "why": "substitute the center"
        },
        {
          "do": "Differentiate twice",
          "result": "$f''(x)=-1/x^2$",
          "why": "curvature gives the quadratic coefficient"
        },
        {
          "do": "Evaluate the second derivative",
          "result": "$f''(1)=-1$",
          "why": "substitute the center"
        },
        {
          "do": "Differentiate three times",
          "result": "$f'''(x)=2/x^3$",
          "why": "third-order change gives the cubic coefficient"
        },
        {
          "do": "Evaluate the third derivative",
          "result": "$f'''(1)=2$",
          "why": "substitute the center"
        },
        {
          "do": "Insert into Taylor's formula",
          "result": "$0+1(x-1)-\\dfrac{(x-1)^2}{2}+\\dfrac{2(x-1)^3}{6}$",
          "why": "each derivative is divided by its factorial"
        },
        {
          "do": "Simplify",
          "result": "$(x-1)-\\dfrac{(x-1)^2}{2}+\\dfrac{(x-1)^3}{3}$",
          "why": "$2/6=1/3$"
        }
      ],
      "verify": "At $x=1.1$, the polynomial gives $0.1-0.005+0.000333=0.095333$, close to $\\ln(1.1)=0.095310$.",
      "answer": "$T_3(x)=(x-1)-\\dfrac{(x-1)^2}{2}+\\dfrac{(x-1)^3}{3}$.",
      "connects": "Taylor approximation turns local derivative information into a usable polynomial model."
    },
    "practice": [
      {
        "problem": "Find the degree $2$ Taylor polynomial for $f(x)=e^x$ about $a=1$.",
        "steps": [
          {
            "do": "Evaluate the function",
            "result": "$f(1)=e$",
            "why": "constant term"
          },
          {
            "do": "Differentiate",
            "result": "$f'(x)=e^x$",
            "why": "the exponential is its own derivative"
          },
          {
            "do": "Evaluate the first derivative",
            "result": "$f'(1)=e$",
            "why": "linear coefficient numerator"
          },
          {
            "do": "Evaluate the second derivative",
            "result": "$f''(1)=e$",
            "why": "quadratic coefficient numerator"
          },
          {
            "do": "Assemble the polynomial",
            "result": "$e+e(x-1)+\\dfrac{e}{2}(x-1)^2$",
            "why": "divide the second derivative by $2!$"
          }
        ],
        "answer": "$T_2(x)=e+e(x-1)+\\frac{e}{2}(x-1)^2$."
      },
      {
        "problem": "Find the degree $3$ Taylor polynomial for $f(x)=\\sqrt{x}$ about $a=4$.",
        "steps": [
          {
            "do": "Evaluate the function",
            "result": "$f(4)=2$",
            "why": "constant term"
          },
          {
            "do": "Compute the first derivative",
            "result": "$f'(x)=\\dfrac{1}{2\\sqrt{x}}$",
            "why": "power rule"
          },
          {
            "do": "Evaluate the first derivative",
            "result": "$f'(4)=\\frac14$",
            "why": "$\\sqrt4=2$"
          },
          {
            "do": "Compute the second derivative",
            "result": "$f''(x)=-\\dfrac{1}{4x^{3/2}}$",
            "why": "differentiate $\\frac12x^{-1/2}$"
          },
          {
            "do": "Evaluate the second derivative",
            "result": "$f''(4)=-\\frac{1}{32}$",
            "why": "$4^{3/2}=8$"
          },
          {
            "do": "Compute the third derivative",
            "result": "$f'''(x)=\\dfrac{3}{8x^{5/2}}$",
            "why": "differentiate $-\\frac14x^{-3/2}$"
          },
          {
            "do": "Evaluate the third derivative",
            "result": "$f'''(4)=\\frac{3}{256}$",
            "why": "$4^{5/2}=32$"
          },
          {
            "do": "Assemble the polynomial",
            "result": "$2+\\frac14(x-4)-\\frac{1}{64}(x-4)^2+\\frac{1}{512}(x-4)^3$",
            "why": "divide by $2!$ and $3!$"
          }
        ],
        "answer": "$T_3(x)=2+\\frac14(x-4)-\\frac{1}{64}(x-4)^2+\\frac{1}{512}(x-4)^3$."
      },
      {
        "problem": "Use the degree $2$ Taylor polynomial for $\\ln x$ about $1$ to approximate $\\ln(1.2)$.",
        "steps": [
          {
            "do": "Recall the polynomial",
            "result": "$T_2(x)=(x-1)-\\dfrac{(x-1)^2}{2}$",
            "why": "from the Taylor pattern for $\\ln x$ at $1$"
          },
          {
            "do": "Compute the displacement",
            "result": "$x-1=0.2$",
            "why": "distance from the center"
          },
          {
            "do": "Substitute",
            "result": "$T_2(1.2)=0.2-\\dfrac{0.2^2}{2}$",
            "why": "use the polynomial instead of the log"
          },
          {
            "do": "Square",
            "result": "$0.2^2=0.04$",
            "why": "quadratic correction"
          },
          {
            "do": "Evaluate",
            "result": "$0.2-0.02=0.18$",
            "why": "combine terms"
          }
        ],
        "answer": "$\\ln(1.2)\\approx0.18$; the true value is about $0.1823$."
      },
      {
        "problem": "Find the degree $3$ Taylor polynomial for $f(x)=1/x$ about $a=2$.",
        "steps": [
          {
            "do": "Evaluate",
            "result": "$f(2)=1/2$",
            "why": "constant term"
          },
          {
            "do": "Differentiate once",
            "result": "$f'(x)=-x^{-2}$",
            "why": "power rule"
          },
          {
            "do": "Evaluate once",
            "result": "$f'(2)=-1/4$",
            "why": "linear coefficient numerator"
          },
          {
            "do": "Differentiate twice",
            "result": "$f''(x)=2x^{-3}$",
            "why": "power rule"
          },
          {
            "do": "Evaluate twice",
            "result": "$f''(2)=1/4$",
            "why": "since $2/8=1/4$"
          },
          {
            "do": "Differentiate three times",
            "result": "$f'''(x)=-6x^{-4}$",
            "why": "power rule"
          },
          {
            "do": "Evaluate three times",
            "result": "$f'''(2)=-3/8$",
            "why": "since $-6/16=-3/8$"
          },
          {
            "do": "Assemble",
            "result": "$\\frac12-\\frac14(x-2)+\\frac18(x-2)^2-\\frac{1}{16}(x-2)^3$",
            "why": "divide by $2!$ and $3!$"
          }
        ],
        "answer": "$T_3(x)=\\frac12-\\frac14(x-2)+\\frac18(x-2)^2-\\frac{1}{16}(x-2)^3$."
      },
      {
        "problem": "Near a minimum, approximate $L(w)=\\ln(1+e^w)$ about $w=0$ to degree $2$.",
        "steps": [
          {
            "do": "Evaluate the loss",
            "result": "$L(0)=\\ln2$",
            "why": "constant term"
          },
          {
            "do": "Differentiate",
            "result": "$L'(w)=\\dfrac{e^w}{1+e^w}$",
            "why": "chain rule on $\\ln(1+e^w)$"
          },
          {
            "do": "Evaluate the first derivative",
            "result": "$L'(0)=\\frac12$",
            "why": "$e^0=1$"
          },
          {
            "do": "Differentiate again",
            "result": "$L''(w)=\\dfrac{e^w}{(1+e^w)^2}$",
            "why": "quotient simplification"
          },
          {
            "do": "Evaluate the second derivative",
            "result": "$L''(0)=\\frac14$",
            "why": "$1/(1+1)^2=1/4$"
          },
          {
            "do": "Assemble",
            "result": "$\\ln2+\\frac12w+\\frac18w^2$",
            "why": "the quadratic coefficient is $L''(0)/2!$"
          }
        ],
        "answer": "$L(w)\\approx\\ln2+\\frac12w+\\frac18w^2$ near $w=0$."
      }
    ],
    "applications": [
      {
        "title": "Newton's method",
        "background": "Newton's method is built from a second-order Taylor picture of a function near the current point.",
        "numbers": "For minimizing $f(w)=(w-3)^2$, $f'(0)=-6$ and $f''(0)=2$, so the Newton step is $0-(-6)/2=3$."
      },
      {
        "title": "Loss landscape curvature",
        "background": "ML practitioners use the quadratic Taylor term to reason about curvature near a trained model.",
        "numbers": "If $L(w)\\approx1+0.02(w-5)^2$, moving from $w=5$ to $w=6$ raises loss by $0.02$."
      },
      {
        "title": "Activation approximations",
        "background": "Hardware kernels approximate nonlinear activations by low-degree Taylor or minimax polynomials.",
        "numbers": "$e^{0.1}\\approx1+0.1+0.005+0.0001667=1.1051667$, close to $1.1051702$."
      },
      {
        "title": "Uncertainty estimates",
        "background": "The delta method uses Taylor expansion to move variance through a nonlinear function.",
        "numbers": "For $g(x)=x^2$ near $x=3$ with standard deviation $0.1$, $g'(3)=6$, so output standard deviation is about $0.6$."
      },
      {
        "title": "Physics simulation",
        "background": "Time-stepping methods use Taylor ideas to predict the next state from derivatives at the current state.",
        "numbers": "With position $0$, velocity $4$, acceleration $-2$, over $h=0.1$, $x\\approx0+4(0.1)+\\frac12(-2)(0.1)^2=0.39$."
      },
      {
        "title": "Robustness to perturbations",
        "background": "Taylor's first two terms estimate how much an input perturbation can change a model score.",
        "numbers": "If score gradient norm is $8$ and perturbation size is $0.01$, the first-order change is about $0.08$."
      }
    ],
    "applicationsClose": "Taylor series are local translators: derivatives become coefficients, and a curved function becomes a polynomial you can compute with.",
    "takeaways": [
      "Taylor series about $a$ use coefficients $f^{(n)}(a)/n!$.",
      "The polynomial matches the function's derivatives at the center.",
      "A Taylor series represents the function only where the remainder goes to zero."
    ]
  },
  "math-01-59": {
    "id": "math-01-59",
    "title": "Maclaurin series",
    "tagline": "Taylor series centered at zero give the familiar small-input formulas used everywhere in computing.",
    "connections": {
      "buildsOn": [
        "Taylor series",
        "power series",
        "derivatives at zero",
        "factorials"
      ],
      "leadsTo": [
        "small-angle approximations",
        "special function approximations",
        "automatic differentiation checks"
      ],
      "usedWith": [
        "radius of convergence",
        "remainder estimates",
        "even and odd functions",
        "polynomial arithmetic"
      ]
    },
    "motivation": "<p>Many computations care about what happens near zero: tiny angles, small perturbations, small learning-rate steps, small logit changes. Centering a Taylor series at zero makes the algebra especially clean.</p><p>A <b>Maclaurin series</b> is just a Taylor series with $a=0$. That small change creates the most famous formulas in calculus: $e^x$, $\\sin x$, $\\cos x$, and $\\ln(1+x)$ all become power series around the origin.</p>",
    "definition": "<p>The Maclaurin series of $f$ is $$\\sum_{n=0}^{\\infty}\\frac{f^{(n)}(0)}{n!}x^n.$$ Common examples are $$e^x=\\sum_{n=0}^{\\infty}\\frac{x^n}{n!},\\quad \\sin x=\\sum_{n=0}^{\\infty}(-1)^n\\frac{x^{2n+1}}{(2n+1)!},\\quad \\cos x=\\sum_{n=0}^{\\infty}(-1)^n\\frac{x^{2n}}{(2n)!}.$$</p><p><b>Assumptions that matter:</b> the center is fixed at zero, so accuracy is strongest near zero; each formula has its own interval of convergence; for $\\ln(1+x)$ and geometric-derived series, endpoints need separate care; truncation error depends on the first neglected terms.</p>",
    "worked": {
      "problem": "Find the Maclaurin series for $\\cos x$ and use four nonzero terms to approximate $\\cos(0.5)$.",
      "skills": [
        "derivative pattern",
        "factorials",
        "truncation"
      ],
      "strategy": "Track the derivatives at zero until the pattern repeats, then substitute $x=0.5$.",
      "steps": [
        {
          "do": "Evaluate $f(0)$",
          "result": "$\\cos0=1$",
          "why": "constant term"
        },
        {
          "do": "Differentiate once",
          "result": "$f'(x)=-\\sin x$",
          "why": "first derivative"
        },
        {
          "do": "Evaluate once",
          "result": "$f'(0)=0$",
          "why": "$\\sin0=0$"
        },
        {
          "do": "Differentiate twice",
          "result": "$f''(x)=-\\cos x$",
          "why": "second derivative"
        },
        {
          "do": "Evaluate twice",
          "result": "$f''(0)=-1$",
          "why": "$\\cos0=1$"
        },
        {
          "do": "Differentiate three times",
          "result": "$f'''(x)=\\sin x$",
          "why": "third derivative"
        },
        {
          "do": "Evaluate three times",
          "result": "$f'''(0)=0$",
          "why": "$\\sin0=0$"
        },
        {
          "do": "Continue the pattern",
          "result": "$1,0,-1,0,1,\\ldots$",
          "why": "only even powers survive"
        },
        {
          "do": "Write the series",
          "result": "$\\cos x=1-\\dfrac{x^2}{2!}+\\dfrac{x^4}{4!}-\\dfrac{x^6}{6!}+\\cdots$",
          "why": "coefficients are derivatives divided by factorials"
        },
        {
          "do": "Substitute $x=0.5$",
          "result": "$1-\\dfrac{0.25}{2}+\\dfrac{0.0625}{24}-\\dfrac{0.015625}{720}$",
          "why": "four nonzero terms"
        },
        {
          "do": "Evaluate",
          "result": "$0.8775825$",
          "why": "combine the decimal terms"
        }
      ],
      "verify": "A calculator gives $\\cos(0.5)\\approx0.8775826$, so four terms are already accurate to about seven decimal places.",
      "answer": "$\\cos x=\\sum_{n=0}^{\\infty}(-1)^n\\dfrac{x^{2n}}{(2n)!}$, and $\\cos(0.5)\\approx0.8775825$.",
      "connects": "Maclaurin series make small-input computation cheap because powers of small numbers shrink quickly."
    },
    "practice": [
      {
        "problem": "Write the first four nonzero terms of the Maclaurin series for $e^x$.",
        "steps": [
          {
            "do": "Recall the derivative pattern",
            "result": "$f^{(n)}(x)=e^x$",
            "why": "the exponential is unchanged by differentiation"
          },
          {
            "do": "Evaluate at zero",
            "result": "$f^{(n)}(0)=1$",
            "why": "$e^0=1$ for every order"
          },
          {
            "do": "Place into Maclaurin's formula",
            "result": "$\\sum_{n=0}^{\\infty}\\dfrac{x^n}{n!}$",
            "why": "each coefficient is $1/n!$"
          },
          {
            "do": "List terms",
            "result": "$1+x+\\dfrac{x^2}{2!}+\\dfrac{x^3}{3!}$",
            "why": "first four nonzero powers"
          },
          {
            "do": "Simplify factorials",
            "result": "$1+x+\\dfrac{x^2}{2}+\\dfrac{x^3}{6}$",
            "why": "$2!=2$ and $3!=6$"
          }
        ],
        "answer": "$1+x+\\frac{x^2}{2}+\\frac{x^3}{6}+\\cdots$."
      },
      {
        "problem": "Use $\\sin x\\approx x-x^3/6+x^5/120$ to approximate $\\sin(0.2)$.",
        "steps": [
          {
            "do": "Substitute $x=0.2$",
            "result": "$0.2-\\dfrac{0.2^3}{6}+\\dfrac{0.2^5}{120}$",
            "why": "use the three-term Maclaurin polynomial"
          },
          {
            "do": "Cube",
            "result": "$0.2^3=0.008$",
            "why": "cubic correction"
          },
          {
            "do": "Fifth power",
            "result": "$0.2^5=0.00032$",
            "why": "fifth-order correction"
          },
          {
            "do": "Divide",
            "result": "$0.008/6=0.0013333$ and $0.00032/120=0.000002667$",
            "why": "compute coefficients"
          },
          {
            "do": "Combine",
            "result": "$0.1986694$",
            "why": "add and subtract the corrections"
          }
        ],
        "answer": "$\\sin(0.2)\\approx0.1986694$."
      },
      {
        "problem": "Find the Maclaurin series for $\\dfrac{1}{1+x}$.",
        "steps": [
          {
            "do": "Start from the geometric series",
            "result": "$\\dfrac{1}{1-r}=\\sum_{n=0}^{\\infty}r^n$",
            "why": "valid when $|r|<1$"
          },
          {
            "do": "Match the denominator",
            "result": "$1+x=1-(-x)$",
            "why": "rewrite as $1-r$"
          },
          {
            "do": "Substitute $r=-x$",
            "result": "$\\dfrac{1}{1+x}=\\sum_{n=0}^{\\infty}(-x)^n$",
            "why": "geometric substitution"
          },
          {
            "do": "Expand terms",
            "result": "$1-x+x^2-x^3+\\cdots$",
            "why": "powers of $-x$ alternate"
          },
          {
            "do": "State the condition",
            "result": "$|x|<1$",
            "why": "inherited from $|r|<1$"
          }
        ],
        "answer": "$1-x+x^2-x^3+\\cdots$ for $|x|<1$."
      },
      {
        "problem": "Use a Maclaurin series to approximate $\\ln(1.1)$ with three nonzero terms.",
        "steps": [
          {
            "do": "Recall the series",
            "result": "$\\ln(1+x)=x-\\dfrac{x^2}{2}+\\dfrac{x^3}{3}-\\cdots$",
            "why": "from integrating the geometric series"
          },
          {
            "do": "Set $x=0.1$",
            "result": "$\\ln(1.1)=0.1-\\dfrac{0.1^2}{2}+\\dfrac{0.1^3}{3}-\\cdots$",
            "why": "the input is near zero"
          },
          {
            "do": "Compute powers",
            "result": "$0.1^2=0.01$ and $0.1^3=0.001$",
            "why": "needed terms"
          },
          {
            "do": "Apply coefficients",
            "result": "$0.1-0.005+0.0003333$",
            "why": "divide by $2$ and $3$"
          },
          {
            "do": "Combine",
            "result": "$0.0953333$",
            "why": "three nonzero terms"
          }
        ],
        "answer": "$\\ln(1.1)\\approx0.0953333$."
      },
      {
        "problem": "For small logits, approximate $\\sigma(z)=1/(1+e^{-z})$ near $z=0$ using $\\sigma(0)$ and $\\sigma'(0)$.",
        "steps": [
          {
            "do": "Evaluate the sigmoid",
            "result": "$\\sigma(0)=\\dfrac{1}{1+1}=\\frac12$",
            "why": "constant term"
          },
          {
            "do": "Use the derivative formula",
            "result": "$\\sigma'(z)=\\sigma(z)(1-\\sigma(z))$",
            "why": "standard sigmoid derivative"
          },
          {
            "do": "Evaluate the derivative",
            "result": "$\\sigma'(0)=\\frac12(1-\\frac12)=\\frac14$",
            "why": "substitute $\\sigma(0)=1/2$"
          },
          {
            "do": "Write the linear Maclaurin approximation",
            "result": "$\\sigma(z)\\approx\\frac12+\\frac14z$",
            "why": "keep terms through degree $1$"
          },
          {
            "do": "Test at $z=0.2$",
            "result": "$0.5+0.25(0.2)=0.55$",
            "why": "small-logit estimate"
          }
        ],
        "answer": "$\\sigma(z)\\approx\\frac12+\\frac14z$ near zero; at $0.2$ this gives $0.55$."
      }
    ],
    "applications": [
      {
        "title": "Small-angle approximations",
        "background": "Robotics and graphics often use small-angle formulas to simplify rotations.",
        "numbers": "At $x=0.05$, $\\sin x\\approx x=0.05$ while the true value is $0.0499792$, an error about $2.08\\times10^{-5}$."
      },
      {
        "title": "Fast exponential estimates",
        "background": "Softmax and probability code often approximate exponentials in controlled ranges.",
        "numbers": "$e^{0.1}\\approx1+0.1+0.005+0.0001667=1.1051667$, within $0.0000035$ of the true value."
      },
      {
        "title": "Logarithm compression",
        "background": "Log transforms convert multiplicative changes into additive ones; near $1$, Maclaurin gives quick estimates.",
        "numbers": "$\\ln(1.02)\\approx0.02-0.0002+0.00000267=0.0198027$."
      },
      {
        "title": "Sigmoid near zero",
        "background": "A classifier logit near zero has probability near one half, with slope one quarter.",
        "numbers": "For logit $0.4$, the linear estimate gives $0.5+0.1=0.6$; true sigmoid is about $0.5987$."
      },
      {
        "title": "Cosine similarity perturbations",
        "background": "When embeddings rotate by a small angle, cosine changes quadratically, not linearly.",
        "numbers": "$\\cos(0.1)\\approx1-0.1^2/2=0.995$, close to $0.995004$."
      },
      {
        "title": "Gradient checking",
        "background": "Finite difference checks rely on Maclaurin expansion to explain why central differences cancel even-order error terms.",
        "numbers": "For $f(x+h)-f(x-h)$, the $h^2$ terms cancel, leaving $2hf'(x)+O(h^3)$; with $h=10^{-3}$, leading error is on the order of $10^{-6}$."
      }
    ],
    "applicationsClose": "Maclaurin series are the small-input language of computation: when zero is nearby, powers become cheap, accurate corrections.",
    "takeaways": [
      "A Maclaurin series is a Taylor series centered at $0$.",
      "The core formulas for $e^x$, $\\sin x$, $\\cos x$, and $\\ln(1+x)$ come from derivatives at zero.",
      "Accuracy is strongest near zero and must respect the interval of convergence."
    ]
  },
  "math-01-60": {
    "id": "math-01-60",
    "title": "Numerical differentiation",
    "tagline": "Estimate a derivative from nearby function values, while balancing truncation error against roundoff error.",
    "connections": {
      "buildsOn": [
        "derivative as a limit",
        "Taylor series",
        "limits",
        "function evaluation"
      ],
      "leadsTo": [
        "numerical integration",
        "gradient checking",
        "automatic differentiation"
      ],
      "usedWith": [
        "finite differences",
        "Taylor error terms",
        "floating-point arithmetic",
        "partial derivatives"
      ]
    },
    "motivation": "<p>Sometimes you can evaluate a function but cannot easily differentiate it. Maybe it is a simulator, a legacy model, or a complicated metric. The derivative is still useful because it tells you local sensitivity.</p><p><b>Numerical differentiation</b> estimates that sensitivity by sampling nearby points. The art is choosing a step size $h$: too large and the secant line is crude; too small and floating-point subtraction erases useful digits.</p>",
    "definition": "<p>The forward difference estimates $$f'(x)\\approx\\frac{f(x+h)-f(x)}{h},$$ with error of order $h$. The central difference estimates $$f'(x)\\approx\\frac{f(x+h)-f(x-h)}{2h},$$ with error of order $h^2$ for smooth $f$. Taylor expansion explains this: $f(x+h)=f(x)+hf'(x)+\\frac{h^2}{2}f''(x)+\\cdots$.</p><p><b>Assumptions that matter:</b> the function should be smooth near $x$; $h$ must be small but not so small that roundoff dominates; central differences need two function evaluations; nondifferentiable points cannot be fixed by a formula.</p>",
    "worked": {
      "problem": "Estimate $f'(2)$ for $f(x)=x^3$ using the central difference with $h=0.01$.",
      "skills": [
        "central difference",
        "function evaluation",
        "error awareness"
      ],
      "strategy": "Evaluate the function once to the right and once to the left, then divide the symmetric change by $2h$.",
      "steps": [
        {
          "do": "Compute the right input",
          "result": "$2+h=2.01$",
          "why": "central difference samples to the right"
        },
        {
          "do": "Evaluate the right value",
          "result": "$f(2.01)=2.01^3=8.120601$",
          "why": "cube the right input"
        },
        {
          "do": "Compute the left input",
          "result": "$2-h=1.99$",
          "why": "central difference samples to the left"
        },
        {
          "do": "Evaluate the left value",
          "result": "$f(1.99)=1.99^3=7.880599$",
          "why": "cube the left input"
        },
        {
          "do": "Subtract the values",
          "result": "$8.120601-7.880599=0.240002$",
          "why": "symmetric change in output"
        },
        {
          "do": "Compute the denominator",
          "result": "$2h=0.02$",
          "why": "central difference spans width $2h$"
        },
        {
          "do": "Divide",
          "result": "$0.240002/0.02=12.0001$",
          "why": "slope estimate"
        }
      ],
      "verify": "The exact derivative is $f'(x)=3x^2$, so $f'(2)=12$. The estimate $12.0001$ is off by $0.0001$.",
      "answer": "$f'(2)\\approx12.0001$ using central difference with $h=0.01$.",
      "connects": "Finite differences are derivatives with a finite step; Taylor series explains the error."
    },
    "practice": [
      {
        "problem": "Estimate $f'(1)$ for $f(x)=x^2$ using forward difference with $h=0.1$.",
        "steps": [
          {
            "do": "Compute the right input",
            "result": "$1+h=1.1$",
            "why": "forward difference looks ahead"
          },
          {
            "do": "Evaluate the right value",
            "result": "$f(1.1)=1.21$",
            "why": "square $1.1$"
          },
          {
            "do": "Evaluate the base value",
            "result": "$f(1)=1$",
            "why": "starting value"
          },
          {
            "do": "Subtract",
            "result": "$1.21-1=0.21$",
            "why": "change in output"
          },
          {
            "do": "Divide by $h$",
            "result": "$0.21/0.1=2.1$",
            "why": "slope estimate"
          }
        ],
        "answer": "$f'(1)\\approx2.1$; the exact value is $2$."
      },
      {
        "problem": "Estimate $\\frac{d}{dx}\\sin x$ at $x=0$ using central difference with $h=0.01$.",
        "steps": [
          {
            "do": "Write the central formula",
            "result": "$\\dfrac{\\sin(0.01)-\\sin(-0.01)}{0.02}$",
            "why": "use $2h=0.02$"
          },
          {
            "do": "Use odd symmetry",
            "result": "$\\sin(-0.01)=-\\sin(0.01)$",
            "why": "sine is odd"
          },
          {
            "do": "Simplify the numerator",
            "result": "$2\\sin(0.01)$",
            "why": "subtracting the negative doubles it"
          },
          {
            "do": "Approximate $\\sin(0.01)$",
            "result": "$0.0099998333$",
            "why": "small-angle value"
          },
          {
            "do": "Divide",
            "result": "$0.0199996666/0.02=0.99998333$",
            "why": "central estimate"
          }
        ],
        "answer": "Approximately $0.99998333$, close to the exact derivative $1$."
      },
      {
        "problem": "Use $f(x)=e^x$, $x=0$, and forward difference with $h=0.001$.",
        "steps": [
          {
            "do": "Write the estimate",
            "result": "$\\dfrac{e^{0.001}-e^0}{0.001}$",
            "why": "forward difference formula"
          },
          {
            "do": "Evaluate $e^0$",
            "result": "$1$",
            "why": "base value"
          },
          {
            "do": "Approximate $e^{0.001}$",
            "result": "$1.0010005001667$",
            "why": "small exponential expansion"
          },
          {
            "do": "Subtract",
            "result": "$0.0010005001667$",
            "why": "change in output"
          },
          {
            "do": "Divide",
            "result": "$1.0005001667$",
            "why": "slope estimate"
          }
        ],
        "answer": "$e'(0)\\approx1.0005001667$; exact is $1$."
      },
      {
        "problem": "Estimate $f'(3)$ for $f(x)=\\ln x$ using central difference with $h=0.1$.",
        "steps": [
          {
            "do": "Compute the sampled inputs",
            "result": "$3.1$ and $2.9$",
            "why": "move right and left by $0.1$"
          },
          {
            "do": "Evaluate the logs",
            "result": "$\\ln(3.1)\\approx1.131402$ and $\\ln(2.9)\\approx1.064711$",
            "why": "function values"
          },
          {
            "do": "Subtract",
            "result": "$1.131402-1.064711=0.066691$",
            "why": "symmetric output change"
          },
          {
            "do": "Compute the denominator",
            "result": "$2h=0.2$",
            "why": "central span"
          },
          {
            "do": "Divide",
            "result": "$0.066691/0.2=0.333455$",
            "why": "slope estimate"
          }
        ],
        "answer": "$f'(3)\\approx0.333455$, close to exact $1/3$."
      },
      {
        "problem": "A scalar loss has $L(1.001)=2.006003$, $L(0.999)=1.994003$. Estimate $L'(1)$ by central difference with $h=0.001$.",
        "steps": [
          {
            "do": "Write the formula",
            "result": "$\\dfrac{L(1.001)-L(0.999)}{2(0.001)}$",
            "why": "central difference around $1$"
          },
          {
            "do": "Substitute values",
            "result": "$\\dfrac{2.006003-1.994003}{0.002}$",
            "why": "use the measured losses"
          },
          {
            "do": "Subtract",
            "result": "$0.012000$",
            "why": "change in loss"
          },
          {
            "do": "Divide",
            "result": "$0.012/0.002=6$",
            "why": "gradient estimate"
          },
          {
            "do": "Interpret",
            "result": "a unit increase in the parameter raises loss by about $6$ locally",
            "why": "the derivative is local sensitivity"
          }
        ],
        "answer": "$L'(1)\\approx6$."
      }
    ],
    "applications": [
      {
        "title": "Gradient checking",
        "background": "Before trusting backprop, engineers compare analytic gradients with finite-difference estimates.",
        "numbers": "If backprop gives $3.0000$ and central difference gives $3.0002$, relative error is about $0.0002/3.0001\\approx6.7\\times10^{-5}$."
      },
      {
        "title": "Sensitivity of simulations",
        "background": "A simulator may expose outputs but not derivatives, so finite differences estimate how inputs affect results.",
        "numbers": "If drag at $v=10.01$ is $50.10005$ and at $9.99$ is $49.90005$, the derivative is $0.2/0.02=10$."
      },
      {
        "title": "Hyperparameter response",
        "background": "Teams sometimes estimate how validation loss changes with a hyperparameter when analytic gradients are unavailable.",
        "numbers": "Loss $0.421$ at $\\lambda=0.011$ and $0.425$ at $0.009$ gives slope $(0.421-0.425)/0.002=-2$."
      },
      {
        "title": "Image gradients",
        "background": "Edge detectors approximate spatial derivatives of pixel intensity.",
        "numbers": "Neighboring pixels $120$ and $100$ two pixels apart give central difference $(120-100)/2=10$ intensity units per pixel."
      },
      {
        "title": "Numerical stability",
        "background": "Choosing $h$ is a tradeoff: truncation error falls as $h$ shrinks, roundoff error grows when subtracting nearly equal numbers.",
        "numbers": "For central differences in double precision, a common scale is $h\\approx10^{-5}$ to $10^{-6}$; at $h=10^{-12}$, subtractive cancellation can dominate."
      },
      {
        "title": "Nondifferentiable losses",
        "background": "Finite differences reveal corners rather than hiding them.",
        "numbers": "For $f(x)=|x|$ at $0$, forward difference with $h=0.01$ gives $1$, backward gives $-1$, so there is no single derivative."
      }
    ],
    "applicationsClose": "Numerical differentiation is beautifully simple, but its reliability comes from respecting smoothness, step size, and floating-point limits.",
    "takeaways": [
      "Forward difference has error order $h$; central difference has error order $h^2$ for smooth functions.",
      "Too-large $h$ causes truncation error; too-small $h$ causes roundoff error.",
      "Finite differences are central to gradient checking and black-box sensitivity analysis."
    ]
  },
  "math-01-61": {
    "id": "math-01-61",
    "title": "Numerical integration",
    "tagline": "Approximate accumulated area from function samples when an exact antiderivative is unavailable or unnecessary.",
    "connections": {
      "buildsOn": [
        "definite integrals",
        "Riemann sums",
        "Taylor series",
        "numerical differentiation"
      ],
      "leadsTo": [
        "quadrature",
        "Monte Carlo integration",
        "differential equation solvers"
      ],
      "usedWith": [
        "trapezoidal rule",
        "Simpson's rule",
        "error estimates",
        "sampling grids"
      ]
    },
    "motivation": "<p>Definite integrals measure accumulation: area, probability, work, total error. But many useful functions do not have a pleasant antiderivative, and measured data may arrive only as samples.</p><p><b>Numerical integration</b> replaces the curve by simple shapes. Rectangles are the first idea; trapezoids use straight-line tops; Simpson's rule uses parabolas. Each method turns continuous accumulation into arithmetic.</p>",
    "definition": "<p>On $[a,b]$ with $n$ equal subintervals of width $h=(b-a)/n$, the trapezoidal rule is $$\\int_a^b f(x)\\,dx\\approx h\\left[\\frac{f(a)+f(b)}{2}+\\sum_{k=1}^{n-1}f(a+kh)\\right].$$ For even $n$, Simpson's rule is $$\\int_a^b f(x)\\,dx\\approx\\frac{h}{3}\\left[f(x_0)+4f(x_1)+2f(x_2)+\\cdots+4f(x_{n-1})+f(x_n)\\right].$$</p><p><b>Assumptions that matter:</b> smooth functions give faster convergence; Simpson's rule needs an even number of subintervals; discontinuities and sharp spikes require care; sampled data limits which rule is possible; roundoff can matter when using extremely fine grids.</p>",
    "worked": {
      "problem": "Approximate $\\displaystyle\\int_0^1 x^2\\,dx$ using Simpson's rule with $n=2$.",
      "skills": [
        "Simpson's rule",
        "function sampling",
        "weighted sums"
      ],
      "strategy": "Use three points, weight the middle by $4$, and multiply by $h/3$.",
      "steps": [
        {
          "do": "Compute the step width",
          "result": "$h=(1-0)/2=0.5$",
          "why": "two equal subintervals"
        },
        {
          "do": "List the nodes",
          "result": "$x_0=0,\\ x_1=0.5,\\ x_2=1$",
          "why": "Simpson's rule uses endpoints and midpoint"
        },
        {
          "do": "Evaluate the function",
          "result": "$f(0)=0,\\ f(0.5)=0.25,\\ f(1)=1$",
          "why": "square each node"
        },
        {
          "do": "Apply Simpson weights",
          "result": "$0+4(0.25)+1$",
          "why": "middle point has weight $4$"
        },
        {
          "do": "Sum the bracket",
          "result": "$2$",
          "why": "$4(0.25)=1$"
        },
        {
          "do": "Multiply by $h/3$",
          "result": "$\\dfrac{0.5}{3}\\cdot2=\\frac13$",
          "why": "final Simpson scaling"
        }
      ],
      "verify": "The exact integral is $x^3/3$ from $0$ to $1$, which is $1/3$. Simpson's rule is exact here because $x^2$ is a polynomial of degree $2$.",
      "answer": "$\\displaystyle\\int_0^1x^2\\,dx\\approx\\frac13$.",
      "connects": "Numerical integration converts area into sampled values plus weights."
    },
    "practice": [
      {
        "problem": "Approximate $\\int_0^1 x\\,dx$ using the trapezoidal rule with $n=1$.",
        "steps": [
          {
            "do": "Compute the width",
            "result": "$h=1$",
            "why": "one interval from $0$ to $1$"
          },
          {
            "do": "Evaluate endpoints",
            "result": "$f(0)=0$ and $f(1)=1$",
            "why": "endpoint samples"
          },
          {
            "do": "Average endpoint heights",
            "result": "$(0+1)/2=0.5$",
            "why": "a trapezoid uses the average height"
          },
          {
            "do": "Multiply by width",
            "result": "$1\\cdot0.5=0.5$",
            "why": "area of the trapezoid"
          },
          {
            "do": "Compare to exact shape",
            "result": "a triangle of base $1$ and height $1$",
            "why": "area is also $1/2$"
          }
        ],
        "answer": "$0.5$."
      },
      {
        "problem": "Approximate $\\int_0^2 x^2\\,dx$ using the trapezoidal rule with $n=2$.",
        "steps": [
          {
            "do": "Compute the width",
            "result": "$h=(2-0)/2=1$",
            "why": "two subintervals"
          },
          {
            "do": "List nodes",
            "result": "$0,1,2$",
            "why": "equally spaced grid"
          },
          {
            "do": "Evaluate",
            "result": "$f(0)=0,\\ f(1)=1,\\ f(2)=4$",
            "why": "square each node"
          },
          {
            "do": "Apply trapezoidal rule",
            "result": "$1\\left[\\frac{0+4}{2}+1\\right]$",
            "why": "endpoints half weight, interior full weight"
          },
          {
            "do": "Evaluate",
            "result": "$3$",
            "why": "$2+1=3$"
          }
        ],
        "answer": "The trapezoidal estimate is $3$; exact value is $8/3$."
      },
      {
        "problem": "Approximate $\\int_0^{\\pi}\\sin x\\,dx$ using Simpson's rule with $n=2$.",
        "steps": [
          {
            "do": "Compute the width",
            "result": "$h=\\pi/2$",
            "why": "two equal subintervals"
          },
          {
            "do": "List nodes",
            "result": "$0,\\ \\pi/2,\\ \\pi$",
            "why": "endpoints and midpoint"
          },
          {
            "do": "Evaluate sine",
            "result": "$0,\\ 1,\\ 0$",
            "why": "standard sine values"
          },
          {
            "do": "Apply Simpson weights",
            "result": "$\\frac{\\pi/2}{3}[0+4(1)+0]$",
            "why": "middle point weight $4$"
          },
          {
            "do": "Simplify",
            "result": "$\\frac{2\\pi}{3}\\approx2.094$",
            "why": "multiply the constants"
          }
        ],
        "answer": "Simpson estimate $2\\pi/3\\approx2.094$; exact value is $2$."
      },
      {
        "problem": "Use the midpoint rule with four rectangles to approximate $\\int_0^1 e^x\\,dx$.",
        "steps": [
          {
            "do": "Compute the width",
            "result": "$h=1/4=0.25$",
            "why": "four equal rectangles"
          },
          {
            "do": "List midpoints",
            "result": "$0.125,0.375,0.625,0.875$",
            "why": "middle of each subinterval"
          },
          {
            "do": "Evaluate approximately",
            "result": "$1.1331,1.4550,1.8682,2.3989$",
            "why": "values of $e^x$ at the midpoints"
          },
          {
            "do": "Sum values",
            "result": "$6.8552$",
            "why": "total sampled height"
          },
          {
            "do": "Multiply by width",
            "result": "$0.25(6.8552)=1.7138$",
            "why": "midpoint estimate"
          }
        ],
        "answer": "Approximately $1.7138$; exact $e-1\\approx1.7183$."
      },
      {
        "problem": "A validation curve has losses $0.80,0.62,0.55,0.53,0.52$ at epochs $0,1,2,3,4$. Approximate area under loss by the trapezoidal rule.",
        "steps": [
          {
            "do": "Set the width",
            "result": "$h=1$ epoch",
            "why": "samples are one epoch apart"
          },
          {
            "do": "Half-weight endpoints",
            "result": "$(0.80+0.52)/2=0.66$",
            "why": "trapezoidal endpoints count half"
          },
          {
            "do": "Sum interior values",
            "result": "$0.62+0.55+0.53=1.70$",
            "why": "middle samples count fully"
          },
          {
            "do": "Add bracket terms",
            "result": "$0.66+1.70=2.36$",
            "why": "total weighted height"
          },
          {
            "do": "Multiply by width",
            "result": "$1\\cdot2.36=2.36$",
            "why": "area in loss-epochs"
          }
        ],
        "answer": "Approximate area under the loss curve is $2.36$ loss-epochs."
      }
    ],
    "applications": [
      {
        "title": "Area under curves",
        "background": "Metrics like AUC summarize a curve by accumulated area, often from sampled points.",
        "numbers": "For ROC points with trapezoids of widths $0.2$ and average heights $0.7,0.85,0.9,0.95,1.0$, AUC estimate is $0.2(4.4)=0.88$."
      },
      {
        "title": "Expected values",
        "background": "Continuous expectations are integrals, and numerical quadrature estimates them when formulas are difficult.",
        "numbers": "For three-point grid weights $0.25,0.5,0.25$ and values $1,4,9$, estimated expectation is $0.25+2+2.25=4.5$."
      },
      {
        "title": "Physics and robotics",
        "background": "Position is the integral of velocity; sampled sensor velocities require numerical integration.",
        "numbers": "Velocities $0,2,3$ m/s at times $0,1,2$ give trapezoid distance $1[(0+3)/2+2]=3.5$ m."
      },
      {
        "title": "Training diagnostics",
        "background": "Area under a loss curve measures total training cost over time, not just final loss.",
        "numbers": "Losses $1.0,0.7,0.6$ over two hours give trapezoid area $1[(1.0+0.6)/2+0.7]=1.5$ loss-hours."
      },
      {
        "title": "Bayesian normalization",
        "background": "Posterior densities often need a normalizing integral that is unavailable in closed form.",
        "numbers": "Grid density values $0.1,0.4,0.1$ over width $0.5$ give trapezoid mass $0.5[(0.1+0.1)/2+0.4]=0.25$."
      },
      {
        "title": "Monte Carlo integration",
        "background": "High-dimensional integrals are often estimated by random samples rather than grids.",
        "numbers": "If sampled values average $0.37$ over a unit square, the Monte Carlo integral estimate is $0.37\\cdot1=0.37$; with $10,000$ samples, random error often scales like $1/100$."
      }
    ],
    "applicationsClose": "Numerical integration is accumulation by samples: choose shapes, apply weights, and keep an honest eye on error.",
    "takeaways": [
      "Trapezoidal and Simpson's rules approximate integrals with weighted function samples.",
      "Smaller grid spacing usually improves accuracy, but smoothness and roundoff matter.",
      "Many ML metrics, expectations, and diagnostics are numerical integrals in practice."
    ]
  },
  "math-01-62": {
    "id": "math-01-62",
    "title": "Backpropagation as the chain rule",
    "tagline": "Backprop is not magic; it is the chain rule organized so every intermediate value shares its gradient once.",
    "connections": {
      "buildsOn": [
        "the chain rule",
        "derivatives",
        "partial derivatives",
        "numerical differentiation"
      ],
      "leadsTo": [
        "gradient descent",
        "automatic differentiation",
        "deep neural networks",
        "optimization in ML"
      ],
      "usedWith": [
        "computational graphs",
        "Jacobians",
        "matrix multiplication",
        "Taylor linearization"
      ]
    },
    "motivation": "<p>You already know the chain rule for a composition like $f(g(x))$: multiply the outside derivative by the inside derivative. A neural network is just a large composition with many shared intermediate values.</p><p><b>Backpropagation</b> is the chain rule with bookkeeping. First we run forward and store intermediate values. Then we run backward, passing sensitivities from the loss to each parameter. The warmth of the idea is this: every node only needs to know how its own output changes with its inputs.</p>",
    "definition": "<p>For a computational graph ending in loss $L$, the backward value at a node $v$ is its adjoint $\\bar v=\\partial L/\\partial v$. If $u$ feeds into children $v_1,\\ldots,v_k$, the multivariable chain rule gives $$\\bar u=\\sum_{j=1}^{k}\\bar v_j\\frac{\\partial v_j}{\\partial u}.$$ For a layer $z=wx+b$ followed by activation $a=\\phi(z)$, backprop sends $\\bar z=\\bar a\\,\\phi'(z)$, then $\\partial L/\\partial w=\\bar z\\,x$, $\\partial L/\\partial b=\\bar z$, and $\\bar x=\\bar z\\,w$.</p><p><b>Assumptions that matter:</b> operations must be differentiable where gradients are taken, or have a chosen subgradient; dimensions must match; cached forward values are needed for local derivatives; gradients can vanish or explode through repeated multiplication; numerical gradient checks validate implementation but are too slow for training.</p>",
    "worked": {
      "problem": "Backpropagate through a tiny 2-layer network: $x=2$, $w_1=0.5$, $b_1=0.1$, $a=w_1x+b_1$, ReLU $h=\\max(0,a)$, $w_2=-1.5$, $b_2=0.2$, output $y=w_2h+b_2$, target $t=-1$, loss $L=\\frac12(y-t)^2$. Find gradients for all four parameters.",
      "skills": [
        "computational graph",
        "chain rule",
        "ReLU derivative",
        "parameter gradients"
      ],
      "strategy": "Do one clean forward pass, then move backward from $L$ to $y$ to the second layer to ReLU to the first layer.",
      "steps": [
        {
          "do": "Compute first pre-activation",
          "result": "$a=0.5(2)+0.1=1.1$",
          "why": "linear layer uses $w_1x+b_1$"
        },
        {
          "do": "Apply ReLU",
          "result": "$h=\\max(0,1.1)=1.1$",
          "why": "positive inputs pass through unchanged"
        },
        {
          "do": "Compute output",
          "result": "$y=-1.5(1.1)+0.2=-1.45$",
          "why": "second linear layer"
        },
        {
          "do": "Compute prediction error",
          "result": "$y-t=-1.45-(-1)=-0.45$",
          "why": "squared loss depends on this residual"
        },
        {
          "do": "Compute loss",
          "result": "$L=\\frac12(-0.45)^2=0.10125$",
          "why": "half squared error"
        },
        {
          "do": "Start backward at the loss",
          "result": "$\\bar y=\\partial L/\\partial y=y-t=-0.45$",
          "why": "derivative of $\\frac12(y-t)^2$"
        },
        {
          "do": "Differentiate with respect to $w_2$",
          "result": "$\\partial L/\\partial w_2=\\bar y\\,h=(-0.45)(1.1)=-0.495$",
          "why": "local derivative of $y$ with respect to $w_2$ is $h$"
        },
        {
          "do": "Differentiate with respect to $b_2$",
          "result": "$\\partial L/\\partial b_2=\\bar y=-0.45$",
          "why": "local derivative of $y$ with respect to $b_2$ is $1$"
        },
        {
          "do": "Pass gradient to $h$",
          "result": "$\\bar h=\\bar y\\,w_2=(-0.45)(-1.5)=0.675$",
          "why": "local derivative of $y$ with respect to $h$ is $w_2$"
        },
        {
          "do": "Differentiate ReLU",
          "result": "$\\partial h/\\partial a=1$",
          "why": "$a=1.1>0$"
        },
        {
          "do": "Pass gradient to $a$",
          "result": "$\\bar a=\\bar h\\cdot1=0.675$",
          "why": "chain through the activation"
        },
        {
          "do": "Differentiate with respect to $w_1$",
          "result": "$\\partial L/\\partial w_1=\\bar a\\,x=0.675(2)=1.35$",
          "why": "local derivative of $a$ with respect to $w_1$ is $x$"
        },
        {
          "do": "Differentiate with respect to $b_1$",
          "result": "$\\partial L/\\partial b_1=\\bar a=0.675$",
          "why": "local derivative of $a$ with respect to $b_1$ is $1$"
        }
      ],
      "verify": "A small gradient-descent step with learning rate $0.1$ gives $w_2=-1.4505$, $b_2=0.245$, $w_1=0.365$, $b_1=0.0325$. The output moves from $-1.45$ to about $-1.355$, closer to target $-1$ and with lower loss.",
      "answer": "$\nabla L=(\\partial L/\\partial w_1,\\partial L/\\partial b_1,\\partial L/\\partial w_2,\\partial L/\\partial b_2)=(1.35,0.675,-0.495,-0.45)$.",
      "connects": "Backprop is the chain rule flowing backward through a computational graph, reusing each local derivative exactly where it is needed."
    },
    "practice": [
      {
        "problem": "Let $u=3x$, $v=u^2$, $L=v$ with $x=2$. Compute $dL/dx$ by backprop.",
        "steps": [
          {
            "do": "Forward compute $u$",
            "result": "$u=3(2)=6$",
            "why": "first operation"
          },
          {
            "do": "Forward compute $v$",
            "result": "$v=6^2=36$",
            "why": "second operation"
          },
          {
            "do": "Start backward",
            "result": "$\\bar v=1$",
            "why": "$L=v$"
          },
          {
            "do": "Pass to $u$",
            "result": "$\\bar u=\\bar v\\cdot2u=1\\cdot12=12$",
            "why": "derivative of $u^2$ is $2u$"
          },
          {
            "do": "Pass to $x$",
            "result": "$\\bar x=\\bar u\\cdot3=36$",
            "why": "derivative of $3x$ is $3$"
          }
        ],
        "answer": "$dL/dx=36$."
      },
      {
        "problem": "For $z=wx+b$, $L=\\frac12(z-t)^2$ with $x=4$, $w=0.25$, $b=0.5$, $t=2$, find $\\partial L/\\partial w$ and $\\partial L/\\partial b$.",
        "steps": [
          {
            "do": "Compute $z$",
            "result": "$z=0.25(4)+0.5=1.5$",
            "why": "forward linear output"
          },
          {
            "do": "Compute residual",
            "result": "$z-t=1.5-2=-0.5$",
            "why": "loss depends on the residual"
          },
          {
            "do": "Start backward",
            "result": "$\\bar z=z-t=-0.5$",
            "why": "derivative of half squared error"
          },
          {
            "do": "Gradient for $w$",
            "result": "$\\partial L/\\partial w=\\bar z\\,x=(-0.5)(4)=-2$",
            "why": "local derivative of $z$ with respect to $w$ is $x$"
          },
          {
            "do": "Gradient for $b$",
            "result": "$\\partial L/\\partial b=\\bar z=-0.5$",
            "why": "local derivative of $z$ with respect to $b$ is $1$"
          }
        ],
        "answer": "$\\partial L/\\partial w=-2$, $\\partial L/\\partial b=-0.5$."
      },
      {
        "problem": "Let $a=-0.3$, $h=\\operatorname{ReLU}(a)$, $y=2h$, and $L=y^2$. Find $dL/da$.",
        "steps": [
          {
            "do": "Apply ReLU",
            "result": "$h=0$",
            "why": "negative pre-activation is clipped"
          },
          {
            "do": "Compute output",
            "result": "$y=2(0)=0$",
            "why": "linear output after ReLU"
          },
          {
            "do": "Start backward",
            "result": "$\\bar y=2y=0$",
            "why": "derivative of $y^2$"
          },
          {
            "do": "Pass to $h$",
            "result": "$\\bar h=\\bar y\\cdot2=0$",
            "why": "local derivative of $2h$ is $2$"
          },
          {
            "do": "Differentiate ReLU",
            "result": "$\\partial h/\\partial a=0$",
            "why": "$a<0$"
          },
          {
            "do": "Pass to $a$",
            "result": "$\\bar a=0\\cdot0=0$",
            "why": "the inactive ReLU blocks the gradient"
          }
        ],
        "answer": "$dL/da=0$."
      },
      {
        "problem": "For $s=w_1x_1+w_2x_2+b$, $p=\\sigma(s)$, $L=-\\ln p$ with $x_1=1$, $x_2=2$, $w_1=0.4$, $w_2=-0.1$, $b=0$, compute gradients.",
        "steps": [
          {
            "do": "Compute the logit",
            "result": "$s=0.4(1)-0.1(2)+0=0.2$",
            "why": "linear score"
          },
          {
            "do": "Compute the probability",
            "result": "$p=\\sigma(0.2)\\approx0.5498$",
            "why": "sigmoid output"
          },
          {
            "do": "Use the logistic-loss gradient",
            "result": "$\\bar s=p-1\\approx-0.4502$",
            "why": "for target $1$, cross-entropy with sigmoid simplifies"
          },
          {
            "do": "Gradient for $w_1$",
            "result": "$\\partial L/\\partial w_1=\\bar s x_1=-0.4502$",
            "why": "local derivative of $s$ with respect to $w_1$ is $x_1$"
          },
          {
            "do": "Gradient for $w_2$",
            "result": "$\\partial L/\\partial w_2=\\bar s x_2=-0.9004$",
            "why": "local derivative of $s$ with respect to $w_2$ is $x_2$"
          },
          {
            "do": "Gradient for $b$",
            "result": "$\\partial L/\\partial b=\\bar s=-0.4502$",
            "why": "local derivative of $s$ with respect to $b$ is $1$"
          }
        ],
        "answer": "Approximately $(-0.4502,-0.9004,-0.4502)$ for $(w_1,w_2,b)$."
      },
      {
        "problem": "Gradient-check the worked example's $w_2$ using $h=0.001$, with all other values fixed. Compare to backprop's $-0.495$.",
        "steps": [
          {
            "do": "Perturb upward",
            "result": "$w_2^+=-1.499$",
            "why": "add $0.001$ to $w_2$"
          },
          {
            "do": "Compute upward output",
            "result": "$y^+=-1.499(1.1)+0.2=-1.4489$",
            "why": "reuse cached $h=1.1$"
          },
          {
            "do": "Compute upward loss",
            "result": "$L^+=\\frac12(-1.4489+1)^2\\approx0.1007556$",
            "why": "target is $-1$"
          },
          {
            "do": "Perturb downward",
            "result": "$w_2^-=-1.501$",
            "why": "subtract $0.001$ from $w_2$"
          },
          {
            "do": "Compute downward output",
            "result": "$y^-=-1.501(1.1)+0.2=-1.4511$",
            "why": "reuse cached $h=1.1$"
          },
          {
            "do": "Compute downward loss",
            "result": "$L^-=\\frac12(-1.4511+1)^2\\approx0.1017456$",
            "why": "target is $-1$"
          },
          {
            "do": "Apply central difference",
            "result": "$\\dfrac{L^+-L^-}{0.002}\\approx-0.495$",
            "why": "finite difference estimates the gradient"
          }
        ],
        "answer": "The gradient check gives about $-0.495$, matching backprop."
      }
    ],
    "applications": [
      {
        "title": "Training neural networks",
        "background": "Backprop makes deep learning practical by computing all parameter gradients in roughly the cost of one forward pass plus one backward pass.",
        "numbers": "A model with $10^7$ parameters would need about $2\\times10^7$ loss evaluations for central-difference gradients, but backprop gets all gradients with one forward and one backward sweep."
      },
      {
        "title": "Automatic differentiation",
        "background": "Modern frameworks build a computational graph and apply the same chain-rule bookkeeping automatically.",
        "numbers": "For $y=(3x+1)^2$ at $x=2$, autodiff stores $u=7$ and returns $dy/dx=2u\\cdot3=42$."
      },
      {
        "title": "Gradient checking",
        "background": "Finite differences are too slow for training but excellent for catching implementation mistakes in custom layers.",
        "numbers": "If analytic gradient is $-0.495$ and finite difference is $-0.4949$, the absolute difference is $0.0001$, small enough for many checks."
      },
      {
        "title": "Vanishing gradients",
        "background": "Repeated chain-rule multiplication by numbers below one can shrink signals across many layers.",
        "numbers": "Multiplying by $0.5$ through $20$ layers gives $0.5^{20}\\approx9.54\\times10^{-7}$, almost no gradient."
      },
      {
        "title": "Exploding gradients",
        "background": "The same chain rule can also multiply by numbers above one repeatedly, causing unstable updates.",
        "numbers": "Multiplying by $1.2$ through $50$ layers gives $1.2^{50}\\approx9100$, so a small upstream gradient can become enormous."
      },
      {
        "title": "Residual connections",
        "background": "Skip connections give gradients an additive path around difficult layers, which helps deep networks train.",
        "numbers": "If a residual block is $y=x+F(x)$ with $F'(x)=0.1$, then $dy/dx=1.1$ instead of only $0.1$."
      },
      {
        "title": "Shared parameters",
        "background": "When one parameter is used in multiple places, backprop sums contributions from every path.",
        "numbers": "If a weight contributes gradients $0.3$, $-0.1$, and $0.8$ from three time steps, the total gradient is $1.0$."
      },
      {
        "title": "Memory tradeoffs",
        "background": "Backprop needs forward values, so large models trade memory for recomputation through checkpointing.",
        "numbers": "Storing $24$ layer activations at $200$ MB each costs $4.8$ GB; checkpointing every fourth layer stores about $6$ activations, or $1.2$ GB, before recomputation overhead."
      }
    ],
    "applicationsClose": "Backprop is the chain rule wearing an engineering uniform: local derivatives, cached values, summed paths, and gradients delivered to every parameter.",
    "takeaways": [
      "Backprop computes adjoints $\\bar v=\\partial L/\\partial v$ by moving backward through a computational graph.",
      "Each node multiplies the upstream gradient by its local derivative; shared inputs sum gradient contributions.",
      "Gradient checking, vanishing gradients, exploding gradients, and residual connections are all chain-rule consequences."
    ]
  }
};
