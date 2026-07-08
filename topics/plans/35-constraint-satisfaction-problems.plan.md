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

### 🟢 Basics (10)
| # | Title | Data source | Visualization(s) | Build steps |
|---|---|---|---|---|
| B1 | Check one unary constraint on one assignment | toy scalar assignment `X=1` with constraint `[X=1]` | printed constraint value `1` or `0` | ~2 |
| B2 | List the remaining domain after one assignment | toy domains `X,Y∈{1,2,3}` with assigned `X=2` and constraint `X<Y` | before/after domain boxes for `Y` | ~2 |
| B3 | Count conflicts in one toy coloring | three-node path coloring assignment with one repeated neighbor color | tiny constraint table with violated-edge count | ~3 |
| B4 | Check one binary constraint on two values | two-color assignment on one edge | one edge constraint truth value | ~2 |
| B5 | Check whether one value is consistent with assigned neighbors | partial coloring with one assigned neighbor | candidate accept/reject result | ~2 |
| B6 | Compute the degree of one variable | tiny constraint graph centered at `B` | neighbor set and degree count | ~2 |
| B7 | Pick the most-constrained variable | three remaining domains of sizes `3`, `1`, `2` | domain-size comparison | ~2 |
| B8 | Forward-check one neighbor domain | `X<Y` after assigning `X=1` | before/after domain for `Y` | ~3 |
| B9 | Test arc consistency for one arc | `X<Y` with two-value domains | unsupported value removed | ~3 |
| B10 | Check whether a complete assignment satisfies all constraints | valid three-node path coloring | all edge checks passing | ~3 |

### 🟡 Easy (5)
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
- **Notebook file:** topics/notebooks/artificial-intelligence/35-constraint-satisfaction-problems.ipynb
- **Est. cell count:** ~130 (⚖️ topic → 3 atomic basics plus hand factor/arc-consistency derivations and coded backtracking, AC-3, beam search, ICM, and Gibbs visualizations)
- **Key libraries:** numpy, matplotlib, networkx, pandas, ipywidgets, collections (`deque`, `defaultdict`)
- **Runtime:** CPU
- **Failure/edge dataset included:** `two_color_triangle` in A3 — an unsatisfiable CSP where forward checking/AC-3 exposes an empty domain; A5 also shows ICM getting stuck in a local minimum on a loopy graph.
- **Signature visualizations:** constraint-graph coloring with domains beside nodes; backtracking search tree unfolding with pruned branches; AC-3 domain-shrink animation / beam-search tree.
