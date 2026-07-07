# Search Optimization: Tree, Graph, A*
> **Source:** CS 221 · **Category:** Method/Algorithm · **Type:** 💻 Colab · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 Runnable notebook section; an `.ipynb` will be generated. [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](#)

## 0. Step-by-Step Worked Example — Start Here (Beginner Friendly)

> 🧑‍🎓 **New to this topic? Start here.** This is a gentle, fully runnable walkthrough that
> builds up *every* idea in this lesson one tiny step at a time. Each step **prints** the
> numbers it computes and **draws a picture** so you can *see* what is happening. Run the
> cells in order from top to bottom. Nothing here needs the internet or any downloaded data.

**What we will build, step by step:**
1. **Search problem ingredients** — define states, actions, costs, successors, and the goal test.
2. **Tree search versus graph search** — see why remembering states avoids repeated work.
3. **Breadth-first search (BFS)** — use a FIFO queue to find a shortest path in equal-cost steps.
4. **Depth-first search (DFS)** — use a LIFO stack to dive down one path before trying another.
5. **Dynamic programming on an acyclic graph** — memoize future costs on a DAG.
6. **Uniform cost search (UCS)** — use a priority queue ordered by past path cost.
7. **A* search and heuristics** — add a consistent heuristic to guide the priority queue.
8. **Relaxation-derived heuristics** — remove constraints to get valid lower-bound heuristics.

### Step 0 — Set up our tools

We import small standard-library queues, NumPy, and Matplotlib. We fix a random **seed** so every
run gives the same printed numbers, then define a tiny `log()` helper for clearly labeled output.

```python
from collections import deque             # Deque gives BFS a simple first-in-first-out queue.
import heapq                              # heapq gives UCS and A* a tiny priority queue.
import numpy as np                        # NumPy helps build grids and compact numeric summaries.
import matplotlib.pyplot as plt           # Matplotlib draws graphs, paths, and heuristic pictures.

np.random.seed(0)                          # Fix the seed so every run prints the same numbers.
plt.rcParams["figure.figsize"] = (7, 4)    # Use a comfortable default plot size.


def log(label, value):                     # Define one small logger used in every worked-example cell.
    print(f"[{label}] {value}")            # Print each value with a readable label.

log("setup", "tools ready — queues, NumPy, and Matplotlib imported")  # Confirm setup finished.
```
▶ What you'll see: one line confirming the tools are ready.

### Step 1 — Search problem ingredients: states, actions, costs, successors, goal

A deterministic search problem needs a start state, available actions, action costs, successor states, and a goal test.
We encode all five pieces in a tiny graph and print exactly what an agent can do from each state.

```python
start_demo = "S"                                                                    # Choose the starting state.
goal_demo = "G"                                                                     # Choose the end state.
graph_demo = {}                                                                      # Create a dictionary for Actions, Succ, and Cost.
graph_demo["S"] = [("go to A", "A", 1.0), ("go to B", "B", 4.0)]                  # Store actions from S as (action, successor, cost).
graph_demo["A"] = [("go to C", "C", 2.0), ("go to G", "G", 7.0)]                  # Store actions from A.
graph_demo["B"] = [("go to C", "C", 1.0), ("go to G", "G", 6.0)]                  # Store actions from B.
graph_demo["C"] = [("go to G", "G", 2.0)]                                          # Store actions from C.
graph_demo["G"] = []                                                                # The goal has no outgoing actions.
positions_demo = {"S": (0.0, 0.0), "A": (1.0, 0.8), "B": (1.0, -0.8), "C": (2.2, 0.0), "G": (3.3, 0.0)}  # Fix node positions.

log("start state", start_demo)                                                       # Print the starting state.
log("goal test IsEnd(S)", start_demo == goal_demo)                                   # Show that S is not the goal.
log("goal test IsEnd(G)", goal_demo == goal_demo)                                    # Show that G is the goal.
for state_demo, edges_demo in graph_demo.items():                                    # Loop through every state.
    action_text_demo = [f"{action_demo}->{succ_demo} cost {cost_demo}" for action_demo, succ_demo, cost_demo in edges_demo]  # Summarize actions.
    log(f"Actions({state_demo})", action_text_demo)                                  # Print actions, successors, and costs.

for state_demo, pos_demo in positions_demo.items():                                  # Loop over node positions.
    plt.scatter(pos_demo[0], pos_demo[1], s=700, color="lightsteelblue", edgecolor="black")  # Draw one state node.
    plt.text(pos_demo[0], pos_demo[1], state_demo, ha="center", va="center", fontsize=12)     # Label the node.
for state_demo, edges_demo in graph_demo.items():                                    # Loop over outgoing edges.
    for action_demo, succ_demo, cost_demo in edges_demo:                              # Loop over actions from this state.
        x0_demo, y0_demo = positions_demo[state_demo]                                 # Read the source position.
        x1_demo, y1_demo = positions_demo[succ_demo]                                  # Read the successor position.
        plt.annotate("", xy=(x1_demo, y1_demo), xytext=(x0_demo, y0_demo), arrowprops={"arrowstyle": "->", "color": "gray"})  # Draw the transition.
        plt.text((x0_demo + x1_demo) / 2.0, (y0_demo + y1_demo) / 2.0, str(cost_demo), color="darkred")  # Label the cost.
plt.axis("off")                                                                      # Hide numeric axes for the graph sketch.
plt.title("A deterministic search problem: states, actions, successors, costs")       # Title the graph.
plt.show()                                                                            # Render the search problem.
```
▶ What you'll see: each state lists its available actions, successors, and costs, and the graph shows the same transitions.

### Step 2 — Tree search versus graph search: repeated states waste work

Tree search explores action sequences, so the same state can appear multiple times through different paths. Graph search
remembers states in explored/frontier sets, so it can avoid re-enqueuing a state it has already seen.

```python
repeat_graph_demo = {}                                                                 # Build a graph where C is reachable two ways.
repeat_graph_demo["S"] = ["A", "B"]                                                   # S branches to A and B.
repeat_graph_demo["A"] = ["C"]                                                        # A reaches C.
repeat_graph_demo["B"] = ["C"]                                                        # B also reaches C.
repeat_graph_demo["C"] = ["G"]                                                        # C reaches the goal.
repeat_graph_demo["G"] = []                                                           # G has no children.
tree_frontier_demo = [("S", ["S"])]                                                   # Tree search stores paths, not just states.
tree_generated_demo = []                                                               # Record every generated child in tree search.
for depth_demo in range(3):                                                            # Expand three shallow layers.
    next_frontier_demo = []                                                            # Prepare the next tree layer.
    for state_demo, path_demo in tree_frontier_demo:                                   # Loop over paths at this depth.
        for child_demo in repeat_graph_demo[state_demo]:                               # Generate every child action sequence.
            tree_generated_demo.append(child_demo)                                     # Record generated child, duplicates included.
            next_frontier_demo.append((child_demo, path_demo + [child_demo]))           # Keep the child path for later expansion.
    tree_frontier_demo = next_frontier_demo                                             # Move to the next depth layer.
graph_frontier_demo = deque(["S"])                                                    # Graph search stores states in a queue.
graph_seen_demo = {"S"}                                                               # Track explored/frontier states already seen.
graph_generated_demo = []                                                              # Record each newly discovered state.
while graph_frontier_demo:                                                             # Continue until no seen state needs expansion.
    state_demo = graph_frontier_demo.popleft()                                         # Pop the next frontier state.
    for child_demo in repeat_graph_demo[state_demo]:                                   # Inspect successors.
        if child_demo not in graph_seen_demo:                                          # Skip states already explored or in frontier.
            graph_seen_demo.add(child_demo)                                            # Remember the new state.
            graph_generated_demo.append(child_demo)                                    # Record the unique discovery.
            graph_frontier_demo.append(child_demo)                                     # Add it to the frontier.

states_count_demo = ["A", "B", "C", "G"]                                             # Pick states to count in both strategies.
tree_counts_demo = [tree_generated_demo.count(state_demo) for state_demo in states_count_demo]  # Count tree-generated duplicates.
graph_counts_demo = [graph_generated_demo.count(state_demo) for state_demo in states_count_demo] # Count graph-search discoveries.
log("tree generated states", tree_generated_demo)                                     # Print generated states with repeats.
log("graph generated states", graph_generated_demo)                                   # Print unique graph discoveries.
log("C generated by tree vs graph", (tree_counts_demo[2], graph_counts_demo[2]))       # Highlight the repeated state.

x_demo = np.arange(len(states_count_demo))                                             # Create x positions for bars.
plt.bar(x_demo - 0.18, tree_counts_demo, width=0.36, label="tree search")              # Plot tree-search generation counts.
plt.bar(x_demo + 0.18, graph_counts_demo, width=0.36, label="graph search")            # Plot graph-search discovery counts.
plt.xticks(x_demo, states_count_demo)                                                   # Label each state.
plt.ylabel("times generated")                                                          # Label duplicate counts.
plt.title("Graph search avoids repeated states")                                       # Title the comparison.
plt.legend()                                                                            # Show strategy labels.
plt.show()                                                                              # Render the duplicate-work chart.
```
▶ What you'll see: tree search generates state `C` twice, while graph search discovers it once and avoids repeated work.

### Step 3 — Breadth-first search (BFS): FIFO queue explores by levels

BFS uses a queue, so older frontier states are expanded first. With equal action costs, this level-by-level order returns
a shortest path in number of steps.

```python
bfs_graph_demo = {"S": ["A", "B"], "A": ["C", "D"], "B": ["E"], "C": ["G"], "D": ["G"], "E": ["G"], "G": []}  # Define an unweighted graph.
frontier_demo = deque([("S", ["S"])])                                                 # Store (state, path) pairs in FIFO order.
seen_demo = {"S"}                                                                       # Remember states already in explored/frontier.
pop_order_demo = []                                                                      # Record BFS expansion order.
path_bfs_demo = None                                                                      # Reserve space for the goal path.
while frontier_demo:                                                                      # Keep expanding while the queue is nonempty.
    state_demo, path_demo = frontier_demo.popleft()                                       # Pop the oldest queued state.
    pop_order_demo.append(state_demo)                                                     # Record which state was expanded.
    if state_demo == "G":                                                                # Stop when the goal is reached.
        path_bfs_demo = path_demo                                                         # Store the discovered shortest path.
        break                                                                             # Exit the BFS loop.
    for child_demo in bfs_graph_demo[state_demo]:                                         # Visit successors in listed order.
        if child_demo not in seen_demo:                                                   # Avoid adding duplicates to the queue.
            seen_demo.add(child_demo)                                                     # Mark the child as seen.
            frontier_demo.append((child_demo, path_demo + [child_demo]))                  # Push the child at the back of the queue.

log("BFS pop order", pop_order_demo)                                                     # Print level-by-level expansion order.
log("BFS path", path_bfs_demo)                                                           # Print the shortest equal-cost path.
log("BFS path length", len(path_bfs_demo) - 1)                                           # Print number of edges in the path.
levels_demo = {"S": 0, "A": 1, "B": 1, "C": 2, "D": 2, "E": 2, "G": 3}             # Store each node's BFS level for plotting.
plt.scatter(list(levels_demo.values()), np.zeros(len(levels_demo)), s=650, color="lightgreen", edgecolor="black")  # Draw nodes by level.
for node_demo, level_demo in levels_demo.items():                                        # Loop over nodes to label them.
    plt.text(level_demo, 0.0, node_demo, ha="center", va="center")                     # Place each node label.
for index_demo, node_demo in enumerate(pop_order_demo):                                  # Loop through pop order for annotations.
    plt.text(levels_demo[node_demo], 0.18 + 0.08 * index_demo, str(index_demo + 1), ha="center", color="darkblue")  # Mark expansion rank.
plt.yticks([])                                                                           # Hide the unused y-axis ticks.
plt.xlabel("BFS level from start")                                                       # Label levels.
plt.title("BFS pops all level-1 states before level-2 states")                           # Title the BFS plot.
plt.show()                                                                               # Render the BFS level picture.
```
▶ What you'll see: BFS expands `S`, then its neighbors, then deeper nodes, and returns a shortest three-edge path.

### Step 4 — Depth-first search (DFS): LIFO stack dives deep

DFS uses a stack, so the most recently added frontier state is expanded first. This can find a goal quickly on one branch,
but it does not guarantee the shallowest path in a general graph.

```python
dfs_graph_demo = {"S": ["A", "B"], "A": ["C", "D"], "B": ["E"], "C": ["G"], "D": ["G"], "E": ["G"], "G": []}  # Define the same graph.
stack_demo = [("S", ["S"])]                                                             # Store (state, path) pairs in LIFO order.
seen_demo = {"S"}                                                                        # Remember states already pushed.
pop_order_demo = []                                                                      # Record DFS expansion order.
path_dfs_demo = None                                                                      # Reserve space for the found path.
while stack_demo:                                                                         # Keep expanding while the stack is nonempty.
    state_demo, path_demo = stack_demo.pop()                                              # Pop the newest pushed state.
    pop_order_demo.append(state_demo)                                                     # Record the DFS expansion.
    if state_demo == "G":                                                                # Stop if the goal is reached.
        path_dfs_demo = path_demo                                                         # Store the path DFS found.
        break                                                                             # Exit the DFS loop.
    for child_demo in reversed(dfs_graph_demo[state_demo]):                               # Reverse action order to visit left branch first.
        if child_demo not in seen_demo:                                                   # Avoid pushing repeated states.
            seen_demo.add(child_demo)                                                     # Mark the child as seen.
            stack_demo.append((child_demo, path_demo + [child_demo]))                     # Push the child onto the stack.

log("DFS pop order", pop_order_demo)                                                     # Print deep-first expansion order.
log("DFS path", path_dfs_demo)                                                           # Print the path DFS found.
log("DFS path length", len(path_dfs_demo) - 1)                                           # Print number of edges in that path.
plt.plot(np.arange(len(pop_order_demo)), np.arange(len(pop_order_demo)), alpha=0.0)       # Create axes for ordered labels.
for index_demo, node_demo in enumerate(pop_order_demo):                                  # Loop over expanded nodes.
    plt.scatter(index_demo, 0.0, s=650, color="plum", edgecolor="black")                # Draw one expansion bubble.
    plt.text(index_demo, 0.0, node_demo, ha="center", va="center")                      # Label the expanded node.
plt.yticks([])                                                                           # Hide the unused y-axis ticks.
plt.xlabel("pop number")                                                                 # Label expansion order.
plt.title("DFS follows the newest frontier path first")                                  # Title the DFS expansion plot.
plt.show()                                                                               # Render the DFS order picture.
```
▶ What you'll see: DFS follows one branch down to `G` before exploring every node at the same depth.

### Step 5 — Dynamic programming on an acyclic graph: memoize future cost

On a DAG, the best future cost satisfies a recursion: goal cost is zero, and every other state chooses the cheapest
action cost plus successor future cost. Memoization saves repeated subproblems.

```python
dag_demo = {}                                                                            # Build a small acyclic weighted graph.
dag_demo["S"] = [("A", 2.0), ("B", 1.0)]                                                # Store successors and costs from S.
dag_demo["A"] = [("C", 2.0), ("G", 7.0)]                                                # Store successors and costs from A.
dag_demo["B"] = [("C", 2.0), ("G", 6.0)]                                                # Store successors and costs from B.
dag_demo["C"] = [("G", 1.0)]                                                            # Store successors and costs from C.
dag_demo["G"] = []                                                                       # The end state has future cost zero.
memo_demo = {}                                                                            # Cache FutureCost values.
choice_demo = {}                                                                          # Remember the best next state for path recovery.

def future_cost_demo(state_demo):                                                        # Define the memoized DP recursion.
    if state_demo in memo_demo:                                                          # Reuse a cached value if available.
        return memo_demo[state_demo]                                                     # Return the saved future cost.
    if state_demo == "G":                                                               # Handle the end state base case.
        memo_demo[state_demo] = 0.0                                                       # FutureCost(G)=0.
        return 0.0                                                                        # Return the base-case value.
    options_demo = []                                                                     # Store candidate action costs.
    for succ_demo, cost_demo in dag_demo[state_demo]:                                    # Try each available action.
        options_demo.append(cost_demo + future_cost_demo(succ_demo))                     # Add immediate cost plus future cost.
    best_index_demo = int(np.argmin(options_demo))                                       # Find the cheapest action index.
    choice_demo[state_demo] = dag_demo[state_demo][best_index_demo][0]                   # Remember the best successor.
    memo_demo[state_demo] = float(options_demo[best_index_demo])                         # Cache the best future cost.
    return memo_demo[state_demo]                                                         # Return the computed value.

start_cost_demo = future_cost_demo("S")                                                  # Compute FutureCost from the start.
path_dp_demo = ["S"]                                                                     # Begin reconstructing the optimal path.
while path_dp_demo[-1] != "G":                                                          # Follow remembered choices until the goal.
    path_dp_demo.append(choice_demo[path_dp_demo[-1]])                                   # Append the best successor.
for state_demo in ["G", "C", "A", "B", "S"]:                                         # Print values in a bottom-up-friendly order.
    log(f"FutureCost({state_demo})", memo_demo[state_demo])                              # Show each memoized future cost.
log("DP optimal path", path_dp_demo)                                                     # Print the minimum-cost path.
log("DP start cost", start_cost_demo)                                                     # Print the optimal total cost.
plt.bar(list(memo_demo.keys()), list(memo_demo.values()), color="lightseagreen", edgecolor="black")  # Plot future costs by state.
plt.ylabel("minimum future cost")                                                        # Label the DP value axis.
plt.title("DAG dynamic programming stores FutureCost(s)")                                # Title the DP plot.
plt.show()                                                                                # Render the memoized values.
```
▶ What you'll see: each state's future cost is computed once, cached, and used to recover the cheapest path.

### Step 6 — Uniform cost search (UCS): pop the cheapest past cost

UCS handles non-negative, unequal action costs by prioritizing the frontier state with smallest past cost so far. When a
state is popped and explored, that popped cost is the optimal cost from the start to that state.

```python
ucs_graph_demo = {}                                                                       # Build a non-negative weighted graph.
ucs_graph_demo["S"] = [("A", 1.0), ("B", 4.0)]                                          # Store weighted edges from S.
ucs_graph_demo["A"] = [("C", 2.0), ("G", 7.0)]                                          # Store weighted edges from A.
ucs_graph_demo["B"] = [("C", 1.0), ("G", 6.0)]                                          # Store weighted edges from B.
ucs_graph_demo["C"] = [("G", 2.0)]                                                       # Store weighted edges from C.
ucs_graph_demo["G"] = []                                                                  # The goal has no outgoing edges.
frontier_demo = [(0.0, "S", ["S"])]                                                      # Push (past cost, state, path) for the start.
best_cost_demo = {"S": 0.0}                                                             # Store the best known path cost to each state.
explored_demo = set()                                                                     # Store states whose optimal cost is finalized.
pop_order_demo = []                                                                       # Record popped states and costs.
path_ucs_demo = None                                                                      # Reserve space for the optimal path.
while frontier_demo:                                                                      # Continue while the priority queue has candidates.
    past_cost_demo, state_demo, path_demo = heapq.heappop(frontier_demo)                  # Pop the lowest-past-cost state.
    if state_demo in explored_demo:                                                       # Skip stale queue entries.
        continue                                                                          # Move to the next heap item.
    explored_demo.add(state_demo)                                                         # Finalize this state's optimal past cost.
    pop_order_demo.append((state_demo, past_cost_demo))                                   # Record the correctness-theorem moment.
    if state_demo == "G":                                                                # Stop when the goal is finalized.
        path_ucs_demo = path_demo                                                         # Store the optimal path.
        break                                                                             # Exit the UCS loop.
    for succ_demo, cost_demo in ucs_graph_demo[state_demo]:                               # Relax every outgoing edge.
        new_cost_demo = past_cost_demo + cost_demo                                        # Compute candidate path cost to successor.
        if new_cost_demo < best_cost_demo.get(succ_demo, float("inf")):                  # Keep only cost improvements.
            best_cost_demo[succ_demo] = new_cost_demo                                     # Save the improved best known cost.
            heapq.heappush(frontier_demo, (new_cost_demo, succ_demo, path_demo + [succ_demo]))  # Push the successor with priority past cost.

log("UCS pop order", pop_order_demo)                                                     # Print states in increasing finalized cost.
log("UCS optimal path", path_ucs_demo)                                                   # Print the minimum-cost path.
log("UCS optimal cost", best_cost_demo["G"])                                             # Print the path cost to the goal.
plt.step(np.arange(len(pop_order_demo)), [cost_demo for state_demo, cost_demo in pop_order_demo], where="post", marker="o")  # Plot finalized costs.
plt.xticks(np.arange(len(pop_order_demo)), [state_demo for state_demo, cost_demo in pop_order_demo])  # Label popped states.
plt.ylabel("finalized PastCost")                                                         # Label the priority value.
plt.title("UCS pops states in nondecreasing optimal past cost")                          # Title the UCS plot.
plt.show()                                                                                # Render the pop-cost trace.
```
▶ What you'll see: the popped costs never decrease, and the goal path has the minimum total cost.

### Step 7 — A* search and heuristics: prioritize past cost plus future estimate

A* changes the priority from $g(s)$ to $g(s)+h(s)$. With a consistent heuristic, the first time the goal is popped,
the path is optimal, but the search usually explores fewer irrelevant states.

```python
start_astar_demo = (0, 0)                                                                 # Choose a grid start state.
goal_astar_demo = (3, 2)                                                                  # Choose a grid goal state.
blocked_demo = {(1, 1)}                                                                    # Add one blocked cell as an obstacle.
width_demo = 4                                                                             # Set grid width.
height_demo = 3                                                                            # Set grid height.

def h_demo(state_demo):                                                                    # Define a Manhattan-distance heuristic.
    return abs(goal_astar_demo[0] - state_demo[0]) + abs(goal_astar_demo[1] - state_demo[1])  # Count remaining horizontal+vertical steps.

def neighbors_demo(state_demo):                                                            # Define legal grid successors.
    moves_demo = [(1, 0), (-1, 0), (0, 1), (0, -1)]                                         # Allow four-neighbor moves.
    result_demo = []                                                                        # Store legal successors.
    for dx_demo, dy_demo in moves_demo:                                                     # Try each move direction.
        nxt_demo = (state_demo[0] + dx_demo, state_demo[1] + dy_demo)                       # Compute the candidate successor.
        inside_demo = 0 <= nxt_demo[0] < width_demo and 0 <= nxt_demo[1] < height_demo       # Check grid boundaries.
        if inside_demo and nxt_demo not in blocked_demo:                                    # Keep only unblocked in-bounds states.
            result_demo.append(nxt_demo)                                                    # Add the legal successor.
    return result_demo                                                                      # Return the successor list.

consistent_demo = True                                                                      # Start assuming the heuristic is consistent.
for x_demo in range(width_demo):                                                            # Loop over grid x-coordinates.
    for y_demo in range(height_demo):                                                        # Loop over grid y-coordinates.
        state_demo = (x_demo, y_demo)                                                       # Create one state.
        if state_demo in blocked_demo:                                                      # Skip blocked states.
            continue                                                                        # Move to the next grid cell.
        for succ_demo in neighbors_demo(state_demo):                                        # Check each action.
            consistent_demo = consistent_demo and h_demo(state_demo) <= 1.0 + h_demo(succ_demo)  # Verify h(s)<=cost+h(t).
frontier_demo = [(h_demo(start_astar_demo), 0.0, start_astar_demo, [start_astar_demo])]      # Push (f, g, state, path).
best_g_demo = {start_astar_demo: 0.0}                                                       # Store best known past costs.
explored_demo = set()                                                                       # Store popped states.
pop_order_demo = []                                                                         # Record A* pop order.
path_astar_demo = None                                                                       # Reserve space for the found path.
while frontier_demo:                                                                        # Continue while candidates remain.
    f_demo, g_demo, state_demo, path_demo = heapq.heappop(frontier_demo)                     # Pop the smallest g+h priority.
    if state_demo in explored_demo:                                                         # Skip stale entries.
        continue                                                                            # Move to the next heap item.
    explored_demo.add(state_demo)                                                           # Mark the state explored.
    pop_order_demo.append((state_demo, g_demo, h_demo(state_demo), f_demo))                  # Record g, h, and f.
    if state_demo == goal_astar_demo:                                                       # Stop when the goal is popped.
        path_astar_demo = path_demo                                                         # Store the optimal path.
        break                                                                               # Exit the A* loop.
    for succ_demo in neighbors_demo(state_demo):                                            # Relax each grid successor.
        new_g_demo = g_demo + 1.0                                                           # Every grid move costs one.
        if new_g_demo < best_g_demo.get(succ_demo, float("inf")):                          # Keep improved paths only.
            best_g_demo[succ_demo] = new_g_demo                                             # Save the best g-cost.
            heapq.heappush(frontier_demo, (new_g_demo + h_demo(succ_demo), new_g_demo, succ_demo, path_demo + [succ_demo]))  # Push priority g+h.

log("heuristic consistent?", consistent_demo)                                              # Print the consistency check.
log("A* pop order (state,g,h,f)", pop_order_demo)                                          # Print priority details.
log("A* path", path_astar_demo)                                                            # Print the path returned by A*.
log("A* path cost", best_g_demo[goal_astar_demo])                                          # Print the optimal path cost.
for x_demo in range(width_demo):                                                            # Loop over grid columns for drawing.
    for y_demo in range(height_demo):                                                        # Loop over grid rows for drawing.
        cell_demo = (x_demo, y_demo)                                                        # Create the cell state.
        color_demo = "black" if cell_demo in blocked_demo else "white"                     # Color obstacles black.
        plt.scatter(x_demo, y_demo, s=600, color=color_demo, edgecolor="black")             # Draw the grid cell.
        if cell_demo not in blocked_demo:                                                   # Label only open cells.
            plt.text(x_demo, y_demo, str(h_demo(cell_demo)), ha="center", va="center", color="purple")  # Show h(s).
path_x_demo = [state_demo[0] for state_demo in path_astar_demo]                             # Extract path x-coordinates.
path_y_demo = [state_demo[1] for state_demo in path_astar_demo]                             # Extract path y-coordinates.
plt.plot(path_x_demo, path_y_demo, color="seagreen", linewidth=3, marker="o", label="A* path")  # Draw the found path.
plt.gca().set_aspect("equal")                                                              # Keep grid cells square.
plt.xticks(range(width_demo))                                                               # Show integer x ticks.
plt.yticks(range(height_demo))                                                              # Show integer y ticks.
plt.title("A*: cell labels are heuristic h(s), priority is g+h")                            # Title the A* grid.
plt.legend()                                                                                # Show the path label.
plt.show()                                                                                  # Render the A* search picture.
```
▶ What you'll see: the heuristic passes the consistency check, and A* follows a shortest grid path while printing `g`, `h`, and `f`.

### Step 8 — Relaxation-derived heuristics: lower bounds from easier problems

A relaxation removes constraints, so its optimal future cost cannot exceed the original future cost. On a grid,
ignoring vertical distance gives $h_1$, ignoring horizontal distance gives $h_2$, and `max(h1,h2)` is still consistent.

```python
goal_relax_demo = (4, 3)                                                                   # Choose a goal for the heuristic table.
states_relax_demo = [(x_demo, y_demo) for x_demo in range(5) for y_demo in range(4)]        # Enumerate a small grid of states.
true_cost_demo = {}                                                                         # Store original Manhattan future costs.
h1_demo = {}                                                                                # Store relaxation that ignores vertical distance.
h2_demo = {}                                                                                # Store relaxation that ignores horizontal distance.
hmax_demo = {}                                                                              # Store the max of two relaxed heuristics.
for state_demo in states_relax_demo:                                                        # Compute all heuristic values.
    true_cost_demo[state_demo] = abs(goal_relax_demo[0] - state_demo[0]) + abs(goal_relax_demo[1] - state_demo[1])  # Original grid distance.
    h1_demo[state_demo] = abs(goal_relax_demo[0] - state_demo[0])                           # Relaxed problem: only horizontal progress matters.
    h2_demo[state_demo] = abs(goal_relax_demo[1] - state_demo[1])                           # Relaxed problem: only vertical progress matters.
    hmax_demo[state_demo] = max(h1_demo[state_demo], h2_demo[state_demo])                    # Combine consistent heuristics by max.
consistent_max_demo = True                                                                  # Start assuming max heuristic is consistent.
for state_demo in states_relax_demo:                                                        # Check every grid state.
    x_demo, y_demo = state_demo                                                             # Unpack the state.
    neighbors_relax_demo = [(x_demo + 1, y_demo), (x_demo - 1, y_demo), (x_demo, y_demo + 1), (x_demo, y_demo - 1)]  # List possible moves.
    for succ_demo in neighbors_relax_demo:                                                  # Check each neighbor.
        if succ_demo in hmax_demo:                                                          # Keep in-grid neighbors only.
            consistent_max_demo = consistent_max_demo and hmax_demo[state_demo] <= 1.0 + hmax_demo[succ_demo]  # Verify consistency inequality.

sample_states_demo = [(0, 0), (2, 1), (4, 0), goal_relax_demo]                              # Pick states for a small printed table.
for state_demo in sample_states_demo:                                                       # Print heuristic comparisons.
    values_demo = (true_cost_demo[state_demo], h1_demo[state_demo], h2_demo[state_demo], hmax_demo[state_demo])  # Bundle true and relaxed costs.
    log(f"state {state_demo}: true,h1,h2,max", values_demo)                                 # Show lower-bound relationships.
log("max heuristic consistent?", consistent_max_demo)                                       # Print the consistency result.
heat_demo = np.zeros((4, 5))                                                                # Allocate a heatmap array for hmax values.
for state_demo, value_demo in hmax_demo.items():                                            # Fill the heatmap by state.
    heat_demo[state_demo[1], state_demo[0]] = value_demo                                    # Store hmax at row y and column x.
plt.imshow(heat_demo[::-1], cmap="YlGnBu", extent=(-0.5, 4.5, -0.5, 3.5))                  # Draw hmax values with y increasing upward.
plt.colorbar(label="h(s)=max(h1,h2)")                                                       # Add a color scale for heuristic values.
plt.scatter(goal_relax_demo[0], goal_relax_demo[1], marker="*", s=220, color="gold", edgecolor="black", label="goal")  # Mark the goal.
plt.xticks(range(5))                                                                        # Show grid x-coordinates.
plt.yticks(range(4))                                                                        # Show grid y-coordinates.
plt.title("Relaxed future costs are valid heuristic lower bounds")                         # Title the relaxation picture.
plt.legend()                                                                                # Show the goal label.
plt.show()                                                                                  # Render the heuristic heatmap.
```
▶ What you'll see: every relaxed heuristic value is at most the true future cost, and the max heuristic remains consistent.

### Recap — what you just ran

- **Search problem ingredients** defined start, actions, costs, successors, and the goal test.
- **Tree search versus graph search** showed repeated states and how explored/frontier memory avoids them.
- **BFS and DFS** used queue versus stack frontier discipline for level-order versus deep-first search.
- **Dynamic programming on a DAG** memoized `FutureCost(s)` and recovered a cheapest path.
- **UCS** popped states by minimum past cost and returned the non-negative-cost shortest path.
- **A*** used a consistent heuristic in the priority `g+h` and still returned an optimal path.
- **Relaxation-derived heuristics** produced admissible, consistent lower bounds and combined them with `max`.

Everything below (starting at **§1 Overview**) develops these same ideas with full derivations,
more examples, and an interactive experiment.

---

## 1. Overview

Search optimization turns planning into a precise question: from a starting state, which sequence of actions reaches an end state with minimum total cost? The same maze, road map, or planning problem can look easy or impossible depending on what the algorithm stores in its frontier and how that frontier is prioritized.

**One-line intuition:** BFS prioritizes fewest steps, DFS prioritizes depth, UCS prioritizes cheapest known past cost, and A* prioritizes cheapest known past cost plus an estimated future cost.

## 2. Key Idea

A deterministic search problem is defined by five ingredients:

- a starting state $s_{\text{start}}$;
- possible actions $\operatorname{Actions}(s)$ from state $s$;
- action cost $\operatorname{Cost}(s,a)$ from state $s$ with action $a$;
- successor $\operatorname{Succ}(s,a)$ of state $s$ after action $a$;
- whether an end state was reached $\operatorname{IsEnd}(s)$.

The objective is to find a path that minimizes the cost.

### Tree search versus graph search

**Tree search** explores possible action sequences. It can be memory efficient, but if the same state can be reached by many different action sequences, it may repeat work exponentially many times.

**Graph search** treats a state as a summary of all past actions sufficient to choose future actions optimally. It uses three sets:

| State type | Meaning |
|---|---|
| Explored $\mathcal{E}$ | States for which the optimal path has already been found |
| Frontier $\mathcal{F}$ | States seen for which we are still figuring out how to get there with the cheapest cost |
| Unexplored $\mathcal{U}$ | States not seen yet |

### Breadth-first search (BFS)

Breadth-first search is a graph search algorithm that does a level-by-level traversal. We can implement it iteratively with the help of a queue that stores at each step future nodes to be visited. For this algorithm, we can assume action costs to be equal to a constant $c\geq0$.

```text
BFS(start, goal):
    frontier = FIFO queue containing start
    explored = empty set
    while frontier is not empty:
        s = frontier.pop_left()
        if s is goal: return path to s
        add s to explored
        for each successor t of s:
            if t is not explored and not already in frontier:
                remember parent[t] = s
                frontier.push_right(t)
```

### Depth-first search (DFS)

Depth-first search is a search algorithm that traverses a graph by following each path as deep as it can. We can implement it recursively, or iteratively with the help of a stack that stores at each step future nodes to be visited. For this algorithm, action costs are assumed to be equal to 0.

```text
DFS(start, goal):
    frontier = LIFO stack containing start
    explored = empty set
    while frontier is not empty:
        s = frontier.pop()
        if s is goal: return path to s
        add s to explored
        for each successor t of s in reverse action order:
            if t is not explored and not already in frontier:
                remember parent[t] = s
                frontier.push(t)
```

### Dynamic programming on an acyclic graph

Dynamic programming is a backtracking search algorithm with memoization whose goal is to find a minimum cost path from $s_{\text{start}}$ to an end state $s_{\text{end}}$. It can have exponential savings, and it only works for acyclic graphs. For any state $s$,

$$
\operatorname{FutureCost}(s)=
\begin{cases}
0 & \text{if }\operatorname{IsEnd}(s)\\
\displaystyle\min_{a\in\operatorname{Actions}(s)}\left[\operatorname{Cost}(s,a)+\operatorname{FutureCost}(\operatorname{Succ}(s,a))\right] & \text{otherwise.}
\end{cases}
$$

### Uniform cost search (UCS)

Uniform cost search is a search algorithm that aims at finding the shortest path from $s_{\text{start}}$ to $s_{\text{end}}$. It explores states $s$ in increasing order of $\operatorname{PastCost}(s)$ and relies on the fact that all action costs are non-negative. It is logically equivalent to Dijkstra's algorithm.

```text
UCS(start, goal):
    frontier = priority queue containing (0, start)
    best_cost[start] = 0
    while frontier is not empty:
        past_cost, s = frontier.pop_min()
        if s was already explored: continue
        if s is goal: return optimal path to s
        add s to explored
        for each action a from s:
            t = Succ(s, a)
            new_cost = past_cost + Cost(s, a)
            if new_cost improves best_cost[t]:
                remember parent[t] = s
                frontier.push((new_cost, t))
```

**Correctness theorem:** when a state $s$ is popped from the frontier $\mathcal{F}$ and moved to explored set $\mathcal{E}$, its priority equals $\operatorname{PastCost}(s)$, the minimum cost from $s_{\text{start}}$ to $s$.

UCS does not work with negative action costs. Adding a positive constant to all edges to make them non-negative does not solve the original problem, because it changes which paths are cheapest when paths have different numbers of edges.

### A* search and heuristics

A heuristic is a function $h$ over states $s$, where each $h(s)$ estimates $\operatorname{FutureCost}(s)$, the cost of the path from $s$ to $s_{\text{end}}$.

A* is a search algorithm that aims at finding the shortest path from a state $s$ to an end state $s_{\text{end}}$. It explores states $s$ in increasing order of

$$
\operatorname{PastCost}(s)+h(s).
$$

It is equivalent to UCS with edge costs

$$
\operatorname{Cost}'(s,a)=\operatorname{Cost}(s,a)+h(\operatorname{Succ}(s,a))-h(s).
$$

```text
A*(start, goal, h):
    frontier = priority queue containing (h(start), 0, start)
    best_g[start] = 0
    while frontier is not empty:
        f, g, s = frontier.pop_min()
        if s was already explored: continue
        if s is goal: return optimal path to s when h is consistent
        add s to explored
        for each action a from s:
            t = Succ(s, a)
            new_g = g + Cost(s, a)
            new_f = new_g + h(t)
            if new_g improves best_g[t]:
                remember parent[t] = s
                frontier.push((new_f, new_g, t))
```

A heuristic $h$ is **consistent** if, for all states $s$ and actions $a$,

$$
h(s)\leq \operatorname{Cost}(s,a)+h(\operatorname{Succ}(s,a)),
$$

and the end state satisfies

$$
h(s_{\text{end}})=0.
$$

If $h$ is consistent, then A* returns the minimum cost path.

A heuristic $h$ is **admissible** if

$$
h(s)\leq \operatorname{FutureCost}(s).
$$

Consistency implies admissibility:

$$
h(s)\text{ consistent}\Longrightarrow h(s)\text{ admissible.}
$$

A* explores all states $s$ satisfying

$$
\operatorname{PastCost}(s)\leq \operatorname{PastCost}(s_{\text{end}})-h(s),
$$

so larger valid heuristic values often reduce search.

### Relaxation-derived heuristics

A relaxation removes constraints. The relaxed search problem $P_{\text{rel}}$ has costs satisfying

$$
\operatorname{Cost}_{\text{rel}}(s,a)\leq \operatorname{Cost}(s,a).
$$

Given a relaxed problem, the relaxed heuristic is

$$
h(s)=\operatorname{FutureCost}_{\text{rel}}(s).
$$

By theorem,

$$
h(s)=\operatorname{FutureCost}_{\text{rel}}(s)\Longrightarrow h(s)\text{ consistent.}
$$

Also, if $h_1$ and $h_2$ are consistent, then

$$
h(s)=\max\{h_1(s),h_2(s)\}
$$

is consistent.

## 3. Hands-on Notebook

### Setup

Run this first. It imports the only libraries used below, fixes the random seed, defines shared grid/graph helpers, and gives every example the same visual language.

```python
import numpy as np  # Use NumPy arrays because grids and cost tables are naturally rectangular data.
import matplotlib.pyplot as plt  # Use Matplotlib because Colab can render static search snapshots reliably.
import heapq  # Use heapq because UCS and A* need an efficient minimum-priority frontier.
from collections import deque  # Use deque because BFS needs a fast first-in-first-out queue.
from collections import defaultdict  # Use defaultdict because graph adjacency lists are easier to build incrementally.
from itertools import count  # Use count because priority queues need deterministic tie-breaking.
import math  # Use math because Euclidean and diagonal relaxed heuristics need square roots.
import random  # Use random because the interactive experiment samples obstacle grids.
try:  # Try importing widgets so the live experiment works in Colab when ipywidgets is available.
    import ipywidgets as widgets  # Use widgets because sliders make the algorithm tradeoffs visible.
    from IPython.display import display  # Use display because widget layouts need explicit rendering in notebooks.
except Exception:  # Fall back gracefully because plain Markdown renderers may not provide the notebook widget stack.
    widgets = None  # Store None so the experiment can print a clear message instead of crashing.
    display = None  # Store None so later code can test whether widget display is available.
np.random.seed(7)  # Seed NumPy so every random obstacle field is reproducible for students.
random.seed(7)  # Seed Python's random module so interactive examples start from a reproducible baseline.
plt.rcParams["figure.figsize"] = (6, 6)  # Use square-ish figures because grid cells should look like cells.
plt.rcParams["axes.grid"] = False  # Disable default axes grids because we draw our own cell boundaries.
EMPTY = 0  # Encode open grid cells as 0 so they can be traversed.
WALL = 1  # Encode blocked grid cells as 1 so neighbors can reject them.
MUD = 2  # Encode expensive terrain as 2 so UCS and A* can show weighted costs.
START = 3  # Encode the start cell separately so plots can color it distinctly.
GOAL = 4  # Encode the goal cell separately so plots can color it distinctly.
ACTION_ORDER = [(0, 1), (1, 0), (0, -1), (-1, 0)]  # Prefer right, down, left, up so paths are deterministic.
ACTION_NAMES = {(0, 1): "R", (1, 0): "D", (0, -1): "L", (-1, 0): "U"}  # Name actions so printed paths are readable.
def make_grid(rows, cols, walls=None, mud=None, start=(0, 0), goal=None):  # Build a reusable gridworld from simple pieces.
    grid = np.zeros((rows, cols), dtype=int)  # Start with every cell open because obstacles are usually sparse.
    goal = (rows - 1, cols - 1) if goal is None else goal  # Default to the lower-right corner for textbook mazes.
    for cell in (walls or []):  # Loop over wall coordinates because blocked cells are easiest to list explicitly.
        grid[cell] = WALL  # Mark this coordinate as blocked so search cannot enter it.
    for cell in (mud or []):  # Loop over weighted terrain because some examples need nonuniform costs.
        grid[cell] = MUD  # Mark this coordinate as expensive but still traversable.
    grid[start] = START  # Mark the start after terrain so it is never hidden by a terrain label.
    grid[goal] = GOAL  # Mark the goal after terrain so it is never hidden by a terrain label.
    return grid, start, goal  # Return all search ingredients together for convenience.
def in_bounds(grid, cell):  # Check whether a coordinate is inside the grid.
    r, c = cell  # Unpack the row and column because the conditions use both pieces.
    return 0 <= r < grid.shape[0] and 0 <= c < grid.shape[1]  # Accept only legal array indices.
def passable(grid, cell):  # Check whether search is allowed to enter a coordinate.
    return grid[cell] != WALL  # Reject only walls because mud, start, and goal are traversable.
def grid_cost(grid, cell):  # Compute the cost of entering a cell.
    return 5 if grid[cell] == MUD else 1  # Charge more for mud so weighted searches differ from BFS.
def grid_neighbors(grid, cell, diagonals=False):  # Generate legal successor states for a grid cell.
    moves = ACTION_ORDER + ([(1, 1), (1, -1), (-1, 1), (-1, -1)] if diagonals else [])  # Add diagonals only for relaxed examples.
    for dr, dc in moves:  # Try each motion in deterministic order for reproducible frontier behavior.
        nxt = (cell[0] + dr, cell[1] + dc)  # Compute the successor coordinate produced by this action.
        if in_bounds(grid, nxt) and passable(grid, nxt):  # Keep only successors that are inside and not walls.
            yield nxt  # Yield the legal neighbor so search code can consume successors lazily.
def manhattan(a, b):  # Define Manhattan distance for four-neighbor grids.
    return abs(a[0] - b[0]) + abs(a[1] - b[1])  # Count vertical plus horizontal separation.
def euclidean(a, b):  # Define Euclidean distance for a smoother but still admissible four-neighbor heuristic.
    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)  # Apply the straight-line distance formula.
def diagonal_relaxed(a, b):  # Define the relaxed cost if diagonal moves of unit cost were allowed.
    return max(abs(a[0] - b[0]), abs(a[1] - b[1]))  # Use Chebyshev distance for eight-neighbor unit-cost relaxation.
def reconstruct_path(parent, start, goal):  # Rebuild a path from a parent pointer dictionary.
    if goal not in parent and goal != start:  # Detect failure because a missing goal parent means no discovered path.
        return []  # Return an empty path so visualization can show that no route was found.
    path = [goal]  # Start reconstruction at the goal because parents point backward.
    while path[-1] != start:  # Walk backward until the start closes the chain.
        path.append(parent[path[-1]])  # Append the predecessor so the path grows in reverse.
    path.reverse()  # Reverse the backward chain so it reads start to goal.
    return path  # Return the ordered state sequence for plotting and metrics.
def path_cost_grid(grid, path):  # Compute total grid path cost under enter-cell costs.
    if not path:  # Treat a missing path as infinite cost for comparisons.
        return float("inf")  # Return infinity because no valid route exists.
    return sum(grid_cost(grid, cell) for cell in path[1:])  # Sum entry costs for every step after the start.
def draw_grid(grid, start, goal, explored=None, frontier=None, current=None, path=None, title="Grid search state", annotate_costs=None):  # Draw one search snapshot.
    explored = set() if explored is None else set(explored)  # Normalize explored to a set because membership drives coloring.
    frontier = set() if frontier is None else set(frontier)  # Normalize frontier to a set because frontier cells get a shared color.
    path = [] if path is None else list(path)  # Normalize path to a list because plotted line order matters.
    color = np.ones((*grid.shape, 3))  # Start with white RGB cells so unvisited open cells are plain.
    color[grid == WALL] = np.array([0.05, 0.05, 0.05])  # Color walls black because they are forbidden.
    color[grid == MUD] = np.array([0.78, 0.58, 0.32])  # Color mud brown because it is traversable but expensive.
    for cell in explored:  # Paint explored cells before the path so the final route remains visible.
        color[cell] = np.array([0.70, 0.85, 1.00])  # Use light blue for explored states.
    for cell in frontier:  # Paint frontier cells after explored so pending states are easy to spot.
        color[cell] = np.array([1.00, 0.88, 0.35])  # Use yellow for the frontier.
    if current is not None:  # Highlight the state being popped or expanded when one exists.
        color[current] = np.array([1.00, 0.50, 0.50])  # Use red for the current state.
    for cell in path:  # Paint the discovered path last so it is visually dominant.
        color[cell] = np.array([0.30, 0.90, 0.45])  # Use green for the final or current best path.
    color[start] = np.array([0.20, 0.35, 1.00])  # Use blue for the start even if it is explored.
    color[goal] = np.array([0.75, 0.20, 0.90])  # Use purple for the goal even if it is on the path.
    fig, ax = plt.subplots()  # Create a fresh figure so each expansion renders as a separate notebook output.
    ax.imshow(color, interpolation="nearest")  # Draw cell colors without interpolation because cells are categorical.
    ax.set_xticks(np.arange(-0.5, grid.shape[1], 1), minor=True)  # Place vertical minor ticks at cell boundaries.
    ax.set_yticks(np.arange(-0.5, grid.shape[0], 1), minor=True)  # Place horizontal minor ticks at cell boundaries.
    ax.grid(which="minor", color="gray", linewidth=0.6)  # Draw grid lines so cells are easy to count.
    ax.set_xticks(range(grid.shape[1]))  # Label columns so coordinates can be read from the plot.
    ax.set_yticks(range(grid.shape[0]))  # Label rows so coordinates can be read from the plot.
    ax.set_title(title)  # Add the algorithm step as a title to connect code to visualization.
    ax.text(start[1], start[0], "S", ha="center", va="center", color="white", weight="bold")  # Mark the start explicitly.
    ax.text(goal[1], goal[0], "G", ha="center", va="center", color="white", weight="bold")  # Mark the goal explicitly.
    if annotate_costs is not None:  # Optionally annotate cells with g, h, f, or DP values.
        for cell, label in annotate_costs.items():  # Loop through labels supplied by the current example.
            ax.text(cell[1], cell[0], label, ha="center", va="center", fontsize=7, color="black")  # Place each label in its cell.
    if len(path) > 1:  # Draw a polyline only when the path has at least one edge.
        ys = [cell[0] for cell in path]  # Extract row coordinates because Matplotlib line y-values use rows.
        xs = [cell[1] for cell in path]  # Extract column coordinates because Matplotlib line x-values use columns.
        ax.plot(xs, ys, color="lime", linewidth=3)  # Overlay the route so it remains visible over cell colors.
    plt.show()  # Display the snapshot immediately in notebook execution order.
def draw_graph(nodes, edges, pos, explored=None, frontier=None, current=None, path=None, title="Graph search state", labels=None):  # Draw a small weighted graph snapshot.
    explored = set() if explored is None else set(explored)  # Normalize explored for node coloring.
    frontier = set() if frontier is None else set(frontier)  # Normalize frontier for node coloring.
    path = [] if path is None else list(path)  # Normalize path for edge highlighting.
    fig, ax = plt.subplots(figsize=(7, 4))  # Create a wider figure because graph labels need horizontal room.
    for u, v, w in edges:  # Draw every directed edge before nodes so nodes sit on top.
        color = "lime" if any(path[i] == u and path[i + 1] == v for i in range(len(path) - 1)) else "0.55"  # Highlight path edges.
        ax.annotate("", xy=pos[v], xytext=pos[u], arrowprops=dict(arrowstyle="->", color=color, lw=2))  # Draw a directed arrow.
        mx = (pos[u][0] + pos[v][0]) / 2  # Compute midpoint x for the edge cost label.
        my = (pos[u][1] + pos[v][1]) / 2  # Compute midpoint y for the edge cost label.
        ax.text(mx, my, str(w), fontsize=9, bbox=dict(facecolor="white", edgecolor="none", alpha=0.7))  # Show edge cost.
    for n in nodes:  # Draw every node after edges for readability.
        color = "tomato" if n == current else "gold" if n in frontier else "lightskyblue" if n in explored else "white"  # Choose node color by search state.
        ax.scatter(pos[n][0], pos[n][1], s=900, color=color, edgecolor="black", zorder=3)  # Plot the node as a large marker.
        text = n if labels is None or n not in labels else f"{n}\n{labels[n]}"  # Add optional cost labels under node names.
        ax.text(pos[n][0], pos[n][1], text, ha="center", va="center", fontsize=9, zorder=4)  # Center the node label.
    ax.set_title(title)  # Describe the current algorithm step.
    ax.axis("off")  # Hide axes because graph coordinates are only layout positions.
    plt.show()  # Display the graph snapshot.
def print_metric(name, value):  # Print metrics with a consistent visual prefix.
    print(f"{name}: {value}")  # Show the metric in a simple Colab-friendly text line.
```

▶ What you'll see: no plot yet; this cell defines the shared visual vocabulary: blue start, purple goal, black walls, brown mud, light-blue explored cells, yellow frontier cells, red current cell, and green final path.

### Data — swappable problems

The notebook uses a single `PROBLEM` toggle. Change it to compare algorithms on open grids, mazes, weighted terrain, or an uploaded-like custom grid.

```python
PROBLEM = "maze"  # Choose one of "open_grid", "maze", "weighted", or "upload" for the shared data source.
if PROBLEM == "open_grid":  # Use an empty grid when you want heuristics to look ideal.
    grid, start, goal = make_grid(6, 8, walls=[], mud=[], start=(0, 0), goal=(5, 7))  # Build a rectangular open planning problem.
elif PROBLEM == "maze":  # Use walls when you want frontier order to matter.
    walls = [(0, 3), (1, 1), (1, 3), (2, 1), (2, 3), (3, 3), (4, 1), (4, 5), (5, 5)]  # List blocked cells for the small maze.
    grid, start, goal = make_grid(6, 8, walls=walls, mud=[], start=(0, 0), goal=(5, 7))  # Build the unweighted maze.
elif PROBLEM == "weighted":  # Use mud when you want BFS and UCS to disagree.
    walls = [(1, 2), (2, 2), (3, 2), (4, 4)]  # Add a few walls so routes must bend.
    mud = [(0, 3), (0, 4), (1, 4), (2, 4), (3, 4)]  # Add high-cost terrain along a short-looking route.
    grid, start, goal = make_grid(6, 8, walls=walls, mud=mud, start=(0, 0), goal=(5, 7))  # Build the weighted grid.
elif PROBLEM == "upload":  # Simulate an uploaded grid without relying on external files.
    raw = np.array([[3, 0, 0, 1, 0], [1, 1, 0, 1, 0], [0, 0, 0, 2, 0], [0, 1, 1, 1, 0], [0, 0, 0, 0, 4]])  # Encode a custom small map.
    grid = raw.copy()  # Copy the array so edits in later cells do not mutate the original literal.
    start = tuple(np.argwhere(grid == START)[0])  # Locate the start cell from the uploaded-style encoding.
    goal = tuple(np.argwhere(grid == GOAL)[0])  # Locate the goal cell from the uploaded-style encoding.
else:  # Guard against misspelled problem names.
    raise ValueError("PROBLEM must be open_grid, maze, weighted, or upload")  # Fail clearly so students can fix the toggle.
draw_grid(grid, start, goal, title=f"Raw problem: {PROBLEM}")  # Plot the chosen grid before running any algorithm.
```

▶ What you'll see: the raw grid before search; walls are black, weighted mud cells are brown when present, start is blue, and goal is purple.


### 📖 Concept walkthrough — build each idea from scratch

Before the warm-up examples, we build each search idea from scratch with tiny hand-built graphs. The code uses only NumPy + Matplotlib plus `deque` and `heapq`, so every frontier, explored set, and path is visible. Variables use `_w` suffixes so this walkthrough stays separate from the examples below.

```python
import numpy as np  # Use NumPy for tiny coordinate arrays and deterministic numeric inspection.
import matplotlib.pyplot as plt  # Use Matplotlib because every search algorithm is easier to understand as a plotted graph.
from collections import deque  # Use deque because BFS needs a first-in-first-out frontier with cheap pops from the left.
import heapq  # Use heapq because UCS and A* need a minimum-priority frontier.
np.random.seed(0)  # Seed NumPy so any later tiny random choices remain reproducible.
```

#### 1. Tree search versus graph search

**What:** tree search expands paths, while graph search expands states. On a graph with a cycle, the same state can appear again and again as a different action sequence.

**Why:** if the state graph has cycles, tree search without memory can keep re-expanding repeated states or even loop forever. Graph search adds an explored set so each state is expanded at most once.

**Why this approach:** we use a three-node cycle because it is the smallest example where the difference is impossible to miss.

```python
cycle_graph_w = {"A": ["B"], "B": ["C"], "C": ["A", "D"], "D": []}  # Define a tiny directed graph where A -> B -> C -> A creates a cycle.
pos_cycle_w = {"A": np.array([0.0, 1.0]), "B": np.array([1.2, 1.0]), "C": np.array([1.2, 0.0]), "D": np.array([2.4, 0.0])}  # Store hand-picked coordinates for plotting the graph.
edges_cycle_w = [(src_w, dst_w) for src_w, nbrs_w in cycle_graph_w.items() for dst_w in nbrs_w]  # Flatten the adjacency dict into edge pairs for drawing.
print("Cycle graph:", cycle_graph_w)  # Print the adjacency list so the repeated state route is inspectable before plotting.
```

```python
def draw_graph_w(graph_w, pos_w, title_w, path_w=None, explored_w=None, frontier_w=None, current_w=None):  # Define one small graph drawer reused by all walkthrough sections.
    path_w = [] if path_w is None else list(path_w)  # Normalize the highlighted path so edge checks are simple.
    explored_w = set() if explored_w is None else set(explored_w)  # Normalize explored states for node coloring.
    frontier_w = set() if frontier_w is None else set(frontier_w)  # Normalize frontier states for node coloring.
    fig_w, ax_w = plt.subplots(figsize=(6.5, 4.0))  # Create a compact figure that still leaves room for labels.
    for src_w, nbrs_w in graph_w.items():  # Draw every outgoing edge from each state.
        for dst_item_w in nbrs_w:  # Loop through successors, which may be plain nodes or (node, cost) pairs.
            dst_w = dst_item_w[0] if isinstance(dst_item_w, tuple) else dst_item_w  # Extract the destination name from either edge format.
            cost_w = dst_item_w[1] if isinstance(dst_item_w, tuple) else None  # Extract the cost label only when this is a weighted edge.
            on_path_w = any(path_w[i_w] == src_w and path_w[i_w + 1] == dst_w for i_w in range(len(path_w) - 1))  # Test whether this directed edge belongs to the highlighted path.
            color_w = "limegreen" if on_path_w else "0.55"  # Use green for the answer path and gray for all other edges.
            ax_w.annotate("", xy=pos_w[dst_w], xytext=pos_w[src_w], arrowprops=dict(arrowstyle="->", color=color_w, lw=2.2))  # Draw the directed edge as an arrow.
            if cost_w is not None:  # Add a numeric label only for weighted examples.
                mid_w = (pos_w[src_w] + pos_w[dst_w]) / 2.0  # Compute the midpoint where the cost label should sit.
                ax_w.text(mid_w[0], mid_w[1], str(cost_w), fontsize=9, bbox=dict(facecolor="white", edgecolor="none", alpha=0.8))  # Print the edge cost on a white background.
    for node_w in graph_w:  # Draw each state after edges so nodes sit on top.
        color_w = "tomato" if node_w == current_w else "gold" if node_w in frontier_w else "lightskyblue" if node_w in explored_w else "white"  # Encode current, frontier, explored, and unseen states by color.
        ax_w.scatter(pos_w[node_w][0], pos_w[node_w][1], s=850, color=color_w, edgecolor="black", zorder=3)  # Plot the state as a large labeled circle.
        ax_w.text(pos_w[node_w][0], pos_w[node_w][1], node_w, ha="center", va="center", fontsize=11, weight="bold", zorder=4)  # Put the state name inside the circle.
    ax_w.set_title(title_w)  # Title the plot with the subsection number and idea.
    ax_w.axis("off")  # Hide axes because the coordinates are only a graph layout.
    plt.show()  # Render the graph immediately in notebook order.
```

▶ What you'll see: no plot yet; this cell defines the shared drawing helper for all tiny graphs below.

```python
tree_frontier_w = [["A"]]  # Start tree search with one path rather than one state.
tree_expansions_w = []  # Store every path popped from the frontier so repetition becomes visible.
for step_w in range(8):  # Limit the loop to eight expansions so the demonstration cannot run forever.
    path_w = tree_frontier_w.pop(0)  # Pop the oldest path to mimic breadth-first tree search.
    state_w = path_w[-1]  # Read the current state as the last state on that path.
    tree_expansions_w.append(path_w)  # Record the expanded path for inspection.
    for nxt_w in cycle_graph_w[state_w]:  # Extend the current path by every successor state.
        tree_frontier_w.append(path_w + [nxt_w])  # Add a new path even if its final state was seen before.
print("Tree-search path expansions:", tree_expansions_w)  # Show that A, B, C, A, ... can keep reappearing as longer paths.
print("Frontier after 8 bounded expansions:", tree_frontier_w)  # Show that the cycle keeps generating more path work.
```

```python
graph_frontier_w = deque(["A"])  # Start graph search with states in a queue rather than paths only.
graph_explored_w = set()  # Create an explored set so repeated states are not expanded again.
graph_order_w = []  # Store the state expansion order for comparison with tree search.
while graph_frontier_w:  # Continue until every reachable state has been handled once.
    state_w = graph_frontier_w.popleft()  # Pop the oldest frontier state.
    if state_w in graph_explored_w:  # Skip a state if an earlier path already expanded it.
        continue  # Avoid re-expanding a state reached through the cycle.
    graph_explored_w.add(state_w)  # Mark this state as expanded.
    graph_order_w.append(state_w)  # Record the clean graph-search order.
    for nxt_w in cycle_graph_w[state_w]:  # Inspect successors of the current state.
        if nxt_w not in graph_explored_w and nxt_w not in graph_frontier_w:  # Add only genuinely pending states.
            graph_frontier_w.append(nxt_w)  # Queue the unseen successor for later expansion.
print("Graph-search expansion order:", graph_order_w)  # Print each state once because the explored set blocks the cycle.
```

```python
draw_graph_w(cycle_graph_w, pos_cycle_w, "1: graph search uses explored states to stop a cycle", path_w=["A", "B", "C", "D"], explored_w=graph_order_w, current_w="D")  # Draw the cycle and highlight the successful path to D.
```

▶ What you'll see: the cycle edge points back to `A`, but the explored set colors states once instead of letting the search re-expand them forever.

A tree-search node is a whole path such as $(A,B,C,A)$, so a cycle creates infinitely many distinct paths. A graph-search node is the state `A`, `B`, `C`, or `D`, so the explored set makes the finite state space explicit.

*Why it's done this way: the smallest cyclic graph isolates the reason graph search needs memory without hiding the issue inside a large maze.*

#### 2. Breadth-first search (BFS)

**What:** BFS explores states level by level using a FIFO queue.

**Why:** when every edge has the same cost, the first time BFS reaches a goal it has used the fewest edges.

**Why this approach:** we use an unweighted branching graph so queue order, levels, and the fewest-edges path can all be printed directly.

```python
bfs_graph_w = {"S": ["A", "B"], "A": ["C", "D"], "B": ["E"], "C": [], "D": ["G"], "E": ["G"], "G": []}  # Define an unweighted graph with two routes to G.
pos_bfs_w = {"S": np.array([0.0, 0.5]), "A": np.array([1.1, 1.1]), "B": np.array([1.1, -0.1]), "C": np.array([2.2, 1.5]), "D": np.array([2.2, 0.8]), "E": np.array([2.2, -0.2]), "G": np.array([3.3, 0.25])}  # Position nodes in visible BFS layers.
print("BFS graph:", bfs_graph_w)  # Print the tiny graph before running the queue.
```

```python
bfs_frontier_w = deque(["S"])  # Put the start state in a FIFO queue.
bfs_parent_w = {"S": None}  # Remember how each state was first reached so the final path can be reconstructed.
bfs_order_w = []  # Store expansion order to prove the level-by-level behavior.
while bfs_frontier_w:  # Keep expanding until the queue is empty or the goal is found.
    state_w = bfs_frontier_w.popleft()  # Remove the oldest state, which is the shallowest pending state.
    bfs_order_w.append(state_w)  # Record the expansion before adding children.
    print("pop", state_w, "frontier now", list(bfs_frontier_w))  # Print the queue after the pop so FIFO behavior is visible.
    if state_w == "G":  # Stop as soon as the goal is popped.
        break  # The popped goal is guaranteed to have the fewest edges in an unweighted graph.
    for nxt_w in bfs_graph_w[state_w]:  # Visit successors in the listed action order.
        if nxt_w not in bfs_parent_w:  # Add each state only the first time BFS discovers it.
            bfs_parent_w[nxt_w] = state_w  # Store the predecessor used by the fewest-edge discovery.
            bfs_frontier_w.append(nxt_w)  # Push the successor to the back of the queue.
            print("  push", nxt_w, "frontier becomes", list(bfs_frontier_w))  # Print each push so levels can be followed.
print("BFS expansion order:", bfs_order_w)  # Summarize the completed level order.
```

```python
bfs_path_w = []  # Prepare a list for the reconstructed route from S to G.
state_w = "G"  # Start backtracking from the goal.
while state_w is not None:  # Follow parent pointers until the start marker is reached.
    bfs_path_w.append(state_w)  # Add the current state to the reversed path.
    state_w = bfs_parent_w[state_w]  # Move one predecessor closer to the start.
bfs_path_w = bfs_path_w[::-1]  # Reverse the backtracked path so it runs from start to goal.
print("Fewest-edges BFS path:", bfs_path_w)  # Print the path that BFS discovered first.
print("Number of edges:", len(bfs_path_w) - 1)  # Count edges as path length minus one state.
```

```python
draw_graph_w(bfs_graph_w, pos_bfs_w, "2: BFS expands by levels and finds fewest edges", path_w=bfs_path_w, explored_w=bfs_order_w, current_w="G")  # Draw BFS layers and the discovered route.
```

▶ What you'll see: nodes closer to `S` are explored before deeper nodes, and the highlighted route to `G` has the fewest edges.

If every edge cost is the same constant $c\geq0$, minimizing total cost is the same as minimizing the number of edges. The FIFO queue enforces that all depth-$d$ states are popped before any depth-$(d+1)$ state.

*Why it's done this way: a queue is the simplest data structure that preserves discovery order, which is exactly what level-by-level search needs.*

#### 3. Depth-first search (DFS)

**What:** DFS explores one branch as deeply as possible before backing up.

**Why:** DFS can reach deep solutions using little frontier memory, but it does not guarantee the fewest-edges path.

**Why this approach:** we reuse the BFS graph so the contrast is only the frontier rule: stack instead of queue.

```python
dfs_stack_w = ["S"]  # Put the start state on a LIFO stack.
dfs_parent_w = {"S": None}  # Store first-discovery parents so the found path can be reconstructed.
dfs_order_w = []  # Track the order states are popped from the stack.
while dfs_stack_w:  # Continue until the stack is empty or the goal is found.
    state_w = dfs_stack_w.pop()  # Pop the newest state, which drives depth-first behavior.
    dfs_order_w.append(state_w)  # Record the expansion order for comparison with BFS.
    print("pop", state_w, "stack now", list(dfs_stack_w))  # Print the stack after each pop.
    if state_w == "G":  # Stop when DFS reaches the goal.
        break  # This goal path is the first deep route found, not necessarily the shallowest route.
    for nxt_w in reversed(bfs_graph_w[state_w]):  # Reverse successor order so the leftmost listed child is explored first.
        if nxt_w not in dfs_parent_w:  # Discover each state once to keep this as graph DFS.
            dfs_parent_w[nxt_w] = state_w  # Store how the successor was first reached.
            dfs_stack_w.append(nxt_w)  # Push the successor onto the top of the stack.
            print("  push", nxt_w, "stack becomes", list(dfs_stack_w))  # Print the new stack so LIFO behavior is visible.
print("DFS expansion order:", dfs_order_w)  # Summarize how DFS dives before sweeping across levels.
```

```python
dfs_path_w = []  # Prepare a list for the reconstructed DFS route.
state_w = "G"  # Start parent backtracking at the goal.
while state_w is not None:  # Keep following parents until the start marker is reached.
    dfs_path_w.append(state_w)  # Add the current state to the reversed answer.
    state_w = dfs_parent_w[state_w]  # Move to the predecessor chosen by DFS.
dfs_path_w = dfs_path_w[::-1]  # Reverse the answer so it reads from S to G.
print("DFS first-found path:", dfs_path_w)  # Print the path found by depth-first exploration.
print("BFS order for contrast:", bfs_order_w)  # Reprint BFS order from the previous subsection for side-by-side comparison.
print("DFS order for contrast:", dfs_order_w)  # Print DFS order to show the different frontier discipline.
```

```python
draw_graph_w(bfs_graph_w, pos_bfs_w, "3: DFS follows one branch before backtracking", path_w=dfs_path_w, explored_w=dfs_order_w, current_w="G")  # Draw the first route DFS reaches.
```

▶ What you'll see: DFS goes down the `S -> A -> C` side before exploring all nodes at the same depth, unlike BFS.

DFS changes only one ingredient from BFS: the frontier is LIFO instead of FIFO. That small data-structure change replaces level order with deep-first order.

*Why it's done this way: reusing the same graph makes the stack-versus-queue effect visible without changing the problem itself.*

#### 4. Dynamic programming on a DAG

**What:** on a directed acyclic graph (DAG), dynamic programming computes the best future cost of each state once and reuses it.

**Why:** acyclicity gives a safe order: when we evaluate a state, all states after it can already have known values.

**Why this approach:** we hand-build a small weighted DAG and evaluate the recurrence
$\operatorname{FutureCost}(s)=\min_a[\operatorname{Cost}(s,a)+\operatorname{FutureCost}(\operatorname{Succ}(s,a))]$
from the goal backward.

```python
dag_graph_w = {"S": [("A", 2), ("B", 5)], "A": [("C", 2), ("D", 4)], "B": [("D", 1)], "C": [("G", 3)], "D": [("G", 1)], "G": []}  # Define a weighted DAG with shared subproblems C, D, and G.
pos_dag_w = {"S": np.array([0.0, 0.5]), "A": np.array([1.1, 1.1]), "B": np.array([1.1, -0.1]), "C": np.array([2.2, 1.1]), "D": np.array([2.2, -0.1]), "G": np.array([3.3, 0.5])}  # Arrange the DAG from left to right so arrows never need to point backward.
topo_w = ["S", "A", "B", "C", "D", "G"]  # Give a topological order where every edge points from earlier to later.
print("Topological order:", topo_w)  # Print the order that makes bottom-up DP possible.
```

```python
future_cost_w = {"G": 0}  # Set the base case because the goal has zero remaining cost.
choice_w = {"G": None}  # Store the best successor chosen by the recurrence.
for state_w in reversed(topo_w[:-1]):  # Sweep backward so successors already have FutureCost values.
    candidates_w = []  # Collect candidate cost-to-go values for this state.
    for nxt_w, cost_w in dag_graph_w[state_w]:  # Evaluate each action from the current state.
        total_w = cost_w + future_cost_w[nxt_w]  # Add immediate edge cost to the already-known future cost.
        candidates_w.append((total_w, nxt_w))  # Store both the numeric value and the successor that achieved it.
        print(state_w, "->", nxt_w, "cost", cost_w, "+ FutureCost", future_cost_w[nxt_w], "=", total_w)  # Print the recurrence term explicitly.
    best_total_w, best_next_w = min(candidates_w)  # Choose the minimum candidate just like the DP recurrence.
    future_cost_w[state_w] = best_total_w  # Memoize the best value for later predecessors.
    choice_w[state_w] = best_next_w  # Memoize the argmin so the path can be reconstructed.
print("FutureCost values:", future_cost_w)  # Print the final value table.
```

```python
dp_path_w = ["S"]  # Start the optimal DAG path at S.
while dp_path_w[-1] != "G":  # Follow best choices until the goal is reached.
    dp_path_w.append(choice_w[dp_path_w[-1]])  # Append the successor selected by the DP argmin.
print("DP shortest path:", dp_path_w)  # Print the optimal path recovered from choices.
print("DP shortest cost:", future_cost_w["S"])  # Print the minimum cost from the start.
```

```python
draw_graph_w(dag_graph_w, pos_dag_w, "4: DP on a DAG reuses future costs", path_w=dp_path_w, explored_w=future_cost_w.keys(), current_w="S")  # Draw the weighted DAG and highlight the DP-optimal route.
```

▶ What you'll see: the graph flows left to right, and the highlighted path follows the smallest memoized future costs.

The recurrence is valid here because there is no cycle that would make a state's value depend on itself. In a DAG, reversed topological order guarantees every successor value is available before its predecessor is computed.

*Why it's done this way: evaluating the graph backward turns exponential repeated suffix searches into one value lookup per state.*

#### 5. Uniform-cost search (UCS)

**What:** UCS expands the state with the smallest cumulative past cost $g(s)$.

**Why:** with non-negative edge costs, once a state is popped from the priority queue, no later path can reach it more cheaply.

**Why this approach:** we use a weighted graph where the fewest-edge route is not the cheapest route, so cost priority matters.

```python
ucs_graph_w = {"S": [("A", 1), ("B", 4)], "A": [("C", 2), ("G", 7)], "B": [("G", 2)], "C": [("G", 2)], "G": []}  # Define a weighted graph where S-A-C-G costs 5 and S-B-G costs 6.
pos_ucs_w = {"S": np.array([0.0, 0.4]), "A": np.array([1.1, 1.0]), "B": np.array([1.1, -0.2]), "C": np.array([2.2, 1.0]), "G": np.array([3.3, 0.4])}  # Place nodes so alternate routes are easy to compare.
print("Weighted UCS graph:", ucs_graph_w)  # Print the weighted adjacency list before using the heap.
```

```python
ucs_heap_w = [(0, "S")]  # Initialize the priority queue with cumulative cost zero at the start.
ucs_best_w = {"S": 0}  # Store the best known cumulative cost to each discovered state.
ucs_parent_w = {"S": None}  # Store predecessors for the final path.
ucs_explored_w = []  # Record pop order to show increasing cumulative cost.
while ucs_heap_w:  # Continue until the cheapest pending state is the goal.
    cost_w, state_w = heapq.heappop(ucs_heap_w)  # Pop the state with least cumulative cost.
    if cost_w != ucs_best_w[state_w]:  # Ignore stale heap entries created before a better route was found.
        continue  # Skip outdated work without changing correctness.
    ucs_explored_w.append(state_w)  # Record the state whose cost is now finalized.
    print("pop", state_w, "with g =", cost_w)  # Print the exact priority that caused this expansion.
    if state_w == "G":  # Stop when the goal is popped.
        break  # The goal cost is optimal because all remaining priorities are no smaller.
    for nxt_w, edge_cost_w in ucs_graph_w[state_w]:  # Relax every outgoing edge.
        new_cost_w = cost_w + edge_cost_w  # Compute the new cumulative path cost.
        if new_cost_w < ucs_best_w.get(nxt_w, np.inf):  # Keep the update only if it improves the best known cost.
            ucs_best_w[nxt_w] = new_cost_w  # Save the improved cumulative cost.
            ucs_parent_w[nxt_w] = state_w  # Save the predecessor that produced the improvement.
            heapq.heappush(ucs_heap_w, (new_cost_w, nxt_w))  # Push the improved state into the priority queue.
            print("  push", nxt_w, "with g =", new_cost_w)  # Print each relaxation so the heap priorities are visible.
print("Final best costs:", ucs_best_w)  # Print the finalized and discovered costs.
```

```python
ucs_path_w = []  # Prepare to reconstruct the UCS route.
state_w = "G"  # Start at the goal.
while state_w is not None:  # Follow parent pointers to the start.
    ucs_path_w.append(state_w)  # Add the current state to the reversed path.
    state_w = ucs_parent_w[state_w]  # Move to the predecessor found by relaxation.
ucs_path_w = ucs_path_w[::-1]  # Reverse the route to read from S to G.
print("UCS optimal path:", ucs_path_w)  # Print the cheapest route.
print("UCS optimal cost:", ucs_best_w["G"])  # Print the total cost of that route.
```

```python
draw_graph_w(ucs_graph_w, pos_ucs_w, "5: UCS expands least cumulative cost first", path_w=ucs_path_w, explored_w=ucs_explored_w, current_w="G")  # Draw the weighted graph and UCS result.
```

▶ What you'll see: UCS reaches `A` before `B` because `g(A)=1`, then still chooses the cheapest total route through `C`.

Non-negative costs are essential: after UCS pops the smallest $g(s)$, any alternate route must add costs $\geq0$ to some not-yet-smaller frontier priority. Therefore that popped cost cannot be improved later.

*Why it's done this way: the heap stores exactly the theorem's priority, so the printed pop sequence is the proof idea in miniature.*

#### 6. A* search, heuristics, and relaxation-derived heuristics

**What:** A* expands the state with smallest $f(s)=g(s)+h(s)$, where $g(s)$ is past cost and $h(s)$ estimates future cost.

**Why:** an informative admissible heuristic can avoid states that UCS must inspect, while still preserving optimality when $h(s)\leq$ the true remaining cost.

**Why this approach:** we reuse the UCS graph, compute true future costs as a perfect heuristic, and compare UCS pops with A* pops.

```python
true_future_w = {"G": 0, "C": 2, "B": 2, "A": 4, "S": 5}  # Store exact remaining costs, which are admissible because h(s) equals the true cost-to-go.
relaxed_h_w = {state_w: max(0, true_future_w[state_w] - 1) for state_w in true_future_w}  # Create a weaker relaxation-style heuristic by subtracting one unit of constraint/cost.
zero_h_w = {state_w: 0 for state_w in true_future_w}  # Store the zero heuristic, which makes A* behave like UCS.
print("Zero heuristic:", zero_h_w)  # Print the baseline h values.
print("Relaxation-derived heuristic:", relaxed_h_w)  # Print the easier-problem h values.
print("Perfect admissible heuristic:", true_future_w)  # Print the most informative admissible h values.
```

```python
def astar_w(graph_w, heuristic_w, start_w="S", goal_w="G"):  # Define a compact A* routine for comparing heuristics.
    heap_w = [(heuristic_w[start_w], 0, start_w)]  # Prioritize the start by f = g + h.
    best_g_w = {start_w: 0}  # Track the best cumulative cost found so far.
    parent_w = {start_w: None}  # Track predecessors for path reconstruction.
    pop_order_w = []  # Record expanded states so we can compare work.
    while heap_w:  # Continue while some frontier state remains.
        f_w, g_w, state_w = heapq.heappop(heap_w)  # Pop the lowest estimated total cost.
        if g_w != best_g_w[state_w]:  # Skip stale entries whose g value is no longer best.
            continue  # Keep the heap implementation simple without explicit decrease-key.
        pop_order_w.append(state_w)  # Record this finalized expansion.
        print("pop", state_w, "g =", g_w, "h =", heuristic_w[state_w], "f =", f_w)  # Print the A* priority decomposition.
        if state_w == goal_w:  # Stop when the goal is selected for expansion.
            break  # With an admissible and consistent heuristic here, this path is optimal.
        for nxt_w, edge_cost_w in graph_w[state_w]:  # Relax every outgoing edge.
            new_g_w = g_w + edge_cost_w  # Add the edge cost to the known past cost.
            if new_g_w < best_g_w.get(nxt_w, np.inf):  # Update only if this path improves the best known g.
                best_g_w[nxt_w] = new_g_w  # Save the improved past cost.
                parent_w[nxt_w] = state_w  # Save the predecessor for path recovery.
                heapq.heappush(heap_w, (new_g_w + heuristic_w[nxt_w], new_g_w, nxt_w))  # Push priority f = g + h.
                print("  push", nxt_w, "g =", new_g_w, "h =", heuristic_w[nxt_w], "f =", new_g_w + heuristic_w[nxt_w])  # Print each frontier update.
    path_w = []  # Prepare the reconstructed route.
    state_w = goal_w  # Backtrack from the goal.
    while state_w is not None:  # Follow parents until the start marker is reached.
        path_w.append(state_w)  # Add the current state to the reversed route.
        state_w = parent_w[state_w]  # Move one step toward the start.
    return path_w[::-1], best_g_w[goal_w], pop_order_w  # Return the path, optimal cost, and expansion order.
```

```python
print("A* with zero h, equivalent to UCS:")  # Label the baseline run.
astar_zero_path_w, astar_zero_cost_w, astar_zero_order_w = astar_w(ucs_graph_w, zero_h_w)  # Run A* with h = 0 to reproduce UCS behavior.
print("A* with perfect h:")  # Label the informative run.
astar_path_w, astar_cost_w, astar_order_w = astar_w(ucs_graph_w, true_future_w)  # Run A* with exact remaining costs.
print("Zero-h expansions:", astar_zero_order_w)  # Print the baseline expansion order.
print("Perfect-h expansions:", astar_order_w)  # Print the shorter informed expansion order.
print("A* path and cost:", astar_path_w, astar_cost_w)  # Print the optimal route and total cost.
```

```python
draw_graph_w(ucs_graph_w, pos_ucs_w, "6: A* uses g + h to focus the frontier", path_w=astar_path_w, explored_w=astar_order_w, current_w="G")  # Draw the A* expansions and final path.
```

▶ What you'll see: the perfect heuristic focuses A* on the optimal route and expands fewer states than the zero heuristic/UCS baseline.

Admissibility means $h(s)\leq\operatorname{FutureCost}(s)$, so the heuristic never over-promises how cheap the rest of the path can be. Relaxation-derived heuristics get this property by solving an easier problem whose constraints or costs make the remaining path no more expensive than the original.

*Why it's done this way: comparing $h=0$, a relaxed heuristic, and exact future costs shows that A* is UCS plus increasingly useful lower-bound information.*

### 🟢 Basics (warm-up)

#### B1. List valid neighbors of one grid cell

Goal: list the legal four-neighbor moves from one grid cell while rejecting walls and out-of-bounds cells.

```python
basic_grid, basic_start, basic_goal = make_grid(3, 3, walls=[(1, 2)], start=(0, 0), goal=(2, 2))  # Build a tiny map so one blocked neighbor is easy to inspect.
basic_cell = (1, 1)  # Choose the center cell because it has four possible directions before filtering.
draw_grid(basic_grid, basic_start, basic_goal, current=basic_cell, title="B1 setup: inspect neighbors of the center cell")  # Highlight the cell whose successors we will compute.
```

▶ What you'll see: a 3×3 grid with one black wall next to the center cell.

```python
basic_neighbors = list(grid_neighbors(basic_grid, basic_cell))  # Ask the shared helper to keep only in-bounds, non-wall successors.
print("Valid neighbors:", basic_neighbors)  # Print the surviving cells so the filtering result is explicit.
draw_grid(basic_grid, basic_start, basic_goal, frontier=basic_neighbors, current=basic_cell, title="B1 result: valid neighbors in yellow")  # Color valid neighbors yellow so the list matches the picture.
```

▶ What you'll see: three valid neighbors, with the wall excluded from the yellow cells.

👀 **Takeaway:** successor generation is just local filtering: try candidate moves, then keep only legal states.

#### B2. Compare one FIFO queue pop with one LIFO stack pop

Goal: see how the same frontier order produces different next states for BFS and DFS.

```python
basic_queue = deque(["A", "B", "C"])  # Use a deque because BFS removes the oldest frontier item first.
basic_stack = ["A", "B", "C"]  # Use a list because DFS removes the newest frontier item first.
print("Queue before pop:", list(basic_queue))  # Show the BFS frontier before its first removal.
print("Stack before pop:", basic_stack)  # Show the DFS frontier before its first removal.
```

▶ What you'll see: both frontiers contain the same labels in the same displayed order.

```python
basic_queue_next = basic_queue.popleft()  # Pop from the left because FIFO means first-in-first-out.
basic_stack_next = basic_stack.pop()  # Pop from the right because LIFO means last-in-first-out.
print("Queue popped:", basic_queue_next, "remaining:", list(basic_queue))  # Show that BFS chooses the oldest label A.
print("Stack popped:", basic_stack_next, "remaining:", basic_stack)  # Show that DFS chooses the newest label C.
```

▶ What you'll see: the queue pops `A`, while the stack pops `C`.

👀 **Takeaway:** BFS and DFS differ at the frontier primitive: FIFO spreads outward, while LIFO dives along the newest branch.

#### B3. Mark one visited node to avoid revisiting a tiny graph

Goal: mark one explored node so a cycle does not send search back to a state already handled.

```python
basic_nodes = ["A", "B", "C"]  # Name three states so the cycle is small enough to read at a glance.
basic_edges = [("A", "B", 1), ("B", "C", 1), ("C", "A", 1)]  # Add a directed cycle so revisiting is possible.
basic_pos = {"A": (0, 1), "B": (1, 0), "C": (2, 1)}  # Fix node positions so before-after plots are visually comparable.
draw_graph(basic_nodes, basic_edges, basic_pos, title="B3 setup: tiny graph with a cycle")  # Draw the graph before any node is marked visited.
```

▶ What you'll see: a three-node directed cycle `A → B → C → A`.

```python
basic_visited = {"A"}  # Mark A visited because its outgoing edge has already been expanded.
draw_graph(basic_nodes, basic_edges, basic_pos, explored=basic_visited, current="A", title="B3 mark visited: A is explored")  # Color A as explored so the visited set becomes visible.
print("Visited set:", basic_visited)  # Print the exact set that future expansions will check.
```

▶ What you'll see: node `A` is highlighted as the current explored node, and the visited set contains `A`.

```python
basic_candidate = "A"  # Simulate following the cycle edge from C back to A.
if basic_candidate in basic_visited:  # Check membership before pushing because visited nodes should not be expanded twice.
    print("Skip", basic_candidate, "because it is already visited")  # Explain the skip so the anti-cycle rule is concrete.
draw_graph(basic_nodes, basic_edges, basic_pos, explored=basic_visited, current="C", title="B3 result: C does not re-add visited A")  # Show that A stays explored instead of reentering the frontier.
```

▶ What you'll see: the attempted return to `A` is skipped, so the cycle does not cause repeated work.

👀 **Takeaway:** a visited set turns cyclic graphs into finite work by preventing already-expanded states from reentering the frontier.


#### B4. Compute the path cost of a node list

Goal: add the costs of entering cells along a short grid path.

```python
path_grid_b4, start_b4, goal_b4 = make_grid(3, 3, mud=[(0, 1)], start=(0, 0), goal=(0, 2))  # Put one mud cell on a tiny path.
path_b4 = [(0, 0), (0, 1), (0, 2)]  # Define a path from start to goal through the mud cell.
cost_b4 = path_cost_grid(path_grid_b4, path_b4)  # Sum entry costs for every state after the start.
draw_grid(path_grid_b4, start_b4, goal_b4, path=path_b4, title="B4: path with one mud step")  # Highlight the evaluated path.
print("path cost:", cost_b4)  # Print the scalar cost.
```

👀 **Takeaway:** path cost is an accumulated sum over the chosen transitions or entered cells.

#### B5. Reconstruct a path from parent pointers

Goal: walk backward from the goal to the start, then reverse the result.

```python
parent_b5 = {(0, 1): (0, 0), (1, 1): (0, 1), (1, 2): (1, 1)}  # Store one predecessor per discovered state.
start_b5 = (0, 0)  # Define the start state.
goal_b5 = (1, 2)  # Define the goal state.
path_b5 = reconstruct_path(parent_b5, start_b5, goal_b5)  # Use the shared helper to rebuild the forward path.
print("reconstructed path:", path_b5)  # Show the ordered start-to-goal route.
```

👀 **Takeaway:** parent pointers store enough information to recover the final route after search succeeds.

#### B6. Compute a Manhattan heuristic value

Goal: estimate grid distance by counting row and column separation.

```python
state_b6 = (1, 2)  # Choose a current grid state.
goal_b6 = (4, 6)  # Choose a goal grid state.
h_b6 = manhattan(state_b6, goal_b6)  # Add vertical and horizontal distance.
print("state:", state_b6)  # Show the current state.
print("goal:", goal_b6)  # Show the target state.
print("Manhattan h(n):", h_b6)  # Show the heuristic estimate.
```

👀 **Takeaway:** Manhattan distance is a simple admissible estimate for four-neighbor unit-cost grids without obstacles.

#### B7. Test whether a state is the goal

Goal: reduce the stopping condition to one equality check.

```python
goal_b7 = (2, 2)  # Define the target state.
candidates_b7 = [(0, 0), (2, 1), (2, 2)]  # List states that might be popped from a frontier.
for state_b7 in candidates_b7:  # Check each candidate independently.
    print(state_b7, "is goal?", state_b7 == goal_b7)  # Compare the candidate to the goal.
```

👀 **Takeaway:** search stops when the popped state satisfies the goal test.

#### B8. Expand one node by pushing its neighbors

Goal: pop one current node and add its valid neighbors to the frontier.

```python
grid_b8, start_b8, goal_b8 = make_grid(3, 3, walls=[(1, 1)], start=(0, 0), goal=(2, 2))  # Build a small grid with a blocked center.
current_b8 = (1, 0)  # Choose one node to expand.
frontier_b8 = deque()  # Start with an empty FIFO frontier.
for nbr_b8 in grid_neighbors(grid_b8, current_b8):  # Generate valid neighbors of the current node.
    frontier_b8.append(nbr_b8)  # Push each neighbor for future exploration.
draw_grid(grid_b8, start_b8, goal_b8, current=current_b8, frontier=frontier_b8, title="B8: pushed valid neighbors")  # Visualize pushed neighbors.
print("frontier after expansion:", list(frontier_b8))  # Print the resulting frontier.
```

👀 **Takeaway:** expansion turns one current state into zero or more future frontier states.

#### B9. Pop the minimum-cost item from a priority queue

Goal: use a heap to choose the frontier item with smallest priority.

```python
frontier_b9 = []  # Start an empty heap-backed priority queue.
heapq.heappush(frontier_b9, (5, "A"))  # Push a higher-cost state.
heapq.heappush(frontier_b9, (2, "B"))  # Push the current cheapest state.
heapq.heappush(frontier_b9, (3, "C"))  # Push a middle-cost state.
priority_b9, state_b9 = heapq.heappop(frontier_b9)  # Pop the state with smallest priority.
print("popped:", state_b9, "with priority", priority_b9)  # Show the selected state.
print("remaining heap:", frontier_b9)  # Show what remains in the priority queue.
```

👀 **Takeaway:** UCS and A* differ from BFS/DFS because they pop by numeric priority.

#### B10. Count expanded nodes

Goal: maintain a simple metric while a search loop runs.

```python
expanded_b10 = []  # Store states after they are popped and processed.
for state_b10 in ["S", "A", "B", "G"]:  # Simulate four popped states.
    expanded_b10.append(state_b10)  # Mark this state as expanded.
    if state_b10 == "G":  # Stop once the goal is expanded.
        break  # End the simulated search loop.
print("expanded states:", expanded_b10)  # Show the processed order.
print("expanded count:", len(expanded_b10))  # Count how much work the search did.
```

👀 **Takeaway:** expanded-node count is a compact way to compare search effort.

### 🟡 Easy Examples

#### E1. BFS on an unweighted grid maze

Goal: implement BFS from scratch on a small unweighted maze. Because all step costs are equal, BFS's first time reaching the goal gives the shortest path in number of actions.

```python
small_walls = [(0, 2), (1, 2), (2, 2), (3, 4), (4, 1), (4, 2)]  # Define walls that create a narrow but solvable maze.
small_grid, small_start, small_goal = make_grid(5, 6, walls=small_walls, start=(0, 0), goal=(4, 5))  # Build the E1 maze.
draw_grid(small_grid, small_start, small_goal, title="E1 setup: unweighted maze for BFS")  # Show the problem before expanding nodes.
```

▶ What you'll see: a small maze where BFS must fan out around walls before reaching the lower-right goal.

```python
bfs_frontier = deque([small_start])  # Use a queue because BFS visits shallower states before deeper states.
bfs_parent = {small_start: None}  # Store parents so the final shortest path can be reconstructed.
bfs_explored = set()  # Track expanded cells so no cell is expanded twice.
bfs_step = 0  # Count pops because each pop is one expansion snapshot.
while bfs_frontier:  # Continue until the queue is empty or the goal is popped.
    bfs_current = bfs_frontier.popleft()  # Pop the oldest frontier cell to enforce level-order traversal.
    if bfs_current in bfs_explored:  # Skip stale duplicates if a cell was already expanded.
        continue  # Continue because the earlier expansion already handled this cell optimally.
    bfs_explored.add(bfs_current)  # Mark the current cell as expanded because its outgoing edges are about to be considered.
    bfs_step += 1  # Advance the visualization step counter for the current pop.
    draw_grid(small_grid, small_start, small_goal, explored=bfs_explored, frontier=bfs_frontier, current=bfs_current, title=f"E1 BFS pop {bfs_step}: current={bfs_current}")  # Redraw after every pop so frontier and explored sets are visible.
    if bfs_current == small_goal:  # Stop immediately when BFS pops the goal because this path has minimum depth.
        break  # Break because no shallower path can remain undiscovered.
    for nxt in grid_neighbors(small_grid, bfs_current):  # Expand legal four-neighbor successors.
        if nxt not in bfs_parent:  # Add each state only the first time BFS discovers it.
            bfs_parent[nxt] = bfs_current  # Remember the predecessor that produced the shortest-step discovery.
            bfs_frontier.append(nxt)  # Push the new cell at the back so it waits behind current-depth cells.
```

▶ What you'll see: the light-blue explored region grows level by level, the yellow frontier forms a moving ring, and the red current cell advances one pop at a time.

```python
bfs_path = reconstruct_path(bfs_parent, small_start, small_goal)  # Reconstruct the shortest action-count path from BFS parents.
draw_grid(small_grid, small_start, small_goal, explored=bfs_explored, path=bfs_path, title="E1 result: BFS shortest path")  # Overlay the final BFS route.
print_metric("E1 path length in steps", len(bfs_path) - 1)  # Report number of actions because the grid is unweighted.
print_metric("E1 path cost", path_cost_grid(small_grid, bfs_path))  # Report cost too so the metric format matches later examples.
print_metric("E1 expanded cells", len(bfs_explored))  # Report search work because frontier strategy affects expansions.
```

▶ What you'll see: a green shortest path from start to goal; BFS may explore cells not on the final path because it proves no shorter path exists.

👀 **Takeaway:** BFS is optimal for equal nonnegative step costs because it expands all depth-$k$ states before any depth-$(k+1)$ state.

#### E2. DFS and why "first path found" need not be shortest

Goal: implement DFS from scratch on the same maze. DFS follows one branch deeply, so the first goal path can be much longer than BFS's shortest path.

```python
dfs_frontier = [small_start]  # Use a Python list as a stack because DFS needs last-in-first-out behavior.
dfs_parent = {small_start: None}  # Store the first predecessor chosen by the depth-first traversal.
dfs_explored = set()  # Track expanded cells so cycles do not cause infinite traversal.
dfs_step = 0  # Count stack pops for per-expansion visualization.
dfs_action_order = [(0, 1), (-1, 0), (1, 0), (0, -1)]  # Use a fixed order that makes DFS follow a tempting longer branch first.
while dfs_frontier:  # Continue until the stack empties or the goal is found.
    dfs_current = dfs_frontier.pop()  # Pop the most recently pushed cell to go deep before broad.
    if dfs_current in dfs_explored:  # Skip states already expanded by an earlier branch.
        continue  # Continue because graph-search DFS does not re-expand explored states.
    dfs_explored.add(dfs_current)  # Mark the state explored before pushing successors.
    dfs_step += 1  # Increment the visualization counter.
    draw_grid(small_grid, small_start, small_goal, explored=dfs_explored, frontier=dfs_frontier, current=dfs_current, title=f"E2 DFS pop {dfs_step}: current={dfs_current}")  # Redraw after every DFS expansion.
    if dfs_current == small_goal:  # Stop when the first goal is popped.
        break  # Break because this demonstrates DFS's first solution, not shortest-solution proof.
    dfs_neighbors = []  # Collect DFS successors in the custom order so the lesson visibly depends on action ordering.
    for dr, dc in dfs_action_order:  # Try actions in the chosen DFS order.
        candidate = (dfs_current[0] + dr, dfs_current[1] + dc)  # Compute the coordinate reached by this action.
        if in_bounds(small_grid, candidate) and passable(small_grid, candidate):  # Keep only legal non-wall successors.
            dfs_neighbors.append(candidate)  # Store the legal successor for stack insertion.
    for nxt in reversed(dfs_neighbors):  # Reverse successor order so the stack pops the first chosen action next.
        if nxt not in dfs_parent and nxt not in dfs_explored:  # Avoid adding known states so parent pointers stay simple.
            dfs_parent[nxt] = dfs_current  # Store the branch that first discovered the successor.
            dfs_frontier.append(nxt)  # Push onto the stack so this successor may be explored deeply soon.
```

▶ What you'll see: unlike BFS's ring, DFS creates a skinny explored trail that dives down one branch before backtracking.

```python
dfs_path = reconstruct_path(dfs_parent, small_start, small_goal)  # Reconstruct the first path DFS found to the goal.
draw_grid(small_grid, small_start, small_goal, explored=dfs_explored, path=dfs_path, title="E2 result: DFS first path")  # Plot DFS's path for direct visual inspection.
draw_grid(small_grid, small_start, small_goal, explored=bfs_explored, path=bfs_path, title="E2 reference: BFS shortest path")  # Plot BFS's path beside it in notebook output order.
print_metric("E2 DFS path length", len(dfs_path) - 1)  # Report DFS route length because first-found may be long.
print_metric("E2 BFS path length", len(bfs_path) - 1)  # Report BFS route length as the optimal unweighted comparison.
print_metric("E2 DFS expanded cells", len(dfs_explored))  # Report DFS work because it may expand fewer cells but lose optimality.
```

▶ What you'll see: DFS can find a green route quickly, but its route need not match the shorter BFS route.

👀 **Takeaway:** DFS is useful when memory is tight or any solution is acceptable, but plain DFS is not a shortest-path algorithm.

#### E3. Uniform cost search on a weighted road graph

Goal: implement UCS on a weighted directed graph. The priority queue stores $\operatorname{PastCost}(s)$, so the cheapest popped path is finalized when costs are nonnegative.

```python
road_edges = [("S", "A", 2), ("S", "B", 5), ("A", "C", 2), ("A", "D", 7), ("B", "D", 2), ("C", "G", 6), ("D", "G", 2), ("C", "D", 1)]  # Define a small nonnegative road network.
road_nodes = sorted({u for u, _, _ in road_edges} | {v for _, v, _ in road_edges})  # Collect node names from both edge endpoints.
road_graph = defaultdict(list)  # Build an adjacency list because UCS expands outgoing edges from each node.
for u, v, w in road_edges:  # Loop over directed weighted edges.
    road_graph[u].append((v, w))  # Store each successor with its travel cost.
road_pos = {"S": (0, 1), "A": (1, 2), "B": (1, 0), "C": (2, 2), "D": (2, 0.7), "G": (3, 1)}  # Fix positions for stable graph drawings.
draw_graph(road_nodes, road_edges, road_pos, title="E3 setup: weighted road graph")  # Show the graph before UCS starts.
```

▶ What you'll see: a directed weighted graph where the visually short route is not necessarily the cheapest route.

```python
ucs_counter = count()  # Create deterministic tie-break IDs so heap entries are comparable.
ucs_frontier = [(0, next(ucs_counter), "S")]  # Initialize UCS with past cost 0 at the start.
ucs_best = {"S": 0}  # Store the cheapest known past cost to every discovered node.
ucs_parent = {"S": None}  # Store predecessors for route reconstruction.
ucs_explored = set()  # Track finalized nodes because UCS finalizes nodes when popped.
ucs_step = 0  # Count pops to label snapshots.
while ucs_frontier:  # Continue while there are candidate paths to explore.
    ucs_cost, _, ucs_current = heapq.heappop(ucs_frontier)  # Pop the node with minimum known past cost.
    if ucs_current in ucs_explored:  # Skip stale heap entries created before a cheaper route was discovered.
        continue  # Continue because the finalized cost is already known.
    ucs_explored.add(ucs_current)  # Finalize this node's minimum past cost by the UCS invariant.
    ucs_step += 1  # Increment the visualization counter.
    ucs_labels = {n: f"g={ucs_best[n]}" for n in ucs_best}  # Label discovered nodes with their current best past costs.
    ucs_frontier_nodes = {item[2] for item in ucs_frontier}  # Convert heap entries to a node set for coloring.
    draw_graph(road_nodes, road_edges, road_pos, explored=ucs_explored, frontier=ucs_frontier_nodes, current=ucs_current, title=f"E3 UCS pop {ucs_step}: {ucs_current} with g={ucs_cost}", labels=ucs_labels)  # Redraw after every pop.
    if ucs_current == "G":  # Stop when the goal is finalized.
        break  # Break because UCS has proved this goal cost optimal under nonnegative edges.
    for nxt, weight in road_graph[ucs_current]:  # Relax every outgoing edge from the current node.
        new_cost = ucs_cost + weight  # Compute the candidate past cost through the current node.
        if new_cost < ucs_best.get(nxt, float("inf")):  # Keep the route only if it improves the best known cost.
            ucs_best[nxt] = new_cost  # Record the improved cost for labels and later relaxations.
            ucs_parent[nxt] = ucs_current  # Record the predecessor that achieved the improved cost.
            heapq.heappush(ucs_frontier, (new_cost, next(ucs_counter), nxt))  # Push the improved route into the priority queue.
```

▶ What you'll see: UCS may leave a node in yellow frontier until its lowest-cost route reaches the front of the heap.

```python
ucs_path = reconstruct_path(ucs_parent, "S", "G")  # Reconstruct the cheapest route found by UCS.
draw_graph(road_nodes, road_edges, road_pos, explored=ucs_explored, path=ucs_path, title="E3 result: UCS cheapest route", labels={n: f"g={ucs_best[n]}" for n in ucs_best})  # Highlight the optimal road path.
print_metric("E3 cheapest route", " -> ".join(ucs_path))  # Print the route in node order.
print_metric("E3 route cost", ucs_best["G"])  # Print the final UCS cost.
print_metric("E3 expanded nodes", len(ucs_explored))  # Print the number of finalized graph nodes.
```

▶ What you'll see: the green route follows the minimum total cost, not the fewest edges.

👀 **Takeaway:** UCS generalizes BFS from equal costs to nonnegative unequal costs by replacing the FIFO queue with a past-cost priority queue.

#### E4. Dynamic programming on an acyclic grid DAG

Goal: solve a monotone grid where actions only move right or down. Because the state graph is acyclic, we can fill $\operatorname{FutureCost}(s)$ backward from the goal.

```python
dp_costs = np.array([[1, 3, 2, 4], [2, 8, 1, 2], [4, 2, 1, 3], [3, 1, 2, 1]])  # Define the cost of entering each cell in a monotone grid.
dp_rows, dp_cols = dp_costs.shape  # Store dimensions because the backward loops need row and column limits.
dp_start = (0, 0)  # Set the start at the upper-left corner.
dp_goal = (dp_rows - 1, dp_cols - 1)  # Set the goal at the lower-right corner.
dp_future = np.full_like(dp_costs, fill_value=np.inf, dtype=float)  # Initialize future costs to infinity before dynamic programming.
dp_policy = {}  # Store the optimal successor from each state so arrows can be drawn.
dp_future[dp_goal] = 0  # The future cost at an end state is zero by definition.
fig, ax = plt.subplots()  # Create a figure for the raw cost table.
ax.imshow(dp_costs, cmap="YlOrBr")  # Show cell entry costs as a heatmap.
for r in range(dp_rows):  # Loop through rows to annotate numeric costs.
    for c in range(dp_cols):  # Loop through columns to annotate numeric costs.
        ax.text(c, r, str(dp_costs[r, c]), ha="center", va="center")  # Put the entry cost in the cell.
ax.set_title("E4 setup: monotone right/down entry costs")  # Title the setup plot.
plt.show()  # Display the raw cost grid.
```

▶ What you'll see: a small acyclic grid whose numbers are costs paid when entering cells.

```python
for r in reversed(range(dp_rows)):  # Fill from bottom to top because successors are down and right.
    for c in reversed(range(dp_cols)):  # Fill from right to left because right successors must be ready first.
        cell = (r, c)  # Package the current coordinate for dictionary keys.
        if cell == dp_goal:  # Skip the goal because its future cost is already defined as zero.
            continue  # Continue to the previous cell in reverse topological order.
        candidates = []  # Store possible successor choices and their total future values.
        for dr, dc, arrow in [(0, 1, "→"), (1, 0, "↓")]:  # Consider only right and down actions to keep the graph acyclic.
            nxt = (r + dr, c + dc)  # Compute the monotone successor.
            if 0 <= nxt[0] < dp_rows and 0 <= nxt[1] < dp_cols:  # Keep successors inside the grid.
                total = dp_costs[nxt] + dp_future[nxt]  # Apply Cost(s,a)+FutureCost(Succ(s,a)).
                candidates.append((total, nxt, arrow))  # Store the candidate for minimization and policy arrows.
        best_total, best_nxt, best_arrow = min(candidates)  # Choose the least expensive future among successors.
        dp_future[cell] = best_total  # Save the optimal future cost for this state.
        dp_policy[cell] = (best_nxt, best_arrow)  # Save the optimal successor for later path extraction.
        fig, ax = plt.subplots()  # Create a fresh table snapshot after this update.
        ax.imshow(dp_future, cmap="Blues")  # Plot the partially filled future-cost table.
        for rr in range(dp_rows):  # Loop over rows for labels.
            for cc in range(dp_cols):  # Loop over columns for labels.
                label = "∞" if np.isinf(dp_future[rr, cc]) else str(int(dp_future[rr, cc]))  # Format unknown cells as infinity.
                ax.text(cc, rr, label, ha="center", va="center")  # Annotate each table entry.
        ax.set_title(f"E4 DP update: FutureCost{cell} = {int(best_total)}")  # Explain which state was just solved.
        plt.show()  # Display the intermediate DP table.
```

▶ What you'll see: the future-cost table fills from the goal backward, exactly following the acyclic dependency order.

```python
dp_path = [dp_start]  # Start the optimal DP path at the initial state.
while dp_path[-1] != dp_goal:  # Follow policy arrows until the goal is reached.
    dp_path.append(dp_policy[dp_path[-1]][0])  # Append the best successor chosen by dynamic programming.
fig, ax = plt.subplots()  # Create a final policy figure.
ax.imshow(dp_costs, cmap="YlOrBr")  # Show entry costs behind the policy.
for r in range(dp_rows):  # Loop over rows to draw cost and policy labels.
    for c in range(dp_cols):  # Loop over columns to draw cost and policy labels.
        arrow = "G" if (r, c) == dp_goal else dp_policy.get((r, c), (None, ""))[1]  # Use G at the goal and arrows elsewhere.
        ax.text(c, r, f"{dp_costs[r,c]}\n{arrow}", ha="center", va="center")  # Show both local cost and optimal direction.
ax.plot([c for _, c in dp_path], [r for r, _ in dp_path], color="lime", linewidth=3)  # Overlay the optimal monotone path.
ax.set_title("E4 result: DP optimal policy and path")  # Title the final DP result.
plt.show()  # Display the policy and path.
print_metric("E4 optimal future cost from start", int(dp_future[dp_start]))  # Report the value produced by the recurrence.
print_metric("E4 path", dp_path)  # Print the coordinate path for verification.
print_metric("E4 expanded states", dp_rows * dp_cols)  # DP touches every state exactly once in this acyclic table.
```

▶ What you'll see: arrows point to the optimal successor from each cell, and the green line follows the cheapest right/down route.

👀 **Takeaway:** DP is backtracking plus memoization in topological order; it can use arbitrary costs but needs acyclicity.

#### E5. A* with Manhattan distance

Goal: implement A* on an open grid using $f(s)=g(s)+h(s)$, where $g$ is past cost and $h$ is Manhattan future-cost estimate.

```python
astar_grid, astar_start, astar_goal = make_grid(6, 8, walls=[], start=(0, 0), goal=(5, 7))  # Build an open grid where Manhattan distance matches the relaxed future cost.
draw_grid(astar_grid, astar_start, astar_goal, title="E5 setup: open grid for A* with Manhattan h")  # Show the grid before A* starts.
```

▶ What you'll see: an open rectangle where many shortest paths exist and the heuristic points directly toward the goal.

```python
astar_counter = count()  # Create stable tie-break IDs for equal f-values.
astar_frontier = [(manhattan(astar_start, astar_goal), next(astar_counter), 0, astar_start)]  # Push start with f=g+h and g=0.
astar_g = {astar_start: 0}  # Store best known past cost g for each discovered cell.
astar_parent = {astar_start: None}  # Store parent pointers for the best known route.
astar_explored = set()  # Store finalized cells popped from the priority queue.
astar_step = 0  # Count expansions for visualization.
while astar_frontier:  # Continue until the goal is popped or the frontier is exhausted.
    astar_f, _, astar_cost, astar_current = heapq.heappop(astar_frontier)  # Pop the cell with smallest f=g+h.
    if astar_current in astar_explored:  # Skip stale entries that no longer represent the best g.
        continue  # Continue because a better entry was already expanded.
    astar_explored.add(astar_current)  # Finalize the current cell under the consistent Manhattan heuristic.
    astar_step += 1  # Increment the expansion counter.
    astar_labels = {cell: f"g{astar_g[cell]}\nh{manhattan(cell, astar_goal)}\nf{astar_g[cell] + manhattan(cell, astar_goal)}" for cell in astar_g}  # Label discovered cells with g, h, and f.
    astar_frontier_cells = {item[3] for item in astar_frontier}  # Convert heap entries to cell coordinates for coloring.
    astar_partial_path = reconstruct_path(astar_parent, astar_start, astar_current)  # Show the best current path to the popped cell.
    draw_grid(astar_grid, astar_start, astar_goal, explored=astar_explored, frontier=astar_frontier_cells, current=astar_current, path=astar_partial_path, title=f"E5 A* pop {astar_step}: current={astar_current}, f={astar_f}", annotate_costs=astar_labels)  # Redraw each A* pop with labels.
    if astar_current == astar_goal:  # Stop when the goal is popped because consistent A* is optimal.
        break  # Break because no lower-cost goal path can remain in the frontier.
    for nxt in grid_neighbors(astar_grid, astar_current):  # Expand legal grid neighbors.
        new_g = astar_cost + grid_cost(astar_grid, nxt)  # Compute past cost through the current cell.
        if new_g < astar_g.get(nxt, float("inf")):  # Keep the new route only if it improves g.
            astar_g[nxt] = new_g  # Save the improved past cost.
            astar_parent[nxt] = astar_current  # Save the predecessor on the improved path.
            new_f = new_g + manhattan(nxt, astar_goal)  # Combine exact past cost with estimated future cost.
            heapq.heappush(astar_frontier, (new_f, next(astar_counter), new_g, nxt))  # Push the updated priority into the heap.
```

▶ What you'll see: cells display $g$, $h$, and $f$; A* prefers cells with low known cost plus low remaining Manhattan distance.

```python
astar_path = reconstruct_path(astar_parent, astar_start, astar_goal)  # Reconstruct the A* route from parent pointers.
draw_grid(astar_grid, astar_start, astar_goal, explored=astar_explored, path=astar_path, title="E5 result: A* path with Manhattan heuristic")  # Plot the final A* route.
print_metric("E5 path cost", path_cost_grid(astar_grid, astar_path))  # Report the optimal unit-cost route cost.
print_metric("E5 expanded cells", len(astar_explored))  # Report how much of the grid A* explored.
print_metric("E5 start heuristic", manhattan(astar_start, astar_goal))  # Report the heuristic estimate at the start.
```

▶ What you'll see: a green shortest path and usually fewer explored cells than exhaustive level-order search on a comparable grid.

👀 **Takeaway:** A* becomes UCS when $h=0$ and becomes more focused as a consistent heuristic approaches the true future cost.

### 🔴 Advanced Examples

#### A1. BFS vs. UCS vs. A* on the same weighted maze

Goal: compare frontier semantics on one problem with walls and mud. BFS minimizes steps, while UCS and A* minimize total cost.

```python
medium_walls = [(0, 4), (1, 1), (1, 4), (2, 1), (3, 1), (3, 3), (3, 4), (4, 6), (5, 2), (5, 6), (6, 2)]  # Define maze walls.
medium_mud = [(0, 2), (0, 3), (1, 3), (2, 3), (4, 3), (4, 4), (5, 4)]  # Define high-cost terrain that tempts short paths.
medium_grid, medium_start, medium_goal = make_grid(7, 8, walls=medium_walls, mud=medium_mud, start=(0, 0), goal=(6, 7))  # Build the shared weighted maze.
draw_grid(medium_grid, medium_start, medium_goal, title="A1 setup: weighted maze shared by BFS, UCS, and A*")  # Show the shared problem.
```

▶ What you'll see: a medium maze where brown mud makes the fewest-step path potentially more expensive.

```python
def run_grid_search(grid, start, goal, algorithm="bfs", heuristic=lambda cell: 0, show=True, prefix="search"):  # Define one runner so all algorithms use identical neighbor rules.
    parent = {start: None}  # Store best parent pointers for path reconstruction.
    explored = set()  # Store expanded cells for visualization and metrics.
    best = {start: 0}  # Store best known past cost for UCS and A* and depth for BFS.
    steps = 0  # Count expansions for fair comparison.
    tie = count()  # Create deterministic tie-breaks for heap-based algorithms.
    if algorithm == "bfs":  # Select FIFO behavior for BFS.
        frontier = deque([start])  # Initialize a queue with the start cell.
    else:  # Select priority-queue behavior for UCS and A*.
        frontier = [(heuristic(start), next(tie), 0, start)]  # Initialize a heap with f or g priority.
    while frontier:  # Continue until the frontier is empty or the goal is popped.
        if algorithm == "bfs":  # Pop according to BFS semantics.
            current = frontier.popleft()  # Remove the oldest queued state.
            cost_so_far = best[current]  # Treat best as step depth for BFS visualization.
        else:  # Pop according to UCS or A* semantics.
            _, _, cost_so_far, current = heapq.heappop(frontier)  # Remove the minimum-priority heap state.
        if current in explored:  # Skip duplicates that were already expanded.
            continue  # Continue because each state is expanded at most once here.
        explored.add(current)  # Mark the state expanded.
        steps += 1  # Increment expansion count.
        frontier_cells = set(frontier) if algorithm == "bfs" else {item[3] for item in frontier}  # Extract frontier cells for plotting.
        if show:  # Draw snapshots only when requested because comparisons can be verbose.
            draw_grid(grid, start, goal, explored=explored, frontier=frontier_cells, current=current, title=f"{prefix} {algorithm.upper()} pop {steps}: {current}")  # Redraw every expansion.
        if current == goal:  # Stop when the selected algorithm pops the goal.
            break  # Break because BFS has found fewest steps, UCS/A* have found lowest cost with valid assumptions.
        for nxt in grid_neighbors(grid, current):  # Expand legal neighbors.
            step_cost = 1 if algorithm == "bfs" else grid_cost(grid, nxt)  # BFS ignores weights while UCS/A* use terrain costs.
            new_cost = cost_so_far + step_cost  # Compute candidate past cost or candidate depth.
            if new_cost < best.get(nxt, float("inf")):  # Keep only improved discoveries.
                best[nxt] = new_cost  # Store improved past cost.
                parent[nxt] = current  # Store parent for the improved path.
                if algorithm == "bfs":  # Push BFS successors by FIFO order.
                    frontier.append(nxt)  # Add successor to the end of the queue.
                elif algorithm == "ucs":  # Push UCS successors by past cost.
                    heapq.heappush(frontier, (new_cost, next(tie), new_cost, nxt))  # Priority is g for UCS.
                else:  # Push A* successors by past plus future estimate.
                    heapq.heappush(frontier, (new_cost + heuristic(nxt), next(tie), new_cost, nxt))  # Priority is f=g+h for A*.
    path = reconstruct_path(parent, start, goal)  # Reconstruct the selected algorithm's final path.
    return {"path": path, "cost": path_cost_grid(grid, path), "score": best.get(goal, float("inf")), "expanded": len(explored), "explored": explored}  # Return metrics and explored set.
```

▶ What you'll see: no plot yet; this cell builds a reusable runner that can redraw every expansion for BFS, UCS, or A*.

```python
a1_bfs = run_grid_search(medium_grid, medium_start, medium_goal, algorithm="bfs", show=True, prefix="A1")  # Run BFS and redraw each node expansion.
a1_ucs = run_grid_search(medium_grid, medium_start, medium_goal, algorithm="ucs", show=True, prefix="A1")  # Run UCS and redraw each node expansion.
a1_astar = run_grid_search(medium_grid, medium_start, medium_goal, algorithm="astar", heuristic=lambda cell: manhattan(cell, medium_goal), show=True, prefix="A1")  # Run A* with Manhattan h and redraw each expansion.
```

▶ What you'll see: three expansion sequences; BFS spreads by depth, UCS avoids expensive mud when cost matters, and A* uses the heuristic to focus toward the goal.

```python
for name, result in [("BFS", a1_bfs), ("UCS", a1_ucs), ("A*", a1_astar)]:  # Loop over algorithms for comparable final plots.
    draw_grid(medium_grid, medium_start, medium_goal, explored=result["explored"], path=result["path"], title=f"A1 result: {name} path, cost={result['cost']}, expanded={result['expanded']}")  # Draw each final path.
fig, ax = plt.subplots(figsize=(6, 4))  # Create a compact bar chart for explored counts.
ax.bar(["BFS", "UCS", "A*"], [a1_bfs["expanded"], a1_ucs["expanded"], a1_astar["expanded"]], color=["skyblue", "orange", "green"])  # Compare search effort visually.
ax.set_ylabel("Expanded cells")  # Label the y-axis so the metric is clear.
ax.set_title("A1 explored-count comparison")  # Title the comparison plot.
plt.show()  # Display the bar chart.
print_metric("A1 BFS path cost", a1_bfs["cost"])  # Print BFS terrain cost even though BFS did not optimize it.
print_metric("A1 UCS path cost", a1_ucs["cost"])  # Print UCS cost for optimal weighted comparison.
print_metric("A1 A* path cost", a1_astar["cost"])  # Print A* cost to verify it matches UCS with a consistent heuristic.
```

▶ What you'll see: final paths plus a bar chart; A* should match UCS's optimal cost while often expanding fewer cells.

👀 **Takeaway:** changing the frontier priority changes the optimization objective and the amount of proof work done before reaching the goal.

#### A2. Heuristic strength: zero, Manhattan, Euclidean, max heuristic

Goal: compare admissible heuristics. Larger consistent heuristics often reduce expansions while preserving the same optimal cost.

```python
heuristics = {"zero": lambda cell: 0, "euclidean": lambda cell: euclidean(cell, medium_goal), "manhattan": lambda cell: manhattan(cell, medium_goal), "max(manhattan, diagonal)": lambda cell: max(manhattan(cell, medium_goal), diagonal_relaxed(cell, medium_goal))}  # Define several admissible heuristics for four-neighbor unit lower bounds.
for h_name, h_fn in heuristics.items():  # Visualize each heuristic before using it in A*.
    h_values = np.zeros(medium_grid.shape)  # Allocate a grid of heuristic values for heatmap plotting.
    for r in range(medium_grid.shape[0]):  # Loop over rows in the maze.
        for c in range(medium_grid.shape[1]):  # Loop over columns in the maze.
            h_values[r, c] = np.nan if medium_grid[r, c] == WALL else h_fn((r, c))  # Hide walls and compute h on open cells.
    fig, ax = plt.subplots()  # Create a heatmap figure for this heuristic.
    im = ax.imshow(h_values, cmap="viridis")  # Plot heuristic magnitude as color.
    fig.colorbar(im, ax=ax)  # Add a colorbar so values can be read quantitatively.
    ax.set_title(f"A2 heuristic heatmap: {h_name}")  # Title the heuristic plot.
    plt.show()  # Display the heatmap before running search.
```

▶ What you'll see: zero is flat, Euclidean is smooth, Manhattan is sharper on four-neighbor grids, and the max heuristic is at least as large as either component.

```python
a2_results = {}  # Store results so the table and plots can be generated after all runs.
for h_name, h_fn in heuristics.items():  # Run A* once for each heuristic.
    result = run_grid_search(medium_grid, medium_start, medium_goal, algorithm="astar", heuristic=h_fn, show=True, prefix=f"A2 {h_name}")  # Redraw each expansion for this heuristic.
    a2_results[h_name] = result  # Save metrics for comparison.
```

▶ What you'll see: stronger heuristics concentrate the yellow frontier and light-blue explored set closer to promising routes.

```python
for h_name, result in a2_results.items():  # Loop through heuristic results for final path plots.
    draw_grid(medium_grid, medium_start, medium_goal, explored=result["explored"], path=result["path"], title=f"A2 {h_name}: cost={result['cost']}, expanded={result['expanded']}")  # Show the final route for each heuristic.
print("heuristic | optimal cost | expanded")  # Print a simple table header.
for h_name, result in a2_results.items():  # Loop through results in insertion order.
    print(f"{h_name:24s} | {result['cost']:12.1f} | {result['expanded']:8d}")  # Print cost and expansion count for each heuristic.
```

▶ What you'll see: all admissible consistent heuristics preserve the optimal cost, but stronger ones typically expand fewer cells.

👀 **Takeaway:** A* gets faster when $h$ is closer to true future cost, as long as admissibility and consistency are not broken.

#### A3. Failure case: inadmissible heuristic breaks A* optimality

Goal: deliberately overestimate the optimal branch so A* returns a suboptimal path when it stops at the first popped goal.

```python
bad_edges = [("S", "A", 1), ("A", "G", 4), ("S", "B", 2), ("B", "G", 2)]  # Define a graph where S-A-G costs 5 and S-B-G costs 4.
bad_nodes = ["S", "A", "B", "G"]  # List nodes in a stable order for plotting.
bad_graph = defaultdict(list)  # Build an adjacency list for A* and UCS.
for u, v, w in bad_edges:  # Loop over directed edges.
    bad_graph[u].append((v, w))  # Store each outgoing neighbor with its cost.
bad_pos = {"S": (0, 0), "A": (1, 1), "B": (1, -1), "G": (2, 0)}  # Position nodes to show two competing branches.
bad_h = {"S": 0, "A": 0, "B": 100, "G": 0}  # Overestimate B badly even though B is on the true optimal path.
draw_graph(bad_nodes, bad_edges, bad_pos, title="A3 setup: inadmissible heuristic graph", labels={n: f"h={bad_h[n]}" for n in bad_nodes})  # Show the misleading heuristic.
```

▶ What you'll see: the true cheaper route goes through B, but B has an intentionally huge heuristic label.

```python
def graph_astar(graph, nodes, edges, pos, start_node, goal_node, heuristic, title_prefix):  # Implement graph A* for small weighted graphs.
    tie = count()  # Use deterministic tie-breaks in heap entries.
    frontier = [(heuristic[start_node], next(tie), 0, start_node)]  # Push the start with f=g+h.
    best = {start_node: 0}  # Track best known g-values.
    parent = {start_node: None}  # Track parent pointers for paths.
    explored = set()  # Track finalized nodes.
    step = 0  # Count pops for visualization.
    while frontier:  # Continue until the heap is empty or the goal is popped.
        f_value, _, g_value, current = heapq.heappop(frontier)  # Pop the minimum f node.
        if current in explored:  # Skip stale heap entries.
            continue  # Continue because the node was already finalized.
        explored.add(current)  # Mark the node finalized under the algorithm's rule.
        step += 1  # Increment the pop counter.
        frontier_nodes = {item[3] for item in frontier}  # Extract frontier nodes for plotting.
        labels = {n: f"g={best.get(n, '∞')}\nh={heuristic[n]}" for n in nodes}  # Label every node with known g and h.
        draw_graph(nodes, edges, pos, explored=explored, frontier=frontier_nodes, current=current, title=f"{title_prefix} pop {step}: {current}, f={f_value}", labels=labels)  # Redraw after each pop.
        if current == goal_node:  # Stop immediately when the goal is popped.
            break  # Break because this is the usual A* stopping rule, valid only with suitable heuristics.
        for nxt, weight in graph[current]:  # Relax outgoing edges.
            new_g = g_value + weight  # Compute candidate path cost to the successor.
            if new_g < best.get(nxt, float("inf")):  # Keep improved g-values.
                best[nxt] = new_g  # Save the better g-value.
                parent[nxt] = current  # Save the predecessor.
                heapq.heappush(frontier, (new_g + heuristic[nxt], next(tie), new_g, nxt))  # Push priority f=g+h.
    return reconstruct_path(parent, start_node, goal_node), best.get(goal_node, float("inf")), explored  # Return path, cost, and explored nodes.
bad_astar_path, bad_astar_cost, bad_astar_explored = graph_astar(bad_graph, bad_nodes, bad_edges, bad_pos, "S", "G", bad_h, "A3 inadmissible A*")  # Run the misleading A* search.
```

▶ What you'll see: A* avoids B because $h(B)=100$, pops G through A first, and stops with a cost-5 route.

```python
true_h = {n: 0 for n in bad_nodes}  # Use zero heuristic so A* becomes UCS and recovers the true optimum.
true_path, true_cost, true_explored = graph_astar(bad_graph, bad_nodes, bad_edges, bad_pos, "S", "G", true_h, "A3 UCS reference")  # Run UCS-style search for the true optimum.
draw_graph(bad_nodes, bad_edges, bad_pos, path=bad_astar_path, title="A3 result: suboptimal path from inadmissible A*", labels={"G": f"cost={bad_astar_cost}"})  # Highlight the bad A* path.
draw_graph(bad_nodes, bad_edges, bad_pos, path=true_path, title="A3 reference: optimal UCS path", labels={"G": f"cost={true_cost}"})  # Highlight the true optimal path.
print_metric("A3 inadmissible A* path", " -> ".join(bad_astar_path))  # Print the bad path.
print_metric("A3 inadmissible A* cost", bad_astar_cost)  # Print the bad cost.
print_metric("A3 true optimal path", " -> ".join(true_path))  # Print the optimal path.
print_metric("A3 true optimal cost", true_cost)  # Print the optimal cost.
```

▶ What you'll see: the inadmissible heuristic makes A* choose `S -> A -> G` even though `S -> B -> G` is cheaper.

👀 **Takeaway:** overestimating future cost can hide the optimal route; admissibility is not cosmetic, it protects correctness.

#### A4. Negative costs break UCS assumptions

Goal: show why UCS's popped-state invariant requires nonnegative action costs. A negative edge can reveal a cheaper route after a node has already been finalized.

```python
neg_edges = [("S", "A", 1), ("S", "B", 5), ("B", "A", -10), ("A", "G", 1), ("B", "G", 20)]  # Define a graph with one negative edge and no negative cycle.
neg_nodes = ["S", "A", "B", "G"]  # List nodes for plotting.
neg_graph = defaultdict(list)  # Build adjacency lists.
for u, v, w in neg_edges:  # Loop over weighted directed edges.
    neg_graph[u].append((v, w))  # Store successors and edge costs.
neg_pos = {"S": (0, 0), "A": (1, 1), "B": (1, -1), "G": (2, 0)}  # Position nodes to reveal the late negative shortcut.
draw_graph(neg_nodes, neg_edges, neg_pos, title="A4 setup: negative edge graph")  # Show the graph before UCS runs.
```

▶ What you'll see: node A is cheap directly, but an even cheaper route to A appears later through B using a negative edge.

```python
neg_tie = count()  # Create deterministic tie-breaks for UCS heap entries.
neg_frontier = [(0, next(neg_tie), "S")]  # Start UCS at S with cost zero.
neg_best = {"S": 0}  # Store best known costs.
neg_parent = {"S": None}  # Store parent pointers.
neg_explored = set()  # Store finalized nodes.
neg_step = 0  # Count pops.
while neg_frontier:  # Run ordinary UCS despite the invalid negative edge assumption.
    neg_cost, _, neg_current = heapq.heappop(neg_frontier)  # Pop the currently cheapest frontier node.
    if neg_current in neg_explored:  # Skip nodes already finalized.
        continue  # Continue because UCS assumes finalization is safe.
    neg_explored.add(neg_current)  # Finalize the node under the UCS rule.
    neg_step += 1  # Increment pop counter.
    labels = {n: f"g={neg_best.get(n, '∞')}" for n in neg_nodes}  # Label current best costs.
    draw_graph(neg_nodes, neg_edges, neg_pos, explored=neg_explored, frontier={item[2] for item in neg_frontier}, current=neg_current, title=f"A4 UCS pop {neg_step}: {neg_current}, g={neg_cost}", labels=labels)  # Redraw each pop.
    if neg_current == "G":  # Stop when UCS pops the goal.
        break  # Break to show the premature answer caused by invalid assumptions.
    for nxt, weight in neg_graph[neg_current]:  # Relax outgoing edges.
        new_cost = neg_cost + weight  # Compute the candidate cost.
        if nxt not in neg_explored and new_cost < neg_best.get(nxt, float("inf")):  # Ordinary UCS refuses to improve finalized nodes.
            neg_best[nxt] = new_cost  # Save the improved cost for non-finalized nodes.
            neg_parent[nxt] = neg_current  # Save predecessor.
            heapq.heappush(neg_frontier, (new_cost, next(neg_tie), nxt))  # Push the candidate route.
```

▶ What you'll see: UCS finalizes A early with cost 1, then never allows the later route `S -> B -> A` with cost -5 to repair A.

```python
relax_dist = {n: float("inf") for n in neg_nodes}  # Initialize Bellman-style distances to infinity.
relax_parent = {"S": None}  # Store parents for the relaxation reference.
relax_dist["S"] = 0  # Set the start distance to zero.
for _ in range(len(neg_nodes) - 1):  # Repeat relaxations enough times for shortest simple paths.
    for u, v, w in neg_edges:  # Check every edge on every pass.
        if relax_dist[u] + w < relax_dist[v]:  # Test whether the edge improves the destination.
            relax_dist[v] = relax_dist[u] + w  # Save the improved shortest distance.
            relax_parent[v] = u  # Save the predecessor that caused the improvement.
neg_ucs_path = reconstruct_path(neg_parent, "S", "G")  # Reconstruct the ordinary UCS path.
relax_path = reconstruct_path(relax_parent, "S", "G")  # Reconstruct the relaxation reference path.
draw_graph(neg_nodes, neg_edges, neg_pos, path=neg_ucs_path, title="A4 result: UCS path under invalid assumption", labels={"G": f"g={neg_best.get('G', '∞')}"})  # Plot the UCS answer.
draw_graph(neg_nodes, neg_edges, neg_pos, path=relax_path, title="A4 reference: repeated relaxation path", labels={"G": f"g={relax_dist['G']}"})  # Plot the corrected answer.
print_metric("A4 UCS returned cost", neg_best.get("G", float("inf")))  # Print the invalid UCS result.
print_metric("A4 relaxation shortest cost", relax_dist["G"])  # Print the true shortest cost.
print_metric("A4 relaxation path", " -> ".join(relax_path))  # Print the true path.
```

▶ What you'll see: repeated relaxation finds the cheaper negative-edge route, while UCS's finalized explored set prevents correction.

👀 **Takeaway:** UCS's invariant is a theorem under nonnegative costs; violate the assumption and the explored set may lock in wrong answers.

#### A5. Relaxation-derived heuristics for a blocked grid

Goal: derive a heuristic by relaxing a blocked grid so diagonal moves are allowed. We then check admissibility-like values against true costs and use the heuristic in A*.

```python
relax_walls = [(1, 1), (1, 2), (2, 4), (3, 1), (3, 4), (4, 4), (5, 2)]  # Define walls that make the real four-neighbor path bend.
relax_grid, relax_start, relax_goal = make_grid(6, 7, walls=relax_walls, start=(0, 0), goal=(5, 6))  # Build the blocked grid.
draw_grid(relax_grid, relax_start, relax_goal, title="A5 setup: blocked grid for relaxed diagonal heuristic")  # Show the real problem constraints.
```

▶ What you'll see: walls force detours in the real problem, but the relaxed problem will ignore some movement restrictions by allowing diagonals.

```python
relax_h = {}  # Store relaxed heuristic values for every traversable cell.
for r in range(relax_grid.shape[0]):  # Loop through grid rows.
    for c in range(relax_grid.shape[1]):  # Loop through grid columns.
        cell = (r, c)  # Package the coordinate as a state.
        if passable(relax_grid, cell):  # Define h only on real traversable states.
            relax_h[cell] = diagonal_relaxed(cell, relax_goal)  # Use relaxed diagonal unit-move distance to the goal.
fig, ax = plt.subplots()  # Create a heatmap for the relaxed future cost.
heat = np.full(relax_grid.shape, np.nan)  # Use NaN for walls so they plot as blank-ish cells.
for cell, value in relax_h.items():  # Transfer heuristic dictionary into an array for plotting.
    heat[cell] = value  # Store the relaxed future cost in the corresponding cell.
im = ax.imshow(heat, cmap="magma")  # Plot relaxed heuristic values.
fig.colorbar(im, ax=ax)  # Add a colorbar for numeric scale.
for cell, value in relax_h.items():  # Annotate traversable cells with exact h values.
    ax.text(cell[1], cell[0], str(int(value)), ha="center", va="center", color="white")  # Place h in each cell.
ax.set_title("A5 relaxed future-cost heuristic: diagonal moves allowed")  # Title the heatmap.
plt.show()  # Display the relaxed heuristic heatmap.
```

▶ What you'll see: a heatmap of the diagonal-move relaxed distance, which is no larger than the real four-neighbor future cost.

```python
consistency_violations = []  # Collect violations so we can explicitly verify consistency on real edges.
for cell, h_value in relax_h.items():  # Check every real traversable state.
    for nxt in grid_neighbors(relax_grid, cell):  # Check every real four-neighbor action.
        if h_value > grid_cost(relax_grid, nxt) + relax_h[nxt]:  # Test the consistency inequality h(s) <= cost + h(successor).
            consistency_violations.append((cell, nxt))  # Record any violation for diagnosis.
a5_result = run_grid_search(relax_grid, relax_start, relax_goal, algorithm="astar", heuristic=lambda cell: relax_h[cell], show=True, prefix="A5 relaxed-h")  # Run A* with the relaxation-derived heuristic.
```

▶ What you'll see: A* expands cells using a heuristic derived from an easier problem; each pop still respects the real walls and real movement rules.

```python
a5_ucs = run_grid_search(relax_grid, relax_start, relax_goal, algorithm="ucs", show=False, prefix="A5 UCS check")  # Run UCS silently to verify the optimal cost.
draw_grid(relax_grid, relax_start, relax_goal, explored=a5_result["explored"], path=a5_result["path"], title="A5 result: A* with relaxed diagonal heuristic")  # Show the final A* path.
print_metric("A5 consistency violations", len(consistency_violations))  # Print zero when the relaxed heuristic is consistent on real edges.
print_metric("A5 A* path cost", a5_result["cost"])  # Print the A* path cost.
print_metric("A5 UCS reference cost", a5_ucs["cost"])  # Print the UCS reference cost for correctness.
print_metric("A5 A* expanded cells", a5_result["expanded"])  # Print A* work.
print_metric("A5 UCS expanded cells", a5_ucs["expanded"])  # Print UCS work for comparison.
```

▶ What you'll see: the A* path cost matches UCS, consistency violations are zero, and the relaxed heuristic usually reduces expansions.

👀 **Takeaway:** relaxation creates safe heuristics by solving an easier problem whose costs never exceed the original problem's costs.

### Interactive Experiment

Use sliders and dropdowns to change the algorithm, heuristic weight, and obstacle density. The code regenerates a reproducible grid and redraws the final explored set and path.

```python
def random_grid(rows=10, cols=10, density=0.2, seed_value=0):  # Build a reproducible random obstacle grid for the experiment.
    rng = np.random.default_rng(seed_value)  # Use a local generator so slider changes do not disturb earlier examples.
    walls = []  # Start with no walls and add sampled blocked cells below.
    for r in range(rows):  # Loop over rows in the candidate grid.
        for c in range(cols):  # Loop over columns in the candidate grid.
            cell = (r, c)  # Package the coordinate for filtering.
            if cell not in [(0, 0), (rows - 1, cols - 1)] and rng.random() < density:  # Avoid blocking start or goal while sampling walls.
                walls.append(cell)  # Add this cell to the wall list.
    return make_grid(rows, cols, walls=walls, start=(0, 0), goal=(rows - 1, cols - 1))  # Return a complete grid problem.
def experiment(algorithm="astar", heuristic_weight=1.0, obstacle_density=0.20, seed_value=4):  # Define the interactive callback used by widgets.
    exp_grid, exp_start, exp_goal = random_grid(density=obstacle_density, seed_value=seed_value)  # Generate the current random grid.
    h_fn = lambda cell: heuristic_weight * manhattan(cell, exp_goal)  # Scale Manhattan distance to explore safe and unsafe weights.
    alg = "astar" if algorithm == "weighted_astar" else algorithm  # Reuse the runner's A* branch for weighted-A* experiments.
    result = run_grid_search(exp_grid, exp_start, exp_goal, algorithm=alg, heuristic=h_fn, show=False, prefix="interactive")  # Run without per-pop plots for responsiveness.
    draw_grid(exp_grid, exp_start, exp_goal, explored=result["explored"], path=result["path"], title=f"Interactive {algorithm}: cost={result['cost']}, expanded={result['expanded']}")  # Show final explored set and route.
    print_metric("algorithm", algorithm)  # Print the chosen frontier rule.
    print_metric("heuristic weight", heuristic_weight)  # Print the h multiplier because weights above 1 can break optimality.
    print_metric("obstacle density", obstacle_density)  # Print the sampled wall density.
if widgets is None:  # Check whether ipywidgets imported successfully.
    experiment()  # Run one static experiment so non-widget environments still produce output.
else:  # Build actual sliders and dropdowns in Colab.
    widgets.interact(experiment, algorithm=widgets.Dropdown(options=["bfs", "ucs", "astar", "weighted_astar"], value="astar", description="algorithm"), heuristic_weight=widgets.FloatSlider(value=1.0, min=0.0, max=3.0, step=0.25, description="h weight"), obstacle_density=widgets.FloatSlider(value=0.20, min=0.0, max=0.45, step=0.05, description="walls"), seed_value=widgets.IntSlider(value=4, min=0, max=20, step=1, description="seed"))  # Display live controls for algorithm behavior.
```

▶ What you'll see: a live grid where the explored area and path change as the frontier rule, heuristic weight, and obstacle density change; weights above 1 can speed up search but may sacrifice optimality.
