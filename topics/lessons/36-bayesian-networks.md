# Bayesian Networks & Inference
> **Source:** CS 221 · **Category:** Concept+Method · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an .ipynb will be generated.

## 0. Step-by-Step Worked Example — Start Here (Beginner Friendly)

> 🧑‍🎓 **New to this topic? Start here.** This is a gentle, fully runnable walkthrough that
> builds up *every* idea in this lesson one tiny step at a time. Each step **prints** the
> numbers it computes and **draws a picture** so you can *see* what is happening. Run the
> cells in order from top to bottom. Nothing here needs the internet or any downloaded data.

**What we will build, step by step:**
1. **Directed acyclic graph and parents** — a tiny Rain/Sprinkler/WetGrass Bayesian network.
2. **Factorized joint distribution** — multiplying local CPT entries into joint probabilities.
3. **Conditional independence** — chain, fork, collider, and explaining away.
4. **Exact inference by enumeration** — summing hidden variables and normalizing.
5. **Variable elimination** — summing out hidden variables through compact factors.
6. **Gibbs sampling** — approximating a posterior by local resampling.
7. **Forward-backward for HMMs** — smoothing hidden states using past and future evidence.
8. **Learning CPTs with MLE and Laplace smoothing** — turning counts into probabilities.

### Step 0 — Set up our tools

We import NumPy (arrays, small probability tables, and random sampling) and Matplotlib (pictures).
We fix a random **seed** for reproducible output and define tiny helpers for logging and normalizing.

```python
import numpy as np                       # NumPy stores CPTs, probabilities, messages, and samples.
import matplotlib.pyplot as plt          # Matplotlib draws DAGs, posterior bars, traces, and HMM heatmaps.

np.random.seed(0)                         # Fix the seed so every random draw is reproducible.
plt.rcParams["figure.figsize"] = (7, 4)   # Use a readable default figure size.


def log(label, value):                    # Define a tiny logger for clear labeled output.
    print(f"[{label}] {value}")           # Print each result as [label] value.


def normalize_demo(weights_demo):         # Convert nonnegative weights into probabilities.
    weights_demo = np.asarray(weights_demo, dtype=float)  # Convert input to a floating NumPy array.
    total_demo = weights_demo.sum()        # Compute the normalizing constant.
    return weights_demo / total_demo       # Divide by the total so probabilities sum to one.

log("setup", "tools ready — NumPy + Matplotlib imported, seed fixed to 0")  # Confirm setup succeeded.
```
▶ What you'll see: one line confirming the tools are ready.

### Step 1 — Directed acyclic graph and parents

A Bayesian network is a DAG plus one CPT per node. Each CPT row must sum to one for every fixed
parent assignment.

```python
variables_demo = ["R", "S", "W"]  # Name Rain, Sprinkler, and WetGrass.
parents_demo = {"R": [], "S": [], "W": ["R", "S"]}  # Store parent sets for the DAG.
edges_demo = [("R", "W"), ("S", "W")]  # Store directed edges from parents to child.
positions_demo = {"R": (0.0, 1.0), "S": (2.0, 1.0), "W": (1.0, 0.0)}  # Place nodes for plotting.
cpts_demo = {  # Store one local conditional probability table per variable.
    "R": {(): {0: 0.80, 1: 0.20}},  # Prior P(Rain), where 1 means rain.
    "S": {(): {0: 0.60, 1: 0.40}},  # Prior P(Sprinkler), where 1 means sprinkler on.
    "W": {(0, 0): {0: 0.95, 1: 0.05}, (0, 1): {0: 0.30, 1: 0.70}, (1, 0): {0: 0.20, 1: 0.80}, (1, 1): {0: 0.05, 1: 0.95}},  # CPT P(WetGrass | Rain, Sprinkler).
}  # Finish the CPT dictionary.
for node_demo in variables_demo:  # Check every local CPT.
    for parent_key_demo, row_demo in cpts_demo[node_demo].items():  # Visit every parent assignment row.
        row_sum_demo = sum(row_demo.values())  # Sum probabilities over the child values.
        log(f"CPT row sum {node_demo}{parent_key_demo}", round(row_sum_demo, 3))  # Print the normalization check.
fig_demo, ax_demo = plt.subplots()  # Create a DAG figure.
for parent_demo, child_demo in edges_demo:  # Draw each directed edge.
    ax_demo.annotate("", xy=positions_demo[child_demo], xytext=positions_demo[parent_demo], arrowprops={"arrowstyle": "->", "lw": 2})  # Draw one arrow.
for node_demo, (x_demo, y_demo) in positions_demo.items():  # Draw every node.
    ax_demo.scatter(x_demo, y_demo, s=1200, color="white", edgecolor="black", linewidth=2, zorder=3)  # Draw a node circle.
    ax_demo.text(x_demo, y_demo, node_demo, ha="center", va="center", fontsize=13, weight="bold")  # Label the node.
ax_demo.set_title("Step 1: DAG parents choose which CPT row to use")  # Title the diagram.
ax_demo.set_xlim(-0.5, 2.5)  # Fix horizontal limits.
ax_demo.set_ylim(-0.4, 1.4)  # Fix vertical limits.
ax_demo.axis("off")  # Hide axes for a graph drawing.
plt.show()  # Display the DAG.
```
▶ What you'll see: Rain and Sprinkler both point to WetGrass, and every CPT row sums to 1.

### Step 2 — Factorized joint distribution

The joint probability of one full assignment is the product of one local CPT entry per node:
$P(R,S,W)=P(R)P(S)P(W\mid R,S)$.

```python
def parent_key_demo(node_demo, assignment_demo):  # Extract parent values in the order listed by parents_demo.
    return tuple(assignment_demo[parent_demo] for parent_demo in parents_demo[node_demo])  # Return the CPT row key.

def local_prob_demo(node_demo, value_demo, assignment_demo):  # Read one local CPT entry.
    return cpts_demo[node_demo][parent_key_demo(node_demo, assignment_demo)][value_demo]  # Return P(node=value | parents).

def joint_prob_demo(assignment_demo):  # Compute the factorized joint probability.
    product_demo = 1.0  # Start the product at one.
    for node_demo in variables_demo:  # Multiply one local factor per node.
        product_demo *= local_prob_demo(node_demo, assignment_demo[node_demo], assignment_demo)  # Include this node's CPT entry.
    return product_demo  # Return the joint probability.

def all_assignments_demo():  # Enumerate all binary assignments for R, S, W.
    for rain_demo in [0, 1]:  # Try both Rain values.
        for sprinkler_demo in [0, 1]:  # Try both Sprinkler values.
            for wet_demo in [0, 1]:  # Try both WetGrass values.
                yield {"R": rain_demo, "S": sprinkler_demo, "W": wet_demo}  # Yield one complete assignment.

example_assignment_demo = {"R": 1, "S": 0, "W": 1}  # Choose one assignment to inspect.
terms_demo = [local_prob_demo(node_demo, example_assignment_demo[node_demo], example_assignment_demo) for node_demo in variables_demo]  # Collect local factors.
log("assignment", example_assignment_demo)  # Print the assignment.
log("local CPT terms", terms_demo)  # Print P(R), P(S), and P(W|R,S).
log("joint product", round(joint_prob_demo(example_assignment_demo), 5))  # Print the product.
joint_rows_demo = [(assignment_demo, joint_prob_demo(assignment_demo)) for assignment_demo in all_assignments_demo()]  # Build all eight joint rows.
log("joint total probability", round(sum(prob_demo for assignment_demo, prob_demo in joint_rows_demo), 6))  # Verify normalization.
labels_demo = [f"R{assignment_demo['R']}S{assignment_demo['S']}W{assignment_demo['W']}" for assignment_demo, prob_demo in joint_rows_demo]  # Build compact row labels.
probs_demo = [prob_demo for assignment_demo, prob_demo in joint_rows_demo]  # Extract joint probabilities.
plt.bar(labels_demo, probs_demo, color="steelblue", edgecolor="black")  # Plot the full joint table.
plt.xticks(rotation=45, ha="right")  # Rotate labels for readability.
plt.ylabel("joint probability")  # Label the y-axis.
plt.title("Step 2: the factorized joint sums to 1")  # Title the plot.
plt.tight_layout()  # Fit rotated labels.
plt.show()  # Display the joint distribution.
```
▶ What you'll see: all eight joint rows are nonnegative and sum to 1.

### Step 3 — Conditional independence: chain, fork, collider, explaining away

Bayesian-network structure tells us when variables become independent after conditioning. Chains
and forks are blocked by observing the middle variable; colliders are opened by observing the effect.

```python
chain_p_a_demo = {0: 0.6, 1: 0.4}  # Store P(A) for a chain A->B->C.
chain_p_b_demo = {(0,): {0: 0.8, 1: 0.2}, (1,): {0: 0.3, 1: 0.7}}  # Store P(B|A).
chain_p_c_demo = {(0,): {0: 0.9, 1: 0.1}, (1,): {0: 0.25, 1: 0.75}}  # Store P(C|B).

def chain_joint_demo(a_demo, b_demo, c_demo):  # Compute P(A,B,C) in the chain.
    return chain_p_a_demo[a_demo] * chain_p_b_demo[(a_demo,)][b_demo] * chain_p_c_demo[(b_demo,)][c_demo]  # Multiply chain factors.

def chain_c_given_a_demo(a_demo):  # Compute P(C=1 | A=a).
    numerator_demo = sum(chain_joint_demo(a_demo, b_demo, 1) for b_demo in [0, 1])  # Sum hidden B with C=1.
    denominator_demo = sum(chain_joint_demo(a_demo, b_demo, c_demo) for b_demo in [0, 1] for c_demo in [0, 1])  # Sum hidden B and C.
    return numerator_demo / denominator_demo  # Return the conditional probability.

def chain_c_given_a_b_demo(a_demo, b_demo):  # Compute P(C=1 | A=a,B=b).
    numerator_demo = chain_joint_demo(a_demo, b_demo, 1)  # Joint with C=1.
    denominator_demo = chain_joint_demo(a_demo, b_demo, 0) + chain_joint_demo(a_demo, b_demo, 1)  # Sum over C.
    return numerator_demo / denominator_demo  # Return the conditional probability.

log("chain P(C=1|A=0)", round(chain_c_given_a_demo(0), 3))  # Show A affects C before B is known.
log("chain P(C=1|A=1)", round(chain_c_given_a_demo(1), 3))  # Show a different value before conditioning.
log("chain P(C=1|A=0,B=1)", round(chain_c_given_a_b_demo(0, 1), 3))  # Show A no longer matters once B is fixed.
log("chain P(C=1|A=1,B=1)", round(chain_c_given_a_b_demo(1, 1), 3))  # Show the same conditional value.
fork_message_demo = "In a fork A<-B->C, conditioning on common cause B similarly blocks A-C."  # Summarize the fork motif.
log("fork motif", fork_message_demo)  # Print the fork lesson.
p_r_prior_demo = sum(joint_prob_demo({"R": 1, "S": s_demo, "W": w_demo}) for s_demo in [0, 1] for w_demo in [0, 1])  # Compute P(R=1).
p_r_wet_demo = sum(joint_prob_demo({"R": 1, "S": s_demo, "W": 1}) for s_demo in [0, 1]) / sum(joint_prob_demo({"R": r_demo, "S": s_demo, "W": 1}) for r_demo in [0, 1] for s_demo in [0, 1])  # Compute P(R=1|W=1).
p_r_wet_s_demo = joint_prob_demo({"R": 1, "S": 1, "W": 1}) / sum(joint_prob_demo({"R": r_demo, "S": 1, "W": 1}) for r_demo in [0, 1])  # Compute P(R=1|W=1,S=1).
log("collider P(R=1)", round(p_r_prior_demo, 3))  # Print prior Rain probability.
log("collider P(R=1|W=1)", round(p_r_wet_demo, 3))  # Observing WetGrass opens the collider path.
log("explaining away P(R=1|W=1,S=1)", round(p_r_wet_s_demo, 3))  # Sprinkler explains away some Rain probability.
plt.bar(["P(R)", "P(R|W)", "P(R|W,S)"], [p_r_prior_demo, p_r_wet_demo, p_r_wet_s_demo], color=["gray", "orange", "seagreen"], edgecolor="black")  # Plot explaining-away probabilities.
plt.ylim(0, 1)  # Use probability scale.
plt.ylabel("probability of Rain")  # Label the y-axis.
plt.title("Step 3: collider evidence creates dependence, then explains away")  # Title the plot.
plt.show()  # Display the conditional-independence chart.
```
▶ What you'll see: the chain endpoints become independent once the middle is known, while collider evidence changes the causes' probabilities.

### Step 4 — Exact inference by enumeration

Exact inference sums over hidden variables. For $P(R\mid W=1)$, Sprinkler is hidden, so we sum
both Sprinkler values for each Rain value and then normalize.

```python
evidence_demo = {"W": 1}  # Observe that the grass is wet.
query_values_demo = [0, 1]  # Consider Rain=0 and Rain=1.
enum_scores_demo = []  # Store unnormalized P(R, W=1) scores.
for rain_demo in query_values_demo:  # Loop over query values.
    score_demo = 0.0  # Start the hidden-variable sum.
    pieces_demo = []  # Store printed terms for this Rain value.
    for sprinkler_demo in [0, 1]:  # Sum over hidden Sprinkler.
        assignment_demo = {"R": rain_demo, "S": sprinkler_demo, "W": 1}  # Build one full assignment.
        term_demo = joint_prob_demo(assignment_demo)  # Compute its joint probability.
        score_demo += term_demo  # Add it to the score.
        pieces_demo.append(round(term_demo, 5))  # Save a readable term.
    enum_scores_demo.append(score_demo)  # Store P(R=rain,W=1).
    log(f"R={rain_demo} hidden terms", pieces_demo)  # Print the terms being summed.
enum_posterior_demo = normalize_demo(enum_scores_demo)  # Normalize over Rain.
log("unnormalized P(R,W=1)", np.round(enum_scores_demo, 5))  # Print the raw scores.
log("P(R=0|W=1), P(R=1|W=1)", np.round(enum_posterior_demo, 5))  # Print the posterior.
plt.bar(["R=0", "R=1"], enum_posterior_demo, color=["steelblue", "orange"], edgecolor="black")  # Plot posterior probabilities.
plt.ylim(0, 1)  # Keep y-axis as probability.
plt.ylabel("posterior probability")  # Label y-axis.
plt.title("Step 4: enumeration posterior P(R | W=1)")  # Title the plot.
plt.show()  # Display exact posterior.
```
▶ What you'll see: two hidden Sprinkler terms are summed for each Rain value, then normalized.

### Step 5 — Variable elimination

Variable elimination computes the same answer but sums out hidden variables through compact factors.
Here we eliminate Sprinkler into a message over Rain.

