module.exports = {
"math-19-01": {
  "id": "math-19-01",
  "title": "What is a stochastic process?",
  "tagline": "A stochastic process is a random story told over time, one indexed random variable at a time.",
  "connections": {
    "buildsOn": [
      "random variables",
      "expectation",
      "conditional probability",
      "sequences"
    ],
    "leadsTo": [
      "Discrete-time Markov chains",
      "Poisson processes",
      "Random walks"
    ],
    "usedWith": [
      "time series",
      "joint distributions",
      "conditional expectation",
      "covariance"
    ]
  },
  "motivation": "<p>You already know how one random variable describes one uncertain measurement, like a click count or a coin toss. Real systems usually unfold through many measurements.</p><p>A <b>stochastic process</b> keeps the uncertainty and adds an index such as time, step, or location. Instead of one random outcome, we study a whole random path.</p>",
  "definition": "<p>A <b>stochastic process</b> is a family of random variables $\\{X_t:t\\in T\\}$ on a common probability space. The set $T$ is the index set, and each $X_t$ takes values in a state space $S$.</p><p>Finite-dimensional distributions describe the process: probabilities such as $P(X_0=i,X_1=j,X_2=k)$ tell us how several observations fit together. Dependence across time is part of the model, not a defect.</p><p><b>Assumptions that matter:</b> all variables share one probability model; the index set says when we observe; the state space says what values are possible; and the joint behavior across indices must be specified or estimated.</p>",
  "worked": {
    "problem": "A two-day weather process has states Sunny $S$ and Rainy $R$. Suppose $P(X_0=S)=0.7$, $P(X_1=S\\mid X_0=S)=0.8$, and $P(X_1=S\\mid X_0=R)=0.4$. Find $P(X_1=S)$.",
    "skills": [
      "state spaces",
      "law of total probability",
      "conditional probability"
    ],
    "strategy": "Tomorrow depends on today — split by today's state and add the two branches.",
    "steps": [
      {
        "do": "Find the rainy probability today",
        "result": "$P(X_0=R)=1-0.7=0.3$",
        "why": "the two states exhaust the state space"
      },
      {
        "do": "Write total probability",
        "result": "$P(X_1=S)=P(X_1=S\\mid X_0=S)P(X_0=S)+P(X_1=S\\mid X_0=R)P(X_0=R)$",
        "why": "condition on the first time point"
      },
      {
        "do": "Substitute the numbers",
        "result": "$0.8\\cdot0.7+0.4\\cdot0.3$",
        "why": "use each conditional probability on its branch"
      },
      {
        "do": "Multiply branch terms",
        "result": "$0.56+0.12$",
        "why": "each branch contributes a joint probability"
      },
      {
        "do": "Add",
        "result": "$0.68$",
        "why": "disjoint branches combine by addition"
      }
    ],
    "verify": "The result lies between $0.4$ and $0.8$, closer to $0.8$ because today is more likely sunny.",
    "answer": "$P(X_1=S)=0.68$.",
    "connects": "A process question becomes clearer once the indexed variables and branches are named."
  },
  "practice": [
    {
      "problem": "A binary process has $P(X_0=1)=0.6$, $P(X_1=1\\mid X_0=1)=0.5$, and $P(X_1=1\\mid X_0=0)=0.2$. Find $P(X_1=1)$.",
      "steps": [
        {
          "do": "Find $P(X_0=0)$",
          "result": "$0.4$",
          "why": "binary probabilities sum to one"
        },
        {
          "do": "Write total probability",
          "result": "$P(X_1=1)=0.5P(X_0=1)+0.2P(X_0=0)$",
          "why": "split by the first state"
        },
        {
          "do": "Substitute",
          "result": "$0.5\\cdot0.6+0.2\\cdot0.4$",
          "why": "use the given conditionals"
        },
        {
          "do": "Multiply",
          "result": "$0.30+0.08$",
          "why": "compute branches"
        },
        {
          "do": "Add",
          "result": "$0.38$",
          "why": "combine disjoint cases"
        }
      ],
      "answer": "$P(X_1=1)=0.38$."
    },
    {
      "problem": "A path records active users $(X_0,X_1,X_2)=(10,13,11)$. Identify the index type, state type, and path segment.",
      "steps": [
        {
          "do": "List indices",
          "result": "$0,1,2$",
          "why": "observations occur at separate minutes"
        },
        {
          "do": "Name the index set",
          "result": "$T=\\{0,1,2,\\ldots\\}$",
          "why": "future minutes continue discretely"
        },
        {
          "do": "Name the state space",
          "result": "$S=\\{0,1,2,\\ldots\\}$",
          "why": "counts are nonnegative integers"
        },
        {
          "do": "Write the path",
          "result": "$(10,13,11)$",
          "why": "values are listed in time order"
        },
        {
          "do": "Classify",
          "result": "discrete time and countable state space",
          "why": "both index and states are discrete"
        }
      ],
      "answer": "It is a discrete-time count process with path segment $(10,13,11)$."
    },
    {
      "problem": "A Bernoulli process has independent $X_t\\sim\\operatorname{Bernoulli}(0.3)$. Find $P(X_0=1,X_1=0,X_2=1)$.",
      "steps": [
        {
          "do": "Write the joint probability",
          "result": "$P(X_0=1,X_1=0,X_2=1)$",
          "why": "name the path event"
        },
        {
          "do": "Use independence",
          "result": "$P(X_0=1)P(X_1=0)P(X_2=1)$",
          "why": "independent times factor"
        },
        {
          "do": "Substitute",
          "result": "$0.3\\cdot0.7\\cdot0.3$",
          "why": "success is $0.3$ and failure is $0.7$"
        },
        {
          "do": "Multiply first two factors",
          "result": "$0.21\\cdot0.3$",
          "why": "combine the first two times"
        },
        {
          "do": "Multiply final factor",
          "result": "$0.063$",
          "why": "complete the path probability"
        }
      ],
      "answer": "The path probability is $0.063$."
    },
    {
      "problem": "A process has variances $4$ and $9$ at two times and correlation $1/3$. Find the covariance.",
      "steps": [
        {
          "do": "Compute first standard deviation",
          "result": "$\\sigma_0=\\sqrt4=2$",
          "why": "standard deviation is square root of variance"
        },
        {
          "do": "Compute second standard deviation",
          "result": "$\\sigma_1=\\sqrt9=3$",
          "why": "same rule"
        },
        {
          "do": "Recall correlation",
          "result": "$\\rho=\\operatorname{Cov}(X_0,X_1)/(\\sigma_0\\sigma_1)$",
          "why": "correlation standardizes covariance"
        },
        {
          "do": "Solve for covariance",
          "result": "$\\operatorname{Cov}=\\rho\\sigma_0\\sigma_1$",
          "why": "multiply by the standard deviations"
        },
        {
          "do": "Substitute",
          "result": "$\\operatorname{Cov}=\\tfrac13\\cdot2\\cdot3=2$",
          "why": "compute the value"
        }
      ],
      "answer": "The covariance is $2$."
    },
    {
      "problem": "Request latency has variance $100$ and lag-one covariance $25$. Find the lag-one autocorrelation.",
      "steps": [
        {
          "do": "Write autocorrelation",
          "result": "$\\rho(1)=\\operatorname{Cov}(X_t,X_{t+1})/\\operatorname{Var}(X_t)$",
          "why": "same variance is used at both adjacent times"
        },
        {
          "do": "Substitute",
          "result": "$\\rho(1)=25/100$",
          "why": "use the given values"
        },
        {
          "do": "Simplify",
          "result": "$0.25$",
          "why": "divide by 100"
        },
        {
          "do": "Interpret sign",
          "result": "positive dependence",
          "why": "large values tend to be followed by somewhat large values"
        },
        {
          "do": "Interpret size",
          "result": "modest memory",
          "why": "the value is positive but far from one"
        }
      ],
      "answer": "The lag-one autocorrelation is $0.25$."
    }
  ],
  "applications": [
    {
      "title": "Model monitoring",
      "background": "Stochastic-process thinking helps teams treat metrics as evolving random quantities rather than isolated numbers.",
      "numbers": "For counts $120,150,141$, the net change from first to last is $21$."
    },
    {
      "title": "Recommendation systems",
      "background": "Stochastic-process thinking appears when user state, item exposure, or exploration changes over sessions.",
      "numbers": "If token path probability is $0.2\\cdot0.4=0.08$, two positions are modeled jointly."
    },
    {
      "title": "Queueing and serving systems",
      "background": "Production services use stochastic-process thinking ideas to reason about arrivals, failures, and waiting.",
      "numbers": "A queue with $5$ jobs plus $3$ arrivals minus $4$ completions moves to $4$."
    },
    {
      "title": "Language and sequence models",
      "background": "Sequence modeling often begins with probabilistic rules over positions before adding richer neural context.",
      "numbers": "A two-token path with probabilities $0.25$ and $0.10$ has probability $0.025$."
    },
    {
      "title": "Simulation",
      "background": "Engineers simulate stochastic models to estimate quantities that are hard to solve exactly.",
      "numbers": "Simulating $1000$ paths and seeing $73$ failures estimates failure probability $0.073$."
    },
    {
      "title": "Risk and reliability",
      "background": "Finance, operations, and reliability all need probabilities over future paths, not just one-step averages.",
      "numbers": "A price path $100,102,98.94$ has returns $2\\%$ and $-3\\%$."
    }
  ],
  "applicationsClose": "Across these examples, the same idea wears different clothes: random variables indexed by time let us reason about uncertain paths.",
  "takeaways": [
    "A stochastic process is a family $\\{X_t:t\\in T\\}$ of random variables.",
    "The index set describes when or where observations occur.",
    "The state space describes possible values.",
    "Joint distributions across times describe dependence and paths."
  ]
},
"math-19-02": {
  "id": "math-19-02",
  "title": "Discrete-time Markov chains",
  "tagline": "A Markov chain remembers the present state and lets the older past step aside.",
  "connections": {
    "buildsOn": [
      "What is a stochastic process?",
      "conditional probability",
      "linear algebra"
    ],
    "leadsTo": [
      "Stationary distributions",
      "Limiting distributions",
      "stochastic simulation"
    ],
    "usedWith": [
      "conditional probability",
      "matrix multiplication",
      "expectation",
      "linear equations"
    ]
  },
  "motivation": "<p>You already know that new information changes conditional probabilities. A Markov chain is the time-evolution version of that idea.</p><p>The helpful simplification is that the current state contains all the predictive information we keep. Once the present is known, older history no longer changes the next-step probabilities.</p>",
  "definition": "<p>A <b>discrete-time Markov chain</b> is a process $X_0,X_1,\\ldots$ with state space $S$ such that $P(X_{n+1}=j\\mid X_n=i,X_{n-1},\\ldots,X_0)=P(X_{n+1}=j\\mid X_n=i)$. Write $P_{ij}=P(X_{n+1}=j\\mid X_n=i)$.</p><p>This is conditional independence, not forgetfulness in a casual sense. The future may depend strongly on the present; the claim is only that the older past adds no extra information after the present state is known.</p><p><b>Assumptions that matter:</b> time advances in integer steps; each transition row sums to $1$; time-homogeneous chains reuse the same $P_{ij}$ at every step; and the Markov property depends on choosing a state rich enough to summarize the past.</p>",
  "worked": {
    "problem": "A customer is Active $A$ or Inactive $I$. From $A$, stay active with probability $0.9$; from $I$, become active with probability $0.3$. If $P(X_0=A)=0.6$, find $P(X_1=A)$.",
    "skills": [
      "probability modeling",
      "calculation",
      "interpretation"
    ],
    "strategy": "Use the current state as the only needed history and split by $X_0$.",
    "steps": [
      {
        "do": "Find inactive probability",
        "result": "$0.4$",
        "why": "two states sum to one"
      },
      {
        "do": "Write total probability",
        "result": "$0.9\\cdot0.6+0.3\\cdot0.4$",
        "why": "split by current state"
      },
      {
        "do": "Multiply",
        "result": "$0.54+0.12$",
        "why": "compute branches"
      },
      {
        "do": "Add",
        "result": "$0.66$",
        "why": "combine branches"
      },
      {
        "do": "Check",
        "result": "between $0$ and $1$",
        "why": "valid probability"
      }
    ],
    "verify": "The arithmetic matches the model assumptions and gives a valid probability, distribution, or rate-based quantity.",
    "answer": "$P(X_1=A)=0.66$.",
    "connects": "The Markov property turns a long-history prediction into a one-step conditional calculation."
  },
  "practice": [
    {
      "problem": "A chain has $P_{00}=0.7$, $P_{01}=0.3$, $P_{10}=0.4$, $P_{11}=0.6$. If $X_0=0$, find $P(X_2=1)$.",
      "steps": [
        {
          "do": "Find $P(X_1=0)$",
          "result": "$0.7$",
          "why": "row 0 column 0"
        },
        {
          "do": "Find $P(X_1=1)$",
          "result": "$0.3$",
          "why": "row 0 column 1"
        },
        {
          "do": "Split by $X_1$",
          "result": "$P(X_2=1)=0.7P_{01}+0.3P_{11}$",
          "why": "condition on the middle state"
        },
        {
          "do": "Substitute",
          "result": "$0.7\\cdot0.3+0.3\\cdot0.6$",
          "why": "use the matrix entries"
        },
        {
          "do": "Add",
          "result": "$0.39$",
          "why": "combine paths"
        }
      ],
      "answer": "$P(X_2=1)=0.39$."
    },
    {
      "problem": "From Low, stay Low with probability $0.8$; from High, go Low with probability $0.5$. If $P(X_0=\\text{Low})=0.25$, find $P(X_1=\\text{Low})$.",
      "steps": [
        {
          "do": "Find High probability",
          "result": "$0.75$",
          "why": "probabilities sum to one"
        },
        {
          "do": "Write total probability",
          "result": "$0.25\\cdot0.8+0.75\\cdot0.5$",
          "why": "split by current state"
        },
        {
          "do": "Multiply",
          "result": "$0.20+0.375$",
          "why": "compute branches"
        },
        {
          "do": "Add",
          "result": "$0.575$",
          "why": "combine branches"
        },
        {
          "do": "Check range",
          "result": "between $0$ and $1$",
          "why": "valid probability"
        }
      ],
      "answer": "$P(X_1=\\text{Low})=0.575$."
    },
    {
      "problem": "Explain why $P(X_3=j\\mid X_2=i,X_1=a,X_0=b)=P_{ij}$ in a time-homogeneous Markov chain.",
      "steps": [
        {
          "do": "Identify the present",
          "result": "$X_2=i$",
          "why": "latest state is the summary"
        },
        {
          "do": "Identify older history",
          "result": "$X_1=a,X_0=b$",
          "why": "these are earlier states"
        },
        {
          "do": "Apply Markov property",
          "result": "$P(X_3=j\\mid X_2=i,X_1=a,X_0=b)=P(X_3=j\\mid X_2=i)$",
          "why": "older history drops out"
        },
        {
          "do": "Use homogeneity",
          "result": "$P(X_3=j\\mid X_2=i)=P_{ij}$",
          "why": "same rule at every time"
        },
        {
          "do": "Conclude",
          "result": "$P_{ij}$",
          "why": "only current state matters"
        }
      ],
      "answer": "The conditional probability equals $P_{ij}$."
    },
    {
      "problem": "A row for state 2 is $[0.1,0.6,0.3]$. If $X_5=2$, find the expected next state label using labels $1,2,3$.",
      "steps": [
        {
          "do": "Write expectation",
          "result": "$1(0.1)+2(0.6)+3(0.3)$",
          "why": "weight labels by probabilities"
        },
        {
          "do": "Multiply terms",
          "result": "$0.1+1.2+0.9$",
          "why": "compute contributions"
        },
        {
          "do": "Add",
          "result": "$2.2$",
          "why": "sum contributions"
        },
        {
          "do": "Name distribution",
          "result": "$[0.1,0.6,0.3]$",
          "why": "next-state probabilities"
        },
        {
          "do": "Interpret",
          "result": "centered near state 2",
          "why": "largest mass is on label 2"
        }
      ],
      "answer": "The expected next label is $2.2$."
    },
    {
      "problem": "A click model has $P_{NC}=0.05$, $P_{CC}=0.6$, and from clicked the next distribution is $[P(N),P(C)]=[0.4,0.6]$. Find the two-step click probability.",
      "steps": [
        {
          "do": "Split by middle state",
          "result": "$0.4P_{NC}+0.6P_{CC}$",
          "why": "condition on state after one step"
        },
        {
          "do": "Substitute",
          "result": "$0.4\\cdot0.05+0.6\\cdot0.6$",
          "why": "use transitions into click"
        },
        {
          "do": "Multiply",
          "result": "$0.02+0.36$",
          "why": "compute paths"
        },
        {
          "do": "Add",
          "result": "$0.38$",
          "why": "combine paths"
        },
        {
          "do": "Convert",
          "result": "38 percent",
          "why": "interpret probability"
        }
      ],
      "answer": "The two-step click probability is $0.38$."
    }
  ],
  "applications": [
    {
      "title": "Model monitoring",
      "background": "Discrete-time Markov chains helps teams treat metrics as evolving random quantities rather than isolated numbers.",
      "numbers": "With probability $0.8$ of staying and $0.2$ of moving, $1000$ items yield about $800$ stays."
    },
    {
      "title": "Recommendation systems",
      "background": "Discrete-time Markov chains appears when user state, item exposure, or exploration changes over sessions.",
      "numbers": "A two-state recommender with mass $[0.7,0.3]$ sends $0.7\\cdot0.1=0.07$ mass into exploration from state 1."
    },
    {
      "title": "Queueing and serving systems",
      "background": "Production services use discrete-time markov chains ideas to reason about arrivals, failures, and waiting.",
      "numbers": "Arrival rate $6$/hour gives expected $6\\cdot0.5=3$ arrivals in half an hour."
    },
    {
      "title": "Language and sequence models",
      "background": "Sequence modeling often begins with probabilistic rules over positions before adding richer neural context.",
      "numbers": "A token transition of $0.25$ followed by $0.4$ gives path probability $0.10$."
    },
    {
      "title": "Simulation",
      "background": "Engineers simulate stochastic models to estimate quantities that are hard to solve exactly.",
      "numbers": "In $5000$ simulated paths, $425$ successes estimate probability $0.085$."
    },
    {
      "title": "Risk and reliability",
      "background": "Finance, operations, and reliability all need probabilities over future paths, not just one-step averages.",
      "numbers": "A failure probability of $0.001$ per minute gives about $1.44$ expected failures per day."
    }
  ],
  "applicationsClose": "The common thread is patient bookkeeping: define the state, write the local rule, and let probability carry the system through time.",
  "takeaways": [
    "Stochastic-process models describe random evolution over time.",
    "Local rules often determine multi-step and long-run behavior.",
    "Always check state definitions and assumptions before trusting the calculation.",
    "These tools support ML systems, queues, reliability models, and simulation."
  ]
},
"math-19-03": {
  "id": "math-19-03",
  "title": "Transition matrices",
  "tagline": "A transition matrix stores every one-step move in a table you can multiply.",
  "connections": {
    "buildsOn": [
      "What is a stochastic process?",
      "conditional probability",
      "linear algebra"
    ],
    "leadsTo": [
      "Stationary distributions",
      "Limiting distributions",
      "stochastic simulation"
    ],
    "usedWith": [
      "conditional probability",
      "matrix multiplication",
      "expectation",
      "linear equations"
    ]
  },
  "motivation": "<p>You already use tables to organize conditional probabilities. A transition matrix is that table with a job: move a whole distribution one step forward.</p><p>Rows describe where the chain is now; columns describe where it goes next. Matrix multiplication is just total probability in compact form.</p>",
  "definition": "<p>For states $1,\\ldots,m$, the <b>transition matrix</b> $P$ has entries $P_{ij}=P(X_{n+1}=j\\mid X_n=i)$. Entries are nonnegative and every row sums to $1$.</p><p>If $\\mu_n$ is a row vector of state probabilities, then $\\mu_{n+1}=\\mu_nP$. Its $j$th component is $\\sum_i\\mu_n(i)P_{ij}$, the total probability of landing in $j$ from all possible current states.</p><p><b>Assumptions that matter:</b> this lesson uses row vectors; state order must stay fixed; rows, not columns, sum to $1$; and powers $P^k$ describe $k$-step transitions only when the transition rule is time-homogeneous.</p>",
  "worked": {
    "problem": "Let $P=\\begin{bmatrix}0.7&0.3\\0.2&0.8\\end{bmatrix}$ and $\\mu_0=[0.6,0.4]$. Find $\\mu_1$.",
    "skills": [
      "probability modeling",
      "calculation",
      "interpretation"
    ],
    "strategy": "Multiply the row distribution by the transition matrix, one component at a time.",
    "steps": [
      {
        "do": "Compute state 1 mass",
        "result": "$0.6\\cdot0.7+0.4\\cdot0.2=0.50$",
        "why": "sum ways to land in state 1"
      },
      {
        "do": "Compute state 2 mass",
        "result": "$0.6\\cdot0.3+0.4\\cdot0.8=0.50$",
        "why": "sum ways to land in state 2"
      },
      {
        "do": "Write vector",
        "result": "$[0.50,0.50]$",
        "why": "combine components"
      },
      {
        "do": "Check sum",
        "result": "$1.00$",
        "why": "probabilities remain normalized"
      },
      {
        "do": "Interpret",
        "result": "equal chance of both states",
        "why": "the next distribution is balanced"
      }
    ],
    "verify": "The arithmetic matches the model assumptions and gives a valid probability, distribution, or rate-based quantity.",
    "answer": "$\\mu_1=[0.50,0.50]$.",
    "connects": "A transition matrix is total probability written as linear algebra."
  },
  "practice": [
    {
      "problem": "Check whether $\\begin{bmatrix}0.4&0.6\\0.1&0.9\\end{bmatrix}$ is a valid transition matrix.",
      "steps": [
        {
          "do": "Check entries",
          "result": "all entries are nonnegative",
          "why": "probabilities cannot be negative"
        },
        {
          "do": "Sum row 1",
          "result": "$0.4+0.6=1$",
          "why": "current state 1 must go somewhere"
        },
        {
          "do": "Sum row 2",
          "result": "$0.1+0.9=1$",
          "why": "same rule for row 2"
        },
        {
          "do": "Apply criterion",
          "result": "valid",
          "why": "nonnegative rows sum to one"
        },
        {
          "do": "Count states",
          "result": "2 states",
          "why": "the matrix is $2\\times2$"
        }
      ],
      "answer": "It is valid."
    },
    {
      "problem": "For $P=\\begin{bmatrix}0.5&0.5\\0.2&0.8\\end{bmatrix}$ and $\\mu=[1,0]$, find $\\mu P$.",
      "steps": [
        {
          "do": "Compute component 1",
          "result": "$1\\cdot0.5+0\\cdot0.2=0.5$",
          "why": "dot with column 1"
        },
        {
          "do": "Compute component 2",
          "result": "$1\\cdot0.5+0\\cdot0.8=0.5$",
          "why": "dot with column 2"
        },
        {
          "do": "Write vector",
          "result": "$[0.5,0.5]$",
          "why": "combine components"
        },
        {
          "do": "Check sum",
          "result": "$1$",
          "why": "distribution remains normalized"
        },
        {
          "do": "Interpret",
          "result": "row 1 is selected",
          "why": "starting state is known"
        }
      ],
      "answer": "$\\mu P=[0.5,0.5]$."
    },
    {
      "problem": "Compute the first row of $P^2$ for $P=\\begin{bmatrix}0.5&0.5\\0.2&0.8\\end{bmatrix}$.",
      "steps": [
        {
          "do": "Compute entry $(1,1)$",
          "result": "$0.5\\cdot0.5+0.5\\cdot0.2=0.35$",
          "why": "row 1 by column 1"
        },
        {
          "do": "Compute entry $(1,2)$",
          "result": "$0.5\\cdot0.5+0.5\\cdot0.8=0.65$",
          "why": "row 1 by column 2"
        },
        {
          "do": "Write row",
          "result": "$[0.35,0.65]$",
          "why": "two entries form the row"
        },
        {
          "do": "Check sum",
          "result": "$1$",
          "why": "two-step probabilities sum to one"
        },
        {
          "do": "Interpret",
          "result": "$0.65$ chance of state 2 after two steps",
          "why": "read column 2"
        }
      ],
      "answer": "The first row is $[0.35,0.65]$."
    },
    {
      "problem": "A distribution is $[0.2,0.5,0.3]$ and the column into state 2 is $[0.1,0.6,0.4]^T$. Find next probability of state 2.",
      "steps": [
        {
          "do": "Write dot product",
          "result": "$0.2\\cdot0.1+0.5\\cdot0.6+0.3\\cdot0.4$",
          "why": "distribution times column"
        },
        {
          "do": "Multiply",
          "result": "$0.02+0.30+0.12$",
          "why": "compute contributions"
        },
        {
          "do": "Add",
          "result": "$0.44$",
          "why": "total incoming mass"
        },
        {
          "do": "Check range",
          "result": "between $0$ and $1$",
          "why": "valid probability"
        },
        {
          "do": "Interpret",
          "result": "44 percent",
          "why": "convert to percent"
        }
      ],
      "answer": "The next probability of state 2 is $0.44$."
    },
    {
      "problem": "A state vector $[0.7,0.3]$ uses $P=\\begin{bmatrix}0.9&0.1\\0.4&0.6\\end{bmatrix}$. Find the probability of state 2 after one step.",
      "steps": [
        {
          "do": "Choose column 2",
          "result": "$[0.1,0.6]^T$",
          "why": "state 2 is the target"
        },
        {
          "do": "Dot with vector",
          "result": "$0.7\\cdot0.1+0.3\\cdot0.6$",
          "why": "sum incoming mass"
        },
        {
          "do": "Multiply",
          "result": "$0.07+0.18$",
          "why": "compute branches"
        },
        {
          "do": "Add",
          "result": "$0.25$",
          "why": "combine branches"
        },
        {
          "do": "Interpret",
          "result": "25 percent",
          "why": "convert probability"
        }
      ],
      "answer": "The probability is $0.25$."
    }
  ],
  "applications": [
    {
      "title": "Model monitoring",
      "background": "Transition matrices helps teams treat metrics as evolving random quantities rather than isolated numbers.",
      "numbers": "With probability $0.8$ of staying and $0.2$ of moving, $1000$ items yield about $800$ stays."
    },
    {
      "title": "Recommendation systems",
      "background": "Transition matrices appears when user state, item exposure, or exploration changes over sessions.",
      "numbers": "A two-state recommender with mass $[0.7,0.3]$ sends $0.7\\cdot0.1=0.07$ mass into exploration from state 1."
    },
    {
      "title": "Queueing and serving systems",
      "background": "Production services use transition matrices ideas to reason about arrivals, failures, and waiting.",
      "numbers": "Arrival rate $6$/hour gives expected $6\\cdot0.5=3$ arrivals in half an hour."
    },
    {
      "title": "Language and sequence models",
      "background": "Sequence modeling often begins with probabilistic rules over positions before adding richer neural context.",
      "numbers": "A token transition of $0.25$ followed by $0.4$ gives path probability $0.10$."
    },
    {
      "title": "Simulation",
      "background": "Engineers simulate stochastic models to estimate quantities that are hard to solve exactly.",
      "numbers": "In $5000$ simulated paths, $425$ successes estimate probability $0.085$."
    },
    {
      "title": "Risk and reliability",
      "background": "Finance, operations, and reliability all need probabilities over future paths, not just one-step averages.",
      "numbers": "A failure probability of $0.001$ per minute gives about $1.44$ expected failures per day."
    }
  ],
  "applicationsClose": "The common thread is patient bookkeeping: define the state, write the local rule, and let probability carry the system through time.",
  "takeaways": [
    "Stochastic-process models describe random evolution over time.",
    "Local rules often determine multi-step and long-run behavior.",
    "Always check state definitions and assumptions before trusting the calculation.",
    "These tools support ML systems, queues, reliability models, and simulation."
  ]
},
"math-19-04": {
  "id": "math-19-04",
  "title": "The Chapman–Kolmogorov equations",
  "tagline": "Multi-step transition probabilities are built by summing over the middle states.",
  "connections": {
    "buildsOn": [
      "What is a stochastic process?",
      "conditional probability",
      "linear algebra"
    ],
    "leadsTo": [
      "Stationary distributions",
      "Limiting distributions",
      "stochastic simulation"
    ],
    "usedWith": [
      "conditional probability",
      "matrix multiplication",
      "expectation",
      "linear equations"
    ]
  },
  "motivation": "<p>You already split probabilities by cases. For a process moving through time, the natural cases are the possible intermediate states.</p><p>Chapman-Kolmogorov is the formal version of that path stitching. To go from now to later, the chain must pass through somewhere in between.</p>",
  "definition": "<p>For a time-homogeneous Markov chain, the <b>Chapman-Kolmogorov equations</b> say $P^{(m+n)}_{ij}=\\sum_k P^{(m)}_{ik}P^{(n)}_{kj}$, where $P^{(r)}_{ab}=P(X_r=b\\mid X_0=a)$.</p><p>The derivation is total probability: condition on $X_m=k$, multiply the probability of reaching $k$ in $m$ steps by the probability of going from $k$ to $j$ in the next $n$ steps, then sum over $k$.</p><p><b>Assumptions that matter:</b> the sum includes all intermediate states; time-homogeneity lets the second factor depend only on elapsed time; and in finite chains the equation is matrix multiplication $P^{m+n}=P^mP^n$.</p>",
  "worked": {
    "problem": "For $P=\\begin{bmatrix}0.7&0.3\\0.2&0.8\\end{bmatrix}$, compute $P^{(2)}_{12}$.",
    "skills": [
      "probability modeling",
      "calculation",
      "interpretation"
    ],
    "strategy": "The chain can be in state 1 or 2 after one step, so sum over that middle state.",
    "steps": [
      {
        "do": "Write middle-state sum",
        "result": "$P^{(2)}_{12}=P_{11}P_{12}+P_{12}P_{22}$",
        "why": "middle state is 1 or 2"
      },
      {
        "do": "Substitute",
        "result": "$0.7\\cdot0.3+0.3\\cdot0.8$",
        "why": "read entries"
      },
      {
        "do": "Multiply",
        "result": "$0.21+0.24$",
        "why": "compute path probabilities"
      },
      {
        "do": "Add",
        "result": "$0.45$",
        "why": "sum paths"
      },
      {
        "do": "Check range",
        "result": "between $0$ and $1$",
        "why": "valid probability"
      }
    ],
    "verify": "The arithmetic matches the model assumptions and gives a valid probability, distribution, or rate-based quantity.",
    "answer": "$P^{(2)}_{12}=0.45$.",
    "connects": "Chapman-Kolmogorov explains why multi-step movement is a sum of path fragments."
  },
  "practice": [
    {
      "problem": "Compute $P^{(2)}_{11}$ for $P=\\begin{bmatrix}0.7&0.3\\0.2&0.8\\end{bmatrix}$.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Compute $P^{(2)}_{11}$ for $P=\\begin{bmatrix}0.7&0.3\\0.2&0.8\\end{bmatrix}$.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "$0.55$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$0.55$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$0.55$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$0.55$."
    },
    {
      "problem": "A path goes A to A to C with probabilities $0.9,0.2$ or A to B to C with $0.1,0.7$. Find two-step A to C probability.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "A path goes A to A to C with probabilities $0.9,0.2$ or A to B to C with $0.1,0.7$. Find two-step A to C probability.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $0.25$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$0.25$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$0.25$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$0.25$."
    },
    {
      "problem": "If $P^2_{21}=0.30$, $P^2_{22}=0.70$, $P_{12}=0.30$, $P_{22}=0.80$, compute $(P^3)_{22}$.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "If $P^2_{21}=0.30$, $P^2_{22}=0.70$, $P_{12}=0.30$, $P_{22}=0.80$, compute $(P^3)_{22}$.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $0.65$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$0.65$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$0.65$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$0.65$."
    },
    {
      "problem": "Fresh features become stale with $P_{FS}=0.05$, $P_{SS}=0.4$, and $P_{FF}=0.95$. Find two-step fresh-to-stale probability.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Fresh features become stale with $P_{FS}=0.05$, $P_{SS}=0.4$, and $P_{FF}=0.95$. Find two-step fresh-to-stale probability.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $0.0675$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$0.0675$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$0.0675$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$0.0675$."
    },
    {
      "problem": "If three middle-state contributions are $0.12$, $0.20$, and $0.05$, find the multi-step probability.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "If three middle-state contributions are $0.12$, $0.20$, and $0.05$, find the multi-step probability.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $0.37$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$0.37$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$0.37$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$0.37$."
    }
  ],
  "applications": [
    {
      "title": "Model monitoring",
      "background": "Chapman-Kolmogorov equations helps teams treat metrics as evolving random quantities rather than isolated numbers.",
      "numbers": "With probability $0.8$ of staying and $0.2$ of moving, $1000$ items yield about $800$ stays."
    },
    {
      "title": "Recommendation systems",
      "background": "Chapman-Kolmogorov equations appears when user state, item exposure, or exploration changes over sessions.",
      "numbers": "A two-state recommender with mass $[0.7,0.3]$ sends $0.7\\cdot0.1=0.07$ mass into exploration from state 1."
    },
    {
      "title": "Queueing and serving systems",
      "background": "Production services use chapman-kolmogorov equations ideas to reason about arrivals, failures, and waiting.",
      "numbers": "Arrival rate $6$/hour gives expected $6\\cdot0.5=3$ arrivals in half an hour."
    },
    {
      "title": "Language and sequence models",
      "background": "Sequence modeling often begins with probabilistic rules over positions before adding richer neural context.",
      "numbers": "A token transition of $0.25$ followed by $0.4$ gives path probability $0.10$."
    },
    {
      "title": "Simulation",
      "background": "Engineers simulate stochastic models to estimate quantities that are hard to solve exactly.",
      "numbers": "In $5000$ simulated paths, $425$ successes estimate probability $0.085$."
    },
    {
      "title": "Risk and reliability",
      "background": "Finance, operations, and reliability all need probabilities over future paths, not just one-step averages.",
      "numbers": "A failure probability of $0.001$ per minute gives about $1.44$ expected failures per day."
    }
  ],
  "applicationsClose": "The common thread is patient bookkeeping: define the state, write the local rule, and let probability carry the system through time.",
  "takeaways": [
    "Stochastic-process models describe random evolution over time.",
    "Local rules often determine multi-step and long-run behavior.",
    "Always check state definitions and assumptions before trusting the calculation.",
    "These tools support ML systems, queues, reliability models, and simulation."
  ]
},
"math-19-05": {
  "id": "math-19-05",
  "title": "Classification of states",
  "tagline": "State classification tells you which parts of a chain are reachable, returnable, and long-lived.",
  "connections": {
    "buildsOn": [
      "What is a stochastic process?",
      "conditional probability",
      "linear algebra"
    ],
    "leadsTo": [
      "Stationary distributions",
      "Limiting distributions",
      "stochastic simulation"
    ],
    "usedWith": [
      "conditional probability",
      "matrix multiplication",
      "expectation",
      "linear equations"
    ]
  },
  "motivation": "<p>Once a chain has several states, not all states play the same role. Some communicate, some trap probability, and some are only temporary stops.</p><p>Classification gives names to those roles so a transition diagram becomes a map of long-run possibilities.</p>",
  "definition": "<p>State $j$ is <b>accessible</b> from $i$, written $i\\to j$, if $P^n_{ij}>0$ for some $n\\ge0$. States <b>communicate</b> if each is accessible from the other. A state is <b>absorbing</b> if $P_{ii}=1$.</p><p>A state is <b>recurrent</b> if, starting there, eventual return has probability $1$; it is <b>transient</b> if there is positive probability of never returning. In a finite closed communicating class, all states are recurrent.</p><p><b>Assumptions that matter:</b> accessibility can require multiple steps; recurrence concerns eventual return, not just a self-loop; closed classes do not leak probability; and infinite chains need extra care.</p>",
  "worked": {
    "problem": "A chain has $1\\to2$ with probability $1$, $2\\to1$ with probability $0.4$, $2\\to3$ with probability $0.6$, and $3\\to3$ with probability $1$. Classify state $3$ and decide whether state $1$ is transient.",
    "skills": [
      "probability modeling",
      "calculation",
      "interpretation"
    ],
    "strategy": "Look for probability that leaves a set and cannot come back.",
    "steps": [
      {
        "do": "Inspect state 3",
        "result": "$P_{33}=1$",
        "why": "state 3 always stays itself"
      },
      {
        "do": "Classify state 3",
        "result": "absorbing",
        "why": "self-transition one defines absorption"
      },
      {
        "do": "Classify return for state 3",
        "result": "recurrent",
        "why": "it returns with probability one"
      },
      {
        "do": "Find leakage",
        "result": "state 2 can move to 3 with probability $0.6$",
        "why": "probability can leave states 1 and 2"
      },
      {
        "do": "Classify state 1",
        "result": "transient",
        "why": "there is positive probability of never returning"
      }
    ],
    "verify": "The arithmetic matches the model assumptions and gives a valid probability, distribution, or rate-based quantity.",
    "answer": "State $3$ is absorbing and recurrent; state $1$ is transient.",
    "connects": "Classification reads the directed graph of possible transitions as long-run behavior."
  },
  "practice": [
    {
      "problem": "If $P_{11}=1$, classify state 1.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "If $P_{11}=1$, classify state 1.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "absorbing and recurrent",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "absorbing and recurrent",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "absorbing and recurrent",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "absorbing and recurrent."
    },
    {
      "problem": "States 1 and 2 communicate and no transition leaves $\\{1,2\\}$. Classify them in a finite chain.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "States 1 and 2 communicate and no transition leaves $\\{1,2\\}$. Classify them in a finite chain.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to both recurrent",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "both recurrent",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "both recurrent",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "both recurrent."
    },
    {
      "problem": "Moves are $1\\to2$, $2\\to3$, and $3\\to2$. Which states communicate with 2?",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Moves are $1\\to2$, $2\\to3$, and $3\\to2$. Which states communicate with 2?",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to states 2 and 3",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "states 2 and 3",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "states 2 and 3",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "states 2 and 3."
    },
    {
      "problem": "Return times are $3,6,9,\\ldots$. Find the period.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Return times are $3,6,9,\\ldots$. Find the period.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $3$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$3$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$3$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$3$."
    },
    {
      "problem": "Browse and Purchase communicate, but Churn is absorbing and reachable. Classify Browse.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Browse and Purchase communicate, but Churn is absorbing and reachable. Classify Browse.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to transient",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "transient",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "transient",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "transient."
    }
  ],
  "applications": [
    {
      "title": "Model monitoring",
      "background": "State classification helps teams treat metrics as evolving random quantities rather than isolated numbers.",
      "numbers": "With probability $0.8$ of staying and $0.2$ of moving, $1000$ items yield about $800$ stays."
    },
    {
      "title": "Recommendation systems",
      "background": "State classification appears when user state, item exposure, or exploration changes over sessions.",
      "numbers": "A two-state recommender with mass $[0.7,0.3]$ sends $0.7\\cdot0.1=0.07$ mass into exploration from state 1."
    },
    {
      "title": "Queueing and serving systems",
      "background": "Production services use state classification ideas to reason about arrivals, failures, and waiting.",
      "numbers": "Arrival rate $6$/hour gives expected $6\\cdot0.5=3$ arrivals in half an hour."
    },
    {
      "title": "Language and sequence models",
      "background": "Sequence modeling often begins with probabilistic rules over positions before adding richer neural context.",
      "numbers": "A token transition of $0.25$ followed by $0.4$ gives path probability $0.10$."
    },
    {
      "title": "Simulation",
      "background": "Engineers simulate stochastic models to estimate quantities that are hard to solve exactly.",
      "numbers": "In $5000$ simulated paths, $425$ successes estimate probability $0.085$."
    },
    {
      "title": "Risk and reliability",
      "background": "Finance, operations, and reliability all need probabilities over future paths, not just one-step averages.",
      "numbers": "A failure probability of $0.001$ per minute gives about $1.44$ expected failures per day."
    }
  ],
  "applicationsClose": "The common thread is patient bookkeeping: define the state, write the local rule, and let probability carry the system through time.",
  "takeaways": [
    "Stochastic-process models describe random evolution over time.",
    "Local rules often determine multi-step and long-run behavior.",
    "Always check state definitions and assumptions before trusting the calculation.",
    "These tools support ML systems, queues, reliability models, and simulation."
  ]
},
"math-19-06": {
  "id": "math-19-06",
  "title": "Stationary distributions",
  "tagline": "A stationary distribution is a probability balance that looks the same after one transition.",
  "connections": {
    "buildsOn": [
      "What is a stochastic process?",
      "conditional probability",
      "linear algebra"
    ],
    "leadsTo": [
      "Stationary distributions",
      "Limiting distributions",
      "stochastic simulation"
    ],
    "usedWith": [
      "conditional probability",
      "matrix multiplication",
      "expectation",
      "linear equations"
    ]
  },
  "motivation": "<p>You already know equilibrium as a situation where change cancels out. For a Markov chain, equilibrium means the distribution is unchanged by the transition matrix.</p><p>Individual paths still move. Stationarity says the population-level flow into each state balances the flow out.</p>",
  "definition": "<p>A distribution $\\pi$ is <b>stationary</b> for transition matrix $P$ if $\\pi P=\\pi$, with $\\pi_i\\ge0$ and $\\sum_i\\pi_i=1$. In components, $\\pi_j=\\sum_i\\pi_iP_{ij}$.</p><p>This is a balance equation: tomorrow's mass at state $j$ equals all mass arriving from states $i$ today. Solving combines linear equations with normalization.</p><p><b>Assumptions that matter:</b> $\\pi$ must be a probability distribution; row-vector convention gives $\\pi P=\\pi$; stationarity is not the same as convergence; and uniqueness requires additional chain conditions.</p>",
  "worked": {
    "problem": "Find the stationary distribution for $P=\\begin{bmatrix}0.8&0.2\\0.3&0.7\\end{bmatrix}$.",
    "skills": [
      "probability modeling",
      "calculation",
      "interpretation"
    ],
    "strategy": "Let $\\pi=[a,1-a]$ and solve one balance equation plus normalization.",
    "steps": [
      {
        "do": "Let $\\pi=[a,1-a]$",
        "result": "one unknown distribution",
        "why": "normalization is built in"
      },
      {
        "do": "Write balance for state 1",
        "result": "$a=0.8a+0.3(1-a)$",
        "why": "incoming mass to state 1"
      },
      {
        "do": "Expand",
        "result": "$a=0.5a+0.3$",
        "why": "combine terms"
      },
      {
        "do": "Solve",
        "result": "$0.5a=0.3$",
        "why": "move $0.5a$ left"
      },
      {
        "do": "Finish",
        "result": "$a=0.6$, so $\\pi=[0.6,0.4]$",
        "why": "substitute into the distribution"
      }
    ],
    "verify": "The arithmetic matches the model assumptions and gives a valid probability, distribution, or rate-based quantity.",
    "answer": "$\\pi=[0.6,0.4]$.",
    "connects": "Stationarity is a probability eigenvector with eigenvalue $1$ and total mass $1$."
  },
  "practice": [
    {
      "problem": "Verify $[0.6,0.4]$ is stationary for $P=\\begin{bmatrix}0.8&0.2\\0.3&0.7\\end{bmatrix}$.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Verify $[0.6,0.4]$ is stationary for $P=\\begin{bmatrix}0.8&0.2\\0.3&0.7\\end{bmatrix}$.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "$[0.6,0.4]P=[0.6,0.4]$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$[0.6,0.4]P=[0.6,0.4]$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$[0.6,0.4]P=[0.6,0.4]$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$[0.6,0.4]P=[0.6,0.4]$."
    },
    {
      "problem": "Find stationary distribution of $\\begin{bmatrix}0.9&0.1\\0.4&0.6\\end{bmatrix}$.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Find stationary distribution of $\\begin{bmatrix}0.9&0.1\\0.4&0.6\\end{bmatrix}$.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $[0.8,0.2]$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$[0.8,0.2]$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$[0.8,0.2]$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$[0.8,0.2]$."
    },
    {
      "problem": "For $P_{12}=0.25$ and $P_{21}=0.75$, find the two-state stationary distribution.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "For $P_{12}=0.25$ and $P_{21}=0.75$, find the two-state stationary distribution.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $[0.75,0.25]$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$[0.75,0.25]$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$[0.75,0.25]$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$[0.75,0.25]$."
    },
    {
      "problem": "Normalize stationary weights $[2,3,5]$.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Normalize stationary weights $[2,3,5]$.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $[0.2,0.3,0.5]$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$[0.2,0.3,0.5]$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$[0.2,0.3,0.5]$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$[0.2,0.3,0.5]$."
    },
    {
      "problem": "Stationary Hot probability is $0.7$. In $1000$ snapshots, find expected Hot snapshots.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Stationary Hot probability is $0.7$. In $1000$ snapshots, find expected Hot snapshots.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $700$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$700$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$700$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$700$."
    }
  ],
  "applications": [
    {
      "title": "Model monitoring",
      "background": "Stationary distributions helps teams treat metrics as evolving random quantities rather than isolated numbers.",
      "numbers": "With probability $0.8$ of staying and $0.2$ of moving, $1000$ items yield about $800$ stays."
    },
    {
      "title": "Recommendation systems",
      "background": "Stationary distributions appears when user state, item exposure, or exploration changes over sessions.",
      "numbers": "A two-state recommender with mass $[0.7,0.3]$ sends $0.7\\cdot0.1=0.07$ mass into exploration from state 1."
    },
    {
      "title": "Queueing and serving systems",
      "background": "Production services use stationary distributions ideas to reason about arrivals, failures, and waiting.",
      "numbers": "Arrival rate $6$/hour gives expected $6\\cdot0.5=3$ arrivals in half an hour."
    },
    {
      "title": "Language and sequence models",
      "background": "Sequence modeling often begins with probabilistic rules over positions before adding richer neural context.",
      "numbers": "A token transition of $0.25$ followed by $0.4$ gives path probability $0.10$."
    },
    {
      "title": "Simulation",
      "background": "Engineers simulate stochastic models to estimate quantities that are hard to solve exactly.",
      "numbers": "In $5000$ simulated paths, $425$ successes estimate probability $0.085$."
    },
    {
      "title": "Risk and reliability",
      "background": "Finance, operations, and reliability all need probabilities over future paths, not just one-step averages.",
      "numbers": "A failure probability of $0.001$ per minute gives about $1.44$ expected failures per day."
    }
  ],
  "applicationsClose": "The common thread is patient bookkeeping: define the state, write the local rule, and let probability carry the system through time.",
  "takeaways": [
    "Stochastic-process models describe random evolution over time.",
    "Local rules often determine multi-step and long-run behavior.",
    "Always check state definitions and assumptions before trusting the calculation.",
    "These tools support ML systems, queues, reliability models, and simulation."
  ]
},
"math-19-07": {
  "id": "math-19-07",
  "title": "Limiting distributions",
  "tagline": "A limiting distribution is where the chain settles after many steps, when it settles at all.",
  "connections": {
    "buildsOn": [
      "What is a stochastic process?",
      "conditional probability",
      "linear algebra"
    ],
    "leadsTo": [
      "Stationary distributions",
      "Limiting distributions",
      "stochastic simulation"
    ],
    "usedWith": [
      "conditional probability",
      "matrix multiplication",
      "expectation",
      "linear equations"
    ]
  },
  "motivation": "<p>Stationarity asks what would remain unchanged. Limiting behavior asks what actually happens after many transitions from a starting state.</p><p>When a chain mixes well, different starting points fade and rows of $P^n$ approach the same distribution.</p>",
  "definition": "<p>A <b>limiting distribution</b> $\\ell$ satisfies $P(X_n=j\\mid X_0=i)\\to\\ell_j$ as $n\\to\\infty$ for every starting state $i$. Equivalently, the rows of $P^n$ converge to $\\ell$.</p><p>For a finite irreducible and aperiodic Markov chain, the limiting distribution exists and equals the unique stationary distribution. Periodicity can prevent convergence even when stationary balance exists.</p><p><b>Assumptions that matter:</b> irreducibility keeps one communicating class; aperiodicity avoids deterministic cycling; finite chains have cleaner guarantees; and convergence rate is a separate question.</p>",
  "worked": {
    "problem": "For $P=\\begin{bmatrix}0.8&0.2\\0.3&0.7\\end{bmatrix}$, state the limiting distribution, assuming the chain is irreducible and aperiodic.",
    "skills": [
      "probability modeling",
      "calculation",
      "interpretation"
    ],
    "strategy": "Use the stationary distribution once the convergence conditions are named.",
    "steps": [
      {
        "do": "Recall stationarity",
        "result": "$\\pi=[0.6,0.4]$",
        "why": "solve $\\pi P=\\pi$"
      },
      {
        "do": "Check communication",
        "result": "both off-diagonal entries are positive",
        "why": "states can reach each other"
      },
      {
        "do": "Check aperiodicity",
        "result": "self-loops are positive",
        "why": "self-loops break cycling"
      },
      {
        "do": "Apply theorem",
        "result": "rows of $P^n$ converge to $\\pi$",
        "why": "finite irreducible aperiodic chain"
      },
      {
        "do": "State limit",
        "result": "$[0.6,0.4]$",
        "why": "initial state is forgotten"
      }
    ],
    "verify": "The arithmetic matches the model assumptions and gives a valid probability, distribution, or rate-based quantity.",
    "answer": "The limiting distribution is $[0.6,0.4]$.",
    "connects": "Limiting distributions connect long-run simulation behavior to stationary balance."
  },
  "practice": [
    {
      "problem": "For alternating matrix $\\begin{bmatrix}0&1\\1&0\\end{bmatrix}$, decide whether $P^n$ converges.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "For alternating matrix $\\begin{bmatrix}0&1\\1&0\\end{bmatrix}$, decide whether $P^n$ converges.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "no convergence",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "no convergence",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "no convergence",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "no convergence."
    },
    {
      "problem": "If the limiting distribution is $[0.2,0.5,0.3]$, find the limiting probability of state 2.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "If the limiting distribution is $[0.2,0.5,0.3]$, find the limiting probability of state 2.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $0.5$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$0.5$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$0.5$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$0.5$."
    },
    {
      "problem": "Starting from $[1,0]$ with $P=\\begin{bmatrix}0.8&0.2\\0.3&0.7\\end{bmatrix}$, compute $\\mu_1$.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Starting from $[1,0]$ with $P=\\begin{bmatrix}0.8&0.2\\0.3&0.7\\end{bmatrix}$, compute $\\mu_1$.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $[0.8,0.2]$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$[0.8,0.2]$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$[0.8,0.2]$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$[0.8,0.2]$."
    },
    {
      "problem": "For $P=\\begin{bmatrix}1&0\\0.4&0.6\\end{bmatrix}$ starting from state 2, find the limiting distribution.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "For $P=\\begin{bmatrix}1&0\\0.4&0.6\\end{bmatrix}$ starting from state 2, find the limiting distribution.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $[1,0]$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$[1,0]$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$[1,0]$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$[1,0]$."
    },
    {
      "problem": "Long-run degraded probability is $0.03$. In $10000$ checks, estimate degraded checks.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Long-run degraded probability is $0.03$. In $10000$ checks, estimate degraded checks.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $300$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$300$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$300$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$300$."
    }
  ],
  "applications": [
    {
      "title": "Model monitoring",
      "background": "Limiting distributions helps teams treat metrics as evolving random quantities rather than isolated numbers.",
      "numbers": "With probability $0.8$ of staying and $0.2$ of moving, $1000$ items yield about $800$ stays."
    },
    {
      "title": "Recommendation systems",
      "background": "Limiting distributions appears when user state, item exposure, or exploration changes over sessions.",
      "numbers": "A two-state recommender with mass $[0.7,0.3]$ sends $0.7\\cdot0.1=0.07$ mass into exploration from state 1."
    },
    {
      "title": "Queueing and serving systems",
      "background": "Production services use limiting distributions ideas to reason about arrivals, failures, and waiting.",
      "numbers": "Arrival rate $6$/hour gives expected $6\\cdot0.5=3$ arrivals in half an hour."
    },
    {
      "title": "Language and sequence models",
      "background": "Sequence modeling often begins with probabilistic rules over positions before adding richer neural context.",
      "numbers": "A token transition of $0.25$ followed by $0.4$ gives path probability $0.10$."
    },
    {
      "title": "Simulation",
      "background": "Engineers simulate stochastic models to estimate quantities that are hard to solve exactly.",
      "numbers": "In $5000$ simulated paths, $425$ successes estimate probability $0.085$."
    },
    {
      "title": "Risk and reliability",
      "background": "Finance, operations, and reliability all need probabilities over future paths, not just one-step averages.",
      "numbers": "A failure probability of $0.001$ per minute gives about $1.44$ expected failures per day."
    }
  ],
  "applicationsClose": "The common thread is patient bookkeeping: define the state, write the local rule, and let probability carry the system through time.",
  "takeaways": [
    "Stochastic-process models describe random evolution over time.",
    "Local rules often determine multi-step and long-run behavior.",
    "Always check state definitions and assumptions before trusting the calculation.",
    "These tools support ML systems, queues, reliability models, and simulation."
  ]
},
"math-19-08": {
  "id": "math-19-08",
  "title": "Reversibility and detailed balance",
  "tagline": "Reversibility means the chain's movie looks statistically the same when played backward.",
  "connections": {
    "buildsOn": [
      "What is a stochastic process?",
      "conditional probability",
      "linear algebra"
    ],
    "leadsTo": [
      "Stationary distributions",
      "Limiting distributions",
      "stochastic simulation"
    ],
    "usedWith": [
      "conditional probability",
      "matrix multiplication",
      "expectation",
      "linear equations"
    ]
  },
  "motivation": "<p>Some chains have a special equilibrium symmetry: at stationarity, flow from $i$ to $j$ is exactly balanced by flow from $j$ to $i$.</p><p>This detailed balance condition is stronger than stationarity and often easier to check. It is central in Markov chain Monte Carlo.</p>",
  "definition": "<p>A chain with stationary distribution $\\pi$ is <b>reversible</b> if it satisfies <b>detailed balance</b>: $\\pi_iP_{ij}=\\pi_jP_{ji}$ for all states $i,j$.</p><p>The quantity $\\pi_iP_{ij}$ is equilibrium probability flow from $i$ to $j$. If every pairwise flow balances its reverse, then total inflow equals total outflow at every state, so $\\pi$ is stationary.</p><p><b>Assumptions that matter:</b> detailed balance is sufficient but not necessary for stationarity; zero-probability states need care; and reversibility is a property of both $P$ and $\\pi$ together.</p>",
  "worked": {
    "problem": "Check detailed balance for $P=\\begin{bmatrix}0.8&0.2\\0.3&0.7\\end{bmatrix}$ with $\\pi=[0.6,0.4]$.",
    "skills": [
      "probability modeling",
      "calculation",
      "interpretation"
    ],
    "strategy": "In a two-state chain, checking the cross-flow is enough.",
    "steps": [
      {
        "do": "Compute flow $1\\to2$",
        "result": "$0.6\\cdot0.2=0.12$",
        "why": "equilibrium mass times transition"
      },
      {
        "do": "Compute flow $2\\to1$",
        "result": "$0.4\\cdot0.3=0.12$",
        "why": "reverse equilibrium flow"
      },
      {
        "do": "Compare",
        "result": "$0.12=0.12$",
        "why": "cross-flows match"
      },
      {
        "do": "Note self-flows",
        "result": "automatic equality",
        "why": "each self-flow equals itself"
      },
      {
        "do": "Conclude",
        "result": "reversible",
        "why": "detailed balance holds"
      }
    ],
    "verify": "The arithmetic matches the model assumptions and gives a valid probability, distribution, or rate-based quantity.",
    "answer": "The chain is reversible because $0.6\\cdot0.2=0.4\\cdot0.3=0.12$.",
    "connects": "Reversibility turns global stationarity into local pairwise flow balance."
  },
  "practice": [
    {
      "problem": "For $P=\\begin{bmatrix}0.9&0.1\\0.2&0.8\\end{bmatrix}$, find reversible $\\pi$.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "For $P=\\begin{bmatrix}0.9&0.1\\0.2&0.8\\end{bmatrix}$, find reversible $\\pi$.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "$[2/3,1/3]$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$[2/3,1/3]$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$[2/3,1/3]$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$[2/3,1/3]$."
    },
    {
      "problem": "Check detailed balance for $\\pi=[0.5,0.5]$ and cross probabilities $0.5$ and $0.1$.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Check detailed balance for $\\pi=[0.5,0.5]$ and cross probabilities $0.5$ and $0.1$.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to fails",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "fails",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "fails",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "fails."
    },
    {
      "problem": "Uniform random walk on a triangle: find edge flow under uniform $\\pi$.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Uniform random walk on a triangle",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $1/6$ each way",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$1/6$ each way",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$1/6$ each way",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$1/6$ each way."
    },
    {
      "problem": "Target weights $[1,3]$ with switch proposal: down acceptance $1/3$. Check flow.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Target weights $[1,3]$ with switch proposal",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $1/4$ each way",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$1/4$ each way",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$1/4$ each way",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$1/4$ each way."
    },
    {
      "problem": "If $\\pi=[0.2,0.3,0.5]$ and $P_{12}=0.4$, find $P_{21}$ for detailed balance.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "If $\\pi=[0.2,0.3,0.5]$ and $P_{12}=0.4$, find $P_{21}$ for detailed balance.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $0.2667$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$0.2667$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$0.2667$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$0.2667$."
    }
  ],
  "applications": [
    {
      "title": "Model monitoring",
      "background": "Reversibility and detailed balance helps teams treat metrics as evolving random quantities rather than isolated numbers.",
      "numbers": "With probability $0.8$ of staying and $0.2$ of moving, $1000$ items yield about $800$ stays."
    },
    {
      "title": "Recommendation systems",
      "background": "Reversibility and detailed balance appears when user state, item exposure, or exploration changes over sessions.",
      "numbers": "A two-state recommender with mass $[0.7,0.3]$ sends $0.7\\cdot0.1=0.07$ mass into exploration from state 1."
    },
    {
      "title": "Queueing and serving systems",
      "background": "Production services use reversibility and detailed balance ideas to reason about arrivals, failures, and waiting.",
      "numbers": "Arrival rate $6$/hour gives expected $6\\cdot0.5=3$ arrivals in half an hour."
    },
    {
      "title": "Language and sequence models",
      "background": "Sequence modeling often begins with probabilistic rules over positions before adding richer neural context.",
      "numbers": "A token transition of $0.25$ followed by $0.4$ gives path probability $0.10$."
    },
    {
      "title": "Simulation",
      "background": "Engineers simulate stochastic models to estimate quantities that are hard to solve exactly.",
      "numbers": "In $5000$ simulated paths, $425$ successes estimate probability $0.085$."
    },
    {
      "title": "Risk and reliability",
      "background": "Finance, operations, and reliability all need probabilities over future paths, not just one-step averages.",
      "numbers": "A failure probability of $0.001$ per minute gives about $1.44$ expected failures per day."
    }
  ],
  "applicationsClose": "The common thread is patient bookkeeping: define the state, write the local rule, and let probability carry the system through time.",
  "takeaways": [
    "Stochastic-process models describe random evolution over time.",
    "Local rules often determine multi-step and long-run behavior.",
    "Always check state definitions and assumptions before trusting the calculation.",
    "These tools support ML systems, queues, reliability models, and simulation."
  ]
},
"math-19-09": {
  "id": "math-19-09",
  "title": "Continuous-time Markov chains",
  "tagline": "A continuous-time Markov chain waits a random time, then jumps according to rates.",
  "connections": {
    "buildsOn": [
      "Continuous-time Markov chains",
      "exponential functions",
      "rates"
    ],
    "leadsTo": [
      "queueing theory",
      "stochastic simulation",
      "random walks"
    ],
    "usedWith": [
      "conditional probability",
      "matrix multiplication",
      "expectation",
      "linear equations"
    ]
  },
  "motivation": "<p>Discrete chains move on ticks. Many systems do not wait for ticks: failures, arrivals, repairs, and messages can happen at any time.</p><p>A continuous-time Markov chain keeps the Markov idea but replaces per-step probabilities with rates per unit time.</p>",
  "definition": "<p>A <b>continuous-time Markov chain</b> has states $X(t)$ for $t\\ge0$ and a generator matrix $Q$. For $i\\ne j$, $q_{ij}\\ge0$ is the jump rate from $i$ to $j$, and $q_{ii}=-\\sum_{j\\ne i}q_{ij}$.</p><p>For small $h$, $P(X(t+h)=j\\mid X(t)=i)\\u0007pprox q_{ij}h$. The holding time in state $i$ is exponential with rate $\\lambda_i=-q_{ii}$, and the next state is $j$ with probability $q_{ij}/\\lambda_i$.</p><p><b>Assumptions that matter:</b> rates have time units; rows of $Q$ sum to $0$; exponential holding times are memoryless; and transition probabilities over time come from $P(t)=e^{tQ}$.</p>",
  "worked": {
    "problem": "A server fails from Up to Down at rate $0.02$ per hour and recovers from Down to Up at rate $0.5$ per hour. Find the mean up-time and the one-hour failure probability.",
    "skills": [
      "probability modeling",
      "calculation",
      "interpretation"
    ],
    "strategy": "Use exponential holding time for the Up state.",
    "steps": [
      {
        "do": "Read failure rate",
        "result": "$0.02$ per hour",
        "why": "leaving Up means failure"
      },
      {
        "do": "Compute mean up-time",
        "result": "$1/0.02=50$ hours",
        "why": "exponential mean is reciprocal rate"
      },
      {
        "do": "Write failure probability",
        "result": "$1-e^{-0.02\\cdot1}$",
        "why": "exponential waiting time CDF"
      },
      {
        "do": "Approximate",
        "result": "$1-e^{-0.02}\\u0007pprox0.0198$",
        "why": "calculator value"
      },
      {
        "do": "Compare small-time estimate",
        "result": "$0.02$",
        "why": "rate times one hour is close"
      }
    ],
    "verify": "The arithmetic matches the model assumptions and gives a valid probability, distribution, or rate-based quantity.",
    "answer": "Mean up-time is $50$ hours; one-hour failure probability is $1-e^{-0.02}\\u0007pprox0.0198$.",
    "connects": "Continuous time changes one-step probabilities into rates per unit time."
  },
  "practice": [
    {
      "problem": "Outgoing rates $2$ and $3$: find total rate, mean hold, and probability of second jump.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Outgoing rates $2$ and $3$",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "rate $5$, mean $1/5$, probability $3/5$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "rate $5$, mean $1/5$, probability $3/5$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "rate $5$, mean $1/5$, probability $3/5$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "rate $5$, mean $1/5$, probability $3/5$."
    },
    {
      "problem": "Write generator for rates $4$ from 1 to 2 and $6$ from 2 to 1.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Write generator for rates $4$ from 1 to 2 and $6$ from 2 to 1.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $\\begin{bmatrix}-4&4\\6&-6\\end{bmatrix}$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$\\begin{bmatrix}-4&4\\6&-6\\end{bmatrix}$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$\\begin{bmatrix}-4&4\\6&-6\\end{bmatrix}$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$\\begin{bmatrix}-4&4\\6&-6\\end{bmatrix}$."
    },
    {
      "problem": "Total rate $0.5$: find probability of no jump in $3$ hours.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Total rate $0.5$",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $e^{-1.5}\\u0007pprox0.223$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$e^{-1.5}\\u0007pprox0.223$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$e^{-1.5}\\u0007pprox0.223$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$e^{-1.5}\\u0007pprox0.223$."
    },
    {
      "problem": "Failure rate $0.01$ and repair rate $0.09$: find availability.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Failure rate $0.01$ and repair rate $0.09$",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $0.9$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$0.9$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$0.9$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$0.9$."
    },
    {
      "problem": "Idle-to-busy rate $12$ and busy-to-idle rate $18$: find busy fraction.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Idle-to-busy rate $12$ and busy-to-idle rate $18$",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $0.4$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$0.4$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$0.4$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$0.4$."
    }
  ],
  "applications": [
    {
      "title": "Model monitoring",
      "background": "Continuous-time Markov chains helps teams treat metrics as evolving random quantities rather than isolated numbers.",
      "numbers": "With probability $0.8$ of staying and $0.2$ of moving, $1000$ items yield about $800$ stays."
    },
    {
      "title": "Recommendation systems",
      "background": "Continuous-time Markov chains appears when user state, item exposure, or exploration changes over sessions.",
      "numbers": "A two-state recommender with mass $[0.7,0.3]$ sends $0.7\\cdot0.1=0.07$ mass into exploration from state 1."
    },
    {
      "title": "Queueing and serving systems",
      "background": "Production services use continuous-time markov chains ideas to reason about arrivals, failures, and waiting.",
      "numbers": "Arrival rate $6$/hour gives expected $6\\cdot0.5=3$ arrivals in half an hour."
    },
    {
      "title": "Language and sequence models",
      "background": "Sequence modeling often begins with probabilistic rules over positions before adding richer neural context.",
      "numbers": "A token transition of $0.25$ followed by $0.4$ gives path probability $0.10$."
    },
    {
      "title": "Simulation",
      "background": "Engineers simulate stochastic models to estimate quantities that are hard to solve exactly.",
      "numbers": "In $5000$ simulated paths, $425$ successes estimate probability $0.085$."
    },
    {
      "title": "Risk and reliability",
      "background": "Finance, operations, and reliability all need probabilities over future paths, not just one-step averages.",
      "numbers": "A failure probability of $0.001$ per minute gives about $1.44$ expected failures per day."
    }
  ],
  "applicationsClose": "The common thread is patient bookkeeping: define the state, write the local rule, and let probability carry the system through time.",
  "takeaways": [
    "Stochastic-process models describe random evolution over time.",
    "Local rules often determine multi-step and long-run behavior.",
    "Always check state definitions and assumptions before trusting the calculation.",
    "These tools support ML systems, queues, reliability models, and simulation."
  ]
},
"math-19-10": {
  "id": "math-19-10",
  "title": "Poisson processes",
  "tagline": "A Poisson process counts random arrivals that happen independently at a constant average rate.",
  "connections": {
    "buildsOn": [
      "Continuous-time Markov chains",
      "exponential functions",
      "rates"
    ],
    "leadsTo": [
      "queueing theory",
      "stochastic simulation",
      "random walks"
    ],
    "usedWith": [
      "conditional probability",
      "matrix multiplication",
      "expectation",
      "linear equations"
    ]
  },
  "motivation": "<p>You have seen counts per time window: calls per hour, requests per second, errors per day. A Poisson process is the clean baseline for arrivals scattered randomly through time.</p><p>The count view and waiting-time view fit together: Poisson counts over intervals and exponential waiting times between arrivals.</p>",
  "definition": "<p>A <b>Poisson process</b> $N(t)$ with rate $\\lambda>0$ has $N(0)=0$, independent increments, stationary increments, and $P(N(t)=k)=e^{-\\lambda t}(\\lambda t)^k/k!$.</p><p>The mean and variance of $N(t)$ are both $\\lambda t$. Also, $P(T_1>t)=P(N(t)=0)=e^{-\\lambda t}$, so the first waiting time is exponential.</p><p><b>Assumptions that matter:</b> the rate is constant; disjoint intervals are independent; simultaneous arrivals have negligible probability; and clustered real systems may need richer models.</p>",
  "worked": {
    "problem": "Calls arrive at rate $\\lambda=3$ per hour. Find $P(N(2)=4)$.",
    "skills": [
      "probability modeling",
      "calculation",
      "interpretation"
    ],
    "strategy": "Use the Poisson count formula with mean $\\lambda t=6$.",
    "steps": [
      {
        "do": "Compute mean",
        "result": "$\\lambda t=3\\cdot2=6$",
        "why": "rate times time"
      },
      {
        "do": "Write formula",
        "result": "$P(N(2)=4)=e^{-6}6^4/4!$",
        "why": "Poisson count probability"
      },
      {
        "do": "Compute power and factorial",
        "result": "$6^4=1296$ and $4!=24$",
        "why": "prepare arithmetic"
      },
      {
        "do": "Divide",
        "result": "$1296/24=54$",
        "why": "simplify coefficient"
      },
      {
        "do": "Approximate",
        "result": "$54e^{-6}\\u0007pprox0.134$",
        "why": "calculator value"
      }
    ],
    "verify": "The arithmetic matches the model assumptions and gives a valid probability, distribution, or rate-based quantity.",
    "answer": "$P(N(2)=4)=e^{-6}6^4/4!\\u0007pprox0.134$.",
    "connects": "The Poisson process turns a rate and interval length into a full count distribution."
  },
  "practice": [
    {
      "problem": "Rate $5$ per minute: find $P(N(1)=0)$.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Rate $5$ per minute",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "$e^{-5}\\u0007pprox0.0067$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$e^{-5}\\u0007pprox0.0067$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$e^{-5}\\u0007pprox0.0067$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$e^{-5}\\u0007pprox0.0067$."
    },
    {
      "problem": "Rate $2$ per hour: find $P(N(3)=2)$.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Rate $2$ per hour",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $18e^{-6}\\u0007pprox0.0446$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$18e^{-6}\\u0007pprox0.0446$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$18e^{-6}\\u0007pprox0.0446$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$18e^{-6}\\u0007pprox0.0446$."
    },
    {
      "problem": "Rate $4$ per hour: find $P(T_1>0.5)$.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Rate $4$ per hour",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $e^{-2}\\u0007pprox0.135$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$e^{-2}\\u0007pprox0.135$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$e^{-2}\\u0007pprox0.135$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$e^{-2}\\u0007pprox0.135$."
    },
    {
      "problem": "Rate $10$ per second: find mean and variance of $N(0.2)$.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Rate $10$ per second",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to mean $2$, variance $2$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "mean $2$, variance $2$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "mean $2$, variance $2$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "mean $2$, variance $2$."
    },
    {
      "problem": "Rate $120$ per minute: find $P(N(0.01)\\ge1)$.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Rate $120$ per minute",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $1-e^{-1.2}\\u0007pprox0.699$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$1-e^{-1.2}\\u0007pprox0.699$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$1-e^{-1.2}\\u0007pprox0.699$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$1-e^{-1.2}\\u0007pprox0.699$."
    }
  ],
  "applications": [
    {
      "title": "Model monitoring",
      "background": "Poisson processes helps teams treat metrics as evolving random quantities rather than isolated numbers.",
      "numbers": "With probability $0.8$ of staying and $0.2$ of moving, $1000$ items yield about $800$ stays."
    },
    {
      "title": "Recommendation systems",
      "background": "Poisson processes appears when user state, item exposure, or exploration changes over sessions.",
      "numbers": "A two-state recommender with mass $[0.7,0.3]$ sends $0.7\\cdot0.1=0.07$ mass into exploration from state 1."
    },
    {
      "title": "Queueing and serving systems",
      "background": "Production services use poisson processes ideas to reason about arrivals, failures, and waiting.",
      "numbers": "Arrival rate $6$/hour gives expected $6\\cdot0.5=3$ arrivals in half an hour."
    },
    {
      "title": "Language and sequence models",
      "background": "Sequence modeling often begins with probabilistic rules over positions before adding richer neural context.",
      "numbers": "A token transition of $0.25$ followed by $0.4$ gives path probability $0.10$."
    },
    {
      "title": "Simulation",
      "background": "Engineers simulate stochastic models to estimate quantities that are hard to solve exactly.",
      "numbers": "In $5000$ simulated paths, $425$ successes estimate probability $0.085$."
    },
    {
      "title": "Risk and reliability",
      "background": "Finance, operations, and reliability all need probabilities over future paths, not just one-step averages.",
      "numbers": "A failure probability of $0.001$ per minute gives about $1.44$ expected failures per day."
    }
  ],
  "applicationsClose": "The common thread is patient bookkeeping: define the state, write the local rule, and let probability carry the system through time.",
  "takeaways": [
    "Stochastic-process models describe random evolution over time.",
    "Local rules often determine multi-step and long-run behavior.",
    "Always check state definitions and assumptions before trusting the calculation.",
    "These tools support ML systems, queues, reliability models, and simulation."
  ]
},
"math-19-11": {
  "id": "math-19-11",
  "title": "Birth–death processes",
  "tagline": "Birth-death processes move one level up or down, one neighboring jump at a time.",
  "connections": {
    "buildsOn": [
      "Continuous-time Markov chains",
      "exponential functions",
      "rates"
    ],
    "leadsTo": [
      "queueing theory",
      "stochastic simulation",
      "random walks"
    ],
    "usedWith": [
      "conditional probability",
      "matrix multiplication",
      "expectation",
      "linear equations"
    ]
  },
  "motivation": "<p>Many systems are counts: jobs in a queue, molecules in a reaction, users in a state. Often the count changes by one at a time.</p><p>A birth-death process captures this with upward birth rates and downward death rates. Neighbor-only movement makes the model simple and useful.</p>",
  "definition": "<p>A <b>birth-death process</b> is a continuous-time Markov chain on $0,1,2,\\ldots$ with transitions $n\\to n+1$ at rate $\\lambda_n$ and $n\\to n-1$ at rate $\\mu_n$ for $n\\ge1$.</p><p>At state $n$, the holding time is exponential with rate $\\lambda_n+\\mu_n$, and the next jump is upward with probability $\\lambda_n/(\\lambda_n+\\mu_n)$. State $0$ has no downward jump.</p><p><b>Assumptions that matter:</b> jumps change the count by one; rates may depend on $n$; boundaries matter; and stable long-run behavior usually requires enough downward pressure.</p>",
  "worked": {
    "problem": "In an $M/M/1$ queue, arrivals have rate $2$ per minute and service has rate $5$ per minute. At state $3$, find the mean holding time and probability the next jump is an arrival.",
    "skills": [
      "probability modeling",
      "calculation",
      "interpretation"
    ],
    "strategy": "Combine arrival and service rates because either event can happen next.",
    "steps": [
      {
        "do": "Add rates",
        "result": "$2+5=7$ per minute",
        "why": "arrival or service may occur"
      },
      {
        "do": "Compute mean hold",
        "result": "$1/7$ minute",
        "why": "exponential mean is reciprocal total rate"
      },
      {
        "do": "Write arrival probability",
        "result": "$2/(2+5)$",
        "why": "arrival rate over total rate"
      },
      {
        "do": "Simplify",
        "result": "$2/7$",
        "why": "exact probability"
      },
      {
        "do": "Approximate",
        "result": "$0.286$",
        "why": "about 28.6 percent"
      }
    ],
    "verify": "The arithmetic matches the model assumptions and gives a valid probability, distribution, or rate-based quantity.",
    "answer": "The mean holding time is $1/7$ minute, and the arrival probability is $2/7$.",
    "connects": "Birth-death models make count dynamics local: only one step up or down at each jump."
  },
  "practice": [
    {
      "problem": "At state $0$ with arrival rate $3$, what is mean holding time?",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "At state $0$ with arrival rate $3$, what is mean holding time?",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "$1/3$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$1/3$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$1/3$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$1/3$."
    },
    {
      "problem": "At state $5$, birth rate $4$ and death rate $6$: probability next jump is downward.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "At state $5$, birth rate $4$ and death rate $6$",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $0.6$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$0.6$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$0.6$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$0.6$."
    },
    {
      "problem": "For $M/M/1$ with $\\lambda=2$, $\\mu=5$, find $\\rho$ and $\\pi_0$.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "For $M/M/1$ with $\\lambda=2$, $\\mu=5$, find $\\rho$ and $\\pi_0$.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $\\rho=0.4$, $\\pi_0=0.6$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$\\rho=0.4$, $\\pi_0=0.6$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$\\rho=0.4$, $\\pi_0=0.6$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$\\rho=0.4$, $\\pi_0=0.6$."
    },
    {
      "problem": "With $\\rho=0.4$, find $\\pi_3$ for an $M/M/1$ queue.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "With $\\rho=0.4$, find $\\pi_3$ for an $M/M/1$ queue.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $0.0384$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$0.0384$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$0.0384$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$0.0384$."
    },
    {
      "problem": "GPU queue has arrivals $8$/hour and service $10$/hour. Estimate empty probability.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "GPU queue has arrivals $8$/hour and service $10$/hour. Estimate empty probability.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $0.2$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$0.2$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$0.2$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$0.2$."
    }
  ],
  "applications": [
    {
      "title": "Model monitoring",
      "background": "Birth-death processes helps teams treat metrics as evolving random quantities rather than isolated numbers.",
      "numbers": "With probability $0.8$ of staying and $0.2$ of moving, $1000$ items yield about $800$ stays."
    },
    {
      "title": "Recommendation systems",
      "background": "Birth-death processes appears when user state, item exposure, or exploration changes over sessions.",
      "numbers": "A two-state recommender with mass $[0.7,0.3]$ sends $0.7\\cdot0.1=0.07$ mass into exploration from state 1."
    },
    {
      "title": "Queueing and serving systems",
      "background": "Production services use birth-death processes ideas to reason about arrivals, failures, and waiting.",
      "numbers": "Arrival rate $6$/hour gives expected $6\\cdot0.5=3$ arrivals in half an hour."
    },
    {
      "title": "Language and sequence models",
      "background": "Sequence modeling often begins with probabilistic rules over positions before adding richer neural context.",
      "numbers": "A token transition of $0.25$ followed by $0.4$ gives path probability $0.10$."
    },
    {
      "title": "Simulation",
      "background": "Engineers simulate stochastic models to estimate quantities that are hard to solve exactly.",
      "numbers": "In $5000$ simulated paths, $425$ successes estimate probability $0.085$."
    },
    {
      "title": "Risk and reliability",
      "background": "Finance, operations, and reliability all need probabilities over future paths, not just one-step averages.",
      "numbers": "A failure probability of $0.001$ per minute gives about $1.44$ expected failures per day."
    }
  ],
  "applicationsClose": "The common thread is patient bookkeeping: define the state, write the local rule, and let probability carry the system through time.",
  "takeaways": [
    "Stochastic-process models describe random evolution over time.",
    "Local rules often determine multi-step and long-run behavior.",
    "Always check state definitions and assumptions before trusting the calculation.",
    "These tools support ML systems, queues, reliability models, and simulation."
  ]
},
"math-19-12": {
  "id": "math-19-12",
  "title": "Random walks",
  "tagline": "A random walk is what happens when small random steps accumulate into a path.",
  "connections": {
    "buildsOn": [
      "What is a stochastic process?",
      "conditional probability",
      "linear algebra"
    ],
    "leadsTo": [
      "queueing theory",
      "stochastic simulation",
      "random walks"
    ],
    "usedWith": [
      "conditional probability",
      "matrix multiplication",
      "expectation",
      "linear equations"
    ]
  },
  "motivation": "<p>You already understand a game where heads steps right and tails steps left. A random walk asks what the accumulated position looks like after many such steps.</p><p>This humble model sits behind diffusion, graph exploration, optimization noise, and Brownian-motion limits.</p>",
  "definition": "<p>A <b>random walk</b> is a process $S_n=S_0+Y_1+\\cdots+Y_n$, where $Y_k$ are random increments. In the simple symmetric walk, $Y_k=1$ with probability $1/2$ and $Y_k=-1$ with probability $1/2$.</p><p>Linearity gives $E[S_n]=S_0+nE[Y_1]$. If independent increments have variance $\\sigma^2$, then $\\operatorname{Var}(S_n)=n\\sigma^2$, so standard deviation grows like $\\sqrt n$.</p><p><b>Assumptions that matter:</b> increments are often independent and identically distributed; drift is $E[Y_k]$; boundaries can change behavior; and a finite-state random walk is a Markov chain when position is the state.</p>",
  "worked": {
    "problem": "A biased walk starts at $S_0=0$ and steps $+1$ with probability $0.6$ or $-1$ with probability $0.4$. Find $E[S_{10}]$.",
    "skills": [
      "probability modeling",
      "calculation",
      "interpretation"
    ],
    "strategy": "Compute the mean step, then add it over ten increments.",
    "steps": [
      {
        "do": "Compute mean step",
        "result": "$1\\cdot0.6+(-1)\\cdot0.4$",
        "why": "weight each step"
      },
      {
        "do": "Simplify",
        "result": "$0.2$",
        "why": "subtract $0.4$ from $0.6$"
      },
      {
        "do": "Use linearity",
        "result": "$E[S_{10}]=0+10(0.2)$",
        "why": "sum ten increments"
      },
      {
        "do": "Multiply",
        "result": "$2$",
        "why": "compute expected drift"
      },
      {
        "do": "Interpret",
        "result": "two units to the right",
        "why": "positive step bias accumulates"
      }
    ],
    "verify": "The arithmetic matches the model assumptions and gives a valid probability, distribution, or rate-based quantity.",
    "answer": "$E[S_{10}]=2$.",
    "connects": "A random walk converts local step bias into accumulated drift."
  },
  "practice": [
    {
      "problem": "Symmetric walk from $0$: find $E[S_8]$ and $\\operatorname{Var}(S_8)$.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Symmetric walk from $0$",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "mean $0$, variance $8$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "mean $0$, variance $8$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "mean $0$, variance $8$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "mean $0$, variance $8$."
    },
    {
      "problem": "Biased walk has $p=0.7$ for $+1$, starts at $5$. Find $E[S_{20}]$.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Biased walk has $p=0.7$ for $+1$, starts at $5$. Find $E[S_{20}]$.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $13$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$13$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$13$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$13$."
    },
    {
      "problem": "Steps are $+2$ or $-1$ equally likely. Find $E[S_4]$ from zero.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Steps are $+2$ or $-1$ equally likely. Find $E[S_4]$ from zero.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $2$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$2$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$2$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$2$."
    },
    {
      "problem": "Symmetric walk: find $P(S_4=0)$.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Symmetric walk",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $3/8$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$3/8$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$3/8$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$3/8$."
    },
    {
      "problem": "Gradient noise variance per step is $0.04$. Find accumulated standard deviation after $100$ steps.",
      "steps": [
        {
          "do": "Identify the relevant rule",
          "result": "Gradient noise variance per step is $0.04$. Find accumulated standard deviation after $100$ steps.",
          "why": "translate the words into the lesson concept"
        },
        {
          "do": "Write the calculation",
          "result": "calculation leading to $2$",
          "why": "set up the required probability or rate"
        },
        {
          "do": "Compute the main quantity",
          "result": "$2$",
          "why": "perform the arithmetic"
        },
        {
          "do": "Check validity",
          "result": "valid result",
          "why": "probabilities lie in range or rates have correct units"
        },
        {
          "do": "Interpret the answer",
          "result": "$2$",
          "why": "connect the number back to the process"
        }
      ],
      "answer": "$2$."
    }
  ],
  "applications": [
    {
      "title": "Model monitoring",
      "background": "Random walks helps teams treat metrics as evolving random quantities rather than isolated numbers.",
      "numbers": "With probability $0.8$ of staying and $0.2$ of moving, $1000$ items yield about $800$ stays."
    },
    {
      "title": "Recommendation systems",
      "background": "Random walks appears when user state, item exposure, or exploration changes over sessions.",
      "numbers": "A two-state recommender with mass $[0.7,0.3]$ sends $0.7\\cdot0.1=0.07$ mass into exploration from state 1."
    },
    {
      "title": "Queueing and serving systems",
      "background": "Production services use random walks ideas to reason about arrivals, failures, and waiting.",
      "numbers": "Arrival rate $6$/hour gives expected $6\\cdot0.5=3$ arrivals in half an hour."
    },
    {
      "title": "Language and sequence models",
      "background": "Sequence modeling often begins with probabilistic rules over positions before adding richer neural context.",
      "numbers": "A token transition of $0.25$ followed by $0.4$ gives path probability $0.10$."
    },
    {
      "title": "Simulation",
      "background": "Engineers simulate stochastic models to estimate quantities that are hard to solve exactly.",
      "numbers": "In $5000$ simulated paths, $425$ successes estimate probability $0.085$."
    },
    {
      "title": "Risk and reliability",
      "background": "Finance, operations, and reliability all need probabilities over future paths, not just one-step averages.",
      "numbers": "A failure probability of $0.001$ per minute gives about $1.44$ expected failures per day."
    }
  ],
  "applicationsClose": "The common thread is patient bookkeeping: define the state, write the local rule, and let probability carry the system through time.",
  "takeaways": [
    "Stochastic-process models describe random evolution over time.",
    "Local rules often determine multi-step and long-run behavior.",
    "Always check state definitions and assumptions before trusting the calculation.",
    "These tools support ML systems, queues, reliability models, and simulation."
  ]
}
};
