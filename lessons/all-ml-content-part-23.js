/* All ML — authored content for Part 23: Game Theory & Multi-Agent Systems (23.1–23.8).
   Appends to window.ALLML_CONTENT (merged into lessons by id in all-ml-register.js).
   Every number here was computed and verified before shipping. LaTeX via String.raw;
   emphasis is bold (no prose italics). */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 23.1 Normal-form games & Nash equilibrium ---------------- */
window.ALLML_CONTENT["23.1"] = {
  tagline: "A Nash equilibrium is not a globally best outcome; it is a resting point where no player can gain by moving alone.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/23.1-normal-form-nash.ipynb",
  context: String.raw`
    <p>This lesson gives multi-agent learning its smallest laboratory: a payoff table.</p>
    <ul>
      <li><b>Probability and expectation</b> become mixed strategies: a row player's expected payoff is an average over the column player's action probabilities.</li>
      <li><b>Optimization</b> becomes best response: each player maximizes only their own payoff while holding the other player's strategy fixed.</li>
      <li><b>Fixed points</b> are the mechanism behind equilibrium: each strategy must be optimal against the other, so the response map points back to itself.</li>
    </ul>
    <p>Where it leads: sequential games (23.2) add time, auctions (23.4) design the payoff table, stochastic games (23.6) put the table in a Markov state, and regret minimization (23.8) gives a learning route to equilibrium.</p>`,
  intuition: String.raw`
    <p>The concrete problem is prediction under other decision-makers. In supervised learning, the data does not change its mind because your model improved. In a game, the other players react. A strategy that is brilliant against one opponent can be foolish against another.</p>
    <p>The naive approach is to look for the outcome with the largest total payoff. That is social planning, not strategic stability. Players do not ask whether the outcome is globally efficient; they ask whether a unilateral deviation helps them. Nash equilibrium is the answer to that narrower but more realistic question.</p>
    <p>The design decision people gloss over is the word <b>alone</b>. Equilibrium does not forbid coordinated moves that help everyone. It only says no single player, taking the others as fixed, can improve. That is why the prisoner's dilemma can settle at mutual defection even though mutual cooperation is better for both.</p>`,
  mathematics: String.raw`
    <p>For a two-player normal-form game, let $A\in\mathbb{R}^{m\times n}$ be the row player's payoff matrix and $B\in\mathbb{R}^{m\times n}$ the column player's payoff matrix. A mixed row strategy $p\in\Delta^m$ and mixed column strategy $q\in\Delta^n$ produce expected payoffs $u_R(p,q)=p^\top A q$ and $u_C(p,q)=p^\top B q$.</p>
    <p>A Nash equilibrium $(p^\star,q^\star)$ satisfies $u_R(p^\star,q^\star)\ge u_R(p,q^\star)$ for every row strategy $p$, and $u_C(p^\star,q^\star)\ge u_C(p^\star,q)$ for every column strategy $q$.</p>

    <p><b>Pure best responses.</b> In the prisoner's dilemma, with actions Cooperate $C$ and Defect $D$, use row payoffs $A=\begin{bmatrix}3&0\\5&1\end{bmatrix}$ and column payoffs $B=\begin{bmatrix}3&5\\0&1\end{bmatrix}$:</p>
    <ol class="work">
      <li>If column plays $C$, row compares $3$ with $5$, so row's best response is $D$.</li>
      <li>If column plays $D$, row compares $0$ with $1$, so row's best response is $D$.</li>
      <li>If row plays $C$, column compares $3$ with $5$, so column's best response is $D$.</li>
      <li>If row plays $D$, column compares $0$ with $1$, so column's best response is $D$.</li>
    </ol>
    <p>The only cell where both best-response marks meet is $(D,D)$ with payoffs $(1,1)$. The mechanism is local stability, not collective wisdom: $(C,C)$ gives $(3,3)$, but either player can move alone from $3$ to $5$.</p>

    <p><b>Mixed indifference.</b> For the row payoff matrix $A=\begin{bmatrix}2&0\\0&1\end{bmatrix}$, let $q$ be the probability column plays Left. Row's two action values are:</p>
    <ol class="work">
      <li>Top: $2q+0(1-q)=2q$.</li>
      <li>Bottom: $0q+1(1-q)=1-q$.</li>
      <li>Indifference: $2q=1-q\Rightarrow 3q=1\Rightarrow q=0.333333$.</li>
    </ol>
    <p>At $q=1/3$, both row actions earn $0.666667$. Mixing is not randomness for its own sake; it is the probability that makes the opponent unwilling to switch.</p>

    <p><b>Matching pennies.</b> With $A=\begin{bmatrix}1&-1\\-1&1\end{bmatrix}$ and $B=-A$, no pure cell is stable. At $p=q=(0.5,0.5)$:</p>
    <ol class="work">
      <li>Row Heads payoff: $1(0.5)+(-1)(0.5)=0.000000$.</li>
      <li>Row Tails payoff: $(-1)(0.5)+1(0.5)=0.000000$.</li>
      <li>Expected payoff: $(0.5,0.5)A(0.5,0.5)^\top=0.000000$.</li>
    </ol>
    <p>Both supported actions are tied, so neither player can profit by moving probability mass. That equality of supported action values is the arithmetic signature of a mixed Nash equilibrium.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Calling the best total-payoff cell an equilibrium.</b> Nash checks unilateral deviations through $u_i(s_i',s_{-i})$, not the sum of payoffs.</li>
      <li><b>Forgetting ties.</b> If two actions have the same best-response payoff, both can be in support; dropping one can erase valid equilibria.</li>
      <li><b>Expecting best-response dynamics to converge.</b> In matching pennies, alternating best responses cycle because each update changes the payoff landscape for the next player.</li>
    </ul>`
};

