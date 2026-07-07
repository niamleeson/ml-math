# Constraint Satisfaction Problems & Factor Graphs
> **Source:** CS 221 · **Category:** Concept+Method · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an `.ipynb` will be generated.

## 1. Overview

A constraint satisfaction problem (CSP) describes a problem by naming variables, listing each variable's domain of possible values, and imposing constraints that rule out incompatible combinations. Instead of searching blindly through every complete assignment, CSP algorithms exploit local structure: as soon as a partial assignment violates a constraint, the entire branch below it can be discarded.

**One-line intuition:** CSP solving is disciplined trial-and-error: try values, propagate the consequences, and backtrack only when the remaining domains prove the choice impossible.

CSPs are a central representation for map coloring, scheduling, resource allocation, Sudoku-like puzzles, and many symbolic reasoning tasks. Factor graphs generalize CSPs by allowing nonnegative factor weights; CSPs are the special case where every factor is either $0$ (violated) or $1$ (satisfied).

## 2. Key Idea

### 2.1 Variables, domains, factors, and weights

A factor graph contains variables

$$
X=(X_1,\\ldots,X_n),\qquad X_i\in \operatorname{Domain}_i,
$$

and factors

$$
f_1,\\ldots,f_m,\qquad f_j(x)\ge 0.
$$

The **scope** of $f_j$ is the set of variables that $f_j$ depends on. Its **arity** is the size of that scope. A unary factor has arity $1$; a binary factor has arity $2$.

For a complete assignment

$$
x=(x_1,\\ldots,x_n),
$$

the assignment weight is

$$
\operatorname{Weight}(x)=\prod_{j=1}^{m} f_j(x).
$$

A CSP is the 0/1-valued special case:

$$
\forall j,\qquad f_j(x)\in\{0,1\}.
$$

A constraint $j$ is satisfied exactly when $f_j(x)=1$. A complete assignment is **consistent** when all constraints are satisfied:

$$
\operatorname{Weight}(x)=1
\iff
\prod_{j=1}^{m} f_j(x)=1
\iff
\forall j,\ f_j(x)=1.
$$

If any factor is violated, then

$$
\exists j\ f_j(x)=0
\quad\Longrightarrow\quad
\operatorname{Weight}(x)=0.
$$

### 2.2 Backtracking search

Backtracking incrementally builds a partial assignment. At each step it selects one unassigned variable, tries its values, checks constraints whose scopes are now fully assigned, and recurses.

```text
Backtracking(partial_assignment x):
    if every variable is assigned:
        return x if every constraint is satisfied
    choose an unassigned variable X_i
    for each value v in Domain_i:
        extend x with X_i = v
        if no constraint involving assigned variables is violated:
            result <- Backtracking(x)
            if result is not failure:
                return result
        remove X_i from x
    return failure
```

The worst-case running time is still exponential. If all domains have size $d$ and there are $n$ variables, the raw search tree can contain

$$
1+d+d^2+\cdots+d^n=\frac{d^{n+1}-1}{d-1}=O(d^n)
$$

nodes. The point of CSP methods is not to change the worst-case class, but to shrink the practical tree dramatically.

### 2.3 Dependent factors and early pruning

For a partial assignment $x$ and candidate variable $X_i$, the dependent factors

$$
D(x,X_i)
$$

are the factors connecting $X_i$ to already assigned variables. When we tentatively assign $X_i=v$, we only need to check factors in $D(x,X_i)$ plus any unary factor on $X_i$. If a factor evaluates to $0$, the candidate value cannot appear in any valid completion of this branch.

### 2.4 Forward checking

Forward checking performs one-step lookahead. After setting $X_i=v$, each unassigned neighbor $X_k$ loses any value $u$ that is inconsistent with $X_i=v$.

For a binary constraint $c_{ik}$, the updated domain is

$$
\operatorname{Domain}'_k
=
\{u\in\operatorname{Domain}_k: c_{ik}(v,u)=1\}.
$$

If any neighbor domain becomes empty,

$$
\operatorname{Domain}'_k=\varnothing,
$$

then no completion exists below the current partial assignment, so the solver backtracks immediately.

### 2.5 Arc consistency and AC-3

An arc $(X_i,X_k)$ is consistent when every value of $X_i$ has at least one supporting value of $X_k$:

$$
\forall a\in\operatorname{Domain}_i,
\exists b\in\operatorname{Domain}_k
\quad\text{such that}\quad
c_{ik}(a,b)=1.
$$

The operation

$$
\operatorname{Revise}(X_i,X_k)
$$

removes unsupported values from $\operatorname{Domain}_i$:

$$
\operatorname{Domain}_i
\leftarrow
\{a\in\operatorname{Domain}_i:\exists b\in\operatorname{Domain}_k,\\ c_{ik}(a,b)=1\}.
$$

AC-3 repeatedly enforces arc consistency with a queue:

```text
AC-3(domains, constraints):
    queue <- all directed arcs (X_i, X_k)
    while queue is not empty:
        (X_i, X_k) <- pop queue
        if Revise(X_i, X_k) removed any values:
            if Domain_i is empty:
                return failure
            for every neighbor X_h of X_i except X_k:
                push (X_h, X_i) onto queue
    return reduced domains
```

The important causal chain is

$$
\text{domain shrinks}
\Longrightarrow
\text{neighbors may lose support}
\Longrightarrow
\text{recheck incoming arcs}.
$$

### 2.6 Dynamic variable and value ordering

The **most constrained variable** heuristic chooses the unassigned variable with the fewest remaining legal values:

$$
X^*=\operatorname*{argmin}_{X_i\notin\operatorname{assigned}}|\operatorname{Domain}_i^{\text{remaining}}|.
$$

This tends to fail early. If a variable has no legal values, we discover the contradiction before expanding irrelevant branches.

The **least constrained value** heuristic chooses the value that leaves the most options for neighbors:

$$
v^*=\operatorname*{argmax}_{v\in\operatorname{Domain}_i}
\sum_{X_k\in\operatorname{Nbr}(X_i)}
\left|\{u\in\operatorname{Domain}_k:c_{ik}(v,u)=1\}\right|.
$$

This tends to postpone conflicts by preserving future flexibility.

### 2.7 Beam search and approximate assignment

Beam search keeps only the top $K$ partial assignments after each variable is assigned. For branching factor $b$ and $n$ variables, each layer expands at most $K b$ candidates and sorts them, giving

$$
O(n\,K b\log(K b))
$$

time. $K=1$ is greedy search; $K\to\infty$ recovers full breadth-first enumeration of partial assignments.

### 2.8 ICM and Gibbs updates

For weighted factor graphs, iterated conditional modes (ICM) repeatedly updates one variable to the value that maximizes the product of local factors:

$$
x_i\leftarrow
\operatorname*{argmax}_{v\in\operatorname{Domain}_i}
\prod_{j:X_i\in\operatorname{scope}(f_j)} f_j(x_{-i},v).
$$

Gibbs sampling uses the same local weights but samples instead of maximizing:

$$
\Pr(X_i=v\mid x_{-i})
=
\frac{\prod_{j:X_i\in\operatorname{scope}(f_j)} f_j(x_{-i},v)}
{\sum_{u\in\operatorname{Domain}_i}\prod_{j:X_i\in\operatorname{scope}(f_j)} f_j(x_{-i},u)}.
$$

ICM is deterministic and can get trapped in local optima. Gibbs is stochastic and can sometimes escape because even non-best values can receive nonzero probability.

## 3. Worked Examples

### Setup

The remaining coded examples are designed to run top-to-bottom as a single notebook section on a CPU. They use a small shared CSP toolkit written from scratch. Optional packages are guarded so the examples still run if a package is unavailable.

```python
import math  # Provide logarithms and exponentials for weighted-factor calculations.
import random  # Provide reproducible pseudo-random choices for Gibbs sampling.
from collections import defaultdict, deque  # Provide compact graph dictionaries and AC-3 queues.
import numpy as np  # Provide array operations and deterministic numerical helpers.
import matplotlib.pyplot as plt  # Provide plotting for graphs, trees, grids, and bar charts.
np.random.seed(22135)  # Fix NumPy randomness so every run produces the same notebook output.
random.seed(22135)  # Fix Python randomness so stochastic examples are reproducible.
try:  # Try to import NetworkX because it gives clean constraint-graph layouts.
    import networkx as nx  # Use NetworkX only when it is installed in the runtime.
    HAS_NX = True  # Record that NetworkX-backed visualizations are available.
except Exception:  # Fall back gracefully if NetworkX is missing in a minimal runtime.
    nx = None  # Store a harmless sentinel so later code can branch cleanly.
    HAS_NX = False  # Record that manual layouts should be used instead.
COLORS = ["red", "green", "blue"]  # Define the standard three-color domain for map-coloring examples.
COLOR_TO_STYLE = {"red": "#e74c3c", "green": "#2ecc71", "blue": "#3498db", "yellow": "#f1c40f"}  # Map names to plot colors.
def different(a, b):  # Define the core binary map-coloring constraint.
    return a != b  # Neighboring regions are legal exactly when their colors differ.
def same_or_smooth(a, b):  # Define a soft compatibility factor for binary denoising examples.
    return 2.2 if a == b else 0.6  # Equal neighboring labels receive larger factor weight than unequal labels.
def draw_graph(nodes, edges, assignment=None, domains=None, title="Constraint graph"):  # Draw a CSP graph with optional colors and domains.
    assignment = assignment or {}  # Use an empty assignment when no node colors are supplied.
    domains = domains or {}  # Use empty domain annotations when no domains are supplied.
    if HAS_NX:  # Use NetworkX spring layout when available for readable pictures.
        graph = nx.Graph()  # Create an undirected graph object for the constraint graph.
        graph.add_nodes_from(nodes)  # Add all variables as graph nodes.
        graph.add_edges_from(edges)  # Add all binary constraints as graph edges.
        pos = nx.spring_layout(graph, seed=22135)  # Compute deterministic node positions.
    else:  # Use a deterministic circular fallback layout without extra dependencies.
        angles = np.linspace(0, 2 * np.pi, len(nodes), endpoint=False)  # Spread nodes evenly around a circle.
        pos = {node: (float(np.cos(angle)), float(np.sin(angle))) for node, angle in zip(nodes, angles)}  # Store fallback coordinates.
    plt.figure(figsize=(6, 4))  # Create a compact figure that fits in a notebook cell.
    for a, b in edges:  # Draw every constraint edge before drawing nodes.
        xa, ya = pos[a]  # Read the first endpoint location.
        xb, yb = pos[b]  # Read the second endpoint location.
        plt.plot([xa, xb], [ya, yb], color="black", linewidth=1.5, zorder=1)  # Draw a black constraint edge.
    for node in nodes:  # Draw each variable node after edges so nodes appear on top.
        x, y = pos[node]  # Read the plotted location for this variable.
        face = COLOR_TO_STYLE.get(assignment.get(node), "white")  # Use assigned color or white for unassigned variables.
        plt.scatter([x], [y], s=900, color=face, edgecolor="black", zorder=2)  # Draw the variable node.
        label = node if node not in domains else f"{node}\n{sorted(domains[node])}"  # Show domain values when provided.
        plt.text(x, y, label, ha="center", va="center", fontsize=9, zorder=3)  # Label the node in the center.
    plt.title(title)  # Add a descriptive title.
    plt.axis("off")  # Hide axes because this is a graph, not a coordinate plot.
    plt.show()  # Display the graph in the notebook.
def constraint_ok(var_a, val_a, var_b, val_b, constraints):  # Check one binary constraint if it exists.
    if (var_a, var_b) in constraints:  # Handle the stored forward direction.
        return constraints[(var_a, var_b)](val_a, val_b)  # Evaluate the forward constraint.
    if (var_b, var_a) in constraints:  # Handle the stored reverse direction.
        return constraints[(var_b, var_a)](val_b, val_a)  # Evaluate the reverse constraint with flipped arguments.
    return True  # Non-neighbor variables impose no binary restriction.
def count_conflicts(edges, assignment):  # Count violated map-coloring edges in a complete or partial assignment.
    total = 0  # Start with no observed conflicts.
    for a, b in edges:  # Inspect each neighboring pair.
        if a in assignment and b in assignment and assignment[a] == assignment[b]:  # Count only assigned equal-color neighbors.
            total += 1  # Add one violated edge.
    return total  # Return the final conflict count.
def copy_domains(domains):  # Copy a domain dictionary without aliasing mutable sets.
    return {var: set(values) for var, values in domains.items()}  # Return a fresh set for every variable.
```


### 📖 Concept walkthrough — build each idea from scratch

Before the warm-up exercises, we will build the main CSP ideas from scratch in code. The whole walkthrough uses only NumPy + Matplotlib, tiny inline map-coloring data, and variable names ending in `_w` so nothing collides with later notebook cells. Each subsection starts with the plain-English idea, then prints small intermediate objects and draws the constraint graph or domain table.

```python
import numpy as np  # Use NumPy for tiny arrays, deterministic ordering, and simple numerical summaries.
import matplotlib.pyplot as plt  # Use Matplotlib so each CSP state can be inspected visually.
np.random.seed(22135)  # Fix randomness so local-search examples and printed traces are reproducible.
```

#### 1. Variables, domains, factors, and weights

