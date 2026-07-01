# Math · Part 18 — Mathematical statistics / inference  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the shared
> exposition principles: warm voice, complete step-by-step derivations, case-by-case judgment, and named
> symbols. Numbers below were checked with `python3` using `numpy`, `scipy`, and direct algebra from this repo.

**Section:** Mathematical statistics / inference · **Lessons:** 30 · **Breadcrumb:** `Mathematics · Probability & Statistics` · **Priority:** HIGH

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| Near-boilerplate §5 number pattern using the same SE / z-score / interval arithmetic | 14 / 30 |
| Templated / thin motivation, concentrated in `math-18-18…30` | 13 / 30 |
| Key formula not in display form or not fully derived | 13 / 30 |
| Assert-not-derive definitions needing a complete derivation | 28 / 30 |
| Explain-only lessons, where forcing a proof would be fake | 2 / 30 |
| Genuine LaTeX bug: unclosed `$` or lost matrix row break | 0 / 30 |

## Priority & systemic issues

- **Duplicated numbers despite different titles.** `math-18-17…30` repeatedly use the same six numerical shapes: `0.12/0.03=4`, `0.006/0.002=3`, baseline `10` to `10.6`, halved SE, gap `0.04/0.015`, and `0.20\pm1.96(0.05)`. Replace each with numbers that require that lesson's concept.
- **Assertions before derivations.** Core formulas are stated correctly but need the missing steps: MSE = variance + bias squared, method of moments equations, MLE score equation, Fisher information identities, Cramér-Rao via Cauchy-Schwarz, confidence intervals from pivots, test statistics, likelihood-ratio statistics, bootstrap standard errors, normal equations, and bias-variance decomposition.
- **Conceptual lessons stay conceptual.** `math-18-01` and `math-18-26` are explain-only: they should define the object carefully and use numbers in applications, not force a proof where the lesson is about vocabulary and method families.
- **LaTeX.** No genuine unclosed-dollar or matrix-row bugs were found in the dump. Keep formulas in display form when authored.

---

## Model entry (full prose): `math-18-12` — Maximum Likelihood Estimation (MLE)

**Connections (§1).**
> This lesson builds on probability models, samples, and point estimation. Earlier lessons describe an
> estimator as a rule computed from data. Maximum likelihood adds a disciplined way to choose that rule: write
> down the probability of the observed data under each possible parameter value, then choose the parameter
> that makes the observations most plausible.
>
> This idea connects directly to machine learning. Bernoulli likelihood leads to logistic regression and
> cross-entropy. Gaussian likelihood leads to least squares. Poisson and exponential likelihoods fit counts
> and waiting times. Later lessons use the same likelihood curve to define Fisher information, asymptotic
> standard errors, likelihood-ratio tests, and MAP estimation.

**Motivation & Intuition (§2).**
> A parameter value is not judged by whether it could have produced the data; many values usually could. MLE
> asks for the value under which the observed sample is most likely. For Bernoulli data with 7 successes in 10
> trials, a parameter near $p=0.7$ should fit better than $p=0.2$, because the data contain many successes.
>
> The likelihood is the probability of the observed data, but read as a function of the parameter. That shift
> is the central move. The data are fixed after observation; the parameter is the variable being compared. Logs
> are used because they turn products into sums and keep the same maximizer.

**Definition & Assumptions (§3).** Display
$$
\mathcal L(\theta)=\prod_{i=1}^n f(x_i\mid\theta),\qquad
\ell(\theta)=\log \mathcal L(\theta),\qquad
\hat\theta_{MLE}=\arg\max_\theta \ell(\theta).
$$
Then derive the Bernoulli MLE from the score equation:
1. For $s$ successes and $n-s$ failures, write the likelihood as $\mathcal L(p)=p^s(1-p)^{n-s}$ because independent probabilities multiply.
2. Take logs to get $\ell(p)=s\log p+(n-s)\log(1-p)$ because logs preserve the maximizer and simplify powers.
3. Differentiate one term at a time: $\ell'(p)=s/p-(n-s)/(1-p)$ because $d\log(1-p)/dp=-1/(1-p)$.
4. Set the score to zero: $s/p=(n-s)/(1-p)$ because an interior maximum has zero first derivative.
5. Cross-multiply: $s(1-p)=(n-s)p$ to remove denominators.
6. Expand and collect: $s-sp=np-sp$, so $s=np$.
7. Divide by $n$: $\hat p=s/n$.
8. For $s=7,n=10$, $\hat p=7/10=0.7$; the second derivative $-s/p^2-(n-s)/(1-p)^2<0$ confirms a maximum.

**Symbols.** $x_i$ is the observed data point; $f(x_i\mid\theta)$ is the model probability or density at that observation; $\theta$ is the unknown parameter; $\mathcal L$ is likelihood; $\ell$ is log-likelihood; $\hat\theta_{MLE}$ is the maximizing estimate; $s$ is the number of successes; $p$ is a Bernoulli success probability.

**Real-World Applications (§5).** (1) **Logistic regression** uses Bernoulli likelihood; labels with predicted probabilities $0.8$ and $0.6$ have negative log-likelihood $-\log0.8-\log0.6\approx0.734$. (2) **Naive Bayes word probabilities** use count MLEs; $30$ word occurrences in $1000$ class tokens gives $\hat p=0.03$. (3) **Poisson traffic modeling** gives $\hat\lambda=\bar x$; counts $4,5,6$ give $5$. (4) **Gaussian residual variance** has MLE $RSS/n$; $RSS=20,n=10$ gives $2$. (5) **Language modeling** maximizes token likelihood; probabilities $0.1,0.2$ give log-likelihood $\log0.1+\log0.2\approx-3.912$. (6) **Exponential waiting times** give rate MLE $1/\bar x$; mean wait $8$ minutes gives $0.125$ per minute.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted content in render order. The labels are plan shorthand only; the app should become flowing prose in the same plain textbook voice as the model entry.

### `math-18-01` — Populations and samples  · explain-only · deepen §5

**Connections (§1).**
> This lesson starts the inference vocabulary that every later statistical method depends on. Probability lessons describe random variables and distributions; inference begins by naming the real group of interest and the observed part of that group. Once population and sample are separated, later ideas such as bias, standard error, confidence intervals, and tests have a clear target.

**Motivation & Intuition (§2).**
> Inference starts by separating the full group you care about from the part you actually observe. A sample can be large and still not answer the intended question if the population was named poorly or the sampling process misses important cases. The first statistical move is therefore not a formula, but a modeling boundary: who or what belongs in the population, and how did observations enter the dataset?
>
> The sample is useful only after the target population and sampling process are named. Representativeness means the observed cases carry information about the population parameter, while frame error means the sampling mechanism systematically leaves out part of the target group. A sample statistic is then a data summary, and a population parameter is the fixed quantity that summary is trying to learn.

**Definition & Assumptions (§3).** **Explain-only.** This is a vocabulary and modeling-boundary lesson. Explain population, sample, parameter, statistic, frame error, and representativeness; do not force a proof.

**Symbols.** $X_1,\ldots,X_n$ observed sampled values; $n$ sample size; $\mu$ population mean; $\bar X$ sample mean; $N$ finite population size when relevant.

**Real-World Applications (§5).** (1) **User research sample:** $96$ clicks among $800$ sampled users gives sample CTR $0.12$. (2) **Test-set sample:** $450/500=0.90$ estimates deployment accuracy. (3) **Polling sample:** $540/1000=0.54$ estimates electorate support. (4) **Label audit:** $7/200=0.035$ sample error rate estimates corpus error. (5) **Latency sample:** $80,90,110,120$ ms has sample mean $100$ ms. (6) **Stratified audit:** $40$ examples from each of $5$ regions gives $200$ sampled recommendations.

---

### `math-18-02` — Statistics and estimators  · AUTHOR derivation

**Connections (§1).**
> This lesson builds on samples and population parameters. A statistic is any rule that uses only the observed data, while an estimator is a statistic used with a particular inferential purpose. That distinction prepares the ground for later lessons on bias, variance, MSE, consistency, and efficiency.

**Motivation & Intuition (§2).**
> A statistic is any data-only recipe. It can be a mean, median, maximum, count, percentile, or any other quantity computed after the sample is observed. The rule is not allowed to use the unknown parameter itself; it must be computable from the data alone.
>
> It becomes an estimator when the recipe is chosen to learn a specific population parameter. The same statistic may be useful for description in one setting and estimation in another. For the sample mean, the important fact is that its long-run center equals the population mean when the draws share that mean.

**Definition & Assumptions (§3).** For $\bar X$ as an estimator of $\mu$: (1) define $\bar X=\frac1n\sum_iX_i$ from the sample; (2) take expectation of both sides; (3) use linearity, $E[\bar X]=\frac1n\sum_iE[X_i]$; (4) if all draws have mean $\mu$, substitute to get $\frac1n(n\mu)=\mu$; (5) conclude $\bar X$ targets $\mu$ without systematic long-run shift.

