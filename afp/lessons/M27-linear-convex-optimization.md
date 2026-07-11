# M27 · Linear & convex optimization
> **Domain:** Domain 6 · Optimization & Marketplace · **Maps to:** Event Ads perf, Search Ads, Instream Ads perf · **Skip if you can already…** write an LP and explain duals / shadow prices

## Overview

Optimization is the language underneath ads allocation. A marketplace decides which eligible Event Ad, Instream Ad, or Search Ad should receive scarce attention while respecting budget, inventory, delivery, frequency, and member-experience constraints. This module gives you the math bridge into M28: formulate the problem, recognize when it is convex, and read the economic meaning of the dual variables.

**By the end you can answer:**
- What is a convex set/function, and why does convexity matter for optimization?
- How do you formulate an LP: objective, variables, constraints, and standard form?
- What is a QP, and when does it arise in ads or allocation problems?
- What are weak and strong duality?
- What do dual variables / shadow prices mean?
- What are the KKT conditions, and how do they certify an optimum?
- How do you solve a tiny 2-variable LP graphically and read the shadow price of a binding constraint?
- How is assignment/allocation written as an LP?

Two sub-lessons:

- **M27.1 LPs & QPs: formulation, convexity, and allocation variables** — turning an ads story into variables, objective, constraints, and a solver-ready LP/QP.
- **M27.2 Duality, shadow prices & KKT: what constraints are worth** — reading constraints as marketplace prices and certifying an optimum.

<p class="cur-colab"><a class="cur-colab-btn" href="https://colab.research.google.com/github/niamleeson/ml-math/blob/main/afp/notebooks/M27-linear-convex-optimization.ipynb" target="_blank" rel="noopener">▶ Open the runnable toy-example notebook (gradient descent on a convex bowl + the diverging step-size break case) in Google Colab</a></p>

---

## M27.1 · LPs & QPs: formulation, convexity, and allocation variables

**The idea.** An optimization problem has **decision variables** (what you choose), an **objective** (what you maximize/minimize), and **constraints** (what must be true). For ads, the variables are usually allocation amounts: impressions to campaigns, campaigns to query slots, or delivery probabilities for eligible inventory.

**Everyday analogy.** Packing a delivery truck is an optimization problem: choose how much of each divisible load to carry, maximize the total delivery value, and obey weight and volume limits. The **decision variables** are the load amounts, the **objective** is total value, and the **constraints** are the truck's capacity limits. If the feasible packing choices form the no-holes region of an LP, and a convex minimization objective looks like a smooth bowl with one bottom, a solver can certify the best answer rather than get stuck in a false minimum.

A set is **convex** if the line segment between any two feasible points stays feasible. A function is convex if its graph has no hidden valleys. Convexity matters because a local optimum is global, and solvers can certify that they found the best feasible answer. Linear programs are convex; convex quadratic programs are convex when the quadratic penalty matrix is positive semidefinite.

**LP vs QP, concretely.**

- **LP example:** choose divisible Event Ads allocations $x_A,x_B$ to maximize $2x_A+3x_B$ subject to truck-like capacities $x_A+2x_B\le10$ and $3x_A+x_B\le12$. Everything is linear: doubling an allocation doubles its value and capacity use.
- **QP example:** choose pacing allocations that should stay near targets 5 and 5 while total eligible supply is only 8:
  $$\min_{x_A,x_B}\ (x_A-5)^2+(x_B-5)^2\quad \text{s.t.}\quad x_A+x_B\le8,\ x_A,x_B\ge0.$$
  The squared deviation is convex and penalizes being far from the target more than being slightly off; the optimum is $x_A=x_B=4$.

The standard LP shape for this module is:

$$\max_x\ c^T x\quad \text{s.t.}\quad Ax \le b,\ x \ge 0.$$

Here $x$ is the vector of allocation variables, $c$ is value per unit allocation, $Ax \le b$ encodes budgets/inventory/caps, and $x \ge 0$ says you cannot allocate negative impressions. A constraint is **binding** if it holds with equality at the optimum; it is **slack** if unused capacity remains.

**QP extension.** A quadratic program adds a quadratic term, for example:

$$\min_x\ \frac{1}{2}x^TQx + q^Tx\quad \text{s.t.}\quad Ax \le b,$$

with $Q \succeq 0$ for convexity. In ads, QPs appear when you penalize sudden pacing changes, squared deviation from a spend target, or risk/variance while still respecting linear constraints.

**Worked example — write and solve a tiny Event Ads allocation LP.** Suppose two eligible Event Ads campaigns can consume scarce opportunity over a small horizon. Let:

- $x_A$ = allocation amount for campaign A.
- $x_B$ = allocation amount for campaign B.
- Campaign A creates 2.00 expected-value units per allocation.
- Campaign B creates 3.00 expected-value units per allocation.
- Budget capacity: $x_A + 2x_B \le 10$.
- Inventory/eligibility capacity: $3x_A + x_B \le 12$.

The LP is:

$$
\begin{aligned}
\max_{x_A,x_B}\quad & 2x_A + 3x_B \\
\text{s.t.}\quad & x_A + 2x_B \le 10 && \text{budget capacity}\\
& 3x_A + x_B \le 12 && \text{eligible inventory capacity}\\
& x_A, x_B \ge 0.
\end{aligned}
$$

This is exactly the form $\max c^Tx$ subject to $Ax \le b$:

$$
c=\begin{bmatrix}2\\3\end{bmatrix},\quad
A=\begin{bmatrix}1&2\\3&1\end{bmatrix},\quad
b=\begin{bmatrix}10\\12\end{bmatrix}.
$$

To solve it by hand, check the feasible polygon's vertices:

| Vertex | Why feasible | Objective $2x_A+3x_B$ |
|---|---|---:|
| $(0,0)$ | no allocation | 0.0 |
| $(4,0)$ | inventory binds: $3(4)=12$ | 8.0 |
| $(0,5)$ | budget binds: $2(5)=10$ | 15.0 |
| $(2.8,3.6)$ | both constraints bind | 16.4 |

The intersection comes from solving:

$$x_A+2x_B=10,\quad 3x_A+x_B=12,$$

which gives $x_B=3.6$ and $x_A=2.8$. The optimum is therefore $(2.8,3.6)$ with value $16.4$. Graphically, the objective line slides outward until it touches the feasible polygon at this vertex.

```python
vertices = [(0, 0), (4, 0), (0, 5), (2.8, 3.6)]
best = max(vertices, key=lambda x: 2*x[0] + 3*x[1])
assert best == (2.8, 3.6)
```

**Assignment as an LP.** A Search Ads or Instream Ads allocation can also be written with binary-looking variables $x_{ij}$: advertiser $i$ gets slot $j$ if $x_{ij}=1$, otherwise 0. The LP relaxation is:

$$
\max_x\ \sum_i\sum_j v_{ij}x_{ij}
$$

subject to each advertiser taking at most one slot and each slot holding at most one advertiser:

$$
\sum_j x_{ij} \le 1\quad \forall i,\qquad
\sum_i x_{ij} \le 1\quad \forall j,\qquad
x_{ij}\ge0.
$$

For a tiny two-advertiser, two-slot case with values:

$$
V=\begin{bmatrix}0.18&0.10\\0.12&0.16\end{bmatrix},
$$

choosing A → slot 1 and B → slot 2 gives $0.18+0.16=0.34$, better than A → slot 2 and B → slot 1, which gives $0.10+0.12=0.22$. In simple bipartite assignment, the LP often returns integral assignments because of the structure of the constraint matrix; in production, extra constraints can make integer or mixed-integer methods necessary.

**You'll be able to say:** *"A convex problem has a no-holes feasible region and an objective with no bad local traps, so solvers can certify a global optimum. An LP maximizes or minimizes a linear objective subject to linear constraints, e.g. max $c^Tx$ s.t. $Ax\le b, x\ge0$. A QP adds a quadratic penalty for smoothness, risk, or target deviation. Ads assignment is an LP over allocation variables $x_{ij}$ with supply and demand constraints."*

---

## M27.2 · Duality, shadow prices & KKT: what constraints are worth

**The idea.** The dual turns constraints into prices. If a budget, inventory, delivery, or frequency constraint is tight, relaxing it can improve the objective; the corresponding **dual variable** is the marginal value of one more unit of that resource. In ads language, a dual value is a **shadow price** on scarce capacity.

**Everyday analogy.** Go back to the delivery truck: if the truck is full by weight, one extra kilogram of capacity lets you add some extra package value, and that marginal gain is the **shadow price** of weight. If the truck still has unused volume, one more liter of volume is worth zero right now, because it is not the limiting constraint. The dual prices tell you what you would rationally pay to relax each tight limit by one unit.

For the primal LP:

$$\max_x\ c^Tx\quad \text{s.t.}\quad Ax\le b,\ x\ge0,$$

with a nonnegative dual variable $y_i$ for each constraint, the dual is:

$$\min_y\ b^Ty\quad \text{s.t.}\quad A^Ty\ge c,\ y\ge0.$$

**Primal vs dual, concretely.**

- **Primal:** decide the actual allocation, e.g. $x_A=2.8,\ x_B=3.6$ in the Event Ads LP below, producing value $2(2.8)+3(3.6)=16.4$ while exactly using the budget and inventory capacities.
- **Dual:** decide the resource prices that make every campaign's value covered, e.g. budget price $y=1.4$ and inventory price $z=0.2$. Those prices value the available resources at $10(1.4)+12(0.2)=16.4$, the same number as the primal optimum.

**Weak duality** says any dual-feasible $y$ gives an upper bound on any primal-feasible $x$: $c^Tx \le b^Ty$. **Strong duality** says that, for LPs under the usual feasibility/boundedness conditions, the best primal value equals the best dual value. That equality is why dual prices are meaningful rather than just heuristic scores.

