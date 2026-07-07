# Convergence of Random Variables (LLN & CLT)
> **Source:** Probability (MIT) · **Category:** Formula/Theorem · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an .ipynb will be generated.

## 1. Overview

Convergence theorems explain why repeated randomness becomes predictable. The **Weak Law of Large Numbers (WLLN)** says that sample averages stabilize near the population mean, while the **Central Limit Theorem (CLT)** says that properly standardized sums often look normal even when the original observations are not normal.

**One-line intuition:** LLN tells us where the average goes; CLT tells us the bell-shaped scale of its remaining fluctuations.

This lesson mixes hand derivations and runnable simulations. The hand derivations prove the bounds and limiting statements on small symbolic cases; the code then shows the same ideas at scale by repeatedly drawing samples, plotting sample means, estimating error probabilities, and overlaying normal curves.

## 2. Key Idea

### Markov inequality

If $X\ge 0$ and $a>0$, then

$$
\mathbb{P}(X\ge a)\le \frac{\mathbb{E}[X]}{a}.
$$

A short derivation uses the indicator of the event $\{X\ge a\}$:

$$
X\ge a\mathbf{1}_{\{X\ge a\}}.
$$

Taking expectations preserves the inequality:

$$
\mathbb{E}[X]
\ge \mathbb{E}\left[a\mathbf{1}_{\{X\ge a\}}\right]
= a\mathbb{E}\left[\mathbf{1}_{\{X\ge a\}}\right]
= a\mathbb{P}(X\ge a).
$$

Dividing by $a>0$ gives

$$
\mathbb{P}(X\ge a)\le \frac{\mathbb{E}[X]}{a}.
$$

Markov is often loose, but it needs only nonnegativity and a mean.

### Chebyshev inequality

If $\mathbb{E}[X]=\mu$ and $\operatorname{Var}(X)=\sigma^2$, then for every $c>0$,

$$
\mathbb{P}(|X-\mu|\ge c)\le \frac{\sigma^2}{c^2}.
$$

Derive it by applying Markov to the nonnegative random variable

$$
Y=(X-\mu)^2\ge 0.
$$

The event $|X-\mu|\ge c$ is equivalent to

$$
(X-\mu)^2\ge c^2.
$$

Therefore Markov gives

$$
\mathbb{P}(|X-\mu|\ge c)
=\mathbb{P}((X-\mu)^2\ge c^2)
\le \frac{\mathbb{E}[(X-\mu)^2]}{c^2}
=\frac{\operatorname{Var}(X)}{c^2}
=\frac{\sigma^2}{c^2}.
$$

Chebyshev is distribution-free: it uses only the mean and variance.

### Sample mean and WLLN

For i.i.d. random variables $X_1,X_2,\ldots$ with

$$
\mathbb{E}[X_i]=\mu,
\qquad
\operatorname{Var}(X_i)=\sigma^2,
$$

define the sample mean

$$
M_n=\frac{1}{n}\sum_{i=1}^{n}X_i.
$$

Its expectation is

$$
\mathbb{E}[M_n]
=\mathbb{E}\left[\frac{1}{n}\sum_{i=1}^{n}X_i\right]
=\frac{1}{n}\sum_{i=1}^{n}\mathbb{E}[X_i]
=\frac{1}{n}\cdot n\mu
=\mu.
$$

Because the variables are independent,

$$
\operatorname{Var}(M_n)
=\operatorname{Var}\left(\frac{1}{n}\sum_{i=1}^{n}X_i\right)
=\frac{1}{n^2}\sum_{i=1}^{n}\operatorname{Var}(X_i)
=\frac{1}{n^2}\cdot n\sigma^2
=\frac{\sigma^2}{n}.
$$

Apply Chebyshev to $M_n$ with threshold $\epsilon>0$:

$$
\mathbb{P}(|M_n-\mu|\ge \epsilon)
\le \frac{\operatorname{Var}(M_n)}{\epsilon^2}
=\frac{\sigma^2}{n\epsilon^2}.
$$

Since

$$
\lim_{n\to\infty}\frac{\sigma^2}{n\epsilon^2}=0,
$$

the squeeze principle gives the Weak Law of Large Numbers:

$$
\lim_{n\to\infty}\mathbb{P}(|M_n-\mu|\ge \epsilon)=0.
$$

### Convergence in probability

A sequence $Y_n$ converges in probability to $Y$ if, for every $\epsilon>0$,

$$
\lim_{n\to\infty}\mathbb{P}(|Y_n-Y|\ge \epsilon)=0.
$$

The WLLN says exactly that

$$
M_n\xrightarrow{p}\mu.
$$

Useful closure properties are:

$$
X_n\xrightarrow{p}a,
\quad
Y_n\xrightarrow{p}b
\quad\Longrightarrow\quad
X_n+Y_n\xrightarrow{p}a+b,
$$

and, if $g$ is continuous,

$$
X_n\xrightarrow{p}a
\quad\Longrightarrow\quad
g(X_n)\xrightarrow{p}g(a).
$$

A warning: convergence in probability does **not** guarantee $\mathbb{E}[X_n]\to a$ without additional assumptions such as boundedness or uniform integrability.

### Central Limit Theorem

For independent random variables $X_1,X_2,\ldots$ with common mean $\mu$ and variance $\sigma^2$, define

$$
Z_n=\frac{1}{\sigma\sqrt{n}}\sum_{i=1}^{n}(X_i-\mu).
$$

Equivalently, since $\sum_{i=1}^{n}(X_i-\mu)=n(M_n-\mu)$,

$$
Z_n
=\frac{n(M_n-\mu)}{\sigma\sqrt{n}}
=\frac{\sqrt{n}(M_n-\mu)}{\sigma}.
$$

The CLT says that, for every real $z$,

$$
\lim_{n\to\infty}\mathbb{P}(Z_n\le z)=\mathbb{P}(Z\le z),
\qquad
Z\sim\mathcal{N}(0,1).
$$

Thus a large finite-variance sum is approximately

$$
\sum_{i=1}^{n}X_i\approx \mathcal{N}(n\mu,n\sigma^2),
$$

and a large sample mean is approximately

$$
M_n\approx \mathcal{N}\left(\mu,\frac{\sigma^2}{n}\right).
$$

### De Moivre--Laplace and binomial normal approximation

If $X\sim\operatorname{Bin}(n,p)$, then $X$ is a sum of $n$ independent Bernoulli$(p)$ variables. For one Bernoulli variable,

$$
\mu=p,
\qquad
\sigma^2=p(1-p).
$$

Therefore

$$
X\approx \mathcal{N}(np,np(1-p))
$$

when $n$ is large and $p$ is not too close to $0$ or $1$.

Because $X$ is discrete but the normal distribution is continuous, use the continuity correction:

$$
\mathbb{P}(X=k)
=\mathbb{P}\left(k-\frac12\le X\le k+\frac12\right)
\approx
\Phi\left(\frac{k+\frac12-np}{\sqrt{np(1-p)}}\right)
-
\Phi\left(\frac{k-\frac12-np}{\sqrt{np(1-p)}}\right).
$$

For an interval $a\le X\le b$,

$$
\mathbb{P}(a\le X\le b)
\approx
\Phi\left(\frac{b+\frac12-np}{\sqrt{np(1-p)}}\right)
-
\Phi\left(\frac{a-\frac12-np}{\sqrt{np(1-p)}}\right).
$$

## 3. Worked Examples

### Setup

Run this once before the coded examples. It imports the numerical stack, fixes randomness, and defines plotting helpers used later.

```python
import numpy as np  # Import NumPy for vectorized simulation and reproducible random draws.
import matplotlib.pyplot as plt  # Import Matplotlib for line plots, histograms, and overlays.
from scipy.stats import norm, binom, cauchy  # Import exact and approximating distributions used in CLT examples.
try:  # Try to import widgets because most notebook environments already include them.
    from ipywidgets import interact, IntSlider, Dropdown  # Import widgets for the final live experiment.
except ModuleNotFoundError:  # Fall back to a quiet install when the notebook runtime lacks widgets.
    import sys  # Import sys so the install uses the same Python executable as the notebook kernel.
    import subprocess  # Import subprocess so the dependency can be installed programmatically.
    subprocess.check_call([sys.executable, "-m", "pip", "install", "ipywidgets==8.1.5", "--quiet"])  # Install a pinned widget version quietly.
    from ipywidgets import interact, IntSlider, Dropdown  # Import widgets after the fallback installation succeeds.

SEED = 431  # Choose one fixed seed so every run of the notebook is reproducible.
rng = np.random.default_rng(SEED)  # Create one modern random-number generator used by all simulations.
plt.rcParams["figure.figsize"] = (8, 4.8)  # Set a readable default figure size for notebook plots.
plt.rcParams["axes.grid"] = True  # Turn on light grid lines so convergence patterns are easier to compare.
plt.rcParams["font.size"] = 11  # Use a slightly larger font for university-style lecture figures.


def standard_normal_pdf(x_values):  # Define a small helper for plotting the N(0,1) density curve.
    return norm.pdf(x_values)  # Evaluate the standard-normal probability density at each supplied x value.


def summarize_array(name, values):  # Define a reusable helper for compact numeric summaries.
    values = np.asarray(values)  # Convert the input to a NumPy array so summary operations are consistent.
    print(f"{name}: mean={values.mean():.4f}, std={values.std(ddof=1):.4f}, min={values.min():.4f}, max={values.max():.4f}")  # Print the main descriptive statistics.
```

