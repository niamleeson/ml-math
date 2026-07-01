module.exports = {
  "math-23-01": {
    connectionsProse:
      "<p>This lesson begins with the basic act that makes operations research useful: turning a practical decision into a mathematical object. The reader already knows how quantities, inequalities, and objectives describe real situations. Operations research adds discipline to that translation, so choices become variables, limitations become constraints, and preferences become an objective. This modeling habit supports every later lesson in the section, from linear programming to queues and ML resource allocation.</p>",
    motivation:
      "<p>A real planning problem often arrives as a story. A bakery has flour and oven time, a cloud team has CPU and GPU capacity, or a hospital has staff and patients. Before solving anything, the modeler must decide what the controllable choices are and how each choice consumes or produces measurable quantities.</p>" +
      "<p>The main skill is faithful translation. Every symbol should correspond to a real choice, resource, requirement, or cost, and every coefficient should carry units from the story. When the translation is careful, the model is not just algebra; it is a compact record of the operational tradeoffs in the original problem.</p>",
    definition:
      "<p><b>Modeling in operations research</b> translates a practical decision into variables, constraints, and an objective with units tied to the original story.</p>" +
      "<p><b>Assumptions that matter:</b> Every symbol should correspond to a real choice, resource, requirement, or cost; coefficients carry units; inequalities encode limits or requirements.</p>",
    symbols: [
      { sym: "$x,y$", desc: "decision quantities" },
      { sym: "$P$", desc: "profit" },
      { sym: "$C$", desc: "cost" },
      { sym: "$2$ or $7$", desc: "coefficients carrying units from the story" },
      { sym: "$\\le$ and $\\ge$", desc: "upper limits and minimum requirements" }
    ],
    applications: [
      { title: "Factory mix", background: "This setting applies the lesson model.", numbers: "10 units using 3 hours and 15 using 2 hours consume $60$ hours." },
      { title: "Cloud capacity", background: "This setting applies the lesson model.", numbers: "8 CPU nodes at 40 jobs/hour and 3 GPU nodes at 120 jobs/hour give $680$ jobs/hour." },
      { title: "Ad spend", background: "This setting applies the lesson model.", numbers: "$4000$ at $0.50$ per click and $2000$ at $1.00$ per click buys $10000$ clicks." },
      { title: "Hospital staffing", background: "This setting applies the lesson model.", numbers: "18 nurses at 5 patients each cover $90$ of 100 patients." },
      { title: "Dataset labeling", background: "This setting applies the lesson model.", numbers: "500 expert labels at $2$ and 3000 crowd labels at $0.30$ cost $1900$." },
      { title: "Routing", background: "This setting applies the lesson model.", numbers: "12 km + 18 km + 9 km costs $39(0.20)=7.80$ dollars." }
    ]
  },
  "math-23-02": {
    connectionsProse:
      "<p>This lesson takes the modeling language from the previous lesson and gives it a standard linear form. The reader has already seen variables, objectives, and constraints as separate pieces. Linear programming organizes those pieces into vectors and matrices so many activities and many resource limits can be handled at once. This form is the base language for simplex, duality, sensitivity analysis, and many allocation models later in the section.</p>",
    motivation:
      "<p>A linear program is the right first model when contributions add cleanly. If one activity uses a certain amount of a resource, then twice as much activity uses twice as much resource. If two activities are both chosen, their resource uses and values simply add together.</p>" +
      "<p>This straight-line structure is restrictive, but it is also powerful. It makes the feasible region a polyhedron and turns the objective into a direction through that region. The formulation step is therefore about naming the activities, collecting their coefficients, and writing all limits in one consistent matrix notation.</p>",
    definition:
      "<p>A <b>linear program</b> optimizes a linear objective over linear constraints: $$\\max c^Tx \\text{ subject to } Ax\\le b,\\; x\\ge0.$$</p>" +
      "<p><b>Assumptions that matter:</b> Contributions add linearly, resource limits are linear, and activity levels are nonnegative.</p>",
    symbols: [
      { sym: "$x$", desc: "decision vector" },
      { sym: "$c$", desc: "objective coefficients" },
      { sym: "$A$", desc: "constraint matrix" },
      { sym: "$a_{ij}$", desc: "resource used by one unit of activity $j$ in constraint $i$" },
      { sym: "$b$", desc: "right-hand-side limits" }
    ],
    derivation: [
      { do: "Name the decision vector $x=(x_1,\\ldots,x_n)^T$.", result: "$x=(x_1,\\ldots,x_n)^T$", why: "This collects all activity levels in one object." },
      { do: "Put objective coefficients in $c=(c_1,\\ldots,c_n)^T$.", result: "$c=(c_1,\\ldots,c_n)^T$", why: "This records value per unit of each activity." },
      { do: "Multiply and add to get $c^Tx=\\sum_j c_jx_j$.", result: "$c^Tx=\\sum_j c_jx_j$", why: "This gives total value by additivity." },
      { do: "For resource $i$, write use $a_{i1}x_1+\\cdots+a_{in}x_n$.", result: "$a_{i1}x_1+\\cdots+a_{in}x_n$", why: "This accounts for all activities consuming the same resource." },
      { do: "Bound that use by $b_i$, giving $\\sum_j a_{ij}x_j\\le b_i$.", result: "$\\sum_j a_{ij}x_j\\le b_i$", why: "This encodes the resource limit." },
      { do: "Stack all resource rows into $Ax\\le b$.", result: "$Ax\\le b$", why: "This is the matrix form of all constraints." },
      { do: "Add $x\\ge0$.", result: "$x\\ge0$", why: "This prevents negative activity levels." },
      { do: "State standard form: maximize $c^Tx$ subject to $Ax\\le b$, $x\\ge0$.", result: "$x\\ge0$", why: "This records the corresponding modeling or optimality step." }
    ],
    applications: [
      { title: "Bakery LP", background: "This setting applies the lesson model.", numbers: "$A=\\begin{bmatrix}2&1\\1&3\\end{bmatrix}$, $b=(40,45)^T$, $c=(4,7)^T$; optimum is $(15,10)$ with value $130$." },
      { title: "Portfolio", background: "This setting applies the lesson model.", numbers: "$0.6x+0.2y\\le0.4$ caps risk exposure at 40%." },
      { title: "Ad impressions", background: "This setting applies the lesson model.", numbers: "$1000s+2500v\\ge50000$ requires enough impressions." },
      { title: "Energy dispatch", background: "This setting applies the lesson model.", numbers: "$3g+5c$ MW from gas and coal gives 160 MW at $(20,20)$." },
      { title: "Data-center scheduling", background: "This setting applies the lesson model.", numbers: "$800g+300c\\ge5000$ examples and $4g+c\\le25$ energy units defines feasibility." },
      { title: "Fair allocation", background: "This setting applies the lesson model.", numbers: "$x_1+x_2+x_3=90$ shares exactly 90 GPU-hours." }
    ]
  },
  "math-23-03": {
    connectionsProse:
      "<p>This lesson follows naturally from linear programming formulation. Once an LP has been written, the feasible region has corners, edges, and faces, and the linear objective improves in a consistent direction. The simplex method uses that geometry without needing to draw it. It also prepares the reader for dual prices and sensitivity, because the same tableau information reveals both an optimal plan and local economic meaning.</p>",
    motivation:
      "<p>A linear objective over a polyhedron reaches its optimum at a corner when an optimum exists. Checking every corner directly can be far too expensive, because a model with many constraints can have a huge number of corners. The simplex method improves this by moving only from one feasible corner to a neighboring corner that can improve the objective.</p>" +
      "<p>Slack variables make the corners algebraic. A basis names which variables are currently solved for, and the nonbasic variables are set to zero. Reduced costs tell which currently zero variable would improve the objective if it entered the basis, while the ratio test keeps the move inside the feasible region.</p>",
    definition:
      "<p>The <b>simplex method</b> solves a linear program by adding slacks and moving between adjacent basic feasible solutions: $$Ax+s=b,\\quad s\\ge0.$$</p>" +
      "<p><b>Assumptions that matter:</b> The LP is in inequality form, a feasible starting basis is available or constructed, and pivots preserve feasibility while improving the objective.</p>",
    symbols: [
      { sym: "$s$", desc: "slack variables" },
      { sym: "basis", desc: "currently solved variables" },
      { sym: "reduced cost", desc: "objective improvement per unit of entering variable" },
      { sym: "pivot", desc: "row operation swapping variables" }
    ],
    derivation: [
      { do: "Start with $Ax\\le b$, $x\\ge0$.", result: "$x\\ge0$", why: "This is the LP feasible region." },
      { do: "Add slack variables $s\\ge0$ to write $Ax+s=b$.", result: "$Ax+s=b$", why: "This turns unused resource into variables." },
      { do: "Choose a basis of variables and set nonbasic variables to zero.", result: "the stated relationship", why: "This gives one corner solution." },
      { do: "Compute reduced costs in the objective row. A positive reduced cost in a maximization problem shows a nonbasic variable that can increase the objective.", result: "the stated relationship", why: "This records the corresponding modeling or optimality step." },
      { do: "Select an entering variable with positive reduced cost.", result: "the stated relationship", why: "This chooses the edge to move along." },
      { do: "Use the ratio test $b_i/a_{ij}$ over positive pivot-column entries.", result: "$b_i/a_{ij}$", why: "This finds which basic variable reaches zero first and keeps feasibility." },
      { do: "Pivot to swap entering and leaving variables.", result: "the stated relationship", why: "This moves to the adjacent corner." },
      { do: "Repeat until no positive reduced cost remains. Then no neighboring corner improves the objective, and LP optimality follows.", result: "the stated relationship", why: "This records the corresponding modeling or optimality step." }
    ],
    applications: [
      { title: "Toy LP", background: "This setting applies the lesson model.", numbers: "for $\\max 3x+2y$ with $x+y\\le4$, $x\\le2$, $y\\le3$, corner values are $0,6,10,9,6$; simplex reaches $(2,2)$ with value $10$." },
      { title: "Refinery blend", background: "This setting applies the lesson model.", numbers: "entering a crude with reduced profit $5$ raises profit until a sulfur slack hits zero." },
      { title: "Advertising allocation", background: "This setting applies the lesson model.", numbers: "a channel with reduced profit $0.40$ per unit enters before one with $0.10$." },
      { title: "Diet problem", background: "This setting applies the lesson model.", numbers: "a nutrient constraint with ratio $30/6=5$ leaves before one with $50/5=10$." },
      { title: "ML infrastructure", background: "This setting applies the lesson model.", numbers: "a GPU-batch variable enters if it reduces runtime by 8 minutes per unit." },
      { title: "Supply chain", background: "This setting applies the lesson model.", numbers: "a lane with zero reduced cost has an alternate optimum of the same cost." }
    ]
  },
  "math-23-04": {
    connectionsProse:
      "<p>This lesson builds on the LP formulation and the simplex view of active constraints. A primal LP asks for the best feasible plan. The dual LP asks for prices on the same constraints that certify how good any plan could be. That pricing view connects optimization to resource economics, network cuts, support vectors, and regularized machine learning models.</p>",
    motivation:
      "<p>A production plan earns value by consuming limited resources. If each resource is assigned a nonnegative price, then every feasible plan has a priced resource cost. When those prices are high enough to cover the profit of every activity, the priced total resource supply becomes an upper bound on any primal objective value.</p>" +
      "<p>Duality turns this certificate into its own optimization problem. Instead of only searching for a good plan, we also search for the tightest valid upper bound on all plans. When the primal value and dual value meet, the plan is optimal and the prices explain which constraints are truly scarce.</p>",
    definition:
      "<p><b>LP duality</b> pairs the primal maximization problem with a pricing minimization problem: $$\\min b^Ty \\text{ subject to } A^Ty\\ge c,\\; y\\ge0.$$</p>" +
      "<p><b>Assumptions that matter:</b> Constraint prices are nonnegative, resource prices cover each activity profit, and complementary slackness identifies active scarcity at optimality.</p>",
    symbols: [
      { sym: "$y$", desc: "dual variables or shadow prices" },
      { sym: "$A_i$", desc: "a constraint row" },
      { sym: "$b_i-A_ix$", desc: "slack" },
      { sym: "$(A^Ty)_j-c_j$", desc: "dual slack for activity $j$" }
    ],
    derivation: [
      { do: "Start with the primal $\\max c^Tx$ subject to $Ax\\le b$, $x\\ge0$.", result: "$x\\ge0$", why: "This is the plan-value problem." },
      { do: "Choose nonnegative prices $y\\ge0$ for the constraints. Nonnegative prices preserve inequality direction.", result: "$y\\ge0$", why: "This records the corresponding modeling or optimality step." },
      { do: "Multiply $Ax\\le b$ by $y^T$ to get $y^TAx\\le y^Tb$.", result: "$y^TAx\\le y^Tb$", why: "This prices total resource use by total available resources." },
      { do: "Require $A^Ty\\ge c$.", result: "$A^Ty\\ge c$", why: "This says resource prices cover each activity's profit." },
      { do: "Multiply by $x\\ge0$ to get $x^TA^Ty\\ge c^Tx$.", result: "$x^TA^Ty\\ge c^Tx$", why: "This transfers the activity-wise price bound to the whole plan." },
      { do: "Use $y^TAx=x^TA^Ty$.", result: "$y^TAx=x^TA^Ty$", why: "This is the same scalar written two ways." },
      { do: "Chain the inequalities: $c^Tx\\le x^TA^Ty=y^TAx\\le y^Tb$.", result: "$c^Tx\\le x^TA^Ty=y^TAx\\le y^Tb$", why: "This proves weak duality." },
      { do: "Define the dual as minimizing the tightest such upper bound: $\\min b^Ty$ subject to $A^Ty\\ge c$, $y\\ge0$.", result: "$y\\ge0$", why: "This records the corresponding modeling or optimality step." },
      { do: "Add complementary slackness: $y_i(b_i-A_ix)=0$ and $x_j((A^Ty)_j-c_j)=0$.", result: "$x_j((A^Ty)_j-c_j)=0$", why: "This states that unused resources have zero price and unprofitable-at-price activities are zero." }
    ],
    applications: [
      { title: "Bakery dual", background: "This setting applies the lesson model.", numbers: "$2u+v\\ge4$, $u+3v\\ge7$, minimizing $40u+45v$ gives $(u,v)=(1,2)$ and value $130$." },
      { title: "Certificate", background: "This setting applies the lesson model.", numbers: "primal value $130$ and dual value $130$ prove optimality." },
      { title: "Shadow price", background: "This setting applies the lesson model.", numbers: "one extra hour with $v=2$ raises value by about $2$ while the basis holds." },
      { title: "SVM", background: "This setting applies the lesson model.", numbers: "support vectors satisfy complementary slackness with positive multipliers." },
      { title: "Network cuts", background: "This setting applies the lesson model.", numbers: "a cut capacity $5$ upper-bounds any $s$-$t$ flow by $5$." },
      { title: "Regularization", background: "This setting applies the lesson model.", numbers: "a dual constraint with slack $0.3$ means the corresponding primal coefficient stays zero." }
    ]
  },
  "math-23-05": {
    connectionsProse:
      "<p>This lesson uses the shadow prices introduced by LP duality. After an LP has been solved, the next practical question is often how stable the answer is. Sensitivity analysis reads local information from the current optimal basis and turns it into a report about bottlenecks, safe changes, and approximate value changes. That makes it a bridge between solving a model and using the solution in planning.</p>",
    motivation:
      "<p>An optimal LP solution is not just a single point. It comes with active constraints, unused resources, and dual prices that describe the current corner. Small changes to a right-hand side or objective coefficient may leave that same corner structure in control, even though the numerical value changes.</p>" +
      "<p>Sensitivity analysis focuses on this local region of stability. A shadow price estimates how much the objective changes when one resource limit is adjusted slightly. The estimate is useful precisely because it is local: once the active set changes, a different basis and different prices may apply.</p>",
    definition:
      "<p><b>Sensitivity analysis</b> uses the current optimal basis and its dual prices to estimate local value changes: $$\\Delta z\\approx y_i^\\ast\\Delta.$$</p>" +
      "<p><b>Assumptions that matter:</b> The basis must remain optimal and the right-hand-side change must stay within the allowable range.</p>",
    symbols: [
      { sym: "$b_i$", desc: "right-hand side" },
      { sym: "$\\Delta$", desc: "small change" },
      { sym: "$y_i^\\ast$", desc: "shadow price" },
      { sym: "basis", desc: "active corner structure" },
      { sym: "allowable range", desc: "changes that keep that basis optimal" }
    ],
    derivation: [
      { do: "Solve an LP and keep its optimal dual prices $y^\\ast$. These prices describe the current basis.", result: "$y^\\ast$", why: "This records the corresponding modeling or optimality step." },
      { do: "Increase one right-hand side from $b_i$ to $b_i+\\Delta$.", result: "$b_i+\\Delta$", why: "This adds resource $i$." },
      { do: "The dual objective changes from $b^Ty^\\ast$ to $b^Ty^\\ast+y_i^\\ast\\Delta$.", result: "$b^Ty^\\ast+y_i^\\ast\\Delta$", why: "This is one multiplication by the changed right-hand side." },
      { do: "By strong duality, the primal optimal value changes at the same rate while the basis remains optimal.", result: "the stated relationship", why: "This records the corresponding modeling or optimality step." },
      { do: "Therefore the shadow-price estimate is $\\Delta z\\approx y_i^\\ast\\Delta$.", result: "$\\Delta z\\approx y_i^\\ast\\Delta$", why: "This is local, not global." }
    ],
    applications: [
      { title: "Bakery flour", background: "This setting applies the lesson model.", numbers: "with shadow price $1$, 3 extra kg flour predicts $3$ more dollars." },
      { title: "Bakery time", background: "This setting applies the lesson model.", numbers: "with shadow price $2$, 4 extra hours predicts $8$ more dollars." },
      { title: "Capacity expansion", background: "This setting applies the lesson model.", numbers: "a GPU-hour shadow price of $12$ makes 10 hours worth about $120$." },
      { title: "Budget planning", background: "This setting applies the lesson model.", numbers: "a nonbinding budget has shadow price $0$, so adding $500$ changes value by $0$ locally." },
      { title: "SLA bottleneck", background: "This setting applies the lesson model.", numbers: "a latency constraint price of $30$ per ms means relaxing by 2 ms lowers penalty by $60$." },
      { title: "Data labeling", background: "This setting applies the lesson model.", numbers: "a review-hour price of $4$ means 25 extra hours are worth about $100$." }
    ]
  },
  "math-23-06": {
    connectionsProse:
      "<p>This lesson begins with the same variables and constraints as linear programming, then adds the requirement that some choices must be whole numbers. Many operational decisions are indivisible: a warehouse is opened or not, a feature is selected or not, and a serving system runs an integer number of replicas. Integer programming keeps those decisions faithful to deployment while still using LP relaxations for bounds and guidance.</p>",
    motivation:
      "<p>Linear programming allows fractional activity levels, which is appropriate for divisible quantities such as hours, flow, or budget. Some choices cannot be divided in that way. A plan with $4.3$ replicas or $0.6$ of a warehouse may be useful as a bound, but it is not a deployable decision.</p>" +
      "<p>Integer programming handles this by restricting variables to integers or to binary values. Dropping that restriction gives the LP relaxation, which is easier to solve and contains all integer-feasible plans. Because the relaxation has a larger feasible set, its objective value gives a bound on the true integer optimum.</p>",
    definition:
      "<p><b>Integer programming</b> adds whole-number restrictions and compares the integer feasible set with its relaxation: $$F_I\\subseteq F_R,\\quad z_R\\ge z_I \\text{ for maximization}.$$</p>" +
      "<p><b>Assumptions that matter:</b> Integer or binary variables represent indivisible choices; the LP relaxation gives a bound, not necessarily a deployable solution.</p>",
    symbols: [
      { sym: "$F_I$", desc: "integer feasible set" },
      { sym: "$F_R$", desc: "relaxation feasible set" },
      { sym: "$x_j\\in\\{0,1\\}$", desc: "binary variable" },
      { sym: "$z_I$ and $z_R$", desc: "integer and relaxation objective values" }
    ],
    derivation: [
      { do: "Start with integer feasible set $F_I=\\{x:Ax\\le b, x\\in\\mathbb Z^n\\}$.", result: "$F_I=\\{x:Ax\\le b, x\\in\\mathbb Z^n\\}$", why: "This is the true set of allowed plans." },
      { do: "Drop integrality to get $F_R=\\{x:Ax\\le b, x\\in\\mathbb R^n\\}$.", result: "$F_R=\\{x:Ax\\le b, x\\in\\mathbb R^n\\}$", why: "This is the relaxation." },
      { do: "Observe $F_I\\subseteq F_R$. Every integer-feasible point is also relaxation-feasible.", result: "$F_I\\subseteq F_R$", why: "This records the corresponding modeling or optimality step." },
      { do: "For maximization, maximizing over the larger set cannot produce a smaller value. Thus $z_R\\ge z_I$.", result: "$z_R\\ge z_I$", why: "This records the corresponding modeling or optimality step." },
      { do: "For minimization, minimizing over the larger set cannot produce a larger value. Thus $z_R\\le z_I$.", result: "$z_R\\le z_I$", why: "This records the corresponding modeling or optimality step." },
      { do: "Use the relaxation value as a bound, not necessarily as a feasible integer solution.", result: "the stated relationship", why: "This records the corresponding modeling or optimality step." }
    ],
    applications: [
      { title: "Facility location", background: "This setting applies the lesson model.", numbers: "3 open warehouses at $2000$ each cost $6000$." },
      { title: "Feature selection", background: "This setting applies the lesson model.", numbers: "choosing 12 binary features from 200 is an integer restriction." },
      { title: "Knapsack", background: "This setting applies the lesson model.", numbers: "relaxation value $14.5$ bounds integer value $14$ for weights $(5,4,3)$ and values $(10,6,4)$." },
      { title: "Crew scheduling", background: "This setting applies the lesson model.", numbers: "7 whole shifts cover $7(8)=56$ staff-hours." },
      { title: "A/B portfolio", background: "This setting applies the lesson model.", numbers: "binary choices with costs 3, 4, 5 fit a budget 7 by choosing costs 3 and 4." },
      { title: "Serving optimization", background: "This setting applies the lesson model.", numbers: "5 replicas are allowed, while $4.3$ replicas are not a deployable count." }
    ]
  },
  "math-23-07": {
    connectionsProse:
      "<p>This lesson follows integer programming and explains how LP relaxations become a search method. The reader has seen that a relaxation gives an optimistic bound, not necessarily an integer solution. Branch and bound uses that bound inside a decision tree, splitting fractional cases and discarding cases that cannot improve the best known integer answer. It is a practical foundation for many mixed-integer solvers.</p>",
    motivation:
      "<p>Integer programs are hard because the feasible set is broken into discrete points. Trying every combination is usually impossible. Branch and bound organizes the combinations into subproblems, each with extra restrictions, so the search can reason about whole groups of possibilities at once.</p>" +
      "<p>The bound is what makes the search efficient. If a node's LP relaxation is infeasible, the node has no integer solutions. If its optimistic objective cannot beat the incumbent, it is safe to prune the node without exploring its descendants. Fractional relaxation solutions are handled by branching into integer cases that cover all possibilities.</p>",
    definition:
      "<p><b>Branch and bound</b> solves integer programs by branching on fractional relaxation solutions and pruning nodes whose bounds cannot improve the incumbent.</p>" +
      "<p><b>Assumptions that matter:</b> Each node is bounded by an LP relaxation; infeasible, integral, or noncompetitive nodes can be discarded safely.</p>",
    symbols: [
      { sym: "node", desc: "subproblem" },
      { sym: "relaxation bound", desc: "optimistic objective" },
      { sym: "incumbent", desc: "best integer solution known" },
      { sym: "branch", desc: "added integer restriction" },
      { sym: "prune", desc: "discard a node safely" }
    ],
    derivation: [
      { do: "Solve the LP relaxation at a node.", result: "the stated relationship", why: "This gives an optimistic bound for that node." },
      { do: "If the relaxation is infeasible, prune the node. No integer solution can live inside an empty relaxation.", result: "the stated relationship", why: "This records the corresponding modeling or optimality step." },
      { do: "If the relaxation solution is integer, compare it to the incumbent. It is a valid candidate solution.", result: "the stated relationship", why: "This records the corresponding modeling or optimality step." },
      { do: "If the relaxation bound is no better than the incumbent, prune. Even the optimistic value cannot improve the best known answer.", result: "the stated relationship", why: "This records the corresponding modeling or optimality step." },
      { do: "If some variable has fractional value $x_j=2.4$, branch into $x_j\\le2$ and $x_j\\ge3$. These two cases cover all integer possibilities for $x_j$.", result: "$x_j$", why: "This records the corresponding modeling or optimality step." },
      { do: "Repeat on open nodes until none remain. The incumbent is then optimal.", result: "the stated relationship", why: "This records the corresponding modeling or optimality step." }
    ],
    applications: [
      { title: "Binary knapsack", background: "This setting applies the lesson model.", numbers: "relaxation $x=(1,0.75,0)$ has bound $14.5$; incumbent $(1,0,1)$ has value $14$." },
      { title: "Feature subset", background: "This setting applies the lesson model.", numbers: "a node bound of $0.842$ AUC cannot beat incumbent $0.851$, so prune it." },
      { title: "GPU scheduling", background: "This setting applies the lesson model.", numbers: "a fractional start-time relaxation at 7.5 hours branches to before/after a job order." },
      { title: "Warehouse location", background: "This setting applies the lesson model.", numbers: "if opening warehouse 2 has $x_2=0.6$, branch to closed $0$ or open $1$." },
      { title: "Neural architecture search", background: "This setting applies the lesson model.", numbers: "a branch with validation bound $91.2$ cannot beat incumbent $91.7$." },
      { title: "Routing", background: "This setting applies the lesson model.", numbers: "if a relaxed route uses edge $e$ at $0.5$, branch on excluding or including that edge." }
    ]
  },
  "math-23-08": {
    connectionsProse:
      "<p>This lesson specializes linear programming to a grid of sources and destinations. The reader already knows how constraints can limit resources and require demand to be met. The transportation problem gives those constraints a particularly clear structure: each row is a source, each column is a destination, and each cell is a possible shipment route. This structure also points toward network flow and assignment models.</p>",
    motivation:
      "<p>Many allocation problems are about moving quantity from where it is available to where it is needed. The source supplies must be used, the destination demands must be met, and every route has a unit cost. The grid layout keeps these three pieces visible at the same time.</p>" +
      "<p>The model is linear because total cost is the sum of route cost times shipped amount. Balance matters: if total supply and total demand match, every row and column can be written as an equality. If they do not match, a dummy source or destination represents surplus or unmet demand in a controlled way.</p>",
    definition:
      "<p>The <b>transportation problem</b> minimizes shipping cost on a balanced source-destination grid: $$\\min\\sum_i\\sum_j c_{ij}x_{ij} \\text{ subject to } \\sum_j x_{ij}=s_i,\\; \\sum_i x_{ij}=d_j,\\; x_{ij}\\ge0.$$</p>" +
      "<p><b>Assumptions that matter:</b> Total supply equals total demand, route costs are linear, and dummy rows or columns handle imbalance.</p>",
    symbols: [
      { sym: "$x_{ij}$", desc: "shipment" },
      { sym: "$c_{ij}$", desc: "unit cost" },
      { sym: "$s_i$", desc: "supply" },
      { sym: "$d_j$", desc: "demand" },
      { sym: "$u_i,v_j$", desc: "row and column dual potentials" }
    ],
    derivation: [
      { do: "Define $x_{ij}\\ge0$ as the amount shipped from source $i$ to destination $j$.", result: "$j$", why: "This names one route per cell." },
      { do: "Multiply by route costs and sum: $\\sum_i\\sum_j c_{ij}x_{ij}$.", result: "$\\sum_i\\sum_j c_{ij}x_{ij}$", why: "This is total shipping cost." },
      { do: "For source $i$, add across destinations: $\\sum_j x_{ij}=s_i$.", result: "$\\sum_j x_{ij}=s_i$", why: "This uses all supply from row $i$." },
      { do: "For destination $j$, add across sources: $\\sum_i x_{ij}=d_j$.", result: "$\\sum_i x_{ij}=d_j$", why: "This meets demand in column $j$." },
      { do: "Require $\\sum_i s_i=\\sum_j d_j$.", result: "$\\sum_i s_i=\\sum_j d_j$", why: "This is balance; otherwise add a dummy source or destination." },
      { do: "Check optimality with potentials $u_i,v_j$: occupied cells satisfy $u_i+v_j=c_{ij}$, and empty cells must satisfy $u_i+v_j\\le c_{ij}$ for minimization.", result: "$u_i+v_j\\le c_{ij}$", why: "This is dual feasibility for the transportation LP." }
    ],
    applications: [
      { title: "Freight", background: "This setting applies the lesson model.", numbers: "supplies $(20,30)$, demands $(10,25,15)$, costs $\\begin{bmatrix}2&4&5\\3&1&7\\end{bmatrix}$ have optimum cost $125$." },
      { title: "Cloud transfer", background: "This setting applies the lesson model.", numbers: "70 GB at $0.02$ and 30 GB at $0.05$ costs $2.90$ dollars; this is the LaTeX-fix app." },
      { title: "Inventory rebalancing", background: "This setting applies the lesson model.", numbers: "moving 12 units at $4$ and 8 at $6$ costs $96$." },
      { title: "Training sharding", background: "This setting applies the lesson model.", numbers: "600 examples to GPU A and 400 to GPU B assign all 1000 examples." },
      { title: "Humanitarian logistics", background: "This setting applies the lesson model.", numbers: "supply 80 and demand 50+30 balances exactly." },
      { title: "Minibatch distribution", background: "This setting applies the lesson model.", numbers: "sending 256, 256, and 512 samples fills a 1024-sample batch." }
    ]
  },
  "math-23-09": {
    connectionsProse:
      "<p>This lesson narrows the transportation problem to one-to-one matching. Instead of shipping arbitrary amounts, each agent supplies one unit and each task demands one unit. The same row-and-column idea remains, but the result is a clean model for pairing workers, labels, reviewers, jobs, or slots. It also connects linear programming to matching problems in graphs.</p>",
    motivation:
      "<p>Assignment problems appear whenever every item on one side must be matched exactly once to an item on the other side. A cost or score is attached to each possible match. The model selects a set of cells in the cost matrix so that every row and every column is used exactly once.</p>" +
      "<p>Although the variables are naturally binary, the assignment constraint matrix has a special integrality property. That means the LP relaxation has integer extreme points. The model therefore keeps the clarity of a binary matching problem while benefiting from linear programming structure and dual certificates.</p>",
    definition:
      "<p>The <b>assignment problem</b> matches agents to tasks one-to-one: $$\\min\\sum_i\\sum_j c_{ij}x_{ij} \\text{ subject to } \\sum_j x_{ij}=1,\\; \\sum_i x_{ij}=1.$$</p>" +
      "<p><b>Assumptions that matter:</b> Each agent and each task is used exactly once; the special constraint matrix makes LP extreme points integral.</p>",
    symbols: [
      { sym: "$x_{ij}$", desc: "binary assignment" },
      { sym: "$c_{ij}$", desc: "match cost" },
      { sym: "row constraint", desc: "one task per agent" },
      { sym: "column constraint", desc: "one agent per task" },
      { sym: "potentials", desc: "certificates of optimality" }
    ],
    derivation: [
      { do: "Define $x_{ij}=1$ if agent $i$ takes task $j$, and $0$ otherwise.", result: "$0$", why: "This records a match." },
      { do: "Add row constraints $\\sum_j x_{ij}=1$.", result: "$\\sum_j x_{ij}=1$", why: "This assigns every agent exactly once." },
      { do: "Add column constraints $\\sum_i x_{ij}=1$.", result: "$\\sum_i x_{ij}=1$", why: "This fills every task exactly once." },
      { do: "Minimize $\\sum_i\\sum_j c_{ij}x_{ij}$.", result: "$\\sum_i\\sum_j c_{ij}x_{ij}$", why: "This selects the least-cost set of matches." },
      { do: "View it as transportation with all supplies and demands equal to 1.", result: "the stated relationship", why: "This explains the structure." },
      { do: "Use the integrality property of this constraint matrix. The LP relaxation has integer extreme points, so the binary solution can be found through the LP.", result: "the stated relationship", why: "This records the corresponding modeling or optimality step." },
      { do: "Check optimality with row and column potentials $u_i+v_j\\le c_{ij}$ and equality on chosen matches.", result: "$u_i+v_j\\le c_{ij}$", why: "This records the corresponding modeling or optimality step." }
    ],
    applications: [
      { title: "Worker-task", background: "This setting applies the lesson model.", numbers: "costs $\\begin{bmatrix}9&2&7\\6&4&3\\5&8&1\\end{bmatrix}$ have optimum assignment $(1\\to2,2\\to1,3\\to3)$ with cost $9$." },
      { title: "Cluster labels", background: "This setting applies the lesson model.", numbers: "matching 3 predicted clusters to 3 true labels can maximize 87 correct labels." },
      { title: "Object tracking", background: "This setting applies the lesson model.", numbers: "track-to-detection costs 2, 6, and 1 sum to 9." },
      { title: "Recommendation slots", background: "This setting applies the lesson model.", numbers: "4 slots filled by 4 items require exactly 4 ones in $x$." },
      { title: "Reviewer matching", background: "This setting applies the lesson model.", numbers: "20 papers and 20 reviewers make 20 assignments." },
      { title: "GPU placement", background: "This setting applies the lesson model.", numbers: "assigning 3 jobs to 3 GPUs with costs 4, 7, and 2 gives total cost 13." }
    ]
  },
  "math-23-10": {
    connectionsProse:
      "<p>This lesson moves from source-destination grids to directed graphs. The reader has already seen conservation in transportation rows and columns. Network flow uses the same idea on nodes and arcs, where quantity moves through intermediate points before reaching a sink. This language supports routing, matching, image segmentation, data ingestion, and many capacity-planning models.</p>",
    motivation:
      "<p>A flow model tracks movement through a network. Arcs have capacities, sources inject flow, sinks receive it, and intermediate nodes simply pass along what they receive. The conservation equations are the core bookkeeping rule: except at sources and sinks, inflow must equal outflow.</p>" +
      "<p>The objective depends on the task. In a max-flow problem, the goal is to deliver as much as possible from source to sink subject to arc capacities. The same variables and conservation constraints can also support minimum-cost flow, circulation, and matching formulations.</p>",
    definition:
      "<p><b>Network flow</b> puts capacity-limited variables on directed arcs and conserves flow at intermediate nodes: $$0\\le x_{ij}\\le u_{ij},\\quad \\sum_i x_{ik}=\\sum_j x_{kj}.$$</p>" +
      "<p><b>Assumptions that matter:</b> Arcs have capacities, sources inject flow, sinks receive flow, and transshipment nodes pass along what they receive.</p>",
    symbols: [
      { sym: "$x_{ij}$", desc: "flow" },
      { sym: "$u_{ij}$", desc: "capacity" },
      { sym: "$s$", desc: "source" },
      { sym: "$t$", desc: "sink" },
      { sym: "$v$", desc: "flow value" },
      { sym: "conservation", desc: "inflow equals outflow at transshipment nodes" }
    ],
    derivation: [
      { do: "Put a nonnegative flow variable $x_{ij}$ on each directed arc $(i,j)$.", result: "$(i,j)$", why: "This measures movement along that arc." },
      { do: "Add capacity bounds $0\\le x_{ij}\\le u_{ij}$.", result: "$0\\le x_{ij}\\le u_{ij}$", why: "This prevents using more than the arc can carry." },
      { do: "For an intermediate node $k$, sum inflow $\\sum_i x_{ik}$.", result: "$\\sum_i x_{ik}$", why: "This measures what arrives." },
      { do: "Sum outflow $\\sum_j x_{kj}$.", result: "$\\sum_j x_{kj}$", why: "This measures what departs." },
      { do: "Set inflow equal to outflow.", result: "the stated relationship", why: "This conserves flow at node $k$." },
      { do: "Define value $v$ as total flow leaving source or entering sink.", result: "$v$", why: "This is the amount delivered." },
      { do: "Maximize $v$ subject to capacities and conservation.", result: "$v$", why: "This gives the max-flow LP." }
    ],
    applications: [
      { title: "Internet routing", background: "This setting applies the lesson model.", numbers: "capacities $s\\to a=3$, $s\\to b=2$, $a\\to t=2$, $b\\to t=3$ allow max flow $5$." },
      { title: "Supply chain", background: "This setting applies the lesson model.", numbers: "sending 40 through plant A and 60 through plant B delivers 100 units." },
      { title: "Bipartite matching", background: "This setting applies the lesson model.", numbers: "5 unit flows correspond to 5 matches." },
      { title: "Image segmentation", background: "This setting applies the lesson model.", numbers: "a cut with capacities 3, 4, and 2 has cut cost 9." },
      { title: "Data ingestion", background: "This setting applies the lesson model.", numbers: "links 80 MB/s and 120 MB/s give a 200 MB/s upstream cap." },
      { title: "Evacuation", background: "This setting applies the lesson model.", numbers: "roads carrying 30, 50, and 20 people/minute can move 100 people/minute before downstream limits." }
    ]
  },
  "math-23-11": {
    connectionsProse:
      "<p>This lesson builds on optimization, recursion, and graph thinking. In earlier lessons, an LP or flow model solved one large set of constraints at once. Dynamic programming takes a different route: it breaks a decision process into states, solves the smaller future problem from each state, and then uses those saved values to choose the current action.</p><p>The same pattern appears across machine learning systems. Viterbi decoding stores the best score for each tag at each token. Reinforcement learning stores the value of a state before choosing an action. Resource planners can store the best value for a remaining budget, remaining time, or remaining GPU capacity. The method is useful when the future can be summarized by a state rather than by the whole path that led there.</p>",
    motivation:
      "<p>Dynamic programming is for decisions that unfold in stages. A greedy method looks only at the immediate gain; exhaustive search tries every complete plan. Dynamic programming sits between those extremes. It keeps the future in view, but it avoids repeating the same future calculation again and again.</p>" +
      "<p>The key idea is the principle of optimality. Once a first action has been chosen and the system has moved to a new state, the remaining actions must form an optimal plan for that new state. If they did not, replacing the tail with a better tail would improve the whole plan. That observation lets us write the value of a state in terms of the values of its next states.</p>" +
      "<p>For a finite-horizon problem, let $V_t(s)$ mean the best total reward available from time $t$ onward when the current state is $s$. At time $t$, choose an action $a$, earn immediate reward $r_t(s,a)$, and move to $T(s,a)$. The best choice is the action with the largest immediate reward plus best future value.</p>",
    definition:
      "<p><b>Dynamic programming</b> writes the value of a state as the best immediate reward plus best future value: $$V_t(s)=\\max_{a\\in A(s)}\\{r_t(s,a)+V_{t+1}(T(s,a))\\}.$$</p>" +
      "<p><b>Assumptions that matter:</b> The future can be summarized by the next state, feasible actions are known from each state, and a terminal condition starts the backward recursion.</p>",
    symbols: [
      { sym: "$t$", desc: "stage" },
      { sym: "$s$", desc: "state" },
      { sym: "$A(s)$", desc: "feasible-action set" },
      { sym: "$a$", desc: "one action" },
      { sym: "$r_t(s,a)$", desc: "immediate reward" },
      { sym: "$T(s,a)$", desc: "next-state rule" },
      { sym: "$V_t(s)$", desc: "optimal future value from $(t,s)$" }
    ],
    derivation: [
      { do: "Start with a fixed state and time, written as $(t,s)$.", result: "$(t,s)$", why: "This pins down the subproblem whose value is being computed." },
      { do: "List the feasible actions $a\\in A(s)$.", result: "$a\\in A(s)$", why: "This restricts the decision to actions allowed from state $s$." },
      { do: "For one chosen action $a$, add the immediate reward $r_t(s,a)$.", result: "$r_t(s,a)$", why: "This accounts for the payoff earned now." },
      { do: "Apply the transition rule $T(s,a)$ to get the next state.", result: "$T(s,a)$", why: "This summarizes everything the future needs to know after taking $a$." },
      { do: "By the principle of optimality, the remaining value is $V_{t+1}(T(s,a))$.", result: "$V_{t+1}(T(s,a))$", why: "This replaces the entire future tail with the best value for the next subproblem." },
      { do: "Add present and future values to get $r_t(s,a)+V_{t+1}(T(s,a))$.", result: "$r_t(s,a)+V_{t+1}(T(s,a))$", why: "This is the value of plans whose first action is $a$." },
      { do: "Maximize over feasible actions.", result: "the stated relationship", why: "This chooses the best first action and gives the recurrence above." },
      { do: "Set a terminal condition such as $V_{T+1}(s)=0$.", result: "$V_{T+1}(s)=0$", why: "This gives the backward recursion a place to start." }
    ],
    applications: [
      { title: "Shortest paths", background: "This setting applies the lesson model.", numbers: "If distances from the next city to the goal are $V(B)=5$ and $V(C)=3$, and edges from $A$ cost $2$ and $6$, then $V(A)=\\min\\{2+5,6+3\\}=7$." },
      { title: "Inventory planning", background: "This setting applies the lesson model.", numbers: "With 2 units left, ordering 0 gives shortage cost $8$, while ordering 1 gives setup plus holding cost $3+1=4$; DP selects cost $4$." },
      { title: "Sequence alignment", background: "This setting applies the lesson model.", numbers: "A cell with diagonal $6$, up $3$, and left $4$ under scores $+2,-1,-1$ gives $\\max\\{8,2,3\\}=8$." },
      { title: "Viterbi decoding", background: "This setting applies the lesson model.", numbers: "If a tag path to `NOUN` has previous scores $5$ and $3$, transition scores $2$ and $4$, and emission score $1$, the new score is $\\max\\{5+2+1,3+4+1\\}=8$." },
      { title: "Reinforcement learning", background: "This setting applies the lesson model.", numbers: "With discount $\\gamma=0.9$, rewards $2$ and $1$, and next values $10$ and $12$, the Bellman backup chooses $\\max\\{2+0.9(10),1+0.9(12)\\}=11.8$." },
      { title: "Compiler optimization", background: "This setting applies the lesson model.", numbers: "If two code-generation choices cost $3+V=3+7=10$ and $5+4=9$, the DP table stores cost $9$ for that subexpression." }
    ]
  },
  "math-23-12": {
    connectionsProse:
      "<p>This lesson shifts from deterministic allocation to systems with random arrivals and service times. The reader has already seen capacity constraints in LPs, flows, and schedules. Queueing theory explains what happens when demand arrives over time and competes for limited service capacity. The same ideas are useful for web requests, GPU clusters, call centers, disk queues, and inference services.</p>",
    motivation:
      "<p>A service system can look healthy when average capacity exceeds average demand, but the amount of spare capacity matters greatly. Random arrivals bunch together, service times vary, and a temporary backlog can form even when the long-run service rate is larger than the arrival rate.</p>" +
      "<p>The $M/M/1$ queue is the clean baseline for this effect. It assumes one server, Poisson arrivals, and exponential service times. The utilization $\\rho$ controls the steady-state distribution, and as arrivals approach service capacity, expected system size and waiting time rise sharply.</p>",
    definition:
      "<p>The steady-state <b>$M/M/1$ queue</b> has utilization $\\rho=\\lambda/\\mu$ and expected system size $$L=\\frac{\\lambda}{\\mu-\\lambda},\\quad W=\\frac{1}{\\mu-\\lambda}.$$</p>" +
      "<p><b>Assumptions that matter:</b> Arrivals are Poisson, service times are exponential, there is one server, and stability requires $\\lambda<\\mu$.</p>",
    symbols: [
      { sym: "$\\lambda$", desc: "arrival rate" },
      { sym: "$\\mu$", desc: "service rate" },
      { sym: "$\\rho$", desc: "utilization" },
      { sym: "$L$", desc: "expected number in system" },
      { sym: "$W$", desc: "expected time in system" },
      { sym: "$\\lambda<\\mu$", desc: "stability condition" }
    ],
    derivation: [
      { do: "Let arrivals occur at rate $\\lambda$ and service completions at rate $\\mu$.", result: "$\\mu$", why: "This defines the birth-death process." },
      { do: "In steady state, flow into state $n+1$ equals flow out: $\\pi_n\\lambda=\\pi_{n+1}\\mu$.", result: "$\\pi_n\\lambda=\\pi_{n+1}\\mu$", why: "This balances adjacent states." },
      { do: "Rearrange to $\\pi_{n+1}=\\rho\\pi_n$ with $\\rho=\\lambda/\\mu$.", result: "$\\rho=\\lambda/\\mu$", why: "This gives the geometric pattern." },
      { do: "Repeat to get $\\pi_n=(1-\\rho)\\rho^n$ after normalization.", result: "$\\pi_n=(1-\\rho)\\rho^n$", why: "This requires $\\rho<1$." },
      { do: "Compute expected system size $L=\\sum_{n\\ge0}n(1-\\rho)\\rho^n=\\rho/(1-\\rho)$.", result: "$L=\\sum_{n\\ge0}n(1-\\rho)\\rho^n=\\rho/(1-\\rho)$", why: "This is the geometric mean." },
      { do: "Substitute $\\rho=\\lambda/\\mu$ to get $L=\\lambda/(\\mu-\\lambda)$.", result: "$L=\\lambda/(\\mu-\\lambda)$", why: "This is the displayed queue formula." },
      { do: "Apply Little's law $L=\\lambda W$ to get $W=1/(\\mu-\\lambda)$.", result: "$W=1/(\\mu-\\lambda)$", why: "This records the corresponding modeling or optimality step." }
    ],
    applications: [
      { title: "Web requests", background: "This setting applies the lesson model.", numbers: "$\\lambda=8$/hour and $\\mu=10$/hour give $L=4$ and $W=0.5$ hours." },
      { title: "GPU cluster", background: "This setting applies the lesson model.", numbers: "utilization $0.8$ gives queue length $L_q=\\rho^2/(1-\\rho)=3.2$." },
      { title: "Call center", background: "This setting applies the lesson model.", numbers: "$\\lambda=18$ and $\\mu=24$ calls/hour gives $W=1/6$ hour, or 10 minutes." },
      { title: "Disk queue", background: "This setting applies the lesson model.", numbers: "$\\lambda=90$, $\\mu=100$ ops/s gives $L=9$." },
      { title: "Packet buffer", background: "This setting applies the lesson model.", numbers: "$\\rho=0.5$ gives $L=1$." },
      { title: "Batch inference", background: "This setting applies the lesson model.", numbers: "$\\lambda=40$, $\\mu=50$ batches/hour gives $W=0.1$ hours, or 6 minutes." }
    ]
  },
  "math-23-13": {
    connectionsProse:
      "<p>This lesson applies optimization to stock, replenishment, and buffers. The reader has already seen how constraints and costs describe operational tradeoffs. Inventory models focus on a recurring tradeoff: ordering too often creates setup cost, while ordering too much creates holding cost. The EOQ formula gives a transparent baseline before uncertainty, shortages, or richer supply-chain constraints are added.</p>",
    motivation:
      "<p>Inventory is useful because it separates supply timing from demand timing. Keeping more inventory reduces the need to place orders frequently, but it also ties up space, money, and handling effort. Keeping less inventory saves holding cost, but forces more frequent replenishment.</p>" +
      "<p>The economic order quantity model isolates this balance in the simplest steady case. Demand is constant, every order has a fixed setup cost, and inventory depletes linearly between orders. The optimal order size is where the marginal pressure from ordering cost and holding cost balances.</p>",
    definition:
      "<p>The <b>economic order quantity</b> model balances setup and holding costs: $$C(Q)=\\frac{KD}{Q}+\\frac{hQ}{2},\\quad Q^\\ast=\\sqrt{\\frac{2KD}{h}}.$$</p>" +
      "<p><b>Assumptions that matter:</b> Demand is steady, every order has fixed setup cost, and inventory depletes linearly between orders.</p>",
    symbols: [
      { sym: "$D$", desc: "demand per time" },
      { sym: "$K$", desc: "fixed order cost" },
      { sym: "$h$", desc: "holding cost per unit per time" },
      { sym: "$Q$", desc: "order quantity" },
      { sym: "$Q^\\ast$", desc: "economic order quantity" }
    ],
    derivation: [
      { do: "Let annual demand be $D$ and order size be $Q$.", result: "$Q$", why: "This means the number of orders per year is $D/Q$." },
      { do: "Multiply by setup cost $K$ to get annual ordering cost $KD/Q$.", result: "$KD/Q$", why: "This charges each order once." },
      { do: "Under steady depletion, average inventory is $Q/2$.", result: "$Q/2$", why: "This is the midpoint of a sawtooth from $Q$ to $0$." },
      { do: "Multiply by holding cost $h$ to get annual holding cost $hQ/2$.", result: "$hQ/2$", why: "This records the corresponding modeling or optimality step." },
      { do: "Add costs: $C(Q)=KD/Q+hQ/2$.", result: "$C(Q)=KD/Q+hQ/2$", why: "This records the corresponding modeling or optimality step." },
      { do: "Differentiate: $C'(Q)=-KD/Q^2+h/2$.", result: "$C'(Q)=-KD/Q^2+h/2$", why: "This finds the cost slope." },
      { do: "Set $C'(Q)=0$ and solve $h/2=KD/Q^2$.", result: "$h/2=KD/Q^2$", why: "This balances marginal ordering and holding costs." },
      { do: "Get $Q^\\ast=\\sqrt{2KD/h}$.", result: "$Q^\\ast=\\sqrt{2KD/h}$", why: "This records the corresponding modeling or optimality step." }
    ],
    applications: [
      { title: "Retail", background: "This setting applies the lesson model.", numbers: "$D=12000$, $K=50$, $h=2$ gives $Q^\\ast\\approx774.6$." },
      { title: "Spare parts", background: "This setting applies the lesson model.", numbers: "$D=900$, $K=40$, $h=10$ gives $Q^\\ast\\approx84.9$." },
      { title: "Cloud buffers", background: "This setting applies the lesson model.", numbers: "ordering 200 units with average inventory 100 and holding cost $0.05$ costs $5$ per period." },
      { title: "Feature cache", background: "This setting applies the lesson model.", numbers: "demand 10000, setup 20, holding 1 gives $Q^\\ast\\approx632.5$." },
      { title: "Newsvendor", background: "This setting applies the lesson model.", numbers: "ordering 100 for demand 80 leaves 20 excess units." },
      { title: "Data staging", background: "This setting applies the lesson model.", numbers: "10 loads per month at $30$ setup cost cost $300$ in setup." }
    ]
  },
  "math-23-14": {
    connectionsProse:
      "<p>This lesson returns to time as the scarce resource. The reader has already seen capacity limits and integer choices; scheduling adds start times, completion times, deadlines, and precedence. These variables make conflicts on shared machines explicit. The same modeling language supports factory jobs, project plans, GPU batches, model evaluations, and realtime systems.</p>",
    motivation:
      "<p>A schedule is more than a list of jobs. It must say when each job starts, when it finishes, and which jobs cannot overlap on the same resource. If one task must finish before another begins, that relationship must also appear as a constraint.</p>" +
      "<p>The formulas are simple time bookkeeping, but they carry the structure of the whole problem. Completion time is start time plus processing time. Non-overlap constraints prevent two jobs from using one machine at once. Objectives such as makespan or weighted completion time choose which notion of a good schedule matters.</p>",
    definition:
      "<p><b>Scheduling models</b> use start times, processing times, completion times, precedence, and objectives such as makespan: $$C_j=S_j+p_j,\\quad C_{\\max}\\ge C_j.$$</p>" +
      "<p><b>Assumptions that matter:</b> Jobs have processing times, shared resources cannot overlap, precedence must be respected, and the objective states what schedule quality means.</p>",
    symbols: [
      { sym: "$S_j$", desc: "start time" },
      { sym: "$p_j$", desc: "processing time" },
      { sym: "$C_j$", desc: "completion time" },
      { sym: "$d_j$", desc: "due date" },
      { sym: "$L_j=C_j-d_j$", desc: "lateness" },
      { sym: "$C_{\\max}$", desc: "makespan" }
    ],
    derivation: [
      { do: "Define start time $S_j$ and processing time $p_j$ for job $j$.", result: "$j$", why: "This names the time decision and duration." },
      { do: "Compute completion time $C_j=S_j+p_j$.", result: "$C_j=S_j+p_j$", why: "This adds duration to start." },
      { do: "For precedence $a$ before $b$, require $S_b\\ge S_a+p_a$.", result: "$S_b\\ge S_a+p_a$", why: "This prevents $b$ from starting before $a$ ends." },
      { do: "For two jobs on one machine, impose either $S_i+p_i\\le S_j$ or $S_j+p_j\\le S_i$.", result: "$S_j+p_j\\le S_i$", why: "This avoids overlap." },
      { do: "Define makespan $C_{\\max}\\ge C_j$ for every job.", result: "$C_{\\max}\\ge C_j$", why: "This makes $C_{\\max}$ at least the last completion time." },
      { do: "Minimize $C_{\\max}$ or $\\sum_j w_jC_j$ depending on the scheduling goal.", result: "$\\sum_j w_jC_j$", why: "This records the corresponding modeling or optimality step." }
    ],
    applications: [
      { title: "Single-machine SPT", background: "This setting applies the lesson model.", numbers: "jobs C,A,B with times 1,2,5 have completions 1,3,8 and total 12." },
      { title: "Naive order", background: "This setting applies the lesson model.", numbers: "A,B,C gives completions 2,7,8 and total 17." },
      { title: "Project precedence", background: "This setting applies the lesson model.", numbers: "if A starts at 0 and $p_A=4$, B must satisfy $S_B\\ge4$." },
      { title: "Cloud batch jobs", background: "This setting applies the lesson model.", numbers: "two jobs of 3 and 5 hours on one GPU have makespan 8 if run serially." },
      { title: "Model evaluation", background: "This setting applies the lesson model.", numbers: "lateness with $C=14$, $d=10$ is $L=4$." },
      { title: "Realtime system", background: "This setting applies the lesson model.", numbers: "a job taking 7 ms meets a 10 ms deadline with 3 ms slack." }
    ]
  },
  "math-23-15": {
    connectionsProse:
      "<p>This lesson adds uncertainty to the optimization models from earlier in the section. The reader has already seen decisions made under fixed coefficients, capacities, costs, and processing times. Stochastic optimization keeps the decision structure but treats some data as random. It is especially useful in capacity planning, portfolio choice, energy scheduling, newsvendor models, and sampled machine learning objectives.</p>",
    motivation:
      "<p>Many decisions must be made before demand, traffic, runtime, or price is fully known. A deterministic model can use a single forecast, but that may hide the range of possible outcomes. Stochastic optimization instead scores a decision by averaging its realized cost or reward over a probability model.</p>" +
      "<p>In practice, the expectation is often approximated with scenarios. Each scenario represents one possible future, and the sample average replaces the exact expected value. The solution is therefore tied to both the optimization model and the quality of the uncertainty model or sample.</p>",
    definition:
      "<p><b>Stochastic optimization</b> chooses a feasible decision by minimizing expected realized cost: $$\\min_{x\\in X}\\mathbb E[f(x,\\xi)]\\approx \\min_{x\\in X}\\frac1N\\sum_{i=1}^N f(x,\\xi_i).$$</p>" +
      "<p><b>Assumptions that matter:</b> The decision is chosen before random data is known, scenarios represent possible futures, and sampling error is separate from optimization error.</p>",
    symbols: [
      { sym: "$x$", desc: "decision" },
      { sym: "$X$", desc: "feasible set" },
      { sym: "$\\xi$", desc: "random scenario" },
      { sym: "$f(x,\\xi)$", desc: "realized cost" },
      { sym: "$N$", desc: "number of scenarios" },
      { sym: "SAA", desc: "sample-average approximation" }
    ],
    derivation: [
      { do: "Let $x\\in X$ be the decision made now.", result: "$x\\in X$", why: "This separates the choice from uncertainty." },
      { do: "Let $\\xi$ be random data revealed later.", result: "$\\xi$", why: "This represents demand, traffic, price, or runtime." },
      { do: "Write realized cost $f(x,\\xi)$.", result: "$f(x,\\xi)$", why: "This scores a decision after uncertainty is known." },
      { do: "Take expectation to get $\\mathbb E_\\xi[f(x,\\xi)]$.", result: "$\\mathbb E_\\xi[f(x,\\xi)]$", why: "This averages costs under the uncertainty model." },
      { do: "Minimize over feasible decisions: $\\min_{x\\in X}\\mathbb E[f(x,\\xi)]$.", result: "$\\min_{x\\in X}\\mathbb E[f(x,\\xi)]$", why: "This records the corresponding modeling or optimality step." },
      { do: "With scenarios $\\xi_1,\\ldots,\\xi_N$, replace the expectation by $N^{-1}\\sum_i f(x,\\xi_i)$.", result: "$N^{-1}\\sum_i f(x,\\xi_i)$", why: "This is sample-average approximation." },
      { do: "Solve the sampled problem and report sampling error separately. The sample is an approximation to the true expectation.", result: "the stated relationship", why: "This records the corresponding modeling or optimality step." }
    ],
    applications: [
      { title: "Capacity planning", background: "This setting applies the lesson model.", numbers: "scenario costs $10,20,40$ have expected cost $70/3\\approx23.3$." },
      { title: "Newsvendor", background: "This setting applies the lesson model.", numbers: "with demands 4,6,9 and shortage/holding costs 4/1, order $q=9$ has average cost $2.67$ among $q=4\\ldots9$." },
      { title: "Portfolio", background: "This setting applies the lesson model.", numbers: "returns 3%, -1%, and 5% average to $2.33\\%$." },
      { title: "SGD", background: "This setting applies the lesson model.", numbers: "a minibatch of losses 0.8, 1.1, 0.9 has sample loss $0.933$." },
      { title: "A/B allocation", background: "This setting applies the lesson model.", numbers: "conversion counts 40 and 55 in 1000 impressions give rates 4% and 5.5%." },
      { title: "Energy scheduling", background: "This setting applies the lesson model.", numbers: "wind scenarios 20, 30, 50 MW average to 33.3 MW." }
    ]
  },
  "math-23-16": {
    connectionsProse:
      "<p>This lesson offers a different response to uncertainty than stochastic optimization. Instead of averaging over scenarios, robust optimization protects against every parameter value in a chosen uncertainty set. The reader can connect this to constraints, worst-case bounds, and safety margins. It is useful when feasibility in bad cases is more important than average performance.</p>",
    motivation:
      "<p>Sometimes a decision must remain safe even when the input data is wrong within a known range. A capacity plan may need to handle peak traffic, a schedule may need buffers, or a model may need protection against bounded input perturbations. In these cases, optimizing only the average case can leave the system exposed.</p>" +
      "<p>Robust optimization makes the uncertainty set explicit. A decision is feasible only if it satisfies the relevant constraint for every parameter value in that set. For simple intervals this often means replacing the uncertain coefficient by its worst-case value; more generally, the model minimizes the worst-case cost over the uncertainty set.</p>",
    definition:
      "<p><b>Robust optimization</b> requires feasibility for every parameter in an uncertainty set and can minimize worst-case cost: $$\\min_x\\max_{u\\in\\mathcal U} f(x,u).$$</p>" +
      "<p><b>Assumptions that matter:</b> The uncertainty set is chosen in advance, constraints must hold for all cases in it, and simple interval uncertainty uses the worst-case coefficient.</p>",
    symbols: [
      { sym: "$u$", desc: "uncertain parameter" },
      { sym: "$\\mathcal U$", desc: "uncertainty set" },
      { sym: "$\\bar a$", desc: "nominal coefficient" },
      { sym: "$\\delta$", desc: "uncertainty radius" },
      { sym: "robust counterpart", desc: "deterministic constraint that enforces all cases" }
    ],
    derivation: [
      { do: "Start with an uncertain constraint $a x\\le b$.", result: "$a x\\le b$", why: "This is a limit whose coefficient may move." },
      { do: "Put uncertainty in a set, for example $a\\in[\\bar a-\\delta,\\bar a+\\delta]$.", result: "$a\\in[\\bar a-\\delta,\\bar a+\\delta]$", why: "This says which cases to protect against." },
      { do: "Require $a x\\le b$ for every $a$ in the set.", result: "$a$", why: "This is robust feasibility." },
      { do: "If $x\\ge0$, the worst case is the largest coefficient $a=\\bar a+\\delta$.", result: "$a=\\bar a+\\delta$", why: "This maximizes left-hand use." },
      { do: "Replace the uncertain constraint by $(\\bar a+\\delta)x\\le b$.", result: "$(\\bar a+\\delta)x\\le b$", why: "This is the robust counterpart." },
      { do: "More generally, minimize $\\max_{u\\in\\mathcal U}f(x,u)$.", result: "$\\max_{u\\in\\mathcal U}f(x,u)$", why: "This chooses the decision with best worst-case cost." }
    ],
    applications: [
      { title: "Service level", background: "This setting applies the lesson model.", numbers: "if latency load coefficient lies in $[4,6]$ and budget is 54, robust capacity requires $x\\le9$ instead of nominal $10.8$." },
      { title: "Supply uncertainty", background: "This setting applies the lesson model.", numbers: "demand in $[80,100]$ needs inventory at least 100." },
      { title: "Adversarial ML", background: "This setting applies the lesson model.", numbers: "an $\\ell_\\infty$ perturbation radius $0.03$ defines the protected input set." },
      { title: "Portfolio risk", background: "This setting applies the lesson model.", numbers: "losses 2%, 5%, 9% have worst case 9%." },
      { title: "Robust regression", background: "This setting applies the lesson model.", numbers: "clipping residuals at 3 makes a residual 8 contribute 3 to the capped loss." },
      { title: "Robust scheduling", background: "This setting applies the lesson model.", numbers: "a task with nominal 10 min and 2 min buffer reserves 12 min." }
    ]
  },
  "math-23-17": {
    connectionsProse:
      "<p>This lesson brings together the operations research tools from the whole section. Linear constraints describe shared resources, integer variables describe deployable choices, flows describe data movement, queues describe serving stability, and schedules describe time. The setting is an ML platform, where GPU placement, data pipelines, replicas, and deadlines interact. The lesson is a capstone because it uses several earlier models as parts of one system design problem.</p>",
    motivation:
      "<p>ML systems rarely have only one bottleneck. A training job needs GPUs and data movement, an inference service needs enough replicas for traffic, and experiment queues must meet deadlines without wasting capacity. Optimizing each piece separately can miss the tradeoffs between cost, latency, and completion time.</p>" +
      "<p>A capstone model treats these choices together. Assignment variables decide where jobs run, flow variables limit data movement, replica counts control serving capacity, and scheduling variables determine completion times. The objective combines resource cost, weighted completion, and latency penalties so the planner can compare tradeoffs in a single model.</p>",
    definition:
      "<p>An <b>ML systems resource model</b> combines placement, flow, scheduling, queue stability, and deployability constraints with a joint objective: $$\\min\\sum_{j,k}c_{jk}g_{jk}+\\sum_j w_jC_j+\\sum_m p_m\\max(0,\\ell_m-\\ell_m^{\\max}).$$</p>" +
      "<p><b>Assumptions that matter:</b> Assignments and replicas are deployable choices, flows obey capacity, schedules avoid conflicts, and serving queues must remain stable.</p>",
    symbols: [
      { sym: "$g_{jk}$", desc: "assignment" },
      { sym: "$G_k$", desc: "GPU capacity" },
      { sym: "$S_j,C_j$", desc: "start and completion" },
      { sym: "$x_e,u_e$", desc: "data flow and capacity" },
      { sym: "$r_m$", desc: "replicas" },
      { sym: "$\\lambda_m,\\mu_m$", desc: "arrival and service rates" },
      { sym: "$\\ell_m$", desc: "latency" }
    ],
    derivation: [
      { do: "Define assignment variables $g_{jk}$ for job $j$ on GPU type $k$.", result: "$k$", why: "This records placement." },
      { do: "Define start and completion times $S_j,C_j$.", result: "$S_j,C_j$", why: "This records scheduling." },
      { do: "Define flow variables $x_e$ on data edges and replica counts $r_m$.", result: "$r_m$", why: "This records data and serving capacity." },
      { do: "Write capacity constraints such as $\\sum_j g_{jk}\\le G_k$ and $0\\le x_e\\le u_e$. These limit shared resources.", result: "$0\\le x_e\\le u_e$", why: "This records the corresponding modeling or optimality step." },
      { do: "Write scheduling constraints $C_j=S_j+p_{jk}$ when job $j$ uses type $k$, and non-overlap constraints on each GPU.", result: "$k$", why: "This records the corresponding modeling or optimality step." },
      { do: "Write queue constraints with $\\lambda_m<\\mu_m r_m$.", result: "$\\lambda_m<\\mu_m r_m$", why: "This keeps serving stable." },
      { do: "Combine costs in an objective such as $$ \\min\\sum_{j,k}c_{jk}g_{jk}+\\sum_j w_jC_j+\\sum_m p_m\\max(0,\\ell_m-\\ell_m^{\\max}). $$ This trades off cost, completion, and latency penalties.", result: "$ \\min\\sum_{j,k}c_{jk}g_{jk}+\\sum_j w_jC_j+\\sum_m p_m\\max(0,\\ell_m-\\ell_m^{\\max}). $", why: "This records the corresponding modeling or optimality step." },
      { do: "Add integrality for assignments and replicas.", result: "the stated relationship", why: "This makes the plan deployable." }
    ],
    applications: [
      { title: "GPU cluster scheduling", background: "This setting applies the lesson model.", numbers: "assigning two 4-hour jobs to two GPUs gives makespan 4 instead of 8." },
      { title: "Inference autoscaling", background: "This setting applies the lesson model.", numbers: "with $\\lambda=180$ req/s and each replica serving $60$ req/s, at least 4 replicas keep utilization below 0.75." },
      { title: "Data pipeline bottleneck", background: "This setting applies the lesson model.", numbers: "edges 80 and 120 MB/s in series have throughput 80 MB/s." },
      { title: "Experiment queues", background: "This setting applies the lesson model.", numbers: "12 jobs at 30 minutes each require 360 GPU-minutes." },
      { title: "Feature freshness", background: "This setting applies the lesson model.", numbers: "a 15-minute pipeline with a 20-minute SLA has 5 minutes slack." },
      { title: "Traffic spike robustness", background: "This setting applies the lesson model.", numbers: "if peak traffic is 1.4 times baseline 1000 req/s, capacity must cover 1400 req/s." }
    ]
  }
};
