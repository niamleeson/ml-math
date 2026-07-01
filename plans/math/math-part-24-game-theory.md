# Math · Part 24 — Game theory  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four exposition
> principles, the fix recipe, and the Definition of Done. This section has no whole-section §5 boilerplate, so the
> work is targeted deepening: make every payoff rule, equilibrium condition, and minimax statement explicit.
> Numbers below were checked with `python3` + `numpy` on 2026-07-01: matching-pennies value $0$, Battle-of-the-Sexes
> mix $(p,q)=(2/3,1/3)$, zero-sum value $0.5$, Hawk-Dove mix $1/3$, grim-trigger threshold $0.5$, Bayesian expected
> payoff $-0.5$, correlated-obedience payoffs, and GAN log objective $-0.3725$.

**Section:** Game theory · **Lessons:** 20 · **Breadcrumb:** `Mathematics · Applied / Computational` · **Priority:** STANDARD (targeted deepening)

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate (shared app-set with a sibling) | 0 / 20 |
| Templated / thin motivation (stock opener or ≤45 words) | 0 / 20 |
| Key formula not in display form | 2 / 20 |
| Unclosed-`$` LaTeX bug | 0 / 20 |
| Derivation action in this deep plan | 16 derivation / 4 explain-only |

**The core change:** keep the already-good game-theory framing, but replace scaffold-level cues with complete
case-by-case derivations and six concept-specific applications per lesson. Applications connect directly to ML where
appropriate: GANs as minimax, multi-agent RL, adversarial training, auctions, recommendation systems, routing, and
mechanism design.

---

## Priority & systemic issues

- **No whole-section §5 boilerplate block.** Applications are not copied across the section, but many should be made
  more numerical and tied to the exact lesson concept.
- **Formula display and symbol glossing.** Promote the payoff-function and zero-sum formulas to display form, and gloss
  all roles: players, actions, strategies, payoffs, beliefs, mediator distributions, and value functions.
- **Derivation depth.** Author complete derivations for dominance inequalities, best responses, pure and mixed Nash,
  minimax value, backward induction, subgame perfection, repeated-game incentives, Bayesian expected payoffs, the core,
  ESS/replicator conditions, correlated-equilibrium obedience, and the GAN discriminator optimum.
- **Explain-only lessons.** `24-01`, `24-02`, `24-09`, and `24-12` are mainly modeling-language lessons. Do not force a
  proof; explain the construction and then use numerical payoff examples.
- **LaTeX bugs.** None found in the dump: no unclosed `$`, and no lost matrix row breaks.

---

## Model entry (full prose)

### `math-24-08` — Mixed-strategy Nash equilibrium  — **full-depth model entry (this is the bar)**

**Connections (§1).**
> This lesson builds on mixed strategies and Nash equilibrium. A mixed strategy lets a player randomize among actions,
> while Nash equilibrium says that no player wants to change after seeing the others' strategies. A mixed-strategy Nash
> equilibrium combines those ideas: each player chooses probabilities, and those probabilities make the other player
> willing to randomize as well.
>
> This is the first place where equilibrium is found by solving for probabilities instead of checking a finite list of
> action pairs. That matters in games with no stable pure action, such as matching pennies, penalty kicks, bidding, and
> adversarial learning. The same calculation later appears in minimax games, GAN intuition, and multi-agent systems in
> which predictable behavior can be exploited.

**Motivation & Intuition (§2).**
> In a pure-strategy equilibrium, each player chooses one action and stays there because switching would not help. Some
> games have no such stable action pair. In matching pennies, if both players choose heads, the matching player wins and
> the mismatching player wants to switch. If they mismatch, the matching player wants to switch. Every pure outcome gives
> someone a reason to move.
>
> Randomization can make the game stable. The key is not that randomness hides the player's action after it is chosen;
> the key is that the probabilities make the opponent indifferent. If the column player chooses heads with probability
> $q$, the row player's expected payoff from heads is $2q-1$, and the expected payoff from tails is $1-2q$. The row
> player is willing to mix only when these are equal. Solving that equality gives $q=1/2$. By symmetry, the row player
> also uses heads with probability $p=1/2$.
>
> The indifference principle is the central habit. To find a mixed equilibrium, make each player indifferent among the
> actions that receive positive probability, then solve the resulting equations. Actions outside the support must not do
> better, or the proposed mix is not an equilibrium.

**Definition & Assumptions (§3).** Display the condition
$$
\text{for every player }i,
\quad s_i\in\operatorname{BR}(s_{-i}),
$$
where each $s_i$ may be a probability distribution over actions. Then solve matching pennies completely:
1. Let $q$ be the probability that column plays heads. This is the one number row needs to compute expected payoffs.
2. Row's payoff from heads is $q(1)+(1-q)(-1)=2q-1$, because heads wins against heads and loses against tails.
3. Row's payoff from tails is $q(-1)+(1-q)(1)=1-2q$, because tails loses against heads and wins against tails.
4. Set $2q-1=1-2q$, because row mixes only when both pure actions are tied.
5. Add $2q$ to both sides to get $4q-1=1$, one algebra move toward isolating $q$.
6. Add $1$ to both sides to get $4q=2$, so the coefficient on $q$ is alone.
7. Divide by $4$ to get $q=1/2$.
8. Let $p$ be the probability row plays heads. The same indifference calculation for column gives $p=1/2$.
9. The game value to row is $0$, because $0.5(1)+0.5(-1)=0$ for either pure action against the equilibrium mix.

**Symbols.** $s_i$ is player $i$'s strategy, possibly mixed; $s_{-i}$ is the profile of other players' strategies;
$\operatorname{BR}$ is the best-response set; $p$ and $q$ are probabilities of heads; payoff $1$ means row wins one
unit and payoff $-1$ means row loses one unit; the support is the set of actions played with positive probability.

**Real-World Applications (§5).**
1. **Matching pennies baseline.** The equilibrium mix is $p=q=1/2$, and row's value is $0$; a test simulation with a
   long-run heads rate near $0.5$ should produce average payoff near $0$.
2. **Penalty kicks.** If shooting left scores with probability $0.8$ when the goalie dives right and $0.2$ when the
   goalie dives left, the kicker can be made indifferent only by the goalie's dive probabilities; equalized expected
   scoring at $0.5$ is the target in the symmetric case.
3. **Adversarial example choice.** If an attacker alternates two perturbation types and the defender is indifferent at
   $q=1/2$, a deterministic defense can be exploited while the mixed defense gives each attack expected success $0.5$.
4. **A/B auction bidding.** In a two-bid toy game, a bidder who is indifferent between low and high bids at rival high-bid
   probability $q=1/2$ should randomize instead of choosing a predictable bid.
5. **Multi-agent RL self-play.** A policy that plays rock and paper each with probability $0.5$ in a two-action
   subgame gives the opponent equal value $0$ from its two counter-actions, preventing a one-action exploit.
6. **GAN discriminator pressure.** A generator that makes the discriminator's two labels equally attractive corresponds
   to the same indifference idea; at the ideal GAN equilibrium $D^*(x)=1/2$, the discriminator has no better label rule
   at that point.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted content in render order. Labels are plan shorthand only. Each lesson
