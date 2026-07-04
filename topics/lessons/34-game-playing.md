# Game Playing: Minimax & Games
> **Source:** CS 221 · **Category:** Method/Algorithm · **Type:** ⚖️ Both · [↑ Full reference](../../ai-ml-cheatsheets.md)
> 📓 The coded examples form a runnable notebook section; an .ipynb will be generated.

## 1. Overview

Game playing studies decisions made in the presence of other agents. A game state is not valuable only because of what **we** can do next; it is valuable because of what our opponent, chance, or another strategic player can do after that.

**One-line intuition:** search plans through the world, while game search plans through another decision maker.

This lesson covers the central CS 221 game-playing ideas: game trees, minimax, alpha-beta pruning, expectimax, evaluation functions, and Nash equilibrium. We will first back up tiny trees by hand, then implement exact minimax and alpha-beta pruning from scratch, visualize propagated values and pruned branches, and finish with simultaneous zero-sum mixed strategies.

## 2. Key Idea

A deterministic, fully observed, alternating, two-player zero-sum game is described by

$$
\left(s_{\text{start}}, \operatorname{Actions}, \operatorname{Succ}, \operatorname{IsEnd}, \operatorname{Utility}, \operatorname{Player}\right).
$$

The ingredients are:

- $s_{\text{start}}$: the initial state.
- $\operatorname{Actions}(s)$: legal actions from state $s$.
- $\operatorname{Succ}(s,a)$: the next state after action $a$.
- $\operatorname{IsEnd}(s)$: whether the game has ended.
- $\operatorname{Utility}(s)$: the agent's terminal payoff.
- $\operatorname{Player}(s)\in\{\text{agent},\text{opp}\}$: whose turn it is.

Because the game is zero-sum, the opponent's utility is the negative of the agent's utility. Therefore the agent tries to maximize the backed-up value, while the opponent tries to minimize it.

### Minimax value recursion

The minimax value is

$$
V_{\text{minimax}}(s)=
\begin{cases}
\operatorname{Utility}(s), & \operatorname{IsEnd}(s),\\[4pt]
\max\limits_{a\in\operatorname{Actions}(s)}V_{\text{minimax}}(\operatorname{Succ}(s,a)), & \operatorname{Player}(s)=\text{agent},\\[8pt]
\min\limits_{a\in\operatorname{Actions}(s)}V_{\text{minimax}}(\operatorname{Succ}(s,a)), & \operatorname{Player}(s)=\text{opp}.
\end{cases}
$$

From the value, optimal deterministic policies are extracted by

$$
\pi_{\max}(s)=\operatorname*{argmax}_{a\in\operatorname{Actions}(s)}V_{\text{minimax}}(\operatorname{Succ}(s,a))
$$

for the agent and

$$
\pi_{\min}(s)=\operatorname*{argmin}_{a\in\operatorname{Actions}(s)}V_{\text{minimax}}(\operatorname{Succ}(s,a))
$$

for the adversary.

**Pseudocode: minimax.**

```text
Minimax(s):
    if IsEnd(s):
        return Utility(s)
    if Player(s) == agent:
        best <- -infinity
        for action a in Actions(s):
            best <- max(best, Minimax(Succ(s, a)))
        return best
    if Player(s) == opp:
        best <- +infinity
        for action a in Actions(s):
            best <- min(best, Minimax(Succ(s, a)))
        return best
```

### Alpha-beta pruning

Minimax can be exact but expensive. If every state has branching factor $b$ and we search to depth $d$, then the plain tree size is approximately

$$
1+b+b^2+\cdots+b^d=\frac{b^{d+1}-1}{b-1}=\Theta(b^d).
$$

Alpha-beta pruning returns the **same** minimax value while skipping branches that cannot affect the final decision.

- $\alpha$ is the best value already guaranteed to the maximizing player along the current path.
- $\beta$ is the best value already guaranteed to the minimizing player along the current path.
- When $\alpha\ge \beta$, the current branch cannot change an ancestor's choice, so it can be pruned.

**Pseudocode: alpha-beta minimax.**

```text
AlphaBeta(s, alpha, beta):
    if IsEnd(s):
        return Utility(s)
    if Player(s) == agent:
        value <- -infinity
        for action a in Actions(s):
            value <- max(value, AlphaBeta(Succ(s, a), alpha, beta))
            alpha <- max(alpha, value)
            if alpha >= beta:
                break  # beta cutoff
        return value
    if Player(s) == opp:
        value <- +infinity
        for action a in Actions(s):
            value <- min(value, AlphaBeta(Succ(s, a), alpha, beta))
            beta <- min(beta, value)
            if alpha >= beta:
                break  # alpha cutoff
        return value
```

With excellent move ordering, alpha-beta often behaves like searching about $O(b^{d/2})$ nodes rather than $O(b^d)$ nodes. With poor ordering, it may still explore nearly the full tree, but it is never wrong.

### Expectimax

Minimax assumes the opponent is perfectly adversarial. If the opponent policy $\pi_{\text{opp}}(s,a)$ is fixed and known, the correct backup at opponent states is an expectation rather than a minimum:

$$
V_{\text{expectimax}}(s)=
\begin{cases}
\operatorname{Utility}(s), & \operatorname{IsEnd}(s),\\[4pt]
\max\limits_{a\in\operatorname{Actions}(s)}V_{\text{expectimax}}(\operatorname{Succ}(s,a)), & \operatorname{Player}(s)=\text{agent},\\[8pt]
\sum\limits_{a\in\operatorname{Actions}(s)}\pi_{\text{opp}}(s,a)V_{\text{expectimax}}(\operatorname{Succ}(s,a)), & \operatorname{Player}(s)=\text{opp}.
\end{cases}
$$

This is the game-tree analogue of an MDP expectation backup.

### Evaluation functions and depth limits

Large games are too deep to search to terminal states. We stop at a cutoff depth and use an approximate evaluation function:

$$
V_D(s)=
\begin{cases}
\operatorname{Utility}(s), & \operatorname{IsEnd}(s),\\[4pt]
\operatorname{Eval}(s), & D=0,\\[4pt]
\max\limits_a V_{D-1}(\operatorname{Succ}(s,a)), & \operatorname{Player}(s)=\text{agent},\\[8pt]
\min\limits_a V_{D-1}(\operatorname{Succ}(s,a)), & \operatorname{Player}(s)=\text{opp}.
\end{cases}
$$

