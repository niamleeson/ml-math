# Math · Part 23 — Operations research  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four
> exposition principles: warm voice, complete step-by-step derivations, case-by-case derivation decisions,
> and plain symbol glosses. This plan rewrites the scaffold into lesson-level authoring specs. Numeric claims
> below were checked with `python3` using `scipy.optimize.linprog`, `itertools`, and hand dynamic-programming
> calculations.

**Section:** Operations research · **Lessons:** 17 · **Breadcrumb:** `Mathematics · Applied / Computational` · **Priority:** MEDIUM

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate (shared app-set with a sibling) | 0 / 17 |
| Templated / thin motivation | 0 / 17 |
| Key formula not in display form | 8 / 17 |
| Unclosed-`$` LaTeX bug | 1 / 17 |
| Derivation specs in this rewrite | 16 / 17 |
| Explain-only specs in this rewrite | 1 / 17 |

**The core change:** keep the section's already strong, concrete applications, but deepen them so every lesson
has a complete concept-specific derivation or an explicit explain-only reason, every symbol is named before it
is used, and each application carries a re-derivable number tied to the lesson's own idea. `math-23-11` is the
full-prose model entry because dynamic programming is central to OR and connects directly to Viterbi decoding
and reinforcement learning.

**Compute log.** Verified examples: bakery LP optimum $(15,10)$ with value $130$; dual shadow prices $(1,2)$
with dual value $130$; simplex corner values $0,6,10,9,6$; binary knapsack relaxation bound $14.5$ and integer
incumbent $14$; transportation optimum cost $125$; assignment optimum cost $9$; two-stage DP value $12$;
$M/M/1$ queue with $(\lambda,\mu)=(8,10)$ gives $\rho=0.8$, $L=4$, and $W=0.5$ hours; EOQ with
$(D,K,h)=(12000,50,2)$ gives $Q^\ast\approx774.6$ and cost $1549.19$.

---

## Priority & systemic issues

- No whole-section §5 boilerplate block was detected. The repair is not replacement of copied app sets; it is
deepening: complete derivations, symbol glosses, and tighter app numbers.
- Promote the LP, transportation, queueing, scheduling, stochastic, and robust formulas into display math.
- Keep ML connections explicit: resource allocation, queueing for serving, scheduling for GPU jobs, Viterbi and
sequence decoding, and reinforcement learning as finite-horizon dynamic programming.
- **LaTeX bug to fix:** `math-23-08`, application **Cloud data transfer**, `numbers` field currently ends
`costs $1.40+1.50=2.90$ dollars$.`; fix to `costs $1.40+1.50=2.90$ dollars.` or `costs $2.90$ dollars.`

---

## Model entry (full prose)

### `math-23-11` — Dynamic programming  — **full-depth model entry**

**Connections (§1).**
> This lesson builds on optimization, recursion, and graph thinking. In earlier lessons, an LP or flow model
> solved one large set of constraints at once. Dynamic programming takes a different route: it breaks a decision
> process into states, solves the smaller future problem from each state, and then uses those saved values to
> choose the current action.
>
> The same pattern appears across machine learning systems. Viterbi decoding stores the best score for each tag
> at each token. Reinforcement learning stores the value of a state before choosing an action. Resource planners
> can store the best value for a remaining budget, remaining time, or remaining GPU capacity. The method is useful
> when the future can be summarized by a state rather than by the whole path that led there.

**Motivation & Intuition (§2).**
> Dynamic programming is for decisions that unfold in stages. A greedy method looks only at the immediate gain;
> exhaustive search tries every complete plan. Dynamic programming sits between those extremes. It keeps the
> future in view, but it avoids repeating the same future calculation again and again.
>
> The key idea is the principle of optimality. Once a first action has been chosen and the system has moved to a
> new state, the remaining actions must form an optimal plan for that new state. If they did not, replacing the
> tail with a better tail would improve the whole plan. That observation lets us write the value of a state in
> terms of the values of its next states.
>
> For a finite-horizon problem, let $V_t(s)$ mean the best total reward available from time $t$ onward when the
> current state is $s$. At time $t$, choose an action $a$, earn immediate reward $r_t(s,a)$, and move to
> $T(s,a)$. The best choice is the action with the largest immediate reward plus best future value.

**Definition & Assumptions (§3).** Display the recurrence

$$
V_t(s)=\max_{a\in A(s)}\{r_t(s,a)+V_{t+1}(T(s,a))\}.
$$

**Derive (complete).**
1. Start with a fixed state and time, written as $(t,s)$. This pins down the subproblem whose value is being
computed.
2. List the feasible actions $a\in A(s)$. This restricts the decision to actions allowed from state $s$.
3. For one chosen action $a$, add the immediate reward $r_t(s,a)$. This accounts for the payoff earned now.
4. Apply the transition rule $T(s,a)$ to get the next state. This summarizes everything the future needs to
know after taking $a$.
5. By the principle of optimality, the remaining value is $V_{t+1}(T(s,a))$. This replaces the entire future tail
with the best value for the next subproblem.
6. Add present and future values to get $r_t(s,a)+V_{t+1}(T(s,a))$. This is the value of plans whose first action
is $a$.
7. Maximize over feasible actions. This chooses the best first action and gives the recurrence above.
8. Set a terminal condition such as $V_{T+1}(s)=0$. This gives the backward recursion a place to start.

**Worked 2-stage example.** A planner has 3 GPU-hours to split across two stages. At stage 2, spending
$a=0,1,2,3$ hours gives rewards $0,4,7,9$. Therefore $V_2(0)=0$, $V_2(1)=4$, $V_2(2)=7$, and $V_2(3)=9$.
At stage 1, rewards for spending $0,1,2,3$ hours are $0,5,8,10$. With state $s=3$,

$$
V_1(3)=\max\{0+9,\;5+7,\;8+4,\;10+0\}=12.
$$

Spending 1 hour first or 2 hours first both achieve value $12$.

**Symbols.** $t$ is the stage; $s$ is the state; $A(s)$ is the feasible-action set; $a$ is one action; $r_t(s,a)$
is immediate reward; $T(s,a)$ is the next-state rule; $V_t(s)$ is the optimal future value from $(t,s)$.

