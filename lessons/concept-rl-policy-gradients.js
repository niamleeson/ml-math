/* Reinforcement Learning — "Policy gradients: optimize the policy directly by gradient ascent on return".
   Self-contained: lesson + CODE + CODEVIZ merged by id "rl-policy-gradients".
   Goes DEEPER than the existing mod-policy-gradient (REINFORCE) lesson — full RL-curriculum
   treatment of the policy-gradient theorem, the score-function trick, REINFORCE, and the
   baseline/advantage variance fix — and cross-links it. */
(function () {
  window.LESSONS.push({
    id: "rl-policy-gradients",
    title: "Policy gradients: optimize the policy directly by gradient ascent on return",
    tagline: "Don't learn a value table and act greedily — parameterize the policy and climb the expected-return hill, pushing up the log-probability of actions that paid off.",
    module: "Reinforcement Learning",
    prereqs: ["mod-policy-gradient", "rl-mdp", "fnd-gradient", "dl-cross-entropy", "prob-expectation"],

    whenToUse:
      `<p><b>Use a policy-gradient method when you want to learn the policy
       $\\pi_\\theta(a\\mid s)$ <i>directly</i> &mdash; parameterizing it and optimizing it by
       gradient ascent &mdash; instead of first learning action-values and then acting greedily.</b>
       This is the opposite design from value-based methods (Q-learning, Deep Q-Networks):
       there you learn $Q(s,a)$ and read off the policy as $\\arg\\max_a Q$; here the policy
       <i>is</i> the thing you train.</p>
       <ul>
         <li><b>Continuous or very large action spaces.</b> A robot's torques, a steering angle, a
         dosage &mdash; you cannot enumerate actions to take a $\\max$, so value-greedy methods
         struggle. A policy network can output the parameters of a distribution over a continuous
         action directly.</li>
         <li><b>Stochastic policies.</b> When the best behaviour is to randomize &mdash; bluffing in
         poker, breaking ties, or any partially-observed setting &mdash; a policy gradient learns a
         genuine probability distribution. A greedy value policy is deterministic by construction.</li>
         <li><b>You want to optimize the policy objective itself.</b> Policy gradient ascends
         <i>exactly</i> the quantity you care about, expected return $J(\\theta)$, rather than a
         surrogate value error.</li>
       </ul>
       <p><b>Prefer a different tool when:</b> actions are discrete and sample efficiency matters
       (a Deep Q-Network reuses replayed experience; vanilla policy gradient is on-policy and
       throws data away), or the task is not sequential decision-making at all (plain supervised
       learning).</p>
       <p>This lesson is the rigorous treatment behind the existing
       <code>mod-policy-gradient</code> lesson, which introduced REINFORCE intuitively. Here we
       <b>prove the policy-gradient theorem</b>, derive the baseline/advantage variance fix, and
       set up <code>mod-actor-critic</code> &mdash; which learns the baseline online.</p>`,

    application:
      `<p>Policy-gradient methods are the foundation of almost all of modern deep reinforcement
       learning.</p>
       <ul>
         <li><b>Continuous control and robotics.</b> Locomotion, manipulation, and balancing
         (MuJoCo, real robots) &mdash; smooth, continuous torque commands are produced by a policy
         network, not a $\\max$ over actions.</li>
         <li><b>Game-playing agents.</b> Stochastic policies for imperfect-information games and the
         large action spaces of real-time strategy games.</li>
         <li><b>RLHF (Reinforcement Learning from Human Feedback).</b> Aligning large language
         models: the model <i>is</i> the policy $\\pi_\\theta(a\\mid s)$ (next token given the
         prompt-so-far), and a learned reward model supplies the return that PPO (Proximal Policy
         Optimization, a stabilized policy gradient) ascends.</li>
         <li><b>The actor in actor-critic / A2C / PPO.</b> Every one of these is a policy gradient
         with a learned baseline (the critic) bolted on to cut variance &mdash; the topic of
         <code>mod-actor-critic</code>.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>High variance &mdash; the headline problem.</b> REINFORCE estimates the gradient
         from whole-episode returns $G_t$, which are extremely noisy, so learning is slow and
         jittery. <b>Fix:</b> subtract a state-dependent <b>baseline</b> $b(s)$ &mdash; typically
         the value $V(s)$ &mdash; giving the <b>advantage</b> $A=Q-V$. This reduces variance
         <i>without adding bias</i> (proved below) and is the single most important practical
         improvement. It motivates actor-critic, where a critic learns $V(s)$ online.</li>
         <li><b>Sample inefficiency.</b> Vanilla policy gradient is <b>on-policy</b>: each gradient
         estimate needs fresh data from the <i>current</i> policy, so every batch is used once and
         discarded. <b>Fix:</b> importance sampling / a clipped surrogate objective (PPO) reuses a
         batch for a few update steps.</li>
         <li><b>Sensitivity to learning rate &mdash; the policy can collapse.</b> One step too large
         can push the policy to a degenerate, near-deterministic distribution it never recovers
         from. <b>Fix:</b> small steps, a trust region (TRPO) or PPO's clipped ratio, and an
         <b>entropy bonus</b> to keep the policy exploring.</li>
         <li><b>Local optima.</b> Gradient ascent on a non-concave $J(\\theta)$ can settle on a
         mediocre policy. <b>Fix:</b> entropy regularization, multiple seeds, good initialization.</li>
         <li><b>Reward scaling.</b> The update is proportional to the return, so raw rewards in the
         thousands (or wildly varying magnitudes) blow up or stall the gradient. <b>Fix:</b>
         normalize / standardize returns (subtract mean, divide by standard deviation) per batch.</li>
       </ul>`,

    bigIdea:
      `<p>Value-based RL takes a detour: learn how good each action is ($Q$), then act greedily.
       <b>Policy gradient skips the detour</b> &mdash; it writes the policy as a differentiable
       function $\\pi_\\theta(a\\mid s)$ with parameters $\\theta$ (e.g. a neural network), and turns
       "find a good policy" into a plain optimization problem: <b>maximize expected return
       $J(\\theta)=\\mathbb{E}_{\\pi_\\theta}[G]$ by gradient ascent</b>,
       $\\theta \\leftarrow \\theta + \\alpha\\,\\nabla_\\theta J(\\theta)$.</p>
       <p>The obstacle is that $J$ is an average over <i>trajectories the policy itself
       generates</i> &mdash; change $\\theta$ and you change which data you see, so it is not obvious
       you can differentiate through it by sampling. The <b>policy-gradient theorem</b> resolves
       this. It says the gradient is itself an expectation you can estimate from samples:
       $\\nabla_\\theta J(\\theta)=\\mathbb{E}_{\\pi_\\theta}\\!\\big[\\nabla_\\theta\\log\\pi_\\theta(a\\mid s)\\,Q^{\\pi}(s,a)\\big]$.</p>
       <p>Read in plain words: <b>push up the log-probability of each action, weighted by how good
       that action was.</b> Good actions ($Q$ large) get their probability raised; bad actions get
       it lowered. No model of the world is needed &mdash; just the ability to sample actions and
       observe returns.</p>`,

    buildup:
      `<p>Start from the objective. A policy with parameters $\\theta$ induces a distribution over
       whole <b>trajectories</b> $\\tau = (s_0,a_0,s_1,a_1,\\dots)$. Its probability is
       $P_\\theta(\\tau) = \\rho(s_0)\\prod_t \\pi_\\theta(a_t\\mid s_t)\\,P(s_{t+1}\\mid s_t,a_t)$ &mdash;
       the start distribution times, at each step, the policy's choice times the world's response.
       The objective is the expected return $J(\\theta) = \\mathbb{E}_{\\tau\\sim P_\\theta}[\\,G(\\tau)\\,]$.</p>
       <p>The first key move is the <b>score-function / log-derivative trick</b>. For any
       distribution, $\\nabla_\\theta P_\\theta(\\tau) = P_\\theta(\\tau)\\,\\nabla_\\theta\\log P_\\theta(\\tau)$,
       because $\\nabla\\log f = \\nabla f / f$. This lets us pull the gradient <i>inside</i> an
       expectation: a gradient of an average becomes an average of a (log-)gradient, which we can
       estimate by sampling trajectories.</p>
       <p>The second key move: when we take $\\nabla_\\theta\\log P_\\theta(\\tau)$, the two factors
       that do <i>not</i> depend on $\\theta$ &mdash; the start distribution $\\rho(s_0)$ and the
       world dynamics $P(s_{t+1}\\mid s_t,a_t)$ &mdash; have <b>zero gradient</b> and drop out. Only
       $\\sum_t \\nabla_\\theta\\log\\pi_\\theta(a_t\\mid s_t)$ survives. <b>This is why policy gradient
       is model-free:</b> you never need to know the transition dynamics.</p>`,

    symbols: [
      { sym: "$\\theta$", desc: "the policy parameters (Greek 'theta') &mdash; e.g. the weights of the policy network. These are what we optimize." },
      { sym: "$\\pi_\\theta(a\\mid s)$", desc: "the parameterized policy (Greek 'pi'): the probability of choosing action $a$ in state $s$, as a differentiable function of $\\theta$. The bar '$\\mid$' reads 'given'." },
      { sym: "$J(\\theta)$", desc: "the objective: the expected return under policy $\\pi_\\theta$. We maximize it." },
      { sym: "$\\mathbb{E}_{\\pi_\\theta}[\\cdot]$", desc: "the expectation (average) over trajectories generated by following $\\pi_\\theta$ &mdash; averaging over both the policy's action choices and the world's randomness." },
      { sym: "$\\tau$", desc: "a trajectory (Greek 'tau'): one whole episode, the sequence $(s_0,a_0,s_1,a_1,\\dots)$." },
      { sym: "$G$, $G_t$", desc: "the return: the discounted sum of rewards. $G_t = \\sum_{k\\ge0}\\gamma^k R_{t+k}$ is the return from step $t$ onward; $G=G_0$ for the whole episode." },
      { sym: "$\\gamma$", desc: "the discount factor (Greek 'gamma'), in $[0,1)$: a reward $k$ steps later counts for $\\gamma^k$ of its value." },
      { sym: "$\\nabla_\\theta$", desc: "the gradient with respect to $\\theta$ (an upside-down triangle, 'nabla'): the vector of partial derivatives pointing in the direction of steepest increase." },
      { sym: "$\\nabla_\\theta\\log\\pi_\\theta(a\\mid s)$", desc: "the score function: the direction in $\\theta$-space that most increases the log-probability of action $a$. It is what the policy-gradient theorem multiplies by 'how good the action was'." },
      { sym: "$Q^{\\pi}(s,a)$", desc: "the action-value: the expected return from taking action $a$ in state $s$ and then following $\\pi$. 'How good was this action.'" },
      { sym: "$V^{\\pi}(s)$", desc: "the state-value: the expected return from state $s$ under $\\pi$, $V^\\pi(s)=\\mathbb{E}_{a\\sim\\pi}[Q^\\pi(s,a)]$. Used as the baseline." },
      { sym: "$b(s)$", desc: "a baseline: any function of the state alone (not of the action) subtracted from $Q$ to reduce variance. The best simple choice is $b(s)=V^\\pi(s)$." },
      { sym: "$A^{\\pi}(s,a)$", desc: "the advantage: $A^\\pi(s,a)=Q^\\pi(s,a)-V^\\pi(s)$ &mdash; how much better action $a$ is than the policy's average in state $s$. Positive = above average." },
      { sym: "$\\alpha$", desc: "the learning rate (Greek 'alpha'): the step size of the gradient-ascent update." }
    ],

    formula:
      `$$ J(\\theta) = \\mathbb{E}_{\\pi_\\theta}\\!\\left[\\,G\\,\\right]
         \\qquad
         \\theta \\leftarrow \\theta + \\alpha\\,\\nabla_\\theta J(\\theta) $$
       $$ \\boxed{\\;\\nabla_\\theta J(\\theta)
         = \\mathbb{E}_{\\pi_\\theta}\\!\\Big[\\,\\nabla_\\theta\\log\\pi_\\theta(a\\mid s)\\;Q^{\\pi}(s,a)\\,\\Big]\\;}
         \\quad\\text{(policy-gradient theorem)} $$
       $$ \\underbrace{\\nabla_\\theta J
           = \\mathbb{E}_{\\pi_\\theta}\\!\\Big[\\sum_t \\nabla_\\theta\\log\\pi_\\theta(a_t\\mid s_t)\\,G_t\\Big]}_{\\text{REINFORCE}}
         \\;,\\qquad
         \\underbrace{\\nabla_\\theta J
           = \\mathbb{E}_{\\pi_\\theta}\\!\\Big[\\nabla_\\theta\\log\\pi_\\theta(a\\mid s)\\,\\big(Q^\\pi(s,a)-b(s)\\big)\\Big]}_{\\text{baseline / advantage}} $$`,

    whatItDoes:
      `<p>The <b>top line</b> is the whole program: $J(\\theta)$ is the expected return, and we
       improve the policy by stepping $\\theta$ uphill along $\\nabla_\\theta J$ &mdash; gradient
       <i>ascent</i> (note the $+$), because we maximize.</p>
       <p>The <b>boxed policy-gradient theorem</b> is the engine. It says the gradient is an
       expectation of "score times value": for each $(s,a)$ the policy visits, take the score
       $\\nabla_\\theta\\log\\pi_\\theta(a\\mid s)$ (the direction that makes $a$ more probable) and
       scale it by $Q^\\pi(s,a)$ (how good $a$ was). Average over the policy's own experience. Good
       actions are pushed up, bad ones down &mdash; and crucially it is an expectation, so it can be
       estimated from samples.</p>
       <p>The <b>bottom line, left</b> is <b>REINFORCE</b> (Monte-Carlo policy gradient): replace the
       unknown $Q^\\pi(s,a)$ with the actual sampled return $G_t$ that followed. It is an unbiased
       estimate, but very noisy. The <b>bottom line, right</b> is the fix: subtract a baseline
       $b(s)$, turning the weight into the <b>advantage</b> $Q^\\pi-V^\\pi$. Same average gradient,
       far less variance.</p>`,

    derivation:
      `<p><b>Step 1 &mdash; differentiate the objective with the log-derivative trick.</b> Write
       $J(\\theta)=\\mathbb{E}_{\\tau\\sim P_\\theta}[G(\\tau)]=\\sum_\\tau P_\\theta(\\tau)\\,G(\\tau)$.
       Differentiate (the return $G(\\tau)$ does not depend on $\\theta$):
       $\\nabla_\\theta J=\\sum_\\tau \\nabla_\\theta P_\\theta(\\tau)\\,G(\\tau)$. Now use the
       <b>score-function trick</b> $\\nabla_\\theta P_\\theta=P_\\theta\\,\\nabla_\\theta\\log P_\\theta$:
       $\\nabla_\\theta J=\\sum_\\tau P_\\theta(\\tau)\\,\\nabla_\\theta\\log P_\\theta(\\tau)\\,G(\\tau)
       =\\mathbb{E}_{\\pi_\\theta}\\big[\\nabla_\\theta\\log P_\\theta(\\tau)\\,G(\\tau)\\big]$. A
       gradient of an average became an average we can sample.</p>
       <p><b>Step 2 &mdash; the dynamics drop out.</b> Take the log of the trajectory probability:
       $\\log P_\\theta(\\tau)=\\log\\rho(s_0)+\\sum_t\\big[\\log\\pi_\\theta(a_t\\mid s_t)+\\log P(s_{t+1}\\mid s_t,a_t)\\big]$.
       Differentiate in $\\theta$: $\\log\\rho(s_0)$ and every $\\log P(s_{t+1}\\mid s_t,a_t)$ are
       <i>independent of $\\theta$</i>, so their gradients are zero. Only the policy terms survive:
       $\\nabla_\\theta\\log P_\\theta(\\tau)=\\sum_t\\nabla_\\theta\\log\\pi_\\theta(a_t\\mid s_t)$.
       Hence
       $\\nabla_\\theta J=\\mathbb{E}_{\\pi_\\theta}\\big[\\big(\\sum_t\\nabla_\\theta\\log\\pi_\\theta(a_t\\mid s_t)\\big)\\,G(\\tau)\\big]$
       &mdash; <b>model-free</b>: no transition model appears.</p>
       <p><b>Step 3 &mdash; causality and $Q$.</b> An action at time $t$ cannot affect rewards earned
       <i>before</i> $t$. Dropping those (their expected contribution is zero) replaces the whole-episode
       $G(\\tau)$ on each term by the <b>return-to-go</b> $G_t=\\sum_{k\\ge t}\\gamma^{k-t}R_k$. Taking the
       expectation of that future return given $(s_t,a_t)$ is exactly $Q^\\pi(s_t,a_t)$, giving the
       boxed theorem
       $\\nabla_\\theta J=\\mathbb{E}_{\\pi_\\theta}[\\nabla_\\theta\\log\\pi_\\theta(a\\mid s)\\,Q^\\pi(s,a)]$.
       <b>REINFORCE</b> just plugs the sampled $G_t$ in for $Q^\\pi$.</p>
       <p><b>Step 4 &mdash; the baseline is free (unbiased) and cuts variance.</b> Subtract any
       function of the state alone, $b(s)$. Its contribution to the gradient is
       $\\mathbb{E}_{\\pi_\\theta}[\\nabla_\\theta\\log\\pi_\\theta(a\\mid s)\\,b(s)]$. Condition on $s$:
       $b(s)$ is constant in $a$, so it factors out of the inner expectation over actions, leaving
       $b(s)\\,\\mathbb{E}_{a\\sim\\pi}[\\nabla_\\theta\\log\\pi_\\theta(a\\mid s)]$. But that inner
       expectation is <b>zero</b>:
       $\\mathbb{E}_{a\\sim\\pi}[\\nabla_\\theta\\log\\pi_\\theta(a\\mid s)]
       =\\sum_a\\pi_\\theta(a\\mid s)\\frac{\\nabla_\\theta\\pi_\\theta(a\\mid s)}{\\pi_\\theta(a\\mid s)}
       =\\sum_a\\nabla_\\theta\\pi_\\theta(a\\mid s)=\\nabla_\\theta\\sum_a\\pi_\\theta(a\\mid s)=\\nabla_\\theta 1=0$.
       So <b>subtracting $b(s)$ changes the gradient's mean by nothing &mdash; it stays unbiased</b>
       &mdash; while choosing $b(s)\\approx V^\\pi(s)$ shrinks the multiplier from the raw value
       $Q^\\pi$ to the advantage $A^\\pi=Q^\\pi-V^\\pi$, which fluctuates around zero and therefore has
       much smaller variance. That is the whole motivation for actor-critic. &#8718;</p>`,

    example:
      `<p>One state, two actions, <b>Left</b> and <b>Right</b>, with logits (preferences)
       $\\theta=(\\theta_L,\\theta_R)$ fed through a softmax. Start at $\\theta_L=\\theta_R=0$, so
       $\\pi(\\text{Left})=\\pi(\\text{Right})=0.5$. Learning rate $\\alpha=0.4$. The agent samples
       <b>Right</b> and the episode returns $G=+2$; we plug $G$ in for $Q^\\pi$ (this is REINFORCE).</p>
       <ul class="steps">
         <li><b>Score of the softmax.</b> $\\nabla_{\\theta_a}\\log\\pi(a)=1-\\pi(a)$ for the chosen
         action, $-\\pi(a')$ for the others. Chosen = Right:
         $\\nabla_{\\theta_R}\\log\\pi(\\text{Right})=1-0.5=0.5$; Left: $0-0.5=-0.5$.</li>
         <li><b>Ascent update</b> $\\theta_a\\leftarrow\\theta_a+\\alpha\\,G\\,(\\text{score})$.
         Right: $0+0.4\\cdot2\\cdot0.5=+0.4$. Left: $0+0.4\\cdot2\\cdot(-0.5)=-0.4$.</li>
         <li><b>Re-softmax.</b> $e^{0.4}\\approx1.4918$, $e^{-0.4}\\approx0.6703$, sum $\\approx2.1621$,
         so $\\pi(\\text{Right})=1.4918/2.1621\\approx0.69$. Right rose $0.5\\to0.69$ because $G&gt;0$.</li>
       </ul>
       <p><b>Now the baseline.</b> Suppose a critic estimates $V(s)=+1.5$. REINFORCE weights the score
       by the raw return $G$; the advantage version weights it by $A=G-V$ instead. The table contrasts
       the two for Right (score $=+0.5$, $\\alpha=0.4$) over two different episodes:</p>
       <table class="extable">
         <caption>Same score, two weightings: raw return vs. advantage</caption>
         <thead><tr><th>episode</th><th class="num">$G$</th><th class="num">$V(s)$</th><th class="num">$A=G-V$</th><th class="num">REINFORCE step $\\alpha G\\cdot0.5$</th><th class="num">advantage step $\\alpha A\\cdot0.5$</th></tr></thead>
         <tbody>
           <tr><td class="row-h">good (above avg)</td><td class="num">$+2$</td><td class="num">$1.5$</td><td class="num">$+0.5$</td><td class="num">$+0.40$</td><td class="num">$+0.10$</td></tr>
           <tr><td class="row-h">meh (below avg)</td><td class="num">$+1$</td><td class="num">$1.5$</td><td class="num">$-0.5$</td><td class="num">$+0.20$</td><td class="num">$-0.10$</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Read the top row.</b> $A=2-1.5=+0.5$, so the update uses $0.5$ in place of $2$: a
         <i>gentler, less noisy</i> nudge ($+0.10$ vs. $+0.40$).</li>
         <li><b>Read the bottom row.</b> A return of $G=+1\\lt V$ gives $A=-0.5$: Right's probability
         now <i>falls</i> ($-0.10$), even though the raw reward was positive. REINFORCE would still
         push it <i>up</i> ($+0.20$).</li>
         <li><b>The point.</b> The baseline lets the agent tell "better than usual" from "worse than
         usual" &mdash; exactly what cuts the variance.</li>
       </ul>
       <p>The CODEVIZ below runs this exact softmax policy gradient on a tiny 3-arm environment for
       real, and plots the learning curve <i>with</i> versus <i>without</i> a baseline to show the
       variance reduction.</p>`,

    practice: [
      {
        q: `Why is the policy gradient model-free &mdash; i.e. why does it not require knowing the transition dynamics $P(s'\\mid s,a)$?`,
        steps: [
          { do: `Write the log-probability of a trajectory.`, why: `$\\log P_\\theta(\\tau)=\\log\\rho(s_0)+\\sum_t[\\log\\pi_\\theta(a_t\\mid s_t)+\\log P(s_{t+1}\\mid s_t,a_t)]$.` },
          { do: `Differentiate with respect to $\\theta$.`, why: `The start distribution $\\rho(s_0)$ and every dynamics term $P(s_{t+1}\\mid s_t,a_t)$ do not depend on $\\theta$, so their gradients are zero.` },
          { do: `Read off what survives.`, why: `Only $\\sum_t\\nabla_\\theta\\log\\pi_\\theta(a_t\\mid s_t)$ remains &mdash; just the policy, which we know in closed form.` }
        ],
        answer: `<p>Because in $\\nabla_\\theta\\log P_\\theta(\\tau)$ the dynamics and start-state terms are constants in $\\theta$ and vanish, leaving only $\\nabla_\\theta\\log\\pi_\\theta$. You never differentiate (or even need) $P(s'\\mid s,a)$ &mdash; you only need to <i>sample</i> from the world, not model it.</p>`
      },
      {
        q: `A REINFORCE update uses a sampled return $G_t=+10$. A teammate subtracts the state-value $V(s)=+9$ first and uses the advantage instead. Does this bias the gradient, and what changes?`,
        steps: [
          { do: `Recall the baseline result.`, why: `For any $b(s)$ depending only on the state, $\\mathbb{E}_{a\\sim\\pi}[\\nabla_\\theta\\log\\pi_\\theta(a\\mid s)\\,b(s)]=0$, because $\\mathbb{E}_{a\\sim\\pi}[\\nabla_\\theta\\log\\pi_\\theta(a\\mid s)]=0$.` },
          { do: `Conclude on bias.`, why: `Subtracting $b(s)$ removes a term whose expectation is zero, so the gradient's mean is unchanged &mdash; unbiased.` },
          { do: `Conclude on variance.`, why: `The weight shrinks from $G_t=10$ to the advantage $A=G_t-V=1$, a small number fluctuating around zero, so the estimator's variance drops sharply.` }
        ],
        answer: `<p>No bias &mdash; the expected gradient is identical. But the multiplier changes from $10$ to the advantage $1$, a much smaller, mean-zero-ish quantity, so the variance of the estimate falls. That is precisely why baselines (and actor-critic) make learning faster and steadier.</p>`
      },
      {
        q: `Your CartPole policy network outputs action probabilities, but training diverges: the loss explodes after a few good episodes. The returns range up to $+500$. Name two likely causes and their fixes.`,
        steps: [
          { do: `Look at the reward magnitude.`, why: `The update scales with the return; returns near $500$ make each gradient step huge, so a couple of long episodes can blow up $\\theta$.` },
          { do: `Look at variance / step size.`, why: `Plain REINFORCE has high variance and is sensitive to the learning rate; a large step on a noisy gradient can collapse or explode the policy.` },
          { do: `Apply the standard fixes.`, why: `Standardize returns per batch (subtract mean, divide by std), and/or subtract a baseline $V(s)$; lower the learning rate and add an entropy bonus.` }
        ],
        answer: `<p><b>(1) Reward scaling:</b> returns up to $500$ make the gradient enormous &mdash; standardize returns per batch. <b>(2) High variance / large steps:</b> subtract a baseline (use the advantage) and lower the learning rate; an entropy bonus prevents premature collapse. These are exactly the policy-gradient pitfalls, with their fixes.</p>`
      }
    ]
  });

  window.CODE["rl-policy-gradients"] = {
    lib: "gymnasium + PyTorch",
    runnable: false,
    explain:
      `<p>This is <b>REINFORCE on CartPole-v1</b> &mdash; the canonical deep policy gradient &mdash;
       written to run in Google Colab. A small policy network maps the 4-D state to action
       probabilities via a <code>softmax</code>; we <b>sample</b> actions from that distribution,
       roll out a full episode, compute the <b>discounted returns-to-go</b> $G_t$, and form the
       loss $-\\sum_t \\log\\pi_\\theta(a_t\\mid s_t)\\,G_t$ &mdash; whose gradient is exactly the
       REINFORCE estimate of $\\nabla_\\theta J$ (minimizing this <i>negative</i> log-prob-weighted
       return is the same as ascending $J$). We then <b>add a baseline</b>: we standardize the
       returns (subtract their mean, divide by std), which is the simplest constant baseline and
       dramatically steadies learning. <code>runnable</code> is off only because the in-browser
       engine has no Gymnasium or PyTorch; in Colab run <code>!pip install gymnasium torch</code>
       first.</p>`,
    code: `# Colab:  !pip install gymnasium torch
import gymnasium as gym
import torch, torch.nn as nn, torch.nn.functional as F
import numpy as np

torch.manual_seed(0); np.random.seed(0)
env = gym.make("CartPole-v1")
obs_dim = env.observation_space.shape[0]   # 4: cart pos/vel, pole angle/vel
n_act   = env.action_space.n               # 2: push left / push right
gamma   = 0.99

# ---- Policy network: state -> action probabilities (softmax) ----
class Policy(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(obs_dim, 128)
        self.fc2 = nn.Linear(128, n_act)
    def forward(self, s):
        h = F.relu(self.fc1(s))
        return F.softmax(self.fc2(h), dim=-1)   # pi_theta(a | s)

policy = Policy()
opt = torch.optim.Adam(policy.parameters(), lr=1e-2)

def run_episode():
    """Collect one episode: returns lists of log pi(a|s) and rewards."""
    s, _ = env.reset()
    log_probs, rewards = [], []
    done = False
    while not done:
        s_t = torch.as_tensor(s, dtype=torch.float32)
        probs = policy(s_t)                     # action probabilities
        dist  = torch.distributions.Categorical(probs)
        a     = dist.sample()                   # SAMPLE the action
        log_probs.append(dist.log_prob(a))      # log pi_theta(a | s)
        s, r, term, trunc, _ = env.step(a.item())
        rewards.append(r)
        done = term or trunc
    return log_probs, rewards

def discounted_returns(rewards):
    """Returns-to-go G_t = sum_{k>=t} gamma^{k-t} r_k (computed backward)."""
    G, out = 0.0, []
    for r in reversed(rewards):
        G = r + gamma * G
        out.insert(0, G)
    return torch.tensor(out, dtype=torch.float32)

USE_BASELINE = True   # standardize returns -> simplest baseline (cuts variance)

for ep in range(600):
    log_probs, rewards = run_episode()
    G = discounted_returns(rewards)
    if USE_BASELINE:                            # subtract baseline (mean), scale
        G = (G - G.mean()) / (G.std() + 1e-8)
    # REINFORCE loss:  -sum_t log pi_theta(a_t | s_t) * G_t
    # (minimizing -log_prob * G  ==  ascending J(theta))
    loss = -(torch.stack(log_probs) * G).sum()
    opt.zero_grad(); loss.backward(); opt.step()
    if ep % 50 == 0:
        print(f"episode {ep:4d}   return = {sum(rewards):6.1f}")

# CartPole is 'solved' at an average return of ~475 over 100 episodes.
# Try USE_BASELINE = False to watch learning get noticeably noisier.`
  };

  window.CODEVIZ["rl-policy-gradients"] = {
    question: "How do you READ a policy-gradient learning curve? We plot average reward per episode for a tiny 3-action softmax policy gradient (numpy), then show the variant shapes a practitioner actually sees: the healthy baseline-vs-none gap, a high-variance jittery run, and a learning-rate collapse.",
    charts: [
      {
        type: "line",
        title: "Healthy: reward rises, baseline (green) climbs faster than no-baseline (red)",
        xlabel: "episode (block of 50, averaged over 60 runs)",
        ylabel: "average reward",
        series: [
          { name: "with baseline", color: "#7ee787", points: [[0, 9.121], [1, 9.289], [2, 9.442], [3, 9.648], [4, 9.72], [5, 9.757], [6, 9.826], [7, 9.838], [8, 9.841], [9, 9.896], [10, 9.867], [11, 9.919], [12, 9.949], [13, 9.927], [14, 9.915], [15, 9.957], [16, 9.954], [17, 9.956], [18, 9.954], [19, 9.979]] },
          { name: "no baseline", color: "#ff7b72", points: [[0, 9.129], [1, 9.221], [2, 9.293], [3, 9.498], [4, 9.523], [5, 9.55], [6, 9.61], [7, 9.621], [8, 9.605], [9, 9.647], [10, 9.628], [11, 9.684], [12, 9.715], [13, 9.677], [14, 9.677], [15, 9.725], [16, 9.731], [17, 9.748], [18, 9.741], [19, 9.781]] }
        ],
        interpret: "<b>Read it:</b> x is training time (later = more episodes), y is average reward earned (higher = better policy). Both curves climb, so the policy-gradient update genuinely optimizes the policy. The two lines isolate ONE change: the <b>green</b> line subtracts a baseline (uses the advantage, 'is this arm better than average'); the <b>red</b> does not. <b>Conclude:</b> the gap between them is the variance fix &mdash; green climbs faster and ends higher (~9.98 vs ~9.78) because the baseline removes the large common reward offset, leaving only the advantage to drive the update. Same destination (best arm pays 10), green just gets there sooner and more reliably."
      },
      {
        type: "line",
        title: "High variance: no-baseline run jitters episode to episode (illustrative)",
        xlabel: "episode (single run, not averaged)",
        ylabel: "reward this episode",
        series: [
          { name: "no baseline (single seed)", color: "#ff7b72", points: [[0, 8.2], [1, 9.6], [2, 8.4], [3, 9.9], [4, 8.1], [5, 9.7], [6, 8.6], [7, 9.8], [8, 8.3], [9, 9.5], [10, 9.1], [11, 8.5], [12, 9.9], [13, 8.7], [14, 9.6], [15, 9.0], [16, 9.8], [17, 8.4], [18, 9.7], [19, 9.2]] },
          { name: "with baseline (single seed)", color: "#7ee787", points: [[0, 8.9], [1, 9.2], [2, 9.4], [3, 9.5], [4, 9.4], [5, 9.6], [6, 9.6], [7, 9.7], [8, 9.7], [9, 9.8], [10, 9.7], [11, 9.8], [12, 9.9], [13, 9.8], [14, 9.9], [15, 9.9], [16, 9.9], [17, 9.9], [18, 9.95], [19, 9.95]] }
        ],
        interpret: "<b>Illustrative.</b> This is ONE seed, not an average &mdash; so the noise is visible instead of smoothed away. <b>Read it:</b> the red line bounces violently up and down between adjacent episodes with no clean trend; the green line is a smooth ramp. <b>Recognise it:</b> a saw-tooth, jagged learning curve is the signature of high gradient variance &mdash; REINFORCE's headline problem, because whole-episode returns are noisy. <b>Conclude:</b> jitter this large means your gradient estimate is dominated by noise; subtract a baseline / standardize returns to turn the red shape into the green one."
      },
      {
        type: "line",
        title: "Policy collapse: learning rate too large, reward craters and stays low (illustrative)",
        xlabel: "episode (block of 50)",
        ylabel: "average reward",
        series: [
          { name: "lr too large (collapse)", color: "#ffb454", points: [[0, 9.1], [1, 9.4], [2, 9.6], [3, 9.5], [4, 8.2], [5, 8.25], [6, 8.18], [7, 8.22], [8, 8.2], [9, 8.19], [10, 8.21], [11, 8.2], [12, 8.2], [13, 8.21], [14, 8.19], [15, 8.2], [16, 8.2], [17, 8.2], [18, 8.21], [19, 8.2]] }
        ],
        interpret: "<b>Illustrative.</b> <b>Read it:</b> reward climbs at first, then a single oversized step drops it to a floor it never escapes (here it pins to ~8, the value of the WORST arm). <b>Recognise it:</b> early progress followed by a cliff and a flat plateau is policy collapse &mdash; one step too large pushed the softmax to a near-deterministic distribution stuck on a bad action, so the agent stops exploring and can't recover. <b>Conclude:</b> this is not slow learning, it's broken learning &mdash; lower the learning rate, clip the update (PPO/TRPO), and add an entropy bonus to keep the policy exploring."
      }
    ],
    code: `import numpy as np

# Tiny 3-action bandit (a one-state MDP). Rewards are stochastic AND have a
# large positive offset -- the regime where a baseline matters most: without
# it, every sampled action is pushed UP, slowing learning.
means = np.array([8.0, 9.0, 10.0])   # arm 2 is best (expected reward 10.0)
A, alpha, EPISODES, RUNS = 3, 0.02, 1000, 60

def softmax(theta):
    z = theta - theta.max()
    e = np.exp(z)
    return e / e.sum()

def train(use_baseline, seed):
    rng = np.random.default_rng(seed)
    theta = np.zeros(A)              # action preferences (logits)
    baseline = 0.0                   # running average reward (the baseline b)
    rewards = np.empty(EPISODES)
    for t in range(EPISODES):
        p = softmax(theta)
        a = rng.choice(A, p=p)                      # sample action ~ pi
        r = means[a] + rng.normal(0, 1.0)          # noisy reward
        adv = r - (baseline if use_baseline else 0.0)   # advantage = r - b(s)
        # score of softmax: d/dtheta log pi(a) = 1{i==a} - p[i]
        grad = -p.copy(); grad[a] += 1.0
        theta += alpha * adv * grad                 # gradient ASCENT on J
        baseline += 0.05 * (r - baseline)           # update running baseline
        rewards[t] = r
    return rewards

# average over RUNS seeds, then average into blocks of 50 episodes
def curve(use_baseline):
    allr = np.mean([train(use_baseline, s) for s in range(RUNS)], axis=0)
    return allr.reshape(-1, 50).mean(axis=1)        # 20 plotted points

print("with baseline:", np.round(curve(True), 3))
print("no baseline:  ", np.round(curve(False), 3))`
  };
})();
