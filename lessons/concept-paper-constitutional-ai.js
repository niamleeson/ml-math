/* Paper lesson — "Constitutional AI: Harmlessness from AI Feedback",
   Bai, Kadavath, Kundu, Askell, ... Kaplan (Anthropic, 2022).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-constitutional-ai".
   GROUNDED from arXiv:2212.08073 (abstract) and the ar5iv HTML mirror:
   Section 1.1 (helpfulness/harmlessness tension, evasiveness), Section 1.2
   (two-stage overview: SL critique->revision->finetune, then RL comparison->
   preference model->RL), Section 1.3 (AI harm-identification improves with scale),
   Section 3.1-3.4 (SL-CAI critique/revision method, 16 principles randomly sampled,
   training settings, revision scaling Figure 5), Section 4.1-4.4 (RL-CAI / RLAIF:
   feedback model produces multiple-choice comparisons, normalized log-prob targets,
   chain-of-thought clamped to 40-60%, preference model reward, non-evasiveness).
   Track: read-only (alignment-method result paper). NO from-scratch model.
   The CODEVIZ runs a TINY TOY critique->revise loop with a made-up keyword "harm
   score" that drops over iterations -- clearly labeled as OUR illustration of the
   shape of the SL-CAI loop, NOT the paper's model, prompts, or measured numbers. */
