/* All ML — Part 11 applications (5 each). Loaded after content-part-11.js, before all-ml-register.js. */

/* ---- _apps-part11-A.js ---- */
(window.ALLML_CONTENT["11.1"] = window.ALLML_CONTENT["11.1"] || {}).applications = [
  { title: "Robot navigation", background: "<p>A mobile robot repeatedly chooses among feasible moves, observes the next state, and receives a task reward. RL framing is the bookkeeping that separates the action taken now from the delayed consequence of that action.</p>", numbers: "<p>If a route gives rewards $[1,0,2]$ with $\\gamma=0.9$, then $G=1+0.9\\cdot0+0.9^2\\cdot2=2.620$. The final reward contributes $1.620$, so the robot should not optimize only the first reward.</p>" },
  { title: "Ad pacing", background: "<p>A bid changes the remaining-budget state, so the platform needs an agent-environment loop rather than a one-shot prediction. Each budget state gets a value entry under the lesson notation.</p>", numbers: "<p>With illustrative $|S|=3$ budget states and $|A|=2$ bid actions, a value table has $3$ entries while an action-value table has $3\\times2=6$ entries.</p>" },
  { title: "Game AI tutorials", background: "<p>Simple games are useful RL examples because a win can arrive many steps after the move that made it possible. Return $G$ is the object that assigns credit across the episode.</p>", numbers: "<p>For an illustrative 10-step episode ending with reward $2$, the undiscounted win is $2$, but with $\\gamma=0.9$ and no earlier rewards it contributes $0.9^9\\cdot2=0.775$ to the start return.</p>" },
  { title: "Recommender session ranking", background: "<p>A session recommender chooses the next item while the user's state keeps changing. RL framing makes the policy probability $\\pi(a\\mid s)$ explicit.</p>", numbers: "<p>If logits are $[1,0]$, then $\\pi(a_0)=2.718/(2.718+1.000)=0.731$. With rewards $[2,0]$, the expected immediate reward is $0.731\\cdot2=1.462$.</p>" },
  { title: "Warehouse routing", background: "<p>A warehouse robot has a policy distribution over feasible moves at each location. The lesson's framing keeps the action probability separate from the transition caused by that action.</p>", numbers: "<p>For 4 feasible moves, a deterministic policy stores one probability vector such as $[0,1,0,0]$; a uniform no-skill policy stores $[0.25,0.25,0.25,0.25]$.</p>" },
];

(window.ALLML_CONTENT["11.2"] = window.ALLML_CONTENT["11.2"] || {}).applications = [
  { title: "Inventory replenishment", background: "<p>An inventory system is naturally an MDP: stock level is state, order quantity is action, demand creates transitions, and holding or shortage cost is reward.</p>", numbers: "<p>With illustrative 3 stock states and 2 order actions, $V$ has $3$ values and $Q$ has $3\\times2=6$ action values. That shape check prevents mixing state and action tables.</p>" },
  { title: "Ride-share dispatch", background: "<p>Dispatch chooses where to send a driver while uncertain demand moves the driver to a next zone. The transition term $P(s'\\mid s,a)$ captures that uncertainty.</p>", numbers: "<p>If action $a$ sends a driver to zone A with probability $0.7$ and zone B with probability $0.3$, then the Bellman expectation weights both downstream values by $0.7$ and $0.3$.</p>" },
  { title: "Treatment planning", background: "<p>Sequential treatment decisions balance immediate side effects with delayed health outcomes. The discount $0\\le\\gamma\\lt1$ controls that tradeoff.</p>", numbers: "<p>For illustrative outcomes $[1,0,2]$ and $\\gamma=0.9$, the discounted return is $2.620$; lowering $\\gamma$ to $0.7$ changes it to $1+0+0.49\\cdot2=1.980$.</p>" },
  { title: "Web navigation", background: "<p>A website can model pages as states and link choices as actions. The MDP makes next-page probabilities and rewards auditable.</p>", numbers: "<p>For $|S|=5$ pages, $V$ has 5 entries. If each page has 3 candidate links, $Q$ has $5\\times3=15$ entries.</p>" },
  { title: "Data-center scheduling", background: "<p>A scheduler moves jobs among machines, queues, and power states. Writing the MDP tuple exposes whether a policy uses the model or just immediate utilization.</p>", numbers: "<p>If the observed reward is $1$, $V(s')=0.8$, and $\\gamma=0.9$, the one-step target is $1+0.9\\cdot0.8=1.720$.</p>" },
];

(window.ALLML_CONTENT["11.3"] = window.ALLML_CONTENT["11.3"] || {}).applications = [
  { title: "Delivery routing", background: "<p>Bellman equations let a routing system compare one-step travel cost plus the value of the remaining trip. This is why a local backup can reason about a long route.</p>", numbers: "<p>If immediate reward is $1$ and the next-state value is $0.8$, then $R+\\gamma V(s')=1+0.9\\cdot0.8=1.720$.</p>" },
  { title: "Chess endgames", background: "<p>Endgame tables use backups over legal moves: a move is valuable when it leads to positions with high downstream value. Bellman thinking compresses many future plies into a local recurrence.</p>", numbers: "<p>With illustrative action values $Q(s,a_0)=1.72$ and $Q(s,a_1)=1.20$, an optimal Bellman backup chooses $\\max(1.72,1.20)=1.72$.</p>" },
  { title: "Traffic signal timing", background: "<p>A traffic controller must average over uncertain next queues after a signal choice. The sum over $P(s'\\mid s,a)$ is the explicit averaging step.</p>", numbers: "<p>If two next queues have probabilities $0.6$ and $0.4$ with targets $1.0$ and $0.5$, the expected backup contribution is $0.6\\cdot1.0+0.4\\cdot0.5=0.800$.</p>" },
  { title: "Pricing control", background: "<p>A pricing system compares action values for several price choices, not just a single state value. Bellman backups fill the $|S|\\times|A|$ table used for comparison.</p>", numbers: "<p>For 4 demand states and 3 price actions, the action-value table has $4\\times3=12$ entries; the selected price is the action with the largest backed-up entry.</p>" },
  { title: "Energy storage", background: "<p>A battery controller trades current discharge reward against future stored energy. Discounting with $0\\le\\gamma\\lt1$ encodes the long-versus-short horizon choice.</p>", numbers: "<p>With rewards $[1,0,2]$ and $\\gamma=0.9$, the delayed value term is $1.620$ and total return is $2.620$.</p>" },
];

(window.ALLML_CONTENT["11.4"] = window.ALLML_CONTENT["11.4"] || {}).applications = [
  { title: "Fleet repositioning", background: "<p>When a fleet operator has a known transition model for demand movement, dynamic programming can sweep exact backups through all zones before acting.</p>", numbers: "<p>For illustrative 4 zones and 3 reposition actions, value iteration compares $4\\times3=12$ backed-up action values per sweep.</p>" },
  { title: "Elevator control", background: "<p>Elevator dispatch has known physics and approximate arrival models, so DP can compare candidate actions by expected downstream value.</p>", numbers: "<p>If one action target is $1.720$ and the current estimate is $0.4$, an update with $\\alpha=0.5$ moves to $0.4+0.5(1.720-0.4)=1.060$.</p>" },
  { title: "Grid robot planning", background: "<p>Small grid robots are canonical DP examples because every cell can be backed up from its neighbors. The policy stores one selected action for each nonterminal state.</p>", numbers: "<p>In a 4 by 4 grid there are $16$ cells, so a state-value table has up to $16$ entries and a four-action $Q$ table has up to $16\\times4=64$ entries.</p>" },
  { title: "Manufacturing control", background: "<p>A manufacturing controller can plan from a known machine-state model. Bellman backups combine production reward, failure risk, and discounted future state value.</p>", numbers: "<p>With $R=1$, $V(s')=0.8$, and $\\gamma=0.9$, the backup target is $1.720$, the same arithmetic used by the lesson's one-step target.</p>" },
  { title: "Reservoir management", background: "<p>Reservoir operation balances today's water release against future storage. DP is appropriate when transition dynamics and reward rules are small enough to enumerate.</p>", numbers: "<p>For rewards $[1,0,2]$, changing $\\gamma$ from $0.9$ to $0.7$ changes return from $2.620$ to $1.980$, showing the horizon sensitivity.</p>" },
];

