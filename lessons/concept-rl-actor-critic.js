/* Reinforcement Learning — "Actor-Critic: a policy that acts and a value that judges".
   Self-contained: lesson + CODE + CODEVIZ merged by id "rl-actor-critic".
   Goes DEEPER than the existing mod-actor-critic lesson (the curriculum treatment:
   the TD-error advantage derivation, A2C/A3C, GAE) and cross-links it. Lead-in to PPO. */
(function () {
  window.LESSONS.push({
    id: "rl-actor-critic",
    title: "Actor-Critic: a policy that acts and a value that judges",
    tagline: "Keep policy gradients' flexibility but kill their variance — let a learned critic score each action with a one-step TD error, and train both nets together.",
    module: "Reinforcement Learning",
    prereqs: ["mod-actor-critic", "mod-policy-gradient", "aix-sarsa-td", "ai-mdp", "prob-expectation", "fnd-gradient"],

    whenToUse:
      `<p><b>Reach for actor-critic whenever you would use a policy-gradient method but the gradient is
       too noisy to learn from.</b> It is the workhorse of modern reinforcement learning (RL): it keeps
       the <i>flexibility</i> of a learned policy (the <b>actor</b>, $\\pi_\\theta$) &mdash; works for
       discrete OR continuous actions, can be stochastic &mdash; while borrowing the <i>low variance</i>
       of value learning (the <b>critic</b>, $\\hat V_w$). The critic replaces REINFORCE's noisy full
       Monte-Carlo return with a <b>bootstrapped</b> estimate, so the actor's updates are far steadier.</p>
       <ul>
         <li><b>Choose it over plain policy gradient (REINFORCE)</b> when the full-return gradient is so
         high-variance that learning crawls. The critic's baseline + bootstrap cut the variance sharply,
         and you can update <b>online</b> (every step) instead of waiting for the episode to end.</li>
         <li><b>Choose it over a Deep Q-Network (DQN)</b> when actions are <i>continuous</i> (a DQN needs a
         max over actions, which is intractable in continuous spaces) or when you want an explicitly
         <i>stochastic</i> policy that a DQN cannot represent.</li>
         <li><b>Pick something else when:</b> the task is tiny and tabular (plain Q-learning / SARSA is
         simpler); or you need maximum sample efficiency in continuous control (an off-policy actor-critic
         like SAC / TD3 reuses data more aggressively than on-policy A2C).</li>
       </ul>
       <p>This lesson is the curriculum-rigorous treatment. It deepens the existing
       <code>mod-actor-critic</code> lesson: there the advantage was introduced as $A = Q - V$ and PPO
       (Proximal Policy Optimization) sketched; here we <i>derive</i> the TD-error advantage, give the
       full actor and critic update rules, cover A2C / A3C and Generalized Advantage Estimation (GAE),
       and set up <b>PPO as the next step</b>.</p>`,

    application:
      `<p>Actor-critic is the architecture under most of today's deep-RL systems.</p>
       <ul>
         <li><b>Games.</b> A3C (Asynchronous Advantage Actor-Critic) was DeepMind's flagship Atari agent;
         PPO &mdash; an actor-critic &mdash; trained OpenAI Five to play Dota 2.</li>
         <li><b>Robotics and continuous control.</b> Locomotion, manipulation, and dexterous-hand tasks
         use actor-critic methods (PPO, SAC, TD3) because they handle continuous torques natively.</li>
         <li><b>RLHF (Reinforcement Learning from Human Feedback).</b> The reinforcement step that aligns
         large language models is usually PPO: the policy (actor) is the language model, and a learned
         value head (critic) estimates how good a partial completion is.</li>
         <li><b>Recommendation and operations.</b> Sequential recommendation, resource scheduling, and
         control problems where a low-variance, online policy gradient is needed.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>A bad critic biases the actor.</b> The actor trusts the critic's advantage. If
         $\\hat V_w$ is wrong, every actor update points in a slightly wrong direction &mdash; the bias
         compounds. <b>Fix:</b> let the critic learn fast enough (often a larger or equal learning rate,
         more critic steps) and watch the critic's loss alongside the return.</li>
         <li><b>Two learning rates that fight.</b> The actor step $\\alpha_\\theta$ and critic step
         $\\alpha_w$ are coupled: too-fast an actor chases a critic that has not caught up; too-slow an
         actor wastes a good critic. <b>Fix:</b> tune them together, change one at a time.</li>
         <li><b>Still on-policy &mdash; sample-inefficient.</b> Vanilla A2C must throw data away after a
         few updates (the gradient is only valid for the current policy). <b>Fix:</b> for costly
         simulators use an off-policy actor-critic (SAC / TD3), or PPO, which squeezes several safe
         updates out of each batch.</li>
         <li><b>Instability.</b> Bootstrapping (the critic uses its own estimate of $\\hat V(s')$) plus
         function approximation plus a moving policy is the classic "deadly triad" &mdash; values can
         diverge. <b>Fix:</b> smaller steps, advantage normalization, gradient clipping, and GAE to tame
         the bias/variance tradeoff.</li>
         <li><b>Entropy collapse.</b> The actor can become near-deterministic too early and stop exploring,
         locking in a mediocre policy. <b>Fix:</b> add an <b>entropy bonus</b> $\\beta\\,H[\\pi_\\theta]$
         to the actor's objective so it is rewarded for keeping its action distribution spread out.</li>
       </ul>`,

    bigIdea:
      `<p>The existing <code>mod-actor-critic</code> lesson framed the advantage as $A = Q - V$. This
       lesson states the <b>full mechanism</b> the way the RL curriculum needs it &mdash; two learners
       that train together, and the one-step TD (Temporal Difference) error that links them.</p>
       <p>Two function approximators, usually neural nets:</p>
       <ul>
         <li>The <b>actor</b> $\\pi_\\theta(a\\mid s)$ &mdash; the policy, with parameters $\\theta$. It
         <i>acts</i>: it outputs a probability distribution over actions (or a continuous action's mean
         and spread).</li>
         <li>The <b>critic</b> $\\hat V_w(s)$ &mdash; a value estimate, with parameters $w$. It
         <i>judges</i>: it predicts the expected return from state $s$.</li>
       </ul>
       <p>The bridge is the <b>TD error</b>
       $\\delta_t = r_t + \\gamma\\,\\hat V_w(s_{t+1}) - \\hat V_w(s_t)$. It is two things at once: it is
       the critic's <i>prediction error</i> (so the critic learns by reducing it), and it is a low-variance,
       one-sample estimate of the action's <i>advantage</i> (so the actor uses it as the weight on its
       policy-gradient update). One number, two jobs &mdash; that is the whole idea.</p>`,

    buildup:
      `<p>Start from the policy-gradient theorem (the <code>mod-policy-gradient</code> lesson):
       $\\nabla_\\theta J = \\mathbb{E}\\big[\\nabla_\\theta\\log\\pi_\\theta(a\\mid s)\\,\\Psi_t\\big]$,
       where $\\Psi_t$ is "how good this action was". The whole family of methods differs only in what you
       plug in for $\\Psi_t$:</p>
       <ul>
         <li><b>REINFORCE</b> uses the full Monte-Carlo return $\\Psi_t = G_t$. Unbiased, but it sums the
         randomness of <i>every</i> future step &mdash; huge variance.</li>
         <li><b>REINFORCE with a baseline</b> uses $\\Psi_t = G_t - b(s_t)$. Subtracting a state-only
         baseline $b(s)$ leaves the gradient unbiased (proof in the derivation) but lowers variance. The
         best baseline is the state's value, $b(s) = \\hat V_w(s)$.</li>
         <li><b>Actor-critic</b> goes one step further: it also <i>bootstraps</i>. Instead of waiting for
         the whole return $G_t$, it estimates the action's value from a single step,
         $Q(s_t,a_t)\\approx r_t + \\gamma\\,\\hat V_w(s_{t+1})$. Then
         $\\Psi_t = \\big(r_t + \\gamma\\,\\hat V_w(s_{t+1})\\big) - \\hat V_w(s_t) = \\delta_t$, the TD
         error.</li>
       </ul>
       <p>Bootstrapping is the key move. It trades a little <b>bias</b> (the critic is imperfect) for a
       lot less <b>variance</b> (one step's noise instead of an entire episode's) &mdash; and it lets the
       agent learn <b>online</b>, updating after every single step rather than at episode end.</p>`,

    symbols: [
      { sym: "$s_t, s_{t+1}$", desc: "the state at step $t$ and the next state ($s_{t+1}$, read 's t plus one')." },
      { sym: "$a_t$", desc: "the action the actor took at step $t$." },
      { sym: "$r_t$", desc: "the reward received after taking $a_t$ in $s_t$." },
      { sym: "$\\gamma$", desc: "the discount factor (Greek 'gamma'), a number in $[0,1)$: future reward $k$ steps away counts for $\\gamma^k$ of its face value." },
      { sym: "$\\theta$", desc: "the actor's parameters (Greek 'theta') — the weights of the policy network." },
      { sym: "$w$", desc: "the critic's parameters — the weights of the value network." },
      { sym: "$\\pi_\\theta(a\\mid s)$", desc: "the actor's policy: the probability of choosing action $a$ in state $s$, given parameters $\\theta$. The bar '$\\mid$' reads 'given'." },
      { sym: "$\\hat V_w(s)$", desc: "the critic's value estimate ($V$-hat): a learned approximation of the expected return from state $s$. The hat '$\\hat{\\ }$' marks an estimate, not the true value." },
      { sym: "$\\hat Q_w(s,a)$", desc: "an action-value estimate; here approximated from one step as $r + \\gamma\\hat V_w(s')$." },
      { sym: "$\\delta_t$", desc: "the TD (Temporal Difference) error (Greek 'delta'): $\\delta_t = r_t + \\gamma\\hat V_w(s_{t+1}) - \\hat V_w(s_t)$. The critic's one-step prediction error, used as the actor's advantage." },
      { sym: "$A(s,a)$", desc: "the advantage: how much better action $a$ is than the state's average. $\\delta_t$ is a one-sample estimate of it." },
      { sym: "$\\nabla_\\theta$", desc: "the gradient with respect to $\\theta$ (the 'nabla' operator): the vector of partial derivatives that points in the direction of steepest increase." },
      { sym: "$\\log\\pi_\\theta(a\\mid s)$", desc: "the natural log of the action probability; its gradient $\\nabla_\\theta\\log\\pi_\\theta$ is the 'score' — the direction in $\\theta$ that makes action $a$ more likely." },
      { sym: "$J(\\theta)$", desc: "the actor's objective: the expected return under policy $\\pi_\\theta$, the quantity we push uphill." },
      { sym: "$\\mathbb{E}[\\cdot]$", desc: "expectation (average) over the randomness of the policy and the environment." },
      { sym: "$\\alpha_\\theta, \\alpha_w$", desc: "the learning rates (Greek 'alpha') for the actor and the critic — the step sizes of their gradient updates." },
      { sym: "$\\lambda$", desc: "the GAE (Generalized Advantage Estimation) parameter (Greek 'lambda') in $[0,1]$: the bias/variance knob blending short and long TD errors." },
      { sym: "$H[\\pi_\\theta]$", desc: "the entropy of the policy's action distribution: high when actions are spread out, low when near-deterministic. Added as a bonus to keep exploration alive." }
    ],

    formula:
      `$$ \\delta_t = r_t + \\gamma\\,\\hat V_w(s_{t+1}) - \\hat V_w(s_t) \\qquad\\text{(the TD error = a one-step advantage estimate)} $$
       $$ \\theta \\leftarrow \\theta + \\alpha_\\theta\\,\\nabla_\\theta\\log\\pi_\\theta(a_t\\mid s_t)\\,\\delta_t
          \\qquad\\text{(ACTOR: policy gradient weighted by }\\delta_t) $$
       $$ w \\leftarrow w + \\alpha_w\\,\\delta_t\\,\\nabla_w\\hat V_w(s_t)
          \\qquad\\text{(CRITIC: TD update, move }\\hat V_w(s_t)\\text{ toward }r_t+\\gamma\\hat V_w(s_{t+1})) $$`,

    whatItDoes:
      `<p>The <b>first line</b> computes the TD error $\\delta_t$: take the reward you just got, add the
       discounted critic value of where you landed, subtract the critic value of where you were. If
       $\\delta_t \\gt 0$ the action did <i>better</i> than the critic expected; if $\\delta_t \\lt 0$ it
       did <i>worse</i>.</p>
       <p>The <b>actor update</b> is the policy gradient with $\\delta_t$ as the weight. The score
       $\\nabla_\\theta\\log\\pi_\\theta(a_t\\mid s_t)$ is the direction in parameter space that makes
       $a_t$ more likely; multiplying by $\\delta_t$ means: <i>push the just-taken action up when it beat
       expectations, push it down when it disappointed</i>. Better-than-average actions get reinforced.</p>
       <p>The <b>critic update</b> is plain TD learning (the <code>aix-sarsa-td</code> lesson): nudge
       $\\hat V_w(s_t)$ toward its bootstrapped target $r_t + \\gamma\\hat V_w(s_{t+1})$, by the <i>same</i>
       $\\delta_t$. In tabular form $\\nabla_w\\hat V_w(s_t)$ is just an indicator, so the update is
       $\\hat V(s_t)\\leftarrow\\hat V(s_t)+\\alpha_w\\delta_t$. The one TD error drives both nets.</p>`,

    derivation:
      `<p><b>Step 1 — why a state-only baseline is free.</b> The policy gradient with any baseline $b(s)$
       that does not depend on the action is
       $\\nabla_\\theta J = \\mathbb{E}\\big[\\nabla_\\theta\\log\\pi_\\theta(a\\mid s)\\,(G_t - b(s))\\big]$.
       Split off the baseline term and show it vanishes:
       $\\mathbb{E}_a\\big[\\nabla_\\theta\\log\\pi_\\theta(a\\mid s)\\,b(s)\\big]
       = b(s)\\sum_a \\pi_\\theta(a\\mid s)\\,\\nabla_\\theta\\log\\pi_\\theta(a\\mid s)
       = b(s)\\sum_a \\nabla_\\theta\\pi_\\theta(a\\mid s)
       = b(s)\\,\\nabla_\\theta\\!\\sum_a \\pi_\\theta(a\\mid s) = b(s)\\,\\nabla_\\theta 1 = 0$,
       using $\\pi\\nabla\\log\\pi = \\nabla\\pi$ and that probabilities sum to $1$. So <b>any</b> baseline
       leaves the gradient <i>unbiased</i>; choosing $b(s) = \\hat V_w(s)$ minimizes variance and turns
       $G_t - b(s)$ into the advantage.</p>
       <p><b>Step 2 — bootstrap the advantage into the TD error.</b> The true advantage is
       $A(s_t,a_t) = Q(s_t,a_t) - V(s_t)$. We cannot see $Q$ directly, but one step of experience gives an
       estimate $Q(s_t,a_t) \\approx r_t + \\gamma\\,\\hat V_w(s_{t+1})$ (the immediate reward plus the
       discounted value of the next state). Substitute:
       $A(s_t,a_t) \\approx r_t + \\gamma\\,\\hat V_w(s_{t+1}) - \\hat V_w(s_t) = \\delta_t$.
       The advantage <i>is</i> the TD error. This is why $\\delta_t$ can play the weight role in the actor
       update.</p>
       <p><b>Step 3 — the critic is just TD(0).</b> We want $\\hat V_w(s_t)$ to match the same target
       $r_t + \\gamma\\hat V_w(s_{t+1})$. Minimizing the squared TD error
       $\\tfrac12\\delta_t^2$ (treating the target as fixed) gives the semi-gradient step
       $w \\leftarrow w + \\alpha_w\\,\\delta_t\\,\\nabla_w\\hat V_w(s_t)$. So both nets descend the
       <i>same</i> $\\delta_t$: the critic to predict it away, the actor to exploit its sign.</p>
       <p><b>Step 4 — the bias/variance knob (GAE).</b> The one-step $\\delta_t$ is low-variance but
       biased (it leans on the imperfect $\\hat V_w$). The full return is unbiased but high-variance. GAE
       interpolates with an exponentially weighted sum of future TD errors,
       $\\hat A_t^{\\text{GAE}(\\lambda)} = \\sum_{l\\ge 0}(\\gamma\\lambda)^l\\,\\delta_{t+l}$. At
       $\\lambda=0$ this is exactly $\\delta_t$ (low variance, more bias); at $\\lambda=1$ it telescopes
       to the Monte-Carlo advantage $G_t - \\hat V_w(s_t)$ (high variance, no bias). Tuning $\\lambda$
       (often $\\approx 0.95$) dials the tradeoff. ∎</p>`,

    example:
      `<p>One step, with a critic that has already learned a bit. The critic says the current state is
       worth $\\hat V_w(s_t) = 5.0$. The agent acts, gets reward $r_t = 1.0$, and lands in $s_{t+1}$ with
       $\\hat V_w(s_{t+1}) = 6.0$. Use $\\gamma = 0.9$, $\\alpha_\\theta = \\alpha_w = 0.1$.</p>
       <ul class="steps">
         <li><b>TD target:</b> $r_t + \\gamma\\hat V_w(s_{t+1}) = 1.0 + 0.9\\times 6.0 = 6.4$.</li>
         <li><b>TD error / advantage:</b> $\\delta_t = 6.4 - 5.0 = 1.4$. Positive &mdash; the action did
         better than the critic expected.</li>
         <li><b>Actor update:</b> $\\theta\\leftarrow\\theta + 0.1\\cdot\\nabla_\\theta\\log\\pi_\\theta(a_t\\mid s_t)\\cdot 1.4$.
         The probability of $a_t$ goes <i>up</i>, by an amount proportional to $\\delta_t = 1.4$.</li>
         <li><b>Critic update (tabular):</b>
         $\\hat V(s_t)\\leftarrow 5.0 + 0.1\\times 1.4 = 5.14$. The critic raises its estimate of $s_t$
         toward the target $6.4$ &mdash; it had under-valued the state.</li>
         <li><b>Contrast with REINFORCE:</b> REINFORCE would have waited for the whole episode and used
         the full return $G_t$ (which might be anything from this lucky $+1$ to a long string of penalties)
         as the weight &mdash; far noisier. Actor-critic used a single, low-variance $\\delta_t = 1.4$
         right now.</li>
       </ul>`,

    practice: [
      {
        q: `A critic estimates $\\hat V(s_t)=2.0$ and $\\hat V(s_{t+1})=2.0$. The agent gets reward $r_t=-0.5$. With $\\gamma=0.95$, compute the TD error $\\delta_t$ and say which way the actor pushes action $a_t$.`,
        steps: [
          { do: `Form the bootstrapped target.`, why: `The one-step action value estimate is $r_t+\\gamma\\hat V(s_{t+1}) = -0.5 + 0.95\\times 2.0 = -0.5 + 1.9 = 1.4$.` },
          { do: `Subtract the current value.`, why: `$\\delta_t = 1.4 - 2.0 = -0.6$.` },
          { do: `Read the sign.`, why: `$\\delta_t \\lt 0$: the action did worse than the critic expected, so the actor update $\\nabla_\\theta\\log\\pi\\cdot\\delta_t$ has a negative weight and pushes $a_t$'s probability down.` }
        ],
        answer: `<p>$\\delta_t = (-0.5 + 0.95\\cdot 2.0) - 2.0 = 1.4 - 2.0 = -0.6$. Negative, so the actor <b>decreases</b> the probability of $a_t$ — it underperformed the state's average. The critic also lowers $\\hat V(s_t)$ toward $1.4$.</p>`
      },
      {
        q: `Why does the critic's baseline leave the policy gradient unbiased, yet still reduce its variance?`,
        steps: [
          { do: `Write the baseline term.`, why: `The extra term is $\\mathbb{E}_a[\\nabla_\\theta\\log\\pi_\\theta(a\\mid s)\\,b(s)]$, with $b(s)$ independent of the action $a$.` },
          { do: `Pull $b(s)$ out and simplify.`, why: `It becomes $b(s)\\sum_a\\nabla_\\theta\\pi_\\theta(a\\mid s) = b(s)\\,\\nabla_\\theta\\sum_a\\pi_\\theta(a\\mid s) = b(s)\\,\\nabla_\\theta 1 = 0$ because probabilities sum to one.` },
          { do: `Interpret variance.`, why: `The mean is unchanged (the term is zero), but subtracting $\\hat V(s)$ recenters the weight from the raw return $G_t$ to the advantage $\\delta_t$, whose magnitude — and thus the gradient's variance — is much smaller.` }
        ],
        answer: `<p>Because the baseline term has expectation exactly $0$ (probabilities sum to one, so $\\nabla_\\theta 1 = 0$), the <i>mean</i> gradient is untouched — unbiased. But replacing $G_t$ with the smaller-magnitude advantage $\\delta_t$ shrinks the spread of the weight, so the <i>variance</i> drops. Same direction, less noise.</p>`
      },
      {
        q: `In Generalized Advantage Estimation, what do the extremes $\\lambda=0$ and $\\lambda=1$ correspond to, and which has more variance?`,
        steps: [
          { do: `Plug in $\\lambda=0$.`, why: `$\\hat A_t^{\\text{GAE}(0)} = \\sum_l (\\gamma\\cdot 0)^l\\delta_{t+l} = \\delta_t$ — just the one-step TD error.` },
          { do: `Plug in $\\lambda=1$.`, why: `$\\hat A_t^{\\text{GAE}(1)} = \\sum_l \\gamma^l\\delta_{t+l}$, which telescopes to $G_t - \\hat V(s_t)$ — the full Monte-Carlo advantage.` },
          { do: `Compare.`, why: `$\\lambda=1$ sums every future step's noise (high variance, but no bootstrap bias); $\\lambda=0$ uses one step (low variance, but leans on the biased critic).` }
        ],
        answer: `<p>$\\lambda=0$ gives the one-step TD error $\\delta_t$ (low variance, more bias from the critic); $\\lambda=1$ gives the Monte-Carlo advantage $G_t-\\hat V(s_t)$ (no bootstrap bias, but the highest variance). $\\lambda=1$ has more variance. Intermediate $\\lambda$ (e.g. $0.95$) blends the two.</p>`
      }
    ]
  });

  window.CODE["rl-actor-critic"] = {
    lib: "gymnasium + PyTorch",
    runnable: false,
    explain:
      `<p>A compact <b>A2C (Advantage Actor-Critic)</b> on <code>CartPole-v1</code>: balance a pole by
       pushing the cart left or right. One shared trunk feeds two heads &mdash; an <b>actor</b> head
       (a softmax over the 2 actions, $\\pi_\\theta$) and a <b>critic</b> head (a scalar value,
       $\\hat V_w$). We collect a short rollout, compute the <b>TD/bootstrapped advantage</b>, and take
       one optimizer step combining three losses: the actor loss
       $-\\log\\pi_\\theta(a\\mid s)\\cdot A$ (push up good actions), the critic loss (MSE of $\\hat V$ to
       the bootstrapped return), and an <b>entropy bonus</b> to keep exploring. In Colab run
       <code>!pip install gymnasium torch</code> first. <code>runnable</code> is off only because the
       in-browser engine has no Gymnasium / PyTorch &mdash; this is real, runnable Colab code.</p>`,
    code: `# !pip install gymnasium torch
import gymnasium as gym
import torch, torch.nn as nn, torch.nn.functional as F
import numpy as np

torch.manual_seed(0); np.random.seed(0)
env = gym.make("CartPole-v1")
nS = env.observation_space.shape[0]   # 4 state features
nA = env.action_space.n               # 2 actions: push left / right
gamma = 0.99

# ---- Shared-trunk actor-critic network ----
class ActorCritic(nn.Module):
    def __init__(self):
        super().__init__()
        self.trunk = nn.Sequential(nn.Linear(nS, 128), nn.Tanh())
        self.actor = nn.Linear(128, nA)   # logits -> softmax policy  pi_theta(a|s)
        self.critic = nn.Linear(128, 1)   # scalar value estimate     V_w(s)
    def forward(self, s):
        h = self.trunk(s)
        return self.actor(h), self.critic(h).squeeze(-1)

net = ActorCritic()
opt = torch.optim.Adam(net.parameters(), lr=3e-3)   # ONE optimizer, both heads
ENT_COEF, VAL_COEF, ROLLOUT = 0.01, 0.5, 32         # entropy bonus, critic weight, steps/update

def select(s):
    logits, value = net(torch.as_tensor(s, dtype=torch.float32))
    dist = torch.distributions.Categorical(logits=logits)
    a = dist.sample()
    return a.item(), dist.log_prob(a), dist.entropy(), value

returns_hist = []
for ep in range(400):
    s, _ = env.reset(seed=ep)
    done = False; ep_ret = 0.0
    logps, vals, rews, ents, masks = [], [], [], [], []
    while not done:
        a, logp, ent, v = select(s)
        s2, r, term, trunc, _ = env.step(a)
        done = term or trunc
        logps.append(logp); vals.append(v); rews.append(r)
        ents.append(ent); masks.append(0.0 if done else 1.0)
        s = s2; ep_ret += r
        # update every ROLLOUT steps (or at episode end) -> "one step per few steps"
        if len(rews) == ROLLOUT or done:
            with torch.no_grad():
                # bootstrap the tail value: 0 if terminal, else V_w(s')
                _, boot = net(torch.as_tensor(s, dtype=torch.float32))
                boot = boot * (0.0 if done else 1.0)
            # discounted bootstrapped returns -> TD targets for the critic
            R, targets = boot, []
            for r_t, m in zip(reversed(rews), reversed(masks)):
                R = r_t + gamma * R * m
                targets.append(R)
            targets = torch.tensor(list(reversed(targets)), dtype=torch.float32)
            values  = torch.stack(vals)
            logp_t  = torch.stack(logps)
            ent_t   = torch.stack(ents)
            adv = (targets - values).detach()           # TD advantage A = target - V_w(s)
            adv = (adv - adv.mean()) / (adv.std() + 1e-8)  # normalize -> stability
            actor_loss  = -(logp_t * adv).mean()        # -log pi * A
            critic_loss = F.mse_loss(values, targets)   # MSE on the TD target
            entropy     = ent_t.mean()
            loss = actor_loss + VAL_COEF * critic_loss - ENT_COEF * entropy
            opt.zero_grad(); loss.backward()
            nn.utils.clip_grad_norm_(net.parameters(), 0.5)
            opt.step()
            logps, vals, rews, ents, masks = [], [], [], [], []
    returns_hist.append(ep_ret)
    if (ep + 1) % 50 == 0:
        print(f"ep {ep+1:4d}  avg return (last 50) = {np.mean(returns_hist[-50:]):6.1f}")

# CartPole is "solved" at ~475 average return; A2C climbs there in a few hundred eps.
print("final 50-ep average:", round(float(np.mean(returns_hist[-50:])), 1))`
  };

  window.CODEVIZ["rl-actor-critic"] = {
    question: "Does the critic actually help? We pit two tabular policy-gradient agents on the SAME tiny slippery-corridor MDP — REINFORCE (Monte-Carlo full return, no critic) vs Actor-Critic (one-step TD-error advantage) — and plot return per episode. Actor-Critic should climb faster and sit higher with less wobble, because the critic's bootstrap cuts variance.",
    charts: [
      {
        type: "line",
        title: "Return per episode: REINFORCE vs Actor-Critic on a 10-state slippery corridor (12-seed mean, smoothed)",
        xlabel: "episode",
        ylabel: "smoothed episode return",
        series: [
          {
            name: "Actor-Critic (TD advantage)",
            color: "#7ee787",
            points: [
              [0, -0.283], [22, 0.557], [45, 0.683], [67, 0.719], [90, 0.734], [113, 0.742],
              [135, 0.754], [158, 0.756], [181, 0.759], [203, 0.761], [226, 0.77], [249, 0.765],
              [271, 0.77], [294, 0.769], [317, 0.777], [339, 0.775], [362, 0.78], [385, 0.777]
            ]
          },
          {
            name: "REINFORCE (full return)",
            color: "#4ea1ff",
            points: [
              [0, -0.264], [22, 0.42], [45, 0.588], [67, 0.621], [90, 0.685], [113, 0.69],
              [135, 0.724], [158, 0.724], [181, 0.719], [203, 0.727], [226, 0.737], [249, 0.741],
              [271, 0.735], [294, 0.747], [317, 0.756], [339, 0.755], [362, 0.768], [385, 0.766]
            ]
          }
        ]
      }
    ],
    caption: "Real numbers, averaged over 12 seeds, from the numpy code below. Both agents share the exact same softmax policy and corridor; the ONLY difference is the weight on the policy-gradient update — REINFORCE uses the full Monte-Carlo return $G_t$, Actor-Critic uses the one-step TD error $\\delta_t = r + \\gamma\\hat V(s') - \\hat V(s)$ from a tabular critic. The Actor-Critic curve (green) pulls ahead early (0.56 vs 0.42 by episode 22) and stays consistently above. Across the last 150 episodes the raw per-episode return has std 0.014 for Actor-Critic vs 0.020 for REINFORCE — the critic's bootstrap visibly lowers variance, exactly the bias/variance win the math predicts.",
    code: `import numpy as np

# A tiny SLIPPERY CORRIDOR MDP, built inline in numpy (no gym).
#   10 states in a line; state 9 = goal (+1, terminal). Start = state 0.
#   2 actions: 0=LEFT, 1=RIGHT. Intended move happens w.p. 0.85, else SLIP (stay).
#   Step cost -0.02 to reward speed.  gamma = 0.97.
nS, nA, GOAL = 10, 2, 9
gamma, STEP_COST, SLIP = 0.97, -0.02, 0.15

def step(s, a, rng):
    s2 = s if rng.random() < SLIP else (max(s-1,0) if a==0 else min(s+1,nS-1))
    if s2 == GOAL:  return s2, 1.0, True
    return s2, STEP_COST, False

def softmax(z):
    z = z - z.max(); e = np.exp(z); return e / e.sum()

def rollout(theta, rng, max_t=80):
    s, traj = 0, []
    for _ in range(max_t):
        a = rng.choice(nA, p=softmax(theta[s]))
        s2, r, done = step(s, a, rng); traj.append((s, a, r, s2, done)); s = s2
        if done: break
    return traj

# ---- REINFORCE: weight each step by the FULL Monte-Carlo return G_t (minus a mean baseline) ----
def train_reinforce(seed, episodes):
    rng = np.random.default_rng(seed); theta = np.zeros((nS, nA)); lr = 0.15; curve = []
    for _ in range(episodes):
        traj = rollout(theta, rng)
        G, Gs = 0.0, []
        for (s, a, r, s2, d) in reversed(traj):
            G = r + gamma * G; Gs.append(G)
        Gs = list(reversed(Gs)); b = np.mean(Gs)           # baseline
        for (s, a, r, s2, d), Gt in zip(traj, Gs):
            p = softmax(theta[s]); grad = -p; grad[a] += 1.0
            theta[s] += lr * (Gt - b) * grad               # weight = full return
        curve.append(sum(r for (_, _, r, _, _) in traj))
    return np.array(curve)

# ---- ACTOR-CRITIC: weight each step by the one-step TD error delta = r + gamma*V(s') - V(s) ----
def train_actor_critic(seed, episodes):
    rng = np.random.default_rng(seed)
    theta = np.zeros((nS, nA)); V = np.zeros(nS)           # actor + tabular critic
    lrA, lrC = 0.15, 0.2; curve = []
    for _ in range(episodes):
        s, total = 0, 0.0
        for _ in range(80):
            p = softmax(theta[s]); a = rng.choice(nA, p=p)
            s2, r, done = step(s, a, rng); total += r
            target = r + (0.0 if done else gamma * V[s2])
            delta = target - V[s]                          # TD error = advantage
            V[s] += lrC * delta                            # critic update
            grad = -p; grad[a] += 1.0
            theta[s] += lrA * delta * grad                 # actor update, weighted by delta
            s = s2
            if done: break
        curve.append(total)
    return np.array(curve)

EP, SEEDS = 400, range(12)
rc = np.mean([train_reinforce(s, EP)     for s in SEEDS], axis=0)
ac = np.mean([train_actor_critic(s, EP)  for s in SEEDS], axis=0)
smooth = lambda x, w=15: np.convolve(x, np.ones(w)/w, mode="valid")
rcs, acs = smooth(rc), smooth(ac)
idx = np.linspace(0, len(rcs)-1, 18).astype(int)
print("Actor-Critic:", [[int(i), round(float(acs[i]), 3)] for i in idx])
print("REINFORCE:   ", [[int(i), round(float(rcs[i]), 3)] for i in idx])
print("raw std last 150 -> AC:", round(float(np.std(ac[-150:])), 3),
      " REINFORCE:", round(float(np.std(rc[-150:])), 3))`
  };
})();