**What.** A CSP starts with variables, a domain for each variable, and factors that score whether a local choice is compatible. For map coloring, each region is a variable, each color is a value, and each edge factor returns $1$ when neighboring colors are different and $0$ when they are equal.

**Why.** Writing constraints as factors lets one formula cover both hard CSPs and weighted factor graphs:

$$
\operatorname{Weight}(x)=\prod_j f_j(x).
$$

If any hard factor is $0$, the whole product becomes $0$, so that complete assignment is ruled out. We use this tiny map because every factor can be inspected by hand.

```python
variables_w = ["A", "B", "C", "D"]  # Name four small map regions so every assignment fits on screen.
domain_w = ["red", "green", "blue"]  # Give every region the same three possible colors.
domains_w = {var_w: list(domain_w) for var_w in variables_w}  # Store one domain list per variable for later pruning examples.
edges_w = [("A", "B"), ("A", "C"), ("B", "C"), ("C", "D")]  # Connect adjacent regions that must have different colors.
positions_w = {"A": (0.0, 1.0), "B": (-1.0, 0.0), "C": (1.0, 0.0), "D": (1.0, -1.0)}  # Fix node positions without NetworkX.
palette_w = {"red": "#e74c3c", "green": "#2ecc71", "blue": "#3498db", None: "white"}  # Map color names to readable plot colors.
print("variables:", variables_w)  # Inspect the variable set before defining constraints.
print("domains:", domains_w)  # Inspect the allowed values for each variable.
print("binary factors:", edges_w)  # Inspect which pairs receive not-equal factors.
```

```python
def draw_graph_w(assignment_w=None, domains_to_show_w=None, title_w="CSP graph"):  # Define one small graph drawer reused throughout the walkthrough.
    assignment_w = {} if assignment_w is None else assignment_w  # Treat missing assignments as an empty partial assignment.
    domains_to_show_w = {} if domains_to_show_w is None else domains_to_show_w  # Treat missing domain labels as no annotations.
    plt.figure(figsize=(5.2, 4.2))  # Create a compact figure that fits beside printed output.
    for left_w, right_w in edges_w:  # Draw every binary factor as one edge.
        x0_w, y0_w = positions_w[left_w]  # Read the left endpoint position.
        x1_w, y1_w = positions_w[right_w]  # Read the right endpoint position.
        plt.plot([x0_w, x1_w], [y0_w, y1_w], color="black", linewidth=1.5, zorder=1)  # Draw the constraint edge.
    for var_w in variables_w:  # Draw every variable node after the edges.
        x_w, y_w = positions_w[var_w]  # Read this variable's plotting position.
        value_w = assignment_w.get(var_w, None)  # Look up the assigned color if one exists.
        label_w = var_w if var_w not in domains_to_show_w else f"{var_w}\n{domains_to_show_w[var_w]}"  # Show a domain table inside nodes when requested.
        plt.scatter([x_w], [y_w], s=1050, color=palette_w.get(value_w, "white"), edgecolor="black", zorder=2)  # Draw the region node.
        plt.text(x_w, y_w, label_w, ha="center", va="center", fontsize=9, zorder=3)  # Label the node with its variable or domain.
    plt.title(title_w)  # Title the figure with the subsection number.
    plt.axis("off")  # Hide coordinate axes because this is a graph drawing.
    plt.show()  # Render the constraint graph.

draw_graph_w(title_w="1: variables, domains, and not-equal factors")  # Show the unassigned CSP structure.
```

▶ What you'll see: four region variables connected by black constraint edges. Each edge represents one factor that checks whether adjacent colors are different.

```python
def edge_factor_w(assignment_w, left_w, right_w):  # Define one hard binary factor for map coloring.
    if left_w not in assignment_w or right_w not in assignment_w:  # Skip factors whose variables are not both assigned yet.
        return 1.0  # Leave partial assignments neutral until the factor can be evaluated.
    return 1.0 if assignment_w[left_w] != assignment_w[right_w] else 0.0  # Return one for legal neighbors and zero for a color clash.

def unary_preference_w(assignment_w):  # Define a tiny weighted unary factor to show that factors need not be only zero or one.
    if "A" not in assignment_w:  # Skip the preference until region A is assigned.
        return 1.0  # Keep incomplete assignments neutral.
    return 1.4 if assignment_w["A"] == "red" else 1.0  # Prefer A=red without making other colors illegal.

def assignment_weight_w(assignment_w):  # Multiply all factor values to get the assignment weight.
    factors_w = [edge_factor_w(assignment_w, left_w, right_w) for left_w, right_w in edges_w]  # Evaluate every binary factor.
    factors_w.append(unary_preference_w(assignment_w))  # Add the soft unary preference factor.
    return float(np.prod(factors_w)), factors_w  # Return the product and the visible factor list.

good_assignment_w = {"A": "red", "B": "green", "C": "blue", "D": "green"}  # Build one valid coloring.
bad_assignment_w = {"A": "red", "B": "red", "C": "blue", "D": "green"}  # Build one invalid coloring with A and B equal.
for name_w, assignment_w in [("good", good_assignment_w), ("bad", bad_assignment_w)]:  # Compare the two assignments side by side.
    weight_w, factors_w = assignment_weight_w(assignment_w)  # Compute the product of all local factors.
    print(name_w, "factors =", factors_w, "weight =", weight_w)  # Show how one zero factor kills the whole product.
```

Hard constraints are encoded as $0/1$ compatibilities because multiplication makes one violation decisive. Weighted factors use positive values such as $1.4$ to express preferences without forbidding an assignment.

*Why it's done this way: local factors make a global feasibility test decomposable, so later algorithms can inspect only the small part of the graph touched by a new assignment.*

#### 2. Backtracking search with dependent factors and early pruning

**What.** Backtracking assigns one variable at a time, checks any factor whose variables are now assigned, and undoes the choice when a violation appears.

**Why.** A constraint such as $A \neq B$ is dependent on both $A$ and $B$; before both are assigned, it cannot fail. Once it fails, every completion below that partial assignment has weight $0$, so the whole subtree can be pruned.

**Why this approach.** We deliberately use a fixed variable order first so the pruning behavior is visible before adding smarter ordering heuristics.

```python
def partial_is_consistent_w(assignment_w):  # Check all currently inspectable edge factors in a partial assignment.
    for left_w, right_w in edges_w:  # Visit each dependent binary factor.
        if left_w in assignment_w and right_w in assignment_w:  # Evaluate the factor only when both endpoints are assigned.
            if assignment_w[left_w] == assignment_w[right_w]:  # Detect a violated not-equal constraint.
                return False, (left_w, right_w)  # Report the failing edge for the search trace.
    return True, None  # Report that no assigned edge currently violates a constraint.

print("A factor is checked only after all variables in its scope are assigned.")  # Explain the dependency in the trace.
print("Current partial assignment {'A': 'red'}:", partial_is_consistent_w({"A": "red"}))  # Show that A-B cannot be checked yet.
print("After adding B='red':", partial_is_consistent_w({"A": "red", "B": "red"}))  # Show the first dependent factor failure.
```

```python
trace_limit_w = 18  # Limit printed trace lines so the notebook stays readable.
trace_count_w = 0  # Count how many trace lines have been printed.
tries_w = 0  # Count how many value attempts the backtracking search makes.
solution_w = None  # Store the first complete legal assignment when found.

def backtrack_w(order_w, assignment_w):  # Define plain depth-first backtracking over a fixed variable order.
    global trace_count_w, tries_w, solution_w  # Reuse the small counters defined outside the function.
    if len(assignment_w) == len(order_w):  # Stop when every variable has a value.
        solution_w = dict(assignment_w)  # Copy the complete solution for later plotting.
        return True  # Signal success to all recursive callers.
    var_w = order_w[len(assignment_w)]  # Choose the next variable by position in the fixed order.
    for value_w in domains_w[var_w]:  # Try each possible color for that variable.
        tries_w += 1  # Count this branch attempt.
        assignment_w[var_w] = value_w  # Extend the partial assignment.
        ok_w, failed_edge_w = partial_is_consistent_w(assignment_w)  # Check only factors that became inspectable.
        if trace_count_w < trace_limit_w:  # Avoid flooding the output with repeated recursion details.
            print("try", dict(assignment_w), "ok=", ok_w, "failed=", failed_edge_w)  # Print the current branch status.
            trace_count_w += 1  # Record that one trace line was printed.
        if ok_w and backtrack_w(order_w, assignment_w):  # Recurse only when no local factor has failed.
            return True  # Stop after the first solution is found.
        assignment_w.pop(var_w)  # Undo the choice before trying the next value.
    return False  # Report failure if every value for this variable leads to contradiction.

found_w = backtrack_w(variables_w, {})  # Run plain backtracking on the fixed order A, B, C, D.
print("found:", found_w, "tries:", tries_w, "solution:", solution_w)  # Inspect the result and the amount of search.
```

```python
draw_graph_w(assignment_w=solution_w, title_w="2: first solution found by backtracking")  # Visualize the complete legal coloring.
```

▶ What you'll see: the trace rejects branches as soon as an assigned edge has equal colors, and the final graph shows a legal coloring with adjacent regions different.

Backtracking prunes a whole subtree because a failed hard factor contributes $0$ to every completion's product. No future assignment to unassigned variables can turn that $0$ back into $1$.

*Why it's done this way: checking dependent factors immediately after they become evaluable is the cheapest way to avoid enumerating impossible completions.*

#### 3. Forward checking

**What.** Forward checking propagates a new assignment one step outward: after assigning $X=v$, it removes every neighbor value that is inconsistent with $v$.

**Why.** Plain backtracking waits until a neighbor is assigned before noticing a clash. Forward checking can discover an empty future domain earlier, which means it backtracks before spending time on irrelevant branches.

**Why this approach.** We use a deliberately tight set of domains so one bad choice visibly wipes out a neighbor's remaining values.

```python
fc_domains_start_w = {"A": ["red"], "B": ["red", "green"], "C": ["green"], "D": ["red", "blue"]}  # Create tight domains that will expose a wipeout.
fc_assignment_w = {}  # Start with no assigned variables.
print("starting domains:", fc_domains_start_w)  # Show the domain table before any propagation.
draw_graph_w(domains_to_show_w=fc_domains_start_w, title_w="3: forward checking before assignment")  # Draw the initial domains on the graph.
```

▶ What you'll see: A has only red, C has only green, and B sits between them with red or green. That makes the next propagation easy to inspect.

```python
def forward_check_w(assignment_w, domains_now_w, var_w, value_w):  # Assign one value and prune inconsistent neighbor domains.
    new_domains_w = {name_w: list(values_w) for name_w, values_w in domains_now_w.items()}  # Copy domains so failed branches do not mutate siblings.
    new_domains_w[var_w] = [value_w]  # Record that the assigned variable now has a singleton domain.
    removed_w = []  # Keep a visible list of values removed by propagation.
    for left_w, right_w in edges_w:  # Inspect every binary factor touching the assigned variable.
        neighbor_w = right_w if left_w == var_w else left_w if right_w == var_w else None  # Find the other endpoint when this edge is relevant.
        if neighbor_w is not None and neighbor_w not in assignment_w:  # Prune only unassigned neighbors.
            kept_w = []  # Build the neighbor's filtered domain.
            for candidate_w in new_domains_w[neighbor_w]:  # Test each neighbor value against the new assignment.
                legal_w = candidate_w != value_w  # Map coloring keeps only values different from the assigned color.
                if legal_w:  # Preserve consistent values.
                    kept_w.append(candidate_w)  # Add this value to the filtered domain.
                else:  # Record inconsistent values for inspection.
                    removed_w.append((neighbor_w, candidate_w, "conflicts with", var_w, value_w))  # Explain the exact removal.
            new_domains_w[neighbor_w] = kept_w  # Replace the neighbor domain with the filtered domain.
    return new_domains_w, removed_w  # Return the pruned domains and the explanation list.

fc_assignment_w["A"] = "red"  # Choose A=red, the only value available for A.
fc_domains_after_a_w, removed_after_a_w = forward_check_w(fc_assignment_w, fc_domains_start_w, "A", "red")  # Prune domains after A is assigned.
print("removed after A=red:", removed_after_a_w)  # Show which future values were deleted.
print("domains after A=red:", fc_domains_after_a_w)  # Inspect the remaining domains.
```

```python
fc_assignment_w["B"] = "green"  # Try B=green after forward checking made B a singleton.
fc_domains_after_b_w, removed_after_b_w = forward_check_w(fc_assignment_w, fc_domains_after_a_w, "B", "green")  # Propagate B's choice to neighbors.
print("removed after B=green:", removed_after_b_w)  # Show that C=green is deleted.
print("domains after B=green:", fc_domains_after_b_w)  # Inspect the domain table with the wipeout.
print("wiped-out variables:", [var_w for var_w, values_w in fc_domains_after_b_w.items() if len(values_w) == 0])  # Detect dead ends immediately.
draw_graph_w(assignment_w=fc_assignment_w, domains_to_show_w=fc_domains_after_b_w, title_w="3: forward checking detects a wiped-out domain")  # Visualize the early dead end.
```

▶ What you'll see: assigning A=red removes red from B, then assigning B=green removes green from C. Since C has no values left, the branch is impossible before C is explicitly assigned.

Forward checking is still local: it only looks from the newly assigned variable to its immediate unassigned neighbors. That small propagation is often enough to find dead ends much earlier than plain backtracking.

