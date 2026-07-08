# Learning Theory
> **Source:** CS 229 · **Category:** Formula/Theorem · **Type:** 🧮 Numeric · [↑ Full reference](../../ai-ml-cheatsheets.md)

## 1. Overview

Learning theory turns the informal hope "low training error means low test error" into a probability statement. It explains how sample size, confidence level, hypothesis-class size, and model capacity control the gap between empirical error and true generalization error.

The central intuition is: a training set is only evidence about the future when it is sampled independently from the same distribution as future test examples, and the more hypotheses we allow ourselves to search over, the more samples we need before training error becomes trustworthy.

## 2. Key Idea

### Events, bad events, and the union bound

Let $A_1,\ldots,A_k$ be $k$ events. The union bound states

$$
P(A_1\cup\ldots\cup A_k)\leq P(A_1)+\ldots+P(A_k).
$$

Read it as: the probability that at least one bad event happens is at most the sum of the individual bad-event probabilities, even if the events overlap.

For learning theory, one bad event is often

$$
A_h=\{|\epsilon(h)-\widehat{\epsilon}(h)|>\gamma\},
$$

meaning that hypothesis $h$ has empirical error more than $\gamma$ away from its true error. The union bound lets us control the event that any hypothesis in a finite class looks misleadingly good or bad.

### Hoeffding's inequality

Let $Z_1,\ldots,Z_m$ be $m$ iid variables drawn from a Bernoulli distribution of parameter $\phi$. Let $\widehat{\phi}$ be their sample mean and $\gamma>0$ fixed. Hoeffding's inequality says

$$
P\left(|\phi-\widehat{\phi}|>\gamma\right)\leq 2\exp(-2\gamma^2m).
$$

Read it as: for Bernoulli averages, the probability of an estimation error larger than $\gamma$ decays exponentially fast in the sample size $m$.

In classification, for a fixed classifier $h$, the mistake indicator

$$
Z_i=\mathbf{1}_{\{h(x^{(i)})\neq y^{(i)}\}}
$$

is Bernoulli. Its population mean is the true error $\epsilon(h)$, and its sample mean is the training error $\widehat{\epsilon}(h)$. Thus Hoeffding becomes

$$
P\left(|\epsilon(h)-\widehat{\epsilon}(h)|>\gamma\right)\leq 2\exp(-2\gamma^2m)
$$

for a fixed $h$.

### Empirical error and generalization error

For a given classifier $h$, the training error, also called empirical risk or empirical error, is

$$
\widehat{\epsilon}(h)=\frac{1}{m}\sum_{i=1}^{m}\mathbf{1}_{\{h(x^{(i)})\neq y^{(i)}\}}.
$$

Read it as: count the training examples that $h$ misclassifies, then divide by the number of training examples.

The corresponding population or generalization error is

$$
\epsilon(h)=P(h(x)\neq y),
$$

where $(x,y)$ is a fresh example drawn from the data-generating distribution. Read it as: the long-run mistake probability on new examples from the same distribution.

Empirical risk minimization chooses

$$
\widehat{h}=\arg\min_{h\in\mathcal{H}}\widehat{\epsilon}(h).
$$

Read it as: among hypotheses in $\mathcal{H}$, pick one with the smallest observed training error.

### Bias and variance

For an estimator $\hat{\theta}$ of a parameter $\theta$, the bias is

$$
\operatorname{Bias}(\hat{\theta})=E[\hat{\theta}]-\theta.
$$

Read it as: bias is systematic error in the average estimate.

For a random variable $X$, variance is

$$
\operatorname{Var}(X)=E[(X-E[X])^2]=E[X^2]-E[X]^2.
$$

Read it as: variance measures how much a quantity fluctuates around its own mean.

For a learned predictor $\widehat{f}$ at a fixed input $x$, the same idea is often summarized as

$$
\operatorname{Bias}(x)=E[\widehat{f}(x)]-f(x),
\qquad
\operatorname{Var}(x)=E\left[(\widehat{f}(x)-E[\widehat{f}(x)])^2\right].
$$

Read it as: high bias means the model class is systematically wrong; high variance means the learned model changes too much when the training set changes. Simpler models tend to have higher bias and lower variance, while more complex models tend to have lower bias and higher variance.

### PAC assumptions

Probably Approximately Correct, or PAC, learning uses two core sampling assumptions:

- the training and testing sets follow the same distribution;
- the training examples are drawn independently.

Read them as: examples used to train and examples used to test must be iid from the same source; otherwise the probability bounds need not describe deployment behavior.

