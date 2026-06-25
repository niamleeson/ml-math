/* Paper lesson — "Scaling Laws for Neural Language Models", Kaplan, McCandlish,
   Henighan, Brown, Chess, Child, Gray, Radford, Wu, Amodei (OpenAI, 2020).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-scaling-laws".
   GROUNDED from arXiv:2001.08361 (abstract) and the ar5iv HTML mirror:
   Section 1.1 Summary headline findings; Equations 1.1, 1.2, 1.3, 1.5 (the power
   laws and the combined L(N,D)); Table 5 (exponents and scale constants);
   Section 2.1 (N = non-embedding parameters, Eq 2.1; compute C ~ 6NBS); Section 1.2
   and Table 6 (optimal model size N proportional to C_min^0.73).
   Track: read-only (pure-scale empirical-result paper). No from-scratch model.
   The CODEVIZ fits a power law to a few SYNTHETIC (N, loss) points and shows the
   straight line on log-log axes — a conceptual illustration of the FORM of the law,
   NOT the paper's measured constants. */
(function () {
  window.LESSONS.push({
    id: "paper-scaling-laws",
    title: "Scaling Laws — Scaling Laws for Neural Language Models (2020)",
    tagline: "Test loss falls as a smooth power law in model size, data, and compute — so you can predict it.",
    module: "Papers · Transformers & LLMs",
    track: "read-only",
    paper: {
      authors: "Jared Kaplan, Sam McCandlish, Tom Henighan, Tom B. Brown, Benjamin Chess, Rewon Child, Scott Gray, Alec Radford, Jeffrey Wu, Dario Amodei",
      org: "OpenAI / Johns Hopkins University",
      year: 2020,
      venue: "arXiv:2001.08361 (Jan 2020)",
      citations: "",
      arxiv: "https://arxiv.org/abs/2001.08361",
      code: ""
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["dl-cross-entropy", "dl-language-model", "paper-transformer", "ml-loss", "dl-early-stopping", "fe-log-power-transforms"],

    // WHY READ IT
    problem:
      `<p>Before this paper, picking the size of a language model was guesswork. You had a model. You had data.
       You had a compute budget (the total arithmetic you can afford to run). The open questions were practical
       and unanswered: if I make the model twice as big, how much better does it get? Should I spend my budget
       on a bigger model, or on more data, or on training longer? Does the answer depend on whether I use a deep
       narrow network or a shallow wide one?</p>
       <p>A <b>language model</b> is a network trained to predict the next token (a word or word-piece) in text.
       Its quality is measured by the <b>cross-entropy loss</b> &mdash; the average "surprise," in nats, when the
       model sees the true next token. Lower loss means a better predictor. The trouble was that people had no
       theory and no reliable rule of thumb for how this loss would move as they scaled things up. Each new model
       was a fresh experiment.</p>
       <p>This paper asks a measurable question: <b>across many orders of magnitude, is there a simple, predictable
       relationship between the test loss and the things we scale?</b> The answer turns out to be a clean
       power law.</p>`,
    contribution:
      `<ul>
        <li><b>Three power laws.</b> The cross-entropy test loss falls as a <b>power law</b> &mdash; a straight
        line on log-log axes &mdash; in each of three quantities, when the other two are not the bottleneck:
        model size $N$ (number of non-embedding parameters), dataset size $D$ (training tokens), and training
        compute $C$. "Some trends [span] more than seven orders of magnitude." (Abstract.)</li>
        <li><b>Scale beats architecture.</b> Loss "depends most strongly on scale" and "very weakly on other
        architectural hyperparameters such as depth vs. width." (&sect;1.1.) Within a wide range, network shape
        barely matters; the count of parameters does.</li>
        <li><b>Compute-optimal training.</b> The laws combine into a recipe for spending a fixed compute budget.
        Their headline conclusion: "Larger models are significantly more sample-efficient, such that optimally
        compute-efficient training involves training very large models on a relatively modest amount of data and
        stopping significantly before convergence." (Abstract.)</li>
      </ul>`,
    whyItMattered:
      `<p>This paper turned model scaling from an art into a forecast. If the loss is a known power law, you can
       extrapolate: train a few small models, fit the curve, and <i>predict</i> the loss of a model far larger
       than any you have built. That predictability is what justified the leap to models with hundreds of
       billions of parameters &mdash; you could argue, on paper, that the larger model would be better before
       spending the money. GPT-3 (released later in 2020) was a direct application of this thinking. The paper
       also seeded a now-central question &mdash; how to split a budget between model size and data &mdash; that
       was later refined by follow-up work. The lasting idea: <b>loss curves are smooth and predictable, so
       scale is a design variable you can plan, not just a number you stumble into.</b></p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;1.1 (Summary)</b> &mdash; the headline findings in plain words, plus the three core power
        laws as <b>Equations 1.1, 1.2, 1.3</b> and the combined <b>Equation 1.5</b>. This is the heart of the
        paper; everything else is evidence for it.</li>
        <li><b>&sect;1.2 and the figures</b> &mdash; how loss vs. $N$, vs. $D$, and vs. $C$ each plot as straight
        lines on log-log axes, and the compute-optimal scaling $N \\propto C^{0.73}$ (Table 6).</li>
        <li><b>&sect;2.1 (Notation)</b> &mdash; the exact definitions: $N$ is the count of <b>non-embedding</b>
        parameters (Eq 2.1), and the compute estimate $C \\approx 6NBS$.</li>
        <li><b>Table 5</b> &mdash; the fitted exponents and scale constants you will transcribe.</li>
       </ul>
       <p><b>Skim:</b> the detailed appendices on the fitting procedure, the optimizer settings, and the
       sample-efficiency / overfitting sections (&sect;4&ndash;6) &mdash; useful for replication, not needed to
       grasp the laws. You do <b>not</b> implement this paper; it is an empirical-result paper. Read it for the
       relationships and what they imply.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>The paper finds test loss $L$ falls as a power law in model size $N$: $L(N) = (N_c / N)^{\\alpha_N}$,
       a straight line on log-log axes. Suppose the fitted slope (the exponent) is small &mdash; the paper reports
       $\\alpha_N \\approx 0.076$. Here is the question to guess before reading on: if you make the model
       <b>10 times</b> bigger, by what factor does the loss drop? Is it a 10&times; improvement, roughly 1.2&times;,
       or almost nothing? Write your guess and one sentence of reasoning about what a <i>small</i> power-law
       exponent means.</p>
       <p>(Hint: a power law with exponent $\\alpha$ means a 10&times; increase in $N$ multiplies the loss by
       $10^{-\\alpha}$. Plug in $\\alpha = 0.076$.)</p>`,
    attempt:
      `<p>This is a read-only paper, so there is nothing to build from scratch. Instead, before the reveal, work
       out the shape of the law on paper:</p>
       <ul>
        <li>Write the loss-vs-size law in the form $L(N) = (N_c / N)^{\\alpha_N}$. Take the logarithm of both
        sides. What is $\\ln L$ as a linear function of $\\ln N$? What is its slope?</li>
        <li>Predict: on log-log axes (loss on the vertical axis, model size on the horizontal), a power law plots
        as a <b>straight line</b>. What is its slope in terms of $\\alpha_N$?</li>
        <li>TODO: using $\\alpha_N \\approx 0.076$, compute the loss-reduction factor for a 10&times; increase in
        $N$, and for a 100&times; increase. Why does the paper need to scan "more than seven orders of magnitude"
        to see a meaningful drop?</li>
       </ul>
       <p>The CODEVIZ panel below fits this exact straight-line form to a few synthetic points so you can see the
       log-log line &mdash; clearly labeled as an illustration of the law's <i>form</i>, not the paper's measured
       numbers.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The paper's central claim is one sentence: <b>over a huge range, test loss is a power law in scale.</b>
       A <b>power law</b> means one quantity equals a constant times another raised to a fixed exponent. Here the
       test loss $L$ (cross-entropy, in nats) scales as $N$, $D$, or $C$ raised to a small <i>negative</i> power.
       Negative, because more of any resource lowers the loss.</p>
       <p><b>Law 1 &mdash; loss vs. model size.</b> Hold data and training plentiful, vary only $N$, the number of
       non-embedding parameters. The loss follows (Eq 1.1):</p>
       <p>$$ L(N) = \\left( \\frac{N_c}{N} \\right)^{\\alpha_N}. $$</p>
       <p>$N_c$ is a scale constant (a reference parameter count); $\\alpha_N$ is the exponent, fitted to
       $\\approx 0.076$ (Table 5). Because the exponent is small, you need <i>large</i> multiplicative increases
       in $N$ to drop the loss appreciably &mdash; which is exactly why the curve stays smooth and predictable
       across many orders of magnitude.</p>
       <p><b>Law 2 &mdash; loss vs. dataset size.</b> Hold the model large enough and train with early stopping,
       vary only $D$, the number of training tokens (Eq 1.2):</p>
       <p>$$ L(D) = \\left( \\frac{D_c}{D} \\right)^{\\alpha_D}, \\qquad \\alpha_D \\approx 0.095. $$</p>
       <p><b>Law 3 &mdash; loss vs. compute.</b> When compute is the bottleneck and training is run optimally,
       loss follows a power law in the (optimally-allocated) compute $C_{\\min}$ (Eq 1.3):</p>
       <p>$$ L(C_{\\min}) = \\left( \\frac{C_c^{\\min}}{C_{\\min}} \\right)^{\\alpha_C^{\\min}}, \\qquad
       \\alpha_C^{\\min} \\approx 0.050. $$</p>
       <p><b>Why these stay straight on log-log axes.</b> Take the natural log of Law 1:
       $\\ln L = \\alpha_N \\ln N_c - \\alpha_N \\ln N$. That is a straight line in the variable $\\ln N$, with
       slope $-\\alpha_N$. Plot loss against size with both axes on a log scale and you see a line. A clean line
       over seven orders of magnitude is strong evidence the power-law form is real, not a local fit.</p>
       <p><b>Combining size and data.</b> When <i>both</i> $N$ and $D$ matter (a finite model trained on finite
       data), the paper proposes a single combined law (Eq 1.5):</p>
       <p>$$ L(N, D) = \\left[ \\left( \\frac{N_c}{N} \\right)^{\\alpha_N / \\alpha_D} + \\frac{D_c}{D}
       \\right]^{\\alpha_D}. $$</p>
       <p>Read it as: each resource contributes a term, and whichever is scarcer dominates the loss. If $N$ is
       tiny, the first term blows up and limits you; if $D$ is tiny, the second does. This is the formula that
       tells you when adding parameters stops helping because you are out of data &mdash; the <b>overfitting</b>
       boundary.</p>
       <p><b>The compute connection.</b> Compute is tied to the other two by a simple count (&sect;2.1): one
       forward-and-backward pass costs about $C \\approx 6NBS$ floating-point operations, where $B$ is the batch
       size (examples processed together) and $S$ is the number of training steps. Spend a fixed $C$ optimally and
       the laws say the best model size grows as a power of compute, $N \\propto C^{0.73}$ (Table 6). In words:
       <b>give a bigger budget mostly to a bigger model, and stop training before the data runs dry.</b></p>`,
    architecture:
      `<p>There is no single model to build &mdash; this is an empirical study &mdash; but it has a concrete
       <b>experimental scaling setup</b>, and that setup is the "architecture" the paper exercises.</p>
       <p><b>The model family.</b> Every run is a <b>decoder-only Transformer</b> language model (the GPT family):
       a stack of $n_{\\text{layer}}$ identical blocks, each with masked multi-head self-attention of width
       $d_{\\text{attn}}$ and a feed-forward sub-layer of width $d_{\\text{ff}}$, all of residual width
       $d_{\\text{model}}$. Trained with an autoregressive cross-entropy objective (predict the next token) on
       WebText2, with a fixed context length of $n_{\\text{ctx}} = 1024$ tokens. The size knob is the
       non-embedding parameter count $N \\approx 12\\,n_{\\text{layer}}\\,d_{\\text{model}}^2$ (Eq 2.1).</p>
       <p><b>The scan.</b> The experiment varies <i>one</i> resource at a time across many orders of magnitude while
       keeping the others from being the bottleneck:</p>
       <ul>
        <li><b>Size axis ($N$):</b> models from $\\sim 768$ up to $\\sim 1.5$ billion non-embedding parameters,
        with width $d_{\\text{model}}$, depth $n_{\\text{layer}}$, attention width, and feed-forward width all
        scanned &mdash; the finding that <b>shape barely matters</b> comes from varying these independently.</li>
        <li><b>Data axis ($D$):</b> training-token counts swept, each run early-stopped, to fit $L(D)$.</li>
        <li><b>Compute axis ($C$):</b> compute measured as $C \\approx 6NBS$ floating-point operations (six per
        parameter per token: roughly two for the forward pass and four for the backward pass), reported in
        PF-days (peta-FLOP-days).</li>
       </ul>
       <p><b>The batch-size control.</b> To make compute comparisons fair, the paper introduces the <b>critical
       batch size</b> $B_{\\text{crit}}(L)$ (Eq 1.4) &mdash; the batch above which extra parallelism buys little
       and below which extra steps are wasted. Actual steps $S$ and compute $C$ are converted to a
       <b>minimum-steps</b> $S_{\\min}$ and <b>minimum-compute</b> $C_{\\min}$ (Eq 5.4) by correcting for how far
       $B$ sits from $B_{\\text{crit}}$. The clean compute law $L(C_{\\min})$ (Eq 1.3) and the allocation rule
       $N \\propto C^{0.73}$ (Eq 1.7) are all stated in these batch-corrected units.</p>
       <p><b>The data flow of the study.</b> train a grid of Transformers &rarr; record each run's test loss and
       learning curve &rarr; fit the single-resource power laws (Eqs 1.1&ndash;1.3) and the combined surfaces
       (Eqs 1.5&ndash;1.6) &rarr; derive the budget rule (Eqs 1.7&ndash;1.8) from those fitted exponents.</p>`,
    symbols: [
      { sym: "$L$", desc: "the <b>test cross-entropy loss</b>, in nats per token: the average surprise of the model on held-out text. A nat is the natural-log unit of information. Lower is a better next-token predictor. This is the quantity every law predicts." },
      { sym: "$N$", desc: "the <b>model size</b>, defined (&sect;2.1, Eq 2.1) as the number of <b>non-embedding</b> parameters &mdash; the trainable weights, excluding the token-embedding and positional-embedding lookup tables. Roughly $N \\approx 12\\,n_{\\text{layer}}\\,d_{\\text{model}}^2$." },
      { sym: "$D$", desc: "the <b>dataset size</b>: the number of training tokens (word-pieces) the model is trained on." },
      { sym: "$C$", desc: "the <b>compute</b>: the total arithmetic spent on training, measured in floating-point operations (or PF-days, peta-FLOP-days). Estimated as $C \\approx 6NBS$ (&sect;2.1)." },
      { sym: "$C_{\\min}$", desc: "the <b>compute under optimal allocation</b>: the budget $C$ when batch size and training length are tuned to get the lowest loss for that budget. The compute power law is stated in terms of $C_{\\min}$." },
      { sym: "$\\alpha_N,\\ \\alpha_D,\\ \\alpha_C^{\\min}$", desc: "the <b>power-law exponents</b> &mdash; the (negative of the) log-log slopes for size, data, and compute. Fitted to $\\approx 0.076$, $0.095$, and $0.050$ (Table 5). Small exponents mean big multiplicative scaling is needed for a given loss drop." },
      { sym: "$N_c,\\ D_c,\\ C_c^{\\min}$", desc: "the <b>scale constants</b> for each law &mdash; reference values that set where the line sits. Fitted to $N_c \\approx 8.8\\times10^{13}$ params, $D_c \\approx 5.4\\times10^{13}$ tokens, $C_c^{\\min} \\approx 3.1\\times10^{8}$ PF-days (Table 5). The paper notes these are tokenization-dependent." },
      { sym: "$B$", desc: "the <b>batch size</b>: how many sequences the model processes together in one training step (a term in the compute estimate $C \\approx 6NBS$)." },
      { sym: "$S$", desc: "the <b>number of training steps</b> (parameter updates) taken (the other term in $C \\approx 6NBS$)." },
      { sym: "$B_{\\text{crit}}(L)$", desc: "the <b>critical batch size</b> (Eq 1.4): the batch size at which training is near-optimal &mdash; bigger batches waste compute, smaller batches waste steps. It is a function of the current loss $L$, and rises (a larger usable batch) as $L$ falls." },
      { sym: "$B_*,\\ \\alpha_B$", desc: "the <b>scale constant and exponent of the critical-batch-size law</b> $B_{\\text{crit}} = B_*/L^{1/\\alpha_B}$ (Eq 1.4). Fitted to $B_* \\approx 2\\times10^{8}$ tokens and $\\alpha_B \\approx 0.21$ (Table 5)." },
      { sym: "$S_{\\min}$", desc: "the <b>minimum number of steps</b> needed to reach a loss, $S_{\\min} = S/(1 + B_{\\text{crit}}/B)$ (Eq 5.4): actual steps $S$ corrected for batch size relative to $B_{\\text{crit}}$. Used in the learning-curve law (Eq 1.6)." },
      { sym: "$\\alpha_S,\\ S_c$", desc: "the <b>exponent and scale constant of the step term</b> in the learning-curve law $L(N,S)$ (Eq 1.6). Fitted to $\\alpha_S \\approx 0.76$ and $S_c \\approx 2.1\\times10^{3}$ steps (Table 5)." },
      { sym: "$d_{\\text{model}},\\ n_{\\text{layer}},\\ d_{\\text{attn}},\\ d_{\\text{ff}}$", desc: "the <b>Transformer shape parameters</b>: residual stream width, number of layers, attention width, and feed-forward width. They enter the non-embedding count $N \\approx 12\\,n_{\\text{layer}}\\,d_{\\text{model}}^2$ (Eq 2.1); the paper finds loss depends very weakly on how a fixed $N$ is split among them." },
      { sym: "“power law”", desc: "a plain term, not a symbol: a relationship $y = a\\,x^{k}$ where $y$ is a constant times $x$ raised to a fixed exponent $k$. On log-log axes it plots as a straight line of slope $k$." },
      { sym: "“sample-efficient”", desc: "a plain term: reaching a given loss with fewer training tokens. The paper finds larger models are more sample-efficient &mdash; they extract more from each token." }
    ],
    formula: `<p>$$ L(N) = \\left( \\frac{N_c}{N} \\right)^{\\alpha_N}, \\qquad \\alpha_N \\approx 0.076,\\ \\ N_c \\approx 8.8\\times10^{13}\\ \\text{params}. $$</p>
       <p><b>Eq 1.1</b> &mdash; loss vs. model size $N$ (non-embedding parameters), with data and training not the bottleneck.</p>
       <p>$$ L(D) = \\left( \\frac{D_c}{D} \\right)^{\\alpha_D}, \\qquad \\alpha_D \\approx 0.095,\\ \\ D_c \\approx 5.4\\times10^{13}\\ \\text{tokens}. $$</p>
       <p><b>Eq 1.2</b> &mdash; loss vs. dataset size $D$ (training tokens), for a large model with early stopping.</p>
       <p>$$ L(C_{\\min}) = \\left( \\frac{C_c^{\\min}}{C_{\\min}} \\right)^{\\alpha_C^{\\min}}, \\qquad \\alpha_C^{\\min} \\approx 0.050,\\ \\ C_c^{\\min} \\approx 3.1\\times10^{8}\\ \\text{PF-days}. $$</p>
       <p><b>Eq 1.3</b> &mdash; loss vs. optimally-allocated training compute $C_{\\min}$.</p>
       <p>$$ B_{\\text{crit}}(L) = \\frac{B_*}{L^{1/\\alpha_B}}, \\qquad B_* \\approx 2\\times10^{8}\\ \\text{tokens},\\ \\ \\alpha_B \\approx 0.21. $$</p>
       <p><b>Eq 1.4 / &sect;5.1</b> &mdash; the <b>critical batch size</b>: the batch size that gives a near-optimal trade-off between training-time (steps) and compute. It rises as a power law as the loss $L$ falls, so larger, better-trained models tolerate larger batches.</p>
       <p>$$ L(N, D) = \\left[ \\left( \\frac{N_c}{N} \\right)^{\\alpha_N / \\alpha_D} + \\frac{D_c}{D} \\right]^{\\alpha_D}. $$</p>
       <p><b>Eq 1.5</b> &mdash; the combined size-and-data law: the scarcer resource dominates; the boundary where adding parameters stops helping (overfitting).</p>
       <p>$$ L(N, S) = \\left( \\frac{N_c}{N} \\right)^{\\alpha_N} + \\left( \\frac{S_c}{S_{\\min}} \\right)^{\\alpha_S}, \\qquad \\alpha_S \\approx 0.76,\\ \\ S_c \\approx 2.1\\times10^{3}. $$</p>
       <p><b>Eq 1.6 / &sect;5.1</b> &mdash; the learning curve: loss as a function of model size $N$ and the number of training steps $S$, where $S_{\\min}$ is the minimum-steps measure (Eq 5.4 below).</p>
       <p>$$ N \\approx \\frac{2\\,d_{\\text{model}}\\,n_{\\text{layer}}\\,(2 d_{\\text{attn}} + d_{\\text{ff}})}{1} \\approx 12\\,n_{\\text{layer}}\\,d_{\\text{model}}^{2}, \\qquad C \\approx 6 N B S. $$</p>
       <p><b>Eq 2.1 / &sect;2.1</b> &mdash; the count of non-embedding parameters $N$, and the per-training compute estimate $C$ in floating-point operations ($B$ = batch size, $S$ = steps).</p>
       <p>$$ S_{\\min}(S) = \\frac{S}{1 + B_{\\text{crit}}(L)/B}, \\qquad C_{\\min} = \\frac{C}{1 + B/B_{\\text{crit}}(L)}. $$</p>
       <p><b>Eq 5.4 / &sect;5.1</b> &mdash; the minimum steps and minimum compute to reach a loss, obtained by correcting actual steps $S$ and compute $C$ for the batch size relative to $B_{\\text{crit}}$.</p>
       <p>$$ N_{\\text{opt}} \\propto C_{\\min}^{\\,0.73}, \\quad B_{\\text{crit}} \\propto C_{\\min}^{\\,0.24}, \\quad S_{\\min} \\propto C_{\\min}^{\\,0.03}, \\quad D_{\\text{opt}} \\propto C_{\\min}^{\\,0.27}. $$</p>
       <p><b>Eq 1.7 / &sect;6</b> &mdash; the <b>compute-optimal allocation</b>: how to split a fixed budget. The optimal model size scales as $N \\propto C^{0.73}$ &mdash; most of a bigger budget buys a bigger model; the number of steps barely grows, so you stop well before convergence.</p>
       <p>$$ \\alpha_C^{\\min} = \\frac{1}{\\,1/\\alpha_S + 1/\\alpha_B + 1/\\alpha_N\\,} \\approx 0.050. $$</p>
       <p><b>Eq 1.8 / &sect;6</b> &mdash; the compute exponent is fixed by the other three exponents (size, data-steps, and batch), tying every law together.</p>`,
    whatItDoes:
      `<p><b>Each single-variable law (Eqs 1.1&ndash;1.3)</b> says the same thing for a different resource: as you
       scale that resource up, the loss comes down as that resource raised to a small negative power. Because the
       exponents are small (all under $0.1$), the loss drops <i>slowly</i> &mdash; but <i>predictably</i>. A
       $10\\times$ increase in model size, with $\\alpha_N \\approx 0.076$, multiplies the loss by
       $10^{-0.076} \\approx 0.84$: about a $16\\%$ reduction. The payoff of the laws is not that scaling is cheap;
       it is that scaling is <b>forecastable</b>. Fit the line on small models, read off the loss of a giant one.</p>
       <p><b>The combined law (Eq 1.5)</b> stitches model size and data into one surface. The two terms add inside
       the bracket; whichever resource is scarcer makes its term large and dominates the loss. This is what
       formalizes the intuition "a bigger model needs more data to feed it." When $D$ is too small for a given
       $N$, the $D_c/D$ term dominates and adding parameters stops helping &mdash; the onset of overfitting. The
       compute relation $N \\propto C^{0.73}$ (Table 6) then answers the budget question: most of a larger budget
       should buy a larger model, and you should stop training before convergence.</p>`,
    derivation:
      `<p>This is an <b>empirical</b> paper: the power laws are <i>measured</i>, not derived from first principles.
       So "why it is true" here means "why the functional form is the one to fit, and what its log-log slope
       means" &mdash; the math you can check by hand.</p>
       <p><b>A power law is a straight line in log-log space.</b> Start from Law 1, $L(N) = (N_c/N)^{\\alpha_N}$.
       Take the natural logarithm of both sides:</p>
       <p>$$ \\ln L = \\alpha_N \\big( \\ln N_c - \\ln N \\big) = \\underbrace{\\alpha_N \\ln N_c}_{\\text{intercept}}
       \\; - \\; \\alpha_N \\, \\ln N. $$</p>
       <p>Let $u = \\ln N$ and $v = \\ln L$. Then $v = (\\alpha_N \\ln N_c) - \\alpha_N\\, u$: a straight line in
       $u$ with <b>slope $-\\alpha_N$</b> and intercept $\\alpha_N \\ln N_c$. So if you plot measured loss against
       model size with <b>both axes on a log scale</b> and the points fall on a line, the relationship <i>is</i> a
       power law, the line's slope gives you $\\alpha_N$, and where it crosses gives you $N_c$. The paper's
       evidence is precisely that these plots are straight over many orders of magnitude.</p>
       <p><b>Why the combined law has its shape.</b> Eq 1.5 is chosen so that (a) when $D \\to \\infty$ it reduces
       to Law 1, $L \\to (N_c/N)^{\\alpha_N}$ &mdash; the data term vanishes and only model size limits you; and
       (b) when $N \\to \\infty$ it reduces to Law 2, $L \\to (D_c/D)^{\\alpha_D}$ &mdash; only data limits you.
       The exponent ratio $\\alpha_N/\\alpha_D$ on the first term is what makes both limits come out with the
       right power. It is a smooth interpolation between the two single-resource laws, fitted to the data; the
       paper does not claim a theoretical derivation of this exact form.</p>
       <p><b>Why the compute exponent is what it is.</b> Optimal allocation chooses $N$ to balance the size and
       data terms as the budget grows. Working through the laws gives the optimal model size as a power of
       compute, $N \\propto C_{\\min}^{\\,\\alpha_C^{\\min}/\\alpha_N}$, which with the fitted exponents is about
       $C^{0.73}$ (&sect;1.2, Table 6). The takeaway is qualitative and robust: <b>most extra budget should go to
       a bigger model.</b></p>`,
    example:
      `<p>Plug real model sizes into the transcribed law $L(N) = (N_c/N)^{\\alpha_N}$ with the paper's fitted
       constants $N_c = 8.8\\times10^{13}$ and $\\alpha_N = 0.076$ (Table 5), and check the "10&times; bigger"
       prediction step by step. (Note: $L$ here is the model-size-limited loss in nats; in the regime where
       Law 1 applies.)</p>
       <ul class="steps">
        <li><b>A small model, $N = 10^6$ parameters (one million).</b> The ratio is
        $N_c / N = 8.8\\times10^{13} / 10^6 = 8.8\\times10^{7}$. Raise to $\\alpha_N = 0.076$:
        $L = (8.8\\times10^{7})^{0.076}$. Take logs: $\\ln(8.8\\times10^{7}) \\approx 18.293$, times $0.076$ gives
        $\\approx 1.390$, so $L = e^{1.390} \\approx 4.02$ nats.</li>
        <li><b>A 10&times; bigger model, $N = 10^7$ (ten million).</b> Now
        $N_c / N = 8.8\\times10^{6}$, and $\\ln(8.8\\times10^{6}) \\approx 15.990$, times $0.076 \\approx 1.215$,
        so $L = e^{1.215} \\approx 3.37$ nats.</li>
        <li><b>The reduction factor.</b> $L_{\\text{big}} / L_{\\text{small}} = 3.37 / 4.02 \\approx 0.84$. Exactly
        as predicted by the shortcut: a 10&times; increase in $N$ multiplies the loss by $10^{-\\alpha_N} =
        10^{-0.076} \\approx 0.839$. About a <b>16% drop</b> for an order of magnitude more parameters.</li>
        <li><b>And 100&times; bigger?</b> Two factors of $0.839$: $0.839^2 \\approx 0.704$. So $100\\times$ the
        size gives roughly a $30\\%$ loss reduction. This is why the paper must scan many orders of magnitude to
        watch the loss fall meaningfully &mdash; and why the curve is so smooth.</li>
       </ul>
       <p>The CODEVIZ recomputes the $10^{-\\alpha}$ shortcut and the log-log slope so you can verify these
       numbers. The synthetic-fit panel there uses the <i>same form</i> $L = (N_c/N)^{\\alpha}$ but with
       made-up round constants to keep the picture clean &mdash; it is an illustration of the shape, not these
       exact paper values.</p>`,
    recipe:
      `<p>This is a read-only paper, so there is no architecture to assemble. Instead, here is the procedure the
       paper uses to <b>establish</b> a scaling law &mdash; the recipe you would follow to measure one yourself:</p>
       <ol>
        <li><b>Fix the architecture family</b> (here, decoder-only Transformers) and vary <b>one</b> resource at
        a time &mdash; model size $N$, data $D$, or compute $C$ &mdash; while keeping the others from being the
        bottleneck.</li>
        <li><b>Train many models</b> spanning several orders of magnitude in that resource. Record the converged
        (or early-stopped) test loss for each.</li>
        <li><b>Plot loss vs. the resource on log-log axes.</b> If the points fall on a straight line, you have a
        power law.</li>
        <li><b>Fit the line.</b> The slope gives the exponent ($\\alpha_N$, $\\alpha_D$, or $\\alpha_C^{\\min}$);
        the position gives the scale constant ($N_c$, $D_c$, $C_c^{\\min}$). These are Table 5.</li>
        <li><b>Combine</b> the size and data laws into $L(N,D)$ (Eq 1.5) and fit the cross-term; check it reduces
        to each single law in the limits.</li>
        <li><b>Read off the budget rule.</b> Use $C \\approx 6NBS$ and the laws to derive the compute-optimal
        model size, $N \\propto C^{0.73}$ &mdash; bigger budget, mostly bigger model, stop before convergence.</li>
       </ol>`,
    results:
      `<p><b>From the abstract (quoted):</b> "The loss scales as a power-law with model size, dataset size, and the
       amount of compute used for training, with some trends spanning more than seven orders of magnitude. Other
       architectural details such as network width or depth have minimal effects within a wide range."</p>
       <p><b>On compute allocation (quoted, abstract):</b> "These relationships allow us to determine the optimal
       allocation of a fixed compute budget. Larger models are significantly more sample-efficient, such that
       optimally compute-efficient training involves training very large models on a relatively modest amount of
       data and stopping significantly before convergence."</p>
       <p><b>On scale vs. shape (quoted, &sect;1.1):</b> performance "depends most strongly on scale" and "very
       weakly on other architectural hyperparameters such as depth vs. width."</p>
       <p><b>The fitted constants (Table 5):</b> $\\alpha_N \\approx 0.076$, $\\alpha_D \\approx 0.095$,
       $\\alpha_C^{\\min} \\approx 0.050$; $N_c \\approx 8.8\\times10^{13}$ parameters,
       $D_c \\approx 5.4\\times10^{13}$ tokens, $C_c^{\\min} \\approx 3.1\\times10^{8}$ PF-days. Optimal model size
       grows as $N \\propto C_{\\min}^{0.73}$ (Table 6).</p>
       <p><i>These are the paper's own statements and fitted numbers, transcribed from the abstract, &sect;1.1,
       and Tables 5&ndash;6. The numbers in the CODEVIZ panel below come from a small synthetic illustration of
       the law's form &mdash; not the paper's measured results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>read-only</b> paper: a pure-scale empirical result, with no model to build from scratch.
       There is no PyTorch primitive to reconstruct and no novel module to compose. What you <i>do</i> instead is
       <b>understand and use</b> the laws: read off the functional form, recognize a power law as a straight line
       on log-log axes, and plug numbers through $L(N) = (N_c/N)^{\\alpha_N}$ to predict a loss. The optional code
       below is a tiny <b>conceptual illustration</b> &mdash; it fits a power law to a handful of synthetic
       $(N, \\text{loss})$ points and draws the straight log-log line. It uses round, made-up constants to show
       the <i>shape</i> of the relationship; it does <b>not</b> reproduce the paper's measured exponents or any
       real training run.</p>`,
    pitfalls:
      `<ul>
        <li><b>Reading a small exponent as a small effect.</b> $\\alpha_N \\approx 0.076$ looks tiny, but it is
        an exponent, not a percentage. It means a $10\\times$ increase in $N$ gives a fixed $\\approx 16\\%$ loss
        drop &mdash; <i>every</i> order of magnitude, compounding. The power-law form is what makes the gains
        relentless across scales. <b>Fix:</b> always convert an exponent to a per-decade factor, $10^{-\\alpha}$.</li>
        <li><b>Forgetting "non-embedding."</b> $N$ is the count of non-embedding parameters (&sect;2.1) &mdash; it
        excludes the token and positional embedding tables. Counting total parameters (which embeddings inflate,
        especially for small models with big vocabularies) changes the fit and breaks comparisons. <b>Fix:</b> use
        the paper's definition.</li>
        <li><b>Applying one law outside its regime.</b> $L(N)$ assumes data and training are <i>not</i> the
        bottleneck; $L(D)$ assumes the model is big enough and uses early stopping. Use Law 1 on a data-starved
        run and it will not hold &mdash; you have crossed into the overfitting regime that Eq 1.5 describes.
        <b>Fix:</b> use the combined $L(N,D)$ when both resources are finite.</li>
        <li><b>Treating the constants as universal.</b> The paper notes $N_c$, $D_c$, and $C_c^{\\min}$ depend on
        the tokenization (and dataset). The <i>exponents</i> are the robust, portable finding; the scale constants
        are setup-specific. <b>Fix:</b> quote exponents across settings; refit constants per setup.</li>
        <li><b>Confusing the compute law's $C_{\\min}$ with raw compute.</b> The compute power law (Eq 1.3) is
        stated for <i>optimally allocated</i> compute $C_{\\min}$ &mdash; batch size and training length tuned. A
        badly-run training of the same FLOP count will not sit on that line. <b>Fix:</b> the law predicts the
        best achievable loss at a budget, not any run.</li>
      </ul>`,
    recall: [
      "Write the three single-variable power laws $L(N)$, $L(D)$, $L(C_{\\min})$ from memory, with their equation numbers.",
      "Why does a power law plot as a straight line on log-log axes, and what is the slope?",
      "Define $N$ exactly (which parameters are excluded?) and state the compute estimate $C \\approx 6NBS$.",
      "Given $\\alpha_N \\approx 0.076$, by what factor does the loss change when $N$ grows $10\\times$?",
      "State the compute-optimal scaling of model size, $N \\propto C^{?}$, and the one-sentence budget rule."
    ],
    practice: [
      {
        q: `<b>Per-decade loss drop.</b> The paper fits $L(N) = (N_c/N)^{\\alpha_N}$ with
            $\\alpha_N \\approx 0.076$. (a) By what factor does the loss change if you make the model
            $1000\\times$ bigger? (b) If a different resource had exponent $0.095$ (the paper's $\\alpha_D$),
            which scales loss down faster per decade, size or data?`,
        steps: [
          { do: `Use the per-decade factor $10^{-\\alpha}$. One decade ($10\\times$) of size: $10^{-0.076} \\approx 0.839$.`, why: `A power law in $N$ means a $10\\times$ increase multiplies the loss by $10^{-\\alpha_N}$, independent of where you start.` },
          { do: `$1000\\times = 10^3$ is three decades, so multiply three factors: $0.839^3 \\approx 0.590$.`, why: `Each decade applies the same multiplicative factor; three decades compound it three times.` },
          { do: `Compare exponents: $10^{-0.095} \\approx 0.804$ per decade for data vs. $0.839$ for size. The larger exponent gives the smaller multiplier, hence the faster drop.`, why: `A bigger exponent is a steeper log-log slope, so loss falls faster per decade of that resource.` }
        ],
        answer: `<p>(a) $1000\\times$ bigger is three decades: $0.839^3 \\approx 0.59$, about a <b>41% loss
                 reduction</b>. (b) Data, with exponent $\\alpha_D \\approx 0.095$, drops the loss faster per
                 decade ($\\times 0.804$) than size with $\\alpha_N \\approx 0.076$ ($\\times 0.839$) &mdash; a
                 bigger exponent is a steeper log-log slope. (Both still require many orders of magnitude to move
                 the loss a lot, which is the whole point: smooth, slow, predictable.)</p>`
      },
      {
        q: `<b>Reading the log-log line.</b> Someone hands you a log-log plot (natural log of loss on the
            vertical axis, natural log of $N$ on the horizontal) and the points lie on a straight line of slope
            $-0.076$ passing through a known point. What does the slope tell you, what would a <i>steeper</i>
            (more negative) slope mean, and how would you read off the scale constant $N_c$?`,
        steps: [
          { do: `Recall $\\ln L = \\alpha_N \\ln N_c - \\alpha_N \\ln N$, a line with slope $-\\alpha_N$.`, why: `Taking the log of $L = (N_c/N)^{\\alpha_N}$ turns the power law into a linear equation in $\\ln N$.` },
          { do: `Identify the slope: $-0.076$ means $\\alpha_N = 0.076$. A steeper (more negative) slope means a larger $\\alpha_N$, so loss falls faster per decade of size.`, why: `The slope of the log-log line IS the negative exponent; steeper means a bigger exponent.` },
          { do: `Find $N_c$: it is the $N$ where the line predicts $L = 1$ (since $\\ln L = 0$ when $N = N_c$). Read the horizontal intercept at $\\ln L = 0$, then exponentiate.`, why: `At $N = N_c$ the ratio $N_c/N = 1$, so $L = 1^{\\alpha_N} = 1$ and $\\ln L = 0$ &mdash; the line crosses zero exactly at $\\ln N_c$.` }
        ],
        answer: `<p>The slope $-0.076$ is $-\\alpha_N$: it sets how fast loss falls per decade of model size
                 ($10^{-0.076}\\approx 0.84$ per $10\\times$). A steeper, more-negative slope means a larger
                 exponent and a faster per-decade drop. The scale constant $N_c$ is the model size at which the
                 fitted line predicts $L = 1$ (where $\\ln L = 0$), because there $N_c/N = 1$. So the slope gives
                 the exponent and the zero-crossing gives the constant &mdash; the two numbers in Table 5.</p>`
      },
      {
        q: `<b>The budget rule (compute allocation).</b> You double your training compute budget $C$. Using the
            paper's compute-optimal scaling $N \\propto C^{0.73}$, by roughly what factor should the optimal model
            size grow? And what does the paper say to do about how long you train? Tie it to "stop before
            convergence."`,
        steps: [
          { do: `Apply the scaling: doubling $C$ multiplies optimal $N$ by $2^{0.73}$.`, why: `$N \\propto C^{0.73}$ (Table 6) means the optimal model size is compute raised to the $0.73$ power, so a $\\times 2$ budget gives $\\times 2^{0.73}$ size.` },
          { do: `Compute $2^{0.73} = e^{0.73 \\ln 2} = e^{0.506} \\approx 1.66$. So optimal $N$ grows about $1.66\\times$.`, why: `Most of the doubled budget goes into a bigger model, not proportionally more training tokens.` },
          { do: `Since $C \\approx 6NBS$ and $N$ absorbs most of the increase, the number of tokens (steps) grows much less than $2\\times$; you stop training the bigger model relatively early.`, why: `The paper's finding: larger models are more sample-efficient, so optimal training stops "significantly before convergence."` }
        ],
        answer: `<p>Doubling compute should grow the optimal model size by about $2^{0.73} \\approx 1.66\\times$ &mdash;
                 most of the extra budget buys a <b>bigger model</b>, not proportionally more data. Because that
                 larger model is more sample-efficient and compute is split as $C \\approx 6NBS$, you process
                 relatively few extra tokens and <b>stop before convergence</b>. That is the abstract's recipe:
                 "training very large models on a relatively modest amount of data and stopping significantly
                 before convergence." (Quoted, abstract.)</p>`
      }
    ]
  });

  window.CODE["paper-scaling-laws"] = {
    lib: "NumPy",
    runnable: false,
    explain:
      `<p>This is a <b>read-only</b> paper, so there is no model to train or verify. The snippet below is a tiny
       <b>conceptual illustration</b> of the law's <i>form</i> only. It (1) recomputes the worked example through
       the transcribed law $L(N) = (N_c/N)^{\\alpha_N}$ with the paper's constants $N_c = 8.8\\times10^{13}$,
       $\\alpha_N = 0.076$ &mdash; checking the $10\\times \\to \\times 0.84$ loss drop &mdash; and (2) fits a
       power law to a few <b>synthetic</b> $(N, \\text{loss})$ points by least-squares on log-log axes, recovering
       the straight-line slope. The synthetic fit uses round, made-up constants to keep the picture clean; it is
       <b>not</b> the paper's measured exponents or any training run. Pure NumPy, CPU, runs in well under a
       second.</p>`,
    code: `import numpy as np

# ---------------------------------------------------------------------------
# (1) WORKED EXAMPLE: the paper's transcribed law L(N) = (N_c / N) ** alpha_N
#     with the FITTED constants from Table 5. We verify the "10x -> x0.84" drop.
# ---------------------------------------------------------------------------
N_c, alpha_N = 8.8e13, 0.076          # paper's fitted values (Table 5)
def L(N): return (N_c / N) ** alpha_N

L_small = L(1e6)                       # a 1-million-parameter model
L_big   = L(1e7)                       # 10x bigger
print("L(1e6) = %.3f nats" % L_small)
print("L(1e7) = %.3f nats" % L_big)
print("ratio  = %.3f   (shortcut 10**-alpha_N = %.3f)" % (
      L_big / L_small, 10 ** (-alpha_N)))
# L(1e6) = 4.016 nats
# L(1e7) = 3.371 nats
# ratio  = 0.839   (shortcut 10**-alpha_N = 0.839)

# ---------------------------------------------------------------------------
# (2) CONCEPTUAL FIT: synthetic (N, loss) points that FOLLOW a power law, then
#     recover its slope by least-squares in log-log space. ROUND, MADE-UP
#     constants -- an illustration of the FORM, NOT the paper's measured values.
# ---------------------------------------------------------------------------
rng = np.random.default_rng(0)
Nc_demo, a_demo = 1.0e9, 0.10          # synthetic constants (not the paper's)
N_pts = np.array([1e5, 1e6, 1e7, 1e8, 1e9])          # five model sizes
loss  = (Nc_demo / N_pts) ** a_demo
loss *= rng.normal(1.0, 0.01, size=loss.shape)       # tiny jitter, so the fit works

# A power law is a line in log-log space: ln(loss) = ln(Nc^a) - a*ln(N).
slope, intercept = np.polyfit(np.log(N_pts), np.log(loss), 1)
print("\\nsynthetic power-law fit (illustration of FORM only):")
print("  recovered slope  = %.4f  (true -alpha = %.4f)" % (slope, -a_demo))
print("  recovered alpha  = %.4f  (true alpha  = %.4f)" % (-slope, a_demo))
# synthetic power-law fit (illustration of FORM only):
#   recovered slope  = -0.1005  (true -alpha = -0.1000)
#   recovered alpha  =  0.1005  (true alpha  =  0.1000)
# The straight log-log line IS the power law. These constants are synthetic,
# NOT the paper's measured exponents.`
  };

  window.CODEVIZ["paper-scaling-laws"] = {
    question: "A power law L = (N_c/N)^alpha plots as a STRAIGHT line on log-log axes. If we generate a few synthetic (model size, loss) points from such a law and least-squares-fit them in log-log space, do we recover the line?",
    charts: [
      {
        type: "line",
        title: "Loss vs. model size on log-log axes — a synthetic power law and its fit (ILLUSTRATION, not the paper's numbers)",
        xlabel: "log10(model size N)  [synthetic parameter counts]",
        ylabel: "log10(loss)  [synthetic, arbitrary units]",
        series: [
          {
            name: "synthetic data points",
            color: "#7ee787",
            points: [[5.0,0.4005],[6.0,0.2994],[7.0,0.2028],[8.0,0.1005],[9.0,-0.0023]]
          },
          {
            name: "least-squares power-law fit (slope = -alpha)",
            color: "#ff7b72",
            points: [[5.0,0.4011],[9.0,-0.0008]]
          }
        ]
      }
    ],
    caption: "Illustration of the FORM of the law, NOT the paper's measured constants. We generate five synthetic points from L = (N_c/N)^alpha with round, made-up constants (N_c=1e9, alpha=0.10), add 1% jitter, and least-squares-fit in log-log space. The points fall on a straight line and the fit recovers slope -0.1005 (so alpha = 0.1005, matching the synthetic 0.10). This is the geometry behind the paper's Eqs 1.1-1.3: a power law is a straight line on log-log axes, and its slope is the (negative) exponent. The paper's real fitted exponents are alpha_N = 0.076, alpha_D = 0.095, alpha_C_min = 0.050 (Table 5) -- those are measured over real Transformer runs spanning seven orders of magnitude, NOT reproduced here.",
    code: `import numpy as np
rng = np.random.default_rng(0)

# Synthetic power law: L = (N_c / N) ** alpha. ROUND, MADE-UP constants --
# this illustrates the FORM (a straight log-log line), NOT the paper's values.
N_c, alpha = 1.0e9, 0.10
N = np.array([1e5, 1e6, 1e7, 1e8, 1e9])
loss = (N_c / N) ** alpha
loss *= rng.normal(1.0, 0.01, size=loss.shape)        # 1% jitter

# Fit a line in log-log space; slope is -alpha.
x, y = np.log10(N), np.log10(loss)
slope, intercept = np.polyfit(x, y, 1)
print("data points (log10 N, log10 loss):")
for xi, yi in zip(x, y):
    print("  %.1f  %.4f" % (xi, yi))
xs = np.array([x.min(), x.max()])
print("fit line endpoints:", list(zip(xs.round(1), (slope*xs + intercept).round(4))))
print("recovered slope = %.4f (= -alpha), so alpha = %.4f" % (slope, -slope))
# data points (log10 N, log10 loss):
#   5.0  0.4005
#   6.0  0.2994
#   7.0  0.2028
#   8.0  0.1005
#   9.0  -0.0023
# fit line endpoints: [(5.0, 0.4011), (9.0, -0.0008)]
# recovered slope = -0.1005 (= -alpha), so alpha = 0.1005
# A straight log-log line IS a power law. Synthetic constants, NOT the paper's.`
  };
})();
