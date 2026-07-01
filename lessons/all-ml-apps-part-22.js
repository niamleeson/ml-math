/* All ML — Part 22 applications (5 each). Loaded after content-part-22.js, before all-ml-register.js. */

/* ---- _apps-part22-A.js ---- */
/* All ML — Part 22 applications, batch A (22.1–22.5). */

(window.ALLML_CONTENT["22.1"] = window.ALLML_CONTENT["22.1"] || {}).applications = [
  {
    title: "Warehouse robot routing",
    background: `<p>Warehouse robots often move on aisle grids where every legal move between adjacent cells has the same cost. Breadth-first search is the right first tool when the goal is the fewest aisle moves and edge weights are uniform.</p>`,
    numbers: `<p>On the lesson $5\times5$ grid from $(0,0)$ to $(4,4)$, Manhattan distance is $|4-0|+|4-0|=8$. The BFS path has $9$ states, so the route has $9-1=8$ moves.</p>`
  },
  {
    title: "Game-map reachability",
    background: `<p>Game maps frequently need a fast answer to whether a room or tile is reachable. DFS can prove reachability by following one branch deeply, but the found route is not guaranteed to be shortest.</p>`,
    numbers: `<p>The lesson DFS route has $17$ states, so it uses $17-1=16$ moves. Compared with the BFS route of $8$ moves, the DFS route has $16-8=8$ extra moves.</p>`
  },
  {
    title: "Road routing with toll or terrain costs",
    background: `<p>Road and terrain maps rarely have equal edge costs: tolls, slopes, and slow surfaces change the price of entering a state. Uniform-cost search handles that by ordering the frontier by accumulated path cost.</p>`,
    numbers: `<p>In the lesson weighted grid, the straight expensive route costs $1+1+9+9+1+1+1+1=24$. The route around those expensive cells uses eight unit moves, so UCS prefers cost $8$.</p>`
  },
  {
    title: "Web crawl frontier control",
    background: `<p>A web crawler is a graph search whose frontier can grow explosively. Queue, stack, or priority discipline changes whether it sweeps broad layers, dives into one site, or follows a scored priority.</p>`,
    numbers: `<p>With an illustrative frontier cap of $1000$ URLs, BFS can spend that budget storing broad shallow layers, while DFS spends most active memory on one path plus alternatives. The cap is the same, but the retained nodes differ.</p>`
  },
  {
    title: "Network troubleshooting",
    background: `<p>Routers and services form graphs with cycles, so visited-set closure is not optional. Without it, a stack or queue can repeatedly revisit the same loop instead of making progress.</p>`,
    numbers: `<p>In an illustrative $4$-router cycle, omitting the visited set can re-enter forever. With a visited set, each of the $4$ routers is expanded at most once before closure.</p>`
  }
];

(window.ALLML_CONTENT["22.2"] = window.ALLML_CONTENT["22.2"] || {}).applications = [
  {
    title: "Puzzle solving under memory limits",
    background: `<p>Sliding puzzles and small planning puzzles can have deep solutions but limited memory. Iterative deepening repeats depth-limited DFS so it eventually gets a BFS-like depth guarantee with a DFS-like active stack.</p>`,
    numbers: `<p>The lesson goal is $4$ moves from the start. Limit $3$ cannot include a depth-$4$ goal, while limit $4$ returns $5$ states and therefore $5-1=4$ moves.</p>`
  },
  {
    title: "Social graph connection search",
    background: `<p>Friend-of-friend search is a natural meet-in-the-middle problem when relationships are reversible. Searching from both people can reduce the number of stored frontier nodes dramatically.</p>`,
    numbers: `<p>For the lesson values $b=4$ and $d=8$, one frontier stores about $4^8=65{,}536$ nodes. Bidirectional search stores about $2\cdot4^4=512$, a factor of $65{,}536/512=128$ smaller.</p>`
  },
  {
    title: "Package dependency resolution",
    background: `<p>Dependency solvers often test shallow explanations before deeper combinations. Recomputing shallow layers can be acceptable because the deepest successful pass dominates the total work.</p>`,
    numbers: `<p>The lesson IDDFS touches $1,3,6,8,15$ nodes across limits $0$ through $4$. Total touches are $1+3+6+8+15=33$, while the final successful pass touches $15$.</p>`
  },
  {
    title: "Meet-in-the-middle password toy auditing",
    background: `<p>Security toy examples use meet-in-the-middle arithmetic to show why splitting a reversible search can be powerful. The lesson is about search growth, not about attacking real systems.</p>`,
    numbers: `<p>With illustrative branching $10$ and depth $6$, one side considers $10^6$ candidates. Two depth-$3$ sides consider about $2\cdot10^3=2000$ candidates.</p>`
  },
  {
    title: "Route planning with reversible roads",
    background: `<p>Bidirectional route search is safe only when the backward frontier represents true predecessor states. One-way roads break that assumption and require validated predecessor generation or a one-frontier fallback.</p>`,
    numbers: `<p>The plan's D5 includes irreversible-looking actions. One invalid reverse edge is enough to make a backward meet spurious, so the fix is to verify every backward step corresponds to a real forward edge.</p>`
  }
];

