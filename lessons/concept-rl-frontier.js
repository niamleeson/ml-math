/* Reinforcement Learning curriculum — the FRONTIER & practical reality (capstone).
   What you actually need to USE RL: reward design & reward hacking, RLHF (how ChatGPT-style
   LLMs are aligned), multi-agent RL, hierarchical RL, sim-to-real, and the hard truth that RL
   is sample-inefficient, unstable, seed-sensitive and hard to evaluate — plus when NOT to use it.
   Cross-links mod-llm (LLMs), mod-policy-gradient / mod-actor-critic (PPO), rl-sarsa-qlearning,
   rl-intro. Self-contained: lesson + CODE + CODEVIZ merged by id "rl-frontier". */
(function () {
  window.LESSONS.push({
    id: "rl-frontier",
    title: "The frontier of RL: reward hacking, RLHF, and the practical reality",
    tagline: "Everything between a textbook MDP and a working RL system — including the headline lesson that agents game any reward you mis-specify.",
    module: "Reinforcement Learning",
    prereqs: ["rl-intro", "rl-sarsa-qlearning", "mod-policy-gradient", "mod-actor-critic", "mod-dqn", "mod-llm"],

    whenToUse:
      `<p>This capstone is about <b>using</b> RL (Reinforcement Learning), not deriving it. Reach for RL when
       the problem is genuinely <b>sequential</b> (today's action changes tomorrow's situation), feedback is
       <b>evaluative</b> (a reward, not a labelled "correct answer"), and you can <b>interact</b> with the world
       or a simulator millions of times. The big four where it earns its keep:</p>
       <ul>
         <li><b>Aligning large language models (RLHF).</b> The single biggest real-world RL deployment today
          &mdash; ChatGPT-style assistants are fine-tuned with it (&rarr; <code>mod-llm</code>).</li>
         <li><b>Robotics &amp; control</b> &mdash; locomotion, manipulation, where actions are continuous and a
          model of the physics is hard to write but easy to simulate.</li>
         <li><b>Games &amp; planning</b> &mdash; Go, chess, StarCraft, Atari: a cheap, fast simulator and a clear
          win/lose reward.</li>
         <li><b>Long-horizon decision systems</b> &mdash; recommendation, ad pacing, inventory, where you must
          optimise for cumulative reward over time, not one-shot accuracy.</li>
       </ul>
       <p><b>The meta-skill this lesson teaches: recognising when RL is the WRONG tool.</b> If your actions do
       <i>not</i> change future state, you have a <b>bandit</b> (one-step), not a full RL problem &mdash; use a
       bandit algorithm, it is far simpler and more sample-efficient. If you already have the right answers,
       use <b>supervised learning</b>. If the dynamics are known and smooth, a classical <b>controller</b> (PID,
       model-predictive control) often beats RL with a fraction of the engineering. RL is the heavyweight tool
       you pull out only when the cheaper ones genuinely cannot express the problem.</p>`,

    application:
      `<p><b>RLHF (Reinforcement Learning from Human Feedback)</b> is the marquee application: it is how the
       instruction-following behaviour of modern chat assistants is produced (&rarr; <code>mod-llm</code>).
       Beyond that, <b>sim-to-real</b> RL with <b>domain randomisation</b> trains robot policies entirely in
       simulation and transfers them to physical hardware (dexterous hands, quadruped locomotion, drone
       control). <b>Multi-agent self-play</b> produced superhuman Go (AlphaGo/AlphaZero), Dota 2 and StarCraft
       agents. <b>Hierarchical RL</b> structures long tasks (navigation, game sub-goals) into reusable skills.
       And RL tunes data-centre cooling, chip-placement and compiler heuristics &mdash; anywhere a long-horizon
       objective resists a hand-written rule.</p>`,

    pitfalls:
      `<ul>
         <li><b>Reward hacking / specification gaming (the headline).</b> The agent optimises the reward you
          <i>wrote</i>, not the goal you <i>meant</i>. The famous case: a boat-racing agent rewarded for hitting
          checkpoint targets learned to spin in a lagoon hitting the same regenerating targets forever, never
          finishing the race &mdash; a higher score than actually racing. <b>Fix:</b> use
          <b>potential-based reward shaping</b> (below), which provably cannot change the optimal policy; add
          constraints/penalties; and test against held-out behaviours.</li>
         <li><b>Sample inefficiency &amp; cost.</b> RL can need millions to billions of environment steps. That
          is fine in a fast simulator, ruinous on real hardware or paid-API rollouts. <b>Fix:</b> simulate;
          use off-policy replay; or ask whether a bandit / supervised method needs far less data.</li>
         <li><b>Instability, seed-sensitivity &amp; irreproducibility.</b> The same algorithm with two random
          seeds can converge brilliantly or collapse. Published numbers are often the best of many seeds.
          <b>Fix:</b> report mean &plusmn; spread over many seeds; tune carefully; prefer stabilised algorithms
          (PPO clips the update; &rarr; <code>mod-policy-gradient</code>).</li>
         <li><b>Hard evaluation.</b> There is no clean held-out test set &mdash; performance depends on the very
          environment you trained in, and a high return can hide reward hacking. <b>Fix:</b> evaluate on unseen
          environment variations and inspect <i>behaviour</i>, not just the scalar return.</li>
         <li><b>Sim-to-real gap.</b> A policy that is perfect in simulation can fail on real hardware because the
          simulator is subtly wrong (friction, latency, sensor noise). <b>Fix:</b> <b>domain randomisation</b>
          &mdash; randomise the simulator's physics so the policy must be robust to a whole range, which usually
          covers reality.</li>
         <li><b>Using RL where something simpler wins.</b> If actions do not affect future state, it is a bandit;
          if you have labels, it is supervised learning; if the model is known, it is control. Reaching for RL
          there is more code, more instability and worse results.</li>
       </ul>`,

    bigIdea:
      `<p>The earlier lessons gave you the machinery &mdash; MDPs (Markov Decision Processes), returns, the
       Bellman equations, TD (Temporal-Difference) learning, policy gradients, deep RL. This capstone is about
       the <b>gap between that machinery and a system that works</b>, and where the field is pushing.</p>
       <p>One idea sits above all the others: <b>the agent optimises the reward you actually wrote, with no
       regard for what you meant.</b> Any gap between the two is a vulnerability the optimiser will find &mdash;
       this is <b>reward hacking</b> (a.k.a. specification gaming). It is not a bug in the algorithm; it is the
       algorithm working too well on the wrong objective. So <b>reward design is the real job</b>, and the math
       below (potential-based shaping) is the one tool that lets you <i>help</i> learning without <i>changing</i>
       what the agent is ultimately trying to do.</p>
       <p>The frontier topics &mdash; <b>RLHF</b> (learn the reward from human preferences instead of writing
       it), <b>multi-agent</b> RL (the reward depends on other learners), <b>hierarchical</b> RL (sub-goals),
       and <b>sim-to-real</b> (transfer from simulator to hardware) &mdash; are all, at heart, different answers
       to the same two questions: <i>where does the reward come from?</i> and <i>how do we make scarce, costly,
       unstable experience go further?</i></p>`,

    buildup:
      `<p>Six things to know to actually use RL. Each is one subsection.</p>
       <ol class="steps">
         <li><b>Reward design &amp; reward hacking.</b> A mis-specified reward gets gamed (the boat-race loop).
          Two honest ways to make learning easier without breaking it:
          <ul>
            <li><b>Potential-based reward shaping</b> &mdash; add a bonus
             $F(s,s') = \\gamma\\,\\Phi(s') - \\Phi(s)$ built from a <i>potential</i> $\\Phi$ (a hint about how
             "good" a state is). The math below proves this <i>cannot</i> change the optimal policy: it only
             changes the <i>speed</i> of learning.</li>
            <li><b>Sparse-reward tricks.</b> When reward is rare (only at the goal), add <b>curiosity /
             intrinsic motivation</b> (reward the agent for visiting surprising states) or use <b>HER (Hindsight
             Experience Replay)</b> &mdash; relabel a failed episode as a success at <i>whatever</i> state it
             actually reached, so every rollout teaches something.</li>
          </ul></li>
         <li><b>RLHF (Reinforcement Learning from Human Feedback).</b> You cannot write a reward for "be a
          helpful, honest assistant". So you <i>learn</i> one: collect human <b>preference comparisons</b>
          ("response A is better than B"), fit a <b>reward model</b> $r_\\phi$ to those preferences, then
          optimise the language-model policy $\\pi_\\theta$ against $r_\\phi$ with PPO (Proximal Policy
          Optimization) &mdash; while a KL (Kullback&ndash;Leibler) penalty keeps it close to the original model
          so it does not drift into gibberish that merely scores high. <b>DPO (Direct Preference Optimization)</b>
          is a simpler alternative that skips the explicit reward model and optimises the preferences directly.
          See the math section.</li>
         <li><b>Multi-agent RL.</b> Several learning agents share an environment &mdash; cooperative
          (teammates), competitive (opponents), or mixed. <b>Self-play</b> (an agent trains against copies of
          itself, as in AlphaZero) generates an automatic curriculum of ever-stronger opponents. The core
          difficulty is <b>non-stationarity</b>: from any one agent's view the environment keeps changing
          because the <i>other</i> agents are also learning, so the "fixed MDP" assumption breaks.</li>
         <li><b>Hierarchical RL.</b> Decompose a long task into a high-level policy that picks <b>sub-goals</b>
          (or temporally-extended <b>options</b> &mdash; "skills" that run for many steps) and low-level policies
          that achieve them. This shortens the effective horizon and lets skills be reused across tasks.</li>
         <li><b>Sim-to-real &amp; domain randomisation.</b> Train in a fast, safe simulator; deploy on hardware.
          The <b>sim-to-real gap</b> (the simulator is never exactly reality) is bridged by <b>domain
          randomisation</b>: randomise masses, frictions, latencies and textures during training so the policy
          must work for a <i>distribution</i> of worlds &mdash; real life is then just one more sample.</li>
         <li><b>The practical reality.</b> RL is <b>sample-inefficient</b>, <b>unstable</b>,
          <b>seed-sensitive</b>, and <b>hard to evaluate</b>. Before committing, ask: is this a bandit? do I have
          labels (supervised)? is the model known (control)? If yes, do that instead.</li>
       </ol>`,

    symbols: [
      { sym: "$s,\\, s'$", desc: "a state and the next state reached after one transition." },
      { sym: "$a$", desc: "an action taken in a state." },
      { sym: "$\\gamma$", desc: "the discount factor in $[0,1]$: how much a reward one step later is worth relative to now." },
      { sym: "$R(s,a,s')$", desc: "the original (true) environment reward for the transition $s \\to s'$ under action $a$." },
      { sym: "$\\Phi(s)$", desc: "the POTENTIAL of a state: a hand-chosen, real-valued hint of how 'good' state $s$ is. Used only inside the shaping term; the bigger $\\Phi(s')-\\Phi(s)$ jump, the bigger the shaping bonus." },
      { sym: "$F(s,s')$", desc: "the potential-based shaping reward added to $R$: $F(s,s')=\\gamma\\,\\Phi(s')-\\Phi(s)$. It nudges learning toward higher-potential states without changing the optimal policy." },
      { sym: "$R'(s,a,s')$", desc: "the shaped reward the agent actually trains on: $R' = R + F = R + \\gamma\\Phi(s') - \\Phi(s)$." },
      { sym: "$Q^\\pi(s,a)$", desc: "action-value under policy $\\pi$: expected discounted return from taking $a$ in $s$ then following $\\pi$." },
      { sym: "$\\pi_\\theta$", desc: "the policy (in RLHF, the language model) with trainable parameters $\\theta$. It maps a state/prompt to a distribution over actions/tokens." },
      { sym: "$\\pi_{\\text{ref}}$", desc: "the reference policy in RLHF: a frozen copy of the model before RL, used to keep $\\pi_\\theta$ from drifting too far." },
      { sym: "$r_\\phi(x,y)$", desc: "the learned REWARD MODEL with parameters $\\phi$: a scalar score for response $y$ to prompt $x$, fit from human preference comparisons." },
      { sym: "$y_w \\succ y_l$", desc: "a human preference: response $y_w$ ('winner') is judged better than $y_l$ ('loser') for the same prompt." },
      { sym: "$\\sigma(\\cdot)$", desc: "the logistic sigmoid $\\sigma(z)=1/(1+e^{-z})$, which turns a score difference into a probability." },
      { sym: "$\\beta$", desc: "the strength of the KL (Kullback&ndash;Leibler) penalty in RLHF: how hard we anchor $\\pi_\\theta$ to $\\pi_{\\text{ref}}$." },
      { sym: "$D_{\\mathrm{KL}}(\\,p\\,\\Vert\\,q\\,)$", desc: "the Kullback&ndash;Leibler divergence: a non-negative measure of how far distribution $p$ is from $q$; zero only when they are equal." }
    ],

    formula: `$$ \\underbrace{F(s,s') = \\gamma\\,\\Phi(s') - \\Phi(s)}_{\\text{potential-based reward shaping}} \\qquad\\qquad \\underbrace{\\max_{\\theta}\\; \\mathbb{E}_{x,\\,y\\sim\\pi_\\theta}\\!\\bigl[\\,r_\\phi(x,y)\\,\\bigr] \\;-\\; \\beta\\, D_{\\mathrm{KL}}\\!\\bigl(\\pi_\\theta \\,\\Vert\\, \\pi_{\\text{ref}}\\bigr)}_{\\text{KL-penalized RLHF objective (optimized with PPO)}} $$`,

    whatItDoes:
      `<p><b>Left &mdash; potential-based reward shaping.</b> You pick a potential $\\Phi(s)$ &mdash; any guess of
       how good each state is (e.g. negative distance to the goal). The agent trains on the shaped reward
       $R'(s,a,s') = R(s,a,s') + \\gamma\\,\\Phi(s') - \\Phi(s)$. The extra term pays the agent for moving to a
       higher-potential state and charges it for leaving one, so it gets dense guidance even when the true
       reward $R$ is sparse. The remarkable fact (derived below): <b>this exact form is the <i>only</i> shaping
       that is guaranteed not to change which policy is optimal.</b> It speeds learning without moving the goal.</p>
       <p><b>Right &mdash; the RLHF objective.</b> Read it as: <i>make the model's responses score as high as
       possible under the learned reward model $r_\\phi$ ($\\mathbb{E}[r_\\phi]$ term), but do not stray far from
       the original model</i> (the $-\\beta D_{\\mathrm{KL}}$ penalty). The expectation is over prompts $x$ and
       responses $y$ sampled from the current policy $\\pi_\\theta$. The reward model $r_\\phi$ is itself trained
       first, from human preference data; PPO then maximises this whole objective. The KL term is the safety
       leash: without it the policy finds adversarial, high-reward gibberish &mdash; reward hacking again.</p>`,

    derivation:
      `<p><b>Why potential-based shaping preserves the optimal policy.</b> This is the one theorem you should
       carry out of this lesson. Consider any trajectory $s_0, a_0, s_1, a_1, \\dots$. The agent's true objective
       is the discounted return of the <i>original</i> rewards $R$. Now train it on $R' = R + F$ with
       $F(s,s') = \\gamma\\Phi(s') - \\Phi(s)$. Look at what the shaping adds to the discounted return along the
       trajectory:</p>
       $$ \\sum_{t=0}^{\\infty} \\gamma^{\\,t}\\, F(s_t, s_{t+1}) = \\sum_{t=0}^{\\infty} \\gamma^{\\,t}\\bigl(\\gamma\\,\\Phi(s_{t+1}) - \\Phi(s_t)\\bigr) = \\sum_{t=0}^{\\infty}\\Bigl(\\gamma^{\\,t+1}\\Phi(s_{t+1}) - \\gamma^{\\,t}\\Phi(s_t)\\Bigr). $$
       <p>That is a <b>telescoping sum</b>: each $+\\gamma^{t+1}\\Phi(s_{t+1})$ term cancels the
       $-\\gamma^{t+1}\\Phi(s_{t+1})$ term of the next step. Everything collapses to the single surviving end:</p>
       $$ \\sum_{t=0}^{\\infty} \\gamma^{\\,t}\\, F(s_t, s_{t+1}) = -\\,\\Phi(s_0) \\quad(\\text{plus } \\lim_{t\\to\\infty}\\gamma^{t}\\Phi(s_t) = 0 \\text{ for } \\gamma \\lt 1). $$
       <p>So the shaped return equals the true return <i>minus a constant</i> $\\Phi(s_0)$ that depends only on the
       <b>start state</b>, never on the actions chosen. Define the shaped value
       $Q'^{\\pi}(s,a) = Q^{\\pi}(s,a) - \\Phi(s)$; every policy's value shifts by the <i>same</i> state-dependent
       constant, so</p>
       $$ \\arg\\max_a Q'^{\\pi}(s,a) = \\arg\\max_a \\bigl(Q^{\\pi}(s,a) - \\Phi(s)\\bigr) = \\arg\\max_a Q^{\\pi}(s,a). $$
       <p>The $-\\Phi(s)$ is constant across actions $a$ in a given state, so it cannot flip which action is best.
       <b>The greedy / optimal policy is identical under $R$ and $R'$.</b> $\\blacksquare$ (Ng, Harada &amp;
       Russell, 1999, proved the converse too: <i>only</i> potential-based $F$ has this guarantee &mdash; any
       other shaping can introduce new optimal policies, i.e. reward hacking.)</p>
       <p><b>The RLHF pipeline, high level.</b> Three stages:</p>
       <ol class="steps">
         <li><b>Reward model.</b> Collect pairs where humans marked $y_w \\succ y_l$. Fit $r_\\phi$ with the
          Bradley&ndash;Terry preference loss, which says the probability a human prefers $y_w$ is
          $\\sigma\\bigl(r_\\phi(x,y_w) - r_\\phi(x,y_l)\\bigr)$:
          $$ \\mathcal{L}(\\phi) = -\\,\\mathbb{E}_{(x,y_w,y_l)}\\Bigl[\\log \\sigma\\bigl(r_\\phi(x,y_w) - r_\\phi(x,y_l)\\bigr)\\Bigr]. $$
          Minimising this makes the reward model score preferred responses higher.</li>
         <li><b>Policy optimisation.</b> Treat the language model as a policy $\\pi_\\theta$ and maximise the
          objective in the formula box &mdash; $\\mathbb{E}[r_\\phi] - \\beta D_{\\mathrm{KL}}(\\pi_\\theta\\,\\Vert\\,\\pi_{\\text{ref}})$ &mdash;
          using PPO (the clipped policy-gradient method of <code>mod-policy-gradient</code> /
          <code>mod-actor-critic</code>). The KL term is the leash against reward hacking.</li>
         <li><b>DPO shortcut.</b> Direct Preference Optimization shows the optimum of stage 2 can be reached
          <i>without</i> an explicit reward model or PPO: a closed-form relation makes the policy <i>itself</i>
          the implicit reward, so you optimise one supervised-style loss directly on the preference pairs. Same
          target, far less machinery &mdash; which is why much recent alignment work uses DPO.</li>
       </ol>`,

    example:
      `<p><b>Shaping a 1-D walk to the goal.</b> States $0,1,2,3$ on a line; state $3$ is the goal (terminal).
       The only true reward is $R = +1$ on reaching state $3$, else $0$ &mdash; very sparse. Let
       $\\gamma = 0.9$ and choose the potential $\\Phi(s) = s$ (closer to the goal = higher potential).</p>
       <ul class="steps">
         <li><b>Shaping bonus for stepping forward</b> $2 \\to 3$:
          $F = \\gamma\\Phi(3) - \\Phi(2) = 0.9(3) - 2 = 2.7 - 2 = +0.7$. Moving toward the goal now pays
          immediately, even before the $+1$ ever appears.</li>
         <li><b>Stepping backward</b> $2 \\to 1$:
          $F = \\gamma\\Phi(1) - \\Phi(2) = 0.9(1) - 2 = 0.9 - 2 = -1.1$. Retreating is penalised.</li>
         <li><b>Does it change the goal?</b> No. Sum the shaping over the full path $0\\to1\\to2\\to3$:
          $F_{0\\to1}+ \\gamma F_{1\\to2} + \\gamma^2 F_{2\\to3}$
          $= (0.9{\\cdot}1 - 0) + 0.9(0.9{\\cdot}2 - 1) + 0.81(0.9{\\cdot}3 - 2)$
          $= 0.9 + 0.9(0.8) + 0.81(0.7) = 0.9 + 0.72 + 0.567 = 2.187$. And indeed
          $-\\Phi(s_0) + \\gamma^{3}\\Phi(s_3) = -0 + 0.729{\\cdot}3 = 2.187$ &mdash; it depends only on the
          endpoints, exactly as the telescoping derivation said. The action-by-action preferences are unchanged;
          the agent just gets a dense breadcrumb trail.</li>
       </ul>
       <p>The CODEVIZ below runs this same idea on a 5&times;5 gridworld and shows the shaped agent solving it in
       a fraction of the episodes, converging to the <i>same</i> optimal return.</p>`,

    practice: [
      {
        q: `A gridworld gives reward only at the goal (sparse). You add potential-based shaping with $\\Phi(s) = -\\,\\text{(Manhattan distance from }s\\text{ to the goal)}$ and $\\gamma=0.95$. For a step that moves from distance $4$ to distance $3$, compute the shaping bonus $F$, and state whether the optimal policy can change.`,
        steps: [
          { do: `Write the potentials: $\\Phi(s)=-4$ (distance 4), $\\Phi(s')=-3$ (distance 3).`, why: `$\\Phi$ is just negative distance, so closer states have higher (less negative) potential.` },
          { do: `Apply $F(s,s')=\\gamma\\Phi(s')-\\Phi(s) = 0.95(-3) - (-4) = -2.85 + 4 = +1.15$.`, why: `Moving one step closer to the goal earns a positive shaping bonus, giving dense guidance.` },
          { do: `Recall the theorem: potential-based shaping changes the return by only the constant $-\\Phi(s_0)$, so it cannot change which action is optimal.`, why: `The $-\\Phi(s)$ shift is identical across all actions in a state, so the $\\arg\\max$ is untouched.` }
        ],
        answer: `$F = +1.15$. The optimal policy <b>cannot</b> change: potential-based shaping shifts every policy's value by the same state-dependent constant $-\\Phi(s)$, which is constant across actions, so $\\arg\\max_a Q$ is preserved. You get faster learning, same optimum.`
      },
      {
        q: `In RLHF, the policy optimisation maximises $\\mathbb{E}_{y\\sim\\pi_\\theta}[r_\\phi(x,y)] - \\beta\\,D_{\\mathrm{KL}}(\\pi_\\theta\\,\\Vert\\,\\pi_{\\text{ref}})$. What goes wrong if you drop the KL term ($\\beta = 0$), and what is $r_\\phi$ trained from?`,
        steps: [
          { do: `With $\\beta=0$ the only objective is "maximise the reward model's score".`, why: `Nothing anchors the policy to sensible language anymore.` },
          { do: `The reward model $r_\\phi$ is imperfect; the optimiser finds inputs that score high but are degenerate (repetitive, off-distribution text) — reward hacking.`, why: `Optimising any imperfect learned reward to the extreme exploits its errors.` },
          { do: `$r_\\phi$ is trained from human PREFERENCE comparisons ($y_w \\succ y_l$) via the Bradley–Terry loss $-\\log\\sigma(r_\\phi(x,y_w)-r_\\phi(x,y_l))$.`, why: `You cannot hand-write a reward for 'be helpful', so you learn it from which response humans preferred.` }
        ],
        answer: `Without the KL leash ($\\beta=0$) the policy drifts far from $\\pi_{\\text{ref}}$ and exploits the imperfect reward model &mdash; producing high-scoring gibberish (reward hacking). The KL penalty keeps $\\pi_\\theta$ close to the original model. The reward model $r_\\phi$ is trained from human preference comparisons $y_w \\succ y_l$ using the Bradley&ndash;Terry / logistic loss.`
      },
      {
        q: `A product team wants to "use RL" to pick which of several banner ads to show a user, where the ad shown does NOT change what the user will be shown next (each impression is independent). Is full RL the right tool? What is simpler?`,
        steps: [
          { do: `Check the defining property of RL: does today's action change tomorrow's state?`, why: `Sequentiality (actions affect future state) is what distinguishes RL from one-step problems.` },
          { do: `Here each impression is independent — the action does NOT affect the next state.`, why: `That collapses the long-horizon return to a single immediate reward.` },
          { do: `A one-step decision under uncertainty with no state transitions is a MULTI-ARMED BANDIT.`, why: `Bandit algorithms (e.g. UCB, Thompson sampling) solve exactly this and need far less data than full RL.` }
        ],
        answer: `No &mdash; full RL is overkill. Because the action does not change future state, this is a <b>bandit</b> problem, not a sequential MDP. Use a bandit algorithm (UCB, Thompson sampling): simpler, more sample-efficient, and more stable. Recognising "this is a bandit / supervised / control problem, not RL" is the practical meta-skill &mdash; reach for full RL only when the problem is genuinely sequential.`
      }
    ]
  });

  /* -------------------------------------------------------------------------- */
  window.CODE["rl-frontier"] = {
    lib: "numpy (gridworld) — RLHF reward-model snippet in PyTorch",
    runnable: false,
    explain:
      `<p>A clear, self-contained demo of the headline idea: <b>potential-based reward shaping speeds up
       learning without changing the optimum</b>. We build a tiny 5&times;5 gridworld with a single sparse
       reward at the goal, then train tabular Q-learning twice &mdash; once on the raw sparse reward, once with
       potential-based shaping $F(s,s')=\\gamma\\Phi(s')-\\Phi(s)$ where $\\Phi$ is negative Manhattan distance to
       the goal. The shaped agent gets a dense breadcrumb trail and solves the maze in far fewer episodes, yet
       converges to the <i>same</i> greedy path (the theorem guarantees it).</p>
       <p>It is plain numpy, so it runs anywhere (no gym/torch needed). The second block is a short, illustrative
       PyTorch sketch of the RLHF <b>reward model</b> &mdash; the Bradley&ndash;Terry preference loss
       $-\\log\\sigma(r(x,y_w)-r(x,y_l))$ &mdash; to show the shape of the alignment pipeline. Marked
       <code>runnable:false</code>; runs in Colab.</p>`,
    code: `# Potential-based reward SHAPING speeds up learning without moving the optimum.
# Pure numpy -- runs anywhere (Colab or local).
import numpy as np
rng = np.random.default_rng(0)

N = 5                                   # 5x5 grid
START, GOAL = (0, 0), (N - 1, N - 1)
ACTIONS = [(-1, 0), (1, 0), (0, -1), (0, 1)]   # up, down, left, right
gamma, alpha, eps = 0.95, 0.5, 0.3

def step(s, a):
    dr, dc = ACTIONS[a]
    r, c = s[0] + dr, s[1] + dc
    r, c = min(max(r, 0), N - 1), min(max(c, 0), N - 1)   # clamp to grid
    s2 = (r, c)
    reward = 1.0 if s2 == GOAL else 0.0     # SPARSE: reward only at the goal
    done = (s2 == GOAL)
    return s2, reward, done

def potential(s):                            # Phi(s) = -(Manhattan distance to goal)
    return -(abs(s[0] - GOAL[0]) + abs(s[1] - GOAL[1]))

def train(shaped, episodes=400, max_steps=500, seed=0):
    rng = np.random.default_rng(seed)
    Q = np.zeros((N, N, 4))
    steps_to_goal = []
    for ep in range(episodes):
        s, done, t = START, False, 0
        while not done and t < max_steps:
            a = rng.integers(4) if rng.random() < eps else int(np.argmax(Q[s[0], s[1]]))
            s2, r, done = step(s, a)
            # Potential-based shaping: r' = r + gamma*Phi(s2) - Phi(s).
            r_train = r + (gamma * potential(s2) - potential(s) if shaped else 0.0)
            target = r_train + (0.0 if done else gamma * np.max(Q[s2[0], s2[1]]))
            Q[s[0], s[1], a] += alpha * (target - Q[s[0], s[1], a])
            s = s2
            t += 1
        steps_to_goal.append(t)             # fewer steps = solved faster
    return Q, steps_to_goal

Q_sparse, steps_sparse = train(shaped=False)
Q_shaped, steps_shaped = train(shaped=True)

# Greedy path length under each learned Q (same optimum = 8 steps, the shortest path).
def greedy_len(Q):
    s, t = START, 0
    while s != GOAL and t < 100:
        s, _, _ = step(s, int(np.argmax(Q[s[0], s[1]])))
        t += 1
    return t

print("sparse : mean steps over last 50 eps =", round(np.mean(steps_sparse[-50:]), 1),
      "| greedy path =", greedy_len(Q_sparse))
print("shaped : mean steps over last 50 eps =", round(np.mean(steps_shaped[-50:]), 1),
      "| greedy path =", greedy_len(Q_shaped))
# Typical output -- both reach the SAME optimal 8-step greedy path, but the shaped
# agent gets there far sooner (the sparse agent flails at the step cap for ~180
# episodes before it ever stumbles onto the goal):
# sparse : mean steps over last 50 eps = 11.8 | greedy path = 8
# shaped : mean steps over last 50 eps = 11.1 | greedy path = 8

# ---------------------------------------------------------------------------
# RLHF reward model (illustrative PyTorch sketch). Colab: already has torch.
# Fits r_phi to human preferences y_w > y_l via the Bradley-Terry loss
# -log sigma( r(x, y_w) - r(x, y_l) ). This is stage 1 of the RLHF pipeline;
# stage 2 optimizes the LANGUAGE-MODEL policy against r_phi with PPO + a KL leash.
import torch, torch.nn as nn, torch.nn.functional as Fnn
reward_model = nn.Sequential(nn.Linear(768, 256), nn.ReLU(), nn.Linear(256, 1))
opt = torch.optim.Adam(reward_model.parameters(), lr=1e-4)

def preference_loss(emb_w, emb_l):          # emb_* : embeddings of winner / loser responses
    r_w = reward_model(emb_w).squeeze(-1)   # scalar score for the preferred response
    r_l = reward_model(emb_l).squeeze(-1)   # scalar score for the rejected response
    return -Fnn.logsigmoid(r_w - r_l).mean()  # push r_w above r_l

# Training loop sketch (real data = human-labeled (chosen, rejected) pairs):
# for emb_w, emb_l in preference_dataloader:
#     loss = preference_loss(emb_w, emb_l)
#     opt.zero_grad(); loss.backward(); opt.step()`
  };

  /* -------------------------------------------------------------------------- */
  window.CODEVIZ["rl-frontier"] = {
    question: "How do you READ an RL training curve to tell honest progress (shaping) from the headline failure -- reward hacking, where the SCORE climbs while the real goal collapses?",
    charts: [
      {
        type: "line",
        title: "IDEAL: learning speed -- steps-to-goal (10-ep moving avg), SPARSE vs POTENTIAL-SHAPED reward (5x5 gridworld, Q-learning)",
        xlabel: "training episode",
        ylabel: "steps to reach the goal, smoothed (lower = solved faster; 500 = hit the step cap, never reached goal; optimum = 8)",
        series: [
          {
            name: "sparse reward only",
            color: "#ff7b72",
            points: [
              [1, 500.0], [3, 500.0], [5, 500.0], [8, 500.0], [12, 500.0],
              [16, 500.0], [20, 500.0], [25, 500.0], [30, 500.0], [40, 500.0],
              [50, 500.0], [65, 500.0], [80, 500.0], [100, 500.0], [130, 500.0],
              [160, 500.0], [200, 14.7], [260, 13.9], [320, 12.8], [400, 14.0]
            ]
          },
          {
            name: "potential-shaped reward",
            color: "#4ea1ff",
            points: [
              [1, 99.0], [3, 39.7], [5, 28.2], [8, 21.1], [12, 11.2],
              [16, 10.9], [20, 12.1], [25, 13.0], [30, 11.7], [40, 10.3],
              [50, 11.0], [65, 11.1], [80, 11.1], [100, 11.5], [130, 10.6],
              [160, 10.8], [200, 13.4], [260, 10.8], [320, 12.0], [400, 10.4]
            ]
          },
          {
            name: "optimal greedy path = 8 steps",
            color: "#9aa0a6",
            points: [[1, 8], [400, 8]]
          }
        ],
        interpret: "<b>How to read it:</b> x is training episodes, y is how many steps the agent took to reach the goal that episode (smoothed) -- LOWER is better, and the grey line at 8 is the shortest possible path. A flat line pinned at 500 means the agent hit the step cap and never reached the goal at all. <b>The two stories:</b> the shaped agent (blue) gets a dense breadcrumb from the potential term and drops to near-optimal within ~15 episodes; the sparse agent (red) sits at 500 for ~180 episodes -- it only learns once it stumbles onto the goal by luck -- then collapses to a short path. <b>Conclude:</b> both settle at the same ~8-step optimum (the theorem guarantees shaping cannot move it); shaping only changes the SPEED, not the destination. Real numbers from the numpy run below."
      },
      {
        type: "line",
        title: "VARIANT -- REWARD HACKING: the proxy score soars while the TRUE objective collapses (the boat-race loop)",
        xlabel: "training episode",
        ylabel: "value (proxy reward you wrote vs the true goal you meant)",
        series: [
          { name: "proxy reward (what you optimised)", color: "#ffb454", points: [[1, 5], [20, 18], [40, 30], [60, 44], [80, 58], [100, 70], [120, 80], [140, 88], [160, 93], [180, 96], [200, 98]] },
          { name: "true objective (what you wanted)", color: "#ff7b72", points: [[1, 5], [20, 14], [40, 22], [55, 28], [70, 30], [85, 27], [100, 22], [120, 15], [140, 9], [160, 5], [180, 3], [200, 2]] }
        ],
        interpret: "<b>Illustrative shapes.</b> Two curves that AGREE early then SPLIT is the visual fingerprint of reward hacking. The orange line is the reward you actually wrote (e.g. points for hitting checkpoint targets); the red line is the goal you meant (finishing the race). Early on they rise together, so a dashboard watching only the orange score looks like a triumph. <b>The tell is the divergence around episode 60-70:</b> the agent discovers it can farm the proxy -- spinning in a lagoon re-hitting regenerating targets -- so orange keeps soaring while red turns and crashes toward zero. <b>Conclude:</b> if your monitored metric keeps climbing but spot-checks of actual behaviour get worse, you are not training -- you are being gamed. Always plot a held-out true measure alongside the optimised one."
      },
      {
        type: "line",
        title: "VARIANT -- RLHF without the KL leash: drop β=0 and the policy games the reward model into high-scoring gibberish",
        xlabel: "PPO update step",
        ylabel: "value (reward-model score vs human-judged quality)",
        series: [
          { name: "reward-model score r_phi (β=0, no leash)", color: "#ffb454", points: [[0, 0.1], [50, 0.4], [100, 0.7], [150, 1.1], [200, 1.6], [250, 2.2], [300, 2.9], [350, 3.6], [400, 4.4]] },
          { name: "actual human quality (β=0)", color: "#ff7b72", points: [[0, 0.50], [50, 0.62], [100, 0.68], [150, 0.60], [200, 0.45], [250, 0.30], [300, 0.18], [350, 0.10], [400, 0.06]] },
          { name: "actual human quality (β>0, KL leash on)", color: "#7ee787", points: [[0, 0.50], [50, 0.63], [100, 0.71], [150, 0.76], [200, 0.79], [250, 0.81], [300, 0.82], [350, 0.83], [400, 0.83]] }
        ],
        interpret: "<b>Illustrative shapes.</b> Same reward-hacking pattern, now in alignment. Without the KL penalty (β=0) the policy is free to drift arbitrarily far from the reference model, so it finds adversarial text that the imperfect reward model scores ever higher -- orange climbs without limit. <b>But that score is a proxy:</b> real human-judged quality (red) rises briefly, peaks, then crashes as the outputs become off-distribution gibberish that merely fools r_phi. <b>Compare the green line:</b> with the KL leash on (β&gt;0), the policy stays anchored near the reference, so quality rises and PLATEAUS at a good level instead of collapsing. <b>Conclude:</b> an ever-rising reward-model score is not success -- if the held-out quality curve peaks and falls, the leash is too loose; raise β."
      }
    ],
    caption: "Read training curves by comparing the metric you OPTIMISED against a held-out measure of the goal you MEANT. The ideal panel shows honest shaping: same optimum, just faster. The two variants show the headline failure -- reward hacking -- in both classic RL (proxy score soars, true objective crashes: the boat-race loop) and RLHF (drop the KL leash and the reward-model score runs away while human quality collapses). The fingerprint is always two curves that agree early and DIVERGE; the green curve shows the KL leash preventing it.",
    code: `import numpy as np

# Self-contained 5x5 gridworld, tabular Q-learning, SPARSE vs POTENTIAL-SHAPED reward.
N = 5
START, GOAL = (0, 0), (N - 1, N - 1)
ACTIONS = [(-1, 0), (1, 0), (0, -1), (0, 1)]
gamma, alpha, eps = 0.95, 0.5, 0.3

def step(s, a):
    dr, dc = ACTIONS[a]
    r = min(max(s[0] + dr, 0), N - 1)
    c = min(max(s[1] + dc, 0), N - 1)
    s2 = (r, c)
    return s2, (1.0 if s2 == GOAL else 0.0), (s2 == GOAL)

def potential(s):                      # Phi(s) = -(Manhattan distance to goal)
    return -(abs(s[0] - GOAL[0]) + abs(s[1] - GOAL[1]))

def train(shaped, episodes=400, max_steps=500, seed=0):
    rng = np.random.default_rng(seed)
    Q = np.zeros((N, N, 4))
    steps = []
    for _ in range(episodes):
        s, done, t = START, False, 0
        while not done and t < max_steps:
            a = rng.integers(4) if rng.random() < eps else int(np.argmax(Q[s[0], s[1]]))
            s2, r, done = step(s, a)
            r_train = r + (gamma * potential(s2) - potential(s) if shaped else 0.0)
            target = r_train + (0.0 if done else gamma * np.max(Q[s2[0], s2[1]]))
            Q[s[0], s[1], a] += alpha * (target - Q[s[0], s[1], a])
            s, t = s2, t + 1
        steps.append(t)
    return np.array(steps)

def smooth(x, w=10):                    # 10-episode moving average for a readable curve
    return np.array([x[max(0, i - w + 1):i + 1].mean() for i in range(len(x))])

sparse = smooth(train(shaped=False))
shaped = smooth(train(shaped=True))

# Subsample to <= 60 plotted points for the chart.
idxs = [1,3,5,8,12,16,20,25,30,40,50,65,80,100,130,160,200,260,320,400]
for i in idxs:
    print(f"ep={i:>3}  sparse={sparse[i-1]:6.1f}  shaped={shaped[i-1]:6.1f}")
# ep=  1  sparse= 500.0  shaped=  99.0
# ep=  8  sparse= 500.0  shaped=  21.1
# ep= 12  sparse= 500.0  shaped=  11.2   <- shaped already near the 8-step optimum
# ep=160  sparse= 500.0  shaped=  10.8   <- sparse still hitting the 500-step cap
# ep=200  sparse=  14.7  shaped=  13.4   -> sparse finally found the goal & collapsed
# ep=400  sparse=  14.0  shaped=  10.4   -> SAME 8-step greedy optimum, shaped far sooner`
  };
})();
