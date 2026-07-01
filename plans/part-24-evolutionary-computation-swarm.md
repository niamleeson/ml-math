# Part 24 — Evolutionary Computation & Swarm Intelligence

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant family: F4 (Optimizer — black-box variant).

### 24.1 — Genetic algorithms   [notebook: 24.1-genetic-algorithms.ipynb]   (family: F4, gap)

**Lesson — Real World Applications (5):**
1. Hyperparameter search — rank 4 trial configs by validation fitness with lesson rule: shifted weights `{1,9,9,1}` sum to `20`, so two near-best configs each get `9/20=0.45` selection probability (lesson).
2. Feature subset selection — choose among binary masks when gradients do not exist; illustrative 20-member population over 18 generations reports best and mean fitness, matching the lesson's population-view scale.
3. Schedule/layout design — combine two good plans by crossover; lesson's parents `2` and `4` average to `3.0`, mutation `+0.5` gives child `3.5` and fitness `9.75` (lesson).
4. Rule-based bidding or targeting — probabilistic selection keeps weak-but-diverse candidates alive: edge candidates receive `1/20=0.05` each instead of zero (lesson).
5. Noisy simulator calibration — preserve best-so-far with elitism; illustrative population size `20` and generation budget `18` make `20×18=360` objective calls before final validation.

**Notebook plan:**
- Family: F4 Optimizer (black-box)
- Concept built once (D1): `genetic_optimize()` with shifted fitness-proportionate selection, crossover, mutation, elitism; verify `F(x)=-(x-3)^2+10` on `{0,2,4,6}` gives probabilities `{0.05,0.45,0.45,0.05}` and child `3.5` has fitness `9.75`.
- Datasets D1–D5: objective functions of rising difficulty — D1 1-D fitness (optimum known) · D2 2-D sphere · D3 multimodal Rastrigin · D4 constrained box+penalty objective · D5 20-D Rastrigin.
- Metric: best fitness across all rungs.
- Closing viz: (a) population-on-landscape panels per objective (b) best-fitness-vs-generation curve.
- Pitfall on D5: selection pressure too high causes premature variance collapse; reproduce with winner-heavy selection, fix with softer selection plus elitism and nonzero mutation.
- Notes: delete dead template helpers; CPU-only, NumPy; gap note: lesson is flagged gap, so implementation should re-check authoring depth before citation.

### 24.2 — Genetic programming   [notebook: 24.2-genetic-programming.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. Symbolic regression for science — evolve formulas from observations; lesson target `y=x^2+1` on 4 points has MSE `0.0` for `T2` and `2.0` for `T1`.
2. Feature construction — candidate transforms compete by prediction error plus size; with `λ=0.05`, an exact size-5 tree scores `0.25` (lesson).
3. Interpretable control rules — tree programs must stay valid under subtree crossover; illustrative arity-closed operator yields `0` invalid children in a 50-child batch.
4. Query or routing policies — parsimony prevents bloated decision logic; lesson size-9 exact tree scores `0.45`, worse than size-5 exact `0.25`.
5. Automated data-cleaning expressions — holdout scoring catches noise memorization; illustrative train MSE `0.0` but validation MSE `0.25` marks overfit symbolic noise.

**Notebook plan:**
- Family: F4 Optimizer (black-box)
- Concept built once (D1): `gp_optimize()` evolves expression trees with closure-safe mutation/crossover and parsimony; verify lesson data `x={-1,0,1,2}`, `y=x^2+1`, MSEs `2.0`, `0.0`, `2.5`, and `λ|T|` scores `0.25`, `0.45`, `0.40`.
- Datasets D1–D5: objective functions of rising difficulty — D1 1-D symbolic fitness with optimum `x^2+1` known · D2 2-D sphere-like expression target · D3 multimodal/noisy symbolic target · D4 constrained expression-size objective · D5 high-dimensional feature expression search.
- Metric: best fitness (negative validation MSE minus parsimony penalty) across all rungs.
- Closing viz: (a) population-on-landscape panels per objective using expression output/error surfaces (b) best-fitness-vs-generation curve.
- Pitfall on D5: bloat without behavioral gain; reproduce with `λ=0`, fix with parsimony pressure and validation fitness.
- Notes: delete dead template helpers; CPU-only, NumPy; include a tiny safe expression evaluator, no external GP package.