**Symbols.** $T(X_1,\ldots,X_n)$ statistic; $\hat\theta$ estimator; $\theta$ target parameter; $\bar x$ realized estimate.

**Real-World Applications (§5).** (1) **CTR estimator:** $37/1000=0.037$. (2) **Latency mean:** $(40+50+70+80)/4=60$ ms. (3) **Robust center:** $2,3,4,100$ has median $3.5$ and mean $27.25$. (4) **Error-rate estimator:** $9/150=0.06$. (5) **Quantile statistic:** median of $10,20,30,40,50$ is $30$. (6) **Feature centering:** $1.2,1.5,1.8$ gives mean $1.5$.

---

### `math-18-03` — Descriptive statistics  · AUTHOR derivation

**Connections (§1).**
> This lesson connects raw data to the summaries used before formal inference. Earlier lessons define samples; descriptive statistics make those samples readable by reporting center, spread, and shape. Later inference lessons use these summaries as estimates, diagnostics, and inputs to standard errors.

**Motivation & Intuition (§2).**
> Descriptive statistics compress observed data into center, spread, and shape before any population claim is made. They help reveal the scale of the measurements, whether a few values dominate the average, and whether groups look broadly comparable before a model is fitted.
>
> The key point is that description is still about the observed dataset. A sample mean or variance may later become part of an estimator, but descriptive work first asks what the sample itself says. The sample variance example shows why spread is measured through deviations from the sample mean and why the denominator accounts for using that mean.

**Definition & Assumptions (§3).** For sample variance on $2,4,4,6,9$: (1) compute $\bar x=25/5=5$; (2) subtract the mean to get deviations $-3,-1,-1,1,4$; (3) square them to get $9,1,1,1,16$; (4) add to get $28$; (5) divide by $n-1=4$ because one degree of freedom is used by $\bar x$; (6) get $s^2=7$.

**Symbols.** $\bar x$ sample mean; $s^2$ sample variance; $x_i-\bar x$ deviation; IQR interquartile range.

**Real-World Applications (§5).** (1) **Feature scaling:** values $10,12,18$ have mean $13.33$ and range $8$. (2) **Class imbalance:** $50/1000=0.05$ positives. (3) **Latency percentile:** a 95th percentile of $240$ ms means about $95\%$ are no larger. (4) **Outlier effect:** $5,6,5,7,100$ has median $6$ and mean $24.6$. (5) **Balance check:** treatment mean age $35.5$ minus control $35.2$ is $0.3$. (6) **Batch loss:** $0.2,0.3,0.5$ average to $0.333$.

---

### `math-18-04` — Sampling distributions  · AUTHOR derivation

**Connections (§1).**
> This lesson moves from describing one sample to understanding how a statistic varies across possible samples. Probability gives distributions for random variables; sampling distributions give distributions for data summaries. They are the foundation for standard errors, confidence intervals, tests, and large-sample approximations.

**Motivation & Intuition (§2).**
> A sampling distribution describes how a statistic would move across repeated samples, which is the source of standard errors. Even if the population parameter is fixed, different random samples usually produce different sample means, proportions, or regression coefficients. The sampling distribution is the probability model for that variation.
>
> The practical value is that uncertainty can be attached to an estimate. For an average of independent observations, the individual variances add but the averaging factor shrinks the result. That is why the standard error falls like $1/\sqrt n$ rather than like $1/n$.

**Definition & Assumptions (§3).** For independent draws with variance $\sigma^2$: (1) define $\bar X=\frac1n\sum_iX_i$; (2) apply variance scaling, $\operatorname{Var}(cY)=c^2\operatorname{Var}(Y)$; (3) get $\operatorname{Var}(\bar X)=\frac1{n^2}\operatorname{Var}(\sum_iX_i)$; (4) use independence to add variances; (5) substitute $n\sigma^2$; (6) simplify to $\sigma^2/n$; (7) take the square root for $SE=\sigma/\sqrt n$.

**Symbols.** $T$ statistic; sampling distribution = distribution of $T$ over repeated samples; $SE$ standard error; $\sigma$ population SD.

**Real-World Applications (§5).** (1) **Mean interval width:** estimate $0.60$, SE $0.05$ gives rough interval $[0.50,0.70]$. (2) **Difference of rates:** two SEs $0.01$ combine to $\sqrt{0.01^2+0.01^2}=0.0141$. (3) **Accuracy SE:** $p=0.90,n=100$ gives $0.03$. (4) **Simulation average:** $\sigma=5,n=10{,}000$ gives SE $0.05$. (5) **Poll margin:** $p=0.5,n=1600$ gives SE $0.0125$. (6) **Latency mean:** sample SD $30$, $n=900$ gives SE $1$ ms.

---

### `math-18-05` — Point estimation  · AUTHOR derivation

**Connections (§1).**
> This lesson builds on statistics, estimators, and sampling distributions. A point estimator returns one data-based value for an unknown parameter. Later lessons explain how to judge that value through bias, variance, MSE, consistency, and intervals.

**Motivation & Intuition (§2).**
> A point estimate is the single number a data rule returns for an unknown parameter. It is the natural first summary when the goal is to learn a mean, rate, probability, variance, or coefficient. The number gives a center for the inference, but by itself it does not say how much random sampling error remains.
>
> For Bernoulli data, the sample proportion is the most direct point estimate of the success probability. The count of successes is divided by the number of trials, and the resulting estimate has a sampling variance determined by both the probability and the sample size. That variance is why point estimation leads immediately to standard errors.

**Definition & Assumptions (§3).** For Bernoulli $p$: (1) let $X_i=1$ for success and $0$ otherwise; (2) the total successes are $S=\sum_iX_i$; (3) the sample proportion is $\hat p=S/n$; (4) since $E[X_i]=p$, $E[\hat p]=p$; (5) since $\operatorname{Var}(X_i)=p(1-p)$, $\operatorname{Var}(\hat p)=p(1-p)/n$; (6) estimate SE with $\sqrt{\hat p(1-\hat p)/n}$.

**Symbols.** $\hat\theta$ point estimator; $\hat p$ sample proportion; $S$ success count; $n$ trials.

**Real-World Applications (§5).** (1) **CTR:** $240/20{,}000=0.012$. (2) **Demand mean:** $90,110,100$ averages to $100$. (3) **Failure probability:** $3/500=0.006$. (4) **Noise variance MLE:** residual squares $1,1,4,4$ average to $2.5$. (5) **Average loss:** $0.2,0.3,0.4$ averages to $0.3$. (6) **Embedding coverage:** $965/1000=0.965$.

---

### `math-18-06` — Bias of an estimator  · AUTHOR derivation

**Connections (§1).**
> This lesson begins the quality checks for estimators. Once a statistic is used to estimate a parameter, its long-run center matters as much as its observed value. Bias will later combine with variance to form MSE and to explain the bias–variance tradeoff.

**Motivation & Intuition (§2).**
> Bias is the long-run offset between where an estimator is centered and the parameter it is meant to estimate. It is not the error in one sample; a particular sample can be high or low for random reasons. Bias describes the average behavior over repeated samples from the same data-generating process.
>
> An unbiased estimator is centered correctly, but that does not automatically make it best. It may still be highly variable. The contrast between $\bar X$ and $\bar X+3$ shows the basic calculation: changing the estimator by a constant shifts its expectation by the same amount.

**Definition & Assumptions (§3).** (1) Start from $\operatorname{Bias}(\hat\theta)=E[\hat\theta]-\theta$. (2) For $\bar X$, compute $E[\bar X]=\mu$ by linearity. (3) Substitute into the bias formula to get $0$. (4) For $T=\bar X+3$, compute $E[T]=\mu+3$. (5) Subtract $\mu$ to get bias $3$.

**Symbols.** $E[\hat\theta]$ sampling-distribution center; $\theta$ target; unbiased means bias $0$.

**Real-World Applications (§5).** (1) **Survey bias:** expected $0.51$ versus true $0.48$ gives $0.03$. (2) **Easy validation set:** $0.92-0.87=0.05$. (3) **Ridge shrinkage:** expected $8$ for true $10$ gives $-2$. (4) **Variance denominator $n$:** expectation $0.9\sigma^2$ at $n=10$ has bias $-0.1\sigma^2$. (5) **Sensor offset:** $101.5-100=1.5$. (6) **Logged data bias:** $0.08-0.05=0.03$.

---

### `math-18-07` — Variance of an estimator  · AUTHOR derivation

**Connections (§1).**
> This lesson pairs with bias as the second basic measure of estimator behavior. A centered estimator can still be unreliable if it changes a lot from sample to sample. Variance and standard error become the language used for intervals, tests, power, and efficiency.

