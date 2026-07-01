# Part 22 — Search & Planning

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant family: F16 (Algorithmic-Instance).

### 22.1 — Uninformed search (BFS, DFS, UCS)   [notebook: 22.1-uninformed-search.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Warehouse robot routing — shortest unweighted aisle route uses BFS; lesson grid path has `9-1=8` moves.
2. Game-map reachability — DFS can find a playable but non-shortest route; lesson DFS route has `17-1=16` moves, `8` extra vs BFS.
3. Road routing with toll/terrain costs — UCS avoids expensive cells; lesson compares cost `24` through penalties vs `8` around them.
4. Web crawl frontier control — queue/stack/priority discipline decides crawl order; illustrative frontier cap `1000` URLs means BFS stores broad layers, DFS stores a path.
5. Network troubleshooting — visited-set closure prevents cycles; illustrative 4-router cycle without visited can re-enter forever, with visited expands each router once.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `search(method, graph, start, goal, costs=None)` with BFS/DFS/UCS frontier rules; verify lesson numbers on a `5x5` grid: BFS `8` moves, DFS `16` moves, UCS cost `8` vs expensive route `24`.
- Datasets D1–D5: search instances of rising size/branching/deceptiveness — D1 tiny `5x5` lattice/graph trace by hand · D2 wider branching unweighted maze · D3 deeper maze with cycles · D4 weighted grid with expensive bands · D5 largest weighted maze where a shallow high-cost corridor deceives BFS.
- Metric: path cost and nodes expanded across all rungs.
- Closing viz: (a) search-tree/grid with expanded/kept nodes highlighted per instance (b) path-cost-and-nodes-vs-size curve.
- Pitfall on D5: using BFS on weighted edges, reproduced by choosing the shallow expensive route, then fixed with UCS.
- Notes: delete dead template code; replace hardcoded lattices with generated grid/weighted-graph instances; CPU-only, pure Python; no gap.

### 22.2 — Iterative deepening & bidirectional search   [notebook: 22.2-iterative-deepening-bidirectional-search.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Puzzle solving under memory limits — IDDFS reaches depth `4` goal only when limit becomes `4`; path states `5`, moves `4`.
2. Social graph connection search — bidirectional search cuts storage from one frontier `4^8=65,536` to `2*4^4=512` in the lesson example.
3. Package dependency resolution — repeated shallow passes are acceptable when final layer dominates; lesson total touches `33` vs final pass `15`.
4. Meet-in-the-middle password toy auditing — illustrative branching `10`, depth `6`: one side `10^6`, two sides `2*10^3=2000` candidates.
5. Route planning with reversible roads — bidirectional search requires true predecessors; illustrative one-way edge invalidates the backward frontier.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `iddfs()` and `bidirectional_bfs()` over reversible graph generators; verify lesson arithmetic: limit `3` fails, limit `4` succeeds, touches `1+3+6+8+15=33`, and `4^8` vs `2*4^4`.
- Datasets D1–D5: search instances of rising size/branching/deceptiveness — D1 tiny line/grid depth-4 trace · D2 wider reversible tree · D3 deeper grid with repeated expansions · D4 high-branching reversible synthetic graph · D5 largest graph with some irreversible-looking actions.
- Metric: nodes touched/expanded and peak frontier memory across all rungs.
- Closing viz: (a) forward/backward/limit search trees with expanded/kept nodes highlighted per instance (b) nodes-or-memory-vs-depth curve.
- Pitfall on D5: using bidirectional search without reversible actions, reproduced by a false backward edge, then fixed by validating predecessor generation or falling back to IDDFS/BFS.
- Notes: delete dead template code; replace fixed examples with generated trees/grids; CPU-only, pure Python; no gap.

