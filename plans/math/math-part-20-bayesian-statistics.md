# Math · Part 20 — Bayesian statistics  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four
> exposition principles, the fix recipe, and the Definition of Done. This file is now deep-authored:
> every lesson has a concrete §1/§2 direction, a case-by-case derivation or explain-only call, symbol glosses,
> and six concept-specific applications with numbers verified by `python3` + `scipy.stats`.

**Section:** Bayesian statistics · **Lessons:** 19 · **Breadcrumb:** `Mathematics · Probability & Statistics` · **Priority:** MEDIUM (targeted deepening + one LaTeX repair)

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate (shared app-set with a sibling) | 0 / 19 |
| Templated / thin motivation | 0 / 19 |
| Key formula not in display form | 10 / 19 |
| Unclosed dollar-sign LaTeX bug | 1 / 19 |
| Derivation to author or deepen | 16 / 19 |
| Explain-only concept lessons | 3 / 19 |

**Number check.** The numeric claims below were checked with `python3` and `scipy.stats`, including
Beta-Binomial updates, Normal-Normal posterior means/variances, Normal and Beta credible intervals,
ELBO/KL arithmetic, EM weighted means, Metropolis acceptance, and GP posterior arithmetic.

## Priority & systemic issues

- No whole-section §5 boilerplate block was detected. The work is not replacement of a repeated app set; it is
  deepening each already-relevant lesson so formulas are displayed, derived, and tied to Bayesian ML practice.
- **LaTeX bug to fix:** `math-20-07`, application 4 numbers field currently ends `=4.2 percent.` after opening
  inline math for `(1/4+5)/(1.25)`. Fix by closing the expression as `(1/4+5)/(1.25)=4.2\%`.
- Keep the apps genuinely Bayesian-ML: conjugate updates, posterior predictive checks, ELBO/VI, EM, VAEs, GP
  regression, Bayesian optimization, and Bayesian deep-learning uncertainty.
- Promote Bayes' rule, posterior predictive, evidence, Laplace, ELBO, EM, and GP regression equations to display
  form and gloss every symbol the first time it appears.

## Model entry (full prose)

### `math-20-15` — Variational inference  — **full-depth model entry**

**Connections (§1).**
> This lesson builds on Bayes' rule, model evidence, KL divergence, and posterior predictive thinking. Earlier
> lessons treated the posterior as the object we want; this lesson addresses the common case where that posterior
> is too expensive to compute exactly. The model may contain many latent variables, many parameters, or both, so
> the normalizing integral is not something we can evaluate directly.
>
> Variational inference keeps the Bayesian target but changes the computational problem. Instead of sampling from
> the exact posterior or integrating it in closed form, we choose a tractable family of distributions and optimize
> within that family. This connects Bayesian statistics to the optimization tools used throughout modern machine
> learning, including topic models, Bayesian neural networks, and variational autoencoders.

**Motivation & Intuition (§2).**
> Exact Bayesian inference asks for the full posterior $p(z\mid x)$, where $z$ may be a hidden topic mixture, a
> latent embedding, a cluster assignment, or a neural-network weight. In many real models, that posterior is known
> only up to a normalizing constant. The numerator can be evaluated, but the evidence in the denominator requires a
> high-dimensional integral.
>
> Variational inference replaces that hard posterior with a simpler distribution $q(z)$. The approximation family
> might be fully factorized, Gaussian, amortized by an encoder network, or chosen for a particular model. The goal
> is not to pretend $q$ is exact. The goal is to make the best approximation available inside the chosen family.
>
> The evidence lower bound, or ELBO, is the objective that makes this practical. Maximizing the ELBO is equivalent
> to minimizing $\operatorname{KL}(q(z)\|p(z\mid x))$ because the two quantities add up to the fixed number
> $\log p(x)$. When the ELBO rises, the KL gap to the true posterior falls, as long as the model and variational
> family are held fixed.

**Definition & Assumptions (§3).** Display
$$
\operatorname{ELBO}(q)=\mathbb E_q[\log p(x,z)]-\mathbb E_q[\log q(z)]
$$
and derive it from the log-evidence identity:
1. Start with the KL divergence to the true posterior:
   $\operatorname{KL}(q(z)\|p(z\mid x))=\mathbb E_q[\log q(z)-\log p(z\mid x)]$, because KL is an expected log ratio.
2. Use Bayes' rule inside the logarithm:
   $\log p(z\mid x)=\log p(x,z)-\log p(x)$, because $p(z\mid x)=p(x,z)/p(x)$.
3. Substitute that expression:
   $\operatorname{KL}=\mathbb E_q[\log q(z)-\log p(x,z)+\log p(x)]$.
4. Pull out $\log p(x)$ because it does not depend on $z$:
   $\operatorname{KL}=\mathbb E_q[\log q(z)]-\mathbb E_q[\log p(x,z)]+\log p(x)$.
5. Rearrange one term at a time:
   $\log p(x)=\mathbb E_q[\log p(x,z)]-\mathbb E_q[\log q(z)]+\operatorname{KL}(q\|p)$.
6. Name the first two terms the ELBO:
   $\log p(x)=\operatorname{ELBO}(q)+\operatorname{KL}(q(z)\|p(z\mid x))$.
7. Since KL divergence is nonnegative, $\operatorname{ELBO}(q)\le \log p(x)$.
8. Worked arithmetic: if $\mathbb E_q[\log p(x,z)]=-190$ and $\mathbb E_q[\log q(z)]=-40$, then
   $\operatorname{ELBO}=-190-(-40)=-150$. If $\log p(x)=-130$, then the KL gap is
   $-130-(-150)=20$ nats.

**Symbols.** $x$ is observed data; $z$ is the latent variable or parameter being approximated; $q(z)$ is the
chosen variational distribution; $p(x,z)$ is the joint model; $p(z\mid x)$ is the exact posterior;
$\mathbb E_q$ means expectation under $q$; KL measures the approximation gap in the chosen direction.

**Real-World Applications (§5).**
1. **Latent Dirichlet allocation.** A document with topic weights $[0.7,0.2,0.1]$ stores three variational
   probabilities that sum to $1.0$.
2. **Bayesian neural networks.** A variational weight $q(w)=\mathcal N(0.8,0.1^2)$ is sampled as
   $w=0.8+0.1\epsilon$; at $\epsilon=2$, the sample is $1.0$.
3. **Variational autoencoders.** If the encoder outputs $\mu=2$ and $\sigma=0.5$, the reparameterized latent
   sample at $\epsilon=-1$ is $z=1.5$.
4. **Recommendation models.** Mean-field user and item factor means $[1.0,0.5]$ and $[0.2,2.0]$ give predicted
   score $1.0(0.2)+0.5(2.0)=1.2$.
