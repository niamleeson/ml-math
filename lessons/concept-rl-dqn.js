/* Reinforcement Learning — "Deep Q-Networks (DQN)".
   Self-contained: lesson + CODE + CODEVIZ merged by id "rl-dqn".
   Cross-links the existing mod-dqn lesson and goes deeper for the RL curriculum. */
(function () {
  window.LESSONS.push({
    id: "rl-dqn",
    title: "Deep Q-Networks (DQN): Q-learning with a neural net",
    tagline: "Swap Q-learning's giant table for a neural network, then add experience replay and a target network so training does not blow up.",
    module: "Reinforcement Learning",
    prereqs: ["ai-q-learning", "aix-sarsa-td", "dl-backprop", "mod-dqn"],

    whenToUse:
      `<p><b>Reach for a DQN (Deep Q-Network) when an agent must learn by trial and error, the actions
       are a small DISCRETE set, and the state space is far too big for a lookup table</b> &mdash; raw
       pixels, high-dimensional sensors, board positions. A DQN is a neural network
       $\\hat Q(s,a;\\theta)$ that reads a state $s$ and outputs one value per action; the agent acts
       greedily on it. "DQN" = Deep Q-Network: Q-learning where the table is replaced by a network with
       weights $\\theta$.</p>
       <p>This lesson goes DEEPER than the short
       <code>mod-dqn</code> lesson &mdash; same idea, but here we derive the loss, name the deadly
       triad, and walk through replay, target networks, and the modern extensions.</p>
       <p><b>Choose it over:</b></p>
       <ul>
         <li><b>Tabular Q-learning</b> (<code>ai-q-learning</code>) &mdash; when states are too many to
         enumerate; the network GENERALIZES across similar states instead of storing each one.</li>
         <li><b>A policy-gradient / actor-critic method</b> (<code>mod-policy-gradient</code>,
         <code>mod-actor-critic</code>) &mdash; when actions are discrete and you want the sample
         efficiency of replaying old data. DQN is off-policy: it can learn from any stored transition.</li>
       </ul>
       <p><b>Pick a different tool when:</b></p>
       <ul>
         <li><b>Actions are continuous</b> (steering angle, joint torque) &mdash; you cannot take
         $\\max_{a'}$ over infinitely many actions. Use DDPG (Deep Deterministic Policy Gradient), TD3, or
         SAC (Soft Actor-Critic) instead.</li>
         <li><b>The problem is supervised, not sequential decision-making</b> &mdash; do not use
         reinforcement learning at all.</li>
       </ul>
       <p><b>Which library:</b> <b>Gymnasium</b> for environments; <b>Stable-Baselines3</b>
       (<code>stable_baselines3.DQN</code>) for a battle-tested implementation; <b>PyTorch</b> to write
       your own.</p>`,

    application:
      `<p>DQN is the off-policy deep-RL (deep Reinforcement Learning) workhorse for discrete actions.</p>
       <ul>
         <li><b>Atari from pixels.</b> The original DQN (Mnih et al., Nature 2015) learned ~49 Atari games
         straight from raw screen pixels with a single architecture, reaching human level on many. This is
         the result that launched modern deep RL.</li>
         <li><b>Game and control AI.</b> Discrete-action games, simple robotic control, and grid / routing
         problems where the state is too large for a table.</li>
         <li><b>Systems decisions.</b> Cache eviction, job scheduling, traffic routing, and other
         discrete-choice control problems with a measurable reward signal.</li>
         <li><b>A building block.</b> The replay buffer and target-network tricks reappear in nearly every
         later off-policy method (DDPG, TD3, SAC), so DQN is the foundation those rest on.</li>
       </ul>`,

    bigIdea:
      `<p>Tabular Q-learning (see <code>ai-q-learning</code>) stores one number $Q(s,a)$ for every
       state-action pair. Real problems &mdash; pixels, sensors &mdash; have astronomically many states,
       so the table cannot exist.</p>
       <p>A <b>Deep Q-Network</b> replaces the table with a neural network
       $\\hat Q(s,a;\\theta)$: it reads the state $s$ and outputs an estimated value for each action $a$,
       using weights $\\theta$ (Greek "theta"). The hat on $\\hat Q$ marks it as an APPROXIMATION, not the
       exact value. The network generalizes: states that look similar get similar values, for free.</p>
       <p>But plugging a function approximator into Q-learning is dangerous. Three things together &mdash;
       <b>function approximation</b>, <b>bootstrapping</b> (training a guess on another guess), and
       <b>off-policy</b> learning &mdash; form the <b>deadly triad</b>, a combination that can make
       training diverge. DQN's whole contribution is two tricks that tame it:</p>
       <ul>
         <li><b>Experience replay.</b> Store every transition $(s,a,r,s')$ in a buffer and train on RANDOM
         minibatches from it. This breaks the correlation between consecutive moves and lets each
         transition be reused many times.</li>
         <li><b>Target network.</b> Keep a second, frozen copy of the weights, $\\theta^-$ ("theta-minus"),
         used only to compute the goal. It updates slowly, so the target the network chases stops being a
         moving blur.</li>
       </ul>`,

    buildup:
      `<p>Start from the Bellman optimality equation, the backbone of value-based RL: the value of the
       best action in $s$ equals the reward you get plus the discounted value of acting optimally
       afterward,</p>
       <p style="text-align:center">$Q^*(s,a) = \\mathbb{E}\\big[\\, r + \\gamma \\max_{a'} Q^*(s',a') \\,\\big]$.</p>
       <p>Here $\\mathbb{E}[\\cdot]$ ("the expected value of") averages over the randomness in reward and
       next state, and $\\gamma$ ("gamma", $0 \\le \\gamma \\lt 1$) discounts future reward. Tabular
       Q-learning makes the table obey this by nudging $Q(s,a)$ toward $r + \\gamma\\max_{a'}Q(s',a')$.</p>
       <p>DQN does the SAME thing, but $Q$ is now a network $\\hat Q(s,a;\\theta)$ and we cannot just
       overwrite a cell &mdash; we have to adjust the shared weights $\\theta$ by gradient descent
       (<code>dl-backprop</code>). The trick is to turn "make $\\hat Q$ obey Bellman" into a SUPERVISED
       regression problem: build a target value $y$ from the right-hand side, then train the network to
       output $y$. The two stabilizing tricks exist precisely because that target depends on the network's
       own (changing, correlated) predictions.</p>`,

    symbols: [
      { sym: "$s$", desc: "the current state &mdash; what the agent observes right now (e.g. the CartPole position, velocity, angle, angular velocity)." },
      { sym: "$a$", desc: "an action the agent can take, from a small DISCRETE set (e.g. push-left or push-right)." },
      { sym: "$r$", desc: "the reward received after taking action $a$ in state $s$." },
      { sym: "$s'$", desc: "the next state, landed in after the action ('$s$-prime')." },
      { sym: "$a'$", desc: "a candidate next action, used only to score how good $s'$ is ('$a$-prime')." },
      { sym: "$\\theta$", desc: "the weights of the online (trained) Q-network ('theta'). Updated every step by gradient descent." },
      { sym: "$\\theta^-$", desc: "the weights of the TARGET network ('theta-minus'). A frozen copy of $\\theta$ used to build the target; refreshed slowly." },
      { sym: "$\\hat Q(s,a;\\theta)$", desc: "the network's estimate of the value of action $a$ in state $s$. The hat means it is an approximation; the semicolon-$\\theta$ means it depends on the weights." },
      { sym: "$\\gamma$", desc: "the discount factor ('gamma'), $0 \\le \\gamma \\lt 1$. Reward $k$ steps away is worth $\\gamma^k$ as much now." },
      { sym: "$\\max_{a'}$", desc: "'the largest over all next actions' &mdash; the value of the best move the agent could make in $s'$." },
      { sym: "$y$", desc: "the TD (Temporal-Difference) target: the goal value the online network is trained to match, built from $r$, $\\gamma$, and the target network." },
      { sym: "$\\mathbb{E}[\\cdot]$", desc: "the expected value (average) over the randomness in transitions and over the minibatch sampled from the replay buffer." },
      { sym: "$L(\\theta)$", desc: "the loss: the average squared gap between the network's prediction and the target $y$." }
    ],

    formula:
      `$$ y \\;=\\; r + \\gamma \\max_{a'} \\hat Q(s',a';\\theta^-) \\qquad\\qquad
         L(\\theta) \\;=\\; \\mathbb{E}\\Big[\\big(\\,y - \\hat Q(s,a;\\theta)\\,\\big)^2\\Big] $$`,

    whatItDoes:
      `<p>The <b>target</b> $y$ says: "the value of the move I just made should equal the reward I got,
       plus the discounted value of the best move I can make next." Crucially the next-state value uses the
       FROZEN target weights $\\theta^-$, not the live weights $\\theta$.</p>
       <p>The <b>loss</b> $L(\\theta)$ is the mean squared error between the network's current prediction
       $\\hat Q(s,a;\\theta)$ and that target $y$, averaged over a random minibatch of stored transitions.
       Backprop shrinks it by nudging $\\theta$ so the prediction moves toward $y$.</p>
       <p><b>Why the two tricks make this stable:</b></p>
       <ul>
         <li><b>Experience replay</b> samples minibatches uniformly at random from a big buffer of past
         transitions. Consecutive frames in RL are highly correlated; training on them in order violates
         the "independent samples" assumption gradient descent relies on and biases the updates. Random
         sampling de-correlates them and reuses each transition many times (sample efficiency).</li>
         <li><b>The target network</b> holds $\\theta^-$ fixed for many steps (or eases it toward $\\theta$
         slowly). Without it, the target $y$ uses the SAME weights we are updating, so chasing $y$ moves
         $y$ itself &mdash; a feedback loop that can spiral. Freezing $\\theta^-$ gives a stable goal.</li>
       </ul>
       <p>Together they defuse the <b>deadly triad</b> (function approximation + bootstrapping + off-policy)
       that otherwise lets value estimates explode.</p>`,

    derivation:
      `<p><b>From Bellman to a squared loss.</b> We want the network to satisfy the Bellman optimality
       equation $\\hat Q(s,a;\\theta) = r + \\gamma\\max_{a'}\\hat Q(s',a';\\theta)$ in expectation.</p>
       <ul class="steps">
         <li><b>Define the TD error</b> as the gap between the two sides:
         $\\delta = \\big(r + \\gamma\\max_{a'}\\hat Q(s',a';\\theta^-)\\big) - \\hat Q(s,a;\\theta) = y - \\hat Q(s,a;\\theta)$.
         If $\\delta = 0$ for every transition, the network already obeys Bellman.</li>
         <li><b>Penalize being away from zero</b> with the square:
         $L(\\theta) = \\mathbb{E}[\\delta^2] = \\mathbb{E}\\big[(y - \\hat Q(s,a;\\theta))^2\\big]$.
         Squaring makes both signs of error hurt and is smooth to differentiate.</li>
         <li><b>The gradient</b> is
         $\\nabla_\\theta L = -2\\,\\mathbb{E}\\big[(y - \\hat Q(s,a;\\theta))\\,\\nabla_\\theta \\hat Q(s,a;\\theta)\\big]$.
         Gradient descent steps $\\theta \\leftarrow \\theta - \\eta\\,\\nabla_\\theta L$ pull
         $\\hat Q(s,a;\\theta)$ toward $y$.</li>
         <li><b>The key semi-gradient move:</b> we treat $y$ as a CONSTANT &mdash; we do NOT differentiate
         through it &mdash; even though it contains a $\\hat Q$ term. Holding $y$ via the frozen target
         weights $\\theta^-$ is exactly what makes this a well-posed regression instead of a chase. (This is
         why it is called a "semi-gradient" method.)</li>
       </ul>
       <p>So minimizing the squared TD error IS fitting the Bellman equation, one supervised regression
       step at a time. The expectation $\\mathbb{E}[\\cdot]$ is estimated by averaging over a random
       minibatch from the replay buffer. &#8718;</p>
       <p><b>Why off-policy is fine.</b> The $\\max_{a'}$ in the target uses the GREEDY next action, not the
       action actually taken (which may have been a random exploratory $\\epsilon$-greedy move). That is
       what makes DQN off-policy &mdash; and why it can learn from any stored transition, no matter which
       policy generated it.</p>`,

    example:
      `<p>The online net currently guesses $\\hat Q(s,a;\\theta) = 4$. The agent acts, gets reward
       $r = 1$, and lands in $s'$, where the TARGET network's best next value is
       $\\max_{a'}\\hat Q(s',a';\\theta^-) = 6$. Use $\\gamma = 0.9$.</p>
       <ul class="steps">
         <li><b>Target:</b> $y = r + \\gamma\\max_{a'}\\hat Q(s',a';\\theta^-) = 1 + 0.9\\times 6 = 6.4$.</li>
         <li><b>TD error:</b> $\\delta = y - \\hat Q(s,a;\\theta) = 6.4 - 4 = 2.4$.</li>
         <li><b>Loss (this sample):</b> $\\delta^2 = 2.4^2 = 5.76$.</li>
         <li><b>Update:</b> backprop nudges $\\theta$ so $\\hat Q(s,a;\\theta)$ rises from $4$ toward $6.4$,
         shrinking the error. The target value $6.4$ does NOT move during this step, because it was computed
         from the frozen $\\theta^-$.</li>
       </ul>
       <p>Note the over-estimation seed already present here: that $6$ came from a $\\max$ over noisy
       estimates, which tends to be too high. Double DQN (below) fixes exactly this.</p>`,

    pitfalls:
      `<ul>
         <li><b>It diverges WITHOUT replay + target net.</b> Plain online Q-learning with a neural net hits
         the deadly triad and can blow up. The replay buffer (de-correlate samples, reuse data) and the
         target network (stable bootstrap) are not optional polish &mdash; they are what make DQN work.</li>
         <li><b>Over-estimation bias.</b> The $\\max_{a'}$ operator over noisy estimates is systematically
         too high (it picks whichever action got lucky). <b>Fix: Double DQN</b> &mdash; select the next
         action with the online net but EVALUATE it with the target net:
         $y = r + \\gamma\\,\\hat Q\\big(s', \\arg\\max_{a'}\\hat Q(s',a';\\theta);\\ \\theta^-\\big)$. This
         decouples selection from evaluation and largely removes the bias.</li>
         <li><b>Reward / observation scaling.</b> Huge or tiny rewards and unscaled inputs destabilize the
         gradients. Normalize observations; clip or scale rewards (but know clipping changes what "optimal"
         means).</li>
         <li><b>Sample inefficiency.</b> DQN can need millions of environment steps. Budget compute and
         reuse the replay buffer aggressively.</li>
         <li><b>Only DISCRETE actions.</b> The $\\max_{a'}$ enumerates actions &mdash; impossible for
         continuous controls. For continuous actions use DDPG / TD3 / SAC instead.</li>
         <li><b>Hyperparameter and seed sensitivity.</b> Learning rate, buffer size, target-sync period,
         and $\\epsilon$ schedule all matter, and results swing with the random seed. Tune carefully and
         report across several seeds, never one lucky run.</li>
       </ul>
       <p><b>The modern extensions (and what each fixes):</b></p>
       <ul>
         <li><b>Double DQN</b> &mdash; removes the maximization / over-estimation bias (above).</li>
         <li><b>Dueling DQN</b> &mdash; splits the network into a state-value stream $V(s)$ and an
         advantage stream $A(s,a)$, so it can judge a state's worth without learning every action
         separately.</li>
         <li><b>Prioritized Experience Replay</b> &mdash; samples high-TD-error transitions more often, so
         the net learns fastest from its most surprising mistakes.</li>
         <li><b>Rainbow</b> &mdash; combines Double, Dueling, Prioritized replay, multi-step returns,
         distributional RL, and noisy exploration into one strong agent.</li>
       </ul>`,

    demo: function (host) {
      host.innerHTML = "";
      // Show how a FROZEN target network stabilizes the bootstrap vs a moving target.
      // 1x5 corridor, goal pinned at +1 on the right. Compare two TD sweeps:
      //   left column  = target uses LIVE Q (no target net) -> jitters
      //   right column = target uses a FROZEN snapshot (target net) -> smooth
      var N = 5, gamma = 0.9, r_goal = 1, alpha = 0.5;
      var W = 600, H = 220, cz = 100, ox = 40, oyA = 24, oyB = 130;
      var Qlive, Qtn, Qfrozen, sweeps;
      function reset() {
        Qlive = []; Qtn = []; Qfrozen = [];
        for (var i = 0; i < N; i++) { Qlive[i] = 0; Qtn[i] = 0; }
        Qlive[N - 1] = r_goal; Qtn[N - 1] = r_goal;
        Qfrozen = Qtn.slice(); sweeps = 0;
        draw("Two corridors, both start flat (goal pinned +1). Top bootstraps off LIVE values; bottom off a FROZEN target snapshot. Press Step.");
      }
      var c = mkCanvas(host, W, H), ctx = c.ctx;
      var out = mkOut(host);
      function sweepLive(Q) {
        // target uses the SAME array we are writing -> chases a moving target
        for (var i = 0; i < N - 1; i++) {
          var best = Math.max(Q[i + 1], Q[i]);
          Q[i] = Q[i] + alpha * (0 + gamma * best - Q[i]);
        }
      }
      function sweepTN(Q, frozen) {
        var nQ = Q.slice();
        for (var i = 0; i < N - 1; i++) {
          var best = Math.max(frozen[i + 1], frozen[i]);   // bootstrap off FROZEN copy
          nQ[i] = Q[i] + alpha * (0 + gamma * best - Q[i]);
        }
        for (var j = 0; j < N; j++) Q[j] = nQ[j];
      }
      function step() {
        sweepLive(Qlive);
        sweepTN(Qtn, Qfrozen);
        sweeps++;
        if (sweeps % 2 === 0) Qfrozen = Qtn.slice();   // refresh target net every 2 sweeps
        draw("Sweep " + sweeps + ". Top chases a moving target; bottom uses a frozen snapshot, refreshed every 2 sweeps. The true value of Q(s0) is " +
          Math.pow(gamma, N - 1).toFixed(3) + ".");
      }
      function drawRow(Q, oy, label, color) {
        var t = C();
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = t.dim; ctx.font = "12px sans-serif";
        ctx.textAlign = "start";
        ctx.fillText(label, ox, oy - 8);
        ctx.textAlign = "center";
        for (var i = 0; i < N; i++) {
          var x = ox + i * cz, y = oy;
          var goal = (i === N - 1);
          var hot = Math.max(0, Math.min(1, Q[i]));
          ctx.fillStyle = goal ? "rgba(126,231,135,0.45)" : color + (0.12 + 0.5 * hot).toFixed(3) + ")";
          ctx.fillRect(x, y, cz - 6, cz - 26);
          ctx.strokeStyle = t.border; ctx.lineWidth = 1; ctx.strokeRect(x, y, cz - 6, cz - 26);
          ctx.fillStyle = t.ink; ctx.font = "bold 16px sans-serif";
          ctx.fillText(Q[i].toFixed(2), x + (cz - 6) / 2, y + 22);
          ctx.fillStyle = goal ? t.accent2 : t.dim; ctx.font = "11px sans-serif";
          ctx.fillText(goal ? "GOAL +1" : "s" + i, x + (cz - 6) / 2, y + 44);
        }
        ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
      }
      function draw(msg) {
        var t = C(); ctx.clearRect(0, 0, W, H);
        drawRow(Qlive, oyA, "No target net (bootstrap off live Q):", "rgba(255,123,114,");
        drawRow(Qtn, oyB, "With target net (bootstrap off frozen θ⁻):", "rgba(78,161,255,");
        out.innerHTML = (msg || "") + "<br>γ = " + gamma + ", step size α = " + alpha +
          ". Both converge toward the same values; the frozen-target row moves more smoothly.";
      }
      var row = mkRow(host);
      mkBtn(row, "Step (one sweep each)", step);
      mkBtn(row, "Reset", reset);
      host.insertBefore(c.cv, host.children[0]);
      host.insertBefore(out, host.children[1]);
      reset();
    },

    practice: [
      {
        q: `The online net guesses $\\hat Q(s,a;\\theta) = 2$. After acting, $r = 0$ and the target network's best next value is $\\max_{a'}\\hat Q(s',a';\\theta^-) = 5$, with $\\gamma = 0.8$. What is the target $y$, and which way does training move $\\hat Q(s,a;\\theta)$?`,
        steps: [
          { do: `Plug into $y = r + \\gamma\\max_{a'}\\hat Q(s',a';\\theta^-)$.`, why: `The target is reward-now plus the discounted best next value, taken from the FROZEN target net.` },
          { do: `Compute $y = 0 + 0.8\\times 5 = 4$.`, why: `The discount $\\gamma=0.8$ shrinks the next value from $5$ to $4$.` },
          { do: `Compare $y$ to the current guess: $\\delta = y - \\hat Q = 4 - 2 = 2 \\gt 0$.`, why: `A positive TD error means the guess is too low.` }
        ],
        answer: `$y = 4$. Since $\\delta = 2 \\gt 0$, training nudges $\\hat Q(s,a;\\theta)$ UP from $2$ toward $4$. The target $4$ stays fixed during the update because it was built from $\\theta^-$.`
      },
      {
        q: `Why does plain online Q-learning with a neural network (no replay buffer, no target network) tend to diverge?`,
        steps: [
          { do: `Name the three ingredients present.`, why: `Function approximation (the net), bootstrapping (target uses $\\hat Q$ of the next state), and off-policy learning (the $\\max$) &mdash; the deadly triad.` },
          { do: `Note that consecutive samples are highly correlated.`, why: `Without a replay buffer the net trains on a stream of near-identical frames, biasing the gradient.` },
          { do: `Note the target uses the live weights.`, why: `Without a target net, updating $\\theta$ also moves the target $y$, creating a feedback loop.` }
        ],
        answer: `The deadly triad (function approximation + bootstrapping + off-policy) plus correlated samples and a moving target form a feedback loop that lets value estimates explode. Experience replay de-correlates the samples and the target network freezes the bootstrap, breaking the loop.`
      },
      {
        q: `In Double DQN, the target is $y = r + \\gamma\\,\\hat Q\\big(s', \\arg\\max_{a'}\\hat Q(s',a';\\theta);\\ \\theta^-\\big)$. Which net SELECTS the next action and which net EVALUATES it, and what bias does this remove?`,
        steps: [
          { do: `Read the $\\arg\\max$ term.`, why: `It uses $\\theta$ (the online net) to pick which next action looks best.` },
          { do: `Read the outer $\\hat Q(\\dots;\\theta^-)$.`, why: `It uses $\\theta^-$ (the target net) to score that chosen action.` },
          { do: `Recall standard DQN uses $\\max_{a'}\\hat Q(s',a';\\theta^-)$ for both at once.`, why: `Selecting and evaluating with the same noisy max over-estimates value.` }
        ],
        answer: `The ONLINE net ($\\theta$) selects the action; the TARGET net ($\\theta^-$) evaluates it. Decoupling them removes the maximization / OVER-ESTIMATION bias that standard DQN's single $\\max$ introduces.`
      }
    ]
  });

  window.CODE["rl-dqn"] = {
    lib: "gymnasium + PyTorch (runs in Colab)",
    runnable: false,
    explain:
      `<p>A compact, complete DQN on <code>CartPole-v1</code>: a small MLP (Multi-Layer Perceptron)
       Q-network, a replay buffer, $\\epsilon$-greedy exploration, a periodically synced target network,
       and the mean-squared Bellman loss. CartPole is solved when the pole stays up for ~200+ steps. In
       <b>Colab</b>, first run <code>!pip install gymnasium torch</code>. For a battle-tested version,
       <code>stable_baselines3.DQN("MlpPolicy", "CartPole-v1").learn(50_000)</code> does the same in three
       lines.</p>`,
    code: `# DQN on CartPole-v1 — Colab:  !pip install gymnasium torch
import random, collections
import numpy as np, torch, torch.nn as nn, gymnasium as gym

env = gym.make("CartPole-v1")
n_obs = env.observation_space.shape[0]   # 4: position, velocity, angle, angular velocity
n_act = env.action_space.n               # 2: push left / push right
device = "cuda" if torch.cuda.is_available() else "cpu"

def make_q():                            # small MLP Q-network: state -> one Q value per action
    return nn.Sequential(
        nn.Linear(n_obs, 128), nn.ReLU(),
        nn.Linear(128, 128),   nn.ReLU(),
        nn.Linear(128, n_act)).to(device)

q      = make_q()                        # online network, weights theta
q_targ = make_q(); q_targ.load_state_dict(q.state_dict())   # target net, weights theta-minus (frozen copy)
opt    = torch.optim.Adam(q.parameters(), lr=1e-3)
buffer = collections.deque(maxlen=50_000)    # experience replay buffer of (s,a,r,s',done)
gamma, batch_size, target_sync = 0.99, 64, 500

def act(state, eps):                     # epsilon-greedy: explore with prob eps, else greedy
    if random.random() < eps:
        return env.action_space.sample()
    with torch.no_grad():
        s = torch.as_tensor(state, dtype=torch.float32, device=device)
        return int(q(s).argmax().item())

def learn():                             # one gradient step on a random minibatch
    if len(buffer) < batch_size:
        return
    batch = random.sample(buffer, batch_size)           # random sample breaks correlation
    s, a, r, s2, d = map(np.array, zip(*batch))
    s   = torch.as_tensor(s,  dtype=torch.float32, device=device)
    s2  = torch.as_tensor(s2, dtype=torch.float32, device=device)
    a   = torch.as_tensor(a,  dtype=torch.int64,   device=device)
    r   = torch.as_tensor(r,  dtype=torch.float32, device=device)
    d   = torch.as_tensor(d,  dtype=torch.float32, device=device)
    q_sa = q(s).gather(1, a.unsqueeze(1)).squeeze(1)     # Q(s,a;theta)
    with torch.no_grad():                               # target uses FROZEN theta-minus
        max_next = q_targ(s2).max(dim=1).values          # max_a' Q(s',a'; theta-minus)
        y = r + gamma * max_next * (1.0 - d)             # Bellman TD target; 0 bootstrap if done
    loss = nn.functional.mse_loss(q_sa, y)               # mean squared TD error
    opt.zero_grad(); loss.backward(); opt.step()

steps = 0
for ep in range(400):
    state, _ = env.reset()
    eps = max(0.02, 1.0 - ep / 200)                      # anneal exploration high -> low
    ep_return, done = 0.0, False
    while not done:
        action = act(state, eps)
        nxt, reward, term, trunc, _ = env.step(action)
        done = term or trunc
        buffer.append((state, action, reward, nxt, float(term)))   # store transition
        state, ep_return, steps = nxt, ep_return + reward, steps + 1
        learn()
        if steps % target_sync == 0:                     # periodically sync target net
            q_targ.load_state_dict(q.state_dict())
    if ep % 20 == 0:
        print(f"episode {ep:3d}  return {ep_return:6.1f}  eps {eps:.2f}")
# Return climbs from ~20 toward the 500 cap as the pole is balanced longer and longer.`
  };

  window.CODEVIZ["rl-dqn"] = {
    question: "Does the agent actually learn? Plot episode return over training — it should rise and then solve the task.",
    charts: [
      {
        type: "line",
        title: "Episode return rising over training, balance task (solved ≈ 200 steps)",
        xlabel: "episode",
        ylabel: "smoothed episode return (steps survived)",
        series: [
          {
            name: "episode return",
            color: "#4ea1ff",
            points: [
              [0, 26.6], [38, 44.53], [76, 56.13], [114, 101.73], [152, 174.2],
              [190, 182.77], [228, 200.0], [266, 200.0], [304, 200.0], [342, 200.0],
              [380, 200.0], [418, 200.0], [456, 200.0], [494, 200.0], [532, 200.0], [570, 200.0]
            ]
          }
        ]
      }
    ],
    caption: "Real numbers from a tabular Q-learning agent on a tiny CartPole-style balance task (an 11-state tilt corridor: +1 per step the pole stays up, episode caps at 200 steps = solved). The return climbs from ~27 to the 200-step ceiling as the Q-values sharpen and epsilon decays, then plateaus once the agent balances indefinitely. Real DQN on CartPole-v1 climbs the same S-curve to its 500-step cap — same shape, just with a neural net standing in for the table.",
    code: `import numpy as np
# Tiny tabular Q-learning on a CartPole-style balance proxy: a faithful stand-in for
# DQN on CartPole — the LEARNING CURVE has the same shape (rise, then solve/plateau).
rng = np.random.default_rng(0)
N_STATES, CENTER, MAX_STEPS = 11, 5, 200      # tilt -5..+5 mapped to 0..10; center balanced
Q = np.zeros((N_STATES, 2))                    # 2 actions: 0 = push left, 1 = push right
gamma, alpha = 0.99, 0.1
returns = []
for ep in range(600):
    tilt, total = CENTER, 0.0
    eps = max(0.02, 1.0 - ep / 250.0)          # epsilon decay: explore -> exploit
    for t in range(MAX_STEPS):
        a = int(np.argmax(Q[tilt])) if rng.random() >= eps else rng.integers(2)
        push = -1 if a == 0 else 1             # the chosen push
        drift = rng.integers(-1, 2)            # random environment drift in {-1,0,1}
        tilt2 = tilt + push + drift
        fell = tilt2 < 0 or tilt2 >= N_STATES  # fell off -> episode ends
        tilt2 = min(N_STATES - 1, max(0, tilt2))
        r = 1.0 if not fell else 0.0           # +1 per surviving step
        target = r + (0.0 if fell else gamma * Q[tilt2].max())   # Bellman TD target
        Q[tilt, a] += alpha * (target - Q[tilt, a])              # TD update
        tilt, total = tilt2, total + r
        if fell:
            break
    returns.append(total)

sm = np.convolve(returns, np.ones(30) / 30, mode='valid')        # smoothed learning curve
idx = np.linspace(0, len(sm) - 1, 16).astype(int)               # subsample to 16 points
print([[int(i), round(float(sm[i]), 2)] for i in idx])`
  };
})();
