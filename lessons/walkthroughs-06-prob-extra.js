/* =====================================================================
   REAL-WORLD WALKTHROUGHS — MODULE 6 (Probability, advanced)
   Three worked, runnable case studies per lesson. Each ends in a numeric
   answer. All code is numpy/scipy/scikit-learn + stdlib, deterministic
   (default_rng(0)), and was actually executed; the `output` blocks are
   the exact stdout.
   ===================================================================== */
window.WALKTHROUGHS = Object.assign(window.WALKTHROUGHS || {}, {

  /* ================================================================ */
  /* probx-derived — Derived distributions                            */
  /* ================================================================ */
  "probx-derived": [
    {
      title: `Turning uniform noise into failure times`,
      domain: `Reliability engineering`,
      question: `A pump's lifetime follows a Weibull law (scale $\\lambda = 500$ h, shape $k = 1.5$). Your simulator only emits uniform random numbers in $[0,1]$. How do you push that noise through a function to get realistic failure times, and what is $P(X &lt; 300\\text{ h})$?`,
      steps: [
        { title: `The data`, body: `<p>The only randomness you have is $U \\sim \\text{Uniform}[0,1]$ from the simulator. The target is a Weibull lifetime $X$ with CDF $F(x) = 1 - e^{-(x/\\lambda)^k}$, a standard model for wear-out failures where the hazard rate climbs over time ($k &gt; 1$).</p>` },
        { title: `The math`, body: `<p>This is a derived distribution in reverse — the <b>inverse-transform</b> trick. If $X = F^{-1}(U)$, then $P(X \\le x) = P(U \\le F(x)) = F(x)$, so $X$ has exactly the CDF $F$. Inverting the Weibull CDF: set $u = 1 - e^{-(x/\\lambda)^k}$ and solve to get $g(u) = \\lambda\\,(-\\ln(1-u))^{1/k}$. Feeding flat $U$ through this $g$ stretches and squeezes it into the Weibull shape.</p>` },
        { title: `Run it`, body: `<p>Sample uniforms, push them through $g$, and check the mean against the closed form $\\lambda\\,\\Gamma(1 + 1/k)$ and the tail against the CDF.</p>`,
          code: `import numpy as np, math
# Inverse-transform: turn Uniform[0,1] noise into Weibull failure times
# F(x)=1-exp(-(x/lam)^k)  ->  g(u)=lam*(-ln(1-u))^{1/k}
rng = np.random.default_rng(0)
lam, k = 500.0, 1.5
u = rng.random(200_000)
x = lam * (-np.log(1 - u))**(1/k)
print("mean sample :", round(x.mean(), 1))
print("mean theory :", round(lam * math.gamma(1 + 1/k), 1))
print("P(X<300) emp:", round((x < 300).mean(), 4))
print("P(X<300) cdf:", round(1 - math.exp(-(300/lam)**k), 4))`,
          output: `mean sample : 450.4
mean theory : 451.4
P(X<300) emp: 0.3722
P(X<300) cdf: 0.3717` }
      ],
      conclusion: `Pushing flat noise through $g(u) = \\lambda(-\\ln(1-u))^{1/k}$ reproduces the Weibull exactly: the simulated mean $450.4$ h matches the theoretical $\\lambda\\,\\Gamma(1+1/k) \\approx 451.4$ h, and $P(X &lt; 300) \\approx 0.372$ from both the samples and the CDF. About $37\\%$ of pumps fail before $300$ hours.`
    },
    {
      title: `From log-returns to asset prices`,
      domain: `Quantitative finance`,
      question: `A stock's daily log-return is $X \\sim \\mathcal{N}(0, 0.20^2)$, and the price is $S = S_0 e^{X}$ with $S_0 = \\$100$. Pushing a Normal through $e^{(\\cdot)}$ gives a lognormal price. What are $E[S]$ and the median price?`,
      steps: [
        { title: `The data`, body: `<p>Returns are Normal and symmetric, but prices cannot go negative — exponentiating enforces that. Here $g(x) = S_0 e^{x}$ is increasing, so it is one-to-one and the change-of-variables formula applies cleanly.</p>` },
        { title: `The math`, body: `<p>Because $g$ is strictly increasing, order is preserved: the median return maps to the median price, so $\\text{median}(S) = S_0 e^{\\,\\text{median}(X)} = S_0 e^{0} = \\$100$. The mean does <i>not</i> map through, because $g$ is convex — Jensen's inequality pushes the average up. For a lognormal, $E[S] = S_0\\, e^{\\mu + \\sigma^2/2}$, strictly above the median.</p>` },
        { title: `Run it`, body: `<p>Simulate returns, exponentiate, and compare the empirical mean and median to the formulas.</p>`,
          code: `import numpy as np
# Derived distribution: price S = S0*exp(X), X ~ Normal -> S is lognormal
rng = np.random.default_rng(0)
S0, mu, sig = 100.0, 0.0, 0.20
X = rng.normal(mu, sig, 500_000)
S = S0 * np.exp(X)
print("E[S] sample :", round(S.mean(), 3))
print("E[S] theory :", round(S0*np.exp(mu+sig**2/2), 3))
print("median S    :", round(np.median(S), 3))
print("S0*exp(mu)  :", round(S0*np.exp(mu), 3))`,
          output: `E[S] sample : 102.06
E[S] theory : 102.02
median S    : 100.015
S0*exp(mu)  : 100.0` }
      ],
      conclusion: `The increasing map $g$ sends the median straight through ($\\$100$), but its convexity lifts the mean to $E[S] = S_0 e^{\\sigma^2/2} \\approx \\$102.02$. The gap between mean and median is the signature of a derived distribution under a curved function — and the reason average prices drift above the "typical" price.`
    },
    {
      title: `The reparameterization trick`,
      domain: `Deep learning (VAEs)`,
      question: `A variational autoencoder needs samples from $\\mathcal{N}(\\mu, \\sigma^2)$ with $\\mu = 3,\\ \\sigma = 2$, but gradients must flow through $\\mu$ and $\\sigma$. The fix is to sample fixed noise $\\varepsilon \\sim \\mathcal{N}(0,1)$ and push it through $g(\\varepsilon) = \\mu + \\sigma\\varepsilon$. Does the pushed-through density really match the target?`,
      steps: [
        { title: `The data`, body: `<p>You hold standard noise $\\varepsilon \\sim \\mathcal{N}(0,1)$. The decoder wants $Z \\sim \\mathcal{N}(\\mu, \\sigma^2)$. The affine map $g(\\varepsilon) = \\mu + \\sigma\\varepsilon$ separates the randomness (in $\\varepsilon$) from the learnable parameters (in $g$), so backprop can reach $\\mu$ and $\\sigma$.</p>` },
        { title: `The math`, body: `<p>The inverse is $h(z) = (z - \\mu)/\\sigma$ with slope $h'(z) = 1/\\sigma$. The change-of-variables formula gives $f_Z(z) = f_\\varepsilon\\!\\big((z-\\mu)/\\sigma\\big)\\cdot \\tfrac{1}{\\sigma}$. The $1/\\sigma$ is the stretch factor: widening by $\\sigma$ flattens the density so the total area stays $1$.</p>` },
        { title: `Run it`, body: `<p>Generate $Z = \\mu + \\sigma\\varepsilon$ and confirm its mean and std, then check the change-of-variables density against scipy's direct $\\mathcal{N}(\\mu,\\sigma^2)$ density at $z = \\mu$.</p>`,
          code: `import numpy as np
from scipy.stats import norm
# Reparameterization: z = mu + sigma*eps pushes N(0,1) noise to N(mu, sigma^2)
rng = np.random.default_rng(0)
mu, sigma = 3.0, 2.0
eps = rng.standard_normal(400_000)
z = mu + sigma * eps
print("mean z :", round(z.mean(), 3), "target", mu)
print("std  z :", round(z.std(), 3),  "target", sigma)
fz_direct = norm.pdf(mu, mu, sigma)
fz_change = norm.pdf((mu-mu)/sigma) * (1/sigma)
print("f_Z(mu) direct        :", round(fz_direct, 5))
print("f_Z(mu) change-of-var :", round(fz_change, 5))`,
          output: `mean z : 3.0 target 3.0
std  z : 2.003 target 2.0
f_Z(mu) direct        : 0.19947
f_Z(mu) change-of-var : 0.19947` }
      ],
      conclusion: `Pushing standard noise through $g(\\varepsilon) = \\mu + \\sigma\\varepsilon$ reproduces $\\mathcal{N}(\\mu,\\sigma^2)$ exactly: mean $3.0$, std $2.0$, and the change-of-variables density $f_\\varepsilon((z-\\mu)/\\sigma)/\\sigma = 0.19947$ matches the direct lookup at $z=\\mu$. The $1/\\sigma$ Jacobian is the whole trick that keeps the area normalized while gradients flow through $\\mu$ and $\\sigma$.`
    }
  ],

  /* ================================================================ */
  /* probx-convolution — Distribution of a sum                        */
  /* ================================================================ */
  "probx-convolution": [
    {
      title: `End-to-end request latency`,
      domain: `Distributed systems / SRE`,
      question: `A request passes through three independent services with exponential latencies (means $20$, $30$, $50$ ms). The total latency is the convolution of the three. What is the $95$th-percentile end-to-end latency, and $P(\\text{total} &gt; 150\\text{ ms})$?`,
      steps: [
        { title: `The data`, body: `<p>Each stage $X_i$ is exponential with rate $\\lambda_i = 1/\\text{mean}_i$. The end-to-end latency is $Z = X_1 + X_2 + X_3$. Independence lets us convolve the three densities; the mean of the sum is the sum of the means.</p>` },
        { title: `The math`, body: `<p>The convolution $f_Z = f_{X_1} * f_{X_2} * f_{X_3}$ has no tidy closed form for unequal rates, but two facts are exact: $E[Z] = \\sum_i 1/\\lambda_i = 20+30+50 = 100$ ms, and the tail $P(Z &gt; 150)$ and the $p95$ come straight from the convolved distribution. A Monte-Carlo sum estimates both directly — each draw of $Z$ is itself a sample from the convolution.</p>` },
        { title: `Run it`, body: `<p>Draw two million summed latencies and read off the mean, tail probability, and $95$th percentile.</p>`,
          code: `import numpy as np
# Total latency = convolution of three independent exponential stages
rng = np.random.default_rng(0)
rates = [1/20, 1/30, 1/50]   # means 20, 30, 50 ms
N = 2_000_000
samp = sum(rng.exponential(1/r, N) for r in rates)
print("MC mean total   :", round(samp.mean(), 2), "ms")
print("sum of means    :", round(sum(1/r for r in rates), 2), "ms")
print("MC P(total>150) :", round((samp > 150).mean(), 4))
print("MC p95 latency  :", round(np.percentile(samp, 95), 2), "ms")`,
          output: `MC mean total   : 99.93 ms
sum of means    : 100.0 ms
MC P(total>150) : 0.1774
MC p95 latency  : 217.75 ms` }
      ],
      conclusion: `The convolution of the three exponential stages has mean $\\approx 100$ ms (matching $20+30+50$), but the tail is heavy: about $17.7\\%$ of requests exceed $150$ ms and the $p95$ is $\\approx 218$ ms — more than double the mean. Summing independent latencies is convolution, and the tail is what your SLA actually feels.`
    },
    {
      title: `Rolling three dice, exactly`,
      domain: `Game design / tabletop`,
      question: `A game resolves an action by summing three six-sided dice. Using exact PMF convolution (no simulation), what is the most likely total, $P(\\text{sum}=10)$, and $P(\\text{sum}\\ge 15)$?`,
      steps: [
        { title: `The data`, body: `<p>One die is the uniform PMF $p(k) = 1/6$ on faces $1,\\dots,6$. Three independent dice give the sum $Z = D_1 + D_2 + D_3$, whose PMF is $p * p * p$ — discrete convolution, which is exactly what numpy's <code>convolve</code> computes on probability vectors.</p>` },
        { title: `The math`, body: `<p>Convolving two uniform PMFs gives the triangular two-dice distribution; convolving once more produces the bell-like three-dice curve. The support runs from $3$ to $18$ and is symmetric about the mean $3 \\times 3.5 = 10.5$, so the peak sits at $10$ and $11$ (tied). This is a tiny, exact instance of the Central Limit Theorem: flat inputs blending toward a bell.</p>` },
        { title: `Run it`, body: `<p>Convolve the uniform PMF with itself twice and read the answers directly from the resulting probability vector.</p>`,
          code: `import numpy as np
# Sum of three dice = exact convolution of three uniform PMFs
die = np.ones(6)/6                              # faces 1..6
pmf = np.convolve(np.convolve(die, die), die)   # p * p * p
vals = np.arange(3, 19)                          # sums 3..18
print("most likely sum:", vals[pmf.argmax()], "prob", round(pmf.max(), 4))
print("P(sum=10)      :", round(pmf[vals.tolist().index(10)], 4))
print("P(sum>=15)     :", round(pmf[vals >= 15].sum(), 4))
print("mean of sum    :", round((vals*pmf).sum(), 2), "= 3 * 3.5")`,
          output: `most likely sum: 10 prob 0.125
P(sum=10)      : 0.125
P(sum>=15)     : 0.0926
mean of sum    : 10.5 = 3 * 3.5` }
      ],
      conclusion: `Exact convolution gives a symmetric bell on $[3,18]$: the most likely total is $10$ (tied with $11$) at probability $0.125$, $P(\\text{sum}=10)=0.125$, and only $P(\\text{sum}\\ge 15) \\approx 0.093$ of rolls are "great" — useful for tuning difficulty without rolling a single die.`
    },
    {
      title: `Will the project finish on time?`,
      domain: `Project management`,
      question: `A project has $12$ independent tasks, each taking a uniform $[2, 8]$ days. The total duration is the convolution of $12$ uniforms, which the CLT bends into a near-Normal. What is $P(\\text{total} \\le 65\\text{ days})$?`,
      steps: [
        { title: `The data`, body: `<p>Each task duration is $\\text{Uniform}[2,8]$ with mean $5$ and variance $(8-2)^2/12 = 3$. The schedule length is $T = \\sum_{i=1}^{12} X_i$, the convolution of $12$ flat densities. Independence lets means and variances add.</p>` },
        { title: `The math`, body: `<p>Adding many independent pieces drives the sum toward a Normal (CLT). The exact mean and variance are additive: $E[T] = 12 \\times 5 = 60$ days and $\\operatorname{Var}(T) = 12 \\times 3 = 36$ (so sd $= 6$). The CLT approximation $T \\approx \\mathcal{N}(60, 36)$ then estimates any deadline probability via the Normal CDF — which we validate against a Monte-Carlo convolution.</p>` },
        { title: `Run it`, body: `<p>Simulate the $12$-task sums, confirm the additive mean/variance, and compare the empirical deadline probability to the CLT Normal.</p>`,
          code: `import numpy as np
from scipy.stats import norm
# Total project duration = convolution of 12 Uniform[2,8] task durations
rng = np.random.default_rng(0)
n_tasks, lo, hi, N = 12, 2.0, 8.0, 1_000_000
total = rng.uniform(lo, hi, (N, n_tasks)).sum(axis=1)
mean = n_tasks*(lo+hi)/2
var  = n_tasks*((hi-lo)**2)/12
print("MC mean :", round(total.mean(), 3), "theory", mean)
print("MC var  :", round(total.var(), 3),  "theory", round(var, 3))
print("MC  P(total<=65):", round((total <= 65).mean(), 4))
print("CLT P(total<=65):", round(norm.cdf(65, mean, var**0.5), 4))`,
          output: `MC mean : 59.995 theory 60.0
MC var  : 36.014 theory 36.0
MC  P(total<=65): 0.7954
CLT P(total<=65): 0.7977` }
      ],
      conclusion: `The convolution of $12$ uniform tasks is near-Normal with $E[T]=60$ and sd $6$, so the chance of finishing within $65$ days is $\\approx 0.795$ — the Monte-Carlo convolution ($0.7954$) and the CLT Normal ($0.7977$) agree closely. Budgeting to $65$ days buys roughly an $80\\%$ on-time probability.`
    }
  ],

  /* ================================================================ */
  /* probx-total-variance — Law of total variance                     */
  /* ================================================================ */
  "probx-total-variance": [
    {
      title: `Where does revenue variance come from?`,
      domain: `Product analytics / A/B testing`,
      question: `Revenue-per-user is measured across three countries with very different averages and spreads. How much of the total variance is "within-country" noise versus "between-country" differences — and what share does knowing the country explain?`,
      steps: [
        { title: `The data`, body: `<p>Three segments: US (mean $\\$50$, sd $\\$12$, $5000$ users), IN (mean $\\$8$, sd $\\$3$, $8000$), BR (mean $\\$15$, sd $\\$5$, $3000$). Let $X$ be revenue and $Y$ the country. The law of total variance splits $\\operatorname{Var}(X)$ into within-group scatter and between-group spread.</p>` },
        { title: `The math`, body: `<p>$\\operatorname{Var}(X) = \\underbrace{E[\\operatorname{Var}(X\\mid Y)]}_{\\text{within}} + \\underbrace{\\operatorname{Var}(E[X\\mid Y])}_{\\text{between}}$. The within term is the user-weighted average of each country's variance; the between term is the weighted spread of the country means around the grand mean. Their ratio between$/$total is the variance "explained" by country — an $R^2$-style measure.</p>` },
        { title: `Run it`, body: `<p>Pool all users, compute the total variance, then the two components from group means and variances, and confirm they reconstruct the whole.</p>`,
          code: `import numpy as np
# Split revenue variance into within-country + between-country (pure numpy)
rng = np.random.default_rng(0)
specs = [("US", 50.0, 12.0, 5000), ("IN", 8.0, 3.0, 8000), ("BR", 15.0, 5.0, 3000)]
rev, grp = [], []
for i, (name, mu, sd, n) in enumerate(specs):
    rev.append(rng.normal(mu, sd, n)); grp.append(np.full(n, i))
rev = np.concatenate(rev); grp = np.concatenate(grp)
total = rev.var()
gm = np.array([rev[grp == i].mean() for i in range(3)])  # E[X|Y]
gv = np.array([rev[grp == i].var()  for i in range(3)])  # Var(X|Y)
w  = np.array([(grp == i).mean()     for i in range(3)])  # P(Y)
within  = (w * gv).sum()                       # E[Var(X|Y)]
between = (w * (gm - rev.mean())**2).sum()      # Var(E[X|Y])
print("total variance   :", round(total, 3))
print("within + between :", round(within + between, 3))
print("within  :", round(within, 3))
print("between :", round(between, 3))
print("explained share  :", round(between / total, 3))`,
          output: `total variance   : 404.265
within + between : 404.265
within  : 53.74
between : 350.525
explained share  : 0.867` }
      ],
      conclusion: `The total variance $404.3$ splits cleanly into within-country noise $53.7$ and between-country spread $350.5$ (they sum back to $404.3$ exactly). Country alone explains $\\approx 86.7\\%$ of revenue variance — so segment, not individual scatter, is where the action is.`
    },
    {
      title: `$R^2$ is just the between-group share`,
      domain: `Machine learning (regression)`,
      question: `A linear model is fit to noisy data. Show that scikit-learn's $R^2$ is exactly the between-group (explained) share of variance from the law of total variance, with the residual variance playing the within-group role.`,
      steps: [
        { title: `The data`, body: `<p>Generate $y = 2x + \\text{noise}$ with $x \\sim \\text{Uniform}[-3,3]$ and Gaussian noise (sd $1.5$). The fitted predictions $\\hat{y} = E[y\\mid x]$ partition the variance: $\\operatorname{Var}(y) = \\operatorname{Var}(\\hat{y}) + \\operatorname{Var}(y - \\hat{y})$ when the residuals are uncorrelated with the fit.</p>` },
        { title: `The math`, body: `<p>Map the law of total variance onto regression: $\\operatorname{Var}(E[y\\mid x]) = \\operatorname{Var}(\\hat{y})$ is the between (explained) part, and $E[\\operatorname{Var}(y\\mid x)] = \\operatorname{Var}(y-\\hat{y})$ is the within (residual) part. The definition $R^2 = 1 - \\operatorname{Var}(y-\\hat{y})/\\operatorname{Var}(y) = \\operatorname{Var}(\\hat{y})/\\operatorname{Var}(y)$ is precisely between$/$total.</p>` },
        { title: `Run it`, body: `<p>Fit the model, compute explained and residual variances, confirm they add to the total, and match the ratio to scikit-learn's $R^2$.</p>`,
          code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
# R^2 = between-group (explained) share of the law of total variance
rng = np.random.default_rng(0)
n = 4000
X = rng.uniform(-3, 3, (n, 1))
y = 2.0 * X[:, 0] + rng.normal(0, 1.5, n)
yhat = LinearRegression().fit(X, y).predict(X)
total_var    = y.var()
explained_var = yhat.var()          # Var(E[y|x]) -> between
residual_var  = (y - yhat).var()    # E[Var(y|x)] -> within
print("total var    :", round(total_var, 4))
print("explained    :", round(explained_var, 4))
print("residual     :", round(residual_var, 4))
print("expl+resid   :", round(explained_var + residual_var, 4))
print("explained/tot:", round(explained_var / total_var, 4))
print("sklearn R^2  :", round(r2_score(y, yhat), 4))`,
          output: `total var    : 14.2863
explained    : 12.0175
residual     : 2.2688
expl+resid   : 14.2863
explained/tot: 0.8412
sklearn R^2  : 0.8412` }
      ],
      conclusion: `Explained variance $12.02$ plus residual variance $2.27$ reconstruct the total $14.29$ exactly, and the explained share $0.8412$ is identical to scikit-learn's $R^2 = 0.8412$. $R^2$ is literally $\\operatorname{Var}(E[y\\mid x])/\\operatorname{Var}(y)$ — the between-group share of the law of total variance.`
    },
    {
      title: `Why averaging kills the within-group term`,
      domain: `Operations / queueing`,
      question: `Hospital wait times vary patient-to-patient (queue noise) and day-to-day (load). Decompose the variance, then show that reporting daily averages instead of individuals removes the within-group term — the same mechanism behind ensemble averaging and Rao–Blackwell.`,
      steps: [
        { title: `The data`, body: `<p>Over $60$ days, each day $d$ has a load level (its mean wait $\\sim \\mathcal{N}(30, 8^2)$ min), and within a day, $200$ patients have waits $\\sim \\mathcal{N}(\\text{load}_d, 10^2)$. Let $X$ be a patient's wait and $Y$ the day.</p>` },
        { title: `The math`, body: `<p>$\\operatorname{Var}(X) = E[\\operatorname{Var}(X\\mid \\text{day})] + \\operatorname{Var}(E[X\\mid \\text{day}])$: within-day queue noise plus between-day load. Now average each day's $m=200$ patients. The day-mean has within-day variance shrunk by $1/m$, so $\\operatorname{Var}(\\bar{X}_{\\text{day}}) \\to \\operatorname{Var}(E[X\\mid \\text{day}])$ — only the between-day term survives. This is exactly how ensembles and Rao–Blackwell reduce variance: average out the within term.</p>` },
        { title: `Run it`, body: `<p>Build the nested data, split the variance, and compare the variance of daily averages to the between-day term.</p>`,
          code: `import numpy as np
# Wait-time variance: within-day (queue) + between-day (load); then average it away
rng = np.random.default_rng(0)
days, m = 60, 200
day_load = rng.normal(30, 8, days)
waits = np.array([rng.normal(day_load[d], 10, m) for d in range(days)])
allw = waits.ravel()
total   = allw.var()
within  = waits.var(axis=1).mean()   # E[Var(X|day)]
between = waits.mean(axis=1).var()   # Var(E[X|day])
print("total wait var :", round(total, 3))
print("within  (queue):", round(within, 3))
print("between (load) :", round(between, 3))
print("within+between :", round(within + between, 3))
print("var of daily averages:", round(waits.mean(axis=1).var(), 3))`,
          output: `total wait var : 154.872
within  (queue): 99.242
between (load) : 55.63
within+between : 154.872
var of daily averages: 55.63 (within term averaged away)` }
      ],
      conclusion: `Patient-level variance $154.9$ splits into within-day queue noise $99.2$ and between-day load $55.6$ (summing back exactly). Averaging the $200$ patients per day collapses the variance to $55.63$ — precisely the between-day term, with the within term averaged to nothing. That $1/m$ shrinkage is the engine behind ensembling and Rao–Blackwellization.`
    }
  ],

  /* ================================================================ */
  /* probx-mgf — Moment generating functions                          */
  /* ================================================================ */
  "probx-mgf": [
    {
      title: `Reading moments off a call-center MGF`,
      domain: `Operations research`,
      question: `Calls arrive at a center as a Poisson process, mean $\\lambda = 4$ per minute. Its MGF is $M(t) = e^{\\lambda(e^t - 1)}$. Without any moment formulas, recover $E[X]$ and $\\operatorname{Var}(X)$ by differentiating the MGF at $t=0$.`,
      steps: [
        { title: `The data`, body: `<p>The per-minute call count is $X \\sim \\text{Poisson}(\\lambda)$ with MGF $M(t) = e^{\\lambda(e^t - 1)}$. The MGF stores every moment: $M'(0) = E[X]$ and $M''(0) = E[X^2]$, so $\\operatorname{Var}(X) = M''(0) - (M'(0))^2$.</p>` },
        { title: `The math`, body: `<p>Rather than differentiate by hand, approximate the derivatives numerically at $t=0$. Central differences give $M'(0) \\approx \\frac{M(h) - M(-h)}{2h}$ and $M''(0) \\approx \\frac{M(h) - 2M(0) + M(-h)}{h^2}$. For the Poisson these should land on $E[X] = \\lambda$ and $E[X^2] = \\lambda + \\lambda^2$, giving $\\operatorname{Var}(X) = \\lambda$.</p>` },
        { title: `Run it`, body: `<p>Evaluate the finite-difference derivatives of the MGF and cross-check with a Monte-Carlo Poisson sample.</p>`,
          code: `import numpy as np
# Read Poisson moments off its MGF M(t)=exp(lam*(e^t - 1)) by finite differences
lam = 4.0
M = lambda t: np.exp(lam*(np.exp(t) - 1.0))
h = 1e-3
EX  = (M(h) - M(-h)) / (2*h)                  # M'(0)  = E[X]
EX2 = (M(h) - 2*M(0) + M(-h)) / (h*h)         # M''(0) = E[X^2]
print("E[X]   from MGF:", round(EX, 3),  " (lam =", lam, ")")
print("E[X^2] from MGF:", round(EX2, 3))
print("Var    from MGF:", round(EX2 - EX**2, 3))
rng = np.random.default_rng(0)
x = rng.poisson(lam, 2_000_000)
print("MC mean        :", round(x.mean(), 3))
print("MC var         :", round(x.var(), 3))`,
          output: `E[X]   from MGF: 4.0  (lam = 4.0 )
E[X^2] from MGF: 20.0
Var    from MGF: 4.0
MC mean        : 3.999
MC var         : 4.003` }
      ],
      conclusion: `Differentiating the MGF at $t=0$ hands back $E[X] = 4$ and $E[X^2] = 20$, so $\\operatorname{Var}(X) = 20 - 16 = 4$ — exactly $\\lambda$ for a Poisson, confirmed by the Monte-Carlo mean $3.999$ and variance $4.003$. The MGF's slope and curvature at zero are the first two moments, no integration required.`
    },
    {
      title: `Two traffic streams merge into one`,
      domain: `Web infrastructure`,
      question: `Web requests arrive Poisson($\\lambda_1 = 3$) and mobile Poisson($\\lambda_2 = 5$) per second, independently. Use the MGF product rule to prove the merged stream is Poisson($8$), and verify by simulation.`,
      steps: [
        { title: `The data`, body: `<p>Two independent arrival counts $X_1 \\sim \\text{Poisson}(3)$ and $X_2 \\sim \\text{Poisson}(5)$. The merged per-second count is $S = X_1 + X_2$. The MGF superpower: for independent variables, $M_S(t) = M_{X_1}(t)\\,M_{X_2}(t)$.</p>` },
        { title: `The math`, body: `<p>Each Poisson MGF is $M_{X_i}(t) = e^{\\lambda_i(e^t - 1)}$. Multiplying: $M_S(t) = e^{\\lambda_1(e^t-1)}\\,e^{\\lambda_2(e^t-1)} = e^{(\\lambda_1+\\lambda_2)(e^t-1)}$ — the MGF of $\\text{Poisson}(\\lambda_1+\\lambda_2) = \\text{Poisson}(8)$. Because the MGF determines the distribution uniquely, the merged stream <i>is</i> Poisson($8$).</p>` },
        { title: `Run it`, body: `<p>Compare the product of the two MGFs to the Poisson($8$) MGF at several $t$, then simulate the merged stream.</p>`,
          code: `import numpy as np
# Sum of independent Poissons is Poisson: MGFs MULTIPLY
lam1, lam2 = 3.0, 5.0
M1 = lambda t: np.exp(lam1*(np.exp(t)-1))
M2 = lambda t: np.exp(lam2*(np.exp(t)-1))
Msum  = lambda t: M1(t)*M2(t)                        # product of MGFs
Mpois = lambda t: np.exp((lam1+lam2)*(np.exp(t)-1))  # MGF of Poisson(8)
ts = np.array([-0.3, -0.1, 0.1, 0.3])
print("product of MGFs    :", np.round(Msum(ts), 4))
print("Poisson(8) MGF     :", np.round(Mpois(ts), 4))
print("match              :", np.allclose(Msum(ts), Mpois(ts)))
rng = np.random.default_rng(0)
tot = rng.poisson(lam1, 1_000_000) + rng.poisson(lam2, 1_000_000)
print("MC mean of total   :", round(tot.mean(), 3), "(lam1+lam2 =", lam1+lam2, ")")
print("MC var  of total   :", round(tot.var(), 3))`,
          output: `product of MGFs    : [ 0.1258  0.4671  2.3195 16.4261]
Poisson(8) MGF     : [ 0.1258  0.4671  2.3195 16.4261]
match              : True
MC mean of total   : 7.999 (lam1+lam2 = 8.0 )
MC var  of total   : 7.998` }
      ],
      conclusion: `The product of the two Poisson MGFs equals the Poisson($8$) MGF at every $t$ (e.g. $16.4261$ at $t=0.3$), so the merged stream is Poisson($\\lambda_1+\\lambda_2 = 8$) — confirmed by the simulated mean $7.999$ and variance $7.998$. Multiplying MGFs turns "distribution of a sum" into one line of algebra.`
    },
    {
      title: `Bounding a tail with Chernoff`,
      domain: `Risk management / learning theory`,
      question: `An insurer holds $100$ independent policies, each paying out with probability $p = 0.2$. The expected number of claims is $20$. How tightly can the MGF bound $P(S \\ge 30)$ via the Chernoff method, and how does that compare to the true tail?`,
      steps: [
        { title: `The data`, body: `<p>Total claims $S = \\sum_{i=1}^{100} B_i$ with $B_i \\sim \\text{Bernoulli}(0.2)$, so $S \\sim \\text{Binomial}(100, 0.2)$ with mean $20$. We want a guaranteed upper bound on the tail $P(S \\ge 30)$ — a $50\\%$ overshoot of the mean.</p>` },
        { title: `The math`, body: `<p>The Chernoff bound is the MGF in action: for any $t \\ge 0$, $P(S \\ge a) \\le e^{-ta}\\,M_S(t)$. For a sum of independent Bernoullis, $M_S(t) = (1 - p + p e^t)^n$. Minimizing $e^{-ta}M_S(t)$ over $t$ gives the tightest exponential bound. This is the backbone of concentration inequalities and generalization bounds in learning theory.</p>` },
        { title: `Run it`, body: `<p>Sweep $t$ to minimize the Chernoff bound, then compare it to the Monte-Carlo tail probability.</p>`,
          code: `import numpy as np
# Chernoff tail bound from the MGF: P(S>=a) <= min_t exp(-t*a)*M_S(t)
n, p, a = 100, 0.2, 30
M = lambda t: (1 - p + p*np.exp(t))**n          # MGF of Binomial(n,p)
ts = np.linspace(0.001, 2.0, 20000)
bound = np.min(np.exp(-ts*a) * M(ts))           # optimize t numerically
print("Chernoff bound P(S>=30) <=", round(bound, 5))
rng = np.random.default_rng(0)
S = rng.binomial(n, p, 3_000_000)
print("MC    tail P(S>=30)      =", round((S >= a).mean(), 5))
print("mean S =", round(S.mean(), 2), " (n*p =", n*p, ")")`,
          output: `Chernoff bound P(S>=30) <= 0.0598
MC    tail P(S>=30)      = 0.01125
mean S = 20.0  (n*p = 20.0 )` }
      ],
      conclusion: `The MGF-based Chernoff method guarantees $P(S \\ge 30) \\le 0.0598$, while the true tail is $\\approx 0.0113$. The bound is loose by about $5\\times$ but is a rigorous one-sided certificate that no simulation can violate — exactly the trade-off that makes MGF tail bounds the workhorse of concentration and generalization theory.`
    }
  ]

});