/* ---------------- 23.2 Extensive-form & sequential games ---------------- */
window.ALLML_CONTENT["23.2"] = {
  tagline: "When actions unfold over time, solve the future first: credible plans survive backward induction.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/23.2-sequential-games.ipynb",
  context: String.raw`
    <p>This lesson adds time to the payoff tables of 23.1.</p>
    <ul>
      <li><b>Nash equilibrium (23.1)</b> asks for mutual best responses, but in a tree a strategy must specify what a player would do even at nodes that are not reached.</li>
      <li><b>Dynamic programming</b> supplies the mechanism: solve terminal decisions first, then propagate their values backward.</li>
      <li><b>Conditional probability</b> enters through information sets, where a player may not know which node they occupy and must optimize an expected continuation value.</li>
    </ul>
    <p>Where it leads: mechanism design (23.4) uses game trees to reason about incentives, stochastic games (23.6) repeat this logic over states, and CFR (23.8) learns policies in large imperfect-information trees.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that not all promises are believable. A player may announce a punishment to scare someone away, but when the time comes, carrying out the punishment may hurt the punisher too. Normal-form Nash can record the threat; sequential analysis asks whether it would actually be chosen.</p>
    <p>The mental model is chess-sized but the arithmetic is tiny: stand at the last decision, choose the best action there, replace that subgame by its value, and move one step earlier. This is backward induction.</p>
    <p>The design decision is to require optimality after every possible history, not only along the path we expect. That is subgame perfection. It removes equilibria held together by off-path threats that no rational player would execute.</p>`,
  mathematics: String.raw`
    <p>An extensive-form game is a tree with decision nodes, actions, information sets, and terminal payoffs. A strategy is a complete contingent plan. A subgame-perfect equilibrium is a strategy profile that is a Nash equilibrium in every subgame.</p>

    <p><b>Backward induction in an entry game.</b> The entrant chooses Out or Enter. If Enter, the incumbent chooses Fight or Accommodate. Payoffs are Out $(0,2)$, Fight $(-1,-1)$, and Accommodate $(2,1)$:</p>
    <ol class="work">
      <li>At the incumbent node, compare Fight payoff $-1$ with Accommodate payoff $1$.</li>
      <li>The incumbent chooses Accommodate because $1\gt -1$.</li>
      <li>The entrant therefore compares Out payoff $0$ with Enter-then-Accommodate payoff $2$.</li>
      <li>The entrant chooses Enter because $2\gt 0$.</li>
    </ol>
    <p>The subgame-perfect path is Enter, then Accommodate, yielding $(2,1)$. The announced threat to Fight is removed because its own continuation payoff is worse.</p>

    <p><b>Imperfect information.</b> Suppose player 2 cannot tell whether they are at node $A$ with probability $0.6$ or node $B$ with probability $0.4$. Choosing Left gives payoffs $3$ at $A$ and $0$ at $B$; choosing Right gives $1$ at $A$ and $2$ at $B$:</p>
    <ol class="work">
      <li>Left expected payoff: $0.6\cdot3+0.4\cdot0=1.800000$.</li>
      <li>Right expected payoff: $0.6\cdot1+0.4\cdot2=1.400000$.</li>
      <li>Player 2 chooses Left because $1.8\gt 1.4$.</li>
    </ol>
    <p>An information set forces one action across several possible nodes, so the local decision is not a pointwise maximum; it is a belief-weighted maximum.</p>

    <p><b>Credibility as a probability.</b> If the entrant believes Accommodate happens with probability $p$, the entry value is:</p>
    <ol class="work">
      <li>$V(Enter)=p\cdot2+(1-p)\cdot0=2p$.</li>
      <li>At $p=0.5$, $V(Enter)=1.000000$.</li>
      <li>Entry beats Out whenever $2p\gt 0$, so any positive credible chance of accommodation helps entry.</li>
    </ol>
    <p>The broader lesson is that sequential games price beliefs about future play. A small change in credibility can change the first move.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Treating strategies as only observed actions.</b> In a tree, a strategy must specify off-path choices; subgame perfection checks those choices.</li>
      <li><b>Keeping non-credible threats.</b> If a threat gives the threatening player a lower continuation payoff, backward induction deletes it.</li>
      <li><b>Optimizing separately inside an information set.</b> The player does not know the node, so the correct object is the belief-weighted expected payoff.</li>
    </ul>`
};