*Why it's done this way: copying and pruning domains gives each search branch its own future, so one failed choice can be undone cleanly without corrupting other branches.*

#### 4. Arc consistency (AC-3)

**What.** Arc consistency asks a stronger pre-search question: for every directed edge $X \to Y$, does each value of $X$ have at least one compatible value left in $Y$?

**Why.** If a value has no support in a neighbor's domain, that value can never appear in a valid solution. AC-3 repeatedly removes unsupported values and rechecks affected arcs until no more changes occur.

**Why this approach.** We run AC-3 on the same tight domains from forward checking so you can see pruning happen before any search assignment is chosen.

```python
ac_domains_w = {"A": ["red"], "B": ["red", "green"], "C": ["green"], "D": ["red", "blue"]}  # Reuse tight domains for pre-search propagation.
arc_queue_w = [(left_w, right_w) for left_w, right_w in edges_w] + [(right_w, left_w) for left_w, right_w in edges_w]  # Create both directions of every constraint edge.
print("initial AC-3 queue:", arc_queue_w)  # Inspect the directed arcs to be processed.
draw_graph_w(domains_to_show_w=ac_domains_w, title_w="4: AC-3 before propagation")  # Draw domains before arc consistency.
```

▶ What you'll see: the same domain table appears, but no variables have been assigned by search. AC-3 will prune using only domain support.

```python
def revise_w(domains_now_w, xi_w, xj_w):  # Remove values of Xi that have no compatible value in Xj.
    revised_w = False  # Track whether this arc caused any domain shrinkage.
    kept_w = []  # Build Xi's new domain value by value.
    for value_i_w in domains_now_w[xi_w]:  # Check each candidate value in Xi.
        supported_w = any(value_i_w != value_j_w for value_j_w in domains_now_w[xj_w])  # Ask whether Xj has at least one different color.
        if supported_w:  # Keep supported values.
            kept_w.append(value_i_w)  # Preserve this Xi value.
        else:  # Drop unsupported values.
            print("remove", value_i_w, "from", xi_w, "because", xj_w, "has no compatible value")  # Explain the deletion.
            revised_w = True  # Mark that this arc changed a domain.
    domains_now_w[xi_w] = kept_w  # Store the revised Xi domain.
    return revised_w  # Report whether neighbors must be reconsidered.

def neighbors_w(var_w):  # List graph neighbors of one variable.
    return [right_w if left_w == var_w else left_w for left_w, right_w in edges_w if left_w == var_w or right_w == var_w]  # Collect adjacent variables from the edge list.

while arc_queue_w:  # Process arcs until propagation reaches a fixed point or a domain empties.
    xi_w, xj_w = arc_queue_w.pop(0)  # Pop the next directed arc in FIFO order.
    if revise_w(ac_domains_w, xi_w, xj_w):  # Revise Xi against Xj and react only when Xi shrinks.
        print("domains now:", ac_domains_w)  # Print each shrink step so propagation is inspectable.
        if len(ac_domains_w[xi_w]) == 0:  # Stop early if a contradiction is proven.
            print("AC-3 found an empty domain at", xi_w)  # Report the failed variable.
            break  # Leave the loop because no solution exists under these domains.
        for xk_w in neighbors_w(xi_w):  # Recheck arcs from Xi's other neighbors.
            if xk_w != xj_w:  # Avoid immediately adding the arc we just used in reverse.
                arc_queue_w.append((xk_w, xi_w))  # Add the affected arc back to the queue.
print("final AC-3 domains:", ac_domains_w)  # Inspect the final propagated domains.
```

```python
draw_graph_w(domains_to_show_w=ac_domains_w, title_w="4: AC-3 propagated domains")  # Visualize the post-AC-3 domain table.
```

▶ What you'll see: AC-3 removes unsupported values and can prove a contradiction before the recursive search starts.

Arc consistency is stronger than one-step forward checking because every domain deletion can trigger more deletions through neighboring arcs. It is still not a full solver, but it reduces the search space before branching.

*Why it's done this way: AC-3 spends cheap local work up front so expensive search explores fewer values later.*

#### 5. Dynamic variable and value ordering (MCV/LCV)

**What.** Dynamic ordering changes the next branch based on the current state. MCV chooses the variable with the fewest legal remaining values; LCV tries the value that leaves the most options for neighbors.

**Why.** MCV tends to expose failure quickly, while LCV tries to keep future domains large. Together they reduce branching by asking the most urgent question first and using the least damaging answer first.

**Why this approach.** We compute the scores explicitly, then run the same backtracking solver with and without the heuristic choices.

```python
heuristic_domains_w = {"A": ["red"], "B": ["red", "green", "blue"], "C": ["green", "blue"], "D": ["red", "blue"]}  # Define uneven domains for visible MCV scores.
heuristic_assignment_w = {"A": "red"}  # Pretend A has already been assigned by earlier search.
remaining_vars_w = [var_w for var_w in variables_w if var_w not in heuristic_assignment_w]  # List variables still waiting for values.
legal_domains_w = {}  # Store legal values after respecting assigned neighbors.
for var_w in remaining_vars_w:  # Score each unassigned variable.
    legal_values_w = []  # Build the values still compatible with the partial assignment.
    for value_w in heuristic_domains_w[var_w]:  # Test each candidate value.
        trial_w = dict(heuristic_assignment_w)  # Copy the current partial assignment.
        trial_w[var_w] = value_w  # Add the candidate value for this variable.
        if partial_is_consistent_w(trial_w)[0]:  # Keep only values that do not violate assigned edges.
            legal_values_w.append(value_w)  # Add this legal value to the score table.
    legal_domains_w[var_w] = legal_values_w  # Save the legal domain for MCV.
print("legal domains after A=red:", legal_domains_w)  # Inspect the MCV inputs.
print("MCV choice:", min(legal_domains_w, key=lambda var_w: len(legal_domains_w[var_w])))  # Pick the smallest legal domain.
```

```python
mcv_choice_w = min(legal_domains_w, key=lambda var_w: len(legal_domains_w[var_w]))  # Select the most constrained variable.
lcv_scores_w = {}  # Store how many neighbor options each value preserves.
for value_w in legal_domains_w[mcv_choice_w]:  # Score each value for the chosen variable.
    score_w = 0  # Count future values left for unassigned neighbors.
    for neighbor_w in neighbors_w(mcv_choice_w):  # Inspect every graph neighbor.
        if neighbor_w not in heuristic_assignment_w and neighbor_w != mcv_choice_w:  # Consider only future variables.
            score_w += sum(candidate_w != value_w for candidate_w in heuristic_domains_w[neighbor_w])  # Count neighbor values that survive this choice.
    lcv_scores_w[value_w] = score_w  # Store the preservation score.
lcv_order_w = sorted(lcv_scores_w, key=lambda value_w: -lcv_scores_w[value_w])  # Try values with the largest preservation score first.
print("LCV scores for", mcv_choice_w, ":", lcv_scores_w)  # Inspect least-constraining scores.
print("LCV order:", lcv_order_w)  # Show the value order used by heuristic search.
```

```python
def search_with_options_w(use_heuristics_w):  # Count attempts for fixed-order search versus MCV/LCV search.
    search_vars_w = ["D", "C", "B", "A"]  # Use a deliberately poor fixed order so MCV has a visible chance to help.
    search_domains_w = {"A": ["red"], "B": ["red", "green"], "C": ["green", "blue"], "D": ["red", "green", "blue"]}  # Give A the tightest domain for MCV.
    attempts_w = {"count": 0}  # Store attempts in a mutable object visible to the nested function.
    def choose_var_w(assignment_w):  # Choose the next variable for the current partial assignment.
        open_vars_w = [var_w for var_w in search_vars_w if var_w not in assignment_w]  # List unassigned variables in the current search order.
        if not use_heuristics_w:  # Use the original fixed order for the baseline.
            return open_vars_w[0]  # Pick the first unassigned variable.
        scores_w = []  # Build MCV scores for all open variables.
        for var_w in open_vars_w:  # Evaluate each possible next variable.
            legal_count_w = 0  # Count legal values under the current partial assignment.
            for value_w in search_domains_w[var_w]:  # Try each domain value.
                trial_w = dict(assignment_w)  # Copy the partial assignment.
                trial_w[var_w] = value_w  # Add the candidate value.
                legal_count_w += int(partial_is_consistent_w(trial_w)[0])  # Count it if assigned-edge constraints are still legal.
            scores_w.append((legal_count_w, var_w))  # Store smaller counts as more constrained.
        return min(scores_w)[1]  # Choose the variable with the fewest legal values.
    def order_values_w(var_w, assignment_w):  # Choose the value order for one variable.
        values_w = list(search_domains_w[var_w])  # Start from the ordinary domain order.
        if not use_heuristics_w:  # Keep baseline ordering unchanged.
            return values_w  # Return red, green, blue.
        scored_values_w = []  # Build LCV scores.
        for value_w in values_w:  # Score each candidate value.
            score_w = 0  # Count neighbor values preserved.
            for neighbor_w in neighbors_w(var_w):  # Inspect adjacent variables.
                if neighbor_w not in assignment_w:  # Only future variables matter for LCV.
                    score_w += sum(candidate_w != value_w for candidate_w in search_domains_w[neighbor_w])  # Count compatible neighbor values.
            scored_values_w.append((-score_w, value_w))  # Negate so sorting puts larger preservation first.
        return [value_w for _, value_w in sorted(scored_values_w)]  # Return least-constraining values first.
    def recurse_w(assignment_w):  # Run the recursive search.
        if len(assignment_w) == len(search_vars_w):  # Stop at a complete assignment.
            return dict(assignment_w)  # Return a copy of the solution.
        var_w = choose_var_w(assignment_w)  # Select the next variable dynamically or by fixed order.
        for value_w in order_values_w(var_w, assignment_w):  # Try values in baseline or LCV order.
            attempts_w["count"] += 1  # Count this branch attempt.
            assignment_w[var_w] = value_w  # Extend the partial assignment.
            if partial_is_consistent_w(assignment_w)[0]:  # Recurse only when no assigned edge fails.
                result_w = recurse_w(assignment_w)  # Continue the search from this branch.
                if result_w is not None:  # Stop after the first solution.
                    return result_w  # Return the solution upward.
            assignment_w.pop(var_w)  # Undo the attempted value.
        return None  # Report failure for this branch.
    return recurse_w({}), attempts_w["count"]  # Return the first solution and the number of attempts.

baseline_solution_w, baseline_attempts_w = search_with_options_w(False)  # Run fixed-order search.
heuristic_solution_w, heuristic_attempts_w = search_with_options_w(True)  # Run MCV/LCV search.
print("fixed attempts:", baseline_attempts_w, "solution:", baseline_solution_w)  # Inspect baseline effort.
print("MCV/LCV attempts:", heuristic_attempts_w, "solution:", heuristic_solution_w)  # Inspect heuristic effort.
```

```python
plt.figure(figsize=(5, 3.5))  # Create a compact comparison plot.
plt.bar(["fixed", "MCV+LCV"], [baseline_attempts_w, heuristic_attempts_w], color=["gray", "#8e44ad"])  # Plot search attempts for both strategies.
plt.ylabel("value attempts before first solution")  # Label the effort metric.
plt.title("5: ordering heuristics reduce branching")  # Title the plot with the subsection number.
plt.show()  # Render the branching comparison.
```

▶ What you'll see: MCV identifies the most urgent variable from its legal-domain count, LCV ranks its values by neighbor flexibility, and the bar chart compares branch attempts.

These heuristics do not change which assignments are legal; they change the order in which the same search space is explored. The benefit appears when a good order reaches contradictions or solutions with fewer attempted values.

*Why it's done this way: dynamic ordering uses information already created by constraint checks, so it often saves branches at low extra cost.*

#### 6. Local search: ICM, beam search, and Gibbs intuition

**What.** Local search keeps complete assignments and improves or samples them instead of proving consistency by exhaustive branching. ICM greedily changes one variable to reduce local cost; beam search keeps the best $K$ partial assignments; Gibbs samples a value using local weights instead of always taking the best one.

**Why.** These methods are useful when exact backtracking is too expensive or when factors are weighted rather than purely hard. They may be approximate, but they can find good low-cost assignments quickly.

**Why this approach.** We use conflict count as the cost so the local-search objective is visible: fewer equal-color edges means a better coloring.

```python
def conflict_cost_w(assignment_w):  # Count violated not-equal edges in a complete assignment.
    return sum(int(left_w in assignment_w and right_w in assignment_w and assignment_w[left_w] == assignment_w[right_w]) for left_w, right_w in edges_w)  # Add one cost unit for each assigned color clash.

def best_local_value_w(assignment_w, var_w):  # Find the ICM replacement value for one variable.
    scored_w = []  # Store cost for each possible replacement value.
    for value_w in domain_w:  # Try every color for the selected variable.
        trial_w = dict(assignment_w)  # Copy the current complete assignment.
        trial_w[var_w] = value_w  # Replace only the selected variable.
        scored_w.append((conflict_cost_w(trial_w), value_w))  # Score the resulting complete assignment.
    return min(scored_w)  # Return the lowest-cost value and its cost.

local_assignment_w = {var_w: "red" for var_w in variables_w}  # Start from a deliberately bad all-red coloring.
cost_history_w = [conflict_cost_w(local_assignment_w)]  # Record the initial conflict count.
print("start:", local_assignment_w, "cost:", cost_history_w[-1])  # Inspect the starting point.
for sweep_w in range(2):  # Make two small ICM passes over the variables.
    for var_w in variables_w:  # Update one variable at a time.
        best_cost_w, best_value_w = best_local_value_w(local_assignment_w, var_w)  # Find the greedy local replacement.
        local_assignment_w[var_w] = best_value_w  # Apply the best local update.
        cost_history_w.append(best_cost_w)  # Save the new total conflict cost.
        print("update", var_w, "->", best_value_w, "cost", best_cost_w, "assignment", local_assignment_w)  # Trace each greedy step.
```

