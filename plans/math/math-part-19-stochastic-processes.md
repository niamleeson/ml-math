# Math · Part 19 — Stochastic processes  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four
> exposition principles (plain warm voice · complete step-by-step derivations · case-by-case · name every
> symbol), the fix recipe, and the Definition of Done. This file is now **deep-authored**: it gives drafted
> per-lesson change specs, not just flags. Numeric examples below were checked with `python3` + `numpy`.

**Section:** Stochastic processes · **Lessons:** 24 · **Breadcrumb:** `Mathematics · Probability & Statistics` · **Priority:** HIGH

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate — lessons 19-01…19-12 share the same app block (_Model monitoring · Recommendation systems · Queueing and serving systems · Language and sequence models · Simulation · Risk and reliability_) | 12 / 24 |
| Templated / thin motivation (stock opener or ≤45 words) | 7 / 24 |
| Key formula not in display form (`$$…$$`) | 16 / 24 |
| Matrix row-break LaTeX bug | 3 lessons / 7 fields |
| Derivation to author or deepen / explain-only | 23 / 1 |

**The core change:** every lesson below gets a concept-specific §5 with six re-derivable numbers, a display
formula with symbols glossed in plain English, and a complete derivation when the lesson has a non-obvious
formula. `math-19-01` is the only explain-only lesson because it introduces the idea of an indexed family of
random variables rather than a derivable identity.

---

## Priority & systemic issues

- **Shared §5 block to remove:** `math-19-01`…`math-19-12` currently reuse the same six application titles and
  generic numbers. Replace every one with applications that use that lesson's own concept: transition
  matrices, powers of $P$, stationary vectors, detailed balance flows, Poisson probabilities, birth-death
  stationary ratios, and random-walk path probabilities.
- **Stationarity family first:** `math-19-06`, `19-07`, and `19-08` are central to PageRank, MCMC, RL state
  visitation, and mixing. They should be authored as a cluster so the same chain $P=\begin{bmatrix}0.8&0.2\\0.3&0.7\end{bmatrix}$ is handled consistently.
- **LaTeX bugs found:** the matrix row break is missing in `math-19-06.worked.problem`, `math-19-06.practice[0].problem`, `math-19-06.practice[0].steps[0].result`, `math-19-07.worked.problem`, `math-19-07.practice[2].problem`, `math-19-07.practice[2].steps[0].result`, and `math-19-08.worked.problem`. Fix to `\begin{bmatrix}0.8&0.2\\0.3&0.7\end{bmatrix}` in the JS source (escaped as `\\\\` inside a JS string as needed).
- **Grammar artifacts:** stop substituting plural titles into singular verb slots. Rewrite sentences such as
  "Stationary distributions helps…" and "Stationary distributions appears…" as ordinary prose.

---

## Model entry (full prose)

### `math-19-06` — Stationary distributions  — **full-depth model entry (this is the bar)**

**Connections (§1).**
> This lesson builds on transition matrices and on the Markov-chain rule that the next distribution is found
> by multiplying the current distribution by $P$. Earlier lessons asked how probability moves after one step
> or several steps. Here the question is what it means for the whole distribution to be in equilibrium.
>
> Stationary distributions are the link from finite Markov-chain algebra to long-run behavior. Limiting
> distributions, detailed balance, MCMC correctness, PageRank, queue occupancy, and RL visitation measures all
> use the same equation: after one transition, the distribution is unchanged.

**Motivation & Intuition (§2).**
> A Markov chain can keep moving even when its overall distribution is steady. In the two-state chain with
> transition matrix $P=\begin{bmatrix}0.8&0.2\\0.3&0.7\end{bmatrix}$, some probability moves from state 1 to state 2
> on each step, and some probability moves back. A stationary distribution is the set of weights where those
> flows balance.
>
> For this chain the stationary distribution is $\pi=(0.6,0.4)$. That does not mean a sample path stops. It
> means that if 60% of the mass starts in state 1 and 40% starts in state 2, the next step has the same 60/40
> split. This is why stationarity is useful: it turns a moving random system into a stable long-run summary.

**Definition & Assumptions (§3).** Display
$$
\pi P=\pi,\qquad \pi_i\ge 0,\qquad \sum_i \pi_i=1.
$$
Then derive the worked chain completely:
1. Write $\pi=(a,b)$ because the chain has two states; $a$ and $b$ are the probabilities assigned to states 1 and 2.
2. Multiply by $P$: $(a,b)P=(0.8a+0.3b,\ 0.2a+0.7b)$; each new component adds all incoming probability mass.
3. Set $(a,b)P=(a,b)$ because stationarity means one step leaves the distribution unchanged.
4. From the first component, $0.8a+0.3b=a$, so $0.3b=0.2a$; this is the balance of flow into and out of state 1.
5. Add normalization $a+b=1$ because $\pi$ is a probability distribution.
6. Substitute $b=\tfrac{2}{3}a$ into $a+b=1$ to get $a+\tfrac{2}{3}a=1$, so $\tfrac{5}{3}a=1$ and $a=0.6$.
7. Then $b=0.4$, so $\pi=(0.6,0.4)$; checking gives $0.6\cdot0.8+0.4\cdot0.3=0.6$ and $0.6\cdot0.2+0.4\cdot0.7=0.4$.

**Symbols.** $P$ is the transition matrix; $P_{ij}$ is the probability of moving from state $i$ to state $j$;
$\pi$ is the stationary row vector; $\pi_i$ is long-run mass at state $i$ when the chain is in equilibrium.
Assume the rows of $P$ sum to $1$ and the chain is finite; uniqueness needs the usual irreducible/aperiodic
conditions, but the equation $\pi P=\pi$ itself is the definition.

**Real-World Applications (§5).** (1) **PageRank:** a page's rank is stationary mass; for the chain above,
$0.6\cdot0.8+0.4\cdot0.3=0.6$. (2) **MCMC correctness:** detailed balance certifies stationarity; here
$0.6\cdot0.2=0.4\cdot0.3=0.12$. (3) **Ergodic averages:** in 1000 long-run visits, the expected counts are
about $600$ and $400$. (4) **Queue occupancy:** an M/M/1 birth-death chain with $\rho=0.4$ has $\pi_0=0.6$
and $\pi_1=0.24$. (5) **Mixing:** from state 1, five steps give $(1,0)P^5=(0.6125,0.3875)$, only $0.0125$
total-variation distance from $(0.6,0.4)$. (6) **RL state visitation:** under a fixed policy with this induced
chain, a 10,000-step on-policy average weights states by about $6000$ and $4000$ visits.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted content for one lesson, in render order. The labels
(Intuition / Derive / Symbols / Apps) are plan shorthand; the app should render them as flowing plain prose.
Every application list has exactly six concept-specific uses with checked numbers.

### `math-19-01` — What is a stochastic process?  · rewrite §5 · explain-only

**Connections (§1).**
> This lesson starts the section by naming the object that later lessons study in detail. Earlier probability lessons often focused on one random variable or one distribution at a time. A stochastic process keeps that same probability language but attaches it to many indexed random variables at once.
>
> This viewpoint prepares the ground for Markov chains, Poisson processes, Brownian motion, time-series models, and diffusion models. In all of those settings, the main object is not one random outcome but a random path evolving across time, steps, or space.

**Motivation & Intuition (§2).**
> A single random variable can describe one uncertain quantity, such as whether a user clicks or how many requests arrive in one minute. Many systems need more structure than that because the values arrive as a sequence. A stochastic process packages the whole collection into one model, so the model can describe both individual values and how values are related across indices.
>
> The index set might be discrete time, continuous time, positions in an image, or nodes in a network. Once the index set and state space are named, a sample path becomes one realized sequence or function. This makes it possible to discuss dependence, trends, jumps, and long-run behavior without pretending the observations are isolated.

**Definition & Assumptions (§3).** **Explain-only.** This lesson introduces the object $\{X_t:t\in T\}$ and the roles of the index set, state space, and finite-dimensional distributions; there is no identity to prove without adding extra assumptions.

**Symbols.** $X_t$ is the random value at index $t$; $T$ is the index set; $S$ is the state space; a sample path is one realized sequence or function of values.

