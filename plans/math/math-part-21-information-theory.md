# Math · Part 21 — Information theory  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four
> exposition principles: plain warm textbook voice, complete step-by-step derivations, case-by-case judgment,
> and every important symbol named in plain English. Every numeric value below was verified with `python3`
> using `math.log`, base-2 logs for bits, and natural logs for nats.

**Section:** Information theory · **Lessons:** 20 · **Breadcrumb:** `Mathematics · Probability & Statistics` · **Priority:** HIGH

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate — lessons `math-21-11`…`math-21-20` ship the same app block (_Compression budgets · Classifier losses · Latent-variable models · Reinforcement learning policies · Communication systems · Representation learning_) | 10 / 20 |
| Templated / thin motivation or banned voice artifacts | 9 / 20 |
| Key formula not in display form | 17 / 20 |
| LaTeX / source-text bugs found in this pass | 3 |
| Derivation action in this authored plan | 19 derivations / 1 explain-only |

**The core change:** every lesson below gets its own six applications with numbers that are computed by that lesson's concept, not by the shared §5 block. Formulas move to display form, derivations show one operation per step with a reason, and symbol glosses state log base and units.

---

## Priority & systemic issues

- **Shared §5 block to delete:** `math-21-11` through `math-21-20` all reuse _Compression budgets · Classifier losses · Latent-variable models · Reinforcement learning policies · Communication systems · Representation learning_. Replace all ten blocks.
- **Unit discipline:** information lessons must state whether logs are base 2 (bits) or natural logs (nats). ML losses usually use nats; source coding examples usually use bits.
- **Formula discipline:** use display forms for $I(A)$, $H(X)$, $H(X,Y)$, $H(Y\mid X)$, $I(X;Y)$, $D_{KL}(P\|Q)$, cross-entropy, Jensen, coding bounds, capacity, rate-distortion, maximum entropy, $f$-divergence, and ELBO.
- **LaTeX / text bugs found:** `math-21-01` application text has `whi\le` and should be `while`; `math-21-09` practice has `possib\le` and `whi\le`; `math-21-10` practice uses plain `D_KL(P||Q)` and should use `$D_{KL}(P\|Q)$`. Also remove the repeated closing sentence in `math-21-11`…`21-20` that uses a banned clever tagline.

---

## Model entry (full prose)

The model entry is `math-21-06` because KL divergence is the central bridge between probability models, coding, variational inference, and ML losses. Its §1 Connections and §2 Motivation are written below at the prose depth expected for the section.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted content for the lesson. The labels are plan shorthand; in the app they become flowing prose in the same plain textbook voice as Part 02. Each application list contains exactly six concept-specific numeric uses.

### `math-21-01` — Information and surprise  · deepen derivation

**Connections (§1).**
> Information and surprise starts from the probability ideas used throughout probability and statistics. If a reader already understands that rare events have smaller probabilities than common events, the new step is to put that rarity on a scale that can be added and compared. This lesson leads into entropy, because entropy is just the average of this one-outcome surprise. It also explains why negative log probability appears as a loss in classifiers and language models.

**Motivation & Intuition (§2).**
> A single outcome can feel more or less informative depending on how likely it was before it happened. Seeing the expected outcome usually changes little, while seeing a rare outcome narrows the possibilities much more. Information theory turns that informal sense of surprise into a number by using the event probability as the input.
>
> The logarithm is the important modeling choice. Independent events have probabilities that multiply, but the amount of information from observing both should add. Taking a negative logarithm turns a small probability into a positive surprise score and turns products into sums, so the scale matches the way independent evidence accumulates.

**Definition & Assumptions (§3).**

- **Derive (complete).**
  1. Start with an event $A$ of probability $p(A)$, where $0<p(A)\le1$ — probability is the only input to one-outcome surprise.
  2. Use the reciprocal $1/p(A)$ — rarer events should receive larger numbers.
  3. Take a logarithm: $\log_b(1/p(A))$ — logarithms make multiplicative counts additive.
  4. Rewrite it as $-\log_b p(A)$ — this is the same expression and stays nonnegative for $p\le1$.
  5. For independent $A,B$, $p(A\cap B)=p(A)p(B)$ — independence is exactly the condition that probabilities multiply.
  6. Then $I(A\cap B)=-\log_b[p(A)p(B)]=-\log_b p(A)-\log_b p(B)=I(A)+I(B)$ — the definition makes independent information add.
- **Symbols.** $A$ is the event; $p(A)$ is its probability; $b$ is the log base; base $2$ gives bits; base $e$ gives nats; $I(A)$ is self-information.

**Real-World Applications (§5).**

- **Apps.** (1) **Binary branch**: $p=0.5\Rightarrow I=1$ bit. (2) **Classifier miss**: true-class $p=0.1\Rightarrow I=3.322$ bits. (3) **Confident correct prediction**: $p=0.9\Rightarrow I=0.152$ bits. (4) **Eight-way code**: $p=1/8\Rightarrow I=3$ bits. (5) **Anomaly score**: $p=0.005=1/200\Rightarrow I=7.644$ bits. (6) **Natural-log loss**: $p=0.8\Rightarrow -\ln p=0.223$ nats.

### `math-21-02` — Entropy  · deepen derivation

**Connections (§1).**
> Entropy builds directly on self-information. Instead of measuring the surprise of one observed outcome, it asks for the average surprise before the draw is made. That makes it a natural summary of uncertainty in a whole distribution rather than a single event. The same quantity later becomes the lower bound for lossless compression and a reference point for cross-entropy and KL divergence.

**Motivation & Intuition (§2).**
> When the outcome is not known yet, each possible value has its own surprise and its own chance of occurring. Entropy combines those two facts by weighting every self-information value by the probability of seeing it. Common outcomes matter more in the average, while rare outcomes can still contribute because their surprise is larger.
>
> This average has a direct coding interpretation. If logs are base 2, entropy is measured in bits and describes the best long-run number of binary decisions needed to identify outcomes from the source. A fair coin has one full bit of uncertainty, while a heavily biased coin has less because many draws are easy to predict.

**Definition & Assumptions (§3).**

- **Derive (complete).**
  1. For each outcome $x$, self-information is $I(x)=-\log_2 p(x)$ — this measures the surprise after seeing $x$.
  2. Average over possible outcomes: $E[I(X)]=\sum_x p(x)I(x)$ — entropy is expected surprise.
  3. Substitute $I(x)$ into the expectation: $H(X)=\sum_x p(x)(-\log_2 p(x))$ — replace the surprise with its formula.
  4. Pull out the minus sign: $H(X)=-\sum_x p(x)\log_2 p(x)$ — this is the standard entropy formula.
  5. A zero-probability outcome contributes $0$ by the limit $p\log p\to0$ as $p\to0^+$ — impossible outcomes are not observed.
- **Symbols.** $X$ is a discrete random variable; $x$ is one outcome; $p(x)$ is its probability; $H(X)$ is entropy; $\log_2$ means bits.

**Real-World Applications (§5).**

- **Apps.** (1) **Fair coin**: $H(0.5,0.5)=1$ bit. (2) **Biased coin**: $H(0.75,0.25)=0.811$ bits. (3) **Class imbalance**: $H(0.9,0.1)=0.469$ bits. (4) **Three labels**: $H(0.7,0.2,0.1)=1.157$ bits. (5) **Four-symbol uniform source**: $H=\log_2 4=2$ bits. (6) **Language-model perplexity**: entropy $4$ bits means $2^4=16$ effective choices.