For a board game, $\operatorname{Eval}(s)$ might be a weighted feature score such as

$$
\operatorname{Eval}(s)=w_1\cdot(\text{open winning lines for X})-w_2\cdot(\text{open winning lines for O})+w_3\cdot(\text{center control}).
$$

If the evaluation is good, shallow search can play well. If it is biased, depth-limited minimax can confidently choose bad moves.

### Simultaneous games and Nash equilibrium

In a one-move simultaneous game, player $A$ chooses $a$, player $B$ chooses $b$, and $A$ receives payoff $V(a,b)$. If both players use mixed strategies $\pi_A$ and $\pi_B$, then

$$
V(\pi_A,\pi_B)=\sum_{a,b}\pi_A(a)\pi_B(b)V(a,b).
$$

For finite zero-sum games, the minimax theorem states

$$
\max_{\pi_A}\min_{\pi_B}V(\pi_A,\pi_B)=\min_{\pi_B}\max_{\pi_A}V(\pi_A,\pi_B).
$$

For non-zero-sum games with utilities $V_A,V_B$, a Nash equilibrium $(\pi_A^*,\pi_B^*)$ satisfies

$$
\forall \pi_A,\quad V_A(\pi_A^*,\pi_B^*)\ge V_A(\pi_A,\pi_B^*)
$$

and

$$
\forall \pi_B,\quad V_B(\pi_A^*,\pi_B^*)\ge V_B(\pi_A^*,\pi_B).
$$

No player can improve by unilaterally deviating.

## 3. Worked Examples

### 🟢 Basics (warm-up)

#### B1. Read the utility of one terminal leaf

Goal: evaluate a terminal state without recursion.

Suppose $s_L$ is terminal and its utility for the agent is $+3$.

Because $\operatorname{IsEnd}(s_L)=\text{true}$, the minimax recurrence immediately uses the first case:

$$
V_{\text{minimax}}(s_L)=\operatorname{Utility}(s_L).
$$

Substitute the given utility:

$$
V_{\text{minimax}}(s_L)=3.
$$

Therefore the backed-up value of this leaf is

$$
\boxed{3}.
$$

Interpretation: no player moves at a terminal state; its value is simply the final score.

#### B2. Back up one max node over two children

Goal: compute one agent-controlled backup.

Let state $s$ be controlled by the agent, with two actions leading to child values

$$
V(s_1)=1,\qquad V(s_2)=5.
$$

Since $\operatorname{Player}(s)=\text{agent}$,

$$
V(s)=\max_{a\in\operatorname{Actions}(s)}V(\operatorname{Succ}(s,a)).
$$

There are two actions, so

$$
V(s)=\max\{V(s_1),V(s_2)\}.
$$

Substitute the child values:

$$
V(s)=\max\{1,5\}=5.
$$

The maximizing action is the action leading to $s_2$:

$$
\pi_{\max}(s)=\operatorname*{argmax}_{a\in\{a_1,a_2\}}V(\operatorname{Succ}(s,a))=a_2.
$$

Thus

$$
\boxed{V(s)=5,\quad \pi_{\max}(s)=a_2}.
$$

#### B3. Back up one min node over two children

Goal: compute one opponent-controlled backup.

Let state $s$ be controlled by the opponent, with child values

$$
V(s_1)=4,\qquad V(s_2)=-2.
$$

Since $\operatorname{Player}(s)=\text{opp}$,

$$
V(s)=\min_{a\in\operatorname{Actions}(s)}V(\operatorname{Succ}(s,a)).
$$

There are two actions, so

$$
V(s)=\min\{V(s_1),V(s_2)\}.
$$

Substitute:

$$
V(s)=\min\{4,-2\}=-2.
$$

The minimizing opponent chooses the action leading to $s_2$:

$$
\pi_{\min}(s)=\operatorname*{argmin}_{a\in\{a_1,a_2\}}V(\operatorname{Succ}(s,a))=a_2.
$$

Therefore

$$
\boxed{V(s)=-2,\quad \pi_{\min}(s)=a_2}.
$$

### 🟡 Easy

Before the first coded example, we set up the notebook-style environment and swappable data sources. Run the following two blocks first, then run the coded examples in order.

#### Setup