should become flowing prose in a plain, warm textbook voice, with complete derivations when there is a formula to build.

### `math-24-01` — Games, players, and payoffs  · explain-only

**Connections (§1).**
> This opening lesson gives the basic language used throughout game theory. The reader already knows how to describe a
> choice made by one decision-maker; a game adds the fact that several decision-makers act in the same situation. Once
> players, actions, and payoffs are named, later lessons can talk precisely about dominance, best responses,
> equilibrium, and cooperation. The goal here is not to prove a theorem, but to learn how to turn an interdependent
> situation into a mathematical object.

**Motivation & Intuition (§2).**
> A game is a model of interdependent choice. It names the decision-makers, the actions each can take, and the payoff
> each receives after everyone acts. The important difference from ordinary optimization is that one player's result
> depends on what the other players do. A route can be fast if few drivers choose it and slow if many choose it; an ad
> bid can be profitable or wasteful depending on rival bids.
>
> The payoff table or payoff rule is the bookkeeping device that keeps these dependencies clear. First choose one
> action for each player. Those choices form an action profile. Then read the payoff attached to that whole profile,
> keeping the order of the players fixed. This habit lets every later comparison be made from a player's own point of
> view without losing track of how the outcome was produced.

**Definition & Assumptions (§3).** Explain-only: this lesson defines the modeling parts rather than proving a formula. Build the payoff lookup step by step: choose one action for each player, form the action profile, read the ordered payoff pair, and compare payoffs from the viewpoint of each player.

**Symbols.** $N$ players; $A_i$ player $i$'s action set; $a=(a_1,\dots,a_n)$ an action profile; $u_i(a)$ player $i$'s payoff.

**Real-World Applications (§5).**
1. **Ad placement auction:** two advertisers choose high/low bids; profile $(H,L)$ gives payoffs $(3,1)$, so advertiser 1 earns $2$ more.
2. **Recommendation ranking:** platform and creator choose promote/not; $(P,C)$ payoff $(5,4)$ has total welfare $9$.
3. **Self-driving merge:** car A yields and car B goes, payoff $(2,4)$, so B gains $2$ over A.
4. **Adversarial ML:** defender hardens and attacker probes, payoff $(1,-1)$ in zero-sum form sums to $0$.
5. **Data-sharing:** two firms share data, payoff $(6,6)$, total value $12$.
6. **Routing:** two drivers choose separate roads, payoff $(-20,-20)$ minutes; one shared congested road $(-35,-35)$ is $15$ worse per driver.

### `math-24-02` — Normal-form games  · explain-only

**Connections (§1).**
> This lesson turns the parts of a game into a compact table. After players, actions, and payoffs are named, the next
> useful step is to arrange simultaneous choices so every possible outcome can be inspected. Normal form is the format
> used for many early examples in game theory: prisoner's dilemma, coordination games, matching pennies, and small
> auction models. It prepares the reader to scan rows and columns for dominance, best responses, and Nash equilibria.

**Motivation & Intuition (§2).**
> A normal-form game puts simultaneous choices into a table. Rows are one player's actions, columns are the other
> player's actions, and each cell stores the payoff pair. The table makes the whole strategic situation visible at once,
> so the reader can compare what happens when one player changes action while the other player's action is held fixed.
>
> This representation is especially helpful because many strategic questions are local comparisons inside the table.
> Dominance checks compare entries across a row or column. Best-response checks look for the largest payoff against a
> fixed opponent action. A normal-form table is therefore not just a display; it is the workspace where equilibrium
> reasoning begins.

**Definition & Assumptions (§3).** Explain-only: normal form is a representation. Construct it by listing each player's actions, taking the Cartesian product of action sets, and filling one payoff vector per cell.

**Symbols.** Row player $R$; column player $C$; row action $r\in A_R$; column action $c\in A_C$; payoff cell $(u_R(r,c),u_C(r,c))$.

**Real-World Applications (§5).**
1. **Prisoner's dilemma table:** $(C,C)=(3,3)$ and $(D,D)=(1,1)$, so mutual cooperation adds $4$ total payoff over mutual defection.
2. **Ad auction:** low/high bid table has $2\times2=4$ cells to evaluate.
3. **Model release:** ship/delay crossed with approve/block gives $4$ policy outcomes.
4. **Routing:** two drivers with two routes each create $4$ congestion cells; $(A,B)$ gives travel times $(20,22)$, total $42$.
5. **Security patching:** patch/no-patch by two teams gives $4$ risk cells; both patch reduces expected loss from $10$ to $2$, a gain of $8$.
6. **Two-agent RL matrix game:** two actions per agent create a $2\times2$ reward matrix; average team reward in cells $8,5,5,2$ is $5$.

### `math-24-03` — Dominant strategies  · AUTHOR derivation

**Connections (§1).**
> Dominant strategies build directly on the payoff comparisons made in a normal-form table. Instead of trying to predict
> exactly what another player will do, the player checks whether one action wins against every possible opponent action.
> This is the cleanest kind of strategic recommendation because it does not depend on beliefs about the opponent.
> Dominance also prepares the ground for dominated-strategy deletion and for understanding why some equilibria are easy
> to find.

**Motivation & Intuition (§2).**
> A dominant strategy is best no matter what the other player does. It lets a player choose without first predicting the
> opponent. In a payoff table, that means one row or column gives a higher payoff in every relevant comparison for the
> player who owns it.
>
> The strength of the idea is also its limitation. A strictly dominant strategy is simple to justify, but many games do
> not have one. When it exists, the player can choose it using only the payoff table. When it does not, the player must
> move to weaker tools such as best responses, Nash equilibrium, or mixed strategies.

**Definition & Assumptions (§3).** For player $i$, action $a_i^*$ strictly dominates $a_i$ when $u_i(a_i^*,a_{-i})>u_i(a_i,a_{-i})$ for every $a_{-i}$. 1. Fix one possible opponent action $a_{-i}$ so payoffs are comparable in one column. 2. Compare $u_i(a_i^*,a_{-i})$ with $u_i(a_i,a_{-i})$. 3. Repeat for every opponent action, because dominance must not depend on the opponent's choice. 4. If every inequality points to $a_i^*$, then $a_i^*$ is always better. 5. If even one column fails, the strategy is not strictly dominant.

**Symbols.** $a_i^*$ candidate dominant action; $a_i$ alternative action; $a_{-i}$ all other players' actions; $u_i$ payoff to player $i$.

**Real-World Applications (§5).**
1. **Prisoner's dilemma:** defect pays $5$ vs $3$ if the other cooperates and $1$ vs $0$ if the other defects, so defect dominates by margins $2$ and $1$.
2. **Spam filtering:** strict filter payoff $4$ vs lenient $2$ under attack and $3$ vs $3$ under no attack gives weak dominance with gains $2$ and $0$.
3. **Reserve-price auction:** setting reserve $10$ beats reserve $0$ by $2$ revenue in high demand and ties in low demand, so it weakly dominates in the toy table.
4. **Adversarial training:** robust model payoff $7$ vs standard $5$ under attack and $6$ vs $6$ clean gives weak dominance.
5. **Routing with toll refund:** route A travel utility $-20$ vs route B $-25$ under light traffic and $-30$ vs $-40$ under heavy traffic, so A dominates by $5$ and $10$.
6. **Cache policy:** cache popular item payoff $9$ vs rare item $4$ when demand is popular and $2$ vs $1$ when demand is rare, so popular-item caching dominates.

