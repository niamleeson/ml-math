/* Paper lesson — "Deep Reinforcement Learning with Double Q-learning" (van Hasselt, Guez, Silver 2016).
   Track: architecture (B). Builds on a DQN; decouples action SELECTION (online net) from EVALUATION
   (target net) in the TD target. Self-contained: LESSON + CODE + CODEVIZ merged by id "paper-double-dqn".
   Grounded from arXiv 1509.06461 (abstract page) and the ar5iv HTML mirror (method, equations 2-4,
   Theorem 1, results). conceptLink null — the math is owned here. Cross-links paper-dqn (manifest) and
   the existing rl-dqn concept lesson. */
(function () {
  window.LESSONS.push({
    id: "paper-double-dqn",
    title: "Double DQN — Deep Reinforcement Learning with Double Q-learning (2016)",
    tagline: "Stop a Deep Q-Network from over-rating its own actions: pick the next action with one network, but score it with another.",
    module: "Papers · Reinforcement Learning",
    track: "architecture",

    paper: {
      authors: "Hado van Hasselt, Arthur Guez, David Silver",
      org: "Google DeepMind",
      year: 2016,
      venue: "AAAI 2016 (arXiv preprint Sep 2015)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1509.06461",
      code: ""
    },

    conceptLink: null,
    partOf: [{ capstone: "capstone-dqn", step: 2, builds: "the Double-DQN target that decouples action selection from evaluation" }],
    prereqs: ["rl-dqn", "ai-q-learning", "dl-backprop"],

    problem:
      `<p><b>Q-learning systematically over-estimates how good actions are.</b> The culprit is the
       $\\max$ operator inside its target. A Deep Q-Network (DQN) builds its training target by taking the
       LARGEST predicted value over all next actions. But those predictions are NOISY &mdash; some are too
       high, some too low, purely by estimation error. The $\\max$ does not pick the truly best action; it
       picks whichever action got the LUCKIEST positive error. So the target is biased UPWARD, and the bias
       grows with the number of actions and with the noise.</p>
       <p>The paper's intro states the question directly: it asks whether DQN's overestimations are
       "common, ... harm performance, and ... can be prevented." Before this work it was unclear whether the
       overestimation seen in tabular Q-learning even mattered for large deep-RL agents, or whether it hurt
       the final policy.</p>`,

    contribution:
      `<ul>
         <li><b>It shows DQN really does over-estimate</b> &mdash; "substantial overestimations in some
         games in the Atari 2600 domain" (abstract) &mdash; and that these hurt the learned policy.</li>
         <li><b>It adapts Double Q-learning to deep networks</b> with a ONE-LINE change to the target:
         use the online network to SELECT the next action, but the existing target network to EVALUATE it.
         No new network, no extra parameters (Section 4).</li>
         <li><b>It demonstrates the fix works at scale</b> &mdash; lower value estimates AND better policies
         across 49 Atari games, with no additional tuning over DQN.</li>
       </ul>`,

    whyItMattered:
      `<p>Double DQN became a default ingredient of value-based deep RL. It is the "D" inside <b>Rainbow</b>
       (the agent that stacks Double, Dueling, Prioritized replay, multi-step, distributional, and noisy
       nets), and the same select-with-one / evaluate-with-another trick reappears in continuous-control
       methods such as TD3's twin critics. The lesson &mdash; a single biased $\\max$ can quietly corrupt a
       whole value function &mdash; reshaped how people think about bootstrapping with function
       approximators.</p>`,

    readingGuide:
      `<p>The paper is short. Read in this order:</p>
       <ul>
         <li><b>Section 1 (intro) + abstract</b> &mdash; the claim: DQN over-estimates, and it is fixable.</li>
         <li><b>Section 3 "Overoptimism due to estimation errors"</b> and <b>Theorem 1</b> &mdash; the
         math of WHY a $\\max$ over noisy estimates is biased upward, with the lower bound. Read carefully;
         skim the proof.</li>
         <li><b>Section 4 "Double DQN"</b> &mdash; the actual fix, Equation (4). This is the whole method.</li>
         <li><b>Figure 1 + Figure 2/3</b> &mdash; the orange-vs-blue value-estimate curves: DQN's estimate
         floats far above the true return, Double DQN's tracks it.</li>
       </ul>
       <p>Skim the per-game Atari tables unless you want the headline numbers.</p>`,

    predict:
      `<p>Before running anything, guess: you have a state where the TRUE value of every action is exactly
       the same, say $0$. Your network's estimates are noisy but unbiased &mdash; they average to $0$. If
       you take the $\\max$ of those noisy estimates, will the result average to $0$, above $0$, or below
       $0$? And does it get worse with more actions?</p>`,

    attempt:
      `<p>You will implement BOTH targets and watch the bias appear. In a tiny experiment with a single
       state whose true action-values are all $0$ and Gaussian estimation noise:</p>
       <ul>
         <li>The <b>single estimator</b> (DQN-style): draw one set of noisy estimates, return its $\\max$.</li>
         <li>The <b>double estimator</b> (Double-DQN-style): draw TWO independent sets; use the first to
         pick the $\\arg\\max$ action, return the SECOND set's value at that action.</li>
       </ul>
       <p>Average each over many trials and several noise levels. The single estimator's mean drifts above
       $0$; the double estimator's stays at $0$. Then run the same idea inside a real DQN target on
       CartPole and compare the two TD targets.</p>`,

    walkthrough:
      `<p><b>Step 0 &mdash; what a DQN target is.</b> A DQN (see <code>rl-dqn</code>) trains a network
       $Q(s,a;\\theta)$ to obey the Bellman equation by regressing its prediction toward a TARGET built from
       the reward plus the discounted value of the next state. Standard Q-learning's target is
       <b>Equation (2)</b> of the paper:
       $Y^{Q}_t = R_{t+1} + \\gamma\\,\\max_a Q(S_{t+1}, a;\\theta_t)$. DQN's version, <b>Equation (3)</b>,
       evaluates the $\\max$ with a slowly-updated TARGET network $\\theta^-_t$ instead of the live weights:
       $Y^{DQN}_t = R_{t+1} + \\gamma\\,\\max_a Q(S_{t+1}, a;\\theta^-_t)$.</p>
       <p><b>Step 1 &mdash; why the $\\max$ lies.</b> Section 3 makes the bias precise. Write the single
       $\\max$ as doing two jobs at once: it SELECTS the action that looks best AND it EVALUATES (reports)
       that action's value, using the SAME noisy estimates for both. When an action's value is
       over-estimated by chance, the $\\max$ is exactly the operator most likely to select it &mdash; and
       then it reports that inflated value. Selection and evaluation are CORRELATED, so the error does not
       cancel; it accumulates upward.</p>
       <p><b>Step 2 &mdash; the Double Q-learning idea.</b> Double Q-learning (van Hasselt 2010) breaks the
       correlation by keeping two value functions and using DIFFERENT ones for the two jobs. The target,
       <b>Equation (4)</b> in the form written for Double Q-learning, is
       $Y^{DoubleQ}_t = R_{t+1} + \\gamma\\, Q\\!\\big(S_{t+1},\\ \\arg\\max_a Q(S_{t+1},a;\\theta_t);\\ \\theta'_t\\big)$.
       The inner $\\arg\\max$ uses the FIRST set of weights $\\theta_t$ to SELECT the action; the outer $Q$
       uses a SECOND, independent set $\\theta'_t$ to EVALUATE it. Because the two estimates are independent,
       a lucky over-estimate that wins the $\\arg\\max$ is unlikely to ALSO be over-estimated in the second
       set &mdash; so the reported value is unbiased.</p>
       <p><b>Step 3 &mdash; Double DQN: the one-line change.</b> Here is the paper's actual trick (Section
       4). A DQN already HAS a second network lying around &mdash; the target network $\\theta^-$. So you do
       not need a third network at all. Reuse the online net $\\theta$ to select and the target net
       $\\theta^-$ to evaluate. That gives the Double DQN target, the key equation of the paper:
       $Y^{DoubleDQN}_t = R_{t+1} + \\gamma\\, Q\\!\\big(S_{t+1},\\ \\arg\\max_a Q(S_{t+1},a;\\theta_t);\\ \\theta^-_t\\big)$.</p>
       <p>Compare it to DQN (Equation 3): DQN's $\\max_a Q(S_{t+1},a;\\theta^-_t)$ both picks and scores with
       $\\theta^-$. Double DQN moves only the SELECTION over to $\\theta$. That single change &mdash; pick
       with the online net, score with the target net &mdash; is the entire method.</p>`,

    architecture:
      `<p><b>No new network &mdash; Double DQN reuses DQN's existing two-network setup unchanged.</b> The
       architecture IS the standard DQN; only the target computation is rewired.</p>
       <ul>
         <li><b>Online network $Q(s,a;\\theta)$.</b> The convolutional / MLP value network being trained.
         It maps a state to one value per discrete action. Its weights $\\theta$ are updated by gradient
         descent on the TD loss EVERY step. It also drives $\\epsilon$-greedy behaviour during data
         collection. (For Atari the paper uses DQN's exact net: 3 conv layers then 2 fully-connected layers,
         one output per action; for CartPole in this lesson it is a small MLP.)</li>
         <li><b>Target network $Q(s,a;\\theta^-)$.</b> An identical-shaped copy of the online net. Its weights
         $\\theta^-$ are NOT trained &mdash; they are HARD-COPIED from $\\theta$ every $\\tau$ steps
         ($\\tau = 10{,}000$ in the paper) and held frozen in between. This lag is what makes $\\theta^-$ a
         (partly) independent second estimate.</li>
         <li><b>Replay buffer.</b> Stores past transitions $(S_t, A_t, R_{t+1}, S_{t+1}, \\text{done})$;
         minibatches are sampled i.i.d. from it to train the online net. Standard DQN plumbing, unchanged.</li>
       </ul>
       <p><b>Data flow for one update.</b> Sample a batch from the buffer &rarr; feed $S_{t+1}$ through the
       ONLINE net and take $\\arg\\max_a$ to pick the next action (SELECT) &rarr; feed $S_{t+1}$ through the
       TARGET net and read THAT action's value via an index/gather, not a max (EVALUATE) &rarr; form
       $Y^{DoubleDQN}_t = R_{t+1} + \\gamma\\,(\\text{evaluated value})$ &rarr; regress
       $Q(S_t,A_t;\\theta)$ toward it with one gradient step on $\\theta$ &rarr; every $\\tau$ steps copy
       $\\theta \\to \\theta^-$. DQN's data flow is identical except its next-state value is a single
       $\\max_a Q(S_{t+1},a;\\theta^-)$ through the target net alone.</p>`,

    symbols: [
      { sym: "$S_t,\\ S_{t+1}$", desc: "the state at time-step $t$ and the next state. A state is everything the agent observes (e.g. CartPole's position, velocity, pole angle, angular velocity)." },
      { sym: "$a$", desc: "an action, drawn from a small DISCRETE set (e.g. push-left / push-right). The subscript on $\\max_a$ / $\\arg\\max_a$ means 'over all next actions $a$'." },
      { sym: "$R_{t+1}$", desc: "the reward received one step after time $t$, i.e. for the transition out of $S_t$." },
      { sym: "$\\gamma$", desc: "the discount factor ('gamma'), $0 \\le \\gamma \\lt 1$. A reward $k$ steps in the future is worth $\\gamma^{k}$ as much now; it trades off immediate vs. long-term reward." },
      { sym: "$\\theta_t$", desc: "the weights of the ONLINE network at time $t$ ('theta') &mdash; the network being trained by gradient descent every step." },
      { sym: "$\\theta^-_t$", desc: "the weights of the TARGET network ('theta-minus') &mdash; a slowly-updated copy of $\\theta$ (refreshed every fixed number of steps). DQN already maintains it; Double DQN simply reuses it." },
      { sym: "$\\theta'_t$", desc: "in the GENERAL Double Q-learning formula (Eq. 4), an independent SECOND set of weights used only for evaluation. In Double DQN this role is played by $\\theta^-_t$." },
      { sym: "$Q(s,a;\\theta)$", desc: "the network's ESTIMATE of the action-value &mdash; the expected discounted return of taking action $a$ in state $s$ and acting greedily after &mdash; using weights $\\theta$." },
      { sym: "$\\max_a Q(\\cdot)$", desc: "'the largest value over all next actions.' It returns a NUMBER (the best estimated value). This is what biases DQN upward." },
      { sym: "$\\arg\\max_a Q(\\cdot)$", desc: "'the ACTION that achieves the largest value' ('arg-max'). It returns an ACTION, not a number. Double DQN uses this from the online net, then looks that action's value up in the target net." },
      { sym: "$Y^{DQN}_t$", desc: "the standard DQN training target (Eq. 3): reward plus discounted target-net $\\max$." },
      { sym: "$Y^{DoubleDQN}_t$", desc: "the Double DQN training target (the key equation): online net selects, target net evaluates." }
    ],

    formula:
      `$$ Y^{Q}_t \\;=\\; R_{t+1} \\;+\\; \\gamma\\, \\max_{a} Q(S_{t+1}, a; \\theta_t) $$
       <p>Standard Q-learning target (Eq. 2): bootstrap with the $\\max$ over next-action values from the SAME weights $\\theta_t$ used to act.</p>
       $$ Y^{DQN}_t \\;=\\; R_{t+1} \\;+\\; \\gamma\\, \\max_{a} Q(S_{t+1}, a; \\theta^-_t) $$
       <p>DQN target (Eq. 3): identical, but the $\\max$ is evaluated with the slowly-updated TARGET network $\\theta^-_t$. The single $\\max$ both SELECTS and EVALUATES with $\\theta^-$ &mdash; the source of the upward bias.</p>
       $$ Y^{DoubleQ}_t \\;=\\; R_{t+1} \\;+\\; \\gamma\\, Q\\!\\Big(S_{t+1},\\ \\arg\\max_{a} Q(S_{t+1}, a; \\theta_t);\\ \\theta'_t\\Big) $$
       <p>General Double Q-learning target (Eq. 4): SELECT the action with $\\theta_t$ (inner $\\arg\\max$), EVALUATE it with an INDEPENDENT second set $\\theta'_t$ (outer $Q$). Decoupling the two jobs onto independent estimates removes the bias.</p>
       $$ Y^{DoubleDQN}_t \\;=\\; R_{t+1} \\;+\\; \\gamma\\, Q\\!\\Big(S_{t+1},\\ \\underbrace{\\arg\\max_{a} Q(S_{t+1},a;\\theta_t)}_{\\text{SELECT with online }\\theta},\\ \\ \\underbrace{\\theta^-_t}_{\\text{EVALUATE with target }\\theta^-}\\Big) $$
       <p>Double DQN target (Section 4, the paper's method): set $\\theta'_t = \\theta^-_t$. The online net $\\theta_t$ selects, the existing DQN target net $\\theta^-_t$ evaluates &mdash; a second network for free.</p>
       $$ \\max_{a} Q_t(s,a) \\;\\ge\\; V_*(s) + \\sqrt{\\dfrac{C}{\\,m-1\\,}}, \\qquad \\tfrac{1}{m}\\!\\sum_{a}\\big(Q_t(s,a)-V_*(s)\\big)^2 = C $$
       <p>Overestimation lower bound (Theorem 1): when all $m$ actions share true value $V_*(s)$ and the estimates are unbiased ($\\sum_a (Q_t-V_*)=0$) with average squared error $C\\gt 0$, the $\\max$ overestimates by at LEAST $\\sqrt{C/(m-1)}$. The bound is tight; the double estimator's corresponding lower bound is zero.</p>`,

    whatItDoes:
      `<p>This is the Double DQN target (Section 4, the change from Equation 3 to its Double form). Read it
       right-to-left inside the $Q$:</p>
       <ul>
         <li><b>SELECT.</b> $\\arg\\max_a Q(S_{t+1},a;\\theta_t)$ &mdash; ask the ONLINE network 'which next
         action looks best?' and keep that action (a label, not a value).</li>
         <li><b>EVALUATE.</b> $Q(S_{t+1},\\ \\text{that action};\\ \\theta^-_t)$ &mdash; ask the TARGET
         network 'how good is THAT specific action?' and use ITS number.</li>
         <li><b>BUILD THE TARGET.</b> Add reward $R_{t+1}$ plus $\\gamma$ times that evaluated value.</li>
       </ul>
       <p>Standard DQN does both jobs with the target net's single $\\max$, so an action that the target net
       over-rates gets both selected AND reported at that inflated value. Double DQN cross-checks: the online
       net's favorite must SEPARATELY be rated highly by the target net to count. Independent estimation
       errors no longer reinforce each other, so the target stops drifting upward.</p>`,

    derivation:
      `<p><b>Why the single $\\max$ is biased upward (Section 3, Theorem 1).</b> conceptLink is null, so the
       full argument lives here.</p>
       <ul class="steps">
         <li><b>Set up the worst case.</b> Suppose at some state the TRUE value of every one of $m$ actions
         is identical, call it $V_*$. Our estimates $Q_t(s,a)$ are UNBIASED across actions
         ($\\sum_a (Q_t(s,a)-V_*) = 0$) &mdash; but noisy, with a fixed AVERAGE squared error
         $\\frac{1}{m}\\sum_a (Q_t(s,a)-V_*)^2 = C$ for some $C \\gt 0$ over the $m$ actions.</li>
         <li><b>Take the $\\max$.</b> The Q-learning target uses $\\max_a Q_t(s,a)$. Even though every
         estimate AVERAGES to $V_*$, the maximum of several noisy numbers is almost always ABOVE their
         common mean &mdash; the $\\max$ cherry-picks the largest positive error.</li>
         <li><b>The bound (Theorem 1).</b> The paper proves
         $\\max_a Q_t(s,a) \\;\\ge\\; V_* + \\sqrt{\\dfrac{C}{\\,m-1\\,}}$.
         The overestimation is at LEAST $\\sqrt{C/(m-1)}$: it grows with the noise $C$ and, for fixed total
         noise spread thinly, persists as $m$ grows. So MORE actions and MORE noise mean MORE overestimation.
         A single noisy $\\max$ cannot avoid it.</li>
         <li><b>Why decoupling removes it.</b> The bias came from SELECTION and EVALUATION sharing the same
         noisy estimates: the action selected because its error was large is the very action whose (large)
         value gets reported. Use a SECOND, independent estimate to evaluate, and the action chosen by the
         first estimate's lucky error has only an AVERAGE value in the second &mdash; no systematic inflation.
         The paper notes that under the same setup the double estimator's lower bound on overestimation is
         ZERO. &#8718;</li>
       </ul>
       <p>Double DQN is exactly this decoupling with the target network $\\theta^-$ standing in as the
       'second estimate' &mdash; free, because DQN already keeps it.</p>`,

    example:
      `<p><b>The two TD targets side by side, with numbers.</b> One transition. Reward $R_{t+1}=1$,
       discount $\\gamma=0.99$. The next state $S_{t+1}$ has TWO actions. The two networks disagree about
       them (estimation noise):</p>
       <ul>
         <li>Online net $\\theta$: $\\;Q(S_{t+1},a_0;\\theta)=3.0,\\quad Q(S_{t+1},a_1;\\theta)=4.0$.</li>
         <li>Target net $\\theta^-$: $\\;Q(S_{t+1},a_0;\\theta^-)=3.2,\\quad Q(S_{t+1},a_1;\\theta^-)=2.5$.</li>
       </ul>
       <p><b>Standard DQN (Eq. 3)</b> &mdash; $\\max$ over the TARGET net:</p>
       <ul class="steps">
         <li>$\\max_a Q(S_{t+1},a;\\theta^-) = \\max(3.2,\\ 2.5) = 3.2$  (it picks $a_0$, the target net's larger value).</li>
         <li>$Y^{DQN} = 1 + 0.99\\times 3.2 = 1 + 3.168 = \\mathbf{4.168}$.</li>
       </ul>
       <p><b>Double DQN (key equation)</b> &mdash; online net SELECTS, target net EVALUATES:</p>
       <ul class="steps">
         <li>SELECT: $\\arg\\max_a Q(S_{t+1},a;\\theta) = a_1$  (the online net prefers $a_1$, value $4.0 \\gt 3.0$).</li>
         <li>EVALUATE that same $a_1$ in the target net: $Q(S_{t+1},a_1;\\theta^-) = 2.5$.</li>
         <li>$Y^{DoubleDQN} = 1 + 0.99\\times 2.5 = 1 + 2.475 = \\mathbf{3.475}$.</li>
       </ul>
       <p><b>The gap is the overestimation:</b> $4.168 - 3.475 = 0.693$. DQN inflated the target by grabbing
       the target net's lucky $3.2$ (action $a_0$). Double DQN refused to: the online net's actual pick was
       $a_1$, which the target net rates at only $2.5$. The two nets had to AGREE for a value to count, and
       they did not &mdash; so the target stays lower and more honest. (These exact numbers are recomputed
       in the notebook cell.)</p>`,

    recipe:
      `<p>Turning a working DQN into a Double DQN is a one-line edit to the target computation:</p>
       <ol>
         <li>Keep everything from DQN: online net $Q(\\cdot;\\theta)$, target net $Q(\\cdot;\\theta^-)$,
         replay buffer, $\\epsilon$-greedy action selection, periodic target sync.</li>
         <li>Sample a minibatch of transitions $(s,a,r,s',\\text{done})$ from the buffer.</li>
         <li><b>SELECT</b> the next action with the ONLINE net: $a^* = \\arg\\max_{a'} Q(s',a';\\theta)$.</li>
         <li><b>EVALUATE</b> that action with the TARGET net: $q' = Q(s',a^*;\\theta^-)$.</li>
         <li>Build the target $y = r + \\gamma\\, q'\\,(1-\\text{done})$  (bootstrap zeroed at terminal states).</li>
         <li>Regress: minimise $\\big(y - Q(s,a;\\theta)\\big)^2$ by one gradient step on $\\theta$.</li>
         <li>Every $K$ steps copy $\\theta \\rightarrow \\theta^-$.</li>
       </ol>
       <p>The ONLY difference from vanilla DQN is steps 3&ndash;4: vanilla DQN collapses them into
       $q' = \\max_{a'} Q(s',a';\\theta^-)$.</p>`,

    results:
      `<p>From the abstract and Section 5: Double DQN "reduces the observed overestimations ... and ...
       leads to much better performance on several games." Across the 49-game Atari benchmark the paper
       reports higher normalized scores &mdash; the figures show DQN's value estimates floating well above
       the true discounted returns while Double DQN's estimates track them. (Treat the specific per-game
       numbers as the paper's; the numbers in this lesson's CODE / CODEVIZ are OUR small runs, labeled as
       such.)</p>`,

    implementBoundary:
      `<p><b>Track B (architecture).</b> You do NOT build a Q-network primitive from scratch &mdash; you
       import <code>nn.Linear</code>, <code>nn.ReLU</code>, an Adam optimizer, and a Gymnasium environment.
       You implement only the NOVEL piece: the Double-DQN target (select with online, evaluate with target),
       and you ABLATE it by flipping a single boolean back to the vanilla $\\max$ target so you can watch the
       overestimation return. The replay buffer / target-net plumbing is standard DQN, reused unchanged.</p>`,

    pitfalls:
      `<ul>
         <li><b>Selecting AND evaluating with the target net is NOT Double DQN.</b> A common bug is
         $Q(s',\\arg\\max_{a'}Q(s',a';\\theta^-);\\theta^-)$ &mdash; that is just vanilla DQN rewritten,
         since $\\arg\\max$ and $\\max$ over the SAME net agree. The $\\arg\\max$ must use the ONLINE net
         $\\theta$.</li>
         <li><b>Forgetting <code>no_grad</code> / detach on the target.</b> The target $y$ is treated as a
         constant; backprop must not flow through the target net. Wrap target computation in
         <code>torch.no_grad()</code>.</li>
         <li><b>Gather, do not max, on the evaluation step.</b> After the online net gives the action index,
         you must INDEX the target net's outputs at that action (<code>gather</code>), not take its max.</li>
         <li><b>It reduces, not eliminates, overestimation in practice.</b> The two nets are not fully
         independent (the target net is a lagged copy of the online net), so some bias remains. CartPole is
         easy enough that the policy difference can be small &mdash; the OVERESTIMATION of the value
         estimate is the cleaner thing to observe.</li>
         <li><b>CartPole is solved either way.</b> Double DQN shines on hard, noisy, long-horizon games. On
         CartPole both solve the task; you are watching the VALUE ESTIMATE, not the final score.</li>
       </ul>`,

    recall: [
      "State the Double DQN target $Y^{DoubleDQN}_t$ from memory.",
      "Which network SELECTS the next action and which EVALUATES it?",
      "Define $\\arg\\max_a$ vs $\\max_a$ &mdash; what does each return?",
      "Why is $\\max_a Q$ over noisy estimates biased upward, and which direction?",
      "State Theorem 1's lower bound on overestimation, $V_* + \\sqrt{C/(m-1)}$, and what $C$ and $m$ are."
    ],

    practice: [
      {
        q: `One transition: $R_{t+1}=0$, $\\gamma=0.9$, two next actions. Online net: $Q(s',a_0;\\theta)=5,\\ Q(s',a_1;\\theta)=2$. Target net: $Q(s',a_0;\\theta^-)=1,\\ Q(s',a_1;\\theta^-)=6$. Compute BOTH the DQN target and the Double DQN target, and explain the gap.`,
        steps: [
          { do: `DQN: take $\\max$ over the TARGET net.`, why: `$\\max(1,6)=6$, achieved at $a_1$. $Y^{DQN}=0+0.9\\times 6 = 5.4$.` },
          { do: `Double DQN: SELECT with the online net.`, why: `$\\arg\\max(5,2)=a_0$ &mdash; the online net prefers $a_0$.` },
          { do: `EVALUATE that $a_0$ in the target net.`, why: `$Q(s',a_0;\\theta^-)=1$, so $Y^{DoubleDQN}=0+0.9\\times 1 = 0.9$.` }
        ],
        answer: `$Y^{DQN}=5.4$, $Y^{DoubleDQN}=0.9$. DQN grabbed the target net's lucky $6$ (action $a_1$); Double DQN insisted on the ONLINE net's pick ($a_0$), which the target net rates at only $1$. The $4.5$ gap is the overestimation Double DQN removes here.`
      },
      {
        q: `ABLATION. In the Double DQN target you replace $\\arg\\max_{a'}Q(s',a';\\theta)$ with $\\arg\\max_{a'}Q(s',a';\\theta^-)$ &mdash; selecting with the TARGET net instead of the online net. What target does this collapse to, and why?`,
        steps: [
          { do: `Note that the outer evaluation already uses $\\theta^-$.`, why: `So now BOTH the selection and the evaluation use $\\theta^-$.` },
          { do: `Recall $Q(s',\\arg\\max_{a'}Q(s',a';\\theta^-);\\theta^-) = \\max_{a'}Q(s',a';\\theta^-)$.`, why: `Indexing a net at its own argmax just returns its max.` }
        ],
        answer: `It collapses to the vanilla DQN target $Y^{DQN}=r+\\gamma\\max_{a'}Q(s',a';\\theta^-)$. Selecting and evaluating with the SAME network is exactly the single-estimator $\\max$ that over-estimates &mdash; the decoupling, and its benefit, are gone.`
      },
      {
        q: `In the toy bias experiment, the TRUE value of all actions is $0$ and estimates are unbiased noise. Why does the single estimator's average come out ABOVE $0$ while the double estimator's stays at $0$?`,
        steps: [
          { do: `Single estimator: $\\max$ of several mean-zero noisy numbers.`, why: `The max selects the largest positive error, so its expectation is $\\gt 0$ &mdash; it grows with the noise (Theorem 1's $\\sqrt{C/(m-1)}$).` },
          { do: `Double estimator: pick the argmax with set A, read its value in INDEPENDENT set B.`, why: `The action that had a lucky-large error in A has only an AVERAGE (mean-zero) value in B.` }
        ],
        answer: `The single $\\max$ couples selection and evaluation on the same noisy sample, so the lucky positive error is both chosen and reported &mdash; a positive bias. The double estimator evaluates on independent noise, so the bias cancels and the average stays at the true value $0$.`
      }
    ]
  });

  window.CODE["paper-double-dqn"] = {
    lib: "gymnasium + PyTorch (runs in Colab)",
    runnable: false,
    explain:
      `<p>A DQN on <code>CartPole-v1</code> with a single boolean <code>DOUBLE</code> that switches the TD
       target between vanilla DQN ($\\max$ over the target net) and Double DQN (online net selects, target
       net evaluates). The cell first RECOMPUTES the worked example's two targets ($4.168$ vs $3.475$) to
       confirm the math, then trains and prints the mean predicted Q-value over time &mdash; with
       <code>DOUBLE=False</code> it climbs ABOVE the true return; with <code>DOUBLE=True</code> it stays
       lower. In <b>Colab</b>, torch is preinstalled; run <code>!pip install gymnasium</code> first. The
       only Double-DQN-specific lines are inside <code>td_target</code>.</p>`,
    code: `# Double DQN vs vanilla DQN on CartPole-v1 — Colab:  !pip install gymnasium
import random, collections
import numpy as np, torch, torch.nn as nn, gymnasium as gym

# ---- 0. Recompute the WORKED EXAMPLE (must match the lesson: 4.168 vs 3.475) ----
R, gamma_ex = 1.0, 0.99
q_online_ex = torch.tensor([3.0, 4.0])     # online net Q(s', .)
q_target_ex = torch.tensor([3.2, 2.5])     # target net Q^-(s', .)
y_dqn  = R + gamma_ex * q_target_ex.max()                       # DQN: max over target net
a_star = q_online_ex.argmax()                                    # Double DQN: online SELECTS
y_ddqn = R + gamma_ex * q_target_ex[a_star]                     # ... target net EVALUATES
print(f"worked example  Y_DQN={y_dqn:.3f}  Y_DoubleDQN={y_ddqn:.3f}  gap={y_dqn-y_ddqn:.3f}")
assert abs(float(y_dqn) - 4.168) < 1e-3 and abs(float(y_ddqn) - 3.475) < 1e-3

# ---- 1. The DQN, with a DOUBLE switch on the target ----
DOUBLE = True            # <-- ABLATION: set False for vanilla DQN, watch overestimation return
env = gym.make("CartPole-v1")
n_obs, n_act = env.observation_space.shape[0], env.action_space.n
def make_q():
    return nn.Sequential(nn.Linear(n_obs,128), nn.ReLU(),
                         nn.Linear(128,128), nn.ReLU(), nn.Linear(128,n_act))
q      = make_q()
q_targ = make_q(); q_targ.load_state_dict(q.state_dict())
opt    = torch.optim.Adam(q.parameters(), lr=1e-3)
buf    = collections.deque(maxlen=50_000)
gamma, batch, sync = 0.99, 64, 500

def act(state, eps):
    if random.random() < eps: return env.action_space.sample()
    with torch.no_grad():
        return int(q(torch.as_tensor(state, dtype=torch.float32)).argmax())

def td_target(r, s2, d):
    with torch.no_grad():                                  # target is a constant: no grad
        if DOUBLE:
            a_sel = q(s2).argmax(dim=1, keepdim=True)       # SELECT with ONLINE net (theta)
            q_next = q_targ(s2).gather(1, a_sel).squeeze(1) # EVALUATE with TARGET net (theta-)
        else:
            q_next = q_targ(s2).max(dim=1).values           # vanilla DQN: max over target net
        return r + gamma * q_next * (1.0 - d)

def learn():
    if len(buf) < batch: return None
    s,a,r,s2,d = map(np.array, zip(*random.sample(buf, batch)))
    s  = torch.as_tensor(s,  dtype=torch.float32); s2 = torch.as_tensor(s2, dtype=torch.float32)
    a  = torch.as_tensor(a,  dtype=torch.int64);   r  = torch.as_tensor(r,  dtype=torch.float32)
    d  = torch.as_tensor(d,  dtype=torch.float32)
    q_sa = q(s).gather(1, a.unsqueeze(1)).squeeze(1)        # Q(s,a;theta)
    y    = td_target(r, s2, d)
    loss = nn.functional.mse_loss(q_sa, y)
    opt.zero_grad(); loss.backward(); opt.step()
    return float(q_sa.mean())                               # track the mean PREDICTED Q-value

steps = 0
for ep in range(300):
    state,_ = env.reset(); eps = max(0.02, 1.0 - ep/150); done=False; qsum=[]
    while not done:
        action = act(state, eps)
        nxt, rew, term, trunc, _ = env.step(action); done = term or trunc
        buf.append((state, action, rew, nxt, float(term))); state = nxt
        m = learn();  steps += 1
        if m is not None: qsum.append(m)
        if steps % sync == 0: q_targ.load_state_dict(q.state_dict())
    if ep % 50 == 0 and qsum:
        print(f"ep {ep:3d}  mean predicted Q = {np.mean(qsum):6.2f}   ({'Double' if DOUBLE else 'vanilla'} DQN)")
# vanilla DQN's mean predicted Q drifts ABOVE the true return (~the episode length discounted);
# Double DQN keeps it lower and closer to truth. Flip DOUBLE to compare.`
  };

  window.CODEVIZ["paper-double-dqn"] = {
    question: "Does the single max really over-estimate, and does the double estimator fix it? Reproduce the paper's overestimation effect on a toy state whose true action-values are all 0.",
    charts: [
      {
        type: "line",
        title: "Estimated value of a state whose TRUE value is 0, vs estimation noise (8 actions)",
        xlabel: "estimation noise σ (std-dev of unbiased per-action error)",
        ylabel: "average estimated value over 4000 trials",
        series: [
          {
            name: "single max (DQN-style) — over-estimates",
            color: "#ff7b72",
            points: [[0.0, 0.0], [0.5, 0.717], [1.0, 1.429], [1.5, 2.144], [2.0, 2.86]]
          },
          {
            name: "double estimator (Double-DQN-style) — unbiased",
            color: "#4ea1ff",
            points: [[0.0, 0.0], [0.5, -0.007], [1.0, -0.004], [1.5, -0.008], [2.0, -0.01]]
          },
          {
            name: "true value = 0",
            color: "#7ee787",
            points: [[0.0, 0.0], [2.0, 0.0]]
          }
        ]
      }
    ],
    caption: "Our small run (numpy, seed 0; 8 actions, 4000 trials per noise level), not the paper's reported number. A single state where every action's TRUE value is exactly 0; per-action estimates are unbiased Gaussian noise of std-dev σ. The single max (DQN's target operator) drifts steadily ABOVE 0 — 0 → 2.86 as noise grows — exactly the overestimation Theorem 1 predicts ($\\sqrt{C/(m-1)}$, growing with noise). The double estimator (select with one independent set, evaluate with another — Double DQN's idea) stays pinned at 0. This is the paper's Figure-1 effect on a toy: decoupling selection from evaluation removes the upward bias.",
    code: `import numpy as np
# Reproduce Double DQN's core claim on a toy: a state with m actions, ALL true value 0.
# Estimates are unbiased Gaussian noise. Single max (DQN) over-estimates; double estimator does not.
rng = np.random.default_rng(0)
m, trials = 8, 4000
single, double = [], []
for sigma in [0.0, 0.5, 1.0, 1.5, 2.0]:
    s_vals, d_vals = [], []
    for _ in range(trials):
        qA = rng.normal(0, sigma, m)          # estimate set A (e.g. online net), true=0
        qB = rng.normal(0, sigma, m)          # estimate set B (e.g. target net), true=0, independent
        s_vals.append(qB.max())               # SINGLE max (DQN target operator)
        d_vals.append(qB[qA.argmax()])        # DOUBLE: select with A, evaluate with B
    single.append(round(float(np.mean(s_vals)), 3))
    double.append(round(float(np.mean(d_vals)), 3))
print("noise:  ", [0.0, 0.5, 1.0, 1.5, 2.0])
print("single: ", single)   # -> [0.0, 0.717, 1.429, 2.144, 2.86]   over-estimates
print("double: ", double)   # -> ~[0, 0, 0, 0, 0]                    unbiased`
  };
})();
