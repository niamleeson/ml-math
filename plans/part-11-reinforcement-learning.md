# Part 11 — Reinforcement Learning

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant family: F12 (Sequential-Decision / RL).

### 11.1 — RL framing (agent, environment, reward)   [notebook: 11.1-rl-framing.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Robot navigation — choose among 2 actions in each state; return uses the lesson discount $0\le\gamma<1$.
2. Ad pacing — each bid changes future budget state; value table has $|S|$ entries per lesson notation.
3. Game AI tutorials — delayed win reward is return $G$, not immediate $r$; illustrative 10-step episode.
4. Recommender session ranking — action-value table is $|S|\times|A|$ as cited in lesson shapes.
5. Warehouse routing — one policy probability $\pi(a\mid s)$ per feasible action; illustrative 4 moves.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `compute_return_and_value()` verifies reward vs discounted return and Bellman expectation on a 2-state MDP with $0\le\gamma<1$.
- Datasets D1–D5: environments of rising difficulty — D1 2-state chain (verify values by hand) · D2 slippery 3-state · D3 4x4 gridworld · D4 stochastic/windy grid · D5 larger sparse-reward grid
- Metric: return across all rungs
- Closing viz: (a) value/policy heatmap panels per env (b) learning curve (return vs episodes)
- Pitfall on D5: confusing reward with return, reproduced by greedy-immediate reward then fixed with discounted return.
- Notes: delete dead conv2d/iou/edit_distance/ce/kl template code; CPU-only; no gym download.