### `math-24-04` — Dominated strategies  · AUTHOR derivation

**Connections (§1).**
> Dominated strategies are the other side of dominant-strategy reasoning. Instead of asking which action is always best,
> the player asks whether some action is never needed. This lesson uses the same payoff-table comparisons as dominance,
> but its practical purpose is simplification. Removing choices that rational players would avoid makes later equilibrium
> analysis smaller and clearer.

**Motivation & Intuition (§2).**
> A dominated strategy is never worth playing because another strategy does at least as well in every case and better in
> some case. The player does not need a detailed forecast of the opponent to reject it. If a replacement action is no
> worse against every opponent action, the tested action has no strategic advantage left.
>
> This idea is useful because games can have many actions, and not every listed action deserves equal attention. Deleting
> dominated actions keeps all rational possibilities while removing clutter. The weak version uses weak inequalities in
> every case and one strict improvement somewhere, so the replacement is at least as safe and sometimes better.

**Definition & Assumptions (§3).** Strategy $a_i$ is weakly dominated by $b_i$ if $u_i(b_i,a_{-i})\ge u_i(a_i,a_{-i})$ for every $a_{-i}$ and $>$ for at least one $a_{-i}$. 1. Choose the strategy to test, $a_i$. 2. Choose a candidate replacement, $b_i$. 3. Compare the two payoffs in each opponent column. 4. Require no column where $a_i$ beats $b_i$, because that would make $a_i$ useful. 5. Require at least one strict improvement, so the two strategies are not merely identical. 6. Mark $a_i$ dominated and remove it for rational-choice analysis.

**Symbols.** $a_i$ tested action; $b_i$ dominating action; weak inequality $\ge$ means no worse; strict inequality $>$ means better somewhere.

**Real-World Applications (§5).**
1. **Ad bidding:** bid $1$ has payoffs $(1,1)$ while bid $2$ has $(2,3)$ across two rival states, so bid $1$ is dominated by margins $1$ and $2$.
2. **Classifier threshold:** threshold $0.9$ gives utility $(4,2)$ and threshold $0.7$ gives $(5,2)$, so $0.9$ is weakly dominated.
3. **Routing:** road C takes $(30,45)$ minutes while road A takes $(25,40)$, so C is dominated by being $5$ minutes slower in both states.
4. **Security scans:** weekly scans catch $(7,5)$ risks and monthly scans catch $(4,5)$, so monthly is weakly dominated.
5. **Auction mechanism:** reserve $20$ revenue $(8,1)$ vs reserve $10$ revenue $(9,3)$, so reserve $20$ is dominated.
6. **RL action pruning:** action L yields rewards $(0,1,1)$ and action R yields $(1,1,2)$ across opponent actions, so L is weakly dominated with two strict gains.

### `math-24-05` — Iterated elimination  · AUTHOR derivation

**Connections (§1).**
> Iterated elimination extends the dominated-strategy test from one comparison to a repeated procedure. After one
> dominated row or column is removed, the remaining game may reveal new comparisons that were not available before.
> This lesson links local payoff inequalities to a larger method for simplifying games. It also builds intuition for why
> reasoning about rationality can proceed in rounds.

**Motivation & Intuition (§2).**
> Iterated elimination removes dominated strategies, then checks again because the smaller game can reveal new dominated
> choices. It is a disciplined way to simplify strategic reasoning. Each deletion says that a rational player would not
> need that action against the currently relevant opponent choices.
>
> The word "iterated" matters because dominance is evaluated relative to the action sets still under consideration. A
> strategy that is not dominated in the original game may become dominated after an opponent's unreasonable action is
> removed. If the process leaves a single action profile, the game has a sharp prediction from dominance alone.

**Definition & Assumptions (§3).** 1. Start with the full action sets so no rational option is excluded prematurely. 2. Find a dominated strategy for one player using the inequality test from `24-04`. 3. Remove that strategy and its row or column. 4. Recompute dominance in the reduced game, because comparisons only need to hold against remaining actions. 5. Continue until no dominated strategies remain. 6. If one action profile remains, it is the iterated-dominance prediction.

**Symbols.** $A_i^k$ player $i$'s remaining action set after round $k$; deleted strategies are not best responses to any remaining belief in the strict-dominance case.

**Real-World Applications (§5).**
1. **Three-bid auction:** remove bid $0$ dominated by bid $1$ with revenue gains $(1,1,1)$; then bid $3$ becomes dominated by bid $2$ in the reduced game.
2. **Security choices:** remove no-patch because patch beats it by $4$ under attack and ties clean; remaining hardening choice becomes clear.
3. **Routing:** road C is $5$ minutes slower than A in every remaining traffic state, so deleting C leaves a $2$-road game.
4. **Ad allocation:** creative X has CTR $(1,2)$ and creative Y $(2,3)$ across segments, so X is deleted before budget mixing.
5. **Opponent modeling:** an RL agent prunes action L after rewards $(0,1)$ lose to R's $(2,1)$, reducing a $3\times3$ game to $2\times3$.
6. **Procurement:** supplier C cost $(12,15)$ is dominated by supplier A cost $(10,13)$, saving $2$ in both demand states.

### `math-24-06` — Pure-strategy Nash equilibrium  · AUTHOR derivation

**Connections (§1).**
> Pure-strategy Nash equilibrium uses the best-response comparisons that have been appearing in payoff tables. Instead
> of looking for one action that is best against everything, it looks for a cell where each player's chosen action is best
> against the other player's chosen action. This makes equilibrium a mutual stability condition. It is the main bridge
> from dominance reasoning to the broader equilibrium ideas used in the rest of the section.

**Motivation & Intuition (§2).**
> A pure-strategy Nash equilibrium is a cell where every player is already choosing a best response. No one can improve
> by changing only their own action. The word "pure" means that each player chooses a single action rather than a
> probability distribution over actions.
>
> The key comparison is unilateral. To test a cell, hold the other player's action fixed and ask whether the current
> player can improve by switching. Then do the same for the other player. A cell is stable only when all players pass
> this test at the same time.

**Definition & Assumptions (§3).** 1. Fix column player's action $c$ and scan row payoffs in that column. 2. Mark the row action $r$ with the largest $u_R(r,c)$ as row's best response. 3. Fix row player's action $r$ and scan column payoffs in that row. 4. Mark the column action $c$ with the largest $u_C(r,c)$ as column's best response. 5. A cell $(r,c)$ is Nash exactly when both marks appear in the same cell. 6. If a player can switch and get a larger payoff, the cell is not Nash.

**Symbols.** $\operatorname{BR}_R(c)$ row's best response to $c$; $\operatorname{BR}_C(r)$ column's best response to $r$; pure strategy means one action, not a probability distribution.