### 24.3 — Evolution strategies (CMA-ES)   [notebook: 24.3-evolution-strategies-cma-es.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. Robotics controller tuning — evaluate real-valued controller vectors without gradients; lesson four samples around target `(1,1)` choose elites `(1,0)` and `(0,1)`.
2. Simulator calibration — move the search mean by elite recombination; lesson top-two mean becomes `(0.5,0.5)`.
3. Sensor/beam parameter tuning — learn anisotropic directions; lesson elite covariance has variances `0.25` and cross term `-0.25`.
4. Expensive A/B knob optimization — budget is explicit: illustrative `λ=8` samples for `25` generations costs `200` objective calls.
5. Noisy objective tuning — regularize covariance because too few elites can make `C_t` singular; illustrative diagonal jitter `1e-6` keeps sampling valid.

**Notebook plan:**
- Family: F4 Optimizer (black-box)
- Concept built once (D1): `evolution_strategy()` samples from `N(m, σ²C)`, selects elites, updates mean/covariance; verify lesson distances to `(1,1)`, new mean `(0.5,0.5)`, covariance entries `0.25` and `-0.25`.
- Datasets D1–D5: objective functions of rising difficulty — D1 1-D quadratic bowl · D2 2-D sphere · D3 Ackley/Rastrigin multimodal · D4 constrained ellipse with penalty · D5 20-D ill-conditioned Rosenbrock/Rastrigin.
- Metric: best fitness/loss across all rungs.
- Closing viz: (a) population-on-landscape panels per objective with covariance ellipse where 2-D (b) best-fitness-vs-generation curve.
- Pitfall on D5: forgetting covariance regularization creates singular/overconfident sampling; reproduce with tiny elite set and no jitter, fix with diagonal regularization plus minimum variance.
- Notes: delete dead template helpers; CPU-only, NumPy; implement a small CMA-ES-inspired ES, not a full dependency.

### 24.4 — Differential evolution   [notebook: 24.4-differential-evolution.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. Continuous engineering design — mutate from population differences; lesson `a=(1,1)`, `b-c=(3,-2)`, `F=0.5` yields mutant `(2.5,0)`.
2. Model calibration with non-smooth loss — greedy replacement keeps a better trial; lesson old loss `5.0` vs trial `1.25` triggers replacement.
3. Ad auction or budget allocation knobs — crossover rate controls coordinate mixing; illustrative `CR=0.8` copies about `4` of `5` coordinates from mutant in expectation.
4. Hyperparameter optimization — population diversity sets step scale; illustrative 30 vectors over 40 generations costs `1200` objective calls.
5. Black-box simulator fitting under noise — re-evaluate close trials; illustrative average of `3` noisy evaluations reduces single lucky replacement risk.

**Notebook plan:**
- Family: F4 Optimizer (black-box)
- Concept built once (D1): `differential_evolution()` forms `v=a+F(b-c)`, crosses to `u`, greedily replaces; verify lesson mutant `(2.5,0)` and replacement because `1.25 < 5.0`.
- Datasets D1–D5: objective functions of rising difficulty — D1 1-D fitness (optimum known) · D2 2-D sphere · D3 multimodal Rastrigin/Ackley · D4 constrained bounds+penalty · D5 30-D Rastrigin.
- Metric: best fitness/loss across all rungs.
- Closing viz: (a) population-on-landscape panels per objective showing target/trial arrows (b) best-fitness-vs-generation curve.
- Pitfall on D5: population too small makes `b-c` uninformative; reproduce with tiny population collapse, fix with larger population and diversity floor/restarts.
- Notes: delete dead template helpers; CPU-only, NumPy; keep bounds handling explicit.

### 24.5 — Multi-objective optimization (NSGA-II)   [notebook: 24.5-multi-objective-optimization-nsga-ii.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. Accuracy-versus-latency model selection — preserve a menu of tradeoffs; lesson first front has 4 non-dominated points: `(1,5),(2,3),(3,2),(5,1)`.
2. Cost-versus-quality recommender tuning — dominance removes inferior candidates; lesson `(3,4)` is dominated by `(2,3)`.
3. Fairness-versus-utility decisions — avoid premature scalar weights; illustrative weights can choose 1 point while Pareto rank keeps all 4 front points.
4. Compression/quantization search — crowding protects endpoints; lesson boundary points get infinite crowding distance.
5. Portfolio/risk optimization — maintain spread inside the front; lesson interior crowding distance for `(2,3)` is `0.50+0.75=1.25`.

