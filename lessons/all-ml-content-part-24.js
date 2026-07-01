/* All ML — authored content for Part 24: Evolutionary Computation & Swarm Intelligence (24.1–24.9).
   Appends to window.ALLML_CONTENT (merged into lessons by id in all-ml-register.js).
   Every number here was computed and verified before shipping. LaTeX via String.raw;
   emphasis is bold (no prose italics). */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 24.1 Genetic algorithms ---------------- */
window.ALLML_CONTENT["24.1"] = {
  tagline: "A population searches by selection, recombination, mutation, and preservation of the best discoveries.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/24.1-genetic-algorithms.ipynb",
  context: String.raw`
    <p>Genetic algorithms are the evolutionary answer to a question that gradient methods from earlier optimization lessons cannot always answer: how do we search when the objective is discontinuous, noisy, or built from choices rather than smooth weights?</p>
    <ul>
      <li><b>Empirical risk and validation</b> feed the fitness score: the candidate is judged by a measurable objective, not by whether its internal representation looks elegant.</li>
      <li><b>Random variables and sampling</b> become the selection mechanism, because better candidates receive higher reproduction probability instead of a guaranteed win.</li>
      <li><b>Optimization landscapes</b> explain why mutation matters: without random perturbations, the population collapses around the first good basin it finds.</li>
    </ul>
    <p>Where it leads: genetic programming (24.2) changes the candidate from a vector into a program, evolution strategies (24.3) specialize the idea for real-valued vectors, and neuroevolution (24.8) applies the same population logic to neural networks.</p>`,
  intuition: String.raw`
    <p>The concrete problem is black-box optimization: you can score a candidate, but you may not have a derivative, a convex loss, or even a continuous parameterization. Trying every candidate is impossible, and greedy one-at-a-time search gets stuck easily.</p>
    <p>A genetic algorithm keeps many candidates alive at once. Selection says, "copy good habits more often." Crossover says, "combine partial discoveries." Mutation says, "keep trying small surprises." Elitism says, "do not accidentally throw away the best thing we have seen." The mental model is not biology for its own sake; it is a disciplined way to spend a limited evaluation budget across exploitation and exploration.</p>
    <p>The design decision people gloss over is that selection is usually <b>probabilistic</b>, not winner-take-all. If only the current best candidate reproduces, the population becomes a clone army and loses search coverage. Letting weaker candidates reproduce occasionally preserves diversity, which is often exactly where the next breakthrough comes from.</p>`,
  mathematics: String.raw`
    <p>Let a population be $P_t=\{x_i\\}_{i=1}^n$, with scalar fitness $F(x_i)$. A common shifted fitness-proportionate selection rule is</p>
    <div class="formula-box">$$p_i=\frac{F(x_i)-\min_j F(x_j)+1}{\sum_{k=1}^n (F(x_k)-\min_j F(x_j)+1)}.$$</div>
    <p>The symbols are: $P_t$ is the generation-$t$ population, $x_i$ is one candidate, $F$ is the fitness to maximize, and $p_i$ is the probability that candidate $i$ is selected as a parent.</p>

    <p><b>Selection on a tiny landscape.</b> Use $F(x)=-(x-3)^2+10$ and candidates $
    x=
    \{0,2,4,6\}$.</p>
    <ol class="work">
      <li>$F(0)=-(0-3)^2+10=1$, $F(2)=9$, $F(4)=9$, $F(6)=1$</li>
      <li>shifted weights: $
      \{1,9,9,1\}-1+1=
      \{1,9,9,1\}$, sum $=20$</li>
      <li>selection probabilities: $
      \{1/20,9/20,9/20,1/20\}=
      \{0.05,0.45,0.45,0.05\}$</li>
    </ol>
    <p>The two near-optimal candidates get most of the reproduction tickets, but the edge candidates are not silenced. That is the mechanism that keeps exploration alive.</p>

    <p><b>Crossover and mutation.</b> If parents $2$ and $4$ are averaged, then a mutation of $+0.5$ gives a child at $3.5$.</p>
    <ol class="work">
      <li>crossover: $(2+4)/2=3.0$</li>
      <li>mutation: $3.0+0.5=3.5$</li>
      <li>child fitness: $F(3.5)=-(3.5-3)^2+10=9.75$</li>
    </ol>
    <p>The child is slightly worse than the exact optimum $x=3$, but it is in the right basin; repeated selection can now refine it.</p>

    <p><b>The population view.</b> In the verified notebook, a 20-member population improved both best and mean fitness across 18 generations, while a two-dimensional population moved its mean closer to target $(1,-1)$. The important quantity is not a single lucky child; it is whether the distribution of candidates shifts toward better regions while retaining enough spread to recover from bad luck.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Selection pressure too high.</b> If $p_i$ is too concentrated on the current best candidate, the population variance collapses and mutation becomes the only source of search.</li>
      <li><b>Mutation scale ignored.</b> A tiny mutation never escapes a local basin; a huge mutation destroys inherited structure. The mathematics term being tuned is the perturbation distribution around offspring.</li>
      <li><b>Fitness leakage.</b> If fitness includes validation or test information, selection optimizes that leakage exactly as surely as ERM optimizes training loss.</li>
      <li><b>No elitism in noisy runs.</b> Without preserving the best-so-far candidate, stochastic reproduction can lose a rare good solution even when its $F(x)$ was highest.</li>
    </ul>`
};

