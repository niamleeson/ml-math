/* =====================================================================
   CODE SECTION — Module 6 (Probability, advanced).
   One window.CODE entry per lesson in 06-prob-extra.js.
   Each runs in Pyodide (numpy/scipy only): formula computation AND a
   Monte-Carlo / scipy.stats check, both printed so they agree.
   ===================================================================== */
window.CODE = Object.assign(window.CODE || {}, {

  "probx-derived": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy", "scipy"],
    explain: `<p>Push X ~ Uniform[0,1] through Y = X². The change-of-variables formula
      predicts the density f_Y(y) = 1/(2*sqrt(y)). We verify two ways: a Monte-Carlo
      histogram of simulated Y, and scipy's exact rv via a custom CDF. Both should
      land on the same curve and the same mean 1/3.</p>`,
    code:
`import numpy as np
from scipy import integrate
rng = np.random.default_rng(0)

# Derived dist: X ~ Uniform[0,1], Y = X^2. Formula: f_Y(y) = 1/(2*sqrt(y)).
f_Y = lambda y: 1.0 / (2.0 * np.sqrt(y))

# Monte-Carlo: simulate Y and histogram a few bins.
x = rng.random(2_000_000)
y = x ** 2
edges = np.array([0.04, 0.09, 0.16, 0.25])   # avoid y=0 spike
for a, b in zip(edges[:-1], edges[1:]):
    emp = np.mean((y >= a) & (y < b)) / (b - a)        # empirical density
    theo, _ = integrate.quad(f_Y, a, b)
    theo /= (b - a)                                    # theoretical avg density
    print(f"y in [{a:.2f},{b:.2f}): MC={emp:.3f}  formula={theo:.3f}")

print("E[Y]  MC =", round(y.mean(), 4), " formula =", round(1/3, 4))`
  },

  "probx-convolution": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy", "scipy"],
    explain: `<p>The PMF of a sum is a convolution. We compute the two-dice sum PMF
      with np.convolve and confirm it against a Monte-Carlo simulation. We also check
      the continuous fact: two independent N(0,1) sum to N(0,2), comparing scipy's
      analytic density to a simulated histogram.</p>`,
    code:
`import numpy as np
from scipy import stats
rng = np.random.default_rng(0)

# Discrete: sum of two fair dice via convolution of the face PMFs.
face = np.full(6, 1/6)
pmf = np.convolve(face, face)              # index 0 -> sum 2
sums = np.arange(2, 13)
# Monte-Carlo check.
roll = rng.integers(1, 7, (2_000_000, 2)).sum(axis=1)
for s, p in zip(sums, pmf):
    mc = np.mean(roll == s)
    print(f"P(sum={s:2d}) conv={p:.4f}  MC={mc:.4f}")

# Continuous: N(0,1) + N(0,1) = N(0,2). Compare density at a point.
z = rng.standard_normal(2_000_000) + rng.standard_normal(2_000_000)
print("Var(Z) MC =", round(z.var(), 3), " theory = 2")
print("pdf@1 N(0,2) =", round(stats.norm(0, np.sqrt(2)).pdf(1.0), 4))`
  },

  "probx-total-variance": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy", "scipy"],
    explain: `<p>Law of total variance: Var(X) = E[Var(X|Y)] + Var(E[X|Y]). We build a
      two-class mixture (means 70/80, equal within-group variance 25), compute the
      within + between decomposition from the formula, and confirm it equals the raw
      Var(X) of a big simulated sample.</p>`,
    code:
`import numpy as np
rng = np.random.default_rng(0)

# Two equal classes. Class means and shared within-group variance.
means = np.array([70.0, 80.0]); within_var = 25.0
n = 1_000_000
grp = rng.integers(0, 2, n)                       # which class (Y)
x = rng.normal(means[grp], np.sqrt(within_var))   # score (X)

# Formula: within + between.
within = within_var                               # E[Var(X|Y)]
grand = means.mean()
between = np.mean((means - grand) ** 2)           # Var(E[X|Y]), equal weights
print("within  E[Var(X|Y)] =", within)
print("between Var(E[X|Y]) =", between)
print("formula total       =", within + between)

# Monte-Carlo: raw variance of the mixture should match.
print("MC Var(X)           =", round(x.var(), 2), "(theory 50)")`
  },

  "probx-mgf": {
    lib: "NumPy + SciPy",
    runnable: true,
    packages: ["numpy", "scipy"],
    explain: `<p>The MGF M(t)=E[e^{tX}] encodes every moment: M'(0)=E[X], M''(0)=E[X²].
      For an exponential with rate λ, M(t)=λ/(λ−t). We read the moments by numerically
      differentiating M at t=0 and compare them to the sample moments from a simulated
      exponential. Both give mean 1/λ and variance 1/λ².</p>`,
    code:
`import numpy as np
from scipy.stats import expon
rng = np.random.default_rng(0)

lam = 1.5
M = lambda t: lam / (lam - t)                 # MGF of Exponential(rate=lam)

# Read moments by finite-difference derivatives of M at t=0.
h = 1e-4
m1 = (M(h) - M(-h)) / (2 * h)                 # M'(0) = E[X]
m2 = (M(h) - 2 * M(0) + M(-h)) / (h * h)      # M''(0) = E[X^2]
var_mgf = m2 - m1 ** 2
print("MGF  E[X] =", round(m1, 4), " Var =", round(var_mgf, 4))
print("exact     E[X] = 1/lam =", round(1/lam, 4), " Var = 1/lam^2 =", round(1/lam**2, 4))

# Monte-Carlo check from a simulated exponential sample.
x = expon(scale=1/lam).rvs(2_000_000, random_state=rng)
print("MC   E[X] =", round(x.mean(), 4), " Var =", round(x.var(), 4))`
  }

});