### `math-21-03` — Joint entropy  · AUTHOR derivation

**Connections (§1).**
> Joint entropy extends entropy from one variable to a pair of variables. The reader already knows how a probability table assigns mass to each cell, and this lesson treats each cell as one combined outcome. That viewpoint keeps the formula familiar while making room for dependence between variables. It prepares the chain rules, conditional entropy, and mutual information that follow.

**Motivation & Intuition (§2).**
> Learning two variables together means learning which ordered pair occurred. If the joint table has four possible cells, then the uncertainty is distributed across those cells, not across each variable separately. Joint entropy applies the ordinary entropy formula to the combined outcome $(X,Y)$.
>
> Dependence matters because the pair may contain less uncertainty than two separate variables would suggest. If the variables are independent, their probabilities multiply and joint entropy splits into a sum. If they are correlated or one partly determines the other, some pairs become more predictable, and the joint entropy reflects that shared structure.

**Definition & Assumptions (§3).**

- **Derive (complete).**
  1. Define a combined variable $Z=(X,Y)$ — learning the pair is learning one larger outcome.
  2. Its probability is $p_Z(x,y)=p(x,y)$ — each cell has its own probability.
  3. Apply ordinary entropy to $Z$: $H(Z)=-\sum_{(x,y)}p_Z(x,y)\log_2 p_Z(x,y)$ — joint entropy is not a new rule.
  4. Replace $p_Z$ with $p(x,y)$ and write the double sum: $H(X,Y)=-\sum_x\sum_y p(x,y)\log_2 p(x,y)$ — this is the table form.
  5. If $X,Y$ are independent, substitute $p(x,y)=p(x)p(y)$ and split the log — this gives $H(X,Y)=H(X)+H(Y)$.
- **Symbols.** $X,Y$ are discrete variables; $(x,y)$ is one joint outcome; $p(x,y)$ is a cell probability; $H(X,Y)$ is joint entropy in bits.

**Real-World Applications (§5).**

- **Apps.** (1) **Four uniform cells**: $H=2$ bits. (2) **Two possible pairs**: $(0.5,0.5)$ gives $1$ bit. (3) **Table $(0.5,0.25,0.25,0)$**: $H=1.5$ bits. (4) **Correlated binary table** $(0.4,0.1;0.1,0.4)$: $H=1.722$ bits. (5) **Independent coin and four-way tag**: $1+2=3$ bits. (6) **Counts $40,10,10,40$ out of $100$**: joint entropy $1.722$ bits.

### `math-21-04` — Conditional entropy  · AUTHOR derivation

**Connections (§1).**
> Conditional entropy builds on entropy inside branches of a probability model. Once one variable is known, the distribution of another variable may become sharper, flatter, or unchanged. This lesson measures the uncertainty that remains after that first piece of information is available. It is the main ingredient in chain rules and in the reduction-of-uncertainty view of mutual information.

**Motivation & Intuition (§2).**
> The key distinction is between uncertainty before and uncertainty after conditioning. For each value $X=x$, there is a conditional distribution over $Y$, and that distribution has its own entropy. Some branches may leave almost no ambiguity, while others may still leave many possible outcomes.
>
> Conditional entropy averages those branch uncertainties using how often the branches occur. It therefore measures the expected remaining uncertainty in $Y$ once $X$ has been observed. A deterministic label has zero conditional entropy, while an independent label keeps the same entropy it had before conditioning.

**Definition & Assumptions (§3).**

- **Derive (complete).**
  1. Once $X=x$ is known, the uncertainty in $Y$ is $H(Y\mid X=x)=-\sum_y p(y\mid x)\log_2 p(y\mid x)$ — this is ordinary entropy inside one branch.
  2. Branch $x$ occurs with probability $p(x)$ — branches must be weighted by how often they happen.
  3. Average the branch entropies: $H(Y\mid X)=\sum_x p(x)H(Y\mid X=x)$ — this is expected remaining uncertainty.
  4. Substitute the branch formula: $H(Y\mid X)=-\sum_x p(x)\sum_y p(y\mid x)\log_2 p(y\mid x)$ — expand the expectation.
  5. Use $p(x)p(y\mid x)=p(x,y)$ — this rewrites the expression using the joint table.
  6. Therefore $H(Y\mid X)=-\sum_x\sum_y p(x,y)\log_2 p(y\mid x)$ — the final formula weights conditional surprise by joint probability.
- **Symbols.** $p(y\mid x)$ is the conditional probability of $Y=y$ after $X=x$; $p(x,y)$ is joint probability; $H(Y\mid X)$ is measured in bits.

**Real-World Applications (§5).**

- **Apps.** (1) **Deterministic label**: if $Y$ is fixed by $X$, $H(Y\mid X)=0$ bits. (2) **Independent fair bits**: $H(Y\mid X)=H(Y)=1$ bit. (3) **Correlated table $(0.4,0.1;0.1,0.4)$**: $H(Y\mid X)=0.722$ bits. (4) **Branch entropies $0.5$ and $1.0$ with branch weights $0.6,0.4$**: average $0.7$ bits. (5) **Noisy binary label with error $0.1$**: $H(Y\mid X)=H(0.9,0.1)=0.469$ bits. (6) **Table $(0.3,0.2;0.1,0.4)$**: $H(Y\mid X)=0.846$ bits.

### `math-21-05` — Mutual information  · AUTHOR derivation

**Connections (§1).**
> Mutual information combines entropy, conditional entropy, and joint entropy into one measure of dependence. The reader has already seen uncertainty before conditioning and uncertainty after conditioning. This lesson names the difference between those two quantities. It becomes the standard way to measure how much a feature, channel output, or representation tells us about another variable.

**Motivation & Intuition (§2).**
> Knowing one variable can reduce uncertainty about another. Mutual information measures that reduction in bits: start with what was unknown, then subtract what remains after the related variable is observed. If the observation changes nothing, the reduction is zero.
>
> The same idea can be written symmetrically with joint entropy or locally with a ratio of probabilities. The ratio form compares the actual joint probability with the probability the pair would have under independence. When those agree everywhere, there is no mutual information; when the joint table systematically differs from independence, the variables share information.

**Definition & Assumptions (§3).**

- **Derive (complete).**
  1. Start with the uncertainty in $X$: $H(X)$ — this is what is unknown before seeing $Y$.
  2. After seeing $Y$, the remaining uncertainty is $H(X\mid Y)$ — this is what is still unknown.
  3. Define the reduction as $I(X;Y)=H(X)-H(X\mid Y)$ — information gained is before minus after.
  4. Use the chain rule $H(X,Y)=H(Y)+H(X\mid Y)$ — joint uncertainty can be learned as $Y$ first, then $X$.
  5. Rearrange to $I(X;Y)=H(X)+H(Y)-H(X,Y)$ — this symmetric form shows $I(X;Y)=I(Y;X)$.
  6. Expanding the entropies gives $I(X;Y)=\sum_{x,y}p(x,y)\log_2\frac{p(x,y)}{p(x)p(y)}$ — dependence is measured by the ratio of joint probability to independence probability.
- **Symbols.** $I(X;Y)$ is mutual information in bits; $p(x)$ and $p(y)$ are marginals; $p(x,y)$ is joint probability; $p(x)p(y)$ is what the joint probability would be under independence.

**Real-World Applications (§5).**

