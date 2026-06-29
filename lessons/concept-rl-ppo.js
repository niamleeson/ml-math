/* Reinforcement Learning — "Proximal Policy Optimization (PPO): the modern default policy-gradient algorithm".
   Self-contained: lesson + CODE + CODEVIZ merged by id "rl-ppo".
   Builds on mod-policy-gradient / mod-actor-critic (REINFORCE, advantage, the actor-critic split)
   and is the algorithm behind RLHF for large language models. */
(function () {
  window.LESSONS.push({
    id: "rl-ppo",
    title: "Proximal Policy Optimization (PPO): the clipped-objective workhorse of deep RL",
    tagline: "Take the biggest policy-gradient step you safely can — a single clipped objective stops the update from moving the policy too far from the old one.",
    module: "Reinforcement Learning",
    prereqs: ["mod-policy-gradient", "mod-actor-critic", "rl-mdp", "prob-expectation"],

    whenToUse:
      `<p><b>Reach for Proximal Policy Optimization (PPO) as your default deep reinforcement-learning
       (RL) algorithm whenever you have a policy gradient method and want it to <i>just work</i>
       without heroic tuning.</b> It is the safe, robust, widely-used choice for control (CartPole,
       LunarLander, MuJoCo locomotion), for game agents, and &mdash; famously &mdash; for RLHF
       (Reinforcement Learning from Human Feedback), the alignment step that fine-tunes large language
       models.</p>
       <ul>
         <li><b>Use PPO when:</b> you are doing on-policy policy-gradient learning and plain REINFORCE
         or vanilla actor-critic (see <code>mod-policy-gradient</code>, <code>mod-actor-critic</code>)
         is too unstable; you want one algorithm that transfers across tasks with little per-task
         tuning; you can afford to collect a fresh batch of experience each update (it is on-policy).</li>
         <li><b>Prefer something else when:</b> you need maximum <i>sample efficiency</i> from a replay
         buffer of old data &mdash; then an off-policy method like SAC (Soft Actor-Critic) or DQN
         (Deep Q-Network, see <code>mod-dqn</code>) reuses data far better; or your action space is
         discrete and small and a value-based method already solves it cheaply.</li>
       </ul>
       <p>PPO is the natural next step after this curriculum's policy-gradient lessons. REINFORCE gives
       you the gradient; actor-critic gives you a low-variance advantage; PPO adds the one missing
       ingredient &mdash; a <b>safe step size</b> &mdash; that makes the whole thing stable enough to
       run everywhere.</p>`,

    application:
      `<p>PPO is the most-deployed deep-RL algorithm in practice, precisely because it is hard to break.</p>
       <ul>
         <li><b>RLHF for large language models.</b> The reward model scores completions; PPO updates the
         language-model policy to produce higher-scoring text while the clip keeps it from drifting too
         far from the pretrained model in one step. This is the canonical alignment recipe.</li>
         <li><b>Continuous control / robotics.</b> Locomotion and manipulation benchmarks (MuJoCo,
         Isaac Gym) &mdash; PPO is a standard baseline because it tolerates messy reward scales.</li>
         <li><b>Games.</b> OpenAI's Dota 2 agent (OpenAI Five) and many Atari / procedural-game agents
         are trained with PPO at massive scale.</li>
         <li><b>Simulation and operations.</b> Traffic control, resource scheduling, and any
         simulator-backed control problem where you can generate fresh on-policy rollouts cheaply.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Mis-tuned clip $\\epsilon$ (Greek "epsilon").</b> Too small ($\\epsilon \\approx 0.05$)
         and learning crawls; too large ($\\epsilon \\approx 0.5$) and the trust region is so loose that
         PPO loses its stabilizing effect. <b>Fix:</b> start at the standard $\\epsilon = 0.2$ and adjust
         only if needed.</li>
         <li><b>Too many epochs over one batch.</b> PPO reuses each batch of data for several gradient
         epochs &mdash; but each epoch pushes the policy further from $\\pi_{\\theta_{old}}$, and the clip
         only <i>bounds</i> per-sample, it does not forbid total drift. Too many epochs and the KL
         (Kullback&ndash;Leibler divergence) between new and old policy blows up. <b>Fix:</b> 3&ndash;10
         epochs, and early-stop the update if measured KL exceeds a target.</li>
         <li><b>Batch / minibatch size mismatch.</b> Tiny batches give noisy advantages and unstable
         ratios; huge batches waste compute. <b>Fix:</b> a few thousand transitions per update, split
         into reasonable minibatches.</li>
         <li><b>Unnormalized advantages.</b> Raw advantages with a drifting scale make the ratio term
         dominate or vanish. <b>Fix:</b> normalize the advantage batch to zero mean and unit variance
         before the loss.</li>
         <li><b>Wrong GAE $\\lambda$ (Greek "lambda").</b> Generalized Advantage Estimation trades bias
         against variance; $\\lambda$ near $1$ is low-bias / high-variance, near $0$ is the opposite.
         <b>Fix:</b> $\\lambda \\approx 0.95$ is the usual sweet spot.</li>
         <li><b>Reward scaling.</b> Very large or tiny rewards distort the value loss and the advantages.
         <b>Fix:</b> scale / clip rewards or normalize returns.</li>
         <li><b>Still on-policy.</b> Every batch must come from the <i>current</i> policy, so PPO is less
         sample-efficient than off-policy methods. <b>Fix:</b> accept it (PPO trades sample-efficiency
         for stability), or switch to SAC if data is expensive.</li>
       </ul>`,

    bigIdea:
      `<p>Plain policy gradient (REINFORCE, <code>mod-policy-gradient</code>) has one dangerous flaw:
       <b>it does not control how big a step it takes</b>. A single update with a large learning rate or
       a large advantage can push the policy so far that it collapses &mdash; it forgets what it learned
       and may never recover, because the next batch of data is collected by the now-broken policy.</p>
       <p><b>TRPO (Trust Region Policy Optimization)</b> fixed this by adding a hard constraint: keep the
       new policy within a <i>trust region</i> of the old one, measured by KL divergence. It works but is
       complicated &mdash; it needs a constrained second-order optimization.</p>
       <p><b>PPO achieves the same effect far more simply.</b> Instead of a constraint, it bakes the
       "don't move too far" idea directly into the objective with a <b>clip</b>. The key quantity is the
       <b>probability ratio</b> $r_t(\\theta) = \\dfrac{\\pi_\\theta(a_t\\mid s_t)}{\\pi_{\\theta_{old}}(a_t\\mid s_t)}$
       &mdash; how much more (or less) likely the new policy makes the action the old policy actually
       took. PPO clips this ratio to $[1-\\epsilon,\\,1+\\epsilon]$ inside the objective, removing any
       incentive to push it past those bounds. That clip is a <b>soft trust region</b> with none of
       TRPO's machinery, which is why PPO is the workhorse.</p>`,

    buildup:
      `<p>Start from the policy-gradient objective. We want to increase the probability of actions that
       had a positive <b>advantage</b> $A_t$ (better than the critic expected) and decrease it for
       negative ones. The vanilla surrogate, in importance-sampling form, is
       $L^{PG} = \\mathbb{E}_t[\\, r_t(\\theta)\\, A_t \\,]$, where the ratio $r_t(\\theta)$ lets us
       evaluate data collected by the <i>old</i> policy under the <i>new</i> one.</p>
       <p>The danger: maximizing $r_t A_t$ alone rewards making $r_t$ enormous whenever $A_t \\gt 0$.
       Nothing stops the policy from lurching to make a single good-looking action near-certain &mdash;
       overfitting one batch and collapsing.</p>
       <p>PPO's fix is to <b>clip the ratio</b> and take the pessimistic (minimum) of the clipped and
       unclipped terms:
       $L^{CLIP} = \\mathbb{E}_t\\big[\\min\\!\\big(r_t A_t,\\ \\text{clip}(r_t, 1-\\epsilon, 1+\\epsilon)\\, A_t\\big)\\big]$.
       Read it as: "improve as long as the ratio stays inside $1\\pm\\epsilon$; past that, stop crediting
       further movement." The $\\min$ makes it a lower bound (a pessimistic estimate) on the true
       improvement, so the optimizer is never tempted to exploit the clip in the wrong direction.</p>
       <p>Two more pieces complete the practical objective: a <b>value-function loss</b> so the critic
       that produces $A_t$ stays accurate, and an <b>entropy bonus</b> that keeps the policy from
       becoming over-confident too early (it preserves exploration). And because each batch is precious
       (it is on-policy data), PPO runs <b>several epochs</b> of minibatch updates over the <i>same</i>
       batch before throwing it away &mdash; the clip is exactly what makes that safe.</p>`,

    symbols: [
      { sym: "$\\theta$", desc: "the parameters (weights) of the current policy network being optimized (Greek 'theta')." },
      { sym: "$\\theta_{old}$", desc: "the parameters of the policy that COLLECTED the current batch of data. Frozen during the update; $\\theta$ moves away from it." },
      { sym: "$\\pi_\\theta(a_t\\mid s_t)$", desc: "the new policy's probability of taking action $a_t$ in state $s_t$ (Greek 'pi'). For continuous actions, a probability density." },
      { sym: "$\\pi_{\\theta_{old}}(a_t\\mid s_t)$", desc: "the OLD policy's probability of that same action — the denominator that makes off-batch reuse valid." },
      { sym: "$r_t(\\theta)$", desc: "the probability ratio $\\dfrac{\\pi_\\theta(a_t\\mid s_t)}{\\pi_{\\theta_{old}}(a_t\\mid s_t)}$. Equals $1$ when the new policy matches the old; $\\gt 1$ means the new policy favors $a_t$ more." },
      { sym: "$A_t$", desc: "the advantage at step $t$: how much better action $a_t$ turned out than the critic's baseline value of $s_t$. Positive = better than expected." },
      { sym: "$\\epsilon$", desc: "the clip range (Greek 'epsilon'), a small constant like $0.2$. The ratio is clipped to $[1-\\epsilon, 1+\\epsilon]$." },
      { sym: "$\\text{clip}(x, lo, hi)$", desc: "clamps $x$ into the interval $[lo, hi]$: returns $lo$ if $x\\lt lo$, $hi$ if $x\\gt hi$, else $x$ unchanged." },
      { sym: "$\\min(\\cdot,\\cdot)$", desc: "the smaller of the two arguments — here it picks the PESSIMISTIC (lower) of the clipped and unclipped surrogate terms." },
      { sym: "$\\mathbb{E}_t[\\cdot]$", desc: "the average over the time steps $t$ in the collected batch (an empirical mean over sampled transitions)." },
      { sym: "$L^{CLIP}$", desc: "PPO's clipped surrogate objective — the quantity we MAXIMIZE with gradient ascent (equivalently, minimize its negative)." },
      { sym: "$\\gamma$", desc: "the discount factor (Greek 'gamma') in $[0,1)$, used inside the advantage / return computation." },
      { sym: "$\\lambda$", desc: "the GAE (Generalized Advantage Estimation) parameter (Greek 'lambda') in $[0,1]$, trading bias against variance in the advantage estimate." },
      { sym: "$\\delta_t$", desc: "the one-step TD (Temporal Difference) error $\\delta_t = R_t + \\gamma V(s_{t+1}) - V(s_t)$ — the building block GAE sums up." },
      { sym: "$V(s)$", desc: "the critic's estimated value of state $s$: the expected discounted return from $s$. Trained by the value loss." }
    ],

    formula:
      `$$ r_t(\\theta) = \\frac{\\pi_\\theta(a_t\\mid s_t)}{\\pi_{\\theta_{old}}(a_t\\mid s_t)}
         \\qquad
         L^{CLIP}(\\theta) = \\mathbb{E}_t\\!\\Big[\\, \\min\\!\\big(\\, r_t(\\theta)\\,A_t,\\;
            \\text{clip}\\big(r_t(\\theta),\\, 1-\\epsilon,\\, 1+\\epsilon\\big)\\,A_t \\,\\big) \\,\\Big] $$
       $$ \\hat{A}_t = \\sum_{l=0}^{\\infty}(\\gamma\\lambda)^{l}\\,\\delta_{t+l},
         \\qquad \\delta_t = R_t + \\gamma V(s_{t+1}) - V(s_t) $$
       $$ L^{total} = \\underbrace{L^{CLIP}}_{\\text{policy}}
         \\;-\\; c_1\\,\\underbrace{\\mathbb{E}_t\\big[(V_\\theta(s_t)-\\hat{V}_t)^2\\big]}_{\\text{value loss}}
         \\;+\\; c_2\\,\\underbrace{\\mathbb{E}_t\\big[\\,\\mathcal{H}[\\pi_\\theta(\\cdot\\mid s_t)]\\,\\big]}_{\\text{entropy bonus}} $$`,

    whatItDoes:
      `<p>The <b>first line</b> is the heart of PPO. The ratio $r_t(\\theta)$ measures how far the new
       policy has moved on the action $a_t$ that was actually sampled. The clipped objective then takes
       the $\\min$ of two things: the raw surrogate $r_t A_t$, and the same surrogate with $r_t$ clamped
       into $[1-\\epsilon, 1+\\epsilon]$. The effect depends on the sign of the advantage:</p>
       <ul>
         <li><b>If $A_t \\gt 0$ (good action):</b> we want to <i>raise</i> $r_t$. The objective grows
         with $r_t$ up to $1+\\epsilon$, then the clip flattens it &mdash; past $1+\\epsilon$ there is
         <b>no further gradient</b>, so the optimizer has zero incentive to push the action's probability
         higher in one step.</li>
         <li><b>If $A_t \\lt 0$ (bad action):</b> we want to <i>lower</i> $r_t$. The clip flattens the
         objective once $r_t$ drops below $1-\\epsilon$, again killing the incentive to over-correct.</li>
       </ul>
       <p>The $\\min$ is the subtle part: it makes $L^{CLIP}$ a <b>pessimistic lower bound</b> on the
       unclipped surrogate, so even when the unclipped term would let the policy benefit from a wild
       ratio, the $\\min$ refuses to credit it. That is the soft trust region.</p>
       <p>The <b>second line</b> is GAE (Generalized Advantage Estimation): a discounted, $\\lambda$-weighted
       sum of one-step TD errors $\\delta_t$ that produces a low-variance advantage $\\hat{A}_t$.
       The <b>third line</b> is the full loss actually optimized: the clipped policy objective, MINUS a
       value-function loss (so the critic $V_\\theta$ that feeds the advantage stays accurate), PLUS an
       entropy bonus $\\mathcal{H}$ (which rewards a less-certain policy, preserving exploration). The
       coefficients $c_1, c_2$ balance the three. PPO maximizes this over <b>several epochs</b> of
       minibatches drawn from one collected batch &mdash; safe reuse, thanks to the clip.</p>`,

    derivation:
      `<p><b>Where the ratio comes from (importance sampling).</b> We have data sampled from
       $\\pi_{\\theta_{old}}$ but want the expected advantage under the new policy $\\pi_\\theta$.
       Importance sampling rewrites that expectation:
       $\\mathbb{E}_{a\\sim\\pi_\\theta}[A] = \\mathbb{E}_{a\\sim\\pi_{\\theta_{old}}}
       \\big[\\frac{\\pi_\\theta(a\\mid s)}{\\pi_{\\theta_{old}}(a\\mid s)}A\\big]
       = \\mathbb{E}_{old}[\\,r_t(\\theta)\\,A_t\\,]$. So the ratio is exactly the correction factor that
       lets us optimize $\\theta$ on data the old policy gathered. At the start of an update
       $\\theta = \\theta_{old}$, so every $r_t = 1$ and the gradient of $r_t A_t$ equals the ordinary
       policy gradient &mdash; PPO starts as plain policy gradient and only the clip changes behavior as
       $\\theta$ moves.</p>
       <p><b>Why clipping is a soft trust region.</b> Consider one sample with $A_t \\gt 0$. The unclipped
       term $r_t A_t$ is a straight line through the origin with positive slope $A_t$: increasing $r_t$
       always helps, with no limit. Now form $\\min\\big(r_t A_t,\\ \\text{clip}(r_t,1-\\epsilon,1+\\epsilon)A_t\\big)$.
       For $r_t \\le 1+\\epsilon$ both terms agree and the objective rises normally. For $r_t \\gt 1+\\epsilon$
       the clipped term freezes at $(1+\\epsilon)A_t$ (a flat line), and since that flat value is the
       smaller one, the $\\min$ selects it: the objective is <b>flat</b>, its gradient is <b>zero</b>, and
       the optimizer gains nothing by pushing $r_t$ further. Symmetrically for $A_t \\lt 0$: the objective
       flattens once $r_t \\lt 1-\\epsilon$. Either way, movement beyond $1\\pm\\epsilon$ earns no reward,
       which softly confines the policy to a region around the old one &mdash; the same goal as TRPO's KL
       constraint, achieved with a $\\min$ and a $\\text{clip}$ instead of constrained optimization.</p>
       <p><b>Why the $\\min$ (not just the clip) is needed.</b> If we used only the clipped term
       $\\text{clip}(r_t,1-\\epsilon,1+\\epsilon)A_t$, then for a <i>bad</i> action ($A_t\\lt 0$) whose
       probability had already grown to $r_t \\gt 1+\\epsilon$, the clipped term would be flat and give no
       gradient to fix it &mdash; the policy could not undo a harmful jump. The $\\min$ restores the
       unclipped term in exactly those cases (where it is the smaller, more pessimistic value), so PPO can
       always pull a bad over-shooting action back. The clip removes the incentive to overshoot; the $\\min$
       guarantees you can still correct an overshoot that already happened.</p>
       <p><b>Why GAE.</b> A pure Monte-Carlo advantage (full return minus baseline) is unbiased but
       high-variance; a one-step TD advantage $\\delta_t$ is low-variance but biased by the critic's error.
       GAE interpolates: $\\hat{A}_t = \\sum_l (\\gamma\\lambda)^l \\delta_{t+l}$ is an exponentially-weighted
       average over all horizons. $\\lambda = 0$ recovers the one-step TD advantage; $\\lambda = 1$ recovers
       the Monte-Carlo advantage; $\\lambda \\approx 0.95$ blends them for a good bias&ndash;variance trade.</p>`,

    example:
      `<p>Three clips, by hand. Take $\\epsilon = 0.2$, so the clip range is $[0.8,\\,1.2]$. For each
       sample we compute the unclipped term $r_t A_t$, the clipped term
       $\\text{clip}(r_t,0.8,1.2)\\,A_t$, and then $L=\\min$ of the two.</p>
       <table class="extable">
         <caption>PPO clipped surrogate per sample ($\\epsilon=0.2$)</caption>
         <thead><tr><th>case</th><th class="num">$A_t$</th><th class="num">$r_t$</th><th class="num">$\\text{clip}(r_t)$</th><th class="num">unclipped $r_tA_t$</th><th class="num">clipped</th><th class="num">$L=\\min$</th></tr></thead>
         <tbody>
           <tr><td class="row-h">good, modest move</td><td class="num">$+2$</td><td class="num">$1.1$</td><td class="num">$1.1$</td><td class="num">$2.2$</td><td class="num">$2.2$</td><td class="num">$2.2$</td></tr>
           <tr><td class="row-h">good, reckless move</td><td class="num">$+2$</td><td class="num">$1.5$</td><td class="num">$1.2$</td><td class="num">$3.0$</td><td class="num">$2.4$</td><td class="num">$2.4$</td></tr>
           <tr><td class="row-h">bad, over-shot</td><td class="num">$-2$</td><td class="num">$1.5$</td><td class="num">$1.2$</td><td class="num">$-3.0$</td><td class="num">$-2.4$</td><td class="num">$-3.0$</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Good action, modest move ($r_t=1.1$).</b> The ratio is inside $[0.8,1.2]$, so both terms
         equal $1.1\\times2=2.2$ and $L=2.2$ &mdash; full credit, full gradient. Keep nudging it up.</li>
         <li><b>Good action, reckless move ($r_t=1.5$).</b> Unclipped $1.5\\times2=3.0$; clipped
         $1.2\\times2=2.4$. $\\min(3.0,2.4)=2.4$ &mdash; the flat clipped value. Beyond $r_t=1.2$ the
         objective stops growing, so the <b>gradient is zero</b>: no reward for pushing harder. The
         trust region biting.</li>
         <li><b>Bad action that already over-shot ($A_t=-2$, $r_t=1.5$).</b> Unclipped $1.5\\times(-2)=-3.0$;
         clipped $1.2\\times(-2)=-2.4$. $\\min(-3.0,-2.4)=-3.0$ &mdash; the <i>unclipped</i> term wins,
         keeping a live gradient that pulls this bad action back down. The clip alone would have given
         $-2.4$ (flat, no gradient) and stranded the mistake; the $\\min$ is what rescues it.</li>
       </ul>
       <p>The CODEVIZ below plots exactly this surrogate &mdash; clipped versus unclipped &mdash; across a
       range of $r_t$, computed in numpy, so you can see the flattening past $1\\pm\\epsilon$.</p>`,

    practice: [
      {
        q: `With $\\epsilon = 0.2$, an advantage $A_t = +3$, and a ratio $r_t = 1.4$, what value does the PPO clipped objective take for this sample, and what is its gradient with respect to $r_t$ there?`,
        steps: [
          { do: `Compute the unclipped term.`, why: `$r_t A_t = 1.4 \\times 3 = 4.2$.` },
          { do: `Compute the clipped term.`, why: `$\\text{clip}(1.4, 0.8, 1.2) = 1.2$, so $1.2 \\times 3 = 3.6$.` },
          { do: `Take the min.`, why: `$\\min(4.2, 3.6) = 3.6$ — the clipped value, because $A_t \\gt 0$ and $r_t$ exceeded $1+\\epsilon$.` }
        ],
        answer: `<p>The objective is $3.6$, and because the clipped term (flat in $r_t$) is selected, the gradient with respect to $r_t$ is $0$. PPO gives no incentive to push this already-favored good action any higher in this update.</p>`
      },
      {
        q: `Why does PPO use $\\min(r_t A_t,\\ \\text{clip}(r_t,1-\\epsilon,1+\\epsilon)A_t)$ instead of just the clipped term $\\text{clip}(r_t,1-\\epsilon,1+\\epsilon)A_t$?`,
        steps: [
          { do: `Consider a bad action whose ratio already grew past $1+\\epsilon$.`, why: `Say $A_t \\lt 0$ and $r_t = 1.5$ — we accidentally made a harmful action more likely.` },
          { do: `Check the clipped-only objective there.`, why: `$\\text{clip}(1.5,\\dots)$ freezes at $1+\\epsilon$, so the term is flat in $r_t$ — zero gradient, no way to correct.` },
          { do: `Check the min.`, why: `The unclipped $r_t A_t$ is more negative, so the $\\min$ selects it, restoring a gradient that lowers the bad action's probability.` }
        ],
        answer: `<p>The $\\min$ keeps the objective pessimistic: when an action has already over-shot in a harmful direction, it reactivates the unclipped term so the policy can pull back. The clip removes the incentive to overshoot; the $\\min$ guarantees a past overshoot is still correctable.</p>`
      },
      {
        q: `PPO runs several gradient epochs over the SAME batch of data. Why is that safe here when it would be dangerous for plain REINFORCE, and what failure can still occur if you use too many epochs?`,
        steps: [
          { do: `Recall why repeated updates on one batch are risky.`, why: `Each epoch moves $\\theta$ further from $\\theta_{old}$; on-policy data becomes stale and the policy can over-fit that one batch.` },
          { do: `See what the clip does.`, why: `The clip flattens the objective once any sample's ratio leaves $1\\pm\\epsilon$, removing the gradient that would push it further — bounding per-sample drift.` },
          { do: `Note the residual risk.`, why: `The clip bounds each sample, not the total KL divergence; enough epochs can still accumulate large overall drift.` }
        ],
        answer: `<p>The clip caps how much any single action's probability can be rewarded for moving, so reusing the batch a few times stays within a soft trust region instead of collapsing the policy. But the clip does not bound total KL divergence: too many epochs can still let the new policy drift far from the old one, so practitioners cap epochs (3&ndash;10) and early-stop on a KL target.</p>`
      }
    ]
  });

  window.CODE["rl-ppo"] = {
    lib: "gymnasium + PyTorch / stable-baselines3 (Colab)",
    runnable: false,
    explain:
      `<p>Two tracks. <b>Track A</b> is the cleanest path: <code>stable-baselines3</code> gives you a
       tuned PPO in three lines &mdash; create it on <code>CartPole-v1</code>, <code>learn</code>, done.
       <b>Track B</b> is a from-scratch sketch of the clipped-objective loss in raw PyTorch, so you can
       see the ratio, the $\\min$, and the clip that the lesson derives, plus the value-loss and entropy
       terms. Both run in Colab; the in-browser engine has no Gymnasium or PyTorch, so
       <code>runnable</code> is off. In Colab first run
       <code>!pip install stable-baselines3 gymnasium torch</code>.</p>`,
    code: `# ============================================================
# TRACK A — the clean path: stable-baselines3 PPO on CartPole.
#   In Colab:  !pip install stable-baselines3 gymnasium torch
# ============================================================
import gymnasium as gym
from stable_baselines3 import PPO
from stable_baselines3.common.evaluation import evaluate_policy

env = gym.make("CartPole-v1")

# A multilayer-perceptron policy; the defaults already encode the
# clip (clip_range=0.2), several epochs (n_epochs=10), and GAE (gae_lambda=0.95).
model = PPO(
    "MlpPolicy", env,
    clip_range=0.2,        # the epsilon of L^CLIP
    n_epochs=10,           # gradient epochs reused over each batch (safe via the clip)
    gae_lambda=0.95,       # GAE lambda: bias/variance of the advantage
    ent_coef=0.0,          # entropy bonus coefficient (c2)
    vf_coef=0.5,           # value-loss coefficient (c1)
    verbose=1,
)
model.learn(total_timesteps=50_000)   # CartPole is solved well before this
mean_r, std_r = evaluate_policy(model, env, n_eval_episodes=20)
print(f"mean reward over 20 episodes: {mean_r:.1f} +/- {std_r:.1f}")  # ~500 when solved


# ============================================================
# TRACK B — from-scratch PPO clipped loss in PyTorch (the core).
#   This is the exact L^CLIP + value loss + entropy bonus the
#   lesson derives. Assumes you already collected a rollout batch.
# ============================================================
import torch
import torch.nn as nn

EPS, C1, C2 = 0.2, 0.5, 0.01   # clip epsilon, value coef, entropy coef

def ppo_loss(dist, value, actions, old_logp, advantages, returns):
    """One PPO loss on a minibatch.
       dist        : current policy's action distribution (torch.distributions)
       value       : critic V(s) for each state, shape [N]
       actions     : actions taken under the OLD policy, shape [N]
       old_logp    : log pi_old(a|s) recorded at collection time, shape [N]
       advantages  : GAE advantages \\hat A_t, shape [N] (normalize before!)
       returns     : value targets \\hat V_t for the critic, shape [N]
    """
    # --- the probability ratio r_t = pi_theta / pi_theta_old ---
    new_logp = dist.log_prob(actions)
    ratio = torch.exp(new_logp - old_logp)          # exp(log r) is numerically safer

    # --- the clipped surrogate: min(r*A, clip(r,1-eps,1+eps)*A) ---
    unclipped = ratio * advantages
    clipped   = torch.clamp(ratio, 1.0 - EPS, 1.0 + EPS) * advantages
    policy_loss = -torch.min(unclipped, clipped).mean()   # minimize -L^CLIP == maximize L^CLIP

    # --- value-function loss: keep the critic that feeds A_t accurate ---
    value_loss = (returns - value).pow(2).mean()

    # --- entropy bonus: reward an uncertain policy to preserve exploration ---
    entropy = dist.entropy().mean()

    # total: maximize L^CLIP, minimize value error, maximize entropy
    return policy_loss + C1 * value_loss - C2 * entropy

# Typical training loop (sketch):
#   for update in range(num_updates):
#       batch = collect_rollouts(policy, env)          # ON-POLICY, with old_logp recorded
#       adv, ret = compute_gae(batch, gamma=0.99, lam=0.95)
#       adv = (adv - adv.mean()) / (adv.std() + 1e-8)  # normalize advantages
#       for epoch in range(10):                        # reuse the batch — safe via the clip
#           for mb in minibatches(batch):
#               dist, value = policy(mb.states)
#               loss = ppo_loss(dist, value, mb.actions, mb.old_logp, adv[mb.idx], ret[mb.idx])
#               opt.zero_grad(); loss.backward()
#               nn.utils.clip_grad_norm_(policy.parameters(), 0.5)  # grad clip, separate from L^CLIP
#               opt.step()`
  };

  window.CODEVIZ["rl-ppo"] = {
    question: "How do you READ PPO's diagrams? Start with the clipped surrogate vs the ratio r (the equation made visible), then the diagnostics you watch during training — the per-update KL between new and old policy, and the episode-reward learning curve — including what they look like when PPO is healthy vs when the clip is mis-tuned.",
    charts: [
      {
        type: "line",
        title: "Ideal: PPO clipped vs unclipped surrogate vs the ratio r (epsilon = 0.2)",
        xlabel: "probability ratio  r = pi_new / pi_old",
        ylabel: "per-sample surrogate objective",
        series: [
          {
            name: "unclipped, A=+1 (r*A)",
            color: "#9aa7b4",
            points: [
              [0.0, 0.0], [0.2, 0.2], [0.4, 0.4], [0.6, 0.6], [0.8, 0.8], [1.0, 1.0],
              [1.2, 1.2], [1.4, 1.4], [1.6, 1.6], [1.8, 1.8], [2.0, 2.0]
            ]
          },
          {
            name: "PPO clipped, A=+1 (good action)",
            color: "#4ea1ff",
            points: [
              [0.0, 0.0], [0.2, 0.2], [0.4, 0.4], [0.6, 0.6], [0.8, 0.8], [1.0, 1.0],
              [1.2, 1.2], [1.4, 1.2], [1.6, 1.2], [1.8, 1.2], [2.0, 1.2]
            ]
          },
          {
            name: "PPO clipped, A=-1 (bad action)",
            color: "#ff7b72",
            points: [
              [0.0, -0.8], [0.2, -0.8], [0.4, -0.8], [0.6, -0.8], [0.8, -0.8], [1.0, -1.0],
              [1.2, -1.2], [1.4, -1.4], [1.6, -1.6], [1.8, -1.8], [2.0, -2.0]
            ]
          }
        ],
        interpret: "<b>How to read it:</b> x-axis is the probability ratio r (1 means the new policy matches the old; bigger r means it favours that action more); y-axis is the per-sample objective PPO maximises. The straight grey line is the raw surrogate r*A — it keeps rewarding bigger r forever. The blue line (good action, A=+1) tracks grey until r hits 1+eps=1.2, then goes <b>flat</b>: past there the gradient is zero, so PPO has no incentive to push that action higher in one step. The red line (bad action, A=-1) is flat to the LEFT of 1-eps=0.8 but keeps dropping to the right, because the min reactivates the unclipped term to pull an over-shot bad action back. <b>Conclusion:</b> the flat shelves on each side ARE the soft trust region — that is the whole point of the clip."
      },
      {
        type: "line",
        title: "Healthy training: per-update KL stays under target",
        xlabel: "policy update",
        ylabel: "approx KL(new || old) per update",
        series: [
          {
            name: "KL per update (epsilon = 0.2)",
            color: "#7ee787",
            points: [
              [0, 0.012], [5, 0.016], [10, 0.014], [15, 0.018], [20, 0.013],
              [25, 0.017], [30, 0.015], [35, 0.011], [40, 0.014]
            ]
          },
          {
            name: "KL target (~0.02)",
            color: "#9aa7b4",
            points: [[0, 0.02], [40, 0.02]]
          }
        ],
        interpret: "<b>Illustrative.</b> x-axis is the training update; y-axis is how far the new policy moved from the old one this update, measured by KL divergence (0 = identical policies, bigger = moved further). With a well-tuned clip the green KL stays low and roughly flat, hugging well under the grey target line (~0.02). <b>How to recognise it:</b> small, stable KL with no upward drift means the clip is doing its job and each update is a safe step. This is what you want to see in the logs."
      },
      {
        type: "line",
        title: "Clip too loose: KL blows up, policy drifts",
        xlabel: "policy update",
        ylabel: "approx KL(new || old) per update",
        series: [
          {
            name: "KL per update (epsilon too large / too many epochs)",
            color: "#ff7b72",
            points: [
              [0, 0.02], [5, 0.05], [10, 0.11], [15, 0.22], [20, 0.40],
              [25, 0.65], [30, 0.95], [35, 1.35], [40, 1.9]
            ]
          },
          {
            name: "KL target (~0.02)",
            color: "#9aa7b4",
            points: [[0, 0.02], [40, 0.02]]
          }
        ],
        interpret: "<b>Illustrative failure mode.</b> Same axes as the healthy plot, but here the red KL climbs steeply and never settles, soaring far above the target line. <b>How to recognise it:</b> KL that keeps rising update after update means each step is moving the policy too far — caused by too large an epsilon (loose trust region) or too many epochs over one batch. The clip bounds drift per sample, not total KL, so this can happen even with clipping on. <b>Fix:</b> shrink epsilon back toward 0.2, cut epochs, and early-stop the update once measured KL exceeds the target."
      },
      {
        type: "line",
        title: "Learning curves: stable PPO vs collapse from a bad step",
        xlabel: "training steps (thousands)",
        ylabel: "mean episode reward",
        series: [
          {
            name: "stable PPO (epsilon = 0.2)",
            color: "#7ee787",
            points: [
              [0, 20], [5, 60], [10, 130], [15, 230], [20, 330],
              [25, 410], [30, 460], [35, 490], [40, 500]
            ]
          },
          {
            name: "collapse (clip too loose)",
            color: "#ff7b72",
            points: [
              [0, 20], [5, 65], [10, 140], [15, 250], [20, 300],
              [25, 90], [30, 40], [35, 35], [40, 30]
            ]
          }
        ],
        interpret: "<b>Illustrative.</b> x-axis is training progress; y-axis is mean episode reward (higher is better; ~500 solves CartPole). The green curve climbs smoothly and plateaus at the ceiling — healthy PPO. The red curve climbs at first, then <b>falls off a cliff</b> around step 20k: one over-large update pushed the policy so far it forgot what it learned, and because the next batch is collected by the now-broken policy it cannot recover. <b>How to recognise it:</b> a reward curve that rises then crashes (rather than just plateauing) is the policy-collapse signature the clip exists to prevent — and it lines up with the KL blow-up above."
      }
    ],
    caption: "Read the ideal surrogate first (the clip's flat shelves = the soft trust region), then the two diagnostics you actually watch while training: per-update KL and the episode-reward curve. Each chart carries its own interpretation; the first chart's numbers are computed by the numpy below, the training-diagnostic variants are illustrative but qualitatively honest.",
    code: `import numpy as np

# The PPO per-sample clipped surrogate, as a function of the ratio r.
eps = 0.2                                  # clip epsilon -> clip range [0.8, 1.2]
r = np.linspace(0.0, 2.0, 11)              # probability ratios to evaluate

def surrogate(r, A):
    unclipped = r * A
    clipped   = np.clip(r, 1 - eps, 1 + eps) * A
    return np.minimum(unclipped, clipped)  # PPO's L^CLIP per sample

A_pos, A_neg = 1.0, -1.0
print("r            :", np.round(r, 2))
print("unclipped A=+1:", np.round(r * A_pos, 2))      # the gray line: keeps rising
print("clipped   A=+1:", np.round(surrogate(r, A_pos), 2))  # flattens at 1.2 past r=1.2
print("clipped   A=-1:", np.round(surrogate(r, A_neg), 2))  # flat left of r=0.8`
  };
})();
