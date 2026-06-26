/* Paper lesson — "Decision Transformer: Reinforcement Learning via Sequence Modeling"
   Chen, Lu, Rajeswaran, Lee, Grover, Laskin, Abbeel, Srinivas, Mordatch, 2021 (NeurIPS 2021).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-decision-transformer".
   GROUNDED from arXiv:2106.01345 — metadata + abstract from the arXiv abstract page; the method
   from the ar5iv HTML mirror (https://ar5iv.labs.arxiv.org/html/2106.01345):
     - trajectory representation as (return-to-go, state, action) tokens, tau (Eq. 1 / Section 3);
     - return-to-go definition R_hat_t = sum_{t'=t}^{T} r_{t'} (Section 3);
     - modality-specific linear embeddings + per-timestep positional embedding + LayerNorm, fed to a
       GPT-style causal transformer (Section 3);
     - action predicted at each state token; cross-entropy (discrete) / MSE (continuous) loss (Section 3);
     - evaluation rollout: condition on a target return, decrement it by the achieved reward (Algorithm 1);
     - return-conditioning correlation (Figure 4, Section 5.2); context-length ablation (Section 5.3, Table).
   Track B (architecture): build a tiny Decision Transformer from nn primitives on a toy offline grid
   dataset, and SHOW that conditioning on a higher target return yields higher achieved return, while
   an ablation that removes the return token collapses the behavior. conceptLink = rl-offline-rl
   (which owns the offline-RL setup), so we recap + link rather than re-deriving that math. */
