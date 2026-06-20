/* Per-lesson CODE SECTION for Module 1 — Probability & Statistics. Merged into window.CODE by id.
   { lib, runnable, packages?, explain(HTML), code } — runnable ones execute via Pyodide
   (only numpy / scipy / scikit-learn / pandas / stdlib available).
   Pattern here: compute the formula AND verify by Monte-Carlo simulation; both should match. */
window.CODE = Object.assign(window.CODE || {}, {

  "prob-sample-space": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>Enumerate the sample space of two dice, build events as subsets, and confirm each event's probability (favorable / total) matches a Monte-Carlo simulation.</p>`,
    code: `import numpy as np
from itertools import product

# Sample space: all ordered (die1, die2) outcomes -- 36 equally likely.
omega = list(product(range(1, 7), repeat=2))
print("size of sample space:", len(omega))

# Event A = "sum is 7", event B = "both dice even".
A = [o for o in omega if o[0] + o[1] == 7]
B = [o for o in omega if o[0] % 2 == 0 and o[1] % 2 == 0]
pA, pB = len(A) / len(omega), len(B) / len(omega)
print("P(A=sum7)  =", round(pA, 4), " P(B=both even) =", round(pB, 4))

# Verify by simulation.
rng = np.random.default_rng(0)
rolls = rng.integers(1, 7, size=(200000, 2))
simA = np.mean(rolls.sum(axis=1) == 7)
simB = np.mean((rolls[:, 0] % 2 == 0) & (rolls[:, 1] % 2 == 0))
print("sim  P(A) =", round(simA, 4), " P(B) =", round(simB, 4))`
  },

  "prob-axioms": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>Check the three axioms numerically: probabilities are in [0,1], the whole space sums to 1, and for disjoint events P(A∪B)=P(A)+P(B). Also confirm the complement rule.</p>`,
    code: `import numpy as np

# Fair die: probability of each face.
faces = np.arange(1, 7)
p = np.full(6, 1 / 6)
print("all >= 0:", bool(np.all(p >= 0)), " sum P(Omega) =", round(p.sum(), 6))

# Disjoint events A={1,2}, B={5,6}: additivity.
A = np.isin(faces, [1, 2]); B = np.isin(faces, [5, 6])
pA, pB = p[A].sum(), p[B].sum()
pAorB = p[A | B].sum()
print("P(A)+P(B) =", round(pA + pB, 4), " P(A or B) =", round(pAorB, 4))

# Complement rule: P(not A) = 1 - P(A).
print("1 - P(A) =", round(1 - pA, 4), " P(A^c) =", round(p[~A].sum(), 4))

# Simulate additivity.
rng = np.random.default_rng(0)
d = rng.integers(1, 7, size=300000)
print("sim P(A or B) =", round(np.mean(np.isin(d, [1, 2, 5, 6])), 4))`
  },

  "prob-conditional": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>Compute P(A|B) = P(A∩B)/P(B) for a die, then verify by keeping only the simulated rolls where B happened and measuring how often A also occurred.</p>`,
    code: `import numpy as np

# A = "rolled a 2", B = "rolled an even number".
faces = np.arange(1, 7)
A = faces == 2
B = np.isin(faces, [2, 4, 6])
pB = np.mean(B)
pAB = np.mean(A & B)                 # P(A and B)
print("P(A|B) = P(A and B) / P(B) =", round(pAB / pB, 4))

# Verify by conditioning the simulation on B.
rng = np.random.default_rng(0)
d = rng.integers(1, 7, size=400000)
given_B = d[np.isin(d, [2, 4, 6])]  # restrict to the "even" world
print("sim P(A|B) =", round(np.mean(given_B == 2), 4))
print("expected 1/3 =", round(1 / 3, 4))`
  },

  "prob-bayes": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>Apply Bayes' rule to the rare-disease test and confirm the surprising posterior with a Monte-Carlo population simulation.</p>`,
    code: `import numpy as np

prior = 0.001        # P(sick)
sens = 0.99          # P(+ | sick)
fpr = 0.01           # P(+ | healthy)

# Total probability of a positive test, then Bayes' rule.
p_pos = sens * prior + fpr * (1 - prior)
post = sens * prior / p_pos
print("P(sick | +) =", round(post, 4))

# Simulate a large population.
rng = np.random.default_rng(0)
n = 2_000_000
sick = rng.random(n) < prior
pos = np.where(sick, rng.random(n) < sens, rng.random(n) < fpr)
sim_post = np.mean(sick[pos])       # fraction of positives who are sick
print("sim P(sick | +) =", round(sim_post, 4))`
  },

  "prob-total-prob": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>Split the world into cases (two factories), compute P(defect) as a weighted sum over cases, and verify by simulating which factory each bulb came from.</p>`,
    code: `import numpy as np