**Real-World Applications (§5).**
1. **Coordination game:** $(A,A)$ pays $(2,2)$ and $(B,B)$ pays $(1,1)$; both diagonal cells are Nash because each action matches the other.
2. **Prisoner's dilemma:** $(D,D)$ is Nash since switching to cooperate changes row payoff $1\to0$ and column payoff $1\to0$.
3. **Ad channel choice:** both choose search gives $(4,4)$ and either switching alone gives $2$, so search/search is Nash.
4. **Routing equilibrium:** route A/A takes $30$ minutes each; a unilateral switch to B takes $35$, so A/A is stable by $5$ minutes.
5. **Security patching:** both patch payoff $(3,3)$; unilateral no-patch payoff $1$, so no player gains.
6. **Two-agent RL evaluation:** policy pair $(\pi_1,\pi_2)$ with rewards $(10,9)$ and unilateral alternatives $(8,7)$ and $(6,5)$ is a pure Nash under the tested policy set.

### `math-24-07` — Mixed strategies  · AUTHOR derivation

**Connections (§1).**
> Mixed strategies extend the strategy language from choosing one action to choosing probabilities over actions. This is
> a natural next step after pure Nash equilibrium because some games do not have a stable pure cell. The reader already
> knows expected value as a weighted average, and that is the main calculation needed here. Mixed strategies prepare for
> mixed Nash equilibrium, minimax games, and randomized policies in machine learning systems.

**Motivation & Intuition (§2).**
> A mixed strategy assigns probabilities to actions. Expected payoff is the weighted average of the payoffs from those
> actions. If a player chooses top with probability $p$ and bottom with probability $1-p$, then each possible payoff is
> counted in proportion to how often that action is used.
>
> Randomization can represent deliberate unpredictability, exploration, or population frequencies. The mathematics is the
> same in each case: multiply each cell payoff by the probability that the corresponding action profile occurs, then add
> the contributions. Once payoffs are written as expectations, equilibrium conditions can be solved with equations rather
> than only by scanning table cells.

**Definition & Assumptions (§3).** 1. Let row play top with probability $p$ and bottom with probability $1-p$, because probabilities across two actions must sum to $1$. 2. Against a fixed column action, multiply each row payoff by the probability of the row action that produces it. 3. Add the weighted payoffs to get expected payoff. 4. Against a mixed column player, multiply each cell payoff by the probability of that action profile. 5. Sum all cell contributions: $\mathbb E[u_R]=\sum_r\sum_c p_R(r)p_C(c)u_R(r,c)$.

**Symbols.** $p_R(r)$ probability row uses action $r$; $p_C(c)$ probability column uses action $c$; $\mathbb E[u_R]$ row's expected payoff.

**Real-World Applications (§5).**
1. **Matching pennies:** row heads probability $0.5$ against column heads $0.5$ gives expected payoff $0.25-0.25-0.25+0.25=0$.
2. **Ad creative rotation:** creative A payoff $6$ with probability $0.7$ and creative B payoff $2$ with probability $0.3$ gives expected payoff $4.8$.
3. **Security scanning:** scan deep with probability $0.2$ payoff $10$ and light with $0.8$ payoff $4$ gives expected payoff $5.2$.
4. **Exploration in RL:** action rewards $8$ and $2$ with probabilities $0.25$ and $0.75$ give expected reward $3.5$.
5. **Auction bid randomization:** bid high payoff $3$ with probability $0.4$ and low payoff $1$ with $0.6$ gives $1.8$.
6. **Recommendation diversification:** show niche item with probability $0.3$ payoff $5$ and popular item with $0.7$ payoff $3$ gives $3.6$.

### `math-24-09` — Existence of equilibria  · explain-only

**Connections (§1).**
> This lesson follows mixed strategies and mixed-strategy Nash equilibrium. After seeing that some games need
> randomization to become stable, the natural structural fact is that finite games always have at least one equilibrium
> once mixed strategies are allowed. The lesson does not prove the fixed-point theorem behind the result, but it explains
> the path from finite action sets to a stable probability profile. This guarantee supports the rest of the section,
> especially minimax games and multi-agent learning.

**Motivation & Intuition (§2).**
> Finite games may lack pure equilibria, but allowing mixed strategies guarantees at least one Nash equilibrium. The
> guarantee says a stable probability profile exists, not that it is easy to find or unique. Matching pennies is the
> simplest warning: no pure cell is stable, yet the mixed profile with each player randomizing evenly is stable.
>
> The reason the theorem becomes possible is that probability spaces are smoother than finite action lists. A player can
> move continuously from one mixture to another, and expected payoffs change continuously with those probabilities. The
> fixed-point result says that, under the right conditions, the best-response mapping must contain a profile that points
> back to itself. That self-consistent profile is a Nash equilibrium.

**Definition & Assumptions (§3).** Explain-only at this level: the full proof uses a fixed-point theorem. State the finite-game path plainly: mixed-strategy spaces are simplexes, expected payoffs are continuous, best-response correspondences have the right convexity properties, and a fixed point is a Nash equilibrium.

**Symbols.** $\Delta(A_i)$ is the simplex of probability distributions over player $i$'s finite actions; a fixed point is a strategy profile that maps back to itself under best response.

**Real-World Applications (§5).**
1. **Matching pennies:** no pure cell is stable, but the theorem guarantees the mixed equilibrium $(0.5,0.5)$.
2. **Rock-paper-scissors:** the equilibrium $(1/3,1/3,1/3)$ has value $0$.
3. **Adversarial testing:** two attack types and two defenses define a finite game, so at least one mixed defense equilibrium exists.
4. **Auction bidding grid:** a $5$-bid finite game has a mixed equilibrium over at most $5$ bids per bidder.
5. **MARL benchmark:** a $3\times3$ matrix game has at least one mixed Nash policy pair.
6. **Mechanism design toy model:** if each agent has $4$ reports, existence guarantees at least one equilibrium report distribution, though not truthfulness.

### `math-24-10` — Zero-sum games  · AUTHOR derivation

**Connections (§1).**
> Zero-sum games specialize the payoff language to direct conflict. The reader has already seen payoff pairs and mixed
> expected payoffs; here those payoffs are linked by a simple rule: one player's payoff is the negative of the other's.
> This makes the game easier to analyze with a single matrix. It also sets up the minimax theorem, robust optimization,
> adversarial training, and the GAN capstone.

**Motivation & Intuition (§2).**
> In a zero-sum game, one player's gain is the other player's loss. This makes the game a direct contest over a single
> payoff matrix. If the row player receives $A_{rc}$ in a cell, the column player receives $-A_{rc}$, so the two payoffs
> always sum to zero.
>
> The single-matrix view is powerful because both players are optimizing the same quantity in opposite directions. Row
> wants the expected value $p^TAq$ to be large, while column wants it to be small. That shared objective with opposite
> signs is what makes maximin, minimax, and saddle-point language fit so naturally.