5. **Streaming approximate Bayes.** Raising an ELBO from $-1000$ to $-940$ improves the bound by $60$ nats.
6. **Uncertainty dashboards.** If $q(\theta)=\mathcal N(0.03,0.01^2)$, the rough $95\%$ interval is
   $0.03\pm1.96(0.01)=[0.0104,0.0496]$.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted plan content for the lesson. The labels are shorthand for the
plan; the app renders as flowing prose in a plain, warm textbook voice. Each app number should remain
re-derivable from that lesson's own concept.

### `math-20-01` — The Bayesian view of probability  · explain-only

**Connections (§1).**
> This opening lesson connects ordinary probability calculations to the Bayesian habit of updating information. The
> reader already knows that conditional probabilities can be rearranged with the multiplication rule. Here that same
> identity becomes a way to move from prior information to posterior information after data arrive. The lesson sets up
> the vocabulary used throughout the section: prior, likelihood, posterior, and evidence.

**Motivation & Intuition (§2).**
> Bayesian probability treats probability as a state of information that can be updated when evidence arrives. The
> same unknown quantity can be uncertain before data are observed and less uncertain afterward. A probability is not
> only a long-run frequency in this view; it is also a disciplined summary of what the model currently knows.
>
> Bayes' rule makes that update explicit. Prior information and data do not compete with each other; they are counted
> in different parts of the same bookkeeping identity. The prior records what was known before the current data, the
> likelihood records how compatible each value is with the data, and the posterior records the combined state of
> information.

**Definition & Assumptions (§3).** Explain-only because this is the conceptual doorway into the section. Still display Bayes' rule and show the multiplication-rule identity in prose:
$$
p(\theta\mid D)=\frac{p(D\mid\theta)p(\theta)}{p(D)}
$$
The multiplication-rule identity is
$p(\theta,D)=p(D\mid\theta)p(\theta)=p(\theta\mid D)p(D)$.

**Symbols.** $\theta$ unknown quantity; $D$ observed data; $p(\theta)$ prior; $p(D\mid\theta)$ likelihood;
$p(\theta\mid D)$ posterior; $p(D)$ evidence.

**Real-World Applications (§5).**
1. **Rare-event screening:** prevalence $0.01$, sensitivity $0.95$, false-positive rate $0.04$ gives
   $P(disease\mid +)=0.0095/(0.0095+0.0396)=0.193$.
2. **Spam filtering:** prior spam $0.30$, word likelihoods $0.50$ and $0.05$ give $0.15/(0.15+0.035)=0.811$.
3. **A/B model belief:** prior odds $1:1$ and likelihood ratio $3$ give posterior probability $3/(3+1)=0.75$.
4. **Sensor fusion:** room odds $2:1$ multiplied by likelihood ratio $0.5$ become $1:1$.
5. **Fraud alerts:** fraud prior $0.005$, hit rate $0.80$, false alarm $0.02$ gives $0.004/(0.004+0.0199)=0.167$.
6. **Model comparison:** priors $0.5,0.5$ and likelihoods $0.12,0.04$ give posterior model-1 probability
   $0.06/(0.06+0.02)=0.75$.

### `math-20-02` — Priors  · explain-only

**Connections (§1).**
> This lesson follows the Bayesian view of probability by naming the first input to an update. Before the current data
> are used, a model still needs a distribution over the unknown quantity. That distribution may be weak, strong,
> historical, or chosen for regularization. Later lessons use priors in conjugate updates, hierarchical models, and
> Bayesian neural-network uncertainty.

**Motivation & Intuition (§2).**
> A prior is the distribution a model is willing to update before the current data are used. It can encode weak
> background scale, past experiments, physical constraints, or regularization for sparse data. In small data settings,
> it can prevent a model from treating a few observations as if they were complete knowledge.
>
> The important point is that a prior is part of the model, not an afterthought. It must put valid probability mass on
> possible parameter values, and its strength should match the amount of information it is meant to contribute. A weak
> prior can still express scale and direction, while a strong prior should be justified by stable past evidence or a
> real constraint.

**Definition & Assumptions (§3).** Explain-only because a prior is a modeling choice, not a theorem. Include the checks that a discrete prior sums to $1$ and a continuous prior integrates to $1$:
$$
\sum_\theta p(\theta)=1,
\qquad
\int p(\theta)\,d\theta=1.
$$

**Symbols.** $p(\theta)$ prior density or mass; $\alpha,\beta$ Beta shape parameters; $m_0,v_0$ Normal prior
mean and variance; prior strength means the amount of information the prior contributes.

**Real-World Applications (§5).**
1. **Cold-start CTR:** $\operatorname{Beta}(4,96)$ has mean $4/(4+96)=0.04$.
2. **Weight shrinkage:** $w=3$ under $\mathcal N(0,1)$ is $3$ standard deviations from zero.
3. **Historical A/B baseline:** $\operatorname{Beta}(30,970)$ plus $4$ clicks in $100$ visits has posterior mean
   $34/1100=0.0309$.
4. **Word smoothing:** $\operatorname{Beta}(1,1)$ plus $0$ occurrences in $8$ emails gives mean $1/10=0.10$.
5. **Reliability prior:** $\operatorname{Beta}(2,998)$ has mean $0.002$ and strength $1000$.
6. **Sparse group pooling:** $\operatorname{Beta}(10,90)$ plus $3$ events in $20$ trials gives $13/120=0.108$.

### `math-20-03` — Likelihoods  · AUTHOR derivation

**Connections (§1).**
> This lesson introduces the second input to a Bayesian update: the sampling model for the data. Priors describe
> information before the data; likelihoods describe how each possible parameter value would have generated the data
> that were observed. The same likelihood idea also appears in maximum likelihood estimation, logistic regression,
> language models, and anomaly detection. In Bayesian statistics, it becomes the bridge from observations to the
> posterior.

**Motivation & Intuition (§2).**
> A likelihood scores parameter values by how well they would have predicted the data already observed. The data are
> treated as fixed, and the parameter is the argument being compared. A parameter value with a larger likelihood made
> the observed sample less surprising under the assumed sampling model.
>
> A likelihood is not a probability distribution over the parameter until the prior and normalization enter. It can be
> multiplied by constants without changing comparisons among parameter values. This is why likelihood kernels are so
> useful: they keep the factors involving the parameter and ignore constants that do not affect the posterior shape.

**Definition & Assumptions (§3).** For Bernoulli data with $s$ successes and $f$ failures:
$$
L(\theta)\propto\theta^s(1-\theta)^f
$$
1. one success has probability $\theta$ and one failure has probability $1-\theta$ by the sampling model;
2. conditional independence multiplies trial probabilities;
3. collect the success factors to get $\theta^s$;
4. collect failure factors to get $(1-\theta)^f$;
5. ignore ordering constants when comparing $\theta$, so $L(\theta)\propto\theta^s(1-\theta)^f$.

