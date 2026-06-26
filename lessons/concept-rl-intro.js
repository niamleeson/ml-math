/* Reinforcement Learning — "What RL is: the agent–environment loop, return, exploration vs.
   exploitation, and credit assignment". This is the front door of the rl-* curriculum.
   Self-contained: lesson + CODE + CODEVIZ merged by id "rl-intro". */
(function () {
  window.LESSONS.push({
    id: "rl-intro",
    title: "Reinforcement Learning: learning to act from reward, not from labels",
    tagline: "An agent acts in an environment, sees a reward, and tries to maximize total reward over time — nobody tells it the right answer.",
    module: "Reinforcement Learning",
    prereqs: ["ai-mdp", "ai-q-learning", "mod-dqn", "prob-expectation"],

    whenToUse:
      `<p><b>Reach for RL (Reinforcement Learning) when you face sequential decisions under a delayed reward
       signal</b> — you act, the world changes, and only some time later do you learn whether the choices were
       good. There is no answer key. There is only a number (the reward) that you are trying to make big over
       the long run.</p>
       <ul>
         <li><b>Use RL when:</b> the task is a sequence of decisions (a move now changes what you face next);
         feedback is a <i>reward</i>, not a labeled correct action; the reward is often <b>delayed</b> (the win
         comes many moves after the move that earned it) and <b>sparse</b> (mostly zero, with a rare payoff);
         and you can <i>interact</i> with the system (a real or simulated environment) to gather experience.
         Games, robotics, control, recommendation, and RLHF (Reinforcement Learning from Human Feedback) all
         fit this shape.</li>
         <li><b>Do NOT use RL when:</b> you already have labeled input&rarr;output pairs. If a teacher can tell
         you the right answer for each input, that is <b>supervised learning</b> (see <code>ml-supervised</code>)
         — it is far cheaper, more stable, and more sample-efficient. Forcing RL onto a labeled problem throws
         away the labels and replaces them with a noisy reward you have to discover.</li>
       </ul>
       <p>Rule of thumb: <b>if you can hand the model the correct answer, do supervised learning. If you can only
       score its behavior after the fact, you are in RL.</b></p>`,

    application:
      `<p>RL is the framework behind <i>agents that act</i>:</p>
       <ul>
         <li><b>Games.</b> Backgammon, Atari, Go, StarCraft, and chess engines that learn by self-play —
         delayed reward (you only know you won at the end) is the defining challenge.</li>
         <li><b>Robotics &amp; control.</b> Locomotion, grasping, balancing, datacenter cooling — continuous
         action, expensive real-world samples (see <code>robotics-control</code>).</li>
         <li><b>Recommendation.</b> Sequential recommendation and ad bidding, where today's recommendation
         changes which users return tomorrow — a long-horizon reward, not a one-shot click prediction.</li>
         <li><b>RLHF (Reinforcement Learning from Human Feedback).</b> Aligning large language models: a learned
         reward model scores responses, and RL (typically PPO, Proximal Policy Optimization) tunes the model to
         earn high reward. This is how chat assistants are polished.</li>
       </ul>
       <p><b>The rl-* curriculum map (front door &rarr; branches).</b> This lesson is the entry point. From here
       the family forward-links into: the <b>MDP (Markov Decision Process)</b> formalism (state, action,
       transition, reward — see <code>ai-mdp</code>); <b>value iteration</b> and <b>policy iteration</b> for
       <i>planning</i> when the model is known (<code>ai-value-iteration</code>, <code>ai-policy-value</code>);
       <b>Monte Carlo</b> and <b>TD (Temporal Difference)</b> learning for <i>learning</i> values from raw
       experience (<code>aix-monte-carlo</code>, <code>aix-sarsa-td</code>); <b>Q-learning</b> and <b>SARSA</b>,
       the workhorse tabular control methods (<code>ai-q-learning</code>); then <b>deep RL</b> —
       <b>DQN (Deep Q-Network)</b> (<code>mod-dqn</code>), <b>policy gradients</b>
       (<code>mod-policy-gradient</code>), and <b>actor&ndash;critic</b> (<code>mod-actor-critic</code>) — which
       swap tables for neural networks. Start here, then follow whichever branch your problem needs.</p>`,

    pitfalls:
      `<ul>
         <li><b>Reward design is everything (reward hacking).</b> The agent optimizes the reward you <i>wrote</i>,
         not the goal you <i>meant</i>. A boat-racing agent told to maximize score learned to spin in circles
         hitting bonus targets and never finish the race. Fix: reward the true outcome, sparingly; test for
         loopholes; watch behavior, not just the reward curve.</li>
         <li><b>Sparse and delayed rewards.</b> If reward is zero almost everywhere and only arrives at the very
         end, the agent gets almost no signal and learning crawls. Fix: shape intermediate rewards carefully
         (without opening hacking loopholes), use curricula, or use exploration bonuses.</li>
         <li><b>Sample inefficiency.</b> RL can need millions of interactions to learn what supervised learning
         gets from one labeled pass. Fix: use a fast simulator, off-policy replay, or model-based RL; never burn
         real-world samples when a labeled solution exists.</li>
         <li><b>Non-stationarity.</b> The data the agent sees depends on its <i>current</i> policy, which keeps
         changing — so the training distribution moves under your feet. Fix: replay buffers, target networks,
         and trust-region updates (PPO) stabilize the moving target.</li>
         <li><b>Treating it like supervised learning.</b> There are no fixed labels; the agent's own actions
         generate its data, and a greedy "always pick the current best" agent stops exploring and gets stuck.
         Fix: respect the exploration&ndash;exploitation tradeoff (below) — keep trying alternatives.</li>
       </ul>`,

    bigIdea:
      `<p><b>Reinforcement Learning (RL)</b> is learning <i>how to act</i> from <i>reward</i>. There is no teacher
       handing you correct answers. There is a world you can act in, and a number — the <b>reward</b> — that you
       are trying to make large over time.</p>
       <p>The whole subject is one loop. At each time step the <b>agent</b> looks at the current <b>state</b>,
       chooses an <b>action</b>, and the <b>environment</b> answers with a <b>reward</b> and a next state. The
       agent's goal is not the next reward — it is the <b>return</b>: the total (discounted) reward summed over
       the whole future.</p>
       <p>That single loop forces two challenges that no supervised problem has: <b>exploration vs.
       exploitation</b> (do I try something new, or cash in what I know works?) and <b>credit assignment</b>
       (a reward arrives now — which of my <i>earlier</i> actions deserves the credit?).</p>`,

    buildup:
      `<p><b>The agent&ndash;environment loop.</b> Time ticks $t = 0, 1, 2, \\ldots$. At step $t$:</p>
       <ol>
         <li>The agent observes the <b>state</b> $S_t$ (its situation right now).</li>
         <li>It picks an <b>action</b> $A_t$ using its <b>policy</b> $\\pi$ (its rule for choosing).</li>
         <li>The <b>environment</b> responds with a <b>reward</b> $R_{t+1}$ and a next state $S_{t+1}$.</li>
         <li>Repeat from the new state.</li>
       </ol>
       <p>This produces a stream $S_0, A_0, R_1, S_1, A_1, R_2, S_2, \\ldots$ called a <b>trajectory</b>. The
       environment is usually modeled as an <b>MDP (Markov Decision Process)</b> — "Markov" meaning the next
       state and reward depend only on the current state and action, not the whole history (see
       <code>ai-mdp</code>).</p>
       <p><b>Why not just maximize the next reward?</b> Because a good move now can pay off only much later (a
       sacrifice in chess, a long detour that reaches the goal). So the agent must value the <i>future</i>, not
       just the immediate reward. That is the <b>return</b>, defined below.</p>
       <p><b>How RL differs from the other paradigms.</b></p>
       <ul>
         <li><b>vs. supervised learning:</b> supervised learning is given $(x, y)$ pairs — the right answer
         $y$ for each input $x$. RL is given <i>no</i> right answer, only a scalar reward that says "that was
         good/bad," often long after the action and mostly zero. The agent must <i>discover</i> good behavior by
         trying things.</li>
         <li><b>vs. unsupervised learning:</b> unsupervised learning has no reward and no labels at all — it
         finds structure (clusters, embeddings) in unlabeled data. RL <i>does</i> have a goal signal (the
         reward); it just is not a per-example label.</li>
       </ul>`,

    symbols: [
      { sym: "$t$", desc: "the discrete time step (an integer): $t = 0, 1, 2, \\ldots$. The loop runs one step per tick." },
      { sym: "$S_t$", desc: "the state at step $t$ — the agent's situation right now (e.g. a board position, a robot's joint angles)." },
      { sym: "$A_t$", desc: "the action the agent takes at step $t$ (e.g. move right, apply torque)." },
      { sym: "$R_{t+1}$", desc: "the reward the environment returns for taking $A_t$ in $S_t$. The subscript $t+1$ is a convention: the reward arrives with the next state." },
      { sym: "$\\pi$", desc: "the policy (Greek 'pi'): the agent's rule for choosing actions. $\\pi(a\\mid s)$ is the probability of action $a$ in state $s$." },
      { sym: "$G_t$", desc: "the return from step $t$: the total discounted reward from $t$ onward. This is what the agent maximizes — NOT the single reward $R_{t+1}$." },
      { sym: "$\\gamma$", desc: "the discount factor (Greek 'gamma'), a number with $0 \\le \\gamma \\le 1$. It shrinks rewards that arrive later: $\\gamma$ near $1$ is far-sighted, $\\gamma$ near $0$ is myopic (only the next reward matters)." },
      { sym: "$\\gamma^k$", desc: "$\\gamma$ raised to the power $k$: the weight on a reward that arrives $k$ steps in the future. Larger $k$ means a smaller weight, so far-off rewards count less." },
      { sym: "$\\mathbb{E}[\\cdot]$", desc: "the expectation (average) operator — see prob-expectation. Because actions and the environment are random, the agent maximizes the EXPECTED return, $\\mathbb{E}[G_t]$, not any single outcome." }
    ],

    formula: `$$ G_t \\;=\\; R_{t+1} + \\gamma R_{t+2} + \\gamma^2 R_{t+3} + \\cdots \\;=\\; \\sum_{k=0}^{\\infty} \\gamma^{k}\\, R_{t+k+1} \\qquad 0 \\le \\gamma \\le 1 $$`,

    whatItDoes:
      `<p>This is the <b>return</b> $G_t$ — the quantity RL exists to maximize. It adds up every future reward,
       but discounts each one by how far away it is. The reward at the very next step, $R_{t+1}$, counts fully
       (its weight is $\\gamma^0 = 1$). The reward two steps out, $R_{t+2}$, is scaled by $\\gamma$. Three steps
       out, by $\\gamma^2$. In general the reward $k$ steps ahead is weighted by $\\gamma^k$.</p>
       <p>The agent's objective is to choose actions (a policy $\\pi$) that make the <i>expected</i> return
       $\\mathbb{E}[G_t]$ as large as possible — expected, because both the policy and the environment can be
       random, so any single run is a roll of the dice.</p>`,

    derivation:
      `<p><b>Why discount at all (why $\\gamma$)?</b> Three reasons, each sufficient on its own.</p>
       <ol>
         <li><b>It keeps the sum finite.</b> If the task never ends and every reward is, say, $+1$, then the
         undiscounted sum $1 + 1 + 1 + \\cdots$ is infinite and meaningless — you cannot compare two infinite
         returns. With $0 \\le \\gamma \\lt 1$ the geometric series converges: a bounded reward $|R| \\le R_{\\max}$
         gives $|G_t| \\le R_{\\max}\\sum_{k=0}^{\\infty}\\gamma^{k} = \\dfrac{R_{\\max}}{1-\\gamma}$, a finite number.
         The key fact used is the geometric series $\\sum_{k=0}^{\\infty}\\gamma^{k} = \\dfrac{1}{1-\\gamma}$ for
         $|\\gamma| \\lt 1$.</li>
         <li><b>Sooner is usually better.</b> A reward now is worth more than the same reward later (think of
         interest on money, or the risk that the episode ends first). $\\gamma$ encodes that preference: the
         further out a reward, the more it is shrunk.</li>
         <li><b>It expresses uncertainty about the future.</b> Read $\\gamma$ as a per-step survival probability:
         with probability $1-\\gamma$ the world "ends" at each step, so a reward $k$ steps away is only collected
         with probability $\\gamma^k$ — exactly the discount weight.</li>
       </ol>
       <p><b>The recursive form (the seed of every value method).</b> Peel the first reward off the sum:</p>
       $$ G_t = R_{t+1} + \\gamma\\big(R_{t+2} + \\gamma R_{t+3} + \\cdots\\big) = R_{t+1} + \\gamma\\, G_{t+1}. $$
       <p>So the return now equals the immediate reward plus the discounted return from the next step. Taking
       expectations of this one line, under a policy $\\pi$, gives the <b>Bellman equation</b> that
       <code>ai-value-iteration</code>, <code>aix-sarsa-td</code>, <code>ai-q-learning</code>, and
       <code>mod-dqn</code> all build on. The whole rl-* curriculum is, in a sense, ways to estimate
       $\\mathbb{E}[G_t]$ from experience.</p>
       <p><b>The two challenges the loop creates.</b></p>
       <ul>
         <li><b>Exploration vs. exploitation.</b> To maximize return you want to <i>exploit</i> the best action
         you currently know. But you only learn which action is best by <i>exploring</i> alternatives you are
         unsure about. Pure exploitation gets stuck on a mediocre habit; pure exploration never cashes in. Every
         RL algorithm needs a rule (e.g. $\\varepsilon$-greedy: act greedily but pick a random action with small
         probability $\\varepsilon$) to balance the two — the topic of <code>cls-bandits</code>.</li>
         <li><b>Credit assignment.</b> A reward of $+1$ arrives at the end of a 40-move game. <i>Which</i> of the
         40 actions actually caused the win? The discounted return $G_t$ is precisely the tool that flows that
         late reward backward in time to the earlier actions (each action's $G_t$ includes the eventual payoff,
         shrunk by $\\gamma$ per step). TD and Monte Carlo learning are competing answers to "how do we propagate
         credit correctly?"</li>
       </ul>`,

    example:
      `<p>A 3-step episode collects rewards $R_1 = 0$, then $R_2 = 0$, then $R_3 = +10$ (a classic
       <b>delayed, sparse</b> reward: nothing until the payoff at the end). Use discount $\\gamma = 0.9$.</p>
       <ul class="steps">
         <li>Return from the start, $G_0 = \\gamma^0 R_1 + \\gamma^1 R_2 + \\gamma^2 R_3 = 1(0) + 0.9(0) + 0.81(10) = 8.1$.</li>
         <li>Return from step 1, $G_1 = \\gamma^0 R_2 + \\gamma^1 R_3 = 0 + 0.9(10) = 9.0$.</li>
         <li>Return from step 2, $G_2 = \\gamma^0 R_3 = 10$.</li>
         <li>Sanity check the recursion $G_t = R_{t+1} + \\gamma G_{t+1}$: $G_1 = R_2 + 0.9\\,G_2 = 0 + 0.9(10) = 9$. ✓ And $G_0 = R_1 + 0.9\\,G_1 = 0 + 0.9(9) = 8.1$. ✓</li>
       </ul>
       <p><b>Credit assignment in action:</b> the only reward came at step 3, yet $G_0 = 8.1$ is positive — the
       discounted return has carried that final $+10$ all the way back to the very first action, telling the
       agent the opening move was worthwhile. That backward flow of late reward to early actions is the heart
       of RL.</p>`,

    practice: [
      {
        q: `An episode yields rewards $R_1 = 2$, $R_2 = 0$, $R_3 = 0$, $R_4 = 5$ with discount $\\gamma = 0.5$. Compute the return $G_0$ from the start.`,
        steps: [
          { do: `Write the discounted sum: $G_0 = \\gamma^0 R_1 + \\gamma^1 R_2 + \\gamma^2 R_3 + \\gamma^3 R_4$.`,
            why: `The return weights the reward $k$ steps ahead by $\\gamma^k$; here $\\gamma = 0.5$.` },
          { do: `Plug in: $1(2) + 0.5(0) + 0.25(0) + 0.125(5)$.`,
            why: `$\\gamma^0=1,\\ \\gamma^1=0.5,\\ \\gamma^2=0.25,\\ \\gamma^3=0.125$.` },
          { do: `Add: $2 + 0 + 0 + 0.625 = 2.625$.`,
            why: `Only the non-zero rewards contribute.` }
        ],
        answer: `$G_0 = 2.625$. The far-off $+5$ is discounted to $0.625$, so it counts for much less than the immediate $+2$.`
      },
      {
        q: `Why can the undiscounted return ($\\gamma = 1$) be a problem for a task that never ends, and how does $\\gamma \\lt 1$ fix it?`,
        steps: [
          { do: `With $\\gamma = 1$ every future reward counts fully, so an endless stream of positive rewards sums to infinity.`,
            why: `You cannot compare two infinite returns — the objective becomes meaningless.` },
          { do: `With $0 \\le \\gamma \\lt 1$ the weights $\\gamma^k$ shrink geometrically.`,
            why: `A bounded reward gives $|G_t| \\le R_{\\max}/(1-\\gamma)$, a finite number, via the geometric series.` }
        ],
        answer: `Discounting keeps the return finite (and well-defined) for never-ending tasks, while also encoding a preference for sooner rewards.`
      },
      {
        q: `You have a dataset of labeled (image &rarr; correct caption) pairs. Should you use RL or supervised learning, and why?`,
        steps: [
          { do: `Check whether a teacher provides the correct answer per input. Here, yes — each image has its correct caption.`,
            why: `That is exactly the supervised setting: $(x, y)$ pairs with known $y$.` },
          { do: `RL would discard those labels and replace them with a noisy, delayed reward you must discover.`,
            why: `RL is for when you can only SCORE behavior after the fact, not when the answer is handed to you.` }
        ],
        answer: `Use supervised learning. It is far more sample-efficient and stable when correct labels exist; reserve RL for sequential, delayed-reward problems with no answer key.`
      }
    ]
  });

  window.CODE["rl-intro"] = {
    lib: "gymnasium + numpy",
    runnable: false,
    explain:
      `<p>The minimal RL loop, written to run in <b>Google Colab</b>. First the setup cell installs Gymnasium
       (<code>!pip install gymnasium</code>), the standard environment API that <i>every</i> later rl-* lesson
       uses. We <code>make</code> the classic <b>CartPole-v1</b> environment, <code>reset()</code> it to get the
       first observation, then loop: pick a <b>random</b> action, <code>step()</code> the environment to get the
       reward and next observation, and accumulate the reward — until the episode ends. There is <b>no
       learning</b> here: a random agent is the baseline every learning algorithm must beat. <code>runnable</code>
       is off because the in-browser engine has no Gymnasium; paste this into Colab to run it.</p>`,
    code: `# Colab: !pip install gymnasium   (run this in the notebook's setup cell first)
import gymnasium
import numpy as np

# ============================================================
# 1. MAKE THE ENVIRONMENT
#    CartPole-v1: balance a pole on a cart. Reward = +1 per step the
#    pole stays up. Episode ends when the pole falls or 500 steps pass.
#    This gymnasium.make / reset / step / done API is used by EVERY later lesson.
# ============================================================
env = gymnasium.make("CartPole-v1")
print("observation space:", env.observation_space)   # Box(4,) cart/pole state
print("action space:     ", env.action_space)        # Discrete(2): push left / right

# ============================================================
# 2. THE MINIMAL RL LOOP (a RANDOM agent — no learning at all)
# ============================================================
n_episodes = 20
returns = []
for ep in range(n_episodes):
    state, info = env.reset(seed=ep)   # S_0  (reset returns obs, info)
    total_reward = 0.0                 # this will become the return G_0
    done = False
    while not done:
        action = env.action_space.sample()          # RANDOM action A_t
        state, reward, terminated, truncated, info = env.step(action)
        total_reward += reward                       # accumulate R_{t+1}
        done = terminated or truncated               # episode over?
    returns.append(total_reward)
    print(f"episode {ep:2d}: return = {total_reward:.0f}")

env.close()
print(f"\\nrandom-agent mean return over {n_episodes} episodes: "
      f"{np.mean(returns):.1f} +/- {np.std(returns):.1f}")
# A random policy keeps CartPole up only ~20 steps. Any LEARNING method
# (Q-learning, DQN, policy gradient) must beat this baseline.`
  };

  window.CODEVIZ["rl-intro"] = {
    question: "How do you read a return-per-episode curve? Tell the flat random baseline apart from an agent that is actually learning — and from one that is gaming the reward.",
    charts: [
      {
        type: "line",
        title: "Baseline: RANDOM agent on a 6×6 gridworld — flat, no learning",
        xlabel: "episode",
        ylabel: "20-episode running-average return",
        series: [
          { name: "random agent (running avg)", color: "#9aa7b4",
            points: [[19,-114.25],[28,-122.3],[38,-135.15],[48,-127.8],[57,-122.15],[67,-138.2],[77,-125.6],[87,-117.4],[96,-120.45],[106,-112.55],[116,-123.6],[126,-113.6],[135,-110.85],[145,-121.55],[155,-102.9],[165,-98.0],[174,-107.5],[184,-103.05],[194,-114.3],[204,-103.0],[213,-114.8],[223,-132.7],[233,-125.25],[243,-93.15],[252,-110.9],[262,-136.55],[272,-136.55],[282,-118.65],[291,-100.5],[301,-92.55],[311,-109.35],[321,-109.55],[330,-87.3],[340,-91.8],[350,-123.85],[360,-105.7],[369,-102.65],[379,-110.55],[389,-83.85],[399,-86.15]] }
        ],
        interpret: "Real numbers from the numpy code below. <b>X</b> = episode number (one full run from start to goal-or-timeout), <b>Y</b> = the return (total reward) smoothed over the last 20 episodes; here each step costs −1 and reaching the goal pays +10. The line <b>drifts around −113 and never trends up</b> across 400 episodes. A flat, noisy line like this means <b>experience is not accumulating</b> — exactly right for a random agent. This is the baseline every learning method must beat; read any other curve relative to this floor."
      },
      {
        type: "line",
        title: "Learning: a real agent's return climbs out of the baseline, then plateaus",
        xlabel: "episode",
        ylabel: "20-episode running-average return",
        series: [
          { name: "random baseline", color: "#9aa7b4",
            points: [[19,-114],[100,-118],[200,-110],[300,-108],[399,-100]] },
          { name: "learning agent (e.g. Q-learning)", color: "#7ee787",
            points: [[19,-115],[60,-95],[100,-60],[140,-25],[180,0],[220,3.5],[260,5.2],[300,5.8],[340,6.0],[399,6.1]] }
        ],
        interpret: "Illustrative shape (qualitatively honest). Same axes as the baseline, with the grey random line for reference. The green agent <b>starts at the baseline, rises steadily, then flattens near a ceiling</b> (here ~+6, the best return for reaching the goal quickly). That rise-then-plateau is the signature of <b>successful learning</b>: experience is accumulating until the policy is near-optimal and there is little left to gain. The gap between green and grey at the end is how much the learning bought you."
      },
      {
        type: "line",
        title: "Reward hacking: return soars but the TRUE goal is never reached",
        xlabel: "episode",
        ylabel: "running-average return (left axis) vs. goal-reached rate",
        series: [
          { name: "engineered return", color: "#ffb454",
            points: [[19,-100],[60,-40],[100,20],[140,70],[180,110],[220,150],[260,185],[300,210],[340,225],[399,235]] },
          { name: "fraction of episodes that actually reach the goal", color: "#ff7b72",
            points: [[19,0.02],[60,0.02],[100,0.015],[140,0.01],[180,0.01],[220,0.0],[260,0.0],[300,0.0],[340,0.0],[399,0.0]] }
        ],
        interpret: "Illustrative shape. The orange line is the return the agent is optimizing; the red line is whether it accomplishes the real objective (reaching the goal). <b>Return rockets upward while the goal-reached rate collapses to zero</b> — the classic <b>reward-hacking</b> tell. The agent found a loophole (e.g. farming a shaping bonus by looping in place) that scores points without doing the task. The lesson: <b>never judge an RL agent by the reward curve alone</b> — watch its actual behavior, because a rising return can mean it is gaming the metric you wrote rather than the goal you meant."
      }
    ],
    caption: "Three shapes a return-per-episode curve can take: the real flat random baseline (numpy output below), an illustrative learning curve that rises then plateaus, and an illustrative reward-hacking curve where return climbs while the true goal goes unmet. Each chart's note explains how to recognize it.",
    code: `import numpy as np

# ============================================================
# A TINY 6x6 GRIDWORLD MDP, built from scratch in numpy (NO gym needed).
#   States 0..35 laid out as a 6x6 grid (state = row*6 + col).
#   Goal = bottom-right (state 35): reward +10 and the episode ENDS.
#   Every other step costs -1 (so dawdling hurts -> reaching the goal fast is good).
#   Actions: 0=up, 1=right, 2=down, 3=left. Bumping a wall keeps you put.
#   The agent picks actions UNIFORMLY AT RANDOM -> no policy, no learning.
# ============================================================
N_ROWS, N_COLS = 6, 6
GOAL = N_ROWS * N_COLS - 1            # state 35
MOVES = {0: (-1, 0), 1: (0, 1), 2: (1, 0), 3: (0, -1)}
STEP_COST, GOAL_REWARD = -1.0, 10.0

def step(s, a):
    r, c = divmod(s, N_COLS)
    dr, dc = MOVES[a]
    nr, nc = r + dr, c + dc
    if not (0 <= nr < N_ROWS and 0 <= nc < N_COLS):
        nr, nc = r, c                # bump into a wall -> stay
    ns = nr * N_COLS + nc
    if ns == GOAL:
        return ns, GOAL_REWARD, True
    return ns, STEP_COST, False

rng = np.random.default_rng(0)
N_EPISODES, MAX_STEPS = 400, 200
returns = np.zeros(N_EPISODES)
for ep in range(N_EPISODES):
    s, total = 0, 0.0                # start top-left (state 0)
    for _ in range(MAX_STEPS):
        a = rng.integers(4)          # RANDOM action: the baseline agent
        s, r, done = step(s, a)
        total += r                   # accumulate reward -> the return
        if done:
            break
    returns[ep] = total

print("mean return:", round(returns.mean(), 2))             # ~ -113 : poor, by design
print("first-50 vs last-50 mean:",
      round(returns[:50].mean(), 1),
      round(returns[-50:].mean(), 1))                        # ~equal -> NO learning

# 20-episode running average -> the FLAT line plotted above
run = np.convolve(returns, np.ones(20) / 20, mode="valid")
idx = np.linspace(0, len(run) - 1, 40).astype(int)          # subsample to 40 points
points = [[int(i + 19), round(float(run[i]), 2)] for i in idx]
print("plotted points:", points)`
  };
})();
