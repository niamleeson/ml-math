module.exports = {
  "math-17-14": {
    id: "math-17-14",
    title: "Variance",
    tagline: "Variance measures how widely a random quantity tends to wander around its mean.",
    connections: {
      buildsOn: ["Expected value", "random variables", "sums of probabilities"],
      leadsTo: ["Moments", "Gaussian distribution", "covariance and correlation"],
      usedWith: ["standard deviation", "mean squared error", "centered random variables", "Chebyshev bounds"]
    },
    motivation:
      "<p>You already know an average can hide the story. Two models can both have mean error $0$, while one makes tiny mistakes and the other swings wildly between misses.</p>" +
      "<p><b>Variance</b> gives spread a number. It asks: after we subtract the mean, how large is the squared leftover on average? Squaring keeps positive and negative deviations from canceling, and it makes large surprises count more.</p>",
    definition:
      "<p>For a random variable $X$ with mean $mu=E[X]$, the <b>variance</b> is $Var(X)=E[(X-mu)^2]$. The standard deviation is $sigma=sqrt(Var(X))$, returning the spread to the original units.</p>" +
      "<p>The useful shortcut is $Var(X)=E[X^2]-mu^2$. It comes from expanding $(X-mu)^2=X^2-2mu X+mu^2$, then taking expectation: $E[X^2]-2mu E[X]+mu^2=E[X^2]-mu^2$ because $E[X]=mu$.</p>" +
      "<p><b>Assumptions that matter:</b> the mean and second moment must exist; variance is never negative; adding a constant does not change variance; and multiplying by $a$ changes variance by $a^2$.</p>",
    worked: {
      problem: "A random variable takes values $1,3,5$ with probabilities $0.2,0.5,0.3$. Find its variance.",
      skills: ["expected value", "second moment", "variance shortcut"],
      strategy: "The spread is hidden in weighted squares, so compute $E[X]$ and $E[X^2]$ separately.",
      steps: [
        { do: "Compute the weighted mean", result: "$E[X]=1(0.2)+3(0.5)+5(0.3)$", why: "multiply each value by its probability" },
        { do: "Add the mean terms", result: "$mu=3.2$", why: "$0.2+1.5+1.5=3.2$" },
        { do: "Compute the second moment", result: "$E[X^2]=1^2(0.2)+3^2(0.5)+5^2(0.3)$", why: "square first, then weight" },
        { do: "Add the second-moment terms", result: "$E[X^2]=12.2$", why: "$0.2+4.5+7.5=12.2$" },
        { do: "Subtract the squared mean", result: "$Var(X)=12.2-3.2^2$", why: "use $E[X^2]-mu^2$" },
        { do: "Simplify", result: "$Var(X)=1.96$", why: "$3.2^2=10.24$" }
      ],
      verify: "The spread is modest because most mass is near 3; a variance near 2 is plausible on values from 1 to 5.",
      answer: "$Var(X)=1.96$, so the standard deviation is $sqrt(1.96)=1.4$.",
      connects: "Variance is the expected squared distance from the mean.",
    },
    practice: [
      { problem: "A fair coin pays $1$ for heads and $0$ for tails. Find the variance of the payout.", steps: [
        { do: "List the probabilities", result: "$P(X=1)=0.5$ and $P(X=0)=0.5$", why: "the coin is fair" },
        { do: "Compute the mean", result: "$E[X]=1(0.5)+0(0.5)=0.5$", why: "use weighted values" },
        { do: "Compute the second moment", result: "$E[X^2]=1^2(0.5)+0^2(0.5)=0.5$", why: "squares of 0 and 1 are unchanged" },
        { do: "Apply the shortcut", result: "$Var(X)=0.5-0.5^2$", why: "variance equals second moment minus mean squared" },
        { do: "Simplify", result: "$Var(X)=0.25$", why: "$0.5-0.25=0.25$" }
      ], answer: "The variance is $0.25$." },
      { problem: "A variable has mean $4$ and $E[X^2]=21$. Find $Var(X)$ and the standard deviation.", steps: [
        { do: "Write the variance shortcut", result: "$Var(X)=E[X^2]-mu^2$", why: "the second moment and mean are given" },
        { do: "Substitute the values", result: "$Var(X)=21-4^2$", why: "$mu=4$" },
        { do: "Square the mean", result: "$4^2=16$", why: "variance subtracts the squared mean" },
        { do: "Subtract", result: "$Var(X)=5$", why: "$21-16=5$" },
        { do: "Take the square root", result: "$sigma=sqrt(5) approx 2.236$", why: "standard deviation is the square root of variance" }
      ], answer: "$Var(X)=5$ and $sigma approx 2.236$." },
      { problem: "Let $Y=2X+7$ and $Var(X)=3$. Find $Var(Y)$.", steps: [
        { do: "Identify the scale factor", result: "$a=2$", why: "the constant 7 only shifts values" },
        { do: "Use the scaling rule", result: "$Var(2X+7)=2^2 Var(X)$", why: "variance scales by the square of the multiplier" },
        { do: "Square the multiplier", result: "$2^2=4$", why: "spread doubles in distance, so squared spread quadruples" },
        { do: "Substitute the variance", result: "$Var(Y)=4(3)$", why: "$Var(X)=3$" },
        { do: "Multiply", result: "$Var(Y)=12$", why: "$4 times 3=12$" }
      ], answer: "$Var(Y)=12$." },
      { problem: "A random variable takes $-1,0,2$ with probabilities $0.25,0.25,0.50$. Find its variance.", steps: [
        { do: "Compute the mean", result: "$E[X]=(-1)(0.25)+0(0.25)+2(0.50)$", why: "weight each value" },
        { do: "Simplify the mean", result: "$mu=0.75$", why: "$-0.25+0+1=0.75$" },
        { do: "Compute the second moment", result: "$E[X^2]=1(0.25)+0(0.25)+4(0.50)$", why: "square each value before weighting" },
        { do: "Simplify the second moment", result: "$E[X^2]=2.25$", why: "$0.25+0+2=2.25$" },
        { do: "Subtract the squared mean", result: "$Var(X)=2.25-0.75^2=1.6875$", why: "$0.75^2=0.5625$" }
      ], answer: "$Var(X)=1.6875$." },
      { problem: "A model error is $-2$ with probability $0.1$, $0$ with probability $0.8$, and $3$ with probability $0.1$. Find the mean error and variance.", steps: [
        { do: "Compute the mean error", result: "$E[E]=(-2)(0.1)+0(0.8)+3(0.1)$", why: "errors can be positive or negative" },
        { do: "Simplify the mean", result: "$mu=0.1$", why: "$-0.2+0+0.3=0.1$" },
        { do: "Compute the second moment", result: "$E[E^2]=4(0.1)+0(0.8)+9(0.1)$", why: "squared errors measure size without sign" },
        { do: "Simplify the second moment", result: "$E[E^2]=1.3$", why: "$0.4+0+0.9=1.3$" },
        { do: "Compute variance", result: "$Var(E)=1.3-0.1^2=1.29$", why: "remove the squared average bias" }
      ], answer: "Mean error is $0.1$ and variance is $1.29$." }
    ],
    applications: [
      { title: "Model error spread", background: "Regression teams track not only average error but also how unstable the errors are across examples.", numbers: "Errors $[-1,0,1]$ with equal probability have mean $0$ and variance $(1+0+1)/3=0.667$." },
      { title: "Feature scaling", background: "Standardization divides by standard deviation so features have comparable spread before optimization.", numbers: "If click count has mean $20$ and variance $25$, then $x=30$ becomes $z=(30-20)/5=2$." },
      { title: "A/B experiment noise", background: "Experiment analysis separates signal from random variation; high variance makes an effect harder to detect.", numbers: "If conversion indicators have $p=0.04$, Bernoulli variance is $0.04(0.96)=0.0384$." },
      { title: "Portfolio risk", background: "Finance popularized variance as a risk measure because returns above and below the mean both matter.", numbers: "Returns $-0.02,0.01,0.04$ have mean $0.01$ and squared deviations $0.0009,0,0.0009$, average $0.0006$." },
      { title: "Sensor reliability", background: "Engineers compare sensors by repeated measurements around a stable value.", numbers: "Measurements $9,10,11$ have mean $10$ and variance $(1+0+1)/3=0.667$." },
      { title: "Mini-batch gradients", background: "Stochastic gradient methods work with noisy gradient estimates; variance describes that noise.", numbers: "Gradient samples $2,4,6$ have mean $4$ and variance $(4+0+4)/3=2.667$." }
    ],
    applicationsClose: "Variance is the same spread-measuring idea in losses, features, experiments, finance, sensors, and optimization.",
    takeaways: [
      "$Var(X)=E[(X-mu)^2]$ measures average squared distance from the mean.",
      "The shortcut $Var(X)=E[X^2]-mu^2$ is often the fastest computation.",
      "Shifts do not change variance; scaling by $a$ multiplies variance by $a^2$.",
      "Standard deviation is the square root of variance and uses the original units."
    ]
  },

  "math-17-15": {
    id: "math-17-15",
    title: "Moments",
    tagline: "Moments are numerical fingerprints of a distribution, describing center, spread, shape, and tails.",
    connections: {
      buildsOn: ["Expected value", "Variance", "powers of random variables"],
      leadsTo: ["Moment generating functions", "Beta and Gamma distributions", "Gaussian distribution"],
      usedWith: ["central moments", "skewness", "kurtosis", "Taylor polynomials"]
    },
    motivation:
      "<p>You already know the first two summaries: the mean tells where a distribution balances, and variance tells how far it spreads. But distributions can lean left, lean right, or have unusually heavy tails.</p>" +
      "<p><b>Moments</b> extend the same idea. They average powers of the random variable, or powers of its distance from the mean, so each new power notices a different part of the shape.</p>",
    definition:
      "<p>The $k$th raw moment of $X$ is $E[X^k]$. The $k$th central moment is $E[(X-mu)^k]$, where $mu=E[X]$. The first raw moment is the mean. The second central moment is variance. The third central moment helps describe skew, and the fourth helps describe tail weight.</p>" +
      "<p>The link to variance is direct: $E[(X-mu)^2]$ expands to $E[X^2]-mu^2$. Higher central moments similarly recenter the distribution before taking powers, so they describe shape around the mean rather than around zero.</p>" +
      "<p><b>Assumptions that matter:</b> a moment exists only if the relevant expectation is finite; raw moments depend on the origin of the scale; central moments are translation-aware; and odd central moments keep sign information while even central moments measure magnitude.</p>",
    worked: {
      problem: "For $X$ taking $0,1,2$ with probabilities $0.25,0.50,0.25$, compute the first raw moment, second raw moment, and second central moment.",
      skills: ["raw moments", "central moments", "variance"],
      strategy: "Compute powers with probabilities, then recenter for the central moment.",
      steps: [
        { do: "Compute $E[X]$", result: "$0(0.25)+1(0.50)+2(0.25)=1$", why: "the first raw moment is the mean" },
        { do: "Compute $E[X^2]$", result: "$0^2(0.25)+1^2(0.50)+2^2(0.25)=1.5$", why: "the second raw moment averages squares" },
        { do: "Write deviations from the mean", result: "$-1,0,1$", why: "subtract $mu=1$ from each value" },
        { do: "Square the deviations", result: "$1,0,1$", why: "the second central moment uses squared deviations" },
        { do: "Weight the squared deviations", result: "$1(0.25)+0(0.50)+1(0.25)=0.5$", why: "take the expectation of centered squares" }
      ],
      verify: "The shortcut gives $E[X^2]-mu^2=1.5-1=0.5$, matching the central-moment calculation.",
      answer: "$E[X]=1$, $E[X^2]=1.5$, and $E[(X-1)^2]=0.5$.",
      connects: "Moments turn a distribution's shape into a sequence of weighted power averages."
    },
    practice: [
      { problem: "For a fair coin indicator $X$, find $E[X]$, $E[X^2]$, and $E[X^3]$.", steps: [
        { do: "List possible values", result: "$X=0$ or $X=1$", why: "an indicator only has two values" },
        { do: "Compute the first moment", result: "$E[X]=0(0.5)+1(0.5)=0.5$", why: "average the values" },
        { do: "Compute the second powers", result: "$0^2=0$ and $1^2=1$", why: "indicators stay the same when squared" },
        { do: "Compute the second moment", result: "$E[X^2]=0.5$", why: "the powered values match $X$" },
        { do: "Compute the third moment", result: "$E[X^3]=0.5$", why: "the powered values still match $X$" }
      ], answer: "All three moments are $0.5$." },
      { problem: "For $X$ taking $1$ and $3$ with equal probability, compute the third raw moment.", steps: [
        { do: "Cube the first value", result: "$1^3=1$", why: "third raw moment uses cubes" },
        { do: "Cube the second value", result: "$3^3=27$", why: "apply the same power" },
        { do: "Weight the cubes", result: "$1(0.5)+27(0.5)$", why: "both outcomes are equally likely" },
        { do: "Add the terms", result: "$0.5+13.5=14$", why: "sum weighted powers" },
        { do: "Name the moment", result: "$E[X^3]=14$", why: "this is the third raw moment" }
      ], answer: "$E[X^3]=14$." },
      { problem: "For $X$ taking $-1,0,1$ with equal probabilities, find the third central moment.", steps: [
        { do: "Compute the mean", result: "$(-1+0+1)/3=0$", why: "the values are symmetric" },
        { do: "Write centered values", result: "$-1,0,1$", why: "the mean is zero" },
        { do: "Cube centered values", result: "$-1,0,1$", why: "cubes preserve sign" },
        { do: "Average the cubes", result: "$(-1+0+1)/3=0$", why: "opposite tails cancel" },
        { do: "Interpret", result: "no skew by this moment", why: "symmetry makes the third central moment zero" }
      ], answer: "The third central moment is $0$." },
      { problem: "A variable has $E[X]=2$, $E[X^2]=7$, and $E[X^3]=30$. Compute $E[(X-2)^3]$.", steps: [
        { do: "Expand the centered cube", result: "$(X-2)^3=X^3-6X^2+12X-8$", why: "use the binomial formula" },
        { do: "Take expectations", result: "$E[(X-2)^3]=E[X^3]-6E[X^2]+12E[X]-8$", why: "expectation is linear" },
        { do: "Substitute moments", result: "$30-6(7)+12(2)-8$", why: "use the given values" },
        { do: "Combine terms", result: "$30-42+24-8$", why: "multiply before adding" },
        { do: "Simplify", result: "$4$", why: "the arithmetic gives the third central moment" }
      ], answer: "$E[(X-2)^3]=4$." },
      { problem: "A model residual has values $-2,0,1$ with probabilities $0.2,0.5,0.3$. Compute the first two raw moments.", steps: [
        { do: "Compute the mean", result: "$E[R]=(-2)(0.2)+0(0.5)+1(0.3)$", why: "the first raw moment is the average residual" },
        { do: "Simplify the mean", result: "$E[R]=-0.1$", why: "$-0.4+0+0.3=-0.1$" },
        { do: "Square the residual values", result: "$4,0,1$", why: "the second raw moment uses squared residuals" },
        { do: "Weight the squares", result: "$4(0.2)+0(0.5)+1(0.3)$", why: "take a probability-weighted average" },
        { do: "Simplify the second moment", result: "$E[R^2]=1.1$", why: "$0.8+0+0.3=1.1$" }
      ], answer: "$E[R]=-0.1$ and $E[R^2]=1.1$." }
    ],
    applications: [
      { title: "Mean as first moment", background: "The mean is the oldest moment and still the first summary people ask for.", numbers: "Values $2,4,9$ with equal weights have first moment $(2+4+9)/3=5$." },
      { title: "Variance as second central moment", background: "Statistics uses the second central moment because it measures spread around the mean.", numbers: "For $1,3,5$, mean is $3$ and variance is $(4+0+4)/3=2.667$." },
      { title: "Skewness in latency", background: "Service latency often has a long right tail; third central moments detect that lean.", numbers: "Latencies $10,10,40$ have mean $20$ and centered cubes $-1000,-1000,8000$, average $2000$." },
      { title: "Kurtosis and tail risk", background: "Fourth moments increase the penalty for rare large deviations, useful when tails matter.", numbers: "Centered deviations $-1,0,3$ have fourth powers $1,0,81$, so the large value dominates." },
      { title: "Method of moments", background: "Before modern computation, statisticians estimated parameters by matching sample moments to theoretical moments.", numbers: "If sample mean is $5$ and a model has mean parameter $theta$, set $theta=5$." },
      { title: "Feature distribution monitoring", background: "ML systems monitor moments to detect data drift across training and serving.", numbers: "A feature mean moving from $0.0$ to $0.6$ and variance from $1.0$ to $1.8$ signals both shift and spread change." }
    ],
    applicationsClose: "Moments are shape summaries: one language for averages, spreads, asymmetry, tails, estimation, and monitoring.",
    takeaways: [
      "Raw moments average powers $E[X^k]$.",
      "Central moments average powers around the mean, $E[(X-mu)^k]$.",
      "Variance is the second central moment.",
      "Higher moments describe shape, but they require finite expectations."
    ]
  },

  "math-17-16": {
    id: "math-17-16",
    title: "Moment generating functions",
    tagline: "A moment generating function packages all moments into one exponential average when it exists.",
    connections: {
      buildsOn: ["Moments", "Expected value", "Exponential functions"],
      leadsTo: ["Gaussian distribution", "sums of independent random variables", "concentration bounds"],
      usedWith: ["Taylor series", "independence", "derivatives", "cumulants"]
    },
    motivation:
      "<p>You have seen moments one at a time: mean, variance, skew, and beyond. But computing each separately can feel like opening many drawers.</p>" +
      "<p>A <b>moment generating function</b>, or MGF, puts those drawers in one cabinet. It averages $e^{tX}$, and the Taylor series of the exponential stores powers of $X$ as coefficients.</p>",
    definition:
      "<p>The MGF of a random variable $X$ is $M_X(t)=E[e^{tX}]$ for values of $t$ near $0$ where the expectation is finite. Its derivatives at zero generate raw moments: $M_X'(0)=E[X]$, $M_X''(0)=E[X^2]$, and in general the $k$th derivative at zero is $E[X^k]$.</p>" +
      "<p>Why this works: $e^{tX}=1+tX+t^2X^2/2+...$. Taking expectation gives $M_X(t)=1+tE[X]+t^2E[X^2]/2+...$, so derivatives at $0$ pull down the moment coefficients.</p>" +
      "<p><b>Assumptions that matter:</b> the MGF must exist in an open interval around $0$ for the standard uniqueness and derivative facts; independence gives $M_{X+Y}(t)=M_X(t)M_Y(t)$; and not every distribution has an MGF beyond $t=0$.</p>",
    worked: {
      problem: "A Bernoulli random variable has $P(X=1)=p$ and $P(X=0)=1-p$. Find its MGF and use it to get the mean.",
      skills: ["MGF definition", "Bernoulli distribution", "derivatives"],
      strategy: "Average $e^{tX}$ over the two outcomes, then differentiate at zero.",
      steps: [
        { do: "Write the expectation", result: "$M_X(t)=E[e^{tX}]$", why: "this is the MGF definition" },
        { do: "Substitute the two outcomes", result: "$M_X(t)=(1-p)e^{t0}+p e^{t1}$", why: "weight each exponential by its probability" },
        { do: "Simplify exponentials", result: "$M_X(t)=1-p+p e^t$", why: "$e^0=1$" },
        { do: "Differentiate", result: "$M_X'(t)=p e^t$", why: "the constant term disappears" },
        { do: "Evaluate at zero", result: "$M_X'(0)=p$", why: "$e^0=1$" }
      ],
      verify: "A Bernoulli variable has average $1$ with probability $p$ and $0$ otherwise, so mean $p$ matches the MGF result.",
      answer: "$M_X(t)=1-p+p e^t$ and $E[X]=p$.",
      connects: "The MGF turns moments into derivatives at zero."
    },
    practice: [
      { problem: "For a constant random variable $X=3$, find $M_X(t)$ and $E[X]$ from it.", steps: [
        { do: "Apply the MGF definition", result: "$M_X(t)=E[e^{tX}]$", why: "start from the definition" },
        { do: "Substitute the constant", result: "$M_X(t)=E[e^{3t}]$", why: "$X$ is always 3" },
        { do: "Remove the expectation", result: "$M_X(t)=e^{3t}$", why: "a constant averages to itself" },
        { do: "Differentiate", result: "$M_X'(t)=3e^{3t}$", why: "chain rule for the exponential" },
        { do: "Evaluate at zero", result: "$M_X'(0)=3$", why: "$e^0=1$" }
      ], answer: "$M_X(t)=e^{3t}$ and $E[X]=3$." },
      { problem: "If $X$ takes $0$ and $2$ with equal probability, find $M_X(t)$.", steps: [
        { do: "Write the weighted expectation", result: "$M_X(t)=0.5e^{t0}+0.5e^{t2}$", why: "average over the two outcomes" },
        { do: "Simplify the first exponential", result: "$0.5e^0=0.5$", why: "$e^0=1$" },
        { do: "Simplify the expression", result: "$M_X(t)=0.5+0.5e^{2t}$", why: "combine the two weighted terms" },
        { do: "Check at zero", result: "$M_X(0)=0.5+0.5=1$", why: "every MGF equals 1 at zero" },
        { do: "State the MGF", result: "$0.5+0.5e^{2t}$", why: "the formula is valid for all real $t$ here" }
      ], answer: "$M_X(t)=0.5+0.5e^{2t}$." },
      { problem: "For $M(t)=e^{5t}$, find the first two raw moments.", steps: [
        { do: "Differentiate once", result: "$M'(t)=5e^{5t}$", why: "first derivative gives first moment at zero" },
        { do: "Evaluate at zero", result: "$M'(0)=5$", why: "$e^0=1$" },
        { do: "Differentiate twice", result: "$M''(t)=25e^{5t}$", why: "differentiate $5e^{5t}$" },
        { do: "Evaluate at zero", result: "$M''(0)=25$", why: "second derivative gives $E[X^2]$" },
        { do: "Name the moments", result: "$E[X]=5$, $E[X^2]=25$", why: "derivatives at zero generate raw moments" }
      ], answer: "$E[X]=5$ and $E[X^2]=25$." },
      { problem: "Independent variables have MGFs $M_X(t)=e^{2t}$ and $M_Y(t)=e^{3t}$. Find the MGF of $X+Y$.", steps: [
        { do: "Use independence", result: "$M_{X+Y}(t)=M_X(t)M_Y(t)$", why: "MGFs multiply for independent sums" },
        { do: "Substitute the MGFs", result: "$M_{X+Y}(t)=e^{2t}e^{3t}$", why: "use the given formulas" },
        { do: "Combine exponents", result: "$e^{5t}$", why: "$e^a e^b=e^{a+b}$" },
        { do: "Interpret the result", result: "the sum behaves like constant $5$", why: "$e^{5t}$ is the MGF of $X=5$" },
        { do: "Check the mean", result: "$2+3=5$", why: "means add for sums" }
      ], answer: "$M_{X+Y}(t)=e^{5t}$." },
      { problem: "A Bernoulli variable has $p=0.3$. Use its MGF to compute $E[X^2]$.", steps: [
        { do: "Write the MGF", result: "$M(t)=0.7+0.3e^t$", why: "use $1-p+p e^t$" },
        { do: "Differentiate once", result: "$M'(t)=0.3e^t$", why: "prepare for the second derivative" },
        { do: "Differentiate twice", result: "$M''(t)=0.3e^t$", why: "the derivative has the same form" },
        { do: "Evaluate at zero", result: "$M''(0)=0.3$", why: "$e^0=1$" },
        { do: "Check with the variable", result: "$X^2=X$", why: "a Bernoulli value is 0 or 1" }
      ], answer: "$E[X^2]=0.3$." }
    ],
    applications: [
      { title: "Sums of independent noise", background: "MGFs simplify sums because independent pieces multiply in MGF space.", numbers: "If two independent constants have MGFs $e^t$ and $e^{4t}$, the sum MGF is $e^{5t}$." },
      { title: "Recovering moments", background: "Analysts use MGFs as compact containers for moments when derivatives are easier than direct sums.", numbers: "For $M(t)=e^{2t}$, $M'(0)=2$ and $M''(0)=4$." },
      { title: "Identifying distributions", background: "When MGFs exist near zero, matching MGFs identifies the distribution.", numbers: "The MGF $1-p+p e^t$ with $p=0.8$ identifies a Bernoulli with success probability $0.8$." },
      { title: "Gaussian algebra", background: "Normal distributions are pleasant partly because their MGFs make sums easy.", numbers: "Independent means $2$ and $3$ add to $5$; variances $1$ and $4$ add to $5$." },
      { title: "Concentration bounds", background: "Probability tail bounds often start by applying Markov's inequality to $e^{tX}$.", numbers: "If $E[e^{0.5X}]=2$ then $P(X>=4) <= 2/e^2 approx 0.271$." },
      { title: "Queueing and reliability models", background: "Classical applied probability uses transforms like MGFs to combine waiting times and lifetimes.", numbers: "Two independent stages with mean times $3$ and $5$ have total mean $8$, visible from first MGF derivatives." }
    ],
    applicationsClose: "MGFs are a transform viewpoint: moments, sums, identities, and tail bounds become easier after exponentiating.",
    takeaways: [
      "$M_X(t)=E[e^{tX}]$ when this expectation exists near $0$.",
      "Derivatives at $0$ generate raw moments.",
      "Independent sums have product MGFs.",
      "MGFs are powerful, but existence near zero matters."
    ]
  },

  "math-17-17": {
    id: "math-17-17",
    title: "The Bernoulli distribution",
    tagline: "Bernoulli is the mathematics of one yes-or-no trial.",
    connections: {
      buildsOn: ["random variables", "Expected value", "Variance"],
      leadsTo: ["The binomial distribution", "logistic regression", "cross-entropy"],
      usedWith: ["indicator variables", "odds", "binary events", "sample proportions"]
    },
    motivation:
      "<p>Many questions begin as a single yes or no: did the user click, did the test pass, did the email open, did the coin land heads?</p>" +
      "<p>The <b>Bernoulli distribution</b> is the clean model for one such trial. It gives the outcome $1$ to success, $0$ to failure, and keeps all uncertainty in one parameter $p$.</p>",
    definition:
      "<p>A random variable $X$ has a Bernoulli distribution with parameter $p$ if $P(X=1)=p$ and $P(X=0)=1-p$, where $0<=p<=1$. Its mean is $E[X]=p$ and its variance is $Var(X)=p(1-p)$.</p>" +
      "<p>The mean follows because $E[X]=1p+0(1-p)=p$. The second moment equals $p$ too, since $X^2=X$ for values $0$ and $1$. Therefore $Var(X)=E[X^2]-E[X]^2=p-p^2=p(1-p)$.</p>" +
      "<p><b>Assumptions that matter:</b> the trial has exactly two coded outcomes; $p$ is the probability of the outcome coded as $1$; repeated Bernoulli trials need independence only if we later combine them as a binomial model.</p>",
    worked: {
      problem: "A click indicator has click probability $p=0.08$. Find $P(X=0)$, $E[X]$, and $Var(X)$.",
      skills: ["Bernoulli probabilities", "mean", "variance"],
      strategy: "A Bernoulli variable is fully determined by $p$, so use the complement and standard formulas.",
      steps: [
        { do: "Identify success probability", result: "$p=0.08$", why: "click is coded as 1" },
        { do: "Compute failure probability", result: "$1-p=0.92$", why: "the two outcomes must sum to 1" },
        { do: "Compute the mean", result: "$E[X]=p=0.08$", why: "a Bernoulli mean is its success probability" },
        { do: "Write the variance formula", result: "$Var(X)=p(1-p)$", why: "Bernoulli variance comes from $X^2=X$" },
        { do: "Substitute and multiply", result: "$Var(X)=0.08(0.92)=0.0736$", why: "use the click and no-click probabilities" }
      ],
      verify: "The mean is between 0 and 1, and the variance is below the maximum Bernoulli variance $0.25$.",
      answer: "$P(X=0)=0.92$, $E[X]=0.08$, and $Var(X)=0.0736$.",
      connects: "Bernoulli turns one binary event into a numerical random variable."
    },
    practice: [
      { problem: "A biased coin lands heads with probability $0.6$. Let heads be $1$. Find the mean and variance.", steps: [
        { do: "Set the parameter", result: "$p=0.6$", why: "heads is the success outcome" },
        { do: "Compute the complement", result: "$1-p=0.4$", why: "tails is the only other outcome" },
        { do: "Find the mean", result: "$E[X]=0.6$", why: "Bernoulli mean equals $p$" },
        { do: "Find the variance", result: "$Var(X)=0.6(0.4)$", why: "use $p(1-p)$" },
        { do: "Multiply", result: "$Var(X)=0.24$", why: "$0.6 times 0.4=0.24$" }
      ], answer: "Mean $0.6$, variance $0.24$." },
      { problem: "If $P(X=0)=0.15$ for a Bernoulli variable, find $p$ and $E[X]$.", steps: [
        { do: "Use the complement", result: "$P(X=1)=1-0.15$", why: "probabilities of 0 and 1 sum to 1" },
        { do: "Subtract", result: "$p=0.85$", why: "success is the outcome 1" },
        { do: "Use the Bernoulli mean", result: "$E[X]=p$", why: "the average indicator equals success probability" },
        { do: "Substitute", result: "$E[X]=0.85$", why: "use the computed parameter" },
        { do: "Check bounds", result: "$0<=0.85<=1$", why: "a Bernoulli parameter must be a probability" }
      ], answer: "$p=0.85$ and $E[X]=0.85$." },
      { problem: "For $p=0.5$, show that Bernoulli variance is maximized among $p=0.2,0.5,0.8$.", steps: [
        { do: "Compute variance at $p=0.2$", result: "$0.2(0.8)=0.16$", why: "use $p(1-p)$" },
        { do: "Compute variance at $p=0.5$", result: "$0.5(0.5)=0.25$", why: "balanced outcomes are most uncertain" },
        { do: "Compute variance at $p=0.8$", result: "$0.8(0.2)=0.16$", why: "the formula is symmetric around $0.5$" },
        { do: "Compare the values", result: "$0.25>0.16$", why: "the middle probability has greater spread" },
        { do: "State the maximum among these", result: "$p=0.5$", why: "it gives the largest variance listed" }
      ], answer: "Among those choices, $p=0.5$ has the largest variance, $0.25$." },
      { problem: "A classifier predicts probability $0.7$ for the true label $1$. Compute the likelihood for observing $X=1$ and for observing $X=0$.", steps: [
        { do: "Set the Bernoulli parameter", result: "$p=0.7$", why: "probability of label 1" },
        { do: "Compute likelihood for $X=1$", result: "$P(X=1)=0.7$", why: "success likelihood equals $p$" },
        { do: "Compute complement", result: "$1-p=0.3$", why: "label 0 is failure under this coding" },
        { do: "Compute likelihood for $X=0$", result: "$P(X=0)=0.3$", why: "use the complement" },
        { do: "Compare", result: "$0.7>0.3$", why: "the model favors label 1" }
      ], answer: "Likelihood is $0.7$ for $X=1$ and $0.3$ for $X=0$." },
      { problem: "In 200 impressions, the observed click rate is $0.04$. Model a single impression as Bernoulli and estimate its variance.", steps: [
        { do: "Estimate the parameter", result: "$p=0.04$", why: "sample click rate estimates click probability" },
        { do: "Compute no-click probability", result: "$1-p=0.96$", why: "only click or no click" },
        { do: "Use the Bernoulli variance formula", result: "$Var(X)=0.04(0.96)$", why: "single impression is a Bernoulli trial" },
        { do: "Multiply", result: "$Var(X)=0.0384$", why: "$4 percent times 96 percent$" },
        { do: "Interpret", result: "single-impression outcomes are very noisy", why: "most variance remains despite a low mean" }
      ], answer: "Estimated single-trial variance is $0.0384$." }
    ],
    applications: [
      { title: "Click indicators", background: "Ads and recommendation systems often start with click or no-click events.", numbers: "If $p=0.03$, then $E[X]=0.03$ and $Var(X)=0.03(0.97)=0.0291$." },
      { title: "Logistic regression labels", background: "Binary classification treats each label as a Bernoulli outcome with model-predicted parameter.", numbers: "Prediction $p=0.8$ assigns likelihood $0.8$ to label 1 and $0.2$ to label 0." },
      { title: "A/B conversion", background: "Conversion is naturally coded as 1 for converted and 0 otherwise.", numbers: "A $12 percent$ conversion probability gives variance $0.12(0.88)=0.1056$." },
      { title: "Data quality checks", background: "Missingness for a field can be modeled as a Bernoulli indicator.", numbers: "If $7$ of $100$ rows are missing, estimate $p=0.07$ and variance $0.0651$." },
      { title: "Unit test pass indicators", background: "A flaky test can be viewed as pass or fail on each run.", numbers: "If pass probability is $0.95$, fail probability is $0.05$." },
      { title: "Dropout masks", background: "Neural-network dropout randomly keeps or removes units during training.", numbers: "With keep probability $0.8$, a mask entry has mean $0.8$ and variance $0.16$." }
    ],
    applicationsClose: "Bernoulli is the small binary brick under clicks, labels, conversions, masks, and many larger count models.",
    takeaways: [
      "Bernoulli has outcomes $0$ and $1$ with success probability $p$.",
      "Its mean is $p$ and its variance is $p(1-p)$.",
      "Indicator variables are Bernoulli variables when the event probability is fixed.",
      "Repeated independent Bernoulli trials lead naturally to the binomial distribution."
    ]
  },

  "math-17-18": {
    id: "math-17-18",
    title: "The binomial distribution",
    tagline: "Binomial counts how many successes appear in a fixed number of independent yes-or-no trials.",
    connections: {
      buildsOn: ["The Bernoulli distribution", "combinations", "Expected value"],
      leadsTo: ["The Poisson distribution", "normal approximation", "confidence intervals for proportions"],
      usedWith: ["independence", "sample proportions", "combinatorics", "variance"]
    },
    motivation:
      "<p>One Bernoulli trial answers one yes-or-no question. But data rarely arrives as one trial. We ask how many users clicked among 100 impressions, how many tests passed among 20 runs, or how many heads appeared in 10 flips.</p>" +
      "<p>The <b>binomial distribution</b> counts successes across a fixed number of independent Bernoulli trials with the same success probability.</p>",
    definition:
      "<p>A random variable $X$ has a binomial distribution with parameters $n$ and $p$ if it counts successes in $n$ independent Bernoulli trials, each with success probability $p$. For $k=0,1,...,n$, $P(X=k)=C(n,k)p^k(1-p)^{n-k}$.</p>" +
      "<p>The formula has three parts: $p^k$ for the $k$ successes, $(1-p)^{n-k}$ for the failures, and $C(n,k)$ for the number of orders those successes can occupy. Its mean is $np$ and its variance is $np(1-p)$ because it is a sum of $n$ independent Bernoulli variables.</p>" +
      "<p><b>Assumptions that matter:</b> the number of trials $n$ is fixed, trials are independent, every trial has the same $p$, and the variable counts successes rather than measuring waiting time.</p>",
    worked: {
      problem: "A test has pass probability $0.8$ on each independent run. For $n=3$ runs, find $P(X=2)$ and $E[X]$.",
      skills: ["binomial formula", "combinations", "mean"],
      strategy: "Count the orders for exactly two passes, then multiply by pass and fail probabilities.",
      steps: [
        { do: "Identify parameters", result: "$n=3$, $p=0.8$, $k=2$", why: "we count exactly two passes" },
        { do: "Compute the combination", result: "$C(3,2)=3$", why: "the single failure can be in any of three positions" },
        { do: "Write the probability", result: "$P(X=2)=3(0.8)^2(0.2)^1$", why: "two passes and one failure" },
        { do: "Compute powers", result: "$3(0.64)(0.2)$", why: "$0.8^2=0.64$" },
        { do: "Multiply", result: "$P(X=2)=0.384$", why: "$3 times 0.128=0.384$" },
        { do: "Compute the mean", result: "$E[X]=np=3(0.8)=2.4$", why: "binomial mean is trials times success probability" }
      ],
      verify: "Exactly two passes is likely but not certain; mean $2.4$ passes is sensible for three high-probability trials.",
      answer: "$P(X=2)=0.384$ and $E[X]=2.4$.",
      connects: "Binomial is a sum of independent Bernoulli trials."
    },
    practice: [
      { problem: "For $X$ binomial with $n=4$, $p=0.5$, find $P(X=2)$.", steps: [
        { do: "Identify $k$", result: "$k=2$", why: "we want exactly two successes" },
        { do: "Compute combinations", result: "$C(4,2)=6$", why: "choose which two trials succeed" },
        { do: "Write the formula", result: "$P(X=2)=6(0.5)^2(0.5)^2$", why: "two successes and two failures" },
        { do: "Combine powers", result: "$6(0.5)^4$", why: "all four trials have factor $0.5$" },
        { do: "Simplify", result: "$6/16=0.375$", why: "$0.5^4=1/16$" }
      ], answer: "$P(X=2)=0.375$." },
      { problem: "For $n=10$, $p=0.3$, find the mean and variance.", steps: [
        { do: "Use the mean formula", result: "$E[X]=np$", why: "binomial counts $n$ Bernoulli trials" },
        { do: "Substitute mean values", result: "$E[X]=10(0.3)=3$", why: "multiply trials by success probability" },
        { do: "Use the variance formula", result: "$Var(X)=np(1-p)$", why: "independent Bernoulli variances add" },
        { do: "Substitute variance values", result: "$10(0.3)(0.7)$", why: "failure probability is $0.7$" },
        { do: "Multiply", result: "$Var(X)=2.1$", why: "$10 times 0.21=2.1$" }
      ], answer: "Mean $3$, variance $2.1$." },
      { problem: "A model succeeds with probability $0.9$ on each independent case. Find the probability all $5$ cases succeed.", steps: [
        { do: "Set the count", result: "$k=5$", why: "all five are successes" },
        { do: "Compute the combination", result: "$C(5,5)=1$", why: "there is only one all-success order" },
        { do: "Write the probability", result: "$P(X=5)=1(0.9)^5(0.1)^0$", why: "five successes and zero failures" },
        { do: "Simplify failure factor", result: "$(0.1)^0=1$", why: "anything nonzero to the zero power is 1" },
        { do: "Compute the power", result: "$0.9^5=0.59049$", why: "multiply five success probabilities" }
      ], answer: "The probability is $0.59049$." },
      { problem: "For $n=6$, $p=0.2$, find $P(X=0)$ and $P(X>=1)$.", steps: [
        { do: "Write $P(X=0)$", result: "$C(6,0)(0.2)^0(0.8)^6$", why: "zero successes means all failures" },
        { do: "Simplify constants", result: "$P(X=0)=0.8^6$", why: "$C(6,0)=1$ and $(0.2)^0=1$" },
        { do: "Compute the power", result: "$0.8^6=0.262144$", why: "six independent failures" },
        { do: "Use the complement", result: "$P(X>=1)=1-P(X=0)$", why: "at least one success is the complement of none" },
        { do: "Subtract", result: "$P(X>=1)=0.737856$", why: "$1-0.262144=0.737856$" }
      ], answer: "$P(X=0)=0.262144$ and $P(X>=1)=0.737856$." },
      { problem: "Among 100 impressions with click probability $0.04$, estimate the expected clicks and variance under a binomial model.", steps: [
        { do: "Identify parameters", result: "$n=100$, $p=0.04$", why: "each impression is one Bernoulli trial" },
        { do: "Compute expected clicks", result: "$E[X]=100(0.04)$", why: "use $np$" },
        { do: "Simplify the mean", result: "$E[X]=4$", why: "four percent of 100" },
        { do: "Compute the variance", result: "$Var(X)=100(0.04)(0.96)$", why: "use $np(1-p)$" },
        { do: "Simplify the variance", result: "$Var(X)=3.84$", why: "$100 times 0.0384=3.84$" }
      ], answer: "Expected clicks $4$ and variance $3.84$." }
    ],
    applications: [
      { title: "Click counts", background: "Ad systems count successes over fixed impressions when each impression is treated as a trial.", numbers: "$100$ impressions with $p=0.03$ have expected clicks $3$ and variance $2.91$." },
      { title: "A/B conversions", background: "Experiments compare conversion counts across treatment groups of fixed size.", numbers: "$n=200$, $p=0.1$ gives expected conversions $20$." },
      { title: "Reliability testing", background: "Manufacturing and software quality often count how many units pass a fixed test suite.", numbers: "$10$ independent checks with pass probability $0.95$ all pass with probability $0.95^{10} approx 0.599$." },
      { title: "Mini-batch class counts", background: "Training batches randomly sample examples; class counts can be approximately binomial.", numbers: "In batch size $32$ with class probability $0.25$, expected class count is $8$." },
      { title: "Polling", background: "Survey counts of yes responses are modeled binomially under simple random sampling.", numbers: "$n=1000$, $p=0.52$ gives mean $520$ and standard deviation $sqrt(249.6) approx 15.8$." },
      { title: "Dropout kept units", background: "Each unit may be kept independently during dropout training.", numbers: "With $50$ units and keep probability $0.8$, expected kept units are $40$ and variance $8$." }
    ],
    applicationsClose: "Whenever fixed independent yes-or-no trials become a count, the binomial distribution is the natural first model.",
    takeaways: [
      "Binomial counts successes in fixed independent Bernoulli trials.",
      "$P(X=k)=C(n,k)p^k(1-p)^{n-k}$.",
      "Its mean is $np$ and variance is $np(1-p)$.",
      "The assumptions of fixed $n$, common $p$, and independence are essential."
    ]
  },

  "math-17-19": {
    id: "math-17-19",
    title: "The Poisson distribution",
    tagline: "Poisson models counts of rare events over a fixed window when the average rate is known.",
    connections: {
      buildsOn: ["The binomial distribution", "Exponential functions", "Expected value"],
      leadsTo: ["The exponential distribution", "Poisson processes", "count models"],
      usedWith: ["rates", "rare-event approximations", "independence", "factorials"]
    },
    motivation:
      "<p>Some counts do not come from a clear fixed number of trials. How many requests arrive in a second? How many typos appear on a page? How many failures happen in a day?</p>" +
      "<p>The <b>Poisson distribution</b> models counts in a fixed window using one number, the average rate $lambda$. It is especially useful when many tiny opportunities each have small chance of producing an event.</p>",
    definition:
      "<p>A random variable $X$ has a Poisson distribution with rate $lambda>0$ if $P(X=k)=e^{-lambda}lambda^k/k!$ for $k=0,1,2,...$. Its mean and variance are both $lambda$.</p>" +
      "<p>The formula can be seen as a rare-event limit of binomial counts: let $n$ be large, $p$ small, and $np=lambda$ fixed. The many combinations and small probabilities settle into $e^{-lambda}lambda^k/k!$.</p>" +
      "<p><b>Assumptions that matter:</b> events are counted in a fixed window, the average rate is stable, events occur independently enough for the model, and two events do not pile up at exactly the same tiny instant in the ideal model.</p>",
    worked: {
      problem: "A server averages $lambda=2$ errors per hour. Under a Poisson model, find the probability of exactly $3$ errors in an hour.",
      skills: ["Poisson formula", "factorials", "rates"],
      strategy: "Use the count formula with $k=3$ and keep the exponential factor attached.",
      steps: [
        { do: "Identify the rate and count", result: "$lambda=2$, $k=3$", why: "we count errors in one hour" },
        { do: "Write the formula", result: "$P(X=3)=e^{-2}2^3/3!$", why: "use the Poisson probability mass function" },
        { do: "Compute the power", result: "$2^3=8$", why: "three counted events" },
        { do: "Compute the factorial", result: "$3!=6$", why: "factorial adjusts for event order" },
        { do: "Simplify the coefficient", result: "$P(X=3)=(8/6)e^{-2}$", why: "combine non-exponential terms" },
        { do: "Approximate", result: "$P(X=3) approx 0.180$", why: "$e^{-2} approx 0.1353$" }
      ],
      verify: "With average 2, seeing 3 errors is quite plausible, and a probability around 18 percent is reasonable.",
      answer: "$P(X=3)=e^{-2}8/6 approx 0.180$.",
      connects: "Poisson turns a rate into probabilities for whole-number counts."
    },
    practice: [
      { problem: "For $lambda=4$, find $P(X=0)$.", steps: [
        { do: "Set $k=0$", result: "$P(X=0)=e^{-4}4^0/0!$", why: "zero events are requested" },
        { do: "Simplify the power", result: "$4^0=1$", why: "nonzero numbers to the zero power equal 1" },
        { do: "Simplify the factorial", result: "$0!=1$", why: "by factorial convention" },
        { do: "Reduce the expression", result: "$P(X=0)=e^{-4}$", why: "only the no-event exponential remains" },
        { do: "Approximate", result: "$e^{-4} approx 0.0183$", why: "zero events is rare when the mean is 4" }
      ], answer: "$P(X=0)=e^{-4} approx 0.0183$." },
      { problem: "For $lambda=3$, find $P(X=1)$.", steps: [
        { do: "Write the probability", result: "$P(X=1)=e^{-3}3^1/1!$", why: "use the Poisson formula" },
        { do: "Simplify the power", result: "$3^1=3$", why: "one event contributes one factor of 3" },
        { do: "Simplify the factorial", result: "$1!=1$", why: "one item has one order" },
        { do: "Reduce the expression", result: "$P(X=1)=3e^{-3}$", why: "combine constants" },
        { do: "Approximate", result: "$P(X=1) approx 0.149$", why: "$e^{-3} approx 0.0498$" }
      ], answer: "$P(X=1) approx 0.149$." },
      { problem: "If requests arrive at average $6$ per minute, what are the mean and variance of the one-minute count?", steps: [
        { do: "Identify the rate", result: "$lambda=6$", why: "the window is one minute" },
        { do: "Use the Poisson mean", result: "$E[X]=lambda$", why: "Poisson mean equals its rate" },
        { do: "Substitute the rate", result: "$E[X]=6$", why: "average count per minute" },
        { do: "Use the Poisson variance", result: "$Var(X)=lambda$", why: "Poisson variance also equals its rate" },
        { do: "Substitute the rate", result: "$Var(X)=6$", why: "same parameter controls spread" }
      ], answer: "Mean $6$, variance $6$." },
      { problem: "A rate is $2$ events per hour. Find the Poisson rate for $30$ minutes and $P(X=0)$ in that half hour.", steps: [
        { do: "Convert the time window", result: "$30$ minutes $=0.5$ hour", why: "rate is per hour" },
        { do: "Scale the rate", result: "$lambda=2(0.5)=1$", why: "expected count scales with window length" },
        { do: "Write the zero-count probability", result: "$P(X=0)=e^{-1}1^0/0!$", why: "use $k=0$" },
        { do: "Simplify", result: "$P(X=0)=e^{-1}$", why: "the power and factorial are 1" },
        { do: "Approximate", result: "$P(X=0) approx 0.368$", why: "$e^{-1}$ is about 0.368" }
      ], answer: "Half-hour rate $lambda=1$ and $P(X=0) approx 0.368$." },
      { problem: "A page has an average of $0.4$ typos. Find the probability of at least one typo.", steps: [
        { do: "Use the complement", result: "$P(X>=1)=1-P(X=0)$", why: "at least one is easier through zero" },
        { do: "Compute the zero probability", result: "$P(X=0)=e^{-0.4}$", why: "Poisson zero-count formula" },
        { do: "Approximate the exponential", result: "$e^{-0.4} approx 0.6703$", why: "use a calculator value" },
        { do: "Subtract from one", result: "$P(X>=1)=1-0.6703$", why: "take the complement" },
        { do: "Simplify", result: "$P(X>=1) approx 0.3297$", why: "about one third of pages have a typo" }
      ], answer: "The probability is about $0.330$." }
    ],
    applications: [
      { title: "Web request counts", background: "Traffic engineering often models arrivals per short interval as Poisson when rates are stable.", numbers: "At $12$ requests per second, the expected count in $0.25$ seconds is $lambda=3$." },
      { title: "Rare error monitoring", background: "Operations teams count incidents or exceptions over time windows.", numbers: "With $lambda=0.5$ errors per hour, no errors in an hour has probability $e^{-0.5}=0.607$." },
      { title: "Text typos", background: "Classical Poisson examples include printing errors across pages.", numbers: "Average $0.2$ typos per page gives $P(at least one)=1-e^{-0.2}=0.181$." },
      { title: "Click counts at low probability", background: "For many impressions with tiny click probability, binomial counts can be approximated by Poisson.", numbers: "$n=1000$, $p=0.002$ gives $lambda=2$, so $P(0) approx e^{-2}=0.135$." },
      { title: "Biology event counts", background: "Mutation and particle counts are often modeled by rates over regions or time.", numbers: "If expected mutations in a segment are $1.5$, variance is also $1.5$." },
      { title: "Queue arrivals", background: "Poisson arrivals are a foundation of queueing theory.", numbers: "At $5$ arrivals per minute, a two-minute window has $lambda=10$." }
    ],
    applicationsClose: "Poisson is the rate-to-count bridge for rare clicks, errors, arrivals, typos, and other windowed events.",
    takeaways: [
      "$P(X=k)=e^{-lambda}lambda^k/k!$ for counts $k=0,1,2,...$.",
      "Poisson mean and variance are both $lambda$.",
      "Rates scale with the size of the time or space window.",
      "It often approximates binomial counts when $n$ is large and $p$ is small."
    ]
  },

  "math-17-20": {
    id: "math-17-20",
    title: "The geometric distribution",
    tagline: "Geometric measures how long you wait until the first success.",
    connections: {
      buildsOn: ["The Bernoulli distribution", "independence", "infinite series"],
      leadsTo: ["The exponential distribution", "survival functions", "negative binomial models"],
      usedWith: ["waiting times", "memorylessness", "failure probabilities", "sample paths"]
    },
    motivation:
      "<p>Sometimes the count is not successes in a fixed batch, but the waiting time until success arrives. How many tries until a test passes? How many impressions until the first click?</p>" +
      "<p>The <b>geometric distribution</b> is the discrete waiting-time model for repeated independent Bernoulli trials with the same success probability.</p>",
    definition:
      "<p>Using the common trial-count convention, $X$ has a geometric distribution with parameter $p$ if $X$ is the trial number of the first success. Then $P(X=k)=(1-p)^{k-1}p$ for $k=1,2,3,...$. Its mean is $1/p$ and variance is $(1-p)/p^2$.</p>" +
      "<p>The probability formula says: fail $k-1$ times, then succeed once. The memoryless property says $P(X>s+t | X>s)=P(X>t)$, because after $s$ failures the remaining independent trials look fresh.</p>" +
      "<p><b>Assumptions that matter:</b> trials are independent, $p$ stays constant, this convention counts the success trial itself, and a different convention may count failures before first success instead.</p>",
    worked: {
      problem: "A model deployment check passes each run with probability $0.25$. Find the probability the first pass occurs on run $4$ and the expected run number.",
      skills: ["geometric formula", "waiting time", "mean"],
      strategy: "First pass on run 4 means three failures followed by one success.",
      steps: [
        { do: "Identify the parameter", result: "$p=0.25$", why: "pass is the success event" },
        { do: "Compute failure probability", result: "$1-p=0.75$", why: "failure is the complement" },
        { do: "Write the probability", result: "$P(X=4)=0.75^3(0.25)$", why: "three failures, then success" },
        { do: "Compute the power", result: "$0.75^3=0.421875$", why: "multiply three failures" },
        { do: "Multiply by success probability", result: "$P(X=4)=0.10546875$", why: "finish with the fourth-run pass" },
        { do: "Compute the mean", result: "$E[X]=1/0.25=4$", why: "geometric mean under trial-count convention" }
      ],
      verify: "A one-in-four success rate makes an average wait of four runs intuitive; first success exactly on run four has probability about 10.5 percent.",
      answer: "$P(X=4) approx 0.1055$ and $E[X]=4$.",
      connects: "Geometric counts the waiting time created by repeated Bernoulli trials."
    },
    practice: [
      { problem: "For $p=0.5$, find $P(X=3)$ under the first-success trial-count convention.", steps: [
        { do: "Compute failure probability", result: "$1-p=0.5$", why: "failure and success are equally likely" },
        { do: "Write the formula", result: "$P(X=3)=(0.5)^{2}(0.5)$", why: "two failures before the third-trial success" },
        { do: "Compute the failure product", result: "$(0.5)^2=0.25$", why: "two independent failures" },
        { do: "Multiply by success", result: "$0.25(0.5)=0.125$", why: "the third trial succeeds" },
        { do: "State the probability", result: "$P(X=3)=0.125$", why: "one exact sequence is fail, fail, success" }
      ], answer: "$0.125$." },
      { problem: "For $p=0.2$, find the expected trial number and variance.", steps: [
        { do: "Use the mean formula", result: "$E[X]=1/p$", why: "trial-count geometric mean" },
        { do: "Substitute $p=0.2$", result: "$E[X]=5$", why: "$1/0.2=5$" },
        { do: "Use the variance formula", result: "$Var(X)=(1-p)/p^2$", why: "standard geometric variance" },
        { do: "Substitute values", result: "$Var(X)=0.8/0.2^2$", why: "failure probability is $0.8$" },
        { do: "Simplify", result: "$Var(X)=20$", why: "$0.8/0.04=20$" }
      ], answer: "Mean $5$, variance $20$." },
      { problem: "With success probability $0.1$, find the probability that success takes more than $3$ trials.", steps: [
        { do: "Translate the event", result: "$X>3$ means first three trials fail", why: "success has not appeared by trial 3" },
        { do: "Compute failure probability", result: "$1-p=0.9$", why: "success probability is $0.1$" },
        { do: "Write the survival probability", result: "$P(X>3)=0.9^3$", why: "three independent failures" },
        { do: "Compute the power", result: "$0.9^3=0.729$", why: "multiply three failure probabilities" },
        { do: "Interpret", result: "about $72.9 percent$", why: "rare success often requires waiting" }
      ], answer: "$P(X>3)=0.729$." },
      { problem: "If $P(X=1)=0.3$ for a geometric variable, find $P(X=2)$ and $P(X=3)$.", steps: [
        { do: "Identify $p$", result: "$p=0.3$", why: "first success on trial 1 has probability $p$" },
        { do: "Compute failure probability", result: "$1-p=0.7$", why: "the trial either succeeds or fails" },
        { do: "Compute $P(X=2)$", result: "$0.7(0.3)=0.21$", why: "fail once, then succeed" },
        { do: "Compute $P(X=3)$", result: "$0.7^2(0.3)$", why: "fail twice, then succeed" },
        { do: "Simplify $P(X=3)$", result: "$0.147$", why: "$0.49 times 0.3=0.147$" }
      ], answer: "$P(X=2)=0.21$ and $P(X=3)=0.147$." },
      { problem: "A user clicks an ad with probability $0.04$ per independent impression. Estimate the expected impression number of the first click and $P(X<=2)$.", steps: [
        { do: "Compute expected wait", result: "$E[X]=1/0.04=25$", why: "geometric mean is reciprocal success probability" },
        { do: "Use complement for $P(X<=2)$", result: "$P(X<=2)=1-P(X>2)$", why: "at least one click in two impressions" },
        { do: "Compute no click probability for two impressions", result: "$P(X>2)=0.96^2$", why: "first two impressions fail" },
        { do: "Square", result: "$0.96^2=0.9216$", why: "two independent no-clicks" },
        { do: "Subtract", result: "$P(X<=2)=0.0784$", why: "one minus no click in two impressions" }
      ], answer: "Expected first click is impression $25$; $P(X<=2)=0.0784$." }
    ],
    applications: [
      { title: "Retries until success", background: "Distributed systems often retry operations until one succeeds.", numbers: "With success probability $0.8$, expected attempts are $1/0.8=1.25$." },
      { title: "First click waiting time", background: "Ad systems may ask how many impressions precede the first click.", numbers: "At $p=0.02$, expected first-click impression is $50$." },
      { title: "Quality-control testing", background: "A factory may test items until a defective one is found, or until a good one appears.", numbers: "If defect probability is $0.01$, expected wait for first defect is $100$ items." },
      { title: "Randomized algorithms", background: "Some algorithms repeat a randomized attempt until it succeeds.", numbers: "If each attempt succeeds with $0.25$, probability of success within $3$ tries is $1-0.75^3=0.578$." },
      { title: "Memoryless modeling", background: "The geometric distribution is the discrete model where past failures do not change the future chance.", numbers: "With $p=0.4$, after five failures the chance the next trial succeeds is still $0.4$." },
      { title: "Data collection", background: "Researchers sometimes sample until finding the first positive example.", numbers: "If positives are $5 percent$, expected samples to first positive are $20$." }
    ],
    applicationsClose: "Geometric waiting times appear anywhere independent repeated attempts continue until the first success.",
    takeaways: [
      "Geometric counts the trial number of the first success under this convention.",
      "$P(X=k)=(1-p)^{k-1}p$.",
      "Mean is $1/p$ and variance is $(1-p)/p^2$.",
      "Its memoryless property is the discrete cousin of the exponential distribution."
    ]
  },

  "math-17-21": {
    id: "math-17-21",
    title: "The uniform distribution",
    tagline: "Uniform distributions make every allowed outcome equally likely, either across a list or across an interval.",
    connections: {
      buildsOn: ["random variables", "probability density", "Expected value"],
      leadsTo: ["The exponential distribution", "simulation", "Monte Carlo methods"],
      usedWith: ["intervals", "symmetry", "random sampling", "quantiles"]
    },
    motivation:
      "<p>Sometimes fairness is the model: a die has equally likely faces, a random number generator chooses evenly from $0$ to $1$, or a shuffle gives each position the same chance.</p>" +
      "<p>The <b>uniform distribution</b> is the probability model for equal likelihood over an allowed set. It is simple, but it powers simulation, random initialization, and many probability transformations.</p>",
    definition:
      "<p>For a continuous uniform random variable on $[a,b]$, the density is $f(x)=1/(b-a)$ for $a<=x<=b$ and $0$ otherwise. Probabilities are lengths divided by total length: $P(c<=X<=d)=(d-c)/(b-a)$ when $[c,d]$ lies inside $[a,b]$.</p>" +
      "<p>The mean is $(a+b)/2$ by symmetry, and the variance is $(b-a)^2/12$. For a discrete uniform distribution over $n$ equally likely values, each value has probability $1/n$.</p>" +
      "<p><b>Assumptions that matter:</b> continuous uniform probability at any exact point is $0$; probability comes from interval length; the density must integrate to $1$; and equal density over an interval is different from equal probability over infinitely many individual points.</p>",
    worked: {
      problem: "Let $X$ be uniform on $[2,8]$. Find the density, mean, variance, and $P(3<=X<=5)$.",
      skills: ["continuous uniform", "density", "interval probability"],
      strategy: "Use interval length: the whole interval has length 6, and subinterval probabilities are length ratios.",
      steps: [
        { do: "Compute total length", result: "$8-2=6$", why: "uniform density spreads mass over this interval" },
        { do: "Find the density", result: "$f(x)=1/6$ on $[2,8]$", why: "density times total length must equal 1" },
        { do: "Compute the mean", result: "$(2+8)/2=5$", why: "the midpoint balances the interval" },
        { do: "Compute the variance", result: "$(8-2)^2/12=36/12=3$", why: "use the continuous uniform variance formula" },
        { do: "Compute subinterval length", result: "$5-3=2$", why: "probability is proportional to length" },
        { do: "Divide by total length", result: "$P(3<=X<=5)=2/6=1/3$", why: "two favorable units out of six" }
      ],
      verify: "The density $1/6$ over length 6 gives total probability 1, and the requested interval is one third of the full length.",
      answer: "$f(x)=1/6$, mean $5$, variance $3$, and $P(3<=X<=5)=1/3$.",
      connects: "Uniform probability is geometry: favorable length over total length."
    },
    practice: [
      { problem: "A die roll is discrete uniform on $1,2,3,4,5,6$. Find $P(X=4)$ and $P(X>=5)$.", steps: [
        { do: "Count outcomes", result: "$6$", why: "a standard die has six faces" },
        { do: "Assign each probability", result: "$1/6$", why: "discrete uniform means equal probabilities" },
        { do: "Find $P(X=4)$", result: "$1/6$", why: "one favorable face" },
        { do: "Count outcomes at least 5", result: "$2$", why: "faces 5 and 6 qualify" },
        { do: "Compute the probability", result: "$2/6=1/3$", why: "favorable over total" }
      ], answer: "$P(X=4)=1/6$ and $P(X>=5)=1/3$." },
      { problem: "For $X$ uniform on $[0,1]$, find $P(0.2<=X<=0.7)$.", steps: [
        { do: "Compute total length", result: "$1-0=1$", why: "the full unit interval has length 1" },
        { do: "Compute favorable length", result: "$0.7-0.2=0.5$", why: "probability comes from interval length" },
        { do: "Divide lengths", result: "$0.5/1=0.5$", why: "favorable length over total length" },
        { do: "Check endpoints", result: "including endpoints changes nothing", why: "single points have probability 0 in a continuous model" },
        { do: "State the probability", result: "$0.5$", why: "half the unit interval is covered" }
      ], answer: "$0.5$." },
      { problem: "For $X$ uniform on $[-3,3]$, find the mean and variance.", steps: [
        { do: "Compute the midpoint", result: "$(-3+3)/2=0$", why: "the interval is symmetric around zero" },
        { do: "Compute interval length", result: "$3-(-3)=6$", why: "variance depends on width" },
        { do: "Square the length", result: "$6^2=36$", why: "variance uses squared distance" },
        { do: "Divide by 12", result: "$36/12=3$", why: "continuous uniform variance formula" },
        { do: "State both values", result: "mean $0$, variance $3$", why: "center and spread are now computed" }
      ], answer: "Mean $0$, variance $3$." },
      { problem: "A random integer is chosen uniformly from $10$ through $19$ inclusive. Find the probability it is even.", steps: [
        { do: "Count total integers", result: "$10$", why: "the list is 10 through 19" },
        { do: "List even integers", result: "$10,12,14,16,18$", why: "these are divisible by 2" },
        { do: "Count favorable integers", result: "$5$", why: "there are five evens" },
        { do: "Compute probability", result: "$5/10=0.5$", why: "discrete uniform uses favorable over total" },
        { do: "Interpret", result: "half", why: "evens and odds are balanced in this range" }
      ], answer: "The probability is $0.5$." },
      { problem: "Weights are initialized uniformly on $[-0.1,0.1]$. Find the density and probability a weight lies between $-0.02$ and $0.02$.", steps: [
        { do: "Compute total length", result: "$0.1-(-0.1)=0.2$", why: "the initialization interval width" },
        { do: "Find density", result: "$1/0.2=5$", why: "density times length equals 1" },
        { do: "Compute favorable length", result: "$0.02-(-0.02)=0.04$", why: "the near-zero interval width" },
        { do: "Divide by total length", result: "$0.04/0.2=0.2$", why: "probability is length ratio" },
        { do: "Check using density", result: "$5(0.04)=0.2$", why: "density times favorable length agrees" }
      ], answer: "Density is $5$ and the probability is $0.2$." }
    ],
    applications: [
      { title: "Random number generators", background: "Most simulation begins with numbers designed to look uniform on $[0,1]$.", numbers: "The chance a generated value lies in $[0.1,0.4]$ is $0.3$." },
      { title: "Monte Carlo sampling", background: "Monte Carlo methods estimate averages by drawing random samples, often starting from uniform draws.", numbers: "If $10000$ uniform draws estimate an area $0.27$, about $2700$ land in the target region." },
      { title: "Weight initialization", background: "Neural networks often start weights from a small symmetric uniform range.", numbers: "Uniform $[-0.05,0.05]$ has mean $0$ and variance $0.1^2/12=0.000833$." },
      { title: "Hashing", background: "A good hash spreads keys approximately uniformly across buckets.", numbers: "With $1000$ keys and $10$ buckets, expected keys per bucket are $100$." },
      { title: "Randomized experiments", background: "Assignment to treatment often uses uniform random numbers for fairness.", numbers: "Assign treatment if $U<0.5$; then probability of treatment is $0.5$." },
      { title: "Quantization noise", background: "Small rounding errors are sometimes modeled as uniform within one half-step.", numbers: "Uniform error on $[-0.5,0.5]$ has variance $1/12=0.0833$." }
    ],
    applicationsClose: "Uniform distributions express fairness by length or count, then support simulation, initialization, hashing, experiments, and noise models.",
    takeaways: [
      "Continuous uniform probability is interval length divided by total length.",
      "Uniform $[a,b]$ has mean $(a+b)/2$ and variance $(b-a)^2/12$.",
      "Exact points have probability $0$ in a continuous uniform distribution.",
      "Discrete uniform assigns equal mass to each listed outcome."
    ]
  },

  "math-17-22": {
    id: "math-17-22",
    title: "The exponential distribution",
    tagline: "Exponential is the continuous waiting-time model with a constant event rate.",
    connections: {
      buildsOn: ["The Poisson distribution", "Exponential functions", "continuous random variables"],
      leadsTo: ["survival analysis", "Gamma distributions", "Poisson processes"],
      usedWith: ["rates", "memorylessness", "hazard functions", "waiting times"]
    },
    motivation:
      "<p>The geometric distribution waits through discrete attempts. But many waits happen in continuous time: time until the next request, failure, click, or radioactive decay.</p>" +
      "<p>The <b>exponential distribution</b> is the continuous waiting-time companion to Poisson counts. If events arrive at a steady rate, the time to the next event is exponential.</p>",
    definition:
      "<p>A random variable $T$ has an exponential distribution with rate $lambda>0$ if its density is $f(t)=lambda e^{-lambda t}$ for $t>=0$. Its cumulative probability is $P(T<=t)=1-e^{-lambda t}$, its survival probability is $P(T>t)=e^{-lambda t}$, its mean is $1/lambda$, and its variance is $1/lambda^2$.</p>" +
      "<p>The survival formula matches Poisson zero counts: waiting more than $t$ means no event occurred in time $t$, and a Poisson process with rate $lambda$ has $P(0 events)=e^{-lambda t}$.</p>" +
      "<p><b>Assumptions that matter:</b> the event rate is constant, waiting time is nonnegative, the memoryless property relies on the ideal exponential model, and $lambda$ is a rate per unit time.</p>",
    worked: {
      problem: "Requests arrive at rate $lambda=0.5$ per second. Find the mean wait and the probability the next request arrives within $3$ seconds.",
      skills: ["exponential rate", "CDF", "mean waiting time"],
      strategy: "Use reciprocal rate for the mean and $1-e^{-lambda t}$ for arrival by time $t$.",
      steps: [
        { do: "Identify the rate", result: "$lambda=0.5$", why: "the rate is per second" },
        { do: "Compute the mean", result: "$E[T]=1/0.5=2$ seconds", why: "exponential mean is reciprocal rate" },
        { do: "Write the CDF at $3$", result: "$P(T<=3)=1-e^{-0.5(3)}$", why: "arrival within time $3$" },
        { do: "Multiply in the exponent", result: "$1-e^{-1.5}$", why: "$0.5 times 3=1.5$" },
        { do: "Approximate the exponential", result: "$e^{-1.5} approx 0.223$", why: "calculator value" },
        { do: "Subtract", result: "$P(T<=3) approx 0.777$", why: "one minus survival beyond 3 seconds" }
      ],
      verify: "Since 3 seconds is longer than the mean wait of 2 seconds, a probability above one half is sensible.",
      answer: "Mean wait is $2$ seconds and $P(T<=3) approx 0.777$.",
      connects: "Exponential waiting time is Poisson no-event probability viewed continuously."
    },
    practice: [
      { problem: "For rate $lambda=2$ per minute, find the mean and variance.", steps: [
        { do: "Use the mean formula", result: "$E[T]=1/lambda$", why: "exponential mean is reciprocal rate" },
        { do: "Substitute $lambda=2$", result: "$E[T]=1/2=0.5$ minutes", why: "two events per minute means half a minute average wait" },
        { do: "Use the variance formula", result: "$Var(T)=1/lambda^2$", why: "standard exponential variance" },
        { do: "Substitute the rate", result: "$Var(T)=1/2^2$", why: "$lambda^2=4$" },
        { do: "Simplify", result: "$Var(T)=0.25$ square minutes", why: "reciprocal of 4" }
      ], answer: "Mean $0.5$ minutes, variance $0.25$ square minutes." },
      { problem: "For $lambda=1.5$, find $P(T>2)$.", steps: [
        { do: "Write the survival formula", result: "$P(T>t)=e^{-lambda t}$", why: "exponential survival" },
        { do: "Substitute values", result: "$P(T>2)=e^{-1.5(2)}$", why: "$t=2$" },
        { do: "Multiply the exponent", result: "$e^{-3}$", why: "$1.5 times 2=3$" },
        { do: "Approximate", result: "$e^{-3} approx 0.0498$", why: "calculator value" },
        { do: "Interpret", result: "about $5 percent$", why: "two time units is long at rate 1.5" }
      ], answer: "$P(T>2) approx 0.0498$." },
      { problem: "For $lambda=0.25$ per hour, find $P(T<=4)$.", steps: [
        { do: "Write the CDF", result: "$P(T<=4)=1-e^{-0.25(4)}$", why: "probability event has arrived by 4 hours" },
        { do: "Multiply the exponent", result: "$1-e^{-1}$", why: "$0.25 times 4=1$" },
        { do: "Approximate survival", result: "$e^{-1} approx 0.368$", why: "standard exponential value" },
        { do: "Subtract", result: "$1-0.368=0.632$", why: "arrival by 4 hours is complement of waiting longer" },
        { do: "State probability", result: "$0.632$", why: "about 63.2 percent" }
      ], answer: "$P(T<=4) approx 0.632$." },
      { problem: "If the mean waiting time is $10$ seconds, find $lambda$ and $P(T>5)$.", steps: [
        { do: "Use mean-rate relation", result: "$1/lambda=10$", why: "mean is reciprocal rate" },
        { do: "Solve for the rate", result: "$lambda=0.1$ per second", why: "take reciprocal" },
        { do: "Write survival at 5", result: "$P(T>5)=e^{-0.1(5)}$", why: "use exponential survival" },
        { do: "Simplify exponent", result: "$e^{-0.5}$", why: "$0.1 times 5=0.5$" },
        { do: "Approximate", result: "$0.607$", why: "$e^{-0.5} approx 0.607$" }
      ], answer: "$lambda=0.1$ per second and $P(T>5) approx 0.607$." },
      { problem: "A service has rate $3$ failures per year. Under an exponential model, find the probability the next failure occurs after $0.5$ years.", steps: [
        { do: "Identify parameters", result: "$lambda=3$, $t=0.5$", why: "rate is per year and time is years" },
        { do: "Use survival", result: "$P(T>0.5)=e^{-3(0.5)}$", why: "after 0.5 years means no failure yet" },
        { do: "Multiply exponent", result: "$e^{-1.5}$", why: "$3 times 0.5=1.5$" },
        { do: "Approximate", result: "$0.223$", why: "calculator value" },
        { do: "Interpret", result: "about $22.3 percent$", why: "average wait is only one third of a year" }
      ], answer: "$P(T>0.5) approx 0.223$." }
    ],
    applications: [
      { title: "Time to next request", background: "Queueing models often use exponential waits between Poisson arrivals.", numbers: "At $5$ requests per second, mean wait is $0.2$ seconds." },
      { title: "Reliability lifetimes", background: "A constant failure rate gives exponential time to failure.", numbers: "Failure rate $0.01$ per hour gives mean lifetime $100$ hours." },
      { title: "Survival analysis", background: "Medical and product survival models often begin with exponential baselines.", numbers: "If $lambda=0.2$ per month, survival beyond $6$ months is $e^{-1.2}=0.301$." },
      { title: "Timeout settings", background: "Systems choose timeouts based on wait-time probabilities.", numbers: "With mean wait $2$ seconds, $lambda=0.5$ and $P(T>5)=e^{-2.5}=0.082$." },
      { title: "Simulation", background: "Poisson process simulations generate interarrival times from exponential distributions.", numbers: "A uniform draw $u=0.8$ can produce wait $-ln(0.8)/lambda$; with $lambda=2$, wait is about $0.112$." },
      { title: "Memoryless service", background: "The exponential model says an old wait has no extra aging information.", numbers: "With $lambda=1$, $P(T>5 | T>3)=P(T>2)=e^{-2}=0.135$." }
    ],
    applicationsClose: "Exponential waiting times are the continuous-time partner of Poisson counts, from queues to reliability to simulation.",
    takeaways: [
      "Exponential density is $lambda e^{-lambda t}$ for $t>=0$.",
      "Mean is $1/lambda$ and variance is $1/lambda^2$.",
      "Survival is $P(T>t)=e^{-lambda t}$.",
      "It is memoryless under the constant-rate model."
    ]
  },

  "math-17-23": {
    id: "math-17-23",
    title: "The Gaussian distribution",
    tagline: "The Gaussian is the bell-shaped model for accumulated small variation.",
    connections: {
      buildsOn: ["Expected value", "Variance", "continuous random variables"],
      leadsTo: ["central limit theorem", "linear regression noise", "Bayesian inference"],
      usedWith: ["standardization", "z-scores", "quadratic forms", "confidence intervals"]
    },
    motivation:
      "<p>You have seen averages, spreads, and common distributions. The Gaussian, or normal distribution, appears when many small independent influences add together: measurement noise, averaged errors, heights, embeddings after normalization, and more.</p>" +
      "<p>Its bell shape is not magic. It is the stable footprint of additive variation, controlled by a mean for location and a variance for spread.</p>",
    definition:
      "<p>A Gaussian random variable $X$ with mean $mu$ and variance $sigma^2$ is written $X ~ N(mu,sigma^2)$. Its density is centered at $mu$, symmetric, and has spread controlled by $sigma$. The standard normal is $Z ~ N(0,1)$.</p>" +
      "<p>Standardization turns any Gaussian into a standard normal: $Z=(X-mu)/sigma$. This works because subtracting $mu$ shifts the center to $0$, and dividing by $sigma$ rescales the spread to $1$.</p>" +
      "<p><b>Assumptions that matter:</b> Gaussian variables are continuous; exact point probabilities are $0$; the mean and variance fully determine a one-dimensional Gaussian; and normal approximations are strongest when many small independent effects accumulate.</p>",
    worked: {
      problem: "Suppose test scores are $X ~ N(70,10^2)$. Find the z-score for $85$ and estimate $P(X<=85)$ using $P(Z<=1.5) approx 0.9332$.",
      skills: ["normal distribution", "standardization", "z-scores"],
      strategy: "Convert the raw score into standard-deviation units, then read the standard normal probability.",
      steps: [
        { do: "Identify mean and standard deviation", result: "$mu=70$, $sigma=10$", why: "variance is $10^2$" },
        { do: "Write the z-score formula", result: "$z=(x-mu)/sigma$", why: "standardization centers and scales" },
        { do: "Substitute $x=85$", result: "$z=(85-70)/10$", why: "measure 85 relative to the mean" },
        { do: "Simplify", result: "$z=1.5$", why: "$15/10=1.5$" },
        { do: "Use the given table value", result: "$P(X<=85)=P(Z<=1.5) approx 0.9332$", why: "standardized probabilities match" }
      ],
      verify: "A score 1.5 standard deviations above the mean should exceed most observations, so a cumulative probability near 93 percent is sensible.",
      answer: "The z-score is $1.5$ and $P(X<=85) approx 0.9332$.",
      connects: "Gaussian calculations usually begin by translating raw values into z-scores."
    },
    practice: [
      { problem: "For $X ~ N(50,5^2)$, find the z-score of $60$.", steps: [
        { do: "Identify parameters", result: "$mu=50$, $sigma=5$", why: "variance is $5^2$" },
        { do: "Write the formula", result: "$z=(x-mu)/sigma$", why: "z-score measures standard deviations from mean" },
        { do: "Substitute $x=60$", result: "$z=(60-50)/5$", why: "compare 60 to the center" },
        { do: "Subtract", result: "$10/5$", why: "$60-50=10$" },
        { do: "Divide", result: "$z=2$", why: "60 is two standard deviations above the mean" }
      ], answer: "$z=2$." },
      { problem: "If $Z ~ N(0,1)$ and $P(Z<=1.0)=0.8413$, find $P(Z>1.0)$.", steps: [
        { do: "Use the complement", result: "$P(Z>1)=1-P(Z<=1)$", why: "above and at-or-below cover all outcomes" },
        { do: "Substitute the table value", result: "$1-0.8413$", why: "given cumulative probability" },
        { do: "Subtract", result: "$0.1587$", why: "remaining right tail" },
        { do: "Check reasonableness", result: "less than $0.5$", why: "one standard deviation above the mean is in the upper tail" },
        { do: "State the tail probability", result: "$P(Z>1)=0.1587$", why: "complement is complete" }
      ], answer: "$0.1587$." },
      { problem: "For $X ~ N(100,15^2)$, convert $x=70$ to a z-score.", steps: [
        { do: "Identify parameters", result: "$mu=100$, $sigma=15$", why: "standard deviation is 15" },
        { do: "Write standardization", result: "$z=(70-100)/15$", why: "subtract the mean and divide by standard deviation" },
        { do: "Subtract", result: "$-30/15$", why: "70 is below the mean" },
        { do: "Divide", result: "$z=-2$", why: "$-30 divided by 15=-2$" },
        { do: "Interpret", result: "two standard deviations below the mean", why: "negative z-scores are below center" }
      ], answer: "$z=-2$." },
      { problem: "A Gaussian has mean $3$ and standard deviation $2$. What interval is within two standard deviations of the mean?", steps: [
        { do: "Compute two standard deviations", result: "$2sigma=2(2)=4$", why: "two standard deviations means twice the spread" },
        { do: "Find the lower endpoint", result: "$3-4=-1$", why: "move left from the mean" },
        { do: "Find the upper endpoint", result: "$3+4=7$", why: "move right from the mean" },
        { do: "Write the interval", result: "$[-1,7]$", why: "include values within that distance" },
        { do: "Interpret", result: "about $95 percent$ for a normal model", why: "empirical rule approximation" }
      ], answer: "The interval is $[-1,7]$." },
      { problem: "Model residuals are $N(0,4)$. Find the standard deviation and z-score for residual $3$.", steps: [
        { do: "Read the variance", result: "$sigma^2=4$", why: "the second parameter is variance" },
        { do: "Take the square root", result: "$sigma=2$", why: "standard deviation is square root of variance" },
        { do: "Write the z-score", result: "$z=(3-0)/2$", why: "mean residual is zero" },
        { do: "Simplify", result: "$z=1.5$", why: "$3/2=1.5$" },
        { do: "Interpret", result: "the residual is moderately high", why: "it is 1.5 standard deviations above zero" }
      ], answer: "Standard deviation $2$ and z-score $1.5$." }
    ],
    applications: [
      { title: "Measurement noise", background: "Many instruments have small additive errors from many sources, leading to near-Gaussian noise.", numbers: "If noise is $N(0,2^2)$, an error of $4$ has z-score $2$." },
      { title: "Linear regression errors", background: "Classical regression often assumes Gaussian residuals to derive likelihoods and intervals.", numbers: "Residual $-3$ with $sigma=1.5$ has z-score $-2$." },
      { title: "Averaging and the central limit effect", background: "Averages of many independent observations often become approximately normal.", numbers: "If individual variance is $25$, the average of $100$ has variance $25/100=0.25$." },
      { title: "Anomaly detection", background: "Z-scores flag values unusually far from typical behavior.", numbers: "Mean latency $100$ ms, standard deviation $10$ ms, observation $140$ ms gives z-score $4$." },
      { title: "Bayesian priors", background: "Gaussian priors are common because they are smooth and algebraically convenient.", numbers: "A weight prior $N(0,1)$ treats weight $2$ as two standard deviations from zero." },
      { title: "Embedding normalization checks", background: "Large batches of normalized features are often monitored using approximate Gaussian summaries.", numbers: "Feature mean $0.1$, standard deviation $0.5$, value $1.1$ gives z-score $2$." }
    ],
    applicationsClose: "Gaussian thinking is standardization thinking: center, scale, and reason in standard-deviation units.",
    takeaways: [
      "$X ~ N(mu,sigma^2)$ is centered at $mu$ with spread $sigma$.",
      "Standardization uses $Z=(X-mu)/sigma$.",
      "Point probabilities are zero; intervals carry probability.",
      "Gaussian models often arise from many small additive effects."
    ]
  },

  "math-17-24": {
    id: "math-17-24",
    title: "The Beta and Gamma distributions",
    tagline: "Beta models uncertain probabilities, while Gamma models positive amounts and waiting times.",
    connections: {
      buildsOn: ["continuous random variables", "The exponential distribution", "Expected value"],
      leadsTo: ["Bayesian inference", "conjugate priors", "probabilistic modeling"],
      usedWith: ["positive variables", "proportions", "shape parameters", "rates"]
    },
    motivation:
      "<p>Some random quantities must stay between $0$ and $1$, like a click probability. Others must be positive, like a waiting time, variance, or rate. Ordinary bell curves can spill outside those boundaries.</p>" +
      "<p>The <b>Beta</b> and <b>Gamma</b> distributions respect those shapes. Beta lives on $[0,1]$ and is natural for probabilities. Gamma lives on positive numbers and is natural for accumulated waiting or positive scale.</p>",
    definition:
      "<p>A Beta distribution with parameters $alpha>0$ and $beta>0$ lives on $0<=X<=1$ and has mean $alpha/(alpha+beta)$. Its parameters can be read like success and failure strength. A Gamma distribution with shape $k>0$ and rate $lambda>0$ lives on $x>=0$ and has mean $k/lambda$ and variance $k/lambda^2$.</p>" +
      "<p>Exponential is the Gamma special case with shape $k=1$. When $k$ is a positive integer, Gamma can represent the waiting time until the $k$th event in a Poisson process with rate $lambda$.</p>" +
      "<p><b>Assumptions that matter:</b> parameterization varies across books, especially Gamma rate versus scale; Beta parameters must be positive; Gamma values are nonnegative; and these distributions are chosen because their support matches the quantity being modeled.</p>",
    worked: {
      problem: "A Beta prior has $alpha=8$, $beta=2$. A Gamma model has shape $k=3$ and rate $lambda=2$. Find both means and the Gamma variance.",
      skills: ["Beta mean", "Gamma mean", "Gamma variance"],
      strategy: "Use the support-aware formulas: Beta mean is a ratio of strengths; Gamma mean and variance use rate powers.",
      steps: [
        { do: "Compute the Beta denominator", result: "$alpha+beta=8+2=10$", why: "total strength combines success and failure parameters" },
        { do: "Compute the Beta mean", result: "$8/10=0.8$", why: "Beta mean is $alpha/(alpha+beta)$" },
        { do: "Compute the Gamma mean", result: "$k/lambda=3/2=1.5$", why: "rate parameterization uses division by rate" },
        { do: "Compute the squared rate", result: "$lambda^2=2^2=4$", why: "Gamma variance divides by squared rate" },
        { do: "Compute the Gamma variance", result: "$k/lambda^2=3/4=0.75$", why: "substitute shape and rate" }
      ],
      verify: "The Beta mean $0.8$ lies between 0 and 1, and the Gamma mean and variance are positive.",
      answer: "Beta mean $0.8$; Gamma mean $1.5$ and variance $0.75$.",
      connects: "Beta and Gamma match the natural boundaries of probabilities and positive quantities."
    },
    practice: [
      { problem: "Find the mean of $Beta(2,3)$.", steps: [
        { do: "Identify parameters", result: "$alpha=2$, $beta=3$", why: "read from $Beta(alpha,beta)$" },
        { do: "Add parameters", result: "$alpha+beta=5$", why: "total strength is denominator" },
        { do: "Write the mean formula", result: "$alpha/(alpha+beta)$", why: "standard Beta mean" },
        { do: "Substitute values", result: "$2/5$", why: "use the two parameters" },
        { do: "Convert to decimal", result: "$0.4$", why: "two fifths is 0.4" }
      ], answer: "The mean is $0.4$." },
      { problem: "Find the mean and variance of a Gamma distribution with shape $4$ and rate $2$.", steps: [
        { do: "Identify parameters", result: "$k=4$, $lambda=2$", why: "shape and rate are given" },
        { do: "Compute mean", result: "$k/lambda=4/2=2$", why: "Gamma mean under rate parameterization" },
        { do: "Square the rate", result: "$lambda^2=4$", why: "variance uses squared rate" },
        { do: "Compute variance", result: "$k/lambda^2=4/4=1$", why: "substitute values" },
        { do: "Check positivity", result: "mean $2$, variance $1$", why: "Gamma quantities must be positive" }
      ], answer: "Mean $2$, variance $1$." },
      { problem: "A Beta model starts with $alpha=1$, $beta=1$. After $6$ successes and $4$ failures, update the parameters and mean.", steps: [
        { do: "Add successes to alpha", result: "$alpha=1+6=7$", why: "Beta-Bernoulli updating adds successes" },
        { do: "Add failures to beta", result: "$beta=1+4=5$", why: "failures strengthen the beta parameter" },
        { do: "Add updated parameters", result: "$7+5=12$", why: "denominator for the posterior mean" },
        { do: "Compute the updated mean", result: "$7/12$", why: "Beta mean is $alpha/(alpha+beta)$" },
        { do: "Approximate", result: "$0.583$", why: "posterior mean smooths the observed $0.6$ rate" }
      ], answer: "Updated distribution is $Beta(7,5)$ with mean about $0.583$." },
      { problem: "An exponential distribution with rate $3$ is a Gamma distribution with what shape, mean, and variance?", steps: [
        { do: "Use the special case", result: "$k=1$", why: "exponential is Gamma with shape 1" },
        { do: "Keep the rate", result: "$lambda=3$", why: "the exponential rate becomes Gamma rate" },
        { do: "Compute mean", result: "$1/3$", why: "$k/lambda=1/3$" },
        { do: "Compute variance", result: "$1/9$", why: "$k/lambda^2=1/3^2$" },
        { do: "State the Gamma form", result: "$Gamma(k=1,lambda=3)$", why: "same waiting-time distribution" }
      ], answer: "Shape $1$, mean $1/3$, variance $1/9$." },
      { problem: "A click-rate prior is $Beta(20,80)$. Find its mean and interpret the total strength.", steps: [
        { do: "Add parameters", result: "$20+80=100$", why: "total strength acts like prior sample size" },
        { do: "Compute mean", result: "$20/100=0.2$", why: "Beta mean is success strength over total" },
        { do: "Identify success strength", result: "$20$", why: "alpha contributes toward clicks" },
        { do: "Identify failure strength", result: "$80$", why: "beta contributes toward non-clicks" },
        { do: "Interpret", result: "prior rate $20 percent$ with strength $100$", why: "the prior is fairly concentrated around 0.2" }
      ], answer: "Mean $0.2$ with total strength $100$." }
    ],
    applications: [
      { title: "Bayesian click-rate priors", background: "Beta distributions are common priors for unknown Bernoulli probabilities.", numbers: "$Beta(3,7)$ has mean $3/10=0.3$." },
      { title: "A/B smoothing", background: "Small experiments can have noisy observed rates; Beta priors smooth them.", numbers: "Prior $Beta(1,1)$ plus $2$ successes and $8$ failures gives $Beta(3,9)$, mean $0.25$." },
      { title: "Waiting for several events", background: "Gamma models time until the $k$th Poisson event.", numbers: "For $k=5$, rate $2$ per hour, expected wait is $5/2=2.5$ hours." },
      { title: "Positive scale parameters", background: "Bayesian models often need priors on positive quantities like rates or variances.", numbers: "Gamma shape $2$, rate $0.5$ has mean $4$ and variance $8$." },
      { title: "Reliability testing", background: "Accumulated lifetime before several failures can be modeled with Gamma waiting times.", numbers: "Rate $0.1$ failures per day, wait for $3$ failures has mean $30$ days." },
      { title: "Thompson sampling", background: "Bandit algorithms sample possible click rates from Beta posteriors to balance exploration and exploitation.", numbers: "Arm A $Beta(8,2)$ mean $0.8$; arm B $Beta(3,3)$ mean $0.5$." }
    ],
    applicationsClose: "Beta keeps probabilities inside $[0,1]$; Gamma keeps positive times and rates positive, making both natural modeling tools.",
    takeaways: [
      "Beta distributions live on $[0,1]$ and are natural for probabilities.",
      "Beta mean is $alpha/(alpha+beta)$.",
      "Gamma distributions live on nonnegative values and model positive amounts or waiting times.",
      "Gamma shape-rate mean is $k/lambda$ and variance is $k/lambda^2$."
    ]
  },

  "math-17-25": {
    id: "math-17-25",
    title: "Joint distributions",
    tagline: "A joint distribution describes how random variables behave together, not just one at a time.",
    connections: {
      buildsOn: ["random variables", "probability rules", "Expected value"],
      leadsTo: ["Marginal distributions", "Conditional distributions", "covariance"],
      usedWith: ["tables", "independence", "correlation", "multivariate models"]
    },
    motivation:
      "<p>ML rarely studies one variable alone. A user may have age and click behavior; an image has many pixels; a model output and a true label appear together.</p>" +
      "<p>A <b>joint distribution</b> is the full probability story for multiple variables at once. It tells which combinations are likely, and it is the source from which marginals, conditionals, covariance, and independence are read.</p>",
    definition:
      "<p>For discrete variables $X$ and $Y$, the joint distribution assigns probabilities $P(X=x,Y=y)$ to pairs of values. All joint probabilities are nonnegative and sum to $1$. For continuous variables, a joint density integrates over regions to give probabilities.</p>" +
      "<p>Independence is a special factorization: $X$ and $Y$ are independent if $P(X=x,Y=y)=P(X=x)P(Y=y)$ for all pairs. If the joint does not factor this way, the variables carry information about each other.</p>" +
      "<p><b>Assumptions that matter:</b> every pair probability belongs to the same sample space; rows and columns must cover all possible values being modeled; independence is not assumed unless checked; and joint probabilities must sum or integrate to $1$.</p>",
    worked: {
      problem: "A joint table has $P(X=0,Y=0)=0.30$, $P(0,1)=0.20$, $P(1,0)=0.10$, and $P(1,1)=0.40$. Find $P(X=1,Y=1)$, $P(X=1)$, $P(Y=1)$, and check whether $X$ and $Y$ are independent.",
      skills: ["joint tables", "marginal sums", "independence check"],
      strategy: "Read the joint cell, sum rows and columns for marginals, then compare product to joint.",
      steps: [
        { do: "Read the joint success cell", result: "$P(X=1,Y=1)=0.40$", why: "the table gives pair probabilities directly" },
        { do: "Sum the row for $X=1$", result: "$P(X=1)=0.10+0.40=0.50$", why: "include both possible $Y$ values" },
        { do: "Sum the column for $Y=1$", result: "$P(Y=1)=0.20+0.40=0.60$", why: "include both possible $X$ values" },
        { do: "Compute the product of marginals", result: "$0.50(0.60)=0.30$", why: "independence would require this product" },
        { do: "Compare with the joint cell", result: "$0.40 != 0.30$", why: "one mismatch disproves independence" }
      ],
      verify: "The four probabilities sum to $1.00$, so the table is valid; the dependence conclusion comes from the failed factorization.",
      answer: "$P(1,1)=0.40$, $P(X=1)=0.50$, $P(Y=1)=0.60$, and the variables are not independent.",
      connects: "The joint table is the source of both individual and relationship information."
    },
    practice: [
      { problem: "A joint table has probabilities $0.1,0.2,0.3,0.4$ across four cells. Check whether it is valid.", steps: [
        { do: "Check nonnegativity", result: "all entries are nonnegative", why: "probabilities cannot be negative" },
        { do: "Add the first two entries", result: "$0.1+0.2=0.3$", why: "start summing total mass" },
        { do: "Add the third entry", result: "$0.3+0.3=0.6$", why: "continue the total" },
        { do: "Add the fourth entry", result: "$0.6+0.4=1.0$", why: "all cells are included" },
        { do: "Conclude validity", result: "valid joint distribution", why: "entries are nonnegative and sum to 1" }
      ], answer: "It is valid." },
      { problem: "For the table $P(0,0)=0.25$, $P(0,1)=0.25$, $P(1,0)=0.25$, $P(1,1)=0.25$, find $P(X=1,Y=0)$ and $P(X=1)$.", steps: [
        { do: "Read the requested joint cell", result: "$P(X=1,Y=0)=0.25$", why: "it is given directly" },
        { do: "Identify cells with $X=1$", result: "$(1,0)$ and $(1,1)$", why: "sum over all $Y$ values" },
        { do: "Add those cells", result: "$0.25+0.25=0.50$", why: "marginal probability ignores $Y$" },
        { do: "State the marginal", result: "$P(X=1)=0.50$", why: "half the mass has $X=1$" },
        { do: "Check total symmetry", result: "each cell is equal", why: "the table is uniform over pairs" }
      ], answer: "$P(X=1,Y=0)=0.25$ and $P(X=1)=0.50$." },
      { problem: "Given $P(X=1)=0.4$, $P(Y=1)=0.5$, and independence, find $P(X=1,Y=1)$.", steps: [
        { do: "Write the independence rule", result: "$P(X=1,Y=1)=P(X=1)P(Y=1)$", why: "independent joint probabilities factor" },
        { do: "Substitute marginals", result: "$0.4(0.5)$", why: "use the given probabilities" },
        { do: "Multiply", result: "$0.20$", why: "four tenths of one half" },
        { do: "Check range", result: "$0.20$ is between $0$ and $1$", why: "valid probability" },
        { do: "Interpret", result: "both events occur with probability $20 percent$", why: "independence allows multiplication" }
      ], answer: "$0.20$." },
      { problem: "A joint table has $P(0,0)=0.4$, $P(0,1)=0.1$, $P(1,0)=0.2$, $P(1,1)=0.3$. Find $P(Y=0)$.", steps: [
        { do: "Identify cells with $Y=0$", result: "$(0,0)$ and $(1,0)$", why: "the $X$ value can be either 0 or 1" },
        { do: "Read their probabilities", result: "$0.4$ and $0.2$", why: "from the joint table" },
        { do: "Add them", result: "$0.4+0.2=0.6$", why: "marginalize over $X$" },
        { do: "State the marginal", result: "$P(Y=0)=0.6$", why: "total mass in the $Y=0$ column" },
        { do: "Check complement", result: "$P(Y=1)=0.1+0.3=0.4$", why: "marginals for $Y$ should sum to 1" }
      ], answer: "$P(Y=0)=0.6$." },
      { problem: "A classifier and label have $P(pred=1,label=1)=0.35$, $P(1,0)=0.15$, $P(0,1)=0.10$, $P(0,0)=0.40$. Find the probability the prediction matches the label.", steps: [
        { do: "Identify matching cells", result: "$(1,1)$ and $(0,0)$", why: "prediction equals label in these cells" },
        { do: "Read matching probabilities", result: "$0.35$ and $0.40$", why: "from the joint table" },
        { do: "Add matching mass", result: "$0.35+0.40=0.75$", why: "either correct-positive or correct-negative" },
        { do: "Check mismatch mass", result: "$0.15+0.10=0.25$", why: "the remaining probability is error" },
        { do: "Check total", result: "$0.75+0.25=1$", why: "matches and mismatches partition outcomes" }
      ], answer: "The match probability is $0.75$." }
    ],
    applications: [
      { title: "Confusion matrices", background: "Classification evaluation is a joint distribution over predicted and true labels.", numbers: "Cells $0.35,0.15,0.10,0.40$ give accuracy $0.35+0.40=0.75$." },
      { title: "Feature-label relationships", background: "A joint distribution shows how a feature and label co-occur.", numbers: "If $P(feature=1,label=1)=0.30$ but $P(feature=1)P(label=1)=0.20$, they are dependent." },
      { title: "Recommendation events", background: "Systems track joint behavior such as viewed and clicked.", numbers: "$P(view=1,click=1)=0.04$ means four percent of impressions were both viewed and clicked." },
      { title: "Fairness auditing", background: "Audits examine joint distributions of decisions and groups.", numbers: "If $P(approve=1,group=A)=0.18$ and $P(group=A)=0.30$, later conditionals can compare approval rates." },
      { title: "Multivariate sensors", background: "Joint distributions capture relationships among sensor readings.", numbers: "If high temperature and high vibration occur together with probability $0.08$, that cell may matter more than either marginal." },
      { title: "Language models", background: "Co-occurrence tables are joint distributions over neighboring tokens before smoothing and modeling.", numbers: "If $P(word1=deep, word2=learning)=0.002$, the pair has two-tenths of a percent mass." }
    ],
    applicationsClose: "Joint distributions are the full map of co-occurrence, from model evaluation to fairness, sensors, and language.",
    takeaways: [
      "A joint distribution assigns probability to combinations of variable values.",
      "Discrete joint probabilities must be nonnegative and sum to $1$.",
      "Marginals and conditionals are derived from the joint.",
      "Independence requires joint probabilities to factor into marginal products."
    ]
  },

  "math-17-26": {
    id: "math-17-26",
    title: "Marginal distributions",
    tagline: "Marginalization lets one variable step forward by summing or integrating out the others.",
    connections: {
      buildsOn: ["Joint distributions", "sums of probabilities", "probability density"],
      leadsTo: ["Conditional distributions", "law of total probability", "Bayesian inference"],
      usedWith: ["joint tables", "latent variables", "mixture models", "integrals"]
    },
    motivation:
      "<p>A joint distribution tells the whole story, but sometimes you need one character's solo line. If you know probabilities for age and click together, you may still ask: what is the overall click probability?</p>" +
      "<p><b>Marginal distributions</b> answer by summing or integrating over the variables you are not focusing on. The word comes from old tables where row and column totals were written in the margins.</p>",
    definition:
      "<p>For discrete variables, the marginal distribution of $X$ is found by summing the joint distribution over all values of $Y$: $P(X=x)=sum_y P(X=x,Y=y)$. For continuous variables with joint density $f(x,y)$, the marginal density is found by integrating out $y$.</p>" +
      "<p>This is the law of total probability in table form. The event $X=x$ can happen together with exactly one of the possible $Y$ values, so the disjoint joint pieces add up to the total probability for $X=x$.</p>" +
      "<p><b>Assumptions that matter:</b> the values summed over must cover all possibilities for the removed variable; continuous variables require integration rather than point sums; and marginalization loses dependence information even though it preserves the single-variable distribution.</p>",
    worked: {
      problem: "A joint table has $P(X=0,Y=0)=0.15$, $P(0,1)=0.35$, $P(1,0)=0.25$, $P(1,1)=0.25$. Find the marginal distributions of $X$ and $Y$.",
      skills: ["marginalization", "joint tables", "row and column sums"],
      strategy: "Sum across rows for $X$ and down columns for $Y$.",
      steps: [
        { do: "Sum cells with $X=0$", result: "$P(X=0)=0.15+0.35=0.50$", why: "include all $Y$ values" },
        { do: "Sum cells with $X=1$", result: "$P(X=1)=0.25+0.25=0.50$", why: "again sum over $Y$" },
        { do: "Sum cells with $Y=0$", result: "$P(Y=0)=0.15+0.25=0.40$", why: "include all $X$ values" },
        { do: "Sum cells with $Y=1$", result: "$P(Y=1)=0.35+0.25=0.60$", why: "sum the second column" },
        { do: "Check totals", result: "$0.50+0.50=1$ and $0.40+0.60=1$", why: "each marginal distribution must sum to 1" }
      ],
      verify: "Both marginal distributions are valid, and all four joint cells were used exactly once in each set of totals.",
      answer: "$X$ marginal: $0.50,0.50$; $Y$ marginal: $0.40,0.60$.",
      connects: "Marginalization turns a joint table into single-variable distributions."
    },
    practice: [
      { problem: "For $P(0,0)=0.2$, $P(0,1)=0.1$, $P(1,0)=0.3$, $P(1,1)=0.4$, find $P(X=1)$.", steps: [
        { do: "Identify cells with $X=1$", result: "$(1,0)$ and $(1,1)$", why: "all $Y$ values are allowed" },
        { do: "Read probabilities", result: "$0.3$ and $0.4$", why: "from the joint table" },
        { do: "Add them", result: "$0.3+0.4=0.7$", why: "sum out $Y$" },
        { do: "State marginal", result: "$P(X=1)=0.7$", why: "this is the total mass for $X=1$" },
        { do: "Check complement", result: "$P(X=0)=0.2+0.1=0.3$", why: "$0.7+0.3=1$" }
      ], answer: "$P(X=1)=0.7$." },
      { problem: "A joint table over $Y=0,1,2$ has row for $X=0$: $0.1,0.2,0.1$ and row for $X=1$: $0.2,0.1,0.3$. Find the marginal of $Y=2$.", steps: [
        { do: "Identify cells with $Y=2$", result: "$(X=0,Y=2)$ and $(X=1,Y=2)$", why: "sum over $X$" },
        { do: "Read probabilities", result: "$0.1$ and $0.3$", why: "from the two rows" },
        { do: "Add them", result: "$0.1+0.3=0.4$", why: "marginalize out $X$" },
        { do: "State marginal", result: "$P(Y=2)=0.4$", why: "total probability for that $Y$ value" },
        { do: "Check table total", result: "$0.1+0.2+0.1+0.2+0.1+0.3=1.0$", why: "the joint table is valid" }
      ], answer: "$P(Y=2)=0.4$." },
      { problem: "If $P(X=0)=0.6$ and $P(X=1)=0.4$, is this enough to know the joint distribution with $Y$?", steps: [
        { do: "Identify what is known", result: "only the marginal of $X$", why: "probabilities for $Y$ and pairs are not given" },
        { do: "Recall marginalization", result: "$P(X=x)=sum_y P(X=x,Y=y)$", why: "many joint tables can produce the same sums" },
        { do: "Construct one possible split for $X=0$", result: "$0.3+0.3=0.6$", why: "one joint row could split evenly" },
        { do: "Construct another possible split for $X=0$", result: "$0.5+0.1=0.6$", why: "a different joint row has the same marginal" },
        { do: "Conclude", result: "not enough information", why: "marginals lose dependence structure" }
      ], answer: "No. A marginal alone does not determine the joint distribution." },
      { problem: "A latent group $Z$ has $P(Z=A)=0.7$, $P(click=1 | A)=0.1$, $P(Z=B)=0.3$, $P(click=1 | B)=0.4$. Find the marginal click probability.", steps: [
        { do: "Write total probability", result: "$P(click)=P(click|A)P(A)+P(click|B)P(B)$", why: "sum over latent groups" },
        { do: "Substitute values", result: "$0.1(0.7)+0.4(0.3)$", why: "use group rates and group masses" },
        { do: "Multiply terms", result: "$0.07+0.12$", why: "compute each group's contribution" },
        { do: "Add contributions", result: "$0.19$", why: "marginal click probability sums over groups" },
        { do: "Interpret", result: "$19 percent$", why: "overall rate blends the two segments" }
      ], answer: "The marginal click probability is $0.19$." },
      { problem: "A joint density is constant $2$ on rectangle $0<=x<=1$, $0<=y<=0.5$. Find the marginal density of $X$ on $[0,1]$.", steps: [
        { do: "Write the marginal integral", result: "$f_X(x)=integral from 0 to 0.5 of 2 dy$", why: "integrate out $Y$" },
        { do: "Integrate the constant", result: "$2y$ from $0$ to $0.5$", why: "antiderivative of 2 with respect to $y$" },
        { do: "Evaluate endpoints", result: "$2(0.5)-2(0)=1$", why: "use the vertical length" },
        { do: "State support", result: "$f_X(x)=1$ for $0<=x<=1$", why: "outside this interval density is zero" },
        { do: "Check normalization", result: "area under $f_X$ is $1(1)=1$", why: "valid marginal density" }
      ], answer: "$f_X(x)=1$ on $[0,1]$ and $0$ otherwise." }
    ],
    applications: [
      { title: "Overall click rate from segments", background: "Product metrics often combine segment-specific behavior into one marginal rate.", numbers: "Rates $0.05$ and $0.20$ with weights $0.8$ and $0.2$ give $0.08$." },
      { title: "Latent variable models", background: "Mixture models hide a component label and marginalize it out to describe observed data.", numbers: "Component means $0$ and $10$ with weights $0.7$ and $0.3$ give marginal mean $3$." },
      { title: "Confusion matrix label rates", background: "Summing a confusion matrix column gives true label frequency.", numbers: "True positive $0.30$ plus false negative $0.10$ gives $P(label=1)=0.40$." },
      { title: "Missing data summaries", background: "A joint table of feature value and missingness can be marginalized to get the missing rate.", numbers: "Missing cells $0.04$ and $0.06$ across groups sum to missing probability $0.10$." },
      { title: "Probabilistic graphical models", background: "Inference in graphical models repeatedly sums out variables not being queried.", numbers: "If two hidden states contribute $0.12$ and $0.18$ to an observation, its marginal probability is $0.30$." },
      { title: "Monte Carlo integration", background: "Sampling can approximate marginalization when exact sums or integrals are hard.", numbers: "Average conditional probabilities $0.1,0.2,0.4,0.3$ gives marginal estimate $0.25$." }
    ],
    applicationsClose: "Marginalization is the art of summing away what you are not asking about while preserving the probability of what remains.",
    takeaways: [
      "A marginal distribution comes from a joint distribution by summing or integrating out other variables.",
      "Row and column totals are discrete marginals.",
      "Marginalization is the law of total probability in action.",
      "Marginals do not preserve all dependence information from the joint."
    ]
  },

  "math-17-27": {
    id: "math-17-27",
    title: "Conditional distributions",
    tagline: "A conditional distribution updates the probability story after you are told what is already true.",
    connections: {
      buildsOn: ["Joint distributions", "Marginal distributions", "Bayes' rule"],
      leadsTo: ["Bayesian inference", "Markov chains", "conditional expectation"],
      usedWith: ["joint tables", "likelihood", "independence", "posterior distributions"]
    },
    motivation:
      "<p>Information changes probability. A click is more likely after a view; a disease is more likely after a positive test; a label is more likely after seeing certain features.</p>" +
      "<p>A <b>conditional distribution</b> is the distribution that remains after we restrict attention to cases where some event or variable value is known. It is probability with context included.</p>",
    definition:
      "<p>For events or discrete variables, $P(X=x | Y=y)=P(X=x,Y=y)/P(Y=y)$ when $P(Y=y)>0$. The denominator renormalizes the slice where $Y=y$ so probabilities within that slice sum to $1$.</p>" +
      "<p>Bayes' rule follows by writing the same joint probability two ways: $P(X,Y)=P(X|Y)P(Y)=P(Y|X)P(X)$. Solving gives $P(X|Y)=P(Y|X)P(X)/P(Y)$.</p>" +
      "<p><b>Assumptions that matter:</b> the conditioning event must have positive probability in the discrete case; conditionals depend on what information is known; independence means conditioning does not change the distribution; and continuous conditioning uses densities rather than point probabilities.</p>",
    worked: {
      problem: "A joint table has $P(X=1,Y=1)=0.24$, $P(X=0,Y=1)=0.16$, $P(X=1,Y=0)=0.36$, $P(X=0,Y=0)=0.24$. Find $P(X=1 | Y=1)$.",
      skills: ["conditional probability", "joint tables", "normalization"],
      strategy: "Restrict to the $Y=1$ slice, then divide the desired cell by the slice total.",
      steps: [
        { do: "Find the $Y=1$ slice total", result: "$P(Y=1)=0.24+0.16=0.40$", why: "sum both $X$ values with $Y=1$" },
        { do: "Read the desired joint cell", result: "$P(X=1,Y=1)=0.24$", why: "this is the part of the slice where $X=1$" },
        { do: "Write the conditional formula", result: "$P(X=1|Y=1)=0.24/0.40$", why: "divide joint cell by conditioning probability" },
        { do: "Divide", result: "$0.60$", why: "$24/40=0.6$" },
        { do: "Check the companion conditional", result: "$P(X=0|Y=1)=0.16/0.40=0.40$", why: "conditionals inside the slice should sum to 1" }
      ],
      verify: "$0.60+0.40=1$, so the conditional distribution over $X$ given $Y=1$ is normalized.",
      answer: "$P(X=1 | Y=1)=0.60$.",
      connects: "Conditional probability is a renormalized slice of the joint distribution."
    },
    practice: [
      { problem: "If $P(A and B)=0.12$ and $P(B)=0.30$, find $P(A|B)$.", steps: [
        { do: "Write the formula", result: "$P(A|B)=P(A and B)/P(B)$", why: "conditional probability divides by the known event" },
        { do: "Substitute values", result: "$0.12/0.30$", why: "use the joint and conditioning probabilities" },
        { do: "Divide", result: "$0.40$", why: "$12/30=0.4$" },
        { do: "Check denominator", result: "$0.30>0$", why: "conditioning event must be possible" },
        { do: "Interpret", result: "$40 percent$", why: "within event $B$, two fifths also have $A$" }
      ], answer: "$P(A|B)=0.40$." },
      { problem: "A table has $P(X=0,Y=0)=0.2$, $P(1,0)=0.3$, $P(0,1)=0.1$, $P(1,1)=0.4$. Find $P(Y=1|X=1)$.", steps: [
        { do: "Find the $X=1$ total", result: "$P(X=1)=0.3+0.4=0.7$", why: "sum over both $Y$ values" },
        { do: "Read desired joint cell", result: "$P(X=1,Y=1)=0.4$", why: "both conditions are true" },
        { do: "Write the conditional", result: "$P(Y=1|X=1)=0.4/0.7$", why: "renormalize the $X=1$ row" },
        { do: "Divide", result: "$0.5714$", why: "four sevenths is about 0.5714" },
        { do: "Check companion", result: "$P(Y=0|X=1)=0.3/0.7=0.4286$", why: "the two conditionals sum to 1" }
      ], answer: "$P(Y=1|X=1) approx 0.5714$." },
      { problem: "If $P(A)=0.2$, $P(B|A)=0.7$, and $P(B)=0.5$, find $P(A|B)$.", steps: [
        { do: "Write Bayes' rule", result: "$P(A|B)=P(B|A)P(A)/P(B)$", why: "reverse the conditioning" },
        { do: "Substitute values", result: "$0.7(0.2)/0.5$", why: "use likelihood, prior, and evidence" },
        { do: "Multiply numerator", result: "$0.14/0.5$", why: "$0.7 times 0.2=0.14$" },
        { do: "Divide", result: "$0.28$", why: "$0.14/0.5=0.28$" },
        { do: "Interpret", result: "posterior probability $28 percent$", why: "observing $B$ raises or lowers belief according to the likelihood" }
      ], answer: "$P(A|B)=0.28$." },
      { problem: "Check independence if $P(A)=0.4$ and $P(A|B)=0.4$ with $P(B)>0$.", steps: [
        { do: "Recall independence condition", result: "$P(A|B)=P(A)$", why: "conditioning on $B$ does not change $A$" },
        { do: "Compare the values", result: "$0.4=0.4$", why: "the conditional equals the marginal" },
        { do: "State implication for this event", result: "$A$ is independent of $B$ by this check", why: "for two events, equality with positive $P(B)$ is enough" },
        { do: "Compute joint if needed", result: "$P(A and B)=0.4P(B)$", why: "multiply both sides by $P(B)$" },
        { do: "Interpret", result: "knowing $B$ gives no change in probability of $A$", why: "that is the meaning of independence" }
      ], answer: "Yes, this equality indicates independence for the two events." },
      { problem: "A spam filter has $P(spam)=0.1$, $P(flag|spam)=0.9$, and $P(flag|not spam)=0.2$. Find $P(spam|flag)$.", steps: [
        { do: "Compute non-spam probability", result: "$P(not spam)=0.9$", why: "complement of spam" },
        { do: "Compute flag probability", result: "$P(flag)=0.9(0.1)+0.2(0.9)$", why: "law of total probability over spam status" },
        { do: "Simplify evidence", result: "$P(flag)=0.09+0.18=0.27$", why: "add spam and non-spam flag contributions" },
        { do: "Write Bayes' rule", result: "$P(spam|flag)=0.9(0.1)/0.27$", why: "posterior equals likelihood times prior divided by evidence" },
        { do: "Divide", result: "$0.333$", why: "$0.09/0.27=1/3$" }
      ], answer: "$P(spam|flag) approx 0.333$." }
    ],
    applications: [
      { title: "Bayesian diagnosis", background: "Medical testing is a classic conditional-probability setting because base rates matter.", numbers: "Prior $0.01$, sensitivity $0.99$, false positive $0.05$ gives evidence $0.0594$ and posterior $0.0099/0.0594=0.167$." },
      { title: "Spam filtering", background: "Filters update belief in spam after seeing words or model flags.", numbers: "If $P(spam)=0.1$, $P(flag|spam)=0.9$, $P(flag)=0.27$, then $P(spam|flag)=0.333$." },
      { title: "Recommendation after a view", background: "Click probability changes after conditioning on whether an item was viewed.", numbers: "$P(click,view)=0.04$ and $P(view)=0.5$ give $P(click|view)=0.08$." },
      { title: "Model calibration by segment", background: "Conditional distributions compare outcomes inside groups or score buckets.", numbers: "In a bucket with $200$ examples and $30$ positives, observed conditional positive rate is $0.15$." },
      { title: "Markov chains", background: "A Markov chain is built from conditional probabilities of the next state given the current state.", numbers: "If $P(next=B | current=A)=0.3$, then among $1000$ visits to $A$ expect about $300$ moves to $B$." },
      { title: "Naive Bayes", background: "Naive Bayes classifiers combine conditional feature likelihoods with class priors.", numbers: "Class prior $0.4$ times likelihoods $0.5$ and $0.2$ gives unnormalized score $0.04$." }
    ],
    applicationsClose: "Conditioning is the math of learning from context: slice the joint story, renormalize, and reason with the information you now have.",
    takeaways: [
      "$P(X=x|Y=y)=P(X=x,Y=y)/P(Y=y)$ when the denominator is positive.",
      "A conditional distribution is a normalized slice of a joint distribution.",
      "Bayes' rule reverses conditioning using likelihood, prior, and evidence.",
      "Independence means conditioning does not change the probability distribution."
    ]
  }
};
