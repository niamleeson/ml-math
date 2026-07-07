# Markov Decision Processes & Q-learning
> **Source:** CS 221 · **Category:** Concept+Method · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an `.ipynb` will be generated. [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](#)

## 0. Step-by-Step Worked Example — Start Here (Beginner Friendly)

> 🧑‍🎓 **New to this topic? Start here.** This is a gentle, fully runnable walkthrough that
> builds up *every* idea in this lesson one tiny step at a time. Each step **prints** the
> numbers it computes and **draws a picture** so you can *see* what is happening. Run the
> cells in order from top to bottom. Nothing here needs the internet or any downloaded data.

**What we will build, step by step:**
1. **MDP ingredients** — states, actions, transitions, rewards, terminal states, and discounting.
2. **Transition probabilities** — checking that each action's outcomes form a distribution.
3. **Policies** — a simple map from each state to the action the agent will take.
4. **Discounted utility** — turning a reward stream into one total return.
5. **Action values and state values** — computing $Q_\pi(s,a)$ and $V_\pi(s)$.
6. **Bellman expectation equation** — the self-consistency check for a fixed policy.
7. **Optimal values and policy** — using a max over actions to choose the best move.
8. **Policy evaluation** — repeatedly applying Bellman backups for one fixed policy.
9. **Value iteration** — planning by repeated optimal Bellman backups.
10. **Policy iteration** — alternating policy evaluation and greedy improvement.
11. **Model-based Monte Carlo** — estimating transition probabilities from sampled experience.
12. **Model-free Monte Carlo** — averaging sampled returns directly into $Q$ values.
13. **SARSA** — updating with the next action actually taken.
14. **Q-learning** — updating with the greedy next-action value.
15. **Epsilon-greedy exploration** — balancing random trying with current best actions.

### Step 0 — Set up our tools

We import NumPy (arrays + random choices) and Matplotlib (pictures). We fix a random **seed**
so every run prints the same small numbers, and define a tiny `log()` helper for clearly
labeled output.

```python
import numpy as np                       # NumPy gives us arrays, probability calculations, and seeded random choices.
import matplotlib.pyplot as plt          # Matplotlib draws the tiny MDP diagrams, value curves, and learning plots.

np.random.seed(0)                         # Fix the seed so every run prints the same results.
plt.rcParams["figure.figsize"] = (7, 4)   # Use a comfortable default size for beginner-friendly plots.


def log(label, value):                    # Define the exact small logger used throughout this walkthrough.
    print(f"[{label}] {value}")           # Print labels in brackets so every number explains itself.

log("setup", "tools ready — NumPy + Matplotlib imported, seed fixed to 0")  # Confirm that setup ran.
```
▶ What you'll see: one line confirming the tools are ready.

### Step 1 — MDP ingredients: states, actions, transitions, rewards, ends, and discount

A Markov Decision Process is a tiny world for sequential decisions. We will use a three-state
chain where action outcomes can be random, rewards arrive on transitions, and `G` is terminal.

```python
states_demo = ["A", "B", "G"]  # List every state in the tiny MDP.
start_state_demo = "A"  # Mark the state where each episode begins.
terminal_states_demo = {"G"}  # Mark G as terminal, meaning there is no future value after arrival.
gamma_demo = 0.90  # Store the discount factor so future rewards count, but slightly less than immediate rewards.
actions_demo = {"A": ["safe", "risky"], "B": ["finish", "reset"], "G": []}  # Give each state its legal actions.
transitions_demo = {  # Store T(s,a,s') together with the immediate reward for that transition.
    ("A", "safe"): [(0.80, "B", -0.10), (0.20, "A", -0.10)],  # Safe usually reaches B but can leave us in A.
    ("A", "risky"): [(0.50, "G", 1.00), (0.50, "A", -0.40)],  # Risky can finish immediately or waste effort.
    ("B", "finish"): [(1.00, "G", 1.00)],  # Finish deterministically enters the good terminal state.
    ("B", "reset"): [(1.00, "A", -0.20)],  # Reset returns to A with a small penalty.
}  # Finish the transition model dictionary.
position_demo = {"A": (0.0, 0.0), "B": (1.4, 0.0), "G": (2.8, 0.0)}  # Place states on a line for plotting.
log("states", states_demo)  # Print the states.
log("start", start_state_demo)  # Print the start state.
log("terminal states", sorted(terminal_states_demo))  # Print the terminal set.
log("discount gamma", gamma_demo)  # Print the discount factor.
fig_demo, ax_demo = plt.subplots()  # Create a small diagram canvas.
for state_demo in states_demo:  # Draw each state as a labeled dot.
    x_demo, y_demo = position_demo[state_demo]  # Read the plotting coordinates for this state.
    color_demo = "lightgreen" if state_demo in terminal_states_demo else "lightblue"  # Color terminal state differently.
    ax_demo.scatter(x_demo, y_demo, s=900, color=color_demo, edgecolor="black", zorder=3)  # Draw the state circle.
    ax_demo.text(x_demo, y_demo, state_demo, ha="center", va="center", fontsize=12, weight="bold")  # Label the state.
for (state_demo, action_demo), outcomes_demo in transitions_demo.items():  # Draw one arrow for each possible outcome.
    for prob_demo, next_state_demo, reward_demo in outcomes_demo:  # Visit each stochastic successor.
        x0_demo, y0_demo = position_demo[state_demo]  # Read the source coordinates.
        x1_demo, y1_demo = position_demo[next_state_demo]  # Read the destination coordinates.
        y_offset_demo = 0.18 if action_demo in ["safe", "finish"] else -0.18  # Separate overlapping arrows vertically.
        ax_demo.annotate("", xy=(x1_demo, y1_demo + y_offset_demo), xytext=(x0_demo, y0_demo + y_offset_demo), arrowprops={"arrowstyle": "->", "alpha": prob_demo})  # Draw a probability-weighted arrow.
        ax_demo.text((x0_demo + x1_demo) / 2, y_offset_demo + 0.05, f"{action_demo}\np={prob_demo}, r={reward_demo}", ha="center", fontsize=8)  # Label action, probability, and reward.
ax_demo.set_title("Step 1: a tiny MDP has states, actions, probabilities, and rewards")  # Title the diagram.
ax_demo.axis("off")  # Hide axes because this is a state diagram, not a coordinate graph.
plt.show()  # Display the MDP picture.
```
▶ What you'll see: three states, labeled arrows, outcome probabilities, and rewards.

### Step 2 — Transition probabilities: every action's outcomes sum to one

For each fixed state-action pair, the successor probabilities must form a valid probability
distribution. We check every row and visualize the outcome masses.

```python
prob_sums_demo = []  # Collect one probability sum per state-action pair.
row_labels_demo = []  # Collect readable labels like A-safe.
for key_demo, outcomes_demo in transitions_demo.items():  # Loop over every transition row.
    prob_sum_demo = sum(prob_demo for prob_demo, next_state_demo, reward_demo in outcomes_demo)  # Add the probabilities in this row.
    row_labels_demo.append(f"{key_demo[0]}-{key_demo[1]}")  # Store a compact row label.
    prob_sums_demo.append(prob_sum_demo)  # Store the probability sum.
    log(f"sum T for {key_demo}", round(prob_sum_demo, 3))  # Print the distribution check.
plt.bar(row_labels_demo, prob_sums_demo, color="steelblue", edgecolor="black")  # Draw one bar per probability row.
plt.axhline(1.0, color="red", linestyle="--", label="must equal 1")  # Mark the required total probability.
plt.ylim(0.0, 1.2)  # Keep the probability scale readable.
plt.ylabel("sum of successor probabilities")  # Label the vertical axis.
plt.title("Step 2: each T(s,a,·) row is a probability distribution")  # Title the chart.
plt.legend()  # Show the reference-line label.
plt.show()  # Display the probability-sum chart.
```
▶ What you'll see: every bar reaches exactly 1, so each transition row is valid.

### Step 3 — Policies: choose one action in each nonterminal state

A policy is a simple rule: given a state, pick an action. Here our beginner policy plays `safe`
from `A` and `finish` from `B`.

```python
policy_demo = {"A": "safe", "B": "finish"}  # Define a deterministic policy pi(s).
for state_demo in policy_demo:  # Print the policy action at each nonterminal state.
    log(f"pi({state_demo})", policy_demo[state_demo])  # Show the state-to-action map.
chosen_labels_demo = list(policy_demo.keys())  # Store states for the bar chart.
chosen_numbers_demo = [actions_demo[state_demo].index(policy_demo[state_demo]) for state_demo in chosen_labels_demo]  # Encode chosen actions by their index.
plt.bar(chosen_labels_demo, chosen_numbers_demo, color="seagreen", edgecolor="black")  # Draw the selected action index per state.
plt.yticks([0, 1], ["first action", "second action"])  # Decode the y-axis into action positions.
plt.title("Step 3: a policy maps each state to one action")  # Title the policy plot.
plt.ylabel("chosen action position")  # Label what the bar height means.
plt.show()  # Display the policy chart.
```
▶ What you'll see: the policy chooses one legal action for `A` and one for `B`.

### Step 4 — Discounted utility: turn a reward stream into one return

A path produces many rewards, but planning needs one score. The discounted utility
$\sum_t \gamma^t r_t$ makes immediate rewards count most and later rewards fade by powers of $\gamma$.

```python
rewards_path_demo = np.array([-0.10, -0.10, 1.00])  # Store a sample path reward stream A -> B -> A -> G.
times_demo = np.arange(len(rewards_path_demo))  # Create time indices 0, 1, 2 for discount powers.
weights_demo = gamma_demo ** times_demo  # Compute gamma^t for each reward time.
terms_demo = weights_demo * rewards_path_demo  # Multiply each reward by its discount weight.
return_demo = float(np.sum(terms_demo))  # Add discounted terms into one utility number.
log("raw rewards", rewards_path_demo)  # Print the undiscounted rewards.
log("discount weights", np.round(weights_demo, 3))  # Print the powers of gamma.
log("discounted terms", np.round(terms_demo, 3))  # Print each contribution to the return.
log("discounted utility", round(return_demo, 3))  # Print the final scalar return.
plt.bar(["t=0", "t=1", "t=2"], terms_demo, color=["salmon", "salmon", "seagreen"], edgecolor="black")  # Plot each discounted term.
plt.axhline(0.0, color="black", linewidth=1)  # Mark zero so costs and rewards are separated.
plt.ylabel("discounted contribution")  # Label the contribution axis.
plt.title("Step 4: discounted utility adds weighted rewards")  # Title the plot.
plt.show()  # Display the utility bar chart.
```
▶ What you'll see: the later reward is positive but shrunk by $\gamma^2$ before being added.

### Step 5 — Action values and state values under a fixed policy

$Q_\pi(s,a)$ scores taking action $a$ now and then following the policy. $V_\pi(s)$ is just the
$Q$ value of the action the policy actually chooses in state $s$.

```python
def q_backup_demo(state_demo, action_demo, values_demo, gamma_value_demo):  # Define one Bellman action-value backup.
    total_demo = 0.0  # Start the expected value at zero.
    for prob_demo, next_state_demo, reward_demo in transitions_demo[(state_demo, action_demo)]:  # Loop over stochastic successors.
        total_demo += prob_demo * (reward_demo + gamma_value_demo * values_demo[next_state_demo])  # Add probability times reward-plus-future.
    return total_demo  # Return Q(s,a) for the supplied value function.

values_guess_demo = {"A": 0.50, "B": 1.00, "G": 0.00}  # Use a small value guess so the arithmetic is visible.
q_policy_demo = {}  # Store Q values for the policy-chosen actions.
for state_demo, action_demo in policy_demo.items():  # Visit each nonterminal state under the policy.
    q_value_demo = q_backup_demo(state_demo, action_demo, values_guess_demo, gamma_demo)  # Compute Q_pi(s, pi(s)).
    q_policy_demo[state_demo] = q_value_demo  # Store the state value implied by the policy action.
    log(f"Q_pi({state_demo},{action_demo})", round(q_value_demo, 3))  # Print the action value.
    log(f"V_pi({state_demo})", round(q_policy_demo[state_demo], 3))  # Print the matching state value.
plt.bar(list(q_policy_demo.keys()), list(q_policy_demo.values()), color="mediumpurple", edgecolor="black")  # Plot state values induced by the policy.
plt.ylabel("value")  # Label the value axis.
plt.title("Step 5: V_pi(s) equals Q_pi(s, pi(s))")  # Title the chart.
plt.show()  # Display the Q-to-V relationship.
```
▶ What you'll see: each state's printed $V_\pi$ equals the $Q_\pi$ value of its policy action.

### Step 6 — Bellman expectation equation: fixed-policy self-consistency

The Bellman expectation equation says a correct fixed-policy value agrees with its own one-step
backup. We solve the tiny policy exactly enough to check left side versus right side for state `A`.

```python
value_bellman_demo = {"A": 0.62 / 0.82, "B": 1.00, "G": 0.00}  # Store the exact fixed-policy values for safe/finish.
right_side_demo = q_backup_demo("A", policy_demo["A"], value_bellman_demo, gamma_demo)  # Compute the Bellman RHS for A.
left_side_demo = value_bellman_demo["A"]  # Read the Bellman LHS V_pi(A).
log("left side V_pi(A)", round(left_side_demo, 4))  # Print the value estimate.
log("right side backup", round(right_side_demo, 4))  # Print the one-step expectation.
log("difference", round(abs(left_side_demo - right_side_demo), 8))  # Print the mismatch, which should be tiny.
plt.bar(["left V(A)", "right backup"], [left_side_demo, right_side_demo], color=["steelblue", "orange"], edgecolor="black")  # Compare both sides visually.
plt.ylabel("value")  # Label the value axis.
plt.title("Step 6: Bellman expectation equation matches both sides")  # Title the check.
plt.show()  # Display the Bellman equality chart.
```
▶ What you'll see: the two bars line up, showing the value is self-consistent with the policy.

### Step 7 — Optimal values and policy: maximize over actions

Optimal control replaces “follow the policy action” with “try every legal action and keep the best.”
That max gives $V_*(s)=\max_a Q_*(s,a)$ and the greedy optimal policy.

```python
values_opt_guess_demo = {"A": 0.80, "B": 1.00, "G": 0.00}  # Use a near-optimal value guess to inspect one max backup.
action_values_a_demo = []  # Store Q(A,a) for each action.
for action_demo in actions_demo["A"]:  # Try every legal action at A.
    q_value_demo = q_backup_demo("A", action_demo, values_opt_guess_demo, gamma_demo)  # Compute the action backup.
    action_values_a_demo.append(q_value_demo)  # Save the candidate Q value.
    log(f"Q_opt guess for A,{action_demo}", round(q_value_demo, 3))  # Print the candidate.
best_index_demo = int(np.argmax(action_values_a_demo))  # Find the maximizing action index.
best_action_demo = actions_demo["A"][best_index_demo]  # Convert the index back to an action label.
value_opt_a_demo = action_values_a_demo[best_index_demo]  # Read the maximum action value.
log("V_opt(A)=max_a Q(A,a)", round(value_opt_a_demo, 3))  # Print the optimal value estimate.
log("pi_opt(A)", best_action_demo)  # Print the greedy action.
colors_demo = ["orange" if action_demo == best_action_demo else "gray" for action_demo in actions_demo["A"]]  # Highlight the best action.
plt.bar(actions_demo["A"], action_values_a_demo, color=colors_demo, edgecolor="black")  # Plot the candidate action values.
plt.ylabel("one-step optimal Q")  # Label the Q-value axis.
plt.title("Step 7: optimal policy chooses the largest action value")  # Title the max backup plot.
plt.show()  # Display the action comparison.
```
▶ What you'll see: the highlighted action is the one with the largest backed-up value.

### Step 8 — Policy evaluation: repeat Bellman expectation backups

Policy evaluation starts from guesses and repeatedly applies the fixed-policy Bellman backup.
Values stop moving once the policy's future rewards have fully propagated backward.

```python
values_eval_demo = {state_demo: 0.0 for state_demo in states_demo}  # Initialize all state values to zero.
history_eval_demo = []  # Store values after each sweep for plotting.
for sweep_demo in range(8):  # Run a few synchronous policy-evaluation sweeps.
    old_values_demo = values_eval_demo.copy()  # Freeze old values so this sweep is synchronous.
    for state_demo in states_demo:  # Visit every state.
        if state_demo in terminal_states_demo:  # Handle terminal states separately.
            values_eval_demo[state_demo] = 0.0  # Terminal continuation value is zero.
        else:  # Update nonterminal states by following the policy action.
            values_eval_demo[state_demo] = q_backup_demo(state_demo, policy_demo[state_demo], old_values_demo, gamma_demo)  # Apply the expectation backup.
    history_eval_demo.append([values_eval_demo[state_demo] for state_demo in states_demo])  # Save the sweep's values.
    log(f"policy-eval sweep {sweep_demo + 1}", {state_demo: round(values_eval_demo[state_demo], 3) for state_demo in states_demo})  # Print the sweep.
history_eval_demo = np.array(history_eval_demo)  # Convert the history to an array for plotting.
for index_demo, state_demo in enumerate(states_demo):  # Plot one value curve per state.
    plt.plot(history_eval_demo[:, index_demo], marker="o", label=f"V({state_demo})")  # Draw that state's evaluation trajectory.
plt.xlabel("sweep")  # Label the dynamic-programming sweep axis.
plt.ylabel("value under fixed policy")  # Label the value axis.
plt.title("Step 8: policy evaluation converges by repeated backups")  # Title the convergence plot.
plt.legend()  # Show state labels.
plt.show()  # Display the policy-evaluation curves.
```
▶ What you'll see: values change quickly at first, then flatten near the Bellman fixed point.

### Step 9 — Value iteration: repeat optimal Bellman backups

Value iteration is like policy evaluation, except each state keeps the best action backup instead
of a policy-specified action. This simultaneously estimates optimal values and reveals greedy actions.

```python
values_vi_demo = {state_demo: 0.0 for state_demo in states_demo}  # Initialize optimal values at zero.
history_vi_demo = []  # Store value snapshots by sweep.
deltas_vi_demo = []  # Store the largest value change per sweep.
for sweep_demo in range(10):  # Run optimal Bellman sweeps.
    old_values_demo = values_vi_demo.copy()  # Freeze old values for a synchronous sweep.
    for state_demo in states_demo:  # Visit every state.
        if state_demo in terminal_states_demo:  # Handle terminal state.
            values_vi_demo[state_demo] = 0.0  # Terminal value remains zero.
        else:  # Update nonterminal values by maximizing over actions.
            candidates_demo = [q_backup_demo(state_demo, action_demo, old_values_demo, gamma_demo) for action_demo in actions_demo[state_demo]]  # Compute all action backups.
            values_vi_demo[state_demo] = float(np.max(candidates_demo))  # Keep the largest backup.
    delta_demo = max(abs(values_vi_demo[state_demo] - old_values_demo[state_demo]) for state_demo in states_demo)  # Measure the biggest change.
    deltas_vi_demo.append(delta_demo)  # Save the convergence diagnostic.
    history_vi_demo.append([values_vi_demo[state_demo] for state_demo in states_demo])  # Save current values.
    log(f"value-iteration sweep {sweep_demo + 1}", {state_demo: round(values_vi_demo[state_demo], 3) for state_demo in states_demo})  # Print the sweep.
policy_vi_demo = {}  # Allocate the greedy policy from final values.
for state_demo in states_demo:  # Extract greedy actions for nonterminal states.
    if state_demo not in terminal_states_demo:  # Skip terminal state.
        q_row_demo = [q_backup_demo(state_demo, action_demo, values_vi_demo, gamma_demo) for action_demo in actions_demo[state_demo]]  # Compute final action values.
        policy_vi_demo[state_demo] = actions_demo[state_demo][int(np.argmax(q_row_demo))]  # Store the greedy action.
log("greedy policy from VI", policy_vi_demo)  # Print the final greedy policy.
plt.plot(deltas_vi_demo, marker="o", color="crimson")  # Plot max update size by sweep.
plt.xlabel("sweep")  # Label the sweep axis.
plt.ylabel("max value change")  # Label the convergence diagnostic.
plt.title("Step 9: value iteration changes shrink toward zero")  # Title the plot.
plt.show()  # Display the value-iteration convergence curve.
```
▶ What you'll see: values stabilize and the greedy policy becomes clear.

### Step 10 — Policy iteration: evaluate, then improve

Policy iteration alternates two moves: evaluate the current policy, then greedily improve it using
those values. It often changes whole policies in a few big jumps.

```python
policy_pi_demo = {"A": "risky", "B": "reset"}  # Start from a deliberately weak policy.
changes_pi_demo = []  # Track how many actions change after each improvement.
for iteration_demo in range(5):  # Run a few evaluate-improve rounds.
    values_pi_demo = {state_demo: 0.0 for state_demo in states_demo}  # Reset values for evaluating the current policy.
    for sweep_demo in range(12):  # Evaluate the policy with repeated Bellman expectation backups.
        old_values_demo = values_pi_demo.copy()  # Freeze values for a synchronous sweep.
        for state_demo in states_demo:  # Visit every state.
            if state_demo in terminal_states_demo:  # Handle terminal states.
                values_pi_demo[state_demo] = 0.0  # Terminal continuation value is zero.
            else:  # Follow the current policy action.
                values_pi_demo[state_demo] = q_backup_demo(state_demo, policy_pi_demo[state_demo], old_values_demo, gamma_demo)  # Apply policy evaluation.
    improved_policy_demo = {}  # Build the improved greedy policy.
    for state_demo in policy_pi_demo:  # Improve each nonterminal state's action.
        q_row_demo = [q_backup_demo(state_demo, action_demo, values_pi_demo, gamma_demo) for action_demo in actions_demo[state_demo]]  # Score all actions.
        improved_policy_demo[state_demo] = actions_demo[state_demo][int(np.argmax(q_row_demo))]  # Choose the greedy action.
    changed_demo = sum(policy_pi_demo[state_demo] != improved_policy_demo[state_demo] for state_demo in policy_pi_demo)  # Count changed actions.
    changes_pi_demo.append(changed_demo)  # Store this iteration's change count.
    log(f"policy-iteration round {iteration_demo + 1}", {"old": policy_pi_demo, "new": improved_policy_demo, "changed": changed_demo})  # Print old and new policies.
    policy_pi_demo = improved_policy_demo  # Adopt the improved policy.
    if changed_demo == 0:  # Stop if greedy improvement no longer changes anything.
        break  # End policy iteration once stable.
plt.bar(np.arange(1, len(changes_pi_demo) + 1), changes_pi_demo, color="darkorange", edgecolor="black")  # Plot changed actions per improvement.
plt.xlabel("policy-improvement round")  # Label the iteration axis.
plt.ylabel("number of changed actions")  # Label the change count.
plt.title("Step 10: policy iteration stops when improvement changes nothing")  # Title the plot.
plt.show()  # Display the policy-iteration change chart.
```
▶ What you'll see: the weak starting policy is replaced by a stable greedy policy.

### Step 11 — Model-based Monte Carlo: estimate the model from samples

If the transition table is unknown, sampled experience can estimate it. Model-based Monte Carlo
counts how often each successor appears after a state-action pair, then normalizes counts into probabilities.

```python
def sample_transition_demo(state_demo, action_demo):  # Sample one transition from the tiny MDP.
    outcomes_demo = transitions_demo[(state_demo, action_demo)]  # Read all possible outcomes for this state-action pair.
    probs_demo = np.array([prob_demo for prob_demo, next_state_demo, reward_demo in outcomes_demo])  # Extract probabilities.
    index_demo = int(np.random.choice(len(outcomes_demo), p=probs_demo))  # Draw one outcome index using those probabilities.
    prob_demo, next_state_demo, reward_demo = outcomes_demo[index_demo]  # Unpack the sampled transition.
    return next_state_demo, reward_demo  # Return only what an agent would observe.

triple_counts_demo = {}  # Count observed (state, action, next_state) triples.
pair_counts_demo = {}  # Count observed (state, action) pairs.
reward_sums_demo = {}  # Sum rewards for each observed triple.
for episode_demo in range(250):  # Generate many short random episodes.
    state_demo = start_state_demo  # Reset each episode to the start state.
    for step_demo in range(4):  # Cap each episode so the demo stays fast.
        if state_demo in terminal_states_demo:  # Stop when a terminal state is reached.
            break  # End this sampled episode.
        action_demo = actions_demo[state_demo][int(np.random.choice(len(actions_demo[state_demo])))]  # Choose a random legal action.
        next_state_demo, reward_demo = sample_transition_demo(state_demo, action_demo)  # Observe one sampled transition.
        triple_key_demo = (state_demo, action_demo, next_state_demo)  # Build the transition-count key.
        pair_key_demo = (state_demo, action_demo)  # Build the state-action-count key.
        triple_counts_demo[triple_key_demo] = triple_counts_demo.get(triple_key_demo, 0) + 1  # Increment the triple count.
        pair_counts_demo[pair_key_demo] = pair_counts_demo.get(pair_key_demo, 0) + 1  # Increment the pair count.
        reward_sums_demo[triple_key_demo] = reward_sums_demo.get(triple_key_demo, 0.0) + reward_demo  # Accumulate observed rewards.
        state_demo = next_state_demo  # Move to the successor.
inspect_pair_demo = ("A", "safe")  # Choose one state-action pair to inspect.
true_probs_demo = [prob_demo for prob_demo, next_state_demo, reward_demo in transitions_demo[inspect_pair_demo]]  # Read true probabilities.
est_probs_demo = []  # Store estimated probabilities for the same successors.
next_labels_demo = []  # Store successor labels.
for prob_demo, next_state_demo, reward_demo in transitions_demo[inspect_pair_demo]:  # Compare true and estimated successor masses.
    count_demo = triple_counts_demo.get((inspect_pair_demo[0], inspect_pair_demo[1], next_state_demo), 0)  # Read the observed successor count.
    total_demo = pair_counts_demo.get(inspect_pair_demo, 1)  # Read the total visits to this state-action pair.
    est_prob_demo = count_demo / total_demo  # Normalize the count into an estimated probability.
    est_probs_demo.append(est_prob_demo)  # Store the estimate.
    next_labels_demo.append(next_state_demo)  # Store the successor label.
    log(f"estimated T{inspect_pair_demo}->{next_state_demo}", round(est_prob_demo, 3))  # Print the estimated probability.
x_demo = np.arange(len(next_labels_demo))  # Create x positions for paired bars.
plt.bar(x_demo - 0.18, true_probs_demo, width=0.36, label="true T", color="steelblue")  # Plot true probabilities.
plt.bar(x_demo + 0.18, est_probs_demo, width=0.36, label="estimated T-hat", color="orange")  # Plot estimated probabilities.
plt.xticks(x_demo, next_labels_demo)  # Label each successor state.
plt.ylim(0.0, 1.0)  # Use probability scale.
plt.ylabel("probability")  # Label the probability axis.
plt.title("Step 11: model-based Monte Carlo estimates T from counts")  # Title the model-estimation plot.
plt.legend()  # Show true versus estimated labels.
plt.show()  # Display the comparison.
```
▶ What you'll see: the estimated probabilities are close to the true transition probabilities.

### Step 12 — Model-free Monte Carlo: average sampled returns directly

Model-free Monte Carlo skips estimating $T$ and rewards. It runs episodes, computes the realized
return after each visited state-action pair, and averages those returns into $\widehat Q_\pi(s,a)$.

```python
returns_mc_demo = {}  # Store a list of returns for each observed state-action pair.
for episode_demo in range(120):  # Run many episodes under the fixed beginner policy.
    trajectory_demo = []  # Store (state, action, reward) tuples for this episode.
    state_demo = start_state_demo  # Start at A.
    for step_demo in range(4):  # Keep episodes short for the tiny chain.
        if state_demo in terminal_states_demo:  # Stop at terminal state.
            break  # End this episode.
        action_demo = policy_demo[state_demo]  # Follow the fixed policy.
        next_state_demo, reward_demo = sample_transition_demo(state_demo, action_demo)  # Sample one transition.
        trajectory_demo.append((state_demo, action_demo, reward_demo))  # Save the experience for return calculation.
        state_demo = next_state_demo  # Advance to the next state.
    return_so_far_demo = 0.0  # Initialize the backward discounted return.
    for state_demo, action_demo, reward_demo in reversed(trajectory_demo):  # Walk backward through the episode.
        return_so_far_demo = reward_demo + gamma_demo * return_so_far_demo  # Update the return from this time step.
        returns_mc_demo.setdefault((state_demo, action_demo), []).append(return_so_far_demo)  # Store this sampled return.
q_mc_demo = {key_demo: float(np.mean(values_demo)) for key_demo, values_demo in returns_mc_demo.items()}  # Average returns into Q estimates.
for key_demo in sorted(q_mc_demo):  # Print learned model-free action values.
    log(f"MC Q{key_demo}", round(q_mc_demo[key_demo], 3))  # Report one averaged return estimate.
labels_mc_demo = [f"{key_demo[0]}-{key_demo[1]}" for key_demo in q_mc_demo]  # Build labels for plotting.
values_mc_demo = [q_mc_demo[key_demo] for key_demo in q_mc_demo]  # Build values for plotting.
plt.bar(labels_mc_demo, values_mc_demo, color="seagreen", edgecolor="black")  # Plot the model-free Q estimates.
plt.ylabel("average sampled return")  # Label the return axis.
plt.title("Step 12: model-free Monte Carlo averages returns")  # Title the plot.
plt.show()  # Display the MC value estimates.
```
▶ What you'll see: Q estimates appear without ever normalizing transition counts.

### Step 13 — SARSA: update using the next action actually taken

SARSA is on-policy: its target uses the action the behavior policy really chooses next. That means
exploration affects the values being learned.

```python
q_sarsa_demo = {(state_demo, action_demo): 0.0 for state_demo in states_demo for action_demo in actions_demo[state_demo]}  # Initialize a tabular SARSA Q table.
alpha_demo = 0.45  # Use a visible learning rate for the short demo.
epsilon_demo = 0.25  # Explore sometimes while learning.
rewards_sarsa_demo = []  # Track episode returns.
for episode_demo in range(60):  # Run a small number of SARSA episodes.
    state_demo = start_state_demo  # Reset to the start state.
    action_demo = actions_demo[state_demo][int(np.random.choice(len(actions_demo[state_demo])))] if np.random.rand() < epsilon_demo else actions_demo[state_demo][int(np.argmax([q_sarsa_demo[(state_demo, a_demo)] for a_demo in actions_demo[state_demo]]))]  # Choose the initial epsilon-greedy action.
    total_reward_demo = 0.0  # Reset this episode's reward total.
    for step_demo in range(5):  # Limit episode length.
        next_state_demo, reward_demo = sample_transition_demo(state_demo, action_demo)  # Sample the environment.
        total_reward_demo += reward_demo  # Accumulate realized reward.
        if next_state_demo in terminal_states_demo:  # Handle terminal next state.
            target_demo = reward_demo  # Terminal SARSA target has no future action.
            next_action_demo = None  # Store no next action.
        else:  # Choose the actual next behavior action.
            next_action_demo = actions_demo[next_state_demo][int(np.random.choice(len(actions_demo[next_state_demo])))] if np.random.rand() < epsilon_demo else actions_demo[next_state_demo][int(np.argmax([q_sarsa_demo[(next_state_demo, a_demo)] for a_demo in actions_demo[next_state_demo]]))]  # Draw epsilon-greedy next action.
            target_demo = reward_demo + gamma_demo * q_sarsa_demo[(next_state_demo, next_action_demo)]  # Use the sampled next action in the target.
        old_q_demo = q_sarsa_demo[(state_demo, action_demo)]  # Read the old Q estimate.
        q_sarsa_demo[(state_demo, action_demo)] = old_q_demo + alpha_demo * (target_demo - old_q_demo)  # Move toward the SARSA target.
        if episode_demo < 2:  # Print only the first few episodes to keep logs readable.
            log("SARSA update", f"s={state_demo}, a={action_demo}, target={target_demo:.3f}, newQ={q_sarsa_demo[(state_demo, action_demo)]:.3f}")  # Show the update arithmetic.
        if next_state_demo in terminal_states_demo:  # Stop after terminal transition.
            break  # End the episode.
        state_demo, action_demo = next_state_demo, next_action_demo  # Continue with the actual next state and action.
    rewards_sarsa_demo.append(total_reward_demo)  # Save episode reward.
q_sarsa_matrix_demo = np.array([[q_sarsa_demo.get((state_demo, action_demo), np.nan) for action_demo in ["safe", "risky", "finish", "reset"]] for state_demo in states_demo])  # Convert Q to a display matrix.
plt.imshow(q_sarsa_matrix_demo, cmap="viridis", aspect="auto")  # Plot SARSA Q values as a heatmap.
plt.xticks(range(4), ["safe", "risky", "finish", "reset"], rotation=20)  # Label action columns.
plt.yticks(range(len(states_demo)), states_demo)  # Label state rows.
plt.colorbar(label="SARSA Q")  # Add a colorbar for values.
plt.title("Step 13: SARSA learns from actual next actions")  # Title the heatmap.
plt.show()  # Display the SARSA table.
```
▶ What you'll see: early logs show targets using the next sampled action, and the heatmap shows learned Q values.

### Step 14 — Q-learning: update using the greedy next-action value

Q-learning is off-policy: even when the behavior explores, the target assumes the next state will
use its best currently known action. The update bootstraps from $\max_{a'}Q(s',a')$.

```python
q_learning_demo = {(state_demo, action_demo): 0.0 for state_demo in states_demo for action_demo in actions_demo[state_demo]}  # Initialize a Q-learning table.
rewards_q_demo = []  # Track episode rewards.
for episode_demo in range(60):  # Run a small number of Q-learning episodes.
    state_demo = start_state_demo  # Reset to A.
    total_reward_demo = 0.0  # Reset the episode reward.
    for step_demo in range(5):  # Limit episode length.
        if np.random.rand() < epsilon_demo:  # Explore with probability epsilon.
            action_demo = actions_demo[state_demo][int(np.random.choice(len(actions_demo[state_demo])))]  # Choose a random legal action.
        else:  # Exploit otherwise.
            action_demo = actions_demo[state_demo][int(np.argmax([q_learning_demo[(state_demo, a_demo)] for a_demo in actions_demo[state_demo]]))]  # Choose the greedy current action.
        next_state_demo, reward_demo = sample_transition_demo(state_demo, action_demo)  # Sample one transition.
        total_reward_demo += reward_demo  # Accumulate the reward.
        best_next_demo = 0.0 if next_state_demo in terminal_states_demo else max(q_learning_demo[(next_state_demo, a_demo)] for a_demo in actions_demo[next_state_demo])  # Compute max next Q.
        target_demo = reward_demo + gamma_demo * best_next_demo  # Build the Q-learning target.
        old_q_demo = q_learning_demo[(state_demo, action_demo)]  # Read the old Q value.
        q_learning_demo[(state_demo, action_demo)] = old_q_demo + alpha_demo * (target_demo - old_q_demo)  # Move toward the greedy target.
        if episode_demo < 2:  # Print only early updates.
            log("Q-learning update", f"s={state_demo}, a={action_demo}, target={target_demo:.3f}, newQ={q_learning_demo[(state_demo, action_demo)]:.3f}")  # Show the target and new value.
        if next_state_demo in terminal_states_demo:  # Stop after terminal state.
            break  # End this episode.
        state_demo = next_state_demo  # Continue from the sampled successor.
    rewards_q_demo.append(total_reward_demo)  # Save episode reward.
q_learning_matrix_demo = np.array([[q_learning_demo.get((state_demo, action_demo), np.nan) for action_demo in ["safe", "risky", "finish", "reset"]] for state_demo in states_demo])  # Convert Q-learning values to a display matrix.
plt.imshow(q_learning_matrix_demo, cmap="magma", aspect="auto")  # Plot Q-learning Q values as a heatmap.
plt.xticks(range(4), ["safe", "risky", "finish", "reset"], rotation=20)  # Label action columns.
plt.yticks(range(len(states_demo)), states_demo)  # Label state rows.
plt.colorbar(label="Q-learning Q")  # Add a colorbar for values.
plt.title("Step 14: Q-learning bootstraps from max next Q")  # Title the heatmap.
plt.show()  # Display the Q-learning table.
```
▶ What you'll see: Q-learning logs use the greedy next value, not necessarily the next action sampled by exploration.

### Step 15 — Epsilon-greedy exploration: sometimes try, usually trust

Epsilon-greedy chooses a random action with probability $\epsilon$ and the greedy action otherwise.
We hold one Q row fixed and vary $\epsilon$ so the exploration/exploitation tradeoff is visible.

```python
q_choice_demo = np.array([0.20, 1.00])  # Store one state's Q values where action 1 is greedy.
action_names_demo = np.array(["left", "right"])  # Name the two possible actions.
greedy_index_demo = int(np.argmax(q_choice_demo))  # Find the greedy action index.
epsilons_demo = np.array([0.0, 0.1, 0.3, 0.7, 1.0])  # Try exploration rates from none to all-random.
greedy_rates_demo = []  # Store the simulated probability of choosing the greedy action.
for epsilon_value_demo in epsilons_demo:  # Test each epsilon value.
    choices_demo = []  # Store repeated choices for this epsilon.
    for trial_demo in range(2000):  # Repeat many times to estimate the probability.
        if np.random.rand() < epsilon_value_demo:  # Explore with probability epsilon.
            choice_demo = int(np.random.choice(len(action_names_demo)))  # Pick a uniformly random action.
        else:  # Exploit with probability 1 - epsilon.
            choice_demo = greedy_index_demo  # Pick the greedy action.
        choices_demo.append(choice_demo)  # Store the selected action.
    greedy_rate_demo = float(np.mean(np.array(choices_demo) == greedy_index_demo))  # Estimate how often the chosen action was greedy.
    greedy_rates_demo.append(greedy_rate_demo)  # Save the empirical rate.
    log(f"epsilon={epsilon_value_demo:.1f}", f"greedy action chosen {greedy_rate_demo:.3f}")  # Print the tradeoff.
expected_rates_demo = (1.0 - epsilons_demo) + epsilons_demo / len(action_names_demo)  # Compute the theoretical greedy-choice rate.
plt.plot(epsilons_demo, greedy_rates_demo, marker="o", label="simulated greedy-choice rate")  # Plot simulated rates.
plt.plot(epsilons_demo, expected_rates_demo, linestyle="--", label="expected rate")  # Plot the probability formula.
plt.xlabel("epsilon")  # Label the exploration knob.
plt.ylabel("P(chosen action is greedy)")  # Label the outcome probability.
plt.title("Step 15: epsilon-greedy trades exploitation for exploration")  # Title the plot.
plt.legend()  # Show simulated and expected labels.
plt.show()  # Display the epsilon-greedy chart.
```
▶ What you'll see: as $\epsilon$ rises, greedy choices become less frequent because more decisions explore.

### Recap — what you just ran

- You built a complete tiny **MDP** with states, actions, transition probabilities, rewards, terminal states, and discounting.
- You evaluated a fixed **policy**, checked the **Bellman expectation equation**, and found greedy **optimal** actions.
- You compared **policy evaluation**, **value iteration**, and **policy iteration** as planning methods.
- You learned from samples using **model-based Monte Carlo**, **model-free Monte Carlo**, **SARSA**, and **Q-learning**.
- You saw how **epsilon-greedy** exploration controls the balance between trying actions and trusting current values.

Everything below (starting at **§1 Overview**) develops these same ideas with full derivations,
more examples, and larger gridworld experiments.

---

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

### Setup

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



### 📖 Concept walkthrough — build each idea from scratch

Before the warm-up examples, we build the main MDP ideas from scratch with only NumPy + Matplotlib. The data is a tiny 1-D chain MDP so every number is inspectable, and variables use a `_w` suffix so they do not collide with later examples. Each subsection starts with the idea, then makes the arithmetic visible before plotting what changed.

```python
import numpy as np  # Use NumPy for small arrays, vectorized sums, and seeded random choices in the walkthrough.
import matplotlib.pyplot as plt  # Use Matplotlib so each dynamic-programming or learning step can be checked visually.
np.random.seed(33)  # Fix randomness so the Q-learning and epsilon-greedy demonstrations are reproducible.
```

#### 1. Return and discounting: turn a reward stream into one number

A trajectory gives rewards over time, but an agent needs one score for the whole future. The discounted return does that with

$$
G=\sum_{t=0}^{T-1}\gamma^t r_t.
$$

We build the sum term by term because discounting has two jobs: it makes far-future rewards count less, and when $\gamma<1$ it makes infinite reward sums finite. This approach lets you see exactly how a delayed reward changes as $\gamma$ changes.

```python
rewards_w = np.array([2.0, 0.0, 0.0, 10.0])  # Store a short reward stream with a small reward now and a larger reward later.
gamma_one_w = 0.8  # Pick one discount factor to inspect term by term.
times_w = np.arange(len(rewards_w))  # Create time indices t = 0, 1, 2, 3 for the powers of gamma.
weights_w = gamma_one_w ** times_w  # Compute discount weights gamma^t for each reward time.
terms_w = weights_w * rewards_w  # Multiply each reward by its discount weight to form the contribution to G.
print("rewards:", rewards_w)  # Print the raw rewards before discounting.
print("discount weights:", np.round(weights_w, 3))  # Print how strongly each time step is weighted.
print("discounted terms:", np.round(terms_w, 3))  # Print each piece of the return sum.
print("G at gamma=0.8:", round(float(np.sum(terms_w)), 3))  # Add the pieces to get the scalar return.
```
▶ What you'll see: the delayed reward of `10` is still useful, but it is reduced by $0.8^3$ before entering $G$.

```python
gammas_w = np.array([0.0, 0.25, 0.5, 0.8, 0.95, 0.99])  # Compare several discount factors from myopic to patient.
returns_w = []  # Collect one discounted return per gamma value.
for gamma_w in gammas_w:  # Sweep the discount factors one at a time.
    powers_w = gamma_w ** times_w  # Compute gamma^t for this discount factor.
    return_w = float(np.sum(powers_w * rewards_w))  # Sum the discounted rewards for this gamma.
    returns_w.append(return_w)  # Save the result for printing and plotting.
    print(f"gamma={gamma_w:.2f} -> G={return_w:.3f}")  # Print the numeric return so the trend is inspectable.
```
▶ What you'll see: $G$ grows as $\gamma$ increases because the delayed `10` is discounted less harshly.

```python
geom_gammas_w = np.array([0.5, 0.8, 0.95])  # Choose gamma values that make the infinite-series effect visible.
for gamma_w in geom_gammas_w:  # Inspect each discount factor separately.
    finite_sum_w = float(np.sum(gamma_w ** np.arange(20)))  # Approximate the first 20 terms of 1 + gamma + gamma^2 + ....
    exact_sum_w = 1.0 / (1.0 - gamma_w)  # Use the geometric-series formula for the infinite sum when gamma < 1.
    print(f"gamma={gamma_w:.2f}: first 20 terms {finite_sum_w:.3f}, infinite sum {exact_sum_w:.3f}")  # Compare finite and infinite totals.
```
Discounting makes an endless stream manageable because $1+\gamma+\gamma^2+\cdots=1/(1-\gamma)$ when $0\le\gamma<1$. It also encodes a preference for sooner rewards: the same $10$ is worth $10$ now but only $\gamma^3\cdot 10$ three steps later.
▶ What you'll see: the infinite sum is finite for each $\gamma<1$, but it gets larger as $\gamma$ approaches 1.

```python
plt.figure(figsize=(5.5, 3.2))  # Create a compact figure for return sensitivity.
plt.plot(gammas_w, returns_w, marker="o", linewidth=2)  # Plot the discounted return as gamma changes.
plt.xlabel("discount factor gamma")  # Label the horizontal axis with the planning parameter.
plt.ylabel("discounted return G")  # Label the vertical axis with the trajectory score.
plt.title("1: return grows as delayed rewards matter more")  # Title the plot with the subsection number.
plt.grid(True, alpha=0.3)  # Add a light grid so the increase is easy to read.
plt.show()  # Render the return-vs-gamma figure.
```
▶ What you'll see: a rising curve; larger $\gamma$ means the future reward contributes more to the total return.

*Why it's done this way: computing every discounted term first makes the return formula concrete, then sweeping $\gamma$ shows both interpretations of discounting — finite infinite-horizon sums and a tunable preference for sooner payoff.*

#### 2. Bellman equation and policy evaluation: solve the value fixed point

For a fixed policy $\pi$, the value of a state is the expected immediate reward plus discounted value of the next state:

$$
V_\pi(s)=\sum_{s'}P(s'\mid s,\pi(s))\left[r(s,\pi(s),s')+\gamma V_\pi(s')\right].
$$

This is a fixed-point equation because the unknown value appears on both sides. We evaluate a simple "always move right" policy by repeatedly applying the Bellman backup until the values stop changing.

```python
n_states_w = 4  # Use a tiny chain with states 0, 1, 2, and terminal state 3.
terminal_w = 3  # Mark the rightmost state as terminal.
gamma_eval_w = 0.9  # Use a high discount factor so future terminal reward propagates leftward.
policy_w = np.array([1, 1, 1, -1])  # Encode the fixed policy: action 1 means move right, terminal has no action.
next_right_w = np.array([1, 2, 3, 3])  # Store the deterministic successor when moving right from each state.
reward_right_w = np.array([-0.1, -0.1, 1.0, 0.0])  # Store step costs and the reward for entering the terminal state.
V_eval_w = np.zeros(n_states_w)  # Initialize every state's value to zero before policy evaluation.
print("initial V:", np.round(V_eval_w, 3))  # Print the starting value function.
```
▶ What you'll see: all values start at zero, so no state has learned about the terminal reward yet.

```python
history_eval_w = [V_eval_w.copy()]  # Store each sweep so we can plot convergence.
for sweep_w in range(6):  # Run a few synchronous Bellman sweeps.
    old_V_w = V_eval_w.copy()  # Freeze the previous values so all states update from the same old estimate.
    for state_w in range(n_states_w):  # Visit each state in the chain.
        if state_w == terminal_w:  # Keep the terminal state's continuation value fixed.
            V_eval_w[state_w] = 0.0  # Terminal states have zero future value after arrival.
        else:  # Evaluate the policy action for a nonterminal state.
            next_state_w = next_right_w[state_w]  # Look up the next state under the fixed right action.
            reward_w = reward_right_w[state_w]  # Look up the immediate reward for that transition.
            V_eval_w[state_w] = reward_w + gamma_eval_w * old_V_w[next_state_w]  # Apply the Bellman expectation backup.
    history_eval_w.append(V_eval_w.copy())  # Save the values after this sweep.
    print(f"sweep {sweep_w + 1}:", np.round(V_eval_w, 3))  # Print values so convergence is visible.
```
▶ What you'll see: the terminal reward reaches state 2 first, then backs up to states 1 and 0 over later sweeps.

```python
bellman_check_w = reward_right_w[0] + gamma_eval_w * V_eval_w[next_right_w[0]]  # Recompute the right side for state 0.
print("left side V(0):", round(float(V_eval_w[0]), 3))  # Print the converged value estimate at state 0.
print("right side r + gamma V(next):", round(float(bellman_check_w), 3))  # Print the Bellman backup value for comparison.
```
The fixed point is reached when applying the update no longer changes $V_\pi$. At that point the left side and right side agree, so the value function is self-consistent with the policy's future behavior.
▶ What you'll see: the two numbers match after the reward has fully propagated through the short chain.

```python
history_eval_w = np.array(history_eval_w)  # Convert saved sweeps to an array for plotting.
plt.figure(figsize=(5.8, 3.2))  # Create a compact convergence plot.
for state_w in range(n_states_w):  # Plot one curve per state.
    plt.plot(history_eval_w[:, state_w], marker="o", label=f"V({state_w})")  # Show how that state's value changes by sweep.
plt.xlabel("Bellman sweep")  # Label the x-axis with the dynamic-programming iteration.
plt.ylabel("value under fixed policy")  # Label the y-axis with the evaluated state value.
plt.title("2: policy evaluation converges to Bellman fixed point")  # Title the plot with the subsection number.
plt.legend()  # Show which curve belongs to which state.
plt.grid(True, alpha=0.3)  # Add a light grid for readability.
plt.show()  # Render the convergence figure.
```
▶ What you'll see: state values flatten once the fixed policy's future reward has backed up to every predecessor.

*Why it's done this way: synchronous Bellman sweeps make the circular definition operational — start with guesses, repeatedly apply the expectation equation, and stop when the guesses are unchanged by the equation that defines them.*

#### 3. Value iteration: use the max backup to find the optimal value

Policy evaluation answers "how good is this policy?" Value iteration answers "what is the best policy?" by replacing the policy action with a maximization:

$$
V_*(s)=\max_a\sum_{s'}P(s'\mid s,a)\left[r(s,a,s')+\gamma V_*(s')\right].
$$

The $\max$ matters because each backup assumes the agent will choose the best available action from the current state. We build left/right actions on the same chain, then extract the greedy policy from the final values.

```python
actions_w = np.array([-1, 1])  # Encode action 0 as left (-1) and action 1 as right (+1).
action_names_w = np.array(["L", "R"])  # Store readable action labels for printing the greedy policy.
gamma_vi_w = 0.9  # Use the same discount factor so value iteration is comparable to policy evaluation.
V_vi_w = np.zeros(n_states_w)  # Initialize optimal values to zero before Bellman optimality backups.
print("actions:", action_names_w)  # Print the two available actions.
print("initial optimal-value guess:", V_vi_w)  # Print the starting values.
```
▶ What you'll see: value iteration starts with no preference because every value is initially zero.

```python
history_vi_w = [V_vi_w.copy()]  # Store value snapshots for convergence plotting.
deltas_vi_w = []  # Store the largest value change per sweep.
for sweep_w in range(8):  # Run enough sweeps for this short chain to settle.
    old_V_w = V_vi_w.copy()  # Freeze previous values for a synchronous optimality update.
    for state_w in range(n_states_w):  # Visit every state.
        if state_w == terminal_w:  # Handle the terminal state separately.
            V_vi_w[state_w] = 0.0  # Terminal continuation value remains zero.
        else:  # Compute action candidates for a nonterminal state.
            q_values_w = []  # Collect one one-step lookahead value per action.
            for move_w in actions_w:  # Try left and right.
                next_state_w = int(np.clip(state_w + move_w, 0, terminal_w))  # Move in the chain while staying inside bounds.
                reward_w = 1.0 if next_state_w == terminal_w else -0.1  # Give +1 for entering terminal and -0.1 otherwise.
                q_values_w.append(reward_w + gamma_vi_w * old_V_w[next_state_w])  # Add immediate reward plus discounted continuation.
            V_vi_w[state_w] = float(np.max(q_values_w))  # Keep the best action value as the optimal value estimate.
    delta_w = float(np.max(np.abs(V_vi_w - old_V_w)))  # Measure the largest change this sweep.
    deltas_vi_w.append(delta_w)  # Save the convergence diagnostic.
    history_vi_w.append(V_vi_w.copy())  # Save the value snapshot.
    print(f"sweep {sweep_w + 1}: V={np.round(V_vi_w, 3)}, delta={delta_w:.3f}")  # Print the update progress.
```
▶ What you'll see: the best terminal reward backs up through the chain, and the largest change eventually becomes zero.

```python
policy_vi_w = []  # Collect the greedy action for each nonterminal state.
for state_w in range(n_states_w - 1):  # Extract actions only for nonterminal states.
    q_values_w = []  # Store action values under the final V estimate.
    for move_w in actions_w:  # Compare left and right from this state.
        next_state_w = int(np.clip(state_w + move_w, 0, terminal_w))  # Compute the deterministic successor.
        reward_w = 1.0 if next_state_w == terminal_w else -0.1  # Compute the immediate reward.
        q_values_w.append(reward_w + gamma_vi_w * V_vi_w[next_state_w])  # Compute the one-step lookahead value.
    best_index_w = int(np.argmax(q_values_w))  # Select the action with the largest backed-up value.
    policy_vi_w.append(action_names_w[best_index_w])  # Save the readable greedy action.
    print(f"state {state_w}: Q(L/R)={np.round(q_values_w, 3)} -> greedy {action_names_w[best_index_w]}")  # Print the policy extraction.
```
The optimality backup is the same expectation calculation as policy evaluation, but with a maximization over actions. That $\max$ turns evaluation into control: it asks what value is possible if the agent chooses optimally now and then continues optimally.
▶ What you'll see: every nonterminal state chooses `R`, moving toward the terminal reward despite the step cost.

```python
history_vi_w = np.array(history_vi_w)  # Convert snapshots to an array for plotting.
fig_w, ax_w = plt.subplots(1, 2, figsize=(8.5, 3.2))  # Create side-by-side panels for values and convergence.
for state_w in range(n_states_w):  # Draw one value curve per state.
    ax_w[0].plot(history_vi_w[:, state_w], marker="o", label=f"V({state_w})")  # Plot value estimates over sweeps.
ax_w[0].set_title("3: optimal values by sweep")  # Title the first panel with the subsection number.
ax_w[0].set_xlabel("sweep")  # Label the sweep axis.
ax_w[0].set_ylabel("value")  # Label the value axis.
ax_w[0].legend()  # Show state labels.
ax_w[1].plot(deltas_vi_w, marker="o", color="crimson")  # Plot the maximum update size per sweep.
ax_w[1].set_title("3: Bellman error shrinks")  # Title the second panel.
ax_w[1].set_xlabel("sweep")  # Label the sweep axis.
ax_w[1].set_ylabel("max |new - old|")  # Label the convergence diagnostic.
plt.tight_layout()  # Prevent labels from overlapping.
plt.show()  # Render the value-iteration figure.
```
▶ What you'll see: value curves stabilize and the update size drops to zero once the optimal values have propagated.

*Why it's done this way: computing every action backup before taking `max` exposes the control step directly — value iteration is policy evaluation plus the assumption that future choices will be greedy with respect to the best value found so far.*

#### 4. Q-learning: learn action values from sampled transitions without a model

Planning used a transition model. Q-learning instead updates from experience tuples $(s,a,r,s')$:

$$
Q(s,a)\leftarrow Q(s,a)+\alpha\left[r+\gamma\max_{a'}Q(s',a')-Q(s,a)\right].
$$

The bracketed term is a temporal-difference error: a new bootstrapped target minus the current estimate. We simulate transitions on the chain so the update can be inspected without ever storing transition probabilities.

```python
Q_w = np.zeros((n_states_w, len(actions_w)))  # Initialize a tabular Q-value for every state-action pair.
alpha_w = 0.5  # Use a large learning rate so changes are visible in a short run.
gamma_q_w = 0.9  # Use the same discount factor as planning.
epsilon_q_w = 0.3  # Explore sometimes so both actions can be sampled.
state_q_w = 0  # Start each demonstration episode at the left edge of the chain.
print("initial Q table:\n", Q_w)  # Print the all-zero action-value table.
```
▶ What you'll see: Q-learning begins with no model and no value estimates, just a table of zeros.

```python
for step_w in range(12):  # Run a small number of sampled transitions.
    if np.random.rand() < epsilon_q_w:  # Explore with probability epsilon.
        action_index_w = int(np.random.choice(len(actions_w)))  # Pick a random action index when exploring.
    else:  # Exploit otherwise.
        action_index_w = int(np.argmax(Q_w[state_q_w]))  # Pick the currently greedy action for the current state.
    next_state_w = int(np.clip(state_q_w + actions_w[action_index_w], 0, terminal_w))  # Simulate the chosen move in the chain.
    reward_w = 1.0 if next_state_w == terminal_w else -0.1  # Observe the sampled reward after the move.
    best_next_w = 0.0 if next_state_w == terminal_w else float(np.max(Q_w[next_state_w]))  # Bootstrap from the best next action value.
    target_w = reward_w + gamma_q_w * best_next_w  # Build the TD target r + gamma max Q(s', a').
    td_error_w = target_w - Q_w[state_q_w, action_index_w]  # Compare the target to the current estimate.
    Q_w[state_q_w, action_index_w] += alpha_w * td_error_w  # Move the estimate partway toward the target.
    print(f"step {step_w + 1}: s={state_q_w}, a={action_names_w[action_index_w]}, r={reward_w:.1f}, s'={next_state_w}, target={target_w:.3f}, Q={np.round(Q_w, 3)}")  # Print the full update.
    state_q_w = 0 if next_state_w == terminal_w else next_state_w  # Reset after terminal, otherwise continue from the successor.
```
▶ What you'll see: the right action near the terminal learns first, then earlier state-action values start bootstrapping from it.

```python
manual_state_w = 1  # Choose one state-action pair for a transparent TD arithmetic check.
manual_action_w = 1  # Choose the right action for that state.
manual_next_w = int(np.clip(manual_state_w + actions_w[manual_action_w], 0, terminal_w))  # Compute the sampled successor.
manual_reward_w = 1.0 if manual_next_w == terminal_w else -0.1  # Compute the sampled reward.
manual_target_w = manual_reward_w + gamma_q_w * np.max(Q_w[manual_next_w])  # Build the bootstrapped target from the current Q table.
print("current Q(s,a):", round(float(Q_w[manual_state_w, manual_action_w]), 3))  # Print the estimate before another hypothetical update.
print("TD target:", round(float(manual_target_w), 3))  # Print the model-free target.
print("TD error:", round(float(manual_target_w - Q_w[manual_state_w, manual_action_w]), 3))  # Print the correction signal.
```
Q-learning needs no transition model because it uses the one successor actually sampled. It still looks ahead by bootstrapping from $\max_{a'}Q(s',a')$, which is why information can propagate backward from rewarding states.
▶ What you'll see: the target is built from one observed reward plus the current best estimate for the next state.

```python
plt.figure(figsize=(5.5, 3.2))  # Create a compact heatmap for learned action values.
plt.imshow(Q_w, cmap="viridis", aspect="auto")  # Display the Q table as colors.
plt.colorbar(label="Q value")  # Add a colorbar so magnitudes are readable.
plt.xticks(range(len(actions_w)), action_names_w)  # Label columns by action name.
plt.yticks(range(n_states_w), [f"state {state_w}" for state_w in range(n_states_w)])  # Label rows by state.
plt.title("4: Q-learning table after sampled TD updates")  # Title the figure with the subsection number.
plt.xlabel("action")  # Label the action axis.
plt.ylabel("state")  # Label the state axis.
plt.show()  # Render the Q-value heatmap.
```
▶ What you'll see: actions that move toward the terminal reward become brighter than unhelpful actions.

*Why it's done this way: each update uses only sampled experience plus the current table, so the algorithm can learn when $P(s'\mid s,a)$ and rewards are not known in advance; the TD target is the bridge from raw samples to long-term value.*

#### 5. Epsilon-greedy exploration: balance trying and trusting

A greedy learner always picks the action with the largest current $Q$, but early estimates can be wrong. Epsilon-greedy fixes that by choosing the greedy action with probability $1-\epsilon$ and a random action with probability $\epsilon$:

$$
\pi_{\text{act}}(s)=
\begin{cases}
\operatorname*{argmax}_a Q(s,a) & \text{with probability }1-\epsilon\\
\text{random action} & \text{with probability }\epsilon.
\end{cases}
$$

We hold one state's Q-values fixed and vary $\epsilon$ so the exploration/exploitation tradeoff is visible directly.

```python
q_choice_w = np.array([0.2, 1.0])  # Create one state's action values where right is currently greedy.
greedy_index_w = int(np.argmax(q_choice_w))  # Find the greedy action index from the Q values.
epsilons_w = np.array([0.0, 0.1, 0.3, 0.7, 1.0])  # Try exploration rates from never explore to always random.
n_trials_w = 2000  # Use enough repeated choices to estimate action probabilities smoothly.
print("Q values for one state:", q_choice_w)  # Print the fixed action values.
print("greedy action:", action_names_w[greedy_index_w])  # Print which action exploitation would choose.
```
▶ What you'll see: action `R` is greedy because its current Q-value is larger.

```python
greedy_rates_w = []  # Store the fraction of choices that equal the greedy action.
random_rates_w = []  # Store the requested random-choice probability epsilon for comparison.
for epsilon_w in epsilons_w:  # Evaluate each exploration rate.
    choices_w = []  # Collect sampled action indices for this epsilon.
    for trial_w in range(n_trials_w):  # Repeat many action selections.
        if np.random.rand() < epsilon_w:  # Explore with probability epsilon.
            chosen_w = int(np.random.choice(len(q_choice_w)))  # Choose uniformly at random from actions.
        else:  # Exploit with probability 1 - epsilon.
            chosen_w = greedy_index_w  # Choose the current greedy action.
        choices_w.append(chosen_w)  # Store the sampled action.
    choices_w = np.array(choices_w)  # Convert sampled choices to an array for counting.
    greedy_rate_w = float(np.mean(choices_w == greedy_index_w))  # Measure how often the final chosen action was greedy.
    greedy_rates_w.append(greedy_rate_w)  # Save the empirical greedy-action rate.
    random_rates_w.append(float(epsilon_w))  # Save epsilon itself as the requested exploration rate.
    print(f"epsilon={epsilon_w:.1f}: chose greedy action {greedy_rate_w:.3f} of the time")  # Print the empirical tradeoff.
```
▶ What you'll see: higher $\epsilon$ means fewer purely greedy selections, although random exploration can still sometimes pick the greedy action by chance.

```python
expected_greedy_w = (1.0 - epsilons_w) + epsilons_w / len(q_choice_w)  # Compute P(greedy action) when random choice has two actions.
print("expected greedy-action rates:", np.round(expected_greedy_w, 3))  # Print the theoretical rates for comparison.
print("empirical greedy-action rates:", np.round(greedy_rates_w, 3))  # Print the simulated rates.
```
The chosen action is greedy with probability $(1-\epsilon)+\epsilon/|A|$ because the random branch also has a $1/|A|$ chance of selecting the greedy action. Exploration is necessary because actions with low current estimates might only look bad because they have not been tried enough.
▶ What you'll see: empirical rates closely match the simple probability calculation.

```python
plt.figure(figsize=(5.8, 3.2))  # Create a compact tradeoff figure.
plt.plot(epsilons_w, greedy_rates_w, marker="o", label="empirical greedy-action rate")  # Plot simulated greedy-action frequency.
plt.plot(epsilons_w, expected_greedy_w, linestyle="--", label="expected greedy-action rate")  # Plot the theoretical rate.
plt.plot(epsilons_w, random_rates_w, marker="s", label="requested exploration rate")  # Plot epsilon itself as the exploration knob.
plt.xlabel("epsilon")  # Label the exploration-rate axis.
plt.ylabel("probability")  # Label the probability axis.
plt.title("5: epsilon-greedy trades exploration for exploitation")  # Title the plot with the subsection number.
plt.legend()  # Show which curve is which.
plt.grid(True, alpha=0.3)  # Add a light grid for readability.
plt.show()  # Render the epsilon-greedy plot.
```
▶ What you'll see: as $\epsilon$ rises, the learner explores more and relies less on the current greedy action.

*Why it's done this way: epsilon-greedy keeps the policy simple but prevents early Q-value mistakes from locking the learner into one action forever; decreasing or tuning $\epsilon$ controls how much evidence the learner gathers before trusting exploitation.*

### 🟢 Basics (warm-up)

#### B1. Look up the immediate reward for one transition

Goal: read one $\operatorname{Reward}(s,a,s')$ entry without doing any planning yet.

```python
transition_rewards = {("s", "go", "s'"): 7}  # Store one known transition reward so the lookup is unambiguous.
state, action, successor = "s", "go", "s'"  # Name the transition pieces so they match Reward(s,a,s').
reward = transition_rewards[(state, action, successor)]  # Look up only the immediate reward for this exact transition.
print(f"Reward({state}, {action}, {successor}) = {reward}")  # Print the primitive MDP reward entry.
```

▶ What you'll see: the transition `s --go--> s'` has immediate reward `7`.

```python
print(f"{state} --{action} / reward {reward}--> {successor}")  # Show the same lookup as a tiny labeled edge.
```

▶ What you'll see: a one-edge transition diagram with the reward written on the edge.

👀 **Takeaway:** a reward lookup is local; it scores one transition before any future value is considered.

---

#### B2. Compute one 2-step discounted return

Goal: combine one immediate reward with one discounted future reward.

```python
r1 = 2  # Store the first reward because it is received immediately.
r2 = 4  # Store the second reward because it arrives one step later.
gamma = 0.5  # Store the discount factor so later rewards count less.
discounted_return = r1 + gamma * r2  # Add immediate reward plus discounted second reward.
print(f"u = {r1} + {gamma} * {r2} = {discounted_return}")  # Print the two-step return calculation.
```

▶ What you'll see: the return is `4.0`, because the future reward `4` is halved before adding it.

```python
print(f"s0 --r1={r1}--> s1 --r2={r2}, gamma*r2={gamma * r2}--> s2")  # Show where each reward enters the two-edge chain.
```

▶ What you'll see: the two-edge chain separates the immediate reward from the discounted second reward.

👀 **Takeaway:** discounting leaves the first reward unchanged and shrinks rewards that arrive later.

---

#### B3. Pick the greedy action from one Q-value row

Goal: choose $\arg\max_a Q(s,a)$ from one state's action values.

```python
actions = ["left", "right", "wait"]  # List the legal actions for one state.
q_values = np.array([1.2, 2.5, 0.7])  # Store one Q-value row in the same order as the actions.
best_index = int(np.argmax(q_values))  # Find the position of the largest action value.
best_action = actions[best_index]  # Convert the winning position back into an action name.
print(f"greedy action = {best_action}, Q = {q_values[best_index]:.1f}")  # Print the argmax decision.
```

▶ What you'll see: `right` is selected because its Q-value is the largest.

```python
colors = ["orange" if i == best_index else "gray" for i in range(len(actions))]  # Highlight only the argmax bar.
fig, ax = plt.subplots(figsize=(4.5, 3))  # Create a small action-value chart.
ax.bar(actions, q_values, color=colors)  # Plot one bar per action so the maximum is visible.
ax.set_title("B3 greedy action from one Q row")  # Label the chart with the decision being made.
ax.set_ylabel("Q(s, a)")  # Label the vertical axis as action value.
plt.show()  # Render the highlighted argmax chart.
```

▶ What you'll see: the `right` bar is tallest and highlighted in orange.

👀 **Takeaway:** a greedy policy does not average actions; it picks the action with the largest current Q-value.

---


#### B4. Do one Bellman backup for a single Q-value

Goal: combine one immediate reward with the discounted expected value of successors.

```python
successor_values = {(0, 1): 0.3, (1, 0): 0.8}  # Store current V(s') estimates for two possible successors.
transition_probs = {(0, 1): 0.75, (1, 0): 0.25}  # Store p(s'|s,a) for one action.
reward = -0.04  # Store the immediate reward for this transition choice.
gamma = 0.9  # Discount future values.
expected_future = sum(transition_probs[s2] * successor_values[s2] for s2 in transition_probs)  # Average successors by probability.
q_backup = reward + gamma * expected_future  # Apply the one-step Bellman Q backup.
print(f"Q(s,a) = {reward:.2f} + {gamma:.1f} * {expected_future:.3f} = {q_backup:.3f}")  # Print the backup.
```

▶ What you'll see: one Q-value made from reward now plus discounted average value next.

```python
fig, ax = plt.subplots(figsize=(4.5, 3))  # Create a small contribution chart.
ax.bar([str(s2) for s2 in transition_probs], [transition_probs[s2] * successor_values[s2] for s2 in transition_probs], color="#4C78A8")  # Plot each weighted successor.
ax.set_title("B4 successor contributions")  # Label the primitive.
ax.set_ylabel("p(s'|s,a) V(s')")  # Label the weighted-value axis.
plt.show()  # Display the bars.
```

▶ What you'll see: each successor contributes probability times value.

👀 **Takeaway:** a Bellman backup is a local expected one-step lookahead.

---

#### B5. Evaluate one fixed-policy action at one state

Goal: read the value of the action chosen by a policy at one state.

```python
policy = {(2, 0): "right"}  # Define a tiny deterministic policy for one state.
q_row = {"up": 0.10, "right": 0.42, "down": -0.05}  # Store action values for that state.
state = (2, 0)  # Choose the state to evaluate.
chosen_action = policy[state]  # Read the policy action.
policy_value = q_row[chosen_action]  # Use the Q-value for the policy action.
print(f"pi({state}) = {chosen_action}, so V_pi({state}) = {policy_value:.2f}")  # Print the one-state value.
```

▶ What you'll see: the policy's action determines $V_\pi(s)$.

```python
fig, ax = plt.subplots(figsize=(4.5, 3))  # Create a small action-value chart.
ax.bar(list(q_row), list(q_row.values()), color=["orange" if a == chosen_action else "gray" for a in q_row])  # Highlight the policy action.
ax.set_title("B5 fixed-policy value")  # Label the chart.
ax.set_ylabel("Q(s, a)")  # Label the value axis.
plt.show()  # Render the chart.
```

▶ What you'll see: the highlighted policy action supplies the state value.

👀 **Takeaway:** policy evaluation follows the policy, even if another action has a different value.

---

#### B6. Compute an expected value over transition probabilities

Goal: multiply each outcome value by its probability and add the pieces.

```python
outcomes = ["goal", "slip"]  # Name two possible outcomes.
probabilities = np.array([0.8, 0.2])  # Store transition probabilities.
values = np.array([1.0, -1.0])  # Store successor values.
expected_value = float(np.dot(probabilities, values))  # Compute the probability-weighted average.
print(f"E[V(s')] = 0.8*1.0 + 0.2*(-1.0) = {expected_value:.1f}")  # Print the expected value.
```

▶ What you'll see: the expected successor value is `0.6`.

```python
fig, ax = plt.subplots(figsize=(4.5, 3))  # Create a contribution chart.
ax.bar(outcomes, probabilities * values, color=["#54A24B", "#E45756"])  # Plot weighted positive and negative pieces.
ax.axhline(0, color="black", linewidth=1)  # Mark zero for the negative contribution.
ax.set_title("B6 expected successor value")  # Label the primitive.
ax.set_ylabel("probability × value")  # Label the axis.
plt.show()  # Display the chart.
```

▶ What you'll see: the good outcome adds more than the slip subtracts.

👀 **Takeaway:** stochastic transitions use weighted averages.

---

#### B7. Compare discount factors on one future reward

Goal: see how $\gamma=0$ and $\gamma=0.9$ treat the same future reward.

```python
immediate = 1.0  # Store the immediate reward.
future = 10.0  # Store a one-step-later reward.
gammas = [0.0, 0.9]  # Compare no future value with strong future value.
returns = [immediate + gamma * future for gamma in gammas]  # Compute each discounted return.
for gamma, ret in zip(gammas, returns):  # Print both cases.
    print(f"gamma={gamma:.1f}: return = {ret:.1f}")  # Show the effect of gamma.
```

▶ What you'll see: $\gamma=0$ ignores the future reward, while $\gamma=0.9$ mostly keeps it.

```python
fig, ax = plt.subplots(figsize=(4.5, 3))  # Create a comparison chart.
ax.bar(["gamma=0", "gamma=0.9"], returns, color=["gray", "orange"])  # Plot both returns.
ax.set_title("B7 discount factor effect")  # Label the chart.
ax.set_ylabel("one-step return")  # Label the axis.
plt.show()  # Display the comparison.
```

▶ What you'll see: the high-discount case has the larger return.

👀 **Takeaway:** $\gamma$ controls how much tomorrow matters today.

---

#### B8. Apply one Q-learning update

Goal: update one table entry from one sampled transition.

```python
q_old = 0.50  # Store current Q(s,a).
alpha = 0.20  # Store the learning rate.
reward = 1.00  # Store the observed reward.
gamma = 0.90  # Store the discount factor.
next_best = 0.80  # Store max_a' Q(s',a').
target = reward + gamma * next_best  # Build the Q-learning target.
q_new = (1 - alpha) * q_old + alpha * target  # Move the old estimate toward the target.
print(f"target = {target:.2f}; new Q = {q_new:.3f}")  # Print the update result.
```

▶ What you'll see: the Q-value moves partway from `0.50` toward `1.72`.

```python
fig, ax = plt.subplots(figsize=(4.5, 3))  # Create a before/after chart.
ax.bar(["old Q", "target", "new Q"], [q_old, target, q_new], color=["gray", "#54A24B", "orange"])  # Plot update pieces.
ax.set_title("B8 one Q-learning update")  # Label the chart.
ax.set_ylabel("value")  # Label the axis.
plt.show()  # Display the chart.
```

▶ What you'll see: the new value is between the old estimate and the target.

👀 **Takeaway:** Q-learning is an incremental correction controlled by $\alpha$.

---

#### B9. Choose one epsilon-greedy action

Goal: flip one exploration coin before choosing an action.

```python
np.random.seed(7)  # Fix the random draw for reproducibility.
actions = ["left", "right", "wait"]  # List legal actions.
q_values = {"left": 0.1, "right": 0.9, "wait": 0.2}  # Store current action values.
epsilon = 0.2  # Explore on 20 percent of decisions.
coin = np.random.rand()  # Draw one exploration coin.
if coin < epsilon:  # Explore if the coin falls below epsilon.
    choice = actions[int(np.random.choice(len(actions)))]  # Choose a random legal action.
    mode = "explore"  # Record the mode.
else:  # Otherwise exploit.
    choice = max(actions, key=lambda action: q_values[action])  # Choose the greedy action.
    mode = "exploit"  # Record the mode.
print(f"coin={coin:.3f}, epsilon={epsilon:.1f} -> {mode}: {choice}")  # Print the decision.
```

▶ What you'll see: one coin chooses exploration or exploitation.

```python
fig, ax = plt.subplots(figsize=(4.5, 1.4))  # Create a one-dimensional coin plot.
ax.axvspan(0, epsilon, color="#F58518", alpha=0.35, label="explore")  # Shade the explore interval.
ax.axvspan(epsilon, 1, color="#4C78A8", alpha=0.25, label="exploit")  # Shade the exploit interval.
ax.axvline(coin, color="black", linewidth=2, label="coin")  # Mark the sampled coin.
ax.set_xlim(0, 1)  # Keep the axis on probability scale.
ax.set_yticks([])  # Hide the vertical axis.
ax.set_title("B9 epsilon-greedy coin flip")  # Label the chart.
ax.legend(loc="upper center", ncol=3)  # Show labels.
plt.show()  # Display the plot.
```

▶ What you'll see: the coin lands in the explore or exploit interval.

👀 **Takeaway:** epsilon-greedy randomizes before taking the greedy action.

---

#### B10. Check that transition probabilities sum to one

Goal: verify that one action's outcome probabilities form a valid distribution.

```python
transition_row = {"intended": 0.8, "left slip": 0.1, "right slip": 0.1}  # Store outcomes for one stochastic action.
prob_sum = sum(transition_row.values())  # Add the row probabilities.
is_valid = np.isclose(prob_sum, 1.0)  # Check whether the total is one.
print(f"sum p(s'|s,a) = {prob_sum:.1f}; valid distribution = {is_valid}")  # Report the check.
```

▶ What you'll see: the probabilities add to `1.0`.

```python
fig, ax = plt.subplots(figsize=(4.5, 3))  # Create a probability chart.
ax.bar(list(transition_row), list(transition_row.values()), color="#4C78A8")  # Plot the outcome probabilities.
ax.set_ylim(0, 1.0)  # Use probability scale.
ax.set_title("B10 transition probabilities")  # Label the chart.
ax.set_ylabel("probability")  # Label the axis.
plt.xticks(rotation=15)  # Fit long labels.
plt.show()  # Display the chart.
```

▶ What you'll see: the outcomes partition one unit of probability mass.

👀 **Takeaway:** transition probabilities for a fixed $(s,a)$ must sum to one.

---

### 🟡 Easy

#### E1. Hand compute discounted utility on a 4-step path

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

#### E2. One Bellman value-iteration sweep by hand

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

#### E3. Policy evaluation for a fixed "always right if possible" policy

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

#### E4. Value iteration with heatmaps

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

#### E5. One Q-learning update from experience

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

#### A1. Value iteration vs. policy iteration at scale

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

#### A2. Q-learning with epsilon-greedy exploration

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

#### A3. SARSA vs. Q-learning in a risky grid

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

#### A4. Failure case: $\gamma=1$ on a positive-reward cycle

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

#### A5. Model-based Monte Carlo from sampled transitions

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
