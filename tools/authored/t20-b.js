module.exports = {
  "math-20-11": {
    id: "math-20-11",
    title: "Hierarchical models",
    tagline: "Hierarchical Bayes lets related groups learn together without pretending they are identical.",
    connections: {
      buildsOn: ["Bayes' theorem", "conditional probability", "conjugate priors", "posterior distributions"],
      leadsTo: ["Bayesian model comparison", "MCMC for Bayesian inference", "Gaussian process regression"],
      usedWith: ["conditional independence", "exchangeability", "marginalization", "variance decomposition"]
    },
    motivation:
      "<p>You already know how to estimate one probability from one dataset. If 7 of 10 trials succeed, $0.7$ feels like a natural estimate.</p>" +
      "<p>But real data often comes in related groups: hospitals, classrooms, users, markets. A tiny group should borrow strength from the others, while a large group should be trusted more. A <b>hierarchical model</b> gives us that careful middle path.</p>",
    definition:
      "<p>A <b>hierarchical Bayesian model</b> puts priors on group parameters and then puts a higher-level prior on the parameters of those priors. A common form is $y_{ij}\\mid \\theta_j\\sim p(y\\mid\\theta_j)$, $\\theta_j\\mid\\phi\\sim p(\\theta\\mid\\phi)$, and $\\phi\\sim p(\\phi)$, where $j$ indexes a group and $i$ indexes observations inside that group.</p>" +
      "<p>The key effect is <b>partial pooling</b>. Each group estimate is pulled toward the shared population pattern. In the normal-normal case with known variances, if $\\bar y_j\\sim\\mathcal{N}(\\theta_j,\\sigma^2/n_j)$ and $\\theta_j\\sim\\mathcal{N}(\\mu,\\tau^2)$, then the posterior mean is a weighted average of $\\bar y_j$ and $\\mu$; the group receives more pull when $n_j$ is small or group noise is large.</p>" +
      "<p><b>Assumptions that matter:</b> groups are treated as exchangeable after conditioning on the population parameters; the higher-level prior must describe plausible between-group variation; and partial pooling is helpful only when the groups are meaningfully related.</p>",
    worked: {
      problem: "A hospital has $n=4$ patient outcomes with sample mean $\\bar y=12$. Across hospitals, the prior for its true mean is $\\theta\\sim\\mathcal{N}(10,3^2)$. Individual outcomes have known standard deviation $\\sigma=6$. Find the posterior mean for $\\theta$.",
      skills: ["normal-normal updating", "precision weights", "partial pooling"],
      strategy: "The sample is small, so combine the group mean with the population mean using precision weights.",
      steps: [
        { do: "Compute the data variance for $\\bar y$", result: "$\\sigma^2/n=36/4=9$", why: "the sample mean is less noisy than one observation" },
        { do: "Compute the data precision", result: "$1/9$", why: "precision is inverse variance" },
        { do: "Compute the prior precision", result: "$1/3^2=1/9$", why: "the prior variance is also 9" },
        { do: "Add the precisions", result: "$1/9+1/9=2/9$", why: "independent normal information adds in precision" },
        { do: "Weight the two means", result: "$(12/9+10/9)/(2/9)=11$", why: "equal precisions give an equal average" },
        { do: "State the posterior mean", result: "$\\mathbb{E}[\\theta\\mid y]=11$", why: "the hospital estimate is pulled halfway toward the population mean" }
      ],
      verify: "The answer lies between the hospital mean 12 and population mean 10, exactly halfway because the precisions match.",
      answer: "The posterior mean is $11$.",
      connects: "Hierarchical modeling turns isolated estimates into shared learning with measured shrinkage."
    },
    practice: [
      { problem: "A school has $n=9$ test scores with $\\bar y=82$. The population prior is $\\theta\\sim\\mathcal{N}(75,5^2)$ and individual standard deviation is $\\sigma=15$. Find the posterior mean.", steps: [
        { do: "Compute the variance of $\\bar y$", result: "$15^2/9=25$", why: "divide observation variance by sample size" },
        { do: "Compute data precision", result: "$1/25$", why: "precision is inverse variance" },
        { do: "Compute prior precision", result: "$1/25$", why: "the prior variance is $5^2=25$" },
        { do: "Combine weighted means", result: "$(82/25+75/25)/(2/25)=78.5$", why: "equal precision averages the two means" },
        { do: "Check the direction", result: "$78.5$ is between $75$ and $82$", why: "partial pooling should not overshoot" }
      ], answer: "The posterior mean is $78.5$." },
      { problem: "A small product segment has $n=3$, $\\bar y=20$, prior mean $15$, prior standard deviation $4$, and observation standard deviation $8$. Find the posterior mean.", steps: [
        { do: "Compute data variance", result: "$8^2/3=64/3$", why: "the sample mean variance uses $n=3$" },
        { do: "Compute data precision", result: "$3/64$", why: "invert $64/3$" },
        { do: "Compute prior precision", result: "$1/16$", why: "the prior variance is $4^2=16$" },
        { do: "Add precisions", result: "$3/64+1/16=7/64$", why: "$1/16=4/64$" },
        { do: "Compute posterior mean", result: "$(20\\cdot3/64+15\\cdot4/64)/(7/64)=120/7\\approx17.14$", why: "weighted averages use precisions" }
      ], answer: "The posterior mean is approximately $17.14$." },
      { problem: "For a Beta-binomial hierarchy, group A has prior $\\theta_A\\sim\\operatorname{Beta}(4,6)$ and observes $8$ successes in $10$ trials. Find its posterior mean.", steps: [
        { do: "Add successes to $\\alpha$", result: "$\\alpha'=4+8=12$", why: "Beta-binomial updating counts successes" },
        { do: "Add failures to $\\beta$", result: "$\\beta'=6+2=8$", why: "there are $10-8=2$ failures" },
        { do: "Write the posterior", result: "$\\operatorname{Beta}(12,8)$", why: "conjugacy keeps the Beta form" },
        { do: "Compute the posterior mean", result: "$12/(12+8)=0.60$", why: "a Beta mean is $\\alpha/(\\alpha+\\beta)$" },
        { do: "Compare to raw rate", result: "$0.60<0.80$", why: "the population prior pulls the small group down" }
      ], answer: "The posterior mean is $0.60$." },
      { problem: "Two groups have raw rates $1/2=0.50$ and $40/50=0.80$. With prior $\\operatorname{Beta}(8,2)$ for each group, find both posterior means and explain the different shrinkage.", steps: [
        { do: "Update group 1", result: "$\\operatorname{Beta}(9,3)$", why: "add 1 success and 1 failure" },
        { do: "Compute group 1 mean", result: "$9/12=0.75$", why: "use the Beta mean" },
        { do: "Update group 2", result: "$\\operatorname{Beta}(48,12)$", why: "add 40 successes and 10 failures" },
        { do: "Compute group 2 mean", result: "$48/60=0.80$", why: "many observations dominate the same prior" },
        { do: "Compare shrinkage", result: "group 1 moves from $0.50$ to $0.75$; group 2 stays near $0.80$", why: "small groups borrow more strength" }
      ], answer: "The posterior means are $0.75$ and $0.80$; the smaller group shrinks more." },
      { problem: "An ad model has three campaign click rates: $0.02$ from $10$ clicks, $0.05$ from $100$ clicks, and $0.08$ from $1000$ clicks. A hierarchy uses population mean $0.04$. Which campaign should be pulled most toward $0.04$, and why?", steps: [
        { do: "List sample sizes", result: "$10$, $100$, and $1000$", why: "sample size controls data precision" },
        { do: "Identify the smallest sample", result: "$10$ clicks", why: "the first campaign has the least information" },
        { do: "Compare raw rate to population", result: "$0.02$ is below $0.04$", why: "the pull will be upward" },
        { do: "Identify the largest sample", result: "$1000$ clicks", why: "the third campaign has the most information" },
        { do: "State the pooling pattern", result: "the $10$-click campaign shrinks most; the $1000$-click campaign shrinks least", why: "hierarchical pooling trusts large groups more" }
      ], answer: "The first campaign should be pulled most, upward toward $0.04$." }
    ],
    applications: [
      { title: "Hospital quality estimates", background: "Public health comparisons can overreact to tiny hospitals. Hierarchical models became popular because they stabilize noisy group estimates without erasing real differences.", numbers: "A hospital with $2$ complications in $5$ cases has raw rate $0.40$; with prior $\\operatorname{Beta}(8,92)$, posterior mean is $10/105\\approx0.095$." },
      { title: "A/B tests across markets", background: "Product experiments often run in many countries or segments. A hierarchy lets each segment learn from the global pattern.", numbers: "With prior lift $1.0\\%$ and segment estimate $3.0\\%$, equal precision gives posterior mean $2.0\\%$." },
      { title: "Recommender systems for sparse users", background: "Many users have only a few actions. Hierarchical priors pull a user's preference toward a population preference until enough evidence arrives.", numbers: "A user with 1 like in 1 view and prior $\\operatorname{Beta}(9,11)$ has posterior mean $10/21\\approx0.476$, not $1.0$." },
      { title: "Classroom and teacher effects", background: "Education studies use multilevel models because students are nested in classrooms and schools. The method separates local variation from shared background.", numbers: "A class mean $88$ with standard error $4$ and district prior $80\\pm4$ has posterior mean $84$." },
      { title: "Fraud rates by merchant", background: "Risk systems need estimates for merchants with very different transaction counts. Partial pooling prevents tiny merchants from looking extreme by accident.", numbers: "Prior $\\operatorname{Beta}(2,198)$ plus $1$ fraud in $5$ transactions gives posterior mean $3/205\\approx0.0146$." },
      { title: "Meta-analysis of studies", background: "Scientific studies estimate related effects with different sample sizes. Hierarchical Bayes combines them while allowing true study-to-study variation.", numbers: "A study estimate $0.30$ with variance $0.04$ and population prior $0.10$ with variance $0.01$ gives mean $(0.30/0.04+0.10/0.01)/(25+100)=0.14$." }
    ],
    applicationsClose: "Hierarchies are a disciplined way to say: related groups should share information, but evidence still matters.",
    takeaways: [
      "Hierarchical models place priors on group parameters and higher-level priors on population parameters.",
      "Partial pooling pulls small or noisy groups toward the shared population pattern.",
      "Exchangeability means groups are comparable after conditioning on the hierarchy.",
      "The strength of shrinkage is controlled by data precision and between-group variation."
    ]
  },

  "math-20-12": {
    id: "math-20-12",
    title: "Bayesian model comparison",
    tagline: "Bayesian comparison asks which model predicts the observed data best after paying for its flexibility.",
    connections: {
      buildsOn: ["posterior distributions", "conditional probability", "model evidence", "odds ratios"],
      leadsTo: ["The model evidence", "The Laplace approximation", "Bayesian deep learning & uncertainty"],
      usedWith: ["marginal probability", "Bayes factors", "decision rules", "predictive distributions"]
    },
    motivation:
      "<p>You already compare explanations informally. If a coin lands heads 9 times out of 10, a fair coin still could do that, but a biased coin sounds more plausible.</p>" +
      "<p>Bayesian model comparison makes that instinct precise. It updates beliefs over whole models, not just parameters, and it rewards models that predicted the data well before seeing it.</p>",
    definition:
      "<p>For candidate models $M_1,\\ldots,M_K$, Bayesian comparison uses $$p(M_k\\mid y)=\\dfrac{p(y\\mid M_k)p(M_k)}{\\sum_{r=1}^K p(y\\mid M_r)p(M_r)}.$$ Here $p(M_k)$ is the prior probability of model $k$, and $p(y\\mid M_k)$ is the <b>model evidence</b>, the probability the model assigned to the observed data after averaging over its parameters.</p>" +
      "<p>For two models, posterior odds equal prior odds times the Bayes factor: $$\\dfrac{p(M_1\\mid y)}{p(M_2\\mid y)}=\\dfrac{p(M_1)}{p(M_2)}\\cdot\\dfrac{p(y\\mid M_1)}{p(y\\mid M_2)}.$$ The evidence automatically penalizes wasted flexibility because a very spread-out model assigns its probability mass across many possible datasets.</p>" +
      "<p><b>Assumptions that matter:</b> the candidate list must include the models you are willing to compare; model priors affect posterior model probabilities; and evidence is not the same as best-fit likelihood because evidence averages over parameter uncertainty.</p>",
    worked: {
      problem: "Two models have prior probabilities $p(M_1)=0.6$ and $p(M_2)=0.4$. Their evidences for the data are $p(y\\mid M_1)=0.03$ and $p(y\\mid M_2)=0.01$. Find the posterior probability of $M_1$.",
      skills: ["posterior model probability", "normalization", "Bayes factors"],
      strategy: "Compute each model's unnormalized posterior weight, then normalize the weights.",
      steps: [
        { do: "Compute the weight for $M_1$", result: "$0.6\\cdot0.03=0.018$", why: "posterior weight is prior times evidence" },
        { do: "Compute the weight for $M_2$", result: "$0.4\\cdot0.01=0.004$", why: "use the same rule for the second model" },
        { do: "Add the weights", result: "$0.018+0.004=0.022$", why: "the total weight normalizes probabilities" },
        { do: "Normalize $M_1$", result: "$0.018/0.022\\approx0.818$", why: "divide its weight by total weight" },
        { do: "Compute the Bayes factor", result: "$0.03/0.01=3$", why: "the data favor $M_1$ three to one before model priors" }
      ],
      verify: "The posterior probability is above the prior $0.6$ because the data evidence favored $M_1$.",
      answer: "$p(M_1\\mid y)\\approx0.818$.",
      connects: "Model comparison is Bayes' theorem with the hypotheses replaced by whole models."
    },
    practice: [
      { problem: "Two models have equal priors. The evidences are $0.12$ and $0.04$. Find the Bayes factor and posterior probability of the first model.", steps: [
        { do: "Compute the Bayes factor", result: "$0.12/0.04=3$", why: "evidence ratio measures data support" },
        { do: "Write equal prior weights", result: "$0.5\\cdot0.12=0.06$ and $0.5\\cdot0.04=0.02$", why: "equal priors still multiply evidence" },
        { do: "Add weights", result: "$0.06+0.02=0.08$", why: "normalize over models" },
        { do: "Normalize model 1", result: "$0.06/0.08=0.75$", why: "posterior probability is its share of total weight" },
        { do: "Check with odds", result: "$3/(3+1)=0.75$", why: "equal priors make posterior odds equal the Bayes factor" }
      ], answer: "Bayes factor $3$; posterior probability $0.75$." },
      { problem: "Model A has prior $0.2$ and evidence $0.50$. Model B has prior $0.8$ and evidence $0.10$. Find $p(A\\mid y)$.", steps: [
        { do: "Compute A weight", result: "$0.2\\cdot0.50=0.10$", why: "prior times evidence" },
        { do: "Compute B weight", result: "$0.8\\cdot0.10=0.08$", why: "B starts with a larger prior" },
        { do: "Add weights", result: "$0.10+0.08=0.18$", why: "total posterior mass before normalization" },
        { do: "Normalize A", result: "$0.10/0.18\\approx0.556$", why: "A's share of total weight" },
        { do: "Interpret", result: "$A$ becomes more likely than $B$", why: "its evidence overcame its smaller prior" }
      ], answer: "$p(A\\mid y)\\approx0.556$." },
      { problem: "Three models have equal priors and evidences $0.2$, $0.5$, and $0.3$. Find all posterior model probabilities.", steps: [
        { do: "Use equal priors", result: "weights are proportional to $0.2,0.5,0.3$", why: "multiplying by the same prior does not change ratios" },
        { do: "Add evidences", result: "$0.2+0.5+0.3=1.0$", why: "normalize the proportional weights" },
        { do: "Normalize model 1", result: "$0.2/1.0=0.2$", why: "divide by total" },
        { do: "Normalize model 2", result: "$0.5/1.0=0.5$", why: "divide by total" },
        { do: "Normalize model 3", result: "$0.3/1.0=0.3$", why: "divide by total" }
      ], answer: "The posterior probabilities are $0.2$, $0.5$, and $0.3$." },
      { problem: "Prior odds favor $M_1$ over $M_2$ by $4:1$, but the Bayes factor $BF_{12}=0.5$. Find the posterior odds and posterior probability of $M_1$.", steps: [
        { do: "Write prior odds", result: "$4:1$", why: "prior odds compare $M_1$ to $M_2$" },
        { do: "Multiply by Bayes factor", result: "$4\\cdot0.5=2$", why: "posterior odds equal prior odds times Bayes factor" },
        { do: "Write posterior odds", result: "$2:1$", why: "$M_1$ is still favored, but less strongly" },
        { do: "Convert odds to probability", result: "$2/(2+1)=2/3$", why: "probability is favorable odds over total odds" },
        { do: "Approximate", result: "$2/3\\approx0.667$", why: "decimal form helps interpret strength" }
      ], answer: "Posterior odds are $2:1$ and $p(M_1\\mid y)\\approx0.667$." },
      { problem: "An ML team compares a linear model and a tree model with equal priors. Validation data gives approximate evidences $0.006$ and $0.018$. What are the posterior probabilities?", steps: [
        { do: "Assign weights", result: "$0.5\\cdot0.006=0.003$ and $0.5\\cdot0.018=0.009$", why: "equal model priors multiply each evidence" },
        { do: "Add weights", result: "$0.003+0.009=0.012$", why: "normalize across candidates" },
        { do: "Normalize the linear model", result: "$0.003/0.012=0.25$", why: "its weight is one quarter of the total" },
        { do: "Normalize the tree model", result: "$0.009/0.012=0.75$", why: "its weight is three quarters of the total" },
        { do: "Compute the Bayes factor", result: "$0.018/0.006=3$", why: "the data favor the tree three to one" }
      ], answer: "Linear model $0.25$; tree model $0.75$." }
    ],
    applications: [
      { title: "Choosing regression features", background: "Bayesian regression can compare feature sets by their evidence, rather than only by training error. This discourages adding features that fit noise.", numbers: "If feature set A has evidence $0.004$ and B has $0.012$ with equal priors, B has posterior probability $0.75$." },
      { title: "A/B testing with model uncertainty", background: "Instead of asking only which variant has a higher posterior conversion rate, teams can compare models such as no lift versus positive lift.", numbers: "Prior odds $1:1$ and Bayes factor $5$ for lift give posterior probability $5/(5+1)=0.833$." },
      { title: "Scientific theory comparison", background: "Bayes factors have long been used to compare scientific hypotheses while accounting for how sharply each hypothesis predicted the data.", numbers: "Evidence ratio $20$ and prior odds $1:4$ yield posterior odds $5:1$ for the new theory." },
      { title: "Forecasting model selection", background: "Time-series analysts compare simple and flexible forecasts. Evidence rewards good predictive density, not just close point forecasts.", numbers: "Weights $0.7\\cdot0.02=0.014$ and $0.3\\cdot0.03=0.009$ give posterior $0.609$ for the first model." },
      { title: "Mixture-of-experts gating", background: "A Bayesian view can treat experts as candidate models and update their weights after seeing data.", numbers: "Three expert weights proportional to $0.1,0.2,0.7$ normalize to posterior model probabilities $0.1,0.2,0.7$." },
      { title: "Neural architecture comparison", background: "Fully Bayesian architecture comparison is expensive, but the principle remains useful: predictive evidence matters more than raw parameter count.", numbers: "Approximate log evidences $-120$ and $-118$ give Bayes factor $e^2\\approx7.39$ for the second architecture." }
    ],
    applicationsClose: "Bayesian comparison keeps the question honest: what did each model predict before it was allowed to fit the data too closely?",
    takeaways: [
      "Posterior model probability is proportional to prior model probability times model evidence.",
      "A Bayes factor is an evidence ratio between two models.",
      "Evidence averages over parameters and therefore penalizes unnecessary flexibility.",
      "Model priors matter, especially when evidence is not overwhelming."
    ]
  },

  "math-20-13": {
    id: "math-20-13",
    title: "The model evidence",
    tagline: "Evidence is the model's prior predictive probability for the data you actually observed.",
    connections: {
      buildsOn: ["Bayesian model comparison", "marginalization", "likelihood", "prior distributions"],
      leadsTo: ["The Laplace approximation", "Variational inference", "Bayesian deep learning & uncertainty"],
      usedWith: ["integrals", "posterior normalization", "predictive distributions", "Bayes factors"]
    },
    motivation:
      "<p>You already know a likelihood scores parameters after data arrive. If a coin parameter is $\\theta=0.8$, then many heads are likely.</p>" +
      "<p>The model evidence asks a broader question: before choosing one parameter value, how much probability did the whole model assign to this dataset? That single number is the denominator of Bayes' theorem and the fuel for model comparison.</p>",
    definition:
      "<p>The <b>model evidence</b>, also called the marginal likelihood, is $$p(y\\mid M)=\\int p(y\\mid\\theta,M)p(\\theta\\mid M)\\,d\\theta.$$ It averages the likelihood over the prior distribution of the parameter $\\theta$. For discrete parameters, the integral becomes a sum.</p>" +
      "<p>Evidence is also the normalizing constant of the posterior: $p(\\theta\\mid y,M)=p(y\\mid\\theta,M)p(\\theta\\mid M)/p(y\\mid M)$. The same value makes posterior probabilities add or integrate to $1$.</p>" +
      "<p><b>Assumptions that matter:</b> the prior must be proper for evidence-based model comparison; evidence depends on the chosen prior, not only the likelihood; and high maximum likelihood does not guarantee high evidence if the model spreads prior mass over many datasets.</p>",
    worked: {
      problem: "A coin model has prior $\\theta\\sim\\operatorname{Beta}(1,1)$. You observe $k=2$ heads in $n=3$ flips, in a specific sequence such as HHT. Compute the evidence for that exact sequence.",
      skills: ["marginal likelihood", "Beta integrals", "Bayesian normalization"],
      strategy: "Average the Bernoulli sequence likelihood $\\theta^2(1-\\theta)$ over the uniform prior.",
      steps: [
        { do: "Write the evidence integral", result: "$p(y)=\\int_0^1 \\theta^2(1-\\theta)\\,d\\theta$", why: "the prior density is 1 on $[0,1]$" },
        { do: "Expand the integrand", result: "$\\theta^2-\\theta^3$", why: "distribute $\\theta^2$" },
        { do: "Integrate the first term", result: "$\\int_0^1\\theta^2\\,d\\theta=1/3$", why: "use the power rule" },
        { do: "Integrate the second term", result: "$\\int_0^1\\theta^3\\,d\\theta=1/4$", why: "use the power rule again" },
        { do: "Subtract", result: "$1/3-1/4=1/12$", why: "the evidence is the averaged likelihood" }
      ],
      verify: "There are three sequences with exactly two heads; their total prior predictive probability is $3\\cdot1/12=1/4$, which is plausible under a uniform random coin bias.",
      answer: "The evidence for the exact sequence is $1/12\\approx0.0833$.",
      connects: "Evidence is likelihood averaged over the parameter values the prior considered plausible."
    },
    practice: [
      { problem: "With the same uniform coin prior, compute the evidence for the exact sequence HH in two flips.", steps: [
        { do: "Write the likelihood", result: "$p(y\\mid\\theta)=\\theta^2$", why: "two heads multiply two head probabilities" },
        { do: "Write the evidence integral", result: "$\\int_0^1\\theta^2\\,d\\theta$", why: "average over the uniform prior" },
        { do: "Apply the power rule", result: "$[\\theta^3/3]_0^1$", why: "integrate $\\theta^2$" },
        { do: "Evaluate the bounds", result: "$1/3-0=1/3$", why: "substitute 1 and 0" },
        { do: "Check size", result: "$1/3>1/4$", why: "a random bias prior makes repeated heads less surprising than a fixed fair coin does" }
      ], answer: "The evidence is $1/3$." },
      { problem: "A discrete model has $\\theta\\in\\{0.25,0.75\\}$ with prior probabilities $0.5$ and $0.5$. For the exact sequence HH, compute evidence.", steps: [
        { do: "Compute likelihood at $0.25$", result: "$0.25^2=0.0625$", why: "two heads" },
        { do: "Compute likelihood at $0.75$", result: "$0.75^2=0.5625$", why: "two heads under a head-heavy coin" },
        { do: "Weight the first likelihood", result: "$0.5\\cdot0.0625=0.03125$", why: "multiply by prior probability" },
        { do: "Weight the second likelihood", result: "$0.5\\cdot0.5625=0.28125$", why: "multiply by prior probability" },
        { do: "Add weighted likelihoods", result: "$0.3125$", why: "discrete evidence is a sum" }
      ], answer: "The evidence is $0.3125$." },
      { problem: "For a normal model, suppose the prior predictive distribution for one observation is $Y\\sim\\mathcal{N}(0,2^2)$. Approximate the density evidence at $y=1$ using $1/\\sqrt{8\\pi}\\approx0.1995$ and $e^{-1/8}\\approx0.8825$.", steps: [
        { do: "Write the normal density", result: "$p(1)=\\dfrac{1}{\\sqrt{8\\pi}}e^{-1^2/(2\\cdot2^2)}$", why: "variance is $4$" },
        { do: "Simplify the exponent", result: "$-1/8$", why: "$2\\cdot2^2=8$" },
        { do: "Substitute constants", result: "$0.1995\\cdot0.8825$", why: "use the given approximations" },
        { do: "Multiply", result: "$0.1761$", why: "density values can exceed or fall below probabilities" },
        { do: "Name the quantity", result: "prior predictive density", why: "continuous evidence is a density at the observed value" }
      ], answer: "The evidence density is approximately $0.176$." },
      { problem: "Model 1 has evidence $0.08$. Model 2 has evidence $0.02$. With equal priors, compute the posterior probability of Model 1 using evidence.", steps: [
        { do: "Assign unnormalized weights", result: "$0.5\\cdot0.08=0.04$ and $0.5\\cdot0.02=0.01$", why: "model posterior weights use evidence" },
        { do: "Add weights", result: "$0.04+0.01=0.05$", why: "normalize across models" },
        { do: "Normalize Model 1", result: "$0.04/0.05=0.80$", why: "divide by total weight" },
        { do: "Compute evidence ratio", result: "$0.08/0.02=4$", why: "the Bayes factor is four" },
        { do: "Check with odds", result: "$4/(4+1)=0.80$", why: "equal priors make odds match the evidence ratio" }
      ], answer: "Model 1 has posterior probability $0.80$." },
      { problem: "A classifier's Bayesian model gives prior predictive probabilities $0.7$, $0.2$, and $0.1$ to labels A, B, and C before seeing the true label. If the true label is B, what is the evidence contribution and negative log evidence using $\\ln0.2\\approx-1.609$?", steps: [
        { do: "Identify the observed label", result: "B", why: "evidence uses probability assigned to what happened" },
        { do: "Read its predictive probability", result: "$p(y)=0.2$", why: "the model assigned B probability 0.2" },
        { do: "Write the log evidence", result: "$\\ln p(y)=\\ln0.2$", why: "logs are used for numerical stability" },
        { do: "Substitute the approximation", result: "$\\ln p(y)\\approx-1.609$", why: "given natural log" },
        { do: "Negate", result: "$-\\ln p(y)\\approx1.609$", why: "negative log evidence is a loss-like score" }
      ], answer: "Evidence contribution $0.2$; negative log evidence approximately $1.609$." }
    ],
    applications: [
      { title: "Posterior normalization", background: "Every Bayesian posterior needs a denominator. Evidence is that denominator, even when we avoid computing it directly in MCMC.", numbers: "If likelihood times prior integrates to $0.05$, dividing by $0.05$ makes posterior area equal $1$." },
      { title: "Bayes factors", background: "Model comparison uses evidence ratios to update model odds. This is one reason evidence matters beyond parameter estimation.", numbers: "Evidences $0.009$ and $0.003$ give Bayes factor $3$ for the first model." },
      { title: "Occam's razor", background: "Evidence rewards models that concentrate probability near the observed data. Flexible models can be penalized because they spread mass widely.", numbers: "A simple model assigning $0.10$ to the data beats a flexible model assigning $0.02$ by evidence ratio $5$." },
      { title: "Anomaly detection", background: "Prior predictive probability is a natural anomaly score: data that the model found unlikely deserve attention.", numbers: "If normal traffic has predictive probability $0.04$ but an event has $0.0004$, the event is $100$ times less expected." },
      { title: "Language modeling", background: "A language model assigns predictive probability to a token sequence. The product is an evidence-like score for the observed text under that model.", numbers: "Token probabilities $0.5$, $0.2$, $0.1$ give sequence probability $0.01$ and log score $\\ln0.01\\approx-4.605$." },
      { title: "Hyperparameter tuning", background: "Empirical Bayes often selects hyperparameters by maximizing evidence, asking which prior setting best predicts the data overall.", numbers: "If prior scale $1$ gives evidence $0.006$ and scale $5$ gives $0.002$, evidence favors scale $1$ by factor $3$." }
    ],
    applicationsClose: "Evidence is the quiet bridge between parameter learning, model comparison, prediction, and anomaly scoring.",
    takeaways: [
      "Model evidence is $p(y\\mid M)=\\int p(y\\mid\\theta,M)p(\\theta\\mid M)\\,d\\theta$.",
      "It is the prior predictive probability or density of the observed data.",
      "Evidence normalizes the posterior and drives Bayes factors.",
      "Because it averages over the prior, evidence depends strongly on prior choices."
    ]
  },

  "math-20-14": {
    id: "math-20-14",
    title: "The Laplace approximation",
    tagline: "Laplace's method turns a peaked posterior into a local Gaussian you can compute with.",
    connections: {
      buildsOn: ["Taylor expansions", "posterior modes", "normal distributions", "optimization"],
      leadsTo: ["Variational inference", "MCMC for Bayesian inference", "Bayesian deep learning & uncertainty"],
      usedWith: ["Hessians", "quadratic approximation", "Gaussian integrals", "model evidence"]
    },
    motivation:
      "<p>You already know a smooth curve can look like a parabola when you zoom in near its top or bottom. That local shape is often enough to do useful calculation.</p>" +
      "<p>Bayesian posteriors can be hard to integrate, but many are sharply peaked near a mode. The <b>Laplace approximation</b> says: find the peak, fit a quadratic to the log posterior there, and use the matching Gaussian.</p>",
    definition:
      "<p>Suppose the unnormalized posterior is $\\tilde p(\\theta)=p(y\\mid\\theta)p(\\theta)$ and the log density $\\ell(\\theta)=\\log\\tilde p(\\theta)$ has a mode $\\hat\\theta$. A second-order Taylor expansion gives $\\ell(\\theta)\\approx\\ell(\\hat\\theta)-\\tfrac12(\\theta-\\hat\\theta)^T H(\\theta-\\hat\\theta)$, where $H=-\\nabla^2\\ell(\\hat\\theta)$ is the negative Hessian at the mode.</p>" +
      "<p>Exponentiating the quadratic produces a Gaussian approximation: $p(\\theta\\mid y)\\approx\\mathcal{N}(\\hat\\theta,H^{-1})$. In one dimension, the approximate variance is $1/H$.</p>" +
      "<p><b>Assumptions that matter:</b> the posterior should be smooth and concentrated near one dominant mode; the Hessian must be positive definite at that mode; and skewed, heavy-tailed, or multimodal posteriors can be poorly represented by one Gaussian.</p>",
    worked: {
      problem: "An unnormalized log posterior near its mode is $\\ell(\\theta)=C-8(\\theta-3)^2$. Find the Laplace Gaussian approximation.",
      skills: ["posterior mode", "curvature", "Gaussian variance"],
      strategy: "Match the quadratic log posterior to the log of a normal density.",
      steps: [
        { do: "Identify the mode", result: "$\\hat\\theta=3$", why: "the squared term is smallest at 3" },
        { do: "Differentiate once", result: "$\\ell'(\\theta)=-16(\\theta-3)$", why: "use the chain rule" },
        { do: "Differentiate twice", result: "$\\ell''(\\theta)=-16$", why: "curvature is constant for this quadratic" },
        { do: "Compute negative curvature", result: "$H=-\\ell''(3)=16$", why: "Laplace uses the negative Hessian at the mode" },
        { do: "Invert curvature", result: "$H^{-1}=1/16=0.0625$", why: "one-dimensional Gaussian variance is inverse curvature" },
        { do: "Write the approximation", result: "$\\theta\\mid y\\approx\\mathcal{N}(3,0.0625)$", why: "mean is the mode and variance is inverse curvature" }
      ],
      verify: "The standard deviation is $0.25$, small because curvature $16$ means a sharp peak.",
      answer: "$\\theta\\mid y\\approx\\mathcal{N}(3,1/16)$.",
      connects: "Laplace converts local log-posterior curvature into approximate posterior uncertainty."
    },
    practice: [
      { problem: "If $\\ell(\\theta)=C-2(\\theta+1)^2$, find the Laplace approximation.", steps: [
        { do: "Identify the mode", result: "$\\hat\\theta=-1$", why: "the squared term is zero at $-1$" },
        { do: "Differentiate once", result: "$\\ell'(\\theta)=-4(\\theta+1)$", why: "differentiate the quadratic" },
        { do: "Differentiate twice", result: "$\\ell''(\\theta)=-4$", why: "curvature is constant" },
        { do: "Compute negative curvature", result: "$H=4$", why: "negative second derivative at the mode" },
        { do: "Invert", result: "$H^{-1}=1/4$", why: "variance is inverse curvature" }
      ], answer: "$\\theta\\mid y\\approx\\mathcal{N}(-1,1/4)$." },
      { problem: "A log posterior has mode $5$ and second derivative $\\ell''(5)=-25$. Find the approximate posterior standard deviation.", steps: [
        { do: "Compute negative curvature", result: "$H=-\\ell''(5)=25$", why: "Laplace uses positive curvature of the negative log density" },
        { do: "Compute variance", result: "$H^{-1}=1/25=0.04$", why: "one-dimensional inverse curvature" },
        { do: "Take square root", result: "$\\sqrt{0.04}=0.2$", why: "standard deviation is square root of variance" },
        { do: "Attach the mode", result: "$\\mathcal{N}(5,0.04)$", why: "the approximate mean is the mode" },
        { do: "Interpret sharpness", result: "standard deviation $0.2$", why: "large curvature gives tight uncertainty" }
      ], answer: "The approximate standard deviation is $0.2$." },
      { problem: "Approximate the evidence contribution for a one-dimensional mode with unnormalized density $\\tilde p(\\hat\\theta)=0.20$ and curvature $H=50$ using $\\sqrt{2\\pi/50}\\approx0.354$.", steps: [
        { do: "Write Laplace evidence formula", result: "$p(y)\\approx\\tilde p(\\hat\\theta)\\sqrt{2\\pi/H}$", why: "one-dimensional Gaussian area multiplies peak height" },
        { do: "Substitute peak height", result: "$0.20\\sqrt{2\\pi/50}$", why: "use the given unnormalized density" },
        { do: "Use the approximation", result: "$0.20\\cdot0.354$", why: "given square-root factor" },
        { do: "Multiply", result: "$0.0708$", why: "area is height times effective width" },
        { do: "Interpret", result: "evidence approximately $0.071$", why: "sharp peaks have small effective width" }
      ], answer: "The approximate evidence is $0.0708$." },
      { problem: "For a two-parameter posterior, the negative Hessian at the mode is $H=\\begin{pmatrix}4&0\\\\0&9\\end{pmatrix}$. Find the covariance matrix of the Laplace approximation.", steps: [
        { do: "Recognize the matrix form", result: "$\\Sigma=H^{-1}$", why: "multivariate Laplace uses inverse negative Hessian" },
        { do: "Invert the first diagonal entry", result: "$1/4$", why: "diagonal matrices invert entry by entry" },
        { do: "Invert the second diagonal entry", result: "$1/9$", why: "same diagonal rule" },
        { do: "Keep off-diagonal entries", result: "$0$", why: "there is no coupling in this Hessian" },
        { do: "Write the covariance", result: "$\\begin{pmatrix}1/4&0\\\\0&1/9\\end{pmatrix}$", why: "assemble the inverse matrix" }
      ], answer: "The covariance is $\\begin{pmatrix}1/4&0\\\\0&1/9\\end{pmatrix}$." },
      { problem: "A Bayesian logistic regression has MAP weight $\\hat w=1.2$ and negative log-posterior curvature $H=4$. Approximate a $95\\%$ interval using $1.96$ standard deviations.", steps: [
        { do: "Compute variance", result: "$1/H=1/4=0.25$", why: "Laplace variance is inverse curvature" },
        { do: "Compute standard deviation", result: "$\\sqrt{0.25}=0.5$", why: "intervals use standard deviation" },
        { do: "Compute the margin", result: "$1.96\\cdot0.5=0.98$", why: "normal $95\\%$ interval rule" },
        { do: "Subtract the margin", result: "$1.2-0.98=0.22$", why: "lower endpoint" },
        { do: "Add the margin", result: "$1.2+0.98=2.18$", why: "upper endpoint" }
      ], answer: "The approximate interval is $[0.22,2.18]$." }
    ],
    applications: [
      { title: "Fast posterior intervals", background: "When MCMC is too slow, Laplace gives a quick Gaussian uncertainty estimate around a MAP solution.", numbers: "MAP $2.0$ with curvature $100$ gives variance $0.01$ and standard deviation $0.1$." },
      { title: "Approximate model evidence", background: "Laplace's method was historically developed for integrals with sharp peaks. Bayesian evidence is exactly such an integral in many large-data problems.", numbers: "Peak $0.5$ and width factor $0.1$ give evidence about $0.05$." },
      { title: "Bayesian logistic regression", background: "Logistic regression posteriors are not usually conjugate. A quadratic expansion around the MAP makes approximate inference practical.", numbers: "If $H=25$, the weight variance is $0.04$ and standard deviation $0.2$." },
      { title: "Neural-network last-layer uncertainty", background: "Some Bayesian deep-learning systems fit a neural network, then place a Laplace approximation over the final layer.", numbers: "A final-layer weight with MAP $0.7$ and curvature $16$ has approximate standard deviation $0.25$." },
      { title: "Occam factors", background: "The evidence approximation includes an effective width term. Wide uncertainty can raise area, while wasted prior volume can lower model support.", numbers: "Two models with same peak $0.1$ but width factors $0.2$ and $0.05$ have evidence $0.02$ and $0.005$." },
      { title: "Optimization diagnostics", background: "The Hessian tells whether a found point is a usable mode for Laplace. Negative or zero curvature signals trouble.", numbers: "If $\\ell''(\\hat\\theta)=-9$, variance is $1/9$; if $\\ell''(\\hat\\theta)=0$, the Gaussian approximation has no finite curvature." }
    ],
    applicationsClose: "Laplace is a local bargain: when the posterior is mostly one smooth peak, curvature buys fast approximate uncertainty.",
    takeaways: [
      "Laplace approximates a posterior by a Gaussian centered at the posterior mode.",
      "The covariance is the inverse negative Hessian of the log posterior at the mode.",
      "It also approximates evidence by peak height times Gaussian width.",
      "The approximation can fail for skewed, heavy-tailed, or multimodal posteriors."
    ]
  },

  "math-20-15": {
    id: "math-20-15",
    title: "Variational inference",
    tagline: "Variational inference turns Bayesian inference into optimization over a family of approximate posteriors.",
    connections: {
      buildsOn: ["KL divergence", "posterior distributions", "optimization", "expectations"],
      leadsTo: ["Expectation–maximization (EM)", "Bayesian deep learning & uncertainty", "MCMC for Bayesian inference"],
      usedWith: ["Jensen's inequality", "coordinate ascent", "mean-field approximations", "evidence lower bounds"]
    },
    motivation:
      "<p>You already know that exact Bayesian posteriors can be beautiful but hard to compute. Integrals grow painful when models have many hidden variables or parameters.</p>" +
      "<p><b>Variational inference</b> chooses a simpler family $q(\\theta)$ and searches for the member closest to the true posterior. It trades exact sampling for a faster optimization problem, which is why it shows up in large-scale Bayesian ML.</p>",
    definition:
      "<p>Variational inference chooses $q(\\theta)$ from a tractable family $\\mathcal{Q}$ to approximate $p(\\theta\\mid y)$. A common objective is to minimize $\\operatorname{KL}(q(\\theta)\\|p(\\theta\\mid y))$, which is equivalent to maximizing the evidence lower bound, $$\\operatorname{ELBO}(q)=\\mathbb{E}_q[\\log p(y,\\theta)]-\\mathbb{E}_q[\\log q(\\theta)].$$</p>" +
      "<p>The identity $\\log p(y)=\\operatorname{ELBO}(q)+\\operatorname{KL}(q(\\theta)\\|p(\\theta\\mid y))$ explains the name. Since KL divergence is nonnegative, the ELBO is always a lower bound on the log evidence. Raising the ELBO moves $q$ closer to the posterior in the chosen direction.</p>" +
      "<p><b>Assumptions that matter:</b> the approximation quality is limited by the family $\\mathcal{Q}$; mean-field factorizations can underestimate dependence and uncertainty; and maximizing the ELBO finds an approximation, not the exact posterior unless the true posterior lies in the family.</p>",
    worked: {
      problem: "For a proposed variational distribution, suppose $\\mathbb{E}_q[\\log p(y,\\theta)]=-120$ and $\\mathbb{E}_q[\\log q(\\theta)]=-30$. Compute the ELBO. If $\\log p(y)=-80$, compute the KL gap.",
      skills: ["ELBO", "KL gap", "log evidence"],
      strategy: "Use the ELBO definition first, then compare it to log evidence.",
      steps: [
        { do: "Write the ELBO formula", result: "$\\operatorname{ELBO}=\\mathbb{E}_q[\\log p(y,\\theta)]-\\mathbb{E}_q[\\log q(\\theta)]$", why: "definition of the variational objective" },
        { do: "Substitute the values", result: "$-120-(-30)$", why: "the entropy-like term is subtracted" },
        { do: "Compute the ELBO", result: "$-90$", why: "subtracting a negative adds" },
        { do: "Use the decomposition", result: "$\\operatorname{KL}=\\log p(y)-\\operatorname{ELBO}$", why: "log evidence equals ELBO plus KL" },
        { do: "Compute the gap", result: "$-80-(-90)=10$", why: "the ELBO is 10 nats below log evidence" }
      ],
      verify: "The KL gap is nonnegative, so the ELBO being below $\\log p(y)$ is consistent.",
      answer: "The ELBO is $-90$ and the KL gap is $10$ nats.",
      connects: "VI measures progress by lifting a lower bound toward the log evidence."
    },
    practice: [
      { problem: "A candidate $q$ has $\\mathbb{E}_q[\\log p(y,\\theta)]=-50$ and $\\mathbb{E}_q[\\log q(\\theta)]=-12$. Compute the ELBO.", steps: [
        { do: "Write the formula", result: "$\\operatorname{ELBO}=\\mathbb{E}_q[\\log p]-\\mathbb{E}_q[\\log q]$", why: "use the standard VI objective" },
        { do: "Substitute", result: "$-50-(-12)$", why: "insert the two expectations" },
        { do: "Simplify signs", result: "$-50+12$", why: "subtracting a negative adds" },
        { do: "Add", result: "$-38$", why: "combine the terms" },
        { do: "Interpret", result: "ELBO $=-38$", why: "higher values are better among candidates" }
      ], answer: "The ELBO is $-38$." },
      { problem: "Two variational distributions have ELBOs $-102$ and $-97$. Which is preferred and by how much?", steps: [
        { do: "Compare the objectives", result: "$-97>-102$", why: "ELBO is maximized" },
        { do: "Choose the better distribution", result: "the second $q$", why: "it has the larger lower bound" },
        { do: "Compute the difference", result: "$-97-(-102)=5$", why: "measure improvement in nats" },
        { do: "Interpret the gap", result: "$5$ nats", why: "the lower bound increased by 5" },
        { do: "State the preference", result: "prefer the second candidate", why: "within the same family, higher ELBO means closer by the VI objective" }
      ], answer: "Prefer the second candidate by $5$ nats of ELBO." },
      { problem: "If $\\log p(y)=-40$ and a variational approximation has ELBO $-43.5$, what is $\\operatorname{KL}(q\\|p)$?", steps: [
        { do: "Write the decomposition", result: "$\\log p(y)=\\operatorname{ELBO}+\\operatorname{KL}$", why: "ELBO plus KL equals log evidence" },
        { do: "Solve for KL", result: "$\\operatorname{KL}=\\log p(y)-\\operatorname{ELBO}$", why: "subtract ELBO from both sides" },
        { do: "Substitute", result: "$-40-(-43.5)$", why: "use the given numbers" },
        { do: "Compute", result: "$3.5$", why: "subtracting a negative adds" },
        { do: "Check sign", result: "$3.5\\ge0$", why: "KL divergence cannot be negative" }
      ], answer: "$\\operatorname{KL}(q\\|p)=3.5$." },
      { problem: "A mean-field approximation uses $q(z_1,z_2)=q_1(z_1)q_2(z_2)$. If $q_1(1)=0.7$ and $q_2(1)=0.4$, what probability does it assign to $(z_1,z_2)=(1,1)$?", steps: [
        { do: "Write the factorization", result: "$q(1,1)=q_1(1)q_2(1)$", why: "mean-field assumes independence under $q$" },
        { do: "Substitute probabilities", result: "$0.7\\cdot0.4$", why: "use the two marginal variational probabilities" },
        { do: "Multiply", result: "$0.28$", why: "independent probabilities multiply" },
        { do: "Name the assumption", result: "variational independence", why: "the true posterior may still be dependent" },
        { do: "Interpret", result: "$28\\%$", why: "convert probability to an intuitive percent" }
      ], answer: "The mean-field approximation assigns probability $0.28$." },
      { problem: "A Bayesian neural net trains with objective negative ELBO. If expected negative log joint is $240$ and expected log $q$ penalty contributes $-60$ in the ELBO formula, compute ELBO and negative ELBO from $\\mathbb{E}_q[\\log p]=-240$, $\\mathbb{E}_q[\\log q]=60$.", steps: [
        { do: "Write the ELBO", result: "$\\operatorname{ELBO}=\\mathbb{E}_q[\\log p]-\\mathbb{E}_q[\\log q]$", why: "same objective, different model scale" },
        { do: "Substitute", result: "$-240-60$", why: "the expectation of $\\log q$ is positive here" },
        { do: "Compute ELBO", result: "$-300$", why: "combine terms" },
        { do: "Negate", result: "$300$", why: "optimizers often minimize negative ELBO" },
        { do: "Interpret", result: "lower negative ELBO is better", why: "minimizing negative ELBO maximizes ELBO" }
      ], answer: "The ELBO is $-300$ and the negative ELBO is $300$." }
    ],
    applications: [
      { title: "Topic models", background: "Latent Dirichlet allocation popularized VI because documents have hidden topic mixtures and exact inference is expensive.", numbers: "If one document has topic probabilities $[0.7,0.2,0.1]$, mean-field VI stores those three variational weights." },
      { title: "Bayesian neural networks", background: "Large neural networks have too many weights for exact Bayes. VI fits distributions over weights by stochastic optimization.", numbers: "A weight posterior $q(w)=\\mathcal{N}(0.8,0.1^2)$ can be sampled as $0.8+0.1\\epsilon$ during training." },
      { title: "Recommendation systems", background: "Matrix factorization with uncertainty can use VI to estimate latent user and item factors at scale.", numbers: "A user factor mean $[1.0,0.5]$ and item mean $[0.2,2.0]$ predict score $1.2$ by dot product." },
      { title: "Streaming approximate Bayes", background: "VI supports fast updates when data arrive continuously, because optimization can be warm-started.", numbers: "An ELBO moving from $-1000$ to $-940$ over a new batch improves the bound by $60$ nats." },
      { title: "Amortized inference", background: "Variational autoencoders use a neural network to output variational distributions quickly for each data point.", numbers: "An encoder outputs $\\mu=2$ and $\\sigma=0.5$; a latent sample is $z=2+0.5\\epsilon$." },
      { title: "Scalable uncertainty dashboards", background: "Businesses often need approximate uncertainty for many segments. VI is faster than exact posterior computation in large hierarchies.", numbers: "If a segment lift has $q(\\theta)=\\mathcal{N}(0.03,0.01^2)$, an approximate $95\\%$ interval is $[0.0104,0.0496]$." }
    ],
    applicationsClose: "VI is the optimization-shaped face of Bayes: fast, scalable, approximate, and always limited by the family you choose.",
    takeaways: [
      "Variational inference approximates the posterior with a tractable distribution $q(\\theta)$.",
      "Maximizing the ELBO is equivalent to minimizing $\\operatorname{KL}(q\\|p)$ up to the log evidence.",
      "Mean-field assumptions speed computation but can miss posterior dependence.",
      "VI is widely used when exact Bayes or MCMC is too expensive."
    ]
  },

  "math-20-16": {
    id: "math-20-16",
    title: "Expectation–maximization (EM)",
    tagline: "EM alternates between estimating hidden structure and refitting parameters as if that structure were softly observed.",
    connections: {
      buildsOn: ["latent variables", "maximum likelihood", "conditional expectation", "Jensen's inequality"],
      leadsTo: ["Variational inference", "MCMC for Bayesian inference", "Bayesian deep learning & uncertainty"],
      usedWith: ["mixture models", "coordinate ascent", "lower bounds", "incomplete data"]
    },
    motivation:
      "<p>You already know how to fit a mean when every data point belongs to one group. But what if the group labels are hidden?</p>" +
      "<p><b>Expectation–maximization</b> handles incomplete data by taking turns. The E-step computes soft beliefs about hidden variables; the M-step updates parameters using those soft beliefs. It is patient bookkeeping for uncertainty.</p>",
    definition:
      "<p>For observed data $y$, latent variables $z$, and parameters $\\theta$, EM maximizes the observed-data likelihood $p(y\\mid\\theta)=\\sum_z p(y,z\\mid\\theta)$. At iteration $t$, the E-step computes $q_t(z)=p(z\\mid y,\\theta^{(t)})$. The M-step chooses $\\theta^{(t+1)}$ to maximize $\\mathbb{E}_{q_t}[\\log p(y,z\\mid\\theta)]$.</p>" +
      "<p>The reason this works is a lower-bound argument: any distribution $q(z)$ gives an ELBO for $\\log p(y\\mid\\theta)$. The E-step makes the bound tight at the current parameters, and the M-step raises that bound. Therefore the observed likelihood does not decrease under exact EM.</p>" +
      "<p><b>Assumptions that matter:</b> exact EM requires tractable posterior responsibilities and an exact or improving M-step; it can converge to local optima; and soft assignments are probabilities, not hard labels, unless the posterior is degenerate.</p>",
    worked: {
      problem: "In a two-cluster Gaussian mixture with known variance and current means $0$ and $10$, a point $x=2$ has responsibilities $r_1=0.8$ and $r_2=0.2$. A second point $x=8$ has responsibilities $r_1=0.3$ and $r_2=0.7$. Compute the M-step mean updates.",
      skills: ["responsibilities", "weighted means", "mixture models"],
      strategy: "Use each cluster's responsibilities as fractional counts in a weighted average.",
      steps: [
        { do: "Compute cluster 1 weighted sum", result: "$0.8\\cdot2+0.3\\cdot8=4.0$", why: "each point contributes fractionally to cluster 1" },
        { do: "Compute cluster 1 total weight", result: "$0.8+0.3=1.1$", why: "responsibilities act like soft counts" },
        { do: "Update cluster 1 mean", result: "$4.0/1.1\\approx3.64$", why: "weighted mean equals weighted sum over total weight" },
        { do: "Compute cluster 2 weighted sum", result: "$0.2\\cdot2+0.7\\cdot8=6.0$", why: "use cluster 2 responsibilities" },
        { do: "Compute cluster 2 total weight", result: "$0.2+0.7=0.9$", why: "sum the soft memberships" },
        { do: "Update cluster 2 mean", result: "$6.0/0.9\\approx6.67$", why: "weighted mean for cluster 2" }
      ],
      verify: "The first updated mean is closer to 2, and the second is closer to 8, matching the larger responsibilities.",
      answer: "The updated means are approximately $3.64$ and $6.67$.",
      connects: "EM turns uncertain labels into weighted complete-data updates."
    },
    practice: [
      { problem: "Three points $1,4,7$ have responsibilities for cluster A of $0.9,0.5,0.1$. Compute the M-step mean for cluster A.", steps: [
        { do: "Compute the weighted sum", result: "$0.9\\cdot1+0.5\\cdot4+0.1\\cdot7$", why: "responsibilities weight observations" },
        { do: "Simplify the weighted sum", result: "$0.9+2.0+0.7=3.6$", why: "multiply then add" },
        { do: "Compute total weight", result: "$0.9+0.5+0.1=1.5$", why: "soft count for cluster A" },
        { do: "Divide", result: "$3.6/1.5=2.4$", why: "weighted mean formula" },
        { do: "Interpret", result: "$2.4$ is closer to $1$ than to $7$", why: "point 1 has the largest responsibility" }
      ], answer: "The updated cluster A mean is $2.4$." },
      { problem: "In a Bernoulli mixture, four observations have values $1,1,0,1$ and responsibilities for component 1 of $0.8,0.6,0.4,0.2$. Update the component 1 success probability.", steps: [
        { do: "Compute weighted successes", result: "$0.8\\cdot1+0.6\\cdot1+0.4\\cdot0+0.2\\cdot1=1.6$", why: "only observed successes contribute to numerator" },
        { do: "Compute total responsibility", result: "$0.8+0.6+0.4+0.2=2.0$", why: "soft component count" },
        { do: "Divide", result: "$1.6/2.0=0.8$", why: "Bernoulli M-step is weighted success rate" },
        { do: "Check bounds", result: "$0.8\\in[0,1]$", why: "a probability must lie between 0 and 1" },
        { do: "Interpret", result: "component 1 is success-heavy", why: "most of its responsibility is on successes" }
      ], answer: "The updated success probability is $0.8$." },
      { problem: "A two-component mixture has responsibilities for component 1 summing to $12$ across $20$ observations. Update the mixing weights.", steps: [
        { do: "Write component 1 soft count", result: "$N_1=12$", why: "sum of responsibilities gives expected membership" },
        { do: "Compute component 2 soft count", result: "$N_2=20-12=8$", why: "responsibilities across two components sum to one per point" },
        { do: "Update component 1 weight", result: "$\\pi_1=12/20=0.6$", why: "mixing weight is soft count over total count" },
        { do: "Update component 2 weight", result: "$\\pi_2=8/20=0.4$", why: "same rule for component 2" },
        { do: "Check normalization", result: "$0.6+0.4=1$", why: "mixture weights must sum to one" }
      ], answer: "The updated mixing weights are $0.6$ and $0.4$." },
      { problem: "For one data point, component likelihoods are $p(x\\mid z=1)=0.06$ and $p(x\\mid z=2)=0.02$, with current mixing weights $0.5$ and $0.5$. Compute the E-step responsibilities.", steps: [
        { do: "Compute component 1 unnormalized weight", result: "$0.5\\cdot0.06=0.03$", why: "mixing weight times likelihood" },
        { do: "Compute component 2 unnormalized weight", result: "$0.5\\cdot0.02=0.01$", why: "same calculation" },
        { do: "Add weights", result: "$0.03+0.01=0.04$", why: "normalize responsibilities" },
        { do: "Normalize component 1", result: "$0.03/0.04=0.75$", why: "responsibility is posterior component probability" },
        { do: "Normalize component 2", result: "$0.01/0.04=0.25$", why: "remaining posterior probability" }
      ], answer: "The responsibilities are $0.75$ and $0.25$." },
      { problem: "A missing-feature model imputes a hidden value with posterior mean $3.5$ in the E-step. The complete-data linear update needs the average of observed values $2$, $4$, and the hidden value. Compute the M-step average.", steps: [
        { do: "Replace the hidden value by its expectation", result: "$3.5$", why: "EM uses expected complete data" },
        { do: "Add all three values", result: "$2+4+3.5=9.5$", why: "the M-step average uses completed data" },
        { do: "Count values", result: "$3$", why: "two observed and one expected hidden value" },
        { do: "Divide", result: "$9.5/3\\approx3.17$", why: "compute the average" },
        { do: "Interpret", result: "updated mean about $3.17$", why: "the hidden value contributes softly through its expectation" }
      ], answer: "The M-step average is approximately $3.17$." }
    ],
    applications: [
      { title: "Gaussian mixture clustering", background: "EM is the classic algorithm for fitting mixtures, where cluster labels are hidden and assignments should be soft.", numbers: "Responsibilities $0.8$ and $0.2$ mean one point contributes $80\\%$ to one cluster's mean and $20\\%$ to the other." },
      { title: "Missing data imputation", background: "Before modern deep learning, EM was a standard way to fit models with missing entries by averaging over plausible completions.", numbers: "If a missing value has posterior mean $5$, a mean update over $[3,7,5]$ gives $5$." },
      { title: "Hidden Markov models", background: "Speech recognition and biosequence models used EM through the Baum-Welch algorithm to learn transition probabilities from hidden states.", numbers: "Expected transitions A to B of $12$ out of expected A transitions $40$ update probability to $0.30$." },
      { title: "Image segmentation", background: "Mixture models segment pixels into materials or regions when labels are unknown. EM updates region colors and memberships.", numbers: "A pixel intensity $100$ with responsibility $0.7$ for foreground contributes $70$ intensity-units to the foreground sum." },
      { title: "Crowdsourcing labels", background: "When worker reliability and true labels are both unknown, EM can alternate between inferred true labels and worker accuracy estimates.", numbers: "If a worker is expected correct on $45$ of $50$ tasks, reliability updates to $0.90$." },
      { title: "Latent variable recommender models", background: "Some recommenders infer hidden user types. EM estimates type memberships, then updates type-specific preferences.", numbers: "User type responsibilities $[0.2,0.8]$ and item likes $[0.1,0.6]$ give expected like rate $0.50$." }
    ],
    applicationsClose: "EM is the rhythm of incomplete-data modeling: infer soft hidden structure, then update as though that softness were data.",
    takeaways: [
      "The E-step computes posterior responsibilities for hidden variables using current parameters.",
      "The M-step maximizes expected complete-data log likelihood.",
      "Exact EM does not decrease the observed-data likelihood.",
      "EM is useful but can converge to local optima."
    ]
  },

  "math-20-17": {
    id: "math-20-17",
    title: "MCMC for Bayesian inference",
    tagline: "MCMC learns a posterior by walking through parameter space so that time spent in a region matches posterior probability.",
    connections: {
      buildsOn: ["posterior distributions", "Markov chains", "conditional probability", "Monte Carlo averages"],
      leadsTo: ["Gaussian process regression", "Bayesian deep learning & uncertainty", "posterior predictive checks"],
      usedWith: ["stationary distributions", "acceptance ratios", "autocorrelation", "expectations"]
    },
    motivation:
      "<p>You already know how to average numbers if someone gives you samples. The hard Bayesian question is how to get samples from a posterior that is known only up to a constant.</p>" +
      "<p><b>Markov chain Monte Carlo</b> builds a dependent sequence of draws whose long-run distribution is the posterior. The samples are not independent, but if the chain is well behaved, their averages estimate posterior expectations.</p>",
    definition:
      "<p>MCMC constructs a Markov chain $\\theta^{(1)},\\theta^{(2)},\\ldots$ with stationary distribution $p(\\theta\\mid y)$. In Metropolis-Hastings, propose $\\theta'$ from $q(\\theta'\\mid\\theta)$ and accept it with probability $$a=\\min\\left(1,\\dfrac{p(y\\mid\\theta')p(\\theta')q(\\theta\\mid\\theta')}{p(y\\mid\\theta)p(\\theta)q(\\theta'\\mid\\theta)}\\right).$$ The evidence cancels, which is why MCMC can sample from unnormalized posteriors.</p>" +
      "<p>After burn-in and convergence checks, posterior expectations are estimated by sample averages: $\\mathbb{E}[g(\\theta)\\mid y]\\approx \\frac1S\\sum_{s=1}^S g(\\theta^{(s)})$.</p>" +
      "<p><b>Assumptions that matter:</b> the chain must be able to reach the important posterior regions; samples are correlated, so effective sample size is smaller than raw sample count; and diagnostics are essential because finite chains can look convincing while missing modes.</p>",
    worked: {
      problem: "A symmetric Metropolis proposal moves from $\\theta=1$ to $\\theta'=2$. The unnormalized posterior density is $0.04$ at $1$ and $0.10$ at $2$. Find the acceptance probability.",
      skills: ["Metropolis ratio", "unnormalized density", "acceptance probability"],
      strategy: "With a symmetric proposal, the proposal terms cancel and only the posterior density ratio remains.",
      steps: [
        { do: "Write the acceptance rule", result: "$a=\\min(1,\\tilde p(\\theta')/\\tilde p(\\theta))$", why: "the proposal is symmetric" },
        { do: "Substitute densities", result: "$a=\\min(1,0.10/0.04)$", why: "use unnormalized posterior values" },
        { do: "Compute the ratio", result: "$0.10/0.04=2.5$", why: "the proposal moves to a denser point" },
        { do: "Apply the minimum", result: "$a=1$", why: "ratios above 1 are accepted with probability 1" },
        { do: "Interpret", result: "always accept this proposal", why: "uphill posterior moves are accepted in Metropolis" }
      ],
      verify: "The unknown normalizing constant would multiply both densities and cancel in the ratio.",
      answer: "The acceptance probability is $1$.",
      connects: "MCMC uses local accept-reject steps to make the posterior the chain's long-run distribution."
    },
    practice: [
      { problem: "A symmetric proposal moves from density $0.20$ to density $0.05$. Find the acceptance probability.", steps: [
        { do: "Write the symmetric rule", result: "$a=\\min(1,0.05/0.20)$", why: "proposal terms cancel" },
        { do: "Compute the ratio", result: "$0.25$", why: "$0.05$ is one quarter of $0.20$" },
        { do: "Apply the minimum", result: "$a=0.25$", why: "downhill moves are sometimes accepted" },
        { do: "Convert to percent", result: "$25\\%$", why: "acceptance probability is easier to read" },
        { do: "Interpret", result: "accept one time in four on average", why: "occasional downhill moves help exploration" }
      ], answer: "The acceptance probability is $0.25$." },
      { problem: "A chain keeps samples $2,3,5,6$ after burn-in. Estimate the posterior mean of $\\theta$.", steps: [
        { do: "Add the samples", result: "$2+3+5+6=16$", why: "Monte Carlo mean uses the sample sum" },
        { do: "Count samples", result: "$4$", why: "there are four retained draws" },
        { do: "Divide", result: "$16/4=4$", why: "sample average estimates posterior mean" },
        { do: "Name the estimator", result: "$\\hat{\\mathbb{E}}[\\theta]=4$", why: "MCMC averages estimate posterior expectations" },
        { do: "Note dependence", result: "estimate uses correlated draws", why: "MCMC samples are usually not independent" }
      ], answer: "The posterior mean estimate is $4$." },
      { problem: "For samples $1,2,4,5$, estimate $\\mathbb{E}[\\theta^2\\mid y]$.", steps: [
        { do: "Square the samples", result: "$1,4,16,25$", why: "apply $g(\\theta)=\\theta^2$ to each draw" },
        { do: "Add squared values", result: "$1+4+16+25=46$", why: "Monte Carlo average uses transformed samples" },
        { do: "Count samples", result: "$4$", why: "four draws are retained" },
        { do: "Divide", result: "$46/4=11.5$", why: "average the transformed values" },
        { do: "State the estimate", result: "$11.5$", why: "this estimates the posterior second moment" }
      ], answer: "$\\mathbb{E}[\\theta^2\\mid y]\\approx11.5$." },
      { problem: "A nonsymmetric proposal has density ratio $q(\\theta\\mid\\theta')/q(\\theta'\\mid\\theta)=0.5$. The target density ratio is $3$. Find the Metropolis-Hastings acceptance probability.", steps: [
        { do: "Write the full ratio", result: "$3\\cdot0.5$", why: "multiply target ratio by reverse-over-forward proposal ratio" },
        { do: "Compute", result: "$1.5$", why: "combine target and proposal correction" },
        { do: "Apply the cap", result: "$\\min(1,1.5)=1$", why: "acceptance probabilities cannot exceed 1" },
        { do: "Interpret", result: "always accept", why: "after correction the move is favorable" },
        { do: "Check role of proposal", result: "correction lowered $3$ to $1.5$", why: "asymmetry must be accounted for" }
      ], answer: "The acceptance probability is $1$." },
      { problem: "A Bayesian model's MCMC posterior predictive samples for next-day demand are $90,110,120,80,100$. Estimate the predictive mean and the probability demand exceeds $100$.", steps: [
        { do: "Add samples", result: "$90+110+120+80+100=500$", why: "predictive mean uses sample average" },
        { do: "Divide by sample count", result: "$500/5=100$", why: "there are five predictive samples" },
        { do: "Count samples above $100$", result: "$2$", why: "$110$ and $120$ exceed $100$" },
        { do: "Divide by total samples", result: "$2/5=0.4$", why: "Monte Carlo probability is a fraction of samples" },
        { do: "Interpret", result: "$40\\%$ chance", why: "sample frequency estimates posterior predictive probability" }
      ], answer: "Predictive mean $100$; estimated probability above $100$ is $0.4$." }
    ],
    applications: [
      { title: "Hierarchical model inference", background: "Hierarchical posteriors are often high-dimensional and nonconjugate. MCMC is a standard way to preserve uncertainty across all levels.", numbers: "If 4000 draws give group-effect mean $1.2$ and standard deviation $0.3$, a rough interval is $1.2\\pm0.6$." },
      { title: "Posterior predictive checks", background: "Bayesian workflow uses simulated replicated data to see whether the model can reproduce observed patterns.", numbers: "If 30 of 100 replicated datasets have a statistic above the observed value, the posterior predictive tail probability is $0.30$." },
      { title: "Uncertainty in small experiments", background: "MCMC can summarize posteriors when exact formulas are unavailable for experiment metrics.", numbers: "Samples of lift with 950 of 1000 above zero estimate $p(\\text{lift}>0)=0.95$." },
      { title: "Bayesian logistic regression", background: "Regression with priors and nonlinear likelihoods is a natural MCMC use case, especially when uncertainty matters more than speed.", numbers: "If coefficient samples have mean $0.4$ and sd $0.1$, odds multiplier is about $e^{0.4}\\approx1.49$." },
      { title: "Reliability engineering", background: "Failure-rate models with censoring often use MCMC because latent lifetimes and parameters interact.", numbers: "If 1200 of 2000 posterior samples have failure rate below $0.01$, estimated probability is $0.60$." },
      { title: "Bayesian decision analysis", background: "Decisions can be evaluated over posterior samples, averaging utility rather than using one point estimate.", numbers: "Utilities $10,8,-2,6$ average to $5.5$, estimating expected utility under posterior uncertainty." }
    ],
    applicationsClose: "MCMC is slower than a formula, but it gives the precious thing Bayes promises: samples from uncertainty itself.",
    takeaways: [
      "MCMC builds a Markov chain whose stationary distribution is the posterior.",
      "Metropolis-Hastings uses density ratios, so the evidence cancels.",
      "Posterior expectations are estimated by averages over retained samples.",
      "Convergence, autocorrelation, and effective sample size must be checked."
    ]
  },

  "math-20-18": {
    id: "math-20-18",
    title: "Gaussian process regression",
    tagline: "A Gaussian process is a distribution over functions, updated by data into smooth predictions with uncertainty.",
    connections: {
      buildsOn: ["multivariate normal distributions", "conditional distributions", "kernels", "Bayesian regression"],
      leadsTo: ["Bayesian deep learning & uncertainty", "kernel methods", "Bayesian optimization"],
      usedWith: ["covariance matrices", "matrix inversion", "conditioning", "smoothness assumptions"]
    },
    motivation:
      "<p>You already know Bayesian linear regression puts a distribution over possible lines. Gaussian process regression takes the same idea and removes the fixed line shape.</p>" +
      "<p>A <b>Gaussian process</b> puts a prior over functions. Points close together in input space are encouraged to have similar outputs through a kernel. After observing data, the model predicts both a mean and an uncertainty at new inputs.</p>",
    definition:
      "<p>A Gaussian process is written $f\\sim\\mathcal{GP}(m,k)$, where $m(x)$ is a mean function and $k(x,x')$ is a covariance kernel. For any finite inputs $x_1,\\ldots,x_n$, the vector $(f(x_1),\\ldots,f(x_n))$ is multivariate normal with mean entries $m(x_i)$ and covariance entries $k(x_i,x_j)$.</p>" +
      "<p>For noisy observations $y=f(X)+\\epsilon$ with $\\epsilon\\sim\\mathcal{N}(0,\\sigma_n^2I)$, the predictive mean at $x_*$ is $k_*^T(K+\\sigma_n^2I)^{-1}y$, assuming zero prior mean. The predictive variance is $k(x_*,x_*)-k_*^T(K+\\sigma_n^2I)^{-1}k_*$. These are just multivariate-normal conditioning formulas.</p>" +
      "<p><b>Assumptions that matter:</b> the kernel encodes smoothness and similarity assumptions; matrix inversion scales poorly with many training points; and predictive uncertainty is meaningful only if the kernel and noise model are reasonable for the data.</p>",
    worked: {
      problem: "A zero-mean noiseless GP has one training point $x_1=0$ with $y_1=2$. For a new point $x_*$, suppose $k(x_1,x_1)=1$, $k(x_*,x_1)=0.5$, and $k(x_*,x_*)=1$. Find the predictive mean and variance.",
      skills: ["GP conditioning", "kernel covariance", "predictive uncertainty"],
      strategy: "With one training point, the matrix formula reduces to scalar covariance ratios.",
      steps: [
        { do: "Write the predictive mean", result: "$\\mu_*=k_*K^{-1}y$", why: "zero-mean noiseless GP formula" },
        { do: "Substitute scalars", result: "$\\mu_*=0.5\\cdot1^{-1}\\cdot2$", why: "the training covariance is $1$" },
        { do: "Compute the mean", result: "$\\mu_*=1$", why: "the new point is half correlated with the observed point" },
        { do: "Write the variance", result: "$\\sigma_*^2=1-0.5\\cdot1^{-1}\\cdot0.5$", why: "conditioned variance subtracts explained covariance" },
        { do: "Compute the variance", result: "$\\sigma_*^2=1-0.25=0.75$", why: "some uncertainty remains away from the observed point" }
      ],
      verify: "At the training point the covariance would be $1$, giving mean $2$ and variance $0$ in the noiseless case; here weaker covariance gives partial learning.",
      answer: "Predictive mean $1$ and predictive variance $0.75$.",
      connects: "GP regression is multivariate normal conditioning applied to function values."
    },
    practice: [
      { problem: "In the same one-point noiseless setup, let $y_1=3$ and $k(x_*,x_1)=0.2$ with unit variances. Compute predictive mean and variance.", steps: [
        { do: "Write the mean formula", result: "$\\mu_*=0.2\\cdot1^{-1}\\cdot3$", why: "one-point scalar conditioning" },
        { do: "Compute the mean", result: "$0.6$", why: "$0.2\\cdot3=0.6$" },
        { do: "Write the variance formula", result: "$\\sigma_*^2=1-0.2\\cdot1^{-1}\\cdot0.2$", why: "subtract covariance explained by the observation" },
        { do: "Compute the subtraction", result: "$1-0.04=0.96$", why: "weak covariance leaves high uncertainty" },
        { do: "Interpret", result: "prediction is close to prior mean", why: "the new point is only weakly related to the observed point" }
      ], answer: "Mean $0.6$ and variance $0.96$." },
      { problem: "A noisy one-point GP has $k(x_1,x_1)=1$, noise variance $0.25$, $y_1=4$, $k(x_*,x_1)=0.5$, and $k(x_*,x_*)=1$. Compute predictive mean and variance.", steps: [
        { do: "Add noise to training variance", result: "$1+0.25=1.25$", why: "observed $y$ includes noise" },
        { do: "Compute inverse scalar", result: "$1/1.25=0.8$", why: "scalar matrix inverse" },
        { do: "Compute mean", result: "$0.5\\cdot0.8\\cdot4=1.6$", why: "use noisy GP mean formula" },
        { do: "Compute variance reduction", result: "$0.5\\cdot0.8\\cdot0.5=0.2$", why: "noise reduces how much is learned" },
        { do: "Compute variance", result: "$1-0.2=0.8$", why: "subtract reduction from prior variance" }
      ], answer: "Mean $1.6$ and variance $0.8$." },
      { problem: "Using squared-exponential kernel $k(x,x')=\\exp(-(x-x')^2/2)$, compute $k(0,1)$ and $k(0,2)$ using $e^{-0.5}\\approx0.607$ and $e^{-2}\\approx0.135$.", steps: [
        { do: "Compute distance for $0$ and $1$", result: "$(0-1)^2=1$", why: "kernel depends on squared distance" },
        { do: "Evaluate first exponent", result: "$-1/2=-0.5$", why: "divide squared distance by 2" },
        { do: "Read first covariance", result: "$k(0,1)\\approx0.607$", why: "use the given exponential" },
        { do: "Compute distance for $0$ and $2$", result: "$(0-2)^2=4$", why: "farther points are less similar" },
        { do: "Read second covariance", result: "$k(0,2)=e^{-2}\\approx0.135$", why: "larger distance gives smaller covariance" }
      ], answer: "$k(0,1)\\approx0.607$ and $k(0,2)\\approx0.135$." },
      { problem: "A GP prediction has mean $5$ and variance $4$. Give an approximate $95\\%$ predictive interval using $\\mu\\pm2\\sigma$.", steps: [
        { do: "Compute standard deviation", result: "$\\sigma=\\sqrt4=2$", why: "standard deviation is square root of variance" },
        { do: "Compute two standard deviations", result: "$2\\sigma=4$", why: "rough $95\\%$ normal interval" },
        { do: "Compute lower endpoint", result: "$5-4=1$", why: "subtract uncertainty margin" },
        { do: "Compute upper endpoint", result: "$5+4=9$", why: "add uncertainty margin" },
        { do: "State interval", result: "$[1,9]$", why: "predictive intervals include output uncertainty" }
      ], answer: "An approximate $95\\%$ interval is $[1,9]$." },
      { problem: "In Bayesian optimization, a candidate has GP mean $0.70$ and standard deviation $0.10$; another has mean $0.60$ and standard deviation $0.40$. Compute upper confidence score $\\mu+2\\sigma$ for each and choose the exploratory candidate.", steps: [
        { do: "Score first candidate", result: "$0.70+2\\cdot0.10=0.90$", why: "upper confidence adds uncertainty bonus" },
        { do: "Score second candidate", result: "$0.60+2\\cdot0.40=1.40$", why: "larger uncertainty raises exploration value" },
        { do: "Compare scores", result: "$1.40>0.90$", why: "choose the larger acquisition score" },
        { do: "Identify choice", result: "second candidate", why: "it has more upside under uncertainty" },
        { do: "Interpret", result: "exploration wins", why: "Bayesian optimization balances mean and uncertainty" }
      ], answer: "The scores are $0.90$ and $1.40$; choose the second candidate." }
    ],
    applications: [
      { title: "Bayesian optimization", background: "GPs are widely used to optimize expensive black-box functions because they provide both prediction and uncertainty.", numbers: "With mean $0.6$ and sd $0.2$, upper confidence $\\mu+2\\sigma=1.0$." },
      { title: "Spatial interpolation", background: "Kriging in geostatistics is an ancestor of GP regression. Nearby locations tend to have correlated measurements.", numbers: "A location half-correlated with a measured value $10$ has zero-mean prediction $5$ in the one-point noiseless case." },
      { title: "Time-series smoothing", background: "GP kernels can encode smooth trends over time without choosing a fixed polynomial degree.", numbers: "With length scale $2$, times one unit apart have covariance $e^{-1/8}\\approx0.882$." },
      { title: "Active learning", background: "A GP can ask for labels where uncertainty is high, saving labeling effort.", numbers: "A point with variance $0.9$ is more informative than one with variance $0.1$ if costs are equal." },
      { title: "Robotics calibration", background: "Robots can model unknown terrain or sensor bias as a smooth function learned from measurements.", numbers: "Bias prediction mean $0.03$ m with sd $0.01$ gives rough interval $[0.01,0.05]$ m." },
      { title: "Small-data regression", background: "When data are scarce, GP priors can express smoothness and produce calibrated uncertainty better than a high-parameter black box.", numbers: "One observation with covariance $0.8$ to a test point and value $5$ gives noiseless prediction $4$." }
    ],
    applicationsClose: "Gaussian processes make uncertainty visible in function learning: close data guide the mean, and unexplored regions keep their doubt.",
    takeaways: [
      "A Gaussian process is a distribution over functions defined by a mean function and kernel.",
      "Finite collections of function values are multivariate normal.",
      "GP regression predicts by conditioning a joint Gaussian over observed and test values.",
      "Kernels encode assumptions about similarity, smoothness, and uncertainty."
    ]
  },

  "math-20-19": {
    id: "math-20-19",
    title: "Bayesian deep learning & uncertainty",
    tagline: "Bayesian deep learning asks neural networks not just for predictions, but for honest uncertainty around them.",
    connections: {
      buildsOn: ["Bayesian inference", "variational inference", "posterior predictive distributions", "neural networks"],
      leadsTo: ["calibration", "decision theory", "active learning", "safe deployment"],
      usedWith: ["predictive distributions", "Monte Carlo averages", "entropy", "credible intervals"]
    },
    motivation:
      "<p>You already know a neural network can output a class probability or a regression value. But a confident number is not always a trustworthy number.</p>" +
      "<p><b>Bayesian deep learning</b> treats weights, functions, or last-layer parameters as uncertain. Instead of one prediction, it averages predictions across plausible models. That gives both a mean prediction and a measure of uncertainty, which matters when decisions are costly.</p>",
    definition:
      "<p>In Bayesian deep learning, the posterior predictive distribution is $$p(y_*\\mid x_*,D)=\\int p(y_*\\mid x_*,w)p(w\\mid D)\\,dw,$$ where $D$ is training data and $w$ are neural-network weights or Bayesian parameters. Because the integral is usually impossible exactly, methods such as variational inference, Laplace approximations, ensembles, dropout approximations, or MCMC estimate it.</p>" +
      "<p>A Monte Carlo approximation draws $w^{(1)},\\ldots,w^{(S)}$ from an approximate posterior and averages predictions: $p(y_*\\mid x_*,D)\\approx\\frac1S\\sum_s p(y_*\\mid x_*,w^{(s)})$. Disagreement across draws is epistemic uncertainty; randomness that remains even for a fixed model is aleatoric uncertainty.</p>" +
      "<p><b>Assumptions that matter:</b> approximate Bayesian neural methods can be miscalibrated; ensembles and dropout are approximations, not magic guarantees; and uncertainty should be validated with calibration, out-of-distribution tests, and decision-focused metrics.</p>",
    worked: {
      problem: "A Bayesian classifier makes three posterior weight-sample predictions for the probability of class 1: $0.70$, $0.60$, and $0.20$. Estimate the posterior predictive probability, sample variance of the probabilities, and entropy using $-p\\ln p-(1-p)\\ln(1-p)$ with $p=0.50$ giving entropy about $0.693$.",
      skills: ["Monte Carlo prediction", "epistemic uncertainty", "classification entropy"],
      strategy: "Average the sampled probabilities first, then measure disagreement around that average.",
      steps: [
        { do: "Add sampled probabilities", result: "$0.70+0.60+0.20=1.50$", why: "posterior predictive probability averages model predictions" },
        { do: "Divide by sample count", result: "$1.50/3=0.50$", why: "there are three posterior samples" },
        { do: "Compute deviations", result: "$0.20,0.10,-0.30$", why: "subtract the mean $0.50$ from each probability" },
        { do: "Square deviations", result: "$0.04,0.01,0.09$", why: "variance measures squared disagreement" },
        { do: "Average squared deviations", result: "$(0.04+0.01+0.09)/3\\approx0.0467$", why: "use a simple Monte Carlo variance summary" },
        { do: "Read entropy at the mean", result: "$0.693$ nats", why: "mean probability $0.50$ is maximally uncertain for two classes" }
      ],
      verify: "The average prediction is uncertain because it is near $0.5$, and the sample predictions also disagree substantially.",
      answer: "Predictive probability $0.50$, probability-disagreement variance about $0.0467$, and entropy about $0.693$ nats.",
      connects: "Bayesian deep learning separates what the average model predicts from how much plausible models disagree."
    },
    practice: [
      { problem: "Four posterior samples predict regression values $10,12,9,13$. Estimate the predictive mean and sample standard deviation using denominator $4$.", steps: [
        { do: "Add predictions", result: "$10+12+9+13=44$", why: "Monte Carlo mean uses all posterior predictions" },
        { do: "Divide by count", result: "$44/4=11$", why: "there are four samples" },
        { do: "Compute deviations", result: "$-1,1,-2,2$", why: "subtract the mean 11" },
        { do: "Average squared deviations", result: "$(1+1+4+4)/4=2.5$", why: "variance summarizes model disagreement" },
        { do: "Take square root", result: "$\\sqrt{2.5}\\approx1.58$", why: "standard deviation is easier to interpret" }
      ], answer: "Predictive mean $11$ and standard deviation about $1.58$." },
      { problem: "An ensemble gives class-1 probabilities $0.9,0.8,0.7,0.6,0.5$. Estimate the predictive probability and decide whether it exceeds threshold $0.7$.", steps: [
        { do: "Add probabilities", result: "$0.9+0.8+0.7+0.6+0.5=3.5$", why: "average ensemble predictions" },
        { do: "Divide by five", result: "$3.5/5=0.7$", why: "five models contribute" },
        { do: "Compare to threshold", result: "$0.7$ equals $0.7$", why: "the score is exactly at the cutoff" },
        { do: "Apply an exceeds rule", result: "does not exceed", why: "exceeds means strictly greater than the threshold" },
        { do: "Interpret", result: "borderline decision", why: "uncertainty policy matters near cutoffs" }
      ], answer: "The predictive probability is $0.7$; it does not strictly exceed $0.7$." },
      { problem: "A binary classifier predicts $p=0.8$. Compute entropy using $\\ln0.8\\approx-0.223$ and $\\ln0.2\\approx-1.609$.", steps: [
        { do: "Write entropy", result: "$H=-0.8\\ln0.8-0.2\\ln0.2$", why: "binary entropy formula" },
        { do: "Substitute logs", result: "$H=-0.8(-0.223)-0.2(-1.609)$", why: "use the given approximations" },
        { do: "Multiply terms", result: "$0.1784+0.3218$", why: "negative times negative becomes positive" },
        { do: "Add", result: "$0.5002$", why: "combine entropy contributions" },
        { do: "Interpret", result: "about $0.50$ nats", why: "less uncertain than $p=0.5$ with entropy $0.693$" }
      ], answer: "The entropy is approximately $0.500$ nats." },
      { problem: "A model reports aleatoric variance $4$ and epistemic variance $9$ for a regression prediction. Compute total predictive standard deviation.", steps: [
        { do: "Add variances", result: "$4+9=13$", why: "independent uncertainty sources add in variance" },
        { do: "Take square root", result: "$\\sqrt{13}\\approx3.61$", why: "standard deviation is square root of variance" },
        { do: "Identify aleatoric source", result: "$4$", why: "data noise remains even with known model" },
        { do: "Identify epistemic source", result: "$9$", why: "model uncertainty can shrink with more data" },
        { do: "Interpret", result: "total uncertainty about $3.61$", why: "decision thresholds should account for both sources" }
      ], answer: "Total predictive standard deviation is about $3.61$." },
      { problem: "An active-learning system has two unlabeled points. Point A has predictive probabilities $[0.5,0.5]$. Point B has $[0.9,0.1]$. Using entropies $0.693$ and about $0.325$, which point should be labeled first?", steps: [
        { do: "Read entropy for A", result: "$H_A=0.693$", why: "balanced probabilities are highly uncertain" },
        { do: "Read entropy for B", result: "$H_B\\approx0.325$", why: "confident probabilities have lower entropy" },
        { do: "Compare entropies", result: "$0.693>0.325$", why: "active learning often chooses highest uncertainty" },
        { do: "Select point", result: "Point A", why: "its label should be more informative" },
        { do: "Connect to Bayesian uncertainty", result: "query high-uncertainty examples", why: "labels are most valuable where the model is unsure" }
      ], answer: "Label Point A first." }
    ],
    applications: [
      { title: "Medical triage models", background: "Clinical ML needs calibrated uncertainty because a wrong confident prediction can harm patients. Bayesian predictive intervals can trigger human review.", numbers: "Risk samples $0.12,0.18,0.30$ average to $0.20$; the spread warns that the estimate is not settled." },
      { title: "Autonomous driving perception", background: "A vision system should know when rain, glare, or rare objects make predictions unreliable. Epistemic uncertainty can flag unfamiliar situations.", numbers: "If five models predict pedestrian probability $0.1,0.2,0.8,0.7,0.2$, the mean is $0.4$ but disagreement is high." },
      { title: "Out-of-distribution detection", background: "Bayesian methods can help identify inputs far from training data, where model uncertainty should rise.", numbers: "An in-domain image entropy $0.15$ versus OOD entropy $1.05$ gives a measurable uncertainty gap of $0.90$ nats." },
      { title: "Active learning for labels", background: "Labels are expensive. Bayesian uncertainty helps choose examples that are expected to teach the model most.", numbers: "A point with entropy $0.69$ is a better query than one with entropy $0.10$ under uncertainty sampling." },
      { title: "Forecasting with neural nets", background: "Bayesian deep forecasting reports intervals, not only point predictions, which helps staffing, inventory, and risk planning.", numbers: "Demand mean $500$ with sd $40$ gives rough $95\\%$ interval $[420,580]$." },
      { title: "Calibration in classifiers", background: "A calibrated model's $70\\%$ predictions should be correct about $70\\%$ of the time. Bayesian averaging can improve calibration but must be checked.", numbers: "Among 100 examples predicted at $0.7$, about 70 correct is calibrated; 55 correct is overconfident." },
      { title: "Bayesian last-layer methods", background: "A practical compromise is to keep a deep feature extractor fixed and put a Bayesian model on the last layer.", numbers: "Feature value $2$ with weight samples $0.4,0.5,0.7$ gives logit samples $0.8,1.0,1.4$." }
    ],
    applicationsClose: "The capstone lesson is this: powerful models are more useful when they can say both what they think and how sure they are.",
    takeaways: [
      "Bayesian deep learning averages predictions over uncertain weights or functions.",
      "Monte Carlo predictive means summarize predictions; disagreement summarizes epistemic uncertainty.",
      "Aleatoric uncertainty is data noise; epistemic uncertainty is model uncertainty that more data can reduce.",
      "Approximate Bayesian neural methods must be validated for calibration and deployment safety."
    ]
  }
};