```python
import numpy as np  # Import NumPy so boards, payoff grids, and random utilities are easy to store.
import matplotlib.pyplot as plt  # Import Matplotlib so every algorithm can produce a visual check.
from dataclasses import dataclass  # Import dataclass so toy game-tree nodes are compact and readable.
from functools import lru_cache  # Import lru_cache so recursive tic-tac-toe searches can memoize repeated states.
from math import inf  # Import infinity so minimax and alpha-beta have clean initial bounds.
try:  # Try to import widgets because the final experiment is interactive in notebooks.
    from ipywidgets import interact, IntSlider  # Import interact and slider controls for Colab/Jupyter.
    HAVE_WIDGETS = True  # Record that widget support is available.
except Exception:  # Fall back gracefully in plain Python environments without widgets.
    interact = None  # Store a neutral placeholder so later code can test widget availability.
    IntSlider = None  # Store a neutral placeholder so later code can test widget availability.
    HAVE_WIDGETS = False  # Record that widget support is unavailable.
np.random.seed(22134)  # Fix the random seed so all random trees and plots are reproducible.

@dataclass(frozen=True)  # Make game-tree nodes immutable so they can be safely reused.
class TreeNode:  # Define a small generic tree node for minimax and alpha-beta examples.
    name: str  # Store a label that will appear in printed traces and plots.
    player: str  # Store "max", "min", or "leaf" to choose the correct backup rule.
    utility: object = None  # Store the terminal utility when this node is a leaf.
    children: tuple = ()  # Store child nodes in left-to-right move order.

def is_leaf(node):  # Define a helper that recognizes terminal tree nodes.
    return node.player == "leaf"  # A leaf node has no player move and directly stores utility.

def minimax_tree(node, counts=None):  # Define plain minimax on a generic finite tree.
    if counts is not None:  # Check whether the caller asked to count visited nodes.
        counts["nodes"] += 1  # Count this node because minimax has now inspected it.
    if is_leaf(node):  # Stop recursion when a terminal utility is reached.
        return float(node.utility)  # Return the leaf utility as a numeric value.
    child_values = [minimax_tree(child, counts) for child in node.children]  # Recursively value every child.
    if node.player == "max":  # Use the maximizing backup at agent-controlled nodes.
        return max(child_values)  # Return the best child value for the agent.
    return min(child_values)  # Use the minimizing backup at opponent-controlled nodes.

def alphabeta_tree(node, alpha=-inf, beta=inf, counts=None, pruned=None):  # Define exact minimax with pruning.
    if counts is not None:  # Check whether the caller asked to count expanded nodes.
        counts["nodes"] += 1  # Count this node because alpha-beta has inspected it.
    if pruned is None:  # Check whether the caller supplied a list of pruned labels.
        pruned = []  # Create a list that will record skipped child subtrees.
    if is_leaf(node):  # Stop recursion when the game is already over.
        return float(node.utility), pruned  # Return the exact terminal utility and current prune list.
    if node.player == "max":  # Handle the agent's turn with a maximum backup.
        value = -inf  # Start below every possible value so the first child improves it.
        for index, child in enumerate(node.children):  # Visit children in the current move order.
            child_value, pruned = alphabeta_tree(child, alpha, beta, counts, pruned)  # Recursively value one child.
            value = max(value, child_value)  # Keep the best value found for the maximizer.
            alpha = max(alpha, value)  # Tighten the maximizer's guaranteed lower bound.
            if alpha >= beta:  # Detect that the minimizer already has a better option elsewhere.
                pruned.extend(grand.name for grand in node.children[index + 1:])  # Record skipped siblings.
                break  # Stop exploring siblings because they cannot affect the root value.
        return value, pruned  # Return the exact value and the skipped subtree labels.
    value = inf  # Start above every possible value so the first child improves it for the minimizer.
    for index, child in enumerate(node.children):  # Visit opponent responses in the current order.
        child_value, pruned = alphabeta_tree(child, alpha, beta, counts, pruned)  # Recursively value one child.
        value = min(value, child_value)  # Keep the worst value for the agent.
        beta = min(beta, value)  # Tighten the minimizer's guaranteed upper bound.
        if alpha >= beta:  # Detect that the maximizer already has a better option elsewhere.
            pruned.extend(grand.name for grand in node.children[index + 1:])  # Record skipped siblings.
            break  # Stop exploring siblings because they cannot affect the root value.
    return value, pruned  # Return the exact value and the skipped subtree labels.

def board_to_tuple(board):  # Convert a mutable NumPy board into a hashable tuple representation.
    return tuple(tuple(row) for row in board)  # Tuples can be used by lru_cache while arrays cannot.

def tuple_to_board(state):  # Convert a cached tuple state back into a NumPy board.
    return np.array(state, dtype="<U1")  # Use one-character strings for X, O, and empty cells.

def legal_moves_state(state):  # List empty cells in a tic-tac-toe state.
    board = tuple_to_board(state)  # Convert the state into a convenient array.
    return [(r, c) for r in range(3) for c in range(3) if board[r, c] == "."]  # Return coordinates of empty cells.

def winner_state(state):  # Determine whether X, O, or nobody has won a tic-tac-toe state.
    board = tuple_to_board(state)  # Convert the cached state into a 3-by-3 board.
    lines = []  # Prepare a list of all rows, columns, and diagonals.
    lines.extend([list(board[r, :]) for r in range(3)])  # Add each row as a possible winning line.
    lines.extend([list(board[:, c]) for c in range(3)])  # Add each column as a possible winning line.
    lines.append([board[0, 0], board[1, 1], board[2, 2]])  # Add the main diagonal.
    lines.append([board[0, 2], board[1, 1], board[2, 0]])  # Add the anti-diagonal.
    for line in lines:  # Check each possible winning line.
        if line == ["X", "X", "X"]:  # Detect an X win.
            return "X"  # Return the maximizing player's mark.
        if line == ["O", "O", "O"]:  # Detect an O win.
            return "O"  # Return the minimizing player's mark.
    return None  # Return no winner if no line is complete.

def terminal_utility_state(state):  # Return utility for terminal states and None otherwise.
    winner = winner_state(state)  # Check whether either player has already won.
    if winner == "X":  # X is the maximizing player in our examples.
        return 1.0  # Reward an X win with positive utility.
    if winner == "O":  # O is the minimizing opponent.
        return -1.0  # Penalize an O win with negative utility.
    if len(legal_moves_state(state)) == 0:  # Check for a full board with no winner.
        return 0.0  # Score a draw as zero utility.
    return None  # Mark non-terminal states as needing more search.

def next_state(state, move, player):  # Apply one legal tic-tac-toe move.
    board = tuple_to_board(state)  # Convert to a mutable array.
    board[move] = player  # Place the current player's mark in the chosen empty cell.
    return board_to_tuple(board)  # Return the new board in cached tuple form.

@lru_cache(None)  # Cache exact values because different move orders can reach identical boards.
def minimax_ttt(state, player):  # Compute exact tic-tac-toe minimax value for X versus O.
    terminal = terminal_utility_state(state)  # Check whether recursion has reached a finished board.
    if terminal is not None:  # If the state is terminal, no further moves are allowed.
        return terminal  # Return win, loss, or draw utility.
    moves = legal_moves_state(state)  # Enumerate legal actions for the current player.
    values = [minimax_ttt(next_state(state, move, player), "O" if player == "X" else "X") for move in moves]  # Value each successor.
    if player == "X":  # X is the maximizing player.
        return max(values)  # X chooses the child with largest utility.
    return min(values)  # O chooses the child with smallest utility for X.

def best_ttt_moves(state, player):  # Return all legal tic-tac-toe moves and their minimax values.
    moves = legal_moves_state(state)  # Enumerate legal actions before evaluating them.
    values = []  # Prepare a list of action-value pairs.
    for move in moves:  # Evaluate every legal move.
        child = next_state(state, move, player)  # Build the successor board.
        next_player = "O" if player == "X" else "X"  # Alternate turns after the move.
        values.append((move, minimax_ttt(child, next_player)))  # Store the move and its exact child value.
    return values  # Return the action-value table.

def plot_board(board, title="Tic-tac-toe", highlight=None, scores=None):  # Draw a tic-tac-toe board with optional scores.
    fig, ax = plt.subplots(figsize=(4, 4))  # Create a square figure for the board.
    ax.set_xlim(0, 3)  # Set horizontal board limits.
    ax.set_ylim(0, 3)  # Set vertical board limits.
    ax.set_xticks([])  # Hide numeric x-axis ticks because cells are self-explanatory.
    ax.set_yticks([])  # Hide numeric y-axis ticks because cells are self-explanatory.
    for k in range(4):  # Draw the four vertical and horizontal grid lines.
        ax.plot([k, k], [0, 3], color="black", linewidth=2)  # Draw one vertical grid line.
        ax.plot([0, 3], [k, k], color="black", linewidth=2)  # Draw one horizontal grid line.
    if highlight is not None:  # Check whether a recommended move should be highlighted.
        r, c = highlight  # Unpack the highlighted move coordinates.
        rect = plt.Rectangle((c, 2 - r), 1, 1, color="lightgreen", alpha=0.5)  # Create a translucent cell marker.
        ax.add_patch(rect)  # Add the marker beneath text.
    for r in range(3):  # Loop over board rows.
        for c in range(3):  # Loop over board columns.
            mark = board[r, c]  # Read the mark in this cell.
            if mark != ".":  # Existing pieces should be shown as large letters.
                ax.text(c + 0.5, 2.5 - r, mark, ha="center", va="center", fontsize=28)  # Draw X or O.
            elif scores is not None and (r, c) in scores:  # Empty cells may show action values.
                ax.text(c + 0.5, 2.5 - r, f"{scores[(r, c)]:.0f}", ha="center", va="center", fontsize=18)  # Draw move score.
    ax.set_title(title)  # Add the plot title.
    plt.show()  # Display the board.

def open_lines_eval_state(state):  # Score a tic-tac-toe board with a simple feature-based evaluation.
    board = tuple_to_board(state)  # Convert state into a board for line scanning.
    lines = []  # Prepare all potentially winning lines.
    lines.extend([list(board[r, :]) for r in range(3)])  # Add rows.
    lines.extend([list(board[:, c]) for c in range(3)])  # Add columns.
    lines.append([board[0, 0], board[1, 1], board[2, 2]])  # Add main diagonal.
    lines.append([board[0, 2], board[1, 1], board[2, 0]])  # Add anti-diagonal.
    x_open = sum("O" not in line for line in lines)  # Count lines where X could still win.
    o_open = sum("X" not in line for line in lines)  # Count lines where O could still win.
    center = 0.5 if board[1, 1] == "X" else (-0.5 if board[1, 1] == "O" else 0.0)  # Reward X center control.
    return float(x_open - o_open + center)  # Combine features into one approximate value.

def depth_limited_ttt(state, player, depth):  # Compute depth-limited minimax with the feature evaluation.
    terminal = terminal_utility_state(state)  # Check for exact terminal utility first.
    if terminal is not None:  # Terminal states should not be approximated.
        return 100.0 * terminal  # Scale wins and losses above heuristic line-count scores.
    if depth == 0:  # At the cutoff, stop expanding the tree.
        return open_lines_eval_state(state)  # Use the evaluation function as a value estimate.
    moves = legal_moves_state(state)  # Enumerate legal actions from this state.
    values = [depth_limited_ttt(next_state(state, move, player), "O" if player == "X" else "X", depth - 1) for move in moves]  # Value each child.
    if player == "X":  # X maximizes the evaluation.
        return max(values)  # Return the best child score.
    return min(values)  # O minimizes the evaluation.

def plot_tree_levels(levels, values=None, pruned=None, title="Game tree"):  # Draw a small layered tree from level lists.
    pruned = set() if pruned is None else set(pruned)  # Normalize pruned labels into a set for lookup.
    fig, ax = plt.subplots(figsize=(9, 5))  # Create a wide figure for tree visualization.
    positions = {}  # Store each node's plotting coordinate by label.
    for depth, labels in enumerate(levels):  # Place nodes one level at a time.
        xs = np.linspace(0, 1, len(labels) + 2)[1:-1]  # Spread nodes evenly across the width.
        y = 1 - depth / max(1, len(levels) - 1)  # Put the root at top and leaves at bottom.
        for x, label in zip(xs, labels):  # Store a coordinate for each label.
            positions[label] = (x, y)  # Save the coordinate for later edges and text.
    for depth in range(len(levels) - 1):  # Draw edges between consecutive levels.
        parents = levels[depth]  # Read parent labels at the current depth.
        children = levels[depth + 1]  # Read child labels one level below.
        group_size = len(children) // len(parents)  # Infer equal branching between these two levels.
        for p_index, parent in enumerate(parents):  # Connect each parent to its children.
            for child in children[p_index * group_size:(p_index + 1) * group_size]:  # Select this parent's child labels.
                color = "lightgray" if child in pruned else "black"  # Gray out pruned child roots.
                ax.plot([positions[parent][0], positions[child][0]], [positions[parent][1], positions[child][1]], color=color)  # Draw the edge.
    for label, (x, y) in positions.items():  # Draw every node label.
        face = "lightgray" if label in pruned else "white"  # Shade pruned nodes differently.
        text = label if values is None or label not in values else f"{label}\n{values[label]}"  # Include backed-up value when available.
        ax.scatter([x], [y], s=900, facecolor=face, edgecolor="black", zorder=3)  # Draw the node circle.
        ax.text(x, y, text, ha="center", va="center", fontsize=9, zorder=4)  # Draw the label and value.
    ax.set_title(title)  # Add a title explaining the visual.
    ax.axis("off")  # Remove axes because this is a graph diagram.
    plt.show()  # Display the tree.
```