### Data — swappable sources

These source settings let later examples switch among finite-variance distributions where LLN/CLT work well and a heavy-tailed Cauchy source where the usual finite-mean/finite-variance story breaks.

```python
DATA_SOURCE = "bernoulli"  # Choose "bernoulli", "die", "uniform", "exponential", or "cauchy" as the active source.
DATA_CONFIG = {  # Store distribution parameters in one dictionary so examples can be modified in one place.
    "bernoulli": {"p": 0.6, "mean": 0.6, "variance": 0.6 * 0.4},  # Record Bernoulli probability, mean, and variance.
    "die": {"faces": np.arange(1, 7), "mean": 3.5, "variance": 35 / 12},  # Record fair-die support, mean, and variance.
    "uniform": {"low": 0.0, "high": 1.0, "mean": 0.5, "variance": 1 / 12},  # Record Uniform(0,1) facts.
    "exponential": {"scale": 1.0, "mean": 1.0, "variance": 1.0},  # Record Exponential(lambda=1) facts using NumPy's scale convention.
    "cauchy": {"location": 0.0, "scale": 1.0, "mean": np.nan, "variance": np.nan},  # Record that Cauchy mean and variance are undefined.
}  # Finish the configuration dictionary.


def draw_samples(source, sample_shape, local_rng):  # Define one sampler so every example can swap data sources cleanly.
    if source == "bernoulli":  # Branch to Bernoulli data for coin-flip examples.
        return local_rng.binomial(1, DATA_CONFIG[source]["p"], size=sample_shape)  # Draw zeros and ones with success probability p.
    if source == "die":  # Branch to fair six-sided die data.
        return local_rng.integers(1, 7, size=sample_shape)  # Draw integers 1 through 6 with equal probability.
    if source == "uniform":  # Branch to bounded continuous data.
        return local_rng.uniform(0.0, 1.0, size=sample_shape)  # Draw Uniform(0,1) observations.
    if source == "exponential":  # Branch to skewed finite-variance data.
        return local_rng.exponential(DATA_CONFIG[source]["scale"], size=sample_shape)  # Draw Exponential(lambda=1) observations.
    if source == "cauchy":  # Branch to heavy-tailed data with undefined mean and variance.
        return local_rng.standard_cauchy(size=sample_shape)  # Draw standard Cauchy observations.
    raise ValueError(f"Unknown source: {source}")  # Fail loudly if the source name is misspelled.

preview = draw_samples(DATA_SOURCE, 12, rng)  # Draw a small preview from the selected source.
print(f"Active DATA_SOURCE = {DATA_SOURCE}")  # Print the active source so output cells are self-documenting.
print(f"Preview sample = {preview}")  # Print a few raw values to make the data-generating process concrete.
summarize_array("Preview", preview)  # Print a compact summary of the preview values.
```

### 📖 Concept walkthrough — build each idea from scratch

Before the warm-up examples, we build every convergence idea from scratch, one small simulation at a time. Each concept uses only NumPy + Matplotlib, tiny inline arrays or repeated draws, and `_w`-suffixed variables so nothing collides with the examples below. The goal is to print the quantities that the theorem talks about, then plot the same quantity so the limiting behavior is visible.

```python
import numpy as np  # NumPy gives us random draws, vectorized means, variances, and probability calculations.
import matplotlib.pyplot as plt  # Matplotlib lets us see loose bounds, shrinking averages, and normal approximations.
np.random.seed(0)  # A fixed seed makes every simulation, printout, and plot reproducible.
```

#### 1. Markov and Chebyshev: loose but guaranteed tail bounds

Markov bounds the right tail of any nonnegative random variable using only its mean: if too much probability lived above $a$, the average would have to be at least that much mass times $a$. Chebyshev applies the same idea to the nonnegative squared deviation $(X-\mu)^2$, so variance becomes a distribution-free bound on how often values can sit far from the mean. We use an exponential distribution because its true tail is easy to compute, letting us compare the real probability, the simulation, and the bound side by side.

```python
mean_markov_w = 1.0  # Choose X ~ Exponential(mean 1), so E[X] is known exactly.
a_markov_w = 3.0  # Ask for the right-tail event X >= 3.
true_tail_markov_w = np.exp(-a_markov_w / mean_markov_w)  # Use the exact exponential tail P(X >= a)=exp(-a/mean).
bound_markov_w = mean_markov_w / a_markov_w  # Compute Markov's bound E[X]/a.
print("true P(X >= a):", round(true_tail_markov_w, 4))  # Print the actual tail probability.
print("Markov bound E[X]/a:", round(bound_markov_w, 4))  # Print the guaranteed upper bound.
```
▶ What you'll see: the bound is above the true probability, but it is noticeably loose.

```python
samples_markov_w = np.random.exponential(scale=mean_markov_w, size=20000)  # Simulate many nonnegative observations from the same distribution.
est_tail_markov_w = np.mean(samples_markov_w >= a_markov_w)  # Estimate P(X >= a) by counting simulated exceedances.
print("simulated P(X >= a):", round(est_tail_markov_w, 4))  # Print the Monte Carlo estimate for comparison.
print("bound still valid?", est_tail_markov_w <= bound_markov_w)  # Check that the simulated tail sits below Markov's bound.
```
▶ What you'll see: the simulation lands near the true tail and below the bound.

```python
mu_cheb_w = 1.0  # The exponential mean is mu=1.
sigma2_cheb_w = 1.0  # The exponential variance is sigma^2=1.
c_cheb_w = 2.0  # The event |X - mu| >= 2 equals X >= 3 here because X is nonnegative.
true_tail_cheb_w = np.exp(-(mu_cheb_w + c_cheb_w))  # Compute the exact probability of X >= 3.
bound_cheb_w = sigma2_cheb_w / (c_cheb_w ** 2)  # Compute Chebyshev's variance-based bound sigma^2/c^2.
est_tail_cheb_w = np.mean(np.abs(samples_markov_w - mu_cheb_w) >= c_cheb_w)  # Estimate the same two-sided deviation probability.
print("true P(|X-mu| >= c):", round(true_tail_cheb_w, 4))  # Print the exact deviation probability.
print("simulated P(|X-mu| >= c):", round(est_tail_cheb_w, 4))  # Print the simulated deviation probability.
print("Chebyshev bound sigma^2/c^2:", round(bound_cheb_w, 4))  # Print the Chebyshev upper bound.
```
Chebyshev is often loose because it knows only the variance, not the distribution's shape. Its strength is that it works for every finite-variance distribution, even when the tail is not exponential.
▶ What you'll see: Chebyshev is valid but even more conservative than the exact exponential calculation.

```python
labels_bounds_w = ["Markov\\ntrue", "Markov\\nbound", "Chebyshev\\ntrue", "Chebyshev\\nbound"]  # Name each bar in the comparison.
heights_bounds_w = [true_tail_markov_w, bound_markov_w, true_tail_cheb_w, bound_cheb_w]  # Store true probabilities and bounds.
colors_bounds_w = ["tab:blue", "tab:orange", "tab:blue", "tab:orange"]  # Use blue for truth and orange for bounds.
plt.figure(figsize=(6.2, 3.8))  # Create a compact bar chart.
plt.bar(labels_bounds_w, heights_bounds_w, color=colors_bounds_w, edgecolor="black")  # Draw the true probabilities beside their upper bounds.
plt.ylabel("probability")  # Label the probability scale.
plt.title("1: Markov and Chebyshev are loose upper bounds")  # Title the figure with the concept number.
plt.ylim(0.0, 0.38)  # Leave space above the tallest bound.
plt.show()  # Render the comparison.
```
▶ What you'll see: each orange bound bar sits above its blue true-probability bar, showing valid but loose guarantees.

*Why it's done this way: the examples separate truth, simulation, and theorem so you can see what the inequalities promise. Markov uses only mass times threshold, while Chebyshev applies Markov to squared distance from the mean so variance controls spread.*

#### 2. Sample mean and WLLN: averaging makes variance shrink like $\sigma^2/n$

