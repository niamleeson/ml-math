module.exports = {
  "math-17-28": {
    "id": "math-17-28",
    "title": "Independence of random variables",
    "tagline": "Independence means that learning one variable does not change the probability story for the other.",
    "connections": {
      "buildsOn": [
        "events",
        "conditional probability",
        "joint and marginal distributions"
      ],
      "leadsTo": [
        "Covariance",
        "Sums of random variables and convolution",
        "Conditional expectation"
      ],
      "usedWith": [
        "product rules",
        "marginalization",
        "expectation",
        "joint distributions"
      ]
    },
    "motivation": "<p>You already know the feeling of separate randomness: a coin toss should not change a die roll. Random-variable independence asks for that separation not just for one event, but for every event the variables can describe.</p><p>This is why independence is so powerful in ML math. It lets a joint model split into smaller pieces, lets samples average cleanly, and lets repeated trials become understandable.</p>",
    "definition": "<p>Random variables $X$ and $Y$ are <b>independent</b> when $P(X\\in A,Y\\in B)=P(X\\in A)P(Y\\in B)$ for every pair of sets $A,B$. In the discrete case this is $p_{X,Y}(x,y)=p_X(x)p_Y(y)$ for every $x,y$; in the continuous case it is $f_{X,Y}(x,y)=f_X(x)f_Y(y)$ on the support.</p><p>The product rule comes from conditional probability: $P(A\\cap B)=P(A\\mid B)P(B)$. If learning $B$ does not change the chance of $A$, then $P(A\\mid B)=P(A)$ and the product appears.</p><p><b>Assumptions that matter:</b> independence must hold for all events determined by the variables; a single matching cell is not enough; independent does not mean identical; and zero covariance is weaker than independence.</p>",
    "worked": {
      "problem": "A joint table has probabilities $0.12,0.18,0.28,0.42$ for $(X,Y)=(0,0),(0,1),(1,0),(1,1)$. Decide whether $X$ and $Y$ are independent.",
      "skills": [
        "joint tables",
        "marginals",
        "factorization"
      ],
      "strategy": "Compute the marginal probabilities, then test whether every joint cell factors as a product.",
      "steps": [
        {
          "do": "Compute $P(X=0)$",
          "result": "$0.12+0.18=0.30$",
          "why": "sum the cells with $X=0$"
        },
        {
          "do": "Compute $P(X=1)$",
          "result": "$0.28+0.42=0.70$",
          "why": "sum the cells with $X=1$"
        },
        {
          "do": "Compute $P(Y=0)$",
          "result": "$0.12+0.28=0.40$",
          "why": "sum the cells with $Y=0$"
        },
        {
          "do": "Compute $P(Y=1)$",
          "result": "$0.18+0.42=0.60$",
          "why": "sum the cells with $Y=1$"
        },
        {
          "do": "Check products",
          "result": "$0.30\\cdot0.40=0.12$, $0.30\\cdot0.60=0.18$, $0.70\\cdot0.40=0.28$, $0.70\\cdot0.60=0.42$",
          "why": "each product matches the joint table"
        }
      ],
      "verify": "All four cells match the product of their marginals, so the whole table separates.",
      "answer": "$X$ and $Y$ are independent.",
      "connects": "Independence says the joint distribution can be rebuilt from the two marginals."
    },
    "practice": [
      {
        "problem": "A fair coin and a fair die are tossed. Compute $P(H,6)$ and explain the product.",
        "steps": [
          {
            "do": "Write the coin probability",
            "result": "$P(H)=1/2$",
            "why": "two coin outcomes are equally likely"
          },
          {
            "do": "Write the die probability",
            "result": "$P(6)=1/6$",
            "why": "six die faces are equally likely"
          },
          {
            "do": "Multiply",
            "result": "$(1/2)(1/6)=1/12$",
            "why": "the mechanisms are separate"
          },
          {
            "do": "Count outcomes",
            "result": "$1$ favorable pair out of $12$",
            "why": "there are $2\\cdot6$ equally likely pairs"
          },
          {
            "do": "Compare",
            "result": "$1/12=1/12$",
            "why": "counting agrees with the product rule"
          }
        ],
        "answer": "$P(H,6)=1/12$."
      },
      {
        "problem": "For a table $0.20,0.30,0.10,0.40$ in the same order, show non-independence.",
        "steps": [
          {
            "do": "Compute $P(X=0)$",
            "result": "$0.20+0.30=0.50$",
            "why": "row sum"
          },
          {
            "do": "Compute $P(Y=0)$",
            "result": "$0.20+0.10=0.30$",
            "why": "column sum"
          },
          {
            "do": "Multiply marginals",
            "result": "$0.50\\cdot0.30=0.15$",
            "why": "what independence would require"
          },
          {
            "do": "Read the joint cell",
            "result": "$P(X=0,Y=0)=0.20$",
            "why": "from the table"
          },
          {
            "do": "Compare",
            "result": "$0.20\\ne0.15$",
            "why": "one failed cell disproves independence"
          }
        ],
        "answer": "The variables are not independent."
      },
      {
        "problem": "If $P(X>2)=0.35$, $P(Y\\le5)=0.80$, and $X,Y$ are independent, find $P(X>2,Y\\le5)$ and $P(X\\le2,Y>5)$.",
        "steps": [
          {
            "do": "Multiply first event",
            "result": "$0.35\\cdot0.80=0.28$",
            "why": "independence factors it"
          },
          {
            "do": "Complement $X$",
            "result": "$P(X\\le2)=0.65$",
            "why": "subtract from 1"
          },
          {
            "do": "Complement $Y$",
            "result": "$P(Y>5)=0.20$",
            "why": "subtract from 1"
          },
          {
            "do": "Multiply complements",
            "result": "$0.65\\cdot0.20=0.13$",
            "why": "complement events remain independent"
          },
          {
            "do": "Check scale",
            "result": "$0.28$ and $0.13$ are valid probabilities",
            "why": "both lie between 0 and 1"
          }
        ],
        "answer": "The probabilities are $0.28$ and $0.13$."
      },
      {
        "problem": "For density $f(x,y)=6xy^2$ on $0<x<1$, $0<y<1$, decide independence.",
        "steps": [
          {
            "do": "Find $f_X(x)$",
            "result": "$\\int_0^1 6xy^2\\,dy=2x$",
            "why": "integrate out $y$"
          },
          {
            "do": "Find $f_Y(y)$",
            "result": "$\\int_0^1 6xy^2\\,dx=3y^2$",
            "why": "integrate out $x$"
          },
          {
            "do": "Multiply marginals",
            "result": "$(2x)(3y^2)=6xy^2$",
            "why": "test factorization"
          },
          {
            "do": "Compare to joint density",
            "result": "$6xy^2=f(x,y)$",
            "why": "the formulas match"
          },
          {
            "do": "Check support",
            "result": "the support is a rectangle",
            "why": "the factorization is valid over a product region"
          }
        ],
        "answer": "$X$ and $Y$ are independent."
      },
      {
        "problem": "Two independent error flags each occur with probability $0.10$. Find the chance at least one flag occurs.",
        "steps": [
          {
            "do": "Find no-flag probability for one",
            "result": "$0.90$",
            "why": "use the complement"
          },
          {
            "do": "Find no flags for both",
            "result": "$0.90\\cdot0.90=0.81$",
            "why": "independence multiplies"
          },
          {
            "do": "Take complement",
            "result": "$1-0.81=0.19$",
            "why": "at least one is the opposite of none"
          },
          {
            "do": "Convert to percent",
            "result": "$19\\%$",
            "why": "interpret the probability"
          },
          {
            "do": "Compare to one flag",
            "result": "$0.19>0.10$",
            "why": "two chances raise the risk"
          }
        ],
        "answer": "The probability is $0.19$."
      }
    ],
    "applications": [
      {
        "title": "Naive Bayes",
        "background": "Naive Bayes factors feature likelihoods by assuming conditional independence given the class.",
        "numbers": "If $P(C)=0.4$, $P(x_1\\mid C)=0.8$, and $P(x_2\\mid C)=0.5$, the score is $0.4\\cdot0.8\\cdot0.5=0.16$."
      },
      {
        "title": "Independent validation examples",
        "background": "Validation averages are easiest to analyze when examples are independent draws.",
        "numbers": "With error rate $0.2$ over $100$ independent examples, expected errors are $100\\cdot0.2=20$."
      },
      {
        "title": "Dropout masks",
        "background": "Dropout commonly uses independent Bernoulli masks for units during training.",
        "numbers": "With keep probability $0.8$ for $5$ units, all are kept with probability $0.8^5=0.32768$."
      },
      {
        "title": "Randomized experiments",
        "background": "Treatment assignment should be independent of user traits to make groups comparable.",
        "numbers": "If $30\\%$ get treatment and $12\\%$ are premium, independence predicts $0.30\\cdot0.12=0.036$ are both."
      },
      {
        "title": "Sensor fusion",
        "background": "Independent sensor failures multiply, but shared causes can break the assumption.",
        "numbers": "Two independent false-alarm rates of $0.02$ give joint false alarm $0.02^2=0.0004$."
      },
      {
        "title": "Monte Carlo draws",
        "background": "Monte Carlo estimates usually rely on independent random samples.",
        "numbers": "For Bernoulli $p=0.3$, the chance the first three draws are all $1$ is $0.3^3=0.027$."
      }
    ],
    "applicationsClose": "Independence is the promise that separate probability stories can be multiplied into a joint story.",
    "takeaways": [
      "Independence must hold for all events generated by the variables.",
      "Discrete independence means every joint mass factors into marginals.",
      "Continuous independence means the joint density factors on its support.",
      "Independence powers sampling, experiments, dropout, Naive Bayes, and Monte Carlo."
    ]
  },
  "math-17-29": {
    "id": "math-17-29",
    "title": "Covariance",
    "tagline": "Covariance measures whether two variables tend to sit above and below their means together.",
    "connections": {
      "buildsOn": [
        "expectation",
        "variance",
        "Independence of random variables"
      ],
      "leadsTo": [
        "Correlation",
        "The multivariate Gaussian",
        "principal components"
      ],
      "usedWith": [
        "centering",
        "inner products",
        "joint distributions",
        "bilinearity"
      ]
    },
    "motivation": "<p>Variance centers one variable, squares, and averages. Covariance centers two variables, multiplies, and averages.</p><p>A positive product means both variables are on the same side of their means. A negative product means they are on opposite sides. Averaging those products gives a signed summary of linear co-movement.</p>",
    "definition": "<p>The <b>covariance</b> of $X$ and $Y$ is $\\operatorname{Cov}(X,Y)=E[(X-\\mu_X)(Y-\\mu_Y)]$, where $\\mu_X=E[X]$ and $\\mu_Y=E[Y]$. The computational form is $\\operatorname{Cov}(X,Y)=E[XY]-E[X]E[Y]$.</p><p>Expanding the centered product gives $E[XY-\\mu_XY-\\mu_YX+\\mu_X\\mu_Y]=E[XY]-\\mu_X\\mu_Y$ after like terms combine.</p><p><b>Assumptions that matter:</b> the needed expectations must exist; covariance has product units; independence implies zero covariance when moments exist; and zero covariance does not by itself prove independence.</p>",
    "worked": {
      "problem": "Outcomes $(X,Y)=(1,2),(2,4),(3,5)$ are equally likely. Compute $\\operatorname{Cov}(X,Y)$.",
      "skills": [
        "expectation",
        "centering",
        "covariance"
      ],
      "strategy": "Compute $E[X]$, $E[Y]$, and $E[XY]$, then subtract the product of means.",
      "steps": [
        {
          "do": "Compute $E[X]",
          "result": "$(1+2+3)/3=2$",
          "why": "average the $X$ values"
        },
        {
          "do": "Compute $E[Y]",
          "result": "$(2+4+5)/3=11/3$",
          "why": "average the $Y$ values"
        },
        {
          "do": "Compute products",
          "result": "$XY=2,8,15$",
          "why": "multiply paired outcomes"
        },
        {
          "do": "Compute $E[XY]",
          "result": "$(2+8+15)/3=25/3$",
          "why": "average the products"
        },
        {
          "do": "Subtract product of means",
          "result": "$25/3-2\\cdot11/3=1$",
          "why": "apply the covariance formula"
        }
      ],
      "verify": "Larger $X$ values tend to pair with larger $Y$ values, so the positive sign makes sense.",
      "answer": "$\\operatorname{Cov}(X,Y)=1$.",
      "connects": "Covariance is the average product of centered movements."
    },
    "practice": [
      {
        "problem": "For outcomes $(0,1)$ and $(2,5)$ with probability $1/2$ each, compute covariance.",
        "steps": [
          {
            "do": "Compute $E[X]",
            "result": "$1$",
            "why": "average $0$ and $2$"
          },
          {
            "do": "Compute $E[Y]",
            "result": "$3$",
            "why": "average $1$ and $5$"
          },
          {
            "do": "Compute $E[XY]",
            "result": "$(0+10)/2=5$",
            "why": "average products"
          },
          {
            "do": "Subtract",
            "result": "$5-1\\cdot3=2$",
            "why": "use the shortcut"
          },
          {
            "do": "Interpret",
            "result": "positive",
            "why": "large pairs with large"
          }
        ],
        "answer": "The covariance is $2$."
      },
      {
        "problem": "If $E[X]=4$, $E[Y]=10$, and $E[XY]=37$, compute covariance.",
        "steps": [
          {
            "do": "Write formula",
            "result": "$E[XY]-E[X]E[Y]$",
            "why": "shortcut form"
          },
          {
            "do": "Substitute",
            "result": "$37-4\\cdot10$",
            "why": "insert values"
          },
          {
            "do": "Multiply",
            "result": "$4\\cdot10=40$",
            "why": "product of means"
          },
          {
            "do": "Subtract",
            "result": "$-3$",
            "why": "finish"
          },
          {
            "do": "Read sign",
            "result": "negative",
            "why": "opposite-side movement dominates"
          }
        ],
        "answer": "The covariance is $-3$."
      },
      {
        "problem": "Let $Y=3X+2$ and $\\operatorname{Var}(X)=5$. Find $\\operatorname{Cov}(X,Y)$.",
        "steps": [
          {
            "do": "Substitute $Y$",
            "result": "$\\operatorname{Cov}(X,3X+2)$",
            "why": "use the relation"
          },
          {
            "do": "Use bilinearity",
            "result": "$3\\operatorname{Cov}(X,X)+\\operatorname{Cov}(X,2)$",
            "why": "split terms"
          },
          {
            "do": "Replace self-covariance",
            "result": "$\\operatorname{Cov}(X,X)=5$",
            "why": "self-covariance is variance"
          },
          {
            "do": "Remove constant covariance",
            "result": "$\\operatorname{Cov}(X,2)=0$",
            "why": "constants do not vary"
          },
          {
            "do": "Compute",
            "result": "$15$",
            "why": "multiply by 3"
          }
        ],
        "answer": "$\\operatorname{Cov}(X,Y)=15$."
      },
      {
        "problem": "For Bernoulli $X$ with $P(X=1)=0.4$ and $Y=1-X$, compute covariance.",
        "steps": [
          {
            "do": "Compute $E[X]",
            "result": "$0.4$",
            "why": "Bernoulli mean"
          },
          {
            "do": "Compute $E[Y]",
            "result": "$0.6$",
            "why": "complement probability"
          },
          {
            "do": "Compute $XY$",
            "result": "$0$ always",
            "why": "one factor is always zero"
          },
          {
            "do": "Compute $E[XY]$",
            "result": "$0$",
            "why": "product is always zero"
          },
          {
            "do": "Subtract",
            "result": "$0-0.4\\cdot0.6=-0.24$",
            "why": "shortcut formula"
          }
        ],
        "answer": "The covariance is $-0.24$."
      },
      {
        "problem": "Centered feature values $[-2,-1,1,2]$ pair with centered residuals $[-3,-1,1,3]$. Average the products.",
        "steps": [
          {
            "do": "Multiply pairs",
            "result": "$6,1,1,6$",
            "why": "same signs give positive products"
          },
          {
            "do": "Add products",
            "result": "$14$",
            "why": "sum co-movement"
          },
          {
            "do": "Divide by $4$",
            "result": "$3.5$",
            "why": "requested average"
          },
          {
            "do": "Check sign",
            "result": "positive",
            "why": "all products are positive"
          },
          {
            "do": "Interpret",
            "result": "residual rises with feature",
            "why": "model may miss a trend"
          }
        ],
        "answer": "The average product is $3.5$."
      }
    ],
    "applications": [
      {
        "title": "Feature association",
        "background": "Covariance is a numerical scatterplot summary.",
        "numbers": "Centered ad spend $[-10,0,10]$ and clicks $[-40,0,50]$ give covariance $(400+0+500)/3=300$."
      },
      {
        "title": "Portfolio risk",
        "background": "Covariance controls whether risks add or offset.",
        "numbers": "If variances are $4$ and $9$ and covariance is $-2$, variance of the sum is $4+9+2(-2)=9$."
      },
      {
        "title": "Gradient noise",
        "background": "Covariance between gradient coordinates shows whether updates wobble together.",
        "numbers": "Centered pairs $(1,2),(-1,-2),(2,4)$ have average product $(2+2+8)/3=4$."
      },
      {
        "title": "PCA",
        "background": "PCA starts from covariance to find high-variation directions.",
        "numbers": "Matrix $\\begin{pmatrix}4&3\\\\3&4\\end{pmatrix}$ has variance $7$ along normalized direction $(1,1)/\\sqrt2$."
      },
      {
        "title": "Metric tradeoffs",
        "background": "Negative covariance can reveal product tradeoffs.",
        "numbers": "Centered revenue $[2,-1,-1]$ and latency $[-4,2,2]$ average product $(-8-2-2)/3=-4$."
      },
      {
        "title": "Units",
        "background": "Covariance changes when units change.",
        "numbers": "A covariance of $12$ meter-kg becomes $1200$ centimeter-kg after multiplying height by $100$."
      }
    ],
    "applicationsClose": "Covariance is useful because it is signed and algebraic, but its scale still depends on units.",
    "takeaways": [
      "Covariance is $E[(X-\\mu_X)(Y-\\mu_Y)]$.",
      "The shortcut is $E[XY]-E[X]E[Y]$.",
      "Positive means same-direction linear movement; negative means opposite-direction movement.",
      "Independence implies zero covariance, but zero covariance need not imply independence."
    ]
  },
  "math-17-30": {
    "id": "math-17-30",
    "title": "Correlation",
    "tagline": "Correlation is covariance in standard-deviation units, so linear association becomes unitless.",
    "connections": {
      "buildsOn": [
        "Covariance",
        "standard deviation",
        "linear transformations"
      ],
      "leadsTo": [
        "regression",
        "The multivariate Gaussian",
        "principal components"
      ],
      "usedWith": [
        "standardization",
        "inner products",
        "Cauchy-Schwarz inequality",
        "scatterplots"
      ]
    },
    "motivation": "<p>Covariance has units. Correlation removes those units by dividing by the two standard deviations.</p><p>The result is a number between $-1$ and $1$: sign tells direction, magnitude tells linear strength, and the scale is comparable across problems.</p>",
    "definition": "<p>The <b>Pearson correlation</b> is $\\rho_{X,Y}=\\dfrac{\\operatorname{Cov}(X,Y)}{\\sigma_X\\sigma_Y}$ when $\\sigma_X,\\sigma_Y>0$.</p><p>Cauchy-Schwarz gives $|\\operatorname{Cov}(X,Y)|\\le\\sigma_X\\sigma_Y$, so $-1\\le\\rho\\le1$.</p><p><b>Assumptions that matter:</b> variances must be finite and nonzero; correlation is linear association; positive rescaling preserves it; negative rescaling flips its sign.</p>",
    "worked": {
      "problem": "Given covariance $6$, variances $9$ and $16$, compute correlation.",
      "skills": [
        "standard deviation",
        "normalization"
      ],
      "strategy": "Take square roots of variances and divide covariance by their product.",
      "steps": [
        {
          "do": "Find $\\sigma_X$",
          "result": "$3$",
          "why": "$\\sqrt9=3$"
        },
        {
          "do": "Find $\\sigma_Y$",
          "result": "$4$",
          "why": "$\\sqrt{16}=4$"
        },
        {
          "do": "Multiply standard deviations",
          "result": "$12$",
          "why": "normalizing scale"
        },
        {
          "do": "Divide",
          "result": "$6/12=0.5$",
          "why": "correlation formula"
        },
        {
          "do": "Check range",
          "result": "$0.5\\in[-1,1]$",
          "why": "valid correlation"
        }
      ],
      "verify": "The covariance is positive, so the correlation should be positive.",
      "answer": "The correlation is $0.5$.",
      "connects": "Correlation is standardized covariance."
    },
    "practice": [
      {
        "problem": "Compute correlation for covariance $-8$ and variances $4$ and $16$.",
        "steps": [
          {
            "do": "Find sds",
            "result": "$2$ and $4$",
            "why": "square roots"
          },
          {
            "do": "Multiply sds",
            "result": "$8$",
            "why": "normalizer"
          },
          {
            "do": "Divide covariance",
            "result": "$-8/8=-1$",
            "why": "formula"
          },
          {
            "do": "Check range",
            "result": "$-1$ is allowed",
            "why": "endpoint"
          },
          {
            "do": "Interpret",
            "result": "perfect negative linear relation",
            "why": "most extreme negative value"
          }
        ],
        "answer": "$-1$."
      },
      {
        "problem": "If $Y=2X+5$ and $\\operatorname{Var}(X)>0$, find correlation.",
        "steps": [
          {
            "do": "Covariance",
            "result": "$2\\operatorname{Var}(X)$",
            "why": "positive scaling"
          },
          {
            "do": "Sd of $Y$",
            "result": "$2\\sigma_X$",
            "why": "scale sd"
          },
          {
            "do": "Form ratio",
            "result": "$2\\sigma_X^2/(2\\sigma_X^2)$",
            "why": "substitute"
          },
          {
            "do": "Simplify",
            "result": "$1$",
            "why": "cancel"
          },
          {
            "do": "Interpret",
            "result": "perfect positive",
            "why": "increasing line"
          }
        ],
        "answer": "$1$."
      },
      {
        "problem": "If $Y=-3X+7$, find correlation.",
        "steps": [
          {
            "do": "Covariance",
            "result": "$-3\\operatorname{Var}(X)$",
            "why": "negative scaling"
          },
          {
            "do": "Sd of $Y$",
            "result": "$3\\sigma_X$",
            "why": "absolute scale"
          },
          {
            "do": "Form ratio",
            "result": "$-3\\sigma_X^2/(3\\sigma_X^2)$",
            "why": "substitute"
          },
          {
            "do": "Simplify",
            "result": "$-1$",
            "why": "cancel"
          },
          {
            "do": "Interpret",
            "result": "perfect negative",
            "why": "decreasing line"
          }
        ],
        "answer": "$-1$."
      },
      {
        "problem": "Covariance is $0.024$, sds are $0.20$ and $0.49$. Compute correlation.",
        "steps": [
          {
            "do": "Multiply sds",
            "result": "$0.098$",
            "why": "normalizer"
          },
          {
            "do": "Divide",
            "result": "$0.024/0.098\\approx0.245$",
            "why": "correlation"
          },
          {
            "do": "Check sign",
            "result": "positive",
            "why": "covariance is positive"
          },
          {
            "do": "Check magnitude",
            "result": "modest",
            "why": "well below 1"
          },
          {
            "do": "Interpret",
            "result": "some linear signal",
            "why": "not a perfect relationship"
          }
        ],
        "answer": "About $0.245$."
      },
      {
        "problem": "A suspicious feature has covariance $0.2475$ with a binary label, and both sds are $0.5$. Compute correlation.",
        "steps": [
          {
            "do": "Multiply sds",
            "result": "$0.25$",
            "why": "$0.5\\cdot0.5$"
          },
          {
            "do": "Divide",
            "result": "$0.2475/0.25=0.99$",
            "why": "formula"
          },
          {
            "do": "Check range",
            "result": "near $1$",
            "why": "very high"
          },
          {
            "do": "Interpret",
            "result": "possible leakage",
            "why": "feature almost duplicates label"
          },
          {
            "do": "State caution",
            "result": "investigate before training",
            "why": "correlation is a clue"
          }
        ],
        "answer": "The correlation is $0.99$."
      }
    ],
    "applications": [
      {
        "title": "Feature screening",
        "background": "Correlation is a fast first scan for linear signal.",
        "numbers": "Covariance $1.5$ with sds $3$ and $2$ gives correlation $1.5/6=0.25$."
      },
      {
        "title": "Multicollinearity",
        "background": "Highly correlated features can make regression coefficients unstable.",
        "numbers": "Standardized features with average product $0.98$ have correlation $0.98$."
      },
      {
        "title": "Embedding diagnostics",
        "background": "Correlated embedding dimensions can indicate redundancy.",
        "numbers": "Covariance $0.03$ with sds $0.2$ and $0.5$ gives $0.03/0.1=0.3$."
      },
      {
        "title": "Metric relationships",
        "background": "Correlation summarizes whether metrics move together across items.",
        "numbers": "Covariance $0.015$ with sds $0.1$ and $0.3$ gives correlation $0.5$."
      },
      {
        "title": "Leakage checks",
        "background": "Near-perfect correlation with a label may reveal leakage.",
        "numbers": "Correlation $0.99$ means $99\\%$ of a standardized unit moves together linearly."
      },
      {
        "title": "Causality caution",
        "background": "Correlation is not causation; shared causes can create it.",
        "numbers": "A correlation of $0.8$ between two seasonal metrics may be driven by temperature."
      }
    ],
    "applicationsClose": "Correlation keeps the useful sign of covariance while putting every linear relationship on the same unitless scale.",
    "takeaways": [
      "Correlation is covariance divided by the product of standard deviations.",
      "It lies between $-1$ and $1$.",
      "It measures linear association, not all dependence.",
      "It is unitless and comparable across scales."
    ]
  },
  "math-17-31": {
    "id": "math-17-31",
    "title": "Transformations of random variables",
    "tagline": "A transformation pushes probability through a function while preserving total probability.",
    "connections": {
      "buildsOn": [
        "random variables",
        "CDFs and PDFs",
        "functions and inverses"
      ],
      "leadsTo": [
        "Sums of random variables and convolution",
        "The multivariate Gaussian",
        "simulation methods"
      ],
      "usedWith": [
        "change of variables",
        "Jacobians",
        "monotone functions",
        "expectation"
      ]
    },
    "motivation": "<p>If $X$ is random and $Y=g(X)$, the function moves probability from input values to output values.</p><p>The important detail is stretching. When a transformation stretches the axis, density thins; when it compresses, density rises.</p>",
    "definition": "<p>Always valid is the CDF method: $F_Y(y)=P(Y\\le y)=P(g(X)\\le y)$. If $g$ is one-to-one and differentiable, then $f_Y(y)=f_X(g^{-1}(y))\\left|\\dfrac{d}{dy}g^{-1}(y)\\right|$.</p><p>The derivative factor comes from matching small probabilities: $f_Y(y)dy\\approx f_X(x)dx$.</p><p><b>Assumptions that matter:</b> transform the support; use absolute derivative; split into monotone pieces when the map is many-to-one.</p>",
    "worked": {
      "problem": "Let $X\\sim\\operatorname{Unif}(0,1)$ and $Y=2X+3$. Find $f_Y$.",
      "skills": [
        "change of variables",
        "support"
      ],
      "strategy": "Find the inverse, the new support, and the inverse derivative.",
      "steps": [
        {
          "do": "Map support",
          "result": "$3\\le Y\\le5$",
          "why": "endpoints move under $2x+3$"
        },
        {
          "do": "Solve inverse",
          "result": "$x=(y-3)/2$",
          "why": "rearrange"
        },
        {
          "do": "Differentiate inverse",
          "result": "$dx/dy=1/2$",
          "why": "linear slope"
        },
        {
          "do": "Use $f_X$",
          "result": "$f_X(x)=1$",
          "why": "uniform on length one"
        },
        {
          "do": "Apply formula",
          "result": "$f_Y(y)=1/2$ for $3\\le y\\le5$",
          "why": "multiply by absolute inverse derivative"
        }
      ],
      "verify": "The density integrates to $(1/2)(2)=1$.",
      "answer": "$f_Y(y)=1/2$ on $[3,5]$.",
      "connects": "Transformations preserve mass but rescale density."
    },
    "practice": [
      {
        "problem": "For $X\\sim\\operatorname{Unif}(0,1)$ and $Y=X^2$, find $F_Y(y)$ on $[0,1]$.",
        "steps": [
          {
            "do": "Start CDF",
            "result": "$P(Y\\le y)$",
            "why": "definition"
          },
          {
            "do": "Substitute",
            "result": "$P(X^2\\le y)$",
            "why": "use $Y=X^2$"
          },
          {
            "do": "Use $X\\ge0$",
            "result": "$P(X\\le\\sqrt y)$",
            "why": "square root"
          },
          {
            "do": "Use uniform CDF",
            "result": "$\\sqrt y$",
            "why": "CDF equals input"
          },
          {
            "do": "State support",
            "result": "$0\\le y\\le1$",
            "why": "range of square"
          }
        ],
        "answer": "$F_Y(y)=\\sqrt y$."
      },
      {
        "problem": "Differentiate the previous CDF to get density.",
        "steps": [
          {
            "do": "Write CDF",
            "result": "$F_Y(y)=\\sqrt y$",
            "why": "from previous"
          },
          {
            "do": "Differentiate",
            "result": "$1/(2\\sqrt y)$",
            "why": "power rule"
          },
          {
            "do": "Set support",
            "result": "$0<y<1$",
            "why": "density interval"
          },
          {
            "do": "Integrate check",
            "result": "$\\int_0^1(2\\sqrt y)^{-1}dy=1$",
            "why": "total mass"
          },
          {
            "do": "Interpret",
            "result": "higher near 0",
            "why": "squaring compresses small values"
          }
        ],
        "answer": "$f_Y(y)=1/(2\\sqrt y)$."
      },
      {
        "problem": "If $f_X(x)=2x$ on $(0,1)$ and $Y=1-X$, find $f_Y$.",
        "steps": [
          {
            "do": "Inverse",
            "result": "$x=1-y$",
            "why": "solve"
          },
          {
            "do": "Derivative",
            "result": "$|dx/dy|=1$",
            "why": "absolute value"
          },
          {
            "do": "Support",
            "result": "$0<y<1$",
            "why": "interval maps to itself"
          },
          {
            "do": "Substitute",
            "result": "$f_Y(y)=2(1-y)$",
            "why": "evaluate $f_X$ at inverse"
          },
          {
            "do": "Check mass",
            "result": "$\\int_0^1 2(1-y)dy=1$",
            "why": "valid density"
          }
        ],
        "answer": "$f_Y(y)=2(1-y)$."
      },
      {
        "problem": "For exponential $f_X(x)=e^{-x}$, $x>0$, and $Y=3X$, find density.",
        "steps": [
          {
            "do": "Inverse",
            "result": "$x=y/3$",
            "why": "solve"
          },
          {
            "do": "Derivative",
            "result": "$1/3$",
            "why": "inverse slope"
          },
          {
            "do": "Support",
            "result": "$y>0$",
            "why": "positive scaling"
          },
          {
            "do": "Substitute",
            "result": "$e^{-y/3}$",
            "why": "original density at inverse"
          },
          {
            "do": "Multiply",
            "result": "$f_Y(y)=\\frac13e^{-y/3}$",
            "why": "change of variables"
          }
        ],
        "answer": "$f_Y(y)=\\frac13e^{-y/3}$ for $y>0$."
      },
      {
        "problem": "If $Z\\sim\\mathcal{N}(0,1)$ and $X=\\mu+\\sigma Z$, state $X$'s distribution.",
        "steps": [
          {
            "do": "Inverse",
            "result": "$z=(x-\\mu)/\\sigma$",
            "why": "solve"
          },
          {
            "do": "Derivative",
            "result": "$1/\\sigma$",
            "why": "positive scale"
          },
          {
            "do": "Substitute normal density",
            "result": "$\\phi((x-\\mu)/\\sigma)$",
            "why": "preimage"
          },
          {
            "do": "Multiply scale",
            "result": "$1/\\sigma$",
            "why": "density adjustment"
          },
          {
            "do": "Name result",
            "result": "$\\mathcal{N}(\\mu,\\sigma^2)$",
            "why": "standard normal affine transform"
          }
        ],
        "answer": "$X\\sim\\mathcal{N}(\\mu,\\sigma^2)$."
      }
    ],
    "applications": [
      {
        "title": "Feature scaling",
        "background": "Standardization is a transformation of a random feature.",
        "numbers": "$x=55$ with mean $40$ and sd $10$ maps to $z=1.5$."
      },
      {
        "title": "Log transforms",
        "background": "Logs compress positive skewed quantities such as latency.",
        "numbers": "$200$ ms maps to $\\ln200\\approx5.30$."
      },
      {
        "title": "Inverse-CDF simulation",
        "background": "Uniform random numbers can be transformed into target distributions.",
        "numbers": "For exponential rate $2$, $U=0.8$ gives $-\\ln(0.2)/2\\approx0.805$."
      },
      {
        "title": "Sigmoid probabilities",
        "background": "A logit transformation maps scores to probabilities.",
        "numbers": "Score $1.2$ maps to $1/(1+e^{-1.2})\\approx0.768$."
      },
      {
        "title": "Image gamma correction",
        "background": "Pixel intensities are transformed to change contrast.",
        "numbers": "$Y=\\sqrt X$ sends $0.25$ to $0.5$."
      },
      {
        "title": "Uncertainty propagation",
        "background": "Linear transformations scale standard deviations.",
        "numbers": "If $Y=3X+2$ and $\\operatorname{sd}(X)=0.4$, then $\\operatorname{sd}(Y)=1.2$."
      }
    ],
    "applicationsClose": "A random-variable transformation is probability conservation in new coordinates.",
    "takeaways": [
      "Use CDFs for transformations when in doubt.",
      "One-to-one density transforms need the absolute derivative of the inverse.",
      "Always transform the support.",
      "Many-to-one maps require adding all preimage contributions."
    ]
  },
  "math-17-32": {
    "id": "math-17-32",
    "title": "Sums of random variables and convolution",
    "tagline": "The distribution of a sum adds all ways the pieces can make the total.",
    "connections": {
      "buildsOn": [
        "Independence of random variables",
        "Transformations of random variables",
        "discrete and continuous distributions"
      ],
      "leadsTo": [
        "The Law of Large Numbers",
        "The Central Limit Theorem",
        "Bayesian updating"
      ],
      "usedWith": [
        "convolution",
        "generating functions",
        "integrals",
        "expectation linearity"
      ]
    },
    "motivation": "<p>A sum like $7$ from two dice can happen in several ways. Probability must count all compatible pairs.</p><p>Convolution is that counting rule for distributions, in sums for discrete variables and integrals for continuous variables.</p>",
    "definition": "<p>For independent discrete variables, $P(X+Y=s)=\\sum_x P(X=x)P(Y=s-x)$. For independent densities, $f_{X+Y}(s)=\\int f_X(x)f_Y(s-x)\\,dx$.</p><p>The rule partitions the event by possible $X=x$, then independence turns joint pieces into products.</p><p><b>Assumptions that matter:</b> the product form needs independence; supports set the valid summation or integration range; means add always, but variances add only when covariance is zero.</p>",
    "worked": {
      "problem": "Two fair dice are rolled. Find $P(X+Y=7)$ by convolution.",
      "skills": [
        "discrete convolution",
        "independence"
      ],
      "strategy": "List all first-die values that produce a valid second-die value.",
      "steps": [
        {
          "do": "Write sum",
          "result": "$P(X+Y=7)=\\sum_x P(X=x)P(Y=7-x)$",
          "why": "condition on $X$"
        },
        {
          "do": "List valid $x$",
          "result": "$1,2,3,4,5,6$",
          "why": "each gives a valid die value"
        },
        {
          "do": "Compute one product",
          "result": "$(1/6)(1/6)=1/36$",
          "why": "independent fair dice"
        },
        {
          "do": "Count products",
          "result": "$6$",
          "why": "six valid pairs"
        },
        {
          "do": "Add",
          "result": "$6/36=1/6$",
          "why": "sum compatible ways"
        }
      ],
      "verify": "Counting the $36$ die pairs also gives six favorable pairs.",
      "answer": "$P(X+Y=7)=1/6$.",
      "connects": "Convolution adds probability over all decompositions of a sum."
    },
    "practice": [
      {
        "problem": "Independent Bernoulli variables have probabilities $0.3$ and $0.4$. Find distribution of the sum.",
        "steps": [
          {
            "do": "$P(S=0)$",
            "result": "$0.7\\cdot0.6=0.42$",
            "why": "both zero"
          },
          {
            "do": "First way for $S=1$",
            "result": "$0.3\\cdot0.6=0.18$",
            "why": "one-zero pair"
          },
          {
            "do": "Second way for $S=1$",
            "result": "$0.7\\cdot0.4=0.28$",
            "why": "zero-one pair"
          },
          {
            "do": "Add for $S=1$",
            "result": "$0.46$",
            "why": "convolution"
          },
          {
            "do": "$P(S=2)$",
            "result": "$0.3\\cdot0.4=0.12$",
            "why": "both one"
          }
        ],
        "answer": "$P(S=0)=0.42$, $P(S=1)=0.46$, $P(S=2)=0.12$."
      },
      {
        "problem": "Uniform variables on $\\{0,1,2\\}$ are independent. Find $P(X+Y=2)$.",
        "steps": [
          {
            "do": "List pairs",
            "result": "$(0,2),(1,1),(2,0)$",
            "why": "compatible sums"
          },
          {
            "do": "One pair probability",
            "result": "$1/9$",
            "why": "independent uniforms"
          },
          {
            "do": "Count pairs",
            "result": "$3$",
            "why": "three ways"
          },
          {
            "do": "Add",
            "result": "$3/9=1/3$",
            "why": "sum ways"
          },
          {
            "do": "Check",
            "result": "middle sum is likely",
            "why": "more ways than extremes"
          }
        ],
        "answer": "$1/3$."
      },
      {
        "problem": "Means are $2,5$ and variances $3,7$ for independent variables. Find mean and variance of sum.",
        "steps": [
          {
            "do": "Add means",
            "result": "$7$",
            "why": "linearity"
          },
          {
            "do": "Write variance rule",
            "result": "$3+7+2\\operatorname{Cov}$",
            "why": "general"
          },
          {
            "do": "Use independence",
            "result": "$\\operatorname{Cov}=0$",
            "why": "independent"
          },
          {
            "do": "Add variances",
            "result": "$10$",
            "why": "finish"
          },
          {
            "do": "State",
            "result": "mean $7$, variance $10$",
            "why": "summary"
          }
        ],
        "answer": "Mean $7$, variance $10$."
      },
      {
        "problem": "For independent uniforms on $[0,1]$, find $f_{X+Y}(s)$ for $0<s<1$.",
        "steps": [
          {
            "do": "Write integral",
            "result": "$\\int f_X(x)f_Y(s-x)dx$",
            "why": "convolution"
          },
          {
            "do": "Use densities",
            "result": "$1$",
            "why": "inside support"
          },
          {
            "do": "Find range",
            "result": "$0<x<s$",
            "why": "both arguments in $[0,1]$"
          },
          {
            "do": "Integrate",
            "result": "$\\int_0^s1dx=s$",
            "why": "length of range"
          },
          {
            "do": "Interpret",
            "result": "rising density",
            "why": "more pairs make larger small sums"
          }
        ],
        "answer": "$f_{X+Y}(s)=s$ for $0<s<1$."
      },
      {
        "problem": "Three independent zero-mean errors have variance $4$. Find variance of their average.",
        "steps": [
          {
            "do": "Sum variance",
            "result": "$4+4+4=12$",
            "why": "independence"
          },
          {
            "do": "Average scale",
            "result": "$1/3$",
            "why": "definition"
          },
          {
            "do": "Scale variance",
            "result": "$12/3^2$",
            "why": "square scaling"
          },
          {
            "do": "Simplify",
            "result": "$4/3$",
            "why": "compute"
          },
          {
            "do": "Mean",
            "result": "$0$",
            "why": "zero means average to zero"
          }
        ],
        "answer": "Mean $0$, variance $4/3$."
      }
    ],
    "applications": [
      {
        "title": "Dice probabilities",
        "background": "Game sums are classic discrete convolutions.",
        "numbers": "Two dice make $7$ in $6$ ways and $2$ in $1$ way, so probabilities are $6/36$ and $1/36$."
      },
      {
        "title": "Measurement noise",
        "background": "Independent noise sources add by convolution.",
        "numbers": "Variances $1.5$ and $0.5$ add to total variance $2.0$."
      },
      {
        "title": "Mini-batches",
        "background": "A batch gradient is a scaled sum of example gradients.",
        "numbers": "Variance $9$ averaged over $16$ examples becomes $9/16=0.5625$."
      },
      {
        "title": "Latency totals",
        "background": "End-to-end latency is often a sum of component times.",
        "numbers": "Network mean $20$ ms plus model mean $35$ ms gives total mean $55$ ms."
      },
      {
        "title": "Ensembles",
        "background": "Averaging independent errors reduces variance.",
        "numbers": "Four independent errors with variance $0.04$ average to variance $0.01$."
      },
      {
        "title": "Signal filters",
        "background": "Signal convolution uses the same add-over-alignments pattern.",
        "numbers": "A moving average of $[6,9,12]$ is $(6+9+12)/3=9$."
      }
    ],
    "applicationsClose": "Convolution is the add-all-compatible-ways pattern behind sums, noise, batches, and filters.",
    "takeaways": [
      "Convolution adds all ways independent variables can make a sum.",
      "Discrete sums use summation; continuous sums use integration.",
      "Means add always; variances add when covariance is zero.",
      "Averages reduce variance by scaling sums."
    ]
  },
  "math-17-33": {
    "id": "math-17-33",
    "title": "Conditional expectation",
    "tagline": "Conditional expectation is the average outcome after you account for the information you know.",
    "connections": {
      "buildsOn": [
        "conditional probability",
        "expectation",
        "joint distributions"
      ],
      "leadsTo": [
        "martingales",
        "regression",
        "The Law of Large Numbers"
      ],
      "usedWith": [
        "random variables",
        "sigma-algebras",
        "least squares",
        "total expectation"
      ]
    },
    "motivation": "<p>Averages change when information arrives. Expected clicks differ for new and returning users; expected return differs by state.</p><p>Conditional expectation turns that updated average into a function of the observed information.</p>",
    "definition": "<p>For discrete variables, $E[Y\\mid X=x]=\\sum_y yP(Y=y\\mid X=x)$. The object $E[Y\\mid X]$ is a random variable: after $X$ is observed, it returns the corresponding conditional mean.</p><p>The law of total expectation is $E[Y]=E[E[Y\\mid X]]$, because averaging conditional averages with their probabilities recovers the overall average.</p><p><b>Assumptions that matter:</b> the conditional mean must exist; elementary conditioning needs positive-probability events; and under squared loss the best prediction from $X$ is $E[Y\\mid X]$.</p>",
    "worked": {
      "problem": "Premium users have mean clicks $12$, free users have mean clicks $4$, and $P(premium)=0.25$. Find overall expected clicks.",
      "skills": [
        "conditional means",
        "total expectation"
      ],
      "strategy": "Weight each group mean by the group probability.",
      "steps": [
        {
          "do": "Find free probability",
          "result": "$0.75$",
          "why": "complement of premium"
        },
        {
          "do": "Write total expectation",
          "result": "$12\\cdot0.25+4\\cdot0.75$",
          "why": "weight group means"
        },
        {
          "do": "Compute premium term",
          "result": "$3$",
          "why": "$12\\cdot0.25$"
        },
        {
          "do": "Compute free term",
          "result": "$3$",
          "why": "$4\\cdot0.75$"
        },
        {
          "do": "Add",
          "result": "$6$",
          "why": "overall mean"
        }
      ],
      "verify": "The answer lies between $4$ and $12$, closer to $4$ because most users are free.",
      "answer": "Expected clicks are $6$.",
      "connects": "Conditional expectation re-averages subgroup averages."
    },
    "practice": [
      {
        "problem": "Coin heads probability $0.6$: $Y=10$ on heads and $2$ on tails. Find $E[Y]$.",
        "steps": [
          {
            "do": "Conditional on heads",
            "result": "$10$",
            "why": "given"
          },
          {
            "do": "Conditional on tails",
            "result": "$2$",
            "why": "given"
          },
          {
            "do": "Weight heads",
            "result": "$10\\cdot0.6=6$",
            "why": "probability weight"
          },
          {
            "do": "Weight tails",
            "result": "$2\\cdot0.4=0.8$",
            "why": "complement"
          },
          {
            "do": "Add",
            "result": "$6.8$",
            "why": "total expectation"
          }
        ],
        "answer": "$E[Y]=6.8$."
      },
      {
        "problem": "Given $E[Y\\mid X=0]=5$, $E[Y\\mid X=1]=9$, and $P(X=1)=0.3$, find $E[Y]$.",
        "steps": [
          {
            "do": "Find $P(X=0)$",
            "result": "$0.7$",
            "why": "complement"
          },
          {
            "do": "Weight first mean",
            "result": "$5\\cdot0.7=3.5$",
            "why": "group contribution"
          },
          {
            "do": "Weight second mean",
            "result": "$9\\cdot0.3=2.7$",
            "why": "group contribution"
          },
          {
            "do": "Add",
            "result": "$6.2$",
            "why": "overall mean"
          },
          {
            "do": "Check",
            "result": "between $5$ and $9$",
            "why": "weighted average"
          }
        ],
        "answer": "$E[Y]=6.2$."
      },
      {
        "problem": "For die roll $D$, compute $E[D^2\\mid D$ is even$]$.",
        "steps": [
          {
            "do": "List even outcomes",
            "result": "$2,4,6$",
            "why": "condition"
          },
          {
            "do": "Square",
            "result": "$4,16,36$",
            "why": "transform"
          },
          {
            "do": "Use equal weights",
            "result": "$1/3$ each",
            "why": "conditional uniform"
          },
          {
            "do": "Average",
            "result": "$(4+16+36)/3=56/3$",
            "why": "conditional mean"
          },
          {
            "do": "Approximate",
            "result": "$18.67$",
            "why": "scale"
          }
        ],
        "answer": "$56/3$."
      },
      {
        "problem": "If $E[Y\\mid X]=2X+1$ and $E[X]=3$, find $E[Y]$.",
        "steps": [
          {
            "do": "Use tower property",
            "result": "$E[Y]=E[E[Y\\mid X]]$",
            "why": "total expectation"
          },
          {
            "do": "Substitute",
            "result": "$E[2X+1]$",
            "why": "given function"
          },
          {
            "do": "Use linearity",
            "result": "$2E[X]+1$",
            "why": "expectation of affine expression"
          },
          {
            "do": "Insert mean",
            "result": "$2\\cdot3+1$",
            "why": "given"
          },
          {
            "do": "Compute",
            "result": "$7$",
            "why": "finish"
          }
        ],
        "answer": "$7$."
      },
      {
        "problem": "Given $P(Y=0\\mid X=x)=0.2$ and $P(Y=5\\mid X=x)=0.8$, find the squared-loss optimal prediction.",
        "steps": [
          {
            "do": "Recall optimum",
            "result": "$E[Y\\mid X=x]$",
            "why": "conditional mean minimizes squared loss"
          },
          {
            "do": "Compute mean",
            "result": "$0\\cdot0.2+5\\cdot0.8$",
            "why": "weighted average"
          },
          {
            "do": "Simplify",
            "result": "$4$",
            "why": "multiply"
          },
          {
            "do": "Interpret",
            "result": "balance point",
            "why": "squared error is minimized"
          },
          {
            "do": "State prediction",
            "result": "$4$",
            "why": "answer"
          }
        ],
        "answer": "The optimal prediction is $4$."
      }
    ],
    "applications": [
      {
        "title": "Regression",
        "background": "The ideal squared-loss predictor is conditional expectation.",
        "numbers": "If $Y=0$ with probability $0.3$ and $10$ with probability $0.7$, prediction is $7$."
      },
      {
        "title": "Recommendations",
        "background": "Context-specific averages estimate engagement.",
        "numbers": "Mobile mean $3$ and desktop mean $5$ with $60\\%$ mobile gives total $3.8$."
      },
      {
        "title": "Imputation",
        "background": "Missing values are often filled with conditional group means.",
        "numbers": "Returning-user mean spend $50$ suggests imputing $50$ for a missing returning-user spend."
      },
      {
        "title": "Reinforcement learning",
        "background": "A value function is expected return conditional on state.",
        "numbers": "Reward $10$ with probability $0.4$ and $0$ otherwise gives value $4$."
      },
      {
        "title": "Calibration",
        "background": "Calibration checks conditional label frequency given predicted score.",
        "numbers": "If $160$ of $200$ examples scored $0.8$ are positive, conditional mean is $0.8$."
      },
      {
        "title": "Segment monitoring",
        "background": "Overall metrics are weighted averages of segment metrics.",
        "numbers": "Means $2$ and $8$ with weights $0.75$ and $0.25$ give total $3.5$."
      }
    ],
    "applicationsClose": "Conditional expectation is averaging with information included, then using that average as a prediction.",
    "takeaways": [
      "$E[Y\\mid X=x]$ is the average of $Y$ after observing $X=x$.",
      "$E[Y\\mid X]$ is itself a random variable.",
      "The law of total expectation says $E[Y]=E[E[Y\\mid X]]$.",
      "Conditional expectation is the ideal squared-loss predictor."
    ]
  },
  "math-17-34": {
    "id": "math-17-34",
    "title": "Markov's inequality",
    "tagline": "A nonnegative random variable with a small mean cannot be large too often.",
    "connections": {
      "buildsOn": [
        "expectation",
        "nonnegative random variables",
        "probability bounds"
      ],
      "leadsTo": [
        "Chebyshev's inequality",
        "Hoeffding's inequality",
        "generalization bounds"
      ],
      "usedWith": [
        "tail probabilities",
        "indicator variables",
        "moments",
        "bounding arguments"
      ]
    },
    "motivation": "<p>Sometimes the mean is all you know. Markov's inequality still gives a tail bound for nonnegative quantities.</p><p>It is blunt, but it is the seed for many sharper concentration inequalities.</p>",
    "definition": "<p>If $X\\ge0$ and $a>0$, then $P(X\\ge a)\\le E[X]/a$.</p><p>Let $I=\\mathbf{1}_{\\{X\\ge a\\}}$. Since $X\\ge aI$, taking expectations gives $E[X]\\ge aP(X\\ge a)$.</p><p><b>Assumptions that matter:</b> $X$ must be nonnegative; $a$ must be positive; and the bound can be loose because it uses only the mean.</p>",
    "worked": {
      "problem": "A nonnegative runtime has mean $40$ ms. Bound $P(T\\ge200\\text{ ms})$.",
      "skills": [
        "tail bounds",
        "expectation"
      ],
      "strategy": "Divide the mean by the threshold.",
      "steps": [
        {
          "do": "Identify mean",
          "result": "$E[T]=40$",
          "why": "given"
        },
        {
          "do": "Identify threshold",
          "result": "$a=200$",
          "why": "tail event"
        },
        {
          "do": "Check nonnegative",
          "result": "$T\\ge0$",
          "why": "runtimes cannot be negative"
        },
        {
          "do": "Apply Markov",
          "result": "$P(T\\ge200)\\le40/200$",
          "why": "mean over threshold"
        },
        {
          "do": "Simplify",
          "result": "$0.20$",
          "why": "one fifth"
        }
      ],
      "verify": "The threshold is five times the mean, so the bound is one fifth.",
      "answer": "$P(T\\ge200\\text{ ms})\\le0.20$.",
      "connects": "Markov turns an average size into a universal tail guarantee."
    },
    "practice": [
      {
        "problem": "Nonnegative loss has mean $0.12$. Bound $P(L\\ge0.6)$.",
        "steps": [
          {
            "do": "Set threshold",
            "result": "$0.6$",
            "why": "event"
          },
          {
            "do": "Apply Markov",
            "result": "$0.12/0.6$",
            "why": "mean over threshold"
          },
          {
            "do": "Simplify",
            "result": "$0.2$",
            "why": "divide"
          },
          {
            "do": "Interpret",
            "result": "at most $20\\%$",
            "why": "tail fraction"
          },
          {
            "do": "Check condition",
            "result": "$L\\ge0$",
            "why": "loss is nonnegative"
          }
        ],
        "answer": "At most $0.2$."
      },
      {
        "problem": "Queue length has average $3$. Bound $P(Q\\ge10)$.",
        "steps": [
          {
            "do": "Mean",
            "result": "$3$",
            "why": "given"
          },
          {
            "do": "Threshold",
            "result": "$10$",
            "why": "event"
          },
          {
            "do": "Apply",
            "result": "$3/10$",
            "why": "Markov"
          },
          {
            "do": "Simplify",
            "result": "$0.3$",
            "why": "probability bound"
          },
          {
            "do": "Note looseness",
            "result": "actual may be smaller",
            "why": "mean-only bound"
          }
        ],
        "answer": "At most $0.3$."
      },
      {
        "problem": "If $E[X^2]=25$, bound $P(|X|\\ge10)$.",
        "steps": [
          {
            "do": "Rewrite event",
            "result": "$X^2\\ge100$",
            "why": "square both sides"
          },
          {
            "do": "Set $Z=X^2$",
            "result": "$Z\\ge0$",
            "why": "Markov variable"
          },
          {
            "do": "Mean of $Z$",
            "result": "$25$",
            "why": "given"
          },
          {
            "do": "Apply Markov",
            "result": "$25/100$",
            "why": "threshold"
          },
          {
            "do": "Simplify",
            "result": "$0.25$",
            "why": "bound"
          }
        ],
        "answer": "At most $0.25$."
      },
      {
        "problem": "Expected failed requests per hour is $2$. Bound probability of at least $8$ and at least $20$.",
        "steps": [
          {
            "do": "At least $8$",
            "result": "$2/8=0.25$",
            "why": "Markov"
          },
          {
            "do": "At least $20$",
            "result": "$2/20=0.10$",
            "why": "Markov"
          },
          {
            "do": "Compare",
            "result": "$0.10<0.25$",
            "why": "higher threshold"
          },
          {
            "do": "Check nonnegative",
            "result": "counts are nonnegative",
            "why": "condition"
          },
          {
            "do": "State both",
            "result": "$0.25$, $0.10$",
            "why": "summary"
          }
        ],
        "answer": "The bounds are $0.25$ and $0.10$."
      },
      {
        "problem": "Average nonnegative loss is $0.05$. Bound fraction with loss at least $0.5$.",
        "steps": [
          {
            "do": "Set random loss",
            "result": "$L$",
            "why": "random example"
          },
          {
            "do": "Threshold",
            "result": "$0.5$",
            "why": "high loss"
          },
          {
            "do": "Apply Markov",
            "result": "$0.05/0.5$",
            "why": "mean over threshold"
          },
          {
            "do": "Simplify",
            "result": "$0.10$",
            "why": "one tenth"
          },
          {
            "do": "Interpret",
            "result": "at most $10\\%$",
            "why": "population fraction"
          }
        ],
        "answer": "At most $10\\%$."
      }
    ],
    "applications": [
      {
        "title": "Latency bounds",
        "background": "Average latency alone bounds the fraction of very slow requests.",
        "numbers": "Mean $80$ ms gives $P(T\\ge400)\\le0.2$."
      },
      {
        "title": "Loss monitoring",
        "background": "Nonnegative loss fits Markov directly.",
        "numbers": "Mean loss $0.02$ gives $P(L\\ge0.2)\\le0.1$."
      },
      {
        "title": "Memory usage",
        "background": "Memory is nonnegative, so mean memory bounds high usage.",
        "numbers": "Mean $1.5$ GB gives $P(M\\ge6)\\le0.25$."
      },
      {
        "title": "Bad-event counts",
        "background": "Counts are nonnegative random variables.",
        "numbers": "Expected alerts $0.1$ gives probability of at least one at most $0.1$."
      },
      {
        "title": "Randomized algorithms",
        "background": "Runtime and collision counts often use Markov first.",
        "numbers": "Expected collisions $0.05$ gives $P(\\text{at least one})\\le0.05$."
      },
      {
        "title": "Path to Chebyshev",
        "background": "Markov on squared deviation gives Chebyshev.",
        "numbers": "If variance is $9$, then $P(|X-\\mu|\\ge6)\\le9/36=0.25$."
      }
    ],
    "applicationsClose": "Markov is humble but universal: nonnegative size plus mean already limits extreme frequency.",
    "takeaways": [
      "Markov says $P(X\\ge a)\\le E[X]/a$ for $X\\ge0$.",
      "The proof compares $X$ with $a\\mathbf{1}_{\\{X\\ge a\\}}$.",
      "It uses very little information and can be loose.",
      "It is the starting point for several stronger inequalities."
    ]
  },
  "math-17-35": {
    "id": "math-17-35",
    "title": "Chebyshev's inequality",
    "tagline": "Variance limits how often a variable can be far from its mean.",
    "connections": {
      "buildsOn": [
        "Markov's inequality",
        "variance",
        "standard deviation"
      ],
      "leadsTo": [
        "The Law of Large Numbers",
        "Hoeffding's inequality",
        "confidence intervals"
      ],
      "usedWith": [
        "tail probabilities",
        "squared deviations",
        "moments",
        "concentration"
      ]
    },
    "motivation": "<p>To bound distance from a mean, square the distance so it becomes nonnegative.</p><p>Chebyshev applies Markov to squared deviation and works for any distribution with finite variance.</p>",
    "definition": "<p>If $E[X]=\\mu$ and $\\operatorname{Var}(X)=\\sigma^2$, then $P(|X-\\mu|\\ge k)\\le\\sigma^2/k^2$.</p><p>This is Markov applied to $(X-\\mu)^2$: $P((X-\\mu)^2\\ge k^2)\\le E[(X-\\mu)^2]/k^2$.</p><p><b>Assumptions that matter:</b> mean and variance must exist; the bound is two-sided and distribution-free; it is often conservative.</p>",
    "worked": {
      "problem": "Scores have mean $70$ and standard deviation $8$. Bound the chance of being at least $20$ points from the mean.",
      "skills": [
        "variance",
        "tail bounds"
      ],
      "strategy": "Use variance over squared distance.",
      "steps": [
        {
          "do": "Set $\\sigma$",
          "result": "$8$",
          "why": "given sd"
        },
        {
          "do": "Compute variance",
          "result": "$64$",
          "why": "square sd"
        },
        {
          "do": "Set distance",
          "result": "$k=20$",
          "why": "tail distance"
        },
        {
          "do": "Apply Chebyshev",
          "result": "$64/20^2$",
          "why": "variance over squared distance"
        },
        {
          "do": "Simplify",
          "result": "$64/400=0.16$",
          "why": "compute"
        }
      ],
      "verify": "Twenty points is $2.5$ standard deviations, and $1/2.5^2=0.16$.",
      "answer": "The probability is at most $0.16$.",
      "connects": "Chebyshev is Markov applied to squared deviation."
    },
    "practice": [
      {
        "problem": "Mean $5$, variance $9$. Bound $P(|X-5|\\ge6)$.",
        "steps": [
          {
            "do": "Set distance",
            "result": "$6$",
            "why": "tail"
          },
          {
            "do": "Apply",
            "result": "$9/36$",
            "why": "Chebyshev"
          },
          {
            "do": "Simplify",
            "result": "$0.25$",
            "why": "bound"
          },
          {
            "do": "Interpret",
            "result": "outside probability",
            "why": "two-sided"
          },
          {
            "do": "Check",
            "result": "finite variance",
            "why": "given"
          }
        ],
        "answer": "At most $0.25$."
      },
      {
        "problem": "What minimum probability lies within $3$ standard deviations?",
        "steps": [
          {
            "do": "Outside bound",
            "result": "$1/3^2$",
            "why": "Chebyshev"
          },
          {
            "do": "Simplify",
            "result": "$1/9$",
            "why": "outside"
          },
          {
            "do": "Inside probability",
            "result": "$1-1/9$",
            "why": "complement"
          },
          {
            "do": "Simplify",
            "result": "$8/9$",
            "why": "inside"
          },
          {
            "do": "Approximate",
            "result": "$0.889$",
            "why": "percent scale"
          }
        ],
        "answer": "At least $8/9$."
      },
      {
        "problem": "Individual variance $16$, $n=25$. Bound $P(|\\bar X-\\mu|\\ge2)$.",
        "steps": [
          {
            "do": "Mean variance",
            "result": "$16/25$",
            "why": "average variance"
          },
          {
            "do": "Apply",
            "result": "$(16/25)/4$",
            "why": "Chebyshev"
          },
          {
            "do": "Simplify",
            "result": "$16/100=0.16$",
            "why": "compute"
          },
          {
            "do": "Interpret",
            "result": "at most $16\\%$",
            "why": "tail"
          },
          {
            "do": "Reason",
            "result": "averaging helps",
            "why": "variance shrinks"
          }
        ],
        "answer": "At most $0.16$."
      },
      {
        "problem": "Mean $100$, variance $400$. Bound probability outside $[60,140]$.",
        "steps": [
          {
            "do": "Distance",
            "result": "$40$",
            "why": "symmetric interval"
          },
          {
            "do": "Apply",
            "result": "$400/40^2$",
            "why": "Chebyshev"
          },
          {
            "do": "Simplify",
            "result": "$0.25$",
            "why": "bound"
          },
          {
            "do": "Inside bound",
            "result": "$0.75$",
            "why": "complement"
          },
          {
            "do": "State event",
            "result": "outside interval",
            "why": "tail"
          }
        ],
        "answer": "Outside probability is at most $0.25$."
      },
      {
        "problem": "Variance at most $4$. Find $n$ for $P(|\\bar X-\\mu|\\ge0.5)\\le0.05$ by Chebyshev.",
        "steps": [
          {
            "do": "Mean variance",
            "result": "$4/n$",
            "why": "average"
          },
          {
            "do": "Bound",
            "result": "$(4/n)/0.25=16/n$",
            "why": "Chebyshev"
          },
          {
            "do": "Set target",
            "result": "$16/n\\le0.05$",
            "why": "requirement"
          },
          {
            "do": "Solve",
            "result": "$n\\ge320$",
            "why": "divide"
          },
          {
            "do": "State sample size",
            "result": "$320$",
            "why": "minimum integer"
          }
        ],
        "answer": "$n=320$ is enough."
      }
    ],
    "applications": [
      {
        "title": "Quality control",
        "background": "Chebyshev works without a normal assumption.",
        "numbers": "Mean $2$ mm, sd $0.1$ mm gives $P(|X-2|\\ge0.5)\\le0.04$."
      },
      {
        "title": "Sample means",
        "background": "Chebyshev proves a finite-variance LLN.",
        "numbers": "Variance $9$, $n=100$ gives $P(|\\bar X-\\mu|\\ge1)\\le0.09$."
      },
      {
        "title": "Monitoring drift",
        "background": "Far-from-mean metrics can be flagged conservatively.",
        "numbers": "Mean $50$, sd $5$: outside $[35,65]$ is at most $1/9$."
      },
      {
        "title": "Runtime variation",
        "background": "Skewed runtimes can still use variance bounds.",
        "numbers": "Mean $10$, variance $4$ gives $P(|T-10|\\ge6)\\le4/36$."
      },
      {
        "title": "Sensor averaging",
        "background": "Averaging reduces variance and tail bounds.",
        "numbers": "Noise variance $25$ over $100$ readings gives average variance $0.25$."
      },
      {
        "title": "Normal comparison",
        "background": "Chebyshev is conservative but assumption-light.",
        "numbers": "At $3$ sds, Chebyshev says at most $11.1\\%$ outside; normal tails are about $0.27\\%$."
      }
    ],
    "applicationsClose": "Chebyshev is the variance guarantee: broad, conservative, and strong enough to prove averaging works.",
    "takeaways": [
      "Chebyshev says $P(|X-\\mu|\\ge k)\\le\\sigma^2/k^2$.",
      "It follows from Markov applied to squared deviation.",
      "It works for any finite-variance distribution.",
      "For sample means, the bound improves like $1/n$."
    ]
  },
  "math-17-36": {
    "id": "math-17-36",
    "title": "Jensen's inequality",
    "tagline": "For a convex function, transforming after averaging is no bigger than averaging after transforming.",
    "connections": {
      "buildsOn": [
        "expectation",
        "convex functions",
        "secant lines"
      ],
      "leadsTo": [
        "optimization",
        "variational bounds",
        "information theory"
      ],
      "usedWith": [
        "convexity",
        "tangent lines",
        "loss functions",
        "logarithms"
      ]
    },
    "motivation": "<p>A bowl-shaped function punishes spread. The average of squared values is usually larger than the square of the average.</p><p>Jensen's inequality is this curvature fact written for expectations.</p>",
    "definition": "<p>If $\\varphi$ is convex, then $\\varphi(E[X])\\le E[\\varphi(X)]$. If $\\varphi$ is concave, the inequality reverses.</p><p>For discrete $X$, convexity says $\\varphi(\\sum_i p_ix_i)\\le\\sum_i p_i\\varphi(x_i)$, which is exactly Jensen.</p><p><b>Assumptions that matter:</b> $\\varphi$ must be convex on the range of $X$; expectations must exist; equality holds for affine functions or constant inputs under strict convexity.</p>",
    "worked": {
      "problem": "Let $X$ be $0$ or $2$ equally likely and $\\varphi(x)=x^2$. Verify Jensen.",
      "skills": [
        "convexity",
        "expectation"
      ],
      "strategy": "Compare the square of the mean to the mean of the squares.",
      "steps": [
        {
          "do": "Compute $E[X]",
          "result": "$1$",
          "why": "average $0$ and $2$"
        },
        {
          "do": "Transform the mean",
          "result": "$1^2=1$",
          "why": "left side"
        },
        {
          "do": "Transform outcomes",
          "result": "$0^2=0$, $2^2=4$",
          "why": "right-side ingredients"
        },
        {
          "do": "Average transformed values",
          "result": "$(0+4)/2=2$",
          "why": "right side"
        },
        {
          "do": "Compare",
          "result": "$1\\le2$",
          "why": "Jensen holds"
        }
      ],
      "verify": "The inequality is strict because the square is curved and $X$ is not constant.",
      "answer": "$\\varphi(E[X])=1\\le2=E[\\varphi(X)]$.",
      "connects": "Jensen says convexity turns variability into extra average cost."
    },
    "practice": [
      {
        "problem": "$X=1$ with probability $0.25$ and $5$ with probability $0.75$. Verify Jensen for $x^2$.",
        "steps": [
          {
            "do": "Mean",
            "result": "$4$",
            "why": "weighted average"
          },
          {
            "do": "Square mean",
            "result": "$16$",
            "why": "left side"
          },
          {
            "do": "Average squares",
            "result": "$0.25\\cdot1+0.75\\cdot25=19$",
            "why": "right side"
          },
          {
            "do": "Compare",
            "result": "$16\\le19$",
            "why": "Jensen"
          },
          {
            "do": "Interpret",
            "result": "spread costs",
            "why": "convexity"
          }
        ],
        "answer": "$16\\le19$."
      },
      {
        "problem": "For $X=1,4$ equally likely, compare $E[\\log X]$ and $\\log E[X]$.",
        "steps": [
          {
            "do": "Mean",
            "result": "$2.5$",
            "why": "average"
          },
          {
            "do": "Log mean",
            "result": "$\\log2.5\\approx0.916$",
            "why": "right side for concave log"
          },
          {
            "do": "Average logs",
            "result": "$(0+1.386)/2=0.693$",
            "why": "left side"
          },
          {
            "do": "Compare",
            "result": "$0.693\\le0.916$",
            "why": "concave Jensen"
          },
          {
            "do": "Interpret",
            "result": "log rewards smoothing",
            "why": "concavity"
          }
        ],
        "answer": "$E[\\log X]\\le\\log E[X]$."
      },
      {
        "problem": "Use Jensen to show $E[X^2]\\ge(E[X])^2$.",
        "steps": [
          {
            "do": "Choose function",
            "result": "$\\varphi(x)=x^2$",
            "why": "convex"
          },
          {
            "do": "Apply Jensen",
            "result": "$\\varphi(E[X])\\le E[\\varphi(X)]$",
            "why": "the theorem"
          },
          {
            "do": "Substitute",
            "result": "$(E[X])^2\\le E[X^2]$",
            "why": "square function"
          },
          {
            "do": "Rearrange",
            "result": "$E[X^2]-(E[X])^2\\ge0$",
            "why": "variance nonnegative"
          },
          {
            "do": "Interpret",
            "result": "spread cannot make negative variance",
            "why": "core fact"
          }
        ],
        "answer": "$E[X^2]\\ge(E[X])^2$."
      },
      {
        "problem": "Losses $0.2$ and $1.8$ are equally likely. Compare square of mean loss to mean squared loss.",
        "steps": [
          {
            "do": "Mean loss",
            "result": "$1.0$",
            "why": "average"
          },
          {
            "do": "Square mean",
            "result": "$1.0$",
            "why": "left"
          },
          {
            "do": "Square losses",
            "result": "$0.04$, $3.24$",
            "why": "transform"
          },
          {
            "do": "Average squares",
            "result": "$1.64$",
            "why": "right"
          },
          {
            "do": "Compare",
            "result": "$1.00\\le1.64$",
            "why": "Jensen"
          }
        ],
        "answer": "Square of mean is $1.00$; mean squared loss is $1.64$."
      },
      {
        "problem": "For $X=-1,1$ equally likely, verify Jensen for $e^x$.",
        "steps": [
          {
            "do": "Mean",
            "result": "$0$",
            "why": "average"
          },
          {
            "do": "Exponentiate mean",
            "result": "$1$",
            "why": "$e^0$"
          },
          {
            "do": "Transform outcomes",
            "result": "$e^{-1}\\approx0.368$, $e\\approx2.718$",
            "why": "values"
          },
          {
            "do": "Average",
            "result": "$1.543$",
            "why": "right side"
          },
          {
            "do": "Compare",
            "result": "$1\\le1.543$",
            "why": "convex exponential"
          }
        ],
        "answer": "$e^{E[X]}\\le E[e^X]$."
      }
    ],
    "applications": [
      {
        "title": "Convex losses",
        "background": "Convex losses penalize variability in errors.",
        "numbers": "Errors $-1$ and $1$ have mean $0$, but mean squared loss $1$."
      },
      {
        "title": "Variational bounds",
        "background": "Jensen with log creates tractable likelihood lower bounds.",
        "numbers": "For $1$ and $4$, $E[\\log X]=0.693$ and $\\log E[X]=0.916$."
      },
      {
        "title": "Risk aversion",
        "background": "Concave utility values certainty.",
        "numbers": "$u(w)=\\sqrt w$ gives expected utility $5$ for $0$ or $100$, while $u(50)=7.07$."
      },
      {
        "title": "Regularization",
        "background": "Convex penalties grow with spread.",
        "numbers": "Weights $0$ and $4$ average squared penalty $8$, but average weight $2$ has penalty $4$."
      },
      {
        "title": "AM-GM",
        "background": "Jensen for concave log implies arithmetic mean beats geometric mean.",
        "numbers": "For $2$ and $8$, geometric mean $4$ is below arithmetic mean $5$."
      },
      {
        "title": "Planning under uncertainty",
        "background": "Convex costs make uncertain demand expensive.",
        "numbers": "Demand $5$ or $15$ has expected squared cost $125$, above cost at mean $100$."
      }
    ],
    "applicationsClose": "Jensen is curvature meeting uncertainty: convexity makes spread costly, concavity makes smoothing valuable.",
    "takeaways": [
      "For convex $\\varphi$, $\\varphi(E[X])\\le E[\\varphi(X)]$.",
      "For concave functions such as $\\log$, the inequality reverses.",
      "Jensen explains why $E[X^2]\\ge(E[X])^2$.",
      "It is central to convex optimization and variational bounds."
    ]
  },
  "math-17-37": {
    "id": "math-17-37",
    "title": "The Law of Large Numbers",
    "tagline": "Averages of independent repeated observations settle near the true mean.",
    "connections": {
      "buildsOn": [
        "expectation",
        "variance",
        "Chebyshev's inequality",
        "Sums of random variables and convolution"
      ],
      "leadsTo": [
        "The Central Limit Theorem",
        "Monte Carlo methods",
        "statistical estimation"
      ],
      "usedWith": [
        "sample means",
        "independence",
        "convergence in probability",
        "estimators"
      ]
    },
    "motivation": "<p>One toss is noisy; many tosses reveal the coin. That everyday trust in averages is a theorem.</p><p>The Law of Large Numbers says independent sample averages converge toward the population expectation.</p>",
    "definition": "<p>If $X_1,\\dots,X_n$ are iid with mean $\\mu$ and finite variance $\\sigma^2$, then $\\bar X_n=\\dfrac1n\\sum_iX_i$ satisfies $P(|\\bar X_n-\\mu|\\ge\\varepsilon)\\to0$ for every $\\varepsilon>0$.</p><p>Chebyshev proves this finite-variance version because $E[\\bar X_n]=\\mu$ and $\\operatorname{Var}(\\bar X_n)=\\sigma^2/n$.</p><p><b>Assumptions that matter:</b> this version uses independence, identical distribution, and finite variance; convergence is about large samples, not guaranteed accuracy in every small sample.</p>",
    "worked": {
      "problem": "Iid observations have mean $50$ and variance $25$. Bound $P(|\\bar X_{100}-50|\\ge2)$.",
      "skills": [
        "sample means",
        "Chebyshev"
      ],
      "strategy": "Find the variance of the average, then apply Chebyshev.",
      "steps": [
        {
          "do": "Mean of average",
          "result": "$50$",
          "why": "sample mean preserves mean"
        },
        {
          "do": "Variance of average",
          "result": "$25/100=0.25$",
          "why": "independent averaging divides by $n$"
        },
        {
          "do": "Set tolerance",
          "result": "$2$",
          "why": "error threshold"
        },
        {
          "do": "Apply Chebyshev",
          "result": "$0.25/2^2$",
          "why": "variance over squared error"
        },
        {
          "do": "Simplify",
          "result": "$0.0625$",
          "why": "one sixteenth"
        }
      ],
      "verify": "The variance is $100$ times smaller than for one observation.",
      "answer": "The probability is at most $0.0625$.",
      "connects": "The LLN comes from average variance shrinking like $1/n$."
    },
    "practice": [
      {
        "problem": "Iid mean $10$, variance $4$, $n=25$. Find mean and variance of sample mean.",
        "steps": [
          {
            "do": "Mean",
            "result": "$10$",
            "why": "sample mean preserves mean"
          },
          {
            "do": "Variance",
            "result": "$4/25$",
            "why": "divide by $n$"
          },
          {
            "do": "Simplify",
            "result": "$0.16$",
            "why": "compute"
          },
          {
            "do": "Sd",
            "result": "$0.4$",
            "why": "square root"
          },
          {
            "do": "Interpret",
            "result": "average is less noisy",
            "why": "variance shrinks"
          }
        ],
        "answer": "Mean $10$, variance $0.16$."
      },
      {
        "problem": "Use Chebyshev with variance $9$ and $n=36$ to bound error at least $1$.",
        "steps": [
          {
            "do": "Mean variance",
            "result": "$9/36=0.25$",
            "why": "average"
          },
          {
            "do": "Apply",
            "result": "$0.25/1^2$",
            "why": "Chebyshev"
          },
          {
            "do": "Simplify",
            "result": "$0.25$",
            "why": "bound"
          },
          {
            "do": "Inside probability",
            "result": "$0.75$",
            "why": "complement"
          },
          {
            "do": "Connect",
            "result": "LLN improves with $n$",
            "why": "larger samples help"
          }
        ],
        "answer": "At most $0.25$."
      },
      {
        "problem": "Find $n$ so variance $1$ and tolerance $0.1$ gives Chebyshev bound at most $0.04$.",
        "steps": [
          {
            "do": "Bound",
            "result": "$1/(n\\cdot0.1^2)$",
            "why": "sample mean"
          },
          {
            "do": "Simplify",
            "result": "$100/n$",
            "why": "since $0.1^2=0.01$"
          },
          {
            "do": "Set",
            "result": "$100/n\\le0.04$",
            "why": "target"
          },
          {
            "do": "Solve",
            "result": "$n\\ge2500$",
            "why": "divide"
          },
          {
            "do": "State",
            "result": "$2500$ samples",
            "why": "answer"
          }
        ],
        "answer": "$n=2500$."
      },
      {
        "problem": "Observed Monte Carlo average is $0.382$ and true mean is $0.370$. Compute absolute error.",
        "steps": [
          {
            "do": "Subtract",
            "result": "$0.382-0.370=0.012$",
            "why": "signed error"
          },
          {
            "do": "Absolute value",
            "result": "$0.012$",
            "why": "error magnitude"
          },
          {
            "do": "Percent points",
            "result": "$1.2$",
            "why": "as percentage points"
          },
          {
            "do": "Interpret",
            "result": "close estimate",
            "why": "small error"
          },
          {
            "do": "Connect",
            "result": "many samples stabilize averages",
            "why": "LLN intuition"
          }
        ],
        "answer": "Absolute error is $0.012$."
      },
      {
        "problem": "True accuracy $0.80$, $n=500$. Find expected validation accuracy and variance.",
        "steps": [
          {
            "do": "Model indicators",
            "result": "$X_i\\sim\\operatorname{Bernoulli}(0.8)$",
            "why": "correctness"
          },
          {
            "do": "Individual variance",
            "result": "$0.8\\cdot0.2=0.16$",
            "why": "Bernoulli"
          },
          {
            "do": "Mean of average",
            "result": "$0.80$",
            "why": "preserved"
          },
          {
            "do": "Variance of average",
            "result": "$0.16/500=0.00032$",
            "why": "divide by $n$"
          },
          {
            "do": "Sd",
            "result": "$\\sqrt{0.00032}\\approx0.0179$",
            "why": "typical fluctuation"
          }
        ],
        "answer": "Mean $0.80$, variance $0.00032$."
      }
    ],
    "applications": [
      {
        "title": "Monte Carlo integration",
        "background": "Random integrals are estimated by sample averages.",
        "numbers": "An average $0.312$ over $10000$ draws estimates $E[g(U)]$ as $0.312$."
      },
      {
        "title": "Validation metrics",
        "background": "Accuracy and loss are sample averages.",
        "numbers": "Accuracy $0.9$ with $n=1000$ has variance $0.09/1000=0.00009$."
      },
      {
        "title": "A/B tests",
        "background": "Group averages estimate population effects.",
        "numbers": "Conversion mean $0.06$ over $5000$ users gives expected conversions $300$."
      },
      {
        "title": "Stochastic gradients",
        "background": "Mini-batch gradients average example gradients.",
        "numbers": "Coordinate variance $16$ with batch $64$ becomes $0.25$."
      },
      {
        "title": "Sensor averaging",
        "background": "Repeated readings reduce independent noise.",
        "numbers": "Noise sd $3$ over $9$ readings gives average noise sd $1$."
      },
      {
        "title": "Simulation testing",
        "background": "Observed failure rates stabilize over many trials.",
        "numbers": "Failure probability $0.002$ over $100000$ trials gives expected failures $200$."
      }
    ],
    "applicationsClose": "The Law of Large Numbers is why repeated independent measurements become trustworthy averages.",
    "takeaways": [
      "Sample averages of iid finite-variance observations converge in probability to the mean.",
      "The sample mean has variance $\\sigma^2/n$.",
      "Chebyshev gives a clean proof of the weak law.",
      "The LLN justifies Monte Carlo, validation metrics, and A/B averages."
    ]
  },
  "math-17-38": {
    "id": "math-17-38",
    "title": "The Central Limit Theorem",
    "tagline": "Sums of many small independent effects often become approximately normal after centering and scaling.",
    "connections": {
      "buildsOn": [
        "The Law of Large Numbers",
        "Sums of random variables and convolution",
        "standardization"
      ],
      "leadsTo": [
        "confidence intervals",
        "normal approximations",
        "The multivariate Gaussian"
      ],
      "usedWith": [
        "sample means",
        "z-scores",
        "normal distribution",
        "asymptotics"
      ]
    },
    "motivation": "<p>The Law of Large Numbers says averages get close. The Central Limit Theorem describes the remaining error.</p><p>After centering and scaling, many different source distributions lead to the same bell-shaped normal limit.</p>",
    "definition": "<p>If $X_1,\\dots,X_n$ are iid with mean $\\mu$ and variance $\\sigma^2>0$, then $\\dfrac{\\sqrt n(\\bar X_n-\\mu)}{\\sigma}$ converges in distribution to $\\mathcal{N}(0,1)$. Thus $\\bar X_n\\approx\\mathcal{N}(\\mu,\\sigma^2/n)$ for large $n$.</p><p>The $\\sqrt n$ appears because the standard deviation of $\\bar X_n$ is $\\sigma/\\sqrt n$.</p><p><b>Assumptions that matter:</b> the classical form uses iid samples and finite nonzero variance; approximation quality depends on tails and sample size.</p>",
    "worked": {
      "problem": "A population has mean $100$, sd $15$, and $n=36$. Approximate $P(\\bar X>105)$.",
      "skills": [
        "CLT",
        "z-scores"
      ],
      "strategy": "Compute the standard error and convert the threshold to a standard normal tail.",
      "steps": [
        {
          "do": "Compute standard error",
          "result": "$15/\\sqrt{36}=2.5$",
          "why": "sd of the mean"
        },
        {
          "do": "Approximate distribution",
          "result": "$\\bar X\\approx\\mathcal{N}(100,2.5^2)$",
          "why": "CLT"
        },
        {
          "do": "Compute z-score",
          "result": "$(105-100)/2.5=2$",
          "why": "standardize"
        },
        {
          "do": "Use normal tail",
          "result": "$P(Z>2)\\approx0.0228$",
          "why": "table value"
        },
        {
          "do": "Translate back",
          "result": "$P(\\bar X>105)\\approx0.0228$",
          "why": "same standardized event"
        }
      ],
      "verify": "The threshold is two standard errors above the mean, so a small tail is sensible.",
      "answer": "Approximately $0.0228$.",
      "connects": "The CLT turns sample-mean errors into normal tail calculations."
    },
    "practice": [
      {
        "problem": "Mean $20$, sd $4$, $n=64$. Approximate distribution of sample mean.",
        "steps": [
          {
            "do": "Standard error",
            "result": "$4/8=0.5$",
            "why": "$\\sqrt{64}=8$"
          },
          {
            "do": "Mean",
            "result": "$20$",
            "why": "center"
          },
          {
            "do": "Variance",
            "result": "$0.25$",
            "why": "square standard error"
          },
          {
            "do": "Distribution",
            "result": "$\\mathcal{N}(20,0.25)$",
            "why": "CLT"
          },
          {
            "do": "Interpret",
            "result": "errors around $0.5$",
            "why": "scale"
          }
        ],
        "answer": "$\\bar X\\approx\\mathcal{N}(20,0.25)$."
      },
      {
        "problem": "Using that setup, approximate $P(\\bar X<19)$.",
        "steps": [
          {
            "do": "Standard error",
            "result": "$0.5$",
            "why": "from previous"
          },
          {
            "do": "Z-score",
            "result": "$(19-20)/0.5=-2$",
            "why": "standardize"
          },
          {
            "do": "Normal tail",
            "result": "$0.0228$",
            "why": "table"
          },
          {
            "do": "Translate",
            "result": "$P(\\bar X<19)\\approx0.0228$",
            "why": "answer"
          },
          {
            "do": "Check",
            "result": "two SEs low",
            "why": "small tail"
          }
        ],
        "answer": "Approximately $0.0228$."
      },
      {
        "problem": "Bernoulli $p=0.6$, $n=100$. Approximate distribution of sample proportion.",
        "steps": [
          {
            "do": "Mean",
            "result": "$0.6$",
            "why": "proportion mean"
          },
          {
            "do": "Variance one draw",
            "result": "$0.6\\cdot0.4=0.24$",
            "why": "Bernoulli"
          },
          {
            "do": "Variance average",
            "result": "$0.0024$",
            "why": "divide by 100"
          },
          {
            "do": "Sd",
            "result": "$0.049$",
            "why": "square root"
          },
          {
            "do": "Distribution",
            "result": "$\\mathcal{N}(0.6,0.0024)$",
            "why": "CLT"
          }
        ],
        "answer": "$\\hat p\\approx\\mathcal{N}(0.6,0.0024)$."
      },
      {
        "problem": "Sum of $100$ iid variables with mean $3$ and variance $2$. Approximate distribution.",
        "steps": [
          {
            "do": "Mean sum",
            "result": "$300$",
            "why": "add means"
          },
          {
            "do": "Variance sum",
            "result": "$200$",
            "why": "add variances"
          },
          {
            "do": "Sd sum",
            "result": "$\\sqrt{200}\\approx14.14$",
            "why": "scale"
          },
          {
            "do": "Distribution",
            "result": "$\\mathcal{N}(300,200)$",
            "why": "CLT"
          },
          {
            "do": "Interpret",
            "result": "sum is near 300",
            "why": "typical spread 14.14"
          }
        ],
        "answer": "$S_{100}\\approx\\mathcal{N}(300,200)$."
      },
      {
        "problem": "Accuracy $0.8$, $n=400$. Approximate $P(\\hat p<0.76)$.",
        "steps": [
          {
            "do": "Variance one draw",
            "result": "$0.16$",
            "why": "Bernoulli"
          },
          {
            "do": "Standard error",
            "result": "$\\sqrt{0.16/400}=0.02$",
            "why": "proportion"
          },
          {
            "do": "Z-score",
            "result": "$(0.76-0.80)/0.02=-2$",
            "why": "standardize"
          },
          {
            "do": "Tail",
            "result": "$0.0228$",
            "why": "normal table"
          },
          {
            "do": "Interpret",
            "result": "about $2.3\\%$",
            "why": "low estimate chance"
          }
        ],
        "answer": "Approximately $0.0228$."
      }
    ],
    "applications": [
      {
        "title": "Confidence intervals",
        "background": "Mean intervals use approximate normality of sample means.",
        "numbers": "$\\bar x=12$, $s=5$, $n=100$ gives rough $95\\%$ interval $12\\pm0.98$."
      },
      {
        "title": "A/B proportions",
        "background": "Conversion-rate estimates are often normal for large samples.",
        "numbers": "For $p=0.10$, $n=1000$, standard error is $\\sqrt{0.09/1000}\\approx0.0095$."
      },
      {
        "title": "Gradient noise",
        "background": "Averaged gradient coordinates can look normal by aggregation.",
        "numbers": "Variance $25$ with batch $100$ gives average sd $0.5$."
      },
      {
        "title": "Polling",
        "background": "Margins of error come from CLT standard errors.",
        "numbers": "Worst-case $p=0.5$, $n=1600$ gives standard error $0.0125$."
      },
      {
        "title": "Average latency",
        "background": "Average latency is more normal than individual skewed latency.",
        "numbers": "Request sd $80$ ms over $64$ requests gives average sd $10$ ms."
      },
      {
        "title": "Bell curves in nature",
        "background": "Many small independent causes add toward normality.",
        "numbers": "$50$ sources each variance $0.02$ give total variance $1$."
      }
    ],
    "applicationsClose": "The Central Limit Theorem explains why normal calculations appear whenever many small independent effects are averaged.",
    "takeaways": [
      "The standardized sample mean approaches $\\mathcal{N}(0,1)$.",
      "For large $n$, $\\bar X_n\\approx\\mathcal{N}(\\mu,\\sigma^2/n)$.",
      "The standard error is $\\sigma/\\sqrt n$.",
      "The CLT supports normal approximations for means, sums, and proportions."
    ]
  },
  "math-17-39": {
    "id": "math-17-39",
    "title": "Hoeffding's inequality",
    "tagline": "Bounded independent averages concentrate exponentially around their means.",
    "connections": {
      "buildsOn": [
        "The Law of Large Numbers",
        "Chebyshev's inequality",
        "independent random variables"
      ],
      "leadsTo": [
        "generalization bounds",
        "bandits",
        "PAC learning"
      ],
      "usedWith": [
        "concentration",
        "sample means",
        "bounded variables",
        "exponential bounds"
      ]
    },
    "motivation": "<p>Chebyshev uses variance and gives a broad guarantee. If each observation is bounded, we can do better.</p><p>Hoeffding gives an explicit exponential tail bound for independent bounded averages.</p>",
    "definition": "<p>If independent $X_i\\in[0,1]$ and $\\bar X=\\dfrac1n\\sum_iX_i$, then $P(|\\bar X-E\\bar X|\\ge t)\\le2e^{-2nt^2}$.</p><p>Boundedness prevents a single observation from dominating, and independence makes repeated deviations exponentially unlikely.</p><p><b>Assumptions that matter:</b> observations must be independent and bounded; the displayed form is two-sided for $[0,1]$ variables; it is distribution-free within those limits.</p>",
    "worked": {
      "problem": "For $n=1000$ independent $0$-$1$ validation indicators, bound $P(|\\hat p-p|\\ge0.05)$.",
      "skills": [
        "bounded variables",
        "concentration"
      ],
      "strategy": "Substitute $n$ and $t$ into the two-sided Hoeffding bound.",
      "steps": [
        {
          "do": "Write bound",
          "result": "$2e^{-2nt^2}$",
          "why": "two-sided $[0,1]$ form"
        },
        {
          "do": "Substitute",
          "result": "$2e^{-2\\cdot1000\\cdot0.05^2}$",
          "why": "insert values"
        },
        {
          "do": "Square tolerance",
          "result": "$0.0025$",
          "why": "compute $0.05^2$"
        },
        {
          "do": "Compute exponent",
          "result": "$-5$",
          "why": "$-2\\cdot1000\\cdot0.0025$"
        },
        {
          "do": "Approximate",
          "result": "$2e^{-5}\\approx0.0135$",
          "why": "evaluate"
        }
      ],
      "verify": "The probability shrinks exponentially in $n$.",
      "answer": "The bound is approximately $0.0135$.",
      "connects": "Hoeffding is a sharp LLN-style guarantee for bounded independent averages."
    },
    "practice": [
      {
        "problem": "For $n=200$ bounded samples, bound error at least $0.10$.",
        "steps": [
          {
            "do": "Formula",
            "result": "$2e^{-2nt^2}$",
            "why": "Hoeffding"
          },
          {
            "do": "Substitute",
            "result": "$2e^{-2\\cdot200\\cdot0.01}$",
            "why": "$t^2=0.01$"
          },
          {
            "do": "Exponent",
            "result": "$-4$",
            "why": "multiply"
          },
          {
            "do": "Approximate",
            "result": "$0.0366$",
            "why": "$2e^{-4}$"
          },
          {
            "do": "Interpret",
            "result": "under $4\\%$",
            "why": "bound"
          }
        ],
        "answer": "At most about $0.0366$."
      },
      {
        "problem": "Find $n$ for $P(|\\bar X-E\\bar X|\\ge0.05)\\le0.01$.",
        "steps": [
          {
            "do": "Set bound",
            "result": "$2e^{-2n(0.05)^2}\\le0.01$",
            "why": "target"
          },
          {
            "do": "Simplify exponent",
            "result": "$e^{-0.005n}\\le0.005$",
            "why": "divide by 2"
          },
          {
            "do": "Take logs",
            "result": "$-0.005n\\le\\ln0.005$",
            "why": "log"
          },
          {
            "do": "Use value",
            "result": "$\\ln0.005\\approx-5.298$",
            "why": "number"
          },
          {
            "do": "Solve",
            "result": "$n\\ge1060$",
            "why": "round up"
          }
        ],
        "answer": "$1060$ samples are enough."
      },
      {
        "problem": "One-sided Hoeffding with $n=500$, $t=0.04$.",
        "steps": [
          {
            "do": "Formula",
            "result": "$e^{-2nt^2}$",
            "why": "one-sided"
          },
          {
            "do": "Substitute",
            "result": "$e^{-2\\cdot500\\cdot0.0016}$",
            "why": "square tolerance"
          },
          {
            "do": "Exponent",
            "result": "$-1.6$",
            "why": "compute"
          },
          {
            "do": "Approximate",
            "result": "$0.202$",
            "why": "evaluate"
          },
          {
            "do": "State",
            "result": "one-sided bound",
            "why": "no factor 2"
          }
        ],
        "answer": "At most about $0.202$."
      },
      {
        "problem": "Variables in $[2,5]$, $n=100$, $t=0.3$. Bound one-sided deviation.",
        "steps": [
          {
            "do": "Width",
            "result": "$3$",
            "why": "range length"
          },
          {
            "do": "Formula",
            "result": "$e^{-2nt^2/3^2}$",
            "why": "equal-width form"
          },
          {
            "do": "Substitute",
            "result": "$e^{-2\\cdot100\\cdot0.09/9}$",
            "why": "values"
          },
          {
            "do": "Exponent",
            "result": "$-2$",
            "why": "compute"
          },
          {
            "do": "Approximate",
            "result": "$0.135$",
            "why": "$e^{-2}$"
          }
        ],
        "answer": "At most about $0.135$."
      },
      {
        "problem": "Bandit arm mean estimate $0.62$ after $800$ pulls. Find two-sided Hoeffding radius for failure probability $0.05$.",
        "steps": [
          {
            "do": "Set equation",
            "result": "$2e^{-1600r^2}=0.05$",
            "why": "two-sided"
          },
          {
            "do": "Divide",
            "result": "$e^{-1600r^2}=0.025$",
            "why": "isolate"
          },
          {
            "do": "Log",
            "result": "$-1600r^2=\\ln0.025\\approx-3.689$",
            "why": "take logs"
          },
          {
            "do": "Solve square",
            "result": "$r^2\\approx0.002306$",
            "why": "divide"
          },
          {
            "do": "Square root",
            "result": "$r\\approx0.048$",
            "why": "radius"
          }
        ],
        "answer": "The radius is about $0.048$."
      }
    ],
    "applications": [
      {
        "title": "Generalization bounds",
        "background": "Bounded losses use Hoeffding to compare sample and population averages.",
        "numbers": "$n=10000$, $t=0.02$ gives $2e^{-8}\\approx0.00067$."
      },
      {
        "title": "A/B dashboards",
        "background": "Conversion indicators are bounded Bernoulli variables.",
        "numbers": "$n=5000$, $t=0.01$ gives $2e^{-1}\\approx0.736$."
      },
      {
        "title": "Bandits",
        "background": "Confidence bounds guide exploration.",
        "numbers": "After $1000$ pulls, radius $\\sqrt{\\ln40/2000}\\approx0.043$."
      },
      {
        "title": "Randomized tests",
        "background": "Pass-fail tests fit bounded concentration.",
        "numbers": "$n=2000$, $t=0.03$ gives $2e^{-3.6}\\approx0.0546$."
      },
      {
        "title": "CTR estimation",
        "background": "Clicks are $0$-$1$ outcomes.",
        "numbers": "$n=20000$, $t=0.005$ gives $2e^{-1}\\approx0.736$."
      },
      {
        "title": "Bounded ratings",
        "background": "Ratings can be rescaled to apply Hoeffding.",
        "numbers": "For ratings in $[1,5]$, $n=400$, $t=0.5$, one-sided bound is $e^{-12.5}\\approx0.0000037$."
      }
    ],
    "applicationsClose": "Hoeffding turns bounded independent data into explicit confidence, not just eventual convergence.",
    "takeaways": [
      "For independent $[0,1]$ variables, $P(|\\bar X-E\\bar X|\\ge t)\\le2e^{-2nt^2}$.",
      "Boundedness and independence give exponential concentration.",
      "The exponent grows with $n$ and $t^2$.",
      "Hoeffding supports learning bounds, bandits, and bounded metric estimates."
    ]
  },
  "math-17-40": {
    "id": "math-17-40",
    "title": "The multivariate Gaussian",
    "tagline": "The multivariate Gaussian packages means, variances, and correlations into one smooth distribution over vectors.",
    "connections": {
      "buildsOn": [
        "Correlation",
        "Covariance",
        "Transformations of random variables",
        "The Central Limit Theorem"
      ],
      "leadsTo": [
        "Gaussian processes",
        "Kalman filters",
        "linear Gaussian models"
      ],
      "usedWith": [
        "vectors",
        "matrices",
        "quadratic forms",
        "eigenvalues"
      ]
    },
    "motivation": "<p>The one-dimensional normal has a mean and variance. ML features are usually vectors, so we also need covariance between coordinates.</p><p>The multivariate Gaussian gives a complete vector normal model: a center point, an uncertainty ellipsoid, and clean behavior under linear transformations.</p>",
    "definition": "<p>A vector $X\\in\\mathbb{R}^d$ has distribution $\\mathcal{N}(\\mu,\\Sigma)$ with density $f(x)=\\dfrac{1}{(2\\pi)^{d/2}|\\Sigma|^{1/2}}\\exp\\left(-\\dfrac12(x-\\mu)^T\\Sigma^{-1}(x-\\mu)\\right)$ when $\\Sigma$ is positive definite.</p><p>The quadratic form measures distance in covariance units. Linear maps preserve Gaussianity: if $X\\sim\\mathcal{N}(\\mu,\\Sigma)$, then $AX+b\\sim\\mathcal{N}(A\\mu+b,A\\Sigma A^T)$.</p><p><b>Assumptions that matter:</b> the density formula needs positive definite covariance; semidefinite covariance gives a degenerate Gaussian; and for Gaussian vectors, zero covariance implies independence.</p>",
    "worked": {
      "problem": "Let $X\\sim\\mathcal{N}(\\mu,\\Sigma)$ with $\\mu=(2,1)^T$ and $\\Sigma=\\begin{pmatrix}4&1\\\\1&9\\end{pmatrix}$. For $S=[1,2]X+3$, find the distribution of $S$.",
      "skills": [
        "linear Gaussian models",
        "covariance matrices"
      ],
      "strategy": "A linear score of a Gaussian vector is Gaussian, so compute its mean and variance.",
      "steps": [
        {
          "do": "Set coefficient vector",
          "result": "$a=(1,2)^T$",
          "why": "score is $a^TX+3$"
        },
        {
          "do": "Compute mean",
          "result": "$a^T\\mu+3=2+2+3=7$",
          "why": "linear mean plus bias"
        },
        {
          "do": "Compute $\\Sigma a$",
          "result": "$\\begin{pmatrix}6\\\\19\\end{pmatrix}$",
          "why": "matrix-vector product"
        },
        {
          "do": "Compute variance",
          "result": "$a^T\\Sigma a=[1,2]\\begin{pmatrix}6\\\\19\\end{pmatrix}=44$",
          "why": "variance of a linear combination"
        },
        {
          "do": "State distribution",
          "result": "$S\\sim\\mathcal{N}(7,44)$",
          "why": "linear image remains Gaussian"
        }
      ],
      "verify": "The variance is positive, and the bias changes only the mean.",
      "answer": "$S\\sim\\mathcal{N}(7,44)$.",
      "connects": "Multivariate Gaussian calculations are mean and covariance propagation."
    },
    "practice": [
      {
        "problem": "For covariance $\\begin{pmatrix}1&0\\\\0&4\\end{pmatrix}$ and mean $0$, find marginals.",
        "steps": [
          {
            "do": "Read means",
            "result": "$0,0$",
            "why": "mean vector"
          },
          {
            "do": "Read variances",
            "result": "$1,4$",
            "why": "diagonal"
          },
          {
            "do": "First marginal",
            "result": "$\\mathcal{N}(0,1)$",
            "why": "Gaussian marginal"
          },
          {
            "do": "Second marginal",
            "result": "$\\mathcal{N}(0,4)$",
            "why": "Gaussian marginal"
          },
          {
            "do": "Note covariance",
            "result": "$0$",
            "why": "coordinates are independent for Gaussian"
          }
        ],
        "answer": "$X_1\\sim\\mathcal{N}(0,1)$ and $X_2\\sim\\mathcal{N}(0,4)$."
      },
      {
        "problem": "For $\\Sigma=\\begin{pmatrix}9&3\\\\3&4\\end{pmatrix}$, compute coordinate correlation.",
        "steps": [
          {
            "do": "Covariance",
            "result": "$3$",
            "why": "off-diagonal"
          },
          {
            "do": "Sds",
            "result": "$3$ and $2$",
            "why": "square roots of diagonal"
          },
          {
            "do": "Normalize",
            "result": "$3/(3\\cdot2)$",
            "why": "formula"
          },
          {
            "do": "Simplify",
            "result": "$0.5$",
            "why": "correlation"
          },
          {
            "do": "Interpret",
            "result": "moderate positive",
            "why": "coordinates move together"
          }
        ],
        "answer": "Correlation is $0.5$."
      },
      {
        "problem": "Transform $X\\sim\\mathcal{N}((1,2)^T,\\begin{pmatrix}2&0\\\\0&8\\end{pmatrix})$ by $A=\\begin{pmatrix}1&0\\\\0&1/2\\end{pmatrix}$.",
        "steps": [
          {
            "do": "Mean",
            "result": "$A\\mu=(1,1)^T$",
            "why": "scale second coordinate"
          },
          {
            "do": "Covariance rule",
            "result": "$A\\Sigma A^T$",
            "why": "linear transform"
          },
          {
            "do": "Scale variances",
            "result": "$2$ and $8(1/2)^2=2$",
            "why": "diagonal"
          },
          {
            "do": "New covariance",
            "result": "$\\begin{pmatrix}2&0\\\\0&2\\end{pmatrix}$",
            "why": "result"
          },
          {
            "do": "State distribution",
            "result": "$\\mathcal{N}((1,1)^T,\\begin{pmatrix}2&0\\\\0&2\\end{pmatrix})$",
            "why": "Gaussian preserved"
          }
        ],
        "answer": "$Y\\sim\\mathcal{N}((1,1)^T,\\begin{pmatrix}2&0\\\\0&2\\end{pmatrix})$."
      },
      {
        "problem": "For covariance $\\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}$, find variance of $X_1+X_2$.",
        "steps": [
          {
            "do": "Set vector",
            "result": "$a=(1,1)^T$",
            "why": "sum"
          },
          {
            "do": "Use formula",
            "result": "$a^T\\Sigma a$",
            "why": "linear variance"
          },
          {
            "do": "Compute $\\Sigma a$",
            "result": "$(3,3)^T$",
            "why": "row sums"
          },
          {
            "do": "Dot",
            "result": "$6$",
            "why": "$(1,1)\\cdot(3,3)$"
          },
          {
            "do": "Check",
            "result": "$2+2+2\\cdot1=6$",
            "why": "sum variance formula"
          }
        ],
        "answer": "Variance is $6$."
      },
      {
        "problem": "Gaussian embedding has mean $0$ and identity covariance. Score $S=0.6X_1-0.8X_2+0.5$. Find score distribution.",
        "steps": [
          {
            "do": "Coefficient",
            "result": "$a=(0.6,-0.8)^T$",
            "why": "weights"
          },
          {
            "do": "Mean",
            "result": "$0.5$",
            "why": "bias only"
          },
          {
            "do": "Variance",
            "result": "$0.6^2+(-0.8)^2$",
            "why": "identity covariance"
          },
          {
            "do": "Simplify",
            "result": "$1$",
            "why": "weights have unit length"
          },
          {
            "do": "Distribution",
            "result": "$\\mathcal{N}(0.5,1)$",
            "why": "linear Gaussian"
          }
        ],
        "answer": "$S\\sim\\mathcal{N}(0.5,1)$."
      }
    ],
    "applications": [
      {
        "title": "Linear classifiers",
        "background": "A linear score of Gaussian embeddings is Gaussian.",
        "numbers": "If $S\\sim\\mathcal{N}(0.5,1)$, then $P(S>1.5)\\approx0.1587$."
      },
      {
        "title": "Mahalanobis anomaly detection",
        "background": "Gaussian distance accounts for covariance scale.",
        "numbers": "With variances $4$ and $9$, point $(4,3)$ has score $4^2/4+3^2/9=5$."
      },
      {
        "title": "Kalman filters",
        "background": "Gaussian state beliefs update by mean and covariance propagation.",
        "numbers": "Variance $2$ plus process-noise variance $0.5$ predicts variance $2.5$."
      },
      {
        "title": "PCA ellipses",
        "background": "Covariance eigenvectors are Gaussian ellipse axes.",
        "numbers": "Covariance $\\begin{pmatrix}5&0\\\\0&1\\end{pmatrix}$ has axis sds $\\sqrt5$ and $1$."
      },
      {
        "title": "Gaussian classifiers",
        "background": "Class-conditional Gaussians compare likelihoods.",
        "numbers": "Log-likelihoods $-3.2$ and $-4.5$ with equal priors favor the first by margin $1.3$."
      },
      {
        "title": "Uncertainty propagation",
        "background": "Linearized models push covariance through matrices.",
        "numbers": "$A=[2,0]$ and input covariance diag$(0.25,1)$ give output variance $1$."
      },
      {
        "title": "Correlated feature sampling",
        "background": "Off-diagonal covariance creates realistic feature co-movement.",
        "numbers": "Variances $1$ and $4$ with correlation $0.75$ imply covariance $0.75\\cdot1\\cdot2=1.5$."
      }
    ],
    "applicationsClose": "The multivariate Gaussian ties together covariance, correlation, transformations, sums, and CLT intuition in one ML-ready distribution.",
    "takeaways": [
      "A multivariate Gaussian is determined by $\\mu$ and $\\Sigma$.",
      "The quadratic form with $\\Sigma^{-1}$ is covariance-adjusted distance.",
      "Linear maps preserve Gaussianity through $A\\mu+b$ and $A\\Sigma A^T$.",
      "For Gaussian vectors, zero covariance implies independence.",
      "It is a capstone model for embeddings, classifiers, PCA, Kalman filters, and anomaly detection."
    ]
  }
};