/* ---------------- 24.2 Genetic programming ---------------- */
window.ALLML_CONTENT["24.2"] = {
  tagline: "Genetic programming evolves executable expressions, not just numeric vectors.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/24.2-genetic-programming.ipynb",
  context: String.raw`
    <p>Genetic programming keeps the evolutionary loop from 24.1 but changes the representation: an individual is a program tree whose output can be scored on data.</p>
    <ul>
      <li><b>Supervised learning loss</b> supplies the fitness: an expression is good when its predictions match the target values.</li>
      <li><b>Tree and graph representations</b> supply the genotype: crossover swaps subtrees, and mutation replaces subexpressions.</li>
      <li><b>Regularization</b> reappears as parsimony pressure, because program trees can bloat without improving predictions.</li>
    </ul>
    <p>Where it leads: genetic programming is the symbolic cousin of neuroevolution (24.8), and its bloat-control lesson is echoed by memetic algorithms (24.9), where local improvement can also over-concentrate the search.</p>`,
  intuition: String.raw`
    <p>The concrete problem is symbolic model discovery. You may want an expression such as $x^2+x+1$, a control rule, or a feature transform, but the space of possible programs is combinatorial and not differentiable in the usual sense.</p>
    <p>The naive approach enumerates all expressions up to some size. That fails because the count explodes, and many expressions are syntactically different but behaviorally similar. Genetic programming instead lets a population of programs compete by output behavior. A tree is not rewarded because it looks mathematical; it is rewarded because it predicts well.</p>
    <p>The design decision people miss is <b>closure</b>: every subtree operation must produce a valid program. If crossover can create invalid syntax or type-incompatible branches, the search budget is wasted repairing broken children rather than comparing useful behavior.</p>`,
  mathematics: String.raw`
    <p>For data $
    \{(x_i,y_i)\}_{i=1}^m$ and a program tree $T$, fitness is often the negative loss</p>
    <div class="formula-box">$$F(T)=-\frac{1}{m}\sum_{i=1}^m (T(x_i)-y_i)^2 - \lambda\,|T|.$$</div>
    <p>Here $T(x_i)$ is the program output, $|T|$ is tree size, and $
    \lambda$ is the parsimony weight that prices complexity.</p>

    <p><b>Score expression behavior.</b> On $x=
    \{-1,0,1,2\}$ with target $y=x^2+1=
    \{2,1,2,5\}$:</p>
    <ol class="work">
      <li>$T_1(x)=x+1$ predicts $
      \{0,1,2,3\}$, squared errors $
      \{4,0,0,4\}$, MSE $=(4+0+0+4)/4=2.0$</li>
      <li>$T_2(x)=x^2+1$ predicts $
      \{2,1,2,5\}$, squared errors all $0$, MSE $=0.0$</li>
      <li>$T_3(x)=2x+1$ predicts $
      \{-1,1,3,5\}$, squared errors $
      \{9,0,1,0\}$, MSE $=2.5$</li>
    </ol>
    <p>The exact expression wins by behavior, not by being the shortest string.</p>

    <p><b>Parsimony pressure.</b> Suppose two exact programs have raw error $0.0$, sizes $5$ and $9$, and $
    \lambda=0.05$.</p>
    <ol class="work">
      <li>small exact score: $0.0+0.05\cdot5=0.25$</li>
      <li>large exact score: $0.0+0.05\cdot9=0.45$</li>
      <li>short imperfect score with raw error $0.25$ and size $3$: $0.25+0.05\cdot3=0.40$</li>
    </ol>
    <p>The small exact program is preferred. This is the mathematical antidote to bloat: if extra branches do not reduce error enough, they lose.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Bloat without behavioral gain.</b> The $\lambda|T|$ term is not decorative; without it, neutral subtrees can grow because selection sees no immediate loss penalty.</li>
      <li><b>Invalid offspring.</b> Subtree crossover must preserve type and arity, or many children have no meaningful $T(x)$ to score.</li>
      <li><b>Overfitting symbolic noise.</b> A tree can memorize a small sample exactly; the MSE term must be evaluated on held-out data or cross-validation when expressions get flexible.</li>
      <li><b>Confusing syntax with semantics.</b> Two trees can print differently but compute the same function, so diversity should consider behavior as well as shape.</li>
    </ul>`
};

