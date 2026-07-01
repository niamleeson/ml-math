/* All ML — Part 23 applications (5 each). Loaded after content-part-23.js, before all-ml-register.js. */

/* ---- _apps-part23-A.js ---- */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

(window.ALLML_CONTENT["23.1"] = window.ALLML_CONTENT["23.1"] || {}).applications = [
  { title: "Ads bidding agents", background: "<p>Competing bidding agents often face payoff tables where one advertiser's change changes the other's return. Nash checks whether either agent can improve by changing alone.</p>", numbers: "<p>Using the lesson prisoner's-dilemma table, cooperative bidding $(C,C)$ has total payoff $3+3=6$, while the Nash outcome $(D,D)$ has total payoff $1+1=2$. The lower total is stable because each unilateral move from $C$ to $D$ improves $3$ to $5$.</p>" },
  { title: "Cybersecurity attacker and defender mixing", background: "<p>Attackers and defenders randomize to avoid being predictable. The mixed strategy is chosen by making the opponent indifferent between monitored actions.</p>", numbers: "<p>For the lesson matrix $\begin{bmatrix}2&0\\0&1\end{bmatrix}$, indifference solves $2q=1-q$, so $q=\frac{1}{3}=0.333333$. Each row action then earns $2q=0.666667$.</p>" },
  { title: "Marketplace pricing audits", background: "<p>Seller price changes should be audited as strategic stability, not just as total platform welfare. A high-welfare cell can still invite unilateral undercutting.</p>", numbers: "<p>In the lesson payoff table, $(C,C)$ pays each seller $3$, but if the other seller keeps $C$, moving to $D$ pays $5$. The unilateral gain is $5-3=2$, so the high-total cell is not an equilibrium.</p>" },
  { title: "A/B allocation with reactive competitors", background: "<p>When competitors react to an allocation policy, expected payoff is computed against their strategy distribution rather than against a fixed dataset.</p>", numbers: "<p>For matching pennies with $p=q=(0.5,0.5)$, row's expected payoff is $(0.5,0.5)\begin{bmatrix}1&-1\\-1&1\end{bmatrix}(0.5,0.5)^\top=0$. Both pure actions also have value $0$, so neither side can improve alone.</p>" },
  { title: "Autonomous driving merge policies", background: "<p>Merge policies such as safe and aggressive can be represented as payoff tables. A stable policy pair is one where no car wants to switch while the other keeps its policy.</p>", numbers: "<p>With the lesson-style safe/aggressive comparison, if the other car is safe, aggressive pays $5$ versus safe $3$; if the other car is aggressive, aggressive pays $1$ versus safe $0$. Thus aggressive is the best response in both columns, mirroring the $D$ best response.</p>" }
];

(window.ALLML_CONTENT["23.2"] = window.ALLML_CONTENT["23.2"] || {}).applications = [
  { title: "Market entry deterrence", background: "<p>Entrants often face incumbents who threaten retaliation. Backward induction tests whether the threat would actually be chosen when reached.</p>", numbers: "<p>In the lesson entry tree, the incumbent compares Fight payoff $-1$ with Accommodate payoff $1$. Since $1\gt-1$, Fight is non-credible, so the entrant compares Out $0$ with Enter value $2$ and chooses Enter.</p>" },
  { title: "Negotiation and bargaining", background: "<p>Sequential bargaining values future offers from the end of the tree backward. The current offer is accepted only if its continuation value beats the outside option.</p>", numbers: "<p>Using the illustrative lesson scale, an offer worth $2$ beats outside option $0$ by $2-0=2$. Backward induction therefore replaces that terminal branch by value $2$ before solving the previous move.</p>" },
  { title: "Security screening under imperfect information", background: "<p>Screeners may not know which hidden state they are in. Information-set decisions use one action with belief-weighted payoffs across possible nodes.</p>", numbers: "<p>With beliefs $(0.6,0.4)$, Left has value $0.6\cdot3+0.4\cdot0=1.8$. Right has value $0.6\cdot1+0.4\cdot2=1.4$, so Left wins by $0.4$.</p>" },
  { title: "Product rollout commitments", background: "<p>Launch decisions depend on whether later support is credible. A probability of accommodation changes the entry value before the first action is chosen.</p>", numbers: "<p>The lesson formula is $V(Enter)=2p$. At $p=0.5$, $V(Enter)=2\cdot0.5=1.0$, which is above the zero outside option.</p>" },
  { title: "Sequential ads auctions", background: "<p>Auctions with follow-up eligibility, retries, or tie rules are game trees. Every unreached node still needs a specified continuation policy.</p>", numbers: "<p>If an off-path punishment gives the punisher $-1$ while accommodation gives $1$, backward induction deletes the punishment by the same $1\gt-1$ comparison from the lesson entry game.</p>" }
];