(function () {
  window.LESSONS.push({
    id: "paper-constitutional-ai",
    title: "Constitutional AI — Harmlessness from AI Feedback (2022)",
    tagline: "Train a harmless assistant with almost no human harm labels: let the model critique and revise itself against written principles, then learn from its own preference judgments.",
    module: "Papers · Transformers & LLMs",
    track: "read-only",
    paper: {
      authors: "Yuntao Bai, Saurav Kadavath, Sandipan Kundu, Amanda Askell, Jackson Kernion, Andy Jones, Anna Chen, et al.; Samuel R. Bowman, Ben Mann, Dario Amodei, Nicholas Joseph, Sam McCandlish, Tom Brown, Jared Kaplan",
      org: "Anthropic",
      year: 2022,
      venue: "arXiv:2212.08073 (Dec 2022)",
      citations: "",
      arxiv: "https://arxiv.org/abs/2212.08073",
      code: ""
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["paper-instructgpt", "paper-ppo", "paper-transformer", "dl-language-model", "dl-cross-entropy", "rl-policy-gradients"],

    // WHY READ IT
    problem:
      `<p>The predecessor to this paper is <b>Reinforcement Learning from Human Feedback</b> (RLHF) &mdash; the
       method taught in the InstructGPT lesson. RLHF aligns a language model by collecting <i>human</i> labels:
       people compare two model answers and pick the better one, a <b>reward model</b> is trained to imitate those
       choices, and the language model is then optimized to score well under that reward model. To make a model
       <b>harmless</b> &mdash; not helping with dangerous, hateful, or illegal requests &mdash; RLHF needs humans
       to label which answers are harmful. That labeling is slow, expensive, and exposes annotators to disturbing
       content.</p>
       <p>There is a second, subtler problem. The paper reports that in their earlier human-feedback work, "there
       was a significant tension between helpfulness and harmlessness, and in particular, our assistant often
       refused to answer controversial questions" (&sect;1.1). Human raters, trying to be safe, kept rewarding
       answers that simply <b>dodge</b> the question. The model learned that the safest move is to say nothing
       useful. The paper calls such answers <b>evasive</b> &mdash; a non-answer like "I cannot help with that,"
       given even when a careful, honest reply would be fine.</p>
       <p>So the question this paper asks: <b>can we train a harmless assistant with almost no human harm labels,
       and without teaching it to be evasive?</b> Their answer is to let the AI supervise itself against a short
       list of written rules.</p>`,
    contribution:
      `<ul>
        <li><b>A two-stage self-supervision recipe.</b> Stage one is supervised: the model <i>critiques</i> and
        <i>revises</i> its own answers against written principles, then is fine-tuned on the revised answers
        (&sect;3). Stage two is reinforcement learning: a preference model trained on the model's <i>own</i>
        comparison judgments replaces human harmlessness labels (&sect;4).</li>
        <li><b>RLAIF &mdash; Reinforcement Learning from AI Feedback.</b> The paper's name for replacing the human
        labels in RLHF with AI-generated labels. "we replace human preferences for harmlessness with 'AI feedback'
        (i.e. we perform 'RLAIF')" (&sect;4.1).</li>
        <li><b>A "constitution" as the only human input on harm.</b> The whole notion of harmlessness is carried by
        a short written list of principles. "We experiment with methods for training a harmless AI assistant
        through self-improvement, without any human labels identifying harmful outputs. The only human oversight is
        provided through a list of rules or principles" (&sect;intro / abstract framing).</li>
        <li><b>Less evasive, more transparent.</b> The trained model explains its objections instead of refusing.
        "we find that RL-CAI is virtually never evasive, and often gives nuanced and harmless responses to most red
        team prompts" (&sect;4.4).</li>
      </ul>`,
    whyItMattered:
      `<p>This paper showed that a model can help supervise its <i>own</i> alignment. The expensive, unpleasant job
       of labeling harmful content was replaced by a one-page list of principles &mdash; the <b>constitution</b>
       &mdash; plus the model's own ability to judge its answers against them. That is a scalability argument: as
       models get better at understanding rules, "as language model capabilities improve, AI identification of
       harms improves significantly" (&sect;1.3), so the AI feedback gets <i>more</i> reliable as the models it
       supervises get stronger. The approach &mdash; write down principles, have the model apply them &mdash;
       became the seed of later "AI feedback" alignment pipelines and popularized the idea of an explicit,
       inspectable constitution as the locus of human values, instead of values buried implicitly in thousands of
       human labels.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;1.1&ndash;1.2 (Motivations and the two-stage overview)</b> &mdash; the helpfulness/harmlessness
        tension, evasiveness, and Figure 1, which lays out the whole pipeline:
        Critique &rarr; Revision &rarr; Supervised Learning, then AI Comparison Evaluations &rarr; Preference Model
        &rarr; Reinforcement Learning. This one figure is the paper.</li>
        <li><b>&sect;3.1 (Method, supervised stage)</b> &mdash; the exact critique-request and revision-request
        prompts, and that the same loop can be applied "multiple times" to revise repeatedly.</li>
        <li><b>&sect;4.1 (Method, RL stage)</b> &mdash; how the feedback model turns each pair of answers into a
        multiple-choice comparison, how the normalized probabilities become the preference-model targets, and the
        chain-of-thought variant (with its $40$&ndash;$60\\%$ clamp).</li>
        <li><b>Figures 2 and 3</b> &mdash; the helpfulness-vs-harmlessness frontier (how RL-CAI compares to plain
        RLHF) and the supervised-stage results.</li>
       </ul>
       <p><b>Skim:</b> the appendices (the full $16$ principles in Appendix C, the red-team prompt details, the
       elo-score plumbing) and the long ablation tables &mdash; useful for replication, not for grasping the idea.
       You do <b>not</b> implement this paper; it is an alignment-method result. Read it for the recipe and the
       claims.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>The supervised stage works like this: show the model a harmful prompt, let it answer, then ask the
       <i>same</i> model to (a) <b>critique</b> its own answer &mdash; point out what is harmful about it &mdash;
       and (b) <b>revise</b> the answer to remove that harm. The paper notes this critique&rarr;revise loop can be
       run "multiple times" on the same answer (&sect;3.1), and Figure 5 plots harmlessness against the number of
       revisions.</p>
       <p>Guess before reading on: as you apply <b>more</b> revision rounds (1, then 2, then 3, then 4), does the
       resulting model get <b>monotonically more harmless</b>, get worse, or plateau immediately after one round?
       Write your guess and one sentence of reasoning about whether re-critiquing an already-revised answer should
       keep finding things to fix.</p>`,
    attempt:
      `<p>This is a read-only paper, so there is nothing to train from scratch. Instead, before the reveal, sketch
       the critique&rarr;revise loop on paper:</p>
       <ul>
        <li>Write the loop as four steps: (1) sample an answer to a harmful prompt; (2) append a fixed
        <b>critique request</b> and sample a critique; (3) append a fixed <b>revision request</b> and sample a
        revised answer; (4) optionally feed the revised answer back into step 2.</li>
        <li>Predict: if each revision round removes <i>some</i> of the remaining harm, what curve should "harm
        remaining" trace against the number of rounds? (Hint: think of a fraction $r$ of harm surviving each
        round.)</li>
        <li>TODO: suppose each round leaves a fraction $r = 0.6$ of the previous harm. Starting from a harm score
        of $1.0$, compute the score after $1$, $2$, $3$, and $4$ rounds. Does it ever reach exactly zero?</li>
       </ul>
       <p>The CODEVIZ panel below runs a <b>toy</b> version of exactly this loop &mdash; a made-up "harm score"
       that shrinks each round &mdash; so you can see the monotone decrease. It is clearly labeled as our
       illustration of the loop's <i>shape</i>, not the paper's model, prompts, or measured numbers.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The method has <b>two stages</b>, run one after the other (&sect;1.2). The first is supervised and gets
       the model roughly "on distribution" &mdash; answering in the desired harmless style. The second is
       reinforcement learning and sharpens it. "The training process has two stages ... where the first supervised
       phase gets the model 'on-distribution' and the second RL stage refines and significantly improves
       performance" (&sect;1.2).</p>

       <p><b>The constitution.</b> First, the one human ingredient. A <b>constitution</b> is a short written list of
       principles describing what counts as a good (harmless) answer &mdash; for example, "choose the response that
       is least harmful, unethical, or illegal." The paper wrote $16$ such principles. "We wrote a set of 16
       different principles, and randomly sampled a principle for each comparison label" (&sect;4.1). One principle
       is drawn at random each time the model is asked to judge or revise; this stops the model from over-fitting to
       a single phrasing.</p>

       <p><b>Stage 1 &mdash; Supervised Constitutional AI (SL-CAI), &sect;3.1.</b> The pipeline is
       Critique &rarr; Revision &rarr; Supervised Learning:</p>
       <ol>
        <li><b>Sample a response.</b> "We begin by showing the helpful RLHF model a prompt designed to elicit
        harmful behavior, then sampling a response from the model" (&sect;3.1). The starting model is a
        <i>helpful-only</i> assistant trained with ordinary RLHF, so it will often comply with the bad request.</li>
        <li><b>Critique.</b> Append a fixed instruction asking the model to find the harm in its own answer. The
        paper's example critique request: "Identify specific ways in which the assistant's last response is harmful,
        unethical, racist, sexist, toxic, dangerous, or illegal" (&sect;3.1). The model writes a
        <b>critique</b> &mdash; a short explanation of what is wrong.</li>
        <li><b>Revise.</b> Append a fixed instruction asking the model to rewrite the answer. The paper's revision
        request: "Please rewrite the assistant response to remove any and all harmful, unethical, racist, sexist,
        toxic, dangerous, or illegal content" (&sect;3.1). The model produces a <b>revision</b> &mdash; a cleaned-up
        answer.</li>
        <li><b>Repeat (optional).</b> "since the final prompt-revision pair is formatted in the same manner as the
        original prompt-response pair, we can apply the same critique-revision pipeline multiple times" (&sect;3.1).
        Each extra round can catch harm the previous round missed.</li>
        <li><b>Fine-tune.</b> Collect all the final revised answers (plus some plain helpfulness samples so the model
        stays useful) and fine-tune the pre-trained model on them. The result is the <b>SL-CAI</b> model.</li>
       </ol>
       <p>Scaling the number of revisions helps: models trained on revisions $1$ through $4$ show steady
       harmlessness gains (&sect;3.4, Figure 5).</p>

       <p><b>Stage 2 &mdash; Reinforcement Learning from AI Feedback (RL-CAI / RLAIF), &sect;4.1.</b> This stage is
       structurally identical to RLHF, but the human harmlessness labels are replaced by AI-generated ones. The
       pipeline is AI Comparison Evaluations &rarr; Preference Model &rarr; Reinforcement Learning:</p>
       <ol>
        <li><b>Generate two candidate answers.</b> Use the SL-CAI model to sample a <i>pair</i> of responses to a
        prompt.</li>
        <li><b>Ask the AI which is more harmless.</b> Present the prompt and the two answers to a <b>feedback
        model</b> as a multiple-choice question, together with a randomly chosen constitutional principle:
        "We then present the prompt and response pair to the feedback model with a principle for choosing the more
        harmless response" (&sect;4.1). The feedback model's probabilities for choosing answer (A) vs. (B) are the
        AI's <b>preference label</b>.</li>
        <li><b>Build the preference dataset.</b> "we make a labeled, preference modeling comparison example with the
        normalized probabilities as targets" (&sect;4.1). The two answer probabilities are normalized to sum to one
        and used as <i>soft</i> targets &mdash; not a hard 0/1 pick.</li>
        <li><b>Train the preference model (PM).</b> A <b>preference model</b> is a network that reads a single
        answer and outputs a scalar score, trained so that the answer the AI preferred gets the higher score. (&sect;4.2.)
        It plays exactly the role the reward model plays in RLHF.</li>
        <li><b>Reinforcement learning.</b> Optimize the assistant so its answers earn high scores from the
        preference model, using the same policy-gradient RL as RLHF (the PPO family from the PPO lesson). The result
        is the <b>RL-CAI</b> model. (&sect;4.2.)</li>
       </ol>
       <p><b>Chain-of-thought variant.</b> The feedback model can be asked to <i>reason step by step</i> before
       picking the more harmless answer; this is called <b>chain-of-thought</b> prompting. Such reasoning tends to
       make the model over-confident (probabilities near $0$ or $1$), which destabilizes RL, so the paper clamps
       them: "clamping the CoT probabilities to lie within the 40-60 percent range led to better and more robust
       behavior" (&sect;4.1).</p>`,
    architecture:
      `<p>There is no new neural network here &mdash; the "architecture" is a <b>two-stage training pipeline</b> wired
       on top of an existing transformer language model. Component by component, with the data that flows between them:</p>

       <p><b>Shared ingredients (built once):</b></p>
       <ul>
        <li><b>Pre-trained LM &rarr; helpful RLHF model.</b> A standard transformer language model, first turned into a
        <i>helpful-only</i> assistant by ordinary RLHF. It is helpful but will comply with harmful requests &mdash; the
        starting point for both stages (&sect;3.1).</li>
        <li><b>Constitution.</b> A fixed list of $16$ written principles (Appendix C). One principle is sampled at random
        each time the model critiques, revises, or judges. This is the only human input about harm (&sect;4.1).</li>
       </ul>

       <p><b>Stage 1 &mdash; SL-CAI (supervised), Critique &rarr; Revision &rarr; Supervised Learning (&sect;3):</b></p>
       <ol>
        <li><b>Sampler.</b> Feed a red-team prompt to the helpful model; sample answer $y_0$.</li>
        <li><b>Critique head (same model, prompted).</b> Append a fixed critique-request + a sampled principle; the model
        emits critique $c$ naming the harm.</li>
        <li><b>Revision head (same model, prompted).</b> Append a fixed revision-request; the model emits revised answer
        $y_1$. Because $y_1$ has the same format as $y_0$, this block <i>loops</i> back to the critique head $0$&ndash;$n$
        times, producing $y_1,y_2,\\dots$ (&sect;3.1).</li>
        <li><b>Fine-tuner.</b> Collect final revisions (plus helpfulness samples) and maximum-likelihood fine-tune the
        pre-trained LM on them &rarr; the <b>SL-CAI model</b> (&sect;3.2).</li>
       </ol>

       <p><b>Stage 2 &mdash; RL-CAI / RLAIF (reinforcement), AI Comparisons &rarr; Preference Model &rarr; RL (&sect;4):</b></p>
       <ol>
        <li><b>Pair sampler.</b> From the SL-CAI model, sample a pair of answers $(A,B)$ for each prompt.</li>
        <li><b>Feedback model.</b> A separate LM is shown the prompt, $A$, $B$, and a random principle as a multiple-choice
        question; its answer-choice log-probs $\\ell_A,\\ell_B$ are softmax-normalized to a soft label $p_A$, ensembled
        over the $16$ principles, and (for the CoT variant) clamped to $[0.40,0.60]$ (&sect;4.1).</li>
        <li><b>Comparison dataset.</b> Each $(prompt, A, B, p_A)$ becomes one soft-labeled preference example.</li>
        <li><b>Preference model (PM).</b> A transformer with a scalar-score head $r(\\cdot)$, trained on the comparison
        dataset with the logistic ranking loss. It replaces RLHF's human-trained reward model (&sect;4.2).</li>
        <li><b>RL loop.</b> PPO-family policy gradient optimizes the assistant policy $\\pi_\\theta$ to maximize
        $r_{\\text{total}} = r_{\\text{PM}} - \\lambda_{\\text{KL}} D_{\\mathrm{KL}}(\\pi_\\theta\\Vert\\pi_0)$ &rarr; the final
        <b>RL-CAI model</b> (&sect;4.2).</li>
       </ol>
       <p>Data flow end to end: prompt &rarr; (Stage 1) self-critique/revise &rarr; SL-CAI weights &rarr; (Stage 2)
       self-judged comparisons &rarr; PM scores &rarr; RL-optimized RL-CAI assistant. The two stages run once, in order;
       the only human-authored object touched at inference-design time is the constitution.</p>`,
    symbols: [
      { sym: "“constitution”", desc: "a plain term, not a symbol: the short written list of principles that defines harmless behavior. The paper used $16$ principles (&sect;4.1, Appendix C). It is the ONLY human input about harm in the whole method." },
      { sym: "“principle”", desc: "a plain term: one rule from the constitution, e.g. 'choose the response that is least harmful, unethical, or illegal.' One principle is randomly sampled each time the model critiques, revises, or judges (&sect;4.1)." },
      { sym: "“critique”", desc: "a plain term: a model-generated explanation that points out what is harmful in a given answer. Produced by appending a fixed critique-request instruction to the conversation (&sect;3.1)." },
      { sym: "“revision”", desc: "a plain term: a model-generated rewrite of an answer that removes the harm the critique identified. Produced by appending a fixed revision-request instruction (&sect;3.1)." },
      { sym: "“SL-CAI”", desc: "a plain term: the model produced by the Supervised-Learning stage of Constitutional AI &mdash; fine-tuned on the model's own revised answers (&sect;3)." },
      { sym: "“RLAIF / RL-CAI”", desc: "a plain term: Reinforcement Learning from AI Feedback. The RL stage where AI-generated comparison labels replace the human harmlessness labels of RLHF (&sect;4.1). RL-CAI is the resulting model." },
      { sym: "“feedback model”", desc: "a plain term: the AI model that, given a prompt, two candidate answers, and a principle, outputs which answer is more harmless. Its choice probabilities become the preference labels (&sect;4.1)." },
      { sym: "“preference model” (PM)", desc: "a plain term: a network trained on the AI-generated comparisons that assigns a scalar score to any single answer; used as the reward signal in the RL stage (&sect;4.2). It is the AI-feedback analogue of RLHF's reward model." },
      { sym: "“evasive”", desc: "a plain term: an answer that dodges the question ('I cannot help with that') instead of engaging. Standard RLHF inadvertently rewarded evasiveness; a goal of Constitutional AI is to be harmless WITHOUT being evasive (&sect;1.1, &sect;4.4)." },
      { sym: "“chain-of-thought” (CoT)", desc: "a plain term: prompting the feedback model to reason step by step before answering. It improves judgments but yields over-confident probabilities, so the paper clamps them to the $40$&ndash;$60\\%$ range (&sect;4.1)." },
      { sym: "$\\theta$", desc: "the trainable parameters (weights) of the language model. $\\theta_{\\text{SL-CAI}}$ is the parameter setting after the supervised stage; in the RL stage $\\theta$ continues to be updated." },
      { sym: "$y_0,\\ c,\\ y_1$", desc: "the three pieces of one critique/revise round (&sect;3.1): $y_0$ the original sampled answer, $c$ the model's critique of it, $y_1$ the revised answer. Repeating gives $y_2,y_3,\\dots$" },
      { sym: "$p_\\theta(y\\mid \\text{prompt})$", desc: "the probability the model with parameters $\\theta$ assigns to producing answer $y$ given the prompt. $\\log p_\\theta$ summed over the data is the maximum-likelihood (cross-entropy) fine-tuning objective." },
      { sym: "$A,\\ B$", desc: "the two candidate answers sampled from the SL-CAI model for one prompt in the RL stage; the feedback model judges which of the pair is more harmless (&sect;4.1)." },
      { sym: "$\\ell_A,\\ \\ell_B$", desc: "the log-probabilities the feedback model assigns to picking answer-choice 'A' versus 'B' in the multiple-choice harmlessness question (&sect;4.1). They are the raw scores fed into the softmax." },
      { sym: "$p_A,\\ p_B$", desc: "the normalized (softmax) probabilities that answer $A$ resp. $B$ is the more harmless one; $p_A+p_B=1$. These soft values are the preference-model targets (&sect;4.1)." },
      { sym: "$p_{\\text{feedback}}(\\cdot)$", desc: "the feedback model's output probability for a token/answer-choice, conditioned on the prompt, both answers, and the sampled principle (&sect;4.1)." },
      { sym: "$\\bar p_A$", desc: "the preference probability averaged (ensembled) over the $16$ constitutional principles; the bar denotes the mean. Ensembling makes the label more robust (&sect;4.1)." },
      { sym: "$\\operatorname{clamp}(x,a,b)$", desc: "clip $x$ into the interval $[a,b]$: return $a$ if $x\\lt a$, $b$ if $x\\gt b$, else $x$. Used to force chain-of-thought probabilities into $[0.40,0.60]$ (&sect;4.1)." },
      { sym: "$r(\\cdot),\\ r_{\\text{PM}}(y)$", desc: "the scalar score the preference model assigns to a single answer (higher = more preferred / harmless). $r_{\\text{PM}}(y)$ is that score used as the RL reward (Bai et al. 2022; &sect;4.2)." },
      { sym: "$\\sigma(z)$", desc: "the logistic sigmoid $1/(1+e^{-z})$, which turns a score difference $r(A)-r(B)$ into a win probability for the preference-model loss." },
      { sym: "$\\mathcal{L}_{\\text{PM}}$", desc: "the preference-model training loss: a logistic (cross-entropy) ranking loss that rewards $r(\\cdot)$ for scoring the AI-preferred answer above the other, weighted by the soft targets $p_A,p_B$." },
      { sym: "$r_{\\text{total}}(y)$", desc: "the full RL reward for an answer (Bai et al. 2022, eq. 4.1): the preference-model score minus a KL penalty. The policy is optimized to maximize it." },
      { sym: "$\\lambda_{\\text{KL}}$", desc: "a small positive coefficient weighting the KL penalty in the RL reward (Bai et al. 2022 report $\\lambda_{\\text{KL}}=0.001$). It controls how far the policy may drift from the initial model." },
      { sym: "$D_{\\mathrm{KL}}(\\pi_\\theta\\Vert\\pi_0)$", desc: "the Kullback&ndash;Leibler divergence between the current policy $\\pi_\\theta$ and the frozen starting policy $\\pi_0$ &mdash; a penalty that keeps RL from straying too far and degrading fluency." },
      { sym: "$\\pi_\\theta,\\ \\pi_0$", desc: "$\\pi_\\theta$ is the assistant policy being trained by RL (parameters $\\theta$); $\\pi_0$ is the initial (pre-RL) policy held fixed as the KL anchor." }
    ],
    formula: `<p><b>This paper is largely procedural</b> &mdash; it states its method in prose and prompts, not closed-form
       equations, and it borrows the preference-model and RL machinery wholesale from its predecessor "Training a
       Helpful and Harmless Assistant" (Bai et al., 2022). Below we make the math that the procedure <i>implies</i>
       explicit, flagging which lines are written in the paper versus carried over from the cited RLHF setup.</p>

       <p><b>Stage 1 &mdash; SL-CAI critique&rarr;revise loop (&sect;3.1), the data-flow the paper describes in words:</b></p>
       $$ \\text{prompt} \\xrightarrow{\\text{sample}} \\text{response}\\ y_0 \\xrightarrow{\\text{critique req.}} \\text{critique}\\ c \\xrightarrow{\\text{revision req.}} \\text{revision}\\ y_1 $$
       <p class="cap">Pipeline of the supervised stage (&sect;3.1). One prompt is turned into a cleaned answer by two fixed instruction appends. Because $y_1$ is formatted like $y_0$, the loop can repeat: $y_1 \\to c' \\to y_2 \\to \\dots$</p>

       $$ \\theta_{\\text{SL-CAI}} \\;=\\; \\arg\\max_{\\theta}\\ \\sum_{i}\\ \\log p_\\theta\\!\\left(y^{(i)}_{\\text{final-revision}} \\mid \\text{prompt}^{(i)}\\right) $$
       <p class="cap">SL-CAI fine-tuning objective (&sect;3.2). Ordinary maximum-likelihood (cross-entropy) fine-tuning of the pre-trained model on its own final revised answers (mixed with helpfulness samples). The paper states this as "finetune," not as an equation.</p>

       <p><b>Stage 2 &mdash; RL-CAI / RLAIF, AI-feedback preference probability (&sect;4.1), written explicitly:</b></p>
       $$ p_A \\;=\\; \\frac{\\exp\\big(\\ell_A\\big)}{\\exp\\big(\\ell_A\\big) + \\exp\\big(\\ell_B\\big)}, \\qquad p_B = 1 - p_A, \\qquad \\ell_X = \\log p_{\\text{feedback}}\\!\\big(\\text{“}X\\text{”} \\mid \\text{prompt},\\,A,\\,B,\\,\\text{principle}\\big) $$
       <p class="cap">The feedback model is shown the prompt, the two answers $A,B$, and a principle, then asked which is more harmless. The paper: "we then compute the log probability of the responses (A) and (B) ... with the normalized probabilities as targets" (&sect;4.1). Normalizing the two answer-choice log-probs $\\ell_A,\\ell_B$ through a softmax gives the soft label $p_A$.</p>

       $$ \\bar p_A \\;=\\; \\frac{1}{16}\\sum_{j=1}^{16} p_A^{(j)} \\qquad\\text{(ensemble over the 16 principles, \\S4.1)} $$
       <p class="cap">The paper randomly samples one of $16$ principles per label and reports that ensembling over principles "led to notably more robust PM behavior" (&sect;4.1). The averaged probability is the soft preference target.</p>

       $$ p_A^{\\text{CoT}} \\;\\leftarrow\\; \\operatorname{clamp}\\!\\big(p_A,\\ 0.40,\\ 0.60\\big) \\;=\\; \\min\\!\\big(0.60,\\ \\max(0.40,\\ p_A)\\big) $$
       <p class="cap">Chain-of-thought clamp (&sect;4.1). When the feedback model reasons step-by-step it becomes over-confident ($p_A$ near $0$ or $1$); "clamping the CoT probabilities to lie within the 40-60 percent range led to better and more robust behavior."</p>

       <p><b>Preference-model training and RL reward &mdash; inherited from Bai et al. 2022 (the process &sect;4 references):</b></p>
       $$ \\mathcal{L}_{\\text{PM}} \\;=\\; -\\,\\mathbb{E}_{(A,B)}\\Big[\\, p_A\\,\\log\\sigma\\!\\big(r(A)-r(B)\\big) + p_B\\,\\log\\sigma\\!\\big(r(B)-r(A)\\big)\\Big], \\qquad \\sigma(z)=\\frac{1}{1+e^{-z}} $$
       <p class="cap">Logistic ranking loss: the preference model $r(\\cdot)$ scores a single answer so the AI-preferred answer scores higher. With soft targets $p_A,p_B$ this is the cross-entropy form of the standard RLHF PM loss; the paper trains the PM "following the process in [Bai et al., 2022]" (&sect;1.2, &sect;4.2).</p>

       $$ r_{\\text{total}}(y) \\;=\\; r_{\\text{PM}}(y) \\;-\\; \\lambda_{\\text{KL}}\\,D_{\\mathrm{KL}}\\!\\big(\\pi_\\theta(\\cdot\\mid x)\\ \\Vert\\ \\pi_0(\\cdot\\mid x)\\big) $$
       <p class="cap">RL reward used in the RL-CAI stage, from the cited RLHF setup (Bai et al. 2022, eq. 4.1): the PM score minus a KL penalty that keeps the policy $\\pi_\\theta$ near the initial policy $\\pi_0$. The assistant is then optimized to maximize this with PPO-family policy-gradient RL (&sect;4.2).</p>`,
    whatItDoes:
      `<p>Each equation above, in words:</p>
       <ul>
        <li><b>SL-CAI loop &amp; fine-tune objective.</b> Sample answer $y_0$, critique it ($c$), rewrite it ($y_1$),
        optionally repeat; then fine-tune the model by maximizing the log-probability $\\log p_\\theta$ of its own final
        revisions. The fine-tune line is just supervised cross-entropy on cleaned answers.</li>
        <li><b>AI-feedback preference probability.</b> The feedback model scores the two answer choices with log-probs
        $\\ell_A,\\ell_B$; the softmax turns them into $p_A$ (and $p_B=1-p_A$), the soft chance that $A$ is the more
        harmless answer. This is the AI label that replaces a human's pick.</li>
        <li><b>Ensemble.</b> Average $p_A$ over the $16$ principles to get $\\bar p_A$ &mdash; a less noisy label than any
        single principle gives.</li>
        <li><b>CoT clamp.</b> If the feedback model reasoned step-by-step, clip its probability into $[0.40,0.60]$ so the
        target never becomes near-certain.</li>
        <li><b>PM loss.</b> Train the preference model $r(\\cdot)$ so that $\\sigma(r(A)-r(B))$ matches the soft label
        $p_A$: the AI-preferred answer is pushed to a higher scalar score.</li>
        <li><b>RL reward.</b> Optimize the assistant to maximize the PM score minus a KL leash to the starting model.</li>
       </ul>
       <p>This is exactly the RLHF pipeline from the InstructGPT lesson, with the human comparison label swapped for the
       feedback model's probabilities $p_A,p_B$ &mdash; that swap is all that "RLAIF" means. The first three RL-stage
       lines ($p_A$, $\\bar p_A$, the clamp) are the genuinely new, CAI-specific math; the PM loss and RL reward are
       carried over from the cited RLHF setup (Bai et al. 2022).</p>`,
    derivation:
      `<p>This is a <b>method</b> paper, so "why it is true" is really "why each design choice makes sense," checked
       by reasoning rather than algebra.</p>
       <p><b>Why critique <i>before</i> revise.</b> Asking the model to first name the harm (critique) and only then
       rewrite (revision) is a small instance of chain-of-thought: making the reasoning explicit improves the final
       output. An undirected "make this safer" rewrite is weaker than one that first pinpoints the specific problem.
       That is why the loop has two steps, not one (&sect;3.1).</p>
       <p><b>Why the loop is repeatable, and why more rounds help.</b> Because the revised answer is formatted just
       like an original answer, the same critique&rarr;revise machinery applies to it again (&sect;3.1). If each
       round removes some fraction of the remaining harm, then harm shrinks geometrically with the number of rounds
       &mdash; monotonically down, never quite zero. That predicted monotone decrease is what Figure 5 shows
       empirically (&sect;3.4). The toy CODEVIZ below makes exactly this geometric-decay shape concrete.</p>
       <p><b>Why soft, normalized probabilities as labels (Stage 2).</b> The feedback model is uncertain, so a hard
       "answer A is harmless, answer B is not" throws information away. Using the normalized probabilities
       $p_A, p_B$ as <i>soft</i> targets (&sect;4.1) keeps the preference model calibrated to how confident the AI
       judge actually was &mdash; close-call pairs train it gently, clear-cut pairs train it firmly.</p>
       <p><b>Why clamp chain-of-thought to $40$&ndash;$60\\%$.</b> Step-by-step reasoning makes the feedback model
       confident, pushing probabilities toward $0$ or $1$. Near-certain targets give the preference model and the RL
       step very large, spiky gradients, which destabilizes training. Clamping the probabilities into a narrow band
       keeps the targets soft and the RL stable: "clamping the CoT probabilities to lie within the 40-60 percent
       range led to better and more robust behavior" (&sect;4.1).</p>
       <p><b>Why this reduces evasiveness.</b> In plain RLHF, human raters rewarded any "safe" answer, including pure
       refusals, so the model learned to dodge. Here, harmlessness is judged against explicit principles that a good
       answer can satisfy <i>while still engaging</i>, and the critique/revise data shows the model how to object
       <i>and</i> explain. The reported outcome: "RL-CAI is virtually never evasive" (&sect;4.4).</p>`,
    example:
      `<p>The paper does not give a single worked equation, so we work the one quantitative shape it does claim
       &mdash; that more critique&rarr;revise rounds monotonically reduce harm (&sect;3.4, Figure 5) &mdash; with a
       simple geometric-decay model. <b>This is our own arithmetic to illustrate the loop's shape, using a made-up
       per-round survival fraction; it is not the paper's measured curve.</b></p>
       <p>Model the "harm remaining" in an answer as a number starting at $1.0$. Suppose each critique&rarr;revise
       round removes the same fraction of whatever harm is left, leaving a survival fraction $r = 0.6$ (so $40\\%$
       of the current harm is removed each round). Then after $k$ rounds the harm is $r^{k}$:</p>
       <ul class="steps">
        <li><b>Round 0 (original answer):</b> harm $= 1.000$.</li>
        <li><b>Round 1:</b> harm $= 1.000 \\times 0.6 = 0.600$. Removed $1.000 - 0.600 = 0.400$ this round.</li>
        <li><b>Round 2:</b> harm $= 0.600 \\times 0.6 = 0.360$. Removed $0.600 - 0.360 = 0.240$.</li>
        <li><b>Round 3:</b> harm $= 0.360 \\times 0.6 = 0.216$. Removed $0.360 - 0.216 = 0.144$.</li>
        <li><b>Round 4:</b> harm $= 0.216 \\times 0.6 = 0.1296 \\approx 0.130$. Removed $0.216 - 0.130 = 0.086$.</li>
       </ul>
       <p>The full ledger, with each round's surviving harm $r^{k}$ and the amount it removed:</p>
       <table class="extable">
        <caption>Toy geometric decay of harm, survival fraction $r = 0.6$ per round. Numbers are ours, illustrating the shape &mdash; not the paper's measured curve.</caption>
        <thead>
         <tr><th>round $k$</th><th class="num">harm $= 0.6^{k}$</th><th class="num">removed this round</th></tr>
        </thead>
        <tbody>
         <tr><td class="row-h">0 (original)</td><td class="num">$1.000$</td><td class="num">&mdash;</td></tr>
         <tr><td class="row-h">1</td><td class="num">$0.600$</td><td class="num">$0.400$</td></tr>
         <tr><td class="row-h">2</td><td class="num">$0.360$</td><td class="num">$0.240$</td></tr>
         <tr><td class="row-h">3</td><td class="num">$0.216$</td><td class="num">$0.144$</td></tr>
         <tr><td class="row-h">4</td><td class="num">$0.130$</td><td class="num">$0.086$</td></tr>
        </tbody>
       </table>
       <p>Two things to notice. First, the harm goes <b>down every round</b> &mdash; monotone, matching the paper's
       qualitative claim that revisions $1$&ndash;$4$ keep improving harmlessness (&sect;3.4). Second, each round
       removes <i>less</i> than the one before ($0.40$, then $0.24$, then $0.14$, then $0.09$): diminishing returns,
       and it never reaches exactly zero. That is the geometric-decay signature of "remove a fraction of what
       remains." The CODEVIZ recomputes these exact numbers in a toy loop so you can verify them.</p>`,
    recipe:
      `<p>This is a read-only paper, so there is no architecture to assemble. Here is the full Constitutional AI
       procedure as numbered steps &mdash; the recipe you would follow to reproduce the pipeline:</p>
       <ol>
        <li><b>Write a constitution</b> &mdash; a short list of harmlessness principles (the paper used $16$;
        &sect;4.1).</li>
        <li><b>Start from a helpful-only model</b> trained with ordinary RLHF (helpful, but not yet harmless).</li>
        <li><b>SL-CAI &mdash; critique/revise (&sect;3.1):</b> for many harm-eliciting prompts, sample an answer,
        append a critique request and sample a critique, append a revision request and sample a revision; optionally
        repeat the loop a few times.</li>
        <li><b>SL-CAI &mdash; fine-tune (&sect;3.2):</b> fine-tune the model on the final revised answers (mixed
        with helpfulness samples) to get the SL-CAI model.</li>
        <li><b>RL-CAI &mdash; AI comparisons (&sect;4.1):</b> sample answer pairs from SL-CAI; have a feedback model,
        given a random principle, output harmlessness probabilities for each; store them as soft preference
        labels (clamp chain-of-thought probabilities to $40$&ndash;$60\\%$).</li>
        <li><b>RL-CAI &mdash; preference model (&sect;4.2):</b> train a preference model on those comparisons so it
        scores any single answer.</li>
        <li><b>RL-CAI &mdash; reinforcement learning (&sect;4.2):</b> optimize the assistant against the preference
        model with policy-gradient RL (the PPO family) to get the final RL-CAI model.</li>
       </ol>`,
    results:
      `<p><b>On the helpfulness/harmlessness frontier (quoted, &sect;1.1, Figure 2 caption):</b> "The RL-CAI models
       trained with AI feedback learn to be less harmful at a given level of helpfulness."</p>
       <p><b>Versus standard human-feedback training (quoted, &sect;1 introduction):</b> the new assistant "RL-CAI"
       is "preferred by crowdworkers over those trained with previously collected human feedback labels for
       harmfulness."</p>
       <p><b>On evasiveness (quoted, &sect;4.4):</b> "we find that RL-CAI is virtually never evasive, and often gives
       nuanced and harmless responses to most red team prompts."</p>
       <p><b>On the supervised stage (quoted, &sect;3.3):</b> "SL-CAI is both more helpful and harmless than
       pre-trained models, as expected."</p>
       <p><b>On scaling AI supervision (quoted, &sect;1.3, Figure 4):</b> "as language model capabilities improve, AI
       identification of harms improves significantly."</p>
       <p><i>These are the paper's own statements, transcribed from the abstract and the sections cited. The numbers
       in the CODEVIZ panel below come from a tiny toy critique&rarr;revise loop of our own &mdash; they are an
       illustration of the loop's shape, not the paper's measured results.</i></p>`,
    evaluation:
      `<p><b>Metric &amp; benchmark.</b> This is a read-only alignment-method paper, so "working" is judged by
       <b>human-preference win rates</b> (crowdworker Elo) on the <b>helpfulness/harmlessness frontier</b> and by a
       <b>harmlessness preference-model score</b> on held-out <b>red-team prompts</b> (&sect;1.1, Figures 2&ndash;3).
       The no-skill baselines are the prior pipeline it must beat: the <b>helpful-only RLHF</b> starting model (harmful
       when asked) and a <b>standard RLHF harmlessness</b> model. The paper's claim is that RL-CAI is "preferred by
       crowdworkers over those trained with previously collected human feedback labels for harmfulness" (&sect;1) and
       is "virtually never evasive" (&sect;4.4). A second, cheaper metric is <b>evasiveness rate</b> &mdash; fraction
       of red-team prompts answered with a bare refusal &mdash; which RL-CAI should drive toward zero.</p>
       <ul>
        <li><b>Sanity checks BEFORE the full run.</b> You are not training a model here, so the checks are on the
        <b>pipeline plumbing</b>. (1) Verify the critique&rarr;revise loop reduces a cheap proxy harm score
        monotonically over rounds (the toy loop: $10\\to6\\to4\\to2\\to1$). (2) Check the feedback-model soft labels are
        valid probabilities: $p_A+p_B=1$ and, for the chain-of-thought variant, every $p_A\\in[0.40,0.60]$ after the
        clamp. (3) Confirm the preference-model loss at init matches the theoretical value for a coin-flip judge:
        with $r(A)=r(B)$, $\\sigma(0)=0.5$, so $\\mathcal{L}_{\\text{PM}}\\approx-\\ln(1/2)\\approx0.69$ (a $2$-way
        cross-entropy rule of thumb). (4) Spot-check that one principle is actually being sampled per comparison and
        ensembled over all $16$, not silently fixed to one.</li>
        <li><b>Expected range.</b> Anchor to the paper's qualitative claims (it reports frontiers, not single scalar
        scores you can reproduce on a laptop): SL-CAI is "both more helpful and harmless than pre-trained models"
        (&sect;3.3); RL-CAI sits <i>above</i> the RLHF harmlessness curve at matched helpfulness (&sect;1.1) and is
        "virtually never evasive" (&sect;4.4). For the toy decay model, a survival fraction $r=0.6$ gives harm
        $1.0,0.6,0.36,0.216,0.13$ over rounds $0$&ndash;$4$ &mdash; these numbers are <b>ours</b>, an illustration of
        shape, not the paper's measured curve. A revision curve that is flat or rising means the loop is broken.</li>
        <li><b>Ablation &mdash; prove the central idea earns its keep.</b> The paper's core move is <b>AI feedback in
        place of human harm labels</b> plus the <b>critique-before-revise</b> step. Turn the critique step OFF (ask the
        model to "rewrite to be harmless" with no separate critique) and the revised-answer harmlessness should
        <b>drop</b> &mdash; revisions become shallow and miss subtle harms (&sect;3.1 rationale). A second knob:
        <b>skip the CoT clamp</b> and feed raw near-$0/1$ feedback probabilities &mdash; RL should become unstable
        (the paper clamps to $40$&ndash;$60\\%$ precisely to avoid this, &sect;4.1). If neither change hurts, the
        component is not actually wired into the pipeline.</li>
        <li><b>Failure signals &amp; what they mean.</b> <b>Harmlessness stuck at the helpful-only baseline</b> &rarr;
        the AI labels are not flowing into the preference model (labels constant, or PM not trained). <b>RL reward
        climbs but the model gets evasive</b> &rarr; the constitution / feedback rewards bare refusals; you have
        reproduced the original RLHF evasiveness trap, not fixed it (&sect;1.1). <b>RL loss / KL blows up</b> &rarr;
        unclamped over-confident CoT targets or $\\lambda_{\\text{KL}}$ too small (paper uses $0.001$). <b>Harm score
        flat across revision rounds</b> &rarr; the revise step is a no-op (it returns the original answer). <b>Soft
        labels collapse to $0/1$</b> &rarr; the CoT clamp was skipped. The toy CODEVIZ's monotone, diminishing-returns
        decay is the "loop working" shape to compare against.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>read-only</b> paper: an alignment-method result, not a primitive or a novel architecture.
       There is no PyTorch layer to reconstruct and no model you can realistically train here &mdash; the pipeline
       needs large helpful-RLHF models, a feedback model, a preference model, and an RL loop, all far beyond a CPU
       demo. What you <i>do</i> instead is <b>understand</b> the recipe: the SL critique&rarr;revise loop, the RLAIF
       swap of human labels for AI labels, the constitution as the single human input, and why each choice (soft
       labels, the chain-of-thought clamp, reducing evasiveness) is there.</p>
       <p>The optional code below is a <b>tiny conceptual illustration</b> of just the SL loop's <i>shape</i>. It
       runs a made-up critique&rarr;revise loop over a fixed toy string, where "harm" is a count of flagged keywords
       that a fake critique-and-revise step removes a fraction of each round. It reproduces the worked example's
       geometric decay so you can watch the harm score fall monotonically. It uses <b>no real language model, no
       real prompts, and none of the paper's numbers</b> &mdash; it only shows why "more revisions &rarr; less harm"
       has the shape it does.</p>`,
    pitfalls:
      `<ul>
        <li><b>Thinking "no human labels at all."</b> Constitutional AI removes human <i>harmlessness</i> labels,
        not all human input. It still uses human <i>helpfulness</i> feedback, and a human-written constitution. "The
        only human oversight is provided through a list of rules or principles" &mdash; that list is human-authored.
        <b>Fix:</b> say "no human harm labels," not "no humans."</li>
        <li><b>Confusing the two stages.</b> SL-CAI (&sect;3) is supervised fine-tuning on self-revised answers; it
        gets the model on-distribution. RL-CAI / RLAIF (&sect;4) is reinforcement learning against a preference model
        trained on AI comparisons; it refines further. They are sequential, not alternatives. <b>Fix:</b> SL first,
        then RL.</li>
        <li><b>Equating RLAIF with RLHF.</b> The RL machinery is the same (a learned reward/preference model, then
        policy-gradient RL). What differs is the <i>source of the labels</i>: AI comparisons instead of human ones.
        <b>Fix:</b> RLAIF = RLHF with AI-generated preference labels (&sect;4.1).</li>
        <li><b>Skipping the chain-of-thought clamp.</b> Letting the reasoning feedback model output its raw,
        near-certain probabilities makes RL unstable. The paper clamps them to $40$&ndash;$60\\%$ (&sect;4.1). <b>Fix:</b>
        keep AI preference targets soft.</li>
        <li><b>Believing harmlessness means refusing.</b> A central point is the opposite: the model should be
        harmless <i>and</i> non-evasive &mdash; it explains its objection instead of dodging (&sect;4.4). <b>Fix:</b> a
        refusal is not the goal; a nuanced, engaged, harmless answer is.</li>
      </ul>`,
    recall: [
      "Name the two stages of Constitutional AI and the three sub-steps of each (from Figure 1 / &sect;1.2).",
      "Define 'constitution', 'critique', 'revision', 'preference model', and 'RLAIF' in one sentence each.",
      "In the RL stage, what replaces the human harmlessness labels of RLHF, and how are the AI labels turned into preference-model targets?",
      "Why does the paper clamp the chain-of-thought feedback probabilities to the 40-60% range?",
      "What does 'evasive' mean, and what does the paper claim about RL-CAI and evasiveness (&sect;4.4)?"
    ],
    practice: [
      {
        q: `<b>Geometric decay of harm.</b> Model the harm remaining in an answer as starting at $1.0$, with each
            critique&rarr;revise round leaving a survival fraction $r = 0.6$. (a) What is the harm after $3$ rounds?
            (b) Does each round remove the same <i>amount</i> of harm? (c) What does this predict about the shape of
            the paper's harmlessness-vs-revisions curve (&sect;3.4, Figure 5)? <i>(This survival fraction is our
            illustration, not a paper number.)</i>`,
        steps: [
          { do: `Harm after $k$ rounds is $r^{k}$, so after $3$ rounds it is $0.6^{3}$.`, why: `Each round multiplies the remaining harm by the same survival fraction $r$, so after $k$ rounds you have multiplied by $r$ exactly $k$ times.` },
          { do: `Compute $0.6^{3} = 0.216$.`, why: `$0.6 \\times 0.6 = 0.36$, and $0.36 \\times 0.6 = 0.216$.` },
          { do: `Compare amounts removed per round: $0.40$ (round 1), $0.24$ (round 2), $0.144$ (round 3). They shrink.`, why: `Removing a fixed fraction of an ever-smaller remainder removes a smaller absolute amount each time &mdash; diminishing returns.` }
        ],
        answer: `<p>(a) After $3$ rounds the harm is $0.6^{3} = 0.216$. (b) No &mdash; the <i>fraction</i> removed is
                 constant ($40\\%$) but the <i>amount</i> shrinks each round ($0.40$, then $0.24$, then $0.144$). (c)
                 It predicts a <b>monotonically decreasing curve with diminishing returns</b> that approaches but
                 never reaches zero &mdash; the same qualitative shape as the paper's revisions-$1$-to-$4$
                 improvement in Figure 5 (the exact numbers there are the paper's; $r=0.6$ is ours).</p>`
      },
      {
        q: `<b>RLHF vs. RLAIF (the swap).</b> In RLHF (the InstructGPT lesson), a human looks at two answers and
            labels which is better; a reward model imitates those labels; RL optimizes the policy against the reward
            model. State precisely what Constitutional AI's RL stage (&sect;4.1) changes and what it keeps the same.`,
        steps: [
          { do: `Identify the swapped piece: the source of the comparison label.`, why: `RLAIF replaces the human's pick with a feedback model's choice probabilities, given the prompt, the two answers, and a randomly sampled principle (&sect;4.1).` },
          { do: `Identify what is kept: train a preference model on the comparisons, then run policy-gradient RL against it.`, why: `The preference model plays the reward model's role, and the RL optimization (the PPO family) is the same as in RLHF (&sect;4.2).` },
          { do: `Note the label form: normalized, soft probabilities, not a hard 0/1.`, why: `'we make a labeled, preference modeling comparison example with the normalized probabilities as targets' (&sect;4.1) &mdash; keeping calibration.` }
        ],
        answer: `<p><b>Changed:</b> the harmlessness comparison labels come from an AI feedback model (given a random
                 constitutional principle), not from humans, and they are stored as soft normalized probabilities.
                 <b>Kept:</b> everything downstream &mdash; train a preference model on the comparisons, then optimize
                 the assistant against it with policy-gradient RL, exactly as in RLHF. That single substitution of
                 the label source is what the paper names "RLAIF" (&sect;4.1).</p>`
      },
      {
        q: `<b>Ablation: drop the critique step.</b> Suppose you change the SL stage so the model is asked to
            directly "rewrite this to be harmless" with <i>no</i> separate critique step first. Based on the paper's
            design rationale, predict what you would expect to get worse, and tie it to why the paper uses a
            critique-then-revise loop rather than a single rewrite.`,
        steps: [
          { do: `Recall that critique-then-revise is a chain-of-thought: name the harm explicitly, then fix it.`, why: `The paper's loop has the model first identify 'specific ways in which the assistant's last response is harmful' (&sect;3.1) before rewriting, so the rewrite is targeted.` },
          { do: `Predict the effect of removing the critique: a less-targeted rewrite that misses subtle harms.`, why: `Without first localizing the problem, the model has no explicit reasoning to act on, so revisions should be shallower and the resulting SL-CAI data less harmless.` },
          { do: `Tie to the repeatable-loop point: weaker single revisions also make extra rounds less effective.`, why: `If each round removes less harm, the geometric decay is slower, so the revisions-1-to-4 gains (&sect;3.4) would be smaller.` }
        ],
        answer: `<p>You would expect the revised answers to be <b>less harmless</b> and to miss subtler harms,
                 because the critique is a chain-of-thought that localizes the specific problem before the rewrite
                 (&sect;3.1). Removing it forces an undirected "make it safer" edit, which is shallower; the
                 fine-tuned SL-CAI data is then worse, and because each round removes less harm, the benefit of
                 stacking revisions ($1$&ndash;$4$ rounds, &sect;3.4) also shrinks. The critique step is what makes
                 each revision sharp enough to compound.</p>`
      }
    ]
  });

  window.CODE["paper-constitutional-ai"] = {
    lib: "Python (standard library)",
    runnable: false,
    explain:
      `<p>This is a <b>read-only</b> paper, so there is no model to train or verify. The snippet below is a tiny
       <b>conceptual illustration</b> of the supervised stage's critique&rarr;revise loop only. It defines a fake
       "harm score" as the count of flagged keywords in a toy answer string, then a fake critique step (which lists
       the flagged words) and a fake revision step (which removes a fixed fraction of the remaining flagged words).
       Running the loop a few times shows the harm score fall <b>monotonically with diminishing returns</b> &mdash;
       the same geometric-decay shape as the worked example, and the same qualitative shape the paper reports for
       revisions $1$&ndash;$4$ (&sect;3.4, Figure 5). It uses <b>no language model, no real prompts, and none of the
       paper's numbers.</b> Pure standard-library Python, CPU, runs instantly.</p>`,
    code: `# Conceptual illustration of the SL-CAI critique->revise loop (OUR toy, NOT the paper).
# "Harm" here = count of flagged keywords in a toy answer. A fake critique lists them;
# a fake revision removes a fixed FRACTION of the remaining flagged words each round.
# This shows the SHAPE (monotone decay, diminishing returns) -- it is not a real model.
import math, random
random.seed(0)

# A toy "answer" as a list of word tokens; some are flagged as harmful.
FLAGGED = {"dangerous", "illegal", "toxic", "harmful", "unsafe",
           "weapon", "attack", "exploit", "poison", "harmful2"}
answer = ("here is a dangerous and illegal plan that is toxic harmful unsafe "
          "to build a weapon and attack and exploit and poison people").split()

def harm_score(tokens):
    "Fake harm metric: how many flagged keywords remain."
    return sum(t in FLAGGED for t in tokens)

def critique(tokens):
    "Fake critique: name the specific flagged words (the 'specific ways it is harmful')."
    return [t for t in tokens if t in FLAGGED]

def revise(tokens, survive=0.6):
    "Fake revision: drop a FRACTION (1-survive) of the currently-flagged words."
    bad = [i for i, t in enumerate(tokens) if t in FLAGGED]
    n_remove = round((1 - survive) * len(bad))
    to_remove = set(random.sample(bad, n_remove)) if n_remove else set()
    return [t for i, t in enumerate(tokens) if i not in to_remove]

print("round 0 (original): harm = %d" % harm_score(answer))
cur = answer
for k in range(1, 5):
    flags = critique(cur)            # critique step
    cur = revise(cur)                # revision step
    print("round %d: critique flagged %2d word(s) -> revised harm = %d"
          % (k, len(flags), harm_score(cur)))

# round 0 (original): harm = 10
# round 1: critique flagged 10 word(s) -> revised harm = 6
# round 2: critique flagged  6 word(s) -> revised harm = 4
# round 3: critique flagged  4 word(s) -> revised harm = 2
# round 4: critique flagged  2 word(s) -> revised harm = 1
# Harm falls every round with diminishing returns -- the geometric-decay shape of the
# worked example (survive=0.6). OUR toy illustration, NOT the paper's measured curve.`
  };

  window.CODEVIZ["paper-constitutional-ai"] = {
    question: "If each critique->revise round removes a fixed FRACTION of the remaining harm, what shape does the 'harm remaining' trace as the number of rounds grows? Does it match the worked example's geometric decay?",
    charts: [
      {
        type: "line",
        title: "Toy 'harm remaining' vs. number of critique->revise rounds (OUR illustration, NOT the paper's numbers)",
        xlabel: "number of critique->revise rounds k",
        ylabel: "harm remaining  (starts at 1.0; survival fraction r = 0.6 per round)",
        series: [
          {
            name: "harm remaining = 0.6^k (continuous geometric model)",
            color: "#7ee787",
            points: [[0,1.0],[1,0.6],[2,0.36],[3,0.216],[4,0.1296]]
          },
          {
            name: "amount removed in round k",
            color: "#ff7b72",
            points: [[1,0.4],[2,0.24],[3,0.144],[4,0.0864]]
          }
        ]
      }
    ],
    caption: "OUR illustration of the loop's SHAPE, NOT the paper's measured curve. With a made-up per-round survival fraction r = 0.6, the harm remaining is 0.6^k: 1.0, 0.6, 0.36, 0.216, 0.1296 after 0-4 rounds -- monotonically decreasing and approaching but never reaching zero. The amount removed each round (0.40, 0.24, 0.144, 0.0864) shrinks: diminishing returns. This is the geometric-decay reasoning behind the paper's qualitative finding that revisions 1-4 keep improving harmlessness (Section 3.4, Figure 5) -- but r = 0.6 and these values are ours, not the paper's. The real paper trains models and measures harmlessness on held-out red-team prompts; nothing here is a real model run.",
    code: `# OUR toy geometric-decay model of the critique->revise loop. r is made up.
r = 0.6                       # survival fraction of harm per round (illustration)
harm = 1.0
print("round 0: harm remaining = %.4f" % harm)
prev = harm
for k in range(1, 5):
    harm *= r
    print("round %d: harm remaining = %.4f   removed this round = %.4f"
          % (k, harm, prev - harm))
    prev = harm
# round 0: harm remaining = 1.0000
# round 1: harm remaining = 0.6000   removed this round = 0.4000
# round 2: harm remaining = 0.3600   removed this round = 0.2400
# round 3: harm remaining = 0.2160   removed this round = 0.1440
# round 4: harm remaining = 0.1296   removed this round = 0.0864
# Monotone decrease with diminishing returns. OUR illustration of the SHAPE,
# NOT the paper's measured harmlessness-vs-revisions curve (Section 3.4).`
  };
})();
