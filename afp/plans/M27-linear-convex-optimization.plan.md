# Module Plan — M27 · Linear & convex optimization (LP/QP, duality)

| Field | Value |
|---|---|
| Domain | Domain 6 · Optimization & Marketplace |
| Skip if you can already… | write an LP and explain duals / shadow prices |
| Maps to (projects) | Event Ads perf, Search Ads, Instream Ads perf |
| Primary structure(s) | S3 Formula / Theorem |
| Example type | 🧮/⚑ |
| Sub-lessons | 2 |
| Notebooks | 1 |

## Module hub (the "complete list")
Optimization is the language underneath marketplace allocation: choose winners, spend scarce budget,
respect delivery constraints, and understand what each constraint is costing you. This module teaches
the mathematical core needed for M28: convexity, LP/QP formulation, duality, KKT, and assignment as an
allocation LP.

- M27.1 · LPs & QPs: formulation, convexity, and allocation variables
- M27.2 · Duality, shadow prices & KKT: what constraints are worth

## Questions this module answers (→ which sub-lesson teaches the answer)
- What is a convex set/function, and why does convexity matter for optimization? → M27.1
- How do you formulate an LP: objective, variables, constraints, and standard form? → M27.1
- What is a QP, and when does it arise in ads or allocation problems? → M27.1
- What are weak and strong duality? → M27.2
- What do dual variables / shadow prices mean? → M27.2
- What are the KKT conditions, and how do they certify an optimum? → M27.2
- How do you solve a tiny 2-variable LP graphically and read the shadow price of a binding constraint? → M27.1, M27.2
- How is assignment/allocation written as an LP? → M27.1

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Convex sets and convex functions **ƒ**; local optimum = global optimum under convexity
- LP standard form **ƒ**: linear objective, linear equality/inequality constraints, nonnegative variables
- Feasible region, vertices/extreme points, binding vs slack constraints
- QP **ƒ**: quadratic objective with linear constraints; convex when the quadratic matrix is positive semidefinite
- Assignment/allocation as LP **ƒ**; total unimodularity intuition for integral assignments (prose)
- Lagrangian, weak/strong duality, primal vs dual **ƒ**
- Dual variables / shadow prices **ƒ**; marginal value of relaxing a binding constraint
- KKT conditions **ƒ**: primal feasibility, dual feasibility, stationarity, complementary slackness

## Sub-lessons

### M27.1 · LPs & QPs: formulation, convexity, and allocation variables  —  [S3 Formula, 🧮/⚑]
- **Makes answerable:** what convex sets/functions are and why convexity matters; how to formulate an LP; what a QP is and when it arises; how to solve a tiny 2-variable LP graphically; how assignment/allocation is an LP.
- **You'll be able to say:** "A convex problem has a bowl-shaped objective and a no-holes feasible region, so local optima are global and solvers can certify success. An LP chooses variables to maximize/minimize a linear objective subject to linear constraints; a QP adds a quadratic term, useful for smoothness, risk, or deviation penalties. Assignment is an LP over allocation variables x_{ij} with supply/demand constraints."
- **Concepts:** convex sets/functions **ƒ**, feasible region, LP standard form **ƒ**, QP **ƒ**, vertices/binding constraints, assignment/allocation as LP **ƒ**.
- **Key Idea focus:** statement + honest derivation: translate an ads allocation story into variables, objective, constraints, and a solver-ready form; show why the optimum of a 2D LP occurs at a vertex.
- **Worked-example shape:** 5 easy + 5 advanced pen-paper/formulation examples. Easy: identify convex vs nonconvex sets, put inequalities into standard form, evaluate candidate vertices. Advanced: formulate Event Ads budget allocation, Search Ads query inventory assignment, Instream Ads delivery with frequency caps, QP smoothing of pacing changes, and assignment with advertiser-slot variables.
- **Notebook:** Yes — tiny 2-variable LP solved two ways: vertex enumeration and `scipy.optimize.linprog` when SciPy is available, with a pure-NumPy fallback. Data includes a feasible case and a break case (infeasible campaign budget/inventory requirements). Signature viz = 2D feasible polygon, objective contours, optimal vertex; `assert` the vertex solution equals the solver result and infeasible constraints are detected.
- **Real numbers to cite:** Event Ads allocation LP: choose impressions x_A and x_B. Maximize `2.00 x_A + 3.00 x_B` expected value units subject to budget `x_A + 2x_B <= 10`, inventory `3x_A + x_B <= 12`, and nonnegativity. Candidate vertices: (0,0), (4,0), (0,5), (2.8,3.6); objective at optimum = 16.4 value units at (2.8,3.6), where both constraints bind. Assignment mini-case: 2 advertisers × 2 slots with values [[0.18, 0.10], [0.12, 0.16]] dollars expected value; allocation picks A→slot1 and B→slot2 for total \$0.34 expected value.

