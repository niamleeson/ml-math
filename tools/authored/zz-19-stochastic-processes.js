module.exports = {
  "math-19-01": {
    connectionsProse: "<p>This lesson starts the section by naming the object that later lessons study in detail. Earlier probability lessons often focused on one random variable or one distribution at a time. A stochastic process keeps that same probability language but attaches it to many indexed random variables at once.</p>" +
                     "<p>This viewpoint prepares the ground for Markov chains, Poisson processes, Brownian motion, time-series models, and diffusion models. In all of those settings, the main object is not one random outcome but a random path evolving across time, steps, or space.</p>",
    motivation: "<p>A single random variable can describe one uncertain quantity, such as whether a user clicks or how many requests arrive in one minute. Many systems need more structure than that because the values arrive as a sequence. A stochastic process packages the whole collection into one model, so the model can describe both individual values and how values are related across indices.</p>" +
                "<p>The index set might be discrete time, continuous time, positions in an image, or nodes in a network. Once the index set and state space are named, a sample path becomes one realized sequence or function. This makes it possible to discuss dependence, trends, jumps, and long-run behavior without pretending the observations are isolated.</p>",
    definition: "<p>A stochastic process is an indexed family of random variables $$\\{X_t:t\\in T\\}$$ with an index set, a state space, and finite-dimensional distributions describing joint behavior across selected indices.</p>" +
                "<p><b>Assumptions that matter:</b> This lesson is explain-only: without extra assumptions about dependence, time, or state space, there is no identity to prove.</p>",
    symbols: [
      { sym: "$X_t$", desc: "the random value at index $t$" },
      { sym: "$T$", desc: "the index set" },
      { sym: "$S$", desc: "the state space" },
      { sym: "sample path", desc: "one realized sequence or function of values" }
    ],
    applications: [
      { title: "Binary click process", background: "For independent Bernoulli clicks with $p=0.2$.", numbers: "$P(X_1=1,X_2=0,X_3=1)=0.2\\cdot0.8\\cdot0.2=0.032$" },
      { title: "Path count", background: "A 10-step binary process enumerates all binary sample paths.", numbers: "$2^{10}=1024$ possible paths" },
      { title: "Traffic counts", background: "Expected totals add over three periods with means $100,120,80$.", numbers: "$300$" },
      { title: "Rolling metric", background: "One sample path $(3,4,2)$ has a three-step average.", numbers: "$3$" },
      { title: "Spatial process", background: "A $4\\times4$ image patch is a random field.", numbers: "$16$ indexed variables" },
      { title: "Time dependence", background: "An AR(1) process with variance $1$ and lag correlation $0.7$.", numbers: "covariance $0.7$ between adjacent times" }
    ]
  },
  "math-19-02": {
    connectionsProse: "<p>This lesson builds directly on stochastic processes by adding a simple rule about dependence. Instead of allowing the whole past to affect the next value, a discrete-time Markov chain says the present state contains the information needed for the next step. That makes the process easier to compute without making it deterministic.</p>" +
                     "<p>The Markov-chain idea leads naturally to transition matrices, multi-step probabilities, state classification, stationarity, and MCMC. It is also the template behind many models in reliability, user behavior, sequence simulation, and reinforcement learning.</p>",
    motivation: "<p>A general stochastic process can remember a long and complicated history. In many step-by-step systems, the current state is designed to summarize that history well enough for prediction. If a user is currently active, or a machine is currently up, the next-step model can often start from that current state rather than from every earlier state.</p>" +
                "<p>The Markov property is the mathematical version of that summary. It does not say the past is irrelevant in an ordinary sense; it says the past affects the future only through the present state. Once this is true, every one-step prediction can be stored as a transition probability, and repeated movement becomes matrix algebra.</p>",
    definition: "<p>A discrete-time Markov chain is a stochastic process whose next-state distribution depends on the past only through the current state: $$P(X_{n+1}=j\\mid X_n=i,X_{n-1},\\ldots,X_0)=P(X_{n+1}=j\\mid X_n=i)=P_{ij}.$$</p>" +
                "<p><b>Assumptions that matter:</b> Time is discrete, the current state summarizes the relevant history, and in the time-homogeneous case the same $P_{ij}$ applies at every step.</p>",
    symbols: [
      { sym: "$X_n$", desc: "the state at step $n$" },
      { sym: "$S$", desc: "the state space" },
      { sym: "$P_{ij}$", desc: "the probability of moving from $i$ to $j$ in one step" },
      { sym: "$P$", desc: "the matrix of all $P_{ij}$" }
    ],
    derivation: [
      { do: "Start with conditional probability from all history.", result: "$P(X_{n+1}=j\\mid X_n=i,X_{n-1},\\ldots,X_0)$", why: "This is the most general one-step prediction." },
      { do: "Impose the Markov property.", result: "$P(X_{n+1}=j\\mid X_n=i)$", why: "The present state is the sufficient summary." },
      { do: "Name each one-step probability.", result: "$P_{ij}=P(X_{n+1}=j\\mid X_n=i)$", why: "Every pair of states gets a transition probability." },
      { do: "Read row 1 of the example matrix.", result: "$P=\\begin{bmatrix}0.7&0.3\\0.2&0.8\\end{bmatrix}$ gives $(0.7,0.3)$", why: "Starting in state 1 uses row 1 as the next-state distribution." },
      { do: "Multiply for a second step.", result: "$(1,0)P^2=(0.55,0.45)$", why: "The current distribution becomes the new mixture over rows." }
    ],
    applications: [
      { title: "User retention", background: "With $P_{\\text{active,inactive}}=0.3$.", numbers: "an active user has $0.7$ chance to remain active next step" },
      { title: "Two-step churn", background: "Row 1 of $P^2$ above gives the two-step inactive probability.", numbers: "$P(X_2=\\text{inactive}\\mid X_0=\\text{active})=0.45$" },
      { title: "Recommendation state", background: "From current distribution $(0.4,0.6)$.", numbers: "$(0.4,0.6)P=(0.40,0.60)$" },
      { title: "Reliability", background: "If failure is absorbing with row $(0,1)$ and up-state failure probability $0.02$.", numbers: "two-step survival is $0.98^2=0.9604$" },
      { title: "Experiment funnels", background: "If view-to-click is $0.3$ and click-to-buy is $0.2$.", numbers: "two-step buy probability is $0.06$" },
      { title: "Sequence simulation", background: "A path $1\\to2\\to2$ under $P$.", numbers: "probability $0.3\\cdot0.8=0.24$" }
    ]
  },
  "math-19-03": {
    connectionsProse: "<p>This lesson turns the Markov-chain rule into a compact computational object. Once every one-step probability is placed into a table, the whole distribution can be advanced without listing paths one by one. The table is the transition matrix.</p>" +
                     "<p>Transition matrices are the working language for finite Markov chains. They support Chapman–Kolmogorov equations, stationary distributions, limiting distributions, state classification, and many applications where populations move between categories.</p>",
    motivation: "<p>A chain has many possible current states, and each current state has a row of possible next states. The transition matrix stores those rows in one place. A row-stochastic matrix is therefore not just a table of numbers; each row is a complete probability distribution for one current state.</p>" +
                "<p>Multiplying a current distribution by the matrix applies total probability. The mass currently in each state is spread across next states according to that state's row, and all incoming contributions are added. This is why matrix multiplication is the natural update rule for Markov chains.</p>",
    definition: "<p>A transition matrix $P$ stores one-step Markov transition probabilities and updates row-vector distributions by $$\\mu_{n+1}=\\mu_nP,\\qquad (\\mu_{n+1})_j=\\sum_i\\mu_{n,i}P_{ij}.$$</p>" +
                "<p><b>Assumptions that matter:</b> $P$ is row-stochastic, so its entries are nonnegative and every row sums to $1$.</p>",
    symbols: [
      { sym: "$P$", desc: "a row-stochastic transition matrix" },
      { sym: "$P_{ij}$", desc: "a one-step probability" },
      { sym: "$\\mu_n$", desc: "the distribution at step $n$" },
      { sym: "$\\mu_nP$", desc: "the next distribution" }
    ],
    derivation: [
      { do: "Let $\\mu_n$ record current probabilities.", result: "$(\\mu_n)_i=P(X_n=i)$", why: "The row vector stores the distribution at step $n$." },
      { do: "Split next-state probability by current state.", result: "$P(X_{n+1}=j)=\\sum_i P(X_n=i)P(X_{n+1}=j\\mid X_n=i)$", why: "This is total probability." },
      { do: "Replace terms by matrix notation.", result: "$(\\mu_{n+1})_j=\\sum_i\\mu_{n,i}P_{ij}$", why: "Each entry adds incoming mass to state $j$." },
      { do: "Write all components at once.", result: "$\\mu_{n+1}=\\mu_nP$", why: "Matrix multiplication is total probability in vector form." },
      { do: "Compute the example update.", result: "$(0.25,0.75)\\begin{bmatrix}0.6&0.4\\0.1&0.9\\end{bmatrix}=(0.225,0.775)$", why: "Each next-state probability is the sum of row-weighted contributions." }
    ],
    applications: [
      { title: "Population update", background: "Using the example distribution and matrix.", numbers: "$(0.25,0.75)P=(0.225,0.775)$" },
      { title: "Two-step matrix", background: "Squaring the example transition matrix.", numbers: "$P^2=\\begin{bmatrix}0.40&0.60\\0.15&0.85\\end{bmatrix}$" },
      { title: "Row validation", background: "The first row must sum to one.", numbers: "$0.6+0.4=1$" },
      { title: "Expected active users", background: "If 1000 users start with distribution $(0.25,0.75)$.", numbers: "next counts are $(225,775)$" },
      { title: "A/B state migration", background: "From state 1 after two steps.", numbers: "probability of state 2 is $0.60$" },
      { title: "Data-quality check", background: "A row sum of $0.97$.", numbers: "missing probability $0.03$" }
    ]
  },
  "math-19-04": {
    connectionsProse: "<p>This lesson builds on transition matrices and asks how one-step movement becomes multi-step movement. Earlier Markov-chain lessons showed that one multiplication advances a distribution by one step. Chapman–Kolmogorov explains why repeated multiplication gives the correct probabilities for longer horizons.</p>" +
                     "<p>The same equation appears whenever a process moves through possible intermediate states. It supports forecasting, matrix powers, path attribution, dynamic programming, and later limiting-distribution calculations.</p>",
    motivation: "<p>To find the chance of going from state $i$ to state $j$ in several steps, it is useful to pause at an intermediate time. At that time, the process must be in some state $k$. The total probability is found by adding the probabilities of all ways to pass through those possible $k$ values.</p>" +
                "<p>The Markov property makes this decomposition clean. Once the process is at $k$, the future segment depends on $k$ rather than on the earlier path. Chapman–Kolmogorov is exactly this split-and-sum rule written in matrix form.</p>",
    definition: "<p>The Chapman–Kolmogorov equations split an $(m+n)$-step transition through an intermediate state: $$P^{(m+n)}_{ij}=\\sum_k P^{(m)}_{ik}P^{(n)}_{kj}.$$</p>" +
                "<p><b>Assumptions that matter:</b> The chain is Markov and time-homogeneous, and the intermediate states form disjoint cases covering all paths.</p>",
    symbols: [
      { sym: "$P^{(r)}_{ij}$", desc: "the $r$-step transition probability" },
      { sym: "$m,n$", desc: "step counts" },
      { sym: "$k$", desc: "an intermediate state" }
    ],
    derivation: [
      { do: "Start with the long-horizon transition.", result: "$P(X_{m+n}=j\\mid X_0=i)$", why: "This is the chance of ending at $j$ after $m+n$ steps." },
      { do: "Insert the intermediate state.", result: "sum over all $k$", why: "Total probability says the disjoint cases cover all paths." },
      { do: "Write the joint terms.", result: "$\\sum_k P(X_m=k,X_{m+n}=j\\mid X_0=i)$", why: "Each term describes passing through one possible $k$." },
      { do: "Factor each joint probability.", result: "$P(X_m=k\\mid X_0=i)P(X_{m+n}=j\\mid X_m=k,X_0=i)$", why: "This is the multiplication rule for conditional probability." },
      { do: "Apply the Markov/time-homogeneous property.", result: "the second factor becomes $P^{(n)}_{kj}$", why: "After reaching $k$, the future segment depends only on $k$." },
      { do: "Collect the terms.", result: "$P^{(m+n)}_{ij}=\\sum_k P^{(m)}_{ik}P^{(n)}_{kj}$", why: "The split-and-sum rule is exactly matrix multiplication." }
    ],
    applications: [
      { title: "Two-step transition", background: "For $P=\\begin{bmatrix}0.7&0.3\\0.2&0.8\\end{bmatrix}$.", numbers: "$P^2_{12}=0.7\\cdot0.3+0.3\\cdot0.8=0.45$" },
      { title: "Three-step prediction", background: "Using the same matrix.", numbers: "$P^3_{12}=0.525$" },
      { title: "Attribution through states", background: "The two contributions to $P^2_{12}$ separate by intermediate state.", numbers: "through state 1 is $0.21$, through state 2 is $0.24$" },
      { title: "Path planning", background: "Two-hop reachability is positive when at least one product $P_{ik}P_{kj}$ is positive.", numbers: "here both products are positive" },
      { title: "Batch forecasting", background: "Starting from state 1.", numbers: "$(1,0)P^3=(0.475,0.525)$" },
      { title: "Matrix-power caching", background: "Computing $P^{10}$ by repeated powers for the stationary example matrix.", numbers: "$P^{10}_{12}=0.399609$" }
    ]
  },
  "math-19-05": {
    connectionsProse: "<p>This lesson uses transition probabilities to describe the roles that states play in a Markov chain. Once matrix powers tell us which states can be reached, the chain also has a graph structure. Classification gives names to the important graph patterns.</p>" +
                     "<p>These names matter for long-run behavior. Closed classes, communicating classes, transient states, recurrent states, and periodic states determine whether a chain settles, traps probability, or keeps cycling.</p>",
    motivation: "<p>A transition matrix gives local one-step movement, but a state may be important because of what happens over many steps. Some states lead back to each other and form a communicating group. Some states can be left and never returned to. Some states or classes trap the process once entered.</p>" +
                "<p>Classification turns these qualitative facts into precise conditions. Accessibility uses positive entries of matrix powers, closed classes use the absence of exits, and transience can be measured by expected return visits. This gives a bridge from the diagram of a chain to statements about long-run probability.</p>",
    definition: "<p>State classification uses reachability, communication, closed classes, recurrence, transience, and period to describe the long-run roles of Markov-chain states. A basic reachability condition is $$i\\to j\\quad\\text{when}\\quad P^n_{ij}>0\\text{ for some }n\\ge0.$$</p>" +
                "<p><b>Assumptions that matter:</b> Matrix powers encode possible paths; recurrence and transience describe return behavior over time.</p>",
    symbols: [
      { sym: "$i\\to j$", desc: "state $j$ is accessible from state $i$" },
      { sym: "$P^n_{ij}$", desc: "an $n$-step transition probability" },
      { sym: "recurrent", desc: "return with probability $1$" },
      { sym: "transient", desc: "return probability is less than $1$ or expected visits are finite" }
    ],
    derivation: [
      { do: "Define accessibility by matrix powers.", result: "$i\\to j$ when $P^n_{ij}>0$ for some $n\\ge0$", why: "A positive entry means at least one $n$-step path exists." },
      { do: "Define communication.", result: "$i$ and $j$ communicate when both $i\\to j$ and $j\\to i$", why: "Mutual access forms communication classes." },
      { do: "Define a closed class.", result: "no positive transition leaves the class", why: "Once entered, probability cannot escape." },
      { do: "Measure transience by expected visits.", result: "$1+q+q^2+\\cdots=1/(1-q)$", why: "A self-loop probability $q<1$ before exit gives a finite geometric series." },
      { do: "Substitute $q=0.6$.", result: "$1/(1-0.6)=2.5$", why: "Finite expected visits indicate transience in that open chain." }
    ],
    applications: [
      { title: "Absorbing checkout", background: "A state with a certain self-loop is absorbing.", numbers: "$P_{33}=1$ makes state 3 absorbing" },
      { title: "Two-step access", background: "If $P_{12}=0.5$ and $P_{23}=0.6$.", numbers: "$P^2_{13}\\ge0.30$, so $1\\to3$" },
      { title: "Communicating pair", background: "Transitions in both directions connect states 1 and 2.", numbers: "$P_{12}=0.4$ and $P_{21}=0.5$ put states 1 and 2 in the same class" },
      { title: "Periodic monitoring", background: "Deterministic alternation returns only at even times.", numbers: "period $\\gcd(2,4,6,\\ldots)=2$" },
      { title: "Transient page", background: "With self-loop $0.6$ before exit.", numbers: "expected visits are $2.5$" },
      { title: "Absorption probability", background: "Solving $h_1=0.3+0.5h_2$, $h_2=0.4+0.2h_1$.", numbers: "$h_1=0.5556$" }
    ]
  },
  "math-19-06": {
    connectionsProse: "<p>This lesson builds on transition matrices and on the Markov-chain rule that the next distribution is found by multiplying the current distribution by $P$. Earlier lessons asked how probability moves after one step or several steps. Here the question is what it means for the whole distribution to be in equilibrium.</p>" +
                     "<p>Stationary distributions are the link from finite Markov-chain algebra to long-run behavior. Limiting distributions, detailed balance, MCMC correctness, PageRank, queue occupancy, and RL visitation measures all use the same equation: after one transition, the distribution is unchanged.</p>",
    motivation: "<p>A Markov chain can keep moving even when its overall distribution is steady. In the two-state chain with transition matrix $P=\\begin{bmatrix}0.8&0.2\\0.3&0.7\\end{bmatrix}$, some probability moves from state 1 to state 2 on each step, and some probability moves back. A stationary distribution is the set of weights where those flows balance.</p>" +
                "<p>For this chain the stationary distribution is $\\pi=(0.6,0.4)$. That does not mean a sample path stops. It means that if 60% of the mass starts in state 1 and 40% starts in state 2, the next step has the same 60/40 split. This is why stationarity is useful: it turns a moving random system into a stable long-run summary.</p>",
    definition: "<p>A stationary distribution is a probability row vector that is unchanged by one transition: $$\\pi P=\\pi,\\qquad \\pi_i\\ge 0,\\qquad \\sum_i \\pi_i=1.$$</p>" +
                "<p><b>Assumptions that matter:</b> The rows of $P$ sum to $1$ and the chain is finite; uniqueness needs the usual irreducible/aperiodic conditions, but $\\pi P=\\pi$ itself is the definition.</p>",
    symbols: [
      { sym: "$P$", desc: "the transition matrix" },
      { sym: "$P_{ij}$", desc: "the probability of moving from state $i$ to state $j$" },
      { sym: "$\\pi$", desc: "the stationary row vector" },
      { sym: "$\\pi_i$", desc: "long-run mass at state $i$ when the chain is in equilibrium" }
    ],
    derivation: [
      { do: "Write the unknown stationary distribution.", result: "$\\pi=(a,b)$", why: "The chain has two states, and $a,b$ are the probabilities assigned to states 1 and 2." },
      { do: "Multiply by $P$.", result: "$(a,b)P=(0.8a+0.3b,\\ 0.2a+0.7b)$", why: "Each new component adds all incoming probability mass." },
      { do: "Set the result equal to the original distribution.", result: "$(a,b)P=(a,b)$", why: "Stationarity means one step leaves the distribution unchanged." },
      { do: "Use the first component.", result: "$0.8a+0.3b=a$, so $0.3b=0.2a$", why: "This is the balance of flow into and out of state 1." },
      { do: "Add normalization.", result: "$a+b=1$", why: "$\\pi$ is a probability distribution." },
      { do: "Substitute $b=\\tfrac{2}{3}a$ into normalization.", result: "$a+\\tfrac{2}{3}a=1$, so $\\tfrac{5}{3}a=1$ and $a=0.6$", why: "The balance equation and total mass determine $a$." },
      { do: "Solve for $b$ and check.", result: "$b=0.4$, so $\\pi=(0.6,0.4)$", why: "$0.6\\cdot0.8+0.4\\cdot0.3=0.6$ and $0.6\\cdot0.2+0.4\\cdot0.7=0.4$." }
    ],
    applications: [
      { title: "PageRank", background: "A page's rank is stationary mass; for the chain above.", numbers: "$0.6\\cdot0.8+0.4\\cdot0.3=0.6$" },
      { title: "MCMC correctness", background: "Detailed balance certifies stationarity.", numbers: "$0.6\\cdot0.2=0.4\\cdot0.3=0.12$" },
      { title: "Ergodic averages", background: "In 1000 long-run visits.", numbers: "expected counts are about $600$ and $400$" },
      { title: "Queue occupancy", background: "An M/M/1 birth-death chain with $\\rho=0.4$.", numbers: "$\\pi_0=0.6$ and $\\pi_1=0.24$" },
      { title: "Mixing", background: "From state 1 after five steps.", numbers: "$(1,0)P^5=(0.6125,0.3875)$, only $0.0125$ total-variation distance from $(0.6,0.4)$" },
      { title: "RL state visitation", background: "Under a fixed policy with this induced chain.", numbers: "a 10,000-step on-policy average weights states by about $6000$ and $4000$ visits" }
    ]
  },
  "math-19-07": {
    connectionsProse: "<p>This lesson follows stationary distributions by separating equilibrium from convergence to equilibrium. A stationary distribution stays fixed if the chain starts there. A limiting distribution describes what ordinary starting states approach after many transitions.</p>" +
                     "<p>This distinction is central in Markov-chain modeling. It connects matrix powers to mixing, burn-in, long-run exposure, and warnings about periodic chains that have stationary distributions but do not settle from a fixed start.</p>",
    motivation: "<p>A chain may begin concentrated in one state, so its early distributions remember that initial condition. As the chain runs, repeated multiplication by $P$ can spread and rebalance the mass. When the chain is well behaved, the rows of $P^n$ become nearly identical, meaning the long-run distribution no longer depends much on the starting state.</p>" +
                "<p>The limit, when it exists, must be stationary because taking one more transition should not change a distribution that has already settled. This is why limiting distributions are stronger than stationary distributions. They describe both the destination and the convergence from ordinary initial conditions.</p>",
    definition: "<p>A limiting distribution is the common row limit of transition powers, when it exists, and it must satisfy stationarity: $$P(X_n=j\\mid X_0=i)\\to \\ell_j,\\qquad \\ell P=\\ell.$$</p>" +
                "<p><b>Assumptions that matter:</b> Convergence needs irreducibility and aperiodicity; periodic chains can fail to settle even when stationary distributions exist.</p>",
    symbols: [
      { sym: "$\\ell$", desc: "the limiting distribution" },
      { sym: "$P^n$", desc: "the $n$-step transition matrix" },
      { sym: "irreducible", desc: "all states communicate" },
      { sym: "aperiodic", desc: "returns do not occur only on a fixed cycle" }
    ],
    derivation: [
      { do: "Write the distribution after $n$ steps.", result: "$\\mu_0P^n$", why: "Each multiplication advances one step." },
      { do: "Assume rows converge to a common vector.", result: "$P(X_n=j\\mid X_0=i)\\to\\ell_j$", why: "The long-run distribution then no longer depends on starting state $i$." },
      { do: "Multiply one more step and pass to the limit.", result: "$\\ell P=\\lim_{n\\to\\infty}(\\text{row }i\\text{ of }P^n)P=\\lim_{n\\to\\infty}\\text{row }i\\text{ of }P^{n+1}=\\ell$", why: "A settled distribution must be stationary." },
      { do: "Compute a ten-step row for the shared two-state chain.", result: "$P^{10}$ has first row $(0.600390625,0.399609375)$", why: "This is close to the stationary distribution $(0.6,0.4)$." },
      { do: "State the convergence condition.", result: "irreducible and aperiodic chains settle; periodic chains may not", why: "A stationary vector alone does not guarantee a limiting row from every start." }
    ],
    applications: [
      { title: "Cold-start forgetting", background: "From state 1 after five steps.", numbers: "$P^5=(0.6125,0.3875)$, near $(0.6,0.4)$" },
      { title: "Distance to equilibrium", background: "After 5 steps.", numbers: "total-variation distance is $0.0125$" },
      { title: "Ten-step prediction", background: "For the shared chain.", numbers: "$P^{10}_{12}=0.399609$" },
      { title: "Recommendation exposure", background: "A chain with limit $(0.6,0.4)$.", numbers: "allocates 40% long-run exposure to state 2" },
      { title: "A/B carryover", background: "Starting from state 2 after five steps.", numbers: "row 2 of $P^5=(0.58125,0.41875)$" },
      { title: "Period warning", background: "The two-state alternating chain.", numbers: "has stationary $(0.5,0.5)$ but no limiting row from state 1 because rows alternate" }
    ]
  },
  "math-19-08": {
    connectionsProse: "<p>This lesson continues the stationarity cluster by adding a stronger, more local way to prove equilibrium. Stationarity says total incoming mass equals the mass at each state after one step. Detailed balance checks equality pair by pair along transitions.</p>" +
                     "<p>Reversibility is especially useful in MCMC, birth-death processes, and random walks on undirected graphs. It gives a practical certificate that a proposed chain has the desired stationary distribution.</p>",
    motivation: "<p>At stationarity, probability may still move between states. The distribution remains unchanged because outgoing and incoming flows balance in aggregate. Detailed balance asks for an even cleaner symmetry: for every pair of states, the equilibrium flow from $i$ to $j$ equals the flow from $j$ to $i$.</p>" +
                "<p>This pairwise condition is stronger than ordinary stationarity, but it is often easier to verify. Instead of summing all incoming paths first, one checks local equalities. When those local equalities hold everywhere, the global stationary equation follows.</p>",
    definition: "<p>Detailed balance says equilibrium flow is equal in both directions for every pair: $$\\pi_iP_{ij}=\\pi_jP_{ji}.$$ When this holds, the chain is reversible and $\\pi$ is stationary.</p>" +
                "<p><b>Assumptions that matter:</b> $\\pi$ is a probability distribution, $P$ is row-stochastic, and the pairwise balance equalities hold for all relevant pairs.</p>",
    symbols: [
      { sym: "$\\pi_iP_{ij}$", desc: "equilibrium flow from $i$ to $j$" },
      { sym: "reversible", desc: "the stationary process has the same law forward and backward in time" },
      { sym: "detailed balance", desc: "the pairwise equality of forward and reverse equilibrium flow" }
    ],
    derivation: [
      { do: "Write the equilibrium flow from $i$ to $j$.", result: "$\\pi_iP_{ij}$", why: "The chain is in $i$ with probability $\\pi_i$ and then moves to $j$." },
      { do: "Impose detailed balance.", result: "$\\pi_iP_{ij}=\\pi_jP_{ji}$", why: "Each edge has equal forward and reverse flow." },
      { do: "Sum both sides over $i$.", result: "$\\sum_i\\pi_iP_{ij}=\\sum_i\\pi_jP_{ji}$", why: "This collects all incoming flow to $j$." },
      { do: "Use the row sum for state $j$.", result: "$\\sum_i\\pi_jP_{ji}=\\pi_j\\sum_iP_{ji}=\\pi_j$", why: "$\\pi_j$ does not depend on $i$, and row $j$ sums to $1$ when summing incoming reverse counterparts over all $i$." },
      { do: "Conclude stationarity.", result: "$\\sum_i\\pi_iP_{ij}=\\pi_j$, so $\\pi P=\\pi$", why: "Detailed balance implies the stationary equation component by component." }
    ],
    applications: [
      { title: "Two-state check", background: "For the shared stationary chain.", numbers: "$0.6\\cdot0.2=0.4\\cdot0.3=0.12$, so the stationary chain is reversible" },
      { title: "MCMC design", background: "A symmetric proposal with target ratio $0.4$.", numbers: "accepts with probability $0.4$" },
      { title: "Birth-death queue", background: "With $\\rho=0.4$.", numbers: "$\\pi_2\\lambda=0.096\\cdot2=0.192$ and $\\pi_3\\mu=0.0384\\cdot5=0.192$" },
      { title: "Undirected random walk", background: "On a 4-node regular graph.", numbers: "uniform $\\pi_i=0.25$ balances each edge flow" },
      { title: "Nonreversible warning", background: "A directed 3-cycle.", numbers: "one-way flow $1/3$ and reverse flow $0$" },
      { title: "Metropolis correction", background: "If proposal flow is twice too large in one direction.", numbers: "an acceptance factor $0.5$ restores balance" }
    ]
  },
  "math-19-09": {
    connectionsProse: "<p>This lesson extends Markov chains from fixed time steps to random event times. The state still summarizes the future in the Markov sense, but transitions now occur in continuous time. The main object changes from a transition matrix per step to a generator matrix of rates.</p>" +
                     "<p>Continuous-time Markov chains lead directly to Poisson processes, birth-death processes, queues, reliability models, and matrix exponentials. They are the natural language for systems where waiting times matter.</p>",
    motivation: "<p>In a discrete-time chain, every step has the same clock tick. Many real systems do not move that way. A server finishes jobs at random times, a component fails after a random lifetime, and a molecule jumps when an event occurs. A continuous-time Markov chain keeps the state-based dependence but lets the clock run continuously.</p>" +
                "<p>The generator records instantaneous rates rather than ordinary one-step probabilities. Over a very short interval, a rate multiplied by the interval length behaves like a small transition probability. The diagonal entries are chosen so each row sums to zero, which preserves total probability as the transition matrix evolves over time.</p>",
    definition: "<p>A continuous-time Markov chain uses a generator matrix $Q$ of jump rates, with off-diagonal rates $q_{ij}\\ge0$ and diagonals chosen so rows sum to zero. Its transition matrix satisfies $$P'(t)=P(t)Q.$$</p>" +
                "<p><b>Assumptions that matter:</b> For small $h$, one jump from $i$ to $j$ has probability $q_{ij}h+o(h)$, and $q_{ii}=-\\sum_{j\\ne i}q_{ij}$.</p>",
    symbols: [
      { sym: "$Q$", desc: "the generator" },
      { sym: "$q_{ij}$", desc: "a jump rate" },
      { sym: "$P(t)$", desc: "the time-$t$ transition matrix" },
      { sym: "holding time", desc: "time spent in state $i$, with rate $-q_{ii}$" }
    ],
    derivation: [
      { do: "Set off-diagonal jump rates.", result: "$q_{ij}\\ge0$ for $i\\ne j$", why: "These are instantaneous rates of jumping from $i$ to $j$." },
      { do: "Approximate short-interval jump probability.", result: "$q_{ij}h+o(h)$", why: "Rates become probabilities after multiplying by small time." },
      { do: "Choose the diagonal.", result: "$q_{ii}=-\\sum_{j\\ne i}q_{ij}$", why: "Each row of $Q$ must sum to zero." },
      { do: "Write the small-time matrix update.", result: "$P(t+h)\\approx P(t)(I+hQ)$", why: "A short extra interval applies an identity-plus-rate transition." },
      { do: "Subtract, divide, and take the limit.", result: "$P'(t)=P(t)Q$", why: "Letting $h\\to0$ gives the forward differential equation." }
    ],
    applications: [
      { title: "Failure/repair", background: "With rates up→down $2$ and down→up $1$.", numbers: "$P_{\\text{up,down}}(1)=\\tfrac23(1-e^{-3})=0.6335$" },
      { title: "Holding time", background: "A state with rate $2$.", numbers: "mean holding time $0.5$" },
      { title: "Small interval", background: "Over $h=0.02$.", numbers: "jump probability is about $2h=0.04$" },
      { title: "Stationary availability", background: "The two-state rates above.", numbers: "stationary $(1/3,2/3)$" },
      { title: "Service systems", background: "Total exit rate $7$.", numbers: "mean holding time $1/7=0.1429$" },
      { title: "Matrix exponential", background: "$P(0)=I$.", numbers: "$P(t)=e^{tQ}$ preserves row sums because $Q$ rows sum to $0$" }
    ]
  },
  "math-19-10": {
    connectionsProse: "<p>This lesson specializes continuous-time stochastic processes to the basic model of random arrivals. A Poisson process counts how many events have occurred by time $t$. It keeps the rate constant and treats disjoint time intervals as independent.</p>" +
                     "<p>Poisson processes are building blocks for queues, reliability, traffic modeling, thinning, superposition, and continuous-time Markov chains. They also give the simplest count process whose waiting times are exponential.</p>",
    motivation: "<p>When events are scattered in time at a steady average rate, the exact arrival times are uncertain but the count over an interval has structure. Short intervals usually contain no event, sometimes contain one event, and very rarely contain two or more. Adding many such small intervals gives the count over the whole time span.</p>" +
                "<p>The Poisson distribution appears as the limit of many tiny Bernoulli opportunities. The parameter $\\lambda t$ is the expected number of arrivals in time $t$, and it is also the variance. This equality of mean and variance is a signature of the basic Poisson model.</p>",
    definition: "<p>A Poisson process with rate $\\lambda$ has independent increments and count distribution $$P(N(t)=k)=e^{-\\lambda t}\\frac{(\\lambda t)^k}{k!}.$$</p>" +
                "<p><b>Assumptions that matter:</b> In a small interval, one arrival has probability about $\\lambda\\Delta t$, two or more arrivals are negligible, and disjoint increments are independent.</p>",
    symbols: [
      { sym: "$N(t)$", desc: "the number of arrivals by time $t$" },
      { sym: "$\\lambda$", desc: "the rate per unit time" },
      { sym: "$k$", desc: "the count" },
      { sym: "increments", desc: "counts over disjoint intervals" }
    ],
    derivation: [
      { do: "Split a time interval of length $t$ into many pieces.", result: "pieces of size $\\Delta t$", why: "Small pieces make arrivals nearly Bernoulli." },
      { do: "Use the short-interval approximation.", result: "one arrival has probability about $\\lambda\\Delta t$", why: "Two or more arrivals are negligible in a tiny interval." },
      { do: "Approximate the total count.", result: "$\\mathrm{Binomial}(n,\\lambda t/n)$", why: "There are many nearly Bernoulli trials." },
      { do: "Let $n\\to\\infty$.", result: "$P(N(t)=k)=e^{-\\lambda t}(\\lambda t)^k/k!$", why: "The binomial limit gives the Poisson distribution." },
      { do: "Record the moments and waiting times.", result: "$E[N(t)]=\\operatorname{Var}(N(t))=\\lambda t$ and mean wait $1/\\lambda$", why: "The same limiting argument gives mean, variance, and exponential interarrival times." }
    ],
    applications: [
      { title: "Traffic arrivals", background: "With $\\lambda=3$/hour and $t=2$.", numbers: "$P(N=4)=e^{-6}6^4/4!=0.13385$" },
      { title: "At least one error", background: "With mean $0.5$.", numbers: "$P(N\\ge1)=1-e^{-0.5}=0.39347$" },
      { title: "Capacity planning", background: "Over two hours at rate 3 per hour.", numbers: "mean and variance over two hours are both $6$" },
      { title: "Interarrival time", background: "Rate $3$/hour.", numbers: "mean wait $1/3$ hour, or 20 minutes" },
      { title: "Superposition", background: "Independent Poisson streams with rates $2$ and $3$.", numbers: "combine to rate $5$" },
      { title: "Thinning", background: "Keeping 30% of a rate-10 stream.", numbers: "rate $3$" }
    ]
  },
  "math-19-11": {
    connectionsProse: "<p>This lesson builds on continuous-time Markov chains by focusing on count states. The process can only move from $n$ to $n+1$ or from $n$ to $n-1$, so it models one-at-a-time arrivals and departures. That simple local movement gives a rich class of queue and population models.</p>" +
                     "<p>Birth-death processes connect CTMC rates, detailed balance, stationary distributions, and queueing formulas. They are also a clear example of how local flow equations determine a full long-run distribution.</p>",
    motivation: "<p>Many systems are naturally described by a count: jobs in a queue, active requests, molecules of a type, or members of a population. In a small time interval, the count may go up by one, down by one, or stay where it is. A birth-death process encodes exactly those neighboring moves.</p>" +
                "<p>Because transitions occur only between adjacent states, stationarity can be understood through adjacent flow balance. The mass flowing from $n$ to $n+1$ should match the mass flowing back from $n+1$ to $n$. Repeating that relationship builds the stationary probabilities from $\\pi_0$.</p>",
    definition: "<p>A birth-death process is a CTMC on count states with births $n\\to n+1$ at rate $\\lambda_n$ and deaths $n\\to n-1$ at rate $\\mu_n$. Adjacent stationarity satisfies $$\\pi_n\\lambda_n=\\pi_{n+1}\\mu_{n+1},\\qquad \\pi_{n+1}=\\pi_n\\frac{\\lambda_n}{\\mu_{n+1}}.$$</p>" +
                "<p><b>Assumptions that matter:</b> Transitions occur only to neighboring count states; for constant $\\lambda<\\mu$, normalization gives a geometric stationary distribution.</p>",
    symbols: [
      { sym: "$n$", desc: "the count" },
      { sym: "$\\lambda_n$", desc: "the birth or arrival rate" },
      { sym: "$\\mu_n$", desc: "the death or service rate" },
      { sym: "$\\pi_n$", desc: "stationary probability of count $n$" },
      { sym: "$\\rho=\\lambda/\\mu$", desc: "traffic intensity in M/M/1" }
    ],
    derivation: [
      { do: "Allow neighboring moves only.", result: "$n\\to n+1$ at rate $\\lambda_n$ and $n\\to n-1$ at rate $\\mu_n$", why: "The process changes the count one at a time." },
      { do: "Compute the total exit rate.", result: "$\\lambda_n+\\mu_n$", why: "The mean holding time is $1/(\\lambda_n+\\mu_n)$." },
      { do: "Balance adjacent stationary flows.", result: "$\\pi_n\\lambda_n=\\pi_{n+1}\\mu_{n+1}$", why: "Mass moving up across an edge should match mass moving back down." },
      { do: "Rearrange the balance equation.", result: "$\\pi_{n+1}=\\pi_n\\lambda_n/\\mu_{n+1}$", why: "Repeated substitution builds all masses from $\\pi_0$." },
      { do: "Specialize to constant $\\lambda<\\mu$.", result: "$\\pi_n=(1-\\rho)\\rho^n$ with $\\rho=\\lambda/\\mu$", why: "Normalization of the geometric series sets $\\pi_0=1-\\rho$." }
    ],
    applications: [
      { title: "Server occupancy", background: "With $\\lambda=2$, $\\mu=5$.", numbers: "$\\rho=0.4$ and $\\pi_0=0.6$" },
      { title: "Three jobs", background: "Using the same M/M/1 stationary distribution.", numbers: "$\\pi_3=0.6\\cdot0.4^3=0.0384$" },
      { title: "Mean queue length", background: "For traffic intensity $\\rho=0.4$.", numbers: "$\\rho/(1-\\rho)=0.6667$" },
      { title: "Tail probability", background: "For the same geometric stationary distribution.", numbers: "$P(N\\ge4)=\\rho^4=0.0256$" },
      { title: "Holding time", background: "At $n\\ge1$, total rate $7$.", numbers: "mean $0.1429$" },
      { title: "Flow check", background: "Adjacent flow balance between states 2 and 3.", numbers: "$\\pi_2\\lambda=0.192$ equals $\\pi_3\\mu=0.192$" }
    ]
  },
  "math-19-12": {
    connectionsProse: "<p>This lesson studies a process built by accumulating random increments. It connects discrete-time stochastic processes to sums, expectations, variances, and path probabilities. The position after many steps is the result of all earlier increments.</p>" +
                     "<p>Random walks are a foundation for Brownian motion, martingales, gambler's ruin, diffusion approximations, and graph sampling. They give a concrete way to see how independent noise accumulates over time.</p>",
    motivation: "<p>A random walk starts somewhere and then adds a random step at each time. The individual steps may be simple, but their sum creates a path with growing uncertainty. If the steps are fair, the expected position stays fixed while the spread grows with the number of steps.</p>" +
                "<p>The key calculations use linearity of expectation and independence of increments. Means add, variances add, and endpoint probabilities can be counted by the number of right and left steps. This makes the random walk both intuitive and computationally useful.</p>",
    definition: "<p>A random walk accumulates random increments: $$S_n=S_0+Y_1+\\cdots+Y_n.$$ For independent increments, expectations and variances add across steps.</p>" +
                "<p><b>Assumptions that matter:</b> The variance formula uses independent increments; the simple symmetric walk uses steps with mean $0$ and variance $1$.</p>",
    symbols: [
      { sym: "$S_n$", desc: "position after $n$ steps" },
      { sym: "$Y_k$", desc: "the $k$th increment" },
      { sym: "$p$", desc: "right-step probability" },
      { sym: "variance", desc: "spread of position" }
    ],
    derivation: [
      { do: "Define the position after $n$ steps.", result: "$S_n=S_0+Y_1+\\cdots+Y_n$", why: "Each $Y_k$ is one step added to the starting position." },
      { do: "Take expectation term by term.", result: "$E[S_n]=S_0+\\sum_kE[Y_k]$", why: "Linearity lets each increment contribute its mean." },
      { do: "Add variances under independence.", result: "$\\operatorname{Var}(S_n)=\\sum_k\\operatorname{Var}(Y_k)$", why: "Independent increments have no covariance terms." },
      { do: "Specialize to a simple symmetric walk.", result: "$E[S_n]=S_0$ and $\\operatorname{Var}(S_n)=n$", why: "Each increment has mean $0$ and variance $1$." },
      { do: "Count endpoint paths.", result: "$\\binom{10}{6}/2^{10}=0.205078$", why: "Ending at $2$ after 10 steps from 0 requires 6 right steps and 4 left steps." }
    ],
    applications: [
      { title: "Diffusion scaling", background: "After 10 fair steps.", numbers: "variance is $10$" },
      { title: "Endpoint probability", background: "For a fair walk ending at 2 after 10 steps.", numbers: "$P(S_{10}=2)=0.205078$" },
      { title: "Biased drift", background: "With $p=0.6$.", numbers: "$E[S_{10}]=10(0.6-0.4)=2$" },
      { title: "Gambler's ruin", background: "With $p=0.6$, start $1$, upper boundary $5$.", numbers: "hit-upper probability is $0.3839$" },
      { title: "SGD noise", background: "Independent zero-mean update noise.", numbers: "variance growing like $n\\sigma^2$" },
      { title: "Random-walk graph sampling", background: "On a 4-node regular graph.", numbers: "each neighbor is chosen with probability $1/4=0.25$" }
    ]
  },
  "math-19-13": {
    connectionsProse: "<p>This lesson continues from random walks by taking a continuous-time limit. A random walk has discrete steps, while Brownian motion has continuous paths and Gaussian increments. The same ideas of accumulated independent noise remain in place.</p>" +
                     "<p>Brownian motion is the basic noise process for stochastic calculus, diffusion models, martingales, finance, and continuous-time approximations. It provides the driving process for Itô's lemma and many stochastic differential equations.</p>",
    motivation: "<p>If a random walk takes more and more steps in a fixed time interval, the step sizes must shrink to keep the total variance stable. The $1/\\sqrt n$ scaling does exactly that. Many tiny centered steps then combine into a Gaussian by the central limit theorem.</p>" +
                "<p>Brownian motion keeps the limiting features that matter most: independent increments, mean zero, and variance proportional to elapsed time. Its paths are continuous, but they remain highly irregular. This makes it a useful model for accumulated microscopic randomness.</p>",
    definition: "<p>Brownian motion $W_t$ is a continuous-time process with mean-zero Gaussian increments and variance equal to elapsed time: $$W_t\\sim N(0,t),\\qquad W_t-W_s\\sim N(0,t-s).$$</p>" +
                "<p><b>Assumptions that matter:</b> The random-walk limit uses independent centered steps scaled by $1/\\sqrt n$, and disjoint increments become independent.</p>",
    symbols: [
      { sym: "$W_t$", desc: "Brownian position at time $t$" },
      { sym: "$N(0,t)$", desc: "normal with mean $0$ and variance $t$" },
      { sym: "increments", desc: "differences $W_t-W_s$" }
    ],
    derivation: [
      { do: "Take $n$ independent steps in one unit of time.", result: "step size $1/\\sqrt n$", why: "This scaling keeps variance from exploding or vanishing." },
      { do: "Compute variance over one unit.", result: "$n\\cdot(1/n)=1$", why: "Each step has variance $1/n$." },
      { do: "Extend the scaling to time $t$.", result: "variance $t$", why: "Variance accumulates in proportion to elapsed time." },
      { do: "Apply the central limit theorem.", result: "$W_t\\sim N(0,t)$", why: "Many small centered steps combine into a normal distribution." },
      { do: "Use independent blocks of steps.", result: "$W_t-W_s\\sim N(0,t-s)$", why: "Separate blocks become independent increments." }
    ],
    applications: [
      { title: "Particle diffusion", background: "For Brownian position at time 2.", numbers: "$W_2$ has standard deviation $\\sqrt2=1.4142$" },
      { title: "Barrier probability", background: "At time 1.", numbers: "$P(W_1>1)=0.1587$" },
      { title: "Increment variance", background: "For the increment from 1 to 1.25.", numbers: "$W_{1.25}-W_1$ has variance $0.25$" },
      { title: "Sensor drift", background: "A unit-variance-rate model.", numbers: "95% range about $\\pm1.96$ after one time unit" },
      { title: "SGD approximation", background: "Noise accumulated over $t=0.5$ at rate 1.", numbers: "standard deviation $\\sqrt{0.5}=0.7071$" },
      { title: "Diffusion model noise", background: "Forward Gaussian noise with variance $0.19$.", numbers: "standard deviation $0.4359$" }
    ]
  },
  "math-19-14": {
    connectionsProse: "<p>This lesson moves from random paths over time to random functions over input spaces. Brownian motion is one example of a stochastic process with Gaussian structure, and Gaussian processes generalize that idea. They define uncertainty over function values rather than over a finite parameter vector alone.</p>" +
                     "<p>Gaussian processes connect stochastic processes, multivariate normal conditioning, kernels, Bayesian regression, spatial interpolation, and Bayesian optimization. The kernel is the central object because it determines how values at different inputs co-vary.</p>",
    motivation: "<p>In regression, the unknown object is often a function. A Gaussian process places a probability distribution on that function by saying that every finite set of function values has a joint normal distribution. This lets the model make predictions with uncertainty at new inputs.</p>" +
                "<p>The kernel supplies the covariance between any two inputs. Nearby or similar inputs can be assigned high covariance, while distant inputs can be assigned lower covariance. After observations are made, ordinary multivariate normal conditioning updates the mean and variance of the function at new points.</p>",
    definition: "<p>A Gaussian process is a distribution over functions such that every finite set of values is jointly normal: $$f\\sim GP(m,k),\\qquad (f(x_1),\\ldots,f(x_n))\\sim N(m,K).$$</p>" +
                "<p><b>Assumptions that matter:</b> The kernel matrix has entries $K_{ij}=k(x_i,x_j)$, and noisy observations add variance through $K_y=K+\\sigma^2I$.</p>",
    symbols: [
      { sym: "$f\\sim GP(m,k)$", desc: "a random function" },
      { sym: "$m(x)$", desc: "the mean" },
      { sym: "$k(x,x')$", desc: "covariance" },
      { sym: "$K$", desc: "the kernel matrix" },
      { sym: "$\\sigma^2$", desc: "observation-noise variance" }
    ],
    derivation: [
      { do: "Choose finite inputs.", result: "$(f(x_1),\\ldots,f(x_n))$ is multivariate normal", why: "A GP defines all finite collections of function values by joint normals." },
      { do: "Build the mean vector and covariance matrix.", result: "$K_{ij}=k(x_i,x_j)$", why: "The kernel supplies covariance between inputs." },
      { do: "Add observation noise.", result: "$K_y=K+\\sigma^2I$", why: "Noisy observations have extra variance on the diagonal." },
      { do: "Condition the joint normal.", result: "posterior mean $k_*^TK_y^{-1}y$ and variance $k_{**}-k_*^TK_y^{-1}k_*$", why: "This is the normal conditioning formula." },
      { do: "Substitute the one-observation example.", result: "posterior mean $0.9704$ and variance $0.7057$", why: "$y=2$, $k(0,1)=e^{-1/2}=0.6065$, and noise variance $0.25$." }
    ],
    applications: [
      { title: "Bayesian regression", background: "One observation above predicts at $x=1$.", numbers: "mean $0.9704$" },
      { title: "Uncertainty", background: "For the same posterior prediction.", numbers: "posterior variance there is $0.7057$" },
      { title: "Kernel similarity", background: "Squared-exponential covariance at distance 1.", numbers: "$e^{-1/2}=0.6065$" },
      { title: "Bayesian optimization", background: "Upper confidence with $1.96$ standard deviations.", numbers: "$0.9704+1.96\\sqrt{0.7057}=2.6170$" },
      { title: "Spatial interpolation", background: "Two identical inputs with noise $0.25$.", numbers: "observed variance $1.25$" },
      { title: "Design check", background: "A 3-point GP prior.", numbers: "uses a $3\\times3$ covariance matrix with 9 entries" }
    ]
  },
  "math-19-15": {
    connectionsProse: "<p>This lesson uses stochastic-process language to describe fair evolution over time. Random walks and Brownian motion both provide important examples, but the martingale idea is more general. It is stated in terms of current information and conditional expectation.</p>" +
                     "<p>Martingales support optional stopping, concentration inequalities, stochastic calculus, finance, online learning, and fair-game reasoning. They help separate drift from unpredictable fluctuation.</p>",
    motivation: "<p>A process can move randomly while still being fair in expectation. The fairness is not about every outcome being unchanged; it is about the conditional mean of the future given what is currently known. If the current value is the best prediction of the future value, the process is a martingale.</p>" +
                "<p>The filtration $\\mathcal F_t$ records the information available by time $t$. Requiring the process to be adapted prevents using future information when defining the present value. With that structure in place, zero-mean future increments vanish under conditional expectation, leaving the current value.</p>",
    definition: "<p>A martingale is an adapted integrable process whose best current prediction of a future value is the current value: $$E[M_t\\mid\\mathcal F_s]=M_s\\qquad(s<t).$$</p>" +
                "<p><b>Assumptions that matter:</b> The process is adapted to the filtration and integrable so the conditional expectations exist.</p>",
    symbols: [
      { sym: "$M_t$", desc: "the martingale value" },
      { sym: "$\\mathcal F_t$", desc: "current information" },
      { sym: "adapted", desc: "observable with current information" },
      { sym: "integrable", desc: "expectations exist" }
    ],
    derivation: [
      { do: "Let $\\mathcal F_t$ be the available information.", result: "$\\mathcal F_t$", why: "The filtration records what is known by time $t$." },
      { do: "Require the process to be adapted.", result: "$M_t$ is known from $\\mathcal F_t$", why: "This prevents using future information." },
      { do: "State the martingale condition.", result: "$E[M_t\\mid\\mathcal F_s]=M_s$ for $s<t$", why: "The current value is the best current prediction of the future value." },
      { do: "Use zero-mean increments for a sum process.", result: "$M_n=M_0+\\sum_{k=1}^nY_k$, with $E[Y_k\\mid\\mathcal F_{k-1}]=0$", why: "Conditional expectation removes all future zero-mean increments." },
      { do: "Conclude the martingale property.", result: "$E[M_n\\mid\\mathcal F_s]=M_s$", why: "Only the value already known at time $s$ remains." }
    ],
    applications: [
      { title: "Fair random walk", background: "If $S_2=3$.", numbers: "$E[S_5\\mid\\mathcal F_2]=3$" },
      { title: "Gambler's ruin", background: "Fair walk starting at 2 between 0 and 5.", numbers: "hits 5 with probability $2/5=0.4$" },
      { title: "Asset pricing", background: "A discounted price with current value 100.", numbers: "conditional expected future discounted value 100" },
      { title: "A/B monitoring", background: "A mean-zero score process.", numbers: "expected next increment $0$" },
      { title: "Brownian motion", background: "Conditioning at time 1.", numbers: "$E[W_2\\mid\\mathcal F_1]=W_1$; if $W_1=0.7$, prediction is $0.7$" },
      { title: "Online learning", background: "Cumulative centered losses with current sum $-4$.", numbers: "future conditional expectation $-4$" }
    ]
  },
  "math-19-16": {
    connectionsProse: "<p>This lesson follows Brownian motion and martingales by introducing the chain rule used for Brownian-driven processes. Ordinary calculus is not enough because Brownian increments have variance of order $dt$. Itô's lemma keeps the second-order term that survives in this setting.</p>" +
                     "<p>Itô's lemma is a core tool for stochastic differential equations, option pricing, stochastic control, neural SDEs, and diffusion models. It explains how functions of stochastic processes evolve.</p>",
    motivation: "<p>In ordinary calculus, terms like $(dt)^2$ are too small to matter in a first-order differential. Brownian motion changes the bookkeeping because $(dW_t)^2$ behaves like $dt$ in the Itô rules. A second derivative term therefore contributes to the drift.</p>" +
                "<p>The result is a corrected chain rule. The usual time derivative and first spatial derivative still appear, but the curvature of $f$ also matters through $\\tfrac12\\sigma^2f_{xx}$. This correction is what makes stochastic transformations consistent with Brownian variance.</p>",
    definition: "<p>Itô's lemma is the Brownian-chain-rule correction for $dX_t=\\mu dt+\\sigma dW_t$: $$df=(f_t+\\mu f_x+\\tfrac12\\sigma^2f_{xx})dt+\\sigma f_xdW_t.$$</p>" +
                "<p><b>Assumptions that matter:</b> The derivation uses the Itô multiplication rules $(dt)^2=0$, $dt\\,dW_t=0$, and $(dW_t)^2=dt$.</p>",
    symbols: [
      { sym: "$\\mu$", desc: "drift" },
      { sym: "$\\sigma$", desc: "volatility" },
      { sym: "$W_t$", desc: "Brownian motion" },
      { sym: "$f_t,f_x,f_{xx}$", desc: "partial derivatives" },
      { sym: "$dt$", desc: "deterministic time" },
      { sym: "$dW_t$", desc: "Brownian noise" }
    ],
    derivation: [
      { do: "Write the stochastic differential.", result: "$dX_t=\\mu dt+\\sigma dW_t$", why: "The process has drift and Brownian noise." },
      { do: "Expand $f(t+dt,X_t+dX_t)$ to second order.", result: "$df=f_tdt+f_xdX_t+\\tfrac12f_{xx}(dX_t)^2$ plus smaller terms", why: "Second-order terms can survive with Brownian increments." },
      { do: "Substitute $dX_t$.", result: "$dX_t=\\mu dt+\\sigma dW_t$", why: "This expresses the function change in terms of time and Brownian noise." },
      { do: "Use Itô multiplication rules.", result: "$(dt)^2=0$, $dt\\,dW_t=0$, and $(dW_t)^2=dt$", why: "The Brownian variance term is kept." },
      { do: "Collect drift and noise terms.", result: "$df=(f_t+\\mu f_x+\\tfrac12\\sigma^2f_{xx})dt+\\sigma f_xdW_t$", why: "This is the corrected stochastic chain rule." }
    ],
    applications: [
      { title: "Square transform", background: "For $f(x)=x^2$, $x=3$, $\\mu=0.1$, $\\sigma=0.5$.", numbers: "drift is $2\\mu x+\\sigma^2=0.85$" },
      { title: "Diffusion term", background: "The same example.", numbers: "noise coefficient $2\\sigma x=3$" },
      { title: "Log GBM", background: "With $dS/S=0.08dt+0.2dW$.", numbers: "log drift is $0.08-0.2^2/2=0.06$" },
      { title: "Option pricing", background: "In the transformed option value equation.", numbers: "the $\\tfrac12\\sigma^2S^2V_{SS}$ term is the gamma contribution" },
      { title: "Neural SDEs", background: "Transforming a hidden state.", numbers: "requires the Itô correction, not just $f_xdX$" },
      { title: "Diffusion models", background: "Variance coefficient $\\sigma=0.5$.", numbers: "contributes $0.25/2=0.125$ times $f_{xx}$ to drift" }
    ]
  },
  "math-19-17": {
    connectionsProse: "<p>This lesson uses randomness as a computational tool. Earlier lessons modeled random systems themselves; Monte Carlo uses simulated random samples to estimate quantities such as expectations and probabilities. The key object is an average over independent draws.</p>" +
                     "<p>Monte Carlo methods connect probability, simulation, stochastic optimization, Bayesian computation, risk analysis, and numerical integration. They also prepare for MCMC, where the samples come from a dependent Markov chain.</p>",
    motivation: "<p>Many expectations are hard to compute exactly but easy to approximate by sampling. If $g(X)$ can be evaluated on simulated draws, the sample average is a direct estimate of $E[g(X)]$. The law of large numbers explains why the average stabilizes as the number of samples grows.</p>" +
                "<p>The uncertainty of the estimate is controlled by variance and sample size. Independence makes variances add, so the variance of the average is $\\sigma^2/n$. This gives the standard $1/\\sqrt n$ rate and explains why reducing error substantially often requires many more samples.</p>",
    definition: "<p>Monte Carlo estimates an expectation by averaging simulated values: $$\\hat\\mu_n=\\frac1n\\sum_i g(X_i),\\qquad E[\\hat\\mu_n]=\\mu,\\ \\operatorname{Var}(\\hat\\mu_n)=\\sigma^2/n.$$</p>" +
                "<p><b>Assumptions that matter:</b> The variance formula uses independent samples with common variance $\\sigma^2$ for $g(X)$.</p>",
    symbols: [
      { sym: "$X_i$", desc: "samples" },
      { sym: "$g$", desc: "the measured function" },
      { sym: "$\\mu=E[g(X)]$", desc: "the target expectation" },
      { sym: "$\\hat\\mu_n$", desc: "the estimate" },
      { sym: "$\\sigma$", desc: "the standard deviation of $g(X)$" }
    ],
    derivation: [
      { do: "Draw independent samples and evaluate the function.", result: "$X_1,\\ldots,X_n$ and $g(X_i)$", why: "Monte Carlo turns an expectation into a sample average." },
      { do: "Define the sample average.", result: "$\\hat\\mu_n=\\frac1n\\sum_i g(X_i)$", why: "This is the estimator." },
      { do: "Take expectation.", result: "$E[\\hat\\mu_n]=\\frac1n\\sum_iE[g(X_i)]=\\mu$", why: "The estimator is unbiased." },
      { do: "Use independence for variance.", result: "$\\operatorname{Var}(\\hat\\mu_n)=\\frac1{n^2}\\sum_i\\operatorname{Var}(g(X_i))=\\sigma^2/n$", why: "Independent sample variances add." },
      { do: "Take the square root.", result: "standard error $\\sigma/\\sqrt n$", why: "Four times as many samples only halves error." }
    ],
    applications: [
      { title: "Sample mean", background: "Samples $2,4,6,8$.", numbers: "estimate $5$" },
      { title: "Standard error", background: "With $\\sigma=10$ and $n=100$.", numbers: "SE is $1$" },
      { title: "95% interval", background: "Estimate $5$ with SE $1$.", numbers: "about $(3.04,6.96)$" },
      { title: "Estimating $\\pi$", background: "7854 hits in 10,000 quarter-square samples.", numbers: "$4\\cdot0.7854=3.1416$" },
      { title: "Risk simulation", background: "1% tail in 100,000 runs.", numbers: "about 1000 tail samples" },
      { title: "Stochastic optimization", background: "Mini-batch size 256 compared with 64.", numbers: "half the gradient-noise SE because $\\sqrt{256/64}=2$" }
    ]
  },
  "math-19-18": {
    connectionsProse: "<p>This lesson combines Monte Carlo estimation with Markov-chain stationarity. Ordinary Monte Carlo uses independent samples from the target distribution. MCMC builds a Markov chain whose stationary distribution is the target, then averages values along the chain.</p>" +
                     "<p>The lesson depends on detailed balance, stationary distributions, and Monte Carlo standard-error thinking. It is a central method in Bayesian inference, probabilistic modeling, and sampling from distributions that are hard to normalize directly.</p>",
    motivation: "<p>Direct sampling from a target distribution is often unavailable, especially when the target is known only up to a normalizing constant. MCMC avoids direct sampling by proposing local moves and accepting them in a way that leaves the target distribution stationary. After the chain has moved away from its initial condition, its visited states can be used like approximate target samples.</p>" +
                "<p>Metropolis-Hastings corrects for proposal imbalance through the acceptance probability. Moves toward higher target density are often accepted, while moves toward lower density are accepted with a controlled probability. The detailed-balance calculation shows that this local rule produces the desired equilibrium.</p>",
    definition: "<p>Markov Chain Monte Carlo builds a Markov chain with target stationary distribution $\\pi$ and estimates expectations using chain averages. Metropolis-Hastings accepts a proposal with $$\\alpha(x,y)=\\min\\{1,\\pi(y)q(x\\mid y)/(\\pi(x)q(y\\mid x))\\}.$$</p>" +
                "<p><b>Assumptions that matter:</b> The proposal and acceptance rule should make the chain leave $\\pi$ stationary; burn-in discards early nonstationary draws.</p>",
    symbols: [
      { sym: "$\\pi$", desc: "the target density up to normalization" },
      { sym: "$q$", desc: "the proposal" },
      { sym: "$\\alpha$", desc: "acceptance probability" },
      { sym: "burn-in", desc: "early nonstationary draws that are discarded" }
    ],
    derivation: [
      { do: "Choose a proposal distribution.", result: "$q(y\\mid x)$", why: "It generates candidate moves from current state $x$." },
      { do: "Define the Metropolis-Hastings acceptance probability.", result: "$\\alpha(x,y)=\\min\\{1,\\pi(y)q(x\\mid y)/(\\pi(x)q(y\\mid x))\\}$", why: "This corrects proposal imbalance." },
      { do: "Write accepted forward flow.", result: "$\\pi(x)q(y\\mid x)\\alpha(x,y)=\\min\\{\\pi(x)q(y\\mid x),\\pi(y)q(x\\mid y)\\}$", why: "The acceptance rule caps the larger flow to match the smaller." },
      { do: "Swap $x$ and $y$.", result: "the same minimum expression appears", why: "Forward and reverse accepted flows match." },
      { do: "Apply detailed balance.", result: "$\\pi$ is stationary", why: "Detailed balance implies stationarity, so chain averages estimate $E_\\pi[g(X)]$ after burn-in." }
    ],
    applications: [
      { title: "Symmetric proposal", background: "Target ratio $\\pi(y)/\\pi(x)=0.4$.", numbers: "acceptance $0.4$" },
      { title: "Always accept uphill", background: "Target ratio $1.8$.", numbers: "acceptance $1$" },
      { title: "Bayesian posterior", background: "A 5000-step chain with 1000 burn-in.", numbers: "leaves 4000 averaging draws" },
      { title: "Autocorrelation cost", background: "With lag correlation $0.8$.", numbers: "1000 draws have ESS about $111.1$" },
      { title: "Gibbs sampling", background: "A two-block Gibbs update.", numbers: "acceptance $1$ because it samples exact conditionals" },
      { title: "Diagnostics", background: "Four chains with means $1.0,1.1,0.9,1.0$.", numbers: "between-chain range $0.2$ to investigate" }
    ]
  },
  "math-19-19": {
    connectionsProse: "<p>This lesson extends Markov chains by adding actions and rewards. A Markov chain describes how states move under fixed transition probabilities. A Markov decision process lets an agent choose actions that influence both transitions and rewards.</p>" +
                     "<p>MDPs connect stochastic processes to reinforcement learning, dynamic programming, policy evaluation, and state visitation. Once a policy is fixed, the MDP again induces a Markov chain, so earlier ideas about stationarity and long-run occupancy still apply.</p>",
    motivation: "<p>In many sequential problems, the next state is not only random but also affected by a decision. A policy specifies how actions are chosen from states. The value of a state is then the expected discounted reward obtained by following that policy.</p>" +
                "<p>The Bellman equation comes from splitting the return into the immediate reward and the discounted future return. The Markov property makes the future value depend on the next state rather than on the full previous path. This recursive structure is the basis for policy evaluation and control.</p>",
    definition: "<p>A Markov decision process has states, actions, transition probabilities, rewards, and a discount. For a fixed policy, values satisfy the Bellman equation $$V^\\pi(s)=\\sum_a\\pi(a\\mid s)\\sum_{s'}P(s'\\mid s,a)[R(s,a,s')+\\gamma V^\\pi(s')].$$</p>" +
                "<p><b>Assumptions that matter:</b> The Markov property makes the next-state value depend on $s'$ rather than the full previous path; a fixed policy induces a Markov chain.</p>",
    symbols: [
      { sym: "$s$", desc: "state" },
      { sym: "$a$", desc: "action" },
      { sym: "$P$", desc: "transition probability" },
      { sym: "$R$", desc: "reward" },
      { sym: "$\\gamma$", desc: "discount" },
      { sym: "$\\pi$", desc: "policy" },
      { sym: "$V^\\pi$", desc: "value" }
    ],
    derivation: [
      { do: "Choose an action from a state according to a policy.", result: "$\\pi(a\\mid s)$", why: "The policy describes action probabilities." },
      { do: "Receive reward and transition.", result: "$R(s,a,s')$ and $P(s'\\mid s,a)$", why: "Actions influence both rewards and next states." },
      { do: "Define policy value.", result: "$V^\\pi(s)$", why: "It is expected discounted return from state $s$." },
      { do: "Split the return.", result: "$G=R+\\gamma G'$", why: "Return equals immediate reward plus discounted future return." },
      { do: "Take expectation over actions and next states.", result: "$V^\\pi(s)=\\sum_a\\pi(a\\mid s)\\sum_{s'}P(s'\\mid s,a)[R(s,a,s')+\\gamma V^\\pi(s')]$", why: "The Markov property makes the future value depend on the next state." }
    ],
    applications: [
      { title: "One-state value", background: "Reward $2$ with $\\gamma=0.9$.", numbers: "$V=2/(1-0.9)=20$" },
      { title: "Action value", background: "Reward $1$, then 70% chance of value 10.", numbers: "$Q=1+0.9(0.7\\cdot10)=7.3$" },
      { title: "Policy mixture", background: "Choosing action A with probability $0.6$ and B with $0.4$.", numbers: "averages their Q-values" },
      { title: "Occupancy", background: "A fixed policy inducing stationary $(0.6,0.4)$.", numbers: "visits state 2 about 4000 times in 10,000 steps" },
      { title: "Discount horizon", background: "With $\\gamma=0.9$.", numbers: "effective horizon about $1/(1-\\gamma)=10$ steps" },
      { title: "Exploration", background: "$\\epsilon=0.1$ over 5 actions.", numbers: "selects each non-greedy action with probability $0.025$" }
    ]
  },
  "math-19-20": {
    connectionsProse: "<p>This lesson moves into time-series models where the current value depends on past observed values. An autoregressive model is a stochastic process with explicit linear memory. It uses earlier values as predictors and adds a new shock.</p>" +
                     "<p>AR models connect stochastic processes, regression, stationarity, autocorrelation, forecasting, and impulse response. They are a basic component of ARMA and ARIMA models.</p>",
    motivation: "<p>Many time series have persistence: a high value today tends to be followed by a high value tomorrow, though not exactly. An AR model represents that persistence by feeding lagged values back into the current value. The new shock accounts for the part not explained by the past.</p>" +
                "<p>In AR(1), the coefficient $\\phi$ controls how strongly the past carries forward. When $|\\phi|<1$, the effect of a shock decays geometrically and the process can have a stable long-run mean. This makes the model both interpretable and useful for forecasting.</p>",
    definition: "<p>An AR(1) model predicts the current value from the previous value plus a shock: $$X_t=c+\\phi X_{t-1}+\\varepsilon_t,\\qquad \\mu=\\frac{c}{1-\\phi}\\text{ when }|\\phi|<1.$$</p>" +
                "<p><b>Assumptions that matter:</b> The shock has mean zero, and stationarity for AR(1) requires $|\\phi|<1$.</p>",
    symbols: [
      { sym: "$X_t$", desc: "the series value" },
      { sym: "$c$", desc: "intercept" },
      { sym: "$\\phi$", desc: "autoregressive coefficient" },
      { sym: "$\\varepsilon_t$", desc: "white-noise shock" },
      { sym: "$p$", desc: "the number of lags in AR($p$)" }
    ],
    derivation: [
      { do: "Write the AR(1) model.", result: "$X_t=c+\\phi X_{t-1}+\\varepsilon_t$", why: "The current value depends linearly on the previous value and a new shock." },
      { do: "Take expectations under stationarity.", result: "$\\mu=c+\\phi\\mu$", why: "$E[\\varepsilon_t]=0$ and the mean is constant over time." },
      { do: "Solve for the mean.", result: "$(1-\\phi)\\mu=c$, so $\\mu=c/(1-\\phi)$", why: "This is finite when $|\\phi|<1$." },
      { do: "Subtract the mean.", result: "$X_t-\\mu=\\phi(X_{t-1}-\\mu)+\\varepsilon_t$", why: "This isolates deviations from the long-run level." },
      { do: "Iterate the recursion.", result: "a shock's effect after $h$ steps is $\\phi^h$", why: "The effect decays geometrically only when $|\\phi|<1$." }
    ],
    applications: [
      { title: "Long-run mean", background: "With $c=3$, $\\phi=0.7$.", numbers: "mean is $10$" },
      { title: "One-step forecast", background: "From $X_t=8$.", numbers: "forecast is $3+0.7\\cdot8=8.6$" },
      { title: "Stationary variance", background: "With shock variance $4$.", numbers: "variance is $4/(1-0.7^2)=7.8431$" },
      { title: "Autocorrelation", background: "At lag 3.", numbers: "lag 3 autocorrelation is $0.7^3=0.343$" },
      { title: "Half-life", background: "For coefficient $0.7$.", numbers: "shock half-life is $\\log(0.5)/\\log(0.7)=1.943$ steps" },
      { title: "Impulse response", background: "After 4 steps.", numbers: "a unit shock contributes $0.7^4=0.2401$" }
    ]
  },
  "math-19-21": {
    connectionsProse: "<p>This lesson complements autoregressive models by modeling dependence through recent shocks rather than recent observed values. An MA model still describes a time series, but its memory is finite. Once a shock is older than the chosen lag order, it no longer appears directly.</p>" +
                     "<p>MA models connect white noise, autocovariance, forecasting, finite-memory processes, and ARMA models. They help distinguish persistence caused by carried-forward values from persistence caused by shared recent disturbances.</p>",
    motivation: "<p>In an MA model, the current value is built from current and past innovations. A shock can echo into a few future observations because it appears with lagged coefficients. After those lags pass, the same shock drops out of the formula.</p>" +
                "<p>This finite memory gives a simple covariance pattern. In MA(1), neighboring observations share one shock, so they are correlated. Observations two or more lags apart share no shock, so their autocovariance is zero under the white-noise assumptions.</p>",
    definition: "<p>An MA(1) model builds the current value from current and previous white-noise shocks: $$X_t=\\mu+\\varepsilon_t+\\theta\\varepsilon_{t-1},\\qquad \\operatorname{Var}(X_t)=(1+\\theta^2)\\sigma^2.$$</p>" +
                "<p><b>Assumptions that matter:</b> The shocks are white noise with mean zero and variance $\\sigma^2$, so distinct shocks are uncorrelated.</p>",
    symbols: [
      { sym: "$\\mu$", desc: "mean" },
      { sym: "$\\varepsilon_t$", desc: "white-noise shock" },
      { sym: "$\\theta$", desc: "the MA coefficient" },
      { sym: "$q$", desc: "the number of shock lags" }
    ],
    derivation: [
      { do: "Write the MA(1) model.", result: "$X_t=\\mu+\\varepsilon_t+\\theta\\varepsilon_{t-1}$", why: "The current value uses current and one lagged shock." },
      { do: "Take expectation.", result: "$E[X_t]=\\mu$", why: "Both shocks have mean zero." },
      { do: "Compute variance.", result: "$\\operatorname{Var}(X_t)=\\sigma^2+\\theta^2\\sigma^2=(1+\\theta^2)\\sigma^2$", why: "Independent shocks contribute variances separately." },
      { do: "Compute lag-1 covariance.", result: "$\\theta\\sigma^2$", why: "$X_t$ and $X_{t-1}$ share only $\\varepsilon_{t-1}$, with coefficients $\\theta$ and $1$." },
      { do: "Check longer lags.", result: "autocovariance is zero beyond lag 1", why: "No shock is shared at lag 2 or more." }
    ],
    applications: [
      { title: "Variance", background: "With $\\theta=0.5$, $\\sigma^2=4$.", numbers: "variance is $5$" },
      { title: "Lag-1 covariance", background: "Using the same values.", numbers: "$0.5\\cdot4=2$" },
      { title: "Lag-1 autocorrelation", background: "Covariance divided by variance.", numbers: "$2/5=0.4$" },
      { title: "Shock echo", background: "A shock $\\varepsilon_t=3$.", numbers: "adds $3$ now and $1.5$ next step" },
      { title: "Finite memory", background: "The same shock in MA(1).", numbers: "adds $0$ after two steps" },
      { title: "Forecast adjustment", background: "If the last estimated shock is $3$.", numbers: "the next forecast is $\\mu+0.5\\cdot3=\\mu+1.5$" }
    ]
  },
  "math-19-22": {
    connectionsProse: "<p>This lesson combines the AR and MA ideas into one time-series family. ARMA models carry information through past values and recent shocks. ARIMA adds differencing so the same tools can be used after removing certain kinds of nonstationary behavior.</p>" +
                     "<p>These models connect forecasting, stationarity, impulse response, differencing, and practical time-series workflows. They show how stochastic-process structure can be built from a few interpretable linear pieces.</p>",
    motivation: "<p>AR terms explain persistence through previous observations, while MA terms explain short-run effects of previous shocks. Many series need both kinds of memory. ARMA combines them so a shock can affect the present directly, echo once through the MA term, and then continue through the AR recursion.</p>" +
                "<p>ARIMA adds differencing when the original level of the series is not stable enough to model directly. Differencing replaces levels by changes, such as $X_t-X_{t-1}$. After enough differencing, an ARMA model can be applied to the transformed series.</p>",
    definition: "<p>An ARMA(1,1) combines autoregressive and moving-average terms, while ARIMA applies ARMA after differencing: $$X_t=c+\\phi X_{t-1}+\\varepsilon_t+\\theta\\varepsilon_{t-1},\\qquad \\Delta X_t=X_t-X_{t-1}.$$</p>" +
                "<p><b>Assumptions that matter:</b> Stationary ARMA(1,1) requires the AR part to be stable; ARIMA($p,d,q$) models $\\Delta^dX_t$.</p>",
    symbols: [
      { sym: "$\\phi$", desc: "AR coefficient" },
      { sym: "$\\theta$", desc: "MA coefficient" },
      { sym: "$\\Delta$", desc: "differencing" },
      { sym: "$d$", desc: "the number of differences" },
      { sym: "$\\varepsilon_t$", desc: "white noise" }
    ],
    derivation: [
      { do: "Write ARMA(1,1).", result: "$X_t=c+\\phi X_{t-1}+\\varepsilon_t+\\theta\\varepsilon_{t-1}$", why: "The model combines past values and recent shocks." },
      { do: "Take expectations for stationarity.", result: "$\\mu=c+\\phi\\mu$, so $\\mu=c/(1-\\phi)$", why: "The shock has mean zero and the mean is constant." },
      { do: "Track a unit shock immediately.", result: "coefficient $1$", why: "The current innovation enters directly." },
      { do: "Track it one step later.", result: "coefficient $\\phi+\\theta$", why: "It enters through both AR propagation and the MA term." },
      { do: "Propagate after that.", result: "$\\phi^{h-1}(\\phi+\\theta)$ for $h\\ge1$", why: "The AR part carries the shock forward geometrically." },
      { do: "Define ARIMA differencing.", result: "ARIMA($p,d,q$) applies ARMA to $\\Delta^dX_t$", why: "Differencing can remove certain nonstationary behavior." }
    ],
    applications: [
      { title: "Mean", background: "With $c=2$, $\\phi=0.5$.", numbers: "mean is $4$" },
      { title: "Forecast", background: "With $X_t=5$, last shock $1$.", numbers: "forecast is $2+0.5\\cdot5+0.4\\cdot1=4.9$" },
      { title: "First difference", background: "Series $100,103,102$.", numbers: "differences $3,-1$" },
      { title: "Shock coefficient", background: "With $\\phi=0.5$, $\\theta=0.4$.", numbers: "lag-1 impulse is $0.9$" },
      { title: "Total impulse", background: "For the same ARMA coefficients.", numbers: "sum is $(1+\\theta)/(1-\\phi)=2.8$" },
      { title: "Variance formula", background: "With shock variance 1 in ARMA(1,1).", numbers: "variance is $(1+0.4^2+2\\cdot0.5\\cdot0.4)/(1-0.5^2)=2.08$" }
    ]
  },
  "math-19-23": {
    connectionsProse: "<p>This lesson returns to Markov chains with an important added layer: the states are not directly observed. Instead, each hidden state emits visible data. The model separates the hidden process from the noisy observations generated by it.</p>" +
                     "<p>Hidden Markov models connect Markov chains, conditional independence, dynamic programming, sequence labeling, speech recognition, and fault detection. The forward algorithm and Viterbi recursion are standard examples of probabilistic inference over sequences.</p>",
    motivation: "<p>In many sequence problems, the observed data are clues about an underlying state rather than the state itself. A speech signal gives evidence about phonemes, sensor readings give evidence about faults, and user behavior can give evidence about latent intent. The hidden chain models how the latent state evolves.</p>" +
                "<p>The forward message summarizes all paths that end in each hidden state after seeing the observations so far. It uses total probability to sum over previous states and the emission probability to attach the current observation. Viterbi uses a similar recursion but keeps the best path score instead of the total probability.</p>",
    definition: "<p>A hidden Markov model has a hidden Markov chain and observation emissions. The forward message obeys $$\\alpha_t(j)=B_j(X_t)\\sum_i\\alpha_{t-1}(i)A_{ij}.$$</p>" +
                "<p><b>Assumptions that matter:</b> The hidden state is Markov, and each observation is conditionally independent of the rest given the current hidden state.</p>",
    symbols: [
      { sym: "$Z_t$", desc: "hidden state" },
      { sym: "$X_t$", desc: "observed value" },
      { sym: "$A$", desc: "transition matrix" },
      { sym: "$B_j$", desc: "emission probability" },
      { sym: "$\\alpha_t$", desc: "a forward probability" },
      { sym: "Viterbi", desc: "max path scores" }
    ],
    derivation: [
      { do: "Name hidden and observed variables.", result: "$Z_t$ and $X_t$", why: "$Z_t$ is hidden state and $X_t$ is observation." },
      { do: "Write hidden transitions.", result: "$A_{ij}=P(Z_t=j\\mid Z_{t-1}=i)$", why: "The hidden process is a Markov chain." },
      { do: "Write emissions.", result: "$B_j(x)=P(X_t=x\\mid Z_t=j)$", why: "Each hidden state generates visible data." },
      { do: "Define the forward message.", result: "$\\alpha_t(j)=P(X_1,\\ldots,X_t,Z_t=j)$", why: "It summarizes all paths ending in hidden state $j$." },
      { do: "Split by previous hidden state.", result: "$\\alpha_t(j)=B_j(X_t)\\sum_i\\alpha_{t-1}(i)A_{ij}$", why: "This is total probability plus the Markov and conditional-independence assumptions." },
      { do: "Switch from total probability to best path.", result: "replace the sum by a max", why: "That gives the Viterbi recursion." }
    ],
    applications: [
      { title: "Forward first step", background: "With initial $(0.6,0.4)$ and yes-emissions $(0.9,0.4)$.", numbers: "$\\alpha_1=(0.54,0.16)$ and likelihood $0.70$" },
      { title: "Two-observation likelihood", background: "For yes then no with no-emissions $(0.1,0.6)$.", numbers: "$\\alpha_2=(0.041,0.174)$ and likelihood $0.215$" },
      { title: "State posterior", background: "Given yes,no.", numbers: "$P(Z_2=2\\mid\\text{yes,no})=0.174/0.215=0.8093$" },
      { title: "Viterbi path", background: "Comparing paths $1\\to2$ and $2\\to2$.", numbers: "path $1\\to2$ has score $0.6\\cdot0.9\\cdot0.3\\cdot0.6=0.0972$, larger than $2\\to2$ score $0.0768$" },
      { title: "Speech recognition", background: "A 20-state phoneme HMM.", numbers: "uses a 20-entry forward vector each frame" },
      { title: "Fault detection", background: "If posterior fault probability is $0.8093$.", numbers: "it crosses a 0.8 alert threshold by $0.0093$" }
    ]
  },
  "math-19-24": {
    connectionsProse: "<p>This lesson closes the section by connecting stochastic processes to modern generative modeling. The forward process is a Markov chain that gradually corrupts data with Gaussian noise. The learned reverse process tries to denoise step by step.</p>" +
                     "<p>Diffusion generative models connect Markov processes, Gaussian conditioning, Brownian-style noise intuition, score modeling, and stochastic simulation. They reuse the section's core idea that a complex random object can be understood through a sequence of conditional transitions.</p>",
    motivation: "<p>The forward diffusion process is deliberately simple: each step keeps part of the previous signal and adds fresh Gaussian noise. After many steps, the data become easier to describe because most structure has been washed out. The cumulative coefficient $\\bar\\alpha_t$ tracks how much original signal remains.</p>" +
                "<p>Generation reverses this controlled corruption. A model is trained to predict the noise or score needed to move from a noisier sample toward a cleaner one. The Markov structure matters because each reverse step only needs the current noisy sample and the time step, rather than the whole previous history.</p>",
    definition: "<p>A diffusion generative model uses a Markov forward noising process and a learned reverse denoising process. One forward step and its cumulative form are $$x_t=\\sqrt{\\alpha_t}x_{t-1}+\\sqrt{1-\\alpha_t}\\,\\varepsilon_t,\\qquad x_t=\\sqrt{\\bar\\alpha_t}x_0+\\sqrt{1-\\bar\\alpha_t}\\,\\varepsilon.$$</p>" +
                "<p><b>Assumptions that matter:</b> Each forward step depends only on $x_{t-1}$ and fresh Gaussian noise, with $\\varepsilon_t\\sim N(0,I)$ and $\\bar\\alpha_t=\\prod_s\\alpha_s$.</p>",
    symbols: [
      { sym: "$x_t$", desc: "the noisy sample at step $t$" },
      { sym: "$\\alpha_t$", desc: "signal-retention per step" },
      { sym: "$\\bar\\alpha_t$", desc: "cumulative retention" },
      { sym: "$\\varepsilon_t$", desc: "standard Gaussian noise" },
      { sym: "reverse model", desc: "approximates denoising transitions" }
    ],
    derivation: [
      { do: "Define one forward noising step.", result: "$x_t=\\sqrt{\\alpha_t}x_{t-1}+\\sqrt{1-\\alpha_t}\\,\\varepsilon_t$, with $\\varepsilon_t\\sim N(0,I)$", why: "The step keeps part of the previous signal and adds fresh Gaussian noise." },
      { do: "Interpret the coefficients.", result: "$\\sqrt{\\alpha_t}$ keeps signal and $\\sqrt{1-\\alpha_t}$ adds noise", why: "They split retained signal from injected randomness." },
      { do: "Use the dependence structure.", result: "the forward process is Markov", why: "Each step depends only on $x_{t-1}$ and new noise." },
      { do: "Repeat substitution.", result: "$x_t=\\sqrt{\\bar\\alpha_t}x_0+\\sqrt{1-\\bar\\alpha_t}\\,\\varepsilon$ for $\\bar\\alpha_t=\\prod_s\\alpha_s$", why: "Independent Gaussian noises combine into one Gaussian noise term." },
      { do: "State the training target.", result: "predict the noise or score", why: "That is the information needed to reverse this Gaussian corruption." }
    ],
    applications: [
      { title: "One noising step", background: "With $\\alpha=0.9$, $x=2$, $\\varepsilon=-1$.", numbers: "$x_t=1.5811$" },
      { title: "Cumulative signal", background: "If $\\bar\\alpha=0.81$ and $x_0=2$.", numbers: "retained mean is $1.8$" },
      { title: "Noise variance", background: "The same step.", numbers: "variance $1-0.81=0.19$" },
      { title: "Noise standard deviation", background: "For variance $0.19$.", numbers: "$\\sqrt{0.19}=0.4359$" },
      { title: "SNR", background: "With cumulative retention $0.81$.", numbers: "$\\bar\\alpha/(1-\\bar\\alpha)=0.81/0.19=4.2632$" },
      { title: "Classifier-free guidance", background: "With $\\epsilon_u=0.5$, $\\epsilon_c=0.2$, scale $3$.", numbers: "guided noise is $0.5+3(0.2-0.5)=-0.4$" }
    ]
  }
};