### 11.2 — Markov Decision Processes   [notebook: 11.2-mdp.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Inventory replenishment — state/action/transition/reward bookkeeping; illustrative 3 stock states.
2. Ride-share dispatch — transition probability $P(s'\mid s,a)$ models next zone; lesson cites this term.
3. Treatment planning — discount $0\le\gamma<1$ weights future outcomes; illustrative 2 treatments.
4. Web navigation — $V$ has $|S|$ values for pages/states, matching lesson shape.
5. Data-center scheduling — $Q$ has $|S|\times|A|$ entries for machine/action choices.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `evaluate_mdp()` builds explicit $S,A,P,R,\gamma$ and verifies the Bellman expectation equation on the 2-state chain.
- Datasets D1–D5: environments of rising difficulty — D1 2-state chain (verify values by hand) · D2 slippery 3-state · D3 4x4 gridworld · D4 stochastic/windy grid · D5 larger sparse-reward grid
- Metric: value-error vs known optimum across all rungs
- Closing viz: (a) value/policy heatmap panels per env (b) learning curve (value-error vs sweeps)
- Pitfall on D5: letting notation hide shapes, reproduced by mixing $V$ and $Q$ arrays then fixed with explicit shape checks.
- Notes: delete dead template helpers; CPU-only; keep transitions tiny and inspectable.

### 11.3 — Bellman equations   [notebook: 11.3-bellman-equations.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Delivery routing — one-step cost plus discounted downstream value; lesson equation uses $R+\gamma V(s')$.
2. Chess endgames — local backup summarizes long horizon; illustrative 2 legal moves.
3. Traffic signal timing — expected next-state sum over $P(s'\mid s,a)$ from lesson formula.
4. Pricing control — compare $Q$ entries in a $|S|\times|A|$ table.
5. Energy storage — future value discounted with $0\le\gamma<1$ exactly as lesson states.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `bellman_backup()` verifies one-step reward plus discounted future value against a hand-computed 2-state chain.
- Datasets D1–D5: environments of rising difficulty — D1 2-state chain (verify values by hand) · D2 slippery 3-state · D3 4x4 gridworld · D4 stochastic/windy grid · D5 larger sparse-reward grid
- Metric: Bellman residual/value-error across all rungs
- Closing viz: (a) value/policy heatmap panels per env (b) residual curve vs iterations
- Pitfall on D5: bootstrapping from a moving target, reproduced with too-large updates then fixed with stable iterative backups.
- Notes: delete copied dead code; CPU-only; assert residual decreases within tolerance.

### 11.4 — Dynamic programming (policy & value iteration)   [notebook: 11.4-dynamic-programming.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Fleet repositioning — known transition model enables exact sweeps; illustrative 4 zones.
2. Elevator control — value iteration compares actions in $Q$ shape $|S|\times|A|$.
3. Grid robot planning — policy iteration stores one action per state; illustrative 4x4=16 states.
4. Manufacturing control — Bellman backup uses lesson $P,R,\gamma$ terms.
5. Reservoir management — discount $0\le\gamma<1$ sets long-vs-short horizon tradeoff.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `policy_value_iteration()` runs repeated Bellman backups with a known model and verifies the D1 values by hand.
- Datasets D1–D5: environments of rising difficulty — D1 2-state chain (verify values by hand) · D2 slippery 3-state · D3 4x4 gridworld · D4 stochastic/windy grid · D5 larger sparse-reward grid
- Metric: value-error vs known optimum across all rungs
- Closing viz: (a) value/policy heatmap panels per env (b) value-error vs sweeps
- Pitfall on D5: confusing reward with return, reproduced by one-step greedy planning then fixed with full DP sweeps.
- Notes: remove dead template helpers; CPU-only; known-model only.

### 11.5 — Monte Carlo methods   [notebook: 11.5-monte-carlo-methods.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Board-game rollouts — wait for terminal outcome; illustrative 10 sampled episodes.
2. Online education paths — estimate return $G$ from complete learner sessions, per lesson pitfall wording.
3. Ad campaign sequences — average realized discounted returns; use $0\le\gamma<1$.
4. Simulator evaluation — $V$ has one estimate per state, matching $|S|$ lesson shape.
5. Treatment episodes — action values require $|S|\times|A|$ visits, as lesson notes.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `monte_carlo_value()` samples complete episodes and verifies empirical returns approach hand D1 returns.
- Datasets D1–D5: environments of rising difficulty — D1 2-state episodic chain · D2 slippery 3-state · D3 4x4 gridworld · D4 stochastic/windy grid · D5 larger sparse-reward grid
- Metric: value-error vs known optimum across all rungs
- Closing viz: (a) value/policy heatmap panels per env (b) value-error vs episodes
- Pitfall on D5: ignoring policy support, reproduced with unvisited actions then fixed with exploring starts/epsilon coverage.
- Notes: delete dead template code; CPU-only; cap episodes.

### 11.6 — Temporal-Difference learning   [notebook: 11.6-temporal-difference-learning.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Robot patrol — update after each transition using $r+\gamma V(s')$ from lesson pitfall.
2. Web session optimization — learn before a session ends; illustrative 5-step trajectory.
3. Traffic control — bootstrap next-state value $V(s')$ for each signal state.
4. Game score prediction — discount $0\le\gamma<1$ controls future score weight.
5. Queue management — table value has $|S|$ entries, matching lesson shapes.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `td0_value()` performs one-step TD targets and verifies the first D1 update numerically.
- Datasets D1–D5: environments of rising difficulty — D1 2-state chain · D2 slippery 3-state · D3 4x4 gridworld · D4 stochastic/windy grid · D5 larger sparse-reward grid
- Metric: value-error vs known optimum across all rungs
- Closing viz: (a) value/policy heatmap panels per env (b) value-error vs episodes
- Pitfall on D5: bootstrapping from a moving target, reproduced with high step size then fixed by smaller alpha/target smoothing.
- Notes: delete dead helpers; CPU-only; deterministic seeds.

### 11.7 — Eligibility traces & TD(λ)   [notebook: 11.7-eligibility-traces-td-lambda.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Long hallway robots — propagate one TD error to recent states; illustrative 5-state path.
2. Game combo scoring — trace decays with lambda; cite lesson TD(λ) topic, lambda illustrative 0.8.
3. Recommendation sessions — recent clicks get more credit than older clicks; illustrative 3 clicks.
4. Traffic corridors — delayed reward backs through preceding intersections; $0\le\gamma<1$ still discounts.
5. Process control — $V$ table remains $|S|$ while traces add same-shaped eligibility.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `td_lambda_value()` implements decaying eligibility traces and verifies a hand trace on the 2-state chain.
- Datasets D1–D5: environments of rising difficulty — D1 2-state chain · D2 slippery 3-state · D3 4x4 gridworld · D4 stochastic/windy grid · D5 larger sparse-reward grid
- Metric: value-error vs known optimum across all rungs
- Closing viz: (a) value/policy heatmap panels per env (b) value-error vs episodes for λ values
- Pitfall on D5: letting notation hide shapes, reproduced by mismatched trace/value arrays then fixed with same-shape traces.
- Notes: delete dead template code; CPU-only; lambda sweep tiny.

### 11.8 — SARSA (on-policy)   [notebook: 11.8-sarsa-on-policy.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Safety-aware driving sim — values exploratory actions actually taken; illustrative 2 actions.
2. Robot cliff navigation — on-policy updates include risky exploration; $Q$ shape $|S|\times|A|$.
3. Tutoring hint policy — learn from deployed exploratory behavior, not an imagined greedy policy.
4. Inventory trials — next action $a'$ is sampled from behavior policy $\pi(a\mid s)$.
5. Game bot training — discount $0\le\gamma<1$ weights future score during SARSA targets.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `sarsa()` verifies the update from $(s,a,r,s',a')$ on the D1 chain.
- Datasets D1–D5: environments of rising difficulty — D1 2-state chain · D2 slippery 3-state · D3 4x4 gridworld · D4 stochastic/windy grid · D5 larger sparse-reward grid
- Metric: return across all rungs
- Closing viz: (a) value/policy heatmap panels per env (b) return vs episodes
- Pitfall on D5: confusing behavior with target return, reproduced by greedy off-policy target then fixed with actual next action.
- Notes: delete dead helpers; CPU-only; compare epsilon settings briefly.

### 11.9 — Q-learning (off-policy)   [notebook: 11.9-q-learning-off-policy.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Game AI — learn greedy target while exploring; illustrative 2 actions.
2. Ad bidding simulator — behavior policy samples bids, target uses max next $Q$.
3. Warehouse robot — $Q$ table has $|S|\times|A|$ entries as lesson states.
4. Traffic control — off-policy updates use rare exploratory phases; cite lesson support pitfall.
5. Energy arbitrage — future value uses discount $0\le\gamma<1$.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `q_learning()` verifies update toward the best next action regardless of behavior on D1.
- Datasets D1–D5: environments of rising difficulty — D1 2-state chain · D2 slippery 3-state · D3 4x4 gridworld · D4 stochastic/windy grid · D5 larger sparse-reward grid
- Metric: return across all rungs
- Closing viz: (a) value/policy heatmap panels per env (b) return vs episodes
- Pitfall on D5: ignoring policy support, reproduced with unreachable actions then fixed with epsilon exploration.
- Notes: delete copied dead code; CPU-only; no gym.

### 11.10 — Function approximation in RL   [notebook: 11.10-function-approximation.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Large grid navigation — features share evidence across similar states; illustrative 2 features.
2. Recommender control — approximate value instead of storing all $|S|$ values.
3. Robotic arm bins — reduce $|S|\times|A|$ action table with state-action features.
4. Dispatch forecasting — value estimate still bootstraps from $r+\gamma V(s')$.
5. Game agents — discount $0\le\gamma<1$ remains in approximate Bellman targets.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `linear_value_approx()` fits hand features and verifies D1 predictions against tabular values.
- Datasets D1–D5: environments of rising difficulty — D1 2-state chain with one-hot features · D2 slippery 3-state · D3 4x4 gridworld coordinates · D4 stochastic/windy grid features · D5 larger sparse-reward grid with coarse tiles
- Metric: value-error vs known optimum across all rungs
- Closing viz: (a) value/policy heatmap panels per env (b) value-error vs episodes
- Pitfall on D5: bootstrapping from a moving target, reproduced as divergence with poor features/high alpha then fixed by normalization and lower alpha.
- Notes: delete dead template code; CPU-only; avoid neural dependencies unless already present.

### 11.11 — Deep Q-Networks   [notebook: 11.11-deep-q-networks.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Atari-style control — neural approximator trains on Bellman targets; illustrative 4 actions.
2. Robotics from pixels — replace $|S|\times|A|$ table with network output per action.
3. Recommendation slate control — replay stabilizes delayed reward learning; illustrative 100 transitions.
4. Traffic signal control — target includes $r+\gamma\max Q(s')$ with $0\le\gamma<1$.
5. Game tutorials — target networks reduce moving-target bootstrapping from lesson pitfall.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `tiny_dqn()` uses a small NumPy/torch MLP to verify D1 Q-targets against tabular Q-learning.
- Datasets D1–D5: environments of rising difficulty — D1 2-state chain · D2 slippery 3-state · D3 4x4 gridworld · D4 stochastic/windy grid · D5 larger sparse-reward grid
- Metric: return across all rungs
- Closing viz: (a) value/policy heatmap panels per env (b) return vs episodes
- Pitfall on D5: bootstrapping from a moving target, reproduced without replay/target network then fixed with both.
- Notes: delete conv2d/iou/edit_distance/ce/kl if unused; CPU-only; tiny network only.

### 11.12 — DQN variants (Double, Dueling, PER, Rainbow)   [notebook: 11.12-dqn-variants.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Game control — Double DQN reduces max over-estimation; illustrative 2-action tie.
2. Robot navigation — dueling splits state value and action advantage; $V$ vs $Q$ lesson shapes.
3. Recommenders — prioritized replay samples high-error transitions; illustrative top 20% priorities.
4. Traffic control — variant stack targets bootstrapped instability from lesson pitfall.
5. Sparse-reward games — Rainbow-style components improve return under $0\le\gamma<1$.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `double_dueling_per_step()` verifies Double target selection/evaluation on a 2-state MDP.
- Datasets D1–D5: environments of rising difficulty — D1 2-state chain · D2 slippery 3-state · D3 4x4 gridworld · D4 stochastic/windy grid · D5 larger sparse-reward grid
- Metric: return across all rungs
- Closing viz: (a) value/policy heatmap panels per env (b) return vs episodes for vanilla vs variant
- Pitfall on D5: bootstrapping from a moving target, reproduced as over-estimation then fixed with Double target + replay.
- Notes: delete dead template code; CPU-only; implement minimal variants, not full Rainbow.

### 11.13 — Distributional RL (C51, QR-DQN)   [notebook: 11.13-distributional-rl.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Risk-aware robotics — store return spread $Z(s,a)$, not only mean $Q$.
2. Finance execution — compare downside quantiles; illustrative 5 atoms/quantiles.
3. Game AI — same mean return can hide different outcome distributions.
4. Autonomous driving sim — rare bad returns matter despite high expected $V$.
5. Inventory control — discounted random return uses $Z(s,a)\stackrel{D}{=}R+\gamma Z(s',a')$ from lesson.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `distributional_backup()` propagates a tiny categorical/quantile return distribution and verifies its mean matches D1 Bellman value.
- Datasets D1–D5: environments of rising difficulty — D1 2-state stochastic reward chain · D2 slippery 3-state · D3 4x4 gridworld · D4 stochastic/windy grid · D5 larger sparse-reward grid
- Metric: value-error vs known optimum plus return spread tracked consistently
- Closing viz: (a) value/policy heatmap panels per env with uncertainty overlay (b) value-error vs episodes
- Pitfall on D5: confusing reward with return, reproduced by plotting immediate reward distribution then fixed by discounted return distribution.
- Notes: delete dead helpers; CPU-only; small atom count.

### 11.14 — Policy gradients (REINFORCE)   [notebook: 11.14-policy-gradients-reinforce.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Dialogue policy selection — increase log-probability of rewarded actions per lesson gradient.
2. Robot grasp choices — stochastic policy $\pi(a\mid s)$ over illustrative 3 grasps.
3. Game control — complete returns weight $\nabla\log\pi$ updates.
4. Ad bidding policy — optimize parameters directly rather than filling $Q$ table.
5. Treatment policies — advantage $A_t$ in lesson formula can reduce update noise.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `reinforce()` verifies one log-probability gradient step on a 2-state chain with known return.
- Datasets D1–D5: environments of rising difficulty — D1 2-state chain · D2 slippery 3-state · D3 4x4 gridworld · D4 stochastic/windy grid · D5 larger sparse-reward grid
- Metric: return across all rungs
- Closing viz: (a) value/policy heatmap panels per env (b) return vs episodes
- Pitfall on D5: confusing reward with return, reproduced by weighting actions by immediate reward then fixed with full episode return/baseline.
- Notes: delete dead template code; CPU-only; keep softmax policy tiny.

### 11.15 — Actor–Critic (A2C/A3C)   [notebook: 11.15-actor-critic.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Game agents — actor chooses, critic estimates $V$; lesson distinguishes $V$ and $Q$ shapes.
2. Robot control — critic provides advantage $A_t$ for lower-variance policy updates.
3. Traffic signals — one policy probability $\pi(a\mid s)$ per signal action.
4. Recommender sequencing — actor improves while critic bootstraps from $r+\gamma V(s')$.
5. Operations scheduling — illustrative 4 actions scored by actor logits.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `actor_critic_step()` verifies critic TD error and actor log-prob update on D1.
- Datasets D1–D5: environments of rising difficulty — D1 2-state chain · D2 slippery 3-state · D3 4x4 gridworld · D4 stochastic/windy grid · D5 larger sparse-reward grid
- Metric: return across all rungs
- Closing viz: (a) value/policy heatmap panels per env (b) return vs episodes
- Pitfall on D5: bootstrapping from a moving target, reproduced with unstable critic updates then fixed with smaller critic step/advantage normalization.
- Notes: delete dead helpers; CPU-only; synchronous A2C only, no multiprocessing.

### 11.16 — Generalized Advantage Estimation   [notebook: 11.16-generalized-advantage-estimation.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Robot locomotion — tune bias-variance in advantage estimates with λ; illustrative λ=0.95.
2. Game policy training — exponentially weighted TD residuals summarize a 5-step rollout.
3. Ad sequencing — advantage $A_t$ from lesson gradient improves policy update signal.
4. Traffic policies — discount $0\le\gamma<1$ and λ jointly weight future residuals.
5. Recommenders — critic value $V$ stays $|S|$ shaped while advantages are per transition.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `gae()` computes TD residuals and λ-weighted advantages; verify by hand on a 2-state rollout.
- Datasets D1–D5: environments of rising difficulty — D1 2-state chain · D2 slippery 3-state · D3 4x4 gridworld · D4 stochastic/windy grid · D5 larger sparse-reward grid
- Metric: return across all rungs
- Closing viz: (a) value/policy heatmap panels per env (b) return vs episodes by λ
- Pitfall on D5: letting notation hide shapes, reproduced by mixing state values with per-step advantages then fixed with explicit trajectory arrays.
- Notes: delete dead template code; CPU-only; λ sweep limited.

### 11.17 — TRPO & PPO   [notebook: 11.17-trpo-ppo.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Robotics policy updates — clipped probability ratios prevent destructive jumps; illustrative clip 0.2.
2. Game agents — policy-gradient formula still uses $\nabla\log\pi(a_t\mid s_t)A_t$.
3. Recommendation policies — trust region limits change in action probabilities.
4. Traffic signals — compare old vs new $\pi(a\mid s)$ for each action.
5. Scheduling control — stable updates matter because data distribution changes after policy moves.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `ppo_clip_step()` verifies a clipped policy-gradient objective on D1 advantages.
- Datasets D1–D5: environments of rising difficulty — D1 2-state chain · D2 slippery 3-state · D3 4x4 gridworld · D4 stochastic/windy grid · D5 larger sparse-reward grid
- Metric: return across all rungs
- Closing viz: (a) value/policy heatmap panels per env (b) return vs episodes, clipped vs unclipped
- Pitfall on D5: bootstrapping from a moving target, reproduced as destructive policy jumps then fixed with PPO clipping.
- Notes: delete dead helpers; CPU-only; implement PPO-style clip, not full TRPO conjugate gradients.

### 11.18 — DDPG & TD3   [notebook: 11.18-ddpg-td3.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Robot arm control — deterministic continuous action from actor; illustrative scalar torque in [-1,1].
2. Autonomous driving sim — critic differentiates action value for smooth steering.
3. HVAC control — continuous setpoints replace discrete $|A|$ table.
4. Finance execution — TD3 twin critics reduce over-estimated $Q$ targets.
5. Drone control — target uses discounted future value with $0\le\gamma<1$.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `deterministic_actor_critic()` verifies a scalar continuous-action critic target on a 2-state control toy.
- Datasets D1–D5: environments of rising difficulty — D1 2-state scalar-action chain · D2 slippery 3-state with continuous push · D3 4x4 grid with continuous drift · D4 stochastic/windy grid · D5 tiny hand-rolled CartPole-like sim, CPU-only
- Metric: return across all rungs
- Closing viz: (a) value/policy heatmap or action-field panels per env (b) return vs episodes
- Pitfall on D5: bootstrapping from a moving target, reproduced by single-critic over-estimation then fixed with twin critics/target smoothing.
- Notes: delete dead template code; CPU-only; no gym download.

### 11.19 — Soft Actor-Critic   [notebook: 11.19-soft-actor-critic.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Robot manipulation — entropy keeps useful randomness; illustrative 2 stochastic actions.
2. Autonomous driving sim — robust exploration under uncertain transitions.
3. Recommender exploration — policy randomness is part of objective, not mere noise.
4. HVAC control — reward plus entropy balances comfort and exploration.
5. Game control — advantage-style policy update from lesson gradient still applies.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `soft_policy_update()` verifies reward-plus-entropy objective on a 2-state chain.
- Datasets D1–D5: environments of rising difficulty — D1 2-state chain · D2 slippery 3-state · D3 4x4 gridworld · D4 stochastic/windy grid · D5 larger sparse-reward grid or tiny continuous CartPole-like sim
- Metric: return across all rungs
- Closing viz: (a) value/policy entropy heatmap panels per env (b) return vs episodes
- Pitfall on D5: confusing reward with return, reproduced by dropping entropy/discounted future return then fixed with soft return objective.
- Notes: delete dead helpers; CPU-only; tiny softmax/Gaussian policy only.

### 11.20 — Model-based RL & world models   [notebook: 11.20-model-based-rl-world-models.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Robot planning — learn/use transition model $P(s'\mid s,a)$ from lesson formula.
2. Logistics simulation — imagine consequences before acting; illustrative 3-step rollouts.
3. Game agents — world model predicts reward $R$ and next state.
4. Traffic control — planning sweeps compute $R+\gamma V(s')$ in learned model.
5. Data-center control — sample efficiency matters when real actions are costly.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `learn_model_and_plan()` estimates $P,R$ then performs Bellman planning; verify against true D1 model.
- Datasets D1–D5: environments of rising difficulty — D1 2-state chain · D2 slippery 3-state · D3 4x4 gridworld · D4 stochastic/windy grid · D5 larger sparse-reward grid
- Metric: return across all rungs
- Closing viz: (a) value/policy heatmap panels per env (b) return vs model samples/episodes
- Pitfall on D5: bootstrapping from a moving target, reproduced with model bias compounding through rollouts then fixed by short rollouts/model refresh.
- Notes: delete dead template code; CPU-only; no large simulators.

### 11.21 — Exploration (ε-greedy, UCB, intrinsic motivation)   [notebook: 11.21-exploration.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. A/B testing — spend trials to learn; UCB term $c\sqrt{2\ln t/N_a}$ from lesson.
2. Recommenders — epsilon-greedy explores unseen items; illustrative ε=0.1.
3. Robotics — intrinsic rewards encourage visiting novel states in sparse tasks.
4. Ad bidding — regret tracks reward lost while learning; illustrative 5 arms.
5. Clinical trial allocation — arm counts $N_a$ prevent choosing from one lucky sample.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `select_action_explore()` verifies ε-greedy and UCB score on a 2-arm bandit by hand.
- Datasets D1–D5: bandit ladder — D1 2 arms, fixed means · D2 3 arms, low variance · D3 5 arms, high variance/close means · D4 contextual 2-feature bandit · D5 sparse-reward bandit/grid hybrid
- Metric: regret across all rungs
- Closing viz: (a) arm-selection/value panels per env (b) cumulative regret vs pulls/episodes
- Pitfall on D5: ignoring policy support, reproduced by under-exploring rare arm/state then fixed with UCB/intrinsic bonus.
- Notes: delete dead helpers; CPU-only; bandit ladder rather than grid ladder.

### 11.22 — Multi-armed & contextual bandits   [notebook: 11.22-bandits.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Homepage ranking — one-step action pays now; no state transition per lesson tagline.
2. Ads allocation — UCB score uses $\hat\mu_a+c\sqrt{2\ln t/N_a}$.
3. Email subject testing — illustrative 4 arms and cumulative regret.
4. Clinical trials — contextual bandit uses patient features; illustrative 2 features.
5. Price experimentation — arm value estimates $\hat\mu_a$ update after observed reward.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `bandit_ucb()` verifies 2-arm empirical mean and UCB calculation by hand.
- Datasets D1–D5: bandit ladder — D1 2 Bernoulli arms · D2 3 low-variance arms · D3 5 close/high-variance arms · D4 contextual linear bandit · D5 nonstationary/sparse-reward contextual bandit
- Metric: regret across all rungs
- Closing viz: (a) arm/context policy panels per rung (b) cumulative regret vs pulls
- Pitfall on D5: ignoring policy support, reproduced with an unsampled context-action pair then fixed with forced exploration/UCB.
- Notes: delete dead template code; CPU-only; no environment downloads.

### 11.23 — Hierarchical RL & options   [notebook: 11.23-hierarchical-rl-options.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Warehouse robots — option “go to aisle” compresses many primitive moves; illustrative 4-step option.
2. Game AI — skills become temporally extended actions with stopping rules.
3. Web task automation — macro-actions reduce long-horizon decision depth.
4. Robot navigation — option policy still uses $\pi(a\mid s)$ internally.
5. Traffic corridors — option value bootstraps with $R+\gamma V(s')$ after termination.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `option_value_iteration()` verifies a temporally extended action and stopping rule on D1.
- Datasets D1–D5: environments of rising difficulty — D1 2-state chain with one option · D2 slippery 3-state · D3 4x4 gridworld rooms · D4 stochastic/windy grid with subgoals · D5 larger sparse-reward grid with bottlenecks
- Metric: return across all rungs
- Closing viz: (a) value/policy/option heatmap panels per env (b) return vs episodes
- Pitfall on D5: confusing reward with return, reproduced by rewarding option length incorrectly then fixed with discounted option returns.
- Notes: delete dead helpers; CPU-only; hand-coded options.

### 11.24 — POMDPs   [notebook: 11.24-pomdps.ipynb]   (family: F12, gap)

**Lesson — Real World Applications (5):**
1. Robot localization — hidden state becomes belief distribution $b(s)$ from lesson formula.
2. Medical diagnosis — observation likelihood $O(o\mid s',a)$ updates belief; illustrative 2 diseases.
3. Dialogue systems — user intent hidden; belief over states replaces direct state.
4. Search-and-rescue — sensor readings partially reveal location; illustrative 3 observations.
5. Fraud detection workflows — actions change future observations, not always true state visibility.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `belief_update()` verifies $b'(s')=\eta O(o\mid s',a)\sum_sP(s'\mid s,a)b(s)$ on a 2-state hidden MDP.
- Datasets D1–D5: environments of rising difficulty — D1 2-state hidden chain · D2 slippery 3-state with noisy observations · D3 4x4 gridworld with local sensors · D4 stochastic/windy grid with sensor dropout · D5 larger sparse-reward partially observed grid
- Metric: return across all rungs
- Closing viz: (a) belief/value/policy heatmap panels per env (b) return vs episodes
- Pitfall on D5: letting notation hide shapes, reproduced by treating observations as states then fixed with explicit belief vectors.
- Notes: delete dead template code; CPU-only; gap topic, lesson body likely needs authoring before citing beyond formula.

### 11.25 — Reward shaping   [notebook: 11.25-reward-shaping.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Robot navigation — reward progress toward goal while preserving final policy; illustrative +0.1 progress.
2. Game tutorials — dense shaping helps sparse win reward; return still discounted by $0\le\gamma<1$.
3. Education platforms — partial-credit hints shape learning path without changing objective.
4. Traffic control — shaping rewards queue reduction between states.
5. Warehouse routing — potential-based guidance must not alter optimal route.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `potential_shaping()` verifies shaped and unshaped optimal policy agree on D1.
- Datasets D1–D5: environments of rising difficulty — D1 2-state chain · D2 slippery 3-state · D3 4x4 gridworld · D4 stochastic/windy grid · D5 larger sparse-reward grid
- Metric: return across all rungs
- Closing viz: (a) value/policy heatmap panels per env (b) return vs episodes, shaped vs sparse
- Pitfall on D5: confusing reward with return, reproduced by non-potential shaping that changes optimum then fixed with potential-based shaping.
- Notes: delete dead helpers; CPU-only; include policy-equivalence assertion on D1.

### 11.26 — Goal-conditioned RL & hindsight replay   [notebook: 11.26-goal-conditioned-rl-hindsight.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Robot reaching — failed trajectory becomes success for the goal it reached; illustrative 2 goals.
2. Navigation apps — policy indexed by destination goal as lesson states.
3. Game quests — replay relabels missed target as achieved subgoal.
4. Warehouse picking — same state/action data trains multiple goal labels.
5. Personalization — desired outcome conditions action choice, not just current state.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `goal_q_with_her()` verifies goal-indexed value update and hindsight relabel on D1.
- Datasets D1–D5: environments of rising difficulty — D1 2-state two-goal chain · D2 slippery 3-state goals · D3 4x4 gridworld goals · D4 stochastic/windy grid goals · D5 larger sparse-reward multi-goal grid
- Metric: goal-conditioned success return across all rungs
- Closing viz: (a) goal-conditioned value/policy heatmaps per env (b) success return vs episodes
- Pitfall on D5: ignoring policy support, reproduced with unreached goals lacking data then fixed with hindsight replay relabeling.
- Notes: delete dead template code; CPU-only; tiny replay buffer.

### 11.27 — Multi-agent RL   [notebook: 11.27-multi-agent-rl.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Market bidding — payoff depends on other adaptive policies; illustrative 2 agents.
2. Traffic intersections — each controller changes others' transition dynamics.
3. Multiplayer games — opponent policy makes environment nonstationary.
4. Fleet coordination — joint action space grows like product of each agent's actions; illustrative 2x2.
5. Resource allocation — value still uses expected rewards under policies $\pi(a\mid s)$.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `independent_q_agents()` verifies a 2-agent, 2-action matrix-game update by hand.
- Datasets D1–D5: environments of rising difficulty — D1 2-agent 2-state coordination chain · D2 slippery 3-state shared goal · D3 4x4 gridworld two agents · D4 stochastic/windy grid with interference · D5 larger sparse-reward cooperative/competitive grid
- Metric: return across all rungs
- Closing viz: (a) joint value/policy heatmap panels per env (b) return vs episodes
- Pitfall on D5: bootstrapping from a moving target, reproduced as nonstationarity from learning opponents then fixed with frozen/opponent-average baselines.
- Notes: delete dead helpers; CPU-only; two agents only.

### 11.28 — Imitation & inverse RL   [notebook: 11.28-imitation-inverse-rl.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Autonomous driving — learn actions from expert demonstrations; illustrative 20 demo steps.
2. Robotics — infer reward that explains expert behavior, then optimize return.
3. Game bots — clone expert policy probabilities $\pi(a\mid s)$.
4. Customer-support routing — demonstrations reveal action choices without explicit reward.
5. Surgical-assist training — compare learned policy return to expert return $G$.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `behavior_clone_and_reward_fit()` clones D1 expert actions and checks recovered value under inferred/known reward.
- Datasets D1–D5: environments of rising difficulty — D1 2-state expert chain · D2 slippery 3-state demos · D3 4x4 gridworld demos · D4 stochastic/windy grid demos · D5 larger sparse-reward grid with imperfect demos
- Metric: return across all rungs
- Closing viz: (a) expert vs learned policy heatmap panels per env (b) return vs demonstrations
- Pitfall on D5: ignoring policy support, reproduced as compounding errors outside demo states then fixed with data aggregation/noise augmentation.
- Notes: delete dead template code; CPU-only; no external demos.

### 11.29 — Offline RL   [notebook: 11.29-offline-rl.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Healthcare treatment policies — improve from fixed logs without unsafe exploration.
2. Ads bidding — logged behavior covers only sampled actions; cite lesson support pitfall.
3. Robotics logs — no new environment queries; illustrative 100 transitions.
4. Recommenders — constrain learned policy near behavior data coverage.
5. Fleet dispatch — safety/cost budget resembles lesson constrained objective $C(\pi)\le d$.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `offline_conservative_q()` verifies behavior-support masks and conservative update on D1 logged data.
- Datasets D1–D5: environments of rising difficulty — D1 2-state logged chain · D2 slippery 3-state logs · D3 4x4 gridworld logged policy · D4 stochastic/windy logged grid · D5 larger sparse-reward grid with narrow support
- Metric: value-error vs known optimum under support constraints across all rungs
- Closing viz: (a) support/value/policy heatmap panels per env (b) value-error/return vs dataset size
- Pitfall on D5: ignoring policy support, reproduced by choosing unseen actions then fixed with conservative penalties/masks.
- Notes: delete dead helpers; CPU-only; fixed datasets generated inline.

### 11.30 — Meta-RL   [notebook: 11.30-meta-rl.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Robots across rooms — adapt quickly when goal location changes; illustrative 5 related tasks.
2. Game levels — learn update strategy across related maps.
3. Personalized tutoring — adapt policy after few learner interactions.
4. Traffic systems — transfer signal policy across intersections with different transitions.
5. Recommendation sessions — warm-start exploration based on previous users/tasks.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `meta_warm_start_q()` learns an initialization across tiny 2-state tasks and verifies faster adaptation on held-out D1 variant.
- Datasets D1–D5: environments of rising difficulty — D1 family of 2-state chains · D2 slippery 3-state task family · D3 4x4 gridworld goal family · D4 stochastic/windy grid variants · D5 larger sparse-reward grid task family
- Metric: return after fixed adaptation episodes across all rungs
- Closing viz: (a) adapted value/policy heatmap panels per env (b) return vs adaptation episodes
- Pitfall on D5: confusing reward with return, reproduced by meta-learning immediate rewards only then fixed with discounted task returns.
- Notes: delete dead template code; CPU-only; simple warm-start, not full MAML.

### 11.31 — Safe & constrained RL   [notebook: 11.31-safe-constrained-rl.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Autonomous driving — optimize reward subject to cost budget $C(\pi)\le d$ from lesson.
2. Robotics — avoid unsafe cells while collecting goal reward; illustrative cost limit 1.
3. Medical treatment — cap adverse-event cost while improving return.
4. Data-center control — energy/cooling constraints become mathematical budgets.
5. Finance execution — risk budget constrains policy, not just reward maximization.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `constrained_policy_eval()` verifies reward/cost return and budget check on D1.
- Datasets D1–D5: environments of rising difficulty — D1 2-state chain with one costly action · D2 slippery 3-state hazards · D3 4x4 gridworld hazards · D4 stochastic/windy grid hazards · D5 larger sparse-reward grid with safety traps
- Metric: constrained return across all rungs
- Closing viz: (a) value/policy/cost heatmap panels per env (b) return and cost vs episodes
- Pitfall on D5: confusing reward with return, reproduced by maximizing reward while violating cost return then fixed with Lagrangian/feasible action mask.
- Notes: delete dead helpers; CPU-only; report budget violations.

### 11.32 — Sim-to-real transfer   [notebook: 11.32-sim-to-real-transfer.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Robot locomotion — train in simulation and survive transition mismatch; illustrative 10% slip change.
2. Drone control — wind mismatch tests robustness.
3. Autonomous driving — simulator rewards differ from real edge cases.
4. Warehouse robots — domain randomization varies $P(s'\mid s,a)$ from lesson formula.
5. HVAC control — learned policy evaluated under shifted dynamics.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `train_with_domain_randomization()` verifies D1 policy under nominal vs shifted transition probabilities.
- Datasets D1–D5: environments of rising difficulty — D1 2-state chain with sim/real slip · D2 slippery 3-state shift · D3 4x4 gridworld shift · D4 stochastic/windy grid domain randomization · D5 larger sparse-reward grid with unseen dynamics
- Metric: transfer return across all rungs
- Closing viz: (a) sim vs real value/policy heatmap panels per env (b) return vs shift size/episodes
- Pitfall on D5: bootstrapping from a moving target, reproduced by overfitting simulator dynamics then fixed with randomized transitions.
- Notes: delete dead template code; CPU-only; no external simulator.

### 11.33 — Decision transformers (RL as sequence modeling)   [notebook: 11.33-decision-transformers.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Offline robot control — predict next action conditioned on desired return $R_t$ from lesson formula.
2. Game trajectories — sequence model consumes states/actions/returns; illustrative context length 4.
3. Recommendation sessions — condition actions on target session return.
4. Web task automation — use history $(s_1,a_1,\ldots,s_t)$ to choose next action.
5. Fleet dispatch logs — sequence modeling avoids online exploration during training.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `return_conditioned_policy()` fits a tiny sequence/logistic model to D1 trajectories and verifies action prediction conditioned on target return.
- Datasets D1–D5: environments of rising difficulty — D1 2-state trajectory set · D2 slippery 3-state trajectories · D3 4x4 gridworld trajectories · D4 stochastic/windy grid logs · D5 larger sparse-reward offline trajectories
- Metric: return across all rungs
- Closing viz: (a) trajectory-conditioned policy heatmap panels per env (b) achieved return vs requested return/episodes
- Pitfall on D5: ignoring policy support, reproduced by requesting returns absent from data then fixed with return clipping/support checks.
- Notes: delete dead helpers; CPU-only; tiny model, no transformer dependency unless already available.

### 11.34 — Self-play & population-based training   [notebook: 11.34-self-play-population.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Board games — yesterday's policy becomes today's opponent; illustrative 2-player game.
2. Cyber-defense drills — evolving attacker creates curriculum.
3. Auction strategy — population exposes policy to multiple competitors.
4. Sports simulation — agents improve against a pool, not fixed script.
5. Negotiation bots — payoff depends on adaptive opponent policy.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `self_play_update()` verifies policy evaluation against a previous-policy opponent in a 2-state/2-action game.
- Datasets D1–D5: environments of rising difficulty — D1 2-state matrix game · D2 slippery 3-state duel · D3 4x4 gridworld pursuit · D4 stochastic/windy competitive grid · D5 larger sparse-reward self-play grid
- Metric: return across all rungs
- Closing viz: (a) value/policy/opponent heatmap panels per env (b) return/Elo-like score vs generations
- Pitfall on D5: bootstrapping from a moving target, reproduced by chasing only latest opponent then fixed with opponent population/replay.
- Notes: delete dead template code; CPU-only; tiny population.

### 11.35 — AlphaGo / AlphaZero / MuZero   [notebook: 11.35-alphago-alphazero-muzero.ipynb]   (family: F12)

**Lesson — Real World Applications (5):**
1. Board-game AI — combine policy, value, and lookahead search; illustrative 9-cell game.
2. Planning robots — learned value guides tree search over actions.
3. Game tutorials — self-play improves policy and search together.
4. Scheduling search — learned dynamics/value reduce exhaustive branching.
5. Simulator-free planning — MuZero-style model predicts dynamics needed for search.

**Notebook plan:**
- Family: F12 Sequential-Decision/RL
- Concept built once (D1): `mcts_with_value_policy()` verifies a tiny search backup guided by learned/hand value on a 2-state game.
- Datasets D1–D5: environments of rising difficulty — D1 2-state game tree · D2 slippery 3-state game · D3 4x4 gridworld planning game · D4 stochastic/windy grid with lookahead · D5 larger sparse-reward grid or tiny tic-tac-toe subset
- Metric: return across all rungs
- Closing viz: (a) search-guided value/policy heatmap panels per env (b) return vs search simulations/generations
- Pitfall on D5: confusing reward with return, reproduced by shallow immediate-reward search then fixed with value-backed discounted lookahead.
- Notes: delete dead helpers; CPU-only; minimal MCTS, no external engines.
