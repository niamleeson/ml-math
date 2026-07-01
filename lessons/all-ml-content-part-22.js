/* All ML — authored content for Part 22: Search & Planning (22.1–22.10).
   Appends to window.ALLML_CONTENT. Every displayed number was computed in Python first.
   LaTeX via String.raw; emphasis is bold (no prose italics). */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 22.1 Uninformed search (BFS, DFS, UCS) ---------------- */
window.ALLML_CONTENT["22.1"] = {
  tagline: "When you know only successors, costs, and a goal test, the frontier rule is the algorithm.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/22.1-uninformed-search.ipynb",
  context: String.raw`
    <p>Search begins with graph ideas you already know: states are nodes, actions are edges, and a path is a sequence of actions. Queue and stack data structures become the mechanism that decides which node is expanded next. Shortest-path thinking from optimization also enters here: uniform-cost search replaces depth with accumulated cost.</p>
    <p>Where it leads: this is the control case for informed search (22.3), game-tree search (22.6), and symbolic planning (22.8). Later methods look smarter only because they change what the frontier knows.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple: start somewhere, repeatedly ask for successors, and stop at a goal. The naive pain is that the frontier can grow faster than you can inspect it. If the algorithm has no heuristic, its only intelligence is <b>discipline</b>: FIFO queue for BFS, LIFO stack for DFS, priority queue by path cost for UCS.</p>
    <p>The design decision people gloss over is when a state becomes closed. Marking states when they enter the frontier avoids duplicate work, while marking too late can make a tiny grid look infinite through repeated cycles.</p>`,
  mathematics: String.raw`
    <p>Let $G=(V,E)$ be a graph, $s$ the start, $g$ the goal, $d(v)$ the depth of state $v$, and $C(p)=\\sum_{e\\in p} c(e)$ the path cost. BFS pops the smallest depth, DFS pops the most recent node, and UCS pops the smallest $C$.</p>
    <p><b>BFS on a $5\\times5$ grid.</b> From $(0,0)$ to $(4,4)$ with four-neighbor moves:</p>
    <ol class="work"><li>Manhattan distance $=|4-0|+|4-0|=4+4=8$ moves</li><li>BFS path has $9$ states, so moves $=9-1=8$</li></ol>
    <p>BFS is optimal here because every edge has cost $1$, so first arrival at a depth is the cheapest arrival at that depth.</p>
    <p><b>DFS with the same successors.</b></p>
    <ol class="work"><li>The recorded DFS route has $17$ states</li><li>Moves $=17-1=16$</li><li>Compared with BFS: $16-8=8$ extra moves</li></ol>
    <p>The stack did not make a bad calculation; it answered a different question, following one branch before balancing alternatives.</p>
    <p><b>UCS with expensive cells.</b> If entering $(2,2)$ or $(2,3)$ costs $9$ and all other moves cost $1$:</p>
    <ol class="work"><li>Straight-through expensive route cost includes $1+1+9+9+1+1+1+1=24$</li><li>A route around them uses eight unit moves, cost $8\\cdot1=8$</li><li>UCS chooses the path with total cost $8$</li></ol>
    <p>UCS is the correct generalization of BFS when depth and cost no longer agree.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Using BFS on weighted edges.</b> BFS minimizes $d(v)$, not $C(p)$, so a shallow expensive route can beat a deeper cheap route incorrectly.</li><li><b>Letting DFS run without a visited set.</b> Cycles repeatedly re-enter the stack, so the LIFO rule can spend all its time undoing itself.</li><li><b>Comparing algorithms only by path length.</b> Explored nodes and frontier memory are separate costs; DFS may use little memory while returning a poor path.</li></ul>`
};

