# M26 · RL foundations + where RL fits ads
> **Domain:** Domain 5 · Bandits & RL · **Maps to:** Instream Ads perf, Event Ads perf · **Skip if you can already…** state an MDP and explain bandit vs full-RL trade-offs

## Overview

Full reinforcement learning is for sequential decisions where today's action changes tomorrow's state. A bandit can pick the best creative variant for this request. Full RL is justified when actions affect future budget, inventory, user state, or later opportunities.

For Instream Ads and Event Ads, pacing and bidding are natural examples. Spending more now changes remaining budget. Bidding higher changes auction wins and future opportunity. Those are stateful control problems.

**By the end you can answer:**
- What is an MDP: states, actions, transition probabilities, rewards, and discount γ?
- What are value functions V and Q, and what is the Bellman equation?
- How do value iteration and policy iteration work?
- What is policy gradient / REINFORCE?
- When does a bandit suffice vs full RL?
- Where does RL fit ads, such as pacing and bidding as sequential decisions?
- How do you do one value-iteration sweep by hand?

Two sub-lessons:

- **M26.1 MDPs & value functions** — Bellman backups and value iteration.
- **M26.2 Policy gradients & where RL fits ads** — REINFORCE and the bandit/RL decision.

---

## M26.1 · MDPs & value functions

**The idea.** A Markov Decision Process is

**Everyday analogy.** Think of playing a video game. The state is the screen you see, actions are the buttons you can press, reward is the score or damage avoided, and the policy is your strategy for choosing buttons. The MDP is the game's rulebook: given the current screen and button, it describes what screen can come next and what reward you get.

$$(\mathcal S,\mathcal A,P,R,\gamma),$$

where $\mathcal S$ is states, $\mathcal A$ is actions, $P(s'\mid s,a)$ is the transition probability, $R(s,a,s')$ is reward, and $\gamma$ discounts future reward.

A trajectory is

$$s_0,a_0,r_1,s_1,a_1,r_2,\ldots$$

and the discounted return is

$$G_t=r_{t+1}+\gamma r_{t+2}+\gamma^2r_{t+3}+\cdots.$$

The state-value function is

$$V^\pi(s)=\mathbb E_\pi[G_t\mid s_t=s],$$

and the action-value function is

$$Q^\pi(s,a)=\mathbb E_\pi[G_t\mid s_t=s,a_t=a].$$

$V$ values a state before the action. $Q$ values committing to a particular first action.

The Bellman expectation equation is

$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)[R(s,a,s')+\gamma V^\pi(s')].$$

The optimality backup is

$$V^*(s)=\max_a\sum_{s'}P(s'\mid s,a)[R(s,a,s')+\gamma V^*(s')].$$

Value iteration applies

$$V_{k+1}(s)=\max_a\sum_{s'}P(s'\mid s,a)[R(s,a,s')+\gamma V_k(s')].$$

Policy iteration alternates: evaluate the current policy, then improve it greedily with respect to the evaluated values.

**Worked example — one backup.** Let $\gamma=0.9$, immediate reward be 2, and the next state values be:

- value 10 with probability 0.8;
- value 0 with probability 0.2.

Expected next value is

$$0.8(10)+0.2(0)=8.$$

The backup is

$$2+0.9(8)=9.2.$$

**Worked example — small ads pacing MDP.** States:

- $S_H$: healthy remaining budget;
- $S_L$: low remaining budget.

Actions:

- conservative bid;
- aggressive bid.

Use $\gamma=0.9$ and initialize $V_0(S_H)=V_0(S_L)=0$.

| state | action | transition | reward |
|---|---|---|---:|
| $S_H$ | conservative | 0.9 to $S_H$, 0.1 to $S_L$ | 3 |
| $S_H$ | aggressive | 0.5 to $S_H$, 0.5 to $S_L$ | 6 |
| $S_L$ | conservative | 0.6 to $S_H$, 0.4 to $S_L$ | 2 |
| $S_L$ | aggressive | 0.1 to $S_H$, 0.9 to $S_L$ | 1 |

First value-iteration sweep from zeros:

For $S_H$:

- conservative: $3+0.9(0)=3$;
- aggressive: $6+0.9(0)=6$;
- $V_1(S_H)=6$.

For $S_L$:

- conservative: $2+0.9(0)=2$;
- aggressive: $1+0.9(0)=1$;
- $V_1(S_L)=2$.

Second sweep for $S_H$:

$$\text{conservative}=3+0.9[0.9(6)+0.1(2)]=8.04,$$