(window.ALLML_CONTENT["23.3"] = window.ALLML_CONTENT["23.3"] || {}).applications = [
  { title: "Model feature attribution", background: "<p>Shapley attribution treats features as players joining a coalition. Each feature receives its average marginal contribution over arrival orders.</p>", numbers: "<p>For the lesson game, averaging all $3!=6$ orders gives $\phi_A=2.5$, $\phi_B=2.5$, and $\phi_C=1.0$. The attributions sum to $2.5+2.5+1.0=6.0$.</p>" },
  { title: "Data valuation", background: "<p>Training-data vendors can be valued by the coalition lift they create. The characteristic function records what every subset can produce.</p>", numbers: "<p>The lesson grand coalition has value $v(ABC)=6$. The Shapley allocation exhausts it exactly because $2.5+2.5+1.0=6$, so the efficiency gap is $0$.</p>" },
  { title: "Multi-team reward sharing", background: "<p>Shared projects need allocations that reflect synergy between teams rather than equal splits. Coalition checks reveal whether groups are underpaid relative to their standalone value.</p>", numbers: "<p>In the lesson allocation, coalition $AB$ receives $\phi_A+\phi_B=2.5+2.5=5.0$. Since $v(AB)=4$, its core surplus is $5.0-4=1.0$.</p>" },
  { title: "Cloud cost allocation", background: "<p>Dummy resources should be charged or credited only for what they add. Shapley handles this by averaging marginal contributions.</p>", numbers: "<p>If resource $D$ adds exactly $1$ to every coalition, then every marginal term is $v(S\cup\{D\})-v(S)=1$. The average is therefore $\phi_D=1.0$.</p>" },
  { title: "Multi-agent task credit", background: "<p>Robotics and agent teams often complete one task jointly. Shapley computes credit from all possible arrival orders or from a sampled approximation when the team is large.</p>", numbers: "<p>For a 4-agent illustrative team, exact Shapley uses $4!=24$ arrival orders. If one agent contributes marginal gains summing to $36$ across those orders, its credit is $36/24=1.5$.</p>" }
];

(window.ALLML_CONTENT["23.4"] = window.ALLML_CONTENT["23.4"] || {}).applications = [
  { title: "Search and display ad auctions", background: "<p>Second-price auctions are a core model for ad allocation because the highest bidder wins but the next bid sets the payment.</p>", numbers: "<p>With lesson bids $(10,7,4)$, bidder A wins because $10$ is highest. A pays the second price $7$ and receives utility $10-7=3$.</p>" },
  { title: "Marketplace procurement", background: "<p>Truthfulness matters when buyers or sellers have private values. A second-price rule makes the winning payment independent of the winner's exact winning bid.</p>", numbers: "<p>With value $10$ and opponent bids $7$ and $4$, bidding $10$ wins and earns $3$. Bidding $13$ still pays $7$ and earns $3$, while bidding $6$ loses and earns $0$.</p>" },
  { title: "First-price programmatic ads", background: "<p>In first-price auctions, the winner pays their own bid. That changes incentives and creates bid shading.</p>", numbers: "<p>With value $10$ and opponents $7$ and $4$, bid $8$ wins and earns $10-8=2$. Truthful bid $10$ wins but earns $10-10=0$, so shading improves utility by $2$.</p>" },
  { title: "Reserve-price design", background: "<p>A reserve price can increase revenue by replacing a low second price, but it can also block all allocation if set too high.</p>", numbers: "<p>For bids $(10,7,4)$, reserve $r=0$ gives revenue $7$, reserve $r=8$ gives revenue $8$, and reserve $r=11$ gives revenue $0$ because no bid clears.</p>" },
  { title: "Cloud resource allocation", background: "<p>Resource auctions need deterministic tie-breaking before incentive claims can be audited. Otherwise equal bids can produce ambiguous winners.</p>", numbers: "<p>In an illustrative 4-bidder auction with bids A=$9$, B=$9$, C=$6$, and D=$4$, lexicographic tie-breaking awards A over B. In a second-price single-item rule, A pays $9$, the next highest bid.</p>" }
];