/* ---------------- 24.3 Evolution strategies (CMA-ES) ---------------- */
window.ALLML_CONTENT["24.3"] = {
  tagline: "Evolution strategies sample real-valued candidates, keep elites, and adapt the search distribution.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/24.3-evolution-strategies-cma-es.ipynb",
  context: String.raw`
    <p>Evolution strategies specialize evolutionary search for continuous vectors. They are what you reach for when the candidate is real-valued but gradients are unavailable, unreliable, or too expensive.</p>
    <ul>
      <li><b>Multivariate Gaussians</b> supply the sampling distribution around the current mean.</li>
      <li><b>Covariance matrices</b> describe the shape and orientation of search steps, so linear algebra becomes the steering wheel.</li>
      <li><b>Black-box optimization</b> supplies the evaluation-only setting shared with genetic algorithms (24.1), but here the variation operator is numeric sampling rather than crossover of arbitrary encodings.</li>
    </ul>
    <p>Where it leads: differential evolution (24.4) offers another continuous optimizer, while memetic algorithms (24.9) show what happens when evolutionary exploration is paired with local refinement.</p>`,
  intuition: String.raw`
    <p>The concrete problem is optimizing a real vector when you can evaluate $f(x)$ but cannot trust a gradient. A round random search wastes evaluations in directions that do not matter, especially in long narrow valleys.</p>
    <p>An evolution strategy samples a cloud around a mean, keeps the best samples, and moves the mean toward them. CMA-ES adds the crucial wisdom: do not keep sampling a round cloud if the successful points form an ellipse. Learn the covariance of the successful steps, so future samples stretch along promising directions and shrink along dangerous ones.</p>
    <p>The design decision people gloss over is that the covariance is not just a convenience for randomness. It is memory. The matrix records which directions have been safe and productive, turning past evaluations into a geometry for future search.</p>`,
  mathematics: String.raw`
    <p>A simple evolution strategy samples candidates from</p>
    <div class="formula-box">$$x_k \sim \mathcal{N}(m_t,\sigma_t^2 C_t), \qquad m_{t+1}=\sum_{k=1}^{\mu} w_k x_{k:\lambda}.$$</div>
    <p>Here $m_t\in\mathbb{R}^d$ is the mean, $C_t\in\mathbb{R}^{d\times d}$ is the covariance, $
    \sigma_t$ is the global step size, $
    \lambda$ is the number of samples, $
    \mu$ is the number of elites, and $x_{k:\lambda}$ is the $k$th best sample.</p>

    <p><b>Elite recombination.</b> Minimize distance to target $(1,1)$ using samples $(1,0),(0,1),(2,2),(-1,0)$.</p>
    <ol class="work">
      <li>squared distances: $(1,0)\to1$, $(0,1)\to1$, $(2,2)\to2$, $(-1,0)\to5$</li>
      <li>top two elites: $(1,0)$ and $(0,1)$</li>
      <li>new mean: $((1,0)+(0,1))/2=(0.5,0.5)$</li>
    </ol>
    <p>The mean moves toward the best region without needing a derivative.</p>

    <p><b>Covariance from elites.</b> For elites $(1,0)$ and $(0,1)$ with mean $(0.5,0.5)$:</p>
    <ol class="work">
      <li>centered elites: $(0.5,-0.5)$ and $(-0.5,0.5)$</li>
      <li>biased covariance entries: variance in each coordinate $=(0.25+0.25)/2=0.25$</li>
      <li>cross term $=(0.5\cdot-0.5 + -0.5\cdot0.5)/2=-0.25$</li>
    </ol>
    <p>The negative cross term says successful moves lie along a diagonal tradeoff; CMA-ES can use that orientation instead of sampling blindly.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Forgetting covariance regularization.</b> If too few elites define $C_t$, the matrix can become singular; the notebook adds a tiny diagonal term for this reason.</li>
      <li><b>Using one global step size for every geometry.</b> The scalar $\sigma_t$ controls scale, but $C_t$ controls direction; round sampling fails in elongated valleys.</li>
      <li><b>Over-trusting noisy elites.</b> With noisy objectives, the top $\mu$ samples may be lucky rather than good, corrupting both $m_t$ and $C_t$.</li>
      <li><b>Ignoring evaluation budget.</b> CMA-ES spends $\lambda$ objective calls per generation, so large populations must be justified by better covariance estimates.</li>
    </ul>`
};