- **Apps.** (1) **Independent variables**: $I=0$ bits. (2) **Duplicate fair bit**: $I=1$ bit. (3) **Correlated table $(0.4,0.1;0.1,0.4)$**: $I=0.278$ bits. (4) **Feature selection**: if $H(Y)=1$ and $H(Y\mid X)=0.722$, then $I=0.278$ bits. (5) **Noisy binary channel with error $0.1$ and uniform input**: $I=1-H(0.9,0.1)=0.531$ bits. (6) **Table $(0.3,0.2;0.1,0.4)$**: $I=0.125$ bits.

### `math-21-06` — KL divergence  — **full-depth model entry**

**Connections (§1).**
> KL divergence builds directly on entropy and cross-entropy. Entropy measures the average code length when the code matches the true distribution. Cross-entropy measures the average code length when data come from one distribution but the code is built from another. KL divergence is the extra length caused by that mismatch.
>
> This lesson is a central bridge in the section. It explains why maximum likelihood trains models by reducing wasted code length, why variational inference has a KL gap, and why policy optimization often limits how far a new policy can move from an old one. The same formula appears in many places, so the main job is to keep its direction, units, and support assumptions clear.

**Motivation & Intuition (§2).**
> Suppose data really come from a distribution $P$, but a model uses probabilities from a different distribution $Q$. Each time outcome $x$ occurs, the ideal code under $P$ would spend $-\log p(x)$ units, while the model code spends $-\log q(x)$ units. The difference is the cost of using the wrong probabilities on that outcome.
>
> KL divergence averages that extra cost over the true distribution $P$. It is not a distance in the geometric sense, because swapping $P$ and $Q$ usually changes the answer. That asymmetry is useful rather than accidental: using a model $Q$ to code data from $P$ is a different operation from using $P$ to code data from $Q$.
>
> The value is always nonnegative when the support is valid. Zero means the model assigns the same probabilities as the truth on the outcomes that can occur. A positive value measures the average penalty per draw: in bits with base-2 logs, or in nats with natural logs.

**Definition & Assumptions (§3).**

- **Derive (complete).**
  1. Let $P$ be the true distribution and $Q$ the model distribution — the expectation should be taken over data that actually occur.
  2. The code length under $Q$ for outcome $x$ is $-\log q(x)$, and the ideal code length under $P$ is $-\log p(x)$ — negative log probability is code length.
  3. The extra length for outcome $x$ is $[-\log q(x)]-[-\log p(x)]=\log\frac{p(x)}{q(x)}$ — subtract the two code lengths.
  4. Average the extra length under $P$: $D_{KL}(P\|Q)=\sum_x p(x)\log\frac{p(x)}{q(x)}$ — frequent true outcomes matter more.
  5. Relate it to cross-entropy: $H(P,Q)=-\sum_xp(x)\log q(x)$ and $H(P)=-\sum_xp(x)\log p(x)$, so $H(P,Q)-H(P)=D_{KL}(P\|Q)$ — KL is the excess cross-entropy.
  6. Nonnegativity follows from Jensen applied to the convex function $-\log t$: $D_{KL}(P\|Q)=E_P[-\log(Q/P)]\ge -\log E_P[Q/P]=-\log\sum_x q(x)=0$ — the support condition makes the ratio finite.
- **Symbols.** $P$ is the data or target distribution; $Q$ is the model or reference distribution; $p(x),q(x)$ are probabilities of outcome $x$; $D_{KL}(P\|Q)$ is the directed divergence; base $2$ logs give bits and natural logs give nats; require $q(x)>0$ whenever $p(x)>0$.

**Real-World Applications (§5).**

- **Apps.** (1) **Model mismatch in bits**: $P=(0.5,0.5)$, $Q=(0.25,0.75)$ gives $D_{KL}=0.2075$ bits. (2) **Small policy update**: $P=(0.6,0.4)$, $Q=(0.5,0.5)$ gives $0.0201$ nats. (3) **Larger drift**: $P=(0.9,0.1)$, $Q=(0.5,0.5)$ gives $0.3681$ nats. (4) **VAE posterior penalty**: $q=(0.8,0.2)$ versus $p=(0.6,0.4)$ gives $0.0915$ nats. (5) **Extra code length**: if $H(P,Q)=1.2075$ bits and $H(P)=1$ bit, the KL is $0.2075$ bits. (6) **Three-action policy**: $P=(0.2,0.5,0.3)$, $Q=(0.3,0.4,0.3)$ gives $0.0305$ nats.

### `math-21-07` — Cross-entropy  · deepen derivation

**Connections (§1).**
> Cross-entropy follows naturally after entropy and KL divergence. Entropy measures the code length when probabilities match the data source, while KL measures the extra cost from a mismatch. Cross-entropy includes both pieces in the single quantity optimized by many learning systems. It is the average negative log probability assigned by a model to data generated elsewhere.

**Motivation & Intuition (§2).**
> In supervised learning and probabilistic modeling, the model supplies probabilities, but the data are drawn from some target distribution. Each observed outcome is charged the code length or loss $-\log q(x)$ according to the model's probability. Averaging those losses under the true distribution gives cross-entropy.
>
> This value cannot be lower than the true entropy when the support is valid. The irreducible part is the uncertainty already present in the data source, and the extra part is the KL divergence from the true distribution to the model. This decomposition explains why improving a model means reducing the mismatch term while the data entropy itself remains fixed.

**Definition & Assumptions (§3).**

- **Derive (complete).**
  1. Outcome $x$ drawn from $P$ occurs with probability $p(x)$ — the true distribution decides the average.
  2. A model $Q$ assigns code length $-\log q(x)$ — negative log model probability is the loss for that outcome.
  3. Average the model code length: $H(P,Q)=-\sum_x p(x)\log q(x)$ — this defines cross-entropy.
  4. Add and subtract $\sum_xp(x)\log p(x)$ inside the expression — this separates true uncertainty from model mismatch.
  5. The result is $H(P,Q)=H(P)+D_{KL}(P\|Q)$ — cross-entropy equals irreducible entropy plus extra KL cost.
- **Symbols.** $P$ is the true distribution; $Q$ is the model distribution; $H(P,Q)$ is cross-entropy; $H(P)$ is entropy; $D_{KL}$ is mismatch; base $2$ gives bits, natural log gives nats.

**Real-World Applications (§5).**

- **Apps.** (1) **One-hot classifier**: true class probability $0.7$ gives $0.357$ nats. (2) **Binary soft label**: $P=(0.8,0.2)$, $Q=(0.6,0.4)$ gives $0.592$ nats. (3) **Bits decomposition**: $P=(0.5,0.5)$, $Q=(0.25,0.75)$ gives $H(P,Q)=1.2075=1+0.2075$ bits. (4) **Three-class labels**: $P=(0.7,0.2,0.1)$, $Q=(0.6,0.3,0.1)$ gives $0.829$ nats. (5) **Token NLL**: probabilities $0.9,0.5,0.25$ give total $3.152$ bits. (6) **Perplexity**: cross-entropy $1.5$ bits gives perplexity $2^{1.5}=2.828$.

### `math-21-08` — Chain rules for entropy  · deepen derivation

**Connections (§1).**
> The chain rules connect the separate entropy quantities introduced earlier. Joint entropy, marginal entropy, and conditional entropy are not unrelated formulas; they are different ways of accounting for the same uncertainty. This lesson shows how uncertainty can be counted in stages. It is used constantly in mutual information identities, graphical models, and coding arguments.