**Real-World Applications (§5).** (1) **Binary click process:** for independent Bernoulli clicks with $p=0.2$, $P(X_1=1,X_2=0,X_3=1)=0.2\cdot0.8\cdot0.2=0.032$. (2) **Path count:** a 10-step binary process has $2^{10}=1024$ possible paths. (3) **Traffic counts:** expected total over three periods with means $100,120,80$ is $300$. (4) **Rolling metric:** one sample path $(3,4,2)$ has three-step average $3$. (5) **Spatial process:** a $4\times4$ image patch is a random field with $16$ indexed variables. (6) **Time dependence:** an AR(1) process with variance $1$ and lag correlation $0.7$ has covariance $0.7$ between adjacent times.

### `math-19-02` — Discrete-time Markov chains  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson builds directly on stochastic processes by adding a simple rule about dependence. Instead of allowing the whole past to affect the next value, a discrete-time Markov chain says the present state contains the information needed for the next step. That makes the process easier to compute without making it deterministic.
>
> The Markov-chain idea leads naturally to transition matrices, multi-step probabilities, state classification, stationarity, and MCMC. It is also the template behind many models in reliability, user behavior, sequence simulation, and reinforcement learning.

**Motivation & Intuition (§2).**
> A general stochastic process can remember a long and complicated history. In many step-by-step systems, the current state is designed to summarize that history well enough for prediction. If a user is currently active, or a machine is currently up, the next-step model can often start from that current state rather than from every earlier state.
>
> The Markov property is the mathematical version of that summary. It does not say the past is irrelevant in an ordinary sense; it says the past affects the future only through the present state. Once this is true, every one-step prediction can be stored as a transition probability, and repeated movement becomes matrix algebra.

**Definition & Assumptions (§3).** 1. Start with conditional probability $P(X_{n+1}=j\mid X_n=i,X_{n-1},\ldots,X_0)$; this is the most general one-step prediction from all history. 2. Impose the Markov property and replace the whole history by $X_n=i$, giving $P(X_{n+1}=j\mid X_n=i)$; the present state is the sufficient summary. 3. Name this number $P_{ij}$ so every pair of states has a transition probability. 4. For $P=\begin{bmatrix}0.7&0.3\\0.2&0.8\end{bmatrix}$, starting in state 1 gives one-step distribution $(0.7,0.3)$ because row 1 lists the next-state probabilities. 5. A second step multiplies again: $(1,0)P^2=(0.55,0.45)$; this uses the current distribution as the new mixture over rows.

**Symbols.** $X_n$ is the state at step $n$; $S$ is the state space; $P_{ij}$ is the probability of moving from $i$ to $j$ in one step; $P$ is the matrix of all $P_{ij}$.

**Real-World Applications (§5).** (1) **User retention:** with $P_{\text{active,inactive}}=0.3$, an active user has $0.7$ chance to remain active next step. (2) **Two-step churn:** row 1 of $P^2$ above gives $P(X_2=\text{inactive}\mid X_0=\text{active})=0.45$. (3) **Recommendation state:** from $(0.4,0.6)$, next distribution is $(0.4,0.6)P=(0.40,0.60)$. (4) **Reliability:** if failure is absorbing with row $(0,1)$ and up-state failure probability $0.02$, two-step survival is $0.98^2=0.9604$. (5) **Experiment funnels:** if view-to-click is $0.3$ and click-to-buy is $0.2$, two-step buy probability is $0.06$. (6) **Sequence simulation:** a path $1\to2\to2$ under $P$ has probability $0.3\cdot0.8=0.24$.

### `math-19-03` — Transition matrices  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson turns the Markov-chain rule into a compact computational object. Once every one-step probability is placed into a table, the whole distribution can be advanced without listing paths one by one. The table is the transition matrix.
>
> Transition matrices are the working language for finite Markov chains. They support Chapman–Kolmogorov equations, stationary distributions, limiting distributions, state classification, and many applications where populations move between categories.

**Motivation & Intuition (§2).**
> A chain has many possible current states, and each current state has a row of possible next states. The transition matrix stores those rows in one place. A row-stochastic matrix is therefore not just a table of numbers; each row is a complete probability distribution for one current state.
>
> Multiplying a current distribution by the matrix applies total probability. The mass currently in each state is spread across next states according to that state's row, and all incoming contributions are added. This is why matrix multiplication is the natural update rule for Markov chains.

**Definition & Assumptions (§3).** 1. Let $\mu_n$ be a row vector where $(\mu_n)_i=P(X_n=i)$; it records current state probabilities. 2. To get probability of state $j$ next, split by current state: $P(X_{n+1}=j)=\sum_i P(X_n=i)P(X_{n+1}=j\mid X_n=i)$. 3. Replace the terms by $\mu_{n,i}$ and $P_{ij}$ to get $(\mu_{n+1})_j=\sum_i\mu_{n,i}P_{ij}$. 4. Writing all $j$ at once gives $\mu_{n+1}=\mu_nP$; matrix multiplication is total probability in vector form. 5. With $\mu=(0.25,0.75)$ and $P=\begin{bmatrix}0.6&0.4\\0.1&0.9\end{bmatrix}$, $\mu P=(0.225,0.775)$.

**Symbols.** $P$ is row-stochastic; $P_{ij}$ is a one-step probability; $\mu_n$ is the distribution at step $n$; $\mu_nP$ is the next distribution.

**Real-World Applications (§5).** (1) **Population update:** $(0.25,0.75)P=(0.225,0.775)$. (2) **Two-step matrix:** $P^2=\begin{bmatrix}0.40&0.60\\0.15&0.85\end{bmatrix}$. (3) **Row validation:** first row sums to $0.6+0.4=1$. (4) **Expected active users:** if 1000 users start with distribution $(0.25,0.75)$, next counts are $(225,775)$. (5) **A/B state migration:** from state 1, two-step probability of state 2 is $0.60$. (6) **Data-quality check:** a row sum of $0.97$ leaves missing probability $0.03$.

### `math-19-04` — The Chapman–Kolmogorov equations  · rewrite §5 · deepen derivation

**Connections (§1).**
> This lesson builds on transition matrices and asks how one-step movement becomes multi-step movement. Earlier Markov-chain lessons showed that one multiplication advances a distribution by one step. Chapman–Kolmogorov explains why repeated multiplication gives the correct probabilities for longer horizons.
>
> The same equation appears whenever a process moves through possible intermediate states. It supports forecasting, matrix powers, path attribution, dynamic programming, and later limiting-distribution calculations.

**Motivation & Intuition (§2).**
> To find the chance of going from state $i$ to state $j$ in several steps, it is useful to pause at an intermediate time. At that time, the process must be in some state $k$. The total probability is found by adding the probabilities of all ways to pass through those possible $k$ values.
>
> The Markov property makes this decomposition clean. Once the process is at $k$, the future segment depends on $k$ rather than on the earlier path. Chapman–Kolmogorov is exactly this split-and-sum rule written in matrix form.

**Definition & Assumptions (§3).** 1. Start with $P(X_{m+n}=j\mid X_0=i)$, the chance of ending at $j$ after $m+n$ steps. 2. Insert the intermediate state $X_m=k$ and sum over all $k$; total probability says the disjoint cases cover all paths. 3. This gives $\sum_k P(X_m=k,X_{m+n}=j\mid X_0=i)$. 4. Factor each term as $P(X_m=k\mid X_0=i)P(X_{m+n}=j\mid X_m=k,X_0=i)$. 5. Use the Markov/time-homogeneous property to make the second factor $P^{(n)}_{kj}$. 6. The result is $P^{(m+n)}_{ij}=\sum_k P^{(m)}_{ik}P^{(n)}_{kj}$, which is matrix multiplication.

**Symbols.** $P^{(r)}_{ij}$ is the $r$-step transition probability; $m,n$ are step counts; $k$ is an intermediate state.

**Real-World Applications (§5).** (1) **Two-step transition:** for $P=\begin{bmatrix}0.7&0.3\\0.2&0.8\end{bmatrix}$, $P^2_{12}=0.7\cdot0.3+0.3\cdot0.8=0.45$. (2) **Three-step prediction:** $P^3_{12}=0.525$. (3) **Attribution through states:** contribution through state 1 to $P^2_{12}$ is $0.21$, through state 2 is $0.24$. (4) **Path planning:** two-hop reachability is positive when at least one product $P_{ik}P_{kj}$ is positive; here both products are positive. (5) **Batch forecasting:** $(1,0)P^3=(0.475,0.525)$. (6) **Matrix-power caching:** computing $P^{10}$ by repeated powers gives $P^{10}_{12}=0.399609$ for the stationary example matrix.