/* ---------------- 24.4 Differential evolution ---------------- */
window.ALLML_CONTENT["24.4"] = {
  tagline: "Differential evolution mutates by adding scaled population differences to existing candidates.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/24.4-differential-evolution.ipynb",
  context: String.raw`
    <p>Differential evolution is another continuous black-box optimizer, but its step size is learned from the population itself rather than from a covariance matrix.</p>
    <ul>
      <li><b>Vector arithmetic</b> supplies the mutation: a difference $b-c$ becomes a direction and scale.</li>
      <li><b>Greedy selection</b> supplies monotone pressure: each target vector competes only against its trial child.</li>
      <li><b>Evolutionary populations</b> from 24.1 supply the diversity that makes difference vectors meaningful.</li>
    </ul>
    <p>Where it leads: PSO (24.6) also moves real-valued particles by population information, but DE uses differences among peers while PSO uses personal and global memory.</p>`,
  intuition: String.raw`
    <p>The concrete problem is choosing useful moves in a continuous space without a gradient. Fixed Gaussian mutation can be too small in one region and too large in another.</p>
    <p>Differential evolution uses the population as a measuring stick. If two population members are far apart, their difference proposes a long exploratory step; if the population has contracted, the differences naturally become local refinements. Then crossover mixes this mutant with the current target, and greedy replacement keeps the better vector.</p>
    <p>The design decision people miss is that the mutation is <b>relative</b>, not absolute. The algorithm's step scale adapts automatically to the current spread of candidates, which is why maintaining population diversity is not optional.</p>`,
  mathematics: String.raw`
    <p>For target vector $x_i$, choose distinct vectors $a,b,c$ and form</p>
    <div class="formula-box">$$v=a+F(b-c), \qquad u_j=\begin{cases}v_j,& r_j\lt CR \\ x_{i,j},& r_j\ge CR.\end{cases}$$</div>
    <p>Here $v$ is the mutant, $F$ is the differential weight, $u$ is the trial vector, and $CR$ is the crossover rate. For minimization, keep $u$ if $f(u)\le f(x_i)$.</p>

    <p><b>Mutation by a population difference.</b> Let $a=(1,1)$, $b=(3,0)$, $c=(0,2)$, and $F=0.5$.</p>
    <ol class="work">
      <li>difference: $b-c=(3,0)-(0,2)=(3,-2)$</li>
      <li>scaled difference: $0.5(b-c)=(1.5,-1)$</li>
      <li>mutant: $v=a+0.5(b-c)=(1,1)+(1.5,-1)=(2.5,0)$</li>
    </ol>
    <p>The step is shaped by existing candidates, not by a hand-picked coordinate direction.</p>

    <p><b>Greedy replacement.</b> Minimize distance to $(2,1)$. Compare old $x=(0,0)$ with trial $u=(2.5,0)$.</p>
    <ol class="work">
      <li>$f(x)=(0-2)^2+(0-1)^2=4+1=5.0$</li>
      <li>$f(u)=(2.5-2)^2+(0-1)^2=0.25+1=1.25$</li>
      <li>because $1.25\lt5.0$, replace the old vector with the trial</li>
    </ol>
    <p>Selection is local and simple, which helps DE stay robust even when the objective is a black box.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Population too small.</b> The mutation $a+F(b-c)$ needs distinct and diverse vectors; otherwise $b-c$ becomes uninformative.</li>
      <li><b>Scale factor too large.</b> Large $F$ can leap outside useful regions; too small $F$ makes differential steps vanish as the population contracts.</li>
      <li><b>Crossover rate misunderstood.</b> $CR$ controls how much of the mutant enters the trial, not whether mutation happened at all.</li>
      <li><b>Greedy replacement under noise.</b> If $f(u)$ and $f(x_i)$ are noisy estimates, a lucky trial can replace a genuinely better target.</li>
    </ul>`
};

