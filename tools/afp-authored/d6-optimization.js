/* =====================================================================
   AFP-AI Learning Guide — Domain 6 · Optimization  (modules M27–M28)
   ---------------------------------------------------------------------
   Authored source for the AFP-AI track. One object per module.
   Read by tools/gen-afp.js (-> lessons/afp-ai.js) and
   tools/gen-afp-notebooks.js (-> notebooks/afp-mNN.ipynb).
   ===================================================================== */
"use strict";

const M27 = {
  m: 27, domain: 6,
  title: "Linear & convex optimization (LP/QP, duality)",
  tagline: "Turn marketplace trade-offs into constraints, objectives, and shadow prices engineers can reason about.",
  skipIf: "write an LP and explain duals / shadow prices.",
  mapsTo: ["Event Ads perf", "Search Ads", "Instream Ads perf"],
  connections: {
    buildsOn: ["linear algebra and dot products", "gradients and loss functions", "calibration and expected value"],
    leadsTo: ["auction allocation", "budget pacing", "guaranteed delivery optimization"],
    usedWith: ["KKT conditions", "quadratic programming", "constrained empirical risk minimization"]
  },
  motivation:
    "<p>You already know how to score an ad: a calibrated model can estimate pCTR, and a bid can turn that probability into expected value. The harder marketplace question is what to do when not every valuable action is allowed. Event Ads may have delivery guarantees, Instream Ads may have inventory constraints, and Search Ads may need relevance guardrails before the auction can even run.</p>" +
    "<p><b>Optimization</b> is the language for those trade-offs. An objective says what we want to maximize, constraints say what production must respect, and the dual variables explain which constraints are actually expensive. That last part is the ads-engineer superpower: a shadow price turns a vague complaint like 'budget is tight' into a number, such as 'one more dollar of budget would add 6 expected clicks.'</p>",
  definition:
    "<p><b>Linear program.</b> In standard maximization form, choose nonnegative decisions $x$ to solve</p>" +
    "$$\\max_x\ c^\\top x \\quad \\text{subject to}\\quad Ax \\le b,\ x \\ge 0.$$" +
    "<p>The objective $c^\\top x$ and all constraints are linear. A convex optimization problem generalizes this by maximizing a concave objective or minimizing a convex objective over a convex feasible set, so every local optimum is globally meaningful. A quadratic program adds a quadratic term, for example $\\min_x \\frac12 x^\\top Qx + q^\\top x$ with $Q \\succeq 0$ and linear constraints.</p>" +
    "<p>The <b>dual</b> attaches a nonnegative price $\\lambda_j$ to each $\\le$ constraint. Weak duality says every dual-feasible solution upper-bounds the primal maximum. Under mild regularity for LPs and convex programs, strong duality holds: the best upper bound equals the best feasible objective. The KKT conditions combine feasibility, stationarity, and complementary slackness; $\\lambda_j(b_j-A_jx)=0$ says only tight constraints can have positive shadow price.</p>",
  symbols: [
    { sym: "$x \\in \\mathbb{R}^n_+$", desc: "decision variables, such as impressions allocated to campaigns or query classes." },
    { sym: "$c$", desc: "objective coefficients, such as expected clicks, revenue, or value per unit." },
    { sym: "$A$", desc: "constraint matrix; row $j$ records how each decision consumes resource $j$." },
    { sym: "$b$", desc: "resource limits, such as budget, inventory, or minimum/maximum delivery targets." },
    { sym: "$\\lambda \\ge 0$", desc: "dual variables or shadow prices for the constraints." },
    { sym: "$Q \\succeq 0$", desc: "positive semidefinite quadratic matrix, used when the objective has convex risk or smoothing penalties." }
  ],
  derivation: [
    { do: "Write one feasible decision", result: "$Ax \\le b$ and $x \\ge 0$", why: "the primal solution must satisfy every production limit before its objective matters" },
    { do: "Price every constraint", result: "$\\lambda^\\top(Ax) \\le \\lambda^\\top b$ for $\\lambda \\ge 0$", why: "multiplying a $\\le$ inequality by a nonnegative price preserves the direction" },
    { do: "Make the priced resources dominate value", result: "$A^\\top\\lambda \\ge c$", why: "then every unit's objective value is covered by the resources it consumes" },
    { do: "Bound the primal", result: "$c^\\top x \\le x^\\top A^\\top\\lambda \\le b^\\top\\lambda$", why: "any feasible dual price gives an upper bound on any feasible allocation" },
    { do: "Minimize the bound", result: "$\\min_{\\lambda \\ge 0}\ b^\\top\\lambda\ \\text{s.t.}\ A^\\top\\lambda \\ge c$", why: "the tightest valid bound is the LP dual" }
  ],
  worked: {
    problem: "A tiny Event Ads planner can buy two inventory types: feed impressions $x$ and search impressions $y$. Feed gives 5 expected clicks per thousand, search gives 4. Each feed unit costs 2 budget units; each search unit costs 1. Budget is 8 units. A serving cap allows at most 3 feed units and 6 search units. Solve the LP and read the budget shadow price.",
    skills: ["LP formulation", "vertex enumeration", "shadow price"],
    strategy: "In two variables, the optimum sits at a feasible polygon vertex; compare vertices, then perturb the binding budget to read marginal value.",
    steps: [
      { do: "Define decisions", result: "$x$ = feed units, $y$ = search units", why: "each decision represents one thousand impressions of a controllable supply type" },
      { do: "Write the objective", result: "$\\max\ 5x+4y$", why: "expected clicks add linearly across independent impression blocks" },
      { do: "Write the budget", result: "$2x+y \\le 8$", why: "feed costs 2 budget units and search costs 1" },
      { do: "List the relevant vertices", result: "$(0,0),(3,0),(0,6),(1,6),(3,2)$", why: "vertices come from intersections of active caps, axes, and the budget line" },
      { do: "Score the vertices", result: "$0,15,24,29,23$ expected clicks", why: "substitute each feasible vertex into $5x+4y$" },
      { do: "Select the maximum", result: "$(x,y)=(1,6)$ with value $29$", why: "no other feasible vertex has larger objective" },
      { do: "Increase budget to $8+\\Delta$", result: "the point becomes $(1+\\Delta/2,6)$ while $0 \\le \\Delta \\le 4$", why: "search cap stays tight and the extra budget buys feed at cost 2" },
      { do: "Compute marginal value", result: "objective becomes $29+2.5\\Delta$", why: "each extra budget unit buys half a feed unit worth 5 clicks" }
    ],
    verify: "At $(1,6)$ the budget is $2(1)+6=8$ and search cap is tight; moving budget by one unit raises the objective to $31.5$, matching the shadow price $2.5$ expected clicks per budget unit.",
    answer: "Allocate 1 feed unit and 6 search units for 29 expected clicks; the binding budget's shadow price is 2.5 expected clicks per extra budget unit until another constraint changes.",
    connects: "The dual price is not abstract math here; it is the marginal value of relaxing a production constraint in an ads allocation plan."
  },
  practice: [
    {
      problem: "Solve $\\max\ 3x+2y$ subject to $x+y \\le 4$, $x \\le 2$, $y \\le 3$, $x,y \\ge 0$ by checking vertices.",
      steps: [
        { do: "List feasible vertices", result: "$(0,0),(2,0),(2,2),(1,3),(0,3)$", why: "each is an intersection of active bounds or axes" },
        { do: "Evaluate the objective", result: "$0,6,10,9,6$", why: "substitute each vertex into $3x+2y$" },
        { do: "Choose the largest value", result: "$(2,2)$ with value $10$", why: "an LP optimum occurs at a vertex" }
      ],
      answer: "The optimum is $(x,y)=(2,2)$ with objective value $10$."
    },
    {
      problem: "For $\\max\ 4x+6y$ subject to $2x+3y \\le 12$ and $x,y \\ge 0$, find the budget shadow price.",
      steps: [
        { do: "Compare value per resource", result: "$x:4/2=2$ and $y:6/3=2$", why: "both variables turn one resource unit into the same objective value" },
        { do: "Use the whole resource", result: "any point on $2x+3y=12$ is optimal", why: "the objective is $2(2x+3y)$" },
        { do: "Perturb the resource", result: "value changes from $24$ to $24+2\\Delta$", why: "each extra resource unit is worth 2 objective units" }
      ],
      answer: "The shadow price is 2 objective units per extra resource unit."
    },
    {
      problem: "An Instream allocator minimizes $\\frac12(x-10)^2+\\frac12(y-8)^2$ subject to $x+y \\le 12$. Is this a convex QP, and why?",
      steps: [
        { do: "Read the Hessian", result: "$Q=I$", why: "the squared deviations have positive curvature in both variables" },
        { do: "Check the feasible set", result: "$x+y \\le 12$ is a half-space", why: "linear inequalities define convex sets" },
        { do: "Combine the facts", result: "convex objective plus convex feasible set", why: "every local minimum is globally meaningful" }
      ],
      answer: "Yes. It is a convex quadratic program because $Q \\succeq 0$ and the constraint is linear."
    },
    {
      problem: "A Search Ads LP has constraints budget $2x+y \\le 8$ and search cap $y \\le 6$. At optimum $(1,6)$, which constraints can have positive dual variables?",
      steps: [
        { do: "Test budget slack", result: "$8-(2(1)+6)=0$", why: "a zero slack constraint is binding" },
        { do: "Test search-cap slack", result: "$6-6=0$", why: "this constraint is also binding" },
        { do: "Apply complementary slackness", result: "only binding constraints may have positive dual values", why: "$\\lambda_j(b_j-A_jx)=0$" }
      ],
      answer: "The budget and search-cap duals may be positive; any nonbinding constraint must have dual value 0."
    },
    {
      problem: "Guaranteed delivery needs at least 4 units for campaign A and 3 for campaign B from 10 total units. Write the feasibility constraints with nonnegative slack $s$ for unused inventory.",
      steps: [
        { do: "Name decisions", result: "$x_A,x_B,s \\ge 0$", why: "allocations and unused inventory cannot be negative" },
        { do: "Write minimum delivery", result: "$x_A \\ge 4$ and $x_B \\ge 3$", why: "guarantees are lower bounds" },
        { do: "Write inventory balance", result: "$x_A+x_B+s=10$", why: "every unit is either assigned or left unused" }
      ],
      answer: "$x_A,x_B,s \\ge 0$, $x_A \\ge 4$, $x_B \\ge 3$, and $x_A+x_B+s=10$."
    }
  ],
  applications: [
    { title: "Event Ads guaranteed delivery planning", background: "Event campaigns often promise a delivery target before the event date, so the planner must allocate scarce eligible impressions without starving other campaigns.", numbers: "If campaign A needs 400k impressions at value 1.8 clicks/k and B needs 300k at 1.4 clicks/k from 900k eligible impressions, the hard guarantees consume 700k and leave 200k flexible; assigning all flexible units to A adds $200 \\times 1.8=360$ expected clicks." },
    { title: "Event Ads pacing shadow price", background: "Pacing complaints become clearer when the budget constraint has a dual value. A high dual says the campaign is budget-limited; a low dual says some other guardrail is the bottleneck.", numbers: "In the worked LP, adding one budget unit raises objective from 29 to 31.5 expected clicks, so the budget shadow price is $2.5$ clicks per dollar until the feed cap also binds." },
    { title: "Search Ads query allocation", background: "Search traffic is partitioned by query class, and allocation can be written as an LP with budget, relevance, and supply rows.", numbers: "With branded queries worth 12 clicks/k at cost 4 and broad queries worth 7 clicks/k at cost 2, value per budget is 3.0 vs 3.5; an unconstrained LP spends the next dollar on broad queries before branded queries." },
    { title: "Instream Ads inventory mix", background: "Instream supply has content-safety, format, and frequency constraints. A linear allocator gives a clear audit trail for why some high-value inventory is not fully used.", numbers: "If premium video inventory is capped at 50k impressions worth 0.9 clicks/k and standard inventory has 120k impressions worth 0.5 clicks/k, the cap's direct contribution is $50 \\times 0.9=45$ expected clicks before budget constraints interact." },
    { title: "Palette pCTR feeding value coefficients", background: "A calibrated pCTR model turns each candidate impression into an expected-value coefficient for the optimizer.", numbers: "An ad with pCTR 0.012 and bid 9 dollars has value $0.012 \\times 9=0.108$ dollars per impression; another with pCTR 0.018 and bid 5 dollars has value $0.090$, so the first receives higher objective coefficient if constraints are equal." },
    { title: "QP smoothing for delivery stability", background: "Pure LPs can jump allocations when coefficients move slightly. A QP adds a convex penalty for deviating from yesterday's plan, which makes pacing changes smoother.", numbers: "Moving from yesterday's allocation 100k to 130k with penalty $0.001(x-100)^2$ costs $0.001 \\times 30^2=0.9$ objective units, so the optimizer needs at least 0.9 units of incremental value to justify the shift." },
    { title: "Guardrail-constrained model launch", background: "When a new ranking model improves revenue but must not hurt quality, the launch decision can be posed as maximize revenue subject to guardrail loss below a threshold.", numbers: "If treatment adds 12k dollars revenue but quality loss is 0.08% against a 0.10% cap, the constraint is feasible; a variant adding 15k dollars with 0.14% loss is rejected unless the guardrail shadow price makes the trade acceptable to the policy owner." }
  ],
  applicationsClose:
    "<p>The same pattern keeps showing up: choose decisions, score them with calibrated value, constrain the production reality, and read the duals to know what is scarce. LPs and QPs are not just solver inputs; they are a shared language for ads PMs, ML engineers, and infra teams to debate marketplace trade-offs with numbers.</p>",
  takeaways: [
    "An LP maximizes $c^\\top x$ over linear constraints; a convex QP adds curvature while preserving global optimality.",
    "Dual variables are shadow prices: the marginal value of relaxing a binding constraint.",
    "KKT complementary slackness explains why nonbinding constraints have zero price.",
    "Ads allocation problems become easier to debug when objective coefficients, constraints, and dual prices are visible."
  ],
  resources: [
    { label: "Boyd & Vandenberghe — Convex Optimization", note: "the definitive text (free PDF)" },
    { label: "Stanford EE364a", note: "Boyd's course with videos + slides" },
    { label: "Google OR-Tools", note: "LP/MIP solvers in practice" },
    { label: "Hungarian algorithm (Wikipedia)", note: "assignment as an LP" }
  ],
  papers: ["Convex Optimization (Boyd & Vandenberghe, 2004)"],
  notebook: [
    { t: "md", src:
      "# M27 · Linear & convex optimization\n\n" +
      "AFP-AI · Domain 6 · Optimization\n\n" +
      "We solve a tiny ads LP by enumerating vertices, then read a shadow price by perturbing the budget. The math shape is $\\max c^\\top x$ subject to $Ax \\le b$ and $x \\ge 0$." },
    { t: "code", src:
      "import numpy as np\n" +
      "import matplotlib.pyplot as plt\n\n" +
      "rng = np.random.default_rng(27)" },
    { t: "md", src:
      "## The Event Ads toy LP\n\n" +
      "Let $x$ be feed inventory units and $y$ be search inventory units. We maximize expected clicks $5x+4y$ subject to budget $2x+y \\le 8$, feed cap $x \\le 3$, search cap $y \\le 6$, and nonnegativity." },
    { t: "code", src:
      "c = np.array([5.0, 4.0])\n" +
      "A = np.array([[2.0, 1.0], [1.0, 0.0], [0.0, 1.0]])\n" +
      "b = np.array([8.0, 3.0, 6.0])\n\n" +
      "print(\"objective coefficients:\", c)\n" +
      "print(\"constraint matrix:\")\n" +
      "print(A)" },
    { t: "md", src:
      "## Enumerate vertices\n\n" +
      "In two variables, every LP optimum occurs at a polygon vertex. We get candidate vertices by intersecting pairs of active boundaries: three resource constraints plus the two axes." },
    { t: "code", src:
      "boundaries_A = np.vstack([A, np.array([1.0, 0.0]), np.array([0.0, 1.0])])\n" +
      "boundaries_b = np.concatenate([b, np.array([0.0, 0.0])])\n\n" +
      "vertices = []\n" +
      "for i in range(len(boundaries_b)):\n" +
      "    for j in range(i + 1, len(boundaries_b)):\n" +
      "        M = np.vstack([boundaries_A[i], boundaries_A[j]])\n" +
      "        if abs(np.linalg.det(M)) < 1e-9:\n" +
      "            continue\n" +
      "        point = np.linalg.solve(M, np.array([boundaries_b[i], boundaries_b[j]]))\n" +
      "        if np.all(A @ point <= b + 1e-9) and np.all(point >= -1e-9):\n" +
      "            vertices.append(point)\n\n" +
      "vertices = np.unique(np.round(np.array(vertices), 10), axis=0)\n" +
      "values = vertices @ c\n\n" +
      "for point, value in zip(vertices, values):\n" +
      "    print(point, round(value, 2))" },
    { t: "md", src:
      "## Pick the optimum\n\n" +
      "The best vertex has the largest value $c^\\top x$. The assertion checks the same optimum as the lesson text." },
    { t: "code", src:
      "best_index = int(np.argmax(values))\n" +
      "best_point = vertices[best_index]\n" +
      "best_value = float(values[best_index])\n\n" +
      "print(\"best point:\", best_point)\n" +
      "print(\"best value:\", best_value)\n\n" +
      "assert np.allclose(best_point, np.array([1.0, 6.0]))\n" +
      "assert abs(best_value - 29.0) < 1e-9" },
    { t: "md", src:
      "## Read the shadow price\n\n" +
      "A shadow price is a marginal value. We re-solve the tiny LP after increasing the budget by $\\Delta$ and estimate $\\frac{dV}{db}$ from finite differences." },
    { t: "code", src:
      "def solve_budget(budget):\n" +
      "    local_b = np.array([budget, 3.0, 6.0])\n" +
      "    local_vertices = []\n" +
      "    local_boundaries_b = np.concatenate([local_b, np.array([0.0, 0.0])])\n" +
      "    for i in range(len(local_boundaries_b)):\n" +
      "        for j in range(i + 1, len(local_boundaries_b)):\n" +
      "            M = np.vstack([boundaries_A[i], boundaries_A[j]])\n" +
      "            if abs(np.linalg.det(M)) < 1e-9:\n" +
      "                continue\n" +
      "            point = np.linalg.solve(M, np.array([local_boundaries_b[i], local_boundaries_b[j]]))\n" +
      "            if np.all(A @ point <= local_b + 1e-9) and np.all(point >= -1e-9):\n" +
      "                local_vertices.append(point)\n" +
      "    local_vertices = np.unique(np.round(np.array(local_vertices), 10), axis=0)\n" +
      "    local_values = local_vertices @ c\n" +
      "    return float(np.max(local_values))\n\n" +
      "base_value = solve_budget(8.0)\n" +
      "value_plus = solve_budget(9.0)\n" +
      "shadow_price = value_plus - base_value\n\n" +
      "print(\"value at budget 8:\", base_value)\n" +
      "print(\"value at budget 9:\", value_plus)\n" +
      "print(\"shadow price:\", shadow_price)\n\n" +
      "assert abs(shadow_price - 2.5) < 1e-9" },
    { t: "md", src:
      "## Visualize the feasible polygon\n\n" +
      "The red point is the optimal allocation. The binding budget and search cap explain why the shadow price is positive." },
    { t: "code", src:
      "order = np.array([0, 1, 4, 3, 2])\n" +
      "polygon = vertices[order]\n\n" +
      "fig, ax = plt.subplots(figsize=(5, 4))\n" +
      "ax.fill(polygon[:, 0], polygon[:, 1], alpha=0.2, color=\"#4c78a8\")\n" +
      "ax.scatter(vertices[:, 0], vertices[:, 1], color=\"#4c78a8\")\n" +
      "ax.scatter([best_point[0]], [best_point[1]], color=\"#e45756\", s=80)\n" +
      "ax.set_xlabel(\"feed units x\")\n" +
      "ax.set_ylabel(\"search units y\")\n" +
      "ax.set_title(\"feasible set and optimum\")\n" +
      "plt.show()" },
    { t: "md", src:
      "## Your turn\n\n" +
      "1. Change the search cap from 6 to 5 and re-solve.\n" +
      "2. Change the feed click coefficient from 5 to 7 and see when the optimum moves.\n" +
      "3. Add a new constraint $x+y \\le 7$ and list which constraints bind." },
    { t: "code", src:
      "# Your turn:\n" }
  ]
};