/* ---------------- 23.3 Cooperative game theory ---------------- */
window.ALLML_CONTENT["23.3"] = {
  tagline: "When players can form coalitions, the question changes from which action to choose to how value should be divided.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/23.3-cooperative-games.ipynb",
  context: String.raw`
    <p>This lesson changes the unit of analysis from individual deviations to coalitions.</p>
    <ul>
      <li><b>Set functions</b> become the language of value: $v(S)$ assigns a number to every coalition $S$.</li>
      <li><b>Permutations and averages</b> supply the Shapley mechanism: a player's fair share is their average marginal contribution over all arrival orders.</li>
      <li><b>Equilibrium thinking (23.1)</b> returns through the core: no coalition should prefer to split off with the value it can make alone.</li>
    </ul>
    <p>Where it leads: Shapley-style attribution appears in model explanation, data valuation, feature credit, and multi-agent reward sharing; mechanism design (23.4) asks how to make such allocations incentive-compatible.</p>`,
  intuition: String.raw`
    <p>The concrete problem is shared production. Three teams build one model, two data vendors supply one training set, or several agents complete one task. The output has a single value, but credit is joint.</p>
    <p>The naive split is equal division. That is simple, but it ignores substitutability and synergy. A player who adds nothing beyond what every coalition can already do should not receive the same credit as a player who unlocks a large gain.</p>
    <p>The Shapley design decision is to average over <b>arrival orders</b>. Instead of asking for a player's contribution in one arbitrary coalition, imagine the grand coalition forming one player at a time. Credit the player for the value they add when they arrive, then average across all possible orders. This makes fairness a symmetry calculation rather than a bargaining story.</p>`,
  mathematics: String.raw`
    <p>A cooperative game has players $N$ and a characteristic function $v:2^N\to\mathbb{R}$ with $v(\emptyset)=0$. The Shapley value for player $i$ is</p>
    <div class="formula-box">$$\phi_i=\sum_{S\subseteq N\setminus\{i\}}\frac{|S|!(n-|S|-1)!}{n!}\big(v(S\cup\{i\})-v(S)\big).$$</div>
    <p>Here $S$ is the coalition that arrives before $i$, $n=|N|$, and the bracketed term is $i$'s marginal contribution.</p>

    <p><b>A three-player game.</b> Let $v(A)=1$, $v(B)=1$, $v(C)=0$, $v(AB)=4$, $v(AC)=2$, $v(BC)=2$, and $v(ABC)=6$.</p>
    <ol class="work">
      <li>For order $A,B,C$: marginals are $A:1-0=1$, $B:4-1=3$, $C:6-4=2$.</li>
      <li>For order $A,C,B$: marginals are $A:1$, $C:2-1=1$, $B:6-2=4$.</li>
      <li>Averaging all $6$ orders gives $\phi_A=2.500000$, $\phi_B=2.500000$, $\phi_C=1.000000$.</li>
    </ol>
    <p>Players A and B receive equal credit because the game treats them symmetrically; C receives less because it usually adds a smaller marginal gain.</p>

    <p><b>Efficiency and stability.</b> The Shapley allocation exhausts the grand coalition value:</p>
    <ol class="work">
      <li>$2.5+2.5+1.0=6.000000=v(ABC)$.</li>
      <li>Coalition $AB$ receives $2.5+2.5=5.000000$, which is at least $v(AB)=4$.</li>
      <li>Coalition $AC$ receives $2.5+1.0=3.500000$, which is at least $v(AC)=2$.</li>
      <li>Coalition $BC$ receives $2.5+1.0=3.500000$, which is at least $v(BC)=2$.</li>
    </ol>
    <p>Because every coalition receives at least what it can produce alone, this allocation also lies in the core for this example. That is not guaranteed in every game, which is why fairness and coalition stability are related but distinct ideas.</p>

    <p><b>Dummy behavior.</b> In a second game, player $D$ adds exactly $1$ to every coalition. The Shapley calculation gives $\phi_D=1.000000$.</p>
    <ol class="work"><li>Across all $6$ orders, each marginal contribution for $D$ is $v(S\cup\{D\})-v(S)=1$, so the average is $1$.</li></ol>
    <p>The dummy axiom is not decorative. It prevents attribution from rewarding a player for value that would have existed without them.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Using equal splits when marginal contributions differ.</b> Shapley values average $v(S\cup\{i\})-v(S)$, so synergy and redundancy matter.</li>
      <li><b>Confusing Shapley value with the core.</b> Shapley guarantees efficiency, but the core requires every coalition's allocation to exceed $v(S)$.</li>
      <li><b>Forgetting the characteristic function.</b> Cooperative analysis starts with $v(S)$; without a defensible value for each coalition, the allocation is only numerology.</li>
    </ul>`
};