### `math-19-05` — Classification of states  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson uses transition probabilities to describe the roles that states play in a Markov chain. Once matrix powers tell us which states can be reached, the chain also has a graph structure. Classification gives names to the important graph patterns.
>
> These names matter for long-run behavior. Closed classes, communicating classes, transient states, recurrent states, and periodic states determine whether a chain settles, traps probability, or keeps cycling.

**Motivation & Intuition (§2).**
> A transition matrix gives local one-step movement, but a state may be important because of what happens over many steps. Some states lead back to each other and form a communicating group. Some states can be left and never returned to. Some states or classes trap the process once entered.
>
> Classification turns these qualitative facts into precise conditions. Accessibility uses positive entries of matrix powers, closed classes use the absence of exits, and transience can be measured by expected return visits. This gives a bridge from the diagram of a chain to statements about long-run probability.

**Definition & Assumptions (§3).** 1. Say $i\to j$ when $P^n_{ij}>0$ for some $n\ge0$; a positive entry in a matrix power means at least one $n$-step path exists. 2. Say $i$ and $j$ communicate when both $i\to j$ and $j\to i$; this makes communication classes. 3. A closed class has no positive transition leaving it; once entered, probability cannot escape. 4. A state is transient if the expected number of returns is finite; for a self-loop probability $q<1$ before exit, expected visits are $1+q+q^2+\cdots=1/(1-q)$. 5. With $q=0.6$, expected visits are $2.5$, so the state is transient in that open chain.

**Symbols.** $i\to j$ means accessible; $P^n_{ij}$ is an $n$-step transition probability; recurrent means return with probability $1$; transient means return probability is less than $1$ or expected visits are finite.

**Real-World Applications (§5).** (1) **Absorbing checkout:** $P_{33}=1$ makes state 3 absorbing. (2) **Two-step access:** if $P_{12}=0.5$ and $P_{23}=0.6$, then $P^2_{13}\ge0.30$, so $1\to3$. (3) **Communicating pair:** $P_{12}=0.4$ and $P_{21}=0.5$ put states 1 and 2 in the same class. (4) **Periodic monitoring:** deterministic alternation has returns only at even times, so period $\gcd(2,4,6,\ldots)=2$. (5) **Transient page:** with self-loop $0.6$ before exit, expected visits are $2.5$. (6) **Absorption probability:** solving $h_1=0.3+0.5h_2$, $h_2=0.4+0.2h_1$ gives $h_1=0.5556$.

### `math-19-07` — Limiting distributions  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson follows stationary distributions by separating equilibrium from convergence to equilibrium. A stationary distribution stays fixed if the chain starts there. A limiting distribution describes what ordinary starting states approach after many transitions.
>
> This distinction is central in Markov-chain modeling. It connects matrix powers to mixing, burn-in, long-run exposure, and warnings about periodic chains that have stationary distributions but do not settle from a fixed start.

**Motivation & Intuition (§2).**
> A chain may begin concentrated in one state, so its early distributions remember that initial condition. As the chain runs, repeated multiplication by $P$ can spread and rebalance the mass. When the chain is well behaved, the rows of $P^n$ become nearly identical, meaning the long-run distribution no longer depends much on the starting state.
>
> The limit, when it exists, must be stationary because taking one more transition should not change a distribution that has already settled. This is why limiting distributions are stronger than stationary distributions. They describe both the destination and the convergence from ordinary initial conditions.

**Definition & Assumptions (§3).** 1. Write the distribution after $n$ steps as $\mu_0P^n$; each multiplication advances one step. 2. If the rows of $P^n$ converge to the same vector $\ell$, then $P(X_n=j\mid X_0=i)\to\ell_j$ for every starting state $i$. 3. Multiply one more step: $\ell P=\lim_{n\to\infty}(\text{row }i\text{ of }P^n)P=\lim_{n\to\infty}\text{row }i\text{ of }P^{n+1}=\ell$; the limit must be stationary. 4. For the two-state chain above, $P^{10}$ has first row $(0.600390625,0.399609375)$, close to $(0.6,0.4)$. 5. The convergence needs irreducibility and aperiodicity; periodic chains can fail to settle even when stationary distributions exist.

**Symbols.** $\ell$ is the limiting distribution; $P^n$ is the $n$-step transition matrix; irreducible means all states communicate; aperiodic means returns do not occur only on a fixed cycle.

**Real-World Applications (§5).** (1) **Cold-start forgetting:** from state 1, $P^5=(0.6125,0.3875)$, near $(0.6,0.4)$. (2) **Distance to equilibrium:** total-variation distance after 5 steps is $0.0125$. (3) **Ten-step prediction:** $P^{10}_{12}=0.399609$. (4) **Recommendation exposure:** a chain with limit $(0.6,0.4)$ allocates 40% long-run exposure to state 2. (5) **A/B carryover:** starting from state 2 gives row 2 of $P^5=(0.58125,0.41875)$. (6) **Period warning:** the two-state alternating chain has stationary $(0.5,0.5)$ but no limiting row from state 1 because rows alternate.

### `math-19-08` — Reversibility and detailed balance  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson continues the stationarity cluster by adding a stronger, more local way to prove equilibrium. Stationarity says total incoming mass equals the mass at each state after one step. Detailed balance checks equality pair by pair along transitions.
>
> Reversibility is especially useful in MCMC, birth-death processes, and random walks on undirected graphs. It gives a practical certificate that a proposed chain has the desired stationary distribution.

**Motivation & Intuition (§2).**
> At stationarity, probability may still move between states. The distribution remains unchanged because outgoing and incoming flows balance in aggregate. Detailed balance asks for an even cleaner symmetry: for every pair of states, the equilibrium flow from $i$ to $j$ equals the flow from $j$ to $i$.
>
> This pairwise condition is stronger than ordinary stationarity, but it is often easier to verify. Instead of summing all incoming paths first, one checks local equalities. When those local equalities hold everywhere, the global stationary equation follows.

**Definition & Assumptions (§3).** 1. At stationarity, the equilibrium flow from $i$ to $j$ is $\pi_iP_{ij}$ because the chain is in $i$ with probability $\pi_i$ and then moves to $j$. 2. Detailed balance requires $\pi_iP_{ij}=\pi_jP_{ji}$ for every pair; each edge has equal forward and reverse flow. 3. Sum both sides over $i$: $\sum_i\pi_iP_{ij}=\sum_i\pi_jP_{ji}$. 4. Since $\pi_j$ does not depend on $i$ and row $j$ sums to 1, the right side is $\pi_j\sum_iP_{ji}=\pi_j$ when summing incoming reverse counterparts over all $i$. 5. Therefore $\sum_i\pi_iP_{ij}=\pi_j$, so $\pi P=\pi$; detailed balance implies stationarity.

**Symbols.** $\pi_iP_{ij}$ is equilibrium flow from $i$ to $j$; reversible means the stationary process has the same law forward and backward in time; detailed balance is the pairwise equality.

**Real-World Applications (§5).** (1) **Two-state check:** $0.6\cdot0.2=0.4\cdot0.3=0.12$, so the stationary chain is reversible. (2) **MCMC design:** a symmetric proposal with target ratio $0.4$ accepts with probability $0.4$. (3) **Birth-death queue:** with $\rho=0.4$, $\pi_2\lambda=0.096\cdot2=0.192$ and $\pi_3\mu=0.0384\cdot5=0.192$. (4) **Undirected random walk:** on a 4-node regular graph, uniform $\pi_i=0.25$ balances each edge flow. (5) **Nonreversible warning:** a directed 3-cycle has one-way flow $1/3$ and reverse flow $0$. (6) **Metropolis correction:** if proposal flow is twice too large in one direction, an acceptance factor $0.5$ restores balance.