### 22.3 — Informed search & A*   [notebook: 22.3-informed-search-a-star.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Map navigation — Manhattan heuristic on four-neighbor grids starts at `|4|+|4|=8` and reaches `0` at goal.
2. Robot path planning around obstacles — lesson A* returns path states `9`, so cost `9-1=8`.
3. Logistics routing with admissible travel estimates — `h=0` is safe but becomes UCS; lesson calls this admissible but uninformative.
4. Game pathfinding with weighted greediness — weighted A* priority at start is `0+2*8=16`, and at `g=3,h=5` is `13`.
5. Indoor navigation units checks — mixing meters and seconds is invalid; illustrative `g=30 seconds + h=10 meters` has no coherent `f`.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `astar(graph, h, weight=1)` and UCS via `h=0`; verify lesson formula `f(n)=g(n)+h(n)`, Manhattan `8`, path cost `8`, weighted priorities `16` and `13`.
- Datasets D1–D5: search instances of rising size/branching/deceptiveness — D1 tiny `5x5` grid trace · D2 wider open grid · D3 deeper maze with walls · D4 weighted terrain grid · D5 largest grid with an overestimating/deceptive heuristic.
- Metric: optimality gap and nodes expanded across all rungs.
- Closing viz: (a) grid/search-tree with expanded/kept nodes highlighted per instance (b) optimality-gap-and-nodes-vs-size curve.
- Pitfall on D5: overestimating with `h`, reproduced by skipping the true optimum, then fixed with admissible Manhattan or UCS fallback.
- Notes: delete dead template code; generate grid/wall/terrain instances deterministically; CPU-only, pure Python; no gap.

### 22.4 — Local search (hill climbing, simulated annealing, tabu)   [notebook: 22.4-local-search.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Shift scheduling — complete schedules are states and neighbor swaps are edits; illustrative `10` swaps define `10` neighbors.
2. Delivery route improvement — hill climbing visits the lesson path `0,1,2,3,4,5,6,7`, `8` states total.
3. Layout optimization — local optimum may miss global peak; lesson trap ends at `x=3` while better peak is `x=8`, miss distance `5`.
4. Hyperparameter tuning by random perturbation — annealing can accept downhill moves with probability `exp(Delta/T)`; illustrative `Delta=-2,T=1` gives `exp(-2)`.
5. Tabu-based timetabling — memory prevents bouncing; illustrative tabu length `3` forbids the last `3` visited assignments.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `local_search(strategy, landscape, start)` for hill climb, annealing, tabu; verify lesson path length `8`, local-vs-global locations `3` and `8`, and `exp(Delta/T)` downhill acceptance.
- Datasets D1–D5: search instances of rising size/branching/deceptiveness — D1 1D eight-step landscape trace · D2 wider smooth landscape · D3 deeper landscape with one valley · D4 multimodal assignment landscape · D5 largest deceptive landscape where cooling/memory choices matter.
- Metric: final solution quality and gap to known best across all rungs.
- Closing viz: (a) landscape/search path with expanded/kept candidate nodes highlighted per instance (b) quality-gap-vs-size curve.
- Pitfall on D5: calling a local optimum global, reproduced by hill climbing into the trap, then fixed with annealing restarts or short tabu.
- Notes: delete dead template code; replace fixed arrays with generated landscapes/assignments; CPU-only, pure Python; no gap.

### 22.5 — Beam search   [notebook: 22.5-beam-search.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Speech transcription decoding — beam width `k` keeps only top candidates; lesson width `1` keeps `A=5` over `B=4`.
2. Machine translation candidate generation — width `2` preserves delayed payoff branch `B`, yielding `BA=10`.
3. Autocomplete ranking — greedy width `1` returns `AB=6` in the lesson, missing better delayed branch at width `2`.
4. Program synthesis search — successor generation can exceed retained beam; illustrative `k=5`, branching `20` creates `100` successors before pruning.
5. Document summarization length control — lesson raw-vs-normalized scores differ: short `6/2=3.0`, long `9/5=1.8`.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `beam_search(successors, score, width, normalize=False)`; verify lesson width-1 choice `AB=6`, width-2 `BA=10`, and normalization `6/2=3.0` vs `9/5=1.8`.
- Datasets D1–D5: search instances of rising size/branching/deceptiveness — D1 tiny two-layer sequence tree trace · D2 wider branching sequence tree · D3 deeper delayed-reward tree · D4 variable-length scoring tree · D5 largest deceptive delayed-payoff tree with narrow beams.
- Metric: solution quality gap and candidates generated across all rungs.
- Closing viz: (a) layered search-tree with expanded/kept/pruned nodes highlighted per instance (b) quality-gap-or-generated-nodes-vs-size curve.
- Pitfall on D5: treating beam search as optimal / beam too narrow, reproduced by pruning the delayed winner, then fixed by wider beam and length normalization where needed.
- Notes: delete dead template code; replace hardcoded sequences with generated scored trees; CPU-only, pure Python; no gap.