/* ---------------- 23.4 Mechanism design & auctions ---------------- */
window.ALLML_CONTENT["23.4"] = {
  tagline: "Mechanism design writes the rules so that self-interested choices reveal the information the system needs.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/23.4-auctions.ipynb",
  context: String.raw`
    <p>This lesson turns games inside out.</p>
    <ul>
      <li><b>Nash reasoning (23.1)</b> predicts behavior once payoffs are fixed; mechanism design chooses payoffs so the predicted behavior is useful.</li>
      <li><b>Expected utility</b> explains bidding: each bidder compares value minus payment across possible bids and outcomes.</li>
      <li><b>Optimization under constraints</b> appears as allocation design: choose who receives the item while satisfying incentive and payment rules.</li>
    </ul>
    <p>Where it leads: auctions power ads markets, marketplace ranking, data procurement, and multi-agent resource allocation; social choice (23.5) studies the voting version of the same incentive problem.</p>`,
  intuition: String.raw`
    <p>The concrete problem is private information. A seller does not know how much each bidder values an item. Asking bidders directly is naive: if payment depends on the answer, people shade the answer.</p>
    <p>The second-price auction is the cleanest design lesson. The highest bidder wins, but pays the second-highest bid. That one rule separates the bid used to win from the price paid, making truthful bidding weakly optimal.</p>
    <p>The design decision people miss is that the mechanism is not trying to make bidders generous. It is changing the payoff algebra so each bidder's selfish calculation lines up with truthful revelation. Good mechanisms do not require moral behavior; they make the desired behavior individually rational.</p>`,
  mathematics: String.raw`
    <p>In a single-item second-price auction, bidder $i$ has private value $v_i$ and submits bid $b_i$. The winner is $\arg\max_i b_i$ and pays $\max_{j\ne i}b_j$. Utility is $u_i=v_i-\text{price}$ if $i$ wins, and $0$ otherwise.</p>

    <p><b>Allocation and payment.</b> With bids $(10,7,4)$:</p>
    <ol class="work">
      <li>The highest bid is $10$, so bidder A wins.</li>
      <li>The second-highest bid is $7$, so A pays $7$.</li>
      <li>A's utility is $10-7=3$; the others receive $0$.</li>
    </ol>
    <p>The bid determines whether A wins, but once A wins, the payment is set by someone else. That is the truthfulness lever.</p>

    <p><b>Truthful bidding check.</b> Suppose A's value is $10$ and the others bid $7$ and $4$:</p>
    <ol class="work">
      <li>If A bids $6$, A loses and earns $0$.</li>
      <li>If A bids $10$, A wins, pays $7$, and earns $10-7=3$.</li>
      <li>If A bids $13$, A still wins, still pays $7$, and earns $3$.</li>
    </ol>
    <p>Bidding above value does not help in this case, but it can make A win when the price exceeds value; bidding below value can make A lose profitable wins. Truthful bidding is weakly dominant because it wins exactly when winning has nonnegative surplus.</p>

    <p><b>Why first price is different.</b> In a first-price auction with the same opponents, if A bids $8$ they win and earn $10-8=2$; if A bids $10$ they win and earn $0$.</p>
    <ol class="work"><li>Best among integer bids above $7$ is $8$, with utility $2$, while truthful $10$ gives $0$.</li></ol>
    <p>The payment now depends on A's own bid, so the incentive is to shade. The mechanism changed one line and changed the strategic problem.</p>

    <p><b>Reserve prices.</b> With bids $(10,7,4)$, a reserve $r$ sets a minimum acceptable price:</p>
    <ol class="work">
      <li>$r=0$: revenue is the second price $7$.</li>
      <li>$r=8$: only bidder A clears the reserve, so revenue is $8$.</li>
      <li>$r=11$: no bidder clears the reserve, so revenue is $0$.</li>
    </ol>
    <p>A reserve can raise revenue by replacing a low second price, but too high a reserve kills allocation entirely. Mechanism design is always this kind of incentive-constrained tradeoff.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Assuming truthfulness in first-price auctions.</b> Because the winner pays their own bid, utility $v_i-b_i$ creates shading incentives.</li>
      <li><b>Optimizing revenue without allocation risk.</b> A reserve raises price only while at least one bidder clears it; otherwise revenue becomes zero.</li>
      <li><b>Ignoring tie-breaking.</b> If equal bids are possible, the allocation and incentive proof need a specified tie rule.</li>
    </ul>`
};