### `math-19-09` — Continuous-time Markov chains  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson extends Markov chains from fixed time steps to random event times. The state still summarizes the future in the Markov sense, but transitions now occur in continuous time. The main object changes from a transition matrix per step to a generator matrix of rates.
>
> Continuous-time Markov chains lead directly to Poisson processes, birth-death processes, queues, reliability models, and matrix exponentials. They are the natural language for systems where waiting times matter.

**Motivation & Intuition (§2).**
> In a discrete-time chain, every step has the same clock tick. Many real systems do not move that way. A server finishes jobs at random times, a component fails after a random lifetime, and a molecule jumps when an event occurs. A continuous-time Markov chain keeps the state-based dependence but lets the clock run continuously.
>
> The generator records instantaneous rates rather than ordinary one-step probabilities. Over a very short interval, a rate multiplied by the interval length behaves like a small transition probability. The diagonal entries are chosen so each row sums to zero, which preserves total probability as the transition matrix evolves over time.

**Definition & Assumptions (§3).** 1. For $i\ne j$, set $q_{ij}\ge0$ as the instantaneous rate of jumping from $i$ to $j$. 2. The chance of one $i\to j$ jump in a short interval $h$ is $q_{ij}h+o(h)$; rates become probabilities after multiplying by small time. 3. The chance of leaving $i$ is $\sum_{j\ne i}q_{ij}h+o(h)$, so set $q_{ii}=-\sum_{j\ne i}q_{ij}$ to make each row sum to zero. 4. Write $P(t)$ for the transition matrix over time $t$; the small-time update is $P(t+h)\approx P(t)(I+hQ)$. 5. Subtract $P(t)$, divide by $h$, and let $h\to0$ to get $P'(t)=P(t)Q$.

**Symbols.** $Q$ is the generator; $q_{ij}$ is a jump rate; $P(t)$ is the time-$t$ transition matrix; holding time in state $i$ has rate $-q_{ii}$.

**Real-World Applications (§5).** (1) **Failure/repair:** with rates up→down $2$ and down→up $1$, $P_{\text{up,down}}(1)=\tfrac23(1-e^{-3})=0.6335$. (2) **Holding time:** rate $2$ gives mean holding time $0.5$. (3) **Small interval:** over $h=0.02$, jump probability is about $2h=0.04$. (4) **Stationary availability:** the two-state rates above give stationary $(1/3,2/3)$. (5) **Service systems:** total exit rate $7$ gives mean holding time $1/7=0.1429$. (6) **Matrix exponential:** $P(0)=I$, and $P(t)=e^{tQ}$ preserves row sums because $Q$ rows sum to $0$.

### `math-19-10` — Poisson processes  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson specializes continuous-time stochastic processes to the basic model of random arrivals. A Poisson process counts how many events have occurred by time $t$. It keeps the rate constant and treats disjoint time intervals as independent.
>
> Poisson processes are building blocks for queues, reliability, traffic modeling, thinning, superposition, and continuous-time Markov chains. They also give the simplest count process whose waiting times are exponential.

**Motivation & Intuition (§2).**
> When events are scattered in time at a steady average rate, the exact arrival times are uncertain but the count over an interval has structure. Short intervals usually contain no event, sometimes contain one event, and very rarely contain two or more. Adding many such small intervals gives the count over the whole time span.
>
> The Poisson distribution appears as the limit of many tiny Bernoulli opportunities. The parameter $\lambda t$ is the expected number of arrivals in time $t$, and it is also the variance. This equality of mean and variance is a signature of the basic Poisson model.

**Definition & Assumptions (§3).** 1. Split a time interval of length $t$ into many small pieces of size $\Delta t$. 2. In each piece, one arrival has probability about $\lambda\Delta t$ and two or more arrivals are negligible; this turns the count into many nearly Bernoulli trials. 3. The total count is approximated by $\mathrm{Binomial}(n,\lambda t/n)$. 4. Let $n\to\infty$; the binomial limit gives $P(N(t)=k)=e^{-\lambda t}(\lambda t)^k/k!$. 5. The same limiting argument gives mean and variance $\lambda t$, and waiting times are exponential with mean $1/\lambda$.

**Symbols.** $N(t)$ is the number of arrivals by time $t$; $\lambda$ is the rate per unit time; $k$ is the count; increments are counts over disjoint intervals.

**Real-World Applications (§5).** (1) **Traffic arrivals:** with $\lambda=3$/hour and $t=2$, $P(N=4)=e^{-6}6^4/4!=0.13385$. (2) **At least one error:** with mean $0.5$, $P(N\ge1)=1-e^{-0.5}=0.39347$. (3) **Capacity planning:** mean and variance over two hours are both $6$. (4) **Interarrival time:** rate $3$/hour gives mean wait $1/3$ hour, or 20 minutes. (5) **Superposition:** independent rates $2$ and $3$ combine to rate $5$. (6) **Thinning:** keeping 30% of a rate-10 stream gives rate $3$.

### `math-19-11` — Birth–death processes  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson builds on continuous-time Markov chains by focusing on count states. The process can only move from $n$ to $n+1$ or from $n$ to $n-1$, so it models one-at-a-time arrivals and departures. That simple local movement gives a rich class of queue and population models.
>
> Birth-death processes connect CTMC rates, detailed balance, stationary distributions, and queueing formulas. They are also a clear example of how local flow equations determine a full long-run distribution.

**Motivation & Intuition (§2).**
> Many systems are naturally described by a count: jobs in a queue, active requests, molecules of a type, or members of a population. In a small time interval, the count may go up by one, down by one, or stay where it is. A birth-death process encodes exactly those neighboring moves.
>
> Because transitions occur only between adjacent states, stationarity can be understood through adjacent flow balance. The mass flowing from $n$ to $n+1$ should match the mass flowing back from $n+1$ to $n$. Repeating that relationship builds the stationary probabilities from $\pi_0$.

**Definition & Assumptions (§3).** 1. From state $n$, allow only $n\to n+1$ at rate $\lambda_n$ and $n\to n-1$ at rate $\mu_n$. 2. The total exit rate is $\lambda_n+\mu_n$, so the mean holding time is $1/(\lambda_n+\mu_n)$. 3. In stationarity, adjacent flows balance: $\pi_n\lambda_n=\pi_{n+1}\mu_{n+1}$. 4. Rearranging gives $\pi_{n+1}=\pi_n\lambda_n/\mu_{n+1}$; repeated substitution builds all masses from $\pi_0$. 5. For constant $\lambda<\mu$, $\pi_n=(1-\rho)\rho^n$ with $\rho=\lambda/\mu$, because normalization of the geometric series sets $\pi_0=1-\rho$.

**Symbols.** $n$ is the count; $\lambda_n$ is the birth/arrival rate; $\mu_n$ is the death/service rate; $\pi_n$ is stationary probability of count $n$; $\rho=\lambda/\mu$ is traffic intensity in M/M/1.

**Real-World Applications (§5).** (1) **Server occupancy:** with $\lambda=2$, $\mu=5$, $\rho=0.4$ and $\pi_0=0.6$. (2) **Three jobs:** $\pi_3=0.6\cdot0.4^3=0.0384$. (3) **Mean queue length:** $\rho/(1-\rho)=0.6667$. (4) **Tail probability:** $P(N\ge4)=\rho^4=0.0256$. (5) **Holding time:** at $n\ge1$, total rate $7$ gives mean $0.1429$. (6) **Flow check:** $\pi_2\lambda=0.192$ equals $\pi_3\mu=0.192$.

### `math-19-12` — Random walks  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson studies a process built by accumulating random increments. It connects discrete-time stochastic processes to sums, expectations, variances, and path probabilities. The position after many steps is the result of all earlier increments.
>
> Random walks are a foundation for Brownian motion, martingales, gambler's ruin, diffusion approximations, and graph sampling. They give a concrete way to see how independent noise accumulates over time.

**Motivation & Intuition (§2).**
> A random walk starts somewhere and then adds a random step at each time. The individual steps may be simple, but their sum creates a path with growing uncertainty. If the steps are fair, the expected position stays fixed while the spread grows with the number of steps.
>
> The key calculations use linearity of expectation and independence of increments. Means add, variances add, and endpoint probabilities can be counted by the number of right and left steps. This makes the random walk both intuitive and computationally useful.