```python
phi_r_demo = {0: cpts_demo["R"][()][0], 1: cpts_demo["R"][()][1]}  # Keep the Rain prior factor.
phi_s_demo = {0: cpts_demo["S"][()][0], 1: cpts_demo["S"][()][1]}  # Keep the Sprinkler prior factor.
phi_w_demo = {(r_demo, s_demo): cpts_demo["W"][(r_demo, s_demo)][1] for r_demo in [0, 1] for s_demo in [0, 1]}  # Restrict W evidence to W=1.
message_to_r_demo = {}  # Store m(R)=sum_S P(S)P(W=1|R,S).
for rain_demo in [0, 1]:  # Build one message entry per Rain value.
    products_demo = []  # Store products before summing.
    for sprinkler_demo in [0, 1]:  # Eliminate Sprinkler.
        product_demo = phi_s_demo[sprinkler_demo] * phi_w_demo[(rain_demo, sprinkler_demo)]  # Multiply factors mentioning Sprinkler.
        products_demo.append(product_demo)  # Save this product.
    message_to_r_demo[rain_demo] = sum(products_demo)  # Sum out Sprinkler.
    log(f"message m(R={rain_demo}) pieces", np.round(products_demo, 5))  # Print the local products.
ve_scores_demo = np.array([phi_r_demo[rain_demo] * message_to_r_demo[rain_demo] for rain_demo in [0, 1]])  # Multiply remaining Rain prior by message.
ve_posterior_demo = normalize_demo(ve_scores_demo)  # Normalize over Rain.
log("VE posterior", np.round(ve_posterior_demo, 5))  # Print variable-elimination result.
log("matches enumeration", bool(np.allclose(ve_posterior_demo, enum_posterior_demo)))  # Verify equality.
x_demo = np.arange(2)  # Create bar positions.
width_demo = 0.35  # Offset paired bars.
plt.bar(x_demo - width_demo / 2, enum_posterior_demo, width_demo, label="enumeration", color="steelblue")  # Plot enumeration result.
plt.bar(x_demo + width_demo / 2, ve_posterior_demo, width_demo, label="variable elimination", color="orange")  # Plot VE result.
plt.xticks(x_demo, ["R=0", "R=1"])  # Label query values.
plt.ylim(0, 1)  # Use probability scale.
plt.ylabel("posterior probability")  # Label y-axis.
plt.title("Step 5: variable elimination matches enumeration")  # Title the plot.
plt.legend()  # Show method labels.
plt.show()  # Display comparison.
```
▶ What you'll see: variable elimination produces the same posterior while reusing a compact Sprinkler-summed message.

### Step 6 — Gibbs sampling

Gibbs sampling keeps evidence fixed and repeatedly resamples non-evidence variables from their
conditional distribution given the current values of all others.

```python
def full_conditional_demo(node_demo, state_demo, evidence_now_demo):  # Compute P(node | all other current variables) by tiny joint scores.
    weights_demo = []  # Store one weight per candidate value.
    for value_demo in [0, 1]:  # Try binary values.
        candidate_demo = dict(state_demo)  # Copy the current state.
        candidate_demo[node_demo] = value_demo  # Replace this node.
        if node_demo in evidence_now_demo and evidence_now_demo[node_demo] != value_demo:  # Respect clamped evidence.
            weights_demo.append(0.0)  # Evidence-inconsistent values get zero weight.
        else:  # Score evidence-consistent candidates.
            weights_demo.append(joint_prob_demo(candidate_demo))  # Use joint probability as an unnormalized conditional weight.
    return normalize_demo(weights_demo)  # Normalize into a conditional distribution.

rng_demo = np.random.default_rng(36)  # Create a seeded random generator.
state_demo = {"R": 0, "S": 0, "W": 1}  # Initialize a full state consistent with W=1.
samples_demo = []  # Store Rain samples after burn-in.
running_demo = []  # Store the running estimate of P(R=1|W=1).
burn_in_demo = 50  # Skip early samples.
sweeps_demo = 1200  # Run enough sweeps for a tiny visible convergence trace.
for sweep_demo in range(sweeps_demo):  # Repeat Gibbs sweeps.
    for node_demo in ["R", "S"]:  # Resample non-evidence variables only.
        probs_demo = full_conditional_demo(node_demo, state_demo, {"W": 1})  # Compute local conditional probabilities.
        state_demo[node_demo] = int(rng_demo.choice([0, 1], p=probs_demo))  # Sample the new value.
    if sweep_demo >= burn_in_demo:  # Keep post-burn-in samples.
        samples_demo.append(state_demo["R"])  # Record Rain.
        running_demo.append(float(np.mean(samples_demo)))  # Update the empirical Rain probability.
log("final Gibbs state", state_demo)  # Print the final state.
log("Gibbs estimate P(R=1|W=1)", round(running_demo[-1], 4))  # Print sampled estimate.
log("exact P(R=1|W=1)", round(float(enum_posterior_demo[1]), 4))  # Print exact reference.
plt.plot(running_demo, color="steelblue", label="Gibbs running estimate")  # Plot running estimate.
plt.axhline(enum_posterior_demo[1], color="red", linestyle="--", label="exact posterior")  # Mark exact answer.
plt.xlabel("retained sample index")  # Label x-axis.
plt.ylabel("estimated P(R=1 | W=1)")  # Label y-axis.
plt.title("Step 6: Gibbs sampling approaches the exact posterior")  # Title the trace.
plt.legend()  # Show labels.
plt.show()  # Display convergence plot.
```
▶ What you'll see: the sampled estimate jitters but stays near the exact posterior line.

### Step 7 — Forward-backward for hidden Markov models

An HMM repeats a small Bayesian network over time. Forward messages summarize past evidence;
backward messages summarize future evidence; multiplying them gives a smoothed posterior.

```python
states_hmm_demo = ["Sunny", "Rainy"]  # Name two hidden weather states.
initial_demo = np.array([0.60, 0.40])  # Store P(H1).
transition_demo = np.array([[0.80, 0.20], [0.30, 0.70]])  # Store P(H_t | H_{t-1}) by previous-state rows.
emission_demo = np.array([[0.90, 0.10], [0.20, 0.80]])  # Store P(Umbrella=0/1 | hidden state).
observations_demo = np.array([1, 1, 0, 1])  # Observe a short umbrella sequence.
time_count_demo = len(observations_demo)  # Count time steps.
state_count_demo = len(states_hmm_demo)  # Count hidden states.
forward_demo = np.zeros((time_count_demo, state_count_demo))  # Allocate forward messages.
backward_demo = np.zeros((time_count_demo, state_count_demo))  # Allocate backward messages.
forward_demo[0] = normalize_demo(initial_demo * emission_demo[:, observations_demo[0]])  # Initialize with prior times first evidence likelihood.
for time_demo in range(1, time_count_demo):  # Move forward through observations.
    prediction_demo = forward_demo[time_demo - 1] @ transition_demo  # Predict current hidden state from previous message.
    forward_demo[time_demo] = normalize_demo(prediction_demo * emission_demo[:, observations_demo[time_demo]])  # Condition on current evidence.
backward_demo[-1] = np.ones(state_count_demo)  # Last backward message has no future evidence.
for time_demo in range(time_count_demo - 2, -1, -1):  # Move backward through time.
    future_demo = emission_demo[:, observations_demo[time_demo + 1]] * backward_demo[time_demo + 1]  # Combine next evidence and future message.
    backward_demo[time_demo] = normalize_demo(transition_demo @ future_demo)  # Sum over next states and normalize.
smoothed_demo = np.zeros_like(forward_demo)  # Allocate smoothed posteriors.
for time_demo in range(time_count_demo):  # Smooth each time step.
    smoothed_demo[time_demo] = normalize_demo(forward_demo[time_demo] * backward_demo[time_demo])  # Multiply past and future summaries.
log("observations umbrella=1", observations_demo.tolist())  # Print evidence sequence.
log("smoothed P(Rainy)", np.round(smoothed_demo[:, 1], 3).tolist())  # Print rain posterior over time.
fig_demo, axes_demo = plt.subplots(1, 3, figsize=(12, 3.5))  # Create three heatmaps.
for ax_demo, matrix_demo, title_demo in zip(axes_demo, [forward_demo, backward_demo, smoothed_demo], ["Forward", "Backward", "Smoothed"]):  # Plot each message type.
    image_demo = ax_demo.imshow(matrix_demo.T, aspect="auto", cmap="Blues", vmin=0, vmax=1)  # Draw state-by-time probabilities.
    ax_demo.set_yticks([0, 1])  # Set y tick positions.
    ax_demo.set_yticklabels(states_hmm_demo)  # Label hidden states.
    ax_demo.set_xticks(range(time_count_demo))  # Set x tick positions.
    ax_demo.set_xticklabels([f"t={time_demo + 1}" for time_demo in range(time_count_demo)])  # Label time steps.
    ax_demo.set_title(title_demo)  # Title this panel.
    for row_demo in range(state_count_demo):  # Annotate hidden-state rows.
        for col_demo in range(time_count_demo):  # Annotate time columns.
            ax_demo.text(col_demo, row_demo, f"{matrix_demo[col_demo, row_demo]:.2f}", ha="center", va="center", fontsize=8)  # Write probabilities.
fig_demo.colorbar(image_demo, ax=axes_demo.ravel().tolist(), shrink=0.75)  # Add one shared colorbar.
plt.show()  # Display HMM messages.
```
▶ What you'll see: smoothing uses both the forward and backward messages, so it can differ from filtering alone.

### Step 8 — Learning CPTs by maximum likelihood and Laplace smoothing

With fully observed data, MLE estimates each CPT row by normalized counts. Laplace smoothing adds
pseudo-counts so unseen events do not receive brittle zero probability.

```python
training_rows_demo = np.array([[1, 1], [1, 1], [1, 0], [0, 0], [0, 0], [0, 0]])  # Store rows [Disease, Fever].
lambda_demo = 1.0  # Use add-one Laplace smoothing.
counts_demo = {(disease_demo, fever_demo): 0 for disease_demo in [0, 1] for fever_demo in [0, 1]}  # Initialize all counts.
for disease_demo, fever_demo in training_rows_demo:  # Count fully observed examples.
    counts_demo[(int(disease_demo), int(fever_demo))] += 1  # Increment the matching count.
mle_cpt_demo = {}  # Store raw MLE rows.
laplace_cpt_demo = {}  # Store smoothed rows.
for disease_demo in [0, 1]:  # Learn P(Fever | Disease=d) row by row.
    total_demo = counts_demo[(disease_demo, 0)] + counts_demo[(disease_demo, 1)]  # Count rows with this disease value.
    mle_cpt_demo[disease_demo] = {fever_demo: counts_demo[(disease_demo, fever_demo)] / total_demo for fever_demo in [0, 1]}  # Normalize raw counts.
    laplace_cpt_demo[disease_demo] = {fever_demo: (counts_demo[(disease_demo, fever_demo)] + lambda_demo) / (total_demo + 2 * lambda_demo) for fever_demo in [0, 1]}  # Normalize smoothed counts.
log("raw counts N(D,F)", counts_demo)  # Print the count table.
log("MLE P(F|D)", mle_cpt_demo)  # Print maximum-likelihood CPT.
log("Laplace P(F|D)", laplace_cpt_demo)  # Print smoothed CPT.
labels_demo = ["F=0|D=0", "F=1|D=0", "F=0|D=1", "F=1|D=1"]  # Label CPT entries.
mle_values_demo = [mle_cpt_demo[0][0], mle_cpt_demo[0][1], mle_cpt_demo[1][0], mle_cpt_demo[1][1]]  # Extract MLE probabilities.
laplace_values_demo = [laplace_cpt_demo[0][0], laplace_cpt_demo[0][1], laplace_cpt_demo[1][0], laplace_cpt_demo[1][1]]  # Extract smoothed probabilities.
x_demo = np.arange(len(labels_demo))  # Create bar positions.
width_demo = 0.36  # Set grouped bar width.
plt.bar(x_demo - width_demo / 2, mle_values_demo, width_demo, label="MLE", color="gray")  # Plot MLE entries.
plt.bar(x_demo + width_demo / 2, laplace_values_demo, width_demo, label="Laplace", color="orange")  # Plot smoothed entries.
plt.xticks(x_demo, labels_demo, rotation=20)  # Label CPT cells.
plt.ylim(0, 1)  # Keep probability scale.
plt.ylabel("probability")  # Label y-axis.
plt.title("Step 8: Laplace smoothing avoids zero-count probabilities")  # Title the plot.
plt.legend()  # Show methods.
plt.tight_layout()  # Fit rotated labels.
plt.show()  # Display learned CPT comparison.
```
▶ What you'll see: MLE assigns zero to an unseen fever case, while Laplace smoothing gives it a small nonzero probability.

### Recap — what you just ran

- You built a tiny Bayesian network DAG with **parents** and locally normalized **CPTs**.
- You multiplied local CPT entries to form the **factorized joint distribution**.
- You checked **conditional independence** patterns, including collider **explaining away**.
- You computed exact posteriors by **enumeration** and by **variable elimination**.
- You approximated a posterior with **Gibbs sampling**.
- You smoothed an HMM with **forward-backward** messages.
- You learned CPT rows with **MLE** and **Laplace smoothing**.

Everything below (starting at **§1 Overview**) develops these same ideas with full derivations,
more examples, and larger inference experiments.

---

## 1. Overview

A Bayesian network is a compact representation of a joint probability distribution.  It uses a directed acyclic graph (DAG) to say which variables directly influence which other variables, and it stores one local conditional probability table (CPT) per node instead of one enormous joint table.

**One-line intuition:** a Bayesian network lets us answer “what is likely now that I have seen this evidence?” by multiplying local CPTs, summing out hidden variables, and normalizing.

Bayesian networks are useful because they combine two ideas:

1. **Structure:** the DAG records qualitative assumptions such as “fever depends on disease” or “an alarm depends on burglary and earthquake.”
2. **Numbers:** the CPTs record quantitative probabilities such as $P(Fever=1\mid Disease=1)=0.8$.

The central computational task is inference:

$$
P(Query\mid Evidence=e).
$$

We will solve this task by hand on tiny networks, then write runnable Python code for exact inference, approximate inference, hidden Markov model smoothing, particle filtering, and CPT learning.

## 2. Key Idea

### 2.1 Directed acyclic graph and parents

A **directed acyclic graph** is a directed graph with no directed cycles.  In a Bayesian network, each node is a random variable $X_i$, and each directed edge means direct probabilistic dependence.

If $Parents(i)$ denotes the parent variables of $X_i$, then the Bayesian network stores one local conditional distribution

$$
p(x_i\mid x_{Parents(i)})
$$

for each node.

For every fixed parent assignment, the CPT must be locally normalized:

$$
\sum_{x_i} p(x_i\mid x_{Parents(i)}) = 1.
$$

### 2.2 Factorized joint distribution

The full joint distribution over $X=(X_1,\ldots,X_n)$ factorizes as

$$
P(X_1=x_1,\ldots,X_n=x_n)=\prod_{i=1}^{n}p(x_i\mid x_{Parents(i)}).
$$

Example: if

$$
D \to F,\qquad D\to C,
$$

then

$$
P(D,F,C)=P(D)P(F\mid D)P(C\mid D).
$$