A typical PAC-style statement has the form: with probability at least $1-\delta$ over the random training set, the learned classifier has true error within a controlled tolerance of the best classifier in the class.

### Finite-class PAC upper bound

Let $\mathcal{H}$ be a finite hypothesis class such that $|\mathcal{H}|=k$ and let $\delta$ and the sample size $m$ be fixed. Then, with probability of at least $1-\delta$, we have

$$
\epsilon(\widehat{h})\leq\left(\min_{h\in\mathcal{H}}\epsilon(h)\right)+2\sqrt{\frac{1}{2m}\log\left(\frac{2k}{\delta}\right)}.
$$

Read it as: empirical risk minimization over a finite class performs nearly as well as the best hypothesis in that class, with an additive penalty that grows with $\log k$ and $\log(1/\delta)$ and shrinks like $1/\sqrt{m}$.

The key intermediate uniform-convergence statement is

$$
\forall h\in\mathcal{H},\qquad |\epsilon(h)-\widehat{\epsilon}(h)|\leq\sqrt{\frac{1}{2m}\log\left(\frac{2k}{\delta}\right)}
$$

with probability at least $1-\delta$. Read it as: all hypotheses in the finite class have reliable training-error estimates simultaneously.

### Shattering

Given a set $S=\{x^{(1)},\ldots,x^{(d)}\}$, and a set of classifiers $\mathcal{H}$, we say that $\mathcal{H}$ shatters $S$ if for any set of labels $\{y^{(1)},\ldots,y^{(d)}\}$, we have

$$
\exists h\in\mathcal{H},\quad \forall i\in[\![1,d]\!],\quad h(x^{(i)})=y^{(i)}.
$$

Read it as: no matter how the $d$ points are labeled, the hypothesis class can realize that labeling perfectly.

### VC dimension

The Vapnik-Chervonenkis dimension of a given infinite hypothesis class $\mathcal{H}$, noted $\mathrm{VC}(\mathcal{H})$, is the size of the largest set that is shattered by $\mathcal{H}$.

Read it as: VC dimension is a capacity measure; it counts how many points the class can label in all possible ways in the most favorable arrangement.

For example, the VC dimension of

$$
\mathcal{H}=\{\text{set of linear classifiers in 2 dimensions}\}
$$

is $3$.

### Vapnik-style VC bound

Let $\mathcal{H}$ be given, with $\mathrm{VC}(\mathcal{H})=d$ and $m$ the number of training examples. With probability at least $1-\delta$, we have

$$
\epsilon(\widehat{h})\leq\left(\min_{h\in\mathcal{H}}\epsilon(h)\right)+O\left(\sqrt{\frac{d}{m}\log\left(\frac{m}{d}\right)+\frac{1}{m}\log\left(\frac{1}{\delta}\right)}\right).
$$

Read it as: for infinite classes, the effective complexity is controlled by VC dimension $d$ rather than by the raw number of hypotheses.

## 3. Worked Examples

### 🟡 Easy

#### E1. Apply the union bound to three bad events

**Problem.** Suppose a learning pipeline has three possible bad events:

$$
P(A_1)=0.02,
\qquad
P(A_2)=0.04,
\qquad
P(A_3)=0.01.
$$

Use the union bound to upper bound the probability that at least one bad event occurs. Explain why this bound may be conservative.

**Solution.**

The event that at least one bad event occurs is the union

$$
A_1\cup A_2\cup A_3.
$$

Apply the union bound:

$$
P(A_1\cup A_2\cup A_3)
\leq P(A_1)+P(A_2)+P(A_3).
$$

Substitute the three probabilities:

$$
P(A_1\cup A_2\cup A_3)
\leq 0.02+0.04+0.01.
$$

Add the first two terms:

$$
0.02+0.04=0.06.
$$

Add the third term:

$$
0.06+0.01=0.07.
$$

Therefore,

$$
P(A_1\cup A_2\cup A_3)\leq 0.07.
$$

As a percentage,

$$
0.07=7\%.
$$

The bound can be conservative because the events may overlap. If $A_1$ and $A_2$ happen together, then adding $P(A_1)+P(A_2)$ counts the overlapping outcomes twice, while the union counts them once.

For two events, the exact identity is

$$
P(A_1\cup A_2)=P(A_1)+P(A_2)-P(A_1\cap A_2).
$$

Since

$$
P(A_1\cap A_2)\geq 0,
$$

we have