(window.ALLML_CONTENT["11.5"] = window.ALLML_CONTENT["11.5"] || {}).applications = [
  { title: "Board-game rollouts", background: "<p>Monte Carlo evaluation waits until a sampled game ends, then uses the realized outcome to update visited states. No model of every transition is required.</p>", numbers: "<p>For an illustrative 10 sampled episodes with returns summing to $26.2$, the MC estimate is $26.2/10=2.620$.</p>" },
  { title: "Online education paths", background: "<p>Learner sessions have delayed outcomes such as completion or mastery. Monte Carlo methods use complete session returns, matching the lesson pitfall about not confusing reward with return.</p>", numbers: "<p>If a session's rewards are $[1,0,2]$ and $\\gamma=0.9$, the update target for first-visit MC is the realized $G=2.620$.</p>" },
  { title: "Ad campaign sequences", background: "<p>A campaign can be evaluated from realized sequences of budget, bid, and conversion outcomes. MC averages discounted returns across completed trajectories.</p>", numbers: "<p>With old estimate $0$ and first observed return $2.620$, the incremental average is $0+(2.620-0)/1=2.620$.</p>" },
  { title: "Simulator evaluation", background: "<p>When a simulator can generate complete episodes, MC can estimate a value for each state even without writing down every transition probability.</p>", numbers: "<p>For $|S|=5$ simulator states, MC stores 5 value estimates plus 5 visit counts; each first visit updates one value with its sampled return.</p>" },
  { title: "Treatment episodes", background: "<p>Clinical pathways may end before outcomes are fully known, but completed historical episodes can still train MC estimates when action support is sufficient.</p>", numbers: "<p>With 3 states and 2 treatments, action-value MC needs $3\\times2=6$ visit counters; unvisited treatment choices have no reliable estimate.</p>" },
];

(window.ALLML_CONTENT["11.6"] = window.ALLML_CONTENT["11.6"] || {}).applications = [
  { title: "Robot patrol", background: "<p>A patrol robot benefits from updating after each transition rather than waiting for the whole route. TD learning uses the next state's current value estimate as a bootstrap.</p>", numbers: "<p>With reward $1$, next value $0.8$, and $\\gamma=0.9$, the TD target is $1.720$; with old value $0.4$ and $\\alpha=0.5$, the update is $1.060$.</p>" },
  { title: "Web session optimization", background: "<p>Web sessions can be long or interrupted, so updating before the session ends is valuable. TD learns from partial experience using $r+\\gamma V(s')$.</p>", numbers: "<p>For an illustrative 5-step trajectory, TD can make 5 one-step updates, while a first-visit MC method waits until the final return is known.</p>" },
  { title: "Traffic control", background: "<p>Signals receive queue feedback at every cycle. TD can update the value of a signal state immediately after observing the next queue state.</p>", numbers: "<p>If $V(s')=0.8$, $r=1$, and $\\gamma=0.9$, the bootstrap target is $1.720$; the target changes as $V(s')$ changes.</p>" },
  { title: "Game score prediction", background: "<p>Score prediction during a game is a natural TD task because the prediction should improve before the game ends. The discount controls how much future score matters.</p>", numbers: "<p>For rewards $[1,0,2]$, the discounted return at $\\gamma=0.9$ is $2.620$, but TD approximates that target one transition at a time.</p>" },
  { title: "Queue management", background: "<p>A queueing controller updates value estimates after each service or arrival event. The lesson's shape rule keeps the state-value table separate from action values.</p>", numbers: "<p>With $|S|=4$ queue states, TD state-value learning stores 4 values; if 3 routing actions are added, a TD action-value table stores $4\\times3=12$ entries.</p>" },
];