**Notebook plan:**
- Family: F4 Optimizer (black-box)
- Concept built once (D1): `nsga2_optimize()` computes dominance fronts and crowding distance; verify lesson front from six objective pairs and crowding distance `1.25` for `(2,3)`.
- Datasets D1–D5: objective functions of rising difficulty — D1 1-D two-objective toy with known Pareto front · D2 2-D sphere tradeoff · D3 multimodal bi-objective Rastrigin/Ackley · D4 constrained bi-objective with feasibility penalty · D5 high-dimensional or 3-objective tradeoff.
- Metric: hypervolume across all rungs.
- Closing viz: (a) population-on-landscape/Pareto-front panels per objective set (b) hypervolume-vs-generation curve.
- Pitfall on D5: keeping only rank collapses to a crowded cluster; reproduce rank-only NSGA, fix with normalized crowding distance and endpoint preservation.
- Notes: delete dead template helpers; CPU-only, NumPy; label dominated vs non-dominated points clearly.

### 24.6 — Particle swarm optimization   [notebook: 24.6-particle-swarm-optimization.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. Continuous parameter tuning — particles share discoveries; lesson particle at `(0,4)` moves to `(0,2.8)` after social pull.
2. Robotics path/controller knobs — inertia controls exploration; lesson speed is `0.224` for `w=0.2`, `0.783` for `w=0.7`, `1.118` for `w=1.0`.
3. Antenna/beam shape optimization — personal and global memory keep multiple basins alive; illustrative 25 particles track 25 personal bests plus 1 global best.
4. Simulation calibration — social weight too high can collapse early; illustrative `c2=3.0` versus `c2=1.0` compares convergence and diversity.
5. Bounded allocation problems — explicit clipping/reflection handles feasibility; illustrative 2-D bound `[-5,5]^2` catches any coordinate outside a 10-unit width.

**Notebook plan:**
- Family: F4 Optimizer (black-box)
- Concept built once (D1): `particle_swarm_optimize()` updates velocity with inertia, cognitive, and social terms; verify lesson update from `(0,4)` to `(0,2.8)` and inertia-only speeds `0.224`, `0.783`, `1.118`.
- Datasets D1–D5: objective functions of rising difficulty — D1 1-D fitness (optimum known) · D2 2-D sphere · D3 multimodal Ackley/Rastrigin · D4 constrained bounded objective · D5 30-D Rastrigin.
- Metric: best fitness/loss across all rungs.
- Closing viz: (a) population-on-landscape panels per objective with velocity traces (b) best-fitness-vs-generation curve.
- Pitfall on D5: social weight too high collapses the swarm around an early lucky global best; reproduce high `c2`, fix with balanced `w,c1,c2`, velocity clipping, and local-best variant.
- Notes: delete dead template helpers; CPU-only, NumPy; deterministic RNG vectors.

### 24.7 — Ant colony optimization   [notebook: 24.7-ant-colony-optimization.ipynb]   (family: F4)

**Lesson — Real World Applications (5):**
1. Vehicle routing — construct tours probabilistically; lesson initial probabilities from node 0 are `0.735`, `0.184`, `0.082`.
2. Network path selection — pheromone stores edge memory; lesson evaporation/deposit changes `(1,1,1)` to `(1.3,0.8,1.8)`.
3. Job-shop scheduling — good components become more likely but not guaranteed; lesson unused edge keeps pheromone `0.8`, not zero.
4. Assignment and matching — local heuristic can dominate if `β` is too high; illustrative `η=1/distance` makes distance `1` score `9×` distance `3` before normalization.
5. Graph-based planning — evaporation prevents lock-in; lesson edge 3 has `1.8/0.8=2.25` times the unused edge after one update.

**Notebook plan:**
- Family: F4 Optimizer (black-box)
- Concept built once (D1): `ant_colony_optimize()` builds tours from pheromone and heuristic probabilities, then evaporates/deposits; verify lesson probabilities `0.735/0.184/0.082` and update `(1.3,0.8,1.8)`.
- Datasets D1–D5: objective functions of rising difficulty — D1 1-D/line path fitness with known optimum · D2 2-D Euclidean sphere-like routing toy · D3 multimodal clustered TSP · D4 constrained route with forbidden edges/time windows · D5 40-city TSP or multi-objective route cost.
- Metric: best fitness (negative tour cost) across all rungs.
- Closing viz: (a) population-on-landscape panels per objective showing tours/pheromone edges (b) best-fitness-vs-generation curve.
- Pitfall on D5: no evaporation or alpha too high freezes early pheromone; reproduce `ρ=0`, fix with `ρ>0`, pheromone bounds, and exploration floor.
- Notes: delete dead template helpers; CPU-only, NumPy; use small generated coordinates, no downloads.

