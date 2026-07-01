/* All ML — Part 24 applications (5 each). Loaded after content-part-24.js, before all-ml-register.js. */

/* ---- _apps-part24-A.js ---- */
(window.ALLML_CONTENT["24.1"] = window.ALLML_CONTENT["24.1"] || {}).applications = [
  {
    title: "Hyperparameter search",
    background: `<p>Genetic algorithms are useful when a training run exposes choices such as architecture flags, augmentation settings, or thresholds that do not form a smooth differentiable vector. The population is a batch of trial configurations, and validation fitness supplies the selection pressure.</p>`,
    numbers: `<p>For the lesson landscape $F(x)=-(x-3)^2+10$ on $\{0,2,4,6\}$, the shifted weights are $\{1,9,9,1\}$ with sum $20$. The two near-best configurations therefore each receive $\frac{9}{20}=0.45$ selection probability, while edge configurations each retain $\frac{1}{20}=0.05$.</p>`
  },
  {
    title: "Feature subset selection",
    background: `<p>A binary feature mask is a natural genome when gradients through feature inclusion do not exist. Crossover exchanges blocks of selected features, mutation flips individual bits, and validation performance scores each mask.</p>`,
    numbers: `<p>The plan uses an illustrative population-view scale of $20$ masks over $18$ generations. That produces $20\times18=360$ mask evaluations before a final validation check, enough to report both best fitness and mean population fitness instead of a single lucky mask.</p>`
  },
  {
    title: "Schedule and layout design",
    background: `<p>Many schedules, layouts, and assignment plans have discrete pieces that can be recombined. A genetic algorithm can cross two workable plans, perturb the result, and keep the best feasible descendants.</p>`,
    numbers: `<p>The lesson's crossover averages parents $2$ and $4$ to get $3.0$. A mutation of $+0.5$ creates child $3.5$, whose fitness is $F(3.5)=-(3.5-3)^2+10=9.75$.</p>`
  },
  {
    title: "Rule-based bidding or targeting",
    background: `<p>Rule sets for bidding or targeting often mix thresholds, categorical choices, and exceptions. Probabilistic selection helps keep weak but diverse candidates alive long enough for crossover to reuse their useful pieces.</p>`,
    numbers: `<p>With shifted weights $\{1,9,9,1\}$, the weakest edge candidates are not assigned zero probability. Each still receives $\frac{1}{20}=0.05$, so one out of about $20$ parent tickets can still explore an edge rule.</p>`
  },
  {
    title: "Noisy simulator calibration",
    background: `<p>Simulator calibration can be noisy because the same parameters may produce slightly different measured outcomes. Elitism preserves the best-so-far candidate while the rest of the population continues to sample alternatives.</p>`,
    numbers: `<p>Using the plan's illustrative budget, population size $20$ for $18$ generations costs $20\times18=360$ objective calls before final validation. That budget should be counted explicitly because every simulator call may be expensive.</p>`
  }
];

(window.ALLML_CONTENT["24.2"] = window.ALLML_CONTENT["24.2"] || {}).applications = [
  {
    title: "Symbolic regression for science",
    background: `<p>Genetic programming searches over formulas rather than numeric vectors, which makes it attractive when scientists want a compact expression that explains observed measurements.</p>`,
    numbers: `<p>On $x=\{-1,0,1,2\}$ with target $y=x^2+1=\{2,1,2,5\}$, $T_1(x)=x+1$ has squared errors $\{4,0,0,4\}$ and MSE $2.0$. The exact tree $T_2(x)=x^2+1$ has MSE $0.0$.</p>`
  },
  {
    title: "Feature construction",
    background: `<p>Tree programs can build reusable nonlinear transforms for downstream models. The search rewards predictive behavior while parsimony keeps the transform small enough to inspect and deploy.</p>`,
    numbers: `<p>With parsimony weight $\lambda=0.05$, an exact size-$5$ tree has score contribution $0.0+0.05\cdot5=0.25$. A size-$9$ exact tree costs $0.45$, so extra syntax loses unless it reduces error.</p>`
  },
  {
    title: "Interpretable control rules",
    background: `<p>Controllers written as expression trees can be inspected, tested, and constrained. Closure-safe subtree crossover is critical because every child must remain executable after two parents exchange subtrees.</p>`,
    numbers: `<p>The notebook reproduces the plan's arity-closed batch check: $50$ subtree-crossover children are evaluated and the invalid-child count is asserted to be $0$.</p>`
  },
  {
    title: "Query or routing policies",
    background: `<p>Routing and query policies can become bloated if neutral branches accumulate. Parsimony pressure acts like regularization, preferring the smaller expression when behavior is tied.</p>`,
    numbers: `<p>Two exact trees with sizes $5$ and $9$ score $0.25$ and $0.45$ when $\lambda=0.05$. The size-$5$ policy wins because $0.25\lt0.45$.</p>`
  },
  {
    title: "Automated data-cleaning expressions",
    background: `<p>Data-cleaning rules can overfit small labeled examples by memorizing quirks. A validation split catches expressions that look perfect on the construction set but fail on held-out rows.</p>`,
    numbers: `<p>The plan's illustrative overfit case has train MSE $0.0$ but validation MSE $0.25$. The validation penalty shows the expression learned symbolic noise rather than a reusable cleaning rule.</p>`
  }
];