$$
P(A_1\cup A_2)\leq P(A_1)+P(A_2).
$$

The same over-counting intuition extends to three or more events.

$$
\boxed{P(A_1\cup A_2\cup A_3)\leq 0.07=7\%.}
$$

#### E2. Hoeffding sample-size calculation

**Problem.** A classifier's true error is estimated by the sample mean of iid Bernoulli mistake indicators. Use Hoeffding's inequality to find a sample size $m$ sufficient to guarantee

$$
P(|\phi-\widehat{\phi}|>0.05)\leq 0.05.
$$

Equivalently, use target accuracy $\gamma=0.05$ and confidence $1-\delta=0.95$.

**Solution.**

Hoeffding's inequality gives

$$
P\left(|\phi-\widehat{\phi}|>\gamma\right)\leq 2\exp(-2\gamma^2m).
$$

We want the right-hand side to be at most $\delta=0.05$:

$$
2\exp(-2\gamma^2m)\leq \delta.
$$

Substitute $\gamma=0.05$ and $\delta=0.05$:

$$
2\exp(-2(0.05)^2m)\leq 0.05.
$$

Compute the square:

$$
(0.05)^2=0.0025.
$$

Compute the coefficient in the exponent:

$$
2(0.0025)=0.005.
$$

So the inequality is

$$
2\exp(-0.005m)\leq 0.05.
$$

Divide both sides by $2$:

$$
\exp(-0.005m)\leq \frac{0.05}{2}=0.025.
$$

Take natural logarithms. Since $\log$ is increasing,

$$
-0.005m\leq \log(0.025).
$$

Compute

$$
\log(0.025)=\log\left(\frac{1}{40}\right)=-\log(40).
$$

Thus

$$
-0.005m\leq -\log(40).
$$

Multiply by $-1$, reversing the inequality:

$$
0.005m\geq \log(40).
$$

Divide by $0.005$:

$$
m\geq \frac{\log(40)}{0.005}.
$$

Since

$$
\log(40)\approx 3.688879,
$$

we get

$$
m\geq \frac{3.688879}{0.005}=737.7758.
$$

The sample size must be an integer, so round up:

$$
m\geq 738.
$$

Check the rounded value:

$$
2\exp(-0.005\cdot 738)=2\exp(-3.69)\approx 2(0.02497)=0.04994\leq 0.05.
$$

Therefore,

$$
\boxed{m=738\text{ iid examples are sufficient.}}
$$

#### E3. Compute empirical training error

**Problem.** A classifier makes predictions on $10$ training examples. The predictions and true labels are

| Example $i$ | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ | $7$ | $8$ | $9$ | $10$ |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| True label $y^{(i)}$ | $1$ | $0$ | $1$ | $1$ | $0$ | $0$ | $1$ | $0$ | $1$ | $0$ |
| Prediction $h(x^{(i)})$ | $1$ | $0$ | $0$ | $1$ | $0$ | $1$ | $1$ | $0$ | $1$ | $0$ |

Compute the empirical error $\widehat{\epsilon}(h)$.

**Solution.**

The empirical error formula is

$$
\widehat{\epsilon}(h)=\frac{1}{m}\sum_{i=1}^{m}\mathbf{1}_{\{h(x^{(i)})\neq y^{(i)}\}}.
$$

Here there are

$$
m=10
$$

training examples. We evaluate the mistake indicator for each example.

| Example $i$ | True label | Prediction | Mistake indicator $\mathbf{1}_{\{h(x^{(i)})\neq y^{(i)}\}}$ |
|---:|---:|---:|---:|
| $1$ | $1$ | $1$ | $0$ |
| $2$ | $0$ | $0$ | $0$ |
| $3$ | $1$ | $0$ | $1$ |
| $4$ | $1$ | $1$ | $0$ |
| $5$ | $0$ | $0$ | $0$ |
| $6$ | $0$ | $1$ | $1$ |
| $7$ | $1$ | $1$ | $0$ |
| $8$ | $0$ | $0$ | $0$ |
| $9$ | $1$ | $1$ | $0$ |
| $10$ | $0$ | $0$ | $0$ |

Add the indicators:

$$
\sum_{i=1}^{10}\mathbf{1}_{\{h(x^{(i)})\neq y^{(i)}\}}
=0+0+1+0+0+1+0+0+0+0.
$$

The sum is

$$
0+0+1+0+0+1+0+0+0+0=2.
$$

Therefore

$$
\widehat{\epsilon}(h)=\frac{2}{10}=0.2.
$$