#### Data — swappable sources

```python
DATA_SOURCE = "tic_tac_toe_near_end"  # Choose which predefined game data source later examples should use.
DATA_OPTIONS = ["tic_tac_toe_near_end", "branching_blowup_trees", "non_adversarial_tree", "matrix_games"]  # Document valid choices.
near_end_board = np.array([["X", "O", "X"], ["O", "X", "."], [".", "O", "."]], dtype="<U1")  # Store a small X-to-move endgame.
trap_board = np.array([["X", ".", "O"], [".", "X", "."], ["O", ".", "."]], dtype="<U1")  # Store a board where evaluation quality matters.
branching_depths = np.arange(1, 8)  # Store depths for exponential blowup experiments.
branching_factor = 3  # Use a ternary toy tree so depth growth is visible but CPU-safe.
non_adversarial_leaf_values = {"safe_bad": 1, "risky_low": -10, "risky_high": 8}  # Store utilities for minimax-vs-expectimax.
matching_pennies = np.array([[1, -1], [-1, 1]], dtype=float)  # Store the row player's zero-sum matching-pennies payoff matrix.
rock_paper_scissors = np.array([[0, -1, 1], [1, 0, -1], [-1, 1, 0]], dtype=float)  # Store rock-paper-scissors payoffs.
print("Available DATA_OPTIONS:", DATA_OPTIONS)  # Print the swappable data choices for learners.
print("Current DATA_SOURCE:", DATA_SOURCE)  # Print the active data choice.
plot_board(near_end_board, title="Data preview: near-end tic-tac-toe")  # Visualize the default board before search.
```