/* ---- _apps-part11-B.js ---- */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};
window.ALLML_CONTENT["11.7"] = window.ALLML_CONTENT["11.7"] || {};
(window.ALLML_CONTENT["11.7"] = window.ALLML_CONTENT["11.7"] || {}).applications = [
  { title: "Long hallway robots", background: "<p>A patrol robot may receive a reward only when it reaches the charging alcove, but the useful decision happened several hallway states earlier. Eligibility traces keep a decaying memory of the recently visited states.</p>", numbers: "<p>With illustrative $\\gamma=0.9$ and $\\lambda=0.8$, a TD error one step later reaches the previous state with weight $0.9\\cdot0.8=0.720$. On a 5-state path, the state two steps back receives weight $0.720^2=0.518$.</p>" },
  { title: "Game combo scoring", background: "<p>In games, a combo bonus often arrives after several setup moves. TD($\\lambda$) spreads the surprise backward through the setup sequence instead of waiting for many full episodes.</p>", numbers: "<p>Using the lesson return, rewards $[1,0,2]$ with $\\gamma=0.9$ give $G=1+0.9\\cdot0+0.9^2\\cdot2=2.620$. A trace with illustrative $\\lambda=0.8$ assigns the oldest setup move $0.720^2=0.518$ of the current TD error.</p>" },
  { title: "Recommendation sessions", background: "<p>A recommender may observe a purchase after a short trail of clicks. Traces assign more credit to recent clicks while still allowing older clicks to receive some signal.</p>", numbers: "<p>For 3 illustrative clicks and $\\gamma\\lambda=0.720$, the most recent, previous, and oldest clicks get relative weights $1.000$, $0.720$, and $0.518$. The total trace mass is $2.238$ before normalization.</p>" },
  { title: "Traffic corridors", background: "<p>A green wave on a road corridor can produce a delayed improvement several intersections downstream. Eligibility traces let that delayed TD error update the preceding signal states.</p>", numbers: "<p>If the downstream reward is 2 two decisions later, the lesson discount gives $0.9^2\\cdot2=1.620$. With $\\lambda=0.8$, the two-step trace multiplier is $0.518$, so the backed-up error is intentionally smaller.</p>" },
  { title: "Process control", background: "<p>Industrial control systems often keep a compact value table for discrete modes. Eligibility traces add a same-shaped memory table rather than changing the value-table shape.</p>", numbers: "<p>For $|S|=5$ modes, $V$ has 5 entries and the trace vector also has 5 entries. A mismatched $|S|+1=6$ trace would corrupt the backup, while a valid trace can apply $Q_{new}=0.4+0.5(1.720-0.4)=1.060$ to the right entry.</p>" }
];
window.ALLML_CONTENT["11.8"] = window.ALLML_CONTENT["11.8"] || {};
(window.ALLML_CONTENT["11.8"] = window.ALLML_CONTENT["11.8"] || {}).applications = [
  { title: "Safety-aware driving simulation", background: "<p>SARSA is useful when the behavior policy includes exploration that must be valued honestly, such as a simulator that sometimes tries cautious and risky maneuvers.</p>", numbers: "<p>With two illustrative actions, if the actually sampled next action has $Q(s',a')=0.8$, the SARSA target is $1+0.9\\cdot0.8=1.720$. From $Q_{old}=0.4$ and $\\alpha=0.5$, the update is $1.060$.</p>" },
  { title: "Robot cliff navigation", background: "<p>In cliff-style navigation, exploration can step near danger. SARSA learns the value of the exploratory policy itself, so risky exploratory moves remain visible in the target.</p>", numbers: "<p>If the grid has $|S|=16$ states and 4 actions, the action-value table has $16\\times4=64$ entries. SARSA updates exactly one entry from $(s,a,r,s',a')$ on each transition.</p>" },
  { title: "Tutoring hint policy", background: "<p>An online tutor may deliberately explore different hints. SARSA evaluates the deployed hint behavior, not a hypothetical greedy hint sequence that students never saw.</p>", numbers: "<p>If the next exploratory hint has estimated value $0.2$ instead of the greedy hint value $0.8$, the on-policy target is $1+0.9\\cdot0.2=1.180$, not $1.720$.</p>" },
  { title: "Inventory trials", background: "<p>A retailer testing reorder actions learns from the actual follow-up action sampled by the behavior policy. SARSA therefore matches staged experimentation.</p>", numbers: "<p>For illustrative behavior probabilities $\\pi(a_0\\mid s)=0.731$ and $\\pi(a_1\\mid s)=0.269$, SARSA samples $a'$ from that distribution and updates toward the sampled action value.</p>" },
  { title: "Game bot training", background: "<p>A game bot that keeps exploring during training should learn the return of that exploratory bot. SARSA's target includes the next exploratory action.</p>", numbers: "<p>The lesson discount example gives $G=1+0.9\\cdot0+0.9^2\\cdot2=2.620$. SARSA uses the same $0\\le\\gamma\\lt1$ discount inside each one-step target.</p>" }
];
window.ALLML_CONTENT["11.9"] = window.ALLML_CONTENT["11.9"] || {};
(window.ALLML_CONTENT["11.9"] = window.ALLML_CONTENT["11.9"] || {}).applications = [
  { title: "Game AI exploration", background: "<p>Q-learning lets a game agent explore with noisy controls while learning the greedy policy it would like to deploy later.</p>", numbers: "<p>With two illustrative next actions valued $0.8$ and $0.2$, the off-policy target uses $\\max Q=0.8$, so $y=1+0.9\\cdot0.8=1.720$ and $Q_{new}=1.060$ from the lesson step size.</p>" },
  { title: "Ad bidding simulator", background: "<p>A bidding simulator may sample exploratory bids to learn about the auction landscape, while the target policy chooses the best estimated next bid.</p>", numbers: "<p>If behavior samples bid 1 but the best next estimate is bid 0 with value $0.8$, Q-learning still targets $1+0.9\\cdot0.8=1.720$ because the target is greedy.</p>" },
  { title: "Warehouse robot routing", background: "<p>A warehouse robot needs action values for motion choices at each location. Q-learning updates the table while the robot explores alternative paths.</p>", numbers: "<p>For an illustrative grid with $|S|=36$ cells and 4 actions, $Q$ has $36\\times4=144$ entries. Each transition updates one state-action entry toward the best next action.</p>" },
  { title: "Traffic control exploration", background: "<p>Traffic controllers may use rare exploratory phases to learn better signal timing. Q-learning requires enough support for actions that the greedy policy may later choose.</p>", numbers: "<p>With $\\epsilon=0.2$ and 4 actions, each non-greedy action receives illustrative probability $0.2/4=0.050$ under a simple epsilon-greedy sampler, creating policy support.</p>" },
  { title: "Energy arbitrage", background: "<p>A battery controller explores charge and discharge actions but learns the greedy long-run value of energy decisions under future prices.</p>", numbers: "<p>A reward two periods away is discounted by $0.9^2=0.810$. Thus a future payoff of 2 contributes $1.620$ to the target calculation, matching the lesson return.</p>" }
];
window.ALLML_CONTENT["11.10"] = window.ALLML_CONTENT["11.10"] || {};
(window.ALLML_CONTENT["11.10"] = window.ALLML_CONTENT["11.10"] || {}).applications = [
  { title: "Large grid navigation", background: "<p>When a grid is too large for a separate value per state, coordinate and tile features let nearby states share evidence.</p>", numbers: "<p>Two illustrative normalized features, row and column, replace many table entries. In D5 with 36 states, a 4-feature linear value model stores 4 weights instead of 36 values.</p>" },
  { title: "Recommender control", background: "<p>A recommender can approximate long-run value from user-session features rather than storing a value for every possible session state.</p>", numbers: "<p>If a feature vector predicts $V(s')=0.8$, the bootstrap target remains $1+0.9\\cdot0.8=1.720$. With prediction $0.4$ and $\\alpha=0.5$ on a one-hot feature, the updated weight is $1.060$.</p>" },
  { title: "Robotic arm bins", background: "<p>A robot arm can use state-action features such as bin position and gripper load instead of a full action table for every configuration.</p>", numbers: "<p>A tabular setup with $|S|=1000$ and 4 actions needs $4000$ Q entries. A 20-feature linear state-action model stores 20 weights per action or 80 action-specific weights.</p>" },
  { title: "Dispatch forecasting", background: "<p>Dispatch systems can approximate the value of a vehicle location using regional features. The learning rule is still a Bellman-style bootstrap.</p>", numbers: "<p>For observed reward 1 and next estimate 0.8, the target is $1.720$. The feature update moves weights by $\\alpha(1.720-\\hat V(s))x(s)$.</p>" },
  { title: "Game agents", background: "<p>Before deep networks, many game agents used hand-built features for distance, score, and threat. Function approximation shared learning across similar board positions.</p>", numbers: "<p>The lesson's $0\\le\\gamma\\lt1$ discount applies unchanged: rewards $[1,0,2]$ give $G=2.620$ at $\\gamma=0.9$, even when $V$ is computed from features.</p>" }
];
window.ALLML_CONTENT["11.11"] = window.ALLML_CONTENT["11.11"] || {};
(window.ALLML_CONTENT["11.11"] = window.ALLML_CONTENT["11.11"] || {}).applications = [
  { title: "Atari-style control", background: "<p>DQN was popularized by using a neural approximator for action values in games. The notebook uses a tiny NumPy network to show the same update math without heavy training.</p>", numbers: "<p>With 4 illustrative actions and next values $[0.8,0.2,0.1,-0.1]$, the DQN target is $1+0.9\\cdot0.8=1.720$. The scalar squared-error half-loss from $Q=0.4$ is $0.5(0.4-1.720)^2=0.8712$.</p>" },
  { title: "Robotics from pixels", background: "<p>A robot can map sensory features to one Q value per action instead of maintaining a table over all visual states.</p>", numbers: "<p>If a compact network outputs 4 Q values, it replaces a table whose size would be $|S|\\times4$. For even $|S|=10000$, that table would require 40000 action values.</p>" },
  { title: "Recommendation slate control", background: "<p>Replay buffers help delayed reward learning by reusing older transitions rather than learning only from the latest correlated session.</p>", numbers: "<p>An illustrative replay buffer of 100 transitions can provide mini-batches of 8. One new transition can therefore be mixed with 7 older transitions, reducing correlation in the update.</p>" },
  { title: "Traffic signal control", background: "<p>DQN can approximate signal-control values from traffic features and train on Bellman targets computed from observed rewards.</p>", numbers: "<p>The target still has the lesson form $r+\\gamma\\max_aQ(s',a)$. With $r=1$, $\\gamma=0.9$, and $\\max Q=0.8$, the numeric target is $1.720$.</p>" },
  { title: "Game tutorials", background: "<p>Target networks make the bootstrapped target change more slowly, which helps teach why DQN is more than just Q-learning plus a neural net.</p>", numbers: "<p>If the online network updates every step but the target network copies every 10 illustrative episodes, the target is held fixed across 9 intervening episodes, reducing moving-target feedback.</p>" }
];
window.ALLML_CONTENT["11.12"] = window.ALLML_CONTENT["11.12"] || {};
(window.ALLML_CONTENT["11.12"] = window.ALLML_CONTENT["11.12"] || {}).applications = [
  { title: "Game control", background: "<p>Double DQN reduces over-estimation by selecting the next action with the online network and evaluating it with the target network.</p>", numbers: "<p>With online next values $[0.8,0.7]$ and target next values $[0.6,1.2]$, vanilla max gives $1+0.9\\cdot1.2=2.080$, while Double DQN selects action 0 and gives $1+0.9\\cdot0.6=1.540$.</p>" },
  { title: "Robot navigation", background: "<p>Dueling networks separate state value from action advantages, which helps when many actions have similar consequences in a state.</p>", numbers: "<p>For illustrative $V=0.5$ and advantages $[0.2,-0.2]$, the mean advantage is 0, so dueling Q values are $[0.7,0.3]$. The output shape is still one Q value per action.</p>" },
  { title: "Recommender replay", background: "<p>Prioritized replay samples transitions with larger TD errors more often, which is useful when only a few sessions contain strong learning signals.</p>", numbers: "<p>For 100 illustrative transitions, the top 20 percent rule selects 20 high-priority items. If priorities are absolute TD errors, a transition with error 2.0 outranks one with error 0.2.</p>" },
  { title: "Traffic control variant stack", background: "<p>Traffic control has bootstrapping, noisy rewards, and repeated states. Double targets, replay, and dueling heads address different parts of that instability.</p>", numbers: "<p>The lesson target still uses $0\\le\\gamma\\lt1$. At $\\gamma=0.9$, lowering an overestimated next value from 1.2 to 0.6 lowers the target by $0.9\\cdot(1.2-0.6)=0.540$.</p>" },
  { title: "Sparse-reward games", background: "<p>Rainbow-style stacks combine several DQN repairs for environments where rewards are rare and bootstrapped estimates can be noisy.</p>", numbers: "<p>A delayed reward of 2 two steps later contributes $0.9^2\\cdot2=1.620$. Prioritized replay can repeatedly sample the rare transition carrying that delayed signal.</p>" }
];

/* ---- _apps-part11-C.js ---- */
(window.ALLML_CONTENT["11.13"] = window.ALLML_CONTENT["11.13"] || {}).applications = [
  { title: "Risk-aware robotics", background: "<p>Robots may have two actions with the same average score but very different tail risk. Distributional RL keeps $Z(s,a)$ so the controller can see spread, not only $Q$.</p>", numbers: "<p>Illustrative returns $[1,0,2]$ with $\gamma=0.9$ give $G=1+0.9\cdot0+0.9^2\cdot2=2.620$. A risk check can compare that return distribution before choosing an arm motion.</p>" },
  { title: "Finance execution", background: "<p>Execution agents care about downside quantiles because a rare bad fill can dominate a trade. QR-DQN-style quantiles make those tails explicit.</p>", numbers: "<p>With five illustrative quantiles $[-1,0,1,2,3]$, the mean is $1.000$, but the 20th percentile is $-1.000$. A scalar $Q=1.000$ hides the downside quantile.</p>" },
  { title: "Game AI", background: "<p>Two game strategies can share an expected return while one is safe and the other is boom-or-bust. Distributional RL preserves that difference for exploration and risk selection.</p>", numbers: "<p>Policy A returns $[1,1]$ and policy B returns $[0,2]$; both average to $1.000$. The spread is $0.000$ for A and $1.000$ for B, so $Z(s,a)$ separates them.</p>" },
  { title: "Autonomous driving simulation", background: "<p>Driving simulators penalize rare crashes heavily. A high expected value is not enough if a small part of the return distribution is catastrophic.</p>", numbers: "<p>If a maneuver returns $2$ with probability $0.95$ and $-20$ with probability $0.05$, the mean is $0.95\cdot2+0.05\cdot(-20)=0.900$, while the bad atom remains visible.</p>" },
  { title: "Inventory control", background: "<p>Inventory actions trigger delayed stochastic demand, so the return is random after the first reward. The lesson backup $Z(s,a)\stackrel{D}{=}R+\gamma Z(s',a')$ matches this setting.</p>", numbers: "<p>If immediate margin is $1$ and future outcomes are $0$ or $2$ with equal probability, discounted atoms are $1+0.9\cdot0=1.000$ and $1+0.9\cdot2=2.800$.</p>" }
];