```python
draw_graph_w(assignment_w=local_assignment_w, title_w="6: ICM local-search coloring")  # Draw the final ICM assignment.
```

▶ What you'll see: ICM starts with several conflicts and greedily changes one region at a time until the map has fewer clashes, often reaching a legal coloring on this tiny graph.

```python
plt.figure(figsize=(5, 3.5))  # Create a small cost-history figure.
plt.plot(np.arange(len(cost_history_w)), cost_history_w, marker="o", color="#d35400")  # Plot conflict cost after each local update.
plt.xlabel("local update step")  # Label the horizontal axis.
plt.ylabel("number of violated edges")  # Label the vertical axis.
plt.title("6: ICM greedily lowers conflict cost")  # Title the plot with the subsection number.
plt.show()  # Render the local-search trajectory.
```

▶ What you'll see: the cost curve drops as local updates remove equal-color neighbor pairs.

```python
beam_width_w = 2  # Keep only the two best partial assignments at each depth.
beam_w = [({}, 0)]  # Start beam search with one empty assignment and zero current conflicts.
for var_w in variables_w:  # Extend the beam one variable at a time.
    candidates_w = []  # Store all one-step extensions of the current beam.
    for partial_w, _ in beam_w:  # Expand every surviving partial assignment.
        for value_w in domain_w:  # Try every value for the next variable.
            extended_w = dict(partial_w)  # Copy the partial assignment.
            extended_w[var_w] = value_w  # Add one new variable value.
            score_w = conflict_cost_w(extended_w)  # Score conflicts among assigned variables.
            candidates_w.append((extended_w, score_w))  # Store this candidate for pruning.
    beam_w = sorted(candidates_w, key=lambda item_w: item_w[1])[:beam_width_w]  # Keep only the lowest-cost K candidates.
    print("beam after", var_w, ":", beam_w)  # Inspect the surviving candidates after this layer.

gibbs_var_w = "C"  # Pick one variable for a Gibbs-style conditional update.
gibbs_base_w = dict(local_assignment_w)  # Start from the final local assignment.
energies_w = []  # Store local costs for each candidate color.
for value_w in domain_w:  # Score each possible value for the sampled variable.
    trial_w = dict(gibbs_base_w)  # Copy the complete assignment.
    trial_w[gibbs_var_w] = value_w  # Replace the selected variable.
    energies_w.append(conflict_cost_w(trial_w))  # Store the resulting conflict cost.
probabilities_w = np.exp(-np.array(energies_w, dtype=float))  # Convert lower costs into larger unnormalized probabilities.
probabilities_w = probabilities_w / probabilities_w.sum()  # Normalize the Gibbs probabilities so they sum to one.
print("Gibbs probabilities for C:", dict(zip(domain_w, np.round(probabilities_w, 3))))  # Show that non-best values can still have nonzero probability.
```

Beam search is a limited-width compromise: $K=1$ is greedy, larger $K$ keeps more alternatives, and unlimited $K$ becomes exhaustive by layers. Gibbs uses

$$
P(X_i=v\mid x_{-i}) \propto \exp(-\text{cost}(v)),
$$

so it may occasionally try non-best values and escape local traps that deterministic ICM would keep.

*Why it's done this way: approximate methods trade completeness guarantees for speed, using local costs or a small beam to guide search when exact CSP solving is too large.*


### 🟢 Basics (warm-up)

#### B1. Check one unary constraint on one assignment

Goal: evaluate a single unary constraint before combining it with any other factor.

Let

$$
X\in\{0,1,2\},
\qquad
f(X)=[X=1].
$$

Check the assignment $X=1$:

$$
f(1)=[1=1]=1.
$$

So the unary constraint is satisfied:

$$
\boxed{X=1\text{ passes the constraint}}.
$$

Check the assignment $X=2$:

$$
f(2)=[2=1]=0.
$$

So the unary constraint is violated:

$$
\boxed{X=2\text{ fails the constraint}}.
$$

Interpretation: a unary factor is a local filter that accepts $X=1$ and rejects every other value.

```python
assignment_b1 = {"X": 1}  # Build the first complete one-variable assignment.
satisfied_b1 = assignment_b1["X"] == 1  # See whether the unary constraint f(X)=[X=1] is satisfied.
print("X=1 passes unary constraint:", satisfied_b1)  # Print the same satisfied conclusion as the hand calculation.
assignment_alt_b1 = {"X": 2}  # Build the second one-variable assignment from the pen-and-paper check.
satisfied_alt_b1 = assignment_alt_b1["X"] == 1  # See whether X=2 satisfies the same unary constraint.
print("X=2 passes unary constraint:", satisfied_alt_b1)  # Print the same failed conclusion as the hand calculation.
```

▶ What you'll see: $X=1$ prints `True`, while $X=2$ prints `False`.

👀 Takeaway: unary constraints can be tested by evaluating one variable value at a time.

#### B2. List the remaining domain after one assignment

Goal: compute the legal values left for one neighbor after a variable is fixed.

Let

$$
X,Y\in\{1,2,3\},
\qquad
c(X,Y)=[X<Y].
$$

Suppose we assign

$$
X=2.
$$

The remaining legal domain for $Y$ is

$$
\operatorname{Domain}'(Y)=\{y\in\{1,2,3\}:2<y\}.
$$

Check every value:

$$
y=1:\ 2<1\text{ is false},
$$

$$
y=2:\ 2<2\text{ is false},
$$

$$
y=3:\ 2<3\text{ is true}.
$$

Therefore

$$
\operatorname{Domain}'(Y)=\{3\}.
$$

The one-step lookahead conclusion is

$$
\boxed{X=2\Longrightarrow Y\text{ must be }3}.
$$

Interpretation: fixing $X=2$ prunes all $Y$ values except the one with support under $X<Y$.

```python
x_value_b2 = 2  # Build the assigned value X=2.
y_domain_b2 = [1, 2, 3]  # Build the original domain for Y.
remaining_y_b2 = [y for y in y_domain_b2 if x_value_b2 < y]  # See which Y values satisfy 2<Y.
print("remaining Y domain after X=2:", remaining_y_b2)  # Print the same remaining domain {3} as the hand calculation.
```

▶ What you'll see: the remaining domain for $Y$ is `[3]`.

👀 Takeaway: one assignment can immediately shrink a neighboring domain.

```python
y_values_b2 = np.array([1, 2, 3])  # Build numeric Y values for a tiny support picture.
support_b2 = y_values_b2 > 2  # See which values are legal after assigning X=2.
plt.figure(figsize=(4, 2.5))  # Build a compact figure for the domain table.
plt.bar([str(y) for y in y_values_b2], support_b2.astype(int), color=["lightgray" if not ok else "tab:green" for ok in support_b2])  # See illegal values as gray bars and the supported value as green.
plt.ylim(0, 1.2)  # Keep the boolean scale readable.
plt.ylabel("legal?")  # Label the vertical axis as a legality indicator.
plt.xlabel("candidate Y")  # Label the horizontal axis with candidate Y values.
plt.title("B2: Remaining Y domain after X=2")  # Title the micro-visualization.
plt.show()  # Display the figure.
```

▶ What you'll see: only the bar for $Y=3$ is marked legal.

#### B3. Count conflicts in one toy coloring

Goal: count how many binary edge constraints are violated by a complete assignment.

Consider a path graph

$$
A-B-C
$$

with the color assignment

$$
A=\text{red},\qquad B=\text{red},\qquad C=\text{blue}.
$$

The CSP constraint on each edge is “neighboring vertices must have different colors.” For edge $(A,B)$,

$$
A\ne B
\quad\Longleftrightarrow\quad
\text{red}\ne\text{red},
$$

which is false, so this edge contributes one conflict. For edge $(B,C)$,

$$
B\ne C
\quad\Longleftrightarrow\quad
\text{red}\ne\text{blue},
$$

which is true, so this edge contributes zero conflicts. Hence

$$
\#\text{conflicts}=1+0=1.
$$

The assignment is not consistent because at least one constraint is violated:

$$
\boxed{\text{one violated edge: }(A,B)}.
$$

Interpretation: a coloring is inconsistent as soon as any edge has equal endpoint colors.

```python
assignment_b3 = {"A": "red", "B": "red", "C": "blue"}  # Build the same complete coloring from the hand example.
edges_b3 = [("A", "B"), ("B", "C")]  # Build the two path constraints A-B-C.
conflicts_b3 = sum(assignment_b3[u] == assignment_b3[v] for u, v in edges_b3)  # See how many edges violate the not-equal constraint.
print("number of violated edges:", conflicts_b3)  # Print the same conflict count 1 as the hand calculation.
```

▶ What you'll see: the conflict count is `1`.

👀 Takeaway: consistency requires every edge constraint to pass, not just most of them.

```python
assignment_viz_b3 = {"A": "red", "B": "red", "C": "blue"}  # Build the same coloring inside this graph cell.
edges_viz_b3 = [("A", "B"), ("B", "C")]  # Build the path constraints inside this graph cell.
positions_b3 = {"A": (0, 0), "B": (1, 0), "C": (2, 0)}  # Build fixed positions for the path graph.
colors_b3 = {"red": "tab:red", "blue": "tab:blue"}  # Build plotting colors for the assigned labels.
plt.figure(figsize=(4, 2))  # Build a compact graph sketch.
for u_b3, v_b3 in edges_viz_b3:  # Iterate over the two constraint edges.
    x1_b3, y1_b3 = positions_b3[u_b3]  # Read the first endpoint position.
    x2_b3, y2_b3 = positions_b3[v_b3]  # Read the second endpoint position.
    edge_color_b3 = "tab:red" if assignment_viz_b3[u_b3] == assignment_viz_b3[v_b3] else "black"  # See violated edges in red.
    plt.plot([x1_b3, x2_b3], [y1_b3, y2_b3], color=edge_color_b3, linewidth=3)  # Draw the constraint edge.
for node_b3, (x_b3, y_b3) in positions_b3.items():  # Iterate over graph variables.
    plt.scatter([x_b3], [y_b3], s=700, color=colors_b3[assignment_viz_b3[node_b3]], edgecolor="black", zorder=2)  # Draw the assigned variable color.
    plt.text(x_b3, y_b3, node_b3, ha="center", va="center", color="white", weight="bold", zorder=3)  # Label each variable.
plt.title("B3: One violated edge on A-B-C")  # Title the graph sketch.
plt.axis("off")  # Hide coordinate axes for a graph view.
plt.show()  # Display the figure.
```

▶ What you'll see: the $A$-$B$ edge is highlighted red because both endpoints are red.

#### B4. Check one binary constraint on two values

Goal: evaluate one edge constraint by itself.

Let

$$
c(A,B)=[A\ne B].
$$

For

$$
A=\text{red},
\qquad
B=\text{blue},
$$

we get

$$
c(A,B)=[\text{red}\ne\text{blue}]=1.
$$

Therefore

$$
\boxed{(A=\text{red},B=\text{blue})\text{ satisfies this edge}}.
$$

Interpretation: this binary factor only inspects the two endpoint values on its own edge.

```python
assignment_b4 = {"A": "red", "B": "blue"}  # Build the two-variable assignment from the hand example.
satisfied_b4 = assignment_b4["A"] != assignment_b4["B"]  # See whether the binary constraint A!=B is satisfied.
print("constraint A!=B satisfied:", satisfied_b4)  # Print the same satisfied conclusion as the hand calculation.
```

▶ What you'll see: the constraint check prints `True`.

👀 Takeaway: a binary constraint can be tested as soon as both of its variables are assigned.

#### B5. Check whether one value is consistent with assigned neighbors

Goal: test one candidate value against current assignments.

Suppose

$$
A=\text{red}
$$

is already assigned and we test

$$
B=\text{red}.
$$

The edge constraint $A\ne B$ gives

$$
\text{red}\ne\text{red},
$$

which is false. Hence

$$
\boxed{B=\text{red}\text{ is rejected}}.
$$

Interpretation: candidate values are discarded immediately when they conflict with an assigned neighbor.

```python
partial_assignment_b5 = {"A": "red"}  # Build the current partial assignment with A fixed.
candidate_b5 = "red"  # Build the candidate value being tested for B.
consistent_b5 = partial_assignment_b5["A"] != candidate_b5  # See whether B=red is compatible with A=red.
print("candidate B=red accepted:", consistent_b5)  # Print False, matching the hand rejection.
```

▶ What you'll see: the candidate acceptance check prints `False`.

👀 Takeaway: backtracking prunes a branch before recursion when a new value violates an assigned edge.

#### B6. Compute the degree of one variable

Goal: count constraints touching a variable.

In the graph

$$
A-B-C,
\qquad
B-D,
$$

variable $B$ has neighbors