The joint table for three binary variables has $2^3=8$ entries.  The Bayesian network only needs one prior for $D$ and two two-row CPTs for $F$ and $C$.

### 2.3 Conditional independence

The graph encodes conditional independence assumptions.  If a node is conditionally independent of its non-descendants given its parents, then its local CPT is enough.

Three basic motifs are especially important.

**Chain:**

$$
A\to B\to C.
$$

Typically $A$ and $C$ are dependent marginally, but independent after conditioning on $B$:

$$
A\not\perp C,
\qquad
A\perp C\mid B.
$$

**Fork:**

$$
A\leftarrow B\to C.
$$

Again, $A$ and $C$ are usually dependent marginally, but independent given the common cause $B$:

$$
A\not\perp C,
\qquad
A\perp C\mid B.
$$

**Collider:**

$$
A\to B\leftarrow C.
$$

Here the pattern reverses.  The causes can be independent marginally, but become dependent after conditioning on the common effect:

$$
A\perp C,
\qquad
A\not\perp C\mid B.
$$

This is called **explaining away**.  If the alarm is ringing, an earthquake becomes more plausible; but if we also learn there was a burglary, the burglary explains away some of the alarm evidence, so the earthquake becomes less plausible.

### 2.4 Exact inference by enumeration

For query $Q$ and evidence $E=e$, exact inference is

$$
P(Q=q\mid E=e)
=\frac{P(Q=q,E=e)}{P(E=e)}
=\frac{\sum_h P(Q=q,E=e,H=h)}{\sum_{q'}\sum_h P(Q=q',E=e,H=h)},
$$

where $H$ are hidden variables that are neither query nor evidence.

Enumeration is conceptually simple but can be expensive because the sum ranges over all hidden assignments.

### 2.5 Variable elimination

Variable elimination reuses intermediate products instead of enumerating the whole joint table.  It works with **factors**, which are nonnegative tables over small sets of variables.

For query $Q$ given evidence $e$:

```text
Input: factors from all CPTs, query variables Q, evidence assignment e
1. Restrict every factor using evidence e
2. Choose an elimination order for hidden variables Z_1, ..., Z_k
3. For each hidden variable Z_j:
       a. Collect all factors that mention Z_j
       b. Multiply them into one joint factor
       c. Sum out Z_j from that product
       d. Put the resulting factor back into the factor list
4. Multiply all remaining factors
5. Normalize over Q
Return P(Q | e)
```

The key sum-product step is

$$
\tau(Y)=\sum_z \prod_{r=1}^{m} \phi_r(Y_r,z),
$$

where $\phi_1,\ldots,\phi_m$ are exactly the factors that contain $Z$, and $Y$ is the union of the remaining variables in those factors.

Elimination order matters because intermediate factors can become large.  If a factor contains $k$ binary variables, its table can require $2^k$ entries.

### 2.6 Gibbs sampling

Gibbs sampling approximates a posterior by repeatedly resampling one non-evidence variable from its conditional distribution given all other variables.

Given current assignment $x=(x_1,\ldots,x_n)$, for a variable $X_i$ and candidate value $u$, define

$$
w(u)=P(X_i=u\mid x_{-i})\propto
P(X_i=u\mid x_{Parents(i)})
\prod_{Y\in Children(i)}P(Y=x_Y\mid x_{Parents(Y)}\text{ with }X_i=u).
$$

Then normalize the weights:

$$
P(X_i=u\mid x_{-i})=\frac{w(u)}{\sum_{u'}w(u')}.
$$

Pseudocode:

```text
Input: Bayesian network, evidence e, number of sweeps T
Initialize every non-evidence variable randomly
For sweep = 1, ..., T:
    For each non-evidence variable X_i:
        Compute one weight for each value u in Domain(X_i)
        Normalize the weights into a probability vector
        Sample a new value for X_i from that vector
    Record the query variable after burn-in
Return empirical frequencies as an approximate posterior
```

Gibbs sampling is approximate: it has sampling noise, burn-in effects, and mixing issues.  But it can handle networks where exact inference is too expensive.

### 2.7 Forward-backward for hidden Markov models

A hidden Markov model (HMM) is a repeated Bayesian network:

$$
H_1\to H_2\to\cdots\to H_T,
\qquad
H_t\to E_t.
$$

For observations $e_1,\ldots,e_T$, the forward message is

$$
F_t(h_t)=p(e_t\mid h_t)\sum_{h_{t-1}}F_{t-1}(h_{t-1})p(h_t\mid h_{t-1}),
$$

with $F_1(h_1)=p(h_1)p(e_1\mid h_1)$.

The backward message is

$$
B_t(h_t)=\sum_{h_{t+1}}p(h_{t+1}\mid h_t)p(e_{t+1}\mid h_{t+1})B_{t+1}(h_{t+1}),
$$

with $B_T(h_T)=1$.

The smoothed posterior is