As a percentage,

$$
0.2=20\%.
$$

Thus the classifier made $2$ mistakes out of $10$ examples.

$$
\boxed{\widehat{\epsilon}(h)=0.2=20\%.}
$$

#### E4. Finite hypothesis class penalty

**Problem.** Suppose a finite hypothesis class has size $k=100$. A training set has $m=1000$ examples, the desired failure probability is $\delta=0.05$, and the best observed training error is $0.08$. Use the finite-class penalty

$$
\sqrt{\frac{1}{2m}\log\left(\frac{2k}{\delta}\right)}
$$

and the finite-class ERM bound

$$
\epsilon(\widehat{h})\leq\left(\min_{h\in\mathcal{H}}\epsilon(h)\right)+2\sqrt{\frac{1}{2m}\log\left(\frac{2k}{\delta}\right)}
$$

to compute the additive term $2\gamma$. If we use the training error $0.08$ as the empirical benchmark, compute the resulting numerical upper estimate $0.08+2\gamma$.

**Solution.**

First identify the uniform-convergence radius

$$
\gamma=\sqrt{\frac{1}{2m}\log\left(\frac{2k}{\delta}\right)}.
$$

Substitute $k=100$, $m=1000$, and $\delta=0.05$:

$$
\gamma=\sqrt{\frac{1}{2(1000)}\log\left(\frac{2(100)}{0.05}\right)}.
$$

Compute the denominator outside the logarithm:

$$
2(1000)=2000.
$$

Compute the logarithm argument:

$$
\frac{2(100)}{0.05}=\frac{200}{0.05}=4000.
$$

Thus

$$
\gamma=\sqrt{\frac{1}{2000}\log(4000)}.
$$

Approximate the natural logarithm:

$$
\log(4000)\approx 8.29405.
$$

Divide by $2000$:

$$
\frac{8.29405}{2000}=0.004147025.
$$

Take the square root:

$$
\gamma=\sqrt{0.004147025}\approx 0.064397.
$$

The ERM excess-error additive term is $2\gamma$:

$$
2\gamma\approx 2(0.064397)=0.128794.
$$

Using $0.08$ as the empirical benchmark gives

$$
0.08+2\gamma\approx 0.08+0.128794=0.208794.
$$

As a percentage,

$$
0.208794\approx 20.88\%.
$$

Therefore, the penalty is large compared with the observed training error:

$$
\frac{0.128794}{0.08}\approx 1.6099.
$$

So the complexity/confidence penalty is about $1.61$ times the training error itself.

$$
\boxed{\gamma\approx0.0644,\quad 2\gamma\approx0.1288,\quad 0.08+2\gamma\approx0.2088.}
$$

#### E5. Check PAC assumptions

**Problem.** A fraud detector is trained on last year's transactions from Country A. It is deployed on this year's transactions from Country B after a major payment-platform redesign. The examples in the training set were collected by including every transaction that triggered a legacy rule and only $1\%$ of transactions that did not trigger the rule. Explain which PAC assumptions are violated and why the usual generalization bound no longer directly applies.

**Solution.**

The PAC assumptions listed in the lesson are:

1. the training and testing sets follow the same distribution;
2. the training examples are drawn independently.

Check the same-distribution assumption first. The training data come from

