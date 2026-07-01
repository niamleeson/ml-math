# Part 23 — Game Theory & Multi-Agent Systems

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant family: F16 (Algorithmic-Instance).

### 23.1 — Normal-form games & Nash equilibrium   [notebook: 23.1-normal-form-nash.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Ads bidding agents — use a 2-bidder payoff table to check unilateral deviations; illustrative: (C,C) total payoff 6 vs Nash (D,D) payoff 2 mirrors the lesson's PD numbers.
2. Cybersecurity defense — attacker/defender mixed strategies; lesson matrix gives indifference at q=1/3 and both row actions earn 0.666667.
3. Marketplace pricing — competing sellers choose price moves; illustrative 2x2 table must mark best responses, not max total payoff.
4. A/B allocation with reactive competitors — equilibrium audit uses u_R(p,q)=p^T A q; lesson matching-pennies p=q=(0.5,0.5) yields expected payoff 0.
5. Autonomous driving merges — stable policies are no-unilateral-improvement profiles; illustrative safe/aggressive 2x2 can reproduce D best response when 5>3 and 1>0.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `find_pure_nash(A,B)` plus `mixed_indifference_2x2(A)`; verify prisoner's dilemma best responses give only (D,D) with (1,1), and lesson mixed matrix gives q=0.333333, action value 0.666667.
- Datasets D1–D5: games/profiles of rising size/conflict — D1 2x2 prisoner's dilemma solved by hand · D2 2x2 coordination/anti-coordination set · D3 matching pennies with no pure equilibrium and cycling best responses · D4 random 3x3 bimatrix games with ties · D5 hardest mixed-equilibrium-only or tie-heavy 4x4 game.
- Metric: equilibrium found / max unilateral deviation gain (regret) across all rungs.
- Closing viz: (a) payoff-matrix panels per instance with best-response marks (b) max-deviation-or-equilibrium-count-vs-size curve.
- Pitfall on D5: calling the best total-payoff cell an equilibrium; reproduce by selecting social optimum, then fix by unilateral-deviation checks and tie-aware supports.
- Notes: delete dead template helpers; CPU-only, pure Python/NumPy.

### 23.2 — Extensive-form & sequential games   [notebook: 23.2-sequential-games.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Market entry deterrence — backward induction removes non-credible Fight because incumbent payoff 1 for Accommodate is greater than -1 for Fight.
2. Negotiation and bargaining — future concessions are solved from terminal payoffs first; illustrative tree compares offer value 2 against outside option 0.
3. Security screening — imperfect-information decisions use belief-weighted payoffs; lesson Left value 1.8 beats Right value 1.4.
4. Product rollout commitments — credible continuation probability changes launch choice; lesson V(Enter)=2p, so p=0.5 gives 1.0.
5. Sequential ads auctions — bidding rules form a game tree; illustrative off-path tie rule must be specified for every unreached node.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `backward_induction(tree)` and `belief_weighted_choice(info_set)`; verify entry game path Enter→Accommodate with payoffs (2,1), and information set Left 1.8 > Right 1.4.
- Datasets D1–D5: games/profiles of rising size/conflict — D1 tiny entry game · D2 two-stage bargaining tree · D3 tree with off-path threats and one information set · D4 deeper 3-player sequential tree · D5 hardest imperfect-information tree with multiple non-credible threats.
- Metric: subgame-perfect action found / total continuation value across all rungs.
- Closing viz: (a) game-tree panels with backed-up values per instance (b) solved-value-or-credible-threats-removed-vs-tree-size curve.
- Pitfall on D5: keeping non-credible threats; reproduce a Nash profile held by a harmful threat, then fix with subgame-perfect backward induction.
- Notes: delete dead template helpers; CPU-only, pure Python/NumPy.

### 23.3 — Cooperative game theory   [notebook: 23.3-cooperative-games.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Model feature attribution — Shapley averages marginal contributions; lesson 3-player game gives phi_A=2.5, phi_B=2.5, phi_C=1.0.
2. Data valuation — vendors are coalitions with v(S); lesson grand value 6 is exhausted by 2.5+2.5+1.0=6.
3. Multi-team reward sharing — coalition AB receives 5.0 under Shapley, exceeding v(AB)=4 in the lesson's core check.
4. Cloud cost allocation — dummy resources should receive only their marginal add-on; lesson dummy D adds exactly 1 and gets phi_D=1.0.
5. Multi-agent task credit — illustrative 4-agent coalition table must compute all 4! arrival orders or sample them with error bars.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `shapley_values(v, players)` and `core_violations(allocation,v)`; verify lesson game returns (2.5,2.5,1.0), efficiency 6.0, and AB allocation 5.0 >= 4.
- Datasets D1–D5: games/profiles of rising size/conflict — D1 3-player lesson characteristic function · D2 4-player additive game with a dummy · D3 synergy/redundancy coalitions · D4 6-player sampled coalition game · D5 hardest unstable game with empty-core-like coalition complaints.
- Metric: allocation efficiency gap and worst coalition deficit across all rungs.
- Closing viz: (a) coalition-value/Shapley bar panels per instance (b) worst-deficit-or-efficiency-gap-vs-player-count curve.
- Pitfall on D5: confusing Shapley value with the core; reproduce efficient Shapley allocation with a blocking coalition, then fix by reporting core deficits separately.
- Notes: delete dead template helpers; CPU-only, pure Python/NumPy.