**Definition & Assumptions (§3).** 1. Let $A_{rc}$ be row's payoff in cell $(r,c)$. 2. Since the game is zero-sum, column's payoff is $-A_{rc}$. 3. If row uses mixed strategy $p$ and column uses $q$, the probability of cell $(r,c)$ is $p_rq_c$. 4. Row's expected payoff is $p^TAq=\sum_r\sum_c p_rq_cA_{rc}$. 5. Column's expected payoff is $-p^TAq$. 6. The payoffs sum to $0$, which is the zero-sum condition.

**Symbols.** $A$ payoff matrix for row; $p$ row's mixed strategy; $q$ column's mixed strategy; $p^TAq$ expected value to row.

**Real-World Applications (§5).**
1. **Matching pennies:** equilibrium value $0$ means neither player has a long-run edge.
2. **Adversarial classification:** defender utility $0.75$ robust accuracy corresponds to attacker utility $-0.75$ in a zero-sum abstraction.
3. **Security allocation:** defender saves $8$ units of loss, attacker payoff is $-8$ in the contest model.
4. **Auction budget duel:** bidder A's surplus advantage $3$ is bidder B's relative loss $-3$.
5. **GAN idealization:** discriminator gain against the generator can be modeled as row value $v$ and generator value $-v$.
6. **Robust optimization:** minimizing worst-case loss $0.45$ is equivalent to an attacker maximizing loss to $0.45$.

### `math-24-11` — The minimax theorem  · AUTHOR derivation

**Connections (§1).**
> The minimax theorem is the central equilibrium result for finite zero-sum games. It uses mixed strategies, expected
> payoff, and the zero-sum matrix $A$ from the previous lessons. The theorem says that row's best safety guarantee and
> column's best cap on row's payoff meet at the same value. This result is the mathematical basis for many adversarial
> and robust-learning formulations.

**Motivation & Intuition (§2).**
> The minimax theorem says that, in finite zero-sum games with mixed strategies, row's best guaranteed payoff equals
> column's best upper bound on row's payoff. Maximin and minimax meet at the value of the game. Row chooses a mixture to
> make the worst column response as good as possible; column chooses a mixture to make row's best response as small as
> possible.
>
> In a two-action example, the calculation often works by equalizing the opponent's relevant payoffs. If row's mixture
> makes column's two pure responses give row the same expected payoff, column cannot lower the value by switching between
> them. If column's mixture makes row's two pure actions equally attractive, row cannot raise the value by switching.
> Where these equalizations agree, the game has its value.

**Definition & Assumptions (§3).** For $A=\begin{bmatrix}2&-1\\0&1\end{bmatrix}$: 1. Let row play top with probability $p$. 2. If column chooses left, row's expected payoff is $2p+0(1-p)=2p$. 3. If column chooses right, row's expected payoff is $-p+1(1-p)=1-2p$. 4. Row maximizes the worse of these two numbers, so set $2p=1-2p$. 5. Add $2p$ to get $4p=1$. 6. Divide by $4$ to get $p=1/4$. 7. The guaranteed value is $2p=1/2$. 8. Let column choose left with probability $q$. 9. Row top payoff is $2q-1(1-q)=3q-1$. 10. Row bottom payoff is $0q+1(1-q)=1-q$. 11. Set $3q-1=1-q$ to make row indifferent. 12. Solve $4q=2$, so $q=1/2$ and the value is $1/2$.

**Symbols.** $\max_p\min_q p^TAq$ row's best guarantee; $\min_q\max_p p^TAq$ column's best cap; $v$ game value.

**Real-World Applications (§5).**
1. **Toy security game:** with matrix above, row guarantees value $0.5$ by playing top $25\%$.
2. **Adversarial training:** model minimizes the maximum attack loss; reducing worst-case loss from $0.75$ to $0.45$ improves value by $0.30$.
3. **GAN training:** a saddle objective asks the generator to lower the discriminator's best response; the value is measured after the inner maximization.
4. **Penalty kicks:** equalizing the goalie's two dives at value $0.5$ prevents a worse guaranteed scoring rate.
5. **Robust bidding:** a bidder choosing a randomized bid with guaranteed surplus $0.5$ should not switch to a pure bid with worst case $-1$.
6. **MARL exploitability:** if a policy's worst-case payoff is $0.2$ but the minimax value is $0.5$, exploitability is $0.3$.

### `math-24-12` — Extensive-form games  · explain-only

**Connections (§1).**
> Extensive-form games add time and information to the game models introduced earlier. Normal form is useful for
> simultaneous choices, but many strategic situations unfold in stages. A tree can record who moves first, what each
> player observes, and where the final payoffs are assigned. This representation prepares the reader for backward
> induction and subgame perfection.

**Motivation & Intuition (§2).**
> Extensive form represents timing. A game tree records who moves, what actions are available, what each player observes,
> and which payoff arrives at each terminal node. Each path through the tree is a possible history of play, ending at a
> leaf with payoffs for the players.
>
> The tree matters because the order of moves can change the meaning of a strategy. A player may choose differently after
> seeing an earlier action, or may have to act without knowing exactly where in the tree they are. Decision nodes,
> branches, information sets, and terminal histories are the pieces that make this timing and information structure
> explicit.

**Definition & Assumptions (§3).** Explain-only: this is a representation rather than an identity. Build the tree by placing the initial node, adding action branches, assigning a player to each decision node, grouping indistinguishable nodes into information sets, and writing payoffs at leaves.

**Symbols.** Node; branch; terminal history $h$; information set; payoff $u_i(h)$ at a terminal history.

**Real-World Applications (§5).**
1. **Negotiation:** offer accept yields $(4,3)$; reject leads to $(1,1)$, so the accept leaf adds $5$ total payoff.
2. **Ad auction sequence:** platform sets reserve, bidder responds; two reserve choices and two responses create $4$ terminal leaves.
3. **RL episode:** state-action tree depth $3$ with two actions per step has $2^3=8$ action histories.
4. **Security inspection:** inspect first then attacker chooses attack/no-attack; inspection cost $2$ reduces defender payoff from $10$ to $8$ when no attack happens.
5. **Recommendation session:** show item A then user clicks/skips; two rounds with binary outcomes create $4$ click histories.
6. **Model deployment:** review then launch/hold; launch payoff $5$ after approval versus $-4$ after rejection shows timing matters by $9$.

### `math-24-13` — Backward induction  · AUTHOR derivation

**Connections (§1).**
> Backward induction is the solution method that fits finite perfect-information game trees. After extensive form has
> named nodes, branches, and terminal payoffs, the next step is to solve from the leaves back to the root. The method
> uses ordinary payoff maximization at each decision node. It is the foundation for sequential rationality and subgame
> perfection.

**Motivation & Intuition (§2).**
> Backward induction solves a finite perfect-information game from the end backward. At each last decision, the moving
> player chooses the best available continuation. Once that choice is made, the whole decision node can be replaced by
> the payoff that will result from rational play there.
>
> Working backward is reliable because earlier players should anticipate what later players will actually choose. A
> threat or promise that would not be optimal when reached should not be treated as a real continuation. By reducing the
> tree one layer at a time, backward induction turns a sequential game into a sequence of simpler choices.