**Motivation & Intuition (§2).**
> Learning a pair can be organized as a two-step process. First learn $X$, then learn whatever uncertainty remains about $Y$ after $X$ is known. The total uncertainty in the pair should be the cost of the first stage plus the expected cost of the second stage.
>
> The algebra works because every joint probability factors into a marginal times a conditional probability. Taking a logarithm turns that product into a sum, and the double sum separates into the entropy of $X$ plus the conditional entropy of $Y$ given $X$. The result is a bookkeeping rule for information, not a new kind of randomness.

**Definition & Assumptions (§3).**

- **Derive (complete).**
  1. Start from joint entropy: $H(X,Y)=-\sum_{x,y}p(x,y)\log_2 p(x,y)$ — this counts uncertainty in the pair.
  2. Factor the joint probability: $p(x,y)=p(x)p(y\mid x)$ — every joint event is a marginal times a conditional.
  3. Substitute: $H(X,Y)=-\sum_{x,y}p(x,y)\log_2[p(x)p(y\mid x)]$ — use the factorization.
  4. Split the log into two terms — logarithms turn products into sums.
  5. The first term becomes $-\sum_x p(x)\log_2 p(x)=H(X)$ after summing over $y$ — marginalization removes $y$.
  6. The second term becomes $-\sum_{x,y}p(x,y)\log_2 p(y\mid x)=H(Y\mid X)$ — this is conditional entropy.
  7. Therefore $H(X,Y)=H(X)+H(Y\mid X)$ — joint uncertainty is first-stage plus remaining uncertainty.
- **Symbols.** $p(y\mid x)$ is a conditional probability; $H(Y\mid X)$ is expected remaining uncertainty; all quantities are in bits when logs are base 2.

**Real-World Applications (§5).**

- **Apps.** (1) **Correlated table**: $H(X)=1$, $H(Y\mid X)=0.722$, so $H(X,Y)=1.722$ bits. (2) **Deterministic label**: $H(Y\mid X)=0$, so $H(X,Y)=H(X)$. (3) **Independent fair bits**: $H(X,Y)=1+1=2$ bits. (4) **Table $(0.3,0.2;0.1,0.4)$**: $H(X)=1$, $H(Y\mid X)=0.846$, so $H(X,Y)=1.846$ bits. (5) **Three-stage source**: $1+0.5+0.25=1.75$ bits. (6) **Mutual information check**: $I(X;Y)=H(Y)-H(Y\mid X)=1-0.722=0.278$ bits.

### `math-21-09` — The data processing inequality  · AUTHOR derivation

**Connections (§1).**
> The data processing inequality builds on mutual information and Markov chains. Once information passes through an intermediate representation, later processing can keep relevant information or discard it, but it cannot create new access to the original source. This is a basic constraint behind compression, privacy filters, representation learning, and channel pipelines. The lesson states that constraint in the language of mutual information.

**Motivation & Intuition (§2).**
> A Markov chain $X\to Y\to Z$ means that $Z$ is produced from $Y$ without any additional direct view of $X$. The downstream variable may be a feature, a quantized code, a prediction, or a noisy measurement. Whatever it is, its knowledge about $X$ must come through $Y$.
>
> Mutual information makes this limitation precise. If $Z$ is a processed version of $Y$, then the information $Z$ has about $X$ is bounded by the information $Y$ had about $X$. Equality can occur for invertible processing, but ordinary compression, noise, and filtering usually reduce the amount.

**Definition & Assumptions (§3).**

- **Derive (complete).**
  1. Assume a Markov chain $X\to Y\to Z$ — once $Y$ is known, $Z$ has no extra direct access to $X$.
  2. Use the chain rule for mutual information: $I(X;Y,Z)=I(X;Z)+I(X;Y\mid Z)$ — learn $Z$ first, then the remaining information in $Y$.
  3. Use the other order: $I(X;Y,Z)=I(X;Y)+I(X;Z\mid Y)$ — learn $Y$ first, then any remaining information in $Z$.
  4. The Markov condition gives $I(X;Z\mid Y)=0$ — after $Y$ is known, $Z$ adds no information about $X$.
  5. Equate the two forms: $I(X;Y)=I(X;Z)+I(X;Y\mid Z)$ — both equal $I(X;Y,Z)$.
  6. Conditional mutual information is nonnegative, so $I(X;Y)\ge I(X;Z)$ — this is the data processing inequality.
- **Symbols.** $X$ is the source; $Y$ is the intermediate representation; $Z$ is the processed output; $I(\cdot;\cdot)$ is mutual information; $I(X;Y\mid Z)$ is information left after conditioning on $Z$.

**Real-World Applications (§5).**

- **Apps.** (1) **Compression bound**: if $I(X;Y)=1.5$ bits, any $Z=f(Y)$ has $I(X;Z)\le1.5$ bits. (2) **Loss through bottleneck**: $1.5$ to $1.0$ bits means $0.5$ bits lost. (3) **Impossible claim**: $I(X;Y)=0.8$ and $I(X;Z)=1.1$ violates the Markov assumption. (4) **Invertible transform**: if $Z$ is invertible from $Y$, then $I(X;Z)=I(X;Y)$, e.g. $0.8$ bits stays $0.8$. (5) **Noisy binary channel then quantizer**: input-output MI $0.531$ bits bounds every later feature by $0.531$. (6) **Privacy filter**: reducing $I(S;Z)$ from $0.4$ to $0.1$ bits removes $0.3$ bits about sensitive attribute $S$.

### `math-21-10` — Jensen's inequality in information theory  · deepen derivation

**Connections (§1).**
> Jensen's inequality is a general tool from convexity that supports several information-theory facts. The reader has already seen averages, logarithms, and KL nonnegativity. This lesson explains why the curvature of negative log makes those facts work. It is especially important for proving that KL divergence and many related divergences cannot be negative.

**Motivation & Intuition (§2).**
> Convex functions interact with averages in a disciplined way. Applying a convex function after averaging gives a value no larger than averaging the function values first. For information theory, the most important convex function is $-\log t$ on positive inputs.
>
> Probability ratios turn this geometric fact into a statement about model mismatch. When the ratio $Q(X)/P(X)$ is averaged under $P$, it equals one under the support assumptions. Jensen then says the average negative log ratio is at least the negative log of one, which is zero. That is the clean reason KL divergence has a nonnegative sign.

**Definition & Assumptions (§3).**

- **Derive (complete).**
  1. Let $f$ be convex and let $X$ take values $x_i$ with weights $\lambda_i\ge0$ summing to $1$ — these are averaging weights.
  2. Convexity says the graph lies below chords: $f(\lambda a+(1-\lambda)b)\le\lambda f(a)+(1-\lambda)f(b)$ — this is the two-point case.
  3. Repeating the two-point argument gives $f(\sum_i\lambda_i x_i)\le\sum_i\lambda_i f(x_i)$ — this is Jensen for finite averages.
  4. Choose $f(t)=-\log t$, which is convex on $t>0$ — its second derivative is $1/t^2>0$.
  5. Apply Jensen to $R=Q(X)/P(X)$ under $P$: $E_P[-\log R]\ge -\log E_P[R]$ — negative log of an average is no larger than average negative log.
  6. Since $E_P[Q/P]=\sum_x q(x)=1$, $D_{KL}(P\|Q)=E_P[-\log(Q/P)]\ge0$ — this proves KL nonnegativity.
