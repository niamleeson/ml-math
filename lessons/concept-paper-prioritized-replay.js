/* Paper lesson — "Prioritized Experience Replay" (Schaul, Quan, Antonoglou, Silver, 2015/ICLR 2016).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-prioritized-replay".
   GROUNDED from arXiv:1511.05952 (abstract page) and the ar5iv HTML mirror
   (Sec 2 Blind Cliffwalk + Fig 1; Eqn 1; Sec 3.3 priorities; Sec 3.4 IS-weights; Sec 4 results).
   Track B (architecture): build the prioritized replay buffer (proportional priorities + IS-weights)
   on top of a DQN, and show faster learning vs uniform replay. conceptLink null (math owned here). */
(function () {
  window.LESSONS.push({
    id: "paper-prioritized-replay",
    title: "Prioritized Experience Replay — Schaul et al. (2015)",
    tagline: "Replay the transitions you learn most from, not just the ones you happened to see.",
    module: "Papers · Reinforcement Learning",
    track: "architecture",
    paper: {
      authors: "Tom Schaul, John Quan, Ioannis Antonoglou, David Silver",
      org: "Google DeepMind",
      year: 2015,
      venue: "arXiv:1511.05952 (Nov 2015); ICLR 2016",
      citations: "",
      arxiv: "https://arxiv.org/abs/1511.05952",
      code: ""
    },
    conceptLink: null,
    partOf: [
      { capstone: "capstone-dqn", step: 4, builds: "the prioritized replay buffer (priorities + IS-weights) added to the DQN agent" }
    ],
    prereqs: ["rl-dqn", "rl-td-learning", "rl-sarsa-qlearning", "rl-function-approximation", "rl-returns-values", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p>A <b>Deep Q-Network</b> (DQN &mdash; a neural network that estimates the value of each action in a
       state) does not learn from the live stream of experience. Instead it stores every transition it sees
       &mdash; a tuple <code>(state, action, reward, next state)</code> &mdash; in a big buffer called the
       <b>replay memory</b>, then trains by sampling old transitions back out. The original DQN samples them
       <b>uniformly at random</b>: every stored transition is equally likely to be replayed. The paper's
       complaint (&sect;1):</p>
       <blockquote>"this approach simply replays transitions at the same frequency that they were originally
       experienced, regardless of their significance."</blockquote>
       <p>That is wasteful. Most transitions are already well-predicted &mdash; replaying them teaches the
       network almost nothing. A few transitions are <b>surprising</b> (the network's prediction is far off),
       and those carry most of the learning signal. Uniform sampling drowns the rare informative transitions
       in a sea of boring ones, so learning is slow.</p>`,
    contribution:
      `<ul>
        <li><b>Prioritize by surprise.</b> Sample a transition with probability proportional to its
        <b>temporal-difference error</b> (TD-error, written $\\delta$): how far the current value estimate is
        from its one-step bootstrap target. Big $|\\delta|$ = "I got this badly wrong" = replay it more.</li>
        <li><b>A practical priority + sampling rule.</b> Give transition $i$ a priority $p_i = |\\delta_i| +
        \\epsilon$ (a tiny $\\epsilon$ so nothing is ever frozen out), then sample with probability
        $P(i) \\propto p_i^{\\alpha}$, where $\\alpha$ dials how sharply you prioritize ($\\alpha = 0$ recovers
        uniform).</li>
        <li><b>Correct the bias it introduces.</b> Sampling non-uniformly changes the distribution the network
        trains on, which would bias the solution. They fix it with <b>importance-sampling weights</b>
        $w_i = (1/(N\\,P(i)))^{\\beta}$ that down-weight the over-sampled transitions.</li>
      </ul>`,
    whyItMattered:
      `<p>Prioritized replay became a standard ingredient of value-based deep RL. It is one of the components
       combined in <b>Rainbow</b> (which fused several DQN improvements into one agent), and the same "sample
       what surprises you" idea shows up wherever there is a replay buffer. It is the natural fourth upgrade in
       the DQN line you are building &mdash; after the base DQN, Double DQN (which fixes value
       over-estimation), and Dueling DQN (which splits value and advantage), prioritized replay changes
       <i>which</i> transitions you train on.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2 (Motivating example) + Fig. 1</b> &mdash; the <b>"Blind Cliffwalk"</b> toy task. This is
        the cleanest demonstration in the paper: an oracle that always replays the most-informative transition
        learns with <i>exponentially</i> fewer updates than uniform replay. You will reproduce this in the
        CODEVIZ.</li>
        <li><b>&sect;3.3 (Stochastic Prioritization)</b> &mdash; the priority $p_i$, the two variants
        (proportional $p_i = |\\delta_i| + \\epsilon$ and rank-based $p_i = 1/\\mathrm{rank}(i)$), and the
        sampling rule $P(i) \\propto p_i^{\\alpha}$ (Eqn. 1).</li>
        <li><b>&sect;3.4 (Annealing the Bias)</b> &mdash; the importance-sampling weight $w_i$ and why $\\beta$
        is annealed from a starting value up to $1$.</li>
        <li><b>Algorithm 1</b> &mdash; the full loop: sample by priority, compute $\\delta$, scale the update by
        $w_i$, write the new priority back.</li>
       </ul>
       <p><b>Skim:</b> the sum-tree data-structure details and the full Atari results tables in &sect;4 &mdash;
       know the headline (41 / 49 games, median normalized score 48% &rarr; 106%) and move on.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You have a replay buffer where <b>most</b> transitions are already well-predicted and a <b>few</b>
       carry almost all the learning signal (e.g. the one transition that finally reaches the reward). You
       train a fixed number of update steps. Which sampling scheme reaches a correct value function first:
       <b>uniform</b> (every transition equally likely) or <b>prioritized</b> (sample the high-TD-error
       transitions more)? And as the task gets <i>longer</i> (more states to chain through), does the gap
       between them <b>shrink</b>, <b>stay constant</b>, or <b>grow</b>? Write your guess.</p>`,
    attempt:
      `<p>Before the reveal, sketch the prioritized buffer you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>add(transition)</code>: store it with <b>maximum</b> current priority &mdash; <i>"new
        transitions arrive without a known TD-error, so we put them at maximal priority"</i> (&sect;3.3) so
        each is seen at least once.</li>
        <li><code>sample(batch, beta)</code>:
          <ul>
            <li>TODO: form probabilities $P(i) = p_i^{\\alpha} / \\sum_k p_k^{\\alpha}$ (Eqn. 1).</li>
            <li>TODO: draw indices from $P$ (not uniformly).</li>
            <li>TODO: compute weights $w_i = (N\\,P(i))^{-\\beta}$, then <b>divide by</b> $\\max_i w_i$ so the
            largest weight is $1$ and updates only scale <i>down</i>.</li>
          </ul>
        </li>
        <li><code>update_priorities(indices, td_errors)</code>: set $p_i \\leftarrow |\\delta_i| + \\epsilon$.</li>
        <li>In the learner: multiply each sample's loss by its $w_i$ before back-propagation.</li>
       </ul>
       <p>Then run it against a uniform-replay buffer (set $\\alpha = 0$) on the same task and compare how fast
       each learns.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The whole idea hangs on one quantity: the <b>TD-error</b> $\\delta$. When the agent looks at a stored
       transition $(S_{t-1}, A_{t-1}, R_t, S_t)$, its network predicts a value $Q(S_{t-1}, A_{t-1})$. The
       <b>one-step bootstrap target</b> is the reward you actually got plus the discounted best value of where
       you landed, $R_t + \\gamma \\max_a Q(S_t, a)$. The TD-error is the gap between them:</p>
       <p>$$ \\delta = \\underbrace{R_t + \\gamma \\max_a Q(S_t, a)}_{\\text{target}} \\;-\\; \\underbrace{Q(S_{t-1}, A_{t-1})}_{\\text{prediction}}. $$</p>
       <p>The paper describes $|\\delta|$ as how <b>"surprising or unexpected the transition is"</b> (&sect;3.2):
       a transition the network already predicts well has $\\delta \\approx 0$ and teaches little; a transition
       it gets badly wrong has large $|\\delta|$ and is where the learning is.</p>
       <p><b>Step 1 &mdash; priority.</b> Turn surprise into a priority. The <b>proportional</b> variant uses
       $p_i = |\\delta_i| + \\epsilon$, where $\\epsilon$ is a small positive floor so a transition with
       $\\delta = 0$ still keeps a nonzero chance (otherwise it could be frozen out forever).</p>
       <p><b>Step 2 &mdash; sampling probability.</b> Don't just take the single largest &mdash; that is greedy
       and brittle (a transition whose error happens to be tiny on one pass would never be revisited, and
       function-approximation noise would dominate). Instead sample <i>stochastically</i> with probability
       proportional to a power of the priority, $P(i) \\propto p_i^{\\alpha}$ (Eqn. 1, below). The exponent
       $\\alpha \\in [0, 1]$ is the knob: $\\alpha = 0$ makes every $p_i^0 = 1$, i.e. uniform replay; $\\alpha =
       1$ samples in direct proportion to priority. The paper uses $\\alpha = 0.6$ for the proportional
       variant.</p>
       <p><b>Step 3 &mdash; fix the bias.</b> Here is the subtlety. The training update assumes its samples come
       from the same distribution the agent actually experiences. Prioritized sampling deliberately violates
       that &mdash; it <i>"changes this distribution in an uncontrolled fashion, and therefore changes the
       solution that the estimates will converge to"</i> (&sect;3.4). To undo the over-counting, scale each
       sampled transition's update by an <b>importance-sampling (IS) weight</b> $w_i = (1/(N\\,P(i)))^{\\beta}$.
       A transition sampled too often (large $P(i)$) gets a small $w_i$, pulling its influence back down. The
       exponent $\\beta$ controls how fully you correct: $\\beta = 0$ ignores the correction, $\\beta = 1$
       corrects fully. Early in training the bias matters less and unbiased gradients matter less, so $\\beta$
       is <b>annealed</b> from a start value $\\beta_0$ up to $1$ by the end. For stability the weights are
       normalized by $1/\\max_i w_i$ <i>"so that they only scale the update downwards"</i> (&sect;3.4).</p>
       <p>That is the complete recipe: priority $\\to$ probability $\\to$ IS-weight, wrapped around an ordinary
       DQN update.</p>`,
    architecture:
      `<p>Prioritized replay is not a new network &mdash; it is a <b>data structure plus a per-iteration
       procedure</b> bolted onto a Double-DQN agent. Two pieces matter: the loop (Algorithm 1) and the
       <b>sum-tree</b> that makes it fast.</p>

       <p><b>Algorithm 1 &mdash; Double DQN with proportional prioritization (&sect;3.3, per timestep $t$):</b></p>
       <ol>
        <li><b>Act &amp; store.</b> Observe $(S_{t-1}, A_{t-1}, R_t, \\gamma_t, S_t)$ and insert it into the replay
        memory $\\mathcal{H}$ with priority $p_t = \\max_{i \\lt t} p_i$ &mdash; the current <b>maximum</b>, so every
        new transition is guaranteed at least one replay (its true $|\\delta|$ is unknown until it is sampled).</li>
        <li><b>Every $K$ steps, learn from a minibatch of size $k$.</b> For each $j = 1 \\ldots k$:
          <ul>
            <li><b>Sample</b> index $j \\sim P(j) = p_j^{\\alpha} / \\sum_i p_i^{\\alpha}$ (Eqn. 1).</li>
            <li><b>Compute the IS-weight</b> $w_j = (N\\,P(j))^{-\\beta} / \\max_i w_i$.</li>
            <li><b>Compute the TD-error</b> with the Double-DQN target:
            $\\delta_j = R_j + \\gamma_j\\,Q_{\\text{target}}(S_j, \\arg\\max_a Q(S_j,a)) - Q(S_{j-1}, A_{j-1})$.</li>
            <li><b>Write the priority back:</b> $p_j \\leftarrow |\\delta_j|$ (plus $\\epsilon$ in practice).</li>
            <li><b>Accumulate</b> the weighted gradient $\\Delta \\leftarrow \\Delta + w_j\\,\\delta_j\\,\\nabla_\\theta
            Q(S_{j-1}, A_{j-1})$.</li>
          </ul>
        </li>
        <li><b>Step the weights:</b> $\\theta \\leftarrow \\theta + \\eta\\,\\Delta$, reset $\\Delta \\leftarrow 0$.
        Periodically copy $\\theta$ into the target network. (The paper uses a $4\\times$-reduced step size
        $\\eta$ versus the DQN baseline, to compensate for the IS-reweighting.)</li>
       </ol>

       <p><b>The sum-tree (&sect; Appendix; the implementation enabler).</b> A naive buffer would need
       $O(N)$ work every sample &mdash; recompute $\\sum_k p_k^{\\alpha}$ and search the cumulative
       distribution &mdash; which is hopeless for $N = 10^6$ transitions. The fix is a <b>binary sum-tree</b>:</p>
       <ul>
        <li><b>Leaves</b> hold the per-transition priorities $p_i^{\\alpha}$, in the same slots as the
        transitions.</li>
        <li><b>Each internal node</b> stores the <i>sum</i> of its two children's values; the <b>root</b> therefore
        holds the total priority mass $\\sum_k p_k^{\\alpha}$ for free (no re-summing).</li>
        <li><b>Sampling</b> a minibatch of $k$: split $[0, p_{\\text{total}}]$ into $k$ equal segments, draw one
        uniform value in each, and <b>retrieve</b> by walking root&rarr;leaf &mdash; at each node go left if the
        value is $\\le$ the left child's sum, else subtract that sum and go right. Each retrieval is the tree depth,
        $O(\\log N)$.</li>
        <li><b>Updating</b> a priority after a replay: overwrite the leaf, then add the delta up the path to the
        root, again $O(\\log N)$.</li>
       </ul>
       <p>So the entire sample-and-update cycle is $O(\\log N)$ per transition instead of $O(N)$ &mdash; the data
       structure is what makes prioritization practical at scale. (The rank-based variant instead buckets
       transitions by rank and samples a bucket, a different but similarly cheap scheme.)</p>`,
    symbols: [
      { sym: "$\\delta_i$", desc: "the <b>TD-error</b> (temporal-difference error) of transition $i$: target minus prediction, $\\big(R_t + \\gamma \\max_a Q(S_t,a)\\big) - Q(S_{t-1},A_{t-1})$. Its size measures how 'surprising' the transition is." },
      { sym: "$|\\delta_i|$", desc: "the <b>absolute value</b> of the TD-error &mdash; surprise magnitude, ignoring sign. Big = the network was very wrong here." },
      { sym: "$\\epsilon$", desc: "a small positive constant (the priority <b>floor</b>) added so a transition with $\\delta = 0$ still has a nonzero priority and is never permanently frozen out." },
      { sym: "$p_i$", desc: "the <b>priority</b> of transition $i$. Proportional variant: $p_i = |\\delta_i| + \\epsilon$. (Rank-based variant: $p_i = 1/\\mathrm{rank}(i)$, using its rank when transitions are sorted by $|\\delta|$.)" },
      { sym: "$\\alpha$", desc: "the <b>prioritization exponent</b>, $\\alpha \\in [0,1]$. How sharply priorities turn into sampling probabilities. $\\alpha = 0$ = uniform replay; $\\alpha = 1$ = sample directly in proportion to priority. Paper uses $0.6$ (proportional)." },
      { sym: "$P(i)$", desc: "the <b>probability of sampling</b> transition $i$ from the buffer, $P(i) = p_i^{\\alpha} / \\sum_k p_k^{\\alpha}$. The denominator just normalizes so the probabilities sum to $1$." },
      { sym: "$N$", desc: "the <b>number of transitions</b> currently in the replay buffer (the sample size used in the IS-weight)." },
      { sym: "$w_i$", desc: "the <b>importance-sampling weight</b> of transition $i$, $w_i = (1/(N\\,P(i)))^{\\beta}$. Scales that transition's gradient down to undo the bias from sampling it more often." },
      { sym: "$\\beta$", desc: "the <b>bias-correction exponent</b>, annealed from a start value $\\beta_0$ up to $1$ by end of training. $\\beta = 0$ = no correction; $\\beta = 1$ = full correction. Paper uses $\\beta_0 = 0.4$ (proportional)." },
      { sym: "$\\max_i w_i$", desc: "the <b>largest weight</b> in the sampled batch; the paper divides all $w_i$ by it (so the max becomes $1$) for stability &mdash; updates only ever scale <i>down</i>, never up." },
      { sym: "$\\gamma$", desc: "the <b>discount factor</b> $\\in [0,1]$ in the bootstrap target: how much future value counts versus immediate reward." },
      { sym: "$Q(S,a)$", desc: "the network's estimated <b>action-value</b>: expected discounted return from taking action $a$ in state $S$ and acting well after." },
      { sym: "$Q_{\\text{target}}$", desc: "the <b>target network</b>: a periodically-frozen copy of $Q$ used to form the bootstrap target, which stabilizes training. The Double-DQN rule selects the action with $Q$ but evaluates it with $Q_{\\text{target}}$." },
      { sym: "$\\mathrm{rank}(i)$", desc: "the <b>rank</b> of transition $i$ when all transitions are sorted by $|\\delta|$ in descending order (rank $1$ = largest error). Used by the rank-based priority $p_i = 1/\\mathrm{rank}(i)$." },
      { sym: "$\\Delta$", desc: "the <b>accumulated gradient</b> over a minibatch: the running sum of weighted per-sample gradients $w_j\\,\\delta_j\\,\\nabla_\\theta Q$ applied in one parameter step." },
      { sym: "$\\theta,\\ \\eta$", desc: "$\\theta$ = the Q-network's <b>weights</b>; $\\eta$ = the <b>step size</b> (learning rate). The paper reduces $\\eta$ by $4\\times$ versus the DQN baseline to offset the IS-reweighting." },
      { sym: "$p_{\\text{total}}$", desc: "the <b>total priority mass</b> $\\sum_k p_k^{\\alpha}$, held at the <b>root</b> of the sum-tree; the interval $[0, p_{\\text{total}}]$ is what sampling draws from." }
    ],
    formula:
      `$$ \\delta_t = R_t + \\gamma_t \\max_a Q(S_t, a) \\;-\\; Q(S_{t-1}, A_{t-1}). $$
       <p>The <b>TD-error</b> (&sect;3.2): one-step bootstrap target minus current prediction. Its magnitude $|\\delta|$ is the "surprise" each transition carries.</p>

       $$ p_i = |\\delta_i| + \\epsilon. $$
       <p>The <b>proportional priority</b> (&sect;3.3): absolute TD-error plus a tiny floor $\\epsilon \\gt 0$ so no transition's priority ever reaches exactly $0$.</p>

       $$ p_i = \\frac{1}{\\mathrm{rank}(i)}. $$
       <p>The <b>rank-based priority</b> alternative (&sect;3.3): rank transitions by $|\\delta|$ (rank $1$ = largest), and let priority fall off as $1/\\mathrm{rank}$ &mdash; more robust to outliers than the proportional form.</p>

       $$ P(i) = \\frac{p_i^{\\alpha}}{\\sum_k p_k^{\\alpha}} \\quad\\text{(Eqn. 1, \\S 3.3)}. $$
       <p>The <b>sampling probability</b>: priorities raised to the power $\\alpha$ and normalized to sum to $1$. The exponent $\\alpha \\in [0,1]$ controls how sharply you prioritize &mdash; $\\alpha = 0$ gives uniform replay, $\\alpha = 1$ samples in direct proportion to priority (paper: $\\alpha = 0.6$ proportional, $0.7$ rank-based).</p>

       $$ w_i = \\left(\\frac{1}{N}\\cdot\\frac{1}{P(i)}\\right)^{\\beta} \\Big/ \\max_j w_j \\quad\\text{(\\S 3.4)}. $$
       <p>The <b>importance-sampling (IS) weight</b>, normalized by the batch maximum. It down-weights over-sampled transitions to undo the bias from non-uniform sampling; dividing by $\\max_j w_j$ keeps the largest weight at $1$ so updates only ever scale <i>down</i> (paper: $\\beta_0 = 0.4$ proportional, $0.5$ rank-based).</p>

       $$ \\beta : \\beta_0 \\longrightarrow 1 \\quad\\text{(linearly, over training)}. $$
       <p><b>Annealing $\\beta$</b> (&sect;3.4): start at $\\beta_0 \\lt 1$ (partial correction, less variance early) and reach $\\beta = 1$ (full unbiased correction) by the end, when unbiased updates matter most near convergence.</p>

       $$ \\Delta \\;\\leftarrow\\; \\Delta + w_i\\,\\delta_i\\,\\nabla_\\theta Q(S_{i-1}, A_{i-1}); \\qquad \\theta \\leftarrow \\theta + \\eta\\,\\Delta. $$
       <p>The <b>weighted gradient update</b> (Algorithm 1): the per-sample gradient is scaled by both its IS-weight $w_i$ and its TD-error $\\delta_i$ before the step. Targets use the <b>Double-DQN</b> form, $\\delta_i = R_i + \\gamma_i\\,Q_{\\text{target}}(S_i, \\arg\\max_a Q(S_i,a)) - Q(S_{i-1},A_{i-1})$.</p>`,
    whatItDoes:
      `<p><b>Eqn. 1</b> turns priorities into a probability distribution over the buffer. Raise each priority to
       the power $\\alpha$, then divide by the sum of all raised priorities so they add to $1$. A high-priority
       (surprising) transition gets a large slice of the probability; a well-predicted one gets a small slice.
       Turn $\\alpha$ down to $0$ and every slice is equal &mdash; you are back to uniform replay.</p>
       <p>The <b>IS-weight</b> equation is the counterweight. If transition $i$ is sampled with probability
       $P(i)$, then over many draws it appears about $N\\,P(i)$ times as often as a uniform draw would give it.
       The weight $w_i = (1/(N\\,P(i)))^{\\beta}$ is exactly the reciprocal of that over-representation (taken to
       the power $\\beta$), so multiplying each transition's gradient by $w_i$ cancels the over-counting. Then
       dividing the batch's weights by $\\max_i w_i$ keeps the largest at $1$, so the update is only ever
       shrunk, never amplified &mdash; which keeps training stable.</p>`,
    derivation:
      `<p><b>Why does $w_i = (1/(N\\,P(i)))^{\\beta}$ remove the bias?</b> (Full derivation here &mdash;
       <code>conceptLink</code> is null, this lesson owns the math.) Importance sampling is the standard trick
       for estimating an average under one distribution while drawing samples from another. We <i>want</i> the
       expected update under the buffer's natural (uniform) distribution, call it $u(i) = 1/N$ &mdash; that is
       the distribution an unbiased Q-learning update assumes. But we <i>draw</i> from the prioritized
       distribution $P(i)$. The exact correction for that mismatch is to multiply each sampled term by the
       ratio of the two probabilities:</p>
       <p>$$ \\mathbb{E}_{i \\sim u}\\big[f(i)\\big] \\;=\\; \\mathbb{E}_{i \\sim P}\\!\\left[\\frac{u(i)}{P(i)}\\, f(i)\\right] \\;=\\; \\mathbb{E}_{i \\sim P}\\!\\left[\\frac{1/N}{P(i)}\\, f(i)\\right]. $$</p>
       <p>Read the algebra: each draw from $P$ is re-weighted by $\\dfrac{u(i)}{P(i)} = \\dfrac{1/N}{P(i)} =
       \\dfrac{1}{N\\,P(i)}$. A transition we sampled <i>too often</i> (large $P(i)$) gets a ratio
       <i>below</i> $1$, shrinking its contribution; one we sampled <i>too rarely</i> gets a ratio above $1$.
       That ratio is precisely the IS-weight with $\\beta = 1$ &mdash; full correction.</p>
       <p>The exponent $\\beta$ lets us apply only a <i>fraction</i> of that correction: $w_i = (1/(N\\,P(i)))^{\\beta}$.
       At $\\beta = 0$ all weights are $1$ (no correction, fastest but biased); at $\\beta = 1$ the bias is fully
       removed. The paper anneals $\\beta$ from $\\beta_0$ up to $1$ because <i>"the unbiased nature of the
       updates is most important near convergence"</i> &mdash; early on, when the network is changing fast and
       far from the answer, a little bias is harmless and the speed is worth more; by the end you want the
       unbiased fixed point. Finally, dividing by $\\max_i w_i$ rescales the batch without changing relative
       weights, so the largest update is unchanged and the rest only shrink &mdash; a learning-rate-stability
       safeguard, not part of the bias math.</p>`,
    example:
      `<p>Work the pipeline by hand on a tiny buffer of $N = 3$ transitions, using the proportional variant with
       $\\epsilon = 0.01$, $\\alpha = 0.6$, $\\beta = 0.4$ (the paper's proportional settings). Suppose the
       three transitions have absolute TD-errors $|\\delta| = [2.0,\\; 1.0,\\; 0.5]$.</p>
       <ul class="steps">
        <li><b>Priorities</b> $p_i = |\\delta_i| + \\epsilon$:
        &nbsp;$p = [2.0 + 0.01,\\; 1.0 + 0.01,\\; 0.5 + 0.01] = [2.01,\\; 1.01,\\; 0.51]$.</li>
        <li><b>Raise to $\\alpha = 0.6$:</b>
        &nbsp;$p^{0.6} = [2.01^{0.6},\\; 1.01^{0.6},\\; 0.51^{0.6}] = [1.5203,\\; 1.0060,\\; 0.6676]$.
        &nbsp;Sum $= 3.1939$.</li>
        <li><b>Probabilities</b> (Eqn. 1) $P(i) = p_i^{\\alpha} / \\sum_k p_k^{\\alpha}$:
        &nbsp;$P = [1.5203/3.1939,\\; 1.0060/3.1939,\\; 0.6676/3.1939] = [0.476,\\; 0.315,\\; 0.209]$.
        &nbsp;The most-surprising transition is now sampled $\\approx 0.476/0.209 \\approx 2.3\\times$ as often as
        the least.</li>
        <li><b>Raw IS-weights</b> $w_i = (1/(N\\,P(i)))^{\\beta} = (1/(3\\,P(i)))^{0.4}$:
        &nbsp;$w = [(1/(3\\cdot0.476))^{0.4},\\; (1/(3\\cdot0.315))^{0.4},\\; (1/(3\\cdot0.209))^{0.4}]
        = [0.8672,\\; 1.0229,\\; 1.2052]$.
        &nbsp;Notice the order is <i>flipped</i>: the over-sampled transition (1) gets the <b>smallest</b>
        weight, the under-sampled one (3) the <b>largest</b> &mdash; exactly the down-weighting we wanted.</li>
        <li><b>Normalize by $\\max_i w_i = 1.2052$:</b>
        &nbsp;$w/\\max = [0.7195,\\; 0.8487,\\; 1.0]$. The largest is now $1$; everything else only scales the
        update <i>down</i>.</li>
       </ul>
       <p><b>Sanity check &mdash; what uniform replay would give.</b> Set $\\alpha = 0$: then every $p_i^0 = 1$,
       so $P(i) = 1/3$ for all, and $w_i = (1/(3\\cdot\\tfrac13))^{\\beta} = 1^{\\beta} = 1$. Uniform sampling
       needs <i>no</i> correction &mdash; all weights are exactly $1$ &mdash; which is the consistency check that
       the IS-weight is doing the right thing. These exact numbers are recomputed in the notebook's first cell.</p>`,
    recipe:
      `<ol>
        <li><b>Build a DQN as usual</b> (import: <code>nn.Linear</code> Q-network, a target network, an
        $\\epsilon$-greedy policy). The replay buffer is the only piece you replace.</li>
        <li><b>Store priorities.</b> Alongside each transition keep its priority $p_i$. New transitions go in at
        the current <b>maximum</b> priority so they are guaranteed at least one replay.</li>
        <li><b>Sample by Eqn. 1.</b> Form $P(i) = p_i^{\\alpha} / \\sum_k p_k^{\\alpha}$ and draw a minibatch of
        indices from $P$ (not uniformly).</li>
        <li><b>Compute IS-weights.</b> $w_i = (N\\,P(i))^{-\\beta}$, then divide by $\\max_i w_i$ in the batch.
        Anneal $\\beta$ from $\\beta_0$ toward $1$ over training.</li>
        <li><b>Weighted update.</b> Compute each sample's TD-error $\\delta_i$ and loss, multiply the loss by
        $w_i$, then back-propagate. (Equivalently, use $w_i\\,\\delta_i$ in place of $\\delta_i$.)</li>
        <li><b>Write priorities back.</b> Set $p_i \\leftarrow |\\delta_i| + \\epsilon$ for the just-sampled
        transitions, so the buffer's priorities track the latest surprise.</li>
        <li><b>Ablate:</b> set $\\alpha = 0$ (uniform) and compare learning speed.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): <b>"DQN with prioritized experience replay achieves a new
       state-of-the-art, outperforming DQN with uniform replay on 41 out of 49 games."</b> The paper also
       reports (&sect;4) that the <b>median normalized performance across 49 Atari games increased from 48% to
       106%</b> when uniform replay was swapped for prioritized replay. The cleanest qualitative result is the
       <b>Blind Cliffwalk</b> (&sect;2, Fig. 1): an oracle that always replays the most-informative transition
       reaches a correct value function with <i>exponentially</i> fewer updates than uniform sampling, and the
       gap <i>grows</i> with the length of the task.</p>
       <p><i>These are the paper's reported figures, quoted from the fetched text. The numbers in the CODEVIZ
       panel below are from our own tiny Blind-Cliffwalk run &mdash; not the paper's reported results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the neural-network and optimizer primitives already
       ship in PyTorch, so you <b>import</b> them and build only the novel algorithm. <b>Import:</b>
       <code>nn.Linear</code> for the Q-network and target network, <code>torch.optim.Adam</code>, and a
       CartPole-style environment (or, in the CODEVIZ, a self-contained tabular toy so no <code>gym</code>
       install is needed). <b>Build by hand:</b> the <b>prioritized replay buffer</b> &mdash; storing
       priorities, sampling by $P(i) \\propto p_i^{\\alpha}$ (Eqn. 1), computing and normalizing the IS-weights
       $w_i$, applying them in the loss, and writing $p_i \\leftarrow |\\delta_i| + \\epsilon$ back &mdash; plus
       the <b>uniform ablation</b> ($\\alpha = 0$). This builds directly on the base <b>DQN</b> paper
       (capstone step <code>dqn#1</code>); read that first if you have not. The IS-weight derivation is done in
       full above (no separate concept lesson).</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting the bias correction.</b> Prioritizing without the $w_i$ weights trains the network on
        a skewed distribution and converges to the <i>wrong</i> value function. The IS-weights are not optional
        polish &mdash; they are what keeps the fixed point correct. <b>Fix:</b> always multiply the loss by the
        normalized $w_i$ (or anneal $\\beta$ toward $1$).</li>
        <li><b>Greedy (top-1) prioritization instead of stochastic.</b> Always replaying the single
        highest-error transition is brittle: a transition whose error is momentarily small is never revisited,
        and approximation noise dominates. <b>Fix:</b> sample stochastically via Eqn. 1 with $0 \\lt \\alpha \\lt 1$
        ($\\alpha = 0.6$ in the paper), so even low-priority transitions keep a chance.</li>
        <li><b>Omitting the $\\epsilon$ floor.</b> With $p_i = |\\delta_i|$ and no $\\epsilon$, a transition that
        reaches $\\delta = 0$ gets probability $0$ and is frozen out forever &mdash; even if it later becomes
        wrong again. <b>Fix:</b> $p_i = |\\delta_i| + \\epsilon$ with small $\\epsilon$.</li>
        <li><b>Stale priorities.</b> If you never update $p_i$ after replaying a transition, its priority
        reflects an old, large error long after the network has learned it &mdash; so you keep wastefully
        replaying it. <b>Fix:</b> write $p_i \\leftarrow |\\delta_i| + \\epsilon$ back every time you sample it.</li>
        <li><b>Not giving new transitions max priority.</b> If a brand-new transition enters at low priority it
        may never be sampled. <b>Fix:</b> insert at the current <b>maximum</b> priority so it is seen at least
        once.</li>
        <li><b>Confusing $\\alpha$ and $\\beta$.</b> $\\alpha$ controls <i>how much you prioritize</i> (in the
        sampling probability); $\\beta$ controls <i>how much you correct the resulting bias</i> (in the
        weights). They pull in opposite directions and are tuned separately.</li>
      </ul>`,
    recall: [
      "State the sampling-probability equation $P(i)$ (Eqn. 1) from memory.",
      "Write the importance-sampling weight $w_i$ and say what each symbol means.",
      "Define $\\delta_i$ (the TD-error) in words and as a formula.",
      "What does $\\alpha = 0$ reduce prioritized replay to, and why?",
      "Why are the IS-weights needed at all, and why is $\\beta$ annealed up to $1$?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have a working prioritized DQN on a sparse-reward task (only the final
            transition gives reward). You flip <code>alpha</code> from $0.6$ to $0$ and retrain with everything
            else identical. What happens to learning speed, and what does that isolate?`,
        steps: [
          { do: `Set <code>alpha = 0</code>. Now $p_i^0 = 1$ for every transition, so $P(i) = 1/N$ &mdash; the buffer samples <b>uniformly</b>.`, why: `$\\alpha$ is the single knob between prioritized and uniform; turning it to $0$ recovers the original DQN replay exactly.` },
          { do: `Retrain and watch updates-to-converge: uniform needs many more, because the one informative (reward-reaching) transition is now sampled as rarely as every boring one.`, why: `Uniform spends most updates on already-learned transitions; the rare high-TD-error transition that carries the signal is diluted.` },
          { do: `Note the gap <b>grows</b> with task length (more states to chain the reward back through).`, why: `Each extra state multiplies the number of uniform draws needed to hit the right transition in the right order &mdash; the paper's exponential Blind-Cliffwalk effect.` }
        ],
        answer: `<p>With $\\alpha = 0$ the buffer is uniform and learning is much slower &mdash; and the slowdown
                 worsens as the task lengthens. Since only $\\alpha$ changed, this isolates <b>prioritized
                 sampling</b> (not network size, optimizer, or data) as the cause of the speed-up. The CODEVIZ
                 panel reproduces exactly this contrast on the Blind Cliffwalk.</p>`
      },
      {
        q: `Recompute the pipeline for a fresh batch. Buffer of $N = 2$ transitions with $|\\delta| = [3.0,\\;
            1.0]$, $\\epsilon = 0$, $\\alpha = 0.5$, $\\beta = 1$. Find $P(i)$ and the normalized IS-weights.`,
        steps: [
          { do: `Priorities (no floor): $p = [3.0,\\; 1.0]$. Raise to $\\alpha = 0.5$ (square root): $p^{0.5} = [\\sqrt{3},\\; \\sqrt{1}] = [1.732,\\; 1.0]$, sum $= 2.732$.`, why: `$P(i) \\propto p_i^{\\alpha}$ needs the powered priorities and their sum (Eqn. 1).` },
          { do: `Probabilities: $P = [1.732/2.732,\\; 1.0/2.732] = [0.634,\\; 0.366]$.`, why: `Normalize so they sum to $1$.` },
          { do: `Raw weights $w_i = (1/(N\\,P(i)))^{\\beta} = (1/(2\\,P(i)))^{1}$: $w = [1/(2\\cdot0.634),\\; 1/(2\\cdot0.366)] = [0.789,\\; 1.366]$.`, why: `$\\beta = 1$ is full correction, so $w_i = 1/(N P(i))$ directly.` },
          { do: `Normalize by $\\max w = 1.366$: $w/\\max = [0.577,\\; 1.0]$.`, why: `Largest weight becomes $1$; updates only scale down.` }
        ],
        answer: `<p>$P = [0.634,\\; 0.366]$; normalized IS-weights $= [0.577,\\; 1.0]$. The high-error transition
                 is sampled more (P = 0.634) but its update is scaled down most (weight 0.577) &mdash;
                 prioritize the sampling, then undo the resulting over-count in the gradient.</p>`
      },
      {
        q: `A teammate removes the $\\epsilon$ floor "to simplify," using $p_i = |\\delta_i|$. After a while
            some transitions stop being replayed entirely, even ones that later turn out to be mispredicted.
            Why, and what is the fix?`,
        steps: [
          { do: `Find a transition the network currently predicts perfectly: $\\delta = 0 \\Rightarrow p_i = |0| = 0$.`, why: `Priority is the absolute TD-error, which can hit exactly $0$.` },
          { do: `Its sampling probability $P(i) = p_i^{\\alpha} / \\sum_k p_k^{\\alpha} = 0$, so it is <b>never</b> drawn again.`, why: `A zero priority gives zero probability under Eqn. 1 &mdash; permanent exclusion.` },
          { do: `If the network later drifts and that transition becomes wrong, its priority is still recorded as $0$, so it stays frozen out and the error is never corrected.`, why: `Priorities only update when a transition is sampled; a never-sampled transition can never refresh its stale $0$.` },
          { do: `Fix: restore the floor, $p_i = |\\delta_i| + \\epsilon$ with small $\\epsilon$.`, why: `A nonzero floor guarantees every transition keeps a small but positive chance of being revisited.` }
        ],
        answer: `<p>Without $\\epsilon$, any transition reaching $\\delta = 0$ gets priority $0$ and probability
                 $0$, so it is frozen out permanently &mdash; and can never refresh its priority even if it
                 later becomes mispredicted. The $\\epsilon$ floor ($p_i = |\\delta_i| + \\epsilon$) keeps every
                 transition reachable.</p>`
      }
    ]
  });

  window.CODE["paper-prioritized-replay"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> a prioritized replay buffer by hand &mdash; proportional priorities
       $p_i = |\\delta_i| + \\epsilon$, sampling by $P(i) \\propto p_i^{\\alpha}$ (Eqn. 1), normalized
       importance-sampling weights $w_i = (N\\,P(i))^{-\\beta} / \\max_j w_j$ (&sect;3.4) &mdash; and bolt it onto
       a small DQN (<code>nn.Linear</code> Q-network + target network) on <b>CartPole</b>. We train once with
       prioritized replay and once with the <b>uniform ablation</b> ($\\alpha = 0$), and print both
       reward curves: prioritized reaches high return in fewer episodes. The first cell recomputes the worked
       example ($|\\delta| = [2.0,1.0,0.5] \\to P = [0.476,0.315,0.209] \\to$ normalized $w = [0.7195,0.8487,1.0]$).
       CartPole needs <code>gym</code>; if it is missing, the CODEVIZ below runs the same prioritized-vs-uniform
       contrast on a self-contained tabular task with no install. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, numpy as np
import gym   # CartPole; preinstalled in Colab. (If missing, see the CODEVIZ cell -- no install needed.)

torch.manual_seed(0); np.random.seed(0)

# --- 0. Recompute the lesson's worked example: priorities -> probs -> IS-weights. ---
eps, alpha, beta, N = 0.01, 0.6, 0.4, 3
d   = np.array([2.0, 1.0, 0.5])              # |TD-errors|
p   = np.abs(d) + eps                        # p_i = |delta_i| + eps
P   = p**alpha / (p**alpha).sum()            # Eqn. 1:  P(i) = p_i^a / sum_k p_k^a
w   = (1.0 / (N * P))**beta                  # raw IS-weight  w_i = (1/(N P(i)))^beta
wn  = w / w.max()                            # normalize by max -> only scales down
print("P  =", np.round(P, 4).tolist())       # [0.476, 0.315, 0.209]
print("w/max =", np.round(wn, 4).tolist())   # [0.7195, 0.8487, 1.0]
# sanity: uniform (alpha=0) gives P=1/3 and all weights exactly 1
print("uniform w =", float(((1/(N*(1/N)))**beta)))   # 1.0


# --- 1. The prioritized replay buffer (built by hand; alpha=0 => uniform ablation). ---
class PrioritizedReplay:
    def __init__(self, cap, alpha=0.6, eps=1e-2):
        self.cap, self.alpha, self.eps = cap, alpha, eps
        self.data = []; self.prio = np.zeros(cap, dtype=np.float32); self.pos = 0
    def add(self, *transition):
        maxp = self.prio.max() if self.data else 1.0          # new -> MAX priority
        if len(self.data) < self.cap: self.data.append(transition)
        else: self.data[self.pos] = transition
        self.prio[self.pos] = maxp
        self.pos = (self.pos + 1) % self.cap
    def sample(self, batch, beta):
        n = len(self.data)
        pa = self.prio[:n] ** self.alpha                      # p_i^alpha   (alpha=0 -> all ones -> uniform)
        Pi = pa / pa.sum()                                    # Eqn. 1
        idx = np.random.choice(n, batch, p=Pi)
        w = (n * Pi[idx]) ** (-beta)                          # w_i = (N P(i))^(-beta)
        w = w / w.max()                                       # normalize -> downscale only
        b = [self.data[i] for i in idx]
        return idx, b, torch.tensor(w, dtype=torch.float32)
    def update(self, idx, td):                                # write |delta|+eps back
        self.prio[idx] = np.abs(td) + self.eps


def qnet(obs, act):
    return nn.Sequential(nn.Linear(obs, 128), nn.ReLU(), nn.Linear(128, act))


def train(prioritized, episodes=200, gamma=0.99):
    torch.manual_seed(0); np.random.seed(0)
    env = gym.make("CartPole-v1")
    o_dim = env.observation_space.shape[0]; a_dim = env.action_space.n
    q, qt = qnet(o_dim, a_dim), qnet(o_dim, a_dim); qt.load_state_dict(q.state_dict())
    opt = torch.optim.Adam(q.parameters(), lr=1e-3)
    buf = PrioritizedReplay(10000, alpha=(0.6 if prioritized else 0.0))
    eps_greedy, returns = 1.0, []
    for ep in range(episodes):
        s, _ = env.reset(seed=ep); done = False; R = 0.0
        beta = 0.4 + 0.6 * ep / episodes                      # anneal beta 0.4 -> 1.0
        while not done:
            a = env.action_space.sample() if np.random.rand() < eps_greedy \\
                else int(q(torch.tensor(s, dtype=torch.float32)).argmax())
            s2, r, term, trunc, _ = env.step(a); done = term or trunc
            buf.add(s, a, r, s2, done); s = s2; R += r
            if len(buf.data) >= 64:
                idx, batch, w = buf.sample(64, beta)
                S  = torch.tensor(np.array([b[0] for b in batch]), dtype=torch.float32)
                A  = torch.tensor([b[1] for b in batch])
                Rw = torch.tensor([b[2] for b in batch], dtype=torch.float32)
                S2 = torch.tensor(np.array([b[3] for b in batch]), dtype=torch.float32)
                D  = torch.tensor([b[4] for b in batch], dtype=torch.float32)
                qsa = q(S).gather(1, A[:, None]).squeeze(1)
                with torch.no_grad():
                    tgt = Rw + gamma * qt(S2).max(1).values * (1 - D)
                td = tgt - qsa
                loss = (w * td.pow(2)).mean()                 # IS-weighted loss
                opt.zero_grad(); loss.backward(); opt.step()
                buf.update(idx, td.detach().numpy())          # priorities <- |delta|+eps
        eps_greedy = max(0.05, eps_greedy * 0.97)
        if ep % 5 == 0: qt.load_state_dict(q.state_dict())
        returns.append(R)
    env.close(); return returns

print("\\nPRIORITIZED replay:")
pr = train(prioritized=True)
print("UNIFORM replay (ablation, alpha=0):")
un = train(prioritized=False)
print("\\nprioritized mean return (last 50 eps):", round(np.mean(pr[-50:]), 1))
print("uniform     mean return (last 50 eps):", round(np.mean(un[-50:]), 1))
# Prioritized typically reaches high return in fewer episodes than uniform.
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-prioritized-replay"] = {
    question: "Does prioritizing high-TD-error transitions learn with fewer updates than uniform replay -- and does the gap grow with task length?",
    charts: [
      {
        type: "line",
        title: "Updates to learn the value function vs task length (Blind Cliffwalk): prioritized vs uniform",
        xlabel: "task length n (number of chain states)",
        ylabel: "Q-learning updates to converge (median of 15 seeds)",
        series: [
          {
            name: "Uniform replay",
            color: "#ff7b72",
            points: [[4,31],[6,64],[8,105],[10,156],[12,274],[14,384],[16,471]]
          },
          {
            name: "Prioritized (oracle)",
            color: "#7ee787",
            points: [[4,4],[6,6],[8,8],[10,10],[12,12],[14,14],[16,16]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. We reproduce the paper's Blind Cliffwalk (&sect;2): a chain of n states where only the final transition gives reward 1, replayed from a fixed buffer with exact tabular Q-learning (learning rate 1). PRIORITIZED replay always replays the single learnable (max-|TD-error|) transition, so it needs exactly n updates -- one per state, propagating the reward backward in order. UNIFORM replay samples blindly and wastes updates on transitions whose targets are not ready yet, needing far more (31 -> 471 as n grows 4 -> 16). The speed-up GROWS with task length (~7x at n=4 to ~28x at n=16), matching the paper's qualitative 'exponential speed-up' claim on the same task.",
    code: `import numpy as np

# Blind Cliffwalk (paper Sec 2 / Fig 1): chain of n states. Each state has two actions:
#   action 'right' (a=1) advances to the next state; action 'wrong' (a=0) terminates with 0.
#   Reaching the end gives reward 1 (terminal). gamma=1; only the last transition is rewarding.
# Collect every transition once into a fixed buffer, then run Q-learning updates, sampling either
# UNIFORMLY or by PRIORITY (oracle = current max |TD-error|). Count updates to reach Q*.
def build(n):
    t = []
    for s in range(n):
        t.append((s, 0, 0.0, None, True))                       # wrong -> terminate, r=0
        t.append((s, 1, 1.0, None, True) if s == n - 1
                 else (s, 1, 0.0, s + 1, False))                # right -> advance (last -> r=1)
    return t

def run(n, mode, seed=0, gamma=1.0, max_updates=10_000_000):
    rng = np.random.default_rng(seed); trans = build(n)
    Q = np.zeros((n, 2))
    def td(t):
        s, a, r, sn, done = t
        return (r if done else r + gamma * Q[sn].max()) - Q[s, a]
    Qstar = np.zeros((n, 2)); Qstar[:, 1] = 1.0                 # optimal: Q*(s,right)=1, Q*(s,wrong)=0
    for u in range(1, max_updates + 1):
        if mode == "uniform":
            i = rng.integers(len(trans))                       # sample blindly
        else:
            e = np.abs([td(t) for t in trans])                 # priority oracle: max |TD-error|
            i = int(rng.choice(np.flatnonzero(e >= e.max() - 1e-12)))
        t = trans[i]; Q[t[0], t[1]] += td(t)                   # exact tabular update (lr=1)
        if np.max(np.abs(Q - Qstar)) < 1e-9:
            return u

ns = [4, 6, 8, 10, 12, 14, 16]
unif = [int(np.median([run(n, "uniform",  s) for s in range(15)])) for n in ns]
prio = [int(np.median([run(n, "priority", s) for s in range(15)])) for n in ns]
print("uniform     :", [[n, u] for n, u in zip(ns, unif)])
print("prioritized :", [[n, p] for n, p in zip(ns, prio)])
print("speedup     :", [round(u / p, 1) for u, p in zip(unif, prio)])
# uniform     -> 31, 64, 105, 156, 274, 384, 471   (grows fast)
# prioritized -> n exactly:  4, 6, 8, 10, 12, 14, 16
# speedup grows with n (~7x -> ~28x): the paper's exponential Blind-Cliffwalk effect.`
  };
})();