/* ---------------- 23.5 Social choice & voting ---------------- */
window.ALLML_CONTENT["23.5"] = {
  tagline: "Voting rules are mechanisms: they translate rankings into outcomes, and every translation creates incentives.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/23.5-social-choice-voting.ipynb",
  context: String.raw`
    <p>This lesson studies mechanism design when the inputs are preferences rather than bids.</p>
    <ul>
      <li><b>Rankings and permutations</b> describe each voter's preference order over candidates.</li>
      <li><b>Pairwise comparison</b> reuses best-response logic from games: one alternative beats another if a majority ranks it higher.</li>
      <li><b>Incentive compatibility (23.4)</b> returns as strategy-proofness: voters may benefit from reporting a ranking that is not their true one.</li>
    </ul>
    <p>Where it leads: social choice explains ensemble voting, preference aggregation in RLHF, collective decision systems, and impossibility results that constrain every multi-agent platform.</p>`,
  intuition: String.raw`
    <p>The concrete problem is aggregation. A group has many preference rankings and needs one winner. Counting seems straightforward until different reasonable rules choose different winners from the same ballots.</p>
    <p>The naive approach is plurality: count first-place votes. It is easy to explain, but it throws away lower rankings. Borda uses the full ranking, while Condorcet asks who wins head-to-head. None is simply the rule of common sense; each preserves some information and discards other information.</p>
    <p>The design decision people gloss over is what kind of evidence the rule treats as meaningful. First-place intensity, broad acceptability, and pairwise majority strength are not the same signal. Once a rule privileges one signal, strategic voters learn how to move that signal.</p>`,
  mathematics: String.raw`
    <p>Let $C$ be a candidate set and each voter submit a ranking. A voting rule maps the profile of rankings to a winner. Plurality gives one point to the top-ranked candidate; Borda with three candidates gives $2,1,0$ points down the ranking; pairwise majority compares candidates two at a time.</p>

    <p><b>Plurality versus Borda.</b> For five ballots $(A,B,C)$, $(A,B,C)$, $(B,C,A)$, $(C,B,A)$, $(C,A,B)$:</p>
    <ol class="work">
      <li>Plurality first-place counts: $A=2$, $B=1$, $C=2$, so A and C tie.</li>
      <li>Borda for A: $2+2+0+0+1=5$.</li>
      <li>Borda for B: $1+1+2+1+1=6$.</li>
      <li>Borda for C: $0+0+0+2+2=4$.</li>
    </ol>
    <p>The same voters can produce a plurality tie and a Borda winner because the rules measure different evidence.</p>

    <p><b>Condorcet cycle.</b> With three voters ranking $(A,B,C)$, $(B,C,A)$, and $(C,A,B)$:</p>
    <ol class="work">
      <li>A beats B by $2$ votes to $1$: voters 1 and 3 rank A above B.</li>
      <li>B beats C by $2$ votes to $1$: voters 1 and 2 rank B above C.</li>
      <li>C beats A by $2$ votes to $1$: voters 2 and 3 rank C above A.</li>
    </ol>
    <p>Majority preference is not transitive. The group can prefer A to B, B to C, and C to A, so there may be no Condorcet winner to select.</p>

    <p><b>Agenda dependence and strategy.</b> In that same cycle:</p>
    <ol class="work">
      <li>If A faces B first, A wins, then C beats A, so C wins the agenda.</li>
      <li>If B faces C first, B wins, then A beats B, so A wins the agenda.</li>
      <li>If C faces A first, C wins, then B beats C, so B wins the agenda.</li>
    </ol>
    <p>The agenda is not a clerical detail; it is part of the mechanism. Under plurality, one voter changing a ballot from $(A,B,C)$ to $(B,A,C)$ changes counts from $A=1,B=1,C=1$ to $A=0,B=2,C=1$, changing the winner from A by tie-break to B.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Assuming majority preference is transitive.</b> Pairwise counts can cycle, so a Condorcet winner may not exist.</li>
      <li><b>Comparing rules without naming their information use.</b> Plurality ignores lower ranks; Borda uses them; pairwise majority ignores score intensity.</li>
      <li><b>Forgetting tie-breaking and agenda control.</b> Both can determine the winner, so they are part of the voting rule.</li>
    </ul>`
};