/* ---------------- 22.2 Iterative deepening & bidirectional search ---------------- */
window.ALLML_CONTENT["22.2"] = {
  tagline: "Repeat shallow DFS to get BFS-like depth guarantees, or search from both ends until the waves meet.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/22.2-iterative-deepening-bidirectional-search.ipynb",
  context: String.raw`
    <p>BFS and DFS (22.1) give the raw materials: BFS has the right depth ordering, DFS has the small active stack. Iterative deepening deliberately recomputes shallow layers to combine those strengths. Bidirectional search uses the same frontier idea, but starts one frontier at the goal.</p>
    <p>Where it leads: A* (22.3) also tries to make the frontier smaller; planning systems (22.8) use these memory decisions when symbolic state spaces become wide.</p>`,
  intuition: String.raw`
    <p>The pain is memory. BFS keeps a whole layer, and that layer is enormous when branching factor is high. Iterative deepening asks a wise question: if shallow layers are cheap, why not search depth $0$, then $1$, then $2$, until the goal appears?</p>
    <p>Bidirectional search makes a different choice: if the goal is known and predecessor logic is available, grow two shallow trees. The design decision is that meeting in the middle is valuable only when you can test frontier intersection cheaply and reverse actions safely.</p>`,
  mathematics: String.raw`
    <p>With branching factor $b$ and solution depth $d$, BFS stores roughly $b^d$ frontier nodes. Bidirectional search stores about $2b^{d/2}$ nodes. Iterative deepening uses depth-limited DFS with limit $L$ and increases $L$ until success.</p>
    <p><b>Depth limit arithmetic.</b> Goal $(0,4)$ is four moves from $(0,0)$:</p>
    <ol class="work"><li>Distance $=|0-0|+|4-0|=4$</li><li>Limit $3$ explores but cannot include a depth-$4$ goal</li><li>Limit $4$ returns a path with $5$ states, so moves $=5-1=4$</li></ol>
    <p>The repeated passes are not wasteful in the way they first appear; the last layer dominates when branching is large.</p>
    <p><b>Observed IDDFS touches in the notebook.</b></p>
    <ol class="work"><li>Limits $0,1,2,3,4$ touch $1,3,6,8,15$ nodes</li><li>Total touches $=1+3+6+8+15=33$</li><li>The successful final pass touches $15$ nodes</li></ol>
    <p>This is the price paid for keeping the active memory close to DFS rather than BFS.</p>
    <p><b>Bidirectional branching arithmetic.</b> For $b=4$ and $d=8$:</p>
    <ol class="work"><li>One frontier: $4^8=65{,}536$</li><li>Two frontiers: $2\\cdot4^{8/2}=2\\cdot4^4=2\\cdot256=512$</li><li>Reduction factor $=65{,}536/512=128$</li></ol>
    <p>The square-root depth effect is why bidirectional search can feel magical when its assumptions hold.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Forgetting repeated expansions in IDDFS.</b> The term $33$ above is larger than the final $15$ because earlier limits are recomputed.</li><li><b>Using bidirectional search without reversible actions.</b> The backward frontier must represent genuine predecessor states, not imagined ones.</li><li><b>Ignoring intersection cost.</b> The $2b^{d/2}$ memory story assumes fast set membership for meeting detection.</li></ul>`
};

/* ---------------- 22.3 Informed search & A* ---------------- */
window.ALLML_CONTENT["22.3"] = {
  tagline: "A* expands the state with the smallest cost-so-far plus a safe estimate of cost-to-go.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/22.3-informed-search-a-star.ipynb",
  context: String.raw`
    <p>UCS (22.1) already knows how to respect path cost. A* adds the missing ingredient: a heuristic $h(n)$ that estimates what remains. Iterative deepening (22.2) showed that frontier size is the enemy; A* attacks that size by ranking nodes with domain knowledge.</p>
    <p>Where it leads: heuristic scoring reappears in beam search (22.5), planning heuristics (22.8), and rollout policies in MCTS (22.7).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that UCS is fair but blind. It expands every cheap prefix even if that prefix points away from the goal. A heuristic is a compass: not a proof by itself, but a useful bias.</p>
    <p>The design decision is safety. If $h$ never overestimates the true remaining cost, A* keeps UCS's optimality while often expanding fewer nodes. If you overweight $h$, the search becomes greedier; sometimes faster, but the proof has been traded away.</p>`,
  mathematics: String.raw`
    <p>A* orders frontier node $n$ by</p><div class="formula-box">$$f(n)=g(n)+h(n)$$</div>
    <p>Here $g(n)$ is exact cost from start to $n$, and $h(n)$ is estimated cost from $n$ to the goal. Admissibility means $0\\le h(n)\\le h^*(n)$, where $h^*$ is the true remaining cost.</p>
    <p><b>Manhattan heuristic.</b> On a four-neighbor grid from $(0,0)$ to $(4,4)$:</p>
    <ol class="work"><li>$h(0,0)=|4-0|+|4-0|=8$</li><li>$h(4,4)=|4-4|+|4-4|=0$</li><li>A neighbor changes Manhattan distance by at most $1$</li></ol>
    <p>That last fact is consistency: moving one step cannot reduce the estimated distance by more than the cost of that step.</p>
    <p><b>A* around walls.</b> In the notebook grid, the returned path has cost $8$:</p>
    <ol class="work"><li>Each move costs $1$</li><li>Path states $=9$</li><li>$g(g)=9-1=8$</li></ol>
    <p>The heuristic did not change the answer; it changed which alternatives had to be inspected before the answer was certified.</p>
    <p><b>Weighted A*.</b> If $f_w(n)=g(n)+2h(n)$:</p>
    <ol class="work"><li>Start priority $=0+2\\cdot8=16$</li><li>At a node with $g=3,h=5$, priority $=3+2\\cdot5=13$</li><li>The heuristic term is now twice the cost term's scale</li></ol>
    <p>This often shrinks expansions, but the admissibility proof applies to $h$, not to $2h$.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Overestimating with $h$.</b> If $h(n)\\gt h^*(n)$, A* can skip the true optimal route because its $f$ looks too expensive.</li><li><b>Confusing admissible with informative.</b> $h=0$ is admissible but collapses A* back to UCS.</li><li><b>Mixing units.</b> $g$ and $h$ must measure the same cost; time plus distance produces meaningless $f$ values.</li></ul>`
};