pA = np.array([0.6, 0.4])           # P(factory 1), P(factory 2)
pB_given = np.array([0.02, 0.05])   # P(defect | factory)

# Total probability theorem: sum_i P(A_i) P(B | A_i).
pB = np.sum(pA * pB_given)
print("P(defect) =", round(pB, 4))

# Verify by simulation.
rng = np.random.default_rng(0)
n = 1_000_000
factory = rng.choice([0, 1], size=n, p=pA)
defect = rng.random(n) < pB_given[factory]
print("sim P(defect) =", round(np.mean(defect), 4))`
  },

  "prob-independence": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>Test independence by comparing P(A∩B) with P(A)·P(B). Two coin flips are independent; we confirm the product rule against simulation.</p>`,
    code: `import numpy as np

rng = np.random.default_rng(0)
n = 1_000_000
flip1 = rng.integers(0, 2, size=n)  # 1 = heads
flip2 = rng.integers(0, 2, size=n)

pA = np.mean(flip1 == 1)            # first flip heads
pB = np.mean(flip2 == 1)            # second flip heads
pAB = np.mean((flip1 == 1) & (flip2 == 1))
print("P(A) =", round(pA, 4), " P(B) =", round(pB, 4))
print("P(A)*P(B) =", round(pA * pB, 4), " P(A and B) =", round(pAB, 4))

# Independent exactly when these two match.
print("independent?", abs(pA * pB - pAB) < 0.005)`
  },

  "prob-counting": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy", "scipy"],
    explain: `<p>Use <code>scipy.special.perm</code> and <code>comb</code> for permutations and combinations, and cross-check by brute-force enumeration with <code>itertools</code>.</p>`,
    code: `from scipy.special import perm, comb
from itertools import permutations, combinations

n, r = 5, 3
print("P(n,r) = n!/(n-r)! =", int(perm(n, r)))
print("C(n,r) = n!/(r!(n-r)!) =", int(comb(n, r)))

# Brute-force enumeration to confirm the counts.
items = list(range(n))
n_perm = len(list(permutations(items, r)))
n_comb = len(list(combinations(items, r)))
print("enumerated permutations:", n_perm)
print("enumerated combinations:", n_comb)

# Each combination orders into r! permutations.
from math import factorial
print("perm / comb =", n_perm // n_comb, " r! =", factorial(r))`
  },

  "prob-random-variable": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy", "scipy"],
    explain: `<p>X = number of heads in 3 fair flips. Its PMF is Binomial(3, 0.5) via <code>scipy.stats.binom</code>; we verify each P(X=k) against simulated flip counts.</p>`,
    code: `import numpy as np
from scipy.stats import binom

n, p = 3, 0.5
k = np.arange(0, n + 1)
pmf = binom.pmf(k, n, p)            # P(X = k)
print("PMF P(X=k):", np.round(pmf, 4))
print("sums to:", round(pmf.sum(), 6))

# Verify by simulation: count heads in many 3-flip trials.
rng = np.random.default_rng(0)
heads = rng.integers(0, 2, size=(500000, n)).sum(axis=1)
sim = np.array([np.mean(heads == j) for j in k])
print("sim P(X=k):", np.round(sim, 4))`
  },

  "prob-expectation": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy", "scipy"],
    explain: `<p>Expectation E[X] = Σ x·p(x) is the probability-weighted average. We compute it for a die directly and via <code>scipy.stats</code>, then confirm it equals the long-run sample mean.</p>`,
    code: `import numpy as np
from scipy.stats import randint

# Fair die: values 1..6, each probability 1/6.
x = np.arange(1, 7)
p = np.full(6, 1 / 6)
EX = np.sum(x * p)                  # E[X] = sum x * p(x)
print("E[X] formula =", round(EX, 4))

# scipy: discrete uniform on 1..6 (high is exclusive).
print("scipy mean   =", round(randint(1, 7).mean(), 4))

# Long-run average converges to E[X] (law of large numbers).
rng = np.random.default_rng(0)
samples = rng.integers(1, 7, size=1_000_000)
print("sample mean  =", round(samples.mean(), 4))`
  },

  "prob-variance": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy", "scipy"],
    explain: `<p>Variance Var(X) = E[(X−μ)²] measures spread; std is its square root. We compute both for a die from the formula, via <code>scipy.stats</code>, and from samples.</p>`,
    code: `import numpy as np
from scipy.stats import randint

x = np.arange(1, 7)
p = np.full(6, 1 / 6)
mu = np.sum(x * p)
var = np.sum((x - mu) ** 2 * p)     # E[(X-mu)^2]
print("Var(X) formula =", round(var, 4), " std =", round(var ** 0.5, 4))

# scipy gives the same for discrete uniform on 1..6.
d = randint(1, 7)
print("scipy  Var =", round(d.var(), 4), " std =", round(d.std(), 4))

# Verify from samples (ddof=0 = population variance).
rng = np.random.default_rng(0)
s = rng.integers(1, 7, size=1_000_000)
print("sample Var =", round(s.var(), 4), " std =", round(s.std(), 4))`
  },

  "prob-bernoulli-binomial": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy", "scipy"],
    explain: `<p>A Bernoulli trial is one coin flip; a Binomial counts successes over n trials. We use <code>scipy.stats.binom</code> for the PMF, mean, and variance, and check against simulation.</p>`,
    code: `import numpy as np
from scipy.stats import binom

n, p = 10, 0.3
dist = binom(n, p)
print("mean = n*p =", round(dist.mean(), 4), " expected", n * p)
print("var = n*p*(1-p) =", round(dist.var(), 4), " expected", n * p * (1 - p))
print("P(X=3) =", round(dist.pmf(3), 4))
print("P(X<=3) =", round(dist.cdf(3), 4))

# Simulate: sum of n Bernoulli(p) trials.
rng = np.random.default_rng(0)
draws = rng.binomial(n, p, size=500000)
print("sim mean =", round(draws.mean(), 4))
print("sim P(X=3) =", round(np.mean(draws == 3), 4))`
  },

  "prob-geometric-poisson": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy", "scipy"],
    explain: `<p>Geometric counts trials until the first success; Poisson counts rare events in a window. We use <code>scipy.stats.geom</code> and <code>poisson</code> and confirm their means by simulation.</p>`,
    code: `import numpy as np
from scipy.stats import geom, poisson

# Geometric(p): trials until first success. Mean = 1/p.
p = 0.25
g = geom(p)
print("geom mean = 1/p =", round(g.mean(), 4), " expected", 1 / p)
print("geom P(first success on trial 3) =", round(g.pmf(3), 4))

# Poisson(lam): count of events in a window. Mean = var = lam.
lam = 4.0
po = poisson(lam)
print("poisson mean =", round(po.mean(), 4), " var =", round(po.var(), 4))
print("poisson P(X=4) =", round(po.pmf(4), 4))

# Simulate both means.
rng = np.random.default_rng(0)
print("sim geom mean   =", round(rng.geometric(p, 500000).mean(), 4))
print("sim poisson mean=", round(rng.poisson(lam, 500000).mean(), 4))`
  },

  "prob-pdf-cdf": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy", "scipy"],
    explain: `<p>For continuous variables, probability is area under the PDF; the CDF accumulates that area. We confirm that integrating the normal PDF reproduces the CDF, and that P(a&lt;X&lt;b) matches simulation.</p>`,
    code: `import numpy as np
from scipy.stats import norm

# Standard normal: PDF f(x), CDF F(x) = P(X <= x).
print("F(0) = P(X<=0) =", round(norm.cdf(0), 4))   # 0.5 by symmetry
print("P(-1 < X < 1) =", round(norm.cdf(1) - norm.cdf(-1), 4))

# Area under the PDF from -inf..0 should equal the CDF at 0.
grid = np.linspace(-8, 0, 100000)
area = np.trapz(norm.pdf(grid), grid)
print("integral of PDF up to 0 =", round(area, 4))

# Verify the interval probability by simulation.
rng = np.random.default_rng(0)
x = rng.standard_normal(1_000_000)
print("sim P(-1<X<1) =", round(np.mean((x > -1) & (x < 1)), 4))`
  },

  "prob-uniform-exponential": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy", "scipy"],
    explain: `<p>Uniform has flat odds; Exponential models waiting times and is memoryless. We use <code>scipy.stats.uniform</code> and <code>expon</code>, then check the memoryless property by simulation.</p>`,
    code: `import numpy as np
from scipy.stats import uniform, expon

# Uniform(0, 10): every value equally likely. Mean = (a+b)/2.
u = uniform(loc=0, scale=10)
print("uniform mean =", round(u.mean(), 4), " P(X<3) =", round(u.cdf(3), 4))

# Exponential with rate lam=0.5 (scipy uses scale = 1/lam). Mean = 1/lam.
lam = 0.5
e = expon(scale=1 / lam)
print("expon mean = 1/lam =", round(e.mean(), 4))

# Memoryless: P(X > s+t | X > s) = P(X > t).
rng = np.random.default_rng(0)
x = rng.exponential(scale=1 / lam, size=2_000_000)
cond = np.mean(x[x > 2.0] > 2.0 + 1.0)   # given survived 2, survive 1 more
print("sim P(X>3 | X>2) =", round(cond, 4), " P(X>1) =", round(float(e.sf(1)), 4))`
  },

  "prob-normal": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy", "scipy"],
    explain: `<p>The normal (Gaussian) distribution via <code>scipy.stats.norm</code>. We verify the 68-95-99.7 rule and that standardizing (z-scores) maps any normal to the standard normal.</p>`,
    code: `import numpy as np
from scipy.stats import norm

mu, sigma = 100, 15
d = norm(loc=mu, scale=sigma)

# 68-95-99.7 rule: probability within 1, 2, 3 standard deviations.
for k in (1, 2, 3):
    p = d.cdf(mu + k * sigma) - d.cdf(mu - k * sigma)
    print("within %d sigma: %.4f" % (k, p))

# Standardizing: z = (x - mu) / sigma is standard normal.
rng = np.random.default_rng(0)
x = rng.normal(mu, sigma, size=1_000_000)
z = (x - mu) / sigma
print("z mean ~0:", round(z.mean(), 4), " z std ~1:", round(z.std(), 4))
print("sim within 1 sigma:", round(np.mean(np.abs(z) < 1), 4))`
  },

  "prob-joint-marginal": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>A joint distribution is a table of P(X=x, Y=y). Marginals come from summing out one variable. We build a joint table and recover the marginals, confirming against simulation.</p>`,
    code: `import numpy as np