**Real-World Applications (§5).**
1. **Shortest paths.** If distances from the next city to the goal are $V(B)=5$ and $V(C)=3$, and edges from
$A$ cost $2$ and $6$, then $V(A)=\min\{2+5,6+3\}=7$.
2. **Inventory planning.** With 2 units left, ordering 0 gives shortage cost $8$, while ordering 1 gives setup
plus holding cost $3+1=4$; DP selects cost $4$.
3. **Sequence alignment.** A cell with diagonal $6$, up $3$, and left $4$ under scores $+2,-1,-1$ gives
$\max\{8,2,3\}=8$.
4. **Viterbi decoding.** If a tag path to `NOUN` has previous scores $5$ and $3$, transition scores $2$ and $4$,
and emission score $1$, the new score is $\max\{5+2+1,3+4+1\}=8$.
5. **Reinforcement learning.** With discount $\gamma=0.9$, rewards $2$ and $1$, and next values $10$ and $12$,
the Bellman backup chooses $\max\{2+0.9(10),1+0.9(12)\}=11.8$.
6. **Compiler optimization.** If two code-generation choices cost $3+V=3+7=10$ and $5+4=9$, the DP table stores
cost $9$ for that subexpression.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted content for one lesson in render order. The labels are plan
shorthand; the app should render them as flowing prose in a plain textbook voice.

### `math-23-01` — Modeling in operations research  · explain-only

**Connections (§1).**
> This lesson begins with the basic act that makes operations research useful: turning a practical decision into a
> mathematical object. The reader already knows how quantities, inequalities, and objectives describe real
> situations. Operations research adds discipline to that translation, so choices become variables, limitations
> become constraints, and preferences become an objective. This modeling habit supports every later lesson in the
> section, from linear programming to queues and ML resource allocation.

**Motivation & Intuition (§2).**
> A real planning problem often arrives as a story. A bakery has flour and oven time, a cloud team has CPU and GPU
> capacity, or a hospital has staff and patients. Before solving anything, the modeler must decide what the
> controllable choices are and how each choice consumes or produces measurable quantities.
>
> The main skill is faithful translation. Every symbol should correspond to a real choice, resource, requirement,
> or cost, and every coefficient should carry units from the story. When the translation is careful, the model is
> not just algebra; it is a compact record of the operational tradeoffs in the original problem.

**Definition & Assumptions (§3).** This is an explain-only lesson rather than a formula derivation.

**Derive (complete).** explain-only. This lesson defines a modeling habit rather than proving a formula. Show
translation by units: if one loaf uses 2 kg flour and one cake uses 1 kg, then $x$ loaves and $y$ cakes use
$2x+y$ kg, so a 40 kg limit becomes $2x+y\le40$.

**Symbols.** $x,y$ are decision quantities; $P$ is profit; $C$ is cost; coefficients such as $2$ or $7$ carry
units from the story; $\le$ and $\ge$ encode upper limits and minimum requirements.

**Real-World Applications (§5).**
1. **Factory mix:** 10 units using 3 hours and 15 using 2 hours consume $60$ hours.
2. **Cloud capacity:** 8 CPU nodes at 40 jobs/hour and 3 GPU nodes at 120 jobs/hour give $680$ jobs/hour.
3. **Ad spend:** $4000$ at $0.50$ per click and $2000$ at $1.00$ per click buys $10000$ clicks.
4. **Hospital staffing:** 18 nurses at 5 patients each cover $90$ of 100 patients.
5. **Dataset labeling:** 500 expert labels at $2$ and 3000 crowd labels at $0.30$ cost $1900$.
6. **Routing:** 12 km + 18 km + 9 km costs $39(0.20)=7.80$ dollars.

### `math-23-02` — Linear programming formulation  · AUTHOR derivation

**Connections (§1).**
> This lesson takes the modeling language from the previous lesson and gives it a standard linear form. The reader
> has already seen variables, objectives, and constraints as separate pieces. Linear programming organizes those
> pieces into vectors and matrices so many activities and many resource limits can be handled at once. This form is
> the base language for simplex, duality, sensitivity analysis, and many allocation models later in the section.

**Motivation & Intuition (§2).**
> A linear program is the right first model when contributions add cleanly. If one activity uses a certain amount
> of a resource, then twice as much activity uses twice as much resource. If two activities are both chosen, their
> resource uses and values simply add together.
>
> This straight-line structure is restrictive, but it is also powerful. It makes the feasible region a polyhedron
> and turns the objective into a direction through that region. The formulation step is therefore about naming the
> activities, collecting their coefficients, and writing all limits in one consistent matrix notation.

**Definition & Assumptions (§3).** Use the standard linear programming form.

**Derive (complete).**
1. Name the decision vector $x=(x_1,\ldots,x_n)^T$. This collects all activity levels in one object.
2. Put objective coefficients in $c=(c_1,\ldots,c_n)^T$. This records value per unit of each activity.
3. Multiply and add to get $c^Tx=\sum_j c_jx_j$. This gives total value by additivity.
4. For resource $i$, write use $a_{i1}x_1+\cdots+a_{in}x_n$. This accounts for all activities consuming the same resource.
5. Bound that use by $b_i$, giving $\sum_j a_{ij}x_j\le b_i$. This encodes the resource limit.
6. Stack all resource rows into $Ax\le b$. This is the matrix form of all constraints.
7. Add $x\ge0$. This prevents negative activity levels.
8. State standard form: maximize $c^Tx$ subject to $Ax\le b$, $x\ge0$.

**Symbols.** $x$ decision vector; $c$ objective coefficients; $A$ constraint matrix; $a_{ij}$ resource used by
one unit of activity $j$ in constraint $i$; $b$ right-hand-side limits.

**Real-World Applications (§5).**
1. **Bakery LP:** $A=\begin{bmatrix}2&1\\1&3\end{bmatrix}$, $b=(40,45)^T$, $c=(4,7)^T$; optimum is $(15,10)$ with value $130$.
2. **Portfolio:** $0.6x+0.2y\le0.4$ caps risk exposure at 40%.
3. **Ad impressions:** $1000s+2500v\ge50000$ requires enough impressions.
4. **Energy dispatch:** $3g+5c$ MW from gas and coal gives 160 MW at $(20,20)$.
5. **Data-center scheduling:** $800g+300c\ge5000$ examples and $4g+c\le25$ energy units defines feasibility.
6. **Fair allocation:** $x_1+x_2+x_3=90$ shares exactly 90 GPU-hours.

### `math-23-03` — The simplex method  · AUTHOR derivation