The sample mean $\bar X_n$ is still random, but independence makes its variance shrink because averaging divides the sum by $n$. Variances of independent draws add to $n\sigma^2$, then the factor $(1/n)^2$ from the average leaves $\sigma^2/n$, so the mean concentrates around $\mu$. We simulate $n=1,10,100,1000$ to watch the distribution of averages tighten.

```python
mu_mean_w = 1.0  # Use Exponential(1), whose population mean is 1.
sigma2_mean_w = 1.0  # Use its variance sigma^2=1.
n_values_mean_w = np.array([1, 10, 100, 1000])  # Compare small to large sample sizes.
trials_mean_w = 5000  # Repeat each experiment many times to estimate the sampling distribution.
draws_mean_w = np.random.exponential(scale=mu_mean_w, size=(trials_mean_w, n_values_mean_w.max()))  # Draw all observations once up to the largest n.
print("n values:", n_values_mean_w)  # Print the sample sizes being compared.
print("population mean mu:", mu_mean_w)  # Print the target value predicted by the WLLN.
```
▶ What you'll see: the code sets up repeated averages for four growing sample sizes.

```python
means_by_n_w = np.column_stack([draws_mean_w[:, :n_w].mean(axis=1) for n_w in n_values_mean_w])  # Compute one sample mean per trial and n.
emp_mean_w = means_by_n_w.mean(axis=0)  # Estimate E[bar X_n] from the repeated sample means.
emp_var_w = means_by_n_w.var(axis=0, ddof=1)  # Estimate Var(bar X_n) from repeated sample means.
theory_var_w = sigma2_mean_w / n_values_mean_w  # Compute the theoretical sigma^2/n curve.
print("estimated E[bar X_n]:", np.round(emp_mean_w, 4))  # Show that the sample mean remains centered near mu.
print("estimated Var(bar X_n):", np.round(emp_var_w, 5))  # Show empirical variance shrinking.
print("theory sigma^2/n:", np.round(theory_var_w, 5))  # Show the exact variance shrinkage formula.
```
The $\sigma^2/n$ shrinkage is the engine of the WLLN: once the variance of $\bar X_n$ goes to zero, Chebyshev forces the probability of being far from $\mu$ to go to zero too.
▶ What you'll see: the empirical variances closely follow $1/n$.

```python
one_path_mean_w = np.random.exponential(scale=mu_mean_w, size=1000)  # Draw one long sequence to watch a single running average.
running_mean_w = np.cumsum(one_path_mean_w) / np.arange(1, len(one_path_mean_w) + 1)  # Convert cumulative sums into running sample means.
print("first five running means:", np.round(running_mean_w[:5], 3))  # Print early noisy averages.
print("last running mean:", round(running_mean_w[-1], 3))  # Print the final average after 1000 draws.
```
▶ What you'll see: early averages jump around, while the final average is much closer to $\mu=1$.

```python
plt.figure(figsize=(6.4, 3.8))  # Create a running-average figure.
plt.plot(np.arange(1, len(running_mean_w) + 1), running_mean_w, color="tab:blue", lw=1.5, label="running sample mean")  # Plot the path of bar X_n.
plt.axhline(mu_mean_w, color="black", ls="--", label="population mean mu")  # Mark the value the WLLN predicts.
plt.xlabel("n")  # Label the sample size axis.
plt.ylabel("running mean")  # Label the average value axis.
plt.legend(loc="best")  # Show the meaning of the line and target.
plt.title("2: running sample mean settles near mu")  # Title the convergence plot.
plt.show()  # Render the plot.
```
▶ What you'll see: the running average is noisy at first, then settles around the horizontal line at $\mu$.

```python
plt.figure(figsize=(6.4, 3.8))  # Create a variance-shrinkage figure.
plt.loglog(n_values_mean_w, emp_var_w, marker="o", label="simulated Var(bar X_n)")  # Plot empirical variance on log-log axes.
plt.loglog(n_values_mean_w, theory_var_w, marker="s", label="theory sigma^2/n")  # Plot the exact 1/n formula for comparison.
plt.xlabel("n")  # Label the sample size axis.
plt.ylabel("variance of sample mean")  # Label the variance axis.
plt.legend(loc="best")  # Show simulated versus theoretical curves.
plt.title("2: variance shrinks like sigma^2 / n")  # Title the variance plot.
plt.show()  # Render the shrinkage plot.
```
▶ What you'll see: the simulated variance falls almost exactly along the $\sigma^2/n$ reference curve.

*Why it's done this way: one plot shows a single average stabilizing, while the other shows the reason it stabilizes across many repetitions. The WLLN is concentration caused by independent averaging, not magic cancellation in one lucky run.*

#### 3. Convergence in probability: the error probability goes to zero

Convergence in probability asks a direct question: for a fixed tolerance $\epsilon$, how often is $\bar X_n$ still more than $\epsilon$ away from $\mu$? The WLLN says this probability must go to zero for every positive $\epsilon$. We estimate that probability by simulation, then compare it to Chebyshev's conservative upper bound.

```python
epsilon_prob_w = 0.12  # Choose a visible tolerance around the true mean.
n_values_prob_w = np.array([5, 10, 25, 50, 100, 250, 500, 1000])  # Use increasing sample sizes.
trials_prob_w = 6000  # Use many trials to estimate probabilities stably.
mu_prob_w = 0.5  # Use Uniform(0,1), whose mean is 1/2.
sigma2_prob_w = 1.0 / 12.0  # Use Uniform(0,1), whose variance is 1/12.
draws_prob_w = np.random.uniform(0.0, 1.0, size=(trials_prob_w, n_values_prob_w.max()))  # Draw all uniform samples up to the largest n.
print("epsilon:", epsilon_prob_w)  # Print the tolerance defining the convergence event.
print("target mu:", mu_prob_w)  # Print the value being approached in probability.
```
▶ What you'll see: the experiment fixes one tolerance and many sample sizes.

```python
prob_error_w = []  # Store estimated P(|bar X_n - mu| > epsilon) for each n.
for n_prob_w in n_values_prob_w:  # Loop over sample sizes.
    means_prob_w = draws_prob_w[:, :n_prob_w].mean(axis=1)  # Compute trial-by-trial sample means for this n.
    prob_error_w.append(np.mean(np.abs(means_prob_w - mu_prob_w) > epsilon_prob_w))  # Estimate the exceedance probability.
prob_error_w = np.array(prob_error_w)  # Convert the list to an array for plotting.
cheb_prob_w = sigma2_prob_w / (n_values_prob_w * epsilon_prob_w ** 2)  # Compute Chebyshev's WLLN upper bound.
cheb_prob_w = np.minimum(1.0, cheb_prob_w)  # Clip the bound at 1 because probabilities cannot exceed 1.
print("estimated error probabilities:", np.round(prob_error_w, 4))  # Print the simulated convergence-in-probability values.
print("Chebyshev upper bounds:", np.round(cheb_prob_w, 4))  # Print the conservative theorem bounds.
```
▶ What you'll see: the estimated probability drops toward zero as $n$ grows.

```python
plt.figure(figsize=(6.4, 3.8))  # Create the convergence-in-probability figure.
plt.plot(n_values_prob_w, prob_error_w, marker="o", lw=2, label="simulated probability")  # Plot estimated P(|bar X_n-mu| > epsilon).
plt.plot(n_values_prob_w, cheb_prob_w, marker="s", ls="--", label="Chebyshev bound")  # Plot the distribution-free upper bound.
plt.xlabel("n")  # Label the sample size axis.
plt.ylabel("P(|bar X_n - mu| > epsilon)")  # Label the probability being driven to zero.
plt.ylim(-0.02, 1.02)  # Keep the probability scale readable.
plt.legend(loc="best")  # Show simulated values versus the bound.
plt.title("3: convergence in probability means tail probability vanishes")  # Title the convergence plot.
plt.show()  # Render the figure.
```
▶ What you'll see: the simulated error probability rapidly approaches zero, while Chebyshev stays valid but loose.

*Why it's done this way: convergence in probability is not a statement about one path forever; it is a statement about the probability of missing by more than any fixed tolerance. Simulating many independent repeats estimates exactly that probability.*

#### 4. Central Limit Theorem: standardized averages become normal

The CLT looks at the remaining fluctuation after the WLLN has already centered the average near $\mu$. The right scale is $\sqrt{n}$ because the standard deviation of $\bar X_n$ is $\sigma/\sqrt{n}$, so multiplying $\bar X_n-\mu$ by $\sqrt{n}/\sigma$ keeps a non-degenerate amount of spread. We use exponential data, which are skewed and non-normal, to show that the standardized sample mean still approaches the standard normal shape.