**Motivation & Intuition (§2).**
> Estimator variance measures how much the estimate jitters from one sample to another, even when it is centered correctly. It is a property of the sampling distribution, not just the spread of the observed data. A low-variance estimator tends to give similar answers when the study is repeated under the same conditions.
>
> Averages reduce variance because independent fluctuations partly cancel. The derivation for $\bar X$ shows the two ingredients: scaling by $1/n$ contributes a squared factor, and independence lets the individual variances add. Taking the square root gives the standard error, the usual scale for estimator uncertainty.

**Definition & Assumptions (§3).** (1) Define $\operatorname{Var}(\hat\theta)=E[(\hat\theta-E\hat\theta)^2]$. (2) For $\bar X$, write $\bar X=\frac1n\sum_iX_i$. (3) pull out $1/n^2$ from the variance; (4) add independent variances; (5) simplify $n\sigma^2/n^2=\sigma^2/n$; (6) define $SE=\sigma/\sqrt n$.

**Symbols.** Variance is squared spread; SE is estimator SD; $n$ controls averaging.

**Real-World Applications (§5).** (1) **Power planning:** halving SE from $0.02$ to $0.01$ needs about four times $n$. (2) **Leaderboard noise:** gain $0.003$ with SE $0.006$ is $0.5$ SE. (3) **Ensemble average:** four independent estimates with variance $0.04$ average to variance $0.01$. (4) **Sensor fusion:** nine readings with SD $3$ give SE $1$. (5) **Monte Carlo:** runs $10{,}000$ to $40{,}000$ halve SE. (6) **Mini-batch gradient:** variance $64/256=0.25$.

---

### `math-18-08` — Mean squared error  · AUTHOR derivation

**Connections (§1).**
> This lesson combines the two estimator-quality ideas just introduced. Bias describes systematic offset, and variance describes sampling spread. Mean squared error puts both into one squared-error criterion that is useful for comparing estimators.

**Motivation & Intuition (§2).**
> MSE combines systematic aiming error and random wobble into one squared-error measure. It asks how far the estimator is from the target on average after squaring the error. Squaring makes positive and negative errors contribute in the same direction and penalizes larger misses more strongly.
>
> The decomposition is useful because it separates two reasons an estimator can perform poorly. An estimator may be centered at the wrong value, or it may be centered correctly but very noisy. Adding and subtracting the estimator's expectation shows that these contributions become variance plus squared bias.

**Definition & Assumptions (§3).** (1) Start with $\operatorname{MSE}(\hat\theta)=E[(\hat\theta-\theta)^2]$. (2) Add and subtract $E\hat\theta$: $\hat\theta-\theta=(\hat\theta-E\hat\theta)+(E\hat\theta-\theta)$. (3) Square the sum. (4) Take expectations term by term. (5) The cross term is zero because $E[\hat\theta-E\hat\theta]=0$. (6) Recognize variance plus squared bias: $\operatorname{MSE}=\operatorname{Var}(\hat\theta)+\operatorname{Bias}(\hat\theta)^2$.

**Symbols.** MSE average squared error; bias long-run offset; variance long-run spread.

**Real-World Applications (§5).** (1) **Model selection:** variance $0.10$ plus bias squared $0.04$ gives MSE $0.14$. (2) **Ridge tradeoff:** variance $9$ to $4$ with bias $1$ lowers MSE from $9$ to $5$. (3) **Forecast errors:** $2,-1,3$ give MSE $14/3$. (4) **Image pixels:** errors $5,-3,1$ give MSE $35/3$. (5) **Estimator choice:** variance $1$ and bias $0.5$ gives MSE $1.25$. (6) **Smoothing:** raw MSE $0.020$ versus smoothed $0.015$ favors smoothing.

---

### `math-18-09` — Consistency  · AUTHOR derivation

**Connections (§1).**
> This lesson shifts from finite-sample quality to what happens as data accumulate. Bias, variance, and MSE describe estimator behavior at a given sample size. Consistency asks whether the estimator eventually concentrates near the true parameter.

**Motivation & Intuition (§2).**
> Consistency says that more data eventually concentrates the estimator near the true parameter. It does not require every finite sample to be accurate, and it does not say that small samples are safe. It says that, for any fixed tolerance, the probability of missing the target by more than that tolerance goes to zero.
>
> One clean route to consistency uses MSE. If the average squared error tends to zero, then large errors must become unlikely. Markov's inequality turns that statement into a probability bound, and the sample mean fits the pattern because its variance shrinks like $\sigma^2/n$.

**Definition & Assumptions (§3).** (1) Define consistency as $P(|\hat\theta_n-\theta|>\epsilon)\to0$. (2) Apply Markov to the nonnegative variable $(\hat\theta_n-\theta)^2$. (3) Get $P(|\hat\theta_n-\theta|>\epsilon)=P((\hat\theta_n-\theta)^2>\epsilon^2)\le \operatorname{MSE}(\hat\theta_n)/\epsilon^2$. (4) If MSE tends to zero, the upper bound tends to zero. (5) For $\bar X$, MSE $=\sigma^2/n\to0$.

**Symbols.** $\xrightarrow p$ convergence in probability; $\epsilon$ fixed tolerance; MSE sufficient condition.

**Real-World Applications (§5).** (1) **Feature mean:** variance $25$, $n=2500$ gives SE $0.1$. (2) **Polling:** $p=0.5,n=10{,}000$ gives SE $0.005$. (3) **Monte Carlo:** variance $1,n=1{,}000{,}000$ gives SE $0.001$. (4) **Rates:** $p=0.1,n=100$ gives SE $0.03$, while $n=10{,}000$ gives $0.003$. (5) **Accuracy:** $p=0.8$, $n=400$ to $1600$ lowers SE from $0.02$ to $0.01$. (6) **Running mean:** variance $100/n$ gives MSE $0.01$ at $n=10{,}000$.

---

### `math-18-10` — Efficiency  · AUTHOR derivation

**Connections (§1).**
> This lesson compares estimators that aim at the same target. Bias and variance describe one estimator at a time; efficiency asks which unbiased estimator uses the data more precisely. The idea connects directly to Fisher information and the Cramér-Rao lower bound.

**Motivation & Intuition (§2).**
> Efficiency compares how much precision two estimators extract from the same data under the same target and model. The comparison is meaningful only when the estimators are being judged under the same assumptions. For unbiased estimators, lower variance means tighter concentration around the parameter.
>
> Relative efficiency turns that comparison into a variance ratio. If one estimator has variance $6/n$ and another has variance $10/n$, the first reaches the same precision with fewer observations. Later, the Cramér-Rao bound gives a theoretical floor for how efficient unbiased estimation can be.

**Definition & Assumptions (§3).** (1) Restrict the comparison to unbiased estimators of the same $\theta$. (2) Write their variances $\operatorname{Var}(T_1)$ and $\operatorname{Var}(T_2)$. (3) Define relative efficiency of $T_1$ to $T_2$ as $\operatorname{Var}(T_2)/\operatorname{Var}(T_1)$. (4) For $6/n$ and $10/n$, compute $(10/n)/(6/n)=10/6=1.667$. (5) Since $T_1$ has lower variance, it is more efficient.

**Symbols.** $T_1,T_2$ competing estimators; relative efficiency variance ratio; CRLB lower variance benchmark.

**Real-World Applications (§5).** (1) **Estimator choice:** variance $4/n$ reaches $0.04$ at $n=100$; $8/n$ needs $200$. (2) **Experiment duration:** variance $0.0004$ to $0.0003$ changes SE $0.020$ to $0.0173$. (3) **Control variates:** variance $1$ to $0.25$ halves SE. (4) **Known-variance normal mean:** $\bar X$ variance is $\sigma^2/n$. (5) **Monitoring:** shift $0.015$ is $3$ SEs at SE $0.005$ and $1.5$ SEs at $0.010$. (6) **Gradient variance:** $100/b$ at $b=100$ is $1$; reducing the constant to $25$ gives $0.25$.

---

### `math-18-11` — The method of moments  · AUTHOR derivation

**Connections (§1).**
> This lesson introduces a constructive way to build estimators from model summaries. Earlier lessons define moments such as means and variances; method of moments uses them as equations. It is often a simple first estimator and a useful starting point for likelihood-based fitting.

**Motivation & Intuition (§2).**
> Method of moments estimates parameters by making model moments equal the moments seen in the sample. If a model says its mean, variance, or higher moment depends on unknown parameters, the sample versions of those moments provide matching equations. Solving those equations gives parameter estimates.
>
> The method is direct because it uses summaries that are often easy to compute. It may not use all information as efficiently as MLE, but it is transparent and widely useful for initialization and calibration. For an exponential distribution, the mean alone identifies the rate, so one moment gives one equation for one parameter.

**Definition & Assumptions (§3).** For $X\sim\operatorname{Exponential}(\lambda)$: (1) use the model fact $E[X]=1/\lambda$. (2) Compute the sample moment $\bar X$. (3) Set $\bar X=1/\lambda$ because the sample mean estimates the population mean. (4) Solve by multiplying by $\lambda$ and dividing by $\bar X$. (5) Get $\hat\lambda_{MM}=1/\bar X$. (6) For data $2,3,5$, $\bar x=10/3$, so $\hat\lambda=0.3$.