- **Symbols.** $f$ is a convex function; $\lambda_i$ are nonnegative weights; $E$ is expectation; $R$ is a probability ratio; logs may be base 2 or natural, but the inequality is unchanged.

**Real-World Applications (§5).**

- **Apps.** (1) **Log of an average**: $\ln(0.5)= -0.693$ is at least $0.5\ln0.2+0.5\ln0.8=-0.916$ because $\ln$ is concave. (2) **KL bound**: $D_{KL}\ge0$, so cross-entropy $1.4$ bits implies $H(P)\le1.4$ bits. (3) **Equality case**: if $P=Q$, then all ratios are $1$ and KL is $0$. (4) **Model mismatch**: $P=(0.7,0.3)$, $Q=(0.5,0.5)$ gives KL $0.082$ nats, confirming nonnegativity. (5) **ELBO lower bound**: KL gap $0.3$ nats makes ELBO $0.3$ below $\log p(x)$. (6) **Arithmetic-geometric mean**: $0.5\ln2+0.5\ln8=\ln4$, while $\ln5$ for the arithmetic mean is larger by $0.223$ nats.

### `math-21-11` — Source coding and Shannon's theorem  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> Source coding connects entropy to lossless compression. Earlier lessons defined entropy as average surprise; this lesson gives it an operational meaning as a best possible long-run code rate. Prefix codes provide the concrete setting, because their codewords can be decoded without ambiguity. Shannon's theorem explains both the lower bound and why long blocks can approach it.

**Motivation & Intuition (§2).**
> A lossless code should assign shorter codewords to common symbols and longer codewords to rare symbols. The expected length averages those code lengths using the source probabilities. The central limit is that no uniquely decodable binary prefix code can have an average length below the source entropy.
>
> The theorem also has a constructive side. Individual symbols may force integer code lengths and therefore small overhead, but long blocks behave more smoothly. Typical length-$n$ sequences occupy about $2^{nH}$ possibilities, so roughly $nH$ bits are enough per block, up to an arbitrarily small overhead for large $n$.

**Definition & Assumptions (§3).**

- **Derive (complete).**
  1. A prefix code with lengths $\ell(x)$ has expected length $L=\sum_xp(x)\ell(x)$ — average bits per symbol weight code length by frequency.
  2. Prefix lengths obey Kraft's inequality $\sum_x2^{-\ell(x)}\le1$ — binary codewords must fit into a prefix tree.
  3. Define $q(x)=2^{-\ell(x)}/K$ with $K=\sum_x2^{-\ell(x)}\le1$ — this normalizes code lengths into a distribution.
  4. Use KL nonnegativity: $D_{KL}(P\|Q)\ge0$ implies $H(P)\le -\sum_xp(x)\log_2 q(x)$ — cross-entropy cannot beat entropy.
  5. Substitute $q(x)$: $-\log_2 q(x)=\ell(x)+\log_2 K$ — this relates model code length to tree length.
  6. Since $\log_2K\le0$, the inequality gives $H(P)\le L+\log_2K\le L$ after rearrangement for complete prefix codes; thus $L\ge H(P)$ — no lossless prefix code beats entropy.
  7. Shannon's constructive side uses long blocks whose typical set has about $2^{nH}$ sequences — assigning about $nH$ bits per typical block makes rates below $H+\epsilon$ achievable for large $n$.
- **Symbols.** $\ell(x)$ is the binary code length for symbol $x$; $L$ is expected length; $H(P)$ is source entropy; $K$ is the Kraft sum; $\epsilon$ is an arbitrarily small overhead.

**Real-World Applications (§5).**

- **Apps.** (1) **Exact dyadic source**: $P=(0.5,0.25,0.25)$ has $H=1.5$ bits and code lengths $1,2,2$ give $L=1.5$. (2) **Biased binary source**: $P=(0.8,0.2)$ has lower bound $0.722$ bits/symbol. (3) **Fixed two-bit code waste**: for $P=(0.5,0.25,0.25)$, fixed length $2$ wastes $0.5$ bits/symbol. (4) **Million symbols**: at $1.5$ bits/symbol, $10^6$ symbols need at least $1.5$ Mbits. (5) **Near-Shannon block code**: if $H=0.722$ and overhead $0.03$, rate $0.752$ bits/symbol is the target. (6) **Four uniform symbols**: $H=2$ bits and no lossless binary code can average below $2$.

### `math-21-12` — Huffman coding  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> Huffman coding is the concrete optimal prefix-code algorithm for a known discrete distribution. It uses the source-coding idea that frequent symbols deserve short descriptions and rare symbols can be placed deeper in the tree. The lesson builds on expected code length and prefix-code trees. It gives a practical method that often comes very close to entropy.

**Motivation & Intuition (§2).**
> A prefix code can be pictured as a binary tree whose leaves are symbols. The expected length is smaller when high-probability symbols sit near the root and low-probability symbols sit farther down. Huffman's algorithm turns that intuition into a greedy construction with a proof of optimality.
>
> The key step is to pair the two least likely symbols as deepest siblings. Once those two are merged into a compound symbol, the remaining problem is a smaller version of the same problem. Repeating the merge and then expanding the tree gives an optimal prefix code for the original probabilities.

**Definition & Assumptions (§3).**

- **Derive (complete).**
  1. In any full binary prefix tree, two deepest leaves can be chosen as siblings — deepest codewords share all but the last bit.
  2. An optimal tree can put the two least probable symbols at those deepest sibling leaves — swapping a rarer symbol deeper cannot increase expected length.
  3. Merge those two symbols into a compound symbol with probability equal to their sum — the shared prefix is the same until the final bit.
  4. Solve the smaller coding problem optimally — the rest of the tree is unchanged by the final split.
  5. Split the compound symbol back into the two least likely symbols, adding one bit to each — this restores the original alphabet.
  6. Repeating this merge proves the greedy algorithm constructs an optimal prefix tree.
- **Symbols.** $p_i$ are symbol probabilities; $\ell_i$ are code lengths; a prefix code has no codeword that begins another; $L=\sum_ip_i\ell_i$ is expected length in bits.

**Real-World Applications (§5).**

- **Apps.** (1) **Four-symbol code**: probabilities $0.4,0.3,0.2,0.1$ get lengths $1,2,3,3$ and $L=1.9$ bits. (2) **Entropy gap**: the same source has $H=1.846$ bits, so Huffman overhead is $0.054$ bits. (3) **Dyadic source**: $0.5,0.25,0.25$ gives lengths $1,2,2$ and reaches $1.5$ bits. (4) **Uniform four symbols**: lengths $2,2,2,2$ give $L=2$ bits. (5) **Rare error token**: probability $0.1$ receives length $3$ in the $0.4,0.3,0.2,0.1$ tree. (6) **Storage estimate**: $100{,}000$ symbols at $1.9$ bits/symbol need $190{,}000$ bits before headers.

### `math-21-13` — Arithmetic coding  · rewrite §5 · deepen derivation

**Connections (§1).**
> Arithmetic coding continues the source-coding story but avoids some integer-length limits of symbol-by-symbol prefix codes. Instead of assigning a separate bit string to each symbol, it assigns one interval to the whole sequence. That lets code length track sequence probability very closely. It is a natural follow-up to entropy, negative log probability, and Huffman coding.

