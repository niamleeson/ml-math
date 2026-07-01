module.exports = {
  "math-20-01": {
    "id": "math-20-01",
    "title": "The Bayesian view of probability",
    "tagline": "Bayesian probability treats uncertainty as something you can update carefully when new evidence arrives.",
    "connections": {
      "buildsOn": [
        "conditional probability",
        "probability rules",
        "basic algebra with ratios"
      ],
      "leadsTo": [
        "Priors",
        "Likelihoods",
        "Posteriors"
      ],
      "usedWith": [
        "conditional probability",
        "Bayes rule",
        "odds",
        "normalization"
      ]
    },
    "motivation": "<p>You already know how to revise a belief. If dark clouds gather, rain becomes more plausible; if the radar is clear, it becomes less plausible. Bayesian statistics gives that everyday updating a precise arithmetic language.</p><p>The heart of the view is gentle but powerful: probability measures a state of information. Data do not replace judgment by magic; data update a prior state into a posterior state. The goal is not certainty. The goal is honest uncertainty that improves when evidence arrives.</p>",
    "definition": "<p>In the Bayesian view, an unknown quantity θ has a probability distribution before and after data. The prior $p(θ)$ describes what was plausible before observing data $D$. The likelihood $p(D|θ)$ says how compatible the data are with each possible θ. The posterior $p(θ|D)$ is the updated distribution after seeing the data.</p><p>Bayes rule comes from the multiplication rule: $p(θ,D)=p(D|θ)p(θ)$ and also $p(θ,D)=p(θ|D)p(D)$. Setting these equal gives $p(θ|D)=p(D|θ)p(θ)/p(D)$. The denominator $p(D)$ normalizes the probabilities so they add or integrate to 1.</p><p><b>Assumptions that matter:</b> θ is treated as uncertain, the data model must assign probabilities to possible observations, prior probabilities must be nonnegative and normalized, and conditioning on data with positive probability is required.</p>",
    "worked": {
      "problem": "A test for a rare condition has sensitivity 0.90 and false-positive rate 0.05. The condition rate is 0.02. Find the probability of the condition after a positive test.",
      "skills": [
        "Bayes rule",
        "base rates",
        "normalization"
      ],
      "strategy": "The positive test sounds persuasive, but the rare base rate matters — compute the two ways a positive result can happen.",
      "steps": [
        {
          "do": "Write the prior condition probability",
          "result": "$P(C)=0.02$",
          "why": "2 percent of the population has the condition"
        },
        {
          "do": "Write the no-condition probability",
          "result": "$P(no C)=0.98$",
          "why": "probabilities of complementary cases sum to 1"
        },
        {
          "do": "Compute true-positive probability",
          "result": "$P(+ and C)=0.90*0.02=0.018$",
          "why": "multiply sensitivity by the prior"
        },
        {
          "do": "Compute false-positive probability",
          "result": "$P(+ and no C)=0.05*0.98=0.049$",
          "why": "a positive test can also happen without the condition"
        },
        {
          "do": "Compute total positive probability",
          "result": "$P(+)=0.018+0.049=0.067$",
          "why": "add the mutually exclusive positive-test paths"
        },
        {
          "do": "Normalize the condition path",
          "result": "$P(C|+)=0.018/0.067=0.269$",
          "why": "posterior probability is the favorable path divided by all positive paths"
        }
      ],
      "verify": "The answer is below 0.5 even with a good test because false positives among the 98 percent without the condition are numerous.",
      "answer": "$P(C|+) approx 0.269$, about 26.9 percent.",
      "connects": "Bayesian updating combines prior plausibility with evidence strength, then normalizes."
    },
    "practice": [
      {
        "problem": "A spam filter has prior $P(spam)=0.20$. A word appears in 60 percent of spam emails and 10 percent of non-spam emails. Find $P(spam|word)$.",
        "steps": [
          {
            "do": "Write the non-spam prior",
            "result": "$P(not spam)=0.80$",
            "why": "the two classes are complements"
          },
          {
            "do": "Compute spam-and-word",
            "result": "$0.60*0.20=0.12$",
            "why": "word likelihood times spam prior"
          },
          {
            "do": "Compute non-spam-and-word",
            "result": "$0.10*0.80=0.08$",
            "why": "word can appear in legitimate email too"
          },
          {
            "do": "Add word probability",
            "result": "$0.12+0.08=0.20$",
            "why": "sum the two paths to the observed word"
          },
          {
            "do": "Normalize",
            "result": "$0.12/0.20=0.60$",
            "why": "posterior is the spam path among all word cases"
          }
        ],
        "answer": "$P(spam|word)=0.60$."
      },
      {
        "problem": "A factory has machines A and B. A makes 70 percent of parts with defect rate 3 percent; B makes 30 percent with defect rate 8 percent. Given a defect, find $P(B|defect)$.",
        "steps": [
          {
            "do": "Compute A-defect probability",
            "result": "$0.70*0.03=0.021$",
            "why": "production share times defect rate"
          },
          {
            "do": "Compute B-defect probability",
            "result": "$0.30*0.08=0.024$",
            "why": "same calculation for machine B"
          },
          {
            "do": "Compute total defect probability",
            "result": "$0.021+0.024=0.045$",
            "why": "a defect came from A or B"
          },
          {
            "do": "Normalize the B path",
            "result": "$0.024/0.045=0.533$",
            "why": "condition on having seen a defect"
          },
          {
            "do": "Interpret",
            "result": "$53.3 percent$",
            "why": "B is less common but more defect-prone"
          }
        ],
        "answer": "$P(B|defect) approx 0.533$."
      },
      {
        "problem": "A model has two hypotheses, H1 and H2, with prior probabilities 0.6 and 0.4. Observed data are twice as likely under H2 as H1, with likelihoods 0.2 and 0.4. Find posterior probabilities.",
        "steps": [
          {
            "do": "Weight H1",
            "result": "$0.6*0.2=0.12$",
            "why": "prior times likelihood"
          },
          {
            "do": "Weight H2",
            "result": "$0.4*0.4=0.16$",
            "why": "prior times likelihood"
          },
          {
            "do": "Add weights",
            "result": "$0.12+0.16=0.28$",
            "why": "normalizing constant"
          },
          {
            "do": "Normalize H1",
            "result": "$0.12/0.28=0.429$",
            "why": "divide by total evidence"
          },
          {
            "do": "Normalize H2",
            "result": "$0.16/0.28=0.571$",
            "why": "posterior probabilities must sum to 1"
          }
        ],
        "answer": "$P(H1|D) approx 0.429$ and $P(H2|D) approx 0.571$."
      },
      {
        "problem": "A prior belief assigns $P(θ=1)=0.25$ and $P(θ=2)=0.75$. Data have likelihoods $p(D|θ=1)=0.8$ and $p(D|θ=2)=0.2$. Compute the posterior mean of θ.",
        "steps": [
          {
            "do": "Weight θ=1",
            "result": "$0.25*0.8=0.20$",
            "why": "prior times likelihood"
          },
          {
            "do": "Weight θ=2",
            "result": "$0.75*0.2=0.15$",
            "why": "prior times likelihood"
          },
          {
            "do": "Normalize total",
            "result": "$0.20+0.15=0.35$",
            "why": "evidence probability"
          },
          {
            "do": "Compute posterior probabilities",
            "result": "$P(1|D)=0.20/0.35=0.571$, $P(2|D)=0.429$",
            "why": "divide each weight by the total"
          },
          {
            "do": "Compute posterior mean",
            "result": "$1*0.571+2*0.429=1.429$",
            "why": "average θ under the posterior"
          }
        ],
        "answer": "The posterior mean is about $1.429$."
      },
      {
        "problem": "A classifier has prior odds of fraud 1:99. A signal has likelihood ratio 20 in favor of fraud. Convert to posterior probability.",
        "steps": [
          {
            "do": "Write prior odds",
            "result": "$1/99$",
            "why": "odds are probability of fraud divided by probability of no fraud"
          },
          {
            "do": "Multiply by likelihood ratio",
            "result": "$20/99$",
            "why": "Bayesian updating multiplies odds by the likelihood ratio"
          },
          {
            "do": "Convert odds to probability",
            "result": "$(20/99)/(1+20/99)$",
            "why": "probability equals odds divided by one plus odds"
          },
          {
            "do": "Simplify denominator",
            "result": "$1+20/99=119/99$",
            "why": "put terms over a common denominator"
          },
          {
            "do": "Divide",
            "result": "$(20/99)/(119/99)=20/119=0.168$",
            "why": "the 99 cancels"
          }
        ],
        "answer": "Posterior fraud probability is about $0.168$, or 16.8 percent."
      }
    ],
    "applications": [
      {
        "title": "Medical screening",
        "background": "Bayesian reasoning became famous in screening because positive tests can mislead when a condition is rare. The base rate is not a footnote; it is part of the arithmetic.",
        "numbers": "With prevalence 1 percent, sensitivity 95 percent, and false-positive rate 4 percent, $P(disease|+)=0.0095/(0.0095+0.0396)=0.193$."
      },
      {
        "title": "Spam filtering",
        "background": "Early spam filters used word frequencies as evidence. Each word nudges the odds rather than deciding alone.",
        "numbers": "Prior spam 30 percent, word likelihood 0.50 in spam and 0.05 in ham gives posterior $0.15/(0.15+0.035)=0.811$."
      },
      {
        "title": "A/B experiment interpretation",
        "background": "A Bayesian experiment can ask directly which variant has the higher conversion rate after data arrive.",
        "numbers": "If prior odds are 1:1 and data are 3 times as likely under B as A, posterior odds become 3:1, so $P(B better)=3/4=0.75$."
      },
      {
        "title": "Sensor fusion",
        "background": "Robotics combines uncertain sensors with prior location beliefs. A surprising reading is weighed against where the robot already probably was.",
        "numbers": "Prior location odds room 1 versus room 2 are 2:1. A sensor likelihood ratio 0.5 changes odds to 1:1, so each room has probability 0.5."
      },
      {
        "title": "Fraud detection",
        "background": "Rare-event systems must be especially Bayesian because most alerts may be false even when the detector is useful.",
        "numbers": "Prior fraud 0.5 percent, hit rate 80 percent, false alarm 2 percent gives $0.004/(0.004+0.0199)=0.167$."
      },
      {
        "title": "Model comparison",
        "background": "Bayesian model comparison updates probabilities over candidate explanations, not just parameter values.",
        "numbers": "Priors 0.5 and 0.5 with likelihoods 0.12 and 0.04 give posterior for model 1 equal to $0.06/(0.06+0.02)=0.75$."
      }
    ],
    "applicationsClose": "Across tests, classifiers, sensors, and experiments, the same motion appears: prior information meets evidence, then normalization turns weighted plausibility into probability.",
    "takeaways": [
      "Bayesian probability represents uncertainty as a distribution over unknowns.",
      "Bayes rule follows from the multiplication rule for joint probability.",
      "The prior and likelihood are both needed; ignoring either can distort the posterior.",
      "Normalization makes updated weights sum or integrate to 1."
    ]
  },
  "math-20-02": {
    "id": "math-20-02",
    "title": "Priors",
    "tagline": "A prior is not a guess to hide; it is the starting distribution you are willing to update in public.",
    "connections": {
      "buildsOn": [
        "The Bayesian view of probability",
        "probability distributions",
        "expected value"
      ],
      "leadsTo": [
        "Likelihoods",
        "Posteriors",
        "Conjugate priors"
      ],
      "usedWith": [
        "Beta distributions",
        "Normal distributions",
        "moments",
        "regularization"
      ]
    },
    "motivation": "<p>You already bring background knowledge to problems. If a coin comes from a normal mint, you do not begin by thinking every bias from 0 to 1 is equally realistic. If a new web page has no data, you still have experience from past pages.</p><p>A <b>prior</b> makes that starting information explicit. Good priors are not stubborn; they are updateable. They give the model a reasonable first posture, especially when data are scarce.</p>",
    "definition": "<p>A prior distribution $p(θ)$ assigns probability to possible values of an unknown parameter θ before the current data are observed. For a discrete θ, prior probabilities add to 1. For a continuous θ, the prior density integrates to 1, and intervals get probabilities from area under the density.</p><p>The prior contributes to the posterior through Bayes rule: posterior is proportional to likelihood times prior. If two parameter values explain the data equally well, the prior decides which was more plausible beforehand. If data are abundant and informative, the likelihood often dominates.</p><p><b>Assumptions that matter:</b> the prior must be chosen before seeing the data used for updating, it must put probability on values the model might need, and its scale should match the parameter being modeled. A prior can be weak, strong, informative, or intentionally broad, but it should be stated honestly.</p>",
    "worked": {
      "problem": "A click-through rate θ has a Beta prior with alpha 2 and beta 8. Interpret the prior mean and the effective prior counts.",
      "skills": [
        "Beta prior",
        "prior mean",
        "pseudo-counts"
      ],
      "strategy": "For a Bernoulli rate, a Beta prior acts like prior successes and failures — translate alpha and beta into a mean and total strength.",
      "steps": [
        {
          "do": "Write the prior parameters",
          "result": "$alpha=2$, $beta=8$",
          "why": "the Beta prior has two positive shape parameters"
        },
        {
          "do": "Compute the total prior count",
          "result": "$alpha+beta=10$",
          "why": "the sum measures prior concentration"
        },
        {
          "do": "Compute the prior mean",
          "result": "$alpha/(alpha+beta)=2/10=0.20$",
          "why": "the mean of a Beta distribution is alpha over total"
        },
        {
          "do": "Translate successes",
          "result": "$alpha=2$",
          "why": "for intuition, alpha behaves like prior successes"
        },
        {
          "do": "Translate failures",
          "result": "$beta=8$",
          "why": "beta behaves like prior failures"
        },
        {
          "do": "State the belief",
          "result": "about 20 percent with strength 10",
          "why": "the prior center and strength are separate ideas"
        }
      ],
      "verify": "A 20 percent mean does not mean certainty; total count 10 is modest, so real data can still move the belief.",
      "answer": "The prior mean is 0.20, with an effective 2 prior successes and 8 prior failures.",
      "connects": "A prior supplies both a center and a strength before the likelihood arrives."
    },
    "practice": [
      {
        "problem": "A Bernoulli rate has Beta prior alpha 1, beta 1. Find the prior mean and describe its strength.",
        "steps": [
          {
            "do": "Compute total",
            "result": "$1+1=2$",
            "why": "add the two shape parameters"
          },
          {
            "do": "Compute mean",
            "result": "$1/2=0.5$",
            "why": "Beta mean is alpha divided by total"
          },
          {
            "do": "Read pseudo-successes",
            "result": "$1$",
            "why": "alpha behaves like one success"
          },
          {
            "do": "Read pseudo-failures",
            "result": "$1$",
            "why": "beta behaves like one failure"
          },
          {
            "do": "Interpret strength",
            "result": "weak and symmetric",
            "why": "only two effective counts are easy for data to move"
          }
        ],
        "answer": "Mean 0.5, with weak symmetric strength 2."
      },
      {
        "problem": "A prior over three models is $[0.5,0.3,0.2]$. Data likelihoods are $[0.1,0.2,0.4]$. Compute the unnormalized posterior weights.",
        "steps": [
          {
            "do": "Weight model 1",
            "result": "$0.5*0.1=0.05$",
            "why": "prior times likelihood"
          },
          {
            "do": "Weight model 2",
            "result": "$0.3*0.2=0.06$",
            "why": "prior times likelihood"
          },
          {
            "do": "Weight model 3",
            "result": "$0.2*0.4=0.08$",
            "why": "prior times likelihood"
          },
          {
            "do": "List weights",
            "result": "$[0.05,0.06,0.08]$",
            "why": "these are not yet probabilities"
          },
          {
            "do": "Add weights",
            "result": "$0.19$",
            "why": "the total would normalize them later"
          }
        ],
        "answer": "Unnormalized weights are $[0.05,0.06,0.08]$."
      },
      {
        "problem": "A Normal prior for a weight has mean 0 and standard deviation 2. What prior probability intuition does this give for weights near 0 versus 6?",
        "steps": [
          {
            "do": "Write the standard deviation",
            "result": "$sigma=2$",
            "why": "the prior scale is 2"
          },
          {
            "do": "Convert weight 6 to z-score",
            "result": "$(6-0)/2=3$",
            "why": "measure distance in standard deviations"
          },
          {
            "do": "Compare weight 0",
            "result": "$z=0$",
            "why": "the prior is centered at 0"
          },
          {
            "do": "Use the Normal rule of thumb",
            "result": "3 standard deviations is far",
            "why": "Normal mass is concentrated near its mean"
          },
          {
            "do": "Interpret",
            "result": "0 is much more plausible than 6",
            "why": "the prior shrinks weights toward zero"
          }
        ],
        "answer": "The prior strongly favors weights near 0 over weights near 6."
      },
      {
        "problem": "A Beta prior alpha 20, beta 80 and a Beta prior alpha 2, beta 8 have the same mean. Compare their strengths.",
        "steps": [
          {
            "do": "Compute first mean",
            "result": "$20/(20+80)=0.20$",
            "why": "mean is alpha over total"
          },
          {
            "do": "Compute second mean",
            "result": "$2/(2+8)=0.20$",
            "why": "same center"
          },
          {
            "do": "Compute first total",
            "result": "$20+80=100$",
            "why": "prior strength"
          },
          {
            "do": "Compute second total",
            "result": "$2+8=10$",
            "why": "prior strength"
          },
          {
            "do": "Compare",
            "result": "first is 10 times stronger",
            "why": "100 effective counts versus 10"
          }
        ],
        "answer": "Both are centered at 0.20, but Beta(20,80) is 10 times more concentrated."
      },
      {
        "problem": "A two-hypothesis prior has odds 4:1 for H1 over H2. Evidence has likelihood ratio 1:8 favoring H2 over H1. Find posterior odds for H1:H2.",
        "steps": [
          {
            "do": "Write prior odds H1:H2",
            "result": "$4:1$",
            "why": "the prior favors H1"
          },
          {
            "do": "Convert evidence to H1:H2 ratio",
            "result": "$1:8$",
            "why": "evidence favors H2"
          },
          {
            "do": "Multiply odds",
            "result": "$4/1 * 1/8=4/8$",
            "why": "posterior odds equal prior odds times likelihood ratio"
          },
          {
            "do": "Simplify",
            "result": "$4/8=1/2$",
            "why": "reduce the fraction"
          },
          {
            "do": "State odds",
            "result": "$1:2$",
            "why": "H2 is now twice as likely as H1"
          }
        ],
        "answer": "Posterior odds are 1:2 for H1:H2."
      }
    ],
    "applications": [
      {
        "title": "Cold-start recommendation",
        "background": "New items have little interaction data, so systems borrow information from similar items through priors.",
        "numbers": "If past videos average 4 percent click rate, a Beta(4,96) prior starts at mean $4/(4+96)=0.04$ before the new video gathers clicks."
      },
      {
        "title": "Regularizing regression weights",
        "background": "Gaussian priors on weights are the Bayesian face of shrinkage. They discourage extreme weights unless data justify them.",
        "numbers": "A weight $w=3$ under Normal(0,1) is 3 standard deviations from the mean; $w=0.5$ is only 0.5 standard deviations away."
      },
      {
        "title": "A/B tests with historical baselines",
        "background": "When traffic is low, a prior based on previous launches keeps early random noise from dominating the story.",
        "numbers": "A Beta(30,970) prior has mean $30/1000=0.03$. After 4 clicks in 100 visits, the updated mean would be $34/1100=0.0309$."
      },
      {
        "title": "Bayesian spam filters",
        "background": "Word probabilities can be initialized with priors so rare words do not get impossible probabilities from tiny samples.",
        "numbers": "With Beta(1,1), seeing 0 word occurrences in 8 spam emails gives posterior mean $1/(1+9)=0.10$ instead of 0."
      },
      {
        "title": "Risk modeling",
        "background": "Insurance and reliability teams often encode engineering experience before a new product has much failure data.",
        "numbers": "A prior of 2 failures per 1000 units can be Beta(2,998), with mean $0.002$ and total strength 1000."
      },
      {
        "title": "Hierarchical modeling",
        "background": "Large systems often share information across groups. A group-level prior lets small groups learn from the population without being erased by it.",
        "numbers": "If a city has 3 events in 20 trials and a prior Beta(10,90), posterior mean is $(10+3)/(100+20)=13/120=0.108$."
      }
    ],
    "applicationsClose": "Priors are the mathematical way to say what was plausible before this dataset, while leaving room for evidence to teach you something new.",
    "takeaways": [
      "A prior is a probability distribution over unknown parameters before current data.",
      "Prior mean and prior strength are different: one gives the center, the other gives resistance to movement.",
      "Weak priors stabilize scarce data; strong priors need stronger justification.",
      "Bayesian transparency improves when priors are stated and checked, not hidden."
    ]
  },
  "math-20-03": {
    "id": "math-20-03",
    "title": "Likelihoods",
    "tagline": "A likelihood asks how well each possible parameter would have predicted the data you actually saw.",
    "connections": {
      "buildsOn": [
        "The Bayesian view of probability",
        "Priors",
        "conditional probability"
      ],
      "leadsTo": [
        "Posteriors",
        "Conjugate priors",
        "The Beta–Binomial model"
      ],
      "usedWith": [
        "probability mass functions",
        "probability densities",
        "logarithms",
        "optimization"
      ]
    },
    "motivation": "<p>You already compare explanations. If a coin lands heads 9 times in 10 tosses, a 50 percent heads coin can explain it, but a 90 percent heads coin explains it more comfortably. That comparative comfort is likelihood.</p><p>The likelihood is not a probability distribution over the parameter by itself. It is a score for parameter values after the data are fixed. Bayesian updating multiplies this score by the prior and then normalizes.</p>",
    "definition": "<p>For data $D$ and parameter θ, the <b>likelihood</b> is $L(θ)=p(D|θ)$, read as the probability or density of the observed data assuming θ were true. When observations are conditionally independent, likelihoods multiply: $p(x1,...,xn|θ)=p(x1|θ)*...*p(xn|θ)$.</p><p>For Bernoulli data with s successes and f failures, the likelihood as a function of success rate θ is proportional to $θ^s(1-θ)^f$. Constants that do not depend on θ can be ignored for comparing parameter values, but not when computing exact data probabilities.</p><p><b>Assumptions that matter:</b> the data are fixed when viewing likelihood as a function of θ, the sampling model must be specified, independence claims must be justified, and likelihood values need not sum to 1 over θ.</p>",
    "worked": {
      "problem": "A coin is flipped 5 times and gives 4 heads and 1 tail. Compare the likelihood at θ=0.5 and θ=0.8, ignoring the common ordering constant.",
      "skills": [
        "Bernoulli likelihood",
        "parameter comparison",
        "powers"
      ],
      "strategy": "The observed counts are fixed — plug each θ into $θ^4(1-θ)^1$ and compare.",
      "steps": [
        {
          "do": "Write the count likelihood",
          "result": "$L(θ) proportional to θ^4(1-θ)$",
          "why": "four heads contribute θ and one tail contributes 1-θ"
        },
        {
          "do": "Evaluate at 0.5",
          "result": "$L(0.5) proportional to 0.5^4*0.5$",
          "why": "substitute θ=0.5"
        },
        {
          "do": "Simplify first value",
          "result": "$0.5^5=0.03125$",
          "why": "multiply five halves"
        },
        {
          "do": "Evaluate at 0.8",
          "result": "$L(0.8) proportional to 0.8^4*0.2$",
          "why": "tail probability is 0.2"
        },
        {
          "do": "Simplify second value",
          "result": "$0.4096*0.2=0.08192$",
          "why": "0.8 to the fourth is 0.4096"
        },
        {
          "do": "Compare",
          "result": "$0.08192/0.03125=2.621$",
          "why": "the data are about 2.6 times as likely under θ=0.8"
        }
      ],
      "verify": "Both parameter values remain possible; likelihood compares support from these data, not posterior probability by itself.",
      "answer": "Ignoring the common constant, θ=0.8 has likelihood 0.08192 versus 0.03125 for θ=0.5.",
      "connects": "The likelihood is the data model turned around to score parameter values."
    },
    "practice": [
      {
        "problem": "For 3 successes and 2 failures, write the Bernoulli likelihood up to a constant and evaluate it at θ=0.6.",
        "steps": [
          {
            "do": "Write success factor",
            "result": "$θ^3$",
            "why": "three successes"
          },
          {
            "do": "Write failure factor",
            "result": "$(1-θ)^2$",
            "why": "two failures"
          },
          {
            "do": "Combine",
            "result": "$L(θ) proportional to θ^3(1-θ)^2$",
            "why": "independent factors multiply"
          },
          {
            "do": "Substitute θ=0.6",
            "result": "$0.6^3*0.4^2$",
            "why": "1-0.6 is 0.4"
          },
          {
            "do": "Compute",
            "result": "$0.216*0.16=0.03456$",
            "why": "multiply the powers"
          }
        ],
        "answer": "$L(θ) proportional to θ^3(1-θ)^2$ and $L(0.6) proportional to 0.03456$."
      },
      {
        "problem": "A die model says probability of rolling a six is θ. In 20 rolls, six appears 5 times. Compare likelihoods at θ=0.2 and θ=0.25 up to a constant.",
        "steps": [
          {
            "do": "Write likelihood",
            "result": "$θ^5(1-θ)^15$",
            "why": "five sixes and fifteen non-sixes"
          },
          {
            "do": "Evaluate θ=0.2",
            "result": "$0.2^5*0.8^15$",
            "why": "substitute first value"
          },
          {
            "do": "Approximate first",
            "result": "$0.00032*0.0352=0.0000113$",
            "why": "powers rounded"
          },
          {
            "do": "Evaluate θ=0.25",
            "result": "$0.25^5*0.75^15$",
            "why": "substitute second value"
          },
          {
            "do": "Approximate second",
            "result": "$0.0009766*0.01336=0.0000130$",
            "why": "powers rounded"
          }
        ],
        "answer": "θ=0.25 has the slightly larger likelihood, about $0.0000130$ versus $0.0000113$."
      },
      {
        "problem": "For independent observations with probabilities 0.9, 0.8, and 0.5 under a model, compute the likelihood and log-likelihood.",
        "steps": [
          {
            "do": "Multiply probabilities",
            "result": "$0.9*0.8*0.5$",
            "why": "independent observation probabilities multiply"
          },
          {
            "do": "Compute likelihood",
            "result": "$0.36$",
            "why": "0.9 times 0.8 times 0.5"
          },
          {
            "do": "Write log-likelihood",
            "result": "$log(0.9)+log(0.8)+log(0.5)$",
            "why": "log turns product into sum"
          },
          {
            "do": "Use approximations",
            "result": "$-0.105-0.223-0.693$",
            "why": "natural logs"
          },
          {
            "do": "Add",
            "result": "$-1.021$",
            "why": "sum the log terms"
          }
        ],
        "answer": "Likelihood is 0.36; log-likelihood is about -1.021."
      },
      {
        "problem": "Two models give likelihoods 0.03 and 0.12 for the same data. With equal priors, find posterior probabilities.",
        "steps": [
          {
            "do": "Write prior weights",
            "result": "$0.5*0.03$ and $0.5*0.12$",
            "why": "posterior weights use prior times likelihood"
          },
          {
            "do": "Compute weights",
            "result": "$0.015$ and $0.060$",
            "why": "multiply"
          },
          {
            "do": "Add weights",
            "result": "$0.075$",
            "why": "normalizer"
          },
          {
            "do": "Normalize model 1",
            "result": "$0.015/0.075=0.20$",
            "why": "divide by total"
          },
          {
            "do": "Normalize model 2",
            "result": "$0.060/0.075=0.80$",
            "why": "remaining probability"
          }
        ],
        "answer": "Posterior probabilities are 0.20 and 0.80."
      },
      {
        "problem": "For a Normal model with known sigma 2 and mean μ, one observation is x=7. Compare likelihoods at μ=5 and μ=8 using only the exponential distance factor $exp(- (x-μ)^2/(2 sigma^2))$.",
        "steps": [
          {
            "do": "Compute distance for μ=5",
            "result": "$7-5=2$",
            "why": "residual from the proposed mean"
          },
          {
            "do": "Compute exponent",
            "result": "$-2^2/(2*2^2)=-4/8=-0.5$",
            "why": "use sigma=2"
          },
          {
            "do": "Compute distance for μ=8",
            "result": "$7-8=-1$",
            "why": "second residual"
          },
          {
            "do": "Compute exponent",
            "result": "$-1^2/8=-0.125$",
            "why": "square the residual"
          },
          {
            "do": "Compare",
            "result": "$exp(-0.125)>exp(-0.5)$",
            "why": "less negative exponent gives larger likelihood"
          }
        ],
        "answer": "μ=8 has the larger likelihood for x=7."
      }
    ],
    "applications": [
      {
        "title": "Maximum likelihood estimation",
        "background": "Classical statistics often chooses the parameter that maximizes likelihood. Bayesian statistics uses the same likelihood, then combines it with a prior.",
        "numbers": "For 8 heads in 10 flips, the Bernoulli maximum likelihood estimate is $8/10=0.8$."
      },
      {
        "title": "Log-likelihood in training",
        "background": "ML systems usually sum log-likelihoods because products of many probabilities get tiny and hard to compute.",
        "numbers": "Three predicted true-label probabilities 0.7, 0.9, 0.8 give log-likelihood $log(0.7)+log(0.9)+log(0.8) approx -0.685$."
      },
      {
        "title": "Language models",
        "background": "A language model assigns probabilities to tokens. The likelihood of a sentence is the product of token probabilities under the model.",
        "numbers": "Token probabilities 0.10, 0.25, 0.40 give sentence likelihood $0.10*0.25*0.40=0.010$."
      },
      {
        "title": "Anomaly detection",
        "background": "Low likelihood under a fitted model can flag data that the model finds surprising.",
        "numbers": "If typical points have likelihood around 0.05 and a point has likelihood 0.0005, it is 100 times less supported by the model."
      },
      {
        "title": "Sensor calibration",
        "background": "Engineers compare calibration settings by how probable the observed sensor errors are under each setting.",
        "numbers": "If setting A gives error density 0.18 and setting B gives 0.06 for the same reading, the reading supports A by a likelihood ratio of 3."
      },
      {
        "title": "Model comparison",
        "background": "Likelihood ratios are a clean way to report how much the data favor one model before priors enter.",
        "numbers": "Likelihoods 0.004 and 0.001 produce a likelihood ratio of 4:1 in favor of the first model."
      }
    ],
    "applicationsClose": "Likelihood is evidence in model form: the data stay fixed while each parameter is asked how well it would have expected them.",
    "takeaways": [
      "A likelihood is $p(D|θ)$ viewed as a function of θ.",
      "Likelihoods compare parameter values but are not automatically probabilities over θ.",
      "Independent observations make likelihoods multiply and log-likelihoods add.",
      "Bayesian posteriors come from likelihood times prior, followed by normalization."
    ]
  },
  "math-20-04": {
    "id": "math-20-04",
    "title": "Posteriors",
    "tagline": "The posterior is the updated uncertainty you get after the prior and likelihood have both had their say.",
    "connections": {
      "buildsOn": [
        "Priors",
        "Likelihoods",
        "Bayes rule"
      ],
      "leadsTo": [
        "Conjugate priors",
        "Credible intervals",
        "Posterior predictive distributions"
      ],
      "usedWith": [
        "normalization",
        "expected value",
        "variance",
        "odds"
      ]
    },
    "motivation": "<p>You have now met the two voices in a Bayesian update. The prior says what was plausible before this dataset. The likelihood says what the data support. The posterior is what remains after those voices are combined honestly.</p><p>This is the distribution you use for decisions, intervals, predictions, and model comparison. It does not pretend the uncertainty vanished. It tells you how uncertainty changed.</p>",
    "definition": "<p>The <b>posterior</b> distribution is $p(θ|D)=p(D|θ)p(θ)/p(D)$. The numerator gives an unnormalized weight for each θ. The denominator $p(D)$ is the sum or integral of those weights over all θ, making the posterior a valid probability distribution.</p><p>For discrete hypotheses, compute weights $w_i=p(D|H_i)P(H_i)$ and normalize: $P(H_i|D)=w_i/(w_1+...+w_k)$. For continuous θ, the same idea uses area under a density instead of a finite sum.</p><p><b>Assumptions that matter:</b> posterior conclusions depend on both prior and likelihood, the normalizing constant must be finite and positive, and all conditioning is relative to the chosen model. A posterior is only as good as the assumptions that created it.</p>",
    "worked": {
      "problem": "Three hypotheses have priors 0.5, 0.3, 0.2 and likelihoods 0.2, 0.5, 0.1. Compute the posterior distribution.",
      "skills": [
        "posterior weights",
        "normalization",
        "discrete hypotheses"
      ],
      "strategy": "The weights are not probabilities yet — multiply, add, then divide each weight by the total.",
      "steps": [
        {
          "do": "Compute first weight",
          "result": "$0.5*0.2=0.10$",
          "why": "prior times likelihood"
        },
        {
          "do": "Compute second weight",
          "result": "$0.3*0.5=0.15$",
          "why": "prior times likelihood"
        },
        {
          "do": "Compute third weight",
          "result": "$0.2*0.1=0.02$",
          "why": "prior times likelihood"
        },
        {
          "do": "Add weights",
          "result": "$0.10+0.15+0.02=0.27$",
          "why": "normalizing constant"
        },
        {
          "do": "Normalize first",
          "result": "$0.10/0.27=0.370$",
          "why": "divide by total"
        },
        {
          "do": "Normalize second",
          "result": "$0.15/0.27=0.556$",
          "why": "divide by total"
        },
        {
          "do": "Normalize third",
          "result": "$0.02/0.27=0.074$",
          "why": "divide by total"
        }
      ],
      "verify": "The posterior probabilities add to 1 up to rounding: 0.370+0.556+0.074=1.000.",
      "answer": "$[0.370,0.556,0.074]$ approximately.",
      "connects": "The posterior is normalized evidence-weighted prior belief."
    },
    "practice": [
      {
        "problem": "Two hypotheses have priors 0.7 and 0.3 with likelihoods 0.4 and 0.8. Compute the posterior.",
        "steps": [
          {
            "do": "Weight H1",
            "result": "$0.7*0.4=0.28$",
            "why": "prior times likelihood"
          },
          {
            "do": "Weight H2",
            "result": "$0.3*0.8=0.24$",
            "why": "prior times likelihood"
          },
          {
            "do": "Add weights",
            "result": "$0.52$",
            "why": "normalizer"
          },
          {
            "do": "Normalize H1",
            "result": "$0.28/0.52=0.538$",
            "why": "divide by total"
          },
          {
            "do": "Normalize H2",
            "result": "$0.24/0.52=0.462$",
            "why": "posterior probabilities sum to 1"
          }
        ],
        "answer": "$P(H1|D)=0.538$, $P(H2|D)=0.462$."
      },
      {
        "problem": "A prior over θ=0,1,2 is $[0.2,0.5,0.3]$. Likelihoods are $[0.1,0.2,0.4]$. Compute posterior mean.",
        "steps": [
          {
            "do": "Compute weights",
            "result": "$[0.02,0.10,0.12]$",
            "why": "multiply prior by likelihood elementwise"
          },
          {
            "do": "Add weights",
            "result": "$0.24$",
            "why": "normalizer"
          },
          {
            "do": "Normalize",
            "result": "$[0.083,0.417,0.500]$",
            "why": "divide each weight by 0.24"
          },
          {
            "do": "Multiply by θ values",
            "result": "$0*0.083+1*0.417+2*0.500$",
            "why": "posterior mean formula"
          },
          {
            "do": "Add",
            "result": "$1.417$",
            "why": "sum weighted values"
          }
        ],
        "answer": "Posterior mean is about 1.417."
      },
      {
        "problem": "Prior odds for A versus B are 3:2. Data likelihood ratio A:B is 4:1. Find posterior odds and probability of A.",
        "steps": [
          {
            "do": "Convert prior odds",
            "result": "$3/2$",
            "why": "A divided by B"
          },
          {
            "do": "Multiply likelihood ratio",
            "result": "$(3/2)*4=6$",
            "why": "posterior odds equal prior odds times likelihood ratio"
          },
          {
            "do": "Write odds",
            "result": "$6:1$",
            "why": "A is six times B"
          },
          {
            "do": "Convert to probability",
            "result": "$6/(6+1)$",
            "why": "odds a:b means probability a/(a+b)"
          },
          {
            "do": "Compute",
            "result": "$6/7=0.857$",
            "why": "divide"
          }
        ],
        "answer": "Posterior odds are 6:1 and $P(A|D)=0.857$."
      },
      {
        "problem": "A Beta(2,3) prior sees 4 successes and 1 failure. Use the update rule to find posterior alpha, beta, and mean.",
        "steps": [
          {
            "do": "Update alpha",
            "result": "$2+4=6$",
            "why": "successes add to alpha"
          },
          {
            "do": "Update beta",
            "result": "$3+1=4$",
            "why": "failures add to beta"
          },
          {
            "do": "Write posterior",
            "result": "$Beta(6,4)$",
            "why": "same family after Bernoulli data"
          },
          {
            "do": "Compute total",
            "result": "$6+4=10$",
            "why": "denominator of mean"
          },
          {
            "do": "Compute mean",
            "result": "$6/10=0.60$",
            "why": "Beta mean"
          }
        ],
        "answer": "Posterior is Beta(6,4) with mean 0.60."
      },
      {
        "problem": "A posterior over θ has probabilities 0.25 at θ=1, 0.50 at θ=2, and 0.25 at θ=5. Compute posterior mean and variance.",
        "steps": [
          {
            "do": "Compute mean",
            "result": "$1*0.25+2*0.50+5*0.25=2.50$",
            "why": "weighted average"
          },
          {
            "do": "Compute squared deviation for 1",
            "result": "$(1-2.5)^2=2.25$",
            "why": "distance squared"
          },
          {
            "do": "Compute squared deviation for 2",
            "result": "$(2-2.5)^2=0.25$",
            "why": "distance squared"
          },
          {
            "do": "Compute squared deviation for 5",
            "result": "$(5-2.5)^2=6.25$",
            "why": "distance squared"
          },
          {
            "do": "Weight and add",
            "result": "$0.25*2.25+0.50*0.25+0.25*6.25=2.25$",
            "why": "posterior variance"
          }
        ],
        "answer": "Posterior mean is 2.50 and variance is 2.25."
      }
    ],
    "applications": [
      {
        "title": "Decision thresholds",
        "background": "Posteriors support decisions because they are actual probabilities after evidence. A team can set a threshold before acting.",
        "numbers": "If posterior defect probability is 0.82 and the action threshold is 0.80, the Bayesian rule triggers action."
      },
      {
        "title": "Uncertainty after an A/B test",
        "background": "Instead of only asking for a p-value, Bayesian analysis keeps a distribution over each conversion rate.",
        "numbers": "If 95 percent of posterior samples have B>A, then an estimated $P(B>A)=0.95$ is directly decision-facing."
      },
      {
        "title": "Personalized ranking",
        "background": "A recommendation system can maintain a posterior over a user's preference for a category and update after clicks.",
        "numbers": "Prior Beta(3,7) plus 2 clicks and 3 skips gives Beta(5,10), posterior mean $5/15=0.333$."
      },
      {
        "title": "Reliability estimation",
        "background": "After observing failures, posterior distributions combine old engineering knowledge with new test data.",
        "numbers": "Prior Beta(1,999) plus 2 failures in 1000 tests gives Beta(3,1997), mean $3/2000=0.0015$."
      },
      {
        "title": "Forecasting demand",
        "background": "Posterior distributions represent uncertainty in demand parameters rather than a single best guess.",
        "numbers": "If posterior demand mean is 120 units with standard deviation 15, a rough 2-sigma planning range is 90 to 150 units."
      },
      {
        "title": "Model monitoring",
        "background": "Posteriors can track whether a live metric has drifted beyond an acceptable region.",
        "numbers": "If posterior probability that error rate exceeds 5 percent is 0.93, an alert threshold of 0.90 would fire."
      }
    ],
    "applicationsClose": "The posterior is the Bayesian workbench: every later interval, prediction, and decision is shaped by this updated distribution.",
    "takeaways": [
      "Posterior equals normalized prior times likelihood.",
      "Compute unnormalized weights first, then divide by their sum or integral.",
      "Posterior means, variances, and probabilities summarize updated uncertainty.",
      "A posterior is conditional on the model assumptions used to build it."
    ]
  },
  "math-20-05": {
    "id": "math-20-05",
    "title": "Conjugate priors",
    "tagline": "Conjugacy is the rare algebraic kindness where updating changes parameters but keeps the same distribution family.",
    "connections": {
      "buildsOn": [
        "Priors",
        "Likelihoods",
        "Posteriors"
      ],
      "leadsTo": [
        "The Beta–Binomial model",
        "The Normal–Normal model",
        "Posterior predictive distributions"
      ],
      "usedWith": [
        "exponential families",
        "sufficient statistics",
        "Beta distributions",
        "Normal distributions"
      ]
    },
    "motivation": "<p>Bayesian updating can involve difficult integrals, but sometimes the algebra smiles. You start with one distribution family, observe data, and the posterior stays in that same family.</p><p>That pattern is called <b>conjugacy</b>. It matters because it turns updating into adding counts, sums, or precisions. You still learn from data; you just do the bookkeeping cleanly.</p>",
    "definition": "<p>A prior family is <b>conjugate</b> to a likelihood family when the posterior belongs to the same family as the prior. Symbolically, if prior $p(θ)$ is in family F and likelihood $p(D|θ)$ has the matching form, then posterior $p(θ|D)$ is also in family F with updated parameters.</p><p>For Bernoulli data, a Beta prior is conjugate because $θ^(alpha-1)(1-θ)^(beta-1)$ times $θ^s(1-θ)^f$ becomes $θ^(alpha+s-1)(1-θ)^(beta+f-1)$. The exponents simply add.</p><p><b>Assumptions that matter:</b> conjugacy depends on the likelihood model, parameters must stay in their valid ranges, and computational convenience does not make the model true. It is an algebraic match, not a guarantee of realism.</p>",
    "worked": {
      "problem": "A Bernoulli rate has prior Beta(3,7). You observe 12 successes and 8 failures. Find the conjugate posterior and its mean.",
      "skills": [
        "conjugate updating",
        "Beta prior",
        "posterior mean"
      ],
      "strategy": "Conjugacy turns the update into adding successes to alpha and failures to beta.",
      "steps": [
        {
          "do": "Write prior",
          "result": "$Beta(3,7)$",
          "why": "alpha is 3 and beta is 7"
        },
        {
          "do": "Add successes to alpha",
          "result": "$3+12=15$",
          "why": "Bernoulli successes increase alpha"
        },
        {
          "do": "Add failures to beta",
          "result": "$7+8=15$",
          "why": "Bernoulli failures increase beta"
        },
        {
          "do": "Write posterior",
          "result": "$Beta(15,15)$",
          "why": "same family after updating"
        },
        {
          "do": "Compute total",
          "result": "$15+15=30$",
          "why": "mean denominator"
        },
        {
          "do": "Compute mean",
          "result": "$15/30=0.50$",
          "why": "Beta mean is alpha over total"
        }
      ],
      "verify": "The posterior mean lands at 0.50 because the data pulled the prior center upward from 0.30.",
      "answer": "Posterior is Beta(15,15), with mean 0.50.",
      "connects": "Conjugacy keeps the family fixed while sufficient statistics update the parameters."
    },
    "practice": [
      {
        "problem": "Update Beta(1,1) after 6 successes and 4 failures.",
        "steps": [
          {
            "do": "Add successes",
            "result": "$1+6=7$",
            "why": "successes update alpha"
          },
          {
            "do": "Add failures",
            "result": "$1+4=5$",
            "why": "failures update beta"
          },
          {
            "do": "Write posterior",
            "result": "$Beta(7,5)$",
            "why": "same family"
          },
          {
            "do": "Compute mean",
            "result": "$7/(7+5)=7/12=0.583$",
            "why": "Beta mean"
          },
          {
            "do": "Interpret",
            "result": "above 0.5",
            "why": "more successes than failures"
          }
        ],
        "answer": "Posterior Beta(7,5), mean about 0.583."
      },
      {
        "problem": "A Poisson rate has Gamma prior with shape 2 and rate 1. Observed counts are 3, 0, and 2 over unit exposures. Update shape and rate.",
        "steps": [
          {
            "do": "Sum counts",
            "result": "$3+0+2=5$",
            "why": "Poisson counts add to shape"
          },
          {
            "do": "Count exposures",
            "result": "$3$",
            "why": "three unit observations"
          },
          {
            "do": "Update shape",
            "result": "$2+5=7$",
            "why": "prior shape plus total count"
          },
          {
            "do": "Update rate",
            "result": "$1+3=4$",
            "why": "prior rate plus total exposure"
          },
          {
            "do": "Compute posterior mean",
            "result": "$7/4=1.75$",
            "why": "Gamma mean is shape over rate"
          }
        ],
        "answer": "Posterior Gamma shape 7, rate 4, mean 1.75."
      },
      {
        "problem": "A Normal mean has known variance. Prior mean is 10 with precision 2; data mean is 14 with precision contribution 6. Compute posterior mean.",
        "steps": [
          {
            "do": "Add precisions",
            "result": "$2+6=8$",
            "why": "Normal conjugacy weights by precision"
          },
          {
            "do": "Compute prior weighted contribution",
            "result": "$2*10=20$",
            "why": "precision times mean"
          },
          {
            "do": "Compute data weighted contribution",
            "result": "$6*14=84$",
            "why": "data precision times mean"
          },
          {
            "do": "Add contributions",
            "result": "$20+84=104$",
            "why": "posterior numerator"
          },
          {
            "do": "Divide by total precision",
            "result": "$104/8=13$",
            "why": "posterior mean"
          }
        ],
        "answer": "Posterior mean is 13."
      },
      {
        "problem": "A Dirichlet prior over three categories is (2,2,2). Observed counts are (5,1,4). Find posterior parameters.",
        "steps": [
          {
            "do": "Add first category",
            "result": "$2+5=7$",
            "why": "category counts update matching parameter"
          },
          {
            "do": "Add second category",
            "result": "$2+1=3$",
            "why": "same rule"
          },
          {
            "do": "Add third category",
            "result": "$2+4=6$",
            "why": "same rule"
          },
          {
            "do": "Write posterior",
            "result": "Dirichlet(7,3,6)",
            "why": "same family"
          },
          {
            "do": "Compute posterior mean for category 1",
            "result": "$7/(7+3+6)=7/16=0.438$",
            "why": "Dirichlet mean"
          }
        ],
        "answer": "Posterior is Dirichlet(7,3,6); first category mean is 0.438."
      },
      {
        "problem": "A Beta(4,6) prior sees 0 successes and 10 failures. Find posterior mean and compare to sample rate.",
        "steps": [
          {
            "do": "Update alpha",
            "result": "$4+0=4$",
            "why": "no successes added"
          },
          {
            "do": "Update beta",
            "result": "$6+10=16$",
            "why": "failures add to beta"
          },
          {
            "do": "Write posterior",
            "result": "$Beta(4,16)$",
            "why": "conjugate update"
          },
          {
            "do": "Compute posterior mean",
            "result": "$4/20=0.20$",
            "why": "Beta mean"
          },
          {
            "do": "Compare sample rate",
            "result": "$0/10=0$",
            "why": "prior prevents collapse to zero"
          }
        ],
        "answer": "Posterior mean is 0.20, while the sample rate is 0."
      }
    ],
    "applications": [
      {
        "title": "Online click-rate updates",
        "background": "Conjugacy lets production systems update rates with counts instead of expensive sampling.",
        "numbers": "Beta(2,98) plus 12 clicks and 188 non-clicks becomes Beta(14,286), mean $14/300=0.0467$."
      },
      {
        "title": "Multiclass text models",
        "background": "Naive Bayes often uses Dirichlet-multinomial conjugacy to smooth word probabilities.",
        "numbers": "Prior counts (1,1,1) plus word counts (10,4,0) gives posterior (11,5,1), so the unseen word still has mean $1/17$."
      },
      {
        "title": "Queue arrival rates",
        "background": "Poisson arrivals with Gamma priors model calls, requests, or defects when counts arrive over exposure time.",
        "numbers": "Gamma(3,2) plus 9 arrivals in 4 hours gives Gamma(12,6), mean rate $12/6=2$ per hour."
      },
      {
        "title": "Gaussian measurement fusion",
        "background": "Normal-Normal conjugacy underlies simple sensor fusion when variances are known.",
        "numbers": "Prior mean 0 precision 1 and sensor mean 6 precision 2 give posterior mean $(0+12)/3=4$."
      },
      {
        "title": "Fast dashboards",
        "background": "Conjugate updates are useful when dashboards must refresh uncertainty quickly from aggregated counts.",
        "numbers": "A conversion prior Beta(50,950) plus 7 conversions in 100 visits gives Beta(57,1043), mean $57/1100=0.0518$."
      },
      {
        "title": "Bayesian bandits",
        "background": "Bandit algorithms often use conjugate posteriors so each arm can update after rewards.",
        "numbers": "Arm prior Beta(1,1), after 3 wins and 2 losses, becomes Beta(4,3), mean $4/7=0.571$."
      }
    ],
    "applicationsClose": "Conjugacy is not the whole of Bayesian statistics, but it is a beautiful training ground: it lets the update be visible in the arithmetic.",
    "takeaways": [
      "A conjugate prior keeps the posterior in the same distribution family.",
      "For Beta-Bernoulli updates, successes add to alpha and failures add to beta.",
      "Conjugacy works because likelihood factors match prior algebra.",
      "Convenience is helpful, but the likelihood assumptions still need to fit the problem."
    ]
  },
  "math-20-06": {
    "id": "math-20-06",
    "title": "The Beta–Binomial model",
    "tagline": "The Beta-Binomial model is Bayesian counting for yes-or-no outcomes, with uncertainty that shrinks as evidence accumulates.",
    "connections": {
      "buildsOn": [
        "Conjugate priors",
        "Bernoulli trials",
        "Binomial coefficients"
      ],
      "leadsTo": [
        "Credible intervals",
        "Posterior predictive distributions",
        "Bayesian bandits"
      ],
      "usedWith": [
        "Beta distributions",
        "Binomial distributions",
        "proportions",
        "sample means"
      ]
    },
    "motivation": "<p>Many ML and product questions are yes-or-no: click or no click, convert or not, defect or not, pass or fail. A plain sample rate is useful, but it can be jumpy when the sample is small.</p><p>The Beta-Binomial model gives a calm update for an unknown probability θ. The Beta prior supplies starting counts, and Binomial data add observed successes and failures.</p>",
    "definition": "<p>In the <b>Beta-Binomial model</b>, θ is an unknown probability of success. The prior is $θ ~ Beta(alpha,beta)$. Given θ, data contain s successes and f failures from Bernoulli or Binomial trials. The posterior is $Beta(alpha+s,beta+f)$.</p><p>The posterior mean is $(alpha+s)/(alpha+beta+s+f)$. This is a weighted compromise between the prior mean and the sample proportion. The posterior predictive probability of success on the next trial is the same posterior mean.</p><p><b>Assumptions that matter:</b> trials are conditionally independent given θ, the success probability is stable across trials, alpha and beta are positive, and success must be defined consistently before counting.</p>",
    "worked": {
      "problem": "A feature has prior Beta(2,8). In 20 users, 7 click and 13 do not. Find posterior parameters, posterior mean, and next-click predictive probability.",
      "skills": [
        "Beta-Binomial update",
        "posterior mean",
        "prediction"
      ],
      "strategy": "Treat the prior as starting counts, then add observed clicks and non-clicks.",
      "steps": [
        {
          "do": "Update alpha",
          "result": "$2+7=9$",
          "why": "clicks are successes"
        },
        {
          "do": "Update beta",
          "result": "$8+13=21$",
          "why": "non-clicks are failures"
        },
        {
          "do": "Write posterior",
          "result": "$Beta(9,21)$",
          "why": "conjugate update"
        },
        {
          "do": "Compute total",
          "result": "$9+21=30$",
          "why": "posterior effective count"
        },
        {
          "do": "Compute posterior mean",
          "result": "$9/30=0.30$",
          "why": "mean of Beta posterior"
        },
        {
          "do": "State predictive probability",
          "result": "$0.30$",
          "why": "next success probability equals posterior mean"
        }
      ],
      "verify": "The raw click rate is 7/20=0.35, but the prior mean 0.20 pulls the posterior mean to 0.30.",
      "answer": "Posterior Beta(9,21); posterior mean and next-click predictive probability are 0.30.",
      "connects": "The Beta-Binomial model turns binary data into updated uncertainty about a rate."
    },
    "practice": [
      {
        "problem": "Prior Beta(1,1), data 8 successes and 2 failures. Find posterior and mean.",
        "steps": [
          {
            "do": "Update alpha",
            "result": "$1+8=9$",
            "why": "add successes"
          },
          {
            "do": "Update beta",
            "result": "$1+2=3$",
            "why": "add failures"
          },
          {
            "do": "Write posterior",
            "result": "$Beta(9,3)$",
            "why": "same family"
          },
          {
            "do": "Compute total",
            "result": "$12$",
            "why": "9+3"
          },
          {
            "do": "Compute mean",
            "result": "$9/12=0.75$",
            "why": "posterior average rate"
          }
        ],
        "answer": "Posterior Beta(9,3), mean 0.75."
      },
      {
        "problem": "Prior Beta(5,5), data 0 successes and 10 failures. Find posterior mean.",
        "steps": [
          {
            "do": "Update alpha",
            "result": "$5+0=5$",
            "why": "no successes"
          },
          {
            "do": "Update beta",
            "result": "$5+10=15$",
            "why": "add failures"
          },
          {
            "do": "Posterior",
            "result": "$Beta(5,15)$",
            "why": "conjugate update"
          },
          {
            "do": "Total",
            "result": "$20$",
            "why": "5+15"
          },
          {
            "do": "Mean",
            "result": "$5/20=0.25$",
            "why": "not zero because of prior"
          }
        ],
        "answer": "Posterior mean is 0.25."
      },
      {
        "problem": "A posterior is Beta(12,18). Compute mean and a rough variance using $ab/((a+b)^2(a+b+1))$.",
        "steps": [
          {
            "do": "Compute total",
            "result": "$12+18=30$",
            "why": "sum parameters"
          },
          {
            "do": "Compute mean",
            "result": "$12/30=0.40$",
            "why": "Beta mean"
          },
          {
            "do": "Compute numerator",
            "result": "$12*18=216$",
            "why": "variance numerator"
          },
          {
            "do": "Compute denominator",
            "result": "$30^2*31=27900$",
            "why": "variance denominator"
          },
          {
            "do": "Divide",
            "result": "$216/27900=0.00774$",
            "why": "rough posterior variance"
          }
        ],
        "answer": "Mean 0.40 and variance about 0.00774."
      },
      {
        "problem": "Two ads have posteriors Beta(9,21) and Beta(15,35). Compare their posterior means.",
        "steps": [
          {
            "do": "Mean ad A",
            "result": "$9/(9+21)=9/30=0.30$",
            "why": "Beta mean"
          },
          {
            "do": "Mean ad B",
            "result": "$15/(15+35)=15/50=0.30$",
            "why": "Beta mean"
          },
          {
            "do": "Compare totals",
            "result": "$30$ versus $50$",
            "why": "posterior strength differs"
          },
          {
            "do": "Interpret equal means",
            "result": "same center",
            "why": "both predict 30 percent"
          },
          {
            "do": "Interpret strength",
            "result": "B is more concentrated",
            "why": "more effective observations"
          }
        ],
        "answer": "Both means are 0.30; ad B has stronger evidence."
      },
      {
        "problem": "Prior Beta(3,7). How many successes in 10 trials are needed for posterior mean 0.40?",
        "steps": [
          {
            "do": "Let successes be s",
            "result": "failures are $10-s$",
            "why": "ten total trials"
          },
          {
            "do": "Write posterior alpha",
            "result": "$3+s$",
            "why": "add successes"
          },
          {
            "do": "Write posterior total",
            "result": "$3+7+10=20$",
            "why": "prior plus data total"
          },
          {
            "do": "Set mean",
            "result": "$(3+s)/20=0.40$",
            "why": "target posterior mean"
          },
          {
            "do": "Solve",
            "result": "$3+s=8$, so $s=5$",
            "why": "multiply by 20 and subtract 3"
          }
        ],
        "answer": "You need 5 successes in 10 trials."
      }
    ],
    "applications": [
      {
        "title": "Click-through-rate estimation",
        "background": "CTR is a natural binary rate, and sparse items benefit from prior smoothing.",
        "numbers": "Prior Beta(5,95) plus 3 clicks in 20 impressions gives Beta(8,112), mean $8/120=0.0667$."
      },
      {
        "title": "A/B conversion rates",
        "background": "Each variant can have its own Beta posterior over conversion probability.",
        "numbers": "Variant A Beta(31,969) has mean 0.031; variant B Beta(45,955) has mean 0.045."
      },
      {
        "title": "Bayesian bandits",
        "background": "Thompson sampling often samples from each arm's Beta posterior to balance exploration and exploitation.",
        "numbers": "Arm with Beta(4,6) has mean 0.40; arm with Beta(8,12) also has mean 0.40 but less uncertainty."
      },
      {
        "title": "Defect-rate monitoring",
        "background": "Manufacturing defect counts are binary and can be updated as batches arrive.",
        "numbers": "Prior Beta(2,198) plus 1 defect in 100 parts gives Beta(3,297), mean $0.010$."
      },
      {
        "title": "Email open rates",
        "background": "Marketing systems estimate open probability for campaigns while avoiding extreme early estimates.",
        "numbers": "With Beta(10,90), 6 opens in 50 sends gives Beta(16,134), mean $16/150=0.1067$."
      },
      {
        "title": "Classifier accuracy",
        "background": "Accuracy on a validation set is a binomial success rate when examples are fixed and scored once.",
        "numbers": "Prior Beta(1,1), 87 correct out of 100 gives Beta(88,14), posterior mean $88/102=0.863$."
      }
    ],
    "applicationsClose": "From clicks to defects to accuracy, the Beta-Binomial model teaches the same lesson: count evidence, keep uncertainty, and let confidence grow with data.",
    "takeaways": [
      "Beta prior plus Binomial data gives a Beta posterior.",
      "Successes add to alpha; failures add to beta.",
      "The posterior mean balances prior mean and sample proportion.",
      "The next-trial predictive probability equals the posterior mean."
    ]
  },
  "math-20-07": {
    "id": "math-20-07",
    "title": "The Normal–Normal model",
    "tagline": "The Normal-Normal model updates a noisy average by weighting prior belief and data by precision.",
    "connections": {
      "buildsOn": [
        "Conjugate priors",
        "Normal distributions",
        "weighted averages"
      ],
      "leadsTo": [
        "Noninformative priors",
        "Credible intervals",
        "Bayesian linear regression"
      ],
      "usedWith": [
        "variance",
        "precision",
        "sample means",
        "Gaussian models"
      ]
    },
    "motivation": "<p>Suppose you are estimating an average delivery time, model weight, or sensor bias. A few noisy measurements should move your belief, but not all measurements deserve equal trust.</p><p>The Normal-Normal model gives a clean rule: means are averaged using <b>precision</b>, which is inverse variance. More precise information gets more weight.</p>",
    "definition": "<p>In the Normal-Normal model, observations have known variance sigma2 and unknown mean μ. A Normal prior $μ ~ Normal(m0,v0)$ combines with n observations whose sample mean is xbar. The posterior for μ is Normal with precision $1/vn = 1/v0 + n/sigma2$ and mean $mn = vn(m0/v0 + n*xbar/sigma2)$.</p><p>This is a weighted average. The prior contributes precision $1/v0$; the data contribute precision $n/sigma2$. The posterior variance shrinks because precisions add.</p><p><b>Assumptions that matter:</b> observations are conditionally independent Normal draws, observation variance is known or treated as known, the prior is Normal, and precision means inverse variance, not ordinary confidence as a feeling.</p>",
    "worked": {
      "problem": "Prior for μ is Normal mean 10, variance 4. Observations have known variance 9, with n=9 and sample mean 13. Find posterior mean and variance.",
      "skills": [
        "precision weighting",
        "Normal conjugacy",
        "posterior variance"
      ],
      "strategy": "Convert variances to precisions, add them, then compute the precision-weighted mean.",
      "steps": [
        {
          "do": "Compute prior precision",
          "result": "$1/4=0.25$",
          "why": "precision is inverse variance"
        },
        {
          "do": "Compute data precision",
          "result": "$9/9=1$",
          "why": "n divided by observation variance"
        },
        {
          "do": "Add precisions",
          "result": "$0.25+1=1.25$",
          "why": "posterior precision"
        },
        {
          "do": "Compute posterior variance",
          "result": "$1/1.25=0.8$",
          "why": "variance is inverse precision"
        },
        {
          "do": "Compute weighted numerator",
          "result": "$10/4 + 9*13/9 = 2.5+13=15.5$",
          "why": "prior and data precision contributions"
        },
        {
          "do": "Compute posterior mean",
          "result": "$15.5/1.25=12.4$",
          "why": "divide numerator by total precision"
        }
      ],
      "verify": "The posterior mean 12.4 lies between the prior mean 10 and data mean 13, closer to the data because data precision is larger.",
      "answer": "Posterior is Normal with mean 12.4 and variance 0.8.",
      "connects": "Normal-Normal updating is precision-weighted averaging with shrinking variance."
    },
    "practice": [
      {
        "problem": "Prior mean 0 variance 1; one observation x=2 with variance 1. Find posterior mean and variance.",
        "steps": [
          {
            "do": "Prior precision",
            "result": "$1/1=1$",
            "why": "inverse variance"
          },
          {
            "do": "Data precision",
            "result": "$1/1=1$",
            "why": "one observation"
          },
          {
            "do": "Posterior precision",
            "result": "$2$",
            "why": "add precisions"
          },
          {
            "do": "Posterior variance",
            "result": "$1/2=0.5$",
            "why": "invert precision"
          },
          {
            "do": "Posterior mean",
            "result": "$(0*1+2*1)/2=1$",
            "why": "equal precision average"
          }
        ],
        "answer": "Posterior mean 1, variance 0.5."
      },
      {
        "problem": "Prior mean 5 variance 4; n=4 observations have mean 9 and observation variance 4. Find posterior mean.",
        "steps": [
          {
            "do": "Prior precision",
            "result": "$1/4=0.25$",
            "why": "inverse prior variance"
          },
          {
            "do": "Data precision",
            "result": "$4/4=1$",
            "why": "n over observation variance"
          },
          {
            "do": "Total precision",
            "result": "$1.25$",
            "why": "add"
          },
          {
            "do": "Weighted numerator",
            "result": "$5/4 + 4*9/4=1.25+9=10.25$",
            "why": "prior plus data contributions"
          },
          {
            "do": "Divide",
            "result": "$10.25/1.25=8.2$",
            "why": "posterior mean"
          }
        ],
        "answer": "Posterior mean is 8.2."
      },
      {
        "problem": "A posterior precision is 5. What is posterior variance? If mean is 3, give a rough 2-standard-deviation interval.",
        "steps": [
          {
            "do": "Invert precision",
            "result": "$1/5=0.2$",
            "why": "variance is inverse precision"
          },
          {
            "do": "Compute standard deviation",
            "result": "$sqrt(0.2)=0.447$",
            "why": "square root of variance"
          },
          {
            "do": "Double standard deviation",
            "result": "$2*0.447=0.894$",
            "why": "rough 95 percent scale"
          },
          {
            "do": "Lower bound",
            "result": "$3-0.894=2.106$",
            "why": "subtract"
          },
          {
            "do": "Upper bound",
            "result": "$3+0.894=3.894$",
            "why": "add"
          }
        ],
        "answer": "Variance 0.2; rough interval 2.106 to 3.894."
      },
      {
        "problem": "Prior mean 100 variance 25. Data mean 112 has data precision 4. Find posterior mean.",
        "steps": [
          {
            "do": "Prior precision",
            "result": "$1/25=0.04$",
            "why": "inverse variance"
          },
          {
            "do": "Total precision",
            "result": "$0.04+4=4.04$",
            "why": "add data precision"
          },
          {
            "do": "Prior contribution",
            "result": "$100*0.04=4$",
            "why": "mean times precision"
          },
          {
            "do": "Data contribution",
            "result": "$112*4=448$",
            "why": "mean times precision"
          },
          {
            "do": "Divide",
            "result": "$(4+448)/4.04=111.881$",
            "why": "posterior mean"
          }
        ],
        "answer": "Posterior mean is about 111.881."
      },
      {
        "problem": "Two independent Normal information sources estimate μ. Source A mean 6 variance 4; source B mean 10 variance 1. With a flat prior approximation, combine them by precision.",
        "steps": [
          {
            "do": "Precision A",
            "result": "$1/4=0.25$",
            "why": "inverse variance"
          },
          {
            "do": "Precision B",
            "result": "$1/1=1$",
            "why": "inverse variance"
          },
          {
            "do": "Total precision",
            "result": "$1.25$",
            "why": "add"
          },
          {
            "do": "Weighted numerator",
            "result": "$6*0.25+10*1=1.5+10=11.5$",
            "why": "precision-weighted sum"
          },
          {
            "do": "Combined mean",
            "result": "$11.5/1.25=9.2$",
            "why": "divide by total precision"
          }
        ],
        "answer": "Combined mean is 9.2."
      }
    ],
    "applications": [
      {
        "title": "Sensor averaging",
        "background": "Sensors with lower variance should count more. Normal-Normal updating is the algebra behind that trust weighting.",
        "numbers": "Prior mean 20 variance 4 and sensor mean 23 variance 1 combine to mean $(20/4+23/1)/(0.25+1)=22.4$."
      },
      {
        "title": "Online metric smoothing",
        "background": "A noisy daily metric can be updated from yesterday's posterior and today's measurements.",
        "numbers": "Prior variance 9 and daily mean variance 1 gives total precision $1/9+1=1.111$, posterior variance about 0.9."
      },
      {
        "title": "Model weight estimates",
        "background": "Bayesian linear models use Gaussian priors to shrink coefficients toward plausible values.",
        "numbers": "Prior weight 0 variance 1 and data estimate 3 variance 0.25 combine to mean $(0+12)/(1+4)=2.4$."
      },
      {
        "title": "Experiment measurement error",
        "background": "When an experiment result has a known standard error, Normal updating can combine it with historical belief.",
        "numbers": "Prior lift 1 percent variance 4 and estimate 5 percent variance 1 gives posterior mean $(1/4+5)/(1.25)=4.2 percent."
      },
      {
        "title": "Kalman filtering",
        "background": "The scalar Kalman filter is a repeated Normal-Normal update for state estimates over time.",
        "numbers": "Prediction variance 4 and measurement variance 1 gives posterior variance $1/(1/4+1)=0.8$."
      },
      {
        "title": "Human rating aggregation",
        "background": "Ratings can be modeled as noisy measurements of latent quality, with prior quality preventing overreaction to one review.",
        "numbers": "Prior quality 3.5 variance 1 and 4 reviews mean 4.5 with rating variance 1 gives data precision 4 and posterior mean $(3.5+18)/5=4.3$."
      }
    ],
    "applicationsClose": "The Normal-Normal model is a beautiful reminder that uncertainty has units: variance controls how strongly each source pulls the posterior mean.",
    "takeaways": [
      "Normal prior plus Normal likelihood for a mean gives a Normal posterior.",
      "Precision is inverse variance, and precisions add.",
      "The posterior mean is a precision-weighted average of prior mean and data mean.",
      "Posterior variance shrinks as more precise data arrive."
    ]
  },
  "math-20-08": {
    "id": "math-20-08",
    "title": "Noninformative priors",
    "tagline": "A noninformative prior tries to step lightly, while still admitting that every analysis starts somewhere.",
    "connections": {
      "buildsOn": [
        "Priors",
        "Posteriors",
        "The Normal–Normal model"
      ],
      "leadsTo": [
        "Credible intervals",
        "Posterior predictive distributions",
        "Bayesian workflow"
      ],
      "usedWith": [
        "uniform distributions",
        "Jeffreys priors",
        "improper integrals",
        "invariance"
      ]
    },
    "motivation": "<p>Sometimes you want the data to speak as loudly as possible. That desire leads to broad, weak, or noninformative priors. The phrase sounds like no assumptions, but that is too strong.</p><p>A noninformative prior is better understood as a careful attempt to add little information on a chosen scale. The scale matters. Flat in θ is not the same as flat in log θ.</p>",
    "definition": "<p>A <b>noninformative prior</b> is a prior intended to contribute minimal information relative to the likelihood. Examples include a uniform prior on a bounded probability θ, a very wide Normal prior for a location parameter, and certain improper priors whose total area is infinite but can still lead to a proper posterior.</p><p>For a Bernoulli rate, Beta(1,1) is uniform on θ. Jeffreys prior Beta(0.5,0.5) is invariant under smooth reparameterization and puts more mass near 0 and 1. Neither is magic; each expresses a different notion of being neutral.</p><p><b>Assumptions that matter:</b> improper priors require checking that the posterior is proper, flatness depends on parameterization, and weak priors can still influence small datasets. Noninformative does not mean assumption-free.</p>",
    "worked": {
      "problem": "Compare the posterior means after 8 successes and 2 failures using Beta(1,1) and Jeffreys Beta(0.5,0.5) priors.",
      "skills": [
        "weak priors",
        "Beta updates",
        "posterior comparison"
      ],
      "strategy": "Both priors are weak — update each by adding the same successes and failures, then compare means.",
      "steps": [
        {
          "do": "Update uniform alpha",
          "result": "$1+8=9$",
          "why": "successes add to alpha"
        },
        {
          "do": "Update uniform beta",
          "result": "$1+2=3$",
          "why": "failures add to beta"
        },
        {
          "do": "Compute uniform posterior mean",
          "result": "$9/(9+3)=0.75$",
          "why": "Beta mean"
        },
        {
          "do": "Update Jeffreys alpha",
          "result": "$0.5+8=8.5$",
          "why": "successes add to alpha"
        },
        {
          "do": "Update Jeffreys beta",
          "result": "$0.5+2=2.5$",
          "why": "failures add to beta"
        },
        {
          "do": "Compute Jeffreys posterior mean",
          "result": "$8.5/11=0.773$",
          "why": "total is 11"
        }
      ],
      "verify": "Both answers are near the sample rate 0.8 because the dataset has 10 observations and the priors are weak.",
      "answer": "Uniform gives 0.750; Jeffreys gives about 0.773.",
      "connects": "Noninformative priors can be close but not identical, especially with small samples."
    },
    "practice": [
      {
        "problem": "With Beta(1,1), observe 0 successes and 0 failures. What is the prior mean and why is it weak?",
        "steps": [
          {
            "do": "Compute total",
            "result": "$1+1=2$",
            "why": "prior strength"
          },
          {
            "do": "Compute mean",
            "result": "$1/2=0.5$",
            "why": "Beta mean"
          },
          {
            "do": "Identify successes",
            "result": "$1$",
            "why": "pseudo-success count"
          },
          {
            "do": "Identify failures",
            "result": "$1$",
            "why": "pseudo-failure count"
          },
          {
            "do": "Interpret",
            "result": "only two pseudo-counts",
            "why": "small strength is easy to overwhelm"
          }
        ],
        "answer": "Mean 0.5, weak strength 2."
      },
      {
        "problem": "Use Beta(0.5,0.5) with 0 successes and 4 failures. Find posterior mean.",
        "steps": [
          {
            "do": "Update alpha",
            "result": "$0.5+0=0.5$",
            "why": "no successes"
          },
          {
            "do": "Update beta",
            "result": "$0.5+4=4.5$",
            "why": "add failures"
          },
          {
            "do": "Total",
            "result": "$5$",
            "why": "0.5+4.5"
          },
          {
            "do": "Mean",
            "result": "$0.5/5=0.10$",
            "why": "Beta mean"
          },
          {
            "do": "Compare sample rate",
            "result": "$0/4=0$",
            "why": "prior keeps mean above zero"
          }
        ],
        "answer": "Posterior mean is 0.10."
      },
      {
        "problem": "A wide Normal prior has mean 0 and variance 10000. One measurement has mean 7 and variance 4. Approximate posterior mean.",
        "steps": [
          {
            "do": "Prior precision",
            "result": "$1/10000=0.0001$",
            "why": "very small"
          },
          {
            "do": "Data precision",
            "result": "$1/4=0.25$",
            "why": "much larger"
          },
          {
            "do": "Total precision",
            "result": "$0.2501$",
            "why": "add"
          },
          {
            "do": "Weighted numerator",
            "result": "$0*0.0001+7*0.25=1.75$",
            "why": "data dominates"
          },
          {
            "do": "Posterior mean",
            "result": "$1.75/0.2501=6.997$",
            "why": "almost the data mean"
          }
        ],
        "answer": "Posterior mean is about 6.997."
      },
      {
        "problem": "A flat prior on θ in [0,1] is Beta(1,1). After 3 successes and 1 failure, find posterior and mean.",
        "steps": [
          {
            "do": "Update alpha",
            "result": "$1+3=4$",
            "why": "add successes"
          },
          {
            "do": "Update beta",
            "result": "$1+1=2$",
            "why": "add failures"
          },
          {
            "do": "Write posterior",
            "result": "$Beta(4,2)$",
            "why": "conjugate update"
          },
          {
            "do": "Total",
            "result": "$6$",
            "why": "4+2"
          },
          {
            "do": "Mean",
            "result": "$4/6=0.667$",
            "why": "posterior mean"
          }
        ],
        "answer": "Posterior Beta(4,2), mean 0.667."
      },
      {
        "problem": "An improper flat prior for a Normal mean combines with n=4 observations of known variance 9 and sample mean 12. What posterior mean and variance result?",
        "steps": [
          {
            "do": "Use data precision",
            "result": "$4/9$",
            "why": "flat prior contributes zero precision"
          },
          {
            "do": "Compute posterior variance",
            "result": "$1/(4/9)=9/4=2.25$",
            "why": "invert precision"
          },
          {
            "do": "Posterior mean",
            "result": "$12$",
            "why": "with no prior pull, mean equals sample mean"
          },
          {
            "do": "Compute standard deviation",
            "result": "$sqrt(2.25)=1.5$",
            "why": "uncertainty in μ"
          },
          {
            "do": "Interpret",
            "result": "proper posterior",
            "why": "Normal data make the posterior finite"
          }
        ],
        "answer": "Posterior mean 12 and variance 2.25."
      }
    ],
    "applications": [
      {
        "title": "Default conversion-rate priors",
        "background": "Uniform Beta(1,1) is a common simple default for binary rates when little is known.",
        "numbers": "After 2 conversions in 10 visits, posterior mean is $(1+2)/(2+10)=3/12=0.25$."
      },
      {
        "title": "Jeffreys prior in small samples",
        "background": "Jeffreys prior is often used because it behaves more consistently under reparameterization.",
        "numbers": "After 2 successes in 10 trials, Beta(0.5,0.5) gives mean $2.5/11=0.227$."
      },
      {
        "title": "Wide priors in regression",
        "background": "A wide Normal prior lets coefficients move freely while still keeping the computation Bayesian.",
        "numbers": "Normal(0,100^2) has standard deviation 100, so coefficient 2 is only 0.02 standard deviations from the mean."
      },
      {
        "title": "Improper location priors",
        "background": "Flat improper priors are sometimes used for location parameters, but the posterior must be checked.",
        "numbers": "For n=5 Normal observations with variance 10, posterior variance under flat prior is $10/5=2$."
      },
      {
        "title": "Scale sensitivity",
        "background": "Flat on one scale is not flat on another, which matters for positive rates and variances.",
        "numbers": "A value from 1 to 10 spans 9 units on θ scale but only $log(10)-log(1)=2.303$ on log scale."
      },
      {
        "title": "Sparse data caution",
        "background": "Weak priors can still visibly affect very small datasets, which is usually a feature, not a bug.",
        "numbers": "With one success in one trial, Beta(1,1) posterior mean is $2/3=0.667$, not 1."
      }
    ],
    "applicationsClose": "Noninformative priors are humility in mathematical form: useful, often necessary, but still choices that deserve to be named.",
    "takeaways": [
      "Noninformative priors aim to add little information, not zero assumptions.",
      "Flatness depends on the parameter scale.",
      "Improper priors require a proper posterior check.",
      "Weak priors matter most when data are scarce."
    ]
  },
  "math-20-09": {
    "id": "math-20-09",
    "title": "Credible intervals",
    "tagline": "A credible interval is a probability statement about the parameter, made after the data have updated your uncertainty.",
    "connections": {
      "buildsOn": [
        "Posteriors",
        "The Beta–Binomial model",
        "The Normal–Normal model"
      ],
      "leadsTo": [
        "Posterior predictive distributions",
        "Bayesian decision rules",
        "Bayesian workflow"
      ],
      "usedWith": [
        "quantiles",
        "posterior probability",
        "Normal intervals",
        "Beta distributions"
      ]
    },
    "motivation": "<p>You already know that a single estimate can be too thin. Saying a click rate is 0.12 is helpful, but saying most posterior mass lies between 0.08 and 0.17 tells a richer story.</p><p>A <b>credible interval</b> is Bayesian uncertainty in interval form. After observing data, it gives a range that contains a chosen amount of posterior probability.</p>",
    "definition": "<p>A 95 percent credible interval for θ is an interval [a,b] such that posterior probability $P(a <= θ <= b | D)=0.95$. Equal-tailed intervals put 2.5 percent posterior probability below a and 2.5 percent above b. Highest posterior density intervals choose the shortest high-density region, when appropriate.</p><p>For a Normal posterior with mean m and standard deviation s, a rough 95 percent credible interval is $m ± 1.96s$. Unlike a frequentist confidence interval, the Bayesian statement is directly about θ under the posterior model.</p><p><b>Assumptions that matter:</b> the interval is conditional on the prior, likelihood, and model; approximate Normal intervals need a roughly Normal posterior; and 95 percent credible does not mean every value inside is equally plausible.</p>",
    "worked": {
      "problem": "A posterior for μ is Normal with mean 12.4 and variance 0.8. Compute an approximate 95 percent credible interval using 1.96 standard deviations.",
      "skills": [
        "Normal posterior",
        "standard deviation",
        "credible interval"
      ],
      "strategy": "Turn variance into standard deviation, multiply by 1.96, then move that distance around the posterior mean.",
      "steps": [
        {
          "do": "Compute standard deviation",
          "result": "$sqrt(0.8)=0.894$",
          "why": "standard deviation is the square root of variance"
        },
        {
          "do": "Compute margin",
          "result": "$1.96*0.894=1.752$",
          "why": "95 percent Normal multiplier"
        },
        {
          "do": "Compute lower endpoint",
          "result": "$12.4-1.752=10.648$",
          "why": "subtract margin from mean"
        },
        {
          "do": "Compute upper endpoint",
          "result": "$12.4+1.752=14.152$",
          "why": "add margin to mean"
        },
        {
          "do": "Round endpoints",
          "result": "$[10.65,14.15]$",
          "why": "two decimals are enough for reporting"
        },
        {
          "do": "Interpret",
          "result": "posterior probability is about 0.95",
          "why": "under the Normal posterior model"
        }
      ],
      "verify": "The interval is centered at the posterior mean and narrower than the prior uncertainty because data increased precision.",
      "answer": "Approximate 95 percent credible interval: [10.65, 14.15].",
      "connects": "Credible intervals summarize posterior mass, not repeated-sampling coverage by default."
    },
    "practice": [
      {
        "problem": "Posterior Normal mean 5, variance 1.44. Compute an approximate 90 percent credible interval using multiplier 1.645.",
        "steps": [
          {
            "do": "Standard deviation",
            "result": "$sqrt(1.44)=1.2$",
            "why": "square root of variance"
          },
          {
            "do": "Margin",
            "result": "$1.645*1.2=1.974$",
            "why": "90 percent Normal multiplier"
          },
          {
            "do": "Lower",
            "result": "$5-1.974=3.026$",
            "why": "subtract"
          },
          {
            "do": "Upper",
            "result": "$5+1.974=6.974$",
            "why": "add"
          },
          {
            "do": "Round",
            "result": "$[3.03,6.97]$",
            "why": "report neatly"
          }
        ],
        "answer": "Approximate 90 percent interval is [3.03, 6.97]."
      },
      {
        "problem": "A posterior has samples sorted so the 25th of 1000 samples is 0.08 and the 975th is 0.19. State the equal-tailed 95 percent credible interval.",
        "steps": [
          {
            "do": "Find lower tail",
            "result": "$25/1000=0.025$",
            "why": "2.5 percent below"
          },
          {
            "do": "Find upper tail",
            "result": "$975/1000=0.975$",
            "why": "97.5 percent quantile"
          },
          {
            "do": "Read lower endpoint",
            "result": "$0.08$",
            "why": "given sample quantile"
          },
          {
            "do": "Read upper endpoint",
            "result": "$0.19$",
            "why": "given sample quantile"
          },
          {
            "do": "State interval",
            "result": "$[0.08,0.19]$",
            "why": "middle 95 percent"
          }
        ],
        "answer": "The equal-tailed 95 percent credible interval is [0.08, 0.19]."
      },
      {
        "problem": "Posterior Normal mean 0.30, standard deviation 0.05. Is θ=0.20 inside the rough 95 percent credible interval?",
        "steps": [
          {
            "do": "Compute margin",
            "result": "$1.96*0.05=0.098$",
            "why": "95 percent multiplier"
          },
          {
            "do": "Lower endpoint",
            "result": "$0.30-0.098=0.202$",
            "why": "subtract"
          },
          {
            "do": "Upper endpoint",
            "result": "$0.30+0.098=0.398$",
            "why": "add"
          },
          {
            "do": "Compare θ",
            "result": "$0.20<0.202$",
            "why": "slightly below lower endpoint"
          },
          {
            "do": "Decide",
            "result": "not inside",
            "why": "it misses by 0.002"
          }
        ],
        "answer": "No. The rough interval is [0.202, 0.398], so 0.20 is just outside."
      },
      {
        "problem": "A 95 percent credible interval for lift is [-0.01,0.07]. Interpret it for a launch decision requiring at least 0.02 lift.",
        "steps": [
          {
            "do": "Read lower endpoint",
            "result": "$-0.01$",
            "why": "negative lift remains plausible"
          },
          {
            "do": "Read upper endpoint",
            "result": "$0.07$",
            "why": "meaningful positive lift is plausible"
          },
          {
            "do": "Locate threshold",
            "result": "$0.02$ lies inside",
            "why": "the decision threshold is within the interval"
          },
          {
            "do": "Assess certainty",
            "result": "not enough by interval alone",
            "why": "posterior mass spans both below and above threshold"
          },
          {
            "do": "State next step",
            "result": "compute $P(lift>0.02)$",
            "why": "decision needs posterior probability above target"
          }
        ],
        "answer": "The interval is promising but not decisive for a 0.02 lift requirement."
      },
      {
        "problem": "A posterior Normal has a 95 percent credible interval [8,12]. Assuming symmetry and multiplier 1.96, recover mean and standard deviation.",
        "steps": [
          {
            "do": "Compute mean",
            "result": "$(8+12)/2=10$",
            "why": "center of symmetric interval"
          },
          {
            "do": "Compute half-width",
            "result": "$(12-8)/2=2$",
            "why": "margin"
          },
          {
            "do": "Set margin equation",
            "result": "$1.96s=2$",
            "why": "Normal interval form"
          },
          {
            "do": "Solve for s",
            "result": "$s=2/1.96=1.020$",
            "why": "divide"
          },
          {
            "do": "Check",
            "result": "$10 ± 1.96*1.020$ gives about [8,12]",
            "why": "substitute back"
          }
        ],
        "answer": "Mean is 10 and standard deviation is about 1.02."
      }
    ],
    "applications": [
      {
        "title": "A/B test reporting",
        "background": "Credible intervals help teams see practical uncertainty around conversion lift.",
        "numbers": "If posterior lift mean is 0.03 and sd is 0.015, rough 95 percent interval is $0.03 ± 0.0294$, or [0.0006,0.0594]."
      },
      {
        "title": "CTR uncertainty",
        "background": "A smoothed click-rate estimate should include uncertainty, especially for low-traffic items.",
        "numbers": "Posterior mean 0.10 and sd 0.03 gives rough 95 percent interval [0.041,0.159]."
      },
      {
        "title": "Model latency",
        "background": "Bayesian intervals can summarize uncertainty in average latency after noisy measurements.",
        "numbers": "Posterior mean 120 ms and sd 5 ms gives 95 percent interval about [110.2,129.8] ms."
      },
      {
        "title": "Calibration error",
        "background": "Intervals around calibration parameters show whether a model may be overconfident or underconfident.",
        "numbers": "Posterior slope mean 0.92 sd 0.04 gives 95 percent interval [0.842,0.998], mostly below 1."
      },
      {
        "title": "Reliability bounds",
        "background": "For defect or failure rates, intervals communicate risk better than a single rate.",
        "numbers": "If posterior failure-rate interval is [0.001,0.006], then in 10,000 units that corresponds to about 10 to 60 failures."
      },
      {
        "title": "Forecast ranges",
        "background": "Forecasting systems often report posterior intervals so planners can prepare for uncertainty.",
        "numbers": "Demand posterior mean 500 and sd 40 gives rough 95 percent credible range [421.6,578.4]."
      }
    ],
    "applicationsClose": "A credible interval is not a decoration on an estimate; it is the posterior distribution made compact enough to guide judgment.",
    "takeaways": [
      "A credible interval contains a chosen amount of posterior probability.",
      "For Normal posteriors, use mean plus or minus a multiplier times posterior standard deviation.",
      "Equal-tailed and highest-density intervals can differ for skewed posteriors.",
      "Credible intervals are conditional on the prior, likelihood, and model assumptions."
    ]
  },
  "math-20-10": {
    "id": "math-20-10",
    "title": "Posterior predictive distributions",
    "tagline": "A posterior predictive distribution carries parameter uncertainty forward into uncertainty about the next data point.",
    "connections": {
      "buildsOn": [
        "Posteriors",
        "Credible intervals",
        "The Beta–Binomial model"
      ],
      "leadsTo": [
        "Bayesian decision making",
        "Bayesian model checking",
        "probabilistic forecasting"
      ],
      "usedWith": [
        "expectation",
        "mixtures",
        "predictive intervals",
        "marginalization"
      ]
    },
    "motivation": "<p>After learning about a parameter, the next natural question is practical: what might happen next? A point estimate of θ is not enough, because θ is still uncertain.</p><p>The <b>posterior predictive distribution</b> answers by averaging predictions over the whole posterior. It is the Bayesian way to say: account for what we learned and for what we still do not know.</p>",
    "definition": "<p>The posterior predictive distribution for new data xnew is $p(xnew|D)=average of p(xnew|θ) over the posterior p(θ|D)$. In words, each possible θ predicts xnew, and the posterior weights those predictions.</p><p>For a Beta-Binomial model, if θ|D is Beta(a,b), the predictive probability that the next trial succeeds is $a/(a+b)$. For multiple future trials, the Beta-Binomial predictive distribution is wider than a Binomial with θ fixed at the posterior mean because it includes parameter uncertainty.</p><p><b>Assumptions that matter:</b> future data must follow the same data-generating model conditional on θ, posterior uncertainty must be integrated rather than ignored, and predictions are conditional on the model being appropriate for the future setting.</p>",
    "worked": {
      "problem": "A click-rate posterior is Beta(9,21). Find the predictive probability of a click on the next impression and the predictive mean number of clicks in 10 impressions.",
      "skills": [
        "posterior predictive",
        "Beta-Binomial",
        "expected count"
      ],
      "strategy": "Use the posterior mean as the next-trial predictive probability, then multiply by the number of future trials for the predictive mean count.",
      "steps": [
        {
          "do": "Identify posterior parameters",
          "result": "$a=9$, $b=21$",
          "why": "from Beta(a,b)"
        },
        {
          "do": "Compute total",
          "result": "$9+21=30$",
          "why": "posterior effective count"
        },
        {
          "do": "Compute next-click probability",
          "result": "$9/30=0.30$",
          "why": "posterior predictive success probability"
        },
        {
          "do": "Set future trials",
          "result": "$m=10$",
          "why": "ten impressions"
        },
        {
          "do": "Compute predictive mean count",
          "result": "$10*0.30=3$",
          "why": "expected successes equals trials times success probability"
        },
        {
          "do": "Interpret",
          "result": "about 3 clicks",
          "why": "prediction includes posterior uncertainty through the averaged rate"
        }
      ],
      "verify": "The predictive probability matches the posterior mean for one Bernoulli trial, but the full predictive distribution would also describe variability around 3.",
      "answer": "Next-click probability is 0.30; expected clicks in 10 impressions is 3.",
      "connects": "Posterior prediction moves from uncertainty about θ to uncertainty about future observations."
    },
    "practice": [
      {
        "problem": "Posterior Beta(4,6). Find predictive probability of success on the next trial.",
        "steps": [
          {
            "do": "Read a",
            "result": "$4$",
            "why": "posterior alpha"
          },
          {
            "do": "Read b",
            "result": "$6$",
            "why": "posterior beta"
          },
          {
            "do": "Compute total",
            "result": "$10$",
            "why": "a+b"
          },
          {
            "do": "Divide",
            "result": "$4/10=0.40$",
            "why": "predictive success probability"
          },
          {
            "do": "State",
            "result": "40 percent",
            "why": "next trial averages over θ"
          }
        ],
        "answer": "Predictive probability is 0.40."
      },
      {
        "problem": "Posterior Beta(12,18). Find expected successes in 50 future trials.",
        "steps": [
          {
            "do": "Compute predictive probability",
            "result": "$12/(12+18)=0.40$",
            "why": "posterior mean"
          },
          {
            "do": "Set future trials",
            "result": "$50$",
            "why": "given"
          },
          {
            "do": "Multiply",
            "result": "$50*0.40=20$",
            "why": "expected count"
          },
          {
            "do": "Attach units",
            "result": "20 successes",
            "why": "future binary outcomes"
          },
          {
            "do": "Interpret",
            "result": "mean, not guarantee",
            "why": "actual count varies"
          }
        ],
        "answer": "Expected future successes: 20."
      },
      {
        "problem": "A posterior over models gives probabilities 0.7 and 0.3. Model A predicts rain with probability 0.2; model B predicts rain with probability 0.6. Find posterior predictive rain probability.",
        "steps": [
          {
            "do": "Weight model A prediction",
            "result": "$0.7*0.2=0.14$",
            "why": "posterior model probability times prediction"
          },
          {
            "do": "Weight model B prediction",
            "result": "$0.3*0.6=0.18$",
            "why": "same for model B"
          },
          {
            "do": "Add",
            "result": "$0.14+0.18=0.32$",
            "why": "average over model uncertainty"
          },
          {
            "do": "Check range",
            "result": "$0.32$ is between 0.2 and 0.6",
            "why": "weighted average sanity check"
          },
          {
            "do": "State probability",
            "result": "32 percent",
            "why": "posterior predictive probability"
          }
        ],
        "answer": "Predictive rain probability is 0.32."
      },
      {
        "problem": "A Normal posterior for μ has mean 10 and variance 1. Future observation noise variance is 4. Find predictive mean and variance for one new observation.",
        "steps": [
          {
            "do": "Predictive mean",
            "result": "$10$",
            "why": "future observation is centered at posterior mean"
          },
          {
            "do": "Parameter variance",
            "result": "$1$",
            "why": "uncertainty about μ"
          },
          {
            "do": "Noise variance",
            "result": "$4$",
            "why": "new observation noise"
          },
          {
            "do": "Add variances",
            "result": "$1+4=5$",
            "why": "prediction includes both sources"
          },
          {
            "do": "State standard deviation",
            "result": "$sqrt(5)=2.236$",
            "why": "optional scale"
          }
        ],
        "answer": "Predictive mean is 10 and predictive variance is 5."
      },
      {
        "problem": "Posterior Beta(2,8). Compute probability of exactly one success in two future trials using the Beta-Binomial formula $2ab/((a+b)(a+b+1))$.",
        "steps": [
          {
            "do": "Set parameters",
            "result": "$a=2$, $b=8$",
            "why": "posterior parameters"
          },
          {
            "do": "Compute numerator",
            "result": "$2*a*b=2*2*8=32$",
            "why": "exactly one success can occur in two orders"
          },
          {
            "do": "Compute denominator",
            "result": "$(a+b)(a+b+1)=10*11=110$",
            "why": "Beta-Binomial denominator"
          },
          {
            "do": "Divide",
            "result": "$32/110=0.291$",
            "why": "predictive probability"
          },
          {
            "do": "Interpret",
            "result": "about 29.1 percent",
            "why": "parameter uncertainty is integrated"
          }
        ],
        "answer": "Probability of exactly one success in two future trials is about 0.291."
      }
    ],
    "applications": [
      {
        "title": "Forecasting clicks",
        "background": "Ad systems care about future clicks, not only the latent click rate. Posterior predictive distributions answer that operational question.",
        "numbers": "Posterior Beta(20,180) gives next-click probability $20/200=0.10$ and expected clicks in 100 impressions equal 10."
      },
      {
        "title": "Inventory planning",
        "background": "Predictive distributions turn parameter uncertainty into demand uncertainty for future periods.",
        "numbers": "If predictive demand mean is 500 with sd 60, stocking 620 units is about 2 predictive standard deviations above the mean."
      },
      {
        "title": "Model checking",
        "background": "Posterior predictive checks simulate future-looking datasets and compare them with observed data.",
        "numbers": "If observed maximum count is 18 but 950 of 1000 predictive simulations have maximum below 12, the model may understate extremes."
      },
      {
        "title": "Risk alerts",
        "background": "Predictive probabilities can trigger action when future bad outcomes are sufficiently likely.",
        "numbers": "If posterior predictive probability of more than 5 failures tomorrow is 0.12 and threshold is 0.10, an alert fires."
      },
      {
        "title": "Bayesian ensembling",
        "background": "Averaging predictions over model posterior probabilities is a Bayesian ensemble.",
        "numbers": "Models predict 0.1, 0.4, 0.8 with posterior weights 0.2, 0.5, 0.3, giving predictive probability $0.02+0.20+0.24=0.46$."
      },
      {
        "title": "Predictive intervals for latency",
        "background": "A parameter credible interval is not the same as a future-observation interval; new noise makes predictions wider.",
        "numbers": "If mean latency posterior variance is 4 and observation noise variance is 25, predictive variance is 29, sd about 5.39 ms."
      }
    ],
    "applicationsClose": "Posterior prediction is the capstone move: learn uncertainty about the hidden quantity, then carry that uncertainty into the next observable outcome.",
    "takeaways": [
      "A posterior predictive distribution averages future-data probabilities over the posterior.",
      "For one future Bernoulli trial under Beta(a,b), predictive success probability is a/(a+b).",
      "Predictive uncertainty includes both parameter uncertainty and observation noise.",
      "Posterior predictive checks compare simulated future data with real observed patterns."
    ]
  }
};