**Symbols.** $E[X^k]$ population raw moment; $n^{-1}\sum_iX_i^k$ sample moment; $r$ number of parameters/equations.

**Real-World Applications (§5).** (1) **Exponential fit:** sample mean $4$ gives rate $0.25$. (2) **Poisson initialization:** sample mean $7.2$ gives $\lambda=7.2$. (3) **Queueing:** mean interarrival $0.5$ sec gives rate $2$ per sec. (4) **Word indicator:** $120/1000=0.12$. (5) **Simulator calibration:** model mean $2\theta$ and observed mean $10$ gives $\theta=5$. (6) **Noise second moment:** residual squares $45$ over $15$ cases gives variance $3$.

---

### `math-18-12` — Maximum Likelihood Estimation (MLE)  · full-depth model entry

**Connections (§1).**
> This lesson builds on probability models, samples, and point estimation. Earlier lessons describe an
> estimator as a rule computed from data. Maximum likelihood adds a disciplined way to choose that rule: write
> down the probability of the observed data under each possible parameter value, then choose the parameter
> that makes the observations most plausible.
>
> This idea connects directly to machine learning. Bernoulli likelihood leads to logistic regression and
> cross-entropy. Gaussian likelihood leads to least squares. Poisson and exponential likelihoods fit counts
> and waiting times. Later lessons use the same likelihood curve to define Fisher information, asymptotic
> standard errors, likelihood-ratio tests, and MAP estimation.

**Motivation & Intuition (§2).**
> A parameter value is not judged by whether it could have produced the data; many values usually could. MLE
> asks for the value under which the observed sample is most likely. For Bernoulli data with 7 successes in 10
> trials, a parameter near $p=0.7$ should fit better than $p=0.2$, because the data contain many successes.
>
> The likelihood is the probability of the observed data, but read as a function of the parameter. That shift
> is the central move. The data are fixed after observation; the parameter is the variable being compared. Logs
> are used because they turn products into sums and keep the same maximizer.

**Definition & Assumptions (§3).** Display
$$
\mathcal L(\theta)=\prod_{i=1}^n f(x_i\mid\theta),\qquad
\ell(\theta)=\log \mathcal L(\theta),\qquad
\hat\theta_{MLE}=\arg\max_\theta \ell(\theta).
$$
Then derive the Bernoulli MLE from the score equation:
1. For $s$ successes and $n-s$ failures, write the likelihood as $\mathcal L(p)=p^s(1-p)^{n-s}$ because independent probabilities multiply.
2. Take logs to get $\ell(p)=s\log p+(n-s)\log(1-p)$ because logs preserve the maximizer and simplify powers.
3. Differentiate one term at a time: $\ell'(p)=s/p-(n-s)/(1-p)$ because $d\log(1-p)/dp=-1/(1-p)$.
4. Set the score to zero: $s/p=(n-s)/(1-p)$ because an interior maximum has zero first derivative.
5. Cross-multiply: $s(1-p)=(n-s)p$ to remove denominators.
6. Expand and collect: $s-sp=np-sp$, so $s=np$.
7. Divide by $n$: $\hat p=s/n$.
8. For $s=7,n=10$, $\hat p=7/10=0.7$; the second derivative $-s/p^2-(n-s)/(1-p)^2<0$ confirms a maximum.

**Symbols.** $x_i$ is the observed data point; $f(x_i\mid\theta)$ is the model probability or density at that observation; $\theta$ is the unknown parameter; $\mathcal L$ is likelihood; $\ell$ is log-likelihood; $\hat\theta_{MLE}$ is the maximizing estimate; $s$ is the number of successes; $p$ is a Bernoulli success probability.

**Real-World Applications (§5).** (1) **Logistic regression** uses Bernoulli likelihood; labels with predicted probabilities $0.8$ and $0.6$ have negative log-likelihood $-\log0.8-\log0.6\approx0.734$. (2) **Naive Bayes word probabilities** use count MLEs; $30$ word occurrences in $1000$ class tokens gives $\hat p=0.03$. (3) **Poisson traffic modeling** gives $\hat\lambda=\bar x$; counts $4,5,6$ give $5$. (4) **Gaussian residual variance** has MLE $RSS/n$; $RSS=20,n=10$ gives $2$. (5) **Language modeling** maximizes token likelihood; probabilities $0.1,0.2$ give log-likelihood $\log0.1+\log0.2\approx-3.912$. (6) **Exponential waiting times** give rate MLE $1/\bar x$; mean wait $8$ minutes gives $0.125$ per minute.

---

### `math-18-13` — Asymptotics of MLE  · AUTHOR derivation

**Connections (§1).**
> This lesson extends maximum likelihood from exact optimization to large-sample behavior. The likelihood still chooses the parameter estimate, but now the shape of the likelihood near the truth explains uncertainty. This prepares for Fisher information, Wald intervals, and likelihood-ratio testing.

**Motivation & Intuition (§2).**
> MLE can be hard in small samples, but regular large samples make the estimator approximately normal with variance set by information. The estimate is found by solving a score equation, and the score can be approximated near the true parameter by a linear expansion.
>
> The intuition is that the random score supplies the numerator of the error, while likelihood curvature supplies the denominator. More curvature means the likelihood is sharper, so the same score fluctuation produces a smaller parameter error. Under regular conditions, this leads to an approximate normal distribution centered at the true value.

**Definition & Assumptions (§3).** (1) The MLE solves the score equation $0=\ell_n'(\hat\theta)$. (2) Expand around the true value: $0\approx\ell_n'(\theta_0)+(\hat\theta-\theta_0)\ell_n''(\theta_0)$. (3) Solve for the error: $\hat\theta-\theta_0\approx-\ell_n'(\theta_0)/\ell_n''(\theta_0)$. (4) The score sum fluctuates like $N(0,nI(\theta_0))$. (5) The curvature is about $-nI(\theta_0)$. (6) Divide fluctuation by curvature to get $\hat\theta\approx N(\theta_0,1/(nI(\theta_0)))$.

**Symbols.** $I(\theta_0)$ one-observation Fisher information; $\ell_n$ log-likelihood for $n$ observations; $\xrightarrow d$ convergence in distribution.

**Real-World Applications (§5).** (1) **Wald interval:** $1.2\pm2(0.3)=[0.6,1.8]$. (2) **Coefficient table:** $0.8/0.2=4$. (3) **Treatment effect:** $0.015/0.005=3$. (4) **Calibration slope:** $0.90\pm2(0.04)=[0.82,0.98]$. (5) **Sample planning:** $1/\sqrt{2n}=0.05$ gives $n=200$. (6) **Boundary warning:** $0$ successes in $10$ trials gives $\hat p=0$, so normal approximation is suspect.

---

### `math-18-14` — Fisher information  · AUTHOR derivation

**Connections (§1).**
> This lesson follows naturally from likelihood and MLE asymptotics. The likelihood's slope gives the score, and its curvature determines how sharply parameters are distinguished. Fisher information turns that curvature into a reusable measure of statistical precision.

**Motivation & Intuition (§2).**
> Fisher information measures likelihood curvature, so it tells how sharply data separate nearby parameter values. When the log-likelihood is flat, many parameter values explain the data almost equally well. When it is sharply curved, small parameter changes create clear likelihood changes.
>
> Information also sets the scale of estimator uncertainty. For independent observations, information adds across observations, so standard errors shrink as total information grows. The identity between score variance and expected negative curvature explains why both fluctuation and curvature describe the same precision.

**Definition & Assumptions (§3).** (1) Define score $S(\theta)=\partial_\theta\log f(X\mid\theta)$. (2) Regularity gives $E[S]=\int \partial_\theta f(x\mid\theta)dx=\partial_\theta1=0$. (3) Differentiate $E[S]=0$. (4) Get $E[\partial_\theta S]+E[S^2]=0$. (5) Rearrange to $I(\theta)=E[S^2]=-E[\partial_\theta^2\log f(X\mid\theta)]$. (6) For independent observations, scores add, so information adds: $I_n=nI$.

**Symbols.** $S$ score; $I$ Fisher information; observed information is negative curvature at observed data.

**Real-World Applications (§5).** (1) **Curvature SE:** observed curvature $-25$ gives information $25$ and SE $0.2$. (2) **Design:** info per user $0.02$ times $10{,}000$ gives total $200$, SE $0.071$. (3) **Bernoulli info:** $p=0.5$ gives $1/[p(1-p)]=4$. (4) **Logistic variance term:** $p(1-p)$ is $0.25$ at $0.5$ and $0.0099$ at $0.99$. (5) **Normal mean:** noise variance $4$ gives information $0.25$; variance $1$ gives $1$. (6) **Laplace spread:** curvature $64$ gives SD $0.125$.