$$\text{aggressive}=6+0.9[0.5(6)+0.5(2)]=9.6.$$

Aggressive remains greedy in $S_H$. In $S_L$, conservative is likely safer because it improves the chance of returning to healthy budget.

```python
for s in states:
    V_next[s] = max(
        sum(P[s,a,s2] * (R[s,a,s2] + gamma * V[s2]) for s2 in states)
        for a in actions
    )
```

**You'll be able to say:** *"An MDP is $(S,A,P,R,\gamma)$. $V^\pi(s)$ is expected discounted return from a state, and $Q^\pi(s,a)$ starts with action $a$. Bellman equations express value as immediate reward plus discounted next value; value iteration applies the optimality backup, while policy iteration alternates evaluation and improvement."*

---

## M26.2 · Policy gradients & where RL fits ads

**The idea.** Policy gradients optimize a parameterized policy $\pi_\theta(a\mid s)$ directly. REINFORCE uses

**Everyday analogy.** Policy gradients are like adjusting your video-game strategy after a run: if jumping in a situation led to a better-than-expected score, you make jumping more likely next time; if it hurt your score, you make it less likely. The return is the run's outcome, the baseline is what you expected from that state, and the advantage is the surprise above or below expectation. A bandit is like a one-shot slot machine pull, while full RL is a game where today's move changes tomorrow's board.

$$\nabla_\theta J(\theta)=\mathbb E[\nabla_\theta\log\pi_\theta(a_t\mid s_t)G_t].$$

With a baseline $b(s_t)$, the practical form is

$$\nabla_\theta J(\theta)\approx\mathbb E[\nabla_\theta\log\pi_\theta(a_t\mid s_t)(G_t-b(s_t))].$$

The advantage is

$$A_t=G_t-b(s_t).$$

Positive advantage increases the action's probability. Negative advantage decreases it.

**Worked example — policy-gradient sign.** A pacing policy chose aggressive bidding. If return is 8 and the baseline for that state is 5,

$$A=8-5=+3,$$

so the update increases the probability of aggressive bidding in similar states. If return is 3,

$$A=3-5=-2,$$

so the update decreases it.

```python
for trajectory in rollouts(policy):
    for s, a, G_t in trajectory:
        advantage = G_t - baseline(s)
        loss += -log_prob(policy, a, s) * advantage
```

**Bandit vs full RL.** A bandit suffices when the action affects only immediate reward for this request. Full RL is justified when the action changes future state.

| Question | Bandit | Full RL |
|---|---|---|
| Future state changed? | no or negligible | yes |
| Reward timing | immediate | delayed/accumulated |
| Credit assignment | simple | across time |
| Example | choose creative variant | pace budget or bid over day |
| Evaluation | OPE/A-B | simulator, guardrails, sequential eval |

**Small tradeoff example.** Choosing between two headlines for one impression is usually a contextual bandit: show one headline and observe click/no click. Pacing a $100 budget is sequential: spending $80 before noon changes the remaining action space for afternoon auctions.

**Ads MDP framing.** For Instream/Event Ads pacing:

- state: remaining budget, time of day, recent win rate, conversion rate, objective;
- action: bid multiplier or pacing throttle;
- transition: auctions won/lost and budget consumed;
- reward: conversion value minus spend and constraint penalties;
- horizon: day, flight, or campaign period.

At 9am, aggressive bidding may earn reward now but move the system to low remaining budget by noon. Conservative bidding may earn less immediately but preserve opportunity for evening inventory. That state transition is the reason to consider RL.

Use simpler bandits or supervised ranking when the action is one-shot, labels arrive quickly, and future state barely changes. Consider full RL only when sequential effects are real, a safe exploration path exists, and guardrails can prevent overspend or poor advertiser outcomes.

**You'll be able to say:** *"Policy gradients increase log-probability of actions with positive return-minus-baseline and decrease actions with negative advantage. A bandit suffices when actions affect only immediate reward; full RL is justified when actions change future state. Ads pacing and bidding can be MDPs because spending or bidding now changes remaining budget and future auction choices."*

---

## Resources
- OpenAI — Spinning Up in Deep RL (MDPs to policy gradients with code)
- Sutton & Barto — Reinforcement Learning (the foundational textbook)
- David Silver — RL course (DeepMind) (lectures on value/policy methods)

## Papers
- Proximal Policy Optimization (Schulman et al., 2017)
- Playing Atari with Deep RL / DQN (Mnih et al., 2013/2015)
- Real-Time Bidding by Reinforcement Learning in Display Advertising (Cai et al., 2017)
