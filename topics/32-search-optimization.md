# Search Optimization: Tree, Graph, A*

> **Source:** Artificial Intelligence — Stanford CS 221 &middot; Topic 32/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

## 2 States-based models

### 2.1 Search optimization

In this section, we assume that by accomplishing action $a$ from state $s$, we deterministically arrive in state $\operatorname{Succ}(s,a)$. The goal here is to determine a sequence of actions $(a_1,a_2,a_3,a_4,...)$ that starts from an initial state and leads to an end state. In order to solve this kind of problem, our objective will be to find the minimum cost path by using states-based models.

#### 2.1.1 Tree search

This category of states-based algorithms explores all possible states and actions. It is quite memory efficient, and is suitable for huge state spaces but the runtime can become exponential in the worst cases.

*[Figure: Five small tree diagrams comparing valid and invalid tree structures. The invalid examples are labeled Self-loop, More than a parent, Cycle, and More than a root with red X marks; the valid example is labeled Valid tree with a green check mark. The figure teaches the constraints that define a valid tree.]*

- **Search problem** — A search problem is defined with:

  - a starting state $s_{\text{start}}$
  - possible actions $\operatorname{Actions}(s)$ from state $s$
  - action cost $\operatorname{Cost}(s,a)$ from state $s$ with action $a$
  - successor $\operatorname{Succ}(s,a)$ of state $s$ after action $a$
  - whether an end state was reached $\operatorname{IsEnd}(s)$

*[Figure: A branching transition diagram from a state $s$ to successors $\operatorname{Succ}(s,a_1)$, $\operatorname{Succ}(s,a_2)$, and $\operatorname{Succ}(s,a_3)$ along arrows labeled $\operatorname{Cost}(s,a_1)$, $\operatorname{Cost}(s,a_2)$, and $\operatorname{Cost}(s,a_3)$, showing the components of a search problem.]*

The objective is to find a path that minimizes the cost.

- **Backtracking search** — Backtracking search is a naive recursive algorithm that tries all possibilities to find the minimum cost path. Here, action costs can be either positive or negative.

- **Breadth-first search (BFS)** — Breadth-first search is a graph search algorithm that does a level-by-level traversal. We can implement it iteratively with the help of a queue that stores at each step future nodes to be visited. For this algorithm, we can assume action costs to be equal to a constant $c\geq0$.

*[Figure: A rooted tree with green nodes numbered in breadth-first visitation order: 1 at the root, then 2, 3, 4 on the next level, then 5, 6, 7, and finally 8, 9, 10 below node 7. Arrows show the tree edges, illustrating BFS level-order traversal.]*

- **Depth-first search (DFS)** — Depth-first search is a search algorithm that traverses a graph by following each path as deep as it can. We can implement it recursively, or iteratively with the help of a stack that stores at each step future nodes to be visited. For this algorithm, action costs are assumed to be equal to 0.

*[Figure: A rooted tree with green nodes numbered in depth-first visitation order: root 1, right child 2, middle subtree 3 then 4 then leaves 5, 6, 7, then 8, and left subtree 9 then 10. Arrows show edges, illustrating DFS traversal down paths before backtracking.]*

- **Iterative deepening** — The iterative deepening trick is a modification of the depth-first search algorithm so that it stops after reaching a certain depth, which guarantees optimality when all action costs are equal. Here, we assume that action costs are equal to a constant $c\geq0$.

- **Tree search algorithms summary** — By noting $b$ the number of actions per state, $d$ the solution depth, and $D$ the maximum depth, we have:

| Algorithm | Action costs | Space | Time |
|---|---|---|---|
| Backtracking search | any | $O(D)$ | $O(b^D)$ |
| Breadth-first search | $c\geq0$ | $O(b^d)$ | $O(b^d)$ |
| Depth-first search | 0 | $O(D)$ | $O(b^D)$ |
| DFS-Iterative deepening | $c\geq0$ | $O(d)$ | $O(b^d)$ |

#### 2.1.2 Graph search

This category of states-based algorithms aims at constructing optimal paths, enabling exponential savings. In this section, we will focus on dynamic programming and uniform cost search.

- **Graph** — A graph is comprised of a set of vertices $V$ (also called nodes) as well as a set of edges $E$ (also called links).

*[Figure: An undirected graph with vertices $V_1$ through $V_8$ and edges labeled $E_1$ through $E_{10}$. It shows nodes connected by multiple links, illustrating graph terminology for vertices and edges.]*

*Remark: a graph is said to be acyclic when there is no cycle.*

- **State** — A state is a summary of all past actions sufficient to choose future actions optimally.

