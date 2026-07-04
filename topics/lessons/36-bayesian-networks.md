# Bayesian Networks & Inference
> **Source:** CS 221 · **Category:** Concept+Method · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an .ipynb will be generated.

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