**Definition & Assumptions (§3).** 1. Start at terminal decision nodes because their payoffs are known. 2. For each such node, choose the branch with the highest payoff for the player moving there. 3. Replace that node by the payoff of the chosen branch. 4. Move one step earlier in the tree. 5. Repeat the same maximization using the replaced continuation values. 6. Continue to the root; the remaining branch choices form the backward-induction outcome.

**Symbols.** Terminal payoff; continuation value; root; perfect information means the player knows the previous actions at each node.

**Real-World Applications (§5).**
1. **Ultimatum toy game:** responder accepts offer $2$ over reject $0$; proposer then keeps $8$ and offers $2$.
2. **Entry deterrence:** incumbent accommodates payoff $3$ over fights payoff $-1$ after entry, so entrant enters if entry payoff is $2$.
3. **Sequential ad pricing:** buyer buys at price $4$ value $6$, surplus $2$; seller chooses price $4$ over price $7$ if $7$ causes no sale.
4. **Security patch timing:** attacker does not attack patched system payoff $-1$ vs attack $-5$, so defender's patch value is computed from no-attack continuation.
5. **Planning in RL:** depth-2 action values $5$ and $3$ at the child make the parent value $5$.
6. **Negotiation deadline:** final accept payoff $1$ beats reject $0$, so earlier offers can be evaluated against continuation value $1$.

### `math-24-14` — Subgame perfection  · AUTHOR derivation

**Connections (§1).**
> Subgame perfection refines Nash equilibrium for dynamic games. A Nash equilibrium can describe stable behavior at the
> start while relying on threats that would not be optimal later. Extensive-form games and backward induction provide the
> tools to test those later histories directly. This lesson turns credibility into a formal equilibrium requirement.

**Motivation & Intuition (§2).**
> Subgame perfection strengthens Nash equilibrium by requiring credible optimal behavior after every history that starts
> a proper subgame. It removes threats that a player would not actually carry out. In a sequential game, the plan must be
> stable not only from the root, but also from each subgame that could be reached.
>
> The test is local but demanding. Restrict the proposed strategies to one subgame and ask whether they form a Nash
> equilibrium inside that subgame. Then repeat for every subgame. A profile that fails anywhere is not sequentially
> credible, even if no player wants to deviate at the very beginning.

**Definition & Assumptions (§3).** 1. Identify every subgame: a decision node that contains all later nodes and does not cut an information set. 2. For a proposed strategy profile, restrict the strategies to one subgame. 3. Check whether that restricted profile is a Nash equilibrium of the subgame. 4. Repeat for every subgame. 5. If all subgames pass, the profile is subgame perfect. 6. If one subgame fails, the full profile relies on noncredible play and is not subgame perfect.

**Symbols.** Subgame; strategy profile $s$; restriction $s|_G$ to subgame $G$; credible threat.

**Real-World Applications (§5).**
1. **Entry deterrence:** threat to fight gives incumbent $-1$ while accommodate gives $3$, so fight is not credible and the profile fails subgame perfection.
2. **Bargaining:** rejecting a final offer of $2$ for payoff $0$ is not sequentially rational, so the threat is removed.
3. **Platform moderation:** threatening permanent ban with payoff $-5$ when warning gives $1$ is not credible in that subgame.
4. **RL hierarchical policy:** a high-level plan is credible only if the low-level policy maximizes each reached subtask value, such as $7$ over $4$.
5. **Auction after reserve:** if the seller would accept bid $10$ over outside option $8$, a threat to reject $10$ is not subgame perfect.
6. **Security response:** after detection, isolating server payoff $6$ beats doing nothing $-3$, so any plan requiring no isolation fails.

### `math-24-15` — Repeated games  · AUTHOR derivation

**Connections (§1).**
> Repeated games add a future to the strategic situations studied earlier. A one-shot prisoner's dilemma makes defection
> attractive in the current round, but repetition lets later rewards and punishments affect today's choice. This lesson
> connects Nash reasoning to incentives over time. It also gives a first exact threshold calculation using a discount
> factor.

**Motivation & Intuition (§2).**
> Repetition changes incentives because today's action affects tomorrow's punishment or reward. Cooperation can be stable
> when the future is valuable enough. If a player defects now, the immediate temptation payoff may be high, but future
> punishment can erase that gain.
>
> The discount factor $\delta$ measures how much the next period matters compared with the current one. Grim trigger is a
> simple strategy: cooperate unless someone defects, and after a defection punish forever. The stability calculation
> compares the present value of cooperating forever with the present value of defecting once and then receiving the
> punishment payoff.

**Definition & Assumptions (§3).** For grim trigger in a repeated prisoner's dilemma with temptation $T=5$, cooperation payoff $R=3$, and punishment payoff $P=1$: 1. Cooperating forever gives $R+\delta R+\delta^2R+\cdots=R/(1-\delta)$. 2. Defecting once then being punished gives $T+\delta P+\delta^2P+\cdots=T+\delta P/(1-\delta)$. 3. Cooperation is stable when $R/(1-\delta)\ge T+\delta P/(1-\delta)$. 4. Multiply by $1-\delta$ to get $R\ge T(1-\delta)+\delta P$. 5. Expand to $R\ge T-\delta T+\delta P$. 6. Rearrange to $\delta(T-P)\ge T-R$. 7. Divide by $T-P$ to get $\delta\ge (T-R)/(T-P)=2/4=0.5$.

**Symbols.** $\delta$ discount factor; $T$ temptation payoff; $R$ mutual cooperation payoff; $P$ punishment payoff.

**Real-World Applications (§5).**
1. **Prisoner's dilemma:** with $T=5,R=3,P=1$, cooperation is sustainable when $\delta\ge0.5$.
2. **Seller reputation:** cheating gains $2$ now but loses future margin $4$ per period; threshold is $2/4=0.5$.
3. **Ad exchange quality:** short-term spam gain $6$ versus cooperative margin $4$ and punishment $0$ gives threshold $(6-4)/(6-0)=1/3$.
4. **Multi-agent self-play:** if defection reward is $5$ and cooperative reward is $3$, agents with $\delta=0.9$ pass the $0.5$ cooperation threshold.
5. **API rate limits:** overuse gain $10$ now and future ban loss $25$ is deterred when $\delta\ge10/25=0.4$.
6. **Repeated auctions:** bid shading gain $1$ with future punishment loss $3$ requires $\delta\ge1/3$ to deter shading.

### `math-24-16` — Bayesian games  · AUTHOR derivation

**Connections (§1).**
> Bayesian games extend strategic reasoning to private information. Earlier lessons assumed that the payoff table or game
> tree was commonly known, but many situations involve hidden types such as cost, value, quality, or intent. The player
> must choose an action using beliefs about those types. This lesson prepares for auctions, screening, signaling, and
> mechanism-design examples.

**Motivation & Intuition (§2).**
> A Bayesian game adds private information. Players choose actions using beliefs about types, not just beliefs about
> actions. A type is a piece of private information that affects payoffs or available choices, such as a bidder's value or
> a firm's cost.
>
> The main calculation is expected payoff over unknown types. A strategy must say what each type would do, because a high
> type and a low type may rationally choose different actions. Bayesian Nash equilibrium then requires every type's
> assigned action to be optimal given beliefs and the other players' type-contingent strategies.