/* ---------------- 23.6 Markov / stochastic games ---------------- */
window.ALLML_CONTENT["23.6"] = {
  tagline: "A stochastic game is a Markov decision process whose transition and reward depend on everyone’s actions.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/23.6-stochastic-games.ipynb",
  context: String.raw`
    <p>This lesson joins reinforcement learning with game theory.</p>
    <ul>
      <li><b>Markov decision processes</b> supply states, transitions, rewards, and discounting; stochastic games replace one action with a joint action.</li>
      <li><b>Nash equilibrium (23.1)</b> is now state-dependent: each state's policy must be a best response given the continuation values.</li>
      <li><b>Dynamic programming</b> supplies Bellman backups, but the backup may contain a small game rather than a single max.</li>
    </ul>
    <p>Where it leads: multi-agent RL, self-play, decentralized control, and communication protocols (23.7) all live in this stateful version of strategic interaction.</p>`,
  intuition: String.raw`
    <p>The concrete problem is repeated interaction in a changing world. Traffic agents, bidding agents, and game-playing agents do not choose once; their joint actions change the state that shapes the next decision.</p>
    <p>The naive move is to train each agent as if the others were part of a stationary environment. That breaks because other agents are learning too. From one agent's view, the transition law itself moves.</p>
    <p>The design decision is to make the state explicit and value future strategic consequences. A good action is not merely the one with the best immediate payoff; it is the joint-action response that leads to valuable future states under everyone’s policies.</p>`,
  mathematics: String.raw`
    <p>A discounted stochastic game has states $s\in S$, players $i$, actions $a_i$, joint action $a=(a_1,\ldots,a_k)$, transition $P(s'\mid s,a)$, reward $r_i(s,a)$, and discount $\gamma\in[0,1)$. For a fixed joint policy, a player's value satisfies</p>
    <div class="formula-box">$$V_i(s)=\mathbb{E}_{a\sim\pi, s'\sim P}\left[r_i(s,a)+\gamma V_i(s')\right].$$</div>

    <p><b>A fixed-policy Bellman backup.</b> Use two states with $r=(1,0)$, transition matrix $P=\begin{bmatrix}0.8&0.2\\0.3&0.7\end{bmatrix}$, and $\gamma=0.9$.</p>
    <ol class="work">
      <li>Starting from $V=(0,0)$, state 0 backup is $1+0.9(0.8\cdot0+0.2\cdot0)=1.000000$.</li>
      <li>State 1 backup is $0+0.9(0.3\cdot0+0.7\cdot0)=0.000000$.</li>
      <li>After value iteration converges, $V(s_0)=6.727000$ and $V(s_1)=4.909000$.</li>
    </ol>
    <p>The large values are not immediate rewards; they are discounted long-run occupancy of the rewarding state.</p>

    <p><b>Strategic coupling inside a state.</b> At one state, let row payoff matrix be $A=\begin{bmatrix}2&0\\0&1\end{bmatrix}$ and suppose the opponent plays Left with probability $0.25$:</p>
    <ol class="work">
      <li>Row action 0 value: $2(0.25)+0(0.75)=0.500000$.</li>
      <li>Row action 1 value: $0(0.25)+1(0.75)=0.750000$.</li>
      <li>The best response is action 1 because $0.75\gt0.50$.</li>
    </ol>
    <p>That local best response is then folded into future values. This is why a stochastic-game backup is harder than an MDP max: the value of an action depends on other agents' policies.</p>

    <p><b>Discounting.</b> Solving $(I-\gamma P)V=r$ gives:</p>
    <ol class="work">
      <li>At $\gamma=0.1$, $V(s_0)=1.087719$.</li>
      <li>At $\gamma=0.9$, $V(s_0)=6.727273$.</li>
      <li>At $\gamma=0.99$, $V(s_0)=60.792079$.</li>
    </ol>
    <p>As agents become more patient, future state control dominates immediate reward. Multi-agent RL instability often begins exactly there: small policy changes alter long-horizon values.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Treating other learners as stationary noise.</b> In a stochastic game, other policies affect both rewards and transitions, so the environment changes as they learn.</li>
      <li><b>Using an MDP max where a stage-game equilibrium is needed.</b> With multiple agents, the backup may require best responses or Nash values, not one agent's maximization.</li>
      <li><b>Ignoring the discount factor.</b> As $\gamma$ approaches $1$, small transition differences can create very large value differences.</li>
    </ul>`
};