**Symbols.** $L(\theta)$ likelihood as a function of $\theta$; $s$ successes; $f$ failures; $D$ fixed data.

**Real-World Applications (§5).**
1. **MLE coin rate:** $8$ heads in $10$ flips gives $\hat\theta=0.8$.
2. **Log-likelihood training:** probabilities $0.7,0.9,0.8$ give $\log L\approx-0.685$.
3. **Language-model sentence:** token probabilities $0.10,0.25,0.40$ multiply to $0.010$.
4. **Anomaly score:** likelihood $0.0005$ is $100$ times smaller than $0.05$.
5. **Calibration setting:** densities $0.18$ and $0.06$ give likelihood ratio $3$.
6. **Coin comparison:** with $4$ heads and $1$ tail, $L(0.8)/L(0.5)=0.8^4(0.2)/(0.5^5)=2.621$.

### `math-20-04` — Posteriors  · AUTHOR derivation

**Connections (§1).**
> This lesson brings priors and likelihoods together. After the Bayesian view of probability, priors, and likelihoods
> have been introduced separately, the posterior is the distribution produced by combining them. It is the object used
> by credible intervals, posterior predictive distributions, hierarchical shrinkage, model comparison, and Bayesian
> decision rules. The rest of the section repeatedly returns to this update.

**Motivation & Intuition (§2).**
> The posterior is the updated distribution after prior information and the likelihood have both been counted. It says
> how the model distributes belief across parameter values after seeing the observed data. If the likelihood strongly
> favors a region and the prior allows that region, the posterior moves there; if the data are weak, the prior remains
> more visible.
>
> The evidence in the denominator makes the posterior a valid probability distribution. In discrete problems, this is
> just a normalization step over unnormalized weights. In continuous problems, it is an integral. Either way, the
> posterior is the distribution used for intervals, predictions, and decisions.

**Definition & Assumptions (§3).**
1. Start with joint probability written one way: $p(\theta,D)=p(D\mid\theta)p(\theta)$.
2. Write the same joint probability by conditioning on data: $p(\theta,D)=p(\theta\mid D)p(D)$.
3. Set the two right sides equal because they describe the same joint event.
4. Divide by $p(D)$ to get
   $$
   p(\theta\mid D)=\frac{p(D\mid\theta)p(\theta)}{p(D)}.
   $$
5. For discrete hypotheses, compute weights $w_i=p(D\mid H_i)p(H_i)$ and normalize with $w_i/\sum_r w_r$.

**Symbols.** $H_i$ candidate hypothesis; $w_i$ unnormalized posterior weight; $p(D)$ normalizer.

**Real-World Applications (§5).**
1. **Three-hypothesis update:** priors $0.5,0.3,0.2$ and likelihoods $0.2,0.5,0.1$ give weights
   $0.10,0.15,0.02$ and posterior $(0.370,0.556,0.074)$.
2. **CTR posterior:** $\operatorname{Beta}(3,7)$ plus $2$ clicks and $3$ skips gives $\operatorname{Beta}(5,10)$,
   mean $0.333$.
3. **Reliability:** $\operatorname{Beta}(1,999)$ plus $2$ failures in $1000$ tests gives mean $3/2000=0.0015$.
4. **Drift alert:** posterior probability $0.93$ above a risk threshold exceeds an alert threshold $0.90$.
5. **Demand planning:** posterior mean $120$ and sd $15$ gives rough range $90$ to $150$.
6. **Decision rule:** posterior risk $0.82$ exceeds action threshold $0.80$.

### `math-20-05` — Conjugate priors  · AUTHOR derivation

**Connections (§1).**
> This lesson uses the prior, likelihood, and posterior pieces from the previous lessons in a special algebraic case.
> Some priors are matched to common likelihoods so that the posterior stays in the same family. That match makes exact
> Bayesian updating transparent and computationally cheap. It also provides the counting intuition behind several
> later models, including the Beta-Binomial and Dirichlet-multinomial updates.

**Motivation & Intuition (§2).**
> Conjugacy is an algebraic match between prior and likelihood. Updating changes the parameters of the prior family
> without changing the family itself. For a Beta prior and Bernoulli data, this means the posterior is another Beta
> distribution with successes and failures added to the shape parameters.
>
> The value of conjugacy is not only convenience. It shows how Bayesian updating can behave like careful accounting:
> prior pseudo-counts are combined with observed counts, and the resulting posterior can be summarized immediately.
> This exact pattern becomes a reference point for approximate inference methods introduced later.

**Definition & Assumptions (§3).** For a Beta prior and Bernoulli likelihood:
1. write the prior kernel $p(\theta)\propto\theta^{\alpha-1}(1-\theta)^{\beta-1}$;
2. write the likelihood kernel $p(D\mid\theta)\propto\theta^s(1-\theta)^f$;
3. multiply prior and likelihood because posterior is proportional to their product;
4. add exponents on matching bases;
5. identify the result as
   $$
   \operatorname{Beta}(\alpha+s,\beta+f).
   $$

**Symbols.** $\alpha,\beta$ prior pseudo-counts; $s,f$ observed success and failure counts; conjugate means
posterior remains in the same family.

**Real-World Applications (§5).**
1. **Click dashboard:** $\operatorname{Beta}(2,98)$ plus $12$ clicks and $188$ non-clicks becomes
   $\operatorname{Beta}(14,286)$, mean $0.0467$.
2. **Dirichlet text smoothing:** prior $(1,1,1)$ plus counts $(10,4,0)$ gives posterior $(11,5,1)$ and unseen-word
   mean $1/17$.
3. **Poisson rate:** Gamma$(3,2)$ plus $9$ arrivals in $4$ hours gives Gamma$(12,6)$, mean $2$ per hour.
4. **Gaussian measurement fusion:** prior precision $1$ and sensor precision $2$ with sensor mean $6$ gives mean
   $12/3=4$.
5. **Conversion dashboard:** $\operatorname{Beta}(50,950)$ plus $7$ conversions in $100$ visits gives
   $57/1100=0.0518$.
6. **Bandit arm:** $\operatorname{Beta}(1,1)$ plus $3$ wins and $2$ losses gives $\operatorname{Beta}(4,3)$, mean
   $0.571$.

### `math-20-06` — The Beta–Binomial model  · AUTHOR derivation

**Connections (§1).**
> This lesson applies conjugacy to the most common Bayesian counting model for binary outcomes. The prior is Beta,
> the data are successes and failures, and the posterior is again Beta. This gives a concrete version of the prior as
> starting counts and the likelihood as observed counts. The same update appears in click-through rates, defect
> monitoring, classifier accuracy, and bandit learning.