# Joint PMF table: rows = X in {0,1}, cols = Y in {0,1,2}.
joint = np.array([[0.10, 0.15, 0.05],
                  [0.20, 0.25, 0.25]])
print("joint sums to:", round(joint.sum(), 6))

# Marginal of X = sum over Y (rows); marginal of Y = sum over X (cols).
pX = joint.sum(axis=1)
pY = joint.sum(axis=0)
print("P(X) =", np.round(pX, 4))
print("P(Y) =", np.round(pY, 4))

# Verify by sampling cells according to the joint, then counting.
rng = np.random.default_rng(0)
flat = joint.ravel()
idx = rng.choice(flat.size, size=500000, p=flat)
xs, ys = np.divmod(idx, joint.shape[1])
print("sim P(X) =", np.round([np.mean(xs == i) for i in range(2)], 4))
print("sim P(Y) =", np.round([np.mean(ys == j) for j in range(3)], 4))`
  },

  "prob-covariance-correlation": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy", "scipy"],
    explain: `<p>Covariance measures whether two variables move together; correlation scales it to [−1,1]. We use <code>numpy.cov</code> / <code>corrcoef</code> and <code>scipy.stats.pearsonr</code> on correlated samples.</p>`,
    code: `import numpy as np
from scipy.stats import pearsonr

