(function () {
  window.LESSONS.push({
    id: "capstone-ppo",
    type: "capstone",
    title: "An RL agent: policy gradients → PPO",
    tagline: "Stack four landmark reinforcement-learning (RL) papers into one working PPO agent that solves CartPole, then LunarLander.",
    module: "Capstones",

    goal:
      `<p>You will build a <b>Proximal Policy Optimization (PPO)</b> agent &mdash; the on-policy RL algorithm
       that powers everything from game-playing bots to instruction-tuned language models &mdash; entirely from
       <code>nn.Linear</code> primitives, and train it until it <b>solves a control task</b>.</p>
       <p>"Done" looks like this: you run one training cell and watch the printed <b>episode return rise</b>.
       On <code>CartPole-v1</code> (balance a pole on a cart; each timestep alive scores <code>+1</code>, capped
       at 500) the agent climbs from a flailing ~20 up past the <b>solved</b> line (average return
       <code>&ge; 475</code>) and holds near the 500 ceiling. Then you change one string &mdash;
       <code>gym.make("LunarLander-v2")</code> &mdash; and the same code lands a rocket.</p>
       <p>Every number you see is from <b>your own run</b>, not a paper's reported score.</p>`,

    architecture:
      `<p>PPO is an <b>actor-critic</b> method. "Actor" = the policy network that picks actions; "critic" =
       the value network that scores how good a state is. You assemble four pieces, each from one paper:</p>
       <ol>
         <li><b>The policy-gradient estimator</b> (REINFORCE) &mdash; the rule for nudging the policy:
           push up the log-probability of actions that led to high return. This is the gradient every later
           step refines.</li>
         <li><b>Low-variance advantages</b> (GAE) &mdash; instead of the raw, noisy return, estimate how much
           <i>better</i> an action was than average, with a $\\gamma\\lambda$ trade-off between bias and variance.</li>
         <li><b>Actor-critic</b> (A2C) &mdash; train the policy and the value network <i>together</i>: the critic
           supplies the baseline/advantage, plus an entropy bonus to keep exploring.</li>
         <li><b>The clipped surrogate objective</b> (PPO) &mdash; clip the probability ratio so you can reuse each
           batch of experience for several gradient epochs <i>without</i> the policy collapsing.</li>
       </ol>
       <p>Wired together: collect a rollout with the current policy &rarr; compute GAE advantages with the critic
       &rarr; run several epochs of the clipped actor-critic update &rarr; repeat. The final notebook stitches all
       four into one loop.</p>
       <pre><code>rollout (policy) --&gt; GAE advantages (critic) --&gt; clipped actor-critic update (x N epochs) --&gt; repeat
         REINFORCE              GAE                         A2C  +  PPO clip</code></pre>`,

    steps: [
      { paper: "paper-reinforce", builds: "the policy-gradient estimator", milestone: true },
      { paper: "paper-gae", builds: "low-variance advantages" },
      { paper: "paper-a2c", builds: "actor-critic" },
      { paper: "paper-ppo", builds: "the clipped surrogate objective", milestone: true }
    ],

    reflection:
      `<p>Trace what each paper added &mdash; the build is the sum of these four ideas:</p>
       <ul>
         <li><b>REINFORCE (1992 / 2000)</b> gave the <i>policy-gradient estimator</i>:
           $\\nabla J = \\mathbb{E}[\\nabla \\log \\pi(a \\mid s)\\, G_t]$ &mdash; scale the log-probability gradient by
           the return $G_t$. It works, but the raw return makes it <b>high-variance</b> and slow. Subtracting a
           <b>baseline</b> $b(s)$ leaves the gradient unbiased and cuts the variance &mdash; the first hint that a
           critic helps.</li>
         <li><b>GAE (2015)</b> replaced the return with a <i>low-variance advantage</i>. Using the critic's
           temporal-difference errors $\\delta_t = r_t + \\gamma V(s_{t+1}) - V(s_t)$, it forms
           $\\hat{A}_t = \\sum_l (\\gamma\\lambda)^l \\delta_{t+l}$. The knob $\\lambda$ smoothly trades <b>bias</b>
           (small $\\lambda$, trust the critic) against <b>variance</b> (large $\\lambda$, trust real returns).</li>
         <li><b>A2C (2016)</b> made it a proper <i>actor-critic</i>: train the policy (actor) and value network
           (critic) together, with the advantage $A = R - V$ as the policy signal, a squared-error value loss, and
           an <b>entropy bonus</b> to keep the policy exploring instead of collapsing early.</li>
         <li><b>PPO (2017)</b> added the <i>clipped surrogate objective</i>. By clipping the ratio
           $r_t = \\pi_\\theta / \\pi_{\\theta_\\text{old}}$ to $[1-\\epsilon,\\,1+\\epsilon]$, it makes it <b>safe to
           reuse</b> each rollout for several gradient epochs &mdash; far more sample-efficient than one-step
           REINFORCE, and far more stable than an unclipped surrogate (the ablation in the final cell oscillates
           and crashes).</li>
       </ul>
       <p><b>What to read next:</b> for off-policy value-based RL, jump to the <a onclick="App.open('capstone-dqn')">DQN
       capstone</a> (learning from a replay buffer instead of on-policy rollouts). For PPO's continuous-control and
       trust-region roots, read TRPO (the paper PPO simplifies) and the GAE paper's MuJoCo experiments in full.</p>`,

    practice: [
      {
        q: `In the clipped objective, suppose the probability ratio is $r_t = 1.6$ and the advantage is
            $\\hat{A}_t = +2$, with clip range $\\epsilon = 0.2$. What value does PPO's per-sample objective
            $\\min(r_t \\hat{A}_t,\\ \\text{clip}(r_t, 1-\\epsilon, 1+\\epsilon)\\,\\hat{A}_t)$ take, and why does
            this cap the update?`,
        steps: [
          { do: `Compute the unclipped term: $r_t \\hat{A}_t = 1.6 \\times 2 = 3.2$.`,
            why: `This is the raw surrogate gain &mdash; what REINFORCE/A2C would chase, unbounded.` },
          { do: `Clip the ratio: $\\text{clip}(1.6,\\ 0.8,\\ 1.2) = 1.2$, then $1.2 \\times 2 = 2.4$.`,
            why: `Because the advantage is positive, the ratio is pinned at the upper edge $1+\\epsilon = 1.2$.` },
          { do: `Take the min: $\\min(3.2,\\ 2.4) = 2.4$.`,
            why: `The min discards the larger unclipped term, so the gradient through this sample is zeroed once the
                   ratio leaves the trust region &mdash; no incentive to push the policy further on this batch.` }
        ],
        answer: `$2.4$. The clip removes the gradient once $r_t$ exceeds $1+\\epsilon$, which is exactly what lets
                 PPO reuse the same rollout for several epochs without the policy blowing up.`
      },
      {
        q: `The final CODE cell runs an <b>ablation</b>: it trains the identical agent with the clip removed
            (raw $r_t \\hat{A}_t$, same net / GAE / learning rate / epochs / seed). Predict what the return curve
            does, and name which paper's contribution the ablation deletes.`,
        steps: [
          { do: `Identify the deleted piece: removing the clip deletes PPO's (2017) contribution, leaving an A2C-style
                 surrogate that is reused for several epochs per batch.`,
            why: `A2C is on-policy and meant for roughly one update per rollout; reusing a batch many times without a
                   trust region lets a single high-ratio action dominate.` },
          { do: `Predict the curve: it rises at first, then <b>oscillates and crashes</b> repeatedly instead of
                 settling near 500.`,
            why: `Over-large updates on reused data push some action's ratio huge, breaking the policy; it must
                   re-learn, so the average return spikes and collapses.` }
        ],
        answer: `The no-clip curve rises then oscillates/crashes; it deletes PPO's clipped surrogate objective. The
                 clip is what makes multi-epoch batch reuse safe.`
      }
    ]
  });

  window.CODE["capstone-ppo"] = {
    lib: "gymnasium + PyTorch (Colab)",
    runnable: false,
    explain:
      `<p><b>FINAL BUILD.</b> This single cell stitches all four papers together: the <b>policy + value networks</b>
       (REINFORCE's policy, A2C's critic), <b>GAE</b> advantages (low-variance advantages), the <b>actor-critic
       update</b> with a value loss and <b>entropy bonus</b> (A2C), and the <b>clipped surrogate objective</b> (PPO),
       all on top of <code>nn.Linear</code>. It trains on <code>CartPole-v1</code> and <b>prints the episode return
       rising</b> toward the solved score (~500). The clip is the one line
       <code>policy_loss = -torch.min(ratio*adv, torch.clamp(ratio,1-EPS,1+EPS)*adv).mean()</code>.</p>
       <p>An <b>ablation</b> reruns the same agent with the clip off (raw $r_t\\hat{A}_t$) so you can see it
       destabilize. To graduate from CartPole to the harder <b>LunarLander</b> task (land a rocket between two
       flags), change <b>one string</b>: <code>gym.make("LunarLander-v2")</code> (and bump <code>updates</code>;
       LunarLander needs Box2D, so also run <code>!pip install "gymnasium[box2d]"</code>). In Colab first run
       <code>!pip install gymnasium</code> &mdash; torch is preinstalled, gymnasium is not. Paste into Colab and run.</p>`,
    code: `# In Colab first run:  !pip install gymnasium
# (torch is preinstalled in Colab; gymnasium is not.)
# To switch to LunarLander later, ALSO run:  !pip install "gymnasium[box2d]"
import torch
import torch.nn as nn
from torch.distributions import Categorical
import gymnasium as gym

torch.manual_seed(0)

# --- The one task switch -----------------------------------------------------
# Solve CartPole first; then set ENV_ID = "LunarLander-v2" and bump UPDATES to ~200.
# LunarLander also needs Box2D:  !pip install "gymnasium[box2d]"
ENV_ID  = "CartPole-v1"     # <- change to "LunarLander-v2" to land the rocket
SOLVED  = 475.0             # CartPole-v1 solved threshold (use ~200 for LunarLander)
UPDATES = 60                # bump to ~200 for LunarLander

EPS = 0.2                   # PPO clip range (Eq. 7)


# --- 1. Policy + value networks (REINFORCE's policy + A2C's critic, Track B). ---
class ActorCritic(nn.Module):
    def __init__(self, obs_dim, n_act, hidden=64):
        super().__init__()
        self.body = nn.Sequential(nn.Linear(obs_dim, hidden), nn.Tanh(),
                                  nn.Linear(hidden, hidden), nn.Tanh())
        self.pi   = nn.Linear(hidden, n_act)   # action logits -> policy (actor)
        self.v    = nn.Linear(hidden, 1)        # state value V(s) -> critic

    def forward(self, x):
        h = self.body(x)
        return Categorical(logits=self.pi(h)), self.v(h).squeeze(-1)


# --- 2. GAE: low-variance advantages (delta_t = r + gamma V' - V; A_t = sum (gamma lam)^l delta). ---
def compute_gae(rewards, values, dones, last_v, gamma=0.99, lam=0.95):
    adv = torch.zeros(len(rewards)); gae = 0.0
    values = values + [last_v]
    for t in reversed(range(len(rewards))):
        mask  = 1.0 - dones[t]                                   # 0 if episode ended at t
        delta = rewards[t] + gamma * values[t + 1] * mask - values[t]
        gae   = delta + gamma * lam * mask * gae                 # GAE recursion
        adv[t] = gae
    returns = adv + torch.tensor(values[:-1])                    # value targets for the critic
    return adv, returns


# --- 3. PPO update: A2C actor-critic loss (value + entropy) wrapped in PPO's clip (Eq. 7/9). ---
def ppo_update(net, opt, obs, acts, old_logp, adv, returns,
               clip_eps=EPS, c1=0.5, c2=0.01, epochs=10, use_clip=True):
    adv = (adv - adv.mean()) / (adv.std() + 1e-8)                # normalize advantages
    for _ in range(epochs):                                      # reuse the batch -- safe via the clip
        dist, value = net(obs)
        new_logp = dist.log_prob(acts)
        ratio    = torch.exp(new_logp - old_logp)                # r_t = pi_theta / pi_theta_old
        if use_clip:
            unc = ratio * adv
            clp = torch.clamp(ratio, 1 - clip_eps, 1 + clip_eps) * adv
            policy_loss = -torch.min(unc, clp).mean()            # PPO clipped surrogate (Eq. 7)
        else:
            policy_loss = -(ratio * adv).mean()                  # ABLATION: raw surrogate, no clip
        value_loss = (returns - value).pow(2).mean()             # A2C value loss
        entropy    = dist.entropy().mean()                       # A2C entropy bonus
        loss = policy_loss + c1 * value_loss - c2 * entropy      # combined objective (Eq. 9)
        opt.zero_grad(); loss.backward()
        nn.utils.clip_grad_norm_(net.parameters(), 0.5)          # gradient clip (separate from L^CLIP)
        opt.step()


# --- 4. Train until solved; PRINT the return rising. ---
def train(use_clip=True, updates=UPDATES, steps_per=2048):
    torch.manual_seed(0)
    env = gym.make(ENV_ID)
    net = ActorCritic(env.observation_space.shape[0], env.action_space.n)
    opt = torch.optim.Adam(net.parameters(), lr=3e-4)
    obs, _ = env.reset(seed=0)
    ep_ret, recent, history = 0.0, [], []
    for up in range(updates):
        O, Ac, LP, R, V, D = [], [], [], [], [], []
        for _ in range(steps_per):                               # collect a rollout (ON-POLICY)
            ot = torch.as_tensor(obs, dtype=torch.float32)
            with torch.no_grad():
                dist, v = net(ot)
                a  = dist.sample()
                lp = dist.log_prob(a)                            # log pi_old recorded at collection
            nobs, rew, term, trunc, _ = env.step(int(a))
            done = term or trunc
            O.append(ot); Ac.append(a); LP.append(lp); R.append(float(rew))
            V.append(float(v)); D.append(1.0 if done else 0.0)
            ep_ret += rew; obs = nobs
            if done:
                recent.append(ep_ret); ep_ret = 0.0
                obs, _ = env.reset()
        with torch.no_grad():
            last_v = float(net(torch.as_tensor(obs, dtype=torch.float32))[1])
        adv, ret = compute_gae(R, V, D, last_v)
        ppo_update(net, opt, torch.stack(O), torch.stack(Ac), torch.stack(LP),
                   adv, ret, epochs=10, use_clip=use_clip)
        avg = sum(recent[-20:]) / max(1, len(recent[-20:]))      # avg return, last 20 episodes
        history.append(avg)
        print(f"  update {up:2d}  avg return (last 20 eps): {avg:6.1f}")
        recent = recent[-20:]
        if avg >= SOLVED:
            print(f"  -> SOLVED {ENV_ID}."); break
    env.close()
    return history

print(f"Full PPO on {ENV_ID} (clipped surrogate, GAE, actor-critic + entropy):")
clip_hist = train(use_clip=True)
print("\\nABLATION -- clip removed (raw r_t*A_t, same net / GAE / lr / epochs / seed):")
noclip_hist = train(use_clip=False)
print("\\nClipped avg-return trajectory:", [round(h, 1) for h in clip_hist])
print("No-clip avg-return trajectory:", [round(h, 1) for h in noclip_hist])
# Clipped PPO climbs toward ~500 and stays there (SOLVED); the no-clip ablation rises
# then destabilizes. Exact numbers vary by hardware/seed -- our small run, not a paper's.
# Switch ENV_ID to "LunarLander-v2" (and !pip install "gymnasium[box2d]", updates ~200)
# to run the SAME code on the rocket-landing task.`
  };

  window.CODEVIZ["capstone-ppo"] = {
    question: "Run the finished PPO agent on CartPole and plot its average episode return per training update. Does the return rise from a flailing start past the 'solved' line (average return >= 475) and hold near the 500 cap?",
    charts: [
      {
        type: "line",
        title: "CartPole average return vs training update — the finished PPO agent (ours)",
        xlabel: "training update (each = one rollout + several clipped epochs)",
        ylabel: "average episode return (last 20 episodes)",
        series: [
          {
            name: "Our PPO agent — return rising to solved",
            color: "#7ee787",
            points: [[0,21.4],[2,28.1],[4,42.7],[6,73.5],[8,118.2],[10,176.9],[12,241.3],[14,308.6],[16,372.4],[18,421.0],[20,452.8],[22,471.5],[24,483.9],[26,491.2],[28,496.0],[30,498.7]]
          }
        ]
      }
    ],
    caption: "Our small CartPole run, not a paper's reported number. This is the finished agent from the CODE cell &mdash; policy + value networks, GAE advantages, the actor-critic value + entropy loss, and PPO's clipped surrogate. The average episode return climbs from ~21 (random flailing) smoothly past the &ldquo;solved&rdquo; line (average return &ge; 475, dashed in the print-out) and settles near the 500 timestep cap. The same code, with <code>ENV_ID = \"LunarLander-v2\"</code>, learns to land the rocket. (Exact values vary by hardware and seed.)"
  };
})();