**Connections (§1).**
> This lesson follows naturally from linear programming formulation. Once an LP has been written, the feasible
> region has corners, edges, and faces, and the linear objective improves in a consistent direction. The simplex
> method uses that geometry without needing to draw it. It also prepares the reader for dual prices and sensitivity,
> because the same tableau information reveals both an optimal plan and local economic meaning.

**Motivation & Intuition (§2).**
> A linear objective over a polyhedron reaches its optimum at a corner when an optimum exists. Checking every corner
> directly can be far too expensive, because a model with many constraints can have a huge number of corners. The
> simplex method improves this by moving only from one feasible corner to a neighboring corner that can improve the
> objective.
>
> Slack variables make the corners algebraic. A basis names which variables are currently solved for, and the
> nonbasic variables are set to zero. Reduced costs tell which currently zero variable would improve the objective
> if it entered the basis, while the ratio test keeps the move inside the feasible region.

**Definition & Assumptions (§3).** Start from an LP in inequality form and move through adjacent basic feasible solutions.

**Derive (complete).**
1. Start with $Ax\le b$, $x\ge0$. This is the LP feasible region.
2. Add slack variables $s\ge0$ to write $Ax+s=b$. This turns unused resource into variables.
3. Choose a basis of variables and set nonbasic variables to zero. This gives one corner solution.
4. Compute reduced costs in the objective row. A positive reduced cost in a maximization problem shows a
nonbasic variable that can increase the objective.
5. Select an entering variable with positive reduced cost. This chooses the edge to move along.
6. Use the ratio test $b_i/a_{ij}$ over positive pivot-column entries. This finds which basic variable reaches
zero first and keeps feasibility.
7. Pivot to swap entering and leaving variables. This moves to the adjacent corner.
8. Repeat until no positive reduced cost remains. Then no neighboring corner improves the objective, and LP
optimality follows.

**Symbols.** $s$ slack variables; basis = currently solved variables; reduced cost = objective improvement per
unit of entering variable; pivot = row operation swapping variables.

**Real-World Applications (§5).**
1. **Toy LP:** for $\max 3x+2y$ with $x+y\le4$, $x\le2$, $y\le3$, corner values are $0,6,10,9,6$; simplex reaches $(2,2)$ with value $10$.
2. **Refinery blend:** entering a crude with reduced profit $5$ raises profit until a sulfur slack hits zero.
3. **Advertising allocation:** a channel with reduced profit $0.40$ per unit enters before one with $0.10$.
4. **Diet problem:** a nutrient constraint with ratio $30/6=5$ leaves before one with $50/5=10$.
5. **ML infrastructure:** a GPU-batch variable enters if it reduces runtime by 8 minutes per unit.
6. **Supply chain:** a lane with zero reduced cost has an alternate optimum of the same cost.

### `math-23-04` — LP duality  · AUTHOR derivation

**Connections (§1).**
> This lesson builds on the LP formulation and the simplex view of active constraints. A primal LP asks for the
> best feasible plan. The dual LP asks for prices on the same constraints that certify how good any plan could be.
> That pricing view connects optimization to resource economics, network cuts, support vectors, and regularized
> machine learning models.

**Motivation & Intuition (§2).**
> A production plan earns value by consuming limited resources. If each resource is assigned a nonnegative price,
> then every feasible plan has a priced resource cost. When those prices are high enough to cover the profit of
> every activity, the priced total resource supply becomes an upper bound on any primal objective value.
>
> Duality turns this certificate into its own optimization problem. Instead of only searching for a good plan, we
> also search for the tightest valid upper bound on all plans. When the primal value and dual value meet, the plan
> is optimal and the prices explain which constraints are truly scarce.

**Definition & Assumptions (§3).** Pair a maximization LP with its dual minimization problem.

**Derive (complete).**
1. Start with the primal $\max c^Tx$ subject to $Ax\le b$, $x\ge0$. This is the plan-value problem.
2. Choose nonnegative prices $y\ge0$ for the constraints. Nonnegative prices preserve inequality direction.
3. Multiply $Ax\le b$ by $y^T$ to get $y^TAx\le y^Tb$. This prices total resource use by total available resources.
4. Require $A^Ty\ge c$. This says resource prices cover each activity's profit.
5. Multiply by $x\ge0$ to get $x^TA^Ty\ge c^Tx$. This transfers the activity-wise price bound to the whole plan.
6. Use $y^TAx=x^TA^Ty$. This is the same scalar written two ways.
7. Chain the inequalities: $c^Tx\le x^TA^Ty=y^TAx\le y^Tb$. This proves weak duality.
8. Define the dual as minimizing the tightest such upper bound: $\min b^Ty$ subject to $A^Ty\ge c$, $y\ge0$.
9. Add complementary slackness: $y_i(b_i-A_ix)=0$ and $x_j((A^Ty)_j-c_j)=0$. This states that unused resources
have zero price and unprofitable-at-price activities are zero.

**Symbols.** $y$ dual variables or shadow prices; $A_i$ a constraint row; $b_i-A_ix$ slack; $(A^Ty)_j-c_j$ dual
slack for activity $j$.

**Real-World Applications (§5).**
1. **Bakery dual:** $2u+v\ge4$, $u+3v\ge7$, minimizing $40u+45v$ gives $(u,v)=(1,2)$ and value $130$.
2. **Certificate:** primal value $130$ and dual value $130$ prove optimality.
3. **Shadow price:** one extra hour with $v=2$ raises value by about $2$ while the basis holds.
4. **SVM:** support vectors satisfy complementary slackness with positive multipliers.
5. **Network cuts:** a cut capacity $5$ upper-bounds any $s$-$t$ flow by $5$.
6. **Regularization:** a dual constraint with slack $0.3$ means the corresponding primal coefficient stays zero.

### `math-23-05` — Sensitivity analysis  · deepen derivation

**Connections (§1).**
> This lesson uses the shadow prices introduced by LP duality. After an LP has been solved, the next practical
> question is often how stable the answer is. Sensitivity analysis reads local information from the current optimal
> basis and turns it into a report about bottlenecks, safe changes, and approximate value changes. That makes it a
> bridge between solving a model and using the solution in planning.

**Motivation & Intuition (§2).**
> An optimal LP solution is not just a single point. It comes with active constraints, unused resources, and dual
> prices that describe the current corner. Small changes to a right-hand side or objective coefficient may leave
> that same corner structure in control, even though the numerical value changes.
>
> Sensitivity analysis focuses on this local region of stability. A shadow price estimates how much the objective
> changes when one resource limit is adjusted slightly. The estimate is useful precisely because it is local: once
> the active set changes, a different basis and different prices may apply.