/* ---------------- 22.4 Local search ---------------- */
window.ALLML_CONTENT["22.4"] = {
  tagline: "When the tree is too large, search among complete candidates and remember only what helps the next move.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/22.4-local-search.ipynb",
  context: String.raw`
    <p>Earlier searches kept frontiers of partial paths. Local search changes the representation: a state is already a complete candidate solution, and neighbors are small edits. This connects to optimization landscapes from gradient methods and prepares the intuition for policy improvement in uncertain planning (22.10).</p>
    <p>Where it leads: beam search (22.5) keeps a small set of candidates; MCTS (22.7) also spends effort selectively rather than enumerating everything.</p>`,
  intuition: String.raw`
    <p>The pain is scale. Sometimes the path is irrelevant; you only care about the final schedule, route, or assignment. Hill climbing says: move to a better neighbor. Simulated annealing says: occasionally accept worse moves early, because escape routes often go downhill first. Tabu says: keep memory so the search does not bounce between the same states.</p>
    <p>The design decision is how much bad news to tolerate. Pure greed is efficient but brittle; controlled randomness and short memory buy robustness.</p>`,
  mathematics: String.raw`
    <p>Let $F(x)$ be the score of complete candidate $x$, and $N(x)$ its neighbors. Hill climbing chooses $x' = \\arg\\max_{y\\in N(x)} F(y)$ if $F(x')\\gt F(x)$. Simulated annealing accepts a downhill move with probability $\\exp(\\Delta/T)$ for $\\Delta=F(y)-F(x)\\lt0$.</p>
    <p><b>Hill-climb path.</b> In the notebook landscape:</p>
    <ol class="work"><li>The path is $0,1,2,3,4,5,6,7$</li><li>States visited $=8$</li><li>Final local optimum $x=7$</li></ol>
    <p>Each step is justified only by local comparison, not by a global proof.</p>
    <p><b>A trap landscape.</b> Starting at $0$ reaches $x=3$, but the better peak is $x=8$:</p>
    <ol class="work"><li>Local-climb final $=3$</li><li>Global peak location $=8$</li><li>Missed distance $=8-3=5$ states</li></ol>
    <p>The mechanism is not noise; it is the definition of local optimality.</p>
    <p><b>Annealing bridge.</b> The plotted route $0,1,2,3,4,5,6,7,8$ contains a downhill step:</p>
    <ol class="work"><li>There are $9$ states and $8$ moves</li><li>At least one score difference $\\Delta$ is negative</li><li>A negative $\\Delta$ can be accepted with probability $\\exp(\\Delta/T)$</li></ol>
    <p>Temperature $T$ decides whether a temporary loss is a useful bridge or uncontrolled wandering.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Calling a local optimum a global solution.</b> Hill climbing proves only that no neighbor improves $F$.</li><li><b>Cooling too quickly.</b> If $T$ falls before escape moves occur, annealing becomes ordinary hill climbing.</li><li><b>Making tabu memory too long.</b> A long tabu list can forbid the only corridor back to a promising region.</li></ul>`
};

