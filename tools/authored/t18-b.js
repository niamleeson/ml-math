module.exports = {
  "math-18-16": {
    "id": "math-18-16",
    "title": "Sufficiency",
    "tagline": "A sufficient statistic keeps exactly the sample information needed for the parameter question.",
    "connections": {
      "buildsOn": [
        "likelihood",
        "conditional probability",
        "estimators"
      ],
      "leadsTo": [
        "The exponential family",
        "The Cramér-Rao bound",
        "Rao-Blackwellization"
      ],
      "usedWith": [
        "factorization theorem",
        "maximum likelihood",
        "conditional distributions"
      ]
    },
    "motivation": "<p>You already know that data can often be summarized. For Bernoulli trials, the order $1,0,1,1,0$ may matter less than the count of successes, $3$.</p><p><b>Sufficiency</b> makes that compression precise. Once a sufficient statistic is known, the remaining sample pattern carries no further information about the parameter inside the assumed model.</p>",
    "definition": "<p>For data $X=(X_1,\\dots,X_n)$ and parameter $\\theta$, a statistic $T(X)$ is <b>sufficient</b> if the conditional distribution of $X$ given $T(X)$ does not depend on $\\theta$. The factorization theorem gives the common test: $$f_\\theta(x)=g_\\theta(T(x))h(x).$$ All parameter dependence flows through $T(x)$.</p><p>Why this works: if two samples have the same $T$, their likelihood ratio cancels the $g_\\theta$ part and leaves only $h(x)/h(y)$, which is parameter-free. The leftover arrangement is then not evidence about $\\theta$.</p><p><b>Assumptions that matter:</b> sufficiency is model-dependent; support conditions must be handled carefully; $T$ may be vector-valued; and a sufficient statistic need not be minimal.</p>",
    "worked": {
      "problem": "For $X_i\\sim\\operatorname{Bernoulli}(p)$, show $T=\\sum_iX_i$ is sufficient for $p$.",
      "skills": [
        "joint likelihood",
        "factorization theorem",
        "Bernoulli models"
      ],
      "strategy": "The order looks distracting — collect the likelihood so all dependence on $p$ passes through the success count.",
      "steps": [
        {
          "do": "Write the joint mass",
          "result": "$f_p(x)=\\prod_i p^{x_i}(1-p)^{1-x_i}$",
          "why": "independent Bernoulli probabilities multiply"
        },
        {
          "do": "Combine powers of $p$",
          "result": "$p^{\\sum_i x_i}$",
          "why": "multiplying equal bases adds exponents"
        },
        {
          "do": "Combine powers of $1-p$",
          "result": "$(1-p)^{n-\\sum_i x_i}$",
          "why": "there are $n-sum_i x_i$ failures"
        },
        {
          "do": "Name the statistic",
          "result": "$T(x)=\\sum_i x_i$",
          "why": "the likelihood uses the sample through this count"
        },
        {
          "do": "Factor the likelihood",
          "result": "$f_p(x)=p^{T(x)}(1-p)^{n-T(x)}\\cdot1$",
          "why": "this has $g_p(T(x))h(x)$ form"
        }
      ],
      "verify": "Two samples with the same number of successes have the same likelihood for every $p$.",
      "answer": "$T=\\sum_iX_i$ is sufficient for $p$.",
      "connects": "Sufficiency is a proof-backed way to compress data for inference."
    },
    "practice": [
      {
        "problem": "For $X_i\\sim\\operatorname{Poisson}(\\lambda)$, show $T=\\sum_iX_i$ is sufficient.",
        "steps": [
          {
            "do": "Write the joint mass",
            "result": "$\\prod_i e^{-\\lambda}\\lambda^{x_i}/x_i!$",
            "why": "independence multiplies probabilities"
          },
          {
            "do": "Combine exponential factors",
            "result": "$e^{-n\\lambda}$",
            "why": "there are $n$ identical factors"
          },
          {
            "do": "Combine powers of $lambda$",
            "result": "$\\lambda^{\\sum_i x_i}$",
            "why": "exponents add"
          },
          {
            "do": "Separate factorial terms",
            "result": "$\\prod_i1/x_i!$",
            "why": "these do not contain $lambda$"
          },
          {
            "do": "State the factorization",
            "result": "$e^{-n\\lambda}\\lambda^{T(x)}\\prod_i1/x_i!$",
            "why": "all parameter dependence is through $T$"
          }
        ],
        "answer": "$T=\\sum_iX_i$ is sufficient for $\\lambda$."
      },
      {
        "problem": "For Normal$(\\mu,\\sigma^2)$ with known $\\sigma^2$, show $\\bar X$ is sufficient for $\\mu$.",
        "steps": [
          {
            "do": "Write the likelihood kernel",
            "result": "$\\exp\\{-\\sum_i(x_i-\\mu)^2/(2\\sigma^2)\\}$",
            "why": "normal densities multiply"
          },
          {
            "do": "Expand the square sum",
            "result": "$\\sum_i x_i^2-2\\mu\\sum_i x_i+n\\mu^2$",
            "why": "collect terms with $mu$"
          },
          {
            "do": "Separate factors",
            "result": "$\\exp\\{\\mu\\sum_i x_i/\\sigma^2-n\\mu^2/(2\\sigma^2)\\}\\exp\\{-\\sum_i x_i^2/(2\\sigma^2)\\}$",
            "why": "split parameter and parameter-free parts"
          },
          {
            "do": "Identify the sufficient statistic",
            "result": "$T=\\sum_i x_i$",
            "why": "the parameter part uses only the sum"
          },
          {
            "do": "Convert to mean",
            "result": "$\\bar X=T/n$",
            "why": "one-to-one transformations preserve information"
          }
        ],
        "answer": "$\\bar X$ is sufficient for $\\mu$."
      },
      {
        "problem": "Two Bernoulli samples are $x=(1,0,1,0)$ and $y=(1,1,0,0)$. Compare their likelihoods.",
        "steps": [
          {
            "do": "Compute $T(x)$",
            "result": "$T(x)=2$",
            "why": "two successes"
          },
          {
            "do": "Compute $T(y)$",
            "result": "$T(y)=2$",
            "why": "two successes again"
          },
          {
            "do": "Write $L_x(p)$",
            "result": "$p^2(1-p)^2$",
            "why": "two successes and two failures"
          },
          {
            "do": "Write $L_y(p)$",
            "result": "$p^2(1-p)^2$",
            "why": "same count gives same likelihood"
          },
          {
            "do": "Compare the ratio",
            "result": "$L_x(p)/L_y(p)=1$",
            "why": "the order is parameter-free"
          }
        ],
        "answer": "They contain the same information about $p$ under the Bernoulli model."
      },
      {
        "problem": "For exponential data with density $\\lambda e^{-\\lambda x}$ on $x\\ge0$, find a sufficient statistic.",
        "steps": [
          {
            "do": "Write the joint density",
            "result": "$\\prod_i\\lambda e^{-\\lambda x_i}$",
            "why": "independence multiplies densities"
          },
          {
            "do": "Combine powers",
            "result": "$\\lambda^n$",
            "why": "one factor per observation"
          },
          {
            "do": "Combine exponents",
            "result": "$e^{-\\lambda\\sum_i x_i}$",
            "why": "exponents add"
          },
          {
            "do": "Include support",
            "result": "$\\mathbf{1}\\{x_i\\ge0\\ \\text{for all }i\\}$",
            "why": "the support is parameter-free"
          },
          {
            "do": "Identify the statistic",
            "result": "$T=\\sum_iX_i$",
            "why": "the parameter enters through the sum"
          }
        ],
        "answer": "$T=\\sum_iX_i$ is sufficient for $\\lambda$."
      },
      {
        "problem": "A Bernoulli dataset has $n=10$ and $T=7$. Write the likelihood and find the MLE.",
        "steps": [
          {
            "do": "Write the likelihood",
            "result": "$L(p)=p^7(1-p)^3$",
            "why": "seven successes and three failures"
          },
          {
            "do": "Write the log-likelihood",
            "result": "$\\ell(p)=7\\log p+3\\log(1-p)$",
            "why": "logs simplify products"
          },
          {
            "do": "Differentiate",
            "result": "$\\ell'(p)=7/p-3/(1-p)$",
            "why": "basic log derivatives"
          },
          {
            "do": "Set to zero",
            "result": "$7/p=3/(1-p)$",
            "why": "interior maximum condition"
          },
          {
            "do": "Solve",
            "result": "$7(1-p)=3p\\Rightarrow p=0.7$",
            "why": "combine like terms"
          }
        ],
        "answer": "$L(p)=p^7(1-p)^3$ and $\\hat p=0.7$."
      }
    ],
    "applications": [
      {
        "title": "Click-through counts",
        "background": "A/B dashboards often store impressions and clicks rather than every click sequence when a constant Bernoulli rate is the model.",
        "numbers": "With $1000$ impressions and $63$ clicks, the likelihood is $p^{63}(1-p)^{937}$."
      },
      {
        "title": "Failure monitoring",
        "background": "If requests fail independently with constant probability, the total failure count is sufficient for that probability.",
        "numbers": "In $500$ requests with $8$ failures, the MLE is $8/500=0.016$."
      },
      {
        "title": "Poisson arrivals",
        "background": "Queueing models often use Poisson rates, where total arrivals across windows summarize the rate.",
        "numbers": "Counts $[3,4,2,6]$ have total $15$, so $\\hat\\lambda=15/4=3.75$ per hour."
      },
      {
        "title": "Sensor calibration",
        "background": "Known-variance Gaussian readings can be summarized by their mean for estimating the offset.",
        "numbers": "Readings $[10.1,9.9,10.0,10.2]$ have $\\bar x=10.05$."
      },
      {
        "title": "Rao-Blackwellization",
        "background": "Conditioning on a sufficient statistic can reduce estimator variance while preserving unbiasedness.",
        "numbers": "Variance dropping from $0.040$ to $0.025$ is a $37.5\\%$ reduction."
      },
      {
        "title": "Privacy-aware aggregation",
        "background": "A sufficient summary can reduce raw-data exposure when the model truly only needs that summary.",
        "numbers": "For $200$ binary responses with $118$ yes responses, inference for constant $p$ uses $118$ and $200$."
      }
    ],
    "applicationsClose": "Sufficiency is compression with a mathematical warranty: what remains after the statistic is parameter-free detail.",
    "takeaways": [
      "A sufficient statistic makes the conditional distribution of the data parameter-free.",
      "The factorization theorem is the main practical proof tool.",
      "Counts and sums are sufficient in many classical models.",
      "Sufficiency depends on the assumed statistical model."
    ]
  },
  "math-18-17": {
    "id": "math-18-17",
    "title": "The exponential family",
    "tagline": "The exponential family is the common grammar behind Bernoulli, Poisson, normal, and many ML likelihoods.",
    "connections": {
      "buildsOn": [
        "sampling distributions",
        "likelihood",
        "standard error"
      ],
      "leadsTo": [
        "model comparison",
        "linear regression inference",
        "generalization analysis"
      ],
      "usedWith": [
        "estimators",
        "quantiles",
        "degrees of freedom"
      ]
    },
    "motivation": "<p>Many distributions look unrelated until you rewrite their likelihoods. Bernoulli uses powers of $p$, Poisson uses $\\lambda^x e^{-\\lambda}$, and normal models use squared errors.</p><p>The <b>exponential family</b> shows their shared shape: a statistic times a natural parameter, minus a log-normalizer. That shared shape powers GLMs and many ML losses.</p>",
    "definition": "<p>A regular exponential family has density or mass $$f_\\eta(x)=h(x)\\exp\\{\\eta^\\top T(x)-A(\\eta)\\}.$$ Here $T(x)$ is the sufficient statistic, $\\eta$ is the natural parameter, $A(\\eta)$ is the log-normalizer, and $h(x)$ is the base measure.</p><p>The normalizer is forced by total probability: $A(\\eta)=\\log\\int h(x)e^{\\eta^\\top T(x)}dx$. Its derivatives give moments, which is why optimization and inference become so clean.</p><p><b>Assumptions that matter:</b> $A(\\eta)$ must be finite; support should not change with $\\eta$ in the regular case; and vector families use dot products.</p>",
    "worked": {
      "problem": "Write Bernoulli$(p)$ as an exponential family.",
      "skills": [
        "exponential-family form",
        "standard errors",
        "statistical interpretation"
      ],
      "strategy": "Use the exponential-family form definition, compute one quantity at a time, and interpret the number in context.",
      "steps": [
        {
          "do": "Start with the mass",
          "result": "$p^x(1-p)^{1-x}$",
          "why": "Bernoulli probability"
        },
        {
          "do": "Factor out $1-p$",
          "result": "$(1-p)(p/(1-p))^x$",
          "why": "isolate the term raised to $x$"
        },
        {
          "do": "Convert to exponential form",
          "result": "$\\exp\\{x\\log(p/(1-p))+\\log(1-p)\\}$",
          "why": "powers become exponentials"
        },
        {
          "do": "Name the natural parameter",
          "result": "$\\eta=\\log(p/(1-p))$",
          "why": "the log-odds parameter"
        },
        {
          "do": "Name the normalizer",
          "result": "$A(\\eta)=\\log(1+e^\\eta)$",
          "why": "this makes probabilities sum to one"
        }
      ],
      "verify": "The number has the expected scale and direction for the stated data.",
      "answer": "Bernoulli has $T(x)=x$, $\\eta=\\log(p/(1-p))$, and $A(\\eta)=\\log(1+e^\\eta)$.",
      "connects": "This example shows exponential-family form as a concrete calculation rather than a slogan."
    },
    "practice": [
      {
        "problem": "Compute a standardized statistic for estimate $12$, null $10$, and SE $1$.",
        "steps": [
          {
            "do": "Write the formula",
            "result": "$(\\hat\\theta-\\theta_0)/SE$",
            "why": "standardized discrepancy"
          },
          {
            "do": "Substitute values",
            "result": "$(12-10)/1$",
            "why": "use the estimate, null, and standard error"
          },
          {
            "do": "Subtract",
            "result": "$2/1$",
            "why": "compute the numerator"
          },
          {
            "do": "Divide",
            "result": "$2$",
            "why": "standard-error units"
          },
          {
            "do": "Interpret",
            "result": "$2$ SE above the null",
            "why": "positive means above the null"
          }
        ],
        "answer": "The statistic is $2$."
      },
      {
        "problem": "Compute a two-sided normal p-value for $z=2$ using upper tail $0.0228$.",
        "steps": [
          {
            "do": "Identify one tail",
            "result": "$0.0228$",
            "why": "given normal upper-tail probability"
          },
          {
            "do": "Double it",
            "result": "$2\\cdot0.0228=0.0456$",
            "why": "two-sided test counts both directions"
          },
          {
            "do": "Compare to $0.05$",
            "result": "$0.0456<0.05$",
            "why": "small enough for 5 percent"
          },
          {
            "do": "State the decision",
            "result": "$\\text{reject}$",
            "why": "p-value below alpha"
          },
          {
            "do": "Name the evidence",
            "result": "$\\text{moderate evidence}$",
            "why": "near the conventional cutoff"
          }
        ],
        "answer": "The p-value is $0.0456$, so reject at $5\\%$."
      },
      {
        "problem": "Find a $95%$ interval for estimate $5$ with SE $0.5$.",
        "steps": [
          {
            "do": "Choose the critical value",
            "result": "$1.96$",
            "why": "standard normal 95 percent value"
          },
          {
            "do": "Compute the margin",
            "result": "$1.96\\cdot0.5=0.98$",
            "why": "critical value times SE"
          },
          {
            "do": "Compute the lower endpoint",
            "result": "$5-0.98=4.02$",
            "why": "subtract the margin"
          },
          {
            "do": "Compute the upper endpoint",
            "result": "$5+0.98=5.98$",
            "why": "add the margin"
          },
          {
            "do": "State interval",
            "result": "$[4.02,5.98]$",
            "why": "combine endpoints"
          }
        ],
        "answer": "The interval is $[4.02,5.98]$."
      },
      {
        "problem": "A sample size increase cuts SE from $0.10$ to $0.05$. What happens to a fixed effect $0.20$ in SE units?",
        "steps": [
          {
            "do": "Compute old signal",
            "result": "$0.20/0.10=2$",
            "why": "effect divided by old SE"
          },
          {
            "do": "Compute new signal",
            "result": "$0.20/0.05=4$",
            "why": "effect divided by new SE"
          },
          {
            "do": "Compare signals",
            "result": "$4/2=2$",
            "why": "standardized evidence doubled"
          },
          {
            "do": "Relate to variance",
            "result": "$0.05^2/0.10^2=0.25$",
            "why": "variance is one quarter as large"
          },
          {
            "do": "Interpret",
            "result": "$\\text{more precision}$",
            "why": "same effect is easier to detect"
          }
        ],
        "answer": "The signal grows from $2$ SE to $4$ SE."
      },
      {
        "problem": "The exponential family: a validation lift is $0.015$ with SE $0.006$. Test zero lift two-sided at $5%$.",
        "steps": [
          {
            "do": "Compute statistic",
            "result": "$0.015/0.006=2.5$",
            "why": "lift divided by standard error"
          },
          {
            "do": "Approximate p-value",
            "result": "$p\\approx0.0124$",
            "why": "two-sided normal tail for 2.5"
          },
          {
            "do": "Compare to alpha",
            "result": "$0.0124<0.05$",
            "why": "below the threshold"
          },
          {
            "do": "State decision",
            "result": "$\\text{reject zero lift}$",
            "why": "evidence supports a nonzero lift"
          },
          {
            "do": "Interpret practically",
            "result": "$1.5\\%$ estimated lift",
            "why": "statistical and practical meaning should both be considered"
          }
        ],
        "answer": "Reject zero lift; the estimated lift is statistically significant."
      }
    ],
    "applications": [
      {
        "title": "The exponential family in experiments",
        "background": "probability models appears whenever teams need a calibrated numerical decision rather than a hunch.",
        "numbers": "With estimate $0.12$ and SE $0.03$, the standardized value is $0.12/0.03=4$."
      },
      {
        "title": "The exponential family for model evaluation",
        "background": "probability models helps compare models on finite validation data, where random variation can mimic improvement.",
        "numbers": "A metric change $0.006$ with SE $0.002$ equals $3$ standard errors."
      },
      {
        "title": "The exponential family in monitoring",
        "background": "probability models turns noisy production measurements into thresholds that can be audited.",
        "numbers": "A baseline $10$ and current mean $10.6$ with SE $0.2$ gives statistic $3$."
      },
      {
        "title": "The exponential family for sample planning",
        "background": "probability models supports deciding whether more data are needed before trusting a conclusion.",
        "numbers": "Halving SE from $0.04$ to $0.02$ makes the same $0.06$ effect grow from $1.5$ to $3$ SE."
      },
      {
        "title": "The exponential family in fairness analysis",
        "background": "probability models is useful when rate differences across groups must be separated from sampling noise.",
        "numbers": "A gap $0.04$ with SE $0.015$ gives $z\\approx2.67$."
      },
      {
        "title": "The exponential family in scientific reporting",
        "background": "probability models gives a shared language for uncertainty, so readers can recompute the evidence.",
        "numbers": "An interval $0.20\\pm1.96(0.05)$ is $[0.102,0.298]$."
      }
    ],
    "applicationsClose": "The exponential family is one more uniform for the same habit: quantify uncertainty before making the decision.",
    "takeaways": [
      "Know the statistic and the distribution it is compared with.",
      "Check assumptions before trusting the reference distribution.",
      "Separate statistical significance from practical importance.",
      "Use real numbers to keep uncertainty interpretable."
    ]
  },
  "math-18-18": {
    "id": "math-18-18",
    "title": "The Cramér-Rao bound",
    "tagline": "The Cramér-Rao bound gives a best-possible variance benchmark for unbiased estimators.",
    "connections": {
      "buildsOn": [
        "sampling distributions",
        "likelihood",
        "standard error"
      ],
      "leadsTo": [
        "model comparison",
        "linear regression inference",
        "generalization analysis"
      ],
      "usedWith": [
        "estimators",
        "quantiles",
        "degrees of freedom"
      ]
    },
    "motivation": "<p>After choosing an estimator, you naturally ask whether another unbiased estimator could be much less noisy. The answer is sometimes no, and that is powerful.</p><p>The <b>Cramér-Rao bound</b> uses Fisher information to set a floor on unbiased estimator variance.</p>",
    "definition": "<p>For an unbiased scalar estimator $\\hat\\theta$, regularity conditions give $$\\operatorname{Var}(\\hat\\theta)\\ge\\frac{1}{I_n(\\theta)},$$ where $I_n(\\theta)=E[(\\partial_\\theta\\log L(\\theta;X))^2]$ is Fisher information.</p><p>The proof uses the score $S=\\partial_\\theta\\log L$: regularity gives $E[S]=0$ and $\\operatorname{Cov}(\\hat\\theta,S)=1$. Cauchy-Schwarz then forces $1\\le\\operatorname{Var}(\\hat\\theta)I_n(\\theta)$.</p><p><b>Assumptions that matter:</b> the estimator is unbiased; the model is regular; support issues are controlled; and equality is special.</p>",
    "worked": {
      "problem": "For Normal$(\\mu,\\sigma^2)$ with known $\\sigma^2$, find the CRLB for estimating $\\mu$.",
      "skills": [
        "Cramér-Rao bound",
        "standard errors",
        "statistical interpretation"
      ],
      "strategy": "Use the Cramér-Rao bound definition, compute one quantity at a time, and interpret the number in context.",
      "steps": [
        {
          "do": "Write the score",
          "result": "$S=(X-\\mu)/\\sigma^2$",
          "why": "differentiate the log-density"
        },
        {
          "do": "Square the score",
          "result": "$S^2=(X-\\mu)^2/\\sigma^4$",
          "why": "information is expected squared score"
        },
        {
          "do": "Take expectation",
          "result": "$I_1=\\sigma^2/\\sigma^4=1/\\sigma^2$",
          "why": "normal variance is $sigma^2$"
        },
        {
          "do": "Multiply by $n$",
          "result": "$I_n=n/\\sigma^2$",
          "why": "independent information adds"
        },
        {
          "do": "Invert",
          "result": "$1/I_n=\\sigma^2/n$",
          "why": "CRLB is reciprocal information"
        }
      ],
      "verify": "The number has the expected scale and direction for the stated data.",
      "answer": "The variance of any unbiased estimator is at least $\\sigma^2/n$.",
      "connects": "This example shows Cramér-Rao bound as a concrete calculation rather than a slogan."
    },
    "practice": [
      {
        "problem": "Compute a standardized statistic for estimate $12$, null $10$, and SE $1$.",
        "steps": [
          {
            "do": "Write the formula",
            "result": "$(\\hat\\theta-\\theta_0)/SE$",
            "why": "standardized discrepancy"
          },
          {
            "do": "Substitute values",
            "result": "$(12-10)/1$",
            "why": "use the estimate, null, and standard error"
          },
          {
            "do": "Subtract",
            "result": "$2/1$",
            "why": "compute the numerator"
          },
          {
            "do": "Divide",
            "result": "$2$",
            "why": "standard-error units"
          },
          {
            "do": "Interpret",
            "result": "$2$ SE above the null",
            "why": "positive means above the null"
          }
        ],
        "answer": "The statistic is $2$."
      },
      {
        "problem": "Compute a two-sided normal p-value for $z=2$ using upper tail $0.0228$.",
        "steps": [
          {
            "do": "Identify one tail",
            "result": "$0.0228$",
            "why": "given normal upper-tail probability"
          },
          {
            "do": "Double it",
            "result": "$2\\cdot0.0228=0.0456$",
            "why": "two-sided test counts both directions"
          },
          {
            "do": "Compare to $0.05$",
            "result": "$0.0456<0.05$",
            "why": "small enough for 5 percent"
          },
          {
            "do": "State the decision",
            "result": "$\\text{reject}$",
            "why": "p-value below alpha"
          },
          {
            "do": "Name the evidence",
            "result": "$\\text{moderate evidence}$",
            "why": "near the conventional cutoff"
          }
        ],
        "answer": "The p-value is $0.0456$, so reject at $5\\%$."
      },
      {
        "problem": "Find a $95%$ interval for estimate $5$ with SE $0.5$.",
        "steps": [
          {
            "do": "Choose the critical value",
            "result": "$1.96$",
            "why": "standard normal 95 percent value"
          },
          {
            "do": "Compute the margin",
            "result": "$1.96\\cdot0.5=0.98$",
            "why": "critical value times SE"
          },
          {
            "do": "Compute the lower endpoint",
            "result": "$5-0.98=4.02$",
            "why": "subtract the margin"
          },
          {
            "do": "Compute the upper endpoint",
            "result": "$5+0.98=5.98$",
            "why": "add the margin"
          },
          {
            "do": "State interval",
            "result": "$[4.02,5.98]$",
            "why": "combine endpoints"
          }
        ],
        "answer": "The interval is $[4.02,5.98]$."
      },
      {
        "problem": "A sample size increase cuts SE from $0.10$ to $0.05$. What happens to a fixed effect $0.20$ in SE units?",
        "steps": [
          {
            "do": "Compute old signal",
            "result": "$0.20/0.10=2$",
            "why": "effect divided by old SE"
          },
          {
            "do": "Compute new signal",
            "result": "$0.20/0.05=4$",
            "why": "effect divided by new SE"
          },
          {
            "do": "Compare signals",
            "result": "$4/2=2$",
            "why": "standardized evidence doubled"
          },
          {
            "do": "Relate to variance",
            "result": "$0.05^2/0.10^2=0.25$",
            "why": "variance is one quarter as large"
          },
          {
            "do": "Interpret",
            "result": "$\\text{more precision}$",
            "why": "same effect is easier to detect"
          }
        ],
        "answer": "The signal grows from $2$ SE to $4$ SE."
      },
      {
        "problem": "The Cramér-Rao bound: a validation lift is $0.015$ with SE $0.006$. Test zero lift two-sided at $5%$.",
        "steps": [
          {
            "do": "Compute statistic",
            "result": "$0.015/0.006=2.5$",
            "why": "lift divided by standard error"
          },
          {
            "do": "Approximate p-value",
            "result": "$p\\approx0.0124$",
            "why": "two-sided normal tail for 2.5"
          },
          {
            "do": "Compare to alpha",
            "result": "$0.0124<0.05$",
            "why": "below the threshold"
          },
          {
            "do": "State decision",
            "result": "$\\text{reject zero lift}$",
            "why": "evidence supports a nonzero lift"
          },
          {
            "do": "Interpret practically",
            "result": "$1.5\\%$ estimated lift",
            "why": "statistical and practical meaning should both be considered"
          }
        ],
        "answer": "Reject zero lift; the estimated lift is statistically significant."
      }
    ],
    "applications": [
      {
        "title": "The Cramér-Rao bound in experiments",
        "background": "estimator precision appears whenever teams need a calibrated numerical decision rather than a hunch.",
        "numbers": "With estimate $0.12$ and SE $0.03$, the standardized value is $0.12/0.03=4$."
      },
      {
        "title": "The Cramér-Rao bound for model evaluation",
        "background": "estimator precision helps compare models on finite validation data, where random variation can mimic improvement.",
        "numbers": "A metric change $0.006$ with SE $0.002$ equals $3$ standard errors."
      },
      {
        "title": "The Cramér-Rao bound in monitoring",
        "background": "estimator precision turns noisy production measurements into thresholds that can be audited.",
        "numbers": "A baseline $10$ and current mean $10.6$ with SE $0.2$ gives statistic $3$."
      },
      {
        "title": "The Cramér-Rao bound for sample planning",
        "background": "estimator precision supports deciding whether more data are needed before trusting a conclusion.",
        "numbers": "Halving SE from $0.04$ to $0.02$ makes the same $0.06$ effect grow from $1.5$ to $3$ SE."
      },
      {
        "title": "The Cramér-Rao bound in fairness analysis",
        "background": "estimator precision is useful when rate differences across groups must be separated from sampling noise.",
        "numbers": "A gap $0.04$ with SE $0.015$ gives $z\\approx2.67$."
      },
      {
        "title": "The Cramér-Rao bound in scientific reporting",
        "background": "estimator precision gives a shared language for uncertainty, so readers can recompute the evidence.",
        "numbers": "An interval $0.20\\pm1.96(0.05)$ is $[0.102,0.298]$."
      }
    ],
    "applicationsClose": "The Cramér-Rao bound is one more uniform for the same habit: quantify uncertainty before making the decision.",
    "takeaways": [
      "Know the statistic and the distribution it is compared with.",
      "Check assumptions before trusting the reference distribution.",
      "Separate statistical significance from practical importance.",
      "Use real numbers to keep uncertainty interpretable."
    ]
  },
  "math-18-19": {
    "id": "math-18-19",
    "title": "Confidence intervals",
    "tagline": "A confidence interval attaches a repeatable uncertainty promise to an estimate.",
    "connections": {
      "buildsOn": [
        "sampling distributions",
        "likelihood",
        "standard error"
      ],
      "leadsTo": [
        "model comparison",
        "linear regression inference",
        "generalization analysis"
      ],
      "usedWith": [
        "estimators",
        "quantiles",
        "degrees of freedom"
      ]
    },
    "motivation": "<p>A point estimate is a start, not a finish. Saying a model accuracy is $0.84$ matters more when you know whether the standard error is $0.002$ or $0.02$.</p><p>A <b>confidence interval</b> gives a calibrated range produced by a procedure with long-run coverage.</p>",
    "definition": "<p>A $100(1-\\alpha)\\%$ confidence interval is a random interval $[L(X),U(X)]$ whose procedure covers the fixed parameter with probability about $1-\\alpha$. A common large-sample form is $$\\hat\\theta\\pm z_{1-\\alpha/2}SE(\\hat\\theta).$$</p><p>This comes from the approximate pivot $(\\hat\\theta-\\theta)/SE\\approx N(0,1)$ and solving the central probability statement for $\\theta$.</p><p><b>Assumptions that matter:</b> the standard error must be appropriate; the approximation must be justified; and the confidence level describes the procedure, not a personal probability after seeing the interval.</p>",
    "worked": {
      "problem": "Find a $95\\%$ interval for $\\bar x=52$, known $\\sigma=10$, $n=100$.",
      "skills": [
        "confidence intervals",
        "standard errors",
        "statistical interpretation"
      ],
      "strategy": "Use the confidence intervals definition, compute one quantity at a time, and interpret the number in context.",
      "steps": [
        {
          "do": "Compute SE",
          "result": "$10/\\sqrt{100}=1$",
          "why": "average spread"
        },
        {
          "do": "Choose critical value",
          "result": "$1.96$",
          "why": "two-sided 95 percent normal value"
        },
        {
          "do": "Compute margin",
          "result": "$1.96\\cdot1=1.96$",
          "why": "critical value times SE"
        },
        {
          "do": "Compute lower endpoint",
          "result": "$52-1.96=50.04$",
          "why": "subtract margin"
        },
        {
          "do": "Compute upper endpoint",
          "result": "$52+1.96=53.96$",
          "why": "add margin"
        }
      ],
      "verify": "The number has the expected scale and direction for the stated data.",
      "answer": "The interval is $[50.04,53.96]$.",
      "connects": "This example shows confidence intervals as a concrete calculation rather than a slogan."
    },
    "practice": [
      {
        "problem": "Compute a standardized statistic for estimate $12$, null $10$, and SE $1$.",
        "steps": [
          {
            "do": "Write the formula",
            "result": "$(\\hat\\theta-\\theta_0)/SE$",
            "why": "standardized discrepancy"
          },
          {
            "do": "Substitute values",
            "result": "$(12-10)/1$",
            "why": "use the estimate, null, and standard error"
          },
          {
            "do": "Subtract",
            "result": "$2/1$",
            "why": "compute the numerator"
          },
          {
            "do": "Divide",
            "result": "$2$",
            "why": "standard-error units"
          },
          {
            "do": "Interpret",
            "result": "$2$ SE above the null",
            "why": "positive means above the null"
          }
        ],
        "answer": "The statistic is $2$."
      },
      {
        "problem": "Compute a two-sided normal p-value for $z=2$ using upper tail $0.0228$.",
        "steps": [
          {
            "do": "Identify one tail",
            "result": "$0.0228$",
            "why": "given normal upper-tail probability"
          },
          {
            "do": "Double it",
            "result": "$2\\cdot0.0228=0.0456$",
            "why": "two-sided test counts both directions"
          },
          {
            "do": "Compare to $0.05$",
            "result": "$0.0456<0.05$",
            "why": "small enough for 5 percent"
          },
          {
            "do": "State the decision",
            "result": "$\\text{reject}$",
            "why": "p-value below alpha"
          },
          {
            "do": "Name the evidence",
            "result": "$\\text{moderate evidence}$",
            "why": "near the conventional cutoff"
          }
        ],
        "answer": "The p-value is $0.0456$, so reject at $5\\%$."
      },
      {
        "problem": "Find a $95%$ interval for estimate $5$ with SE $0.5$.",
        "steps": [
          {
            "do": "Choose the critical value",
            "result": "$1.96$",
            "why": "standard normal 95 percent value"
          },
          {
            "do": "Compute the margin",
            "result": "$1.96\\cdot0.5=0.98$",
            "why": "critical value times SE"
          },
          {
            "do": "Compute the lower endpoint",
            "result": "$5-0.98=4.02$",
            "why": "subtract the margin"
          },
          {
            "do": "Compute the upper endpoint",
            "result": "$5+0.98=5.98$",
            "why": "add the margin"
          },
          {
            "do": "State interval",
            "result": "$[4.02,5.98]$",
            "why": "combine endpoints"
          }
        ],
        "answer": "The interval is $[4.02,5.98]$."
      },
      {
        "problem": "A sample size increase cuts SE from $0.10$ to $0.05$. What happens to a fixed effect $0.20$ in SE units?",
        "steps": [
          {
            "do": "Compute old signal",
            "result": "$0.20/0.10=2$",
            "why": "effect divided by old SE"
          },
          {
            "do": "Compute new signal",
            "result": "$0.20/0.05=4$",
            "why": "effect divided by new SE"
          },
          {
            "do": "Compare signals",
            "result": "$4/2=2$",
            "why": "standardized evidence doubled"
          },
          {
            "do": "Relate to variance",
            "result": "$0.05^2/0.10^2=0.25$",
            "why": "variance is one quarter as large"
          },
          {
            "do": "Interpret",
            "result": "$\\text{more precision}$",
            "why": "same effect is easier to detect"
          }
        ],
        "answer": "The signal grows from $2$ SE to $4$ SE."
      },
      {
        "problem": "Confidence intervals: a validation lift is $0.015$ with SE $0.006$. Test zero lift two-sided at $5%$.",
        "steps": [
          {
            "do": "Compute statistic",
            "result": "$0.015/0.006=2.5$",
            "why": "lift divided by standard error"
          },
          {
            "do": "Approximate p-value",
            "result": "$p\\approx0.0124$",
            "why": "two-sided normal tail for 2.5"
          },
          {
            "do": "Compare to alpha",
            "result": "$0.0124<0.05$",
            "why": "below the threshold"
          },
          {
            "do": "State decision",
            "result": "$\\text{reject zero lift}$",
            "why": "evidence supports a nonzero lift"
          },
          {
            "do": "Interpret practically",
            "result": "$1.5\\%$ estimated lift",
            "why": "statistical and practical meaning should both be considered"
          }
        ],
        "answer": "Reject zero lift; the estimated lift is statistically significant."
      }
    ],
    "applications": [
      {
        "title": "Confidence intervals in experiments",
        "background": "uncertainty reporting appears whenever teams need a calibrated numerical decision rather than a hunch.",
        "numbers": "With estimate $0.12$ and SE $0.03$, the standardized value is $0.12/0.03=4$."
      },
      {
        "title": "Confidence intervals for model evaluation",
        "background": "uncertainty reporting helps compare models on finite validation data, where random variation can mimic improvement.",
        "numbers": "A metric change $0.006$ with SE $0.002$ equals $3$ standard errors."
      },
      {
        "title": "Confidence intervals in monitoring",
        "background": "uncertainty reporting turns noisy production measurements into thresholds that can be audited.",
        "numbers": "A baseline $10$ and current mean $10.6$ with SE $0.2$ gives statistic $3$."
      },
      {
        "title": "Confidence intervals for sample planning",
        "background": "uncertainty reporting supports deciding whether more data are needed before trusting a conclusion.",
        "numbers": "Halving SE from $0.04$ to $0.02$ makes the same $0.06$ effect grow from $1.5$ to $3$ SE."
      },
      {
        "title": "Confidence intervals in fairness analysis",
        "background": "uncertainty reporting is useful when rate differences across groups must be separated from sampling noise.",
        "numbers": "A gap $0.04$ with SE $0.015$ gives $z\\approx2.67$."
      },
      {
        "title": "Confidence intervals in scientific reporting",
        "background": "uncertainty reporting gives a shared language for uncertainty, so readers can recompute the evidence.",
        "numbers": "An interval $0.20\\pm1.96(0.05)$ is $[0.102,0.298]$."
      }
    ],
    "applicationsClose": "Confidence intervals is one more uniform for the same habit: quantify uncertainty before making the decision.",
    "takeaways": [
      "Know the statistic and the distribution it is compared with.",
      "Check assumptions before trusting the reference distribution.",
      "Separate statistical significance from practical importance.",
      "Use real numbers to keep uncertainty interpretable."
    ]
  },
  "math-18-20": {
    "id": "math-18-20",
    "title": "Hypothesis testing",
    "tagline": "Hypothesis testing asks whether data are surprising under a baseline claim.",
    "connections": {
      "buildsOn": [
        "sampling distributions",
        "likelihood",
        "standard error"
      ],
      "leadsTo": [
        "model comparison",
        "linear regression inference",
        "generalization analysis"
      ],
      "usedWith": [
        "estimators",
        "quantiles",
        "degrees of freedom"
      ]
    },
    "motivation": "<p>When data differ from a baseline, the gentle question is whether the difference is bigger than ordinary sampling noise. Hypothesis testing makes that question precise.</p><p>We assume a null model, compute a statistic, and measure how extreme it is under that null.</p>",
    "definition": "<p>A test specifies $H_0$, $H_1$, a statistic, and a rejection rule. A <b>p-value</b> is the probability under $H_0$ of data at least as extreme as observed. Reject at level $\\alpha$ when $p\\le\\alpha$.</p><p>Many tests use $$z=(\\hat\\theta-\\theta_0)/SE.$$ Tail areas of the null distribution turn this standardized distance into a decision.</p><p><b>Assumptions that matter:</b> the null distribution must be valid; hypotheses should be chosen before peeking; and failing to reject does not prove the null.</p>",
    "worked": {
      "problem": "Test $H_0:\\mu=100$ versus two-sided $H_1$ with $\\bar x=104$, $\\sigma=15$, $n=100$.",
      "skills": [
        "hypothesis testing",
        "standard errors",
        "statistical interpretation"
      ],
      "strategy": "Use the hypothesis testing definition, compute one quantity at a time, and interpret the number in context.",
      "steps": [
        {
          "do": "Compute SE",
          "result": "$15/\\sqrt{100}=1.5$",
          "why": "known standard deviation"
        },
        {
          "do": "Compute z",
          "result": "$(104-100)/1.5=2.667$",
          "why": "standardized difference"
        },
        {
          "do": "Approximate p-value",
          "result": "$p\\approx0.0076$",
          "why": "two-sided normal tail"
        },
        {
          "do": "Compare to $0.05$",
          "result": "$0.0076<0.05$",
          "why": "small enough to reject"
        },
        {
          "do": "State decision",
          "result": "$\\text{reject }H_0$",
          "why": "evidence against the null"
        }
      ],
      "verify": "The number has the expected scale and direction for the stated data.",
      "answer": "Reject $H_0$ at the 5 percent level.",
      "connects": "This example shows hypothesis testing as a concrete calculation rather than a slogan."
    },
    "practice": [
      {
        "problem": "Compute a standardized statistic for estimate $12$, null $10$, and SE $1$.",
        "steps": [
          {
            "do": "Write the formula",
            "result": "$(\\hat\\theta-\\theta_0)/SE$",
            "why": "standardized discrepancy"
          },
          {
            "do": "Substitute values",
            "result": "$(12-10)/1$",
            "why": "use the estimate, null, and standard error"
          },
          {
            "do": "Subtract",
            "result": "$2/1$",
            "why": "compute the numerator"
          },
          {
            "do": "Divide",
            "result": "$2$",
            "why": "standard-error units"
          },
          {
            "do": "Interpret",
            "result": "$2$ SE above the null",
            "why": "positive means above the null"
          }
        ],
        "answer": "The statistic is $2$."
      },
      {
        "problem": "Compute a two-sided normal p-value for $z=2$ using upper tail $0.0228$.",
        "steps": [
          {
            "do": "Identify one tail",
            "result": "$0.0228$",
            "why": "given normal upper-tail probability"
          },
          {
            "do": "Double it",
            "result": "$2\\cdot0.0228=0.0456$",
            "why": "two-sided test counts both directions"
          },
          {
            "do": "Compare to $0.05$",
            "result": "$0.0456<0.05$",
            "why": "small enough for 5 percent"
          },
          {
            "do": "State the decision",
            "result": "$\\text{reject}$",
            "why": "p-value below alpha"
          },
          {
            "do": "Name the evidence",
            "result": "$\\text{moderate evidence}$",
            "why": "near the conventional cutoff"
          }
        ],
        "answer": "The p-value is $0.0456$, so reject at $5\\%$."
      },
      {
        "problem": "Find a $95%$ interval for estimate $5$ with SE $0.5$.",
        "steps": [
          {
            "do": "Choose the critical value",
            "result": "$1.96$",
            "why": "standard normal 95 percent value"
          },
          {
            "do": "Compute the margin",
            "result": "$1.96\\cdot0.5=0.98$",
            "why": "critical value times SE"
          },
          {
            "do": "Compute the lower endpoint",
            "result": "$5-0.98=4.02$",
            "why": "subtract the margin"
          },
          {
            "do": "Compute the upper endpoint",
            "result": "$5+0.98=5.98$",
            "why": "add the margin"
          },
          {
            "do": "State interval",
            "result": "$[4.02,5.98]$",
            "why": "combine endpoints"
          }
        ],
        "answer": "The interval is $[4.02,5.98]$."
      },
      {
        "problem": "A sample size increase cuts SE from $0.10$ to $0.05$. What happens to a fixed effect $0.20$ in SE units?",
        "steps": [
          {
            "do": "Compute old signal",
            "result": "$0.20/0.10=2$",
            "why": "effect divided by old SE"
          },
          {
            "do": "Compute new signal",
            "result": "$0.20/0.05=4$",
            "why": "effect divided by new SE"
          },
          {
            "do": "Compare signals",
            "result": "$4/2=2$",
            "why": "standardized evidence doubled"
          },
          {
            "do": "Relate to variance",
            "result": "$0.05^2/0.10^2=0.25$",
            "why": "variance is one quarter as large"
          },
          {
            "do": "Interpret",
            "result": "$\\text{more precision}$",
            "why": "same effect is easier to detect"
          }
        ],
        "answer": "The signal grows from $2$ SE to $4$ SE."
      },
      {
        "problem": "Hypothesis testing: a validation lift is $0.015$ with SE $0.006$. Test zero lift two-sided at $5%$.",
        "steps": [
          {
            "do": "Compute statistic",
            "result": "$0.015/0.006=2.5$",
            "why": "lift divided by standard error"
          },
          {
            "do": "Approximate p-value",
            "result": "$p\\approx0.0124$",
            "why": "two-sided normal tail for 2.5"
          },
          {
            "do": "Compare to alpha",
            "result": "$0.0124<0.05$",
            "why": "below the threshold"
          },
          {
            "do": "State decision",
            "result": "$\\text{reject zero lift}$",
            "why": "evidence supports a nonzero lift"
          },
          {
            "do": "Interpret practically",
            "result": "$1.5\\%$ estimated lift",
            "why": "statistical and practical meaning should both be considered"
          }
        ],
        "answer": "Reject zero lift; the estimated lift is statistically significant."
      }
    ],
    "applications": [
      {
        "title": "Hypothesis testing in experiments",
        "background": "evidence decisions appears whenever teams need a calibrated numerical decision rather than a hunch.",
        "numbers": "With estimate $0.12$ and SE $0.03$, the standardized value is $0.12/0.03=4$."
      },
      {
        "title": "Hypothesis testing for model evaluation",
        "background": "evidence decisions helps compare models on finite validation data, where random variation can mimic improvement.",
        "numbers": "A metric change $0.006$ with SE $0.002$ equals $3$ standard errors."
      },
      {
        "title": "Hypothesis testing in monitoring",
        "background": "evidence decisions turns noisy production measurements into thresholds that can be audited.",
        "numbers": "A baseline $10$ and current mean $10.6$ with SE $0.2$ gives statistic $3$."
      },
      {
        "title": "Hypothesis testing for sample planning",
        "background": "evidence decisions supports deciding whether more data are needed before trusting a conclusion.",
        "numbers": "Halving SE from $0.04$ to $0.02$ makes the same $0.06$ effect grow from $1.5$ to $3$ SE."
      },
      {
        "title": "Hypothesis testing in fairness analysis",
        "background": "evidence decisions is useful when rate differences across groups must be separated from sampling noise.",
        "numbers": "A gap $0.04$ with SE $0.015$ gives $z\\approx2.67$."
      },
      {
        "title": "Hypothesis testing in scientific reporting",
        "background": "evidence decisions gives a shared language for uncertainty, so readers can recompute the evidence.",
        "numbers": "An interval $0.20\\pm1.96(0.05)$ is $[0.102,0.298]$."
      }
    ],
    "applicationsClose": "Hypothesis testing is one more uniform for the same habit: quantify uncertainty before making the decision.",
    "takeaways": [
      "Know the statistic and the distribution it is compared with.",
      "Check assumptions before trusting the reference distribution.",
      "Separate statistical significance from practical importance.",
      "Use real numbers to keep uncertainty interpretable."
    ]
  },
  "math-18-21": {
    "id": "math-18-21",
    "title": "Type I and II errors",
    "tagline": "Type I and Type II errors name the two ways an uncertain test can be wrong.",
    "connections": {
      "buildsOn": [
        "sampling distributions",
        "likelihood",
        "standard error"
      ],
      "leadsTo": [
        "model comparison",
        "linear regression inference",
        "generalization analysis"
      ],
      "usedWith": [
        "estimators",
        "quantiles",
        "degrees of freedom"
      ]
    },
    "motivation": "<p>A spam filter can block a real email or let spam through. Statistical tests face the same two-direction risk.</p><p><b>Type I</b> means rejecting a true null. <b>Type II</b> means failing to reject a false null.</p>",
    "definition": "<p>The Type I error rate is $$\\alpha=P(\\text{reject }H_0\\mid H_0\\text{ true}).$$ The Type II error rate at an alternative is $$\\beta=P(\\text{fail to reject }H_0\\mid H_1\\text{ true}).$$ Power is $1-\\beta$.</p><p>Moving the cutoff to reduce $\\alpha$ usually raises $\\beta$ at fixed sample size. More data can reduce both by separating the null and alternative distributions.</p><p><b>Assumptions that matter:</b> $\\beta$ depends on a specific alternative; costs should guide the chosen cutoff; and these are long-run error rates.</p>",
    "worked": {
      "problem": "If $\\alpha=0.05$ and $\\beta=0.20$ for an alternative, find power and expected false positives among $1000$ true null tests.",
      "skills": [
        "error rates",
        "standard errors",
        "statistical interpretation"
      ],
      "strategy": "Use the error rates definition, compute one quantity at a time, and interpret the number in context.",
      "steps": [
        {
          "do": "Compute power",
          "result": "$1-0.20=0.80$",
          "why": "power complements Type II error"
        },
        {
          "do": "Write expected false positives",
          "result": "$\\alpha\\cdot1000$",
          "why": "Type I rate times true nulls"
        },
        {
          "do": "Substitute alpha",
          "result": "$0.05\\cdot1000$",
          "why": "given level"
        },
        {
          "do": "Multiply",
          "result": "$50$",
          "why": "expected Type I errors"
        },
        {
          "do": "Interpret",
          "result": "$80\\%$ detection and $50$ expected false alarms",
          "why": "two different truths"
        }
      ],
      "verify": "The number has the expected scale and direction for the stated data.",
      "answer": "Power is $0.80$, and about $50$ Type I errors are expected among $1000$ true nulls.",
      "connects": "This example shows error rates as a concrete calculation rather than a slogan."
    },
    "practice": [
      {
        "problem": "Compute a standardized statistic for estimate $12$, null $10$, and SE $1$.",
        "steps": [
          {
            "do": "Write the formula",
            "result": "$(\\hat\\theta-\\theta_0)/SE$",
            "why": "standardized discrepancy"
          },
          {
            "do": "Substitute values",
            "result": "$(12-10)/1$",
            "why": "use the estimate, null, and standard error"
          },
          {
            "do": "Subtract",
            "result": "$2/1$",
            "why": "compute the numerator"
          },
          {
            "do": "Divide",
            "result": "$2$",
            "why": "standard-error units"
          },
          {
            "do": "Interpret",
            "result": "$2$ SE above the null",
            "why": "positive means above the null"
          }
        ],
        "answer": "The statistic is $2$."
      },
      {
        "problem": "Compute a two-sided normal p-value for $z=2$ using upper tail $0.0228$.",
        "steps": [
          {
            "do": "Identify one tail",
            "result": "$0.0228$",
            "why": "given normal upper-tail probability"
          },
          {
            "do": "Double it",
            "result": "$2\\cdot0.0228=0.0456$",
            "why": "two-sided test counts both directions"
          },
          {
            "do": "Compare to $0.05$",
            "result": "$0.0456<0.05$",
            "why": "small enough for 5 percent"
          },
          {
            "do": "State the decision",
            "result": "$\\text{reject}$",
            "why": "p-value below alpha"
          },
          {
            "do": "Name the evidence",
            "result": "$\\text{moderate evidence}$",
            "why": "near the conventional cutoff"
          }
        ],
        "answer": "The p-value is $0.0456$, so reject at $5\\%$."
      },
      {
        "problem": "Find a $95%$ interval for estimate $5$ with SE $0.5$.",
        "steps": [
          {
            "do": "Choose the critical value",
            "result": "$1.96$",
            "why": "standard normal 95 percent value"
          },
          {
            "do": "Compute the margin",
            "result": "$1.96\\cdot0.5=0.98$",
            "why": "critical value times SE"
          },
          {
            "do": "Compute the lower endpoint",
            "result": "$5-0.98=4.02$",
            "why": "subtract the margin"
          },
          {
            "do": "Compute the upper endpoint",
            "result": "$5+0.98=5.98$",
            "why": "add the margin"
          },
          {
            "do": "State interval",
            "result": "$[4.02,5.98]$",
            "why": "combine endpoints"
          }
        ],
        "answer": "The interval is $[4.02,5.98]$."
      },
      {
        "problem": "A sample size increase cuts SE from $0.10$ to $0.05$. What happens to a fixed effect $0.20$ in SE units?",
        "steps": [
          {
            "do": "Compute old signal",
            "result": "$0.20/0.10=2$",
            "why": "effect divided by old SE"
          },
          {
            "do": "Compute new signal",
            "result": "$0.20/0.05=4$",
            "why": "effect divided by new SE"
          },
          {
            "do": "Compare signals",
            "result": "$4/2=2$",
            "why": "standardized evidence doubled"
          },
          {
            "do": "Relate to variance",
            "result": "$0.05^2/0.10^2=0.25$",
            "why": "variance is one quarter as large"
          },
          {
            "do": "Interpret",
            "result": "$\\text{more precision}$",
            "why": "same effect is easier to detect"
          }
        ],
        "answer": "The signal grows from $2$ SE to $4$ SE."
      },
      {
        "problem": "Type I and II errors: a validation lift is $0.015$ with SE $0.006$. Test zero lift two-sided at $5%$.",
        "steps": [
          {
            "do": "Compute statistic",
            "result": "$0.015/0.006=2.5$",
            "why": "lift divided by standard error"
          },
          {
            "do": "Approximate p-value",
            "result": "$p\\approx0.0124$",
            "why": "two-sided normal tail for 2.5"
          },
          {
            "do": "Compare to alpha",
            "result": "$0.0124<0.05$",
            "why": "below the threshold"
          },
          {
            "do": "State decision",
            "result": "$\\text{reject zero lift}$",
            "why": "evidence supports a nonzero lift"
          },
          {
            "do": "Interpret practically",
            "result": "$1.5\\%$ estimated lift",
            "why": "statistical and practical meaning should both be considered"
          }
        ],
        "answer": "Reject zero lift; the estimated lift is statistically significant."
      }
    ],
    "applications": [
      {
        "title": "Type I and II errors in experiments",
        "background": "decision risk appears whenever teams need a calibrated numerical decision rather than a hunch.",
        "numbers": "With estimate $0.12$ and SE $0.03$, the standardized value is $0.12/0.03=4$."
      },
      {
        "title": "Type I and II errors for model evaluation",
        "background": "decision risk helps compare models on finite validation data, where random variation can mimic improvement.",
        "numbers": "A metric change $0.006$ with SE $0.002$ equals $3$ standard errors."
      },
      {
        "title": "Type I and II errors in monitoring",
        "background": "decision risk turns noisy production measurements into thresholds that can be audited.",
        "numbers": "A baseline $10$ and current mean $10.6$ with SE $0.2$ gives statistic $3$."
      },
      {
        "title": "Type I and II errors for sample planning",
        "background": "decision risk supports deciding whether more data are needed before trusting a conclusion.",
        "numbers": "Halving SE from $0.04$ to $0.02$ makes the same $0.06$ effect grow from $1.5$ to $3$ SE."
      },
      {
        "title": "Type I and II errors in fairness analysis",
        "background": "decision risk is useful when rate differences across groups must be separated from sampling noise.",
        "numbers": "A gap $0.04$ with SE $0.015$ gives $z\\approx2.67$."
      },
      {
        "title": "Type I and II errors in scientific reporting",
        "background": "decision risk gives a shared language for uncertainty, so readers can recompute the evidence.",
        "numbers": "An interval $0.20\\pm1.96(0.05)$ is $[0.102,0.298]$."
      }
    ],
    "applicationsClose": "Type I and II errors is one more uniform for the same habit: quantify uncertainty before making the decision.",
    "takeaways": [
      "Know the statistic and the distribution it is compared with.",
      "Check assumptions before trusting the reference distribution.",
      "Separate statistical significance from practical importance.",
      "Use real numbers to keep uncertainty interpretable."
    ]
  },
  "math-18-22": {
    "id": "math-18-22",
    "title": "Statistical power",
    "tagline": "Power is the probability that a test notices an effect when that effect is real.",
    "connections": {
      "buildsOn": [
        "sampling distributions",
        "likelihood",
        "standard error"
      ],
      "leadsTo": [
        "model comparison",
        "linear regression inference",
        "generalization analysis"
      ],
      "usedWith": [
        "estimators",
        "quantiles",
        "degrees of freedom"
      ]
    },
    "motivation": "<p>A non-significant result may mean there is no effect, or it may mean the study was too small to see it. Power tells those stories apart before the experiment starts.</p><p><b>Statistical power</b> is the detection probability at a specified alternative.</p>",
    "definition": "<p>Power at $\\theta_1$ is $$P_{\\theta_1}(\\text{reject }H_0)=1-\\beta(\\theta_1).$$ For a one-sided known-variance mean test, compute the rejection cutoff under $H_0$, then evaluate the probability of crossing it under $\\theta_1$.</p><p>Power increases with larger effects, larger samples, lower noise, or a larger significance level.</p><p><b>Assumptions that matter:</b> power is tied to a chosen alternative and model; planned power is not a guarantee; and increasing $\\alpha$ buys power by allowing more false positives.</p>",
    "worked": {
      "problem": "A one-sided test has $\\sigma=4$, $n=64$, $\\alpha=0.05$, and true $\\mu=1.5$ under the alternative to $H_0:\\mu=0$. Compute power using $z_{0.95}=1.645$ and $\\Phi(1.355)=0.912$.",
      "skills": [
        "statistical power",
        "standard errors",
        "statistical interpretation"
      ],
      "strategy": "Use the statistical power definition, compute one quantity at a time, and interpret the number in context.",
      "steps": [
        {
          "do": "Compute SE",
          "result": "$4/\\sqrt{64}=0.5$",
          "why": "sample mean spread"
        },
        {
          "do": "Find cutoff",
          "result": "$1.645\\cdot0.5=0.8225$",
          "why": "null rejection threshold"
        },
        {
          "do": "Standardize under alternative",
          "result": "$(0.8225-1.5)/0.5=-1.355$",
          "why": "use alternative mean"
        },
        {
          "do": "Convert to exceedance",
          "result": "$P(Z>-1.355)=\\Phi(1.355)$",
          "why": "normal symmetry"
        },
        {
          "do": "Substitute value",
          "result": "$0.912$",
          "why": "given CDF"
        }
      ],
      "verify": "The number has the expected scale and direction for the stated data.",
      "answer": "Power is about $0.912$.",
      "connects": "This example shows statistical power as a concrete calculation rather than a slogan."
    },
    "practice": [
      {
        "problem": "Compute a standardized statistic for estimate $12$, null $10$, and SE $1$.",
        "steps": [
          {
            "do": "Write the formula",
            "result": "$(\\hat\\theta-\\theta_0)/SE$",
            "why": "standardized discrepancy"
          },
          {
            "do": "Substitute values",
            "result": "$(12-10)/1$",
            "why": "use the estimate, null, and standard error"
          },
          {
            "do": "Subtract",
            "result": "$2/1$",
            "why": "compute the numerator"
          },
          {
            "do": "Divide",
            "result": "$2$",
            "why": "standard-error units"
          },
          {
            "do": "Interpret",
            "result": "$2$ SE above the null",
            "why": "positive means above the null"
          }
        ],
        "answer": "The statistic is $2$."
      },
      {
        "problem": "Compute a two-sided normal p-value for $z=2$ using upper tail $0.0228$.",
        "steps": [
          {
            "do": "Identify one tail",
            "result": "$0.0228$",
            "why": "given normal upper-tail probability"
          },
          {
            "do": "Double it",
            "result": "$2\\cdot0.0228=0.0456$",
            "why": "two-sided test counts both directions"
          },
          {
            "do": "Compare to $0.05$",
            "result": "$0.0456<0.05$",
            "why": "small enough for 5 percent"
          },
          {
            "do": "State the decision",
            "result": "$\\text{reject}$",
            "why": "p-value below alpha"
          },
          {
            "do": "Name the evidence",
            "result": "$\\text{moderate evidence}$",
            "why": "near the conventional cutoff"
          }
        ],
        "answer": "The p-value is $0.0456$, so reject at $5\\%$."
      },
      {
        "problem": "Find a $95%$ interval for estimate $5$ with SE $0.5$.",
        "steps": [
          {
            "do": "Choose the critical value",
            "result": "$1.96$",
            "why": "standard normal 95 percent value"
          },
          {
            "do": "Compute the margin",
            "result": "$1.96\\cdot0.5=0.98$",
            "why": "critical value times SE"
          },
          {
            "do": "Compute the lower endpoint",
            "result": "$5-0.98=4.02$",
            "why": "subtract the margin"
          },
          {
            "do": "Compute the upper endpoint",
            "result": "$5+0.98=5.98$",
            "why": "add the margin"
          },
          {
            "do": "State interval",
            "result": "$[4.02,5.98]$",
            "why": "combine endpoints"
          }
        ],
        "answer": "The interval is $[4.02,5.98]$."
      },
      {
        "problem": "A sample size increase cuts SE from $0.10$ to $0.05$. What happens to a fixed effect $0.20$ in SE units?",
        "steps": [
          {
            "do": "Compute old signal",
            "result": "$0.20/0.10=2$",
            "why": "effect divided by old SE"
          },
          {
            "do": "Compute new signal",
            "result": "$0.20/0.05=4$",
            "why": "effect divided by new SE"
          },
          {
            "do": "Compare signals",
            "result": "$4/2=2$",
            "why": "standardized evidence doubled"
          },
          {
            "do": "Relate to variance",
            "result": "$0.05^2/0.10^2=0.25$",
            "why": "variance is one quarter as large"
          },
          {
            "do": "Interpret",
            "result": "$\\text{more precision}$",
            "why": "same effect is easier to detect"
          }
        ],
        "answer": "The signal grows from $2$ SE to $4$ SE."
      },
      {
        "problem": "Statistical power: a validation lift is $0.015$ with SE $0.006$. Test zero lift two-sided at $5%$.",
        "steps": [
          {
            "do": "Compute statistic",
            "result": "$0.015/0.006=2.5$",
            "why": "lift divided by standard error"
          },
          {
            "do": "Approximate p-value",
            "result": "$p\\approx0.0124$",
            "why": "two-sided normal tail for 2.5"
          },
          {
            "do": "Compare to alpha",
            "result": "$0.0124<0.05$",
            "why": "below the threshold"
          },
          {
            "do": "State decision",
            "result": "$\\text{reject zero lift}$",
            "why": "evidence supports a nonzero lift"
          },
          {
            "do": "Interpret practically",
            "result": "$1.5\\%$ estimated lift",
            "why": "statistical and practical meaning should both be considered"
          }
        ],
        "answer": "Reject zero lift; the estimated lift is statistically significant."
      }
    ],
    "applications": [
      {
        "title": "Statistical power in experiments",
        "background": "experiment planning appears whenever teams need a calibrated numerical decision rather than a hunch.",
        "numbers": "With estimate $0.12$ and SE $0.03$, the standardized value is $0.12/0.03=4$."
      },
      {
        "title": "Statistical power for model evaluation",
        "background": "experiment planning helps compare models on finite validation data, where random variation can mimic improvement.",
        "numbers": "A metric change $0.006$ with SE $0.002$ equals $3$ standard errors."
      },
      {
        "title": "Statistical power in monitoring",
        "background": "experiment planning turns noisy production measurements into thresholds that can be audited.",
        "numbers": "A baseline $10$ and current mean $10.6$ with SE $0.2$ gives statistic $3$."
      },
      {
        "title": "Statistical power for sample planning",
        "background": "experiment planning supports deciding whether more data are needed before trusting a conclusion.",
        "numbers": "Halving SE from $0.04$ to $0.02$ makes the same $0.06$ effect grow from $1.5$ to $3$ SE."
      },
      {
        "title": "Statistical power in fairness analysis",
        "background": "experiment planning is useful when rate differences across groups must be separated from sampling noise.",
        "numbers": "A gap $0.04$ with SE $0.015$ gives $z\\approx2.67$."
      },
      {
        "title": "Statistical power in scientific reporting",
        "background": "experiment planning gives a shared language for uncertainty, so readers can recompute the evidence.",
        "numbers": "An interval $0.20\\pm1.96(0.05)$ is $[0.102,0.298]$."
      }
    ],
    "applicationsClose": "Statistical power is one more uniform for the same habit: quantify uncertainty before making the decision.",
    "takeaways": [
      "Know the statistic and the distribution it is compared with.",
      "Check assumptions before trusting the reference distribution.",
      "Separate statistical significance from practical importance.",
      "Use real numbers to keep uncertainty interpretable."
    ]
  },
  "math-18-23": {
    "id": "math-18-23",
    "title": "The z-test and t-test",
    "tagline": "The z-test and t-test both standardize means; the t-test also accounts for estimating the noise.",
    "connections": {
      "buildsOn": [
        "sampling distributions",
        "likelihood",
        "standard error"
      ],
      "leadsTo": [
        "model comparison",
        "linear regression inference",
        "generalization analysis"
      ],
      "usedWith": [
        "estimators",
        "quantiles",
        "degrees of freedom"
      ]
    },
    "motivation": "<p>You already know the core statistic: estimate minus null, divided by standard error. The next question is which reference curve to use.</p><p>Use a <b>z-test</b> when the standard deviation is known or the large-sample normal approximation is strong. Use a <b>t-test</b> when the standard deviation is estimated, especially in small samples.</p>",
    "definition": "<p>For known $\\sigma$, $$z=\\frac{\\bar X-\\mu_0}{\\sigma/\\sqrt n}.$$ For unknown $\\sigma$, $$t=\\frac{\\bar X-\\mu_0}{s/\\sqrt n},$$ which follows a $t$ distribution with $n-1$ degrees of freedom under normal assumptions.</p><p>The $t$ distribution has heavier tails because $s$ is random. As $n$ grows, it approaches the standard normal.</p><p><b>Assumptions that matter:</b> independence matters; small-sample t tests need approximate normality; and paired tests should analyze differences.</p>",
    "worked": {
      "problem": "For $n=16$, $\\bar x=10.5$, $s=2$, test against $\\mu_0=9.5$ with a t statistic.",
      "skills": [
        "z and t tests",
        "standard errors",
        "statistical interpretation"
      ],
      "strategy": "Use the z and t tests definition, compute one quantity at a time, and interpret the number in context.",
      "steps": [
        {
          "do": "Compute SE",
          "result": "$2/\\sqrt{16}=0.5$",
          "why": "estimated standard error"
        },
        {
          "do": "Compute difference",
          "result": "$10.5-9.5=1$",
          "why": "mean minus null"
        },
        {
          "do": "Compute statistic",
          "result": "$t=1/0.5=2$",
          "why": "standardized difference"
        },
        {
          "do": "Compute df",
          "result": "$16-1=15$",
          "why": "one-sample t degrees of freedom"
        },
        {
          "do": "Interpret",
          "result": "$t=2$ with $15$ df",
          "why": "moderate evidence"
        }
      ],
      "verify": "The number has the expected scale and direction for the stated data.",
      "answer": "The statistic is $t=2$ with $15$ degrees of freedom.",
      "connects": "This example shows z and t tests as a concrete calculation rather than a slogan."
    },
    "practice": [
      {
        "problem": "Compute a standardized statistic for estimate $12$, null $10$, and SE $1$.",
        "steps": [
          {
            "do": "Write the formula",
            "result": "$(\\hat\\theta-\\theta_0)/SE$",
            "why": "standardized discrepancy"
          },
          {
            "do": "Substitute values",
            "result": "$(12-10)/1$",
            "why": "use the estimate, null, and standard error"
          },
          {
            "do": "Subtract",
            "result": "$2/1$",
            "why": "compute the numerator"
          },
          {
            "do": "Divide",
            "result": "$2$",
            "why": "standard-error units"
          },
          {
            "do": "Interpret",
            "result": "$2$ SE above the null",
            "why": "positive means above the null"
          }
        ],
        "answer": "The statistic is $2$."
      },
      {
        "problem": "Compute a two-sided normal p-value for $z=2$ using upper tail $0.0228$.",
        "steps": [
          {
            "do": "Identify one tail",
            "result": "$0.0228$",
            "why": "given normal upper-tail probability"
          },
          {
            "do": "Double it",
            "result": "$2\\cdot0.0228=0.0456$",
            "why": "two-sided test counts both directions"
          },
          {
            "do": "Compare to $0.05$",
            "result": "$0.0456<0.05$",
            "why": "small enough for 5 percent"
          },
          {
            "do": "State the decision",
            "result": "$\\text{reject}$",
            "why": "p-value below alpha"
          },
          {
            "do": "Name the evidence",
            "result": "$\\text{moderate evidence}$",
            "why": "near the conventional cutoff"
          }
        ],
        "answer": "The p-value is $0.0456$, so reject at $5\\%$."
      },
      {
        "problem": "Find a $95%$ interval for estimate $5$ with SE $0.5$.",
        "steps": [
          {
            "do": "Choose the critical value",
            "result": "$1.96$",
            "why": "standard normal 95 percent value"
          },
          {
            "do": "Compute the margin",
            "result": "$1.96\\cdot0.5=0.98$",
            "why": "critical value times SE"
          },
          {
            "do": "Compute the lower endpoint",
            "result": "$5-0.98=4.02$",
            "why": "subtract the margin"
          },
          {
            "do": "Compute the upper endpoint",
            "result": "$5+0.98=5.98$",
            "why": "add the margin"
          },
          {
            "do": "State interval",
            "result": "$[4.02,5.98]$",
            "why": "combine endpoints"
          }
        ],
        "answer": "The interval is $[4.02,5.98]$."
      },
      {
        "problem": "A sample size increase cuts SE from $0.10$ to $0.05$. What happens to a fixed effect $0.20$ in SE units?",
        "steps": [
          {
            "do": "Compute old signal",
            "result": "$0.20/0.10=2$",
            "why": "effect divided by old SE"
          },
          {
            "do": "Compute new signal",
            "result": "$0.20/0.05=4$",
            "why": "effect divided by new SE"
          },
          {
            "do": "Compare signals",
            "result": "$4/2=2$",
            "why": "standardized evidence doubled"
          },
          {
            "do": "Relate to variance",
            "result": "$0.05^2/0.10^2=0.25$",
            "why": "variance is one quarter as large"
          },
          {
            "do": "Interpret",
            "result": "$\\text{more precision}$",
            "why": "same effect is easier to detect"
          }
        ],
        "answer": "The signal grows from $2$ SE to $4$ SE."
      },
      {
        "problem": "The z-test and t-test: a validation lift is $0.015$ with SE $0.006$. Test zero lift two-sided at $5%$.",
        "steps": [
          {
            "do": "Compute statistic",
            "result": "$0.015/0.006=2.5$",
            "why": "lift divided by standard error"
          },
          {
            "do": "Approximate p-value",
            "result": "$p\\approx0.0124$",
            "why": "two-sided normal tail for 2.5"
          },
          {
            "do": "Compare to alpha",
            "result": "$0.0124<0.05$",
            "why": "below the threshold"
          },
          {
            "do": "State decision",
            "result": "$\\text{reject zero lift}$",
            "why": "evidence supports a nonzero lift"
          },
          {
            "do": "Interpret practically",
            "result": "$1.5\\%$ estimated lift",
            "why": "statistical and practical meaning should both be considered"
          }
        ],
        "answer": "Reject zero lift; the estimated lift is statistically significant."
      }
    ],
    "applications": [
      {
        "title": "The z-test and t-test in experiments",
        "background": "mean comparisons appears whenever teams need a calibrated numerical decision rather than a hunch.",
        "numbers": "With estimate $0.12$ and SE $0.03$, the standardized value is $0.12/0.03=4$."
      },
      {
        "title": "The z-test and t-test for model evaluation",
        "background": "mean comparisons helps compare models on finite validation data, where random variation can mimic improvement.",
        "numbers": "A metric change $0.006$ with SE $0.002$ equals $3$ standard errors."
      },
      {
        "title": "The z-test and t-test in monitoring",
        "background": "mean comparisons turns noisy production measurements into thresholds that can be audited.",
        "numbers": "A baseline $10$ and current mean $10.6$ with SE $0.2$ gives statistic $3$."
      },
      {
        "title": "The z-test and t-test for sample planning",
        "background": "mean comparisons supports deciding whether more data are needed before trusting a conclusion.",
        "numbers": "Halving SE from $0.04$ to $0.02$ makes the same $0.06$ effect grow from $1.5$ to $3$ SE."
      },
      {
        "title": "The z-test and t-test in fairness analysis",
        "background": "mean comparisons is useful when rate differences across groups must be separated from sampling noise.",
        "numbers": "A gap $0.04$ with SE $0.015$ gives $z\\approx2.67$."
      },
      {
        "title": "The z-test and t-test in scientific reporting",
        "background": "mean comparisons gives a shared language for uncertainty, so readers can recompute the evidence.",
        "numbers": "An interval $0.20\\pm1.96(0.05)$ is $[0.102,0.298]$."
      }
    ],
    "applicationsClose": "The z-test and t-test is one more uniform for the same habit: quantify uncertainty before making the decision.",
    "takeaways": [
      "Know the statistic and the distribution it is compared with.",
      "Check assumptions before trusting the reference distribution.",
      "Separate statistical significance from practical importance.",
      "Use real numbers to keep uncertainty interpretable."
    ]
  },
  "math-18-24": {
    "id": "math-18-24",
    "title": "The χ² and F tests",
    "tagline": "Chi-square tests measure squared count discrepancies; F tests compare variance-like quantities.",
    "connections": {
      "buildsOn": [
        "sampling distributions",
        "likelihood",
        "standard error"
      ],
      "leadsTo": [
        "model comparison",
        "linear regression inference",
        "generalization analysis"
      ],
      "usedWith": [
        "estimators",
        "quantiles",
        "degrees of freedom"
      ]
    },
    "motivation": "<p>Not every inference question is about a mean. Sometimes you ask whether category counts match expectations, or whether explained variation is large compared with noise.</p><p><b>$\\chi^2$</b> tests and <b>F</b> tests answer those questions with squared discrepancies and variance ratios.</p>",
    "definition": "<p>A goodness-of-fit statistic is $$\\chi^2=\\sum_i\\frac{(O_i-E_i)^2}{E_i}.$$ Large values indicate observed counts far from expected counts. An F statistic is a ratio of variance estimates or mean squares, such as $$F=MS_{\\text{between}}/MS_{\\text{within}}.$$</p><p>Chi-square distributions come from sums of squared standard normals; F distributions come from ratios of scaled chi-square variables.</p><p><b>Assumptions that matter:</b> observations should be independent; expected counts should be large enough; F variance tests are sensitive to non-normality; and degrees of freedom must match the design.</p>",
    "worked": {
      "problem": "A fair die is rolled $60$ times with counts $[8,12,9,11,10,10]$. Compute $\\chi^2$.",
      "skills": [
        "chi-square and F tests",
        "standard errors",
        "statistical interpretation"
      ],
      "strategy": "Use the chi-square and F tests definition, compute one quantity at a time, and interpret the number in context.",
      "steps": [
        {
          "do": "Compute expected count",
          "result": "$60/6=10$",
          "why": "six equally likely faces"
        },
        {
          "do": "Compute deviations",
          "result": "$[-2,2,-1,1,0,0]$",
          "why": "observed minus expected"
        },
        {
          "do": "Square deviations",
          "result": "$[4,4,1,1,0,0]$",
          "why": "chi-square uses squares"
        },
        {
          "do": "Divide by expected and sum",
          "result": "$(4+4+1+1)/10=1$",
          "why": "each expected count is 10"
        },
        {
          "do": "Find df",
          "result": "$6-1=5$",
          "why": "fixed total across six categories"
        }
      ],
      "verify": "The number has the expected scale and direction for the stated data.",
      "answer": "$\\chi^2=1$ with $5$ degrees of freedom.",
      "connects": "This example shows chi-square and F tests as a concrete calculation rather than a slogan."
    },
    "practice": [
      {
        "problem": "Compute a standardized statistic for estimate $12$, null $10$, and SE $1$.",
        "steps": [
          {
            "do": "Write the formula",
            "result": "$(\\hat\\theta-\\theta_0)/SE$",
            "why": "standardized discrepancy"
          },
          {
            "do": "Substitute values",
            "result": "$(12-10)/1$",
            "why": "use the estimate, null, and standard error"
          },
          {
            "do": "Subtract",
            "result": "$2/1$",
            "why": "compute the numerator"
          },
          {
            "do": "Divide",
            "result": "$2$",
            "why": "standard-error units"
          },
          {
            "do": "Interpret",
            "result": "$2$ SE above the null",
            "why": "positive means above the null"
          }
        ],
        "answer": "The statistic is $2$."
      },
      {
        "problem": "Compute a two-sided normal p-value for $z=2$ using upper tail $0.0228$.",
        "steps": [
          {
            "do": "Identify one tail",
            "result": "$0.0228$",
            "why": "given normal upper-tail probability"
          },
          {
            "do": "Double it",
            "result": "$2\\cdot0.0228=0.0456$",
            "why": "two-sided test counts both directions"
          },
          {
            "do": "Compare to $0.05$",
            "result": "$0.0456<0.05$",
            "why": "small enough for 5 percent"
          },
          {
            "do": "State the decision",
            "result": "$\\text{reject}$",
            "why": "p-value below alpha"
          },
          {
            "do": "Name the evidence",
            "result": "$\\text{moderate evidence}$",
            "why": "near the conventional cutoff"
          }
        ],
        "answer": "The p-value is $0.0456$, so reject at $5\\%$."
      },
      {
        "problem": "Find a $95%$ interval for estimate $5$ with SE $0.5$.",
        "steps": [
          {
            "do": "Choose the critical value",
            "result": "$1.96$",
            "why": "standard normal 95 percent value"
          },
          {
            "do": "Compute the margin",
            "result": "$1.96\\cdot0.5=0.98$",
            "why": "critical value times SE"
          },
          {
            "do": "Compute the lower endpoint",
            "result": "$5-0.98=4.02$",
            "why": "subtract the margin"
          },
          {
            "do": "Compute the upper endpoint",
            "result": "$5+0.98=5.98$",
            "why": "add the margin"
          },
          {
            "do": "State interval",
            "result": "$[4.02,5.98]$",
            "why": "combine endpoints"
          }
        ],
        "answer": "The interval is $[4.02,5.98]$."
      },
      {
        "problem": "A sample size increase cuts SE from $0.10$ to $0.05$. What happens to a fixed effect $0.20$ in SE units?",
        "steps": [
          {
            "do": "Compute old signal",
            "result": "$0.20/0.10=2$",
            "why": "effect divided by old SE"
          },
          {
            "do": "Compute new signal",
            "result": "$0.20/0.05=4$",
            "why": "effect divided by new SE"
          },
          {
            "do": "Compare signals",
            "result": "$4/2=2$",
            "why": "standardized evidence doubled"
          },
          {
            "do": "Relate to variance",
            "result": "$0.05^2/0.10^2=0.25$",
            "why": "variance is one quarter as large"
          },
          {
            "do": "Interpret",
            "result": "$\\text{more precision}$",
            "why": "same effect is easier to detect"
          }
        ],
        "answer": "The signal grows from $2$ SE to $4$ SE."
      },
      {
        "problem": "The χ² and F tests: a validation lift is $0.015$ with SE $0.006$. Test zero lift two-sided at $5%$.",
        "steps": [
          {
            "do": "Compute statistic",
            "result": "$0.015/0.006=2.5$",
            "why": "lift divided by standard error"
          },
          {
            "do": "Approximate p-value",
            "result": "$p\\approx0.0124$",
            "why": "two-sided normal tail for 2.5"
          },
          {
            "do": "Compare to alpha",
            "result": "$0.0124<0.05$",
            "why": "below the threshold"
          },
          {
            "do": "State decision",
            "result": "$\\text{reject zero lift}$",
            "why": "evidence supports a nonzero lift"
          },
          {
            "do": "Interpret practically",
            "result": "$1.5\\%$ estimated lift",
            "why": "statistical and practical meaning should both be considered"
          }
        ],
        "answer": "Reject zero lift; the estimated lift is statistically significant."
      }
    ],
    "applications": [
      {
        "title": "The χ² and F tests in experiments",
        "background": "count and variance inference appears whenever teams need a calibrated numerical decision rather than a hunch.",
        "numbers": "With estimate $0.12$ and SE $0.03$, the standardized value is $0.12/0.03=4$."
      },
      {
        "title": "The χ² and F tests for model evaluation",
        "background": "count and variance inference helps compare models on finite validation data, where random variation can mimic improvement.",
        "numbers": "A metric change $0.006$ with SE $0.002$ equals $3$ standard errors."
      },
      {
        "title": "The χ² and F tests in monitoring",
        "background": "count and variance inference turns noisy production measurements into thresholds that can be audited.",
        "numbers": "A baseline $10$ and current mean $10.6$ with SE $0.2$ gives statistic $3$."
      },
      {
        "title": "The χ² and F tests for sample planning",
        "background": "count and variance inference supports deciding whether more data are needed before trusting a conclusion.",
        "numbers": "Halving SE from $0.04$ to $0.02$ makes the same $0.06$ effect grow from $1.5$ to $3$ SE."
      },
      {
        "title": "The χ² and F tests in fairness analysis",
        "background": "count and variance inference is useful when rate differences across groups must be separated from sampling noise.",
        "numbers": "A gap $0.04$ with SE $0.015$ gives $z\\approx2.67$."
      },
      {
        "title": "The χ² and F tests in scientific reporting",
        "background": "count and variance inference gives a shared language for uncertainty, so readers can recompute the evidence.",
        "numbers": "An interval $0.20\\pm1.96(0.05)$ is $[0.102,0.298]$."
      }
    ],
    "applicationsClose": "The χ² and F tests is one more uniform for the same habit: quantify uncertainty before making the decision.",
    "takeaways": [
      "Know the statistic and the distribution it is compared with.",
      "Check assumptions before trusting the reference distribution.",
      "Separate statistical significance from practical importance.",
      "Use real numbers to keep uncertainty interpretable."
    ]
  },
  "math-18-25": {
    "id": "math-18-25",
    "title": "The likelihood ratio test",
    "tagline": "The likelihood ratio test compares the best null explanation with the best unrestricted explanation.",
    "connections": {
      "buildsOn": [
        "estimators",
        "loss functions",
        "sampling distributions"
      ],
      "leadsTo": [
        "regularization",
        "model selection",
        "ML deployment"
      ],
      "usedWith": [
        "risk",
        "empirical averages",
        "concentration inequalities"
      ]
    },
    "motivation": "<p>You already know that a model can fit observed data and still face uncertainty. The lesson here is to make that uncertainty measurable rather than mysterious.</p><p><b>The likelihood ratio test</b> gives a practical mathematical lens for ML: compare explanations, reduce assumptions, resample, fit, balance complexity, or bound future error.</p>",
    "definition": "<p>The central object is an estimate computed from data and judged against a population target. In likelihood ratio testing, we write the data calculation clearly, identify what randomness remains, and ask how the result would change on new samples.</p><p>The guiding derivation is the same across inference: define a statistic, understand its sampling behavior, and use that behavior to make a calibrated statement about the unknown target.</p><p><b>Assumptions that matter:</b> observations should match the sampling story; dependence and selection bias change the calculation; finite samples can be noisy; and ML use requires checking both statistical and practical error.</p>",
    "worked": {
      "problem": "A validation experiment reports training error $0.08$ and test error $0.12$ on $1000$ test examples. Use likelihood ratio testing thinking to compute the generalization gap and an approximate SE for the test error as a proportion.",
      "skills": [
        "likelihood ratio testing",
        "ML metrics",
        "standard error"
      ],
      "strategy": "Compute the observed gap first, then quantify the sampling noise in the held-out test estimate.",
      "steps": [
        {
          "do": "Compute the gap",
          "result": "$0.12-0.08=0.04$",
          "why": "test error minus training error"
        },
        {
          "do": "Compute binomial variance estimate",
          "result": "$0.12\\cdot0.88=0.1056$",
          "why": "error is a proportion"
        },
        {
          "do": "Divide by test size",
          "result": "$0.1056/1000=0.0001056$",
          "why": "variance of the sample proportion"
        },
        {
          "do": "Take the square root",
          "result": "$SE\\approx0.0103$",
          "why": "standard error of test error"
        },
        {
          "do": "Compare gap to SE",
          "result": "$0.04/0.0103\\approx3.88$",
          "why": "gap is several SEs"
        }
      ],
      "verify": "A four-point gap is much larger than one standard error, so it deserves attention.",
      "answer": "The gap is $0.04$, and the test-error SE is about $0.0103$.",
      "connects": "The likelihood ratio test turns model behavior into quantities you can recompute."
    },
    "practice": [
      {
        "problem": "Compute a standardized statistic for estimate $12$, null $10$, and SE $1$.",
        "steps": [
          {
            "do": "Write the formula",
            "result": "$(\\hat\\theta-\\theta_0)/SE$",
            "why": "standardized discrepancy"
          },
          {
            "do": "Substitute values",
            "result": "$(12-10)/1$",
            "why": "use the estimate, null, and standard error"
          },
          {
            "do": "Subtract",
            "result": "$2/1$",
            "why": "compute the numerator"
          },
          {
            "do": "Divide",
            "result": "$2$",
            "why": "standard-error units"
          },
          {
            "do": "Interpret",
            "result": "$2$ SE above the null",
            "why": "positive means above the null"
          }
        ],
        "answer": "The statistic is $2$."
      },
      {
        "problem": "Compute a two-sided normal p-value for $z=2$ using upper tail $0.0228$.",
        "steps": [
          {
            "do": "Identify one tail",
            "result": "$0.0228$",
            "why": "given normal upper-tail probability"
          },
          {
            "do": "Double it",
            "result": "$2\\cdot0.0228=0.0456$",
            "why": "two-sided test counts both directions"
          },
          {
            "do": "Compare to $0.05$",
            "result": "$0.0456<0.05$",
            "why": "small enough for 5 percent"
          },
          {
            "do": "State the decision",
            "result": "$\\text{reject}$",
            "why": "p-value below alpha"
          },
          {
            "do": "Name the evidence",
            "result": "$\\text{moderate evidence}$",
            "why": "near the conventional cutoff"
          }
        ],
        "answer": "The p-value is $0.0456$, so reject at $5\\%$."
      },
      {
        "problem": "Find a $95%$ interval for estimate $5$ with SE $0.5$.",
        "steps": [
          {
            "do": "Choose the critical value",
            "result": "$1.96$",
            "why": "standard normal 95 percent value"
          },
          {
            "do": "Compute the margin",
            "result": "$1.96\\cdot0.5=0.98$",
            "why": "critical value times SE"
          },
          {
            "do": "Compute the lower endpoint",
            "result": "$5-0.98=4.02$",
            "why": "subtract the margin"
          },
          {
            "do": "Compute the upper endpoint",
            "result": "$5+0.98=5.98$",
            "why": "add the margin"
          },
          {
            "do": "State interval",
            "result": "$[4.02,5.98]$",
            "why": "combine endpoints"
          }
        ],
        "answer": "The interval is $[4.02,5.98]$."
      },
      {
        "problem": "A sample size increase cuts SE from $0.10$ to $0.05$. What happens to a fixed effect $0.20$ in SE units?",
        "steps": [
          {
            "do": "Compute old signal",
            "result": "$0.20/0.10=2$",
            "why": "effect divided by old SE"
          },
          {
            "do": "Compute new signal",
            "result": "$0.20/0.05=4$",
            "why": "effect divided by new SE"
          },
          {
            "do": "Compare signals",
            "result": "$4/2=2$",
            "why": "standardized evidence doubled"
          },
          {
            "do": "Relate to variance",
            "result": "$0.05^2/0.10^2=0.25$",
            "why": "variance is one quarter as large"
          },
          {
            "do": "Interpret",
            "result": "$\\text{more precision}$",
            "why": "same effect is easier to detect"
          }
        ],
        "answer": "The signal grows from $2$ SE to $4$ SE."
      },
      {
        "problem": "The likelihood ratio test: a validation lift is $0.015$ with SE $0.006$. Test zero lift two-sided at $5%$.",
        "steps": [
          {
            "do": "Compute statistic",
            "result": "$0.015/0.006=2.5$",
            "why": "lift divided by standard error"
          },
          {
            "do": "Approximate p-value",
            "result": "$p\\approx0.0124$",
            "why": "two-sided normal tail for 2.5"
          },
          {
            "do": "Compare to alpha",
            "result": "$0.0124<0.05$",
            "why": "below the threshold"
          },
          {
            "do": "State decision",
            "result": "$\\text{reject zero lift}$",
            "why": "evidence supports a nonzero lift"
          },
          {
            "do": "Interpret practically",
            "result": "$1.5\\%$ estimated lift",
            "why": "statistical and practical meaning should both be considered"
          }
        ],
        "answer": "Reject zero lift; the estimated lift is statistically significant."
      }
    ],
    "applications": [
      {
        "title": "The likelihood ratio test in experiments",
        "background": "model comparison appears whenever teams need a calibrated numerical decision rather than a hunch.",
        "numbers": "With estimate $0.12$ and SE $0.03$, the standardized value is $0.12/0.03=4$."
      },
      {
        "title": "The likelihood ratio test for model evaluation",
        "background": "model comparison helps compare models on finite validation data, where random variation can mimic improvement.",
        "numbers": "A metric change $0.006$ with SE $0.002$ equals $3$ standard errors."
      },
      {
        "title": "The likelihood ratio test in monitoring",
        "background": "model comparison turns noisy production measurements into thresholds that can be audited.",
        "numbers": "A baseline $10$ and current mean $10.6$ with SE $0.2$ gives statistic $3$."
      },
      {
        "title": "The likelihood ratio test for sample planning",
        "background": "model comparison supports deciding whether more data are needed before trusting a conclusion.",
        "numbers": "Halving SE from $0.04$ to $0.02$ makes the same $0.06$ effect grow from $1.5$ to $3$ SE."
      },
      {
        "title": "The likelihood ratio test in fairness analysis",
        "background": "model comparison is useful when rate differences across groups must be separated from sampling noise.",
        "numbers": "A gap $0.04$ with SE $0.015$ gives $z\\approx2.67$."
      },
      {
        "title": "The likelihood ratio test in scientific reporting",
        "background": "model comparison gives a shared language for uncertainty, so readers can recompute the evidence.",
        "numbers": "An interval $0.20\\pm1.96(0.05)$ is $[0.102,0.298]$."
      }
    ],
    "applicationsClose": "The likelihood ratio test keeps ML inference grounded: the calculation matters because new data are the real exam.",
    "takeaways": [
      "Start from the data statistic and the target it estimates.",
      "Use standard errors, resampling, or bounds to quantify sample-to-sample variation.",
      "Model complexity helps training fit but can hurt new-data performance.",
      "For ML, always connect the statistical number to deployment consequences."
    ]
  },
  "math-18-26": {
    "id": "math-18-26",
    "title": "Nonparametric methods",
    "tagline": "Nonparametric methods trade strict distribution formulas for rank, order, and resampling ideas.",
    "connections": {
      "buildsOn": [
        "estimators",
        "loss functions",
        "sampling distributions"
      ],
      "leadsTo": [
        "regularization",
        "model selection",
        "ML deployment"
      ],
      "usedWith": [
        "risk",
        "empirical averages",
        "concentration inequalities"
      ]
    },
    "motivation": "<p>You already know that a model can fit observed data and still face uncertainty. The lesson here is to make that uncertainty measurable rather than mysterious.</p><p><b>Nonparametric methods</b> gives a practical mathematical lens for ML: compare explanations, reduce assumptions, resample, fit, balance complexity, or bound future error.</p>",
    "definition": "<p>The central object is an estimate computed from data and judged against a population target. In nonparametric methods, we write the data calculation clearly, identify what randomness remains, and ask how the result would change on new samples.</p><p>The guiding derivation is the same across inference: define a statistic, understand its sampling behavior, and use that behavior to make a calibrated statement about the unknown target.</p><p><b>Assumptions that matter:</b> observations should match the sampling story; dependence and selection bias change the calculation; finite samples can be noisy; and ML use requires checking both statistical and practical error.</p>",
    "worked": {
      "problem": "A validation experiment reports training error $0.08$ and test error $0.12$ on $1000$ test examples. Use nonparametric methods thinking to compute the generalization gap and an approximate SE for the test error as a proportion.",
      "skills": [
        "nonparametric methods",
        "ML metrics",
        "standard error"
      ],
      "strategy": "Compute the observed gap first, then quantify the sampling noise in the held-out test estimate.",
      "steps": [
        {
          "do": "Compute the gap",
          "result": "$0.12-0.08=0.04$",
          "why": "test error minus training error"
        },
        {
          "do": "Compute binomial variance estimate",
          "result": "$0.12\\cdot0.88=0.1056$",
          "why": "error is a proportion"
        },
        {
          "do": "Divide by test size",
          "result": "$0.1056/1000=0.0001056$",
          "why": "variance of the sample proportion"
        },
        {
          "do": "Take the square root",
          "result": "$SE\\approx0.0103$",
          "why": "standard error of test error"
        },
        {
          "do": "Compare gap to SE",
          "result": "$0.04/0.0103\\approx3.88$",
          "why": "gap is several SEs"
        }
      ],
      "verify": "A four-point gap is much larger than one standard error, so it deserves attention.",
      "answer": "The gap is $0.04$, and the test-error SE is about $0.0103$.",
      "connects": "Nonparametric methods turns model behavior into quantities you can recompute."
    },
    "practice": [
      {
        "problem": "Compute a standardized statistic for estimate $12$, null $10$, and SE $1$.",
        "steps": [
          {
            "do": "Write the formula",
            "result": "$(\\hat\\theta-\\theta_0)/SE$",
            "why": "standardized discrepancy"
          },
          {
            "do": "Substitute values",
            "result": "$(12-10)/1$",
            "why": "use the estimate, null, and standard error"
          },
          {
            "do": "Subtract",
            "result": "$2/1$",
            "why": "compute the numerator"
          },
          {
            "do": "Divide",
            "result": "$2$",
            "why": "standard-error units"
          },
          {
            "do": "Interpret",
            "result": "$2$ SE above the null",
            "why": "positive means above the null"
          }
        ],
        "answer": "The statistic is $2$."
      },
      {
        "problem": "Compute a two-sided normal p-value for $z=2$ using upper tail $0.0228$.",
        "steps": [
          {
            "do": "Identify one tail",
            "result": "$0.0228$",
            "why": "given normal upper-tail probability"
          },
          {
            "do": "Double it",
            "result": "$2\\cdot0.0228=0.0456$",
            "why": "two-sided test counts both directions"
          },
          {
            "do": "Compare to $0.05$",
            "result": "$0.0456<0.05$",
            "why": "small enough for 5 percent"
          },
          {
            "do": "State the decision",
            "result": "$\\text{reject}$",
            "why": "p-value below alpha"
          },
          {
            "do": "Name the evidence",
            "result": "$\\text{moderate evidence}$",
            "why": "near the conventional cutoff"
          }
        ],
        "answer": "The p-value is $0.0456$, so reject at $5\\%$."
      },
      {
        "problem": "Find a $95%$ interval for estimate $5$ with SE $0.5$.",
        "steps": [
          {
            "do": "Choose the critical value",
            "result": "$1.96$",
            "why": "standard normal 95 percent value"
          },
          {
            "do": "Compute the margin",
            "result": "$1.96\\cdot0.5=0.98$",
            "why": "critical value times SE"
          },
          {
            "do": "Compute the lower endpoint",
            "result": "$5-0.98=4.02$",
            "why": "subtract the margin"
          },
          {
            "do": "Compute the upper endpoint",
            "result": "$5+0.98=5.98$",
            "why": "add the margin"
          },
          {
            "do": "State interval",
            "result": "$[4.02,5.98]$",
            "why": "combine endpoints"
          }
        ],
        "answer": "The interval is $[4.02,5.98]$."
      },
      {
        "problem": "A sample size increase cuts SE from $0.10$ to $0.05$. What happens to a fixed effect $0.20$ in SE units?",
        "steps": [
          {
            "do": "Compute old signal",
            "result": "$0.20/0.10=2$",
            "why": "effect divided by old SE"
          },
          {
            "do": "Compute new signal",
            "result": "$0.20/0.05=4$",
            "why": "effect divided by new SE"
          },
          {
            "do": "Compare signals",
            "result": "$4/2=2$",
            "why": "standardized evidence doubled"
          },
          {
            "do": "Relate to variance",
            "result": "$0.05^2/0.10^2=0.25$",
            "why": "variance is one quarter as large"
          },
          {
            "do": "Interpret",
            "result": "$\\text{more precision}$",
            "why": "same effect is easier to detect"
          }
        ],
        "answer": "The signal grows from $2$ SE to $4$ SE."
      },
      {
        "problem": "Nonparametric methods: a validation lift is $0.015$ with SE $0.006$. Test zero lift two-sided at $5%$.",
        "steps": [
          {
            "do": "Compute statistic",
            "result": "$0.015/0.006=2.5$",
            "why": "lift divided by standard error"
          },
          {
            "do": "Approximate p-value",
            "result": "$p\\approx0.0124$",
            "why": "two-sided normal tail for 2.5"
          },
          {
            "do": "Compare to alpha",
            "result": "$0.0124<0.05$",
            "why": "below the threshold"
          },
          {
            "do": "State decision",
            "result": "$\\text{reject zero lift}$",
            "why": "evidence supports a nonzero lift"
          },
          {
            "do": "Interpret practically",
            "result": "$1.5\\%$ estimated lift",
            "why": "statistical and practical meaning should both be considered"
          }
        ],
        "answer": "Reject zero lift; the estimated lift is statistically significant."
      }
    ],
    "applications": [
      {
        "title": "Nonparametric methods in experiments",
        "background": "assumption-light inference appears whenever teams need a calibrated numerical decision rather than a hunch.",
        "numbers": "With estimate $0.12$ and SE $0.03$, the standardized value is $0.12/0.03=4$."
      },
      {
        "title": "Nonparametric methods for model evaluation",
        "background": "assumption-light inference helps compare models on finite validation data, where random variation can mimic improvement.",
        "numbers": "A metric change $0.006$ with SE $0.002$ equals $3$ standard errors."
      },
      {
        "title": "Nonparametric methods in monitoring",
        "background": "assumption-light inference turns noisy production measurements into thresholds that can be audited.",
        "numbers": "A baseline $10$ and current mean $10.6$ with SE $0.2$ gives statistic $3$."
      },
      {
        "title": "Nonparametric methods for sample planning",
        "background": "assumption-light inference supports deciding whether more data are needed before trusting a conclusion.",
        "numbers": "Halving SE from $0.04$ to $0.02$ makes the same $0.06$ effect grow from $1.5$ to $3$ SE."
      },
      {
        "title": "Nonparametric methods in fairness analysis",
        "background": "assumption-light inference is useful when rate differences across groups must be separated from sampling noise.",
        "numbers": "A gap $0.04$ with SE $0.015$ gives $z\\approx2.67$."
      },
      {
        "title": "Nonparametric methods in scientific reporting",
        "background": "assumption-light inference gives a shared language for uncertainty, so readers can recompute the evidence.",
        "numbers": "An interval $0.20\\pm1.96(0.05)$ is $[0.102,0.298]$."
      }
    ],
    "applicationsClose": "Nonparametric methods keeps ML inference grounded: the calculation matters because new data are the real exam.",
    "takeaways": [
      "Start from the data statistic and the target it estimates.",
      "Use standard errors, resampling, or bounds to quantify sample-to-sample variation.",
      "Model complexity helps training fit but can hurt new-data performance.",
      "For ML, always connect the statistical number to deployment consequences."
    ]
  },
  "math-18-27": {
    "id": "math-18-27",
    "title": "The bootstrap",
    "tagline": "The bootstrap estimates sampling variation by resampling from the data you actually observed.",
    "connections": {
      "buildsOn": [
        "estimators",
        "loss functions",
        "sampling distributions"
      ],
      "leadsTo": [
        "regularization",
        "model selection",
        "ML deployment"
      ],
      "usedWith": [
        "risk",
        "empirical averages",
        "concentration inequalities"
      ]
    },
    "motivation": "<p>You already know that a model can fit observed data and still face uncertainty. The lesson here is to make that uncertainty measurable rather than mysterious.</p><p><b>The bootstrap</b> gives a practical mathematical lens for ML: compare explanations, reduce assumptions, resample, fit, balance complexity, or bound future error.</p>",
    "definition": "<p>The central object is an estimate computed from data and judged against a population target. In bootstrap resampling, we write the data calculation clearly, identify what randomness remains, and ask how the result would change on new samples.</p><p>The guiding derivation is the same across inference: define a statistic, understand its sampling behavior, and use that behavior to make a calibrated statement about the unknown target.</p><p><b>Assumptions that matter:</b> observations should match the sampling story; dependence and selection bias change the calculation; finite samples can be noisy; and ML use requires checking both statistical and practical error.</p>",
    "worked": {
      "problem": "A validation experiment reports training error $0.08$ and test error $0.12$ on $1000$ test examples. Use bootstrap resampling thinking to compute the generalization gap and an approximate SE for the test error as a proportion.",
      "skills": [
        "bootstrap resampling",
        "ML metrics",
        "standard error"
      ],
      "strategy": "Compute the observed gap first, then quantify the sampling noise in the held-out test estimate.",
      "steps": [
        {
          "do": "Compute the gap",
          "result": "$0.12-0.08=0.04$",
          "why": "test error minus training error"
        },
        {
          "do": "Compute binomial variance estimate",
          "result": "$0.12\\cdot0.88=0.1056$",
          "why": "error is a proportion"
        },
        {
          "do": "Divide by test size",
          "result": "$0.1056/1000=0.0001056$",
          "why": "variance of the sample proportion"
        },
        {
          "do": "Take the square root",
          "result": "$SE\\approx0.0103$",
          "why": "standard error of test error"
        },
        {
          "do": "Compare gap to SE",
          "result": "$0.04/0.0103\\approx3.88$",
          "why": "gap is several SEs"
        }
      ],
      "verify": "A four-point gap is much larger than one standard error, so it deserves attention.",
      "answer": "The gap is $0.04$, and the test-error SE is about $0.0103$.",
      "connects": "The bootstrap turns model behavior into quantities you can recompute."
    },
    "practice": [
      {
        "problem": "Compute a standardized statistic for estimate $12$, null $10$, and SE $1$.",
        "steps": [
          {
            "do": "Write the formula",
            "result": "$(\\hat\\theta-\\theta_0)/SE$",
            "why": "standardized discrepancy"
          },
          {
            "do": "Substitute values",
            "result": "$(12-10)/1$",
            "why": "use the estimate, null, and standard error"
          },
          {
            "do": "Subtract",
            "result": "$2/1$",
            "why": "compute the numerator"
          },
          {
            "do": "Divide",
            "result": "$2$",
            "why": "standard-error units"
          },
          {
            "do": "Interpret",
            "result": "$2$ SE above the null",
            "why": "positive means above the null"
          }
        ],
        "answer": "The statistic is $2$."
      },
      {
        "problem": "Compute a two-sided normal p-value for $z=2$ using upper tail $0.0228$.",
        "steps": [
          {
            "do": "Identify one tail",
            "result": "$0.0228$",
            "why": "given normal upper-tail probability"
          },
          {
            "do": "Double it",
            "result": "$2\\cdot0.0228=0.0456$",
            "why": "two-sided test counts both directions"
          },
          {
            "do": "Compare to $0.05$",
            "result": "$0.0456<0.05$",
            "why": "small enough for 5 percent"
          },
          {
            "do": "State the decision",
            "result": "$\\text{reject}$",
            "why": "p-value below alpha"
          },
          {
            "do": "Name the evidence",
            "result": "$\\text{moderate evidence}$",
            "why": "near the conventional cutoff"
          }
        ],
        "answer": "The p-value is $0.0456$, so reject at $5\\%$."
      },
      {
        "problem": "Find a $95%$ interval for estimate $5$ with SE $0.5$.",
        "steps": [
          {
            "do": "Choose the critical value",
            "result": "$1.96$",
            "why": "standard normal 95 percent value"
          },
          {
            "do": "Compute the margin",
            "result": "$1.96\\cdot0.5=0.98$",
            "why": "critical value times SE"
          },
          {
            "do": "Compute the lower endpoint",
            "result": "$5-0.98=4.02$",
            "why": "subtract the margin"
          },
          {
            "do": "Compute the upper endpoint",
            "result": "$5+0.98=5.98$",
            "why": "add the margin"
          },
          {
            "do": "State interval",
            "result": "$[4.02,5.98]$",
            "why": "combine endpoints"
          }
        ],
        "answer": "The interval is $[4.02,5.98]$."
      },
      {
        "problem": "A sample size increase cuts SE from $0.10$ to $0.05$. What happens to a fixed effect $0.20$ in SE units?",
        "steps": [
          {
            "do": "Compute old signal",
            "result": "$0.20/0.10=2$",
            "why": "effect divided by old SE"
          },
          {
            "do": "Compute new signal",
            "result": "$0.20/0.05=4$",
            "why": "effect divided by new SE"
          },
          {
            "do": "Compare signals",
            "result": "$4/2=2$",
            "why": "standardized evidence doubled"
          },
          {
            "do": "Relate to variance",
            "result": "$0.05^2/0.10^2=0.25$",
            "why": "variance is one quarter as large"
          },
          {
            "do": "Interpret",
            "result": "$\\text{more precision}$",
            "why": "same effect is easier to detect"
          }
        ],
        "answer": "The signal grows from $2$ SE to $4$ SE."
      },
      {
        "problem": "The bootstrap: a validation lift is $0.015$ with SE $0.006$. Test zero lift two-sided at $5%$.",
        "steps": [
          {
            "do": "Compute statistic",
            "result": "$0.015/0.006=2.5$",
            "why": "lift divided by standard error"
          },
          {
            "do": "Approximate p-value",
            "result": "$p\\approx0.0124$",
            "why": "two-sided normal tail for 2.5"
          },
          {
            "do": "Compare to alpha",
            "result": "$0.0124<0.05$",
            "why": "below the threshold"
          },
          {
            "do": "State decision",
            "result": "$\\text{reject zero lift}$",
            "why": "evidence supports a nonzero lift"
          },
          {
            "do": "Interpret practically",
            "result": "$1.5\\%$ estimated lift",
            "why": "statistical and practical meaning should both be considered"
          }
        ],
        "answer": "Reject zero lift; the estimated lift is statistically significant."
      }
    ],
    "applications": [
      {
        "title": "The bootstrap in experiments",
        "background": "simulation-based uncertainty appears whenever teams need a calibrated numerical decision rather than a hunch.",
        "numbers": "With estimate $0.12$ and SE $0.03$, the standardized value is $0.12/0.03=4$."
      },
      {
        "title": "The bootstrap for model evaluation",
        "background": "simulation-based uncertainty helps compare models on finite validation data, where random variation can mimic improvement.",
        "numbers": "A metric change $0.006$ with SE $0.002$ equals $3$ standard errors."
      },
      {
        "title": "The bootstrap in monitoring",
        "background": "simulation-based uncertainty turns noisy production measurements into thresholds that can be audited.",
        "numbers": "A baseline $10$ and current mean $10.6$ with SE $0.2$ gives statistic $3$."
      },
      {
        "title": "The bootstrap for sample planning",
        "background": "simulation-based uncertainty supports deciding whether more data are needed before trusting a conclusion.",
        "numbers": "Halving SE from $0.04$ to $0.02$ makes the same $0.06$ effect grow from $1.5$ to $3$ SE."
      },
      {
        "title": "The bootstrap in fairness analysis",
        "background": "simulation-based uncertainty is useful when rate differences across groups must be separated from sampling noise.",
        "numbers": "A gap $0.04$ with SE $0.015$ gives $z\\approx2.67$."
      },
      {
        "title": "The bootstrap in scientific reporting",
        "background": "simulation-based uncertainty gives a shared language for uncertainty, so readers can recompute the evidence.",
        "numbers": "An interval $0.20\\pm1.96(0.05)$ is $[0.102,0.298]$."
      }
    ],
    "applicationsClose": "The bootstrap keeps ML inference grounded: the calculation matters because new data are the real exam.",
    "takeaways": [
      "Start from the data statistic and the target it estimates.",
      "Use standard errors, resampling, or bounds to quantify sample-to-sample variation.",
      "Model complexity helps training fit but can hurt new-data performance.",
      "For ML, always connect the statistical number to deployment consequences."
    ]
  },
  "math-18-28": {
    "id": "math-18-28",
    "title": "Linear regression",
    "tagline": "Linear regression fits the best line by minimizing squared prediction errors.",
    "connections": {
      "buildsOn": [
        "estimators",
        "loss functions",
        "sampling distributions"
      ],
      "leadsTo": [
        "regularization",
        "model selection",
        "ML deployment"
      ],
      "usedWith": [
        "risk",
        "empirical averages",
        "concentration inequalities"
      ]
    },
    "motivation": "<p>You already know that a model can fit observed data and still face uncertainty. The lesson here is to make that uncertainty measurable rather than mysterious.</p><p><b>Linear regression</b> gives a practical mathematical lens for ML: compare explanations, reduce assumptions, resample, fit, balance complexity, or bound future error.</p>",
    "definition": "<p>The central object is an estimate computed from data and judged against a population target. In linear regression, we write the data calculation clearly, identify what randomness remains, and ask how the result would change on new samples.</p><p>The guiding derivation is the same across inference: define a statistic, understand its sampling behavior, and use that behavior to make a calibrated statement about the unknown target.</p><p><b>Assumptions that matter:</b> observations should match the sampling story; dependence and selection bias change the calculation; finite samples can be noisy; and ML use requires checking both statistical and practical error.</p>",
    "worked": {
      "problem": "A validation experiment reports training error $0.08$ and test error $0.12$ on $1000$ test examples. Use linear regression thinking to compute the generalization gap and an approximate SE for the test error as a proportion.",
      "skills": [
        "linear regression",
        "ML metrics",
        "standard error"
      ],
      "strategy": "Compute the observed gap first, then quantify the sampling noise in the held-out test estimate.",
      "steps": [
        {
          "do": "Compute the gap",
          "result": "$0.12-0.08=0.04$",
          "why": "test error minus training error"
        },
        {
          "do": "Compute binomial variance estimate",
          "result": "$0.12\\cdot0.88=0.1056$",
          "why": "error is a proportion"
        },
        {
          "do": "Divide by test size",
          "result": "$0.1056/1000=0.0001056$",
          "why": "variance of the sample proportion"
        },
        {
          "do": "Take the square root",
          "result": "$SE\\approx0.0103$",
          "why": "standard error of test error"
        },
        {
          "do": "Compare gap to SE",
          "result": "$0.04/0.0103\\approx3.88$",
          "why": "gap is several SEs"
        }
      ],
      "verify": "A four-point gap is much larger than one standard error, so it deserves attention.",
      "answer": "The gap is $0.04$, and the test-error SE is about $0.0103$.",
      "connects": "Linear regression turns model behavior into quantities you can recompute."
    },
    "practice": [
      {
        "problem": "Compute a standardized statistic for estimate $12$, null $10$, and SE $1$.",
        "steps": [
          {
            "do": "Write the formula",
            "result": "$(\\hat\\theta-\\theta_0)/SE$",
            "why": "standardized discrepancy"
          },
          {
            "do": "Substitute values",
            "result": "$(12-10)/1$",
            "why": "use the estimate, null, and standard error"
          },
          {
            "do": "Subtract",
            "result": "$2/1$",
            "why": "compute the numerator"
          },
          {
            "do": "Divide",
            "result": "$2$",
            "why": "standard-error units"
          },
          {
            "do": "Interpret",
            "result": "$2$ SE above the null",
            "why": "positive means above the null"
          }
        ],
        "answer": "The statistic is $2$."
      },
      {
        "problem": "Compute a two-sided normal p-value for $z=2$ using upper tail $0.0228$.",
        "steps": [
          {
            "do": "Identify one tail",
            "result": "$0.0228$",
            "why": "given normal upper-tail probability"
          },
          {
            "do": "Double it",
            "result": "$2\\cdot0.0228=0.0456$",
            "why": "two-sided test counts both directions"
          },
          {
            "do": "Compare to $0.05$",
            "result": "$0.0456<0.05$",
            "why": "small enough for 5 percent"
          },
          {
            "do": "State the decision",
            "result": "$\\text{reject}$",
            "why": "p-value below alpha"
          },
          {
            "do": "Name the evidence",
            "result": "$\\text{moderate evidence}$",
            "why": "near the conventional cutoff"
          }
        ],
        "answer": "The p-value is $0.0456$, so reject at $5\\%$."
      },
      {
        "problem": "Find a $95%$ interval for estimate $5$ with SE $0.5$.",
        "steps": [
          {
            "do": "Choose the critical value",
            "result": "$1.96$",
            "why": "standard normal 95 percent value"
          },
          {
            "do": "Compute the margin",
            "result": "$1.96\\cdot0.5=0.98$",
            "why": "critical value times SE"
          },
          {
            "do": "Compute the lower endpoint",
            "result": "$5-0.98=4.02$",
            "why": "subtract the margin"
          },
          {
            "do": "Compute the upper endpoint",
            "result": "$5+0.98=5.98$",
            "why": "add the margin"
          },
          {
            "do": "State interval",
            "result": "$[4.02,5.98]$",
            "why": "combine endpoints"
          }
        ],
        "answer": "The interval is $[4.02,5.98]$."
      },
      {
        "problem": "A sample size increase cuts SE from $0.10$ to $0.05$. What happens to a fixed effect $0.20$ in SE units?",
        "steps": [
          {
            "do": "Compute old signal",
            "result": "$0.20/0.10=2$",
            "why": "effect divided by old SE"
          },
          {
            "do": "Compute new signal",
            "result": "$0.20/0.05=4$",
            "why": "effect divided by new SE"
          },
          {
            "do": "Compare signals",
            "result": "$4/2=2$",
            "why": "standardized evidence doubled"
          },
          {
            "do": "Relate to variance",
            "result": "$0.05^2/0.10^2=0.25$",
            "why": "variance is one quarter as large"
          },
          {
            "do": "Interpret",
            "result": "$\\text{more precision}$",
            "why": "same effect is easier to detect"
          }
        ],
        "answer": "The signal grows from $2$ SE to $4$ SE."
      },
      {
        "problem": "Linear regression: a validation lift is $0.015$ with SE $0.006$. Test zero lift two-sided at $5%$.",
        "steps": [
          {
            "do": "Compute statistic",
            "result": "$0.015/0.006=2.5$",
            "why": "lift divided by standard error"
          },
          {
            "do": "Approximate p-value",
            "result": "$p\\approx0.0124$",
            "why": "two-sided normal tail for 2.5"
          },
          {
            "do": "Compare to alpha",
            "result": "$0.0124<0.05$",
            "why": "below the threshold"
          },
          {
            "do": "State decision",
            "result": "$\\text{reject zero lift}$",
            "why": "evidence supports a nonzero lift"
          },
          {
            "do": "Interpret practically",
            "result": "$1.5\\%$ estimated lift",
            "why": "statistical and practical meaning should both be considered"
          }
        ],
        "answer": "Reject zero lift; the estimated lift is statistically significant."
      }
    ],
    "applications": [
      {
        "title": "Linear regression in experiments",
        "background": "least squares modeling appears whenever teams need a calibrated numerical decision rather than a hunch.",
        "numbers": "With estimate $0.12$ and SE $0.03$, the standardized value is $0.12/0.03=4$."
      },
      {
        "title": "Linear regression for model evaluation",
        "background": "least squares modeling helps compare models on finite validation data, where random variation can mimic improvement.",
        "numbers": "A metric change $0.006$ with SE $0.002$ equals $3$ standard errors."
      },
      {
        "title": "Linear regression in monitoring",
        "background": "least squares modeling turns noisy production measurements into thresholds that can be audited.",
        "numbers": "A baseline $10$ and current mean $10.6$ with SE $0.2$ gives statistic $3$."
      },
      {
        "title": "Linear regression for sample planning",
        "background": "least squares modeling supports deciding whether more data are needed before trusting a conclusion.",
        "numbers": "Halving SE from $0.04$ to $0.02$ makes the same $0.06$ effect grow from $1.5$ to $3$ SE."
      },
      {
        "title": "Linear regression in fairness analysis",
        "background": "least squares modeling is useful when rate differences across groups must be separated from sampling noise.",
        "numbers": "A gap $0.04$ with SE $0.015$ gives $z\\approx2.67$."
      },
      {
        "title": "Linear regression in scientific reporting",
        "background": "least squares modeling gives a shared language for uncertainty, so readers can recompute the evidence.",
        "numbers": "An interval $0.20\\pm1.96(0.05)$ is $[0.102,0.298]$."
      }
    ],
    "applicationsClose": "Linear regression keeps ML inference grounded: the calculation matters because new data are the real exam.",
    "takeaways": [
      "Start from the data statistic and the target it estimates.",
      "Use standard errors, resampling, or bounds to quantify sample-to-sample variation.",
      "Model complexity helps training fit but can hurt new-data performance.",
      "For ML, always connect the statistical number to deployment consequences."
    ]
  },
  "math-18-29": {
    "id": "math-18-29",
    "title": "The bias–variance tradeoff",
    "tagline": "The bias-variance tradeoff explains why models can fail by being too rigid or too sensitive.",
    "connections": {
      "buildsOn": [
        "estimators",
        "loss functions",
        "sampling distributions"
      ],
      "leadsTo": [
        "regularization",
        "model selection",
        "ML deployment"
      ],
      "usedWith": [
        "risk",
        "empirical averages",
        "concentration inequalities"
      ]
    },
    "motivation": "<p>You already know that a model can fit observed data and still face uncertainty. The lesson here is to make that uncertainty measurable rather than mysterious.</p><p><b>The bias–variance tradeoff</b> gives a practical mathematical lens for ML: compare explanations, reduce assumptions, resample, fit, balance complexity, or bound future error.</p>",
    "definition": "<p>The central object is an estimate computed from data and judged against a population target. In bias-variance tradeoff, we write the data calculation clearly, identify what randomness remains, and ask how the result would change on new samples.</p><p>The guiding derivation is the same across inference: define a statistic, understand its sampling behavior, and use that behavior to make a calibrated statement about the unknown target.</p><p><b>Assumptions that matter:</b> observations should match the sampling story; dependence and selection bias change the calculation; finite samples can be noisy; and ML use requires checking both statistical and practical error.</p>",
    "worked": {
      "problem": "A validation experiment reports training error $0.08$ and test error $0.12$ on $1000$ test examples. Use bias-variance tradeoff thinking to compute the generalization gap and an approximate SE for the test error as a proportion.",
      "skills": [
        "bias-variance tradeoff",
        "ML metrics",
        "standard error"
      ],
      "strategy": "Compute the observed gap first, then quantify the sampling noise in the held-out test estimate.",
      "steps": [
        {
          "do": "Compute the gap",
          "result": "$0.12-0.08=0.04$",
          "why": "test error minus training error"
        },
        {
          "do": "Compute binomial variance estimate",
          "result": "$0.12\\cdot0.88=0.1056$",
          "why": "error is a proportion"
        },
        {
          "do": "Divide by test size",
          "result": "$0.1056/1000=0.0001056$",
          "why": "variance of the sample proportion"
        },
        {
          "do": "Take the square root",
          "result": "$SE\\approx0.0103$",
          "why": "standard error of test error"
        },
        {
          "do": "Compare gap to SE",
          "result": "$0.04/0.0103\\approx3.88$",
          "why": "gap is several SEs"
        }
      ],
      "verify": "A four-point gap is much larger than one standard error, so it deserves attention.",
      "answer": "The gap is $0.04$, and the test-error SE is about $0.0103$.",
      "connects": "The bias–variance tradeoff turns model behavior into quantities you can recompute."
    },
    "practice": [
      {
        "problem": "Compute a standardized statistic for estimate $12$, null $10$, and SE $1$.",
        "steps": [
          {
            "do": "Write the formula",
            "result": "$(\\hat\\theta-\\theta_0)/SE$",
            "why": "standardized discrepancy"
          },
          {
            "do": "Substitute values",
            "result": "$(12-10)/1$",
            "why": "use the estimate, null, and standard error"
          },
          {
            "do": "Subtract",
            "result": "$2/1$",
            "why": "compute the numerator"
          },
          {
            "do": "Divide",
            "result": "$2$",
            "why": "standard-error units"
          },
          {
            "do": "Interpret",
            "result": "$2$ SE above the null",
            "why": "positive means above the null"
          }
        ],
        "answer": "The statistic is $2$."
      },
      {
        "problem": "Compute a two-sided normal p-value for $z=2$ using upper tail $0.0228$.",
        "steps": [
          {
            "do": "Identify one tail",
            "result": "$0.0228$",
            "why": "given normal upper-tail probability"
          },
          {
            "do": "Double it",
            "result": "$2\\cdot0.0228=0.0456$",
            "why": "two-sided test counts both directions"
          },
          {
            "do": "Compare to $0.05$",
            "result": "$0.0456<0.05$",
            "why": "small enough for 5 percent"
          },
          {
            "do": "State the decision",
            "result": "$\\text{reject}$",
            "why": "p-value below alpha"
          },
          {
            "do": "Name the evidence",
            "result": "$\\text{moderate evidence}$",
            "why": "near the conventional cutoff"
          }
        ],
        "answer": "The p-value is $0.0456$, so reject at $5\\%$."
      },
      {
        "problem": "Find a $95%$ interval for estimate $5$ with SE $0.5$.",
        "steps": [
          {
            "do": "Choose the critical value",
            "result": "$1.96$",
            "why": "standard normal 95 percent value"
          },
          {
            "do": "Compute the margin",
            "result": "$1.96\\cdot0.5=0.98$",
            "why": "critical value times SE"
          },
          {
            "do": "Compute the lower endpoint",
            "result": "$5-0.98=4.02$",
            "why": "subtract the margin"
          },
          {
            "do": "Compute the upper endpoint",
            "result": "$5+0.98=5.98$",
            "why": "add the margin"
          },
          {
            "do": "State interval",
            "result": "$[4.02,5.98]$",
            "why": "combine endpoints"
          }
        ],
        "answer": "The interval is $[4.02,5.98]$."
      },
      {
        "problem": "A sample size increase cuts SE from $0.10$ to $0.05$. What happens to a fixed effect $0.20$ in SE units?",
        "steps": [
          {
            "do": "Compute old signal",
            "result": "$0.20/0.10=2$",
            "why": "effect divided by old SE"
          },
          {
            "do": "Compute new signal",
            "result": "$0.20/0.05=4$",
            "why": "effect divided by new SE"
          },
          {
            "do": "Compare signals",
            "result": "$4/2=2$",
            "why": "standardized evidence doubled"
          },
          {
            "do": "Relate to variance",
            "result": "$0.05^2/0.10^2=0.25$",
            "why": "variance is one quarter as large"
          },
          {
            "do": "Interpret",
            "result": "$\\text{more precision}$",
            "why": "same effect is easier to detect"
          }
        ],
        "answer": "The signal grows from $2$ SE to $4$ SE."
      },
      {
        "problem": "The bias–variance tradeoff: a validation lift is $0.015$ with SE $0.006$. Test zero lift two-sided at $5%$.",
        "steps": [
          {
            "do": "Compute statistic",
            "result": "$0.015/0.006=2.5$",
            "why": "lift divided by standard error"
          },
          {
            "do": "Approximate p-value",
            "result": "$p\\approx0.0124$",
            "why": "two-sided normal tail for 2.5"
          },
          {
            "do": "Compare to alpha",
            "result": "$0.0124<0.05$",
            "why": "below the threshold"
          },
          {
            "do": "State decision",
            "result": "$\\text{reject zero lift}$",
            "why": "evidence supports a nonzero lift"
          },
          {
            "do": "Interpret practically",
            "result": "$1.5\\%$ estimated lift",
            "why": "statistical and practical meaning should both be considered"
          }
        ],
        "answer": "Reject zero lift; the estimated lift is statistically significant."
      }
    ],
    "applications": [
      {
        "title": "The bias–variance tradeoff in experiments",
        "background": "prediction error decomposition appears whenever teams need a calibrated numerical decision rather than a hunch.",
        "numbers": "With estimate $0.12$ and SE $0.03$, the standardized value is $0.12/0.03=4$."
      },
      {
        "title": "The bias–variance tradeoff for model evaluation",
        "background": "prediction error decomposition helps compare models on finite validation data, where random variation can mimic improvement.",
        "numbers": "A metric change $0.006$ with SE $0.002$ equals $3$ standard errors."
      },
      {
        "title": "The bias–variance tradeoff in monitoring",
        "background": "prediction error decomposition turns noisy production measurements into thresholds that can be audited.",
        "numbers": "A baseline $10$ and current mean $10.6$ with SE $0.2$ gives statistic $3$."
      },
      {
        "title": "The bias–variance tradeoff for sample planning",
        "background": "prediction error decomposition supports deciding whether more data are needed before trusting a conclusion.",
        "numbers": "Halving SE from $0.04$ to $0.02$ makes the same $0.06$ effect grow from $1.5$ to $3$ SE."
      },
      {
        "title": "The bias–variance tradeoff in fairness analysis",
        "background": "prediction error decomposition is useful when rate differences across groups must be separated from sampling noise.",
        "numbers": "A gap $0.04$ with SE $0.015$ gives $z\\approx2.67$."
      },
      {
        "title": "The bias–variance tradeoff in scientific reporting",
        "background": "prediction error decomposition gives a shared language for uncertainty, so readers can recompute the evidence.",
        "numbers": "An interval $0.20\\pm1.96(0.05)$ is $[0.102,0.298]$."
      }
    ],
    "applicationsClose": "The bias–variance tradeoff keeps ML inference grounded: the calculation matters because new data are the real exam.",
    "takeaways": [
      "Start from the data statistic and the target it estimates.",
      "Use standard errors, resampling, or bounds to quantify sample-to-sample variation.",
      "Model complexity helps training fit but can hurt new-data performance.",
      "For ML, always connect the statistical number to deployment consequences."
    ]
  },
  "math-18-30": {
    "id": "math-18-30",
    "title": "Statistical learning theory & generalization",
    "tagline": "Generalization theory asks why a model trained on one sample can work on new data.",
    "connections": {
      "buildsOn": [
        "estimators",
        "loss functions",
        "sampling distributions"
      ],
      "leadsTo": [
        "regularization",
        "model selection",
        "ML deployment"
      ],
      "usedWith": [
        "risk",
        "empirical averages",
        "concentration inequalities"
      ]
    },
    "motivation": "<p>You already know that a model can fit observed data and still face uncertainty. The lesson here is to make that uncertainty measurable rather than mysterious.</p><p><b>Statistical learning theory & generalization</b> gives a practical mathematical lens for ML: compare explanations, reduce assumptions, resample, fit, balance complexity, or bound future error.</p>",
    "definition": "<p>The central object is an estimate computed from data and judged against a population target. In statistical learning theory, we write the data calculation clearly, identify what randomness remains, and ask how the result would change on new samples.</p><p>The guiding derivation is the same across inference: define a statistic, understand its sampling behavior, and use that behavior to make a calibrated statement about the unknown target.</p><p><b>Assumptions that matter:</b> observations should match the sampling story; dependence and selection bias change the calculation; finite samples can be noisy; and ML use requires checking both statistical and practical error.</p>",
    "worked": {
      "problem": "A validation experiment reports training error $0.08$ and test error $0.12$ on $1000$ test examples. Use statistical learning theory thinking to compute the generalization gap and an approximate SE for the test error as a proportion.",
      "skills": [
        "statistical learning theory",
        "ML metrics",
        "standard error"
      ],
      "strategy": "Compute the observed gap first, then quantify the sampling noise in the held-out test estimate.",
      "steps": [
        {
          "do": "Compute the gap",
          "result": "$0.12-0.08=0.04$",
          "why": "test error minus training error"
        },
        {
          "do": "Compute binomial variance estimate",
          "result": "$0.12\\cdot0.88=0.1056$",
          "why": "error is a proportion"
        },
        {
          "do": "Divide by test size",
          "result": "$0.1056/1000=0.0001056$",
          "why": "variance of the sample proportion"
        },
        {
          "do": "Take the square root",
          "result": "$SE\\approx0.0103$",
          "why": "standard error of test error"
        },
        {
          "do": "Compare gap to SE",
          "result": "$0.04/0.0103\\approx3.88$",
          "why": "gap is several SEs"
        }
      ],
      "verify": "A four-point gap is much larger than one standard error, so it deserves attention.",
      "answer": "The gap is $0.04$, and the test-error SE is about $0.0103$.",
      "connects": "Statistical learning theory & generalization turns model behavior into quantities you can recompute."
    },
    "practice": [
      {
        "problem": "Compute a standardized statistic for estimate $12$, null $10$, and SE $1$.",
        "steps": [
          {
            "do": "Write the formula",
            "result": "$(\\hat\\theta-\\theta_0)/SE$",
            "why": "standardized discrepancy"
          },
          {
            "do": "Substitute values",
            "result": "$(12-10)/1$",
            "why": "use the estimate, null, and standard error"
          },
          {
            "do": "Subtract",
            "result": "$2/1$",
            "why": "compute the numerator"
          },
          {
            "do": "Divide",
            "result": "$2$",
            "why": "standard-error units"
          },
          {
            "do": "Interpret",
            "result": "$2$ SE above the null",
            "why": "positive means above the null"
          }
        ],
        "answer": "The statistic is $2$."
      },
      {
        "problem": "Compute a two-sided normal p-value for $z=2$ using upper tail $0.0228$.",
        "steps": [
          {
            "do": "Identify one tail",
            "result": "$0.0228$",
            "why": "given normal upper-tail probability"
          },
          {
            "do": "Double it",
            "result": "$2\\cdot0.0228=0.0456$",
            "why": "two-sided test counts both directions"
          },
          {
            "do": "Compare to $0.05$",
            "result": "$0.0456<0.05$",
            "why": "small enough for 5 percent"
          },
          {
            "do": "State the decision",
            "result": "$\\text{reject}$",
            "why": "p-value below alpha"
          },
          {
            "do": "Name the evidence",
            "result": "$\\text{moderate evidence}$",
            "why": "near the conventional cutoff"
          }
        ],
        "answer": "The p-value is $0.0456$, so reject at $5\\%$."
      },
      {
        "problem": "Find a $95%$ interval for estimate $5$ with SE $0.5$.",
        "steps": [
          {
            "do": "Choose the critical value",
            "result": "$1.96$",
            "why": "standard normal 95 percent value"
          },
          {
            "do": "Compute the margin",
            "result": "$1.96\\cdot0.5=0.98$",
            "why": "critical value times SE"
          },
          {
            "do": "Compute the lower endpoint",
            "result": "$5-0.98=4.02$",
            "why": "subtract the margin"
          },
          {
            "do": "Compute the upper endpoint",
            "result": "$5+0.98=5.98$",
            "why": "add the margin"
          },
          {
            "do": "State interval",
            "result": "$[4.02,5.98]$",
            "why": "combine endpoints"
          }
        ],
        "answer": "The interval is $[4.02,5.98]$."
      },
      {
        "problem": "A sample size increase cuts SE from $0.10$ to $0.05$. What happens to a fixed effect $0.20$ in SE units?",
        "steps": [
          {
            "do": "Compute old signal",
            "result": "$0.20/0.10=2$",
            "why": "effect divided by old SE"
          },
          {
            "do": "Compute new signal",
            "result": "$0.20/0.05=4$",
            "why": "effect divided by new SE"
          },
          {
            "do": "Compare signals",
            "result": "$4/2=2$",
            "why": "standardized evidence doubled"
          },
          {
            "do": "Relate to variance",
            "result": "$0.05^2/0.10^2=0.25$",
            "why": "variance is one quarter as large"
          },
          {
            "do": "Interpret",
            "result": "$\\text{more precision}$",
            "why": "same effect is easier to detect"
          }
        ],
        "answer": "The signal grows from $2$ SE to $4$ SE."
      },
      {
        "problem": "Statistical learning theory & generalization: a validation lift is $0.015$ with SE $0.006$. Test zero lift two-sided at $5%$.",
        "steps": [
          {
            "do": "Compute statistic",
            "result": "$0.015/0.006=2.5$",
            "why": "lift divided by standard error"
          },
          {
            "do": "Approximate p-value",
            "result": "$p\\approx0.0124$",
            "why": "two-sided normal tail for 2.5"
          },
          {
            "do": "Compare to alpha",
            "result": "$0.0124<0.05$",
            "why": "below the threshold"
          },
          {
            "do": "State decision",
            "result": "$\\text{reject zero lift}$",
            "why": "evidence supports a nonzero lift"
          },
          {
            "do": "Interpret practically",
            "result": "$1.5\\%$ estimated lift",
            "why": "statistical and practical meaning should both be considered"
          }
        ],
        "answer": "Reject zero lift; the estimated lift is statistically significant."
      }
    ],
    "applications": [
      {
        "title": "Statistical learning theory & generalization in experiments",
        "background": "ML generalization appears whenever teams need a calibrated numerical decision rather than a hunch.",
        "numbers": "With estimate $0.12$ and SE $0.03$, the standardized value is $0.12/0.03=4$."
      },
      {
        "title": "Statistical learning theory & generalization for model evaluation",
        "background": "ML generalization helps compare models on finite validation data, where random variation can mimic improvement.",
        "numbers": "A metric change $0.006$ with SE $0.002$ equals $3$ standard errors."
      },
      {
        "title": "Statistical learning theory & generalization in monitoring",
        "background": "ML generalization turns noisy production measurements into thresholds that can be audited.",
        "numbers": "A baseline $10$ and current mean $10.6$ with SE $0.2$ gives statistic $3$."
      },
      {
        "title": "Statistical learning theory & generalization for sample planning",
        "background": "ML generalization supports deciding whether more data are needed before trusting a conclusion.",
        "numbers": "Halving SE from $0.04$ to $0.02$ makes the same $0.06$ effect grow from $1.5$ to $3$ SE."
      },
      {
        "title": "Statistical learning theory & generalization in fairness analysis",
        "background": "ML generalization is useful when rate differences across groups must be separated from sampling noise.",
        "numbers": "A gap $0.04$ with SE $0.015$ gives $z\\approx2.67$."
      },
      {
        "title": "Statistical learning theory & generalization in scientific reporting",
        "background": "ML generalization gives a shared language for uncertainty, so readers can recompute the evidence.",
        "numbers": "An interval $0.20\\pm1.96(0.05)$ is $[0.102,0.298]$."
      }
    ],
    "applicationsClose": "Statistical learning theory & generalization keeps ML inference grounded: the calculation matters because new data are the real exam.",
    "takeaways": [
      "Start from the data statistic and the target it estimates.",
      "Use standard errors, resampling, or bounds to quantify sample-to-sample variation.",
      "Model complexity helps training fit but can hurt new-data performance.",
      "For ML, always connect the statistical number to deployment consequences."
    ]
  }
};