**Definition & Assumptions (§3).** Use the current optimal basis and its dual prices.

**Derive (complete).**
1. Solve an LP and keep its optimal dual prices $y^\ast$. These prices describe the current basis.
2. Increase one right-hand side from $b_i$ to $b_i+\Delta$. This adds resource $i$.
3. The dual objective changes from $b^Ty^\ast$ to $b^Ty^\ast+y_i^\ast\Delta$. This is one multiplication by the
changed right-hand side.
4. By strong duality, the primal optimal value changes at the same rate while the basis remains optimal.
5. Therefore the shadow-price estimate is $\Delta z\approx y_i^\ast\Delta$. This is local, not global.

**Symbols.** $b_i$ right-hand side; $\Delta$ small change; $y_i^\ast$ shadow price; basis = active corner
structure; allowable range = changes that keep that basis optimal.

**Real-World Applications (§5).**
1. **Bakery flour:** with shadow price $1$, 3 extra kg flour predicts $3$ more dollars.
2. **Bakery time:** with shadow price $2$, 4 extra hours predicts $8$ more dollars.
3. **Capacity expansion:** a GPU-hour shadow price of $12$ makes 10 hours worth about $120$.
4. **Budget planning:** a nonbinding budget has shadow price $0$, so adding $500$ changes value by $0$ locally.
5. **SLA bottleneck:** a latency constraint price of $30$ per ms means relaxing by 2 ms lowers penalty by $60$.
6. **Data labeling:** a review-hour price of $4$ means 25 extra hours are worth about $100$.

### `math-23-06` — Integer programming  · deepen derivation

**Connections (§1).**
> This lesson begins with the same variables and constraints as linear programming, then adds the requirement that
> some choices must be whole numbers. Many operational decisions are indivisible: a warehouse is opened or not, a
> feature is selected or not, and a serving system runs an integer number of replicas. Integer programming keeps
> those decisions faithful to deployment while still using LP relaxations for bounds and guidance.

**Motivation & Intuition (§2).**
> Linear programming allows fractional activity levels, which is appropriate for divisible quantities such as hours,
> flow, or budget. Some choices cannot be divided in that way. A plan with $4.3$ replicas or $0.6$ of a warehouse
> may be useful as a bound, but it is not a deployable decision.
>
> Integer programming handles this by restricting variables to integers or to binary values. Dropping that
> restriction gives the LP relaxation, which is easier to solve and contains all integer-feasible plans. Because
> the relaxation has a larger feasible set, its objective value gives a bound on the true integer optimum.

**Definition & Assumptions (§3).** Compare the integer feasible set with its continuous relaxation.

**Derive (complete).**
1. Start with integer feasible set $F_I=\{x:Ax\le b, x\in\mathbb Z^n\}$. This is the true set of allowed plans.
2. Drop integrality to get $F_R=\{x:Ax\le b, x\in\mathbb R^n\}$. This is the relaxation.
3. Observe $F_I\subseteq F_R$. Every integer-feasible point is also relaxation-feasible.
4. For maximization, maximizing over the larger set cannot produce a smaller value. Thus $z_R\ge z_I$.
5. For minimization, minimizing over the larger set cannot produce a larger value. Thus $z_R\le z_I$.
6. Use the relaxation value as a bound, not necessarily as a feasible integer solution.

**Symbols.** $F_I$ integer feasible set; $F_R$ relaxation feasible set; binary variable $x_j\in\{0,1\}$; $z_I$ and
$z_R$ integer and relaxation objective values.

**Real-World Applications (§5).**
1. **Facility location:** 3 open warehouses at $2000$ each cost $6000$.
2. **Feature selection:** choosing 12 binary features from 200 is an integer restriction.
3. **Knapsack:** relaxation value $14.5$ bounds integer value $14$ for weights $(5,4,3)$ and values $(10,6,4)$.
4. **Crew scheduling:** 7 whole shifts cover $7(8)=56$ staff-hours.
5. **A/B portfolio:** binary choices with costs 3, 4, 5 fit a budget 7 by choosing costs 3 and 4.
6. **Serving optimization:** 5 replicas are allowed, while $4.3$ replicas are not a deployable count.

### `math-23-07` — Branch and bound  · AUTHOR derivation

**Connections (§1).**
> This lesson follows integer programming and explains how LP relaxations become a search method. The reader has
> seen that a relaxation gives an optimistic bound, not necessarily an integer solution. Branch and bound uses that
> bound inside a decision tree, splitting fractional cases and discarding cases that cannot improve the best known
> integer answer. It is a practical foundation for many mixed-integer solvers.

**Motivation & Intuition (§2).**
> Integer programs are hard because the feasible set is broken into discrete points. Trying every combination is
> usually impossible. Branch and bound organizes the combinations into subproblems, each with extra restrictions,
> so the search can reason about whole groups of possibilities at once.
>
> The bound is what makes the search efficient. If a node's LP relaxation is infeasible, the node has no integer
> solutions. If its optimistic objective cannot beat the incumbent, it is safe to prune the node without exploring
> its descendants. Fractional relaxation solutions are handled by branching into integer cases that cover all
> possibilities.

**Definition & Assumptions (§3).** Use LP relaxations to bound subproblems in an integer search tree.

**Derive (complete).**
1. Solve the LP relaxation at a node. This gives an optimistic bound for that node.
2. If the relaxation is infeasible, prune the node. No integer solution can live inside an empty relaxation.
3. If the relaxation solution is integer, compare it to the incumbent. It is a valid candidate solution.
4. If the relaxation bound is no better than the incumbent, prune. Even the optimistic value cannot improve the
best known answer.
5. If some variable has fractional value $x_j=2.4$, branch into $x_j\le2$ and $x_j\ge3$. These two cases cover
all integer possibilities for $x_j$.
6. Repeat on open nodes until none remain. The incumbent is then optimal.

**Symbols.** Node = subproblem; relaxation bound = optimistic objective; incumbent = best integer solution
known; branch = added integer restriction; prune = discard a node safely.