/* ---- _apps-part23-B.js ---- */
(window.ALLML_CONTENT["23.5"] = window.ALLML_CONTENT["23.5"] || {}).applications = [
  {
    title: "Ensemble model voting",
    background: "<p>Model ensembles often collect ranked outputs from classifiers, rerankers, or judges. Social choice makes the aggregation rule explicit instead of treating voting as a neutral average.</p>",
    numbers: "<p>For five rankings $(A,B,C),(A,B,C),(B,C,A),(C,B,A),(C,A,B)$, plurality gives $A=2$, $B=1$, $C=2$, so A and C tie. Borda uses $2,1,0$ scores and gives $A=5$, $B=6$, $C=4$, so B wins.</p>"
  },
  {
    title: "RLHF preference aggregation",
    background: "<p>Human preference labels for RLHF are often pairwise comparisons. Condorcet analysis shows why majority labels can be cyclic even when every individual ranking is transitive.</p>",
    numbers: "<p>With rankings $(A,B,C)$, $(B,C,A)$, and $(C,A,B)$, A beats B by $2$-$1$, B beats C by $2$-$1$, and C beats A by $2$-$1$. There is no Condorcet winner.</p>"
  },
  {
    title: "Committee decisions",
    background: "<p>Committees frequently vote through agendas: one proposal faces another, and the survivor advances. In a cycle, the agenda is part of the mechanism, not clerical bookkeeping.</p>",
    numbers: "<p>In the lesson cycle, agenda A versus B then winner versus C elects C. Agenda B versus C then winner versus A elects A. Agenda C versus A then winner versus B elects B.</p>"
  },
  {
    title: "Product ranking surveys",
    background: "<p>Product teams often ask users to rank alternatives. Borda counts lower ranks, so it can select a broadly acceptable option that plurality misses.</p>",
    numbers: "<p>On the five-ballot profile, A's Borda score is $2+2+0+0+1=5$, B's score is $1+1+2+1+1=6$, and C's score is $0+0+0+2+2=4$.</p>"
  },
  {
    title: "Strategic voting audits",
    background: "<p>Voting platforms need manipulation audits because users may benefit from reporting a ranking different from their true preference. The audit must name the rule and tie-break.</p>",
    numbers: "<p>Under plurality, changing one ballot from $(A,B,C)$ to $(B,A,C)$ changes counts from $A=1,B=1,C=1$ to $A=0,B=2,C=1$, moving the winner from tie-broken A to B.</p>"
  }
];

(window.ALLML_CONTENT["23.6"] = window.ALLML_CONTENT["23.6"] || {}).applications = [
  {
    title: "Multi-agent traffic control",
    background: "<p>Traffic lights and vehicles form a stochastic game because each joint action changes both immediate reward and the next-state distribution. A fixed joint policy can still be evaluated by Bellman equations.</p>",
    numbers: "<p>With $r=(1,0)$, $P=\begin{bmatrix}0.8&0.2\\0.3&0.7\end{bmatrix}$, $\gamma=0.9$, and $V=(0,0)$, the first backup is $(1,0)$. Solving to convergence gives approximately $(6.727,4.909)$.</p>"
  },
  {
    title: "Self-play game agents",
    background: "<p>Self-play systems repeatedly solve local strategic choices while future values change. A best response must be computed against the opponent policy, not against an empty environment.</p>",
    numbers: "<p>For $A=\begin{bmatrix}2&0\\0&1\end{bmatrix}$ and opponent Left probability $q=0.25$, row action 0 has value $2(0.25)=0.5$ and row action 1 has value $1(0.75)=0.75$, so action 1 is best.</p>"
  },
  {
    title: "Repeated ad bidding",
    background: "<p>Ad bidding agents value future auction states, budgets, and pacing opportunities. The discount factor controls how strongly future state control dominates immediate reward.</p>",
    numbers: "<p>For the lesson chain, $V(s_0)$ is $1.087719$ at $\gamma=0.1$, $6.727273$ at $\gamma=0.9$, and $60.792079$ at $\gamma=0.99$.</p>"
  },
  {
    title: "Decentralized robotics",
    background: "<p>Robot teams use joint actions such as move-left and lift-right. Treating the system as a single-agent MDP max hides coordination failures and opponent or teammate policies.</p>",
    numbers: "<p>In a two-robot, two-action state there are $2\times2=4$ joint actions. A row action value must average over the other robot's two actions, exactly like the lesson's $q=0.25$ best-response calculation.</p>"
  },
  {
    title: "Inventory and market simulations",
    background: "<p>Competing inventory agents affect future demand and stock states. Long-run occupancy explains why values can be much larger than one-step rewards.</p>",
    numbers: "<p>The immediate reward vector is only $(1,0)$, but at $\gamma=0.9$ the converged values are $V(s_0)=6.727000$ and $V(s_1)=4.909000$, reflecting repeated visits to the rewarding state.</p>"
  }
];