$$
\operatorname{Nbr}(B)=\{A,C,D\}.
$$

Therefore

$$
\boxed{\deg(B)=3}.
$$

Interpretation: degree counts how many binary constraints can directly involve a variable during search.

```python
edges_b6 = [("A", "B"), ("B", "C"), ("B", "D")]  # Build the three constraints touching the small graph.
neighbors_b6 = sorted(v if u == "B" else u for u, v in edges_b6 if u == "B" or v == "B")  # See all variables adjacent to B.
degree_b6 = len(neighbors_b6)  # Count B's neighbors to get its degree.
print("neighbors of B:", neighbors_b6)  # Print the same neighbor set {A,C,D} as the hand calculation.
print("degree of B:", degree_b6)  # Print the same degree 3 as the hand calculation.
```

▶ What you'll see: $B$ has neighbors `['A', 'C', 'D']` and degree `3`.

👀 Takeaway: high-degree variables participate in more constraints and can trigger more pruning.

```python
edges_viz_b6 = [("A", "B"), ("B", "C"), ("B", "D")]  # Build the graph edges inside this degree chart cell.
nodes_b6 = ["A", "B", "C", "D"]  # Build the variable list for degree counting.
degrees_b6 = [sum(node_b6 in edge_b6 for edge_b6 in edges_viz_b6) for node_b6 in nodes_b6]  # See each variable's number of incident constraints.
plt.figure(figsize=(4, 2.5))  # Build a compact degree bar chart.
plt.bar(nodes_b6, degrees_b6, color=["tab:orange" if node_b6 == "B" else "lightgray" for node_b6 in nodes_b6])  # Highlight B's degree among all variables.
plt.ylabel("degree")  # Label the vertical axis.
plt.title("B6: Variable degrees")  # Title the bar chart.
plt.show()  # Display the figure.
```

▶ What you'll see: $B$ has the tallest bar at degree $3$.

#### B7. Pick the most-constrained variable

Goal: choose the unassigned variable with the smallest remaining domain.

Suppose

$$
\operatorname{Domain}'(X)=\{1,2,3\},
\quad
\operatorname{Domain}'(Y)=\{2\},
\quad
\operatorname{Domain}'(Z)=\{1,3\}.
$$

The domain sizes are $3,1,2$, so the smallest domain is $Y$:

$$
\boxed{Y}.
$$

Interpretation: the most-constrained-variable heuristic chooses the variable closest to failure.

```python
domains_b7 = {"X": [1, 2, 3], "Y": [2], "Z": [1, 3]}  # Build the remaining domains from the hand example.
sizes_b7 = {var_b7: len(values_b7) for var_b7, values_b7 in domains_b7.items()}  # See each domain size.
choice_b7 = min(sizes_b7, key=sizes_b7.get)  # Pick the variable with the smallest remaining domain.
print("domain sizes:", sizes_b7)  # Print the same sizes 3, 1, and 2 as the hand calculation.
print("most-constrained variable:", choice_b7)  # Print Y, matching the boxed result.
```

▶ What you'll see: the heuristic picks `Y`.

👀 Takeaway: selecting the smallest domain first tends to expose contradictions early.

```python
domains_viz_b7 = {"X": [1, 2, 3], "Y": [2], "Z": [1, 3]}  # Build the remaining domains inside this chart cell.
sizes_viz_b7 = {var_b7: len(values_b7) for var_b7, values_b7 in domains_viz_b7.items()}  # See each domain size for plotting.
choice_viz_b7 = min(sizes_viz_b7, key=sizes_viz_b7.get)  # Pick the minimum-domain variable inside this chart cell.
variables_b7 = list(sizes_viz_b7.keys())  # Build an ordered variable list for plotting.
plt.figure(figsize=(4, 2.5))  # Build a compact domain-size chart.
plt.bar(variables_b7, [sizes_viz_b7[var_b7] for var_b7 in variables_b7], color=["tab:green" if var_b7 == choice_viz_b7 else "lightgray" for var_b7 in variables_b7])  # Highlight the chosen minimum-domain variable.
plt.ylabel("remaining values")  # Label the vertical axis.
plt.title("B7: Most-constrained variable")  # Title the bar chart.
plt.show()  # Display the figure.
```

▶ What you'll see: $Y$ is highlighted because it has only one remaining value.

#### B8. Forward-check one neighbor domain

Goal: prune neighbor values after one assignment.

Let

$$
X,Y\in\{1,2,3\},
\qquad
c(X,Y)=[X<Y].
$$

After assigning $X=1$, the legal $Y$ values are those with $1<Y$:

$$
Y=1\text{ fails},
\qquad
Y=2\text{ passes},
\qquad
Y=3\text{ passes}.
$$

Thus