(window.ALLML_CONTENT["11.14"] = window.ALLML_CONTENT["11.14"] || {}).applications = [
  { title: "Dialogue policy selection", background: "<p>A dialogue system chooses among responses and reinforces choices that lead to successful conversations. REINFORCE updates the log-probability of sampled actions.</p>", numbers: "<p>With logits $[1,0]$, probabilities are $0.731$ and $0.269$. If the chosen response receives advantage $A=2.620$, the logit-gradient component for action 0 is $(1-0.731)\cdot2.620=0.705$.</p>" },
  { title: "Robot grasp choices", background: "<p>A grasping robot can keep a stochastic policy over several grasps instead of committing early to one action. Sampling exposes which grasp earns higher delayed reward.</p>", numbers: "<p>For three illustrative grasp probabilities $[0.50,0.30,0.20]$ and returns $[2,1,0]$, expected return is $0.50\cdot2+0.30\cdot1+0.20\cdot0=1.300$.</p>" },
  { title: "Game control", background: "<p>Policy gradients are useful when a game action changes the future states the learner sees. The complete episode return weights every sampled action.</p>", numbers: "<p>The lesson return for rewards $[1,0,2]$ at $\gamma=0.9$ is $2.620$. Using only the first reward would weight the update by $1.000$ and under-credit the delayed goal by $1.620$.</p>" },
  { title: "Ad bidding policy", background: "<p>A bidding agent can optimize policy parameters directly instead of filling a table for every possible auction context. This is helpful when actions are sampled from a live stochastic policy.</p>", numbers: "<p>If action probability rises from $0.269$ to $0.350$ for a bid with illustrative advantage $2.620$, the probability mass increase is $0.081$ and the weighted signal is $0.081\cdot2.620=0.212$.</p>" },
  { title: "Treatment policies", background: "<p>Sequential treatment policies can subtract a baseline so noisy patient outcomes do not dominate the gradient. The baseline keeps the expected gradient direction but lowers variance.</p>", numbers: "<p>If $G=2.620$ and a baseline is $1.000$, then $A=1.620$. The same log-probability gradient is weighted by $1.620$ instead of $2.620$.</p>" }
];

(window.ALLML_CONTENT["11.15"] = window.ALLML_CONTENT["11.15"] || {}).applications = [
  { title: "Game agents", background: "<p>Actor-critic agents split action selection from value estimation. The actor stores $\pi(a\mid s)$ while the critic stores $V(s)$, matching the lesson distinction between policy and value shapes.</p>", numbers: "<p>With reward $1$, next value $0.8$, and $\gamma=0.9$, the critic target is $1+0.9\cdot0.8=1.720$. If the old value is $0.4$, the TD error advantage is $1.320$.</p>" },
  { title: "Robot control", background: "<p>A robot controller can use a critic to reduce policy-gradient variance while the actor continues to choose actions. The critic supplies an advantage rather than a raw return.</p>", numbers: "<p>Using $\alpha=0.5$, the critic update from $0.4$ toward target $1.720$ is $0.4+0.5(1.720-0.4)=1.060$, exactly the lesson update.</p>" },
  { title: "Traffic signals", background: "<p>Traffic-light policies choose among signal phases, while a critic estimates congestion value. The actor update increases probabilities for phases with positive TD error.</p>", numbers: "<p>If a phase has probability $0.731$ and TD error $1.320$, the selected-action softmax gradient magnitude is $(1-0.731)\cdot1.320=0.355$.</p>" },
  { title: "Recommender sequencing", background: "<p>A recommender can improve a sequence policy while bootstrapping from estimated future engagement. The critic handles $r+\gamma V(s')$ so the actor does not wait for full returns only.</p>", numbers: "<p>For immediate engagement reward $1$ and next estimate $0.8$, the bootstrapped target $1.720$ is lower than an undiscounted $1+0.8=1.800$, reflecting $\gamma=0.9$.</p>" },
  { title: "Operations scheduling", background: "<p>Scheduling agents often choose among a small set of actions at each state. Actor logits define the action distribution and the critic scores how good the state is.</p>", numbers: "<p>For four illustrative logits with softmax probabilities $[0.40,0.30,0.20,0.10]$, a positive advantage $1.320$ on action 0 produces selected-action signal $(1-0.40)\cdot1.320=0.792$.</p>" }
];

(window.ALLML_CONTENT["11.16"] = window.ALLML_CONTENT["11.16"] || {}).applications = [
  { title: "Robot locomotion", background: "<p>Locomotion rollouts are noisy, so GAE tunes the bias-variance tradeoff with $\lambda$. A common illustrative setting is $\lambda=0.95$.</p>", numbers: "<p>With $\gamma=0.9$ and $\lambda=0.95$, the next residual weight is $\gamma\lambda=0.855$. The two-step weight is $0.855^2=0.731$.</p>" },
  { title: "Game policy training", background: "<p>Game agents collect multi-step rollouts, then summarize TD residuals into advantages. This keeps policy-gradient updates aligned with delayed outcomes.</p>", numbers: "<p>For residuals $[1.320,-0.620,1.800]$, $\gamma=0.9$, and $\lambda=0.95$, $\hat A_0=1.320+0.855(-0.620)+0.855^2(1.800)=2.106$.</p>" },
  { title: "Ad sequencing", background: "<p>Ad sequences have delayed effects, so advantages are a better update signal than immediate clicks alone. GAE makes the advantage per transition explicit.</p>", numbers: "<p>The lesson return $G=2.620$ with value baseline $0.400$ gives Monte Carlo advantage $2.220$. GAE at $\lambda=0.95$ gives the lower-variance illustrative value $2.106$.</p>" },
  { title: "Traffic policies", background: "<p>Traffic policies balance short-term queue changes with future congestion. Discount and lambda jointly decide how far residuals propagate backward.</p>", numbers: "<p>If $\gamma=0.9$ and $\lambda=0.5$, a residual two steps away receives weight $(0.9\cdot0.5)^2=0.203$, much less than $0.731$ when $\lambda=0.95$.</p>" },
  { title: "Recommenders", background: "<p>The critic value remains one scalar per state, but advantages are per transition in a sampled sequence. GAE prevents shape confusion by computing trajectory arrays.</p>", numbers: "<p>For a 5-step rollout, $V$ may have shape $|S|$, while advantages have length $5$. Mixing those shapes would update five transitions with the wrong table semantics.</p>" }
];

(window.ALLML_CONTENT["11.17"] = window.ALLML_CONTENT["11.17"] || {}).applications = [
  { title: "Robotics policy updates", background: "<p>Robots can be damaged by destructive policy jumps, so PPO clips probability ratios. The plan uses the standard illustrative clip $\epsilon=0.2$.</p>", numbers: "<p>If the old action probability is $0.731$ and the new is $0.900$, the ratio is $0.900/0.731=1.231$. PPO clips it to $1.200$ for positive advantages.</p>" },
  { title: "Game agents", background: "<p>PPO still uses the policy-gradient advantage idea, but it limits how much one batch can reward a probability change. This stabilizes repeated game updates.</p>", numbers: "<p>With advantage $A=2.620$, the unclipped term is $1.231\cdot2.620=3.226$, while the clipped objective is $1.200\cdot2.620=3.144$.</p>" },
  { title: "Recommendation policies", background: "<p>Recommendation policies change the data they collect after every update. A trust region limits how far action probabilities move between old logged data and the new policy.</p>", numbers: "<p>If a probability changes from $0.20$ to $0.95$, the ratio is $4.75$. With $\epsilon=0.2$ and positive advantage, PPO uses $1.20$ instead of $4.75$.</p>" },
  { title: "Traffic signals", background: "<p>Signal policies compare old and new phase probabilities for each sampled action. Large jumps can overfit one rollout of traffic noise.</p>", numbers: "<p>For $A=1.5$, a raw ratio $4.75$ gives $7.125$, but the clipped objective is $1.2\cdot1.5=1.800$. The smaller number prevents a destructive jump.</p>" },
  { title: "Scheduling control", background: "<p>Scheduling decisions alter future queues, so stable updates matter. PPO clipping is a cheap NumPy-friendly approximation to trust-region control.</p>", numbers: "<p>The allowed positive-ratio band with $\epsilon=0.2$ is $[0.8,1.2]$. Any positive-advantage ratio above $1.2$ receives no extra objective credit.</p>" }
];