(window.ALLML_CONTENT["24.3"] = window.ALLML_CONTENT["24.3"] || {}).applications = [
  {
    title: "Robotics controller tuning",
    background: `<p>Evolution strategies tune real-valued controller parameters when gradients through hardware or simulation are unavailable. Samples around the current mean are evaluated, and elites steer the next mean.</p>`,
    numbers: `<p>For target $(1,1)$, lesson samples $(1,0),(0,1),(2,2),(-1,0)$ have squared distances $1,1,2,5$. The elites are $(1,0)$ and $(0,1)$.</p>`
  },
  {
    title: "Simulator calibration",
    background: `<p>Calibration parameters can be continuous but black-box. Elite recombination moves the sampling distribution toward settings that make simulator outputs match measurements.</p>`,
    numbers: `<p>The top-two lesson elites average to $((1,0)+(0,1))/2=(0.5,0.5)$. That update moves the search mean toward the target without using a derivative.</p>`
  },
  {
    title: "Sensor or beam parameter tuning",
    background: `<p>CMA-ES-style covariance adaptation matters when successful perturbations lie along a tilted direction. The covariance matrix stores that orientation for future samples.</p>`,
    numbers: `<p>Centering $(1,0)$ and $(0,1)$ around $(0.5,0.5)$ gives vectors $(0.5,-0.5)$ and $(-0.5,0.5)$. The biased variances are $0.25$, and the cross term is $-0.25$.</p>`
  },
  {
    title: "Expensive A/B knob optimization",
    background: `<p>When each trial is expensive, evolution strategies make the evaluation budget explicit. The population size $\lambda$ multiplied by generations is the number of black-box calls.</p>`,
    numbers: `<p>The plan's illustrative budget uses $\lambda=8$ samples for $25$ generations, so the optimizer spends $8\times25=200$ objective calls.</p>`
  },
  {
    title: "Noisy objective tuning",
    background: `<p>Noisy elite choices can corrupt a covariance estimate, especially when the elite set is tiny. Diagonal regularization keeps sampling numerically valid even when the empirical covariance is nearly singular.</p>`,
    numbers: `<p>The notebook uses the lesson's diagonal jitter scale $10^{-6}$. Adding $10^{-6}I$ keeps every covariance diagonal positive before drawing the next Gaussian sample.</p>`
  }
];