(window.ALLML_CONTENT["22.3"] = window.ALLML_CONTENT["22.3"] || {}).applications = [
  {
    title: "Map navigation",
    background: `<p>A* is standard for map navigation because it combines exact cost-so-far with an estimate of remaining distance. On four-neighbor grids, Manhattan distance is a natural admissible heuristic.</p>`,
    numbers: `<p>From $(0,0)$ to $(4,4)$, the lesson heuristic is $|4-0|+|4-0|=8$. At the goal $(4,4)$, the same formula gives $0$.</p>`
  },
  {
    title: "Robot path planning around obstacles",
    background: `<p>Robots use heuristic search to avoid spending equal effort on every possible detour. The heuristic changes expansion order while the cost calculation still certifies the returned path.</p>`,
    numbers: `<p>The lesson A* route has $9$ states on a unit-cost grid. Therefore the path cost is $9-1=8$ moves.</p>`
  },
  {
    title: "Logistics routing with safe estimates",
    background: `<p>Logistics estimates such as straight-line distance can be safe lower bounds when they never exceed true remaining cost. A weak estimate is still valid, but it gives up pruning power.</p>`,
    numbers: `<p>The lesson notes that $h=0$ is admissible because $0\le h^*(n)$ for nonnegative costs. With $h=0$, A* uses $f(n)=g(n)+0$ and becomes UCS.</p>`
  },
  {
    title: "Game pathfinding with weighted greediness",
    background: `<p>Games often trade guaranteed optimality for fewer expansions by increasing the heuristic weight. Weighted A* can be faster, but the original admissibility proof no longer applies to the scaled heuristic.</p>`,
    numbers: `<p>With $f_w(n)=g(n)+2h(n)$, the lesson start priority is $0+2\cdot8=16$. At a node with $g=3,h=5$, the weighted priority is $3+2\cdot5=13$.</p>`
  },
  {
    title: "Indoor navigation units checks",
    background: `<p>Indoor navigation systems may combine walking time, distance, elevator delays, or accessibility penalties. A* requires $g$ and $h$ to measure the same quantity.</p>`,
    numbers: `<p>The lesson's illustrative expression $g=30$ seconds plus $h=10$ meters has no coherent $f$. Convert both to one unit before comparing priorities.</p>`
  }
];

(window.ALLML_CONTENT["22.4"] = window.ALLML_CONTENT["22.4"] || {}).applications = [
  {
    title: "Shift scheduling",
    background: `<p>Schedules are complete candidate solutions, and a neighbor can be a small edit such as swapping two assignments. Local search is useful when enumerating every schedule is impossible.</p>`,
    numbers: `<p>With the lesson's illustrative $10$ possible swaps, one current schedule has $10$ neighboring schedules to score. Hill climbing keeps the best improving neighbor.</p>`
  },
  {
    title: "Delivery route improvement",
    background: `<p>Route improvement often starts from a feasible route and applies local edits. The method is cheap because it stores a current candidate and a small neighborhood rather than a full search tree.</p>`,
    numbers: `<p>The lesson hill-climb path is $0,1,2,3,4,5,6,7$. That is $8$ visited states and $7$ accepted improving moves.</p>`
  },
  {
    title: "Layout optimization",
    background: `<p>Layouts for shelves, screens, or components can have many local optima. A local optimum is only a statement about nearby edits, not a proof of global best quality.</p>`,
    numbers: `<p>In the lesson trap, hill climbing stops at $x=3$ while a better peak is at $x=8$. The miss distance is $8-3=5$ states.</p>`
  },
  {
    title: "Hyperparameter tuning by perturbation",
    background: `<p>When gradients are unavailable or noisy, random perturbations plus annealing can cross short-term losses. Temperature controls how often the search accepts a worse neighbor.</p>`,
    numbers: `<p>For the lesson values $\Delta=-2$ and $T=1$, the downhill acceptance probability is $\exp(\Delta/T)=\exp(-2)$.</p>`
  },
  {
    title: "Tabu-based timetabling",
    background: `<p>Tabu search adds short memory to prevent cycling between recent assignments. The memory length must be long enough to avoid bouncing but not so long that it blocks useful corridors.</p>`,
    numbers: `<p>With the lesson's illustrative tabu length $3$, the last $3$ visited assignments are forbidden as immediate next moves.</p>`
  }
];

