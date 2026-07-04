# Lesson Plan — 32 Search Optimization: Tree, Graph, A*

| Field | Value |
|---|---|
| Source | CS 221 |
| Content category | Method/Algorithm |
| Example type | 💻 Colab |
| Colab notebook | Yes |
| Est. lesson time | 45–60 min |
| Source topic file | ../32-search-optimization.md |

## Part 1 — Overview (plan)
Search turns planning into "choose actions from a start state until an end state is reached with minimum cost." Hook: the same maze can look easy or impossible depending on what the frontier prioritizes.

## Part 2 — Key Idea (plan)
- **Focus (per category = Method/Algorithm):** step-by-step algorithms and pseudocode for backtracking, BFS, DFS, iterative deepening, dynamic programming on acyclic state graphs, uniform cost search, and A*.
- **Core artifacts to present:** search-problem tuple $(s_{\text{start}}, \operatorname{Actions}, \operatorname{Cost}, \operatorname{Succ}, \operatorname{IsEnd})$; explored/frontier/unexplored sets; queue vs. stack vs. priority queue; DP recurrence for $\operatorname{FutureCost}(s)$; UCS invariant that popped states have optimal past cost; A* priority $\operatorname{PastCost}(s)+h(s)$; admissibility $h(s)\leq \operatorname{FutureCost}(s)$; consistency $h(s)\leq \operatorname{Cost}(s,a)+h(\operatorname{Succ}(s,a))$ and $h(s_{\text{end}})=0$; relaxation-derived heuristics and max-of-consistent-heuristics theorem.

## Part 3 — Worked Examples

### 🟢 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | BFS on an unweighted grid maze | `small_grid` with walls, start, goal | process: redraw grid after every pop with explored cells, frontier ring, and current parent links; result: shortest path + path length | ~8 |
| E2 | DFS and why "first path found" need not be shortest | same `small_grid` with ordered actions | process: stack contents and grid redrawn per expansion; result: DFS path overlaid beside BFS path | ~7 |
| E3 | Uniform cost search on a weighted road graph | `weighted_graph` adjacency list | process: priority queue table + graph recolored at every pop; result: cheapest route and cumulative cost labels | ~8 |
| E4 | Dynamic programming on an acyclic grid DAG | monotone right/down grid with cell costs | process: future-cost table filled from goal backward; result: arrows showing optimal successor from each state | ~6 |
| E5 | A* with Manhattan distance | open grid with unit costs | process: each pop shows $g$, $h$, and $f=g+h$ labels, frontier, explored, and best current path; result: final path and explored-count metric | ~10 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | BFS vs. UCS vs. A* on the same maze | `maze_medium` with corridors and weighted terrain | process: synchronized redraw per node expansion for all algorithms; result: final paths + explored-count bar chart | ~14 |
| A2 | Heuristic strength: zero, Manhattan, Euclidean, max heuristic | `maze_medium` | process: heatmap of $h(s)$ plus expansion animation for each heuristic; result: explored-count vs. optimal-cost table | ~12 |
| A3 | Failure case: inadmissible heuristic breaks A* optimality | small weighted graph with a deliberately overestimated shortcut heuristic | process: priority queue and graph redrawn per pop; result: suboptimal path highlighted against true UCS optimum | ~10 |
| A4 | Negative costs break UCS assumptions | tiny graph with one negative edge but no negative cycle | process: UCS pop order shown before a cheaper path appears late; result: incorrect finalized cost contrasted with Bellman-style relaxation | ~8 |
| A5 | Relaxation-derived heuristics for a blocked grid | grid where diagonal moves are allowed only in the relaxed problem | process: relaxed future-cost heatmap, then A* expansion redraws; result: admissible/consistent checks + path/explored metrics | ~12 |

## Part 4 — Colab Notebook
- **Notebook file:** topics/notebooks/32-search-optimization.ipynb
- **Est. cell count:** ~145 (💻 topic → all 10 examples coded; A*/UCS examples use granular pop→expand→update costs→push loops with a redraw at each node expansion)
- **Key libraries:** numpy, matplotlib, networkx, heapq, collections (`deque`), ipywidgets
- **Runtime:** CPU
- **Failure/edge dataset included:** `bad_heuristic_graph` in A3 — an inadmissible heuristic overestimates the optimal branch, causing A* to return a suboptimal path; `negative_edge_graph` in A4 shows why UCS requires nonnegative costs.
- **Signature visualizations:** grid maze coloring explored/frontier/final path at each expansion; BFS-vs-A*-vs-UCS explored-count bars; weighted graph with live priority labels and the chosen shortest path.

## Part 5 — Practice Questions
- **🟢 Easy (5) — themes:** identify the components of a search problem; choose queue/stack/priority queue for BFS/DFS/UCS; compute one BFS expansion order; calculate one UCS priority update; decide whether a simple heuristic is admissible.
- **🔴 Hard (5) — themes:** prove the UCS pop invariant; construct a consistent heuristic from a relaxation; show consistency implies admissibility; explain why adding a constant to negative costs changes the problem; design a graph where an inadmissible heuristic makes A* return a nonoptimal path.