/* ---------------- 22.5 Beam search ---------------- */
window.ALLML_CONTENT["22.5"] = {
  tagline: "Beam search keeps the best $k$ partial candidates and deliberately forgets the rest.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/22.5-beam-search.ipynb",
  context: String.raw`
    <p>A* (22.3) ranks a frontier by score; beam search adds a hard memory budget. Local search (22.4) showed how useful small candidate sets can be, but beam search keeps candidates by layer so it can build sequences.</p>
    <p>Where it leads: sequence decoders, planning heuristics (22.8), and language-model generation all use this same compromise between exhaustive search and greedy commitment.</p>`,
  intuition: String.raw`
    <p>The concrete problem is a frontier that is too wide. Keeping every partial sequence is safe but expensive; keeping one is greedy and fragile. Beam search chooses the middle: keep the top $k$ by score at each depth.</p>
    <p>The design decision is that pruning is irreversible. A candidate removed at depth $t$ cannot reveal that it would become excellent at depth $t+3$.</p>`,
  mathematics: String.raw`
    <p>At depth $t$, let $B_t$ be the beam and $S(x)$ the score of a partial candidate. Beam search forms all successors of $B_t$, sorts by $S$, and keeps the top $k$.</p>
    <p><b>Width $1$.</b></p>
    <ol class="work"><li>Depth $1$ scores: $A=5$, $B=4$, so keep $A$</li><li>Successors under $A$: $AA=5$, $AB=6$</li><li>Final width-$1$ choice $AB=6$</li></ol>
    <p>This is greedy search in layered clothing.</p>
    <p><b>Width $2$.</b></p>
    <ol class="work"><li>Depth $1$ keeps $A=5$ and $B=4$</li><li>Depth $2$ candidates include $BA=10$</li><li>Top candidate becomes $BA=10$</li></ol>
    <p>The extra slot preserved the branch whose payoff was delayed by one layer.</p>
    <p><b>Length normalization.</b> Raw scores and per-step scores can disagree:</p>
    <ol class="work"><li>Short: $6/2=3.0$</li><li>Long: $9/5=1.8$</li><li>Best raw is $9$, best normalized is $3.0$</li></ol>
    <p>The scoring definition is not cosmetic; it decides what survives pruning.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Treating beam search as optimal.</b> The top-$k$ pruning step discards proof obligations along with states.</li><li><b>Using raw cumulative scores for variable lengths.</b> Longer candidates can win only because they accumulated more terms.</li><li><b>Choosing $k$ without memory accounting.</b> The retained frontier is capped by $k$, but successor generation can still be large.</li></ul>`
};

/* ---------------- 22.6 Adversarial search ---------------- */
window.ALLML_CONTENT["22.6"] = {
  tagline: "Minimax chooses the move whose worst opponent reply is best; alpha-beta skips branches that cannot matter.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/22.6-adversarial-search.ipynb",
  context: String.raw`
    <p>Uninformed and informed search assumed the world passively reveals successors. Games add an opponent who selects the successor you like least. Tree search still applies, but values now alternate between max layers and min layers.</p>
    <p>Where it leads: MCTS (22.7) scales game search when exact minimax is too large, and planning under uncertainty (22.10) replaces adversarial choice with expectation.</p>`,
  intuition: String.raw`
    <p>The pain is strategic response. A move is not good because it has one wonderful continuation; it is good if it remains acceptable after the opponent replies. Minimax formalizes humility: assume the opponent sees your plan.</p>
    <p>Alpha-beta pruning's design decision is logical, not heuristic. If a branch cannot improve the ancestor decision, evaluating it is wasted effort and can be skipped without changing the answer.</p>`,
  mathematics: String.raw`
    <p>For a max node $s$, $V(s)=\\max_a V(T(s,a))$. For a min node, $V(s)=\\min_a V(T(s,a))$.</p>
    <p><b>Two-ply minimax.</b> Leaves are $[[3,5],[2,9]]$:</p>
    <ol class="work"><li>Opponent value under $A$: $\\min(3,5)=3$</li><li>Opponent value under $B$: $\\min(2,9)=2$</li><li>Root value: $\\max(3,2)=3$</li></ol>
    <p>The root chooses $A$, not because $5$ is the largest leaf, but because $A$ has the better guaranteed outcome.</p>
    <p><b>Alpha-beta work.</b> With good ordering:</p>
    <ol class="work"><li>Total leaves $=4$</li><li>Visited leaves $=3$</li><li>Pruned leaves $=4-3=1$</li></ol>
    <p>The backed-up value remains $3$; pruning changed effort, not semantics.</p>
    <p><b>Evaluation at depth limit.</b> With features $x$ and weights $w=(2,-1)$:</p>
    <ol class="work"><li>$[2,1]\\cdot[2,-1]=4-1=3$</li><li>$[1,3]\\cdot[2,-1]=2-3=-1$</li><li>$[3,0]\\cdot[2,-1]=6-0=6$</li></ol>
    <p>A shallow game search is only as reliable as this evaluation function at the leaves.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Maximizing the best leaf.</b> Minimax backs up through the opponent's minimum, so a tempting leaf can be unreachable under optimal play.</li><li><b>Expecting alpha-beta to fix bad ordering.</b> It is exact either way, but pruning power depends strongly on move order.</li><li><b>Trusting depth-limited values too much.</b> The formula uses $\\hat V$, not true terminal utility, once the search is cut off.</li></ul>`
};