(window.ALLML_CONTENT["11.18"] = window.ALLML_CONTENT["11.18"] || {}).applications = [
  { title: "Robot arm control", background: "<p>DDPG and TD3 choose deterministic continuous actions such as torques. The actor maps state directly to a scalar or vector action within physical bounds.</p>", numbers: "<p>For an illustrative scalar torque, $\tanh(0.7\cdot0.5)=0.336$, which lies inside the required action range $[-1,1]$.</p>" },
  { title: "Autonomous driving simulation", background: "<p>Driving simulators use smooth steering and acceleration, so differentiating a critic with respect to action is more natural than enumerating discrete actions.</p>", numbers: "<p>If reward is $1$, next critic value is $0.8$, and $\gamma=0.9$, the target is $1+0.9\cdot0.8=1.720$, matching the lesson bootstrap.</p>" },
  { title: "HVAC control", background: "<p>HVAC controllers set continuous temperatures or fan speeds rather than selecting from a small action table. A deterministic actor can output the setpoint directly.</p>", numbers: "<p>A normalized setpoint action $a=0.25$ in $[-1,1]$ maps to $20+4a=21.000$ degrees in an illustrative $[16,24]$ degree range.</p>" },
  { title: "Finance execution", background: "<p>Continuous trade size is a natural action, but a single critic can over-estimate bootstrapped value. TD3 uses twin critics and the minimum target.</p>", numbers: "<p>If twin next estimates are $1.1$ and $0.8$, TD3 uses $\min(1.1,0.8)=0.8$. The target is $1+0.9\cdot0.8=1.720$ instead of $1.990$.</p>" },
  { title: "Drone control", background: "<p>Drones require smooth continuous control and stable bootstrapping. Target smoothing perturbs the next action before evaluating target critics.</p>", numbers: "<p>If an actor proposes $0.30$ and smoothing noise is $0.05$, the target action is $0.35$, still within $[-1,1]$. The critic then evaluates that smoothed action.</p>" }
];

/* ---- _apps-part11-D.js ---- */
/* All ML — Part 11 D applications for 11.19-11.24. */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

window.ALLML_CONTENT["11.19"] = window.ALLML_CONTENT["11.19"] || {};
(window.ALLML_CONTENT["11.19"] = window.ALLML_CONTENT["11.19"] || {}).applications = [
  {
    title: "Robot manipulation with useful randomness",
    background: "<p>Soft Actor-Critic is common in continuous control because entropy keeps the robot trying several plausible grasps instead of collapsing too early to one brittle move.</p>",
    numbers: "<p>In the notebook D1 check, soft action values $[1.0,1.8]$ with illustrative $\alpha=0.2$ give $\pi(a_2)=0.982014$ and $V_{soft}=0.2\log(\exp(5)+\exp(9))=1.803629$.</p>"
  },
  {
    title: "Autonomous driving simulation",
    background: "<p>Driving simulators have uncertain transitions, so an entropy term can preserve alternate maneuvers while return estimates improve.</p>",
    numbers: "<p>The return part is still the lesson calculation: rewards $[1,0,2]$ with $\gamma=0.9$ give $G=1+0.9\cdot0+0.9^2\cdot2=2.620$ before adding entropy regularization.</p>"
  },
  {
    title: "Recommender exploration",
    background: "<p>For recommenders, SAC-style thinking treats randomness as an optimized property of the policy rather than as accidental serving noise.</p>",
    numbers: "<p>With two illustrative content actions and $\pi=[0.018,0.982]$, the entropy is about $-0.018\log(0.018)-0.982\log(0.982)=0.0901$, a measurable exploration bonus.</p>"
  },
  {
    title: "HVAC control",
    background: "<p>Building control balances comfort, energy, and uncertainty in occupancy; reward plus entropy avoids overcommitting to a single setpoint too soon.</p>",
    numbers: "<p>If a comfort reward target is $1.8$ and an alternative is $1.0$, $\alpha=0.2$ makes the higher-return action roughly $\exp(9)/(\exp(5)+\exp(9))=0.982014$ likely but not exactly deterministic.</p>"
  },
  {
    title: "Game control policies",
    background: "<p>Game agents can use entropy to keep discovering routes or tactics even when a greedy policy has found an early local optimum.</p>",
    numbers: "<p>The lesson pitfall is numeric: optimizing immediate reward $r$ alone would prefer a visible $1$, while the delayed-return example values the sequence at $2.620$ once future reward is discounted in.</p>"
  }
];

window.ALLML_CONTENT["11.20"] = window.ALLML_CONTENT["11.20"] || {};
(window.ALLML_CONTENT["11.20"] = window.ALLML_CONTENT["11.20"] || {}).applications = [
  {
    title: "Robot planning before acting",
    background: "<p>A learned transition model lets a robot compare possible moves in simulation before collecting expensive real-world experience.</p>",
    numbers: "<p>For D1, two observed right moves from state 0 to state 1 make $\hat P(s_1\mid s_0,right)\approx1.0$, so planning assigns $V(s_0)\approx1+0.9\cdot0=1.0$.</p>"
  },
  {
    title: "Logistics simulation rollouts",
    background: "<p>Warehouses and routing systems use rollout models to imagine delayed consequences over a short horizon.</p>",
    numbers: "<p>The lesson three-step rollout has rewards $[1,0,2]$, so $G=1+0.9\cdot0+0.9^2\cdot2=2.620$; that is exactly what the model is trying to predict cheaply.</p>"
  },
  {
    title: "Game-agent world models",
    background: "<p>A game world model predicts both next state and reward, allowing planning sweeps over imagined state transitions.</p>",
    numbers: "<p>With $|S|=2$ and $|A|=2$ in the D1 check, the transition tensor has shape $2\times2\times2$, while the value vector has shape $2$.</p>"
  },
  {
    title: "Traffic signal control",
    background: "<p>Traffic planners can evaluate signal actions by backing up predicted immediate flow rewards plus downstream congestion values.</p>",
    numbers: "<p>The Bellman planning term is $R+\gamma V(s')$; with illustrative $R=1.0$, $V(s')=0.5$, and $\gamma=0.9$, the one-step model target is $1.45$.</p>"
  },
  {
    title: "Data-center control",
    background: "<p>When real interventions are costly, model-based RL can trade a small number of measured transitions for many cheap planning updates.</p>",
    numbers: "<p>If each of $2$ states and $2$ actions receives $16$ model samples, D1 uses only $2\cdot2\cdot16=64$ real transitions before many Bellman sweeps.</p>"
  }
];

window.ALLML_CONTENT["11.21"] = window.ALLML_CONTENT["11.21"] || {};
(window.ALLML_CONTENT["11.21"] = window.ALLML_CONTENT["11.21"] || {}).applications = [
  {
    title: "A/B testing with UCB",
    background: "<p>UCB allocates experiments toward arms whose observed mean or uncertainty justifies more trials.</p>",
    numbers: "<p>For $\hat\mu=[0.4,0.5]$, $N=[10,5]$, $t=16$, and $c=1$, the scores are about $[1.144660,1.553109]$, so arm 2 is explored or exploited next.</p>"
  },
  {
    title: "Recommendation cold start",
    background: "<p>Epsilon-greedy serving reserves some traffic for less-known items so the system can learn beyond the current winner.</p>",
    numbers: "<p>With the plan's illustrative $\epsilon=0.1$, a $1000$-request batch sends about $100$ requests to exploration and $900$ to the current best estimate.</p>"
  },
  {
    title: "Robotics sparse rewards",
    background: "<p>Intrinsic bonuses encourage visiting novel states when task reward appears only after a long sequence of correct actions.</p>",
    numbers: "<p>A count bonus shaped like $1/\sqrt{N}$ gives a first visit bonus $1.0$ and a fourth visit bonus $0.5$, so novelty visibly decays with support.</p>"
  },
  {
    title: "Ad bidding exploration",
    background: "<p>Learning a bidding action requires paying regret while uncertain alternatives are tested.</p>",
    numbers: "<p>For the plan's illustrative $5$ arms, choosing an arm with expected reward $0.50$ when the best is $0.53$ adds one-step regret $0.03$.</p>"
  },
  {
    title: "Clinical trial allocation",
    background: "<p>Arm counts prevent a treatment from being selected forever because of one lucky early outcome.</p>",
    numbers: "<p>The UCB denominator shows this directly: increasing $N_a$ from $5$ to $20$ changes the bonus at $t=16$ from $\sqrt{2\ln16/5}=1.053109$ to $0.526554$.</p>"
  }
];