### 24.8 — Neuroevolution (NEAT)   [notebook: 24.8-neuroevolution-neat.ipynb]   (family: F4, gap)

**Lesson — Real World Applications (5):**
1. Neural architecture search — evolve weights and topology; lesson compatibility distance uses `E=0`, `D=2`, `N=3`, `Wbar=0.2`.
2. Reinforcement-learning controllers — protect new structures until weights adapt; lesson distance `δ=0.747` shows topology drives species separation.
3. Sparse/delayed reward tasks — mutation may hurt before selection improves it; lesson error worsens from `0.25` to `1.0` after one weight mutation.
4. Tiny embedded models — gradual complexification starts simple; illustrative add-node mutation increases hidden-node count by `1` at a time.
5. Graph-structured policy search — innovation numbers align crossover; lesson matching genes are `1` and `4`, while disjoint genes are `2` and `3`.

**Notebook plan:**
- Family: F4 Optimizer (black-box)
- Concept built once (D1): `neat_like_optimize()` evolves tiny neural genomes with weight mutation, add-connection/add-node, innovation numbers, and speciation; verify lesson prediction/error and compatibility distance `δ=0.747`.
- Datasets D1–D5: objective functions of rising difficulty — D1 1-D fitness for a tiny linear net (optimum known) · D2 2-D sphere-like regression/classification toy · D3 multimodal XOR/moons landscape · D4 constrained topology budget objective · D5 higher-dimensional noisy control/regression or multi-objective accuracy-vs-size.
- Metric: best fitness across all rungs.
- Closing viz: (a) population-on-landscape panels per objective plus small network topology thumbnails (b) best-fitness-vs-generation curve.
- Pitfall on D5: removing speciation kills new structures before weights adapt; reproduce no-speciation collapse, fix with `δ`-based species and fitness sharing.
- Notes: delete dead template helpers; CPU-only, NumPy; gap note: lesson is flagged gap, so keep scope tiny and cite only existing calculations.

### 24.9 — Memetic algorithms   [notebook: 24.9-memetic-algorithms.ipynb]   (family: F4, gap)

**Lesson — Real World Applications (5):**
1. AutoML pipeline search — evolutionary search finds a basin, local tuning polishes it; lesson local step moves `x=2` to `2.4`.
2. Operations-research routing/scheduling — pair crossover/mutation with 2-opt or swap descent; lesson objective improves from `1.0` to `0.36` after polishing.
3. Hyperparameter tuning — compare by evaluation budget, not generations; illustrative 20 children with 5 local steps each costs `100` extra objective calls.
4. Neural weight initialization search — local gradient step is valid for differentiable vectors; lesson gradient at `x=2` is `-2` with `η=0.2`.
5. Permutation design problems — meme must match representation; illustrative swap-neighborhood local search preserves a valid permutation of `n` items while a raw gradient step would not.

**Notebook plan:**
- Family: F4 Optimizer (black-box)
- Concept built once (D1): `memetic_optimize()` runs a GA-style population then applies bounded local search to selected children; verify lesson gradient step `x'=2-0.2(-2)=2.4` and objective drop `1.0→0.36`.
- Datasets D1–D5: objective functions of rising difficulty — D1 1-D quadratic fitness (optimum known) · D2 2-D sphere · D3 multimodal Rastrigin/Ackley · D4 constrained objective with feasible local moves · D5 high-dimensional or multi-objective objective with local-search budget accounting.
- Metric: best fitness/loss per objective evaluation across all rungs.
- Closing viz: (a) population-on-landscape panels per objective showing pre/post-local-search points (b) best-fitness-vs-generation/evaluation curve.
- Pitfall on D5: local search everywhere collapses diversity into multi-start local search; reproduce over-polishing every child, fix with partial/local-budgeted polishing and diversity-preserving selection.
- Notes: delete dead template helpers; CPU-only, NumPy; gap note: lesson is flagged gap, so implementation should keep the meme examples tightly grounded in existing math.