---

### `math-18-15` — Maximum a Posteriori (MAP) estimation  · AUTHOR derivation

**Connections (§1).**
> This lesson connects likelihood-based estimation with Bayesian updating. MLE uses the likelihood alone, while MAP combines the likelihood with a prior distribution over parameters. The result is still a point estimate, but one shaped by both data and prior information.

**Motivation & Intuition (§2).**
> MAP chooses the parameter value that is most plausible after combining the likelihood with a prior. The likelihood measures how well each parameter explains the observed data, and the prior assigns plausibility before seeing those data. Multiplying them gives the posterior shape up to a normalizing constant.
>
> The MAP estimate is the posterior mode. In the Bernoulli-Beta case, the prior behaves like extra pseudo-counts that smooth the estimate. This makes MAP especially useful when data are sparse, although the answer depends on the chosen prior.

**Definition & Assumptions (§3).** For Bernoulli with Beta$(\alpha,\beta)$ prior: (1) likelihood is $p^s(1-p)^f$. (2) prior density is proportional to $p^{\alpha-1}(1-p)^{\beta-1}$. (3) multiply to get posterior proportional to $p^{\alpha+s-1}(1-p)^{\beta+f-1}$. (4) take logs and differentiate. (5) Set $(\alpha+s-1)/p-(\beta+f-1)/(1-p)=0$. (6) solve to get MAP $(\alpha+s-1)/(\alpha+\beta+s+f-2)$ when the mode is interior. (7) With $s=8,f=2,\alpha=2,\beta=2$, get $9/12=0.75$.

**Symbols.** Prior $p(\theta)$; posterior $p(\theta\mid x)$; mode = maximizing parameter value; pseudo-counts from prior shapes.

**Real-World Applications (§5).** (1) **Ridge MAP:** penalty $\lambda w^2/2$ with $\lambda=4$ adds curvature $4$. (2) **L1 MAP:** loss $10$ plus $0.5|3|$ gives $11.5$. (3) **CTR smoothing:** Beta$(2,2)$ plus $1$ click, $0$ failures gives MAP $2/3$. (4) **Cold start:** prior count $20$ at mean $0.10$ acts like $2$ successes and $18$ failures. (5) **Add-one smoothing:** count $0$, vocabulary $1000$, tokens $10{,}000$ gives $1/11{,}000$. (6) **Weight prior:** $5(0.4^2)/2=0.4$.

---

### `math-18-16` — Sufficiency  · AUTHOR derivation

**Connections (§1).**
> This lesson studies how data can be compressed without losing information about a parameter under a model. Earlier lessons use sample summaries as estimators; sufficiency asks when a summary contains all parameter-relevant information. The concept supports exponential families, Rao-Blackwell improvement, and efficient inference.

**Motivation & Intuition (§2).**
> A sufficient statistic keeps all sample information about a parameter under the assumed model, while discarding arrangement details that no longer matter. For Bernoulli data with a common success probability, the number of successes matters for $p$, but the order in which successes occurred does not.
>
> The factorization theorem makes this precise. If the joint probability can be written so that all parameter dependence passes through a statistic, then that statistic is sufficient. This is a model-based statement: change the model, and what counts as sufficient may change.

**Definition & Assumptions (§3).** For Bernoulli data: (1) write the joint mass $p^{\sum x_i}(1-p)^{n-\sum x_i}$. (2) define $T(x)=\sum_i x_i$. (3) rewrite as $p^{T(x)}(1-p)^{n-T(x)}\cdot1$. (4) match the factorization form $g_p(T(x))h(x)$. (5) since all $p$ dependence is through $T$, the factorization theorem says $T$ is sufficient. (6) Explain that sequences with the same success count have likelihood ratios free of $p$.

**Symbols.** $T(X)$ statistic; $f_\theta(x)$ joint density/mass; $g_\theta$ parameter-dependent factor; $h$ parameter-free factor.

**Real-World Applications (§5).** (1) **Clicks:** $63$ clicks in $1000$ impressions gives likelihood $p^{63}(1-p)^{937}$. (2) **Failures:** $8/500=0.016$ MLE from sufficient count. (3) **Poisson totals:** counts $3,4,2,6$ total $15$, so $\hat\lambda=3.75$. (4) **Normal known variance:** readings $10.1,9.9,10.0,10.2$ have mean $10.05$. (5) **Rao-Blackwell:** variance $0.040$ to $0.025$ is a $37.5\%$ reduction. (6) **Aggregation:** $118$ yes responses among $200$ binary responses summarize constant-$p$ inference.

---

### `math-18-17` — The exponential family  · AUTHOR derivation · rewrite §5

**Connections (§1).**
> This lesson reveals a shared form behind many distributions already used in inference. Bernoulli, Poisson, normal, and related GLM models can be written with a statistic, a natural parameter, and a log-normalizer. That structure connects sufficiency, likelihood, moments, and generalized linear models.

**Motivation & Intuition (§2).**
> Exponential-family form reveals the shared structure behind Bernoulli, Poisson, normal, and many GLM likelihoods. Instead of treating each distribution as unrelated, the form identifies a statistic that carries information and a natural parameter that controls the model.
>
> The log-normalizer keeps probabilities or densities properly scaled, but it also carries moment information. Its derivatives produce means and variances in many common cases. Rewriting Bernoulli in natural-parameter form shows how the logit parameter appears naturally from the likelihood.

**Definition & Assumptions (§3).** For Bernoulli: (1) start with $p^x(1-p)^{1-x}$. (2) rewrite as $\exp[x\log p+(1-x)\log(1-p)]$. (3) collect terms involving $x$: $\exp[x\log(p/(1-p))+\log(1-p)]$. (4) set $\eta=\log(p/(1-p))$. (5) solve $p=e^\eta/(1+e^\eta)$. (6) write $\log(1-p)=-\log(1+e^\eta)$. (7) get $f_\eta(x)=\exp\{\eta x-A(\eta)\}$ with $A(\eta)=\log(1+e^\eta)$.

**Symbols.** $T(x)$ sufficient statistic; $\eta$ natural parameter; $A(\eta)$ log-normalizer; $h(x)$ base measure.

**Real-World Applications (§5).** (1) **Bernoulli GLM:** $p=0.8$ gives natural parameter $\log4=1.386$. (2) **Poisson GLM:** $\lambda=5$ gives $\eta=\log5=1.609$. (3) **Moment from normalizer:** Bernoulli with $\eta=0$ gives $A'(0)=0.5$. (4) **Variance from curvature:** Bernoulli at $p=0.5$ gives $A''=0.25$. (5) **Sufficient counts:** $63$ successes summarize $1000$ Bernoulli trials. (6) **Softmax family:** logits $(0,1)$ normalize to probability $e/(1+e)=0.731$ for class 2.

---

### `math-18-18` — The Cramér-Rao bound  · AUTHOR derivation · rewrite §5

**Connections (§1).**
> This lesson uses Fisher information to state a precision limit. Efficiency compared estimators against each other; the Cramér-Rao bound compares unbiased estimators against a model-implied lower bound. It explains when an estimator is as precise as the regular model allows.

**Motivation & Intuition (§2).**
> The Cramér-Rao bound gives a best-possible variance floor for unbiased estimators under a regular model. If the data contain limited information about a parameter, no unbiased estimator can have variance below the reciprocal of total information.
>
> The proof links estimation to the score. An unbiased estimator must move with the parameter at the right rate, and the score measures how the likelihood moves with the parameter. Cauchy-Schwarz turns that relationship into a variance lower bound.

**Definition & Assumptions (§3).** (1) Let $S=\partial_\theta\log L(\theta;X)$ be the score. (2) Regularity gives $E[S]=0$. (3) For unbiased $T$, $E[T]=\theta$. (4) Differentiate $E[T]$ with respect to $\theta$ to get $1=E[T S]$. (5) Since $E[S]=0$, this is $\operatorname{Cov}(T,S)=1$. (6) Apply Cauchy-Schwarz: $1^2\le\operatorname{Var}(T)\operatorname{Var}(S)$. (7) Recognize $\operatorname{Var}(S)=I_n(\theta)$. (8) Rearrange $\operatorname{Var}(T)\ge1/I_n(\theta)$.

**Symbols.** $T$ unbiased estimator; $S$ score; $I_n$ total Fisher information; CRLB lower bound.

**Real-World Applications (§5).** (1) **Normal mean:** known $\sigma^2=9,n=25$ gives CRLB $9/25=0.36$. (2) **Bernoulli rate:** $p=0.5,n=100$ gives CRLB $0.25/100=0.0025$. (3) **Sensor design:** total information $400$ gives minimum unbiased SE $0.05$. (4) **Efficiency check:** estimator variance $0.36$ meets the normal bound above. (5) **Sample planning:** to get SE $0.02$ with per-sample information $1$, need $n=2500$. (6) **Information gain:** doubling total information from $100$ to $200$ lowers bound from $0.01$ to $0.005$.