$$
P(H_t=h\mid e_{1:T})
=\frac{F_t(h)B_t(h)}{\sum_{h'}F_t(h')B_t(h')}.
$$

### 2.8 Learning CPTs by maximum likelihood and Laplace smoothing

If the CPTs are unknown but fully observed data are available, maximum likelihood estimates CPT entries by normalized counts.

For node $X_i$ and parent assignment $pa$, the MLE is

$$
\widehat{P}_{MLE}(X_i=x\mid Parents(i)=pa)
=\frac{N(X_i=x,pa)}{\sum_{x'}N(X_i=x',pa)}.
$$

The log-likelihood is

$$
\ell(\theta)=\sum_{n=1}^{N}\log P(x^{(n)};\theta)
=\sum_{n=1}^{N}\sum_i \log p_\theta(x_i^{(n)}\mid x_{Parents(i)}^{(n)}).
$$

Laplace smoothing adds $\lambda>0$ pseudo-counts:

$$
\widehat{P}_{Laplace}(X_i=x\mid pa)
=\frac{N(X_i=x,pa)+\lambda}{\sum_{x'}N(X_i=x',pa)+\lambda |Domain(X_i)|}.
$$

Smoothing prevents zero probabilities for events that were simply absent from a small training set.

## 3. Worked Examples

### Setup

Run this block before the first coded example.  It imports only CPU-friendly packages, fixes the random seed, and defines small factor-table helpers used throughout the lesson.

```python
import itertools  # Use Cartesian products to enumerate binary assignments in tiny examples.
import math  # Use basic math functions for likelihood and diagnostics.
import numpy as np  # Use NumPy arrays for probability vectors and matrix operations.
import matplotlib.pyplot as plt  # Use Matplotlib for DAGs, bar charts, traces, and heatmaps.

SEED = 22136  # Fix one seed so every stochastic example is reproducible.
rng = np.random.default_rng(SEED)  # Create one modern NumPy random generator used by all examples.

plt.rcParams["figure.figsize"] = (7, 4)  # Make default plots large enough to read in notebooks.
plt.rcParams["axes.grid"] = True  # Add light grids so probability comparisons are easier to see.
plt.rcParams["font.size"] = 11  # Use readable text size for a university-style notebook.


def normalize(weights):  # Define a helper that converts nonnegative weights into probabilities.
    weights = np.asarray(weights, dtype=float)  # Convert lists or tuples into floating-point arrays.
    total = weights.sum()  # Compute the normalizing constant for the distribution.
    if total <= 0:  # Guard against impossible evidence or all-zero weights.
        raise ValueError("Cannot normalize weights with nonpositive total.")  # Explain the failure clearly.
    return weights / total  # Divide every weight by the same total so probabilities sum to one.


def draw_dag(nodes, edges, positions, title="Bayesian network"):  # Draw a tiny DAG without requiring networkx.
    fig, ax = plt.subplots()  # Create one Matplotlib figure and axis.
    for parent, child in edges:  # Iterate through every directed edge in the network.
        x0, y0 = positions[parent]  # Read the source node position.
        x1, y1 = positions[child]  # Read the target node position.
        ax.annotate("", xy=(x1, y1), xytext=(x0, y0), arrowprops=dict(arrowstyle="->", lw=2))  # Draw one arrow.
    for node in nodes:  # Iterate through the node labels.
        x, y = positions[node]  # Read the node coordinates.
        ax.scatter([x], [y], s=1300, c="white", edgecolors="black", linewidths=2, zorder=3)  # Draw one circle.
        ax.text(x, y, node, ha="center", va="center", fontsize=12, weight="bold", zorder=4)  # Label the node.
    ax.set_title(title)  # Add a descriptive title.
    ax.set_xlim(-0.5, 2.5)  # Fix x-limits so examples are visually stable.
    ax.set_ylim(-0.5, 2.0)  # Fix y-limits so examples are visually stable.
    ax.axis("off")  # Hide axes because the graph layout is conceptual, not numeric.
    plt.show()  # Display the DAG.


def bar_distribution(labels, probs, title, ylabel="Probability"):  # Draw a small probability bar chart.
    fig, ax = plt.subplots()  # Create one figure and one axis.
    ax.bar(labels, probs, color=["#4C78A8", "#F58518", "#54A24B", "#E45756"][: len(labels)])  # Plot one bar per value.
    ax.set_ylim(0, 1)  # Probability bars live between 0 and 1.
    ax.set_ylabel(ylabel)  # Label the vertical axis.
    ax.set_title(title)  # Title the plot with the query being shown.
    for index, prob in enumerate(probs):  # Iterate through probabilities to annotate each bar.
        ax.text(index, prob + 0.02, f"{prob:.3f}", ha="center")  # Write the numeric probability above the bar.
    plt.show()  # Display the bar chart.


def binary_assignments(variables):  # Enumerate all binary assignments for a given variable list.
    for values in itertools.product([0, 1], repeat=len(variables)):  # Generate every 0/1 combination.
        yield dict(zip(variables, values))  # Return the combination as a variable-to-value dictionary.
```

### Data — swappable sources

The coded examples use small Bayesian networks.  The `DATA_SOURCE` switch chooses one of two built-in networks: a medical network for disease/symptom reasoning or an alarm network for explaining away and Gibbs sampling.  Both are fully local and require no internet.

```python
DATA_SOURCE = "alarm"  # Choose "medical" for Disease->Symptoms or "alarm" for Burglary/Earthquake->Alarm.

medical_bn = {  # Store one compact binary medical Bayesian network.
    "variables": ["D", "F", "C"],  # Name the variables: disease, fever, cough.
    "parents": {"D": [], "F": ["D"], "C": ["D"]},  # Record the DAG parent sets.
    "cpts": {  # Store each CPT as a dictionary keyed by parent values and node value.
        "D": {(): {0: 0.90, 1: 0.10}},  # Disease prior: disease is rare.
        "F": {(0,): {0: 0.95, 1: 0.05}, (1,): {0: 0.20, 1: 0.80}},  # Fever is likely if disease is present.
        "C": {(0,): {0: 0.90, 1: 0.10}, (1,): {0: 0.30, 1: 0.70}},  # Cough is likely if disease is present.
    },  # End CPT dictionary.
}  # End medical network.

alarm_bn = {  # Store one compact binary alarm Bayesian network.
    "variables": ["B", "E", "A", "J", "M"],  # Name burglary, earthquake, alarm, JohnCalls, MaryCalls.
    "parents": {"B": [], "E": [], "A": ["B", "E"], "J": ["A"], "M": ["A"]},  # Record DAG parent sets.
    "cpts": {  # Store local CPTs using classic alarm-style probabilities.
        "B": {(): {0: 0.999, 1: 0.001}},  # Burglary is very rare.
        "E": {(): {0: 0.998, 1: 0.002}},  # Earthquake is also very rare.
        "A": {(0, 0): {0: 0.999, 1: 0.001}, (0, 1): {0: 0.710, 1: 0.290}, (1, 0): {0: 0.060, 1: 0.940}, (1, 1): {0: 0.050, 1: 0.950}},  # Alarm depends on both causes.
        "J": {(0,): {0: 0.950, 1: 0.050}, (1,): {0: 0.100, 1: 0.900}},  # John often calls when the alarm rings.
        "M": {(0,): {0: 0.990, 1: 0.010}, (1,): {0: 0.300, 1: 0.700}},  # Mary often calls when the alarm rings.
    },  # End CPT dictionary.
}  # End alarm network.

bn = alarm_bn if DATA_SOURCE == "alarm" else medical_bn  # Select the active network from the switch.
print("Active variables:", bn["variables"])  # Print the variables so the learner knows which source is active.
print("Parent sets:", bn["parents"])  # Print the parent sets as a text version of the DAG.
```


### 📖 Concept walkthrough — build each idea from scratch

Before the warm-up examples, we build the core Bayesian-network ideas from scratch. Each step uses only NumPy + Matplotlib, tiny inline data, and `_w` variables so this walkthrough does not collide with the rest of the lesson. The running example is the classic network Rain $\to$ WetGrass and Sprinkler $\to$ WetGrass.

```python
import numpy as np  # Use NumPy for tiny probability tables, enumeration, and reproducible sampling.
import matplotlib.pyplot as plt  # Use Matplotlib so every graph, distribution, and convergence trace is visible.
np.random.seed(22136)  # Fix randomness so the printed samples and figures are reproducible every run.
```

#### 1. DAG, parents, and CPTs

**What:** A Bayesian network starts with a DAG: each node is a random variable, and each arrow points from a direct cause or information source to a direct effect. **Why:** the graph tells us which local CPTs we need to store instead of storing one huge joint table. **Why this approach:** we build dictionaries first because a tiny explicit representation makes every lookup inspectable.

```python
variables_w = ["R", "S", "W"]  # Name Rain, Sprinkler, and WetGrass as compact binary variables.
parents_w = {"R": [], "S": [], "W": ["R", "S"]}  # Store the parent set for each node in the DAG.
edges_w = [("R", "W"), ("S", "W")]  # Store each directed edge as a parent-child pair for plotting.
positions_w = {"R": (0.0, 1.0), "S": (2.0, 1.0), "W": (1.0, 0.0)}  # Choose fixed coordinates for a readable DAG.
print("Variables:", variables_w)  # Print the nodes so the network scope is explicit.
print("Parents:", parents_w)  # Print parent sets because CPT rows are keyed by parent assignments.
```

```python
cpts_w = {  # Store one local conditional probability table per node.
    "R": {(): {0: 0.80, 1: 0.20}},  # Store P(Rain) with no parent key because Rain is a root.
    "S": {(): {0: 0.60, 1: 0.40}},  # Store P(Sprinkler) with no parent key because Sprinkler is a root.
    "W": {(0, 0): {0: 0.95, 1: 0.05}, (0, 1): {0: 0.30, 1: 0.70}, (1, 0): {0: 0.20, 1: 0.80}, (1, 1): {0: 0.05, 1: 0.95}},  # Store P(WetGrass | Rain, Sprinkler).
}  # End the CPT dictionary.
for node_w in variables_w:  # Visit each node so every local table is visible.
    print(node_w, cpts_w[node_w])  # Print the CPT for the current node.
```

```python
fig_w, ax_w = plt.subplots(figsize=(5, 3.5))  # Create a compact figure for the DAG.
for parent_w, child_w in edges_w:  # Draw each arrow from parent to child.
    ax_w.annotate("", xy=positions_w[child_w], xytext=positions_w[parent_w], arrowprops={"arrowstyle": "->", "lw": 2})  # Add one directed dependency arrow.
for node_w, (x_w, y_w) in positions_w.items():  # Draw each variable node at its fixed position.
    ax_w.scatter([x_w], [y_w], s=1400, c="white", edgecolors="black", linewidths=2, zorder=3)  # Draw a white circular node.
    ax_w.text(x_w, y_w, node_w, ha="center", va="center", fontsize=13, weight="bold", zorder=4)  # Label the node with its variable name.
ax_w.set_title("1: DAG and parent sets")  # Title the figure with the subsection number.
ax_w.set_xlim(-0.5, 2.5)  # Fix horizontal limits so the graph is stable.
ax_w.set_ylim(-0.4, 1.4)  # Fix vertical limits so the graph is stable.
ax_w.axis("off")  # Hide numeric axes because the picture is structural.
plt.show()  # Display the DAG.
```

▶ What you'll see: Rain and Sprinkler both point into WetGrass. The arrows encode direct dependencies: once the values of Rain and Sprinkler are known, WetGrass uses only its local CPT row.

The key local normalization rule is $\sum_x P(X=x\mid Parents(X)=pa)=1$ for every parent assignment. Here each row of each CPT sums to one, so every local table is a valid conditional distribution.

*Why it's done this way: dictionaries make the graph-to-CPT connection literal: parent sets choose the key, and the node value chooses the probability inside that row.*

#### 2. Factorized joint distribution

**What:** A Bayesian network multiplies one local CPT entry per node to get one full assignment probability. **Why:** the DAG asserts that the joint distribution can be written as $\prod_i P(X_i\mid Parents(X_i))$. **Why this approach:** we compute one assignment by hand, then enumerate all assignments to verify that the factorized joint is a normalized probability distribution.

```python
def parent_key_w(node_w, assignment_w):  # Define a helper that extracts a node's parent values in parent-list order.
    return tuple(assignment_w[parent_w] for parent_w in parents_w[node_w])  # Return the tuple used as the CPT row key.
def local_prob_w(node_w, value_w, assignment_w):  # Define a helper that reads one CPT entry.
    return cpts_w[node_w][parent_key_w(node_w, assignment_w)][value_w]  # Look up P(node=value | parents) from the correct row.
def joint_prob_w(assignment_w):  # Define the factorized joint probability for one full assignment.
    prob_w = 1.0  # Start the product at one because probabilities multiply.
    for node_w in variables_w:  # Multiply one local term for each node.
        prob_w *= local_prob_w(node_w, assignment_w[node_w], assignment_w)  # Apply P(node | parents) for the assignment.
    return prob_w  # Return the completed product.
def assignments_w():  # Define an iterator over every binary assignment.
    for r_w in [0, 1]:  # Try both Rain values.
        for s_w in [0, 1]:  # Try both Sprinkler values.
            for wet_w in [0, 1]:  # Try both WetGrass values.
                yield {"R": r_w, "S": s_w, "W": wet_w}  # Yield one complete assignment dictionary.
```

```python
example_w = {"R": 1, "S": 0, "W": 1}  # Choose one inspectable assignment: rainy, sprinkler off, grass wet.
terms_w = [local_prob_w(node_w, example_w[node_w], example_w) for node_w in variables_w]  # Collect the three local factors.
print("Assignment:", example_w)  # Print the assignment being scored.
print("Local factors P(R), P(S), P(W|R,S):", terms_w)  # Print each multiplied term.
print("Joint product:", np.prod(terms_w))  # Multiply the local factors directly for comparison.
print("joint_prob_w:", joint_prob_w(example_w))  # Print the helper result to verify it matches.
```

```python
joint_rows_w = [(a_w, joint_prob_w(a_w)) for a_w in assignments_w()]  # Build the full joint by enumeration for checking only.
total_joint_w = sum(prob_w for _, prob_w in joint_rows_w)  # Sum all eight probabilities to test normalization.
for assignment_w, prob_w in joint_rows_w:  # Print each row because the table is tiny.
    print(assignment_w, "->", round(prob_w, 4))  # Show each assignment probability rounded for readability.
print("Total probability:", round(total_joint_w, 6))  # Verify that the factorized joint sums to one.
```

```python
labels_w = [f"R{a_w['R']}S{a_w['S']}W{a_w['W']}" for a_w, _ in joint_rows_w]  # Create compact labels for all joint rows.
probs_w = [prob_w for _, prob_w in joint_rows_w]  # Extract the joint probabilities for plotting.
plt.figure(figsize=(7, 3.5))  # Create a wide figure so eight bars are readable.
plt.bar(labels_w, probs_w, color="#4C78A8")  # Plot each full assignment probability as one bar.
plt.xticks(rotation=45, ha="right")  # Rotate labels so assignment names do not overlap.
plt.ylabel("Joint probability")  # Label the probability axis.
plt.title("2: Factorized joint over all assignments")  # Title the figure with the subsection number.
plt.tight_layout()  # Fit the rotated labels inside the figure.
plt.show()  # Display the full joint distribution.
```

▶ What you'll see: all eight joint probabilities are nonnegative and sum to `1.0`. A full table for three binary variables has $2^3=8$ rows, while this network stores two root priors plus four rows for $P(W\mid R,S)$; for larger sparse DAGs, the savings grow exponentially.

*Why it's done this way: multiplying local terms lets the graph decide which probabilities are needed, so we never hand-write a separate probability for every global state.*

#### 3. Conditional independence

**What:** The graph says a node is independent of its non-descendants after conditioning on its parents. **Why:** this is the assumption that makes a local CPT enough. **Why this approach:** we compare probabilities numerically, so the d-separation statement becomes an equality students can inspect.

```python
def marginal_prob_w(target_w, target_value_w, evidence_w=None):  # Define a small enumerator for P(target=value, evidence) or P(evidence).
    evidence_w = {} if evidence_w is None else evidence_w  # Use empty evidence when none is supplied.
    total_w = 0.0  # Accumulate matching joint probabilities.
    for assignment_w in assignments_w():  # Visit every full assignment in the tiny network.
        if assignment_w[target_w] == target_value_w and all(assignment_w[k_w] == v_w for k_w, v_w in evidence_w.items()):  # Keep rows matching target and evidence.
            total_w += joint_prob_w(assignment_w)  # Add the matching joint probability.
    return total_w  # Return the summed probability.
def evidence_prob_w(evidence_w):  # Define a helper for P(evidence).
    total_w = 0.0  # Accumulate matching rows.
    for assignment_w in assignments_w():  # Visit every full assignment.
        if all(assignment_w[k_w] == v_w for k_w, v_w in evidence_w.items()):  # Keep rows consistent with evidence.
            total_w += joint_prob_w(assignment_w)  # Add the matching joint probability.
    return total_w  # Return the evidence probability.
def conditional_prob_w(target_w, target_value_w, evidence_w):  # Define P(target=value | evidence).
    return marginal_prob_w(target_w, target_value_w, evidence_w) / evidence_prob_w(evidence_w)  # Divide joint-with-evidence by evidence probability.
```

```python
p_sprinkler_w = marginal_prob_w("S", 1)  # Compute P(S=1) with no evidence.
p_sprinkler_given_rain_w = conditional_prob_w("S", 1, {"R": 1})  # Compute P(S=1 | R=1).
p_sprinkler_given_no_rain_w = conditional_prob_w("S", 1, {"R": 0})  # Compute P(S=1 | R=0).
print("P(S=1):", round(p_sprinkler_w, 4))  # Print the root prior for Sprinkler.
print("P(S=1 | R=1):", round(p_sprinkler_given_rain_w, 4))  # Print Sprinkler probability after observing Rain.
print("P(S=1 | R=0):", round(p_sprinkler_given_no_rain_w, 4))  # Print Sprinkler probability after observing no Rain.
```

```python
values_w = [p_sprinkler_w, p_sprinkler_given_rain_w, p_sprinkler_given_no_rain_w]  # Collect the three probabilities for comparison.
labels_w = ["P(S=1)", "P(S=1 | R=1)", "P(S=1 | R=0)"]  # Label each comparison bar.
plt.figure(figsize=(6.5, 3.5))  # Create a compact comparison figure.
plt.bar(labels_w, values_w, color=["#4C78A8", "#F58518", "#54A24B"])  # Draw one bar per probability.
plt.ylim(0, 1)  # Keep the y-axis on the probability scale.
plt.ylabel("Probability")  # Label the vertical axis.
plt.title("3: Conditional independence of root nodes")  # Title the figure with the subsection number.
for index_w, value_w in enumerate(values_w):  # Annotate each bar with its numeric value.
    plt.text(index_w, value_w + 0.03, f"{value_w:.2f}", ha="center")  # Place the rounded probability above the bar.
plt.show()  # Display the independence comparison.
```

▶ What you'll see: all three bars are equal at `0.40`, so $P(S=1\mid R)=P(S=1)$. In d-separation language, the only path between Rain and Sprinkler is the collider $R\to W\leftarrow S$, and that path is blocked unless WetGrass or a descendant of WetGrass is observed.

*Why it's done this way: comparing conditional probabilities directly turns the graph statement "independent given parents" into a numerical equality.*

#### 4. Exact inference by enumeration

**What:** Exact inference computes $P(Query\mid Evidence)$ by summing the joint over hidden variables and normalizing. **Why:** hidden variables are unknown, so every value they could have must contribute. **Why this approach:** we explicitly print the numerator terms and denominator terms for $P(R=1\mid W=1)$.

```python
query_values_w = [0, 1]  # Consider both possible Rain values for normalization.
evidence_w = {"W": 1}  # Observe that the grass is wet.
enum_scores_w = []  # Store one unnormalized score for each Rain value.
for rain_value_w in query_values_w:  # Loop over Rain=0 and Rain=1.
    score_w = 0.0  # Start the hidden-variable sum for this Rain value.
    print("Rain value", rain_value_w)  # Print which numerator branch is being computed.
    for sprinkler_value_w in [0, 1]:  # Sum over the hidden Sprinkler variable.
        assignment_w = {"R": rain_value_w, "S": sprinkler_value_w, "W": 1}  # Create one full assignment consistent with evidence.
        term_w = joint_prob_w(assignment_w)  # Compute the joint probability for this hidden setting.
        score_w += term_w  # Add the term to the unnormalized score.
        print("  hidden S=", sprinkler_value_w, "joint term=", round(term_w, 5))  # Print the term being summed.
    enum_scores_w.append(score_w)  # Store the completed score for this Rain value.
print("Unnormalized scores:", np.round(enum_scores_w, 5))  # Print P(R, W=1) for each Rain value.
```

```python
enum_posterior_w = np.array(enum_scores_w) / np.sum(enum_scores_w)  # Normalize scores so they sum to one over Rain.
print("Normalizer P(W=1):", round(float(np.sum(enum_scores_w)), 5))  # Print the evidence probability used as the denominator.
print("P(R=0 | W=1), P(R=1 | W=1):", np.round(enum_posterior_w, 5))  # Print the posterior distribution.
```

```python
plt.figure(figsize=(5, 3.5))  # Create a small posterior bar chart.
plt.bar(["R=0", "R=1"], enum_posterior_w, color=["#4C78A8", "#F58518"])  # Plot the normalized Rain posterior.
plt.ylim(0, 1)  # Keep the axis on the probability scale.
plt.ylabel("Posterior probability")  # Label the vertical axis.
plt.title("4: Enumeration posterior P(R | W=1)")  # Title the figure with the subsection number.
for index_w, value_w in enumerate(enum_posterior_w):  # Annotate the two posterior bars.
    plt.text(index_w, value_w + 0.03, f"{value_w:.3f}", ha="center")  # Print each probability above its bar.
plt.show()  # Display the exact posterior.
```

▶ What you'll see: the hidden Sprinkler terms are summed once for `R=0` and once for `R=1`, then the two scores are divided by their total. The formula is $P(R\mid W)=\frac{P(R,W)}{\sum_r P(r,W)}$, where each $P(r,W)$ still contains a $\sum_s$ over Sprinkler.

*Why it's done this way: summing removes hidden variables from the joint, and normalizing converts compatible joint mass into a conditional distribution over the query.*

#### 5. Variable elimination

**What:** Variable elimination computes the same posterior but pushes sums inward through small factors. **Why:** it avoids repeatedly rebuilding the whole joint table when only a few variables interact with the hidden variable. **Why this approach:** we eliminate Sprinkler by multiplying only the factors that mention it, then summing it out.

```python
phi_r_w = {0: cpts_w["R"][()][0], 1: cpts_w["R"][()][1]}  # Keep the Rain prior factor.
phi_s_w = {0: cpts_w["S"][()][0], 1: cpts_w["S"][()][1]}  # Keep the Sprinkler prior factor.
phi_w_given_rs_w = {(r_w, s_w): cpts_w["W"][(r_w, s_w)][1] for r_w in [0, 1] for s_w in [0, 1]}  # Restrict WetGrass evidence to W=1.
print("phi_R:", phi_r_w)  # Print the Rain factor.
print("phi_S:", phi_s_w)  # Print the Sprinkler factor.
print("phi_W evidence factor:", phi_w_given_rs_w)  # Print P(W=1 | R,S) as a two-parent factor.
```

```python
message_to_r_w = {}  # Store the result of eliminating Sprinkler as a factor over Rain.
term_count_ve_w = 0  # Count the number of product terms touched by variable elimination.
for rain_value_w in [0, 1]:  # Compute one message entry for each Rain value.
    total_w = 0.0  # Start the sum over Sprinkler for this Rain value.
    pieces_w = []  # Keep printed pieces for inspection.
    for sprinkler_value_w in [0, 1]:  # Eliminate the hidden Sprinkler variable.
        product_w = phi_s_w[sprinkler_value_w] * phi_w_given_rs_w[(rain_value_w, sprinkler_value_w)]  # Multiply only factors containing Sprinkler.
        total_w += product_w  # Add the product into the message.
        term_count_ve_w += 1  # Count this local product term.
        pieces_w.append(round(product_w, 5))  # Store a readable product value.
    message_to_r_w[rain_value_w] = total_w  # Save m(R)=sum_S phi_S(S) phi_W(W=1|R,S).
    print("message for R=", rain_value_w, "pieces", pieces_w, "sum", round(total_w, 5))  # Print the eliminated factor entry.
print("VE local products touched:", term_count_ve_w)  # Print the work count for the elimination step.
```

```python
ve_scores_w = np.array([phi_r_w[r_w] * message_to_r_w[r_w] for r_w in [0, 1]])  # Multiply the remaining Rain prior by the message.
ve_posterior_w = ve_scores_w / ve_scores_w.sum()  # Normalize over Rain to get the posterior.
print("VE unnormalized scores:", np.round(ve_scores_w, 5))  # Print P(R,W=1) from variable elimination.
print("VE posterior:", np.round(ve_posterior_w, 5))  # Print the normalized posterior.
print("Matches enumeration:", np.allclose(ve_posterior_w, enum_posterior_w))  # Verify the result equals enumeration.
```

```python
plt.figure(figsize=(5.5, 3.5))  # Create a comparison figure for enumeration and VE.
width_w = 0.35  # Choose a small offset so paired bars are side by side.
x_w = np.arange(2)  # Create x positions for Rain=0 and Rain=1.
plt.bar(x_w - width_w / 2, enum_posterior_w, width_w, label="enumeration", color="#4C78A8")  # Plot enumeration posterior bars.
plt.bar(x_w + width_w / 2, ve_posterior_w, width_w, label="variable elimination", color="#F58518")  # Plot VE posterior bars.
plt.xticks(x_w, ["R=0", "R=1"])  # Label each query value.
plt.ylim(0, 1)  # Keep probabilities on a common scale.
plt.ylabel("Posterior probability")  # Label the vertical axis.
plt.title("5: Variable elimination matches enumeration")  # Title the figure with the subsection number.
plt.legend()  # Show which bars came from which method.
plt.show()  # Display the comparison.
```

▶ What you'll see: variable elimination produces the same two posterior probabilities as enumeration. The benefit is structural: in larger networks, a good elimination order keeps intermediate factors small instead of expanding a full $2^n$ joint table.

*Why it's done this way: summing out one hidden variable immediately reuses a compact message, so later steps work with smaller factors rather than repeated full assignments.*

#### 6. Gibbs sampling and learning CPTs

**What:** Gibbs sampling approximates a posterior by repeatedly resampling each non-evidence variable from its full conditional distribution. **Why:** exact sums can be too large, but local Markov-blanket calculations are often cheap. **Why this approach:** we clamp $W=1$, sample Rain and Sprinkler, and watch the running estimate of $P(R=1\mid W=1)$ converge toward the exact answer.

```python
def full_conditional_w(node_w, state_w, evidence_w):  # Define P(node | all other current variables) up to normalization.
    weights_w = []  # Store one unnormalized weight for each candidate value.
    for value_w in [0, 1]:  # Try both binary values for the selected node.
        candidate_w = dict(state_w)  # Copy the current full assignment.
        candidate_w[node_w] = value_w  # Replace only the selected node with the candidate value.
        if node_w in evidence_w and evidence_w[node_w] != value_w:  # Disallow changing clamped evidence variables.
            weights_w.append(0.0)  # Give impossible evidence-inconsistent values zero weight.
        else:  # Score candidate values that respect evidence.
            weights_w.append(joint_prob_w(candidate_w))  # Use the full joint here because the network is tiny.
    weights_w = np.array(weights_w, dtype=float)  # Convert weights to a NumPy array for normalization.
    return weights_w / weights_w.sum()  # Normalize the two weights into a conditional distribution.
```

```python
rng_w = np.random.default_rng(22136)  # Create a seeded generator for Gibbs sampling.
state_w = {"R": 0, "S": 0, "W": 1}  # Initialize a complete assignment consistent with the evidence W=1.
samples_w = []  # Store Rain samples after burn-in.
running_estimates_w = []  # Store the running estimate of P(R=1 | W=1).
burn_in_w = 50  # Skip early samples so the chain can move away from its initial state.
num_sweeps_w = 1200  # Run enough short sweeps to show convergence in a tiny model.
for sweep_w in range(num_sweeps_w):  # Repeat Gibbs sweeps.
    for node_w in ["R", "S"]:  # Resample non-evidence variables while keeping W fixed.
        probs_w = full_conditional_w(node_w, state_w, {"W": 1})  # Compute the full conditional for the selected variable.
        state_w[node_w] = int(rng_w.choice([0, 1], p=probs_w))  # Draw the new binary value from that conditional.
    if sweep_w >= burn_in_w:  # Record samples only after burn-in.
        samples_w.append(state_w["R"])  # Store the current Rain value.
        running_estimates_w.append(np.mean(samples_w))  # Update the running empirical probability of Rain.
print("Final Gibbs state:", state_w)  # Print the last state for inspection.
print("Gibbs estimate P(R=1 | W=1):", round(running_estimates_w[-1], 4))  # Print the approximate posterior.
print("Exact P(R=1 | W=1):", round(float(enum_posterior_w[1]), 4))  # Print the exact value for comparison.
```

```python
plt.figure(figsize=(7, 3.5))  # Create a convergence trace figure.
plt.plot(running_estimates_w, color="#4C78A8", label="Gibbs running estimate")  # Plot the empirical estimate over retained samples.
plt.axhline(enum_posterior_w[1], color="#E45756", linestyle="--", label="exact posterior")  # Add the exact posterior as a reference line.
plt.xlabel("Retained sample index")  # Label the horizontal axis.
plt.ylabel("Estimated P(R=1 | W=1)")  # Label the vertical axis.
plt.title("6: Gibbs sampling convergence")  # Title the figure with the subsection number.
plt.legend()  # Show the sampled and exact curves.
plt.show()  # Display the convergence plot.
```

```python
observed_rows_w = np.array([[0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 1], [1, 0, 1], [0, 0, 0]])  # Create tiny fully observed rows [R,S,W].
lambda_w = 1.0  # Use one Laplace pseudo-count per binary outcome.
for parent_values_w in [(0, 0), (0, 1), (1, 0), (1, 1)]:  # Estimate each row of P(W | R,S).
    mask_w = np.all(observed_rows_w[:, :2] == np.array(parent_values_w), axis=1)  # Select rows with the current parent assignment.
    count_w0 = np.sum(observed_rows_w[mask_w, 2] == 0)  # Count observed WetGrass=0 values.
    count_w1 = np.sum(observed_rows_w[mask_w, 2] == 1)  # Count observed WetGrass=1 values.
    smoothed_w = np.array([count_w0 + lambda_w, count_w1 + lambda_w]) / (count_w0 + count_w1 + 2 * lambda_w)  # Apply Laplace smoothing.
    print("parents R,S=", parent_values_w, "counts", [int(count_w0), int(count_w1)], "smoothed P(W=0/1)=", np.round(smoothed_w, 3))  # Print the learned row.
```

▶ What you'll see: the running Gibbs estimate jitters but tends toward the exact posterior line. CPT learning from complete data is just normalized counts; Laplace smoothing uses $\frac{N(x,pa)+\lambda}{\sum_{x'}N(x',pa)+\lambda |Domain(X)|}$ so unseen outcomes do not receive probability zero.

*Why it's done this way: Gibbs uses local resampling to trade exact computation for sample-based approximation, while smoothed counting gives a simple data-driven way to fill CPT rows.*

### 🟢 Basics (warm-up)

#### B1. Look up one CPT entry

Goal: read one local probability from a CPT.

For the binary network $D\to F$, suppose the CPT says

$$
P(F=1\mid D=0)=0.05,
\qquad
P(F=1\mid D=1)=0.80.
$$

The requested entry is

$$
\boxed{P(F=1\mid D=1)=0.80}.
$$

```python
cpt_fever = {(0,): {0: 0.95, 1: 0.05}, (1,): {0: 0.20, 1: 0.80}}  # Store P(Fever | Disease).
disease_value = 1  # Condition on Disease=1 because the patient has the disease in this lookup.
fever_value = 1  # Query Fever=1 because we want the probability of fever being present.
answer_b1 = cpt_fever[(disease_value,)][fever_value]  # Index the parent row and then the child value column.
print(f"P(Fever=1 | Disease=1) = {answer_b1:.2f}")  # Print the exact CPT cell.
```

▶ What you'll see: one printed CPT entry, `0.80`, showing that a CPT lookup does not require summing or normalization.

#### B2. Multiply two factors for one assignment

Goal: compute the unnormalized joint contribution for one assignment.

Let

$$
P(D=1)=0.10,
\qquad
P(F=1\mid D=1)=0.80.
$$

Then

$$
\begin{aligned}
P(D=1,F=1)
&=P(D=1)P(F=1\mid D=1)\\
&=(0.10)(0.80)\\
&=0.080.
\end{aligned}
$$

So

$$
\boxed{P(D=1,F=1)=0.08}.
$$

```python
prior_disease = {0: 0.90, 1: 0.10}  # Store the prior distribution P(Disease).
prob_disease_present = prior_disease[1]  # Read P(Disease=1).
prob_fever_given_disease = cpt_fever[(1,)][1]  # Read P(Fever=1 | Disease=1).
joint_piece = prob_disease_present * prob_fever_given_disease  # Multiply the two local factors.
print(f"P(D=1) * P(F=1 | D=1) = {prob_disease_present:.2f} * {prob_fever_given_disease:.2f} = {joint_piece:.3f}")  # Show the factor product.
```

▶ What you'll see: a single product, `0.080`, which is one row of the joint table induced by the BN.

#### B3. Normalize a two-value posterior row

Goal: turn unnormalized weights into a posterior distribution.

Suppose the two unnormalized weights for $D$ are

$$
w(D=0)=0.18,
\qquad
w(D=1)=0.02.
$$

The normalizing constant is

$$
Z=0.18+0.02=0.20.
$$

Therefore

$$
\begin{aligned}
P(D=0\mid e)&=\frac{0.18}{0.20}=0.90,\\
P(D=1\mid e)&=\frac{0.02}{0.20}=0.10.
\end{aligned}
$$

So the normalized posterior is

$$
\boxed{[0.90,0.10]}.
$$

```python
unnormalized = np.array([0.18, 0.02])  # Store two unnormalized posterior weights.
posterior_b3 = normalize(unnormalized)  # Divide by the sum to get a valid distribution.
print("Unnormalized weights:", unnormalized)  # Print the raw weights before normalization.
print("Normalized posterior:", posterior_b3)  # Print the resulting probabilities.
bar_distribution(["D=0", "D=1"], posterior_b3, "B3: normalized posterior over Disease")  # Visualize the two-value posterior.
```

▶ What you'll see: a two-bar distribution where `D=0` has height `0.900` and `D=1` has height `0.100`.


#### B4. Sum out one variable from a tiny factor

Goal: marginalize one variable by adding rows that differ only in that variable.

```python
factor = {(0, 0): 0.12, (0, 1): 0.08, (1, 0): 0.18, (1, 1): 0.62}  # Store f(A,B) keyed by (A,B).
marginal_a = {a: sum(value for (a_key, b_key), value in factor.items() if a_key == a) for a in [0, 1]}  # Sum over B for each A.
print("Sum out B -> f(A):", marginal_a)  # Print the marginalized factor.
```

▶ What you'll see: the two rows for each value of $A$ are added together.

```python
bar_distribution(["A=0", "A=1"], [marginal_a[0], marginal_a[1]], "B4: marginal after summing out B")  # Visualize the marginal.
```

▶ What you'll see: a two-bar factor over $A$.

👀 **Takeaway:** marginalization removes a variable by summing over its values.

---

#### B5. Compute one 3-node joint probability by the chain rule

Goal: multiply local CPT entries for one complete assignment.

```python
prob_d = medical_bn["cpts"]["D"][()][1]  # Read P(D=1).
prob_f = medical_bn["cpts"]["F"][(1,)][1]  # Read P(F=1 | D=1).
prob_c = medical_bn["cpts"]["C"][(1,)][0]  # Read P(C=0 | D=1).
joint = prob_d * prob_f * prob_c  # Multiply the local factors.
print(f"P(D=1,F=1,C=0) = {prob_d:.2f} * {prob_f:.2f} * {prob_c:.2f} = {joint:.3f}")  # Print the joint row.
```

▶ What you'll see: one joint assignment probability from three CPT lookups.

```python
fig, ax = plt.subplots(figsize=(4.5, 3))  # Create a factor-product chart.
ax.bar(["P(D)", "P(F|D)", "P(C|D)", "joint"], [prob_d, prob_f, prob_c, joint], color=["gray", "gray", "gray", "orange"])  # Compare local entries and product.
ax.set_title("B5 BN chain-rule product")  # Label the chart.
ax.set_ylabel("probability")  # Label the axis.
plt.show()  # Display the chart.
```

▶ What you'll see: the joint probability is the product of the local pieces.

👀 **Takeaway:** a BN factorizes one joint row into local CPT entries.

---

#### B6. Compute one conditional probability ratio

Goal: use $P(A\mid B)=P(A,B)/P(B)$ for one pair of numbers.

```python
joint_ab = 0.06  # Store P(A=1,B=1).
prob_b = 0.20  # Store P(B=1).
conditional = joint_ab / prob_b  # Divide by the evidence probability.
print(f"P(A=1 | B=1) = {joint_ab:.2f} / {prob_b:.2f} = {conditional:.2f}")  # Print the conditional.
```

▶ What you'll see: the conditional probability is `0.30`.

```python
bar_distribution(["joint", "evidence", "conditional"], [joint_ab, prob_b, conditional], "B6: conditional ratio", ylabel="value")  # Compare the ratio pieces.
```

▶ What you'll see: the conditional is a rescaled joint probability.

👀 **Takeaway:** conditioning divides by the probability of the evidence.

---

#### B7. Do one Gibbs resample from local weights

Goal: normalize local weights and draw one new value.

```python
np.random.seed(22136)  # Fix the sample for reproducibility.
weights = np.array([0.30, 0.70])  # Store unnormalized local weights for X=0 and X=1.
probs = normalize(weights)  # Convert weights to a conditional distribution.
new_value = int(np.random.choice([0, 1], p=probs))  # Sample one new value.
print(f"Gibbs conditional = {probs}; sampled X = {new_value}")  # Show probabilities and sample.
```

▶ What you'll see: one variable is resampled from its local conditional.

```python
bar_distribution(["X=0", "X=1"], probs, "B7: one Gibbs conditional")  # Visualize the sampling probabilities.
```

▶ What you'll see: the higher-weight value is more likely, but either value can be sampled.

👀 **Takeaway:** Gibbs sampling samples from normalized local weights.

---

#### B8. Slice one factor to match evidence

Goal: keep only factor rows that agree with observed evidence.

```python
factor = {(0, 0): 0.40, (0, 1): 0.10, (1, 0): 0.20, (1, 1): 0.30}  # Store f(A,B) keyed by (A,B).
evidence = {"B": 1}  # Observe B=1.
sliced = {a: value for (a, b), value in factor.items() if b == evidence["B"]}  # Keep rows matching the evidence.
print("f(A, B=1):", sliced)  # Print the sliced factor over A.
```

▶ What you'll see: rows with `B=0` disappear.

```python
bar_distribution(["A=0", "A=1"], [sliced[0], sliced[1]], "B8: factor sliced by B=1", ylabel="factor value")  # Plot the remaining entries.
```

▶ What you'll see: only evidence-consistent entries remain.

👀 **Takeaway:** evidence reduces a factor by deleting contradictory rows.

---

#### B9. Check one structural independence in a chain

Goal: read a simple conditional independence from graph structure.

```python
parents_chain = {"A": [], "B": ["A"], "C": ["B"]}  # Store the chain A -> B -> C.
is_independent = "B" in parents_chain["C"] and parents_chain["B"] == ["A"]  # Conditioning on B blocks the chain path.
print(f"A is independent of C given B: {is_independent}")  # Print the structural check.
```

▶ What you'll see: observing the middle node blocks the only path from $A$ to $C$.

```python
fig, ax = plt.subplots(figsize=(4.5, 1.5))  # Create a tiny chain diagram.
for x, label in zip([0, 1, 2], ["A", "B observed", "C"]):  # Draw the three variables.
    ax.scatter([x], [0], s=900, color="#F58518" if "observed" in label else "white", edgecolor="black", zorder=2)  # Highlight B.
    ax.text(x, 0, label, ha="center", va="center", fontsize=9)  # Label the node.
ax.annotate("", xy=(0.85, 0), xytext=(0.15, 0), arrowprops=dict(arrowstyle="->"))  # Draw A to B.
ax.annotate("", xy=(1.85, 0), xytext=(1.15, 0), arrowprops=dict(arrowstyle="->"))  # Draw B to C.
ax.set_title("B9 chain blocked by observing B")  # Label the diagram.
ax.axis("off")  # Hide axes.
plt.show()  # Display the diagram.
```

▶ What you'll see: the observed middle node blocks the chain path.

👀 **Takeaway:** in a chain, conditioning on the middle variable separates the endpoints.

---

#### B10. Compute one expected count for MLE

Goal: add fractional responsibility to one CPT count.

```python
old_count = 3.0  # Store the current expected count.
responsibility = 0.25  # Store the fractional probability of this hidden assignment.
new_count = old_count + responsibility  # Add the fractional responsibility.
print(f"expected count = {old_count:.2f} + {responsibility:.2f} = {new_count:.2f}")  # Print the count update.
```

▶ What you'll see: soft evidence increases the count by a fraction.

```python
fig, ax = plt.subplots(figsize=(4.5, 3))  # Create a before/after chart.
ax.bar(["old", "responsibility", "new"], [old_count, responsibility, new_count], color=["gray", "#54A24B", "orange"])  # Plot count pieces.
ax.set_title("B10 expected-count update")  # Label the primitive.
ax.set_ylabel("count")  # Label the axis.
plt.show()  # Render the chart.
```

▶ What you'll see: the updated expected count includes the fractional contribution.

👀 **Takeaway:** hidden-variable MLE can count expected occurrences instead of hard occurrences.

---

### 🟡 Easy

#### E1. Hand-compute a 3-node medical posterior

Data source: pen-and-paper network

$$
D\to F,
\qquad
D\to C.
$$

CPTs:

$$
P(D=1)=0.10,
\qquad
P(D=0)=0.90.
$$

$$
P(F=1\mid D=1)=0.80,
\qquad
P(F=1\mid D=0)=0.05.
$$

$$
P(C=1\mid D=1)=0.70,
\qquad
P(C=1\mid D=0)=0.10.
$$

Query:

$$
P(D=1\mid F=1,C=1).
$$

Because the BN factorizes as

$$
P(D,F,C)=P(D)P(F\mid D)P(C\mid D),
$$

the two unnormalized posterior weights are

$$
\begin{aligned}
w(D=1)
&=P(D=1)P(F=1\mid D=1)P(C=1\mid D=1)\\
&=(0.10)(0.80)(0.70)\\
&=0.056.
\end{aligned}
$$

and

$$
\begin{aligned}
w(D=0)
&=P(D=0)P(F=1\mid D=0)P(C=1\mid D=0)\\
&=(0.90)(0.05)(0.10)\\
&=0.0045.
\end{aligned}
$$

The normalizing constant is

$$
\begin{aligned}
Z
&=w(D=1)+w(D=0)\\
&=0.056+0.0045\\
&=0.0605.
\end{aligned}
$$

Thus

$$
\begin{aligned}
P(D=1\mid F=1,C=1)
&=\frac{w(D=1)}{Z}\\
&=\frac{0.056}{0.0605}\\
&\approx 0.9256.
\end{aligned}
$$

and

$$
\begin{aligned}
P(D=0\mid F=1,C=1)
&=\frac{w(D=0)}{Z}\\
&=\frac{0.0045}{0.0605}\\
&\approx 0.0744.
\end{aligned}
$$

Final answer:

$$
\boxed{P(D=1\mid F=1,C=1)\approx 0.926}.
$$

#### E2. Read conditional independence from a chain

Data source: synthetic chain $A\to B\to C$.

We compare $P(C\mid A)$ with $P(C\mid A,B)$.  In a chain, observing $B$ blocks the path from $A$ to $C$, so after conditioning on $B$, $A$ should not matter.

```python
chain_nodes = ["A", "B", "C"]  # Name the variables in the chain example.
chain_edges = [("A", "B"), ("B", "C")]  # Store the directed chain edges.
chain_positions = {"A": (0, 1), "B": (1, 1), "C": (2, 1)}  # Place the nodes in a horizontal row.
draw_dag(chain_nodes, chain_edges, chain_positions, "E2: chain A → B → C")  # Draw the chain structure.

p_a = {0: 0.60, 1: 0.40}  # Store P(A).
p_b_given_a = {(0,): {0: 0.80, 1: 0.20}, (1,): {0: 0.30, 1: 0.70}}  # Store P(B | A).
p_c_given_b = {(0,): {0: 0.90, 1: 0.10}, (1,): {0: 0.25, 1: 0.75}}  # Store P(C | B).

def joint_chain(a, b, c):  # Define the joint probability for one chain assignment.
    return p_a[a] * p_b_given_a[(a,)][b] * p_c_given_b[(b,)][c]  # Multiply P(A)P(B|A)P(C|B).

def conditional_c_given_a(a):  # Compute P(C=1 | A=a) by summing over hidden B.
    numerator = sum(joint_chain(a, b, 1) for b in [0, 1])  # Sum joint probabilities with C=1 and fixed A.
    denominator = sum(joint_chain(a, b, c) for b in [0, 1] for c in [0, 1])  # Sum all probabilities with fixed A.
    return numerator / denominator  # Divide to get the conditional probability.

def conditional_c_given_a_b(a, b):  # Compute P(C=1 | A=a, B=b).
    numerator = joint_chain(a, b, 1)  # Joint probability with the requested C value.
    denominator = joint_chain(a, b, 0) + joint_chain(a, b, 1)  # Joint probability for both C values.
    return numerator / denominator  # Normalize over C.

p_c_a0 = conditional_c_given_a(0)  # Compute P(C=1 | A=0).
p_c_a1 = conditional_c_given_a(1)  # Compute P(C=1 | A=1).
p_c_a0_b1 = conditional_c_given_a_b(0, 1)  # Compute P(C=1 | A=0, B=1).
p_c_a1_b1 = conditional_c_given_a_b(1, 1)  # Compute P(C=1 | A=1, B=1).

print(f"P(C=1 | A=0) = {p_c_a0:.3f}")  # Show dependence before conditioning on B.
print(f"P(C=1 | A=1) = {p_c_a1:.3f}")  # Show dependence before conditioning on B.
print(f"P(C=1 | A=0, B=1) = {p_c_a0_b1:.3f}")  # Show the blocked-path result.
print(f"P(C=1 | A=1, B=1) = {p_c_a1_b1:.3f}")  # Show the same value when B is fixed.

bar_distribution(["A=0", "A=1"], [p_c_a0, p_c_a1], "E2: before conditioning on B, A changes P(C=1)")  # Plot the marginal dependence.
bar_distribution(["A=0,B=1", "A=1,B=1"], [p_c_a0_b1, p_c_a1_b1], "E2: after conditioning on B=1, A no longer matters")  # Plot conditional independence.
```

▶ What you'll see: before observing $B$, the two bars differ; after fixing $B=1$, the two bars are equal at $0.75$.

#### E3. Explaining away in a collider

Data source: burglary and earthquake causing an alarm.

The collider is

$$
B\to A\leftarrow E.
$$

We compare

$$
P(E=1),
\qquad
P(E=1\mid A=1),
\qquad
P(E=1\mid A=1,B=1).
$$

```python
collider_nodes = ["B", "E", "A"]  # Name the collider variables.
collider_edges = [("B", "A"), ("E", "A")]  # Store two causes pointing to one common effect.
collider_positions = {"B": (0, 1.5), "E": (2, 1.5), "A": (1, 0.4)}  # Place causes above the effect.
draw_dag(collider_nodes, collider_edges, collider_positions, "E3: explaining-away collider")  # Draw the collider DAG.

p_b = alarm_bn["cpts"]["B"][()]  # Read the burglary prior from the alarm network.
p_e = alarm_bn["cpts"]["E"][()]  # Read the earthquake prior from the alarm network.
p_a_given_be = alarm_bn["cpts"]["A"]  # Read the alarm CPT.

def joint_collider(b, e, a):  # Define P(B,E,A) for the collider subnetwork.
    return p_b[b] * p_e[e] * p_a_given_be[(b, e)][a]  # Multiply independent priors and the alarm CPT.

def posterior_e(evidence):  # Compute P(E=1 | evidence) by enumeration.
    weights = []  # Prepare one unnormalized weight for E=0 and one for E=1.
    for e in [0, 1]:  # Iterate over earthquake values.
        total = 0.0  # Initialize the unnormalized weight for this earthquake value.
        for b in [0, 1]:  # Sum over hidden burglary values when not fixed.
            for a in [0, 1]:  # Sum over hidden alarm values when not fixed.
                assignment = {"B": b, "E": e, "A": a}  # Build one full assignment.
                if all(assignment[var] == val for var, val in evidence.items()):  # Keep only assignments matching evidence.
                    total += joint_collider(b, e, a)  # Add the joint probability for a compatible assignment.
        weights.append(total)  # Store the weight for this earthquake value.
    return normalize(weights)  # Normalize the two weights into P(E | evidence).

prior_e = posterior_e({})  # Compute P(E) with no evidence.
post_e_alarm = posterior_e({"A": 1})  # Compute P(E | A=1).
post_e_alarm_burg = posterior_e({"A": 1, "B": 1})  # Compute P(E | A=1, B=1).

print(f"P(E=1) = {prior_e[1]:.5f}")  # Print the rare earthquake prior.
print(f"P(E=1 | A=1) = {post_e_alarm[1]:.5f}")  # Print how the alarm increases earthquake belief.
print(f"P(E=1 | A=1, B=1) = {post_e_alarm_burg[1]:.5f}")  # Print how burglary explains away earthquake.

bar_distribution(["P(E=1)", "P(E=1|A=1)", "P(E=1|A=1,B=1)"], [prior_e[1], post_e_alarm[1], post_e_alarm_burg[1]], "E3: explaining away")  # Plot the three probabilities.
```

▶ What you'll see: the alarm makes earthquake much more plausible than its prior, but confirmed burglary lowers the earthquake probability again.

#### E4. Convert local CPTs into a joint probability table

Data source: Sprinkler/Rain/WetGrass network.

The network is

$$
S\to W\leftarrow R.
$$

The joint factorization is

$$
P(S,R,W)=P(S)P(R)P(W\mid S,R).
$$

```python
sprinkler_nodes = ["S", "R", "W"]  # Name sprinkler, rain, and wet grass.
sprinkler_edges = [("S", "W"), ("R", "W")]  # Store the two causes of wet grass.
sprinkler_positions = {"S": (0, 1.5), "R": (2, 1.5), "W": (1, 0.4)}  # Position the collider-like graph.
draw_dag(sprinkler_nodes, sprinkler_edges, sprinkler_positions, "E4: Sprinkler/Rain/WetGrass")  # Draw the network.

p_s = {0: 0.60, 1: 0.40}  # Store P(Sprinkler).
p_r = {0: 0.70, 1: 0.30}  # Store P(Rain).
p_w_given_sr = {(0, 0): {0: 0.99, 1: 0.01}, (0, 1): {0: 0.20, 1: 0.80}, (1, 0): {0: 0.10, 1: 0.90}, (1, 1): {0: 0.01, 1: 0.99}}  # Store P(WetGrass | Sprinkler, Rain).

joint_rows = []  # Create an empty list for joint table rows.
for s in [0, 1]:  # Iterate over sprinkler values.
    for r in [0, 1]:  # Iterate over rain values.
        for w in [0, 1]:  # Iterate over wet-grass values.
            prob = p_s[s] * p_r[r] * p_w_given_sr[(s, r)][w]  # Multiply local CPT entries.
            joint_rows.append((s, r, w, prob))  # Store the full assignment and probability.

print(" S  R  W   P(S,R,W)")  # Print a table header.
for s, r, w, prob in joint_rows:  # Iterate through the joint rows.
    print(f" {s}  {r}  {w}   {prob:.4f}")  # Print one assignment and its probability.
print("Total probability:", sum(prob for _, _, _, prob in joint_rows))  # Verify the joint distribution sums to one.

heat = np.array([[p_s[s] * p_r[r] * p_w_given_sr[(s, r)][1] for r in [0, 1]] for s in [0, 1]])  # Build a heatmap of P(S,R,W=1).
fig, ax = plt.subplots()  # Create one figure and axis.
im = ax.imshow(heat, cmap="Blues", vmin=0, vmax=heat.max())  # Plot the selected joint probabilities as a heatmap.
ax.set_xticks([0, 1], labels=["R=0", "R=1"])  # Label rain columns.
ax.set_yticks([0, 1], labels=["S=0", "S=1"])  # Label sprinkler rows.
ax.set_title("E4: selected joint entries P(S,R,W=1)")  # Title the heatmap.
for i in [0, 1]:  # Iterate over rows for text annotations.
    for j in [0, 1]:  # Iterate over columns for text annotations.
        ax.text(j, i, f"{heat[i, j]:.3f}", ha="center", va="center")  # Write the probability in each cell.
fig.colorbar(im, ax=ax)  # Add a colorbar to interpret magnitudes.
plt.show()  # Display the heatmap.
```

▶ What you'll see: a complete eight-row joint table summing to `1.0`, plus a heatmap of the four assignments where the grass is wet.

#### E5. One variable-elimination step by hand

Data source: pen-and-paper network

$$
A\to B,
\qquad
A\to C.
$$

Query:

$$
P(B\mid C=1).
$$

CPTs:

$$
P(A=0)=0.6,
\qquad
P(A=1)=0.4.
$$

$$
P(B=1\mid A=0)=0.2,
\qquad
P(B=1\mid A=1)=0.9.
$$

$$
P(C=1\mid A=0)=0.1,
\qquad
P(C=1\mid A=1)=0.8.
$$

The factorization is

$$
P(A,B,C)=P(A)P(B\mid A)P(C\mid A).
$$

After conditioning on $C=1$, the relevant factors are

$$
\phi_1(A)=P(A),
\qquad
\phi_2(A,B)=P(B\mid A),
\qquad
\phi_3(A)=P(C=1\mid A).
$$

Eliminate $A$:

$$
\tau(B)=\sum_A \phi_1(A)\phi_2(A,B)\phi_3(A).
$$

For $B=1$:

$$
\begin{aligned}
\tau(B=1)
&=P(A=0)P(B=1\mid A=0)P(C=1\mid A=0)\\
&\quad +P(A=1)P(B=1\mid A=1)P(C=1\mid A=1)\\
&=(0.6)(0.2)(0.1)+(0.4)(0.9)(0.8)\\
&=0.012+0.288\\
&=0.300.
\end{aligned}
$$

For $B=0$:

$$
\begin{aligned}
\tau(B=0)
&=P(A=0)P(B=0\mid A=0)P(C=1\mid A=0)\\
&\quad +P(A=1)P(B=0\mid A=1)P(C=1\mid A=1)\\
&=(0.6)(0.8)(0.1)+(0.4)(0.1)(0.8)\\
&=0.048+0.032\\
&=0.080.
\end{aligned}
$$

Normalize:

$$
Z=0.300+0.080=0.380.
$$

Therefore

$$
\begin{aligned}
P(B=1\mid C=1)&=\frac{0.300}{0.380}\approx0.7895,\\
P(B=0\mid C=1)&=\frac{0.080}{0.380}\approx0.2105.
\end{aligned}
$$

Final answer:

$$
\boxed{P(B=1\mid C=1)\approx0.789}.
$$

### 🔴 Advanced

#### A1. Variable elimination with ordering cost

Data source: five-node student-style BN.

The network is

$$
I\to G\leftarrow D,
\qquad
G\to L,
\qquad
I\to S.
$$

We query $P(I\mid L=1,S=1)$ and compare two elimination orders.  The posterior is the same, but the largest intermediate factor can differ.

```python
student_bn = {  # Store a five-node student Bayesian network.
    "variables": ["D", "I", "G", "S", "L"],  # Difficulty, intelligence, grade, SAT, letter.
    "parents": {"D": [], "I": [], "G": ["I", "D"], "S": ["I"], "L": ["G"]},  # Record parent sets.
    "cpts": {  # Store binary CPTs for the network.
        "D": {(): {0: 0.60, 1: 0.40}},  # D=1 means difficult course.
        "I": {(): {0: 0.70, 1: 0.30}},  # I=1 means high intelligence.
        "G": {(0, 0): {0: 0.70, 1: 0.30}, (0, 1): {0: 0.95, 1: 0.05}, (1, 0): {0: 0.10, 1: 0.90}, (1, 1): {0: 0.50, 1: 0.50}},  # G=1 means good grade.
        "S": {(0,): {0: 0.80, 1: 0.20}, (1,): {0: 0.05, 1: 0.95}},  # S=1 means high SAT score.
        "L": {(0,): {0: 0.90, 1: 0.10}, (1,): {0: 0.05, 1: 0.95}},  # L=1 means strong recommendation letter.
    },  # End CPT dictionary.
}  # End student network.


def cpt_to_factor(bn_local, variable):  # Convert one CPT into a generic factor table.
    scope = bn_local["parents"][variable] + [variable]  # Factor scope is parents followed by the child variable.
    table = {}  # Create an empty table mapping assignments to probabilities.
    for parent_values, child_probs in bn_local["cpts"][variable].items():  # Iterate over CPT rows.
        for child_value, prob in child_probs.items():  # Iterate over child values in each row.
            table[parent_values + (child_value,)] = prob  # Store the probability under the full scope assignment.
    return {"scope": tuple(scope), "table": table}  # Return a factor as scope plus table.


def restrict_factor(factor, evidence):  # Condition a factor on observed evidence.
    scope = list(factor["scope"])  # Convert the scope to a mutable list.
    keep_indices = [i for i, var in enumerate(scope) if var not in evidence]  # Keep variables that are not observed.
    new_scope = tuple(scope[i] for i in keep_indices)  # Build the restricted factor scope.
    new_table = {}  # Create the restricted factor table.
    for assignment, prob in factor["table"].items():  # Iterate over original factor entries.
        if all(assignment[scope.index(var)] == val for var, val in evidence.items() if var in scope):  # Keep rows matching evidence.
            new_assignment = tuple(assignment[i] for i in keep_indices)  # Drop evidence coordinates from the assignment.
            new_table[new_assignment] = new_table.get(new_assignment, 0.0) + prob  # Store the restricted probability.
    return {"scope": new_scope, "table": new_table}  # Return the restricted factor.


def multiply_factors(factors):  # Multiply a list of factors into one factor.
    new_scope = tuple(dict.fromkeys(var for factor in factors for var in factor["scope"]))  # Union scopes while preserving order.
    new_table = {}  # Create the product table.
    for values in itertools.product([0, 1], repeat=len(new_scope)):  # Enumerate assignments to the union scope.
        assignment_map = dict(zip(new_scope, values))  # Convert tuple assignment into a dictionary.
        prob = 1.0  # Start the product at one.
        for factor in factors:  # Multiply every input factor.
            key = tuple(assignment_map[var] for var in factor["scope"])  # Project the union assignment onto this factor.
            prob *= factor["table"].get(key, 0.0)  # Multiply by the matching factor entry.
        new_table[values] = prob  # Store the product probability.
    return {"scope": new_scope, "table": new_table}  # Return the product factor.


def sum_out(factor, variable):  # Sum one variable out of a factor.
    scope = list(factor["scope"])  # Convert scope to a list for indexing.
    index = scope.index(variable)  # Find the coordinate of the variable to eliminate.
    new_scope = tuple(var for var in scope if var != variable)  # Remove the eliminated variable from the scope.
    new_table = {}  # Create the summed factor table.
    for assignment, prob in factor["table"].items():  # Iterate over original entries.
        new_assignment = tuple(value for j, value in enumerate(assignment) if j != index)  # Drop the eliminated coordinate.
        new_table[new_assignment] = new_table.get(new_assignment, 0.0) + prob  # Add probabilities that agree on remaining variables.
    return {"scope": new_scope, "table": new_table}  # Return the marginalized factor.


def variable_elimination(bn_local, query, evidence, elimination_order):  # Run exact inference by variable elimination.
    factors = [cpt_to_factor(bn_local, var) for var in bn_local["variables"]]  # Convert every CPT to a factor.
    factors = [restrict_factor(factor, evidence) for factor in factors]  # Restrict all factors by the evidence.
    max_entries = max(len(factor["table"]) for factor in factors)  # Track the largest table seen so far.
    trace = []  # Store elimination diagnostics for plotting.
    for hidden in elimination_order:  # Process hidden variables in the chosen order.
        involved = [factor for factor in factors if hidden in factor["scope"]]  # Collect factors mentioning the hidden variable.
        uninvolved = [factor for factor in factors if hidden not in factor["scope"]]  # Keep factors that do not mention it.
        if not involved:  # Skip variables already removed by evidence or disconnection.
            factors = uninvolved  # Keep the current uninvolved factors.
            continue  # Move to the next hidden variable.
        product = multiply_factors(involved)  # Multiply all factors that contain this hidden variable.
        max_entries = max(max_entries, len(product["table"]))  # Update the maximum intermediate size.
        trace.append((hidden, len(product["table"]), product["scope"]))  # Record the table size before summing out.
        reduced = sum_out(product, hidden)  # Sum out the hidden variable.
        factors = uninvolved + [reduced]  # Put the reduced factor back into the factor list.
    final = multiply_factors(factors)  # Multiply the remaining factors.
    max_entries = max(max_entries, len(final["table"]))  # Include the final product size in the cost.
    query_scope = final["scope"]  # Read the scope of the final factor.
    weights = []  # Prepare query weights in value order 0, 1.
    for q_value in [0, 1]:  # Iterate over binary query values.
        total = 0.0  # Initialize the weight for this query value.
        for assignment, prob in final["table"].items():  # Iterate over remaining factor entries.
            if assignment[query_scope.index(query)] == q_value:  # Keep entries matching the query value.
                total += prob  # Add compatible probability mass.
        weights.append(total)  # Store this query value's unnormalized weight.
    return normalize(weights), max_entries, trace  # Return the posterior, max table size, and diagnostic trace.

order_good = ["D", "G"]  # Eliminate D then G for one ordering.
order_bad = ["G", "D"]  # Eliminate G then D for a second ordering.
posterior_good, cost_good, trace_good = variable_elimination(student_bn, "I", {"L": 1, "S": 1}, order_good)  # Run VE with first order.
posterior_bad, cost_bad, trace_bad = variable_elimination(student_bn, "I", {"L": 1, "S": 1}, order_bad)  # Run VE with second order.

print("Posterior with order D,G:", posterior_good, "max entries:", cost_good, "trace:", trace_good)  # Print results for first order.
print("Posterior with order G,D:", posterior_bad, "max entries:", cost_bad, "trace:", trace_bad)  # Print results for second order.
bar_distribution(["I=0", "I=1"], posterior_good, "A1: exact posterior P(I | L=1, S=1)")  # Plot the posterior over intelligence.

fig, ax = plt.subplots()  # Create a figure for order-cost comparison.
ax.bar(["order D,G", "order G,D"], [cost_good, cost_bad], color=["#4C78A8", "#F58518"])  # Plot maximum intermediate table sizes.
ax.set_ylabel("Largest factor entries")  # Label the cost axis.
ax.set_title("A1: elimination order changes intermediate factor size")  # Title the plot.
for index, value in enumerate([cost_good, cost_bad]):  # Iterate over bar values.
    ax.text(index, value + 0.1, str(value), ha="center")  # Annotate each bar with the table size.
plt.show()  # Display the cost comparison.
```

▶ What you'll see: both orders give the same posterior for $I$, but the diagnostic traces expose different intermediate factor scopes and sizes.

#### A2. Forward-backward smoothing in an HMM

Data source: hidden weather states and noisy umbrella observations.

States: $H_t\in\{Sunny,Rainy\}$.  Evidence: $E_t=1$ means an umbrella was observed.

```python
states = ["Sunny", "Rainy"]  # Name the two hidden weather states.
state_count = len(states)  # Count states for array dimensions.
initial = np.array([0.60, 0.40])  # Store P(H1) over Sunny and Rainy.
transition = np.array([[0.80, 0.20], [0.30, 0.70]])  # Store P(H_t | H_{t-1}) as rows from previous state.
emission = np.array([[0.90, 0.10], [0.20, 0.80]])  # Store P(Umbrella=0/1 | state) as rows by state.
observations = np.array([1, 1, 0, 1, 1, 0])  # Use a short umbrella sequence.
T = len(observations)  # Count the number of time steps.

forward = np.zeros((T, state_count))  # Allocate forward messages.
backward = np.zeros((T, state_count))  # Allocate backward messages.
forward[0] = normalize(initial * emission[:, observations[0]])  # Initialize F1 with prior times first evidence likelihood.
for t in range(1, T):  # Iterate forward through time.
    predicted = forward[t - 1] @ transition  # Predict the next hidden-state distribution.
    forward[t] = normalize(predicted * emission[:, observations[t]])  # Condition on the current observation and normalize.

backward[-1] = np.ones(state_count)  # Initialize the final backward message to all ones.
for t in range(T - 2, -1, -1):  # Iterate backward from T-1 down to 1.
    likelihood_next = emission[:, observations[t + 1]] * backward[t + 1]  # Combine next evidence likelihood with next backward message.
    backward[t] = normalize(transition @ likelihood_next)  # Sum over next states and normalize for readability.

smoothed = np.zeros((T, state_count))  # Allocate smoothed posteriors.
for t in range(T):  # Iterate over every time step.
    smoothed[t] = normalize(forward[t] * backward[t])  # Multiply forward and backward evidence summaries.

print("Observations where 1 means umbrella:", observations.tolist())  # Print the evidence sequence.
print("Smoothed P(Rainy):", np.round(smoothed[:, 1], 3).tolist())  # Print the posterior probability of rain at each time.

fig, axes = plt.subplots(1, 3, figsize=(14, 3))  # Create three side-by-side heatmaps.
for ax, matrix, title in zip(axes, [forward, backward, smoothed], ["Forward", "Backward", "Smoothed"]):  # Iterate over matrices to plot.
    im = ax.imshow(matrix.T, aspect="auto", cmap="Blues", vmin=0, vmax=1)  # Plot states by time as a heatmap.
    ax.set_yticks([0, 1], labels=states)  # Label hidden states on the y-axis.
    ax.set_xticks(range(T), labels=[f"t={i+1}" for i in range(T)])  # Label time steps on the x-axis.
    ax.set_title(title)  # Title each heatmap.
    for i in range(state_count):  # Iterate over state rows.
        for j in range(T):  # Iterate over time columns.
            ax.text(j, i, f"{matrix[j, i]:.2f}", ha="center", va="center", fontsize=9)  # Annotate each cell.
fig.colorbar(im, ax=axes.ravel().tolist(), shrink=0.8)  # Add one shared colorbar.
plt.show()  # Display the heatmaps.

fig, ax = plt.subplots()  # Create a line plot for smoothed rain probabilities.
ax.plot(range(1, T + 1), smoothed[:, 1], marker="o", label="P(Rainy | all umbrellas)")  # Plot smoothed rainy posterior over time.
ax.set_ylim(0, 1)  # Restrict y-axis to probability range.
ax.set_xlabel("time")  # Label x-axis.
ax.set_ylabel("posterior probability")  # Label y-axis.
ax.set_title("A2: forward-backward smoothing")  # Title the line plot.
ax.legend()  # Show the legend.
plt.show()  # Display the posterior curve.
```

▶ What you'll see: forward, backward, and smoothed heatmaps; smoothed probabilities use both past and future observations.

#### A3. Gibbs sampling convergence and burn-in

Data source: alarm-style BN with evidence fixed.

Query:

$$
P(B=1\mid J=1,M=1).
$$

We compute the exact answer by variable elimination, then approximate it with Gibbs sampling from scratch.

```python
alarm_nodes = ["B", "E", "A", "J", "M"]  # Name all variables in the alarm network.
alarm_edges = [("B", "A"), ("E", "A"), ("A", "J"), ("A", "M")]  # Store the alarm DAG edges.
alarm_positions = {"B": (0, 1.5), "E": (2, 1.5), "A": (1, 0.8), "J": (0.4, 0.1), "M": (1.6, 0.1)}  # Place the nodes.
draw_dag(alarm_nodes, alarm_edges, alarm_positions, "A3: alarm BN for Gibbs sampling")  # Draw the full alarm network.

exact_alarm, _, _ = variable_elimination(alarm_bn, "B", {"J": 1, "M": 1}, ["E", "A"])  # Compute exact P(B | J=1,M=1).
print(f"Exact P(B=1 | J=1, M=1) = {exact_alarm[1]:.4f}")  # Print the exact posterior for comparison.

children = {var: [] for var in alarm_bn["variables"]}  # Create an empty child list for every variable.
for child, parents in alarm_bn["parents"].items():  # Iterate over parent sets.
    for parent in parents:  # Iterate over parents of the current child.
        children[parent].append(child)  # Register the current node as a child of this parent.


def local_prob(bn_local, variable, value, assignment):  # Evaluate one local CPT probability under an assignment.
    parent_values = tuple(assignment[parent] for parent in bn_local["parents"][variable])  # Collect parent values in CPT order.
    return bn_local["cpts"][variable][parent_values][value]  # Return P(variable=value | parents).


def gibbs_conditional(bn_local, variable, assignment):  # Compute P(variable | Markov blanket) up to normalization.
    weights = []  # Store one unnormalized weight per candidate value.
    for value in [0, 1]:  # Iterate over binary candidate values.
        trial = dict(assignment)  # Copy the current full assignment.
        trial[variable] = value  # Set the variable to the candidate value.
        weight = local_prob(bn_local, variable, value, trial)  # Include the node's own CPT probability.
        for child in children[variable]:  # Iterate over children whose CPTs also depend on this variable.
            weight *= local_prob(bn_local, child, trial[child], trial)  # Multiply the child's local probability.
        weights.append(weight)  # Store the unnormalized conditional weight.
    return normalize(weights)  # Normalize the two weights into a Bernoulli distribution.


def run_gibbs_alarm(num_sweeps, burn_in):  # Run Gibbs sampling for the alarm query.
    evidence = {"J": 1, "M": 1}  # Fix the evidence variables throughout sampling.
    non_evidence = [var for var in alarm_bn["variables"] if var not in evidence]  # Identify variables to resample.
    assignment = {var: int(rng.integers(0, 2)) for var in alarm_bn["variables"]}  # Randomly initialize every variable.
    assignment.update(evidence)  # Overwrite evidence variables with their fixed observed values.
    trace_b = []  # Store sampled burglary values after burn-in.
    running_estimate = []  # Store the running estimate of P(B=1 | evidence).
    for sweep in range(num_sweeps):  # Iterate through complete Gibbs sweeps.
        for variable in non_evidence:  # Resample every non-evidence variable once per sweep.
            probs = gibbs_conditional(alarm_bn, variable, assignment)  # Compute the local conditional distribution.
            assignment[variable] = int(rng.choice([0, 1], p=probs))  # Sample the new value from the conditional.
        if sweep >= burn_in:  # Ignore initial burn-in samples.
            trace_b.append(assignment["B"])  # Record the query variable after burn-in.
            running_estimate.append(np.mean(trace_b))  # Update the running posterior estimate.
    return np.array(trace_b), np.array(running_estimate)  # Return the trace and running estimate.

trace_b, running_b = run_gibbs_alarm(num_sweeps=6000, burn_in=500)  # Run the Gibbs sampler.
gibbs_estimate = np.array([1 - running_b[-1], running_b[-1]])  # Convert mean of B=1 samples into a two-value posterior.
print(f"Gibbs estimate P(B=1 | J=1, M=1) = {gibbs_estimate[1]:.4f}")  # Print the sampled estimate.

fig, ax = plt.subplots()  # Create a convergence plot.
ax.plot(running_b, label="Gibbs running estimate")  # Plot running P(B=1).
ax.axhline(exact_alarm[1], color="black", linestyle="--", label="Exact VE answer")  # Add exact posterior reference line.
ax.set_xlabel("post-burn-in sample index")  # Label x-axis.
ax.set_ylabel("estimated P(B=1 | J=1,M=1)")  # Label y-axis.
ax.set_title("A3: Gibbs convergence to exact posterior")  # Title the plot.
ax.legend()  # Show legend.
plt.show()  # Display convergence plot.

bar_distribution(["B=0 exact", "B=1 exact"], exact_alarm, "A3: exact posterior from variable elimination")  # Plot exact posterior.
bar_distribution(["B=0 Gibbs", "B=1 Gibbs"], gibbs_estimate, "A3: approximate posterior from Gibbs sampling")  # Plot approximate posterior.
```

▶ What you'll see: a noisy running estimate that moves toward the exact variable-elimination answer, followed by exact-vs-sampled posterior bars.

#### A4. Particle filtering with a rare-observation edge case

Data source: one-dimensional object-tracking HMM.

Hidden state $X_t\in\{0,1,\ldots,9\}$ is position.  Evidence $E_t$ is a noisy sensor reading.  A rare, highly informative reading can collapse particle weights, causing low effective sample size.

```python
positions = np.arange(10)  # Define ten possible object positions.
position_count = len(positions)  # Count hidden states.
start_dist = normalize(np.exp(-0.5 * ((positions - 2) / 1.2) ** 2))  # Start near position 2 with Gaussian-like mass.
move_matrix = np.zeros((position_count, position_count))  # Allocate transition probabilities P(next | current).
for current in positions:  # Iterate over current positions.
    raw = np.exp(-0.5 * ((positions - min(current + 1, 9)) / 1.0) ** 2)  # Prefer moving one step to the right.
    move_matrix[current] = normalize(raw)  # Normalize the transition row.

sensor_sigma = 0.75  # Use a sharp observation model to create potential weight degeneracy.
observed_positions = np.array([2, 3, 4, 8, 6, 7])  # Include one surprising jump to position 8 at time 4.


def sensor_likelihood(observation):  # Return P(E_t=observation | X_t=x) up to normalization across positions.
    return np.exp(-0.5 * ((positions - observation) / sensor_sigma) ** 2)  # Use a Gaussian-shaped sensor likelihood.

exact_filter = np.zeros((len(observed_positions), position_count))  # Allocate exact filtering distributions.
prior = start_dist.copy()  # Start from the initial distribution before observing evidence.
for t, obs in enumerate(observed_positions):  # Iterate over sensor readings.
    predicted = prior if t == 0 else exact_filter[t - 1] @ move_matrix  # Predict from previous filtered distribution.
    exact_filter[t] = normalize(predicted * sensor_likelihood(obs))  # Condition on the current observation.

particle_count = 400  # Choose a moderate number of particles for a visible approximation.
particles = rng.choice(positions, size=particle_count, p=start_dist)  # Initialize particles from the start distribution.
particle_history = []  # Store particles after each resampling step.
ess_history = []  # Store effective sample size before resampling.
for obs in observed_positions:  # Process every observation online.
    proposed = np.array([rng.choice(positions, p=move_matrix[p]) for p in particles])  # Propose next particles through the transition model.
    weights = sensor_likelihood(obs)[proposed]  # Weight each particle by the observation likelihood.
    normalized_weights = normalize(weights)  # Normalize particle weights.
    ess = 1.0 / np.sum(normalized_weights ** 2)  # Compute effective sample size.
    ess_history.append(ess)  # Store ESS as a degeneracy diagnostic.
    resample_indices = rng.choice(np.arange(particle_count), size=particle_count, p=normalized_weights)  # Resample according to weights.
    particles = proposed[resample_indices]  # Replace old particles with resampled particles.
    particle_history.append(particles.copy())  # Save the particle cloud.

particle_estimates = np.zeros_like(exact_filter)  # Allocate histogram estimates from particles.
for t, cloud in enumerate(particle_history):  # Iterate through particle clouds over time.
    counts = np.bincount(cloud, minlength=position_count)  # Count particles at each position.
    particle_estimates[t] = counts / counts.sum()  # Normalize counts into an empirical distribution.

fig, axes = plt.subplots(1, 2, figsize=(12, 4))  # Create two heatmaps side by side.
axes[0].imshow(exact_filter.T, aspect="auto", cmap="Blues", vmin=0, vmax=1)  # Plot exact filtering distributions.
axes[0].set_title("A4: exact filtering")  # Title exact heatmap.
axes[0].set_xlabel("time")  # Label time axis.
axes[0].set_ylabel("position")  # Label state axis.
axes[1].imshow(particle_estimates.T, aspect="auto", cmap="Oranges", vmin=0, vmax=1)  # Plot particle approximation.
axes[1].set_title("A4: particle filter estimate")  # Title particle heatmap.
axes[1].set_xlabel("time")  # Label time axis.
axes[1].set_ylabel("position")  # Label state axis.
plt.show()  # Display heatmaps.

fig, ax = plt.subplots()  # Create an ESS plot.
ax.plot(range(1, len(ess_history) + 1), ess_history, marker="o")  # Plot effective sample size over time.
ax.axhline(particle_count / 2, color="black", linestyle="--", label="half the particles")  # Add a reference line.
ax.set_xlabel("time")  # Label x-axis.
ax.set_ylabel("effective sample size")  # Label y-axis.
ax.set_title("A4: rare observations can collapse particle weights")  # Title the diagnostic plot.
ax.legend()  # Show legend.
plt.show()  # Display ESS plot.

fig, ax = plt.subplots()  # Create an error plot.
l1_error = np.abs(exact_filter - particle_estimates).sum(axis=1)  # Compute L1 error per time step.
ax.plot(range(1, len(l1_error) + 1), l1_error, marker="o", color="#E45756")  # Plot approximation error.
ax.set_xlabel("time")  # Label x-axis.
ax.set_ylabel("L1 distance from exact filtering")  # Label y-axis.
ax.set_title("A4: particle approximation error")  # Title error plot.
plt.show()  # Display error plot.
```

▶ What you'll see: the exact filter tracks the surprising observation smoothly, while the particle filter may briefly show low ESS and higher error around the rare observation.

#### A5. Learn CPTs with MLE and Laplace smoothing

Data source: small categorical dataset with a zero-count parent/child combination.

We learn $P(Fever\mid Disease)$ from fully observed rows.  The raw data include no examples with $Disease=0,Fever=1$, so the MLE assigns a brittle zero probability.  Laplace smoothing fixes that.

```python
training_rows = [  # Store fully observed training data as dictionaries.
    {"D": 1, "F": 1},  # Patient 1 has disease and fever.
    {"D": 1, "F": 1},  # Patient 2 has disease and fever.
    {"D": 1, "F": 0},  # Patient 3 has disease without fever.
    {"D": 0, "F": 0},  # Patient 4 has no disease and no fever.
    {"D": 0, "F": 0},  # Patient 5 has no disease and no fever.
    {"D": 0, "F": 0},  # Patient 6 has no disease and no fever.
]  # End training data.

count_table = {(d, f): 0 for d in [0, 1] for f in [0, 1]}  # Initialize all Disease/Fever counts to zero.
for row in training_rows:  # Iterate through observed examples.
    count_table[(row["D"], row["F"])] += 1  # Increment the matching count.

mle_cpt = {}  # Allocate the maximum-likelihood CPT.
laplace_cpt = {}  # Allocate the Laplace-smoothed CPT.
lambda_smooth = 1.0  # Use add-one smoothing.
for d in [0, 1]:  # Learn one CPT row per disease value.
    row_total = sum(count_table[(d, f)] for f in [0, 1])  # Count examples with this disease value.
    mle_cpt[d] = {f: count_table[(d, f)] / row_total for f in [0, 1]}  # Normalize raw counts for MLE.
    laplace_cpt[d] = {f: (count_table[(d, f)] + lambda_smooth) / (row_total + 2 * lambda_smooth) for f in [0, 1]}  # Normalize smoothed counts.

print("Raw counts N(D,F):")  # Print a heading for counts.
for key, value in count_table.items():  # Iterate through count entries.
    print(f"N(D={key[0]}, F={key[1]}) = {value}")  # Print one count.
print("MLE CPT P(F | D):", mle_cpt)  # Print the unsmoothed CPT.
print("Laplace CPT P(F | D):", laplace_cpt)  # Print the smoothed CPT.

labels = ["F=0 | D=0", "F=1 | D=0", "F=0 | D=1", "F=1 | D=1"]  # Define labels for plotting CPT entries.
mle_values = [mle_cpt[0][0], mle_cpt[0][1], mle_cpt[1][0], mle_cpt[1][1]]  # Read MLE probabilities in label order.
laplace_values = [laplace_cpt[0][0], laplace_cpt[0][1], laplace_cpt[1][0], laplace_cpt[1][1]]  # Read smoothed probabilities.
x = np.arange(len(labels))  # Create bar positions.
width = 0.38  # Use side-by-side bar width.
fig, ax = plt.subplots(figsize=(9, 4))  # Create a wider CPT plot.
ax.bar(x - width / 2, mle_values, width, label="MLE")  # Plot MLE probabilities.
ax.bar(x + width / 2, laplace_values, width, label="Laplace")  # Plot smoothed probabilities.
ax.set_xticks(x, labels=labels, rotation=20)  # Label CPT entries on the x-axis.
ax.set_ylim(0, 1)  # CPT probabilities lie between zero and one.
ax.set_ylabel("probability")  # Label the y-axis.
ax.set_title("A5: Laplace smoothing fixes zero-count CPT entries")  # Title the plot.
ax.legend()  # Show the legend.
plt.show()  # Display the CPT comparison.
```

▶ What you'll see: MLE assigns `P(F=1 | D=0)=0`, while Laplace smoothing assigns a small nonzero probability.

### Interactive Experiment

Use the slider to change the number of Gibbs sweeps and compare the sampled estimate to the exact posterior.  In a notebook, this cell creates an interactive widget.  In a plain Python script, it falls back to one static run.

```python
try:  # Try to import notebook widgets when the environment supports them.
    from ipywidgets import interact, IntSlider  # Import a slider and interaction decorator.
except Exception:  # Fall back gracefully outside notebook environments.
    interact = None  # Mark widgets as unavailable.
    IntSlider = None  # Mark the slider class as unavailable.


def gibbs_slider_demo(num_sweeps=3000):  # Define the function controlled by the slider.
    burn_in = min(500, max(0, num_sweeps // 5))  # Use a modest burn-in that scales with the number of sweeps.
    trace, running = run_gibbs_alarm(num_sweeps=num_sweeps, burn_in=burn_in)  # Run Gibbs with the requested sample budget.
    estimate = running[-1] if len(running) else float("nan")  # Read the final estimate if samples exist.
    fig, axes = plt.subplots(1, 2, figsize=(12, 4))  # Create convergence and bar-chart panels.
    axes[0].plot(running, color="#4C78A8")  # Plot the running Gibbs estimate.
    axes[0].axhline(exact_alarm[1], color="black", linestyle="--")  # Add the exact posterior reference.
    axes[0].set_ylim(0, max(0.2, exact_alarm[1] * 2))  # Keep the small burglary probability visible.
    axes[0].set_title("Running Gibbs estimate")  # Title the convergence panel.
    axes[0].set_xlabel("post-burn-in sample")  # Label convergence x-axis.
    axes[0].set_ylabel("P(B=1 | J=1,M=1)")  # Label convergence y-axis.
    axes[1].bar(["exact", "Gibbs"], [exact_alarm[1], estimate], color=["black", "#F58518"])  # Compare final exact and sampled estimates.
    axes[1].set_ylim(0, max(0.2, exact_alarm[1] * 2))  # Use the same visible probability range.
    axes[1].set_title(f"Final estimate after {num_sweeps} sweeps")  # Title the comparison panel.
    plt.show()  # Display the interactive output.
    print(f"Exact={exact_alarm[1]:.4f}; Gibbs={estimate:.4f}; burn-in={burn_in}; retained samples={len(trace)}")  # Print numeric details.

if interact is not None:  # Use widgets when available.
    interact(gibbs_slider_demo, num_sweeps=IntSlider(value=3000, min=500, max=12000, step=500, description="Gibbs sweeps"))  # Create the interactive slider.
else:  # Use a static fallback when widgets are missing.
    gibbs_slider_demo(num_sweeps=3000)  # Run one fixed experiment.
```

▶ What you'll see: increasing the number of Gibbs sweeps usually makes the orange sampled estimate move closer to the black exact posterior line, though Monte Carlo noise never disappears completely.