/* ---------------- 23.7 Multi-agent coordination & communication ---------------- */
window.ALLML_CONTENT["23.7"] = {
  tagline: "Communication is valuable when it correlates actions around the same equilibrium rather than merely adding information.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/23.7-coordination-communication.ipynb",
  context: String.raw`
    <p>This lesson focuses on games where the main obstacle is not conflict but alignment.</p>
    <ul>
      <li><b>Nash equilibria (23.1)</b> explain why multiple stable outcomes can exist; coordination asks which one agents will reach.</li>
      <li><b>Information and signaling</b> turn private uncertainty into shared beliefs, changing best responses without changing the underlying payoff matrix.</li>
      <li><b>Stochastic games (23.6)</b> use coordination repeatedly across states, where miscoordination today can damage future value.</li>
    </ul>
    <p>Where it leads: emergent communication, decentralized RL, convention formation, and correlated equilibria all build on the simple fact that shared signals can select joint actions.</p>`,
  intuition: String.raw`
    <p>The concrete problem is choosing together. If two agents both choose Stag, both do well; if one chooses Stag and the other chooses Hare, the Stag hunter gets nothing. The issue is not that agents disagree about payoffs. The issue is uncertainty about each other.</p>
    <p>The naive solution is independent randomization. But independent random choices often fail to match. A public message, even a cheap one, can be useful because it correlates actions: both agents condition on the same signal.</p>
    <p>The design decision people miss is that communication is not valuable only when it reveals hidden facts about the world. It can be valuable because it creates common expectations. A signal that says "play Stag" can coordinate behavior even if it carries no external measurement.</p>`,
  mathematics: String.raw`
    <p>In a coordination game with row payoff $A=\begin{bmatrix}4&0\\0&3\end{bmatrix}$, the diagonal entries reward matching. If the opponent chooses Stag with probability $q$, the two expected payoffs are</p>
    <div class="formula-box">$$U(\text{Stag})=4q,\qquad U(\text{Hare})=3(1-q).$$</div>

    <p><b>The belief threshold.</b></p>
    <ol class="work">
      <li>Set $4q=3(1-q)$.</li>
      <li>$4q=3-3q\Rightarrow7q=3\Rightarrow q=0.428571$.</li>
      <li>If $q\gt0.428571$, Stag is the best response; if $q\lt0.428571$, Hare is safer.</li>
    </ol>
    <p>Coordination failures happen near this threshold. Each agent may prefer the high-payoff equilibrium but avoid it unless they believe the other will also choose it.</p>

    <p><b>A public signal.</b> Suppose a public coin recommends Stag half the time and Hare half the time, and both agents follow it:</p>
    <ol class="work">
      <li>Expected payoff $=0.5\cdot4+0.5\cdot3=3.500000$.</li>
      <li>Independent randomization with $p=0.5$ gives $0.25\cdot4+0.25\cdot3=1.750000$.</li>
      <li>The gain from shared correlation is $3.5-1.75=1.750000$.</li>
    </ol>
    <p>The signal did not increase anyone's action set. It increased alignment by making the two random choices depend on the same event.</p>

    <p><b>Noisy messages.</b> If each agent receives the intended message correctly with probability $a$, their actions match with probability</p>
    <ol class="work">
      <li>$P(\text{match})=a^2+(1-a)^2$.</li>
      <li>At $a=0.8$, $P(\text{match})=0.8^2+0.2^2=0.680000$.</li>
      <li>At $a=0.5$, $P(\text{match})=0.25+0.25=0.500000$.</li>
    </ol>
    <p>Communication quality matters through common belief. A message that agents receive differently can become another source of miscoordination.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing each agent independently.</b> In coordination games, the payoff term is joint; independent optima can land off the diagonal.</li>
      <li><b>Equating communication with more data.</b> The key term is correlation of actions, not just information volume.</li>
      <li><b>Ignoring message noise.</b> If agents condition on different received signals, the intended correlated strategy breaks.</li>
    </ul>`
};

