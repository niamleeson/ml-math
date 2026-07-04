# Markov Decision Processes & Q-learning
> **Source:** CS 221 · **Category:** Concept+Method · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an `.ipynb` will be generated. [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](#)

## 1. Overview

A Markov decision process (MDP) models sequential decisions when actions are uncertain and rewards accumulate over time. It extends deterministic search: an agent no longer asks only “which path reaches the goal?” but “which policy maximizes expected discounted reward?”

**One-line intuition:** the best move is not always the shortest move; it is the move with the best expected future payoff after accounting for randomness, rewards, and discounting.

MDPs are also the mathematical bridge to reinforcement learning. If transition probabilities and rewards are known, dynamic programming methods such as policy evaluation, value iteration, and policy iteration solve the decision problem. If the model is unknown, sampled experience can drive Monte Carlo learning, SARSA, and Q-learning.

## 2. Key Idea

An MDP is defined by

$$
\left(s_{\text{start}}, \operatorname{Actions}, T, \operatorname{Reward}, \operatorname{IsEnd}, \gamma\right).
$$

The pieces are:

- $s_{\text{start}}$: the starting state.
- $\operatorname{Actions}(s)$: the legal actions from state $s$.
- $T(s,a,s')$: the probability of moving to $s'$ after taking action $a$ in state $s$.
- $\operatorname{Reward}(s,a,s')$: the immediate reward for transition $s\xrightarrow{a}s'$.
- $\operatorname{IsEnd}(s)$: whether $s$ is terminal.
- $\gamma\in[0,1]$: the discount factor.

For each state-action pair, successors form a probability distribution:

$$
\forall s,a,\quad \sum_{s'\in\operatorname{States}}T(s,a,s')=1.
$$

A policy is a state-to-action map:

$$
\pi:s\mapsto a.
$$

The utility of a path is the discounted reward sum

$$
u(s_0,\ldots,s_k)=\sum_{i=1}^{k}\gamma^{i-1}r_i.
$$

For a fixed policy $\pi$, the action-value function is

$$
Q_{\pi}(s,a)=\sum_{s'\in\operatorname{States}}T(s,a,s')\left[\operatorname{Reward}(s,a,s')+\gamma V_{\pi}(s')\right],
$$

and the state-value function is

$$
V_{\pi}(s)=Q_{\pi}(s,\pi(s)).
$$

For an end state, $V_{\pi}(s)=0$. Substituting $a=\pi(s)$ gives the Bellman expectation equation:

$$
V_{\pi}(s)=\sum_{s'\in\operatorname{States}}T(s,\pi(s),s')\left[\operatorname{Reward}(s,\pi(s),s')+\gamma V_{\pi}(s')\right].
$$

For optimal control, the optimal Q-value is

$$
Q_{\text{opt}}(s,a)=\sum_{s'\in\operatorname{States}}T(s,a,s')\left[\operatorname{Reward}(s,a,s')+\gamma V_{\text{opt}}(s')\right],
$$

the optimal value is

$$
V_{\text{opt}}(s)=\max_{a\in\operatorname{Actions}(s)}Q_{\text{opt}}(s,a),
$$

and the optimal policy is

$$
\forall s,\quad \pi_{\text{opt}}(s)=\operatorname*{argmax}_{a\in\operatorname{Actions}(s)}Q_{\text{opt}}(s,a).
$$

**Policy evaluation.**

```text
Initialize V_pi^(0)(s) <- 0 for all states s
For t = 1, ..., T_PE:
    For every terminal state s:
        V_pi^(t)(s) <- 0
    For every non-terminal state s:
        V_pi^(t)(s) <- sum over s' of T(s, pi(s), s') [Reward(s, pi(s), s') + gamma V_pi^(t-1)(s')]
Return V_pi
```

Equivalently,

$$
\forall s,\quad V_{\pi}^{(t)}(s)\leftarrow Q_{\pi}^{(t-1)}(s,\pi(s))
$$

with

$$
Q_{\pi}^{(t-1)}(s,\pi(s))=\sum_{s'\in\operatorname{States}}T(s,\pi(s),s')\left[\operatorname{Reward}(s,\pi(s),s')+\gamma V_{\pi}^{(t-1)}(s')\right].
$$

If $S$ is the number of states, $S'$ is the number of successors per state-action pair, and $T_{\text{PE}}$ is the number of sweeps, policy evaluation costs $O(T_{\text{PE}}SS')$.

**Value iteration.**

```text
Initialize V_opt^(0)(s) <- 0 for all states s
For t = 1, ..., T_VI:
    For every terminal state s:
        V_opt^(t)(s) <- 0
    For every non-terminal state s:
        For every action a in Actions(s):
            Q_opt^(t-1)(s,a) <- sum over s' of T(s,a,s') [Reward(s,a,s') + gamma V_opt^(t-1)(s')]
        V_opt^(t)(s) <- max_a Q_opt^(t-1)(s,a)
Return V_opt and pi_opt(s) = argmax_a Q_opt(s,a)
```

The exact update is

$$
\forall s,\quad V_{\text{opt}}^{(t)}(s)\leftarrow \max_{a\in\operatorname{Actions}(s)}Q_{\text{opt}}^{(t-1)}(s,a),
$$

where

$$
Q_{\text{opt}}^{(t-1)}(s,a)=\sum_{s'\in\operatorname{States}}T(s,a,s')\left[\operatorname{Reward}(s,a,s')+\gamma V_{\text{opt}}^{(t-1)}(s')\right].
$$

If $\gamma<1$, or if the MDP graph is acyclic, value iteration is guaranteed to converge to the correct answer.

**Policy iteration.**

```text
Initialize pi arbitrarily
Repeat until pi stops changing:
    Policy evaluation:
        compute V_pi for the current pi
    Policy improvement:
        pi_new(s) <- argmax_a sum over s' of T(s,a,s') [Reward(s,a,s') + gamma V_pi(s')]
    pi <- pi_new
Return pi and V_pi
```

When $T$ and $\operatorname{Reward}$ are unknown, learning replaces direct planning.

**Model-based Monte Carlo** estimates the model:

$$
\widehat{T}(s,a,s')=\frac{\#\text{ times }(s,a,s')\text{ occurs}}{\#\text{ times }(s,a)\text{ occurs}},
$$

and

$$
\widehat{\operatorname{Reward}}(s,a,s')=r\text{ in }(s,a,r,s').
$$

**Model-free Monte Carlo** estimates returns directly:

$$
\widehat{Q}_{\pi}(s,a)=\text{average of }u_t\text{ where }s_{t-1}=s,\ a_t=a.
$$

With

$$
\eta=\frac{1}{1+\#\{\text{updates to }(s,a)\}},
$$

the incremental form is

$$
\widehat{Q}_{\pi}(s,a)\leftarrow(1-\eta)\widehat{Q}_{\pi}(s,a)+\eta u,
$$

or

$$
\widehat{Q}_{\pi}(s,a)\leftarrow\widehat{Q}_{\pi}(s,a)-\eta\left(\widehat{Q}_{\pi}(s,a)-u\right).
$$

**SARSA** uses the sampled next action:

$$
\widehat{Q}_{\pi}(s,a)\leftarrow(1-\eta)\widehat{Q}_{\pi}(s,a)+\eta\left[r+\gamma\widehat{Q}_{\pi}(s',a')\right].
$$

**Q-learning** uses the greedy next action value:

$$
\widehat{Q}_{\text{opt}}(s,a)\leftarrow(1-\eta)\widehat{Q}_{\text{opt}}(s,a)+\eta\left[r+\gamma\max_{a'\in\operatorname{Actions}(s')}\widehat{Q}_{\text{opt}}(s',a')\right].
$$

**Epsilon-greedy** chooses between exploration and exploitation:

$$
\pi_{\text{act}}(s)=
\begin{cases}
\operatorname*{argmax}_{a\in\operatorname{Actions}}\widehat{Q}_{\text{opt}}(s,a) & \text{with proba }1-\epsilon\\
\text{random from }\operatorname{Actions}(s) & \text{with proba }\epsilon.
\end{cases}
$$

## 3. Worked Examples

### 🟢 Easy

### E1. Hand compute discounted utility on a 4-step path

**Problem.** A path has rewards

$$
r_1=5,\qquad r_2=-2,\qquad r_3=3,\qquad r_4=10
$$

and discount factor $\gamma=0.8$. Compute

$$
u(s_0,s_1,s_2,s_3,s_4)=\sum_{i=1}^{4}\gamma^{i-1}r_i.
$$

**Step-by-step solution.** Write the discounted utility:

$$
u=r_1+\gamma r_2+\gamma^2r_3+\gamma^3r_4.
$$

Substitute the numbers:

$$
u=5+(0.8)(-2)+(0.8)^2(3)+(0.8)^3(10).
$$

Compute discount powers:

$$
(0.8)^2=0.64,\qquad (0.8)^3=0.512.
$$

Compute each term:

$$
5=5,\qquad (0.8)(-2)=-1.6,\qquad (0.64)(3)=1.92,\qquad (0.512)(10)=5.12.
$$

Add:

$$
u=5-1.6+1.92+5.12.
$$

Combine left to right:

$$
5-1.6=3.4,\qquad 3.4+1.92=5.32,\qquad 5.32+5.12=10.44.
$$

**Boxed answer.**

$$
\boxed{u=10.44.}
$$

---

### E2. One Bellman value-iteration sweep by hand

**Problem.** Consider a deterministic line grid

$$
A\;--\;B\;--\;C\;--\;G,
$$

where $G$ is terminal. Actions are Left and Right; moving left from $A$ keeps the agent at $A$. Ordinary moves have reward $-1$, entering $G$ has reward $+10$, $\gamma=0.9$, and

$$
V^{(0)}(A)=V^{(0)}(B)=V^{(0)}(C)=V^{(0)}(G)=0.
$$

Compute one value-iteration sweep.

**Step-by-step solution.** The update is

$$
V^{(1)}(s)=\max_a\sum_{s'}T(s,a,s')\left[\operatorname{Reward}(s,a,s')+\gamma V^{(0)}(s')\right].
$$

Transitions are deterministic, so each $Q$ candidate is immediate reward plus discounted old successor value.

For $A$:

$$
Q^{(0)}(A,\text{Left})=-1+0.9V^{(0)}(A)=-1+0=-1,
$$

$$
Q^{(0)}(A,\text{Right})=-1+0.9V^{(0)}(B)=-1+0=-1.
$$

Therefore

$$
V^{(1)}(A)=\max\{-1,-1\}=-1.
$$

For $B$:

$$
Q^{(0)}(B,\text{Left})=-1+0.9V^{(0)}(A)=-1,
$$

$$
Q^{(0)}(B,\text{Right})=-1+0.9V^{(0)}(C)=-1.
$$

Thus

$$
V^{(1)}(B)=\max\{-1,-1\}=-1.
$$

For $C$:

$$
Q^{(0)}(C,\text{Left})=-1+0.9V^{(0)}(B)=-1,
$$

$$
Q^{(0)}(C,\text{Right})=10+0.9V^{(0)}(G)=10.
$$

Thus

$$
V^{(1)}(C)=\max\{-1,10\}=10.
$$

For terminal $G$:

$$
V^{(1)}(G)=0.
$$

**Boxed answer.**

$$
\boxed{V^{(1)}(A)=-1,\quad V^{(1)}(B)=-1,\quad V^{(1)}(C)=10,\quad V^{(1)}(G)=0.}
$$

---

### E3. Policy evaluation for a fixed "always right if possible" policy

**Problem.** In the same line grid, evaluate

$$
\pi(A)=\text{Right},\qquad \pi(B)=\text{Right},\qquad \pi(C)=\text{Right}.
$$

Write the Bellman equations and compute the first two policy-evaluation sweeps from zero.

**Step-by-step solution.** The Bellman expectation equation is

$$
V_\pi(s)=\sum_{s'}T(s,\pi(s),s')\left[\operatorname{Reward}(s,\pi(s),s')+\gamma V_\pi(s')\right].
$$

Because the policy always moves right:

$$
V_\pi(A)=-1+0.9V_\pi(B),
$$

$$
V_\pi(B)=-1+0.9V_\pi(C),
$$

$$
V_\pi(C)=10+0.9V_\pi(G),
$$

and

$$
V_\pi(G)=0.
$$

Initialize $V^{(0)}=0$.

Sweep 1:

$$
V^{(1)}(A)=-1+0.9V^{(0)}(B)=-1,
$$

$$
V^{(1)}(B)=-1+0.9V^{(0)}(C)=-1,
$$

$$
V^{(1)}(C)=10+0.9V^{(0)}(G)=10,
$$

$$
V^{(1)}(G)=0.
$$

Sweep 2:

$$
V^{(2)}(A)=-1+0.9V^{(1)}(B)=-1+0.9(-1)=-1.9,
$$

$$
V^{(2)}(B)=-1+0.9V^{(1)}(C)=-1+0.9(10)=8,
$$

$$
V^{(2)}(C)=10+0.9V^{(1)}(G)=10,
$$

$$
V^{(2)}(G)=0.
$$

The exact values can be solved backward:

$$
V_\pi(C)=10,\qquad V_\pi(B)=-1+0.9(10)=8,
$$

$$
V_\pi(A)=-1+0.9(8)=6.2.
$$

**Boxed answer.**

$$
\boxed{V^{(1)}=(-1,-1,10,0),\quad V^{(2)}=(-1.9,8,10,0),\quad V_\pi=(6.2,8,10,0).}
$$

### (For coded examples) Setup

The following cells run top-to-bottom. They implement value iteration, policy iteration, SARSA, and Q-learning from scratch on tabular gridworlds.

```python
import numpy as np  # Import NumPy for arrays, random sampling, and numeric operations.
import matplotlib.pyplot as plt  # Import Matplotlib for heatmaps, arrows, and curves.
try:  # Try to import Seaborn for polished heatmap styling.
    import seaborn as sns  # Import Seaborn when it is available.
except Exception:  # Fall back gracefully if Seaborn is missing.
    class _MiniSeaborn:  # Define a tiny heatmap-compatible fallback.
        def set_theme(self, style="whitegrid"):  # Accept the same theme call used below.
            plt.rcParams.update({"axes.grid": True})  # Enable a simple grid style.
        def heatmap(self, data, annot=True, fmt=".2f", cmap="viridis", linewidths=1, linecolor="black", cbar=True, ax=None):  # Mimic the Seaborn heatmap call used here.
            ax = plt.gca() if ax is None else ax  # Use the current axes when none are supplied.
            image = ax.imshow(data, cmap=cmap)  # Draw the numeric array as an image.
            if cbar:  # Add a colorbar when requested.
                plt.colorbar(image, ax=ax)  # Attach a colorbar to the axes.
            if annot:  # Add numeric annotations when requested.
                for row in range(data.shape[0]):  # Iterate over rows.
                    for col in range(data.shape[1]):  # Iterate over columns.
                        if not np.isnan(data[row, col]):  # Skip NaN wall cells.
                            ax.text(col, row, format(data[row, col], fmt), ha="center", va="center", color="white")  # Draw the annotation.
            return ax  # Return the axes for compatibility.
    sns = _MiniSeaborn()  # Use the fallback object under the usual sns name.
from collections import defaultdict, Counter  # Import sparse dictionaries and counting utilities.

np.random.seed(7)  # Seed the random number generator for reproducible episodes.
sns.set_theme(style="whitegrid")  # Use a readable plotting style throughout the notebook.

ACTIONS = ["U", "D", "L", "R"]  # Define the four available grid actions.
DELTAS = {"U": (-1, 0), "D": (1, 0), "L": (0, -1), "R": (0, 1)}  # Convert each action to a grid displacement.
ARROWS = {"U": "↑", "D": "↓", "L": "←", "R": "→"}  # Convert each action to an arrow for plots.

class GridWorld:  # Define a small finite MDP class.
    def __init__(self, shape, start, terminals, walls=None, default_reward=-0.04, slip=0.0):  # Initialize one gridworld.
        self.n_rows, self.n_cols = shape  # Store the rectangular grid dimensions.
        self.start = tuple(start)  # Store the start coordinate.
        self.terminals = {tuple(s): float(r) for s, r in terminals.items()}  # Store terminal rewards by coordinate.
        self.walls = set(tuple(w) for w in (walls or []))  # Store impassable wall coordinates.
        self.default_reward = float(default_reward)  # Store the reward for ordinary transitions.
        self.slip = float(slip)  # Store the probability of slipping sideways.
        self.states = [(r, c) for r in range(self.n_rows) for c in range(self.n_cols) if (r, c) not in self.walls]  # Enumerate all legal states.
    def is_terminal(self, state):  # Test whether a coordinate is terminal.
        return tuple(state) in self.terminals  # Return True only for terminal coordinates.
    def actions(self, state):  # Return legal actions for a state.
        return [] if self.is_terminal(state) else list(ACTIONS)  # Terminal states have no actions.
    def move(self, state, action):  # Apply a deterministic grid move.
        dr, dc = DELTAS[action]  # Look up the action displacement.
        nr, nc = state[0] + dr, state[1] + dc  # Compute the candidate next coordinate.
        blocked = nr < 0 or nr >= self.n_rows or nc < 0 or nc >= self.n_cols or (nr, nc) in self.walls  # Detect walls and boundaries.
        return tuple(state) if blocked else (nr, nc)  # Bounce back when blocked and otherwise move.
    def outcomes(self, state, action):  # Return all stochastic outcomes for a state-action pair.
        if self.is_terminal(state):  # Handle terminal states explicitly.
            return [(1.0, tuple(state), 0.0)]  # Terminal states have zero continuation reward.
        sides = {"U": ["L", "R"], "D": ["L", "R"], "L": ["U", "D"], "R": ["U", "D"]}[action]  # Identify perpendicular slip actions.
        raw = [(1.0 - self.slip, action), (self.slip / 2.0, sides[0]), (self.slip / 2.0, sides[1])]  # Build intended and slipped action probabilities.
        probs = defaultdict(float)  # Merge outcomes that land in the same state.
        rewards = {}  # Store the reward for each successor state.
        for prob, actual in raw:  # Iterate over stochastic action realizations.
            next_state = self.move(state, actual)  # Compute the successor under the realized action.
            reward = self.terminals.get(next_state, self.default_reward)  # Use terminal reward on entry or the default step reward.
            probs[next_state] += prob  # Add probability mass for this successor.
            rewards[next_state] = reward  # Record the immediate reward for this successor.
        return [(prob, next_state, rewards[next_state]) for next_state, prob in probs.items()]  # Return probability-state-reward triples.
    def sample_step(self, state, action):  # Sample one transition from the MDP.
        outcomes = self.outcomes(state, action)  # List possible transition outcomes.
        p = np.array([item[0] for item in outcomes], dtype=float)  # Extract probabilities into an array.
        idx = np.random.choice(len(outcomes), p=p)  # Draw a random outcome index.
        prob, next_state, reward = outcomes[idx]  # Unpack the selected outcome.
        return next_state, reward, self.is_terminal(next_state)  # Return next state, reward, and done flag.

def value_array(env, V):  # Convert a value dictionary into a grid-shaped array.
    arr = np.full((env.n_rows, env.n_cols), np.nan)  # Initialize walls as NaN so they plot as blank.
    for state in env.states:  # Visit every legal state.
        arr[state] = V.get(state, 0.0)  # Insert the state's value or zero if missing.
    return arr  # Return the array for plotting.

def backup(env, V, state, action, gamma):  # Compute one Bellman action backup.
    return sum(prob * (reward + gamma * V.get(next_state, 0.0)) for prob, next_state, reward in env.outcomes(state, action))  # Average reward plus discounted continuation.

def greedy_policy(env, V, gamma):  # Extract a greedy policy from state values.
    policy = {}  # Allocate the policy dictionary.
    for state in env.states:  # Iterate over all legal states.
        if env.is_terminal(state):  # Skip terminal states.
            continue  # Continue without assigning an action.
        qs = [backup(env, V, state, action, gamma) for action in env.actions(state)]  # Compute one-step action values.
        policy[state] = env.actions(state)[int(np.argmax(qs))]  # Store the best action.
    return policy  # Return the greedy policy.

def q_policy(env, Q):  # Extract a greedy policy from a Q-table.
    policy = {}  # Allocate the policy dictionary.
    for state in env.states:  # Visit every legal state.
        if env.is_terminal(state):  # Skip terminal states.
            continue  # Continue without assigning an action.
        qs = [Q[(state, action)] for action in env.actions(state)]  # Read action values.
        policy[state] = env.actions(state)[int(np.argmax(qs))]  # Choose the largest action value.
    return policy  # Return the Q-greedy policy.

def plot_values_policy(env, V, policy=None, title="Value heatmap", cmap="viridis"):  # Plot a value heatmap with optional policy arrows.
    arr = value_array(env, V)  # Convert values to a rectangular array.
    fig, ax = plt.subplots(figsize=(1.45 * env.n_cols, 1.25 * env.n_rows))  # Create a size matched to the grid.
    sns.heatmap(arr, annot=True, fmt=".2f", cmap=cmap, linewidths=1, linecolor="black", cbar=True, ax=ax)  # Draw the heatmap.
    for wall in env.walls:  # Draw every wall.
        ax.add_patch(plt.Rectangle((wall[1], wall[0]), 1, 1, color="dimgray"))  # Overlay a gray wall square.
    if policy is not None:  # Draw arrows only if a policy was supplied.
        for (r, c), action in policy.items():  # Iterate over state-action entries.
            ax.text(c + 0.5, r + 0.72, ARROWS[action], ha="center", va="center", color="white", fontsize=18, weight="bold")  # Place the arrow in the cell.
    for (r, c), reward in env.terminals.items():  # Label each terminal state.
        ax.text(c + 0.5, r + 0.25, f"T={reward:g}", ha="center", va="center", color="white", fontsize=10, weight="bold")  # Draw terminal reward text.
    ax.set_title(title)  # Add a descriptive title.
    ax.set_xlabel("column")  # Label columns.
    ax.set_ylabel("row")  # Label rows.
    plt.show()  # Render the figure.

def plot_curve(y, title, ylabel):  # Plot a diagnostic curve.
    fig, ax = plt.subplots(figsize=(7, 3.2))  # Create a compact figure.
    ax.plot(y, linewidth=2)  # Plot the provided values.
    ax.set_title(title)  # Add a title.
    ax.set_xlabel("iteration or episode")  # Label the horizontal axis.
    ax.set_ylabel(ylabel)  # Label the vertical axis.
    ax.grid(True, alpha=0.3)  # Add a light grid.
    plt.show()  # Render the curve.

def value_iteration(env, gamma=0.95, sweeps=20, plot_each=False, title_prefix="VI"):  # Implement value iteration from scratch.
    V = {state: 0.0 for state in env.states}  # Initialize all values to zero.
    deltas = []  # Store the largest value change per sweep.
    snapshots = []  # Store value snapshots for redraws.
    for sweep in range(sweeps):  # Repeat Bellman optimality sweeps.
        old = V.copy()  # Freeze previous values for synchronous updates.
        delta = 0.0  # Reset the convergence diagnostic.
        for state in env.states:  # Update every state.
            if env.is_terminal(state):  # Keep terminal values fixed.
                V[state] = 0.0  # Assign zero continuation value.
                continue  # Skip action maximization.
            qs = [backup(env, old, state, action, gamma) for action in env.actions(state)]  # Compute action candidates.
            V[state] = float(np.max(qs))  # Store the optimal Bellman backup.
            delta = max(delta, abs(V[state] - old[state]))  # Track the maximum absolute change.
        deltas.append(delta)  # Save this sweep's change.
        snapshots.append(V.copy())  # Save this sweep's values.
        if plot_each:  # Optionally redraw after every sweep.
            plot_values_policy(env, V, greedy_policy(env, V, gamma), f"{title_prefix} sweep {sweep + 1}")  # Plot current values and arrows.
    return V, greedy_policy(env, V, gamma), deltas, snapshots  # Return values, policy, convergence history, and snapshots.

def evaluate_policy(env, policy, gamma=0.95, sweeps=30):  # Evaluate a fixed policy.
    V = {state: 0.0 for state in env.states}  # Initialize values to zero.
    for sweep in range(sweeps):  # Repeat Bellman expectation sweeps.
        old = V.copy()  # Freeze previous values.
        for state in env.states:  # Visit each state.
            if env.is_terminal(state):  # Handle terminals.
                V[state] = 0.0  # Keep terminal continuation value at zero.
            else:  # Handle non-terminals.
                V[state] = backup(env, old, state, policy[state], gamma)  # Apply the policy's action backup.
    return V  # Return evaluated values.

def policy_iteration(env, gamma=0.95, iterations=10, eval_sweeps=30, plot_each=False):  # Implement policy iteration.
    policy = {state: "R" for state in env.states if not env.is_terminal(state)}  # Start from an arbitrary right policy.
    V = {state: 0.0 for state in env.states}  # Initialize values.
    changes = []  # Track policy changes.
    for iteration in range(iterations):  # Repeat evaluate-improve cycles.
        V = evaluate_policy(env, policy, gamma, eval_sweeps)  # Evaluate the current policy.
        new_policy = greedy_policy(env, V, gamma)  # Improve greedily.
        changed = sum(policy.get(s) != new_policy.get(s) for s in new_policy)  # Count changed state actions.
        changes.append(changed)  # Save the count.
        policy = new_policy  # Adopt the improved policy.
        if plot_each:  # Optionally redraw each improvement.
            plot_values_policy(env, V, policy, f"Policy iteration improvement {iteration + 1}")  # Plot current policy.
        if changed == 0:  # Stop when the policy is stable.
            break  # Exit the loop.
    return V, policy, changes  # Return values, policy, and changes.

def epsilon_greedy(env, Q, state, epsilon):  # Choose an epsilon-greedy action.
    actions = env.actions(state)  # Read legal actions.
    if np.random.rand() < epsilon:  # Explore with probability epsilon.
        return actions[int(np.random.choice(len(actions)))]  # Return a random legal action.
    qs = [Q[(state, action)] for action in actions]  # Read Q-values.
    return actions[int(np.argmax(qs))]  # Return a greedy action.

def run_q_learning(env, episodes=300, alpha=0.2, gamma=0.95, epsilon=0.1, max_steps=100, plot_every=0):  # Implement Q-learning.
    Q = defaultdict(float)  # Initialize unseen Q-values to zero.
    rewards = []  # Store total reward per episode.
    visits = Counter()  # Count state visits.
    snapshots = []  # Store optional value snapshots.
    for episode in range(episodes):  # Loop over episodes.
        state = env.start  # Reset the start state.
        total = 0.0  # Reset episode reward.
        for step in range(max_steps):  # Limit trajectory length.
            visits[state] += 1  # Count the visit.
            action = epsilon_greedy(env, Q, state, epsilon)  # Select an action.
            next_state, reward, done = env.sample_step(state, action)  # Sample a transition.
            next_best = 0.0 if done else max(Q[(next_state, a)] for a in env.actions(next_state))  # Compute off-policy greedy continuation.
            target = reward + gamma * next_best  # Build the Q-learning target.
            Q[(state, action)] = (1 - alpha) * Q[(state, action)] + alpha * target  # Update the selected Q-value.
            total += reward  # Accumulate reward.
            state = next_state  # Advance to the next state.
            if done:  # Stop at terminal states.
                break  # End the episode.
        rewards.append(total)  # Store episode reward.
        if plot_every and (episode + 1) % plot_every == 0:  # Redraw on requested episodes.
            V_now = {s: (0.0 if env.is_terminal(s) else max(Q[(s, a)] for a in env.actions(s))) for s in env.states}  # Convert Q to V.
            snapshots.append(V_now.copy())  # Store the snapshot.
            plot_values_policy(env, V_now, q_policy(env, Q), f"Q-learning after episode {episode + 1}")  # Plot current learning state.
    return Q, rewards, visits, snapshots  # Return learned Q-values and diagnostics.

def run_sarsa(env, episodes=300, alpha=0.2, gamma=0.95, epsilon=0.1, max_steps=100):  # Implement SARSA.
    Q = defaultdict(float)  # Initialize unseen Q-values to zero.
    rewards = []  # Store total reward per episode.
    paths = []  # Store visited paths.
    for episode in range(episodes):  # Loop over episodes.
        state = env.start  # Reset start state.
        action = epsilon_greedy(env, Q, state, epsilon)  # Select initial behavior action.
        total = 0.0  # Reset total reward.
        path = [state]  # Start the path trace.
        for step in range(max_steps):  # Limit trajectory length.
            next_state, reward, done = env.sample_step(state, action)  # Sample a transition.
            next_action = None if done else epsilon_greedy(env, Q, next_state, epsilon)  # Select the next behavior action.
            continuation = 0.0 if done else Q[(next_state, next_action)]  # Use the on-policy next-action value.
            target = reward + gamma * continuation  # Build the SARSA target.
            Q[(state, action)] = (1 - alpha) * Q[(state, action)] + alpha * target  # Update the selected Q-value.
            total += reward  # Accumulate reward.
            state = next_state  # Advance state.
            action = next_action if next_action is not None else action  # Advance action when not terminal.
            path.append(state)  # Record the next state.
            if done:  # Stop if terminal.
                break  # End the episode.
        rewards.append(total)  # Store episode reward.
        paths.append(path)  # Store episode path.
    return Q, rewards, paths  # Return learned Q-values and diagnostics.
```

### Data — swappable gridworlds

```python
gridworld_small = GridWorld(shape=(3, 4), start=(2, 0), terminals={(0, 3): 1.0, (1, 3): -1.0}, walls=[(1, 1)], default_reward=-0.04, slip=0.20)  # Create the small stochastic gridworld.
gridworld_lava = GridWorld(shape=(5, 6), start=(4, 0), terminals={(0, 5): 2.0, (3, 4): -2.0}, walls=[(1, 1), (1, 2), (2, 2), (3, 1)], default_reward=-0.03, slip=0.15)  # Create the larger lava gridworld.
cliff_grid = GridWorld(shape=(4, 6), start=(3, 0), terminals={(3, 5): 1.0, (3, 1): -5.0, (3, 2): -5.0, (3, 3): -5.0, (3, 4): -5.0}, walls=[], default_reward=-0.02, slip=0.10)  # Create the risky cliff-walk gridworld.
DATA_SOURCE = "small"  # Choose "small", "lava", or "cliff" as the active gridworld.
active_env = {"small": gridworld_small, "lava": gridworld_lava, "cliff": cliff_grid}[DATA_SOURCE]  # Select the requested gridworld.
zero_values = {state: 0.0 for state in active_env.states}  # Create an all-zero value function.
plot_values_policy(active_env, zero_values, title=f"Initial values for DATA_SOURCE={DATA_SOURCE}")  # Visualize the selected MDP.
```

▶ What you'll see: a value heatmap with zeros in all non-wall states, dark wall cells, and terminal labels for the rewarding or punishing absorbing states.

👀 **Takeaway:** once the gridworld exposes states, actions, outcomes, and samples, all planning and learning algorithms can share the same interface.

---

### E4. Value iteration with heatmaps

We solve `gridworld_small` with exact value iteration by slowing the algorithm down into a build↔see loop: initialize values, inspect one Bellman backup, run one full sweep, continue to convergence, then extract arrows.

```python
gamma = 0.95  # Set the discount factor for this value-iteration example.
V_e4 = {state: 0.0 for state in gridworld_small.states}  # Initialize every state value to zero.
e4_sweep_snapshots = []  # Prepare a list that will store value functions after sweeps.
e4_deltas = []  # Prepare a list that will store maximum changes per sweep.
plot_values_policy(gridworld_small, V_e4, title="E4 step (a): initial V=0 heatmap")  # Draw the initial all-zero value heatmap.
```

▶ What you'll see: all non-wall cells start at $0$, while terminal labels mark the $+1$ and $-1$ absorbing outcomes.

```python
probe_state = (2, 0)  # Choose the start-adjacent lower-left state as one concrete Bellman-backup example.
probe_action_values = {}  # Allocate a dictionary for action-value candidates at the probe state.
for action in gridworld_small.actions(probe_state):  # Evaluate each action available at the probe state.
    q_value = backup(gridworld_small, V_e4, probe_state, action, gamma)  # Compute reward plus discounted old successor values.
    probe_action_values[action] = q_value  # Store the candidate value for this action.
    print(f"Q({probe_state}, {action}) = {q_value:.4f}")  # Print the numeric Bellman candidate.
best_probe_action = max(probe_action_values, key=probe_action_values.get)  # Identify the action with the largest candidate value.
print(f"Bellman backup V_new{probe_state} = max_a Q(s,a) = {probe_action_values[best_probe_action]:.4f} using action {best_probe_action}")  # Print the selected backup.
```

▶ What you'll see: four printed $Q(s,a)$ candidates for one state. Because all old values are zero, each candidate is mainly the expected immediate reward.

```python
old_V_e4 = V_e4.copy()  # Freeze the zero values so the first sweep is synchronous.
for state in gridworld_small.states:  # Visit every non-wall state in the gridworld.
    if gridworld_small.is_terminal(state):  # Check whether the state is terminal.
        V_e4[state] = 0.0  # Keep terminal continuation value equal to zero.
        continue  # Skip action maximization for terminal states.
    q_candidates = [backup(gridworld_small, old_V_e4, state, action, gamma) for action in gridworld_small.actions(state)]  # Compute all action candidates from old values.
    V_e4[state] = float(np.max(q_candidates))  # Store the Bellman optimality backup.
first_delta_e4 = max(abs(V_e4[state] - old_V_e4[state]) for state in gridworld_small.states)  # Measure the biggest first-sweep change.
e4_deltas.append(first_delta_e4)  # Save the first-sweep convergence diagnostic.
e4_sweep_snapshots.append(V_e4.copy())  # Save the first value snapshot.
plot_values_policy(gridworld_small, V_e4, greedy_policy(gridworld_small, V_e4, gamma), title="E4 step (c): after one full value-iteration sweep")  # Redraw values after one sweep.
print(f"first-sweep max change = {first_delta_e4:.4f}")  # Print the first-sweep change.
```

▶ What you'll see: the cell near the good terminal becomes positive, the cell near the bad terminal becomes cautious, and arrows show the one-sweep greedy lookahead.

```python
for sweep in range(2, 13):  # Continue sweeps two through twelve.
    old_V_e4 = V_e4.copy()  # Freeze the previous sweep's values.
    for state in gridworld_small.states:  # Visit every legal state.
        if gridworld_small.is_terminal(state):  # Check for terminal states.
            V_e4[state] = 0.0  # Keep terminal continuation value zero.
            continue  # Skip terminal action backups.
        q_candidates = [backup(gridworld_small, old_V_e4, state, action, gamma) for action in gridworld_small.actions(state)]  # Compute Bellman candidates.
        V_e4[state] = float(np.max(q_candidates))  # Store the best candidate.
    delta = max(abs(V_e4[state] - old_V_e4[state]) for state in gridworld_small.states)  # Compute the largest value change.
    e4_deltas.append(delta)  # Save the convergence diagnostic.
    e4_sweep_snapshots.append(V_e4.copy())  # Save the current value snapshot.
    if sweep in [2, 4, 8, 12]:  # Redraw only representative sweeps to keep the notebook readable.
        plot_values_policy(gridworld_small, V_e4, greedy_policy(gridworld_small, V_e4, gamma), title=f"E4 step (d): value propagation after sweep {sweep}")  # Show propagation over time.
plot_curve(e4_deltas, "E4 value-iteration max change per sweep", "max |new value - old value|")  # Plot convergence across sweeps.
```

▶ What you'll see: value information travels farther from the terminals every few sweeps, and the convergence curve decreases as Bellman updates stabilize.

```python
V_small = V_e4.copy()  # Store the converged-ish values under the original lesson variable name.
pi_small = greedy_policy(gridworld_small, V_small, gamma)  # Extract the final greedy policy arrows.
deltas_small = list(e4_deltas)  # Store the convergence diagnostics under the original lesson variable name.
snapshots_small = list(e4_sweep_snapshots)  # Store snapshots under the original lesson variable name.
plot_values_policy(gridworld_small, V_small, pi_small, title="E4 step (e): final value heatmap with greedy policy arrows")  # Draw the final value heatmap and arrows.
```

▶ What you'll see: the final arrows route toward the $+1$ terminal, avoid the $-1$ terminal, and bend around the wall.

👀 **Takeaway:** value iteration pushes terminal reward information backward one Bellman sweep at a time.

---

### E5. One Q-learning update from experience

**Problem.** The agent observes

$$
(s,a,r,s')=((2,0),\text{Right},-0.04,(2,1)).
$$

Let $\gamma=0.95$, $\eta=0.20$, $\widehat Q(s,a)=0.30$, and

$$
\widehat Q(s',\text{Up})=0.40,\quad
\widehat Q(s',\text{Down})=0.10,\quad
\widehat Q(s',\text{Left})=0.20,\quad
\widehat Q(s',\text{Right})=0.50.
$$

Compute the new Q-learning value.

**Step-by-step solution.** The update is

$$
\widehat{Q}_{\text{opt}}(s,a)\leftarrow(1-\eta)\widehat{Q}_{\text{opt}}(s,a)+\eta\left[r+\gamma\max_{a'}\widehat{Q}_{\text{opt}}(s',a')\right].
$$

First compute the greedy next value:

$$
\max_{a'}\widehat Q(s',a')=\max\{0.40,0.10,0.20,0.50\}=0.50.
$$

Compute the target:

$$
r+\gamma\max_{a'}\widehat Q(s',a')=-0.04+0.95(0.50).
$$

Since $0.95(0.50)=0.475$,

$$
\text{target}=-0.04+0.475=0.435.
$$

Now mix old value and target:

$$
\widehat Q_{\text{new}}=(1-0.20)(0.30)+0.20(0.435).
$$

Compute:

$$
(0.80)(0.30)=0.24,\qquad (0.20)(0.435)=0.087.
$$

Therefore

$$
\widehat Q_{\text{new}}=0.24+0.087=0.327.
$$

**Boxed answer.**

$$
\boxed{\widehat Q_{\text{new}}((2,0),\text{Right})=0.327.}
$$

```python
Q_demo = defaultdict(float)  # Create a sparse Q-table for the single observed transition.
state = (2, 0)  # Store the current state from the experience tuple.
action = "R"  # Store the current action as the gridworld action symbol for Right.
next_state = (2, 1)  # Store the sampled successor state.
reward = -0.04  # Store the immediate reward from the transition.
gamma = 0.95  # Store the discount factor.
eta = 0.20  # Store the learning rate.
Q_demo[(state, action)] = 0.30  # Store the current Q-value before the update.
Q_demo[(next_state, "U")] = 0.40  # Store one possible next-action value.
Q_demo[(next_state, "D")] = 0.10  # Store one possible next-action value.
Q_demo[(next_state, "L")] = 0.20  # Store one possible next-action value.
Q_demo[(next_state, "R")] = 0.50  # Store one possible next-action value.
print((state, action, reward, next_state))  # Print the sampled experience tuple.
print(f"current Q({state}, {action}) = {Q_demo[(state, action)]:.3f}")  # Print the current Q-value.
```

▶ What you'll see: the exact transition tuple and the old value $0.300$ before learning changes it.

```python
next_action_values = {a: Q_demo[(next_state, a)] for a in ACTIONS}  # Read all candidate next-action values.
next_best = max(next_action_values.values())  # Compute the greedy next-state value.
target = reward + gamma * next_best  # Compute the Q-learning temporal-difference target.
print(next_action_values)  # Print the full next-state action-value row.
print(f"max next Q = {next_best:.3f}")  # Print the greedy continuation value.
print(f"target = reward + gamma * max_next_Q = {target:.3f}")  # Print the numeric target.
```

▶ What you'll see: the next-state row has maximum $0.500$, producing target $-0.04+0.95(0.50)=0.435$.

```python
old_value = Q_demo[(state, action)]  # Read the old estimate before overwriting it.
new_value = (1 - eta) * old_value + eta * target  # Move the estimate eta of the way toward the target.
Q_demo[(state, action)] = new_value  # Store the updated Q-value in the table.
print(f"update = (1 - {eta:.2f}) * {old_value:.3f} + {eta:.2f} * {target:.3f}")  # Print the update expression.
print(f"new Q({state}, {action}) = {Q_demo[(state, action)]:.3f}")  # Print the updated value.
```

▶ What you'll see: the Q-value moves from $0.300$ to $0.327$ rather than jumping all the way to the target.

```python
fig, ax = plt.subplots(figsize=(5, 3))  # Create a compact before-after figure.
ax.bar(["before", "target", "after"], [old_value, target, new_value], color=["gray", "orange", "steelblue"])  # Draw bars for old estimate, target, and updated estimate.
ax.set_title("E5 Q-learning update: before, target, after")  # Add a descriptive title.
ax.set_ylabel("Q value")  # Label the y-axis.
ax.grid(True, axis="y", alpha=0.3)  # Add a light horizontal grid.
plt.show()  # Render the before-after visualization.
```

▶ What you'll see: the “after” bar sits between the old estimate and the target because the learning rate is $0.20$.

👀 **Takeaway:** Q-learning moves the current action value partway toward a sample-based estimate of optimal future return.

### 🔴 Advanced

### A1. Value iteration vs. policy iteration at scale

```python
gamma = 0.95  # Use one discount factor for both algorithms.
V_vi_manual = {state: 0.0 for state in gridworld_lava.states}  # Initialize value iteration at zero.
vi_deltas_manual = []  # Store value-iteration convergence changes.
vi_snapshots_manual = []  # Store value-iteration snapshots.
plot_values_policy(gridworld_lava, V_vi_manual, title="A1 VI step 0: initial lava-grid values")  # Visualize the starting point.
```

▶ What you'll see: the larger grid begins with zero values everywhere except walls and terminal labels.

```python
for sweep in range(1, 16):  # Run fifteen explicit value-iteration sweeps.
    old = V_vi_manual.copy()  # Freeze the previous values for a synchronous sweep.
    for state in gridworld_lava.states:  # Visit every legal state.
        if gridworld_lava.is_terminal(state):  # Handle terminal states.
            V_vi_manual[state] = 0.0  # Keep terminal continuation value zero.
            continue  # Skip action maximization.
        qs = [backup(gridworld_lava, old, state, action, gamma) for action in gridworld_lava.actions(state)]  # Compute all action backups.
        V_vi_manual[state] = float(np.max(qs))  # Store the Bellman optimality update.
    delta = max(abs(V_vi_manual[state] - old[state]) for state in gridworld_lava.states)  # Measure the largest change.
    vi_deltas_manual.append(delta)  # Save the convergence diagnostic.
    vi_snapshots_manual.append(V_vi_manual.copy())  # Save this sweep's values.
    if sweep in [1, 3, 6, 10, 15]:  # Redraw representative iterations.
        plot_values_policy(gridworld_lava, V_vi_manual, greedy_policy(gridworld_lava, V_vi_manual, gamma), title=f"A1 VI sweep {sweep}")  # Show value propagation and arrows.
```

▶ What you'll see: the good terminal's influence expands outward, while the lava terminal creates a low-value region that the arrows avoid.

```python
pi_current = {state: "R" for state in gridworld_lava.states if not gridworld_lava.is_terminal(state)}  # Initialize policy iteration with an arbitrary right-moving policy.
pi_changes_manual = []  # Store the number of changed actions after each improvement.
V_pi_manual = {state: 0.0 for state in gridworld_lava.states}  # Allocate policy-iteration values.
plot_values_policy(gridworld_lava, V_pi_manual, pi_current, title="A1 PI step 0: arbitrary initial policy")  # Draw the initial policy arrows.
```

▶ What you'll see: most arrows initially point right, even where that is not yet safe or useful.

```python
for iteration in range(1, 7):  # Run several policy-evaluation and policy-improvement rounds.
    V_pi_manual = evaluate_policy(gridworld_lava, pi_current, gamma=gamma, sweeps=35)  # Evaluate the current policy with repeated Bellman expectation backups.
    improved_policy = greedy_policy(gridworld_lava, V_pi_manual, gamma)  # Improve the policy greedily using the evaluated values.
    changed = sum(pi_current.get(state) != improved_policy.get(state) for state in improved_policy)  # Count how many arrows changed.
    pi_changes_manual.append(changed)  # Save the policy-change count.
    pi_current = improved_policy  # Adopt the improved policy.
    plot_values_policy(gridworld_lava, V_pi_manual, pi_current, title=f"A1 PI improvement {iteration}: {changed} changed actions")  # Show this policy-iteration state.
    if changed == 0:  # Detect convergence of the policy.
        break  # Stop once policy improvement is stable.
```

▶ What you'll see: policy iteration changes whole regions of arrows after each evaluation phase instead of slowly propagating one sweep at a time.

```python
V_vi = V_vi_manual.copy()  # Store the value-iteration values under the original variable name.
pi_vi = greedy_policy(gridworld_lava, V_vi, gamma)  # Extract the final value-iteration policy.
deltas_vi = list(vi_deltas_manual)  # Store value-iteration convergence history.
snapshots_vi = list(vi_snapshots_manual)  # Store value-iteration snapshots.
V_pi = V_pi_manual.copy()  # Store the policy-iteration values under the original variable name.
pi_pi = dict(pi_current)  # Store the policy-iteration policy under the original variable name.
changes_pi = list(pi_changes_manual)  # Store the policy-iteration change history.
plot_curve(deltas_vi, "A1 value iteration convergence", "max value change")  # Plot value-iteration convergence.
plot_curve(changes_pi, "A1 policy iteration action changes", "changed actions")  # Plot policy-iteration stabilization.
```

▶ What you'll see: the value-iteration curve decays smoothly, while policy-iteration changes often drop to zero after only a few improvements.

```python
fig, axes = plt.subplots(1, 2, figsize=(14, 4.5))  # Create a side-by-side comparison figure.
for ax, V, policy, title in [(axes[0], V_vi, pi_vi, "Value iteration final policy"), (axes[1], V_pi, pi_pi, "Policy iteration final policy")]:  # Iterate over the two final solutions.
    sns.heatmap(value_array(gridworld_lava, V), annot=True, fmt=".2f", cmap="viridis", linewidths=1, linecolor="black", cbar=False, ax=ax)  # Draw the value heatmap on the chosen axis.
    for wall in gridworld_lava.walls:  # Mark every wall cell.
        ax.add_patch(plt.Rectangle((wall[1], wall[0]), 1, 1, color="dimgray"))  # Overlay a gray wall.
    for (r, c), action in policy.items():  # Draw policy arrows.
        ax.text(c + 0.5, r + 0.72, ARROWS[action], ha="center", va="center", color="white", fontsize=16, weight="bold")  # Place an arrow in the cell.
    for (r, c), reward in gridworld_lava.terminals.items():  # Label terminal states.
        ax.text(c + 0.5, r + 0.25, f"T={reward:g}", ha="center", va="center", color="white", fontsize=9, weight="bold")  # Draw terminal text.
    ax.set_title(title)  # Title this subplot.
    ax.set_xlabel("column")  # Label columns.
    ax.set_ylabel("row")  # Label rows.
plt.tight_layout()  # Reduce overlap between subplots.
plt.show()  # Render the side-by-side final policies.
```

▶ What you'll see: the final VI and PI arrows are side by side and should largely agree on a route toward the $+2$ terminal while avoiding lava.

👀 **Takeaway:** value iteration mixes evaluation and improvement every sweep; policy iteration alternates deeper policy evaluation with greedy improvement.

---

### A2. Q-learning with epsilon-greedy exploration

```python
Q_lava = defaultdict(float)  # Initialize the Q-table for the lava grid.
epsilon = 0.15  # Set the probability of exploration.
alpha = 0.25  # Set the learning rate.
gamma = 0.95  # Set the discount factor.
demo_state = gridworld_lava.start  # Choose the start state to demonstrate action selection.
demo_action = epsilon_greedy(gridworld_lava, Q_lava, demo_state, epsilon)  # Draw one epsilon-greedy action from the untrained Q-table.
print(f"epsilon={epsilon:.2f}, state={demo_state}, chosen action={demo_action}")  # Print the selected action.
print("With all Q-values tied at zero, exploitation ties are broken by the first max action while exploration samples randomly.")  # Explain the initial behavior.
```

▶ What you'll see: a single sampled action from the start state, illustrating that $\epsilon$ controls whether the behavior is exploratory or greedy.

```python
rewards_lava = []  # Store total reward from each Q-learning episode.
visits_lava = Counter()  # Count how often each state is visited.
q_episode_snapshots = []  # Store value snapshots at selected episodes.
for episode in range(250):  # Train for 250 episodes.
    state = gridworld_lava.start  # Reset each episode to the start state.
    total_reward = 0.0  # Reset the episode return.
    for step in range(80):  # Cap episode length to avoid endless wandering.
        visits_lava[state] += 1  # Count this state visit.
        action = epsilon_greedy(gridworld_lava, Q_lava, state, epsilon)  # Choose behavior action by epsilon-greedy.
        next_state, reward, done = gridworld_lava.sample_step(state, action)  # Sample the environment transition.
        next_best = 0.0 if done else max(Q_lava[(next_state, next_action)] for next_action in gridworld_lava.actions(next_state))  # Compute the greedy target continuation.
        target = reward + gamma * next_best  # Build the Q-learning target.
        Q_lava[(state, action)] = (1 - alpha) * Q_lava[(state, action)] + alpha * target  # Update the selected Q-value.
        total_reward += reward  # Accumulate realized reward.
        state = next_state  # Move to the successor state.
        if done:  # Stop if the episode reached a terminal.
            break  # End this episode.
    rewards_lava.append(total_reward)  # Save the episode reward.
    if episode + 1 in [25, 100, 250]:  # Save selected checkpoints.
        V_now = {s: (0.0 if gridworld_lava.is_terminal(s) else max(Q_lava[(s, a)] for a in gridworld_lava.actions(s))) for s in gridworld_lava.states}  # Convert Q to V at this checkpoint.
        q_episode_snapshots.append((episode + 1, V_now.copy(), q_policy(gridworld_lava, Q_lava)))  # Save episode number, values, and arrows.
```

▶ What you'll see: no plot yet; this block builds the learning trace one episode at a time while logging rewards, visits, and value snapshots.

```python
for episode_number, V_snapshot, policy_snapshot in q_episode_snapshots:  # Iterate over selected learning checkpoints.
    plot_values_policy(gridworld_lava, V_snapshot, policy_snapshot, title=f"A2 Q-learning value heatmap after episode {episode_number}")  # Redraw learned values and arrows at this checkpoint.
```

▶ What you'll see: the learned value heatmap is noisy early, then increasingly resembles the planned route as more experience accumulates.

```python
plot_curve(rewards_lava, "A2 Q-learning reward per episode", "total reward")  # Plot raw reward by episode.
moving_rewards_lava = np.convolve(rewards_lava, np.ones(20) / 20, mode="valid")  # Smooth rewards with a 20-episode moving average.
plot_curve(moving_rewards_lava, "A2 Q-learning 20-episode moving average", "average reward")  # Plot the smoothed reward curve.
```

▶ What you'll see: raw rewards are jagged because exploration and stochastic slip sometimes cause bad outcomes; the moving average reveals the learning trend.

```python
visit_values = {s: float(visits_lava[s]) for s in gridworld_lava.states}  # Convert visit counts to a value dictionary.
V_q_lava = {s: (0.0 if gridworld_lava.is_terminal(s) else max(Q_lava[(s, a)] for a in gridworld_lava.actions(s))) for s in gridworld_lava.states}  # Convert final Q-values to values.
pi_q_lava = q_policy(gridworld_lava, Q_lava)  # Extract the final greedy policy from Q.
plot_values_policy(gridworld_lava, visit_values, title="A2 visited-state heatmap during Q-learning", cmap="magma")  # Visualize exploration coverage.
plot_values_policy(gridworld_lava, V_q_lava, pi_q_lava, title="A2 final Q-learning learned policy")  # Visualize final learned values and arrows.
```

▶ What you'll see: the visit heatmap is brightest near the start and common routes, while final arrows approximate the exact planner's route.

👀 **Takeaway:** epsilon-greedy exploration intentionally spends some episodes gathering information rather than exploiting the current estimate.

---

### A3. SARSA vs. Q-learning in a risky grid

```python
Q_rule_demo = defaultdict(float)  # Create a tiny Q-table for comparing update targets.
s_demo = (2, 0)  # Choose a demonstration current state above the cliff row.
a_demo = "R"  # Choose a demonstration action.
r_demo = -0.02  # Use the ordinary cliff-grid step reward.
sp_demo = (2, 1)  # Choose a demonstration successor state.
ap_demo = "U"  # Choose the next behavior action for SARSA.
Q_rule_demo[(sp_demo, "U")] = 0.20  # Store a next-action value.
Q_rule_demo[(sp_demo, "D")] = -2.00  # Store a dangerous next-action value.
Q_rule_demo[(sp_demo, "L")] = 0.10  # Store another next-action value.
Q_rule_demo[(sp_demo, "R")] = 0.30  # Store the greedy next-action value.
sarsa_target_demo = r_demo + 0.95 * Q_rule_demo[(sp_demo, ap_demo)]  # Compute the SARSA on-policy target.
print(f"SARSA target uses actual next action {ap_demo}: {sarsa_target_demo:.3f}")  # Print the SARSA target.
```

▶ What you'll see: SARSA's target uses the actual next action, so it evaluates the exploratory behavior policy.

```python
q_learning_target_demo = r_demo + 0.95 * max(Q_rule_demo[(sp_demo, action)] for action in ACTIONS)  # Compute the Q-learning off-policy target.
print(f"Q-learning target uses max next action: {q_learning_target_demo:.3f}")  # Print the Q-learning target.
print("The two targets differ whenever the behavior action is not the greedy action.")  # Explain the comparison.
```

▶ What you'll see: Q-learning's target is larger here because it assumes the best next action rather than the sampled behavior action.

```python
Q_sarsa, rewards_sarsa, paths_sarsa = run_sarsa(cliff_grid, episodes=350, alpha=0.25, gamma=0.95, epsilon=0.10, max_steps=80)  # Train on-policy SARSA on the cliff grid.
Q_q, rewards_q, visits_q, snapshots_q = run_q_learning(cliff_grid, episodes=350, alpha=0.25, gamma=0.95, epsilon=0.10, max_steps=80, plot_every=0)  # Train off-policy Q-learning on the same grid.
plot_curve(np.convolve(rewards_sarsa, np.ones(20) / 20, mode="valid"), "A3 SARSA moving-average reward", "20-episode average reward")  # Plot smoothed SARSA rewards.
plot_curve(np.convolve(rewards_q, np.ones(20) / 20, mode="valid"), "A3 Q-learning moving-average reward", "20-episode average reward")  # Plot smoothed Q-learning rewards.
```

▶ What you'll see: both methods improve with experience, but their reward curves can differ because SARSA prices in exploratory risk.

```python
V_sarsa = {s: (0.0 if cliff_grid.is_terminal(s) else max(Q_sarsa[(s, a)] for a in cliff_grid.actions(s))) for s in cliff_grid.states}  # Convert SARSA Q-values to values.
V_q = {s: (0.0 if cliff_grid.is_terminal(s) else max(Q_q[(s, a)] for a in cliff_grid.actions(s))) for s in cliff_grid.states}  # Convert Q-learning Q-values to values.
pi_sarsa = q_policy(cliff_grid, Q_sarsa)  # Extract SARSA's greedy display policy.
pi_q = q_policy(cliff_grid, Q_q)  # Extract Q-learning's greedy display policy.
plot_values_policy(cliff_grid, V_sarsa, pi_sarsa, title="A3 SARSA: safer values and policy near cliff")  # Plot SARSA values and arrows.
plot_values_policy(cliff_grid, V_q, pi_q, title="A3 Q-learning: greedier values and policy near cliff")  # Plot Q-learning values and arrows.
```

▶ What you'll see: SARSA tends to assign lower values near risky cliff cells, while Q-learning often shows a greedier path near the edge.

👀 **Takeaway:** SARSA is on-policy and learns the value of the behavior it actually follows; Q-learning is off-policy and learns a greedy target policy.

---

### A4. Failure case: $\gamma=1$ on a positive-reward cycle

This example violates the convergence condition: it has a positive reward cycle and no discounting.

```python
cycle_states = ["A", "B", "C", "D"]  # Define four states.
cycle_next = {"A": "B", "B": "C", "C": "A", "D": "D"}  # Define a positive cycle A to B to C to A and an absorbing D.
cycle_reward = {"A": 1.0, "B": 1.0, "C": 1.0, "D": 0.0}  # Give every cycle transition reward +1.
V_cycle_one = {state: 0.0 for state in cycle_states}  # Initialize values for the gamma-equals-one case.
history_one = []  # Store the growing value trace.
print(V_cycle_one)  # Print the initial values.
```

▶ What you'll see: all cycle-state values begin at zero before the positive reward loop starts adding value.

```python
for sweep in range(1, 9):  # Run eight explicit non-discounted sweeps.
    old = V_cycle_one.copy()  # Freeze previous values for a synchronous update.
    for state in cycle_states:  # Update every cycle state.
        V_cycle_one[state] = cycle_reward[state] + 1.0 * old[cycle_next[state]]  # Apply the gamma=1 Bellman backup.
    history_one.append([V_cycle_one[state] for state in cycle_states])  # Save this sweep's values.
    print(f"sweep {sweep}: {V_cycle_one}")  # Print the growing values after this sweep.
```

▶ What you'll see: values on the positive cycle keep increasing instead of approaching a stable fixed point.

```python
history_one = np.array(history_one)  # Convert the growing trace to a NumPy array for plotting.
fig, ax = plt.subplots(figsize=(7, 3.5))  # Create a figure for the non-convergent trace.
ax.plot(history_one[:, 0], marker="o", label="V(A), gamma=1")  # Plot the value of state A over sweeps.
ax.plot(history_one[:, 1], marker="o", label="V(B), gamma=1")  # Plot the value of state B over sweeps.
ax.plot(history_one[:, 2], marker="o", label="V(C), gamma=1")  # Plot the value of state C over sweeps.
ax.set_title("A4 step-by-step growth when gamma=1")  # Add a descriptive title.
ax.set_xlabel("sweep")  # Label the x-axis.
ax.set_ylabel("value")  # Label the y-axis.
ax.legend()  # Show labels for the three cycle states.
ax.grid(True, alpha=0.3)  # Add a light grid.
plt.show()  # Render the trace plot.
```

▶ What you'll see: the three cycle-state traces climb upward sweep after sweep; the MDP has no finite optimal value under $\gamma=1$.

```python
V_cycle_discounted = {state: 0.0 for state in cycle_states}  # Initialize values for the discounted repair.
history_discounted = []  # Store the discounted value trace.
for sweep in range(1, 26):  # Run twenty-five discounted sweeps.
    old = V_cycle_discounted.copy()  # Freeze previous discounted values.
    for state in cycle_states:  # Update every state.
        V_cycle_discounted[state] = cycle_reward[state] + 0.8 * old[cycle_next[state]]  # Apply the gamma=0.8 backup.
    history_discounted.append([V_cycle_discounted[state] for state in cycle_states])  # Save this sweep's values.
history_discounted = np.array(history_discounted)  # Convert the discounted trace to an array.
fig, ax = plt.subplots(figsize=(7, 3.5))  # Create a comparison figure.
ax.plot(history_one[:, 0], marker="o", label="V(A), gamma=1")  # Plot the non-discounted growth.
ax.plot(history_discounted[:, 0], label="V(A), gamma=0.8")  # Plot the discounted repair.
ax.axhline(1 / (1 - 0.8), color="black", linestyle="--", label="1/(1-0.8)")  # Mark the finite geometric limit.
ax.set_title("A4 discounted fix for the positive-reward cycle")  # Add a descriptive title.
ax.set_xlabel("sweep")  # Label the x-axis.
ax.set_ylabel("value of A")  # Label the y-axis.
ax.legend()  # Show the legend.
ax.grid(True, alpha=0.3)  # Add a light grid.
plt.show()  # Render the comparison.
```

▶ What you'll see: the discounted curve bends toward $5$, while the undiscounted trace keeps rising.

**Hand diagnosis.** With reward $1$ forever and $\gamma=1$, the $n$-step partial return is

$$
S_n=\sum_{i=0}^{n-1}1=n,
$$

so

$$
\lim_{n\to\infty}S_n=\infty.
$$

With $\gamma=0.8$:

$$
\sum_{i=0}^{\infty}0.8^i=\frac{1}{1-0.8}=5.
$$

Thus discounting makes the infinite-horizon value finite.

👀 **Takeaway:** $\gamma<1$ is a mathematical convergence condition, not just a modeling preference.

---

### A5. Model-based Monte Carlo from sampled transitions

```python
def collect_random_logs(env, episodes=500, max_steps=50):  # Collect transition logs from random behavior.
    logs = []  # Allocate the log list.
    for episode in range(episodes):  # Generate many episodes.
        state = env.start  # Reset to the start state.
        for step in range(max_steps):  # Limit episode length.
            actions = env.actions(state)  # Read legal actions.
            action = actions[int(np.random.choice(len(actions)))]  # Choose a random action.
            next_state, reward, done = env.sample_step(state, action)  # Sample the environment.
            logs.append((state, action, reward, next_state))  # Store the observed transition.
            state = next_state  # Advance the state.
            if done:  # Stop when terminal.
                break  # End the episode.
    return logs  # Return the sampled log.
logs = collect_random_logs(gridworld_lava, episodes=600, max_steps=60)  # Collect random transition samples from the true environment.
print(f"number of sampled transitions = {len(logs)}")  # Print the size of the sampled dataset.
print("first five transitions:")  # Introduce a small preview.
for row in logs[:5]:  # Show a few sampled transitions.
    print(row)  # Print one transition tuple.
```

▶ What you'll see: a list of sampled $(s,a,r,s')$ tuples collected without knowing the transition table analytically.

```python
triple_counts = Counter()  # Count observed state-action-next-state triples.
pair_counts = Counter()  # Count observed state-action pairs.
reward_sums = defaultdict(float)  # Accumulate rewards for each observed triple.
for state, action, reward, next_state in logs:  # Iterate over the sampled transition log.
    triple_counts[(state, action, next_state)] += 1  # Increment the successor count.
    pair_counts[(state, action)] += 1  # Increment the state-action count.
    reward_sums[(state, action, next_state)] += reward  # Add reward to the triple's running sum.
example_pair = (gridworld_lava.start, "R")  # Choose one state-action pair to inspect.
print(f"counts for {example_pair}:")  # Print a label for the inspected counts.
for (s, a, ns), count in triple_counts.items():  # Iterate over counted triples.
    if (s, a) == example_pair:  # Keep only the inspected state-action pair.
        print(f"  next_state={ns}, count={count}")  # Print successor counts.
```

▶ What you'll see: raw counts for possible successors of one state-action pair; these counts are the numerator of $\widehat T$.

```python
def estimate_model(env, logs):  # Estimate transition probabilities and rewards.
    triple_counts = Counter()  # Count state-action-next-state triples.
    pair_counts = Counter()  # Count state-action pairs.
    reward_sums = defaultdict(float)  # Sum rewards per triple.
    for state, action, reward, next_state in logs:  # Iterate over logged transitions.
        triple_counts[(state, action, next_state)] += 1  # Count this transition.
        pair_counts[(state, action)] += 1  # Count this state-action pair.
        reward_sums[(state, action, next_state)] += reward  # Accumulate rewards.
    model = {}  # Allocate the estimated model.
    for state in env.states:  # Visit every state.
        for action in env.actions(state):  # Visit every legal action.
            denom = pair_counts[(state, action)]  # Read the number of samples.
            if denom == 0:  # Handle unseen pairs.
                model[(state, action)] = env.outcomes(state, action)  # Use true outcomes only as a safe fallback for a complete runnable demo.
                continue  # Move to the next pair.
            successors = [ns for (s, a, ns), count in triple_counts.items() if s == state and a == action]  # Find observed successors.
            model[(state, action)] = [(triple_counts[(state, action, ns)] / denom, ns, reward_sums[(state, action, ns)] / triple_counts[(state, action, ns)]) for ns in successors]  # Estimate probabilities and mean rewards.
    return model, triple_counts, pair_counts  # Return the learned model and counts.
model_hat, triple_counts, pair_counts = estimate_model(gridworld_lava, logs)  # Normalize counts into a learned transition model.
print(f"estimated outcomes for {example_pair}:")  # Print a label for the learned distribution.
for prob, next_state, mean_reward in model_hat[example_pair]:  # Iterate over estimated outcomes.
    print(f"  P({next_state})={prob:.3f}, mean reward={mean_reward:.3f}")  # Print probability and reward estimates.
print(f"probability sum = {sum(prob for prob, next_state, reward in model_hat[example_pair]):.3f}")  # Verify that probabilities sum to one.
```

▶ What you'll see: counts are normalized into probabilities, and the displayed probabilities sum to $1.000$.

```python
coverage = {s: float(sum(pair_counts[(s, a)] for a in gridworld_lava.actions(s))) for s in gridworld_lava.states}  # Count how much data touched each state.
plot_values_policy(gridworld_lava, coverage, title="A5 sampled state-action coverage", cmap="magma")  # Draw a coverage heatmap.
```

▶ What you'll see: random sampling covers some regions much more heavily than others, which affects model quality.

```python
def vi_on_model(env, model, gamma=0.95, sweeps=25):  # Solve an estimated model by value iteration.
    V = {state: 0.0 for state in env.states}  # Initialize values.
    for sweep in range(sweeps):  # Repeat optimal Bellman backups.
        old = V.copy()  # Freeze old values.
        for state in env.states:  # Update every state.
            if env.is_terminal(state):  # Handle terminal states.
                V[state] = 0.0  # Keep terminal value zero.
                continue  # Skip actions.
            qs = [sum(prob * (reward + gamma * old[next_state]) for prob, next_state, reward in model[(state, action)]) for action in env.actions(state)]  # Compute estimated-model action values.
            V[state] = float(np.max(qs))  # Store the best action value.
    return V, greedy_policy(env, V, gamma)  # Return values and greedy policy.
V_hat, pi_hat = vi_on_model(gridworld_lava, model_hat, gamma=0.95, sweeps=25)  # Solve the learned model.
V_true, pi_true, deltas_true, snaps_true = value_iteration(gridworld_lava, gamma=0.95, sweeps=25)  # Solve the true model for comparison.
plot_values_policy(gridworld_lava, V_hat, pi_hat, title="Value iteration on learned model")  # Plot learned-model solution.
plot_values_policy(gridworld_lava, V_true, pi_true, title="Value iteration on true model")  # Plot true-model solution.
```

▶ What you'll see: the learned-model heatmap resembles the true-model heatmap most closely where the coverage heatmap was bright.

👀 **Takeaway:** model-based Monte Carlo first estimates $\widehat T$ and $\widehat{\operatorname{Reward}}$, then reuses standard planning algorithms.

### Interactive Experiment

Use sliders for $\gamma$, slip probability, and $\epsilon$. The function recomputes exact value iteration and short-run Q-learning under the chosen settings.

```python
try:  # Try to import widgets for a live notebook control.
    from ipywidgets import interact, FloatSlider  # Import interactive slider utilities.
    WIDGETS_AVAILABLE = True  # Record that widgets are available.
except Exception:  # Fall back when widgets are unavailable.
    WIDGETS_AVAILABLE = False  # Record that widgets are unavailable.

def interactive_mdp(gamma=0.95, slip=0.15, epsilon=0.10):  # Define the slider-driven experiment.
    env = GridWorld(shape=(5, 6), start=(4, 0), terminals={(0, 5): 2.0, (3, 4): -2.0}, walls=[(1, 1), (1, 2), (2, 2), (3, 1)], default_reward=-0.03, slip=slip)  # Rebuild the lava grid with the selected slip.
    V_exact, pi_exact, deltas_exact, snapshots_exact = value_iteration(env, gamma=gamma, sweeps=18)  # Compute exact planning values.
    Q_learned, rewards_learned, visits_learned, snapshots_learned = run_q_learning(env, episodes=120, alpha=0.25, gamma=gamma, epsilon=epsilon, max_steps=80)  # Learn from sampled episodes.
    V_learned = {s: (0.0 if env.is_terminal(s) else max(Q_learned[(s, a)] for a in env.actions(s))) for s in env.states}  # Convert Q-values to state values.
    pi_learned = q_policy(env, Q_learned)  # Extract the learned greedy policy.
    plot_values_policy(env, V_exact, pi_exact, title=f"Exact VI: gamma={gamma:.2f}, slip={slip:.2f}")  # Plot exact planning output.
    plot_values_policy(env, V_learned, pi_learned, title=f"Q-learning: epsilon={epsilon:.2f}")  # Plot learned output.
    plot_curve(rewards_learned, "Interactive Q-learning reward curve", "episode reward")  # Plot reward over episodes.

if WIDGETS_AVAILABLE:  # Display widgets if possible.
    interact(interactive_mdp, gamma=FloatSlider(value=0.95, min=0.50, max=0.99, step=0.01, description="gamma"), slip=FloatSlider(value=0.15, min=0.00, max=0.40, step=0.05, description="slip"), epsilon=FloatSlider(value=0.10, min=0.00, max=0.50, step=0.05, description="epsilon"))  # Create the interactive sliders.
else:  # Run a static fallback otherwise.
    interactive_mdp(gamma=0.95, slip=0.15, epsilon=0.10)  # Execute one representative setting.
```

▶ What you'll see: increasing $\gamma$ makes distant rewards matter more; increasing slip makes exact policies more conservative near lava; increasing $\epsilon$ makes Q-learning rewards noisier.

👀 **Takeaway:** $\gamma$ changes the objective, slip changes the environment dynamics, and $\epsilon$ changes the data-collection policy.

## 4. Practice Questions

### 🟢 Easy

1. List the six components of the MDP tuple and state the role of each.
2. A state-action pair has successor probabilities $0.2$, $0.5$, and $p$. What must $p$ be?
3. Compute the discounted utility of rewards $(2,2,2)$ with $\gamma=0.5$.
4. Action $a$ from $s$ leads to $s_1$ with probability $0.7$, reward $1$, and value $4$, and to $s_2$ with probability $0.3$, reward $-2$, and value $10$. With $\gamma=0.9$, compute $Q(s,a)$.
5. If $\epsilon=0.2$, what is the probability of exploitation and the probability of exploration?

### 🔴 Hard

1. Starting from $Q_{\text{opt}}(s,a)$, derive $V_{\text{opt}}(s)=\max_a Q_{\text{opt}}(s,a)$ and $\pi_{\text{opt}}(s)$.
2. Compare the cost of one policy-evaluation sweep and one value-iteration sweep.
3. Explain why SARSA often learns a safer route than Q-learning in a cliff-walk grid with continuing exploration.
4. Prove that reward $1$ forever has infinite value when $\gamma=1$ but finite value when $0\le\gamma<1$.
5. Design rewards for a two-route MDP where a longer safer route is preferable to a shorter risky route, and show the inequality.

<details><summary>Solutions</summary>

### Easy solutions

1. The tuple is

$$
(s_{\text{start}},\operatorname{Actions},T,\operatorname{Reward},\operatorname{IsEnd},\gamma).
$$

$s_{\text{start}}$ is the initial state; $\operatorname{Actions}(s)$ gives legal actions; $T(s,a,s')$ gives transition probabilities; $\operatorname{Reward}(s,a,s')$ gives immediate rewards; $\operatorname{IsEnd}(s)$ marks terminal states; and $\gamma$ discounts future reward.

2. Probabilities must sum to one:

$$
0.2+0.5+p=1.
$$

Thus

$$
p=1-0.7=0.3.
$$

So $\boxed{p=0.3}$.

3. The utility is

$$
u=2+0.5(2)+0.5^2(2).
$$

Compute:

$$
u=2+1+0.25(2)=2+1+0.5=3.5.
$$

So $\boxed{u=3.5}$.

4. Use the Bellman action backup:

$$
Q(s,a)=0.7[1+0.9(4)]+0.3[-2+0.9(10)].
$$

Compute inside brackets:

$$
1+0.9(4)=4.6,\qquad -2+0.9(10)=7.
$$

Weight and add:

$$
Q(s,a)=0.7(4.6)+0.3(7)=3.22+2.1=5.32.
$$

So $\boxed{Q(s,a)=5.32}$.

5. Epsilon-greedy explores with probability $\epsilon$ and exploits with probability $1-\epsilon$. Therefore

$$
P(\text{explore})=0.2,\qquad P(\text{exploit})=0.8.
$$

### Hard solutions

1. The optimal action-value function is

$$
Q_{\text{opt}}(s,a)=\sum_{s'}T(s,a,s')\left[\operatorname{Reward}(s,a,s')+\gamma V_{\text{opt}}(s')\right].
$$

At state $s$, the agent chooses the action with the largest expected utility, so

$$
V_{\text{opt}}(s)=\max_{a\in\operatorname{Actions}(s)}Q_{\text{opt}}(s,a).
$$

The optimal policy chooses an action attaining that maximum:

$$
\pi_{\text{opt}}(s)=\operatorname*{argmax}_{a\in\operatorname{Actions}(s)}Q_{\text{opt}}(s,a).
$$

Substitution yields

$$
V_{\text{opt}}(s)=\max_{a\in\operatorname{Actions}(s)}\sum_{s'}T(s,a,s')\left[\operatorname{Reward}(s,a,s')+\gamma V_{\text{opt}}(s')\right].
$$

2. Policy evaluation follows one fixed action $\pi(s)$ per state. With $S$ states and at most $S'$ successors, one sweep costs

$$
O(SS').
$$

Value iteration must evaluate all $A$ actions before taking a maximum. Therefore one sweep costs

$$
O(SAS').
$$

The difference is the extra factor $A$ for action maximization.

3. SARSA updates with the actual next behavior action:

$$
\widehat Q(s,a)\leftarrow(1-\eta)\widehat Q(s,a)+\eta[r+\gamma\widehat Q(s',a')].
$$

When the behavior policy is epsilon-greedy, $a'$ can be exploratory. Near a cliff, exploratory moves may fall into the cliff, so SARSA's target includes the cost of that risk.

Q-learning updates with

$$
\widehat Q(s,a)\leftarrow(1-\eta)\widehat Q(s,a)+\eta\left[r+\gamma\max_{a'}\widehat Q(s',a')\right].
$$

The maximum assumes greedy future behavior, even if the agent will still explore while collecting data. Thus Q-learning may value a route close to the cliff, while SARSA often prefers a safer route farther away.

4. With reward $1$ forever and $\gamma=1$, the $n$-step partial sum is

$$
S_n=\sum_{i=0}^{n-1}1=n.
$$

Therefore

$$
\lim_{n\to\infty}S_n=\infty.
$$

For $0\le\gamma<1$, the return is

$$
\sum_{i=0}^{\infty}\gamma^i.
$$

The partial sum is

$$
S_n=\frac{1-\gamma^n}{1-\gamma}.
$$

Since $\gamma^n\to0$ when $0\le\gamma<1$,

$$
\sum_{i=0}^{\infty}\gamma^i=\frac{1}{1-\gamma},
$$

which is finite.

5. Let the safe route take three transitions: reward $-1$, then $-1$, then terminal reward $+10$. With $\gamma=0.9$,

$$
U_{\text{safe}}=-1+0.9(-1)+0.9^2(10).
$$

Compute:

$$
U_{\text{safe}}=-1-0.9+8.1=6.2.
$$

Let the risky route take one transition: reward $+10$ with probability $p$ and reward $-20$ with probability $1-p$. Then

$$
U_{\text{risky}}=10p+(-20)(1-p)=10p-20+20p=30p-20.
$$

The safe route is better when

$$
6.2>30p-20.
$$

Add $20$:

$$
26.2>30p.
$$

Divide by $30$:

$$
p<\frac{26.2}{30}\approx0.8733.
$$

Thus when the shortcut succeeds with probability below about $87.33\%$, the longer safe route has higher expected discounted utility.

</details>
