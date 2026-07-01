module.exports = {
  "math-23-01": {
    id: "math-23-01",
    title: "Modeling in operations research",
    tagline: "Operations research turns a messy choice into variables, constraints, and a goal you can reason about.",
    connections: {
      buildsOn: ["linear equations", "inequalities", "functions", "systems of equations"],
      leadsTo: ["Linear programming formulation", "Integer programming", "The transportation problem"],
      usedWith: ["linear algebra", "graph theory", "probability", "convex sets"]
    },
    motivation:
      "<p>You already make constrained choices: spend a budget, fit work into a day, or choose the shortest route with deadlines. The hard part is not that any one calculation is scary; it is that many small rules compete at once.</p>" +
      "<p><b>Operations research</b> gives those choices a clean mathematical shape. We name the decisions, write the limits they must obey, and choose an objective that says what better means. The model is a careful translation before it is a computation.</p>",
    definition:
      "<p>An operations research model has <b>decision variables</b> such as $x_1,x_2$, an <b>objective function</b> such as profit $P=40x_1+30x_2$, and <b>constraints</b> such as $2x_1+x_2\\le100$. A feasible solution is any variable choice satisfying every constraint. An optimal solution is a feasible solution with the best objective value.</p>" +
      "<p>The model comes from conservation and accounting. If one unit of product 1 uses 2 labor hours and one unit of product 2 uses 1 labor hour, then producing $x_1$ and $x_2$ units uses $2x_1+x_2$ hours. A 100-hour limit becomes $2x_1+x_2\\le100$.</p>" +
      "<p><b>Assumptions that matter:</b> variables must match real decisions; units must be consistent; constraints should include every binding rule; and the objective must represent the actual goal, not merely what is easy to measure.</p>",
    worked: {
      problem: "A bakery makes loaves and cakes. A loaf uses 2 kg flour and 1 hour; a cake uses 1 kg flour and 3 hours. There are 40 kg flour and 45 hours. Profit is $4$ per loaf and $7$ per cake. Build the OR model.",
      skills: ["decision variables", "resource constraints", "objective functions"],
      strategy: "Translate one sentence at a time — decisions first, then each resource, then profit.",
      steps: [
        { do: "Define the loaf variable", result: "$x=$ number of loaves", why: "one variable should represent one controllable decision" },
        { do: "Define the cake variable", result: "$y=$ number of cakes", why: "the second product needs its own decision variable" },
        { do: "Write the flour use", result: "$2x+y$ kg", why: "loaves use 2 kg each and cakes use 1 kg each" },
        { do: "Limit the flour use", result: "$2x+y\\le40$", why: "available flour is 40 kg" },
        { do: "Write the time use", result: "$x+3y$ hours", why: "loaves use 1 hour each and cakes use 3 hours each" },
        { do: "Limit the time use", result: "$x+3y\\le45$", why: "available time is 45 hours" },
        { do: "Write the objective", result: "$\\max P=4x+7y$", why: "profit adds dollars from both products" },
        { do: "Add nonnegativity", result: "$x\\ge0,\\ y\\ge0$", why: "negative production is not meaningful" }
      ],
      verify: "Units match in each constraint: flour with flour, hours with hours, and dollars with dollars.",
      answer: "Maximize $P=4x+7y$ subject to $2x+y\\le40$, $x+3y\\le45$, $x\\ge0$, and $y\\ge0$.",
      connects: "A good OR model is a faithful translation: every symbol earns its place from the story."
    },
    practice: [
      { problem: "A shop sells mugs and plates. A mug uses 1 clay unit and 2 paint minutes; a plate uses 3 clay units and 1 paint minute. Clay is 60 units and paint is 50 minutes. Profits are $5$ and $8$. Build the model.", steps: [
        { do: "Define variables", result: "$m=$ mugs, $p=$ plates", why: "each product quantity is a decision" },
        { do: "Write clay use", result: "$m+3p$", why: "mugs use 1 and plates use 3 clay units" },
        { do: "Limit clay", result: "$m+3p\\le60$", why: "only 60 clay units are available" },
        { do: "Write paint use", result: "$2m+p$", why: "mugs use 2 and plates use 1 paint minute" },
        { do: "Limit paint", result: "$2m+p\\le50$", why: "only 50 paint minutes are available" },
        { do: "Write profit objective", result: "$\\max P=5m+8p$", why: "total profit adds both product profits" },
        { do: "Add sign limits", result: "$m\\ge0,\\ p\\ge0$", why: "production amounts cannot be negative" }
      ], answer: "Maximize $P=5m+8p$ subject to $m+3p\\le60$, $2m+p\\le50$, $m,p\\ge0$." },
      { problem: "A delivery team chooses small vans $s$ and large vans $l$. Small vans carry 20 boxes and cost $90$; large vans carry 50 boxes and cost $180$. At least 300 boxes must be moved using at most 8 vans. Minimize cost.", steps: [
        { do: "Define variables", result: "$s=$ small vans, $l=$ large vans", why: "the fleet mix is the decision" },
        { do: "Write carried boxes", result: "$20s+50l$", why: "capacity adds across vans" },
        { do: "Require enough capacity", result: "$20s+50l\\ge300$", why: "at least 300 boxes must be moved" },
        { do: "Count total vans", result: "$s+l$", why: "both types use one van slot" },
        { do: "Limit vans", result: "$s+l\\le8$", why: "the team can use at most 8 vans" },
        { do: "Write cost objective", result: "$\\min C=90s+180l$", why: "we choose the lowest total rental cost" },
        { do: "Add nonnegativity", result: "$s\\ge0,\\ l\\ge0$", why: "negative vans are impossible" }
      ], answer: "Minimize $C=90s+180l$ subject to $20s+50l\\ge300$, $s+l\\le8$, $s,l\\ge0$." },
      { problem: "A nutrition mix uses oats $o$ and nuts $n$. Oats have 6 g protein and 2 g fiber per scoop; nuts have 4 g protein and 5 g fiber. Need at least 40 g protein and 25 g fiber. Costs are $0.30$ and $0.80$ per scoop. Build a cost model.", steps: [
        { do: "Define variables", result: "$o=$ oat scoops, $n=$ nut scoops", why: "amounts of ingredients are decisions" },
        { do: "Write protein amount", result: "$6o+4n$", why: "protein contributions add" },
        { do: "Write protein requirement", result: "$6o+4n\\ge40$", why: "the mix needs at least 40 g" },
        { do: "Write fiber amount", result: "$2o+5n$", why: "fiber contributions add" },
        { do: "Write fiber requirement", result: "$2o+5n\\ge25$", why: "the mix needs at least 25 g" },
        { do: "Write cost objective", result: "$\\min C=0.30o+0.80n$", why: "cost per scoop times number of scoops" },
        { do: "Add sign limits", result: "$o,n\\ge0$", why: "ingredient amounts cannot be negative" }
      ], answer: "Minimize $C=0.30o+0.80n$ subject to $6o+4n\\ge40$, $2o+5n\\ge25$, $o,n\\ge0$." },
      { problem: "A call center schedules day agents $d$ and evening agents $e$. Day agents cover 6 day calls and 2 evening calls; evening agents cover 1 day call and 5 evening calls. Need 120 day calls and 90 evening calls covered. Wages are $160$ and $140$. Build the staffing model.", steps: [
        { do: "Define variables", result: "$d=$ day agents, $e=$ evening agents", why: "staff counts are decisions" },
        { do: "Write day-call coverage", result: "$6d+e$", why: "both agent types help day calls" },
        { do: "Require day coverage", result: "$6d+e\\ge120$", why: "all expected day calls must be covered" },
        { do: "Write evening-call coverage", result: "$2d+5e$", why: "both agent types help evening calls" },
        { do: "Require evening coverage", result: "$2d+5e\\ge90$", why: "all expected evening calls must be covered" },
        { do: "Write wage objective", result: "$\\min W=160d+140e$", why: "staffing wants minimum cost" },
        { do: "Add nonnegativity", result: "$d,e\\ge0$", why: "negative agents are impossible" }
      ], answer: "Minimize $W=160d+140e$ subject to $6d+e\\ge120$, $2d+5e\\ge90$, $d,e\\ge0$." },
      { problem: "A simple ML batch planner chooses GPU batches $g$ and CPU batches $c$. A GPU batch processes 800 examples and uses 4 energy units; a CPU batch processes 300 examples and uses 1 energy unit. Process at least 5000 examples with at most 25 energy units, minimizing time $12g+20c$ minutes. Build the model.", steps: [
        { do: "Define variables", result: "$g=$ GPU batches, $c=$ CPU batches", why: "batch counts are the decisions" },
        { do: "Write examples processed", result: "$800g+300c$", why: "throughput adds across batch types" },
        { do: "Require enough examples", result: "$800g+300c\\ge5000$", why: "training needs at least 5000 examples" },
        { do: "Write energy use", result: "$4g+c$", why: "GPU and CPU batches consume energy" },
        { do: "Limit energy", result: "$4g+c\\le25$", why: "the energy budget is 25 units" },
        { do: "Write time objective", result: "$\\min T=12g+20c$", why: "the planner wants shortest total runtime" },
        { do: "Add sign limits", result: "$g,c\\ge0$", why: "batch counts cannot be negative" }
      ], answer: "Minimize $T=12g+20c$ subject to $800g+300c\\ge5000$, $4g+c\\le25$, $g,c\\ge0$." }
    ],
    applications: [
      { title: "Factory product mix", background: "Industrial OR grew from wartime logistics and factory planning. A plant chooses quantities while respecting limited machines and labor.", numbers: "If product A uses 3 machine hours and product B uses 2, making 10 and 15 uses $3*10+2*15=60$ hours." },
      { title: "Cloud capacity planning", background: "Engineering teams model servers as resources with cost and throughput. The same accounting keeps budgets visible.", numbers: "With 8 CPU nodes at $40$ jobs/hour and 3 GPU nodes at $120$ jobs/hour, capacity is $8*40+3*120=680$ jobs/hour." },
      { title: "Ad budget allocation", background: "Marketing teams split spend across channels while meeting reach or frequency targets. OR makes tradeoffs explicit.", numbers: "Spending $4000$ at $0.50$ per click and $2000$ at $1.00$ per click buys $8000+2000=10000$ clicks." },
      { title: "Hospital staffing", background: "Hospitals schedule people under coverage and rest rules. A model separates needs from preferences.", numbers: "If one nurse covers 5 patients, then 18 nurses cover $18*5=90$ patients, leaving 10 uncovered for a 100-patient target." },
      { title: "Dataset labeling", background: "ML teams buy labels under time, cost, and quality constraints. A model helps choose labeler types.", numbers: "If expert labels cost $2$ and crowd labels cost $0.30$, then 500 expert and 3000 crowd labels cost $500*2+3000*0.30=1900$." },
      { title: "Routing and logistics", background: "Delivery companies began using OR to reduce fuel and late arrivals. Even simple route choices are constrained decisions.", numbers: "A route of 12 km plus 18 km plus 9 km totals 39 km; at $0.20$ per km, fuel cost is $7.80$." }
    ],
    applicationsClose: "Across factories, clouds, ads, hospitals, labels, and routes, modeling is the art of making choices countable without forgetting the story.",
    takeaways: [
      "An OR model names decisions, constraints, and an objective.",
      "Constraints come from resource accounting, requirements, and physical limits.",
      "Units are a built-in error check for every equation and inequality.",
      "The model is not the answer; it is the precise question an optimizer can answer."
    ]
  },

  "math-23-02": {
    id: "math-23-02",
    title: "Linear programming formulation",
    tagline: "A linear program is an optimization problem whose objective and constraints are all straight-line accounting.",
    connections: {
      buildsOn: ["Modeling in operations research", "linear inequalities", "systems of equations"],
      leadsTo: ["The simplex method", "LP duality", "Sensitivity analysis"],
      usedWith: ["matrices", "convex sets", "linear algebra", "half-spaces"]
    },
    motivation:
      "<p>You have just seen how a story becomes variables and limits. Linear programming asks for a special, powerful kind of story: every cost, profit, and resource changes in a straight-line way.</p>" +
      "<p>That restriction is not small; it is useful. Straight-line constraints create a polygon or polyhedron of feasible choices, and the best linear objective can be found at an edge or corner. This is why large planning problems can be solved reliably.</p>",
    definition:
      "<p>A <b>linear program</b> in standard maximization form is $\\max c^T x$ subject to $Ax\\le b$ and $x\\ge0$. Here $x$ is the vector of decision variables, $c$ contains objective coefficients, $A$ contains resource coefficients, and $b$ contains resource limits.</p>" +
      "<p>Linearity means proportionality and additivity. If one unit of activity $j$ uses $a_{ij}$ units of resource $i$, then $x_j$ units use $a_{ij}x_j$, and all activities together use $a_{i1}x_1+\\cdots+a_{in}x_n$. That sum is one row of $Ax\\le b$.</p>" +
      "<p><b>Assumptions that matter:</b> variables are continuous unless declared integer; coefficients are known and fixed; effects add without discounts, thresholds, or interactions; and every constraint direction must match the story, especially for at-least requirements.</p>",
    worked: {
      problem: "Formulate the bakery problem from lesson 1 as $\\max c^T x$ subject to $Ax\\le b$, using $x=(x_1,x_2)^T$ for loaves and cakes.",
      skills: ["matrix form", "linear objectives", "constraint direction"],
      strategy: "Put objective coefficients in $c$, resource coefficients in rows of $A$, and limits in $b$.",
      steps: [
        { do: "Define the decision vector", result: "$x=(x_1,x_2)^T$", why: "$x_1$ is loaves and $x_2$ is cakes" },
        { do: "Write the objective coefficients", result: "$c=(4,7)^T$", why: "profits are 4 and 7 dollars" },
        { do: "Write the first constraint row", result: "$(2,1)$", why: "flour use is $2x_1+x_2$" },
        { do: "Write the second constraint row", result: "$(1,3)$", why: "time use is $x_1+3x_2$" },
        { do: "Assemble the matrix", result: "$A=((2,1),(1,3))$", why: "each row represents one resource" },
        { do: "Assemble the limits", result: "$b=(40,45)^T$", why: "flour and time limits are 40 and 45" },
        { do: "State the LP", result: "$\\max c^T x$ subject to $Ax\\le b$, $x\\ge0$", why: "this is standard maximization form" }
      ],
      verify: "Multiplying the rows back out gives $2x_1+x_2\\le40$ and $x_1+3x_2\\le45$, exactly the original constraints.",
      answer: "$c=(4,7)^T$, $A=((2,1),(1,3))$, $b=(40,45)^T$, with $x\\ge0$.",
      connects: "LP formulation packages a story into vectors and matrices without changing its meaning."
    },
    practice: [
      { problem: "Write $\\max 5x+8y$ subject to $x+3y\\le60$, $2x+y\\le50$, $x,y\\ge0$ in matrix form.", steps: [
        { do: "Choose the decision vector", result: "$z=(x,y)^T$", why: "collect variables into one vector" },
        { do: "Write objective coefficients", result: "$c=(5,8)^T$", why: "the objective is $5x+8y$" },
        { do: "Write the first row of $A$", result: "$(1,3)$", why: "coefficients in $x+3y\\le60$" },
        { do: "Write the second row of $A$", result: "$(2,1)$", why: "coefficients in $2x+y\\le50$" },
        { do: "Write the limit vector", result: "$b=(60,50)^T$", why: "right-hand sides are 60 and 50" },
        { do: "State matrix form", result: "$\\max c^Tz$ subject to $Az\\le b$, $z\\ge0$", why: "all constraints fit the LP template" }
      ], answer: "$c=(5,8)^T$, $A=((1,3),(2,1))$, $b=(60,50)^T$, $z\\ge0$." },
      { problem: "Convert the at-least constraint $20s+50l\\ge300$ to a $\\le$ row for standard maximization form.", steps: [
        { do: "Start with the requirement", result: "$20s+50l\\ge300$", why: "capacity must be at least 300" },
        { do: "Multiply both sides by $-1$", result: "$-20s-50l\\le-300$", why: "multiplying by a negative reverses the inequality" },
        { do: "Read the coefficient row", result: "$(-20,-50)$", why: "these multiply $s$ and $l$" },
        { do: "Read the new right-hand side", result: "$-300$", why: "the limit changes sign too" },
        { do: "Keep nonnegativity", result: "$s,l\\ge0$", why: "the sign change affects only this constraint" }
      ], answer: "The standard $\\le$ version is $-20s-50l\\le-300$." },
      { problem: "A feasible region has constraints $x+y\\le10$, $x\\le6$, $y\\le8$, $x,y\\ge0$. Test whether $(4,5)$ and $(7,2)$ are feasible.", steps: [
        { do: "Substitute $(4,5)$ into $x+y\\le10$", result: "$9\\le10$", why: "sum the coordinates" },
        { do: "Check the separate bounds for $(4,5)$", result: "$4\\le6$ and $5\\le8$", why: "both variable limits hold" },
        { do: "Classify $(4,5)$", result: "feasible", why: "it satisfies every constraint" },
        { do: "Substitute $(7,2)$ into $x\\le6$", result: "$7\\le6$ is false", why: "the $x$ bound is violated" },
        { do: "Classify $(7,2)$", result: "not feasible", why: "one failed constraint is enough" }
      ], answer: "$(4,5)$ is feasible; $(7,2)$ is not feasible." },
      { problem: "For $\\max 3x+2y$ with $x+y\\le8$, $x\\le5$, $y\\le6$, compare objective values at $(0,0)$, $(5,0)$, $(5,3)$, $(2,6)$, and $(0,6)$.", steps: [
        { do: "Evaluate at $(0,0)$", result: "$3*0+2*0=0$", why: "substitute both coordinates" },
        { do: "Evaluate at $(5,0)$", result: "$3*5+2*0=15$", why: "use the objective" },
        { do: "Evaluate at $(5,3)$", result: "$15+6=21$", why: "the point lies on $x+y=8$" },
        { do: "Evaluate at $(2,6)$", result: "$6+12=18$", why: "another corner on $x+y=8$" },
        { do: "Evaluate at $(0,6)$", result: "$12$", why: "only the $y$ term contributes" },
        { do: "Choose the largest", result: "$21$ at $(5,3)$", why: "maximization picks the biggest feasible value" }
      ], answer: "The best listed corner is $(5,3)$ with objective value $21$." },
      { problem: "A model-training LP chooses hours of data cleaning $u$ and tuning $v$. Each cleaning hour improves score by 0.6 and costs $40$; each tuning hour improves score by 0.4 and costs $30$. Budget is $600$, total hours at most 18. Formulate a maximization LP.", steps: [
        { do: "Define variables", result: "$u=$ cleaning hours, $v=$ tuning hours", why: "these are controllable time choices" },
        { do: "Write improvement objective", result: "$\\max S=0.6u+0.4v$", why: "score gains add linearly" },
        { do: "Write budget use", result: "$40u+30v$", why: "cost per hour times hours" },
        { do: "Limit budget", result: "$40u+30v\\le600$", why: "the budget is 600 dollars" },
        { do: "Write time limit", result: "$u+v\\le18$", why: "total work hours are capped" },
        { do: "Add sign limits", result: "$u,v\\ge0$", why: "negative work hours are not allowed" }
      ], answer: "Maximize $S=0.6u+0.4v$ subject to $40u+30v\\le600$, $u+v\\le18$, $u,v\\ge0$." }
    ],
    applications: [
      { title: "Production blending", background: "Linear programs became a standard tool for blending fuels, foods, and materials because recipes add by weight.", numbers: "If blend A has 8 units protein and blend B has 3, then 4 scoops of A and 5 of B give $4*8+5*3=47$ units." },
      { title: "Portfolio allocation", background: "Basic portfolio models use linear budget and exposure constraints before adding risk terms.", numbers: "Putting $3000$ in asset A and $7000$ in B uses $3000+7000=10000$ dollars of a $10000$ budget." },
      { title: "Ad impressions", background: "Campaign planning often assumes impressions from channels add over short ranges, making LP a useful first model.", numbers: "Channel A gives 2000 impressions per $100$ and B gives 1500; buying 3 and 4 blocks gives $6000+6000=12000$ impressions." },
      { title: "Energy dispatch", background: "Power grids dispatch generators to meet demand while respecting capacities and costs. Linear approximations are common in planning.", numbers: "A 40 MW unit and a 70 MW unit running together supply $110$ MW toward a $100$ MW load, leaving 10 MW reserve." },
      { title: "Data-center scheduling", background: "Batch jobs compete for CPU, memory, and accelerator time. Linear constraints help decide what can run together.", numbers: "Jobs using 12, 20, and 30 GB consume $62$ GB on a $64$ GB machine, leaving $2$ GB." },
      { title: "Fair resource allocation", background: "LPs can encode service guarantees as linear lower bounds while optimizing cost or throughput.", numbers: "If group A must receive at least 35 percent of 200 slots, its constraint is $x_A\\ge70$." }
    ],
    applicationsClose: "A linear program is powerful because it keeps the bookkeeping honest while allowing algorithms to search many feasible choices quickly.",
    takeaways: [
      "LPs optimize a linear objective over linear equality or inequality constraints.",
      "Matrix form $Ax\\le b$ records one constraint per row.",
      "At-least constraints can be converted to $\\le$ form by multiplying by $-1$.",
      "Continuous variables and linear additivity are assumptions, not automatic truths."
    ]
  },

  "math-23-03": {
    id: "math-23-03",
    title: "The simplex method",
    tagline: "Simplex walks from corner to better corner until no neighboring corner can improve the objective.",
    connections: {
      buildsOn: ["Linear programming formulation", "systems of linear equations", "matrices"],
      leadsTo: ["LP duality", "Sensitivity analysis", "Branch and bound"],
      usedWith: ["basic feasible solutions", "Gaussian elimination", "convex polyhedra"]
    },
    motivation:
      "<p>A two-variable LP can be solved by drawing a polygon and checking corners. Real LPs may have thousands of variables, so drawing is gone, but the corner idea survives.</p>" +
      "<p>The <b>simplex method</b> is a disciplined corner-walk. It starts at one feasible corner, asks which variable would improve the objective, moves until a constraint becomes tight, and repeats. The magic is not guessing; it is organized algebra.</p>",
    definition:
      "<p>For a maximization LP with $Ax\\le b$ and $x\\ge0$, add slack variables $s\\ge0$ so $Ax+s=b$. A <b>basic feasible solution</b> sets enough variables to zero to solve the remaining square system. Simplex pivots by bringing an improving nonbasic variable into the basis and sending one limiting basic variable out.</p>" +
      "<p>The entering variable is chosen from a positive reduced profit in the objective row. The leaving variable is chosen by the minimum positive ratio $b_i/a_{ij}$ among rows where the entering column coefficient is positive. That ratio is the farthest we can increase before some basic variable hits zero.</p>" +
      "<p><b>Assumptions that matter:</b> the starting basis must be feasible; the LP must be bounded for simplex to stop with a finite optimum; degeneracy can cause zero-length moves; and pivot rules are used to avoid cycling in rare cases.</p>",
    worked: {
      problem: "Solve $\\max z=3x+2y$ subject to $x+y\\le4$, $x\\le2$, $y\\le3$, $x,y\\ge0$ by checking simplex-style corner moves.",
      skills: ["slack variables", "corner movement", "objective improvement"],
      strategy: "Start at the origin, move along improving edges, and stop when the best adjacent move cannot improve.",
      steps: [
        { do: "Start at the origin", result: "$(x,y)=(0,0)$", why: "all slacks are positive and the point is feasible" },
        { do: "Compute the objective", result: "$z=0$", why: "no production gives no value" },
        { do: "Choose the larger objective coefficient", result: "$x$ enters first", why: "$3>2$, so increasing $x$ improves faster" },
        { do: "Find the $x$ limit", result: "$x\\le2$", why: "$x\\le2$ is tighter than $x\\le4$ from $x+y\\le4$ when $y=0$" },
        { do: "Move to the next corner", result: "$(2,0)$", why: "increase $x$ until a constraint becomes tight" },
        { do: "Increase $y$ from $(2,0)$", result: "$y\\le2$", why: "$x+y\\le4$ gives $y\\le2$, tighter than $y\\le3$" },
        { do: "Move to the next corner", result: "$(2,2)$", why: "this is the adjacent feasible corner" },
        { do: "Evaluate nearby improving candidates", result: "$z(2,2)=10$ and $z(1,3)=9$", why: "the top edge would reduce $x$ and increase $y$" }
      ],
      verify: "Other corners $(0,0)$, $(2,0)$, $(0,3)$, and $(1,3)$ have values $0$, $6$, $6$, and $9$, so $10$ is best.",
      answer: "The optimum is $(x,y)=(2,2)$ with $z=10$.",
      connects: "Simplex is corner checking without drawing every corner in advance."
    },
    practice: [
      { problem: "Add slack variables to $2x+y\\le8$ and $x+3y\\le9$.", steps: [
        { do: "Name the first slack", result: "$s_1\\ge0$", why: "unused resource in the first constraint is nonnegative" },
        { do: "Convert the first inequality", result: "$2x+y+s_1=8$", why: "slack fills the gap to equality" },
        { do: "Name the second slack", result: "$s_2\\ge0$", why: "each constraint gets its own slack" },
        { do: "Convert the second inequality", result: "$x+3y+s_2=9$", why: "the second resource has its own unused amount" },
        { do: "State all sign restrictions", result: "$x,y,s_1,s_2\\ge0$", why: "variables and slacks cannot be negative" }
      ], answer: "$2x+y+s_1=8$, $x+3y+s_2=9$, with all variables nonnegative." },
      { problem: "At the origin for $\\max 4x+5y$ subject to $2x+y\\le8$, $x+2y\\le8$, which variable would the usual largest-coefficient rule enter first?", steps: [
        { do: "Read the objective coefficient of $x$", result: "$4$", why: "this is profit per unit of $x$" },
        { do: "Read the objective coefficient of $y$", result: "$5$", why: "this is profit per unit of $y$" },
        { do: "Compare coefficients", result: "$5>4$", why: "the largest coefficient improves fastest from the origin" },
        { do: "Choose the entering variable", result: "$y$ enters", why: "the pivot rule selects the larger positive coefficient" },
        { do: "Note feasibility still matters", result: "a ratio test is next", why: "entering alone does not decide how far to move" }
      ], answer: "$y$ enters first under the largest-coefficient rule." },
      { problem: "For entering variable $y$ in constraints $2x+y\\le8$ and $x+2y\\le8$ at the origin, perform the ratio test.", steps: [
        { do: "Read the first $y$ coefficient", result: "$1$", why: "the first constraint is $2x+y\\le8$" },
        { do: "Compute the first ratio", result: "$8/1=8$", why: "increase $y$ until the first resource is used" },
        { do: "Read the second $y$ coefficient", result: "$2$", why: "the second constraint is $x+2y\\le8$" },
        { do: "Compute the second ratio", result: "$8/2=4$", why: "increase $y$ until the second resource is used" },
        { do: "Choose the smaller positive ratio", result: "$4$", why: "the first constraint to become tight stops the move" }
      ], answer: "The move stops at $y=4$ because the second constraint is limiting." },
      { problem: "Check the corners of $\\max z=4x+5y$ subject to $2x+y\\le8$, $x+2y\\le8$, $x,y\\ge0$.", steps: [
        { do: "List the axis corners", result: "$(0,0)$, $(4,0)$, $(0,4)$", why: "set one variable to zero and use the tight constraint" },
        { do: "Solve the two tight constraints", result: "$2x+y=8$ and $x+2y=8$", why: "their intersection is another corner" },
        { do: "Add equations", result: "$3x+3y=16$", why: "this gives $x+y=16/3$" },
        { do: "Subtract to solve", result: "$x=y=8/3$", why: "symmetry or elimination gives equal values" },
        { do: "Evaluate objectives", result: "$0,16,20,24$", why: "the intersection gives $4*(8/3)+5*(8/3)=24$" },
        { do: "Choose the best", result: "$(8/3,8/3)$", why: "$24$ is largest" }
      ], answer: "The optimum is $(8/3,8/3)$ with $z=24$." },
      { problem: "A tiny resource-allocation LP for training jobs is $\\max 6g+4c$ subject to $3g+c\\le12$, $g+2c\\le10$, $g,c\\ge0$. Find the best corner.", steps: [
        { do: "List axis corners", result: "$(0,0)$, $(4,0)$, $(0,5)$", why: "use one resource limit at a time on each axis" },
        { do: "Set both resource constraints tight", result: "$3g+c=12$ and $g+2c=10$", why: "the interior corner uses both resources" },
        { do: "Solve the first equation for $c$", result: "$c=12-3g$", why: "substitute into the second equation" },
        { do: "Substitute into the second", result: "$g+2(12-3g)=10$", why: "one variable remains" },
        { do: "Solve for $g$", result: "$g=14/5=2.8$", why: "$24-5g=10$" },
        { do: "Compute $c$", result: "$c=12-3(2.8)=3.6$", why: "use the first equation" },
        { do: "Compare objective values", result: "$0,24,20,31.2$", why: "the intersection gives $6*2.8+4*3.6=31.2$" }
      ], answer: "The best corner is $(g,c)=(2.8,3.6)$ with value $31.2$." }
    ],
    applications: [
      { title: "Refinery planning", background: "Simplex became famous because large industrial LPs could be solved far faster than brute force. Refineries use it for blending and capacity choices.", numbers: "If a pivot raises profit from $12000$ to $12850$, the improvement is $850$, so the move is worthwhile." },
      { title: "Airline scheduling", background: "Airlines solve huge linear relaxations before adding integer restrictions. Simplex-like pivots explore feasible schedule corners.", numbers: "A relaxed schedule assigning 42.5 crew-days and 60.0 aircraft-hours still respects a 65-hour aircraft limit." },
      { title: "Advertising allocation", background: "Budget LPs often have many channel and audience constraints. Simplex moves budget toward better marginal return until a limit binds.", numbers: "Moving $1000$ from a $3$ CPM channel to a $2$ CPM channel buys $1000/2*1000 - 1000/3*1000 = 166667$ more impressions." },
      { title: "Diet and blending problems", background: "Classic diet problems minimized food cost while meeting nutrients. Simplex identifies which nutrient constraints are tight.", numbers: "If protein is exactly 60 g and the requirement is 60 g, its slack is $0$; if fiber is 35 g with requirement 30 g, slack is $5$ g." },
      { title: "ML infrastructure planning", background: "Large training platforms allocate GPUs, CPUs, and memory with linear relaxations. Corners represent saturated resource mixes.", numbers: "If one plan uses all 100 GPU-hours and only 70 of 80 CPU-hours, GPU slack is $0$ and CPU slack is $10$." },
      { title: "Supply chain optimization", background: "Warehouses and factories use LP solvers daily. Simplex remains valuable because many real LPs are sparse and warm-started.", numbers: "If today changes one demand from 500 to 520 units, a warm start may pivot from yesterday's basis instead of solving from scratch." }
    ],
    applicationsClose: "Simplex teaches a durable geometric lesson: in a linear world, optimality hides at corners, and algebra can walk there.",
    takeaways: [
      "Adding slack variables turns $\\le$ constraints into equalities.",
      "A basic feasible solution is an algebraic version of a feasible corner.",
      "The entering variable improves the objective; the leaving variable is chosen by the ratio test.",
      "Simplex stops when no adjacent pivot can improve the objective."
    ]
  },

  "math-23-04": {
    id: "math-23-04",
    title: "LP duality",
    tagline: "Every linear program has a shadow problem that prices the constraints and explains the optimum.",
    connections: {
      buildsOn: ["Linear programming formulation", "The simplex method", "systems of inequalities"],
      leadsTo: ["Sensitivity analysis", "Integer programming", "KKT conditions"],
      usedWith: ["linear algebra", "convexity", "Lagrange multipliers", "complementary slackness"]
    },
    motivation:
      "<p>A primal LP asks, how much value can I create with these resources? The dual asks, what prices on the resources would make that created value impossible to exceed?</p>" +
      "<p>This is a beautiful shift. Instead of building the best plan directly, the dual builds the tightest upper bound on any plan. When the best plan and the best bound meet, you know you are done.</p>",
    definition:
      "<p>For the primal $\\max c^T x$ subject to $Ax\\le b$, $x\\ge0$, the dual is $\\min b^T y$ subject to $A^T y\\ge c$, $y\\ge0$. The dual variables $y$ are shadow prices for the primal constraints.</p>" +
      "<p>Weak duality follows by multiplying inequalities. If $Ax\\le b$ and $y\\ge0$, then $y^T Ax\\le y^T b$. If $A^T y\\ge c$ and $x\\ge0$, then $x^T A^T y\\ge c^T x$. Since $y^T Ax=x^T A^T y$, every dual feasible value bounds every primal feasible value.</p>" +
      "<p><b>Assumptions that matter:</b> primal and dual forms depend on max versus min and inequality directions; shadow prices are meaningful near the current optimum; and strong duality requires the LP to be feasible with a finite optimum.</p>",
    worked: {
      problem: "Write the dual of $\\max 4x+7y$ subject to $2x+y\\le40$, $x+3y\\le45$, $x,y\\ge0$.",
      skills: ["primal-dual conversion", "shadow prices", "matrix transpose"],
      strategy: "Give one dual variable to each primal constraint, then transpose the coefficient matrix.",
      steps: [
        { do: "Name dual variables", result: "$u\\ge0$ for flour and $v\\ge0$ for time", why: "each primal resource constraint gets a price" },
        { do: "Write the dual objective", result: "$\\min 40u+45v$", why: "resource limits are priced by dual variables" },
        { do: "Read coefficients for loaves", result: "$2$ flour and $1$ time", why: "loaves use the first column of $A$" },
        { do: "Write the loaf dual constraint", result: "$2u+v\\ge4$", why: "resource value must cover loaf profit" },
        { do: "Read coefficients for cakes", result: "$1$ flour and $3$ time", why: "cakes use the second column of $A$" },
        { do: "Write the cake dual constraint", result: "$u+3v\\ge7$", why: "resource value must cover cake profit" }
      ],
      verify: "There are two primal constraints, so two dual variables; there are two primal variables, so two dual constraints.",
      answer: "Minimize $40u+45v$ subject to $2u+v\\ge4$, $u+3v\\ge7$, $u,v\\ge0$.",
      connects: "Duality turns resource limits into prices and product profits into price-coverage constraints."
    },
    practice: [
      { problem: "Write the dual of $\\max 5x+8y$ subject to $x+3y\\le60$, $2x+y\\le50$, $x,y\\ge0$.", steps: [
        { do: "Name dual variables", result: "$a,b\\ge0$", why: "there are two primal constraints" },
        { do: "Write the dual objective", result: "$\\min 60a+50b$", why: "right-hand sides become objective coefficients" },
        { do: "Use the $x$ column", result: "$a+2b$", why: "$x$ has coefficients 1 and 2" },
        { do: "Constrain the $x$ column", result: "$a+2b\\ge5$", why: "it must cover $x$ profit" },
        { do: "Use the $y$ column", result: "$3a+b$", why: "$y$ has coefficients 3 and 1" },
        { do: "Constrain the $y$ column", result: "$3a+b\\ge8$", why: "it must cover $y$ profit" }
      ], answer: "Minimize $60a+50b$ subject to $a+2b\\ge5$, $3a+b\\ge8$, $a,b\\ge0$." },
      { problem: "Show weak duality numerically: primal feasible $x=10,y=5$ for the bakery LP has profit $75$. Dual feasible $u=1,v=2.5$ has value $152.5$. Check the bound.", steps: [
        { do: "Compute primal profit", result: "$4*10+7*5=75$", why: "use the primal objective" },
        { do: "Check flour", result: "$2*10+5=25\\le40$", why: "the primal point is feasible for flour" },
        { do: "Check time", result: "$10+3*5=25\\le45$", why: "the primal point is feasible for time" },
        { do: "Check dual loaf constraint", result: "$2*1+2.5=4.5\\ge4$", why: "loaf profit is covered" },
        { do: "Check dual cake constraint", result: "$1+3*2.5=8.5\\ge7$", why: "cake profit is covered" },
        { do: "Compare values", result: "$75\\le152.5$", why: "any dual feasible value upper-bounds any primal feasible value" }
      ], answer: "The primal value $75$ is below the dual value $152.5$, as weak duality predicts." },
      { problem: "For the bakery primal optimum $(15,10)$, solve complementary tight constraints $2u+v=4$ and $u+3v=7$ for shadow prices.", steps: [
        { do: "Write the tight dual equations", result: "$2u+v=4$ and $u+3v=7$", why: "positive primal variables make corresponding dual constraints tight" },
        { do: "Solve the first equation for $v$", result: "$v=4-2u$", why: "substitution is direct" },
        { do: "Substitute into the second", result: "$u+3(4-2u)=7$", why: "replace $v$" },
        { do: "Simplify", result: "$12-5u=7$", why: "combine like terms" },
        { do: "Solve for $u$", result: "$u=1$", why: "$5u=5$" },
        { do: "Compute $v$", result: "$v=2$", why: "$4-2*1=2$" }
      ], answer: "The shadow prices are $u=1$ for flour and $v=2$ for time." },
      { problem: "Use shadow prices $u=1,v=2$ to value the bakery resources and compare to primal profit at $(15,10)$.", steps: [
        { do: "Compute dual resource value", result: "$40*1+45*2=130$", why: "price each available resource" },
        { do: "Compute primal profit", result: "$4*15+7*10=130$", why: "profit from loaves and cakes" },
        { do: "Compare values", result: "$130=130$", why: "matching values certify optimality" },
        { do: "Check flour usage", result: "$2*15+10=40$", why: "flour is fully used" },
        { do: "Check time usage", result: "$15+3*10=45$", why: "time is fully used" }
      ], answer: "Both primal and dual values are $130$, certifying optimality." },
      { problem: "An ML serving LP has CPU limit and memory limit. A request type uses 2 CPU and 1 memory for value 6; another uses 1 CPU and 4 memory for value 8. Write the dual pricing constraints.", steps: [
        { do: "Name shadow prices", result: "$p\\ge0$ for CPU and $q\\ge0$ for memory", why: "each resource gets a price" },
        { do: "Price type 1 usage", result: "$2p+q$", why: "type 1 uses 2 CPU and 1 memory" },
        { do: "Cover type 1 value", result: "$2p+q\\ge6$", why: "resource price must cover value 6" },
        { do: "Price type 2 usage", result: "$p+4q$", why: "type 2 uses 1 CPU and 4 memory" },
        { do: "Cover type 2 value", result: "$p+4q\\ge8$", why: "resource price must cover value 8" },
        { do: "State nonnegativity", result: "$p,q\\ge0$", why: "resource prices are nonnegative in this form" }
      ], answer: "The dual constraints are $2p+q\\ge6$, $p+4q\\ge8$, $p,q\\ge0$." }
    ],
    applications: [
      { title: "Shadow prices in manufacturing", background: "Managers use dual variables to ask how much one extra unit of a scarce resource is worth near the optimum.", numbers: "If labor's shadow price is $12$ per hour, 5 extra hours are worth about $5*12=60$ dollars while the basis stays valid." },
      { title: "Network flow cuts", background: "Max-flow min-cut is a famous duality story: sending flow and blocking flow meet at the same value.", numbers: "If a cut has capacities 4, 7, and 3, its capacity is $14$, so no flow can exceed $14$ through that cut." },
      { title: "Support vector machines", background: "SVM training is often solved through a dual problem where data points receive weights. The dual exposes support vectors.", numbers: "If only three points have nonzero weights $0.2$, $0.5$, and $0.3$, their total dual weight is $1.0$." },
      { title: "Economic interpretation", background: "Duality connects optimization with prices. A feasible price system proves no production plan can beat its resource valuation.", numbers: "If a product uses 2 units of resource priced $3$ and 1 unit priced $4$, its priced input cost is $10$; profit above $10$ would violate dual feasibility." },
      { title: "Certificate of optimality", background: "Solvers often return both primal and dual solutions because matching values are a compact proof.", numbers: "A primal value $245.00$ and dual value $245.01$ have a gap of $0.01$, about $0.004\\%$ of $245$." },
      { title: "Regularization and Lagrange multipliers", background: "Many ML constraints are handled by multiplier ideas related to duality. A penalty price says how expensive a violation is.", numbers: "If a constraint violation is $0.03$ and multiplier is $50$, the penalty contribution is $1.5$." }
    ],
    applicationsClose: "Duality is the same optimum viewed as action and as explanation: one plan uses resources, the other prices them.",
    takeaways: [
      "The dual of $\\max c^Tx$ with $Ax\\le b$ is $\\min b^Ty$ with $A^Ty\\ge c$.",
      "Weak duality says every dual feasible value bounds every primal feasible value.",
      "Matching primal and dual feasible values certify optimality.",
      "Dual variables are shadow prices for scarce constraints."
    ]
  },

  "math-23-05": {
    id: "math-23-05",
    title: "Sensitivity analysis",
    tagline: "Sensitivity analysis asks how much the answer changes when the numbers behind the model move.",
    connections: {
      buildsOn: ["LP duality", "The simplex method", "Linear programming formulation"],
      leadsTo: ["Integer programming", "robust optimization", "stochastic optimization"],
      usedWith: ["shadow prices", "piecewise linear functions", "perturbation analysis"]
    },
    motivation:
      "<p>An optimizer gives a crisp answer, but real inputs are rarely crisp. Demand estimates move, costs change, and a resource that was 40 units yesterday may be 43 units tomorrow.</p>" +
      "<p><b>Sensitivity analysis</b> keeps the model honest after the first solve. It tells you which numbers matter, which constraints are scarce, and when a small change is safe enough to update without rebuilding the whole decision.</p>",
    definition:
      "<p>In linear programming, sensitivity analysis studies how the optimal solution and optimal value respond to changes in objective coefficients $c$, right-hand sides $b$, or constraint coefficients $A$. A shadow price gives the rate of change of the optimal value with respect to a right-hand side while the current basis remains optimal.</p>" +
      "<p>If the shadow price of flour is $1$, then increasing the flour limit from 40 to 41 raises the objective by about $1$, provided the same constraints remain active. This is a local, basis-dependent statement, not a promise for every possible change.</p>" +
      "<p><b>Assumptions that matter:</b> reported allowable ranges come from the current optimal basis; shadow prices apply only inside those ranges; degeneracy can make rates less intuitive; and changing several coefficients at once can leave the simple one-at-a-time report.</p>",
    worked: {
      problem: "The bakery optimum has value $130$ and shadow prices $u=1$ for flour and $v=2$ for time. Estimate the value if flour increases from 40 to 43 kg and time decreases from 45 to 44 hours, assuming the basis remains valid.",
      skills: ["shadow prices", "right-hand-side changes", "local estimates"],
      strategy: "Multiply each resource change by its shadow price and add the effects to the old optimum.",
      steps: [
        { do: "Compute the flour change", result: "$43-40=3$", why: "flour increases by 3 kg" },
        { do: "Value the flour change", result: "$1*3=3$", why: "flour's shadow price is 1" },
        { do: "Compute the time change", result: "$44-45=-1$", why: "time decreases by 1 hour" },
        { do: "Value the time change", result: "$2*(-1)=-2$", why: "time's shadow price is 2" },
        { do: "Add the net change", result: "$3+(-2)=1$", why: "resource effects add locally" },
        { do: "Update the objective", result: "$130+1=131$", why: "start from the old optimal value" }
      ],
      verify: "The estimate is local: it assumes the same active constraints and product mix logic still apply after the small changes.",
      answer: "Estimated new value is $131$ while the current basis remains valid.",
      connects: "Sensitivity analysis turns dual prices into practical what-if arithmetic."
    },
    practice: [
      { problem: "A resource has shadow price $5$ and its limit increases by 4 units. Estimate the objective change.", steps: [
        { do: "Identify the shadow price", result: "$5$ per unit", why: "this is the local value of one extra unit" },
        { do: "Identify the resource change", result: "$+4$ units", why: "the limit increases" },
        { do: "Multiply price by change", result: "$5*4=20$", why: "linear local approximation" },
        { do: "Set the sign", result: "+$20$", why: "more of a valuable resource helps a maximization problem" },
        { do: "State the condition", result: "basis unchanged", why: "shadow prices are local" }
      ], answer: "The objective is estimated to increase by $20$, assuming the basis remains valid." },
      { problem: "An optimal value is $500$. Shadow prices for two resources are $3$ and $-1$ in a converted model. The right-hand sides change by $+10$ and $+6$. Estimate the new value.", steps: [
        { do: "Value the first change", result: "$3*10=30$", why: "first shadow price times first change" },
        { do: "Value the second change", result: "$-1*6=-6$", why: "second shadow price times second change" },
        { do: "Add changes", result: "$30-6=24$", why: "total first-order effect" },
        { do: "Update the old value", result: "$500+24=524$", why: "add the estimated improvement" },
        { do: "Attach the caveat", result: "valid locally", why: "basis changes can alter shadow prices" }
      ], answer: "Estimated new value is $524$ within the valid sensitivity range." },
      { problem: "A constraint has slack 12 at the optimum. What is its shadow price in a nondegenerate max problem, and what does that mean for 5 extra units?", steps: [
        { do: "Read the slack", result: "$12>0$", why: "the resource is not fully used" },
        { do: "Apply complementary slackness", result: "shadow price $0$", why: "a nonbinding constraint has no marginal value" },
        { do: "Compute value of 5 extra units", result: "$0*5=0$", why: "extra unused resource does not help" },
        { do: "Interpret", result: "no objective change expected", why: "another constraint is limiting the solution" },
        { do: "State the assumption", result: "nondegenerate current optimum", why: "degenerate cases can be subtle" }
      ], answer: "The shadow price is $0$; 5 extra units are estimated to add $0$ value." },
      { problem: "A profit coefficient for product A can vary from $3.50$ to $5.20$ without changing the basis. Current profit is $4.00$. Does changing it to $4.80$ keep the same basis? What about $5.50$?", steps: [
        { do: "Read the allowable interval", result: "$[3.50,5.20]$", why: "inside this range the basis is unchanged" },
        { do: "Test $4.80$", result: "$3.50\\le4.80\\le5.20$", why: "it lies inside the interval" },
        { do: "Classify $4.80$", result: "same basis", why: "it is within the allowable range" },
        { do: "Test $5.50$", result: "$5.50>5.20$", why: "it lies above the interval" },
        { do: "Classify $5.50$", result: "basis may change", why: "the sensitivity guarantee no longer applies" }
      ], answer: "$4.80$ keeps the same basis; $5.50$ may change the optimal basis." },
      { problem: "An ML inference planner has optimal value $900$ requests/sec. GPU shadow price is $18$ per GPU-hour and memory shadow price is $0$. Estimate the value after adding 3 GPU-hours and 20 GB memory within range.", steps: [
        { do: "Value GPU increase", result: "$18*3=54$", why: "GPU is scarce and valuable" },
        { do: "Value memory increase", result: "$0*20=0$", why: "memory is not currently binding" },
        { do: "Add total change", result: "$54+0=54$", why: "local effects add" },
        { do: "Update throughput", result: "$900+54=954$", why: "add estimated gain" },
        { do: "State the limitation", result: "within sensitivity range", why: "new bottlenecks can appear after larger changes" }
      ], answer: "Estimated throughput is $954$ requests/sec if the same basis remains optimal." }
    ],
    applications: [
      { title: "Capacity expansion", background: "Managers rarely ask only for today's optimum; they ask whether buying more capacity is worth it. Shadow prices answer the first marginal question.", numbers: "If a machine-hour shadow price is $25$ and rental cost is $18$ per hour, the first extra hour has net value $7$." },
      { title: "Budget planning", background: "Ad and cloud budgets change frequently. Sensitivity reports show whether more budget helps or another constraint is already binding.", numbers: "A budget shadow price of $0.12$ means $1000$ more budget predicts $120$ more objective units." },
      { title: "Robust reporting", background: "Operations teams use allowable ranges to avoid overreacting to tiny estimate changes.", numbers: "If demand can move from 950 to 1040 without changing the plan, a new forecast of 1010 does not require a new schedule." },
      { title: "Supply shortage response", background: "When a resource shrinks, shadow prices estimate the damage and help prioritize substitutions.", numbers: "Losing 6 units of a resource priced $9$ lowers value by about $54$ while the basis is valid." },
      { title: "ML cluster bottlenecks", background: "Training platforms need to know whether GPUs, network, or storage is limiting throughput. Sensitivity turns utilization into marginal value.", numbers: "If storage shadow price is $0$ but GPU shadow price is $30$, adding 2 GPUs predicts $60$ more value while adding storage predicts none." },
      { title: "Service-level agreements", background: "Customer support and reliability teams test what happens when required coverage increases. Sensitivity helps price stricter promises.", numbers: "If raising minimum coverage by 1 percent costs $400$, then moving from 95 percent to 98 percent estimates $1200$ added cost locally." }
    ],
    applicationsClose: "Sensitivity analysis keeps optimization connected to reality: answers are useful, but knowing how fragile they are is wiser.",
    takeaways: [
      "A shadow price is the local rate of change of the optimal value with respect to a right-hand side.",
      "Positive slack usually means zero shadow price for a nonbinding constraint.",
      "Allowable ranges say when the current basis remains valid.",
      "Large or simultaneous changes can require resolving the model."
    ]
  },

  "math-23-06": {
    id: "math-23-06",
    title: "Integer programming",
    tagline: "Integer programming keeps decisions whole when half a truck, half a server, or half a yes/no choice makes no sense.",
    connections: {
      buildsOn: ["Linear programming formulation", "Sensitivity analysis", "systems of inequalities"],
      leadsTo: ["Branch and bound", "The assignment problem", "mixed-integer optimization"],
      usedWith: ["linear programming relaxations", "combinatorics", "binary variables", "graph theory"]
    },
    motivation:
      "<p>Linear programming lets variables be fractional, which is perfect for flows, blends, and budgets. But many choices are indivisible. You open a warehouse or you do not. You assign a worker to a job or you do not.</p>" +
      "<p><b>Integer programming</b> adds the simple-looking requirement that some variables must be whole numbers. That tiny sentence changes the problem deeply: geometry still helps, but the best fractional corner may no longer be allowed.</p>",
    definition:
      "<p>An <b>integer program</b> is an optimization problem with a linear objective and linear constraints, plus restrictions such as $x_j\\in\\{0,1\\}$ or $x_j$ integer. A mixed-integer linear program has some integer variables and some continuous variables.</p>" +
      "<p>The LP relaxation removes integrality and allows fractional values. For a maximization problem, the relaxation gives an upper bound because it optimizes over a larger feasible set. For a minimization problem, it gives a lower bound. The integer optimum must be searched among feasible whole-number points.</p>" +
      "<p><b>Assumptions that matter:</b> integer variables should represent truly indivisible decisions; binary variables encode yes/no choices; big-M constraints must use valid, not absurdly huge, constants; and integer programs can be much harder than their LP relaxations.</p>",
    worked: {
      problem: "A project can choose feature A and feature B. A gives value 9 and costs 6 days; B gives value 7 and costs 5 days. There are 8 days. Formulate and solve the binary integer program.",
      skills: ["binary variables", "budget constraints", "enumeration"],
      strategy: "Use one yes/no variable per feature, then enumerate the four possible binary choices.",
      steps: [
        { do: "Define the first binary variable", result: "$a\\in\\{0,1\\}$", why: "$a=1$ means choose feature A" },
        { do: "Define the second binary variable", result: "$b\\in\\{0,1\\}$", why: "$b=1$ means choose feature B" },
        { do: "Write the objective", result: "$\\max 9a+7b$", why: "chosen feature values add" },
        { do: "Write the time constraint", result: "$6a+5b\\le8$", why: "the team has 8 days" },
        { do: "Evaluate choice $(0,0)$", result: "value $0$, time $0$", why: "choose neither feature" },
        { do: "Evaluate choice $(1,0)$", result: "value $9$, time $6$", why: "feature A alone is feasible" },
        { do: "Evaluate choice $(0,1)$", result: "value $7$, time $5$", why: "feature B alone is feasible" },
        { do: "Evaluate choice $(1,1)$", result: "time $11$", why: "$6+5>8$, so both are infeasible" }
      ],
      verify: "The LP relaxation could choose fractions, but the real feature decision must be whole yes or no.",
      answer: "Choose feature A only: $(a,b)=(1,0)$ with value $9$.",
      connects: "Integer programming is linear modeling with whole-choice discipline."
    },
    practice: [
      { problem: "A team can buy servers of type A and B. A costs $4$ and gives 7 capacity; B costs $5$ and gives 9 capacity. Budget is $10$. Let $a,b$ be nonnegative integers. Maximize capacity.", steps: [
        { do: "Write the objective", result: "$\\max 7a+9b$", why: "capacity adds by server type" },
        { do: "Write the budget", result: "$4a+5b\\le10$", why: "server costs must fit the budget" },
        { do: "List feasible $b=0$ choices", result: "$a=0,1,2$", why: "three A servers would cost 12" },
        { do: "List feasible $b=1$ choices", result: "$a=0,1$", why: "$5+4a\\le10$" },
        { do: "List feasible $b=2$ choice", result: "$a=0$", why: "two B servers use the whole budget" },
        { do: "Compare best values", result: "$14$ for $(2,0)$, $16$ for $(1,1)$, $18$ for $(0,2)$", why: "compute capacity for candidates" }
      ], answer: "Buy two B servers: $(a,b)=(0,2)$ with capacity $18$." },
      { problem: "A binary variable $y$ should force $x=0$ when $y=0$ and allow $x\\le12$ when $y=1$. Write a big-M linking constraint.", steps: [
        { do: "Identify the on/off variable", result: "$y\\in\\{0,1\\}$", why: "binary variables encode yes/no choices" },
        { do: "Identify the maximum allowed $x$", result: "$12$", why: "this is the smallest valid big-M" },
        { do: "Write the linking constraint", result: "$x\\le12y$", why: "the upper bound depends on whether $y$ is on" },
        { do: "Test $y=0$", result: "$x\\le0$", why: "with $x\\ge0$, this forces $x=0$" },
        { do: "Test $y=1$", result: "$x\\le12$", why: "the normal upper bound is restored" }
      ], answer: "Use $x\\le12y$ with $x\\ge0$ and $y\\in\\{0,1\\}$." },
      { problem: "The LP relaxation of a maximization integer program has value $42.6$. A feasible integer solution has value $39$. What bound and gap do these give?", steps: [
        { do: "Classify the relaxation value", result: "upper bound $42.6$", why: "maximization over a larger feasible set can only improve" },
        { do: "Classify the integer value", result: "incumbent $39$", why: "it is a feasible whole-number solution" },
        { do: "Compute absolute gap", result: "$42.6-39=3.6$", why: "bound minus incumbent" },
        { do: "Compute relative gap", result: "$3.6/39\\approx0.0923$", why: "divide by incumbent value" },
        { do: "Convert to percent", result: "$9.23\\%$", why: "multiply by 100 percent" }
      ], answer: "Upper bound $42.6$, incumbent $39$, absolute gap $3.6$, relative gap about $9.23\\%$." },
      { problem: "Choose projects A, B, C with values $10,8,6$ and costs $7,5,4$ under budget $12$. Binary variables are required. Find the best feasible set by enumeration.", steps: [
        { do: "Check single projects", result: "A value 10, B value 8, C value 6", why: "all single choices fit budget" },
        { do: "Check A plus B", result: "cost $12$, value $18$", why: "$7+5=12$" },
        { do: "Check A plus C", result: "cost $11$, value $16$", why: "$7+4=11$" },
        { do: "Check B plus C", result: "cost $9$, value $14$", why: "$5+4=9$" },
        { do: "Check all three", result: "cost $16$", why: "over the budget" },
        { do: "Choose the largest feasible value", result: "A and B", why: "$18$ is best among feasible sets" }
      ], answer: "Choose projects A and B, with value $18$ and cost $12$." },
      { problem: "A model deployment can pick CPU optimization $c$, quantization $q$, and caching $h$. Values are $5,6,4$ and engineering days are $3,4,2$. With 6 days and binary choices, find the best set.", steps: [
        { do: "Check $c+q$", result: "days $7$", why: "$3+4>6$, so infeasible" },
        { do: "Check $c+h$", result: "days $5$, value $9$", why: "both fit the day budget" },
        { do: "Check $q+h$", result: "days $6$, value $10$", why: "exactly uses the budget" },
        { do: "Check all three", result: "days $9$", why: "over the budget" },
        { do: "Check singles", result: "best single value $6$", why: "quantization alone is strongest single" },
        { do: "Choose best feasible set", result: "$q+h$", why: "value $10$ beats $9$ and $6$" }
      ], answer: "Choose quantization and caching, with value $10$ in 6 engineering days." }
    ],
    applications: [
      { title: "Facility location", background: "Companies choose which warehouses or data centers to open. Each site is a yes/no decision with fixed costs.", numbers: "Opening sites costing 4M, 6M, and 5M under a 10M budget allows pairs $(4,6)$ and $(4,5)$ but not $(6,5)$." },
      { title: "Feature selection", background: "ML pipelines sometimes choose a subset of features under latency or privacy limits. Binary variables encode inclusion.", numbers: "Features with latencies 2, 3, and 5 ms under a 6 ms limit allow the first two together at $5$ ms, but all three require $10$ ms." },
      { title: "Crew scheduling", background: "Airlines and hospitals assign whole people to shifts. Fractional workers are not usable in the final schedule.", numbers: "A 7-person requirement cannot be met by 6.4 people; the integer schedule needs at least 7." },
      { title: "Knapsack planning", background: "The knapsack problem is a classic integer program: choose items with values and weights under capacity.", numbers: "Items worth 9 and 7 with weights 6 and 5 cannot both fit in capacity 8, so value 9 is better than 7." },
      { title: "A/B test portfolio", background: "Experiment platforms must choose whole experiments to run under traffic and analyst constraints.", numbers: "If tests use 20 percent, 30 percent, and 60 percent traffic, the first two fit exactly at 50 percent but the third cannot join them under a 100 percent cap with holdout." },
      { title: "Compiler and serving optimizations", background: "Deployment choices such as caching, batching, and quantization are often discrete switches.", numbers: "If caching saves 12 ms and quantization saves 18 ms, turning both on saves $30$ ms, provided their combined memory cost fits." }
    ],
    applicationsClose: "Integer programming is where linear modeling meets indivisible reality: decisions become cleaner, and the search becomes harder.",
    takeaways: [
      "Integer programs add whole-number or binary restrictions to linear models.",
      "The LP relaxation gives a bound because it allows more solutions than the integer problem.",
      "Binary variables model yes/no decisions and can link to continuous variables.",
      "Small integer programs can be enumerated; large ones need smarter search."
    ]
  },

  "math-23-07": {
    id: "math-23-07",
    title: "Branch and bound",
    tagline: "Branch and bound solves integer programs by splitting possibilities and pruning any branch that cannot beat what we already have.",
    connections: {
      buildsOn: ["Integer programming", "The simplex method", "LP duality"],
      leadsTo: ["The assignment problem", "cutting planes", "mixed-integer optimization"],
      usedWith: ["search trees", "bounds", "relaxations", "combinatorics"]
    },
    motivation:
      "<p>Integer programs are hard because the LP answer may say $x=2.6$ when the real choice must be $2$ or $3$. Rounding can break constraints or miss the best answer.</p>" +
      "<p><b>Branch and bound</b> is patient and clever. It solves an easier relaxation, branches on a fractional variable, and uses bounds to discard whole regions that cannot improve the best integer solution found so far.</p>",
    definition:
      "<p>Branch and bound keeps a search tree of subproblems. At each node, it solves a relaxation. For maximization, the relaxation value is an upper bound on any integer solution in that node. If the bound is no better than the incumbent integer value, the node is pruned.</p>" +
      "<p>If a relaxation gives $x_1=2.4$, branching creates two child nodes: $x_1\\le2$ and $x_1\\ge3$. Together they cover every integer possibility and exclude the fractional value. The process continues until all nodes are solved, infeasible, integer, or pruned by bound.</p>" +
      "<p><b>Assumptions that matter:</b> relaxations must give valid bounds; branching must preserve all integer possibilities; incumbents must be feasible integer solutions; and performance depends heavily on formulation strength and branching choices.</p>",
    worked: {
      problem: "A maximization integer program has current incumbent value $30$. Three open nodes have LP relaxation bounds $42$, $29$, and $35$. The node with bound $42$ solves to fractional $x=3.6$. What happens next?",
      skills: ["bounds", "pruning", "branching"],
      strategy: "For maximization, compare each upper bound to the incumbent, then branch on the fractional variable when the bound is promising.",
      steps: [
        { do: "Inspect node bound $29$", result: "$29<30$", why: "it cannot beat the incumbent" },
        { do: "Prune node $29$", result: "discarded", why: "no integer solution inside can exceed its upper bound" },
        { do: "Inspect node bound $35$", result: "$35>30$", why: "it might contain a better integer solution" },
        { do: "Keep node $35$", result: "open", why: "its bound is promising" },
        { do: "Inspect node bound $42$", result: "$42>30$", why: "it is the most promising node" },
        { do: "Branch on $x=3.6$", result: "$x\\le3$ and $x\\ge4$", why: "integer $x$ cannot be between 3 and 4" }
      ],
      verify: "The two branches cover every integer value of $x$ while removing the fractional relaxation value $3.6$.",
      answer: "Prune the $29$ node, keep the $35$ node, and split the $42$ node into $x\\le3$ and $x\\ge4$.",
      connects: "Branch and bound is organized search powered by valid bounds."
    },
    practice: [
      { problem: "A max problem has incumbent $18$. Node bounds are $21$, $17.5$, $18$, and $24$. Which nodes can be pruned by bound?", steps: [
        { do: "Compare $21$ to incumbent", result: "$21>18$", why: "this node might improve" },
        { do: "Compare $17.5$ to incumbent", result: "$17.5<18$", why: "this node cannot improve" },
        { do: "Compare $18$ to incumbent", result: "$18=18$", why: "it cannot beat the incumbent" },
        { do: "Compare $24$ to incumbent", result: "$24>18$", why: "this node might improve" },
        { do: "List pruned nodes", result: "$17.5$ and $18$", why: "their upper bounds are no better than the incumbent" }
      ], answer: "Prune nodes with bounds $17.5$ and $18$; keep nodes with bounds $21$ and $24$." },
      { problem: "A relaxation solution has integer variables $x=5$, $y=2.7$, $z=0.4$. Give valid branches for $y$ and $z$.", steps: [
        { do: "Check $x$", result: "$x=5$ is integer", why: "no branch needed" },
        { do: "Floor and ceiling $y$", result: "$\\lfloor2.7\\rfloor=2$, $\\lceil2.7\\rceil=3$", why: "integer values split around 2.7" },
        { do: "Write branches for $y$", result: "$y\\le2$ and $y\\ge3$", why: "these cover all integer $y$ values" },
        { do: "Floor and ceiling $z$", result: "$\\lfloor0.4\\rfloor=0$, $\\lceil0.4\\rceil=1$", why: "binary-like fractional value splits at 0 and 1" },
        { do: "Write branches for $z$", result: "$z\\le0$ and $z\\ge1$", why: "these exclude $0.4$ and preserve integer choices" }
      ], answer: "Branch on $y$ with $y\\le2$ or $y\\ge3$, or on $z$ with $z\\le0$ or $z\\ge1$." },
      { problem: "For a minimization integer program, the incumbent cost is $50$. Node relaxation lower bounds are $45$, $52$, and $49$. Which nodes are pruned?", steps: [
        { do: "Recall minimization rule", result: "relaxation is a lower bound", why: "integer restrictions can only raise cost" },
        { do: "Compare $45$", result: "$45<50$", why: "this node could contain a cost below 50" },
        { do: "Compare $52$", result: "$52>50$", why: "all solutions in the node cost at least 52" },
        { do: "Compare $49$", result: "$49<50$", why: "this node might improve" },
        { do: "Choose pruned node", result: "$52$", why: "its lower bound is already worse than the incumbent" }
      ], answer: "Prune only the node with lower bound $52$." },
      { problem: "A max node relaxation gives value $38.4$ with all integer variables integral, and the incumbent is $35$. What should the algorithm do?", steps: [
        { do: "Check integrality", result: "all integer variables are integral", why: "the relaxation solution is a feasible integer solution" },
        { do: "Compare value to incumbent", result: "$38.4>35$", why: "it improves the best known solution" },
        { do: "Update incumbent", result: "$38.4$", why: "best feasible integer value increases" },
        { do: "Close the node", result: "fathomed", why: "there is no fractional variable to branch on" },
        { do: "Use new incumbent", result: "prune future bounds $\\le38.4$", why: "a stronger incumbent improves pruning" }
      ], answer: "Update the incumbent to $38.4$ and close that node." },
      { problem: "An ML feature-selection search has incumbent validation gain $12$. A node's relaxation bound is $15$ and solution chooses feature count $k=4.3$. What branch and pruning logic apply?", steps: [
        { do: "Compare bound to incumbent", result: "$15>12$", why: "the node may improve the best feature set" },
        { do: "Identify fractional integer variable", result: "$k=4.3$", why: "feature count must be whole" },
        { do: "Compute floor and ceiling", result: "$4$ and $5$", why: "nearest integer sides split the search" },
        { do: "Create branches", result: "$k\\le4$ and $k\\ge5$", why: "all integer counts fall into one branch" },
        { do: "State future pruning rule", result: "prune any max node with bound $\\le12$", why: "such a node cannot beat the incumbent" }
      ], answer: "Branch into $k\\le4$ and $k\\ge5$; prune later nodes whose upper bounds are at most $12$." }
    ],
    applications: [
      { title: "Mixed-integer solvers", background: "Commercial and open-source solvers use branch and bound with many enhancements. It is the backbone of practical discrete optimization.", numbers: "If a solver closes 980 nodes and leaves 20 open, it has processed $980/(980+20)=98\\%$ of the explored tree count." },
      { title: "Feature subset selection", background: "Selecting features under a cardinality cap is combinatorial. Relaxation bounds help avoid checking every subset.", numbers: "With 30 features, brute force has $2^{30}=1,073,741,824$ subsets; pruning even 99.9 percent still matters." },
      { title: "Scheduling jobs", background: "Machine schedules use integer start orders and assignment decisions. Branching splits alternative orders.", numbers: "Three jobs have $3!=6$ possible orders; ten jobs have $10!=3,628,800$ orders." },
      { title: "Warehouse location", background: "Opening facilities is binary. Bounds prove that some combinations cannot beat the current network design.", numbers: "If incumbent cost is $1.2M$ and a node's lower bound is $1.25M$, that entire branch can be discarded in minimization." },
      { title: "Neural architecture search", background: "Some architecture choices are discrete: layer count, operator type, or quantization mode. Branch-and-bound ideas can control search.", numbers: "Choosing among 4 operators in 6 layers gives $4^6=4096$ architectures before pruning." },
      { title: "Routing with integer decisions", background: "Vehicle routing decides whether an arc is used. Branching on an arc variable splits routes that include or exclude it.", numbers: "If arc variable $x_{ij}=0.6$ in a relaxation, branches $x_{ij}=0$ and $x_{ij}=1$ cover binary route choices." }
    ],
    applicationsClose: "Branch and bound is a practical compromise: it respects discrete choices while using continuous relaxations to avoid blind enumeration.",
    takeaways: [
      "A relaxation bound limits how good any integer solution in a node can be.",
      "An incumbent is the best feasible integer solution found so far.",
      "Branching on a fractional variable splits the search without losing integer solutions.",
      "Nodes are pruned when infeasible, integral and solved, or unable to beat the incumbent."
    ]
  },

  "math-23-08": {
    id: "math-23-08",
    title: "The transportation problem",
    tagline: "The transportation problem ships supply to demand at minimum cost by balancing a grid of routes.",
    connections: {
      buildsOn: ["Linear programming formulation", "The simplex method", "LP duality"],
      leadsTo: ["The assignment problem", "network flow", "minimum-cost flow"],
      usedWith: ["matrices", "bipartite graphs", "flow conservation", "dual potentials"]
    },
    motivation:
      "<p>Imagine two warehouses and three stores. Each warehouse has limited supply, each store has demand, and each route has a shipping cost. The question is not one route; it is the whole grid at once.</p>" +
      "<p>The <b>transportation problem</b> is a beautifully structured LP. Variables live in a table, row sums use supplies, column sums meet demands, and the objective adds cost per shipped unit.</p>",
    definition:
      "<p>Let $x_{ij}\\ge0$ be the amount shipped from source $i$ to destination $j$, with cost $c_{ij}$. The balanced transportation problem minimizes $\\sum_i\\sum_j c_{ij}x_{ij}$ subject to row sums $\\sum_j x_{ij}=s_i$ for each supply $s_i$ and column sums $\\sum_i x_{ij}=d_j$ for each demand $d_j$.</p>" +
      "<p>Balance means total supply equals total demand. If supply exceeds demand, add a dummy destination with zero or disposal cost. If demand exceeds supply, add a dummy source with shortage cost. The table structure makes the LP sparse and interpretable.</p>" +
      "<p><b>Assumptions that matter:</b> shipment amounts are divisible unless integrality is added; costs are linear per unit; all supply and demand must be accounted for in the balanced form; and route capacities require extra constraints beyond the basic model.</p>",
    worked: {
      problem: "Two warehouses have supplies 20 and 30. Stores A, B, C demand 10, 25, 15. Costs are W1 to A,B,C: 2,4,5; W2 to A,B,C: 3,1,2. Give a low-cost feasible plan and its cost.",
      skills: ["supply-demand balance", "shipping tables", "cost calculation"],
      strategy: "Use the cheapest routes first while respecting row supplies and column demands.",
      steps: [
        { do: "Check total supply", result: "$20+30=50$", why: "add warehouse supplies" },
        { do: "Check total demand", result: "$10+25+15=50$", why: "add store demands" },
        { do: "Ship on cheapest route W2 to B", result: "$x_{2B}=25$", why: "cost 1 is lowest and B needs 25" },
        { do: "Update W2 supply", result: "$30-25=5$", why: "25 units have left W2" },
        { do: "Ship W2 to C", result: "$x_{2C}=5$", why: "cost 2 is next good route and W2 has 5 left" },
        { do: "Ship W1 to A", result: "$x_{1A}=10$", why: "A still needs 10" },
        { do: "Ship W1 to C", result: "$x_{1C}=10$", why: "C needs 10 more after W2's 5" },
        { do: "Compute cost", result: "$25*1+5*2+10*2+10*5=105$", why: "sum route quantity times route cost" }
      ],
      verify: "Rows ship W1: $20$ and W2: $30$; columns receive A: $10$, B: $25$, C: $15$.",
      answer: "One feasible plan is $x_{2B}=25$, $x_{2C}=5$, $x_{1A}=10$, $x_{1C}=10$, with total cost $105$.",
      connects: "Transportation models are LPs with conservation written as row and column sums."
    },
    practice: [
      { problem: "Supplies are 15 and 25; demands are 10 and 30. Is the problem balanced?", steps: [
        { do: "Add supplies", result: "$15+25=40$", why: "total available units" },
        { do: "Add demands", result: "$10+30=40$", why: "total required units" },
        { do: "Compare totals", result: "$40=40$", why: "balanced means totals match" },
        { do: "State dummy need", result: "no dummy row or column", why: "nothing is surplus or short" },
        { do: "Interpret", result: "all supply can exactly meet all demand", why: "row and column sums can both be satisfied" }
      ], answer: "The problem is balanced because total supply and total demand are both $40$." },
      { problem: "Supplies are 30 and 20; demands are 10, 15, and 20. Balance the problem.", steps: [
        { do: "Add supplies", result: "$30+20=50$", why: "available supply" },
        { do: "Add demands", result: "$10+15+20=45$", why: "required demand" },
        { do: "Find surplus", result: "$50-45=5$", why: "supply exceeds demand" },
        { do: "Add dummy destination", result: "demand $5$", why: "surplus supply needs a column" },
        { do: "Choose dummy cost", result: "$0$ if unused supply is free", why: "dummy cost models disposal or holding" }
      ], answer: "Add a dummy destination with demand $5$ and appropriate dummy shipping cost, often $0$." },
      { problem: "For shipments $x_{1A}=8$, $x_{1B}=7$, $x_{2A}=2$, $x_{2B}=23$ and costs $c_{1A}=3$, $c_{1B}=6$, $c_{2A}=4$, $c_{2B}=2$, compute total cost.", steps: [
        { do: "Compute W1 to A cost", result: "$8*3=24$", why: "quantity times unit cost" },
        { do: "Compute W1 to B cost", result: "$7*6=42$", why: "quantity times unit cost" },
        { do: "Compute W2 to A cost", result: "$2*4=8$", why: "quantity times unit cost" },
        { do: "Compute W2 to B cost", result: "$23*2=46$", why: "quantity times unit cost" },
        { do: "Add route costs", result: "$24+42+8+46=120$", why: "total shipping cost is additive" }
      ], answer: "The total cost is $120$." },
      { problem: "A plan ships from W1: 6 to A and 9 to B; from W2: 4 to A and 21 to B. Supplies are 15 and 25; demands are 10 and 30. Check feasibility.", steps: [
        { do: "Check W1 row", result: "$6+9=15$", why: "matches W1 supply" },
        { do: "Check W2 row", result: "$4+21=25$", why: "matches W2 supply" },
        { do: "Check A column", result: "$6+4=10$", why: "matches A demand" },
        { do: "Check B column", result: "$9+21=30$", why: "matches B demand" },
        { do: "Check nonnegativity", result: "all shipments are nonnegative", why: "negative shipment is impossible" }
      ], answer: "The plan is feasible." },
      { problem: "A data pipeline sends 100 GB from source S1 and 60 GB from S2 to clusters A and B demanding 70 GB and 90 GB. Costs per GB are S1 to A,B: 1,3; S2 to A,B: 2,1. Use cheapest routes first and compute cost.", steps: [
        { do: "Check balance", result: "$100+60=70+90=160$", why: "total supply equals total demand" },
        { do: "Ship S1 to A", result: "$70$ GB", why: "cost 1 is cheapest for A and A needs 70" },
        { do: "Update S1 remaining", result: "$100-70=30$", why: "S1 has 30 GB left" },
        { do: "Ship S2 to B", result: "$60$ GB", why: "cost 1 is cheapest for B and S2 has 60" },
        { do: "Ship S1 to B", result: "$30$ GB", why: "B still needs $90-60=30$" },
        { do: "Compute cost", result: "$70*1+60*1+30*3=220$", why: "sum shipped GB times per-GB cost" }
      ], answer: "The cheapest-route plan has cost $220$." }
    ],
    applications: [
      { title: "Freight shipping", background: "The classic use is moving goods from plants to markets. The table makes each origin-destination lane visible.", numbers: "Shipping 40 units at $3$ and 25 units at $5$ costs $120+125=245$." },
      { title: "Cloud data transfer", background: "Data engineering teams move datasets between regions and clusters under bandwidth costs. Transportation models capture source storage and destination demand.", numbers: "Moving 70 GB at $0.02$ per GB and 30 GB at $0.05$ costs $1.40+1.50=2.90$ dollars$." },
      { title: "Inventory rebalancing", background: "Retailers move inventory from stores with surplus to stores with shortages. Each transfer lane has a cost and capacity.", numbers: "If store X sends 12 jackets to Y at $4$ each, the lane cost is $48$." },
      { title: "Training data sharding", background: "ML platforms place shards across workers. Source shards and worker demand can be modeled like supply and demand.", numbers: "Four workers needing 25 GB each create total demand $100$ GB; two sources with 60 and 40 GB exactly balance." },
      { title: "Humanitarian logistics", background: "Relief operations route supplies from depots to affected areas with urgent demand. The model clarifies shortages and costs.", numbers: "Depots with 80 and 120 kits can meet towns demanding 50, 70, and 80 kits because both totals are $200$." },
      { title: "Minibatch distribution", background: "Distributed training assigns data chunks to machines. Shipping cost may mean transfer time rather than money.", numbers: "Sending 10 chunks over a 2-second link and 15 chunks over a 1-second link costs $20+15=35$ chunk-seconds." }
    ],
    applicationsClose: "Transportation problems remind us that many allocation questions are just flow conservation arranged in a table.",
    takeaways: [
      "Transportation variables $x_{ij}$ represent shipped amount from source $i$ to destination $j$.",
      "Row sums match supplies; column sums match demands.",
      "The objective adds cost per unit over all routes.",
      "Dummy sources or destinations balance unequal total supply and demand."
    ]
  },

  "math-23-09": {
    id: "math-23-09",
    title: "The assignment problem",
    tagline: "The assignment problem matches agents to tasks one-to-one at minimum cost or maximum value.",
    connections: {
      buildsOn: ["The transportation problem", "Integer programming", "Branch and bound"],
      leadsTo: ["matching algorithms", "network flow", "auction algorithms"],
      usedWith: ["bipartite graphs", "permutations", "matrices", "duality"]
    },
    motivation:
      "<p>Some transportation tables have a special discipline: each worker gets exactly one job, and each job gets exactly one worker. The shipments are no longer divisible quantities; they are yes/no matches.</p>" +
      "<p>The <b>assignment problem</b> is this one-to-one matching model. It appears in scheduling, labeling, recommendation, and evaluation whenever choosing the best pairing matters.</p>",
    definition:
      "<p>Let $x_{ij}\\in\\{0,1\\}$ equal 1 if agent $i$ is assigned to task $j$ and 0 otherwise. A square minimization assignment problem is $\\min\\sum_i\\sum_j c_{ij}x_{ij}$ subject to $\\sum_j x_{ij}=1$ for every agent $i$ and $\\sum_i x_{ij}=1$ for every task $j$.</p>" +
      "<p>This is a special transportation problem where every supply and demand equals 1. Although the variables are binary, the LP relaxation has integer extreme points for the balanced assignment matrix, which is why specialized algorithms can solve large instances efficiently.</p>" +
      "<p><b>Assumptions that matter:</b> the basic model enforces one agent per task and one task per agent; rectangular problems need dummy rows or columns; costs must represent the same objective across all pairings; and extra rules such as skills or fairness require additional constraints.</p>",
    worked: {
      problem: "Assign workers A, B, C to jobs 1, 2, 3 with costs A: 8, 4, 7; B: 6, 5, 9; C: 7, 8, 3. Find the minimum-cost assignment by checking all permutations.",
      skills: ["binary assignment", "permutations", "cost comparison"],
      strategy: "Each worker gets one different job — enumerate the six job permutations and choose the least cost.",
      steps: [
        { do: "Evaluate A1, B2, C3", result: "$8+5+3=16$", why: "one complete assignment" },
        { do: "Evaluate A1, B3, C2", result: "$8+9+8=25$", why: "swap jobs for B and C" },
        { do: "Evaluate A2, B1, C3", result: "$4+6+3=13$", why: "A takes job 2" },
        { do: "Evaluate A2, B3, C1", result: "$4+9+7=20$", why: "remaining jobs go to B and C" },
        { do: "Evaluate A3, B1, C2", result: "$7+6+8=21$", why: "A takes job 3" },
        { do: "Evaluate A3, B2, C1", result: "$7+5+7=19$", why: "the final permutation" },
        { do: "Choose the smallest", result: "$13$", why: "minimization selects the lowest total cost" }
      ],
      verify: "In the best assignment, workers A, B, C take jobs 2, 1, 3 respectively, so every worker and every job appears exactly once.",
      answer: "Assign A to 2, B to 1, and C to 3 for total cost $13$.",
      connects: "Assignment is transportation with unit supplies, unit demands, and binary matches."
    },
    practice: [
      { problem: "Write the row and column constraints for a 3-by-3 assignment variable matrix $x_{ij}$.", steps: [
        { do: "Write row 1", result: "$x_{11}+x_{12}+x_{13}=1$", why: "agent 1 gets exactly one task" },
        { do: "Write row 2", result: "$x_{21}+x_{22}+x_{23}=1$", why: "agent 2 gets exactly one task" },
        { do: "Write row 3", result: "$x_{31}+x_{32}+x_{33}=1$", why: "agent 3 gets exactly one task" },
        { do: "Write column 1", result: "$x_{11}+x_{21}+x_{31}=1$", why: "task 1 gets exactly one agent" },
        { do: "Write columns 2 and 3", result: "$x_{12}+x_{22}+x_{32}=1$, $x_{13}+x_{23}+x_{33}=1$", why: "each remaining task is filled once" },
        { do: "State binary restrictions", result: "$x_{ij}\\in\\{0,1\\}$", why: "a pairing is either chosen or not" }
      ], answer: "Use three row-sum equations, three column-sum equations, and binary restrictions $x_{ij}\\in\\{0,1\\}$." },
      { problem: "For costs A: 2, 6; B: 5, 3, solve the 2-by-2 assignment problem.", steps: [
        { do: "Evaluate A to 1 and B to 2", result: "$2+3=5$", why: "one possible one-to-one assignment" },
        { do: "Evaluate A to 2 and B to 1", result: "$6+5=11$", why: "the other possible assignment" },
        { do: "Compare totals", result: "$5<11$", why: "minimization chooses smaller cost" },
        { do: "Choose A's job", result: "A gets job 1", why: "part of the lower-cost assignment" },
        { do: "Choose B's job", result: "B gets job 2", why: "the remaining job goes to B" }
      ], answer: "Assign A to job 1 and B to job 2, with total cost $5$." },
      { problem: "A rectangular problem has 2 workers and 3 jobs, but each worker can do one job and every real worker may be used once. How do you balance it for an assignment model?", steps: [
        { do: "Count workers", result: "$2$", why: "there are two real agents" },
        { do: "Count jobs", result: "$3$", why: "there are three tasks" },
        { do: "Find imbalance", result: "$3-2=1$", why: "one extra row is needed" },
        { do: "Add dummy worker", result: "one dummy row", why: "a square assignment table needs equal sides" },
        { do: "Set dummy costs", result: "cost 0 or penalty values", why: "dummy assignment means one job is left unstaffed or externally handled" }
      ], answer: "Add one dummy worker row, with costs chosen to represent leaving or outsourcing one job." },
      { problem: "A maximization assignment has scores A: 9, 4; B: 6, 8. Solve by checking both assignments.", steps: [
        { do: "Evaluate A1, B2", result: "$9+8=17$", why: "one complete matching" },
        { do: "Evaluate A2, B1", result: "$4+6=10$", why: "the alternate matching" },
        { do: "Compare scores", result: "$17>10$", why: "maximization chooses the larger total" },
        { do: "Choose A's task", result: "A gets task 1", why: "score 9 is paired in the best matching" },
        { do: "Choose B's task", result: "B gets task 2", why: "score 8 completes the best matching" }
      ], answer: "Assign A to task 1 and B to task 2 for total score $17$." },
      { problem: "Match predicted clusters P1, P2, P3 to labels L1, L2, L3 to maximize correct counts. Counts are P1: 30,5,10; P2: 4,25,8; P3: 6,7,20. Find the best obvious assignment and score.", steps: [
        { do: "Choose P1's strongest label", result: "P1 to L1 gives $30$", why: "30 is largest in row P1" },
        { do: "Choose P2's strongest remaining label", result: "P2 to L2 gives $25$", why: "L1 is already used and 25 is strongest for P2" },
        { do: "Choose P3's remaining label", result: "P3 to L3 gives $20$", why: "L3 remains and is P3's strongest" },
        { do: "Compute total matches", result: "$30+25+20=75$", why: "correct counts add" },
        { do: "Compare a swap P2 and P3", result: "$30+8+7=45$", why: "the natural diagonal beats that swap" },
        { do: "State assignment", result: "P1-L1, P2-L2, P3-L3", why: "it gives the highest evident total" }
      ], answer: "Assign P1 to L1, P2 to L2, and P3 to L3 for score $75$." }
    ],
    applications: [
      { title: "Worker-task scheduling", background: "The classic assignment problem matches people to jobs while minimizing time or cost.", numbers: "If Alice-job1 costs 4 hours and Bob-job2 costs 3 hours, that pairing costs $7$ hours." },
      { title: "Cluster label matching", background: "Unsupervised clusters have arbitrary names. Evaluation often assigns clusters to true labels to maximize agreement.", numbers: "Counts 30, 25, and 20 on a chosen diagonal give $75$ correct out of 100, or $75\\%$." },
      { title: "Object tracking", background: "Video systems match detections from one frame to tracks from the previous frame. Costs often measure distance.", numbers: "Distances 2.1, 0.8, and 1.5 pixels in selected matches total $4.4$ pixels." },
      { title: "Recommendation slots", background: "A recommender may assign items to page slots with position-dependent value while avoiding duplicates.", numbers: "Item A in slot 1 scores 9 and item B in slot 2 scores 6, so the assignment value is $15$." },
      { title: "Reviewer-paper matching", background: "Conferences assign reviewers to papers using expertise scores and conflict constraints. The one-to-one version is the clean core.", numbers: "Three assignments with expertise scores 4, 5, and 3 sum to $12$ expertise points." },
      { title: "GPU job placement", background: "Schedulers can match jobs to machines based on expected runtime or data locality. Each job should land on one machine.", numbers: "If chosen runtimes are 12, 9, and 15 minutes, total completion-time cost is $36$ minutes in the assignment objective." }
    ],
    applicationsClose: "The assignment problem is matching with discipline: every row chooses once, every column is chosen once, and the total score tells the story.",
    takeaways: [
      "Assignment variables are binary pair choices $x_{ij}$.",
      "Row sums force each agent to get one task; column sums force each task to get one agent.",
      "Rectangular problems can be balanced with dummy rows or columns.",
      "Assignment is a special transportation problem with unit supplies and demands."
    ]
  }
};