**Motivation & Intuition (§2).**
> The Beta-Binomial model is Bayesian counting for yes-or-no outcomes. The unknown success probability is not treated
> as fixed after a small sample; it remains uncertain and is represented by a Beta distribution. Observed successes and
> failures then update the two shape parameters.
>
> The prior contributes starting counts, and the data add observed successes and failures. This makes the posterior
> mean a smoothed estimate rather than a raw fraction. The same posterior also gives a direct predictive probability
> for the next success, which is why the model is useful for sparse rates and online experiments.

**Definition & Assumptions (§3).**
1. Model the success probability as $\theta\sim\operatorname{Beta}(\alpha,\beta)$.
2. With $s$ successes and $f$ failures, use the Bernoulli likelihood $\theta^s(1-\theta)^f$.
3. Multiply by the Beta prior kernel.
4. Add exponents to get posterior kernel $\theta^{\alpha+s-1}(1-\theta)^{\beta+f-1}$.
5. Read off
   $$
   \theta\mid D\sim\operatorname{Beta}(\alpha+s,\beta+f).
   $$
6. Use the Beta mean to get the next-success predictive probability $(\alpha+s)/(\alpha+\beta+s+f)$.

**Symbols.** $\theta$ success probability; $\alpha,\beta$ prior counts; $s,f$ observed counts.

**Real-World Applications (§5).**
1. **Worked feature CTR:** $\operatorname{Beta}(2,8)$ plus $7$ clicks and $13$ non-clicks gives
   $\operatorname{Beta}(9,21)$, mean $0.300$.
2. **Sparse ad CTR:** $\operatorname{Beta}(5,95)$ plus $3$ clicks in $20$ impressions gives
   $\operatorname{Beta}(8,112)$, mean $0.0667$.
3. **Variant A:** $\operatorname{Beta}(31,969)$ has mean $0.031$.
4. **Variant B:** $\operatorname{Beta}(45,955)$ has mean $0.045$.
5. **Defect monitor:** $\operatorname{Beta}(2,198)$ plus $1$ defect in $100$ parts gives mean $3/300=0.010$.
6. **Classifier accuracy:** $\operatorname{Beta}(1,1)$ plus $87$ correct in $100$ gives $\operatorname{Beta}(88,14)$,
   mean $0.863$.

### `math-20-07` — The Normal–Normal model  · AUTHOR derivation · FIX LaTeX

**Connections (§1).**
> This lesson gives the Normal analogue of the Beta-Binomial update. Instead of estimating a binary success
> probability, the model estimates an unknown mean from noisy measurements. The prior contributes a mean and variance,
> and the data contribute a sample mean and observation variance. This precision-weighting idea later supports
> hierarchical Normal models, Kalman-style updates, and Gaussian approximations.

**Motivation & Intuition (§2).**
> Normal-Normal updating estimates an unknown mean from noisy Normal measurements. Both the prior and the data are
> expressed as Normal information about the same mean. The posterior mean lands between the prior mean and the sample
> mean, with the more precise source receiving more weight.
>
> Precision is inverse variance, so more precise sources count more. A low-variance sensor can move the posterior
> strongly, while a high-variance prior contributes only gentle shrinkage. The posterior variance also shrinks because
> combining independent information makes the unknown mean better determined.

**Definition & Assumptions (§3).**
1. Write the prior kernel for $\mu$: $\exp[-(\mu-m_0)^2/(2v_0)]$.
2. For $n$ Normal observations with sample mean $\bar x$ and known variance $\sigma^2$, write the likelihood kernel
   $\exp[-n(\bar x-\mu)^2/(2\sigma^2)]$.
3. Multiply kernels, which adds log exponents.
4. Collect the $\mu^2$ coefficient to get posterior precision $1/v_n=1/v_0+n/\sigma^2$.
5. Collect the linear $\mu$ term to get $m_n/v_n=m_0/v_0+n\bar x/\sigma^2$.
6. Solve for
   $$
   m_n=v_n(m_0/v_0+n\bar x/\sigma^2).
   $$

**Symbols.** $m_0,v_0$ prior mean and variance; $\bar x$ sample mean; $\sigma^2$ observation variance; $v_n,m_n$
posterior variance and mean; precision is $1/$variance.

**Real-World Applications (§5).**
1. **Worked delivery mean:** prior $10$, variance $4$, $n=9$, $\bar x=13$, $\sigma^2=9$ gives $m_n=12.4$, $v_n=0.8$.
2. **Sensor averaging:** prior $20$ variance $4$ and sensor $23$ variance $1$ give mean $22.4$.
3. **Weight shrinkage:** prior $0$ variance $1$ and data estimate $3$ variance $0.25$ give mean $2.4$.
4. **Experiment lift:** prior $1\%$ variance $4$ and estimate $5\%$ variance $1$ give $4.2\%$; this fixes the
   unclosed dollar sign.
5. **Kalman update:** prediction variance $4$ and measurement variance $1$ give posterior variance $1/(1/4+1)=0.8$.
6. **Rating aggregation:** prior $3.5$ variance $1$ and four ratings with mean $4.5$ and rating variance $1$ give mean
   $(3.5+18)/5=4.3$.

### `math-20-08` — Noninformative priors  · explain-only

**Connections (§1).**
> This lesson returns to priors with a focus on weak prior information. Earlier lessons used priors as ordinary
> modeling inputs, often with visible pseudo-counts or variances. Here the goal is to understand what happens when a
> model tries to contribute as little information as possible. The lesson prepares the reader to treat default priors
> carefully in Bayesian workflows.

**Motivation & Intuition (§2).**
> A noninformative prior tries to add little information on a chosen scale. It is often used when the analyst wants
> the likelihood to dominate or when there is no strong historical information. Examples include a uniform Beta prior
> for a proportion or a very wide Normal prior for a regression coefficient.
>
> Weak does not mean assumption-free, because flatness changes under reparameterization. A prior that is flat on a
> probability scale is not flat on an odds scale, and a flat scale prior may be improper unless the posterior
> normalizes after data are included. The lesson therefore treats noninformative priors as modeling choices that still
> need checks.

**Definition & Assumptions (§3).** Explain-only because the lesson compares modeling choices rather than proving one neutral prior is universally correct. Include the concrete contrast between $\operatorname{Beta}(1,1)$ and Jeffreys $\operatorname{Beta}(1/2,1/2)$.

**Symbols.** Improper prior means total prior mass is infinite; proper posterior means the posterior normalizes;
Jeffreys prior is invariant under smooth reparameterization.