window.ALLML_CONTENT["11.22"] = window.ALLML_CONTENT["11.22"] || {};
(window.ALLML_CONTENT["11.22"] = window.ALLML_CONTENT["11.22"] || {}).applications = [
  {
    title: "Homepage ranking",
    background: "<p>A bandit fits homepage modules because each impression chooses an arm and receives a one-step reward without modeling a long state transition.</p>",
    numbers: "<p>In the D1 check, reward sums $[3,4]$ and counts $[5,5]$ give empirical means $[0.6,0.8]$, so arm 2 has the larger observed payoff.</p>"
  },
  {
    title: "Ads allocation",
    background: "<p>Ad systems can use UCB to balance a high measured click rate against uncertainty from few impressions.</p>",
    numbers: "<p>With $t=10$, $N_a=5$, and $c=1$, the uncertainty bonus is $\sqrt{2\ln10/5}=0.959706$, making the D1 scores $[1.559706,1.759706]$.</p>"
  },
  {
    title: "Email subject testing",
    background: "<p>Subject-line tests are one-step bandits because the system chooses a subject and observes an open or click reward.</p>",
    numbers: "<p>For an illustrative $4$-arm test with best open rate $0.24$, sending $250$ emails to an arm with rate $0.20$ creates regret $250\cdot(0.24-0.20)=10$ opens.</p>"
  },
  {
    title: "Contextual clinical trials",
    background: "<p>Contextual bandits can condition treatment allocation on patient features while still optimizing immediate outcomes.</p>",
    numbers: "<p>With two features $x=[1,0.5]$ and illustrative arm weights $\theta=[0.1,0.4]$, the expected reward is $0.1\cdot1+0.4\cdot0.5=0.300$.</p>"
  },
  {
    title: "Price experimentation",
    background: "<p>Pricing tests update each arm value after observing revenue or conversion for that chosen price.</p>",
    numbers: "<p>If an arm has current sum $4$ over $5$ pulls, observing reward $1$ updates $\hat\mu$ from $4/5=0.800$ to $5/6=0.833$.</p>"
  }
];

window.ALLML_CONTENT["11.23"] = window.ALLML_CONTENT["11.23"] || {};
(window.ALLML_CONTENT["11.23"] = window.ALLML_CONTENT["11.23"] || {}).applications = [
  {
    title: "Warehouse robot skills",
    background: "<p>A warehouse robot can treat go to aisle as an option rather than relearning every primitive wheel command at each decision point.</p>",
    numbers: "<p>The plan's illustrative 4-step option with rewards $[0,0,0,1]$ has discounted reward $0.9^3=0.729$ before any terminal bootstrap.</p>"
  },
  {
    title: "Game AI skill libraries",
    background: "<p>Game agents can learn reusable skills such as navigate to cover, then plan over those temporally extended actions.</p>",
    numbers: "<p>Adding a terminal value $0.5$ after the 4-step option gives $0.9^3+0.9^4\cdot0.5=1.05705$, the notebook's D1 assertion.</p>"
  },
  {
    title: "Web task automation",
    background: "<p>Macro-actions such as fill form or open report reduce the effective decision depth in long browser workflows.</p>",
    numbers: "<p>A primitive horizon of $20$ clicks becomes $5$ decisions if each option averages $4$ primitive steps, a $4:1$ planning-depth compression.</p>"
  },
  {
    title: "Robot navigation subgoals",
    background: "<p>Navigation options still contain an internal policy $\pi(a\mid s)$, but the top-level controller sees a subgoal-directed action.</p>",
    numbers: "<p>If the internal option chooses among $4$ primitive moves for $4$ steps, it represents one high-level choice in place of up to $4^4=256$ primitive action sequences.</p>"
  },
  {
    title: "Traffic corridors",
    background: "<p>Traffic-control options can represent moving flow through a corridor and then bootstrapping from the next intersection value.</p>",
    numbers: "<p>With corridor reward $0.6$ and next value $0.8$ after one option, the Bellman-style target is $0.6+0.9\cdot0.8=1.32$.</p>"
  }
];

window.ALLML_CONTENT["11.24"] = window.ALLML_CONTENT["11.24"] || {};
(window.ALLML_CONTENT["11.24"] = window.ALLML_CONTENT["11.24"] || {}).applications = [
  {
    title: "Robot localization",
    background: "<p>A robot with noisy sensors maintains a belief distribution over locations instead of assuming the latest observation is the true state.</p>",
    numbers: "<p>For the D1 belief $[0.6,0.4]$ and transition matrix giving prediction $[0.5,0.5]$, observation likelihood $[0.2,0.9]$ updates to $[0.181818,0.818182]$.</p>"
  },
  {
    title: "Medical diagnosis",
    background: "<p>Symptoms are partial observations of hidden disease state, so diagnosis updates a belief as new tests arrive.</p>",
    numbers: "<p>With two diseases and likelihoods $[0.2,0.9]$, the observation is $0.9/0.2=4.5$ times more compatible with disease 2 than disease 1 before normalization.</p>"
  },
  {
    title: "Dialogue systems",
    background: "<p>User intent is hidden in dialogue, so the system tracks a belief over intents as utterances arrive.</p>",
    numbers: "<p>If the posterior over two intents is $[0.181818,0.818182]$, choosing the most likely intent has confidence $0.818182$, leaving uncertainty $0.181818$.</p>"
  },
  {
    title: "Search-and-rescue sensors",
    background: "<p>Rescue agents combine motion models with unreliable observations to decide where to search next.</p>",
    numbers: "<p>For an illustrative 3-observation sensor, a uniform observation prior has mass $1/3=0.333$ per reading before location-specific likelihoods shift the belief.</p>"
  },
  {
    title: "Fraud detection workflows",
    background: "<p>Investigation actions change future evidence but may never reveal the true fraud state directly, making belief tracking essential.</p>",
    numbers: "<p>The normalizer in the D1 update is $0.5\cdot0.2+0.5\cdot0.9=0.55$, so $\eta=1/0.55=1.818182$ rescales the posterior to sum to 1.</p>"
  }
];

/* ---- _apps-part11-E.js ---- */
(window.ALLML_CONTENT["11.25"] = window.ALLML_CONTENT["11.25"] || {}).applications = [
  { title: "Robot navigation", background: "<p>Mobile robots often get a sparse success reward only when they reach a charger or shelf. Potential-based shaping adds dense progress feedback while preserving the final route objective.</p>", numbers: "<p>Illustrative progress shaping of +0.1 per useful move can speed exploration, but the return is still discounted: $G=1+0.9\cdot0+0.9^2\cdot2=2.620$.</p>" },
  { title: "Game tutorials", background: "<p>Tutorial levels reward useful intermediate skills before the sparse win condition appears. The shaping must teach faster without making tutorial farming better than winning.</p>", numbers: "<p>With $0\le\gamma\lt1$ and $\gamma=0.9$, a win reward two steps away contributes $0.9^2\cdot2=1.620$, not 2.000.</p>" },
  { title: "Education platforms", background: "<p>Adaptive tutors can give partial-credit hint rewards while the true goal remains mastery. Potential-style progress keeps the path aligned with the lesson objective.</p>", numbers: "<p>If a hint raises the estimated next value to 0.8 after reward 1, the bootstrap target is $1+0.9\cdot0.8=1.720$.</p>" },
  { title: "Traffic control", background: "<p>Intersection agents may receive dense feedback when queues shrink between states. A potential based on queue length avoids rewarding pointless oscillation.</p>", numbers: "<p>An update from $Q_{old}=0.4$ with $\alpha=0.5$ toward target 1.720 gives $Q_{new}=0.4+0.5(1.720-0.4)=1.060$.</p>" },
  { title: "Warehouse routing", background: "<p>Warehouse robots benefit from guidance toward pick locations, but a non-potential bonus can change the optimal route. Potential shaping telescopes over a trajectory.</p>", numbers: "<p>For $R'=R+\gamma\Phi(s')-\Phi(s)$, the added terms discount-cancel across a path, so D1 can assert the same optimal action before and after shaping.</p>" }
];

(window.ALLML_CONTENT["11.26"] = window.ALLML_CONTENT["11.26"] || {}).applications = [
  { title: "Robot reaching", background: "<p>A failed reach to one target may still end exactly at another useful target. Hindsight replay relabels that trajectory as successful for the achieved goal.</p>", numbers: "<p>Illustrative D1 uses 2 goals: the same transition has reward 0 for desired goal A but reward 1 for achieved goal B, creating a useful backup.</p>" },
  { title: "Navigation apps", background: "<p>A route policy must be indexed by destination, not just by current location. Goal-conditioned values store $Q(s,a,g)$ for each destination goal.</p>", numbers: "<p>If $|S|=10$, $|A|=4$, and 2 destinations are active, the table has $10\times4\times2=80$ action-goal entries.</p>" },
  { title: "Game quests", background: "<p>Players often miss the main quest target but reach subgoals. Relabeling gives dense supervision for the subgoal that was actually reached.</p>", numbers: "<p>The same lesson backup applies per goal: with reward 1, next value 0.8, and $\gamma=0.9$, the target is $1+0.9\cdot0.8=1.720$.</p>" },
  { title: "Warehouse picking", background: "<p>Picking systems reuse one state-action log for multiple requested items. HER increases the number of labeled successes without collecting new robot episodes.</p>", numbers: "<p>With an illustrative tiny replay buffer of 20 transitions and 2 relabeled goals, up to $20\times2=40$ goal-indexed updates are available.</p>" },
  { title: "Personalization", background: "<p>Recommendation and tutoring policies condition on desired outcomes, such as completion or exploration. The goal changes the action even in the same state.</p>", numbers: "<p>The lesson return still discounts consequence: rewards $[1,0,2]$ at $\gamma=0.9$ give $G=2.620$ for the selected goal-conditioned rollout.</p>" }
];