/* ---------------- 24.5 Multi-objective optimization (NSGA-II) ---------------- */
window.ALLML_CONTENT["24.5"] = {
  tagline: "NSGA-II searches for a diverse Pareto front instead of pretending there is only one objective.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/24.5-multi-objective-optimization-nsga-ii.ipynb",
  context: String.raw`
    <p>NSGA-II is the evolutionary response to conflicting goals: accuracy versus latency, revenue versus risk, quality versus cost. A single weighted sum often hides the tradeoff the decision-maker actually needs to see.</p>
    <ul>
      <li><b>Partial orders</b> replace scalar ranking: one candidate dominates another only if it is no worse on every objective and better on at least one.</li>
      <li><b>Population diversity</b> becomes a first-class goal, because a front with one crowded corner is not useful.</li>
      <li><b>Genetic operators</b> from 24.1 still create candidates; NSGA-II changes how survivors are ranked.</li>
    </ul>
    <p>Where it leads: Pareto thinking is a practical bridge to model selection, fairness constraints, and resource-aware AutoML, where the best answer is often a menu of tradeoffs.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that objectives can conflict honestly. A model cannot always be both smallest and most accurate, and choosing arbitrary weights before seeing the tradeoff can erase good options.</p>
    <p>NSGA-II says: first separate candidates by Pareto dominance, then preserve spread inside the same front. The mental model is building a well-spaced coastline of efficient solutions. You do not need one winner yet; you need the decision surface.</p>
    <p>The design decision people gloss over is crowding distance. Without it, selection may keep many nearly identical non-dominated candidates, giving the illusion of a strong front while leaving large regions unexplored.</p>`,
  mathematics: String.raw`
    <p>For minimization objectives $f(x)=(f_1(x),\ldots,f_K(x))$, candidate $a$ dominates $b$ if</p>
    <div class="formula-box">$$f_k(a)\le f_k(b)\;\text{ for all }k,\qquad f_j(a)\lt f_j(b)\;\text{ for at least one }j.$$</div>
    <p>NSGA-II ranks candidates by non-dominated fronts, then uses crowding distance within a front.</p>

    <p><b>First Pareto front.</b> Consider objective pairs to minimize: $(1,5),(2,3),(3,2),(5,1),(3,4),(4,3)$.</p>
    <ol class="work">
      <li>$(3,4)$ is dominated by $(2,3)$ because $2\le3$ and $3\le4$, with both better or equal</li>
      <li>$(4,3)$ is dominated by $(3,2)$ because $3\le4$ and $2\le3$</li>
      <li>the non-dominated first front is $(1,5),(2,3),(3,2),(5,1)$</li>
    </ol>
    <p>The front contains alternatives, not one scalar champion.</p>

    <p><b>Crowding distance.</b> For front $(1,5),(2,3),(3,2),(5,1)$, boundary points receive infinite distance. For interior point $(2,3)$:</p>
    <ol class="work">
      <li>objective 1 contribution: $(3-1)/(5-1)=2/4=0.50$</li>
      <li>objective 2 contribution: $(5-2)/(5-1)=3/4=0.75$</li>
      <li>crowding distance: $0.50+0.75=1.25$</li>
    </ol>
    <p>The same calculation gives $1.25$ for $(3,2)$. Boundary points are protected so the discovered front keeps its endpoints.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Scalarizing too early.</b> A weighted sum chooses one compromise and can miss non-convex parts of the Pareto front.</li>
      <li><b>Ignoring objective scales.</b> Dominance is scale-safe, but crowding distance uses normalized objective ranges; bad scaling distorts diversity pressure.</li>
      <li><b>Keeping only rank.</b> Rank alone can select a crowded cluster of front-1 points; the crowding term prevents that collapse.</li>
      <li><b>Calling every non-dominated point good.</b> A point can be non-dominated in a weak population and still far from the true Pareto front.</li>
    </ul>`
};