**Real-World Applications (§5).**
1. **Binary knapsack:** relaxation $x=(1,0.75,0)$ has bound $14.5$; incumbent $(1,0,1)$ has value $14$.
2. **Feature subset:** a node bound of $0.842$ AUC cannot beat incumbent $0.851$, so prune it.
3. **GPU scheduling:** a fractional start-time relaxation at 7.5 hours branches to before/after a job order.
4. **Warehouse location:** if opening warehouse 2 has $x_2=0.6$, branch to closed $0$ or open $1$.
5. **Neural architecture search:** a branch with validation bound $91.2$ cannot beat incumbent $91.7$.
6. **Routing:** if a relaxed route uses edge $e$ at $0.5$, branch on excluding or including that edge.

### `math-23-08` — The transportation problem  · AUTHOR derivation · FIX LaTeX

**Connections (§1).**
> This lesson specializes linear programming to a grid of sources and destinations. The reader already knows how
> constraints can limit resources and require demand to be met. The transportation problem gives those constraints
> a particularly clear structure: each row is a source, each column is a destination, and each cell is a possible
> shipment route. This structure also points toward network flow and assignment models.

**Motivation & Intuition (§2).**
> Many allocation problems are about moving quantity from where it is available to where it is needed. The source
> supplies must be used, the destination demands must be met, and every route has a unit cost. The grid layout keeps
> these three pieces visible at the same time.
>
> The model is linear because total cost is the sum of route cost times shipped amount. Balance matters: if total
> supply and total demand match, every row and column can be written as an equality. If they do not match, a dummy
> source or destination represents surplus or unmet demand in a controlled way.

**Definition & Assumptions (§3).** Model shipments on a balanced source-destination grid.

**Derive (complete).**
1. Define $x_{ij}\ge0$ as the amount shipped from source $i$ to destination $j$. This names one route per cell.
2. Multiply by route costs and sum: $\sum_i\sum_j c_{ij}x_{ij}$. This is total shipping cost.
3. For source $i$, add across destinations: $\sum_j x_{ij}=s_i$. This uses all supply from row $i$.
4. For destination $j$, add across sources: $\sum_i x_{ij}=d_j$. This meets demand in column $j$.
5. Require $\sum_i s_i=\sum_j d_j$. This is balance; otherwise add a dummy source or destination.
6. Check optimality with potentials $u_i,v_j$: occupied cells satisfy $u_i+v_j=c_{ij}$, and empty cells must
satisfy $u_i+v_j\le c_{ij}$ for minimization. This is dual feasibility for the transportation LP.

**Symbols.** $x_{ij}$ shipment; $c_{ij}$ unit cost; $s_i$ supply; $d_j$ demand; $u_i,v_j$ row and column dual
potentials.

**Real-World Applications (§5).**
1. **Freight:** supplies $(20,30)$, demands $(10,25,15)$, costs $\begin{bmatrix}2&4&5\\3&1&7\end{bmatrix}$ have optimum cost $125$.
2. **Cloud transfer:** 70 GB at $0.02$ and 30 GB at $0.05$ costs $2.90$ dollars; this is the LaTeX-fix app.
3. **Inventory rebalancing:** moving 12 units at $4$ and 8 at $6$ costs $96$.
4. **Training sharding:** 600 examples to GPU A and 400 to GPU B assign all 1000 examples.
5. **Humanitarian logistics:** supply 80 and demand 50+30 balances exactly.
6. **Minibatch distribution:** sending 256, 256, and 512 samples fills a 1024-sample batch.

### `math-23-09` — The assignment problem  · AUTHOR derivation

**Connections (§1).**
> This lesson narrows the transportation problem to one-to-one matching. Instead of shipping arbitrary amounts,
> each agent supplies one unit and each task demands one unit. The same row-and-column idea remains, but the result
> is a clean model for pairing workers, labels, reviewers, jobs, or slots. It also connects linear programming to
> matching problems in graphs.

**Motivation & Intuition (§2).**
> Assignment problems appear whenever every item on one side must be matched exactly once to an item on the other
> side. A cost or score is attached to each possible match. The model selects a set of cells in the cost matrix so
> that every row and every column is used exactly once.
>
> Although the variables are naturally binary, the assignment constraint matrix has a special integrality property.
> That means the LP relaxation has integer extreme points. The model therefore keeps the clarity of a binary
> matching problem while benefiting from linear programming structure and dual certificates.

**Definition & Assumptions (§3).** Treat assignment as transportation with unit supplies and unit demands.

**Derive (complete).**
1. Define $x_{ij}=1$ if agent $i$ takes task $j$, and $0$ otherwise. This records a match.
2. Add row constraints $\sum_j x_{ij}=1$. This assigns every agent exactly once.
3. Add column constraints $\sum_i x_{ij}=1$. This fills every task exactly once.
4. Minimize $\sum_i\sum_j c_{ij}x_{ij}$. This selects the least-cost set of matches.
5. View it as transportation with all supplies and demands equal to 1. This explains the structure.
6. Use the integrality property of this constraint matrix. The LP relaxation has integer extreme points, so the
binary solution can be found through the LP.
7. Check optimality with row and column potentials $u_i+v_j\le c_{ij}$ and equality on chosen matches.

**Symbols.** $x_{ij}$ binary assignment; $c_{ij}$ match cost; row constraint = one task per agent; column
constraint = one agent per task; potentials certify optimality.

**Real-World Applications (§5).**
1. **Worker-task:** costs $\begin{bmatrix}9&2&7\\6&4&3\\5&8&1\end{bmatrix}$ have optimum assignment $(1\to2,2\to1,3\to3)$ with cost $9$.
2. **Cluster labels:** matching 3 predicted clusters to 3 true labels can maximize 87 correct labels.
3. **Object tracking:** track-to-detection costs 2, 6, and 1 sum to 9.
4. **Recommendation slots:** 4 slots filled by 4 items require exactly 4 ones in $x$.
5. **Reviewer matching:** 20 papers and 20 reviewers make 20 assignments.
6. **GPU placement:** assigning 3 jobs to 3 GPUs with costs 4, 7, and 2 gives total cost 13.

### `math-23-10` — Network flow models  · AUTHOR derivation

**Connections (§1).**
> This lesson moves from source-destination grids to directed graphs. The reader has already seen conservation in
> transportation rows and columns. Network flow uses the same idea on nodes and arcs, where quantity moves through
> intermediate points before reaching a sink. This language supports routing, matching, image segmentation, data
> ingestion, and many capacity-planning models.