**Real-World Applications (§5).**
1. **Uniform CTR default:** after $2$ conversions in $10$ visits, $\operatorname{Beta}(1,1)$ gives mean $3/12=0.25$.
2. **Jeffreys small sample:** $\operatorname{Beta}(0.5,0.5)$ plus $2$ successes and $8$ failures gives $2.5/11=0.227$.
3. **Wide regression prior:** $\mathcal N(0,100^2)$ makes coefficient $2$ only $0.02$ sd from the mean.
4. **Flat location prior:** with $n=5$ and observation variance $10$, posterior variance is $10/5=2$.
5. **Scale sensitivity:** $1$ to $10$ spans $9$ units on the original scale but $\log 10=2.303$ on log scale.
6. **One-trial caution:** one success with $\operatorname{Beta}(1,1)$ gives posterior mean $2/3=0.667$, not $1$.

### `math-20-09` — Credible intervals  · AUTHOR derivation

**Connections (§1).**
> This lesson turns a posterior distribution into an uncertainty statement. Once the posterior has been computed, a
> learner often wants a range of plausible parameter values rather than only a mean. Credible intervals provide that
> range directly from posterior probability mass. They connect the update machinery of earlier lessons to reporting,
> monitoring, and decision support.

**Motivation & Intuition (§2).**
> A credible interval reports posterior probability mass for the parameter after the data are included. Under the
> chosen model, prior, and likelihood, a $95\%$ credible interval contains $95\%$ of the posterior distribution. This
> makes it a direct Bayesian statement about the uncertain parameter.
>
> For a Normal posterior, the familiar mean plus or minus $1.96$ standard deviations gives the central $95\%$ interval.
> For skewed or bounded posteriors, quantiles are usually better than a symmetric shortcut. In either case, the
> interval is a summary of the posterior, not a separate procedure from the Bayesian update.

**Definition & Assumptions (§3).** For an equal-tailed Normal posterior:
1. assume $\theta\mid D\sim\mathcal N(m,s^2)$.
2. Standardize with $Z=(\theta-m)/s$ so posterior probabilities can use the standard Normal table.
3. The central $95\%$ standard Normal interval is $[-1.96,1.96]$.
4. Undo the standardization to get
   $$
   [m-1.96s,m+1.96s].
   $$
5. For non-Normal posteriors, use posterior quantiles instead of the Normal shortcut.

**Symbols.** $m$ posterior mean; $s$ posterior sd; $a,b$ interval endpoints; equal-tailed means $2.5\%$ mass in
each tail.

**Real-World Applications (§5).**
1. **Worked Normal interval:** $m=12.4$, variance $0.8$, $s=0.894$ gives $[10.647,14.153]$.
2. **A/B lift:** $0.03\pm1.96(0.015)=[0.0006,0.0594]$.
3. **CTR uncertainty:** $0.10\pm1.96(0.03)$ gives $[0.041,0.159]$.
4. **Latency mean:** $120\pm1.96(5)=[110.2,129.8]$ ms.
5. **Calibration slope:** $0.92\pm1.96(0.04)=[0.842,0.998]$.
6. **Beta interval:** $\operatorname{Beta}(9,21)$ has equal-tailed $95\%$ interval about $[0.153,0.472]$.

### `math-20-10` — Posterior predictive distributions  · deepen

**Connections (§1).**
> This lesson moves from uncertainty about parameters to uncertainty about future data. The posterior describes what
> is known about a parameter after observing data, but prediction requires one more step. Future observations vary
> both because the parameter is uncertain and because new data are noisy. Posterior predictive distributions carry
> both sources into the predictive quantity used by models and decisions.

**Motivation & Intuition (§2).**
> The posterior predictive distribution carries parameter uncertainty into uncertainty about new observations. It does
> not stop at estimating $\theta$; it asks what data are likely next after averaging over the posterior uncertainty in
> $\theta$. This is the distribution used when the practical task is forecasting, simulation, or model checking.
>
> The load-bearing idea is integration over the posterior. For each possible parameter value, the sampling model gives
> a prediction for new data. The posterior predictive averages those predictions using the posterior as weights, so it
> predicts data, not just parameters.

**Definition & Assumptions (§3).**
1. Start with the joint conditional density for future data and parameter:
   $p(x_{new},\theta\mid D)=p(x_{new}\mid\theta,D)p(\theta\mid D)$.
2. Assume future data are conditionally independent of old data given $\theta$, so
   $p(x_{new}\mid\theta,D)=p(x_{new}\mid\theta)$.
3. Integrate out $\theta$ because it is still uncertain.
4. Obtain
   $$
   p(x_{new}\mid D)=\int p(x_{new}\mid\theta)p(\theta\mid D)d\theta.
   $$
5. For $\theta\mid D\sim\operatorname{Beta}(a,b)$, the next-success probability is $\mathbb E[\theta]=a/(a+b)$.

**Symbols.** $x_{new}$ future observation; $D$ observed data; predictive distribution averages over the posterior.

**Real-World Applications (§5).**
1. **Worked click forecast:** $\operatorname{Beta}(9,21)$ gives next-click probability $9/30=0.30$ and expected
   $3$ clicks in $10$.
2. **Ad clicks:** $\operatorname{Beta}(20,180)$ gives next-click probability $0.10$ and expected $10$ clicks in $100$.
3. **Inventory:** predictive mean $500$, sd $60$, stock $620$ is $2$ sd above mean.
4. **Predictive check:** $950$ of $1000$ replicated maxima below observed gives tail warning probability $0.95$ in the lower direction.
5. **Bayesian ensemble:** weights $0.2,0.5,0.3$ on predictions $0.1,0.4,0.8$ give $0.46$.
6. **Latency prediction:** posterior mean variance $4$ plus observation noise variance $25$ gives predictive sd
   $\sqrt{29}=5.39$ ms.

### `math-20-11` — Hierarchical models  · AUTHOR derivation

**Connections (§1).**
> This lesson extends posterior updating from one parameter to many related parameters. Earlier lessons updated a
> single rate or mean; hierarchical models let many groups share information through a population distribution. This
> is the Bayesian form of partial pooling. It is especially useful when some groups have large samples and others have
> only a few observations.

**Motivation & Intuition (§2).**
> Hierarchical Bayes lets related groups learn together. Each group has its own parameter, but those parameters are
> tied together by a higher-level population pattern. A small group is therefore not estimated only from its own noisy
> data; it also borrows strength from related groups.
>
> Small groups move toward the population pattern more strongly, while large groups keep more of their own data
> signal. This shrinkage is not an arbitrary correction. It comes from the same precision-weighting logic as the
> Normal-Normal model, with the group prior acting as population-level information.