▶ What you'll see: a near-end tic-tac-toe state with three empty cells. The coded examples will ask which empty cell X should choose, then compare exact minimax, alpha-beta pruning, and depth-limited evaluation.

#### E1. Hand propagate a depth-2 minimax tree

Goal: evaluate an entire small tree by hand.

Consider this alternating game tree. The root is a max node, its children are min nodes, and the bottom nodes are max nodes whose children are terminal utilities:

$$
\begin{array}{c|cc}
\text{bottom max node} & \text{leaf 1} & \text{leaf 2}\\
\hline
A & 1 & 3\\
B & 5 & -1\\
C & -2 & 1\\
D & 3 & 9
\end{array}
$$

**Step 1: back up bottom max nodes.**

For $A$:

$$
V(A)=\max\{1,3\}=3.
$$

For $B$:

$$
V(B)=\max\{5,-1\}=5.
$$

For $C$:

$$
V(C)=\max\{-2,1\}=1.
$$

For $D$:

$$
V(D)=\max\{3,9\}=9.
$$

**Step 2: back up middle min nodes.**

Let the left middle node be $L$ with children $A,B$:

$$
V(L)=\min\{V(A),V(B)\}=\min\{3,5\}=3.
$$

Let the right middle node be $R$ with children $C,D$:

$$
V(R)=\min\{V(C),V(D)\}=\min\{1,9\}=1.
$$

**Step 3: back up the root max node.**

$$
V(\text{root})=\max\{V(L),V(R)\}=\max\{3,1\}=3.
$$

The max player should choose the left subtree:

$$
\pi_{\max}(\text{root})=\text{left}.
$$

Therefore

$$
\boxed{V(\text{root})=3,\quad \text{best root action is left}.}
$$

#### E2. Hand compute expectimax against a fixed random opponent

Goal: replace the opponent's minimum with a probability-weighted average.

Use the same bottom max nodes from E1:

$$
V(A)=3,\quad V(B)=5,\quad V(C)=1,\quad V(D)=9.
$$

Now suppose the opponent does **not** minimize. At each opponent node, it chooses its two actions uniformly at random:

$$
\pi_{\text{opp}}(\text{left child})=\frac12,\qquad \pi_{\text{opp}}(\text{right child})=\frac12.
$$

**Left opponent node.**

$$
V_{\text{expectimax}}(L)=\frac12V(A)+\frac12V(B).
$$

Substitute:

$$
V_{\text{expectimax}}(L)=\frac12(3)+\frac12(5)=\frac{3+5}{2}=4.
$$

**Right opponent node.**

$$
V_{\text{expectimax}}(R)=\frac12V(C)+\frac12V(D).
$$

Substitute:

$$
V_{\text{expectimax}}(R)=\frac12(1)+\frac12(9)=\frac{1+9}{2}=5.
$$

**Root max node.**

$$
V_{\text{expectimax}}(\text{root})=\max\{4,5\}=5.
$$

Thus the root action changes from minimax's left action to expectimax's right action:

$$
\boxed{V_{\text{expectimax}}(\text{root})=5,\quad \text{best root action is right}.}
$$

Interpretation: when the opponent is random rather than adversarial, the high-upside right branch becomes attractive.

#### E3. Alpha-beta pruning by hand

Goal: see exactly why a branch can be skipped without changing the minimax answer.

Consider a left-to-right searched tree with root max node $R$, two min children $L$ and $M$, and two max grandchildren under each. Terminal utilities are:

$$
\begin{array}{c|cc}
\text{max grandchild} & \text{leaf 1} & \text{leaf 2}\\
\hline
A & 3 & 4\\
B & 5 & 6\\
C & 1 & 2\\
D & 100 & 101
\end{array}
$$

**Step 1: search left subtree completely.**

For $A$:

$$
V(A)=\max\{3,4\}=4.
$$

For $B$:

$$
V(B)=\max\{5,6\}=6.
$$

Since $L$ is a min node,

$$
V(L)=\min\{4,6\}=4.
$$

At the root max node, after finishing $L$,

$$
\alpha=4.
$$

This means the root already has an action guaranteeing value at least $4$.

**Step 2: enter right min subtree $M$.**

Search child $C$ first:

$$
V(C)=\max\{1,2\}=2.
$$

Since $M$ is a min node, after seeing just $C$,

$$
\beta_M=\min\{+\infty,2\}=2.
$$

Now compare bounds:

$$
\alpha=4,\qquad \beta_M=2.
$$

The prune condition holds:

$$
\alpha\ge\beta_M
\quad\Longleftrightarrow\quad
4\ge2.
$$

Therefore $M$ can already force the right subtree value to be at most $2$, while the root already has a left action worth $4$. The remaining child $D$ under $M$ cannot make the min node choose a value above $2$, because

$$
V(M)=\min\{V(C),V(D)\}\le V(C)=2.
$$

Thus branch $D$ is safely pruned.

**Step 3: finish root.**

The right subtree is known to be no better than $2$ for the root:

$$
V(M)\le2.
$$

So the root value is

$$
V(R)=\max\{V(L),V(M)\}=\max\{4,\le2\}=4.
$$

Hence

$$
\boxed{V(R)=4,\quad \text{and subtree }D\text{ is pruned}.}
$$

#### E4. One payoff matrix and a pure-strategy Nash check

Goal: identify pure-strategy Nash equilibria in a non-zero-sum simultaneous game.

Let two firms choose High price $H$ or Low price $L$. Payoffs are ordered as $(\text{Firm A},\text{Firm B})$:

$$
\begin{array}{c|cc}
 & B:H & B:L\\
\hline
A:H & (3,3) & (0,4)\\
A:L & (4,0) & (1,1)
\end{array}
$$

A cell is a pure Nash equilibrium if both actions are best responses to each other.

**Best responses for Firm A.**

If $B$ plays $H$:

$$
U_A(H,H)=3,\qquad U_A(L,H)=4.
$$

So A prefers $L$:

$$
\operatorname{BR}_A(H)=L.
$$

If $B$ plays $L$:

$$
U_A(H,L)=0,\qquad U_A(L,L)=1.
$$

