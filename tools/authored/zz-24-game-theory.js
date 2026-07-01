module.exports = {
  "math-24-01": {
    connectionsProse:
      "<p>This opening lesson gives the basic language used throughout game theory. The reader already knows how to describe a choice made by one decision-maker; a game adds the fact that several decision-makers act in the same situation. Once players, actions, and payoffs are named, later lessons can talk precisely about dominance, best responses, equilibrium, and cooperation. The goal here is not to prove a theorem, but to learn how to turn an interdependent situation into a mathematical object.</p>",
    motivation:
      "<p>A game is a model of interdependent choice. It names the decision-makers, the actions each can take, and the payoff each receives after everyone acts. The important difference from ordinary optimization is that one player's result depends on what the other players do. A route can be fast if few drivers choose it and slow if many choose it; an ad bid can be profitable or wasteful depending on rival bids.</p>" +
      "<p>The payoff table or payoff rule is the bookkeeping device that keeps these dependencies clear. First choose one action for each player. Those choices form an action profile. Then read the payoff attached to that whole profile, keeping the order of the players fixed. This habit lets every later comparison be made from a player's own point of view without losing track of how the outcome was produced.</p>",
    definition:
      "<p>A <b>game</b> is a mathematical model that names the players, each player's action set, and the payoff each player receives for every action profile.</p>" +
      "<p><b>Assumptions that matter:</b> choose one action for each player, form the action profile, read the ordered payoff pair, and compare payoffs from the viewpoint of each player.</p>",
    symbols: [
      { sym: "$N$", desc: "players" },
      { sym: "$A_i$", desc: "player $i$'s action set" },
      { sym: "$a=(a_1,\\dots,a_n)$", desc: "an action profile" },
      { sym: "$u_i(a)$", desc: "player $i$'s payoff" }
    ],
    applications: [
      { title: "Ad placement auction", background: "Two advertisers choose high/low bids.", numbers: "Profile $(H,L)$ gives payoffs $(3,1)$, so advertiser 1 earns $2$ more." },
      { title: "Recommendation ranking", background: "Platform and creator choose promote/not.", numbers: "$(P,C)$ payoff $(5,4)$ has total welfare $9$." },
      { title: "Self-driving merge", background: "Car A yields and car B goes.", numbers: "Payoff $(2,4)$, so B gains $2$ over A." },
      { title: "Adversarial ML", background: "Defender hardens and attacker probes.", numbers: "Payoff $(1,-1)$ in zero-sum form sums to $0$." },
      { title: "Data-sharing", background: "Two firms share data.", numbers: "Payoff $(6,6)$, total value $12$." },
      { title: "Routing", background: "Two drivers choose separate roads.", numbers: "Payoff $(-20,-20)$ minutes; one shared congested road $(-35,-35)$ is $15$ worse per driver." }
    ]
  },
  "math-24-02": {
    connectionsProse:
      "<p>This lesson turns the parts of a game into a compact table. After players, actions, and payoffs are named, the next useful step is to arrange simultaneous choices so every possible outcome can be inspected. Normal form is the format used for many early examples in game theory: prisoner's dilemma, coordination games, matching pennies, and small auction models. It prepares the reader to scan rows and columns for dominance, best responses, and Nash equilibria.</p>",
    motivation:
      "<p>A normal-form game puts simultaneous choices into a table. Rows are one player's actions, columns are the other player's actions, and each cell stores the payoff pair. The table makes the whole strategic situation visible at once, so the reader can compare what happens when one player changes action while the other player's action is held fixed.</p>" +
      "<p>This representation is especially helpful because many strategic questions are local comparisons inside the table. Dominance checks compare entries across a row or column. Best-response checks look for the largest payoff against a fixed opponent action. A normal-form table is therefore not just a display; it is the workspace where equilibrium reasoning begins.</p>",
    definition:
      "<p>A <b>normal-form game</b> represents simultaneous choices by listing each player's actions, taking the Cartesian product of action sets, and filling one payoff vector per cell.</p>" +
      "<p><b>Assumptions that matter:</b> players choose actions simultaneously, the row and column labels are fixed, and each cell stores payoffs in a fixed player order.</p>",
    symbols: [
      { sym: "$R$", desc: "row player" },
      { sym: "$C$", desc: "column player" },
      { sym: "$r\\in A_R$", desc: "row action" },
      { sym: "$c\\in A_C$", desc: "column action" },
      { sym: "$(u_R(r,c),u_C(r,c))$", desc: "payoff cell" }
    ],
    applications: [
      { title: "Prisoner's dilemma table", background: "The cooperation and defection outcomes can be read cell by cell.", numbers: "$(C,C)=(3,3)$ and $(D,D)=(1,1)$, so mutual cooperation adds $4$ total payoff over mutual defection." },
      { title: "Ad auction", background: "A low/high bid table lists every simultaneous bid outcome.", numbers: "The table has $2\\times2=4$ cells to evaluate." },
      { title: "Model release", background: "Ship/delay crossed with approve/block gives a normal-form policy table.", numbers: "There are $4$ policy outcomes." },
      { title: "Routing", background: "Two drivers with two routes each create congestion cells.", numbers: "$(A,B)$ gives travel times $(20,22)$, total $42$." },
      { title: "Security patching", background: "Patch/no-patch by two teams gives risk cells.", numbers: "Both patch reduces expected loss from $10$ to $2$, a gain of $8$." },
      { title: "Two-agent RL matrix game", background: "Two actions per agent create a reward matrix.", numbers: "Average team reward in cells $8,5,5,2$ is $5$." }
    ]
  },
  "math-24-03": {
    connectionsProse:
      "<p>Dominant strategies build directly on the payoff comparisons made in a normal-form table. Instead of trying to predict exactly what another player will do, the player checks whether one action wins against every possible opponent action. This is the cleanest kind of strategic recommendation because it does not depend on beliefs about the opponent. Dominance also prepares the ground for dominated-strategy deletion and for understanding why some equilibria are easy to find.</p>",
    motivation:
      "<p>A dominant strategy is best no matter what the other player does. It lets a player choose without first predicting the opponent. In a payoff table, that means one row or column gives a higher payoff in every relevant comparison for the player who owns it.</p>" +
      "<p>The strength of the idea is also its limitation. A strictly dominant strategy is simple to justify, but many games do not have one. When it exists, the player can choose it using only the payoff table. When it does not, the player must move to weaker tools such as best responses, Nash equilibrium, or mixed strategies.</p>",
    definition:
      "<p>For player $i$, action $a_i^*$ <b>strictly dominates</b> $a_i$ when it gives a higher payoff against every possible choice of the other players: $$u_i(a_i^*,a_{-i})>u_i(a_i,a_{-i})\\quad\\text{for every }a_{-i}.$$</p>" +
      "<p><b>Assumptions that matter:</b> compare payoffs for the same player, hold the opponents' actions fixed in each comparison, and require the inequality in every opponent case.</p>",
    symbols: [
      { sym: "$a_i^*$", desc: "candidate dominant action" },
      { sym: "$a_i$", desc: "alternative action" },
      { sym: "$a_{-i}$", desc: "all other players' actions" },
      { sym: "$u_i$", desc: "payoff to player $i$" }
    ],
    derivation: [
      { do: "Fix one possible opponent action $a_{-i}$", result: "payoffs are comparable in one column", why: "the opponent's choice must be held fixed" },
      { do: "Compare $u_i(a_i^*,a_{-i})$ with $u_i(a_i,a_{-i})$", result: "$u_i(a_i^*,a_{-i})>u_i(a_i,a_{-i})$", why: "the candidate must beat the alternative in that case" },
      { do: "Repeat for every opponent action", result: "one inequality for every $a_{-i}$", why: "dominance must not depend on the opponent's choice" },
      { do: "Check whether every inequality points to $a_i^*$", result: "$a_i^*$ is always better", why: "the candidate wins in all relevant comparisons" },
      { do: "Look for any failing column", result: "if one column fails, the strategy is not strictly dominant", why: "strict dominance requires every comparison to succeed" }
    ],
    applications: [
      { title: "Prisoner's dilemma", background: "Defect beats cooperate under either opponent action.", numbers: "Defect pays $5$ vs $3$ if the other cooperates and $1$ vs $0$ if the other defects, so defect dominates by margins $2$ and $1$." },
      { title: "Spam filtering", background: "Strict filtering is never worse than lenient filtering in the toy table.", numbers: "Strict filter payoff $4$ vs lenient $2$ under attack and $3$ vs $3$ under no attack gives weak dominance with gains $2$ and $0$." },
      { title: "Reserve-price auction", background: "A reserve can be weakly better across demand states.", numbers: "Setting reserve $10$ beats reserve $0$ by $2$ revenue in high demand and ties in low demand, so it weakly dominates in the toy table." },
      { title: "Adversarial training", background: "A robust model is never worse in the two tested states.", numbers: "Robust model payoff $7$ vs standard $5$ under attack and $6$ vs $6$ clean gives weak dominance." },
      { title: "Routing with toll refund", background: "Route A beats route B in both traffic states.", numbers: "Route A travel utility $-20$ vs route B $-25$ under light traffic and $-30$ vs $-40$ under heavy traffic, so A dominates by $5$ and $10$." },
      { title: "Cache policy", background: "Caching the popular item wins in both demand cases.", numbers: "Cache popular item payoff $9$ vs rare item $4$ when demand is popular and $2$ vs $1$ when demand is rare, so popular-item caching dominates." }
    ]
  },
  "math-24-04": {
    connectionsProse:
      "<p>Dominated strategies are the other side of dominant-strategy reasoning. Instead of asking which action is always best, the player asks whether some action is never needed. This lesson uses the same payoff-table comparisons as dominance, but its practical purpose is simplification. Removing choices that rational players would avoid makes later equilibrium analysis smaller and clearer.</p>",
    motivation:
      "<p>A dominated strategy is never worth playing because another strategy does at least as well in every case and better in some case. The player does not need a detailed forecast of the opponent to reject it. If a replacement action is no worse against every opponent action, the tested action has no strategic advantage left.</p>" +
      "<p>This idea is useful because games can have many actions, and not every listed action deserves equal attention. Deleting dominated actions keeps all rational possibilities while removing clutter. The weak version uses weak inequalities in every case and one strict improvement somewhere, so the replacement is at least as safe and sometimes better.</p>",
    definition:
      "<p>Strategy $a_i$ is <b>weakly dominated</b> by $b_i$ if $b_i$ is no worse against every opponent action and better against at least one: $$u_i(b_i,a_{-i})\\ge u_i(a_i,a_{-i})\\quad\\text{for every }a_{-i},$$ with $>$ for at least one $a_{-i}$.</p>" +
      "<p><b>Assumptions that matter:</b> compare two strategies for the same player, hold the opponents' actions fixed, require no losing comparison, and require at least one strict gain.</p>",
    symbols: [
      { sym: "$a_i$", desc: "tested action" },
      { sym: "$b_i$", desc: "dominating action" },
      { sym: "$\\ge$", desc: "weak inequality, meaning no worse" },
      { sym: "$>$", desc: "strict inequality, meaning better somewhere" }
    ],
    derivation: [
      { do: "Choose the strategy to test", result: "$a_i$", why: "dominance is a claim about a particular action" },
      { do: "Choose a candidate replacement", result: "$b_i$", why: "the tested action must be compared with a specific alternative" },
      { do: "Compare the two payoffs in each opponent column", result: "$u_i(b_i,a_{-i})$ versus $u_i(a_i,a_{-i})$", why: "each comparison holds the opponent's action fixed" },
      { do: "Require no column where $a_i$ beats $b_i$", result: "$u_i(b_i,a_{-i})\\ge u_i(a_i,a_{-i})$ in every column", why: "otherwise $a_i$ would still be useful" },
      { do: "Require at least one strict improvement", result: "$u_i(b_i,a_{-i})>u_i(a_i,a_{-i})$ somewhere", why: "the two strategies should not be merely identical" },
      { do: "Mark $a_i$ dominated and remove it", result: "$a_i$ is excluded from rational-choice analysis", why: "$b_i$ is at least as safe and sometimes better" }
    ],
    applications: [
      { title: "Ad bidding", background: "A low bid is beaten in both rival states.", numbers: "Bid $1$ has payoffs $(1,1)$ while bid $2$ has $(2,3)$ across two rival states, so bid $1$ is dominated by margins $1$ and $2$." },
      { title: "Classifier threshold", background: "A stricter threshold is no better and sometimes worse.", numbers: "Threshold $0.9$ gives utility $(4,2)$ and threshold $0.7$ gives $(5,2)$, so $0.9$ is weakly dominated." },
      { title: "Routing", background: "Road C is slower than road A in both states.", numbers: "Road C takes $(30,45)$ minutes while road A takes $(25,40)$, so C is dominated by being $5$ minutes slower in both states." },
      { title: "Security scans", background: "Weekly scans catch at least as much risk as monthly scans.", numbers: "Weekly scans catch $(7,5)$ risks and monthly scans catch $(4,5)$, so monthly is weakly dominated." },
      { title: "Auction mechanism", background: "A lower reserve gives more revenue in both demand cases.", numbers: "Reserve $20$ revenue $(8,1)$ vs reserve $10$ revenue $(9,3)$, so reserve $20$ is dominated." },
      { title: "RL action pruning", background: "Action R weakly beats action L across opponent actions.", numbers: "Action L yields rewards $(0,1,1)$ and action R yields $(1,1,2)$ across opponent actions, so L is weakly dominated with two strict gains." }
    ]
  },
  "math-24-05": {
    connectionsProse:
      "<p>Iterated elimination extends the dominated-strategy test from one comparison to a repeated procedure. After one dominated row or column is removed, the remaining game may reveal new comparisons that were not available before. This lesson links local payoff inequalities to a larger method for simplifying games. It also builds intuition for why reasoning about rationality can proceed in rounds.</p>",
    motivation:
      "<p>Iterated elimination removes dominated strategies, then checks again because the smaller game can reveal new dominated choices. It is a disciplined way to simplify strategic reasoning. Each deletion says that a rational player would not need that action against the currently relevant opponent choices.</p>" +
      "<p>The word &quot;iterated&quot; matters because dominance is evaluated relative to the action sets still under consideration. A strategy that is not dominated in the original game may become dominated after an opponent's unreasonable action is removed. If the process leaves a single action profile, the game has a sharp prediction from dominance alone.</p>",
    definition:
      "<p><b>Iterated elimination</b> repeatedly removes dominated strategies and recomputes dominance in the reduced game until no dominated strategies remain.</p>" +
      "<p><b>Assumptions that matter:</b> start from the full action sets, only delete strategies that satisfy the relevant dominance test, and recompute comparisons after each deletion.</p>",
    symbols: [
      { sym: "$A_i^k$", desc: "player $i$'s remaining action set after round $k$" },
      { sym: "deleted strategies", desc: "strategies that are not best responses to any remaining belief in the strict-dominance case" }
    ],
    derivation: [
      { do: "Start with the full action sets", result: "$A_i^0$", why: "no rational option should be excluded prematurely" },
      { do: "Find a dominated strategy for one player", result: "a row or column passes the inequality test from $24$-$04$", why: "deletion needs a payoff comparison justification" },
      { do: "Remove that strategy and its row or column", result: "a reduced game", why: "the dominated action is not needed for rational-choice analysis" },
      { do: "Recompute dominance in the reduced game", result: "new comparisons among remaining actions", why: "comparisons only need to hold against remaining actions" },
      { do: "Continue until no dominated strategies remain", result: "a dominance-reduced game", why: "the procedure repeats the same rationality screen" },
      { do: "Check whether one action profile remains", result: "the iterated-dominance prediction", why: "a single surviving profile gives a sharp prediction from dominance alone" }
    ],
    applications: [
      { title: "Three-bid auction", background: "Dominated bids can be removed in rounds.", numbers: "Remove bid $0$ dominated by bid $1$ with revenue gains $(1,1,1)$; then bid $3$ becomes dominated by bid $2$ in the reduced game." },
      { title: "Security choices", background: "Patch choices simplify after an unreasonable action is deleted.", numbers: "Remove no-patch because patch beats it by $4$ under attack and ties clean; remaining hardening choice becomes clear." },
      { title: "Routing", background: "A consistently slower road can be removed.", numbers: "Road C is $5$ minutes slower than A in every remaining traffic state, so deleting C leaves a $2$-road game." },
      { title: "Ad allocation", background: "A worse creative can be removed before budget decisions.", numbers: "Creative X has CTR $(1,2)$ and creative Y $(2,3)$ across segments, so X is deleted before budget mixing." },
      { title: "Opponent modeling", background: "An RL agent prunes a losing action before solving the reduced game.", numbers: "An RL agent prunes action L after rewards $(0,1)$ lose to R's $(2,1)$, reducing a $3\\times3$ game to $2\\times3$." },
      { title: "Procurement", background: "A more expensive supplier is dominated in each demand state.", numbers: "Supplier C cost $(12,15)$ is dominated by supplier A cost $(10,13)$, saving $2$ in both demand states." }
    ]
  },
  "math-24-06": {
    connectionsProse:
      "<p>Pure-strategy Nash equilibrium uses the best-response comparisons that have been appearing in payoff tables. Instead of looking for one action that is best against everything, it looks for a cell where each player's chosen action is best against the other player's chosen action. This makes equilibrium a mutual stability condition. It is the main bridge from dominance reasoning to the broader equilibrium ideas used in the rest of the section.</p>",
    motivation:
      "<p>A pure-strategy Nash equilibrium is a cell where every player is already choosing a best response. No one can improve by changing only their own action. The word &quot;pure&quot; means that each player chooses a single action rather than a probability distribution over actions.</p>" +
      "<p>The key comparison is unilateral. To test a cell, hold the other player's action fixed and ask whether the current player can improve by switching. Then do the same for the other player. A cell is stable only when all players pass this test at the same time.</p>",
    definition:
      "<p>A <b>pure-strategy Nash equilibrium</b> is an action profile where each player's chosen action is a best response to the others' chosen actions: $$r\\in\\operatorname{BR}_R(c)\\quad\\text{and}\\quad c\\in\\operatorname{BR}_C(r).$$</p>" +
      "<p><b>Assumptions that matter:</b> each player chooses one action, deviations are unilateral, and a cell fails if any player can switch and get a larger payoff.</p>",
    symbols: [
      { sym: "$\\operatorname{BR}_R(c)$", desc: "row's best response to $c$" },
      { sym: "$\\operatorname{BR}_C(r)$", desc: "column's best response to $r$" },
      { sym: "pure strategy", desc: "one action, not a probability distribution" }
    ],
    derivation: [
      { do: "Fix column player's action $c$", result: "one column of row payoffs", why: "row's possible unilateral switches keep column fixed" },
      { do: "Mark the row action $r$ with the largest $u_R(r,c)$", result: "$r\\in\\operatorname{BR}_R(c)$", why: "row is best-responding in that column" },
      { do: "Fix row player's action $r$", result: "one row of column payoffs", why: "column's possible unilateral switches keep row fixed" },
      { do: "Mark the column action $c$ with the largest $u_C(r,c)$", result: "$c\\in\\operatorname{BR}_C(r)$", why: "column is best-responding in that row" },
      { do: "Look for both marks in the same cell", result: "$(r,c)$ is Nash exactly when both marks appear", why: "both players are choosing best responses at once" },
      { do: "Check possible switches", result: "if a player can switch and get a larger payoff, the cell is not Nash", why: "Nash stability rules out profitable unilateral deviations" }
    ],
    applications: [
      { title: "Coordination game", background: "Matching actions are stable in the diagonal cells.", numbers: "$(A,A)$ pays $(2,2)$ and $(B,B)$ pays $(1,1)$; both diagonal cells are Nash because each action matches the other." },
      { title: "Prisoner's dilemma", background: "Mutual defection is stable under unilateral checks.", numbers: "$(D,D)$ is Nash since switching to cooperate changes row payoff $1\\to0$ and column payoff $1\\to0$." },
      { title: "Ad channel choice", background: "Both advertisers choosing search is stable in the toy table.", numbers: "Both choose search gives $(4,4)$ and either switching alone gives $2$, so search/search is Nash." },
      { title: "Routing equilibrium", background: "No driver improves by moving alone.", numbers: "Route A/A takes $30$ minutes each; a unilateral switch to B takes $35$, so A/A is stable by $5$ minutes." },
      { title: "Security patching", background: "Both patching is stable against one-team deviations.", numbers: "Both patch payoff $(3,3)$; unilateral no-patch payoff $1$, so no player gains." },
      { title: "Two-agent RL evaluation", background: "A tested policy pair can be stable under available alternatives.", numbers: "Policy pair $(\\pi_1,\\pi_2)$ with rewards $(10,9)$ and unilateral alternatives $(8,7)$ and $(6,5)$ is a pure Nash under the tested policy set." }
    ]
  },
  "math-24-07": {
    connectionsProse:
      "<p>Mixed strategies extend the strategy language from choosing one action to choosing probabilities over actions. This is a natural next step after pure Nash equilibrium because some games do not have a stable pure cell. The reader already knows expected value as a weighted average, and that is the main calculation needed here. Mixed strategies prepare for mixed Nash equilibrium, minimax games, and randomized policies in machine learning systems.</p>",
    motivation:
      "<p>A mixed strategy assigns probabilities to actions. Expected payoff is the weighted average of the payoffs from those actions. If a player chooses top with probability $p$ and bottom with probability $1-p$, then each possible payoff is counted in proportion to how often that action is used.</p>" +
      "<p>Randomization can represent deliberate unpredictability, exploration, or population frequencies. The mathematics is the same in each case: multiply each cell payoff by the probability that the corresponding action profile occurs, then add the contributions. Once payoffs are written as expectations, equilibrium conditions can be solved with equations rather than only by scanning table cells.</p>",
    definition:
      "<p>A <b>mixed strategy</b> assigns probabilities to pure actions, and expected payoff is the probability-weighted sum of cell payoffs: $$\\mathbb E[u_R]=\\sum_r\\sum_c p_R(r)p_C(c)u_R(r,c).$$</p>" +
      "<p><b>Assumptions that matter:</b> probabilities over a player's actions sum to $1$, action profiles occur with product probabilities when players randomize independently, and payoffs are averaged by those probabilities.</p>",
    symbols: [
      { sym: "$p_R(r)$", desc: "probability row uses action $r$" },
      { sym: "$p_C(c)$", desc: "probability column uses action $c$" },
      { sym: "$\\mathbb E[u_R]$", desc: "row's expected payoff" }
    ],
    derivation: [
      { do: "Let row play top with probability $p$ and bottom with probability $1-p$", result: "$p+(1-p)=1$", why: "probabilities across two actions must sum to $1$" },
      { do: "Against a fixed column action, multiply each row payoff by the probability of the row action that produces it", result: "weighted row payoffs", why: "each payoff counts in proportion to how often its action is used" },
      { do: "Add the weighted payoffs", result: "expected payoff", why: "expectation is a weighted average" },
      { do: "Against a mixed column player, multiply each cell payoff by the probability of that action profile", result: "$p_R(r)p_C(c)u_R(r,c)$", why: "the cell occurs when both players choose those actions" },
      { do: "Sum all cell contributions", result: "$\\mathbb E[u_R]=\\sum_r\\sum_c p_R(r)p_C(c)u_R(r,c)$", why: "the total expectation adds every possible cell contribution" }
    ],
    applications: [
      { title: "Matching pennies", background: "Equilibrium randomization balances wins and losses.", numbers: "Row heads probability $0.5$ against column heads $0.5$ gives expected payoff $0.25-0.25-0.25+0.25=0$." },
      { title: "Ad creative rotation", background: "Expected payoff averages creative outcomes by serving probability.", numbers: "Creative A payoff $6$ with probability $0.7$ and creative B payoff $2$ with probability $0.3$ gives expected payoff $4.8$." },
      { title: "Security scanning", background: "A randomized scan policy has an average detection payoff.", numbers: "Scan deep with probability $0.2$ payoff $10$ and light with $0.8$ payoff $4$ gives expected payoff $5.2$." },
      { title: "Exploration in RL", background: "Randomized actions give an expected reward.", numbers: "Action rewards $8$ and $2$ with probabilities $0.25$ and $0.75$ give expected reward $3.5$." },
      { title: "Auction bid randomization", background: "A bidder can average high- and low-bid outcomes.", numbers: "Bid high payoff $3$ with probability $0.4$ and low payoff $1$ with $0.6$ gives $1.8$." },
      { title: "Recommendation diversification", background: "Serving probabilities convert item values into an average payoff.", numbers: "Show niche item with probability $0.3$ payoff $5$ and popular item with $0.7$ payoff $3$ gives $3.6$." }
    ]
  },
  "math-24-08": {
    connectionsProse:
      "<p>This lesson builds on mixed strategies and Nash equilibrium. A mixed strategy lets a player randomize among actions, while Nash equilibrium says that no player wants to change after seeing the others' strategies. A mixed-strategy Nash equilibrium combines those ideas: each player chooses probabilities, and those probabilities make the other player willing to randomize as well. This is the first place where equilibrium is found by solving for probabilities instead of checking a finite list of action pairs. That matters in games with no stable pure action, such as matching pennies, penalty kicks, bidding, and adversarial learning. The same calculation later appears in minimax games, GAN intuition, and multi-agent systems in which predictable behavior can be exploited.</p>",
    motivation:
      "<p>In a pure-strategy equilibrium, each player chooses one action and stays there because switching would not help. Some games have no such stable action pair. In matching pennies, if both players choose heads, the matching player wins and the mismatching player wants to switch. If they mismatch, the matching player wants to switch. Every pure outcome gives someone a reason to move.</p>" +
      "<p>Randomization can make the game stable. The key is not that randomness hides the player's action after it is chosen; the key is that the probabilities make the opponent indifferent. If the column player chooses heads with probability $q$, the row player's expected payoff from heads is $2q-1$, and the expected payoff from tails is $1-2q$. The row player is willing to mix only when these are equal. Solving that equality gives $q=1/2$. By symmetry, the row player also uses heads with probability $p=1/2$.</p>" +
      "<p>The indifference principle is the central habit. To find a mixed equilibrium, make each player indifferent among the actions that receive positive probability, then solve the resulting equations. Actions outside the support must not do better, or the proposed mix is not an equilibrium.</p>",
    definition:
      "<p>A <b>mixed-strategy Nash equilibrium</b> is a Nash equilibrium where strategies may be probability distributions over actions: $$\\text{for every player }i,\\quad s_i\\in\\operatorname{BR}(s_{-i}).$$</p>" +
      "<p><b>Assumptions that matter:</b> players may randomize, each action in the support must be payoff-tied as a best response, and actions outside the support must not do better.</p>",
    symbols: [
      { sym: "$s_i$", desc: "player $i$'s strategy, possibly mixed" },
      { sym: "$s_{-i}$", desc: "the profile of other players' strategies" },
      { sym: "$\\operatorname{BR}$", desc: "the best-response set" },
      { sym: "$p$", desc: "probability row plays heads" },
      { sym: "$q$", desc: "probability column plays heads" },
      { sym: "$1$", desc: "row wins one unit" },
      { sym: "$-1$", desc: "row loses one unit" },
      { sym: "support", desc: "the set of actions played with positive probability" }
    ],
    derivation: [
      { do: "Let $q$ be the probability that column plays heads", result: "$q$", why: "this is the one number row needs to compute expected payoffs" },
      { do: "Compute row's payoff from heads", result: "$q(1)+(1-q)(-1)=2q-1$", why: "heads wins against heads and loses against tails" },
      { do: "Compute row's payoff from tails", result: "$q(-1)+(1-q)(1)=1-2q$", why: "tails loses against heads and wins against tails" },
      { do: "Set the two row payoffs equal", result: "$2q-1=1-2q$", why: "row mixes only when both pure actions are tied" },
      { do: "Add $2q$ to both sides", result: "$4q-1=1$", why: "this moves toward isolating $q$" },
      { do: "Add $1$ to both sides", result: "$4q=2$", why: "the coefficient on $q$ is alone" },
      { do: "Divide by $4$", result: "$q=1/2$", why: "this solves column's equilibrium heads probability" },
      { do: "Let $p$ be the probability row plays heads", result: "$p=1/2$", why: "the same indifference calculation applies for column" },
      { do: "Compute the game value to row", result: "$0.5(1)+0.5(-1)=0$", why: "either pure action against the equilibrium mix has expected payoff $0$" }
    ],
    applications: [
      { title: "Matching pennies baseline", background: "The equilibrium mix balances both players' actions.", numbers: "The equilibrium mix is $p=q=1/2$, and row's value is $0$; a test simulation with a long-run heads rate near $0.5$ should produce average payoff near $0$." },
      { title: "Penalty kicks", background: "The goalie can make the kicker indifferent between directions.", numbers: "If shooting left scores with probability $0.8$ when the goalie dives right and $0.2$ when the goalie dives left, the kicker can be made indifferent only by the goalie's dive probabilities; equalized expected scoring at $0.5$ is the target in the symmetric case." },
      { title: "Adversarial example choice", background: "A mixed defense prevents one attack type from being predictably best.", numbers: "If an attacker alternates two perturbation types and the defender is indifferent at $q=1/2$, a deterministic defense can be exploited while the mixed defense gives each attack expected success $0.5$." },
      { title: "A/B auction bidding", background: "A bidder can randomize when low and high bids are tied.", numbers: "In a two-bid toy game, a bidder who is indifferent between low and high bids at rival high-bid probability $q=1/2$ should randomize instead of choosing a predictable bid." },
      { title: "Multi-agent RL self-play", background: "A mixed policy can remove a one-action exploit.", numbers: "A policy that plays rock and paper each with probability $0.5$ in a two-action subgame gives the opponent equal value $0$ from its two counter-actions, preventing a one-action exploit." },
      { title: "GAN discriminator pressure", background: "The generator tries to make discriminator labels equally attractive.", numbers: "A generator that makes the discriminator's two labels equally attractive corresponds to the same indifference idea; at the ideal GAN equilibrium $D^*(x)=1/2$, the discriminator has no better label rule at that point." }
    ]
  },
  "math-24-09": {
    connectionsProse:
      "<p>This lesson follows mixed strategies and mixed-strategy Nash equilibrium. After seeing that some games need randomization to become stable, the natural structural fact is that finite games always have at least one equilibrium once mixed strategies are allowed. The lesson does not prove the fixed-point theorem behind the result, but it explains the path from finite action sets to a stable probability profile. This guarantee supports the rest of the section, especially minimax games and multi-agent learning.</p>",
    motivation:
      "<p>Finite games may lack pure equilibria, but allowing mixed strategies guarantees at least one Nash equilibrium. The guarantee says a stable probability profile exists, not that it is easy to find or unique. Matching pennies is the simplest warning: no pure cell is stable, yet the mixed profile with each player randomizing evenly is stable.</p>" +
      "<p>The reason the theorem becomes possible is that probability spaces are smoother than finite action lists. A player can move continuously from one mixture to another, and expected payoffs change continuously with those probabilities. The fixed-point result says that, under the right conditions, the best-response mapping must contain a profile that points back to itself. That self-consistent profile is a Nash equilibrium.</p>",
    definition:
      "<p><b>Nash's existence theorem</b> says that every finite game has at least one Nash equilibrium when mixed strategies are allowed.</p>" +
      "<p><b>Assumptions that matter:</b> action sets are finite, mixed-strategy spaces are simplexes, expected payoffs are continuous, best-response correspondences have the right convexity properties, and a fixed point is a Nash equilibrium.</p>",
    symbols: [
      { sym: "$\\Delta(A_i)$", desc: "the simplex of probability distributions over player $i$'s finite actions" },
      { sym: "fixed point", desc: "a strategy profile that maps back to itself under best response" }
    ],
    applications: [
      { title: "Matching pennies", background: "A mixed equilibrium exists even though no pure cell is stable.", numbers: "No pure cell is stable, but the theorem guarantees the mixed equilibrium $(0.5,0.5)$." },
      { title: "Rock-paper-scissors", background: "The symmetric mixed strategy is stable.", numbers: "The equilibrium $(1/3,1/3,1/3)$ has value $0$." },
      { title: "Adversarial testing", background: "A finite attack-defense table has a mixed equilibrium.", numbers: "Two attack types and two defenses define a finite game, so at least one mixed defense equilibrium exists." },
      { title: "Auction bidding grid", background: "A finite bid grid has at least one equilibrium distribution.", numbers: "A $5$-bid finite game has a mixed equilibrium over at most $5$ bids per bidder." },
      { title: "MARL benchmark", background: "A finite matrix game has at least one mixed Nash policy pair.", numbers: "A $3\\times3$ matrix game has at least one mixed Nash policy pair." },
      { title: "Mechanism design toy model", background: "Finite report choices guarantee equilibrium existence, not truthfulness.", numbers: "If each agent has $4$ reports, existence guarantees at least one equilibrium report distribution, though not truthfulness." }
    ]
  },
  "math-24-10": {
    connectionsProse:
      "<p>Zero-sum games specialize the payoff language to direct conflict. The reader has already seen payoff pairs and mixed expected payoffs; here those payoffs are linked by a simple rule: one player's payoff is the negative of the other's. This makes the game easier to analyze with a single matrix. It also sets up the minimax theorem, robust optimization, adversarial training, and the GAN capstone.</p>",
    motivation:
      "<p>In a zero-sum game, one player's gain is the other player's loss. This makes the game a direct contest over a single payoff matrix. If the row player receives $A_{rc}$ in a cell, the column player receives $-A_{rc}$, so the two payoffs always sum to zero.</p>" +
      "<p>The single-matrix view is powerful because both players are optimizing the same quantity in opposite directions. Row wants the expected value $p^TAq$ to be large, while column wants it to be small. That shared objective with opposite signs is what makes maximin, minimax, and saddle-point language fit so naturally.</p>",
    definition:
      "<p>A <b>zero-sum game</b> is a game where the players' payoffs sum to zero in every outcome, so column's payoff is the negative of row's payoff: $$u_C(r,c)=-A_{rc},\\qquad p^TAq=\\sum_r\\sum_c p_rq_cA_{rc}.$$</p>" +
      "<p><b>Assumptions that matter:</b> the matrix $A$ records row's payoff, column optimizes the same value with the opposite sign, and mixed payoffs use action-profile probabilities.</p>",
    symbols: [
      { sym: "$A$", desc: "payoff matrix for row" },
      { sym: "$p$", desc: "row's mixed strategy" },
      { sym: "$q$", desc: "column's mixed strategy" },
      { sym: "$p^TAq$", desc: "expected value to row" }
    ],
    derivation: [
      { do: "Let $A_{rc}$ be row's payoff in cell $(r,c)$", result: "$A_{rc}$", why: "one matrix records row's payoff" },
      { do: "Use the zero-sum rule for column", result: "$-A_{rc}$", why: "one player's gain is the other's loss" },
      { do: "Let row use mixed strategy $p$ and column use $q$", result: "cell $(r,c)$ has probability $p_rq_c$", why: "independent mixed choices multiply" },
      { do: "Compute row's expected payoff", result: "$p^TAq=\\sum_r\\sum_c p_rq_cA_{rc}$", why: "sum each payoff times the probability of its cell" },
      { do: "Compute column's expected payoff", result: "$-p^TAq$", why: "column's payoff is the negative of row's value" },
      { do: "Add the two payoffs", result: "$p^TAq-p^TAq=0$", why: "this is the zero-sum condition" }
    ],
    applications: [
      { title: "Matching pennies", background: "The equilibrium has no long-run advantage for either player.", numbers: "Equilibrium value $0$ means neither player has a long-run edge." },
      { title: "Adversarial classification", background: "Defender accuracy and attacker utility can be modeled with opposite signs.", numbers: "Defender utility $0.75$ robust accuracy corresponds to attacker utility $-0.75$ in a zero-sum abstraction." },
      { title: "Security allocation", background: "Defender savings are attacker losses in the contest model.", numbers: "Defender saves $8$ units of loss, attacker payoff is $-8$ in the contest model." },
      { title: "Auction budget duel", background: "One bidder's relative surplus advantage is the other's loss.", numbers: "Bidder A's surplus advantage $3$ is bidder B's relative loss $-3$." },
      { title: "GAN idealization", background: "Discriminator gain can be paired with generator loss.", numbers: "Discriminator gain against the generator can be modeled as row value $v$ and generator value $-v$." },
      { title: "Robust optimization", background: "Worst-case loss can be viewed as an attacker objective.", numbers: "Minimizing worst-case loss $0.45$ is equivalent to an attacker maximizing loss to $0.45$." }
    ]
  },
  "math-24-11": {
    connectionsProse:
      "<p>The minimax theorem is the central equilibrium result for finite zero-sum games. It uses mixed strategies, expected payoff, and the zero-sum matrix $A$ from the previous lessons. The theorem says that row's best safety guarantee and column's best cap on row's payoff meet at the same value. This result is the mathematical basis for many adversarial and robust-learning formulations.</p>",
    motivation:
      "<p>The minimax theorem says that, in finite zero-sum games with mixed strategies, row's best guaranteed payoff equals column's best upper bound on row's payoff. Maximin and minimax meet at the value of the game. Row chooses a mixture to make the worst column response as good as possible; column chooses a mixture to make row's best response as small as possible.</p>" +
      "<p>In a two-action example, the calculation often works by equalizing the opponent's relevant payoffs. If row's mixture makes column's two pure responses give row the same expected payoff, column cannot lower the value by switching between them. If column's mixture makes row's two pure actions equally attractive, row cannot raise the value by switching. Where these equalizations agree, the game has its value.</p>",
    definition:
      "<p>The <b>minimax theorem</b> says that in a finite zero-sum game, row's best guaranteed payoff equals column's best cap on row's payoff: $$\\max_p\\min_q p^TAq=\\min_q\\max_p p^TAq=v.$$</p>" +
      "<p><b>Assumptions that matter:</b> the game is finite, players may use mixed strategies, $A$ is row's payoff matrix, and $v$ is the common value of the game.</p>",
    symbols: [
      { sym: "$\\max_p\\min_q p^TAq$", desc: "row's best guarantee" },
      { sym: "$\\min_q\\max_p p^TAq$", desc: "column's best cap" },
      { sym: "$v$", desc: "game value" }
    ],
    derivation: [
      { do: "Let row play top with probability $p$ for $A=\\begin{bmatrix}2&-1\\0&1\\end{bmatrix}$", result: "$p$", why: "row's mixture determines the payoff against each column" },
      { do: "Compute payoff if column chooses left", result: "$2p+0(1-p)=2p$", why: "left column pays $2$ to top and $0$ to bottom" },
      { do: "Compute payoff if column chooses right", result: "$-p+1(1-p)=1-2p$", why: "right column pays $-1$ to top and $1$ to bottom" },
      { do: "Equalize row's two worst-case candidates", result: "$2p=1-2p$", why: "row maximizes the worse of these two numbers" },
      { do: "Add $2p$", result: "$4p=1$", why: "this collects $p$ terms on one side" },
      { do: "Divide by $4$", result: "$p=1/4$", why: "this solves row's safety mixture" },
      { do: "Compute the guaranteed value", result: "$2p=1/2$", why: "both column responses now give the same payoff" },
      { do: "Let column choose left with probability $q$", result: "$q$", why: "column's mix determines row's payoff from each row action" },
      { do: "Compute row top payoff", result: "$2q-1(1-q)=3q-1$", why: "top gets $2$ against left and $-1$ against right" },
      { do: "Compute row bottom payoff", result: "$0q+1(1-q)=1-q$", why: "bottom gets $0$ against left and $1$ against right" },
      { do: "Set top and bottom equal", result: "$3q-1=1-q$", why: "column makes row indifferent" },
      { do: "Solve for $q$ and the value", result: "$4q=2$, so $q=1/2$ and the value is $1/2$", why: "the column mix caps row's payoff at the same value" }
    ],
    applications: [
      { title: "Toy security game", background: "The example matrix has a computable safety value.", numbers: "With matrix above, row guarantees value $0.5$ by playing top $25\\%$." },
      { title: "Adversarial training", background: "The model optimizes against the strongest attack.", numbers: "Model minimizes the maximum attack loss; reducing worst-case loss from $0.75$ to $0.45$ improves value by $0.30$." },
      { title: "GAN training", background: "The generator is judged after the discriminator's best response.", numbers: "A saddle objective asks the generator to lower the discriminator's best response; the value is measured after the inner maximization." },
      { title: "Penalty kicks", background: "Equalization prevents either goalie dive from being exploited.", numbers: "Equalizing the goalie's two dives at value $0.5$ prevents a worse guaranteed scoring rate." },
      { title: "Robust bidding", background: "A randomized bid can outperform a risky pure bid in worst case.", numbers: "A bidder choosing a randomized bid with guaranteed surplus $0.5$ should not switch to a pure bid with worst case $-1$." },
      { title: "MARL exploitability", background: "Exploitability compares a policy's worst-case payoff with the minimax value.", numbers: "If a policy's worst-case payoff is $0.2$ but the minimax value is $0.5$, exploitability is $0.3$." }
    ]
  },
  "math-24-12": {
    connectionsProse:
      "<p>Extensive-form games add time and information to the game models introduced earlier. Normal form is useful for simultaneous choices, but many strategic situations unfold in stages. A tree can record who moves first, what each player observes, and where the final payoffs are assigned. This representation prepares the reader for backward induction and subgame perfection.</p>",
    motivation:
      "<p>Extensive form represents timing. A game tree records who moves, what actions are available, what each player observes, and which payoff arrives at each terminal node. Each path through the tree is a possible history of play, ending at a leaf with payoffs for the players.</p>" +
      "<p>The tree matters because the order of moves can change the meaning of a strategy. A player may choose differently after seeing an earlier action, or may have to act without knowing exactly where in the tree they are. Decision nodes, branches, information sets, and terminal histories are the pieces that make this timing and information structure explicit.</p>",
    definition:
      "<p>An <b>extensive-form game</b> represents strategic timing with a tree of decision nodes, action branches, information sets, and terminal histories with payoffs.</p>" +
      "<p><b>Assumptions that matter:</b> place the initial node, add action branches, assign a player to each decision node, group indistinguishable nodes into information sets, and write payoffs at leaves.</p>",
    symbols: [
      { sym: "Node", desc: "a decision point in the game tree" },
      { sym: "branch", desc: "an available action from a node" },
      { sym: "$h$", desc: "terminal history" },
      { sym: "information set", desc: "nodes a player cannot distinguish" },
      { sym: "$u_i(h)$", desc: "payoff to player $i$ at a terminal history" }
    ],
    applications: [
      { title: "Negotiation", background: "An offer can be accepted or rejected at different leaves.", numbers: "Offer accept yields $(4,3)$; reject leads to $(1,1)$, so the accept leaf adds $5$ total payoff." },
      { title: "Ad auction sequence", background: "A platform can set a reserve before a bidder responds.", numbers: "Two reserve choices and two responses create $4$ terminal leaves." },
      { title: "RL episode", background: "A finite action tree records possible histories.", numbers: "State-action tree depth $3$ with two actions per step has $2^3=8$ action histories." },
      { title: "Security inspection", background: "Inspection occurs before the attacker chooses an action.", numbers: "Inspect first then attacker chooses attack/no-attack; inspection cost $2$ reduces defender payoff from $10$ to $8$ when no attack happens." },
      { title: "Recommendation session", background: "Sequential recommendations and click outcomes form a tree.", numbers: "Show item A then user clicks/skips; two rounds with binary outcomes create $4$ click histories." },
      { title: "Model deployment", background: "Review changes the payoff of launch versus hold.", numbers: "Review then launch/hold; launch payoff $5$ after approval versus $-4$ after rejection shows timing matters by $9$." }
    ]
  },
  "math-24-13": {
    connectionsProse:
      "<p>Backward induction is the solution method that fits finite perfect-information game trees. After extensive form has named nodes, branches, and terminal payoffs, the next step is to solve from the leaves back to the root. The method uses ordinary payoff maximization at each decision node. It is the foundation for sequential rationality and subgame perfection.</p>",
    motivation:
      "<p>Backward induction solves a finite perfect-information game from the end backward. At each last decision, the moving player chooses the best available continuation. Once that choice is made, the whole decision node can be replaced by the payoff that will result from rational play there.</p>" +
      "<p>Working backward is reliable because earlier players should anticipate what later players will actually choose. A threat or promise that would not be optimal when reached should not be treated as a real continuation. By reducing the tree one layer at a time, backward induction turns a sequential game into a sequence of simpler choices.</p>",
    definition:
      "<p><b>Backward induction</b> solves a finite perfect-information game tree by choosing optimal actions at terminal decision nodes, replacing those nodes by continuation values, and repeating back to the root.</p>" +
      "<p><b>Assumptions that matter:</b> the game tree is finite, players observe previous actions at each decision node, and each mover chooses the branch with the highest payoff for that mover.</p>",
    symbols: [
      { sym: "Terminal payoff", desc: "the payoff written at a leaf" },
      { sym: "continuation value", desc: "the value that replaces a solved future decision node" },
      { sym: "root", desc: "the initial node of the game tree" },
      { sym: "perfect information", desc: "the player knows the previous actions at each node" }
    ],
    derivation: [
      { do: "Start at terminal decision nodes", result: "known payoffs", why: "their continuation payoffs are already visible" },
      { do: "For each such node, choose the branch with the highest payoff for the moving player", result: "the locally optimal branch", why: "the player maximizes payoff when the node is reached" },
      { do: "Replace that node by the payoff of the chosen branch", result: "a continuation value", why: "earlier players only need the value rational play will produce there" },
      { do: "Move one step earlier in the tree", result: "a smaller decision problem", why: "later choices have already been summarized" },
      { do: "Repeat the same maximization using the replaced continuation values", result: "one more layer solved", why: "the method works backward one layer at a time" },
      { do: "Continue to the root", result: "the backward-induction outcome", why: "the remaining branch choices describe rational play through the tree" }
    ],
    applications: [
      { title: "Ultimatum toy game", background: "The responder's final choice determines the proposer's offer.", numbers: "Responder accepts offer $2$ over reject $0$; proposer then keeps $8$ and offers $2$." },
      { title: "Entry deterrence", background: "The incumbent's response after entry determines whether entry happens.", numbers: "Incumbent accommodates payoff $3$ over fights payoff $-1$ after entry, so entrant enters if entry payoff is $2$." },
      { title: "Sequential ad pricing", background: "The buyer's purchase decision determines the seller's best price.", numbers: "Buyer buys at price $4$ value $6$, surplus $2$; seller chooses price $4$ over price $7$ if $7$ causes no sale." },
      { title: "Security patch timing", background: "The defender values patching through the attacker's later response.", numbers: "Attacker does not attack patched system payoff $-1$ vs attack $-5$, so defender's patch value is computed from no-attack continuation." },
      { title: "Planning in RL", background: "A depth-limited tree is solved from child values upward.", numbers: "Depth-2 action values $5$ and $3$ at the child make the parent value $5$." },
      { title: "Negotiation deadline", background: "A final-period fallback determines earlier bargaining value.", numbers: "Final accept payoff $1$ beats reject $0$, so earlier offers can be evaluated against continuation value $1$." }
    ]
  },
  "math-24-14": {
    connectionsProse:
      "<p>Subgame perfection refines Nash equilibrium for dynamic games. A Nash equilibrium can describe stable behavior at the start while relying on threats that would not be optimal later. Extensive-form games and backward induction provide the tools to test those later histories directly. This lesson turns credibility into a formal equilibrium requirement.</p>",
    motivation:
      "<p>Subgame perfection strengthens Nash equilibrium by requiring credible optimal behavior after every history that starts a proper subgame. It removes threats that a player would not actually carry out. In a sequential game, the plan must be stable not only from the root, but also from each subgame that could be reached.</p>" +
      "<p>The test is local but demanding. Restrict the proposed strategies to one subgame and ask whether they form a Nash equilibrium inside that subgame. Then repeat for every subgame. A profile that fails anywhere is not sequentially credible, even if no player wants to deviate at the very beginning.</p>",
    definition:
      "<p>A <b>subgame-perfect equilibrium</b> is a strategy profile whose restriction is a Nash equilibrium in every subgame: $$s|_G\\text{ is Nash in every subgame }G.$$</p>" +
      "<p><b>Assumptions that matter:</b> a subgame begins at a decision node, contains all later nodes, does not cut an information set, and must pass its own equilibrium test.</p>",
    symbols: [
      { sym: "Subgame", desc: "a decision node with all later nodes that does not cut an information set" },
      { sym: "$s$", desc: "strategy profile" },
      { sym: "$s|_G$", desc: "restriction of $s$ to subgame $G$" },
      { sym: "credible threat", desc: "a threat that is optimal if the relevant subgame is reached" }
    ],
    derivation: [
      { do: "Identify every subgame", result: "decision nodes that contain all later nodes and do not cut an information set", why: "only those histories define valid subgames" },
      { do: "For a proposed strategy profile, restrict the strategies to one subgame", result: "$s|_G$", why: "credibility is checked inside the reached subgame" },
      { do: "Check whether the restricted profile is Nash in the subgame", result: "$s|_G$ passes or fails", why: "players should not want to deviate once the subgame starts" },
      { do: "Repeat for every subgame", result: "a list of subgame checks", why: "sequential credibility must hold after every relevant history" },
      { do: "Accept the profile if all subgames pass", result: "the profile is subgame perfect", why: "every continuation is a Nash equilibrium where it is played" },
      { do: "Reject the profile if one subgame fails", result: "the full profile is not subgame perfect", why: "it relies on noncredible play somewhere" }
    ],
    applications: [
      { title: "Entry deterrence", background: "A fight threat must be optimal after entry to be credible.", numbers: "Threat to fight gives incumbent $-1$ while accommodate gives $3$, so fight is not credible and the profile fails subgame perfection." },
      { title: "Bargaining", background: "Final-period rejection threats are tested where they occur.", numbers: "Rejecting a final offer of $2$ for payoff $0$ is not sequentially rational, so the threat is removed." },
      { title: "Platform moderation", background: "A punishment policy must be optimal in the reached moderation subgame.", numbers: "Threatening permanent ban with payoff $-5$ when warning gives $1$ is not credible in that subgame." },
      { title: "RL hierarchical policy", background: "Low-level subtasks must be optimized when reached.", numbers: "A high-level plan is credible only if the low-level policy maximizes each reached subtask value, such as $7$ over $4$." },
      { title: "Auction after reserve", background: "The seller's later accept/reject choice must be credible.", numbers: "If the seller would accept bid $10$ over outside option $8$, a threat to reject $10$ is not subgame perfect." },
      { title: "Security response", background: "A response plan must remain optimal after detection.", numbers: "After detection, isolating server payoff $6$ beats doing nothing $-3$, so any plan requiring no isolation fails." }
    ]
  },
  "math-24-15": {
    connectionsProse:
      "<p>Repeated games add a future to the strategic situations studied earlier. A one-shot prisoner's dilemma makes defection attractive in the current round, but repetition lets later rewards and punishments affect today's choice. This lesson connects Nash reasoning to incentives over time. It also gives a first exact threshold calculation using a discount factor.</p>",
    motivation:
      "<p>Repetition changes incentives because today's action affects tomorrow's punishment or reward. Cooperation can be stable when the future is valuable enough. If a player defects now, the immediate temptation payoff may be high, but future punishment can erase that gain.</p>" +
      "<p>The discount factor $\\delta$ measures how much the next period matters compared with the current one. Grim trigger is a simple strategy: cooperate unless someone defects, and after a defection punish forever. The stability calculation compares the present value of cooperating forever with the present value of defecting once and then receiving the punishment payoff.</p>",
    definition:
      "<p>In a repeated game, a strategy can condition current actions on previous play; under grim trigger, cooperation is stable when the present value of cooperating forever is at least the value of defecting once and then being punished: $$\\frac{R}{1-\\delta}\\ge T+\\frac{\\delta P}{1-\\delta}.$$</p>" +
      "<p><b>Assumptions that matter:</b> payoffs repeat over time, future payoffs are discounted by $\\delta$, and grim trigger switches to the punishment payoff forever after a defection.</p>",
    symbols: [
      { sym: "$\\delta$", desc: "discount factor" },
      { sym: "$T$", desc: "temptation payoff" },
      { sym: "$R$", desc: "mutual cooperation payoff" },
      { sym: "$P$", desc: "punishment payoff" }
    ],
    derivation: [
      { do: "Compute the value of cooperating forever", result: "$R+\\delta R+\\delta^2R+\\cdots=R/(1-\\delta)$", why: "cooperation pays $R$ each period with discounting" },
      { do: "Compute the value of defecting once then being punished", result: "$T+\\delta P+\\delta^2P+\\cdots=T+\\delta P/(1-\\delta)$", why: "defection gives $T$ now and $P$ in all future punished periods" },
      { do: "Require cooperation to be stable", result: "$R/(1-\\delta)\\ge T+\\delta P/(1-\\delta)$", why: "cooperating must be at least as valuable as deviating" },
      { do: "Multiply by $1-\\delta$", result: "$R\\ge T(1-\\delta)+\\delta P$", why: "this clears the geometric-series denominator" },
      { do: "Expand the right side", result: "$R\\ge T-\\delta T+\\delta P$", why: "this separates the current temptation and future punishment terms" },
      { do: "Rearrange", result: "$\\delta(T-P)\\ge T-R$", why: "collect the discount-factor terms on one side" },
      { do: "Divide by $T-P$ for $T=5$, $R=3$, and $P=1$", result: "$\\delta\\ge (T-R)/(T-P)=2/4=0.5$", why: "this gives the exact grim-trigger threshold" }
    ],
    applications: [
      { title: "Prisoner's dilemma", background: "The standard grim-trigger calculation gives a cooperation threshold.", numbers: "With $T=5,R=3,P=1$, cooperation is sustainable when $\\delta\\ge0.5$." },
      { title: "Seller reputation", background: "A seller compares cheating now with future margin loss.", numbers: "Cheating gains $2$ now but loses future margin $4$ per period; threshold is $2/4=0.5$." },
      { title: "Ad exchange quality", background: "Spam can be deterred when future cooperative value matters enough.", numbers: "Short-term spam gain $6$ versus cooperative margin $4$ and punishment $0$ gives threshold $(6-4)/(6-0)=1/3$." },
      { title: "Multi-agent self-play", background: "Patient agents can sustain cooperation.", numbers: "If defection reward is $5$ and cooperative reward is $3$, agents with $\\delta=0.9$ pass the $0.5$ cooperation threshold." },
      { title: "API rate limits", background: "A future ban can deter overuse.", numbers: "Overuse gain $10$ now and future ban loss $25$ is deterred when $\\delta\\ge10/25=0.4$." },
      { title: "Repeated auctions", background: "Future punishment can deter bid shading.", numbers: "Bid shading gain $1$ with future punishment loss $3$ requires $\\delta\\ge1/3$ to deter shading." }
    ]
  },
  "math-24-16": {
    connectionsProse:
      "<p>Bayesian games extend strategic reasoning to private information. Earlier lessons assumed that the payoff table or game tree was commonly known, but many situations involve hidden types such as cost, value, quality, or intent. The player must choose an action using beliefs about those types. This lesson prepares for auctions, screening, signaling, and mechanism-design examples.</p>",
    motivation:
      "<p>A Bayesian game adds private information. Players choose actions using beliefs about types, not just beliefs about actions. A type is a piece of private information that affects payoffs or available choices, such as a bidder's value or a firm's cost.</p>" +
      "<p>The main calculation is expected payoff over unknown types. A strategy must say what each type would do, because a high type and a low type may rationally choose different actions. Bayesian Nash equilibrium then requires every type's assigned action to be optimal given beliefs and the other players' type-contingent strategies.</p>",
    definition:
      "<p>A <b>Bayesian game</b> is a game with private types and beliefs, where strategies map types to actions and expected payoff averages over unknown types: $$\\mathbb E[u_i(a,t)]=\\sum_tP(t)u_i(a,t).$$</p>" +
      "<p><b>Assumptions that matter:</b> types affect payoffs or choices, priors describe uncertainty before actions, and Bayesian Nash equilibrium requires each type's assigned action to maximize expected payoff given beliefs.</p>",
    symbols: [
      { sym: "$t_i$", desc: "type" },
      { sym: "$P(t)$", desc: "prior" },
      { sym: "belief", desc: "probability assessment over unknown types" },
      { sym: "$s_i(t_i)$", desc: "type-contingent strategy" },
      { sym: "Bayesian Nash equilibrium", desc: "a profile where each type's action is optimal given beliefs and others' type-contingent strategies" }
    ],
    derivation: [
      { do: "Let player $i$ have type $t_i$", result: "$t_i$", why: "the type represents private information such as high cost or low cost" },
      { do: "Assign a prior probability before actions are chosen", result: "$P(t_i)$", why: "players need beliefs about unknown types" },
      { do: "Define a strategy by type", result: "$s_i(t_i)$", why: "different types may rationally choose different actions" },
      { do: "Average payoffs over unknown types", result: "$\\mathbb E[u_i(a,t)]=\\sum_tP(t)u_i(a,t)$", why: "expected payoff weights each type's payoff by its probability" },
      { do: "Apply the equilibrium requirement", result: "each type's chosen action maximizes expected payoff given beliefs and other type-contingent strategies", why: "Bayesian Nash equilibrium is optimality type by type" }
    ],
    applications: [
      { title: "Investment under private quality", background: "The investor averages high- and low-quality payoffs.", numbers: "High type probability $0.3$, payoff $10$ if high and $-5$ if low gives expected payoff $-0.5$, so do not invest." },
      { title: "Auction bidding", background: "A bidder averages possible private values.", numbers: "Bidder value $100$ with probability $0.4$ and $40$ with probability $0.6$ gives expected value $64$." },
      { title: "Ad fraud detection", background: "Fraud risk changes expected payoff.", numbers: "Fraud probability $0.2$, loss $-20$, clean gain $5$ gives expected payoff $0.8(5)+0.2(-20)=0$." },
      { title: "Personalized pricing", background: "A high willingness type contributes expected margin before churn.", numbers: "High willingness type probability $0.25$ and margin $12$ gives expected high-price margin $3$ before churn costs." },
      { title: "MARL hidden roles", background: "An agent averages over cooperative and adversarial teammate types.", numbers: "Teammate is cooperative with probability $0.7$ payoff $8$ and adversarial with probability $0.3$ payoff $-4$, expected payoff $4.4$." },
      { title: "Mechanism design", background: "A type compares truthful reporting with lying.", numbers: "Truthful report by a low-cost type pays $6$ and lying pays $4$, so incentive margin is $2$ for that type." }
    ]
  },
  "math-24-17": {
    connectionsProse:
      "<p>Cooperative games shift attention from individual action profiles to coalitions. Instead of asking which actions form an equilibrium, the model asks what groups can achieve together and how the resulting value can be divided. This connects game theory to bargaining, cost sharing, data consortia, and allocation problems. The core is the stability concept that keeps coalitions from wanting to leave.</p>",
    motivation:
      "<p>Cooperative games study what coalitions can achieve and how a total value can be divided. The core contains allocations that no coalition can improve on by leaving. An allocation must first distribute the grand coalition's total value, so nothing is lost or overpaid at the full-group level.</p>" +
      "<p>Stability then requires every smaller coalition to receive at least what it could make on its own. If a group of players is assigned less than its standalone value, those players have a blocking deviation: they can leave and do better together. The core is the set of allocations that survive all such coalition checks.</p>",
    definition:
      "<p>The <b>core</b> of a cooperative game is the set of allocations that fully distribute the grand coalition's value and give every coalition at least its standalone value: $$\\sum_{i\\in N}x_i=v(N),\\qquad \\sum_{i\\in S}x_i\\ge v(S)\\text{ for every }S.$$</p>" +
      "<p><b>Assumptions that matter:</b> coalition values $v(S)$ are known, the grand coalition's value is fully allocated, and every coalition can block an allocation that gives it less than $v(S)$.</p>",
    symbols: [
      { sym: "$N$", desc: "grand coalition" },
      { sym: "$S\\subseteq N$", desc: "coalition" },
      { sym: "$v(S)$", desc: "coalition value" },
      { sym: "$x_i$", desc: "player $i$'s allocation" },
      { sym: "core", desc: "allocations satisfying efficiency and all coalition-rationality inequalities" }
    ],
    derivation: [
      { do: "Let $v(S)$ be the value coalition $S$ can make alone", result: "$v(S)$", why: "coalition values define outside options" },
      { do: "Let an allocation assign payoff to each player", result: "$x_i$", why: "the total value must be divided among players" },
      { do: "Require efficiency", result: "$\\sum_{i\\in N}x_i=v(N)$", why: "the grand coalition's value is fully distributed" },
      { do: "Require coalition rationality", result: "$\\sum_{i\\in S}x_i\\ge v(S)$ for every coalition $S$", why: "each coalition must receive at least what it can make alone" },
      { do: "Check for a violated coalition inequality", result: "a blocking deviation if $\\sum_{i\\in S}x_i<v(S)$", why: "that coalition can leave and make more than its assigned total" },
      { do: "Collect allocations satisfying all inequalities", result: "the core", why: "these allocations survive every coalition check" }
    ],
    applications: [
      { title: "Data consortium", background: "An allocation must first distribute the grand coalition's value.", numbers: "$v(ABC)=100$, allocation $(40,35,25)$ is efficient because totals $100$." },
      { title: "Coalition check", background: "A pair stays if it receives at least its pair value.", numbers: "If $v(AB)=70$, then $x_A+x_B=75$ blocks no deviation by AB." },
      { title: "Feature-sharing", background: "A coalition with slack has no reason to leave.", numbers: "If $v(AC)=60$, allocation gives $65$, surplus $5$ above the coalition's outside option." },
      { title: "Compute cluster sharing", background: "A team pair stays when assigned value exceeds its standalone production.", numbers: "If team B+C can produce value $55$ and receives $60$, it stays by margin $5$." },
      { title: "Ride-sharing cost core", background: "Cost shares must not exceed a coalition's outside-option cost.", numbers: "If three-person cost is $30$ and pair AB can ride for $18$, cost shares for AB must be at most $18$; shares $9+8=17$ pass by $1$." },
      { title: "Open-source funding", background: "A funding coalition with positive slack does not block.", numbers: "If firms A+C value maintenance at $220k$ and receive $230k$ of benefit, the coalition has $10k$ slack." }
    ]
  },
  "math-24-18": {
    connectionsProse:
      "<p>Evolutionary game theory changes the interpretation of strategies from deliberate choices by one player to shares in a population. The payoff comparisons are still game-theoretic, but the outcome is a dynamic process rather than a single equilibrium cell. Strategies that earn above-average payoff tend to spread. This connects game theory to biology, cultural learning, traffic adaptation, and population-based reinforcement learning.</p>",
    motivation:
      "<p>Evolutionary game theory tracks how strategy shares change when better-performing strategies spread. It replaces one-shot rational choice with population dynamics. If a strategy's payoff is above the population average, its share grows; if its payoff is below average, its share shrinks.</p>" +
      "<p>The replicator equation turns that idea into a rate of change. The growth term has two parts: the current share of the strategy and its payoff advantage over average. Evolutionary stability adds a related invasion test: a resident strategy is stable if small groups of mutants do worse and therefore cannot grow.</p>",
    definition:
      "<p><b>Evolutionary game theory</b> studies how strategy shares change with payoff advantage; the replicator equation is $$\\dot x_i=x_i((Ax)_i-x^TAx).$$</p>" +
      "<p><b>Assumptions that matter:</b> $x_i$ is a population share, payoffs come from the current population state, above-average strategies grow, and ESS checks whether small mutant populations can invade.</p>",
    symbols: [
      { sym: "$x_i$", desc: "strategy share" },
      { sym: "$A$", desc: "payoff matrix" },
      { sym: "$(Ax)_i$", desc: "strategy payoff" },
      { sym: "$x^TAx$", desc: "average payoff" },
      { sym: "$\\dot x_i$", desc: "time derivative of share" },
      { sym: "$s$", desc: "resident strategy" },
      { sym: "$t$", desc: "mutant strategy" },
      { sym: "$\\epsilon$", desc: "mutant share" }
    ],
    derivation: [
      { do: "Let $x_i$ be the population share using strategy $i$", result: "$x_i$", why: "strategy use is measured as a share of the population" },
      { do: "Compute the payoff to strategy $i$ in population state $x$", result: "$(Ax)_i$", why: "the matrix payoff is averaged against the current population" },
      { do: "Compute the average population payoff", result: "$x^TAx$", why: "this is the payoff benchmark for growth" },
      { do: "Compute the relative advantage of strategy $i$", result: "$(Ax)_i-x^TAx$", why: "above-average payoff should increase share" },
      { do: "Multiply by current share", result: "$\\dot x_i=x_i((Ax)_i-x^TAx)$", why: "proportional growth depends on both share and advantage" },
      { do: "For an ESS $s$, compare a small mutant share $\\epsilon$ of strategy $t$ against mostly residents", result: "resident-versus-mutant invasion test", why: "stability means mutants cannot grow when rare" },
      { do: "Compute resident payoff", result: "$(1-\\epsilon)u(s,s)+\\epsilon u(s,t)$", why: "residents mostly meet residents and sometimes meet mutants" },
      { do: "Compute mutant payoff", result: "$(1-\\epsilon)u(t,s)+\\epsilon u(t,t)$", why: "mutants mostly meet residents and sometimes meet mutants" },
      { do: "Require resident payoff to exceed mutant payoff for small positive $\\epsilon$", result: "resident payoff $>$ mutant payoff", why: "mutants then shrink rather than invade" },
      { do: "Take $\\epsilon\\to0$", result: "$u(s,s)>u(t,s)$", why: "the leading-order resident-versus-mutant comparison must favor the resident" },
      { do: "If the first terms tie, compare the $\\epsilon$ terms", result: "$u(s,t)>u(t,t)$", why: "the second ESS test breaks the tie" },
      { do: "For Hawk-Dove, write the two payoffs", result: "$u_H=2-4x$ and $u_D=1-x$", why: "an interior rest point equalizes the active strategies" },
      { do: "Set the payoffs equal", result: "$2-4x=1-x$", why: "both strategies persist only when their payoffs match" },
      { do: "Add $4x$", result: "$2=1+3x$", why: "this gathers $x$ terms on the right" },
      { do: "Subtract $1$", result: "$1=3x$", why: "this isolates the multiple of $x$" },
      { do: "Divide by $3$", result: "$x=1/3$", why: "this gives the Hawk-Dove interior mix" }
    ],
    applications: [
      { title: "Biological competition", background: "A fitter trait grows in proportion to its share and advantage.", numbers: "Trait share $0.3$, fitness $1.2$, average $1.0$ gives growth $0.3(0.2)=0.06$." },
      { title: "Cultural imitation", background: "A norm with above-average payoff spreads.", numbers: "Norm share $0.4$, payoff $7$, average $5$ gives growth pressure $0.8$." },
      { title: "Population-based RL", background: "A policy with above-average reward gets positive update pressure.", numbers: "Policy share $0.25$, reward $120$, average $100$ gives update term $5$ before scaling." },
      { title: "Traffic route choice", background: "A better route attracts more drivers in the dynamic model.", numbers: "Route payoff advantage $5$ at share $0.2$ gives growth term $1.0$." },
      { title: "Algorithm selection", background: "A better-scoring algorithm gains share slowly when its advantage is small.", numbers: "Score $0.84$ versus average $0.80$ at share $0.2$ gives update $0.008$." },
      { title: "ESS check", background: "A resident strategy passes immediately if it beats mutants against residents.", numbers: "If $u(s,s)=4$ and $u(t,s)=3$, resident $s$ passes the first ESS test by margin $1$." }
    ]
  },
  "math-24-19": {
    connectionsProse:
      "<p>Correlated equilibrium extends Nash equilibrium by allowing players to condition their actions on private recommendations from a mediator. The players still make their own decisions, but their actions can be coordinated through signals. This concept sits between noncooperative equilibrium and mechanism design. It is useful whenever a shared recommendation can reduce collisions, congestion, or duplicated work.</p>",
    motivation:
      "<p>Correlated equilibrium allows a mediator to recommend actions. It is stable when every player wants to follow the recommendation after learning only their own signal. The player does not observe the full recommended action profile; the player only knows the recommendation they received.</p>" +
      "<p>The obedience condition is the main idea. Conditional on receiving a recommendation, compare the expected payoff from obeying with the expected payoff from switching to another action. If obeying is at least as good for every player, every recommendation, and every deviation, the mediator's distribution is a correlated equilibrium.</p>",
    definition:
      "<p>A <b>correlated equilibrium</b> is a mediator distribution over action profiles such that every player prefers obeying the received recommendation to any unilateral deviation: $$\\mathbb E[u_i(r,a_{-i})\\mid a_i=r]\\ge \\mathbb E[u_i(d,a_{-i})\\mid a_i=r].$$</p>" +
      "<p><b>Assumptions that matter:</b> the player sees only their own recommendation, expectations condition on that recommendation, and the obedience inequality must hold for every player, recommendation, and deviation.</p>",
    symbols: [
      { sym: "$\\pi(a)$", desc: "mediator distribution" },
      { sym: "$r$", desc: "recommended action" },
      { sym: "$d$", desc: "deviation" },
      { sym: "$a_{-i}$", desc: "others' recommended actions" },
      { sym: "obedience inequality", desc: "the condition that following a recommendation is at least as good as deviating" }
    ],
    derivation: [
      { do: "Let $\\pi(a)$ be the probability that the mediator recommends action profile $a$", result: "$\\pi(a)$", why: "the mediator randomizes over full action profiles" },
      { do: "Condition on player $i$ receiving recommendation $r$", result: "$a_i=r$", why: "that is the information the player has" },
      { do: "Compute the expected payoff from obeying", result: "$\\mathbb E[u_i(r,a_{-i})\\mid a_i=r]$", why: "the player follows the recommendation and averages over others' recommendations" },
      { do: "Compute the expected payoff from deviating to $d$", result: "$\\mathbb E[u_i(d,a_{-i})\\mid a_i=r]$", why: "the player switches action while keeping the same information" },
      { do: "Require obedience to be at least as good as deviation", result: "$\\mathbb E[u_i(r,a_{-i})\\mid a_i=r]\\ge \\mathbb E[u_i(d,a_{-i})\\mid a_i=r]$", why: "no player should want to ignore the recommendation" },
      { do: "Check Battle of the Sexes with recommendations $(A,A)$ and $(B,B)$ each probability $0.5$", result: "recommendation $A$ gives obeying payoff $2$ versus deviation $0$; recommendation $B$ gives obeying payoff $1$ versus deviation $0$", why: "both obedience inequalities hold" }
    ],
    applications: [
      { title: "Traffic routing", background: "A mediator can recommend a split that avoids congestion.", numbers: "If following a split recommendation gives $20$ minutes and deviating to the same route gives $35$, obedience saves $15$ minutes." },
      { title: "Wireless channels", background: "Recommended different channels avoid interference.", numbers: "Different channels give $10$ Mbps each and same channel $3$ Mbps, so obeying gains $7$ Mbps." },
      { title: "Robot task assignment", background: "A mediator can prevent duplicated robot work.", numbers: "Map/carry reward $12$ versus duplicate-map reward $5$ gives obedience gain $7$." },
      { title: "Load balancing", background: "Following recommendations sends jobs to separate servers.", numbers: "Separate servers finish in $4$ seconds and same server in $9$, so following saves $5$ seconds." },
      { title: "Recommendation platforms", background: "Coordinated recommendations can avoid audience overlap.", numbers: "Distinct audience segments give $1000$ impressions each while overlap gives $600$ each, so correlation adds $800$ total impressions." },
      { title: "Mechanism design", background: "Positive obedience slack means the recommended action is stable.", numbers: "If obeying pays $1.2$ and deviating pays $1.0$, the obedience slack is $0.2$." }
    ]
  },
  "math-24-20": {
    connectionsProse:
      "<p>This capstone brings the section's game-theory language into machine learning. Mixed strategies, best responses, zero-sum objectives, and minimax reasoning all appear when models are trained against other models or adaptive opponents. GANs provide the clearest mathematical example because one network improves by making another network's discrimination task harder. The same vocabulary also helps describe adversarial robustness, self-play, and multi-agent reinforcement learning.</p>",
    motivation:
      "<p>Game-theoretic ML has objectives that move because another learner is moving too. GANs, adversarial training, self-play, and multi-agent RL all require equilibrium and best-response language. A model is not optimizing against a fixed environment; it is often optimizing against another process that adapts in response.</p>" +
      "<p>In a GAN, the discriminator tries to separate real samples from generated samples, while the generator tries to make generated samples harder to separate. If the generator distribution matches the data distribution, the discriminator's best local output is $1/2$. That value means the discriminator has no label advantage at that point, which is the same indifference idea that appeared in mixed equilibrium and minimax games.</p>",
    definition:
      "<p>A <b>GAN</b> can be viewed as a minimax game in which the generator minimizes the value that the discriminator maximizes: $$\\min_G\\max_D\\;\\mathbb E_{x\\sim p_{data}}\\log D(x)+\\mathbb E_{x\\sim p_G}\\log(1-D(x)).$$</p>" +
      "<p><b>Assumptions that matter:</b> fix $G$ while optimizing $D$, treat $p_G$ as fixed in the inner maximization, and solve the discriminator's local best response pointwise in $x$.</p>",
    symbols: [
      { sym: "$G$", desc: "generator" },
      { sym: "$D$", desc: "discriminator" },
      { sym: "$p_{data}$", desc: "data distribution" },
      { sym: "$p_G$", desc: "generator distribution" },
      { sym: "$z$", desc: "noise" },
      { sym: "minimax", desc: "one side minimizes the value the other maximizes" }
    ],
    derivation: [
      { do: "Fix $G$", result: "$p_G$ is fixed while optimizing $D$", why: "the inner maximization treats the generator distribution as given" },
      { do: "At one point $x$, write the contribution", result: "$a\\log D+b\\log(1-D)$ with $a=p_{data}(x)$ and $b=p_G(x)$", why: "the discriminator choice at that point has real and generated weights" },
      { do: "Differentiate with respect to $D$", result: "$a/D-b/(1-D)$", why: "this gives the slope of the local discriminator objective" },
      { do: "Set the derivative to zero", result: "$a/D-b/(1-D)=0$", why: "an interior maximum has slope $0$" },
      { do: "Move terms", result: "$a/D=b/(1-D)$", why: "this balances the real and generated contributions" },
      { do: "Cross-multiply", result: "$a(1-D)=bD$", why: "this clears denominators" },
      { do: "Expand", result: "$a-aD=bD$", why: "this separates the constant and $D$ terms" },
      { do: "Add $aD$", result: "$a=(a+b)D$", why: "this gathers the $D$ terms on one side" },
      { do: "Divide by $a+b$", result: "$D^*(x)=a/(a+b)=p_{data}(x)/(p_{data}(x)+p_G(x))$", why: "this solves the discriminator's best response" },
      { do: "Set $p_G=p_{data}$", result: "$D^*(x)=1/2$", why: "equal real and generated densities make the discriminator indifferent" }
    ],
    applications: [
      { title: "GAN discriminator objective", background: "The discriminator's log objective averages real and fake outputs.", numbers: "Real outputs $0.8,0.7,0.6,0.9$ and fake outputs $0.3,0.4,0.2,0.5$ give average log objective $-0.3725$." },
      { title: "Ideal discriminator", background: "Matching distributions remove local label advantage.", numbers: "If $p_{data}(x)=p_G(x)$, then $D^*(x)=1/2$, so the discriminator has no local label advantage." },
      { title: "Adversarial robustness", background: "A lower worst-case loss improves the minimax objective.", numbers: "Worst-case loss drops from $0.75$ to $0.45$, improving the minimax objective by $0.30$." },
      { title: "Self-play promotion", background: "A policy can be promoted after clearing a win-rate gate.", numbers: "A new policy winning $56$ of $100$ games has estimated win rate $0.56$, passing a $0.55$ gate by $0.01$." },
      { title: "Opponent nonstationarity", background: "A changing opponent shifts the reward landscape.", numbers: "Reward falling from $8$ against opponent v1 to $3$ against v2 is a $5$-point strategic shift." },
      { title: "Population evaluation", background: "A policy can be evaluated against a distribution of opponents.", numbers: "Win rates $0.7,0.6,0.5,0.4,0.3$ average to $0.5$, showing no net edge over the opponent population." }
    ]
  }
};