### 23.4 — Mechanism design & auctions   [notebook: 23.4-auctions.ipynb]   (family: F16, gap)

**Lesson — Real World Applications (5):**
1. Search/display ad auctions — second-price payment is set by the next bid; lesson bids (10,7,4) give winner A paying 7 and utility 3.
2. Marketplace procurement — truthful bidding check: value 10 with opponents 7 and 4 earns 3 when bidding 10 or 13, but 0 when bidding 6.
3. First-price programmatic ads — bid shading appears because bidder pays own bid; lesson value 10, bid 8 earns 2 while truthful 10 earns 0.
4. Reserve-price design — lesson reserve r=8 raises revenue to 8, while r=11 makes revenue 0 when no bid clears.
5. Cloud resource allocation — illustrative 4-bidder single-item auction must specify deterministic tie-breaking before incentive claims.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `second_price_auction(bids, reserve=0, tie_rule)` and `first_price_utility(value,bid)`; verify bids (10,7,4) produce winner A, price 7, utility 3, and reserves 0→7, 8→8, 11→0.
- Datasets D1–D5: games/profiles of rising size/conflict — D1 3-bidder lesson auction · D2 5-bidder second-price auction · D3 first-price shaded bids and reserves · D4 many bidders/items with tie cases · D5 hardest strategic manipulation / reserve too high / mixed shading simulation.
- Metric: truthful-surplus or revenue across all rungs.
- Closing viz: (a) bid/payment panels per instance (b) revenue-or-surplus-vs-bidder-count/reserve curve.
- Pitfall on D5: assuming truthfulness in first-price auctions; reproduce truthful bid giving utility 0 vs shaded bid 8 giving utility 2, then fix by switching to second-price or modeling shading explicitly.
- Notes: delete dead template helpers; CPU-only, pure Python/NumPy; gap note: lesson flagged gap, so implementation should preserve current numbers and may need author review before final publishing.

### 23.5 — Social choice & voting   [notebook: 23.5-social-choice-voting.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Ensemble model voting — plurality can tie while Borda picks a winner; lesson five ballots give plurality A=2,B=1,C=2 and Borda B=6.
2. RLHF preference aggregation — pairwise majority can cycle; lesson has A beats B 2-1, B beats C 2-1, C beats A 2-1.
3. Committee decisions — agenda order determines outcome in a cycle; lesson agendas can elect C, A, or B depending on first pair.
4. Product ranking surveys — Borda uses lower ranks; lesson scores A=5, B=6, C=4 from the same five rankings.
5. Strategic voting audits — one changed ballot from (A,B,C) to (B,A,C) changes plurality counts from 1-1-1 to A=0,B=2,C=1.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `plurality`, `borda`, `pairwise_matrix`, and `agenda_winner`; verify lesson five-ballot profile gives plurality A/C tie, Borda B=6, and Condorcet cycle margins 2-1.
- Datasets D1–D5: games/profiles of rising size/conflict — D1 3-voter Condorcet profile solved by hand · D2 five-ballot plurality-vs-Borda lesson profile · D3 agenda-dependent cycle · D4 many voters/candidates with ties · D5 hardest strategic manipulation / tie-breaking profile.
- Metric: winner plus social welfare/Borda score across all rungs.
- Closing viz: (a) preference-profile and pairwise-margin panels per instance (b) winner-stability-or-welfare-vs-voter/candidate-count curve.
- Pitfall on D5: Condorcet cycle and strategic voting; reproduce agenda/tie manipulation, then fix by explicitly declaring rule, tie-break, and agenda.
- Notes: delete dead template helpers; CPU-only, pure Python/NumPy.