### 22.6 — Adversarial search (minimax, alpha-beta)   [notebook: 22.6-adversarial-search.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Board-game engines — minimax chooses `A` because `min(3,5)=3` beats `min(2,9)=2`.
2. Competitive bidding simulations — max cannot rely on best leaf `9` if opponent can force branch value `2`.
3. Alpha-beta pruning in chess-like search — lesson good ordering visits `3` of `4` leaves, pruning `1`.
4. Security attack-defense planning — worst-case response modeling uses max/min; illustrative two defenses with worst cases `-1` and `2` pick `2`.
5. Depth-limited game AI — lesson evaluation features produce dot products `3`, `-1`, and `6` from weights `(2,-1)`.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `minimax(node, depth)` and `alpha_beta(node, depth, order)`; verify lesson leaves `[[3,5],[2,9]]`, root value `3`, visited leaves `3/4`, and evaluation dot products.
- Datasets D1–D5: search instances of rising size/branching/deceptiveness — D1 two-ply four-leaf tree trace · D2 wider well-ordered game tree · D3 deeper poorly ordered tree · D4 depth-limited heuristic tree · D5 largest tree with misleading high leaves and bad ordering.
- Metric: backed-up value accuracy and leaves/nodes evaluated across all rungs.
- Closing viz: (a) minimax tree with expanded/kept/pruned nodes highlighted per instance (b) value-error-and-leaves-vs-size curve.
- Pitfall on D5: maximizing the best leaf / trusting depth-limited values too much, reproduced by picking a tempting leaf, then fixed with proper minimax backup and improved ordering.
- Notes: delete dead template code; generate game trees with deterministic leaf/evaluation functions; CPU-only, pure Python; no gap.

### 22.7 — Monte Carlo Tree Search   [notebook: 22.7-monte-carlo-tree-search.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Go/chess-like move selection — UCB balances win mean and uncertainty; lesson child `B` UCB `2.213` beats `A=1.366`, `C=1.482`.
2. Online experiment allocation — low-visit options get exploration bonus; lesson `B` has only `2` visits before selection.
3. Real-time game AI rollouts — backup after successful rollout changes `B` from wins/visits `1/2` to `2/3=0.667`.
4. Robotic action sampling — final action often by visits; lesson best empirical arm gets `47/103=0.456` visit share.
5. Planning with simulators — rollout policy quality matters; illustrative `100` random rollouts estimate random-play value, not expert value.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `mcts(root, rollouts, c)` with UCB selection, rollout, backup; verify lesson UCB values, `2/3=0.667` backup, and visit share `47/103=0.456`.
- Datasets D1–D5: search instances of rising size/branching/deceptiveness — D1 tiny 3-child bandit/tree trace · D2 wider shallow tree · D3 deeper stochastic tree · D4 sparse-reward rollout tree · D5 largest deceptive tree where low exploration locks onto lucky starts.
- Metric: action quality/regret and visits/nodes expanded across all rungs.
- Closing viz: (a) partial search tree with expanded/kept nodes and visit counts highlighted per instance (b) regret-or-visit-efficiency-vs-size curve.
- Pitfall on D5: using too little exploration, reproduced by small `c` locking onto a lucky child, then fixed with lesson UCB exploration bonus and more realistic rollouts.
- Notes: delete dead template code; generate stochastic trees with seeded rewards; CPU-only, pure Python; no gap.

### 22.8 — Automated planning (STRIPS, PDDL)   [notebook: 22.8-automated-planning-strips-pddl.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Robot navigation — `MoveAB` deletes `AtA` and adds `AtB`, keeping lesson fact count `2`.
2. Warehouse pick-and-place planning — forward plan `AtA -> AtB -> AtC` has lesson plan length `2`.
3. Workflow automation — preconditions gate legal actions; illustrative action with `2` required facts fails if `1` is missing.
4. Disaster-response task planning — regression through `MoveBC` turns goal `{AtC}` into required facts `{AtB,RoadBC}` of size `2`.
5. Game quest planning — delete effects prevent contradictory state; without deleting `AtA`, illustrative agent could be in `2` places.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `apply_action(S, action)` and BFS planner over fact sets; verify lesson successor formula, `MoveAB` fact count `2`, plan length `2`, and regression subgoal `{AtB,RoadBC}`.
- Datasets D1–D5: search instances of rising size/branching/deceptiveness — D1 three-location STRIPS trace · D2 wider road network facts · D3 deeper package-delivery domain · D4 interacting goals with deletes · D5 largest domain where goal-count heuristic is deceptive.
- Metric: plan length/solution quality and nodes expanded across all rungs.
- Closing viz: (a) fact-set search/proof tree with expanded/kept states highlighted per instance (b) plan-length-and-nodes-vs-size curve.
- Pitfall on D5: forgetting delete effects or using goal-count heuristics blindly, reproduced by stale facts/false shortcut, then fixed with proper `(S\Del)∪Add` and interaction-aware search.
- Notes: delete dead template code; generate STRIPS domains and fact sets, not hardcoded examples; CPU-only, pure Python; no gap.

