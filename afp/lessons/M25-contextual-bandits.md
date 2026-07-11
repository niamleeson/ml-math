# M25 · Contextual bandits (explore/exploit)
> **Domain:** Domain 5 · Bandits & RL · **Maps to:** all · **Skip if you can already…** frame directive/variant selection as a bandit

## Overview

A bandit is an online-learning loop for decisions with partial feedback: choose an action, observe only that action's reward, update, and repeat. It is lighter than full RL because it does not model long chains of future state transitions. It is more adaptive than a fixed A/B test because traffic can move toward better arms during learning.

For ads and product systems, contextual bandits are a natural framing for choosing creatives, prompt directives, copy variants, ranking treatments, or call-to-action variants when the best action depends on the request.

**By the end you can answer:**
- What are explore/exploit and regret?
- How do ε-greedy, UCB, and Thompson sampling differ?
- What is a contextual bandit, and what does LinUCB add?
- How do you frame variant/directive selection as a bandit?
- How do you compute a UCB index / arm choice by hand?
- Bandits vs A/B testing — when should you use each?

Two sub-lessons:

- **M25.1 Explore/exploit & bandit algorithms** — ε-greedy, UCB, Thompson, regret.
- **M25.2 Contextual bandits & LinUCB** — request-aware variant/directive selection.

<p class="cur-colab"><a class="cur-colab-btn" href="https://colab.research.google.com/github/niamleeson/ml-math/blob/main/afp/notebooks/M25-contextual-bandits.ipynb" target="_blank" rel="noopener">▶ Open the runnable toy-example notebook (epsilon-greedy learning the best arm + the no-exploration break case) in Google Colab</a></p>

---

## M25.1 · Explore/exploit & bandit algorithms

**The idea.** A $K$-armed bandit chooses an arm $a_t$ and observes reward $r_t$ only for that arm. The tension is:

**Everyday analogy.** A doctor choosing among treatments faces the same explore/exploit tradeoff. Exploiting means prescribing the treatment that has worked best so far; exploring means trying a less-tested treatment often enough to learn whether it is actually better. Each treatment is an arm, the patient's outcome is the reward, and regret is the health benefit lost while learning compared with always using the best treatment.

- **exploit:** choose the arm with the best current estimate;
- **explore:** choose uncertain arms to learn whether they are better.

Cumulative regret is reward lost relative to the best arm:

$$R_T=T\mu^*-\sum_{t=1}^T r_t,$$

where $\mu^*$ is the expected reward of the best arm. Low regret means learning quickly without wasting too much traffic.

**ε-greedy.** With probability $\epsilon$, pick a random arm. Otherwise pick the highest empirical mean.

```python
if random() < epsilon:
    arm = random_arm()
else:
    arm = argmax(mean_reward)
```

It is simple, but fixed random exploration keeps spending traffic on known-bad arms. Decaying $\epsilon$ helps, but can under-explore if rewards change.

**UCB.** Upper Confidence Bound chooses optimism:

$$\text{UCB}_a=\hat\mu_a+c\sqrt{\frac{\log t}{n_a}}.$$

The first term exploits observed mean. The second term explores arms with fewer pulls.

**Worked example — UCB by hand.** At round $t=105$:

| arm | pulls $n_a$ | mean $\hat\mu_a$ |
|---|---:|---:|
| A | 100 | 0.10 |
| B | 4 | 0.14 |

With $c=1$ and $\log(105)\approx4.65$:

$$\text{UCB}_A=0.10+\sqrt{4.65/100}=0.10+0.216=0.316,$$

$$\text{UCB}_B=0.14+\sqrt{4.65/4}=0.14+1.078=1.218.$$

UCB chooses B. B's mean is uncertain, so its confidence bonus is large enough to justify exploration.

**Thompson sampling.** For Bernoulli rewards, maintain a Beta posterior per arm:

$$\theta_a\sim\text{Beta}(\alpha_a,\beta_a).$$

Each round, sample one plausible reward rate per arm and play the sampled winner. A lightly tested arm has a wider posterior and therefore sometimes wins samples even if its current mean is lower.

Example: arm A has 10 successes and 90 failures, so with a Beta(1,1) prior it is Beta(11,91). Arm B has 2 successes and 2 failures, so it is Beta(3,3). B is uncertain; Thompson sampling explores it naturally.

| Algorithm | Exploration rule | Strength | Watch out |
|---|---|---|---|
| ε-greedy | random traffic | easy baseline | wastes traffic |
| UCB | mean + confidence bonus | uncertainty-aware | bonus tuning matters |
| Thompson | posterior sampling | natural randomized exploration | needs posterior/model choice |

**ε-greedy vs LinUCB vs Thompson — same Creative Intelligence request.** Context: an Event Ads advertiser on mobile asks for a generated headline. Eligible arms are A = concise benefit, B = speaker-credential lead, C = urgency lead. Current estimates are A: 0.080 CTR from 1,000 impressions, B: 0.095 from 80, C: 0.070 from 40; the true best is unknown.