---

### `math-18-19` — Confidence intervals  · AUTHOR derivation · rewrite §5

**Connections (§1).**
> This lesson turns point estimates and standard errors into uncertainty statements. Sampling distributions describe how estimates vary; confidence intervals use that variation to build random endpoints. The idea is central for reporting statistical estimates without pretending a single number is exact.

**Motivation & Intuition (§2).**
> A confidence interval is built by a procedure that captures the fixed parameter at a chosen long-run rate. The parameter is not random in the frequentist setup; the interval endpoints are random because they depend on the sample.
>
> The common normal-form interval comes from a pivot. If the standardized estimation error is approximately standard normal, central normal probability can be rearranged to isolate the unknown parameter. The result is an estimate plus and minus a critical value times the standard error.

**Definition & Assumptions (§3).** (1) Start with an approximate pivot $Z=(\hat\theta-\theta)/SE\approx N(0,1)$. (2) Use central probability $P(-z_{1-\alpha/2}\le Z\le z_{1-\alpha/2})\approx1-\alpha$. (3) Substitute the pivot. (4) Multiply by $SE$ without reversing inequalities. (5) Rearrange to isolate $\theta$. (6) Get $\hat\theta\pm z_{1-\alpha/2}SE$.

**Symbols.** $\alpha$ miss rate; $z_{1-\alpha/2}$ normal critical value; $L,U$ random endpoints; coverage = long-run inclusion rate.

**Real-World Applications (§5).** (1) **Known-variance mean:** $52\pm1.96(10/10)=[50.04,53.96]$. (2) **Accuracy:** $0.84\pm1.96(0.02)=[0.801,0.879]$. (3) **CTR:** $0.012\pm1.96(0.001)=[0.0100,0.0140]$. (4) **Lift:** $0.006\pm1.96(0.002)=[0.0021,0.0099]$. (5) **Latency:** $100\pm1.96(1)=[98.04,101.96]$ ms. (6) **Calibration slope:** $0.90\pm1.96(0.04)=[0.822,0.978]$.

---

### `math-18-20` — Hypothesis testing  · AUTHOR derivation · rewrite §5

**Connections (§1).**
> This lesson uses sampling distributions to assess evidence against a baseline claim. Confidence intervals report a range of plausible parameter values; hypothesis tests ask whether the observed statistic is unusual under a specified null model. The same standard errors and null distributions support both ideas.

**Motivation & Intuition (§2).**
> Hypothesis testing compares an observed statistic with the distribution it would have if a baseline claim were true. The null hypothesis supplies the reference distribution, and the statistic measures how far the data are from that reference.
>
> Standardization puts the distance on a common scale of standard errors. A p-value is then a null tail probability for a result at least as extreme as the one observed. The rejection rule controls the long-run false alarm rate when the null is true.

**Definition & Assumptions (§3).** (1) State $H_0:\theta=\theta_0$ and an alternative. (2) Choose a statistic whose null distribution is known or approximated. (3) Standardize as $z=(\hat\theta-\theta_0)/SE$ to measure distance in null standard errors. (4) Convert $|z|$ to a two-sided p-value $2P(Z\ge |z|)$. (5) Reject at level $\alpha$ if $p\le\alpha$. (6) For $\bar x=104,\sigma=15,n=100,\mu_0=100$, $z=4/1.5=2.667$.

**Symbols.** $H_0$ null; $H_1$ alternative; p-value null tail probability; $\alpha$ rejection threshold.

**Real-World Applications (§5).** (1) **Mean test:** $z=2.667$ gives two-sided p about $0.0077$. (2) **Experiment lift:** $0.009/0.003=3$ gives strong evidence. (3) **Non-inferiority:** margin $-0.01$, estimate $0.002$, SE $0.004$ gives $z=3$. (4) **Monitoring:** current $42.8$ versus $40.0$ with SE $0.7$ gives $z=4$. (5) **Fairness gap:** $0.036/0.012=3$. (6) **A/A guardrail:** estimate $0.001$ with SE $0.003$ gives $z=0.333$, not unusual.

---

### `math-18-21` — Type I and II errors  · AUTHOR derivation · rewrite §5

**Connections (§1).**
> This lesson names the two ways a test can be wrong. Hypothesis testing sets a rejection rule; error rates describe how that rule behaves under the null and under alternatives. These ideas lead directly to power, sample-size planning, and tradeoffs in decision thresholds.

**Motivation & Intuition (§2).**
> Type I and Type II errors name the two possible mistakes: false alarm and missed detection. A Type I error rejects a true null, while a Type II error fails to reject when a specified alternative is true. The two probabilities are evaluated under different worlds.
>
> Tightening a cutoff lowers the false alarm rate, but it also makes detection harder at a fixed sample size. More data can improve the tradeoff because it shrinks standard errors and separates the null distribution from the alternative distribution. Power is the complement of the Type II error rate.

**Definition & Assumptions (§3).** (1) Define $\alpha=P(\text{reject }H_0\mid H_0\text{ true})$. (2) Define $\beta(\theta_1)=P(\text{fail to reject }H_0\mid\theta_1\text{ true})$. (3) Power is the complement, $1-\beta$. (4) Moving the cutoff farther into the tail lowers $\alpha$. (5) The same move makes rejection harder under a real alternative, raising $\beta$ at fixed $n$. (6) More data shrinks SE and separates the null and alternative distributions.

**Symbols.** $\alpha$ false positive rate; $\beta$ false negative rate at a chosen alternative; power detection probability.

**Real-World Applications (§5).** (1) **Multiple nulls:** $1000$ true-null tests at $\alpha=0.05$ give $50$ expected false positives. (2) **Power:** $\beta=0.20$ gives power $0.80$. (3) **Spam filter analogy:** false-positive rate $0.01$ among $10{,}000$ real emails blocks $100$. (4) **Fraud detection:** false negative rate $0.15$ among $200$ fraud cases misses $30$. (5) **Medical screening:** sensitivity $0.95$ means $\beta=0.05$. (6) **Experiment cutoff:** lowering $\alpha$ from $0.05$ to $0.01$ reduces false alarms fivefold under true nulls.

---

### `math-18-22` — Statistical power  · AUTHOR derivation · rewrite §5

**Connections (§1).**
> This lesson continues from Type II error. Once an alternative effect size is chosen, power measures how often the test detects it. It is the main bridge from hypothesis testing to sample-size and experiment planning.

**Motivation & Intuition (§2).**
> Power is the probability that a test rejects the null when a specified alternative is true. It depends on the effect size, noise level, sample size, test direction, and significance cutoff. A test can be valid at its chosen alpha while still having low power for small effects.
>
> For a one-sided mean test, the rejection cutoff is set under the null. To compute power, the same cutoff is viewed under the alternative distribution. If the alternative mean is many standard errors beyond the cutoff, rejection is likely; if it is close, rejection is uncertain.

**Definition & Assumptions (§3).** For a one-sided known-variance mean test: (1) reject when $\bar X>\mu_0+z_{1-\alpha}\sigma/\sqrt n$. (2) Under true mean $\mu_1$, standardize that cutoff using mean $\mu_1$ and SE $\sigma/\sqrt n$. (3) Power is $P_{\mu_1}(\bar X>\text{cutoff})=1-\Phi(z_{1-\alpha}-(\mu_1-\mu_0)/(\sigma/\sqrt n))$. (4) With $\sigma=4,n=64,\alpha=0.05,\mu_1-\mu_0=1.5$, SE is $0.5$. (5) Compute $1-\Phi(1.645-3)=\Phi(1.355)=0.912$.

**Symbols.** $\mu_0$ null mean; $\mu_1$ alternative; effect size $\mu_1-\mu_0$; $\Phi$ standard normal CDF.

**Real-World Applications (§5).** (1) **Launch experiment:** effect $1.5$, SE $0.5$ gives power $0.912$ at one-sided $5\%$. (2) **Smaller effect:** effect $1.0$ with same SE gives $1-\Phi(-0.355)=0.639$. (3) **Larger sample:** halving SE from $0.5$ to $0.25$ changes signal from $3$ to $6$ SEs. (4) **Noisy metric:** doubling $\sigma$ from $4$ to $8$ halves signal from $3$ to $1.5$. (5) **Higher alpha:** using $z_{0.90}=1.282$ gives $\Phi(1.718)=0.957$ for the same effect. (6) **Planning:** target signal $3$ for effect $0.03$ requires SE $0.01$.

---

### `math-18-23` — The z-test and t-test  · AUTHOR derivation · rewrite §5

**Connections (§1).**
> This lesson specializes hypothesis testing for means. The z-test uses a known or externally justified standard deviation, while the t-test accounts for estimating that standard deviation from the same sample. Both tests express the observed mean difference in standard-error units.

