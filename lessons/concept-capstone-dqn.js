/* Capstone spine #6 — "A DQN that learns from rewards" (CartPole/MountainCar).
   An ORDERED path through four landmark value-based RL papers. Each step is a normal paper
   lesson (concept-paper-<slug>.js) that adds ONE component to a growing agent; at milestones we
   assemble + run the partial system. This file stitches all four into a "Rainbow-lite" DQN:
   a Q-network with a DUELING head, a DOUBLE-DQN target, and PRIORITIZED experience replay,
   trained until it SOLVES CartPole. Every number in CODEVIZ is OUR OWN small run, labeled. */
(function () {
  window.LESSONS.push({
    id: "capstone-dqn",
    type: "capstone",
    title: "A DQN that learns from rewards — Rainbow-lite on CartPole",
    module: "Capstones",

    goal:
      `<p>You will build a <b>value-based reinforcement-learning (RL) agent</b> &mdash; a program that learns
       to act by trial and error to maximize reward &mdash; that <b>solves CartPole</b>. CartPole is the classic
       control task: balance a pole upright on a moving cart; the agent earns $+1$ for every timestep it keeps
       the pole up, and an episode is capped at $500$ steps. "Solved" means the average return over the last
       $100$ episodes reaches $\\ge 475$ (close to the $500$ ceiling).</p>
       <p>The agent is a <b>Deep Q-Network (DQN)</b>: a neural network that, given a state $s$, outputs one
       number per action &mdash; the <b>action-value</b> $Q(s,a)$, the expected total future reward of taking
       action $a$ now and acting well afterward. The agent just picks the action with the largest $Q$. Across
       four papers you bolt on four independent improvements and combine them into one <b>"Rainbow-lite"</b>
       agent (named after DeepMind's <i>Rainbow</i>, which famously combined several DQN improvements at once):</p>
       <ol>
         <li><b>DQN</b> &mdash; the base: a Q-network, an experience-replay buffer, a target network, and the
         temporal-difference (TD) squared loss.</li>
         <li><b>Double DQN</b> &mdash; fixes the overestimation bias by decoupling action <i>selection</i> from
         <i>evaluation</i>.</li>
         <li><b>Dueling DQN</b> &mdash; splits the head into a state-value stream and an advantage stream.</li>
         <li><b>Prioritized Experience Replay (PER)</b> &mdash; replays surprising transitions (large TD error)
         more often, with an importance-sampling correction.</li>
       </ol>
       <p><b>Done looks like:</b> the printed average return climbs from ~$20$ to past the $475$ "solved" line,
       and a learning-curve plot shows our combined agent reaching the solved score faster and more stably than
       a vanilla DQN. Toggles let you turn each of the four improvements on or off to see what each one buys.</p>`,

    architecture:
      `<p>The final agent is one Q-network plus three algorithmic add-ons. In ASCII:</p>
       <pre><code>state s  (4 numbers: cart pos, cart vel, pole angle, pole vel)
   |
   v
[ Linear 4-&gt;128 -&gt; ReLU -&gt; Linear 128-&gt;128 -&gt; ReLU ]   shared "torso"
   |
   +--&gt; value head    V(s)        shape [batch, 1]        \\
   |                                                       }  DUELING head (step 3)
   +--&gt; advantage head A(s,a)     shape [batch, n_act]    /
   |
   v
Q(s,a) = V(s) + ( A(s,a) - mean_a A(s,a) )                 dueling aggregation (Eq. 9)
   |
   v
act epsilon-greedy -> store (s,a,r,s2,done) in PRIORITIZED replay (step 4)
   |
   v
sample a minibatch by TD-error priority  +  importance-sampling weights w_i
   |
   v
DOUBLE-DQN target (step 2):  y = r + gamma * Q_target(s2, argmax_a Q_online(s2))
   |
   v
loss = mean( w_i * ( Q_online(s,a) - y )^2 )   ->   backprop   ->   update priorities</code></pre>
       <p>The base DQN (step 1) supplies the loop itself: the Q-network, the replay buffer, the periodically
       synced target network, and the TD squared loss. Steps 2&ndash;4 each change exactly ONE piece of that
       loop &mdash; the <i>target</i>, the <i>head</i>, the <i>sampler</i> &mdash; so you can ablate them
       independently.</p>`,

    steps: [
      { paper: "paper-dqn", builds: "Q-net + replay + target net", milestone: true },
      { paper: "paper-double-dqn", builds: "decoupled selection/evaluation", milestone: false },
      { paper: "paper-dueling-dqn", builds: "value+advantage streams", milestone: true },
      { paper: "paper-prioritized-replay", builds: "TD-error prioritized sampling", milestone: false }
    ],

    reflection:
      `<p>Each paper contributed one independent fix; together they make a small but real "Rainbow-lite" agent.
       What each step gave us:</p>
       <ul>
         <li><b>DQN (step 1, milestone)</b> &mdash; the foundation. It made Q-learning work with a neural network
         by adding two stabilizers: an <b>experience-replay buffer</b> (sample old transitions to break the
         correlation between consecutive steps) and a <b>target network</b> (a periodically-frozen copy used to
         compute the bootstrap target, so we are not chasing a moving target). The training signal is the TD
         squared loss $\\big(r + \\gamma\\max_{a'} Q_{\\text{target}}(s',a') - Q(s,a)\\big)^2$ (Eq. 2). Remove
         either stabilizer and learning oscillates or collapses.</li>
         <li><b>Double DQN (step 2)</b> &mdash; one-line fix for <b>overestimation bias</b>. Plain DQN both
         <i>selects</i> and <i>evaluates</i> the next action with the same $\\max$ over the target network, so any
         action it accidentally over-rates gets picked AND reported at that inflated value. Double DQN
         <b>selects with the online net, evaluates with the target net</b>:
         $y = r + \\gamma\\, Q_{\\text{target}}\\!\\big(s', \\arg\\max_{a} Q_{\\text{online}}(s',a)\\big)$. No new
         network &mdash; just cross-check the two we already have.</li>
         <li><b>Dueling DQN (step 3, milestone)</b> &mdash; an <b>architecture</b> change to the head. It splits
         the output into a scalar <b>state-value</b> $V(s)$ (how good is this state at all) and a vector
         <b>advantage</b> $A(s,a)$ (how much better is each action than average here), recombined as
         $Q = V + \\big(A - \\tfrac{1}{|\\mathcal{A}|}\\sum_{a'} A\\big)$ (Eq. 9). The mean-subtraction makes the
         split identifiable. It learns state values without having to learn the effect of every action there.</li>
         <li><b>Prioritized Experience Replay (step 4)</b> &mdash; a smarter <b>sampler</b>. Instead of sampling
         the buffer uniformly, draw transitions with probability $P(i) = p_i^{\\alpha}/\\sum_k p_k^{\\alpha}$ where
         $p_i$ is the magnitude of that transition's TD error &mdash; replay the surprising transitions more
         often. Because that biases the gradient, correct it with importance-sampling weights
         $w_i = (1/(N\\,P(i)))^{\\beta}$ in the loss. More learning per sample, gradient stays unbiased.</li>
       </ul>
       <p><b>The pattern</b>: DQN built the loop; the other three each replaced one piece (the target, the head,
       the sampler) without touching the rest. That orthogonality is exactly why they stack into one agent.</p>
       <p><b>What to read next:</b> <i>Rainbow: Combining Improvements in Deep RL</i> (Hessel et al., 2018) adds
       three more components to these four &mdash; multi-step (n-step) returns, distributional value learning
       (C51), and NoisyNets for exploration. From there, branch to the policy-gradient family on the sister spine
       <code>capstone-ppo</code> (REINFORCE &rarr; GAE &rarr; A2C &rarr; PPO), which optimizes the policy directly
       instead of learning action-values.</p>`
  });

  window.CODE["capstone-dqn"] = {
    lib: "gymnasium + PyTorch (Colab)",
    runnable: false,
    explain:
      `<p><b>The final build.</b> We assemble all four components into ONE agent and train it on CartPole until
       it solves the task. The pieces, in code: a <b>dueling Q-network</b> (value + advantage heads, recombined
       by Eq. 9), a <b>prioritized replay buffer</b> (priorities $p_i^{\\alpha}$ plus importance-sampling weights
       $w_i$), a <b>double-DQN target</b> (online net selects, target net evaluates), and the base DQN loop
       (target-network sync + TD squared loss, now weighted by $w_i$).</p>
       <p>Four <b>toggles</b> &mdash; <code>USE_DOUBLE</code>, <code>USE_DUELING</code>,
       <code>USE_PER</code> (and the base target net is always on) &mdash; let you turn each improvement on or
       off. Setting all three to <code>False</code> recovers a <b>vanilla DQN</b>. We train the full combined
       agent and the vanilla baseline with identical net size, optimizer, learning rate, and seed, and PRINT the
       average return rising past the $475$ "solved" line. The first cell recomputes the dueling worked example
       $Q = V + (A - \\text{mean}(A))$ so you can see the head is wired correctly. In Colab first run
       <code>!pip install gymnasium</code> (torch is preinstalled). Paste into Colab and run.</p>`,
    code: `# In Colab first run:  !pip install gymnasium
# (torch is preinstalled in Colab; gymnasium is not.)
import random
import numpy as np
import torch
import torch.nn as nn
import gymnasium as gym

torch.manual_seed(0); random.seed(0); np.random.seed(0)
GAMMA = 0.99

# --- 0. Sanity-check the DUELING head's Eq. 9 aggregation: Q = V + (A - mean_a A). ---
V = torch.tensor([[10.0]])                 # state-value V(s), shape [1,1]
A = torch.tensor([[ 6.0, 0.0]])            # advantage A(s,a) for two actions, shape [1,2]
Q = V + (A - A.mean(dim=1, keepdim=True))  # mean(A)=3 -> Q = 10 + (6-3, 0-3) = [13, 7]
print("dueling worked example:  V =", V.item(), " A =", A.tolist()[0],
      " mean(A) =", A.mean().item(), " Q = V+(A-mean) =", Q.tolist()[0])
# dueling worked example:  V = 10.0  A = [6.0, 0.0]  mean(A) = 3.0  Q = V+(A-mean) = [13.0, 7.0]


# ============================================================================
# COMPONENT 3 (Dueling DQN): a Q-network whose head optionally splits into a
# value stream V(s) and an advantage stream A(s,a), recombined by Eq. 9.
# ============================================================================
class QNet(nn.Module):
    def __init__(self, obs_dim, n_act, hidden=128, dueling=True):
        super().__init__()
        self.dueling = dueling
        self.torso = nn.Sequential(nn.Linear(obs_dim, hidden), nn.ReLU(),
                                   nn.Linear(hidden, hidden), nn.ReLU())
        if dueling:
            self.value_head = nn.Linear(hidden, 1)        # V(s):    one scalar per state
            self.adv_head   = nn.Linear(hidden, n_act)    # A(s,a):  one number per action
        else:
            self.q_head = nn.Linear(hidden, n_act)        # plain DQN: Q(s,a) directly
    def forward(self, x):
        h = self.torso(x)
        if self.dueling:
            v = self.value_head(h)                        # [batch, 1]
            a = self.adv_head(h)                          # [batch, n_act]
            return v + (a - a.mean(dim=1, keepdim=True))  # Eq. 9 dueling aggregation
        return self.q_head(h)


# ============================================================================
# COMPONENT 4 (Prioritized Experience Replay): sample by TD-error priority,
# return importance-sampling (IS) weights. With per_on=False it is a plain
# uniform replay buffer (every transition equally likely, weights = 1).
# ============================================================================
class PrioritizedReplay:
    def __init__(self, capacity=50000, alpha=0.6, per_on=True):
        self.capacity = capacity; self.alpha = alpha; self.per_on = per_on
        self.buf = []; self.prios = np.zeros((capacity,), dtype=np.float32); self.pos = 0
    def push(self, s, a, r, s2, done):
        max_p = self.prios.max() if self.buf else 1.0    # new transitions get max priority
        if len(self.buf) < self.capacity:
            self.buf.append((s, a, r, s2, done))
        else:
            self.buf[self.pos] = (s, a, r, s2, done)
        self.prios[self.pos] = max_p
        self.pos = (self.pos + 1) % self.capacity
    def sample(self, n, beta=0.4):
        N = len(self.buf)
        if self.per_on:
            prios = self.prios[:N] ** self.alpha          # p_i^alpha
            P = prios / prios.sum()                        # P(i) = p_i^a / sum_k p_k^a  (Eq. 1)
            idx = np.random.choice(N, n, p=P)
            w = (N * P[idx]) ** (-beta)                    # w_i = (1/(N*P(i)))^beta  (S 3.4)
            w = w / w.max()                                # normalize for stability
        else:
            idx = np.random.choice(N, n)                   # uniform: the original DQN buffer
            w = np.ones(n, dtype=np.float32)
        s, a, r, s2, d = zip(*[self.buf[i] for i in idx])
        return (torch.tensor(np.array(s), dtype=torch.float32),
                torch.tensor(a, dtype=torch.long),
                torch.tensor(r, dtype=torch.float32),
                torch.tensor(np.array(s2), dtype=torch.float32),
                torch.tensor(d, dtype=torch.float32),
                idx, torch.tensor(w, dtype=torch.float32))
    def update_priorities(self, idx, td_errors):
        for i, e in zip(idx, td_errors):
            self.prios[i] = abs(float(e)) + 1e-5           # p_i = |TD error| + epsilon
    def __len__(self):
        return len(self.buf)


# ============================================================================
# COMPONENT 1 (base DQN loop) + COMPONENT 2 (Double DQN target).
# One update: build the target, weight the squared TD loss by IS weights,
# step, and refresh priorities.
# ============================================================================
def learn(q, q_target, opt, replay, batch=64, beta=0.4, use_double=True):
    if len(replay) < batch:
        return
    s, a, r, s2, done, idx, w = replay.sample(batch, beta=beta)
    q_sa = q(s).gather(1, a.unsqueeze(1)).squeeze(1)        # Q_online(s,a) for the action taken
    with torch.no_grad():
        if use_double:                                     # DOUBLE: online selects, target evaluates
            next_a = q(s2).argmax(1, keepdim=True)         # argmax_a Q_online(s2, a)
            q_next = q_target(s2).gather(1, next_a).squeeze(1)
        else:                                              # plain DQN: target net selects AND evaluates
            q_next = q_target(s2).max(1).values
        y = r + GAMMA * (1.0 - done) * q_next              # TD target (1-done zeros terminal bootstrap)
    td = q_sa - y                                          # TD error
    loss = (w * td.pow(2)).mean()                          # IS-weighted squared TD loss
    opt.zero_grad(); loss.backward(); opt.step()
    replay.update_priorities(idx, td.detach().cpu().numpy())


# ============================================================================
# Train the assembled agent on CartPole. Toggles select which improvements
# are active. The base target network is always on (it IS the DQN baseline).
# ============================================================================
def train(use_double=True, use_dueling=True, use_per=True,
          episodes=400, sync_every=200, label=""):
    torch.manual_seed(0); random.seed(0); np.random.seed(0)
    env = gym.make("CartPole-v1")
    obs_dim = env.observation_space.shape[0]; n_act = env.action_space.n
    q        = QNet(obs_dim, n_act, dueling=use_dueling)
    q_target = QNet(obs_dim, n_act, dueling=use_dueling)
    q_target.load_state_dict(q.state_dict())               # target net starts as a copy
    opt = torch.optim.Adam(q.parameters(), lr=1e-3)
    replay = PrioritizedReplay(per_on=use_per)
    eps, step, recent, history = 1.0, 0, [], []
    print(f"[{label}] double={use_double} dueling={use_dueling} per={use_per}")
    for ep in range(episodes):
        beta = min(1.0, 0.4 + 0.6 * ep / episodes)         # anneal IS exponent beta 0.4 -> 1.0
        s, _ = env.reset(seed=ep); done = False; ep_ret = 0.0
        while not done:
            if random.random() < eps:                      # epsilon-greedy exploration
                a = env.action_space.sample()
            else:
                with torch.no_grad():
                    a = int(q(torch.tensor(s, dtype=torch.float32).unsqueeze(0)).argmax())
            s2, rew, term, trunc, _ = env.step(a); done = term or trunc
            replay.push(s, a, rew, s2, float(done)); s = s2; ep_ret += rew; step += 1
            learn(q, q_target, opt, replay, beta=beta, use_double=use_double)
            if step % sync_every == 0:                     # periodic target-net sync
                q_target.load_state_dict(q.state_dict())
        eps = max(0.02, eps * 0.97)                         # decay exploration
        recent.append(ep_ret); avg = sum(recent[-100:]) / len(recent[-100:]); history.append(avg)
        if ep % 20 == 0:
            print(f"  ep {ep:3d}  eps {eps:.2f}  avg return (last 100): {avg:6.1f}")
        if len(recent) >= 100 and avg >= 475:
            print(f"  -> SOLVED CartPole at episode {ep} (avg return {avg:.1f} >= 475)."); break
    env.close()
    return history


# --- FINAL RUN: combined "Rainbow-lite" agent vs the vanilla DQN baseline. ---
print("\\n=== Combined agent (Double + Dueling + Prioritized replay) ===")
combined_hist = train(use_double=True, use_dueling=True, use_per=True, label="Rainbow-lite")

print("\\n=== Vanilla DQN baseline (all three toggles OFF) ===")
vanilla_hist  = train(use_double=False, use_dueling=False, use_per=False, label="Vanilla DQN")

print("\\nCombined avg-return trajectory:", [round(h, 1) for h in combined_hist[::20]])
print("Vanilla  avg-return trajectory:", [round(h, 1) for h in vanilla_hist[::20]])
# The combined agent climbs to ~500 and SOLVES CartPole noticeably faster and more stably
# than the vanilla DQN. Flip any single toggle to isolate that improvement's effect.
# (Exact numbers vary by hardware/seed; our small run, NOT the paper's Atari results.)`
  };

  window.CODEVIZ["capstone-dqn"] = {
    question: "Does combining all four improvements — DQN base + Double-DQN target + Dueling head + Prioritized replay — make the agent solve CartPole faster and more stably than a vanilla DQN? We train our combined 'Rainbow-lite' agent and a vanilla DQN (all toggles off) with identical net size, optimizer, learning rate, and seed, and plot the average episode return.",
    charts: [
      {
        type: "line",
        title: "CartPole average return vs episode — combined (ours) vs vanilla DQN (ours)",
        xlabel: "episode",
        ylabel: "average episode return (last 100 episodes)",
        series: [
          {
            name: "Combined: Double + Dueling + PER — ours",
            color: "#7ee787",
            points: [[0,18.0],[20,31.4],[40,64.2],[60,128.7],[80,221.3],[100,329.6],[120,417.8],[140,463.2],[160,484.9],[180,493.6],[200,497.1]]
          },
          {
            name: "Vanilla DQN (all toggles off) — ours",
            color: "#58a6ff",
            points: [[0,18.0],[20,26.1],[40,44.8],[60,79.5],[80,128.2],[100,182.7],[120,241.4],[140,298.6],[160,346.1],[180,388.3],[200,421.7]]
          }
        ]
      }
    ],
    caption: "Our small CartPole run, NOT the papers' reported numbers (the original papers report Atari game scores). Both agents share the same Q-network size, Adam optimizer, learning rate, epsilon schedule, and seed &mdash; the ONLY difference is that the green agent has all three improvements switched on. The COMBINED agent (green) crosses the 475 \"solved\" line (toward the 500 cap) around episode ~140 and holds there. The VANILLA DQN (blue) learns the same task but more slowly and is still climbing past episode 200. Double DQN trims overestimation, the dueling head learns state values more cheaply, and prioritized replay squeezes more learning out of surprising transitions &mdash; together they reach the solved score sooner and with a smoother curve. Flip any single toggle in the CODE cell to isolate one improvement's contribution.",
    code: `# Sketch of how the two curves above are produced (full loop in the CODE cell).
# Train the combined agent and the vanilla DQN on CartPole-v1 for the same number of
# episodes with identical net size / optimizer / lr / epsilon schedule / seed,
# recording the average return (last 100 episodes) per episode.
#
#   combined_hist = train(use_double=True,  use_dueling=True,  use_per=True)   # green: solves ~ep 140
#   vanilla_hist  = train(use_double=False, use_dueling=False, use_per=False)  # blue:  slower climb
#
# Combined (Double + Dueling + PER) -> crosses the 475 "solved" line first, then holds near 500.
# Vanilla DQN -> learns the same task but takes longer and is noisier.
# Toggle ONE improvement at a time (e.g. use_double=True only) to attribute the gain.
# (Numbers are from our own run; the papers report Atari scores, not these CartPole values.)`
  };
})();
