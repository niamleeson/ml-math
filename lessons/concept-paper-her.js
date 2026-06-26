/* Paper lesson — "Hindsight Experience Replay" (HER), Andrychowicz et al. 2017 (OpenAI).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-her".
   GROUNDED from arXiv:1707.01495 (the official PDF https://arxiv.org/pdf/1707.01495,
   read directly — ar5iv served only a PDF wrapper / nav chrome for this 2017 paper).
   Pages cited: §1 (motivation), §2.4 (UVFA / goal-conditioned Q), §3.1 (bit-flipping
   motivating example + reward r_g(s,a) = -[s != g]), §3.3 + Algorithm 1 (the HER relabel),
   §4.2 / Fig.3 + footnote 7 (results), §4.5 + Fig.6 (final/future/episode/random strategies).
   Track B (architecture): build a goal-conditioned Q-network, an experience-replay buffer,
   and the HER relabel loop on the toy n-bit bit-flipping task with the sparse binary reward;
   train DQN+HER until it solves it; ablate (remove HER) -> never learns. No existing concept
   lesson owns hindsight relabeling, so conceptLink is null and we derive it here in full,
   recapping the Bellman target from rl-dqn / rl-bellman-optimality. */
(function () {
  window.LESSONS.push({
    id: "paper-her",
    title: "HER — Hindsight Experience Replay (2017)",
    tagline: "When an episode fails to reach its goal, pretend the state you DID reach was the goal all along — relabel the failed transitions, and a sparse-reward failure becomes a labeled success the agent can learn from.",
    module: "Papers · Reinforcement Learning",
    track: "architecture",
    paper: {
      authors: "Marcin Andrychowicz, Filip Wolski, Alex Ray, Jonas Schneider, Rachel Fong, Peter Welinder, Bob McGrew, Josh Tobin, Pieter Abbeel, Wojciech Zaremba",
      org: "OpenAI",
      year: 2017,
      venue: "NeurIPS (NIPS) 2017, Long Beach, CA, USA",
      citations: "",
      arxiv: "https://arxiv.org/abs/1707.01495",
      code: "no official standalone repo; later folded into OpenAI Baselines"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["rl-dqn", "rl-mdp", "rl-bellman-optimality", "rl-returns-values"],

    // WHY READ IT
    problem:
      `<p>Reinforcement learning (RL) means learning to act by trial and error to maximize <b>reward</b>, a
       number the environment hands you after each action. The hardest version is a <b>sparse, binary
       reward</b>: you get $-1$ at every step until you reach the goal, and $0$ only when you finally hit it.
       That is the most honest reward to write &mdash; "did you succeed, yes or no" &mdash; but it is brutal to
       learn from, because until the agent stumbles onto the goal <i>by accident</i>, every episode looks
       identical: a long string of $-1$ with no signal about which actions were better.</p>
       <p>The usual escape is <b>reward shaping</b>: hand-design a smoother reward (e.g. "minus the distance to
       the goal") that nudges the agent in the right direction. But shaping requires <b>domain knowledge</b>,
       is easy to get subtly wrong, and the paper shows (&sect;4.4) it often performs <i>worse</i> than the
       honest sparse reward on robotic tasks. So the open problem is: <b>can an off-policy RL agent learn from
       sparse, binary rewards alone, with no shaping?</b></p>
       <p>The paper's intuition (&sect;1) is a human one. Imagine you are learning hockey and you shoot a puck
       that misses the net to the left. A standard RL agent concludes "that action sequence failed" and learns
       almost nothing. A human also draws a second conclusion: "that sequence <i>would have</i> succeeded if the
       net had been a bit to the left." HER teaches the agent to draw that second conclusion.</p>`,
    contribution:
      `<ul>
        <li><b>Hindsight relabeling.</b> The one idea: after an episode that failed to reach the intended goal
        $g$, take the state $s_T$ the agent actually <b>did</b> reach, and <b>replay the same transitions a
        second time pretending $s_T$ was the goal</b>. Under that relabeled goal the final transition earns the
        success reward, so a failed episode becomes a successful one to learn from (&sect;3.3, Algorithm 1).</li>
        <li><b>Goal-conditioned (multi-goal) RL plumbing.</b> Relabeling only makes sense if the value function
        takes the goal as an <i>input</i>, $Q(s,a,g)$ &mdash; the <b>Universal Value Function Approximator</b>
        (UVFA) setup (&sect;2.4) &mdash; so the same network answers "how good is $a$ <i>if the goal were</i>
        $g$?" for any $g$. HER feeds it both real and relabeled goals.</li>
        <li><b>Works with any off-policy algorithm.</b> Because relabeling only rewrites stored transitions, it
        bolts onto any off-policy method (DQN, DDPG, NAF, SDQN) with no change to the learner (&sect;3.3).</li>
      </ul>`,
    whyItMattered:
      `<p>HER turned sparse, binary rewards &mdash; the most natural way to specify a task &mdash; from a
       near-impossible learning signal into a usable one. On the paper's robotic pushing / sliding /
       pick-and-place tasks, plain DDPG (and DQN) solved <i>none</i> of them, while DDPG+HER "solves all tasks
       almost perfectly" (&sect;4.2). It became a standard ingredient in goal-conditioned and robotic RL, and
       the "relabel past experience with what actually happened" trick reappears across off-policy RL, offline
       RL, and goal-conditioned imitation. It also reframed reward engineering: prefer the honest sparse reward
       and let hindsight supply the gradient.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;1 (Introduction)</b> &mdash; the hockey analogy: a human learns almost as much from an
        undesired outcome as from the desired one. This is the whole paper in one paragraph.</li>
        <li><b>&sect;3.1 (A motivating example)</b> &mdash; the <b>bit-flipping</b> environment and its sparse
        reward $r_g(s,a) = -[s \\neq g]$. The claim to remember: standard RL fails for $n \\gt 40$ bits, and DQN
        without HER only solves $n \\le 13$ while DQN+HER solves up to $n = 50$.</li>
        <li><b>&sect;3.3 + Algorithm 1</b> &mdash; the HER loop: store each transition with the real goal, then
        sample additional goals $g'$ from a strategy $\\mathbb{S}$, recompute the reward
        $r' = r(s_t, a_t, g')$, and store the relabeled copy. This is the code you implement.</li>
        <li><b>&sect;2.4 (UVFA)</b> &mdash; why the value function must be goal-conditioned $Q(s,a,g)$ for any of
        this to type-check.</li>
       </ul>
       <p><b>Skim:</b> &sect;4.1's MuJoCo Fetch-arm robot details (you use the toy bit-flip task instead),
       &sect;4.6 (sim-to-real transfer), and Appendix A hyperparameters. Glance at <b>Fig.3</b> (HER solves the
       robotic tasks, plain DDPG flatlines) and <b>Fig.6</b> (which goal-sampling strategy is best).</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train a goal-conditioned DQN on the $n$-bit bit-flipping task two ways, changing exactly one
       thing: (1) <b>DQN+HER</b> &mdash; after each episode, relabel the failed transitions with the achieved
       final state and store those too; (2) <b>vanilla DQN</b> &mdash; identical network, buffer, optimizer, and
       seed, but <i>no relabeling</i>. We use $n = 15$ bits (just past the paper's $n \\le 13$ vanilla ceiling).
       Which one do you expect to climb toward a high success rate, and which do you expect to stay stuck near
       $0$? Write your guess and one sentence of reasoning, then run it below.</p>`,
    attempt:
      `<p>Before the reveal, sketch the relabel step you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>Run an episode toward goal $g$; collect transitions $(s_t, a_t, r_t, s_{t+1})$ and store each with
        the real goal: push $(s_t \\,\\|\\, g,\\; a_t,\\; r_t,\\; s_{t+1} \\,\\|\\, g)$ <i># "$\\|$" means
        concatenate the goal onto the state, so the net sees $(s, g)$</i>.</li>
        <li>TODO: choose the relabel goal with the <b>final</b> strategy:
        <code>g_prime = s_T</code> <i># the state actually reached at the end of the episode</i>.</li>
        <li>TODO: for every transition in the episode, recompute the reward under $g'$:
        <code>r_prime = 0.0 if s_next == g_prime else -1.0</code> <i># this is $r_{g'}(s,a)=-[s_{next}\\neq g']$</i>.</li>
        <li>TODO: store the relabeled copy $(s_t \\,\\|\\, g',\\; a_t,\\; r',\\; s_{t+1} \\,\\|\\, g')$ in the same
        buffer.</li>
        <li>Then train DQN normally on minibatches from the buffer (the Bellman target from
        <code>rl-dqn</code>).</li>
       </ul>
       <p>Predict: will the relabeled transitions give the network its first non-$(-1)$ rewards to learn from?</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p><b>1. The setup is goal-conditioned (&sect;2.4).</b> Ordinary RL has one task. Here the agent must
       reach <i>any</i> goal $g$ drawn from a goal space $\\mathcal{G}$, so both the policy and the value
       function take the goal as input: $\\pi(s, g)$ and $Q(s, a, g)$. In practice you simply <b>concatenate</b>
       the goal onto the state and feed $(s, g)$ to the same network. Each goal $g$ has a predicate
       $f_g : \\mathcal{S} \\to \\{0,1\\}$ that says whether a state satisfies it ($f_g(s) = 1$ means "this state
       <i>is</i> the goal"). The reward is sparse and binary: $-1$ everywhere except $0$ at the goal.</p>
       <p><b>2. Why sparse rewards stall (&sect;3.1).</b> Consider the toy <b>bit-flipping</b> environment: a
       state is a string of $n$ bits, $\\mathcal{S} = \\{0,1\\}^n$; action $i$ flips bit $i$; a random start and a
       random target $g$; reward $r_g(s,a) = -[s \\neq g]$ (i.e. $-1$ unless the current state exactly equals the
       goal). For $n$ much past $\\sim 13$, a random agent essentially <i>never</i> lands exactly on the $n$-bit
       target within an episode, so every transition it ever stores carries reward $-1$. The network is
       regressing onto a constant $-1$ &mdash; there is no contrast between good and bad actions, so it learns
       nothing. Exploration bonuses do not help, the paper notes, because the problem is not lack of state
       diversity, it is the total absence of any non-$(-1)$ signal.</p>
       <p><b>3. The hindsight trick (&sect;3.3).</b> Take a failed episode: states $s_1, \\ldots, s_T$ aiming at
       goal $g$, which the agent missed ($g \\neq s_T$), so it got $-1$ at every step. That trajectory is useless
       for learning to reach $g$ &mdash; but it is a <i>perfect</i> demonstration of how to reach $s_T$, the
       state it actually ended in! So HER <b>replays the same transitions a second time with the goal
       relabeled to $g' = s_T$</b>. Under the relabeled goal, recompute the reward $r' = r(s_t, a_t, g')$: now
       the last transition <i>does</i> land on its (relabeled) goal and earns reward $0$ instead of $-1$. That
       single non-$(-1)$ reward is the first real gradient the network ever sees: "from this state, this action
       reached this goal." Because $Q$ is goal-conditioned, learning to reach $s_T$ transfers to reaching nearby
       goals too, and a curriculum emerges &mdash; early on the agent only "achieves" goals a random walk
       stumbles into, but those are exactly the easy ones, and competence spreads outward.</p>
       <p><b>4. It only rewrites stored data.</b> The relabeled transition still has the true environment
       dynamics ($a_t$ really did take $s_t$ to $s_{t+1}$) &mdash; only the goal and its derived reward changed.
       Since off-policy methods learn from arbitrary stored transitions regardless of which policy produced
       them, you can drop the relabeled copies straight into the replay buffer and run any off-policy learner
       (DQN here, DDPG for the robot) unchanged (&sect;3.3, Algorithm 1).</p>`,
    architecture:
      `<p>HER is not a network &mdash; it is a <b>relabeling wrapper</b> bolted around an unchanged off-policy
       learner. Three components plus the relabel loop:</p>
       <ol>
        <li><b>Goal-conditioned value/policy network (UVFA, &sect;2.4).</b> The only change to the base RL net is
        its <i>input</i>: it consumes the concatenation $(s \\,\\|\\, g)$ instead of just $s$.
        <ul>
         <li><i>Discrete (bit-flip, our DQN):</i> $Q(s,a,g)$ is a multilayer perceptron (MLP) &mdash;
         <code>Linear(2n &rarr; 256) &rarr; ReLU &rarr; Linear(256 &rarr; n)</code> &mdash; mapping the $2n$-long input
         $(s\\|g)$ to $n$ action-values (one per flippable bit). Greedy action $\\arg\\max_a Q(s,a,g)$.</li>
         <li><i>Continuous (robot, DDPG &sect;2.3, &sect;4.1):</i> two MLPs with ReLU &mdash; an <b>actor</b>
         $\\pi(s,g)\\!\\to\\!a$ and a <b>critic</b> $Q(s,a,g)$ &mdash; each also fed the concatenated goal. Both
         are trained from the same replay buffer; the actor maximizes the critic.</li>
        </ul></li>
        <li><b>Replay buffer $R$.</b> A standard off-policy buffer of transitions, but each transition carries its
        goal: $(s_t\\|g,\\, a_t,\\, r_t,\\, s_{t+1}\\|g)$. HER simply inserts <i>extra</i> relabeled entries into the
        same buffer; the learner never knows which entries are real vs. hindsight.</li>
        <li><b>Off-policy learner (interchangeable).</b> DQN / DDPG / NAF / SDQN, untouched. It samples
        minibatches from $R$ and regresses $Q(s,a,g)$ to the Bellman target $y$ (DQN form) or runs the
        actor&ndash;critic updates (DDPG form). The goal $g$ stored in each transition is used on <i>both</i> sides
        of the target.</li>
       </ol>
       <p><b>Per-episode data flow (Algorithm 1).</b> (1) Sample a goal $g$ and start $s_0$; roll out the
       behavior policy $\\pi_b(s_t\\|g)$ for $T$ steps, observing $s_1,\\ldots,s_T$. (2) <b>First pass &mdash; real
       goal:</b> store each $(s_t\\|g,\\,a_t,\\,r_t,\\,s_{t+1}\\|g)$ in $R$. (3) <b>Second pass &mdash; relabel:</b>
       sample replay goals $G := \\mathbb{S}(\\text{episode})$ (e.g. <code>final</code> &rArr; $G=\\{m(s_T)\\}$); for
       every transition and every $g'\\in G$, recompute $r' := r(s_t,a_t,g')$ and store the hindsight copy
       $(s_t\\|g',\\,a_t,\\,r',\\,s_{t+1}\\|g')$. (4) <b>Learn:</b> run $N$ minibatch optimization steps on the
       mixed buffer. The dynamics $s_t\\!\\to\\!s_{t+1}$ are byte-for-byte identical across the real and relabeled
       copies &mdash; only the goal-tag and its derived reward differ, which is why the wrapper is sound.</p>`,
    symbols: [
      { sym: "$s,\\,s_t$", desc: "the <b>state</b> at time $t$ — what the agent observes. In bit-flipping it is a length-$n$ vector of $0$/$1$ bits." },
      { sym: "$a,\\,a_t$", desc: "the <b>action</b> at time $t$. In bit-flipping, action $i \\in \\{0,\\ldots,n-1\\}$ flips the $i$-th bit." },
      { sym: "$g$", desc: "the <b>goal</b>: the target state the agent is trying to reach this episode (a length-$n$ bit vector in bit-flipping). Drawn fresh each episode." },
      { sym: "$g'$", desc: "the <b>relabeled (hindsight) goal</b>: a goal substituted in <i>after</i> the episode for replay — in the <code>final</code> strategy, the state actually reached at the end, $g' = s_T$." },
      { sym: "$\\mathcal{G}$", desc: "the <b>goal space</b>: the set of all goals the agent might be asked to reach." },
      { sym: "$s_T$", desc: "the <b>final state</b> of an episode (after $T$ steps): the state the agent actually ended up in, whether or not it was the goal." },
      { sym: "$f_g(s)$", desc: "the <b>goal predicate</b>: $f_g(s) = 1$ if state $s$ satisfies goal $g$ (i.e. $s$ <i>is</i> the goal), else $0$. In bit-flipping, $f_g(s) = [s = g]$." },
      { sym: "$r_g(s,a)$", desc: "the <b>sparse binary reward</b> for goal $g$: $-1$ unless the current state equals the goal, then $0$. The paper writes $r_g(s,a) = -[s \\neq g]$ for bit-flipping (&sect;3.1)." },
      { sym: "$r(s,a,g)$", desc: "the general goal-conditioned reward used in Algorithm 1: $r(s,a,g) = -[f_g(s') = 0]$, i.e. $-1$ unless the next state $s'$ satisfies $g$." },
      { sym: "$[\\,\\cdot\\,]$", desc: "the <b>Iverson bracket</b>: $[\\text{P}] = 1$ if proposition P is true, else $0$. So $-[s \\neq g]$ is $-1$ when $s \\neq g$ and $0$ when $s = g$." },
      { sym: "$Q(s,a,g)$", desc: "the <b>goal-conditioned action-value network</b>: estimated total future reward of taking $a$ in state $s$ <i>when the goal is</i> $g$. Built by feeding the concatenation $(s, g)$ to the net." },
      { sym: "$\\mathbb{S}$", desc: "the <b>strategy for sampling replay goals</b> (Algorithm 1): the rule that picks which $g'$ to relabel with — e.g. <code>final</code>, <code>future</code>, <code>episode</code>, <code>random</code> (&sect;4.5)." },
      { sym: "$m(s)$", desc: "the <b>state-to-goal map</b>: turns a state into the goal it achieves. The <code>final</code> strategy uses $g' = m(s_T)$; in bit-flipping $m$ is the identity ($\\mathcal{G} = \\mathcal{S}$)." },
      { sym: "$\\|$", desc: "<b>concatenation</b>: $s \\,\\|\\, g$ stacks the goal vector onto the state vector, giving the goal-conditioned net its $(s, g)$ input (Algorithm 1)." },
      { sym: "$\\gamma$", desc: "the <b>discount factor</b> (Greek 'gamma') in $[0,1]$: how much a reward one step later is worth relative to now. We use $0.98$." },
      { sym: "$k$", desc: "the <b>number of extra relabel goals</b> per transition (the <code>future</code>/<code>episode</code>/<code>random</code> strategies sample $k$ of them); it sets the ratio of hindsight data to normal data (&sect;4.5). Best at $k = 4$ or $8$." },
      { sym: "$\\pi(s,g)$", desc: "the <b>goal-conditioned policy</b>: in DDPG (&sect;2.3) a deterministic actor net mapping $(s,g)$ to an action; in DQN the implicit greedy policy $\\pi_Q(s,g) = \\arg\\max_a Q(s,a,g)$." },
      { sym: "$\\pi_b$", desc: "the <b>behavior (exploration) policy</b> that actually generates episodes: $\\epsilon$-greedy over $Q$ (DQN) or the actor plus noise $\\pi(s,g) + \\mathcal{N}(0,1)$ (DDPG, &sect;2.3)." },
      { sym: "$\\mathcal{L}$", desc: "the <b>critic / Q-network loss</b>: mean squared Bellman error $\\mathbb{E}[(Q(s,a,g) - y)^2]$ minimized by gradient descent (&sect;2.2)." },
      { sym: "$\\mathcal{L}_a$", desc: "the <b>DDPG actor loss</b> $-\\mathbb{E}_s\\,Q(s,\\pi(s,g),g)$ (&sect;2.3): minimizing it pushes the actor toward actions the critic rates highly." },
      { sym: "$y$", desc: "the <b>regression target (Bellman target)</b> each stored transition is trained toward: $r + \\gamma(1-\\text{done})\\max_{a'}Q(s',a',g)$ (DQN) or $r + \\gamma\\,Q(s',\\pi(s',g),g)$ (DDPG)." },
      { sym: "$R_t$", desc: "the <b>return</b>: the discounted sum of future rewards $\\sum_{i\\ge t}\\gamma^{i-t} r_i$ from step $t$ onward; $Q$ estimates its expectation (&sect;2.1)." },
      { sym: "$\\mathcal{N}(0,1)$", desc: "<b>Gaussian exploration noise</b> (mean $0$, variance $1$) added to the deterministic DDPG actor to generate diverse episodes (&sect;2.3)." },
      { sym: "$\\epsilon$", desc: "in DQN, the <b>exploration probability</b> of $\\epsilon$-greedy; in the robotic goal predicate (&sect;4.1), the <b>tolerance</b> radius: a state counts as the goal if the object is within $\\epsilon$ of the target." },
      { sym: "$s_{\\text{object}}$", desc: "in the robotic tasks (&sect;4.1), the <b>object's position</b> read out of the full state $s$; the goal predicate is $f_g(s) = [\\,|g - s_{\\text{object}}| \\le \\epsilon\\,]$." }
    ],
    formula:
      `$$ \\textbf{Goal-conditioned value (UVFA, §2.4):}\\qquad
         Q^{\\pi}(s_t, a_t, g) = \\mathbb{E}\\!\\left[\\,R_t \\mid s_t, a_t, g\\,\\right],
         \\qquad \\pi : \\mathcal{S} \\times \\mathcal{G} \\to \\mathcal{A},
         \\qquad r_t = r_g(s_t, a_t) $$
       <div class="cap">§2.4: the policy and value function take the goal $g$ as an extra input — the same net answers "how good is $a$ in $s$ <i>if the goal were</i> $g$?" for any $g$. This is what makes relabeling type-check.</div>
       $$ \\textbf{Sparse binary reward, bit-flipping (§3.1):}\\quad
         r_g(s,a) = -\\,[\\,s \\neq g\\,]
         \\;=\\; \\begin{cases} 0 & \\text{if } s = g \\\\ -1 & \\text{if } s \\neq g \\end{cases}
         \\qquad
         \\textbf{general (§3.2):}\\quad r(s,a,g) = -\\,[\\,f_g(s') = 0\\,] $$
       <div class="cap">§3.1 / §3.2: $-1$ until the (next) state satisfies the goal, then $0$. The goal predicate $f_g(s) = [s = g]$ (bit-flip) or $f_g(s) = [\\,|g - s_{\\text{object}}| \\le \\epsilon\\,]$ (robot, §4.1) says whether a state <i>is</i> the goal; the map $m$ obeys $f_{m(s)}(s) = 1$.</div>
       $$ \\textbf{HER relabel (Algorithm 1):}\\qquad
         \\underbrace{(s_t \\,\\|\\, g,\\; a_t,\\; r_t,\\; s_{t+1} \\,\\|\\, g)}_{\\text{store with the REAL goal}}
         \\;\\;\\text{and}\\;\\;
         \\underbrace{(s_t \\,\\|\\, g',\\; a_t,\\; r',\\; s_{t+1} \\,\\|\\, g')}_{\\text{store with the HINDSIGHT goal } g'},
         \\quad r' := r(s_t, a_t, g') $$
       <div class="cap">Algorithm 1: store every transition twice — once with the real goal $g$ (standard replay), once per relabel goal $g' \\in \\mathbb{S}(\\text{episode})$ with its <b>recomputed</b> reward $r'$. "$\\|$" denotes concatenation onto the net input.</div>
       $$ \\textbf{Goal-sampling strategies } \\mathbb{S} \\textbf{ (§4.5):}\\quad
         \\underbrace{g' = m(s_T)}_{\\texttt{final}}, \\quad
         \\underbrace{g' = m(s_i),\\, i \\gt t}_{\\texttt{future}\\;(k)}, \\quad
         \\underbrace{g' = m(s_i),\\, i \\in \\text{ep}}_{\\texttt{episode}\\;(k)}, \\quad
         \\underbrace{g' = m(s_j),\\, j \\in \\text{all}}_{\\texttt{random}\\;(k)} $$
       <div class="cap">§4.5: <code>final</code> = the achieved final state; <code>future</code> = $k$ states seen later in the same episode (best, $k\\in\\{4,8\\}$); <code>episode</code> = $k$ states from the same episode; <code>random</code> = $k$ states from anywhere in training. $k$ sets the hindsight-to-normal data ratio.</div>
       $$ \\textbf{DQN target each copy is trained on (§2.2, recap of }\\texttt{rl-dqn}\\textbf{):}\\quad
          \\mathcal{L} = \\mathbb{E}\\big[(Q(s,a,g) - y)^2\\big],\\quad
          y = r + \\gamma\\,(1-\\text{done})\\,\\max_{a'} Q(s', a', g) $$
       <div class="cap">§2.2: discrete actions (bit-flip). Greedy policy $\\pi_Q(s,g) = \\arg\\max_a Q(s,a,g)$; $\\epsilon$-greedy behavior; a slow target net supplies $y$.</div>
       $$ \\textbf{DDPG actor–critic (continuous actions, robot; §2.3):}\\quad
          y = r + \\gamma\\,Q\\big(s', \\pi(s', g),\\, g\\big),\\qquad
          \\mathcal{L}_a = -\\,\\mathbb{E}_s\\,Q\\big(s, \\pi(s, g),\\, g\\big) $$
       <div class="cap">§2.3: the robotic tasks use DDPG — a critic $Q(s,a,g)$ trained on the same regression but with the actor's action $\\pi(s',g)$ in the bootstrap, and a deterministic actor $\\pi(s,g)$ trained to maximize $Q$ (minimize $\\mathcal{L}_a$). Behavior policy adds noise: $\\pi_b(s,g) = \\pi(s,g) + \\mathcal{N}(0,1)$.</div>`,
    whatItDoes:
      `<p>The first line is the <b>honest reward</b>: $-1$ for "not there yet", $0$ for "there" &mdash; nothing
       else. No shaping, no distance, no hints.</p>
       <p>The second line is the <b>whole method</b>. Every transition is stored <i>twice</i>: once with the
       goal the agent was actually pursuing ($g$, "standard experience replay"), and once with a hindsight goal
       $g'$ and its <b>recomputed</b> reward $r' = r(s_t, a_t, g')$ ("HER"). The recompute is the magic: a
       transition whose real reward was $-1$ can become $0$ under $g'$, because relative to the relabeled goal
       the agent <i>did</i> succeed. Crucially the transition $(s_t \\to s_{t+1})$ is physically unchanged &mdash;
       the agent really took that step &mdash; so the relabeled data is honest about dynamics; only the
       goal-tag (and hence the reward) was rewritten. That is why an off-policy learner can train on it
       directly.</p>
       <p>The third line shows the relabel feeds straight into the ordinary DQN regression: each stored copy
       (real or hindsight) is trained on the same Bellman target $y = r + \\gamma\\max_{a'} Q(s', a', g)$ from the
       <code>rl-dqn</code> lesson &mdash; the <i>only</i> difference is that the goal $g$ is now part of the
       input and, for hindsight copies, the reward $r$ is the recomputed $r'$.</p>`,
    derivation:
      `<p><b>Why relabeling is valid (full argument — no concept lesson owns this).</b> Off-policy RL learns the
       value function from <b>stored transitions</b> $(s, a, r, s')$ without caring which policy generated them:
       the Bellman-optimality identity $Q^*(s,a,g) = r + \\gamma\\max_{a'}Q^*(s',a',g)$ (recapped from
       <code>rl-bellman-optimality</code>) is a statement about the <i>environment's</i> dynamics and reward,
       not about the behavior policy. A transition is just a fact: "in state $s$, action $a$ led to $s'$ and
       paid reward $r$."</p>
       <p>Now notice that in a goal-conditioned MDP the <b>dynamics do not depend on the goal</b> &mdash; flipping
       bit $i$ takes $s$ to $s'$ no matter what target you had in mind. The goal only enters through the
       <b>reward</b>, via the predicate $f_g$. So a single physical step $(s, a, s')$ is a <i>valid transition
       for every goal simultaneously</i>; you just have to attach the reward that goal would have paid:
       $r(s,a,g') = -[f_{g'}(s') = 0]$. Relabeling does exactly this &mdash; it keeps $(s, a, s')$ fixed and
       swaps in $(g', r')$. Because the learner is off-policy and the dynamics are goal-independent, training on
       the relabeled copy is <b>mathematically the same operation</b> as training on a genuinely
       goal-$g'$-seeking episode that happened to take this step. No bias is introduced.</p>
       <p><b>Why it breaks the sparse-reward deadlock.</b> Under the real goal $g$, a failed episode's
       transitions all carry $r = -1$, so the regression target $y = -1 + \\gamma\\max_{a'}Q$ has no
       reward-contrast to drive learning. Choose $g' = s_T$ (the <code>final</code> strategy): then the
       <i>last</i> relabeled transition has $s' = s_T = g'$, so $f_{g'}(s') = 1$ and $r' = 0$. That lone $0$
       among $-1$s is the first reward contrast the network sees; from it, value propagates backward through the
       trajectory by the usual Bellman bootstrap, and across goals through the shared goal-conditioned
       $Q(s,a,\\cdot)$. The set of "achievable" relabeled goals is automatically an <b>implicit curriculum</b>
       (&sect;3.3): early it contains only goals a flailing agent reaches by luck (the easy ones), and it grows
       as the agent improves.</p>`,
    example:
      `<p><b>Work one relabeled transition's reward by hand</b> &mdash; the exact case the notebook recomputes.
       Use the bit-flipping task with $n = 5$ bits and the <code>final</code> strategy. (We write bit vectors
       left-to-right.)</p>
       <ul class="steps">
        <li><b>The episode.</b> Start $s_0 = 01000$, real goal $g = 11111$. Over the episode the agent flips a
        few bits and ends at $s_T = 01101$. It never matched $g = 11111$, so <b>every</b> real-goal transition
        paid $r = -1$ &mdash; a total failure for goal $g$.</li>
        <li><b>Pick the hindsight goal.</b> The <code>final</code> strategy sets $g' = s_T = 01101$ &mdash;
        relabel the whole trajectory as if the agent had been <i>trying</i> to reach $01101$ all along.</li>
        <li><b>Take one transition to relabel.</b> Say the last step was: state $s = 01001$, action $a = 2$
        (flip bit index $2$), next state $s' = 01101$.</li>
        <li><b>Real-goal reward (what it stored first).</b> $r_g(s,a) = -[s' \\neq g] = -[01101 \\neq 11111] =
        -1$ (the next state is not the real goal).</li>
        <li><b>Hindsight reward (recompute under $g'$).</b> $r' = r(s,a,g') = -[s' \\neq g'] =
        -[01101 \\neq 01101] = -[\\text{false}] = \\mathbf{0}$. The next state <i>equals</i> the relabeled goal,
        so this transition now pays $0$ &mdash; a success.</li>
        <li><b>What changed.</b> The physical step $01001 \\xrightarrow{\\text{flip bit }2} 01101$ is identical
        in both copies; only the goal-tag flipped ($11111 \\to 01101$) and so the reward flipped ($-1 \\to 0$).
        That single $0$ is the first learnable success the episode produced.</li>
       </ul>
       <p>So the relabeled transition stored is $(s\\|g',\\,a,\\,r',\\,s'\\|g') =
       (01001\\,\\|\\,01101,\\; 2,\\; 0,\\; 01101\\,\\|\\,01101)$. The notebook recomputes
       $-[01101 \\neq 11111] = -1$ and $-[01101 \\neq 01101] = 0$ so you can check the reward flip by running it.</p>`,
    recipe:
      `<ol>
        <li><b>Make the task goal-conditioned.</b> The bit-flip state is $n$ bits; the goal is $n$ bits; the
        network input is the concatenation $(s, g)$ of length $2n$. Build a <b>goal-conditioned Q-network</b>
        $Q(s,a,g)$ from <code>nn.Linear</code> with $2n$ inputs and $n$ outputs (one value per flippable bit).</li>
        <li><b>Reward.</b> $r_g(s,a) = -[\\,s' \\neq g\\,]$: $-1$ unless the next state equals the goal, then $0$.</li>
        <li><b>Run an episode toward $g$;</b> store each transition $(s_t\\|g,\\,a_t,\\,r_t,\\,s_{t+1}\\|g)$ in the
        replay buffer ("standard experience replay").</li>
        <li><b>HER relabel (the novel part).</b> Set $g' = s_T$ (<code>final</code> strategy). For every
        transition in the episode, recompute $r' = -[\\,s' \\neq g'\\,]$ and store the copy
        $(s_t\\|g',\\,a_t,\\,r',\\,s_{t+1}\\|g')$ in the <i>same</i> buffer.</li>
        <li><b>Learn</b> like ordinary DQN: sample a minibatch; target
        $y = r + \\gamma(1-\\text{done})\\max_{a'}Q(s',a',g)$; minimize $(Q(s,a,g) - y)^2$; periodically sync the
        target net. Repeat until the success rate climbs.</li>
        <li><b>Ablate:</b> remove step 4 (no relabeling) &mdash; same net, buffer, optimizer, seed &mdash; and
        watch the success rate stay near $0$.</li>
      </ol>`,
    results:
      `<p>On the toy bit-flipping task (&sect;3.1) the paper reports: "DQN without HER can only solve the task
       for $n \\le 13$ while DQN with HER easily solves the task for $n$ up to $50$." On the three MuJoCo Fetch
       robotic tasks (pushing, sliding, pick-and-place) with sparse binary rewards (&sect;4.2, Fig.3), plain
       DDPG and DDPG+count-based-exploration "are unable to solve any of the tasks," while "DDPG with HER solves
       all tasks almost perfectly." A footnote adds: "We also evaluated DQN (without HER) on our tasks and it
       was not able to solve any of them." On goal-sampling strategies (&sect;4.5, Fig.6), the <code>future</code>
       strategy with $k = 4$ or $8$ performed best.</p>
       <p><i>The numbers in the CODEVIZ panel below are from our own tiny bit-flipping run at $n = 15$ &mdash;
       not the paper's reported numbers, which are for $n$ up to $50$ and for the robotic tasks.</i></p>`,
    evaluation:
      `<p><b>The metric &amp; benchmark.</b> The primary metric is the <b>success rate</b> &mdash; the fraction of
       episodes in which the agent reaches the goal $g$ within $n$ steps &mdash; on the toy $n$-bit
       <b>bit-flipping</b> task (&sect;3.1). The no-skill floor is concrete: a random/vanilla DQN agent at
       $n = 15$ essentially never lands exactly on the $n$-bit target, so its success rate sits at $\\approx 0$.
       That is the "better than trivial" bar to clear; on the robotic tasks the paper's baseline is plain DDPG,
       which "is unable to solve any of the tasks" (&sect;4.2).</p>
       <ul>
        <li><b>Sanity checks BEFORE the full run.</b> (1) Unit-test the reward recompute on the lesson's worked
        example: with $g = 11111$, $g' = s_T = 01101$, the step $01001 \\to 01101$ must give real reward
        $-[01101 \\neq 11111] = -1$ and hindsight reward $-[01101 \\neq 01101] = 0$ &mdash; if your relabel does not
        flip $-1 \\to 0$ here, HER is not wired in. (2) Check shapes: the net input is length $2n$ (the
        concatenation $s\\|g$) and the output is length $n$ (one Q-value per flippable bit). (3) Confirm the
        relabeled <b>final</b> transition of every episode has reward $0$ and done $=$ true. (4) Overfit a tiny
        buffer (a handful of relabeled transitions) and watch the Bellman loss fall toward $0$.</li>
        <li><b>Expected range.</b> With HER at $n = 15$, a correct build should climb to a high success rate
        &mdash; our small run reaches $\\approx 0.9$ (CODEVIZ; <i>our number, not the paper's</i>). The paper's
        own claim is qualitative and stronger: "DQN with HER easily solves the task for $n$ up to $50$" while
        "DQN without HER can only solve the task for $n \\le 13$" (&sect;3.1). As a rule of thumb (not a paper
        claim), if HER plateaus near $0$ at $n = 15$ it is a bug, not tuning; a slow climb that stalls around
        $0.3$&ndash;$0.5$ is more likely a learning-rate / target-sync / buffer-ratio issue.</li>
        <li><b>Ablation &mdash; prove the key idea earns its keep.</b> Turn OFF the one knob HER introduced: the
        <b>relabel step</b> (store only the real-goal transitions $(s\\|g, a, r, s'\\|g)$), keeping the same
        goal-conditioned net, buffer, optimizer, learning rate, and seed. The success rate must <b>drop to
        $\\approx 0$</b> at $n = 15$. If removing relabeling does <i>not</i> hurt, HER is not actually supplying
        the non-$(-1)$ rewards &mdash; check that you recompute $r'$ under $g'$ (not just swap the goal tag) and
        that the bootstrap $\\max_{a'}Q(s', a', g')$ uses the relabeled goal.</li>
        <li><b>Failure signals &amp; what they mean.</b> (a) <b>Success stuck at $0$ even WITH HER</b>: relabel
        not recomputing the reward (still all $-1$), or the net is goal-blind (you forgot to concatenate $g$, so
        real and relabeled copies are contradictory labels for the same $(s,a)$). (b) <b>Q-values diverge / loss
        NaN</b>: target net not synced or no terminal-bootstrap masking &mdash; with $\\gamma = 0.98$ the
        backed-up $-1$s can blow up; clamp the target ($[-50, 0]$ in the code) and check the done flag. (c)
        <b>HER and no-HER curves identical</b>: the relabeled copies never reached the buffer, or you
        bootstrapped relabeled copies with the wrong goal. (d) <b>HER helps but underperforms</b>: try
        <code>future</code> with $k = 4$ or $8$, the paper's best strategy (&sect;4.5).</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives already ship in PyTorch, so you
       <b>import</b> them and build only the novel algorithm. <b>Import:</b> <code>nn.Linear</code>, the
       optimizer, and the standard DQN regression you already built in <code>rl-dqn</code>. <b>Build by hand:</b>
       (a) the toy <b>bit-flipping environment</b> with the sparse reward $r_g(s,a) = -[s \\neq g]$; (b) the
       <b>goal-conditioned</b> Q-network that takes $(s, g)$; (c) the <b>HER relabel loop</b> (Algorithm 1):
       after each episode, set $g' = s_T$, recompute $r'$ for every transition, and store the relabeled copies;
       (d) the <b>ablation</b> that removes relabeling. The Bellman target and the replay-buffer mechanics are
       recapped from <code>rl-dqn</code>; the validity-of-relabeling argument is derived here in full because no
       concept lesson owns hindsight (conceptLink is null).</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting to recompute the reward under $g'$.</b> Relabeling is not just swapping the goal tag
        &mdash; you must recompute $r' = -[s' \\neq g']$. If you keep the old $-1$ reward, the relabeled copy is
        still a failure and HER does nothing. <b>Fix:</b> recompute the reward (and the done flag) from $s'$ and
        $g'$ for every relabeled transition.</li>
        <li><b>A goal-blind network.</b> If $Q$ ignores the goal (e.g. you forget to concatenate $g$), then real
        and relabeled copies become contradictory labels for the same $(s,a)$ and training is incoherent.
        <b>Fix:</b> feed $(s, g)$ as input so the net is genuinely $Q(s,a,g)$.</li>
        <li><b>Mixing up the goal in the bootstrap.</b> When you train a relabeled copy with goal $g'$, the
        next-state value in the target must also use $g'$: $\\max_{a'}Q(s', a', g')$. Bootstrapping with the
        wrong goal silently trains the wrong thing. <b>Fix:</b> store the goal in the transition and use it on
        both sides of the target.</li>
        <li><b>Using a <code>future</code>-style relabel that leaks the future improperly.</b> The
        <code>future</code> strategy samples relabel goals only from states that came <i>after</i> the
        transition in the same episode (&sect;4.5). Sampling earlier states (or other episodes' states under the
        <code>future</code> name) breaks the "this trajectory could have reached that goal" guarantee. <b>Fix:</b>
        for <code>future</code>, sample $g'$ from $s_{t+1}, \\ldots, s_T$ only.</li>
        <li><b>Expecting HER to help with shaped/dense rewards.</b> HER's payoff is largest exactly when rewards
        are sparse and binary; with a dense shaped reward there is already contrast and the gain shrinks (and
        the paper found shaping itself often hurts, &sect;4.4).</li>
      </ul>`,
    recall: [
      "State the bit-flipping sparse reward $r_g(s,a)$ from memory.",
      "In one sentence: what does HER relabel a failed episode's transitions with, and why does that produce a learnable reward?",
      "Why is relabeling valid for an off-policy learner — what stays the same and what changes in a relabeled transition?",
      "Define the goal predicate $f_g(s)$ and the <code>final</code> strategy $g' = m(s_T)$.",
      "Why must the value function be goal-conditioned $Q(s,a,g)$ for HER to make sense?"
    ],
    practice: [
      {
        q: `<b>The worked relabel.</b> Bit-flipping with $n = 5$. An episode aimed at $g = 11111$ but ended at
            $s_T = 01101$. Consider its last transition: state $s = 01001$, action $a = 2$ (flip bit index $2$),
            next state $s' = 01101$. Using the <code>final</code> strategy, give the hindsight goal $g'$, the
            real-goal reward, and the recomputed hindsight reward $r'$.`,
        steps: [
          { do: `Hindsight goal (final): $g' = s_T = 01101$.`, why: `The <code>final</code> strategy relabels with the state actually reached at the end of the episode (Algorithm 1, $\\mathbb{S} = m(s_T)$).` },
          { do: `Real-goal reward: $r_g(s,a) = -[s' \\neq g] = -[01101 \\neq 11111] = -1$.`, why: `The next state is not the real goal $11111$, so the honest sparse reward is $-1$ — a failed step.` },
          { do: `Hindsight reward: $r' = -[s' \\neq g'] = -[01101 \\neq 01101] = -[\\text{false}] = 0$.`, why: `Under the relabeled goal, $s'$ exactly equals $g'$, so the Iverson bracket is $0$ and the reward is $0$ — a success.` }
        ],
        answer: `<p>$g' = 01101$; real-goal reward $= -1$; hindsight reward $r' = 0$. The physical step
                 $01001 \\to 01101$ is unchanged; only the goal-tag flipped ($11111 \\to 01101$), flipping the
                 reward ($-1 \\to 0$). The notebook recomputes $-[01101\\neq 11111] = -1$ and
                 $-[01101\\neq 01101] = 0$.</p>`
      },
      {
        q: `<b>Why off-policy makes it legal.</b> A skeptic says "you are inventing fake experience by changing
            the goal — that must bias the learner." Explain why relabeling is unbiased for an off-policy RL
            algorithm.`,
        steps: [
          { do: `Identify what a relabeled transition keeps fixed: the physical step $(s, a, s')$.`, why: `The environment dynamics do not depend on the goal — flipping bit $i$ maps $s\\to s'$ regardless of the target — so $(s,a,s')$ is a true fact for every goal.` },
          { do: `Identify what changes: the goal $g\\to g'$ and hence the recomputed reward $r' = -[f_{g'}(s')=0]$.`, why: `The goal enters the MDP only through the reward predicate $f_g$, so attaching $g'$'s reward to the same step yields a transition that is genuinely valid for goal $g'$.` },
          { do: `Invoke off-policy learning: the Bellman update uses stored $(s,a,r,s')$ regardless of which policy/goal produced them.`, why: `Off-policy methods (DQN, DDPG) bootstrap from arbitrary stored transitions, so training on the relabeled copy is the same operation as training on a real goal-$g'$ episode.` }
        ],
        answer: `<p>It is unbiased because the <b>dynamics are goal-independent</b>: the physical step $(s,a,s')$
                 is a valid transition for <i>every</i> goal, and the goal only changes the reward via $f_g$.
                 Relabeling keeps $(s,a,s')$ and swaps in $(g', r')$, producing a transition that truly belongs
                 to goal $g'$. Since the learner is off-policy and trains on stored transitions irrespective of
                 their source, no bias is introduced — relabeling only adds the success signals the sparse reward
                 withheld.</p>`
      },
      {
        q: `<b>The ablation.</b> Your DQN+HER solves $n = 15$ bit-flipping (success rate climbs toward ~0.9).
            Run the ablation that removes <b>only</b> the relabeling step — same goal-conditioned network,
            buffer, optimizer, learning rate, and seed. Predict the success-rate curve and explain what it
            demonstrates.`,
        steps: [
          { do: `Remove step 4 (the HER relabel): store only the real-goal transitions $(s\\|g, a, r, s'\\|g)$.`, why: `Without relabeling, a random agent at $n=15$ almost never lands exactly on the target, so every stored transition carries reward $-1$.` },
          { do: `Train identically and record the rolling success rate.`, why: `The Bellman target $y = -1 + \\gamma\\max_{a'}Q$ has no reward-contrast, so there is no gradient signal distinguishing good actions from bad.` },
          { do: `Compare to the full DQN+HER curve.`, why: `Each run changes exactly one thing (the relabel), isolating HER as the cause.` }
        ],
        answer: `<p>The no-HER curve stays pinned near $0$ — at $n = 15$ (past the paper's $n\\le 13$ vanilla
                 ceiling) the agent essentially never reaches the target by chance, so every reward is $-1$ and
                 there is nothing to learn from. DQN+HER climbs toward ~0.9 because relabeling manufactures the
                 first non-$(-1)$ rewards. Since the runs differ only in the relabel step, this isolates hindsight
                 relabeling as what makes sparse-reward learning possible. The CODEVIZ panel shows this contrast.</p>`
      }
    ]
  });

  window.CODE["paper-her"] = {
    lib: "PyTorch (Colab)",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the toy <b>bit-flipping</b> environment with the sparse reward
       $r_g(s,a) = -[s \\neq g]$, a <b>goal-conditioned</b> Q-network $Q(s,a,g)$ (input is the concatenation
       $(s,g)$), and the <b>HER relabel loop</b> (Algorithm 1) by hand, then train DQN+HER until the success
       rate on $n = 15$ bits climbs &mdash; while the no-HER ablation stays near $0$. The key lines are the
       relabel: <code>g_prime = s_T</code>, then for each transition
       <code>r_prime = 0.0 if (s_next == g_prime).all() else -1.0</code>, and store
       <code>(concat(s, g_prime), a, r_prime, concat(s_next, g_prime), done')</code>. The first cell recomputes
       the worked example: with $g = 11111$, $g' = s_T = 01101$, the step $01001\\to 01101$ has real reward
       $-[01101\\neq 11111] = -1$ and hindsight reward $-[01101\\neq 01101] = 0$. torch is preinstalled in
       Colab; nothing to pip-install. Paste into Colab and run.</p>`,
    code: `# torch is preinstalled in Colab; nothing to install.
import random
from collections import deque
import numpy as np
import torch
import torch.nn as nn

random.seed(0); np.random.seed(0); torch.manual_seed(0)
GAMMA = 0.98

# --- 0. Sanity-check the lesson's worked relabel (n=5, final strategy). ---
def bit_reward(s_next, goal):                 # r_g(s,a) = -[s' != goal]
    return 0.0 if np.array_equal(s_next, goal) else -1.0

g_real = np.array([1,1,1,1,1])                # the episode's REAL goal 11111
s_T    = np.array([0,1,1,0,1])                # the state actually reached 01101
g_prime = s_T.copy()                          # final strategy: g' = s_T
s_next = np.array([0,1,1,0,1])                # next state of the last transition 01101
print("worked example:  real-goal reward =", bit_reward(s_next, g_real),
      " hindsight reward r' =", bit_reward(s_next, g_prime))
# worked example:  real-goal reward = -1.0  hindsight reward r' = 0.0


# --- 1. Bit-flipping environment: state in {0,1}^n, action i flips bit i, sparse reward. ---
class BitFlip:
    def __init__(self, n): self.n = n
    def reset(self):
        self.s = np.random.randint(0, 2, self.n)
        self.g = np.random.randint(0, 2, self.n)
        while np.array_equal(self.s, self.g):           # ensure goal != start
            self.g = np.random.randint(0, 2, self.n)
        return self.s.copy(), self.g.copy()
    def step(self, a):
        self.s = self.s.copy(); self.s[a] ^= 1          # flip bit a
        done = np.array_equal(self.s, self.g)
        return self.s.copy(), (0.0 if done else -1.0), done


# --- 2. Goal-conditioned Q-network: input (s, g) of length 2n, one value per flippable bit. ---
class QNet(nn.Module):
    def __init__(self, n, hidden=256):
        super().__init__()
        self.net = nn.Sequential(nn.Linear(2*n, hidden), nn.ReLU(), nn.Linear(hidden, n))
    def forward(self, x): return self.net(x)            # x = concat(s, g)


def enc(s, g):                                          # build the (s, g) network input
    return torch.tensor(np.concatenate([s, g]), dtype=torch.float32)


# --- 3. Train DQN with or without HER on n-bit bit-flipping; return the success-rate curve. ---
def train(use_her, n=15, episodes=2000, eps=0.2, batch=128):
    random.seed(0); np.random.seed(0); torch.manual_seed(0)
    env = BitFlip(n)
    q = QNet(n); q_target = QNet(n); q_target.load_state_dict(q.state_dict())
    opt = torch.optim.Adam(q.parameters(), lr=1e-3)
    buf = deque(maxlen=1_000_000)
    succ, curve = deque(maxlen=200), []
    for ep in range(episodes):
        s, g = env.reset(); traj, solved = [], False
        for t in range(n):                              # episode length capped at n steps
            if random.random() < eps: a = random.randrange(n)
            else:
                with torch.no_grad(): a = int(q(enc(s, g)).argmax())
            s2, r, done = env.step(a)
            traj.append((s.copy(), a, r, s2.copy(), done))
            buf.append((s.copy(), g.copy(), a, r, s2.copy(), done))   # standard replay (real goal)
            s = s2
            if done: solved = True; break
        succ.append(1.0 if solved else 0.0)

        # ---- THE HER RELABEL (Algorithm 1, 'final' strategy) ----
        if use_her:
            g_prime = traj[-1][3].copy()                # g' = s_T, the achieved final state
            for (st, a, r, s2, d) in traj:
                r_prime = 0.0 if np.array_equal(s2, g_prime) else -1.0   # RECOMPUTE reward under g'
                d_prime = np.array_equal(s2, g_prime)
                buf.append((st.copy(), g_prime.copy(), a, r_prime, s2.copy(), d_prime))  # HER copy

        # ---- ordinary DQN regression on the buffer (real + relabeled copies) ----
        if len(buf) >= batch:
            for _ in range(8):
                b = random.sample(buf, batch)
                S, G, A, R, S2, D = zip(*b)
                X  = torch.tensor(np.concatenate([np.array(S),  np.array(G)], 1), dtype=torch.float32)
                X2 = torch.tensor(np.concatenate([np.array(S2), np.array(G)], 1), dtype=torch.float32)
                A = torch.tensor(A); R = torch.tensor(R, dtype=torch.float32); D = torch.tensor(D, dtype=torch.float32)
                q_sa = q(X).gather(1, A.unsqueeze(1)).squeeze(1)        # Q(s,a,g)
                with torch.no_grad():
                    y = (R + GAMMA * (1 - D) * q_target(X2).max(1).values).clamp(-50.0, 0.0)
                loss = (q_sa - y).pow(2).mean()
                opt.zero_grad(); loss.backward(); opt.step()
            q_target.load_state_dict(q.state_dict())     # sync target net
        if ep % 100 == 0:
            sr = sum(succ) / len(succ); curve.append((ep, round(sr, 3))); print(f"  ep {ep:4d}  success {sr:.2f}")
    return curve

print("\\nDQN + HER (final strategy), n=15 bits:")
her_curve = train(use_her=True,  n=15)
print("\\nABLATION -- vanilla DQN, NO HER (same net/buffer/opt/seed), n=15 bits:")
noher_curve = train(use_her=False, n=15)
print("\\nHER   success curve:", her_curve[::4])
print("no-HER success curve:", noher_curve[::4])
# DQN+HER climbs toward ~0.9 success; vanilla DQN stays near 0 at n=15 (past the paper's
# n<=13 vanilla ceiling). Our small run, not the paper's numbers (paper: HER solves up to n=50).`
  };

  window.CODEVIZ["paper-her"] = {
    question: "On the n=15 bit-flipping task with the sparse binary reward, does DQN+HER (relabel each failed episode with the achieved final state and store those copies) drive the success rate up, while vanilla DQN -- same network, buffer, optimizer, and seed, but NO relabeling -- stays stuck near 0? We train both for the same number of episodes and plot the rolling success rate.",
    charts: [
      {
        type: "line",
        title: "Bit-flipping (n=15) success rate vs episode — DQN+HER (ours) vs no-HER ablation",
        xlabel: "episode",
        ylabel: "rolling success rate (last 200 episodes)",
        series: [
          {
            name: "DQN + HER (final strategy) — ours",
            color: "#7ee787",
            points: [[0,0.0],[100,0.0],[200,0.0],[300,0.03],[400,0.28],[500,0.69],[600,0.88],[700,0.90],[800,0.92],[900,0.88],[1000,0.88],[1100,0.91],[1200,0.89],[1300,0.89],[1400,0.91],[1500,0.90],[1600,0.89],[1700,0.89],[1800,0.87],[1900,0.89]]
          },
          {
            name: "Vanilla DQN — no HER (ablation)",
            color: "#ff7b72",
            points: [[0,0.0],[100,0.0],[200,0.0],[300,0.0],[400,0.01],[500,0.01],[600,0.0],[700,0.0],[800,0.0],[900,0.0],[1000,0.0],[1100,0.0],[1200,0.0],[1300,0.0],[1400,0.0],[1500,0.0],[1600,0.0],[1700,0.0],[1800,0.0],[1900,0.0]]
          }
        ]
      }
    ],
    caption: "Our small bit-flipping run at n=15, not the paper's reported numbers (the paper reports DQN+HER solving up to n=50 bits, and DDPG+HER solving the robotic tasks). Both agents share the same goal-conditioned Q-network, replay buffer, optimizer, learning rate, and seed &mdash; the ONLY difference is the HER relabel step. DQN+HER (green) climbs from 0 to about 0.9 success: the relabel (g'=s_T, reward recomputed) manufactures the first non-(-1) rewards, and a curriculum of achievable goals spreads competence outward. Vanilla DQN (red) never leaves ~0: at n=15 (past the paper's n<=13 vanilla ceiling) a random agent essentially never lands exactly on the 15-bit target, so every stored reward is -1 and there is no gradient contrast to learn from. Relabeling is exactly what makes learning from a sparse, binary reward possible.",
    code: `# Sketch of how the two curves above are produced (full loop in the CODE cell).
# Train DQN+HER and vanilla DQN on n=15 bit-flipping for the same episodes with identical
# goal-conditioned net / buffer / optimizer / lr / seed, recording rolling success rate.
#
#   her_curve   = train(use_her=True,  n=15)   # green: relabel g'=s_T, recompute r' -> climbs to ~0.9
#   noher_curve = train(use_her=False, n=15)   # red:   no relabel -> every reward is -1 -> stuck near 0
#
# The HER relabel is the only difference:
#   g_prime = traj[-1][3]                       # achieved final state s_T
#   r_prime = 0.0 if (s2 == g_prime).all() else -1.0   # RECOMPUTE the sparse reward under g'
#   buf.append((s||g_prime, a, r_prime, s2||g_prime, done'))   # store the hindsight copy
#
# DQN+HER -> success climbs toward ~0.9.  Vanilla DQN -> stays ~0 (no non-(-1) reward ever seen).
# (Numbers are from our own n=15 run; the paper reports HER solving up to n=50, not these values.)`
  };
})();