/* ---------------- 22.7 Monte Carlo Tree Search ---------------- */
window.ALLML_CONTENT["22.7"] = {
  tagline: "MCTS uses rollouts to spend search where reward and uncertainty are both high.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/22.7-monte-carlo-tree-search.ipynb",
  context: String.raw`
    <p>Minimax (22.6) is exact but can be too expensive. MCTS keeps the tree partial and estimates values by simulation. It borrows the frontier allocation spirit of A* (22.3), but its score includes uncertainty from limited visits.</p>
    <p>Where it leads: rollout-based planning connects directly to reinforcement learning and to MDP planning under uncertainty (22.10).</p>`,
  intuition: String.raw`
    <p>The concrete problem is choosing a move before the game tree can be fully searched. MCTS says: sample continuations, update statistics, and let the tree grow where the samples say it matters.</p>
    <p>The design decision is exploration versus exploitation. A move with high average reward deserves visits; a move with few visits deserves a chance because its average is uncertain.</p>`,
  mathematics: String.raw`
    <p>A common selection score is UCB:</p><div class="formula-box">$$\\text{UCB}_i=\\bar X_i+c\\sqrt{\\frac{\\ln N}{n_i}}$$</div>
    <p>Here $\\bar X_i$ is mean reward for child $i$, $n_i$ its visits, $N$ parent visits, and $c$ the exploration constant.</p>
    <p><b>UCB example.</b> With $N=20$, visits $(10,2,8)$, wins $(6,1,5)$, and $c=1.4$:</p>
    <ol class="work"><li>$A: 6/10+1.4\\sqrt{\\ln20/10}=0.600+0.766=1.366$</li><li>$B: 1/2+1.4\\sqrt{\\ln20/2}=0.500+1.713=2.213$</li><li>$C: 5/8+1.4\\sqrt{\\ln20/8}=0.625+0.857=1.482$</li></ol>
    <p>Child $B$ wins selection because low visits make its uncertainty bonus large.</p>
    <p><b>Backup after a successful rollout on $B$.</b></p>
    <ol class="work"><li>Visits: $2+1=3$</li><li>Wins: $1+1=2$</li><li>Mean: $2/3=0.667$</li></ol>
    <p>Backup is just statistics moving upward along the selected path.</p>
    <p><b>Visit allocation after 100 more selections.</b></p>
    <ol class="work"><li>Total visits $=103$</li><li>The best empirical arm receives $47$ visits</li><li>Visit share $=47/103=0.456$</li></ol>
    <p>The final action is often chosen by visits because visit count is less fragile than one lucky mean.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Using too little exploration.</b> A small $c$ can lock onto a lucky early child before alternatives have evidence.</li><li><b>Choosing by mean after few visits.</b> $\\bar X_i$ has high variance when $n_i$ is tiny; UCB's bonus exists for that reason.</li><li><b>Using unrealistic rollouts.</b> Simulation rewards estimate the rollout policy's world, not necessarily expert play.</li></ul>`
};