So A again prefers $L$:

$$
\operatorname{BR}_A(L)=L.
$$

**Best responses for Firm B.**

If $A$ plays $H$:

$$
U_B(H,H)=3,\qquad U_B(H,L)=4.
$$

So B prefers $L$:

$$
\operatorname{BR}_B(H)=L.
$$

If $A$ plays $L$:

$$
U_B(L,H)=0,\qquad U_B(L,L)=1.
$$

So B again prefers $L$:

$$
\operatorname{BR}_B(L)=L.
$$

The only cell where both players are best responding is $(A:L,B:L)$:

$$
\boxed{(L,L)\text{ is the unique pure-strategy Nash equilibrium, with payoffs }(1,1).}
$$

Notice that $(H,H)$ gives both players $(3,3)$, but it is not stable: either firm can switch to $L$ and improve from $3$ to $4$.

#### E5. Coded minimax for tic-tac-toe endgames

Goal: implement exact minimax decisions for a small board and visualize the backed-up action values.

```python
state = board_to_tuple(near_end_board)  # Convert the preview board into a cacheable state.
player = "X"  # Choose X as the maximizing player to move.
action_values = best_ttt_moves(state, player)  # Compute exact minimax values for every legal move.
score_by_move = {move: value for move, value in action_values}  # Store values in a dictionary for plotting.
best_value = max(score_by_move.values())  # Find the largest backed-up value available to X.
best_moves = [move for move, value in score_by_move.items() if value == best_value]  # Keep all equally optimal moves.
best_move = best_moves[0]  # Select the first optimal move for a deterministic display.
print("Exact minimax action values for X:")  # Announce the result table.
for move, value in action_values:  # Print every candidate move and its value.
    print(f"  move {move}: value {value:+.0f}")  # Show positive, negative, or draw utility.
print(f"Best move for X: {best_move}, backed-up value {best_value:+.0f}")  # Print the chosen move.
plot_board(near_end_board, title="E5: exact minimax values for each legal X move", highlight=best_move, scores=score_by_move)  # Plot values and best move.
```

▶ What you'll see: each empty cell is labeled by its exact minimax value for X. The highlighted cell is a move that guarantees the best possible outcome assuming O responds perfectly.

### 🔴 Advanced

#### A1. Failure/edge: minimax blowup without pruning

Goal: measure the exponential node growth of plain minimax, then compare it with alpha-beta pruning on the same class of trees.

```python
def make_ordered_tree(depth, branching, player="max", prefix="R", good=True):  # Build a deterministic tree with controllable move order.
    if depth == 0:  # Stop when the requested search depth has been reached.
        utility = float(np.random.randint(-9, 10))  # Draw a reproducible terminal utility.
        return TreeNode(prefix, "leaf", utility=utility)  # Return a leaf that stores the utility.
    next_player = "min" if player == "max" else "max"  # Alternate between max and min levels.
    children = []  # Prepare child nodes.
    for i in range(branching):  # Create the requested number of children.
        child = make_ordered_tree(depth - 1, branching, next_player, f"{prefix}.{i}", good)  # Recursively build a child.
        children.append(child)  # Save the child in temporary order.
    scored = [(minimax_tree(child), child) for child in children]  # Compute true child values for ordering only.
    reverse = player == "max" if good else player == "min"  # Put best children first when good=True and worst first otherwise.
    ordered = tuple(child for _, child in sorted(scored, key=lambda pair: pair[0], reverse=reverse))  # Sort children by value.
    return TreeNode(prefix, player, children=ordered)  # Return the internal node with ordered children.

plain_counts = []  # Store how many nodes plain minimax visits at each depth.
ab_counts = []  # Store how many nodes alpha-beta visits at each depth.
root_values = []  # Store root values to verify both algorithms agree.
for depth in branching_depths:  # Sweep depths from shallow to moderately deep.
    tree = make_ordered_tree(int(depth), branching_factor, good=True)  # Build one well-ordered random tree.
    plain_counter = {"nodes": 0}  # Initialize the plain minimax node counter.
    ab_counter = {"nodes": 0}  # Initialize the alpha-beta node counter.
    plain_value = minimax_tree(tree, plain_counter)  # Run exact plain minimax.
    ab_value, _ = alphabeta_tree(tree, counts=ab_counter)  # Run exact alpha-beta minimax.
    plain_counts.append(plain_counter["nodes"])  # Record plain minimax work.
    ab_counts.append(ab_counter["nodes"])  # Record alpha-beta work.
    root_values.append((plain_value, ab_value))  # Record both values for an equality check.
print("Plain and alpha-beta values by depth:", root_values)  # Confirm that pruning does not change answers.
fig, ax = plt.subplots(figsize=(7, 4))  # Create a plot for node growth.
ax.plot(branching_depths, plain_counts, marker="o", label="plain minimax")  # Plot full tree node counts.
ax.plot(branching_depths, ab_counts, marker="o", label="alpha-beta, good order")  # Plot pruned node counts.
ax.set_yscale("log")  # Use a log scale so exponential growth is readable.
ax.set_xlabel("search depth")  # Label the x-axis.
ax.set_ylabel("nodes explored (log scale)")  # Label the y-axis.
ax.set_title("A1: minimax blowup versus alpha-beta pruning")  # Add a descriptive title.
ax.legend()  # Show which curve is which.
ax.grid(True, alpha=0.3)  # Add a faint grid for easier reading.
plt.show()  # Display the growth plot.
```

▶ What you'll see: plain minimax grows rapidly with depth. Alpha-beta returns the same root values but explores far fewer nodes when move ordering is favorable.

#### A2. Move ordering makes alpha-beta powerful

Goal: run alpha-beta on the same style of random utility trees with good and bad move orders, then visualize pruned branches in a small tree.