/* ---------------- 23.8 Regret minimization & CFR ---------------- */
window.ALLML_CONTENT["23.8"] = {
  tagline: "Regret minimization learns equilibrium behavior by repeatedly asking which action would have done better in hindsight.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/23.8-regret-cfr.ipynb",
  context: String.raw`
    <p>This lesson gives games a learning algorithm.</p>
    <ul>
      <li><b>Nash equilibrium (23.1)</b> is the target in many repeated games; low regret is one route toward equilibrium-like average play.</li>
      <li><b>Online learning</b> supplies the regret comparison: actual cumulative payoff versus the best fixed action in hindsight.</li>
      <li><b>Sequential games (23.2)</b> motivate CFR: in a large imperfect-information tree, minimize regret separately at each information set using counterfactual reach weights.</li>
    </ul>
    <p>Where it leads: CFR is the workhorse behind strong poker agents and many imperfect-information game solvers; multi-agent RL often borrows regret ideas to stabilize self-play.</p>`,
  intuition: String.raw`
    <p>The concrete problem is learning when the opponent adapts. A single best response to yesterday's opponent can be exploited tomorrow. Regret minimization uses a humbler goal: do not be much worse than the best fixed action you could have chosen in hindsight.</p>
    <p>The naive approach is to chase the action that won last round. That overreacts. Regret matching accumulates evidence: actions with positive regret receive probability in proportion to how much they were missed.</p>
    <p>The design decision in CFR is localizing this idea. Instead of treating a whole game-tree strategy as one enormous action, CFR computes regret at each information set, weighted by how often that information set would be reached if the player tried to get there. That makes huge imperfect-information games learnable.</p>`,
  mathematics: String.raw`
    <p>External regret after $T$ rounds is</p>
    <div class="formula-box">$$R_T=\max_a\sum_{t=1}^T u_t(a)-\sum_{t=1}^T u_t(a_t).$$</div>
    <p>Regret matching uses positive cumulative regrets $R^+(a)=\max(R(a),0)$ and chooses $\pi(a)=R^+(a)/\sum_b R^+(b)$ when the denominator is positive.</p>

    <p><b>Regret as a comparison.</b> For four rounds with action payoffs $[1,-1]$, $[-1,1]$, $[1,-1]$, $[-1,1]$ and played actions H,H,T,T:</p>
    <ol class="work">
      <li>Algorithm payoff: $1+(-1)+(-1)+1=0$.</li>
      <li>Fixed H payoff: $1+(-1)+1+(-1)=0$.</li>
      <li>Fixed T payoff: $-1+1+(-1)+1=0$.</li>
      <li>External regret: $\max(0,0)-0=0$.</li>
    </ol>
    <p>Zero regret does not mean every round was good. It means no single fixed action would have done better over the whole sequence.</p>

    <p><b>Regret matching probabilities.</b> If cumulative regrets are $[3,1]$:</p>
    <ol class="work">
      <li>Positive regret sum is $3+1=4$.</li>
      <li>Probability of H is $3/4=0.750000$.</li>
      <li>Probability of T is $1/4=0.250000$.</li>
    </ol>
    <p>The algorithm explores both actions, but it leans toward the action it most wishes it had played more often.</p>

    <p><b>Counterfactual regret.</b> At one information set, suppose reach probability is $0.25$, action values are $(2,-1)$, and the current local strategy is $(0.5,0.5)$:</p>
    <ol class="work">
      <li>Node value is $0.5\cdot2+0.5\cdot(-1)=0.500000$.</li>
      <li>Action A counterfactual regret is $0.25(2-0.5)=0.375000$.</li>
      <li>Action B counterfactual regret is $0.25(-1-0.5)=-0.375000$.</li>
    </ol>
    <p>The reach factor says how much this local mistake matters from the perspective of the whole tree. CFR works because these local regret terms add up to global control.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Using last-round regret instead of cumulative regret.</b> Regret matching probabilities come from accumulated positive regret, not a one-step win/loss reaction.</li>
      <li><b>Forgetting average strategies.</b> In many games, the average policy converges while the current policy may keep cycling.</li>
      <li><b>Dropping counterfactual reach weights.</b> CFR's local regrets must be weighted by the probability of reaching the information set; otherwise rare and common mistakes are mis-scaled.</li>
    </ul>`
};
