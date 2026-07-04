# Module Plan — M26 · RL foundations + where RL fits ads

| Field | Value |
|---|---|
| Domain | Domain 5 · Bandits & RL |
| Skip if you can already… | state an MDP and explain bandit vs full-RL trade-offs |
| Maps to (projects) | Instream Ads perf, Event Ads perf |
| Primary structure(s) | S3 Formula / Theorem + S2 Method / Algorithm |
| Example type | ⚑ Both |
| Sub-lessons | 2 |
| Notebooks | 1 |

## Module hub (the "complete list")
Full RL is for sequential decisions where today's action changes tomorrow's state. This module makes
the MDP vocabulary, returns, value functions, Bellman equations, value/policy iteration, policy
gradients, and the bandit-vs-full-RL decision answerable, then grounds the tradeoff in ads pacing and
bidding.

- M26.1 · MDPs & value functions (Bellman, value iteration by hand)
- M26.2 · Policy gradients & where RL fits ads (bandit vs full RL)

## Questions this module answers (→ which sub-lesson teaches the answer)
- What is an MDP: states, actions, transition probabilities, rewards, and discount γ? → M26.1
- What are value functions V and Q, and what is the Bellman equation? → M26.1
- How do value iteration and policy iteration work? → M26.1
- What is policy gradient / REINFORCE? → M26.2
- When does a bandit suffice vs full RL? → M26.2
- Where does RL fit ads, such as pacing and bidding as sequential decisions? → M26.2
- How do you do one value-iteration sweep by hand? → M26.1

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- MDP tuple `(S, A, P, R, γ)`; trajectory; episode; horizon
- Return / discounted return **ƒ**
- Value function `Vπ(s)` and action-value `Qπ(s,a)`
- Bellman expectation and optimality equations **ƒ**
- Value iteration and policy iteration **ƒ**
- Policy gradient / REINFORCE **ƒ**
- Bandit vs full RL decision; delayed rewards, state transitions, credit assignment
- Ads as sequential control: pacing, bidding, budget state, auction feedback

## Sub-lessons

### M26.1 · MDPs & value functions (Bellman, value iteration by hand)  —  [S3 Formula + S2 Method, ⚑]
- **Makes answerable:** MDP definition; V, Q, Bellman equation; value iteration and policy iteration; one value-iteration sweep by hand.
- **You'll be able to say:** "An MDP defines states, actions, transition probabilities, rewards, and discount γ. `Vπ(s)` is expected discounted return from a state under a policy; `Qπ(s,a)` starts with an action. Bellman equations express value as immediate reward plus discounted next-state value, and value iteration repeatedly applies the optimality backup until values stabilize."
- **Concepts:** `(S,A,P,R,γ)`, return **ƒ**, V/Q, Bellman equations **ƒ**, value iteration **ƒ**, policy iteration **ƒ**.
- **Key Idea focus:** statement + honest derivation of the Bellman backup, then method steps for dynamic programming.
- **Worked-example shape:** 5 easy + 5 advanced pen-paper — compute discounted returns, evaluate one state's Bellman backup, run one value-iteration sweep on a 2-state MDP, then derive the greedy action.
- **Notebook:** Yes — tiny gridworld or 2-state budget MDP; implement value iteration; `assert` max Bellman residual decreases after repeated sweeps. Break case = γ too close to 1 with a positive reward loop, making convergence slow and values large.
- **Real numbers to cite:** with `γ=0.9`, immediate reward `2`, and next-state values `V(s')={10,0}` with probabilities `{0.8,0.2}`, backup is `2 + 0.9·8 = 9.2`.

### M26.2 · Policy gradients & where RL fits ads (bandit vs full RL)  —  [S2 Method, ⚑]
- **Makes answerable:** policy gradient/REINFORCE; when bandit suffices vs full RL; where RL fits ads as sequential pacing/bidding.
- **You'll be able to say:** "Policy gradients optimize a parameterized policy directly by increasing log-probability of actions that led to higher returns, often with a baseline to reduce variance. Use a bandit when an action affects only immediate reward and not future state; use full RL when actions change budget, inventory, user state, or future opportunity. Ads pacing and bidding are sequential because spending now changes remaining budget and later auction choices."
- **Concepts:** policy `πθ(a|s)`, REINFORCE gradient **ƒ**, baseline/advantage, bandit vs RL, pacing/bidding state, delayed rewards and guardrails.
- **Key Idea focus:** step-by-step policy-gradient update plus decision framing for ads systems.
- **Worked-example shape:** 10+5+5 process ramp — compute the sign of a REINFORCE update for one trajectory, classify scenarios as bandit or RL, and map an ads pacing MDP state/action/reward.
- **Notebook:** No — M26.1 notebook covers dynamic programming; policy-gradient math can be pen-paper or optional extension.
- **Real numbers to cite:** if an action log-prob gradient is positive and return-minus-baseline is `+3`, increase that action's probability; if advantage is `-2`, decrease it. Budget state example: spend $80 of $100 by noon changes the next bid decision.

## Coverage check
All 7 module questions map to a sub-lesson: MDP/V/Q/Bellman/value iteration/policy iteration/value-iteration sweep → M26.1; REINFORCE, bandit-vs-full-RL, and ads pacing/bidding fit → M26.2. No gaps.

## Decision guide
| Problem shape | Bandit is enough | Full RL is justified |
|---|---|---|
| State effect | Action does not materially change future state | Action changes future budget, eligibility, inventory, or user state |
| Reward timing | Mostly immediate reward | Delayed rewards and credit assignment matter |
| Complexity | Need fast, interpretable online learning | Need sequential planning/control under constraints |
| Ads example | Choose a creative/directive for this request | Pace budget or bid over the day under auction feedback |

## Resources (from the guide)
- OpenAI — Spinning Up in Deep RL (MDPs to policy gradients with code)
- Sutton & Barto — Reinforcement Learning (the foundational textbook)
- David Silver — RL course (DeepMind) (lectures on value/policy methods)

## SOTA papers (from the guide)
- Proximal Policy Optimization (Schulman et al., 2017)
- Playing Atari with Deep RL / DQN (Mnih et al., 2013/2015)
- Real-Time Bidding by Reinforcement Learning in Display Advertising (Cai et al., 2017)

## Notes / caveats
- **Overlaps the concurrent `topics/33-markov-decision-processes.md` curriculum.** Reference that topic for a deeper MDP treatment; keep M26 ads-framed and decision-oriented.
- Keep genuine math: return, Bellman backups, dynamic programming updates, and policy gradient. Do not force extra formulas into the ads discussion.