/* ---------------- 22.8 Automated planning (STRIPS, PDDL) ---------------- */
window.ALLML_CONTENT["22.8"] = {
  tagline: "STRIPS planning turns actions into preconditions, add effects, and delete effects, then searches over fact sets.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/22.8-automated-planning-strips-pddl.ipynb",
  context: String.raw`
    <p>Graph search (22.1) supplies the engine; STRIPS supplies the state representation. Instead of grid cells, states are sets of logical facts. A* heuristics (22.3) reappear as estimates of unsatisfied goals.</p>
    <p>Where it leads: hierarchical planning (22.9) adds abstraction above STRIPS, and MDP/POMDP planning (22.10) adds uncertainty to action outcomes.</p>`,
  intuition: String.raw`
    <p>The concrete problem is action bookkeeping. If a robot moves from $A$ to $B$, the planner must not merely add "at $B$"; it must also remove "at $A$". STRIPS makes this explicit.</p>
    <p>The design decision is to keep action semantics small and composable: preconditions say when an action is legal, add effects say what becomes true, delete effects say what stops being true.</p>`,
  mathematics: String.raw`
    <p>For state $S$, action $a=(Pre(a),Add(a),Del(a))$ is applicable when $Pre(a)\\subseteq S$. The successor is</p><div class="formula-box">$$S'=(S\\setminus Del(a))\\cup Add(a).$$</div>
    <p><b>Apply MoveAB.</b> Start $S=\\{AtA,RoadAB\\}$:</p>
    <ol class="work"><li>Delete $AtA$: $\\{AtA,RoadAB\\}\\setminus\\{AtA\\}=\\{RoadAB\\}$</li><li>Add $AtB$: $\\{RoadAB\\}\\cup\\{AtB\\}=\\{RoadAB,AtB\\}$</li><li>Fact count remains $2$</li></ol>
    <p>The delete list is what prevents the planner from believing the agent is in two places.</p>
    <p><b>Forward plan to $AtC$.</b></p>
    <ol class="work"><li>Initial facts: $AtA,RoadAB,RoadBC$</li><li>MoveAB makes $AtB$ true</li><li>MoveBC makes $AtC$ true, so plan length $=2$</li></ol>
    <p>This is ordinary BFS, but the successor function is symbolic action application.</p>
    <p><b>Regression through MoveBC.</b></p>
    <ol class="work"><li>Subgoal $G=\\{AtC\\}$</li><li>Remove achieved facts: $G\\setminus Add=\\varnothing$</li><li>Add preconditions: $\\varnothing\\cup\\{AtB,RoadBC\\}=\\{AtB,RoadBC\\}$</li></ol>
    <p>Regression asks what had to be true before the last action.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Forgetting delete effects.</b> The successor formula keeps stale facts unless $Del(a)$ removes them.</li><li><b>Applying actions with missing preconditions.</b> If $Pre(a)\\nsubseteq S$, the successor is not legal even if the add list looks useful.</li><li><b>Using goal-count heuristics blindly.</b> Counting unsatisfied facts ignores interactions where one action deletes another goal.</li></ul>`
};

/* ---------------- 22.9 Hierarchical & partial-order planning ---------------- */
window.ALLML_CONTENT["22.9"] = {
  tagline: "Hierarchy chooses useful abstractions; partial-order planning delays sequence choices until constraints require them.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/22.9-hierarchical-partial-order-planning.ipynb",
  context: String.raw`
    <p>STRIPS planning (22.8) searches directly over primitive actions. Hierarchical Task Networks add methods that decompose abstract tasks into smaller tasks. Partial-order planning keeps only necessary before-after constraints instead of choosing an arbitrary total order immediately.</p>
    <p>Where it leads: these ideas are practical planning tools, and they also foreshadow abstraction and option-like behavior in reinforcement learning.</p>`,
  intuition: String.raw`
    <p>The pain is premature detail. A planner that chooses every primitive action from the start faces a huge branching factor. Humans do not plan dinner that way: first prepare meal and set table, then refine each task.</p>
    <p>The design decision is delayed commitment. Commit to hierarchy when it reduces choices; commit to ordering only when a causal dependency or threat forces it.</p>`,
  mathematics: String.raw`
    <p>An HTN method maps an abstract task to subtasks. A partial-order plan is a set of steps plus constraints $a\\prec b$ meaning $a$ must precede $b$.</p>
    <p><b>HTN decomposition.</b></p>
    <ol class="work"><li>$Travel\\rightarrow(Pack,Drive,Park)$</li><li>Number of primitive steps $=3$</li><li>The abstract task has been replaced by three executable tasks</li></ol>
    <p>The hierarchy is a branching-control device, not just a prettier notation.</p>
    <p><b>Branching reduction.</b></p>
    <ol class="work"><li>Flat depth-three search with six choices per level: $6\\cdot6\\cdot6=216$</li><li>HTN choice: $2$ methods and $3$ internal choices gives $2\\cdot3=6$</li><li>Reduction factor $=216/6=36$</li></ol>
    <p>Abstraction can remove whole regions of irrelevant primitive search.</p>
    <p><b>Partial-order schedules.</b> With steps Buy, Cook, SetTable and only Buy $\\prec$ Cook:</p>
    <ol class="work"><li>Total permutations $=3!=6$</li><li>Exactly half satisfy Buy before Cook: $6/2=3$</li><li>Valid orders $=3$</li></ol>
    <p>SetTable floats because no causal link forces its position.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Overconstraining the plan.</b> Adding unnecessary $a\\prec b$ constraints destroys useful flexibility.</li><li><b>Trusting bad methods.</b> HTN completeness depends on the method library; missing decompositions hide valid plans.</li><li><b>Ignoring threats.</b> A step that deletes a causal link's condition must be ordered before the producer or after the consumer.</li></ul>`
};