$$
\text{last year's transactions from Country A},
$$

while deployment examples come from

$$
\text{this year's transactions from Country B after a redesign}.
$$

These differ in at least three ways:

$$
\text{time period},\qquad \text{country},\qquad \text{platform behavior}.
$$

Therefore, the training distribution and test distribution need not be equal. Symbolically, if $D_{\mathrm{train}}$ is the training distribution and $D_{\mathrm{test}}$ is the deployment distribution, the story suggests

$$
D_{\mathrm{train}}\neq D_{\mathrm{test}}.
$$

That violates the same-distribution assumption.

Now check independence. The data were sampled by including every transaction that triggered a legacy rule and only $1\%$ of other transactions. This means inclusion depends on a transaction property. The resulting sample is not a simple iid sample from the natural transaction stream; it is a biased sample from a rule-conditioned process.

Let $S=1$ denote inclusion in the training data and $R=1$ denote triggering the legacy rule. The story says approximately

$$
P(S=1\mid R=1)=1,
\qquad
P(S=1\mid R=0)=0.01.
$$

Since these probabilities are not equal,

$$
P(S=1\mid R=1)\neq P(S=1\mid R=0),
$$

selection depends on $R$. Thus the training sample over-represents rule-triggering transactions.

The usual Hoeffding and PAC calculations assume the empirical average

$$
\widehat{\epsilon}(h)=\frac{1}{m}\sum_{i=1}^{m}\mathbf{1}_{\{h(x^{(i)})\neq y^{(i)}\}}
$$

is an average of iid draws from the same distribution used to define

$$
\epsilon(h)=P(h(x)\neq y).
$$

Here, the empirical error estimates performance on the sampled training process, not necessarily on the Country B post-redesign deployment process. Therefore a small $\widehat{\epsilon}(h)$ may not estimate the desired $\epsilon(h)$.

$$
\boxed{\text{The same-distribution assumption is violated, and the iid sampling assumption is doubtful because selection depends on the legacy rule.}}
$$

### 🔴 Advanced

#### A1. Derive the finite-class uniform convergence bound

**Problem.** Let $\mathcal{H}$ be a finite hypothesis class with $|\mathcal{H}|=k$. For a fixed $h\in\mathcal{H}$, assume Hoeffding gives

$$
P\left(|\epsilon(h)-\widehat{\epsilon}(h)|>\gamma\right)\leq 2\exp(-2\gamma^2m).
$$

Use the union bound to derive a value of $\gamma$ such that, with probability at least $1-\delta$,

$$
\forall h\in\mathcal{H},\qquad |\epsilon(h)-\widehat{\epsilon}(h)|\leq \gamma.
$$

**Solution.**

For each hypothesis $h\in\mathcal{H}$, define the bad event

$$
A_h=\{|\epsilon(h)-\widehat{\epsilon}(h)|>\gamma\}.
$$

Hoeffding controls each individual bad event:

$$
P(A_h)\leq 2\exp(-2\gamma^2m).
$$

The event that uniform convergence fails is the event that at least one hypothesis has a large error-estimation gap:

$$
\bigcup_{h\in\mathcal{H}} A_h.
$$

Apply the union bound:

$$
P\left(\bigcup_{h\in\mathcal{H}}A_h\right)
\leq \sum_{h\in\mathcal{H}}P(A_h).
$$

Since there are $k$ hypotheses and each has the same upper bound,

$$
\sum_{h\in\mathcal{H}}P(A_h)
\leq \sum_{h\in\mathcal{H}}2\exp(-2\gamma^2m)
=2k\exp(-2\gamma^2m).
$$

Therefore

$$
P\left(\exists h\in\mathcal{H}: |\epsilon(h)-\widehat{\epsilon}(h)|>\gamma\right)
\leq 2k\exp(-2\gamma^2m).
$$

We want this failure probability to be at most $\delta$:

$$
2k\exp(-2\gamma^2m)\leq \delta.
$$

Divide by $2k$:

$$
\exp(-2\gamma^2m)\leq \frac{\delta}{2k}.
$$

Take natural logarithms:

$$
-2\gamma^2m\leq \log\left(\frac{\delta}{2k}\right).
$$

Use

$$
\log\left(\frac{\delta}{2k}\right)=-\log\left(\frac{2k}{\delta}\right).
$$

Then

$$
-2\gamma^2m\leq -\log\left(\frac{2k}{\delta}\right).
$$

Multiply by $-1$, reversing the inequality:

$$
2\gamma^2m\geq \log\left(\frac{2k}{\delta}\right).
$$

Divide by $2m$:

$$
\gamma^2\geq \frac{1}{2m}\log\left(\frac{2k}{\delta}\right).
$$

Taking the nonnegative square root gives the sufficient choice

$$
\gamma=\sqrt{\frac{1}{2m}\log\left(\frac{2k}{\delta}\right)}.
$$

With this choice,

$$
P\left(\exists h\in\mathcal{H}: |\epsilon(h)-\widehat{\epsilon}(h)|>\gamma\right)\leq \delta.
$$

Taking complements,

$$
P\left(\forall h\in\mathcal{H}: |\epsilon(h)-\widehat{\epsilon}(h)|\leq \gamma\right)\geq 1-\delta.
$$

Thus,

$$
\boxed{\gamma=\sqrt{\frac{1}{2m}\log\left(\frac{2k}{\delta}\right)}.}
$$

#### A2. From uniform convergence to ERM excess error

**Problem.** Suppose that, simultaneously for all $h\in\mathcal{H}$,

$$
|\epsilon(h)-\widehat{\epsilon}(h)|\leq \gamma.
$$

Let

$$
\widehat{h}=\arg\min_{h\in\mathcal{H}}\widehat{\epsilon}(h)
$$

be an empirical risk minimizer, and let

$$
h^*=\arg\min_{h\in\mathcal{H}}\epsilon(h)
$$

be a true-risk minimizer in the class. Prove

$$
\epsilon(\widehat{h})\leq \min_{h\in\mathcal{H}}\epsilon(h)+2\gamma.
$$

**Solution.**

Uniform convergence means every true error is within $\gamma$ of its empirical error. In particular, for $\widehat{h}$,

$$
|\epsilon(\widehat{h})-\widehat{\epsilon}(\widehat{h})|\leq \gamma.
$$

This implies

$$
\epsilon(\widehat{h})\leq \widehat{\epsilon}(\widehat{h})+\gamma.
$$

Because $\widehat{h}$ minimizes empirical error,

$$
\widehat{\epsilon}(\widehat{h})\leq \widehat{\epsilon}(h)
\quad\text{for every }h\in\mathcal{H}.
$$

In particular, this holds for $h^*$:

$$
\widehat{\epsilon}(\widehat{h})\leq \widehat{\epsilon}(h^*).
$$

Substitute this into the previous inequality:

$$
\epsilon(\widehat{h})\leq \widehat{\epsilon}(h^*)+\gamma.
$$

Now apply uniform convergence to $h^*$:

$$
|\epsilon(h^*)-\widehat{\epsilon}(h^*)|\leq \gamma.
$$

This implies

$$
\widehat{\epsilon}(h^*)\leq \epsilon(h^*)+\gamma.
$$

Therefore,

$$
\epsilon(\widehat{h})\leq \epsilon(h^*)+\gamma+\gamma.
$$

Combine the two $\gamma$ terms:

$$
\epsilon(\widehat{h})\leq \epsilon(h^*)+2\gamma.
$$

Since $h^*$ is the true-risk minimizer in $\mathcal{H}$,

$$
\epsilon(h^*)=\min_{h\in\mathcal{H}}\epsilon(h).
$$

Thus

$$
\epsilon(\widehat{h})\leq \min_{h\in\mathcal{H}}\epsilon(h)+2\gamma.
$$

Combining this result with A1's value

$$
\gamma=\sqrt{\frac{1}{2m}\log\left(\frac{2k}{\delta}\right)}
$$

gives the finite-class upper bound

$$
\epsilon(\widehat{h})\leq\left(\min_{h\in\mathcal{H}}\epsilon(h)\right)+2\sqrt{\frac{1}{2m}\log\left(\frac{2k}{\delta}\right)}.
$$

$$
\boxed{\epsilon(\widehat{h})\leq \min_{h\in\mathcal{H}}\epsilon(h)+2\gamma.}
$$

#### A3. Shattering three points with 2-D linear classifiers

**Problem.** Consider three non-collinear points in the plane:

$$
x^{(1)}=(0,0),\qquad x^{(2)}=(2,0),\qquad x^{(3)}=(0,2).
$$

Show that linear classifiers in two dimensions can shatter these three points by constructing a separating line for every possible binary labeling. Use labels $+$ and $-$.

**Solution.**

A linear classifier in two dimensions classifies points according to the sign of

$$
w_1x_1+w_2x_2+b.
$$

There are

$$
2^3=8
$$

possible labelings of three points. To show shattering, we must realize all $8$ labelings.

We can list one valid separating rule for each labeling. The convention is: classify as $+$ when the displayed expression is positive, and classify as $-$ when it is negative.

| Case | Desired labels $(x^{(1)},x^{(2)},x^{(3)})$ | Separating rule | Check |
|---:|---:|---|---|
| $1$ | $(+,+,+)$ | $1>0$ | all points are positive |
| $2$ | $(-,-,-)$ | $-1>0$ | all points are negative |
| $3$ | $(+,-,-)$ | $-x_1-x_2+1>0$ | $(0,0):1>0$, $(2,0):-1<0$, $(0,2):-1<0$ |
| $4$ | $(-,+,+)$ | $x_1+x_2-1>0$ | $(0,0):-1<0$, $(2,0):1>0$, $(0,2):1>0$ |
| $5$ | $(-,+,-)$ | $x_1-x_2-1>0$ | $(0,0):-1<0$, $(2,0):1>0$, $(0,2):-3<0$ |
| $6$ | $(+,-,+)$ | $-x_1+x_2+1>0$ | $(0,0):1>0$, $(2,0):-1<0$, $(0,2):3>0$ |
| $7$ | $(-,-,+)$ | $-x_1+x_2-1>0$ | $(0,0):-1<0$, $(2,0):-3<0$, $(0,2):1>0$ |
| $8$ | $(+,+,-)$ | $x_1-x_2+1>0$ | $(0,0):1>0$, $(2,0):3>0$, $(0,2):-1<0$ |

For example, in case $3$, the separating boundary is

$$
-x_1-x_2+1=0,
$$

or equivalently

$$
x_1+x_2=1.
$$

The point $(0,0)$ is on the positive side because

$$
-0-0+1=1>0,
$$

while $(2,0)$ and $(0,2)$ are on the negative side because

$$
-2-0+1=-1<0,
\qquad
-0-2+1=-1<0.
$$

The table verifies all $8$ labelings. Therefore the set

$$
S=\{(0,0),(2,0),(0,2)\}
$$

is shattered by 2-D linear classifiers.

By the definition of shattering,

$$
\forall \{y^{(1)},y^{(2)},y^{(3)}\},\quad
\exists h\in\mathcal{H},\quad
\forall i\in[\![1,3]\!],\quad h(x^{(i)})=y^{(i)}.
$$

Therefore the VC dimension is at least $3$:

$$
\boxed{\mathrm{VC}(\mathcal{H}_{\text{2-D lines}})\geq 3.}
$$

#### A4. Why four planar points are not always shattered by lines

**Problem.** Consider four points in convex position forming a square:

$$
x^{(1)}=(0,0),\qquad x^{(2)}=(1,0),\qquad x^{(3)}=(1,1),\qquad x^{(4)}=(0,1).
$$

Give them alternating XOR labels around the square:

$$
y^{(1)}=+,
\qquad
 y^{(2)}=-,
\qquad
 y^{(3)}=+,
\qquad
 y^{(4)}=-.
$$

Show that no line can separate the positive points from the negative points. Conclude that linear classifiers in two dimensions do not shatter every set of four points in convex position.

**Solution.**

The positive points are opposite corners of the square:

$$
P_+=\{(0,0),(1,1)\}.
$$

The negative points are the other opposite corners:

$$
P_-=\{(1,0),(0,1)\}.
$$

Suppose, for contradiction, that a linearly separable classifier exists. Then there are $w=(w_1,w_2)$ and $b$ such that positive points satisfy

$$
w^Tx+b>0
$$

and negative points satisfy

$$
w^Tx+b<0.
$$

Apply this to the two positive points. For $(0,0)$,

$$
w^T(0,0)+b=b>0.
$$

For $(1,1)$,

$$
w^T(1,1)+b=w_1+w_2+b>0.
$$

Add these two positive inequalities:

$$
b+(w_1+w_2+b)>0+0.
$$

So

$$
w_1+w_2+2b>0.
$$

Now apply the negative inequalities. For $(1,0)$,

$$
w^T(1,0)+b=w_1+b<0.
$$

For $(0,1)$,

$$
w^T(0,1)+b=w_2+b<0.
$$

Add these two negative inequalities:

$$
(w_1+b)+(w_2+b)<0+0.
$$

Thus

$$
w_1+w_2+2b<0.
$$

We have derived both

$$
w_1+w_2+2b>0
$$

and

$$
w_1+w_2+2b<0,
$$

which is impossible. Therefore no linear classifier can realize the alternating XOR labeling.

This proves that these four points are not shattered by lines. Since shattering a set requires realizing every labeling, one impossible labeling is enough to fail.

A3 showed that some set of three non-collinear points can be shattered, so

$$
\mathrm{VC}(\mathcal{H}_{\text{2-D lines}})\geq 3.
$$

This example shows that four points in convex position are not shattered. The standard result is

$$
\boxed{\mathrm{VC}(\mathcal{H}_{\text{2-D lines}})=3.}
$$

#### A5. Compare finite-class and VC-style bounds numerically

**Problem.** Compare the size of the finite-class complexity term and the VC-style complexity term when

$$
k=10^6,
\qquad
 d=10,
\qquad
 m=5000,
\qquad
 \delta=0.01.
$$

For the finite-class calculation, compute

$$
2\sqrt{\frac{1}{2m}\log\left(\frac{2k}{\delta}\right)}.
$$

For the VC-style calculation, ignore the unspecified constant hidden in $O(\cdot)$ and compute the inside square-root expression

$$
\sqrt{\frac{d}{m}\log\left(\frac{m}{d}\right)+\frac{1}{m}\log\left(\frac{1}{\delta}\right)}.
$$

Explain when the VC-style bound is preferable.

**Solution.**

Start with the finite-class term:

$$
B_{\mathrm{finite}}=2\sqrt{\frac{1}{2m}\log\left(\frac{2k}{\delta}\right)}.
$$

Substitute $k=10^6$, $m=5000$, and $\delta=0.01$:

$$
B_{\mathrm{finite}}
=2\sqrt{\frac{1}{2(5000)}\log\left(\frac{2(10^6)}{0.01}\right)}.
$$

Compute the outer denominator:

$$
2(5000)=10000.
$$

Compute the logarithm argument:

$$
\frac{2(10^6)}{0.01}=\frac{2,000,000}{0.01}=200,000,000=2\times10^8.
$$

Thus

$$
B_{\mathrm{finite}}
=2\sqrt{\frac{1}{10000}\log(2\times10^8)}.
$$

Compute the logarithm:

$$
\log(2\times10^8)=\log 2+\log(10^8).
$$

Since

$$
\log 2\approx0.693147,
\qquad
\log(10^8)=8\log 10\approx8(2.302585)=18.420680,
$$

we get

$$
\log(2\times10^8)\approx0.693147+18.420680=19.113827.
$$

Divide by $10000$:

$$
\frac{19.113827}{10000}=0.0019113827.
$$

Take the square root:

$$
\sqrt{0.0019113827}\approx0.043718.
$$

Multiply by $2$:

$$
B_{\mathrm{finite}}\approx2(0.043718)=0.087436.
$$

So the finite-class additive term is about

$$
8.74\%.
$$

Now compute the VC-style term without the hidden constant:

$$
B_{\mathrm{VC}}=\sqrt{\frac{d}{m}\log\left(\frac{m}{d}\right)+\frac{1}{m}\log\left(\frac{1}{\delta}\right)}.
$$

Substitute $d=10$, $m=5000$, and $\delta=0.01$:

$$
B_{\mathrm{VC}}
=\sqrt{\frac{10}{5000}\log\left(\frac{5000}{10}\right)+\frac{1}{5000}\log\left(\frac{1}{0.01}\right)}.
$$

Compute the ratio in the first logarithm:

$$
\frac{5000}{10}=500.
$$

Compute the first coefficient:

$$
\frac{10}{5000}=0.002.
$$

Therefore the first term is

$$
0.002\log(500).
$$

Approximate

$$
\log(500)=\log(5\times100)=\log 5+\log 100\approx1.609438+4.605170=6.214608.
$$

So

$$
0.002\log(500)\approx0.002(6.214608)=0.012429216.
$$

For the confidence term,

$$
\frac{1}{0.01}=100,
$$

so

$$
\frac{1}{5000}\log(100)=0.0002(4.605170)=0.000921034.
$$

Add the two terms inside the square root:

$$
0.012429216+0.000921034=0.013350250.
$$

Take the square root:

$$
B_{\mathrm{VC}}=\sqrt{0.013350250}\approx0.115543.
$$

So, ignoring the hidden constant, the VC-style scale is about

$$
11.55\%.
$$

For these specific numbers and with hidden constants ignored,

$$
B_{\mathrm{finite}}\approx0.0874
\qquad\text{and}\qquad
B_{\mathrm{VC}}\approx0.1155.
$$

The finite-class term is numerically smaller here because $k=10^6$ is large but still finite and only enters through $\log k$. However, the finite-class bound cannot be applied directly to truly infinite classes because $k=|\mathcal{H}|$ would be infinite and

$$
\log\left(\frac{2k}{\delta}\right)
$$

would not be finite.

The VC-style theorem replaces raw hypothesis count by VC dimension:

$$
\epsilon(\widehat{h})\leq\left(\min_{h\in\mathcal{H}}\epsilon(h)\right)+O\left(\sqrt{\frac{d}{m}\log\left(\frac{m}{d}\right)+\frac{1}{m}\log\left(\frac{1}{\delta}\right)}\right).
$$

This is preferable when $\mathcal{H}$ is infinite but has finite capacity $d$. For example, the set of all 2-D linear classifiers has infinitely many possible real-valued parameters, but its VC dimension is only $3$.

$$
\boxed{B_{\mathrm{finite}}\approx0.0874,
\qquad
B_{\mathrm{VC}}\approx0.1155\text{ before hidden constants};\text{ VC bounds are essential for infinite classes with finite VC dimension.}}
$$