### 23.6 — Markov / stochastic games   [notebook: 23.6-stochastic-games.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Multi-agent traffic control — joint actions change transitions; lesson fixed-policy backup with r=(1,0), P=[[0.8,0.2],[0.3,0.7]], gamma=0.9 starts V0=1, V1=0.
2. Self-play game agents — stage-game best response depends on opponent policy; lesson q=0.25 gives action values 0.5 and 0.75.
3. Repeated ad bidding — patient agents value future state control; lesson V(s0) rises from 1.087719 at gamma=0.1 to 60.792079 at gamma=0.99.
4. Decentralized robotics — illustrative two-robot grid state uses joint action (a1,a2), not a single-agent max.
5. Inventory/market simulations — lesson convergence values V(s0)=6.727000 and V(s1)=4.909000 show discounted long-run occupancy effects.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `policy_evaluation(P,r,gamma)` and `stage_best_response(A,q)`; verify first backup (1,0), converged V≈(6.727,4.909), discount values, and action 1 best response at q=0.25.
- Datasets D1–D5: games/profiles of rising size/conflict — D1 two-state fixed-policy lesson chain · D2 two-state two-action stochastic game · D3 changing opponent policy causing nonstationarity · D4 many states/joint actions · D5 hardest high-gamma strategic-coupling instance.
- Metric: value error / best-response regret across all rungs.
- Closing viz: (a) state-transition/value panels per instance (b) value-error-or-regret-vs-state/action-size curve.
- Pitfall on D5: using an MDP max where a stage-game equilibrium is needed; reproduce wrong single-agent backup, then fix with joint-policy/stage-game best response and discount sensitivity.
- Notes: delete dead template helpers; CPU-only, pure Python/NumPy.

### 23.7 — Multi-agent coordination & communication   [notebook: 23.7-coordination-communication.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Decentralized robot teaming — shared signal coordinates Stag/Hare; lesson public signal payoff 3.5 vs independent random payoff 1.75.
2. Network protocol conventions — agents choose same standard when belief q exceeds threshold 0.428571 from 4q=3(1-q).
3. Human-AI collaboration — communication is useful as correlation; lesson gain from shared correlation is 3.5-1.75=1.75.
4. Sensor fusion teams — noisy messages reduce matching; lesson a=0.8 gives P(match)=0.68, while a=0.5 gives 0.5.
5. Multi-agent RL conventions — illustrative 4-agent coordination game tracks match rate, not individual action accuracy.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `coordination_payoff(q)` and `signal_policy(a)`; verify threshold q=0.428571, public-signal expected payoff 3.5 vs independent 1.75, and noisy match probability 0.68 at a=0.8.
- Datasets D1–D5: games/profiles of rising size/conflict — D1 2x2 Stag/Hare coordination game · D2 public signal recommendations · D3 noisy/private messages · D4 many agents with shared convention · D5 hardest asymmetric/noisy communication profile.
- Metric: coordination rate / expected payoff across all rungs.
- Closing viz: (a) payoff-matrix and signal-recommendation panels per instance (b) coordination-rate-or-payoff-vs-agent/message-noise curve.
- Pitfall on D5: ignoring message noise; reproduce broken correlated strategy when agents receive different signals, then fix by modeling a and measuring P(match)=a^2+(1-a)^2.
- Notes: delete dead template helpers; CPU-only, pure Python/NumPy.

### 23.8 — Regret minimization & CFR   [notebook: 23.8-regret-cfr.ipynb]   (family: F16)

**Lesson — Real World Applications (5):**
1. Poker-style imperfect-information solvers — CFR uses local counterfactual regrets; lesson reach 0.25 and values (2,-1) give regrets +0.375 and -0.375.
2. Online ad allocation — external regret compares to best fixed action; lesson four-round sequence has algorithm payoff 0 and regret 0.
3. Self-play stabilization — average strategies matter when current policies cycle; illustrative matching-pennies self-play tracks average policy near (0.5,0.5).
4. Routing/load balancing — regret matching probabilities come from cumulative regrets; lesson [3,1] gives probabilities 0.75 and 0.25.
5. Adaptive pricing — avoid last-round chasing; illustrative 100-round price game reports cumulative regret, not one-step win/loss.

**Notebook plan:**
- Family: F16 Algorithmic-Instance
- Concept built once (D1): implement `external_regret(payoffs, actions)`, `regret_matching(regrets)`, and one information-set `counterfactual_regret`; verify lesson four-round regret 0, regrets [3,1] -> (0.75,0.25), and reach-weighted regrets ±0.375.
- Datasets D1–D5: games/profiles of rising size/conflict — D1 four-round lesson payoff table · D2 repeated matching pennies · D3 adversarial payoff sequence causing cycling current policy · D4 small imperfect-information tree with multiple information sets · D5 hardest CFR instance requiring average strategy and reach weights.
- Metric: average external regret / exploitability proxy across all rungs.
- Closing viz: (a) payoff/regret-table or information-set panels per instance (b) average-regret-or-exploitability-vs-rounds/tree-size curve.
- Pitfall on D5: dropping counterfactual reach weights and forgetting average strategies; reproduce mis-scaled local regrets, then fix with reach factor and average-policy reporting.
- Notes: delete dead template helpers; CPU-only, pure Python/NumPy.