(window.ALLML_CONTENT["24.4"] = window.ALLML_CONTENT["24.4"] || {}).applications = [
  {
    title: "Continuous engineering design",
    background: `<p>Differential evolution is well suited to continuous design knobs because it creates steps from differences among existing candidate designs. The population itself sets the mutation scale.</p>`,
    numbers: `<p>With $a=(1,1)$, $b=(3,0)$, $c=(0,2)$, and $F=0.5$, the difference is $b-c=(3,-2)$. The mutant is $a+0.5(b-c)=(2.5,0)$.</p>`
  },
  {
    title: "Model calibration with non-smooth loss",
    background: `<p>Greedy replacement makes DE robust for calibration losses that are discontinuous or non-smooth. Each target competes only with its own trial child.</p>`,
    numbers: `<p>For target $(2,1)$, the old vector $(0,0)$ has loss $5.0$. The trial $(2.5,0)$ has loss $0.25+1=1.25$, and because $1.25\lt5.0$, replacement occurs.</p>`
  },
  {
    title: "Ad auction or budget allocation knobs",
    background: `<p>Crossover rate controls how much of the mutant vector enters the trial candidate. This is useful for allocation knobs where only some coordinates should change at once.</p>`,
    numbers: `<p>With $CR=0.8$ on a $5$-coordinate vector, the expected number of mutant coordinates is $0.8\times5=4$ before accounting for the forced coordinate that guarantees at least one mutant entry.</p>`
  },
  {
    title: "Hyperparameter optimization",
    background: `<p>DE can optimize real-valued hyperparameters without gradients, but the population and generation counts define the cost. Larger populations improve difference-vector diversity.</p>`,
    numbers: `<p>The plan's illustrative run uses $30$ vectors over $40$ generations. That costs $30\times40=1200$ objective calls.</p>`
  },
  {
    title: "Black-box simulator fitting under noise",
    background: `<p>Greedy replacement can be fooled by one lucky noisy evaluation. Re-evaluating close trials reduces the chance that noise alone replaces a genuinely better target.</p>`,
    numbers: `<p>The plan suggests averaging $3$ noisy evaluations for close decisions. If the single-call variance is $\sigma^2$, the mean of $3$ calls has variance $\sigma^2/3$.</p>`
  }
];

(window.ALLML_CONTENT["24.5"] = window.ALLML_CONTENT["24.5"] || {}).applications = [
  {
    title: "Accuracy-versus-latency model selection",
    background: `<p>NSGA-II keeps a menu of model choices when accuracy and latency conflict. A candidate is removed only when another is no worse on all objectives and better on at least one.</p>`,
    numbers: `<p>For the lesson pairs $(1,5),(2,3),(3,2),(5,1),(3,4),(4,3)$, the first Pareto front has $4$ non-dominated points: $(1,5),(2,3),(3,2),(5,1)$.</p>`
  },
  {
    title: "Cost-versus-quality recommender tuning",
    background: `<p>Dominance identifies recommender settings that should not survive because another candidate is simultaneously cheaper and better. This avoids hiding tradeoffs behind one scalar score.</p>`,
    numbers: `<p>The lesson point $(3,4)$ is dominated by $(2,3)$ because $2\le3$ and $3\le4$, with both objectives strictly better here.</p>`
  },
  {
    title: "Fairness-versus-utility decisions",
    background: `<p>Weighted sums can collapse a policy discussion to one chosen point before stakeholders see the frontier. Pareto ranking preserves multiple non-dominated alternatives for review.</p>`,
    numbers: `<p>In the lesson front, scalar weights might choose $1$ compromise point, while Pareto rank keeps all $4$ front points available for comparison.</p>`
  },
  {
    title: "Compression and quantization search",
    background: `<p>Compression searches often trade size, latency, and quality. Crowding distance protects the endpoints so the population does not keep only a dense middle cluster.</p>`,
    numbers: `<p>For the front $(1,5),(2,3),(3,2),(5,1)$, boundary points receive infinite crowding distance. That explicitly preserves the smallest-first-objective and smallest-second-objective endpoints.</p>`
  },
  {
    title: "Portfolio and risk optimization",
    background: `<p>Portfolio search needs spread along the efficient frontier, not just non-dominance. Crowding distance prefers isolated tradeoffs when a front has more candidates than survivor slots.</p>`,
    numbers: `<p>For interior point $(2,3)$, the lesson crowding contributions are $(3-1)/(5-1)=0.50$ and $(5-2)/(5-1)=0.75$. The total crowding distance is $0.50+0.75=1.25$.</p>`
  }
];