- **Dynamic programming** — Dynamic programming (DP) is a backtracking search algorithm with memoization (i.e. partial results are saved) whose goal is to find a minimum cost path from state $s_{\text{start}}$ to an end state $s_{\text{end}}$. It can potentially have exponential savings compared to traditional graph search algorithms, and has the property to only work for acyclic graphs. For any given state $s$, the future cost is computed as follows:

$$
\operatorname{FutureCost}(s)=
\begin{cases}
0 & \text{if }\operatorname{IsEnd}(s)\\
\displaystyle\min_{a\in\operatorname{Actions}(s)}\left[\operatorname{Cost}(s,a)+\operatorname{FutureCost}(\operatorname{Succ}(s,a))\right] & \text{otherwise}
\end{cases}
$$

*[Figure: A grid path-planning diagram with $s_{\text{start}}$ at the upper-left and $s_{\text{end}}$ at the lower-right. Colored cells and arrows show future-cost directions, emphasizing a bottom-to-top dynamic programming computation where future costs guide choices toward the end state.]*

*Remark: the figure above illustrates a bottom-to-top approach whereas the formula provides the intuition of a top-to-bottom problem resolution.*

- **Types of states** — The table below presents the terminology when it comes to states in the context of uniform cost search:


| State | Explanation |
|---|---|
| Explored $\mathcal{E}$ | States for which the optimal path has already been found |
| Frontier $\mathcal{F}$ | States seen for which we are still figuring out how to get there with the cheapest cost |
| Unexplored $\mathcal{U}$ | States not seen yet |

- **Uniform cost search** — Uniform cost search (UCS) is a search algorithm that aims at finding the shortest path from a state $s_{\text{start}}$ to an end state $s_{\text{end}}$. It explores states $s$ in increasing order of $\operatorname{PastCost}(s)$ and relies on the fact that all action costs are non-negative.

*[Figure: Directed weighted graph for uniform cost search. The start state $s_{\text{start}}$ connects to $A$ with cost 10; $A$ connects to $B$ with cost 10 and to $C$ with cost 30; $B$ connects to $E$ with cost 20; $E$ connects to $F$ with cost 20; $F$ connects to $s_{\text{end}}$ with cost 20. Faded alternative edges include $B$ to $D$ cost 100, $D$ to $C$ cost 20, $D$ to $F$ cost 10, $C$ to $s_{\text{end}}$ cost 20, and $C$ to $D$ cost 10. The figure illustrates UCS expanding cheapest past-cost paths and ignoring more expensive alternatives.]*

_Remark 1: the UCS algorithm is logically equivalent to Dijkstra's algorithm._

_Remark 2: the algorithm would not work for a problem with negative action costs, and adding a positive constant to make them non-negative would not solve the problem since this would end up being a different problem._

- **Correctness theorem** — When a state $s$ is popped from the frontier $\mathcal{F}$ and moved to explored set $\mathcal{E}$, its priority is equal to $\operatorname{PastCost}(s)$ which is the minimum cost from $s_{\text{start}}$ to $s$.

- **Graph search algorithms summary** — By noting $N$ the number of total states, $n$ of which are explored before the end state $s_{\text{end}}$, we have:

| Algorithm | Acyclicity | Costs | Time/space |
|---|---|---|---|
| Dynamic programming | yes | any | $O(N)$ |
| Uniform cost search | no | $c \geq 0$ | $O(n\log(n))$ |

_Remark: the complexity countdown supposes the number of possible actions per state to be constant._

#### 2.1.3 Learning costs

Suppose we are not given the values of $\operatorname{Cost}(s,a)$, we want to estimate these quantities from a training set of minimizing-cost-path sequence of actions $(a_1,a_2,...,a_k)$.

- **Structured perceptron** — The structured perceptron is an algorithm aiming at iteratively learning the cost of each state-action pair. At each step, it:

  - decreases the estimated cost of each state-action of the true minimizing path $y$ given by the training data,
  - increases the estimated cost of each state-action of the current predicted path $y'$ inferred from the learned weights.

_Remark: there are several versions of the algorithm, one of which simplifies the problem to only learning the cost of each action $a$, and the other parametrizes $\operatorname{Cost}(s,a)$ to a feature vector of learnable weights._

#### 2.1.4 A* search

- **Heuristic function** — A heuristic is a function $h$ over states $s$, where each $h(s)$ aims at estimating $\operatorname{FutureCost}(s)$, the cost of the path from $s$ to $s_{\text{end}}$.

*[Figure: Three-node path $s_{\text{start}} \to s \to s_{\text{end}}$. The left segment is labeled $\operatorname{PastCost}(s)$, and a dotted estimate from $s$ to $s_{\text{end}}$ is labeled $h(s) \approx \operatorname{FutureCost}(s)$, illustrating how A* combines known and heuristic costs.]*