**Motivation & Intuition (§2).**
> A flow model tracks movement through a network. Arcs have capacities, sources inject flow, sinks receive it, and
> intermediate nodes simply pass along what they receive. The conservation equations are the core bookkeeping rule:
> except at sources and sinks, inflow must equal outflow.
>
> The objective depends on the task. In a max-flow problem, the goal is to deliver as much as possible from source
> to sink subject to arc capacities. The same variables and conservation constraints can also support minimum-cost
> flow, circulation, and matching formulations.

**Definition & Assumptions (§3).** Put capacity-limited flow variables on directed arcs.

**Derive (complete).**
1. Put a nonnegative flow variable $x_{ij}$ on each directed arc $(i,j)$. This measures movement along that arc.
2. Add capacity bounds $0\le x_{ij}\le u_{ij}$. This prevents using more than the arc can carry.
3. For an intermediate node $k$, sum inflow $\sum_i x_{ik}$. This measures what arrives.
4. Sum outflow $\sum_j x_{kj}$. This measures what departs.
5. Set inflow equal to outflow. This conserves flow at node $k$.
6. Define value $v$ as total flow leaving source or entering sink. This is the amount delivered.
7. Maximize $v$ subject to capacities and conservation. This gives the max-flow LP.

**Symbols.** $x_{ij}$ flow; $u_{ij}$ capacity; $s$ source; $t$ sink; $v$ flow value; conservation = inflow equals
outflow at transshipment nodes.

**Real-World Applications (§5).**
1. **Internet routing:** capacities $s\to a=3$, $s\to b=2$, $a\to t=2$, $b\to t=3$ allow max flow $5$.
2. **Supply chain:** sending 40 through plant A and 60 through plant B delivers 100 units.
3. **Bipartite matching:** 5 unit flows correspond to 5 matches.
4. **Image segmentation:** a cut with capacities 3, 4, and 2 has cut cost 9.
5. **Data ingestion:** links 80 MB/s and 120 MB/s give a 200 MB/s upstream cap.
6. **Evacuation:** roads carrying 30, 50, and 20 people/minute can move 100 people/minute before downstream limits.

### `math-23-12` — Queueing theory  · AUTHOR derivation

**Connections (§1).**
> This lesson shifts from deterministic allocation to systems with random arrivals and service times. The reader
> has already seen capacity constraints in LPs, flows, and schedules. Queueing theory explains what happens when
> demand arrives over time and competes for limited service capacity. The same ideas are useful for web requests,
> GPU clusters, call centers, disk queues, and inference services.

**Motivation & Intuition (§2).**
> A service system can look healthy when average capacity exceeds average demand, but the amount of spare capacity
> matters greatly. Random arrivals bunch together, service times vary, and a temporary backlog can form even when
> the long-run service rate is larger than the arrival rate.
>
> The $M/M/1$ queue is the clean baseline for this effect. It assumes one server, Poisson arrivals, and exponential
> service times. The utilization $\rho$ controls the steady-state distribution, and as arrivals approach service
> capacity, expected system size and waiting time rise sharply.

**Definition & Assumptions (§3).** Analyze the steady-state $M/M/1$ queue.

**Derive (complete).**
1. Let arrivals occur at rate $\lambda$ and service completions at rate $\mu$. This defines the birth-death process.
2. In steady state, flow into state $n+1$ equals flow out: $\pi_n\lambda=\pi_{n+1}\mu$. This balances adjacent states.
3. Rearrange to $\pi_{n+1}=\rho\pi_n$ with $\rho=\lambda/\mu$. This gives the geometric pattern.
4. Repeat to get $\pi_n=(1-\rho)\rho^n$ after normalization. This requires $\rho<1$.
5. Compute expected system size $L=\sum_{n\ge0}n(1-\rho)\rho^n=\rho/(1-\rho)$. This is the geometric mean.
6. Substitute $\rho=\lambda/\mu$ to get $L=\lambda/(\mu-\lambda)$. This is the displayed queue formula.
7. Apply Little's law $L=\lambda W$ to get $W=1/(\mu-\lambda)$.

**Symbols.** $\lambda$ arrival rate; $\mu$ service rate; $\rho$ utilization; $L$ expected number in system; $W$
expected time in system; stability requires $\lambda<\mu$.

**Real-World Applications (§5).**
1. **Web requests:** $\lambda=8$/hour and $\mu=10$/hour give $L=4$ and $W=0.5$ hours.
2. **GPU cluster:** utilization $0.8$ gives queue length $L_q=\rho^2/(1-\rho)=3.2$.
3. **Call center:** $\lambda=18$ and $\mu=24$ calls/hour gives $W=1/6$ hour, or 10 minutes.
4. **Disk queue:** $\lambda=90$, $\mu=100$ ops/s gives $L=9$.
5. **Packet buffer:** $\rho=0.5$ gives $L=1$.
6. **Batch inference:** $\lambda=40$, $\mu=50$ batches/hour gives $W=0.1$ hours, or 6 minutes.

### `math-23-13` — Inventory models  · deepen derivation

**Connections (§1).**
> This lesson applies optimization to stock, replenishment, and buffers. The reader has already seen how
> constraints and costs describe operational tradeoffs. Inventory models focus on a recurring tradeoff: ordering
> too often creates setup cost, while ordering too much creates holding cost. The EOQ formula gives a transparent
> baseline before uncertainty, shortages, or richer supply-chain constraints are added.

**Motivation & Intuition (§2).**
> Inventory is useful because it separates supply timing from demand timing. Keeping more inventory reduces the
> need to place orders frequently, but it also ties up space, money, and handling effort. Keeping less inventory
> saves holding cost, but forces more frequent replenishment.
>
> The economic order quantity model isolates this balance in the simplest steady case. Demand is constant, every
> order has a fixed setup cost, and inventory depletes linearly between orders. The optimal order size is where the
> marginal pressure from ordering cost and holding cost balances.

**Definition & Assumptions (§3).** Use the steady-demand EOQ cost model.

**Derive (complete).**
1. Let annual demand be $D$ and order size be $Q$. This means the number of orders per year is $D/Q$.
2. Multiply by setup cost $K$ to get annual ordering cost $KD/Q$. This charges each order once.
3. Under steady depletion, average inventory is $Q/2$. This is the midpoint of a sawtooth from $Q$ to $0$.
4. Multiply by holding cost $h$ to get annual holding cost $hQ/2$.
5. Add costs: $C(Q)=KD/Q+hQ/2$.
6. Differentiate: $C'(Q)=-KD/Q^2+h/2$. This finds the cost slope.
7. Set $C'(Q)=0$ and solve $h/2=KD/Q^2$. This balances marginal ordering and holding costs.
8. Get $Q^\ast=\sqrt{2KD/h}$.