/* ---------------- 24.6 Particle swarm optimization ---------------- */
window.ALLML_CONTENT["24.6"] = {
  tagline: "A swarm moves by inertia, personal memory, and social memory of the best discovered position.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/24.6-particle-swarm-optimization.ipynb",
  context: String.raw`
    <p>Particle swarm optimization is population search written as motion. It is useful when candidate solutions are continuous and the geometry is easier to explore by moving points than by recombining genomes.</p>
    <ul>
      <li><b>Vector updates</b> supply positions and velocities, so optimization becomes a dynamical system.</li>
      <li><b>Stochastic sampling</b> supplies random attraction strengths, preventing every particle from taking the same deterministic path.</li>
      <li><b>Population memory</b> connects it to differential evolution (24.4), but PSO remembers best locations rather than using peer differences.</li>
    </ul>
    <p>Where it leads: the same exploration-versus-exploitation tension appears in ant colony optimization (24.7), except ACO stores memory on edges rather than in particle positions.</p>`,
  intuition: String.raw`
    <p>The concrete problem is black-box continuous optimization with a group of candidate points. A lone hill-climber only knows its current neighborhood; a swarm shares discoveries.</p>
    <p>Each particle has three voices. Inertia says, "keep moving as you were." Cognitive memory says, "return toward the best place you personally found." Social memory says, "move toward the best place anyone found." The swarm balances independence and imitation.</p>
    <p>The design decision people miss is that personal best and global best are different memories. If every particle only chased the global best, the swarm would collapse too fast. Personal memory preserves multiple promising basins long enough for the global estimate to improve.</p>`,
  mathematics: String.raw`
    <p>For particle $i$ at position $x_i\in\mathbb{R}^d$ with velocity $v_i$, personal best $p_i$, and global best $g$, PSO updates</p>
    <div class="formula-box">$$v_i\leftarrow wv_i+c_1r_1(p_i-x_i)+c_2r_2(g-x_i),\qquad x_i\leftarrow x_i+v_i.$$</div>
    <p>Here $w$ is inertia, $c_1,c_2$ are cognitive and social weights, and $r_1,r_2$ are random vectors in $[0,1]^d$.</p>

    <p><b>One update by hand.</b> Let $x=(0,4)$, $v=(0,0)$, $p=x$, $g=(0,0)$, $w=0.5$, $c_1=c_2=1$, $r_1=(0.2,0.2)$, and $r_2=(0.3,0.3)$.</p>
    <ol class="work">
      <li>inertia: $0.5(0,0)=(0,0)$</li>
      <li>cognitive pull: $1(0.2,0.2)(p-x)=(0.2,0.2)(0,0)=(0,0)$</li>
      <li>social pull: $1(0.3,0.3)((0,0)-(0,4))=(0.3,0.3)(0,-4)=(0,-1.2)$</li>
      <li>new velocity $=(0,-1.2)$ and new position $=(0,2.8)$</li>
    </ol>
    <p>The particle moves downward because only the social memory differs from its current personal best.</p>

    <p><b>Inertia as a knob.</b> For velocity $(1,-0.5)$, speeds after inertia alone are:</p>
    <ol class="work">
      <li>$w=0.2$: speed $=\|(0.2,-0.1)\|=0.224$</li>
      <li>$w=0.7$: speed $=\|(0.7,-0.35)\|=0.783$</li>
      <li>$w=1.0$: speed $=\|(1,-0.5)\|=1.118$</li>
    </ol>
    <p>Larger inertia preserves exploration, while smaller inertia damps motion and lets memory pulls dominate.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Inertia too high.</b> The $wv_i$ term can make particles overshoot good basins indefinitely.</li>
      <li><b>Social weight too high.</b> A large $c_2$ collapses the swarm around an early lucky $g$, reducing exploration.</li>
      <li><b>Forgetting bounds.</b> Position updates can leave the feasible domain; clipping or reflection must be part of the operator, not an afterthought.</li>
      <li><b>Noisy global best.</b> If $g$ is chosen from noisy objective values, the whole swarm can chase measurement error.</li>
    </ul>`
};

/* ---------------- 24.7 Ant colony optimization ---------------- */
window.ALLML_CONTENT["24.7"] = {
  tagline: "Ant colony optimization builds solutions probabilistically from pheromone memory and local heuristic desirability.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/24.7-ant-colony-optimization.ipynb",
  context: String.raw`
    <p>Ant colony optimization is swarm intelligence for combinatorial construction: paths, schedules, assignments, and tours where a solution is assembled one choice at a time.</p>
    <ul>
      <li><b>Graph representations</b> supply edges on which pheromone can accumulate.</li>
      <li><b>Probability distributions</b> turn pheromone and heuristic scores into a next-step choice.</li>
      <li><b>Reinforcement</b> connects ACO to bandit thinking: good choices become more likely, but evaporation prevents permanent lock-in.</li>
    </ul>
    <p>Where it leads: ACO complements PSO (24.6). PSO stores memory in moving particles; ACO stores memory in the components from which future solutions are built.</p>`,
  intuition: String.raw`
    <p>The concrete problem is choosing a good sequence from a huge discrete space. A greedy nearest-neighbor rule is cheap but shortsighted, while exhaustive search is impossible.</p>
    <p>ACO lets many simple agents build full solutions. At each step, an ant is pulled by pheromone, which records historical success, and by a heuristic, which says what looks good locally right now. After tours are scored, good tours deposit pheromone; all pheromone evaporates a little.</p>
    <p>The design decision people gloss over is evaporation. Without it, the first decent route can dominate forever. Evaporation makes the memory <b>forgetful</b>, so new evidence can overturn old luck.</p>`,
  mathematics: String.raw`
    <p>From node $i$, the probability of choosing available node $j$ is</p>
    <div class="formula-box">$$P(i\to j)=\frac{\tau_{ij}^{\alpha}\eta_{ij}^{\beta}}{\sum_{k\in A_i}\tau_{ik}^{\alpha}\eta_{ik}^{\beta}},\qquad \tau_{ij}\leftarrow(1-\rho)\tau_{ij}+\Delta\tau_{ij}.$$</div>
    <p>Here $\tau$ is pheromone, $\eta$ is heuristic desirability such as inverse distance, $
    \alpha$ and $\beta$ tune their influence, $A_i$ is the set of available moves, and $\rho$ is evaporation.</p>

    <p><b>Initial transition probabilities.</b> From node $0$, suppose available nodes are $1,2,3$, pheromone is all $1$, and heuristic scores are $1$, $1/4$, and $1/9$.</p>
    <ol class="work">
      <li>scores: $1\cdot1=1.000$, $1\cdot0.25=0.250$, $1\cdot0.111=0.111$</li>
      <li>sum: $1.000+0.250+0.111=1.361$</li>
      <li>probabilities: $1/1.361=0.735$, $0.250/1.361=0.184$, $0.111/1.361=0.082$</li>
    </ol>
    <p>The nearest edge is favored, but other edges still have a chance.</p>

    <p><b>Pheromone update.</b> With old pheromone $(1,1,1)$, evaporation $
    \rho=0.2$, and deposits $(0.5,0,1.0)$:</p>
    <ol class="work">
      <li>evaporated base: $(1-0.2)(1,1,1)=(0.8,0.8,0.8)$</li>
      <li>add deposits: $(0.8,0.8,0.8)+(0.5,0,1.0)=(1.3,0.8,1.8)$</li>
      <li>edge 3 now has $1.8/0.8=2.25$ times the pheromone of the unused edge</li>
    </ol>
    <p>Good tours become more likely next time, but unused choices are not erased to zero.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Alpha too high.</b> Large $\alpha$ over-amplifies early pheromone and can freeze the colony before enough tours are sampled.</li>
      <li><b>Beta too high.</b> Large $\beta$ turns ACO into a greedy heuristic and weakens learning from completed tours.</li>
      <li><b>No evaporation.</b> With $\rho=0$, old deposits persist forever, so early noise can dominate the transition probabilities.</li>
      <li><b>Depositing on bad tours.</b> If $\Delta\tau$ is not tied inversely to tour cost, pheromone stops representing quality.</li>
    </ul>`
};