**Definition & Assumptions (§3).** 1. Let player $i$ have type $t_i$, such as high cost or low cost. 2. Assign a prior probability $P(t_i)$ before actions are chosen. 3. A strategy maps each type to an action, because different types may choose differently. 4. Compute expected payoff by averaging over unknown types: $\mathbb E[u_i(a,t)]=\sum_tP(t)u_i(a,t)$. 5. A Bayesian Nash equilibrium requires each type's chosen action to maximize this expected payoff given beliefs and other type-contingent strategies.

**Symbols.** Type $t_i$; prior $P(t)$; belief; type-contingent strategy $s_i(t_i)$; Bayesian Nash equilibrium.

**Real-World Applications (§5).**
1. **Investment under private quality:** high type probability $0.3$, payoff $10$ if high and $-5$ if low gives expected payoff $-0.5$, so do not invest.
2. **Auction bidding:** bidder value $100$ with probability $0.4$ and $40$ with probability $0.6$ gives expected value $64$.
3. **Ad fraud detection:** fraud probability $0.2$, loss $-20$, clean gain $5$ gives expected payoff $0.8(5)+0.2(-20)=0$.
4. **Personalized pricing:** high willingness type probability $0.25$ and margin $12$ gives expected high-price margin $3$ before churn costs.
5. **MARL hidden roles:** teammate is cooperative with probability $0.7$ payoff $8$ and adversarial with probability $0.3$ payoff $-4$, expected payoff $4.4$.
6. **Mechanism design:** truthful report by a low-cost type pays $6$ and lying pays $4$, so incentive margin is $2$ for that type.

### `math-24-17` — Cooperative games and the core  · AUTHOR derivation

**Connections (§1).**
> Cooperative games shift attention from individual action profiles to coalitions. Instead of asking which actions form an
> equilibrium, the model asks what groups can achieve together and how the resulting value can be divided. This connects
> game theory to bargaining, cost sharing, data consortia, and allocation problems. The core is the stability concept
> that keeps coalitions from wanting to leave.

**Motivation & Intuition (§2).**
> Cooperative games study what coalitions can achieve and how a total value can be divided. The core contains allocations
> that no coalition can improve on by leaving. An allocation must first distribute the grand coalition's total value, so
> nothing is lost or overpaid at the full-group level.
>
> Stability then requires every smaller coalition to receive at least what it could make on its own. If a group of
> players is assigned less than its standalone value, those players have a blocking deviation: they can leave and do
> better together. The core is the set of allocations that survive all such coalition checks.

**Definition & Assumptions (§3).** 1. Let $v(S)$ be the value coalition $S$ can make alone. 2. An allocation $x$ assigns payoff $x_i$ to each player. 3. Efficiency requires $\sum_{i\in N}x_i=v(N)$, because the grand coalition's value is fully distributed. 4. Coalition rationality requires $\sum_{i\in S}x_i\ge v(S)$ for every coalition $S$. 5. If a coalition violates this inequality, its members can leave and make more than their assigned total. 6. The core is the set of allocations satisfying all these inequalities.

**Symbols.** $N$ grand coalition; $S\subseteq N$ coalition; $v(S)$ coalition value; $x_i$ player $i$'s allocation; core.

**Real-World Applications (§5).**
1. **Data consortium:** $v(ABC)=100$, allocation $(40,35,25)$ is efficient because totals $100$.
2. **Coalition check:** if $v(AB)=70$, then $x_A+x_B=75$ blocks no deviation by AB.
3. **Feature-sharing:** if $v(AC)=60$, allocation gives $65$, surplus $5$ above the coalition's outside option.
4. **Compute cluster sharing:** if team B+C can produce value $55$ and receives $60$, it stays by margin $5$.
5. **Ride-sharing cost core:** if three-person cost is $30$ and pair AB can ride for $18$, cost shares for AB must be at most $18$; shares $9+8=17$ pass by $1$.
6. **Open-source funding:** if firms A+C value maintenance at $220k$ and receive $230k$ of benefit, the coalition has $10k$ slack.

### `math-24-18` — Evolutionary game theory  · AUTHOR derivation

**Connections (§1).**
> Evolutionary game theory changes the interpretation of strategies from deliberate choices by one player to shares in a
> population. The payoff comparisons are still game-theoretic, but the outcome is a dynamic process rather than a single
> equilibrium cell. Strategies that earn above-average payoff tend to spread. This connects game theory to biology,
> cultural learning, traffic adaptation, and population-based reinforcement learning.

**Motivation & Intuition (§2).**
> Evolutionary game theory tracks how strategy shares change when better-performing strategies spread. It replaces
> one-shot rational choice with population dynamics. If a strategy's payoff is above the population average, its share
> grows; if its payoff is below average, its share shrinks.
>
> The replicator equation turns that idea into a rate of change. The growth term has two parts: the current share of the
> strategy and its payoff advantage over average. Evolutionary stability adds a related invasion test: a resident strategy
> is stable if small groups of mutants do worse and therefore cannot grow.

**Definition & Assumptions (§3).** 1. Let $x_i$ be the population share using strategy $i$. 2. The payoff to strategy $i$ in population state $x$ is $(Ax)_i$. 3. The average population payoff is $x^TAx$. 4. The relative advantage of strategy $i$ is $(Ax)_i-x^TAx$. 5. Proportional growth multiplies that advantage by current share, giving $\dot x_i=x_i((Ax)_i-x^TAx)$. 6. For an evolutionarily stable strategy $s$, compare a small mutant share $\epsilon$ of strategy $t$ against mostly residents. 7. The resident payoff is $(1-\epsilon)u(s,s)+\epsilon u(s,t)$. 8. The mutant payoff is $(1-\epsilon)u(t,s)+\epsilon u(t,t)$. 9. For every small positive $\epsilon$, require resident payoff $>$ mutant payoff so mutants shrink. 10. As $\epsilon\to0$, the first test is $u(s,s)>u(t,s)$. 11. If the first terms tie, compare the $\epsilon$ terms, giving the second test $u(s,t)>u(t,t)$. 12. For Hawk-Dove with $u_H=2-4x$ and $u_D=1-x$, an interior rest point requires equal payoffs. 13. Set $2-4x=1-x$. 14. Add $4x$ to get $2=1+3x$. 15. Subtract $1$ to get $1=3x$. 16. Divide by $3$ to get $x=1/3$.

**Symbols.** $x_i$ strategy share; $A$ payoff matrix; $(Ax)_i$ strategy payoff; $x^TAx$ average payoff; $\dot x_i$ time derivative of share; $s$ resident strategy; $t$ mutant strategy; $\epsilon$ mutant share.

**Real-World Applications (§5).**
1. **Biological competition:** trait share $0.3$, fitness $1.2$, average $1.0$ gives growth $0.3(0.2)=0.06$.
2. **Cultural imitation:** norm share $0.4$, payoff $7$, average $5$ gives growth pressure $0.8$.
3. **Population-based RL:** policy share $0.25$, reward $120$, average $100$ gives update term $5$ before scaling.
4. **Traffic route choice:** route payoff advantage $5$ at share $0.2$ gives growth term $1.0$.
5. **Algorithm selection:** score $0.84$ versus average $0.80$ at share $0.2$ gives update $0.008$.
6. **ESS check:** if $u(s,s)=4$ and $u(t,s)=3$, resident $s$ passes the first ESS test by margin $1$.

