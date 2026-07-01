module.exports = {
  "math-19-13": {
    "id": "math-19-13",
    "title": "Brownian motion",
    "tagline": "Brownian motion is the continuous-time limit of tiny fair random steps, and its variance grows like time.",
    "connections": {
      "buildsOn": [
        "Random walks",
        "normal distributions",
        "variance"
      ],
      "leadsTo": [
        "Gaussian processes",
        "Itô's lemma",
        "diffusion processes"
      ],
      "usedWith": [
        "independent increments",
        "conditional distributions",
        "continuous paths",
        "variance scaling"
      ]
    },
    "motivation": "<p>You already know a random walk: move left or right by one step after each coin flip. If the steps get smaller and the clock ticks faster, the jagged path begins to look like a restless continuous curve.</p><p><b>Brownian motion</b> is that idealized curve. It is random at every time, but not lawless: increments over disjoint time intervals are independent, normally distributed, and have variance equal to elapsed time.</p>",
    "definition": "<p>A standard Brownian motion $W_t$ is a stochastic process with $W_0=0$, continuous sample paths, independent increments, and $W_t-W_s\\sim N(0,t-s)$ for $0\\le s<t$. Here $t$ is time, $W_t$ is the random position at time $t$, and $N(0,t-s)$ is a normal distribution with mean $0$ and variance $t-s$.</p><p>The variance rule comes from scaling a fair random walk. After $n$ independent steps of size $1/\\sqrt n$ in one unit of time, the variance is $n\\cdot(1/n)=1$. Over $t$ units, the variance becomes $t$, which is why $W_t\\sim N(0,t)$.</p><p><b>Assumptions that matter:</b> standard Brownian motion starts at zero, has no drift, has unit variance rate, and has independent Gaussian increments; paths are continuous but almost surely nowhere differentiable.</p>",
    "worked": {
      "problem": "For standard Brownian motion, find the distribution of $W_3-W_1$ and compute $P(W_3-W_1\\le 2)$ using $\\Phi(\\sqrt2)\\approx0.921$.",
      "skills": [
        "Brownian increments",
        "normal standardization",
        "probability lookup"
      ],
      "strategy": "The interval length controls the variance, then standardization turns the probability into a standard normal value.",
      "steps": [
        {
          "do": "Compute the elapsed time",
          "result": "$3-1=2$",
          "why": "Brownian increment variance equals the length of the time interval"
        },
        {
          "do": "State the increment distribution",
          "result": "$W_3-W_1\\sim N(0,2)$",
          "why": "standard Brownian increments are centered Gaussian"
        },
        {
          "do": "Write the probability",
          "result": "$P(W_3-W_1\\le2)$",
          "why": "the question asks for the increment below 2"
        },
        {
          "do": "Standardize",
          "result": "$P(Z\\le 2/\\sqrt2)=P(Z\\le\\sqrt2)$",
          "why": "divide by the standard deviation $\\sqrt2$"
        },
        {
          "do": "Use the given normal value",
          "result": "$P(Z\\le\\sqrt2)\\approx0.921$",
          "why": "the standard normal table supplies the probability"
        }
      ],
      "verify": "The increment is likely to be below 2 because 2 is about $1.414$ standard deviations above the mean.",
      "answer": "$W_3-W_1\\sim N(0,2)$ and $P(W_3-W_1\\le2)\\approx0.921$.",
      "connects": "Brownian motion is random, but its increments are measured by the clock."
    },
    "practice": [
      {
        "problem": "Find the distribution of $W_5$ for standard Brownian motion.",
        "steps": [
          {
            "do": "Start from the definition",
            "result": "$W_5-W_0\\sim N(0,5)$",
            "why": "the elapsed time is 5"
          },
          {
            "do": "Use $W_0=0$",
            "result": "$W_5\\sim N(0,5)$",
            "why": "the starting value is zero"
          },
          {
            "do": "Identify the mean",
            "result": "$0$",
            "why": "standard Brownian motion has no drift"
          },
          {
            "do": "Identify the variance",
            "result": "$5$",
            "why": "variance equals time"
          },
          {
            "do": "Identify the standard deviation",
            "result": "$\\sqrt5$",
            "why": "standard deviation is the square root of variance"
          }
        ],
        "answer": "$W_5\\sim N(0,5)$, with standard deviation $\\sqrt5$."
      },
      {
        "problem": "Compute $P(W_4-W_3>1)$ using $\\Phi(1)\\approx0.841$.",
        "steps": [
          {
            "do": "Find the interval length",
            "result": "$4-3=1$",
            "why": "increment variance equals elapsed time"
          },
          {
            "do": "State the increment distribution",
            "result": "$W_4-W_3\\sim N(0,1)$",
            "why": "a one-time-unit Brownian increment is standard normal"
          },
          {
            "do": "Rewrite the event",
            "result": "$P(W_4-W_3>1)=P(Z>1)$",
            "why": "the increment already has standard normal distribution"
          },
          {
            "do": "Use the complement",
            "result": "$P(Z>1)=1-\\Phi(1)$",
            "why": "tables usually give left-tail probabilities"
          },
          {
            "do": "Substitute the value",
            "result": "$1-0.841=0.159$",
            "why": "subtract from one"
          }
        ],
        "answer": "The probability is about $0.159$."
      },
      {
        "problem": "For $X_t=2+0.5W_t$, find the mean and variance of $X_4$.",
        "steps": [
          {
            "do": "State $W_4$",
            "result": "$W_4\\sim N(0,4)$",
            "why": "Brownian variance equals time"
          },
          {
            "do": "Multiply by $0.5$",
            "result": "$0.5W_4\\sim N(0,0.25\\cdot4)$",
            "why": "variance scales by the square of the multiplier"
          },
          {
            "do": "Simplify the variance",
            "result": "$0.25\\cdot4=1$",
            "why": "one quarter of four is one"
          },
          {
            "do": "Add the constant",
            "result": "$X_4\\sim N(2,1)$",
            "why": "adding 2 shifts the mean only"
          },
          {
            "do": "Read mean and variance",
            "result": "$E[X_4]=2$, $\\operatorname{Var}(X_4)=1$",
            "why": "normal parameters give the answer"
          }
        ],
        "answer": "$E[X_4]=2$ and $\\operatorname{Var}(X_4)=1$."
      },
      {
        "problem": "A Brownian path has $W_2=1.4$. Find the conditional distribution of $W_5$ given $W_2=1.4$.",
        "steps": [
          {
            "do": "Separate the future increment",
            "result": "$W_5=W_2+(W_5-W_2)$",
            "why": "write the future as current value plus new noise"
          },
          {
            "do": "Find the increment length",
            "result": "$5-2=3$",
            "why": "the remaining time is 3"
          },
          {
            "do": "State the increment law",
            "result": "$W_5-W_2\\sim N(0,3)$",
            "why": "Brownian increments are Gaussian"
          },
          {
            "do": "Use independence",
            "result": "$W_5-W_2$ is independent of $W_2$",
            "why": "future Brownian noise is independent of the past"
          },
          {
            "do": "Condition on the observed value",
            "result": "$W_5\\mid W_2=1.4\\sim N(1.4,3)$",
            "why": "add the known current position to the future increment"
          }
        ],
        "answer": "$W_5\\mid W_2=1.4\\sim N(1.4,3)$."
      },
      {
        "problem": "Approximate a Brownian increment over $0.01$ seconds by $\\sqrt{0.01}Z$. If $Z=-0.8$, what increment is simulated?",
        "steps": [
          {
            "do": "Compute the square root",
            "result": "$\\sqrt{0.01}=0.1$",
            "why": "the standard deviation is the square root of elapsed time"
          },
          {
            "do": "Write the simulation formula",
            "result": "$\\Delta W=0.1Z$",
            "why": "Euler-style simulation scales standard normal noise"
          },
          {
            "do": "Substitute $Z=-0.8$",
            "result": "$\\Delta W=0.1(-0.8)$",
            "why": "use the sampled normal value"
          },
          {
            "do": "Multiply",
            "result": "$\\Delta W=-0.08$",
            "why": "one tenth of negative 0.8 is negative 0.08"
          },
          {
            "do": "Interpret the sign",
            "result": "the simulated path moves down by $0.08$",
            "why": "a negative normal draw gives a negative increment"
          }
        ],
        "answer": "The simulated increment is $-0.08$."
      }
    ],
    "applications": [
      {
        "title": "Particle diffusion",
        "background": "Brownian motion was developed to explain pollen grains jittering in fluid, a clue that invisible molecules were colliding with them.",
        "numbers": "With diffusion coefficient $D=0.2$, one-dimensional displacement has variance $2Dt=0.4t$; after $5$ seconds, variance is $2$ and standard deviation is $\\sqrt2\\approx1.414$."
      },
      {
        "title": "Financial log returns",
        "background": "The Black-Scholes model idealizes short log-return shocks as Brownian increments because many tiny market shocks accumulate.",
        "numbers": "If daily volatility is $1.5\\%$, a $4$-day Brownian volatility scale is $0.015\\sqrt4=0.03$, or $3\\%$."
      },
      {
        "title": "Sensor drift",
        "background": "Inertial sensors accumulate many small errors, so their reported position can wander like a Brownian path.",
        "numbers": "If variance grows at $0.04$ meters squared per minute, after $9$ minutes the variance is $0.36$ and standard deviation is $0.6$ meters."
      },
      {
        "title": "Stochastic gradient noise",
        "background": "Mini-batch gradients introduce random fluctuations around the full gradient. In small-step limits, this noise is often approximated by Brownian forcing.",
        "numbers": "If gradient noise variance rate is $0.25$, a time step $0.04$ has noise standard deviation $\\sqrt{0.25\\cdot0.04}=0.1$."
      },
      {
        "title": "Image generation diffusion",
        "background": "Modern diffusion models borrow the idea of gradually adding Gaussian noise over time before learning to reverse it.",
        "numbers": "A simple step $x_{t+1}=x_t+0.2Z$ with $Z=1.5$ adds noise $0.3$ to that coordinate."
      },
      {
        "title": "Queueing approximations",
        "background": "When arrivals and services are numerous, scaled queue fluctuations can resemble Brownian motion around their average trend.",
        "numbers": "If a centered queue has variance rate $16$ jobs squared per hour, the standard deviation after $0.25$ hours is $\\sqrt{16\\cdot0.25}=2$ jobs."
      }
    ],
    "applicationsClose": "The same clock-controlled Gaussian wandering appears in molecules, markets, sensors, optimization noise, and generative models.",
    "takeaways": [
      "Standard Brownian motion has $W_t\\sim N(0,t)$.",
      "Independent increments make the future noise separate from the past.",
      "A time interval of length $\\Delta t$ contributes variance $\\Delta t$ and standard deviation $\\sqrt{\\Delta t}$.",
      "Continuous Brownian paths are too rough to have ordinary derivatives."
    ]
  },
  "math-19-14": {
    "id": "math-19-14",
    "title": "Gaussian processes",
    "tagline": "A Gaussian process is a distribution over functions where every finite set of function values is jointly normal.",
    "connections": {
      "buildsOn": [
        "Brownian motion",
        "multivariate normal distributions",
        "covariance functions"
      ],
      "leadsTo": [
        "Martingales",
        "Bayesian regression",
        "kernel methods"
      ],
      "usedWith": [
        "kernels",
        "conditional normal distributions",
        "covariance matrices",
        "function spaces"
      ]
    },
    "motivation": "<p>You already know a normal random variable is a distribution over one number. A multivariate normal is a distribution over a finite vector of numbers. A Gaussian process takes one more brave step: it is a distribution over a whole function.</p><p>The gentle idea is this: if you ask for the function at any finite set of inputs, those values form a jointly normal vector. A mean function gives the central guess, and a kernel says which inputs should move together.</p>",
    "definition": "<p>A <b>Gaussian process</b>, written $f\\sim GP(m,k)$, is a collection of random variables $f(x)$ indexed by inputs $x$ such that every finite vector $(f(x_1),\\ldots,f(x_n))$ is multivariate normal. The mean function is $m(x)=E[f(x)]$, and the covariance function is $k(x,x')=\\operatorname{Cov}(f(x),f(x'))$.</p><p>The kernel builds the covariance matrix $K$ with entries $K_{ij}=k(x_i,x_j)$. For the squared-exponential kernel $k(x,x')=\\sigma_f^2\\exp(-(x-x')^2/(2\\ell^2))$, nearby inputs have covariance close to $\\sigma_f^2$, while far inputs have smaller covariance. That is smoothness expressed as covariance.</p><p><b>Assumptions that matter:</b> the kernel must produce positive semidefinite covariance matrices, the finite-dimensional distributions must be consistent, and Gaussian-process regression usually assumes Gaussian observation noise unless stated otherwise.</p>",
    "worked": {
      "problem": "For a zero-mean GP with kernel $k(x,x')=4\\exp(-(x-x')^2/2)$, compute the covariance matrix for inputs $0$ and $1$ using $e^{-1/2}\\approx0.607$.",
      "skills": [
        "kernel evaluation",
        "covariance matrices",
        "Gaussian-process notation"
      ],
      "strategy": "The kernel is the rule for every covariance entry; evaluate it on each input pair.",
      "steps": [
        {
          "do": "Compute the first variance",
          "result": "$k(0,0)=4e^0=4$",
          "why": "an input has zero distance from itself"
        },
        {
          "do": "Compute the second variance",
          "result": "$k(1,1)=4e^0=4$",
          "why": "the same variance rule applies at input 1"
        },
        {
          "do": "Compute the off-diagonal distance",
          "result": "$(0-1)^2=1$",
          "why": "the two inputs are one unit apart"
        },
        {
          "do": "Evaluate the covariance",
          "result": "$k(0,1)=4e^{-1/2}\\approx4\\cdot0.607=2.428$",
          "why": "nearby inputs are strongly correlated"
        },
        {
          "do": "Assemble the matrix",
          "result": "$K=\\begin{bmatrix}4&2.428\\2.428&4\\end{bmatrix}$",
          "why": "covariance matrices are symmetric"
        }
      ],
      "verify": "The off-diagonal value is less than the variance 4 but still positive, as nearby points should be.",
      "answer": "$K=\\begin{bmatrix}4&2.428\\2.428&4\\end{bmatrix}$.",
      "connects": "A Gaussian process becomes concrete as soon as you choose inputs and fill the kernel matrix."
    },
    "practice": [
      {
        "problem": "For $k(x,x')=9\\exp(-(x-x')^2/8)$, compute $k(2,2)$ and $k(2,4)$ using $e^{-1/2}\\approx0.607$.",
        "steps": [
          {
            "do": "Compute the same-input distance",
            "result": "$(2-2)^2=0$",
            "why": "variance uses zero distance"
          },
          {
            "do": "Evaluate $k(2,2)$",
            "result": "$9e^0=9$",
            "why": "the process variance is 9"
          },
          {
            "do": "Compute the cross-input distance",
            "result": "$(2-4)^2=4$",
            "why": "the inputs are two units apart"
          },
          {
            "do": "Compute the exponent",
            "result": "$-4/8=-1/2$",
            "why": "substitute into the kernel"
          },
          {
            "do": "Evaluate the covariance",
            "result": "$k(2,4)=9e^{-1/2}\\approx5.463$",
            "why": "multiply 9 by 0.607"
          }
        ],
        "answer": "$k(2,2)=9$ and $k(2,4)\\approx5.463$."
      },
      {
        "problem": "A GP has mean $m(x)=2x$ and kernel $k(x,x')=1$. Find the mean vector and covariance matrix at $x=1,3$.",
        "steps": [
          {
            "do": "Evaluate the first mean",
            "result": "$m(1)=2$",
            "why": "substitute input 1"
          },
          {
            "do": "Evaluate the second mean",
            "result": "$m(3)=6$",
            "why": "substitute input 3"
          },
          {
            "do": "Evaluate each covariance",
            "result": "$k(x_i,x_j)=1$",
            "why": "the kernel is constant"
          },
          {
            "do": "Write the mean vector",
            "result": "$\\mu=\\begin{bmatrix}2\\6\\end{bmatrix}$",
            "why": "stack the two means"
          },
          {
            "do": "Write the covariance matrix",
            "result": "$K=\\begin{bmatrix}1&1\\1&1\\end{bmatrix}$",
            "why": "all entries equal one"
          }
        ],
        "answer": "The vector is normal with mean $[2,6]^T$ and covariance $\\begin{bmatrix}1&1\\1&1\\end{bmatrix}$."
      },
      {
        "problem": "With prior $f_\\ast\\sim N(0,4)$ and noisy observation $y=3$ where $\\operatorname{Cov}(f_\\ast,y)=2$ and $\\operatorname{Var}(y)=5$, find the posterior mean of $f_\\ast$.",
        "steps": [
          {
            "do": "Write the conditional mean formula",
            "result": "$0+2\\cdot5^{-1}(3-0)$",
            "why": "Gaussian conditioning uses covariance times inverse variance"
          },
          {
            "do": "Compute the gain",
            "result": "$2/5=0.4$",
            "why": "divide covariance by observed variance"
          },
          {
            "do": "Multiply by the observation",
            "result": "$0.4\\cdot3=1.2$",
            "why": "the observed value pulls the mean upward"
          },
          {
            "do": "State the posterior mean",
            "result": "$1.2$",
            "why": "that is the conditional expectation"
          },
          {
            "do": "Check the direction",
            "result": "positive observation gives positive posterior mean",
            "why": "positive covariance means the variables move together"
          }
        ],
        "answer": "The posterior mean is $1.2$."
      },
      {
        "problem": "For the same setup, find the posterior variance of $f_\\ast$.",
        "steps": [
          {
            "do": "Write the conditional variance formula",
            "result": "$4-2\\cdot5^{-1}\\cdot2$",
            "why": "subtract explained variance"
          },
          {
            "do": "Multiply the covariances",
            "result": "$2\\cdot2=4$",
            "why": "the cross-covariance appears twice"
          },
          {
            "do": "Divide by observed variance",
            "result": "$4/5=0.8$",
            "why": "scale by uncertainty in the observation"
          },
          {
            "do": "Subtract",
            "result": "$4-0.8=3.2$",
            "why": "conditioning reduces uncertainty"
          },
          {
            "do": "State the result",
            "result": "$3.2$",
            "why": "posterior variance remains positive"
          }
        ],
        "answer": "The posterior variance is $3.2$."
      },
      {
        "problem": "A squared-exponential kernel has $\\sigma_f=2$ and length scale $\\ell=3$. Estimate covariance between inputs separated by $3$ using $e^{-1/2}\\approx0.607$.",
        "steps": [
          {
            "do": "Square the amplitude",
            "result": "$\\sigma_f^2=4$",
            "why": "kernel variance is amplitude squared"
          },
          {
            "do": "Compute the scaled squared distance",
            "result": "$3^2/(2\\cdot3^2)=1/2$",
            "why": "distance equals one length scale"
          },
          {
            "do": "Write the covariance",
            "result": "$4e^{-1/2}$",
            "why": "substitute into the kernel"
          },
          {
            "do": "Approximate",
            "result": "$4\\cdot0.607=2.428$",
            "why": "multiply amplitude variance by decay"
          },
          {
            "do": "Interpret",
            "result": "correlation is about $2.428/4=0.607$",
            "why": "one length scale leaves correlation near 0.607"
          }
        ],
        "answer": "The covariance is about $2.428$."
      }
    ],
    "applications": [
      {
        "title": "Bayesian regression",
        "background": "Gaussian-process regression gives predictions with uncertainty, which is valuable when data are scarce and decisions are expensive.",
        "numbers": "If the posterior mean is $7.5$ and variance is $0.25$, a rough 95 percent interval is $7.5\\pm2\\cdot0.5=[6.5,8.5]$."
      },
      {
        "title": "Bayesian optimization",
        "background": "Expensive experiments use GPs as surrogate models because the kernel shares information across nearby settings.",
        "numbers": "If one hyperparameter setting has predicted mean $0.82$ and standard deviation $0.03$, an upper-confidence score with weight 2 is $0.82+2(0.03)=0.88$."
      },
      {
        "title": "Spatial interpolation",
        "background": "Geostatistics used Gaussian processes under the name kriging before ML adopted them. Nearby locations tend to have correlated measurements.",
        "numbers": "With covariance $10e^{-d^2/18}$, two sensors $3$ km apart have covariance $10e^{-1/2}\\approx6.07$."
      },
      {
        "title": "Time-series smoothing",
        "background": "A GP kernel over time can separate smooth signal from noisy observations without choosing a fixed polynomial degree.",
        "numbers": "If observation noise variance is $0.09$, a posterior standard deviation dropping from $0.5$ to $0.2$ means variance drops from $0.25$ to $0.04$."
      },
      {
        "title": "Uncertainty-aware robotics",
        "background": "Robots mapping terrain need both a predicted surface and confidence about unexplored regions.",
        "numbers": "A predicted obstacle height $1.2$ m with standard deviation $0.15$ gives a cautious upper estimate $1.2+2(0.15)=1.5$ m."
      },
      {
        "title": "Kernel design",
        "background": "Kernel choices encode mathematical beliefs such as smoothness, periodicity, or linear trends.",
        "numbers": "A periodic kernel with period $24$ hours makes times $3$ and $27$ hours perfectly aligned in phase, since their difference is exactly one period."
      }
    ],
    "applicationsClose": "Gaussian processes turn assumptions about similarity into full predictive distributions over functions.",
    "takeaways": [
      "A GP is defined by finite jointly normal function values.",
      "The mean function gives central tendency and the kernel gives covariance.",
      "Kernel matrices must be positive semidefinite.",
      "Conditioning a joint Gaussian gives posterior means and variances for regression."
    ]
  },
  "math-19-15": {
    "id": "math-19-15",
    "title": "Martingales",
    "tagline": "A martingale is a fair-game process: given the present, the expected future equals what you have now.",
    "connections": {
      "buildsOn": [
        "conditional expectation",
        "filtrations",
        "Gaussian processes"
      ],
      "leadsTo": [
        "Itô's lemma",
        "optional stopping",
        "stochastic integration"
      ],
      "usedWith": [
        "adapted processes",
        "independent increments",
        "stopping times",
        "fair games"
      ]
    },
    "motivation": "<p>You already understand a fair bet: if you know everything that has happened so far, the next expected gain is zero. You might win or lose, but the game has no built-in tilt.</p><p>A <b>martingale</b> makes that idea precise for a whole stochastic process. It is one of the cleanest ways to say that the present value is the best prediction of the future value, using the information currently available.</p>",
    "definition": "<p>Given a filtration $\\mathcal F_t$ representing information available by time $t$, a process $M_t$ is a martingale if it is adapted, has finite expectation, and for $s<t$, $$E[M_t\\mid\\mathcal F_s]=M_s.$$ Here $E[\\cdot\\mid\\mathcal F_s]$ means conditional expectation given the past and present information at time $s$.</p><p>The fair-game identity follows from zero-mean future increments. If $M_t=M_s+(M_t-M_s)$ and $E[M_t-M_s\\mid\\mathcal F_s]=0$, then $E[M_t\\mid\\mathcal F_s]=M_s+0=M_s$. Brownian motion itself is a martingale because its future increment is independent of the past and has mean zero.</p><p><b>Assumptions that matter:</b> the process must be measurable with respect to current information, expectations must exist, and the equality is conditional on the chosen filtration, not on hidden information outside the model.</p>",
    "worked": {
      "problem": "Let $M_n=\\sum_{i=1}^n X_i$, where $X_i$ are independent fair coin gains with $P(X_i=1)=P(X_i=-1)=1/2$. Show $M_n$ is a martingale.",
      "skills": [
        "conditional expectation",
        "independent increments",
        "fair games"
      ],
      "strategy": "Separate what is already known from the next fair increment.",
      "steps": [
        {
          "do": "Write the next value",
          "result": "$M_{n+1}=M_n+X_{n+1}$",
          "why": "the process adds one new gain"
        },
        {
          "do": "Condition on the present information",
          "result": "$E[M_{n+1}\\mid\\mathcal F_n]=E[M_n+X_{n+1}\\mid\\mathcal F_n]$",
          "why": "martingales are checked using current information"
        },
        {
          "do": "Pull out the known part",
          "result": "$E[M_n\\mid\\mathcal F_n]=M_n$",
          "why": "$M_n$ is already known at time $n$"
        },
        {
          "do": "Compute the new increment mean",
          "result": "$E[X_{n+1}\\mid\\mathcal F_n]=0$",
          "why": "the next fair coin gain is independent and centered"
        },
        {
          "do": "Combine the terms",
          "result": "$E[M_{n+1}\\mid\\mathcal F_n]=M_n$",
          "why": "known value plus zero expected gain equals the present"
        }
      ],
      "verify": "The process can move, but its conditional expected change is zero at every step.",
      "answer": "$M_n$ is a martingale with respect to the natural coin-flip filtration.",
      "connects": "Martingales formalize fair prediction rather than path stability."
    },
    "practice": [
      {
        "problem": "If $M_4=7$ and $M_n$ is a martingale, find $E[M_9\\mid\\mathcal F_4]$.",
        "steps": [
          {
            "do": "Identify the known present",
            "result": "$M_4=7$",
            "why": "time 4 information includes the current value"
          },
          {
            "do": "Apply the martingale property",
            "result": "$E[M_9\\mid\\mathcal F_4]=M_4$",
            "why": "future conditional expectation equals present"
          },
          {
            "do": "Substitute the value",
            "result": "$E[M_9\\mid\\mathcal F_4]=7$",
            "why": "replace $M_4$ by its observed value"
          },
          {
            "do": "Interpret the result",
            "result": "expected future value is $7$",
            "why": "the future has no conditional drift"
          },
          {
            "do": "Separate expectation from certainty",
            "result": "$M_9$ need not equal $7$",
            "why": "martingales can still fluctuate"
          }
        ],
        "answer": "$E[M_9\\mid\\mathcal F_4]=7$."
      },
      {
        "problem": "A process has $X_{n+1}$ independent of $\\mathcal F_n$ with $E[X_{n+1}]=2$ and $M_{n+1}=M_n+X_{n+1}$. Is $M_n$ a martingale?",
        "steps": [
          {
            "do": "Write the conditional expectation",
            "result": "$E[M_{n+1}\\mid\\mathcal F_n]=M_n+E[X_{n+1}\\mid\\mathcal F_n]$",
            "why": "split known and new parts"
          },
          {
            "do": "Use independence",
            "result": "$E[X_{n+1}\\mid\\mathcal F_n]=E[X_{n+1}]$",
            "why": "future increment does not depend on past"
          },
          {
            "do": "Substitute the mean",
            "result": "$E[X_{n+1}\\mid\\mathcal F_n]=2$",
            "why": "the increment has positive drift"
          },
          {
            "do": "Combine",
            "result": "$E[M_{n+1}\\mid\\mathcal F_n]=M_n+2$",
            "why": "expected future exceeds present"
          },
          {
            "do": "Compare with martingale condition",
            "result": "$M_n+2\\ne M_n$",
            "why": "fair-game equality fails"
          }
        ],
        "answer": "No. It is not a martingale because it has positive conditional drift."
      },
      {
        "problem": "Show that $W_t^2-t$ has mean $0$ for standard Brownian motion at time $t=3$.",
        "steps": [
          {
            "do": "Use Brownian variance",
            "result": "$W_3\\sim N(0,3)$",
            "why": "variance equals time"
          },
          {
            "do": "Compute second moment",
            "result": "$E[W_3^2]=\\operatorname{Var}(W_3)+E[W_3]^2=3$",
            "why": "the mean is zero"
          },
          {
            "do": "Substitute into the process",
            "result": "$E[W_3^2-3]=E[W_3^2]-3$",
            "why": "linearity of expectation"
          },
          {
            "do": "Simplify",
            "result": "$3-3=0$",
            "why": "the time correction removes variance growth"
          },
          {
            "do": "Interpret",
            "result": "centered quadratic variation has mean zero",
            "why": "this is a key martingale pattern"
          }
        ],
        "answer": "$E[W_3^2-3]=0$."
      },
      {
        "problem": "A supermartingale satisfies $E[X_{n+1}\\mid\\mathcal F_n]\\le X_n$. If $X_n=10$ and expected next value is $9.6$, compute the expected drift and classify it.",
        "steps": [
          {
            "do": "Write expected drift",
            "result": "$E[X_{n+1}\\mid\\mathcal F_n]-X_n$",
            "why": "drift is expected change"
          },
          {
            "do": "Substitute values",
            "result": "$9.6-10$",
            "why": "use the given present and expected next value"
          },
          {
            "do": "Compute",
            "result": "$-0.4$",
            "why": "expected value decreases"
          },
          {
            "do": "Check supermartingale inequality",
            "result": "$9.6\\le10$",
            "why": "future expectation is no larger than present"
          },
          {
            "do": "Classify",
            "result": "supermartingale behavior",
            "why": "negative expected drift matches the definition"
          }
        ],
        "answer": "The expected drift is $-0.4$, so it behaves as a supermartingale at that step."
      },
      {
        "problem": "In a stopped fair game, you stop when wealth first hits $12$ or $0$, starting from $5$. If stopping is bounded and fair, find the probability of hitting $12$ first.",
        "steps": [
          {
            "do": "Let $p$ be the hit-$12$ probability",
            "result": "$p=P(\\text{hit }12\\text{ first})$",
            "why": "name the unknown"
          },
          {
            "do": "Write terminal wealth expectation",
            "result": "$E[M_T]=12p+0(1-p)$",
            "why": "terminal wealth is either 12 or 0"
          },
          {
            "do": "Use fair bounded stopping",
            "result": "$E[M_T]=M_0=5$",
            "why": "optional stopping preserves expectation under bounded conditions"
          },
          {
            "do": "Set up the equation",
            "result": "$12p=5$",
            "why": "match terminal expectation to starting wealth"
          },
          {
            "do": "Solve",
            "result": "$p=5/12\\approx0.417$",
            "why": "divide by 12"
          }
        ],
        "answer": "The probability of hitting $12$ first is $5/12\\approx0.417$."
      }
    ],
    "applications": [
      {
        "title": "Fair gambling models",
        "background": "Martingales were shaped by probability theory's study of fair games, where no strategy should create expected profit from nothing.",
        "numbers": "Starting with $20$ dollars in a fair bounded game, expected wealth at stop remains $20$, even if terminal wealth is $0$ or $50$."
      },
      {
        "title": "Asset pricing",
        "background": "Risk-neutral pricing uses martingales: discounted asset prices have no expected drift under the pricing measure.",
        "numbers": "If a discounted payoff is $110$ with probability $0.4$ and $90$ with probability $0.6$, its price is $0.4(110)+0.6(90)=98$."
      },
      {
        "title": "Brownian motion",
        "background": "Standard Brownian motion is a martingale because future increments are independent and centered.",
        "numbers": "If $W_2=1.1$, then $E[W_5\\mid\\mathcal F_2]=1.1$."
      },
      {
        "title": "Online learning",
        "background": "Martingale concentration inequalities control the sum of unpredictable errors in sequential prediction.",
        "numbers": "If errors have zero conditional mean and are bounded by 1 for $100$ rounds, typical fluctuation scale is about $\\sqrt{100}=10$."
      },
      {
        "title": "A/B testing over time",
        "background": "Sequential experiments must account for repeated looks at data. Martingale methods help keep false positives controlled.",
        "numbers": "A centered cumulative lift estimate with standard error $0.02$ has a rough two-standard-error band $\\pm0.04$."
      },
      {
        "title": "Reinforcement learning returns",
        "background": "Temporal-difference errors can be arranged as martingale difference noise around a value estimate.",
        "numbers": "If three zero-mean TD noises are $0.2,-0.1,-0.1$, their sum is $0$, matching the no-drift idea in that sample."
      }
    ],
    "applicationsClose": "Martingales are the mathematics of honest conditional prediction, from games to prices to online learning noise.",
    "takeaways": [
      "A martingale satisfies $E[M_t\\mid\\mathcal F_s]=M_s$ for $s<t$.",
      "Zero-mean future increments are the common route to the martingale property.",
      "The filtration matters because it defines what information is known.",
      "Martingales can fluctuate widely even though their conditional expected change is zero."
    ]
  },
  "math-19-16": {
    "id": "math-19-16",
    "title": "Itô's lemma",
    "tagline": "Itô's lemma is the chain rule for Brownian-driven processes, with an extra second-derivative term from noise variance.",
    "connections": {
      "buildsOn": [
        "Martingales",
        "Brownian motion",
        "Taylor expansion"
      ],
      "leadsTo": [
        "Monte Carlo methods",
        "stochastic differential equations",
        "diffusion models"
      ],
      "usedWith": [
        "quadratic variation",
        "partial derivatives",
        "stochastic integrals",
        "chain rules"
      ]
    },
    "motivation": "<p>You already know the ordinary chain rule: if $x(t)$ changes smoothly, then $f(x(t))$ changes according to $f'(x)x'(t)$. Brownian motion is not smooth, so that familiar rule needs one careful repair.</p><p><b>Itô's lemma</b> says the repair is a second-derivative term. Tiny Brownian increments have mean zero, but their squares add up like time, so curvature creates a real drift contribution.</p>",
    "definition": "<p>If $dX_t=\\mu(t,X_t)dt+\\sigma(t,X_t)dW_t$ and $f(t,x)$ is sufficiently smooth, then $$df(t,X_t)=\\left(f_t+\\mu f_x+\\tfrac12\\sigma^2 f_{xx}\\right)dt+\\sigma f_x\\,dW_t.$$ Here $f_t$, $f_x$, and $f_{xx}$ are partial derivatives evaluated at $(t,X_t)$.</p><p>The extra term comes from a Taylor expansion: $df\\approx f_tdt+f_xdX+\\tfrac12f_{xx}(dX)^2$. In Itô calculus, $(dW_t)^2$ behaves like $dt$, while $dt\\,dW_t$ and $(dt)^2$ are negligible. Thus $(dX_t)^2\\approx\\sigma^2dt$.</p><p><b>Assumptions that matter:</b> the process follows an Itô stochastic differential equation, the function has the needed derivatives, and the calculation uses Itô convention, not an ordinary pathwise derivative.</p>",
    "worked": {
      "problem": "For $X_t=W_t$ and $f(x)=x^2$, use Itô's lemma to find $d(W_t^2)$.",
      "skills": [
        "Itô derivatives",
        "Brownian motion",
        "quadratic variation"
      ],
      "strategy": "The ordinary chain rule misses the squared-noise term, so compute derivatives and add the Itô correction.",
      "steps": [
        {
          "do": "Identify coefficients",
          "result": "$\\mu=0$, $\\sigma=1$",
          "why": "standard Brownian motion has $dW_t=0\\,dt+1\\,dW_t$"
        },
        {
          "do": "Compute the first derivative",
          "result": "$f_x=2x$",
          "why": "differentiate $x^2$ once"
        },
        {
          "do": "Compute the second derivative",
          "result": "$f_{xx}=2$",
          "why": "differentiate again"
        },
        {
          "do": "Substitute into Itô's lemma",
          "result": "$df=\\tfrac12\\cdot1^2\\cdot2\\,dt+1\\cdot2W_t\\,dW_t$",
          "why": "there is no time derivative and no drift term"
        },
        {
          "do": "Simplify",
          "result": "$d(W_t^2)=dt+2W_t\\,dW_t$",
          "why": "the correction contributes one $dt$"
        }
      ],
      "verify": "Taking expectations gives $dE[W_t^2]=dt$, so $E[W_t^2]=t$, matching Brownian variance.",
      "answer": "$d(W_t^2)=2W_t\\,dW_t+dt$.",
      "connects": "The extra $dt$ is the signature of Brownian roughness."
    },
    "practice": [
      {
        "problem": "Use Itô's lemma for $f(x)=x^3$ and $X_t=W_t$.",
        "steps": [
          {
            "do": "Compute $f_x$",
            "result": "$3x^2$",
            "why": "differentiate once"
          },
          {
            "do": "Compute $f_{xx}$",
            "result": "$6x$",
            "why": "differentiate twice"
          },
          {
            "do": "Use $\\mu=0$, $\\sigma=1$",
            "result": "$df=\\tfrac12 f_{xx}dt+f_xdW_t$",
            "why": "Brownian motion has zero drift and unit diffusion"
          },
          {
            "do": "Substitute $x=W_t$",
            "result": "$d(W_t^3)=3W_tdt+3W_t^2dW_t$",
            "why": "replace derivatives by their Brownian values"
          },
          {
            "do": "Order the terms",
            "result": "$d(W_t^3)=3W_t^2dW_t+3W_tdt$",
            "why": "stochastic and drift terms are both present"
          }
        ],
        "answer": "$d(W_t^3)=3W_t^2dW_t+3W_tdt$."
      },
      {
        "problem": "For $dX_t=2dt+3dW_t$ and $f(x)=x^2$, find $d(X_t^2)$.",
        "steps": [
          {
            "do": "Identify coefficients",
            "result": "$\\mu=2$, $\\sigma=3$",
            "why": "read drift and diffusion"
          },
          {
            "do": "Compute derivatives",
            "result": "$f_x=2x$, $f_{xx}=2$",
            "why": "differentiate $x^2$"
          },
          {
            "do": "Write Itô drift",
            "result": "$\\mu f_x+\\tfrac12\\sigma^2f_{xx}=2(2X_t)+\\tfrac12(9)(2)$",
            "why": "combine ordinary and correction drift"
          },
          {
            "do": "Simplify drift",
            "result": "$4X_t+9$",
            "why": "multiply the terms"
          },
          {
            "do": "Write diffusion term",
            "result": "$\\sigma f_xdW_t=3(2X_t)dW_t=6X_tdW_t$",
            "why": "noise coefficient times first derivative"
          }
        ],
        "answer": "$d(X_t^2)=(4X_t+9)dt+6X_tdW_t$."
      },
      {
        "problem": "For $f(t,x)=tx$ and $dX_t=\\mu dt+\\sigma dW_t$, find $df(t,X_t)$.",
        "steps": [
          {
            "do": "Compute $f_t$",
            "result": "$x$",
            "why": "differentiate with respect to time"
          },
          {
            "do": "Compute $f_x$",
            "result": "$t$",
            "why": "differentiate with respect to state"
          },
          {
            "do": "Compute $f_{xx}$",
            "result": "$0$",
            "why": "the function is linear in $x$"
          },
          {
            "do": "Substitute into Itô's lemma",
            "result": "$df=(X_t+\\mu t)dt+\\sigma t\\,dW_t$",
            "why": "the second-derivative correction is zero"
          },
          {
            "do": "Interpret",
            "result": "no curvature term appears",
            "why": "linear functions do not feel quadratic variation through curvature"
          }
        ],
        "answer": "$d(tX_t)=(X_t+\\mu t)dt+\\sigma t\\,dW_t$."
      },
      {
        "problem": "For geometric Brownian motion $dS_t=0.1S_tdt+0.2S_tdW_t$, find $d\\ln S_t$.",
        "steps": [
          {
            "do": "Set $f(s)=\\ln s$",
            "result": "$f_s=1/s$",
            "why": "first derivative of log"
          },
          {
            "do": "Compute the second derivative",
            "result": "$f_{ss}=-1/s^2$",
            "why": "differentiate again"
          },
          {
            "do": "Identify coefficients",
            "result": "$\\mu S_t=0.1S_t$, $\\sigma S_t=0.2S_t$",
            "why": "drift and diffusion are proportional to $S_t$"
          },
          {
            "do": "Compute drift",
            "result": "$0.1S_t(1/S_t)+\\tfrac12(0.2S_t)^2(-1/S_t^2)$",
            "why": "apply Itô's lemma"
          },
          {
            "do": "Simplify",
            "result": "$(0.1-0.5\\cdot0.04)dt+0.2dW_t=0.08dt+0.2dW_t$",
            "why": "log curvature subtracts half variance"
          }
        ],
        "answer": "$d\\ln S_t=0.08dt+0.2dW_t$."
      },
      {
        "problem": "A diffusion model step uses $dX_t=-X_tdt+0.5dW_t$. For $f(x)=x^2$, find the drift part of $df$ when $X_t=2$.",
        "steps": [
          {
            "do": "Compute derivatives",
            "result": "$f_x=2x$, $f_{xx}=2$",
            "why": "same square function derivatives"
          },
          {
            "do": "Identify coefficients",
            "result": "$\\mu=-X_t$, $\\sigma=0.5$",
            "why": "read the SDE"
          },
          {
            "do": "Write drift formula",
            "result": "$\\mu f_x+\\tfrac12\\sigma^2f_{xx}$",
            "why": "Itô drift includes correction"
          },
          {
            "do": "Substitute $X_t=2$",
            "result": "$(-2)(4)+\\tfrac12(0.25)(2)$",
            "why": "$f_x=4$ at $x=2$"
          },
          {
            "do": "Simplify",
            "result": "$-8+0.25=-7.75$",
            "why": "combine ordinary drift and correction"
          }
        ],
        "answer": "The drift part of $d(X_t^2)$ at $X_t=2$ is $-7.75dt$."
      }
    ],
    "applications": [
      {
        "title": "Option pricing",
        "background": "Itô's lemma is the engine behind Black-Scholes because option value is a function of time and a noisy stock price.",
        "numbers": "If volatility is $0.2$, the log drift correction is $0.5(0.2)^2=0.02$ per year."
      },
      {
        "title": "Stochastic control",
        "background": "Control systems with random disturbances track how costs change when state follows an SDE.",
        "numbers": "For cost $x^2$ and noise $\\sigma=0.3$, the Itô correction is $0.5(0.09)(2)=0.09$ in the drift."
      },
      {
        "title": "Physics diffusions",
        "background": "Random molecular motion is modeled by differential equations with Brownian forcing, and Itô's lemma tracks transformed quantities such as energy.",
        "numbers": "For $f(x)=x^2/2$ and $\\sigma=2$, the correction is $0.5\\cdot4\\cdot1=2$."
      },
      {
        "title": "Diffusion generative models",
        "background": "Score-based generative models use forward and reverse SDEs; Itô calculus explains how densities evolve under noisy dynamics.",
        "numbers": "If a coordinate has diffusion coefficient $0.5$, a small step $dt=0.01$ has noise standard deviation $0.5\\sqrt{0.01}=0.05$."
      },
      {
        "title": "Risk modeling",
        "background": "Portfolio transformations are nonlinear, so noise variance can change expected values through curvature.",
        "numbers": "For $f(x)=x^2$ and volatility $\\sigma=0.1$, the correction to drift is $0.5(0.01)(2)=0.01$."
      },
      {
        "title": "Neural SDEs",
        "background": "Some continuous-depth neural networks add stochastic dynamics; Itô's lemma is the calculus used to train and analyze them.",
        "numbers": "With drift $-0.4x$ and noise $0.2$, the square-state drift at $x=1$ is $-0.8+0.04=-0.76$."
      }
    ],
    "applicationsClose": "Itô's lemma is the translation guide whenever a noisy state is pushed through a smooth function.",
    "takeaways": [
      "Itô's lemma adds $\\tfrac12\\sigma^2f_{xx}dt$ to the ordinary chain rule.",
      "The extra term comes from $(dW_t)^2$ behaving like $dt$.",
      "Linear functions have no Itô correction because their second derivative is zero.",
      "Log transforms of geometric Brownian motion subtract half the variance rate."
    ]
  },
  "math-19-17": {
    "id": "math-19-17",
    "title": "Monte Carlo methods",
    "tagline": "Monte Carlo estimates hard averages by simulating many random samples and averaging the results.",
    "connections": {
      "buildsOn": [
        "Itô's lemma",
        "expected value",
        "law of large numbers"
      ],
      "leadsTo": [
        "Markov Chain Monte Carlo (MCMC)",
        "simulation",
        "stochastic optimization"
      ],
      "usedWith": [
        "sample means",
        "variance",
        "confidence intervals",
        "random sampling"
      ]
    },
    "motivation": "<p>You already average numbers to summarize them. Monte Carlo uses that same habit when the numbers are random draws from a distribution or simulated model.</p><p>The promise is practical: if an integral or expectation is hard to compute directly, draw samples, evaluate the quantity, and average. More samples reduce noise at the familiar $1/\\sqrt n$ rate.</p>",
    "definition": "<p>To estimate $\\mu=E[g(X)]$, Monte Carlo draws independent samples $X_1,\\ldots,X_n$ from the distribution of $X$ and uses $$\\hat\\mu_n=\\frac1n\\sum_{i=1}^n g(X_i).$$ The estimator is unbiased when the samples are drawn correctly, because $E[\\hat\\mu_n]=\\mu$.</p><p>The variance is $\\operatorname{Var}(\\hat\\mu_n)=\\operatorname{Var}(g(X))/n$ for independent samples. That is why quadrupling the number of samples only halves the standard error. The method is simple, powerful, and sometimes expensive.</p><p><b>Assumptions that matter:</b> samples should match the target distribution, independence or weak dependence controls error formulas, and finite variance is needed for the usual standard-error estimate.</p>",
    "worked": {
      "problem": "Estimate $E[X^2]$ from samples $X=1,2,3,4$ and compute the sample standard error of the mean of $X^2$.",
      "skills": [
        "sample means",
        "sample variance",
        "standard error"
      ],
      "strategy": "Evaluate the function on each sample, average, then measure uncertainty of that average.",
      "steps": [
        {
          "do": "Square the samples",
          "result": "$1,4,9,16$",
          "why": "the quantity is $g(X)=X^2$"
        },
        {
          "do": "Compute the average",
          "result": "$(1+4+9+16)/4=7.5$",
          "why": "Monte Carlo uses the sample mean"
        },
        {
          "do": "Compute deviations from the mean",
          "result": "$-6.5,-3.5,1.5,8.5$",
          "why": "sample variance measures spread around 7.5"
        },
        {
          "do": "Square and sum deviations",
          "result": "$42.25+12.25+2.25+72.25=129$",
          "why": "variance uses squared deviations"
        },
        {
          "do": "Compute sample variance",
          "result": "$129/(4-1)=43$",
          "why": "use $n-1$ for sample variance"
        },
        {
          "do": "Compute standard error",
          "result": "$\\sqrt{43/4}\\approx3.279$",
          "why": "standard error is sample standard deviation divided by $\\sqrt n$"
        }
      ],
      "verify": "The estimate is noisy because only four samples were used and the squared values vary widely.",
      "answer": "The Monte Carlo estimate is $7.5$ with standard error about $3.279$.",
      "connects": "Monte Carlo turns integration into averaging, with uncertainty visible in the standard error."
    },
    "practice": [
      {
        "problem": "Use samples $2,4,6$ to estimate $E[X]$.",
        "steps": [
          {
            "do": "List the samples",
            "result": "$2,4,6$",
            "why": "these are draws from the target distribution"
          },
          {
            "do": "Add them",
            "result": "$2+4+6=12$",
            "why": "sample mean starts with a sum"
          },
          {
            "do": "Divide by sample count",
            "result": "$12/3=4$",
            "why": "there are three samples"
          },
          {
            "do": "Name the estimator",
            "result": "$\\hat\\mu=4$",
            "why": "the average estimates the expectation"
          },
          {
            "do": "Interpret",
            "result": "the estimated mean is $4$",
            "why": "Monte Carlo estimates expected value by averaging"
          }
        ],
        "answer": "$\\hat\\mu=4$."
      },
      {
        "problem": "Estimate $P(X>0)$ from signs $-1,2,3,-4,5$.",
        "steps": [
          {
            "do": "Count positive samples",
            "result": "$3$",
            "why": "the positive values are 2, 3, and 5"
          },
          {
            "do": "Count total samples",
            "result": "$5$",
            "why": "five draws were observed"
          },
          {
            "do": "Write the indicator average",
            "result": "$\\hat p=3/5$",
            "why": "probabilities can be estimated by averaging indicators"
          },
          {
            "do": "Convert to decimal",
            "result": "$0.6$",
            "why": "divide 3 by 5"
          },
          {
            "do": "Interpret",
            "result": "about $60\\%$ positive",
            "why": "the estimate is empirical frequency"
          }
        ],
        "answer": "$\\hat p=0.6$."
      },
      {
        "problem": "If $\\operatorname{Var}(g(X))=25$ and $n=100$, compute the Monte Carlo standard error.",
        "steps": [
          {
            "do": "Write the variance of the mean",
            "result": "$25/100$",
            "why": "independent averaging divides variance by $n$"
          },
          {
            "do": "Simplify",
            "result": "$0.25$",
            "why": "twenty-five divided by one hundred"
          },
          {
            "do": "Take the square root",
            "result": "$0.5$",
            "why": "standard error is square root of variance"
          },
          {
            "do": "Compare to single-sample standard deviation",
            "result": "$\\sqrt{25}=5$",
            "why": "averaging greatly reduces uncertainty"
          },
          {
            "do": "State the rate",
            "result": "$5/\\sqrt{100}=0.5$",
            "why": "same calculation by the $1/\\sqrt n$ rule"
          }
        ],
        "answer": "The standard error is $0.5$."
      },
      {
        "problem": "A simulation estimates accuracy with $\\hat p=0.72$ from $400$ trials. Estimate the binomial standard error.",
        "steps": [
          {
            "do": "Write the binomial variance estimate",
            "result": "$\\hat p(1-\\hat p)/n$",
            "why": "accuracy is an average of Bernoulli indicators"
          },
          {
            "do": "Substitute",
            "result": "$0.72\\cdot0.28/400$",
            "why": "success and failure rates multiply"
          },
          {
            "do": "Multiply numerator",
            "result": "$0.2016/400$",
            "why": "compute $0.72\\cdot0.28$"
          },
          {
            "do": "Divide",
            "result": "$0.000504$",
            "why": "variance of the sample proportion"
          },
          {
            "do": "Take square root",
            "result": "$\\sqrt{0.000504}\\approx0.0224$",
            "why": "this is the standard error"
          }
        ],
        "answer": "The standard error is about $0.0224$."
      },
      {
        "problem": "Use Monte Carlo values $0.2,0.5,0.4,0.9,0.0$ for a loss to estimate mean loss and a rough 95 percent interval using sample variance $0.115$.",
        "steps": [
          {
            "do": "Add the losses",
            "result": "$0.2+0.5+0.4+0.9+0.0=2.0$",
            "why": "sum the simulated outputs"
          },
          {
            "do": "Compute the mean",
            "result": "$2.0/5=0.4$",
            "why": "divide by sample count"
          },
          {
            "do": "Compute standard error",
            "result": "$\\sqrt{0.115/5}\\approx0.152$",
            "why": "use the given sample variance"
          },
          {
            "do": "Compute two-standard-error margin",
            "result": "$2\\cdot0.152=0.304$",
            "why": "rough 95 percent interval uses about two standard errors"
          },
          {
            "do": "Form the interval",
            "result": "$0.4\\pm0.304=[0.096,0.704]$",
            "why": "add and subtract the margin"
          }
        ],
        "answer": "Estimated mean loss is $0.4$ with rough interval $[0.096,0.704]$."
      }
    ],
    "applications": [
      {
        "title": "Estimating integrals",
        "background": "Monte Carlo integration became essential because high-dimensional grids grow impossibly fast.",
        "numbers": "For $x$ samples $0.1,0.4,0.9$, estimating $\\int_0^1x^2dx$ gives $(0.01+0.16+0.81)/3=0.327$, near $1/3$."
      },
      {
        "title": "Model evaluation",
        "background": "Test metrics are averages over examples, so their uncertainty follows Monte Carlo logic.",
        "numbers": "Accuracy $850/1000=0.85$ has standard error $\\sqrt{0.85\\cdot0.15/1000}\\approx0.0113$."
      },
      {
        "title": "Rendering",
        "background": "Computer graphics uses random rays to estimate light transport when exact integration is too complex.",
        "numbers": "A pixel with ray colors $0.2,0.6,0.4,0.8$ is estimated as brightness $0.5$."
      },
      {
        "title": "Bayesian prediction",
        "background": "Posterior predictive quantities are often averages over parameter samples.",
        "numbers": "Predictions $3.1,2.9,3.4,3.0$ average to $3.1$."
      },
      {
        "title": "Risk simulation",
        "background": "Finance and operations simulate many possible futures to estimate tail losses.",
        "numbers": "If 5 of 1000 simulated losses exceed $1$ million, the estimated exceedance probability is $0.005$."
      },
      {
        "title": "Stochastic optimization",
        "background": "Mini-batch training estimates a full gradient using a random subset of data.",
        "numbers": "Batch gradients $1.2,0.8,1.0,1.4$ average to $1.1$, an estimate of the full gradient component."
      }
    ],
    "applicationsClose": "Monte Carlo is the art of replacing impossible exact averages with honest simulated averages and measured uncertainty.",
    "takeaways": [
      "Monte Carlo estimates expectations by sample averages.",
      "Independent sample mean variance shrinks like $1/n$.",
      "Standard error shrinks like $1/\\sqrt n$.",
      "The method is broadly useful when direct integration is difficult."
    ]
  },
  "math-19-18": {
    "id": "math-19-18",
    "title": "Markov Chain Monte Carlo (MCMC)",
    "tagline": "MCMC samples from a hard distribution by walking through states with a Markov chain whose long-run behavior is the target.",
    "connections": {
      "buildsOn": [
        "Monte Carlo methods",
        "Markov chains",
        "stationary distributions"
      ],
      "leadsTo": [
        "Markov Decision Processes (RL)",
        "Bayesian inference",
        "Gibbs sampling"
      ],
      "usedWith": [
        "transition matrices",
        "detailed balance",
        "acceptance ratios",
        "stationarity"
      ]
    },
    "motivation": "<p>You already know ordinary Monte Carlo needs direct samples. But many important distributions are easy to evaluate up to a constant and hard to sample from directly.</p><p><b>Markov Chain Monte Carlo</b> solves this by designing a random walk whose long-run fraction of visits matches the target distribution. Early samples may be biased, but after mixing, averages along the chain approximate expectations.</p>",
    "definition": "<p>MCMC constructs a Markov chain $X_0,X_1,\\ldots$ with stationary distribution $\\pi$. The estimate of $E_\\pi[g(X)]$ is the chain average $\\frac1n\\sum_{i=1}^n g(X_i)$ after burn-in. In Metropolis-Hastings, a proposal $y$ from $q(y\\mid x)$ is accepted with probability $$\\alpha=\\min\\left(1,\\frac{\\pi(y)q(x\\mid y)}{\\pi(x)q(y\\mid x)}\\right).$$</p><p>For symmetric proposals, $q(y\\mid x)=q(x\\mid y)$, so the proposal terms cancel and moves to higher target density are accepted automatically. Moves to lower density are accepted sometimes, which keeps exploration alive.</p><p><b>Assumptions that matter:</b> the chain must be able to reach the relevant state space, have the desired stationary distribution, and be run long enough that initialization effects are small.</p>",
    "worked": {
      "problem": "With symmetric proposal and unnormalized target values $\\pi(x)=0.2$, $\\pi(y)=0.5$, compute the Metropolis acceptance probability for moving from $x$ to $y$.",
      "skills": [
        "Metropolis ratios",
        "acceptance probability"
      ],
      "strategy": "Symmetry cancels proposal terms, so compare target values.",
      "steps": [
        {
          "do": "Write the symmetric acceptance rule",
          "result": "$\\alpha=\\min(1,\\pi(y)/\\pi(x))$",
          "why": "proposal probabilities cancel"
        },
        {
          "do": "Substitute target values",
          "result": "$\\alpha=\\min(1,0.5/0.2)$",
          "why": "move from current $x$ to proposed $y$"
        },
        {
          "do": "Divide",
          "result": "$0.5/0.2=2.5$",
          "why": "the proposal has higher target value"
        },
        {
          "do": "Apply the minimum",
          "result": "$\\min(1,2.5)=1$",
          "why": "probabilities cannot exceed one"
        },
        {
          "do": "Interpret",
          "result": "accept always",
          "why": "uphill moves are always accepted in this case"
        }
      ],
      "verify": "The proposed state has higher target weight, so automatic acceptance is sensible.",
      "answer": "The acceptance probability is $1$.",
      "connects": "MCMC corrects a random walk by accepting proposals in a way that preserves the target distribution."
    },
    "practice": [
      {
        "problem": "For symmetric proposal, compute acceptance from target value $0.8$ to $0.2$.",
        "steps": [
          {
            "do": "Write the rule",
            "result": "$\\alpha=\\min(1,0.2/0.8)$",
            "why": "divide proposed target by current target"
          },
          {
            "do": "Divide",
            "result": "$0.25$",
            "why": "one quarter as much target weight"
          },
          {
            "do": "Apply minimum",
            "result": "$0.25$",
            "why": "already below one"
          },
          {
            "do": "Convert to percent",
            "result": "$25\\%$",
            "why": "probability form"
          },
          {
            "do": "Interpret",
            "result": "accept sometimes",
            "why": "downhill moves allow exploration"
          }
        ],
        "answer": "Acceptance probability is $0.25$."
      },
      {
        "problem": "A chain has post-burn-in samples $1,1,2,3,3$. Estimate $E[X]$.",
        "steps": [
          {
            "do": "Add samples",
            "result": "$1+1+2+3+3=10$",
            "why": "chain average uses visited states"
          },
          {
            "do": "Count samples",
            "result": "$5$",
            "why": "five retained states"
          },
          {
            "do": "Divide",
            "result": "$10/5=2$",
            "why": "average the retained samples"
          },
          {
            "do": "Name estimate",
            "result": "$\\hat E[X]=2$",
            "why": "MCMC mean estimates target expectation"
          },
          {
            "do": "Note dependence",
            "result": "samples are not necessarily independent",
            "why": "MCMC still averages after mixing"
          }
        ],
        "answer": "The estimate is $2$."
      },
      {
        "problem": "A two-state chain has transition matrix $\\begin{bmatrix}0.7&0.3\\0.2&0.8\\end{bmatrix}$. Solve stationary $\\pi_1$.",
        "steps": [
          {
            "do": "Use balance into state 1",
            "result": "$\\pi_1=0.7\\pi_1+0.2\\pi_2$",
            "why": "stationarity means next mass equals current mass"
          },
          {
            "do": "Use normalization",
            "result": "$\\pi_2=1-\\pi_1$",
            "why": "two probabilities sum to one"
          },
          {
            "do": "Substitute",
            "result": "$\\pi_1=0.7\\pi_1+0.2(1-\\pi_1)$",
            "why": "one unknown"
          },
          {
            "do": "Simplify",
            "result": "$\\pi_1=0.5\\pi_1+0.2$",
            "why": "combine terms"
          },
          {
            "do": "Solve",
            "result": "$0.5\\pi_1=0.2$, so $\\pi_1=0.4$",
            "why": "divide by 0.5"
          }
        ],
        "answer": "The stationary distribution is $(0.4,0.6)$."
      },
      {
        "problem": "If burn-in is 100 and total chain length is 600, how many samples remain and what fraction is discarded?",
        "steps": [
          {
            "do": "Subtract burn-in",
            "result": "$600-100=500$",
            "why": "discard early samples"
          },
          {
            "do": "Compute discarded fraction",
            "result": "$100/600$",
            "why": "burn-in divided by total"
          },
          {
            "do": "Simplify",
            "result": "$1/6\\approx0.167$",
            "why": "divide numerator and denominator by 100"
          },
          {
            "do": "Convert to percent",
            "result": "$16.7\\%$",
            "why": "fraction as percent"
          },
          {
            "do": "State retained fraction",
            "result": "$83.3\\%$",
            "why": "the rest is used"
          }
        ],
        "answer": "Retain $500$ samples and discard about $16.7\\%$."
      },
      {
        "problem": "An MCMC classifier has sampled probabilities $0.61,0.64,0.59,0.66$. Estimate posterior mean probability and standard deviation roughly using squared deviations sum $0.0026$.",
        "steps": [
          {
            "do": "Average samples",
            "result": "$(0.61+0.64+0.59+0.66)/4=0.625$",
            "why": "posterior mean is sample average"
          },
          {
            "do": "Use squared deviations sum",
            "result": "$0.0026$",
            "why": "given for efficiency"
          },
          {
            "do": "Compute sample variance",
            "result": "$0.0026/(4-1)\\approx0.000867$",
            "why": "divide by $n-1$"
          },
          {
            "do": "Take square root",
            "result": "$\\sqrt{0.000867}\\approx0.029$",
            "why": "posterior spread"
          },
          {
            "do": "Interpret",
            "result": "probability is about $0.625\\pm0.029$",
            "why": "samples show uncertainty"
          }
        ],
        "answer": "Posterior mean is $0.625$ with sample standard deviation about $0.029$."
      }
    ],
    "applications": [
      {
        "title": "Bayesian inference",
        "background": "MCMC made complex Bayesian models practical by sampling from posteriors without closed-form normalization.",
        "numbers": "Posterior parameter samples $1.0,1.2,0.9,1.1$ average to $1.05$."
      },
      {
        "title": "Gibbs sampling",
        "background": "Gibbs sampling updates one variable at a time from conditional distributions, useful when full joint sampling is hard.",
        "numbers": "If $P(Z=1\\mid X)=0.7$, a uniform draw $0.4$ sets $Z=1$."
      },
      {
        "title": "Hamiltonian Monte Carlo",
        "background": "Modern probabilistic programming often uses gradient-informed proposals to move efficiently through high-dimensional posteriors.",
        "numbers": "A step size $0.1$ for $20$ leapfrog steps simulates a path length $2.0$."
      },
      {
        "title": "Topic models",
        "background": "Latent-variable text models used MCMC to infer hidden topic assignments before variational methods became common.",
        "numbers": "If a word's topic counts are $3$ and $7$, normalized probabilities are $0.3$ and $0.7$."
      },
      {
        "title": "Uncertainty in ML",
        "background": "Sampling multiple plausible parameters gives uncertainty bands around predictions.",
        "numbers": "Predictions $4.8,5.1,5.0,5.3$ average to $5.05$."
      },
      {
        "title": "Diagnostics",
        "background": "Effective sample size accounts for autocorrelation, because correlated draws contain less information.",
        "numbers": "If $1000$ chain draws behave like $250$ independent draws, standard error is twice what $1000$ independent draws would suggest."
      }
    ],
    "applicationsClose": "MCMC is Monte Carlo with memory, carefully designed so the memory settles into the distribution we wanted all along.",
    "takeaways": [
      "MCMC uses a Markov chain to sample from a target distribution.",
      "Metropolis-Hastings accepts proposals using a ratio that preserves stationarity.",
      "Burn-in and mixing matter because early states remember initialization.",
      "Chain averages estimate expectations, but autocorrelation reduces effective information."
    ]
  },
  "math-19-19": {
    "id": "math-19-19",
    "title": "Markov Decision Processes (RL)",
    "tagline": "An MDP models sequential decisions where the next state depends on the current state and action, not the whole past.",
    "connections": {
      "buildsOn": [
        "Markov Chain Monte Carlo (MCMC)",
        "conditional probability",
        "expected value"
      ],
      "leadsTo": [
        "Autoregressive (AR) models",
        "dynamic programming",
        "reinforcement learning"
      ],
      "usedWith": [
        "Bellman equations",
        "Markov property",
        "discounted sums",
        "policies"
      ]
    },
    "motivation": "<p>You already know a single decision can have a reward. Reinforcement learning studies a chain of decisions, where each action changes what choices and rewards come next.</p><p>A <b>Markov Decision Process</b> is the clean mathematical table for that story: states, actions, transition probabilities, rewards, and a discount factor that values near rewards more than distant ones.</p>",
    "definition": "<p>An MDP consists of states $s$, actions $a$, transition probabilities $P(s'\\mid s,a)$, rewards $R(s,a,s')$, and discount $\\gamma\\in[0,1)$. A policy $\\pi(a\\mid s)$ chooses actions. The value function satisfies the Bellman equation $$V^\\pi(s)=E_\\pi[R_{t+1}+\\gamma V^\\pi(S_{t+1})\\mid S_t=s].$$</p><p>The Markov property says the conditional distribution of the next state depends on the present state and action, not the full history. The Bellman equation works because total future return can be split into immediate reward plus discounted value of the next state.</p><p><b>Assumptions that matter:</b> the state must contain enough information for the Markov property, rewards and transitions are defined by the environment, and $\\gamma<1$ keeps infinite-horizon discounted returns finite under bounded rewards.</p>",
    "worked": {
      "problem": "A state has two possible next states after an action: reward $5$ then value $10$ with probability $0.7$, and reward $1$ then value $4$ with probability $0.3$. With $\\gamma=0.9$, compute the action value.",
      "skills": [
        "Bellman expectation",
        "discounting",
        "weighted averages"
      ],
      "strategy": "Compute reward plus discounted next value in each branch, then average by transition probability.",
      "steps": [
        {
          "do": "Compute the first branch return",
          "result": "$5+0.9\\cdot10=14$",
          "why": "immediate reward plus discounted next value"
        },
        {
          "do": "Compute the second branch return",
          "result": "$1+0.9\\cdot4=4.6$",
          "why": "same Bellman form"
        },
        {
          "do": "Weight the first branch",
          "result": "$0.7\\cdot14=9.8$",
          "why": "multiply by probability"
        },
        {
          "do": "Weight the second branch",
          "result": "$0.3\\cdot4.6=1.38$",
          "why": "multiply by probability"
        },
        {
          "do": "Add weighted returns",
          "result": "$9.8+1.38=11.18$",
          "why": "expectation sums probability-weighted outcomes"
        }
      ],
      "verify": "The value lies between $4.6$ and $14$, closer to $14$ because that branch is more likely.",
      "answer": "The action value is $11.18$.",
      "connects": "The Bellman equation turns a sequential future into one-step arithmetic."
    },
    "practice": [
      {
        "problem": "Compute discounted return for rewards $2,2,2$ with $\\gamma=0.5$.",
        "steps": [
          {
            "do": "Write return",
            "result": "$2+0.5\\cdot2+0.5^2\\cdot2$",
            "why": "discount later rewards"
          },
          {
            "do": "Compute second term",
            "result": "$1$",
            "why": "$0.5\\cdot2=1$"
          },
          {
            "do": "Compute third term",
            "result": "$0.5$",
            "why": "$0.25\\cdot2=0.5$"
          },
          {
            "do": "Add",
            "result": "$2+1+0.5=3.5$",
            "why": "sum discounted rewards"
          },
          {
            "do": "Interpret",
            "result": "later rewards count less",
            "why": "discounting favors earlier reward"
          }
        ],
        "answer": "The return is $3.5$."
      },
      {
        "problem": "An action gives $+10$ with probability $0.2$ and $-2$ with probability $0.8$. Find expected immediate reward.",
        "steps": [
          {
            "do": "Weight the positive reward",
            "result": "$0.2\\cdot10=2$",
            "why": "probability times reward"
          },
          {
            "do": "Weight the negative reward",
            "result": "$0.8\\cdot(-2)=-1.6$",
            "why": "include the sign"
          },
          {
            "do": "Add",
            "result": "$2-1.6=0.4$",
            "why": "expected reward sums weighted outcomes"
          },
          {
            "do": "State expectation",
            "result": "$0.4$",
            "why": "positive but small"
          },
          {
            "do": "Interpret risk",
            "result": "rare high reward offsets common small loss",
            "why": "expectation averages outcomes"
          }
        ],
        "answer": "Expected immediate reward is $0.4$."
      },
      {
        "problem": "If $V(s')=8$, reward is $3$, and $\\gamma=0.75$, compute one deterministic Bellman backup.",
        "steps": [
          {
            "do": "Write backup",
            "result": "$3+0.75V(s')$",
            "why": "deterministic next state"
          },
          {
            "do": "Substitute value",
            "result": "$3+0.75\\cdot8$",
            "why": "use next-state value"
          },
          {
            "do": "Multiply",
            "result": "$0.75\\cdot8=6$",
            "why": "discounted future value"
          },
          {
            "do": "Add",
            "result": "$3+6=9$",
            "why": "immediate plus future"
          },
          {
            "do": "State backed-up value",
            "result": "$9$",
            "why": "new estimate from one step"
          }
        ],
        "answer": "The backup value is $9$."
      },
      {
        "problem": "For Q-values $Q(s,a_1)=4$ and $Q(s,a_2)=7$, what action is greedy and what is the softmax probability of $a_2$ using weights $e^4\\approx54.6$, $e^7\\approx1096.6$?",
        "steps": [
          {
            "do": "Choose greedy action",
            "result": "$a_2$",
            "why": "it has larger Q-value"
          },
          {
            "do": "Add softmax weights",
            "result": "$54.6+1096.6=1151.2$",
            "why": "normalize exponentials"
          },
          {
            "do": "Select $a_2$ weight",
            "result": "$1096.6$",
            "why": "this corresponds to the larger Q-value"
          },
          {
            "do": "Divide",
            "result": "$1096.6/1151.2\\approx0.953$",
            "why": "softmax probability"
          },
          {
            "do": "Interpret",
            "result": "mostly chooses $a_2$",
            "why": "large value gap creates high probability"
          }
        ],
        "answer": "Greedy action is $a_2$; softmax probability is about $0.953$."
      },
      {
        "problem": "A Q-learning update uses $Q=5$, reward $1$, next max $8$, $\\gamma=0.9$, learning rate $0.2$. Compute the new Q.",
        "steps": [
          {
            "do": "Compute target",
            "result": "$1+0.9\\cdot8=8.2$",
            "why": "reward plus discounted next max"
          },
          {
            "do": "Compute temporal-difference error",
            "result": "$8.2-5=3.2$",
            "why": "target minus old estimate"
          },
          {
            "do": "Scale by learning rate",
            "result": "$0.2\\cdot3.2=0.64$",
            "why": "partial update"
          },
          {
            "do": "Add to old Q",
            "result": "$5+0.64=5.64$",
            "why": "move toward target"
          },
          {
            "do": "Interpret",
            "result": "estimate increases",
            "why": "target is above old value"
          }
        ],
        "answer": "The new Q-value is $5.64$."
      }
    ],
    "applications": [
      {
        "title": "Game playing",
        "background": "MDPs model games when the board state contains all relevant information for future play.",
        "numbers": "If winning gives $1$ after three moves with $\\gamma=0.9$, present value is $0.9^3=0.729$."
      },
      {
        "title": "Robotics",
        "background": "A robot chooses actions under uncertain transitions, such as wheels slipping or sensors being noisy.",
        "numbers": "Move-forward success $0.8$ for reward $5$ and slip reward $-1$ gives expected reward $0.8(5)+0.2(-1)=3.8$."
      },
      {
        "title": "Inventory control",
        "background": "Sequential stock decisions balance holding costs against stockout penalties.",
        "numbers": "Ordering costs $2$ but prevents an expected stockout cost $7$ with probability $0.5$, giving expected benefit $3.5-2=1.5$."
      },
      {
        "title": "Recommendation systems",
        "background": "A recommender's action can affect future user state, not just immediate clicks.",
        "numbers": "A click reward $1$ now plus future value $4$ at $\\gamma=0.8$ gives backed-up value $4.2$."
      },
      {
        "title": "Dynamic programming",
        "background": "Value iteration repeatedly applies Bellman backups until values stabilize.",
        "numbers": "If old value is $6$ and backup is $6.3$, the update change is $0.3$."
      },
      {
        "title": "Exploration strategies",
        "background": "Policies such as epsilon-greedy deliberately try non-greedy actions to learn transitions and rewards.",
        "numbers": "With $4$ actions and $\\epsilon=0.2$, each random action gets probability $0.2/4=0.05$ plus any greedy mass."
      }
    ],
    "applicationsClose": "MDPs make sequential choice computable by compressing the future into state values and one-step backups.",
    "takeaways": [
      "An MDP has states, actions, transitions, rewards, and a discount factor.",
      "The Markov property requires the current state to contain the relevant past.",
      "Bellman equations split return into immediate reward plus discounted next value.",
      "RL algorithms estimate or optimize these values from data and interaction."
    ]
  },
  "math-19-20": {
    "id": "math-19-20",
    "title": "Autoregressive (AR) models",
    "tagline": "An AR model predicts the next value from previous values plus new random shock.",
    "connections": {
      "buildsOn": [
        "Markov Decision Processes (RL)",
        "time series",
        "linear recurrence"
      ],
      "leadsTo": [
        "Moving-average (MA) models",
        "ARMA and ARIMA models",
        "forecasting"
      ],
      "usedWith": [
        "stationarity",
        "lag operators",
        "white noise",
        "linear prediction"
      ]
    },
    "motivation": "<p>You already make informal forecasts from recent history: if traffic has been rising every morning, tomorrow may be high too. Autoregressive models turn that instinct into a linear equation.</p><p>An <b>AR</b> model says the present value depends on its own past values and a fresh unpredictable shock. It is one of the simplest bridges from stochastic processes to time-series forecasting.</p>",
    "definition": "<p>An AR(1) model has form $X_t=c+\\phi X_{t-1}+\\varepsilon_t$, where $c$ is an intercept, $\\phi$ is the autoregressive coefficient, and $\\varepsilon_t$ is white-noise shock with mean zero. More generally, AR($p$) uses $p$ lags.</p><p>For AR(1), stationarity requires $|\\phi|<1$. Then the mean $\\mu$ satisfies $\\mu=c+\\phi\\mu$, so $\\mu=c/(1-\\phi)$. Shocks fade geometrically because a shock one period ago is multiplied by $\\phi$, two periods ago by $\\phi^2$, and so on.</p><p><b>Assumptions that matter:</b> shocks are usually taken as uncorrelated with constant variance, coefficients are fixed over time, and stationarity formulas require the roots to be stable, especially $|\\phi|<1$ for AR(1).</p>",
    "worked": {
      "problem": "For $X_t=2+0.6X_{t-1}+\\varepsilon_t$, find the stationary mean and one-step forecast when $X_t=10$.",
      "skills": [
        "AR(1) mean",
        "forecasting",
        "stationarity"
      ],
      "strategy": "Use the fixed-mean equation for the long-run mean and the conditional expectation for the forecast.",
      "steps": [
        {
          "do": "Write the mean equation",
          "result": "$\\mu=2+0.6\\mu$",
          "why": "in stationarity, $E[X_t]=E[X_{t-1}]=\\mu$"
        },
        {
          "do": "Move the lag term",
          "result": "$0.4\\mu=2$",
          "why": "subtract $0.6\\mu$ from both sides"
        },
        {
          "do": "Solve for mean",
          "result": "$\\mu=5$",
          "why": "divide by 0.4"
        },
        {
          "do": "Write the forecast",
          "result": "$E[X_{t+1}\\mid X_t=10]=2+0.6\\cdot10$",
          "why": "future shock has mean zero"
        },
        {
          "do": "Compute forecast",
          "result": "$8$",
          "why": "two plus six"
        }
      ],
      "verify": "The forecast 8 is between the current value 10 and long-run mean 5, showing mean reversion.",
      "answer": "Stationary mean is $5$; one-step forecast is $8$.",
      "connects": "AR models forecast by carrying forward a weighted memory of the present."
    },
    "practice": [
      {
        "problem": "For $X_t=0.5X_{t-1}+\\varepsilon_t$, forecast $X_{t+1}$ when $X_t=6$.",
        "steps": [
          {
            "do": "Use conditional expectation",
            "result": "$E[\\varepsilon_{t+1}]=0$",
            "why": "future shock averages to zero"
          },
          {
            "do": "Write forecast",
            "result": "$0.5X_t$",
            "why": "no intercept"
          },
          {
            "do": "Substitute",
            "result": "$0.5\\cdot6$",
            "why": "use current value"
          },
          {
            "do": "Compute",
            "result": "$3$",
            "why": "half of six"
          },
          {
            "do": "Interpret",
            "result": "forecast moves toward zero",
            "why": "coefficient less than one shrinks deviations"
          }
        ],
        "answer": "Forecast is $3$."
      },
      {
        "problem": "Find the stationary mean of $X_t=1+0.8X_{t-1}+\\varepsilon_t$.",
        "steps": [
          {
            "do": "Set means equal",
            "result": "$\\mu=1+0.8\\mu$",
            "why": "stationarity means same mean each time"
          },
          {
            "do": "Subtract",
            "result": "$0.2\\mu=1$",
            "why": "move $0.8\\mu$ left"
          },
          {
            "do": "Divide",
            "result": "$\\mu=5$",
            "why": "one divided by 0.2"
          },
          {
            "do": "Check stability",
            "result": "$|0.8|<1$",
            "why": "stationary mean formula is valid"
          },
          {
            "do": "State result",
            "result": "$5$",
            "why": "long-run average"
          }
        ],
        "answer": "Stationary mean is $5$."
      },
      {
        "problem": "Is AR(1) with $\\phi=1.05$ stationary?",
        "steps": [
          {
            "do": "Recall condition",
            "result": "$|\\phi|<1$",
            "why": "AR(1) stationarity condition"
          },
          {
            "do": "Compute absolute value",
            "result": "$|1.05|=1.05$",
            "why": "coefficient is positive"
          },
          {
            "do": "Compare",
            "result": "$1.05>1$",
            "why": "condition fails"
          },
          {
            "do": "Interpret shocks",
            "result": "shocks grow rather than fade",
            "why": "powers of 1.05 increase"
          },
          {
            "do": "Classify",
            "result": "not stationary",
            "why": "stable mean reversion is absent"
          }
        ],
        "answer": "No. It is not stationary."
      },
      {
        "problem": "For $X_t=3+0.4X_{t-1}+\\varepsilon_t$, compute two-step forecast from $X_t=5$.",
        "steps": [
          {
            "do": "One-step forecast",
            "result": "$3+0.4\\cdot5=5$",
            "why": "future shock mean is zero"
          },
          {
            "do": "Use forecast as next expected value",
            "result": "$E[X_{t+2}\\mid X_t]=3+0.4E[X_{t+1}\\mid X_t]$",
            "why": "iterate conditional expectation"
          },
          {
            "do": "Substitute",
            "result": "$3+0.4\\cdot5$",
            "why": "use the one-step forecast"
          },
          {
            "do": "Compute",
            "result": "$5$",
            "why": "the value is at long-run mean"
          },
          {
            "do": "Check mean",
            "result": "$3/(1-0.4)=5$",
            "why": "starting at mean keeps forecast at mean"
          }
        ],
        "answer": "The two-step forecast is $5$."
      },
      {
        "problem": "An AR model for standardized demand is $X_t=0.7X_{t-1}+\\varepsilon_t$. If a shock of $2$ occurs at time $t$, what is its expected contribution after 3 more periods?",
        "steps": [
          {
            "do": "Write shock decay",
            "result": "$2\\cdot0.7^3$",
            "why": "AR(1) memory decays by powers of $\\phi$"
          },
          {
            "do": "Compute square",
            "result": "$0.7^2=0.49$",
            "why": "first two periods"
          },
          {
            "do": "Compute cube",
            "result": "$0.49\\cdot0.7=0.343$",
            "why": "third period"
          },
          {
            "do": "Multiply by shock",
            "result": "$2\\cdot0.343=0.686$",
            "why": "remaining contribution"
          },
          {
            "do": "Interpret",
            "result": "most but not all impact has faded",
            "why": "coefficient below one creates geometric decay"
          }
        ],
        "answer": "Expected contribution after 3 periods is $0.686$."
      }
    ],
    "applications": [
      {
        "title": "Demand forecasting",
        "background": "Retail forecasts often use yesterday's demand to predict today's demand because habits and seasonality create persistence.",
        "numbers": "With $X_t=20+0.5X_{t-1}$ and yesterday $40$, forecast is $40$."
      },
      {
        "title": "Temperature anomalies",
        "background": "Weather deviations can persist but usually mean-revert, matching stable AR behavior.",
        "numbers": "If anomaly is $3$ and $\\phi=0.6$, next expected anomaly is $1.8$."
      },
      {
        "title": "Finance returns",
        "background": "Raw returns often have weak autocorrelation, but some transformed series can show AR structure.",
        "numbers": "An AR coefficient $0.1$ makes a $2\\%$ return contribute $0.2\\%$ to next expected return."
      },
      {
        "title": "Monitoring metrics",
        "background": "Service latency or error-rate deviations may persist from one interval to the next.",
        "numbers": "If standardized latency is $4$ and $\\phi=0.75$, next forecast is $3$."
      },
      {
        "title": "Feature engineering",
        "background": "Lagged values are common predictors in ML time-series models and AR is the linear baseline.",
        "numbers": "Features $X_t=10$ and $X_{t-1}=8$ in an AR(2) with weights $0.5,0.2$ give forecast $6.6$."
      },
      {
        "title": "Mean reversion",
        "background": "Stable AR models quantify how quickly a series returns toward its average.",
        "numbers": "With $\\phi=0.5$, a deviation of $8$ shrinks in expectation to $4$, then $2$, then $1$."
      }
    ],
    "applicationsClose": "AR models are small equations with a large idea: the past predicts the present, but stable memory fades.",
    "takeaways": [
      "AR models regress a series on its own lagged values.",
      "For AR(1), stationarity requires $|\\phi|<1$.",
      "The stationary mean is $c/(1-\\phi)$ when stable.",
      "Forecasts use zero mean for future shocks and propagate lagged values forward."
    ]
  },
  "math-19-21": {
    "id": "math-19-21",
    "title": "Moving-average (MA) models",
    "tagline": "An MA model represents a time series as current and past shocks with finite memory.",
    "connections": {
      "buildsOn": [
        "Autoregressive (AR) models",
        "white noise",
        "linear combinations"
      ],
      "leadsTo": [
        "ARMA and ARIMA models",
        "forecast error models",
        "time-series diagnostics"
      ],
      "usedWith": [
        "autocovariance",
        "white noise",
        "lag operators",
        "forecast errors"
      ]
    },
    "motivation": "<p>You already know a surprise can echo for a while. If a website outage happens now, metrics may remain affected for the next few measurements even after the original shock is gone.</p><p>A <b>moving-average</b> model describes a series as a weighted sum of recent random shocks. Unlike AR memory, MA memory cuts off after a fixed number of lags.</p>",
    "definition": "<p>An MA(1) model has form $X_t=\\mu+\\varepsilon_t+\\theta\\varepsilon_{t-1}$, where $\\varepsilon_t$ is white noise with mean zero and variance $\\sigma^2$. An MA($q$) model uses shocks back to $q$ lags.</p><p>The mean is $E[X_t]=\\mu$ because each shock has mean zero. For MA(1), the variance is $(1+\\theta^2)\\sigma^2$ and lag-1 covariance is $\\theta\\sigma^2$. Lags beyond 1 have covariance zero because no shared shock remains.</p><p><b>Assumptions that matter:</b> shocks are white noise, the coefficients are fixed, and invertibility conditions are often imposed so the model has a unique shock representation.</p>",
    "worked": {
      "problem": "For $X_t=10+\\varepsilon_t+0.5\\varepsilon_{t-1}$ with shock variance $4$, find mean, variance, and lag-1 covariance.",
      "skills": [
        "MA(1)",
        "variance",
        "autocovariance"
      ],
      "strategy": "Use zero shock means, then add variances and shared-shock covariance.",
      "steps": [
        {
          "do": "Compute the mean",
          "result": "$E[X_t]=10+0+0=10$",
          "why": "white-noise shocks have mean zero"
        },
        {
          "do": "Write the variance",
          "result": "$\\operatorname{Var}(X_t)=\\operatorname{Var}(\\varepsilon_t)+0.5^2\\operatorname{Var}(\\varepsilon_{t-1})$",
          "why": "independent shocks have no cross term"
        },
        {
          "do": "Substitute shock variance",
          "result": "$4+0.25\\cdot4$",
          "why": "each shock has variance 4"
        },
        {
          "do": "Simplify variance",
          "result": "$5$",
          "why": "four plus one"
        },
        {
          "do": "Compute lag-1 covariance",
          "result": "$\\operatorname{Cov}(X_t,X_{t-1})=0.5\\sigma^2=2$",
          "why": "the two times share $\\varepsilon_{t-1}$"
        }
      ],
      "verify": "Variance exceeds the shock variance because the previous shock also contributes.",
      "answer": "Mean $10$, variance $5$, lag-1 covariance $2$.",
      "connects": "MA models are easiest to read by tracking which shocks are shared."
    },
    "practice": [
      {
        "problem": "For $X_t=\\varepsilon_t-0.3\\varepsilon_{t-1}$ with $\\sigma^2=9$, find variance.",
        "steps": [
          {
            "do": "Write variance formula",
            "result": "$(1+\\theta^2)\\sigma^2$",
            "why": "MA(1) variance"
          },
          {
            "do": "Substitute $\\theta=-0.3$",
            "result": "$(1+0.09)9$",
            "why": "square removes the sign"
          },
          {
            "do": "Add",
            "result": "$1.09\\cdot9$",
            "why": "combine terms"
          },
          {
            "do": "Multiply",
            "result": "$9.81$",
            "why": "variance value"
          },
          {
            "do": "Interpret",
            "result": "previous shock increases variance",
            "why": "extra shock term adds variability"
          }
        ],
        "answer": "Variance is $9.81$."
      },
      {
        "problem": "Find lag-1 covariance for MA(1) with $\\theta=-0.3$ and $\\sigma^2=9$.",
        "steps": [
          {
            "do": "Use formula",
            "result": "$\\gamma_1=\\theta\\sigma^2$",
            "why": "shared shock coefficient"
          },
          {
            "do": "Substitute",
            "result": "$-0.3\\cdot9$",
            "why": "coefficient times shock variance"
          },
          {
            "do": "Multiply",
            "result": "$-2.7$",
            "why": "negative coefficient gives negative covariance"
          },
          {
            "do": "State sign",
            "result": "negative",
            "why": "adjacent values tend to move oppositely"
          },
          {
            "do": "Note cutoff",
            "result": "lag 2 covariance is $0$",
            "why": "MA(1) has no shared shock beyond one lag"
          }
        ],
        "answer": "Lag-1 covariance is $-2.7$."
      },
      {
        "problem": "If shocks are $\\varepsilon_3=2$ and $\\varepsilon_2=-1$, compute $X_3=5+\\varepsilon_3+0.4\\varepsilon_2$.",
        "steps": [
          {
            "do": "Write formula",
            "result": "$X_3=5+2+0.4(-1)$",
            "why": "substitute shocks"
          },
          {
            "do": "Multiply lagged shock",
            "result": "$0.4(-1)=-0.4$",
            "why": "previous shock contribution"
          },
          {
            "do": "Add current pieces",
            "result": "$5+2=7$",
            "why": "constant plus current shock"
          },
          {
            "do": "Combine",
            "result": "$7-0.4=6.6$",
            "why": "final value"
          },
          {
            "do": "Interpret",
            "result": "negative previous shock lowers the value",
            "why": "coefficient is positive"
          }
        ],
        "answer": "$X_3=6.6$."
      },
      {
        "problem": "For an MA(2), $X_t=\\varepsilon_t+0.5\\varepsilon_{t-1}+0.2\\varepsilon_{t-2}$ with $\\sigma^2=1$, find variance.",
        "steps": [
          {
            "do": "Square coefficients",
            "result": "$1^2,0.5^2,0.2^2$",
            "why": "independent shocks add variances"
          },
          {
            "do": "Compute squares",
            "result": "$1,0.25,0.04$",
            "why": "coefficient squares"
          },
          {
            "do": "Add",
            "result": "$1+0.25+0.04=1.29$",
            "why": "sum variance weights"
          },
          {
            "do": "Multiply by shock variance",
            "result": "$1.29\\cdot1=1.29$",
            "why": "shock variance is one"
          },
          {
            "do": "State result",
            "result": "$1.29$",
            "why": "total variance"
          }
        ],
        "answer": "Variance is $1.29$."
      },
      {
        "problem": "A one-step forecast for MA(1) after observing shock $\\varepsilon_t=1.5$ uses $E[X_{t+1}\\mid\\varepsilon_t]=\\mu+\\theta\\varepsilon_t$. With $\\mu=4$, $\\theta=0.6$, compute it.",
        "steps": [
          {
            "do": "Write forecast",
            "result": "$4+0.6\\cdot1.5$",
            "why": "future new shock has mean zero"
          },
          {
            "do": "Multiply",
            "result": "$0.6\\cdot1.5=0.9$",
            "why": "lagged known shock contribution"
          },
          {
            "do": "Add",
            "result": "$4+0.9=4.9$",
            "why": "forecast value"
          },
          {
            "do": "Explain memory",
            "result": "only current shock affects next forecast",
            "why": "MA(1) has one-period memory"
          },
          {
            "do": "State result",
            "result": "$4.9$",
            "why": "conditional expectation"
          }
        ],
        "answer": "The forecast is $4.9$."
      }
    ],
    "applications": [
      {
        "title": "Forecast errors",
        "background": "MA models were built to describe serial correlation in forecast errors after trends are removed.",
        "numbers": "If today's shock is $2$ and $\\theta=0.5$, it adds $1$ to tomorrow's expected value."
      },
      {
        "title": "Signal processing",
        "background": "Finite impulse response filters are MA models under another name, weighting recent noise or signal samples.",
        "numbers": "Filter weights $0.5,0.3,0.2$ on inputs $10,8,5$ give output $8.4$."
      },
      {
        "title": "Quality control",
        "background": "A production disturbance can affect several consecutive measurements before disappearing.",
        "numbers": "Shock $6$ with coefficient $0.25$ leaves contribution $1.5$ one period later."
      },
      {
        "title": "Econometrics",
        "background": "MA terms often model short-lived policy or measurement shocks in economic data.",
        "numbers": "If shock variance is $16$ and $\\theta=0.5$, MA(1) variance is $20$."
      },
      {
        "title": "Residual diagnostics",
        "background": "Autocorrelation cutting off after lag $q$ suggests an MA($q$) pattern.",
        "numbers": "If sample autocorrelations are $0.4$ at lag 1 and near $0$ at lags 2 and 3, MA(1) is plausible."
      },
      {
        "title": "ML time-series baselines",
        "background": "Simple MA models are interpretable baselines before fitting larger sequence models.",
        "numbers": "A two-shock model $\\varepsilon_t+0.7\\varepsilon_{t-1}$ with shocks $1$ and $-2$ gives $-0.4$."
      }
    ],
    "applicationsClose": "MA models teach a clean lesson: some randomness has a short echo, and then it is gone.",
    "takeaways": [
      "MA models are weighted sums of current and past white-noise shocks.",
      "MA(1) mean is $\\mu$ and variance is $(1+\\theta^2)\\sigma^2$.",
      "Autocovariance cuts off after the MA order.",
      "Forecasting requires knowing or estimating recent shocks."
    ]
  },
  "math-19-22": {
    "id": "math-19-22",
    "title": "ARMA and ARIMA models",
    "tagline": "ARMA combines lagged values and lagged shocks; ARIMA adds differencing for nonstationary series.",
    "connections": {
      "buildsOn": [
        "Moving-average (MA) models",
        "Autoregressive (AR) models",
        "stationarity"
      ],
      "leadsTo": [
        "Hidden Markov Models",
        "forecasting pipelines",
        "seasonal time series"
      ],
      "usedWith": [
        "differencing",
        "lag polynomials",
        "white noise",
        "stationarity"
      ]
    },
    "motivation": "<p>You have seen two kinds of memory: AR models remember past values, and MA models remember past shocks. Many real series need both.</p><p><b>ARMA</b> models combine those memories for stationary series. <b>ARIMA</b> adds differencing first, so a wandering nonstationary series can be modeled through its changes.</p>",
    "definition": "<p>An ARMA(1,1) model can be written $X_t=c+\\phi X_{t-1}+\\varepsilon_t+\\theta\\varepsilon_{t-1}$. ARIMA($p,d,q$) means the $d$-times differenced series is modeled as ARMA($p,q$). The first difference is $\\Delta X_t=X_t-X_{t-1}$.</p><p>Differencing removes certain trends because a random walk $X_t=X_{t-1}+\\varepsilon_t$ becomes $\\Delta X_t=\\varepsilon_t$, which is stationary white noise. ARMA then models remaining stable dependence.</p><p><b>Assumptions that matter:</b> ARMA formulas assume stationarity after any differencing, shocks are usually white noise, and overdifferencing can create unnecessary negative dependence.</p>",
    "worked": {
      "problem": "For $X_t=1+0.5X_{t-1}+\\varepsilon_t+0.4\\varepsilon_{t-1}$, compute the one-step forecast given $X_t=6$ and $\\varepsilon_t=2$.",
      "skills": [
        "ARMA forecast",
        "conditional expectation",
        "lagged shocks"
      ],
      "strategy": "Future innovation has mean zero, but the current value and current shock both affect the next forecast.",
      "steps": [
        {
          "do": "Write next equation",
          "result": "$X_{t+1}=1+0.5X_t+\\varepsilon_{t+1}+0.4\\varepsilon_t$",
          "why": "shift the model one step forward"
        },
        {
          "do": "Take conditional expectation",
          "result": "$E[\\varepsilon_{t+1}]=0$",
          "why": "future shock is unpredictable"
        },
        {
          "do": "Substitute known values",
          "result": "$1+0.5\\cdot6+0.4\\cdot2$",
          "why": "use current value and current shock"
        },
        {
          "do": "Multiply",
          "result": "$1+3+0.8$",
          "why": "compute weighted terms"
        },
        {
          "do": "Add",
          "result": "$4.8$",
          "why": "forecast value"
        }
      ],
      "verify": "The forecast includes both persistence from $X_t$ and short-lived shock memory from $\\varepsilon_t$.",
      "answer": "The one-step forecast is $4.8$.",
      "connects": "ARMA forecasting keeps two ledgers: past values and past surprises."
    },
    "practice": [
      {
        "problem": "Compute first differences for $X_0=10$, $X_1=13$, $X_2=15$.",
        "steps": [
          {
            "do": "Compute first difference",
            "result": "$\\Delta X_1=13-10=3$",
            "why": "subtract previous value"
          },
          {
            "do": "Compute second difference",
            "result": "$\\Delta X_2=15-13=2$",
            "why": "same operation at next time"
          },
          {
            "do": "List differenced series",
            "result": "$3,2$",
            "why": "these are changes"
          },
          {
            "do": "Interpret",
            "result": "levels rose by 3 then 2",
            "why": "differencing focuses on increments"
          },
          {
            "do": "Connect to ARIMA",
            "result": "$d=1$ models these changes",
            "why": "ARIMA uses differenced data"
          }
        ],
        "answer": "The first differences are $3$ and $2$."
      },
      {
        "problem": "A random walk $X_t=X_{t-1}+\\varepsilon_t$ has $X_{t-1}=7$ and $\\varepsilon_t=-2$. Find $X_t$ and $\\Delta X_t$.",
        "steps": [
          {
            "do": "Compute level",
            "result": "$X_t=7-2=5$",
            "why": "add the shock to previous level"
          },
          {
            "do": "Write difference",
            "result": "$\\Delta X_t=X_t-X_{t-1}$",
            "why": "definition of first difference"
          },
          {
            "do": "Substitute",
            "result": "$5-7=-2$",
            "why": "use computed level"
          },
          {
            "do": "Compare to shock",
            "result": "$\\Delta X_t=\\varepsilon_t$",
            "why": "random walk differencing reveals shocks"
          },
          {
            "do": "Interpret",
            "result": "differenced series is stationary if shocks are",
            "why": "this motivates ARIMA"
          }
        ],
        "answer": "$X_t=5$ and $\\Delta X_t=-2$."
      },
      {
        "problem": "For ARMA(1,1) with $c=0$, $\\phi=0.7$, $\\theta=-0.2$, $X_t=4$, $\\varepsilon_t=1$, forecast $X_{t+1}$.",
        "steps": [
          {
            "do": "Write forecast",
            "result": "$0.7X_t-0.2\\varepsilon_t$",
            "why": "future shock has mean zero"
          },
          {
            "do": "Substitute",
            "result": "$0.7\\cdot4-0.2\\cdot1$",
            "why": "known current terms"
          },
          {
            "do": "Multiply",
            "result": "$2.8-0.2$",
            "why": "weighted value and shock"
          },
          {
            "do": "Add",
            "result": "$2.6$",
            "why": "forecast"
          },
          {
            "do": "Interpret sign",
            "result": "positive shock lowers next value through negative MA coefficient",
            "why": "the MA coefficient is negative"
          }
        ],
        "answer": "Forecast is $2.6$."
      },
      {
        "problem": "An ARIMA(0,1,0) with drift $0.5$ has $X_t=20$. Forecast $X_{t+3}$.",
        "steps": [
          {
            "do": "Interpret drift",
            "result": "expected increase is $0.5$ per step",
            "why": "ARIMA(0,1,0) with drift is a random walk with mean increment"
          },
          {
            "do": "Compute three-step increase",
            "result": "$3\\cdot0.5=1.5$",
            "why": "three expected increments"
          },
          {
            "do": "Add to current level",
            "result": "$20+1.5=21.5$",
            "why": "forecast level"
          },
          {
            "do": "State forecast",
            "result": "$21.5$",
            "why": "three periods ahead"
          },
          {
            "do": "Note uncertainty",
            "result": "variance would grow with horizon",
            "why": "forecast mean is not certainty"
          }
        ],
        "answer": "The three-step forecast is $21.5$."
      },
      {
        "problem": "A model selection table gives AIC values: ARMA(1,0) $120$, ARMA(1,1) $115$, ARMA(2,1) $117$. Which is preferred by AIC?",
        "steps": [
          {
            "do": "Recall AIC rule",
            "result": "smaller is better",
            "why": "AIC balances fit and complexity"
          },
          {
            "do": "List values",
            "result": "$120,115,117$",
            "why": "compare candidates"
          },
          {
            "do": "Find minimum",
            "result": "$115$",
            "why": "lowest number"
          },
          {
            "do": "Match model",
            "result": "ARMA(1,1)",
            "why": "it has AIC 115"
          },
          {
            "do": "State preference",
            "result": "choose ARMA(1,1) by AIC",
            "why": "only according to this criterion"
          }
        ],
        "answer": "AIC prefers ARMA(1,1)."
      }
    ],
    "applications": [
      {
        "title": "Sales forecasting",
        "background": "ARIMA became a standard business forecasting tool because trends can be differenced and residual dependence modeled.",
        "numbers": "Sales $100,108,115$ give differences $8,7$, suggesting growth has slowed by $1$."
      },
      {
        "title": "Economic indicators",
        "background": "Macroeconomic levels often drift, while growth rates are more stable.",
        "numbers": "GDP index from $200$ to $206$ has growth difference $6$ before modeling dependence."
      },
      {
        "title": "Web traffic",
        "background": "Traffic can have both persistence and shock echoes after campaigns or outages.",
        "numbers": "An ARMA forecast $0.6(100)+0.3(10)=63$ combines level and shock."
      },
      {
        "title": "Anomaly detection",
        "background": "Forecast residuals from ARIMA can flag surprising observations.",
        "numbers": "If forecast is $50$ with residual standard deviation $4$, observation $61$ is $2.75$ standard deviations high."
      },
      {
        "title": "Preprocessing for ML",
        "background": "Differencing can make a nonstationary input easier for a model to learn.",
        "numbers": "Prices $10,11,13,12$ become returns $1,2,-1$."
      },
      {
        "title": "Seasonal extensions",
        "background": "Seasonal ARIMA adds seasonal differences and lags for repeated calendar patterns.",
        "numbers": "Monthly sales differenced at lag 12 compare March this year to March last year, such as $140-125=15$."
      }
    ],
    "applicationsClose": "ARMA and ARIMA are practical bookkeeping systems for persistence, short shock memory, and nonstationary trends.",
    "takeaways": [
      "ARMA combines AR lagged values with MA lagged shocks.",
      "ARIMA applies differencing before ARMA modeling.",
      "A random walk becomes white noise after first differencing.",
      "Forecasts use known lagged values and estimated recent shocks while future shocks average to zero."
    ]
  },
  "math-19-23": {
    "id": "math-19-23",
    "title": "Hidden Markov Models",
    "tagline": "An HMM has an unseen Markov chain that emits the observations we actually see.",
    "connections": {
      "buildsOn": [
        "ARMA and ARIMA models",
        "Markov chains",
        "conditional probability"
      ],
      "leadsTo": [
        "Diffusion processes as generative models",
        "state-space models",
        "sequence inference"
      ],
      "usedWith": [
        "Bayes' rule",
        "dynamic programming",
        "transition matrices",
        "emission probabilities"
      ]
    },
    "motivation": "<p>You often observe symptoms rather than causes: a user's clicks rather than intent, a word rather than the speaker's topic, a sensor reading rather than the true state. Hidden Markov Models give that situation a simple sequence structure.</p><p>An <b>HMM</b> says hidden states move as a Markov chain, and each state emits an observation according to an emission distribution. Inference means using observations to reason about hidden paths.</p>",
    "definition": "<p>An HMM has hidden states $Z_t$, observations $X_t$, transition probabilities $P(Z_t\\mid Z_{t-1})$, initial probabilities $P(Z_1)$, and emissions $P(X_t\\mid Z_t)$. The hidden process is Markov, and observations are conditionally independent given their states.</p><p>The forward algorithm works by recursively combining previous filtered probabilities with transitions, then multiplying by the likelihood of the new observation. This is dynamic programming: keep just enough summary of the past to update efficiently.</p><p><b>Assumptions that matter:</b> the Markov property applies to hidden states, emissions depend only on the current hidden state, and probabilities must be normalized at each inference step for numerical stability.</p>",
    "worked": {
      "problem": "An HMM starts with $P(Rain)=0.6$, $P(Sun)=0.4$. Umbrella emission probabilities are $P(U\\mid Rain)=0.9$, $P(U\\mid Sun)=0.2$. After observing umbrella on day 1, compute $P(Rain\\mid U)$.",
      "skills": [
        "Bayes' rule",
        "emissions",
        "filtering"
      ],
      "strategy": "Multiply prior by emission likelihood, then normalize across hidden states.",
      "steps": [
        {
          "do": "Compute unnormalized rain weight",
          "result": "$0.6\\cdot0.9=0.54$",
          "why": "prior times likelihood"
        },
        {
          "do": "Compute unnormalized sun weight",
          "result": "$0.4\\cdot0.2=0.08$",
          "why": "same calculation for sun"
        },
        {
          "do": "Compute total evidence",
          "result": "$0.54+0.08=0.62$",
          "why": "normalizing constant"
        },
        {
          "do": "Normalize rain weight",
          "result": "$0.54/0.62\\approx0.871$",
          "why": "posterior probability"
        },
        {
          "do": "Normalize sun weight",
          "result": "$0.08/0.62\\approx0.129$",
          "why": "probabilities sum to one"
        }
      ],
      "verify": "An umbrella is much more likely on rain, so the posterior rain probability rises from 0.6 to about 0.871.",
      "answer": "$P(Rain\\mid U)\\approx0.871$.",
      "connects": "HMM filtering is repeated Bayes updates with Markov transitions in between."
    },
    "practice": [
      {
        "problem": "With transition $P(R\\mid R)=0.7$, $P(R\\mid S)=0.3$ and current belief $P(R)=0.8$, predict tomorrow's rain probability.",
        "steps": [
          {
            "do": "Weight rain-to-rain",
            "result": "$0.8\\cdot0.7=0.56$",
            "why": "current rain times staying rain"
          },
          {
            "do": "Compute current sun belief",
            "result": "$1-0.8=0.2$",
            "why": "two-state model"
          },
          {
            "do": "Weight sun-to-rain",
            "result": "$0.2\\cdot0.3=0.06$",
            "why": "current sun times switching to rain"
          },
          {
            "do": "Add",
            "result": "$0.56+0.06=0.62$",
            "why": "total predicted rain probability"
          },
          {
            "do": "Interpret",
            "result": "belief moves toward transition equilibrium",
            "why": "uncertainty evolves through the Markov chain"
          }
        ],
        "answer": "Predicted rain probability is $0.62$."
      },
      {
        "problem": "If $P(H)=0.5$, $P(O\\mid H)=0.8$, and $P(O\\mid L)=0.3$, compute posterior $P(H\\mid O)$ with $P(L)=0.5$.",
        "steps": [
          {
            "do": "Compute high weight",
            "result": "$0.5\\cdot0.8=0.4$",
            "why": "prior times emission"
          },
          {
            "do": "Compute low weight",
            "result": "$0.5\\cdot0.3=0.15$",
            "why": "other hidden state"
          },
          {
            "do": "Total",
            "result": "$0.4+0.15=0.55$",
            "why": "evidence"
          },
          {
            "do": "Normalize",
            "result": "$0.4/0.55\\approx0.727$",
            "why": "posterior for high"
          },
          {
            "do": "State result",
            "result": "$0.727$",
            "why": "observation favors high state"
          }
        ],
        "answer": "$P(H\\mid O)\\approx0.727$."
      },
      {
        "problem": "A path has initial probability $0.6$, transitions $0.7$ and $0.8$, emissions $0.9$, $0.5$, $0.4$. Compute joint probability.",
        "steps": [
          {
            "do": "Write product",
            "result": "$0.6\\cdot0.7\\cdot0.8\\cdot0.9\\cdot0.5\\cdot0.4$",
            "why": "HMM joint probability factors into initial, transitions, emissions"
          },
          {
            "do": "Multiply transitions and initial",
            "result": "$0.6\\cdot0.7\\cdot0.8=0.336$",
            "why": "hidden path probability"
          },
          {
            "do": "Multiply emissions",
            "result": "$0.9\\cdot0.5\\cdot0.4=0.18$",
            "why": "observation likelihood along path"
          },
          {
            "do": "Combine",
            "result": "$0.336\\cdot0.18=0.06048$",
            "why": "joint probability"
          },
          {
            "do": "Interpret",
            "result": "one path contribution",
            "why": "many paths may explain the same observations"
          }
        ],
        "answer": "Joint probability is $0.06048$."
      },
      {
        "problem": "Two candidate Viterbi path scores are $0.012$ and $0.018$. Which path is chosen and by what ratio?",
        "steps": [
          {
            "do": "Compare scores",
            "result": "$0.018>0.012$",
            "why": "Viterbi chooses maximum joint score"
          },
          {
            "do": "Choose path",
            "result": "second path",
            "why": "it has larger probability"
          },
          {
            "do": "Compute ratio",
            "result": "$0.018/0.012$",
            "why": "relative support"
          },
          {
            "do": "Divide",
            "result": "$1.5$",
            "why": "second score is 50 percent larger"
          },
          {
            "do": "Interpret",
            "result": "second path is more likely among candidates",
            "why": "not necessarily absolutely likely"
          }
        ],
        "answer": "Choose the second path; its score is $1.5$ times the first."
      },
      {
        "problem": "A scaled forward step has unnormalized weights $0.03$ and $0.07$. Normalize them.",
        "steps": [
          {
            "do": "Add weights",
            "result": "$0.03+0.07=0.10$",
            "why": "normalizing constant"
          },
          {
            "do": "Normalize first",
            "result": "$0.03/0.10=0.3$",
            "why": "first state posterior"
          },
          {
            "do": "Normalize second",
            "result": "$0.07/0.10=0.7$",
            "why": "second state posterior"
          },
          {
            "do": "Check sum",
            "result": "$0.3+0.7=1$",
            "why": "valid probabilities"
          },
          {
            "do": "Explain scaling",
            "result": "normalization prevents underflow",
            "why": "long sequences multiply many small probabilities"
          }
        ],
        "answer": "Normalized weights are $0.3$ and $0.7$."
      }
    ],
    "applications": [
      {
        "title": "Speech recognition",
        "background": "HMMs were central in speech systems because phoneme states are hidden and audio features are observed.",
        "numbers": "If a phoneme emits a feature with probability $0.6$ and transition into it is $0.2$, that path factor contributes $0.12$."
      },
      {
        "title": "Part-of-speech tagging",
        "background": "Words are observed while grammatical tags are hidden, and nearby tags have strong transition patterns.",
        "numbers": "If $P(noun\\mid adjective)=0.7$ and $P(\\text{dog}\\mid noun)=0.05$, product contribution is $0.035$."
      },
      {
        "title": "Bioinformatics",
        "background": "HMMs model DNA regions such as genes and noncoding segments through hidden biological states.",
        "numbers": "A GC-rich state emitting G with probability $0.35$ gives likelihood $0.35$ for that base."
      },
      {
        "title": "User intent",
        "background": "A user's latent intent can evolve while clicks and views are noisy emissions.",
        "numbers": "Prior intent $0.4$ times click likelihood $0.8$ gives unnormalized weight $0.32$."
      },
      {
        "title": "Fault detection",
        "background": "Machines may be healthy or failing, while sensors emit noisy readings.",
        "numbers": "If failure prior is $0.02$ and alarm likelihood is $0.9$, failure alarm weight is $0.018$."
      },
      {
        "title": "State-space models",
        "background": "HMMs are discrete state-space models and a stepping stone to Kalman filters and particle filters.",
        "numbers": "With two states and three time steps, there are $2^3=8$ hidden paths before dynamic programming reduces the work."
      }
    ],
    "applicationsClose": "HMMs are a disciplined way to infer hidden stories from visible sequences.",
    "takeaways": [
      "An HMM has hidden Markov states and conditionally generated observations.",
      "Filtering multiplies by emissions and normalizes after transitions.",
      "Viterbi finds the most likely hidden path by dynamic programming.",
      "Scaling is important because sequence probabilities can become extremely small."
    ]
  },
  "math-19-24": {
    "id": "math-19-24",
    "title": "Diffusion processes as generative models",
    "tagline": "Diffusion models learn to reverse a gradual noising process, turning random noise into structured samples.",
    "connections": {
      "buildsOn": [
        "Hidden Markov Models",
        "Brownian motion",
        "Gaussian conditionals"
      ],
      "leadsTo": [
        "score-based modeling",
        "stochastic differential equations",
        "modern generative AI"
      ],
      "usedWith": [
        "Markov chains",
        "denoising",
        "Gaussian noise",
        "reverse processes"
      ]
    },
    "motivation": "<p>You already know how noise can hide a signal: blur an image enough and the original content disappears. Diffusion generative models use that idea in reverse.</p><p>The forward process slowly adds Gaussian noise until data look almost like pure noise. A neural network then learns many small denoising steps, so sampling can start from noise and walk back toward realistic data.</p>",
    "definition": "<p>A simple discrete diffusion forward step is $$x_t=\\sqrt{\\alpha_t}x_{t-1}+\\sqrt{1-\\alpha_t}\\,\\varepsilon_t,$$ where $0<\\alpha_t<1$ and $\\varepsilon_t\\sim N(0,I)$. After many steps, $x_t$ becomes close to Gaussian noise. Training often asks a neural network to predict the noise $\\varepsilon_t$ or the score $\\nabla_x\\log p_t(x)$.</p><p>The Markov structure is clear: each noisy state depends only on the previous noisy state and fresh Gaussian noise. The reverse process is learned because the exact data distribution is unknown, but Gaussian conditioning gives the form of small reverse denoising updates.</p><p><b>Assumptions that matter:</b> the forward noising schedule is chosen by the modeler, training data represent the desired distribution, the network approximates denoising or score functions, and sampling quality depends on both learned predictions and numerical step choices.</p>",
    "worked": {
      "problem": "A scalar diffusion step uses $x_t=\\sqrt{0.81}x_{t-1}+\\sqrt{0.19}\\varepsilon_t$. If $x_{t-1}=2$ and $\\varepsilon_t=-1$, compute $x_t$ using $\\sqrt{0.81}=0.9$ and $\\sqrt{0.19}\\approx0.436$.",
      "skills": [
        "forward diffusion",
        "Gaussian noise",
        "numeric sampling"
      ],
      "strategy": "Scale the signal and the noise separately, then add them.",
      "steps": [
        {
          "do": "Compute the signal part",
          "result": "$0.9\\cdot2=1.8$",
          "why": "the old sample is slightly shrunk"
        },
        {
          "do": "Compute the noise part",
          "result": "$0.436\\cdot(-1)=-0.436$",
          "why": "fresh Gaussian noise is scaled by noise level"
        },
        {
          "do": "Add the parts",
          "result": "$1.8-0.436=1.364$",
          "why": "the forward step combines signal and noise"
        },
        {
          "do": "Compare to previous value",
          "result": "$1.364<2$",
          "why": "this particular negative noise moved the value down"
        },
        {
          "do": "State the new noisy value",
          "result": "$x_t\\approx1.364$",
          "why": "that is the scalar after one noising step"
        }
      ],
      "verify": "The coefficient squares sum to $0.81+0.19=1$, so the step balances signal preservation and added noise.",
      "answer": "$x_t\\approx1.364$.",
      "connects": "Diffusion generation is built from many simple Gaussian noising and denoising steps."
    },
    "practice": [
      {
        "problem": "If $\\alpha=0.64$, $x=5$, $\\varepsilon=0$, compute one forward noising step.",
        "steps": [
          {
            "do": "Compute square roots",
            "result": "$\\sqrt{0.64}=0.8$ and $\\sqrt{0.36}=0.6$",
            "why": "signal and noise coefficients"
          },
          {
            "do": "Compute signal",
            "result": "$0.8\\cdot5=4$",
            "why": "scale old value"
          },
          {
            "do": "Compute noise",
            "result": "$0.6\\cdot0=0$",
            "why": "zero sampled noise"
          },
          {
            "do": "Add",
            "result": "$4+0=4$",
            "why": "new value"
          },
          {
            "do": "Interpret",
            "result": "signal shrinks even with zero noise draw",
            "why": "the schedule reduces old signal"
          }
        ],
        "answer": "The new value is $4$."
      },
      {
        "problem": "A model predicts noise $\\hat\\varepsilon=0.3$ but true noise is $0.5$. Compute squared noise-prediction loss.",
        "steps": [
          {
            "do": "Compute error",
            "result": "$0.3-0.5=-0.2$",
            "why": "prediction minus target"
          },
          {
            "do": "Square error",
            "result": "$(-0.2)^2=0.04$",
            "why": "squared loss"
          },
          {
            "do": "State loss",
            "result": "$0.04$",
            "why": "single-coordinate loss"
          },
          {
            "do": "Interpret sign",
            "result": "sign disappears after squaring",
            "why": "over- and under-predictions both cost"
          },
          {
            "do": "Connect to training",
            "result": "network learns denoising by reducing this error",
            "why": "noise prediction is a common objective"
          }
        ],
        "answer": "The squared loss is $0.04$."
      },
      {
        "problem": "If cumulative signal coefficient is $\\sqrt{\\bar\\alpha_t}=0.2$, what fraction of variance is noise in $x_t=0.2x_0+\\sqrt{1-0.04}\\varepsilon$?",
        "steps": [
          {
            "do": "Square the signal coefficient",
            "result": "$0.2^2=0.04$",
            "why": "signal variance fraction"
          },
          {
            "do": "Compute noise fraction",
            "result": "$1-0.04=0.96$",
            "why": "remaining variance is noise"
          },
          {
            "do": "Take noise standard coefficient",
            "result": "$\\sqrt{0.96}\\approx0.98$",
            "why": "optional scale"
          },
          {
            "do": "Interpret",
            "result": "the state is mostly noise",
            "why": "only 4 percent signal variance remains"
          },
          {
            "do": "State fraction",
            "result": "$96\\%$",
            "why": "variance share from noise"
          }
        ],
        "answer": "The noise variance fraction is $0.96$, or $96\\%$."
      },
      {
        "problem": "A denoising update is $x_{t-1}=x_t-0.1\\hat\\varepsilon$. If $x_t=1.2$ and $\\hat\\varepsilon=2$, compute the update.",
        "steps": [
          {
            "do": "Compute correction",
            "result": "$0.1\\cdot2=0.2$",
            "why": "step size times predicted noise"
          },
          {
            "do": "Subtract correction",
            "result": "$1.2-0.2=1.0$",
            "why": "move opposite predicted noise"
          },
          {
            "do": "State denoised value",
            "result": "$1.0$",
            "why": "one reverse step result"
          },
          {
            "do": "Interpret",
            "result": "positive predicted noise is removed",
            "why": "denoising subtracts noise direction"
          },
          {
            "do": "Note simplicity",
            "result": "real samplers include schedule factors",
            "why": "this captures the arithmetic idea"
          }
        ],
        "answer": "The updated value is $1.0$."
      },
      {
        "problem": "For a batch of three predicted noises $[0.1,-0.2,0.4]$ and true noises $[0.0,-0.1,0.7]$, compute mean squared error.",
        "steps": [
          {
            "do": "Compute errors",
            "result": "$[0.1,-0.1,-0.3]$",
            "why": "prediction minus truth"
          },
          {
            "do": "Square errors",
            "result": "$[0.01,0.01,0.09]$",
            "why": "square each coordinate"
          },
          {
            "do": "Sum",
            "result": "$0.01+0.01+0.09=0.11$",
            "why": "total squared error"
          },
          {
            "do": "Average",
            "result": "$0.11/3\\approx0.0367$",
            "why": "mean over coordinates"
          },
          {
            "do": "Interpret",
            "result": "third coordinate dominates the loss",
            "why": "largest error contributes most"
          }
        ],
        "answer": "Mean squared error is about $0.0367$."
      }
    ],
    "applications": [
      {
        "title": "Image generation",
        "background": "Diffusion models became famous for producing images by iteratively denoising Gaussian noise into pixels.",
        "numbers": "A pixel channel normalized to $0.6$ with predicted noise $0.4$ and step $0.05$ updates to $0.6-0.02=0.58$."
      },
      {
        "title": "Text-to-image guidance",
        "background": "Classifier-free guidance combines conditional and unconditional predictions to follow prompts more strongly.",
        "numbers": "If unconditional noise is $0.2$, conditional noise is $0.5$, and guidance scale is $3$, guided prediction is $0.2+3(0.5-0.2)=1.1$."
      },
      {
        "title": "Audio generation",
        "background": "Waveform and spectrogram diffusion models denoise random signals into realistic sound.",
        "numbers": "A sample value $-0.3$ with predicted noise $-0.8$ and step $0.1$ updates to $-0.3-0.1(-0.8)=-0.22$."
      },
      {
        "title": "Molecular design",
        "background": "Diffusion can generate candidate molecular coordinates by denoising noisy atom positions under learned chemical structure.",
        "numbers": "A coordinate $1.5$ Angstrom with correction $0.12$ moves to $1.38$ Angstrom in one reverse step."
      },
      {
        "title": "Inpainting",
        "background": "Diffusion inpainting keeps known pixels fixed while denoising unknown regions, blending generation with constraints.",
        "numbers": "If 70 percent of pixels are known in a $100\\times100$ image, $7000$ pixels are clamped and $3000$ are generated."
      },
      {
        "title": "Sampling speed",
        "background": "Practical systems trade sample quality against the number of reverse steps.",
        "numbers": "A 50-step sampler doing 20 ms per neural call takes about $50\\cdot20=1000$ ms, or 1 second, per sample."
      },
      {
        "title": "Latent diffusion",
        "background": "Many image systems diffuse in a compressed latent space to reduce computation.",
        "numbers": "Compressing a $512\\times512$ image by factor 8 per side gives a $64\\times64$ latent grid, reducing spatial positions from $262144$ to $4096$."
      }
    ],
    "applicationsClose": "Diffusion models are stochastic-process lessons made visible: add noise by a known Markov process, then learn the reverse path back to data.",
    "takeaways": [
      "Forward diffusion gradually mixes data with Gaussian noise.",
      "The noising process is Markov: each state depends on the previous state and fresh noise.",
      "Training often predicts added noise or the score of the noisy data distribution.",
      "Sampling reverses noise through many learned denoising steps, with schedule and step count affecting quality."
    ]
  }
};