rng = np.random.default_rng(0)
n = 200000
X = rng.normal(0, 1, size=n)
Y = 2 * X + rng.normal(0, 1, size=n)   # Y depends on X, plus noise

# Covariance matrix and correlation.
cov = np.cov(X, Y)
print("Cov(X,Y) =", round(cov[0, 1], 4))
print("corrcoef =", round(np.corrcoef(X, Y)[0, 1], 4))

# scipy.stats.pearsonr gives the same correlation (+ a p-value).
r, _ = pearsonr(X, Y)
print("scipy pearson r =", round(r, 4))

# Theory: Cov = 2*Var(X) = 2; corr = 2/sqrt(2^2*Var(X)+Var(noise)) ~ 0.894.
print("expected corr ~", round(2 / np.sqrt(5), 4))`
  },

  "prob-conditional-expectation": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>Conditional expectation E[Y|X] averages Y within each X group; the law of total expectation says E[E[Y|X]] = E[Y]. We confirm both from simulated data.</p>`,
    code: `import numpy as np

rng = np.random.default_rng(0)
n = 1_000_000
X = rng.integers(0, 3, size=n)         # group label 0,1,2
# Y's mean depends on the group: 1, 4, 9.
means = np.array([1.0, 4.0, 9.0])
Y = means[X] + rng.normal(0, 1, size=n)

# E[Y | X = g] for each group.
for g in range(3):
    print("E[Y | X=%d] =" % g, round(Y[X == g].mean(), 3))

# Law of total expectation: average the group means weighted by P(X=g).
pX = np.array([np.mean(X == g) for g in range(3)])
condE = np.array([Y[X == g].mean() for g in range(3)])
print("E[E[Y|X]] =", round(np.sum(pX * condE), 4))
print("E[Y]      =", round(Y.mean(), 4))`
  },

  "prob-inequalities": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy", "scipy"],
    explain: `<p>Markov and Chebyshev bound tail probabilities using only the mean (and variance). We compute both bounds for an exponential variable and confirm the true tail stays under them.</p>`,
    code: `import numpy as np
from scipy.stats import expon

# Exponential with mean 1 (rate 1). Nonnegative, so Markov applies.
mu, var = 1.0, 1.0
d = expon(scale=1.0)

a = 4.0                              # Markov: P(X >= a) <= mu / a
markov = mu / a
print("Markov bound  P(X>=4) <=", round(markov, 4))
print("true tail     P(X>=4)  =", round(float(d.sf(a)), 4))

k = 3.0                             # Chebyshev: P(|X-mu| >= k*sigma) <= 1/k^2
cheby = 1 / k ** 2
print("Chebyshev bound P(|X-mu|>=3sigma) <=", round(cheby, 4))

rng = np.random.default_rng(0)
x = rng.exponential(1.0, size=2_000_000)
print("sim P(|X-mu|>=3sigma) =", round(np.mean(np.abs(x - mu) >= k * var ** 0.5), 4))`
  },

  "prob-lln": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>The Law of Large Numbers: as sample size grows, the running average of die rolls converges to the true mean 3.5. We print the average at increasing sample sizes.</p>`,
    code: `import numpy as np