### `math-24-19` — Correlated equilibrium  · AUTHOR derivation

**Connections (§1).**
> Correlated equilibrium extends Nash equilibrium by allowing players to condition their actions on private
> recommendations from a mediator. The players still make their own decisions, but their actions can be coordinated
> through signals. This concept sits between noncooperative equilibrium and mechanism design. It is useful whenever a
> shared recommendation can reduce collisions, congestion, or duplicated work.

**Motivation & Intuition (§2).**
> Correlated equilibrium allows a mediator to recommend actions. It is stable when every player wants to follow the
> recommendation after learning only their own signal. The player does not observe the full recommended action profile;
> the player only knows the recommendation they received.
>
> The obedience condition is the main idea. Conditional on receiving a recommendation, compare the expected payoff from
> obeying with the expected payoff from switching to another action. If obeying is at least as good for every player,
> every recommendation, and every deviation, the mediator's distribution is a correlated equilibrium.

**Definition & Assumptions (§3).** 1. Let $\pi(a)$ be the probability that the mediator recommends action profile $a$. 2. Condition on player $i$ receiving recommendation $r$, because that is the information the player has. 3. Compute the expected payoff from obeying: $\mathbb E[u_i(r,a_{-i})\mid a_i=r]$. 4. Compute the expected payoff from deviating to $d$: $\mathbb E[u_i(d,a_{-i})\mid a_i=r]$. 5. Require obeying payoff to be at least deviating payoff for every player, recommendation, and deviation. 6. In Battle of the Sexes with recommendations $(A,A)$ and $(B,B)$ each probability $0.5$, recommendation $A$ tells each player the other also got $A$, so obeying pays row $2$ and deviating pays $0$; recommendation $B$ gives row $1$ and deviation $0$. Both inequalities hold.

**Symbols.** $\pi(a)$ mediator distribution; $r$ recommended action; $d$ deviation; $a_{-i}$ others' recommended actions; obedience inequality.

**Real-World Applications (§5).**
1. **Traffic routing:** if following a split recommendation gives $20$ minutes and deviating to the same route gives $35$, obedience saves $15$ minutes.
2. **Wireless channels:** different channels give $10$ Mbps each and same channel $3$ Mbps, so obeying gains $7$ Mbps.
3. **Robot task assignment:** map/carry reward $12$ versus duplicate-map reward $5$ gives obedience gain $7$.
4. **Load balancing:** separate servers finish in $4$ seconds and same server in $9$, so following saves $5$ seconds.
5. **Recommendation platforms:** distinct audience segments give $1000$ impressions each while overlap gives $600$ each, so correlation adds $800$ total impressions.
6. **Mechanism design:** if obeying pays $1.2$ and deviating pays $1.0$, the obedience slack is $0.2$.

### `math-24-20` — GANs as minimax; multi-agent RL  · AUTHOR derivation · ML capstone

**Connections (§1).**
> This capstone brings the section's game-theory language into machine learning. Mixed strategies, best responses,
> zero-sum objectives, and minimax reasoning all appear when models are trained against other models or adaptive
> opponents. GANs provide the clearest mathematical example because one network improves by making another network's
> discrimination task harder. The same vocabulary also helps describe adversarial robustness, self-play, and multi-agent
> reinforcement learning.

**Motivation & Intuition (§2).**
> Game-theoretic ML has objectives that move because another learner is moving too. GANs, adversarial training,
> self-play, and multi-agent RL all require equilibrium and best-response language. A model is not optimizing against a
> fixed environment; it is often optimizing against another process that adapts in response.
>
> In a GAN, the discriminator tries to separate real samples from generated samples, while the generator tries to make
> generated samples harder to separate. If the generator distribution matches the data distribution, the discriminator's
> best local output is $1/2$. That value means the discriminator has no label advantage at that point, which is the same
> indifference idea that appeared in mixed equilibrium and minimax games.

**Definition & Assumptions (§3).** For the GAN value $\min_G\max_D\;\mathbb E_{x\sim p_{data}}\log D(x)+\mathbb E_{x\sim p_G}\log(1-D(x))$: 1. Fix $G$, so $p_G$ is fixed while optimizing $D$. 2. At one point $x$, write the contribution as $a\log D+b\log(1-D)$ with $a=p_{data}(x)$ and $b=p_G(x)$. 3. Differentiate with respect to $D$: $a/D-b/(1-D)$. 4. Set the derivative to zero because an interior maximum has slope $0$. 5. Move terms to get $a/D=b/(1-D)$. 6. Cross-multiply to get $a(1-D)=bD$. 7. Expand to $a-aD=bD$. 8. Add $aD$ to get $a=(a+b)D$. 9. Divide by $a+b$ to get $D^*(x)=a/(a+b)=p_{data}(x)/(p_{data}(x)+p_G(x))$. 10. If $p_G=p_{data}$, then $D^*(x)=1/2$.

**Symbols.** $G$ generator; $D$ discriminator; $p_{data}$ data distribution; $p_G$ generator distribution; $z$ noise; minimax means one side minimizes the value the other maximizes.

**Real-World Applications (§5).**
1. **GAN discriminator objective:** real outputs $0.8,0.7,0.6,0.9$ and fake outputs $0.3,0.4,0.2,0.5$ give average log objective $-0.3725$.
2. **Ideal discriminator:** if $p_{data}(x)=p_G(x)$, then $D^*(x)=1/2$, so the discriminator has no local label advantage.
3. **Adversarial robustness:** worst-case loss drops from $0.75$ to $0.45$, improving the minimax objective by $0.30$.
4. **Self-play promotion:** a new policy winning $56$ of $100$ games has estimated win rate $0.56$, passing a $0.55$ gate by $0.01$.
5. **Opponent nonstationarity:** reward falling from $8$ against opponent v1 to $3$ against v2 is a $5$-point strategic shift.
6. **Population evaluation:** win rates $0.7,0.6,0.5,0.4,0.3$ average to $0.5$, showing no net edge over the opponent population.

---

## Build order for this section

1. **Start with the model entry `24-08`.** It fixes the voice, solves matching pennies by indifference, and sets the mixed-equilibrium notation used later.
2. **Author the static-game core:** `24-01…24-07`, then `24-09…24-11`. This establishes payoff tables, dominance, Nash, mixing, zero-sum value, and minimax.
3. **Author dynamic and information games:** `24-12…24-16`, keeping extensive-form representation explain-only but deriving backward induction, subgame perfection, repeated-game thresholds, and Bayesian expected payoffs.
4. **Author coalition and population lessons:** `24-17…24-19`, with core inequalities, replicator/ESS arithmetic, and correlated-equilibrium obedience constraints.
5. **Finish with the ML capstone `24-20`.** Connect the minimax language to GANs, adversarial training, self-play, and multi-agent RL with the discriminator optimum derived step by step.