(window.ALLML_CONTENT["11.27"] = window.ALLML_CONTENT["11.27"] || {}).applications = [
  { title: "Market bidding", background: "<p>Advertisers and bidding agents adapt to one another, so each payoff depends on other policies. Multi-agent RL makes that dependence explicit.</p>", numbers: "<p>With illustrative 2 agents and 2 actions each, the joint action table has $2\times2=4$ outcomes before state is even considered.</p>" },
  { title: "Traffic intersections", background: "<p>Neighboring traffic controllers change each other's transition dynamics. A green light at one node can create queues or relief at another.</p>", numbers: "<p>A one-step target with reward 1 and next value 0.8 remains $1+0.9\cdot0.8=1.720$, but the next value changes when the neighbor policy changes.</p>" },
  { title: "Multiplayer games", background: "<p>Opponent learning makes the environment nonstationary. Independent Q-learning can chase a moving target rather than a fixed Bellman operator.</p>", numbers: "<p>Starting from $Q=0.4$, moving halfway toward target 1.720 gives 1.060; if the opponent changes the target next step, the backup is no longer stationary.</p>" },
  { title: "Fleet coordination", background: "<p>Delivery fleets must coordinate routes and avoid collisions. The joint action space grows as the product of each agent's action count.</p>", numbers: "<p>For 2 robots with 4 grid actions each, there are $4^2=16$ joint moves per state; the notebook keeps two agents to stay CPU-only.</p>" },
  { title: "Resource allocation", background: "<p>Shared-resource agents learn values under policy probabilities $\pi(a\mid s)$. Equilibria and team returns depend on everyone choosing compatible actions.</p>", numbers: "<p>The value expression averages over actions: with two actions at probabilities 0.7 and 0.3, expected immediate reward is $0.7r_1+0.3r_2$ before bootstrapping.</p>" }
];

(window.ALLML_CONTENT["11.28"] = window.ALLML_CONTENT["11.28"] || {}).applications = [
  { title: "Autonomous driving", background: "<p>Driving stacks use expert demonstrations to learn lane keeping, stopping, and merging actions. Behavior cloning estimates action probabilities from observed counts.</p>", numbers: "<p>Illustrative 20 demo steps all choosing the expert action give $\hat\pi=(20+1)/(20+4)=0.875$ with Laplace smoothing over 4 actions.</p>" },
  { title: "Robotics", background: "<p>Inverse RL is useful when the reward is hard to write but expert behavior is available. The inferred reward is then optimized like a normal RL objective.</p>", numbers: "<p>If 20 successful demonstrations each assign reward 1 to the goal state, the recovered average goal reward is $20/20=1.000$.</p>" },
  { title: "Game bots", background: "<p>Game agents can clone expert move distributions before fine-tuning. This gives a strong prior in states covered by demonstrations.</p>", numbers: "<p>For action counts [20, 0, 0, 0] with smoothing 1, the best action probability is $(20+1)/(20+4)=0.875$.</p>" },
  { title: "Customer-support routing", background: "<p>Historical expert routing choices reveal which queue or specialist is preferred, even when explicit rewards are absent. Support matters because unseen cases can compound errors.</p>", numbers: "<p>If a state appears 0 times, smoothing gives each of 4 actions probability $1/4=0.250$, showing why out-of-support behavior is uncertain.</p>" },
  { title: "Surgical-assist training", background: "<p>Assistive systems can compare learned policy return to expert return over a procedure. Return, not immediate reward alone, captures delayed consequences.</p>", numbers: "<p>The lesson's discounted example gives expert-style return $G=1+0.9\cdot0+0.9^2\cdot2=2.620$ for a three-step outcome.</p>" }
];

(window.ALLML_CONTENT["11.29"] = window.ALLML_CONTENT["11.29"] || {}).applications = [
  { title: "Healthcare treatment policies", background: "<p>Offline RL can improve treatment decisions from fixed records without unsafe live exploration. Constraints prevent choosing actions unsupported by clinical logs.</p>", numbers: "<p>The lesson objective is $\max_\pi J(\pi)$ subject to $C(\pi)\le d$; with illustrative budget $d=0.1$, policies over that cost are rejected.</p>" },
  { title: "Ads bidding", background: "<p>Logged auctions cover only actions the behavior policy sampled. Offline RL must avoid overvaluing bids that are absent from support.</p>", numbers: "<p>If 100 logged transitions contain an action 0 times, its empirical support is $0/100=0$, so the notebook masks or penalizes it.</p>" },
  { title: "Robotics logs", background: "<p>Robots can learn from old trajectories when new trials are expensive or unsafe. No new environment queries are allowed in offline evaluation.</p>", numbers: "<p>With illustrative 100 transitions and 4 actions, a uniform log would average 25 samples per action; narrow support may leave some actions at 0.</p>" },
  { title: "Recommenders", background: "<p>Recommendation policies are often trained from historical exposure logs. Conservative objectives keep the learned policy near behavior data coverage.</p>", numbers: "<p>A conservative penalty of 1.0 turns an unsupported optimistic value 0.4 into $0.4-1.0=-0.6$, below supported alternatives.</p>" },
  { title: "Fleet dispatch", background: "<p>Dispatch decisions have safety and cost budgets similar to constrained offline RL. The policy should improve value without violating operational limits.</p>", numbers: "<p>The same backup target is $1+0.9\cdot0.8=1.720$, but it is only trusted when the state-action pair is supported by logs.</p>" }
];

(window.ALLML_CONTENT["11.30"] = window.ALLML_CONTENT["11.30"] || {}).applications = [
  { title: "Robots across rooms", background: "<p>Robots trained across related rooms can adapt quickly when the goal location changes. Meta-RL learns an initialization rather than a single final policy.</p>", numbers: "<p>Illustrative 5 related tasks can form a warm start $\theta_{meta}=\frac{1}{5}\sum_{k=1}^5Q_k^*$ before adapting to a new room.</p>" },
  { title: "Game levels", background: "<p>Game agents can learn how to update across related maps. A warm-started value table should need fewer adaptation episodes than a cold start.</p>", numbers: "<p>If two tiny tasks have start-action values 1.0 and 0.8, the meta initialization is $(1.0+0.8)/2=0.900$.</p>" },
  { title: "Personalized tutoring", background: "<p>Tutoring systems adapt after a few learner interactions. Prior tasks provide a useful initialization while the current learner supplies task-specific updates.</p>", numbers: "<p>From warm value 0.900, a half-step update toward reward 1 gives $0.9+0.5(1-0.9)=0.950$, faster than cold $0+0.5(1-0)=0.500$.</p>" },
  { title: "Traffic systems", background: "<p>Traffic policies transfer across intersections with different transitions. Meta-RL evaluates adaptation using discounted returns, not immediate queue changes only.</p>", numbers: "<p>The lesson return example $G=2.620$ shows why a delayed reward of 2 contributes $1.620$ when $\gamma=0.9$.</p>" },
  { title: "Recommendation sessions", background: "<p>Session recommenders warm-start exploration from previous users or tasks. Fast adaptation helps when the current user's goal differs from the average.</p>", numbers: "<p>With 4 actions and 5 prior task tables, a small 10-state warm start averages $5\times10\times4=200$ learned entries.</p>" }
];