(window.ALLML_CONTENT["23.7"] = window.ALLML_CONTENT["23.7"] || {}).applications = [
  {
    title: "Decentralized robot teaming",
    background: "<p>Robot teams need shared conventions for choosing compatible actions. A public signal can coordinate behavior without adding new physical actions.</p>",
    numbers: "<p>In the Stag/Hare game, a public signal followed by both agents gives $0.5\cdot4+0.5\cdot3=3.5$. Independent randomization gives $0.25\cdot4+0.25\cdot3=1.75$.</p>"
  },
  {
    title: "Network protocol conventions",
    background: "<p>Protocols work when agents believe others will use the same standard. The threshold calculation tells when the high-payoff convention becomes a best response.</p>",
    numbers: "<p>Set $4q=3(1-q)$. Then $7q=3$, so $q=3/7=0.428571$. Above this belief, Stag is better; below it, Hare is safer.</p>"
  },
  {
    title: "Human-AI collaboration",
    background: "<p>Communication helps a human and AI system coordinate on the same plan. Its value is correlation, not merely more data in each participant's local view.</p>",
    numbers: "<p>The lesson's correlation gain is $3.5-1.75=1.75$: shared public recommendations double the expected payoff relative to independent $p=0.5$ randomization.</p>"
  },
  {
    title: "Sensor fusion teams",
    background: "<p>Multiple sensors may receive noisy versions of an intended message. Coordination quality depends on whether received messages match across agents.</p>",
    numbers: "<p>For message accuracy $a$, $P(\text{match})=a^2+(1-a)^2$. At $a=0.8$, this is $0.64+0.04=0.68$; at $a=0.5$, it is $0.25+0.25=0.5$.</p>"
  },
  {
    title: "Multi-agent RL conventions",
    background: "<p>Emergent conventions in MARL should be evaluated by joint success. Individual action accuracy can look high while the team still mismatches.</p>",
    numbers: "<p>For an illustrative four-agent binary convention with independent message accuracy $a=0.8$, all agents receiving the intended signal has probability $0.8^4=0.4096$, already much lower than the two-agent match value $0.68$.</p>"
  }
];

(window.ALLML_CONTENT["23.8"] = window.ALLML_CONTENT["23.8"] || {}).applications = [
  {
    title: "Poker-style imperfect-information solvers",
    background: "<p>CFR decomposes a large imperfect-information game into local information-set regret updates. The reach probability scales how much a local mistake matters globally.</p>",
    numbers: "<p>With reach $0.25$, action values $(2,-1)$, and strategy $(0.5,0.5)$, the node value is $0.5$. The reach-weighted regrets are $0.25(2-0.5)=0.375$ and $0.25(-1-0.5)=-0.375$.</p>"
  },
  {
    title: "Online ad allocation",
    background: "<p>Online allocation systems compare the actions they took with the best fixed action in hindsight. Regret is cumulative, not a judgment about one unlucky round.</p>",
    numbers: "<p>For payoffs $[1,-1],[-1,1],[1,-1],[-1,1]$ and played actions H,H,T,T, actual payoff is $1-1-1+1=0$. Fixed H and fixed T also earn $0$, so external regret is $0$.</p>"
  },
  {
    title: "Self-play stabilization",
    background: "<p>In zero-sum self-play, current strategies can cycle even when average strategies approach equilibrium. Reporting averages is therefore part of the algorithm, not a cosmetic summary.</p>",
    numbers: "<p>In an illustrative matching-pennies run, the target average policy is near $(0.5,0.5)$. A current policy may swing toward H or T, but the average is the convergence object.</p>"
  },
  {
    title: "Routing and load balancing",
    background: "<p>Regret matching naturally routes more traffic to actions that look underused in hindsight while preserving exploration when multiple actions have positive regret.</p>",
    numbers: "<p>If cumulative regrets are $[3,1]$, positive regret sum is $4$. The regret-matching probabilities are $3/4=0.75$ and $1/4=0.25$.</p>"
  },
  {
    title: "Adaptive pricing",
    background: "<p>Pricing agents should not chase the last observation. Regret compares a whole sequence of prices with the best fixed price over the same horizon.</p>",
    numbers: "<p>For an illustrative 100-round price game, report $R_T/T$ rather than the last round's win or loss. If cumulative regret were $12$, the average regret would be $12/100=0.12$.</p>"
  }
];