- **Algorithm** — A* is a search algorithm that aims at finding the shortest path from a state $s$ to an end state $s_{\text{end}}$. It explores states $s$ in increasing order of $\operatorname{PastCost}(s)+h(s)$. It is equivalent to a uniform cost search with edge costs $\operatorname{Cost}'(s,a)$ given by:

$$
\operatorname{Cost}'(s,a)=\operatorname{Cost}(s,a)+h(\operatorname{Succ}(s,a))-h(s)
$$

_Remark: this algorithm can be seen as a biased version of UCS exploring states estimated to be closer to the end state._

- **Consistency** — A heuristic $h$ is said to be consistent if it satisfies the two following properties:

  - For all states $s$ and actions $a$,

$$
h(s)\leq \operatorname{Cost}(s,a)+h(\operatorname{Succ}(s,a))
$$

*[Figure: Consistency triangle with state $s$, successor $\operatorname{Succ}(s,a)$, and $s_{\text{end}}$. Solid edge from $s$ to successor is labeled $\operatorname{Cost}(s,a)$; dotted heuristic edges are labeled $h(s)$ from $s$ to end and $h(\operatorname{Succ}(s,a))$ from successor to end. The figure shows the triangle-inequality-like condition for a consistent heuristic.]*

  - The end state verifies the following:

$$
h(s_{\text{end}})=0
$$

*[Figure: Single end node $s_{\text{end}}$ with a dotted self-loop labeled $h(s_{\text{end}})=0$, emphasizing that the heuristic has zero estimated future cost at the goal.]*

- **Correctness** — If $h$ is consistent, then A* returns the minimum cost path.

- **Admissibility** — A heuristic $h$ is said to be admissible if we have:

$$
h(s)\leq \operatorname{FutureCost}(s)
$$

- **Theorem** — Let $h(s)$ be a given heuristic. We have:

$$
h(s)\text{ consistent}\Longrightarrow h(s)\text{ admissible}
$$

- **Efficiency** — A* explores all states $s$ satisfying the following equation:

$$
\operatorname{PastCost}(s)\leq \operatorname{PastCost}(s_{\text{end}})-h(s)
$$

*[Figure: A* efficiency diagram with $s_{\text{start}}$, intermediate state $s$, and $s_{\text{end}}$. A solid path from start to $s$ is labeled $\operatorname{PastCost}(s)$; a solid direct path from start to end is labeled $\operatorname{PastCost}(s_{\text{end}})$; and a dotted edge from $s$ to end is labeled $h(s)$. It illustrates that larger heuristic values reduce the set of states A* explores.]*

_Remark: larger values of $h(s)$ is better as this equation shows it will restrict the set of states $s$ going to be explored._

#### 2.1.5 Relaxation

It is a framework for producing consistent heuristics. The idea is to find closed-form reduced costs by removing constraints and use them as heuristics.

- **Relaxed search problem** — The relaxation of search problem $P$ with costs $\operatorname{Cost}$ is noted $P_{\text{rel}}$ with costs $\operatorname{Cost}_{\text{rel}}$, and satisfies the identity:

$$
\operatorname{Cost}_{\text{rel}}(s,a)\leq \operatorname{Cost}(s,a)
$$

- **Relaxed heuristic** — Given a relaxed search problem $P_{\text{rel}}$, we define the relaxed heuristic $h(s)=\operatorname{FutureCost}_{\text{rel}}(s)$ as the minimum cost path from $s$ to an end state in the graph of costs $\operatorname{Cost}_{\text{rel}}(s,a)$.

- **Consistency of relaxed heuristics** — Let $P_{\text{rel}}$ be a given relaxed problem. By theorem, we have:

$$
h(s)=\operatorname{FutureCost}_{\text{rel}}(s)\Longrightarrow h(s)\text{ consistent}
$$

- **Tradeoff when choosing heuristic** — We have to balance two aspects in choosing a heuristic:

  - Computational efficiency: $h(s)=\operatorname{FutureCost}_{\text{rel}}(s)$ must be easy to compute. It has to produce a closed form, easier search and independent subproblems.
  - Good enough approximation: the heuristic $h(s)$ should be close to $\operatorname{FutureCost}(s)$ and we have thus to not remove too many constraints.

- **Max heuristic** — Let $h_1(s),h_2(s)$ be two heuristics. We have the following property:

$$
h_1(s),h_2(s)\text{ consistent}\Longrightarrow h(s)=\max\{h_1(s),h_2(s)\}\text{ consistent}
$$