$$
\boxed{\operatorname{Domain}'(Y)=\{2,3\}}.
$$

Interpretation: forward checking removes only neighbor values that are incompatible with the new assignment.

```python
x_value_b8 = 1  # Build the assigned value X=1.
y_domain_b8 = [1, 2, 3]  # Build Y's original domain.
remaining_y_b8 = [y_b8 for y_b8 in y_domain_b8 if x_value_b8 < y_b8]  # See which Y values survive the constraint X<Y.
print("remaining Y domain after forward checking:", remaining_y_b8)  # Print the same pruned domain {2,3} as the hand calculation.
```

▶ What you'll see: the forward-checked domain is `[2, 3]`.

👀 Takeaway: forward checking is local lookahead from the latest assignment to its unassigned neighbors.

```python
x_value_viz_b8 = 1  # Build the assigned value inside this before-after chart cell.
y_domain_viz_b8 = [1, 2, 3]  # Build Y's original domain inside this chart cell.
remaining_y_viz_b8 = [y_b8 for y_b8 in y_domain_viz_b8 if x_value_viz_b8 < y_b8]  # See which Y values survive X<Y inside this chart cell.
before_b8 = np.ones(len(y_domain_viz_b8), dtype=int)  # Build a before-vector where all Y values are initially legal.
after_b8 = np.array([y_b8 in remaining_y_viz_b8 for y_b8 in y_domain_viz_b8], dtype=int)  # See the after-vector after pruning by X=1.
indices_b8 = np.arange(len(y_domain_viz_b8))  # Build x-positions for grouped bars.
plt.figure(figsize=(4.5, 2.5))  # Build a compact before-after chart.
plt.bar(indices_b8 - 0.18, before_b8, width=0.36, label="before", color="lightgray")  # Show all original values as legal.
plt.bar(indices_b8 + 0.18, after_b8, width=0.36, label="after", color="tab:green")  # Show only surviving values after forward checking.
plt.xticks(indices_b8, [str(y_b8) for y_b8 in y_domain_viz_b8])  # Label bars by candidate Y values.
plt.ylim(0, 1.2)  # Keep the boolean scale readable.
plt.ylabel("in domain?")  # Label the vertical axis.
plt.xlabel("candidate Y")  # Label the horizontal axis.
plt.title("B8: Forward-checking Y after X=1")  # Title the chart.
plt.legend()  # Display the before-after legend.
plt.show()  # Display the figure.
```

▶ What you'll see: $Y=1$ disappears after forward checking, while $Y=2,3$ remain.

#### B9. Test arc consistency for one arc

Goal: remove unsupported values on one side of an arc.

Let

$$
X,Y\in\{1,2\},
\qquad
c(X,Y)=[X<Y].
$$

For $X=1$, value $Y=2$ supports it. For $X=2$, no $Y\in\{1,2\}$ satisfies $2<Y$.

Therefore

$$
\boxed{\operatorname{Domain}'(X)=\{1\}}.
$$

Interpretation: revising the arc $(X,Y)$ deletes each $X$ value with no supporting $Y$ value.

```python
x_domain_b9 = [1, 2]  # Build X's original domain.
y_domain_b9 = [1, 2]  # Build Y's original domain.
supports_b9 = {x_b9: [y_b9 for y_b9 in y_domain_b9 if x_b9 < y_b9] for x_b9 in x_domain_b9}  # See supporting Y values for each X value.
revised_x_b9 = [x_b9 for x_b9, ys_b9 in supports_b9.items() if len(ys_b9) > 0]  # Keep only X values with at least one support.
print("supports by X value:", supports_b9)  # Print that X=1 has support [2] and X=2 has none.
print("revised X domain:", revised_x_b9)  # Print the same revised domain {1} as the hand calculation.
```

▶ What you'll see: $X=1$ has support, $X=2$ has no support, so the revised domain is `[1]`.

👀 Takeaway: arc consistency is stricter than checking one chosen assignment because every remaining value must have support.

```python
x_domain_viz_b9 = [1, 2]  # Build X's original domain inside this support chart cell.
y_domain_viz_b9 = [1, 2]  # Build Y's original domain inside this support chart cell.
supports_viz_b9 = {x_b9: [y_b9 for y_b9 in y_domain_viz_b9 if x_b9 < y_b9] for x_b9 in x_domain_viz_b9}  # See supporting Y values inside this chart cell.
support_counts_b9 = [len(supports_viz_b9[x_b9]) for x_b9 in x_domain_viz_b9]  # Build support counts for each X value.
plt.figure(figsize=(4, 2.5))  # Build a compact support-count chart.
plt.bar([str(x_b9) for x_b9 in x_domain_viz_b9], support_counts_b9, color=["tab:green" if count_b9 > 0 else "tab:red" for count_b9 in support_counts_b9])  # See supported values in green and unsupported values in red.
plt.ylabel("# supporting Y values")  # Label the vertical axis.
plt.xlabel("candidate X")  # Label the horizontal axis.
plt.title("B9: Supports for arc (X,Y)")  # Title the chart.
plt.show()  # Display the figure.
```

▶ What you'll see: $X=2$ has a zero-height red bar because it has no support.

#### B10. Check whether a complete assignment satisfies all constraints

Goal: verify every edge in a finished assignment.

For path $A-B-C$, let

$$
A=\text{red},
\qquad
B=\text{green},
\qquad
C=\text{red}.
$$

Then

$$
A\ne B
\quad\text{and}\quad
B\ne C
$$

are both true. Therefore

$$
\boxed{\text{the complete assignment is a solution}}.
$$

Interpretation: a complete CSP assignment is a solution exactly when every listed constraint is satisfied.

```python
assignment_b10 = {"A": "red", "B": "green", "C": "red"}  # Build the complete path coloring from the hand example.
edges_b10 = [("A", "B"), ("B", "C")]  # Build the two not-equal edge constraints.
edge_results_b10 = {(u_b10, v_b10): assignment_b10[u_b10] != assignment_b10[v_b10] for u_b10, v_b10 in edges_b10}  # See whether each edge constraint is satisfied.
solution_b10 = all(edge_results_b10.values())  # Combine all edge checks into one solution verdict.
print("edge constraint results:", edge_results_b10)  # Print both edge checks as True, matching the hand calculation.
print("complete assignment is a solution:", solution_b10)  # Print True, matching the boxed conclusion.
```

▶ What you'll see: both edge checks are `True`, so the complete assignment is a solution.

👀 Takeaway: CSP satisfaction is an all-constraints conjunction.


### Data — swappable sources

The data block defines several CSPs used by the examples. Change `DATA_SOURCE` to swap among a satisfiable map-coloring instance, an unsatisfiable two-color triangle, and a Sudoku-like $4\times4$ Latin-square puzzle.

```python
DATA_SOURCE = "australia_map"  # Choose "australia_map", "two_color_triangle", or "mini_sudoku" for different examples.
map_nodes = ["WA", "NT", "SA", "Q", "NSW", "V", "T"]  # Name the regions in a classic Australia map-coloring CSP.
map_edges = [("WA", "NT"), ("WA", "SA"), ("NT", "SA"), ("NT", "Q"), ("SA", "Q"), ("SA", "NSW"), ("SA", "V"), ("Q", "NSW"), ("NSW", "V")]  # List neighboring-region constraints.
map_domains = {node: set(COLORS) for node in map_nodes}  # Give every map region the same three-color domain.
map_constraints = {edge: different for edge in map_edges}  # Attach the not-equal constraint to every map edge.
triangle_nodes = ["A", "B", "C"]  # Name three variables in an intentionally impossible triangle CSP.
triangle_edges = [("A", "B"), ("B", "C"), ("A", "C")]  # Connect every pair so the graph is a triangle.
triangle_domains = {node: {"red", "green"} for node in triangle_nodes}  # Restrict the triangle to only two colors.
triangle_constraints = {edge: different for edge in triangle_edges}  # Require adjacent triangle nodes to have different colors.
sudoku_values = {1, 2, 3, 4}  # Use four symbols for a compact Sudoku-like Latin square.
sudoku_cells = [(r, c) for r in range(4) for c in range(4)]  # Create sixteen cell variables for a four-by-four grid.
sudoku_given = {(0, 1): 2, (1, 0): 3, (2, 3): 3, (3, 2): 2}  # Provide a consistent set of fixed clues from a valid four-by-four solution.
sudoku_domains = {cell: ({sudoku_given[cell]} if cell in sudoku_given else set(sudoku_values)) for cell in sudoku_cells}  # Use singleton domains for clues.
sudoku_edges = []  # Start an empty list of all row, column, and box inequality constraints.
for cell_a in sudoku_cells:  # Compare each cell to every later cell.
    for cell_b in sudoku_cells:  # Consider all possible partner cells.
        if cell_a < cell_b:  # Keep only one undirected copy of each pair.
            same_row = cell_a[0] == cell_b[0]  # Detect cells in the same row.
            same_col = cell_a[1] == cell_b[1]  # Detect cells in the same column.
            same_box = (cell_a[0] // 2, cell_a[1] // 2) == (cell_b[0] // 2, cell_b[1] // 2)  # Detect cells in the same two-by-two box.
            if same_row or same_col or same_box:  # Add inequality for row, column, or box peers.
                sudoku_edges.append((cell_a, cell_b))  # Store this Sudoku peer relationship.
sudoku_constraints = {edge: (lambda a, b: a != b) for edge in sudoku_edges}  # Use not-equal factors for all Sudoku peers.
DATASETS = {"australia_map": (map_nodes, map_edges, map_domains, map_constraints), "two_color_triangle": (triangle_nodes, triangle_edges, triangle_domains, triangle_constraints), "mini_sudoku": (sudoku_cells, sudoku_edges, sudoku_domains, sudoku_constraints)}  # Bundle datasets by name.
active_nodes, active_edges, active_domains, active_constraints = DATASETS[DATA_SOURCE]  # Unpack the selected dataset.
print(f"Loaded {DATA_SOURCE} with {len(active_nodes)} variables and {len(active_edges)} binary constraints.")  # Confirm which CSP is active.
draw_graph(active_nodes, active_edges, domains=active_domains, title=f"Initial domains for {DATA_SOURCE}")  # Visualize the selected CSP before solving.
```

▶ What you'll see: a constraint graph whose nodes are variables and whose edges are binary constraints. Domain sets printed inside nodes are the current legal values before search or propagation begins.

### 🟡 Easy

#### E1. Hand evaluate a factor-graph assignment weight

Use three Boolean variables

$$
X_1,X_2,X_3\in\{0,1\}.
$$

Define four factors:

$$
f_1(X_1)=[X_1=1],
$$

$$
f_2(X_1,X_2)=[X_1\lor X_2],
$$

$$
f_3(X_2,X_3)=[X_2\land X_3],
$$

$$
f_4(X_3)=[X_3>0].
$$

Evaluate the assignment

$$
x=(X_1=1,X_2=1,X_3=1).
$$

First factor:

$$
f_1(1)=[1=1]=1.
$$

Second factor:

$$
f_2(1,1)=[1\lor1]=[1]=1.
$$

Third factor:

$$
f_3(1,1)=[1\land1]=[1]=1.
$$

Fourth factor:

$$
f_4(1)=[1>0]=1.
$$

The factor-graph weight is the product:

$$
\operatorname{Weight}(x)=f_1(x)f_2(x)f_3(x)f_4(x).
$$

Substitute the values:

$$
\operatorname{Weight}(x)=1\cdot1\cdot1\cdot1=1.
$$

Therefore

$$
\boxed{x=(1,1,1)\text{ is consistent and has weight }1}.
$$

Now evaluate

$$
y=(X_1=1,X_2=0,X_3=1).
$$

The third factor becomes

$$
f_3(0,1)=[0\land1]=[0]=0.
$$

Therefore

$$
\operatorname{Weight}(y)=1\cdot1\cdot0\cdot1=0.
$$

Thus

$$
\boxed{y=(1,0,1)\text{ violates }f_3\text{ and is inconsistent}}.
$$

#### E2. Hand check CSP consistency from a constraint table

Let

$$
A,B,C\in\{0,1\}
$$

with constraints

$$
c_1(A,B)=[A\ne B],
\qquad
c_2(B,C)=[B\le C],
\qquad
c_3(A,C)=[A\lor C].
$$

Check the assignment

$$
A=0,\qquad B=1,\qquad C=1.
$$

Evaluate each constraint:

$$
c_1(0,1)=[0\ne1]=1,
$$

$$
c_2(1,1)=[1\le1]=1,
$$

$$
c_3(0,1)=[0\lor1]=[1]=1.
$$

The full CSP weight is

$$
\operatorname{Weight}(0,1,1)=c_1(0,1)c_2(1,1)c_3(0,1)=1\cdot1\cdot1=1.
$$

So

$$
\boxed{(A,B,C)=(0,1,1)\text{ is a consistent assignment}}.
$$

Now check

$$
A=1,\qquad B=1,\qquad C=0.
$$

The first constraint is

$$
c_1(1,1)=[1\ne1]=0.
$$

The second constraint is

$$
c_2(1,0)=[1\le0]=0.
$$

The third constraint is

$$
c_3(1,0)=[1\lor0]=[1]=1.
$$

The weight is

$$
\operatorname{Weight}(1,1,0)=0\cdot0\cdot1=0.
$$

Thus

$$
\boxed{(A,B,C)=(1,1,0)\text{ is inconsistent}}.
$$

#### E3. Propagate one arc-consistency constraint by hand

Let

$$
X,Y\in\{1,2,3\},
\qquad
c(X,Y)=[X<Y].
$$

To enforce arc consistency of $X$ with respect to $Y$, keep only values $x$ that have some supporting $y$:

$$
\operatorname{Domain}'(X)
=
\{x\in\{1,2,3\}:\exists y\in\{1,2,3\}, x<y\}.
$$

Check $x=1$:

$$
\exists y\in\{1,2,3\}:1<y.
$$

Choose $y=2$:

$$
1<2\text{ is true},
$$

so $1$ is supported.

Check $x=2$:

$$
\exists y\in\{1,2,3\}:2<y.
$$

Choose $y=3$:

$$
2<3\text{ is true},
$$

so $2$ is supported.

Check $x=3$:

$$
\exists y\in\{1,2,3\}:3<y.
$$

No value in $\{1,2,3\}$ exceeds $3$, so $3$ is unsupported. Therefore

$$
\operatorname{Domain}'(X)=\{1,2\}.
$$

Now enforce arc consistency of $Y$ with respect to $X$:

$$
\operatorname{Domain}'(Y)
=
\{y\in\{1,2,3\}:\exists x\in\{1,2\}, x<y\}.
$$

Check $y=1$:

$$
\exists x\in\{1,2\}:x<1
$$

is false, so $1$ is removed.

Check $y=2$:

$$
x=1\Rightarrow1<2
$$

is true, so $2$ remains.

Check $y=3$:

$$
x=1\Rightarrow1<3
$$

is true, so $3$ remains. Hence

$$
\operatorname{Domain}'(Y)=\{2,3\}.
$$

The hand AC result is

$$
\boxed{\operatorname{Domain}'(X)=\{1,2\},\quad \operatorname{Domain}'(Y)=\{2,3\}}.
$$

#### E4. Backtracking map coloring with forward checking

We now solve a small four-region map by hand-coded backtracking. The example uses forward checking after each tentative color choice so impossible branches stop immediately.

```python
def neighbors_from_edges(nodes, edges):  # Build an adjacency list from undirected binary-constraint edges.
    neighbors = {node: set() for node in nodes}  # Start every variable with no known neighbors.
    for a, b in edges:  # Read each binary constraint edge.
        neighbors[a].add(b)  # Add the second endpoint as a neighbor of the first.
        neighbors[b].add(a)  # Add the first endpoint as a neighbor of the second.
    return neighbors  # Return the completed adjacency dictionary.
def forward_check(var, value, domains, assignment, neighbors, constraints):  # Remove neighbor values made impossible by one assignment.
    new_domains = copy_domains(domains)  # Copy domains so failed trials can be discarded safely.
    new_domains[var] = {value}  # Collapse the assigned variable's domain to the chosen value.
    for nbr in neighbors[var]:  # Inspect every variable constrained with the assigned variable.
        if nbr in assignment:  # Skip already assigned neighbors because consistency was checked separately.
            continue  # Move to the next neighbor.
        allowed = set()  # Collect neighbor values that still have support.
        for nbr_value in new_domains[nbr]:  # Try each candidate value in the neighbor's current domain.
            if constraint_ok(var, value, nbr, nbr_value, constraints):  # Keep the value only if the binary constraint is satisfied.
                allowed.add(nbr_value)  # Record this supported neighbor value.
        new_domains[nbr] = allowed  # Replace the neighbor domain with only supported values.
        if not allowed:  # Detect an empty domain caused by the tentative assignment.
            return None  # Signal that this branch is impossible.
    return new_domains  # Return the reduced domains for the surviving branch.
def consistent_with_assignment(var, value, assignment, constraints):  # Check constraints to already assigned variables.
    for other, other_value in assignment.items():  # Compare the candidate to each assigned variable.
        if not constraint_ok(var, value, other, other_value, constraints):  # Detect a violated binary constraint.
            return False  # Reject this candidate value.
    return True  # Accept the candidate because no assigned-neighbor constraint failed.
```

```python
small_nodes = ["A", "B", "C", "D"]  # Define a four-region toy map.
small_edges = [("A", "B"), ("A", "C"), ("B", "C"), ("C", "D")]  # Define neighboring regions that must differ.
small_domains = {node: set(COLORS) for node in small_nodes}  # Give every region the three available colors.
small_constraints = {edge: different for edge in small_edges}  # Use not-equal constraints on every map edge.
small_neighbors = neighbors_from_edges(small_nodes, small_edges)  # Precompute each region's neighbors.
trace = []  # Store a human-readable trace of the recursive choices.
def solve_forward(nodes, domains, assignment):  # Solve the toy map with recursive forward checking.
    if len(assignment) == len(nodes):  # Stop when every variable has a color.
        return dict(assignment)  # Return a copy of the complete solution.
    var = next(node for node in nodes if node not in assignment)  # Choose the next unassigned variable in fixed order.
    for value in sorted(domains[var]):  # Try values in a deterministic order for reproducibility.
        trace.append((var, value, "try", dict(assignment)))  # Record the attempted assignment.
        if not consistent_with_assignment(var, value, assignment, small_constraints):  # Reject immediate assigned-neighbor conflicts.
            trace.append((var, value, "conflict", dict(assignment)))  # Record the local conflict.
            continue  # Try the next color.
        next_domains = forward_check(var, value, domains, assignment, small_neighbors, small_constraints)  # Propagate the tentative choice.
        if next_domains is None:  # Detect forward-checking failure.
            trace.append((var, value, "empty-domain", dict(assignment)))  # Record the pruning reason.
            continue  # Try the next color.
        assignment[var] = value  # Commit the color for the recursive call.
        result = solve_forward(nodes, next_domains, assignment)  # Recurse on the reduced problem.
        if result is not None:  # Stop as soon as a valid coloring is found.
            return result  # Return the successful solution upward.
        assignment.pop(var)  # Undo the assignment before trying another value.
        trace.append((var, value, "backtrack", dict(assignment)))  # Record that recursion below this value failed.
    return None  # Signal failure when no value works for this variable.
small_solution = solve_forward(small_nodes, small_domains, {})  # Run the forward-checking solver.
print("Solution:", small_solution)  # Print the found coloring.
print("Trace length:", len(trace))  # Print the number of recorded search events.
draw_graph(small_nodes, small_edges, assignment=small_solution, title="E4 valid four-region coloring")  # Visualize the final consistent assignment.
```

▶ What you'll see: the four-region graph is colored so every edge connects two different colors. Forward checking prevents the solver from exploring branches whose neighbor domains have already become empty.

#### E5. Most-constrained variable and least-constrained value

This example computes the two dynamic-ordering scores explicitly on a tiny scheduling CSP. Variables are meetings, values are time slots, and edges mean two meetings share an attendee and cannot occur at the same time.

```python
meetings = ["M1", "M2", "M3", "M4"]  # Define four meetings that need time slots.
slots = {"9AM", "10AM", "11AM"}  # Define three possible meeting times.
schedule_edges = [("M1", "M2"), ("M1", "M3"), ("M2", "M3"), ("M3", "M4")]  # Encode shared-attendee conflicts.
schedule_constraints = {edge: different for edge in schedule_edges}  # Require conflicting meetings to use different slots.
schedule_neighbors = neighbors_from_edges(meetings, schedule_edges)  # Build the meeting-conflict graph.
partial_assignment = {"M1": "9AM"}  # Pretend one meeting has already been scheduled.
remaining_domains = {meeting: set(slots) for meeting in meetings}  # Start with every slot available for every meeting.
remaining_domains["M1"] = {"9AM"}  # Collapse the assigned meeting's domain.
for nbr in schedule_neighbors["M1"]:  # Forward-check the consequences of M1 being at 9AM.
    remaining_domains[nbr] = {slot for slot in remaining_domains[nbr] if slot != "9AM"}  # Remove 9AM from conflicting meetings.
unassigned = [meeting for meeting in meetings if meeting not in partial_assignment]  # List variables still needing assignment.
mcv_scores = {meeting: len(remaining_domains[meeting]) for meeting in unassigned}  # Score variables by remaining-domain size.
chosen_variable = min(unassigned, key=lambda meeting: (mcv_scores[meeting], meeting))  # Select the most constrained variable with deterministic tie-breaking.
lcv_scores = {}  # Store how many neighbor values each candidate value preserves.
for value in sorted(remaining_domains[chosen_variable]):  # Evaluate each candidate value for the chosen variable.
    support_count = 0  # Start with no preserved neighbor options.
    for nbr in schedule_neighbors[chosen_variable]:  # Inspect each neighboring meeting.
        if nbr in partial_assignment:  # Skip already assigned neighbors.
            continue  # Move to the next neighbor.
        support_count += sum(1 for nbr_value in remaining_domains[nbr] if nbr_value != value)  # Count neighbor values compatible with this value.
    lcv_scores[value] = support_count  # Store the least-constraining score.
chosen_value = max(lcv_scores, key=lambda value: (lcv_scores[value], value))  # Choose the value preserving the most neighbor options.
print("Remaining domains:", {k: sorted(v) for k, v in remaining_domains.items()})  # Show domains after the initial assignment.
print("MCV scores:", mcv_scores)  # Show domain-size scores for unassigned variables.
print("Chosen variable:", chosen_variable)  # Show the most constrained variable.
print("LCV scores for", chosen_variable, ":", lcv_scores)  # Show preserved-neighbor-option scores.
print("Chosen value:", chosen_value)  # Show the least constraining value.
draw_graph(meetings, schedule_edges, assignment=partial_assignment, domains=remaining_domains, title="E5 scheduling domains after one assignment")  # Visualize the partial schedule and domains.
```

▶ What you'll see: after assigning `M1 = 9AM`, meetings connected to `M1` lose `9AM`. The selected variable has the smallest remaining domain, and the selected value preserves the largest number of options for its neighbors.

### 🔴 Advanced

#### A1. AC-3 on a Sudoku-like mini puzzle

AC-3 does not guess. It only deletes values that no longer have support. In Sudoku-like puzzles, singleton clue domains can trigger a cascade of removals across rows, columns, and boxes.

```python
def revise(xi, xj, domains, constraints):  # Remove values of xi that have no supporting value in xj.
    removed = set()  # Track values deleted from xi for explanation and plotting.
    for value_i in set(domains[xi]):  # Iterate over a copy because the domain may shrink.
        has_support = any(constraint_ok(xi, value_i, xj, value_j, constraints) for value_j in domains[xj])  # Check whether some xj value satisfies the constraint.
        if not has_support:  # Detect an unsupported xi value.
            domains[xi].remove(value_i)  # Delete the unsupported value from xi's domain.
            removed.add(value_i)  # Record the deletion.
    return removed  # Return exactly which values were removed.
def ac3(nodes, edges, domains, constraints, max_events=200):  # Enforce arc consistency with a queue of directed arcs.
    domains = copy_domains(domains)  # Copy domains so the input puzzle remains unchanged.
    neighbors = neighbors_from_edges(nodes, edges)  # Build adjacency for queue updates.
    queue = deque()  # Create the AC-3 work queue.
    for a, b in edges:  # Add both directed versions of every undirected edge.
        queue.append((a, b))  # Ask whether a is consistent with b.
        queue.append((b, a))  # Ask whether b is consistent with a.
    events = []  # Store domain-shrink events for inspection.
    while queue:  # Continue until no arc can remove more values.
        xi, xj = queue.popleft()  # Pop the next directed arc.
        removed = revise(xi, xj, domains, constraints)  # Enforce support of xi values by xj.
        if removed:  # React only when the domain actually changed.
            events.append((xi, xj, sorted(removed), {k: set(v) for k, v in domains.items()}))  # Snapshot the deletion event.
            if not domains[xi]:  # Detect a contradiction when xi loses every value.
                return domains, events, False  # Return failure with the final empty domain.
            for xh in neighbors[xi] - {xj}:  # Recheck arcs into xi from all other neighbors.
                queue.append((xh, xi))  # Add the affected incoming arc to the queue.
        if len(events) >= max_events:  # Avoid overwhelming displays in very dense examples.
            break  # Stop recording after the requested number of events.
    return domains, events, True  # Return reduced domains and success status.
def print_sudoku_domains(domains):  # Print a compact grid of singleton values or candidate sets.
    for r in range(4):  # Print one row at a time.
        row = []  # Collect display strings for this row.
        for c in range(4):  # Visit each column in the row.
            vals = sorted(domains[(r, c)])  # Sort candidates for deterministic display.
            row.append(str(vals[0]) if len(vals) == 1 else "{" + "".join(map(str, vals)) + "}")  # Show singleton or candidate set.
        print(" | ".join(row))  # Print the formatted row.
reduced_sudoku_domains, sudoku_events, sudoku_ok = ac3(sudoku_cells, sudoku_edges, sudoku_domains, sudoku_constraints)  # Run AC-3 on the mini puzzle.
print("AC-3 success:", sudoku_ok)  # Report whether any domain became empty.
print("Number of shrink events:", len(sudoku_events))  # Report how many domain reductions occurred.
print_sudoku_domains(reduced_sudoku_domains)  # Print the final candidate grid.
first_events = sudoku_events[:8]  # Keep the first few events for a readable plot.
plt.figure(figsize=(8, 3))  # Create a compact event-count plot.
plt.bar(range(len(first_events)), [len(event[2]) for event in first_events], color="#4c78a8")  # Plot how many values each early event removed.
plt.xticks(range(len(first_events)), [f"{event[0]}←{event[1]}" for event in first_events], rotation=45, ha="right")  # Label each revised arc.
plt.ylabel("values removed")  # Label the vertical axis.
plt.title("A1 early AC-3 domain-shrink events")  # Add the plot title.
plt.tight_layout()  # Prevent rotated labels from being clipped.
plt.show()  # Display the AC-3 event plot.
```

▶ What you'll see: clue cells force their row, column, and box peers to drop matching values. The bar chart shows early directed arcs where `Revise` actually removed candidates.

#### A2. Backtracking tree: naive vs. MCV+LCV+forward checking

Now we compare two complete solvers on the same map-coloring benchmark. The first uses fixed variable and value order. The second uses most-constrained variable, least-constrained value, and forward checking.

```python
def order_values_lcv(var, domains, assignment, neighbors, constraints):  # Order values by the least-constraining-value heuristic.
    scores = {}  # Store support-preservation scores.
    for value in sorted(domains[var]):  # Score each candidate value deterministically.
        score = 0  # Initialize this value's preserved-options count.
        for nbr in neighbors[var]:  # Inspect each neighbor of the candidate variable.
            if nbr in assignment:  # Ignore assigned neighbors because their compatibility is checked directly.
                continue  # Move to the next neighbor.
            score += sum(1 for nbr_value in domains[nbr] if constraint_ok(var, value, nbr, nbr_value, constraints))  # Count compatible neighbor values.
        scores[value] = score  # Store the final preservation score.
    return sorted(domains[var], key=lambda value: (-scores[value], value))  # Put values that preserve more options first.
def select_variable_mcv(nodes, domains, assignment):  # Choose the most constrained unassigned variable.
    candidates = [node for node in nodes if node not in assignment]  # List variables that still need values.
    return min(candidates, key=lambda node: (len(domains[node]), node))  # Select the smallest remaining domain with deterministic tie-breaking.
def solve_backtracking(nodes, edges, domains, constraints, use_heuristics=False, use_forward=False):  # Solve a CSP while collecting search statistics.
    neighbors = neighbors_from_edges(nodes, edges)  # Precompute the constraint graph adjacency list.
    stats = {"calls": 0, "backtracks": 0, "prunes": 0}  # Initialize counters for comparing solvers.
    tree_edges = []  # Store parent-child links in the explored search tree.
    tree_labels = {0: "start"}  # Store labels for tree nodes.
    next_id = [1]  # Store the next available tree-node id in a mutable box.
    def recurse(assignment, current_domains, parent_id):  # Define the recursive solver closure.
        stats["calls"] += 1  # Count this recursive call as one expanded search node.
        if len(assignment) == len(nodes):  # Detect a complete assignment.
            return dict(assignment)  # Return a copy of the solution.
        var = select_variable_mcv(nodes, current_domains, assignment) if use_heuristics else next(node for node in nodes if node not in assignment)  # Choose variable dynamically or fixed-order.
        values = order_values_lcv(var, current_domains, assignment, neighbors, constraints) if use_heuristics else sorted(current_domains[var])  # Choose values dynamically or fixed-order.
        for value in values:  # Try each candidate value.
            child_id = next_id[0]  # Allocate a search-tree node id for this trial.
            next_id[0] += 1  # Increment the id counter.
            tree_edges.append((parent_id, child_id))  # Connect this trial to its parent in the search tree.
            tree_labels[child_id] = f"{var}={value}"  # Label the trial node by the chosen assignment.
            if not consistent_with_assignment(var, value, assignment, constraints):  # Reject values conflicting with assigned neighbors.
                stats["prunes"] += 1  # Count immediate consistency pruning.
                continue  # Try the next value.
            next_domains = current_domains  # Default to unchanged domains when forward checking is disabled.
            if use_forward:  # Optionally propagate the candidate assignment.
                next_domains = forward_check(var, value, current_domains, assignment, neighbors, constraints)  # Apply forward checking.
                if next_domains is None:  # Detect an empty domain from propagation.
                    stats["prunes"] += 1  # Count propagation pruning.
                    continue  # Try another value.
            assignment[var] = value  # Commit the candidate value.
            result = recurse(assignment, next_domains, child_id)  # Recurse into the extended assignment.
            if result is not None:  # Stop after finding one solution.
                return result  # Return the solution upward.
            assignment.pop(var)  # Undo the candidate value.
            stats["backtracks"] += 1  # Count a failed branch that required backtracking.
        return None  # Signal failure below this partial assignment.
    solution = recurse({}, copy_domains(domains), 0)  # Start recursion from the empty assignment.
    return solution, stats, tree_edges, tree_labels  # Return solution and recorded search structure.
benchmark_nodes = ["A", "B", "C", "D", "E"]  # Define a constrained coloring benchmark where a bad first choice causes backtracking.
benchmark_edges = [("A", "B"), ("A", "C"), ("B", "C"), ("C", "D"), ("D", "E")]  # Combine a triangle with a short tail.
benchmark_domains = {"A": {"red", "green"}, "B": {"green"}, "C": {"red", "green", "blue"}, "D": {"red", "green"}, "E": {"red", "green", "blue"}}  # Make B singleton so MCV discovers the bottleneck before A tries the conflicting first value.
benchmark_constraints = {edge: different for edge in benchmark_edges}  # Use not-equal constraints throughout the benchmark.
naive_solution, naive_stats, naive_tree_edges, naive_tree_labels = solve_backtracking(benchmark_nodes, benchmark_edges, benchmark_domains, benchmark_constraints, use_heuristics=False, use_forward=False)  # Run fixed-order search.
smart_solution, smart_stats, smart_tree_edges, smart_tree_labels = solve_backtracking(benchmark_nodes, benchmark_edges, benchmark_domains, benchmark_constraints, use_heuristics=True, use_forward=True)  # Run heuristic forward-checking search.
print("Naive solution:", naive_solution)  # Print the fixed-order solution.
print("Naive stats:", naive_stats)  # Print fixed-order search counters.
print("Heuristic solution:", smart_solution)  # Print the heuristic solution.
print("Heuristic stats:", smart_stats)  # Print heuristic search counters.
plt.figure(figsize=(6, 4))  # Create a bar chart comparing solver effort.
labels = ["calls", "backtracks", "prunes"]  # Define compared metrics.
x = np.arange(len(labels))  # Create x locations for grouped bars.
plt.bar(x - 0.18, [naive_stats[label] for label in labels], width=0.36, label="naive", color="#999999")  # Plot naive counts.
plt.bar(x + 0.18, [smart_stats[label] for label in labels], width=0.36, label="MCV+LCV+FC", color="#4c78a8")  # Plot heuristic counts.
plt.xticks(x, labels)  # Label each metric group.
plt.ylabel("count")  # Label the vertical axis.
plt.title("A2 dynamic ordering reduces search effort")  # Add the comparison title.
plt.legend()  # Show which bars correspond to each solver.
plt.tight_layout()  # Fit the chart neatly.
plt.show()  # Display the comparison chart.
draw_graph(benchmark_nodes, benchmark_edges, assignment=smart_solution, title="A2 constrained coloring found by heuristic search")  # Show the final valid coloring.
```

▶ What you'll see: both methods find a valid coloring, but the heuristic solver usually expands fewer nodes and prunes earlier. The colored graph verifies that all neighboring regions have different colors.

#### A3. Failure edge case: unsatisfiable two-color triangle

A triangle graph requires three different colors if every adjacent pair must differ. With only two colors, the CSP is impossible. AC-3 and forward checking expose the contradiction as an empty domain rather than searching forever.

```python
triangle_reduced, triangle_events, triangle_ok = ac3(triangle_nodes, triangle_edges, triangle_domains, triangle_constraints)  # Run AC-3 on the unsatisfiable triangle.
triangle_solution, triangle_stats, triangle_tree_edges, triangle_tree_labels = solve_backtracking(triangle_nodes, triangle_edges, triangle_domains, triangle_constraints, use_heuristics=True, use_forward=True)  # Run backtracking with propagation.
print("AC-3 success:", triangle_ok)  # Report whether AC-3 alone found an empty domain.
print("Reduced triangle domains:", {k: sorted(v) for k, v in triangle_reduced.items()})  # Print the AC-3-reduced domains.
print("Backtracking solution:", triangle_solution)  # Show that no complete coloring exists.
print("Backtracking stats:", triangle_stats)  # Show the amount of search needed to prove failure.
if triangle_events:  # Plot AC-3 removals only if any occurred.
    plt.figure(figsize=(6, 3))  # Create an event plot for domain removals.
    plt.bar(range(len(triangle_events)), [len(event[2]) for event in triangle_events], color="#e74c3c")  # Plot deletion counts in red.
    plt.xticks(range(len(triangle_events)), [f"{event[0]}←{event[1]}" for event in triangle_events], rotation=45, ha="right")  # Label revised arcs.
    plt.ylabel("values removed")  # Label the y axis.
    plt.title("A3 AC-3 removals on two-color triangle")  # Title the contradiction plot.
    plt.tight_layout()  # Fit labels neatly.
    plt.show()  # Display the plot.
else:  # Explain the common case where pure AC-3 cannot prove this global contradiction.
    print("Pure AC-3 makes no deletions here because every single arc has local support; search is still needed.")  # Distinguish local consistency from global satisfiability.
draw_graph(triangle_nodes, triangle_edges, domains=triangle_domains, title="A3 unsatisfiable two-color triangle")  # Draw the impossible constraint graph.
```

▶ What you'll see: this is a useful edge case. Pure AC-3 may not delete anything because every value has local support on every arc, yet the global problem is unsatisfiable. Backtracking with forward checking proves failure by eventually forcing an empty future domain.

#### A4. Beam search approximate assignment on a weighted factor graph

Beam search is not a complete CSP solver unless the beam is wide enough. Here the objective is a weighted factor graph: unary factors prefer some values, binary factors prefer neighboring values to be close. We compare $K=1$, $K=2$, and a very wide beam.

```python
beam_variables = [f"X{i}" for i in range(1, 6)]  # Define five ordered variables.
beam_domain = [0, 1, 2]  # Give every variable three possible values.
unary_scores = {"X1": {0: 5.0, 1: 1.0, 2: 1.2}, "X2": {0: 1.0, 1: 1.0, 2: 5.0}, "X3": {0: 1.0, 1: 1.0, 2: 5.0}, "X4": {0: 1.0, 1: 1.0, 2: 5.0}, "X5": {0: 1.0, 1: 1.0, 2: 5.0}}  # Set local preferences that make greedy search overvalue X1=0.
def pair_score(a, b):  # Score adjacent assignments in the chain.
    return 3.0 if a == b else 0.2  # Strongly reward adjacent variables that choose the same value.
def partial_log_weight(assignment):  # Compute the log weight of a partial chain assignment.
    total = 0.0  # Start with log weight zero.
    for var, value in assignment.items():  # Add unary factor contributions for assigned variables.
        total += math.log(unary_scores[var][value])  # Use logs to avoid underflow and make products additive.
    for left, right in zip(beam_variables[:-1], beam_variables[1:]):  # Add pair factors whose variables are both assigned.
        if left in assignment and right in assignment:  # Check whether the adjacent pair is complete.
            total += math.log(pair_score(assignment[left], assignment[right]))  # Add the log pair factor.
    return total  # Return the partial log weight.
def beam_search(width):  # Run beam search with a specified beam width.
    beam = [({}, 0.0)]  # Start with the empty assignment and log weight zero.
    history = []  # Store every layer's kept assignments.
    for var in beam_variables:  # Extend one variable per layer.
        candidates = []  # Collect all one-step extensions.
        for assignment, _ in beam:  # Expand each currently kept partial assignment.
            for value in beam_domain:  # Try every value for the next variable.
                new_assignment = dict(assignment)  # Copy the partial assignment.
                new_assignment[var] = value  # Add the candidate value.
                candidates.append((new_assignment, partial_log_weight(new_assignment)))  # Score the extended assignment.
        candidates.sort(key=lambda item: item[1], reverse=True)  # Rank candidates by descending log weight.
        beam = candidates[:width]  # Keep only the top K partial assignments.
        history.append([(dict(a), score) for a, score in beam])  # Save a snapshot of this layer.
    return beam[0], history  # Return the best final assignment and all layer snapshots.
beam_results = {}  # Store results for multiple beam widths.
for width in [1, 2, 50]:  # Compare greedy, narrow beam, and effectively exhaustive search.
    best, history = beam_search(width)  # Run beam search at this width.
    beam_results[width] = (best, history)  # Store the best assignment and history.
    print("K=", width, "best=", best[0], "weight=", round(math.exp(best[1]), 3))  # Print the final product weight.
plt.figure(figsize=(6, 4))  # Create a beam-width comparison plot.
plt.bar([str(k) for k in beam_results], [math.exp(beam_results[k][0][1]) for k in beam_results], color=["#999999", "#4c78a8", "#2ecc71"])  # Plot final weights.
plt.xlabel("beam width K")  # Label the horizontal axis.
plt.ylabel("final assignment weight")  # Label the vertical axis.
plt.title("A4 beam size trades speed for solution quality")  # Add the plot title.
plt.tight_layout()  # Fit the chart neatly.
plt.show()  # Display the result.
```

▶ What you'll see: the greedy beam $K=1$ can commit too early. A wider beam keeps alternatives alive, often finding a higher-weight final assignment at the cost of scoring more candidates.

#### A5. ICM vs. Gibbs on a loopy factor graph

The final advanced example uses a small binary image-denoising grid. Each pixel has a noisy observed value. Unary factors prefer matching the observation; pairwise factors prefer neighboring pixels to be smooth. ICM greedily takes the best local value; Gibbs samples from the local distribution.

```python
true_grid = np.array([[0, 0, 0, 1, 1], [0, 0, 1, 1, 1], [0, 0, 1, 1, 1], [0, 0, 0, 1, 1], [0, 0, 0, 1, 1]])  # Define a simple clean binary image.
noise_mask = np.array([[0, 0, 1, 0, 0], [0, 1, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 0], [1, 0, 0, 0, 0]])  # Choose deterministic flipped pixels.
observed_grid = np.abs(true_grid - noise_mask)  # Create the noisy observation by flipping selected bits.
height, width = observed_grid.shape  # Store grid dimensions for loops.
def grid_neighbors(r, c):  # List four-neighborhood coordinates inside the image.
    candidates = [(r - 1, c), (r + 1, c), (r, c - 1), (r, c + 1)]  # Propose up, down, left, and right neighbors.
    return [(rr, cc) for rr, cc in candidates if 0 <= rr < height and 0 <= cc < width]  # Keep only valid grid cells.
def unary_grid_factor(r, c, value):  # Score how well a latent pixel matches the noisy observation.
    return 2.4 if value == observed_grid[r, c] else 0.7  # Prefer the observed bit but allow disagreement.
def local_grid_weight(state, r, c, value):  # Compute local factor product for assigning one pixel.
    weight = unary_grid_factor(r, c, value)  # Start with the unary observation factor.
    for rr, cc in grid_neighbors(r, c):  # Include every neighboring smoothness factor.
        weight *= same_or_smooth(value, state[rr, cc])  # Multiply by pairwise compatibility with the current neighbor value.
    return weight  # Return the local conditional weight.
def total_grid_log_weight(state):  # Compute the full grid log weight for monitoring.
    total = 0.0  # Start with zero log weight.
    for r in range(height):  # Visit every row.
        for c in range(width):  # Visit every column.
            total += math.log(unary_grid_factor(r, c, state[r, c]))  # Add each unary factor once.
            for rr, cc in [(r + 1, c), (r, c + 1)]:  # Add only down and right pair factors to avoid double counting.
                if 0 <= rr < height and 0 <= cc < width:  # Keep valid neighbor coordinates.
                    total += math.log(same_or_smooth(state[r, c], state[rr, cc]))  # Add the pairwise smoothness factor.
    return total  # Return the complete log weight.
def run_icm(initial_state, sweeps=8):  # Run greedy iterated conditional modes.
    state = initial_state.copy()  # Copy the starting image so the caller's array is unchanged.
    weights = []  # Track full log weight after each sweep.
    for sweep in range(sweeps):  # Repeat coordinate-wise greedy updates.
        for r in range(height):  # Visit rows in deterministic raster order.
            for c in range(width):  # Visit columns in deterministic raster order.
                scores = {value: local_grid_weight(state, r, c, value) for value in [0, 1]}  # Score both binary labels locally.
                state[r, c] = max(scores, key=lambda value: (scores[value], -value))  # Choose the locally best label.
        weights.append(total_grid_log_weight(state))  # Record the full objective after the sweep.
    return state, weights  # Return the final greedy state and objective history.
def run_gibbs(initial_state, sweeps=8, temperature=1.0):  # Run stochastic Gibbs sampling updates.
    state = initial_state.copy()  # Copy the starting image so sampling is isolated.
    weights = []  # Track full log weight after each sweep.
    for sweep in range(sweeps):  # Repeat stochastic coordinate sweeps.
        for r in range(height):  # Visit rows in deterministic order for reproducibility.
            for c in range(width):  # Visit columns in deterministic order.
                raw = np.array([local_grid_weight(state, r, c, value) for value in [0, 1]], dtype=float)  # Compute local weights for labels 0 and 1.
                adjusted = raw ** (1.0 / temperature)  # Apply temperature to control randomness.
                probs = adjusted / adjusted.sum()  # Normalize weights into probabilities.
                state[r, c] = np.random.choice([0, 1], p=probs)  # Sample the next label from the Gibbs conditional.
        weights.append(total_grid_log_weight(state))  # Record the full objective after this stochastic sweep.
    return state, weights  # Return the sampled final state and objective history.
icm_state, icm_weights = run_icm(observed_grid, sweeps=8)  # Run greedy denoising from the noisy image.
gibbs_state, gibbs_weights = run_gibbs(observed_grid, sweeps=8, temperature=1.4)  # Run stochastic denoising from the same image.
fig, axes = plt.subplots(1, 4, figsize=(10, 3))  # Create side-by-side image panels.
for ax, grid, title in zip(axes, [true_grid, observed_grid, icm_state, gibbs_state], ["true", "observed", "ICM", "Gibbs"]):  # Pair each panel with its grid and title.
    ax.imshow(grid, cmap="gray_r", vmin=0, vmax=1)  # Show binary labels as black and white cells.
    ax.set_title(title)  # Label the panel.
    ax.set_xticks([])  # Hide x ticks for cleaner image display.
    ax.set_yticks([])  # Hide y ticks for cleaner image display.
plt.tight_layout()  # Fit panels neatly.
plt.show()  # Display the denoising comparison.
plt.figure(figsize=(6, 3))  # Create an objective-history figure.
plt.plot(icm_weights, marker="o", label="ICM")  # Plot greedy objective over sweeps.
plt.plot(gibbs_weights, marker="o", label="Gibbs")  # Plot stochastic objective over sweeps.
plt.xlabel("sweep")  # Label the horizontal axis.
plt.ylabel("log weight")  # Label the vertical axis.
plt.title("A5 local updates on a loopy factor graph")  # Add the plot title.
plt.legend()  # Show method labels.
plt.tight_layout()  # Fit the plot neatly.
plt.show()  # Display the objective curves.
```

▶ What you'll see: ICM typically improves quickly and then stops changing because every single pixel is locally optimal. Gibbs may move down temporarily because it samples, but that randomness can help it explore alternatives in loopy graphs.

### Interactive Experiment

Toggle dynamic ordering and forward checking to see how the number of recursive calls and backtracks changes on the same map-coloring CSP.

```python
try:  # Try to import ipywidgets for a live notebook control.
    from ipywidgets import interact, Checkbox  # Import lightweight widgets for interactive toggles.
    WIDGETS_AVAILABLE = True  # Record that the interactive version can be displayed.
except Exception:  # Fall back gracefully outside notebook environments.
    interact = None  # Store a sentinel for the missing interact function.
    Checkbox = None  # Store a sentinel for the missing Checkbox class.
    WIDGETS_AVAILABLE = False  # Record that static fallback output should be used.
def experiment(use_ordering=True, use_forward_checking=True):  # Define one experiment run controlled by widget booleans.
    solution, stats, _, _ = solve_backtracking(map_nodes, map_edges, map_domains, map_constraints, use_heuristics=use_ordering, use_forward=use_forward_checking)  # Run the solver with selected options.
    print("use_ordering =", use_ordering)  # Print whether MCV and LCV were enabled.
    print("use_forward_checking =", use_forward_checking)  # Print whether forward checking was enabled.
    print("solution =", solution)  # Print the found coloring.
    print("stats =", stats)  # Print recursive calls, backtracks, and prunes.
    plt.figure(figsize=(5, 3))  # Create a compact metrics plot.
    plt.bar(list(stats.keys()), list(stats.values()), color=["#4c78a8", "#f58518", "#54a24b"])  # Plot the three counters.
    plt.ylabel("count")  # Label the vertical axis.
    plt.title("Interactive CSP search effort")  # Add a plot title.
    plt.tight_layout()  # Fit the chart neatly.
    plt.show()  # Display the chart.
if WIDGETS_AVAILABLE:  # Use live controls when the notebook environment supports widgets.
    interact(experiment, use_ordering=Checkbox(value=True, description="MCV+LCV ordering"), use_forward_checking=Checkbox(value=True, description="forward checking"))  # Display two toggles linked to the experiment.
else:  # Use a deterministic fallback when widgets are unavailable.
    experiment(use_ordering=True, use_forward_checking=True)  # Run the default enabled-heuristics experiment once.
```

▶ What you'll see: disabling ordering or forward checking usually increases recursive calls and/or backtracks. The exact counters are less important than the direction: better variable/value choices and early domain pruning shrink the effective search tree.
