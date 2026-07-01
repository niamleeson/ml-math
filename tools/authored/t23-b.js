module.exports = {
  "math-23-10": {
    id: "math-23-10",
    title: "Network flow models",
    tagline: "Network flow turns movement through a graph into careful accounting at every node.",
    connections: {
      buildsOn: ["graphs", "linear equations", "linear programming constraints"],
      leadsTo: ["Dynamic programming", "Scheduling models", "Resource allocation & scheduling in ML systems"],
      usedWith: ["linear programming", "duality", "integer programming", "graph algorithms"]
    },
    motivation:
      "<p>You already know how to balance a simple budget: what comes in, what goes out, and what remains. A network flow model uses the same instinct on a graph of roads, links, jobs, or data paths.</p>" +
      "<p>The warm surprise is that many practical routing questions become linear constraints. If every arc has a capacity and every node conserves flow, then the model can find the largest shipment, cheapest route plan, or safest bottleneck without guessing paths one by one.</p>",
    definition:
      "<p>A <b>network flow model</b> has directed arcs $(i,j)$ with flow variables $x_{ij}\\ge0$ and capacities $u_{ij}$. In a max-flow problem, a source $s$ sends value $v$ to a sink $t$. Capacity constraints say $0\\le x_{ij}\\le u_{ij}$. Conservation says that for every intermediate node $k$, $$\\sum_i x_{ik}=\\sum_j x_{kj},$$ so inflow equals outflow.</p>" +
      "<p>The max-flow value can be written by adding source outflow, $v=\\sum_j x_{sj}-\\sum_i x_{is}$. The famous cut idea explains why bottlenecks matter: any cut separating $s$ from $t$ can carry at most the sum of capacities crossing the cut, so every feasible flow is bounded by every cut capacity.</p>" +
      "<p><b>Assumptions that matter:</b> flows are nonnegative; capacities are fixed upper bounds; intermediate nodes do not create or destroy flow unless explicitly given supply or demand; and the graph direction matters unless both directions are modeled as separate arcs.</p>",
    worked: {
      problem: "Find the maximum $s$-$t$ flow in a network with arcs $s\\to a$ capacity $4$, $s\\to b$ capacity $3$, $a\\to t$ capacity $2$, $b\\to t$ capacity $5$, and $a\\to b$ capacity $1$.",
      skills: ["capacity constraints", "flow conservation", "cut bounds"],
      strategy: "The obstacle is coordinating paths — build a feasible flow and match it to a cut upper bound.",
      steps: [
        { do: "List total capacity leaving $s$", result: "$4+3=7$", why: "no flow can leave the source beyond outgoing capacity" },
        { do: "List direct capacity entering $t$", result: "$2+5=7$", why: "the sink can receive at most the total incoming capacity" },
        { do: "Send flow on $s\\to a\\to t$", result: "$x_{sa}=2$, $x_{at}=2$", why: "arc $a\\to t$ limits this path to 2" },
        { do: "Send flow on $s\\to b\\to t$", result: "$x_{sb}=3$, $x_{bt}=3$", why: "arc $s\\to b$ limits this path to 3" },
        { do: "Use the remaining capacity from $s$ to $a$", result: "$x_{sa}=3$", why: "one extra unit can still leave $s$ toward $a$" },
        { do: "Route that extra unit through $a\\to b\\to t$", result: "$x_{ab}=1$, $x_{bt}=4$", why: "$a\\to b$ has capacity 1 and $b\\to t$ still has room" },
        { do: "Compute total source outflow", result: "$v=x_{sa}+x_{sb}=3+3=6$", why: "the constructed plan sends 6 units" },
        { do: "Evaluate cut $\\{s,a\\}$ versus $\\{b,t\\}$", result: "$u_{sb}+u_{at}+u_{ab}=3+2+1=6$", why: "all flow crossing this cut is bounded by 6" }
      ],
      verify: "The feasible flow sends 6 units, and a cut has capacity 6, so no larger flow is possible.",
      answer: "The maximum flow value is $6$.",
      connects: "Network flow is conservation plus capacity, with cuts revealing the bottleneck."
    },
    practice: [
      { problem: "A source has arcs $s\\to a$ capacity $5$ and $s\\to b$ capacity $2$. Arcs $a\\to t$ and $b\\to t$ have capacities $3$ and $4$. Find the maximum flow when there is no arc between $a$ and $b$.", steps: [
        { do: "Bound flow leaving $s$", result: "$5+2=7$", why: "source outflow cannot exceed outgoing capacity" },
        { do: "Bound flow entering $t$", result: "$3+4=7$", why: "sink inflow cannot exceed incoming capacity" },
        { do: "Send on path $s\\to a\\to t$", result: "$3$ units", why: "$a\\to t$ is the smaller capacity on that path" },
        { do: "Send on path $s\\to b\\to t$", result: "$2$ units", why: "$s\\to b$ is the smaller capacity on that path" },
        { do: "Add the path flows", result: "$3+2=5$", why: "the two paths are arc-disjoint" },
        { do: "Check cut $\\{s,b\\}$", result: "$u_{sa}+u_{bt}=5+4=9$", why: "this cut is not tight" },
        { do: "Check cut $\\{s,a\\}$", result: "$u_{sb}+u_{at}=2+3=5$", why: "this cut proves an upper bound of 5" }
      ], answer: "The maximum flow is $5$ units." },
      { problem: "For a flow with $x_{sa}=4$, $x_{ca}=1$, $x_{ab}=2$, and $x_{at}=3$, check conservation at node $a$.", steps: [
        { do: "List inflows to $a$", result: "$x_{sa}=4$ and $x_{ca}=1$", why: "these arcs end at $a$" },
        { do: "Add inflow", result: "$4+1=5$", why: "total inflow is the sum of incoming arcs" },
        { do: "List outflows from $a$", result: "$x_{ab}=2$ and $x_{at}=3$", why: "these arcs leave $a$" },
        { do: "Add outflow", result: "$2+3=5$", why: "total outflow is the sum of outgoing arcs" },
        { do: "Compare totals", result: "$5=5$", why: "conservation holds when inflow equals outflow" }
      ], answer: "Node $a$ satisfies flow conservation." },
      { problem: "A min-cost flow ships $6$ units from $s$ to $t$. Path 1 has capacity $4$ and cost $3$ per unit; path 2 has capacity $5$ and cost $5$ per unit. Find the cheapest shipment plan.", steps: [
        { do: "Use the cheaper path first", result: "$4$ units on path 1", why: "path 1 costs less and can carry at most 4" },
        { do: "Compute remaining demand", result: "$6-4=2$", why: "the total required shipment is 6" },
        { do: "Assign remaining flow", result: "$2$ units on path 2", why: "path 2 has enough capacity for the remainder" },
        { do: "Compute path 1 cost", result: "$4\\cdot3=12$", why: "cost equals units times cost per unit" },
        { do: "Compute path 2 cost", result: "$2\\cdot5=10$", why: "apply the same cost rule" },
        { do: "Add costs", result: "$12+10=22$", why: "total cost sums over paths" }
      ], answer: "Ship $4$ units on path 1 and $2$ on path 2 for total cost $22$." },
      { problem: "A bipartite matching has workers $A,B$ and jobs $1,2$. Edges are $A$-$1$, $A$-$2$, and $B$-$2$. Model it as a unit-capacity flow and find the maximum matching size.", steps: [
        { do: "Add source arcs to workers", result: "$s\\to A$ and $s\\to B$ with capacity $1$", why: "each worker can take at most one job" },
        { do: "Add worker-to-job arcs", result: "$A\\to1$, $A\\to2$, $B\\to2$", why: "these represent allowed assignments" },
        { do: "Add job arcs to sink", result: "$1\\to t$ and $2\\to t$ with capacity $1$", why: "each job can be assigned once" },
        { do: "Choose assignment for worker $B$", result: "$B\\to2$", why: "$B$ has only job 2 available" },
        { do: "Choose assignment for worker $A$", result: "$A\\to1$", why: "job 1 remains available" },
        { do: "Count matched pairs", result: "$2$", why: "two unit flows reach the sink" }
      ], answer: "The maximum matching size is $2$, with assignments $A$-$1$ and $B$-$2$." },
      { problem: "A data pipeline sends training examples from storage $s$ to GPUs $t$. Capacities are $s\\to p$ $8$, $s\\to q$ $6$, $p\\to t$ $5$, $q\\to t$ $7$, and $p\\to q$ $2$ thousand examples per second. Find the max throughput.", steps: [
        { do: "Compute outgoing source capacity", result: "$8+6=14$", why: "this is a broad upper bound" },
        { do: "Compute incoming sink capacity", result: "$5+7=12$", why: "the GPUs can receive at most 12" },
        { do: "Send direct flow through $p$", result: "$5$ on $s\\to p\\to t$", why: "$p\\to t$ is capped at 5" },
        { do: "Send direct flow through $q$", result: "$6$ on $s\\to q\\to t$", why: "$s\\to q$ is capped at 6" },
        { do: "Compute spare capacity on $s\\to p$", result: "$8-5=3$", why: "after sending 5 through $p\\to t$, the source arc still has room" },
        { do: "Compute spare capacity on $q\\to t$", result: "$7-6=1$", why: "the sink arc from $q$ has only one unit of room left" },
        { do: "Route one extra unit through $p\\to q\\to t$", result: "$1$ more unit reaches $t$", why: "the extra path is limited by the remaining $q\\to t$ capacity" },
        { do: "Compute throughput", result: "$5+6+1=12$", why: "the sink incoming bound is met" }
      ], answer: "The maximum throughput is $12$ thousand examples per second." }
    ],
    applications: [
      { title: "Internet routing and link capacity", background: "Network operators model traffic moving through routers as flow on a graph. The model makes congestion visible before links saturate.", numbers: "If two links into a data center carry $40$ and $60$ Gb/s, then no routing plan can deliver more than $100$ Gb/s through those entrances." },
      { title: "Supply chains", background: "Factories, warehouses, and stores form a natural flow network. Conservation means products cannot appear at a warehouse unless they were shipped there.", numbers: "If a warehouse receives $120$ pallets and keeps inventory unchanged, outgoing shipments across stores must total $120$ pallets." },
      { title: "Assignment as matching", background: "Bipartite matching is a classic network-flow use: workers connect to jobs they can do, and unit capacities enforce one assignment each.", numbers: "With $10$ workers and $8$ jobs, the max matching is at most $8$ because only $8$ unit-capacity arcs enter the sink." },
      { title: "Image segmentation cuts", background: "Graph cuts became important in vision because separating foreground from background can be framed as cutting a weighted graph.", numbers: "If a cut crosses edges of weights $2.1$, $0.7$, and $1.4$, its cost is $4.2$; a lower cut is preferred." },
      { title: "Data ingestion bottlenecks", background: "ML systems often move examples through storage, preprocessing, and training. Flow models identify the limiting stage.", numbers: "If preprocessors output $18$k examples/s but GPU input links accept $15$k examples/s, throughput is capped at $15$k examples/s." },
      { title: "Evacuation planning", background: "Operations researchers use flows to reason about people moving through exits and corridors under capacity limits.", numbers: "Three exits with capacities $80$, $120$, and $100$ people per minute can clear at most $300$ people per minute." }
    ],
    applicationsClose: "From packets to pallets to training examples, network flow asks every node to keep honest books about what can pass through.",
    takeaways: [
      "Flow variables live on directed arcs and obey capacity bounds.",
      "Intermediate nodes conserve flow: total inflow equals total outflow.",
      "A cut gives an upper bound on any feasible $s$-$t$ flow.",
      "Matching, routing, segmentation, and ML data movement all fit the same graph accounting pattern."
    ]
  },

  "math-23-11": {
    id: "math-23-11",
    title: "Dynamic programming",
    tagline: "Dynamic programming wins by remembering the best answer to each smaller decision state.",
    connections: {
      buildsOn: ["recursion", "optimization", "sequences and sums"],
      leadsTo: ["Scheduling models", "Stochastic optimization", "Resource allocation & scheduling in ML systems"],
      usedWith: ["graphs", "Bellman equations", "shortest paths", "integer programming"]
    },
    motivation:
      "<p>You already solve some problems by working backward: if the final bill is known, ask what must have happened just before it. Dynamic programming gives that backward thinking a disciplined memory.</p>" +
      "<p>Instead of exploring every possible plan separately, we define a state, write the best value from that state, and reuse it. The reward is enormous: repeated subproblems become table entries rather than repeated labor.</p>",
    definition:
      "<p><b>Dynamic programming</b> solves an optimization problem by defining states and a value function. A typical finite-horizon recurrence is $$V_t(s)=\\max_{a\\in A(s)}\\{r_t(s,a)+V_{t+1}(T(s,a))\\},$$ where $s$ is the current state, $a$ is an action, $r_t$ is immediate reward, $T$ is the next-state rule, and $V_t(s)$ is the best total value from time $t$ onward.</p>" +
      "<p>The recurrence follows from the principle of optimality: after the first decision, the remaining decisions must form an optimal plan for the state that decision creates. If not, replacing the tail with a better tail would improve the original plan.</p>" +
      "<p><b>Assumptions that matter:</b> the state must contain all information needed for future decisions; subproblems must overlap or have reusable structure; boundary values must be specified; and the recurrence must avoid circular dependence unless a valid fixed-point or graph-order method is used.</p>",
    worked: {
      problem: "A small project has two stages left. At stage 2, state $s$ has choices with rewards $5$ or $7$, then ends. At stage 1, action $A$ gives reward $3$ and moves to stage 2; action $B$ gives reward $6$ and ends. Find the optimal value at stage 1.",
      skills: ["value functions", "backward induction", "optimal substructure"],
      strategy: "The future affects the present — compute the last-stage value first, then compare first-stage actions.",
      steps: [
        { do: "Write the terminal value", result: "$V_3=0$", why: "after stage 2 there is no reward left" },
        { do: "Evaluate stage 2 choice 1", result: "$5+V_3=5$", why: "the process ends after the reward" },
        { do: "Evaluate stage 2 choice 2", result: "$7+V_3=7$", why: "same terminal continuation" },
        { do: "Take the stage 2 maximum", result: "$V_2=7$", why: "choose the better remaining action" },
        { do: "Evaluate stage 1 action $A$", result: "$3+V_2=10$", why: "action $A$ earns 3 now and keeps the best future" },
        { do: "Evaluate stage 1 action $B$", result: "$6$", why: "action $B$ ends immediately" },
        { do: "Choose the larger value", result: "$V_1=10$", why: "$10>6$" }
      ],
      verify: "Choosing the smaller immediate reward $A$ is still better because it unlocks the valuable future reward 7.",
      answer: "The optimal value is $10$, achieved by action $A$ and then the stage-2 reward-$7$ choice.",
      connects: "Dynamic programming makes future consequences visible in today's action comparison."
    },
    practice: [
      { problem: "Compute Fibonacci numbers with the recurrence $F_n=F_{n-1}+F_{n-2}$, $F_0=0$, $F_1=1$, through $F_6$.", steps: [
        { do: "Use the first boundary value", result: "$F_0=0$", why: "the recurrence needs starting values" },
        { do: "Use the second boundary value", result: "$F_1=1$", why: "two previous values are needed" },
        { do: "Compute $F_2$", result: "$F_1+F_0=1+0=1$", why: "apply the recurrence" },
        { do: "Compute $F_3$", result: "$F_2+F_1=1+1=2$", why: "reuse stored values" },
        { do: "Compute $F_4$", result: "$F_3+F_2=2+1=3$", why: "continue the table" },
        { do: "Compute $F_5$", result: "$F_4+F_3=3+2=5$", why: "reuse instead of recompute" },
        { do: "Compute $F_6$", result: "$F_5+F_4=5+3=8$", why: "finish the requested value" }
      ], answer: "$F_6=8$." },
      { problem: "A shortest path to node $D$ satisfies $d(D)=0$, $d(B)=2+d(D)$, $d(C)=5+d(D)$, and $d(A)=\\min\\{4+d(B),1+d(C)\\}$. Find $d(A)$.", steps: [
        { do: "Set the destination distance", result: "$d(D)=0$", why: "distance from the destination to itself is zero" },
        { do: "Compute $d(B)$", result: "$2+0=2$", why: "only one listed continuation from $B$" },
        { do: "Compute $d(C)$", result: "$5+0=5$", why: "only one listed continuation from $C$" },
        { do: "Evaluate route through $B$", result: "$4+d(B)=4+2=6$", why: "edge cost plus best remaining distance" },
        { do: "Evaluate route through $C$", result: "$1+d(C)=1+5=6$", why: "same Bellman comparison" },
        { do: "Take the minimum", result: "$d(A)=6$", why: "both routes tie" }
      ], answer: "$d(A)=6$." },
      { problem: "A knapsack has capacity $5$. Item 1 has weight $2$, value $6$; item 2 has weight $3$, value $10$; item 3 has weight $4$, value $12$. Find the best value.", steps: [
        { do: "Check item 1 alone", result: "weight $2$, value $6$", why: "single feasible item" },
        { do: "Check item 2 alone", result: "weight $3$, value $10$", why: "single feasible item" },
        { do: "Check item 3 alone", result: "weight $4$, value $12$", why: "single feasible item" },
        { do: "Check items 1 and 2", result: "weight $2+3=5$, value $6+10=16$", why: "this combination fits exactly" },
        { do: "Check items 1 and 3", result: "weight $6$", why: "exceeds capacity 5" },
        { do: "Check items 2 and 3", result: "weight $7$", why: "exceeds capacity 5" },
        { do: "Choose the best feasible value", result: "$16$", why: "16 is larger than 6, 10, and 12" }
      ], answer: "Take items 1 and 2 for value $16$." },
      { problem: "A two-day ad budget DP has budget $3$. Day 2 value is $V_2(b)=2b$. On day 1, spending $x$ gives reward $5\\sqrt{x}$ for $x=0,1,2,3$ with $\\sqrt0=0$, $\\sqrt1=1$, $\\sqrt2\\approx1.414$, $\\sqrt3\\approx1.732$. Find the best day-1 spend.", steps: [
        { do: "Evaluate $x=0$", result: "$0+V_2(3)=6$", why: "all budget remains" },
        { do: "Evaluate $x=1$", result: "$5+V_2(2)=5+4=9$", why: "two units remain" },
        { do: "Evaluate $x=2$", result: "$5\\sqrt2+V_2(1)\\approx7.07+2=9.07$", why: "one unit remains" },
        { do: "Evaluate $x=3$", result: "$5\\sqrt3+V_2(0)\\approx8.66$", why: "no budget remains" },
        { do: "Compare values", result: "$9.07$ is largest", why: "it slightly beats spending 1" },
        { do: "Choose the action", result: "$x=2$", why: "dynamic programming compares immediate plus future value" }
      ], answer: "Spend $2$ on day 1 for total value about $9.07$." },
      { problem: "In sequence labeling, transition scores are $A\\to A=1$, $A\\to B=0$, $B\\to A=2$, $B\\to B=1$. Emission scores at time 2 are $A=3$, $B=4$. If time-1 scores are $A=5$, $B=2$, compute Viterbi scores at time 2.", steps: [
        { do: "Evaluate ending in $A$ from previous $A$", result: "$5+1+3=9$", why: "previous score plus transition plus emission" },
        { do: "Evaluate ending in $A$ from previous $B$", result: "$2+2+3=7$", why: "use the $B\\to A$ transition" },
        { do: "Take best score for $A$", result: "$9$", why: "choose the larger predecessor" },
        { do: "Evaluate ending in $B$ from previous $A$", result: "$5+0+4=9$", why: "use the $A\\to B$ transition" },
        { do: "Evaluate ending in $B$ from previous $B$", result: "$2+1+4=7$", why: "use the $B\\to B$ transition" },
        { do: "Take best score for $B$", result: "$9$", why: "choose the larger predecessor" }
      ], answer: "The time-2 Viterbi scores are $A=9$ and $B=9$." }
    ],
    applications: [
      { title: "Shortest paths", background: "Bellman's dynamic programming view of shortest paths says the best route from a node is one edge plus the best route after that edge.", numbers: "If $A\\to B$ costs $3$ and $d(B)=7$, that option costs $10$; if $A\\to C$ costs $5$ and $d(C)=4$, choose cost $9$." },
      { title: "Inventory planning", background: "Operations researchers use DP when today's order affects tomorrow's stock. The state is inventory level.", numbers: "With holding cost $1$ per unit, ending with $4$ units adds $4$ cost to the next state's value." },
      { title: "Sequence alignment", background: "Bioinformatics and text comparison align sequences by solving smaller prefix-alignment problems.", numbers: "If match is $+2$, gap is $-1$, and diagonal prefix score is $5$, a match option scores $7$." },
      { title: "Viterbi decoding", background: "Hidden Markov models and structured prediction use DP to find the best hidden state sequence without enumerating all sequences.", numbers: "For $3$ labels and length $10$, brute force has $3^{10}=59049$ paths; Viterbi stores only $10\\cdot3=30$ state scores plus transitions." },
      { title: "Reinforcement learning", background: "Value iteration is dynamic programming for decision processes when transitions and rewards are known or estimated.", numbers: "With reward $2$, discount $0.9$, and next value $10$, an action has value $2+0.9\\cdot10=11$." },
      { title: "Compiler optimization", background: "Some compilers choose efficient instruction sequences by reusing optimal costs for smaller expression trees.", numbers: "If computing subexpression $u$ costs $4$ cycles and combining costs $2$, that branch contributes $6$ cycles." }
    ],
    applicationsClose: "Dynamic programming is the art of turning a long decision into trusted smaller decisions whose answers are saved and reused.",
    takeaways: [
      "A DP state must contain exactly the information needed for future choices.",
      "The value recurrence compares immediate reward or cost plus optimal continuation.",
      "Boundary values start the table or recursion.",
      "DP powers shortest paths, knapsack, sequence decoding, inventory, and reinforcement learning."
    ]
  },

  "math-23-12": {
    id: "math-23-12",
    title: "Queueing theory",
    tagline: "Queueing theory explains why systems feel calm below capacity and suddenly painful near saturation.",
    connections: {
      buildsOn: ["probability distributions", "expected value", "rates"],
      leadsTo: ["Inventory models", "Scheduling models", "Resource allocation & scheduling in ML systems"],
      usedWith: ["Markov chains", "Little's law", "stochastic processes", "optimization"]
    },
    motivation:
      "<p>You have felt a queue change character. A coffee line with one customer ahead is fine; the same line near closing time can grow faster than it clears. The math is not just about lines of people. It also describes requests, jobs, packets, and training tasks.</p>" +
      "<p>Queueing theory gives a few clear quantities to watch: arrivals, service, utilization, waiting time, and the number in system. The lesson is gentle but important: small increases in utilization can cause large increases in waiting.</p>",
    definition:
      "<p>In a basic $M/M/1$ queue, arrivals follow a Poisson process with rate $\\lambda$, service times are exponential with rate $\\mu$, and there is one server. The <b>utilization</b> is $\\rho=\\lambda/\\mu$. The stable case requires $\\rho<1$.</p>" +
      "<p>For a stable $M/M/1$ queue, the expected number in the system is $L=\\dfrac{\\rho}{1-\\rho}$, the expected time in the system is $W=\\dfrac{1}{\\mu-\\lambda}$, and Little's law says $L=\\lambda W$. The waiting part before service is $W_q=\\dfrac{\\lambda}{\\mu(\\mu-\\lambda)}$.</p>" +
      "<p><b>Assumptions that matter:</b> $M/M/1$ formulas assume memoryless arrivals and service, a single server, first-come first-served discipline, long-run steady state, and $\\lambda<\\mu$. If arrivals are bursty or service times are heavy-tailed, the formulas become approximations or need a different model.</p>",
    worked: {
      problem: "A single API worker receives $\\lambda=8$ requests per second and serves $\\mu=10$ requests per second. For an $M/M/1$ approximation, find utilization, expected number in system, and expected time in system.",
      skills: ["rates", "utilization", "Little's law"],
      strategy: "The danger is saturation — compute $\\rho$ first, then use steady-state formulas only if $\\rho<1$.",
      steps: [
        { do: "Compute utilization", result: "$\\rho=\\lambda/\\mu=8/10=0.8$", why: "utilization is arrival rate divided by service rate" },
        { do: "Check stability", result: "$0.8<1$", why: "the server is faster than arrivals on average" },
        { do: "Compute expected number", result: "$L=\\dfrac{0.8}{1-0.8}$", why: "use the $M/M/1$ formula" },
        { do: "Simplify expected number", result: "$L=4$", why: "$0.8/0.2=4$" },
        { do: "Compute expected time", result: "$W=\\dfrac{1}{10-8}=0.5$ seconds", why: "time in system equals reciprocal spare service rate" },
        { do: "Check Little's law", result: "$\\lambda W=8\\cdot0.5=4$", why: "this matches $L$" }
      ],
      verify: "The server is busy 80 percent of the time, and an average of 4 requests in system is plausible but already shows congestion.",
      answer: "Utilization is $0.8$, expected number in system is $4$, and expected time in system is $0.5$ seconds.",
      connects: "Queueing formulas translate spare capacity into waiting time."
    },
    practice: [
      { problem: "For an $M/M/1$ queue with $\\lambda=3$ per minute and $\\mu=5$ per minute, compute $\\rho$, $L$, and $W$.", steps: [
        { do: "Compute utilization", result: "$\\rho=3/5=0.6$", why: "arrival rate divided by service rate" },
        { do: "Check stability", result: "$0.6<1$", why: "service rate exceeds arrival rate" },
        { do: "Compute $L$", result: "$L=0.6/(1-0.6)$", why: "use the stable $M/M/1$ formula" },
        { do: "Simplify $L$", result: "$L=1.5$", why: "$0.6/0.4=1.5$" },
        { do: "Compute $W$", result: "$W=1/(5-3)=0.5$ minutes", why: "spare service rate is 2 per minute" }
      ], answer: "$\\rho=0.6$, $L=1.5$, and $W=0.5$ minutes." },
      { problem: "A queue has average number in system $L=12$ and arrival rate $\\lambda=4$ jobs per second. Use Little's law to find $W$.", steps: [
        { do: "Write Little's law", result: "$L=\\lambda W$", why: "average number equals arrival rate times average time" },
        { do: "Substitute known values", result: "$12=4W$", why: "use the given $L$ and $\\lambda$" },
        { do: "Divide by $4$", result: "$W=3$", why: "isolate average time" },
        { do: "Attach units", result: "$3$ seconds", why: "arrival rate was jobs per second" },
        { do: "Check", result: "$4\\cdot3=12$", why: "the product returns $L$" }
      ], answer: "The average time in system is $3$ seconds." },
      { problem: "For $\\lambda=9$ and $\\mu=10$ requests per second, compare $W$ with the worked example where $\\lambda=8$ and $\\mu=10$.", steps: [
        { do: "Compute new spare capacity", result: "$\\mu-\\lambda=10-9=1$", why: "waiting depends on spare service rate" },
        { do: "Compute new $W$", result: "$W=1/1=1$ second", why: "use $M/M/1$ time formula" },
        { do: "Recall old spare capacity", result: "$10-8=2$", why: "from the worked example" },
        { do: "Recall old $W$", result: "$1/2=0.5$ seconds", why: "reciprocal of old spare capacity" },
        { do: "Compare times", result: "$1/0.5=2$", why: "one extra arrival per second doubled the average time" }
      ], answer: "The average time rises from $0.5$ seconds to $1$ second, a factor of $2$." },
      { problem: "An $M/M/1$ queue has $\\lambda=6$ per minute and $\\mu=8$ per minute. Compute $W_q$ and interpret it.", steps: [
        { do: "Compute spare rate", result: "$\\mu-\\lambda=8-6=2$", why: "appears in the denominator" },
        { do: "Write $W_q$", result: "$W_q=\\dfrac{\\lambda}{\\mu(\\mu-\\lambda)}$", why: "waiting before service for $M/M/1$" },
        { do: "Substitute rates", result: "$W_q=\\dfrac{6}{8\\cdot2}$", why: "use given arrival and service rates" },
        { do: "Simplify", result: "$W_q=\\dfrac{6}{16}=0.375$ minutes", why: "divide numerator by denominator" },
        { do: "Convert to seconds", result: "$0.375\\cdot60=22.5$ seconds", why: "one minute has 60 seconds" }
      ], answer: "Expected waiting before service is $0.375$ minutes, or $22.5$ seconds." },
      { problem: "A GPU job queue averages $30$ jobs in system and jobs arrive at $0.5$ per minute. If a scaling change reduces average time by $20\\%$ with the same arrival rate, what is the new average number in system?", steps: [
        { do: "Find original time", result: "$W=L/\\lambda=30/0.5=60$ minutes", why: "Little's law rearranged" },
        { do: "Compute time reduction", result: "$20\\%$ of $60$ is $12$", why: "$0.20\\cdot60=12$" },
        { do: "Compute new time", result: "$60-12=48$ minutes", why: "subtract the reduction" },
        { do: "Apply Little's law again", result: "$L_{new}=0.5\\cdot48$", why: "arrival rate stays the same" },
        { do: "Simplify", result: "$L_{new}=24$ jobs", why: "half of 48 is 24" }
      ], answer: "The new average number in system is $24$ jobs." }
    ],
    applications: [
      { title: "Web request latency", background: "Backend services receive random request streams. Queueing models help engineers see why latency rises sharply as workers approach full utilization.", numbers: "With $\\lambda=90$/s and $\\mu=100$/s, $W=1/(100-90)=0.1$ s; at $\\lambda=95$/s, $W=0.2$ s." },
      { title: "GPU training clusters", background: "Shared GPU clusters queue jobs from many teams. Little's law connects dashboard counts to user-visible waiting.", numbers: "If $L=40$ jobs and arrivals are $2$ jobs/hour, average time in system is $W=40/2=20$ hours." },
      { title: "Call centers", background: "Queueing theory grew through telephone traffic engineering, where staffing must balance cost and waiting.", numbers: "A representative serving $12$ calls/hour with arrivals $9$ calls/hour has utilization $9/12=0.75$." },
      { title: "Disk and database queues", background: "Storage devices serialize many reads and writes. Queueing estimates help predict when adding workload hurts tail latency.", numbers: "If mean service is $2$ ms, then $\\mu=500$/s; with $\\lambda=400$/s, $\\rho=0.8$." },
      { title: "Network packet buffers", background: "Routers buffer packets when bursts exceed outgoing link capacity. Persistent overload grows queues and drops packets.", numbers: "If packets arrive at $1.2$ million/s but a link serves $1.0$ million/s, $\\lambda>\\mu$ and a stable $M/M/1$ steady state does not exist." },
      { title: "Batch inference", background: "ML inference systems often batch requests for efficiency, trading service speed against waiting for a batch to fill.", numbers: "If a batch of $8$ takes $40$ ms, average service capacity is $8/0.04=200$ requests/s before batching overheads." }
    ],
    applicationsClose: "Queueing theory teaches one practical kindness: leave spare capacity if you care about waiting time.",
    takeaways: [
      "$\\rho=\\lambda/\\mu$ measures utilization in an $M/M/1$ queue.",
      "The stable $M/M/1$ model requires $\\lambda<\\mu$.",
      "Little's law $L=\\lambda W$ connects average count, arrival rate, and time in system.",
      "Waiting grows quickly as utilization approaches one."
    ]
  },

  "math-23-13": {
    id: "math-23-13",
    title: "Inventory models",
    tagline: "Inventory models balance the comfort of having enough against the cost of holding too much.",
    connections: {
      buildsOn: ["optimization", "expected value", "rates and units"],
      leadsTo: ["Scheduling models", "Stochastic optimization", "Robust optimization"],
      usedWith: ["convex optimization", "queueing theory", "dynamic programming", "probability distributions"]
    },
    motivation:
      "<p>You already know the everyday tradeoff: buying too little means running out; buying too much means storage, waste, or money tied up. Inventory models give that tradeoff numbers.</p>" +
      "<p>In operations research, inventory can mean spare parts, products, compute buffers, cached features, or prepared training data. The model asks when to order, how much to order, and how much uncertainty to protect against.</p>",
    definition:
      "<p>The classic <b>economic order quantity</b> model assumes constant demand rate $D$, fixed ordering cost $K$ per order, and holding cost $h$ per unit per time. If each order has size $Q$, annual cost is $$C(Q)=\\dfrac{KD}{Q}+\\dfrac{hQ}{2}.$$ The first term is ordering cost, and the second is holding cost from average inventory $Q/2$.</p>" +
      "<p>Minimizing gives $Q^\\ast=\\sqrt{\\dfrac{2KD}{h}}$. This comes from setting ordering cost and holding cost in balance at the optimum: $KD/Q=hQ/2$, so $Q^2=2KD/h$.</p>" +
      "<p><b>Assumptions that matter:</b> EOQ assumes known steady demand, instant replenishment, no stockouts, fixed setup cost, and linear holding cost. Safety-stock and newsvendor models relax certainty by using demand distributions and service targets.</p>",
    worked: {
      problem: "A team uses $D=1200$ units per year. Each order costs $K=50$ dollars and holding costs $h=2$ dollars per unit per year. Find the EOQ and the annual ordering plus holding cost at that quantity.",
      skills: ["EOQ formula", "cost decomposition", "unit checking"],
      strategy: "The order size trades setup cost against holding cost — compute the balance point and then evaluate both costs.",
      steps: [
        { do: "Write the EOQ formula", result: "$Q^\\ast=\\sqrt{\\dfrac{2KD}{h}}$", why: "EOQ balances ordering and holding costs" },
        { do: "Substitute the numbers", result: "$Q^\\ast=\\sqrt{\\dfrac{2\\cdot50\\cdot1200}{2}}$", why: "use $K=50$, $D=1200$, $h=2$" },
        { do: "Simplify inside the root", result: "$\\dfrac{120000}{2}=60000$", why: "$2\\cdot50\\cdot1200=120000$" },
        { do: "Take the square root", result: "$Q^\\ast\\approx244.95$", why: "$\\sqrt{60000}\\approx244.95$" },
        { do: "Compute ordering cost", result: "$KD/Q\\approx50\\cdot1200/244.95\\approx244.95$", why: "orders per year times cost per order" },
        { do: "Compute holding cost", result: "$hQ/2\\approx2\\cdot244.95/2=244.95$", why: "average inventory is $Q/2$" },
        { do: "Add the two costs", result: "$244.95+244.95=489.90$", why: "total relevant annual cost is their sum" }
      ],
      verify: "At EOQ, ordering and holding costs match, and they do: both are about $244.95$ dollars.",
      answer: "The EOQ is about $245$ units, with annual ordering plus holding cost about $489.90$.",
      connects: "Inventory optimization often finds the point where two opposite costs are balanced."
    },
    practice: [
      { problem: "Compute EOQ for $D=800$, $K=25$, and $h=4$.", steps: [
        { do: "Write the formula", result: "$Q^\\ast=\\sqrt{2KD/h}$", why: "use the EOQ model" },
        { do: "Substitute values", result: "$Q^\\ast=\\sqrt{2\\cdot25\\cdot800/4}$", why: "insert demand, order cost, and holding cost" },
        { do: "Multiply the numerator", result: "$2\\cdot25\\cdot800=40000$", why: "compute the product" },
        { do: "Divide by holding cost", result: "$40000/4=10000$", why: "finish the expression inside the root" },
        { do: "Take the square root", result: "$Q^\\ast=100$", why: "$\\sqrt{10000}=100$" }
      ], answer: "The EOQ is $100$ units." },
      { problem: "For $D=1000$, $K=20$, $h=5$, and order size $Q=100$, compute annual ordering cost and holding cost.", steps: [
        { do: "Compute number of orders", result: "$D/Q=1000/100=10$", why: "orders per year equal demand divided by order size" },
        { do: "Compute ordering cost", result: "$10\\cdot20=200$", why: "each order costs 20 dollars" },
        { do: "Compute average inventory", result: "$Q/2=50$", why: "inventory falls linearly from $Q$ to 0" },
        { do: "Compute holding cost", result: "$5\\cdot50=250$", why: "holding cost per unit times average units" },
        { do: "Add relevant cost", result: "$200+250=450$", why: "total is ordering plus holding" }
      ], answer: "Ordering cost is $200$, holding cost is $250$, total $450$." },
      { problem: "A reorder point uses average demand $20$ units/day, lead time $4$ days, and safety stock $15$ units. Find the reorder point.", steps: [
        { do: "Compute lead-time demand", result: "$20\\cdot4=80$ units", why: "demand continues while waiting for replenishment" },
        { do: "Write reorder point formula", result: "$R=dL+SS$", why: "cover expected lead-time demand plus safety stock" },
        { do: "Substitute values", result: "$R=80+15$", why: "use lead-time demand and safety stock" },
        { do: "Add", result: "$R=95$", why: "combine expected demand and buffer" },
        { do: "Interpret", result: "order when inventory position reaches $95$ units", why: "that level should cover the wait" }
      ], answer: "The reorder point is $95$ units." },
      { problem: "A newsvendor item sells for $10$, costs $6$, and has salvage value $2$. Compute the critical fractile.", steps: [
        { do: "Compute underage cost", result: "$C_u=10-6=4$", why: "missing a sale loses margin" },
        { do: "Compute overage cost", result: "$C_o=6-2=4$", why: "leftover item loses cost minus salvage" },
        { do: "Write critical fractile", result: "$\\dfrac{C_u}{C_u+C_o}$", why: "newsvendor balances shortage and leftover risk" },
        { do: "Substitute costs", result: "$\\dfrac{4}{4+4}$", why: "use computed underage and overage costs" },
        { do: "Simplify", result: "$0.5$", why: "equal costs target the median demand" }
      ], answer: "The critical fractile is $0.5$." },
      { problem: "A feature store cache holds feature vectors. Reloading costs $K=4$ seconds per batch, demand is $D=20000$ vectors/day, and holding stale-cache risk is $h=0.0008$ seconds per vector per day. Find the EOQ batch size.", steps: [
        { do: "Write EOQ", result: "$Q^\\ast=\\sqrt{2KD/h}$", why: "batch reloads have setup and holding-like costs" },
        { do: "Substitute values", result: "$Q^\\ast=\\sqrt{2\\cdot4\\cdot20000/0.0008}$", why: "use seconds as the cost unit" },
        { do: "Multiply numerator", result: "$2\\cdot4\\cdot20000=160000$", why: "compute setup-demand product" },
        { do: "Divide by $h$", result: "$160000/0.0008=200000000$", why: "small holding risk favors larger batches" },
        { do: "Take the square root", result: "$Q^\\ast\\approx14142$", why: "$\\sqrt{200000000}\\approx14142$" }
      ], answer: "The EOQ-style reload batch is about $14{,}142$ feature vectors." }
    ],
    applications: [
      { title: "Retail replenishment", background: "Inventory theory was shaped by retail and manufacturing, where ordering too often and storing too much both cost money.", numbers: "With $D=5000$, $K=40$, $h=2$, EOQ is $\\sqrt{2\\cdot40\\cdot5000/2}=447.2$ units." },
      { title: "Spare parts", background: "Factories keep spare parts because downtime is expensive, but rarely used parts tie up capital.", numbers: "If lead-time demand is $3$ parts and safety stock is $2$, reorder point is $5$ parts." },
      { title: "Cloud capacity buffers", background: "Compute platforms keep spare instances or warm containers to absorb demand spikes. The buffer is inventory in compute form.", numbers: "If expected startup demand during a 5-minute lead time is $12$ instances and safety stock is $4$, keep $16$ warm slots." },
      { title: "Feature caches", background: "ML systems cache features to reduce repeated computation. Larger caches save reload cost but risk staleness or memory pressure.", numbers: "If cache miss cost is $30$ ms and $1000$ misses are avoided, saved time is $30{,}000$ ms or $30$ seconds." },
      { title: "Newsvendor for one-day inventory", background: "The newsvendor model was named for newspapers: unsold copies lose value after the day ends. The same idea applies to perishables and short-lived compute reservations.", numbers: "If underage cost is $8$ and overage cost is $2$, target demand quantile is $8/(8+2)=0.8$." },
      { title: "Training data staging", background: "Large training jobs often stage data shards near accelerators. Too few shards stall GPUs; too many consume expensive local storage.", numbers: "If a GPU job consumes $50$ GB/hour and refill lead time is $0.5$ hour, expected lead-time demand is $25$ GB before safety stock." }
    ],
    applicationsClose: "Inventory thinking is buffer thinking: order, store, cache, or stage just enough for the uncertainty and cost you face.",
    takeaways: [
      "EOQ balances fixed ordering cost against linear holding cost.",
      "The EOQ formula is $Q^\\ast=\\sqrt{2KD/h}$ under steady deterministic assumptions.",
      "Reorder points cover lead-time demand plus safety stock.",
      "Newsvendor models choose a demand quantile by comparing underage and overage costs."
    ]
  },

  "math-23-14": {
    id: "math-23-14",
    title: "Scheduling models",
    tagline: "Scheduling models turn time, machines, and precedence into a plan you can test before the work begins.",
    connections: {
      buildsOn: ["optimization", "graphs", "integer variables"],
      leadsTo: ["Stochastic optimization", "Robust optimization", "Resource allocation & scheduling in ML systems"],
      usedWith: ["network flow models", "dynamic programming", "integer programming", "queueing theory"]
    },
    motivation:
      "<p>You already schedule small things by instinct: do the urgent task first, wait for prerequisites, avoid double-booking yourself. Operations research asks how to do that when there are many jobs, machines, due dates, and costs.</p>" +
      "<p>A scheduling model makes time explicit. It can minimize completion time, lateness, weighted delay, or resource conflicts. The core habit is to translate the calendar into variables and constraints.</p>",
    definition:
      "<p>A <b>scheduling model</b> assigns jobs to time and resources. In a single-machine problem, job $j$ has processing time $p_j$, completion time $C_j$, due date $d_j$, and lateness $L_j=C_j-d_j$. A common objective is to minimize makespan $C_{\\max}=\\max_j C_j$ or total weighted completion $\\sum_j w_j C_j$.</p>" +
      "<p>Precedence constraints say one job must finish before another starts, for example $S_b\\ge S_a+p_a$. Non-overlap constraints say two jobs on the same machine cannot run at the same time; integer or disjunctive variables often choose which one goes first.</p>" +
      "<p><b>Assumptions that matter:</b> processing times may be deterministic or uncertain; machines may be identical, unrelated, or specialized; preemption may or may not be allowed; and setup times, release dates, and due dates must be included if they affect feasibility.</p>",
    worked: {
      problem: "Three jobs run on one machine. Processing times are $p_A=3$, $p_B=2$, $p_C=4$. Due dates are $d_A=5$, $d_B=4$, $d_C=9$. Schedule by earliest due date and compute completion times and maximum lateness.",
      skills: ["single-machine scheduling", "completion times", "lateness"],
      strategy: "The sequence determines every completion time — sort by due date, then accumulate processing times.",
      steps: [
        { do: "Order jobs by due date", result: "$B,A,C$", why: "$4<5<9$" },
        { do: "Compute completion of $B$", result: "$C_B=2$", why: "$B$ runs first for 2 time units" },
        { do: "Compute completion of $A$", result: "$C_A=2+3=5$", why: "$A$ starts after $B$" },
        { do: "Compute completion of $C$", result: "$C_C=5+4=9$", why: "$C$ starts after $A$" },
        { do: "Compute lateness of $B$", result: "$L_B=2-4=-2$", why: "completion minus due date" },
        { do: "Compute lateness of $A$", result: "$L_A=5-5=0$", why: "it finishes exactly on time" },
        { do: "Compute lateness of $C$", result: "$L_C=9-9=0$", why: "it also finishes on time" },
        { do: "Take maximum lateness", result: "$L_{\\max}=0$", why: "the largest of $-2,0,0$ is 0" }
      ],
      verify: "The machine is never idle, total processing time is $9$, and the last completion is $9$, matching the accumulated schedule.",
      answer: "The EDD schedule is $B,A,C$ with completion times $2,5,9$ and maximum lateness $0$.",
      connects: "A schedule is a sequence plus arithmetic that checks time promises."
    },
    practice: [
      { problem: "Jobs $X,Y,Z$ have processing times $4,1,3$ on one machine. In order $Y,Z,X$, compute completion times and makespan.", steps: [
        { do: "Compute $C_Y$", result: "$1$", why: "$Y$ runs first for 1 unit" },
        { do: "Compute $C_Z$", result: "$1+3=4$", why: "$Z$ starts after $Y$" },
        { do: "Compute $C_X$", result: "$4+4=8$", why: "$X$ starts after $Z$" },
        { do: "Identify makespan", result: "$C_{\\max}=8$", why: "makespan is the final completion time" },
        { do: "Check total processing", result: "$1+3+4=8$", why: "no idle time means makespan equals total processing" }
      ], answer: "Completion times are $C_Y=1$, $C_Z=4$, $C_X=8$; makespan is $8$." },
      { problem: "Jobs $A,B,C$ have processing times $6,2,5$ and weights $1,4,2$. Use shortest weighted processing ratio $p_j/w_j$ to order them.", steps: [
        { do: "Compute ratio for $A$", result: "$6/1=6$", why: "processing time divided by weight" },
        { do: "Compute ratio for $B$", result: "$2/4=0.5$", why: "high weight and short time make it urgent" },
        { do: "Compute ratio for $C$", result: "$5/2=2.5$", why: "apply the same rule" },
        { do: "Sort ratios", result: "$0.5<2.5<6$", why: "smallest ratio comes first" },
        { do: "Write order", result: "$B,C,A$", why: "match jobs to sorted ratios" }
      ], answer: "The ratio rule orders the jobs as $B,C,A$." },
      { problem: "Task $B$ depends on task $A$. If $S_A=2$, $p_A=5$, and $p_B=3$, find the earliest feasible start and finish for $B$.", steps: [
        { do: "Compute finish of $A$", result: "$2+5=7$", why: "start plus processing time" },
        { do: "Write precedence constraint", result: "$S_B\\ge S_A+p_A$", why: "$B$ cannot start before $A$ finishes" },
        { do: "Substitute values", result: "$S_B\\ge7$", why: "use the finish time of $A$" },
        { do: "Choose earliest start", result: "$S_B=7$", why: "earliest feasible start meets the bound exactly" },
        { do: "Compute finish of $B$", result: "$C_B=7+3=10$", why: "add $B$'s processing time" }
      ], answer: "$B$ can start at $7$ and finish at $10$." },
      { problem: "Two identical machines process jobs with times $5,4,3,2$. Assign by list scheduling in that order. Find the loads and makespan.", steps: [
        { do: "Assign job 5", result: "machine 1 load $5$, machine 2 load $0$", why: "start with an empty machine" },
        { do: "Assign job 4", result: "loads $5$ and $4$", why: "put it on the least-loaded machine" },
        { do: "Assign job 3", result: "loads $5$ and $7$", why: "machine 2 had load 4 before assignment" },
        { do: "Assign job 2", result: "loads $7$ and $7$", why: "machine 1 had the smaller load 5" },
        { do: "Compute makespan", result: "$7$", why: "makespan is the maximum machine load" }
      ], answer: "The final loads are $7$ and $7$, so makespan is $7$." },
      { problem: "An ML batch pipeline has preprocess $4$ minutes, train $15$ minutes, evaluate $3$ minutes, with train depending on preprocess and evaluate depending on train. A reporting task takes $5$ minutes and can run anytime. With one machine, schedule by dependency order preprocess, train, evaluate, report and compute makespan.", steps: [
        { do: "Schedule preprocess", result: "$0$ to $4$", why: "it has no prerequisite" },
        { do: "Schedule train", result: "$4$ to $19$", why: "training waits for preprocess" },
        { do: "Schedule evaluate", result: "$19$ to $22$", why: "evaluation waits for training" },
        { do: "Schedule report", result: "$22$ to $27$", why: "the chosen order places it last" },
        { do: "Compute makespan", result: "$27$ minutes", why: "the last job finishes at 27" },
        { do: "Check total processing", result: "$4+15+3+5=27$", why: "one machine with no idle time" }
      ], answer: "The schedule finishes in $27$ minutes." }
    ],
    applications: [
      { title: "Manufacturing jobs", background: "Scheduling theory grew from factories where machines, setup times, and due dates determine delivery performance.", numbers: "If jobs take $2$, $5$, and $1$ hours with no idle time, any one-machine sequence has makespan $8$ hours." },
      { title: "Operating systems", background: "CPU schedulers decide which process runs next. Short jobs first can reduce average completion time when job lengths are known.", numbers: "For jobs $1$ and $9$, order $1,9$ gives average completion $(1+10)/2=5.5$; order $9,1$ gives $(9+10)/2=9.5$." },
      { title: "Project management", background: "Critical path scheduling models dependencies in construction, launches, and engineering projects.", numbers: "If path A takes $3+4=7$ days and path B takes $2+6=8$ days, the project cannot finish before $8$ days." },
      { title: "Cloud batch jobs", background: "Data platforms schedule ETL and training jobs onto shared workers with memory and time constraints.", numbers: "Two jobs needing $6$ GB and $10$ GB cannot share a $12$ GB machine, but jobs needing $6$ GB and $4$ GB can." },
      { title: "Model evaluation queues", background: "ML teams often run many evaluations after training. Scheduling determines how quickly metrics arrive.", numbers: "If three evals take $8$, $3$, and $5$ minutes on one runner, shortest-processing-time order gives completion times $3$, $8$, and $16$." },
      { title: "Real-time systems", background: "Robotics and embedded systems schedule tasks with deadlines. Missing a deadline can mean unsafe or stale control.", numbers: "A sensor task taking $4$ ms every $20$ ms uses utilization $4/20=0.2$ of one CPU core." }
    ],
    applicationsClose: "Scheduling is time accounting with consequences: the same constraints shape factories, CPUs, projects, and ML pipelines.",
    takeaways: [
      "Processing times and sequences determine completion times.",
      "Precedence constraints enforce required order between tasks.",
      "Objectives include makespan, lateness, and weighted completion time.",
      "Resource limits turn scheduling into a constrained optimization problem."
    ]
  },

  "math-23-15": {
    id: "math-23-15",
    title: "Stochastic optimization",
    tagline: "Stochastic optimization chooses decisions that perform well before uncertainty reveals itself.",
    connections: {
      buildsOn: ["expected value", "optimization", "probability distributions"],
      leadsTo: ["Robust optimization", "Resource allocation & scheduling in ML systems"],
      usedWith: ["inventory models", "dynamic programming", "convex optimization", "Monte Carlo methods"]
    },
    motivation:
      "<p>You often make decisions before the world finishes telling you the facts: order inventory before demand arrives, reserve compute before traffic spikes, choose a route before travel time is known. Stochastic optimization is the mathematics of that honest uncertainty.</p>" +
      "<p>The central move is to optimize an expectation, a risk measure, or a scenario average. Instead of pretending the future is one number, we let several futures speak and choose a decision that behaves well across them.</p>",
    definition:
      "<p>A <b>stochastic optimization</b> problem chooses decision $x$ when some data $\\xi$ is random. A simple form is $$\\min_{x\\in X}\\; \\mathbb{E}_{\\xi}[f(x,\\xi)],$$ where $X$ is the feasible set and $f(x,\\xi)$ is the cost after uncertainty $\\xi$ is realized.</p>" +
      "<p>With sampled scenarios $\\xi_1,\\ldots,\\xi_N$, the sample-average approximation is $$\\min_{x\\in X}\\; \\dfrac1N\\sum_{i=1}^N f(x,\\xi_i).$$ This replaces the expectation by an average of observed or simulated futures.</p>" +
      "<p><b>Assumptions that matter:</b> the probability model or scenarios should represent future uncertainty; averages need enough samples to be stable; decisions may be one-stage or have recourse after uncertainty; and optimizing expected cost can hide tail risk unless risk terms are included.</p>",
    worked: {
      problem: "Choose capacity $x$ for a service. Capacity costs $2x$. Demand scenarios are $6$, $10$, and $14$, equally likely. Unserved demand costs $5$ per unit, so scenario cost is $2x+5\\max(0,D-x)$. Compare $x=8$ and $x=12$.",
      skills: ["scenario averages", "recourse cost", "expected value"],
      strategy: "The fixed capacity cost is clear — compute shortage cost in each scenario and average.",
      steps: [
        { do: "Compute fixed cost for $x=8$", result: "$2\\cdot8=16$", why: "capacity cost is paid in every scenario" },
        { do: "Compute shortages for $x=8$", result: "$0,2,6$", why: "use $\\max(0,D-8)$ for demands $6,10,14$" },
        { do: "Compute scenario costs for $x=8$", result: "$16,26,46$", why: "add $5$ times each shortage" },
        { do: "Average costs for $x=8$", result: "$(16+26+46)/3=88/3\\approx29.33$", why: "scenarios are equally likely" },
        { do: "Compute fixed cost for $x=12$", result: "$2\\cdot12=24$", why: "higher capacity costs more" },
        { do: "Compute shortages for $x=12$", result: "$0,0,2$", why: "only demand 14 exceeds capacity" },
        { do: "Compute scenario costs for $x=12$", result: "$24,24,34$", why: "add shortage penalties" },
        { do: "Average costs for $x=12$", result: "$(24+24+34)/3=82/3\\approx27.33$", why: "take the scenario mean" }
      ],
      verify: "Although $x=12$ has higher fixed cost, it avoids enough shortage penalty to lower expected cost.",
      answer: "$x=12$ is better among the two, with expected cost about $27.33$ versus $29.33$.",
      connects: "Stochastic optimization measures a decision by its average performance across possible futures."
    },
    practice: [
      { problem: "A decision has scenario costs $10$, $14$, and $22$ with probabilities $0.2$, $0.5$, and $0.3$. Compute expected cost.", steps: [
        { do: "Multiply first cost by probability", result: "$0.2\\cdot10=2$", why: "expected value weights each outcome" },
        { do: "Multiply second cost by probability", result: "$0.5\\cdot14=7$", why: "use the second probability" },
        { do: "Multiply third cost by probability", result: "$0.3\\cdot22=6.6$", why: "use the third probability" },
        { do: "Add weighted costs", result: "$2+7+6.6=15.6$", why: "expected cost is the sum" },
        { do: "Attach units", result: "$15.6$ cost units", why: "the input values were costs" }
      ], answer: "The expected cost is $15.6$." },
      { problem: "Compare two capacity choices. Choice A has costs $8$, $12$, $30$ across equally likely scenarios. Choice B has costs $15$, $16$, $17$. Which has lower expected cost?", steps: [
        { do: "Average choice A", result: "$(8+12+30)/3=50/3\\approx16.67$", why: "scenarios are equally likely" },
        { do: "Average choice B", result: "$(15+16+17)/3=48/3=16$", why: "use the same averaging rule" },
        { do: "Compare averages", result: "$16<16.67$", why: "lower expected cost is preferred" },
        { do: "Identify tail behavior", result: "A has a worst cost of $30$", why: "A is riskier even before comparing means" },
        { do: "Choose by expectation", result: "choice B", why: "B has the lower average cost" }
      ], answer: "Choice B has lower expected cost." },
      { problem: "A sample-average objective for $x=2$ has losses $(x-1)^2$, $(x-3)^2$, and $(x-4)^2$ on three scenarios. Compute the objective value.", steps: [
        { do: "Evaluate first loss", result: "$(2-1)^2=1$", why: "substitute $x=2$" },
        { do: "Evaluate second loss", result: "$(2-3)^2=1$", why: "use the second scenario" },
        { do: "Evaluate third loss", result: "$(2-4)^2=4$", why: "use the third scenario" },
        { do: "Add losses", result: "$1+1+4=6$", why: "sample average sums scenario losses" },
        { do: "Divide by number of scenarios", result: "$6/3=2$", why: "there are three samples" }
      ], answer: "The sample-average objective value is $2$." },
      { problem: "A two-stage shipping plan sends $x=5$ units before demand. If demand is $4$ or $8$ equally likely, extra emergency shipping costs $7$ per missing unit. Regular shipping costs $3x$. Find expected total cost.", steps: [
        { do: "Compute regular cost", result: "$3\\cdot5=15$", why: "regular shipment is chosen before demand" },
        { do: "Compute shortage for demand 4", result: "$\\max(0,4-5)=0$", why: "shipment covers demand" },
        { do: "Compute shortage for demand 8", result: "$\\max(0,8-5)=3$", why: "three units are missing" },
        { do: "Compute emergency cost in high demand", result: "$7\\cdot3=21$", why: "pay per missing unit" },
        { do: "Compute expected emergency cost", result: "$(0+21)/2=10.5$", why: "demands are equally likely" },
        { do: "Add regular cost", result: "$15+10.5=25.5$", why: "total expected cost includes both stages" }
      ], answer: "The expected total cost is $25.5$." },
      { problem: "Mini-batch SGD estimates a gradient from samples $4$, $7$, $9$, and $12$. Compute the sample-average gradient and one update from $w=10$ with learning rate $0.1$.", steps: [
        { do: "Add sample gradients", result: "$4+7+9+12=32$", why: "mini-batch gradient sums sample contributions" },
        { do: "Divide by batch size", result: "$32/4=8$", why: "the sample average estimates expected gradient" },
        { do: "Write gradient descent update", result: "$w_{new}=w-\\eta g$", why: "move opposite the gradient" },
        { do: "Substitute values", result: "$w_{new}=10-0.1\\cdot8$", why: "use $w=10$, $\\eta=0.1$, $g=8$" },
        { do: "Simplify", result: "$w_{new}=9.2$", why: "$10-0.8=9.2$" }
      ], answer: "The average gradient is $8$, and the updated parameter is $9.2$." }
    ],
    applications: [
      { title: "Capacity planning under demand uncertainty", background: "Services reserve capacity before the next traffic spike is known. Stochastic optimization uses demand scenarios instead of one forecast.", numbers: "For demand costs $20$, $30$, and $70$ with probabilities $0.5$, $0.3$, $0.2$, expected cost is $10+9+14=33$." },
      { title: "Newsvendor inventory", background: "The newsvendor model is a one-stage stochastic optimization problem: order before demand, then pay for leftovers or shortages.", numbers: "If demand scenarios $80$ and $120$ are equally likely and order $100$, expected leftover/shortage magnitude is $(20+20)/2=20$." },
      { title: "Portfolio optimization", background: "Finance uses stochastic models because returns are uncertain. Decisions trade expected return against risk.", numbers: "A portfolio returning $5\\%$ with probability $0.7$ and $-4\\%$ with probability $0.3$ has expected return $0.7\\cdot5-0.3\\cdot4=2.3\\%$." },
      { title: "Stochastic gradient descent", background: "Modern ML training uses random mini-batches to approximate the full expected loss gradient cheaply.", numbers: "Gradients $1.2$, $0.8$, and $1.0$ average to $1.0$, so with learning rate $0.05$ the parameter step is $0.05$." },
      { title: "A/B experiment allocation", background: "Traffic allocation decisions are uncertain because measured conversion rates vary. Scenario averages help compare policies.", numbers: "If revenue lift is $1000$, $2000$, or $-500$ dollars equally likely, expected lift is $(1000+2000-500)/3=833.33$." },
      { title: "Energy scheduling", background: "Power systems schedule generation before exact renewable output is known, then adjust with recourse.", numbers: "If shortfall is $0$, $5$, or $10$ MWh with equal probability and penalty $30$/MWh, expected penalty is $30\\cdot5=150$ dollars." }
    ],
    applicationsClose: "Stochastic optimization is how we make one decision while respectfully listening to many possible futures.",
    takeaways: [
      "Stochastic optimization minimizes expected cost or another risk-aware summary over random data.",
      "Scenario averages approximate expectations with samples.",
      "Recourse decisions happen after uncertainty is observed.",
      "Expected value is useful, but tail risk may need its own constraint or penalty."
    ]
  },

  "math-23-16": {
    id: "math-23-16",
    title: "Robust optimization",
    tagline: "Robust optimization protects a decision against the uncertainty you refuse to average away.",
    connections: {
      buildsOn: ["optimization", "inequalities", "sets"],
      leadsTo: ["Resource allocation & scheduling in ML systems", "regularization", "safe decision making"],
      usedWith: ["stochastic optimization", "linear programming", "convex optimization", "duality"]
    },
    motivation:
      "<p>Sometimes an average is not enough. If a bridge, service-level objective, or safety-critical model fails in a bad scenario, the fact that it performed well on average may not comfort anyone.</p>" +
      "<p>Robust optimization asks for decisions that stay feasible or good across a specified uncertainty set. It is a cautious cousin of stochastic optimization: instead of probabilities, it focuses on what could happen within declared bounds.</p>",
    definition:
      "<p>A <b>robust optimization</b> problem chooses $x$ to perform well for all uncertain parameters $u$ in an uncertainty set $\\mathcal{U}$. A common form is $$\\min_{x\\in X}\\; \\max_{u\\in\\mathcal{U}} f(x,u),$$ or a robust constraint $g(x,u)\\le0$ for every $u\\in\\mathcal{U}$.</p>" +
      "<p>For a linear constraint with uncertain coefficient $a\\in[\\bar a-\\delta,\\bar a+\\delta]$ and nonnegative $x$, requiring $ax\\le b$ for all $a$ means $(\\bar a+\\delta)x\\le b$. The worst allowed coefficient is the one that makes the constraint hardest to satisfy.</p>" +
      "<p><b>Assumptions that matter:</b> the uncertainty set must be credible; robust protection can be conservative; constraints must hold for every allowed uncertainty value; and correlations or budgets of uncertainty should be modeled when not all worst cases can happen together.</p>",
    worked: {
      problem: "A service chooses load $x\\ge0$. Actual CPU per request is uncertain in $[1.8,2.2]$ ms, and total CPU budget is $110$ ms. Find the largest robustly feasible $x$ satisfying $a x\\le110$ for all $a\\in[1.8,2.2]$.",
      skills: ["uncertainty sets", "worst-case constraints", "inequalities"],
      strategy: "The hardest coefficient is the largest CPU cost — enforce the constraint there.",
      steps: [
        { do: "Identify the uncertain coefficient", result: "$a\\in[1.8,2.2]$", why: "CPU per request is uncertain" },
        { do: "Choose the worst coefficient", result: "$a=2.2$", why: "larger $a$ uses more CPU for the same $x$" },
        { do: "Write the robust constraint", result: "$2.2x\\le110$", why: "satisfying the worst case satisfies all smaller cases" },
        { do: "Divide by $2.2$", result: "$x\\le50$", why: "$110/2.2=50$" },
        { do: "Select largest feasible load", result: "$x=50$", why: "the question asks for the largest robust value" }
      ],
      verify: "At $a=2.2$, CPU use is $2.2\\cdot50=110$ ms; at $a=1.8$, use is only $90$ ms, so the whole interval is safe.",
      answer: "The largest robustly feasible load is $x=50$ requests.",
      connects: "Robust constraints replace uncertain coefficients with their constraint-hardening worst cases."
    },
    practice: [
      { problem: "Demand may be anywhere from $90$ to $120$ units. You need inventory $x$ to cover all demand in this interval. Find the smallest robust $x$.", steps: [
        { do: "Write the requirement", result: "$x\\ge D$ for all $D\\in[90,120]$", why: "inventory must cover every allowed demand" },
        { do: "Identify worst demand", result: "$D=120$", why: "larger demand is harder to cover" },
        { do: "Enforce the worst case", result: "$x\\ge120$", why: "this implies coverage for smaller demand" },
        { do: "Choose smallest feasible inventory", result: "$x=120$", why: "any lower value fails when demand is 120" },
        { do: "Check low demand", result: "$120\\ge90$", why: "the chosen inventory also covers the lower endpoint" }
      ], answer: "The smallest robust inventory is $120$ units." },
      { problem: "A constraint is $(3+u)x\\le40$ for every $u\\in[-0.5,0.5]$ and $x\\ge0$. Find the largest feasible $x$.", steps: [
        { do: "Find coefficient range", result: "$3+u\\in[2.5,3.5]$", why: "add 3 to the uncertainty interval" },
        { do: "Choose worst coefficient", result: "$3.5$", why: "larger coefficient tightens an upper-bound constraint" },
        { do: "Write robust inequality", result: "$3.5x\\le40$", why: "enforce all allowed coefficients" },
        { do: "Divide by $3.5$", result: "$x\\le11.428\\ldots$", why: "solve the inequality" },
        { do: "State largest feasible value", result: "$x\\approx11.43$", why: "round the upper bound" }
      ], answer: "The largest robustly feasible $x$ is about $11.43$." },
      { problem: "Compare two decisions by worst-case cost. Decision A costs $8$, $12$, $25$ across scenarios. Decision B costs $15$, $16$, $18$. Which is robustly better under minimax cost?", steps: [
        { do: "Find worst cost for A", result: "$\\max\\{8,12,25\\}=25$", why: "minimax looks at the largest cost" },
        { do: "Find worst cost for B", result: "$\\max\\{15,16,18\\}=18$", why: "same rule for B" },
        { do: "Compare worst costs", result: "$18<25$", why: "lower worst-case cost is preferred" },
        { do: "Choose robust decision", result: "B", why: "B protects better in the worst scenario" },
        { do: "Notice the tradeoff", result: "A has lower best-case cost", why: "robustness may sacrifice upside" }
      ], answer: "Decision B is robustly better by minimax cost." },
      { problem: "A portfolio return is $r x$ with $r\\in[0.02,0.08]$ and investment $x=1000$. Find the worst-case return and best-case return.", steps: [
        { do: "Identify the smallest return rate", result: "$0.02$", why: "worst case for return maximization is the lower endpoint" },
        { do: "Compute worst-case return", result: "$0.02\\cdot1000=20$", why: "return equals rate times investment" },
        { do: "Identify the largest return rate", result: "$0.08$", why: "best case is the upper endpoint" },
        { do: "Compute best-case return", result: "$0.08\\cdot1000=80$", why: "multiply by the investment" },
        { do: "State interval", result: "return lies in $[20,80]$", why: "the rate can vary across its interval" }
      ], answer: "Worst-case return is $20$ and best-case return is $80$." },
      { problem: "A classifier threshold must keep false positive rate below $0.10$. Estimated FPR is $0.08$ with uncertainty $\\pm0.03$. Is it robustly feasible?", steps: [
        { do: "Write uncertainty interval", result: "$[0.08-0.03,0.08+0.03]=[0.05,0.11]$", why: "apply the error bound" },
        { do: "Identify worst FPR", result: "$0.11$", why: "higher FPR is worse for the constraint" },
        { do: "Compare to limit", result: "$0.11>0.10$", why: "the worst case exceeds the requirement" },
        { do: "Assess robust feasibility", result: "not robustly feasible", why: "the constraint must hold for every allowed value" },
        { do: "Find needed nominal upper bound", result: "$0.10-0.03=0.07$", why: "with the same uncertainty, nominal FPR must be at most 0.07" }
      ], answer: "No. The worst-case FPR is $0.11$, so the threshold is not robustly feasible." }
    ],
    applications: [
      { title: "Service-level protection", background: "Online systems often need guarantees even when latency estimates are imperfect. Robust constraints reserve capacity for high-load cases.", numbers: "If load estimate is $900\\pm100$ requests/s, a robust plan for all cases must handle $1000$ requests/s." },
      { title: "Supply uncertainty", background: "Manufacturing plans can fail if supplier quantities are lower than promised. Robust optimization protects against bounded shortfalls.", numbers: "If supply is $500\\pm40$, guaranteed supply is $460$ units, not the nominal $500$." },
      { title: "Adversarial ML", background: "Robust ML asks models to perform under bounded input perturbations, a cousin of robust optimization.", numbers: "For pixel perturbation $\\|\\delta\\|_\\infty\\le0.03$, each normalized pixel may shift by at most $0.03$." },
      { title: "Portfolio worst-case risk", background: "Investors may protect against return uncertainty without trusting a full probability distribution.", numbers: "If return lies in $[-5\\%,4\\%]$, a $10000$ dollar investment has worst-case change $-500$ dollars." },
      { title: "Robust regression", background: "Regression with uncertainty or outlier protection often minimizes a worst-case residual or a loss less sensitive to extremes.", numbers: "If prediction error is $2\\pm0.5$, worst absolute error over the interval is $2.5$." },
      { title: "Robust scheduling", background: "Task durations are rarely exact. Robust schedules include buffers so dependencies remain feasible when jobs run long.", numbers: "If a task is estimated at $10\\pm2$ minutes, scheduling its successor at minute $12$ protects the whole interval." }
    ],
    applicationsClose: "Robust optimization is a disciplined way to ask, before choosing, whether the plan still works when the allowed facts turn against it.",
    takeaways: [
      "Robust optimization protects against all uncertainty values in a specified set.",
      "Worst-case constraints often replace uncertain quantities by the endpoint that makes feasibility hardest.",
      "Robustness can be conservative when the uncertainty set is too large.",
      "Service levels, safety, adversarial ML, and buffered schedules all use robust thinking."
    ]
  },

  "math-23-17": {
    id: "math-23-17",
    title: "Resource allocation & scheduling in ML systems",
    tagline: "ML systems run better when GPUs, data, queues, and deadlines are treated as one optimization problem.",
    connections: {
      buildsOn: ["Network flow models", "Queueing theory", "Scheduling models", "Stochastic optimization", "Robust optimization"],
      leadsTo: ["large-scale training systems", "inference serving", "platform optimization"],
      usedWith: ["linear programming", "dynamic programming", "integer programming", "convex optimization"]
    },
    motivation:
      "<p>You have now seen flows, queues, inventory buffers, schedules, and uncertainty. An ML platform uses all of them at once. Training jobs need GPUs; inference requests need latency; feature pipelines need freshness; data loaders must not starve accelerators.</p>" +
      "<p>The capstone idea is to stop treating these as separate fires. Resource allocation and scheduling models let us make tradeoffs explicit: which jobs run now, how many GPUs they receive, what throughput is feasible, and how much buffer protects the service-level target.</p>",
    definition:
      "<p>An ML resource allocation model chooses variables such as GPU assignment $g_j$, start time $S_j$, throughput $x_e$ on data edges, and replicas $r_k$ for services. Objectives might minimize makespan, cost, lateness, or expected penalty: $$\\min\\; \\sum_j c_j g_j + \\sum_j w_j T_j + \\sum_k p_k\\max(0,\\ell_k-\\ell_k^{\\max}).$$</p>" +
      "<p>The constraints combine earlier lessons: capacity constraints limit GPUs or network flow; precedence constraints enforce pipeline order; queueing constraints keep utilization below a target; stochastic or robust terms protect against uncertain traffic and job durations.</p>" +
      "<p><b>Assumptions that matter:</b> resource units must match reality; speedups may not be linear in GPUs; queueing approximations need stable arrivals and service; priorities must be encoded deliberately; and robust or stochastic buffers should reflect measured variability rather than wishful thinking.</p>",
    worked: {
      problem: "Two ML training jobs share $8$ GPUs for one hour. Job A gains $120$ training examples per second per GPU up to $4$ GPUs. Job B gains $90$ examples per second per GPU up to $6$ GPUs. Each job must get at least $2$ GPUs. Allocate integer GPUs to maximize total throughput.",
      skills: ["resource constraints", "integer allocation", "throughput objective"],
      strategy: "The scarce resource is GPUs — satisfy minimums, then assign remaining GPUs to the larger marginal throughput until a cap binds.",
      steps: [
        { do: "Assign minimum GPUs", result: "$g_A=2$, $g_B=2$", why: "each job must receive at least 2 GPUs" },
        { do: "Count used GPUs", result: "$2+2=4$", why: "track the shared capacity" },
        { do: "Compute remaining GPUs", result: "$8-4=4$", why: "total capacity is 8" },
        { do: "Compare marginal throughputs", result: "$120>90$", why: "A gives more examples per second per extra GPU" },
        { do: "Add GPUs to A until its cap", result: "$g_A=4$", why: "A can use at most 4 GPUs, so it receives 2 more" },
        { do: "Update remaining GPUs", result: "$4-2=2$", why: "two extra GPUs were assigned to A" },
        { do: "Assign remaining GPUs to B", result: "$g_B=4$", why: "B can use up to 6 GPUs" },
        { do: "Compute A throughput", result: "$4\\cdot120=480$ examples/s", why: "A has 4 GPUs" },
        { do: "Compute B throughput", result: "$4\\cdot90=360$ examples/s", why: "B has 4 GPUs" },
        { do: "Add total throughput", result: "$480+360=840$ examples/s", why: "objective sums job throughput" }
      ],
      verify: "All 8 GPUs are used, each job receives at least 2 GPUs, and A is filled to its higher-value cap before B gets the remaining GPUs.",
      answer: "Allocate $4$ GPUs to A and $4$ GPUs to B for total throughput $840$ examples per second.",
      connects: "ML scheduling turns marginal value, caps, and fairness requirements into a concrete allocation."
    },
    practice: [
      { problem: "An inference service has arrival rate $\\lambda=70$ requests/s. Each replica serves $25$ requests/s. Choose the smallest number of replicas so utilization per replica is at most $0.7$.", steps: [
        { do: "Write utilization per replica", result: "$\\rho=\\lambda/(r\\mu)$", why: "total service rate is replicas times service per replica" },
        { do: "Impose target", result: "$70/(25r)\\le0.7$", why: "utilization must be at most 0.7" },
        { do: "Multiply by $25r$", result: "$70\\le17.5r$", why: "isolate the replica count" },
        { do: "Divide by $17.5$", result: "$r\\ge4$", why: "$70/17.5=4$" },
        { do: "Choose integer replicas", result: "$r=4$", why: "replicas must be whole units" }
      ], answer: "Use at least $4$ replicas." },
      { problem: "A feature pipeline has stages with throughputs $5000$, $4200$, and $4800$ rows/s. What is the end-to-end throughput, and which stage is the bottleneck?", steps: [
        { do: "List stage throughputs", result: "$5000$, $4200$, $4800$ rows/s", why: "pipeline throughput is limited by stages" },
        { do: "Take the minimum", result: "$4200$ rows/s", why: "the slowest stage caps the whole pipeline" },
        { do: "Identify the stage", result: "stage 2", why: "4200 is the smallest throughput" },
        { do: "Check upstream capacity", result: "$5000>4200$", why: "stage 1 can feed faster than stage 2 consumes" },
        { do: "Check downstream capacity", result: "$4800>4200$", why: "stage 3 is not the bottleneck" }
      ], answer: "End-to-end throughput is $4200$ rows/s, bottlenecked by stage 2." },
      { problem: "Three training jobs have processing times $30$, $10$, and $20$ minutes on one GPU. Use shortest-processing-time order and compute average completion time.", steps: [
        { do: "Order by processing time", result: "$10,20,30$", why: "shortest jobs first" },
        { do: "Compute first completion", result: "$10$", why: "the first job runs for 10 minutes" },
        { do: "Compute second completion", result: "$10+20=30$", why: "the second job starts after the first" },
        { do: "Compute third completion", result: "$30+30=60$", why: "the third job starts after two jobs" },
        { do: "Average completions", result: "$(10+30+60)/3=100/3\\approx33.33$", why: "mean completion time averages job completion times" }
      ], answer: "Average completion time is about $33.33$ minutes." },
      { problem: "A data loader can read $900$ MB/s, preprocessing produces $700$ MB/s, and GPUs consume $800$ MB/s. Add one preprocessing worker that raises preprocessing to $1050$ MB/s. What throughput improvement results?", steps: [
        { do: "Find original bottleneck", result: "$\\min(900,700,800)=700$ MB/s", why: "pipeline throughput is the minimum stage rate" },
        { do: "Update preprocessing rate", result: "$1050$ MB/s", why: "the new worker raises that stage" },
        { do: "Find new bottleneck", result: "$\\min(900,1050,800)=800$ MB/s", why: "GPU consumption is now smallest" },
        { do: "Compute improvement", result: "$800-700=100$ MB/s", why: "new throughput minus old throughput" },
        { do: "Compute percent improvement", result: "$100/700\\approx14.3\\%$", why: "divide improvement by original throughput" }
      ], answer: "Throughput improves by $100$ MB/s, about $14.3\\%$." },
      { problem: "A robust GPU reservation estimates a job needs $6$ GPUs with uncertainty $\\pm1$. Another job needs exactly $3$ GPUs. Can both be guaranteed on an $8$ GPU node?", steps: [
        { do: "Find worst-case need for first job", result: "$6+1=7$ GPUs", why: "robust planning uses the high endpoint" },
        { do: "Add second job need", result: "$7+3=10$ GPUs", why: "both jobs must fit together" },
        { do: "Compare to node capacity", result: "$10>8$", why: "the robust total exceeds available GPUs" },
        { do: "Assess robust feasibility", result: "not feasible", why: "guarantee must hold in the worst allowed case" },
        { do: "Find remaining capacity after second job", result: "$8-3=5$ GPUs", why: "the first job would need at most 5 to fit robustly" }
      ], answer: "No. The robust requirement is $10$ GPUs, exceeding the $8$ GPU node." }
    ],
    applications: [
      { title: "GPU cluster scheduling", background: "Training platforms allocate scarce accelerators among many jobs. Schedulers balance throughput, fairness, priority, and deadlines.", numbers: "If job A gains $100$ samples/s per GPU and job B gains $60$, two extra GPUs add $200$ samples/s to A or $120$ to B before fairness constraints." },
      { title: "Inference autoscaling", background: "Online inference must keep latency low under changing traffic. Queueing targets often determine replica counts.", numbers: "With $\\lambda=300$/s, $\\mu=80$/s per replica, and target $\\rho\\le0.75$, need $r\\ge300/(80\\cdot0.75)=5$ replicas." },
      { title: "Data pipeline bottlenecks", background: "Accelerators are wasted when input pipelines cannot feed them. Flow thinking locates the limiting edge or stage.", numbers: "Rates $1.2$, $0.9$, and $1.5$ GB/s imply end-to-end throughput $0.9$ GB/s." },
      { title: "Experiment queues", background: "Research platforms schedule many experiments with different priorities. Shortest-job and weighted rules reduce waiting for some objectives.", numbers: "Jobs of $2$, $8$, and $10$ hours have average completion $8.67$ hours in SPT order but $14$ hours in reverse order." },
      { title: "Feature freshness", background: "Feature stores must refresh data often enough for models while not overwhelming compute. Inventory-style reorder points become refresh triggers.", numbers: "If staleness grows $3$ minutes per hour and the limit is $15$ minutes, refresh at least every $15/3=5$ hours." },
      { title: "Robust capacity for traffic spikes", background: "Production ML services face forecast error. Robust allocation reserves enough capacity for bounded spikes rather than just mean traffic.", numbers: "Forecast $1000\\pm150$ requests/s means robust planning should handle $1150$ requests/s." },
      { title: "Spot instance risk", background: "Cheap preemptible compute reduces cost but adds uncertainty. Stochastic optimization compares savings against interruption penalties.", numbers: "If interruption costs $50$ with probability $0.2$, expected penalty is $10$; a $15$ discount still has expected net gain $5$." }
    ],
    applicationsClose: "In ML systems, operations research is not abstract machinery; it is how we keep expensive accelerators busy, users served, and uncertainty bounded.",
    takeaways: [
      "ML resource allocation combines capacity, scheduling, flow, queueing, and uncertainty constraints.",
      "Marginal throughput helps decide where the next GPU, replica, or worker should go.",
      "Bottlenecks cap end-to-end performance even when other stages have spare capacity.",
      "Robust and stochastic buffers protect production systems from variable jobs and traffic."
    ]
  }
};