**Motivation & Intuition (§2).**
> A sequence with high probability should need fewer bits than a sequence with low probability. Arithmetic coding realizes this by repeatedly narrowing an interval inside $[0,1)$. Each observed symbol keeps the subinterval assigned to that symbol, so the interval width is multiplied by the symbol probability at each step.
>
> At the end, any binary fraction that falls inside the final interval identifies the sequence. Narrow intervals need more bits to name, and the number of bits is about the negative base-2 logarithm of the interval width. Because the width equals the sequence probability under the model, arithmetic coding turns sequence probability directly into code length.

**Definition & Assumptions (§3).**

- **Derive (complete).**
  1. Assign each symbol an interval whose width is its probability — this maps probabilities to fractions of the unit interval.
  2. After the first symbol, keep only that symbol's interval — the message must lie inside it.
  3. Rescale the current interval and subdivide by the next-symbol probabilities — conditional refinement multiplies interval widths.
  4. After a sequence $x_{1:n}$, the final width is $p(x_{1:n})$ for an independent model, or the product of conditional probabilities in a language model — each step multiplies by the chosen probability.
  5. To identify an interval of width $w$, about $\lceil-\log_2 w\rceil$ bits are enough — binary prefixes cut the unit interval into powers of two.
  6. Therefore arithmetic coding uses about $-\log_2 p(x_{1:n})$ bits — sequence probability becomes code length.
- **Symbols.** $x_{1:n}$ is the sequence; $p(x_{1:n})$ is its model probability; $w$ is final interval width; $\lceil\cdot\rceil$ rounds up to an integer bit count.

**Real-World Applications (§5).**

- **Apps.** (1) **Sequence probability**: $0.4\cdot0.3\cdot0.2=0.024$ needs $5.381$ ideal bits. (2) **Integer bound**: width $0.024$ can be named with $\lceil5.381\rceil=6$ bits. (3) **High-probability token run**: probabilities $0.9,0.8$ need $-\log_2(0.72)=0.474$ bits ideally. (4) **Language-model NLL**: token probabilities $0.9,0.5,0.25$ cost $3.152$ bits. (5) **Block advantage**: a source with entropy $1.846$ bits/symbol needs about $1846$ bits for $1000$ symbols. (6) **Rare event sequence**: probability $10^{-6}$ costs $19.932$ bits.

### `math-21-14` — Channel capacity  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> Channel capacity moves from storing symbols to communicating through noise. Mutual information already measures how much an output tells us about an input. Capacity asks for the largest such information rate after choosing the best input distribution for the channel. This gives a numerical limit on reliable communication per channel use.

**Motivation & Intuition (§2).**
> A noisy channel is described by transition probabilities from inputs to outputs. Some input choices may be more informative than others, because they produce output distributions that are easier to distinguish. Mutual information measures how much uncertainty about the input is removed by observing the output.
>
> Capacity maximizes that mutual information over all input distributions. For a symmetric binary channel, the uniform input is optimal because both symbols are treated equally by the noise. The resulting formula is one bit per use minus the binary entropy of the flip probability, so more noise leaves less reliable information per use.

**Definition & Assumptions (§3).**

- **Derive (complete).**
  1. A channel is specified by transition probabilities $p(y\mid x)$ — they describe noisy output for each input.
  2. Choose an input distribution $p(x)$ — the sender controls how often each input is used.
  3. The joint distribution is $p(x,y)=p(x)p(y\mid x)$ — input choice and channel law determine all pairs.
  4. Compute mutual information $I(X;Y)=H(Y)-H(Y\mid X)$ — this is information delivered per channel use.
  5. Maximize over input distributions: $C=\max_{p(x)} I(X;Y)$ — capacity is the best achievable rate for that channel.
  6. For a binary symmetric channel with flip probability $\varepsilon$ and uniform input, $H(Y)=1$ and $H(Y\mid X)=H_b(\varepsilon)$ — output is uniform and each input has the same error entropy.
  7. Therefore $C=1-H_b(\varepsilon)$ bits/use for the binary symmetric channel — uniform input is optimal by symmetry.
- **Symbols.** $C$ is capacity; $X$ is channel input; $Y$ is channel output; $p(y\mid x)$ is the channel law; $H_b(\varepsilon)$ is binary entropy of error probability $\varepsilon$.

**Real-World Applications (§5).**

- **Apps.** (1) **Noiseless bit channel**: $\varepsilon=0$ gives $C=1$ bit/use. (2) **Binary symmetric channel**: $\varepsilon=0.1$ gives $C=0.531$ bits/use. (3) **Very noisy channel**: $\varepsilon=0.5$ gives $C=0$ bits/use. (4) **Block budget**: capacity $0.7$ bits/use over $2000$ uses carries at most $1400$ reliable bits. (5) **Error $0.11$**: $C=0.500$ bits/use. (6) **Error $0.01$**: $C=0.919$ bits/use.

### `math-21-15` — The noisy-channel coding theorem  · rewrite §5 · explain-only

**Connections (§1).**
> The noisy-channel coding theorem gives channel capacity its operational meaning. The capacity formula says how much information a channel can carry per use; the theorem says what rates are actually reliable in the long-block limit. It connects mutual information, coding, and probability of decoding error. This lesson is explain-only because the full proof is long and technical.

**Motivation & Intuition (§2).**
> A code for a noisy channel maps messages to length-$n$ channel input sequences and uses a decoder to guess the message from the noisy output. The communication rate counts how many message bits are sent per channel use. The theorem separates possible rates from impossible ones using the single number $C$.
>
> If the rate is below capacity, there exist long codes whose error probability can be made arbitrarily small. If the rate is above capacity, no coding method can make communication reliable. The proof requires typical sequences, random codebooks, decoding error bounds, and a converse argument, so the responsible lesson goal is to state the theorem clearly rather than compress the proof into a false derivation.

**Definition & Assumptions (§3).**

- **Derive (complete).** explain-only — the full proof requires typical sequences, random codebooks, decoding error bounds, and a converse argument. Do not fake a proof; state the theorem precisely and explain the two sides.
- **Symbols.** $R$ is communication rate in bits per channel use; $C$ is channel capacity; block length $n$ is the number of channel uses in one codeword; error probability is the chance the decoded message differs from the sent message.

**Real-World Applications (§5).**

- **Apps.** (1) **Below capacity**: if $C=0.7$ and $R=0.6$, the theorem allows arbitrarily small error with long blocks. (2) **Above capacity**: if $C=0.7$ and $R=0.8$, reliable communication is impossible. (3) **Payload limit**: $n=1000$, $C=0.531$ supports about $531$ reliable bits on a BSC with error $0.1$. (4) **Safety margin**: using $R=0.5$ on that channel leaves $0.031$ bits/use of margin. (5) **Noisy half-capacity channel**: $C=0.500$ over $10{,}000$ uses supports about $5000$ bits. (6) **Zero-capacity channel**: if $C=0$, even $R=0.01$ bits/use is above capacity.

### `math-21-16` — Rate–distortion theory  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> Rate–distortion theory is the lossy counterpart of source coding. Entropy gives the minimum rate when reconstruction must be exact, while rate–distortion allows controlled error. The lesson introduces a distortion budget and asks how much information must still pass from the source to the reconstruction. This is the mathematical setting for lossy compression tradeoffs.

