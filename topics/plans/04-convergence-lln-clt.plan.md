# Lesson Plan — 04 Convergence of Random Variables (LLN & CLT)

| Field | Value |
|---|---|
| Source | Probability (MIT) |
| Content category | Formula/Theorem |
| Example type | ⚖️ Both |
| Colab notebook | Yes |
| Est. lesson time | 45–60 min |
| Source topic file | ../04-convergence-lln-clt.md |

## Part 1 — Overview (plan)
Convergence theorems explain why averages stabilize and why sums often look normal, even when individual observations are not. Hook: repeated randomness becomes predictable in two different senses — LLN pulls sample means toward $\mu$, while CLT gives the shape of their scaled fluctuations.

## Part 2 — Key Idea (plan)
- **Focus (per category = Formula/Theorem):** theorem statements + quick derivations/intuition, then simulation evidence that shows convergence and normal approximation improving with $n$.
- **Core artifacts to present:** Markov inequality $\mathbb{P}(X\ge a)\le\mathbb{E}[X]/a$ for $X\ge0$; Chebyshev inequality $\mathbb{P}(|X-\mu|\ge c)\le\sigma^2/c^2$; sample mean $M_n=\frac1n\sum_{i=1}^nX_i$; WLLN $\mathbb{P}(|M_n-\mu|\ge\epsilon)\to0$; convergence in probability; closure properties; CLT statistic $Z_n=\frac{1}{\sigma\sqrt n}\sum_{i=1}^n(X_i-\mu)$; binomial normal approximation $\mathcal{N}(np,np(1-p))$ and continuity correction.

## Part 3 — Worked Examples

### 🟢 Basics (10)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| B1 | Compute one sample mean $M_n$ from three observations | toy scalars: three die rolls | printed values | ~2 |
| B2 | Plug values into the Markov ratio $\mathbb{E}[X]/a$ | toy scalars: nonnegative $X$, mean, threshold | printed values | ~2 |
| B3 | Standardize one finite-variance sum into $Z_n$ | toy scalars: $n,\mu,\sigma,\sum_i X_i$ | printed values | ~3 |
| B4 | Compute the variance of a small sample | toy scalars: four observations | printed deviations and variance | ~3 |
| B5 | Standardize one observation into a z-score | toy scalars: $x,\mu,\sigma$ | printed z-score | ~2 |
| B6 | Evaluate one Chebyshev bound | toy scalars: one $k$ value | printed bound | ~2 |
| B7 | Draw one Bernoulli sample mean | Notebook: Bernoulli$(0.6)$ tiny sample | printed draws and mean | ~2 |
| B8 | Track running means of five observations | toy scalars: five ordered values | printed running means | ~2 |
| B9 | Compute one coin-flip proportion | toy binary flips | printed count and proportion | ~2 |
| B10 | Evaluate one normal density value | toy scalar: one $z$ value | printed pdf height | ~2 |

### 🟡 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | Pen-and-paper: Markov bound for a nonnegative variable | Lesson .md: $X\ge0$, $\mathbb{E}[X]=6$, threshold $a=10$ | N/A — inequality derivation table | ~3 |
| E2 | Pen-and-paper: Chebyshev bound around a mean | Lesson .md: $\mu=50$, $\sigma=4$, $c=8$ | N/A — bound and interval interpretation | ~3 |
| E3 | Coded: coin-flip sample means stabilize | Notebook: Bernoulli$(p=0.6)$ simulations | process: running mean path; result: horizontal true-mean line and shrinking deviations | ~4 |
| E4 | Coded: dice-roll averages obey LLN | Notebook: discrete uniform die rolls | process: many running means; result: band of trajectories collapsing toward $3.5$ | ~4 |
| E5 | Coded: sample size vs error probability | Notebook: Bernoulli$(0.6)$ repeated experiments | process: estimate $\mathbb{P}(|M_n-p|\ge\epsilon)$ for increasing $n$; result: empirical curve vs Chebyshev bound | ~5 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | Pen-and-paper: derive WLLN from Chebyshev | Lesson .md: i.i.d. $X_i$ with mean $\mu$, variance $\sigma^2$ | N/A — variance of $M_n$ and limiting probability bound | ~5 |
| A2 | Coded: CLT for non-normal bounded data | Notebook: Uniform$(0,1)$ samples | process: histogram of standardized sample means for $n=1,5,30,100$; result: normal curve overlay | ~6 |
| A3 | Coded: CLT for skewed data | Notebook: Exponential$(\lambda=1)$ samples | process: skew shrinking as $n$ grows; result: standardized histogram + $\mathcal{N}(0,1)$ overlay | ~6 |
| A4 | Coded: binomial normal approximation with continuity correction | Notebook: Binomial$(n,p)$ for several $n,p$ | process: exact PMF bars vs normal curve; result: error table with/without $1/2$ correction | ~6 |
| A5 | Coded failure/edge: heavy-tailed data breaks the usual variance story | Notebook: Cauchy samples (undefined mean/variance) | process: unstable running means; result: histograms of sample means that do not concentrate like LLN/CLT finite-variance cases | ~7 |

## Part 4 — Colab Notebook
- **Notebook file:** topics/notebooks/04-convergence-lln-clt.ipynb
- **Est. cell count:** ~70 (⚖️ topic → all 13 examples (3 basics + 5 easy + 5 advanced), mixing pen-and-paper derivations with coded/simulation build↔see loops)
- **Key libraries:** numpy, matplotlib, scipy.stats (`norm`, `binom`, `cauchy`), ipywidgets
- **Runtime:** CPU
- **Failure/edge dataset included:** Cauchy samples in A5 — demonstrates that sample means can remain unstable when finite-mean/finite-variance assumptions behind the standard LLN/CLT intuition are violated.
- **Signature visualizations:** running sample-mean trajectories converging to $\mu$; empirical error probability vs Chebyshev bound; standardized sample-mean histograms approaching a normal curve.