```python
np.random.seed(3402)  # Reset the seed so good and bad ordering use the same leaf utilities.
small_tree_good = make_ordered_tree(depth=3, branching=2, good=True)  # Build a small well-ordered binary tree for visualization.
np.random.seed(3402)  # Reset the seed again so the bad-order tree has identical leaf utilities.
small_tree_bad = make_ordered_tree(depth=3, branching=2, good=False)  # Build the same tree shape with harmful move ordering.
good_counter = {"nodes": 0}  # Initialize the good-order node counter.
bad_counter = {"nodes": 0}  # Initialize the bad-order node counter.
good_value, good_pruned = alphabeta_tree(small_tree_good, counts=good_counter)  # Run alpha-beta with helpful ordering.
bad_value, bad_pruned = alphabeta_tree(small_tree_bad, counts=bad_counter)  # Run alpha-beta with harmful ordering.
print(f"Good ordering: value {good_value:+.0f}, nodes {good_counter['nodes']}, pruned roots {good_pruned}")  # Report good-order results.
print(f"Bad ordering:  value {bad_value:+.0f}, nodes {bad_counter['nodes']}, pruned roots {bad_pruned}")  # Report bad-order results.
labels_by_level = [["R"], ["R.0", "R.1"], ["R.0.0", "R.0.1", "R.1.0", "R.1.1"], ["R.0.0.0", "R.0.0.1", "R.0.1.0", "R.0.1.1", "R.1.0.0", "R.1.0.1", "R.1.1.0", "R.1.1.1"]]  # Define simple layered labels.
plot_tree_levels(labels_by_level, pruned=good_pruned, title="A2: branches pruned with good ordering")  # Show cutoffs for good ordering.
fig, ax = plt.subplots(figsize=(5, 4))  # Create a bar chart figure.
ax.bar(["good order", "bad order"], [good_counter["nodes"], bad_counter["nodes"]], color=["black", "gray"])  # Compare node counts.
ax.set_ylabel("nodes explored")  # Label the y-axis.
ax.set_title("A2: alpha-beta depends on move ordering")  # Add a descriptive title.
plt.show()  # Display the bar chart.
```

▶ What you'll see: both searches are exact, but good ordering triggers earlier cutoffs. The tree diagram grays out child subtrees that were skipped after the alpha-beta bound proved they were irrelevant.

#### A3. Depth-limited search with an evaluation function

Goal: stop before terminal states and use a board evaluation function, then compare shallow estimates with exact minimax on the same tic-tac-toe position.

```python
state = board_to_tuple(trap_board)  # Convert the evaluation-test board into cached form.
player = "X"  # Let X choose the next move.
exact_values = []  # Prepare exact minimax action values.
shallow_values = []  # Prepare depth-limited action values.
for move in legal_moves_state(state):  # Evaluate every legal move.
    child = next_state(state, move, player)  # Build the child after X plays the move.
    exact = 100.0 * minimax_ttt(child, "O")  # Compute exact outcome value and scale it for comparison.
    shallow = depth_limited_ttt(child, "O", depth=1)  # Compute a one-ply lookahead with evaluation at cutoff.
    exact_values.append((move, exact))  # Store exact value for this move.
    shallow_values.append((move, shallow))  # Store approximate value for this move.
exact_scores = {move: value for move, value in exact_values}  # Convert exact values into a plot dictionary.
shallow_scores = {move: value for move, value in shallow_values}  # Convert shallow values into a plot dictionary.
exact_best = max(exact_scores, key=exact_scores.get)  # Identify the exact minimax best move.
shallow_best = max(shallow_scores, key=shallow_scores.get)  # Identify the depth-limited best move.
print("Move | exact minimax | depth-limited Eval")  # Print a comparison table header.
for move in exact_scores:  # Print rows in legal-move order.
    print(f"{move} | {exact_scores[move]:+6.1f} | {shallow_scores[move]:+6.1f}")  # Show exact and approximate scores.
fig, axes = plt.subplots(1, 2, figsize=(8, 4))  # Create side-by-side plots.
plt.sca(axes[0])  # Select the left axis for the exact board.
plot_board(trap_board, title="Exact minimax best move", highlight=exact_best, scores=exact_scores)  # Display exact scores.
plt.sca(axes[1])  # Select the right axis for the approximate board.
plot_board(trap_board, title="Depth-limited Eval best move", highlight=shallow_best, scores=shallow_scores)  # Display heuristic scores.
```

▶ What you'll see: depth-limited search uses the evaluation function at the frontier. When the evaluation captures the important threat, it agrees with exact minimax; when it misses a tactic, the selected move can differ.

#### A4. Minimax can be too pessimistic against a non-adversarial opponent

Goal: compare minimax and expectimax on the same decision tree when the opponent follows a known random policy.

```python
safe_value = non_adversarial_leaf_values["safe_bad"]  # Read the certain payoff of the safe action.
risky_low = non_adversarial_leaf_values["risky_low"]  # Read the low payoff if the random opponent blocks.
risky_high = non_adversarial_leaf_values["risky_high"]  # Read the high payoff if the random opponent blunders.
prob_low = 0.20  # Set the known probability of the opponent producing the low risky outcome.
prob_high = 0.80  # Set the known probability of the opponent producing the high risky outcome.
minimax_safe = safe_value  # The safe branch has the same value under every model.
minimax_risky = min(risky_low, risky_high)  # Minimax assumes the opponent chooses the worst risky child.
expectimax_safe = safe_value  # Expectimax also gives the safe deterministic branch its utility.
expectimax_risky = prob_low * risky_low + prob_high * risky_high  # Expectimax averages over the known policy.
print(f"Minimax values: safe={minimax_safe:+.1f}, risky={minimax_risky:+.1f}")  # Print adversarial values.
print(f"Expectimax values: safe={expectimax_safe:+.1f}, risky={expectimax_risky:+.1f}")  # Print expected values.
choices = ["safe", "risky"]  # Store root actions for plotting.
minimax_values = [minimax_safe, minimax_risky]  # Store minimax action values.
expectimax_values = [expectimax_safe, expectimax_risky]  # Store expectimax action values.
x = np.arange(len(choices))  # Create bar positions.
fig, ax = plt.subplots(figsize=(6, 4))  # Create a comparison plot.
ax.bar(x - 0.18, minimax_values, width=0.36, label="minimax", color="gray")  # Plot pessimistic values.
ax.bar(x + 0.18, expectimax_values, width=0.36, label="expectimax", color="black")  # Plot expected values.
ax.axhline(0, color="black", linewidth=0.8)  # Add a zero reference line.
ax.set_xticks(x)  # Set action tick positions.
ax.set_xticklabels(choices)  # Label actions.
ax.set_ylabel("root action value")  # Label the y-axis.
ax.set_title("A4: adversarial vs known random opponent")  # Add a title.
ax.legend()  # Show model labels.
plt.show()  # Display the bar chart.
```

▶ What you'll see: minimax chooses the safe action because it imagines the opponent always forces the worst risky outcome. Expectimax chooses risky when the known opponent usually blunders, giving a larger expected value.

#### A5. Mixed strategies and zero-sum matrix games