**Motivation & Intuition (§2).**
> Lossy compression replaces each source value with an approximation. To make that precise, the problem needs a distortion function that assigns a cost to each reconstruction error and a budget for the average cost. A larger budget allows rougher reconstructions and should require fewer bits.
>
> The rate–distortion function measures the least mutual information between the source and its reconstruction among all conditional reconstruction rules that satisfy the distortion constraint. For a fair binary source with Hamming distortion, allowing an error probability $D$ removes $H_b(D)$ bits of uncertainty, leaving the rate $1-H_b(D)$ for $D\le1/2$.

**Definition & Assumptions (§3).**

- **Derive (complete).**
  1. Let $X$ be the source and $\hat X$ its reconstruction — lossy coding replaces the source by an approximation.
  2. Choose a distortion function $d(x,\hat x)$ — this defines the cost of a reconstruction error.
  3. Require average distortion $E[d(X,\hat X)]\le D$ — the allowed quality loss is a constraint.
  4. A lossy code must preserve information from $X$ into $\hat X$, measured by $I(X;\hat X)$ — reconstruction cannot depend on the source without information flow.
  5. Minimize that information over all conditional reconstructions satisfying the distortion constraint: $R(D)=\min_{p(\hat x\mid x):E[d]\le D}I(X;\hat X)$ — this is the rate-distortion function.
  6. For a fair binary source with Hamming distortion $D\le1/2$, the optimal strategy is a binary symmetric error of probability $D$, giving $R(D)=1-H_b(D)$ — the remaining information is one bit minus allowed error entropy.
- **Symbols.** $D$ is the distortion budget; $R(D)$ is the minimum rate; $\hat X$ is reconstruction; $d$ is distortion; $H_b$ is binary entropy.

**Real-World Applications (§5).**

- **Apps.** (1) **Lossless limit**: $D=0$ for a fair bit gives $R(D=0)=1$ bit. (2) **Allow $10\%$ bit errors**: $R(D=0.1)=0.531$ bits. (3) **Allow $50\%$ errors**: $R(D=0.5)=0$ bits. (4) **Image budget**: $R=0.25$ bits/pixel over $10^6$ pixels gives $250{,}000$ bits. (5) **Distortion margin**: lowering rate from $1$ to $0.531$ saves $0.469$ bits/source bit at $D=0.1$. (6) **Two-class label compression**: allowed error $0.01$ gives $R=0.919$ bits.

### `math-21-17` — The maximum entropy principle  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> The maximum entropy principle uses entropy as a rule for choosing a distribution under limited information. If only certain constraints are known, the preferred distribution is the one with the largest entropy among distributions satisfying them. With only the number of possible outcomes known, this becomes the uniform distribution. The lesson connects entropy to Lagrange multipliers and modeling discipline.

**Motivation & Intuition (§2).**
> Choosing a distribution can accidentally add assumptions that the evidence does not support. The maximum entropy principle avoids that by spreading probability as evenly as the known constraints allow. When the only constraint is that probabilities sum to one, there is no reason within the model to favor one outcome over another.
>
> The derivation makes that symmetry explicit. Maximizing entropy with a normalization constraint gives the same derivative condition for every probability. All optimal probabilities therefore have the same logarithm and must be equal, producing $p_i=1/n$ and entropy $\ln n$ nats or $\log_2 n$ bits.

**Definition & Assumptions (§3).**

- **Derive (complete).**
  1. Maximize $H(p)=-\sum_i p_i\ln p_i$ subject to $\sum_i p_i=1$ — the only constraint is normalization.
  2. Form the Lagrangian $\mathcal L=-\sum_i p_i\ln p_i+\lambda(\sum_i p_i-1)$ — the multiplier enforces total probability one.
  3. Differentiate: $\partial\mathcal L/\partial p_i=-(\ln p_i+1)+\lambda$ — each probability is varied separately.
  4. Set the derivative to zero: $\ln p_i=\lambda-1$ — all optimal probabilities have the same log.
  5. Therefore all $p_i$ are equal; normalization gives $p_i=1/n$ — equal logs mean a uniform distribution.
  6. Entropy at this distribution is $H=\ln n$ nats, or $\log_2 n$ bits — substitute $p_i=1/n$ into entropy.
- **Symbols.** $p_i$ are probabilities over $n$ outcomes; $\lambda$ is a Lagrange multiplier; $H$ is entropy; natural logs give nats unless converted to bits.

**Real-World Applications (§5).**

- **Apps.** (1) **Four outcomes**: max entropy is $\log_2 4=2$ bits. (2) **Ten classes**: max entropy is $\log_2 10=3.322$ bits. (3) **Binary label with no other constraint**: $p=(0.5,0.5)$ and $H=1$ bit. (4) **Uniform byte**: $256$ values give $8$ bits. (5) **Nats version**: four outcomes give $\ln4=1.386$ nats. (6) **Model check**: distribution $(0.7,0.2,0.1)$ has $1.157$ bits, below the three-class maximum $1.585$ bits.

### `math-21-18` — f-divergences  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> The family of $f$-divergences generalizes KL divergence. Earlier lessons compared distributions through log ratios; this lesson keeps the ratio idea but allows many convex penalty functions. Different choices of $f$ recover different notions of discrepancy. The common structure helps keep support assumptions and nonnegativity clear.

**Motivation & Intuition (§2).**
> When two distributions are compared point by point, the ratio $p(x)/q(x)$ says how much more or less mass $P$ assigns than $Q$. A ratio of one means local agreement, while ratios away from one signal mismatch. An $f$-divergence applies a convex penalty to each ratio and averages those penalties under the reference distribution $Q$.
>
> Convexity is what gives the whole family its nonnegative sign. Since the $Q$-weighted average ratio equals one, Jensen's inequality says the average penalty is at least the penalty at one. With $f(1)=0$, equal distributions have zero divergence and valid mismatches have nonnegative divergence.

**Definition & Assumptions (§3).**

- **Derive (complete).**
  1. Compare $P$ to $Q$ through ratios $r(x)=p(x)/q(x)$ — ratios show where $P$ puts more or less mass than $Q$.
  2. Choose a convex function $f$ with $f(1)=0$ — ratio $1$ means no local mismatch.
  3. Average the penalty under $Q$: $D_f(P\|Q)=\sum_x q(x)f(p(x)/q(x))$ — the reference distribution supplies the weights.
  4. If $P=Q$, then every ratio is $1$, so $D_f=\sum_xq(x)f(1)=0$ — equal distributions have zero divergence.
  5. By Jensen, $\sum_xq(x)f(r(x))\ge f(\sum_xq(x)r(x))$ — convex functions put the average penalty above the penalty at the average ratio.
  6. The average ratio is $\sum_xq(x)p(x)/q(x)=\sum_xp(x)=1$, so $D_f(P\|Q)\ge f(1)=0$ — this proves nonnegativity under support conditions.
- **Symbols.** $f$ is convex; $D_f$ is the divergence generated by $f$; $p(x)/q(x)$ is a probability ratio; require $q(x)>0$ wherever $p(x)>0$.

**Real-World Applications (§5).**

- **Apps.** (1) **Pearson chi-square**: $f(t)=(t-1)^2$, $P=(0.6,0.4)$, $Q=(0.5,0.5)$ gives $0.040$. (2) **KL as an $f$-divergence**: $f(t)=t\ln t$ gives $0.0201$ nats for the same $P,Q$. (3) **Total variation**: $f(t)=0.5|t-1|$ gives $0.100$. (4) **Squared Hellinger form**: $f(t)=(\sqrt t-1)^2$ gives $0.0101$. (5) **Jensen-Shannon example**: $P=(0.8,0.2)$ and $Q=(0.2,0.8)$ give $0.278$ bits. (6) **Zero check**: $P=Q$ makes every ratio $1$ and every valid $D_f=0$.