/* ---------------- 24.8 Neuroevolution (NEAT) ---------------- */
window.ALLML_CONTENT["24.8"] = {
  tagline: "NEAT evolves neural weights and topology while protecting new structural innovations.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/24.8-neuroevolution-neat.ipynb",
  context: String.raw`
    <p>Neuroevolution applies evolutionary search to neural networks. NEAT is the classic method that evolves not only weights, but also the network graph itself.</p>
    <ul>
      <li><b>Neural network computation</b> supplies the phenotype: weights and connections determine predictions.</li>
      <li><b>Genetic algorithms</b> supply selection, mutation, and crossover from 24.1.</li>
      <li><b>Graph matching</b> supplies innovation numbers, which let two different topologies cross over without confusing unrelated genes.</li>
    </ul>
    <p>Where it leads: NEAT is a bridge from evolutionary computation to architecture search and reinforcement learning, where gradients may be sparse or delayed.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a fixed neural architecture may be too small, too large, or simply wrong for the task. Hand-designing the topology is another search problem.</p>
    <p>NEAT starts with simple networks and complexifies them gradually. Weight mutations tune behavior; structural mutations add connections or nodes. Speciation protects new structures long enough to improve, because a fresh hidden node may initially perform worse than a mature simple network.</p>
    <p>The design decision people miss is historical marking. If two parents have different graphs, ordinary crossover cannot know which genes correspond. Innovation numbers label when each structural gene first appeared, so matching genes can align and disjoint genes can be handled deliberately.</p>`,
  mathematics: String.raw`
    <p>A common NEAT compatibility distance between genomes is</p>
    <div class="formula-box">$$\delta=\frac{c_1E}{N}+\frac{c_2D}{N}+c_3\bar W.$$</div>
    <p>Here $E$ is the number of excess genes, $D$ is the number of disjoint genes, $N$ normalizes genome size, $
    \bar W$ is the average weight difference among matching genes, and $c_1,c_2,c_3$ set their importance.</p>

    <p><b>Weight mutation first.</b> For input $x=(2,1)$, target $y=1$, and weights $w=(1,-0.5)$:</p>
    <ol class="work">
      <li>prediction: $w^\top x=1\cdot2+(-0.5)\cdot1=1.5$</li>
      <li>squared error: $(1.5-1)^2=0.25$</li>
      <li>after mutation to $(1.2,-0.4)$, prediction $=1.2\cdot2+(-0.4)\cdot1=2.0$, error $=(2.0-1)^2=1.0$</li>
    </ol>
    <p>Mutation is not guaranteed to help; selection decides whether the changed network survives.</p>

    <p><b>Compatibility distance.</b> Let parent A have innovation genes $
    \{1,2,4\}$ with weights $(0.5,-1.0,0.7)$, and parent B have $
    \{1,3,4\}$ with weights $(0.6,1.2,0.4)$.</p>
    <ol class="work">
      <li>matching genes are $1$ and $4$; disjoint genes are $2$ and $3$, so $D=2$, $E=0$, $N=3$</li>
      <li>average matching weight gap: $(|0.5-0.6|+|0.7-0.4|)/2=(0.1+0.3)/2=0.2$</li>
      <li>with $c_1=c_2=1$ and $c_3=0.4$, $
      \delta=0/3+2/3+0.4\cdot0.2=0.747$</li>
    </ol>
    <p>The distance is high mostly because topology differs, which is exactly why speciation can keep the genomes competing with similar peers.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Removing speciation.</b> New structures often start weak; without the $\delta$-based species boundary, selection kills them before weights adapt.</li>
      <li><b>Misaligning crossover genes.</b> Innovation numbers are the mechanism that prevents unrelated edges from being averaged as if they matched.</li>
      <li><b>Complexifying too fast.</b> Adding nodes and connections raises search dimension; NEAT's strength is gradual growth from simple networks.</li>
      <li><b>Evaluating with high noise.</b> Neuroevolution relies on fitness comparisons; noisy returns can promote bad topologies and distort species fitness.</li>
    </ul>`
};