### 22.9 — Hierarchical & partial-order planning   [notebook: 22.9-hierarchical-partial-order-planning.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Travel itinerary planning — `Travel -> (Pack,Drive,Park)` decomposes into lesson `3` primitive steps.
2. Manufacturing workflows — HTN reduces branching; lesson flat `6*6*6=216` vs HTN `2*3=6`, reduction factor `36`.
3. Kitchen/service scheduling — partial-order plan with Buy, Cook, SetTable has `3!=6` total orders and `3` valid with Buy before Cook.
4. Cloud deployment orchestration — delayed ordering preserves concurrency; illustrative `4` independent steps have `4!=24` possible orders until constraints appear.
5. Construction project planning — threat detection orders deleter steps; illustrative one deleter must be placed before producer or after consumer, `2` safe regions.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `decompose_htn(task)` and `partial_order_plans(steps,constraints,threats)`; verify lesson `3` primitive steps, `216/6=36` reduction, and `3` valid partial-order schedules.
- Datasets D1–D5: search instances of rising size/branching/deceptiveness — D1 tiny Travel HTN and 3-step POP trace · D2 wider method library · D3 deeper nested hierarchy · D4 partial-order plan with threats · D5 largest domain with missing/bad methods and overconstraints.
- Metric: valid plan found, search nodes, and ordering-flexibility count across all rungs.
- Closing viz: (a) HTN/partial-order search tree with expanded/kept constraints highlighted per instance (b) nodes-or-flexibility-vs-size curve.
- Pitfall on D5: overconstraining the plan or trusting bad methods, reproduced by losing valid orders/valid plans, then fixed by minimal constraints and method coverage checks.
- Notes: delete dead template code; generate HTN methods/constraints/threats deterministically; CPU-only, pure Python; no gap.

### 22.10 — Planning under uncertainty (MDP/POMDP planning)   [notebook: 22.10-planning-under-uncertainty.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Robot navigation with slipping actions — Bellman backup uses expected value; lesson expected next value `0.2*0+0.8*10=8.0`.
2. Medical treatment planning — action value combines immediate and future reward; lesson total `Q=1+0.9*8.0=8.2`.
3. Inventory control — discount encodes horizon; lesson delayed reward `10` after `3` steps is `0.010`, `7.290`, or `9.703` for gamma `0.1`, `0.9`, `0.99`.
4. Sensor-based localization — POMDP belief update normalizes weights `(0.12,0.36)` by `0.48` to posterior `(0.25,0.75)`.
5. Ad placement/budget planning — stochastic outcomes require summing probabilities; illustrative two outcomes with probabilities `0.3,0.7` must sum to `1.0` before backup.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `bellman_backup()` and `belief_update()`; verify lesson Bellman equation, `Q=8.2`, discount values `0.010/7.290/9.703`, and posterior `(0.25,0.75)`.
- Datasets D1–D5: search instances of rising size/branching/deceptiveness — D1 two-state MDP/POMDP trace · D2 wider deterministic-ish MDP · D3 deeper stochastic chain · D4 grid MDP with noisy transitions · D5 largest hidden-state problem where deterministic planning or unnormalized beliefs fails.
- Metric: value error / policy quality and backups expanded across all rungs.
- Closing viz: (a) value/belief search tree or state map with expanded/kept states highlighted per instance (b) value-error-or-policy-quality-vs-size curve.
- Pitfall on D5: using deterministic planning in stochastic domains or forgetting to normalize beliefs, reproduced by best-successor backup/unnormalized posterior, then fixed with expectation and normalization.
- Notes: delete dead template code; generate MDP/POMDP instances with seeded transition tables; CPU-only, pure Python; no gap.