/* ---- _apps-part24-B.js ---- */
(window.ALLML_CONTENT["24.6"] = window.ALLML_CONTENT["24.6"] || {}).applications = [
  {
    title: "Continuous parameter tuning",
    background: "<p>PSO is useful when simulator or model parameters are continuous and gradients are unavailable or unreliable. Particles move through the parameter space while sharing the best location discovered by the swarm.</p>",
    numbers: "<p>Using the lesson update with $x=(0,4)$, $v=(0,0)$, $p=x$, $g=(0,0)$, $w=0.5$, $c_1=c_2=1$, and $r_2=(0.3,0.3)$, the social pull is $(0,-1.2)$, so the particle moves to $(0,2.8)$.</p>"
  },
  {
    title: "Robotics path and controller knobs",
    background: "<p>Robot controllers often expose real-valued gains whose objective is measured by rollout success rather than a differentiable loss. PSO's inertia term decides whether candidate controllers keep exploring or slow down near memories.</p>",
    numbers: "<p>For lesson velocity $(1,-0.5)$, inertia-only speeds are $\|(0.2,-0.1)\|=0.224$, $\|(0.7,-0.35)\|=0.783$, and $\|(1,-0.5)\|=1.118$, so larger $w$ preserves more motion.</p>"
  },
  {
    title: "Antenna and beam shape optimization",
    background: "<p>Beam-shape tuning is a black-box continuous search problem where good designs may sit in separate basins. PSO keeps each particle's personal best while still letting a global or local best guide the group.</p>",
    numbers: "<p>An illustrative 25-particle run stores 25 personal best positions plus 1 shared best, so the search maintains 26 memory objects while evaluating the same objective ladder.</p>"
  },
  {
    title: "Simulation calibration",
    background: "<p>Calibrating a simulator means repeatedly proposing parameter vectors and measuring mismatch. If the social coefficient is too large, the swarm can chase one early lucky vector.</p>",
    numbers: "<p>The plan compares illustrative $c_2=3.0$ with $c_2=1.0$; the former triples the social pull relative to the balanced case and can collapse diversity around an early $g$.</p>"
  },
  {
    title: "Bounded allocation problems",
    background: "<p>Allocation variables usually have hard lower and upper limits. A real PSO implementation must clip or reflect positions during the velocity update, not after reporting a solution.</p>",
    numbers: "<p>For the illustrative 2-D box $[-5,5]^2$, each coordinate has width $10$, so any coordinate below $-5$ or above $5$ is infeasible and must be corrected before evaluation.</p>"
  }
];

(window.ALLML_CONTENT["24.7"] = window.ALLML_CONTENT["24.7"] || {}).applications = [
  {
    title: "Vehicle routing",
    background: "<p>ACO constructs routes one edge at a time, making it natural for routing problems where local distance and learned edge quality both matter.</p>",
    numbers: "<p>From lesson node 0 with heuristic scores $1$, $1/4$, and $1/9$ and pheromone all 1, the score sum is $1+0.25+0.111=1.361$, giving probabilities $0.735$, $0.184$, and $0.082$.</p>"
  },
  {
    title: "Network path selection",
    background: "<p>Network routing can treat links as graph edges whose desirability changes after successful or cheap paths are observed. Pheromone is the reusable memory on those edges.</p>",
    numbers: "<p>With old pheromone $(1,1,1)$, evaporation $\rho=0.2$, and deposits $(0.5,0,1.0)$, the update is $(0.8,0.8,0.8)+(0.5,0,1.0)=(1.3,0.8,1.8)$.</p>"
  },
  {
    title: "Job-shop scheduling",
    background: "<p>Scheduling decisions are assembled step by step, like assigning the next operation or machine. ACO lets good components become more likely without deleting alternatives.</p>",
    numbers: "<p>The unused lesson edge keeps pheromone $0.8$ after evaporation rather than dropping to zero, so it remains sampleable in later schedules.</p>"
  },
  {
    title: "Assignment and matching",
    background: "<p>ACO can build assignments by repeatedly choosing among remaining matches. The heuristic exponent must be controlled so local attractiveness does not overpower learning from completed solutions.</p>",
    numbers: "<p>With illustrative $\eta=1/\text{distance}$ and $\beta=2$, distance 1 has score $1^2=1$, while distance 3 has score $(1/3)^2=1/9$, so the nearer edge is $9\times$ stronger before normalization.</p>"
  },
  {
    title: "Graph-based planning",
    background: "<p>Planning over graph actions benefits from evaporation because early paths may be noisy or incomplete. Evaporation prevents one early path from becoming permanent.</p>",
    numbers: "<p>After the lesson update, edge 3 has $1.8/0.8=2.25$ times the pheromone of the unused edge, enough to prefer it without making the unused edge impossible.</p>"
  }
];