### `math-21-19` — The evidence lower bound (ELBO)  · rewrite §5 · deepen derivation

**Connections (§1).**
> The ELBO connects KL divergence to latent-variable modeling. In these models the observed data $x$ depend on an unobserved variable $z$, and the exact posterior over $z$ is often hard to compute. A variational distribution gives a tractable substitute. The lesson shows that the price of this substitution is exactly a KL gap.

**Motivation & Intuition (§2).**
> The evidence $\log p(x)$ is the quantity a latent-variable model would like to evaluate or maximize. Direct computation can be difficult because it requires summing or integrating over latent variables. Variational inference introduces a manageable distribution $q(z\mid x)$ and rewrites the evidence in terms of an objective plus a mismatch term.
>
> The objective is the evidence lower bound, or ELBO. It is lower than the true log evidence because the remaining term is a KL divergence from the variational posterior to the true posterior. When the approximation is exact, the KL gap is zero and the bound is tight; when the approximation is loose, the ELBO falls below the evidence by that many nats.

**Definition & Assumptions (§3).**

- **Derive (complete).**
  1. Start with evidence $\log p(x)$ — this is the log probability of observed data.
  2. Insert any variational distribution $q(z\mid x)$: $\log p(x)=E_q[\log p(x)]$ — a constant equals its expectation.
  3. Use $p(x)=p(x,z)/p(z\mid x)$ — rearrange the posterior identity.
  4. Substitute inside the log: $\log p(x)=E_q[\log p(x,z)-\log p(z\mid x)]$ — this expresses evidence using latent $z$.
  5. Add and subtract $E_q[\log q(z\mid x)]$ — this creates the variational objective and the KL gap.
  6. Group terms: $\log p(x)=E_q[\log p(x,z)-\log q(z\mid x)]+E_q[\log q(z\mid x)-\log p(z\mid x)]$.
  7. Identify $\mathrm{ELBO}=E_q[\log p(x,z)-\log q(z\mid x)]$ and $D_{KL}(q(z\mid x)\|p(z\mid x))$ as the second term — KL is nonnegative.
  8. Therefore $\mathrm{ELBO}\le\log p(x)$, with equality when $q(z\mid x)=p(z\mid x)$ — the gap is the posterior mismatch.
- **Symbols.** $x$ is observed data; $z$ is latent; $p(x,z)$ is the joint model; $p(z\mid x)$ is the true posterior; $q(z\mid x)$ is the variational approximation; expectations are under $q$; logs are natural in most ML uses.

**Real-World Applications (§5).**

- **Apps.** (1) **Gap computation**: if $\log p(x)=-2.0$ and KL gap is $0.3$, ELBO is $-2.3$. (2) **Negative ELBO loss**: reconstruction $1.6$ plus KL $0.4$ gives loss $2.0$. (3) **Beta-VAE weighting**: with KL weight $0.25$, $1.6+0.25(0.4)=1.7$. (4) **Tight posterior**: KL gap $0$ makes ELBO equal $\log p(x)$. (5) **Loose posterior**: ELBO $-3.0$ and log evidence $-2.4$ imply gap $0.6$ nats. (6) **Two-example batch**: ELBOs $-2.3$ and $-1.7$ average to $-2.0$.

### `math-21-20` — Cross-entropy loss, KL in VAEs and RL  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This capstone gathers the section's training-objective uses into one place. Cross-entropy supplies classifier losses, the ELBO supplies the VAE reconstruction-plus-KL objective, and KL divergence controls policy movement in reinforcement learning. The reader has already seen each mathematical piece separately. This lesson emphasizes which distributions play the roles of data, model, posterior, prior, old policy, and new policy.

**Motivation & Intuition (§2).**
> Many machine-learning objectives are built from negative log probabilities. In a one-hot classifier, only the true class contributes, so multiclass cross-entropy becomes the negative log probability assigned to that class. A confident correct prediction has a small loss, while a low true-class probability has a large loss.
>
> VAEs and policy methods use the same ingredients with different distributions. In a VAE, the negative ELBO separates into a reconstruction term and a KL term that keeps the encoder distribution near the prior. In reinforcement learning, a KL penalty or trust-region constraint limits how far a new policy moves from the old policy, with old-policy action probabilities weighting the movement cost.

**Definition & Assumptions (§3).**

- **Derive (complete).**
  1. For a one-hot label $y$, exactly one component $y_k$ is $1$ — only the true class contributes to the sum.
  2. Cross-entropy loss is $L=-\sum_k y_k\ln \hat p_k$ — it averages negative log predicted probabilities under the label distribution.
  3. Because only the true class $c$ has $y_c=1$, $L=-\ln\hat p_c$ — the multiclass loss reduces to the true-class negative log probability.
  4. For VAEs, start from the ELBO identity: $-\mathrm{ELBO}=E_q[-\log p(x\mid z)]+D_{KL}(q(z\mid x)\|p(z))$ when $p(x,z)=p(x\mid z)p(z)$ — negative ELBO becomes reconstruction plus prior KL.
  5. For RL, a trust-region penalty uses $D_{KL}(\pi_{old}\|\pi_{new})=\sum_a\pi_{old}(a)\ln[\pi_{old}(a)/\pi_{new}(a)]$ — old-policy actions weight the movement cost.
  6. These are the same negative-log and KL quantities with different choices of distributions — the training loop chooses which distribution is treated as data or reference.
- **Symbols.** $y_k$ is a one-hot label; $\hat p_k$ is predicted class probability; $q(z\mid x)$ is an encoder distribution; $p(z)$ is a prior; $\pi_{old},\pi_{new}$ are action distributions; logs are natural, so losses are nats.

**Real-World Applications (§5).**

- **Apps.** (1) **Classifier loss**: prediction $[0.1,0.7,0.2]$ with class 2 gives $-\ln0.7=0.357$ nats. (2) **Worse classifier**: true-class probability $0.1$ gives $2.303$ nats. (3) **VAE loss**: reconstruction $2.1$ plus KL $0.3$ gives negative ELBO $2.4$. (4) **Policy KL**: old $(0.6,0.4)$ and new $(0.5,0.5)$ give $0.0201$ nats. (5) **Policy penalty objective**: reward loss $1.2$ plus KL weight $0.5$ times $0.0201$ gives $1.210$ total. (6) **Distillation soft-label cross-entropy**: teacher $(0.8,0.2)$ and student $(0.6,0.4)$ gives $0.592$ nats.

---

## Build order for this section

1. **Delete the shared §5 block first** for `21-11`…`21-20`; replace with the six concept-specific application sets above.
2. **Author the central quantities next**: `21-02`, `21-05`, `21-06`, `21-07`, `21-19`, `21-20`, because later lessons reuse entropy, MI, KL, cross-entropy, and ELBO.
3. **Then author coding and channel lessons**: `21-11`…`21-16`, keeping bits/use, bits/symbol, and theorem assumptions separate.
4. **Finish general inequality/divergence lessons**: `21-09`, `21-10`, `21-17`, `21-18`, ensuring every proof names its support and convexity assumptions.
5. **Final pass:** promote all key formulas to display math, add symbol tables/glosses, remove banned voice artifacts, and rerun numeric checks for every §5 value.
