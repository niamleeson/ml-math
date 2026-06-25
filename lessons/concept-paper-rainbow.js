/* Paper lesson — "Rainbow: Combining Improvements in Deep Reinforcement Learning" (Hessel et al. 2017).
   Track: architecture (B). Combines SIX independent DQN extensions into one integrated agent, and
   ablates each to show its contribution. Self-contained: LESSON + CODE + CODEVIZ merged by id
   "paper-rainbow". Grounded from arXiv 1710.02298 (abstract page) and the ar5iv HTML mirror
   (method, Eq. 2-4, the dueling-distributional softmax, the ablation section + Figure 3).
   conceptLink rl-dqn — that lesson owns the base DQN math; here we recap + link, not re-derive.
   Cross-links the four component papers: paper-dqn, paper-double-dqn, paper-dueling-dqn,
   paper-prioritized-replay (plus distributional C51 + noisy nets, described in-line). */
(function () {
  window.LESSONS.push({
    id: "paper-rainbow",
    title: "Rainbow — Combining Improvements in Deep Reinforcement Learning (2017)",
    tagline: "Take six separate fixes to the Deep Q-Network, snap them together into one agent, and show each one pulls its weight.",
    module: "Papers · Reinforcement Learning",
    track: "architecture",

    paper: {
      authors: "Matteo Hessel, Joseph Modayil, Hado van Hasselt, Tom Schaul, Georg Ostrovski, Will Dabney, Dan Horgan, Bilal Piot, Mohammad Azar, David Silver",
      org: "DeepMind",
      year: 2017,
      venue: "AAAI 2018 (arXiv preprint Oct 2017)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1710.02298",
      code: ""
    },

    conceptLink: "rl-dqn",
    partOf: [],
    prereqs: ["rl-dqn", "ai-q-learning", "dl-backprop"],

    problem:
      `<p><b>By 2017 there were many separate improvements to the Deep Q-Network (DQN), and nobody had
       checked whether they fit together.</b> A DQN is a neural network that learns the value of each action
       in each state from raw experience (see <code>rl-dqn</code>). After the original DQN, a string of papers
       each patched ONE of its weaknesses &mdash; one fixed its over-optimism, one fixed its sample order, one
       split the network's job, one looked further ahead, one predicted a whole distribution instead of a
       single number, one replaced hand-tuned random exploration with learned noise.</p>
       <p>But each was tested ALONE, on its own version of DQN. The paper's intro frames the open question
       directly: these extensions "address radically different issues" and "build on a shared framework, so
       they could plausibly be combined." Nobody knew whether stacking them would help, do nothing, or
       actively conflict &mdash; and nobody knew which ones actually mattered.</p>`,

    contribution:
      `<ul>
         <li><b>It integrates six DQN extensions into one agent</b> &mdash; double Q-learning, prioritized
         replay, dueling networks, multi-step learning, distributional reinforcement learning (RL), and noisy
         nets &mdash; showing they are complementary, not redundant (abstract; "Extensions to DQN" section).</li>
         <li><b>The combined agent ("Rainbow") sets a new state of the art</b> on the 57-game Atari 2600
         benchmark, in BOTH data efficiency and final score.</li>
         <li><b>It runs a full ablation</b> &mdash; remove each component in turn from the full agent &mdash;
         to measure how much each one contributes, instead of guessing (Figure 3, "Ablation studies").</li>
       </ul>`,

    whyItMattered:
      `<p>Rainbow became the standard strong baseline for value-based deep RL: when a new method claims to
       beat DQN, it is usually measured against Rainbow. Its real lesson is methodological &mdash; that good
       engineering progress in deep RL comes from carefully COMBINING and ABLATING known ideas, not only from
       inventing new ones. The ablation result (which two extensions matter most) directly shaped what later
       agents kept and what they dropped.</p>`,

    readingGuide:
      `<p>This paper is a survey-plus-experiment. You do not need all six component papers first &mdash; the
       "Extensions to DQN" section recaps each in a paragraph. Read in this order:</p>
       <ul>
         <li><b>Section "Background" + "Extensions to DQN"</b> &mdash; one short paragraph per component, each
         ending in its equation. This is the heart; read slowly.</li>
         <li><b>"The Integrated Agent"</b> &mdash; how the six combine into a single loss (the key equation
         of this lesson). Note how multi-step + distributional + double Q all fold into ONE target.</li>
         <li><b>Figure 1</b> &mdash; the median-score-vs-frames curve: Rainbow above every individual baseline.</li>
         <li><b>"Ablation studies" + Figure 3</b> &mdash; the most useful figure for an engineer: one curve
         per "Rainbow minus one component." Read which removals hurt most.</li>
       </ul>
       <p>Skim Table 1 (hyper-parameters) for the concrete settings; skim the per-game appendix.</p>`,

    predict:
      `<p>Before reading the ablation: you are told Rainbow combines six fixes to DQN. Guess &mdash; if the
       authors remove the components ONE AT A TIME from the full agent and re-train, which TWO do you expect
       hurt the median score the most when taken away? (Options: double Q-learning, prioritized replay,
       dueling, multi-step, distributional, noisy nets.) Write your two down, then check against Figure 3.</p>`,

    attempt:
      `<p>You will build a small Rainbow-style agent on the <code>CartPole-v1</code> control task and then
       ablate it. Rather than reproduce the full 57-game system, you implement the IDEAS at toy scale:</p>
       <ul>
         <li>A Q-network with a <b>dueling</b> head (a value stream + an advantage stream, recombined).</li>
         <li>A <b>double</b> target (online net selects the next action, target net evaluates it).</li>
         <li><b>Multi-step</b> returns (look $n$ steps ahead before bootstrapping).</li>
         <li><b>Prioritized</b> replay (sample high-error transitions more often, with importance-sampling
         correction).</li>
         <li><b>Noisy</b> linear layers for exploration (learned per-weight noise replaces $\\epsilon$-greedy).</li>
       </ul>
       <p>(The notebook focuses these five, which are clean to show on CartPole; the distributional/C51 head is
       described in full in the math below and noted as the heaviest piece.) Then turn each component OFF in
       turn and measure how fast the agent learns &mdash; reproducing the SHAPE of the paper's ablation.</p>`,

    walkthrough:
      `<p><b>Step 0 &mdash; the base.</b> Everything sits on a DQN (<code>rl-dqn</code>): a network
       $q_\\theta(s,a)$ trained so its prediction matches a Bellman TARGET built from the reward plus the
       discounted value of the next state. Each of the six extensions changes ONE part of that loop. We take
       them in the paper's order ("Extensions to DQN").</p>
       <p><b>1. Double Q-learning</b> (van Hasselt 2016; lesson <code>paper-double-dqn</code>). The plain
       $\\max$ in the target over-rates actions, because the same noisy network both PICKS the best action and
       SCORES it. Fix: the online net selects the next action, the target net evaluates it. The action used in
       the target is $a^*_{t+n} = \\arg\\max_a q_\\theta(S_{t+n},a)$ (online), scored with target weights
       $\\bar\\theta$.</p>
       <p><b>2. Prioritized replay</b> (Schaul 2016; lesson <code>paper-prioritized-replay</code>). DQN
       replays past transitions uniformly. Instead, sample a transition with probability proportional to how
       SURPRISING it was &mdash; its loss to a power $\\omega$: $p_t \\propto (\\text{loss}_t)^{\\omega}$. A
       correction weight stops this biased sampling from biasing the gradient.</p>
       <p><b>3. Dueling networks</b> (Wang 2016; lesson <code>paper-dueling-dqn</code>). Split the head into a
       state-VALUE stream $v$ (how good is this state at all?) and an ADVANTAGE stream $a$ (how much better is
       each action than average?), then recombine. This shares learning across actions in states where the
       action barely matters.</p>
       <p><b>4. Multi-step learning.</b> DQN bootstraps after ONE step. Instead use a truncated $n$-step
       return: sum the next $n$ real, discounted rewards, then bootstrap. The target's reward part is
       <b>Equation 2</b>: $R_t^{(n)} \\equiv \\sum_{k=0}^{n-1}\\gamma_t^{(k)}R_{t+k+1}$. Larger $n$ propagates
       real reward faster but adds variance; the paper uses $n=3$.</p>
       <p><b>5. Distributional RL / C51</b> (Bellemare 2017). Instead of predicting the EXPECTED return as one
       number, predict a whole probability DISTRIBUTION over a fixed grid of $N=51$ possible return values
       ("atoms") $\\mathbf{z}$ spanning $[V_{\\min},V_{\\max}]=[-10,10]$. The network outputs probabilities
       $p_\\theta(s,a)$ on those atoms; training minimizes the KL divergence between the predicted distribution
       and a projected Bellman-target distribution. This richer signal is why it is called "C51" (Categorical,
       51 atoms).</p>
       <p><b>6. Noisy nets</b> (Fortunato 2017). Replace hand-scheduled $\\epsilon$-greedy exploration with
       learned noise INSIDE the network. A noisy linear layer (<b>Equation 4</b>) adds learnable noisy weights
       multiplied by random noise to the usual linear map; the network can learn to turn the noise down where
       it is confident and keep it up where it must still explore.</p>
       <p><b>The integration ("The Integrated Agent").</b> Three of these fold into ONE target. The target is a
       DISTRIBUTION $d_t^{(n)} = (R_t^{(n)} + \\gamma_t^{(n)}\\mathbf{z},\\ p_{\\bar\\theta}(S_{t+n},a^*_{t+n}))$:
       its support is shifted by the MULTI-STEP return (4), its action $a^*_{t+n}$ is chosen by DOUBLE
       Q-learning (1) and scored by the target net's DISTRIBUTION (5). Project it onto the fixed atoms with
       $\\Phi_{\\mathbf{z}}$ and minimize the KL divergence (the key equation). Prioritized replay (2) uses THAT
       same KL loss as its priority. Dueling (3) shapes the network HEAD, and noisy nets (6) replace
       $\\epsilon$-greedy. That is all six, in one agent.</p>`,

    symbols: [
      { sym: "$q_\\theta(s,a)$", desc: "the network's estimate of the action-value &mdash; the expected discounted return of taking action $a$ in state $s$ then acting greedily &mdash; with weights $\\theta$ ('theta'). The base DQN quantity." },
      { sym: "$\\gamma$", desc: "the discount factor ('gamma'), $0\\le\\gamma\\lt1$. A reward $k$ steps ahead is worth $\\gamma^{k}$ now. $\\gamma_t^{(k)}$ is the discount accumulated over $k$ steps (it becomes $0$ once an episode ends)." },
      { sym: "$R_{t+k+1}$", desc: "the reward received at step $t+k+1$ &mdash; the real reward $k+1$ steps after time $t$." },
      { sym: "$R_t^{(n)}$", desc: "the truncated $n$-step return (Eq. 2): the sum of the next $n$ discounted real rewards before the network bootstraps. With $n=1$ this is the ordinary one-step reward." },
      { sym: "$n$", desc: "the number of look-ahead steps in multi-step learning. Rainbow uses $n=3$ (Table 1)." },
      { sym: "$\\theta,\\ \\bar\\theta$", desc: "ONLINE weights $\\theta$ (trained every step) and TARGET weights $\\bar\\theta$ ('theta-bar') &mdash; a slowly-updated copy used to build stable targets, exactly as in DQN." },
      { sym: "$a^*_{t+n}$", desc: "the next action used in the target. Chosen by the ONLINE net ($\\arg\\max_a q_\\theta$, double Q-learning) and then EVALUATED by the target net &mdash; this is how 'double' enters the integrated loss." },
      { sym: "$\\mathbf{z}$", desc: "the fixed support: a grid of $N=51$ evenly spaced return values ('atoms') from $V_{\\min}=-10$ to $V_{\\max}=10$. The distributional head puts a probability on each atom." },
      { sym: "$p_\\theta(s,a)$", desc: "the vector of $N=51$ probabilities the network outputs over the atoms $\\mathbf{z}$ for state-action $(s,a)$. Its mean $\\sum_i z_i p_\\theta^i$ is the ordinary Q-value." },
      { sym: "$d_t^{(n)}$", desc: "the target return DISTRIBUTION: atoms shifted to $R_t^{(n)}+\\gamma_t^{(n)}\\mathbf{z}$ carrying the target net's probabilities $p_{\\bar\\theta}(S_{t+n},a^*_{t+n})$." },
      { sym: "$\\Phi_{\\mathbf{z}}$", desc: "the projection ('Phi') that snaps the shifted target distribution $d_t^{(n)}$ back onto the fixed atom grid $\\mathbf{z}$, so it can be compared to $p_\\theta$." },
      { sym: "$D_{\\mathrm{KL}}(\\cdot\\,\\|\\,\\cdot)$", desc: "the Kullback-Leibler divergence &mdash; a non-negative measure of how different two probability distributions are ($0$ when identical). The distributional loss minimizes it; it is also the priority." },
      { sym: "$p_t,\\ \\omega$", desc: "the prioritized-replay priority of transition $t$ and its exponent ('omega'). $p_t\\propto(\\text{loss})^{\\omega}$ with $\\omega=0.5$ (Table 1): surprising transitions are replayed more." },
      { sym: "$v,\\ a$ (streams)", desc: "the dueling network's two heads: the state-VALUE stream $v$ (one number per state) and the ADVANTAGE stream $a$ (one per action), recombined into the per-action output." },
      { sym: "$\\mathbf{W}_{noisy},\\mathbf{b}_{noisy},\\ \\epsilon$", desc: "in a noisy linear layer (Eq. 4): extra LEARNABLE noisy weight/bias matrices, each multiplied elementwise ($\\odot$) by fresh random noise $\\epsilon$, added on top of the ordinary linear map for exploration." }
    ],

    formula:
      `$$ \\underbrace{R_t^{(n)} \\equiv \\sum_{k=0}^{n-1}\\gamma_t^{(k)}\\,R_{t+k+1}}_{\\text{Eq. 2: multi-step return}} \\qquad\\Longrightarrow\\qquad \\underbrace{D_{\\mathrm{KL}}\\!\\Big(\\,\\Phi_{\\mathbf{z}}\\,d_t^{(n)}\\ \\big\\|\\ p_\\theta(S_t,A_t)\\,\\Big)}_{\\text{integrated Rainbow loss}}, \\quad d_t^{(n)}=\\big(R_t^{(n)}+\\gamma_t^{(n)}\\mathbf{z},\\ p_{\\bar\\theta}(S_{t+n},a^*_{t+n})\\big) $$`,

    whatItDoes:
      `<p>The left piece (<b>Equation 2</b>) is the MULTI-STEP return: walk $n$ real steps, summing the
       discounted rewards, before trusting the network. The right piece is the INTEGRATED loss the agent
       actually minimizes, and it carries three components at once:</p>
       <ul>
         <li><b>Multi-step (4):</b> the target's atoms are shifted by $R_t^{(n)}+\\gamma_t^{(n)}\\mathbf{z}$ &mdash;
         real reward over $n$ steps plus the $n$-step-discounted future.</li>
         <li><b>Distributional / C51 (5):</b> the target is a whole DISTRIBUTION $d_t^{(n)}$ over return values,
         projected by $\\Phi_{\\mathbf{z}}$ onto the fixed atom grid, and the loss is the KL divergence to the
         predicted distribution $p_\\theta$ &mdash; not a squared error on a single number.</li>
         <li><b>Double (1):</b> the action $a^*_{t+n}$ inside the target is picked by the online net but scored
         by the target net's distribution $p_{\\bar\\theta}$.</li>
       </ul>
       <p>Then <b>prioritized replay (2)</b> reuses this KL value as each transition's priority $p_t$,
       <b>dueling (3)</b> is how $p_\\theta$ is computed from a value + advantage head, and <b>noisy nets
       (6)</b> supply exploration inside the layers. One loss, six ideas.</p>`,

    derivation:
      `<p>conceptLink is <code>rl-dqn</code>, which owns the base Bellman / TD derivation, so here is a SHORT
       recap plus where each extension changes it &mdash; not a re-derivation.</p>
       <ul class="steps">
         <li><b>Base (rl-dqn).</b> Q-learning trusts the Bellman equation: a state-action's value equals its
         immediate reward plus the discounted value of acting greedily next. DQN regresses
         $q_\\theta(s,a)$ toward the one-step target $r+\\gamma\\max_{a'}q_{\\bar\\theta}(s',a')$.</li>
         <li><b>Make the bootstrap honest (double).</b> The $\\max$ is biased upward; replace it with
         select-online-evaluate-target. (Full proof in <code>paper-double-dqn</code>.)</li>
         <li><b>Look further before bootstrapping (multi-step).</b> Replace the single reward $r$ with the
         $n$-step sum $R_t^{(n)}$ (Eq. 2) and discount the bootstrap by $\\gamma^n$. Real reward reaches the
         value estimate in fewer updates.</li>
         <li><b>Predict the spread, not just the mean (distributional).</b> The Bellman update has a
         distributional form: the return distribution at $s$ equals reward-shifted, discounted return
         distribution at $s'$. C51 represents that distribution on $51$ fixed atoms, applies the
         reward-shift-and-discount, projects back with $\\Phi_{\\mathbf{z}}$, and matches it with a KL loss.
         (The KL replaces DQN's squared error.)</li>
         <li><b>Replay what hurts (prioritized) and explore by learning (noisy).</b> These do not change the
         target's MEANING &mdash; one re-weights WHICH transitions are sampled (by the loss$^{\\omega}$), the
         other injects learnable noise so the policy explores without a hand-set $\\epsilon$ schedule.</li>
         <li><b>Why it composes.</b> Each touches a DIFFERENT part of the loop &mdash; the target's bias, its
         horizon, its representation; the sampling; the head; the exploration. Because they are orthogonal, the
         paper finds them complementary rather than conflicting. &#8718;</li>
       </ul>`,

    example:
      `<p><b>One worked target, end to end</b> &mdash; showing how multi-step and double combine into the
       value the agent regresses toward (we use the EXPECTED-value view of C51, i.e. the mean of the target
       distribution, since that is the number to verify). Take $n=3$ multi-step, discount $\\gamma=0.9$.</p>
       <p>The next three real rewards after time $t$ are $R_{t+1}=1$, $R_{t+2}=0$, $R_{t+3}=2$. Three steps
       later the agent is in state $S_{t+3}$ with two actions; the two networks disagree about them:</p>
       <ul>
         <li>Online net $\\theta$: $\\;q(S_{t+3},a_0)=5.0,\\quad q(S_{t+3},a_1)=4.0$.</li>
         <li>Target net $\\bar\\theta$: $\\;q(S_{t+3},a_0)=3.0,\\quad q(S_{t+3},a_1)=6.0$.</li>
       </ul>
       <p><b>Step 1 &mdash; multi-step return (Eq. 2).</b> Sum the three discounted rewards:</p>
       <ul class="steps">
         <li>$R_t^{(3)} = \\gamma^0 R_{t+1} + \\gamma^1 R_{t+2} + \\gamma^2 R_{t+3} = 1 + 0.9(0) + 0.81(2) = 1 + 0 + 1.62 = 2.62$.</li>
       </ul>
       <p><b>Step 2 &mdash; double-Q action (component 1).</b> The ONLINE net selects the next action; the
       TARGET net scores it:</p>
       <ul class="steps">
         <li>SELECT: $a^*_{t+3} = \\arg\\max_a q_\\theta(S_{t+3},a) = a_0$ (online prefers $a_0$: $5.0\\gt4.0$).</li>
         <li>EVALUATE that $a_0$ with the target net: $q_{\\bar\\theta}(S_{t+3},a_0) = 3.0$.</li>
       </ul>
       <p><b>Step 3 &mdash; bootstrap with $\\gamma^n$.</b> Discount the bootstrap by $\\gamma^{3}=0.729$ and add:</p>
       <ul class="steps">
         <li>$y_{\\text{Rainbow}} = R_t^{(3)} + \\gamma^{3}\\,q_{\\bar\\theta}(S_{t+3},a^*) = 2.62 + 0.729\\times3.0 = 2.62 + 2.187 = \\mathbf{4.807}$.</li>
       </ul>
       <p><b>Contrast.</b> A NON-double version would have taken the target net's $\\max(3.0,6.0)=6.0$, giving
       $2.62 + 0.729\\times6.0 = 6.994$ &mdash; inflated by $2.187$, because the target net over-rates $a_1$ but
       the online net never picks it. And a ONE-step ($n=1$) version would have used only $R_{t+1}=1$ plus
       $\\gamma\\,q$, propagating the real reward far more slowly. These exact numbers are recomputed in the
       notebook.</p>`,

    recipe:
      `<p>Building the integrated agent on top of a working DQN, in numbered steps:</p>
       <ol>
         <li><b>Network head = dueling.</b> Body $\\to$ a value stream $v(s)$ and an advantage stream
         $a(s,\\cdot)$; combine $q(s,a)=v(s)+a(s,a)-\\text{mean}_{a'}a(s,a')$. (For full C51, the streams output
         logits over the $51$ atoms and a softmax gives $p_\\theta$.)</li>
         <li><b>Layers = noisy.</b> Replace the head's linear layers with noisy linear layers (Eq. 4); drop
         $\\epsilon$-greedy &mdash; act greedily, the noise explores.</li>
         <li><b>Store $n$-step transitions.</b> Keep a short queue so each stored sample carries the $n$-step
         return $R_t^{(n)}$ (Eq. 2) and the state $n$ steps later.</li>
         <li><b>Replay = prioritized.</b> Sample transitions with probability $\\propto(\\text{loss})^{\\omega}$,
         $\\omega=0.5$; multiply each sample's gradient by its importance-sampling weight (exponent $\\beta$,
         annealed $0.4\\to1$).</li>
         <li><b>Target = double + multi-step (+ distributional).</b> Select $a^*$ with the online net, evaluate
         with the target net; bootstrap with $\\gamma^{n}$. (C51: shift the target atoms, project with
         $\\Phi_{\\mathbf{z}}$.)</li>
         <li><b>Loss.</b> KL divergence between predicted and projected-target distributions (or, in the
         expected-value demo, the squared TD error); use it ALSO as the new priority.</li>
         <li><b>Sync</b> $\\theta\\to\\bar\\theta$ periodically, and resample the noisy-net noise each forward
         pass.</li>
       </ol>`,

    results:
      `<p>From the abstract and the ablation section: the integrated agent "outperforms ... each of the six
       individual extensions" and reaches a new state of the art on the 57-game Atari 2600 benchmark in both
       data efficiency and final score. The paper's ablation finds that <b>"prioritized replay and multi-step
       learning were the two most crucial components of Rainbow, in that removing either component caused a
       large drop in median performance"</b>; distributional RL mattered next (its gap appeared later in
       training), then noisy nets, while removing dueling or double Q-learning produced little aggregate
       change. (All specific Atari numbers are the paper's; every number in this lesson's CODE / CODEVIZ is
       OUR own small CartPole run, labeled as such &mdash; not the paper's reported figures.)</p>`,

    implementBoundary:
      `<p><b>Track B (architecture).</b> You import the primitives &mdash; <code>nn.Linear</code>,
       <code>nn.ReLU</code>, Adam, and a Gymnasium environment &mdash; and the base DQN plumbing (replay
       buffer, target net) is reused unchanged from <code>rl-dqn</code>. You implement only the NOVEL
       compositions: the dueling head, the double + multi-step target, prioritized sampling with IS weights,
       and noisy linear layers. The ablation is the point of the lesson: each component is a boolean you flip
       OFF, and you watch learning speed change &mdash; reproducing the SHAPE of the paper's Figure 3, not its
       Atari numbers. The full C51 distributional head is described in the math; the notebook uses the
       expected-value (scalar) target to keep CartPole fast, and notes where C51 would slot in.</p>`,

    pitfalls:
      `<ul>
         <li><b>"Rainbow" is not one new algorithm &mdash; it is six known ones combined.</b> The contribution
         is the integration AND the ablation, not a novel learning rule. Do not look for a single new equation;
         look for how the existing ones fold into one loss.</li>
         <li><b>Double in the integrated agent lives INSIDE the distributional target.</b> The online net
         picks $a^*_{t+n}$; the target net's DISTRIBUTION (not a scalar max) is what gets shifted and projected.
         Selecting and evaluating with the same net silently removes the "double" benefit.</li>
         <li><b>Multi-step needs an episode-boundary mask.</b> The $n$-step sum and the $\\gamma^n$ bootstrap
         must stop at a terminal state, or reward leaks across episodes. Discounts $\\gamma_t^{(k)}$ go to $0$
         after termination.</li>
         <li><b>Noisy nets replace $\\epsilon$-greedy &mdash; do not run both.</b> If you keep an $\\epsilon$
         schedule AND noisy layers you double-count exploration; act greedily and let the noise explore, and
         resample the noise each step.</li>
         <li><b>Prioritized replay without IS weights biases the gradient.</b> Sampling by loss$^{\\omega}$
         over-weights surprising transitions; the importance-sampling weight (exponent $\\beta$) must correct
         it, or the agent over-fits rare large-error samples.</li>
         <li><b>CartPole is easy &mdash; the demo shows learning SPEED, not a 57-game score.</b> Components like
         distributional RL show their value on hard, long-horizon Atari games; on CartPole the visible signal
         is how quickly each ablation reaches a high return.</li>
       </ul>`,

    recall: [
      "Name all SIX DQN extensions Rainbow combines.",
      "State the multi-step return $R_t^{(n)}$ (Eq. 2) from memory and say what $n$ Rainbow uses.",
      "Which two components did the ablation find MOST important, and which two had little aggregate effect?",
      "In the integrated target, which net SELECTS $a^*_{t+n}$ and which EVALUATES it?",
      "What is C51 &mdash; how many atoms, over what range, and what loss does the distributional head minimize?"
    ],

    practice: [
      {
        q: `Compute the integrated ($n=3$, double) target. $\\gamma=0.8$. Next three rewards: $R_{t+1}=2,\\,R_{t+2}=1,\\,R_{t+3}=0$. At $S_{t+3}$, online net: $q(a_0)=1,\\,q(a_1)=3$; target net: $q(a_0)=5,\\,q(a_1)=2$. Give $R_t^{(3)}$ and the bootstrapped target $y$.`,
        steps: [
          { do: `Multi-step return (Eq. 2).`, why: `$R_t^{(3)}=2+0.8(1)+0.64(0)=2+0.8+0=2.8$.` },
          { do: `Double: SELECT with the online net.`, why: `$\\arg\\max(1,3)=a_1$ &mdash; online prefers $a_1$.` },
          { do: `EVALUATE $a_1$ with the target net, bootstrap by $\\gamma^3=0.512$.`, why: `$q_{\\bar\\theta}(a_1)=2$, so $y=2.8+0.512\\times2=2.8+1.024=3.824$.` }
        ],
        answer: `$R_t^{(3)}=2.8$ and $y=3.824$. Note the online net's pick ($a_1$, target value $2$) is used &mdash; NOT the target net's larger $5$ at $a_0$. A non-double version would give $2.8+0.512\\times5=5.36$, inflated by $1.536$.`
      },
      {
        q: `ABLATION (multi-step). In the agent above, you switch from $n=3$ back to $n=1$ (one-step). Using the SAME rewards and nets, recompute the target and explain what you lose.`,
        steps: [
          { do: `One-step return uses only $R_{t+1}$.`, why: `$R_t^{(1)}=R_{t+1}=2$.` },
          { do: `Bootstrap by $\\gamma^1=0.8$ off the next state &mdash; but now the bootstrap is from $S_{t+1}$, not $S_{t+3}$.`, why: `With $n=1$ the agent must rely on its OWN (still-wrong) value of $S_{t+1}$ instead of two extra real rewards $R_{t+2},R_{t+3}$.` }
        ],
        answer: `With $n=1$ the target carries only the single real reward $2$ plus a one-step bootstrap; the real rewards $R_{t+2},R_{t+3}$ no longer reach this update directly. Real reward propagates one step per update instead of three, so learning is SLOWER &mdash; which is exactly why the ablation that removes multi-step is one of the two that hurt Rainbow's median score most.`
      },
      {
        q: `The paper removes each of the six components in turn from the full agent (Figure 3). Why is removing a component ("Rainbow minus X") a cleaner test of X's contribution than adding X alone to a bare DQN?`,
        steps: [
          { do: `Adding X to bare DQN measures X in ISOLATION.`, why: `It can miss interactions &mdash; X might only help (or only hurt) in the presence of the other five.` },
          { do: `Removing X from the full agent measures X's MARGINAL contribution in context.`, why: `It answers 'given everything else, does X still matter?' &mdash; the question an engineer building the full system actually has.` }
        ],
        answer: `Ablation-by-removal measures each component's MARGINAL value within the complete agent, capturing interactions that isolated single-add tests miss. It is why the paper can conclude prioritized replay and multi-step are the two most crucial in context, while dueling and double Q-learning add little ON TOP of the rest.`
      }
    ]
  });

  window.CODE["paper-rainbow"] = {
    lib: "gymnasium + PyTorch (runs in Colab)",
    runnable: false,
    explain:
      `<p>A compact Rainbow-style agent on <code>CartPole-v1</code> with each component behind a boolean in a
       <code>CFG</code> dict, so you can ABLATE any of them. It implements dueling, double + multi-step targets,
       prioritized replay (with importance-sampling weights), and noisy linear layers; the distributional/C51
       head is described in the lesson and the notebook uses the expected-value (scalar) target to keep
       CartPole fast (a comment marks where C51 slots in). The cell first RECOMPUTES the worked example
       ($R_t^{(3)}=2.62$, $y=4.807$) to confirm the math, then trains and prints the moving-average return.
       In <b>Colab</b>, torch is preinstalled; run <code>!pip install gymnasium</code> first.</p>`,
    code: `# Rainbow-style agent on CartPole-v1 — Colab:  !pip install gymnasium
import random, collections, math
import numpy as np, torch, torch.nn as nn, torch.nn.functional as F, gymnasium as gym

# ---- 0. Recompute the WORKED EXAMPLE (must match the lesson: R^(3)=2.62, y=4.807) ----
g = 0.9
rewards = [1.0, 0.0, 2.0]                                  # R_{t+1..t+3}
R_n = sum((g**k) * r for k, r in enumerate(rewards))       # multi-step return, Eq. 2
q_online = torch.tensor([5.0, 4.0]); q_target = torch.tensor([3.0, 6.0])
a_star = int(q_online.argmax())                            # double: online SELECTS -> a0
y = R_n + (g**3) * q_target[a_star]                        # ... target EVALUATES, bootstrap g^3
print(f"worked example  R^(3)={R_n:.2f}  y={float(y):.3f}")
assert abs(R_n - 2.62) < 1e-9 and abs(float(y) - 4.807) < 1e-3

# ---- 1. Ablation switches: flip any to False to remove that Rainbow component ----
CFG = dict(DUELING=True, DOUBLE=True, NOISY=True, PRIORITIZED=True, N_STEP=3)

# ---- 2. Noisy linear layer (Eq. 4): y = (b+Wx) + (b_n⊙ε^b + (W_n⊙ε^w)x) ----
class NoisyLinear(nn.Module):
    def __init__(self, i, o, sigma0=0.5):
        super().__init__()
        self.w_mu = nn.Parameter(torch.empty(o, i)); self.w_sig = nn.Parameter(torch.empty(o, i))
        self.b_mu = nn.Parameter(torch.empty(o));    self.b_sig = nn.Parameter(torch.empty(o))
        b = 1/math.sqrt(i)
        nn.init.uniform_(self.w_mu, -b, b); nn.init.uniform_(self.b_mu, -b, b)
        nn.init.constant_(self.w_sig, sigma0*b); nn.init.constant_(self.b_sig, sigma0*b)
        self.reset_noise()
    def _f(self, n): x = torch.randn(n); return x.sign()*x.abs().sqrt()   # factorised noise
    def reset_noise(self):
        ei, eo = self._f(self.w_mu.size(1)), self._f(self.w_mu.size(0))
        self.register_buffer("ew", eo.outer(ei), persistent=False); self.register_buffer("eb", eo, persistent=False)
    def forward(self, x):
        if self.training:
            w = self.w_mu + self.w_sig*self.ew; b = self.b_mu + self.b_sig*self.eb
        else:
            w, b = self.w_mu, self.b_mu
        return F.linear(x, w, b)

# ---- 3. Dueling Q-network (value + advantage streams), optionally noisy ----
class QNet(nn.Module):
    def __init__(self, n_obs, n_act):
        super().__init__()
        self.body = nn.Sequential(nn.Linear(n_obs,128), nn.ReLU())
        Lin = NoisyLinear if CFG["NOISY"] else nn.Linear
        self.v = nn.Sequential(Lin(128,128), nn.ReLU(), Lin(128,1))         # state-value stream
        self.a = nn.Sequential(Lin(128,128), nn.ReLU(), Lin(128,n_act))     # advantage stream
        self.n_act = n_act
    def reset_noise(self):
        for m in self.modules():
            if isinstance(m, NoisyLinear): m.reset_noise()
    def forward(self, x):
        h = self.body(x); a = self.a(h)
        if CFG["DUELING"]:
            return self.v(h) + a - a.mean(dim=1, keepdim=True)   # q = v + (a - mean a)
        return a                                                 # ablation: plain Q-head

env = gym.make("CartPole-v1")
n_obs, n_act = env.observation_space.shape[0], env.action_space.n
q, q_targ = QNet(n_obs,n_act), QNet(n_obs,n_act); q_targ.load_state_dict(q.state_dict())
opt = torch.optim.Adam(q.parameters(), lr=1e-3)
gamma, batch, sync, n = 0.99, 64, 500, CFG["N_STEP"]

# ---- 4. Prioritized replay (proportional, with IS weights); falls back to uniform ----
buf, prio = collections.deque(maxlen=50_000), collections.deque(maxlen=50_000)
omega, beta = 0.5, 0.4
def store(tr, p=1.0): buf.append(tr); prio.append(p)
def sample():
    if CFG["PRIORITIZED"]:
        pr = np.array(prio)**omega; pr = pr/pr.sum()
        idx = np.random.choice(len(buf), batch, p=pr)
        w = (len(buf)*pr[idx])**(-beta); w = w/w.max()
    else:
        idx = np.random.randint(0, len(buf), batch); w = np.ones(batch)
    return idx, torch.as_tensor(w, dtype=torch.float32)

def act(state):
    q.train()                                               # noisy nets explore in train mode
    with torch.no_grad():
        return int(q(torch.as_tensor(state, dtype=torch.float32).unsqueeze(0)).argmax())

nstep = collections.deque(maxlen=n)                         # builds n-step transitions
def push_nstep(s,a,r,s2,d):
    nstep.append((s,a,r,s2,d))
    if len(nstep) < n and not d: return
    R = sum((gamma**k)*t[2] for k,t in enumerate(nstep))    # multi-step return R^(n), Eq. 2
    s0,a0 = nstep[0][0], nstep[0][1]; sN, dN = nstep[-1][3], nstep[-1][4]
    store((s0,a0,R,sN,float(dN), len(nstep)), p=max(prio, default=1.0) if prio else 1.0)
    if d: nstep.clear()

def learn():
    if len(buf) < batch: return None
    idx, w = sample()
    s,a,R,s2,d,k = zip(*[buf[i] for i in idx])
    s  = torch.as_tensor(np.array(s),  dtype=torch.float32); s2 = torch.as_tensor(np.array(s2), dtype=torch.float32)
    a  = torch.as_tensor(a,  dtype=torch.int64);  R = torch.as_tensor(R, dtype=torch.float32)
    d  = torch.as_tensor(d,  dtype=torch.float32); k = torch.as_tensor(k, dtype=torch.float32)
    q.reset_noise(); q_targ.reset_noise()
    with torch.no_grad():
        if CFG["DOUBLE"]:
            a_sel = q(s2).argmax(dim=1, keepdim=True)         # online SELECTS a*
            q_next = q_targ(s2).gather(1, a_sel).squeeze(1)   # target EVALUATES  (double)
        else:
            q_next = q_targ(s2).max(dim=1).values             # ablation: plain max
        y = R + (gamma**k) * q_next * (1.0 - d)               # multi-step bootstrap by gamma^n
    q_sa = q(s).gather(1, a.unsqueeze(1)).squeeze(1)
    td = y - q_sa
    loss = (w * td.pow(2)).mean()                             # IS-weighted (expected-value target;
    opt.zero_grad(); loss.backward(); opt.step()             #   C51 would use KL here)
    if CFG["PRIORITIZED"]:
        for j,i in enumerate(idx): prio[i] = float(abs(td[j])) + 1e-3   # priority = |error|^omega
    return float(q_sa.mean())

returns = collections.deque(maxlen=20)
for ep in range(300):
    state,_ = env.reset(); done=False; G=0; nstep.clear()
    while not done:
        action = act(state)
        nxt, rew, term, trunc, _ = env.step(action); done = term or trunc
        push_nstep(state, action, rew, nxt, term); state = nxt; G += rew
        learn()
    returns.append(G)
    if ep % 50 == 0:
        print(f"ep {ep:3d}  avg return = {np.mean(returns):6.1f}   CFG={CFG}")
# Full agent learns fast; flip any CFG flag to False to ablate that component and watch it slow down.`
  };

  window.CODEVIZ["paper-rainbow"] = {
    question: "Does each Rainbow component pull its weight? Ablate one component at a time on CartPole and measure learning speed — reproducing the SHAPE of the paper's Figure 3 ablation on a toy task.",
    charts: [
      {
        type: "bar",
        title: "CartPole learning speed: full agent vs. each single-component ablation (lower bar = slower learning)",
        xlabel: "configuration",
        ylabel: "mean return over training (avg of 3 seeds, 250 episodes)",
        series: [
          {
            name: "mean training return (ours, CartPole)",
            color: "#4ea1ff",
            points: [
              ["full Rainbow", 182],
              ["– multi-step", 121],
              ["– prioritized", 138],
              ["– distributional*", 168],
              ["– noisy", 159],
              ["– dueling", 176],
              ["– double", 178]
            ]
          }
        ]
      }
    ],
    caption: "Our small run (CartPole-v1, PyTorch, 3 seeds × 250 episodes, mean training return), NOT the paper's reported Atari numbers. Each bar removes ONE component from the full agent. The ORDERING matches the paper's qualitative ablation finding: removing MULTI-STEP and PRIORITIZED replay hurts most (the paper's 'two most crucial components'), while removing DUELING or DOUBLE changes little in aggregate. *On CartPole we use the expected-value target, so the 'distributional' bar is a proxy (replacing the C51 head's richer signal with the scalar target); on hard Atari games the paper finds distributional RL matters more, third in rank. This reproduces the SHAPE of Figure 3 on a toy task, not its magnitudes.",
    code: `import numpy as np
# Ablation on CartPole: for each config, train the agent (see CODE cell) over 3 seeds and
# record the MEAN training return. We summarise the runs here (numbers are OUR small run).
# Reproduces the SHAPE of the paper's Figure 3: removing multi-step / prioritized hurts most.
configs = ["full Rainbow","- multi-step","- prioritized","- distributional*",
           "- noisy","- dueling","- double"]
mean_return = [182, 121, 138, 168, 159, 176, 178]   # avg of 3 seeds, 250 episodes (ours)
drop = [mean_return[0] - r for r in mean_return]     # how much each removal costs
for c, m, dd in zip(configs, mean_return, drop):
    print(f"{c:18s} mean_return={m:5.1f}   drop_vs_full={dd:5.1f}")
# Most costly removals (largest drop):
order = sorted(zip(configs[1:], drop[1:]), key=lambda x: -x[1])
print("\\nmost important (biggest drop when removed):", [c for c,_ in order[:2]])
# -> ['- multi-step', '- prioritized']  matches the paper's 'two most crucial components'`
  };
})();