(window.ALLML_CONTENT["24.8"] = window.ALLML_CONTENT["24.8"] || {}).applications = [
  {
    title: "Neural architecture search",
    background: "<p>NEAT evolves both neural weights and graph structure, making it a small-scale ancestor of architecture search. Innovation numbers keep structural genes aligned during comparison and crossover.</p>",
    numbers: "<p>The lesson compatibility distance uses $E=0$, $D=2$, $N=3$, $\bar W=0.2$, $c_1=c_2=1$, and $c_3=0.4$, so $\delta=0/3+2/3+0.4\cdot0.2=0.747$.</p>"
  },
  {
    title: "Reinforcement-learning controllers",
    background: "<p>In sparse-reward control, new topology may initially perform poorly before its weights adapt. Species protect these innovations by comparing genomes mostly against similar peers.</p>",
    numbers: "<p>A lesson distance of $\delta=0.747$ is driven mostly by the $2/3$ disjoint-gene term, showing that topology can separate species even when matching weight gaps average only $0.2$.</p>"
  },
  {
    title: "Sparse or delayed reward tasks",
    background: "<p>Neuroevolution accepts that mutation is exploratory, not guaranteed improvement. Selection and species-level competition decide whether a weight change survives.</p>",
    numbers: "<p>For $x=(2,1)$ and target $1$, weights $(1,-0.5)$ predict $1.5$ with squared error $0.25$; after mutation to $(1.2,-0.4)$, prediction is $2.0$ and error worsens to $1.0$.</p>"
  },
  {
    title: "Tiny embedded models",
    background: "<p>NEAT starts simple and complexifies gradually, which is attractive when deployed models must remain small. Add-node mutation grows capacity one structural step at a time.</p>",
    numbers: "<p>An illustrative add-node mutation increases hidden-node count by exactly 1, so a genome with 0 hidden nodes becomes a 1-hidden-node genome before later mutations add more structure.</p>"
  },
  {
    title: "Graph-structured policy search",
    background: "<p>Policy networks can be treated as graphs whose edges are inherited, disabled, split, or added. Innovation numbers prevent unrelated edges from being averaged as if they matched.</p>",
    numbers: "<p>In the lesson, genes 1 and 4 match, while genes 2 and 3 are disjoint. That gives 2 matching genes for weight-gap averaging and 2 disjoint genes for the topology term.</p>"
  }
];

(window.ALLML_CONTENT["24.9"] = window.ALLML_CONTENT["24.9"] || {}).applications = [
  {
    title: "AutoML pipeline search",
    background: "<p>Memetic algorithms use evolution to find a promising region and local search to polish the candidate. This fits AutoML pipelines where broad choices and continuous knobs coexist.</p>",
    numbers: "<p>For lesson objective $f(x)=(x-3)^2$, starting at $x=2$ gives gradient $2(2-3)=-2$; with $\eta=0.2$, the local step is $2-0.2(-2)=2.4$.</p>"
  },
  {
    title: "Operations-research routing and scheduling",
    background: "<p>Routing and scheduling often combine population search with a local move such as swap descent or 2-opt. The meme improves a candidate while preserving representation validity.</p>",
    numbers: "<p>The lesson's polished candidate improves from $(2-3)^2=1.0$ to $(2.4-3)^2=0.36$, a reduction of $0.64$ after one local step.</p>"
  },
  {
    title: "Hyperparameter tuning",
    background: "<p>Memetic tuning must compare methods by objective evaluations, because one generation can include many local-search calls. Generation counts alone are unfair.</p>",
    numbers: "<p>With illustrative 20 children and 5 local steps per child, polishing adds $20\times5=100$ extra objective-touching steps before the next generation is selected.</p>"
  },
  {
    title: "Neural weight initialization search",
    background: "<p>Evolution can propose initial weights, and a differentiable local step can refine them. This is useful when population diversity and gradient exploitation both matter.</p>",
    numbers: "<p>The lesson gradient at $x=2$ is $-2$, so a gradient-style meme with $\eta=0.2$ moves in the positive direction by $0.4$ to reach $2.4$.</p>"
  },
  {
    title: "Permutation design problems",
    background: "<p>For permutations, the local operator must be a valid neighborhood move such as a swap. A raw gradient step would leave the representation space.</p>",
    numbers: "<p>For an illustrative permutation of $n$ items, a swap changes 2 positions but still returns a valid ordering of all $n$ items exactly once, unlike an unconstrained real-valued update.</p>"
  }
];