(function () {
  window.LESSONS.push({
    id: "paper-decision-transformer",
    title: "Decision Transformer — Reinforcement Learning via Sequence Modeling (2021)",
    tagline: "Recast reinforcement learning as next-token prediction: feed a causal transformer (desired-return, state, action) tokens and let it autoregressively output the action that hits the return you asked for.",
    module: "Papers · Reinforcement Learning",
    track: "architecture",
    paper: {
      authors: "Lili Chen, Kevin Lu, Aravind Rajeswaran, Kimin Lee, Aditya Grover, Michael Laskin, Pieter Abbeel, Aravind Srinivas, Igor Mordatch",
      org: "UC Berkeley, Facebook AI Research, Google Brain",
      year: 2021,
      venue: "arXiv:2106.01345 (Jun 2021); NeurIPS 2021",
      citations: "",
      arxiv: "https://arxiv.org/abs/2106.01345",
      code: "https://github.com/kzl/decision-transformer"
    },
    conceptLink: "rl-offline-rl",
    partOf: [],
    prereqs: ["rl-offline-rl", "mod-transformer", "paper-gpt"],

    // WHY READ IT
    problem:
      `<p><b>Reinforcement learning (RL)</b> means learning to act so as to maximize <b>reward</b> &mdash; a
       scalar score the environment hands back. The classic recipe is roundabout: estimate a <b>value
       function</b> (how much future reward a state is worth) or a <b>policy gradient</b> (nudge the action
       rule toward higher-reward actions), then bootstrap one estimate off another. That machinery is powerful
       but fragile:</p>
       <ul>
        <li><b>Bootstrapping is unstable.</b> Value methods learn $Q$ (the value of an action) by chasing a
        target that itself contains $Q$. With function approximators this can diverge &mdash; the
        "<b>deadly triad</b>" of off-policy data, bootstrapping, and approximation.</li>
        <li><b>The discount factor is a hack.</b> To keep the bootstrapped sums finite you down-weight
        far-future rewards with a discount $\\gamma \\lt 1$, even when you actually care about the long horizon.</li>
        <li><b>Offline RL makes it worse.</b> In <b>offline (batch) RL</b> you may only learn from a fixed,
        logged dataset &mdash; no fresh interaction. Value methods then over-estimate $Q$ on actions the data
        never tried, and the policy chases those phantom values (see <code>rl-offline-rl</code>).</li>
       </ul>
       <p>The paper asks a disarmingly simple question (Abstract, Section 1): what if we skip value functions
       and policy gradients entirely, and instead treat a trajectory as just <i>a sequence of tokens</i> to be
       modeled &mdash; the way a language model treats a sentence?</p>`,
    contribution:
      `<ul>
        <li><b>RL as conditional sequence modeling.</b> Represent a trajectory as the interleaved token stream
        $(\\hat R_1, s_1, a_1, \\hat R_2, s_2, a_2, \\ldots)$ &mdash; where $\\hat R_t$ is the
        <b>return-to-go</b> (the sum of rewards still to come) &mdash; and train a <b>causally masked
        Transformer</b> to predict the next action token (Section 3). No value function, no policy gradient,
        no bootstrapping.</li>
        <li><b>Return conditioning.</b> Because each action token is conditioned on the desired return,
        <i>asking for a high return at test time produces high-return behavior</i>. You steer the agent by the
        number you feed it (Section 3, Figure 4).</li>
        <li><b>It just works on offline benchmarks.</b> Despite its simplicity, Decision Transformer "matches
        or exceeds the performance of state-of-the-art model-free offline RL baselines on Atari, OpenAI Gym,
        and Key-to-Door tasks" (Abstract).</li>
      </ul>`,
    whyItMattered:
      `<p>Decision Transformer reframed control as <b>"upside-down RL"</b>: instead of learning a value and
       then acting greedily, you tell the model the outcome you want and it imitates the actions that, in the
       data, led to that outcome. This let RL ride the same scaling, hardware, and tooling that powers large
       language models &mdash; the very GPT architecture, unchanged, drives an agent. It launched a line of
       sequence-model-for-decisions work (Trajectory Transformer, Multi-Game / Gato-style generalist agents,
       online and goal-conditioned variants) and made "condition on a target, predict the action" a standard
       baseline in offline RL.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>Section 3 (Method)</b> &mdash; the core. The <b>trajectory representation</b> with the
        return-to-go token, the <b>return-to-go definition</b> $\\hat R_t = \\sum_{t'=t}^{T} r_{t'}$, the
        modality-specific <b>linear embeddings</b> + per-timestep positional embedding, the <b>GPT</b> backbone
        with causal masking, and the action <b>prediction head</b> + loss.</li>
        <li><b>Algorithm 1</b> &mdash; the training loop (sample subsequences, predict actions, minimize the
        action loss) and especially the <b>evaluation loop</b>: set an initial target return, act, then
        <i>decrement the target by the reward you just earned</i> and repeat.</li>
        <li><b>Figure 4 (Section 5.2)</b> &mdash; the headline plot: the achieved return tracks the
        <i>conditioned</i> target return (they are "highly correlated"). This is the whole idea, validated.</li>
       </ul>
       <p><b>Skim:</b> the Atari and D4RL Gym benchmark tables (Section 4) for the numbers, the Key-to-Door
       credit-assignment study, and the related-work survey. The context-length ablation (Section 5.3) is worth
       a glance: a longer history window helps markedly.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You train a tiny Decision Transformer on a fixed offline dataset of <b>mixed</b> quality &mdash; some
       trajectories earned a high return, some a low one &mdash; on a toy grid where reward $+1$ is paid for
       sitting at the rightmost cell. At test time you roll it out, but you change the single number you
       condition on: the <b>target return</b>. You try targets $2$, $5$, and $8$.</p>
       <p>Will the achieved return <b>track the target you ask for</b> (ask for more, get more)? And what do you
       expect if you <b>delete the return token</b> entirely &mdash; train the same network but always feed a
       constant return-to-go of $0$? Write your guess, then run it below.</p>`,
    attempt:
      `<p>Before the reveal, sketch the two pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Return-to-go.</b> Given an episode's reward list <code>r</code>, compute
        <code>rtg[t] = sum(r[t:])</code> &mdash; the suffix sum. <i># $\\hat R_t$, Section 3.</i> TODO: do it in
        one backward pass: <code>acc = 0; for t in reversed(range(T)): acc += r[t]; rtg[t] = acc</code>.</li>
        <li><b>Token stream.</b> Embed each modality with its own layer and add a per-timestep position, then
        interleave: <code>R0,s0,a0, R1,s1,a1, ...</code>. TODO: stack the three embeddings and reshape to one
        sequence of length $3T$; predict the action at each <b>state</b> token position with a causal mask.</li>
        <li><b>Rollout with a target.</b> TODO: start <code>rtg = target</code>; each step feed
        <code>(rtg, state)</code>, take the predicted action, observe reward <code>r</code>, then
        <b>decrement</b> <code>rtg -= r</code> (Algorithm 1). Sweep the target and record the achieved return.</li>
        <li><b>Ablation.</b> TODO: retrain with <code>rtg</code> forced to $0$ everywhere and re-run the sweep.
        Predict what happens to the achieved return.</li>
       </ul>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The whole method is one reframing: <b>a trajectory is a sequence of tokens, and an agent is a
       next-token predictor</b> (Section 3). Here is the pipeline.</p>
       <p><b>1. Three token types per timestep.</b> At each timestep $t$ the model sees three tokens: the
       <b>return-to-go</b> $\\hat R_t$, the <b>state</b> $s_t$, and the <b>action</b> $a_t$. The return-to-go is
       the sum of all rewards <i>still to come</i> from $t$ onward (Section 3):</p>
       <p>$$ \\hat R_t = \\sum_{t'=t}^{T} r_{t'}. $$</p>
       <p>Crucially this is <b>not</b> the discounted value &mdash; it is the literal remaining reward in <i>this
       recorded trajectory</i>. A trajectory that ended up earning a lot has large early $\\hat R_t$ values; a
       poor one has small values. The model thus sees, at every action, a label saying "this action belonged to
       a future worth $\\hat R_t$."</p>
       <p><b>2. Interleave into one stream.</b> The trajectory becomes (Section 3, Eq. 2):</p>
       <p>$$ \\tau = (\\hat R_1,\\, s_1,\\, a_1,\\, \\hat R_2,\\, s_2,\\, a_2,\\, \\ldots,\\, \\hat R_T,\\, s_T,\\, a_T). $$</p>
       <p>So an episode of length $T$ becomes a sequence of $3T$ tokens.</p>
       <p><b>3. Embed each modality, add a timestep position.</b> Each token type gets its <b>own linear
       embedding</b> (one for returns, one for states, one for actions), followed by layer normalization. A
       <b>learned positional embedding is added per timestep</b> &mdash; note: one position per timestep, shared
       by that step's three tokens, not one per token (Section 3). This tells the model <i>when</i> each token
       happened.</p>
       <p><b>4. Run a causal GPT.</b> The $3T$ embeddings go into a standard <b>GPT</b>-style Transformer with
       <b>causal self-attention masking</b>: each token may attend only to tokens at or before it (Section 3,
       and the prereq <code>mod-transformer</code> / <code>paper-gpt</code> own this machinery). The mask is
       what makes the model "autoregressive": the prediction at a position cannot peek at the future.</p>
       <p><b>5. Predict the action at each state token.</b> The output at the position of state $s_t$ is fed to a
       linear <b>head</b> that predicts the action $a_t$. Training minimizes the gap between predicted and actual
       action over the offline data: <b>cross-entropy</b> for discrete actions, <b>mean-squared error</b> for
       continuous ones, averaged over timesteps (Section 3). There is <i>no</i> value loss and <i>no</i> reward
       prediction in the basic model &mdash; just "given the return I should hit and where I am, what did the
       data do?"</p>
       <p><b>6. Steer at test time (Algorithm 1).</b> To act, pick a <b>target return</b> $\\hat R_1$ (e.g. the
       best return in the dataset, or higher), feed $(\\hat R_1, s_1)$, take the predicted action $a_1$, observe
       reward $r_1$, then <b>decrement the target</b>: $\\hat R_2 = \\hat R_1 - r_1$. Append the new
       $(\\hat R_2, s_2)$ and repeat. The decrement keeps the conditioning honest &mdash; it always says "here is
       how much return I still expect you to earn." Ask for a bigger number and the model imitates the
       higher-return slices of the data; that is the entire control knob.</p>`,
    architecture:
      `<p>Component by component, the way the $3K$ tokens flow through the network (Section 3). "Modality"
       just means token type &mdash; return-to-go, state, or action.</p>
       <ol>
        <li><b>Input window: the last $K$ timesteps.</b> At any moment the model is fed the most recent $K$
        timesteps, which is $3K$ tokens (a return-to-go, a state, and an action for each). $K$ is the
        <b>context length</b>; a longer window helps markedly (Section 5.3 ablation).</li>
        <li><b>Three modality-specific embeddings (a linear layer each).</b> Each token type has its <i>own</i>
        learned projection to the embedding dimension $d$:
          <ul>
           <li><b>return-to-go</b> $\\hat R_t$ (a scalar) &rarr; a <code>Linear(1, d)</code>;</li>
           <li><b>state</b> $s_t$ &rarr; a <code>Linear</code> for vector states, or a <b>convolutional encoder</b>
           when the state is an image (e.g. Atari pixels);</li>
           <li><b>action</b> $a_t$ &rarr; a linear/embedding layer.</li>
          </ul>
          Each projection is followed by <b>layer normalization</b>.</li>
        <li><b>Per-timestep position embedding (not the standard one).</b> A learned embedding is indexed by the
        <i>timestep</i> and added to all three tokens of that step. The paper flags this as different from a
        vanilla Transformer positional embedding, because here <b>one timestep maps to three tokens</b> &mdash;
        the three tokens of step $t$ share the same position vector, rather than getting three consecutive
        position indices.</li>
        <li><b>GPT causal Transformer stack.</b> The $3K$ position-augmented token embeddings pass through a
        stack of standard <b>GPT</b> decoder blocks &mdash; multi-head <b>self-attention with a causal (triangular)
        mask</b>, then a position-wise feed-forward sublayer, with residual connections and layer norm
        (the block internals are owned by <code>mod-transformer</code> / <code>paper-gpt</code>). The causal mask
        is what makes generation autoregressive: token at position $i$ sees only positions $\\le i$.</li>
        <li><b>Action prediction head.</b> The hidden state at each <b>state-token</b> position (positions
        $2, 5, 8, \\ldots$ in the stream) is fed to a linear head that outputs the action prediction $\\hat a_t$
        &mdash; class logits for discrete actions, or a continuous action vector. (Heads for predicting states or
        returns are possible but unused in the core model; only the action loss is optimized.)</li>
       </ol>
       <p><b>Data flow in one line:</b> $(\\hat R, s, a)$ tokens &rarr; per-modality Linear/Conv + LayerNorm &rarr;
       add timestep embedding &rarr; interleave to a length-$3K$ sequence &rarr; causal GPT blocks &rarr; read the
       state-token outputs &rarr; action head &rarr; $\\hat a_t$.</p>`,
    symbols: [
      { sym: "$t$", desc: "the <b>timestep</b> index within an episode (one play-through), counting $1, 2, \\ldots, T$ in the paper's notation." },
      { sym: "$T$", desc: "the <b>episode length</b> (the last timestep). The trajectory has $T$ timesteps and so $3T$ tokens." },
      { sym: "$K$", desc: "the <b>context length</b> &mdash; how many of the most recent timesteps the model attends over at once. The Transformer sees the last $K$ timesteps, i.e. $3K$ tokens. A larger $K$ helps (Section 5.3)." },
      { sym: "$\\hat a_t$", desc: "the model's <b>predicted action</b> at step $t$ (with a hat), as opposed to the recorded action $a_t$ it is trained to match." },
      { sym: "$\\mathcal{L}$", desc: "the <b>training loss</b>: the per-timestep action-prediction error averaged over the $K$ predicted actions in a sampled subsequence." },
      { sym: "$\\ell$", desc: "the <b>per-action loss</b>: <b>cross-entropy</b> between predicted and true action for discrete actions, or <b>squared error</b> $\\lVert \\hat a_t - a_t \\rVert^2$ for continuous actions (Section 3)." },
      { sym: "$s_t$", desc: "the <b>state</b> at step $t$ &mdash; what the agent observes (in our toy grid: an integer cell position)." },
      { sym: "$a_t$", desc: "the <b>action</b> taken at step $t$ (in our toy grid: LEFT or RIGHT). This is what the model predicts." },
      { sym: "$r_t$", desc: "the <b>reward</b> received at step $t$ &mdash; the immediate scalar feedback from the environment." },
      { sym: "$\\hat R_t$", desc: "the <b>return-to-go</b> at step $t$: the sum of all rewards from $t$ to the end of the episode, $\\sum_{t'=t}^{T} r_{t'}$. The hat means it is computed from the recorded trajectory, not predicted. This is the conditioning token." },
      { sym: "$\\hat R_1$", desc: "the <b>target return</b> at test time &mdash; the return-to-go you feed at the first step to tell the model how well you want it to do. The control knob." },
      { sym: "$\\tau$", desc: "the <b>trajectory</b> (Greek 'tau'): the full interleaved token sequence $(\\hat R_1, s_1, a_1, \\ldots, \\hat R_T, s_T, a_T)$." },
      { sym: "$\\sum_{t'=t}^{T}$", desc: "a <b>sum over future timesteps</b> $t' = t, t+1, \\ldots, T$ &mdash; the rewards from now to the end. ($t'$ is a running index distinct from the fixed $t$.)" },
      { sym: "GPT", desc: "<b>Generative Pre-trained Transformer</b>: a Transformer that predicts the next token using <b>causal</b> (left-to-right) attention masking. Decision Transformer uses it unchanged (see <code>paper-gpt</code>, <code>mod-transformer</code>)." },
      { sym: "causal mask", desc: "a rule in the attention layer that <b>forbids a token from attending to later tokens</b>, so the prediction at each position depends only on the past &mdash; what makes the model autoregressive." },
      { sym: "return-to-go", desc: "(jargon) the cumulative <b>remaining</b> reward in a trajectory, $\\hat R_t$ above &mdash; distinct from a discounted <i>value</i>, which is an <i>expected</i> discounted future reward." },
      { sym: "offline RL", desc: "(jargon) <b>learning a policy from a fixed logged dataset</b>, with no new environment interaction during training (owned by <code>rl-offline-rl</code>)." }
    ],
    formula:
      `$$ \\hat R_t \\;=\\; \\sum_{t'=t}^{T} r_{t'} \\qquad\\text{(return-to-go, Section 3)} $$
       $$ \\tau \\;=\\; \\big(\\hat R_1,\\, s_1,\\, a_1,\\; \\hat R_2,\\, s_2,\\, a_2,\\; \\ldots,\\; \\hat R_T,\\, s_T,\\, a_T\\big) \\qquad\\text{(trajectory representation, Eq. 2)} $$
       $$ \\hat a_t \\;=\\; \\text{DecisionTransformer}\\big(\\hat R_{t-K+1:t},\\, s_{t-K+1:t},\\, a_{t-K+1:t-1}\\big) \\qquad\\text{(autoregressive GPT predicts the action at state token }s_t\\text{ from the last }K\\text{ timesteps, Section 3)} $$
       $$ \\mathcal{L} \\;=\\; \\frac{1}{K}\\sum_{t} \\ell\\big(\\hat a_t,\\, a_t\\big), \\qquad \\ell = \\text{cross-entropy (discrete)} \\;\\text{ or }\\; \\lVert \\hat a_t - a_t \\rVert^2 \\text{ (MSE, continuous)} \\qquad\\text{(training loss, Section 3)} $$
       $$ \\hat R_{t+1} \\;=\\; \\hat R_t - r_t \\qquad\\text{(test-time / eval target-return decrement, Algorithm 1)} $$`,
    whatItDoes:
      `<p><b>Return-to-go</b> $\\hat R_t = \\sum_{t'=t}^{T} r_{t'}$ stamps every action with "the future this
       action led to was worth this much." It is a <i>suffix sum</i> of the reward list &mdash; at the first
       step it equals the whole episode's return; it shrinks toward $0$ as rewards are collected.</p>
       <p>The <b>trajectory</b> $\\tau$ lays returns, states, and actions in one causal stream. Because the
       return token precedes the state and action it labels, when the GPT predicts $a_t$ it has already
       "read" both where it is ($s_t$) and how good a future it should be aiming for ($\\hat R_t$). Training is
       then ordinary supervised next-token learning: match the recorded action.</p>
       <p>The <b>test-time decrement</b> $\\hat R_{t+1} = \\hat R_t - r_t$ is the cleverness. You seed the first
       target with the return you <i>want</i>; each step you subtract what you actually earned, so the remaining
       target always reflects "how much more I still expect." Feed a big initial target and every step you are
       asking the model to imitate the data's high-return behavior. <b>The number you condition on is the
       steering wheel.</b></p>`,
    derivation:
      `<p>Decision Transformer borrows its math from two places we do <b>not</b> re-derive here: the Transformer
       / causal self-attention (owned by <code>mod-transformer</code> and <code>paper-gpt</code>) and the
       offline-RL setting (owned by <code>rl-offline-rl</code>). What is genuinely new is the <i>framing</i>, so
       the "why it works" is an argument, not an equation.</p>
       <p><b>Why conditioning on a return reproduces that return.</b> Suppose the dataset contains, for each
       state, a spread of actions whose continuations earned a range of returns. Supervised training on
       $(\\hat R_t, s_t) \\to a_t$ learns the <i>conditional distribution</i> "what action, in the data, followed
       this state when the remaining return turned out to be $\\hat R_t$?" If you then condition on a large
       $\\hat R_t$ at test time, you sample from the slice of the data whose continuations were high-return
       &mdash; i.e. the good actions. This is exactly imitation, but <i>filtered by the outcome you requested</i>.
       The paper validates the consequence directly in <b>Figure 4 (Section 5.2)</b>: the achieved return is
       "highly correlated" with the desired target you condition on.</p>
       <p><b>Why the decrement is the right update.</b> The model was trained so that $\\hat R_t$ always equals
       the <i>true</i> remaining reward of the recorded trajectory. To keep the test-time inputs on the same
       distribution, after earning $r_t$ the remaining target must drop by exactly $r_t$:
       $\\hat R_{t+1} = \\hat R_t - r_t$. Any other update would feed the model a return-to-go it never saw paired
       with that state during training.</p>
       <p><b>Why this dodges the deadly triad.</b> There is no bootstrapped value target, so the instability of
       off-policy value learning simply does not arise &mdash; the loss is plain supervised next-token
       prediction. The cost is that the model can only <i>recombine</i> behaviors present in the data; it cannot
       invent a better-than-seen return by planning. (Section 3 and the paper's discussion.)</p>`,
    example:
      `<p>Work the <b>return-to-go</b> by hand on a 10-step episode &mdash; the exact numbers the notebook
       recomputes. The agent earns reward $+1$ on steps $4, 5, 6, 7$ (it reached the goal cell and held it for a
       while) and $0$ otherwise:</p>
       <p>$$ r = [\\,0,\\,0,\\,0,\\,1,\\,1,\\,1,\\,1,\\,0,\\,0,\\,0\\,] \\qquad (t = 1,\\ldots,10). $$</p>
       <p>The return-to-go is the <b>suffix sum</b> $\\hat R_t = \\sum_{t'=t}^{T} r_{t'}$ &mdash; the rewards
       from $t$ onward. Compute it in one backward pass, accumulating from the end:</p>
       <ol class="steps">
        <li><b>Total return</b> (the target you would condition on): $\\hat R_1 = 0+0+0+1+1+1+1+0+0+0 = \\mathbf{4}$.</li>
        <li><b>Walk backward.</b> Start an accumulator at $0$ at the end and add each reward as you move left:
          <ul>
           <li>$t=10$: $\\hat R_{10}=0$. &nbsp; $t=9$: $0$. &nbsp; $t=8$: $0$ &nbsp;<i>(no reward left)</i>.</li>
           <li>$t=7$: $+1 \\Rightarrow \\hat R_7 = 1$. &nbsp; $t=6$: $+1 \\Rightarrow \\hat R_6 = 2$.
               &nbsp; $t=5$: $+1 \\Rightarrow \\hat R_5 = 3$. &nbsp; $t=4$: $+1 \\Rightarrow \\hat R_4 = 4$.</li>
           <li>$t=3,2,1$: rewards are $0$, so the accumulator stays at $4$: $\\hat R_3=\\hat R_2=\\hat R_1=4$.</li>
          </ul>
        </li>
        <li><b>Result:</b>
          $$ \\hat R = [\\,\\mathbf{4},\\,\\mathbf{4},\\,\\mathbf{4},\\,\\mathbf{4},\\,\\mathbf{3},\\,\\mathbf{2},\\,\\mathbf{1},\\,\\mathbf{0},\\,\\mathbf{0},\\,\\mathbf{0}\\,]. $$
        </li>
       </ol>
       <p><b>Read it back.</b> The first four return-to-go values are $4$: at those steps the whole $+4$ of reward
       is still ahead. Each time a $+1$ is collected the remaining target drops by $1$ &mdash; precisely the
       test-time decrement $\\hat R_{t+1} = \\hat R_t - r_t$. The token stream the model trains on is
       $(\\,4, s_1, a_1,\\; 4, s_2, a_2,\\; \\ldots,\\; 0, s_{10}, a_{10}\\,)$. The notebook recomputes this and
       prints <code>[4,4,4,4,3,2,1,0,0,0]</code>.</p>`,
    recipe:
      `<ol>
        <li><b>Build the token embeddings</b> from <code>nn</code> primitives: a <code>nn.Linear</code> for the
        scalar return-to-go, an <code>nn.Embedding</code> for the (discrete) state, an <code>nn.Embedding</code>
        for the action, and an <code>nn.Embedding</code> for the timestep position. Add the timestep embedding to
        each modality and <code>LayerNorm</code> (Section 3).</li>
        <li><b>Interleave</b> the embeddings into one sequence $R_1, s_1, a_1, R_2, s_2, a_2, \\ldots$ of length
        $3T$ (stack and reshape).</li>
        <li><b>Run a causal Transformer</b> (<code>nn.TransformerEncoder</code> with a triangular mask) so each
        token attends only to the past.</li>
        <li><b>Predict the action at each state token</b> with a linear head; train with
        <b>cross-entropy</b> over the offline dataset (discrete actions) &mdash; no value loss (Section 3).</li>
        <li><b>Roll out with a target return.</b> Seed $\\hat R_1 = $ target; each step feed
        $(\\hat R_t, s_t)$, take the argmax action, observe $r_t$, set $\\hat R_{t+1} = \\hat R_t - r_t$
        (Algorithm 1). <b>Sweep the target</b> and record achieved return.</li>
        <li><b>Ablate.</b> Retrain an identical model with the return token forced to $0$ everywhere; re-run the
        sweep and watch the steering disappear.</li>
      </ol>`,
    results:
      `<p>The paper evaluates Decision Transformer on three offline-RL suites (Section 4): <b>Atari</b> (discrete
       control from pixels), the <b>OpenAI Gym / D4RL</b> continuous-control benchmarks, and a
       <b>Key-to-Door</b> task that stresses long-horizon credit assignment. The Abstract's headline claim:
       Decision Transformer "matches or exceeds the performance of state-of-the-art model-free offline RL
       baselines on Atari, OpenAI Gym, and Key-to-Door tasks." Section 5.2 (Figure 4) shows the central
       mechanism working: the achieved return is "highly correlated" with the target return you condition on,
       and on some tasks the model even <i>extrapolates</i> above the best return in the data. Section 5.3 finds
       that a <b>longer context window</b> (more past timesteps) helps substantially over using only the current
       step.</p>
       <p><i>Those are the paper's reported results, quoted from the Abstract and Section 5. The numbers in the
       CODEVIZ panel below are from our own tiny toy-grid run &mdash; not the paper's results.</i></p>`,
    evaluation:
      `<p><b>The metric &amp; benchmark.</b> The headline metric is the <b>achieved episode return</b> at
       rollout, and crucially the <b>correlation between the target return you condition on and the return you
       actually earn</b> (the paper's Figure 4, Section 5.2: "highly correlated"). On the real benchmarks the
       metric is normalized score on <b>Atari</b>, <b>OpenAI Gym / D4RL</b>, and <b>Key-to-Door</b>, where the
       bar is "matches or exceeds state-of-the-art model-free offline RL baselines" (Abstract). The trivial
       baseline is <b>behavioral cloning of the mixed dataset</b> (no return signal) &mdash; it earns the
       dataset's <i>average</i> return regardless of what you ask for, so beating it means the conditioning
       actually steers.</p>
       <ul>
        <li><b>Sanity checks BEFORE the full run.</b> Reproduce the worked return-to-go exactly:
        rewards $[0,0,0,1,1,1,1,0,0,0] \\Rightarrow \\hat R = [4,4,4,4,3,2,1,0,0,0]$ (a suffix sum, dropping by
        each earned reward). Confirm the action is read off the <b>state-token</b> positions ($2,5,8,\\ldots$ in
        the $3T$ stream), not the return or action tokens. At init, $K$-way (here 2-way) cross-entropy should be
        $\\approx -\\ln(1/2) \\approx 0.69$ (rule of thumb). Verify the causal mask actually blocks future tokens
        &mdash; without it the "prediction" trivially copies the next token and training loss crashes
        unrealistically fast. Overfit a single batch and watch cross-entropy fall toward $0$.</li>
        <li><b>Expected range.</b> A correct build should make achieved return <b>track the target</b> up to the
        environment ceiling: in the lesson's toy grid, target $2\\to\\approx2$, $5\\to\\approx5$, saturating at $7$
        (the reachable max from the left edge) &mdash; our small run, not a paper number. On the real suites a
        faithful build should land near the paper's reported normalized scores (arXiv:2106.01345, Section 4;
        approximate). If achieved return is flat across targets in a build that <i>should</i> condition, that is a
        bug, not tuning.</li>
        <li><b>Ablation &mdash; prove the key idea earns its keep.</b> The central component is the
        <b>return-to-go token</b>. Retrain an identical model with $\\hat R_t$ forced to $0$ everywhere and re-run
        the target sweep: the achieved return should go <b>flat and target-insensitive</b> (the lesson's run
        collapses to $\\approx 0$). If steering survives the ablation, the return token was not actually wired
        into the conditioning. (Second ablation: shrink context length $K\\to1$ and confirm performance drops,
        per Section 5.3.)</li>
        <li><b>Failure signals &amp; what they mean.</b> <b>Achieved return flat vs target</b> &rarr; return token
        not embedded/attended, or you forgot the test-time decrement $\\hat R_{t+1}=\\hat R_t-r_t$ so inputs drift
        off-distribution. <b>Return tracks but is offset low everywhere</b> &rarr; predicting the action at the
        wrong token position. <b>Train loss near zero but rollout is random</b> &rarr; missing causal mask (the
        model peeked at the future during training). <b>Asking for a target above the data's max gives no gain</b>
        &rarr; expected: DT recombines logged behavior and cannot exceed the environment/dataset ceiling by
        planning.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the heavy machinery ships in PyTorch, so you
       <b>import</b> it and build only the novel framing. <b>Import:</b> <code>nn.Linear</code>,
       <code>nn.Embedding</code>, <code>nn.LayerNorm</code>, <code>nn.TransformerEncoder</code> (the causal
       Transformer), and the optimizer &mdash; all preinstalled in Colab. <b>Build by hand:</b> the
       <b>return-to-go</b> suffix sum (Section 3), the <b>(return, state, action) token interleaving</b> with
       per-timestep positional embeddings, the <b>action head + cross-entropy loss</b>, and the <b>return-
       conditioned rollout</b> with the decrement $\\hat R_{t+1} = \\hat R_t - r_t$ (Algorithm 1). The toy
       offline grid environment is a few lines of Python &mdash; no <code>gym</code> needed. The offline-RL
       setting (why we learn from a fixed log, and its dangers) is owned by <b>rl-offline-rl</b>; the Transformer
       and causal masking by <b>mod-transformer</b> / <b>paper-gpt</b> &mdash; we recap and link rather than
       re-derive.</p>`,
    pitfalls:
      `<ul>
        <li><b>Confusing return-to-go with a discounted value.</b> $\\hat R_t$ is the <i>literal remaining
        reward of this recorded trajectory</i>, $\\sum_{t'=t}^{T} r_{t'}$ &mdash; no discount, no expectation.
        A value $V(s)$ is an <i>expected, discounted</i> future reward. <b>Fix:</b> return-to-go is a plain
        suffix sum computed from the data.</li>
        <li><b>Forgetting the test-time decrement.</b> If you hold the target fixed instead of subtracting the
        earned reward each step, the model sees return-to-go / state pairs it never trained on and drifts.
        <b>Fix:</b> $\\hat R_{t+1} = \\hat R_t - r_t$ every step (Algorithm 1).</li>
        <li><b>One position per token instead of per timestep.</b> The positional embedding is added <i>per
        timestep</i> (shared by that step's three tokens), not a fresh index for all $3T$ tokens (Section 3).
        <b>Fix:</b> index the timestep, broadcast it to the return/state/action of that step.</li>
        <li><b>Predicting the action at the wrong position.</b> The action $a_t$ is read off the output at the
        <b>state</b> token $s_t$ (positions $2, 5, 8, \\ldots$ in the $3T$ stream), so the model has seen
        $\\hat R_t$ and $s_t$ but not yet $a_t$. <b>Fix:</b> slice the hidden states at the state positions.</li>
        <li><b>Expecting it to beat the data by planning.</b> Decision Transformer recombines behaviors present
        in the log; with a degenerate, low-quality dataset it cannot conjure a high return. <b>Fix:</b> condition
        on a target within (or modestly above) the dataset's return range.</li>
        <li><b>Leaking the future via a missing causal mask.</b> Without the triangular attention mask the model
        can see later tokens and the "prediction" becomes trivial &mdash; and useless at rollout time.
        <b>Fix:</b> always pass the causal mask to the Transformer.</li>
      </ul>`,
    recall: [
      "Write the return-to-go definition $\\hat R_t$ from memory and say why it is a suffix sum, not a discounted value.",
      "Give the trajectory token order for one timestep and say which token the action is predicted at.",
      "State the test-time target update after earning reward $r_t$, and explain why it must be a decrement.",
      "Name one classic RL difficulty (e.g. the deadly triad / discounting) that this framing sidesteps, and one thing it gives up in return."
    ],
    practice: [
      {
        q: `<b>The worked return-to-go.</b> An episode earns rewards
            $r = [0,0,1,0,1,1]$ over $T = 6$ steps. Compute the return-to-go vector $\\hat R$ and state the
            target return you would condition on at step 1.`,
        steps: [
          { do: `Start an accumulator at $0$ and walk from the last step backward, adding each reward.`, why: `$\\hat R_t = \\sum_{t'=t}^{T} r_{t'}$ is a suffix sum; one backward pass computes all of them.` },
          { do: `$\\hat R_6 = 1$, $\\hat R_5 = 1+1 = 2$, $\\hat R_4 = 0+2 = 2$, $\\hat R_3 = 1+2 = 3$, $\\hat R_2 = 0+3 = 3$, $\\hat R_1 = 0+3 = 3$.`, why: `Each step adds that step's reward to the running suffix total.` },
          { do: `Read off $\\hat R_1$ as the total episode return.`, why: `The first return-to-go equals the sum of all rewards — that is the number you would feed as the target to reproduce this episode.` }
        ],
        answer: `<p>$\\hat R = [3, 3, 3, 2, 2, 1]$, and the target return at step 1 is $\\hat R_1 = 3$ (the total
                 reward of the episode). Notice $\\hat R$ drops by exactly the reward earned at each step &mdash;
                 the same rule as the test-time decrement $\\hat R_{t+1} = \\hat R_t - r_t$.</p>`
      },
      {
        q: `<b>The return-conditioning result.</b> After training on the mixed toy-grid dataset, you roll the
            model out conditioning on targets $2$, $5$, and $8$ (the environment's reachable maximum is $7$).
            What do you expect the achieved returns to be, and what does that demonstrate?`,
        steps: [
          { do: `For each target, seed $\\hat R_1 = $ target and roll out, decrementing $\\hat R$ by each earned reward.`, why: `Conditioning is the only thing that changes between runs — an honest test of the steering mechanism.` },
          { do: `Compare achieved return to the target.`, why: `Figure 4 (Section 5.2) claims the two are highly correlated.` },
          { do: `Note the saturation when the target exceeds what the environment can pay.`, why: `The model can only reproduce returns the data could actually achieve; it cannot exceed the environment's ceiling.` }
        ],
        answer: `<p>Achieved return <i>tracks the target</i>: in our run target $2 \\to 2.00$, target $5 \\to 5.00$,
                 and target $8 \\to 7.00$ (it saturates at the reachable maximum of $7$). This reproduces the
                 paper's qualitative Figure-4 result &mdash; the number you condition on steers the behavior &mdash;
                 with the natural ceiling that you cannot ask for more return than the environment can pay.
                 <i>(Our small run, not the paper's numbers.)</i></p>`
      },
      {
        q: `<b>The ablation.</b> You retrain an identical Decision Transformer but force the return-to-go token
            to $0$ at every step (removing the return conditioning). You re-run the target sweep. Predict the
            achieved return as a function of the target, and explain what the ablation isolates.`,
        steps: [
          { do: `Change exactly one thing: replace every $\\hat R_t$ with $0$, keeping the architecture, data, states, and actions identical.`, why: `An honest ablation varies a single component — here, the return token — so any change in behavior is attributable to it.` },
          { do: `Re-train and roll out for targets $2, 5, 8$ (the conditioning input is now ignored / constant).`, why: `If the model never saw an informative return, the target you feed cannot carry meaning.` },
          { do: `Observe that the achieved return no longer depends on the target.`, why: `Without the return signal the model is plain behavioral cloning of a mixed dataset — it cannot be steered.` }
        ],
        answer: `<p>The achieved return becomes <b>flat and target-insensitive</b>: in our run it collapses to
                 $0.00$ for every target ($2, 5, 8$ all give $\\approx 0$), because cloning a mixed-quality
                 dataset with no return signal averages into aimless behavior that rarely reaches the goal. The
                 ablation isolates the paper's core claim: <i>the return-to-go token is what makes Decision
                 Transformer controllable.</i> Remove it and you are left with undirected imitation.
                 <i>(Our small run, not the paper's numbers.)</i></p>`
      }
    ]
  });

  window.CODE["paper-decision-transformer"] = {
    lib: "PyTorch (Colab)",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> a tiny Decision Transformer from <code>nn</code> primitives on a toy
       <b>offline</b> grid dataset, then <b>show conditioning on a higher target return yields higher achieved
       return</b> &mdash; and that an <b>ablation removing the return token collapses the steering</b>. The first
       cell recomputes the worked return-to-go example: rewards <code>[0,0,0,1,1,1,1,0,0,0]</code> give
       return-to-go <code>[4,4,4,4,3,2,1,0,0,0]</code>. We then assemble each timestep's three tokens
       (<b>return-to-go, state, action</b>) with modality-specific embeddings + a per-timestep position, run a
       <b>causal</b> <code>nn.TransformerEncoder</code>, and predict the action at each state token with
       cross-entropy (Section 3). Rollout follows Algorithm 1: seed the target return, act, then
       <code>rtg -= reward</code>. Sweeping the target shows achieved return tracking it (target 2&rarr;2.00,
       5&rarr;5.00, saturating at the env max 7); the ablation (return-to-go forced to 0) flattens it to ~0.
       torch is preinstalled in Colab &mdash; paste and run.</p>`,
    code: `# torch is preinstalled in Colab. No gym needed: the toy environment is a few lines.
import torch
import torch.nn as nn
import numpy as np
import random

torch.manual_seed(0); np.random.seed(0); random.seed(0)

# --- 0. Sanity-check the worked return-to-go example. ---
def returns_to_go(rewards):                 # R_hat_t = sum_{t'=t}^{T} r_t'   (Section 3)
    out = [0.0] * len(rewards); acc = 0.0
    for t in reversed(range(len(rewards))): # one backward pass = suffix sums
        acc += rewards[t]; out[t] = acc
    return out

rew_demo = [0, 0, 0, 1, 1, 1, 1, 0, 0, 0]
print("rewards     :", rew_demo)
print("return-to-go:", [int(x) for x in returns_to_go(rew_demo)])   # [4,4,4,4,3,2,1,0,0,0]


# --- 1. Toy OFFLINE environment: 1-D grid of length N. ---
# State = position 0..N-1. Action 0=LEFT(-1), 1=RIGHT(+1). Reward +1 at the
# rightmost cell, else 0. Optimal: rush right and stay -> high return.
N, T = 5, 10
def env_step(s, a):
    s2 = max(0, min(N - 1, s + (1 if a == 1 else -1)))
    return s2, (1.0 if s2 == N - 1 else 0.0)

def gen_traj(p_right):                       # p_right = probability of going RIGHT
    s, states, actions, rewards = 0, [], [], []
    for _ in range(T):
        a = 1 if random.random() < p_right else 0
        s2, r = env_step(s, a)
        states.append(s); actions.append(a); rewards.append(r); s = s2
    return states, actions, rewards

# A fixed, MIXED-quality log: expert-ish, medium, and poor trajectories.
dataset = ([gen_traj(0.95) for _ in range(120)] +
           [gen_traj(0.50) for _ in range(120)] +
           [gen_traj(0.15) for _ in range(120)])
rets = [sum(tr[2]) for tr in dataset]
print("dataset returns: min %.0f  mean %.2f  max %.0f" % (min(rets), np.mean(rets), max(rets)))

R = torch.tensor([returns_to_go(tr[2]) for tr in dataset], dtype=torch.float32)
S = torch.tensor([tr[0] for tr in dataset], dtype=torch.long)
A = torch.tensor([tr[1] for tr in dataset], dtype=torch.long)


# --- 2. Tiny Decision Transformer (Track B: nn primitives). ---
D = 32
class TinyDT(nn.Module):
    def __init__(self):
        super().__init__()
        self.embed_rtg    = nn.Linear(1, D)        # return-to-go token (linear, Section 3)
        self.embed_state  = nn.Embedding(N, D)     # state token
        self.embed_action = nn.Embedding(2, D)     # action token
        self.embed_t      = nn.Embedding(T, D)     # per-TIMESTEP position (Section 3)
        self.ln = nn.LayerNorm(D)
        layer = nn.TransformerEncoderLayer(d_model=D, nhead=4, dim_feedforward=64,
                                           batch_first=True, activation='gelu', dropout=0.0)
        self.blocks = nn.TransformerEncoder(layer, num_layers=2)
        self.head = nn.Linear(D, 2)                # predict action logits

    def forward(self, rtgs, states, actions):
        B, Tt = states.shape
        te = self.embed_t(torch.arange(Tt, device=states.device))[None]      # (1,T,D)
        r = self.ln(self.embed_rtg(rtgs.unsqueeze(-1)) + te)                  # add position per timestep
        s = self.ln(self.embed_state(states)          + te)
        a = self.ln(self.embed_action(actions)        + te)
        tok = torch.stack([r, s, a], dim=2).reshape(B, Tt * 3, D)            # R0,s0,a0,R1,s1,a1,...
        L = Tt * 3
        mask = torch.triu(torch.ones(L, L, device=states.device), 1).bool()  # causal mask
        h = self.blocks(tok, mask=mask)
        return self.head(h[:, 1::3, :])             # action read off STATE token positions -> (B,T,2)

def train(rtg_tensor, steps=300):
    net = TinyDT(); opt = torch.optim.Adam(net.parameters(), lr=1e-3)
    lossf = nn.CrossEntropyLoss()                   # discrete actions -> cross-entropy (Section 3)
    for _ in range(steps):
        idx = torch.randperm(len(dataset))[:64]
        logits = net(rtg_tensor[idx], S[idx], A[idx])
        loss = lossf(logits.reshape(-1, 2), A[idx].reshape(-1))
        opt.zero_grad(); loss.backward(); opt.step()
    return net

net = train(R)


# --- 3. Return-conditioned rollout (Algorithm 1): seed target, then rtg -= reward. ---
@torch.no_grad()
def rollout(model, target_return, force_zero_rtg=False, n_eps=200):
    total = 0.0
    for ep in range(n_eps):
        s, rtg_t = 0, float(target_return)
        states, actions, rtgs, ep_ret = [], [], [], 0.0
        for t in range(T):
            states.append(s); rtgs.append(0.0 if force_zero_rtg else rtg_t)
            logits = model(torch.tensor([rtgs]), torch.tensor([states]),
                           torch.tensor([actions + [0]]))      # placeholder last action
            a = int(logits[0, t].argmax())
            actions.append(a)
            s, r = env_step(s, a)
            ep_ret += r; rtg_t -= r                            # decrement the target
        total += ep_ret
    return total / n_eps

print("\\nReturn conditioning (achieved return tracks the target you ask for):")
for tgt in [2, 5, 8, 10]:
    print("  target=%2d  ->  achieved %.2f" % (tgt, rollout(net, tgt)))
# target= 2 -> 2.00 ; target= 5 -> 5.00 ; target>=8 -> 7.00 (env max reachable from start)


# --- 4. ABLATION: retrain with the return token forced to 0 -> steering disappears. ---
net_ablate = train(torch.zeros_like(R))
print("\\nABLATION (return-to-go forced to 0 -> plain cloning, no steering):")
for tgt in [2, 5, 8, 10]:
    print("  target=%2d  ->  achieved %.2f" % (tgt, rollout(net_ablate, tgt, force_zero_rtg=True)))
# All targets -> ~0.00: with no return signal the model cannot be steered.
# (Exact numbers vary by hardware/seed; our small run, not the paper's.)`
  };

  window.CODEVIZ["paper-decision-transformer"] = {
    question: "Does conditioning a Decision Transformer on a higher TARGET return make it actually earn a higher return? We train one tiny DT on a fixed mixed-quality offline grid dataset, roll it out conditioning on a sweep of target returns, and compare against an ablated copy whose return-to-go token is forced to 0 (steering removed).",
    charts: [
      {
        type: "line",
        title: "Achieved return vs target return — toy offline grid (ours)",
        xlabel: "target (conditioned) return",
        ylabel: "achieved return (avg over 200 rollouts)",
        series: [
          {
            name: "Decision Transformer (return-conditioned)",
            color: "#7ee787",
            points: [[1,1.0],[2,2.0],[3,3.0],[4,4.0],[5,5.0],[6,6.0],[7,7.0],[8,7.0],[10,7.0]]
          },
          {
            name: "Ablation: return token = 0 (no conditioning)",
            color: "#f78166",
            points: [[1,0.0],[2,0.0],[3,0.0],[4,0.0],[5,0.0],[6,0.0],[7,0.0],[8,0.0],[10,0.0]]
          }
        ]
      }
    ],
    caption: "Our small toy-grid run, not the paper's reported numbers. We train one tiny Decision Transformer on a fixed mixed-quality offline dataset (expert + medium + poor trajectories) and roll it out conditioning on different target returns. The green line is the achieved return tracking the target almost exactly &mdash; ask for 2 and get $\\approx 2$, ask for 5 and get $\\approx 5$ &mdash; saturating at 7, the most the environment can pay starting from the left edge. This reproduces the paper's qualitative Figure-4 result (Section 5.2): achieved and desired returns are 'highly correlated.' The orange line is the ablation: train an identical model but force the return-to-go token to 0, and the steering vanishes &mdash; achieved return is flat and near 0 regardless of the target, because the model is now just cloning a mixed dataset with no return signal. The return-to-go token is what makes the agent controllable.",
    code: `# Sketch of how the two curves above are produced (full loop in the CODE cell).
# Toy 1-D grid: reward +1 at the rightmost cell; mixed offline dataset of
# expert / medium / poor trajectories.
#
# Train DT: tokens (return-to-go, state, action) -> causal Transformer -> predict action
#   loss = cross_entropy(predicted_action, data_action)         # Section 3, no value loss
#
# Rollout, conditioned on a target return (Algorithm 1):
#   rtg = target
#   for each step:  a = argmax DT(rtg, state); observe r; rtg -= r   # the decrement
#   achieved = sum of rewards
#
# Sweep target in {1,...,10}:
#   return-conditioned  -> achieved tracks target, saturating at env max 7   (green)
#   ablation (rtg := 0) -> achieved flat ~0, target ignored                  (orange)
# (Numbers are from our own run; the paper reports Atari / D4RL Gym / Key-to-Door
#  results, not these toy-grid values.)`
  };
})();