**Definition & Assumptions (§3).** 1. Define $S_n=S_0+Y_1+\cdots+Y_n$; each $Y_k$ is one step. 2. Take expectation term by term: $E[S_n]=S_0+\sum_kE[Y_k]$; linearity lets each increment contribute its mean. 3. If increments are independent, variances add: $\operatorname{Var}(S_n)=\sum_k\operatorname{Var}(Y_k)$. 4. For the simple symmetric walk, $E[Y_k]=0$ and $\operatorname{Var}(Y_k)=1$, so $E[S_n]=S_0$ and $\operatorname{Var}(S_n)=n$. 5. To end at $2$ after 10 steps from 0, the walk needs 6 right steps and 4 left steps, giving $\binom{10}{6}/2^{10}=0.205078$.

**Symbols.** $S_n$ is position after $n$ steps; $Y_k$ is the $k$th increment; $p$ is right-step probability; variance measures spread of position.

**Real-World Applications (§5).** (1) **Diffusion scaling:** after 10 fair steps, variance is $10$. (2) **Endpoint probability:** $P(S_{10}=2)=0.205078$. (3) **Biased drift:** with $p=0.6$, $E[S_{10}]=10(0.6-0.4)=2$. (4) **Gambler's ruin:** with $p=0.6$, start $1$, upper boundary $5$, hit-upper probability is $0.3839$. (5) **SGD noise:** independent zero-mean update noise has variance growing like $n\sigma^2$. (6) **Random-walk graph sampling:** on a 4-node regular graph, each neighbor is chosen with probability $1/4=0.25$.

### `math-19-13` — Brownian motion  · deepen derivation

**Connections (§1).**
> This lesson continues from random walks by taking a continuous-time limit. A random walk has discrete steps, while Brownian motion has continuous paths and Gaussian increments. The same ideas of accumulated independent noise remain in place.
>
> Brownian motion is the basic noise process for stochastic calculus, diffusion models, martingales, finance, and continuous-time approximations. It provides the driving process for Itô's lemma and many stochastic differential equations.

**Motivation & Intuition (§2).**
> If a random walk takes more and more steps in a fixed time interval, the step sizes must shrink to keep the total variance stable. The $1/\sqrt n$ scaling does exactly that. Many tiny centered steps then combine into a Gaussian by the central limit theorem.
>
> Brownian motion keeps the limiting features that matter most: independent increments, mean zero, and variance proportional to elapsed time. Its paths are continuous, but they remain highly irregular. This makes it a useful model for accumulated microscopic randomness.

**Definition & Assumptions (§3).** 1. In one unit of time, take $n$ independent steps of size $1/\sqrt n$; this scaling keeps variance from exploding or vanishing. 2. Each step has variance $1/n$, so the variance after $n$ steps is $n\cdot(1/n)=1$. 3. Over time $t$, the same scaling gives variance $t$. 4. The central limit theorem turns the sum of many small centered steps into a normal distribution, so $W_t\sim N(0,t)$. 5. Independent blocks of steps become independent increments, giving $W_t-W_s\sim N(0,t-s)$.

**Symbols.** $W_t$ is Brownian position at time $t$; $N(0,t)$ is normal with mean $0$ and variance $t$; increments are differences $W_t-W_s$.

**Real-World Applications (§5).** (1) **Particle diffusion:** $W_2$ has standard deviation $\sqrt2=1.4142$. (2) **Barrier probability:** $P(W_1>1)=0.1587$. (3) **Increment variance:** $W_{1.25}-W_1$ has variance $0.25$. (4) **Sensor drift:** a unit-variance-rate model has 95% range about $\pm1.96$ after one time unit. (5) **SGD approximation:** noise accumulated over $t=0.5$ has standard deviation $\sqrt{0.5}=0.7071$ when rate is 1. (6) **Diffusion model noise:** forward Gaussian noise with variance $0.19$ has standard deviation $0.4359$.

### `math-19-14` — Gaussian processes  · AUTHOR derivation

**Connections (§1).**
> This lesson moves from random paths over time to random functions over input spaces. Brownian motion is one example of a stochastic process with Gaussian structure, and Gaussian processes generalize that idea. They define uncertainty over function values rather than over a finite parameter vector alone.
>
> Gaussian processes connect stochastic processes, multivariate normal conditioning, kernels, Bayesian regression, spatial interpolation, and Bayesian optimization. The kernel is the central object because it determines how values at different inputs co-vary.

**Motivation & Intuition (§2).**
> In regression, the unknown object is often a function. A Gaussian process places a probability distribution on that function by saying that every finite set of function values has a joint normal distribution. This lets the model make predictions with uncertainty at new inputs.
>
> The kernel supplies the covariance between any two inputs. Nearby or similar inputs can be assigned high covariance, while distant inputs can be assigned lower covariance. After observations are made, ordinary multivariate normal conditioning updates the mean and variance of the function at new points.

**Definition & Assumptions (§3).** 1. Choose inputs $x_1,\ldots,x_n$; a GP turns $(f(x_1),\ldots,f(x_n))$ into a multivariate normal vector. 2. Put means into $m$ and covariances into $K$ with $K_{ij}=k(x_i,x_j)$. 3. For noisy observations $y=f(x)+\epsilon$, add noise variance to the observed covariance: $K_y=K+\sigma^2I$. 4. Condition a joint normal vector to get posterior mean $k_*^TK_y^{-1}y$ and variance $k_{**}-k_*^TK_y^{-1}k_*$; this is the normal conditioning formula. 5. With one observation $y=2$, $k(0,1)=e^{-1/2}=0.6065$, and noise variance $0.25$, the posterior mean at 1 is $0.9704$ and variance is $0.7057$.