(window.ALLML_CONTENT["22.5"] = window.ALLML_CONTENT["22.5"] || {}).applications = [
  {
    title: "Speech transcription decoding",
    background: `<p>Speech decoders build candidate token sequences layer by layer. A beam width $k$ limits memory by keeping only the top partial transcripts at each step.</p>`,
    numbers: `<p>In the lesson first layer, width $1$ compares $A=5$ and $B=4$, so it keeps $A$. That greedy choice later returns $AB=6$.</p>`
  },
  {
    title: "Machine translation candidate generation",
    background: `<p>Translation candidates often need a delayed payoff: an early word that looks second-best can make a later phrase much better. Beam search uses extra slots to keep such alternatives alive.</p>`,
    numbers: `<p>With width $2$, the lesson keeps both $A=5$ and $B=4$ at depth $1$. At depth $2$, branch $BA$ reaches score $10$, beating the width-$1$ result $AB=6$.</p>`
  },
  {
    title: "Autocomplete ranking",
    background: `<p>Autocomplete must return quickly, so narrow beams are common. The risk is that width $1$ acts like greedy search and can prune a phrase whose payoff appears one token later.</p>`,
    numbers: `<p>The lesson greedy beam returns $AB=6$. A width-$2$ beam preserves the delayed branch and finds $BA=10$, an improvement of $10-6=4$.</p>`
  },
  {
    title: "Program synthesis search",
    background: `<p>Program synthesis can generate many successors from each partial program. Even when only $k$ programs are retained, successor generation itself can dominate runtime.</p>`,
    numbers: `<p>With illustrative $k=5$ and branching $20$, one layer creates $5\cdot20=100$ successors before pruning back to $5$ retained candidates.</p>`
  },
  {
    title: "Document summarization length control",
    background: `<p>Summarization beams compare candidates of different lengths. Raw cumulative score can prefer longer text simply because it collected more terms, so normalization changes what survives.</p>`,
    numbers: `<p>The lesson short candidate has normalized score $6/2=3.0$, while the long candidate has $9/5=1.8$. Raw score prefers $9$, but normalized score prefers $3.0$.</p>`
  }
];

/* ---- _apps-part22-B.js ---- */
(window.ALLML_CONTENT["22.6"] = window.ALLML_CONTENT["22.6"] || {}).applications = [
  { title: "Board-game engines", background: "<p>Adversarial board-game programs use minimax to choose moves that remain good after the opponent's best reply. Alpha-beta pruning keeps the exact minimax value while skipping branches that cannot alter the root decision.</p>", numbers: "<p>For the lesson leaves $[[3,5],[2,9]]$, move A backs up $\\min(3,5)=3$ and move B backs up $\\min(2,9)=2$, so the root chooses A with value $\\max(3,2)=3$.</p>" },
  { title: "Competitive bidding simulations", background: "<p>A bidding agent cannot assume it receives the best possible counterparty response. Minimax models a rational competitor that pushes the outcome toward the agent's worst case.</p>", numbers: "<p>The best raw leaf is $9$ under branch B, but the opponent can force the $2$ leaf there. Branch A guarantees $3$, so the safer bid line is A even though $9\\gt5$.</p>" },
  { title: "Alpha-beta pruning in chess-like search", background: "<p>Chess-like engines order promising moves first so alpha-beta can prove later replies irrelevant. The pruning changes effort, not the backed-up value.</p>", numbers: "<p>In the lesson tree, good ordering visits $3$ of $4$ leaves and prunes $4-3=1$ leaf while preserving the backed-up root value $3$.</p>" },
  { title: "Security attack-defense planning", background: "<p>Red-team and blue-team planning often alternates attacker choices with defender responses. A max/min tree makes the chosen defense robust to the modeled worst response.</p>", numbers: "<p>With illustrative defenses whose worst cases are $-1$ and $2$, minimax selects the second defense because $\\max(-1,2)=2$.</p>" },
  { title: "Depth-limited game AI", background: "<p>When a game tree is too large, engines stop at a depth limit and use a learned or hand-built evaluation function. Those heuristic leaves are only estimates of terminal utility.</p>", numbers: "<p>With weights $(2,-1)$, the lesson feature dot products are $[2,1]\\cdot[2,-1]=3$, $[1,3]\\cdot[2,-1]=-1$, and $[3,0]\\cdot[2,-1]=6$.</p>" }
];