```python
mu_clt_w = 1.0  # Exponential(1) has mean 1.
sigma_clt_w = 1.0  # Exponential(1) has standard deviation 1.
n_values_clt_w = np.array([1, 5, 30])  # Compare a raw draw, a small average, and a larger average.
trials_clt_w = 12000  # Use many repetitions so histograms are smooth.
x_grid_clt_w = np.linspace(-4.0, 4.0, 400)  # Create x-values for the standard normal curve.
normal_pdf_clt_w = (1.0 / np.sqrt(2.0 * np.pi)) * np.exp(-0.5 * x_grid_clt_w ** 2)  # Compute the N(0,1) density using NumPy only.
print("CLT source distribution:", "Exponential(1), skewed and non-normal")  # Print the non-normal source choice.
print("n values:", n_values_clt_w)  # Print the sample sizes used in the CLT comparison.
```
▶ What you'll see: the setup explicitly standardizes a skewed source distribution.

```python
z_by_n_clt_w = []  # Store standardized sample means for each n.
for n_clt_w in n_values_clt_w:  # Loop over the sample sizes.
    draws_clt_w = np.random.exponential(scale=mu_clt_w, size=(trials_clt_w, n_clt_w))  # Draw trials of n exponential observations.
    means_clt_w = draws_clt_w.mean(axis=1)  # Compute one sample mean per trial.
    z_clt_w = np.sqrt(n_clt_w) * (means_clt_w - mu_clt_w) / sigma_clt_w  # Standardize using sqrt(n)(bar X_n-mu)/sigma.
    z_by_n_clt_w.append(z_clt_w)  # Store the standardized values.
    print("n=", n_clt_w, "mean/std:", round(z_clt_w.mean(), 3), round(z_clt_w.std(ddof=1), 3))  # Print whether the standardized values are near mean 0 and sd 1.
```
The standardization matters: without $\sqrt{n}$, the sample-mean fluctuations collapse to zero; with $\sqrt{n}$, the CLT reveals their stable bell-shaped limit.
▶ What you'll see: standardized means have roughly mean 0 and standard deviation 1, especially as $n$ grows.

```python
fig_clt_w, axes_clt_w = plt.subplots(1, 3, figsize=(10.5, 3.4), sharey=True)  # Create one histogram per sample size.
for ax_clt_w, n_clt_w, z_clt_w in zip(axes_clt_w, n_values_clt_w, z_by_n_clt_w):  # Loop through axes, n values, and standardized samples.
    ax_clt_w.hist(z_clt_w, bins=45, density=True, alpha=0.65, color="tab:blue", edgecolor="white")  # Plot the simulated density of standardized means.
    ax_clt_w.plot(x_grid_clt_w, normal_pdf_clt_w, color="black", lw=2, label="N(0,1)")  # Overlay the standard normal density.
    ax_clt_w.set_title(f"n={n_clt_w}")  # Label each panel by sample size.
    ax_clt_w.set_xlabel("standardized mean")  # Label the standardized variable.
axes_clt_w[0].set_ylabel("density")  # Label the shared density axis once.
axes_clt_w[0].legend(loc="best")  # Show the normal-curve label.
fig_clt_w.suptitle("4: CLT turns standardized means normal")  # Title the full figure with the concept number.
plt.tight_layout()  # Prevent labels and titles from overlapping.
plt.show()  # Render the CLT comparison.
```
▶ What you'll see: the $n=1$ histogram is skewed, but by $n=30$ it closely tracks the standard normal curve.

*Why it's done this way: the source data are deliberately non-normal so the normal shape cannot be blamed on the input. Centering by $\mu$ and scaling by $\sigma/\sqrt{n}$ exposes the universal CLT fluctuation scale.*

#### 5. De Moivre--Laplace: a binomial pmf becomes a normal curve

A binomial random variable is a sum of $n$ independent Bernoulli$(p)$ variables, so it is a direct CLT example with mean $np$ and variance $np(1-p)$. De Moivre--Laplace says that for large $n$, the discrete binomial probabilities are well approximated by the continuous normal density with that same mean and variance. We compute the binomial pmf by recursion, then overlay the matching normal approximation for two different $n$ values.

```python
p_binom_w = 0.35  # Choose a success probability not too close to 0 or 1.
n_values_binom_w = np.array([20, 100])  # Compare a moderate binomial with a larger one.
print("p:", p_binom_w)  # Print the Bernoulli success probability.
print("n values:", n_values_binom_w)  # Print the binomial sizes being compared.
```
▶ What you'll see: the approximation test uses the same $p$ and two growing values of $n$.

```python
pmfs_binom_w = []  # Store exact binomial pmfs for each n.
approxs_binom_w = []  # Store normal-approximation heights for each n.
ks_binom_w = []  # Store integer support values for each n.
for n_binom_w in n_values_binom_w:  # Loop over binomial sizes.
    k_binom_w = np.arange(n_binom_w + 1)  # Create support k=0,...,n.
    pmf_binom_w = np.empty(n_binom_w + 1)  # Allocate space for exact binomial probabilities.
    pmf_binom_w[0] = (1.0 - p_binom_w) ** n_binom_w  # Start recursion at P(X=0).
    for k_step_w in range(n_binom_w):  # Recursively move from P(X=k) to P(X=k+1).
        pmf_binom_w[k_step_w + 1] = pmf_binom_w[k_step_w] * (n_binom_w - k_step_w) / (k_step_w + 1) * p_binom_w / (1.0 - p_binom_w)  # Use the binomial probability ratio.
    mu_binom_w = n_binom_w * p_binom_w  # Compute the binomial mean np.
    sigma_binom_w = np.sqrt(n_binom_w * p_binom_w * (1.0 - p_binom_w))  # Compute the binomial standard deviation sqrt(np(1-p)).
    approx_binom_w = (1.0 / (sigma_binom_w * np.sqrt(2.0 * np.pi))) * np.exp(-0.5 * ((k_binom_w - mu_binom_w) / sigma_binom_w) ** 2)  # Evaluate the matching normal density at integer k.
    pmfs_binom_w.append(pmf_binom_w)  # Store the exact pmf.
    approxs_binom_w.append(approx_binom_w)  # Store the normal approximation.
    ks_binom_w.append(k_binom_w)  # Store the integer support.
    print("n=", n_binom_w, "pmf sum:", round(pmf_binom_w.sum(), 6), "max abs diff:", round(np.max(np.abs(pmf_binom_w - approx_binom_w)), 4))  # Print pmf validity and approximation error.
```
The normal curve is continuous while the binomial is discrete, so the cleanest probability approximation uses continuity correction; this plot uses density heights at integer $k$ to make the shape match visually. The fit improves because the binomial sum contains more independent Bernoulli pieces as $n$ grows.
▶ What you'll see: the exact pmf sums to 1, and the largest pointwise difference is smaller for larger $n$.

```python
fig_binom_w, axes_binom_w = plt.subplots(1, 2, figsize=(10.0, 3.8))  # Create one panel for each n.
for ax_binom_w, n_binom_w, k_binom_w, pmf_binom_w, approx_binom_w in zip(axes_binom_w, n_values_binom_w, ks_binom_w, pmfs_binom_w, approxs_binom_w):  # Loop over panels and stored curves.
    ax_binom_w.bar(k_binom_w, pmf_binom_w, width=0.85, alpha=0.65, color="tab:blue", label="Binomial pmf")  # Draw exact discrete probabilities.
    ax_binom_w.plot(k_binom_w, approx_binom_w, color="black", lw=2, label="Normal approx")  # Overlay the matching normal density heights.
    ax_binom_w.set_xlabel("k successes")  # Label the success-count axis.
    ax_binom_w.set_ylabel("probability / density")  # Label the vertical scale.
    ax_binom_w.set_title(f"n={n_binom_w}, p={p_binom_w}")  # Label each panel by binomial parameters.
    ax_binom_w.legend(loc="best")  # Show the exact and approximating curves.
fig_binom_w.suptitle("5: De Moivre-Laplace binomial to normal")  # Title the full figure with the concept number.
plt.tight_layout()  # Keep panel labels readable.
plt.show()  # Render the binomial-normal overlays.
```
▶ What you'll see: the normal curve is rough for $n=20$ but hugs the binomial bars much better for $n=100$.

*Why it's done this way: building the pmf recursively makes the binomial probabilities inspectable without SciPy, and overlaying the matched normal shows De Moivre--Laplace as the CLT for Bernoulli sums. The same mean $np$ centers the curve, and the same variance $np(1-p)$ sets its width.*

### 🟢 Basics (warm-up)

#### B1. Compute one sample mean $M_n$ from three observations

Goal: compute the sample mean from three die rolls. This is the atomic operation inside LLN.

