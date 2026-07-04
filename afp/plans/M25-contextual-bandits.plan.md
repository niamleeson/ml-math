# Module Plan — M25 · Contextual bandits (explore/exploit)

| Field | Value |
|---|---|
| Domain | Domain 5 · Bandits & RL |
| Skip if you can already… | frame directive/variant selection as a bandit |
| Maps to (projects) | all |
| Primary structure(s) | S2 Method / Algorithm |
| Example type | ⚑ Both |
| Sub-lessons | 2 |
| Notebooks | 1 |

## Module hub (the "complete list")
Bandits are the lightest-weight online-learning tool for choosing among actions while learning from
feedback. This module makes explore/exploit, regret, ε-greedy, UCB, Thompson sampling, and LinUCB
answerable, then applies them to directive or variant selection and contrasts bandits with classic
A/B testing.

- M25.1 · Explore/exploit & bandit algorithms (ε-greedy, UCB, Thompson)
- M25.2 · Contextual bandits (LinUCB) & framing variant/directive selection

## Questions this module answers (→ which sub-lesson teaches the answer)
- What are explore/exploit and regret? → M25.1
- How do ε-greedy, UCB, and Thompson sampling differ? → M25.1
- What is a contextual bandit, and what does LinUCB add? → M25.2
- How do you frame variant/directive selection as a bandit? → M25.2
- How do you compute a UCB index / arm choice by hand? → M25.1
- Bandits vs A/B testing — when should you use each? → M25.2

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Explore/exploit tradeoff; stochastic arms; reward feedback
- Regret **ƒ**; cumulative reward; oracle best arm
- ε-greedy; decaying exploration
- UCB mean + confidence bonus **ƒ**
- Thompson sampling posterior sampling **ƒ**
- Contextual bandit; features/context, action, reward; LinUCB confidence score
- Bandit framing for directive/variant selection; bandit vs A/B testing

## Sub-lessons

### M25.1 · Explore/exploit & bandit algorithms (ε-greedy, UCB, Thompson)  —  [S2 Method, ⚑]
- **Makes answerable:** explore/exploit and regret; ε-greedy vs UCB vs Thompson; UCB index / arm choice by hand.
- **You'll be able to say:** "A bandit repeatedly chooses an arm, observes only that arm's reward, and balances exploiting the current best estimate with exploring uncertain arms. Regret is reward lost relative to the best arm. ε-greedy explores randomly, UCB chooses the arm with mean plus uncertainty bonus, and Thompson sampling samples from each arm's posterior and plays the sampled winner."
- **Concepts:** explore/exploit, regret **ƒ**, ε-greedy, UCB **ƒ**, Thompson sampling **ƒ**, Bernoulli rewards.
- **Key Idea focus:** step-by-step action selection under partial feedback.
- **Worked-example shape:** 10+5+5 process ramp — update arm means after rewards, compute UCB indices by hand, sample Beta posteriors conceptually, then read regret curves.
- **Notebook:** Yes — Bernoulli-bandit simulator comparing ε-greedy, UCB, and Thompson with regret curves; `assert` cumulative regret is nonnegative and UCB/Thompson usually beat pure random after enough rounds. Break case = nonstationary arm probabilities where old evidence misleads.
- **Real numbers to cite:** arm A mean `0.10` after `100` pulls vs arm B mean `0.14` after `4` pulls; UCB can choose B because its confidence bonus is larger despite fewer observations.

### M25.2 · Contextual bandits (LinUCB) & framing variant/directive selection  —  [S2 Method, ⚑]
- **Makes answerable:** contextual bandits and LinUCB; framing directive/variant selection; bandits vs A/B testing.
- **You'll be able to say:** "A contextual bandit observes features before choosing an action, so it can learn that different users/requests prefer different variants. LinUCB fits a linear reward model per arm and chooses predicted reward plus a confidence bonus. Use a bandit when traffic should shift adaptively during learning; use A/B testing when the goal is a clean fixed-policy causal estimate."
- **Concepts:** context/action/reward, LinUCB score, policy logging, propensities, directive/variant framing, bandit vs A/B testing.
- **Key Idea focus:** algorithm plus product framing: define context, eligible actions, reward, guardrails, logging, and stopping/rollback.
- **Worked-example shape:** 10+5+5 process ramp — turn prompt directive selection into `(context, arm, reward)`, compute a LinUCB score for two arms, then choose bandit or A/B for launch scenarios.
- **Notebook:** No — covered by M25.1 simulator; optional extension in the same notebook can add a two-feature LinUCB demo.
- **Real numbers to cite:** LinUCB score example: predicted CTR `0.08` + confidence `0.03` beats predicted CTR `0.10` + confidence `0.005` because `0.11 > 0.105`.

## Coverage check
All 6 module questions map to a sub-lesson: explore/exploit, regret, ε-greedy/UCB/Thompson, and UCB-by-hand → M25.1; contextual bandits, LinUCB, variant/directive framing, and bandit-vs-A/B → M25.2. No gaps.

## Decision guide
| Choice | Pick when | Tradeoff |
|---|---|---|
| ε-greedy | Need a simple baseline | Wastes fixed exploration traffic |
| UCB | Want optimism toward uncertain arms | Assumptions/bonus tuning matter |
| Thompson sampling | Want probabilistic exploration with natural uncertainty | Requires posterior/model choice |
| Contextual bandit / LinUCB | Treatment effect depends on request features | Needs good logging and online guardrails |
| A/B test | Need clean fixed-policy measurement | Does not adapt allocation while learning |

## Resources (from the guide)
- Bandit Algorithms (Lattimore & Szepesvári) (the rigorous reference)
- Vowpal Wabbit — contextual bandits tutorial (practical CB training)

## SOTA papers (from the guide)
- LinUCB — A Contextual-Bandit Approach to News Article Recommendation (Li et al., 2010)
- An Empirical Evaluation of Thompson Sampling (Chapelle & Li, 2011)

## Notes / caveats
- The notebook should be CPU-only numpy; no RL framework needed.
- Keep formulas to genuine bandit quantities: regret, UCB confidence bonus, and Thompson posterior sampling intuition.