(window.ALLML_CONTENT["22.7"] = window.ALLML_CONTENT["22.7"] || {}).applications = [
  { title: "Go and chess-like move selection", background: "<p>MCTS helped popularize rollout-based search for large games where full minimax is impossible. UCB allocates simulations to moves with both strong reward estimates and high uncertainty.</p>", numbers: "<p>With $N=20$, visits $(10,2,8)$, wins $(6,1,5)$, and $c=1.4$, the lesson UCBs are A $=1.366$, B $=2.213$, and C $=1.482$, so B is selected.</p>" },
  { title: "Online experiment allocation", background: "<p>Bandit-style allocation uses the same exploration idea as MCTS selection. Low-visit choices receive an uncertainty bonus before they are discarded.</p>", numbers: "<p>Child B has only $2$ visits, so its bonus is $1.4\\sqrt{\\ln20/2}=1.713$, much larger than A's $1.4\\sqrt{\\ln20/10}=0.766$.</p>" },
  { title: "Real-time game AI rollouts", background: "<p>Games with tight time budgets often run as many simulations as the clock allows, then back up each result along the selected path. Each backup is just an update to empirical statistics.</p>", numbers: "<p>A successful rollout on B changes visits from $2$ to $3$ and wins from $1$ to $2$, giving mean $2/3=0.667$.</p>" },
  { title: "Robotic action sampling", background: "<p>A robot can use a simulator to sample uncertain action sequences before committing. Selecting by visit count is often less fragile than selecting by a lucky sample mean.</p>", numbers: "<p>In the lesson allocation, the best empirical arm receives $47$ visits out of $103$, for visit share $47/103=0.456$.</p>" },
  { title: "Planning with simulators", background: "<p>MCTS can plan with a black-box simulator even when an explicit transition table is unavailable. The rollout policy defines what the estimates mean.</p>", numbers: "<p>With an illustrative $100$ random rollouts, the estimate is a random-play value; changing the rollout policy changes the sampled return distribution even with the same UCB formula.</p>" }
];

(window.ALLML_CONTENT["22.8"] = window.ALLML_CONTENT["22.8"] || {}).applications = [
  { title: "Robot navigation", background: "<p>STRIPS represents navigation as logical facts and actions. Move actions delete the old location fact and add the new one, preventing impossible double-location states.</p>", numbers: "<p>Starting from $S=\\{AtA,RoadAB\\}$, MoveAB deletes $AtA$ and adds $AtB$, producing $\\{RoadAB,AtB\\}$ with fact count $2$.</p>" },
  { title: "Warehouse pick-and-place planning", background: "<p>Warehouse planners can search symbolic states for routes and object manipulations. BFS over legal fact sets gives a shortest plan when each action has equal cost.</p>", numbers: "<p>The lesson route $AtA\\rightarrow AtB\\rightarrow AtC$ uses MoveAB then MoveBC, so the plan length is exactly $2$.</p>" },
  { title: "Workflow automation", background: "<p>Workflow engines use preconditions to block illegal steps, such as approving a request before all required checks pass. STRIPS makes those gates explicit.</p>", numbers: "<p>An illustrative action with $2$ required facts is illegal if only $1$ is present because $Pre(a)\\nsubseteq S$.</p>" },
  { title: "Disaster-response task planning", background: "<p>Regression planning works backward from desired facts to facts that must hold before the last action. This can focus search on relevant preconditions.</p>", numbers: "<p>Regressing goal $\\{AtC\\}$ through MoveBC removes achieved $AtC$ and adds preconditions, yielding $\\{AtB,RoadBC\\}$ of size $2$.</p>" },
  { title: "Game quest planning", background: "<p>Quest planners use delete effects to maintain a consistent story state. Without deletes, characters can satisfy contradictory location or inventory facts.</p>", numbers: "<p>If MoveAB failed to delete $AtA$, the state could contain both $AtA$ and $AtB$, placing the agent in $2$ places at once.</p>" }
];