**Symbols.** $f\sim GP(m,k)$ is a random function; $m(x)$ is the mean; $k(x,x')$ is covariance; $K$ is the kernel matrix; $\sigma^2$ is observation-noise variance.

**Real-World Applications (§5).** (1) **Bayesian regression:** one observation above predicts mean $0.9704$ at $x=1$. (2) **Uncertainty:** posterior variance there is $0.7057$. (3) **Kernel similarity:** squared-exponential covariance at distance 1 is $e^{-1/2}=0.6065$. (4) **Bayesian optimization:** upper confidence with $1.96$ standard deviations is $0.9704+1.96\sqrt{0.7057}=2.6170$. (5) **Spatial interpolation:** two identical inputs with noise $0.25$ have observed variance $1.25$. (6) **Design check:** a 3-point GP prior uses a $3\times3$ covariance matrix with 9 entries.

### `math-19-15` — Martingales  · deepen derivation

**Connections (§1).**
> This lesson uses stochastic-process language to describe fair evolution over time. Random walks and Brownian motion both provide important examples, but the martingale idea is more general. It is stated in terms of current information and conditional expectation.
>
> Martingales support optional stopping, concentration inequalities, stochastic calculus, finance, online learning, and fair-game reasoning. They help separate drift from unpredictable fluctuation.

**Motivation & Intuition (§2).**
> A process can move randomly while still being fair in expectation. The fairness is not about every outcome being unchanged; it is about the conditional mean of the future given what is currently known. If the current value is the best prediction of the future value, the process is a martingale.
>
> The filtration $\mathcal F_t$ records the information available by time $t$. Requiring the process to be adapted prevents using future information when defining the present value. With that structure in place, zero-mean future increments vanish under conditional expectation, leaving the current value.

**Definition & Assumptions (§3).** 1. Let $\mathcal F_t$ be the information available by time $t$. 2. A process is adapted when $M_t$ is known from $\mathcal F_t$; this prevents using future information. 3. The martingale condition is $E[M_t\mid\mathcal F_s]=M_s$ for $s<t$; conditioning says the best current prediction of the future value is the current value. 4. For $M_n=M_0+\sum_{k=1}^nY_k$ with $E[Y_k\mid\mathcal F_{k-1}]=0$, conditional expectation removes all future zero-mean increments. 5. Therefore $E[M_n\mid\mathcal F_s]=M_s$, so the process is a martingale.

**Symbols.** $M_t$ is the martingale value; $\mathcal F_t$ is current information; adapted means observable with current information; integrable means expectations exist.

**Real-World Applications (§5).** (1) **Fair random walk:** if $S_2=3$, then $E[S_5\mid\mathcal F_2]=3$. (2) **Gambler's ruin:** fair walk starting at 2 between 0 and 5 hits 5 with probability $2/5=0.4$. (3) **Asset pricing:** a discounted price with current value 100 has conditional expected future discounted value 100. (4) **A/B monitoring:** a mean-zero score process has expected next increment $0$. (5) **Brownian motion:** $E[W_2\mid\mathcal F_1]=W_1$; if $W_1=0.7$, prediction is $0.7$. (6) **Online learning:** cumulative centered losses with current sum $-4$ have future conditional expectation $-4$.

### `math-19-16` — Itô's lemma  · deepen derivation

**Connections (§1).**
> This lesson follows Brownian motion and martingales by introducing the chain rule used for Brownian-driven processes. Ordinary calculus is not enough because Brownian increments have variance of order $dt$. Itô's lemma keeps the second-order term that survives in this setting.
>
> Itô's lemma is a core tool for stochastic differential equations, option pricing, stochastic control, neural SDEs, and diffusion models. It explains how functions of stochastic processes evolve.

**Motivation & Intuition (§2).**
> In ordinary calculus, terms like $(dt)^2$ are too small to matter in a first-order differential. Brownian motion changes the bookkeeping because $(dW_t)^2$ behaves like $dt$ in the Itô rules. A second derivative term therefore contributes to the drift.
>
> The result is a corrected chain rule. The usual time derivative and first spatial derivative still appear, but the curvature of $f$ also matters through $\tfrac12\sigma^2f_{xx}$. This correction is what makes stochastic transformations consistent with Brownian variance.

**Definition & Assumptions (§3).** 1. Write the stochastic differential $dX_t=\mu dt+\sigma dW_t$. 2. Expand $f(t+dt,X_t+dX_t)$ to second order: $df=f_tdt+f_xdX_t+\tfrac12f_{xx}(dX_t)^2$ plus smaller terms. 3. Substitute $dX_t=\mu dt+\sigma dW_t$. 4. Use Itô multiplication rules: $(dt)^2=0$, $dt\,dW_t=0$, and $(dW_t)^2=dt$; this keeps the Brownian variance term. 5. Collect terms to get $df=(f_t+\mu f_x+\tfrac12\sigma^2f_{xx})dt+\sigma f_xdW_t$.

**Symbols.** $\mu$ is drift; $\sigma$ is volatility; $W_t$ is Brownian motion; $f_t,f_x,f_{xx}$ are partial derivatives; $dt$ is deterministic time and $dW_t$ is Brownian noise.

**Real-World Applications (§5).** (1) **Square transform:** for $f(x)=x^2$, $x=3$, $\mu=0.1$, $\sigma=0.5$, drift is $2\mu x+\sigma^2=0.85$. (2) **Diffusion term:** the same example has noise coefficient $2\sigma x=3$. (3) **Log GBM:** with $dS/S=0.08dt+0.2dW$, log drift is $0.08-0.2^2/2=0.06$. (4) **Option pricing:** the $\tfrac12\sigma^2S^2V_{SS}$ term is the gamma contribution. (5) **Neural SDEs:** transforming a hidden state requires the Itô correction, not just $f_xdX$. (6) **Diffusion models:** variance coefficient $\sigma=0.5$ contributes $0.25/2=0.125$ times $f_{xx}$ to drift.

### `math-19-17` — Monte Carlo methods  · deepen derivation

**Connections (§1).**
> This lesson uses randomness as a computational tool. Earlier lessons modeled random systems themselves; Monte Carlo uses simulated random samples to estimate quantities such as expectations and probabilities. The key object is an average over independent draws.
>
> Monte Carlo methods connect probability, simulation, stochastic optimization, Bayesian computation, risk analysis, and numerical integration. They also prepare for MCMC, where the samples come from a dependent Markov chain.

**Motivation & Intuition (§2).**
> Many expectations are hard to compute exactly but easy to approximate by sampling. If $g(X)$ can be evaluated on simulated draws, the sample average is a direct estimate of $E[g(X)]$. The law of large numbers explains why the average stabilizes as the number of samples grows.
>
> The uncertainty of the estimate is controlled by variance and sample size. Independence makes variances add, so the variance of the average is $\sigma^2/n$. This gives the standard $1/\sqrt n$ rate and explains why reducing error substantially often requires many more samples.

**Definition & Assumptions (§3).** 1. Draw independent samples $X_1,\ldots,X_n$ from the target distribution and compute $g(X_i)$. 2. Define $\hat\mu_n=\frac1n\sum_i g(X_i)$; this is the sample average. 3. Take expectation: $E[\hat\mu_n]=\frac1n\sum_iE[g(X_i)]=\mu$, so the estimator is unbiased. 4. Use independence: $\operatorname{Var}(\hat\mu_n)=\frac1{n^2}\sum_i\operatorname{Var}(g(X_i))=\sigma^2/n$. 5. The standard error is therefore $\sigma/\sqrt n$, explaining why four times as many samples only halves error.

**Symbols.** $X_i$ are samples; $g$ is the measured function; $\mu=E[g(X)]$ is the target expectation; $\hat\mu_n$ is the estimate; $\sigma$ is the standard deviation of $g(X)$.

**Real-World Applications (§5).** (1) **Sample mean:** samples $2,4,6,8$ give estimate $5$. (2) **Standard error:** with $\sigma=10$ and $n=100$, SE is $1$. (3) **95% interval:** estimate $5$ with SE $1$ gives about $(3.04,6.96)$. (4) **Estimating $\pi$:** 7854 hits in 10,000 quarter-square samples gives $4\cdot0.7854=3.1416$. (5) **Risk simulation:** 1% tail in 100,000 runs corresponds to about 1000 tail samples. (6) **Stochastic optimization:** mini-batch size 256 has half the gradient-noise SE of size 64 because $\sqrt{256/64}=2$.

### `math-19-18` — Markov Chain Monte Carlo (MCMC)  · AUTHOR derivation

**Connections (§1).**
> This lesson combines Monte Carlo estimation with Markov-chain stationarity. Ordinary Monte Carlo uses independent samples from the target distribution. MCMC builds a Markov chain whose stationary distribution is the target, then averages values along the chain.
>
> The lesson depends on detailed balance, stationary distributions, and Monte Carlo standard-error thinking. It is a central method in Bayesian inference, probabilistic modeling, and sampling from distributions that are hard to normalize directly.

**Motivation & Intuition (§2).**
> Direct sampling from a target distribution is often unavailable, especially when the target is known only up to a normalizing constant. MCMC avoids direct sampling by proposing local moves and accepting them in a way that leaves the target distribution stationary. After the chain has moved away from its initial condition, its visited states can be used like approximate target samples.
>
> Metropolis-Hastings corrects for proposal imbalance through the acceptance probability. Moves toward higher target density are often accepted, while moves toward lower density are accepted with a controlled probability. The detailed-balance calculation shows that this local rule produces the desired equilibrium.

**Definition & Assumptions (§3).** 1. Choose a proposal distribution $q(y\mid x)$ for candidate moves. 2. Accept $y$ with Metropolis-Hastings probability $\alpha(x,y)=\min\{1,\pi(y)q(x\mid y)/(\pi(x)q(y\mid x))\}$; this corrects proposal imbalance. 3. For accepted moves, $\pi(x)q(y\mid x)\alpha(x,y)=\min\{\pi(x)q(y\mid x),\pi(y)q(x\mid y)\}$. 4. The same expression appears with $x$ and $y$ swapped, so detailed balance holds. 5. Detailed balance implies $\pi$ is stationary, so chain averages estimate $E_\pi[g(X)]$ after burn-in.

**Symbols.** $\pi$ is the target density up to normalization; $q$ is the proposal; $\alpha$ is acceptance probability; burn-in discards early nonstationary draws.

**Real-World Applications (§5).** (1) **Symmetric proposal:** target ratio $\pi(y)/\pi(x)=0.4$ gives acceptance $0.4$. (2) **Always accept uphill:** target ratio $1.8$ gives acceptance $1$. (3) **Bayesian posterior:** a 5000-step chain with 1000 burn-in leaves 4000 averaging draws. (4) **Autocorrelation cost:** with lag correlation $0.8$, 1000 draws have ESS about $111.1$. (5) **Gibbs sampling:** a two-block Gibbs update has acceptance $1$ because it samples exact conditionals. (6) **Diagnostics:** four chains with means $1.0,1.1,0.9,1.0$ have between-chain range $0.2$ to investigate.

### `math-19-19` — Markov Decision Processes (RL)  · deepen derivation

**Connections (§1).**
> This lesson extends Markov chains by adding actions and rewards. A Markov chain describes how states move under fixed transition probabilities. A Markov decision process lets an agent choose actions that influence both transitions and rewards.
>
> MDPs connect stochastic processes to reinforcement learning, dynamic programming, policy evaluation, and state visitation. Once a policy is fixed, the MDP again induces a Markov chain, so earlier ideas about stationarity and long-run occupancy still apply.

**Motivation & Intuition (§2).**
> In many sequential problems, the next state is not only random but also affected by a decision. A policy specifies how actions are chosen from states. The value of a state is then the expected discounted reward obtained by following that policy.
>
> The Bellman equation comes from splitting the return into the immediate reward and the discounted future return. The Markov property makes the future value depend on the next state rather than on the full previous path. This recursive structure is the basis for policy evaluation and control.

**Definition & Assumptions (§3).** 1. At state $s$, choose action $a$ according to policy $\pi(a\mid s)$. 2. Receive reward $R(s,a,s')$ and move to next state $s'$ with probability $P(s'\mid s,a)$. 3. Define $V^\pi(s)$ as expected discounted return from $s$. 4. Split the return into immediate reward plus discounted future return: $G=R+\gamma G'$. 5. Take expectation over actions and next states to get $V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)[R(s,a,s')+\gamma V^\pi(s')]$.

**Symbols.** $s$ is state; $a$ is action; $P$ is transition probability; $R$ is reward; $\gamma$ is discount; $\pi$ is policy; $V^\pi$ is value.

**Real-World Applications (§5).** (1) **One-state value:** reward $2$ with $\gamma=0.9$ gives $V=2/(1-0.9)=20$. (2) **Action value:** reward $1$, then 70% chance of value 10, gives $Q=1+0.9(0.7\cdot10)=7.3$. (3) **Policy mixture:** choosing action A with probability $0.6$ and B with $0.4$ averages their Q-values. (4) **Occupancy:** a fixed policy inducing stationary $(0.6,0.4)$ visits state 2 about 4000 times in 10,000 steps. (5) **Discount horizon:** $\gamma=0.9$ has effective horizon about $1/(1-\gamma)=10$ steps. (6) **Exploration:** $\epsilon=0.1$ over 5 actions selects each non-greedy action with probability $0.025$.

### `math-19-20` — Autoregressive (AR) models  · AUTHOR derivation

**Connections (§1).**
> This lesson moves into time-series models where the current value depends on past observed values. An autoregressive model is a stochastic process with explicit linear memory. It uses earlier values as predictors and adds a new shock.
>
> AR models connect stochastic processes, regression, stationarity, autocorrelation, forecasting, and impulse response. They are a basic component of ARMA and ARIMA models.

**Motivation & Intuition (§2).**
> Many time series have persistence: a high value today tends to be followed by a high value tomorrow, though not exactly. An AR model represents that persistence by feeding lagged values back into the current value. The new shock accounts for the part not explained by the past.
>
> In AR(1), the coefficient $\phi$ controls how strongly the past carries forward. When $|\phi|<1$, the effect of a shock decays geometrically and the process can have a stable long-run mean. This makes the model both interpretable and useful for forecasting.

**Definition & Assumptions (§3).** 1. Write AR(1) as $X_t=c+\phi X_{t-1}+\varepsilon_t$, with $E[\varepsilon_t]=0$. 2. Take expectations on both sides under stationarity: $\mu=c+\phi\mu$. 3. Solve $(1-\phi)\mu=c$ to get $\mu=c/(1-\phi)$ when $|\phi|<1$. 4. Subtract the mean: $X_t-\mu=\phi(X_{t-1}-\mu)+\varepsilon_t$. 5. Iterate to see that a shock's effect after $h$ steps is $\phi^h$; this decays only when $|\phi|<1$.

**Symbols.** $X_t$ is the series value; $c$ is intercept; $\phi$ is autoregressive coefficient; $\varepsilon_t$ is white-noise shock; $p$ in AR($p$) is the number of lags.

**Real-World Applications (§5).** (1) **Long-run mean:** with $c=3$, $\phi=0.7$, mean is $10$. (2) **One-step forecast:** from $X_t=8$, forecast is $3+0.7\cdot8=8.6$. (3) **Stationary variance:** with shock variance $4$, variance is $4/(1-0.7^2)=7.8431$. (4) **Autocorrelation:** lag 3 autocorrelation is $0.7^3=0.343$. (5) **Half-life:** shock half-life is $\log(0.5)/\log(0.7)=1.943$ steps. (6) **Impulse response:** after 4 steps, a unit shock contributes $0.7^4=0.2401$.

### `math-19-21` — Moving-average (MA) models  · deepen derivation

**Connections (§1).**
> This lesson complements autoregressive models by modeling dependence through recent shocks rather than recent observed values. An MA model still describes a time series, but its memory is finite. Once a shock is older than the chosen lag order, it no longer appears directly.
>
> MA models connect white noise, autocovariance, forecasting, finite-memory processes, and ARMA models. They help distinguish persistence caused by carried-forward values from persistence caused by shared recent disturbances.

**Motivation & Intuition (§2).**
> In an MA model, the current value is built from current and past innovations. A shock can echo into a few future observations because it appears with lagged coefficients. After those lags pass, the same shock drops out of the formula.
>
> This finite memory gives a simple covariance pattern. In MA(1), neighboring observations share one shock, so they are correlated. Observations two or more lags apart share no shock, so their autocovariance is zero under the white-noise assumptions.

**Definition & Assumptions (§3).** 1. Write MA(1) as $X_t=\mu+\varepsilon_t+\theta\varepsilon_{t-1}$, where shocks are white noise with variance $\sigma^2$. 2. Take expectation: $E[X_t]=\mu$ because both shocks have mean zero. 3. Compute variance: independent shocks give $\operatorname{Var}(X_t)=\sigma^2+\theta^2\sigma^2=(1+\theta^2)\sigma^2$. 4. Compute lag-1 covariance: $X_t$ and $X_{t-1}$ share only $\varepsilon_{t-1}$, with coefficients $\theta$ and $1$, so covariance is $\theta\sigma^2$. 5. No shock is shared at lag 2 or more, so autocovariance is zero beyond lag 1.

**Symbols.** $\mu$ is mean; $\varepsilon_t$ is white-noise shock; $\theta$ is the MA coefficient; $q$ is the number of shock lags.

**Real-World Applications (§5).** (1) **Variance:** with $\theta=0.5$, $\sigma^2=4$, variance is $5$. (2) **Lag-1 covariance:** $0.5\cdot4=2$. (3) **Lag-1 autocorrelation:** $2/5=0.4$. (4) **Shock echo:** a shock $\varepsilon_t=3$ adds $3$ now and $1.5$ next step. (5) **Finite memory:** the same shock adds $0$ after two steps in MA(1). (6) **Forecast adjustment:** if the last estimated shock is $3$, the next forecast is $\mu+0.5\cdot3=\mu+1.5$.

### `math-19-22` — ARMA and ARIMA models  · deepen derivation

**Connections (§1).**
> This lesson combines the AR and MA ideas into one time-series family. ARMA models carry information through past values and recent shocks. ARIMA adds differencing so the same tools can be used after removing certain kinds of nonstationary behavior.
>
> These models connect forecasting, stationarity, impulse response, differencing, and practical time-series workflows. They show how stochastic-process structure can be built from a few interpretable linear pieces.

**Motivation & Intuition (§2).**
> AR terms explain persistence through previous observations, while MA terms explain short-run effects of previous shocks. Many series need both kinds of memory. ARMA combines them so a shock can affect the present directly, echo once through the MA term, and then continue through the AR recursion.
>
> ARIMA adds differencing when the original level of the series is not stable enough to model directly. Differencing replaces levels by changes, such as $X_t-X_{t-1}$. After enough differencing, an ARMA model can be applied to the transformed series.

**Definition & Assumptions (§3).** 1. Write ARMA(1,1): $X_t=c+\phi X_{t-1}+\varepsilon_t+\theta\varepsilon_{t-1}$. 2. For stationarity, take expectations: $\mu=c+\phi\mu$, so $\mu=c/(1-\phi)$. 3. A unit shock enters immediately with coefficient $1$. 4. One step later it enters through both the AR propagation and the MA term, giving coefficient $\phi+\theta$. 5. After that, the AR part propagates geometrically, so coefficients are $\phi^{h-1}(\phi+\theta)$ for $h\ge1$. 6. ARIMA($p,d,q$) applies ARMA to $\Delta^dX_t$, where $\Delta X_t=X_t-X_{t-1}$.

**Symbols.** $\phi$ is AR coefficient; $\theta$ is MA coefficient; $\Delta$ is differencing; $d$ is the number of differences; $\varepsilon_t$ is white noise.

**Real-World Applications (§5).** (1) **Mean:** with $c=2$, $\phi=0.5$, mean is $4$. (2) **Forecast:** with $X_t=5$, last shock $1$, forecast is $2+0.5\cdot5+0.4\cdot1=4.9$. (3) **First difference:** series $100,103,102$ gives differences $3,-1$. (4) **Shock coefficient:** with $\phi=0.5$, $\theta=0.4$, lag-1 impulse is $0.9$. (5) **Total impulse:** sum is $(1+\theta)/(1-\phi)=2.8$. (6) **Variance formula:** with shock variance 1, ARMA(1,1) variance is $(1+0.4^2+2\cdot0.5\cdot0.4)/(1-0.5^2)=2.08$.

### `math-19-23` — Hidden Markov Models  · AUTHOR derivation

**Connections (§1).**
> This lesson returns to Markov chains with an important added layer: the states are not directly observed. Instead, each hidden state emits visible data. The model separates the hidden process from the noisy observations generated by it.
>
> Hidden Markov models connect Markov chains, conditional independence, dynamic programming, sequence labeling, speech recognition, and fault detection. The forward algorithm and Viterbi recursion are standard examples of probabilistic inference over sequences.

**Motivation & Intuition (§2).**
> In many sequence problems, the observed data are clues about an underlying state rather than the state itself. A speech signal gives evidence about phonemes, sensor readings give evidence about faults, and user behavior can give evidence about latent intent. The hidden chain models how the latent state evolves.
>
> The forward message summarizes all paths that end in each hidden state after seeing the observations so far. It uses total probability to sum over previous states and the emission probability to attach the current observation. Viterbi uses a similar recursion but keeps the best path score instead of the total probability.

**Definition & Assumptions (§3).** 1. Let $Z_t$ be hidden state and $X_t$ be observation. 2. The hidden chain uses transitions $A_{ij}=P(Z_t=j\mid Z_{t-1}=i)$. 3. Emissions use $B_j(x)=P(X_t=x\mid Z_t=j)$. 4. Define the forward message $\alpha_t(j)=P(X_1,\ldots,X_t,Z_t=j)$. 5. Split by previous hidden state: $\alpha_t(j)=B_j(X_t)\sum_i\alpha_{t-1}(i)A_{ij}$; this is total probability plus the Markov and conditional-independence assumptions. 6. For best-path decoding, replace the sum by a max to get the Viterbi recursion.

**Symbols.** $Z_t$ is hidden state; $X_t$ is observed value; $A$ is transition matrix; $B_j$ is emission probability; $\alpha_t$ is a forward probability; Viterbi stores max path scores.

**Real-World Applications (§5).** (1) **Forward first step:** with initial $(0.6,0.4)$ and yes-emissions $(0.9,0.4)$, $\alpha_1=(0.54,0.16)$ and likelihood $0.70$. (2) **Two-observation likelihood:** for yes then no with no-emissions $(0.1,0.6)$, $\alpha_2=(0.041,0.174)$ and likelihood $0.215$. (3) **State posterior:** $P(Z_2=2\mid\text{yes,no})=0.174/0.215=0.8093$. (4) **Viterbi path:** path $1\to2$ has score $0.6\cdot0.9\cdot0.3\cdot0.6=0.0972$, larger than $2\to2$ score $0.0768$. (5) **Speech recognition:** a 20-state phoneme HMM uses a 20-entry forward vector each frame. (6) **Fault detection:** if posterior fault probability is $0.8093$, it crosses a 0.8 alert threshold by $0.0093$.

### `math-19-24` — Diffusion processes as generative models  · deepen derivation

**Connections (§1).**
> This lesson closes the section by connecting stochastic processes to modern generative modeling. The forward process is a Markov chain that gradually corrupts data with Gaussian noise. The learned reverse process tries to denoise step by step.
>
> Diffusion generative models connect Markov processes, Gaussian conditioning, Brownian-style noise intuition, score modeling, and stochastic simulation. They reuse the section's core idea that a complex random object can be understood through a sequence of conditional transitions.

**Motivation & Intuition (§2).**
> The forward diffusion process is deliberately simple: each step keeps part of the previous signal and adds fresh Gaussian noise. After many steps, the data become easier to describe because most structure has been washed out. The cumulative coefficient $\bar\alpha_t$ tracks how much original signal remains.
>
> Generation reverses this controlled corruption. A model is trained to predict the noise or score needed to move from a noisier sample toward a cleaner one. The Markov structure matters because each reverse step only needs the current noisy sample and the time step, rather than the whole previous history.

**Definition & Assumptions (§3).** 1. Define one forward step as $x_t=\sqrt{\alpha_t}x_{t-1}+\sqrt{1-\alpha_t}\,\varepsilon_t$, with $\varepsilon_t\sim N(0,I)$. 2. The coefficient $\sqrt{\alpha_t}$ keeps part of the previous signal and $\sqrt{1-\alpha_t}$ adds fresh Gaussian noise. 3. Because each step depends only on $x_{t-1}$ and new noise, the forward process is Markov. 4. Repeated substitution gives $x_t=\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\,\varepsilon$ for cumulative $\bar\alpha_t=\prod_s\alpha_s$; independent Gaussian noises combine into one Gaussian noise term. 5. Training predicts the noise or score needed to reverse this Gaussian corruption.

**Symbols.** $x_t$ is the noisy sample at step $t$; $\alpha_t$ is signal-retention per step; $\bar\alpha_t$ is cumulative retention; $\varepsilon_t$ is standard Gaussian noise; the reverse model approximates denoising transitions.

**Real-World Applications (§5).** (1) **One noising step:** with $\alpha=0.9$, $x=2$, $\varepsilon=-1$, $x_t=1.5811$. (2) **Cumulative signal:** if $\bar\alpha=0.81$ and $x_0=2$, retained mean is $1.8$. (3) **Noise variance:** the same step has variance $1-0.81=0.19$. (4) **Noise standard deviation:** $\sqrt{0.19}=0.4359$. (5) **SNR:** $\bar\alpha/(1-\bar\alpha)=0.81/0.19=4.2632$. (6) **Classifier-free guidance:** with $\epsilon_u=0.5$, $\epsilon_c=0.2$, scale $3$, guided noise is $0.5+3(0.2-0.5)=-0.4$.

---

## Build order for this section

1. **Fix mechanical LaTeX first** in `19-06`, `19-07`, and `19-08` so the shared matrix renders with `\\` row breaks everywhere.
2. **Author stationarity cluster** `19-06` → `19-07` → `19-08`; reuse the checked chain $P=\begin{bmatrix}0.8&0.2\\0.3&0.7\end{bmatrix}$ and keep the stationary/mixing/detailed-balance numbers consistent.
3. **Replace the 12 boilerplate §5 blocks** in `19-01`…`19-12`, using the exact app lists above.
4. **Author the remaining derivations** in order: continuous-time/Poisson/birth-death/random-walk foundations, then Brownian/GP/martingale/Itô/Monte Carlo/MCMC, then time-series/HMM/diffusion.
5. **Promote formulas to display form and add symbols** on all 16 currently inline-only lessons; keep `19-01` marked explain-only so derivation lint does not force a fake proof.