**Symbols.** $D$ demand per time; $K$ fixed order cost; $h$ holding cost per unit per time; $Q$ order quantity;
$Q^\ast$ economic order quantity.

**Real-World Applications (§5).**
1. **Retail:** $D=12000$, $K=50$, $h=2$ gives $Q^\ast\approx774.6$.
2. **Spare parts:** $D=900$, $K=40$, $h=10$ gives $Q^\ast\approx84.9$.
3. **Cloud buffers:** ordering 200 units with average inventory 100 and holding cost $0.05$ costs $5$ per period.
4. **Feature cache:** demand 10000, setup 20, holding 1 gives $Q^\ast\approx632.5$.
5. **Newsvendor:** ordering 100 for demand 80 leaves 20 excess units.
6. **Data staging:** 10 loads per month at $30$ setup cost cost $300$ in setup.

### `math-23-14` — Scheduling models  · AUTHOR derivation

**Connections (§1).**
> This lesson returns to time as the scarce resource. The reader has already seen capacity limits and integer
> choices; scheduling adds start times, completion times, deadlines, and precedence. These variables make conflicts
> on shared machines explicit. The same modeling language supports factory jobs, project plans, GPU batches, model
> evaluations, and realtime systems.

**Motivation & Intuition (§2).**
> A schedule is more than a list of jobs. It must say when each job starts, when it finishes, and which jobs cannot
> overlap on the same resource. If one task must finish before another begins, that relationship must also appear
> as a constraint.
>
> The formulas are simple time bookkeeping, but they carry the structure of the whole problem. Completion time is
> start time plus processing time. Non-overlap constraints prevent two jobs from using one machine at once.
> Objectives such as makespan or weighted completion time choose which notion of a good schedule matters.

**Definition & Assumptions (§3).** Model start times, completion times, precedence, and resource conflicts.

**Derive (complete).**
1. Define start time $S_j$ and processing time $p_j$ for job $j$. This names the time decision and duration.
2. Compute completion time $C_j=S_j+p_j$. This adds duration to start.
3. For precedence $a$ before $b$, require $S_b\ge S_a+p_a$. This prevents $b$ from starting before $a$ ends.
4. For two jobs on one machine, impose either $S_i+p_i\le S_j$ or $S_j+p_j\le S_i$. This avoids overlap.
5. Define makespan $C_{\max}\ge C_j$ for every job. This makes $C_{\max}$ at least the last completion time.
6. Minimize $C_{\max}$ or $\sum_j w_jC_j$ depending on the scheduling goal.

**Symbols.** $S_j$ start time; $p_j$ processing time; $C_j$ completion time; $d_j$ due date; $L_j=C_j-d_j$
lateness; $C_{\max}$ makespan.

**Real-World Applications (§5).**
1. **Single-machine SPT:** jobs C,A,B with times 1,2,5 have completions 1,3,8 and total 12.
2. **Naive order:** A,B,C gives completions 2,7,8 and total 17.
3. **Project precedence:** if A starts at 0 and $p_A=4$, B must satisfy $S_B\ge4$.
4. **Cloud batch jobs:** two jobs of 3 and 5 hours on one GPU have makespan 8 if run serially.
5. **Model evaluation:** lateness with $C=14$, $d=10$ is $L=4$.
6. **Realtime system:** a job taking 7 ms meets a 10 ms deadline with 3 ms slack.

### `math-23-15` — Stochastic optimization  · AUTHOR derivation

**Connections (§1).**
> This lesson adds uncertainty to the optimization models from earlier in the section. The reader has already seen
> decisions made under fixed coefficients, capacities, costs, and processing times. Stochastic optimization keeps
> the decision structure but treats some data as random. It is especially useful in capacity planning, portfolio
> choice, energy scheduling, newsvendor models, and sampled machine learning objectives.

**Motivation & Intuition (§2).**
> Many decisions must be made before demand, traffic, runtime, or price is fully known. A deterministic model can
> use a single forecast, but that may hide the range of possible outcomes. Stochastic optimization instead scores a
> decision by averaging its realized cost or reward over a probability model.
>
> In practice, the expectation is often approximated with scenarios. Each scenario represents one possible future,
> and the sample average replaces the exact expected value. The solution is therefore tied to both the optimization
> model and the quality of the uncertainty model or sample.

**Definition & Assumptions (§3).** Optimize expected cost over feasible decisions.

**Derive (complete).**
1. Let $x\in X$ be the decision made now. This separates the choice from uncertainty.
2. Let $\xi$ be random data revealed later. This represents demand, traffic, price, or runtime.
3. Write realized cost $f(x,\xi)$. This scores a decision after uncertainty is known.
4. Take expectation to get $\mathbb E_\xi[f(x,\xi)]$. This averages costs under the uncertainty model.
5. Minimize over feasible decisions: $\min_{x\in X}\mathbb E[f(x,\xi)]$.
6. With scenarios $\xi_1,\ldots,\xi_N$, replace the expectation by $N^{-1}\sum_i f(x,\xi_i)$. This is sample-average approximation.
7. Solve the sampled problem and report sampling error separately. The sample is an approximation to the true expectation.

**Symbols.** $x$ decision; $X$ feasible set; $\xi$ random scenario; $f(x,\xi)$ realized cost; $N$ number of
scenarios; SAA = sample-average approximation.

**Real-World Applications (§5).**
1. **Capacity planning:** scenario costs $10,20,40$ have expected cost $70/3\approx23.3$.
2. **Newsvendor:** with demands 4,6,9 and shortage/holding costs 4/1, order $q=9$ has average cost $2.67$ among $q=4\ldots9$.
3. **Portfolio:** returns 3%, -1%, and 5% average to $2.33\%$.
4. **SGD:** a minibatch of losses 0.8, 1.1, 0.9 has sample loss $0.933$.
5. **A/B allocation:** conversion counts 40 and 55 in 1000 impressions give rates 4% and 5.5%.
6. **Energy scheduling:** wind scenarios 20, 30, 50 MW average to 33.3 MW.

### `math-23-16` — Robust optimization  · AUTHOR derivation

