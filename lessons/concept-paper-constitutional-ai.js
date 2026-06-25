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
      { sym: "“chain-of-thought” (CoT)", desc: "a plain term: prompting the feedback model to reason step by step before answering. It improves judgments but yields over-confident probabilities, so the paper clamps them to the $40$&ndash;$60\\%$ range (&sect;4.1)." }
    ],
    formula: `$$ \\underbrace{\\text{prompt} \\xrightarrow{\\text{sample}} \\text{response} \\xrightarrow{\\text{critique req.}} \\text{critique} \\xrightarrow{\\text{revision req.}} \\text{revision}}_{\\textbf{Stage 1: SL-CAI critique/revise loop (\\S3.1), repeatable}} \\;\\Rightarrow\\; \\text{fine-tune} $$ $$ \\underbrace{(\\text{ans } A,\\ \\text{ans } B) \\xrightarrow{\\text{feedback model} + \\text{principle}} p_A,\\,p_B \\;\\to\\; \\text{preference model } r(\\cdot) \\xrightarrow{\\text{RL}} \\text{policy}}_{\\textbf{Stage 2: RL-CAI / RLAIF (\\S4.1-4.2)}} $$`,
    whatItDoes:
      `<p>There is no single equation to plug numbers into &mdash; this is an alignment <i>procedure</i>, not a
       closed-form law. The two lines above are the procedure written as data flow. Read them as:</p>
       <p><b>Stage 1 (top line):</b> take a prompt, sample an answer, then transform that answer with two fixed
       requests &mdash; critique then revise &mdash; to get a cleaner answer. The double arrow means: do this for
       many prompts and fine-tune on the cleaned answers. The loop is <i>repeatable</i>: feed the revision back in
       to critique it again.</p>
       <p><b>Stage 2 (bottom line):</b> for a prompt, sample two answers $A$ and $B$; a feedback model plus a random
       principle assigns them harmlessness probabilities $p_A, p_B$; these soft labels train a preference model
       $r(\\cdot)$ that scores any single answer; reinforcement learning then pushes the assistant to produce answers
       with high $r$. This is exactly the RLHF pipeline from the InstructGPT lesson, with the human comparison label
       swapped for the feedback model's probabilities &mdash; that swap is all that "RLAIF" means.</p>`,
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
        <li><b>Round 1:</b> harm $= 1.000 \\times 0.6 = 0.600$. Removed $0.400$ this round.</li>
        <li><b>Round 2:</b> harm $= 0.600 \\times 0.6 = 0.360$. Removed $0.240$.</li>
        <li><b>Round 3:</b> harm $= 0.360 \\times 0.6 = 0.216$. Removed $0.144$.</li>
        <li><b>Round 4:</b> harm $= 0.216 \\times 0.6 = 0.1296 \\approx 0.130$. Removed $0.086$.</li>
       </ul>
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
