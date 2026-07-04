# Lesson Plan — 33 Markov Decision Processes & Q-learning

| Field | Value |
|---|---|
| Source | CS 221 |
| Content category | Concept+Method |
| Example type | ⚖️ Both |
| Colab notebook | Yes |
| Est. lesson time | 50–65 min |
| Source topic file | ../33-markov-decision-processes.md |

## Part 1 — Overview (plan)
MDPs extend search to worlds where actions have uncertain outcomes and rewards accumulate over time. Hook: "the best move is not the shortest move; it is the move with the best expected discounted reward."

## Part 2 — Key Idea (plan)
- **Focus (per category = Concept+Method):** define the MDP vocabulary, then give step-by-step methods for evaluating a policy, improving it, computing optimal values, and learning from sampled experience.
- **Core artifacts to present:** MDP 5/6-tuple $(s_{\text{start}}, \operatorname{Actions}, T, \operatorname{Reward}, \operatorname{IsEnd}, \gamma)$; transition-probability normalization; discounted utility $u=\sum_i \gamma^{i-1}r_i$; policy $\pi(s)$; Bellman expectation equation for $V_\pi$ and $Q_\pi$; Bellman optimality equations for $V_{\text{opt}}$ and $Q_{\text{opt}}$; policy evaluation pseudocode; value iteration and policy iteration loops; model-based and model-free Monte Carlo estimators; SARSA update; Q-learning update; epsilon-greedy exploration/exploitation rule.

## Part 3 — Worked Examples

### 🟢 Basics (3)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| B1 | Look up the immediate reward for one transition | toy MDP scalars: state `s`, action `go`, successor `s'` | printed transition/reward entry | ~2 |
| B2 | Compute one 2-step discounted return | toy rewards `r1=2`, `r2=4`, `γ=0.5` | printed values on a two-edge reward chain | ~2 |
| B3 | Pick the greedy action from one Q-value row | toy Q row for one state with actions `left`, `right`, `wait` | tiny action-value bar chart with argmax highlighted | ~2 |

### 🟡 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | Hand compute discounted utility on a 4-step path | tiny reward chain from the lesson figure | written timeline of $r_1,\gamma r_2,\gamma^2r_3,\gamma^3r_4$; no notebook-only viz | ~3 |
| E2 | One Bellman value-iteration sweep by hand | 4-cell deterministic gridworld with one terminal reward | hand table of $Q(s,a)$ candidates and first updated $V(s)$ values | ~5 |
| E3 | Policy evaluation for a fixed "always right if possible" policy | 4-cell gridworld | hand Bellman expectation equations plus first two sweeps | ~5 |
| E4 | Value iteration with heatmaps | `gridworld_small` with stochastic slip probability | process: value heatmap redrawn each sweep; result: final heatmap + policy arrows | ~8 |
| E5 | One Q-learning update from experience | single tuple $(s,a,r,s')$ from gridworld | process: Q-table cell before/target/after; result: annotated update equation | ~4 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | Value iteration vs. policy iteration at scale | `gridworld_lava` with terminal rewards and stochastic moves | process: value heatmaps per sweep/iteration; result: convergence curves + policy arrows | ~12 |
| A2 | Q-learning with epsilon-greedy exploration | same `gridworld_lava` with unknown transitions | process: reward-per-episode curve and visited-state heatmap; result: learned Q-derived policy arrows | ~12 |
| A3 | SARSA vs. Q-learning in a risky grid | cliff-walk style grid | process: episode paths and reward curves; result: safer SARSA policy vs. greedier Q-learning policy | ~10 |
| A4 | Failure case: $\gamma=1$ on a positive-reward cycle | 4-state cycle with no absorbing terminal on the loop | process: value heatmap/line plot grows each sweep; result: non-convergence diagnosis and fixed $\gamma<1$ comparison | ~8 |
| A5 | Model-based Monte Carlo from sampled transitions | simulated slippery grid logs | process: estimated transition table filling with counts; result: learned model's value heatmap vs. true-model heatmap | ~10 |

## Part 4 — Colab Notebook
- **Notebook file:** topics/notebooks/33-markov-decision-processes.ipynb
- **Est. cell count:** ~128 (⚖️ topic → 3 atomic basics plus tiny Bellman/Q-learning derivations and coded scalable gridworld experiments)
- **Key libraries:** numpy, matplotlib, pandas, seaborn, ipywidgets, collections (`defaultdict`)
- **Runtime:** CPU
- **Failure/edge dataset included:** `gamma_one_cycle` in A4 — value iteration does not converge when $\gamma=1$ and the MDP contains a positive-reward cycle; a discounted version shows the repair.
- **Signature visualizations:** value heatmap updating per sweep; final policy arrows over the grid; reward-per-episode and exploration heatmaps for Q-learning.