```python
three_rolls = np.array([2, 5, 6])  # Store three observed die rolls as a tiny sample.
n = len(three_rolls)  # Count the number of observations in the sample.
sample_sum = three_rolls.sum()  # Add the observations to form the numerator of the sample mean.
sample_mean = sample_sum / n  # Divide by n to compute M_n.
print(f"observations = {three_rolls}")  # Display the raw observations.
print(f"n = {n}")  # Display the sample size.
print(f"sum_i X_i = {sample_sum}")  # Display the sample sum.
print(f"M_n = (1/n) sum_i X_i = {sample_mean:.4f}")  # Display the sample mean.
```

▶ What you'll see: one sample mean, $M_3=13/3\approx4.3333$, which is above the fair-die mean $3.5$ because three rolls are still very noisy. 👀

#### B2. Plug values into the Markov ratio $\mathbb{E}[X]/a$

Goal: evaluate Markov's upper bound for a nonnegative random variable with mean $6$ and threshold $10$.

```python
expected_x = 6.0  # Store the known mean E[X] of a nonnegative random variable.
threshold_a = 10.0  # Store the positive threshold a in the event {X >= a}.
markov_bound = expected_x / threshold_a  # Compute Markov's ratio E[X] / a.
print(f"E[X] = {expected_x:.1f}")  # Display the mean used by the inequality.
print(f"a = {threshold_a:.1f}")  # Display the threshold used by the inequality.
print(f"P(X >= a) <= E[X]/a = {markov_bound:.4f}")  # Display the upper bound on the tail probability.
```

▶ What you'll see: Markov guarantees $\mathbb{P}(X\ge10)\le0.6$ using only $X\ge0$ and $\mathbb{E}[X]=6$. 👀

#### B3. Standardize one finite-variance sum into $Z_n$

Goal: convert a finite-variance sum into the CLT statistic

$$
Z_n=\frac{\sum_{i=1}^{n}(X_i-\mu)}{\sigma\sqrt n}.
$$

```python
n = 25  # Set the number of independent observations in the sum.
mu = 2.0  # Set the common mean of each observation.
sigma = 3.0  # Set the common standard deviation of each observation.
observed_sum = 65.0  # Store one observed value of sum_i X_i.
expected_sum = n * mu  # Compute the expected sum n mu.
sum_centered = observed_sum - expected_sum  # Center the observed sum by subtracting its expectation.
standard_error_sum = sigma * np.sqrt(n)  # Compute the standard deviation of the sum.
z_n = sum_centered / standard_error_sum  # Standardize the centered sum into the CLT statistic.
print(f"observed sum = {observed_sum:.1f}")  # Display the observed sum.
print(f"expected sum = n mu = {expected_sum:.1f}")  # Display the expected sum.
print(f"sigma sqrt(n) = {standard_error_sum:.1f}")  # Display the scaling factor.
print(f"Z_n = {z_n:.4f}")  # Display the standardized value.
```

▶ What you'll see: the observed sum is one standard deviation above its mean, so $Z_n=1$. 👀


#### B4. Compute the variance of a small sample

Goal: measure the spread of four observations with the sample variance formula.

```python
values_b4 = np.array([2.0, 4.0, 4.0, 6.0])  # Store a tiny sample with visible deviations.
mean_b4 = values_b4.mean()  # Compute the sample's center before measuring spread.
deviations_b4 = values_b4 - mean_b4  # Subtract the mean from every observation.
sample_variance_b4 = np.sum(deviations_b4 ** 2) / (len(values_b4) - 1)  # Divide squared deviations by n-1 for sample variance.
print(f"mean = {mean_b4:.2f}")  # Display the center used for deviations.
print(f"deviations = {deviations_b4}")  # Display each signed distance from the mean.
print(f"sample variance = {sample_variance_b4:.2f}")  # Display the final spread estimate.
```

▶ What you'll see: the sample variance is positive because the observations do not all equal their mean.

👀 **Takeaway:** variance is the average squared distance from the mean, with sample variance using $n-1$.

#### B5. Standardize one observation into a z-score

Goal: convert one raw value into the number of standard deviations above or below its mean.

```python
x_b5 = 74.0  # Store one observed value.
mu_b5 = 70.0  # Store the population mean.
sigma_b5 = 8.0  # Store the population standard deviation.
z_b5 = (x_b5 - mu_b5) / sigma_b5  # Standardize by subtracting the mean and dividing by the standard deviation.
print(f"z = ({x_b5:.1f} - {mu_b5:.1f}) / {sigma_b5:.1f} = {z_b5:.3f}")  # Display the z-score calculation.
```

▶ What you'll see: the value is half a standard deviation above the mean.

👀 **Takeaway:** standardization puts raw values on a common mean-zero, variance-one scale.

#### B6. Evaluate one Chebyshev bound

Goal: bound the probability of being at least $k=2$ standard deviations from the mean.

```python
k_b6 = 2.0  # Choose the number of standard deviations away from the mean.
chebyshev_bound_b6 = 1.0 / (k_b6 ** 2)  # Apply P(|X-mu| >= k sigma) <= 1/k^2.
print(f"P(|X - mu| >= {k_b6:.0f} sigma) <= {chebyshev_bound_b6:.3f}")  # Print the distribution-free bound.
```

▶ What you'll see: Chebyshev guarantees the two-standard-deviation tail is at most $0.25$.

👀 **Takeaway:** Chebyshev needs only a mean and variance, so its bound is conservative but universal.

#### B7. Draw one Bernoulli sample mean

Goal: simulate one tiny Bernoulli sample and average its zeros and ones.

```python
p_b7 = DATA_CONFIG["bernoulli"]["p"]  # Reuse the Bernoulli success probability from the lesson setup.
draws_b7 = rng.binomial(1, p_b7, size=4)  # Draw four independent zero-one outcomes.
mean_b7 = draws_b7.mean()  # Average the outcomes to estimate the success probability once.
print(f"draws = {draws_b7}")  # Display the simulated Bernoulli outcomes.
print(f"sample mean = {mean_b7:.3f}")  # Display the one-sample estimate.
```

▶ What you'll see: one four-flip average that may be above or below the true $p=0.6$.

👀 **Takeaway:** a Bernoulli sample mean is just the fraction of successes in that sample.

#### B8. Track running means of five observations

Goal: update the sample mean after each new number arrives.

```python
numbers_b8 = np.array([3.0, 5.0, 4.0, 6.0, 2.0])  # Store five observations in arrival order.
running_sums_b8 = np.cumsum(numbers_b8)  # Accumulate partial sums one observation at a time.
running_counts_b8 = np.arange(1, len(numbers_b8) + 1)  # Count how many observations have arrived at each step.
running_means_b8 = running_sums_b8 / running_counts_b8  # Divide each partial sum by its count.
print(f"running means = {running_means_b8}")  # Display the mean after each observation.
```

▶ What you'll see: the running mean moves after every new observation and ends at the full-sample mean.

👀 **Takeaway:** LLN simulations are built from repeated running-mean updates.

#### B9. Compute one coin-flip proportion

Goal: convert a short sequence of heads/tails into a success proportion.

```python
flips_b9 = np.array([1, 0, 1, 1, 0, 1])  # Encode heads as 1 and tails as 0.
heads_b9 = flips_b9.sum()  # Count heads by summing the indicator values.
proportion_b9 = heads_b9 / len(flips_b9)  # Divide heads by total flips.
print(f"heads = {heads_b9} out of {len(flips_b9)}")  # Display the count ratio.
print(f"proportion = {proportion_b9:.3f}")  # Display the empirical success probability.
```

▶ What you'll see: four heads in six flips gives a sample proportion of about $0.667$.

👀 **Takeaway:** a coin-flip proportion is a Bernoulli sample mean in disguise.

#### B10. Evaluate one normal density value

Goal: compute the height of the standard normal curve at one point.

```python
z_b10 = 1.0  # Choose one standardized location on the horizontal axis.
pdf_b10 = standard_normal_pdf(z_b10)  # Reuse the setup helper to evaluate the N(0,1) density.
print(f"phi({z_b10:.1f}) = {pdf_b10:.4f}")  # Display the density height at z=1.
```

▶ What you'll see: the standard normal density at $z=1$ is about $0.2420$.

👀 **Takeaway:** CLT overlays use normal density heights to draw the bell curve.

### 🟡 Easy

#### E1. Pen-and-paper: Markov bound for a nonnegative variable

**Problem.** Let $X\ge0$, $\mathbb{E}[X]=6$, and $a=10$. Bound $\mathbb{P}(X\ge10)$.

**Step 1: State Markov's inequality.**

For any nonnegative random variable and any $a>0$,

$$
\mathbb{P}(X\ge a)\le \frac{\mathbb{E}[X]}{a}.
$$

**Step 2: Substitute the threshold.**

Here $a=10$, so

$$
\mathbb{P}(X\ge10)\le \frac{\mathbb{E}[X]}{10}.
$$