**Definition & Assumptions (§3).** For one Normal group with known variances:
1. model $\bar y_j\mid\theta_j\sim\mathcal N(\theta_j,\sigma^2/n_j)$.
2. set the group prior $\theta_j\sim\mathcal N(\mu,\tau^2)$.
3. Apply the Normal-Normal update with prior variance $\tau^2$ and observation variance $\sigma^2/n_j$.
4. The posterior mean is
   $$
   m_j=v_j(\mu/\tau^2+\bar y_j/(\sigma^2/n_j)).
   $$
5. As $n_j$ grows, $\sigma^2/n_j$ shrinks, so the data precision grows and pooling weakens.

**Symbols.** $j$ group index; $i$ observation index; $\theta_j$ group parameter; $\mu,\tau^2$ population mean and
between-group variance; partial pooling means weighted shrinkage toward the group prior.

**Real-World Applications (§5).**
1. **Worked hospital mean:** $n=4$, $\bar y=12$, $\mu=10$, $\tau^2=9$, $\sigma^2=36$ gives equal variances $9$ and
   posterior mean $11$.
2. **Hospital complication:** $2/5$ raw with prior $\operatorname{Beta}(8,92)$ gives posterior mean $10/105=0.095$.
3. **Market lift:** prior $1\%$ and segment estimate $3\%$ with equal precision give $2\%$.
4. **Sparse user:** prior $\operatorname{Beta}(9,11)$ plus one like in one view gives $10/21=0.476$.
5. **Classroom effect:** class mean $88$ and district prior $80$ with equal sd $4$ gives posterior mean $84$.
6. **Meta-analysis:** study $0.30$ variance $0.04$ and population $0.10$ variance $0.01$ give mean $0.14$.

### `math-20-12` — Bayesian model comparison  · deepen

**Connections (§1).**
> This lesson applies Bayes' rule to whole models rather than single parameter values. Earlier posterior updates asked
> which parameter values were plausible inside one model. Model comparison asks which model is plausible after seeing
> the data. The evidence from the next lesson and the Bayes factor introduced here become central tools for Bayesian
> selection and averaging.

**Motivation & Intuition (§2).**
> Bayesian model comparison updates probabilities over whole models. A model can have its own prior probability, its
> own parameter prior, and its own likelihood. After the data arrive, the posterior probability of the model depends
> on how much prior predictive probability the model assigned to those data.
>
> The evidence rewards models that assigned high prior predictive probability to the observed data, not just models
> that fit after tuning. This naturally balances fit and complexity. A flexible model may fit many data sets, but it
> can spread prior predictive mass thinly; a simpler model can win when it predicted the observed pattern more
> concentratedly.

**Definition & Assumptions (§3).**
1. Treat the model index $M_k$ as an uncertain hypothesis.
2. Apply Bayes' rule:
   $$
   p(M_k\mid y)=\frac{p(y\mid M_k)p(M_k)}{p(y)}.
   $$
3. Sum over candidate models for the normalizer: $p(y)=\sum_r p(y\mid M_r)p(M_r)$.
4. For two models, divide the two posterior probabilities.
5. Terms rearrange into posterior odds = prior odds $\times$ Bayes factor.

**Symbols.** $M_k$ candidate model; $p(M_k)$ model prior; $p(y\mid M_k)$ evidence; Bayes factor is an evidence
ratio.

**Real-World Applications (§5).**
1. **Worked comparison:** priors $0.6,0.4$ and evidences $0.03,0.01$ give posterior $0.018/(0.018+0.004)=0.818$ for $M_1$.
2. **Feature sets:** evidences $0.004,0.012$ with equal priors give $0.75$ for set B.
3. **A/B lift model:** prior odds $1:1$ and Bayes factor $5$ give posterior probability $5/6=0.833$.
4. **Theory comparison:** evidence ratio $20$ and prior odds $1:4$ give posterior odds $5:1$.
5. **Forecast model:** weights $0.7(0.02)=0.014$ and $0.3(0.03)=0.009$ give posterior $0.609$ for the first model.
6. **Architecture approximation:** log evidences $-120$ and $-118$ give Bayes factor $e^2=7.39$ for the second.

### `math-20-13` — The model evidence  · AUTHOR derivation

**Connections (§1).**
> This lesson focuses on the normalizing quantity that has appeared in Bayes' rule since the first lesson. For
> parameter inference, evidence makes the posterior integrate to one. For model comparison, the same quantity becomes
> the score for an entire model. Understanding evidence clarifies why Bayesian comparison depends on prior predictive
> performance rather than only best-fit likelihood.

**Motivation & Intuition (§2).**
> Evidence is the prior predictive probability of the observed data under a model. Before seeing the data, the model
> spreads probability across possible data sets by combining its parameter prior with its likelihood. The evidence is
> the amount of that probability mass assigned to the data that actually appeared.
>
> This quantity is both the denominator of Bayes' rule and the score used in Bayesian model comparison. Inside one
> model, it normalizes the posterior over parameters. Across models, evidence ratios become Bayes factors, so models
> are rewarded for predicting the observed data well before their parameters are tuned to them.

**Definition & Assumptions (§3).**
1. Start from the joint model $p(y,\theta\mid M)=p(y\mid\theta,M)p(\theta\mid M)$.
2. The data probability under the whole model is obtained by summing or integrating over unknown $\theta$.
3. For continuous $\theta$, this gives
   $$
   p(y\mid M)=\int p(y\mid\theta,M)p(\theta\mid M)d\theta.
   $$
4. Substitute this value into Bayes' rule to normalize $p(\theta\mid y,M)$.
5. For a uniform Beta coin prior and exact sequence HHT, integrate $\theta^2(1-\theta)$ from $0$ to $1$ to get
   $1/12=0.0833$.

**Symbols.** $M$ model; $y$ observed data; $\theta$ parameter; marginal likelihood and evidence are the same
quantity.

**Real-World Applications (§5).**
1. **Posterior normalization:** if likelihood times prior integrates to $0.05$, dividing by $0.05$ makes posterior area $1$.
2. **Bayes factor:** evidences $0.009$ and $0.003$ give factor $3$.
3. **Occam comparison:** evidence $0.10$ beats $0.02$ by ratio $5$.
4. **Anomaly detection:** prior predictive $0.0004$ is $100$ times smaller than $0.04$.
5. **Language sequence:** token probabilities $0.5,0.2,0.1$ give evidence $0.01$ and log score $-4.605$.
6. **Empirical Bayes:** prior scale evidence $0.006$ versus $0.002$ favors scale $1$ by factor $3$.

### `math-20-14` — The Laplace approximation  · AUTHOR derivation

**Connections (§1).**
> This lesson begins the approximate inference block after exact updating, evidence, and model comparison. Many
> Bayesian posteriors cannot be integrated exactly, but they may still have a clear local shape near a mode. The
> Laplace approximation uses calculus to turn that local shape into a Gaussian approximation. It prepares the reader
> for later methods that approximate hard posteriors in different ways.

