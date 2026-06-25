/* Paper lesson — "Training Compute-Optimal Large Language Models" (Chinchilla),
   Hoffmann et al., DeepMind, 2022. Self-contained: lesson + CODE + CODEVIZ merged
   by id "paper-chinchilla".
   GROUNDED from arXiv:2203.15556 (abstract page) and the ar5iv HTML mirror:
   - Abstract: equal scaling of model size and training tokens; Chinchilla 70B
     "uniformly and significantly outperforms Gopher (280B), GPT-3 (175B), ...".
   - Section 3 (Approaches 1-3): fitted exponents a, b for N_opt ~ C^a, D_opt ~ C^b
     (Approach 1: a=0.50, b=0.50; Approach 2: a=0.49, b=0.51; Approach 3: a=0.46, b=0.54).
   - Section 3.3 + Appendix F: the FLOPs(N,D) ~ 6ND compute relation.
   - Introduction: "current large language models are significantly undertrained".
   - Table 1: Chinchilla 70B params, 1.4 Trillion tokens.
   Track: read-only (pure-scale empirical result). No from-scratch model. The CODEVIZ
   is a SYNTHETIC illustration of the fixed-compute trade-off, with arbitrary toy
   constants -- NOT the paper's measured loss surface. */
(function () {
  window.LESSONS.push({
    id: "paper-chinchilla",
    title: "Chinchilla — Training Compute-Optimal Large Language Models (2022)",
    tagline: "Given a fixed compute budget, grow model size and training tokens equally — most big models were undertrained.",
    module: "Papers · Transformers & LLMs",
    track: "read-only",
    paper: {
      authors: "Jordan Hoffmann, Sebastian Borgeaud, Arthur Mensch, Elena Buchatskaya, Trevor Cai, Eliza Rutherford, Diego de Las Casas, Lisa Anne Hendricks, Johannes Welbl, Aidan Clark, Tom Hennigan, Eric Noland, Katie Millican, George van den Driessche, Bogdan Damoc, Aurelia Guy, Simon Osindero, Karen Simonyan, Erich Elsen, Jack W. Rae, Oriol Vinyals, Laurent Sifre",
      org: "DeepMind",
      year: 2022,
      venue: "arXiv:2203.15556 (Mar 2022); NeurIPS 2022",
      citations: "",
      arxiv: "https://arxiv.org/abs/2203.15556",
      code: ""
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["mod-llm", "mod-transformer", "dl-cross-entropy", "ml-loss", "ml-gradient-descent"],

    // WHY READ IT
    problem:
      `<p>A large language model is trained on a fixed budget of computation. We call that budget $C$,
       measured in <b>FLOPs</b> (floating-point operations &mdash; the total count of multiply-and-add
       arithmetic the training run performs). You get to spend $C$ on two things: how <b>big</b> the model is
       (its parameter count $N$) and how <b>much</b> text it reads (the number of training tokens $D$, where a
       token is a chunk of text, roughly a word-piece). Bigger model or more data &mdash; both cost compute,
       and you only have so much.</p>
       <p>Before this paper, the field mostly spent that budget on <b>size</b>. Each new headline model had more
       parameters, but was trained on a similar, fixed-ish amount of data. From the paper's introduction:</p>
       <blockquote>"We find that current large language models are significantly undertrained, a consequence of
       the recent focus on scaling language models whilst keeping the amount of training data constant."
       (Introduction)</blockquote>
       <p>The open question: for a fixed $C$, what split of the budget between $N$ and $D$ gives the lowest loss?
       Were the giant models of 2020&ndash;2021 actually the best use of their compute?</p>`,
    contribution:
      `<ul>
        <li><b>Equal scaling of size and data.</b> The paper measures how the compute-optimal model size $N$ and
        token count $D$ grow with the budget $C$. The headline (Abstract): "for every doubling of model size the
        number of training tokens should also be doubled." In symbols, $N \\propto C^{a}$ and $D \\propto C^{b}$
        with $a \\approx b \\approx 0.5$.</li>
        <li><b>Most big models were undertrained.</b> Because the field kept data roughly fixed while inflating
        $N$, models like Gopher (280B parameters) and GPT-3 (175B parameters) were <i>too large</i> for their
        compute &mdash; they should have been smaller and trained on far more tokens.</li>
        <li><b>Chinchilla: a proof by construction.</b> The authors train Chinchilla &mdash; <b>70B parameters</b>,
        4&times; smaller than Gopher, but on much more data (1.4 trillion tokens, Table 1) at the <i>same</i>
        compute. It wins. From the Abstract: "Chinchilla uniformly and significantly outperforms Gopher (280B),
        GPT-3 (175B), Jurassic-1 (178B), and Megatron-Turing NLG (530B) on a large range of downstream
        evaluation tasks."</li>
      </ul>`,
    whyItMattered:
      `<p>This paper rewrote the recipe for spending a training budget. After it, "Chinchilla-optimal" became a
       standard sanity check: roughly, aim for about <b>20 tokens per parameter</b> rather than ever-larger models
       on fixed data. It redirected the field from a parameter-count race toward data-rich training, and it is the
       direct reason later open models were comparatively small but trained on trillions of tokens. It also
       <b>revised the compute-allocation conclusion</b> of the earlier Kaplan et al. scaling-laws work (see the
       cross-link note in Results): same goal &mdash; predict loss from scale &mdash; but a different optimal split
       between $N$ and $D$.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>Abstract</b> &mdash; the one-sentence result (scale $N$ and $D$ equally) and the Chinchilla-beats-
        Gopher headline. Memorize these two claims.</li>
        <li><b>&sect;3 (Approaches 1&ndash;3) and Table 2</b> &mdash; three independent ways to estimate the
        optimal exponents $a$ and $b$. They agree: scale $N$ and $D$ in "approximately equal proportions." This is
        the quantitative core.</li>
        <li><b>&sect;3.3 and Appendix F</b> &mdash; the compute accounting that gives the relation
        $C \\approx 6ND$. Understand where the factor of 6 comes from before trusting any budget arithmetic.</li>
        <li><b>Table 1</b> &mdash; Chinchilla's exact configuration: 70B parameters, 1.4 trillion tokens.</li>
       </ul>
       <p><b>Skim:</b> the long downstream-benchmark tables (&sect;4) unless you want a specific task; the modeling
       and optimizer details in the appendices. The conceptual payload is &sect;3 plus the Abstract.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Two teams each get the <i>same</i> fixed compute budget $C$. Team A builds the biggest model it can and
       trains it on a modest, fixed amount of data (the pre-Chinchilla habit). Team B builds a model maybe
       4&times; smaller and spends the freed-up compute on far more training tokens. Both spend exactly $C$.
       Which model reaches lower loss &mdash; or do they tie? Write your guess and one sentence of reasoning.</p>
       <p>(Hint: the budget is fixed, so making the model bigger <i>forces</i> the token count down, because
       $C \\approx 6ND$. Is "as big as possible" the best point on that trade-off?)</p>`,
    attempt:
      `<p>This is a read-only lesson &mdash; there is no model to train. Instead, predict the <b>shape</b> of the
       trade-off you will see in the illustration below. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>Fix the budget $C$. Use $C \\approx 6ND$ to write $D$ as a function of $N$: TODO &mdash; solve for $D$.</li>
        <li>As you make the model bigger (increase $N$) at fixed $C$, what happens to the number of tokens $D$?
        TODO &mdash; up or down?</li>
        <li>Sketch loss vs $N$ along this fixed-budget line. At very small $N$ the model is too small to fit the
        data; at very large $N$ it has barely any data to learn from. TODO &mdash; where does the minimum sit:
        at an edge, or in the interior?</li>
        <li>TODO: in one sentence, why does an <i>interior</i> minimum mean "scale $N$ and $D$ together" rather
        than "make $N$ as large as possible"?</li>
       </ul>
       <p>Then check your sketch against the synthetic curve in the CODEVIZ panel.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The whole result is about <b>spending a fixed compute budget well</b>. Three pieces: the budget
       relation, the question, and the answer.</p>
       <p><b>1. The budget relation.</b> Training cost is dominated by passing tokens through the network's
       parameters. The paper accounts for this as approximately (&sect;3.3, Appendix F):</p>
       <p>$$ C \\approx 6\\,N\\,D. $$</p>
       <p>Here $C$ is total training compute in FLOPs, $N$ is the parameter count, and $D$ is the number of
       training tokens. The factor 6 bundles the forward and backward passes (the paper notes a factor of 2 for
       the multiply-accumulate cost, in Appendix F). The key consequence: <b>$N$ and $D$ trade off</b>. At fixed
       $C$, doubling the model halves the tokens you can afford.</p>
       <p><b>2. The question.</b> For a fixed $C$, choose $N$ (and therefore $D = C / (6N)$) to minimize the final
       training loss $L$. Call the minimizers the <b>compute-optimal</b> $N_{\\text{opt}}(C)$ and
       $D_{\\text{opt}}(C)$.</p>
       <p><b>3. The answer.</b> The paper estimates how these optima grow with the budget. It writes them as power
       laws, $N_{\\text{opt}} \\propto C^{a}$ and $D_{\\text{opt}} \\propto C^{b}$, and fits the exponents three
       independent ways (&sect;3, Approaches 1&ndash;3). All three land near $a \\approx b \\approx 0.5$. Because
       the two exponents are about <i>equal</i>, the recipe is: when you get more compute, grow the model and the
       data <b>together, in roughly equal proportion</b> &mdash; not the model alone.</p>
       <p><b>Why earlier models lost.</b> A model like Gopher (280B parameters) sat far to the large-$N$ side of
       this trade-off: too many parameters, too few tokens for its budget. Chinchilla (70B parameters, 1.4
       trillion tokens) sits near the optimum at the <i>same</i> budget &mdash; and wins (Abstract).</p>`,
    symbols: [
      { sym: "$C$", desc: "the <b>compute budget</b>: total training computation, measured in <b>FLOPs</b> (floating-point operations &mdash; the count of multiply-and-add arithmetic the whole training run performs). This is the resource you are spending." },
      { sym: "$N$", desc: "the <b>model size</b>: the number of trainable <b>parameters</b> (the weights). Bigger $N$ means a more expressive model but more compute per token." },
      { sym: "$D$", desc: "the <b>training data size</b>: the number of <b>tokens</b> the model is trained on. A token is a small chunk of text (roughly a word-piece). More tokens means more to learn from but more compute." },
      { sym: "FLOPs", desc: "<b>floating-point operations</b> &mdash; the unit of $C$. One multiply-and-add on real numbers is counted here as arithmetic the hardware does; total FLOPs is the size of the training run." },
      { sym: "$L$", desc: "the <b>loss</b>: the model's average prediction error on text, the cross-entropy of next-token prediction. Lower is better. The paper minimizes $L$ over the choice of $N$ and $D$ at fixed $C$." },
      { sym: "$N_{\\text{opt}}(C)$", desc: "the <b>compute-optimal model size</b>: the $N$ that minimizes loss for a given budget $C$. The paper finds $N_{\\text{opt}} \\propto C^{a}$." },
      { sym: "$D_{\\text{opt}}(C)$", desc: "the <b>compute-optimal token count</b>: the $D$ that minimizes loss for a given budget $C$. The paper finds $D_{\\text{opt}} \\propto C^{b}$." },
      { sym: "$a$", desc: "the <b>exponent for model size</b> in $N_{\\text{opt}} \\propto C^{a}$. The paper's three approaches give $a = 0.50$, $0.49$, and $0.46$ (&sect;3)." },
      { sym: "$b$", desc: "the <b>exponent for token count</b> in $D_{\\text{opt}} \\propto C^{b}$. The paper's three approaches give $b = 0.50$, $0.51$, and $0.54$ (&sect;3). That $a \\approx b$ is the equal-scaling result." },
      { sym: "$\\propto$", desc: "the <b>“proportional to”</b> symbol: $y \\propto x^{a}$ means $y$ equals some constant times $x^{a}$. We care about the exponent $a$, not the constant." }
    ],
    formula: `$$ C \\approx 6\\,N\\,D \\quad\\text{(compute relation, \\S3.3 / App. F)} \\qquad\\qquad N_{\\text{opt}} \\propto C^{\\,a},\\quad D_{\\text{opt}} \\propto C^{\\,b},\\quad a \\approx b \\approx 0.5 \\quad\\text{(\\S3, Approaches 1–3)} $$`,
    whatItDoes:
      `<p><b>The compute relation</b> $C \\approx 6ND$ (left) is the budget constraint. It ties the three
       quantities together: pick any two and the third is fixed. So once $C$ is set, choosing the model size $N$
       automatically pins the token count to $D = C / (6N)$. Bigger model, fewer tokens &mdash; that is the
       trade-off the rest of the result navigates.</p>
       <p><b>The scaling laws</b> $N_{\\text{opt}} \\propto C^{a}$ and $D_{\\text{opt}} \\propto C^{b}$ (right) are
       the answer to "where on that trade-off is the loss lowest." Each says: as the budget $C$ grows, the
       optimal size and the optimal token count grow as power laws of $C$. The load-bearing finding is that the
       two exponents are <b>about equal</b> ($a \\approx b \\approx 0.5$). Equal exponents mean: scale $N$ and $D$
       <i>together</i>. Double the compute, and you should put roughly half the gain into a bigger model and half
       into more data &mdash; which works out to doubling each (since $0.5 + 0.5 = 1$, and $C = 6ND$). Putting it
       <i>all</i> into $N$, as earlier models did, lands off the optimum.</p>`,
    derivation:
      `<p>There is no concept lesson to defer to here (<code>conceptLink</code> is null), so we reason it out from
       the two grounded facts. We are <b>not</b> re-deriving the paper's fitted constants &mdash; only showing why
       <i>equal</i> exponents are the natural consequence of a fixed budget.</p>
       <p><b>The constraint.</b> Compute is fixed at $C \\approx 6ND$. Take logarithms (turning the product into a
       sum): $\\log C \\approx \\log 6 + \\log N + \\log D$. So along the fixed-budget line, $\\log N$ and
       $\\log D$ must move in <b>opposite</b> directions by equal amounts &mdash; spend more on size, spend less on
       data.</p>
       <p><b>The optima are power laws.</b> The paper models the loss as a smooth function of $N$ and $D$ and finds
       (empirically, &sect;3) that the minimizers obey $N_{\\text{opt}} \\propto C^{a}$ and
       $D_{\\text{opt}} \\propto C^{b}$. Plug these back into the constraint:</p>
       <p>$$ C \\approx 6 \\, N_{\\text{opt}} \\, D_{\\text{opt}} \\propto C^{a} \\cdot C^{b} = C^{\\,a+b}. $$</p>
       <p>For this to hold as $C$ varies, the exponents must satisfy $a + b \\approx 1$. That is a hard accounting
       fact, not a measurement. The <b>measurement</b> is <i>where</i> on that line the loss bottoms out: the paper
       finds it sits near $a \\approx b \\approx 0.5$ &mdash; the balanced point, not an edge. Three independent
       approaches (&sect;3) agree: Approach 1 gives $a=0.50, b=0.50$; Approach 2 gives $a=0.49, b=0.51$; Approach 3
       gives $a=0.46, b=0.54$. The split is roughly even, so size and data should grow together.</p>`,
    example:
      `<p>Let's plug Chinchilla's own numbers (Table 1) into the compute relation $C \\approx 6ND$, so the budget
       arithmetic is concrete. Chinchilla has $N = 70$ billion parameters and was trained on $D = 1.4$ trillion
       tokens.</p>
       <ul class="steps">
        <li><b>Write the numbers in powers of ten.</b> $N = 70 \\times 10^{9} = 7.0 \\times 10^{10}$ parameters;
        $D = 1.4 \\times 10^{12}$ tokens.</li>
        <li><b>Multiply $N$ and $D$.</b>
        $N \\cdot D = (7.0 \\times 10^{10}) \\times (1.4 \\times 10^{12}) = 9.8 \\times 10^{22}$.</li>
        <li><b>Apply the factor 6.</b>
        $C \\approx 6 \\times 9.8 \\times 10^{22} = 58.8 \\times 10^{22} = 5.88 \\times 10^{23}$ FLOPs.</li>
        <li><b>Read off the trade-off.</b> Now hold that same $C = 5.88 \\times 10^{23}$ but use Gopher's size,
        $N = 280$ billion $= 2.8 \\times 10^{11}$. Solving $D = C / (6N)$ gives
        $D = 5.88 \\times 10^{23} / (6 \\times 2.8 \\times 10^{11}) = 5.88 \\times 10^{23} / (1.68 \\times 10^{12})
        = 3.5 \\times 10^{11} = 350$ billion tokens.</li>
       </ul>
       <p>So at Chinchilla's compute, a 280B-parameter model could only afford about <b>350 billion</b> tokens
       &mdash; one quarter of Chinchilla's 1.4 trillion. The 4&times;-bigger model gets 4&times; less data at the
       same cost. That is exactly the bind Chinchilla escapes by going smaller and reading more. (These plug-in
       numbers are recomputed and printed in the code cell below.)</p>`,
    recipe:
      `<p>Read-only paper &mdash; there is no architecture to build. The "recipe" is the budgeting procedure the
       paper hands you:</p>
       <ol>
        <li><b>Fix your compute budget</b> $C$ in FLOPs (what your hardware and time allow).</li>
        <li><b>Pick the compute-optimal model size</b> $N_{\\text{opt}}$ using the fitted scaling
        $N_{\\text{opt}} \\propto C^{a}$ with $a \\approx 0.5$ (&sect;3).</li>
        <li><b>Set the token count</b> from the budget: $D = C / (6N_{\\text{opt}})$, which lands near
        $D_{\\text{opt}} \\propto C^{b}$ with $b \\approx 0.5$. In practice this is roughly 20 tokens per
        parameter.</li>
        <li><b>Do not</b> inflate $N$ and freeze $D$. That walks you off the optimum toward the undertrained,
        too-large regime the paper warns against (Introduction).</li>
        <li><b>Sanity-check</b> against Chinchilla: 70B parameters, 1.4T tokens, beating models up to 530B at
        equal compute (Abstract, Table 1).</li>
       </ol>`,
    results:
      `<p><b>The exponents.</b> Three independent estimation methods (&sect;3) agree that size and data should scale
       about equally: Approach 1 finds "$a=0.50$ and $b=0.50$"; Approach 2 finds "$a=0.49$ and $b=0.51$"; Approach
       3 finds "$a=0.46$ and $b=0.54$." Table 2's summary: "as compute budget increases, model size and the amount
       of training data should be increased in approximately equal proportions."</p>
       <p><b>The headline.</b> From the Abstract: "Chinchilla uniformly and significantly outperforms Gopher
       (280B), GPT-3 (175B), Jurassic-1 (178B), and Megatron-Turing NLG (530B) on a large range of downstream
       evaluation tasks." It also "reaches a state-of-the-art average accuracy of 67.5% on the MMLU benchmark,
       greater than a 7% improvement over Gopher." (MMLU = Massive Multitask Language Understanding, a
       knowledge-and-reasoning exam suite.)</p>
       <p><b>Cross-link &mdash; it revises the earlier scaling laws.</b> The prior Kaplan et al. scaling-laws paper
       asked the same question (predict loss from $N$, $D$, $C$) but concluded compute should go mostly into model
       size. Chinchilla <b>revises that compute-allocation conclusion</b>: at fixed compute, size and data should
       grow equally, so the earlier recipe overspent on parameters. If a <code>paper-scaling-laws</code> lesson
       exists in your build, read it first for the framing this paper corrects.</p>
       <p><i>Every number above is quoted from the paper (Abstract, &sect;3, Table 1/2). The numbers in the CODEVIZ
       panel below are a synthetic illustration of the fixed-compute trade-off with arbitrary toy constants &mdash;
       they are NOT the paper's measured loss values or fitted constants.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>read-only</b> paper: an empirical scaling result, not a layer or algorithm you reimplement.
       There is nothing to build from scratch and no <code>torch.allclose</code> check &mdash; reproducing the
       paper's loss surface would require training many large language models. What you <i>can</i> do, and what the
       code does, is two small CPU computations: (1) verify the budget arithmetic $C \\approx 6ND$ on Chinchilla's
       own numbers, and (2) draw a <b>synthetic</b> fixed-compute loss-vs-$N$ curve to feel why an interior optimum
       exists. The curve uses made-up toy constants chosen only to show the U-shape; it is an illustration of the
       <i>trade-off</i>, not the paper's measured values.</p>`,
    pitfalls:
      `<ul>
        <li><b>Reading $a \\approx b \\approx 0.5$ as a law of nature.</b> These are empirically fitted exponents
        from this paper's setup (&sect;3), recovered three ways. They are not exact and not universal across every
        architecture or data regime. Quote them as the paper's estimates, not constants.</li>
        <li><b>Trusting $C \\approx 6ND$ to the last digit.</b> The 6 is an approximation (forward + backward,
        multiply-accumulate; Appendix F). It is a budgeting rule of thumb, accurate enough for allocation, not an
        exact FLOPs count for a specific implementation.</li>
        <li><b>Concluding "smaller models are simply better."</b> The claim is conditional on <b>equal compute</b>.
        Chinchilla beats Gopher at the <i>same</i> budget by reallocating it to data. With unlimited compute, a
        bigger model trained on enough tokens still wins. The result is about <i>allocation</i>, not about size in
        the abstract.</li>
        <li><b>Forgetting the data side.</b> Chinchilla-optimal training needs trillions of tokens. If you cannot
        get that many high-quality tokens, the "make it smaller" advice does not automatically hold &mdash; you
        may be data-bound, not compute-bound.</li>
        <li><b>Confusing this with the earlier scaling laws.</b> Kaplan et al. concluded compute should go mostly
        into model size; Chinchilla revises that to equal scaling. Citing the wrong recipe is the classic
        mix-up.</li>
      </ul>`,
    recall: [
      "State the compute relation $C \\approx 6ND$ and define $C$, $N$, and $D$ in plain words.",
      "What did the paper find for the exponents $a$ and $b$ in $N_{\\text{opt}} \\propto C^{a}$, $D_{\\text{opt}} \\propto C^{b}$, and what does $a \\approx b$ imply for spending compute?",
      "Why does fixing $C$ force a trade-off between making $N$ bigger and making $D$ bigger?",
      "In one sentence: how does Chinchilla (70B) beat Gopher (280B) at the same compute?"
    ],
    practice: [
      {
        q: `<b>The budget trade-off.</b> You have a fixed compute budget of $C = 1.2 \\times 10^{24}$ FLOPs. Using
            $C \\approx 6ND$, how many training tokens $D$ can you afford for a $100$-billion-parameter model
            ($N = 1.0 \\times 10^{11}$)? And for a $25$-billion-parameter model ($N = 2.5 \\times 10^{10}$)? What
            does the comparison tell you?`,
        steps: [
          { do: `Solve the relation for $D$: from $C \\approx 6ND$, $D = C / (6N)$.`, why: `The budget is fixed, so once $N$ is chosen, $D$ is determined &mdash; that is the whole trade-off.` },
          { do: `Plug in $N = 1.0 \\times 10^{11}$: $D = 1.2 \\times 10^{24} / (6 \\times 1.0 \\times 10^{11}) = 1.2 \\times 10^{24} / (6.0 \\times 10^{11}) = 2.0 \\times 10^{12}$ tokens (2 trillion).`, why: `Dividing the budget by the per-token cost $6N$ gives the affordable token count.` },
          { do: `Plug in $N = 2.5 \\times 10^{10}$: the per-token cost is $6N = 1.5 \\times 10^{11}$, so $D = 1.2 \\times 10^{24} / (1.5 \\times 10^{11}) = 8.0 \\times 10^{12}$ tokens (8 trillion).`, why: `Quartering the model size lets you afford 4&times; the tokens at the same cost &mdash; the inverse relationship between $N$ and $D$.` }
        ],
        answer: `<p>The 100B model affords $D = 2.0 \\times 10^{12} = 2$ trillion tokens; the 25B model affords
                 $D = 8.0 \\times 10^{12} = 8$ trillion tokens. Cutting $N$ by 4&times; buys 4&times; the data,
                 because $D = C/(6N)$ is inversely proportional to $N$ at fixed $C$. This is exactly the bind
                 Chinchilla exploits: a smaller model reads far more text for the same compute. The paper's point
                 is that the <i>lowest-loss</i> choice is neither extreme but a balanced interior point with
                 $N$ and $D$ scaled equally (&sect;3).</p>`
      },
      {
        q: `<b>Equal-scaling consequence.</b> The paper finds $N_{\\text{opt}} \\propto C^{a}$ and
            $D_{\\text{opt}} \\propto C^{b}$ with $a \\approx b \\approx 0.5$. If you <b>quadruple</b> your compute
            budget (multiply $C$ by 4), by what factor should the compute-optimal model size and token count each
            grow?`,
        steps: [
          { do: `Use $N_{\\text{opt}} \\propto C^{0.5}$. Multiplying $C$ by 4 multiplies $N_{\\text{opt}}$ by $4^{0.5}$.`, why: `A power law with exponent $0.5$ means the output scales as the square root of the input.` },
          { do: `Compute $4^{0.5} = \\sqrt{4} = 2$. So $N_{\\text{opt}}$ doubles.`, why: `Square root of 4 is 2.` },
          { do: `By the same exponent $b \\approx 0.5$, $D_{\\text{opt}}$ also scales by $4^{0.5} = 2$ &mdash; it doubles too. Check against the budget: $N$ doubled $\\times$ $D$ doubled $= 4\\times$, matching the $4\\times$ compute.`, why: `Equal exponents mean both grow by the same factor; their product matches the budget increase, confirming $a + b \\approx 1$.` }
        ],
        answer: `<p>Both double. With $a \\approx b \\approx 0.5$, multiplying $C$ by 4 multiplies each of
                 $N_{\\text{opt}}$ and $D_{\\text{opt}}$ by $4^{0.5} = 2$. This is the Abstract's rule restated:
                 "for every doubling of model size the number of training tokens should also be doubled." And the
                 two factors multiply to $2 \\times 2 = 4$, consistent with the $4\\times$ compute via
                 $C \\approx 6ND$. Growing the model alone (and freezing data) would put the whole $4\\times$ into
                 $N$ &mdash; the off-optimum mistake the paper diagnoses.</p>`
      },
      {
        q: `<b>Why an interior optimum?</b> Along a fixed-budget line ($C$ constant, so $D = C/(6N)$), explain why
            the training loss is high at <i>both</i> a very small $N$ and a very large $N$, forcing the minimum to
            sit in the interior. Tie this to the CODEVIZ curve below.`,
        steps: [
          { do: `Consider very small $N$ (tiny model, huge $D$). The model lacks the capacity (the parameters) to represent the patterns in all that data, so it underfits and loss stays high.`, why: `Too few parameters cap how much the model can learn no matter how much data it sees.` },
          { do: `Consider very large $N$ (huge model, tiny $D$). At fixed $C$, a giant model can only afford a sliver of data, so it has too little text to learn from &mdash; the undertrained regime. Loss is high again.`, why: `$D = C/(6N)$ shrinks as $N$ grows; starve a big model of tokens and it cannot be trained well.` },
          { do: `Conclude: loss falls then rises along the line, so the minimum is interior &mdash; a balanced $N$ and $D$. That is the synthetic U-shape in the CODEVIZ panel.`, why: `A function high at both ends and lower in between has its minimum in the interior; that interior point is the compute-optimal allocation.` }
        ],
        answer: `<p>At small $N$ the model is too small to use its abundant data (underfitting); at large $N$ the
                 fixed budget leaves almost no data, so the model is undertrained. Loss is high at both ends, so the
                 minimum sits in the <b>interior</b> &mdash; a balanced split of compute between size and data. That
                 interior minimum is precisely what "$a \\approx b \\approx 0.5$" pins down, and it is the bottom of
                 the synthetic U-shaped curve in the CODEVIZ panel. Reminder: that curve uses arbitrary toy
                 constants to show the <i>shape</i>; it is not the paper's measured loss.</p>`
      }
    ]
  });

  window.CODE["paper-chinchilla"] = {
    lib: "Python",
    runnable: false,
    explain:
      `<p>Read-only paper, so there is nothing to train and no <code>torch.allclose</code> check. This cell does
       two tiny CPU computations. <b>(1)</b> It verifies the worked example: plug Chinchilla's $N = 70$B and
       $D = 1.4$T into $C \\approx 6ND$ to get $C \\approx 5.88 \\times 10^{23}$ FLOPs, then asks how many tokens a
       Gopher-sized 280B model could afford at that <i>same</i> budget (answer: ~350B, a quarter of Chinchilla's
       data). <b>(2)</b> It builds the <b>synthetic</b> fixed-compute loss-vs-$N$ curve used in the CODEVIZ panel,
       showing the interior optimum. The loss formula and its constants are <i>made up</i> to illustrate the
       trade-off shape &mdash; they are NOT the paper's fitted constants or measured loss. Pure arithmetic and
       numpy; paste into Colab and run.</p>`,
    code: `import numpy as np

# === (1) Worked example: the compute relation C = 6*N*D (paper Sec 3.3 / App. F). ===
N_chin = 70e9        # Chinchilla parameters (Table 1)
D_chin = 1.4e12      # Chinchilla training tokens (Table 1)
C = 6 * N_chin * D_chin
print("Chinchilla: N = %.1e params, D = %.1e tokens" % (N_chin, D_chin))
print("  C = 6*N*D = %.3e FLOPs" % C)        # -> 5.880e+23

# Same budget C, but a Gopher-sized 280B model: how many tokens can it afford?
N_gopher = 280e9
D_at_gopher = C / (6 * N_gopher)
print("At the SAME budget, a 280B model affords D = %.3e tokens" % D_at_gopher)  # ~3.5e11
print("  ratio (Chinchilla tokens / Gopher-size tokens) = %.1fx" % (D_chin / D_at_gopher))
# Chinchilla: N = 7.0e+10 params, D = 1.4e+12 tokens
#   C = 6*N*D = 5.880e+23 FLOPs
# At the SAME budget, a 280B model affords D = 3.500e+11 tokens
#   ratio (Chinchilla tokens / Gopher-size tokens) = 4.0x


# === (2) SYNTHETIC fixed-compute loss-vs-N curve (ILLUSTRATION ONLY). ===
# Toy loss = E + A*N^(-alpha) + B*D^(-beta), with D = C_fixed/(6N).
# A, B, E, alpha, beta are ARBITRARY toy constants chosen to show the U-shape.
# These are NOT the paper's fitted constants and NOT measured loss values.
C_fixed = 6 * 60e9 * 1.2e12          # a round fixed budget ~4.32e23 FLOPs
A, B, E = 90.0, 90.0, 1.2            # synthetic
alpha, beta = 0.30, 0.30             # synthetic exponents (NOT the paper's a, b)

Ns = np.logspace(np.log10(1e9), np.log10(4e12), 200)   # 1B .. 4T params
Ds = C_fixed / (6 * Ns)                                # forced by the fixed budget
L  = E + A * Ns**(-alpha) + B * Ds**(-beta)

i = int(np.argmin(L))
print("\\nSynthetic fixed-budget curve (illustration only):")
print("  interior optimum near N = %.2e params, D = %.2e tokens, toy loss = %.4f"
      % (Ns[i], Ds[i], L[i]))
# interior optimum near N = 2.66e+11 params, D = 2.70e+11 tokens, toy loss = 1.2671
# (Synthetic illustration of the trade-off shape, NOT the paper's measured surface.)`
  };

  window.CODEVIZ["paper-chinchilla"] = {
    question: "At a FIXED compute budget (so more parameters force fewer training tokens), how does loss vary with model size — and where is the optimum?",
    charts: [
      {
        type: "line",
        title: "SYNTHETIC fixed-compute trade-off: toy loss vs model size N (illustration, not the paper's data)",
        xlabel: "model size N (billions of parameters), at fixed compute so D = C/(6N) falls as N rises",
        ylabel: "synthetic toy loss (arbitrary units — NOT the paper's loss)",
        series: [
          {
            name: "toy loss along the fixed-budget line",
            color: "#7ee787",
            points: [[1,1.3858],[1.996,1.3537],[3.984,1.3281],[7.953,1.3081],[15.87,1.2927],[31.69,1.2813],[63.25,1.2735],[126.2,1.2688],[252,1.2671],[503,1.2683],[1004,1.2724],[2004,1.2797],[4000,1.2904]]
          }
        ]
      }
    ],
    caption: "SYNTHETIC ILLUSTRATION of the trade-off — NOT the paper's measured loss surface or fitted constants. We fix a compute budget C and use C&nbsp;&asymp;&nbsp;6ND, so picking a larger model size N forces fewer training tokens D&nbsp;=&nbsp;C/(6N). The curve is a made-up toy loss (E + A&middot;N^&minus;&alpha; + B&middot;D^&minus;&beta;, with arbitrary constants A=B=90, E=1.2, &alpha;=&beta;=0.30) plotted along that fixed-budget line. Loss is high at small N (model too small to use its abundant data) and high at large N (giant model starved of tokens), so the minimum sits in the INTERIOR — near N&nbsp;&asymp;&nbsp;266B with D&nbsp;&asymp;&nbsp;270B here, i.e. N and D balanced. That interior optimum is the visual point of the paper's result: at fixed compute, scale model size and data EQUALLY rather than maximizing N. The numbers are illustrative only; the paper's actual exponents are a&nbsp;&asymp;&nbsp;b&nbsp;&asymp;&nbsp;0.5 (Sec 3).",
    code: `import numpy as np
# SYNTHETIC illustration of the fixed-compute trade-off. ARBITRARY toy constants.
# This is NOT the paper's measured loss surface or its fitted a, b constants.
C_fixed = 6 * 60e9 * 1.2e12          # fixed budget ~4.32e23 FLOPs
A, B, E = 90.0, 90.0, 1.2            # synthetic toy constants
alpha, beta = 0.30, 0.30             # synthetic toy exponents (NOT the paper's)

# 13 points in log-space from 1B to 4T parameters; D forced by the fixed budget.
xs = np.logspace(np.log10(1e9), np.log10(4e12), 13)   # N in params
Ds = C_fixed / (6 * xs)                                # D = C/(6N)
ys = E + A * xs**(-alpha) + B * Ds**(-beta)            # toy loss

for x, y in zip(xs, ys):
    print("  [%.4g, %.4f]," % (x / 1e9, y))            # x printed in billions of params
i = int(np.argmin(ys))
print("interior optimum near N = %.1fB params, toy loss = %.4f" % (xs[i] / 1e9, ys[i]))
# interior optimum near N = 252.0B params, toy loss = 1.2671
# Synthetic illustration of the trade-off shape, not the paper's number.`
  };
})();