(window.ALLML_CONTENT["22.9"] = window.ALLML_CONTENT["22.9"] || {}).applications = [
  { title: "Travel itinerary planning", background: "<p>HTN planning captures reusable abstractions such as travel, then decomposes them into executable tasks. The abstraction controls branching before primitive scheduling begins.</p>", numbers: "<p>The lesson method $Travel\\rightarrow(Pack,Drive,Park)$ produces $3$ primitive steps.</p>" },
  { title: "Manufacturing workflows", background: "<p>Manufacturing recipes often have hierarchical phases with small internal choices. Encoding the hierarchy avoids flat enumeration of every primitive sequence.</p>", numbers: "<p>Flat depth-three search with six choices gives $6\\cdot6\\cdot6=216$ sequences, while the HTN count $2\\cdot3=6$ gives reduction factor $216/6=36$.</p>" },
  { title: "Kitchen and service scheduling", background: "<p>Partial-order planning delays arbitrary sequence choices so independent work can float. Only causal constraints need to be fixed early.</p>", numbers: "<p>For Buy, Cook, SetTable with only Buy $\\prec$ Cook, there are $3!=6$ total orders and exactly $3$ valid orders.</p>" },
  { title: "Cloud deployment orchestration", background: "<p>Deployment planners keep independent steps unordered to preserve concurrency and late binding. Constraints are added only when dependencies require them.</p>", numbers: "<p>Illustratively, $4$ independent steps have $4!=24$ possible total orders before dependency constraints reduce the set.</p>" },
  { title: "Construction project planning", background: "<p>Threat detection protects causal links from steps that delete required conditions. The planner repairs threats by adding just enough ordering.</p>", numbers: "<p>An illustrative deleter threatening one causal link has $2$ safe regions: order it before the producer or after the consumer.</p>" }
];

(window.ALLML_CONTENT["22.10"] = window.ALLML_CONTENT["22.10"] || {}).applications = [
  { title: "Robot navigation with slipping actions", background: "<p>Mobile robots need stochastic planning when commands can slip or fail. The Bellman backup averages over possible next states instead of assuming one successor.</p>", numbers: "<p>With probabilities $(0.2,0.8)$ and next values $(0,10)$, the expected next value is $0.2\\cdot0+0.8\\cdot10=8.0$.</p>" },
  { title: "Medical treatment planning", background: "<p>Treatment decisions combine immediate reward with probabilistic future outcomes. Discounting encodes how strongly the planner values delayed benefit.</p>", numbers: "<p>With reward $1$ and $\\gamma=0.9$, the lesson action value is $Q=1+0.9\\cdot8.0=8.2$.</p>" },
  { title: "Inventory control", background: "<p>Inventory policies depend on how future demand and rewards are discounted. A small discount makes delayed payoff nearly irrelevant.</p>", numbers: "<p>A reward $10$ arriving after $3$ steps is $10\\gamma^3$: $0.010$ for $\\gamma=0.1$, $7.290$ for $\\gamma=0.9$, and $9.703$ for $\\gamma=0.99$.</p>" },
  { title: "Sensor-based localization", background: "<p>POMDP localization replaces a hidden state by a belief distribution. Observation likelihoods produce weights that must be normalized.</p>", numbers: "<p>Weights $(0.12,0.36)$ sum to $0.48$, so the posterior is $(0.12/0.48,0.36/0.48)=(0.25,0.75)$.</p>" },
  { title: "Ad placement and budget planning", background: "<p>Budget planners under uncertain auction outcomes must sum over all possible outcomes. Transition probabilities should form a proper distribution before values are backed up.</p>", numbers: "<p>For illustrative outcomes with probabilities $0.3$ and $0.7$, the check is $0.3+0.7=1.0$ before applying the expected-value backup.</p>" }
];