**Motivation & Intuition (§2).**
> Laplace approximation replaces a smooth, peaked posterior by a Gaussian fitted at the posterior mode. Near the mode,
> the log posterior can often be well approximated by a quadratic function. Exponentiating a quadratic gives a Normal
> shape, so the approximation converts local curvature into variance.
>
> This is useful because a hard integral can become a Gaussian calculation. The approximation is best when the
> posterior is unimodal and locally symmetric enough for a quadratic to describe its important mass. The curvature at
> the mode controls uncertainty: sharper curvature means smaller variance, while flat curvature means a wider or
> unreliable Gaussian approximation.

**Definition & Assumptions (§3).**
1. Let $\ell(\theta)=\log\tilde p(\theta)$ be the unnormalized log posterior.
2. Expand $\ell$ to second order at the mode $\hat\theta$.
3. The first derivative term vanishes at the mode because $\ell'(\hat\theta)=0$.
4. Write the remaining quadratic as
   $$
   \ell(\theta)\approx\ell(\hat\theta)-\tfrac12(\theta-\hat\theta)^TH(\theta-\hat\theta)
   $$
   with $H=-\nabla^2\ell(\hat\theta)$.
5. Exponentiate the quadratic to identify a Gaussian with covariance $H^{-1}$.

**Symbols.** $\hat\theta$ posterior mode or MAP; $H$ negative Hessian at the mode; $H^{-1}$ approximate covariance;
curvature means inverse variance locally.

**Real-World Applications (§5).**
1. **Worked quadratic:** $\ell(\theta)=C-8(\theta-3)^2$ has $H=16$, so approximation is $\mathcal N(3,1/16)$.
2. **MAP interval:** curvature $100$ gives sd $0.1$.
3. **Logistic regression:** $H=25$ gives weight variance $0.04$ and sd $0.2$.
4. **Last-layer BDL:** curvature $16$ gives sd $0.25$.
5. **Occam factor:** same peak $0.1$ with width factors $0.2$ and $0.05$ gives evidences $0.02$ and $0.005$.
6. **Curvature diagnostic:** $\ell''(\hat\theta)=-9$ gives variance $1/9$; zero curvature gives no finite Gaussian variance.

### `math-20-16` — Expectation–maximization (EM)  · deepen

**Connections (§1).**
> This lesson follows variational inference by showing another lower-bound method for latent-variable models. The
> posterior over hidden structure may be hard to work with directly, but it can often be summarized through
> responsibilities. EM alternates between estimating that hidden structure softly and updating parameters. It connects
> Bayesian posterior thinking to mixture models, hidden Markov models, missing data, and classical maximum likelihood.

**Motivation & Intuition (§2).**
> EM fits models with hidden variables by alternating between soft completion of missing structure and parameter
> updates using those soft completions. Instead of choosing one hard cluster assignment, missing value, or hidden path,
> the E-step computes a posterior distribution over the hidden variable under the current parameters.
>
> The M-step then treats those posterior responsibilities as weights when updating the parameters. The bound view
> explains why this works: the E-step makes a lower bound tight at the current parameter, and the M-step improves that
> bound. With exact steps, the observed likelihood does not decrease.

**Definition & Assumptions (§3).**
1. Write the observed likelihood as $p(y\mid\theta)=\sum_z p(y,z\mid\theta)$.
2. Insert any distribution $q(z)$: $p(y\mid\theta)=\sum_z q(z)p(y,z\mid\theta)/q(z)$.
3. Take logs and apply Jensen's inequality to move the log inside the average.
4. The lower bound is
   $$
   \mathbb E_q[\log p(y,z\mid\theta)]-\mathbb E_q[\log q(z)].
   $$
5. The E-step chooses $q(z)=p(z\mid y,\theta^{(t)})$, making the bound tight at the current parameter.
6. The M-step increases the bound with respect to $\theta$, so exact EM does not decrease observed likelihood.

**Symbols.** $z$ hidden variable; $q(z)$ responsibility distribution; E-step computes posterior responsibilities;
M-step updates parameters.

**Real-World Applications (§5).**
1. **Worked Gaussian mixture:** responsibilities $(0.8,0.3)$ for points $2,8$ update cluster-1 mean to $3.636$; responsibilities $(0.2,0.7)$ update cluster-2 mean to $6.667$.
2. **Soft clustering:** responsibility $0.8$ makes one point contribute $80\%$ to cluster 1.
3. **Missing data:** imputed posterior mean $5$ in $[3,7,5]$ gives mean $5$.
4. **HMM transition:** expected $A\to B$ count $12$ out of $40$ updates probability to $0.30$.
5. **Crowdsourcing:** expected $45$ correct of $50$ tasks gives worker reliability $0.90$.
6. **Latent user type:** responsibilities $[0.2,0.8]$ and like rates $[0.1,0.6]$ give $0.50$.

### `math-20-17` — MCMC for Bayesian inference  · deepen

**Connections (§1).**
> This lesson introduces sampling as a different answer to intractable posteriors. Variational inference chooses a
> tractable approximation family, and Laplace uses a Gaussian near a mode. MCMC instead constructs samples whose
> long-run distribution is the posterior. Those samples can then approximate means, intervals, predictive checks, and
> decision quantities.

**Motivation & Intuition (§2).**
> MCMC estimates a posterior by constructing a dependent sequence of samples whose long-run distribution is the
> posterior. The samples are not independent, but if the chain is designed correctly and run carefully, averages over
> the chain approximate posterior expectations.
>
> It is useful when the posterior can be evaluated only up to a constant. In Metropolis-Hastings, the evidence cancels
> in the acceptance ratio, so the sampler can compare unnormalized posterior densities. The tradeoff is diagnostic:
> the analyst must pay attention to burn-in, mixing, autocorrelation, and effective sample size.

