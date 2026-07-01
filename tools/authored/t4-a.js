module.exports = {
  "math-04-01": {
    "id": "math-04-01",
    "title": "Proof techniques",
    "tagline": "A proof is a careful bridge from assumptions you are allowed to use to a conclusion you can trust.",
    "connections": {
      "buildsOn": [
        "logic",
        "sets",
        "algebraic manipulation"
      ],
      "leadsTo": [
        "induction",
        "completeness proofs",
        "convergence proofs"
      ],
      "usedWith": [
        "quantifiers",
        "implication",
        "contrapositive",
        "contradiction",
        "mathematical induction"
      ]
    },
    "motivation": "<p>You already know how to check an example. If someone claims every even square comes from an even number, you can test $4$, $36$, and $100$. Examples build trust, but they do not cover infinitely many cases.</p><p>A <b>proof</b> is the way we cover all cases without listing them. Real analysis is proof-heavy because its claims are usually about every $\\varepsilon>0$, every large enough $N$, or every bounded sequence. The warm secret is that most proofs reuse a few dependable moves.</p>",
    "definition": "<p>A <b>direct proof</b> starts from hypotheses and derives the conclusion. A <b>contrapositive proof</b> proves $\\neg Q\\Rightarrow\\neg P$ instead of $P\\Rightarrow Q$; these are logically equivalent. A <b>contradiction proof</b> assumes the statement is false and derives something impossible, such as $0=1$. <b>Induction</b> proves a base case and then proves $P(n)\\Rightarrow P(n+1)$ for all allowed $n$.</p><p>The key equivalence for implications is derived from truth values: $P\\Rightarrow Q$ fails only when $P$ is true and $Q$ is false. The contrapositive $\\neg Q\\Rightarrow\\neg P$ fails in exactly the same case, so proving one proves the other.</p><p><b>Assumptions that matter:</b> name the universe of discourse, keep quantifiers in order, do not prove only examples when the claim is universal, and when using contradiction make sure the contradiction follows from the negated claim plus accepted facts.</p>",
    "worked": {
      "problem": "Prove: if $n^2$ is even, then $n$ is even, for integer $n$.",
      "skills": [
        "contrapositive",
        "integer parity",
        "universal statements"
      ],
      "strategy": "The square is awkward — prove the contrapositive by starting with an odd integer.",
      "steps": [
        {
          "do": "State the contrapositive",
          "result": "if $n$ is not even, then $n^2$ is not even",
          "why": "contrapositive is equivalent to the original implication"
        },
        {
          "do": "Rewrite not even for an integer",
          "result": "$n=2k+1$ for some $k\\in\\mathbb{Z}$",
          "why": "odd integers have this form"
        },
        {
          "do": "Square the expression",
          "result": "$n^2=(2k+1)^2$",
          "why": "substitute the odd form into the square"
        },
        {
          "do": "Expand the square",
          "result": "$n^2=4k^2+4k+1$",
          "why": "multiply out one operation"
        },
        {
          "do": "Factor the even part",
          "result": "$n^2=2(2k^2+2k)+1$",
          "why": "separate a multiple of 2 plus 1"
        },
        {
          "do": "Conclude oddness",
          "result": "$n^2$ is odd",
          "why": "it has the form $2m+1$ with $m=2k^2+2k$"
        }
      ],
      "verify": "The contrapositive proves exactly the original claim; for instance, $n=5$ gives $25$ odd, so no odd integer can have an even square.",
      "answer": "For every integer $n$, if $n^2$ is even, then $n$ is even.",
      "connects": "Contrapositive proof turns a hard conclusion about $n$ into an easier assumption about $n$."
    },
    "practice": [
      {
        "problem": "Prove directly: if $a$ and $b$ are even integers, then $a+b$ is even.",
        "steps": [
          {
            "do": "Write the first even integer",
            "result": "$a=2m$ for some $m\\in\\mathbb{Z}$",
            "why": "definition of even"
          },
          {
            "do": "Write the second even integer",
            "result": "$b=2n$ for some $n\\in\\mathbb{Z}$",
            "why": "definition of even"
          },
          {
            "do": "Add the expressions",
            "result": "$a+b=2m+2n$",
            "why": "substitute both forms"
          },
          {
            "do": "Factor out 2",
            "result": "$a+b=2(m+n)$",
            "why": "show a multiple of 2"
          },
          {
            "do": "Use closure",
            "result": "$m+n\\in\\mathbb{Z}$",
            "why": "integers are closed under addition"
          }
        ],
        "answer": "$a+b$ is even."
      },
      {
        "problem": "Disprove the universal claim: every prime number is odd.",
        "steps": [
          {
            "do": "Understand the claim",
            "result": "all primes would have odd parity",
            "why": "a universal claim needs every case"
          },
          {
            "do": "Search the smallest primes",
            "result": "$2,3,5,7$",
            "why": "counterexamples often appear early"
          },
          {
            "do": "Check primality of 2",
            "result": "2 has only positive divisors 1 and 2",
            "why": "that is the definition of prime"
          },
          {
            "do": "Check parity of 2",
            "result": "2 is even",
            "why": "$2=2\\cdot1$"
          },
          {
            "do": "State the counterexample",
            "result": "$2$ is prime and not odd",
            "why": "one counterexample disproves a universal statement"
          }
        ],
        "answer": "The claim is false; $2$ is a counterexample."
      },
      {
        "problem": "Prove by contradiction that $\\sqrt{2}$ is irrational, using the fact that if $n^2$ is even then $n$ is even.",
        "steps": [
          {
            "do": "Assume the negation",
            "result": "$\\sqrt2=p/q$ in lowest terms",
            "why": "rational means a ratio of integers"
          },
          {
            "do": "Square both sides",
            "result": "$2=p^2/q^2$",
            "why": "remove the radical"
          },
          {
            "do": "Multiply by $q^2$",
            "result": "$p^2=2q^2$",
            "why": "clear the denominator"
          },
          {
            "do": "Infer parity of $p$",
            "result": "$p$ is even",
            "why": "$p^2$ is even"
          },
          {
            "do": "Write $p=2k$",
            "result": "$4k^2=2q^2$",
            "why": "substitute into $p^2=2q^2$"
          },
          {
            "do": "Divide by 2",
            "result": "$q^2=2k^2$",
            "why": "isolate the parity of $q^2$"
          },
          {
            "do": "Infer parity of $q$",
            "result": "$q$ is even",
            "why": "$q^2$ is even"
          },
          {
            "do": "Contradict lowest terms",
            "result": "$p$ and $q$ share factor 2",
            "why": "lowest terms cannot have a common factor"
          }
        ],
        "answer": "$\\sqrt2$ is irrational."
      },
      {
        "problem": "Prove by induction that $1+2+\\cdots+n=n(n+1)/2$ for every $n\\ge1$.",
        "steps": [
          {
            "do": "Check the base case",
            "result": "$1=1(2)/2$",
            "why": "the formula holds for $n=1$"
          },
          {
            "do": "Assume the induction hypothesis",
            "result": "$1+\\cdots+n=n(n+1)/2$",
            "why": "this is the temporary assumption"
          },
          {
            "do": "Add the next term",
            "result": "$1+\\cdots+n+(n+1)=n(n+1)/2+(n+1)$",
            "why": "build the $n+1$ case"
          },
          {
            "do": "Factor $n+1$",
            "result": "$(n+1)(n/2+1)$",
            "why": "pull out the common factor"
          },
          {
            "do": "Rewrite the factor",
            "result": "$(n+1)(n+2)/2$",
            "why": "$n/2+1=(n+2)/2$"
          },
          {
            "do": "Match the formula",
            "result": "$(n+1)((n+1)+1)/2$",
            "why": "this is the statement with $n+1$"
          }
        ],
        "answer": "The formula holds for all integers $n\\ge1$."
      },
      {
        "problem": "For $a_n=1/n$, prove from the definition that $a_n<0.01$ for all sufficiently large $n$.",
        "steps": [
          {
            "do": "Translate the target",
            "result": "$1/n<0.01$",
            "why": "the sequence term must be below the tolerance"
          },
          {
            "do": "Invert the inequality",
            "result": "$n>100$",
            "why": "all quantities are positive"
          },
          {
            "do": "Choose a threshold",
            "result": "$N=101$",
            "why": "integers larger than 100 work"
          },
          {
            "do": "Check any later index",
            "result": "n\\ge101$",
            "why": "then $n>100$"
          },
          {
            "do": "Conclude the bound",
            "result": "$1/n\\le1/101<0.01$",
            "why": "larger denominators give smaller reciprocals"
          }
        ],
        "answer": "For every $n\\ge101$, $1/n<0.01$."
      }
    ],
    "applications": [
      {
        "title": "Program invariants",
        "background": "Proof ideas entered computing through formal verification: an invariant is a claim that stays true every time a loop runs.",
        "numbers": "If a loop adds $1+2+\\cdots+n$, the invariant after $k=4$ steps is sum $=4\\cdot5/2=10$; after step $5$, add $5$ to get $15=5\\cdot6/2$."
      },
      {
        "title": "Counterexample-driven testing",
        "background": "A single failing input can refute a universal claim about software, just like a mathematical counterexample.",
        "numbers": "Claim: sorting preserves the first item. Input $[3,1,2]$ sorts to $[1,2,3]$, so the first item changes from $3$ to $1$."
      },
      {
        "title": "Induction for recursive algorithms",
        "background": "Recursive programs are often proved correct by induction on input size.",
        "numbers": "If merge sort is correct for lists of length $4$, two correct sorted halves $[1,5]$ and $[2,3]$ merge to $[1,2,3,5]$ for length $4$."
      },
      {
        "title": "Bounding numerical error",
        "background": "Analysis proofs often bound error instead of computing it exactly.",
        "numbers": "If each of $1000$ additions has error at most $10^{-12}$, a crude total bound is $1000\\cdot10^{-12}=10^{-9}$."
      },
      {
        "title": "Generalization guarantees",
        "background": "Learning theory proves statements of the form: with high probability, every model in a class has small gap.",
        "numbers": "A bound $0.02+\\sqrt{\\log(100)/10000}\\approx0.02+0.0215=0.0415$ gives a concrete error-gap ceiling."
      },
      {
        "title": "Termination arguments",
        "background": "A proof that a quantity decreases to zero can show an algorithm stops.",
        "numbers": "If an integer counter starts at $17$ and decreases by $3$ while positive, the values $17,14,11,8,5,2,-1$ show termination after $6$ decreases."
      }
    ],
    "applicationsClose": "Proof techniques are reusable habits: direct, contrapositive, contradiction, induction, and counterexample all turn infinite trust into finite reasoning.",
    "takeaways": [
      "A proof covers all cases allowed by the hypotheses.",
      "Contrapositive proof is logically equivalent to the original implication.",
      "Contradiction assumes the negation and derives impossibility.",
      "Induction proves a base case and a one-step transfer."
    ]
  },
  "math-04-02": {
    "id": "math-04-02",
    "title": "The natural and rational numbers",
    "tagline": "The natural numbers count; the rational numbers compare counts as exact ratios.",
    "connections": {
      "buildsOn": [
        "sets",
        "integer arithmetic",
        "proof by induction"
      ],
      "leadsTo": [
        "real numbers",
        "density",
        "countability"
      ],
      "usedWith": [
        "divisibility",
        "equivalence classes",
        "order",
        "induction"
      ]
    },
    "motivation": "<p>You already count with $1,2,3,\\ldots$ and you already divide a pizza into fractions like $3/4$. Real analysis begins by slowing down and asking what these number systems really guarantee.</p><p>The natural numbers give the rhythm of induction and sequences. The rational numbers give exact ratios, dense order, and the first surprise: there are always more rationals between two rationals, yet they still leave gaps like $\\sqrt2$.</p>",
    "definition": "<p>The <b>natural numbers</b> $\\mathbb{N}$ are the counting numbers, equipped with a first element and a successor operation. Their key proof principle is induction: if $P(1)$ is true and $P(n)\\Rightarrow P(n+1)$ for every $n\\in\\mathbb{N}$, then $P(n)$ is true for all $n$.</p><p>The <b>rational numbers</b> are $\\mathbb{Q}=\\{p/q:p,q\\in\\mathbb{Z},q\\ne0\\}$. Fractions represent the same rational when $p/q=r/s$ exactly when $ps=qr$. Between any two rationals $a<b$, the average $(a+b)/2$ is rational and satisfies $a<(a+b)/2<b$, so $\\mathbb{Q}$ is dense in itself.</p><p><b>Assumptions that matter:</b> denominators are never zero; rational equality is equality of numbers, not necessarily equality of written fractions; and density does not mean completeness, because sequences of rationals can converge toward irrational limits.</p>",
    "worked": {
      "problem": "Show that there is a rational number strictly between $2/5$ and $3/5$.",
      "skills": [
        "rational arithmetic",
        "density",
        "order"
      ],
      "strategy": "Use the midpoint — averages preserve rationality and land between the endpoints.",
      "steps": [
        {
          "do": "Name the endpoints",
          "result": "$a=2/5$ and $b=3/5$",
          "why": "we want a number between them"
        },
        {
          "do": "Form the midpoint",
          "result": "$(a+b)/2$",
          "why": "midpoints lie between distinct endpoints"
        },
        {
          "do": "Add the fractions",
          "result": "$2/5+3/5=5/5=1$",
          "why": "common denominators add directly"
        },
        {
          "do": "Divide by 2",
          "result": "$1/2$",
          "why": "the midpoint is rational"
        },
        {
          "do": "Compare with the endpoints",
          "result": "$2/5<1/2<3/5$",
          "why": "$0.4<0.5<0.6$"
        }
      ],
      "verify": "The number $1/2$ is $5/10$, while $2/5=4/10$ and $3/5=6/10$, so it is strictly between them.",
      "answer": "$1/2$ is a rational number between $2/5$ and $3/5$.",
      "connects": "Density says rational numbers have no adjacent neighbors."
    },
    "practice": [
      {
        "problem": "Use induction to prove $2+4+\\cdots+2n=n(n+1)$ for $n\\ge1$.",
        "steps": [
          {
            "do": "Check $n=1$",
            "result": "$2=1\\cdot2$",
            "why": "base case"
          },
          {
            "do": "Assume the formula",
            "result": "$2+4+\\cdots+2n=n(n+1)$",
            "why": "induction hypothesis"
          },
          {
            "do": "Add the next even number",
            "result": "$n(n+1)+2(n+1)$",
            "why": "the next term is $2(n+1)$"
          },
          {
            "do": "Factor $n+1$",
            "result": "$(n+1)(n+2)$",
            "why": "combine the two terms"
          },
          {
            "do": "Match the next formula",
            "result": "$(n+1)((n+1)+1)$",
            "why": "this is the statement for $n+1$"
          }
        ],
        "answer": "The formula holds for all $n\\ge1$."
      },
      {
        "problem": "Decide whether $18/24$ and $3/4$ represent the same rational number.",
        "steps": [
          {
            "do": "Use cross multiplication",
            "result": "$18\\cdot4$ and $24\\cdot3$",
            "why": "fractions are equal when cross products match"
          },
          {
            "do": "Compute the first product",
            "result": "$72$",
            "why": "$18\\cdot4=72$"
          },
          {
            "do": "Compute the second product",
            "result": "$72$",
            "why": "$24\\cdot3=72$"
          },
          {
            "do": "Compare products",
            "result": "$72=72$",
            "why": "the equality test passes"
          },
          {
            "do": "State the conclusion",
            "result": "$18/24=3/4$",
            "why": "different fractions can name the same rational"
          }
        ],
        "answer": "Yes, they represent the same rational number."
      },
      {
        "problem": "Find a rational number between $7/10$ and $71/100$.",
        "steps": [
          {
            "do": "Rewrite the first endpoint",
            "result": "$7/10=70/100$",
            "why": "use a common denominator"
          },
          {
            "do": "Name the interval",
            "result": "$70/100<q<71/100$",
            "why": "the endpoints are close"
          },
          {
            "do": "Use a larger denominator",
            "result": "$70/100=700/1000$ and $71/100=710/1000$",
            "why": "refine the scale"
          },
          {
            "do": "Choose an integer between",
            "result": "$705$",
            "why": "it lies between $700$ and $710$"
          },
          {
            "do": "Form the rational",
            "result": "$705/1000=141/200$",
            "why": "reduce by dividing by 5"
          }
        ],
        "answer": "$141/200$ is one rational number between them."
      },
      {
        "problem": "Prove that if $q$ is rational and $q\\ne0$, then $1/q$ is rational.",
        "steps": [
          {
            "do": "Write $q$ as a fraction",
            "result": "$q=p/r$ with $p,r\\in\\mathbb{Z}$ and $r\\ne0$",
            "why": "definition of rational"
          },
          {
            "do": "Use $q\\ne0$",
            "result": "$p\\ne0$",
            "why": "a zero numerator would make $q=0$"
          },
          {
            "do": "Invert the fraction",
            "result": "$1/q=r/p$",
            "why": "reciprocal swaps numerator and denominator"
          },
          {
            "do": "Check the denominator",
            "result": "$p\\ne0$",
            "why": "the new denominator is allowed"
          },
          {
            "do": "Conclude rationality",
            "result": "$r/p\\in\\mathbb{Q}$",
            "why": "it is a ratio of integers with nonzero denominator"
          }
        ],
        "answer": "$1/q$ is rational."
      },
      {
        "problem": "A rational grid uses step size $1/8$. List the first five positive grid points and locate $0.6$ between two of them.",
        "steps": [
          {
            "do": "Write the grid rule",
            "result": "k/8$ for $k\\in\\mathbb{N}$",
            "why": "positive grid points use positive integers"
          },
          {
            "do": "List five points",
            "result": "$1/8,2/8,3/8,4/8,5/8$",
            "why": "take $k=1$ through $5$"
          },
          {
            "do": "Convert around $0.6$",
            "result": "$4/8=0.5$ and $5/8=0.625$",
            "why": "decimal comparison"
          },
          {
            "do": "Compare the value",
            "result": "$0.5<0.6<0.625$",
            "why": "place it between neighboring grid points"
          },
          {
            "do": "State the bracket",
            "result": "$4/8<0.6<5/8$",
            "why": "the grid brackets the value"
          }
        ],
        "answer": "The first five are $1/8,1/4,3/8,1/2,5/8$, and $0.6$ lies between $1/2$ and $5/8$."
      }
    ],
    "applications": [
      {
        "title": "Array indices and natural numbers",
        "background": "Computer programs count positions with natural-number-like indices. Induction proves loops handle every position.",
        "numbers": "For an array of length $5$, indices $0,1,2,3,4$ are visited by adding 1 each time; exactly $5$ visits occur."
      },
      {
        "title": "Rational timestamps",
        "background": "Distributed systems often quantize time into rational ticks to avoid floating ambiguity.",
        "numbers": "At $60$ frames per second, frame $37$ occurs at $37/60\\approx0.6167$ seconds."
      },
      {
        "title": "Exact probability models",
        "background": "Finite probability spaces use rational probabilities when outcomes are counted exactly.",
        "numbers": "A fair die has probability $2/6=1/3$ of rolling an even number."
      },
      {
        "title": "Feature binning",
        "background": "Rational cut points divide a numeric feature into exact intervals.",
        "numbers": "Bins of width $1/4$ over $[0,1]$ are $[0,0.25)$, $[0.25,0.5)$, $[0.5,0.75)$, $[0.75,1]$."
      },
      {
        "title": "Fixed-point arithmetic",
        "background": "Hardware and finance often store rationals with a fixed denominator instead of arbitrary floats.",
        "numbers": "Cents store dollars in units of $1/100$; $12.34$ dollars is the integer $1234$ over $100$."
      },
      {
        "title": "Search grids in ML",
        "background": "Hyperparameter sweeps often choose rational grids before continuous tuning.",
        "numbers": "A learning-rate grid $\\{1/1000,3/1000,10/1000\\}$ is $\\{0.001,0.003,0.010\\}$ exactly as rationals."
      }
    ],
    "applicationsClose": "Counting, ratios, grids, and induction all come from the same early number systems; real analysis keeps their strengths and then studies their gaps.",
    "takeaways": [
      "$\\mathbb{N}$ supports induction and sequence indexing.",
      "$\\mathbb{Q}$ consists of integer ratios with nonzero denominator.",
      "Fractions are equal when cross products agree.",
      "Between two rationals, their midpoint is another rational."
    ]
  },
  "math-04-03": {
    "id": "math-04-03",
    "title": "The real numbers",
    "tagline": "The real numbers fill the gaps left by rationals, giving limits a place to land.",
    "connections": {
      "buildsOn": [
        "natural numbers",
        "rational numbers",
        "ordered sets"
      ],
      "leadsTo": [
        "completeness",
        "suprema",
        "limits of sequences"
      ],
      "usedWith": [
        "absolute value",
        "intervals",
        "density",
        "least upper bound property"
      ]
    },
    "motivation": "<p>You already use decimals as if every point on the number line has a name. Rationals name many points, but not all: no rational square equals $2$.</p><p>The <b>real numbers</b> are the completed number line. They keep rational arithmetic and order, add irrational points, and make rigorous convergence possible. Without $\\mathbb{R}$, a sequence could get closer and closer to a missing destination.</p>",
    "definition": "<p>The real numbers $\\mathbb{R}$ form an ordered field containing $\\mathbb{Q}$: you can add, subtract, multiply, divide by nonzero numbers, and compare with $<$. They also satisfy <b>completeness</b>: every nonempty subset of $\\mathbb{R}$ that is bounded above has a least upper bound in $\\mathbb{R}$.</p><p>Completeness is the gap-filling axiom. For example, $S=\\{q\\in\\mathbb{Q}:q^2<2\\}$ is bounded above in $\\mathbb{Q}$ but has no rational least upper bound. In $\\mathbb{R}$, its supremum is $\\sqrt2$.</p><p><b>Assumptions that matter:</b> the usual algebraic rules hold, order is compatible with arithmetic, absolute value measures distance by $|x-y|$, and completeness is an axiom for $\\mathbb{R}$ rather than a theorem inherited from $\\mathbb{Q}$.</p>",
    "worked": {
      "problem": "Show that $\\sqrt2$ lies between $1.4$ and $1.5$.",
      "skills": [
        "order",
        "squares",
        "irrational numbers"
      ],
      "strategy": "For positive numbers, compare squares to locate the square root.",
      "steps": [
        {
          "do": "Square the lower bound",
          "result": "$1.4^2=1.96$",
          "why": "compute the comparison value"
        },
        {
          "do": "Compare with 2",
          "result": "$1.96<2$",
          "why": "so $1.4$ is below $\\sqrt2$"
        },
        {
          "do": "Square the upper bound",
          "result": "$1.5^2=2.25$",
          "why": "compute the second comparison value"
        },
        {
          "do": "Compare with 2",
          "result": "$2<2.25$",
          "why": "so $\\sqrt2$ is below $1.5$"
        },
        {
          "do": "Combine inequalities",
          "result": "$1.4<\\sqrt2<1.5$",
          "why": "positive square roots preserve order"
        }
      ],
      "verify": "Numerically $\\sqrt2\\approx1.4142$, which sits in the bracket.",
      "answer": "$1.4<\\sqrt2<1.5$.",
      "connects": "The real line contains limits and roots that rational arithmetic points toward but may not contain."
    },
    "practice": [
      {
        "problem": "Prove $|3-7|=4$ and interpret it as distance.",
        "steps": [
          {
            "do": "Subtract",
            "result": "$3-7=-4$",
            "why": "distance uses the difference"
          },
          {
            "do": "Apply absolute value",
            "result": "$|-4|=4$",
            "why": "absolute value removes sign"
          },
          {
            "do": "Reverse the order",
            "result": "$7-3=4$",
            "why": "distance is symmetric"
          },
          {
            "do": "Apply absolute value again",
            "result": "$|7-3|=4$",
            "why": "same distance"
          },
          {
            "do": "State the interpretation",
            "result": "the points are 4 units apart",
            "why": "distance is nonnegative"
          }
        ],
        "answer": "$|3-7|=4$, so the distance is 4."
      },
      {
        "problem": "Find rational and irrational numbers between $2$ and $3$.",
        "steps": [
          {
            "do": "Choose a rational midpoint",
            "result": "$(2+3)/2=5/2$",
            "why": "midpoint lies between"
          },
          {
            "do": "Choose a known irrational",
            "result": "$\\sqrt5$",
            "why": "it is not rational"
          },
          {
            "do": "Square the lower comparison",
            "result": "$2^2=4<5$",
            "why": "so $2<\\sqrt5$"
          },
          {
            "do": "Square the upper comparison",
            "result": "$5<9=3^2$",
            "why": "so $\\sqrt5<3$"
          },
          {
            "do": "List both numbers",
            "result": "$5/2$ and $\\sqrt5$",
            "why": "one rational and one irrational"
          }
        ],
        "answer": "$5/2$ and $\\sqrt5$ both lie between $2$ and $3$."
      },
      {
        "problem": "Show that if $|x-4|<0.2$, then $3.8<x<4.2$.",
        "steps": [
          {
            "do": "Use the absolute value inequality",
            "result": "$-0.2<x-4<0.2$",
            "why": "distance below 0.2 means two-sided bound"
          },
          {
            "do": "Add 4 to the left part",
            "result": "$3.8<x$",
            "why": "shift the lower bound"
          },
          {
            "do": "Add 4 to the right part",
            "result": "$x<4.2$",
            "why": "shift the upper bound"
          },
          {
            "do": "Combine",
            "result": "$3.8<x<4.2$",
            "why": "both inequalities hold"
          },
          {
            "do": "Interpret",
            "result": "$x$ is within 0.2 of 4",
            "why": "this is interval language"
          }
        ],
        "answer": "$3.8<x<4.2$."
      },
      {
        "problem": "Give an upper bound and a lower bound for $A=[-2,5)$.",
        "steps": [
          {
            "do": "Read the interval",
            "result": "$-2\\le x<5$",
            "why": "membership condition"
          },
          {
            "do": "Choose a lower bound",
            "result": "$-2$",
            "why": "no element is smaller than $-2$"
          },
          {
            "do": "Choose an upper bound",
            "result": "$5$",
            "why": "all elements are less than $5$"
          },
          {
            "do": "Note endpoint status",
            "result": "$5\\notin A$",
            "why": "upper bounds need not belong to the set"
          },
          {
            "do": "State both bounds",
            "result": "lower bound $-2$, upper bound $5$",
            "why": "these are valid bounds"
          }
        ],
        "answer": "$-2$ is a lower bound and $5$ is an upper bound."
      },
      {
        "problem": "A sequence of rational brackets for a threshold is $[1.41,1.42]$. Show this bracket could contain $\\sqrt2$.",
        "steps": [
          {
            "do": "Square the left endpoint",
            "result": "$1.41^2=1.9881$",
            "why": "compare below 2"
          },
          {
            "do": "Compare left square",
            "result": "$1.9881<2$",
            "why": "left endpoint is below $\\sqrt2$"
          },
          {
            "do": "Square the right endpoint",
            "result": "$1.42^2=2.0164$",
            "why": "compare above 2"
          },
          {
            "do": "Compare right square",
            "result": "$2<2.0164$",
            "why": "right endpoint is above $\\sqrt2$"
          },
          {
            "do": "Conclude containment",
            "result": "$1.41<\\sqrt2<1.42$",
            "why": "the bracket contains the real limit"
          }
        ],
        "answer": "Yes, $\\sqrt2$ lies in $[1.41,1.42]$."
      }
    ],
    "applications": [
      {
        "title": "Floating-point numbers approximate reals",
        "background": "Computers cannot store every real, so floating-point arithmetic approximates the real line with finitely many representable numbers.",
        "numbers": "The real $1/10$ is stored near $0.10000000000000000555$ in binary double precision."
      },
      {
        "title": "Optimization assumes real parameters",
        "background": "Gradient methods usually model weights as real numbers even though hardware stores approximations.",
        "numbers": "A weight update $w=1.2-0.1(0.7)=1.13$ is real arithmetic before rounding."
      },
      {
        "title": "Geometry and graphics",
        "background": "Coordinates in graphics are modeled as real numbers so lines and curves can meet at non-grid points.",
        "numbers": "The midpoint of $(0,0)$ and $(1,\\sqrt2)$ is $(0.5,0.7071\\ldots)$."
      },
      {
        "title": "Probability thresholds",
        "background": "Real-valued scores allow fine threshold changes in classifiers.",
        "numbers": "A threshold moving from $0.700$ to $0.705$ changes the accepted interval by length $0.005$."
      },
      {
        "title": "Numerical root finding",
        "background": "Root finders rely on real-number completeness to bracket limits.",
        "numbers": "If $f(1)=-1$ and $f(2)=2$, bisection first tests $1.5$, then halves the bracket length from $1$ to $0.5$."
      },
      {
        "title": "Measurement models",
        "background": "Physical measurements are modeled by real intervals because sensors have uncertainty.",
        "numbers": "A reading $25.0\\pm0.1$ degrees means the real value is modeled in $[24.9,25.1]$, an interval of width $0.2$."
      }
    ],
    "applicationsClose": "The real numbers are the completed stage on which distance, limits, optimization, and measurement can behave without missing endpoints.",
    "takeaways": [
      "$\\mathbb{R}$ is an ordered field containing $\\mathbb{Q}$.",
      "Completeness fills rational gaps such as $\\sqrt2$.",
      "Absolute value $|x-y|$ measures distance on the real line.",
      "Intervals and bounds are the language of rigorous approximation."
    ]
  },
  "math-04-04": {
    "id": "math-04-04",
    "title": "Completeness, suprema, and infima",
    "tagline": "Completeness says a bounded nonempty set has a sharp edge, even when the edge is not in the set.",
    "connections": {
      "buildsOn": [
        "real numbers",
        "order",
        "bounds"
      ],
      "leadsTo": [
        "monotone convergence",
        "Bolzano-Weierstrass",
        "Cauchy completeness"
      ],
      "usedWith": [
        "upper bounds",
        "lower bounds",
        "least upper bound",
        "greatest lower bound"
      ]
    },
    "motivation": "<p>You already know the difference between a ceiling and the lowest possible ceiling. The set $(0,1)$ has many upper bounds — $2$, $1.5$, and $1$ — but $1$ is the sharp one.</p><p>That sharp-bound idea is the heart of real analysis. Completeness says that sharp upper bounds exist for all nonempty real sets that are bounded above. It is the quiet engine behind convergence theorems.</p>",
    "definition": "<p>An <b>upper bound</b> for a set $S\\subseteq\\mathbb{R}$ is a number $M$ such that $x\\le M$ for every $x\\in S$. The <b>supremum</b> $\\sup S$ is the least upper bound: it is an upper bound, and every smaller number fails to be an upper bound. Similarly, $m=\\inf S$ is the greatest lower bound.</p><p>The completeness axiom states: every nonempty subset of $\\mathbb{R}$ that is bounded above has a supremum in $\\mathbb{R}$. The useful epsilon form is: if $\\alpha=\\sup S$, then for every $\\varepsilon>0$ there is some $s\\in S$ with $\\alpha-\\varepsilon<s\\le\\alpha$. Otherwise $\\alpha-\\varepsilon$ would still be an upper bound, contradicting leastness.</p><p><b>Assumptions that matter:</b> $S$ must be nonempty for its supremum to be meaningful here, boundedness is required, the supremum may or may not belong to $S$, and completeness is special to $\\mathbb{R}$, not $\\mathbb{Q}$.</p>",
    "worked": {
      "problem": "Find $\\sup S$ and $\\inf S$ for $S=(2,5]$.",
      "skills": [
        "bounds",
        "open and closed endpoints",
        "supremum and infimum"
      ],
      "strategy": "Read the interval endpoints, then decide whether membership matters for sharp bounds.",
      "steps": [
        {
          "do": "Read the set",
          "result": "$2<x\\le5$",
          "why": "open at 2 and closed at 5"
        },
        {
          "do": "Find an upper bound",
          "result": "$5$",
          "why": "every element is at most 5"
        },
        {
          "do": "Show it is least",
          "result": "any $M<5$ misses elements near 5",
          "why": "for example $(M+5)/2$ lies above $M$ and below 5"
        },
        {
          "do": "Find a lower bound",
          "result": "$2$",
          "why": "every element is greater than 2"
        },
        {
          "do": "Show it is greatest",
          "result": "any $m>2$ misses elements near 2",
          "why": "for example $(2+m)/2$ lies below $m$ and above 2"
        }
      ],
      "verify": "The endpoint $5$ belongs to the set but $2$ does not; membership is not required for a supremum or infimum.",
      "answer": "$\\sup S=5$ and $\\inf S=2$.",
      "connects": "Sharp bounds capture edges of sets, not merely points included in sets."
    },
    "practice": [
      {
        "problem": "Find $\\sup$ and $\\inf$ of $A=\\{1/n:n\\in\\mathbb{N}\\}$.",
        "steps": [
          {
            "do": "List early values",
            "result": "$1,1/2,1/3,\\ldots$",
            "why": "the set decreases toward 0"
          },
          {
            "do": "Identify the largest value",
            "result": "$1$",
            "why": "the first term is largest"
          },
          {
            "do": "State the supremum",
            "result": "$\\sup A=1$",
            "why": "a maximum is automatically the least upper bound"
          },
          {
            "do": "Find a lower bound",
            "result": "$0$",
            "why": "all terms are positive"
          },
          {
            "do": "Show sharpness of 0",
            "result": "for any $\\varepsilon>0$, choose $n>1/\\varepsilon$",
            "why": "then $1/n<\\varepsilon$"
          }
        ],
        "answer": "$\\sup A=1$ and $\\inf A=0$."
      },
      {
        "problem": "Find the supremum of $B=\\{x\\in\\mathbb{R}:x^2<9\\}$.",
        "steps": [
          {
            "do": "Solve the inequality",
            "result": "$-3<x<3$",
            "why": "square below 9 means distance from 0 below 3"
          },
          {
            "do": "Rewrite the set",
            "result": "$B=(-3,3)$",
            "why": "interval form"
          },
          {
            "do": "Identify an upper bound",
            "result": "$3$",
            "why": "all elements are less than 3"
          },
          {
            "do": "Show smaller numbers fail",
            "result": "if $M<3$, $(M+3)/2$ lies in $B$ and exceeds $M$",
            "why": "midpoint argument"
          },
          {
            "do": "State the supremum",
            "result": "$\\sup B=3$",
            "why": "least upper bound"
          }
        ],
        "answer": "$\\sup B=3$."
      },
      {
        "problem": "Use the epsilon property of supremum for $S=(0,1)$ with $\\varepsilon=0.01$.",
        "steps": [
          {
            "do": "Identify the supremum",
            "result": "$\\sup S=1$",
            "why": "the interval approaches 1 from below"
          },
          {
            "do": "Compute the epsilon lower target",
            "result": "$1-0.01=0.99$",
            "why": "epsilon neighborhood below the supremum"
          },
          {
            "do": "Choose a set element",
            "result": "$s=0.995$",
            "why": "it is between 0 and 1"
          },
          {
            "do": "Compare to the target",
            "result": "$0.99<0.995\\le1$",
            "why": "the epsilon property is met"
          },
          {
            "do": "Conclude sharpness",
            "result": "points of $S$ get within 0.01 of 1",
            "why": "leastness is visible"
          }
        ],
        "answer": "For $\\varepsilon=0.01$, $s=0.995$ works."
      },
      {
        "problem": "Show that $7$ is not the supremum of $[0,5]$.",
        "steps": [
          {
            "do": "Check upper-bound status",
            "result": "$7$ is an upper bound",
            "why": "all set elements are at most 5"
          },
          {
            "do": "Find a smaller upper bound",
            "result": "$6$",
            "why": "all set elements are also at most 6"
          },
          {
            "do": "Find an even sharper upper bound",
            "result": "$5$",
            "why": "the endpoint is in the set"
          },
          {
            "do": "Apply leastness",
            "result": "$7$ cannot be least",
            "why": "a smaller upper bound exists"
          },
          {
            "do": "State the true supremum",
            "result": "$5$",
            "why": "it is the smallest upper bound"
          }
        ],
        "answer": "$7$ is an upper bound but not the supremum; the supremum is $5$."
      },
      {
        "problem": "For losses observed in training, $L_t=0.2+1/t$, find the infimum over $t\\in\\mathbb{N}$ and the first $t$ with $L_t<0.21$.",
        "steps": [
          {
            "do": "Read the sequence",
            "result": "$1.2,0.7,0.533\\ldots$",
            "why": "terms decrease toward 0.2"
          },
          {
            "do": "Identify a lower bound",
            "result": "$0.2$",
            "why": "$1/t$ is positive"
          },
          {
            "do": "Show sharpness",
            "result": "$1/t$ can be below any $\\varepsilon>0$",
            "why": "choose $t>1/\\varepsilon$"
          },
          {
            "do": "Solve the threshold",
            "result": "$0.2+1/t<0.21$",
            "why": "translate the target"
          },
          {
            "do": "Subtract $0.2$",
            "result": "$1/t<0.01$",
            "why": "isolate reciprocal"
          },
          {
            "do": "Invert",
            "result": "$t>100$",
            "why": "positive quantities"
          },
          {
            "do": "Choose first integer",
            "result": "$t=101$",
            "why": "smallest integer above 100"
          }
        ],
        "answer": "The infimum is $0.2$, and the first $t$ with $L_t<0.21$ is $101$."
      }
    ],
    "applications": [
      {
        "title": "Training-loss floors",
        "background": "Empirical losses often approach a floor that behaves like an infimum even if no finite epoch attains it.",
        "numbers": "For $L_t=0.15+2/t$, $L_{100}=0.17$, $L_{1000}=0.152$, and the infimum is $0.15$."
      },
      {
        "title": "Best possible validation score",
        "background": "A hyperparameter search over an interval asks for a supremum of achievable scores.",
        "numbers": "If scores are $s(\\lambda)=0.8- (\\lambda-0.3)^2$ on $[0,1]$, the supremum is $0.8$ at $\\lambda=0.3$."
      },
      {
        "title": "Binary search brackets",
        "background": "Root-finding maintains an interval whose endpoints are bounds for the solution.",
        "numbers": "Starting with $[1,2]$, after three bisections the bracket length is $1/8=0.125$."
      },
      {
        "title": "Robust safety limits",
        "background": "Systems use worst-case upper bounds to guarantee capacity.",
        "numbers": "If each request uses at most $12$ MB and there are $80$ requests, a memory upper bound is $960$ MB."
      },
      {
        "title": "Quantile definitions",
        "background": "Statistics defines quantiles using infima of sets of CDF values.",
        "numbers": "If $F(3)=0.88$ and $F(4)=0.94$, the $0.90$ quantile is the infimum of $x$ with $F(x)\\ge0.90$, here between 3 and 4."
      },
      {
        "title": "Optimization constraints",
        "background": "Feasible regions are sets, and optima are sharp bounds of objective values.",
        "numbers": "For $f(x)=2x$ on $0<x<5$, the supremum is $10$ but no feasible $x$ attains value $10$."
      }
    ],
    "applicationsClose": "Suprema and infima are the sharp edges of sets; completeness guarantees those edges exist in the real line when boundedness allows them.",
    "takeaways": [
      "A supremum is the least upper bound; an infimum is the greatest lower bound.",
      "The sharp bound may fail to belong to the set.",
      "Completeness guarantees suprema for nonempty bounded-above subsets of $\\mathbb{R}$.",
      "The epsilon property of supremum is a key proof tool."
    ]
  },
  "math-04-05": {
    "id": "math-04-05",
    "title": "Countable and uncountable sets",
    "tagline": "Counting a set means listing it without missing anything, even if the list is infinite.",
    "connections": {
      "buildsOn": [
        "sets",
        "natural numbers",
        "rational numbers"
      ],
      "leadsTo": [
        "sequences",
        "real-number cardinality",
        "diagonal arguments"
      ],
      "usedWith": [
        "bijections",
        "injections",
        "surjections",
        "power sets"
      ]
    },
    "motivation": "<p>You already know finite counting. Infinite counting asks a subtler question: can the elements be arranged as a sequence $a_1,a_2,a_3,\\ldots$ so every element appears somewhere?</p><p>Some infinite sets can be listed, like the integers and rationals. The real numbers cannot. That difference is not about size in a vague sense; it is proved by exact maps and diagonal arguments.</p>",
    "definition": "<p>A set $S$ is <b>countable</b> if it is finite or there is a surjection from $\\mathbb{N}$ onto $S$; equivalently, its elements can be listed in a sequence, possibly with repeats. A set is <b>uncountable</b> if no such listing exists.</p><p>The rationals are countable because pairs $(p,q)\\in\\mathbb{Z}\\times\\mathbb{N}$ can be arranged by increasing $|p|+q$, skipping duplicates. The interval $(0,1)$ is uncountable by Cantor's diagonal argument: any proposed decimal list can be defeated by building a new decimal that differs from the $n$th listed number in its $n$th digit.</p><p><b>Assumptions that matter:</b> listings must include every element after finitely many steps, decimal representations should avoid ambiguous tails like $0.4999\\ldots=0.5000\\ldots$, and countable unions of countable sets are countable.</p>",
    "worked": {
      "problem": "Explain why the set of even natural numbers is countable.",
      "skills": [
        "bijections",
        "infinite sets",
        "natural-number indexing"
      ],
      "strategy": "Build an explicit listing by matching each natural number with one even number.",
      "steps": [
        {
          "do": "Define a map",
          "result": "$f(n)=2n$",
          "why": "send each natural number to an even number"
        },
        {
          "do": "Check the output",
          "result": "$f(n)$ is even",
          "why": "it is a multiple of 2"
        },
        {
          "do": "Show every positive even appears",
          "result": "2k=f(k)$",
          "why": "an arbitrary even number has preimage $k$"
        },
        {
          "do": "Show no duplicates",
          "result": "$2m=2n\\Rightarrow m=n$",
          "why": "divide by 2"
        },
        {
          "do": "Conclude bijection",
          "result": "$\\mathbb{N}$ and even naturals match",
          "why": "a bijection proves countability"
        }
      ],
      "verify": "The listing is $2,4,6,8,\\ldots$, and every positive even number appears at its own half-index.",
      "answer": "The even natural numbers are countable via $n\\mapsto2n$.",
      "connects": "Countability is about listability, not about being finite."
    },
    "practice": [
      {
        "problem": "List a bijection from $\\mathbb{N}$ to the nonnegative integers $\\{0,1,2,\\ldots\\}$.",
        "steps": [
          {
            "do": "Propose a map",
            "result": "$f(n)=n-1$",
            "why": "shift the list down by one"
          },
          {
            "do": "Check the first value",
            "result": "$f(1)=0$",
            "why": "the target starts at zero"
          },
          {
            "do": "Check later values",
            "result": "$f(2)=1$, $f(3)=2$",
            "why": "the pattern continues"
          },
          {
            "do": "Show every target appears",
            "result": "k=f(k+1)$",
            "why": "any nonnegative integer has a preimage"
          },
          {
            "do": "Show no duplicates",
            "result": "n-1=m-1\\Rightarrow n=m$",
            "why": "add 1 to both sides"
          }
        ],
        "answer": "$f(n)=n-1$ is a bijection."
      },
      {
        "problem": "Show that the set of integer pairs $(i,j)$ with $|i|+|j|\\le1$ is finite and count it.",
        "steps": [
          {
            "do": "List pair with sum 0",
            "result": "$(0,0)$",
            "why": "only both absolute values zero"
          },
          {
            "do": "List pairs with sum 1",
            "result": "$(1,0),(-1,0),(0,1),(0,-1)$",
            "why": "one coordinate has absolute value 1"
          },
          {
            "do": "Count the first group",
            "result": "1",
            "why": "one pair"
          },
          {
            "do": "Count the second group",
            "result": "4",
            "why": "four axis neighbors"
          },
          {
            "do": "Add counts",
            "result": "$1+4=5$",
            "why": "finite union of listed groups"
          }
        ],
        "answer": "There are $5$ such pairs."
      },
      {
        "problem": "Give the first six positive rationals in a diagonal-style list using numerator plus denominator: $p,q\\in\\mathbb{N}$ and skip duplicates.",
        "steps": [
          {
            "do": "Use sum $p+q=2$",
            "result": "$1/1$",
            "why": "first diagonal"
          },
          {
            "do": "Use sum $p+q=3$",
            "result": "$1/2,2/1$",
            "why": "next diagonal"
          },
          {
            "do": "Use sum $p+q=4$",
            "result": "$1/3,3/1$",
            "why": "skip $2/2$ because it equals $1/1$"
          },
          {
            "do": "Use sum $p+q=5$",
            "result": "$1/4$",
            "why": "this gives the sixth item"
          },
          {
            "do": "Collect six items",
            "result": "$1,1/2,2,1/3,3,1/4$",
            "why": "a listing can continue forever"
          }
        ],
        "answer": "One possible first six are $1,1/2,2,1/3,3,1/4$."
      },
      {
        "problem": "Use a diagonal step to construct a number differing from $0.111\\ldots$, $0.222\\ldots$, and $0.333\\ldots$ in positions 1, 2, and 3.",
        "steps": [
          {
            "do": "Read the first diagonal digit",
            "result": "$1$",
            "why": "from the first number"
          },
          {
            "do": "Choose a different first digit",
            "result": "$4$",
            "why": "avoid the listed digit"
          },
          {
            "do": "Read the second diagonal digit",
            "result": "$2$",
            "why": "from the second number"
          },
          {
            "do": "Choose a different second digit",
            "result": "$5$",
            "why": "avoid the listed digit"
          },
          {
            "do": "Read the third diagonal digit",
            "result": "$3$",
            "why": "from the third number"
          },
          {
            "do": "Choose a different third digit",
            "result": "$6$",
            "why": "avoid the listed digit"
          },
          {
            "do": "Build a decimal prefix",
            "result": "$0.456\\ldots$",
            "why": "it differs from each listed number in its own position"
          }
        ],
        "answer": "A number beginning $0.456\\ldots$ differs from the three listed numbers in the required positions."
      },
      {
        "problem": "A dataset uses all binary strings of length $10$. Count them and compare with countability of all finite binary strings.",
        "steps": [
          {
            "do": "Count choices per position",
            "result": "2",
            "why": "each bit is 0 or 1"
          },
          {
            "do": "Multiply over 10 positions",
            "result": "$2^{10}$",
            "why": "independent choices"
          },
          {
            "do": "Compute the number",
            "result": "$1024$",
            "why": "ten bits give 1024 strings"
          },
          {
            "do": "Classify fixed length",
            "result": "finite",
            "why": "there are exactly 1024"
          },
          {
            "do": "Classify all finite lengths",
            "result": "countable",
            "why": "list by length $0,1,2,\\ldots$ and lexicographic order within each length"
          }
        ],
        "answer": "Length-$10$ binary strings number $1024$; all finite binary strings are countable."
      }
    ],
    "applications": [
      {
        "title": "Dataset indexing",
        "background": "Finite datasets are counted by assigning each example an integer id.",
        "numbers": "A dataset with $1,000,000$ examples can be indexed by integers $0$ through $999,999$."
      },
      {
        "title": "Vocabulary tokens",
        "background": "A model vocabulary is finite, while all finite token sequences over it are countable.",
        "numbers": "With vocabulary size $50000$, there are $50000^3=125,000,000,000,000$ sequences of length 3, still finite for fixed length."
      },
      {
        "title": "Program strings",
        "background": "All finite programs over a finite alphabet are countable because they can be listed by length.",
        "numbers": "With $128$ ASCII characters, there are $128^5=34,359,738,368$ strings of length 5."
      },
      {
        "title": "Real-valued parameters",
        "background": "Even one real-valued weight ranges over an uncountable set in the mathematical model.",
        "numbers": "The interval $[0,1]$ for a single weight is uncountable, unlike any finite grid of $1001$ values."
      },
      {
        "title": "Compression limits",
        "background": "Only countably many finite descriptions exist, so most real numbers cannot have finite descriptions.",
        "numbers": "There are at most $2^{100}$ binary descriptions of length 100, but uncountably many reals in $[0,1]$."
      },
      {
        "title": "Hyperparameter grids versus continua",
        "background": "A grid search is countable or finite; continuous optimization works over an uncountable idealization.",
        "numbers": "A grid with $101$ learning rates and $51$ weight decays has $101\\cdot51=5151$ settings, while $[0,1]^2$ is uncountable."
      }
    ],
    "applicationsClose": "Countability asks whether infinity can be put into a sequence; rationals can, reals cannot, and that split shapes analysis and computation.",
    "takeaways": [
      "A countable set can be listed by natural numbers.",
      "$\\mathbb{Z}$ and $\\mathbb{Q}$ are countable.",
      "Cantor's diagonal argument proves $(0,1)$ is uncountable.",
      "Finite strings over a finite alphabet are countable, but real intervals are not."
    ]
  },
  "math-04-06": {
    "id": "math-04-06",
    "title": "Sequences",
    "tagline": "A sequence is a numbered stream of values, one term for each natural-number time step.",
    "connections": {
      "buildsOn": [
        "natural numbers",
        "functions",
        "real numbers"
      ],
      "leadsTo": [
        "limits of sequences",
        "subsequences",
        "series"
      ],
      "usedWith": [
        "recursion",
        "monotonicity",
        "boundedness",
        "absolute value"
      ]
    },
    "motivation": "<p>You already read lists like $1,1/2,1/3,\\ldots$ and feel their direction. A sequence formalizes that feeling: it is a function whose input is a natural number.</p><p>Sequences are the laboratory of real analysis. Before functions vary continuously, sequences let us study indexed approximation, iteration, training epochs, and algorithms step by step.</p>",
    "definition": "<p>A <b>sequence</b> of real numbers is a function $a:\\mathbb{N}\\to\\mathbb{R}$, usually written $(a_n)$, where $a_n$ is the $n$th term. A sequence is <b>bounded above</b> if $a_n\\le M$ for all $n$, <b>bounded below</b> if $m\\le a_n$ for all $n$, and <b>bounded</b> if $|a_n|\\le C$ for all $n$.</p><p>It is <b>increasing</b> if $a_{n+1}\\ge a_n$ for all $n$ and <b>decreasing</b> if $a_{n+1}\\le a_n$ for all $n$. Monotonicity is proved by comparing $a_{n+1}-a_n$ or $a_{n+1}/a_n$ when terms are positive.</p><p><b>Assumptions that matter:</b> the index $n$ is discrete, early terms do not always reveal long-run behavior, and formulas may be explicit like $a_n=1/n$ or recursive like $a_{n+1}=0.5a_n+1$.</p>",
    "worked": {
      "problem": "For $a_n=3-1/n$, list the first four terms and decide whether the sequence is increasing and bounded above.",
      "skills": [
        "sequence notation",
        "monotonicity",
        "bounds"
      ],
      "strategy": "Compute concrete terms, then compare the general difference.",
      "steps": [
        {
          "do": "Compute $a_1$",
          "result": "$3-1=2$",
          "why": "substitute $n=1$"
        },
        {
          "do": "Compute $a_2$",
          "result": "$3-1/2=2.5$",
          "why": "substitute $n=2$"
        },
        {
          "do": "Compute $a_3$",
          "result": "$3-1/3=8/3$",
          "why": "substitute $n=3$"
        },
        {
          "do": "Compute $a_4$",
          "result": "$3-1/4=11/4$",
          "why": "substitute $n=4$"
        },
        {
          "do": "Compare consecutive terms",
          "result": "$a_{n+1}-a_n=1/n-1/(n+1)$",
          "why": "subtract the formulas"
        },
        {
          "do": "Simplify the difference",
          "result": "$1/[n(n+1)]>0$",
          "why": "positive denominator"
        },
        {
          "do": "Find an upper bound",
          "result": "$a_n<3$",
          "why": "subtracting $1/n$ keeps terms below 3"
        }
      ],
      "verify": "The first terms $2,2.5,2.666\\ldots,2.75$ rise and stay below $3$.",
      "answer": "The first four terms are $2,5/2,8/3,11/4$; the sequence is increasing and bounded above by $3$.",
      "connects": "Monotone bounded sequences are exactly the kind completeness later forces to converge."
    },
    "practice": [
      {
        "problem": "For $b_n=(-1)^n$, list the first six terms and decide whether it is bounded.",
        "steps": [
          {
            "do": "Substitute $n=1$",
            "result": "$-1$",
            "why": "odd exponent"
          },
          {
            "do": "Substitute $n=2$",
            "result": "$1$",
            "why": "even exponent"
          },
          {
            "do": "Continue the pattern",
            "result": "$-1,1,-1,1,-1,1$",
            "why": "alternation"
          },
          {
            "do": "Compute absolute values",
            "result": "$|b_n|=1$",
            "why": "both possible values have magnitude 1"
          },
          {
            "do": "State a bound",
            "result": "$|b_n|\\le1$",
            "why": "works for every term"
          }
        ],
        "answer": "The first six terms are $-1,1,-1,1,-1,1$; it is bounded by 1."
      },
      {
        "problem": "Show $c_n=n/(n+1)$ is increasing.",
        "steps": [
          {
            "do": "Write the next term",
            "result": "$c_{n+1}=(n+1)/(n+2)$",
            "why": "replace $n$ by $n+1$"
          },
          {
            "do": "Subtract",
            "result": "$c_{n+1}-c_n=(n+1)/(n+2)-n/(n+1)$",
            "why": "compare consecutive terms"
          },
          {
            "do": "Use a common denominator",
            "result": "$[(n+1)^2-n(n+2)]/[(n+1)(n+2)]$",
            "why": "combine fractions"
          },
          {
            "do": "Simplify numerator",
            "result": "$1$",
            "why": "$(n+1)^2-n(n+2)=1$"
          },
          {
            "do": "Check sign",
            "result": "$1/[(n+1)(n+2)]>0$",
            "why": "denominator is positive"
          }
        ],
        "answer": "$c_n$ is increasing."
      },
      {
        "problem": "Show $d_n=5+2/n$ is decreasing and bounded below.",
        "steps": [
          {
            "do": "Write the next term",
            "result": "$d_{n+1}=5+2/(n+1)$",
            "why": "replace the index"
          },
          {
            "do": "Compare reciprocals",
            "result": "$1/(n+1)<1/n$",
            "why": "larger denominator gives smaller value"
          },
          {
            "do": "Multiply by 2",
            "result": "$2/(n+1)<2/n$",
            "why": "positive multiplication preserves order"
          },
          {
            "do": "Add 5",
            "result": "$d_{n+1}<d_n$",
            "why": "sequence is decreasing"
          },
          {
            "do": "Find a lower bound",
            "result": "$d_n>5$",
            "why": "$2/n$ is positive"
          }
        ],
        "answer": "The sequence is decreasing and bounded below by $5$."
      },
      {
        "problem": "For recursive $x_{n+1}=0.5x_n+1$ with $x_1=0$, compute $x_2,x_3,x_4,x_5$.",
        "steps": [
          {
            "do": "Compute $x_2$",
            "result": "$0.5\\cdot0+1=1$",
            "why": "use the recursion"
          },
          {
            "do": "Compute $x_3$",
            "result": "$0.5\\cdot1+1=1.5$",
            "why": "feed in $x_2$"
          },
          {
            "do": "Compute $x_4$",
            "result": "$0.5\\cdot1.5+1=1.75$",
            "why": "feed in $x_3$"
          },
          {
            "do": "Compute $x_5$",
            "result": "$0.5\\cdot1.75+1=1.875$",
            "why": "feed in $x_4$"
          },
          {
            "do": "Notice the target",
            "result": "terms approach $2$ from below",
            "why": "the fixed point solves $x=0.5x+1$"
          }
        ],
        "answer": "$x_2=1$, $x_3=1.5$, $x_4=1.75$, $x_5=1.875$."
      },
      {
        "problem": "A training metric is $m_n=0.9+0.2(-1)^n/n$. Compute $m_1,m_2,m_3$ and give a simple bound.",
        "steps": [
          {
            "do": "Compute $m_1$",
            "result": "$0.9-0.2=0.7$",
            "why": "$(-1)^1=-1$"
          },
          {
            "do": "Compute $m_2$",
            "result": "$0.9+0.1=1.0$",
            "why": "$0.2/2=0.1$"
          },
          {
            "do": "Compute $m_3$",
            "result": "$0.9-0.2/3\\approx0.8333$",
            "why": "$(-1)^3=-1$"
          },
          {
            "do": "Bound the oscillation",
            "result": "|0.2(-1)^n/n|\\le0.2$",
            "why": "because $1/n\\le1$"
          },
          {
            "do": "Bound the metric",
            "result": "$0.7\\le m_n\\le1.1$",
            "why": "add and subtract 0.2 from 0.9"
          }
        ],
        "answer": "$m_1=0.7$, $m_2=1.0$, $m_3\\approx0.8333$, and $0.7\\le m_n\\le1.1$."
      }
    ],
    "applications": [
      {
        "title": "Training epochs",
        "background": "Metrics over epochs are sequences, so monotonicity and boundedness describe learning curves.",
        "numbers": "Losses $1.0,0.7,0.55,0.48$ form a decreasing prefix bounded below by $0$."
      },
      {
        "title": "Iterative algorithms",
        "background": "Fixed-point methods produce recursive sequences.",
        "numbers": "Starting $x_1=0$ with $x_{n+1}=0.5x_n+1$ gives $1,1.5,1.75$, approaching $2$."
      },
      {
        "title": "Streaming averages",
        "background": "A running average is a sequence indexed by sample count.",
        "numbers": "Values $4,6,8$ give averages $4,5,6$ after $1,2,3$ samples."
      },
      {
        "title": "Learning-rate schedules",
        "background": "Step sizes are sequences chosen to control optimization.",
        "numbers": "$\\eta_n=0.1/n$ gives $0.1,0.05,0.0333$ for the first three steps."
      },
      {
        "title": "Queue lengths over time",
        "background": "System load measurements form sequences sampled at discrete times.",
        "numbers": "Queue sizes $2,5,3,8$ are bounded by $8$ over the observed window."
      },
      {
        "title": "Gradient norms",
        "background": "Convergence diagnostics often track a sequence of gradient norms.",
        "numbers": "Norms $0.9,0.4,0.18,0.08$ are positive and decreasing in this window."
      }
    ],
    "applicationsClose": "A sequence is just a numbered stream, but boundedness, monotonicity, and recursion make it powerful enough to model approximation and iteration.",
    "takeaways": [
      "A real sequence is a function from $\\mathbb{N}$ to $\\mathbb{R}$.",
      "Boundedness controls how large terms can get.",
      "Monotonicity is usually proved by comparing consecutive terms.",
      "Recursive sequences describe many iterative algorithms."
    ]
  },
  "math-04-07": {
    "id": "math-04-07",
    "title": "Limits of sequences",
    "tagline": "A sequence converges when its tail can be forced inside any tolerance around one number.",
    "connections": {
      "buildsOn": [
        "sequences",
        "absolute value",
        "real numbers"
      ],
      "leadsTo": [
        "subsequences",
        "Cauchy sequences",
        "infinite series"
      ],
      "usedWith": [
        "epsilon-N proofs",
        "algebraic limits",
        "squeeze theorem"
      ]
    },
    "motivation": "<p>You can look at $1,1/2,1/3,\\ldots$ and feel it heading to $0$. Real analysis asks us to say exactly what that means.</p><p>The answer is the $\\varepsilon$-$N$ definition. It sounds formal at first, but it is simply a promise: after some point in the list, every term stays within your chosen tolerance.</p>",
    "definition": "<p>A sequence $(a_n)$ <b>converges</b> to $L\\in\\mathbb{R}$, written $a_n\\to L$ or $\\lim_{n\\to\\infty}a_n=L$, if for every $\\varepsilon>0$ there exists $N\\in\\mathbb{N}$ such that $n\\ge N\\Rightarrow |a_n-L|<\\varepsilon$.</p><p>Every symbol has a job: $\\varepsilon$ is the tolerance chosen by someone else, $N$ is the threshold you are allowed to choose, and the implication controls all later indices, not just one term. For $a_n=1/n$, choosing $N>1/\\varepsilon$ works because $n\\ge N$ forces $1/n\\le1/N<\\varepsilon$.</p><p><b>Assumptions that matter:</b> the limit $L$ is finite in $\\mathbb{R}$, $N$ may depend on $\\varepsilon$, strict inequality can be achieved by choosing a slightly larger integer, and changing finitely many early terms does not change the limit.</p>",
    "worked": {
      "problem": "Prove $1/n\\to0$ using the $\\varepsilon$-$N$ definition.",
      "skills": [
        "epsilon-N proof",
        "reciprocal bounds",
        "quantifiers"
      ],
      "strategy": "Start from the desired inequality $1/n<\\varepsilon$ and solve for a large enough $n$.",
      "steps": [
        {
          "do": "Write the target",
          "result": "$|1/n-0|<\\varepsilon$",
          "why": "definition of convergence to 0"
        },
        {
          "do": "Simplify the absolute value",
          "result": "$1/n<\\varepsilon$",
          "why": "terms are positive"
        },
        {
          "do": "Solve for $n$",
          "result": "$n>1/\\varepsilon$",
          "why": "invert positive quantities"
        },
        {
          "do": "Choose a threshold",
          "result": "$N>1/\\varepsilon$",
          "why": "take an integer larger than the reciprocal"
        },
        {
          "do": "Use $n\\ge N$",
          "result": "$1/n\\le1/N$",
          "why": "larger denominator gives smaller reciprocal"
        },
        {
          "do": "Apply the threshold choice",
          "result": "$1/N<\\varepsilon$",
          "why": "because $N>1/\\varepsilon$"
        }
      ],
      "verify": "If $\\varepsilon=0.001$, choose $N=1001$; then every $n\\ge1001$ has $1/n<0.001$.",
      "answer": "For every $\\varepsilon>0$, such an $N$ exists, so $1/n\\to0$.",
      "connects": "The proof shows convergence is a tail guarantee, not a statement about early terms."
    },
    "practice": [
      {
        "problem": "Find $N$ so $|2+3/n-2|<0.01$ for all $n\\ge N$.",
        "steps": [
          {
            "do": "Simplify the distance",
            "result": "$|3/n|<0.01$",
            "why": "subtract the proposed limit"
          },
          {
            "do": "Remove absolute value",
            "result": "$3/n<0.01$",
            "why": "terms are positive"
          },
          {
            "do": "Solve for $n$",
            "result": "$n>300$",
            "why": "divide by 0.01"
          },
          {
            "do": "Choose the first integer threshold",
            "result": "$N=301$",
            "why": "strict inequality needs above 300"
          },
          {
            "do": "Check the tail",
            "result": "$n\\ge301\\Rightarrow3/n\\le3/301<0.01$",
            "why": "threshold works"
          }
        ],
        "answer": "$N=301$ works."
      },
      {
        "problem": "Prove $(5n+1)/n\\to5$.",
        "steps": [
          {
            "do": "Subtract the limit",
            "result": "$\\left|(5n+1)/n-5\\right|$",
            "why": "start with the definition"
          },
          {
            "do": "Simplify the expression",
            "result": "$|1/n|$",
            "why": "$5n/n-5=0$"
          },
          {
            "do": "Set the target",
            "result": "$1/n<\\varepsilon$",
            "why": "need distance below tolerance"
          },
          {
            "do": "Choose threshold",
            "result": "$N>1/\\varepsilon$",
            "why": "same reciprocal bound"
          },
          {
            "do": "Conclude for $n\\ge N$",
            "result": "$1/n\\le1/N<\\varepsilon$",
            "why": "tail lies inside tolerance"
          }
        ],
        "answer": "$(5n+1)/n\\to5$."
      },
      {
        "problem": "Show $(-1)^n/n\\to0$.",
        "steps": [
          {
            "do": "Start with distance",
            "result": "$|(-1)^n/n-0|$",
            "why": "definition"
          },
          {
            "do": "Separate absolute values",
            "result": "$|(-1)^n|/n$",
            "why": "absolute value of quotient"
          },
          {
            "do": "Evaluate the sign magnitude",
            "result": "$1/n$",
            "why": "$|(-1)^n|=1$"
          },
          {
            "do": "Choose threshold",
            "result": "$N>1/\\varepsilon$",
            "why": "make $1/n$ small"
          },
          {
            "do": "Conclude",
            "result": "$|(-1)^n/n|<\\varepsilon$ for $n\\ge N$",
            "why": "oscillation is squeezed by shrinking size"
          }
        ],
        "answer": "$(-1)^n/n\\to0$."
      },
      {
        "problem": "Prove that $a_n=4$ for all $n$ converges to $4$.",
        "steps": [
          {
            "do": "Write the distance",
            "result": "$|4-4|$",
            "why": "compare term to limit"
          },
          {
            "do": "Simplify",
            "result": "$0$",
            "why": "constant sequence has zero error"
          },
          {
            "do": "Compare to tolerance",
            "result": "$0<\\varepsilon$",
            "why": "every positive tolerance contains 0"
          },
          {
            "do": "Choose a threshold",
            "result": "$N=1$",
            "why": "all terms already work"
          },
          {
            "do": "State the implication",
            "result": "n\\ge1\\Rightarrow |a_n-4|<\\varepsilon$",
            "why": "definition is satisfied"
          }
        ],
        "answer": "The constant sequence converges to $4$."
      },
      {
        "problem": "A validation error is $e_n=0.12+0.8/n$. Find $N$ so $|e_n-0.12|<0.005$.",
        "steps": [
          {
            "do": "Subtract the limit",
            "result": "$|0.8/n|<0.005$",
            "why": "isolate the decaying term"
          },
          {
            "do": "Remove absolute value",
            "result": "$0.8/n<0.005$",
            "why": "positive term"
          },
          {
            "do": "Solve for $n$",
            "result": "$n>160$",
            "why": "$0.8/0.005=160$"
          },
          {
            "do": "Choose threshold",
            "result": "$N=161$",
            "why": "integer above 160"
          },
          {
            "do": "Check",
            "result": "$0.8/161\\approx0.00497$",
            "why": "below the tolerance"
          }
        ],
        "answer": "$N=161$ works."
      }
    ],
    "applications": [
      {
        "title": "Stopping criteria",
        "background": "Optimization stops when a sequence of changes is below a tolerance.",
        "numbers": "If update size is $1/n$, then below $0.001$ requires $n>1000$, so $N=1001$."
      },
      {
        "title": "Validation-curve plateaus",
        "background": "A metric sequence can converge to a performance ceiling or floor.",
        "numbers": "For $a_n=0.9-0.3/n$, being within $0.01$ of $0.9$ needs $0.3/n<0.01$, so $n>30$."
      },
      {
        "title": "Monte Carlo estimates",
        "background": "Sample averages often converge to expected values as sample size grows.",
        "numbers": "An error bound shaped like $2/\\sqrt n$ drops below $0.05$ when $\\sqrt n>40$, so $n>1600$."
      },
      {
        "title": "Iterative solvers",
        "background": "Numerical methods track residual sequences approaching zero.",
        "numbers": "Residual $r_k=0.5^k$ is below $0.01$ at $k=7$ because $0.5^7=0.0078125$."
      },
      {
        "title": "Learning-rate decay",
        "background": "Schedules are designed so step sizes converge to zero.",
        "numbers": "$\\eta_n=0.1/n$ is below $10^{-4}$ after $n>1000$."
      },
      {
        "title": "Streaming calibration",
        "background": "Online metrics stabilize when new examples have shrinking influence.",
        "numbers": "The first example's weight in an average after $n=10000$ samples is $1/10000=0.0001$."
      }
    ],
    "applicationsClose": "The $\\varepsilon$-$N$ definition is a precise tail promise: choose any tolerance, and the sequence eventually stays inside it.",
    "takeaways": [
      "$a_n\\to L$ means every tolerance around $L$ eventually contains all tail terms.",
      "$N$ may depend on $\\varepsilon$.",
      "Absolute value measures distance to the proposed limit.",
      "Oscillation can still converge if its amplitude shrinks to zero."
    ]
  },
  "math-04-08": {
    "id": "math-04-08",
    "title": "Subsequences",
    "tagline": "A subsequence keeps the original order while selecting an infinite trail of terms.",
    "connections": {
      "buildsOn": [
        "sequences",
        "limits of sequences",
        "natural-number indices"
      ],
      "leadsTo": [
        "Bolzano-Weierstrass",
        "compactness",
        "cluster points"
      ],
      "usedWith": [
        "monotone subsequences",
        "convergence",
        "index maps"
      ]
    },
    "motivation": "<p>You have probably skimmed a long list by looking at every other term. That is a subsequence: not a new universe, just a careful infinite selection.</p><p>Subsequences reveal hidden behavior. A sequence may oscillate, but its even terms and odd terms can have separate limits. Real analysis uses subsequences to detect convergence, nonconvergence, and compactness.</p>",
    "definition": "<p>A <b>subsequence</b> of $(a_n)$ is $(a_{n_k})$, where $n_1<n_2<n_3<\\cdots$ are natural numbers. The indices must strictly increase so the original order is preserved and infinitely many terms are selected.</p><p>If $a_n\\to L$, then every subsequence also converges to $L$. Proof: given $\\varepsilon>0$, choose $N$ so $n\\ge N\\Rightarrow |a_n-L|<\\varepsilon$. Since $n_k\\ge k$, all sufficiently large $k$ have $n_k\\ge N$, so $|a_{n_k}-L|<\\varepsilon$.</p><p><b>Assumptions that matter:</b> a subsequence is infinite, repeated finite selections do not count, indices are increasing, and different subsequential limits prove the original sequence cannot converge.</p>",
    "worked": {
      "problem": "For $a_n=(-1)^n+1/n$, find the limits of the even and odd subsequences.",
      "skills": [
        "subsequence indices",
        "limits",
        "oscillation"
      ],
      "strategy": "Write formulas for $a_{2k}$ and $a_{2k-1}$, then take $k\\to\\infty$.",
      "steps": [
        {
          "do": "Write the even-index term",
          "result": "$a_{2k}=(-1)^{2k}+1/(2k)$",
          "why": "substitute $n=2k$"
        },
        {
          "do": "Simplify the sign",
          "result": "$a_{2k}=1+1/(2k)$",
          "why": "even powers of $-1$ equal 1"
        },
        {
          "do": "Take the even limit",
          "result": "$a_{2k}\\to1$",
          "why": "the reciprocal term tends to 0"
        },
        {
          "do": "Write the odd-index term",
          "result": "$a_{2k-1}=(-1)^{2k-1}+1/(2k-1)$",
          "why": "substitute odd indices"
        },
        {
          "do": "Simplify the sign",
          "result": "$a_{2k-1}=-1+1/(2k-1)$",
          "why": "odd powers of $-1$ equal -1"
        },
        {
          "do": "Take the odd limit",
          "result": "$a_{2k-1}\\to-1$",
          "why": "the reciprocal term tends to 0"
        }
      ],
      "verify": "The subsequences approach different numbers, so the full sequence cannot have one limit.",
      "answer": "The even subsequence converges to $1$ and the odd subsequence converges to $-1$.",
      "connects": "Subsequences can expose multiple tail behaviors inside one sequence."
    },
    "practice": [
      {
        "problem": "For $a_n=1/n$, write the subsequence with indices $n_k=3k$ and find its limit.",
        "steps": [
          {
            "do": "Substitute the index",
            "result": "$a_{n_k}=a_{3k}$",
            "why": "use $n_k=3k$"
          },
          {
            "do": "Use the formula",
            "result": "$a_{3k}=1/(3k)$",
            "why": "replace $n$ by $3k$"
          },
          {
            "do": "Compare to $1/k$",
            "result": "$1/(3k)\\le1/k$",
            "why": "positive denominator is larger"
          },
          {
            "do": "Take the limit",
            "result": "$1/(3k)\\to0$",
            "why": "constant factor does not change zero limit"
          },
          {
            "do": "State the subsequence limit",
            "result": "0",
            "why": "same as the original"
          }
        ],
        "answer": "The subsequence is $1/(3k)$ and it converges to $0$."
      },
      {
        "problem": "Is $a_2,a_4,a_6,\\ldots$ a subsequence of $(a_n)$? Explain with indices.",
        "steps": [
          {
            "do": "Choose index rule",
            "result": "$n_k=2k$",
            "why": "even indices"
          },
          {
            "do": "Check first index",
            "result": "$n_1=2$",
            "why": "gives $a_2$"
          },
          {
            "do": "Check second index",
            "result": "$n_2=4$",
            "why": "gives $a_4$"
          },
          {
            "do": "Check increasing property",
            "result": "$2k<2(k+1)$",
            "why": "indices strictly increase"
          },
          {
            "do": "Conclude",
            "result": "yes",
            "why": "it is an infinite order-preserving selection"
          }
        ],
        "answer": "Yes; it is the subsequence $a_{2k}$."
      },
      {
        "problem": "Show that $1,-1,1,-1,\\ldots$ does not converge using subsequences.",
        "steps": [
          {
            "do": "Define the even subsequence",
            "result": "a_{2k}=1$",
            "why": "even terms are 1"
          },
          {
            "do": "Take its limit",
            "result": "$1$",
            "why": "constant subsequence"
          },
          {
            "do": "Define the odd subsequence",
            "result": "a_{2k-1}=-1$",
            "why": "odd terms are -1"
          },
          {
            "do": "Take its limit",
            "result": "$-1$",
            "why": "constant subsequence"
          },
          {
            "do": "Compare limits",
            "result": "$1\\ne-1$",
            "why": "a convergent sequence cannot have two subsequential limits"
          }
        ],
        "answer": "The sequence does not converge."
      },
      {
        "problem": "For $a_n=n/(n+1)$, find the subsequence $a_{k^2}$ and its limit.",
        "steps": [
          {
            "do": "Substitute $n=k^2$",
            "result": "$a_{k^2}=k^2/(k^2+1)$",
            "why": "use square indices"
          },
          {
            "do": "Rewrite the expression",
            "result": "$1-1/(k^2+1)$",
            "why": "subtract from 1"
          },
          {
            "do": "Take the reciprocal limit",
            "result": "$1/(k^2+1)\\to0$",
            "why": "denominator grows"
          },
          {
            "do": "Take the subsequence limit",
            "result": "$1$",
            "why": "remaining value"
          },
          {
            "do": "Connect to original",
            "result": "same limit as $a_n$",
            "why": "subsequences of convergent sequences share the limit"
          }
        ],
        "answer": "$a_{k^2}=k^2/(k^2+1)\\to1$."
      },
      {
        "problem": "A training log alternates validation scores $0.80,0.70,0.85,0.72,0.875,0.73,\\ldots$ with even scores approaching $0.75$ and odd scores approaching $0.90$. What does that imply?",
        "steps": [
          {
            "do": "Identify odd subsequence",
            "result": "$0.80,0.85,0.875,\\ldots$",
            "why": "odd-indexed scores"
          },
          {
            "do": "State its limit",
            "result": "$0.90$",
            "why": "given behavior"
          },
          {
            "do": "Identify even subsequence",
            "result": "$0.70,0.72,0.73,\\ldots$",
            "why": "even-indexed scores"
          },
          {
            "do": "State its limit",
            "result": "$0.75$",
            "why": "given behavior"
          },
          {
            "do": "Compare limits",
            "result": "$0.90\\ne0.75$",
            "why": "two subsequential limits differ"
          }
        ],
        "answer": "The full validation-score sequence does not converge."
      }
    ],
    "applications": [
      {
        "title": "Train versus validation alternation",
        "background": "Logs often alternate metric types; subsequences separate them.",
        "numbers": "If odd entries are training losses $0.6,0.4,0.3$ and even entries are validation losses $0.7,0.55,0.50$, analyze $a_{2k-1}$ and $a_{2k}$ separately."
      },
      {
        "title": "Mini-batch cycles",
        "background": "Cyclic data order can create subsequences for each phase of a cycle.",
        "numbers": "A 3-batch cycle uses subsequences $a_{3k}$, $a_{3k+1}$, and $a_{3k+2}$; their limits reveal periodic bias."
      },
      {
        "title": "Checkpoint sampling",
        "background": "Saving every tenth epoch forms a subsequence of a full training run.",
        "numbers": "Epochs $10,20,30$ use index rule $n_k=10k$ and preserve chronological order."
      },
      {
        "title": "Detecting nonconvergence",
        "background": "Different subsequential limits prove an oscillating algorithm has not settled.",
        "numbers": "Updates $1,-1,1,-1$ have even subsequence $1$ and odd subsequence $-1$."
      },
      {
        "title": "Sparse evaluation",
        "background": "Expensive validation may be run at square-number epochs.",
        "numbers": "Epochs $1,4,9,16$ follow $n_k=k^2$; this is still a valid subsequence."
      },
      {
        "title": "Cluster analysis in simulations",
        "background": "Long simulations may visit several regimes; subsequences isolate visits near one regime.",
        "numbers": "Samples near value $2$ at times $5,11,19$ form a subsequence if those times increase."
      }
    ],
    "applicationsClose": "Subsequences are infinite order-preserving selections; they inherit limits from convergent sequences and expose multiple behaviors in divergent ones.",
    "takeaways": [
      "A subsequence has indices $n_1<n_2<\\cdots$.",
      "Every subsequence of a convergent sequence has the same limit.",
      "Two subsequences with different limits prove divergence.",
      "Subsequences are central to compactness arguments."
    ]
  },
  "math-04-09": {
    "id": "math-04-09",
    "title": "The Bolzano–Weierstrass theorem",
    "tagline": "Every bounded real sequence contains a convergent subsequence.",
    "connections": {
      "buildsOn": [
        "bounded sequences",
        "subsequences",
        "completeness"
      ],
      "leadsTo": [
        "compactness",
        "Cauchy sequences",
        "convergent subsequences in optimization"
      ],
      "usedWith": [
        "interval nesting",
        "supremum",
        "monotone subsequences"
      ]
    },
    "motivation": "<p>A bounded sequence can still jump around forever. The surprise is that in the real line it cannot avoid having some convergent trail hiding inside it.</p><p>The <b>Bolzano-Weierstrass theorem</b> is one of the first compactness results: boundedness plus the completeness of $\\mathbb{R}$ forces a convergent subsequence. It is a gentle but powerful guarantee of structure.</p>",
    "definition": "<p><b>Bolzano-Weierstrass:</b> every bounded sequence in $\\mathbb{R}$ has a convergent subsequence. One proof repeatedly bisects a closed interval containing infinitely many terms. At each stage choose a half that still contains infinitely many terms; the nested intervals have lengths tending to $0$, and completeness gives a unique point trapped inside. Selecting one term from each interval yields a subsequence converging to that point.</p><p>The epsilon reason: after enough bisections, the chosen interval length is below $\\varepsilon$. All later selected subsequence terms lie in that same tiny interval around the trapped point, so their distance from the point is below $\\varepsilon$.</p><p><b>Assumptions that matter:</b> the sequence must be bounded and real-valued, the selected indices must increase, and the theorem guarantees existence of a convergent subsequence, not convergence of the whole sequence.</p>",
    "worked": {
      "problem": "Use Bolzano-Weierstrass to justify a convergent subsequence of $a_n=(-1)^n+1/n$, and identify one.",
      "skills": [
        "boundedness",
        "subsequences",
        "subsequential limits"
      ],
      "strategy": "First show boundedness, then exhibit a convergent subsequence explicitly.",
      "steps": [
        {
          "do": "Bound the sign term",
          "result": "$-1\\le(-1)^n\\le1$",
          "why": "it only takes two values"
        },
        {
          "do": "Bound the reciprocal term",
          "result": "$0<1/n\\le1$",
          "why": "for $n\\ge1$"
        },
        {
          "do": "Combine bounds",
          "result": "$-1<a_n\\le2$",
          "why": "add the inequalities"
        },
        {
          "do": "Invoke the theorem",
          "result": "a convergent subsequence exists",
          "why": "the sequence is bounded in $\\mathbb{R}$"
        },
        {
          "do": "Choose even indices",
          "result": "$a_{2k}=1+1/(2k)$",
          "why": "even powers are positive"
        },
        {
          "do": "Take the limit",
          "result": "$a_{2k}\\to1$",
          "why": "the reciprocal term tends to 0"
        }
      ],
      "verify": "The odd subsequence also converges, to $-1$, confirming the theorem while the full sequence still diverges.",
      "answer": "The sequence is bounded, so a convergent subsequence exists; one is $a_{2k}\\to1$.",
      "connects": "Bolzano-Weierstrass guarantees hidden convergence inside bounded real sequences."
    },
    "practice": [
      {
        "problem": "Find a convergent subsequence of $(-1)^n$.",
        "steps": [
          {
            "do": "Choose even indices",
            "result": "n_k=2k$",
            "why": "preserve increasing order"
          },
          {
            "do": "Evaluate the subsequence",
            "result": "a_{2k}=1$",
            "why": "even powers of $-1$"
          },
          {
            "do": "Recognize constant behavior",
            "result": "1,1,1,\\ldots$",
            "why": "all selected terms match"
          },
          {
            "do": "Take the limit",
            "result": "1$",
            "why": "constant sequences converge to their value"
          },
          {
            "do": "State the result",
            "result": "$a_{2k}\\to1$",
            "why": "one convergent subsequence found"
          }
        ],
        "answer": "The even subsequence converges to $1$."
      },
      {
        "problem": "Show $\\sin n$ has a convergent subsequence without identifying its limit.",
        "steps": [
          {
            "do": "Use the sine bound",
            "result": "$-1\\le\\sin n\\le1$",
            "why": "sine values always lie in this interval"
          },
          {
            "do": "State boundedness",
            "result": "$(\\sin n)$ is bounded",
            "why": "all terms are inside $[-1,1]$"
          },
          {
            "do": "Check real-valued condition",
            "result": "$\\sin n\\in\\mathbb{R}$",
            "why": "the theorem applies in $\\mathbb{R}$"
          },
          {
            "do": "Apply Bolzano-Weierstrass",
            "result": "there exists a convergent subsequence",
            "why": "bounded real sequence"
          },
          {
            "do": "Name the conclusion",
            "result": "$\\sin(n_k)\\to L$ for some $L\\in[-1,1]$",
            "why": "the exact $L$ is not required"
          }
        ],
        "answer": "A convergent subsequence exists by Bolzano-Weierstrass."
      },
      {
        "problem": "Explain why Bolzano-Weierstrass does not apply to $a_n=n$.",
        "steps": [
          {
            "do": "Check bounded above",
            "result": "$a_n=n$ has no upper bound",
            "why": "for any $M$, choose $n>M$"
          },
          {
            "do": "State failure",
            "result": "the sequence is unbounded",
            "why": "boundedness is required"
          },
          {
            "do": "Compare with theorem",
            "result": "Bolzano-Weierstrass needs bounded real sequence",
            "why": "an assumption fails"
          },
          {
            "do": "Assess subsequences",
            "result": "any subsequence $a_{n_k}=n_k\\to\\infty$",
            "why": "indices increase without bound"
          },
          {
            "do": "Conclude",
            "result": "no finite convergent subsequence is guaranteed or present",
            "why": "the theorem cannot be used"
          }
        ],
        "answer": "It is unbounded, so the theorem does not apply."
      },
      {
        "problem": "In the interval-halving proof, how many halvings make an initial interval of length $8$ shorter than $0.1$?",
        "steps": [
          {
            "do": "Write length after $k$ halvings",
            "result": "$8/2^k$",
            "why": "each bisection halves length"
          },
          {
            "do": "Set the target",
            "result": "$8/2^k<0.1$",
            "why": "want length below tolerance"
          },
          {
            "do": "Rearrange",
            "result": "$2^k>80$",
            "why": "multiply by $2^k$ and divide by 0.1"
          },
          {
            "do": "Test powers",
            "result": "$2^6=64$, $2^7=128$",
            "why": "find first power above 80"
          },
          {
            "do": "Choose $k$",
            "result": "$7$",
            "why": "seven halvings suffice"
          }
        ],
        "answer": "$7$ halvings make the length less than $0.1$."
      },
      {
        "problem": "A bounded metric sequence has all values in $[0,1]$. What does Bolzano-Weierstrass guarantee, and what does it not guarantee?",
        "steps": [
          {
            "do": "State boundedness",
            "result": "$0\\le a_n\\le1$",
            "why": "all terms lie in a bounded interval"
          },
          {
            "do": "Apply the theorem",
            "result": "some subsequence converges",
            "why": "bounded real sequence"
          },
          {
            "do": "Name the limit location",
            "result": "$L\\in[0,1]$",
            "why": "closed interval contains subsequential limits"
          },
          {
            "do": "Avoid overclaiming",
            "result": "the full sequence need not converge",
            "why": "oscillation can remain"
          },
          {
            "do": "Give a model example",
            "result": "$0,1,0,1,\\ldots$",
            "why": "bounded with convergent constant subsequences but divergent full sequence"
          }
        ],
        "answer": "It guarantees a convergent subsequence with limit in $[0,1]$, not convergence of the full sequence."
      }
    ],
    "applications": [
      {
        "title": "Checkpoint selection",
        "background": "A bounded sequence of validation scores always has a convergent subsequence of checkpoints in the mathematical model.",
        "numbers": "Scores in $[0,1]$ at epochs $1,2,\\ldots$ satisfy the boundedness hypothesis exactly."
      },
      {
        "title": "Parameter clipping",
        "background": "Clipping weights to a bounded interval creates compactness in one dimension.",
        "numbers": "If weights are clipped to $[-5,5]$, any infinite sequence of one weight has a convergent subsequence."
      },
      {
        "title": "Simulation samples",
        "background": "Bounded physical measurements contain stable subsequences even when the whole trace oscillates.",
        "numbers": "Temperature readings in $[18,22]$ over infinitely many samples have a convergent subsequence."
      },
      {
        "title": "Interval nesting algorithms",
        "background": "Bisection and branch-and-bound shrink intervals using the same nested-interval idea.",
        "numbers": "Starting length $4$, after $10$ halvings length is $4/1024\\approx0.00391$."
      },
      {
        "title": "Compactness intuition for optimization",
        "background": "Existence proofs for minimizers often combine bounded feasible sets with convergent subsequences.",
        "numbers": "A sequence of candidate losses $0.5,0.4,0.35$ with parameters in $[0,1]$ has subsequential parameter limits."
      },
      {
        "title": "Adversarial examples on bounded pixels",
        "background": "Images live in a bounded cube, which makes subsequence compactness plausible coordinatewise.",
        "numbers": "A grayscale pixel sequence in $[0,255]$ has a convergent subsequence for that pixel value."
      }
    ],
    "applicationsClose": "Bolzano-Weierstrass is the hidden-convergence theorem: bounded real sequences may wander, but some infinite trail settles.",
    "takeaways": [
      "Every bounded real sequence has a convergent subsequence.",
      "The theorem relies on completeness of $\\mathbb{R}$.",
      "It does not imply the original sequence converges.",
      "Interval halving is the core proof idea."
    ]
  },
  "math-04-10": {
    "id": "math-04-10",
    "title": "Cauchy sequences",
    "tagline": "A Cauchy sequence is one whose terms eventually get close to each other, even before you know the limit.",
    "connections": {
      "buildsOn": [
        "limits of sequences",
        "absolute value",
        "completeness"
      ],
      "leadsTo": [
        "complete metric spaces",
        "infinite series",
        "fixed-point methods"
      ],
      "usedWith": [
        "epsilon-N proofs",
        "convergence",
        "triangle inequality"
      ]
    },
    "motivation": "<p>Usually convergence names a destination first. Cauchy sequences ask a more practical question: do the late terms crowd together so tightly that a destination must exist?</p><p>In the real numbers, the answer is yes. Cauchy is the internal test for convergence: terms eventually agree with each other, and completeness supplies the limit.</p>",
    "definition": "<p>A sequence $(a_n)$ is <b>Cauchy</b> if for every $\\varepsilon>0$ there exists $N\\in\\mathbb{N}$ such that $m,n\\ge N\\Rightarrow |a_m-a_n|<\\varepsilon$. The definition compares tail terms to each other, not to a known $L$.</p><p>Every convergent sequence is Cauchy: if $a_n\\to L$, choose $N$ so $|a_n-L|<\\varepsilon/2$ for $n\\ge N$. Then for $m,n\\ge N$, the triangle inequality gives $|a_m-a_n|\\le |a_m-L|+|a_n-L|<\\varepsilon$. In $\\mathbb{R}$, completeness gives the converse: every Cauchy sequence converges.</p><p><b>Assumptions that matter:</b> both indices must be in the tail, $N$ depends on $\\varepsilon$, the triangle inequality is the proof engine, and Cauchy implies convergence in $\\mathbb{R}$ but not in every incomplete space.</p>",
    "worked": {
      "problem": "Prove $a_n=1/n$ is Cauchy.",
      "skills": [
        "Cauchy definition",
        "tail bounds",
        "epsilon-N proof"
      ],
      "strategy": "For large $m,n$, both terms are close to 0, so their difference is small by the triangle inequality.",
      "steps": [
        {
          "do": "Start with the difference",
          "result": "$|1/m-1/n|$",
          "why": "Cauchy compares two tail terms"
        },
        {
          "do": "Apply the triangle inequality",
          "result": "$|1/m-1/n|\\le1/m+1/n$",
          "why": "bound by distances to 0"
        },
        {
          "do": "Choose a threshold",
          "result": "$N>2/\\varepsilon$",
          "why": "make each reciprocal below $\\varepsilon/2$"
        },
        {
          "do": "Use $m\\ge N$",
          "result": "$1/m\\le1/N<\\varepsilon/2$",
          "why": "tail bound for first index"
        },
        {
          "do": "Use $n\\ge N$",
          "result": "$1/n\\le1/N<\\varepsilon/2$",
          "why": "tail bound for second index"
        },
        {
          "do": "Add the bounds",
          "result": "$|1/m-1/n|<\\varepsilon$",
          "why": "two halves make the tolerance"
        }
      ],
      "verify": "For $\\varepsilon=0.01$, any $N>200$ works; after that, any two tail reciprocals differ by less than $0.01$.",
      "answer": "$(1/n)$ is Cauchy.",
      "connects": "Cauchy proofs show the tail clusters even without naming the limit first."
    },
    "practice": [
      {
        "problem": "Show every constant sequence $a_n=7$ is Cauchy.",
        "steps": [
          {
            "do": "Compare two terms",
            "result": "$|a_m-a_n|=|7-7|$",
            "why": "use arbitrary indices"
          },
          {
            "do": "Simplify",
            "result": "$0$",
            "why": "same value"
          },
          {
            "do": "Compare to tolerance",
            "result": "$0<\\varepsilon$",
            "why": "positive tolerance"
          },
          {
            "do": "Choose threshold",
            "result": "$N=1$",
            "why": "all terms work"
          },
          {
            "do": "State conclusion",
            "result": "m,n\\ge1\\Rightarrow |a_m-a_n|<\\varepsilon$",
            "why": "Cauchy definition"
          }
        ],
        "answer": "The constant sequence is Cauchy."
      },
      {
        "problem": "Show $a_n=(-1)^n$ is not Cauchy.",
        "steps": [
          {
            "do": "Choose a tolerance",
            "result": "$\\varepsilon=1$",
            "why": "one failed tolerance is enough"
          },
          {
            "do": "Take any threshold",
            "result": "N$ arbitrary",
            "why": "we must find late terms far apart"
          },
          {
            "do": "Choose a late even index",
            "result": "m\\ge N$ even",
            "why": "possible beyond any threshold"
          },
          {
            "do": "Choose a late odd index",
            "result": "n\\ge N$ odd",
            "why": "also possible beyond any threshold"
          },
          {
            "do": "Compute the distance",
            "result": "|a_m-a_n|=|1-(-1)|=2$",
            "why": "tail terms remain far apart"
          },
          {
            "do": "Compare to tolerance",
            "result": "$2\\not<1$",
            "why": "Cauchy condition fails"
          }
        ],
        "answer": "$(-1)^n$ is not Cauchy."
      },
      {
        "problem": "If $|a_n-3|<0.01$ for all $n\\ge100$, show tail terms differ by less than $0.02$.",
        "steps": [
          {
            "do": "Take tail indices",
            "result": "m,n\\ge100$",
            "why": "both estimates apply"
          },
          {
            "do": "Insert the limit point",
            "result": "$|a_m-a_n|\\le |a_m-3|+|a_n-3|$",
            "why": "triangle inequality"
          },
          {
            "do": "Use the first bound",
            "result": "$|a_m-3|<0.01$",
            "why": "given"
          },
          {
            "do": "Use the second bound",
            "result": "$|a_n-3|<0.01$",
            "why": "given"
          },
          {
            "do": "Add",
            "result": "$|a_m-a_n|<0.02$",
            "why": "tail terms are close"
          }
        ],
        "answer": "For $m,n\\ge100$, $|a_m-a_n|<0.02$."
      },
      {
        "problem": "Show $a_n=\\sum_{k=1}^n 2^{-k}$ is Cauchy using a tail estimate.",
        "steps": [
          {
            "do": "Assume $m>n$",
            "result": "$a_m-a_n=\\sum_{k=n+1}^m2^{-k}$",
            "why": "subtract partial sums"
          },
          {
            "do": "Bound by the infinite tail",
            "result": "$\\sum_{k=n+1}^{\\infty}2^{-k}$",
            "why": "finite tail is smaller"
          },
          {
            "do": "Evaluate the geometric tail",
            "result": "$2^{-n}$",
            "why": "first omitted term $2^{-(n+1)}$ over $1-1/2$"
          },
          {
            "do": "Choose threshold",
            "result": "$N$ with $2^{-N}<\\varepsilon$",
            "why": "powers of 2 shrink to 0"
          },
          {
            "do": "Conclude for $m,n\\ge N$",
            "result": "|a_m-a_n|<\\varepsilon$",
            "why": "tail bound controls differences"
          }
        ],
        "answer": "The partial sums are Cauchy."
      },
      {
        "problem": "An iterative solver has residual estimates $|x_m-x_n|\\le0.9^n$ whenever $m>n$. Find $N$ for tolerance $0.01$.",
        "steps": [
          {
            "do": "Set the target",
            "result": "$0.9^n<0.01$",
            "why": "ensure all later differences are small"
          },
          {
            "do": "Take logarithms",
            "result": "$n\\log(0.9)<\\log(0.01)$",
            "why": "both sides positive after careful sign handling"
          },
          {
            "do": "Divide by negative log",
            "result": "$n>\\log(0.01)/\\log(0.9)$",
            "why": "inequality flips because $\\log(0.9)<0$"
          },
          {
            "do": "Approximate",
            "result": "$\\log(0.01)/\\log(0.9)\\approx43.7$",
            "why": "calculator values"
          },
          {
            "do": "Choose threshold",
            "result": "$N=44$",
            "why": "integer above the bound"
          }
        ],
        "answer": "$N=44$ makes the residual bound less than $0.01$."
      }
    ],
    "applications": [
      {
        "title": "Stopping without knowing the answer",
        "background": "Numerical algorithms often stop when successive iterates are close, a Cauchy-style criterion.",
        "numbers": "If $|x_{k+1}-x_k|<10^{-6}$ for many late $k$, the tail is empirically clustering."
      },
      {
        "title": "Partial sums of series",
        "background": "Series convergence is exactly Cauchy behavior of partial sums.",
        "numbers": "For geometric tail $2^{-n}$, choosing $n=20$ gives tail below $9.54\\cdot10^{-7}$."
      },
      {
        "title": "Distributed consensus",
        "background": "Nodes reaching agreement means their values become pairwise close.",
        "numbers": "If all node values after round 50 lie in $[1.000,1.003]$, every pair differs by at most $0.003$."
      },
      {
        "title": "Model checkpoint stability",
        "background": "A run is stable when late checkpoints change little in parameter space.",
        "numbers": "If parameter vectors at epochs after 100 differ by norm below $0.02$, they satisfy a practical Cauchy tolerance."
      },
      {
        "title": "Compression refinement",
        "background": "Progressive encoders produce better approximations whose differences shrink.",
        "numbers": "If frame approximations differ by at most $255/2^k$, then at $k=12$ the bound is about $0.0623$ intensity units."
      },
      {
        "title": "Completeness of real arithmetic",
        "background": "Cauchy decimal approximations define real numbers.",
        "numbers": "Approximations $1.4,1.41,1.414,1.4142$ have pairwise tail differences below $0.001$ after the third term."
      }
    ],
    "applicationsClose": "Cauchy sequences let the tail certify convergence internally; in $\\mathbb{R}$, completeness turns that clustering into an actual limit.",
    "takeaways": [
      "Cauchy means all sufficiently late pairs of terms are close.",
      "Every convergent real sequence is Cauchy by the triangle inequality.",
      "Every Cauchy sequence in $\\mathbb{R}$ converges.",
      "Series convergence is Cauchy convergence of partial sums."
    ]
  },
  "math-04-11": {
    "id": "math-04-11",
    "title": "Infinite series",
    "tagline": "An infinite series converges when its sequence of partial sums converges.",
    "connections": {
      "buildsOn": [
        "sequences",
        "limits of sequences",
        "Cauchy sequences"
      ],
      "leadsTo": [
        "power series",
        "Fourier series",
        "expectations and approximations"
      ],
      "usedWith": [
        "partial sums",
        "geometric series",
        "comparison tests",
        "absolute convergence"
      ]
    },
    "motivation": "<p>You already add finite lists. An infinite series asks what happens when the list never stops: $a_1+a_2+a_3+\\cdots$.</p><p>The careful move is to stop after $n$ terms, study the partial sums $s_n$, and ask whether those sums converge. Infinite addition is not magic; it is a sequence limit.</p>",
    "definition": "<p>Given a sequence $(a_n)$, the <b>infinite series</b> $\\sum_{n=1}^{\\infty}a_n$ has partial sums $s_N=\\sum_{n=1}^{N}a_n$. The series <b>converges</b> to $S$ if $s_N\\to S$ as $N\\to\\infty$; otherwise it diverges.</p><p>The geometric series is the model example: if $|r|<1$, then $\\sum_{n=0}^{\\infty}ar^n=a/(1-r)$. Derive it from finite sums: $s_N=a(1-r^{N+1})/(1-r)$, and $r^{N+1}\\to0$ when $|r|<1$.</p><p><b>Assumptions that matter:</b> terms must satisfy $a_n\\to0$ for convergence, but that condition alone is not sufficient; convergence means partial sums converge; absolute convergence of $\\sum |a_n|$ implies convergence of $\\sum a_n$; and rearrangements are delicate for conditionally convergent series.</p>",
    "worked": {
      "problem": "Compute $\\sum_{n=0}^{\\infty}3(1/2)^n$.",
      "skills": [
        "geometric series",
        "partial sums",
        "convergence condition"
      ],
      "strategy": "Identify the first term and ratio, check $|r|<1$, then use the geometric formula.",
      "steps": [
        {
          "do": "Identify the first term",
          "result": "$a=3$",
          "why": "term at $n=0$"
        },
        {
          "do": "Identify the ratio",
          "result": "$r=1/2$",
          "why": "each term is half the previous one"
        },
        {
          "do": "Check convergence",
          "result": "|r|=1/2<1$",
          "why": "geometric series converges"
        },
        {
          "do": "Apply the formula",
          "result": "$a/(1-r)=3/(1-1/2)$",
          "why": "sum of a convergent geometric series"
        },
        {
          "do": "Simplify the denominator",
          "result": "$3/(1/2)$",
          "why": "$1-1/2=1/2$"
        },
        {
          "do": "Divide",
          "result": "$6$",
          "why": "dividing by one half doubles"
        }
      ],
      "verify": "The partial sums $3,4.5,5.25,5.625$ move toward $6$ from below.",
      "answer": "$\\sum_{n=0}^{\\infty}3(1/2)^n=6$.",
      "connects": "A series is controlled by the convergence of its partial sums."
    },
    "practice": [
      {
        "problem": "Find the first four partial sums of $\\sum_{n=1}^{\\infty}1/n$.",
        "steps": [
          {
            "do": "Compute $s_1$",
            "result": "$1$",
            "why": "first term"
          },
          {
            "do": "Compute $s_2$",
            "result": "$1+1/2=3/2$",
            "why": "add second term"
          },
          {
            "do": "Compute $s_3$",
            "result": "$3/2+1/3=11/6$",
            "why": "common denominator 6"
          },
          {
            "do": "Compute $s_4$",
            "result": "$11/6+1/4=25/12$",
            "why": "common denominator 12"
          },
          {
            "do": "Note behavior",
            "result": "partial sums increase",
            "why": "all terms are positive"
          }
        ],
        "answer": "$s_1=1$, $s_2=3/2$, $s_3=11/6$, $s_4=25/12$."
      },
      {
        "problem": "Use the geometric formula to sum $\\sum_{n=1}^{\\infty}5(0.2)^{n-1}$.",
        "steps": [
          {
            "do": "Identify the first term",
            "result": "$5$",
            "why": "when $n=1$, exponent is 0"
          },
          {
            "do": "Identify the ratio",
            "result": "$0.2$",
            "why": "each term is multiplied by 0.2"
          },
          {
            "do": "Check convergence",
            "result": "$0.2<1$",
            "why": "geometric condition"
          },
          {
            "do": "Apply formula",
            "result": "$5/(1-0.2)$",
            "why": "sum is first term over one minus ratio"
          },
          {
            "do": "Simplify",
            "result": "$5/0.8=6.25$",
            "why": "divide"
          }
        ],
        "answer": "The sum is $6.25$."
      },
      {
        "problem": "Show that $\\sum_{n=1}^{\\infty}1/n$ fails the term test?",
        "steps": [
          {
            "do": "Identify the terms",
            "result": "$a_n=1/n$",
            "why": "harmonic-series terms"
          },
          {
            "do": "Take the term limit",
            "result": "$a_n\\to0$",
            "why": "reciprocals shrink"
          },
          {
            "do": "Recall the term test",
            "result": "if $a_n$ does not tend to 0, the series diverges",
            "why": "it is only a one-way test"
          },
          {
            "do": "Apply the test",
            "result": "inconclusive",
            "why": "the terms do tend to 0"
          },
          {
            "do": "State the known result",
            "result": "the harmonic series still diverges",
            "why": "zero terms are necessary, not sufficient"
          }
        ],
        "answer": "The term test is inconclusive; although $1/n\\to0$, the harmonic series diverges."
      },
      {
        "problem": "Use comparison to show $\\sum_{n=1}^{\\infty}1/n^2$ has tail after $N$ bounded by $1/N$.",
        "steps": [
          {
            "do": "Compare terms for $n>N$",
            "result": "$1/n^2\\le1/[n(n-1)]$",
            "why": "because $n-1\\le n$"
          },
          {
            "do": "Rewrite comparison term",
            "result": "$1/[n(n-1)]=1/(n-1)-1/n$",
            "why": "telescoping identity"
          },
          {
            "do": "Sum from $N+1$ to $M$",
            "result": "$\\sum_{n=N+1}^{M}(1/(n-1)-1/n)$",
            "why": "finite comparison tail"
          },
          {
            "do": "Telescope",
            "result": "$1/N-1/M$",
            "why": "middle terms cancel"
          },
          {
            "do": "Let $M\\to\\infty$",
            "result": "$\\le1/N$",
            "why": "the last term tends to 0"
          }
        ],
        "answer": "The tail after $N$ is at most $1/N$."
      },
      {
        "problem": "A discounted reward is $1+0.9+0.9^2+\\cdots$. Compute its infinite sum and the tail after 10 terms.",
        "steps": [
          {
            "do": "Identify first term and ratio",
            "result": "$a=1$, $r=0.9$",
            "why": "geometric rewards"
          },
          {
            "do": "Compute total sum",
            "result": "$1/(1-0.9)=10$",
            "why": "geometric formula"
          },
          {
            "do": "Write tail after 10 terms",
            "result": "$0.9^{10}+0.9^{11}+\\cdots$",
            "why": "first omitted term"
          },
          {
            "do": "Sum the tail",
            "result": "$0.9^{10}/(1-0.9)$",
            "why": "geometric tail formula"
          },
          {
            "do": "Approximate",
            "result": "$0.3487/0.1=3.487$",
            "why": "using $0.9^{10}\\approx0.3487$"
          }
        ],
        "answer": "The total is $10$, and the tail after 10 terms is about $3.487$."
      }
    ],
    "applications": [
      {
        "title": "Discounted reinforcement learning",
        "background": "Discounted returns are geometric series when rewards are constant.",
        "numbers": "With reward $2$ and $\\gamma=0.95$, return is $2/(1-0.95)=40$."
      },
      {
        "title": "Neural network residual corrections",
        "background": "Iterative refinement can be modeled by shrinking error terms.",
        "numbers": "Errors $1,0.5,0.25,\\ldots$ sum to $2$, so total correction is bounded."
      },
      {
        "title": "Numerical approximation tails",
        "background": "Series tail bounds tell you how many terms are enough.",
        "numbers": "For a $1/n^2$ tail below $0.001$, the bound $1/N<0.001$ requires $N>1000$."
      },
      {
        "title": "Computer graphics lighting",
        "background": "Multiple light bounces with reflectance below 1 form a geometric decay.",
        "numbers": "Reflectance $0.6$ gives total relative light $1/(1-0.6)=2.5$ over infinitely many bounces."
      },
      {
        "title": "Queueing and retries",
        "background": "Repeated retry probabilities often form geometric sums.",
        "numbers": "If retry probability is $0.2$, expected attempts are $1+0.2+0.04+\\cdots=1.25$."
      },
      {
        "title": "Power-series features",
        "background": "Many functions are approximated by infinite polynomial series truncated in practice.",
        "numbers": "For $e^1$, the first four terms $1+1+1/2+1/6=2.6667$ approximate $e\\approx2.7183$ with error about $0.0516$."
      },
      {
        "title": "Signal decompositions",
        "background": "Fourier series represent signals as infinite sums of waves, with coefficients controlling convergence.",
        "numbers": "If amplitudes are $1/2^k$, total amplitude bound is $1$ because $1/2+1/4+\\cdots=1$."
      }
    ],
    "applicationsClose": "An infinite series is a sequence of partial sums in disguise; convergence means those finite sums approach one stable value.",
    "takeaways": [
      "$\\sum a_n$ converges when partial sums $s_N$ converge.",
      "Geometric series converge for $|r|<1$ and sum to $a/(1-r)$.",
      "Terms must go to zero, but that alone does not guarantee convergence.",
      "Tail estimates turn infinite sums into practical finite approximations."
    ]
  }
};