### M27.2 · Duality, shadow prices & KKT: what constraints are worth  —  [S3 Formula, 🧮/⚑]
- **Makes answerable:** weak/strong duality; dual variables/shadow prices; KKT conditions; the shadow price of a binding constraint in the tiny 2-variable LP.
- **You'll be able to say:** "The dual turns constraints into prices. Weak duality says every dual-feasible solution bounds the primal; strong duality says convex problems such as LPs have matching primal/dual optima under regularity. A positive shadow price means relaxing that binding constraint improves the objective at that marginal rate; KKT conditions prove optimality by combining feasibility, stationarity, and complementary slackness."
- **Concepts:** Lagrangian and dual **ƒ**, weak/strong duality **ƒ**, dual variables / shadow prices **ƒ**, KKT conditions **ƒ**, complementary slackness.
- **Key Idea focus:** statement + honest derivation: derive the dual of the tiny LP, interpret each dual variable as a marketplace price on budget or inventory, then use KKT to certify the allocation.
- **Worked-example shape:** 5 easy + 5 advanced derivations. Easy: write a Lagrangian, check weak duality, identify slack vs binding, compute a shadow price by perturbing a RHS, verify complementary slackness. Advanced: read dual prices for budget, inventory, guaranteed-delivery, frequency-cap, and reserve-price constraints in ads allocation.
- **Notebook:** No separate notebook — shares the M27.1 notebook and adds RHS perturbation cells for shadow prices. Break case = interpreting a nonbinding constraint as valuable; `assert` its estimated shadow price is near zero.
- **Real numbers to cite:** For the M27.1 LP optimum (2.8, 3.6), the dual prices are y_budget = 1.4 and y_inventory = 0.2 because `y + 3z = 2` and `2y + z = 3`. Dual objective `10(1.4) + 12(0.2) = 16.4`, matching the primal. Relaxing the budget RHS from 10 to 11 while both constraints remain binding raises the objective from 16.4 to 17.8, so the budget shadow price is 1.4 expected-value units per budget unit; relaxing the inventory RHS by 1 raises value by 0.2.

## Coverage check
All 8 module questions map to a sub-lesson: convexity, LP/QP formulation, graphical solving, and assignment LP → M27.1; duality, shadow prices, KKT, and the binding-constraint value calculation → M27.2. No gaps.

## Decision guide
| If the ads problem is… | Use / teach as… | Why |
|---|---|---|
| Maximize value with linear budgets, inventory, eligibility, caps | LP | Linear objective + linear constraints; duals are interpretable prices. |
| Match advertisers to slots or campaigns to inventory units | Assignment LP | Allocation variables x_{ij}; often integral without explicitly forcing integrality in the simple bipartite case. |
| Penalize deviation from a target, smooth pacing changes, or minimize squared error | Convex QP | Quadratic penalty captures "don't move too much" or "stay near target" while keeping convexity. |
| Need yes/no combinatorial choices, packages, or hard frequency bundles | MIP / integer program | Not covered deeply here; show why convex LP intuition is still the relaxation. |

## Resources (from the guide)
- Boyd & Vandenberghe — Convex Optimization (the definitive text, free PDF)
- Stanford EE364a (Boyd's course with videos + slides)
- Google OR-Tools (LP/MIP solvers in practice)
- Hungarian algorithm (Wikipedia) (assignment as an LP)

## SOTA papers (from the guide)
- Convex Optimization (Boyd & Vandenberghe, 2004)

## Notes / caveats
- This is genuine math; keep the formulas, but tie every symbol to an ads decision: budget, inventory, allocation, delivery, or value.
- M27 is the math bridge into M28. Avoid making the notebook solver-heavy; the learner must be able to explain the answer, not just call a library.
- Keep examples CPU-only and tiny enough to solve by hand before the notebook verifies them.