| Method | Concrete explore/exploit choice on this context | Why it differs from siblings |
|---|---|---|
| **ε-greedy** | With $\epsilon=0.10$, exploit 90% of the time by choosing B because 0.095 is the largest mean; explore 10% by choosing A/B/C uniformly, e.g. C may get traffic despite looking worst | Exploration is blind random traffic, not uncertainty-targeted |
| **LinUCB** | If B's contextual score is $0.095+0.010=0.105$ and C's is $0.070+0.050=0.120$, choose C for this mobile/webinar context | It explores the arm whose uncertainty is large for this specific feature vector $x$, not merely the arm with best mean |
| **Thompson sampling** | Sample plausible CTRs, e.g. $\tilde\theta_A=0.081$, $\tilde\theta_B=0.089$, $\tilde\theta_C=0.112$; choose C on this round, then update C after observing click/no click | It randomizes according to posterior uncertainty; C sometimes wins because 40 impressions leave a wide posterior |

**Regret, concretely.** If the true expected CTRs for this context were A = 0.080, B = 0.095, C = 0.110, then choosing B instead of C has one-impression expected regret $0.110-0.095=0.015$. Over 10,000 similar impressions, that is about 150 expected clicks left on the table while learning.

**You'll be able to say:** *"A bandit repeatedly chooses an arm, observes only that arm's reward, and balances exploiting the current best estimate with exploring uncertain arms. Regret is reward lost relative to the best arm. ε-greedy explores randomly, UCB chooses mean plus uncertainty bonus, and Thompson sampling samples from each arm's posterior and plays the sampled winner."*

---

## M25.2 · Contextual bandits & LinUCB

**The idea.** A contextual bandit sees context $x_t$ before choosing action $a_t$. It can learn that different members, advertisers, requests, devices, or campaign objectives prefer different variants.

**Everyday analogy.** The doctor example becomes contextual when the best treatment depends on the patient in front of them. Age, symptoms, allergies, and history are the context; the treatment is the action; the outcome is the reward; and methods like LinUCB or Thompson sampling try uncertain options in a principled way. Directive or variant selection has the same shape: context comes in, pick a variant, observe a reward later, and log the propensity.

A logged row is

$$(x_t,a_t,p_t,r_t),$$

where $p_t$ is the action propensity. Logging propensities is necessary for later off-policy evaluation.

**Frame directive/variant selection as a bandit**

| Bandit piece | Directive/variant example |
|---|---|
| context | advertiser vertical, objective, member segment, device, creative features |
| action | prompt directive, creative template, CTA, copy variant |
| reward | click, lead, conversion proxy, human preference, quality score |
| guardrails | policy, fairness, latency, cost, advertiser budget |
| propensity | probability assigned to displayed variant |

This framing works when only the displayed variant gets feedback and the system should adapt while learning.

**LinUCB.** LinUCB fits a linear reward model for each arm:

$$\hat r_a(x)=\hat\theta_a^\top x.$$

It chooses the arm with prediction plus confidence bonus:

$$\text{score}_a(x)=\hat\theta_a^\top x+
\alpha\sqrt{x^\top A_a^{-1}x}.$$

The bonus is large when arm $a$ is uncertain for context $x$.

**Worked example — choose a directive.** Two directives are eligible for an ad-copy request.

| arm | predicted reward | confidence bonus | score |
|---|---:|---:|---:|
| A: concise critique | 0.08 | 0.03 | 0.110 |
| B: detailed rewrite | 0.10 | 0.005 | 0.105 |

LinUCB chooses A because $0.110>0.105$. B has higher predicted reward, but A has more uncertainty and therefore more learning value.

**Small computation.** Let

$$x=[1,0.5],\quad \hat\theta_A=[0.05,0.06].$$

Then

$$\hat\theta_A^\top x=0.05+0.06(0.5)=0.08.$$

If the confidence bonus is 0.02, A's score is 0.10. If B's score is 0.094, choose A.

```python
for arm in eligible_arms:
    pred = theta[arm] @ x
    bonus = alpha * sqrt(x @ inv(A[arm]) @ x)
    score[arm] = pred + bonus
chosen = argmax(score)
log(x=x, action=chosen, propensity=probability(chosen), reward=observed_later)
```

**Bandits vs A/B testing.** Use a bandit when traffic should adapt during learning and when treatment effects differ by context. Use A/B testing when the goal is a clean fixed-policy causal estimate or a simple launch decision.

| Need | Bandit | A/B test |
|---|---|---|
| allocation | adaptive | fixed random split |
| goal | maximize reward while learning | estimate treatment effect |
| heterogeneity | context-specific | average effect often enough |
| analysis | needs propensities/OPE | simpler reporting |
| risk | needs guardrails/rollback | easier to explain |

**You'll be able to say:** *"A contextual bandit observes features before choosing an action, so it can learn different best variants for different contexts. LinUCB uses linear predicted reward plus a confidence bonus. I frame directive selection by defining context, actions, reward, guardrails, and propensity logging; I use bandits for adaptive allocation and A/B tests for clean fixed-policy measurement."*

---

## Resources
- Bandit Algorithms (Lattimore & Szepesvári) (the rigorous reference)
- Vowpal Wabbit — contextual bandits tutorial (practical CB training)

## Papers
- LinUCB — A Contextual-Bandit Approach to News Article Recommendation (Li et al., 2010)
- An Empirical Evaluation of Thompson Sampling (Chapelle & Li, 2011)