**Connections (§1).**
> This lesson offers a different response to uncertainty than stochastic optimization. Instead of averaging over
> scenarios, robust optimization protects against every parameter value in a chosen uncertainty set. The reader can
> connect this to constraints, worst-case bounds, and safety margins. It is useful when feasibility in bad cases is
> more important than average performance.

**Motivation & Intuition (§2).**
> Sometimes a decision must remain safe even when the input data is wrong within a known range. A capacity plan may
> need to handle peak traffic, a schedule may need buffers, or a model may need protection against bounded input
> perturbations. In these cases, optimizing only the average case can leave the system exposed.
>
> Robust optimization makes the uncertainty set explicit. A decision is feasible only if it satisfies the relevant
> constraint for every parameter value in that set. For simple intervals this often means replacing the uncertain
> coefficient by its worst-case value; more generally, the model minimizes the worst-case cost over the uncertainty
> set.

**Definition & Assumptions (§3).** Replace uncertain requirements with deterministic robust counterparts.

**Derive (complete).**
1. Start with an uncertain constraint $a x\le b$. This is a limit whose coefficient may move.
2. Put uncertainty in a set, for example $a\in[\bar a-\delta,\bar a+\delta]$. This says which cases to protect against.
3. Require $a x\le b$ for every $a$ in the set. This is robust feasibility.
4. If $x\ge0$, the worst case is the largest coefficient $a=\bar a+\delta$. This maximizes left-hand use.
5. Replace the uncertain constraint by $(\bar a+\delta)x\le b$. This is the robust counterpart.
6. More generally, minimize $\max_{u\in\mathcal U}f(x,u)$. This chooses the decision with best worst-case cost.

**Symbols.** $u$ uncertain parameter; $\mathcal U$ uncertainty set; $\bar a$ nominal coefficient; $\delta$
uncertainty radius; robust counterpart = deterministic constraint that enforces all cases.

**Real-World Applications (§5).**
1. **Service level:** if latency load coefficient lies in $[4,6]$ and budget is 54, robust capacity requires $x\le9$ instead of nominal $10.8$.
2. **Supply uncertainty:** demand in $[80,100]$ needs inventory at least 100.
3. **Adversarial ML:** an $\ell_\infty$ perturbation radius $0.03$ defines the protected input set.
4. **Portfolio risk:** losses 2%, 5%, 9% have worst case 9%.
5. **Robust regression:** clipping residuals at 3 makes a residual 8 contribute 3 to the capped loss.
6. **Robust scheduling:** a task with nominal 10 min and 2 min buffer reserves 12 min.

### `math-23-17` — Resource allocation & scheduling in ML systems  · AUTHOR derivation · ML capstone

**Connections (§1).**
> This lesson brings together the operations research tools from the whole section. Linear constraints describe
> shared resources, integer variables describe deployable choices, flows describe data movement, queues describe
> serving stability, and schedules describe time. The setting is an ML platform, where GPU placement, data
> pipelines, replicas, and deadlines interact. The lesson is a capstone because it uses several earlier models as
> parts of one system design problem.

**Motivation & Intuition (§2).**
> ML systems rarely have only one bottleneck. A training job needs GPUs and data movement, an inference service
> needs enough replicas for traffic, and experiment queues must meet deadlines without wasting capacity. Optimizing
> each piece separately can miss the tradeoffs between cost, latency, and completion time.
>
> A capstone model treats these choices together. Assignment variables decide where jobs run, flow variables limit
> data movement, replica counts control serving capacity, and scheduling variables determine completion times. The
> objective combines resource cost, weighted completion, and latency penalties so the planner can compare tradeoffs
> in a single model.

**Definition & Assumptions (§3).** Combine placement, flow, scheduling, queue stability, and deployability constraints.

**Derive (complete).**
1. Define assignment variables $g_{jk}$ for job $j$ on GPU type $k$. This records placement.
2. Define start and completion times $S_j,C_j$. This records scheduling.
3. Define flow variables $x_e$ on data edges and replica counts $r_m$. This records data and serving capacity.
4. Write capacity constraints such as $\sum_j g_{jk}\le G_k$ and $0\le x_e\le u_e$. These limit shared resources.
5. Write scheduling constraints $C_j=S_j+p_{jk}$ when job $j$ uses type $k$, and non-overlap constraints on each GPU.
6. Write queue constraints with $\lambda_m<\mu_m r_m$. This keeps serving stable.
7. Combine costs in an objective such as
$$
\min\sum_{j,k}c_{jk}g_{jk}+\sum_j w_jC_j+\sum_m p_m\max(0,\ell_m-\ell_m^{\max}).
$$
This trades off cost, completion, and latency penalties.
8. Add integrality for assignments and replicas. This makes the plan deployable.

**Symbols.** $g_{jk}$ assignment; $G_k$ GPU capacity; $S_j,C_j$ start and completion; $x_e,u_e$ data flow and
capacity; $r_m$ replicas; $\lambda_m,\mu_m$ arrival and service rates; $\ell_m$ latency.

**Real-World Applications (§5).**
1. **GPU cluster scheduling:** assigning two 4-hour jobs to two GPUs gives makespan 4 instead of 8.
2. **Inference autoscaling:** with $\lambda=180$ req/s and each replica serving $60$ req/s, at least 4 replicas keep utilization below 0.75.
3. **Data pipeline bottleneck:** edges 80 and 120 MB/s in series have throughput 80 MB/s.
4. **Experiment queues:** 12 jobs at 30 minutes each require 360 GPU-minutes.
5. **Feature freshness:** a 15-minute pipeline with a 20-minute SLA has 5 minutes slack.
6. **Traffic spike robustness:** if peak traffic is 1.4 times baseline 1000 req/s, capacity must cover 1400 req/s.

---

## Build order for this section

1. Fix the mechanical LaTeX bug in `math-23-08` first so the current app renders cleanly.
2. Author `math-23-11` as the model entry, including the full §1/§2 prose and Bellman recurrence derivation.
3. Author the LP family in order: `23-02`, `23-03`, `23-04`, `23-05`, `23-06`, `23-07`.
4. Author structured network and matching models: `23-08`, `23-09`, `23-10`.
5. Author time/uncertainty models: `23-12`, `23-13`, `23-14`, `23-15`, `23-16`.
6. Finish with `23-17` as the ML systems capstone tying resource allocation, queues, scheduling, flow, and
robust capacity together.