**Step 3: Substitute the mean.**

Because $\mathbb{E}[X]=6$,

$$
\mathbb{P}(X\ge10)
\le \frac{6}{10}
=0.6.
$$

**Step 4: Interpret.**

The actual probability might be much smaller, but no distribution with $X\ge0$ and mean $6$ can force $\mathbb{P}(X\ge10)$ above $0.6$.

$$
\boxed{\mathbb{P}(X\ge10)\le0.6}
$$

#### E2. Pen-and-paper: Chebyshev bound around a mean

**Problem.** Let $\mathbb{E}[X]=50$ and $\sigma=4$. Bound $\mathbb{P}(|X-50|\ge8)$ and interpret the interval.

**Step 1: State Chebyshev's inequality.**

For any random variable with mean $\mu$ and variance $\sigma^2$,

$$
\mathbb{P}(|X-\mu|\ge c)\le\frac{\sigma^2}{c^2}.
$$

**Step 2: Identify the inputs.**

The mean is

$$
\mu=50,
$$

the standard deviation is

$$
\sigma=4,
$$

so the variance is

$$
\sigma^2=4^2=16.
$$

The deviation threshold is

$$
c=8.
$$

**Step 3: Substitute into Chebyshev.**

$$
\mathbb{P}(|X-50|\ge8)
\le \frac{16}{8^2}
=\frac{16}{64}
=\frac14
=0.25.
$$

**Step 4: Convert the complement into an interval statement.**

The event $|X-50|<8$ means

$$
-8<X-50<8.
$$

Add $50$ throughout:

$$
42<X<58.
$$

Since

$$
\mathbb{P}(|X-50|\ge8)\le0.25,
$$

the complement has probability at least

$$
\mathbb{P}(|X-50|<8)
=1-\mathbb{P}(|X-50|\ge8)
\ge1-0.25
=0.75.
$$

$$
\boxed{\mathbb{P}(|X-50|\ge8)\le0.25,\qquad \mathbb{P}(42<X<58)\ge0.75}
$$

#### E3. Coded: coin-flip sample means stabilize

We simulate Bernoulli$(p=0.6)$ coin flips. The running mean starts noisy, then drifts toward the true mean $p=0.6$.

```python
local_rng = np.random.default_rng(SEED + 3)  # Create a local generator so this example is reproducible by itself.
p = 0.6  # Set the true Bernoulli mean and success probability.
n_flips = 400  # Choose enough flips to see stabilization but keep the plot readable.
flips = local_rng.binomial(1, p, size=n_flips)  # Draw independent Bernoulli observations.
running_counts = np.cumsum(flips)  # Accumulate the number of successes through time.
time_index = np.arange(1, n_flips + 1)  # Build the sample-size axis from 1 to n_flips.
running_means = running_counts / time_index  # Divide cumulative successes by sample size to get M_n for every n.
final_mean = running_means[-1]  # Store the final sample mean for annotation.
plt.figure()  # Create a new figure for the running-mean path.
plt.plot(time_index, running_means, label="running sample mean $M_n$")  # Plot M_n as n grows.
plt.axhline(p, color="black", linestyle="--", label="true mean $p=0.6$")  # Draw the population mean as a reference line.
plt.xlabel("number of flips n")  # Label the horizontal axis by sample size.
plt.ylabel("sample mean")  # Label the vertical axis by average number of successes.
plt.title("E3: Bernoulli sample mean stabilizes")  # Give the plot a descriptive title.
plt.legend()  # Show the legend so the running mean and true mean are distinguished.
plt.show()  # Render the plot in the notebook.
print(f"Final M_{n_flips} = {final_mean:.4f}")  # Print the final sample mean as a numeric check.
print(f"Absolute error = {abs(final_mean - p):.4f}")  # Print the remaining distance from the population mean.
```

▶ What you'll see: the path is jagged early, but the fluctuations shrink around $0.6$ as $n$ increases. 👀

#### E4. Coded: dice-roll averages obey LLN

Now we draw many independent fair-die sequences and plot their running means together. Each path is random, but the band of paths tightens around $3.5$.

```python
local_rng = np.random.default_rng(SEED + 4)  # Create a local generator for this die simulation.
n_paths = 30  # Choose the number of independent running-mean trajectories to overlay.
n_rolls = 300  # Choose the length of each die-roll sequence.
die_rolls = local_rng.integers(1, 7, size=(n_paths, n_rolls))  # Draw a matrix of fair die rolls from 1 to 6.
cumulative_sums = np.cumsum(die_rolls, axis=1)  # Compute cumulative sums along each trajectory.
time_index = np.arange(1, n_rolls + 1)  # Build the sample-size axis.
running_means = cumulative_sums / time_index  # Broadcast division to compute every trajectory's running mean.
true_die_mean = 3.5  # Store the fair-die population mean.
plt.figure()  # Create a new figure for all trajectories.
for path_index in range(n_paths):  # Loop over trajectories so each path can be drawn lightly.
    plt.plot(time_index, running_means[path_index], color="tab:blue", alpha=0.25)  # Plot one running mean with transparency.
plt.axhline(true_die_mean, color="black", linestyle="--", label="true mean 3.5")  # Draw the theoretical mean.
plt.xlabel("number of rolls n")  # Label the horizontal axis by sample size.
plt.ylabel("running average")  # Label the vertical axis by die-roll average.
plt.title("E4: Many die-roll averages converge toward 3.5")  # Add a title describing the LLN pattern.
plt.legend()  # Show the legend for the population mean.
plt.show()  # Render the plot.
final_errors = np.abs(running_means[:, -1] - true_die_mean)  # Compute final absolute errors across paths.
summarize_array("Final absolute errors", final_errors)  # Summarize how close the paths are by n=300.
```

▶ What you'll see: individual trajectories differ, yet the cloud narrows around the fair-die mean $3.5$. 👀

#### E5. Coded: sample size vs error probability

We estimate $\mathbb{P}(|M_n-p|\ge\epsilon)$ by repeated Bernoulli experiments and compare it with Chebyshev's bound.

```python
local_rng = np.random.default_rng(SEED + 5)  # Create a local generator for repeated experiments.
p = 0.6  # Set the Bernoulli success probability and true mean.
variance = p * (1 - p)  # Compute the Bernoulli variance p(1-p).
epsilon = 0.08  # Choose the error tolerance in the event |M_n - p| >= epsilon.
sample_sizes = np.array([10, 20, 50, 100, 200, 500, 1000])  # Choose increasing n values to test WLLN behavior.
n_trials = 8000  # Choose many repeated experiments for stable Monte Carlo estimates.
empirical_probs = []  # Create an empty list to store simulated error probabilities.
chebyshev_bounds = []  # Create an empty list to store Chebyshev upper bounds.
for n in sample_sizes:  # Loop over sample sizes.
    samples = local_rng.binomial(1, p, size=(n_trials, n))  # Draw n_trials independent samples of size n.
    sample_means = samples.mean(axis=1)  # Compute one sample mean for each repeated experiment.
    error_events = np.abs(sample_means - p) >= epsilon  # Mark experiments whose sample mean misses by at least epsilon.
    empirical_probs.append(error_events.mean())  # Estimate the probability of the error event.
    chebyshev_bounds.append(min(1.0, variance / (n * epsilon**2)))  # Compute Chebyshev's bound and cap it at 1 for plotting.
empirical_probs = np.array(empirical_probs)  # Convert simulated probabilities to an array for plotting.
chebyshev_bounds = np.array(chebyshev_bounds)  # Convert bounds to an array for plotting.
plt.figure()  # Create a new figure for the probability curves.
plt.plot(sample_sizes, empirical_probs, marker="o", label="empirical $P(|M_n-p|\ge\epsilon)$")  # Plot simulated error probabilities.
plt.plot(sample_sizes, chebyshev_bounds, marker="s", linestyle="--", label="Chebyshev bound")  # Plot distribution-free upper bounds.
plt.xscale("log")  # Use a log x-axis because sample sizes grow multiplicatively.
plt.ylim(0, 1.05)  # Keep the probability axis in a natural range.
plt.xlabel("sample size n")  # Label the horizontal axis.
plt.ylabel("probability")  # Label the vertical axis.
plt.title("E5: Error probability shrinks as n grows")  # Add a title emphasizing WLLN.
plt.legend()  # Show the curve labels.
plt.show()  # Render the plot.
for n, empirical, bound in zip(sample_sizes, empirical_probs, chebyshev_bounds):  # Loop over results for a compact table.
    print(f"n={n:4d}  empirical={empirical:.4f}  Chebyshev_bound={bound:.4f}")  # Print each sample size with simulated and theoretical quantities.
```

▶ What you'll see: the empirical error probability decreases with $n$ and stays below the broad Chebyshev curve. 👀

### 🔴 Advanced

