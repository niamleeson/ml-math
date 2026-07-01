module.exports = {
  "math-20-01": {
    connectionsProse: "<p>This opening lesson connects ordinary probability calculations to the Bayesian habit of updating information. The reader already knows that conditional probabilities can be rearranged with the multiplication rule. Here that same identity becomes a way to move from prior information to posterior information after data arrive. The lesson sets up the vocabulary used throughout the section: prior, likelihood, posterior, and evidence.</p>",
    motivation: "<p>Bayesian probability treats probability as a state of information that can be updated when evidence arrives. The same unknown quantity can be uncertain before data are observed and less uncertain afterward. A probability is not only a long-run frequency in this view; it is also a disciplined summary of what the model currently knows.</p>" +
                "<p>Bayes' rule makes that update explicit. Prior information and data do not compete with each other; they are counted in different parts of the same bookkeeping identity. The prior records what was known before the current data, the likelihood records how compatible each value is with the data, and the posterior records the combined state of information.</p>",
    definition: "<p>Bayesian probability updates an unknown quantity after data arrive by combining the prior and likelihood and normalizing by the evidence.</p>" +
                "<p>$$p(\\theta\\mid D)=\\frac{p(D\\mid\\theta)p(\\theta)}{p(D)}$$</p>" +
                "<p><b>Assumptions that matter:</b> The multiplication-rule identity is $p(\\theta,D)=p(D\\mid\\theta)p(\\theta)=p(\\theta\\mid D)p(D)$, so the evidence must be positive and finite.</p>",
    symbols: [
      { sym: "$\\theta$", desc: "unknown quantity" },
      { sym: "$D$", desc: "observed data" },
      { sym: "$p(\\theta)$", desc: "prior" },
      { sym: "$p(D\\mid\\theta)$", desc: "likelihood" },
      { sym: "$p(\\theta\\mid D)$", desc: "posterior" },
      { sym: "$p(D)$", desc: "evidence" }
    ],
    applications: [
      { title: "Rare-event screening", background: "A screening test updates disease prevalence after a positive result.", numbers: "prevalence $0.01$, sensitivity $0.95$, false-positive rate $0.04$ gives $P(disease\\mid +)=0.0095/(0.0095+0.0396)=0.193$." },
      { title: "Spam filtering", background: "A word likelihood updates the prior chance that an email is spam.", numbers: "prior spam $0.30$, word likelihoods $0.50$ and $0.05$ give $0.15/(0.15+0.035)=0.811$." },
      { title: "A/B model belief", background: "Prior odds are updated by a likelihood ratio from experiment data.", numbers: "prior odds $1:1$ and likelihood ratio $3$ give posterior probability $3/(3+1)=0.75$." },
      { title: "Sensor fusion", background: "A sensor reading changes the odds for a room state.", numbers: "room odds $2:1$ multiplied by likelihood ratio $0.5$ become $1:1$." },
      { title: "Fraud alerts", background: "An alert combines a rare fraud prior with hit and false-alarm rates.", numbers: "fraud prior $0.005$, hit rate $0.80$, false alarm $0.02$ gives $0.004/(0.004+0.0199)=0.167$." },
      { title: "Model comparison", background: "Competing models are updated with their likelihoods for the same data.", numbers: "priors $0.5,0.5$ and likelihoods $0.12,0.04$ give posterior model-1 probability $0.06/(0.06+0.02)=0.75$." }
    ]
  },
  "math-20-02": {
    connectionsProse: "<p>This lesson follows the Bayesian view of probability by naming the first input to an update. Before the current data are used, a model still needs a distribution over the unknown quantity. That distribution may be weak, strong, historical, or chosen for regularization. Later lessons use priors in conjugate updates, hierarchical models, and Bayesian neural-network uncertainty.</p>",
    motivation: "<p>A prior is the distribution a model is willing to update before the current data are used. It can encode weak background scale, past experiments, physical constraints, or regularization for sparse data. In small data settings, it can prevent a model from treating a few observations as if they were complete knowledge.</p>" +
                "<p>The important point is that a prior is part of the model, not an afterthought. It must put valid probability mass on possible parameter values, and its strength should match the amount of information it is meant to contribute. A weak prior can still express scale and direction, while a strong prior should be justified by stable past evidence or a real constraint.</p>",
    definition: "<p>A prior is the probability distribution assigned to an unknown quantity before the current data are used.</p>" +
                "<p>$$\\sum_\\theta p(\\theta)=1,\\qquad\\int p(\\theta)\\,d\\theta=1.$$</p>" +
                "<p><b>Assumptions that matter:</b> A discrete prior must sum to $1$, and a continuous prior must integrate to $1$ unless an improper prior is later checked to give a proper posterior.</p>",
    symbols: [
      { sym: "$p(\\theta)$", desc: "prior density or mass" },
      { sym: "$\\alpha,\\beta$", desc: "Beta shape parameters" },
      { sym: "$m_0,v_0$", desc: "Normal prior mean and variance" },
      { sym: "prior strength", desc: "the amount of information the prior contributes" }
    ],
    applications: [
      { title: "Cold-start CTR", background: "A Beta prior supplies starting information for a new click-through rate.", numbers: "$\\operatorname{Beta}(4,96)$ has mean $4/(4+96)=0.04$." },
      { title: "Weight shrinkage", background: "A Normal prior makes large weights visibly unlikely before data arrive.", numbers: "$w=3$ under $\\mathcal N(0,1)$ is $3$ standard deviations from zero." },
      { title: "Historical A/B baseline", background: "A historical prior combines with new visits and clicks.", numbers: "$\\operatorname{Beta}(30,970)$ plus $4$ clicks in $100$ visits has posterior mean $34/1100=0.0309$." },
      { title: "Word smoothing", background: "A weak prior prevents a zero observed count from becoming zero probability.", numbers: "$\\operatorname{Beta}(1,1)$ plus $0$ occurrences in $8$ emails gives mean $1/10=0.10$." },
      { title: "Reliability prior", background: "A strong prior can encode a very rare expected failure rate.", numbers: "$\\operatorname{Beta}(2,998)$ has mean $0.002$ and strength $1000$." },
      { title: "Sparse group pooling", background: "Prior counts stabilize a small group's observed rate.", numbers: "$\\operatorname{Beta}(10,90)$ plus $3$ events in $20$ trials gives $13/120=0.108$." }
    ]
  },
  "math-20-03": {
    connectionsProse: "<p>This lesson introduces the second input to a Bayesian update: the sampling model for the data. Priors describe information before the data; likelihoods describe how each possible parameter value would have generated the data that were observed. The same likelihood idea also appears in maximum likelihood estimation, logistic regression, language models, and anomaly detection. In Bayesian statistics, it becomes the bridge from observations to the posterior.</p>",
    motivation: "<p>A likelihood scores parameter values by how well they would have predicted the data already observed. The data are treated as fixed, and the parameter is the argument being compared. A parameter value with a larger likelihood made the observed sample less surprising under the assumed sampling model.</p>" +
                "<p>A likelihood is not a probability distribution over the parameter until the prior and normalization enter. It can be multiplied by constants without changing comparisons among parameter values. This is why likelihood kernels are so useful: they keep the factors involving the parameter and ignore constants that do not affect the posterior shape.</p>",
    definition: "<p>For Bernoulli data with $s$ successes and $f$ failures, the likelihood kernel keeps the factors that depend on the success probability.</p>" +
                "<p>$$L(\\theta)\\propto\\theta^s(1-\\theta)^f$$</p>" +
                "<p><b>Assumptions that matter:</b> Trials are conditionally independent given $\\theta$, and constants not involving $\\theta$ can be ignored for parameter comparison.</p>",
    symbols: [
      { sym: "$L(\\theta)$", desc: "likelihood as a function of $\\theta$" },
      { sym: "$s$", desc: "successes" },
      { sym: "$f$", desc: "failures" },
      { sym: "$D$", desc: "fixed data" }
    ],
    derivation: [
      { do: "Use the Bernoulli sampling model for a single trial.", result: "one success has probability $\\theta$ and one failure has probability $1-\\theta$", why: "the model defines success and failure probabilities" },
      { do: "Multiply the trial probabilities.", result: "conditional independence multiplies trial probabilities", why: "independent observations contribute product factors" },
      { do: "Collect the success factors.", result: "$\\theta^s$", why: "$s$ successes contribute $s$ copies of $\\theta$" },
      { do: "Collect the failure factors.", result: "$(1-\\theta)^f$", why: "$f$ failures contribute $f$ copies of $1-\\theta$" },
      { do: "Ignore ordering constants when comparing $\\theta$.", result: "$L(\\theta)\\propto\\theta^s(1-\\theta)^f$", why: "constants not involving $\\theta$ do not change likelihood comparisons" }
    ],
    applications: [
      { title: "MLE coin rate", background: "The likelihood is maximized by the observed success fraction.", numbers: "$8$ heads in $10$ flips gives $\\hat\\theta=0.8$." },
      { title: "Log-likelihood training", background: "Independent predicted probabilities add on the log scale.", numbers: "probabilities $0.7,0.9,0.8$ give $\\log L\\approx-0.685$." },
      { title: "Language-model sentence", background: "A sentence likelihood multiplies token probabilities.", numbers: "token probabilities $0.10,0.25,0.40$ multiply to $0.010$." },
      { title: "Anomaly score", background: "A much smaller likelihood marks an observation as more surprising.", numbers: "likelihood $0.0005$ is $100$ times smaller than $0.05$." },
      { title: "Calibration setting", background: "A likelihood ratio compares two parameter settings for the same data.", numbers: "densities $0.18$ and $0.06$ give likelihood ratio $3$." },
      { title: "Coin comparison", background: "Two coin rates can be compared by their likelihood ratio.", numbers: "with $4$ heads and $1$ tail, $L(0.8)/L(0.5)=0.8^4(0.2)/(0.5^5)=2.621$." }
    ]
  },
  "math-20-04": {
    connectionsProse: "<p>This lesson brings priors and likelihoods together. After the Bayesian view of probability, priors, and likelihoods have been introduced separately, the posterior is the distribution produced by combining them. It is the object used by credible intervals, posterior predictive distributions, hierarchical shrinkage, model comparison, and Bayesian decision rules. The rest of the section repeatedly returns to this update.</p>",
    motivation: "<p>The posterior is the updated distribution after prior information and the likelihood have both been counted. It says how the model distributes belief across parameter values after seeing the observed data. If the likelihood strongly favors a region and the prior allows that region, the posterior moves there; if the data are weak, the prior remains more visible.</p>" +
                "<p>The evidence in the denominator makes the posterior a valid probability distribution. In discrete problems, this is just a normalization step over unnormalized weights. In continuous problems, it is an integral. Either way, the posterior is the distribution used for intervals, predictions, and decisions.</p>",
    definition: "<p>The posterior combines the likelihood and prior and then normalizes them into a probability distribution after observing data.</p>" +
                "<p>$$p(\\theta\\mid D)=\\frac{p(D\\mid\\theta)p(\\theta)}{p(D)}.$$</p>" +
                "<p><b>Assumptions that matter:</b> The evidence $p(D)$ must normalize the unnormalized posterior weights or density.</p>",
    symbols: [
      { sym: "$H_i$", desc: "candidate hypothesis" },
      { sym: "$w_i$", desc: "unnormalized posterior weight" },
      { sym: "$p(D)$", desc: "normalizer" }
    ],
    derivation: [
      { do: "Start with joint probability written one way.", result: "$p(\\theta,D)=p(D\\mid\\theta)p(\\theta)$", why: "the multiplication rule factors the joint through the likelihood and prior" },
      { do: "Write the same joint probability by conditioning on data.", result: "$p(\\theta,D)=p(\\theta\\mid D)p(D)$", why: "the multiplication rule can also factor the joint through the posterior and evidence" },
      { do: "Set the two right sides equal.", result: "$p(D\\mid\\theta)p(\\theta)=p(\\theta\\mid D)p(D)$", why: "both expressions describe the same joint event" },
      { do: "Divide by $p(D)$.", result: "$$p(\\theta\\mid D)=\\frac{p(D\\mid\\theta)p(\\theta)}{p(D)}.$$", why: "normalization isolates the posterior" },
      { do: "Normalize discrete hypothesis weights.", result: "$w_i=p(D\\mid H_i)p(H_i)$ and $w_i/\\sum_r w_r$", why: "discrete posteriors are unnormalized weights divided by their sum" }
    ],
    applications: [
      { title: "Three-hypothesis update", background: "Unnormalized weights become posterior probabilities after normalization.", numbers: "priors $0.5,0.3,0.2$ and likelihoods $0.2,0.5,0.1$ give weights $0.10,0.15,0.02$ and posterior $(0.370,0.556,0.074)$." },
      { title: "CTR posterior", background: "A Beta prior updates with click and skip counts.", numbers: "$\\operatorname{Beta}(3,7)$ plus $2$ clicks and $3$ skips gives $\\operatorname{Beta}(5,10)$, mean $0.333$." },
      { title: "Reliability", background: "A rare-failure prior updates after observed failures in tests.", numbers: "$\\operatorname{Beta}(1,999)$ plus $2$ failures in $1000$ tests gives mean $3/2000=0.0015$." },
      { title: "Drift alert", background: "A posterior risk probability can trigger an alert rule.", numbers: "posterior probability $0.93$ above a risk threshold exceeds an alert threshold $0.90$." },
      { title: "Demand planning", background: "A posterior mean and sd summarize planning uncertainty.", numbers: "posterior mean $120$ and sd $15$ gives rough range $90$ to $150$." },
      { title: "Decision rule", background: "A posterior risk can be compared with an action threshold.", numbers: "posterior risk $0.82$ exceeds action threshold $0.80$." }
    ]
  },
  "math-20-05": {
    connectionsProse: "<p>This lesson uses the prior, likelihood, and posterior pieces from the previous lessons in a special algebraic case. Some priors are matched to common likelihoods so that the posterior stays in the same family. That match makes exact Bayesian updating transparent and computationally cheap. It also provides the counting intuition behind several later models, including the Beta-Binomial and Dirichlet-multinomial updates.</p>",
    motivation: "<p>Conjugacy is an algebraic match between prior and likelihood. Updating changes the parameters of the prior family without changing the family itself. For a Beta prior and Bernoulli data, this means the posterior is another Beta distribution with successes and failures added to the shape parameters.</p>" +
                "<p>The value of conjugacy is not only convenience. It shows how Bayesian updating can behave like careful accounting: prior pseudo-counts are combined with observed counts, and the resulting posterior can be summarized immediately. This exact pattern becomes a reference point for approximate inference methods introduced later.</p>",
    definition: "<p>A conjugate prior is matched to a likelihood so the posterior remains in the same distribution family with updated parameters.</p>" +
                "<p>$$\\operatorname{Beta}(\\alpha+s,\\beta+f).$$</p>" +
                "<p><b>Assumptions that matter:</b> The Beta prior is paired with Bernoulli data, and the posterior kernel is proportional to prior times likelihood.</p>",
    symbols: [
      { sym: "$\\alpha,\\beta$", desc: "prior pseudo-counts" },
      { sym: "$s,f$", desc: "observed success and failure counts" },
      { sym: "conjugate", desc: "posterior remains in the same family" }
    ],
    derivation: [
      { do: "Write the prior kernel.", result: "$p(\\theta)\\propto\\theta^{\\alpha-1}(1-\\theta)^{\\beta-1}$", why: "the Beta density has powers determined by its shape parameters" },
      { do: "Write the likelihood kernel.", result: "$p(D\\mid\\theta)\\propto\\theta^s(1-\\theta)^f$", why: "Bernoulli successes and failures contribute matching powers" },
      { do: "Multiply prior and likelihood.", result: "$p(\\theta\\mid D)\\propto p(D\\mid\\theta)p(\\theta)$", why: "the posterior is proportional to their product" },
      { do: "Add exponents on matching bases.", result: "$\\theta^{\\alpha+s-1}(1-\\theta)^{\\beta+f-1}$", why: "multiplying powers with the same base adds exponents" },
      { do: "Identify the resulting family.", result: "$$\\operatorname{Beta}(\\alpha+s,\\beta+f).$$", why: "the kernel has the Beta form with updated shape parameters" }
    ],
    applications: [
      { title: "Click dashboard", background: "Beta pseudo-counts and observed click counts update exactly.", numbers: "$\\operatorname{Beta}(2,98)$ plus $12$ clicks and $188$ non-clicks becomes $\\operatorname{Beta}(14,286)$, mean $0.0467$." },
      { title: "Dirichlet text smoothing", background: "A Dirichlet prior adds category counts for text probabilities.", numbers: "prior $(1,1,1)$ plus counts $(10,4,0)$ gives posterior $(11,5,1)$ and unseen-word mean $1/17$." },
      { title: "Poisson rate", background: "A Gamma prior is conjugate to a Poisson rate model.", numbers: "Gamma$(3,2)$ plus $9$ arrivals in $4$ hours gives Gamma$(12,6)$, mean $2$ per hour." },
      { title: "Gaussian measurement fusion", background: "Normal conjugacy combines prior and sensor precisions.", numbers: "prior precision $1$ and sensor precision $2$ with sensor mean $6$ gives mean $12/3=4$." },
      { title: "Conversion dashboard", background: "A conversion prior updates with new conversion data.", numbers: "$\\operatorname{Beta}(50,950)$ plus $7$ conversions in $100$ visits gives $57/1100=0.0518$." },
      { title: "Bandit arm", background: "A bandit arm's win probability updates after wins and losses.", numbers: "$\\operatorname{Beta}(1,1)$ plus $3$ wins and $2$ losses gives $\\operatorname{Beta}(4,3)$, mean $0.571$." }
    ]
  },
  "math-20-06": {
    connectionsProse: "<p>This lesson applies conjugacy to the most common Bayesian counting model for binary outcomes. The prior is Beta, the data are successes and failures, and the posterior is again Beta. This gives a concrete version of the prior as starting counts and the likelihood as observed counts. The same update appears in click-through rates, defect monitoring, classifier accuracy, and bandit learning.</p>",
    motivation: "<p>The Beta-Binomial model is Bayesian counting for yes-or-no outcomes. The unknown success probability is not treated as fixed after a small sample; it remains uncertain and is represented by a Beta distribution. Observed successes and failures then update the two shape parameters.</p>" +
                "<p>The prior contributes starting counts, and the data add observed successes and failures. This makes the posterior mean a smoothed estimate rather than a raw fraction. The same posterior also gives a direct predictive probability for the next success, which is why the model is useful for sparse rates and online experiments.</p>",
    definition: "<p>The Beta-Binomial model uses a Beta prior for a Bernoulli success probability and updates it by adding observed successes and failures.</p>" +
                "<p>$$\\theta\\mid D\\sim\\operatorname{Beta}(\\alpha+s,\\beta+f).$$</p>" +
                "<p><b>Assumptions that matter:</b> The success probability has prior $\\theta\\sim\\operatorname{Beta}(\\alpha,\\beta)$, and observed Bernoulli trials are conditionally independent given $\\theta$.</p>",
    symbols: [
      { sym: "$\\theta$", desc: "success probability" },
      { sym: "$\\alpha,\\beta$", desc: "prior counts" },
      { sym: "$s,f$", desc: "observed counts" }
    ],
    derivation: [
      { do: "Model the success probability.", result: "$\\theta\\sim\\operatorname{Beta}(\\alpha,\\beta)$", why: "the unknown binary rate is represented by a Beta distribution" },
      { do: "Write the Bernoulli likelihood for observed counts.", result: "$\\theta^s(1-\\theta)^f$", why: "$s$ successes and $f$ failures contribute those factors" },
      { do: "Multiply by the Beta prior kernel.", result: "$\\theta^{\\alpha-1}(1-\\theta)^{\\beta-1}\\theta^s(1-\\theta)^f$", why: "posterior is proportional to likelihood times prior" },
      { do: "Add exponents.", result: "$\\theta^{\\alpha+s-1}(1-\\theta)^{\\beta+f-1}$", why: "matching powers combine into updated shape parameters" },
      { do: "Read off the posterior distribution.", result: "$$\\theta\\mid D\\sim\\operatorname{Beta}(\\alpha+s,\\beta+f).$$", why: "the kernel is again a Beta density" },
      { do: "Use the Beta mean for the next-success predictive probability.", result: "$(\\alpha+s)/(\\alpha+\\beta+s+f)$", why: "the posterior predictive success chance averages $\\theta$ under the posterior" }
    ],
    applications: [
      { title: "Worked feature CTR", background: "Observed clicks and non-clicks update a feature's CTR posterior.", numbers: "$\\operatorname{Beta}(2,8)$ plus $7$ clicks and $13$ non-clicks gives $\\operatorname{Beta}(9,21)$, mean $0.300$." },
      { title: "Sparse ad CTR", background: "A sparse ad's raw click rate is smoothed by prior counts.", numbers: "$\\operatorname{Beta}(5,95)$ plus $3$ clicks in $20$ impressions gives $\\operatorname{Beta}(8,112)$, mean $0.0667$." },
      { title: "Variant A", background: "A variant's posterior mean summarizes its click probability.", numbers: "$\\operatorname{Beta}(31,969)$ has mean $0.031$." },
      { title: "Variant B", background: "A second variant's posterior mean can be compared with variant A.", numbers: "$\\operatorname{Beta}(45,955)$ has mean $0.045$." },
      { title: "Defect monitor", background: "A defect-rate prior updates after a production sample.", numbers: "$\\operatorname{Beta}(2,198)$ plus $1$ defect in $100$ parts gives mean $3/300=0.010$." },
      { title: "Classifier accuracy", background: "Correct and incorrect classifications update an accuracy posterior.", numbers: "$\\operatorname{Beta}(1,1)$ plus $87$ correct in $100$ gives $\\operatorname{Beta}(88,14)$, mean $0.863$." }
    ]
  },
  "math-20-07": {
    connectionsProse: "<p>This lesson gives the Normal analogue of the Beta-Binomial update. Instead of estimating a binary success probability, the model estimates an unknown mean from noisy measurements. The prior contributes a mean and variance, and the data contribute a sample mean and observation variance. This precision-weighting idea later supports hierarchical Normal models, Kalman-style updates, and Gaussian approximations.</p>",
    motivation: "<p>Normal-Normal updating estimates an unknown mean from noisy Normal measurements. Both the prior and the data are expressed as Normal information about the same mean. The posterior mean lands between the prior mean and the sample mean, with the more precise source receiving more weight.</p>" +
                "<p>Precision is inverse variance, so more precise sources count more. A low-variance sensor can move the posterior strongly, while a high-variance prior contributes only gentle shrinkage. The posterior variance also shrinks because combining independent information makes the unknown mean better determined.</p>",
    definition: "<p>Normal-Normal updating combines a Normal prior for an unknown mean with Normal observations by adding precisions.</p>" +
                "<p>$$m_n=v_n(m_0/v_0+n\\bar x/\\sigma^2).$$</p>" +
                "<p><b>Assumptions that matter:</b> The observation variance $\\sigma^2$ is known, observations are Normal and conditionally independent, and precision is inverse variance.</p>",
    symbols: [
      { sym: "$m_0,v_0$", desc: "prior mean and variance" },
      { sym: "$\\bar x$", desc: "sample mean" },
      { sym: "$\\sigma^2$", desc: " observation variance" },
      { sym: "$v_n,m_n$", desc: "posterior variance and mean" },
      { sym: "precision", desc: "$1/$variance" }
    ],
    derivation: [
      { do: "Write the prior kernel for $\\mu$.", result: "$\\exp[-(\\mu-m_0)^2/(2v_0)]$", why: "a Normal prior contributes a quadratic log density" },
      { do: "Write the likelihood kernel for $n$ Normal observations.", result: "$\\exp[-n(\\bar x-\\mu)^2/(2\\sigma^2)]$", why: "the sample mean carries the data information about $\\mu$" },
      { do: "Multiply kernels.", result: "log exponents add", why: "multiplication of exponentials adds their exponents" },
      { do: "Collect the $\\mu^2$ coefficient.", result: "$1/v_n=1/v_0+n/\\sigma^2$", why: "the quadratic coefficient is posterior precision" },
      { do: "Collect the linear $\\mu$ term.", result: "$m_n/v_n=m_0/v_0+n\\bar x/\\sigma^2$", why: "the linear coefficient determines precision times posterior mean" },
      { do: "Solve for the posterior mean.", result: "$$m_n=v_n(m_0/v_0+n\\bar x/\\sigma^2).$$", why: "divide by posterior precision, or multiply by posterior variance" }
    ],
    applications: [
      { title: "Worked delivery mean", background: "A delivery-time prior combines with a noisy sample mean.", numbers: "prior $10$, variance $4$, $n=9$, $\\bar x=13$, $\\sigma^2=9$ gives $m_n=12.4$, $v_n=0.8$." },
      { title: "Sensor averaging", background: "A precise sensor receives more weight than a broader prior.", numbers: "prior $20$ variance $4$ and sensor $23$ variance $1$ give mean $22.4$." },
      { title: "Weight shrinkage", background: "A coefficient estimate is shrunk toward its Normal prior mean.", numbers: "prior $0$ variance $1$ and data estimate $3$ variance $0.25$ give mean $2.4$." },
      { title: "Experiment lift", background: "A prior lift estimate combines with a more precise experiment estimate.", numbers: "prior $1\\%$ variance $4$ and estimate $5\\%$ variance $1$ give $4.2\\%$; this fixes the unclosed dollar sign." },
      { title: "Kalman update", background: "Prediction and measurement variances combine by precision addition.", numbers: "prediction variance $4$ and measurement variance $1$ give posterior variance $1/(1/4+1)=0.8$." },
      { title: "Rating aggregation", background: "A prior rating combines with several observed ratings.", numbers: "prior $3.5$ variance $1$ and four ratings with mean $4.5$ and rating variance $1$ give mean $(3.5+18)/5=4.3$." }
    ]
  },
  "math-20-08": {
    connectionsProse: "<p>This lesson returns to priors with a focus on weak prior information. Earlier lessons used priors as ordinary modeling inputs, often with visible pseudo-counts or variances. Here the goal is to understand what happens when a model tries to contribute as little information as possible. The lesson prepares the reader to treat default priors carefully in Bayesian workflows.</p>",
    motivation: "<p>A noninformative prior tries to add little information on a chosen scale. It is often used when the analyst wants the likelihood to dominate or when there is no strong historical information. Examples include a uniform Beta prior for a proportion or a very wide Normal prior for a regression coefficient.</p>" +
                "<p>Weak does not mean assumption-free, because flatness changes under reparameterization. A prior that is flat on a probability scale is not flat on an odds scale, and a flat scale prior may be improper unless the posterior normalizes after data are included. The lesson therefore treats noninformative priors as modeling choices that still need checks.</p>",
    definition: "<p>A noninformative prior is a weak prior chosen to add little information on a specified scale, such as $\\operatorname{Beta}(1,1)$ for a proportion or Jeffreys $\\operatorname{Beta}(1/2,1/2)$ for a different invariance goal.</p>" +
                "<p><b>Assumptions that matter:</b> Weak does not mean assumption-free; flatness depends on parameterization, and an improper prior must lead to a proper posterior after data are included.</p>",
    symbols: [
      { sym: "improper prior", desc: "total prior mass is infinite" },
      { sym: "proper posterior", desc: "the posterior normalizes" },
      { sym: "Jeffreys prior", desc: "invariant under smooth reparameterization" }
    ],
    applications: [
      { title: "Uniform CTR default", background: "A uniform prior supplies weak starting counts for a conversion rate.", numbers: "after $2$ conversions in $10$ visits, $\\operatorname{Beta}(1,1)$ gives mean $3/12=0.25$." },
      { title: "Jeffreys small sample", background: "Jeffreys prior gives a different weak update in a small sample.", numbers: "$\\operatorname{Beta}(0.5,0.5)$ plus $2$ successes and $8$ failures gives $2.5/11=0.227$." },
      { title: "Wide regression prior", background: "A very wide Normal prior barely penalizes a moderate coefficient.", numbers: "$\\mathcal N(0,100^2)$ makes coefficient $2$ only $0.02$ sd from the mean." },
      { title: "Flat location prior", background: "A flat location prior leaves posterior variance driven by the likelihood.", numbers: "with $n=5$ and observation variance $10$, posterior variance is $10/5=2$." },
      { title: "Scale sensitivity", background: "Equal-looking ranges can differ across parameter scales.", numbers: "$1$ to $10$ spans $9$ units on the original scale but $\\log 10=2.303$ on log scale." },
      { title: "One-trial caution", background: "A weak prior still prevents one success from implying certainty.", numbers: "one success with $\\operatorname{Beta}(1,1)$ gives posterior mean $2/3=0.667$, not $1$." }
    ]
  },
  "math-20-09": {
    connectionsProse: "<p>This lesson turns a posterior distribution into an uncertainty statement. Once the posterior has been computed, a learner often wants a range of plausible parameter values rather than only a mean. Credible intervals provide that range directly from posterior probability mass. They connect the update machinery of earlier lessons to reporting, monitoring, and decision support.</p>",
    motivation: "<p>A credible interval reports posterior probability mass for the parameter after the data are included. Under the chosen model, prior, and likelihood, a $95\\%$ credible interval contains $95\\%$ of the posterior distribution. This makes it a direct Bayesian statement about the uncertain parameter.</p>" +
                "<p>For a Normal posterior, the familiar mean plus or minus $1.96$ standard deviations gives the central $95\\%$ interval. For skewed or bounded posteriors, quantiles are usually better than a symmetric shortcut. In either case, the interval is a summary of the posterior, not a separate procedure from the Bayesian update.</p>",
    definition: "<p>An equal-tailed credible interval reports a central range containing a chosen amount of posterior probability.</p>" +
                "<p>$$[m-1.96s,m+1.96s].$$</p>" +
                "<p><b>Assumptions that matter:</b> The shortcut applies to an equal-tailed Normal posterior $\\theta\\mid D\\sim\\mathcal N(m,s^2)$; non-Normal posteriors should use posterior quantiles.</p>",
    symbols: [
      { sym: "$m$", desc: "posterior mean" },
      { sym: "$s$", desc: "posterior sd" },
      { sym: "$a,b$", desc: "interval endpoints" },
      { sym: "equal-tailed", desc: "$2.5\\%$ mass in each tail" }
    ],
    derivation: [
      { do: "Assume a Normal posterior.", result: "$\\theta\\mid D\\sim\\mathcal N(m,s^2)$", why: "the Normal shortcut uses the posterior mean and sd" },
      { do: "Standardize the parameter.", result: "$Z=(\\theta-m)/s$", why: "posterior probabilities can use the standard Normal table" },
      { do: "Use the central standard Normal interval.", result: "$[-1.96,1.96]$", why: "this interval contains about $95\\%$ of a standard Normal" },
      { do: "Undo the standardization.", result: "$$[m-1.96s,m+1.96s].$$", why: "rescaling returns to the original parameter units" },
      { do: "Use quantiles for non-Normal posteriors.", result: "posterior quantiles", why: "skewed or bounded posteriors are not summarized well by a symmetric Normal shortcut" }
    ],
    applications: [
      { title: "Worked Normal interval", background: "A Normal posterior mean and variance give a central credible interval.", numbers: "$m=12.4$, variance $0.8$, $s=0.894$ gives $[10.647,14.153]$." },
      { title: "A/B lift", background: "A lift posterior can be summarized by a rough Normal interval.", numbers: "$0.03\\pm1.96(0.015)=[0.0006,0.0594]$." },
      { title: "CTR uncertainty", background: "A CTR posterior mean and sd become an uncertainty range.", numbers: "$0.10\\pm1.96(0.03)$ gives $[0.041,0.159]$." },
      { title: "Latency mean", background: "A latency posterior interval stays in milliseconds.", numbers: "$120\\pm1.96(5)=[110.2,129.8]$ ms." },
      { title: "Calibration slope", background: "A slope interval shows plausible calibration values.", numbers: "$0.92\\pm1.96(0.04)=[0.842,0.998]$." },
      { title: "Beta interval", background: "A bounded posterior uses Beta quantiles instead of a Normal shortcut.", numbers: "$\\operatorname{Beta}(9,21)$ has equal-tailed $95\\%$ interval about $[0.153,0.472]$." }
    ]
  },
  "math-20-10": {
    connectionsProse: "<p>This lesson moves from uncertainty about parameters to uncertainty about future data. The posterior describes what is known about a parameter after observing data, but prediction requires one more step. Future observations vary both because the parameter is uncertain and because new data are noisy. Posterior predictive distributions carry both sources into the predictive quantity used by models and decisions.</p>",
    motivation: "<p>The posterior predictive distribution carries parameter uncertainty into uncertainty about new observations. It does not stop at estimating $\\theta$; it asks what data are likely next after averaging over the posterior uncertainty in $\\theta$. This is the distribution used when the practical task is forecasting, simulation, or model checking.</p>" +
                "<p>The load-bearing idea is integration over the posterior. For each possible parameter value, the sampling model gives a prediction for new data. The posterior predictive averages those predictions using the posterior as weights, so it predicts data, not just parameters.</p>",
    definition: "<p>The posterior predictive distribution averages the sampling model for future data over the posterior distribution of the parameter.</p>" +
                "<p>$$p(x_{new}\\mid D)=\\int p(x_{new}\\mid\\theta)p(\\theta\\mid D)d\\theta.$$</p>" +
                "<p><b>Assumptions that matter:</b> Future data are conditionally independent of old data given $\\theta$.</p>",
    symbols: [
      { sym: "$x_{new}$", desc: "future observation" },
      { sym: "$D$", desc: "observed data" },
      { sym: "predictive distribution", desc: "averages over the posterior" }
    ],
    derivation: [
      { do: "Start with the joint conditional density for future data and parameter.", result: "$p(x_{new},\\theta\\mid D)=p(x_{new}\\mid\\theta,D)p(\\theta\\mid D)$", why: "the multiplication rule factors the joint conditional density" },
      { do: "Apply conditional independence of future data and old data given $\\theta$.", result: "$p(x_{new}\\mid\\theta,D)=p(x_{new}\\mid\\theta)$", why: "once $\\theta$ is known, old data add no further predictive information" },
      { do: "Integrate out $\\theta$.", result: "$\\int p(x_{new}\\mid\\theta)p(\\theta\\mid D)d\\theta$", why: "$\\theta$ is still uncertain under the posterior" },
      { do: "Obtain the posterior predictive distribution.", result: "$$p(x_{new}\\mid D)=\\int p(x_{new}\\mid\\theta)p(\\theta\\mid D)d\\theta.$$", why: "predictions average over posterior parameter uncertainty" },
      { do: "Specialize to a Beta posterior for the next Bernoulli success.", result: "$\\mathbb E[\\theta]=a/(a+b)$", why: "the next-success probability is the posterior mean of $\\theta$" }
    ],
    applications: [
      { title: "Worked click forecast", background: "A Beta posterior predicts the next click probability and expected count.", numbers: "$\\operatorname{Beta}(9,21)$ gives next-click probability $9/30=0.30$ and expected $3$ clicks in $10$." },
      { title: "Ad clicks", background: "A campaign click posterior predicts a future batch of impressions.", numbers: "$\\operatorname{Beta}(20,180)$ gives next-click probability $0.10$ and expected $10$ clicks in $100$." },
      { title: "Inventory", background: "A predictive distribution compares stock against uncertain demand.", numbers: "predictive mean $500$, sd $60$, stock $620$ is $2$ sd above mean." },
      { title: "Predictive check", background: "Replicated data statistics reveal whether an observed statistic is extreme.", numbers: "$950$ of $1000$ replicated maxima below observed gives tail warning probability $0.95$ in the lower direction." },
      { title: "Bayesian ensemble", background: "Posterior model weights average predictions into one predictive value.", numbers: "weights $0.2,0.5,0.3$ on predictions $0.1,0.4,0.8$ give $0.46$." },
      { title: "Latency prediction", background: "Predictive uncertainty includes both mean uncertainty and observation noise.", numbers: "posterior mean variance $4$ plus observation noise variance $25$ gives predictive sd $\\sqrt{29}=5.39$ ms." }
    ]
  },
  "math-20-11": {
    connectionsProse: "<p>This lesson extends posterior updating from one parameter to many related parameters. Earlier lessons updated a single rate or mean; hierarchical models let many groups share information through a population distribution. This is the Bayesian form of partial pooling. It is especially useful when some groups have large samples and others have only a few observations.</p>",
    motivation: "<p>Hierarchical Bayes lets related groups learn together. Each group has its own parameter, but those parameters are tied together by a higher-level population pattern. A small group is therefore not estimated only from its own noisy data; it also borrows strength from related groups.</p>" +
                "<p>Small groups move toward the population pattern more strongly, while large groups keep more of their own data signal. This shrinkage is not an arbitrary correction. It comes from the same precision-weighting logic as the Normal-Normal model, with the group prior acting as population-level information.</p>",
    definition: "<p>A hierarchical model gives each group its own parameter while tying those parameters through a shared population distribution.</p>" +
                "<p>$$m_j=v_j(\\mu/\\tau^2+\\bar y_j/(\\sigma^2/n_j)).$$</p>" +
                "<p><b>Assumptions that matter:</b> For the displayed Normal group update, variances are known, $\\bar y_j\\mid\\theta_j\\sim\\mathcal N(\\theta_j,\\sigma^2/n_j)$, and $\\theta_j\\sim\\mathcal N(\\mu,\\tau^2)$.</p>",
    symbols: [
      { sym: "$j$", desc: "group index" },
      { sym: "$i$", desc: "observation index" },
      { sym: "$\\theta_j$", desc: "group parameter" },
      { sym: "$\\mu,\\tau^2$", desc: "population mean and between-group variance" },
      { sym: "partial pooling", desc: "weighted shrinkage toward the group prior" }
    ],
    derivation: [
      { do: "Model the group sample mean.", result: "$\\bar y_j\\mid\\theta_j\\sim\\mathcal N(\\theta_j,\\sigma^2/n_j)$", why: "the group mean is a noisy observation of the group parameter" },
      { do: "Set the group prior.", result: "$\\theta_j\\sim\\mathcal N(\\mu,\\tau^2)$", why: "the population distribution ties groups together" },
      { do: "Apply the Normal-Normal update.", result: "prior variance $\\tau^2$ and observation variance $\\sigma^2/n_j$", why: "the group update has the same precision-weighted form" },
      { do: "Write the posterior mean.", result: "$$m_j=v_j(\\mu/\\tau^2+\\bar y_j/(\\sigma^2/n_j)).$$", why: "posterior mean is posterior variance times total precision-weighted information" },
      { do: "Inspect the effect of group size.", result: "as $n_j$ grows, $\\sigma^2/n_j$ shrinks", why: "data precision grows and pooling weakens for large groups" }
    ],
    applications: [
      { title: "Worked hospital mean", background: "A small hospital estimate partially pools toward the population mean.", numbers: "$n=4$, $\\bar y=12$, $\\mu=10$, $\\tau^2=9$, $\\sigma^2=36$ gives equal variances $9$ and posterior mean $11$." },
      { title: "Hospital complication", background: "A sparse hospital complication rate is shrunk toward a prior rate.", numbers: "$2/5$ raw with prior $\\operatorname{Beta}(8,92)$ gives posterior mean $10/105=0.095$." },
      { title: "Market lift", background: "A segment lift estimate combines with a population prior.", numbers: "prior $1\\%$ and segment estimate $3\\%$ with equal precision give $2\\%$." },
      { title: "Sparse user", background: "A user's tiny sample is stabilized by prior user-preference counts.", numbers: "prior $\\operatorname{Beta}(9,11)$ plus one like in one view gives $10/21=0.476$." },
      { title: "Classroom effect", background: "A class average is partially pooled toward the district pattern.", numbers: "class mean $88$ and district prior $80$ with equal sd $4$ gives posterior mean $84$." },
      { title: "Meta-analysis", background: "A study estimate combines with a population-level prior estimate.", numbers: "study $0.30$ variance $0.04$ and population $0.10$ variance $0.01$ give mean $0.14$." }
    ]
  },
  "math-20-12": {
    connectionsProse: "<p>This lesson applies Bayes' rule to whole models rather than single parameter values. Earlier posterior updates asked which parameter values were plausible inside one model. Model comparison asks which model is plausible after seeing the data. The evidence from the next lesson and the Bayes factor introduced here become central tools for Bayesian selection and averaging.</p>",
    motivation: "<p>Bayesian model comparison updates probabilities over whole models. A model can have its own prior probability, its own parameter prior, and its own likelihood. After the data arrive, the posterior probability of the model depends on how much prior predictive probability the model assigned to those data.</p>" +
                "<p>The evidence rewards models that assigned high prior predictive probability to the observed data, not just models that fit after tuning. This naturally balances fit and complexity. A flexible model may fit many data sets, but it can spread prior predictive mass thinly; a simpler model can win when it predicted the observed pattern more concentratedly.</p>",
    definition: "<p>Bayesian model comparison treats the model index as an uncertain hypothesis and updates model probabilities with each model's evidence.</p>" +
                "<p>$$p(M_k\\mid y)=\\frac{p(y\\mid M_k)p(M_k)}{p(y)}.$$</p>" +
                "<p><b>Assumptions that matter:</b> Candidate models have prior probabilities, evidences are comparable for the same observed data, and the normalizer sums over the candidate model set.</p>",
    symbols: [
      { sym: "$M_k$", desc: "candidate model" },
      { sym: "$p(M_k)$", desc: "model prior" },
      { sym: "$p(y\\mid M_k)$", desc: "evidence" },
      { sym: "Bayes factor", desc: "an evidence ratio" }
    ],
    derivation: [
      { do: "Treat the model index as uncertain.", result: "$M_k$", why: "model comparison updates hypotheses over models" },
      { do: "Apply Bayes' rule to the model index.", result: "$$p(M_k\\mid y)=\\frac{p(y\\mid M_k)p(M_k)}{p(y)}.$$", why: "the model posterior is proportional to evidence times model prior" },
      { do: "Sum over candidate models for the normalizer.", result: "$p(y)=\\sum_r p(y\\mid M_r)p(M_r)$", why: "all candidate model weights must normalize to one" },
      { do: "Divide two posterior probabilities for two models.", result: "posterior odds", why: "odds compare two model posteriors directly" },
      { do: "Rearrange terms.", result: "posterior odds = prior odds $\\times$ Bayes factor", why: "the evidence ratio multiplies the prior odds" }
    ],
    applications: [
      { title: "Worked comparison", background: "Two model weights normalize into a posterior model probability.", numbers: "priors $0.6,0.4$ and evidences $0.03,0.01$ give posterior $0.018/(0.018+0.004)=0.818$ for $M_1$." },
      { title: "Feature sets", background: "Equal model priors make posterior odds follow evidence ratios.", numbers: "evidences $0.004,0.012$ with equal priors give $0.75$ for set B." },
      { title: "A/B lift model", background: "A Bayes factor updates prior odds for a lift model.", numbers: "prior odds $1:1$ and Bayes factor $5$ give posterior probability $5/6=0.833$." },
      { title: "Theory comparison", background: "A strong evidence ratio can overcome lower prior odds.", numbers: "evidence ratio $20$ and prior odds $1:4$ give posterior odds $5:1$." },
      { title: "Forecast model", background: "Prior model weights and evidences combine before normalization.", numbers: "weights $0.7(0.02)=0.014$ and $0.3(0.03)=0.009$ give posterior $0.609$ for the first model." },
      { title: "Architecture approximation", background: "Log evidence differences become Bayes factors by exponentiation.", numbers: "log evidences $-120$ and $-118$ give Bayes factor $e^2=7.39$ for the second." }
    ]
  },
  "math-20-13": {
    connectionsProse: "<p>This lesson focuses on the normalizing quantity that has appeared in Bayes' rule since the first lesson. For parameter inference, evidence makes the posterior integrate to one. For model comparison, the same quantity becomes the score for an entire model. Understanding evidence clarifies why Bayesian comparison depends on prior predictive performance rather than only best-fit likelihood.</p>",
    motivation: "<p>Evidence is the prior predictive probability of the observed data under a model. Before seeing the data, the model spreads probability across possible data sets by combining its parameter prior with its likelihood. The evidence is the amount of that probability mass assigned to the data that actually appeared.</p>" +
                "<p>This quantity is both the denominator of Bayes' rule and the score used in Bayesian model comparison. Inside one model, it normalizes the posterior over parameters. Across models, evidence ratios become Bayes factors, so models are rewarded for predicting the observed data well before their parameters are tuned to them.</p>",
    definition: "<p>The model evidence is the prior predictive probability of the observed data under a model, found by summing or integrating over unknown parameters.</p>" +
                "<p>$$p(y\\mid M)=\\int p(y\\mid\\theta,M)p(\\theta\\mid M)d\\theta.$$</p>" +
                "<p><b>Assumptions that matter:</b> The likelihood and parameter prior are specified under the same model $M$, and the integral or sum over $\\theta$ is finite.</p>",
    symbols: [
      { sym: "$M$", desc: "model" },
      { sym: "$y$", desc: "observed data" },
      { sym: "$\\theta$", desc: "parameter" },
      { sym: "marginal likelihood", desc: "the same quantity as evidence" }
    ],
    derivation: [
      { do: "Start from the joint model.", result: "$p(y,\\theta\\mid M)=p(y\\mid\\theta,M)p(\\theta\\mid M)$", why: "the multiplication rule factors data and parameter under a model" },
      { do: "Sum or integrate over unknown $\\theta$.", result: "data probability under the whole model", why: "evidence averages the likelihood over the prior" },
      { do: "Write the continuous-parameter evidence.", result: "$$p(y\\mid M)=\\int p(y\\mid\\theta,M)p(\\theta\\mid M)d\\theta.$$", why: "integration removes the unknown parameter" },
      { do: "Substitute the evidence into Bayes' rule.", result: "$p(\\theta\\mid y,M)$ is normalized", why: "the evidence is the denominator that makes posterior mass one" },
      { do: "Compute a simple uniform-prior coin evidence.", result: "$\\int_0^1 \\theta^2(1-\\theta)d\\theta=1/12=0.0833$", why: "for exact sequence HHT, the likelihood kernel is $\\theta^2(1-\\theta)$" }
    ],
    applications: [
      { title: "Posterior normalization", background: "Evidence rescales an unnormalized posterior into a density.", numbers: "if likelihood times prior integrates to $0.05$, dividing by $0.05$ makes posterior area $1$." },
      { title: "Bayes factor", background: "Two model evidences form a model-comparison ratio.", numbers: "evidences $0.009$ and $0.003$ give factor $3$." },
      { title: "Occam comparison", background: "A model with larger prior predictive probability is favored.", numbers: "evidence $0.10$ beats $0.02$ by ratio $5$." },
      { title: "Anomaly detection", background: "Small prior predictive probability flags an observation as surprising.", numbers: "prior predictive $0.0004$ is $100$ times smaller than $0.04$." },
      { title: "Language sequence", background: "A sequence's prior predictive probability gives a log score.", numbers: "token probabilities $0.5,0.2,0.1$ give evidence $0.01$ and log score $-4.605$." },
      { title: "Empirical Bayes", background: "Evidence can choose among prior-scale settings.", numbers: "prior scale evidence $0.006$ versus $0.002$ favors scale $1$ by factor $3$." }
    ]
  },
  "math-20-14": {
    connectionsProse: "<p>This lesson begins the approximate inference block after exact updating, evidence, and model comparison. Many Bayesian posteriors cannot be integrated exactly, but they may still have a clear local shape near a mode. The Laplace approximation uses calculus to turn that local shape into a Gaussian approximation. It prepares the reader for later methods that approximate hard posteriors in different ways.</p>",
    motivation: "<p>Laplace approximation replaces a smooth, peaked posterior by a Gaussian fitted at the posterior mode. Near the mode, the log posterior can often be well approximated by a quadratic function. Exponentiating a quadratic gives a Normal shape, so the approximation converts local curvature into variance.</p>" +
                "<p>This is useful because a hard integral can become a Gaussian calculation. The approximation is best when the posterior is unimodal and locally symmetric enough for a quadratic to describe its important mass. The curvature at the mode controls uncertainty: sharper curvature means smaller variance, while flat curvature means a wider or unreliable Gaussian approximation.</p>",
    definition: "<p>The Laplace approximation fits a Gaussian to a smooth posterior at its mode by using the local quadratic curvature of the log posterior.</p>" +
                "<p>$$\\ell(\\theta)\\approx\\ell(\\hat\\theta)-\\tfrac12(\\theta-\\hat\\theta)^TH(\\theta-\\hat\\theta)$$</p>" +
                "<p><b>Assumptions that matter:</b> The posterior is smooth, peaked near a mode, and locally well approximated by a quadratic with negative Hessian $H=-\\nabla^2\\ell(\\hat\\theta)$.</p>",
    symbols: [
      { sym: "$\\hat\\theta$", desc: "posterior mode or MAP" },
      { sym: "$H$", desc: "negative Hessian at the mode" },
      { sym: "$H^{-1}$", desc: "approximate covariance" },
      { sym: "curvature", desc: "inverse variance locally" }
    ],
    derivation: [
      { do: "Define the unnormalized log posterior.", result: "$\\ell(\\theta)=\\log\\tilde p(\\theta)$", why: "Laplace works on the log posterior shape" },
      { do: "Expand $\\ell$ to second order at the mode.", result: "a Taylor approximation at $\\hat\\theta$", why: "local quadratic behavior determines the Gaussian approximation" },
      { do: "Drop the first derivative term.", result: "$\\ell'(\\hat\\theta)=0$", why: "the derivative vanishes at the mode" },
      { do: "Write the remaining quadratic.", result: "$$\\ell(\\theta)\\approx\\ell(\\hat\\theta)-\\tfrac12(\\theta-\\hat\\theta)^TH(\\theta-\\hat\\theta)$$", why: "$H=-\\nabla^2\\ell(\\hat\\theta)$ gives positive local precision" },
      { do: "Exponentiate the quadratic.", result: "Gaussian with covariance $H^{-1}$", why: "the exponential of a negative quadratic is a Normal kernel" }
    ],
    applications: [
      { title: "Worked quadratic", background: "A quadratic log posterior directly reveals Gaussian variance.", numbers: "$\\ell(\\theta)=C-8(\\theta-3)^2$ has $H=16$, so approximation is $\\mathcal N(3,1/16)$." },
      { title: "MAP interval", background: "Curvature at a posterior mode determines approximate sd.", numbers: "curvature $100$ gives sd $0.1$." },
      { title: "Logistic regression", background: "A last-step Hessian gives approximate weight uncertainty.", numbers: "$H=25$ gives weight variance $0.04$ and sd $0.2$." },
      { title: "Last-layer BDL", background: "A Bayesian last layer can use curvature for approximate uncertainty.", numbers: "curvature $16$ gives sd $0.25$." },
      { title: "Occam factor", background: "Equal peaks with different widths produce different evidence approximations.", numbers: "same peak $0.1$ with width factors $0.2$ and $0.05$ gives evidences $0.02$ and $0.005$." },
      { title: "Curvature diagnostic", background: "Flat curvature means the Gaussian approximation cannot produce finite variance.", numbers: "$\\ell''(\\hat\\theta)=-9$ gives variance $1/9$; zero curvature gives no finite Gaussian variance." }
    ]
  },
  "math-20-15": {
    connectionsProse: "<p>This lesson builds on Bayes' rule, model evidence, KL divergence, and posterior predictive thinking. Earlier lessons treated the posterior as the object we want; this lesson addresses the common case where that posterior is too expensive to compute exactly. The model may contain many latent variables, many parameters, or both, so the normalizing integral is not something we can evaluate directly.</p>" +
                      "<p>Variational inference keeps the Bayesian target but changes the computational problem. Instead of sampling from the exact posterior or integrating it in closed form, we choose a tractable family of distributions and optimize within that family. This connects Bayesian statistics to the optimization tools used throughout modern machine learning, including topic models, Bayesian neural networks, and variational autoencoders.</p>",
    motivation: "<p>Exact Bayesian inference asks for the full posterior $p(z\\mid x)$, where $z$ may be a hidden topic mixture, a latent embedding, a cluster assignment, or a neural-network weight. In many real models, that posterior is known only up to a normalizing constant. The numerator can be evaluated, but the evidence in the denominator requires a high-dimensional integral.</p>" +
                "<p>Variational inference replaces that hard posterior with a simpler distribution $q(z)$. The approximation family might be fully factorized, Gaussian, amortized by an encoder network, or chosen for a particular model. The goal is not to pretend $q$ is exact. The goal is to make the best approximation available inside the chosen family.</p>" +
                "<p>The evidence lower bound, or ELBO, is the objective that makes this practical. Maximizing the ELBO is equivalent to minimizing $\\operatorname{KL}(q(z)\\|p(z\\mid x))$ because the two quantities add up to the fixed number $\\log p(x)$. When the ELBO rises, the KL gap to the true posterior falls, as long as the model and variational family are held fixed.</p>",
    definition: "<p>Variational inference approximates an intractable posterior with a tractable distribution $q(z)$ by maximizing the evidence lower bound.</p>" +
                "<p>$$\\operatorname{ELBO}(q)=\\mathbb E_q[\\log p(x,z)]-\\mathbb E_q[\\log q(z)]$$</p>" +
                "<p><b>Assumptions that matter:</b> The variational distribution is chosen from a tractable family, and the model joint density $p(x,z)$ can be evaluated inside expectations under $q$.</p>",
    symbols: [
      { sym: "$x$", desc: "observed data" },
      { sym: "$z$", desc: "the latent variable or parameter being approximated" },
      { sym: "$q(z)$", desc: "chosen variational distribution" },
      { sym: "$p(x,z)$", desc: "joint model" },
      { sym: "$p(z\\mid x)$", desc: "exact posterior" },
      { sym: "$\\mathbb E_q$", desc: "expectation under $q$" },
      { sym: "KL", desc: "measures the approximation gap in the chosen direction" }
    ],
    derivation: [
      { do: "Start with the KL divergence to the true posterior.", result: "$\\operatorname{KL}(q(z)\\|p(z\\mid x))=\\mathbb E_q[\\log q(z)-\\log p(z\\mid x)]$", why: "KL is an expected log ratio" },
      { do: "Use Bayes' rule inside the logarithm.", result: "$\\log p(z\\mid x)=\\log p(x,z)-\\log p(x)$", why: "$p(z\\mid x)=p(x,z)/p(x)$" },
      { do: "Substitute that expression.", result: "$\\operatorname{KL}=\\mathbb E_q[\\log q(z)-\\log p(x,z)+\\log p(x)]$", why: "the posterior log is replaced by joint log minus evidence log" },
      { do: "Pull out $\\log p(x)$.", result: "$\\operatorname{KL}=\\mathbb E_q[\\log q(z)]-\\mathbb E_q[\\log p(x,z)]+\\log p(x)$", why: "$\\log p(x)$ does not depend on $z$" },
      { do: "Rearrange one term at a time.", result: "$\\log p(x)=\\mathbb E_q[\\log p(x,z)]-\\mathbb E_q[\\log q(z)]+\\operatorname{KL}(q\\|p)$", why: "moving terms isolates the fixed log evidence" },
      { do: "Name the first two terms the ELBO.", result: "$\\log p(x)=\\operatorname{ELBO}(q)+\\operatorname{KL}(q(z)\\|p(z\\mid x))$", why: "the ELBO plus KL gap equals log evidence" },
      { do: "Use nonnegativity of KL divergence.", result: "$\\operatorname{ELBO}(q)\\le \\log p(x)$", why: "KL divergence cannot be negative" },
      { do: "Compute the worked arithmetic.", result: "if $\\mathbb E_q[\\log p(x,z)]=-190$ and $\\mathbb E_q[\\log q(z)]=-40$, then $\\operatorname{ELBO}=-190-(-40)=-150$; if $\\log p(x)=-130$, then the KL gap is $-130-(-150)=20$ nats", why: "the identity separates the lower bound from the KL gap" }
    ],
    applications: [
      { title: "Latent Dirichlet allocation", background: "Topic weights in a document can be represented by variational probabilities.", numbers: "A document with topic weights $[0.7,0.2,0.1]$ stores three variational probabilities that sum to $1.0$." },
      { title: "Bayesian neural networks", background: "A variational weight distribution can be sampled by reparameterization.", numbers: "A variational weight $q(w)=\\mathcal N(0.8,0.1^2)$ is sampled as $w=0.8+0.1\\epsilon$; at $\\epsilon=2$, the sample is $1.0$." },
      { title: "Variational autoencoders", background: "An encoder output becomes a latent sample through the reparameterization trick.", numbers: "If the encoder outputs $\\mu=2$ and $\\sigma=0.5$, the reparameterized latent sample at $\\epsilon=-1$ is $z=1.5$." },
      { title: "Recommendation models", background: "Mean-field factor means can produce a predicted score.", numbers: "Mean-field user and item factor means $[1.0,0.5]$ and $[0.2,2.0]$ give predicted score $1.0(0.2)+0.5(2.0)=1.2$." },
      { title: "Streaming approximate Bayes", background: "An improving ELBO tracks progress in approximate posterior fitting.", numbers: "Raising an ELBO from $-1000$ to $-940$ improves the bound by $60$ nats." },
      { title: "Uncertainty dashboards", background: "A Gaussian variational posterior gives a rough uncertainty interval.", numbers: "If $q(\\theta)=\\mathcal N(0.03,0.01^2)$, the rough $95\\%$ interval is $0.03\\pm1.96(0.01)=[0.0104,0.0496]$." }
    ]
  },
  "math-20-16": {
    connectionsProse: "<p>This lesson follows variational inference by showing another lower-bound method for latent-variable models. The posterior over hidden structure may be hard to work with directly, but it can often be summarized through responsibilities. EM alternates between estimating that hidden structure softly and updating parameters. It connects Bayesian posterior thinking to mixture models, hidden Markov models, missing data, and classical maximum likelihood.</p>",
    motivation: "<p>EM fits models with hidden variables by alternating between soft completion of missing structure and parameter updates using those soft completions. Instead of choosing one hard cluster assignment, missing value, or hidden path, the E-step computes a posterior distribution over the hidden variable under the current parameters.</p>" +
                "<p>The M-step then treats those posterior responsibilities as weights when updating the parameters. The bound view explains why this works: the E-step makes a lower bound tight at the current parameter, and the M-step improves that bound. With exact steps, the observed likelihood does not decrease.</p>",
    definition: "<p>Expectation-maximization fits latent-variable models by alternating posterior responsibility computation with parameter updates that improve a lower bound.</p>" +
                "<p>$$\\mathbb E_q[\\log p(y,z\\mid\\theta)]-\\mathbb E_q[\\log q(z)].$$</p>" +
                "<p><b>Assumptions that matter:</b> Hidden variables $z$ are summed or integrated out in the observed likelihood, and the E-step uses $q(z)=p(z\\mid y,\\theta^{(t)})$ when exact EM is available.</p>",
    symbols: [
      { sym: "$z$", desc: "hidden variable" },
      { sym: "$q(z)$", desc: "responsibility distribution" },
      { sym: "E-step", desc: "computes posterior responsibilities" },
      { sym: "M-step", desc: "updates parameters" }
    ],
    derivation: [
      { do: "Write the observed likelihood.", result: "$p(y\\mid\\theta)=\\sum_z p(y,z\\mid\\theta)$", why: "hidden variables are marginalized out" },
      { do: "Insert any distribution $q(z)$.", result: "$p(y\\mid\\theta)=\\sum_z q(z)p(y,z\\mid\\theta)/q(z)$", why: "multiplying and dividing by $q(z)$ creates an expectation" },
      { do: "Take logs and apply Jensen's inequality.", result: "the log moves inside the average as a lower bound", why: "log is concave" },
      { do: "Write the lower bound.", result: "$$\\mathbb E_q[\\log p(y,z\\mid\\theta)]-\\mathbb E_q[\\log q(z)].$$", why: "the bound separates expected complete-data log likelihood and entropy" },
      { do: "Choose the E-step distribution.", result: "$q(z)=p(z\\mid y,\\theta^{(t)})$", why: "this makes the bound tight at the current parameter" },
      { do: "Increase the bound in the M-step.", result: "exact EM does not decrease observed likelihood", why: "the M-step improves the tight lower bound with respect to $\\theta$" }
    ],
    applications: [
      { title: "Worked Gaussian mixture", background: "Responsibilities weight points when updating mixture means.", numbers: "responsibilities $(0.8,0.3)$ for points $2,8$ update cluster-1 mean to $3.636$; responsibilities $(0.2,0.7)$ update cluster-2 mean to $6.667$." },
      { title: "Soft clustering", background: "A point contributes fractionally rather than choosing one cluster hard.", numbers: "responsibility $0.8$ makes one point contribute $80\\%$ to cluster 1." },
      { title: "Missing data", background: "Posterior imputation can fill in a missing value for a parameter update.", numbers: "imputed posterior mean $5$ in $[3,7,5]$ gives mean $5$." },
      { title: "HMM transition", background: "Expected hidden transition counts update a transition probability.", numbers: "expected $A\\to B$ count $12$ out of $40$ updates probability to $0.30$." },
      { title: "Crowdsourcing", background: "Expected correctness from latent labels updates worker reliability.", numbers: "expected $45$ correct of $50$ tasks gives worker reliability $0.90$." },
      { title: "Latent user type", background: "Responsibilities average type-specific like rates.", numbers: "responsibilities $[0.2,0.8]$ and like rates $[0.1,0.6]$ give $0.50$." }
    ]
  },
  "math-20-17": {
    connectionsProse: "<p>This lesson introduces sampling as a different answer to intractable posteriors. Variational inference chooses a tractable approximation family, and Laplace uses a Gaussian near a mode. MCMC instead constructs samples whose long-run distribution is the posterior. Those samples can then approximate means, intervals, predictive checks, and decision quantities.</p>",
    motivation: "<p>MCMC estimates a posterior by constructing a dependent sequence of samples whose long-run distribution is the posterior. The samples are not independent, but if the chain is designed correctly and run carefully, averages over the chain approximate posterior expectations.</p>" +
                "<p>It is useful when the posterior can be evaluated only up to a constant. In Metropolis-Hastings, the evidence cancels in the acceptance ratio, so the sampler can compare unnormalized posterior densities. The tradeoff is diagnostic: the analyst must pay attention to burn-in, mixing, autocorrelation, and effective sample size.</p>",
    definition: "<p>MCMC constructs a dependent sample sequence whose stationary distribution is the posterior, then estimates posterior quantities with sample averages.</p>" +
                "<p><b>Assumptions that matter:</b> In Metropolis-Hastings, proposals come from $q(\\theta'\\mid\\theta)$, acceptance preserves the target stationary distribution, and diagnostics must check burn-in, mixing, autocorrelation, and effective sample size.</p>",
    symbols: [
      { sym: "$q$", desc: "proposal distribution" },
      { sym: "$a$", desc: "acceptance probability" },
      { sym: "burn-in", desc: "early samples discarded" },
      { sym: "effective sample size", desc: "accounts for correlation" }
    ],
    derivation: [
      { do: "Propose a new parameter value.", result: "$\\theta'$ from $q(\\theta'\\mid\\theta)$", why: "the proposal distribution defines candidate moves" },
      { do: "Compare desired forward and reverse flow.", result: "flow from $\\theta$ to $\\theta'$ versus from $\\theta'$ to $\\theta$", why: "balanced flow preserves the target distribution" },
      { do: "Use the Metropolis-Hastings ratio.", result: "$p(\\theta'\\mid y)q(\\theta\\mid\\theta')/[p(\\theta\\mid y)q(\\theta'\\mid\\theta)]$", why: "the ratio corrects for target density and proposal asymmetry" },
      { do: "Substitute the posterior up to proportionality.", result: "$p(y\\mid\\theta)p(\\theta)$", why: "the evidence cancels in the ratio" },
      { do: "Accept with the smaller of $1$ and the ratio.", result: "target stationary distribution is preserved", why: "acceptance correction balances moves" },
      { do: "Estimate posterior expectations.", result: "sample averages", why: "long-run averages over the chain approximate posterior expectations" }
    ],
    applications: [
      { title: "Worked acceptance", background: "A symmetric proposal to a higher-density point is always accepted.", numbers: "symmetric proposal from density $0.04$ to $0.10$ gives acceptance $1$." },
      { title: "Reverse move", background: "A symmetric proposal to a lower-density point is accepted with the density ratio.", numbers: "symmetric proposal from $0.10$ to $0.04$ gives acceptance $0.4$." },
      { title: "Hierarchy summary", background: "Posterior draws summarize a hierarchical parameter's uncertainty.", numbers: "$4000$ draws with mean $1.2$ and sd $0.3$ give rough interval $[0.6,1.8]$." },
      { title: "Posterior predictive check", background: "Replicated statistics from posterior samples estimate a tail probability.", numbers: "$30$ of $100$ replicated statistics above observed gives tail probability $0.30$." },
      { title: "Lift probability", background: "Sample proportions estimate posterior event probabilities.", numbers: "$950$ of $1000$ positive samples gives $P(lift>0)=0.95$." },
      { title: "Decision utility", background: "Utilities averaged over posterior draws estimate expected utility.", numbers: "utilities $10,8,-2,6$ average to $5.5$." }
    ]
  },
  "math-20-18": {
    connectionsProse: "<p>This lesson brings Bayesian inference to functions rather than finite-dimensional parameter vectors. A Gaussian process prior says that any finite collection of function values has a joint Normal distribution. Conditioning that prior on observed data gives predictions and uncertainty at new inputs. This makes GP regression a clean bridge between Bayesian updating and flexible nonparametric modeling.</p>",
    motivation: "<p>A Gaussian process is a prior over functions. Before data are observed, the kernel describes which input points should have similar function values and how variable the function can be. Observed points then condition the function prior, just as observed measurements condition a Normal prior in the Normal-Normal model.</p>" +
                "<p>Regression produces a predictive mean and uncertainty at new inputs. The mean is pulled toward observed values that are strongly correlated with the test point, while the variance falls when nearby or highly correlated observations explain the test value. The kernel is therefore the modeling choice that controls smoothness, similarity, and extrapolation.</p>",
    definition: "<p>Gaussian process regression conditions a joint Normal prior over training and test function values to get a predictive mean and variance at new inputs.</p>" +
                "<p>$$\\begin{bmatrix}y\\ f_*\\end{bmatrix}\\sim\\mathcal N\\left(0,\\begin{bmatrix}K+\\sigma_n^2I&k_*\\k_*^T&k_{**}\\end{bmatrix}\\right).$$</p>" +
                "<p><b>Assumptions that matter:</b> Any finite collection of function values is jointly Normal under the GP prior, with covariance determined by the kernel and observation noise variance $\\sigma_n^2$.</p>",
    symbols: [
      { sym: "$K$", desc: "training covariance matrix" },
      { sym: "$k_*$", desc: "covariances between test and training inputs" },
      { sym: "$k_{**}$", desc: "prior variance at the test input" },
      { sym: "$\\sigma_n^2$", desc: "noise variance" },
      { sym: "kernel", desc: "covariance function" }
    ],
    derivation: [
      { do: "Write the joint Normal distribution for training values and one test value.", result: "$$\\begin{bmatrix}y\\ f_*\\end{bmatrix}\\sim\\mathcal N\\left(0,\\begin{bmatrix}K+\\sigma_n^2I&k_*\\k_*^T&k_{**}\\end{bmatrix}\\right).$$", why: "a GP prior makes any finite set of function values jointly Normal" },
      { do: "Apply the multivariate Normal conditioning formula.", result: "conditional Normal prediction", why: "conditioning a joint Normal gives a Normal conditional distribution" },
      { do: "Write the conditional mean.", result: "$k_*^T(K+\\sigma_n^2I)^{-1}y$", why: "test-training covariance weights the observed values" },
      { do: "Write the conditional variance.", result: "$k_{**}-k_*^T(K+\\sigma_n^2I)^{-1}k_*$", why: "prior variance is reduced by variance explained through training data" },
      { do: "Reduce to the one-point noiseless case.", result: "covariance ratio times the observed value and prior variance minus explained variance", why: "the matrix formula becomes a scalar conditioning update" }
    ],
    applications: [
      { title: "Worked one-point GP", background: "A single correlated observation updates a test point's mean and variance.", numbers: "$k_*=0.5$, $k_{**}=1$, observed $y=2$ gives mean $1.0$ and variance $0.75$." },
      { title: "Bayesian optimization", background: "An upper confidence score combines mean and uncertainty.", numbers: "mean $0.6$, sd $0.2$ gives upper confidence $1.0$." },
      { title: "Spatial interpolation", background: "A correlated measurement pulls a nearby prediction toward the measured value.", numbers: "correlation $0.5$ with measured value $10$ predicts $5$." },
      { title: "RBF time kernel", background: "A radial-basis kernel turns distance and length scale into covariance.", numbers: "length scale $2$ and distance $1$ gives covariance $e^{-1/8}=0.882$." },
      { title: "Robotics calibration", background: "A GP-style bias estimate carries posterior uncertainty in physical units.", numbers: "bias mean $0.03$ m and sd $0.01$ gives rough interval $[0.01,0.05]$ m." },
      { title: "Small-data regression", background: "A highly correlated training value strongly influences a noiseless prediction.", numbers: "covariance $0.8$ to value $5$ gives noiseless prediction $4$." }
    ]
  },
  "math-20-19": {
    connectionsProse: "<p>This capstone lesson connects the section's Bayesian ideas to modern neural-network uncertainty. Earlier lessons introduced posteriors, posterior predictive distributions, Laplace approximation, variational inference, MCMC, and Gaussian processes. Bayesian deep learning uses those ideas to reason about plausible weights, functions, or last-layer parameters. The goal is prediction with uncertainty, not only a single neural-network output.</p>",
    motivation: "<p>Bayesian deep learning averages predictions across plausible neural-network weights, functions, or last-layer parameters. A single trained network gives one prediction, but a Bayesian treatment keeps track of the fact that many settings of the model may still be plausible after the data. Averaging across those settings gives a posterior predictive distribution.</p>" +
                "<p>Its capstone role is to connect the section's posterior, predictive, VI, Laplace, MCMC, and GP ideas to modern ML uncertainty. Different approximations represent the posterior in different ways, but the predictive target is the same. Disagreement across plausible models measures epistemic uncertainty, while noise that remains even for a fixed model is aleatoric uncertainty.</p>",
    definition: "<p>Bayesian deep learning predicts by averaging neural-network outputs over plausible posterior weights or approximations to those weights.</p>" +
                "<p>$$p(y_*\\mid x_*,D)=\\int p(y_*\\mid x_*,w)p(w\\mid D)dw.$$</p>" +
                "<p><b>Assumptions that matter:</b> Exact integration over neural-network weights is usually intractable, so samples or approximations represent the posterior predictive target.</p>",
    symbols: [
      { sym: "$x_*$", desc: "new input" },
      { sym: "$y_*$", desc: "new output" },
      { sym: "$w$", desc: "neural-network weights" },
      { sym: "$S$", desc: "posterior samples" },
      { sym: "epistemic uncertainty", desc: "comes from model uncertainty" },
      { sym: "aleatoric uncertainty", desc: "comes from data noise" }
    ],
    derivation: [
      { do: "Begin with the posterior predictive target.", result: "$$p(y_*\\mid x_*,D)=\\int p(y_*\\mid x_*,w)p(w\\mid D)dw.$$", why: "prediction averages over posterior uncertainty in weights" },
      { do: "Recognize the integration difficulty.", result: "exact integration over neural-network weights is usually intractable", why: "modern networks have many weights and complex posteriors" },
      { do: "Draw or approximate posterior weight samples.", result: "$w^{(s)}$ for $s=1,\\ldots,S$", why: "samples or approximations represent plausible weights" },
      { do: "Replace the integral by a Monte Carlo average.", result: "$\\frac1S\\sum_s p(y_*\\mid x_*,w^{(s)})$", why: "averaging sampled predictions approximates the posterior predictive integral" },
      { do: "Estimate epistemic uncertainty.", result: "disagreement across samples", why: "model uncertainty appears as variation among plausible models" },
      { do: "Keep aleatoric uncertainty separate.", result: "noise predicted even by one fixed model", why: "data noise remains even when model parameters are known" }
    ],
    applications: [
      { title: "Worked classifier", background: "Posterior predictive class probabilities can be averaged and inspected for uncertainty.", numbers: "probabilities $0.70,0.60,0.20$ average to $0.50$, sample variance is $0.07$, and binary entropy is $0.693$ nats." },
      { title: "Medical triage", background: "Multiple plausible models average into a risk estimate.", numbers: "risk samples $0.12,0.18,0.30$ average to $0.20$." },
      { title: "Autonomous perception", background: "Prediction disagreement flags epistemic uncertainty in perception.", numbers: "predictions $0.1,0.2,0.8,0.7,0.2$ average to $0.40$ with high disagreement." },
      { title: "OOD detection", background: "A larger entropy gap can indicate out-of-distribution uncertainty.", numbers: "entropy gap $1.05-0.15=0.90$ nats." },
      { title: "Forecasting", background: "A predictive mean and uncertainty produce a rough demand interval.", numbers: "demand $500\\pm1.96(40)$ gives rough interval $[421.6,578.4]$." },
      { title: "Bayesian last layer", background: "Last-layer weight samples create different logits for the same feature.", numbers: "feature value $2$ and weight samples $0.4,0.5,0.7$ give logits $0.8,1.0,1.4$." }
    ]
  }
};