/* ---------------- 22.10 Planning under uncertainty (MDP/POMDP planning) ---------------- */
window.ALLML_CONTENT["22.10"] = {
  tagline: "When actions are uncertain, plan by backing up expected value; when state is hidden, plan over beliefs.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/22.10-planning-under-uncertainty.ipynb",
  context: String.raw`
    <p>Classical planning (22.8) assumed deterministic action effects. MDPs replace a single successor with transition probabilities; POMDPs add uncertainty about the current state itself. The backup resembles minimax (22.6), but the opponent's min is replaced by an expectation.</p>
    <p>Where it leads: this is the planning foundation under reinforcement learning, policy iteration, and model-based decision making.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a good action can fail and a bad observation can mislead you. A deterministic plan says what should happen; an uncertainty-aware plan says what is worth doing in expectation.</p>
    <p>The design decision is to make state evaluation recursive. A state is valuable if it gives reward now and leads, probabilistically, to valuable future states.</p>`,
  mathematics: String.raw`
    <p>The MDP Bellman optimality equation is</p><div class="formula-box">$$V^*(s)=\\max_a\\left[R(s,a)+\\gamma\\sum_{s'}P(s'|s,a)V^*(s')\\right].$$</div>
    <p>Here $R$ is reward, $\\gamma$ is the discount, and $P(s'|s,a)$ is the transition probability.</p>
    <p><b>One Bellman backup.</b> With reward $1$, $\\gamma=0.9$, next values $(0,10)$, and probabilities $(0.2,0.8)$:</p>
    <ol class="work"><li>Expected next value $=0.2\\cdot0+0.8\\cdot10=8.0$</li><li>Discounted future $=0.9\\cdot8.0=7.2$</li><li>Total $Q=1+7.2=8.2$</li></ol>
    <p>The action is good because most probability mass points toward the high-value state.</p>
    <p><b>Discount horizon.</b> A reward of $10$ arriving three steps later is worth $10\\gamma^3$:</p>
    <ol class="work"><li>$\\gamma=0.1$: $10\\cdot0.1^3=0.010$</li><li>$\\gamma=0.9$: $10\\cdot0.9^3=7.290$</li><li>$\\gamma=0.99$: $10\\cdot0.99^3=9.703$</li></ol>
    <p>The discount is a mathematical statement about how far ahead the planner cares.</p>
    <p><b>POMDP belief update.</b> Prior $(0.6,0.4)$, transition prediction $(0.6,0.4)$, and observation likelihood $(0.2,0.9)$:</p>
    <ol class="work"><li>Unnormalized posterior $=(0.6\\cdot0.2,
0.4\\cdot0.9)=(0.12,0.36)$</li><li>Normalizer $=0.12+0.36=0.48$</li><li>Posterior $=(0.12/0.48,0.36/0.48)=(0.25,0.75)$</li></ol>
    <p>The hidden state is replaced by a belief state, and planning proceeds on that distribution.</p>`,
  pitfalls: String.raw`
    <ul><li><b>Using deterministic planning in stochastic domains.</b> Replacing $\\sum_{s'}P(s'|s,a)V(s')$ by a single best successor overstates reliability.</li><li><b>Choosing $\\gamma$ casually.</b> The difference between $0.010$ and $9.703$ for a delayed reward is entirely the discount term.</li><li><b>Forgetting to normalize beliefs.</b> Observation likelihoods produce unnormalized weights; they must sum to one before they are a belief.</li></ul>`
};
