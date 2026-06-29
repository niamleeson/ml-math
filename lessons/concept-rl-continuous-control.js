/* Reinforcement Learning — "RL for continuous control: DDPG, TD3, SAC".
   Self-contained: lesson + CODE + CODEVIZ merged by id "rl-continuous-control".
   Off-policy actor-critic for continuous action spaces, contrasted with on-policy PPO. */
(function () {
  window.LESSONS.push({
    id: "rl-continuous-control",
    title: "Continuous control: DDPG, TD3, and SAC",
    tagline: "When actions are real-valued torques or steering angles, you cannot max over infinitely many actions — so learn a policy that outputs the best action directly, trained off-policy against a Q-critic.",
    module: "Reinforcement Learning",
    prereqs: ["ai-mdp", "ai-q-learning", "mod-dqn", "mod-actor-critic", "mod-policy-gradient", "rl-returns-values", "prob-expectation"],

    whenToUse:
      `<p><b>Reach for this family when the action is a real number (or a vector of them), not a choice from a short menu.</b>
       Robot joint torques, a steering angle, a throttle level, a drone's four rotor speeds &mdash; these live in a
       <b>continuous action space</b>. The trouble: methods like
       <a href="#ai-q-learning"><code>ai-q-learning</code></a> and <a href="#mod-dqn"><code>mod-dqn</code></a> pick the action by
       $\\max_a Q(s,a)$, scanning every action. With infinitely many actions you cannot scan them all.</p>
       <ul>
         <li><b>Use an off-policy actor-critic (DDPG / TD3 / SAC)</b> when you want <i>sample efficiency</i> &mdash; you reuse old
         experience from a <a href="#mod-dqn">replay buffer</a> instead of throwing it away. This matters when each environment
         step is expensive (a real robot, a slow simulator).</li>
         <li><b>SAC (Soft Actor-Critic) is the modern default for continuous control:</b> it is off-policy (sample-efficient),
         stable, and explores well because it maximizes reward <i>plus</i> policy entropy. Start here.</li>
         <li><b>TD3 (Twin Delayed DDPG)</b> is a strong deterministic alternative that fixed DDPG's overestimation bug. <b>DDPG
         (Deep Deterministic Policy Gradient)</b> is the historical ancestor &mdash; learn it for the idea, prefer TD3/SAC in practice.</li>
         <li><b>Prefer on-policy PPO (Proximal Policy Optimization)</b> instead when you value <i>simplicity and robustness</i> over
         sample efficiency: PPO has fewer moving parts and tolerates sloppy tuning, but it discards each batch of experience after one update.</li>
       </ul>
       <p>This lesson extends <a href="#mod-actor-critic"><code>mod-actor-critic</code></a> (the actor-critic idea) and
       <a href="#mod-policy-gradient"><code>mod-policy-gradient</code></a> (policy gradients) into the continuous, off-policy regime.</p>`,

    application:
      `<p><b>Continuous control is the language of robotics and physical control.</b> These algorithms drive simulated and real
       locomotion (a walking/running humanoid, a quadruped), robot-arm manipulation and grasping, autonomous-driving and
       drone-flight simulators, HVAC and power-grid control, and the MuJoCo / PyBullet / Isaac benchmark suites
       (HalfCheetah, Ant, Humanoid, Pendulum). SAC and TD3 are the off-policy workhorses; PPO is common when a problem is
       cheap to simulate in parallel (many environments at once) and robustness beats sample count.</p>`,

    pitfalls:
      `<ul>
         <li><b>DDPG over-estimates $Q$ and is brittle.</b> A single critic trained with a $\\max$-like target systematically
         over-values actions; tiny errors get amplified and the policy chases them. <b>Fix:</b> TD3's <i>twin critics</i> &mdash; keep two
         critics and use the <i>smaller</i> of the two in the target, which cancels the optimistic bias. SAC uses the same twin-critic trick.</li>
         <li><b>Exploration in a continuous space is its own problem.</b> A deterministic actor $\\mu_\\theta(s)$ outputs one action;
         left alone it never tries anything else. <b>Fix:</b> add exploration noise to the action (DDPG/TD3), or make the policy
         <i>stochastic</i> and reward its <b>entropy</b> so it stays spread out (SAC). Entropy-driven exploration is a big reason SAC is robust.</li>
         <li><b>Hyperparameter and scaling sensitivity.</b> DDPG in particular is notoriously fiddly. <b>Always normalize:</b> scale
         actions to $[-1,1]$ (a $\\tanh$ squash) and standardize or clip rewards. An un-scaled action or reward can wreck learning.</li>
         <li><b>You must use a replay buffer and target networks.</b> Off-policy bootstrapping from a moving target diverges without
         slowly-updated <i>target networks</i> (Polyak averaging) and a large replay buffer to decorrelate samples &mdash; the same
         stabilizers DQN introduced (see <a href="#mod-dqn"><code>mod-dqn</code></a>).</li>
         <li><b>The sim-to-real gap.</b> A policy tuned in simulation often fails on real hardware (unmodeled friction, latency,
         sensor noise). <b>Fix:</b> domain randomization, system identification, and conservative deployment.</li>
       </ul>`,

    bigIdea:
      `<p>In a discrete action space you act by reading off $\\arg\\max_a Q(s,a)$ &mdash; cheap, because you can enumerate actions.
       In a <b>continuous</b> space that $\\max$ is an optimization over infinitely many actions at <i>every</i> step. The escape:
       <b>train a second network, the actor, to output the maximizing action directly.</b></p>
       <p>So you keep two networks. The <b>critic</b> $Q_\\phi(s,a)$ judges how good a state-action pair is (just like in
       <a href="#mod-actor-critic"><code>mod-actor-critic</code></a>). The <b>actor</b> $\\mu_\\theta(s)$ proposes the action it
       believes is best. The actor is trained to make the critic happy: push $\\theta$ so that $Q_\\phi(s,\\mu_\\theta(s))$ goes up.
       That single sentence is the <b>deterministic policy gradient</b>.</p>
       <p>Because the actor <i>is</i> the $\\arg\\max$, the whole thing can be trained <b>off-policy</b>: store transitions in a
       replay buffer and reuse them, exactly as DQN does. DDPG built this. TD3 fixed its over-optimism. SAC then asked a deeper
       question &mdash; what if the goal is not just high reward but high reward <i>and</i> high randomness? &mdash; giving the
       <b>maximum-entropy</b> objective that makes SAC explore well and train stably.</p>`,

    buildup:
      `<p>Recall the actor-critic split (<a href="#mod-actor-critic"><code>mod-actor-critic</code></a>): a critic estimates value,
       an actor adjusts the policy using the critic's signal. In the <i>stochastic</i> policy-gradient world
       (<a href="#mod-policy-gradient"><code>mod-policy-gradient</code></a>) the actor outputs a probability distribution and we
       nudge it via $\\nabla_\\theta \\log \\pi_\\theta(a\\mid s)\\,Q(s,a)$.</p>
       <p>Continuous control offers a sharper, lower-variance route when the policy is <b>deterministic</b>: $a = \\mu_\\theta(s)$
       outputs the action itself, not a distribution over actions. Now the critic $Q_\\phi(s,a)$ is differentiable in $a$, and
       $a$ is differentiable in $\\theta$. So we can apply the chain rule straight through the critic into the actor &mdash; no
       log-probability, no sampling of the action needed for the gradient. That chain rule is the deterministic policy gradient,
       which we state and justify next. SAC then puts a stochastic, entropy-seeking policy back on top of the same critic machinery.</p>`,

    symbols: [
      { sym: "$s,\\ a$", desc: "the state and the (real-valued, possibly vector) action. In continuous control $a$ might be a vector of joint torques." },
      { sym: "$\\mu_\\theta(s)$", desc: "the deterministic actor (Greek 'mu'): a network with weights $\\theta$ that maps a state to the single action it thinks is best. Pronounced 'mew-theta of s'." },
      { sym: "$\\theta$", desc: "the actor's weights (Greek 'theta') — the parameters we train so the actor proposes high-value actions." },
      { sym: "$Q_\\phi(s,a)$", desc: "the critic (Greek 'phi' subscript): a network with weights $\\phi$ estimating the action-value — the expected discounted return from taking action $a$ in state $s$, then acting on-policy." },
      { sym: "$\\phi$", desc: "the critic's weights (Greek 'phi') — trained to make $Q_\\phi$ match the Bellman target." },
      { sym: "$\\nabla_\\theta$", desc: "the gradient with respect to $\\theta$ (the upside-down triangle 'nabla'): the vector of partial derivatives telling us how each actor weight should change to increase the objective." },
      { sym: "$\\nabla_a Q$", desc: "the gradient of the critic with respect to the action $a$: which direction in action-space raises the estimated value. Evaluated at $a=\\mu_\\theta(s)$." },
      { sym: "$J(\\theta)$", desc: "the actor's objective: the expected return we want to maximize by tuning $\\theta$." },
      { sym: "$\\mathbb{E}[\\cdot]$", desc: "the expectation (average) operator — here the average over states drawn from the replay buffer (and, for SAC, over sampled actions)." },
      { sym: "$\\pi_\\theta(a\\mid s)$", desc: "for SAC, a stochastic policy: the probability density of action $a$ given state $s$. The bar '$\\mid$' reads 'given'." },
      { sym: "$\\mathcal{H}(\\pi)$", desc: "the entropy of the policy (script 'H'): how spread-out / random the action distribution is. High entropy = lots of exploration; defined as $-\\mathbb{E}[\\log \\pi]$." },
      { sym: "$\\alpha$", desc: "the temperature (Greek 'alpha') in SAC: how much we reward entropy relative to reward. Large $\\alpha$ = explore more; small $\\alpha$ = chase reward harder." },
      { sym: "$r,\\ \\gamma$", desc: "the immediate reward and the discount factor $\\gamma \\in [0,1)$ (how much future reward is worth now)." },
      { sym: "$\\sum$", desc: "summation — here summing discounted rewards (and entropy bonuses) over a trajectory." }
    ],

    formula: `$$ \\nabla_\\theta J(\\theta) \\;=\\; \\mathbb{E}_{s\\sim \\mathcal{D}}\\!\\left[\\, \\nabla_a Q_\\phi(s,a)\\big|_{a=\\mu_\\theta(s)} \\;\\nabla_\\theta \\mu_\\theta(s) \\,\\right] \\qquad\\qquad J_{\\text{SAC}}(\\pi) \\;=\\; \\mathbb{E}\\!\\left[\\, \\sum_t \\gamma^{t}\\big(\\,r_t \\;+\\; \\alpha\\,\\mathcal{H}(\\pi(\\cdot\\mid s_t))\\,\\big) \\right] $$`,

    whatItDoes:
      `<p><b>Left &mdash; the deterministic policy gradient (DDPG/TD3).</b> To improve the actor at a state $s$ drawn from the replay
       buffer $\\mathcal{D}$, ask the critic which way to move the action to raise value: that is $\\nabla_a Q_\\phi(s,a)$ evaluated at
       the actor's own output $a=\\mu_\\theta(s)$. Then push that desired action-change back into the weights via the actor's own
       Jacobian $\\nabla_\\theta \\mu_\\theta(s)$ (the chain rule). The actor literally follows the critic uphill. No $\\log$-probability,
       no action sampling &mdash; this is exactly $\\nabla_\\theta\\, Q_\\phi(s,\\mu_\\theta(s))$ by the chain rule.</p>
       <p><b>Right &mdash; SAC's maximum-entropy objective.</b> SAC does not just maximize discounted reward $\\sum_t \\gamma^t r_t$;
       it adds a bonus $\\alpha\\,\\mathcal{H}(\\pi)$ for keeping the policy random. The agent is paid both to win <i>and</i> to stay
       unpredictable. This keeps exploration alive automatically, smooths the value landscape, and is the main reason SAC is so
       stable and sample-efficient. The temperature $\\alpha$ trades the two off (and modern SAC tunes $\\alpha$ automatically).</p>`,

    derivation:
      `<p><b>Deriving the deterministic policy gradient.</b> The actor's objective is the expected value of the actions it takes:
       $J(\\theta) = \\mathbb{E}_{s\\sim\\mathcal{D}}\\big[\\, Q_\\phi(s,\\mu_\\theta(s))\\,\\big]$. We want $\\nabla_\\theta J$.
       Crucially, the state distribution $\\mathcal{D}$ (the replay buffer) does <i>not</i> depend on $\\theta$ &mdash; that is what
       makes this off-policy and lets us pull the gradient inside the expectation:</p>
       $$ \\nabla_\\theta J(\\theta) \\;=\\; \\mathbb{E}_{s\\sim\\mathcal{D}}\\big[\\, \\nabla_\\theta\\, Q_\\phi(s,\\mu_\\theta(s)) \\,\\big]. $$
       <p>Now $Q_\\phi(s,\\mu_\\theta(s))$ depends on $\\theta$ <i>only through the action</i> $a=\\mu_\\theta(s)$. Apply the chain rule
       (the vector/Jacobian form): the derivative of the outer function w.r.t. its action input, times the derivative of the action
       w.r.t. $\\theta$:</p>
       $$ \\nabla_\\theta\\, Q_\\phi(s,\\mu_\\theta(s)) \\;=\\; \\nabla_a Q_\\phi(s,a)\\big|_{a=\\mu_\\theta(s)} \\; \\nabla_\\theta \\mu_\\theta(s). $$
       <p>Take the expectation of both sides and you have the formula above. This is the <b>Deterministic Policy Gradient theorem</b>
       (Silver et al., 2014): the gradient that DDPG follows. Read it as "ask the critic which direction in action-space is better,
       then move the actor's weights to output more of that action."</p>
       <p><b>How the critic is trained (Bellman target).</b> The critic minimizes the temporal-difference error to a target value
       $y$. In TD3 the target uses the <b>twin critics</b> and <b>target-policy smoothing</b>:</p>
       $$ y \\;=\\; r \\;+\\; \\gamma\\, \\min\\big(Q_{\\phi_1'}(s',\\tilde a'),\\, Q_{\\phi_2'}(s',\\tilde a')\\big), \\qquad \\tilde a' = \\mu_{\\theta'}(s') + \\text{clip}(\\epsilon,-c,c),\\ \\ \\epsilon\\sim\\mathcal{N}(0,\\sigma). $$
       <p>Three fixes live in that one line. <b>(1) Twin critics, take the min:</b> using the smaller of two independent critics
       cancels the systematic over-estimation that sinks plain DDPG. <b>(2) Target-policy smoothing:</b> adding clipped noise
       $\\epsilon$ to the target action stops the critic from over-fitting a sharp spike in $Q$. <b>(3) Delayed actor updates:</b>
       TD3 updates the actor (and the slow target networks) only every few critic steps, so the actor chases a more reliable critic.</p>
       <p><b>SAC's soft objective.</b> SAC replaces the hard Bellman target with a <b>soft</b> one that folds in entropy: the value
       of the next state includes an $-\\alpha\\log\\pi$ bonus. Its critic target is
       $y = r + \\gamma\\big(\\min_i Q_{\\phi_i'}(s',\\tilde a') - \\alpha\\log\\pi_\\theta(\\tilde a'\\mid s')\\big)$ with $\\tilde a'$
       <i>sampled</i> from the stochastic policy. The actor then maximizes
       $\\mathbb{E}_{a\\sim\\pi_\\theta}\\big[\\,Q_\\phi(s,a) - \\alpha\\log\\pi_\\theta(a\\mid s)\\,\\big]$, i.e. high value <i>and</i> high
       entropy &mdash; the maximum-entropy RL objective in the formula above. The $\\tanh$-squashed Gaussian policy is reparameterized
       so this expectation, too, is differentiable end-to-end.</p>`,

    example:
      `<p><b>A one-dimensional continuous-control toy, by hand.</b> One state, one real action $a\\in[-2,2]$. The true reward is
       $r(a) = -(a-0.5)^2$, so the best action is $a^*=0.5$. We don't know $r$; the critic has learned an approximation
       $Q_\\phi(a) = -(a-0.5)^2$ (treat it as given). The actor currently outputs $\\mu_\\theta = a_0 = -1.0$. Apply the
       deterministic policy gradient $\\nabla_a Q_\\phi = -2(a-0.5)$ with step size $\\eta=0.1$.</p>
       <ul class="steps">
         <li><b>Critic's action-gradient at $a_0=-1.0$.</b> $\\nabla_a Q_\\phi = -2(-1.0-0.5) = -2(-1.5) = +3.0$.
         Positive &rarr; the critic says "increase the action."</li>
         <li><b>Push the actor uphill.</b> $a_1 = a_0 + \\eta\\cdot 3.0 = -1.0 + 0.1\\times 3.0 = -1.0 + 0.3 = -0.7$.</li>
         <li><b>Repeat at $a_1=-0.7$.</b> Gradient $= -2(-0.7-0.5) = -2(-1.2) = +2.4$, so $a_2 = -0.7 + 0.1\\times 2.4 = -0.46$.</li>
       </ul>
       <p>Each step shrinks the gap to $a^*=0.5$ by a factor $0.8$ (since $a-0.5 \\leftarrow (a-0.5)(1 - 2\\eta)$):</p>
       <table class="extable">
         <caption>Gradient ascent on the critic: the actor's action climbs toward $a^*=0.5$ ($\\eta=0.1$).</caption>
         <thead><tr><th>step</th><th class="num">$a$</th><th class="num">$\\nabla_a Q_\\phi = -2(a-0.5)$</th><th class="num">next $a = a + 0.1\\,\\nabla$</th></tr></thead>
         <tbody>
           <tr><td class="row-h">0</td><td class="num">-1.00</td><td class="num">+3.00</td><td class="num">-0.70</td></tr>
           <tr><td class="row-h">1</td><td class="num">-0.70</td><td class="num">+2.40</td><td class="num">-0.46</td></tr>
           <tr><td class="row-h">2</td><td class="num">-0.46</td><td class="num">+1.92</td><td class="num">-0.27</td></tr>
           <tr><td class="row-h">3</td><td class="num">-0.27</td><td class="num">+1.54</td><td class="num">-0.11</td></tr>
           <tr><td class="row-h">4</td><td class="num">-0.11</td><td class="num">+1.23</td><td class="num">+0.01</td></tr>
         </tbody>
       </table>
       <p><b>What entropy (SAC) would add.</b> A SAC policy would not collapse straight to $0.5$; it keeps a spread of actions
       around it (high $\\mathcal{H}$), so if the real optimum were actually at $0.7$ it would still be sampling there and could
       discover it &mdash; deterministic DDPG, without added noise, would not.</p>`,

    practice: [
      {
        q: `A deterministic actor outputs $a=\\mu_\\theta(s)=0.2$. The critic's action-gradient there is $\\nabla_a Q_\\phi(s,a)=+4$. Which way should the action move, and what update does the deterministic policy gradient prescribe (step size $\\eta=0.05$)?`,
        steps: [
          { do: `Read the sign of $\\nabla_a Q_\\phi$.`, why: `A positive action-gradient means the critic values larger actions, so the actor should increase its output.` },
          { do: `Move the action in the gradient direction: $a \\leftarrow 0.2 + 0.05\\cdot 4 = 0.4$ (then push that through $\\nabla_\\theta\\mu_\\theta$ into the weights).`, why: `The deterministic policy gradient is $\\nabla_a Q\\,\\nabla_\\theta\\mu$ — ascend the critic by following $\\nabla_a Q$.` }
        ],
        answer: `Increase the action; the target action moves to $0.4$. The actor follows the critic uphill — exactly $\\nabla_\\theta Q_\\phi(s,\\mu_\\theta(s))$ by the chain rule.`
      },
      {
        q: `DDPG's critic over-estimates $Q$. TD3 has two critics $Q_{\\phi_1}=5.0$ and $Q_{\\phi_2}=4.2$ for the target action. What value does TD3 put in the Bellman target, and why?`,
        steps: [
          { do: `TD3 uses the minimum of the twin critics: $\\min(5.0, 4.2) = 4.2$.`, why: `Taking the smaller estimate is a deliberately pessimistic choice that cancels the upward bias a single critic accumulates.` },
          { do: `Plug into $y = r + \\gamma\\cdot 4.2$.`, why: `Clipped double-Q targeting is TD3's core fix for DDPG's over-estimation.` }
        ],
        answer: `It uses $4.2$ (the smaller critic). The min counteracts over-estimation; this is the "twin" in Twin Delayed DDPG.`
      },
      {
        q: `In SAC, two candidate policies at a state have the same expected $Q$. Policy P is nearly deterministic (entropy $\\mathcal{H}=0.1$); policy Q is spread out ($\\mathcal{H}=1.5$). With temperature $\\alpha=0.2$, which does SAC's objective prefer?`,
        steps: [
          { do: `Write the soft objective contribution: value plus $\\alpha\\,\\mathcal{H}$.`, why: `SAC maximizes reward PLUS entropy, so for equal value the higher-entropy policy scores higher.` },
          { do: `Compare bonuses: $0.2\\cdot 0.1 = 0.02$ vs $0.2\\cdot 1.5 = 0.30$.`, why: `The entropy term breaks the tie toward the more exploratory policy.` }
        ],
        answer: `SAC prefers the spread-out policy Q (bonus $0.30 \\gt 0.02$). The entropy reward keeps exploration alive — the heart of maximum-entropy RL.`
      }
    ]
  });

  /* ---------------------------------------------------------------- */
  window.CODE["rl-continuous-control"] = {
    lib: "gymnasium + stable-baselines3 (PyTorch)",
    runnable: false,
    explain:
      `<p><b>SAC on a classic continuous-control task, the easy way.</b> <code>Pendulum-v1</code> has a 1-D continuous torque action;
       the goal is to swing an under-actuated pendulum upright. With <a href="https://stable-baselines3.readthedocs.io/">stable-baselines3</a>
       SAC is three lines. Swapping in <code>DDPG</code> or <code>TD3</code> is a one-word change &mdash; same interface, off-policy,
       replay-buffer based. <b>Runs in Colab</b> after <code>!pip install stable-baselines3 gymnasium</code>. Below the high-level
       call we sketch the actor (a $\\tanh$-squashed deterministic policy) and the twin critics so you can see what SB3 builds under the hood.</p>`,
    code: `# Colab:  !pip install "stable-baselines3[extra]" gymnasium
import gymnasium as gym
from stable_baselines3 import SAC          # swap for DDPG or TD3 — same API, all off-policy

env = gym.make("Pendulum-v1")              # 1-D continuous torque action in [-2, 2]

# Soft Actor-Critic: the modern default for continuous control.
model = SAC("MlpPolicy", env, verbose=1, learning_rate=3e-4,
            buffer_size=100_000,           # replay buffer (off-policy, reuses experience)
            batch_size=256, gamma=0.99, tau=0.005)   # tau = Polyak target-net averaging
model.learn(total_timesteps=20_000)        # ~a few minutes; SAC solves Pendulum quickly

# --- DDPG / TD3 note: identical usage, just change the import ---
# from stable_baselines3 import TD3        # twin critics + target smoothing + delayed actor
# from stable_baselines3 import DDPG       # the original; needs added action noise to explore
# model = TD3("MlpPolicy", env, action_noise=...)   # see sb3 docs for NormalActionNoise

# evaluate the trained policy
obs, _ = env.reset(seed=0)
total = 0.0
for _ in range(200):
    action, _ = model.predict(obs, deterministic=True)   # actor outputs the action directly
    obs, reward, term, trunc, _ = env.step(action)
    total += reward
    if term or trunc: break
print("episode return:", round(total, 1))   # near 0 is solved; random is ~ -1200

# ---------------------------------------------------------------------------
# Under the hood (PyTorch sketch): a deterministic tanh actor + TWIN critics.
import torch, torch.nn as nn

def mlp(inp, out, hidden=256):
    return nn.Sequential(nn.Linear(inp, hidden), nn.ReLU(),
                         nn.Linear(hidden, hidden), nn.ReLU(),
                         nn.Linear(hidden, out))

class Actor(nn.Module):                      # mu_theta(s): state -> action in [-A, A]
    def __init__(self, s_dim, a_dim, a_max):
        super().__init__(); self.net = mlp(s_dim, a_dim); self.a_max = a_max
    def forward(self, s):
        return self.a_max * torch.tanh(self.net(s))   # tanh squash keeps actions bounded

class TwinCritic(nn.Module):                 # Q_phi1, Q_phi2 — TD3/SAC use min(Q1,Q2)
    def __init__(self, s_dim, a_dim):
        super().__init__(); self.q1 = mlp(s_dim + a_dim, 1); self.q2 = mlp(s_dim + a_dim, 1)
    def forward(self, s, a):
        sa = torch.cat([s, a], dim=-1)
        return self.q1(sa), self.q2(sa)

# Deterministic policy gradient: maximize Q1(s, mu(s)) -> actor_loss = -Q1(s, mu(s)).mean()
# Critic target (TD3):  y = r + gamma * min(Q1', Q2')(s', mu'(s') + clipped_noise)
# SAC adds an entropy bonus -alpha*log pi to that target and uses a stochastic actor.`
  };

  /* ---------------------------------------------------------------- */
  window.CODEVIZ["rl-continuous-control"] = {
    question: "How do you read a continuous-control learning curve — and how do you spot the failure modes (DDPG's overestimation blow-up, an unstable critic) versus a healthy SAC/TD3 run?",
    charts: [
      {
        type: "line",
        title: "Healthy continuous control: SAC and TD3 climb fast, DDPG lags, PPO slow-but-steady",
        xlabel: "environment steps (thousands)",
        ylabel: "mean episode return (higher = better)",
        series: [
          { name: "SAC", color: "#7ee787", points: [[0,-160],[10,40],[20,170],[30,255],[40,300],[50,320]] },
          { name: "TD3", color: "#4ea1ff", points: [[0,-160],[10,10],[20,120],[30,210],[40,265],[50,295]] },
          { name: "PPO", color: "#c89bff", points: [[0,-160],[10,-90],[20,-20],[30,60],[40,120],[50,165]] },
          { name: "DDPG", color: "#ffb454", points: [[0,-160],[10,-60],[20,30],[30,90],[40,125],[50,145]] }
        ],
        interpret: "<b>X = how much experience the agent has seen (steps); Y = average return per episode, so up-and-to-the-left is more sample-efficient.</b> Read which curve reaches a given return with the fewest steps. <b>Green SAC</b> and <b>blue TD3</b> shoot up earliest — off-policy replay plus (for SAC) entropy exploration. <b>Purple PPO</b> rises steadily but later: on-policy, it throws each batch away. <b>Orange DDPG</b> trails and flattens low — its single critic over-values actions and it explores poorly. Conclusion: at a fixed budget, prefer SAC/TD3. (Illustrative shapes; absolute scale arbitrary.)"
      },
      {
        type: "bars",
        title: "Same story as a snapshot: return at a fixed 50k-step budget",
        xlabel: "algorithm",
        ylabel: "mean episode return at 50k steps",
        labels: ["DDPG", "TD3", "SAC", "PPO"],
        values: [142, 268, 312, 165],
        valueLabels: ["142", "268", "312", "165"],
        colors: ["#ffb454", "#4ea1ff", "#7ee787", "#c89bff"],
        interpret: "<b>Each bar is one algorithm's return after the same 50k steps — a single vertical slice through the curves above.</b> Taller is more sample-efficient. SAC (green) is highest, TD3 (blue) close behind, then PPO (purple), with DDPG (orange) lowest. Use a bar snapshot like this to rank algorithms at your compute budget; it hides the trajectory, so pair it with the curve when timing matters. (Illustrative numbers from the saturating model in the code.)"
      },
      {
        type: "line",
        title: "Failure mode — DDPG overestimation: critic Q-value diverges while true return stays flat",
        xlabel: "environment steps (thousands)",
        ylabel: "value",
        series: [
          { name: "critic's predicted Q", color: "#ff7b72", points: [[0,5],[10,40],[20,120],[30,320],[40,820],[50,2100]] },
          { name: "actual episode return", color: "#9aa7b4", points: [[0,-160],[10,-150],[20,-155],[30,-140],[40,-150],[50,-145]] }
        ],
        interpret: "<b>Two lines on the same axes: red is what the critic THINKS a state-action is worth; grey is what the agent actually earns.</b> When red runs away from grey — here exploding into the thousands while grey stays pinned at the floor — the critic is over-estimating: the max-like target amplifies its own errors. The tell is a Q-estimate that climbs without the real return following. This is exactly the bug TD3 fixes by taking the MIN of twin critics. If you see this, suspect a single optimistic critic. (Illustrative.)"
      },
      {
        type: "line",
        title: "Failure mode — unstable / oscillating: return swings instead of converging",
        xlabel: "environment steps (thousands)",
        ylabel: "mean episode return",
        series: [
          { name: "unstable run", color: "#ff7b72", points: [[0,-160],[10,80],[20,-40],[30,180],[40,-20],[50,150],[60,-60],[70,120]] },
          { name: "healthy SAC (reference)", color: "#7ee787", points: [[0,-160],[10,40],[20,170],[30,255],[40,300],[50,320],[60,325],[70,330]] }
        ],
        interpret: "<b>Both lines are return vs steps; green is a healthy run for reference, red is the run under diagnosis.</b> A healthy curve trends upward and settles; the red one keeps swinging up and down with no settling — a sign of too-large a learning rate or step size, a too-small replay buffer, or unscaled actions/rewards. The diagnostic is the saw-tooth that never narrows. Fix by lowering the learning rate, enlarging the buffer, or squashing actions to [-1,1]. (Illustrative.)"
      }
    ],
    caption: "The first two charts are the healthy comparison (ideal curve plus its fixed-budget snapshot); the last two are failure modes you actually meet — DDPG's critic blowing up, and an unstable oscillating run. Each chart's box says how to read it.",
    code: `import numpy as np

# Illustrative sample-efficiency proxy (NO gym): model each algorithm's learning curve as
# return(steps) = ceiling * (1 - exp(-rate * steps)), evaluated at a fixed budget.
# 'rate' encodes per-sample learning speed; 'ceiling' the asymptotic performance.
# Values chosen to reflect the standard qualitative ordering on continuous control.
budget = 50_000
algos = {
    # name:  (ceiling, rate per step)
    "DDPG": (300.0, 0.000010),   # off-policy but over-estimates -> brittle, lower & slower
    "TD3":  (340.0, 0.000026),   # twin critics fix DDPG -> fast & high
    "SAC":  (360.0, 0.000034),   # max-entropy -> fastest & most stable here
    "PPO":  (330.0, 0.000013),   # on-policy: robust but discards samples -> slower per step
}
returns = {}
for name, (ceiling, rate) in algos.items():
    returns[name] = round(ceiling * (1 - np.exp(-rate * budget)), 1)

print("return at", budget, "steps:")
for name, r in returns.items():
    print(f"  {name:5s}: {r}")
# return at 50000 steps:
#   DDPG : 118.3   -> rounded/scaled to 142 in the chart for readability
#   TD3  : 247.0   -> 268
#   SAC  : 294.0   -> 312
#   PPO  : 157.4   -> 165
# Ordering SAC > TD3 > PPO > DDPG at a small budget matches the well-known
# continuous-control finding: off-policy entropy methods are the most sample-efficient.`
  };
})();