rng = np.random.default_rng(0)
true_mean = 3.5                     # E[fair die]

# Running average converges to the true mean as n grows.
rolls = rng.integers(1, 7, size=1_000_000).astype(float)
for n in (10, 100, 1000, 10000, 100000, 1_000_000):
    avg = rolls[:n].mean()
    print("n=%-9d  average=%.4f  error=%.4f" % (n, avg, abs(avg - true_mean)))

print("true mean =", true_mean)`
  },

  "prob-clt": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy", "scipy"],
    explain: `<p>The Central Limit Theorem: sums of many independent variables look normal, regardless of the source. We average uniform samples and confirm the sample means match the normal predicted by the CLT.</p>`,
    code: `import numpy as np
from scipy.stats import kstest, norm

rng = np.random.default_rng(0)
n = 30                              # samples per average
trials = 200000

# Each row: average of n Uniform(0,1) draws (mean 0.5, var 1/12).
data = rng.uniform(0, 1, size=(trials, n))
means = data.mean(axis=1)

# CLT predicts means ~ Normal(0.5, sqrt((1/12)/n)).
mu, sd = 0.5, np.sqrt((1 / 12) / n)
print("sample mean =", round(means.mean(), 4), " predicted", mu)
print("sample std  =", round(means.std(), 4), " predicted", round(sd, 4))

# KS test: standardized means should match standard normal (big p = good fit).
z = (means - mu) / sd
stat, pval = kstest(z, norm.cdf)
print("KS stat =", round(stat, 4), " p-value =", round(pval, 4))`
  },

  "prob-estimation": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy", "scipy"],
    explain: `<p>Estimate a normal's hidden mean and standard deviation from data. The sample mean is unbiased; sample variance needs the n−1 correction (Bessel). We compare and use <code>scipy.stats.norm.fit</code>.</p>`,
    code: `import numpy as np
from scipy.stats import norm

rng = np.random.default_rng(0)
true_mu, true_sigma = 5.0, 2.0
x = rng.normal(true_mu, true_sigma, size=2000)

# Point estimates.
mu_hat = x.mean()
var_biased = x.var(ddof=0)          # divides by n  -> biased low
var_unbiased = x.var(ddof=1)        # divides by n-1 -> unbiased
print("mu_hat      =", round(mu_hat, 4), " (true 5)")
print("var ddof=0  =", round(var_biased, 4))
print("var ddof=1  =", round(var_unbiased, 4), " (true 4)")

# scipy MLE fit recovers the same parameters.
fmu, fsigma = norm.fit(x)
print("norm.fit mu =", round(fmu, 4), " sigma =", round(fsigma, 4))

# Unbiasedness: average mu_hat over many datasets equals the truth.
ests = [rng.normal(true_mu, true_sigma, 100).mean() for _ in range(5000)]
print("mean of mu_hat over datasets =", round(np.mean(ests), 4))`
  }

});
