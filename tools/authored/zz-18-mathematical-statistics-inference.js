module.exports = {
  "math-18-01": {
    connectionsProse: "<p>This lesson starts the inference vocabulary that every later statistical method depends on. Probability lessons describe random variables and distributions; inference begins by naming the real group of interest and the observed part of that group. Once population and sample are separated, later ideas such as bias, standard error, confidence intervals, and tests have a clear target.</p>",
    motivation: "<p>Inference starts by separating the full group you care about from the part you actually observe. A sample can be large and still not answer the intended question if the population was named poorly or the sampling process misses important cases. The first statistical move is therefore not a formula, but a modeling boundary: who or what belongs in the population, and how did observations enter the dataset?</p>" +
                "<p>The sample is useful only after the target population and sampling process are named. Representativeness means the observed cases carry information about the population parameter, while frame error means the sampling mechanism systematically leaves out part of the target group. A sample statistic is then a data summary, and a population parameter is the fixed quantity that summary is trying to learn.</p>",
    definition: "<p>A population is the full group or process of interest, and a sample is the observed subset used for inference. A parameter is a fixed population quantity such as $\\mu$, while a statistic is a data summary such as $\\bar X$.</p>" +
                "<p><b>Assumptions that matter:</b> The target population, sampling frame, and sampling process must be named; representativeness depends on whether the observed cases carry information about the intended population.</p>",
    symbols: [
      { sym: "$X_1,\\ldots,X_n$", desc: "observed sampled values" },
      { sym: "$n$", desc: "sample size" },
      { sym: "$\\mu$", desc: "population mean" },
      { sym: "$\\bar X$", desc: "sample mean" },
      { sym: "$N$", desc: "finite population size when relevant" }
    ],
    applications: [
      { title: "User research sample", background: "A sampled click count gives a sample CTR.", numbers: "$96$ clicks among $800$ sampled users gives sample CTR $0.12$." },
      { title: "Test-set sample", background: "A held-out test sample estimates deployment accuracy.", numbers: "$450/500=0.90$ estimates deployment accuracy." },
      { title: "Polling sample", background: "A polling sample estimates electorate support.", numbers: "$540/1000=0.54$ estimates electorate support." },
      { title: "Label audit", background: "A label sample estimates corpus error.", numbers: "$7/200=0.035$ sample error rate estimates corpus error." },
      { title: "Latency sample", background: "A sampled set of latencies summarizes the population latency level.", numbers: "$80,90,110,120$ ms has sample mean $100$ ms." },
      { title: "Stratified audit", background: "Equal sampling within strata ensures each region is represented in the audit.", numbers: "$40$ examples from each of $5$ regions gives $200$ sampled recommendations." }
    ]
  },
  "math-18-02": {
    connectionsProse: "<p>This lesson builds on samples and population parameters. A statistic is any rule that uses only the observed data, while an estimator is a statistic used with a particular inferential purpose. That distinction prepares the ground for later lessons on bias, variance, MSE, consistency, and efficiency.</p>",
    motivation: "<p>A statistic is any data-only recipe. It can be a mean, median, maximum, count, percentile, or any other quantity computed after the sample is observed. The rule is not allowed to use the unknown parameter itself; it must be computable from the data alone.</p>" +
                "<p>It becomes an estimator when the recipe is chosen to learn a specific population parameter. The same statistic may be useful for description in one setting and estimation in another. For the sample mean, the important fact is that its long-run center equals the population mean when the draws share that mean.</p>",
    definition: "<p>A statistic is a function of the observed sample, and an estimator is a statistic used to target an unknown parameter. For the sample mean, $$\\bar X=\\frac1n\\sum_i X_i.$$</p>" +
                "<p><b>Assumptions that matter:</b> The rule must use only observed data; the unbiasedness calculation for $\\bar X$ assumes all draws have mean $\\mu$.</p>",
    symbols: [
      { sym: "$T(X_1,\\ldots,X_n)$", desc: "statistic" },
      { sym: "$\\hat\\theta$", desc: "estimator" },
      { sym: "$\\theta$", desc: "target parameter" },
      { sym: "$\\bar x$", desc: "realized estimate" }
    ],
    derivation: [
      { do: "Define the sample mean from the sample.", result: "$\\bar X=\\frac1n\\sum_iX_i$", why: "the estimator must be computed from observed sample values" },
      { do: "Take expectation of both sides.", result: "$E[\\bar X]=E[\\frac1n\\sum_iX_i]$", why: "long-run centering is assessed through expectation" },
      { do: "Use linearity of expectation.", result: "$E[\\bar X]=\\frac1n\\sum_iE[X_i]$", why: "expectation distributes over sums and constants" },
      { do: "Substitute the common mean.", result: "$E[\\bar X]=\\frac1n(n\\mu)=\\mu$", why: "all draws have mean $\\mu$" },
      { do: "Conclude the targeting property.", result: "$E[\\bar X]-\\mu=0$", why: "$\\bar X$ targets $\\mu$ without systematic long-run shift" }
    ],
    applications: [
      { title: "CTR estimator", background: "A sample proportion estimates click probability.", numbers: "$37/1000=0.037$." },
      { title: "Latency mean", background: "A sample mean summarizes observed latency.", numbers: "$(40+50+70+80)/4=60$ ms." },
      { title: "Robust center", background: "Median and mean can behave differently in the presence of an outlier.", numbers: "$2,3,4,100$ has median $3.5$ and mean $27.25$." },
      { title: "Error-rate estimator", background: "A sample error fraction estimates the process error rate.", numbers: "$9/150=0.06$." },
      { title: "Quantile statistic", background: "The median is a statistic computed from ordered data.", numbers: "median of $10,20,30,40,50$ is $30$." },
      { title: "Feature centering", background: "A sample mean can be used to center feature values.", numbers: "$1.2,1.5,1.8$ gives mean $1.5$." }
    ]
  },
  "math-18-03": {
    connectionsProse: "<p>This lesson connects raw data to the summaries used before formal inference. Earlier lessons define samples; descriptive statistics make those samples readable by reporting center, spread, and shape. Later inference lessons use these summaries as estimates, diagnostics, and inputs to standard errors.</p>",
    motivation: "<p>Descriptive statistics compress observed data into center, spread, and shape before any population claim is made. They help reveal the scale of the measurements, whether a few values dominate the average, and whether groups look broadly comparable before a model is fitted.</p>" +
                "<p>The key point is that description is still about the observed dataset. A sample mean or variance may later become part of an estimator, but descriptive work first asks what the sample itself says. The sample variance example shows why spread is measured through deviations from the sample mean and why the denominator accounts for using that mean.</p>",
    definition: "<p>Descriptive statistics summarize observed data through center, spread, and shape. A common spread summary is sample variance, $$s^2=\\frac{1}{n-1}\\sum_i(x_i-\\bar x)^2.$$</p>" +
                "<p><b>Assumptions that matter:</b> These summaries first describe the observed sample; inferential use requires separate assumptions about how the sample represents a population.</p>",
    symbols: [
      { sym: "$\\bar x$", desc: "sample mean" },
      { sym: "$s^2$", desc: "sample variance" },
      { sym: "$x_i-\\bar x$", desc: "deviation" },
      { sym: "IQR", desc: "interquartile range" }
    ],
    derivation: [
      { do: "Compute the sample mean for $2,4,4,6,9$.", result: "$\\bar x=25/5=5$", why: "deviations are measured from the sample center" },
      { do: "Subtract the mean from each observation.", result: "$-3,-1,-1,1,4$", why: "spread is based on distances from the mean" },
      { do: "Square the deviations.", result: "$9,1,1,1,16$", why: "squaring makes negative and positive deviations contribute positively" },
      { do: "Add the squared deviations.", result: "$28$", why: "total squared spread is accumulated before averaging" },
      { do: "Divide by the degrees of freedom.", result: "$28/(5-1)=28/4$", why: "one degree of freedom is used by $\\bar x$" },
      { do: "Report the sample variance.", result: "$s^2=7$", why: "this is the sample spread estimate" }
    ],
    applications: [
      { title: "Feature scaling", background: "Center and range describe the feature scale.", numbers: "values $10,12,18$ have mean $13.33$ and range $8$." },
      { title: "Class imbalance", background: "The positive-class fraction summarizes label balance.", numbers: "$50/1000=0.05$ positives." },
      { title: "Latency percentile", background: "A percentile reports where most observed latencies fall.", numbers: "a 95th percentile of $240$ ms means about $95\\%$ are no larger." },
      { title: "Outlier effect", background: "An outlier can move the mean much more than the median.", numbers: "$5,6,5,7,100$ has median $6$ and mean $24.6$." },
      { title: "Balance check", background: "Group means can be compared before modeling.", numbers: "treatment mean age $35.5$ minus control $35.2$ is $0.3$." },
      { title: "Batch loss", background: "A mean loss summarizes a mini-batch.", numbers: "$0.2,0.3,0.5$ average to $0.333$." }
    ]
  },
  "math-18-04": {
    connectionsProse: "<p>This lesson moves from describing one sample to understanding how a statistic varies across possible samples. Probability gives distributions for random variables; sampling distributions give distributions for data summaries. They are the foundation for standard errors, confidence intervals, tests, and large-sample approximations.</p>",
    motivation: "<p>A sampling distribution describes how a statistic would move across repeated samples, which is the source of standard errors. Even if the population parameter is fixed, different random samples usually produce different sample means, proportions, or regression coefficients. The sampling distribution is the probability model for that variation.</p>" +
                "<p>The practical value is that uncertainty can be attached to an estimate. For an average of independent observations, the individual variances add but the averaging factor shrinks the result. That is why the standard error falls like $1/\\sqrt n$ rather than like $1/n$.</p>",
    definition: "<p>A sampling distribution is the distribution of a statistic across repeated samples. For independent draws with variance $\\sigma^2$, $$\\operatorname{Var}(\\bar X)=\\frac{\\sigma^2}{n},\\qquad SE=\\frac{\\sigma}{\\sqrt n}.$$</p>" +
                "<p><b>Assumptions that matter:</b> The variance formula uses independent draws with common variance $\\sigma^2$.</p>",
    symbols: [
      { sym: "$T$", desc: "statistic" },
      { sym: "sampling distribution", desc: "distribution of $T$ over repeated samples" },
      { sym: "$SE$", desc: "standard error" },
      { sym: "$\\sigma$", desc: "population SD" }
    ],
    derivation: [
      { do: "Define the sample mean.", result: "$\\bar X=\\frac1n\\sum_iX_i$", why: "the statistic averages the observations" },
      { do: "Apply variance scaling.", result: "$\\operatorname{Var}(\\bar X)=\\frac1{n^2}\\operatorname{Var}(\\sum_iX_i)$", why: "$\\operatorname{Var}(cY)=c^2\\operatorname{Var}(Y)$" },
      { do: "Use independence to add variances.", result: "$\\operatorname{Var}(\\sum_iX_i)=\\sum_i\\operatorname{Var}(X_i)$", why: "independent covariance terms are zero" },
      { do: "Substitute the common variance.", result: "$\\sum_i\\operatorname{Var}(X_i)=n\\sigma^2$", why: "each draw has variance $\\sigma^2$" },
      { do: "Simplify.", result: "$\\operatorname{Var}(\\bar X)=\\sigma^2/n$", why: "$n\\sigma^2/n^2=\\sigma^2/n$" },
      { do: "Take the square root.", result: "$SE=\\sigma/\\sqrt n$", why: "standard error is the standard deviation of the sampling distribution" }
    ],
    applications: [
      { title: "Mean interval width", background: "An estimate plus or minus two standard errors gives a rough interval.", numbers: "estimate $0.60$, SE $0.05$ gives rough interval $[0.50,0.70]$." },
      { title: "Difference of rates", background: "Independent standard errors combine by adding variances.", numbers: "two SEs $0.01$ combine to $\\sqrt{0.01^2+0.01^2}=0.0141$." },
      { title: "Accuracy SE", background: "A sample accuracy has binomial standard error.", numbers: "$p=0.90,n=100$ gives $0.03$." },
      { title: "Simulation average", background: "Large simulation runs reduce Monte Carlo standard error.", numbers: "$\\sigma=5,n=10{,}000$ gives SE $0.05$." },
      { title: "Poll margin", background: "A poll proportion is noisiest near one half.", numbers: "$p=0.5,n=1600$ gives SE $0.0125$." },
      { title: "Latency mean", background: "A sample latency mean has SE equal to sample SD divided by square root sample size.", numbers: "sample SD $30$, $n=900$ gives SE $1$ ms." }
    ]
  },
  "math-18-05": {
    connectionsProse: "<p>This lesson builds on statistics, estimators, and sampling distributions. A point estimator returns one data-based value for an unknown parameter. Later lessons explain how to judge that value through bias, variance, MSE, consistency, and intervals.</p>",
    motivation: "<p>A point estimate is the single number a data rule returns for an unknown parameter. It is the natural first summary when the goal is to learn a mean, rate, probability, variance, or coefficient. The number gives a center for the inference, but by itself it does not say how much random sampling error remains.</p>" +
                "<p>For Bernoulli data, the sample proportion is the most direct point estimate of the success probability. The count of successes is divided by the number of trials, and the resulting estimate has a sampling variance determined by both the probability and the sample size. That variance is why point estimation leads immediately to standard errors.</p>",
    definition: "<p>A point estimator returns one data-based value for an unknown parameter. For Bernoulli success probability $p$, $$\\hat p=\\frac{S}{n},\\qquad SE(\\hat p)\\approx\\sqrt{\\frac{\\hat p(1-\\hat p)}{n}}.$$</p>" +
                "<p><b>Assumptions that matter:</b> The Bernoulli calculation assumes independent $0/1$ trials with common success probability $p$.</p>",
    symbols: [
      { sym: "$\\hat\\theta$", desc: "point estimator" },
      { sym: "$\\hat p$", desc: "sample proportion" },
      { sym: "$S$", desc: "success count" },
      { sym: "$n$", desc: "trials" }
    ],
    derivation: [
      { do: "Define each Bernoulli observation.", result: "$X_i=1$ for success and $0$ otherwise", why: "the outcome is encoded as a success indicator" },
      { do: "Add the indicators.", result: "$S=\\sum_iX_i$", why: "the sum counts total successes" },
      { do: "Divide by the number of trials.", result: "$\\hat p=S/n$", why: "the sample proportion is successes per trial" },
      { do: "Use the Bernoulli mean.", result: "$E[\\hat p]=p$", why: "$E[X_i]=p$ and expectation is linear" },
      { do: "Use the Bernoulli variance.", result: "$\\operatorname{Var}(\\hat p)=p(1-p)/n$", why: "$\\operatorname{Var}(X_i)=p(1-p)$ and independent averaging divides variance by $n$" },
      { do: "Plug in the estimate for the unknown probability.", result: "$SE\\approx\\sqrt{\\hat p(1-\\hat p)/n}$", why: "the true $p$ is unknown in practice" }
    ],
    applications: [
      { title: "CTR", background: "A click-through probability can be estimated by observed clicks over impressions.", numbers: "$240/20{,}000=0.012$." },
      { title: "Demand mean", background: "A point estimate of mean demand is the sample average.", numbers: "$90,110,100$ averages to $100$." },
      { title: "Failure probability", background: "A failure probability can be estimated by the observed failure fraction.", numbers: "$3/500=0.006$." },
      { title: "Noise variance MLE", background: "A variance point estimate can average residual squares.", numbers: "residual squares $1,1,4,4$ average to $2.5$." },
      { title: "Average loss", background: "A training-loss point estimate is the batch average.", numbers: "$0.2,0.3,0.4$ averages to $0.3$." },
      { title: "Embedding coverage", background: "Coverage can be estimated by the covered fraction in a sample.", numbers: "$965/1000=0.965$." }
    ]
  },
  "math-18-06": {
    connectionsProse: "<p>This lesson begins the quality checks for estimators. Once a statistic is used to estimate a parameter, its long-run center matters as much as its observed value. Bias will later combine with variance to form MSE and to explain the bias–variance tradeoff.</p>",
    motivation: "<p>Bias is the long-run offset between where an estimator is centered and the parameter it is meant to estimate. It is not the error in one sample; a particular sample can be high or low for random reasons. Bias describes the average behavior over repeated samples from the same data-generating process.</p>" +
                "<p>An unbiased estimator is centered correctly, but that does not automatically make it best. It may still be highly variable. The contrast between $\\bar X$ and $\\bar X+3$ shows the basic calculation: changing the estimator by a constant shifts its expectation by the same amount.</p>",
    definition: "<p>The bias of an estimator is its long-run center minus the target parameter: $$\\operatorname{Bias}(\\hat\\theta)=E[\\hat\\theta]-\\theta.$$</p>" +
                "<p><b>Assumptions that matter:</b> Bias is evaluated over the estimator's sampling distribution under the same data-generating process.</p>",
    symbols: [
      { sym: "$E[\\hat\\theta]$", desc: "sampling-distribution center" },
      { sym: "$\\theta$", desc: "target" },
      { sym: "unbiased", desc: "means bias $0$" }
    ],
    derivation: [
      { do: "Start from the definition.", result: "$\\operatorname{Bias}(\\hat\\theta)=E[\\hat\\theta]-\\theta$", why: "bias measures long-run offset from the target" },
      { do: "Compute the sample mean's expectation.", result: "$E[\\bar X]=\\mu$", why: "linearity of expectation centers $\\bar X$ at $\\mu$" },
      { do: "Substitute into the bias formula.", result: "$E[\\bar X]-\\mu=0$", why: "$\\bar X$ is centered at the target" },
      { do: "Shift the estimator by a constant.", result: "$E[\\bar X+3]=\\mu+3$", why: "expectation shifts by the same constant" },
      { do: "Subtract the target.", result: "$(\\mu+3)-\\mu=3$", why: "$\\bar X+3$ has bias $3$" }
    ],
    applications: [
      { title: "Survey bias", background: "An expected survey estimate above the truth has positive bias.", numbers: "expected $0.51$ versus true $0.48$ gives $0.03$." },
      { title: "Easy validation set", background: "An easier validation set can overstate deployment accuracy.", numbers: "$0.92-0.87=0.05$." },
      { title: "Ridge shrinkage", background: "Shrinkage can pull estimates below the true coefficient.", numbers: "expected $8$ for true $10$ gives $-2$." },
      { title: "Variance denominator $n$", background: "Using $n$ instead of $n-1$ creates finite-sample downward bias for variance.", numbers: "expectation $0.9\\sigma^2$ at $n=10$ has bias $-0.1\\sigma^2$." },
      { title: "Sensor offset", background: "A sensor with a high long-run reading has positive bias.", numbers: "$101.5-100=1.5$." },
      { title: "Logged data bias", background: "Logged samples can overrepresent high-propensity cases.", numbers: "$0.08-0.05=0.03$." }
    ]
  },
  "math-18-07": {
    connectionsProse: "<p>This lesson pairs with bias as the second basic measure of estimator behavior. A centered estimator can still be unreliable if it changes a lot from sample to sample. Variance and standard error become the language used for intervals, tests, power, and efficiency.</p>",
    motivation: "<p>Estimator variance measures how much the estimate jitters from one sample to another, even when it is centered correctly. It is a property of the sampling distribution, not just the spread of the observed data. A low-variance estimator tends to give similar answers when the study is repeated under the same conditions.</p>" +
                "<p>Averages reduce variance because independent fluctuations partly cancel. The derivation for $\\bar X$ shows the two ingredients: scaling by $1/n$ contributes a squared factor, and independence lets the individual variances add. Taking the square root gives the standard error, the usual scale for estimator uncertainty.</p>",
    definition: "<p>The variance of an estimator is the squared spread of its sampling distribution: $$\\operatorname{Var}(\\hat\\theta)=E[(\\hat\\theta-E\\hat\\theta)^2].$$ For independent observations with variance $\\sigma^2$, $\\operatorname{Var}(\\bar X)=\\sigma^2/n$ and $SE=\\sigma/\\sqrt n$.</p>" +
                "<p><b>Assumptions that matter:</b> The sample-mean formula assumes independent observations with common variance $\\sigma^2$.</p>",
    symbols: [
      { sym: "variance", desc: "squared spread" },
      { sym: "SE", desc: "estimator SD" },
      { sym: "$n$", desc: "controls averaging" }
    ],
    derivation: [
      { do: "Define estimator variance.", result: "$\\operatorname{Var}(\\hat\\theta)=E[(\\hat\\theta-E\\hat\\theta)^2]$", why: "variance is squared spread around the estimator's own center" },
      { do: "Write the sample mean.", result: "$\\bar X=\\frac1n\\sum_iX_i$", why: "the averaging rule determines the variance" },
      { do: "Pull out the scaling factor.", result: "$\\operatorname{Var}(\\bar X)=\\frac1{n^2}\\operatorname{Var}(\\sum_iX_i)$", why: "variance scales by the square of constants" },
      { do: "Add independent variances.", result: "$\\operatorname{Var}(\\sum_iX_i)=n\\sigma^2$", why: "independence removes covariance terms" },
      { do: "Simplify the variance.", result: "$n\\sigma^2/n^2=\\sigma^2/n$", why: "averaging reduces variance by $n$" },
      { do: "Define the standard error.", result: "$SE=\\sigma/\\sqrt n$", why: "standard error is the square root of estimator variance" }
    ],
    applications: [
      { title: "Power planning", background: "Standard error shrinks with the square root of sample size.", numbers: "halving SE from $0.02$ to $0.01$ needs about four times $n$." },
      { title: "Leaderboard noise", background: "A gain smaller than one standard error is mostly noise-scale.", numbers: "gain $0.003$ with SE $0.006$ is $0.5$ SE." },
      { title: "Ensemble average", background: "Independent estimates can be averaged to reduce variance.", numbers: "four independent estimates with variance $0.04$ average to variance $0.01$." },
      { title: "Sensor fusion", background: "Averaging independent readings reduces measurement uncertainty.", numbers: "nine readings with SD $3$ give SE $1$." },
      { title: "Monte Carlo", background: "More simulation runs reduce Monte Carlo error.", numbers: "runs $10{,}000$ to $40{,}000$ halve SE." },
      { title: "Mini-batch gradient", background: "Batch averaging reduces gradient variance.", numbers: "variance $64/256=0.25$." }
    ]
  },
  "math-18-08": {
    connectionsProse: "<p>This lesson combines the two estimator-quality ideas just introduced. Bias describes systematic offset, and variance describes sampling spread. Mean squared error puts both into one squared-error criterion that is useful for comparing estimators.</p>",
    motivation: "<p>MSE combines systematic aiming error and random wobble into one squared-error measure. It asks how far the estimator is from the target on average after squaring the error. Squaring makes positive and negative errors contribute in the same direction and penalizes larger misses more strongly.</p>" +
                "<p>The decomposition is useful because it separates two reasons an estimator can perform poorly. An estimator may be centered at the wrong value, or it may be centered correctly but very noisy. Adding and subtracting the estimator's expectation shows that these contributions become variance plus squared bias.</p>",
    definition: "<p>Mean squared error is the expected squared distance from an estimator to its target: $$\\operatorname{MSE}(\\hat\\theta)=E[(\\hat\\theta-\\theta)^2]=\\operatorname{Var}(\\hat\\theta)+\\operatorname{Bias}(\\hat\\theta)^2.$$</p>" +
                "<p><b>Assumptions that matter:</b> The expectation is over the estimator's sampling distribution for the fixed target $\\theta$.</p>",
    symbols: [
      { sym: "MSE", desc: "average squared error" },
      { sym: "bias", desc: "long-run offset" },
      { sym: "variance", desc: "long-run spread" }
    ],
    derivation: [
      { do: "Start with the definition.", result: "$\\operatorname{MSE}(\\hat\\theta)=E[(\\hat\\theta-\\theta)^2]$", why: "MSE averages squared error from the target" },
      { do: "Add and subtract the estimator's expectation.", result: "$\\hat\\theta-\\theta=(\\hat\\theta-E\\hat\\theta)+(E\\hat\\theta-\\theta)$", why: "this separates random fluctuation from systematic offset" },
      { do: "Square the sum.", result: "$(\\hat\\theta-E\\hat\\theta)^2+2(\\hat\\theta-E\\hat\\theta)(E\\hat\\theta-\\theta)+(E\\hat\\theta-\\theta)^2$", why: "expanding exposes variance, cross term, and bias squared" },
      { do: "Take expectations term by term.", result: "$E[(\\hat\\theta-E\\hat\\theta)^2]+2(E\\hat\\theta-\\theta)E[\\hat\\theta-E\\hat\\theta]+(E\\hat\\theta-\\theta)^2$", why: "the bias term is constant with respect to repeated samples" },
      { do: "Drop the cross term.", result: "$E[\\hat\\theta-E\\hat\\theta]=0$", why: "centered fluctuations have mean zero" },
      { do: "Recognize the pieces.", result: "$\\operatorname{MSE}=\\operatorname{Var}(\\hat\\theta)+\\operatorname{Bias}(\\hat\\theta)^2$", why: "MSE combines sampling spread and squared long-run offset" }
    ],
    applications: [
      { title: "Model selection", background: "MSE combines variance and squared bias for comparison.", numbers: "variance $0.10$ plus bias squared $0.04$ gives MSE $0.14$." },
      { title: "Ridge tradeoff", background: "A little bias can be worthwhile if variance falls enough.", numbers: "variance $9$ to $4$ with bias $1$ lowers MSE from $9$ to $5$." },
      { title: "Forecast errors", background: "Forecast MSE averages squared misses.", numbers: "$2,-1,3$ give MSE $14/3$." },
      { title: "Image pixels", background: "Pixel errors can be summarized by mean squared error.", numbers: "errors $5,-3,1$ give MSE $35/3$." },
      { title: "Estimator choice", background: "Bias and variance together determine MSE.", numbers: "variance $1$ and bias $0.5$ gives MSE $1.25$." },
      { title: "Smoothing", background: "A smoother can be chosen by lower MSE.", numbers: "raw MSE $0.020$ versus smoothed $0.015$ favors smoothing." }
    ]
  },
  "math-18-09": {
    connectionsProse: "<p>This lesson shifts from finite-sample quality to what happens as data accumulate. Bias, variance, and MSE describe estimator behavior at a given sample size. Consistency asks whether the estimator eventually concentrates near the true parameter.</p>",
    motivation: "<p>Consistency says that more data eventually concentrates the estimator near the true parameter. It does not require every finite sample to be accurate, and it does not say that small samples are safe. It says that, for any fixed tolerance, the probability of missing the target by more than that tolerance goes to zero.</p>" +
                "<p>One clean route to consistency uses MSE. If the average squared error tends to zero, then large errors must become unlikely. Markov's inequality turns that statement into a probability bound, and the sample mean fits the pattern because its variance shrinks like $\\sigma^2/n$.</p>",
    definition: "<p>An estimator sequence is consistent when it converges in probability to the target: $$P(|\\hat\\theta_n-\\theta|>\\epsilon)\\to0.$$ A sufficient condition is $\\operatorname{MSE}(\\hat\\theta_n)\\to0$.</p>" +
                "<p><b>Assumptions that matter:</b> The tolerance $\\epsilon$ is fixed, and the MSE route uses Markov's inequality on squared error.</p>",
    symbols: [
      { sym: "$\\xrightarrow p$", desc: "convergence in probability" },
      { sym: "$\\epsilon$", desc: "fixed tolerance" },
      { sym: "MSE", desc: "sufficient condition" }
    ],
    derivation: [
      { do: "Define consistency.", result: "$P(|\\hat\\theta_n-\\theta|>\\epsilon)\\to0$", why: "large misses should become unlikely for every fixed tolerance" },
      { do: "Apply Markov to squared error.", result: "$P((\\hat\\theta_n-\\theta)^2>\\epsilon^2)\\le E[(\\hat\\theta_n-\\theta)^2]/\\epsilon^2$", why: "squared error is nonnegative" },
      { do: "Rewrite the event.", result: "$P(|\\hat\\theta_n-\\theta|>\\epsilon)\\le \\operatorname{MSE}(\\hat\\theta_n)/\\epsilon^2$", why: "absolute error above $\\epsilon$ is the same as squared error above $\\epsilon^2$" },
      { do: "Use the MSE condition.", result: "$\\operatorname{MSE}(\\hat\\theta_n)\\to0$ implies the bound tends to $0$", why: "$\\epsilon^2$ is fixed and positive" },
      { do: "Check the sample mean.", result: "$\\operatorname{MSE}(\\bar X)=\\sigma^2/n\\to0$", why: "an unbiased sample mean has variance shrinking to zero" }
    ],
    applications: [
      { title: "Feature mean", background: "A larger sample concentrates the feature mean.", numbers: "variance $25$, $n=2500$ gives SE $0.1$." },
      { title: "Polling", background: "Polling standard error shrinks with sample size.", numbers: "$p=0.5,n=10{,}000$ gives SE $0.005$." },
      { title: "Monte Carlo", background: "A simulation average becomes precise with many runs.", numbers: "variance $1,n=1{,}000{,}000$ gives SE $0.001$." },
      { title: "Rates", background: "Increasing observations reduces rate-estimate uncertainty.", numbers: "$p=0.1,n=100$ gives SE $0.03$, while $n=10{,}000$ gives $0.003$." },
      { title: "Accuracy", background: "Quadrupling sample size halves standard error.", numbers: "$p=0.8$, $n=400$ to $1600$ lowers SE from $0.02$ to $0.01$." },
      { title: "Running mean", background: "A running mean's MSE can be made small by large $n$.", numbers: "variance $100/n$ gives MSE $0.01$ at $n=10{,}000$." }
    ]
  },
  "math-18-10": {
    connectionsProse: "<p>This lesson compares estimators that aim at the same target. Bias and variance describe one estimator at a time; efficiency asks which unbiased estimator uses the data more precisely. The idea connects directly to Fisher information and the Cramér-Rao lower bound.</p>",
    motivation: "<p>Efficiency compares how much precision two estimators extract from the same data under the same target and model. The comparison is meaningful only when the estimators are being judged under the same assumptions. For unbiased estimators, lower variance means tighter concentration around the parameter.</p>" +
                "<p>Relative efficiency turns that comparison into a variance ratio. If one estimator has variance $6/n$ and another has variance $10/n$, the first reaches the same precision with fewer observations. Later, the Cramér-Rao bound gives a theoretical floor for how efficient unbiased estimation can be.</p>",
    definition: "<p>For unbiased estimators of the same target, relative efficiency compares variances: $$\\operatorname{Eff}(T_1,T_2)=\\frac{\\operatorname{Var}(T_2)}{\\operatorname{Var}(T_1)}.$$</p>" +
                "<p><b>Assumptions that matter:</b> The estimators must target the same $\\theta$ under the same model, and the simple variance comparison is framed for unbiased estimators.</p>",
    symbols: [
      { sym: "$T_1,T_2$", desc: "competing estimators" },
      { sym: "relative efficiency", desc: "variance ratio" },
      { sym: "CRLB", desc: "lower variance benchmark" }
    ],
    derivation: [
      { do: "Restrict the comparison.", result: "$T_1$ and $T_2$ are unbiased estimators of the same $\\theta$", why: "variance comparisons should not mix different targets or bias assumptions" },
      { do: "Write their variances.", result: "$\\operatorname{Var}(T_1)$ and $\\operatorname{Var}(T_2)$", why: "precision is measured by sampling variance" },
      { do: "Define relative efficiency.", result: "$\\operatorname{Var}(T_2)/\\operatorname{Var}(T_1)$", why: "the ratio says how much variance $T_2$ has relative to $T_1$" },
      { do: "Compute the example ratio.", result: "$(10/n)/(6/n)=10/6=1.667$", why: "the common $1/n$ factor cancels" },
      { do: "Interpret the result.", result: "$T_1$ is more efficient", why: "$T_1$ has lower variance and therefore needs fewer observations for the same precision" }
    ],
    applications: [
      { title: "Estimator choice", background: "Lower variance reaches a target precision with fewer observations.", numbers: "variance $4/n$ reaches $0.04$ at $n=100$; $8/n$ needs $200$." },
      { title: "Experiment duration", background: "Variance improvements reduce standard errors.", numbers: "variance $0.0004$ to $0.0003$ changes SE $0.020$ to $0.0173$." },
      { title: "Control variates", background: "A variance-reduction method improves simulation efficiency.", numbers: "variance $1$ to $0.25$ halves SE." },
      { title: "Known-variance normal mean", background: "The sample mean is the natural efficient estimator under the normal known-variance model.", numbers: "$\\bar X$ variance is $\\sigma^2/n$." },
      { title: "Monitoring", background: "A smaller standard error makes the same shift easier to detect.", numbers: "shift $0.015$ is $3$ SEs at SE $0.005$ and $1.5$ SEs at $0.010$." },
      { title: "Gradient variance", background: "Reducing the variance constant improves gradient estimates at the same batch size.", numbers: "$100/b$ at $b=100$ is $1$; reducing the constant to $25$ gives $0.25$." }
    ]
  },
  "math-18-11": {
    connectionsProse: "<p>This lesson introduces a constructive way to build estimators from model summaries. Earlier lessons define moments such as means and variances; method of moments uses them as equations. It is often a simple first estimator and a useful starting point for likelihood-based fitting.</p>",
    motivation: "<p>Method of moments estimates parameters by making model moments equal the moments seen in the sample. If a model says its mean, variance, or higher moment depends on unknown parameters, the sample versions of those moments provide matching equations. Solving those equations gives parameter estimates.</p>" +
                "<p>The method is direct because it uses summaries that are often easy to compute. It may not use all information as efficiently as MLE, but it is transparent and widely useful for initialization and calibration. For an exponential distribution, the mean alone identifies the rate, so one moment gives one equation for one parameter.</p>",
    definition: "<p>The method of moments sets sample moments equal to model moments and solves for parameters. For $X\\sim\\operatorname{Exponential}(\\lambda)$, $$E[X]=\\frac1\\lambda,\\qquad \\hat\\lambda_{MM}=\\frac1{\\bar X}.$$</p>" +
                "<p><b>Assumptions that matter:</b> The chosen model moment must identify the parameter, and the sample moment is used as its empirical counterpart.</p>",
    symbols: [
      { sym: "$E[X^k]$", desc: "population raw moment" },
      { sym: "$n^{-1}\\sum_iX_i^k$", desc: "sample moment" },
      { sym: "$r$", desc: "number of parameters/equations" }
    ],
    derivation: [
      { do: "Use the exponential mean formula.", result: "$E[X]=1/\\lambda$", why: "the model moment links the parameter to an observable mean" },
      { do: "Compute the sample moment.", result: "$\\bar X$", why: "the sample mean estimates the population mean" },
      { do: "Set sample and model moments equal.", result: "$\\bar X=1/\\lambda$", why: "method of moments matches empirical and theoretical moments" },
      { do: "Solve for the rate.", result: "$\\hat\\lambda_{MM}=1/\\bar X$", why: "multiplying by $\\lambda$ and dividing by $\\bar X$ isolates $\\lambda$" },
      { do: "Compute the example mean.", result: "$\\bar x=(2+3+5)/3=10/3$", why: "the data supply the sample moment" },
      { do: "Plug into the estimator.", result: "$\\hat\\lambda=1/(10/3)=0.3$", why: "the matched moment determines the rate estimate" }
    ],
    applications: [
      { title: "Exponential fit", background: "A mean waiting time identifies an exponential rate.", numbers: "sample mean $4$ gives rate $0.25$." },
      { title: "Poisson initialization", background: "A Poisson mean equals its rate parameter.", numbers: "sample mean $7.2$ gives $\\lambda=7.2$." },
      { title: "Queueing", background: "Mean interarrival time converts to arrival rate.", numbers: "mean interarrival $0.5$ sec gives rate $2$ per sec." },
      { title: "Word indicator", background: "A binary word indicator has mean equal to occurrence probability.", numbers: "$120/1000=0.12$." },
      { title: "Simulator calibration", background: "A model mean equation can calibrate a simulation parameter.", numbers: "model mean $2\\theta$ and observed mean $10$ gives $\\theta=5$." },
      { title: "Noise second moment", background: "A second moment can estimate variance when mean zero is assumed.", numbers: "residual squares $45$ over $15$ cases gives variance $3$." }
    ]
  },
  "math-18-12": {
    connectionsProse: "<p>This lesson builds on probability models, samples, and point estimation. Earlier lessons describe an estimator as a rule computed from data. Maximum likelihood adds a disciplined way to choose that rule: write down the probability of the observed data under each possible parameter value, then choose the parameter that makes the observations most plausible.</p><p>This idea connects directly to machine learning. Bernoulli likelihood leads to logistic regression and cross-entropy. Gaussian likelihood leads to least squares. Poisson and exponential likelihoods fit counts and waiting times. Later lessons use the same likelihood curve to define Fisher information, asymptotic standard errors, likelihood-ratio tests, and MAP estimation.</p>",
    motivation: "<p>A parameter value is not judged by whether it could have produced the data; many values usually could. MLE asks for the value under which the observed sample is most likely. For Bernoulli data with 7 successes in 10 trials, a parameter near $p=0.7$ should fit better than $p=0.2$, because the data contain many successes.</p>" +
                "<p>The likelihood is the probability of the observed data, but read as a function of the parameter. That shift is the central move. The data are fixed after observation; the parameter is the variable being compared. Logs are used because they turn products into sums and keep the same maximizer.</p>",
    definition: "<p>Maximum likelihood estimation chooses the parameter that maximizes the likelihood, or equivalently the log-likelihood: $$\\mathcal L(\\theta)=\\prod_{i=1}^n f(x_i\\mid\\theta),\\qquad \\ell(\\theta)=\\log \\mathcal L(\\theta),\\qquad \\hat\\theta_{MLE}=\\arg\\max_\\theta \\ell(\\theta).$$</p>" +
                "<p><b>Assumptions that matter:</b> The displayed likelihood multiplies independent observation probabilities or densities under the model.</p>",
    symbols: [
      { sym: "$x_i$", desc: "observed data point" },
      { sym: "$f(x_i\\mid\\theta)$", desc: "model probability or density at that observation" },
      { sym: "$\\theta$", desc: "unknown parameter" },
      { sym: "$\\mathcal L$", desc: "likelihood" },
      { sym: "$\\ell$", desc: "log-likelihood" },
      { sym: "$\\hat\\theta_{MLE}$", desc: "maximizing estimate" },
      { sym: "$s$", desc: "number of successes" },
      { sym: "$p$", desc: "Bernoulli success probability" }
    ],
    derivation: [
      { do: "Write the Bernoulli likelihood for $s$ successes and $n-s$ failures.", result: "$\\mathcal L(p)=p^s(1-p)^{n-s}$", why: "independent probabilities multiply" },
      { do: "Take logs.", result: "$\\ell(p)=s\\log p+(n-s)\\log(1-p)$", why: "logs preserve the maximizer and simplify powers" },
      { do: "Differentiate one term at a time.", result: "$\\ell'(p)=s/p-(n-s)/(1-p)$", why: "$d\\log(1-p)/dp=-1/(1-p)$" },
      { do: "Set the score to zero.", result: "$s/p=(n-s)/(1-p)$", why: "an interior maximum has zero first derivative" },
      { do: "Cross-multiply.", result: "$s(1-p)=(n-s)p$", why: "this removes denominators" },
      { do: "Expand and collect.", result: "$s-sp=np-sp$, so $s=np$", why: "the $-sp$ terms cancel" },
      { do: "Divide by $n$.", result: "$\\hat p=s/n$", why: "this isolates the MLE" },
      { do: "Check the example and curvature.", result: "for $s=7,n=10$, $\\hat p=7/10=0.7$; $-s/p^2-(n-s)/(1-p)^2<0$", why: "the second derivative confirms a maximum" }
    ],
    applications: [
      { title: "Logistic regression", background: "Logistic regression uses Bernoulli likelihood.", numbers: "labels with predicted probabilities $0.8$ and $0.6$ have negative log-likelihood $-\\log0.8-\\log0.6\\approx0.734$." },
      { title: "Naive Bayes word probabilities", background: "Naive Bayes uses count MLEs for word probabilities.", numbers: "$30$ word occurrences in $1000$ class tokens gives $\\hat p=0.03$." },
      { title: "Poisson traffic modeling", background: "Poisson rate MLE is the sample mean.", numbers: "counts $4,5,6$ give $5$." },
      { title: "Gaussian residual variance", background: "Gaussian residual variance has MLE $RSS/n$.", numbers: "$RSS=20,n=10$ gives $2$." },
      { title: "Language modeling", background: "Language modeling maximizes token likelihood.", numbers: "probabilities $0.1,0.2$ give log-likelihood $\\log0.1+\\log0.2\\approx-3.912$." },
      { title: "Exponential waiting times", background: "Exponential waiting times give rate MLE $1/\\bar x$.", numbers: "mean wait $8$ minutes gives $0.125$ per minute." }
    ]
  },
  "math-18-13": {
    connectionsProse: "<p>This lesson extends maximum likelihood from exact optimization to large-sample behavior. The likelihood still chooses the parameter estimate, but now the shape of the likelihood near the truth explains uncertainty. This prepares for Fisher information, Wald intervals, and likelihood-ratio testing.</p>",
    motivation: "<p>MLE can be hard in small samples, but regular large samples make the estimator approximately normal with variance set by information. The estimate is found by solving a score equation, and the score can be approximated near the true parameter by a linear expansion.</p>" +
                "<p>The intuition is that the random score supplies the numerator of the error, while likelihood curvature supplies the denominator. More curvature means the likelihood is sharper, so the same score fluctuation produces a smaller parameter error. Under regular conditions, this leads to an approximate normal distribution centered at the true value.</p>",
    definition: "<p>Under regular large-sample conditions, an MLE is approximately normal with variance set by Fisher information: $$\\hat\\theta\\approx N\\left(\\theta_0,\\frac{1}{nI(\\theta_0)}\\right).$$</p>" +
                "<p><b>Assumptions that matter:</b> The approximation uses regularity, an interior true value, differentiability, and large independent samples.</p>",
    symbols: [
      { sym: "$I(\\theta_0)$", desc: "one-observation Fisher information" },
      { sym: "$\\ell_n$", desc: "log-likelihood for $n$ observations" },
      { sym: "$\\xrightarrow d$", desc: "convergence in distribution" }
    ],
    derivation: [
      { do: "Use the score equation.", result: "$0=\\ell_n'(\\hat\\theta)$", why: "the MLE is found at a stationary point" },
      { do: "Expand around the true value.", result: "$0\\approx\\ell_n'(\\theta_0)+(\\hat\\theta-\\theta_0)\\ell_n''(\\theta_0)$", why: "a first-order Taylor approximation links the MLE to the score at the truth" },
      { do: "Solve for the estimation error.", result: "$\\hat\\theta-\\theta_0\\approx-\\ell_n'(\\theta_0)/\\ell_n''(\\theta_0)$", why: "curvature converts score fluctuation into parameter error" },
      { do: "Use the score fluctuation scale.", result: "$\\ell_n'(\\theta_0)$ fluctuates like $N(0,nI(\\theta_0))$", why: "scores add across independent observations" },
      { do: "Use the curvature scale.", result: "$\\ell_n''(\\theta_0)\\approx -nI(\\theta_0)$", why: "expected negative curvature accumulates information" },
      { do: "Divide fluctuation by curvature.", result: "$\\hat\\theta\\approx N(\\theta_0,1/(nI(\\theta_0)))$", why: "larger information gives smaller asymptotic variance" }
    ],
    applications: [
      { title: "Wald interval", background: "Asymptotic normality supports estimate plus or minus standard errors.", numbers: "$1.2\\pm2(0.3)=[0.6,1.8]$." },
      { title: "Coefficient table", background: "A coefficient divided by its standard error gives a large-sample z statistic.", numbers: "$0.8/0.2=4$." },
      { title: "Treatment effect", background: "An estimated effect can be expressed in standard-error units.", numbers: "$0.015/0.005=3$." },
      { title: "Calibration slope", background: "A normal approximation gives a rough interval for a slope.", numbers: "$0.90\\pm2(0.04)=[0.82,0.98]$." },
      { title: "Sample planning", background: "The asymptotic standard error target determines sample size.", numbers: "$1/\\sqrt{2n}=0.05$ gives $n=200$." },
      { title: "Boundary warning", background: "Boundary MLEs can make normal approximation unreliable.", numbers: "$0$ successes in $10$ trials gives $\\hat p=0$, so normal approximation is suspect." }
    ]
  },
  "math-18-14": {
    connectionsProse: "<p>This lesson follows naturally from likelihood and MLE asymptotics. The likelihood's slope gives the score, and its curvature determines how sharply parameters are distinguished. Fisher information turns that curvature into a reusable measure of statistical precision.</p>",
    motivation: "<p>Fisher information measures likelihood curvature, so it tells how sharply data separate nearby parameter values. When the log-likelihood is flat, many parameter values explain the data almost equally well. When it is sharply curved, small parameter changes create clear likelihood changes.</p>" +
                "<p>Information also sets the scale of estimator uncertainty. For independent observations, information adds across observations, so standard errors shrink as total information grows. The identity between score variance and expected negative curvature explains why both fluctuation and curvature describe the same precision.</p>",
    definition: "<p>For score $S(\\theta)=\\partial_\\theta\\log f(X\\mid\\theta)$, Fisher information can be written as $$I(\\theta)=E[S(\\theta)^2]=-E[\\partial_\\theta^2\\log f(X\\mid\\theta)].$$</p>" +
                "<p><b>Assumptions that matter:</b> The identity uses regularity that permits differentiating under the integral and gives $E[S]=0$.</p>",
    symbols: [
      { sym: "$S$", desc: "score" },
      { sym: "$I$", desc: "Fisher information" },
      { sym: "observed information", desc: "negative curvature at observed data" }
    ],
    derivation: [
      { do: "Define the score.", result: "$S(\\theta)=\\partial_\\theta\\log f(X\\mid\\theta)$", why: "the score is the likelihood slope" },
      { do: "Show the score has mean zero under regularity.", result: "$E[S]=\\int \\partial_\\theta f(x\\mid\\theta)dx=\\partial_\\theta1=0$", why: "density integrates to one for every parameter value" },
      { do: "Differentiate $E[S]=0$.", result: "$E[\\partial_\\theta S]+E[S^2]=0$", why: "differentiating the score expectation brings in both curvature and score square" },
      { do: "Rearrange the identity.", result: "$E[S^2]=-E[\\partial_\\theta^2\\log f(X\\mid\\theta)]$", why: "$\\partial_\\theta S$ is log-likelihood second derivative" },
      { do: "Name the common quantity.", result: "$I(\\theta)=E[S^2]=-E[\\partial_\\theta^2\\log f(X\\mid\\theta)]$", why: "score variance and expected negative curvature measure the same information" },
      { do: "Add independent observations.", result: "$I_n=nI$", why: "independent scores add, so information adds" }
    ],
    applications: [
      { title: "Curvature SE", background: "Observed negative curvature gives information and an approximate SE.", numbers: "observed curvature $-25$ gives information $25$ and SE $0.2$." },
      { title: "Design", background: "Information accumulates across users.", numbers: "info per user $0.02$ times $10{,}000$ gives total $200$, SE $0.071$." },
      { title: "Bernoulli info", background: "Bernoulli information depends on the success probability.", numbers: "$p=0.5$ gives $1/[p(1-p)]=4$." },
      { title: "Logistic variance term", background: "Logistic observations have less curvature near probabilities close to one.", numbers: "$p(1-p)$ is $0.25$ at $0.5$ and $0.0099$ at $0.99$." },
      { title: "Normal mean", background: "Smaller noise variance gives more information about a normal mean.", numbers: "noise variance $4$ gives information $0.25$; variance $1$ gives $1$." },
      { title: "Laplace spread", background: "A quadratic approximation turns curvature into spread.", numbers: "curvature $64$ gives SD $0.125$." }
    ]
  },
  "math-18-15": {
    connectionsProse: "<p>This lesson connects likelihood-based estimation with Bayesian updating. MLE uses the likelihood alone, while MAP combines the likelihood with a prior distribution over parameters. The result is still a point estimate, but one shaped by both data and prior information.</p>",
    motivation: "<p>MAP chooses the parameter value that is most plausible after combining the likelihood with a prior. The likelihood measures how well each parameter explains the observed data, and the prior assigns plausibility before seeing those data. Multiplying them gives the posterior shape up to a normalizing constant.</p>" +
                "<p>The MAP estimate is the posterior mode. In the Bernoulli-Beta case, the prior behaves like extra pseudo-counts that smooth the estimate. This makes MAP especially useful when data are sparse, although the answer depends on the chosen prior.</p>",
    definition: "<p>Maximum a posteriori estimation chooses the posterior mode. With Bernoulli data and a Beta$(\\alpha,\\beta)$ prior, $$\\hat p_{MAP}=\\frac{\\alpha+s-1}{\\alpha+\\beta+s+f-2}$$ when the mode is interior.</p>" +
                "<p><b>Assumptions that matter:</b> The formula assumes Bernoulli observations, a Beta prior, and an interior posterior mode.</p>",
    symbols: [
      { sym: "Prior $p(\\theta)$", desc: "distribution expressing parameter plausibility before data" },
      { sym: "posterior $p(\\theta\\mid x)$", desc: "distribution after combining prior and likelihood" },
      { sym: "mode", desc: "maximizing parameter value" },
      { sym: "pseudo-counts", desc: "prior shapes acting like extra successes and failures" }
    ],
    derivation: [
      { do: "Write the Bernoulli likelihood.", result: "$p^s(1-p)^f$", why: "$s$ successes and $f$ failures contribute powers of $p$ and $1-p$" },
      { do: "Write the Beta prior density up to proportionality.", result: "$p^{\\alpha-1}(1-p)^{\\beta-1}$", why: "normalizing constants do not affect the mode" },
      { do: "Multiply likelihood and prior.", result: "$p^{\\alpha+s-1}(1-p)^{\\beta+f-1}$", why: "posterior is proportional to likelihood times prior" },
      { do: "Take logs and differentiate.", result: "$(\\alpha+s-1)/p-(\\beta+f-1)/(1-p)$", why: "the posterior mode solves a score equation" },
      { do: "Set the derivative to zero.", result: "$(\\alpha+s-1)/p=(\\beta+f-1)/(1-p)$", why: "an interior mode is stationary" },
      { do: "Solve for the MAP.", result: "$(\\alpha+s-1)/(\\alpha+\\beta+s+f-2)$", why: "cross-multiplication isolates $p$" },
      { do: "Compute the example.", result: "with $s=8,f=2,\\alpha=2,\\beta=2$, $\\hat p_{MAP}=9/12=0.75$", why: "the prior adds smoothing pseudo-counts" }
    ],
    applications: [
      { title: "Ridge MAP", background: "A Gaussian prior corresponds to a squared penalty.", numbers: "penalty $\\lambda w^2/2$ with $\\lambda=4$ adds curvature $4$." },
      { title: "L1 MAP", background: "A Laplace prior corresponds to an absolute-value penalty.", numbers: "loss $10$ plus $0.5|3|$ gives $11.5$." },
      { title: "CTR smoothing", background: "A Beta prior smooths sparse click data.", numbers: "Beta$(2,2)$ plus $1$ click, $0$ failures gives MAP $2/3$." },
      { title: "Cold start", background: "A prior can act like historical pseudo-counts.", numbers: "prior count $20$ at mean $0.10$ acts like $2$ successes and $18$ failures." },
      { title: "Add-one smoothing", background: "Add-one smoothing prevents zero word probabilities.", numbers: "count $0$, vocabulary $1000$, tokens $10{,}000$ gives $1/11{,}000$." },
      { title: "Weight prior", background: "A quadratic weight prior adds a penalty to the objective.", numbers: "$5(0.4^2)/2=0.4$." }
    ]
  },
  "math-18-16": {
    connectionsProse: "<p>This lesson studies how data can be compressed without losing information about a parameter under a model. Earlier lessons use sample summaries as estimators; sufficiency asks when a summary contains all parameter-relevant information. The concept supports exponential families, Rao-Blackwell improvement, and efficient inference.</p>",
    motivation: "<p>A sufficient statistic keeps all sample information about a parameter under the assumed model, while discarding arrangement details that no longer matter. For Bernoulli data with a common success probability, the number of successes matters for $p$, but the order in which successes occurred does not.</p>" +
                "<p>The factorization theorem makes this precise. If the joint probability can be written so that all parameter dependence passes through a statistic, then that statistic is sufficient. This is a model-based statement: change the model, and what counts as sufficient may change.</p>",
    definition: "<p>A statistic is sufficient when the joint density or mass factors so that all parameter dependence passes through that statistic: $$f_\\theta(x)=g_\\theta(T(x))h(x).$$ For Bernoulli data, $T(x)=\\sum_i x_i$ is sufficient for $p$.</p>" +
                "<p><b>Assumptions that matter:</b> Sufficiency is defined relative to a chosen statistical model.</p>",
    symbols: [
      { sym: "$T(X)$", desc: "statistic" },
      { sym: "$f_\\theta(x)$", desc: "joint density/mass" },
      { sym: "$g_\\theta$", desc: "parameter-dependent factor" },
      { sym: "$h$", desc: "parameter-free factor" }
    ],
    derivation: [
      { do: "Write the Bernoulli joint mass.", result: "$p^{\\sum x_i}(1-p)^{n-\\sum x_i}$", why: "independent Bernoulli probabilities multiply" },
      { do: "Define the statistic.", result: "$T(x)=\\sum_i x_i$", why: "the total number of successes collects the data's $p$-relevant count" },
      { do: "Rewrite the joint mass through $T$.", result: "$p^{T(x)}(1-p)^{n-T(x)}\\cdot1$", why: "all $p$ dependence is now in a function of $T$" },
      { do: "Match the factorization form.", result: "$g_p(T(x))h(x)$", why: "$g_p$ contains parameter dependence and $h$ does not" },
      { do: "Apply the factorization theorem.", result: "$T$ is sufficient", why: "all parameter dependence passes through $T$" },
      { do: "Interpret sequences with equal counts.", result: "their likelihood ratios are free of $p$", why: "order no longer carries additional information about the common Bernoulli parameter" }
    ],
    applications: [
      { title: "Clicks", background: "For constant click probability, the success count summarizes Bernoulli likelihood.", numbers: "$63$ clicks in $1000$ impressions gives likelihood $p^{63}(1-p)^{937}$." },
      { title: "Failures", background: "A sufficient failure count directly gives the MLE.", numbers: "$8/500=0.016$ MLE from sufficient count." },
      { title: "Poisson totals", background: "For independent Poisson counts, the total is sufficient for the rate.", numbers: "counts $3,4,2,6$ total $15$, so $\\hat\\lambda=3.75$." },
      { title: "Normal known variance", background: "With known variance, the sample mean summarizes information about the mean.", numbers: "readings $10.1,9.9,10.0,10.2$ have mean $10.05$." },
      { title: "Rao-Blackwell", background: "Conditioning on a sufficient statistic can reduce variance.", numbers: "variance $0.040$ to $0.025$ is a $37.5\\%$ reduction." },
      { title: "Aggregation", background: "Binary responses can be aggregated when the model has a common probability.", numbers: "$118$ yes responses among $200$ binary responses summarize constant-$p$ inference." }
    ]
  },
  "math-18-17": {
    connectionsProse: "<p>This lesson reveals a shared form behind many distributions already used in inference. Bernoulli, Poisson, normal, and related GLM models can be written with a statistic, a natural parameter, and a log-normalizer. That structure connects sufficiency, likelihood, moments, and generalized linear models.</p>",
    motivation: "<p>Exponential-family form reveals the shared structure behind Bernoulli, Poisson, normal, and many GLM likelihoods. Instead of treating each distribution as unrelated, the form identifies a statistic that carries information and a natural parameter that controls the model.</p>" +
                "<p>The log-normalizer keeps probabilities or densities properly scaled, but it also carries moment information. Its derivatives produce means and variances in many common cases. Rewriting Bernoulli in natural-parameter form shows how the logit parameter appears naturally from the likelihood.</p>",
    definition: "<p>An exponential-family model writes a distribution using a statistic, natural parameter, base measure, and log-normalizer. For Bernoulli, $$f_\\eta(x)=\\exp\\{\\eta x-A(\\eta)\\},\\qquad A(\\eta)=\\log(1+e^\\eta).$$</p>" +
                "<p><b>Assumptions that matter:</b> The Bernoulli derivation uses $x\\in\\{0,1\\}$ and $0<p<1$ so the logit natural parameter is defined.</p>",
    symbols: [
      { sym: "$T(x)$", desc: "sufficient statistic" },
      { sym: "$\\eta$", desc: "natural parameter" },
      { sym: "$A(\\eta)$", desc: "log-normalizer" },
      { sym: "$h(x)$", desc: "base measure" }
    ],
    derivation: [
      { do: "Start with the Bernoulli mass.", result: "$p^x(1-p)^{1-x}$", why: "this is the probability of a binary outcome" },
      { do: "Rewrite it as an exponential.", result: "$\\exp[x\\log p+(1-x)\\log(1-p)]$", why: "exponential-family form is log-linear in statistics" },
      { do: "Collect terms involving $x$.", result: "$\\exp[x\\log(p/(1-p))+\\log(1-p)]$", why: "this separates the data statistic from the normalizing term" },
      { do: "Define the natural parameter.", result: "$\\eta=\\log(p/(1-p))$", why: "the coefficient of $x$ is the natural parameter" },
      { do: "Solve for $p$.", result: "$p=e^\\eta/(1+e^\\eta)$", why: "this expresses probability in terms of the natural parameter" },
      { do: "Rewrite the remaining term.", result: "$\\log(1-p)=-\\log(1+e^\\eta)$", why: "the log-normalizer ensures probabilities sum to one" },
      { do: "State the exponential-family form.", result: "$f_\\eta(x)=\\exp\\{\\eta x-A(\\eta)\\}$ with $A(\\eta)=\\log(1+e^\\eta)$", why: "Bernoulli now matches the canonical exponential-family template" }
    ],
    applications: [
      { title: "Bernoulli GLM", background: "A Bernoulli probability corresponds to a logit natural parameter.", numbers: "$p=0.8$ gives natural parameter $\\log4=1.386$." },
      { title: "Poisson GLM", background: "A Poisson rate corresponds to a log natural parameter.", numbers: "$\\lambda=5$ gives $\\eta=\\log5=1.609$." },
      { title: "Moment from normalizer", background: "Differentiating the log-normalizer gives the mean in the Bernoulli family.", numbers: "Bernoulli with $\\eta=0$ gives $A'(0)=0.5$." },
      { title: "Variance from curvature", background: "The second derivative of the log-normalizer gives variance.", numbers: "Bernoulli at $p=0.5$ gives $A''=0.25$." },
      { title: "Sufficient counts", background: "The Bernoulli exponential family uses the success count as sufficient statistic.", numbers: "$63$ successes summarize $1000$ Bernoulli trials." },
      { title: "Softmax family", background: "Categorical exponential-family logits normalize through exponentials.", numbers: "logits $(0,1)$ normalize to probability $e/(1+e)=0.731$ for class 2." }
    ]
  },
  "math-18-18": {
    connectionsProse: "<p>This lesson uses Fisher information to state a precision limit. Efficiency compared estimators against each other; the Cramér-Rao bound compares unbiased estimators against a model-implied lower bound. It explains when an estimator is as precise as the regular model allows.</p>",
    motivation: "<p>The Cramér-Rao bound gives a best-possible variance floor for unbiased estimators under a regular model. If the data contain limited information about a parameter, no unbiased estimator can have variance below the reciprocal of total information.</p>" +
                "<p>The proof links estimation to the score. An unbiased estimator must move with the parameter at the right rate, and the score measures how the likelihood moves with the parameter. Cauchy-Schwarz turns that relationship into a variance lower bound.</p>",
    definition: "<p>For an unbiased estimator $T$ under regular conditions, the Cramér-Rao lower bound is $$\\operatorname{Var}(T)\\ge\\frac{1}{I_n(\\theta)}.$$</p>" +
                "<p><b>Assumptions that matter:</b> The bound uses an unbiased estimator, regular differentiability conditions, and total Fisher information $I_n(\\theta)$.</p>",
    symbols: [
      { sym: "$T$", desc: "unbiased estimator" },
      { sym: "$S$", desc: "score" },
      { sym: "$I_n$", desc: "total Fisher information" },
      { sym: "CRLB", desc: "lower bound" }
    ],
    derivation: [
      { do: "Let the score be the derivative of log likelihood.", result: "$S=\\partial_\\theta\\log L(\\theta;X)$", why: "the score measures likelihood sensitivity" },
      { do: "Use regularity of the score.", result: "$E[S]=0$", why: "regular models have mean-zero score" },
      { do: "Use unbiasedness of the estimator.", result: "$E[T]=\\theta$", why: "$T$ targets the parameter without bias" },
      { do: "Differentiate $E[T]$ with respect to $\\theta$.", result: "$1=E[TS]$", why: "the derivative of an expectation under the model introduces the score" },
      { do: "Convert to covariance.", result: "$\\operatorname{Cov}(T,S)=1$", why: "$E[S]=0$" },
      { do: "Apply Cauchy-Schwarz.", result: "$1^2\\le\\operatorname{Var}(T)\\operatorname{Var}(S)$", why: "squared covariance is bounded by the product of variances" },
      { do: "Recognize score variance.", result: "$\\operatorname{Var}(S)=I_n(\\theta)$", why: "Fisher information is score variance" },
      { do: "Rearrange the inequality.", result: "$\\operatorname{Var}(T)\\ge1/I_n(\\theta)$", why: "this isolates the variance floor" }
    ],
    applications: [
      { title: "Normal mean", background: "Known-variance normal samples have a variance floor for unbiased mean estimation.", numbers: "known $\\sigma^2=9,n=25$ gives CRLB $9/25=0.36$." },
      { title: "Bernoulli rate", background: "The Bernoulli sample proportion attains the usual variance scale.", numbers: "$p=0.5,n=100$ gives CRLB $0.25/100=0.0025$." },
      { title: "Sensor design", background: "Total information sets a minimum unbiased standard error.", numbers: "total information $400$ gives minimum unbiased SE $0.05$." },
      { title: "Efficiency check", background: "An estimator meeting the bound is efficient under the model.", numbers: "estimator variance $0.36$ meets the normal bound above." },
      { title: "Sample planning", background: "A target SE determines required information and sample size.", numbers: "to get SE $0.02$ with per-sample information $1$, need $n=2500$." },
      { title: "Information gain", background: "More information lowers the minimum possible variance.", numbers: "doubling total information from $100$ to $200$ lowers bound from $0.01$ to $0.005$." }
    ]
  },
  "math-18-19": {
    connectionsProse: "<p>This lesson turns point estimates and standard errors into uncertainty statements. Sampling distributions describe how estimates vary; confidence intervals use that variation to build random endpoints. The idea is central for reporting statistical estimates without pretending a single number is exact.</p>",
    motivation: "<p>A confidence interval is built by a procedure that captures the fixed parameter at a chosen long-run rate. The parameter is not random in the frequentist setup; the interval endpoints are random because they depend on the sample.</p>" +
                "<p>The common normal-form interval comes from a pivot. If the standardized estimation error is approximately standard normal, central normal probability can be rearranged to isolate the unknown parameter. The result is an estimate plus and minus a critical value times the standard error.</p>",
    definition: "<p>A confidence interval is a random interval procedure with a chosen long-run coverage rate. From an approximate normal pivot, $$\\theta\\in \\hat\\theta\\pm z_{1-\\alpha/2}SE$$ with approximate coverage $1-\\alpha$.</p>" +
                "<p><b>Assumptions that matter:</b> The normal-form interval assumes an approximately standard normal pivot and a suitable standard error.</p>",
    symbols: [
      { sym: "$\\alpha$", desc: "miss rate" },
      { sym: "$z_{1-\\alpha/2}$", desc: "normal critical value" },
      { sym: "$L,U$", desc: "random endpoints" },
      { sym: "coverage", desc: "long-run inclusion rate" }
    ],
    derivation: [
      { do: "Start with an approximate pivot.", result: "$Z=(\\hat\\theta-\\theta)/SE\\approx N(0,1)$", why: "standardization puts estimation error on a common scale" },
      { do: "Use central normal probability.", result: "$P(-z_{1-\\alpha/2}\\le Z\\le z_{1-\\alpha/2})\\approx1-\\alpha$", why: "the middle normal mass determines the desired coverage" },
      { do: "Substitute the pivot.", result: "$P(-z_{1-\\alpha/2}\\le(\\hat\\theta-\\theta)/SE\\le z_{1-\\alpha/2})\\approx1-\\alpha$", why: "the pivot contains the unknown parameter" },
      { do: "Multiply by $SE$.", result: "$-z_{1-\\alpha/2}SE\\le\\hat\\theta-\\theta\\le z_{1-\\alpha/2}SE$", why: "$SE$ is positive, so inequalities do not reverse" },
      { do: "Rearrange to isolate $\\theta$.", result: "$\\hat\\theta-z_{1-\\alpha/2}SE\\le\\theta\\le\\hat\\theta+z_{1-\\alpha/2}SE$", why: "the random endpoints are expressed around the estimate" },
      { do: "Write the interval compactly.", result: "$\\hat\\theta\\pm z_{1-\\alpha/2}SE$", why: "this is the usual normal-form confidence interval" }
    ],
    applications: [
      { title: "Known-variance mean", background: "A known standard deviation gives a normal mean interval.", numbers: "$52\\pm1.96(10/10)=[50.04,53.96]$." },
      { title: "Accuracy", background: "A model accuracy estimate can be reported with uncertainty.", numbers: "$0.84\\pm1.96(0.02)=[0.801,0.879]$." },
      { title: "CTR", background: "A click-through estimate has a confidence interval around the observed rate.", numbers: "$0.012\\pm1.96(0.001)=[0.0100,0.0140]$." },
      { title: "Lift", background: "An experiment lift estimate is reported with its standard error.", numbers: "$0.006\\pm1.96(0.002)=[0.0021,0.0099]$." },
      { title: "Latency", background: "A latency mean interval expresses uncertainty in milliseconds.", numbers: "$100\\pm1.96(1)=[98.04,101.96]$ ms." },
      { title: "Calibration slope", background: "A calibration slope can be accompanied by a normal-form interval.", numbers: "$0.90\\pm1.96(0.04)=[0.822,0.978]$." }
    ]
  },
  "math-18-20": {
    connectionsProse: "<p>This lesson uses sampling distributions to assess evidence against a baseline claim. Confidence intervals report a range of plausible parameter values; hypothesis tests ask whether the observed statistic is unusual under a specified null model. The same standard errors and null distributions support both ideas.</p>",
    motivation: "<p>Hypothesis testing compares an observed statistic with the distribution it would have if a baseline claim were true. The null hypothesis supplies the reference distribution, and the statistic measures how far the data are from that reference.</p>" +
                "<p>Standardization puts the distance on a common scale of standard errors. A p-value is then a null tail probability for a result at least as extreme as the one observed. The rejection rule controls the long-run false alarm rate when the null is true.</p>",
    definition: "<p>A hypothesis test compares data to a null model. A common standardized statistic is $$z=\\frac{\\hat\\theta-\\theta_0}{SE},$$ with a two-sided p-value $2P(Z\\ge |z|)$ under the null reference distribution.</p>" +
                "<p><b>Assumptions that matter:</b> The null distribution or approximation for the test statistic must be valid under $H_0$.</p>",
    symbols: [
      { sym: "$H_0$", desc: "null" },
      { sym: "$H_1$", desc: "alternative" },
      { sym: "p-value", desc: "null tail probability" },
      { sym: "$\\alpha$", desc: "rejection threshold" }
    ],
    derivation: [
      { do: "State the hypotheses.", result: "$H_0:\\theta=\\theta_0$ and an alternative", why: "the null supplies the reference claim" },
      { do: "Choose a statistic with known or approximated null distribution.", result: "$\\hat\\theta$ with standard error $SE$", why: "evidence is assessed relative to its null variability" },
      { do: "Standardize the observed distance.", result: "$z=(\\hat\\theta-\\theta_0)/SE$", why: "this measures distance in null standard errors" },
      { do: "Convert to a two-sided p-value.", result: "$2P(Z\\ge |z|)$", why: "two-sided tests count extremeness in both directions" },
      { do: "Apply the rejection rule.", result: "reject at level $\\alpha$ if $p\\le\\alpha$", why: "this controls the long-run false alarm rate under the null" },
      { do: "Compute the mean-test example.", result: "for $\\bar x=104,\\sigma=15,n=100,\\mu_0=100$, $z=4/1.5=2.667$", why: "the standard error is $15/\\sqrt{100}=1.5$" }
    ],
    applications: [
      { title: "Mean test", background: "The worked z statistic corresponds to a small two-sided null tail probability.", numbers: "$z=2.667$ gives two-sided p about $0.0077$." },
      { title: "Experiment lift", background: "A lift three standard errors from zero is strong evidence under a normal approximation.", numbers: "$0.009/0.003=3$ gives strong evidence." },
      { title: "Non-inferiority", background: "A non-inferiority test compares an estimate to a negative margin.", numbers: "margin $-0.01$, estimate $0.002$, SE $0.004$ gives $z=3$." },
      { title: "Monitoring", background: "A monitored metric can be tested against a baseline value.", numbers: "current $42.8$ versus $40.0$ with SE $0.7$ gives $z=4$." },
      { title: "Fairness gap", background: "A standardized gap measures evidence against no gap.", numbers: "$0.036/0.012=3$." },
      { title: "A/A guardrail", background: "A tiny estimate relative to SE is not unusual under the null.", numbers: "estimate $0.001$ with SE $0.003$ gives $z=0.333$, not unusual." }
    ]
  },
  "math-18-21": {
    connectionsProse: "<p>This lesson names the two ways a test can be wrong. Hypothesis testing sets a rejection rule; error rates describe how that rule behaves under the null and under alternatives. These ideas lead directly to power, sample-size planning, and tradeoffs in decision thresholds.</p>",
    motivation: "<p>Type I and Type II errors name the two possible mistakes: false alarm and missed detection. A Type I error rejects a true null, while a Type II error fails to reject when a specified alternative is true. The two probabilities are evaluated under different worlds.</p>" +
                "<p>Tightening a cutoff lowers the false alarm rate, but it also makes detection harder at a fixed sample size. More data can improve the tradeoff because it shrinks standard errors and separates the null distribution from the alternative distribution. Power is the complement of the Type II error rate.</p>",
    definition: "<p>Type I error is rejecting a true null, and Type II error is failing to reject under a chosen alternative: $$\\alpha=P(\\text{reject }H_0\\mid H_0\\text{ true}),\\qquad \\beta(\\theta_1)=P(\\text{fail to reject }H_0\\mid\\theta_1\\text{ true}).$$ Power is $1-\\beta$.</p>" +
                "<p><b>Assumptions that matter:</b> $\\alpha$ is evaluated under the null world, while $\\beta$ and power are evaluated under a specified alternative.</p>",
    symbols: [
      { sym: "$\\alpha$", desc: "false positive rate" },
      { sym: "$\\beta$", desc: "false negative rate at a chosen alternative" },
      { sym: "power", desc: "detection probability" }
    ],
    derivation: [
      { do: "Define the Type I error rate.", result: "$\\alpha=P(\\text{reject }H_0\\mid H_0\\text{ true})$", why: "this is the false alarm probability" },
      { do: "Define the Type II error rate at an alternative.", result: "$\\beta(\\theta_1)=P(\\text{fail to reject }H_0\\mid\\theta_1\\text{ true})$", why: "this is the missed detection probability for a specified non-null world" },
      { do: "Define power.", result: "$1-\\beta$", why: "detection is the complement of missing the effect" },
      { do: "Move the cutoff farther into the tail.", result: "$\\alpha$ decreases", why: "fewer null samples cross a stricter rejection threshold" },
      { do: "Assess the same move under a real alternative.", result: "$\\beta$ rises at fixed $n$", why: "a stricter cutoff also makes rejection harder when the effect is real" },
      { do: "Increase sample size.", result: "SE shrinks and null and alternative distributions separate", why: "more data can improve both detection and reliability" }
    ],
    applications: [
      { title: "Multiple nulls", background: "Many true-null tests produce expected false positives at rate $\\alpha$.", numbers: "$1000$ true-null tests at $\\alpha=0.05$ give $50$ expected false positives." },
      { title: "Power", background: "Power is one minus the Type II error rate.", numbers: "$\\beta=0.20$ gives power $0.80$." },
      { title: "Spam filter analogy", background: "False positives block legitimate emails.", numbers: "false-positive rate $0.01$ among $10{,}000$ real emails blocks $100$." },
      { title: "Fraud detection", background: "False negatives miss real fraud cases.", numbers: "false negative rate $0.15$ among $200$ fraud cases misses $30$." },
      { title: "Medical screening", background: "Sensitivity is detection probability, so its complement is missed detection.", numbers: "sensitivity $0.95$ means $\\beta=0.05$." },
      { title: "Experiment cutoff", background: "A stricter significance level reduces false alarms under true nulls.", numbers: "lowering $\\alpha$ from $0.05$ to $0.01$ reduces false alarms fivefold under true nulls." }
    ]
  },
  "math-18-22": {
    connectionsProse: "<p>This lesson continues from Type II error. Once an alternative effect size is chosen, power measures how often the test detects it. It is the main bridge from hypothesis testing to sample-size and experiment planning.</p>",
    motivation: "<p>Power is the probability that a test rejects the null when a specified alternative is true. It depends on the effect size, noise level, sample size, test direction, and significance cutoff. A test can be valid at its chosen alpha while still having low power for small effects.</p>" +
                "<p>For a one-sided mean test, the rejection cutoff is set under the null. To compute power, the same cutoff is viewed under the alternative distribution. If the alternative mean is many standard errors beyond the cutoff, rejection is likely; if it is close, rejection is uncertain.</p>",
    definition: "<p>Power is the probability of rejection under a specified alternative. For a one-sided known-variance mean test, $$\\text{Power}=1-\\Phi\\left(z_{1-\\alpha}-\\frac{\\mu_1-\\mu_0}{\\sigma/\\sqrt n}\\right).$$</p>" +
                "<p><b>Assumptions that matter:</b> This formula assumes a one-sided known-variance normal mean setup and a specified alternative mean $\\mu_1$.</p>",
    symbols: [
      { sym: "$\\mu_0$", desc: "null mean" },
      { sym: "$\\mu_1$", desc: "alternative" },
      { sym: "effect size $\\mu_1-\\mu_0$", desc: "distance between alternative and null means" },
      { sym: "$\\Phi$", desc: "standard normal CDF" }
    ],
    derivation: [
      { do: "Set the one-sided rejection rule.", result: "$\\bar X>\\mu_0+z_{1-\\alpha}\\sigma/\\sqrt n$", why: "the cutoff is chosen under the null" },
      { do: "Standardize that cutoff under the alternative mean.", result: "$(\\mu_0+z_{1-\\alpha}\\sigma/\\sqrt n-\\mu_1)/(\\sigma/\\sqrt n)$", why: "power is evaluated when $\\mu_1$ is true" },
      { do: "Write the power probability.", result: "$P_{\\mu_1}(\\bar X>\\text{cutoff})=1-\\Phi(z_{1-\\alpha}-(\\mu_1-\\mu_0)/(\\sigma/\\sqrt n))$", why: "the normal tail above the cutoff is the rejection probability" },
      { do: "Compute the standard error in the example.", result: "with $\\sigma=4,n=64$, SE is $0.5$", why: "$4/\\sqrt{64}=0.5$" },
      { do: "Compute the signal in SE units.", result: "$(\\mu_1-\\mu_0)/SE=1.5/0.5=3$", why: "the alternative is three standard errors above the null" },
      { do: "Evaluate power at $\\alpha=0.05$.", result: "$1-\\Phi(1.645-3)=\\Phi(1.355)=0.912$", why: "the alternative distribution lies well beyond the null cutoff" }
    ],
    applications: [
      { title: "Launch experiment", background: "A one-sided test can have high power when the effect is several SEs above zero.", numbers: "effect $1.5$, SE $0.5$ gives power $0.912$ at one-sided $5\\%$." },
      { title: "Smaller effect", background: "Smaller effects are harder to detect at the same sample size.", numbers: "effect $1.0$ with same SE gives $1-\\Phi(-0.355)=0.639$." },
      { title: "Larger sample", background: "Reducing SE increases signal in standard-error units.", numbers: "halving SE from $0.5$ to $0.25$ changes signal from $3$ to $6$ SEs." },
      { title: "Noisy metric", background: "More noise lowers power by increasing SE.", numbers: "doubling $\\sigma$ from $4$ to $8$ halves signal from $3$ to $1.5$." },
      { title: "Higher alpha", background: "A less strict cutoff increases power but raises false alarm rate.", numbers: "using $z_{0.90}=1.282$ gives $\\Phi(1.718)=0.957$ for the same effect." },
      { title: "Planning", background: "A target signal-to-SE ratio determines the SE goal.", numbers: "target signal $3$ for effect $0.03$ requires SE $0.01$." }
    ]
  },
  "math-18-23": {
    connectionsProse: "<p>This lesson specializes hypothesis testing for means. The z-test uses a known or externally justified standard deviation, while the t-test accounts for estimating that standard deviation from the same sample. Both tests express the observed mean difference in standard-error units.</p>",
    motivation: "<p>A z-test standardizes with known or externally justified noise; a t-test standardizes with sample-estimated noise and pays for that estimate with heavier tails. The distinction matters most when samples are small and uncertainty in the sample standard deviation is substantial.</p>" +
                "<p>Both tests compare a sample mean to a null mean. The numerator is the observed offset, and the denominator is the estimated standard error of the mean. Replacing $\\sigma$ with $s$ introduces extra variability, which is reflected by the $t$ distribution and its degrees of freedom.</p>",
    definition: "<p>For a mean test with known standard deviation, $$z=\\frac{\\bar X-\\mu_0}{\\sigma/\\sqrt n}.$$ When $\\sigma$ is unknown and estimated by $s$, $$t=\\frac{\\bar X-\\mu_0}{s/\\sqrt n}$$ with $n-1$ degrees of freedom under normal sampling.</p>" +
                "<p><b>Assumptions that matter:</b> The z-test uses known or externally justified $\\sigma$; the exact t reference assumes normal sampling with $\\sigma$ estimated from the same sample.</p>",
    symbols: [
      { sym: "$s$", desc: "sample SD" },
      { sym: "df", desc: "degrees of freedom" },
      { sym: "$\\mu_0$", desc: "null mean" },
      { sym: "z/t statistic", desc: "standardized distance" }
    ],
    derivation: [
      { do: "Use known standard deviation for the mean.", result: "$SE=\\sigma/\\sqrt n$", why: "known noise gives the sampling scale directly" },
      { do: "Form the z statistic.", result: "$z=(\\bar X-\\mu_0)/(\\sigma/\\sqrt n)$", why: "this measures the offset in known standard-error units" },
      { do: "Estimate unknown standard deviation by $s$.", result: "$SE=s/\\sqrt n$", why: "the sample must supply the noise scale" },
      { do: "Form the t statistic.", result: "$t=(\\bar X-\\mu_0)/(s/\\sqrt n)$", why: "the denominator now includes estimation uncertainty" },
      { do: "Use the t reference distribution.", result: "$t_{n-1}$", why: "under normal sampling, the sample variance costs one degree of freedom" },
      { do: "Compute the example.", result: "for $n=16,\\bar x=10.5,s=2,\\mu_0=9.5$, $t=1/(2/4)=2$ with $15$ df", why: "$\\sqrt{16}=4$ and $n-1=15$" }
    ],
    applications: [
      { title: "Known-SD manufacturing", background: "Known process variation supports a z-test.", numbers: "$\\bar x=51,\\mu_0=50,\\sigma=4,n=64$ gives $z=2$." },
      { title: "Small-sample latency", background: "The worked example uses a t statistic with estimated SD.", numbers: "$t=2$ at $15$ df from the worked example." },
      { title: "Paired test", background: "A paired test applies a one-sample t-test to differences.", numbers: "differences mean $3$, SD $6$, $n=36$ gives $t=3$." },
      { title: "Model metric", background: "An estimated SE gives a t-like standardized metric gain.", numbers: "gain $0.004$ with estimated SE $0.002$ gives $t=2$." },
      { title: "Sensor calibration", background: "A mean offset can be tested using sample SD.", numbers: "mean offset $0.5$, $s=1$, $n=25$ gives $t=2.5$." },
      { title: "Large-sample z", background: "A z statistic is appropriate only with a justified normal approximation.", numbers: "estimate $0.12$, SE $0.03$ gives $z=4$ only when the normal approximation is justified." }
    ]
  },
  "math-18-24": {
    connectionsProse: "<p>This lesson introduces two common test families built from squared discrepancies and variance ratios. Chi-square tests are natural for counts across categories, while F tests are natural for comparing mean squares. Both rely on reference distributions determined by degrees of freedom.</p>",
    motivation: "<p>Chi-square tests add squared count discrepancies; F tests compare variance-like quantities by ratio. In a chi-square statistic, each observed-minus-expected difference is squared and scaled by its expected count, so cells are compared on a common relative scale.</p>" +
                "<p>F statistics arise when two independent variance estimates or mean squares are compared. A large ratio indicates that between-group variation is large relative to within-group variation, or that one variance estimate is much larger than another. The calculations are simple, but the reference distribution depends on the design and degrees of freedom.</p>",
    definition: "<p>A chi-square statistic sums scaled squared count discrepancies, and an F statistic compares mean squares: $$\\chi^2=\\sum_i\\frac{(O_i-E_i)^2}{E_i},\\qquad F=\\frac{MS_B}{MS_W}.$$</p>" +
                "<p><b>Assumptions that matter:</b> The reference distributions depend on the sampling design, independence conditions, expected counts, and degrees of freedom.</p>",
    symbols: [
      { sym: "$O_i$", desc: "observed counts" },
      { sym: "$E_i$", desc: "expected counts" },
      { sym: "$MS$", desc: "mean square" },
      { sym: "df", desc: "degrees of freedom" }
    ],
    derivation: [
      { do: "Compute count residuals for categories.", result: "$O_i-E_i$", why: "the test compares observed counts to null-expected counts" },
      { do: "Scale each squared residual.", result: "$(O_i-E_i)^2/E_i$", why: "large expected cells should not dominate unfairly" },
      { do: "Sum the scaled discrepancies.", result: "$\\chi^2=\\sum_i(O_i-E_i)^2/E_i$", why: "the statistic aggregates evidence across categories" },
      { do: "Set expected counts for the die example.", result: "$E_i=10$", why: "a fair die rolled $60$ times expects $10$ per face" },
      { do: "Compute contributions.", result: "counts $8,12,9,11,10,10$ give contributions $0.4,0.4,0.1,0.1,0,0$, sum $1.0$", why: "each contribution is squared residual divided by $10$" },
      { do: "Form an F statistic by dividing mean squares.", result: "$MS_B=18,MS_W=3$ gives $F=6$", why: "F tests compare variance-like quantities by ratio" }
    ],
    applications: [
      { title: "Die fairness", background: "The die example sums scaled count discrepancies.", numbers: "$\\chi^2=1.0$." },
      { title: "A/B segment counts", background: "A two-cell count balance can be checked with chi-square contributions.", numbers: "observed $55,45$ versus expected $50,50$ gives $\\chi^2=1.0$." },
      { title: "Independence table", background: "A single contingency-table cell contributes squared discrepancy over expected count.", numbers: "a cell $O=30,E=24$ contributes $36/24=1.5$." },
      { title: "ANOVA", background: "ANOVA compares between and within mean squares.", numbers: "between $18$ and within $3$ gives $F=6$." },
      { title: "Variance ratio", background: "An F statistic can compare two variance estimates.", numbers: "sample variances $12$ and $4$ give $F=3$." },
      { title: "Feature drift bins", background: "Binned feature drift can be summarized by chi-square discrepancy.", numbers: "observed $90,110,100$ versus $100$ each gives $\\chi^2=2$." }
    ]
  },
  "math-18-25": {
    connectionsProse: "<p>This lesson returns to likelihood as a tool for testing. Instead of testing with a single standardized estimate, the likelihood-ratio test compares how well a restricted model and a larger model fit the same data. It is a central method for nested model comparison.</p>",
    motivation: "<p>The likelihood-ratio test compares the best null explanation with the best explanation allowed by a larger model. The unrestricted model can always fit at least as well, so the question is whether its improvement is large relative to what regular sampling variation would allow.</p>" +
                "<p>Taking $-2$ times the log likelihood ratio puts the comparison on a scale with a large-sample chi-square reference under regular conditions. The degrees of freedom count the number of additional free parameters. Boundary cases and nonstandard models require extra care because the simple chi-square reference may fail.</p>",
    definition: "<p>The likelihood-ratio test compares maximized likelihoods under restricted and unrestricted models: $$\\Lambda=\\frac{L_0}{L_1},\\qquad -2\\log\\Lambda=2(\\ell_1-\\ell_0).$$</p>" +
                "<p><b>Assumptions that matter:</b> The usual chi-square reference is a regular large-sample result for nested models; boundary and nonstandard cases need extra care.</p>",
    symbols: [
      { sym: "$L_0,L_1$", desc: "maximized likelihoods" },
      { sym: "$\\Lambda$", desc: "likelihood ratio" },
      { sym: "df", desc: "added parameters" },
      { sym: "$\\ell$", desc: "log-likelihood" }
    ],
    derivation: [
      { do: "Fit the restricted null model.", result: "$L_0$", why: "the null gives the best likelihood under the restrictions" },
      { do: "Fit the unrestricted model.", result: "$L_1\\ge L_0$", why: "the larger model can fit at least as well" },
      { do: "Form the likelihood ratio.", result: "$\\Lambda=L_0/L_1$", why: "the ratio measures how much likelihood the null loses" },
      { do: "Move to the log-likelihood scale.", result: "$-2\\log\\Lambda=2(\\ell_1-\\ell_0)$", why: "larger values mean the null loses more likelihood" },
      { do: "Use the regular large-sample reference.", result: "$\\chi^2$ with df equal to added parameters", why: "nested regular models have Wilks-type chi-square behavior" },
      { do: "Compute the Bernoulli example.", result: "for $8$ successes in $10$ trials, testing $p=0.5$ against free $p$ gives $2[8\\log(0.8/0.5)+2\\log(0.2/0.5)]=3.855$", why: "the unrestricted MLE is $0.8$" }
    ],
    applications: [
      { title: "Bernoulli rate", background: "The worked likelihood-ratio statistic compares fixed $p=0.5$ to free $p$.", numbers: "worked statistic $3.855$." },
      { title: "Logistic feature", background: "Adding a feature can be tested by log-likelihood improvement.", numbers: "null log-likelihood $-120$, full $-114$ gives LRT $12$." },
      { title: "Nested Poisson model", background: "A nested Poisson model comparison uses twice the log-likelihood gain.", numbers: "log-likelihood gain $2.5$ gives statistic $5$." },
      { title: "Mixture caution", background: "Mixture components can create boundary or nonstandard behavior.", numbers: "boundary parameters break the simple chi-square reference." },
      { title: "A/B model", background: "Adding one treatment coefficient gives a one-parameter likelihood-ratio statistic.", numbers: "adding one treatment coefficient with gain $4$ gives statistic $8$." },
      { title: "Calibration model", background: "Adding a slope can be tested through likelihood gain.", numbers: "gain $1.2$ gives statistic $2.4$ for one added slope." }
    ]
  },
  "math-18-26": {
    connectionsProse: "<p>This lesson broadens inference beyond fully specified parametric families. Previous lessons often assume a distribution with a small number of parameters; nonparametric methods reduce that commitment. They connect naturally to ranks, empirical distributions, smoothing, resampling, and robust summaries.</p>",
    motivation: "<p>Nonparametric methods reduce reliance on a fully specified distribution by using ranks, empirical distributions, local smoothers, or resampling. The word does not mean that there are no assumptions. It means the method does not begin by choosing one fixed finite-parameter family such as normal, Bernoulli, or Poisson.</p>" +
                "<p>The procedures are often built directly from the observed ordering or empirical distribution. A rank calculation replaces raw values with order positions, while an empirical CDF estimates cumulative probability by the fraction of sample points at or below a threshold. These tools are useful when shape assumptions are questionable or when medians and quantiles are more stable than means.</p>",
    definition: "<p>Nonparametric methods avoid committing to one fixed finite-parameter distribution family; common tools include ranks, empirical CDFs, smoothing, and resampling. For an empirical CDF, $$\\hat F_n(x)=\\frac{1}{n}\\sum_{i=1}^n \\mathbf 1\\{X_i\\le x\\}.$$</p>" +
                "<p><b>Assumptions that matter:</b> Distribution-free means fewer shape assumptions, not no assumptions; sampling, independence, ranking, or smoothing assumptions still matter.</p>",
    symbols: [
      { sym: "$\\hat F_n(x)$", desc: "empirical CDF" },
      { sym: "rank $R_i$", desc: "order position" },
      { sym: "bandwidth $h$", desc: "local-smoothing width" },
      { sym: "distribution-free", desc: "means fewer shape assumptions, not no assumptions" }
    ],
    applications: [
      { title: "Empirical CDF", background: "An empirical CDF counts the fraction of sample values at or below a threshold.", numbers: "data $2,5,7,9$ gives $\\hat F(6)=2/4=0.5$." },
      { title: "Median", background: "The median is a rank-based robust center.", numbers: "sorted $3,4,8,10,20$ gives median $8$." },
      { title: "Sign test", background: "A sign test uses signs of differences rather than normality of raw differences.", numbers: "$7$ positive differences out of $10$ uses binomial tail, not normality." },
      { title: "Mann-Whitney ranks", background: "Rank sums can be converted into a U statistic.", numbers: "rank sum $30$ for $n_1=5$ gives $U=30-15=15$." },
      { title: "Kernel smoother", background: "A local smoother averages nearby points within a bandwidth.", numbers: "with bandwidth $2$, points within $\\pm2$ of $10$ are averaged locally." },
      { title: "Quantile interval", background: "Order statistics locate empirical quantiles.", numbers: "25th and 75th percentiles from $8$ sorted points are order positions near $2$ and $6$." }
    ]
  },
  "math-18-27": {
    connectionsProse: "<p>This lesson provides a simulation-based route to standard errors and intervals. Earlier lessons derive sampling variation from a probability model; the bootstrap estimates it by resampling the observed dataset. It is especially useful when analytic standard errors are difficult to derive.</p>",
    motivation: "<p>The bootstrap estimates sampling variation by repeatedly resampling from the observed data and recomputing the statistic. The empirical distribution is used as a stand-in for the unknown population, so each observed value receives equal chance of being drawn.</p>" +
                "<p>Sampling with replacement is essential because it mimics new samples of the same size while staying within the observed empirical distribution. The spread of the bootstrap statistics approximates the spread the original statistic would have across repeated samples. This can estimate standard errors, percentile intervals, and uncertainty for statistics such as medians.</p>",
    definition: "<p>The bootstrap treats the empirical distribution as a stand-in population, resamples with replacement, and recomputes a statistic. The bootstrap standard error is the sample SD of bootstrap statistics $T^*$.</p>" +
                "<p><b>Assumptions that matter:</b> Bootstrap resamples are drawn with replacement from the observed data, and the empirical distribution must be a reasonable stand-in for the population.</p>",
    symbols: [
      { sym: "$T$", desc: "original statistic" },
      { sym: "$T^*$", desc: "bootstrap statistic" },
      { sym: "$B$", desc: "number of resamples" },
      { sym: "empirical distribution", desc: "assigns equal mass to observations" }
    ],
    derivation: [
      { do: "Treat the empirical distribution as the population stand-in.", result: "mass $1/n$ on each observed value", why: "the unknown population is replaced by the observed empirical distribution" },
      { do: "Draw bootstrap samples.", result: "samples of size $n$ with replacement", why: "replacement mimics new samples while staying within the observed data values" },
      { do: "Compute the statistic on each resample.", result: "$T^*$", why: "recomputing the same rule gives bootstrap versions of the estimator" },
      { do: "Use the spread of bootstrap statistics.", result: "spread of $T^*$ values", why: "this approximates the sampling spread of $T$" },
      { do: "Estimate bootstrap SE.", result: "sample SD of bootstrap statistics", why: "standard error is the standard deviation of the statistic's sampling distribution" },
      { do: "Compute the example.", result: "for bootstrap means $10.0,11.0,9.5,10.5,10.2$, the bootstrap SE is $0.559$", why: "their sample standard deviation estimates the statistic's sampling spread" }
    ],
    applications: [
      { title: "Mean SE", background: "Bootstrap means estimate the standard error of the original mean.", numbers: "bootstrap means above give SE $0.559$." },
      { title: "Accuracy interval", background: "Percentiles of bootstrap accuracies can form an interval.", numbers: "bootstrap 2.5th and 97.5th percentiles $0.81,0.87$ give interval $[0.81,0.87]$." },
      { title: "Median uncertainty", background: "Bootstrap resampling can assess uncertainty for medians.", numbers: "resampled medians $4,5,5,6,7$ have SD about $1.14$." },
      { title: "A/B lift", background: "A bootstrap lift standard error gives signal in SE units.", numbers: "bootstrap lift SD $0.003$ makes lift $0.009$ equal $3$ SEs." },
      { title: "Small data caution", background: "Small bootstrap resamples often repeat observed values.", numbers: "$n=5$ resamples contain duplicates because sampling is with replacement." },
      { title: "Model evaluation", background: "Percentile indices from many resamples give a bootstrap percentile interval.", numbers: "$B=1000$ resamples and percentile indices $25,975$ give a 95% percentile interval." }
    ]
  },
  "math-18-28": {
    connectionsProse: "<p>This lesson connects statistical estimation to a core predictive model. Linear regression treats the response as approximately linear in chosen features and estimates coefficients from data. The normal equations also connect regression to optimization, projections, and Gaussian likelihood.</p>",
    motivation: "<p>Linear regression chooses coefficients so the fitted line or plane minimizes squared residuals. Each residual is the difference between the model's fitted value and the observed response. Squaring residuals makes positive and negative misses combine and gives a differentiable objective.</p>" +
                "<p>In matrix form, all fitted values are collected as $X\\beta$. Minimizing the squared norm of $X\\beta-y$ leads to a gradient equation. When $X^TX$ is invertible, that equation has a closed-form solution for the least-squares coefficients.</p>",
    definition: "<p>Linear regression estimates coefficients by minimizing squared residuals. With design matrix $X$ and response $y$, $$\\hat\\beta=(X^TX)^{-1}X^Ty$$ when $X^TX$ is invertible.</p>" +
                "<p><b>Assumptions that matter:</b> The closed form requires an invertible $X^TX$; inferential interpretations require additional modeling assumptions about errors.</p>",
    symbols: [
      { sym: "$X$", desc: "design matrix" },
      { sym: "$y$", desc: "response vector" },
      { sym: "$\\beta$", desc: "coefficient vector" },
      { sym: "residual $r$", desc: "difference between fitted and observed response" },
      { sym: "normal equations", desc: "the equations $X^TX\\hat\\beta=X^Ty$" }
    ],
    derivation: [
      { do: "Write the residual vector.", result: "$r=X\\beta-y$", why: "residuals measure fitted values minus observed responses" },
      { do: "Write the least-squares objective.", result: "$S(\\beta)=\\|X\\beta-y\\|^2=r^Tr$", why: "squared residuals combine positive and negative errors" },
      { do: "Differentiate the objective.", result: "$\\nabla_\\beta S=2X^T(X\\beta-y)$", why: "the gradient shows how the objective changes with coefficients" },
      { do: "Set the gradient to zero.", result: "$X^T(X\\hat\\beta-y)=0$", why: "a least-squares minimum is stationary" },
      { do: "Rearrange the normal equations.", result: "$X^TX\\hat\\beta=X^Ty$", why: "this isolates coefficient terms on one side" },
      { do: "Solve when invertible.", result: "$\\hat\\beta=(X^TX)^{-1}X^Ty$", why: "invertibility allows multiplication by the inverse" },
      { do: "Compute the example.", result: "for points $(0,1),(1,2),(2,2)$ with intercept, $\\hat\\beta=(1.167,0.5)$", why: "the normal equations give the fitted intercept and slope" }
    ],
    applications: [
      { title: "Trend line", background: "The worked data produce a fitted intercept and slope.", numbers: "worked data give intercept $1.167$ and slope $0.5$." },
      { title: "Prediction", background: "A fitted line predicts by plugging in a new feature value.", numbers: "at $x=3$, prediction is $1.167+0.5(3)=2.667$." },
      { title: "Residual", background: "A residual is observed response minus fitted value.", numbers: "for $x=1,y=2$, residual is $2-(1.667)=0.333$." },
      { title: "RSS", background: "Residual sum of squares adds squared residuals.", numbers: "residuals about $-0.167,0.333,-0.167$ give RSS $0.167$." },
      { title: "Ridge contrast", background: "Ridge regression modifies the normal equations by adding a penalty term.", numbers: "adding $\\lambda I$ changes equations to $(X^TX+\\lambda I)\\beta=X^Ty$." },
      { title: "Feature scaling", background: "Changing the scale of a feature changes the scale of its coefficient.", numbers: "doubling one feature doubles its column in $X$ and changes the coefficient scale." }
    ]
  },
  "math-18-29": {
    connectionsProse: "<p>This lesson brings estimator bias and variance into prediction. Earlier lessons decomposed MSE for parameter estimates; here the same idea explains prediction error for learned functions. It is one of the main ways to reason about underfitting, overfitting, regularization, and ensembling.</p>",
    motivation: "<p>Prediction error can come from a model being too rigid, too sensitive to samples, or from irreducible noise in the data. A rigid model may miss the true signal on average, creating bias. A flexible model may react strongly to the particular training sample, creating variance.</p>" +
                "<p>The decomposition fixes an input and averages over possible training samples and noise. Adding and subtracting the average learned predictor separates squared bias, estimator variance, and noise variance. Regularization, model choice, and ensembling often work by changing the balance between these terms.</p>",
    definition: "<p>For fixed input $x$, prediction error decomposes into squared bias, variance, and irreducible noise: $$E[(\\hat f(x)-Y)^2]=\\operatorname{Bias}(\\hat f(x))^2+\\operatorname{Var}(\\hat f(x))+\\sigma^2.$$</p>" +
                "<p><b>Assumptions that matter:</b> The decomposition fixes $x$, averages over training samples and noise, and uses $Y=f(x)+\\epsilon$ with $E\\epsilon=0$ and $\\operatorname{Var}(\\epsilon)=\\sigma^2$.</p>",
    symbols: [
      { sym: "$f(x)$", desc: "true signal" },
      { sym: "$\\hat f(x)$", desc: "learned predictor" },
      { sym: "bias", desc: "model average offset" },
      { sym: "variance", desc: "training-sample sensitivity" },
      { sym: "$\\sigma^2$", desc: "irreducible noise" }
    ],
    derivation: [
      { do: "Write prediction error at fixed input.", result: "$E[(\\hat f(x)-Y)^2]$ with $Y=f(x)+\\epsilon$", why: "the response combines true signal and noise" },
      { do: "State the noise assumptions.", result: "$E\\epsilon=0$, $\\operatorname{Var}(\\epsilon)=\\sigma^2$", why: "zero-mean noise separates signal from irreducible randomness" },
      { do: "Add and subtract the average learned predictor.", result: "$\\hat f(x)-Y=(\\hat f(x)-E\\hat f(x))+(E\\hat f(x)-f(x))-\\epsilon$", why: "this separates sample fluctuation, average offset, and noise" },
      { do: "Expand the square.", result: "variance term, squared bias term, noise term, and cross terms", why: "the decomposition comes from algebraic expansion" },
      { do: "Drop the cross terms.", result: "cross terms vanish", why: "centered estimator fluctuation and noise have mean zero" },
      { do: "Identify the pieces.", result: "error = bias$^2$ + variance + noise", why: "prediction error has systematic, sampling, and irreducible components" }
    ],
    applications: [
      { title: "Total error", background: "Prediction error adds squared bias, variance, and noise.", numbers: "bias$^2=0.25$, variance $0.16$, noise $0.09$ gives $0.50$." },
      { title: "Underfit model", background: "Underfitting has high bias and low variance.", numbers: "bias $0.8$, variance $0.05$, noise $0.10$ gives $0.79$." },
      { title: "Overfit model", background: "Overfitting often has low bias and high variance.", numbers: "bias $0.1$, variance $0.50$, noise $0.10$ gives $0.61$." },
      { title: "Regularization", background: "Regularization can trade a little bias for a larger variance reduction.", numbers: "variance drop $0.30$ to $0.12$ with bias$^2$ rise $0.04$ to $0.09$ lowers total by $0.13$." },
      { title: "Ensembling", background: "Independent model averaging reduces variance.", numbers: "averaging four independent models cuts variance $0.16$ to $0.04$." },
      { title: "Irreducible noise", background: "Noise remains even with perfect model averaging.", numbers: "even zero bias and zero variance leave error $0.09$." }
    ]
  },
  "math-18-30": {
    connectionsProse: "<p>This lesson places inference in the setting of learned predictors. Training error is computed on observed data, while generalization concerns performance on new draws from the same population. The lesson connects empirical risk, model complexity, concentration bounds, and train-test gaps.</p>",
    motivation: "<p>Generalization theory studies why performance on a training sample can predict performance on new data, and how model complexity affects that gap. A fixed model's empirical error is an average of bounded losses, so concentration inequalities can limit how far it is from true risk.</p>" +
                "<p>When many models are considered, the bound must cover the whole class. A union bound adds a complexity penalty through the number of candidate classifiers. The resulting guarantee is often conservative, but it clearly shows the roles of sample size, failure probability, and model class size.</p>",
    definition: "<p>Statistical learning theory compares empirical risk to population risk. A simple Hoeffding-union bound for $M$ fixed classifiers is $$P(\\max_m|\\hat R_m-R_m|>\\epsilon)\\le2Me^{-2n\\epsilon^2},\\qquad \\epsilon\\ge\\sqrt{\\frac{\\log(2M/\\delta)}{2n}}.$$</p>" +
                "<p><b>Assumptions that matter:</b> This bound uses bounded $0/1$ losses, fixed classifiers, independent samples, and a union bound over $M$ candidates.</p>",
    symbols: [
      { sym: "$R$", desc: "population risk" },
      { sym: "$\\hat R$", desc: "empirical risk" },
      { sym: "$M$", desc: "model class size" },
      { sym: "$\\delta$", desc: "failure probability" },
      { sym: "generalization gap $R-\\hat R$", desc: "difference between population and empirical risk" }
    ],
    derivation: [
      { do: "Define true and empirical risk.", result: "$R$ and $\\hat R_n$ as averages of bounded $0/1$ losses", why: "training error is an empirical average and true risk is its population counterpart" },
      { do: "Apply Hoeffding for one fixed classifier.", result: "$P(|\\hat R_n-R|>\\epsilon)\\le2e^{-2n\\epsilon^2}$", why: "bounded independent losses concentrate around their mean" },
      { do: "Cover $M$ fixed classifiers.", result: "apply a union bound", why: "any one of the $M$ classifiers could have a large gap" },
      { do: "Write the class-wide bound.", result: "$P(\\max_m|\\hat R_m-R_m|>\\epsilon)\\le2Me^{-2n\\epsilon^2}$", why: "the union bound multiplies the one-model probability by $M$" },
      { do: "Solve for a high-probability gap.", result: "$\\epsilon\\ge\\sqrt{\\log(2M/\\delta)/(2n)}$", why: "set the upper bound to $\\delta$ and isolate $\\epsilon$" },
      { do: "Compute the one-model example.", result: "for one fixed model, $n=100,\\epsilon=0.08$ gives bound $2e^{-1.28}=0.556$", why: "substituting into Hoeffding gives the probability bound" }
    ],
    applications: [
      { title: "Fixed model bound", background: "Hoeffding gives a conservative probability bound for one fixed model.", numbers: "$n=100,\\epsilon=0.08$ gives probability bound $0.556$." },
      { title: "Model class penalty", background: "A larger model class adds a logarithmic complexity penalty.", numbers: "$M=100,\\delta=0.05,n=10{,}000$ gives gap bound $\\sqrt{\\log4000/20000}=0.0204$." },
      { title: "Train-test gap", background: "A held-out test error can reveal generalization gap.", numbers: "train error $0.08$, test error $0.12$ gives gap $0.04$." },
      { title: "Test error SE", background: "A finite test set has binomial uncertainty.", numbers: "$p=0.12,n=1000$ gives SE $\\sqrt{0.1056/1000}=0.0103$." },
      { title: "More data", background: "The concentration bound improves at a square-root rate.", numbers: "doubling $n$ divides the bound by $\\sqrt2$." },
      { title: "Complexity warning", background: "Increasing model choices raises the logarithmic term in a uniform bound.", numbers: "increasing $M$ from $10$ to $1000$ raises the log term from $\\log(400)$ to $\\log(40000)$ at $\\delta=0.05$." }
    ]
  }
};