Goal: visualize the mixed equilibrium of matching pennies and connect it to the minimax theorem.

For matching pennies, the row player receives

$$
V=\begin{bmatrix}1&-1\\-1&1\end{bmatrix}.
$$

If the row player chooses Heads with probability $p$ and the column player chooses Heads with probability $q$, then

$$
V(p,q)=pq(1)+p(1-q)(-1)+(1-p)q(-1)+(1-p)(1-q)(1).
$$

Expand step by step:

$$
V(p,q)=pq-p+pq-q+pq+1-p-q+pq.
$$

Collect terms:

$$
V(p,q)=4pq-2p-2q+1.
$$

For fixed $p$, the column player chooses $q$ to minimize this linear function. The row player wants to maximize the worst case. The equilibrium occurs where the column player is indifferent between its columns.

If column plays Heads, row's expected payoff is

$$
U_{\text{col H}}(p)=p(1)+(1-p)(-1)=2p-1.
$$

If column plays Tails, row's expected payoff is

$$
U_{\text{col T}}(p)=p(-1)+(1-p)(1)=1-2p.
$$

Indifference requires

$$
2p-1=1-2p.
$$

Solve:

$$
4p=2\quad\Longrightarrow\quad p=\frac12.
$$

Symmetrically, the row player is made indifferent by $q=\frac12$. Thus

$$
\boxed{p^*=\frac12,\quad q^*=\frac12,\quad V^*=0.}
$$

```python
payoff = matching_pennies  # Use the row player's matching-pennies payoff matrix.
grid = np.linspace(0, 1, 101)  # Create possible probabilities for Heads.
P, Q = np.meshgrid(grid, grid)  # Build a grid over row probability p and column probability q.
Z = 4 * P * Q - 2 * P - 2 * Q + 1  # Evaluate V(p,q) from the hand-derived formula.
row_worst = np.minimum(2 * grid - 1, 1 - 2 * grid)  # Compute min over column pure responses for each p.
col_best = np.maximum(2 * grid - 1, 1 - 2 * grid)  # Compute max over row pure responses for each q by symmetry.
fig, axes = plt.subplots(1, 2, figsize=(11, 4))  # Create a surface-style heatmap and a minimax curve.
heat = axes[0].contourf(P, Q, Z, levels=21, cmap="coolwarm")  # Plot expected payoff over mixed strategies.
axes[0].scatter([0.5], [0.5], color="black", s=80, label="equilibrium")  # Mark the mixed equilibrium.
axes[0].set_xlabel("row probability p(Heads)")  # Label row player's mixing probability.
axes[0].set_ylabel("column probability q(Heads)")  # Label column player's mixing probability.
axes[0].set_title("A5: expected payoff V(p,q)")  # Add a heatmap title.
axes[0].legend()  # Show the equilibrium marker label.
fig.colorbar(heat, ax=axes[0])  # Add a colorbar for payoff values.
axes[1].plot(grid, row_worst, color="black", label="row worst case min_q V")  # Plot row player's guaranteed value.
axes[1].axvline(0.5, color="gray", linestyle="--", label="p*=1/2")  # Mark the optimal row mix.
axes[1].axhline(0.0, color="gray", linestyle=":", label="value=0")  # Mark the game value.
axes[1].set_xlabel("row probability p(Heads)")  # Label the x-axis.
axes[1].set_ylabel("guaranteed payoff")  # Label the y-axis.
axes[1].set_title("max_p min_q V(p,q)")  # Add a title for the minimax view.
axes[1].legend()  # Show curve labels.
axes[1].grid(True, alpha=0.3)  # Add a faint grid.
plt.show()  # Display both plots.
```

▶ What you'll see: the heatmap shows a saddle at $(p,q)=(1/2,1/2)$. The right plot shows that the row player maximizes its guaranteed payoff by mixing Heads and Tails equally.

### Interactive Experiment

Use the slider to vary search depth. The board shows the move selected by depth-limited minimax and prints how many child evaluations were made.

```python
def depth_limited_with_count(state, player, depth, counter):  # Define a counted version for the interactive slider.
    counter["nodes"] += 1  # Count each visited state so search effort is visible.
    terminal = terminal_utility_state(state)  # Check whether the position is already terminal.
    if terminal is not None:  # Terminal states should return exact game outcomes.
        return 100.0 * terminal  # Scale terminal wins and losses above heuristic values.
    if depth == 0:  # Stop recursion at the selected depth limit.
        return open_lines_eval_state(state)  # Use the evaluation function at the frontier.
    moves = legal_moves_state(state)  # Enumerate legal moves.
    values = [depth_limited_with_count(next_state(state, move, player), "O" if player == "X" else "X", depth - 1, counter) for move in moves]  # Score successors.
    if player == "X":  # X is the maximizing player.
        return max(values)  # Choose the largest child value.
    return min(values)  # O is the minimizing player.

def show_depth_choice(search_depth=1):  # Define the display function controlled by the slider.
    state = board_to_tuple(trap_board)  # Use the depth-limit demonstration board.
    scores = {}  # Prepare action-value scores for plotting.
    total_nodes = 0  # Track total search work over all candidate moves.
    for move in legal_moves_state(state):  # Evaluate each legal X move.
        counter = {"nodes": 0}  # Count nodes for this candidate move.
        value = depth_limited_with_count(next_state(state, move, "X"), "O", search_depth - 1, counter)  # Search after making the move.
        scores[move] = value  # Store the move's depth-limited value.
        total_nodes += counter["nodes"]  # Accumulate node counts.
    best_move = max(scores, key=scores.get)  # Pick the best move under the selected depth limit.
    print(f"search_depth={search_depth}, chosen_move={best_move}, nodes_explored={total_nodes}")  # Print the main result.
    plot_board(trap_board, title=f"Interactive: depth {search_depth} chooses {best_move}", highlight=best_move, scores=scores)  # Visualize scores.
if HAVE_WIDGETS:  # Use a real widget when running in Jupyter or Colab.
    interact(show_depth_choice, search_depth=IntSlider(value=1, min=1, max=6, step=1, description="depth"))  # Display the depth slider.
else:  # Use a non-interactive fallback when widgets are unavailable.
    show_depth_choice(search_depth=3)  # Run one representative depth in plain Python.
```

▶ What you'll see: increasing search depth usually explores more nodes and can change the selected move. This is the practical tradeoff that motivates alpha-beta pruning and good evaluation functions in large games.