const M28 = {
  m: 28, domain: 6,
  title: "Ads marketplace optimization (value-of-impression, pacing, guaranteed delivery, auctions, multi-objective + guardrails)",
  tagline: "Connect calibrated pCTR to real marketplace decisions: value, auction rank, pacing, delivery, and guardrails.",
  skipIf: "explain how a calibrated pCTR feeds a marketplace value/allocation.",
  mapsTo: ["Instream Ads perf", "Event Ads perf", "Search Ads"],
  connections: {
    buildsOn: ["calibrated pCTR", "offline metrics and guardrails", "linear and convex optimization"],
    leadsTo: ["marketplace simulation", "delivery controllers", "auction experimentation"],
    usedWith: ["second-price auctions", "feedback control", "constrained allocation"]
  },
  motivation:
    "<p>This is the capstone because it is where the previous modules stop being separate skills. Palette gives a calibrated pCTR, the advertiser gives a bid or goal, optimization chooses an allocation, and the marketplace must still respect budget, user experience, relevance, and delivery commitments. A tiny calibration error can become a real budget or quality error once it enters the auction.</p>" +
    "<p>The load-bearing idea is <b>value of an impression</b>: $v=\\widehat{pCTR}\\times bid$ for a CPC-style objective. That value can be ranked in an auction, multiplied by a pacing control signal, and constrained by guaranteed-delivery or guardrail rows. The marketplace is not one model; it is a control system built from predictions, prices, and constraints.</p>",
  definition:
    "<p>For candidate ad $i$ in an impression opportunity, a simple expected-value score is</p>" +
    "$$v_i = q_i\,\\widehat{p}_i\,b_i\,m_i,$$" +
    "<p>where $\\widehat{p}_i$ is calibrated pCTR, $b_i$ is bid, $q_i$ is a quality or relevance factor, and $m_i$ is a pacing multiplier. In a second-price auction, the highest ranked candidate wins but pays a price tied to the next competitor, often normalized by the winner's prediction or quality. Pacing updates $m_i$ as feedback: underspend raises the multiplier, overspend lowers it.</p>" +
    "<p>Guaranteed delivery can be written as constrained optimization: choose allocations $x_{ij}$ from impression segments $j$ to campaigns $i$ to maximize value while satisfying supply, eligibility, campaign goals, and guardrails. Multi-objective optimization can be handled by a weighted objective, such as revenue plus engagement, or by constraints, such as maximize revenue subject to member-quality loss $\\le 0.1\\%$.</p>",
  symbols: [
    { sym: "$\\widehat{p}_i$", desc: "calibrated predicted click-through rate for ad $i$ on this impression." },
    { sym: "$b_i$", desc: "advertiser bid or marginal value per click/action." },
    { sym: "$q_i$", desc: "quality, relevance, or eligibility factor that can downweight unsafe or low-quality matches." },
    { sym: "$m_i$", desc: "pacing multiplier from the budget controller; below 1 slows spend, above 1 accelerates spend." },
    { sym: "$v_i$", desc: "marketplace rank value used for allocation or auction ordering." },
    { sym: "$x_{ij}$", desc: "allocation amount from campaign $i$ to impression segment $j$." }
  ],
  derivation: [
    { do: "Start from expected advertiser value", result: "$\\mathbb{E}[value]=P(click)\\times bid$", why: "a CPC bid pays value only when a click occurs" },
    { do: "Use calibrated prediction", result: "$P(click) \\approx \\widehat{p}$", why: "calibration makes model scores usable as probabilities, not just ranks" },
    { do: "Add marketplace modifiers", result: "$v=q\\widehat{p}bm$", why: "quality and pacing change allocation without retraining the pCTR model" },
    { do: "Rank candidates", result: "$winner=\\arg\\max_i v_i$", why: "the highest expected marketplace value receives the impression before pricing" },
    { do: "Constrain the loop", result: "$spend_t \\to budget_t$ with guardrails", why: "pacing and optimization keep repeated auction wins aligned to budget and member experience" }
  ],
  worked: {
    problem: "Three Search Ads candidates enter one auction. A has pCTR 0.020 and bid 8 dollars, B has pCTR 0.030 and bid 5 dollars, C has pCTR 0.012 and bid 11 dollars. First rank by value $pCTR \\times bid$. Then apply a pacing multiplier $m_A=0.7$ to A and recompute. Use a normalized second-price estimate where winner cost per click is the second rank value divided by the winner's pCTR.",
    skills: ["expected value", "auction ranking", "pacing multiplier", "second-price pricing"],
    strategy: "Compute value once without pacing, then change only the paced candidate's value so you can see the controller's effect.",
    steps: [
      { do: "Compute A's unpaced value", result: "$0.020 \\times 8=0.160$", why: "expected value is probability times bid" },
      { do: "Compute B's unpaced value", result: "$0.030 \\times 5=0.150$", why: "B has lower bid but higher pCTR" },
      { do: "Compute C's unpaced value", result: "$0.012 \\times 11=0.132$", why: "C's high bid is not enough to overcome low pCTR" },
      { do: "Pick the unpaced winner", result: "A wins with rank value 0.160", why: "0.160 is greater than 0.150 and 0.132" },
      { do: "Price A by normalized second price", result: "$0.150/0.020=7.50$ per click", why: "A pays just enough rank value to beat B" },
      { do: "Apply A's pacing multiplier", result: "$0.7 \\times 0.160=0.112$", why: "the controller slows A because it is ahead of spend target" },
      { do: "Re-rank with pacing", result: "B wins because $0.150>0.132>0.112$", why: "pacing changes allocation even though model pCTR and bids did not change" },
      { do: "Compute B's paced price", result: "$0.132/0.030=4.40$ per click", why: "B now pays enough to beat C, the second ranked candidate" }
    ],
    verify: "Without pacing A's expected spend per impression is approximately $0.020 \\times 7.50=0.150$; after pacing, A loses this auction and B's expected spend is $0.030 \\times 4.40=0.132$.",
    answer: "A wins unpaced and pays about \\$7.50 CPC; after A is paced to 0.7, B wins and pays about \\$4.40 CPC. The pCTR model, bid, and pacing controller jointly determine allocation.",
    connects: "This is the marketplace bridge: calibrated pCTR becomes value, value becomes rank, pacing changes rank, and second-price logic turns rank into spend."
  },
  practice: [
    {
      problem: "Two Instream candidates have pCTR/bid pairs (0.015, 12 dollars) and (0.025, 6 dollars). Which has higher value?",
      steps: [
        { do: "Compute candidate 1 value", result: "$0.015 \\times 12=0.180$", why: "expected value multiplies probability by bid" },
        { do: "Compute candidate 2 value", result: "$0.025 \\times 6=0.150$", why: "higher pCTR can still lose to a much lower bid" },
        { do: "Compare", result: "$0.180>0.150$", why: "ranking uses value, not pCTR alone" }
      ],
      answer: "Candidate 1 has higher value, 0.180 vs 0.150."
    },
    {
      problem: "A campaign should spend 100 dollars by noon but has spent 80 dollars. A simple pacing rule is $m_{new}=m_{old}(1+0.5(target-spend)/target)$ with $m_{old}=1.0$. Compute $m_{new}$.",
      steps: [
        { do: "Compute relative underspend", result: "$(100-80)/100=0.20$", why: "the controller reacts to percent error" },
        { do: "Scale by gain", result: "$0.5 \\times 0.20=0.10$", why: "gain controls how aggressively the multiplier moves" },
        { do: "Update multiplier", result: "$1.0(1+0.10)=1.10$", why: "underspend raises the multiplier" }
      ],
      answer: "The new pacing multiplier is 1.10."
    },
    {
      problem: "A guaranteed Event Ads campaign needs 10k impressions today. By 3 p.m. it should be 60% done but has delivered 5.2k. How many impressions behind or ahead is it?",
      steps: [
        { do: "Compute target delivery", result: "$0.60 \\times 10{,}000=6{,}000$", why: "the planned delivery curve sets the expected cumulative count" },
        { do: "Compare actual", result: "$5{,}200-6{,}000=-800$", why: "negative means behind target" }
      ],
      answer: "It is 800 impressions behind the planned curve."
    },
    {
      problem: "A multi-objective score is revenue lift minus 50 times quality loss. Variant A has 9k dollars revenue lift and 0.04 quality-loss points; Variant B has 11k dollars and 0.09 points. Which score is larger?",
      steps: [
        { do: "Score A", result: "$9-50(0.04)=7$", why: "measure revenue in thousands and penalize quality loss" },
        { do: "Score B", result: "$11-50(0.09)=6.5$", why: "higher revenue can lose after the guardrail penalty" },
        { do: "Compare", result: "$7>6.5$", why: "the objective encodes the trade-off" }
      ],
      answer: "Variant A has the larger weighted score."
    },
    {
      problem: "In a second-price Search Ads auction, the winner has pCTR 0.04 and the runner-up rank value is 0.12. Estimate the winner's CPC.",
      steps: [
        { do: "Write normalized price", result: "$CPC=0.12/0.04$", why: "the winner pays enough expected value to beat the runner-up" },
        { do: "Divide", result: "$CPC=3.00$", why: "the pCTR converts rank value back to cost per click" }
      ],
      answer: "The estimated CPC is 3.00 dollars."
    }
  ],
  applications: [
    { title: "Palette pCTR as marketplace value", background: "Palette or any calibrated pCTR system becomes operational only when its probability is multiplied by bid and used in ranking.", numbers: "If ad A has pCTR 0.018 and bid 7 dollars, its value is $0.126$; ad B with pCTR 0.012 and bid 12 dollars has value $0.144$, so B ranks higher despite lower predicted click probability." },
    { title: "Search Ads second-price allocation", background: "Search auctions commonly rank by expected value or quality-adjusted bid, then price from the next competitor to preserve incentive-compatible behavior approximately.", numbers: "Winner value 0.20 with pCTR 0.025 and runner-up value 0.15 gives CPC $0.15/0.025=6.00$; expected spend per impression is $0.025 \\times 6.00=0.15$." },
    { title: "Instream Ads pacing control", background: "Video supply arrives unevenly during the day. A pacing multiplier prevents a strong campaign from spending the whole budget before evening supply appears.", numbers: "A campaign with target spend 1,000 dollars by hour 12 and actual spend 1,200 dollars has error $(1000-1200)/1000=-0.20$; with gain 0.5, multiplier changes by -10%, so 1.0 becomes 0.90." },
    { title: "Event Ads guaranteed delivery", background: "Event campaigns are time-sensitive: underdelivery close to the event date can be more damaging than ordinary auction inefficiency.", numbers: "A 50k-impression guarantee over 5 days needs 10k/day. After three days the target is 30k; if delivered is 27k, the campaign is 3k behind and tomorrow's target may rise from 10k to 13k." },
    { title: "SHALE-style constrained allocation", background: "Guaranteed-display allocation systems solve for campaign-segment allocations that meet contracts while preserving high-value inventory for the best fit.", numbers: "If segment S has 100k impressions and campaigns A/B need 60k/50k but both can use S, total demand is 110k, so at least 10k must come from another eligible segment or one guarantee is infeasible." },
    { title: "Guardrail-constrained launch decisions", background: "Marketplace changes can improve revenue while hurting member experience, so guardrails should be constraints rather than afterthoughts.", numbers: "If a Search Ads ranker lifts revenue by 1.6% but lowers long-click quality by 0.12% against a 0.10% cap, it fails the guardrail even though the primary metric improves." },
    { title: "Multi-objective Instream ranking", background: "Instream ads balance advertiser value, viewer experience, content safety, and format fit. A weighted score makes the trade-off explicit before an experiment.", numbers: "Score = value + 0.2 quality. Candidate A has value 0.130 and quality 0.50, score 0.230; B has value 0.150 and quality 0.30, score 0.210, so A wins under this product weighting." },
    { title: "Budget pacing as spend prediction", background: "A controller is only useful if multiplier changes translate into spend changes, so teams often simulate before rollout.", numbers: "If a campaign wins 1,000 impressions at expected spend 0.08 dollars each, daily spend is 80 dollars; reducing the multiplier so wins fall to 700 impressions lowers spend to about 56 dollars, a 24 dollar reduction." }
  ],
  applicationsClose:
    "<p>The capstone thread is simple but powerful: calibrated probability becomes value, value enters auctions and optimizers, pacing feeds back from spend, and constraints keep the marketplace safe. Search Ads, Instream Ads, Event Ads, and Palette pCTR are different uniforms for the same prediction-plus-optimization system.</p>",
  takeaways: [
    "Calibrated pCTR matters because $\\widehat{pCTR} \\times bid$ is a marketplace value, not just a model score.",
    "Pacing multipliers are feedback controls that change allocation without changing bids or retraining models.",
    "Guaranteed delivery and guardrails are constrained optimization problems layered on top of auctions.",
    "A marketplace launch should reason about value, spend, delivery, and member-quality constraints together."
  ],
  resources: [
    { label: "Budget Pacing at LinkedIn (Agarwal et al., 2014)", note: "the pacing control loop in production" }
  ],
  papers: [
    "Budget Pacing for Targeted Online Advertisements at LinkedIn (Agarwal et al., 2014)",
    "SHALE: guaranteed-display allocation (Bharadwaj et al., 2012)",
    "Bid Optimization by Multivariable Control (Yang et al., 2019)"
  ],
  notebook: [
    { t: "md", src:
      "# M28 · Ads marketplace optimization\n\n" +
      "AFP-AI · Domain 6 · Optimization\n\n" +
      "This notebook simulates a tiny auction and pacing loop. Candidate value is $v=\\widehat{pCTR} \\times bid \\times m$, where $m$ is a pacing multiplier." },
    { t: "code", src:
      "import numpy as np\n" +
      "import pandas as pd\n" +
      "import matplotlib.pyplot as plt\n\n" +
      "rng = np.random.default_rng(28)" },
    { t: "md", src:
      "## One auction first\n\n" +
      "We rank three ads by calibrated pCTR times bid. Then we apply a pacing multiplier to one advertiser and watch the winner change." },
    { t: "code", src:
      "ads = pd.DataFrame({\n" +
      "    \"ad\": [\"A\", \"B\", \"C\"],\n" +
      "    \"pctr\": [0.020, 0.030, 0.012],\n" +
      "    \"bid\": [8.0, 5.0, 11.0],\n" +
      "    \"multiplier\": [1.0, 1.0, 1.0]\n" +
      "})\n\n" +
      "ads[\"value\"] = ads[\"pctr\"] * ads[\"bid\"] * ads[\"multiplier\"]\n" +
      "ads = ads.sort_values(\"value\", ascending=False).reset_index(drop=True)\n\n" +
      "print(ads)" },
    { t: "md", src:
      "## Second-price estimate\n\n" +
      "If the highest value wins, a normalized second-price CPC is approximately the runner-up value divided by the winner's pCTR." },
    { t: "code", src:
      "winner = ads.iloc[0]\n" +
      "runner_up = ads.iloc[1]\n" +
      "cpc = runner_up[\"value\"] / winner[\"pctr\"]\n" +
      "expected_spend = winner[\"pctr\"] * cpc\n\n" +
      "print(\"winner:\", winner[\"ad\"])\n" +
      "print(\"estimated CPC:\", round(cpc, 2))\n" +
      "print(\"expected spend per impression:\", round(expected_spend, 3))\n\n" +
      "assert winner[\"ad\"] == \"A\"\n" +
      "assert abs(cpc - 7.5) < 1e-9" },
    { t: "md", src:
      "## Apply pacing\n\n" +
      "Now A is ahead of budget, so its multiplier drops to $0.7$. The pCTR and bid stay the same; only the control signal changes." },
    { t: "code", src:
      "paced_ads = pd.DataFrame({\n" +
      "    \"ad\": [\"A\", \"B\", \"C\"],\n" +
      "    \"pctr\": [0.020, 0.030, 0.012],\n" +
      "    \"bid\": [8.0, 5.0, 11.0],\n" +
      "    \"multiplier\": [0.7, 1.0, 1.0]\n" +
      "})\n\n" +
      "paced_ads[\"value\"] = paced_ads[\"pctr\"] * paced_ads[\"bid\"] * paced_ads[\"multiplier\"]\n" +
      "paced_ads = paced_ads.sort_values(\"value\", ascending=False).reset_index(drop=True)\n" +
      "paced_winner = paced_ads.iloc[0]\n" +
      "paced_runner_up = paced_ads.iloc[1]\n" +
      "paced_cpc = paced_runner_up[\"value\"] / paced_winner[\"pctr\"]\n\n" +
      "print(paced_ads)\n" +
      "print(\"paced winner:\", paced_winner[\"ad\"])\n" +
      "print(\"paced CPC:\", round(paced_cpc, 2))\n\n" +
      "assert paced_winner[\"ad\"] == \"B\"\n" +
      "assert abs(paced_cpc - 4.4) < 1e-9" },
    { t: "md", src:
      "## Simulate a day of auctions\n\n" +
      "We create 240 small auction opportunities. Advertiser A has a budget target; every 20 auctions, a feedback controller updates A's multiplier from spend error." },
    { t: "code", src:
      "n = 240\n" +
      "base_pctr = np.array([0.020, 0.026, 0.014])\n" +
      "bids = np.array([8.0, 5.5, 10.0])\n" +
      "multipliers = np.array([1.0, 1.0, 1.0])\n" +
      "budget_a = 18.0\n" +
      "gain = 0.8\n" +
      "spend_a = 0.0\n" +
      "spend_history = []\n" +
      "target_history = []\n" +
      "multiplier_history = []\n" +
      "wins = []\n\n" +
      "for t in range(n):\n" +
      "    noise = rng.normal(0.0, 0.003, size=3)\n" +
      "    pctr = np.clip(base_pctr + noise, 0.002, 0.08)\n" +
      "    values = pctr * bids * multipliers\n" +
      "    order = np.argsort(values)[::-1]\n" +
      "    winner_index = int(order[0])\n" +
      "    runner_index = int(order[1])\n" +
      "    price = values[runner_index] / pctr[winner_index]\n" +
      "    spend = pctr[winner_index] * price\n" +
      "    if winner_index == 0:\n" +
      "        spend_a = spend_a + spend\n" +
      "    if (t + 1) % 20 == 0:\n" +
      "        target = budget_a * (t + 1) / n\n" +
      "        error = (target - spend_a) / max(target, 1e-9)\n" +
      "        multipliers[0] = np.clip(multipliers[0] * (1.0 + gain * error), 0.2, 2.5)\n" +
      "    target = budget_a * (t + 1) / n\n" +
      "    spend_history.append(spend_a)\n" +
      "    target_history.append(target)\n" +
      "    multiplier_history.append(multipliers[0])\n" +
      "    wins.append(winner_index)\n\n" +
      "print(\"final A spend:\", round(spend_a, 2))\n" +
      "print(\"budget target:\", budget_a)\n" +
      "print(\"final A multiplier:\", round(multipliers[0], 3))\n\n" +
      "assert spend_a <= budget_a * 1.35\n" +
      "assert spend_a >= budget_a * 0.65" },
    { t: "md", src:
      "## Visualize spend tracking\n\n" +
      "The controller is deliberately simple, but it shows the production idea: spend error changes future auction rank through the multiplier." },
    { t: "code", src:
      "steps = np.arange(1, n + 1)\n\n" +
      "fig, axes = plt.subplots(1, 2, figsize=(10, 3))\n" +
      "axes[0].plot(steps, spend_history, label=\"A spend\")\n" +
      "axes[0].plot(steps, target_history, label=\"target\")\n" +
      "axes[0].set_title(\"pacing spend vs target\")\n" +
      "axes[0].set_xlabel(\"auction\")\n" +
      "axes[0].set_ylabel(\"expected spend\")\n" +
      "axes[0].legend()\n" +
      "axes[1].plot(steps, multiplier_history, color=\"#f58518\")\n" +
      "axes[1].set_title(\"A pacing multiplier\")\n" +
      "axes[1].set_xlabel(\"auction\")\n" +
      "plt.tight_layout()\n" +
      "plt.show()" },
    { t: "md", src:
      "## Add a guardrail view\n\n" +
      "A marketplace choice can pass value ranking but fail a product guardrail. Here we summarize who won and check whether A stayed close enough to budget." },
    { t: "code", src:
      "win_counts = pd.Series(wins).map({0: \"A\", 1: \"B\", 2: \"C\"}).value_counts().sort_index()\n" +
      "budget_error = (spend_a - budget_a) / budget_a\n\n" +
      "print(win_counts)\n" +
      "print(\"budget error:\", round(budget_error, 3))\n\n" +
      "assert abs(budget_error) < 0.35" },
    { t: "md", src:
      "## Your turn\n\n" +
      "1. Increase A's bid from 8 to 10 and re-run the loop.\n" +
      "2. Lower the gain from 0.8 to 0.2 and compare tracking.\n" +
      "3. Add a quality multiplier $q$ and rank by $q \\times pCTR \\times bid \\times m$." },
    { t: "code", src:
      "# Your turn:\n" }
  ]
};

module.exports = [M27, M28];