/* ---------------- 24.9 Memetic algorithms ---------------- */
window.ALLML_CONTENT["24.9"] = {
  tagline: "Memetic algorithms combine population-wide exploration with local improvement inside each candidate.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/24.9-memetic-algorithms.ipynb",
  context: String.raw`
    <p>Memetic algorithms sit at the boundary between evolutionary search and problem-specific optimization. They keep the population from 24.1 but add a local improvement routine to selected candidates.</p>
    <ul>
      <li><b>Genetic algorithms</b> provide global exploration through selection, crossover, and mutation.</li>
      <li><b>Gradient or neighborhood search</b> provides local exploitation once a candidate lands in a promising basin.</li>
      <li><b>Regularization of search diversity</b> matters because local search can make many candidates collapse to the same nearby optimum.</li>
    </ul>
    <p>Where it leads: this hybrid mindset is common in AutoML and operations research, where broad stochastic search finds a region and deterministic refinement makes the answer competitive.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that evolutionary algorithms are good at finding basins but can be slow at polishing a solution once they get there. Local search is excellent at polishing but brittle when started in the wrong basin.</p>
    <p>A memetic algorithm gives each candidate a learned habit: after reproduction, run a small local improvement step. The population explores across basins; the meme refines within a basin. This hybrid often reaches useful solutions with fewer generations.</p>
    <p>The design decision people gloss over is how much local search to apply. Too little and the method is just a GA. Too much and every candidate rushes to the nearest basin, destroying diversity and making the population less evolutionary.</p>`,
  mathematics: String.raw`
    <p>For objective $f$ and candidate $x$, a simple memetic step is</p>
    <div class="formula-box">$$x' = \operatorname{LocalSearch}(x),\qquad \text{then select using } f(x').$$</div>
    <p>If the local search is one gradient step on a differentiable objective, then $x'=x-\eta\nabla f(x)$. In discrete problems, $\operatorname{LocalSearch}$ may be a swap, 2-opt move, or neighborhood descent.</p>

    <p><b>One local step.</b> Minimize $f(x)=(x-3)^2$ from candidate $x=2$ with step size $
    \eta=0.2$.</p>
    <ol class="work">
      <li>gradient: $
      \nabla f(x)=2(x-3)=2(2-3)=-2$</li>
      <li>local update: $x'=2-0.2(-2)=2.4$</li>
      <li>objective improves from $(2-3)^2=1.0$ to $(2.4-3)^2=0.36$</li>
    </ol>
    <p>The meme does not discover the basin; it makes a candidate already in the basin much sharper.</p>

    <p><b>Selection plus polishing.</b> Suppose evolution proposes candidates $0,2,5$.</p>
    <ol class="work">
      <li>objective values: $(0-3)^2=9$, $(2-3)^2=1$, $(5-3)^2=4$</li>
      <li>selection chooses $2$ as the best raw candidate</li>
      <li>local polishing sends $2$ to $2.4$ and lowers the value from $1.0$ to $0.36$</li>
    </ol>
    <p>The global operator finds a reasonable basin; the local operator extracts more value from it before the next selection round.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Local search everywhere.</b> If every child is fully optimized, population diversity collapses and the algorithm becomes multi-start local search.</li>
      <li><b>Local search nowhere.</b> If the meme is too weak, the method pays the complexity cost of a hybrid without improving exploitation.</li>
      <li><b>Using a mismatched meme.</b> The local operator must respect the representation; a gradient step is meaningless for a permutation unless translated into a valid neighborhood move.</li>
      <li><b>Comparing unfair budgets.</b> A memetic generation may use many more objective evaluations than a GA generation, so performance should be compared by evaluation count, not generation count.</li>
    </ul>`
};