#### A1. Pen-and-paper: derive WLLN from Chebyshev

**Problem.** Let $X_1,X_2,\ldots$ be i.i.d. with $\mathbb{E}[X_i]=\mu$ and $\operatorname{Var}(X_i)=\sigma^2<\infty$. Define

$$
M_n=\frac1n\sum_{i=1}^{n}X_i.
$$

Show that for every $\epsilon>0$,

$$
\lim_{n\to\infty}\mathbb{P}(|M_n-\mu|\ge\epsilon)=0.
$$

**Step 1: Compute the mean of the sample mean.**

$$
\mathbb{E}[M_n]
=\mathbb{E}\left[\frac1n\sum_{i=1}^{n}X_i\right]
=\frac1n\sum_{i=1}^{n}\mathbb{E}[X_i]
=\frac1n\sum_{i=1}^{n}\mu
=\frac{n\mu}{n}
=\mu.
$$

**Step 2: Compute the variance of the sample mean.**

Because the $X_i$ are independent,

$$
\operatorname{Var}\left(\sum_{i=1}^{n}X_i\right)
=\sum_{i=1}^{n}\operatorname{Var}(X_i)
=\sum_{i=1}^{n}\sigma^2
=n\sigma^2.
$$

Scaling by $1/n$ gives

$$
\operatorname{Var}(M_n)
=\operatorname{Var}\left(\frac1n\sum_{i=1}^{n}X_i\right)
=\frac1{n^2}\operatorname{Var}\left(\sum_{i=1}^{n}X_i\right)
=\frac1{n^2}\cdot n\sigma^2
=\frac{\sigma^2}{n}.
$$

**Step 3: Apply Chebyshev to $M_n$.**

Since $M_n$ has mean $\mu$ and variance $\sigma^2/n$,

$$
\mathbb{P}(|M_n-\mu|\ge\epsilon)
\le
\frac{\operatorname{Var}(M_n)}{\epsilon^2}
=
\frac{\sigma^2/n}{\epsilon^2}
=
\frac{\sigma^2}{n\epsilon^2}.
$$

**Step 4: Take the limit.**

For fixed $\sigma^2<\infty$ and fixed $\epsilon>0$,

$$
\lim_{n\to\infty}\frac{\sigma^2}{n\epsilon^2}=0.
$$

Also probabilities are nonnegative, so

$$
0\le\mathbb{P}(|M_n-\mu|\ge\epsilon)
\le\frac{\sigma^2}{n\epsilon^2}.
$$

By the squeeze theorem,

$$
\lim_{n\to\infty}\mathbb{P}(|M_n-\mu|\ge\epsilon)=0.
$$

$$
\boxed{M_n\xrightarrow{p}\mu}
$$

#### A2. Coded: CLT for non-normal bounded data

Uniform$(0,1)$ data are not normal, but their standardized sample means become approximately normal as $n$ grows.

```python
local_rng = np.random.default_rng(SEED + 12)  # Create a local generator for the uniform CLT experiment.
n_trials = 12000  # Choose many repeated sample means to reveal the sampling distribution.
sample_sizes = [1, 5, 30, 100]  # Compare small, medium, and large sample sizes.
mu = 0.5  # Store the Uniform(0,1) mean.
sigma = np.sqrt(1 / 12)  # Store the Uniform(0,1) standard deviation.
x_grid = np.linspace(-4, 4, 500)  # Create x-values for the standard-normal overlay.
fig, axes = plt.subplots(2, 2, figsize=(10, 7), sharex=True, sharey=True)  # Create a 2-by-2 panel of histograms.
for ax, n in zip(axes.ravel(), sample_sizes):  # Loop over panels and sample sizes together.
    samples = local_rng.uniform(0.0, 1.0, size=(n_trials, n))  # Draw repeated samples from Uniform(0,1).
    sample_means = samples.mean(axis=1)  # Compute one sample mean per trial.
    z_values = np.sqrt(n) * (sample_means - mu) / sigma  # Standardize sample means into CLT units.
    ax.hist(z_values, bins=45, density=True, alpha=0.65, color="tab:blue", label="simulated $Z_n$")  # Plot the empirical standardized distribution.
    ax.plot(x_grid, standard_normal_pdf(x_grid), color="black", linewidth=2, label="$N(0,1)$")  # Overlay the standard normal density.
    ax.set_title(f"n = {n}")  # Title each panel by sample size.
    ax.set_xlabel("standardized value")  # Label each panel's x-axis.
    ax.set_ylabel("density")  # Label each panel's y-axis.
axes[0, 0].legend()  # Put one legend in the first panel to avoid clutter.
fig.suptitle("A2: Uniform sample means approach a normal shape")  # Add an overall title.
fig.tight_layout()  # Adjust spacing so titles and labels do not overlap.
plt.show()  # Render the multi-panel figure.
```

▶ What you'll see: $n=1$ is flat-ish like the original uniform distribution, while $n=30$ and $n=100$ closely follow the black normal curve. 👀

#### A3. Coded: CLT for skewed data

Exponential$(\lambda=1)$ data are strongly right-skewed. The CLT says the standardized average still becomes normal, though it may need more samples than bounded uniform data.

```python
local_rng = np.random.default_rng(SEED + 13)  # Create a local generator for the exponential CLT experiment.
n_trials = 12000  # Choose many repeated experiments to estimate the sampling distribution.
sample_sizes = [1, 5, 30, 100]  # Choose increasing sample sizes to watch skewness shrink.
mu = 1.0  # Store the Exponential(lambda=1) mean.
sigma = 1.0  # Store the Exponential(lambda=1) standard deviation.
x_grid = np.linspace(-4, 5, 600)  # Create x-values wide enough to show right skew for small n.
fig, axes = plt.subplots(2, 2, figsize=(10, 7), sharex=True, sharey=True)  # Create a 2-by-2 panel for the histograms.
for ax, n in zip(axes.ravel(), sample_sizes):  # Loop over each sample size and subplot.
    samples = local_rng.exponential(scale=1.0, size=(n_trials, n))  # Draw repeated exponential samples.
    sample_means = samples.mean(axis=1)  # Compute the mean within each repeated sample.
    z_values = np.sqrt(n) * (sample_means - mu) / sigma  # Standardize by the CLT scaling.
    empirical_skew = ((z_values - z_values.mean())**3).mean() / (z_values.std()**3)  # Estimate skewness to quantify asymmetry.
    ax.hist(z_values, bins=55, density=True, alpha=0.65, color="tab:orange", label="simulated $Z_n$")  # Plot the standardized empirical density.
    ax.plot(x_grid, standard_normal_pdf(x_grid), color="black", linewidth=2, label="$N(0,1)$")  # Overlay the standard-normal density.
    ax.set_title(f"n = {n}, skew ≈ {empirical_skew:.2f}")  # Show how skewness changes with n.
    ax.set_xlabel("standardized value")  # Label the x-axis.
    ax.set_ylabel("density")  # Label the y-axis.
axes[0, 0].legend()  # Add one legend for the full panel.
fig.suptitle("A3: Exponential sample means become less skewed")  # Add an overall title.
fig.tight_layout()  # Improve subplot spacing.
plt.show()  # Render the figure.
```

▶ What you'll see: the right tail is obvious for $n=1$, smaller by $n=30$, and much closer to normal by $n=100$. 👀

#### A4. Coded: binomial normal approximation with continuity correction

We compare exact binomial probabilities with normal approximations. The continuity correction replaces $\mathbb{P}(X=k)$ by the area from $k-1/2$ to $k+1/2$.