**Motivation & Intuition (§2).**
> A z-test standardizes with known or externally justified noise; a t-test standardizes with sample-estimated noise and pays for that estimate with heavier tails. The distinction matters most when samples are small and uncertainty in the sample standard deviation is substantial.
>
> Both tests compare a sample mean to a null mean. The numerator is the observed offset, and the denominator is the estimated standard error of the mean. Replacing $\sigma$ with $s$ introduces extra variability, which is reflected by the $t$ distribution and its degrees of freedom.

**Definition & Assumptions (§3).** (1) If $\sigma$ is known, $\bar X$ has SE $\sigma/\sqrt n$, so $z=(\bar X-\mu_0)/(\sigma/\sqrt n)$. (2) If $\sigma$ is unknown, estimate it by $s$. (3) Replace $\sigma$ by $s$ to get $t=(\bar X-\mu_0)/(s/\sqrt n)$. (4) Under normal sampling, the numerator and sample variance combine to a $t_{n-1}$ distribution. (5) For $n=16,\bar x=10.5,s=2,\mu_0=9.5$, compute $t=1/(2/4)=2$ with $15$ df.

**Symbols.** $s$ sample SD; df degrees of freedom; $\mu_0$ null mean; z/t statistic standardized distance.

**Real-World Applications (§5).** (1) **Known-SD manufacturing:** $\bar x=51,\mu_0=50,\sigma=4,n=64$ gives $z=2$. (2) **Small-sample latency:** $t=2$ at $15$ df from the worked example. (3) **Paired test:** differences mean $3$, SD $6$, $n=36$ gives $t=3$. (4) **Model metric:** gain $0.004$ with estimated SE $0.002$ gives $t=2$. (5) **Sensor calibration:** mean offset $0.5$, $s=1$, $n=25$ gives $t=2.5$. (6) **Large-sample z:** estimate $0.12$, SE $0.03$ gives $z=4$ only when the normal approximation is justified.

---

### `math-18-24` — The χ² and F tests  · AUTHOR derivation · rewrite §5

**Connections (§1).**
> This lesson introduces two common test families built from squared discrepancies and variance ratios. Chi-square tests are natural for counts across categories, while F tests are natural for comparing mean squares. Both rely on reference distributions determined by degrees of freedom.

**Motivation & Intuition (§2).**
> Chi-square tests add squared count discrepancies; F tests compare variance-like quantities by ratio. In a chi-square statistic, each observed-minus-expected difference is squared and scaled by its expected count, so cells are compared on a common relative scale.
>
> F statistics arise when two independent variance estimates or mean squares are compared. A large ratio indicates that between-group variation is large relative to within-group variation, or that one variance estimate is much larger than another. The calculations are simple, but the reference distribution depends on the design and degrees of freedom.

**Definition & Assumptions (§3).** (1) For categories, compute residuals $O_i-E_i$. (2) Scale each squared residual by $E_i$ so large expected cells do not dominate unfairly. (3) Sum to get $\chi^2=\sum_i(O_i-E_i)^2/E_i$. (4) For a fair die rolled $60$ times, $E_i=10$. (5) Counts $8,12,9,11,10,10$ give contributions $0.4,0.4,0.1,0.1,0,0$, sum $1.0$. (6) For F, divide two mean squares; $MS_B=18,MS_W=3$ gives $F=6$.

**Symbols.** $O_i$ observed counts; $E_i$ expected counts; $MS$ mean square; df degrees of freedom.

**Real-World Applications (§5).** (1) **Die fairness:** $\chi^2=1.0$. (2) **A/B segment counts:** observed $55,45$ versus expected $50,50$ gives $\chi^2=1.0$. (3) **Independence table:** a cell $O=30,E=24$ contributes $36/24=1.5$. (4) **ANOVA:** between $18$ and within $3$ gives $F=6$. (5) **Variance ratio:** sample variances $12$ and $4$ give $F=3$. (6) **Feature drift bins:** observed $90,110,100$ versus $100$ each gives $\chi^2=2$.

---

### `math-18-25` — The likelihood ratio test  · AUTHOR derivation · rewrite §5

**Connections (§1).**
> This lesson returns to likelihood as a tool for testing. Instead of testing with a single standardized estimate, the likelihood-ratio test compares how well a restricted model and a larger model fit the same data. It is a central method for nested model comparison.

**Motivation & Intuition (§2).**
> The likelihood-ratio test compares the best null explanation with the best explanation allowed by a larger model. The unrestricted model can always fit at least as well, so the question is whether its improvement is large relative to what regular sampling variation would allow.
>
> Taking $-2$ times the log likelihood ratio puts the comparison on a scale with a large-sample chi-square reference under regular conditions. The degrees of freedom count the number of additional free parameters. Boundary cases and nonstandard models require extra care because the simple chi-square reference may fail.

**Definition & Assumptions (§3).** (1) Fit the restricted null model and record likelihood $L_0$. (2) Fit the unrestricted model and record likelihood $L_1\ge L_0$. (3) Form $\Lambda=L_0/L_1$. (4) Use $-2\log\Lambda=2(\ell_1-\ell_0)$ so larger values mean the null loses more likelihood. (5) Under regular large-sample conditions, compare to a $\chi^2$ distribution with df equal to the number of added parameters. (6) For $8$ successes in $10$ trials, testing $p=0.5$ against free $p$ gives $2[8\log(0.8/0.5)+2\log(0.2/0.5)]=3.855$.

**Symbols.** $L_0,L_1$ maximized likelihoods; $\Lambda$ likelihood ratio; df added parameters; $\ell$ log-likelihood.

**Real-World Applications (§5).** (1) **Bernoulli rate:** worked statistic $3.855$. (2) **Logistic feature:** null log-likelihood $-120$, full $-114$ gives LRT $12$. (3) **Nested Poisson model:** log-likelihood gain $2.5$ gives statistic $5$. (4) **Mixture caution:** boundary parameters break the simple chi-square reference. (5) **A/B model:** adding one treatment coefficient with gain $4$ gives statistic $8$. (6) **Calibration model:** gain $1.2$ gives statistic $2.4$ for one added slope.

---

### `math-18-26` — Nonparametric methods  · explain-only · rewrite §5

**Connections (§1).**
> This lesson broadens inference beyond fully specified parametric families. Previous lessons often assume a distribution with a small number of parameters; nonparametric methods reduce that commitment. They connect naturally to ranks, empirical distributions, smoothing, resampling, and robust summaries.

**Motivation & Intuition (§2).**
> Nonparametric methods reduce reliance on a fully specified distribution by using ranks, empirical distributions, local smoothers, or resampling. The word does not mean that there are no assumptions. It means the method does not begin by choosing one fixed finite-parameter family such as normal, Bernoulli, or Poisson.
>
> The procedures are often built directly from the observed ordering or empirical distribution. A rank calculation replaces raw values with order positions, while an empirical CDF estimates cumulative probability by the fraction of sample points at or below a threshold. These tools are useful when shape assumptions are questionable or when medians and quantiles are more stable than means.

**Definition & Assumptions (§3).** **Explain-only.** This is a family-of-methods lesson. Explain what changes when no single parametric family is assumed; include one rank calculation and one empirical-CDF calculation as concrete procedures.

**Symbols.** $\hat F_n(x)$ empirical CDF; rank $R_i$ order position; bandwidth $h$ local-smoothing width; distribution-free means fewer shape assumptions, not no assumptions.

**Real-World Applications (§5).** (1) **Empirical CDF:** data $2,5,7,9$ gives $\hat F(6)=2/4=0.5$. (2) **Median:** sorted $3,4,8,10,20$ gives median $8$. (3) **Sign test:** $7$ positive differences out of $10$ uses binomial tail, not normality. (4) **Mann-Whitney ranks:** rank sum $30$ for $n_1=5$ gives $U=30-15=15$. (5) **Kernel smoother:** with bandwidth $2$, points within $\pm2$ of $10$ are averaged locally. (6) **Quantile interval:** 25th and 75th percentiles from $8$ sorted points are order positions near $2$ and $6$.

---

### `math-18-27` — The bootstrap  · AUTHOR derivation · rewrite §5

**Connections (§1).**
> This lesson provides a simulation-based route to standard errors and intervals. Earlier lessons derive sampling variation from a probability model; the bootstrap estimates it by resampling the observed dataset. It is especially useful when analytic standard errors are difficult to derive.

**Motivation & Intuition (§2).**
> The bootstrap estimates sampling variation by repeatedly resampling from the observed data and recomputing the statistic. The empirical distribution is used as a stand-in for the unknown population, so each observed value receives equal chance of being drawn.
>
> Sampling with replacement is essential because it mimics new samples of the same size while staying within the observed empirical distribution. The spread of the bootstrap statistics approximates the spread the original statistic would have across repeated samples. This can estimate standard errors, percentile intervals, and uncertainty for statistics such as medians.

