/* Paper lesson — "Direct Preference Optimization: Your Language Model is Secretly a
   Reward Model" (DPO), Rafailov, Sharma, Mitchell, Ermon, Manning, Finn, NeurIPS 2023.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-dpo".
   GROUNDED from arXiv:2305.18290 (abstract) and the ar5iv HTML mirror:
   Section 3 Preliminaries (Bradley-Terry, Eqn. 1; KL-constrained RLHF objective, Eqn. 3);
   Section 4 Direct Preference Optimization (optimal policy closed form, Eqn. 4; partition
   function Z(x); implicit reward reparameterization, Eqn. 5; Bradley-Terry in policy form,
   Eqn. 6; the DPO loss, Eqn. 7; the DPO gradient and its weighting term); Section 6
   Experiments (sentiment beta sweep {0.05,0.1,1,5}).
   Track B (architecture): compose with torch (log-softmax "policy" + frozen reference),
   implement the NOVEL part by hand — the DPO loss on preference pairs. */
(function () {
  window.LESSONS.push({
    id: "paper-dpo",
    title: "DPO — Direct Preference Optimization: Your Language Model is Secretly a Reward Model (2023)",
    tagline: "Align a language model to human preferences with one classification loss — no reward model, no reinforcement learning.",
    module: "Papers · Transformers & LLMs",
    track: "architecture",
    paper: {
      authors: "Rafael Rafailov, Archit Sharma, Eric Mitchell, Stefano Ermon, Christopher D. Manning, Chelsea Finn",
      org: "Stanford University",
      year: 2023,
      venue: "arXiv:2305.18290 (May 2023); NeurIPS 2023",
      citations: "",
      arxiv: "https://arxiv.org/abs/2305.18290",
      code: "https://github.com/eric-mitchell/direct-preference-optimization"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["paper-ppo", "rl-ppo", "rl-policy-gradients", "dl-cross-entropy", "ml-logistic-regression", "dl-language-model", "pt-autograd", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p>To make a language model (a model that assigns a probability to each next word, so it can
       generate text) <b>helpful</b> and <b>safe</b>, we want it to prefer the kinds of answers people
       like. The standard recipe was <b>RLHF</b> (reinforcement learning from human feedback), and it
       has three stages: (1) collect human comparisons &mdash; for the same prompt, which of two answers
       is better; (2) fit a separate <b>reward model</b> that scores any answer; (3) use
       <b>reinforcement learning</b> (typically PPO, Proximal Policy Optimization) to push the language
       model toward high-reward answers without drifting too far from where it started.</p>
       <p>That pipeline is heavy. From the abstract:</p>
       <blockquote>"However, RLHF is a complex and often unstable procedure, first fitting a reward model
       that reflects the human preferences, and then fine-tuning the large unsupervised LM using
       reinforcement learning to maximize this estimated reward without drifting too far from the
       original model." (Abstract)</blockquote>
       <p>Reinforcement learning here means sampling answers from the model during training, scoring
       them, and nudging the model &mdash; a loop that is fiddly to tune and easy to destabilize. The
       open question: can we get the <i>same</i> result with a single, stable supervised loss?</p>`,
    contribution:
      `<ul>
        <li><b>Skip the reward model and the reinforcement learning.</b> DPO (Direct Preference
        Optimization) fine-tunes the language model <i>directly</i> on the preference comparisons with
        one classification-style loss. No separate reward network, no sampling loop, no PPO.</li>
        <li><b>"Your language model is secretly a reward model."</b> The paper shows (Section 4) that the
        usual RLHF objective has a closed-form optimal policy, and you can <i>rearrange</i> it to read the
        reward straight off the policy: $r(x,y)=\\beta\\log\\frac{\\pi_\\theta(y|x)}{\\pi_{\\text{ref}}(y|x)}$.
        So the policy itself <i>implicitly</i> defines a reward &mdash; no need to train one.</li>
        <li><b>A simple, stable loss.</b> Plugging that implicit reward into the Bradley-Terry preference
        model gives a logistic-regression-style loss over preference pairs (their <b>Equation 7</b>). It is
        the whole method: stable, lightweight, and easy to implement.</li>
      </ul>`,
    whyItMattered:
      `<p>DPO became the default way to align open language models. Because it is just a loss over
       preference pairs &mdash; no reward model, no reinforcement-learning loop &mdash; it is far easier and
       cheaper to run than PPO-based RLHF, and it slots into any supervised training stack. It launched a
       wave of follow-ups (IPO, KTO, ORPO, and others) that tweak the same preference-loss skeleton, and it
       is now a standard step in post-training recipes for instruction-following chat models. The lasting
       idea: a language model and its reference together already encode a reward, so preference alignment can
       be a single classification problem.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3 (Preliminaries)</b> &mdash; the <b>Bradley-Terry</b> preference model (their
        <b>Equation 1</b>): the probability that answer $y_1$ beats $y_2$ as a logistic function of their
        reward gap. And the <b>KL-constrained reward objective</b> (their <b>Equation 3</b>) that RLHF
        maximizes. These set up everything.</li>
        <li><b>&sect;4 (Direct Preference Optimization)</b> &mdash; the whole method. The closed-form optimal
        policy (<b>Equation 4</b>), the partition function $Z(x)$, the <b>reward reparameterization</b>
        (<b>Equation 5</b>), Bradley-Terry rewritten in policy form (<b>Equation 6</b>), and the
        <b>DPO loss</b> (<b>Equation 7</b>) &mdash; the equation you transcribe and implement. Read the
        paragraph on <b>what the DPO gradient does</b>: it up-weights pairs the model currently orders
        wrong.</li>
        <li><b>&sect;6 (Experiments)</b> &mdash; sentiment control, summarization, and dialogue. Note the
        $\\beta$ sweep $\\{0.05, 0.1, 1, 5\\}$ for the sentiment task (&sect;6.1).</li>
       </ul>
       <p><b>Skim:</b> the theoretical analysis (&sect;5) on why the reparameterization is without loss of
       generality, and the GPT-4-as-judge evaluation details &mdash; unless you want the proofs or the
       win-rate methodology.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will build a tiny "policy": a probability distribution over a handful of candidate responses to
       one prompt, plus a <b>frozen reference</b> copy of it. You are given preference pairs (a preferred
       response $y_w$ beats a dispreferred response $y_l$). You train only with the DPO loss for a few dozen
       steps. Two questions to guess before running:</p>
       <ol>
        <li>Will the probability the policy assigns to the <b>preferred</b> responses go <i>up</i> relative to
        the dispreferred ones?</li>
        <li>The "implicit reward margin" is $\\hat r(y_w)-\\hat r(y_l)$, where
        $\\hat r(y)=\\beta\\log\\frac{\\pi_\\theta(y|x)}{\\pi_{\\text{ref}}(y|x)}$. It starts at $0$ (policy
        equals reference). Will it <i>grow</i> as training proceeds?</li>
       </ol>
       <p>Write your guess and one sentence of reasoning for each.</p>`,
    attempt:
      `<p>Before the reveal, sketch the DPO loss you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>Represent the policy as logits over $N$ responses; <code>logp = log_softmax(logits)</code> gives
        $\\log\\pi_\\theta(y|x)$. Make a <b>frozen</b> copy <code>ref_logp</code> for $\\log\\pi_{\\text{ref}}$.</li>
        <li>For each preference pair $(y_w, y_l)$, the implicit reward of a response is
        $\\hat r(y)=\\beta\\,[\\log\\pi_\\theta(y|x)-\\log\\pi_{\\text{ref}}(y|x)]$.</li>
        <li><b>TODO:</b> form the DPO logit
        $z = \\hat r(y_w) - \\hat r(y_l)$, then the per-pair loss
        $-\\log\\sigma(z)$, where $\\sigma$ is the logistic (sigmoid) function. Average over pairs.</li>
        <li><b>TODO:</b> why initialize the policy <i>at</i> the reference, so the margin starts at $0$? What
        would happen to the loss at step 0 if it did not?</li>
       </ul>
       <p>Then add the ablation: <b>shuffle the preference labels</b> (randomly swap $y_w$ and $y_l$) and
       retrain. Predict what happens to the implicit reward margin on the <i>true</i> pairs.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>DPO starts from the same goal as RLHF but solves it analytically. Three moves.</p>
       <p><b>Move 1 &mdash; the RLHF objective (&sect;3, Eqn. 3).</b> RLHF maximizes the expected reward of the
       policy while staying close to a reference policy $\\pi_{\\text{ref}}$ (usually the
       supervised-fine-tuned model), measured by KL divergence (a distance between two probability
       distributions):</p>
       <p>$$ \\max_{\\pi_\\theta}\\;\\mathbb{E}_{x\\sim\\mathcal{D},\\,y\\sim\\pi_\\theta(y|x)}\\big[r(x,y)\\big]
       \\;-\\;\\beta\\,\\mathbb{D}_{\\mathrm{KL}}\\!\\big[\\pi_\\theta(y|x)\\,\\|\\,\\pi_{\\text{ref}}(y|x)\\big]. $$</p>
       <p>Here $\\beta$ controls how tightly the policy is tethered to the reference.</p>
       <p><b>Move 2 &mdash; the closed-form optimum (&sect;4, Eqn. 4).</b> This objective has a known optimal
       policy. For any reward $r$, the best policy is the reference reweighted by the exponentiated reward:</p>
       <p>$$ \\pi_r(y|x)=\\tfrac{1}{Z(x)}\\,\\pi_{\\text{ref}}(y|x)\\,\\exp\\!\\Big(\\tfrac{1}{\\beta}\\,r(x,y)\\Big),
       \\qquad Z(x)=\\sum_{y}\\pi_{\\text{ref}}(y|x)\\exp\\!\\Big(\\tfrac{1}{\\beta}\\,r(x,y)\\Big). $$</p>
       <p>$Z(x)$ is the <b>partition function</b> &mdash; the normalizer that makes the probabilities sum to
       one. It depends on the prompt $x$ but <i>not</i> on the specific answer $y$. It is also the part that
       makes the RLHF policy impossible to sample directly, which is why RLHF needs reinforcement learning.</p>
       <p><b>Move 3 &mdash; read the reward off the policy (&sect;4, Eqn. 5).</b> Rearrange Eqn. 4 to solve for
       the reward in terms of its optimal policy:</p>
       <p>$$ r(x,y)=\\beta\\log\\frac{\\pi_r(y|x)}{\\pi_{\\text{ref}}(y|x)}+\\beta\\log Z(x). $$</p>
       <p>Now the key observation. The Bradley-Terry model (&sect;3, Eqn. 1) says the chance $y_w$ is preferred
       to $y_l$ depends only on the reward <i>difference</i> $r(x,y_w)-r(x,y_l)$. In that difference the
       awkward $\\beta\\log Z(x)$ term &mdash; same for both answers &mdash; <b>cancels</b>. So the preference
       probability can be written purely in terms of the policy and reference (&sect;4, Eqn. 6), and we can fit
       the policy directly by maximum likelihood on the observed preferences. That maximum-likelihood loss is
       the <b>DPO loss</b> (Eqn. 7).</p>
       <p><b>The gradient (&sect;4).</b> The DPO gradient up-weights exactly the preference pairs the model
       currently gets <i>wrong</i>: its weight is $\\sigma(\\hat r(y_l)-\\hat r(y_w))$, which is large when the
       implicit reward ranks the dispreferred answer above the preferred one. The paper describes this term as
       measuring "how incorrectly the implicit reward model orders the completions" (&sect;4).</p>`,
    symbols: [
      { sym: "$x$", desc: "the <b>prompt</b> (the input the model must respond to)." },
      { sym: "$y_w,\\;y_l$", desc: "a <b>preference pair</b>: $y_w$ is the response a human <b>preferred</b> (the 'winner', subscript $w$), $y_l$ the <b>dispreferred</b> one (the 'loser', subscript $l$), both for the same prompt $x$." },
      { sym: "$\\pi_\\theta$", desc: "the <b>policy</b> &mdash; the language model we are training, with parameters $\\theta$. $\\pi_\\theta(y|x)$ is the probability it assigns to response $y$ given prompt $x$." },
      { sym: "$\\pi_{\\text{ref}}$", desc: "the <b>reference</b> policy: a <b>frozen</b> copy of the model (usually after supervised fine-tuning) that we must not drift too far from. It does not change during training." },
      { sym: "$\\beta$", desc: "a positive <b>temperature</b>: how tightly the policy is tied to the reference. Larger $\\beta$ keeps the policy closer to $\\pi_{\\text{ref}}$; smaller lets it move more. The paper sweeps $\\beta\\in\\{0.05,0.1,1,5\\}$ for sentiment (&sect;6.1)." },
      { sym: "$r(x,y)$", desc: "the <b>reward</b>: a score for how good response $y$ is for prompt $x$. RLHF trains a network for this; DPO never does &mdash; it reads it implicitly off the policy." },
      { sym: "$\\hat r(x,y)$", desc: "the <b>implicit reward</b> DPO uses: $\\hat r(x,y)=\\beta\\log\\frac{\\pi_\\theta(y|x)}{\\pi_{\\text{ref}}(y|x)}$. It is just the (scaled) log-ratio of policy to reference &mdash; no separate model." },
      { sym: "$\\sigma$", desc: "the <b>logistic (sigmoid) function</b> $\\sigma(z)=\\tfrac{1}{1+e^{-z}}$, which squashes any real number into $(0,1)$ &mdash; here, a probability that the preferred answer wins." },
      { sym: "$Z(x)$", desc: "the <b>partition function</b>: the normalizer $\\sum_y \\pi_{\\text{ref}}(y|x)\\exp(\\tfrac{1}{\\beta}r(x,y))$ that makes the optimal policy a valid distribution. It cancels in the preference difference &mdash; the trick that lets DPO avoid it." },
      { sym: "$\\mathbb{D}_{\\mathrm{KL}}$", desc: "the <b>Kullback-Leibler divergence</b>: a measure of how far one probability distribution is from another. RLHF penalizes the policy for drifting (in KL) from the reference." },
      { sym: "$p^*(y_1\\succ y_2|x)$", desc: "the <b>preference probability</b>: the chance a human prefers $y_1$ over $y_2$ for prompt $x$. The symbol $\\succ$ reads 'is preferred to'." },
      { sym: "“implicit reward margin”", desc: "a plain term, not a symbol: $\\hat r(x,y_w)-\\hat r(x,y_l)$, the gap between the implicit reward of the preferred and dispreferred response. DPO training makes it grow." }
    ],
    formula: `$$ \\mathcal{L}_{\\text{DPO}}(\\pi_\\theta;\\pi_{\\text{ref}}) = -\\,\\mathbb{E}_{(x,y_w,y_l)\\sim\\mathcal{D}}\\left[\\log\\sigma\\!\\left(\\beta\\log\\frac{\\pi_\\theta(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)} - \\beta\\log\\frac{\\pi_\\theta(y_l|x)}{\\pi_{\\text{ref}}(y_l|x)}\\right)\\right] \\qquad\\text{(Eqn. 7, \\S4)} $$`,
    whatItDoes:
      `<p>Read the inside of $\\sigma$ first. The two terms are the implicit rewards
       $\\hat r(x,y_w)=\\beta\\log\\frac{\\pi_\\theta(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)}$ and
       $\\hat r(x,y_l)=\\beta\\log\\frac{\\pi_\\theta(y_l|x)}{\\pi_{\\text{ref}}(y_l|x)}$. So the argument of
       $\\sigma$ is the <b>implicit reward margin</b> $\\hat r(x,y_w)-\\hat r(x,y_l)$.</p>
       <p>$\\sigma(\\text{margin})$ is the model's estimated probability that the preferred answer wins. Taking
       $-\\log$ of it is exactly a <b>logistic-regression (binary cross-entropy) loss</b> with the preferred
       answer as the positive label. Minimizing it pushes the margin <b>up</b>: the policy raises
       $\\pi_\\theta(y_w|x)$ relative to the reference and lowers $\\pi_\\theta(y_l|x)$. That is the whole
       method &mdash; no reward model is fit, and the policy is never sampled from during training. Because the
       implicit reward is measured <i>against the frozen reference</i>, the $\\beta\\log\\frac{1}{\\pi_{\\text{ref}}}$
       anchoring keeps the policy from wandering away.</p>`,
    derivation:
      `<p>We sketch why Eqn. 7 falls out of the RLHF objective &mdash; this paper introduces the result, so we
       derive it (no separate concept lesson owns it).</p>
       <p><b>Step 1 &mdash; the optimum (Eqn. 4).</b> The KL-constrained objective
       $\\max_\\pi \\mathbb{E}[r] - \\beta\\,\\mathbb{D}_{\\mathrm{KL}}[\\pi\\|\\pi_{\\text{ref}}]$ is a standard
       reverse-KL-regularized maximization; its solution is the reference tilted by the exponentiated reward,
       $\\pi_r(y|x)=\\tfrac{1}{Z(x)}\\pi_{\\text{ref}}(y|x)\\exp(\\tfrac{1}{\\beta}r(x,y))$.</p>
       <p><b>Step 2 &mdash; invert it (Eqn. 5).</b> Take $\\log$ of Eqn. 4 and solve for $r$:</p>
       <p>$$ r(x,y) = \\beta\\log\\frac{\\pi_r(y|x)}{\\pi_{\\text{ref}}(y|x)} + \\beta\\log Z(x). $$</p>
       <p><b>Step 3 &mdash; the partition function cancels (Eqn. 6).</b> Bradley-Terry (Eqn. 1) says
       $p^*(y_w\\succ y_l|x)=\\sigma\\big(r(x,y_w)-r(x,y_l)\\big)$. Substitute Step 2 for both rewards. The
       $\\beta\\log Z(x)$ term is identical for $y_w$ and $y_l$, so it <b>subtracts away</b>:</p>
       <p>$$ p^*(y_w\\succ y_l|x) = \\sigma\\!\\left(\\beta\\log\\frac{\\pi^*(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)} -
       \\beta\\log\\frac{\\pi^*(y_l|x)}{\\pi_{\\text{ref}}(y_l|x)}\\right). $$</p>
       <p><b>Step 4 &mdash; maximum likelihood.</b> Replace the unknown optimal $\\pi^*$ with our trainable
       $\\pi_\\theta$ and fit it by maximizing the likelihood of the observed preferences. The negative
       log-likelihood of this logistic model, averaged over the dataset, is exactly Eqn. 7. No $Z(x)$, no reward
       model, no reinforcement learning &mdash; only a classification loss.</p>`,
    example:
      `<p>Compute the DPO loss for <b>one</b> preference pair from tiny log-probabilities, by hand. Suppose for a
       prompt $x$ the (sequence-summed) log-probabilities are:</p>
       <ul>
        <li>Policy: $\\log\\pi_\\theta(y_w|x)=-2.0$, $\\;\\log\\pi_\\theta(y_l|x)=-3.0$.</li>
        <li>Reference: $\\log\\pi_{\\text{ref}}(y_w|x)=-2.5$, $\\;\\log\\pi_{\\text{ref}}(y_l|x)=-2.5$.</li>
        <li>Temperature $\\beta=0.1$.</li>
       </ul>
       <ul class="steps">
        <li><b>Implicit reward, preferred.</b>
        $\\hat r(y_w)=\\beta\\,[\\log\\pi_\\theta(y_w|x)-\\log\\pi_{\\text{ref}}(y_w|x)]
        = 0.1\\cdot(-2.0-(-2.5)) = 0.1\\cdot 0.5 = 0.05$.</li>
        <li><b>Implicit reward, dispreferred.</b>
        $\\hat r(y_l)=\\beta\\,[\\log\\pi_\\theta(y_l|x)-\\log\\pi_{\\text{ref}}(y_l|x)]
        = 0.1\\cdot(-3.0-(-2.5)) = 0.1\\cdot(-0.5) = -0.05$.</li>
        <li><b>Margin.</b> $z=\\hat r(y_w)-\\hat r(y_l) = 0.05-(-0.05) = 0.10$.</li>
        <li><b>Sigmoid.</b> $\\sigma(0.10)=\\tfrac{1}{1+e^{-0.10}}=0.524979$.</li>
        <li><b>Loss.</b> $\\mathcal{L}_{\\text{DPO}}=-\\log\\sigma(0.10)=-\\log(0.524979)=0.644397$.</li>
       </ul>
       <p>So this pair contributes a loss of $\\approx 0.6444$. The policy already ranks $y_w$ slightly above
       $y_l$ (margin $+0.10$), so the loss is a bit <i>below</i> the $-\\log\\sigma(0)=\\log 2\\approx 0.6931$
       you would get at a zero margin. Minimizing this loss pushes the margin further positive. These exact
       numbers are recomputed in the notebook's first cell so you can check them.</p>`,
    recipe:
      `<ol>
        <li><b>Build a tiny "policy"</b> with torch: logits over $N$ candidate responses to one prompt;
        $\\log\\pi_\\theta(y|x)=\\texttt{log\\_softmax}(\\text{logits})$. The same idea scales to a real
        language model, where $\\log\\pi(y|x)$ is the summed token log-probabilities.</li>
        <li><b>Freeze a reference.</b> Copy the initial log-probs into $\\log\\pi_{\\text{ref}}$ and never update
        them. Initialize the policy <i>at</i> the reference so the implicit reward margin starts at $0$.</li>
        <li><b>Collect preference pairs</b> $(y_w, y_l)$: for the same prompt, the preferred response beats the
        dispreferred one.</li>
        <li><b>DPO loss (by hand):</b> per pair, form the implicit rewards
        $\\hat r(y)=\\beta\\,[\\log\\pi_\\theta(y|x)-\\log\\pi_{\\text{ref}}(y|x)]$, then
        $-\\log\\sigma(\\hat r(y_w)-\\hat r(y_l))$. Average over pairs (Eqn. 7).</li>
        <li><b>Train</b> with plain gradient descent for a few dozen steps. Watch the mean implicit reward
        margin grow and the preferred responses' probabilities rise.</li>
        <li><b>Ablate:</b> shuffle the preference labels (randomly swap $y_w$ and $y_l$) and retrain &mdash;
        the margin on the <i>true</i> pairs should stop growing.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): "fine-tuning with DPO exceeds PPO-based RLHF in ability to control
       sentiment of generations, and matches or improves response quality in summarization and single-turn
       dialogue while being substantially simpler to implement and train."</p>
       <p>The experiments (&sect;6) cover three tasks: controlled <b>sentiment</b> generation on IMDb (&sect;6.1,
       with a $\\beta$ sweep over $\\{0.05, 0.1, 1, 5\\}$), <b>summarization</b> on Reddit TL;DR, and
       single-turn <b>dialogue</b> on Anthropic Helpful-Harmless &mdash; with win rates judged by GPT-4.</p>
       <p><i>These are the paper's own statements, quoted from the abstract and &sect;6. The numbers in the
       CODEVIZ panel below are from our own tiny run on a toy categorical policy &mdash; not the paper's
       reported results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper. The pieces you need already ship in PyTorch, so you
       <b>import</b> them and build only the novel loss. <b>Import:</b> <code>F.log_softmax</code> to turn
       logits into log-probabilities $\\log\\pi(y|x)$, <code>F.logsigmoid</code> for the stable
       $\\log\\sigma$, and an optimizer (<code>torch.optim.SGD</code>). <b>Build by hand:</b> the
       <b>DPO loss</b> (Eqn. 7) &mdash; the implicit reward $\\hat r(y)=\\beta\\,[\\log\\pi_\\theta(y|x)-
       \\log\\pi_{\\text{ref}}(y|x)]$ for each response in a pair, the margin $\\hat r(y_w)-\\hat r(y_l)$, and
       $-\\log\\sigma$ of it averaged over pairs. The frozen reference and the preference-pair framing are the
       paper's contribution; PyTorch has no built-in for them. We use a tiny categorical "policy" (logits over
       a few responses) instead of a full language model so it runs on CPU in seconds, but the loss is
       <i>identical</i> to the one used on real models &mdash; only the meaning of $\\log\\pi(y|x)$ changes.</p>`,
    pitfalls:
      `<ul>
        <li><b>Letting the reference move.</b> $\\pi_{\\text{ref}}$ must be <b>frozen</b>. If you accidentally
        backprop into it (or recompute it from the live policy), the log-ratio
        $\\log\\frac{\\pi_\\theta}{\\pi_{\\text{ref}}}$ collapses and there is nothing anchoring the policy.
        <b>Fix:</b> store <code>ref_logp</code> as a detached constant; never include it in the optimizer.</li>
        <li><b>Mixing up $y_w$ and $y_l$.</b> The loss is asymmetric: it rewards $\\hat r(y_w)\\gt\\hat r(y_l)$.
        Swap the labels and you train the model to prefer the <i>worse</i> answer. <b>Fix:</b> double-check
        which response is the human-preferred one; the ablation deliberately breaks this to show the effect.</li>
        <li><b>Not initializing at the reference.</b> Standard DPO starts the policy <i>at</i> $\\pi_{\\text{ref}}$
        so the implicit reward margin starts at exactly $0$ and the loss at $-\\log\\sigma(0)=\\log 2$. Starting
        elsewhere is allowed but muddies the "margin grows from zero" story. <b>Fix:</b> copy the reference
        logits into the policy at init.</li>
        <li><b>Using a raw sigmoid then log.</b> Writing <code>torch.log(torch.sigmoid(z))</code> can underflow
        for very negative $z$. <b>Fix:</b> use <code>F.logsigmoid(z)</code>, the numerically stable form.</li>
        <li><b>Expecting a reward model.</b> There is none. The reward is <i>implicit</i> &mdash; just the scaled
        log-ratio of policy to reference. If you find yourself training a separate scorer, you have re-derived
        RLHF, not DPO.</li>
      </ul>`,
    recall: [
      "Write the DPO loss (Eqn. 7) from memory, including the role of $\\beta$.",
      "State the implicit reward $\\hat r(x,y)$ and explain why no reward model is trained.",
      "Why does the partition function $Z(x)$ cancel, and where in the derivation?",
      "What does the DPO gradient up-weight, and via what weighting term?"
    ],
    practice: [
      {
        q: `<b>The shuffled-label ablation.</b> You have DPO working: the implicit reward margin on the true
            preference pairs grows during training. Now <b>shuffle the labels</b> &mdash; randomly swap $y_w$
            and $y_l$ in some pairs &mdash; and retrain, everything else identical. What do you expect to
            happen to the reward margin measured on the <i>true</i> (correct) pairs, and why?`,
        steps: [
          { do: `Recall what the loss optimizes: $-\\log\\sigma(\\hat r(y_w)-\\hat r(y_l))$ pushes the margin positive for whatever pair you label as $(y_w,y_l)$.`, why: `The loss only knows the labels you give it; it has no independent notion of "correct".` },
          { do: `Shuffle: now roughly half the pairs point the right way and half the wrong way, so the gradients fight each other.`, why: `Up-pushing some pairs and down-pushing their reverses roughly cancels, leaving no consistent direction.` },
          { do: `Measure the margin on the TRUE pairs: expect it to stay near zero, not grow.`, why: `With contradictory supervision there is no signal to separate truly-preferred from truly-dispreferred responses.` }
        ],
        answer: `<p>The reward margin on the true pairs <b>stops growing &mdash; it stays near zero</b>. DPO has no
                 built-in notion of quality; it only enforces the orderings you label. Shuffling the labels gives
                 contradictory supervision, so the pushes cancel and the policy stays close to the reference. In
                 our run, training on shuffled labels leaves the true-pair mean reward margin at $\\approx 0.11$,
                 versus $\\approx 0.98$ after training on the correct labels. The signal lives entirely in the
                 preference labels.</p>`
      },
      {
        q: `Why does DPO need <b>no reward model and no reinforcement learning</b>, when RLHF needs both? Point
            to the exact step in the derivation that removes each.`,
        steps: [
          { do: `Reward model: in RLHF you fit $r$ from preferences, then optimize against it. In DPO, Eqn. 5 writes $r(x,y)=\\beta\\log\\frac{\\pi}{\\pi_{\\text{ref}}}+\\beta\\log Z(x)$ &mdash; the reward is a function of the policy.`, why: `If the reward is already determined by the policy, fitting a separate reward network is redundant.` },
          { do: `Reinforcement learning: RLHF samples from the policy because the optimal policy (Eqn. 4) contains the intractable $Z(x)$. DPO sidesteps it because $Z(x)$ cancels in the preference difference (Eqn. 6).`, why: `No intractable normalizer means no sampling loop &mdash; the objective becomes a plain supervised loss.` },
          { do: `Conclude: substituting Eqn. 5 into Bradley-Terry collapses the whole pipeline to one classification loss (Eqn. 7).`, why: `Both the reward-fitting and the RL stages disappear into a single maximum-likelihood objective.` }
        ],
        answer: `<p><b>No reward model</b> because Eqn. 5 expresses the reward directly as the scaled log-ratio
                 $\\beta\\log\\frac{\\pi_\\theta}{\\pi_{\\text{ref}}}$ &mdash; the policy <i>is</i> the reward
                 model. <b>No reinforcement learning</b> because the intractable partition function $Z(x)$, which
                 forced RLHF to sample, <b>cancels</b> in the Bradley-Terry preference difference (Eqn. 6). What
                 remains (Eqn. 7) is an ordinary logistic-regression loss over preference pairs &mdash; one
                 supervised objective replacing the entire reward-fit-then-PPO pipeline.</p>`
      },
      {
        q: `In the worked example you had $\\beta=0.1$, policy log-probs $(-2.0, -3.0)$ for $(y_w, y_l)$ and
            reference log-probs $(-2.5, -2.5)$, giving margin $0.10$ and loss $0.6444$. Suppose training raises
            the policy's preferred log-prob to $\\log\\pi_\\theta(y_w|x)=-1.0$ (dispreferred and reference
            unchanged). Recompute the margin and the loss. What does it show?`,
        steps: [
          { do: `New implicit reward, preferred: $\\hat r(y_w)=0.1\\cdot(-1.0-(-2.5))=0.1\\cdot 1.5 = 0.15$.`, why: `Raising the policy's probability on $y_w$ raises its implicit reward, since reference is fixed.` },
          { do: `Dispreferred unchanged: $\\hat r(y_l)=0.1\\cdot(-3.0-(-2.5))=-0.05$. New margin $z=0.15-(-0.05)=0.20$.`, why: `Only the preferred side moved, so the margin grows from $0.10$ to $0.20$.` },
          { do: `New loss: $-\\log\\sigma(0.20)=-\\log(0.549834)=0.598139$.`, why: `A larger positive margin means a higher $\\sigma$, hence a lower $-\\log\\sigma$ loss.` }
        ],
        answer: `<p>The margin rises from $0.10$ to $\\mathbf{0.20}$ and the loss falls from $0.6444$ to
                 $\\approx\\mathbf{0.5981}$. Raising the policy's probability on the preferred response (relative
                 to the frozen reference) increases its implicit reward, widens the margin, and lowers the DPO
                 loss &mdash; exactly the gradient direction DPO follows. This is the mechanism by which DPO
                 "raises the probability of preferred responses above dispreferred ones."</p>`
      }
    ]
  });

  window.CODE["paper-dpo"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>compose</b> with torch &mdash; a tiny "policy" is just logits over $N$ candidate
       responses to one prompt, and $\\log\\pi(y|x)=\\texttt{F.log\\_softmax}(\\text{logits})$. We freeze a copy
       as the reference $\\log\\pi_{\\text{ref}}$ and initialize the policy <i>at</i> it (so the implicit reward
       margin starts at $0$). Then we build the <b>novel</b> part by hand &mdash; the <b>DPO loss</b> (Eqn. 7):
       for each preference pair $(y_w,y_l)$, the implicit reward
       $\\hat r(y)=\\beta\\,[\\log\\pi_\\theta(y|x)-\\log\\pi_{\\text{ref}}(y|x)]$, the margin
       $\\hat r(y_w)-\\hat r(y_l)$, and $-\\log\\sigma$ of it (via the stable <code>F.logsigmoid</code>),
       averaged over pairs. We train a few dozen plain gradient-descent steps on CPU and watch the preferred
       responses' probabilities rise and the mean reward margin grow. The first cell recomputes the worked
       example (margin $0.10$, loss $0.644397$). The last block is the <b>ablation</b>: shuffle the preference
       labels and retrain &mdash; the true-pair margin stops growing. Paste into Colab and run; it finishes in
       seconds.</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F
import numpy as np, random

torch.manual_seed(0); np.random.seed(0); random.seed(0)

# --- 0. Sanity-check the worked example: DPO loss for ONE preference pair. ---
beta_we = 0.1
lp_pol_w, lp_pol_l = -2.0, -3.0      # policy log-probs for (y_w, y_l)
lp_ref_w, lp_ref_l = -2.5, -2.5      # frozen reference log-probs
rw = beta_we*(lp_pol_w - lp_ref_w)   # implicit reward, preferred
rl = beta_we*(lp_pol_l - lp_ref_l)   # implicit reward, dispreferred
margin = rw - rl
loss_we = -np.log(1/(1+np.exp(-margin)))
print("worked example: r_w=%.2f r_l=%.2f  margin=%.2f  sigma=%.6f  L_DPO=%.6f" % (
      rw, rl, margin, 1/(1+np.exp(-margin)), loss_we))
# worked example: r_w=0.05 r_l=-0.05  margin=0.10  sigma=0.524979  L_DPO=0.644397


# --- 1. A tiny "policy": a categorical distribution over N candidate responses. ---
# log pi(y|x) = log_softmax(logits). (On a real LM this is summed token log-probs.)
N = 6
beta = 0.5                                    # visible temperature for the toy run

# Frozen REFERENCE policy: random logits, then never updated.
torch.manual_seed(1)
ref_logits = torch.randn(N)
ref_logp   = F.log_softmax(ref_logits, dim=0).detach()   # log pi_ref(y|x), frozen

# Trainable policy, initialized AT the reference (so the margin starts at 0).
theta = ref_logits.clone().detach().requires_grad_(True)
opt   = torch.optim.SGD([theta], lr=0.5)

# --- 2. Preference pairs (y_w, y_l): a better-ranked response beats a worse one. ---
# "Human" ranking: response 0 best ... response 5 worst.
pairs = [(0,1),(0,2),(1,3),(2,4),(1,4),(3,5),(0,5),(2,5)]

# --- 3. The NOVEL part, built by hand: the DPO loss (Eqn. 7). ---
def dpo_loss(logits):
    logp = F.log_softmax(logits, dim=0)       # log pi_theta(y|x)
    z = torch.stack([                         # implicit reward margin per pair
        beta*((logp[w]-ref_logp[w]) - (logp[l]-ref_logp[l]))
        for (w,l) in pairs])
    return -F.logsigmoid(z).mean()            # -log sigma, averaged over pairs

def reward_margin(logits):                    # mean implicit reward margin over true pairs
    logp = F.log_softmax(logits, dim=0); r = beta*(logp - ref_logp)
    return float(np.mean([(r[w]-r[l]).item() for (w,l) in pairs]))

print("\\nDPO training (N=%d responses, %d preference pairs, beta=%.1f):" % (N, len(pairs), beta))
for step in range(61):
    if step % 10 == 0:
        print("  step %2d  loss=%.4f  mean reward-margin=%.4f" % (
              step, dpo_loss(theta).item(), reward_margin(theta)))
    opt.zero_grad(); dpo_loss(theta).backward(); opt.step()

# Did the PREFERRED responses' probabilities rise?
with torch.no_grad():
    p_init = torch.softmax(ref_logits, dim=0); p_fin = torch.softmax(theta, dim=0)
print("\\nresponse probs  init :", [round(v,3) for v in p_init.tolist()])
print("response probs  final:", [round(v,3) for v in p_fin.tolist()])
# response 0 (most preferred) rises ~0.25 -> ~0.69; the worst responses fall toward 0.

# --- 4. ABLATION: shuffle preference labels -> the true-pair margin stops growing. ---
torch.manual_seed(2)
theta2 = ref_logits.clone().detach().requires_grad_(True)
opt2   = torch.optim.SGD([theta2], lr=0.5)
bad_pairs = [(l,w) if random.random()<0.5 else (w,l) for (w,l) in pairs]   # randomly flipped
def dpo_loss_bad(logits):
    logp = F.log_softmax(logits, dim=0)
    z = torch.stack([beta*((logp[w]-ref_logp[w]) - (logp[l]-ref_logp[l])) for (w,l) in bad_pairs])
    return -F.logsigmoid(z).mean()
for step in range(60):
    opt2.zero_grad(); dpo_loss_bad(theta2).backward(); opt2.step()
print("\\nablation (shuffled labels): TRUE-pair mean reward-margin = %.4f" % reward_margin(theta2))

# Typical output (our small run, not the paper's numbers; exact values vary by seed/hardware):
#   step  0  loss=0.6931  mean reward-margin=0.0000
#   step 60  loss=0.3348  mean reward-margin=0.9827
#   response probs  init : [0.253, 0.171, 0.139, 0.243, 0.083, 0.111]
#   response probs  final: [0.693, 0.128, 0.088, 0.077, 0.008, 0.006]
#   ablation (shuffled labels): TRUE-pair mean reward-margin = 0.1143`
  };

  window.CODEVIZ["paper-dpo"] = {
    question: "As we train a tiny policy with the DPO loss on preference pairs, does the implicit reward margin between preferred and dispreferred responses grow — and does training on SHUFFLED labels?",
    charts: [
      {
        type: "line",
        title: "Mean implicit reward margin vs DPO training step — correct labels vs shuffled labels",
        xlabel: "DPO gradient steps (8 preference pairs, beta=0.5)",
        ylabel: "mean implicit reward margin  r_hat(y_w) - r_hat(y_l)",
        series: [
          {
            name: "Correct preference labels",
            color: "#7ee787",
            points: [[0,0.0],[10,0.2199],[20,0.4112],[30,0.5791],[40,0.7281],[50,0.8617],[60,0.9827]]
          },
          {
            name: "Shuffled labels (ablation)",
            color: "#ff7b72",
            points: [[0,0.0],[10,0.0195],[20,0.0389],[30,0.0581],[40,0.0771],[50,0.0959],[60,0.1143]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A tiny categorical 'policy' (log-softmax over 6 candidate responses to one prompt) plus a frozen reference, trained with the DPO loss (Eqn. 7, beta=0.5) on 8 preference pairs. With CORRECT labels the mean implicit reward margin r_hat(y_w)-r_hat(y_l) climbs from 0 to ~0.98 and the loss falls 0.69 -> 0.33 — the preferred responses' probabilities rise (response 0: ~0.25 -> ~0.69) above the dispreferred ones. With SHUFFLED labels (randomly swapping y_w and y_l) the contradictory supervision cancels and the true-pair margin barely moves (~0.11). DPO's signal lives entirely in the preference labels.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np, random
torch.manual_seed(0); np.random.seed(0); random.seed(0)

N, beta = 6, 0.5
torch.manual_seed(1)
ref_logits = torch.randn(N)
ref_logp   = F.log_softmax(ref_logits, dim=0).detach()     # frozen reference
pairs = [(0,1),(0,2),(1,3),(2,4),(1,4),(3,5),(0,5),(2,5)]  # y_w beats y_l

def margin(logits):
    logp = F.log_softmax(logits, dim=0); r = beta*(logp - ref_logp)
    return float(np.mean([(r[w]-r[l]).item() for (w,l) in pairs]))

def train(use_pairs):
    th = ref_logits.clone().detach().requires_grad_(True)   # init AT reference
    opt = torch.optim.SGD([th], lr=0.5)
    curve = {0: margin(th)}
    for step in range(1, 61):
        logp = F.log_softmax(th, dim=0)
        z = torch.stack([beta*((logp[w]-ref_logp[w]) - (logp[l]-ref_logp[l])) for (w,l) in use_pairs])
        loss = -F.logsigmoid(z).mean()
        opt.zero_grad(); loss.backward(); opt.step()
        if step % 10 == 0: curve[step] = margin(th)   # always measured on TRUE pairs
    return curve

correct  = train(pairs)
bad      = [(l,w) if random.random()<0.5 else (w,l) for (w,l) in pairs]
shuffled = train(bad)
xs = [0,10,20,30,40,50,60]
print("correct  margin:", [round(correct[s],4)  for s in xs])
print("shuffled margin:", [round(shuffled[s],4) for s in xs])
# correct  margin: [0.0, 0.2199, 0.4112, 0.5791, 0.7281, 0.8617, 0.9827]
# shuffled margin: [0.0, 0.0195, 0.0389, 0.0581, 0.0771, 0.0959, 0.1143]
# Correct labels: margin grows to ~0.98. Shuffled: ~0.11. Our small run, not the paper's number.`
  };
})();