```python
n = 60  # Set the number of Bernoulli trials in the binomial distribution.
p = 0.35  # Set the success probability.
mu = n * p  # Compute the binomial mean np.
sigma = np.sqrt(n * p * (1 - p))  # Compute the binomial standard deviation sqrt(np(1-p)).
k_values = np.arange(0, n + 1)  # Create all possible binomial counts from 0 to n.
exact_pmf = binom.pmf(k_values, n, p)  # Compute the exact binomial probability mass function.
normal_no_cc = norm.pdf(k_values, loc=mu, scale=sigma)  # Approximate point masses by normal density heights without correction.
normal_with_cc = norm.cdf(k_values + 0.5, loc=mu, scale=sigma) - norm.cdf(k_values - 0.5, loc=mu, scale=sigma)  # Approximate masses by normal area over width-one bins.
window = (k_values >= int(mu - 4 * sigma)) & (k_values <= int(mu + 4 * sigma))  # Focus the plot on the high-probability region.
plt.figure(figsize=(9, 5))  # Create a figure for exact versus approximate probabilities.
plt.bar(k_values[window], exact_pmf[window], alpha=0.55, label="exact Binomial PMF")  # Plot exact probabilities as bars.
plt.plot(k_values[window], normal_no_cc[window], marker="o", linestyle="--", label="normal without correction")  # Plot density-height approximation.
plt.plot(k_values[window], normal_with_cc[window], marker="s", linestyle="-", label="normal with continuity correction")  # Plot continuity-corrected area approximation.
plt.xlabel("count k")  # Label the count axis.
plt.ylabel("probability")  # Label the probability axis.
plt.title("A4: De Moivre--Laplace normal approximation")  # Add a descriptive title.
plt.legend()  # Show all approximations in the legend.
plt.show()  # Render the plot.
mae_no_cc = np.mean(np.abs(exact_pmf - normal_no_cc))  # Compute mean absolute error without continuity correction.
mae_with_cc = np.mean(np.abs(exact_pmf - normal_with_cc))  # Compute mean absolute error with continuity correction.
print(f"Mean absolute error without correction: {mae_no_cc:.6f}")  # Print the no-correction error.
print(f"Mean absolute error with correction:    {mae_with_cc:.6f}")  # Print the corrected error.
for k in [15, 20, 25, 30]:  # Choose several representative counts near the center.
    exact = binom.pmf(k, n, p)  # Compute the exact probability at k.
    corrected = norm.cdf(k + 0.5, mu, sigma) - norm.cdf(k - 0.5, mu, sigma)  # Compute the corrected normal approximation at k.
    print(f"k={k:2d}  exact={exact:.5f}  corrected_normal={corrected:.5f}")  # Print a small comparison table.
```

▶ What you'll see: the continuity-corrected normal areas track the exact binomial bars better than raw density heights. 👀

#### A5. Coded failure/edge: heavy-tailed data breaks the usual variance story

Cauchy samples have no finite mean or variance. Their sample averages do not concentrate like Bernoulli, uniform, die, or exponential averages, so the standard WLLN/CLT assumptions are not cosmetic.

```python
local_rng = np.random.default_rng(SEED + 15)  # Create a local generator for the heavy-tail experiment.
n_paths = 12  # Choose several paths so instability is visible without overplotting too much.
n_steps = 1200  # Choose a long horizon where finite-variance means would usually settle.
cauchy_samples = local_rng.standard_cauchy(size=(n_paths, n_steps))  # Draw Cauchy observations with undefined mean and variance.
clipped_samples = np.clip(cauchy_samples, -100, 100)  # Clip only for plotting readability, not because the true distribution is bounded.
running_sums = np.cumsum(clipped_samples, axis=1)  # Accumulate clipped values along each path for visual comparison.
time_index = np.arange(1, n_steps + 1)  # Build the sample-size axis.
running_means = running_sums / time_index  # Compute running averages of the clipped display values.
plt.figure(figsize=(9, 5))  # Create a figure for unstable running averages.
for path_index in range(n_paths):  # Loop through the sample paths.
    plt.plot(time_index, running_means[path_index], alpha=0.65)  # Plot each running average path.
plt.axhline(0.0, color="black", linestyle="--", label="location 0, not a finite mean")  # Mark the Cauchy location parameter.
plt.ylim(-8, 8)  # Limit the y-axis so jumps and non-convergence are visible together.
plt.xlabel("sample size n")  # Label the horizontal axis.
plt.ylabel("running average of clipped Cauchy draws")  # Label the vertical axis honestly to note clipping.
plt.title("A5: Cauchy running averages remain unstable")  # Add a title emphasizing the edge case.
plt.legend()  # Show the reference line label.
plt.show()  # Render the path plot.
trial_sizes = [1, 10, 100]  # Choose sample sizes for histograms of sample means.
n_trials = 8000  # Choose many repeated sample means for the histogram comparison.
fig, axes = plt.subplots(1, 3, figsize=(12, 3.8), sharey=True)  # Create side-by-side histograms.
for ax, n in zip(axes, trial_sizes):  # Loop over sample sizes and histogram axes.
    samples = local_rng.standard_cauchy(size=(n_trials, n))  # Draw repeated Cauchy samples of size n.
    means = samples.mean(axis=1)  # Compute sample means, which remain Cauchy-distributed in spirit.
    displayed_means = means[np.abs(means) < 25]  # Keep a central window so the histogram is readable.
    ax.hist(displayed_means, bins=80, density=True, alpha=0.70, color="tab:red")  # Plot the visible central part of the sample-mean distribution.
    ax.set_title(f"n = {n}")  # Label each panel by sample size.
    ax.set_xlabel("sample mean, central window")  # Label the x-axis.
    ax.set_ylabel("density")  # Label the y-axis.
fig.suptitle("A5: Cauchy sample means do not narrow with n")  # Add an overall title for the histogram panel.
fig.tight_layout()  # Improve subplot spacing.
plt.show()  # Render the histograms.
```

▶ What you'll see: running averages can jump even late, and the sample-mean histograms do not collapse toward a narrow normal curve. 👀

### Interactive Experiment

Use the sliders to change the sample size and distribution. Finite-variance sources show LLN concentration and CLT-shaped standardized histograms; the Cauchy option shows why assumptions matter.

```python
@interact(  # Create an interactive control panel for the convergence experiment.
    n=IntSlider(value=30, min=1, max=300, step=1, description="sample n"),  # Add a slider for sample size.
    distribution=Dropdown(options=["bernoulli", "die", "uniform", "exponential", "cauchy"], value="uniform", description="source"),  # Add a dropdown for the data source.
)
def live_convergence_clt(n, distribution):  # Define the function that redraws whenever a widget value changes.
    local_rng = np.random.default_rng(SEED + 99)  # Reset the generator so widget comparisons isolate n and distribution.
    n_trials = 6000  # Use many repeated samples so the histogram is smooth but responsive.
    samples = draw_samples(distribution, (n_trials, n), local_rng)  # Draw repeated samples from the selected distribution.
    sample_means = samples.mean(axis=1)  # Compute one sample mean for each repeated sample.
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))  # Create side-by-side plots for LLN and CLT views.
    axes[0].hist(sample_means[np.isfinite(sample_means)], bins=60, density=True, alpha=0.70, color="tab:blue")  # Plot the distribution of sample means.
    axes[0].set_title(f"Sample means for {distribution}, n={n}")  # Title the LLN panel.
    axes[0].set_xlabel("sample mean")  # Label the LLN x-axis.
    axes[0].set_ylabel("density")  # Label the LLN y-axis.
    if distribution != "cauchy":  # Use theoretical mean and variance only for finite-variance sources.
        mu = DATA_CONFIG[distribution]["mean"]  # Look up the distribution mean.
        sigma = np.sqrt(DATA_CONFIG[distribution]["variance"])  # Look up the distribution standard deviation.
        z_values = np.sqrt(n) * (sample_means - mu) / sigma  # Standardize sample means into CLT units.
        x_grid = np.linspace(-4, 4, 500)  # Build a grid for the normal overlay.
        axes[0].axvline(mu, color="black", linestyle="--", label="true mean")  # Mark the true mean in the LLN panel.
        axes[0].legend()  # Show the true-mean label.
        axes[1].hist(z_values, bins=60, density=True, alpha=0.70, color="tab:green", label="simulated $Z_n$")  # Plot standardized sample means.
        axes[1].plot(x_grid, norm.pdf(x_grid), color="black", linewidth=2, label="$N(0,1)$")  # Overlay the standard-normal density.
        axes[1].set_xlim(-4, 4)  # Use a fixed CLT scale for comparison across n.
        axes[1].set_title("CLT standardized histogram")  # Title the CLT panel.
        axes[1].set_xlabel("standardized value")  # Label the CLT x-axis.
        axes[1].set_ylabel("density")  # Label the CLT y-axis.
        axes[1].legend()  # Show the histogram and normal labels.
        print(f"Mean of simulated sample means = {sample_means.mean():.4f}; true mean = {mu:.4f}")  # Print an LLN numeric summary.
    else:  # Handle the Cauchy edge case separately.
        central_means = sample_means[np.abs(sample_means) < 25]  # Keep a central window for a readable second histogram.
        axes[1].hist(central_means, bins=60, density=True, alpha=0.70, color="tab:red")  # Plot central Cauchy sample means.
        axes[1].set_title("No finite-variance CLT target")  # Title the edge-case panel.
        axes[1].set_xlabel("sample mean, central window")  # Label the Cauchy x-axis.
        axes[1].set_ylabel("density")  # Label the Cauchy y-axis.
        print("Cauchy has no finite mean or variance, so the usual WLLN/CLT formulas do not apply.")  # Print the key assumption warning.
    fig.tight_layout()  # Prevent labels from overlapping.
    plt.show()  # Render the interactive figure.
```

▶ What you'll see: increasing $n$ concentrates finite-variance sample means and makes the standardized histogram more normal, while Cauchy means remain stubbornly unstable. 👀