**KKT conditions.** For convex problems, the Karush-Kuhn-Tucker conditions certify optimality:

1. **Primal feasibility:** the allocation obeys the original constraints.
2. **Dual feasibility:** the prices obey the dual constraints.
3. **Stationarity:** no feasible infinitesimal move can improve the Lagrangian.
4. **Complementary slackness:** a constraint can have positive price only if it is binding.

For LPs, complementary slackness is especially memorable:

$$y_i(b_i-a_i^Tx)=0.$$

If resource $i$ has unused slack, its price is zero. If its price is positive, the resource is fully used.

**Shadow price / KKT / complementary slackness on the same small LP.** In the Event Ads LP below, the primal solution is $x_A=2.8,\ x_B=3.6$ and both constraints are binding:

| Concept | Concrete instance | What it tells you |
|---|---|---|
| **Shadow price** | The budget dual value is $y=1.4$; increasing budget RHS from 10 to 11 raises the optimum from 16.4 to 17.8. | One more unit of budget capacity is worth 1.4 expected-value units locally. |
| **KKT certificate** | Primal feasibility holds; dual feasibility holds; stationarity holds because $A^T[y,z]=[1.4+3(0.2),\ 2(1.4)+0.2]=[2,3]=c$; complementary slackness holds. | These four checks certify that the allocation is globally optimal, not just visually good. |
| **Complementary slackness** | Budget slack is $10-(2.8+2(3.6))=0$ and inventory slack is $12-(3(2.8)+3.6)=0$, so positive prices $y=1.4,\ z=0.2$ are allowed. A nonbinding frequency cap with 27 unused exposures would have price 0. | Scarce, fully used constraints can carry price; unused constraints cannot. |

**Worked example — derive the dual and read shadow prices.** Use the M27.1 LP:

$$
\begin{aligned}
\max_{x_A,x_B}\quad & 2x_A + 3x_B \\
\text{s.t.}\quad & x_A + 2x_B \le 10 \\
& 3x_A + x_B \le 12 \\
& x_A,x_B\ge0.
\end{aligned}
$$

Let $y$ be the dual price of budget capacity and $z$ be the dual price of inventory capacity. The dual is:

$$
\begin{aligned}
\min_{y,z}\quad & 10y + 12z \\
\text{s.t.}\quad & y + 3z \ge 2 && \text{campaign A's value must be covered}\\
& 2y + z \ge 3 && \text{campaign B's value must be covered}\\
& y,z\ge0.
\end{aligned}
$$

At the primal optimum, both $x_A=2.8$ and $x_B=3.6$ are positive. Complementary slackness then makes both dual covering constraints tight:

$$y+3z=2,\qquad 2y+z=3.$$

Solving gives:

$$y=1.4,\qquad z=0.2.$$

The dual objective is:

$$10(1.4)+12(0.2)=14+2.4=16.4,$$

which matches the primal optimum. Strong duality certifies that $(2.8,3.6)$ is optimal.

Now interpret the prices:

- $y=1.4$ means one more unit of budget capacity is worth about 1.4 expected-value units, as long as the same constraints remain binding.
- $z=0.2$ means one more unit of inventory capacity is worth about 0.2 expected-value units.

Check the budget shadow price by perturbing the RHS from 10 to 11 while inventory stays at 12:

$$x_A+2x_B=11,
\qquad 3x_A+x_B=12.$$

Solving gives $x_A=2.6$, $x_B=4.2$, and objective $2(2.6)+3(4.2)=17.8$. The value rose from 16.4 to 17.8, exactly $1.4$. That is the shadow price in action.

If a constraint is slack, do not invent value for it. Suppose an Instream Ads frequency cap is $\le 100$ exposures and the allocation uses only 73. Relaxing the cap to 101 changes nothing locally, so its shadow price should be zero. A positive shadow price belongs to a binding scarcity, not to every constraint written in the model.

**Ads interpretation.** In Event Ads, a high budget shadow price says more spend capacity would unlock valuable eligible impressions. In Search Ads, a high inventory shadow price says the query/slot supply is scarce relative to demand. In guaranteed delivery, a dual price on a delivery requirement says how costly it is to force another reserved impression. In M28, these prices sit beside auction values and pacing controls.

**You'll be able to say:** *"The dual converts constraints into prices. Weak duality says every dual-feasible solution bounds the primal; strong duality says LP primal and dual optima match. A positive shadow price is the marginal value of relaxing a binding constraint. KKT certifies optimality through primal feasibility, dual feasibility, stationarity, and complementary slackness: slack constraints have zero price, and positive-price constraints bind."*

---

## Resources
- Boyd & Vandenberghe — Convex Optimization (the definitive text, free PDF)
- Stanford EE364a (Boyd's course with videos + slides)
- Google OR-Tools (LP/MIP solvers in practice)
- Hungarian algorithm (Wikipedia) (assignment as an LP)

## Papers
- Convex Optimization (Boyd & Vandenberghe, 2004)
