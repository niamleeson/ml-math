# Lesson Plan — 35 Constraint Satisfaction Problems & Factor Graphs

| Field | Value |
|---|---|
| Source | CS 221 |
| Content category | Concept+Method |
| Example type | ⚖️ Both |
| Colab notebook | Yes |
| Est. lesson time | 50–65 min |
| Source topic file | ../35-constraint-satisfaction-problems.md |

## Part 1 — Overview (plan)
CSPs model problems as variables, domains, and constraints, then search for assignments that satisfy every constraint or maximize factor weight. Hook: instead of enumerating every schedule/coloring blindly, use constraint structure to fail early.

## Part 2 — Key Idea (plan)
- **Focus (per category = Concept+Method):** define factor graphs and CSPs, then give step-by-step methods for exact backtracking with ordering/lookahead and approximate assignment search.
- **Core artifacts to present:** variables $X_i\in\operatorname{Domain}_i$; factor scope and arity; assignment weight $\operatorname{Weight}(x)=\prod_j f_j(x)$; CSP as 0/1-valued factors; consistent assignment $\operatorname{Weight}(x)=1$; dependent factors $D(x,X_i)$; backtracking recursion; forward checking; most-constrained-variable and least-constrained-value heuristics; arc consistency and AC-3 queue updates; beam search complexity $O(nKb\log(Kb))$; ICM and Gibbs updates; independence, conditional independence, Markov blanket, conditioning, elimination, and treewidth.

## Part 3 — Worked Examples

### 🟢 Easy (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| E1 | Hand evaluate a factor-graph assignment weight | 3 Boolean variables with unary and binary factors from the source style | factor graph annotated with factor values; product calculation for one assignment | ~4 |
| E2 | Hand check CSP consistency | tiny 3-variable Boolean CSP | constraint table with satisfied/violated factors and final weight 0 or 1 | ~4 |
| E3 | Propagate one arc-consistency constraint by hand | two variables with domains `{1,2,3}` and constraint $X<Y$ | domains before/after; unsupported values crossed out | ~5 |
| E4 | Backtracking map coloring with forward checking | 4-region map with 3 colors | process: constraint graph coloring plus remaining-domain boxes per assignment; result: valid coloring | ~8 |
| E5 | Most-constrained variable and least-constrained value | small scheduling CSP | process: domain-size table and neighbor-support counts; result: chosen variable/value | ~5 |

### 🔴 Advanced (5)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| A1 | AC-3 on a Sudoku-like mini puzzle | 4x4 Latin-square/Sudoku CSP | process: AC-3 queue and domains shrinking; result: solved or reduced grid | ~12 |
| A2 | Backtracking tree: naive vs. MCV+LCV+forward checking | map-coloring benchmark | process: backtracking search tree unfolding; result: node-count bars and final constraint-graph coloring | ~12 |
| A3 | Failure/edge: unsatisfiable CSP detected early | triangle graph with two colors | process: domains shrink to empty during forward checking/AC-3; result: contradiction highlighted in red | ~8 |
| A4 | Beam search approximate assignment | weighted factor graph with $n=5$, $b=3$, beam sizes $K=1,2,\infty$ | process: beam-search tree with only top-$K$ partial assignments highlighted; result: weight vs. runtime tradeoff | ~10 |
| A5 | ICM vs. Gibbs on a loopy factor graph | binary image-denoising/grid factor graph | process: assignment grid changing one variable at a time; result: local-minimum trap for ICM vs. Gibbs escaping occasionally | ~12 |

## Part 4 — Colab Notebook
- **Notebook file:** topics/notebooks/35-constraint-satisfaction-problems.ipynb
- **Est. cell count:** ~120 (⚖️ topic → hand factor/arc-consistency derivations in lesson plus coded backtracking, AC-3, beam search, ICM, and Gibbs visualizations)
- **Key libraries:** numpy, matplotlib, networkx, pandas, ipywidgets, collections (`deque`, `defaultdict`)
- **Runtime:** CPU
- **Failure/edge dataset included:** `two_color_triangle` in A3 — an unsatisfiable CSP where forward checking/AC-3 exposes an empty domain; A5 also shows ICM getting stuck in a local minimum on a loopy graph.
- **Signature visualizations:** constraint-graph coloring with domains beside nodes; backtracking search tree unfolding with pruned branches; AC-3 domain-shrink animation / beam-search tree.
