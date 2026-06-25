/* Paper lesson — "Training language models to follow instructions with human
   feedback" (InstructGPT), Ouyang et al., OpenAI, 2022. Self-contained: lesson +
   CODE + CODEVIZ merged by id "paper-instructgpt".
   GROUNDED from arXiv:2203.02155 (abstract) and the ar5iv HTML mirror
   (Section 3.1 the three steps; Section 3.5 reward-model ranking loss Eqn. 1 and
   the PPO-with-KL objective Eqn. 2).
   Track B (architecture): compose tiny reward model + tiny policy with torch.nn,
   then implement the NOVEL pipeline CONCEPTUALLY — (1) supervised fine-tuning,
   (2) a reward model trained on preference comparisons with the pairwise ranking
   loss, (3) a policy optimized against that reward with a Kullback-Leibler penalty
   to the supervised model. Reproduce the effect on toy data. */
(function () {
  window.LESSONS.push({
    id: "paper-instructgpt",
    title: "InstructGPT — Training Language Models to Follow Instructions with Human Feedback (2022)",
    tagline: "Align a language model to human intent in three stages: fine-tune, learn a reward from human preferences, then optimize against it with reinforcement learning.",
    module: "Papers · Transformers & LLMs",
    track: "architecture",
    paper: {
      authors: "Long Ouyang, Jeff Wu, Xu Jiang, Diogo Almeida, Carroll L. Wainwright, Pamela Mishkin, Chong Zhang, Sandhini Agarwal, Katarina Slama, Alex Ray, John Schulman, Jacob Hilton, Fraser Kelton, Luke Miller, Maddie Simens, Amanda Askell, Peter Welinder, Paul Christiano, Jan Leike, Ryan Lowe",
      org: "OpenAI",
      year: 2022,
      venue: "arXiv:2203.02155 (Mar 2022); NeurIPS 2022",
      citations: "",
      arxiv: "https://arxiv.org/abs/2203.02155",
      code: ""
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["paper-ppo", "rl-ppo", "rl-policy-gradients", "dl-language-model", "mod-llm", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p>A pretrained language model is trained to predict the next word on a giant pile of internet text. That
       objective is <b>not</b> the same as "do what the user asked." So a big model can still produce answers that
       are untruthful, toxic, or simply unhelpful &mdash; it is <i>misaligned</i> with the user's intent. From the
       abstract:</p>
       <blockquote>"Making language models bigger does not inherently make them better at following a user's intent.
       For example, large language models can generate outputs that are untruthful, toxic, or simply not helpful to
       the user." (Abstract)</blockquote>
       <p>You cannot just write down a loss for "helpful and honest." There is no formula for it. But people can
       <i>look</i> at two answers and say which one is better. The open question: can we turn that human judgment
       into a training signal a model can optimize?</p>
       <p>Abbreviations used throughout, expanded on first use: <b>RLHF</b> = reinforcement learning from human
       feedback; <b>SFT</b> = supervised fine-tuning; <b>RM</b> = reward model; <b>PPO</b> = Proximal Policy
       Optimization (a reinforcement-learning algorithm); <b>KL</b> = Kullback-Leibler (a way to measure how far
       one probability distribution is from another).</p>`,
    contribution:
      `<ul>
        <li><b>A three-stage RLHF pipeline.</b> (1) <b>Supervised fine-tuning (SFT)</b>: fine-tune the base model on
        human-written demonstrations of good answers. (2) <b>Reward model (RM)</b>: collect human <i>comparisons</i>
        (labeler ranks several model outputs) and train a model to score an answer the way a human would. (3)
        <b>Reinforcement learning</b>: optimize the policy (the language model) to produce high-reward answers using
        PPO, with a penalty that keeps it close to the SFT model.</li>
        <li><b>Learn the objective from preferences, not from a hand-written rule.</b> The reward model is trained
        with a <b>pairwise ranking loss</b>: it only has to say "the human-preferred answer should score higher than
        the other one." That is enough to build a continuous reward out of yes/no human choices.</li>
        <li><b>A KL penalty to prevent drift.</b> Optimizing hard against a learned reward invites the policy to
        find cheats that fool the reward model. A per-token KL penalty to the SFT model keeps the policy from
        wandering off into nonsense while still chasing reward.</li>
      </ul>`,
    whyItMattered:
      `<p>InstructGPT is the recipe behind instruction-following chat models. The same three stages &mdash; SFT, a
       reward model on human preferences, then reinforcement-learning optimization with a KL penalty &mdash; became
       the standard alignment pipeline that ChatGPT and most later assistants are built on. It reframed "make the
       model better" from "make it bigger" to "align it to what people actually want." It also kicked off a wave of
       follow-ups, including RL-free alternatives like Direct Preference Optimization (see the cross-link to
       <code>paper-dpo</code>) that skip the separate reward model and the reinforcement-learning loop.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.1 (Methods overview)</b> &mdash; the three steps in one page: collect demonstrations and do
        supervised fine-tuning; collect comparisons and train a reward model; optimize the policy against the reward
        model with PPO. Figure 2 is the diagram of the whole loop.</li>
        <li><b>&sect;3.5 (Models)</b> &mdash; the two equations you transcribe and implement. The reward-model
        <b>ranking loss (Equation 1)</b> and the <b>reinforcement-learning objective with the KL penalty
        (Equation 2)</b>.</li>
        <li><b>&sect;3.4 (Reward modeling)</b> &mdash; how comparisons are collected: a labeler ranks between
        $K=4$ and $K=9$ outputs, which gives $\\binom{K}{2}$ pairwise comparisons per prompt.</li>
       </ul>
       <p><b>Skim:</b> &sect;4 (the human-evaluation results) for the headline numbers; &sect;5 (discussion of
       limitations and alignment). You can skim the data-collection and labeler details (&sect;3.2-3.3) unless you
       care about how the preference data was gathered.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train a small <b>reward model</b> on preference pairs, then use it to push a small <b>policy</b>
       toward preferred outputs &mdash; once <b>with</b> a KL penalty to the starting (SFT) policy, and once
       <b>without</b> it. Both runs chase the same reward. Question: after training, will the no-penalty policy
       reach a higher "truly preferred" rate than the penalized one &mdash; or will dropping the penalty let it
       <i>drift</i> in directions the reward model never really judged? Write your guess and one sentence of
       reasoning.</p>
       <p>(Hint: the reward model is only accurate on the kind of outputs it was trained to compare. What stops the
       policy from exploiting a direction the reward model is blind to?)</p>`,
    attempt:
      `<p>Before the reveal, sketch the three stages you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Stage 1 &mdash; SFT.</b> Define a tiny starting policy (here a simple distribution over toy outputs).
        In the real paper this is GPT-3 fine-tuned on human demonstrations; in the toy version it is just our fixed
        reference distribution.</li>
        <li><b>Stage 2 &mdash; reward model.</b> Build $r_\\theta(y)$, a small network that scores an output. Train
        it on preference pairs $(y_w, y_l)$ where $y_w$ is preferred. TODO: write the pairwise ranking loss
        $-\\log \\sigma(r_\\theta(y_w) - r_\\theta(y_l))$ and minimize it. ($\\sigma$ is the sigmoid; defined below.)</li>
        <li><b>Stage 3 &mdash; policy optimization.</b> TODO: update the policy to <i>maximize</i> the reward
        $r_\\theta(y)$ on its own samples, <i>minus</i> $\\beta$ times the KL distance to the SFT policy. Run it once
        with $\\beta \\gt 0$ and once with $\\beta = 0$.</li>
        <li>TODO: what should happen to the policy when $\\beta = 0$? Where can it drift?</li>
       </ul>
       <p>Then compare the two policies by their <i>true</i> preferred-output rate (using the hidden ground-truth
       preference the reward model was only an estimate of). Predict which one drifts.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>InstructGPT turns "humans can judge answers" into "a model can be trained" in <b>three stages</b>
       (&sect;3.1).</p>
       <p><b>Stage 1 &mdash; Supervised fine-tuning (SFT).</b> Labelers write good answers to prompts. The base
       language model is fine-tuned on these demonstrations with ordinary supervised learning (predict the
       demonstrated answer). The result is the <b>SFT model</b>, $\\pi^{\\text{SFT}}$. It already follows
       instructions somewhat, and it is the anchor for everything after.</p>
       <p><b>Stage 2 &mdash; Reward model (RM).</b> We want a number for "how good is this answer," but no formula
       exists. So we ask labelers to <i>compare</i>. For a prompt, the model produces several outputs; a labeler
       ranks them. The paper presents $K=4$ to $K=9$ outputs per prompt (&sect;3.4), which yields $\\binom{K}{2}$
       pairwise comparisons. Each comparison is a pair $(y_w, y_l)$: a <b>winner</b> $y_w$ (preferred) and a
       <b>loser</b> $y_l$. We train a model $r_\\theta(x, y)$ that outputs a scalar score, using a loss that only
       says <i>the winner should score higher than the loser</i> (Equation 1, below). The paper uses a 6-billion
       parameter reward model (&sect;3.5: "we only use 6B RMs ... we found that 175B RM training could be
       unstable").</p>
       <p><b>Stage 3 &mdash; Reinforcement learning (PPO).</b> Now treat the language model as a <b>policy</b>
       $\\pi_\\phi^{\\text{RL}}$ and let it generate answers. Each answer gets a scalar reward from the reward model.
       The policy is updated to produce higher-reward answers using PPO (&sect;3.5). One catch: if you optimize the
       reward too hard, the policy finds adversarial outputs that score high on the reward model but are actually
       bad &mdash; the reward model is only an approximation. To prevent this, the paper adds a <b>per-token KL
       penalty</b> from the SFT model: the policy pays a cost for drifting away from $\\pi^{\\text{SFT}}$ (Equation 2,
       below). This keeps the policy in the region where the reward model is trustworthy.</p>
       <p>The paper also adds an optional pretraining term ($\\gamma \\gt 0$, called "PPO-ptx") that mixes in the
       original language-modeling objective to avoid forgetting; with $\\gamma = 0$ it is plain "PPO."</p>`,
    architecture:
      `<p>There is no new neural network here &mdash; every stage reuses the GPT-3 Transformer (decoder-only) backbone.
       What is novel is the <b>three-model pipeline</b> and how data flows through it (&sect;3, Figure 2). The base
       model comes in three sizes: <b>1.3B, 6B, and 175B</b> parameters (&sect;3.5).</p>
       <p><b>Component flow: GPT-3 base &rarr; SFT &rarr; reward model &rarr; PPO policy.</b></p>
       <ol>
        <li><b>GPT-3 base (pretrained).</b> A decoder-only Transformer trained on internet text with next-token
        prediction. Input: prompt tokens $x$. Output: a probability distribution over the next token. This is the raw
        material for all three stages.</li>
        <li><b>SFT model $\\pi^{\\text{SFT}}$.</b> The base model fine-tuned (same architecture, updated weights) on
        human-written demonstrations $(x, \\text{demonstration})$ with ordinary supervised next-token loss. It serves
        two roles downstream: it is the <i>initialization</i> of the PPO policy, and the <i>fixed reference</i> the KL
        penalty measures against.</li>
        <li><b>Reward model $r_\\theta(x, y)$.</b> A separate copy of the Transformer whose final unembedding head is
        <i>replaced by a single linear layer outputting one scalar</i> &mdash; the reward. The paper uses a <b>6B</b>
        reward model (not 175B: "we found that 175B RM training could be unstable", &sect;3.5). Input: a full
        (prompt, output) sequence $(x, y)$. Output: one number. It is trained with the pairwise ranking loss
        (Equation 1) on comparison data, then <b>frozen</b>.</li>
        <li><b>PPO policy $\\pi_\\phi^{\\text{RL}}$.</b> A third copy of the Transformer, <i>initialized from the SFT
        model</i>, that is the only network updated in Stage 3. Data flow per RL step: sample prompt $x$ &rarr; policy
        generates output $y$ &rarr; frozen reward model scores $r_\\theta(x, y)$ &rarr; subtract the per-token KL
        penalty to $\\pi^{\\text{SFT}}$ &rarr; PPO uses this shaped reward (plus, for PPO-ptx, a pretraining-gradient
        term) to update $\\phi$ (Equation 2). The SFT model and reward model stay frozen throughout.</li>
       </ol>
       <p>So at RL time <b>three copies</b> of the Transformer are in play at once: the trainable policy, the frozen
       SFT reference (for the KL term), and the frozen reward model (for the score). The result, after Stage 3, is the
       <b>InstructGPT</b> model.</p>`,
    symbols: [
      { sym: "$x$", desc: "the <b>prompt</b> (the user's input / instruction)." },
      { sym: "$y$", desc: "an <b>output</b> (completion / answer) the model produces for prompt $x$." },
      { sym: "$y_w$", desc: "the <b>preferred</b> output in a comparison &mdash; the \"winner\" the human ranked higher." },
      { sym: "$y_l$", desc: "the <b>dispreferred</b> output in a comparison &mdash; the \"loser\" the human ranked lower." },
      { sym: "$r_\\theta(x, y)$", desc: "the <b>reward model</b>: a network with parameters $\\theta$ that maps a (prompt, output) pair to a single scalar score &mdash; how good a human would find that output." },
      { sym: "$\\sigma$", desc: "the <b>sigmoid</b> function $\\sigma(z) = 1/(1 + e^{-z})$. It squashes any real number into $(0, 1)$; here it turns a score <i>gap</i> into a probability that the winner beats the loser." },
      { sym: "$K$", desc: "the <b>number of outputs ranked</b> per prompt by a labeler (the paper uses $K=4$ to $9$)." },
      { sym: "$\\binom{K}{2}$", desc: "\"$K$ choose $2$\" &mdash; the number of <b>pairs</b> you can form from $K$ ranked outputs; one ranking of $K$ outputs gives this many pairwise comparisons." },
      { sym: "$D$", desc: "the <b>dataset of comparisons</b>: the collected $(x, y_w, y_l)$ triples the reward model is trained on." },
      { sym: "$\\pi^{\\text{SFT}}$", desc: "the <b>supervised fine-tuned policy</b> from Stage 1 &mdash; the reference / anchor model the reinforcement-learning policy must stay close to." },
      { sym: "$\\pi_\\phi^{\\text{RL}}$", desc: "the <b>reinforcement-learning policy</b> with parameters $\\phi$ being optimized in Stage 3; it starts as a copy of $\\pi^{\\text{SFT}}$." },
      { sym: "$\\beta$", desc: "the <b>KL-penalty coefficient</b>: how strongly to penalize the policy for drifting away from $\\pi^{\\text{SFT}}$. Larger $\\beta$ = stay closer to SFT." },
      { sym: "KL penalty", desc: "a plain term: the per-token <b>Kullback-Leibler</b> term $\\log\\!\\big(\\pi_\\phi^{\\text{RL}}(y\\mid x) / \\pi^{\\text{SFT}}(y\\mid x)\\big)$ &mdash; it is positive when the policy assigns a different probability to $y$ than the SFT model does, so penalizing it pulls the policy back toward SFT." },
      { sym: "$\\gamma$", desc: "the <b>pretraining coefficient</b>: weight on an extra term that mixes in the original language-modeling loss. $\\gamma = 0$ gives \"PPO\"; $\\gamma \\gt 0$ gives \"PPO-ptx\" (prevents forgetting)." }
    ],
    formula: `$$ \\text{loss}(\\theta) = -\\frac{1}{\\binom{K}{2}} \\, \\mathbb{E}_{(x,\\,y_w,\\,y_l)\\sim D}\\Big[ \\log \\sigma\\big( r_\\theta(x, y_w) - r_\\theta(x, y_l) \\big) \\Big] \\quad\\text{(Eqn. 1)} $$
$$ \\text{objective}(\\phi) = \\mathbb{E}_{(x,\\,y)\\sim D_{\\pi_\\phi^{\\text{RL}}}}\\Big[ r_\\theta(x,y) - \\beta \\log\\!\\frac{\\pi_\\phi^{\\text{RL}}(y\\mid x)}{\\pi^{\\text{SFT}}(y\\mid x)} \\Big] + \\gamma\\,\\mathbb{E}_{x\\sim D_{\\text{pretrain}}}\\big[ \\log \\pi_\\phi^{\\text{RL}}(x) \\big] \\quad\\text{(Eqn. 2)} $$`,
    whatItDoes:
      `<p><b>Equation 1 (the reward-model loss, &sect;3.5).</b> Read it inside out. For one comparison, take the
       score gap $r_\\theta(x, y_w) - r_\\theta(x, y_l)$ between the winner and the loser. Pass it through the
       sigmoid $\\sigma$: that is the model's predicted probability that the winner really is preferred. We want that
       probability near $1$, so we minimize $-\\log$ of it (standard binary cross-entropy). When the winner already
       scores higher, the gap is positive, $\\sigma$ is close to $1$, and the loss is small. When the model has them
       backwards, the gap is negative and the loss is large. Averaging over all $\\binom{K}{2}$ pairs from a ranking
       (the $1/\\binom{K}{2}$ factor) just normalizes per prompt. Net effect: the reward model learns to put
       human-preferred outputs above dispreferred ones.</p>
       <p><b>Equation 2 (the reinforcement-learning objective, &sect;3.5).</b> The policy generates answers
       $y$ and is rewarded by $r_\\theta(x, y)$ &mdash; so it is pushed to produce high-reward answers. The middle
       term, $-\\beta \\log(\\pi_\\phi^{\\text{RL}} / \\pi^{\\text{SFT}})$, is the <b>KL penalty</b>: it subtracts a
       cost whenever the policy's probabilities drift away from the SFT model's. So the policy maximizes reward
       <i>while staying near</i> SFT. The last term ($\\gamma$ times the pretraining log-likelihood) optionally mixes
       in ordinary language modeling so the policy does not forget its general abilities. Without the KL penalty the
       policy is free to over-optimize the reward model &mdash; finding outputs that score high but are actually bad,
       because the reward model is only an estimate.</p>`,
    derivation:
      `<p>There is no separate concept lesson here (<code>conceptLink</code> is null), so we build both pieces from
       scratch.</p>
       <p><b>Why the ranking loss.</b> Start from the Bradley-Terry model of pairwise preference: given two items
       with scores $r_w$ and $r_l$, the probability a human prefers the first is the logistic function of the score
       gap,</p>
       <p>$$ P(y_w \\succ y_l) = \\frac{e^{r_w}}{e^{r_w} + e^{r_l}} = \\frac{1}{1 + e^{-(r_w - r_l)}} = \\sigma(r_w - r_l). $$</p>
       <p>Each labeled comparison says the winner <i>was</i> preferred, so its likelihood is $\\sigma(r_w - r_l)$.
       Maximizing the likelihood of all comparisons = minimizing the sum of $-\\log \\sigma(r_w - r_l)$. That is
       exactly Equation 1. The score itself, $r_\\theta(x, y)$, comes out as a byproduct: it is the scalar whose
       differences reproduce human choices, and it doubles as the reward in Stage 3.</p>
       <p><b>Why the KL penalty.</b> The reward model $r_\\theta$ is trained only on outputs near what the SFT model
       produces. Far from that region it is unreliable. An unconstrained optimizer will happily march into that
       unreliable region to grab a high (but wrong) reward &mdash; "reward over-optimization." The KL term measures
       how far the policy's output distribution has moved from $\\pi^{\\text{SFT}}$ and charges $\\beta$ per unit of
       distance. So the policy is rewarded for good answers but taxed for leaving the region where the reward model
       can be trusted. In code, you maximize reward minus $\\beta$ times this KL term; with $\\beta = 0$ the tax is
       gone and the policy drifts. Our run below shows exactly this drift.</p>`,
    example:
      `<p>Work the reward-model ranking loss (Equation 1) for <b>one comparison</b>, by hand, so it is concrete.
       Suppose for a prompt $x$ the reward model scores the human-preferred output $y_w$ at
       $r_\\theta(x, y_w) = 2.0$ and the dispreferred output $y_l$ at $r_\\theta(x, y_l) = 0.5$.</p>
       <ul class="steps">
        <li><b>Score gap.</b> $r_\\theta(x, y_w) - r_\\theta(x, y_l) = 2.0 - 0.5 = 1.5$. The winner scores higher,
        so the gap is positive &mdash; good.</li>
        <li><b>Sigmoid.</b> $\\sigma(1.5) = \\dfrac{1}{1 + e^{-1.5}} = \\dfrac{1}{1 + 0.2231} = 0.8176$. This is the
        model's predicted probability that $y_w$ beats $y_l$ &mdash; about $82\\%$.</li>
        <li><b>Loss for this pair.</b> $-\\log \\sigma(1.5) = -\\log(0.8176) = 0.2014$ (natural log). Small, because
        the model already ranks the pair correctly.</li>
        <li><b>Sanity check the shape.</b> If the model had them <i>backwards</i> with a gap of $-1.5$, then
        $\\sigma(-1.5) = 0.1824$ and the loss would be $-\\log(0.1824) = 1.7014$ &mdash; much larger, pushing the
        model to fix the ordering. If it were unsure (gap $0$), $\\sigma(0) = 0.5$ and the loss is
        $-\\log(0.5) = 0.6931$.</li>
       </ul>
       <p>So this one comparison contributes $0.2014$ to the loss. The full Equation 1 averages this over all
       $\\binom{K}{2}$ pairs from the ranking and over the dataset $D$. These exact numbers are recomputed in the
       notebook's first cell so you can check them.</p>`,
    recipe:
      `<ol>
        <li><b>Stage 1 (SFT, conceptual).</b> Fix a reference policy $\\pi^{\\text{SFT}}$. In the toy version it is a
        simple distribution over outputs; in the paper it is GPT-3 fine-tuned on human demonstrations.</li>
        <li><b>Stage 2 (reward model).</b> Build $r_\\theta(y)$ with <code>torch.nn</code> (a tiny multi-layer
        perceptron). Generate preference pairs $(y_w, y_l)$ from a hidden ground-truth preference. Train $r_\\theta$
        with the <b>pairwise ranking loss</b> $-\\log \\sigma(r_\\theta(y_w) - r_\\theta(y_l))$ (Equation 1). Track
        its accuracy on held-out pairs.</li>
        <li><b>Stage 3 (policy optimization).</b> Take a policy initialized at $\\pi^{\\text{SFT}}$. Update it to
        <b>maximize</b> $r_\\theta(y)$ on its own samples <b>minus</b> $\\beta$ times the KL distance to
        $\\pi^{\\text{SFT}}$ (Equation 2, with $\\gamma = 0$). Track the policy's <i>true</i> preferred-output rate.</li>
        <li><b>Ablate the KL penalty.</b> Re-run Stage 3 with $\\beta = 0$. Compare the final KL distance to SFT and
        watch the policy drift in directions the reward model does not really judge.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): "In human evaluations on our prompt distribution, outputs from the 1.3B
       parameter InstructGPT model are preferred to outputs from the 175B GPT-3, despite having 100x fewer
       parameters." The abstract adds that InstructGPT models "show improvements in truthfulness and reductions in
       toxic output generation while having minimal performance regressions on public NLP datasets."</p>
       <p><i>That preference number is the paper's own human-evaluation result, quoted from the abstract. The
       numbers in the CODE and CODEVIZ panels below are from our own tiny toy run &mdash; not the paper's reported
       results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the building blocks already ship in PyTorch, so we
       <b>import</b> them and implement only the novel <i>pipeline</i> conceptually. <b>Import:</b>
       <code>nn.Linear</code> / <code>nn.ReLU</code> for the reward model, <code>torch.nn.functional.logsigmoid</code>
       for the loss, and <code>torch.optim.Adam</code>. <b>Build by hand:</b> the three RLHF stages &mdash; (2) the
       <b>reward model trained with the pairwise ranking loss</b> (Equation 1), and (3) the <b>policy update that
       maximizes reward minus a KL penalty</b> to the SFT policy (Equation 2). We replace GPT-3 with a tiny reward
       model and a tiny policy over toy outputs so the whole pipeline runs in seconds on a CPU; the <i>mechanism</i>
       &mdash; preferences &rarr; reward &rarr; KL-constrained optimization &mdash; is the paper's, not the scale.
       Full reinforcement-learning PPO machinery (clipping, value function, advantages) is taught in
       <code>paper-ppo</code> / <code>rl-ppo</code>; here we use a minimal policy-gradient step so the RLHF
       structure stays in focus.</p>`,
    pitfalls:
      `<ul>
        <li><b>Optimizing the reward model instead of a copy.</b> In Stage 3 the reward model is <b>frozen</b> &mdash;
        it is the judge, not a thing you train. Only the policy updates. <b>Fix:</b> do not pass the reward model's
        parameters to the policy optimizer; detach its output where needed.</li>
        <li><b>Dropping the KL penalty and trusting the reward.</b> With $\\beta = 0$ the policy over-optimizes the
        reward model: it pushes into regions the reward model never judged and racks up a high <i>measured</i> reward
        while the <i>true</i> quality stops improving (or degrades). The high reward is a mirage. <b>Fix:</b> keep
        $\\beta \\gt 0$; watch the KL distance to SFT, not just the reward.</li>
        <li><b>Getting the winner/loser order wrong in Equation 1.</b> The loss is
        $-\\log \\sigma(r(y_w) - r(y_l))$ with the <i>preferred</i> output first. Swap them and you train the reward
        model to prefer the worse answer. <b>Fix:</b> always order each pair as (winner, loser) before computing the
        loss.</li>
        <li><b>Confusing the reward model's accuracy with the policy's quality.</b> A reward model can be 99% accurate
        at ranking pairs and still be exploitable off-distribution. High reward-model accuracy does not guarantee a
        good policy once you optimize against it. <b>Fix:</b> evaluate the policy by a held-out <i>true</i>
        preference, separate from the reward model.</li>
        <li><b>Treating SFT as optional.</b> The KL penalty is measured against $\\pi^{\\text{SFT}}$, and the policy
        starts there. Skipping SFT removes the anchor that makes the reward model and the KL penalty meaningful.</li>
      </ul>`,
    recall: [
      "Name the three stages of RLHF in order, and say what each one produces.",
      "Write the reward-model ranking loss (Equation 1) from memory and define $y_w$, $y_l$, and $\\sigma$.",
      "In Equation 2, what does the $-\\beta\\log(\\pi^{\\text{RL}}/\\pi^{\\text{SFT}})$ term do, and what goes wrong when $\\beta = 0$?",
      "Why is the reward model trained on <i>comparisons</i> rather than on absolute quality scores?"
    ],
    practice: [
      {
        q: `<b>The KL ablation.</b> You have a reward model trained on preferences and a policy optimized against it
            with KL coefficient $\\beta \\gt 0$. Set $\\beta = 0$ and retrain the policy, everything else identical.
            What term did you just drop, and what do you expect to happen to (a) the policy's measured reward,
            (b) its distance from the SFT model, and (c) its <i>true</i> quality?`,
        steps: [
          { do: `Locate the policy objective: <code>maximize r(y) - BETA * KL(policy || sft)</code>. Set <code>BETA = 0</code>.`, why: `With $\\beta = 0$ the KL penalty vanishes, so nothing pulls the policy back toward $\\pi^{\\text{SFT}}$ &mdash; it can move anywhere that raises the reward.` },
          { do: `Identify the dropped term: the per-token KL penalty $-\\beta\\log(\\pi_\\phi^{\\text{RL}}/\\pi^{\\text{SFT}})$ from Equation 2 is gone.`, why: `That term was the only thing keeping the policy in the region where the reward model was trained and is trustworthy.` },
          { do: `Predict the outcome: measured reward goes up; KL distance to SFT grows large; true quality plateaus or drifts because the policy exploits directions the reward model never judged.`, why: `The reward model is an approximation; off its training region a high score is a mirage (reward over-optimization).` }
        ],
        answer: `<p>You dropped the <b>KL penalty</b>. (a) The <i>measured</i> reward typically rises &mdash; the
                 policy is now free to chase it without cost. (b) The distance from the SFT model grows large: in our
                 run the KL roughly doubles ($\\approx 12$ with the penalty versus $\\approx 26$ without). (c) But the
                 <i>true</i> preferred-rate does not improve further; the policy drifts in directions the reward model
                 cannot really judge (in our toy run, a coordinate the true preference does not care about wanders
                 from $\\approx 0.3$ to $\\approx 4.0$). This is reward over-optimization: the KL penalty is what keeps
                 the policy honest.</p>`
      },
      {
        q: `Why does the paper train the reward model on <b>pairwise comparisons</b> with the loss
            $-\\log\\sigma(r(y_w) - r(y_l))$, instead of asking labelers to assign each output an absolute quality
            score and regressing on it?`,
        steps: [
          { do: `Consider what humans are good at. Absolute scores ("rate this 7/10") are noisy and vary by labeler and by day; relative judgments ("A is better than B") are far more consistent.`, why: `The loss only needs the <i>ordering</i> $r(y_w) \\gt r(y_l)$, which matches the more reliable human signal.` },
          { do: `Look at the loss: it depends only on the score <i>difference</i> $r(y_w) - r(y_l)$, not on absolute values.`, why: `Through the sigmoid, the difference becomes a preference probability (Bradley-Terry). The model is free to set the overall scale; only relative ordering is supervised.` },
          { do: `Note the data efficiency: one ranking of $K$ outputs yields $\\binom{K}{2}$ pairwise comparisons (&sect;3.4).`, why: `Ranking $K=4$ to $9$ outputs once gives many comparisons cheaply, so each labeling task produces a lot of training signal.` }
        ],
        answer: `<p>Because relative judgments are what humans give reliably. Absolute quality scores are noisy and
                 inconsistent across labelers; "A beats B" is stable. The ranking loss only uses the score
                 <i>difference</i> $r(y_w) - r(y_l)$, so it learns from orderings and lets the scale float &mdash;
                 and a single ranking of $K$ outputs produces $\\binom{K}{2}$ comparisons, which is cheap and
                 efficient. The byproduct, the scalar $r_\\theta$, then serves as the reward in Stage 3.</p>`
      },
      {
        q: `In the worked example the reward model scored the preferred output at $r(y_w) = 2.0$ and the
            dispreferred at $r(y_l) = 0.5$, giving loss $-\\log\\sigma(1.5) = 0.2014$. Suppose instead the reward
            model is <i>more</i> confident and correct: $r(y_w) = 3.0$, $r(y_l) = -1.0$. Compute the loss. Then
            suppose it is confidently <i>wrong</i>: $r(y_w) = -1.0$, $r(y_l) = 3.0$. Compute that loss. What does the
            comparison say?`,
        steps: [
          { do: `Confident & correct: gap $= 3.0 - (-1.0) = 4.0$. $\\sigma(4.0) = 1/(1+e^{-4}) = 0.9820$. Loss $= -\\log(0.9820) = 0.0181$.`, why: `A large positive gap makes $\\sigma$ near $1$, so the loss is tiny &mdash; the model is barely corrected when it is right and confident.` },
          { do: `Confident & wrong: gap $= -1.0 - 3.0 = -4.0$. $\\sigma(-4.0) = 0.0180$. Loss $= -\\log(0.0180) = 4.017$.`, why: `A large negative gap makes $\\sigma$ near $0$, so $-\\log$ is large &mdash; the model is strongly pushed to flip the ordering.` },
          { do: `Compare: $0.0181$ versus $4.017$ &mdash; a factor of about $220\\times$.`, why: `The loss is gentle when the ranking is right and steep when it is confidently wrong, which is exactly the gradient signal you want.` }
        ],
        answer: `<p>Confident-and-correct gives loss $\\approx 0.0181$; confident-and-wrong gives loss $\\approx 4.017$
                 &mdash; about $220\\times$ larger. The pairwise ranking loss barely touches a correct, confident
                 ranking but punishes a confident mistake hard, so training drives the reward model to order
                 human-preferred outputs above the rest. (Contrast the original example's $0.2014$ for a modest
                 correct gap of $1.5$.)</p>`
      }
    ]
  });

  window.CODE["paper-instructgpt"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>compose</b> a tiny reward model and a tiny policy with <code>torch.nn</code>, then implement
       the <b>novel RLHF pipeline</b> conceptually. <b>Stage 1 (SFT)</b> is a fixed reference policy
       $\\pi^{\\text{SFT}}$ (a standard-normal distribution over 4-dimensional toy "outputs"). <b>Stage 2</b> trains a
       reward model $r_\\theta$ with the <b>pairwise ranking loss</b> $-\\log\\sigma(r(y_w) - r(y_l))$ (Equation 1) on
       preference pairs drawn from a hidden ground-truth "good direction." <b>Stage 3</b> optimizes the policy to
       maximize $r_\\theta$ minus $\\beta$ times the Kullback-Leibler distance to $\\pi^{\\text{SFT}}$ (Equation 2,
       $\\gamma = 0$), once <b>with</b> the KL penalty and once <b>without</b> (the ablation). The first cell
       recomputes the worked example: $r(y_w) = 2.0$, $r(y_l) = 0.5 \\Rightarrow \\sigma(1.5) = 0.8176$,
       loss $= 0.2014$. Everything runs in a few seconds on CPU. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F, math

torch.manual_seed(0)

# --- 0. Worked example: pairwise ranking loss for ONE comparison (Eqn. 1). ---
rw, rl = 2.0, 0.5
gap = rw - rl
sig = 1.0 / (1.0 + math.exp(-gap))
loss_we = -math.log(sig)
print("worked example: r(y_w)=%.1f r(y_l)=%.1f  gap=%.1f  sigma=%.4f  loss=%.4f" % (
      rw, rl, gap, sig, loss_we))
# worked example: r(y_w)=2.0 r(y_l)=0.5  gap=1.5  sigma=0.8176  loss=0.2014


# --- Toy world: an "output" is a 4-dim vector. A hidden "good direction" defines
#     the ground-truth human preference: higher dot-product = preferred. ---
D = 4
good_dir = torch.tensor([1.0, -1.0, 0.5, 0.0])     # true preference (unknown to the models)
def true_score(y): return y @ good_dir             # the human we are imitating

# --- STAGE 1 (SFT, conceptual): the reference policy is a standard normal. ---
sft_mu, std = torch.zeros(D), 1.0                  # pi^SFT

# --- STAGE 2: reward model r_theta, trained with the pairwise ranking loss (Eqn. 1). ---
class RewardModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(nn.Linear(D, 16), nn.ReLU(), nn.Linear(16, 1))
    def forward(self, y): return self.net(y).squeeze(-1)

rm = RewardModel()
rm_opt = torch.optim.Adam(rm.parameters(), lr=0.01)

def rm_accuracy(n=4000):                            # fraction of held-out pairs ranked correctly
    a, b = torch.randn(n, D), torch.randn(n, D)
    win = (true_score(a) >= true_score(b)).unsqueeze(1)
    yw, yl = torch.where(win, a, b), torch.where(win, b, a)
    return (rm(yw) > rm(yl)).float().mean().item()

print("\\nSTAGE 2 — reward model accuracy before training:", round(rm_accuracy(), 3))
for step in range(400):
    rm_opt.zero_grad()
    a, b = torch.randn(64, D), torch.randn(64, D)
    win = (true_score(a) >= true_score(b)).unsqueeze(1)
    yw, yl = torch.where(win, a, b), torch.where(win, b, a)   # (winner, loser) per pair
    loss = -F.logsigmoid(rm(yw) - rm(yl)).mean()             # Eqn. 1
    loss.backward(); rm_opt.step()
print("STAGE 2 — reward model accuracy after  training:", round(rm_accuracy(), 3))

# --- STAGE 3: optimize the policy (a Gaussian's mean mu) to maximize r_theta(y)
#     minus beta * KL(policy || SFT).  beta>0 keeps it near SFT; beta=0 is the ablation. ---
def kl_to_sft(mu): return ((mu - sft_mu) ** 2 / (2 * std ** 2)).sum()   # KL of two equal-std Gaussians
def preferred_rate(mu, n=6000):                                          # TRUE preferred-output rate
    ps = true_score((mu + std * torch.randn(n, D)).detach())
    ss = true_score(sft_mu + std * torch.randn(n, D))
    return (ps > ss).float().mean().item()

for beta, tag in [(1.0, "WITH KL penalty (beta=1.0)"), (0.0, "NO KL penalty (beta=0, ablation)")]:
    torch.manual_seed(1)
    mu = nn.Parameter(sft_mu.clone())                     # policy starts AT the SFT model
    p_opt = torch.optim.Adam([mu], lr=0.02)
    pref0 = preferred_rate(mu)
    for step in range(200):
        p_opt.zero_grad()
        y = mu + std * torch.randn(64, D)                 # policy samples (reward model is FROZEN)
        loss = -rm(y).mean() + beta * kl_to_sft(mu)       # Eqn. 2 (gamma=0): -reward + beta*KL
        loss.backward(); p_opt.step()
    print("\\nSTAGE 3 — %s" % tag)
    print("  preferred-rate: %.3f -> %.3f" % (pref0, preferred_rate(mu)))
    print("  KL to SFT = %.1f   policy mu = %s" % (
          kl_to_sft(mu).item(), [round(v, 2) for v in mu.tolist()]))

# STAGE 2 — reward model accuracy before training: 0.646
# STAGE 2 — reward model accuracy after  training: 0.993
#
# STAGE 3 — WITH KL penalty (beta=1.0)
#   preferred-rate: 0.502 -> 1.000
#   KL to SFT = 11.9   policy mu = [3.0, -3.03, 2.37, 0.32]   <- 4th coord (true weight 0) barely moves
# STAGE 3 — NO KL penalty (beta=0, ablation)
#   preferred-rate: 0.502 -> 1.000
#   KL to SFT = 26.0   policy mu = [3.48, -3.49, 3.38, 4.04]  <- 4th coord DRIFTS to 4.04
# (Our small toy run, not the paper's reported numbers. The reward model is only an
#  estimate; without the KL penalty the policy drifts where the reward has no real signal.)`
  };

  window.CODEVIZ["paper-instructgpt"] = {
    question: "As we optimize the policy against the learned reward, its preferred-output rate rises — but with NO KL penalty the policy keeps drifting away from the SFT model (over-optimization). The KL penalty reaches the same preference quality while staying far closer to SFT.",
    charts: [
      {
        type: "line",
        title: "Policy drift from SFT (KL distance) vs optimization steps — with vs without the KL penalty",
        xlabel: "policy optimization steps (Stage 3)",
        ylabel: "KL distance from the SFT model",
        series: [
          {
            name: "WITH KL penalty (beta=1.0)",
            color: "#7ee787",
            points: [[0,0.0],[40,0.95],[80,3.01],[120,5.58],[160,8.58],[200,11.95]]
          },
          {
            name: "NO KL penalty (beta=0, ablation)",
            color: "#ff7b72",
            points: [[0,0.0],[40,1.24],[80,4.49],[120,9.53],[160,16.65],[200,26.01]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. STAGE 2 first trains a tiny reward model on preference pairs with the pairwise ranking loss (Eqn. 1); its accuracy on held-out pairs rises from ~0.65 to ~0.99. STAGE 3 then optimizes a tiny policy against that (frozen) reward. BOTH settings reach a true preferred-output rate of ~0.50&rarr;1.00 by step ~160. The difference is drift: with the KL penalty (&beta;=1.0, green) the policy stays close to the SFT model (final KL&asymp;11.9); without it (&beta;=0, red) the same policy keeps wandering (final KL&asymp;26.0) and pushes a coordinate the true preference does not care about from ~0.3 to ~4.0 &mdash; reward over-optimization. The KL penalty buys the same quality at far less drift.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, math
torch.manual_seed(0)

D = 4
good_dir = torch.tensor([1.0, -1.0, 0.5, 0.0])
def true_score(y): return y @ good_dir

# --- STAGE 2: reward model trained with the pairwise ranking loss (Eqn. 1) ---
class RewardModel(nn.Module):
    def __init__(self):
        super().__init__(); self.net = nn.Sequential(nn.Linear(D,16), nn.ReLU(), nn.Linear(16,1))
    def forward(self, y): return self.net(y).squeeze(-1)
rm = RewardModel(); opt = torch.optim.Adam(rm.parameters(), lr=0.01)
def rm_acc(n=4000):
    a,b = torch.randn(n,D), torch.randn(n,D); win = (true_score(a)>=true_score(b)).unsqueeze(1)
    yw,yl = torch.where(win,a,b), torch.where(win,b,a)
    return (rm(yw) > rm(yl)).float().mean().item()
print("RM acc before:", round(rm_acc(),3))
for step in range(400):
    opt.zero_grad()
    a,b = torch.randn(64,D), torch.randn(64,D); win = (true_score(a)>=true_score(b)).unsqueeze(1)
    yw,yl = torch.where(win,a,b), torch.where(win,b,a)
    (-F.logsigmoid(rm(yw)-rm(yl)).mean()).backward(); opt.step()
print("RM acc after :", round(rm_acc(),3))

# --- STAGE 3: policy optimization, with vs without the KL penalty (Eqn. 2, gamma=0) ---
sft_mu, std = torch.zeros(D), 1.0
def kl_to_sft(mu): return ((mu-sft_mu)**2 / (2*std**2)).sum()
def pref_rate(mu, n=6000):
    ps = true_score((mu+std*torch.randn(n,D)).detach()); ss = true_score(sft_mu+std*torch.randn(n,D))
    return (ps > ss).float().mean().item()

for beta, tag in [(1.0,"WITH KL"), (0.0,"NO KL (ablation)")]:
    torch.manual_seed(1)
    mu = nn.Parameter(sft_mu.clone()); p_opt = torch.optim.Adam([mu], lr=0.02)
    kl_curve = [(0, round(kl_to_sft(mu).item(),2))]; pr = [(0, round(pref_rate(mu),3))]
    for step in range(1, 201):
        p_opt.zero_grad()
        y = mu + std*torch.randn(64,D)
        (-rm(y).mean() + beta*kl_to_sft(mu)).backward(); p_opt.step()
        if step % 40 == 0:
            kl_curve.append((step, round(kl_to_sft(mu).item(),2)))
            pr.append((step, round(pref_rate(mu),3)))
    print(tag, "final mu", [round(v,2) for v in mu.tolist()], "KL=%.1f"%kl_to_sft(mu).item())
    print("  KL curve  :", kl_curve)
    print("  pref-rate :", pr)
# RM acc before: 0.646
# RM acc after : 0.993
# WITH KL          final mu [3.0, -3.03, 2.37, 0.32] KL=11.9
#   KL curve  : [(0,0.0),(40,0.95),(80,3.01),(120,5.58),(160,8.58),(200,11.95)]
#   pref-rate : [(0,0.502),(40,0.824),(80,0.954),(120,0.987),(160,0.998),(200,1.0)]
# NO KL (ablation) final mu [3.48, -3.49, 3.38, 4.04] KL=26.0
#   KL curve  : [(0,0.0),(40,1.24),(80,4.49),(120,9.53),(160,16.65),(200,26.01)]
#   pref-rate : [(0,0.502),(40,0.826),(80,0.96),(120,0.992),(160,1.0),(200,1.0)]
# (Our small toy run, not the paper's number.)`
  };
})();