**Definition & Assumptions (§3).** For Metropolis-Hastings:
1. propose $\theta'$ from $q(\theta'\mid\theta)$.
2. Compare the desired flow from $\theta$ to $\theta'$ with the reverse flow from $\theta'$ to $\theta$.
3. Use the ratio $p(\theta'\mid y)q(\theta\mid\theta')/[p(\theta\mid y)q(\theta'\mid\theta)]$.
4. Substitute the posterior as proportional to $p(y\mid\theta)p(\theta)$, so the evidence cancels.
5. Accept with the smaller of $1$ and that ratio to preserve the target stationary distribution.
6. Estimate posterior expectations by sample averages.

**Symbols.** $q$ proposal distribution; $a$ acceptance probability; burn-in early samples discarded; effective sample
size accounts for correlation.

**Real-World Applications (§5).**
1. **Worked acceptance:** symmetric proposal from density $0.04$ to $0.10$ gives acceptance $1$.
2. **Reverse move:** symmetric proposal from $0.10$ to $0.04$ gives acceptance $0.4$.
3. **Hierarchy summary:** $4000$ draws with mean $1.2$ and sd $0.3$ give rough interval $[0.6,1.8]$.
4. **Posterior predictive check:** $30$ of $100$ replicated statistics above observed gives tail probability $0.30$.
5. **Lift probability:** $950$ of $1000$ positive samples gives $P(lift>0)=0.95$.
6. **Decision utility:** utilities $10,8,-2,6$ average to $5.5$.

### `math-20-18` — Gaussian process regression  · AUTHOR derivation

**Connections (§1).**
> This lesson brings Bayesian inference to functions rather than finite-dimensional parameter vectors. A Gaussian
> process prior says that any finite collection of function values has a joint Normal distribution. Conditioning that
> prior on observed data gives predictions and uncertainty at new inputs. This makes GP regression a clean bridge
> between Bayesian updating and flexible nonparametric modeling.

**Motivation & Intuition (§2).**
> A Gaussian process is a prior over functions. Before data are observed, the kernel describes which input points
> should have similar function values and how variable the function can be. Observed points then condition the
> function prior, just as observed measurements condition a Normal prior in the Normal-Normal model.
>
> Regression produces a predictive mean and uncertainty at new inputs. The mean is pulled toward observed values that
> are strongly correlated with the test point, while the variance falls when nearby or highly correlated observations
> explain the test value. The kernel is therefore the modeling choice that controls smoothness, similarity, and
> extrapolation.

**Definition & Assumptions (§3).**
1. For finite training values and one test value, write the joint Normal distribution
   $$
   \begin{bmatrix}y\\ f_*\end{bmatrix}\sim\mathcal N\left(0,\begin{bmatrix}K+\sigma_n^2I&k_*\\k_*^T&k_{**}\end{bmatrix}\right).
   $$
2. Apply the multivariate Normal conditioning formula.
3. The conditional mean is $k_*^T(K+\sigma_n^2I)^{-1}y$.
4. The conditional variance is $k_{**}-k_*^T(K+\sigma_n^2I)^{-1}k_*$.
5. In the one-point noiseless case, this reduces to covariance ratio times the observed value and prior variance minus explained variance.

**Symbols.** $K$ training covariance matrix; $k_*$ covariances between test and training inputs; $k_{**}$ prior
variance at the test input; $\sigma_n^2$ noise variance; kernel means covariance function.

**Real-World Applications (§5).**
1. **Worked one-point GP:** $k_*=0.5$, $k_{**}=1$, observed $y=2$ gives mean $1.0$ and variance $0.75$.
2. **Bayesian optimization:** mean $0.6$, sd $0.2$ gives upper confidence $1.0$.
3. **Spatial interpolation:** correlation $0.5$ with measured value $10$ predicts $5$.
4. **RBF time kernel:** length scale $2$ and distance $1$ gives covariance $e^{-1/8}=0.882$.
5. **Robotics calibration:** bias mean $0.03$ m and sd $0.01$ gives rough interval $[0.01,0.05]$ m.
6. **Small-data regression:** covariance $0.8$ to value $5$ gives noiseless prediction $4$.

### `math-20-19` — Bayesian deep learning & uncertainty  · deepen · ML capstone

**Connections (§1).**
> This capstone lesson connects the section's Bayesian ideas to modern neural-network uncertainty. Earlier lessons
> introduced posteriors, posterior predictive distributions, Laplace approximation, variational inference, MCMC, and
> Gaussian processes. Bayesian deep learning uses those ideas to reason about plausible weights, functions, or
> last-layer parameters. The goal is prediction with uncertainty, not only a single neural-network output.

**Motivation & Intuition (§2).**
> Bayesian deep learning averages predictions across plausible neural-network weights, functions, or last-layer
> parameters. A single trained network gives one prediction, but a Bayesian treatment keeps track of the fact that many
> settings of the model may still be plausible after the data. Averaging across those settings gives a posterior
> predictive distribution.
>
> Its capstone role is to connect the section's posterior, predictive, VI, Laplace, MCMC, and GP ideas to modern ML
> uncertainty. Different approximations represent the posterior in different ways, but the predictive target is the
> same. Disagreement across plausible models measures epistemic uncertainty, while noise that remains even for a fixed
> model is aleatoric uncertainty.

**Definition & Assumptions (§3).**
1. Begin with the posterior predictive target
   $$
   p(y_*\mid x_*,D)=\int p(y_*\mid x_*,w)p(w\mid D)dw.
   $$
2. Recognize that exact integration over neural-network weights is usually intractable.
3. Draw or approximate $S$ posterior weight samples $w^{(s)}$.
4. Replace the integral by a Monte Carlo average: $\frac1S\sum_s p(y_*\mid x_*,w^{(s)})$.
5. Estimate epistemic uncertainty with disagreement across samples.
6. Keep aleatoric uncertainty as the noise predicted even by one fixed model.

**Symbols.** $x_*$ new input; $y_*$ new output; $w$ neural-network weights; $S$ posterior samples; epistemic
uncertainty comes from model uncertainty; aleatoric uncertainty comes from data noise.

**Real-World Applications (§5).**
1. **Worked classifier:** probabilities $0.70,0.60,0.20$ average to $0.50$, sample variance is $0.07$, and binary entropy is $0.693$ nats.
2. **Medical triage:** risk samples $0.12,0.18,0.30$ average to $0.20$.
3. **Autonomous perception:** predictions $0.1,0.2,0.8,0.7,0.2$ average to $0.40$ with high disagreement.
4. **OOD detection:** entropy gap $1.05-0.15=0.90$ nats.
5. **Forecasting:** demand $500\pm1.96(40)$ gives rough interval $[421.6,578.4]$.
6. **Bayesian last layer:** feature value $2$ and weight samples $0.4,0.5,0.7$ give logits $0.8,1.0,1.4$.

---

## Build order for this section

1. **Mechanical pass first:** fix the unclosed dollar sign in `math-20-07` application 4 and promote the 10 inline key
   formulas to display form.
2. **Core Bayes chain:** author `20-01…20-07` so prior, likelihood, posterior, conjugacy, Beta-Binomial, and
   Normal-Normal updates are internally consistent.
3. **Uncertainty outputs:** author `20-09…20-13` so credible intervals, posterior predictive distributions,
   hierarchical shrinkage, model comparison, and evidence share notation.
4. **Approximate inference block:** author `20-14…20-18` in order: Laplace, VI model entry, EM, MCMC, GP regression.
5. **ML capstone last:** author `20-19` after VI/Laplace/MCMC/GP so Bayesian deep-learning uncertainty can point
   back to the methods that approximate its predictive integral.