/* ---- _apps-part11-F.js ---- */
(window.ALLML_CONTENT["11.31"] = window.ALLML_CONTENT["11.31"] || {}).applications = [
  { title: "Autonomous driving safety budgets", background: "<p>Driving policies optimize progress, comfort, and route completion, but safety constraints must be explicit rather than hidden in a reward weight.</p>", numbers: "<p>Using the lesson objective $\\max_\\pi J(\\pi)$ subject to $C(\\pi)\\le d$, an illustrative policy with return $J=2.620$ and cost $C=0.8$ is feasible when $d=1.0$; a reward-only policy with $C=1.4$ violates the budget by $0.4$.</p>" },
  { title: "Robotics hazard avoidance", background: "<p>Warehouse and mobile robots often have a short path that brushes an unsafe cell and a longer path that stays inside the operating envelope.</p>", numbers: "<p>If the hazard budget is the plan's illustrative $d=1$, one hazard contact gives $C=1$ and remains feasible, while two contacts give $C=2$ and the violation is $C-d=1$.</p>" },
  { title: "Medical treatment policies", background: "<p>Treatment sequencing can be framed as an RL policy, but adverse-event exposure must be capped before maximizing expected improvement.</p>", numbers: "<p>With the lesson discount $\\gamma=0.9$, benefits $[1,0,2]$ produce $G=1+0.9\\cdot0+0.9^2\\cdot2=2.620$; the constrained policy accepts that return only if adverse-event cost satisfies $C(\\pi)\\le d$.</p>" },
  { title: "Data-center control", background: "<p>Cooling controllers trade latency, energy, and thermal safety, so operators commonly express limits as budgets on temperature or power excursions.</p>", numbers: "<p>An illustrative Lagrangian score $J-\\lambda(C-d)$ with $J=2.620$, $C=1.2$, $d=1.0$, and $\\lambda=2$ becomes $2.620-2(0.2)=2.220$, making the unsafe controller less attractive.</p>" },
  { title: "Finance execution risk", background: "<p>Execution algorithms can maximize fill quality while respecting drawdown, inventory, or market-impact limits.</p>", numbers: "<p>If an immediate fill reward is $1$ and the bootstrapped next value is $0.8$, the lesson target is $1+0.9\\cdot0.8=1.720$; constrained RL uses that target while separately checking the risk budget.</p>" }
];

(window.ALLML_CONTENT["11.32"] = window.ALLML_CONTENT["11.32"] || {}).applications = [
  { title: "Robot locomotion sim-to-real", background: "<p>Legged robots are trained in simulation because real falls are expensive, but the real floor, motors, and contacts differ from the simulator.</p>", numbers: "<p>The plan's illustrative 10% slip change means a nominal $P(s'\\mid s,a)=0.90$ transition may become $0.80$ in reality; domain randomization trains across that band instead of trusting one value.</p>" },
  { title: "Drone wind robustness", background: "<p>Drone controllers often learn in a simulator and then face gusts, sensor lag, and battery-dependent thrust outside the nominal model.</p>", numbers: "<p>With $\\gamma=0.9$, the lesson return for rewards $[1,0,2]$ remains $2.620$, but the transition expectation $\\sum_{s'}P(s'\\mid s,a)$ changes under wind, so evaluating both sim and real return exposes the gap.</p>" },
  { title: "Autonomous driving simulators", background: "<p>Driving simulators cover many edge cases cheaply, yet real traffic contains mismatch in behavior, friction, and rare events.</p>", numbers: "<p>If a simulator predicts success probability $0.90$ and reality after a 10% shift gives $0.80$, an illustrative goal reward of $5$ drops expected goal contribution from $4.5$ to $4.0$.</p>" },
  { title: "Warehouse robot routing", background: "<p>Warehouse policies trained offline must transfer to aisles with changing congestion, pallets, and floor conditions.</p>", numbers: "<p>Randomizing $P(s'\\mid s,a)$ over five illustrative slip values, such as $[0.00,0.025,0.05,0.075,0.10]$, makes the Bellman backup average over plausible domains.</p>" },
  { title: "HVAC control transfer", background: "<p>Building simulators approximate weather, occupancy, and thermal inertia; the deployed policy must remain useful when those dynamics shift.</p>", numbers: "<p>The one-step lesson target $y=1+0.9\\cdot0.8=1.720$ is only valid for the assumed next-state value; sim-to-real validation recomputes the same target under shifted transition probabilities.</p>" }
];

(window.ALLML_CONTENT["11.33"] = window.ALLML_CONTENT["11.33"] || {}).applications = [
  { title: "Offline robot control", background: "<p>Decision transformers learn from logged trajectories, useful when online exploration with a robot would be slow or unsafe.</p>", numbers: "<p>The lesson object $p(a_t\\mid R_t,s_1,a_1,\\ldots,s_t)$ can condition on an illustrative desired return $R_t=2.620$ from rewards $[1,0,2]$ with $\\gamma=0.9$.</p>" },
  { title: "Game trajectory modeling", background: "<p>Game logs naturally contain states, actions, and outcomes, making them a good fit for sequence-conditioned control.</p>", numbers: "<p>With the plan's illustrative context length 4, a model can read up to four recent tokens and choose the next action; if logits are $[1,0]$, the lesson softmax gives action probabilities $0.731$ and $0.269$.</p>" },
  { title: "Recommendation sessions", background: "<p>A recommender session is a trajectory: past items and responses shape which item should come next.</p>", numbers: "<p>If the target session return is clipped to observed support, a requested $R_t=5$ with logged maximum $2.620$ is reduced to $2.620$ before predicting $p(a_t\\mid R_t,history)$.</p>" },
  { title: "Web task automation", background: "<p>Automation agents can imitate successful traces while conditioning on the remaining return needed to finish a task.</p>", numbers: "<p>The lesson bootstrap target $1.720$ and update $Q_{new}=1.060$ illustrate why offline logs encode delayed consequence, not only the immediate click or page transition.</p>" },
  { title: "Fleet dispatch logs", background: "<p>Dispatch systems can train on historical assignments without forcing vehicles through risky online exploration.</p>", numbers: "<p>If only 5% of logs exceed an illustrative return of $3.0$, a support check prevents requesting $R_t=6.0$ and extrapolating beyond the data distribution.</p>" }
];

(window.ALLML_CONTENT["11.34"] = window.ALLML_CONTENT["11.34"] || {}).applications = [
  { title: "Board-game self-play", background: "<p>Self-play made board-game RL practical by using yesterday's policy as today's opponent, continuously raising the curriculum.</p>", numbers: "<p>In the plan's illustrative two-player game, a policy with logits $[1,0]$ chooses action 0 with probability $0.731$ and action 1 with probability $0.269$, so opponent mix directly changes expected payoff.</p>" },
  { title: "Cyber-defense drills", background: "<p>Defenders improve when the attacker adapts, because a fixed script quickly becomes memorized rather than robust.</p>", numbers: "<p>An illustrative population of 4 opponents averages four policies; if their attack probabilities are $[0.2,0.4,0.6,0.8]$, the replay opponent uses mean probability $0.5$.</p>" },
  { title: "Auction strategy populations", background: "<p>A bidding policy trained against one competitor may overfit; populations expose it to multiple strategic responses.</p>", numbers: "<p>If the latest-only win-rate is $0.55$ and population replay reaches $0.62$, the measured lift is $0.07$, matching the lesson metric of return or win-rate rather than a single reward.</p>" },
  { title: "Sports simulation", background: "<p>Sports agents need a curriculum of opponents with different tactics, not just one frozen baseline.</p>", numbers: "<p>The lesson UCB-style index $0.55+\\sqrt{2\\ln(20)/5}=1.645$ shows why uncertain opponents can be sampled for learning even when their current mean score is modest.</p>" },
  { title: "Negotiation bots", background: "<p>Negotiation payoff depends on an adaptive counterpart, so training against a distribution of counterparts is safer than chasing the latest one.</p>", numbers: "<p>If a generation scores return $0.4$, the Elo-like logistic win-rate is illustratively $1/(1+e^{-0.4})=0.599$, a bounded metric for tracking self-play progress.</p>" }
];

(window.ALLML_CONTENT["11.35"] = window.ALLML_CONTENT["11.35"] || {}).applications = [
  { title: "Board-game AI", background: "<p>AlphaGo and AlphaZero combine a policy prior, value estimate, and lookahead search so each move uses both learned intuition and planning.</p>", numbers: "<p>For the plan's illustrative 9-cell game, MCTS may allocate visits like $[18,4,3,0]$ at the root, giving the best action probability $18/25=0.72$.</p>" },
  { title: "Planning robots", background: "<p>A robot can use learned value to guide tree search toward promising futures without exhaustively expanding every action sequence.</p>", numbers: "<p>With $\\gamma=0.9$ and delayed rewards $[1,0,2]$, the backed-up return is $2.620$; shallow immediate-reward search would see only the first $1$.</p>" },
  { title: "Game tutorials", background: "<p>Search-guided self-play can generate examples and hints that improve as the policy and value estimates improve.</p>", numbers: "<p>If a value prior assigns $0.731$ probability to one candidate action from logits $[1,0]$, PUCT still adds an exploration bonus so less-visited moves can be searched.</p>" },
  { title: "Scheduling search", background: "<p>Scheduling problems often have large branching factors; learned value and dynamics reduce how much search is needed.</p>", numbers: "<p>An illustrative branching factor of 4 over depth 5 gives $4^5=1024$ leaves, while 35 MCTS simulations inspect only about $35/1024=3.4\%$ of that tree.</p>" },
  { title: "Simulator-free planning", background: "<p>MuZero-style systems learn the dynamics needed for search, avoiding a hand-written simulator while still backing up reward and value.</p>", numbers: "<p>The lesson one-step target $y=1+0.9\\cdot0.8=1.720$ is the same backup idea: learned dynamics predicts the next value used by search.</p>" }
];