**Definition & Assumptions (§3).** (1) Treat the empirical distribution that puts mass $1/n$ on each observed value as a stand-in for the population. (2) Draw bootstrap samples of size $n$ with replacement. (3) Compute the statistic $T^*$ on each resample. (4) Use the spread of the $T^*$ values to estimate the sampling spread of $T$. (5) Estimate bootstrap SE by the sample SD of bootstrap statistics. (6) For bootstrap means $10.0,11.0,9.5,10.5,10.2$, the bootstrap SE is $0.559$.

**Symbols.** $T$ original statistic; $T^*$ bootstrap statistic; $B$ number of resamples; empirical distribution assigns equal mass to observations.

**Real-World Applications (§5).** (1) **Mean SE:** bootstrap means above give SE $0.559$. (2) **Accuracy interval:** bootstrap 2.5th and 97.5th percentiles $0.81,0.87$ give interval $[0.81,0.87]$. (3) **Median uncertainty:** resampled medians $4,5,5,6,7$ have SD about $1.14$. (4) **A/B lift:** bootstrap lift SD $0.003$ makes lift $0.009$ equal $3$ SEs. (5) **Small data caution:** $n=5$ resamples contain duplicates because sampling is with replacement. (6) **Model evaluation:** $B=1000$ resamples and percentile indices $25,975$ give a 95% percentile interval.

---

### `math-18-28` — Linear regression  · AUTHOR derivation · rewrite §5

**Connections (§1).**
> This lesson connects statistical estimation to a core predictive model. Linear regression treats the response as approximately linear in chosen features and estimates coefficients from data. The normal equations also connect regression to optimization, projections, and Gaussian likelihood.

**Motivation & Intuition (§2).**
> Linear regression chooses coefficients so the fitted line or plane minimizes squared residuals. Each residual is the difference between the model's fitted value and the observed response. Squaring residuals makes positive and negative misses combine and gives a differentiable objective.
>
> In matrix form, all fitted values are collected as $X\beta$. Minimizing the squared norm of $X\beta-y$ leads to a gradient equation. When $X^TX$ is invertible, that equation has a closed-form solution for the least-squares coefficients.

**Definition & Assumptions (§3).** (1) Write residual vector $r=X\beta-y$. (2) Objective is $S(\beta)=\|X\beta-y\|^2=r^Tr$. (3) Differentiate: $\nabla_\beta S=2X^T(X\beta-y)$. (4) Set the gradient to zero because a least-squares minimum is stationary. (5) Rearrange $X^TX\hat\beta=X^Ty$. (6) If $X^TX$ is invertible, solve $\hat\beta=(X^TX)^{-1}X^Ty$. (7) For points $(0,1),(1,2),(2,2)$ with intercept, $\hat\beta=(1.167,0.5)$.

**Symbols.** $X$ design matrix; $y$ response vector; $\beta$ coefficient vector; residual $r$; normal equations.

**Real-World Applications (§5).** (1) **Trend line:** worked data give intercept $1.167$ and slope $0.5$. (2) **Prediction:** at $x=3$, prediction is $1.167+0.5(3)=2.667$. (3) **Residual:** for $x=1,y=2$, residual is $2-(1.667)=0.333$. (4) **RSS:** residuals about $-0.167,0.333,-0.167$ give RSS $0.167$. (5) **Ridge contrast:** adding $\lambda I$ changes equations to $(X^TX+\lambda I)\beta=X^Ty$. (6) **Feature scaling:** doubling one feature doubles its column in $X$ and changes the coefficient scale.

---

### `math-18-29` — The bias–variance tradeoff  · AUTHOR derivation · rewrite §5

**Connections (§1).**
> This lesson brings estimator bias and variance into prediction. Earlier lessons decomposed MSE for parameter estimates; here the same idea explains prediction error for learned functions. It is one of the main ways to reason about underfitting, overfitting, regularization, and ensembling.

**Motivation & Intuition (§2).**
> Prediction error can come from a model being too rigid, too sensitive to samples, or from irreducible noise in the data. A rigid model may miss the true signal on average, creating bias. A flexible model may react strongly to the particular training sample, creating variance.
>
> The decomposition fixes an input and averages over possible training samples and noise. Adding and subtracting the average learned predictor separates squared bias, estimator variance, and noise variance. Regularization, model choice, and ensembling often work by changing the balance between these terms.

**Definition & Assumptions (§3).** For fixed input $x$: (1) write prediction error $E[(\hat f(x)-Y)^2]$ with $Y=f(x)+\epsilon$ and $E\epsilon=0$, $\operatorname{Var}(\epsilon)=\sigma^2$. (2) add and subtract $E[\hat f(x)]$. (3) expand the square. (4) cross terms vanish because centered estimator fluctuation and noise have mean zero. (5) identify squared bias $(E\hat f-f)^2$, variance $E[(\hat f-E\hat f)^2]$, and noise $\sigma^2$. (6) get error = bias$^2$ + variance + noise.

**Symbols.** $f(x)$ true signal; $\hat f(x)$ learned predictor; bias model average offset; variance training-sample sensitivity; $\sigma^2$ irreducible noise.

**Real-World Applications (§5).** (1) **Total error:** bias$^2=0.25$, variance $0.16$, noise $0.09$ gives $0.50$. (2) **Underfit model:** bias $0.8$, variance $0.05$, noise $0.10$ gives $0.79$. (3) **Overfit model:** bias $0.1$, variance $0.50$, noise $0.10$ gives $0.61$. (4) **Regularization:** variance drop $0.30$ to $0.12$ with bias$^2$ rise $0.04$ to $0.09$ lowers total by $0.13$. (5) **Ensembling:** averaging four independent models cuts variance $0.16$ to $0.04$. (6) **Irreducible noise:** even zero bias and zero variance leave error $0.09$.

---

### `math-18-30` — Statistical learning theory & generalization  · AUTHOR derivation · rewrite §5

**Connections (§1).**
> This lesson places inference in the setting of learned predictors. Training error is computed on observed data, while generalization concerns performance on new draws from the same population. The lesson connects empirical risk, model complexity, concentration bounds, and train-test gaps.

**Motivation & Intuition (§2).**
> Generalization theory studies why performance on a training sample can predict performance on new data, and how model complexity affects that gap. A fixed model's empirical error is an average of bounded losses, so concentration inequalities can limit how far it is from true risk.
>
> When many models are considered, the bound must cover the whole class. A union bound adds a complexity penalty through the number of candidate classifiers. The resulting guarantee is often conservative, but it clearly shows the roles of sample size, failure probability, and model class size.

**Definition & Assumptions (§3).** Use a simple Hoeffding bound for a fixed classifier: (1) define true risk $R$ and empirical risk $\hat R_n$ as averages of bounded $0/1$ losses. (2) Hoeffding gives $P(|\hat R_n-R|>\epsilon)\le2e^{-2n\epsilon^2}$. (3) To cover $M$ fixed classifiers, apply a union bound. (4) Get $P(\max_m|\hat R_m-R_m|>\epsilon)\le2Me^{-2n\epsilon^2}$. (5) Solve for a high-probability gap: $\epsilon\ge\sqrt{\log(2M/\delta)/(2n)}$. (6) For one fixed model, $n=100,\epsilon=0.08$ gives bound $2e^{-1.28}=0.556$.

**Symbols.** $R$ population risk; $\hat R$ empirical risk; $M$ model class size; $\delta$ failure probability; generalization gap $R-\hat R$.

**Real-World Applications (§5).** (1) **Fixed model bound:** $n=100,\epsilon=0.08$ gives probability bound $0.556$. (2) **Model class penalty:** $M=100,\delta=0.05,n=10{,}000$ gives gap bound $\sqrt{\log4000/20000}=0.0204$. (3) **Train-test gap:** train error $0.08$, test error $0.12$ gives gap $0.04$. (4) **Test error SE:** $p=0.12,n=1000$ gives SE $\sqrt{0.1056/1000}=0.0103$. (5) **More data:** doubling $n$ divides the bound by $\sqrt2$. (6) **Complexity warning:** increasing $M$ from $10$ to $1000$ raises the log term from $\log(400)$ to $\log(40000)$ at $\delta=0.05$.

---

## Build order for this section

1. **Replace duplicated §5 arithmetic in `18-17…18-30` first.** This removes the repeated SE/z/interval pattern and gives each lesson concept-specific numbers.
2. **Author derivations in the likelihood/information spine:** `18-12`, `18-14`, `18-18`, `18-25`, then `18-13`.
3. **Author estimator-quality derivations:** `18-05…18-11`, then `18-29`.
4. **Author interval/test derivations:** `18-19…18-24`.
5. **Finish applied methods:** `18-27`, `18-28`, `18-30`; keep `18-01` and `18-26` explain-only.
6. **Final pass:** promote key formulas to display math, gloss every symbol, verify the six app numbers per lesson, and keep the two explain-only lessons from gaining artificial proofs.
