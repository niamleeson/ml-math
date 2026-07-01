module.exports = {
  "math-22-14": {
    "id": "math-22-14",
    "title": "Variance reduction (SVRG, SAG)",
    "tagline": "Variance reduction keeps stochastic gradients cheap while making them less jumpy near the minimum.",
    "connections": {
      "buildsOn": [
        "Stochastic gradient descent",
        "expectation and variance",
        "finite-sum losses"
      ],
      "leadsTo": [
        "AdaGrad",
        "RMSProp",
        "Adam"
      ],
      "usedWith": [
        "sample means",
        "gradient descent",
        "Taylor approximations",
        "convexity"
      ]
    },
    "motivation": "<p>You already know the bargain in SGD: one example gives a cheap gradient, but it is noisy. Early in training that noise can be useful; near a good solution it can make the parameters wobble.</p><p><b>Variance reduction</b> keeps the cheap per-example flavor while subtracting a carefully chosen control value. The beautiful idea is humble: if two noisy quantities move together, their difference is often much quieter.</p>",
    "definition": "<p>For a finite-sum objective $f(w)=\\dfrac1n\\sum_{i=1}^n f_i(w)$, the full gradient is $\\nabla f(w)=\\dfrac1n\\sum_i \\nabla f_i(w)$. In SVRG, choose a snapshot $\\tilde w$ and compute $\\mu=\\nabla f(\\tilde w)$. A stochastic update uses $$g_i(w)=\\nabla f_i(w)-\\nabla f_i(\\tilde w)+\\mu.$$</p><p>The estimator is unbiased because $\\mathbb E_i[g_i(w)]=\\nabla f(w)-\\nabla f(\\tilde w)+\\nabla f(\\tilde w)=\\nabla f(w)$. SAG instead stores past gradients and averages the table, trading a small bias at first for low-variance updates after the table is refreshed.</p><p><b>Assumptions that matter:</b> the objective is a finite sum; the index $i$ is sampled uniformly unless corrected by weights; SVRG needs occasional full-gradient snapshots; SAG needs memory for one stored gradient per example; and variance reduction helps most when individual gradients are correlated across nearby parameter values.</p>",
    "worked": {
      "problem": "For two examples, let $\\nabla f_1(w)=6$, $\\nabla f_2(w)=2$, $\\nabla f_1(\\tilde w)=5$, and $\\nabla f_2(\\tilde w)=3$. Compute the SVRG estimator values and show their average equals the full gradient at $w$.",
      "skills": [
        "finite sums",
        "unbiased estimators",
        "variance comparison"
      ],
      "strategy": "The estimator looks strange until you average over the sampled example.",
      "steps": [
        {
          "do": "Compute the snapshot full gradient",
          "result": "$\\mu=(5+3)/2=4$",
          "why": "average the two snapshot gradients"
        },
        {
          "do": "Build the estimator for example 1",
          "result": "$g_1=6-5+4=5$",
          "why": "subtract its snapshot gradient and add the full snapshot average"
        },
        {
          "do": "Build the estimator for example 2",
          "result": "$g_2=2-3+4=3$",
          "why": "use the same control value $\\mu$"
        },
        {
          "do": "Average the estimator values",
          "result": "$(5+3)/2=4$",
          "why": "uniform sampling gives the expectation"
        },
        {
          "do": "Compute the current full gradient",
          "result": "$(6+2)/2=4$",
          "why": "average the true current per-example gradients"
        }
      ],
      "verify": "The estimator values $5$ and $3$ are less spread out than raw gradients $6$ and $2$, and their mean is still correct.",
      "answer": "The SVRG estimator has values $5$ and $3$, with expectation $4=\\nabla f(w)$.",
      "connects": "Variance reduction changes the noise without changing the target direction."
    },
    "practice": [
      {
        "problem": "Raw stochastic gradients are $10$ and $2$ with equal probability. Compute their mean and variance.",
        "steps": [
          {
            "do": "Compute the mean",
            "result": "$\\bar g=(10+2)/2=6$",
            "why": "uniform average"
          },
          {
            "do": "Compute the first deviation",
            "result": "$10-6=4$",
            "why": "variance measures squared distance from the mean"
          },
          {
            "do": "Compute the second deviation",
            "result": "$2-6=-4$",
            "why": "include both outcomes"
          },
          {
            "do": "Average squared deviations",
            "result": "$(4^2+(-4)^2)/2=16$",
            "why": "variance is mean squared deviation"
          }
        ],
        "answer": "Mean $6$ and variance $16$."
      },
      {
        "problem": "A control variate changes the two estimator values to $7$ and $5$. Compute the mean and variance.",
        "steps": [
          {
            "do": "Compute the mean",
            "result": "$(7+5)/2=6$",
            "why": "the target mean is preserved"
          },
          {
            "do": "Find deviations",
            "result": "$7-6=1$ and $5-6=-1$",
            "why": "measure spread around the mean"
          },
          {
            "do": "Square deviations",
            "result": "$1^2=1$ and $(-1)^2=1$",
            "why": "variance uses squares"
          },
          {
            "do": "Average the squares",
            "result": "$(1+1)/2=1$",
            "why": "the new spread is much smaller"
          }
        ],
        "answer": "Mean $6$ and variance $1$."
      },
      {
        "problem": "For $n=4$, stored SAG gradients are $[3,5,1,7]$. Example 3 is refreshed to $4$. Find the old average and new average.",
        "steps": [
          {
            "do": "Average the old table",
            "result": "$(3+5+1+7)/4=4$",
            "why": "SAG uses the gradient table"
          },
          {
            "do": "Replace the third entry",
            "result": "$[3,5,4,7]$",
            "why": "only one stored gradient changes"
          },
          {
            "do": "Average the new table",
            "result": "$(3+5+4+7)/4=19/4$",
            "why": "sum the refreshed table"
          },
          {
            "do": "Convert to decimal",
            "result": "$19/4=4.75$",
            "why": "read the update direction numerically"
          }
        ],
        "answer": "The SAG average moves from $4$ to $4.75$."
      },
      {
        "problem": "SVRG uses $\\eta=0.1$, current $w=2$, and estimator $g=3.5$. Compute the update.",
        "steps": [
          {
            "do": "Write the update rule",
            "result": "$w^+=w-\\eta g$",
            "why": "gradient methods step opposite the gradient estimate"
          },
          {
            "do": "Substitute values",
            "result": "$w^+=2-0.1\\cdot3.5$",
            "why": "use the given learning rate"
          },
          {
            "do": "Multiply",
            "result": "$0.1\\cdot3.5=0.35$",
            "why": "compute the step size"
          },
          {
            "do": "Subtract",
            "result": "$w^+=1.65$",
            "why": "move downhill"
          }
        ],
        "answer": "The next parameter is $1.65$."
      },
      {
        "problem": "At $w$, raw gradients are $[8,4]$; at $\\tilde w$, they are $[7,5]$. Compute SVRG values and compare variance with raw gradients.",
        "steps": [
          {
            "do": "Compute $\\mu$",
            "result": "$(7+5)/2=6$",
            "why": "snapshot full gradient"
          },
          {
            "do": "Compute $g_1$",
            "result": "$8-7+6=7$",
            "why": "SVRG correction for example 1"
          },
          {
            "do": "Compute $g_2$",
            "result": "$4-5+6=5$",
            "why": "SVRG correction for example 2"
          },
          {
            "do": "Compute SVRG variance",
            "result": "$((7-6)^2+(5-6)^2)/2=1$",
            "why": "mean is 6"
          },
          {
            "do": "Compute raw variance",
            "result": "$((8-6)^2+(4-6)^2)/2=4$",
            "why": "raw gradients are more spread out"
          }
        ],
        "answer": "SVRG keeps mean $6$ and lowers variance from $4$ to $1$."
      }
    ],
    "applications": [
      {
        "title": "SVRG for finite datasets",
        "background": "Variance reduction was designed for empirical risk objectives where the training loss is an average over examples. It lets a run revisit examples without accepting full SGD noise forever.",
        "numbers": "With $n=10000$ examples and one snapshot every $2n$ inner steps, a cycle costs $10000+20000=30000$ component gradients; full gradient descent for $20000$ steps would cost $200000000$ component gradients."
      },
      {
        "title": "SAG in logistic regression",
        "background": "SAG became attractive for convex models such as logistic regression because stored gradients become a memory of the whole dataset.",
        "numbers": "For $n=50000$ examples and $d=20$ features, storing one gradient vector per example stores $1000000$ numbers; at 8 bytes each, that is about $8$ MB."
      },
      {
        "title": "Mini-batch noise control",
        "background": "The same variance idea explains why larger batches are steadier. Averaging independent noisy gradients lowers variance by the batch size.",
        "numbers": "If one gradient coordinate has variance $9$, a batch of $16$ independent examples has coordinate variance $9/16=0.5625$."
      },
      {
        "title": "Control variates in reinforcement learning",
        "background": "Policy-gradient methods use baselines as control variates because returns are noisy. Subtracting a baseline can reduce variance without changing the expected gradient.",
        "numbers": "If returns $[12,8]$ have mean $10$, subtracting baseline $10$ gives advantages $[2,-2]$; the policy direction is weighted by smaller centered numbers."
      },
      {
        "title": "Training near a minimum",
        "background": "Near a minimum, the true gradient may be tiny while individual example gradients remain nonzero. Variance reduction helps the optimizer hear the small signal.",
        "numbers": "If the full gradient is $0.02$ but raw samples have standard deviation $1.0$, reducing standard deviation to $0.1$ improves signal-to-noise from $0.02$ to $0.2$."
      },
      {
        "title": "Distributed optimization",
        "background": "In distributed training, stale or partial gradients introduce noise. Variance-reduced estimators give a mathematical template for correcting local updates with a shared reference.",
        "numbers": "If a worker gradient is $1.8$, its snapshot value was $2.1$, and the global snapshot average is $2.0$, the corrected estimate is $1.8-2.1+2.0=1.7$."
      }
    ],
    "applicationsClose": "The shared thread is control: keep the economy of sampling, but remove the part of the randomness you can predict.",
    "takeaways": [
      "SVRG is unbiased because the snapshot correction averages back to the full gradient.",
      "SAG lowers variance by averaging a stored table of past component gradients.",
      "Variance reduction is most useful for finite-sum objectives and late-stage training.",
      "The price is extra computation, memory, or both."
    ]
  },
  "math-22-15": {
    "id": "math-22-15",
    "title": "AdaGrad",
    "tagline": "AdaGrad gives frequently used coordinates smaller future steps and rare coordinates the patience they need.",
    "connections": {
      "buildsOn": [
        "Variance reduction (SVRG, SAG)",
        "Stochastic gradient descent",
        "vector norms"
      ],
      "leadsTo": [
        "RMSProp",
        "Adam",
        "online convex optimization"
      ],
      "usedWith": [
        "diagonal matrices",
        "learning rates",
        "convexity",
        "feature scaling"
      ]
    },
    "motivation": "<p>You already know that training means changing parameters to reduce a loss. The hard part is that different coordinates, constraints, and curvatures do not all behave the same way.</p><p><b>AdaGrad</b> gives a particular tool for that difficulty. Its central move is squared-gradient accumulator: a way to make optimization less like blind walking and more like reading the local terrain.</p>",
    "definition": "<p>The core formula is $G_t=G_{t-1}+g_t^2$ and $w_{t+1}=w_t-\\eta g_t/(\\sqrt{G_t}+\\epsilon)$. Here the symbols name the current parameter or variable, the gradient information, and any memory or constraints used by the method. The method is built to handle adaptive coordinate steps.</p><p>The reason this helps is that the raw gradient is not always the best step by itself. Scaling, pricing, coordinate choices, or curvature can turn the same local information into a safer or more informative move.</p><p><b>Assumptions that matter:</b> check differentiability when gradients or Hessians are used; check convexity before claiming global optimality; keep learning rates, decay constants, and multiplier signs in their required ranges; and remember that numerical solvers certify different things depending on the problem class.</p>",
    "worked": {
      "problem": "Use AdaGrad with $w_0=1$, $\\eta=1$, $\\epsilon=0$, and gradients $g_1=2$, $g_2=4$. Compute $w_2$.",
      "skills": [
        "adaptive learning rates",
        "accumulators",
        "parameter updates"
      ],
      "strategy": "Accumulate squared gradients first; the denominator changes each step.",
      "steps": [
        {
          "do": "Initialize the accumulator",
          "result": "$G_0=0$",
          "why": "AdaGrad starts with no squared-gradient history"
        },
        {
          "do": "Accumulate the first square",
          "result": "$G_1=0+2^2=4$",
          "why": "add $g_1^2$"
        },
        {
          "do": "Compute the first step",
          "result": "$1\\cdot2/\\sqrt4=1$",
          "why": "divide the gradient by its accumulated scale"
        },
        {
          "do": "Update the parameter",
          "result": "$w_1=1-1=0$",
          "why": "move opposite the gradient"
        },
        {
          "do": "Accumulate the second square",
          "result": "$G_2=4+4^2=20$",
          "why": "history only grows"
        },
        {
          "do": "Compute the second step",
          "result": "$4/\\sqrt{20}\\approx0.894$",
          "why": "large past gradients shrink the effective step"
        },
        {
          "do": "Update again",
          "result": "$w_2\\approx-0.894$",
          "why": "subtract the second adaptive step"
        }
      ],
      "verify": "The second raw gradient is larger, but the denominator also grew, so the step stays controlled.",
      "answer": "$w_2\\approx-0.894$.",
      "connects": "AdaGrad converts gradient history into coordinate-wise caution."
    },
    "practice": [
      {
        "problem": "For one coordinate, gradients are $3$ and $4$. Compute AdaGrad's accumulator after two steps.",
        "steps": [
          {
            "do": "Square the first gradient",
            "result": "$3^2=9$",
            "why": "AdaGrad stores squared gradients"
          },
          {
            "do": "Set $G_1$",
            "result": "$G_1=9$",
            "why": "start from zero"
          },
          {
            "do": "Square the second gradient",
            "result": "$4^2=16$",
            "why": "process the next step"
          },
          {
            "do": "Add to the accumulator",
            "result": "$G_2=9+16=25$",
            "why": "the accumulator is cumulative"
          }
        ],
        "answer": "$G_2=25$."
      },
      {
        "problem": "With $\\eta=0.5$, $G=25$, $g=4$, and $\\epsilon=0$, find the AdaGrad step size.",
        "steps": [
          {
            "do": "Write the scaled step",
            "result": "$\\eta g/\\sqrt G$",
            "why": "ignore $\\epsilon$ because it is zero"
          },
          {
            "do": "Substitute values",
            "result": "$0.5\\cdot4/\\sqrt{25}$",
            "why": "use the given accumulator"
          },
          {
            "do": "Simplify the denominator",
            "result": "$\\sqrt{25}=5$",
            "why": "square root of the squared scale"
          },
          {
            "do": "Compute the step",
            "result": "$2/5=0.4$",
            "why": "divide"
          }
        ],
        "answer": "The parameter changes by $0.4$ opposite the gradient."
      },
      {
        "problem": "Two coordinates have $g=[6,1]$ and $G=[36,1]$. With $\\eta=1$, compute the adaptive step.",
        "steps": [
          {
            "do": "Take square roots",
            "result": "$\\sqrt G=[6,1]$",
            "why": "coordinate-wise denominators"
          },
          {
            "do": "Divide gradients by scales",
            "result": "$[6/6,1/1]=[1,1]$",
            "why": "each coordinate is normalized"
          },
          {
            "do": "Multiply by $\\eta$",
            "result": "$[1,1]$",
            "why": "the learning rate is 1"
          },
          {
            "do": "State the update direction",
            "result": "$-[1,1]$",
            "why": "gradient descent subtracts the step"
          }
        ],
        "answer": "The adaptive step is $[1,1]$."
      },
      {
        "problem": "A rare feature has accumulated $G=0.04$ and gradient $0.2$. A frequent feature has $G=100$ and gradient $2$. With $\\eta=1$, compare steps.",
        "steps": [
          {
            "do": "Compute the rare-feature step",
            "result": "$0.2/\\sqrt{0.04}=1$",
            "why": "small history keeps the step large"
          },
          {
            "do": "Compute the frequent-feature denominator",
            "result": "$\\sqrt{100}=10$",
            "why": "large history increases the denominator"
          },
          {
            "do": "Compute the frequent-feature step",
            "result": "$2/10=0.2$",
            "why": "frequent coordinates move less"
          },
          {
            "do": "Compare",
            "result": "$1>0.2$",
            "why": "AdaGrad favors rarely active coordinates"
          }
        ],
        "answer": "The rare feature step is $1$; the frequent feature step is $0.2$."
      },
      {
        "problem": "Run one vector AdaGrad update from $w=[2,-1]$, $g=[3,4]$, $G=[9,16]$, $\\eta=0.1$, $\\epsilon=0$.",
        "steps": [
          {
            "do": "Take coordinate square roots",
            "result": "$\\sqrt G=[3,4]$",
            "why": "scale each coordinate"
          },
          {
            "do": "Compute scaled gradient",
            "result": "$g/\\sqrt G=[1,1]$",
            "why": "divide coordinate-wise"
          },
          {
            "do": "Multiply by learning rate",
            "result": "$0.1[1,1]=[0.1,0.1]$",
            "why": "form the actual step"
          },
          {
            "do": "Subtract from $w$",
            "result": "$[2,-1]-[0.1,0.1]=[1.9,-1.1]$",
            "why": "move opposite the gradient"
          }
        ],
        "answer": "The next vector is $[1.9,-1.1]$."
      }
    ],
    "applications": [
      {
        "title": "Sparse text models",
        "background": "AdaGrad became popular for NLP because rare words should not be drowned out by common words.",
        "numbers": "If word A appears $1000$ times and has $G=1000$, while word B appears once with $G=1$, equal gradients get steps in ratio $1/\\sqrt1$ versus $1/\\sqrt{1000}\\approx0.032$."
      },
      {
        "title": "Online advertising models",
        "background": "Click prediction receives streams of sparse categorical features. AdaGrad adapts each weight as evidence arrives.",
        "numbers": "With $\\eta=0.2$, gradient $0.5$, and $G=25$, the step is $0.2\\cdot0.5/5=0.02$."
      },
      {
        "title": "Feature scaling relief",
        "background": "Poorly scaled coordinates can destabilize ordinary SGD. AdaGrad automatically divides by observed gradient magnitude.",
        "numbers": "Gradients $[100,1]$ with $G=[10000,1]$ become scaled direction $[1,1]$."
      },
      {
        "title": "Convex online learning",
        "background": "AdaGrad has regret guarantees in online convex optimization, where examples arrive one at a time.",
        "numbers": "For $T=10000$, a $1/\\sqrt T$ scale is $0.01$, matching the way cumulative uncertainty shrinks."
      },
      {
        "title": "Embedding tables",
        "background": "Large embedding models have many rows updated rarely. AdaGrad gives newly touched rows relatively large movement.",
        "numbers": "If a row's accumulator is $0.25$ and gradient norm is $0.1$, the scaled norm is $0.1/0.5=0.2$."
      },
      {
        "title": "Why steps can vanish",
        "background": "Because $G_t$ only grows, AdaGrad may become too cautious during long nonstationary training.",
        "numbers": "Ten thousand gradients of size $1$ give $G=10000$ and denominator $100$, so $\\eta=0.1$ gives effective step $0.001$."
      }
    ],
    "applicationsClose": "Across theory and training practice, the method is one more way to make the optimization landscape legible through numbers you can compute.",
    "takeaways": [
      "AdaGrad is an optimization tool for sparse features.",
      "The arithmetic of each update matters: scale, sign, and feasibility change the result.",
      "Convex settings give stronger certificates than nonconvex settings.",
      "In ML, these methods are useful because training is optimization under noise, scale, and constraints."
    ]
  },
  "math-22-16": {
    "id": "math-22-16",
    "title": "RMSProp",
    "tagline": "RMSProp keeps AdaGrad's coordinate awareness but lets old gradients fade.",
    "connections": {
      "buildsOn": [
        "AdaGrad",
        "exponential moving averages",
        "Stochastic gradient descent"
      ],
      "leadsTo": [
        "Adam",
        "learning-rate schedules",
        "adaptive optimization"
      ],
      "usedWith": [
        "moving averages",
        "diagonal preconditioning",
        "exponential decay",
        "feature scaling"
      ]
    },
    "motivation": "<p>You already know that training means changing parameters to reduce a loss. The hard part is that different coordinates, constraints, and curvatures do not all behave the same way.</p><p><b>RMSProp</b> gives a particular tool for that difficulty. Its central move is exponential moving average: a way to make optimization less like blind walking and more like reading the local terrain.</p>",
    "definition": "<p>The core formula is $v_t=\\rho v_{t-1}+(1-\\rho)g_t^2$ and $w_{t+1}=w_t-\\eta g_t/(\\sqrt{v_t}+\\epsilon)$. Here the symbols name the current parameter or variable, the gradient information, and any memory or constraints used by the method. The method is built to handle nonstationary gradient scale.</p><p>The reason this helps is that the raw gradient is not always the best step by itself. Scaling, pricing, coordinate choices, or curvature can turn the same local information into a safer or more informative move.</p><p><b>Assumptions that matter:</b> check differentiability when gradients or Hessians are used; check convexity before claiming global optimality; keep learning rates, decay constants, and multiplier signs in their required ranges; and remember that numerical solvers certify different things depending on the problem class.</p>",
    "worked": {
      "problem": "Use RMSProp with $v_0=0$, $\\rho=0.9$, $g_1=4$, $g_2=2$, $\\eta=0.1$, and $\\epsilon=0$. Compute the second update scale $\\eta g_2/\\sqrt{v_2}$.",
      "skills": [
        "exponential averages",
        "adaptive scaling",
        "optimizer arithmetic"
      ],
      "strategy": "Unlike AdaGrad, RMSProp discounts old squares, so compute the moving average before the step.",
      "steps": [
        {
          "do": "Update $v_1$",
          "result": "$0.9\\cdot0+0.1\\cdot4^2=1.6$",
          "why": "only 10 percent of the new square enters"
        },
        {
          "do": "Update $v_2$",
          "result": "$0.9\\cdot1.6+0.1\\cdot2^2=1.84$",
          "why": "old scale decays and new scale is added"
        },
        {
          "do": "Take the square root",
          "result": "$\\sqrt{1.84}\\approx1.356$",
          "why": "RMSProp divides by root mean square size"
        },
        {
          "do": "Compute the numerator",
          "result": "$0.1\\cdot2=0.2$",
          "why": "learning rate times gradient"
        },
        {
          "do": "Divide",
          "result": "$0.2/1.356\\approx0.147$",
          "why": "adaptive step for the second gradient"
        }
      ],
      "verify": "The denominator reflects recent history, not the entire lifetime, so it can adapt if gradients calm down.",
      "answer": "The second step magnitude is about $0.147$.",
      "connects": "RMSProp is AdaGrad with a fading memory."
    },
    "practice": [
      {
        "problem": "With $v_0=0$, $\\rho=0.9$, and $g=3$, compute $v_1$.",
        "steps": [
          {
            "do": "Square the gradient",
            "result": "$3^2=9$",
            "why": "RMSProp tracks squared size"
          },
          {
            "do": "Weight the old average",
            "result": "$0.9\\cdot0=0$",
            "why": "there is no history yet"
          },
          {
            "do": "Weight the new square",
            "result": "$0.1\\cdot9=0.9$",
            "why": "new information gets weight $1-\\rho$"
          },
          {
            "do": "Add terms",
            "result": "$v_1=0.9$",
            "why": "combine old and new"
          }
        ],
        "answer": "$v_1=0.9$."
      },
      {
        "problem": "If $v=4$, $g=1$, $\\eta=0.01$, and $\\epsilon=0$, compute the RMSProp step magnitude.",
        "steps": [
          {
            "do": "Take the root scale",
            "result": "$\\sqrt4=2$",
            "why": "denominator is RMS scale"
          },
          {
            "do": "Multiply by learning rate",
            "result": "$0.01\\cdot1=0.01$",
            "why": "numerator"
          },
          {
            "do": "Divide",
            "result": "$0.01/2=0.005$",
            "why": "adaptive step"
          },
          {
            "do": "Attach direction",
            "result": "opposite the sign of $g$",
            "why": "gradient descent subtracts positive gradients"
          }
        ],
        "answer": "Step magnitude $0.005$."
      },
      {
        "problem": "Compare fading memory: $v_0=100$, $\\rho=0.9$, and current $g=0$. Find $v_1$.",
        "steps": [
          {
            "do": "Square the current gradient",
            "result": "$0^2=0$",
            "why": "no new gradient size"
          },
          {
            "do": "Decay old average",
            "result": "$0.9\\cdot100=90$",
            "why": "old information fades"
          },
          {
            "do": "Add new contribution",
            "result": "$0.1\\cdot0=0$",
            "why": "nothing new is added"
          },
          {
            "do": "Compute $v_1$",
            "result": "$90$",
            "why": "the scale decreases but not instantly"
          }
        ],
        "answer": "$v_1=90$."
      },
      {
        "problem": "For two coordinates, $g=[2,8]$, $v=[4,64]$, and $\\eta=0.1$. Compute the scaled step.",
        "steps": [
          {
            "do": "Take square roots",
            "result": "$\\sqrt v=[2,8]$",
            "why": "coordinate-wise scaling"
          },
          {
            "do": "Divide gradients",
            "result": "$[2/2,8/8]=[1,1]$",
            "why": "large coordinates are normalized"
          },
          {
            "do": "Multiply by $\\eta$",
            "result": "$[0.1,0.1]$",
            "why": "apply learning rate"
          },
          {
            "do": "State update",
            "result": "subtract $[0.1,0.1]$",
            "why": "move downhill"
          }
        ],
        "answer": "The RMSProp step is $[0.1,0.1]$."
      },
      {
        "problem": "Let $v_0=9$, $\\rho=0.5$, gradients $g_1=1$, $g_2=1$. Compute $v_2$.",
        "steps": [
          {
            "do": "Update first average",
            "result": "$v_1=0.5\\cdot9+0.5\\cdot1=5$",
            "why": "half old, half new"
          },
          {
            "do": "Square the second gradient",
            "result": "$1^2=1$",
            "why": "same new size"
          },
          {
            "do": "Update second average",
            "result": "$v_2=0.5\\cdot5+0.5\\cdot1=3$",
            "why": "history continues fading"
          },
          {
            "do": "Interpret",
            "result": "$3<9$",
            "why": "the scale adapts downward"
          }
        ],
        "answer": "$v_2=3$."
      }
    ],
    "applications": [
      {
        "title": "Nonstationary training",
        "background": "Neural-network gradient scales change during training. RMSProp can recover from early large gradients because old squares fade.",
        "numbers": "If $v=100$ and ten zero-gradient-like steps use $\\rho=0.9$, then $v$ becomes $100(0.9)^{10}\\approx34.9$."
      },
      {
        "title": "Recurrent neural networks",
        "background": "RMSProp was widely used for RNNs, where exploding or uneven gradients made plain SGD hard to tune.",
        "numbers": "A coordinate with $v=400$ and gradient $5$ gets scaled gradient $5/20=0.25$."
      },
      {
        "title": "Mini-batch deep learning",
        "background": "Batch gradients are noisy but have persistent coordinate scale. RMSProp smooths the squared noise before dividing by it.",
        "numbers": "For squared gradients $9$ then $1$ with $\\rho=0.9$, $v_2=0.9(0.9)+0.1(1)=0.91$."
      },
      {
        "title": "Learning-rate robustness",
        "background": "RMSProp often tolerates a larger global $\\eta$ because each coordinate has its own denominator.",
        "numbers": "With $\\eta=0.01$, $g=100$, and $v=10000$, the step is $0.01\\cdot100/100=0.01$."
      },
      {
        "title": "Signal-processing intuition",
        "background": "The moving average is the same low-pass-filter idea used to smooth signals.",
        "numbers": "For $v_{t-1}=4$, new square $16$, and $\\rho=0.75$, $v_t=3+4=7$."
      },
      {
        "title": "Difference from AdaGrad",
        "background": "RMSProp does not let one ancient burst suppress a coordinate forever.",
        "numbers": "A past $G=10000$ in AdaGrad gives denominator $100$ forever; RMSProp with $\\rho=0.9$ decays it to about $0.27$ after $100$ zero-square steps."
      }
    ],
    "applicationsClose": "Across theory and training practice, the method is one more way to make the optimization landscape legible through numbers you can compute.",
    "takeaways": [
      "RMSProp is an optimization tool for decay rate.",
      "The arithmetic of each update matters: scale, sign, and feasibility change the result.",
      "Convex settings give stronger certificates than nonconvex settings.",
      "In ML, these methods are useful because training is optimization under noise, scale, and constraints."
    ]
  },
  "math-22-17": {
    "id": "math-22-17",
    "title": "Adam",
    "tagline": "Adam combines momentum's memory of direction with RMSProp's memory of scale.",
    "connections": {
      "buildsOn": [
        "RMSProp",
        "Momentum",
        "exponential moving averages"
      ],
      "leadsTo": [
        "Nonconvex optimization & the DL landscape",
        "regularization during training",
        "optimizer selection"
      ],
      "usedWith": [
        "moving averages",
        "coordinate scaling",
        "stochastic gradients",
        "learning rates"
      ]
    },
    "motivation": "<p>You already know that training means changing parameters to reduce a loss. The hard part is that different coordinates, constraints, and curvatures do not all behave the same way.</p><p><b>Adam</b> gives a particular tool for that difficulty. Its central move is bias-corrected moments: a way to make optimization less like blind walking and more like reading the local terrain.</p>",
    "definition": "<p>The core formula is $m_t=\\beta_1m_{t-1}+(1-\\beta_1)g_t$, $v_t=\\beta_2v_{t-1}+(1-\\beta_2)g_t^2$, with bias corrections $\\hat m_t=m_t/(1-\\beta_1^t)$ and $\\hat v_t=v_t/(1-\\beta_2^t)$. Here the symbols name the current parameter or variable, the gradient information, and any memory or constraints used by the method. The method is built to handle momentum plus scaling.</p><p>The reason this helps is that the raw gradient is not always the best step by itself. Scaling, pricing, coordinate choices, or curvature can turn the same local information into a safer or more informative move.</p><p><b>Assumptions that matter:</b> check differentiability when gradients or Hessians are used; check convexity before claiming global optimality; keep learning rates, decay constants, and multiplier signs in their required ranges; and remember that numerical solvers certify different things depending on the problem class.</p>",
    "worked": {
      "problem": "Use Adam with $m_0=v_0=0$, $g_1=4$, $\\beta_1=0.9$, $\\beta_2=0.99$, $\\eta=0.1$, and $\\epsilon=0$. Compute the first update.",
      "skills": [
        "moment estimates",
        "bias correction",
        "adaptive updates"
      ],
      "strategy": "The first moving averages are biased toward zero, so correct them before forming the step.",
      "steps": [
        {
          "do": "Compute first moment",
          "result": "$m_1=0.9\\cdot0+0.1\\cdot4=0.4$",
          "why": "momentum average of gradients"
        },
        {
          "do": "Compute second moment",
          "result": "$v_1=0.99\\cdot0+0.01\\cdot16=0.16$",
          "why": "moving average of squared gradients"
        },
        {
          "do": "Bias-correct $m_1$",
          "result": "$\\hat m_1=0.4/(1-0.9)=4$",
          "why": "remove initialization bias"
        },
        {
          "do": "Bias-correct $v_1$",
          "result": "$\\hat v_1=0.16/(1-0.99)=16$",
          "why": "remove second-moment bias"
        },
        {
          "do": "Compute the step",
          "result": "$0.1\\cdot4/\\sqrt{16}=0.1$",
          "why": "divide direction estimate by scale estimate"
        }
      ],
      "verify": "With one gradient, bias correction makes Adam behave like a normalized first step.",
      "answer": "The first update subtracts $0.1$ from the parameter.",
      "connects": "Adam blends direction memory and coordinate-wise scale memory."
    },
    "practice": [
      {
        "problem": "With $g_1=5$ and $\\beta_1=0.8$, compute $m_1$ and $\\hat m_1$.",
        "steps": [
          {
            "do": "Update $m_1$",
            "result": "$0.8\\cdot0+0.2\\cdot5=1$",
            "why": "new gradient weight is $1-\\beta_1$"
          },
          {
            "do": "Compute correction denominator",
            "result": "$1-0.8^1=0.2$",
            "why": "first-step bias factor"
          },
          {
            "do": "Correct the moment",
            "result": "$\\hat m_1=1/0.2=5$",
            "why": "recover the observed gradient"
          },
          {
            "do": "Interpret",
            "result": "$\\hat m_1=g_1$",
            "why": "bias correction removes zero-start shrinkage"
          }
        ],
        "answer": "$m_1=1$ and $\\hat m_1=5$."
      },
      {
        "problem": "With $g_1=3$ and $\\beta_2=0.9$, compute $v_1$ and $\\hat v_1$.",
        "steps": [
          {
            "do": "Square the gradient",
            "result": "$3^2=9$",
            "why": "second moment uses squares"
          },
          {
            "do": "Update $v_1$",
            "result": "$0.9\\cdot0+0.1\\cdot9=0.9$",
            "why": "new square weight is 0.1"
          },
          {
            "do": "Compute correction denominator",
            "result": "$1-0.9=0.1$",
            "why": "first-step bias factor"
          },
          {
            "do": "Correct",
            "result": "$\\hat v_1=0.9/0.1=9$",
            "why": "recover the observed square"
          }
        ],
        "answer": "$v_1=0.9$ and $\\hat v_1=9$."
      },
      {
        "problem": "If $\\hat m=2$, $\\hat v=25$, $\\eta=0.01$, and $\\epsilon=0$, compute the Adam step.",
        "steps": [
          {
            "do": "Take the square root",
            "result": "$\\sqrt{25}=5$",
            "why": "scale estimate"
          },
          {
            "do": "Divide moment by scale",
            "result": "$2/5=0.4$",
            "why": "normalized direction"
          },
          {
            "do": "Multiply by learning rate",
            "result": "$0.01\\cdot0.4=0.004$",
            "why": "actual step magnitude"
          },
          {
            "do": "State update direction",
            "result": "subtract $0.004$",
            "why": "positive moment means move downward"
          }
        ],
        "answer": "Step magnitude $0.004$."
      },
      {
        "problem": "Adam has $m_1=1$, next gradient $g_2=3$, and $\\beta_1=0.8$. Compute $m_2$.",
        "steps": [
          {
            "do": "Weight the old moment",
            "result": "$0.8\\cdot1=0.8$",
            "why": "keep momentum"
          },
          {
            "do": "Weight the new gradient",
            "result": "$0.2\\cdot3=0.6$",
            "why": "add current signal"
          },
          {
            "do": "Add",
            "result": "$m_2=1.4$",
            "why": "combine old and new"
          },
          {
            "do": "Interpret",
            "result": "$1.4$ lies between $1$ and $3$",
            "why": "the average moves toward the new gradient"
          }
        ],
        "answer": "$m_2=1.4$."
      },
      {
        "problem": "For gradient sequence $[2,-2]$ with $\\beta_1=0.5$ and $m_0=0$, compute $m_1$ and $m_2$.",
        "steps": [
          {
            "do": "Compute $m_1$",
            "result": "$0.5\\cdot0+0.5\\cdot2=1$",
            "why": "first gradient enters halfway"
          },
          {
            "do": "Weight old $m_1$",
            "result": "$0.5\\cdot1=0.5$",
            "why": "momentum carries past direction"
          },
          {
            "do": "Weight new gradient",
            "result": "$0.5\\cdot(-2)=-1$",
            "why": "new direction opposes the past"
          },
          {
            "do": "Add",
            "result": "$m_2=-0.5$",
            "why": "the sign flips but is damped"
          }
        ],
        "answer": "$m_1=1$ and $m_2=-0.5$."
      }
    ],
    "applications": [
      {
        "title": "Transformer training",
        "background": "Adam and AdamW became default choices for transformers because sparse, noisy, high-dimensional gradients benefit from both momentum and scaling.",
        "numbers": "If $\\eta=0.0003$, $\\hat m=0.02$, and $\\hat v=0.0004$, the step is $0.0003\\cdot0.02/0.02=0.0003$."
      },
      {
        "title": "Bias correction early in training",
        "background": "Zero initialization makes raw moving averages too small at the start. Adam's correction prevents tiny first steps.",
        "numbers": "With $\\beta_1=0.9$ and $g_1=10$, raw $m_1=1$, but $\\hat m_1=10$."
      },
      {
        "title": "AdamW weight decay",
        "background": "Modern practice often decouples weight decay from Adam's gradient scaling, which is called AdamW.",
        "numbers": "With weight $2$, decay rate $0.01$, and $\\eta=0.1$, decoupled decay subtracts $0.1\\cdot0.01\\cdot2=0.002$."
      },
      {
        "title": "Noisy objectives",
        "background": "Adam smooths sign-changing mini-batch gradients through $m_t$.",
        "numbers": "Gradients $4$ then $-2$ with $\\beta_1=0.9$ give $m_2=0.9(0.4)+0.1(-2)=0.16$, still positive but smaller."
      },
      {
        "title": "Coordinate imbalance",
        "background": "Adam's $v_t$ prevents a coordinate with huge gradients from dominating updates.",
        "numbers": "If two coordinates have $\\hat m=[10,1]$ and $\\hat v=[100,1]$, normalized values are $[1,1]$."
      },
      {
        "title": "Tuning defaults",
        "background": "Common defaults $\\beta_1=0.9$, $\\beta_2=0.999$ mean direction changes faster than scale.",
        "numbers": "A first gradient's weight in $m$ is $0.1$, while its weight in $v$ is $0.001$ before bias correction."
      }
    ],
    "applicationsClose": "Across theory and training practice, the method is one more way to make the optimization landscape legible through numbers you can compute.",
    "takeaways": [
      "Adam is an optimization tool for adaptive optimization.",
      "The arithmetic of each update matters: scale, sign, and feasibility change the result.",
      "Convex settings give stronger certificates than nonconvex settings.",
      "In ML, these methods are useful because training is optimization under noise, scale, and constraints."
    ]
  },
  "math-22-18": {
    "id": "math-22-18",
    "title": "Coordinate descent",
    "tagline": "Coordinate descent improves one parameter or block at a time, turning a hard problem into many small ones.",
    "connections": {
      "buildsOn": [
        "Gradient descent",
        "partial derivatives",
        "convex quadratic functions"
      ],
      "leadsTo": [
        "Newton's method",
        "Quadratic programming",
        "Lasso optimization"
      ],
      "usedWith": [
        "basis vectors",
        "partial derivatives",
        "convexity",
        "linear algebra"
      ]
    },
    "motivation": "<p>You already know that training means changing parameters to reduce a loss. The hard part is that different coordinates, constraints, and curvatures do not all behave the same way.</p><p><b>Coordinate descent</b> gives a particular tool for that difficulty. Its central move is one-coordinate minimization: a way to make optimization less like blind walking and more like reading the local terrain.</p>",
    "definition": "<p>The core formula is choose coordinate $j$ and update $x_j$ while holding the other coordinates fixed. Here the symbols name the current parameter or variable, the gradient information, and any memory or constraints used by the method. The method is built to handle separable structure.</p><p>The reason this helps is that the raw gradient is not always the best step by itself. Scaling, pricing, coordinate choices, or curvature can turn the same local information into a safer or more informative move.</p><p><b>Assumptions that matter:</b> check differentiability when gradients or Hessians are used; check convexity before claiming global optimality; keep learning rates, decay constants, and multiplier signs in their required ranges; and remember that numerical solvers certify different things depending on the problem class.</p>",
    "worked": {
      "problem": "Minimize $f(x,y)=(x-3)^2+(y+1)^2$ by exact coordinate descent starting from $(0,0)$: update $x$ first, then $y$.",
      "skills": [
        "partial minimization",
        "quadratics",
        "coordinate updates"
      ],
      "strategy": "Hold one coordinate fixed; the remaining one-dimensional quadratic is easy.",
      "steps": [
        {
          "do": "Hold $y=0$ fixed",
          "result": "$f(x,0)=(x-3)^2+1$",
          "why": "only $x$ is allowed to move"
        },
        {
          "do": "Minimize over $x$",
          "result": "$x=3$",
          "why": "the square is smallest at zero"
        },
        {
          "do": "Update the point",
          "result": "$(3,0)$",
          "why": "replace only the selected coordinate"
        },
        {
          "do": "Hold $x=3$ fixed",
          "result": "$f(3,y)=(y+1)^2$",
          "why": "now only $y$ moves"
        },
        {
          "do": "Minimize over $y$",
          "result": "$y=-1$",
          "why": "make the square zero"
        },
        {
          "do": "State the new point",
          "result": "$(3,-1)$",
          "why": "both coordinates have been optimized"
        }
      ],
      "verify": "The objective value drops from $10$ at $(0,0)$ to $0$ at $(3,-1)$.",
      "answer": "One sweep reaches $(3,-1)$, the minimizer.",
      "connects": "Coordinate descent turns a multidimensional problem into one-dimensional choices."
    },
    "practice": [
      {
        "problem": "For $f(x,y)=(x-2)^2+y^2$, start at $(0,3)$ and update $x$ exactly.",
        "steps": [
          {
            "do": "Hold $y=3$ fixed",
            "result": "$f(x,3)=(x-2)^2+9$",
            "why": "only $x$ changes"
          },
          {
            "do": "Find the minimizing $x$",
            "result": "$x=2$",
            "why": "make $(x-2)^2$ zero"
          },
          {
            "do": "Keep $y$ unchanged",
            "result": "$y=3$",
            "why": "coordinate update changes one coordinate"
          },
          {
            "do": "Write the new point",
            "result": "$(2,3)$",
            "why": "replace $x$ only"
          }
        ],
        "answer": "The new point is $(2,3)$."
      },
      {
        "problem": "For $f(x,y)=x^2+4y^2$, at $(2,1)$ take a coordinate gradient step in $y$ with step size $0.1$.",
        "steps": [
          {
            "do": "Compute the partial derivative",
            "result": "$\\partial f/\\partial y=8y$",
            "why": "differentiate holding $x$ fixed"
          },
          {
            "do": "Evaluate at $y=1$",
            "result": "$8$",
            "why": "current coordinate gradient"
          },
          {
            "do": "Compute the step",
            "result": "$0.1\\cdot8=0.8$",
            "why": "learning rate times partial"
          },
          {
            "do": "Update $y$",
            "result": "$1-0.8=0.2$",
            "why": "move opposite the partial derivative"
          },
          {
            "do": "Keep $x$ fixed",
            "result": "$(2,0.2)$",
            "why": "only $y$ changed"
          }
        ],
        "answer": "The new point is $(2,0.2)$."
      },
      {
        "problem": "Minimize $f(x,y)=(x+y-4)^2$ over $x$ while $y=1$.",
        "steps": [
          {
            "do": "Substitute $y=1$",
            "result": "$f(x,1)=(x-3)^2$",
            "why": "reduce to one variable"
          },
          {
            "do": "Set the square to zero",
            "result": "$x-3=0$",
            "why": "the minimum of a square is zero"
          },
          {
            "do": "Solve",
            "result": "$x=3$",
            "why": "isolate $x$"
          },
          {
            "do": "State objective value",
            "result": "$0$",
            "why": "the residual is zero"
          }
        ],
        "answer": "The best coordinate value is $x=3$."
      },
      {
        "problem": "For $f(x,y)=x^2+xy+y^2$, hold $y=2$ and minimize over $x$.",
        "steps": [
          {
            "do": "Substitute $y=2$",
            "result": "$f(x,2)=x^2+2x+4$",
            "why": "one-variable quadratic"
          },
          {
            "do": "Differentiate with respect to $x$",
            "result": "$2x+2$",
            "why": "slope of the coordinate slice"
          },
          {
            "do": "Set derivative to zero",
            "result": "$2x+2=0$",
            "why": "minimum of convex quadratic"
          },
          {
            "do": "Solve",
            "result": "$x=-1$",
            "why": "subtract 2 and divide by 2"
          }
        ],
        "answer": "The coordinate minimizer is $x=-1$."
      },
      {
        "problem": "A lasso coordinate has least-squares value $z=0.8$ and threshold $\\lambda=0.3$. Apply soft-thresholding.",
        "steps": [
          {
            "do": "Compare magnitude to threshold",
            "result": "$|0.8|>0.3$",
            "why": "the coordinate survives"
          },
          {
            "do": "Subtract threshold from magnitude",
            "result": "$0.8-0.3=0.5$",
            "why": "lasso shrinks toward zero"
          },
          {
            "do": "Keep the sign",
            "result": "positive",
            "why": "$z$ is positive"
          },
          {
            "do": "Write the update",
            "result": "$0.5$",
            "why": "soft-thresholded value"
          }
        ],
        "answer": "The coordinate update is $0.5$."
      }
    ],
    "applications": [
      {
        "title": "Lasso regression",
        "background": "Coordinate descent is a standard lasso solver because each coefficient has a simple soft-threshold update.",
        "numbers": "If $z=-1.2$ and $\\lambda=0.5$, soft-thresholding gives $-(1.2-0.5)=-0.7$."
      },
      {
        "title": "Matrix factorization",
        "background": "Recommendation models can alternate between user factors and item factors, a block-coordinate idea.",
        "numbers": "Holding item vector $v=[2,1]$ fixed, target rating $5$, and user scalar $u$ in prediction $u(2^2+1^2)$ leads to $u=5/5=1$."
      },
      {
        "title": "Feature-wise optimization",
        "background": "High-dimensional sparse models often update one active feature at a time to avoid touching millions of zeros.",
        "numbers": "If an example has 12 nonzero features out of 1000000, a sparse coordinate update touches 12 weights, not all weights."
      },
      {
        "title": "Gauss-Seidel solvers",
        "background": "Classical linear-system solvers update one variable using the newest values of the others. Coordinate descent has the same flavor.",
        "numbers": "For $2x+y=5$ with $y=1$, the coordinate solve gives $x=2$."
      },
      {
        "title": "Hyperparameter grids",
        "background": "Optimizing one tuning knob at a time is coordinate descent in experimental form, though without convex guarantees.",
        "numbers": "If learning rate choices are $[0.001,0.01,0.1]$ and best is $0.01$, then batch size can be searched next while holding it fixed."
      },
      {
        "title": "Separable regularizers",
        "background": "Coordinate descent shines when nonsmooth penalties separate by coordinate.",
        "numbers": "For $\\lambda(|w_1|+|w_2|)$ with $\\lambda=0.2$ and $w=[3,-4]$, the penalty is $0.2(7)=1.4$."
      }
    ],
    "applicationsClose": "Across theory and training practice, the method is one more way to make the optimization landscape legible through numbers you can compute.",
    "takeaways": [
      "Coordinate descent is an optimization tool for block updates.",
      "The arithmetic of each update matters: scale, sign, and feasibility change the result.",
      "Convex settings give stronger certificates than nonconvex settings.",
      "In ML, these methods are useful because training is optimization under noise, scale, and constraints."
    ]
  },
  "math-22-19": {
    "id": "math-22-19",
    "title": "Newton's method",
    "tagline": "Newton's method uses curvature to jump to the minimizer of a local quadratic model.",
    "connections": {
      "buildsOn": [
        "Taylor approximations",
        "gradients",
        "Hessians"
      ],
      "leadsTo": [
        "Quasi-Newton methods (BFGS, L-BFGS)",
        "Quadratic programming",
        "KKT systems"
      ],
      "usedWith": [
        "linear systems",
        "eigenvalues",
        "convexity",
        "Taylor series"
      ]
    },
    "motivation": "<p>You already know that training means changing parameters to reduce a loss. The hard part is that different coordinates, constraints, and curvatures do not all behave the same way.</p><p><b>Newton's method</b> gives a particular tool for that difficulty. Its central move is second-order Taylor model: a way to make optimization less like blind walking and more like reading the local terrain.</p>",
    "definition": "<p>The core formula is $x_{t+1}=x_t-[\\nabla^2 f(x_t)]^{-1}\\nabla f(x_t)$ for optimization. Here the symbols name the current parameter or variable, the gradient information, and any memory or constraints used by the method. The method is built to handle curvature-corrected steps.</p><p>The reason this helps is that the raw gradient is not always the best step by itself. Scaling, pricing, coordinate choices, or curvature can turn the same local information into a safer or more informative move.</p><p><b>Assumptions that matter:</b> check differentiability when gradients or Hessians are used; check convexity before claiming global optimality; keep learning rates, decay constants, and multiplier signs in their required ranges; and remember that numerical solvers certify different things depending on the problem class.</p>",
    "worked": {
      "problem": "Apply one Newton step to minimize $f(x)=x^2-6x+10$ from $x_0=0$.",
      "skills": [
        "derivatives",
        "second derivatives",
        "Newton updates"
      ],
      "strategy": "A quadratic's curvature is exact, so Newton should jump to the minimizer.",
      "steps": [
        {
          "do": "Compute the gradient",
          "result": "$f'(x)=2x-6$",
          "why": "differentiate the objective"
        },
        {
          "do": "Compute the Hessian in one dimension",
          "result": "$f''(x)=2$",
          "why": "differentiate again"
        },
        {
          "do": "Evaluate at $x_0=0$",
          "result": "$f'(0)=-6$",
          "why": "current slope"
        },
        {
          "do": "Write the Newton step",
          "result": "$x_1=x_0-f'(x_0)/f''(x_0)$",
          "why": "one-dimensional Newton formula"
        },
        {
          "do": "Substitute",
          "result": "$x_1=0-(-6)/2=3$",
          "why": "curvature rescales the slope"
        }
      ],
      "verify": "The parabola has vertex at $x=3$, so one exact Newton step is expected.",
      "answer": "$x_1=3$.",
      "connects": "Newton's method minimizes the local quadratic model."
    },
    "practice": [
      {
        "problem": "Take one Newton step for $f(x)=x^2+4x+1$ from $x_0=0$.",
        "steps": [
          {
            "do": "Differentiate",
            "result": "$f'(x)=2x+4$",
            "why": "slope"
          },
          {
            "do": "Differentiate again",
            "result": "$f''(x)=2$",
            "why": "curvature"
          },
          {
            "do": "Evaluate slope",
            "result": "$f'(0)=4$",
            "why": "at starting point"
          },
          {
            "do": "Apply Newton",
            "result": "$x_1=0-4/2=-2$",
            "why": "subtract slope divided by curvature"
          }
        ],
        "answer": "$x_1=-2$."
      },
      {
        "problem": "Use Newton's root method for $r(x)=x^2-2$ from $x_0=1$.",
        "steps": [
          {
            "do": "Compute derivative",
            "result": "$r'(x)=2x$",
            "why": "needed for root Newton"
          },
          {
            "do": "Evaluate function",
            "result": "$r(1)=-1$",
            "why": "current residual"
          },
          {
            "do": "Evaluate derivative",
            "result": "$r'(1)=2$",
            "why": "current slope"
          },
          {
            "do": "Apply update",
            "result": "$x_1=1-(-1)/2=1.5$",
            "why": "move toward the root"
          }
        ],
        "answer": "$x_1=1.5$."
      },
      {
        "problem": "For $f(x)=x^4$, compute the Newton step from $x_0=1$.",
        "steps": [
          {
            "do": "Compute gradient",
            "result": "$f'(x)=4x^3$",
            "why": "first derivative"
          },
          {
            "do": "Compute curvature",
            "result": "$f''(x)=12x^2$",
            "why": "second derivative"
          },
          {
            "do": "Evaluate at 1",
            "result": "$f'(1)=4$, $f''(1)=12$",
            "why": "current slope and curvature"
          },
          {
            "do": "Update",
            "result": "$x_1=1-4/12=2/3$",
            "why": "divide by curvature"
          }
        ],
        "answer": "$x_1=2/3$."
      },
      {
        "problem": "For two-dimensional quadratic $f(x)=\\tfrac12 x^T\\begin{bmatrix}4&0\\\\0&2\\end{bmatrix}x-[4,2]^Tx$, solve the Newton step from $x_0=0$.",
        "steps": [
          {
            "do": "Write gradient at zero",
            "result": "$\\nabla f(0)=[-4,-2]^T$",
            "why": "linear term remains"
          },
          {
            "do": "Write Hessian",
            "result": "$H=\\begin{bmatrix}4&0\\\\0&2\\end{bmatrix}$",
            "why": "quadratic curvature"
          },
          {
            "do": "Solve $Hs=-\\nabla f$",
            "result": "$Hs=[4,2]^T$",
            "why": "Newton step solves a linear system"
          },
          {
            "do": "Divide by diagonal entries",
            "result": "$s=[1,1]^T$",
            "why": "diagonal solve"
          },
          {
            "do": "Update",
            "result": "$x_1=[1,1]^T$",
            "why": "add the step to zero"
          }
        ],
        "answer": "The Newton point is $[1,1]^T$."
      },
      {
        "problem": "A Newton step has gradient $[6,2]$ and Hessian diagonal $[3,4]$. Compute the parameter change.",
        "steps": [
          {
            "do": "Invert the diagonal Hessian",
            "result": "$H^{-1}$ scales by $[1/3,1/4]$",
            "why": "diagonal inverse"
          },
          {
            "do": "Multiply by gradient",
            "result": "$H^{-1}g=[2,0.5]$",
            "why": "curvature-scaled gradient"
          },
          {
            "do": "Apply descent sign",
            "result": "$s=-[2,0.5]$",
            "why": "Newton minimizes by subtracting"
          },
          {
            "do": "State update",
            "result": "$x^+=x+[-2,-0.5]$",
            "why": "add the step"
          }
        ],
        "answer": "The parameter change is $[-2,-0.5]$."
      }
    ],
    "applications": [
      {
        "title": "Logistic-regression solvers",
        "background": "Classical convex ML uses Newton or damped Newton because curvature gives fast convergence near the optimum.",
        "numbers": "If gradient norm drops from $0.1$ to $0.001$ after a Newton step, that is a 100-fold reduction."
      },
      {
        "title": "Second-order calibration",
        "background": "A one-dimensional calibration parameter can be tuned by Newton using slope and curvature.",
        "numbers": "With loss derivative $-0.6$ and second derivative $3$, the Newton change is $-(-0.6)/3=0.2$."
      },
      {
        "title": "Least squares",
        "background": "For quadratic least squares, Newton solves the normal equations in one step when feasible.",
        "numbers": "If Hessian $X^TX=25$ and gradient is $-10$, the step is $10/25=0.4$."
      },
      {
        "title": "Why damping is needed",
        "background": "If curvature is small or negative, a raw Newton step can be huge or uphill. Line search tempers it.",
        "numbers": "Gradient $1$ with curvature $0.01$ gives raw step $-100$; damping by $0.1$ gives $-10$."
      },
      {
        "title": "Trust-region methods",
        "background": "Second-order methods often restrict step length when the quadratic model is reliable only locally.",
        "numbers": "If Newton step norm is $5$ but trust radius is $1$, the accepted step is scaled to length $1$."
      },
      {
        "title": "Deep nets and Hessian-vector products",
        "background": "Full Hessians are too large, but products $Hv$ can be estimated for curvature-aware methods.",
        "numbers": "A model with $10^8$ parameters has a Hessian with $10^{16}$ entries, impossible to store directly at 8 bytes each."
      }
    ],
    "applicationsClose": "Across theory and training practice, the method is one more way to make the optimization landscape legible through numbers you can compute.",
    "takeaways": [
      "Newton's method is an optimization tool for root finding.",
      "The arithmetic of each update matters: scale, sign, and feasibility change the result.",
      "Convex settings give stronger certificates than nonconvex settings.",
      "In ML, these methods are useful because training is optimization under noise, scale, and constraints."
    ]
  },
  "math-22-20": {
    "id": "math-22-20",
    "title": "Quasi-Newton methods (BFGS, L-BFGS)",
    "tagline": "Quasi-Newton methods learn curvature from gradients instead of forming the full Hessian.",
    "connections": {
      "buildsOn": [
        "Newton's method",
        "linear algebra",
        "positive definite matrices"
      ],
      "leadsTo": [
        "Constrained optimization",
        "large-scale smooth optimization",
        "L-BFGS training"
      ],
      "usedWith": [
        "matrix updates",
        "inner products",
        "line search",
        "convexity"
      ]
    },
    "motivation": "<p>You already know that training means changing parameters to reduce a loss. The hard part is that different coordinates, constraints, and curvatures do not all behave the same way.</p><p><b>Quasi-Newton methods (BFGS, L-BFGS)</b> gives a particular tool for that difficulty. Its central move is secant equation: a way to make optimization less like blind walking and more like reading the local terrain.</p>",
    "definition": "<p>The core formula is $B_{k+1}=B_k+\\dfrac{y_ky_k^T}{y_k^Ts_k}-\\dfrac{B_ks_ks_k^TB_k}{s_k^TB_ks_k}$ with $s_k=x_{k+1}-x_k$ and $y_k=\\nabla f_{k+1}-\\nabla f_k$. Here the symbols name the current parameter or variable, the gradient information, and any memory or constraints used by the method. The method is built to handle curvature approximation.</p><p>The reason this helps is that the raw gradient is not always the best step by itself. Scaling, pricing, coordinate choices, or curvature can turn the same local information into a safer or more informative move.</p><p><b>Assumptions that matter:</b> check differentiability when gradients or Hessians are used; check convexity before claiming global optimality; keep learning rates, decay constants, and multiplier signs in their required ranges; and remember that numerical solvers certify different things depending on the problem class.</p>",
    "worked": {
      "problem": "In one dimension, $x_0=0$, $x_1=2$, $f'(x_0)=-4$, and $f'(x_1)=0$. Compute the secant curvature estimate used by quasi-Newton methods.",
      "skills": [
        "secant equation",
        "curvature estimates",
        "gradient differences"
      ],
      "strategy": "Use the change in gradient divided by the change in position.",
      "steps": [
        {
          "do": "Compute the position change",
          "result": "$s=x_1-x_0=2$",
          "why": "quasi-Newton methods learn from steps"
        },
        {
          "do": "Compute the gradient change",
          "result": "$y=f'(x_1)-f'(x_0)=0-(-4)=4$",
          "why": "curvature changes gradients"
        },
        {
          "do": "Apply the secant equation",
          "result": "$B s=y$",
          "why": "in one dimension $B$ is a scalar"
        },
        {
          "do": "Solve for $B$",
          "result": "$B=y/s=4/2=2$",
          "why": "divide gradient change by position change"
        },
        {
          "do": "Interpret",
          "result": "$B=2$",
          "why": "estimated second derivative"
        }
      ],
      "verify": "A quadratic with curvature 2 would change gradient by 4 over a step of length 2.",
      "answer": "The quasi-Newton curvature estimate is $2$.",
      "connects": "BFGS generalizes this secant idea to many dimensions while preserving positive curvature when conditions hold."
    },
    "practice": [
      {
        "problem": "Given $s=[1,0]$ and $y=[3,0]$, check $y^Ts>0$.",
        "steps": [
          {
            "do": "Compute the inner product",
            "result": "$y^Ts=3\\cdot1+0\\cdot0$",
            "why": "multiply corresponding entries"
          },
          {
            "do": "Simplify",
            "result": "$y^Ts=3$",
            "why": "sum terms"
          },
          {
            "do": "Compare to zero",
            "result": "$3>0$",
            "why": "positive curvature condition holds"
          },
          {
            "do": "Interpret",
            "result": "BFGS update is safe in this direction",
            "why": "positive curvature preserves positive definiteness"
          }
        ],
        "answer": "$y^Ts=3>0$."
      },
      {
        "problem": "For one-dimensional inverse Hessian estimate $H=1$, $s=2$, $y=4$, find the secant inverse estimate $H^+$ satisfying $H^+y=s$.",
        "steps": [
          {
            "do": "Write inverse secant equation",
            "result": "$H^+y=s$",
            "why": "inverse approximates Hessian inverse"
          },
          {
            "do": "Substitute",
            "result": "$H^+\\cdot4=2$",
            "why": "one-dimensional scalar equation"
          },
          {
            "do": "Solve",
            "result": "$H^+=1/2$",
            "why": "divide by 4"
          },
          {
            "do": "Interpret",
            "result": "curvature estimate is $2$",
            "why": "inverse curvature is one half"
          }
        ],
        "answer": "$H^+=0.5$."
      },
      {
        "problem": "L-BFGS stores $m=10$ correction pairs for dimension $d=1000000$. How many numbers are stored for pairs?",
        "steps": [
          {
            "do": "Count vectors per pair",
            "result": "$2$",
            "why": "each pair has $s_k$ and $y_k$"
          },
          {
            "do": "Count numbers per pair",
            "result": "$2d=2000000$",
            "why": "two vectors of length $d$"
          },
          {
            "do": "Multiply by pairs",
            "result": "$10\\cdot2000000=20000000$",
            "why": "limited memory count"
          },
          {
            "do": "Convert to bytes at 8 bytes each",
            "result": "$160000000$ bytes",
            "why": "double precision storage"
          }
        ],
        "answer": "It stores $20000000$ numbers, about $160$ MB."
      },
      {
        "problem": "A line search gives direction $p=[-2,1]$ and step length $\\alpha=0.25$. From $x=[3,4]$, compute $x^+$.",
        "steps": [
          {
            "do": "Scale direction",
            "result": "$0.25[-2,1]=[-0.5,0.25]$",
            "why": "line search chooses distance"
          },
          {
            "do": "Add to current point",
            "result": "$[3,4]+[-0.5,0.25]$",
            "why": "take the step"
          },
          {
            "do": "Compute coordinates",
            "result": "$[2.5,4.25]$",
            "why": "add coordinate-wise"
          },
          {
            "do": "Interpret",
            "result": "the direction is accepted at quarter length",
            "why": "line search damps the move"
          }
        ],
        "answer": "$x^+=[2.5,4.25]$."
      },
      {
        "problem": "If a quasi-Newton inverse estimate maps gradient $g=[4,2]$ to $Hg=[1,1]$, what descent direction is used?",
        "steps": [
          {
            "do": "Apply the quasi-Newton rule",
            "result": "$p=-Hg$",
            "why": "move opposite curvature-scaled gradient"
          },
          {
            "do": "Substitute",
            "result": "$p=-[1,1]$",
            "why": "use the given product"
          },
          {
            "do": "Write coordinates",
            "result": "$[-1,-1]$",
            "why": "negate both entries"
          },
          {
            "do": "Check descent with $g$",
            "result": "$g^Tp=4(-1)+2(-1)=-6<0$",
            "why": "negative inner product means descent"
          }
        ],
        "answer": "The direction is $[-1,-1]$."
      }
    ],
    "applications": [
      {
        "title": "L-BFGS for large smooth models",
        "background": "L-BFGS was a workhorse for maximum-entropy and logistic models before deep learning standardized Adam-like optimizers.",
        "numbers": "With $d=100000$ and $m=20$, pair storage is $2md=4000000$ numbers, about $32$ MB."
      },
      {
        "title": "Curvature without Hessians",
        "background": "BFGS avoids forming $d\\times d$ Hessians by learning from gradient differences.",
        "numbers": "For $d=10000$, a dense Hessian has $100000000$ entries; at 8 bytes, about $800$ MB."
      },
      {
        "title": "Line-search stability",
        "background": "Quasi-Newton methods are often paired with line search to ensure the learned direction actually lowers the objective.",
        "numbers": "If $f(x)=10$ and a full step gives $12$ but half step gives $7$, line search accepts the half step."
      },
      {
        "title": "Scientific computing",
        "background": "Smooth parameter estimation in physics and statistics often uses BFGS when gradients are available but Hessians are expensive.",
        "numbers": "A 50-parameter model has a full Hessian with $2500$ entries, but BFGS updates it from two 50-vectors."
      },
      {
        "title": "Fine-tuning small neural nets",
        "background": "For smaller networks or final-layer training, L-BFGS can converge in fewer iterations than first-order methods.",
        "numbers": "If Adam needs 5000 mini-batch steps and L-BFGS needs 80 full-batch steps, the tradeoff depends on batch cost."
      },
      {
        "title": "Curvature condition diagnostics",
        "background": "The quantity $y^Ts$ checks whether gradients changed consistently with positive curvature.",
        "numbers": "If $y^Ts=0.02$ and $s^Ts=1$, estimated curvature along $s$ is $0.02$, very flat."
      }
    ],
    "applicationsClose": "Across theory and training practice, the method is one more way to make the optimization landscape legible through numbers you can compute.",
    "takeaways": [
      "Quasi-Newton methods (BFGS, L-BFGS) is an optimization tool for limited memory.",
      "The arithmetic of each update matters: scale, sign, and feasibility change the result.",
      "Convex settings give stronger certificates than nonconvex settings.",
      "In ML, these methods are useful because training is optimization under noise, scale, and constraints."
    ]
  },
  "math-22-21": {
    "id": "math-22-21",
    "title": "Lagrangian duality",
    "tagline": "Lagrangian duality turns constraints into prices and asks what lower bound those prices prove.",
    "connections": {
      "buildsOn": [
        "Constrained optimization",
        "convexity",
        "linear combinations"
      ],
      "leadsTo": [
        "The KKT conditions",
        "The dual problem",
        "support vector machines"
      ],
      "usedWith": [
        "inequalities",
        "convex functions",
        "linear algebra",
        "optimization bounds"
      ]
    },
    "motivation": "<p>You already know that training means changing parameters to reduce a loss. The hard part is that different coordinates, constraints, and curvatures do not all behave the same way.</p><p><b>Lagrangian duality</b> gives a particular tool for that difficulty. Its central move is constraint prices: a way to make optimization less like blind walking and more like reading the local terrain.</p>",
    "definition": "<p>The core formula is $L(x,\\lambda,\\nu)=f(x)+\\sum_i\\lambda_i g_i(x)+\\sum_j\\nu_j h_j(x)$ with $\\lambda_i\\ge0$. Here the symbols name the current parameter or variable, the gradient information, and any memory or constraints used by the method. The method is built to handle lower bounds.</p><p>The reason this helps is that the raw gradient is not always the best step by itself. Scaling, pricing, coordinate choices, or curvature can turn the same local information into a safer or more informative move.</p><p><b>Assumptions that matter:</b> check differentiability when gradients or Hessians are used; check convexity before claiming global optimality; keep learning rates, decay constants, and multiplier signs in their required ranges; and remember that numerical solvers certify different things depending on the problem class.</p>",
    "worked": {
      "problem": "Minimize $f(x)=x^2$ subject to $x\\ge2$. Write it as $g(x)=2-x\\le0$, form the Lagrangian, and find the dual lower bound $q(\\lambda)$ for $\\lambda\\ge0$.",
      "skills": [
        "constraints",
        "Lagrangians",
        "dual bounds"
      ],
      "strategy": "A multiplier prices constraint violation; minimizing over $x$ turns that price into a bound.",
      "steps": [
        {
          "do": "Write the Lagrangian",
          "result": "$L(x,\\lambda)=x^2+\\lambda(2-x)$",
          "why": "use $g(x)=2-x\\le0$"
        },
        {
          "do": "Differentiate with respect to $x$",
          "result": "$2x-\\lambda$",
          "why": "minimize $L$ over $x$"
        },
        {
          "do": "Set derivative to zero",
          "result": "$2x-\\lambda=0$",
          "why": "stationary point of the quadratic"
        },
        {
          "do": "Solve for $x$",
          "result": "$x=\\lambda/2$",
          "why": "best $x$ for a fixed price"
        },
        {
          "do": "Substitute into $L$",
          "result": "$q(\\lambda)=\\lambda^2/4+2\\lambda-\\lambda^2/2$",
          "why": "evaluate the minimized Lagrangian"
        },
        {
          "do": "Simplify",
          "result": "$q(\\lambda)=2\\lambda-\\lambda^2/4$",
          "why": "combine quadratic terms"
        }
      ],
      "verify": "At $\\lambda=4$, the bound is $8-4=4$, matching the primal optimum $x=2$ with value $4$.",
      "answer": "$q(\\lambda)=2\\lambda-\\lambda^2/4$ for $\\lambda\\ge0$.",
      "connects": "Duality turns a constrained problem into a family of certified lower bounds."
    },
    "practice": [
      {
        "problem": "For constraint $x\\le3$, write it in standard form $g(x)\\le0$.",
        "steps": [
          {
            "do": "Move all terms left",
            "result": "$x-3\\le0$",
            "why": "standard inequality form"
          },
          {
            "do": "Name the function",
            "result": "$g(x)=x-3$",
            "why": "constraint function"
          },
          {
            "do": "Check feasibility at $x=2$",
            "result": "$g(2)=-1\\le0$",
            "why": "2 satisfies the constraint"
          },
          {
            "do": "Check infeasibility at $x=5$",
            "result": "$g(5)=2>0$",
            "why": "5 violates it"
          }
        ],
        "answer": "Use $g(x)=x-3\\le0$."
      },
      {
        "problem": "Form the Lagrangian for minimizing $x^2+y^2$ subject to $x+y=1$.",
        "steps": [
          {
            "do": "Name the equality constraint",
            "result": "$h(x,y)=x+y-1$",
            "why": "equalities use unrestricted multipliers"
          },
          {
            "do": "Introduce multiplier",
            "result": "$\\nu$",
            "why": "equality price can have any sign"
          },
          {
            "do": "Add constraint term",
            "result": "$L=x^2+y^2+\\nu(x+y-1)$",
            "why": "objective plus multiplier times constraint"
          },
          {
            "do": "State multiplier domain",
            "result": "$\\nu\\in\\mathbb R$",
            "why": "no nonnegativity restriction"
          }
        ],
        "answer": "$L(x,y,\\nu)=x^2+y^2+\\nu(x+y-1)$."
      },
      {
        "problem": "For feasible $x$ with $g(x)\\le0$ and $\\lambda\\ge0$, show $L(x,\\lambda)\\le f(x)$ when $L=f+\\lambda g$.",
        "steps": [
          {
            "do": "Start from feasibility",
            "result": "$g(x)\\le0$",
            "why": "constraint is satisfied"
          },
          {
            "do": "Multiply by nonnegative multiplier",
            "result": "$\\lambda g(x)\\le0$",
            "why": "inequality direction stays the same"
          },
          {
            "do": "Add $f(x)$",
            "result": "$f(x)+\\lambda g(x)\\le f(x)$",
            "why": "add the objective to both sides"
          },
          {
            "do": "Recognize Lagrangian",
            "result": "$L(x,\\lambda)\\le f(x)$",
            "why": "definition of $L$"
          }
        ],
        "answer": "For feasible points, the Lagrangian is no larger than the objective."
      },
      {
        "problem": "Evaluate $L(x,\\lambda)=x^2+\\lambda(1-x)$ at $x=3$, $\\lambda=2$.",
        "steps": [
          {
            "do": "Compute the objective term",
            "result": "$3^2=9$",
            "why": "square $x$"
          },
          {
            "do": "Compute the constraint term",
            "result": "$1-3=-2$",
            "why": "constraint value"
          },
          {
            "do": "Multiply by multiplier",
            "result": "$2(-2)=-4$",
            "why": "priced constraint term"
          },
          {
            "do": "Add terms",
            "result": "$9-4=5$",
            "why": "Lagrangian value"
          }
        ],
        "answer": "$L(3,2)=5$."
      },
      {
        "problem": "For $q(\\lambda)=2\\lambda-\\lambda^2/4$, maximize over $\\lambda\\ge0$.",
        "steps": [
          {
            "do": "Differentiate",
            "result": "$q'(\\lambda)=2-\\lambda/2$",
            "why": "slope of the dual function"
          },
          {
            "do": "Set to zero",
            "result": "$2-\\lambda/2=0$",
            "why": "interior maximum candidate"
          },
          {
            "do": "Solve",
            "result": "$\\lambda=4$",
            "why": "multiply by 2"
          },
          {
            "do": "Evaluate",
            "result": "$q(4)=8-4=4$",
            "why": "dual bound at best price"
          },
          {
            "do": "Check domain",
            "result": "$4\\ge0$",
            "why": "dual feasibility holds"
          }
        ],
        "answer": "The maximum dual bound is $4$ at $\\lambda=4$."
      }
    ],
    "applications": [
      {
        "title": "Support vector machines",
        "background": "SVMs use Lagrange multipliers to price margin constraints, leading to a dual problem in example weights.",
        "numbers": "If two support vectors have multipliers $0.3$ and $0.7$, their total active weight is $1.0$."
      },
      {
        "title": "Resource pricing",
        "background": "Dual variables act like shadow prices in allocation problems.",
        "numbers": "If one GPU-hour constraint has multiplier $5$, relaxing the budget by $2$ hours can improve the objective bound by about $10$."
      },
      {
        "title": "Regularized ML constraints",
        "background": "A norm constraint can be priced instead of handled directly.",
        "numbers": "Constraint $||w||_2^2\\le9$ becomes $g(w)=||w||_2^2-9\\le0$ and contributes $\\lambda(||w||_2^2-9)$."
      },
      {
        "title": "Lower-bound certificates",
        "background": "Duality gives certificates that an algorithm cannot beat a certain value.",
        "numbers": "If a feasible model has loss $1.25$ and a dual lower bound is $1.20$, the optimality gap is at most $0.05$."
      },
      {
        "title": "Constrained inference",
        "background": "Probabilistic inference relaxations use multipliers to enforce consistency constraints.",
        "numbers": "If a marginal sum should equal $1$ but is $0.97$, an equality residual is $-0.03$ and gets priced by $\\nu$."
      },
      {
        "title": "Fairness constraints",
        "background": "Training with fairness constraints can attach multipliers to rate differences.",
        "numbers": "If false-positive-rate gap constraint is $g=0.04-0.02=0.02$ and $\\lambda=10$, the Lagrangian penalty is $0.2$."
      }
    ],
    "applicationsClose": "Across theory and training practice, the method is one more way to make the optimization landscape legible through numbers you can compute.",
    "takeaways": [
      "Lagrangian duality is an optimization tool for dual function.",
      "The arithmetic of each update matters: scale, sign, and feasibility change the result.",
      "Convex settings give stronger certificates than nonconvex settings.",
      "In ML, these methods are useful because training is optimization under noise, scale, and constraints."
    ]
  },
  "math-22-22": {
    "id": "math-22-22",
    "title": "The KKT conditions",
    "tagline": "KKT conditions say that at a constrained optimum, gradient balance and active constraints must agree.",
    "connections": {
      "buildsOn": [
        "Lagrangian duality",
        "gradients",
        "constrained optimization"
      ],
      "leadsTo": [
        "The dual problem",
        "Quadratic programming",
        "support vector machines"
      ],
      "usedWith": [
        "linear algebra",
        "convexity",
        "systems of equations",
        "inequalities"
      ]
    },
    "motivation": "<p>You already know that training means changing parameters to reduce a loss. The hard part is that different coordinates, constraints, and curvatures do not all behave the same way.</p><p><b>The KKT conditions</b> gives a particular tool for that difficulty. Its central move is active constraints: a way to make optimization less like blind walking and more like reading the local terrain.</p>",
    "definition": "<p>The core formula is stationarity, primal feasibility, dual feasibility, and complementary slackness $\\lambda_i g_i(x)=0$. Here the symbols name the current parameter or variable, the gradient information, and any memory or constraints used by the method. The method is built to handle optimality certificate.</p><p>The reason this helps is that the raw gradient is not always the best step by itself. Scaling, pricing, coordinate choices, or curvature can turn the same local information into a safer or more informative move.</p><p><b>Assumptions that matter:</b> check differentiability when gradients or Hessians are used; check convexity before claiming global optimality; keep learning rates, decay constants, and multiplier signs in their required ranges; and remember that numerical solvers certify different things depending on the problem class.</p>",
    "worked": {
      "problem": "Minimize $x^2$ subject to $x\\ge2$ using KKT with $g(x)=2-x\\le0$.",
      "skills": [
        "KKT conditions",
        "active constraints",
        "multipliers"
      ],
      "strategy": "At the constrained optimum, stationarity balances objective slope with the active constraint's slope.",
      "steps": [
        {
          "do": "Form the Lagrangian",
          "result": "$L=x^2+\\lambda(2-x)$",
          "why": "inequality multiplier $\\lambda\\ge0$"
        },
        {
          "do": "Write stationarity",
          "result": "$2x-\\lambda=0$",
          "why": "derivative of $L$ with respect to $x$"
        },
        {
          "do": "Write primal feasibility",
          "result": "$2-x\\le0$",
          "why": "the point must satisfy the constraint"
        },
        {
          "do": "Write complementary slackness",
          "result": "$\\lambda(2-x)=0$",
          "why": "inactive constraints have zero price"
        },
        {
          "do": "Use the active boundary",
          "result": "$x=2$",
          "why": "the unconstrained minimizer $0$ is infeasible"
        },
        {
          "do": "Solve stationarity",
          "result": "$\\lambda=2x=4$",
          "why": "dual feasibility holds"
        }
      ],
      "verify": "The multiplier is nonnegative and the constraint is tight, so all KKT conditions agree.",
      "answer": "The optimum is $x=2$ with $\\lambda=4$ and value $4$.",
      "connects": "KKT conditions are an optimality certificate when convex assumptions hold."
    },
    "practice": [
      {
        "problem": "List the four KKT condition types for inequalities $g_i(x)\\le0$.",
        "steps": [
          {
            "do": "Name stationarity",
            "result": "$\\nabla_x L=0$",
            "why": "the Lagrangian has zero gradient in primal variables"
          },
          {
            "do": "Name primal feasibility",
            "result": "$g_i(x)\\le0$",
            "why": "constraints must be satisfied"
          },
          {
            "do": "Name dual feasibility",
            "result": "$\\lambda_i\\ge0$",
            "why": "inequality prices are nonnegative"
          },
          {
            "do": "Name complementary slackness",
            "result": "$\\lambda_i g_i(x)=0$",
            "why": "a constraint is either active or unpriced"
          }
        ],
        "answer": "Stationarity, primal feasibility, dual feasibility, and complementary slackness."
      },
      {
        "problem": "For $g(x)=x-5\\le0$ at $x=3$, what must complementary slackness imply about $\\lambda$?",
        "steps": [
          {
            "do": "Evaluate the constraint",
            "result": "$g(3)=-2$",
            "why": "the constraint is inactive"
          },
          {
            "do": "Write complementary slackness",
            "result": "$\\lambda g(3)=0$",
            "why": "KKT condition"
          },
          {
            "do": "Substitute",
            "result": "$-2\\lambda=0$",
            "why": "use the constraint value"
          },
          {
            "do": "Solve",
            "result": "$\\lambda=0$",
            "why": "inactive constraints have zero multiplier"
          }
        ],
        "answer": "$\\lambda=0$."
      },
      {
        "problem": "Minimize $x^2$ subject to $x\\le1$. Use KKT to find the solution.",
        "steps": [
          {
            "do": "Check unconstrained minimizer",
            "result": "$x=0$",
            "why": "minimizes $x^2$ without constraints"
          },
          {
            "do": "Test feasibility",
            "result": "$0\\le1$",
            "why": "the unconstrained point is feasible"
          },
          {
            "do": "Set inactive multiplier",
            "result": "$\\lambda=0$",
            "why": "constraint is not binding"
          },
          {
            "do": "Verify stationarity",
            "result": "$2x+\\lambda=0$ at $x=0$",
            "why": "with $g=x-1$, stationarity holds"
          }
        ],
        "answer": "The solution is $x=0$ with $\\lambda=0$."
      },
      {
        "problem": "For equality constraint $x+y=3$, write stationarity for minimizing $x^2+y^2$.",
        "steps": [
          {
            "do": "Form $L$",
            "result": "$L=x^2+y^2+\\nu(x+y-3)$",
            "why": "equality multiplier unrestricted"
          },
          {
            "do": "Differentiate with respect to $x$",
            "result": "$2x+\\nu=0$",
            "why": "first stationarity equation"
          },
          {
            "do": "Differentiate with respect to $y$",
            "result": "$2y+\\nu=0$",
            "why": "second stationarity equation"
          },
          {
            "do": "Keep feasibility",
            "result": "$x+y=3$",
            "why": "equality must hold"
          }
        ],
        "answer": "Stationarity is $2x+\\nu=0$, $2y+\\nu=0$, with $x+y=3$."
      },
      {
        "problem": "Solve the equality KKT system from the previous problem.",
        "steps": [
          {
            "do": "Subtract stationarity equations",
            "result": "$2x-2y=0$",
            "why": "eliminate $\\nu$"
          },
          {
            "do": "Conclude equality of variables",
            "result": "$x=y$",
            "why": "divide by 2"
          },
          {
            "do": "Use feasibility",
            "result": "$x+x=3$",
            "why": "substitute $y=x$"
          },
          {
            "do": "Solve",
            "result": "$x=y=1.5$",
            "why": "divide by 2"
          },
          {
            "do": "Find multiplier",
            "result": "$2(1.5)+\\nu=0$, so $\\nu=-3$",
            "why": "use stationarity"
          }
        ],
        "answer": "$x=y=1.5$ and $\\nu=-3$."
      }
    ],
    "applications": [
      {
        "title": "SVM margins",
        "background": "The SVM solution satisfies KKT: support vectors have active margin constraints and positive multipliers.",
        "numbers": "If $y_i(w^Tx_i+b)=1$, the margin constraint is active; if its multiplier is $0.4$, it contributes to $w$."
      },
      {
        "title": "Constrained model training",
        "background": "KKT helps diagnose whether a fairness or resource constraint is actually controlling the solution.",
        "numbers": "If fairness gap is below its limit by $0.03$, complementary slackness predicts multiplier $0$."
      },
      {
        "title": "Portfolio optimization",
        "background": "Mean-variance portfolios use equality and inequality KKT systems for budget and no-short constraints.",
        "numbers": "A weight $w_j=0$ can have positive no-short multiplier; a weight $w_j=0.2$ must have no-short multiplier $0$."
      },
      {
        "title": "Projection onto a box",
        "background": "Clipping a parameter to bounds is a simple KKT story: active bounds push back.",
        "numbers": "Projecting $3$ onto $[0,2]$ gives $2$; the upper bound is active."
      },
      {
        "title": "Neural network constrained layers",
        "background": "Some layers constrain weights to be nonnegative or sum to one. KKT describes the optimum of the constrained subproblem.",
        "numbers": "For probabilities $p_1+p_2=1$ and $p=[0.7,0.3]$, equality feasibility is exact."
      },
      {
        "title": "Optimality gaps",
        "background": "When KKT residuals are small, solvers report near-optimality.",
        "numbers": "A stationarity residual norm $0.0008$ and feasibility violation $0.0003$ indicate a much better certificate than residuals $0.1$ and $0.05$."
      }
    ],
    "applicationsClose": "Across theory and training practice, the method is one more way to make the optimization landscape legible through numbers you can compute.",
    "takeaways": [
      "The KKT conditions is an optimization tool for complementary slackness.",
      "The arithmetic of each update matters: scale, sign, and feasibility change the result.",
      "Convex settings give stronger certificates than nonconvex settings.",
      "In ML, these methods are useful because training is optimization under noise, scale, and constraints."
    ]
  },
  "math-22-23": {
    "id": "math-22-23",
    "title": "The dual problem",
    "tagline": "The dual problem searches over constraint prices for the strongest guaranteed lower bound.",
    "connections": {
      "buildsOn": [
        "Lagrangian duality",
        "The KKT conditions",
        "infimum"
      ],
      "leadsTo": [
        "Linear programming",
        "Quadratic programming",
        "SVM duals"
      ],
      "usedWith": [
        "convexity",
        "lower bounds",
        "linear algebra",
        "saddle points"
      ]
    },
    "motivation": "<p>You already know that training means changing parameters to reduce a loss. The hard part is that different coordinates, constraints, and curvatures do not all behave the same way.</p><p><b>The dual problem</b> gives a particular tool for that difficulty. Its central move is dual function: a way to make optimization less like blind walking and more like reading the local terrain.</p>",
    "definition": "<p>The core formula is maximize $q(\\lambda,\\nu)=\\inf_x L(x,\\lambda,\\nu)$ subject to $\\lambda\\ge0$. Here the symbols name the current parameter or variable, the gradient information, and any memory or constraints used by the method. The method is built to handle weak and strong duality.</p><p>The reason this helps is that the raw gradient is not always the best step by itself. Scaling, pricing, coordinate choices, or curvature can turn the same local information into a safer or more informative move.</p><p><b>Assumptions that matter:</b> check differentiability when gradients or Hessians are used; check convexity before claiming global optimality; keep learning rates, decay constants, and multiplier signs in their required ranges; and remember that numerical solvers certify different things depending on the problem class.</p>",
    "worked": {
      "problem": "For the primal minimize $x^2$ subject to $x\\ge2$, use $q(\\lambda)=2\\lambda-\\lambda^2/4$ to solve the dual problem.",
      "skills": [
        "dual maximization",
        "weak duality",
        "optimality gap"
      ],
      "strategy": "The dual asks for the best lower bound over feasible multipliers.",
      "steps": [
        {
          "do": "State the dual domain",
          "result": "$\\lambda\\ge0$",
          "why": "inequality multiplier must be nonnegative"
        },
        {
          "do": "Differentiate the dual function",
          "result": "$q'(\\lambda)=2-\\lambda/2$",
          "why": "maximize a concave quadratic"
        },
        {
          "do": "Set derivative to zero",
          "result": "$2-\\lambda/2=0$",
          "why": "stationary point"
        },
        {
          "do": "Solve for multiplier",
          "result": "$\\lambda=4$",
          "why": "best candidate"
        },
        {
          "do": "Evaluate the dual objective",
          "result": "$q(4)=8-4=4$",
          "why": "best lower bound"
        },
        {
          "do": "Compare with primal",
          "result": "$f(2)=4$",
          "why": "the gap is zero"
        }
      ],
      "verify": "The dual lower bound reaches a feasible primal value, so both are optimal.",
      "answer": "The dual optimum is $4$ at $\\lambda=4$.",
      "connects": "The dual problem optimizes certificates, not parameters directly."
    },
    "practice": [
      {
        "problem": "If a primal feasible value is $10$ and a dual feasible value is $7$, what gap is certified?",
        "steps": [
          {
            "do": "Use weak duality",
            "result": "$7\\le p^\\star\\le10$",
            "why": "dual lower bound and primal upper bound"
          },
          {
            "do": "Subtract bounds",
            "result": "$10-7=3$",
            "why": "gap between certificate and candidate"
          },
          {
            "do": "Interpret",
            "result": "optimality gap at most $3$",
            "why": "the candidate can be no more than 3 above optimum"
          },
          {
            "do": "State uncertainty",
            "result": "$p^\\star$ lies between $7$ and $10$",
            "why": "bounds bracket the optimum"
          }
        ],
        "answer": "The certified gap is at most $3$."
      },
      {
        "problem": "Maximize $q(\\lambda)=3\\lambda-\\lambda^2$ over $\\lambda\\ge0$.",
        "steps": [
          {
            "do": "Differentiate",
            "result": "$q'(\\lambda)=3-2\\lambda$",
            "why": "slope"
          },
          {
            "do": "Set to zero",
            "result": "$3-2\\lambda=0$",
            "why": "interior candidate"
          },
          {
            "do": "Solve",
            "result": "$\\lambda=1.5$",
            "why": "divide by 2"
          },
          {
            "do": "Evaluate",
            "result": "$q(1.5)=4.5-2.25=2.25$",
            "why": "dual optimum"
          },
          {
            "do": "Check domain",
            "result": "$1.5\\ge0$",
            "why": "feasible multiplier"
          }
        ],
        "answer": "Maximum $2.25$ at $\\lambda=1.5$."
      },
      {
        "problem": "For $L(x,\\lambda)=x^2+\\lambda(1-x)$, find $q(\\lambda)$.",
        "steps": [
          {
            "do": "Differentiate in $x$",
            "result": "$2x-\\lambda$",
            "why": "minimize over primal variable"
          },
          {
            "do": "Set to zero",
            "result": "$x=\\lambda/2$",
            "why": "best response to price"
          },
          {
            "do": "Substitute",
            "result": "$q=\\lambda^2/4+\\lambda(1-\\lambda/2)$",
            "why": "evaluate Lagrangian"
          },
          {
            "do": "Simplify",
            "result": "$q=\\lambda-\\lambda^2/4$",
            "why": "combine terms"
          }
        ],
        "answer": "$q(\\lambda)=\\lambda-\\lambda^2/4$."
      },
      {
        "problem": "If primal and dual values are both $5.2$, what can you conclude under weak duality?",
        "steps": [
          {
            "do": "Write weak duality bounds",
            "result": "$d\\le p^\\star\\le p$",
            "why": "dual below optimum, primal candidate above"
          },
          {
            "do": "Substitute equal values",
            "result": "$5.2\\le p^\\star\\le5.2$",
            "why": "both bounds match"
          },
          {
            "do": "Conclude optimum",
            "result": "$p^\\star=5.2$",
            "why": "a number squeezed between equal bounds is equal"
          },
          {
            "do": "Interpret",
            "result": "both candidates are optimal",
            "why": "zero gap certificate"
          }
        ],
        "answer": "The primal and dual candidates are optimal with value $5.2$."
      },
      {
        "problem": "A dual ascent step has $\\lambda=2$, gradient $0.5$, step size $0.1$, and constraint $\\lambda\\ge0$. Compute the projected update.",
        "steps": [
          {
            "do": "Take ascent step",
            "result": "$2+0.1\\cdot0.5=2.05$",
            "why": "dual maximization ascends"
          },
          {
            "do": "Project onto nonnegative reals",
            "result": "$\\max(0,2.05)=2.05$",
            "why": "dual feasibility"
          },
          {
            "do": "State new multiplier",
            "result": "$2.05$",
            "why": "already feasible"
          },
          {
            "do": "Interpret",
            "result": "price increases slightly",
            "why": "positive gradient raises the bound"
          }
        ],
        "answer": "$\\lambda^+=2.05$."
      }
    ],
    "applications": [
      {
        "title": "SVM dual training",
        "background": "The SVM dual depends on example-example dot products, revealing support vectors through nonzero dual variables.",
        "numbers": "With labels $[1,-1]$ and kernel value $0.2$, one dual interaction includes $y_1y_2K_{12}=-0.2$."
      },
      {
        "title": "Optimality certificates",
        "background": "Solvers use primal-dual gaps to decide when to stop.",
        "numbers": "If primal objective is $100.4$ and dual bound is $100.1$, the gap is $0.3$, or about $0.3\\%$ of 100."
      },
      {
        "title": "Relaxations in combinatorial optimization",
        "background": "Dual bounds help when exact discrete optimization is hard.",
        "numbers": "If an integer solution costs $42$ and an LP dual bound is $39$, the best possible improvement is at most $3$."
      },
      {
        "title": "Regularization paths",
        "background": "Dual variables can reveal how constraints trade off with loss.",
        "numbers": "A norm constraint multiplier $0.8$ means relaxing the constraint by $0.1$ predicts about $0.08$ objective improvement."
      },
      {
        "title": "Distributed optimization",
        "background": "Dual decomposition splits large problems by pricing shared constraints.",
        "numbers": "If two workers exceed a shared budget by $3$ and $2$, the total residual priced by $\\lambda=0.5$ is $2.5$."
      },
      {
        "title": "Fair ML constraints",
        "background": "Dual methods tune penalties for constraints such as demographic rate gaps.",
        "numbers": "A gap violation $0.01$ with multiplier $20$ contributes $0.2$ to the Lagrangian."
      }
    ],
    "applicationsClose": "Across theory and training practice, the method is one more way to make the optimization landscape legible through numbers you can compute.",
    "takeaways": [
      "The dual problem is an optimization tool for price optimization.",
      "The arithmetic of each update matters: scale, sign, and feasibility change the result.",
      "Convex settings give stronger certificates than nonconvex settings.",
      "In ML, these methods are useful because training is optimization under noise, scale, and constraints."
    ]
  },
  "math-22-24": {
    "id": "math-22-24",
    "title": "Linear programming",
    "tagline": "Linear programming optimizes a linear objective over a polyhedron, so the best point often lives at a corner.",
    "connections": {
      "buildsOn": [
        "The dual problem",
        "linear algebra",
        "systems of inequalities"
      ],
      "leadsTo": [
        "Quadratic programming",
        "network flows",
        "resource allocation"
      ],
      "usedWith": [
        "matrices",
        "convex sets",
        "duality",
        "geometry"
      ]
    },
    "motivation": "<p>You already know that training means changing parameters to reduce a loss. The hard part is that different coordinates, constraints, and curvatures do not all behave the same way.</p><p><b>Linear programming</b> gives a particular tool for that difficulty. Its central move is polyhedra: a way to make optimization less like blind walking and more like reading the local terrain.</p>",
    "definition": "<p>The core formula is minimize $c^Tx$ subject to $Ax\\le b$ and optional equalities. Here the symbols name the current parameter or variable, the gradient information, and any memory or constraints used by the method. The method is built to handle corner solutions.</p><p>The reason this helps is that the raw gradient is not always the best step by itself. Scaling, pricing, coordinate choices, or curvature can turn the same local information into a safer or more informative move.</p><p><b>Assumptions that matter:</b> check differentiability when gradients or Hessians are used; check convexity before claiming global optimality; keep learning rates, decay constants, and multiplier signs in their required ranges; and remember that numerical solvers certify different things depending on the problem class.</p>",
    "worked": {
      "problem": "Maximize $3x+2y$ subject to $x+y\\le4$, $x\\le2$, $y\\le3$, $x,y\\ge0$ by checking corners.",
      "skills": [
        "linear objectives",
        "feasible polyhedra",
        "corner checking"
      ],
      "strategy": "A linear objective reaches an optimum at a corner when the feasible polyhedron is bounded.",
      "steps": [
        {
          "do": "List the feasible corners",
          "result": "$(0,0),(2,0),(0,3),(1,3),(2,2)$",
          "why": "intersections of active constraints"
        },
        {
          "do": "Evaluate at $(0,0)$",
          "result": "$0$",
          "why": "objective value"
        },
        {
          "do": "Evaluate at $(2,0)$",
          "result": "$6$",
          "why": "$3\\cdot2+2\\cdot0$"
        },
        {
          "do": "Evaluate at $(0,3)$",
          "result": "$6$",
          "why": "$2\\cdot3$"
        },
        {
          "do": "Evaluate at $(1,3)$",
          "result": "$9$",
          "why": "$3+6$"
        },
        {
          "do": "Evaluate at $(2,2)$",
          "result": "$10$",
          "why": "$6+4$"
        },
        {
          "do": "Choose the largest",
          "result": "$(2,2)$",
          "why": "10 is the maximum listed value"
        }
      ],
      "verify": "The point $(2,2)$ satisfies all constraints, including $x+y=4$ and $x=2$.",
      "answer": "The maximum is $10$ at $(2,2)$.",
      "connects": "Linear programs are geometry problems: slide a line until it last touches the feasible region."
    },
    "practice": [
      {
        "problem": "Maximize $x+y$ subject to $x\\le1$, $y\\le2$, $x,y\\ge0$.",
        "steps": [
          {
            "do": "List corners",
            "result": "$(0,0),(1,0),(0,2),(1,2)$",
            "why": "rectangle vertices"
          },
          {
            "do": "Evaluate objective",
            "result": "$0,1,2,3$",
            "why": "sum coordinates"
          },
          {
            "do": "Find maximum",
            "result": "$3$",
            "why": "largest value"
          },
          {
            "do": "Name point",
            "result": "$(1,2)$",
            "why": "corner with largest sum"
          }
        ],
        "answer": "Maximum $3$ at $(1,2)$."
      },
      {
        "problem": "Convert $2x+3y\\ge6$ to $\\le$ form.",
        "steps": [
          {
            "do": "Start with inequality",
            "result": "$2x+3y\\ge6$",
            "why": "given form"
          },
          {
            "do": "Multiply by $-1$",
            "result": "$-2x-3y\\le-6$",
            "why": "reverses the inequality"
          },
          {
            "do": "Name standard row",
            "result": "$[-2,-3][x,y]^T\\le-6$",
            "why": "matrix form"
          },
          {
            "do": "Check with $(3,0)$",
            "result": "$-6\\le-6$",
            "why": "boundary point remains feasible"
          }
        ],
        "answer": "$-2x-3y\\le-6$."
      },
      {
        "problem": "For cost $c=[4,1]$ and point $x=[2,3]$, compute $c^Tx$.",
        "steps": [
          {
            "do": "Multiply first entries",
            "result": "$4\\cdot2=8$",
            "why": "dot product term"
          },
          {
            "do": "Multiply second entries",
            "result": "$1\\cdot3=3$",
            "why": "second term"
          },
          {
            "do": "Add",
            "result": "$8+3=11$",
            "why": "linear objective"
          },
          {
            "do": "Interpret",
            "result": "cost is $11$",
            "why": "objective value at the point"
          }
        ],
        "answer": "$c^Tx=11$."
      },
      {
        "problem": "Check whether $(2,1)$ satisfies $x+y\\le4$, $2x+y\\le5$, and $x,y\\ge0$.",
        "steps": [
          {
            "do": "Check first inequality",
            "result": "$2+1=3\\le4$",
            "why": "satisfied"
          },
          {
            "do": "Check second inequality",
            "result": "$2\\cdot2+1=5\\le5$",
            "why": "active but satisfied"
          },
          {
            "do": "Check nonnegativity",
            "result": "$2\\ge0$ and $1\\ge0$",
            "why": "both coordinates are nonnegative"
          },
          {
            "do": "Conclude",
            "result": "feasible",
            "why": "all constraints hold"
          }
        ],
        "answer": "$(2,1)$ is feasible."
      },
      {
        "problem": "A minimization LP has feasible value $12$ and dual lower bound $11.5$. Compute the relative gap using value $12$.",
        "steps": [
          {
            "do": "Compute absolute gap",
            "result": "$12-11.5=0.5$",
            "why": "primal minus dual"
          },
          {
            "do": "Divide by primal value",
            "result": "$0.5/12\\approx0.0417$",
            "why": "relative gap"
          },
          {
            "do": "Convert to percent",
            "result": "$4.17\\%$",
            "why": "multiply by 100"
          },
          {
            "do": "Interpret",
            "result": "solution is within about $4.17\\%$ by this certificate",
            "why": "gap-based stopping"
          }
        ],
        "answer": "Relative gap about $4.17\\%$."
      }
    ],
    "applications": [
      {
        "title": "Resource allocation",
        "background": "LPs model limited resources with linear returns and budgets.",
        "numbers": "If product A earns $3$ per unit and B earns $2$, making $(2,2)$ units earns $10$ under the worked constraints."
      },
      {
        "title": "Network flow",
        "background": "Many routing and flow problems are LPs because conservation and capacity are linear.",
        "numbers": "If an edge capacity is $7$ and flows are $3$ and $4$, the capacity constraint is tight: $3+4=7$."
      },
      {
        "title": "Diet and blending problems",
        "background": "Classic LP history includes choosing foods or materials to meet requirements at minimum cost.",
        "numbers": "If food costs are $2$ and $5$ dollars with quantities $3$ and $1$, total cost is $11$."
      },
      {
        "title": "Fair threshold mixtures",
        "background": "Randomizing between classifiers can make rates linear in mixture weights.",
        "numbers": "Mixing classifier A with rate $0.8$ at weight $0.25$ and B with rate $0.4$ at weight $0.75$ gives $0.5$."
      },
      {
        "title": "Production planning",
        "background": "Factories use LPs when each unit consumes fixed amounts of resources.",
        "numbers": "If one item uses 2 CPU-hours and another uses 3, plan $(4,5)$ uses $8+15=23$ CPU-hours."
      },
      {
        "title": "LP relaxations for hard problems",
        "background": "Discrete choices can be relaxed to continuous variables to get bounds.",
        "numbers": "A binary variable relaxed to $0\\le x\\le1$ may take $x=0.6$, giving a bound even if the final integer solution needs $0$ or $1$."
      }
    ],
    "applicationsClose": "Across theory and training practice, the method is one more way to make the optimization landscape legible through numbers you can compute.",
    "takeaways": [
      "Linear programming is an optimization tool for simplex intuition.",
      "The arithmetic of each update matters: scale, sign, and feasibility change the result.",
      "Convex settings give stronger certificates than nonconvex settings.",
      "In ML, these methods are useful because training is optimization under noise, scale, and constraints."
    ]
  },
  "math-22-25": {
    "id": "math-22-25",
    "title": "Quadratic programming",
    "tagline": "Quadratic programming adds curved cost to linear constraints, covering projections, portfolios, and SVM margins.",
    "connections": {
      "buildsOn": [
        "Linear programming",
        "The KKT conditions",
        "positive semidefinite matrices"
      ],
      "leadsTo": [
        "Nonconvex optimization & the DL landscape",
        "support vector machines",
        "constrained least squares"
      ],
      "usedWith": [
        "Hessians",
        "linear algebra",
        "convexity",
        "duality"
      ]
    },
    "motivation": "<p>You already know that training means changing parameters to reduce a loss. The hard part is that different coordinates, constraints, and curvatures do not all behave the same way.</p><p><b>Quadratic programming</b> gives a particular tool for that difficulty. Its central move is positive semidefinite curvature: a way to make optimization less like blind walking and more like reading the local terrain.</p>",
    "definition": "<p>The core formula is minimize $\\dfrac12x^TQx+c^Tx$ subject to linear constraints, usually with $Q\\succeq0$. Here the symbols name the current parameter or variable, the gradient information, and any memory or constraints used by the method. The method is built to handle linear constraints.</p><p>The reason this helps is that the raw gradient is not always the best step by itself. Scaling, pricing, coordinate choices, or curvature can turn the same local information into a safer or more informative move.</p><p><b>Assumptions that matter:</b> check differentiability when gradients or Hessians are used; check convexity before claiming global optimality; keep learning rates, decay constants, and multiplier signs in their required ranges; and remember that numerical solvers certify different things depending on the problem class.</p>",
    "worked": {
      "problem": "Project point $z=3$ onto the interval $[0,2]$ by solving $\\min_x \\tfrac12(x-3)^2$ subject to $0\\le x\\le2$.",
      "skills": [
        "quadratic objectives",
        "constraints",
        "projection"
      ],
      "strategy": "The unconstrained minimizer is outside the interval, so the nearest feasible boundary wins.",
      "steps": [
        {
          "do": "Find the unconstrained minimizer",
          "result": "$x=3$",
          "why": "the square is zero at $z$"
        },
        {
          "do": "Check feasibility",
          "result": "$3\\not\\le2$",
          "why": "the point violates the upper bound"
        },
        {
          "do": "List nearest feasible boundary",
          "result": "$x=2$",
          "why": "the interval ends at 2"
        },
        {
          "do": "Compute projected objective",
          "result": "$\\tfrac12(2-3)^2=0.5$",
          "why": "distance-squared cost"
        },
        {
          "do": "Compare with lower boundary",
          "result": "$\\tfrac12(0-3)^2=4.5$",
          "why": "upper boundary is closer"
        }
      ],
      "verify": "The projection should be the closest point in the interval to 3, which is visibly 2.",
      "answer": "The solution is $x=2$.",
      "connects": "Quadratic programs often formalize nearest feasible correction."
    },
    "practice": [
      {
        "problem": "Minimize $\\tfrac12(2x^2)+(-4)x$ with no constraints.",
        "steps": [
          {
            "do": "Rewrite objective",
            "result": "$x^2-4x$",
            "why": "simplify the half factor"
          },
          {
            "do": "Differentiate",
            "result": "$2x-4$",
            "why": "first-order condition"
          },
          {
            "do": "Set to zero",
            "result": "$2x-4=0$",
            "why": "unconstrained optimum"
          },
          {
            "do": "Solve",
            "result": "$x=2$",
            "why": "divide by 2"
          }
        ],
        "answer": "The minimizer is $x=2$."
      },
      {
        "problem": "Check whether $Q=\\begin{bmatrix}2&0\\\\0&6\\end{bmatrix}$ is positive semidefinite.",
        "steps": [
          {
            "do": "Read eigenvalues of diagonal matrix",
            "result": "$2$ and $6$",
            "why": "diagonal entries are eigenvalues"
          },
          {
            "do": "Compare to zero",
            "result": "$2\\ge0$ and $6\\ge0$",
            "why": "PSD condition"
          },
          {
            "do": "Conclude",
            "result": "$Q\\succeq0$",
            "why": "nonnegative curvature"
          },
          {
            "do": "Interpret",
            "result": "the quadratic is convex",
            "why": "PSD Hessian means convex objective"
          }
        ],
        "answer": "Yes, $Q$ is positive semidefinite."
      },
      {
        "problem": "Project $z=[3,-1]$ onto the box $0\\le x_1\\le2$, $0\\le x_2\\le2$.",
        "steps": [
          {
            "do": "Clip the first coordinate",
            "result": "$3\\mapsto2$",
            "why": "upper bound is 2"
          },
          {
            "do": "Clip the second coordinate",
            "result": "$-1\\mapsto0$",
            "why": "lower bound is 0"
          },
          {
            "do": "Combine coordinates",
            "result": "$[2,0]$",
            "why": "box projection clips coordinate-wise"
          },
          {
            "do": "Check feasibility",
            "result": "$0\\le2\\le2$ and $0\\le0\\le2$",
            "why": "both coordinates satisfy bounds"
          }
        ],
        "answer": "The projection is $[2,0]$."
      },
      {
        "problem": "For $Q=4$, $c=-8$, and constraint $x\\ge1$, solve the scalar QP $\\min \\tfrac12Qx^2+cx$.",
        "steps": [
          {
            "do": "Write objective",
            "result": "$2x^2-8x$",
            "why": "half of 4 is 2"
          },
          {
            "do": "Differentiate",
            "result": "$4x-8$",
            "why": "slope"
          },
          {
            "do": "Set to zero",
            "result": "$4x-8=0$",
            "why": "unconstrained optimum"
          },
          {
            "do": "Solve",
            "result": "$x=2$",
            "why": "candidate"
          },
          {
            "do": "Check constraint",
            "result": "$2\\ge1$",
            "why": "feasible"
          }
        ],
        "answer": "The solution is $x=2$."
      },
      {
        "problem": "A QP solution has primal value $3.01$ and dual value $3.00$. Compute the gap.",
        "steps": [
          {
            "do": "Subtract dual from primal",
            "result": "$3.01-3.00=0.01$",
            "why": "absolute optimality gap"
          },
          {
            "do": "Compare with primal",
            "result": "$0.01/3.01\\approx0.00332$",
            "why": "relative size"
          },
          {
            "do": "Convert to percent",
            "result": "$0.332\\%$",
            "why": "multiply by 100"
          },
          {
            "do": "Interpret",
            "result": "near optimal",
            "why": "small primal-dual gap"
          }
        ],
        "answer": "The absolute gap is $0.01$, about $0.33\\%$."
      }
    ],
    "applications": [
      {
        "title": "Support vector machines",
        "background": "The hard- and soft-margin SVM primal is a quadratic program: minimize norm while satisfying margin constraints.",
        "numbers": "For $w=[3,4]$, margin regularizer $\\tfrac12||w||^2=\\tfrac12(25)=12.5$."
      },
      {
        "title": "Portfolio optimization",
        "background": "Mean-variance investing balances linear return with quadratic risk.",
        "numbers": "If variance matrix is identity and weights are $[0.6,0.4]$, risk term $\\tfrac12||w||^2=0.26$."
      },
      {
        "title": "Projection layers",
        "background": "Projected gradient methods solve small QPs when parameters must satisfy bounds or simplex constraints.",
        "numbers": "Projecting $[1.2,-0.1,0.4]$ onto nonnegative entries starts by clipping to $[1.2,0,0.4]$ before any sum constraint."
      },
      {
        "title": "Model predictive control",
        "background": "Control systems often solve a QP at each time step because dynamics are linearized and costs are quadratic.",
        "numbers": "A control effort $u=[2,-1]$ with cost $\\tfrac12||u||^2$ has cost $2.5$."
      },
      {
        "title": "Constrained least squares",
        "background": "Least squares with nonnegativity constraints is a QP.",
        "numbers": "Residual norm $||Ax-b||=3$ gives quadratic loss $\\tfrac12\\cdot9=4.5$."
      },
      {
        "title": "Trust-region subproblems",
        "background": "Second-order methods minimize a quadratic model inside a step-size ball.",
        "numbers": "If proposed step norm is $5$ and radius is $2$, the constraint $||s||\\le2$ is active."
      }
    ],
    "applicationsClose": "Across theory and training practice, the method is one more way to make the optimization landscape legible through numbers you can compute.",
    "takeaways": [
      "Quadratic programming is an optimization tool for projection geometry.",
      "The arithmetic of each update matters: scale, sign, and feasibility change the result.",
      "Convex settings give stronger certificates than nonconvex settings.",
      "In ML, these methods are useful because training is optimization under noise, scale, and constraints."
    ]
  },
  "math-22-26": {
    "id": "math-22-26",
    "title": "Nonconvex optimization & the DL landscape",
    "tagline": "Deep-learning losses are not bowls, but their local geometry still gives useful training guidance.",
    "connections": {
      "buildsOn": [
        "Adam",
        "Newton's method",
        "Hessians",
        "stochastic gradient descent"
      ],
      "leadsTo": [
        "generalization",
        "large-scale neural-network training",
        "optimizer diagnostics"
      ],
      "usedWith": [
        "eigenvalues",
        "Taylor approximations",
        "probability",
        "matrix calculus"
      ]
    },
    "motivation": "<p>You already know that training means changing parameters to reduce a loss. The hard part is that different coordinates, constraints, and curvatures do not all behave the same way.</p><p><b>Nonconvex optimization & the DL landscape</b> gives a particular tool for that difficulty. Its central move is local minima: a way to make optimization less like blind walking and more like reading the local terrain.</p>",
    "definition": "<p>The core formula is nonconvex means $f(\\alpha x+(1-\\alpha)y)\\le\\alpha f(x)+(1-\\alpha)f(y)$ can fail; training seeks useful low loss, not a certified global minimum. Here the symbols name the current parameter or variable, the gradient information, and any memory or constraints used by the method. The method is built to handle saddles and flat directions.</p><p>The reason this helps is that the raw gradient is not always the best step by itself. Scaling, pricing, coordinate choices, or curvature can turn the same local information into a safer or more informative move.</p><p><b>Assumptions that matter:</b> check differentiability when gradients or Hessians are used; check convexity before claiming global optimality; keep learning rates, decay constants, and multiplier signs in their required ranges; and remember that numerical solvers certify different things depending on the problem class.</p>",
    "worked": {
      "problem": "A tiny nonconvex loss is $L(w)=(w^2-1)^2+0.1w$. Evaluate the two wells at $w=-1$ and $w=1$, then take one gradient step from $w=0.2$ with $\\eta=0.1$.",
      "skills": [
        "nonconvex losses",
        "gradients",
        "local geometry"
      ],
      "strategy": "The loss has two wells, and the small linear term makes one better than the other.",
      "steps": [
        {
          "do": "Evaluate the left well",
          "result": "$L(-1)=0-0.1=-0.1$",
          "why": "the quartic term vanishes"
        },
        {
          "do": "Evaluate the right well",
          "result": "$L(1)=0+0.1=0.1$",
          "why": "same quartic value, higher linear term"
        },
        {
          "do": "Differentiate the loss",
          "result": "$L'(w)=4w(w^2-1)+0.1$",
          "why": "chain rule on $(w^2-1)^2$"
        },
        {
          "do": "Evaluate the gradient at $0.2$",
          "result": "$4(0.2)(0.04-1)+0.1=-0.668$",
          "why": "compute local slope"
        },
        {
          "do": "Take a gradient step",
          "result": "$w^+=0.2-0.1(-0.668)=0.2668$",
          "why": "move opposite the negative gradient"
        },
        {
          "do": "Interpret the move",
          "result": "toward the right well initially",
          "why": "local slope, not global knowledge, drives the step"
        }
      ],
      "verify": "The global lower well among the two tested points is at $-1$, but the local step from $0.2$ moves right because of the local slope.",
      "answer": "$L(-1)=-0.1$, $L(1)=0.1$, and one step gives $w^+=0.2668$.",
      "connects": "Nonconvex training follows local information through a landscape that may contain many basins and saddles."
    },
    "practice": [
      {
        "problem": "Show nonconvexity for $f(x)=x^4-x^2$ using $x=-0.5$, $y=0.5$, and midpoint $0$.",
        "steps": [
          {
            "do": "Evaluate endpoints",
            "result": "$f(-0.5)=-0.1875$ and $f(0.5)=-0.1875$",
            "why": "$0.5^4-0.5^2=0.0625-0.25$"
          },
          {
            "do": "Average endpoint values",
            "result": "$(-0.1875-0.1875)/2=-0.1875$",
            "why": "convexity compares midpoint to this"
          },
          {
            "do": "Evaluate midpoint",
            "result": "$f(0)=0$",
            "why": "substitute the midpoint"
          },
          {
            "do": "Compare midpoint with endpoint average",
            "result": "$0>-0.1875$",
            "why": "convexity would require the midpoint value to be no larger than the average"
          },
          {
            "do": "State the violation",
            "result": "$f(0)>\\dfrac{f(-0.5)+f(0.5)}{2}$",
            "why": "one violation is enough to show nonconvexity"
          }
        ],
        "answer": "The midpoint value $0$ is greater than the endpoint average $-0.1875$, so $f$ is not convex."
      },
      {
        "problem": "For $f(x)=x^3$, identify whether $x=0$ is a local minimum, maximum, or saddle-like stationary point.",
        "steps": [
          {
            "do": "Differentiate",
            "result": "$f'(x)=3x^2$",
            "why": "stationary points satisfy zero derivative"
          },
          {
            "do": "Evaluate derivative at zero",
            "result": "$f'(0)=0$",
            "why": "stationary"
          },
          {
            "do": "Check left value",
            "result": "$f(-0.1)=-0.001$",
            "why": "less than $f(0)$"
          },
          {
            "do": "Check right value",
            "result": "$f(0.1)=0.001$",
            "why": "greater than $f(0)$"
          },
          {
            "do": "Classify",
            "result": "neither local minimum nor maximum",
            "why": "values pass through the point"
          }
        ],
        "answer": "$x=0$ is a saddle-like stationary point in one dimension."
      },
      {
        "problem": "A Hessian has eigenvalues $[-3,0.2,5]$ at a critical point. Classify the local geometry.",
        "steps": [
          {
            "do": "Look for negative curvature",
            "result": "$-3<0$",
            "why": "one direction curves downward"
          },
          {
            "do": "Look for positive curvature",
            "result": "$0.2$ and $5$ are positive",
            "why": "other directions curve upward"
          },
          {
            "do": "Combine signs",
            "result": "mixed curvature",
            "why": "both up and down directions exist"
          },
          {
            "do": "Classify",
            "result": "saddle point",
            "why": "critical point with a negative curvature direction"
          }
        ],
        "answer": "The point is a saddle."
      },
      {
        "problem": "A training loss decreases from $2.0$ to $1.4$ to $1.1$ to $1.05$. Compute total and last-step decreases.",
        "steps": [
          {
            "do": "Compute total decrease",
            "result": "$2.0-1.05=0.95$",
            "why": "start minus final"
          },
          {
            "do": "Compute first decrease",
            "result": "$2.0-1.4=0.6$",
            "why": "large early progress"
          },
          {
            "do": "Compute last decrease",
            "result": "$1.1-1.05=0.05$",
            "why": "small late progress"
          },
          {
            "do": "Interpret",
            "result": "progress is slowing",
            "why": "common near flatter regions"
          }
        ],
        "answer": "Total decrease $0.95$; last-step decrease $0.05$."
      },
      {
        "problem": "A mini-batch gradient is $[0.3,-0.4]$. With $\\eta=0.01$, compute the SGD update and its norm.",
        "steps": [
          {
            "do": "Scale the gradient",
            "result": "$0.01[0.3,-0.4]=[0.003,-0.004]$",
            "why": "learning-rate step"
          },
          {
            "do": "Apply negative sign",
            "result": "$[-0.003,0.004]$",
            "why": "descent update"
          },
          {
            "do": "Compute norm",
            "result": "$\\sqrt{0.003^2+0.004^2}$",
            "why": "step length"
          },
          {
            "do": "Simplify",
            "result": "$0.005$",
            "why": "3-4-5 triangle scaled by $0.001$"
          }
        ],
        "answer": "The update is $[-0.003,0.004]$ with norm $0.005$."
      }
    ],
    "applications": [
      {
        "title": "Deep neural networks",
        "background": "Deep losses are nonconvex because layers multiply parameters and activations. Training still works by finding low-loss basins that generalize.",
        "numbers": "If train loss falls from $2.3$ to $0.4$ and validation loss from $2.4$ to $0.6$, the gap is $0.2$."
      },
      {
        "title": "Saddles in high dimension",
        "background": "In many dimensions, saddle points are more common than isolated bad local minima. Negative curvature directions allow escape.",
        "numbers": "If one Hessian eigenvalue is $-0.5$, a step of length $0.1$ along that eigenvector changes the quadratic model by about $0.5(-0.5)(0.1)^2=-0.0025$."
      },
      {
        "title": "Flat minima and generalization",
        "background": "Flat regions are studied because parameters can move without sharply increasing loss, which may correlate with robustness.",
        "numbers": "If moving weight noise of norm $0.1$ raises loss from $0.50$ to $0.505$, the increase is only $0.005$."
      },
      {
        "title": "Initialization matters",
        "background": "Different random seeds can land in different basins, especially for small or brittle models.",
        "numbers": "Three seeds with validation accuracies $0.82$, $0.85$, and $0.83$ have mean $0.833$ and range $0.03$."
      },
      {
        "title": "Learning-rate schedules",
        "background": "Large steps can explore and escape shallow traps; smaller steps later settle into a basin.",
        "numbers": "Cosine or step decay from $0.1$ to $0.001$ reduces step scale by a factor of $100$."
      },
      {
        "title": "Batch noise as exploration",
        "background": "Mini-batch noise can jostle training out of sharp or saddle regions.",
        "numbers": "If full gradient is $[0.01,0]$ but mini-batch noise standard deviation is $0.05$, the noise is five times the signal in that coordinate."
      }
    ],
    "applicationsClose": "Across theory and training practice, the method is one more way to make the optimization landscape legible through numbers you can compute.",
    "takeaways": [
      "Nonconvex optimization & the DL landscape is an optimization tool for deep learning loss landscapes.",
      "The arithmetic of each update matters: scale, sign, and feasibility change the result.",
      "Convex settings give stronger certificates than nonconvex settings.",
      "In ML, these methods are useful because training is optimization under noise, scale, and constraints."
    ]
  }
};
