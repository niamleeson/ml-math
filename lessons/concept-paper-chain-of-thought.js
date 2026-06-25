/* Paper lesson — "Chain-of-Thought Prompting Elicits Reasoning in Large Language
   Models", Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten Bosma, Brian Ichter,
   Fei Xia, Ed Chi, Quoc Le, Denny Zhou (Google, NeurIPS 2022). arXiv:2201.11903.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-chain-of-thought".
   GROUNDED from arXiv:2201.11903 (abstract) and the ar5iv HTML mirror:
   Abstract (the GSM8K / eight-exemplar headline); Section 2 (the definition of a
   chain of thought and the <input, chain of thought, output> exemplar triple);
   Section 3.1 (the eight manually-composed exemplars; four for AQuA; the arithmetic
   benchmarks); Section 3.2 (the emergence-at-scale finding, verbatim); Sections 4-5
   (commonsense and symbolic benchmarks); Section 6 (Discussion).
   Track: read-only (a prompting-behavior result, no model to train).
   The CODEVIZ is OUR OWN small illustration: a toy probabilistic model of how
   breaking a multi-step problem into per-step sub-answers changes the chance of
   getting the whole problem right vs answering in one shot. It is NOT the paper's
   number and uses no real language model. */
(function () {
  window.LESSONS.push({
    id: "paper-chain-of-thought",
    title: "Chain-of-Thought — Chain-of-Thought Prompting Elicits Reasoning in Large Language Models (2022)",
    tagline: "Show the model a few worked, step-by-step examples and it learns to reason out loud — but only once it is big enough.",
    module: "Papers · Transformers & LLMs",
    track: "read-only",
    paper: {
      authors: "Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten Bosma, Brian Ichter, Fei Xia, Ed H. Chi, Quoc V. Le, Denny Zhou",
      org: "Google Research, Brain Team",
      year: 2022,
      venue: "NeurIPS 2022 (arXiv:2201.11903, Jan 2022)",
      citations: "",
      arxiv: "https://arxiv.org/abs/2201.11903",
      code: ""
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["fs-in-context", "dl-language-model", "paper-transformer", "paper-scaling-laws"],

    // WHY READ IT
    problem:
      `<p>A <b>large language model</b> (a network trained to predict the next word-piece, called a <b>token</b>,
       in text) can be steered without retraining. You write a few examples of the task directly in the input text,
       then ask your real question. The model copies the pattern. This trick is called <b>in-context learning</b>,
       and <b>few-shot prompting</b> means giving a small number ("few") of such examples (each one a "shot"). It
       works well for tasks where the answer is one short step away from the input.</p>
       <p>But it failed badly on tasks that need <b>multi-step reasoning</b> &mdash; problems where you must chain
       several intermediate deductions before the answer, like a grade-school math word problem. The standard recipe
       gave the model example pairs of (question, final answer) and hoped it would jump straight to the answer. On
       arithmetic word problems the model mostly got them wrong, and worse, "scaling up model size did not
       substantially improve" this (Introduction). Bigger models alone did not fix reasoning. The curves were flat.</p>
       <p>This paper asks a simple question: what if, instead of showing the model only the final answer in each
       example, we also show it the <b>work</b> &mdash; the intermediate steps a person would write down to get
       there? Does the model then produce its own steps, and does that produce the right answer?</p>`,
    contribution:
      `<ul>
        <li><b>Chain-of-thought prompting.</b> The paper's one idea: in each few-shot example, insert a
        <b>chain of thought</b> &mdash; "a series of intermediate natural language reasoning steps that lead to the
        final output" (&sect;2) &mdash; in between the question and the answer. At test time the model then generates
        its own chain of thought before its answer. The method changes only the prompt; nothing is trained.</li>
        <li><b>Large gains on reasoning, across three task families.</b> "Chain-of-thought prompting improves
        performance on a range of arithmetic, commonsense, and symbolic reasoning tasks. The empirical gains can be
        striking." (Abstract.) One headline: "prompting a PaLM 540B with just eight chain-of-thought exemplars
        achieves state-of-the-art accuracy on the GSM8K benchmark" of math word problems (Abstract).</li>
        <li><b>It is an emergent ability of scale.</b> The benefit only appears in models that are large enough.
        "Chain-of-thought prompting is an emergent ability of model scale." (&sect;3.2.) On small models it does not
        help &mdash; and can hurt.</li>
      </ul>`,
    whyItMattered:
      `<p>This paper showed that a hard capability &mdash; multi-step reasoning &mdash; was already latent inside
       large language models and could be unlocked by the prompt alone, with no training, no fine-tuning, and no
       extra data. That reframed how people use these models: instead of asking for the answer, you ask the model to
       "think step by step," and the act of writing the steps makes the final answer far more likely to be right.</p>
       <p>It also sharpened the idea of an <b>emergent ability</b> &mdash; a skill that is essentially absent in
       small models and appears, sometimes abruptly, past a scale threshold. Reasoning was a flat, near-random curve
       for small models and a useful capability for large ones. The reasoning step also made the model's output
       <i>interpretable</i>: you can read the chain and see where it went wrong. A large family of later prompting
       methods (asking the model to reason, to self-check, to plan) traces directly to this result.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;1 (Introduction)</b> &mdash; the framing: standard few-shot prompting plateaus on reasoning, and
        "scaling up model size did not substantially improve" it. This is the gap the method fills.</li>
        <li><b>&sect;2 (Chain-of-Thought Prompting)</b> &mdash; the whole method on one page. The exemplar is a
        <b>triple</b>: an input, a chain of thought, and an output. Read the worked example prompts carefully; the
        method is "just" this change to the prompt.</li>
        <li><b>&sect;3.1&ndash;3.2 (Arithmetic Reasoning)</b> &mdash; the setup ("eight few-shot exemplars," &sect;3.1)
        and the central finding: chain of thought is "an emergent ability of model scale" (&sect;3.2). Study Figure 2
        (accuracy vs. model size) &mdash; the gap opens only for large models.</li>
       </ul>
       <p><b>Skim:</b> &sect;4 (commonsense reasoning), &sect;5 (symbolic reasoning), and the ablations in &sect;3.3
       &mdash; they confirm the effect is broad and is not explained by trivial alternatives, but the core idea is
       fully in &sect;2 and &sect;3.2. You do <b>not</b> implement this paper; it is a prompting-behavior result.
       Read it for the method and the emergence finding.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Imagine a word problem that takes <b>four</b> correct intermediate steps to solve. Suppose a model gets
       each single step right about $80\\%$ of the time. Question to guess before reading on: if the model must do
       all four steps silently "in its head" and emit only the final answer &mdash; getting it right only if it
       happens to land the whole computation &mdash; is its chance of a correct answer closer to $80\\%$, around
       $50\\%$, or near $30\\%$?</p>
       <p>(Hint: if the steps must all be right and errors compound, four steps at $80\\%$ each is about
       $0.8 \\times 0.8 \\times 0.8 \\times 0.8$.) Then ask: how could writing the steps out, one at a time, change
       this? Write your guess and one sentence of reasoning.</p>`,
    attempt:
      `<p>This is a read-only paper, so there is nothing to build from scratch. Instead, before the reveal, reason
       about <i>why</i> showing the work could help, using a toy model of error:</p>
       <ul>
        <li>Suppose a problem decomposes into $k$ independent sub-steps, each solved correctly with probability $p$.
        Write the chance of getting the <b>whole</b> problem right if every step must be correct. (It is a product.)</li>
        <li>TODO: with $p = 0.8$ and $k = 4$, compute that whole-problem success probability. Compare it to a single
        $p = 0.8$.</li>
        <li>Now argue, in words, how making the model emit each intermediate step as text could raise per-step
        accuracy $p$: each written step becomes part of the input the next step conditions on, so the model never has
        to hold the whole computation at once. (This is our intuition for the effect, not a claim measured in the paper.)</li>
       </ul>
       <p>The CODEVIZ panel below makes this concrete with a tiny, made-up error model &mdash; clearly labeled as
       <b>our illustration</b>, not the paper's reported numbers.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The method is small enough to state in a sentence and then unpack. <b>In standard few-shot prompting</b>
       you build a prompt out of example pairs &mdash; (question, answer), (question, answer), &hellip; &mdash; then
       append your real question and let the model continue. <b>Chain-of-thought prompting</b> changes each example
       from a pair into a <b>triple</b>: (question, chain of thought, answer). Nothing else changes. No training,
       no new data, no architecture change. Only the text of the examples.</p>
       <p><b>What is a chain of thought?</b> The paper defines it precisely (&sect;2): "a <i>chain of thought</i> is a
       series of intermediate natural language reasoning steps that lead to the final output." It is the work you
       would scribble on paper: name the quantities, do one operation, carry the result forward, do the next, and
       arrive at the answer. Written in plain language, in the example, right before the answer.</p>
       <p><b>A worked example of the prompt format.</b> For a math word problem, a standard exemplar looks like:</p>
       <p><code>Q: Roger has 5 tennis balls. He buys 2 more cans of 3 balls each. How many does he have now?<br>
       A: The answer is 11.</code></p>
       <p>A chain-of-thought exemplar inserts the reasoning between the question and the answer:</p>
       <p><code>Q: Roger has 5 tennis balls. He buys 2 more cans of 3 balls each. How many does he have now?<br>
       A: Roger started with 5 balls. 2 cans of 3 balls each is 6 balls. 5 + 6 = 11. The answer is 11.</code></p>
       <p>(This is a representative format in the style of the paper's &sect;2 exemplars; the numbers here are a
       generic illustration of the format, not a quoted benchmark item.) After a few such exemplars you append the
       real question, ending in <code>A:</code>, and the model &mdash; having seen the pattern &mdash; writes its own
       chain of thought and then its answer.</p>
       <p><b>How many examples?</b> Few. "We manually composed a set of eight few-shot exemplars with chains of
       thought for prompting" (&sect;3.1). For one harder benchmark (AQuA, multiple-choice algebra) the paper used
       four exemplars instead of eight. The point is that this is still <i>few-shot</i> &mdash; a handful of examples,
       not a training set.</p>
       <p><b>Why writing the steps helps (the paper's intuition, &sect;1).</b> Producing the chain "allows models to
       decompose multi-step problems into intermediate steps," so the model can spend more computation on harder
       problems, and the natural-language trace makes the reasoning <i>visible</i> and <i>checkable</i>. Concretely:
       each step the model writes becomes part of the running text, so the next step conditions on an explicit,
       already-computed result rather than on a value the model must hold implicitly. The hard problem is replaced by
       a chain of easier ones.</p>
       <p><b>The twist: it only works at scale.</b> This is the paper's most-cited finding (&sect;3.2). On small
       models, prompting for a chain of thought does not help &mdash; the models "produced fluent but illogical
       chains of thought, leading to lower performance than standard prompting." The benefit "only yields performance
       gains when used with models of $\\sim$100B parameters" (B = billion). So chain of thought is an
       <b>emergent ability of model scale</b>: roughly absent below the threshold, useful above it. Plotted as
       accuracy against model size, standard prompting and chain-of-thought prompting track each other for small
       models, then the chain-of-thought curve pulls sharply away as the model grows (Figure 2).</p>`,
    architecture:
      `<p><b>There is no new model architecture in this paper</b> &mdash; the model is an off-the-shelf, frozen
       large language model (a decoder-style Transformer), and chain-of-thought prompting touches only the
       <i>text fed into it</i>. What follows is the <b>procedure</b>: the data flow of building the prompt and
       reading the output, and exactly what differs from standard prompting.</p>
       <p><b>Inputs / components.</b></p>
       <ul>
        <li><b>A frozen language model</b> $p_\\theta$. The paper evaluates several off-the-shelf families &mdash;
        GPT-3 (350M&ndash;175B parameters), LaMDA (422M&ndash;137B), PaLM (8B&ndash;540B), plus UL2&nbsp;20B and Codex
        &mdash; with <b>no fine-tuning</b>. The same model serves standard and chain-of-thought prompting; only the
        prompt differs.</li>
        <li><b>$n$ hand-written exemplars.</b> A human composes $n = 8$ triples $\\langle x, c, y\\rangle$ once
        ($n = 4$ for AQuA), reused for every test question in that benchmark.</li>
       </ul>
       <p><b>Pipeline (per test question), standard vs. chain-of-thought.</b></p>
       <ol>
        <li><b>Build the prompt.</b> Concatenate the $n$ exemplars, then append the query $x_{\\text{query}}$ ending
        in an answer cue (e.g. <code>A:</code>).
          <ul>
           <li><i>Standard:</i> each exemplar is the pair $\\langle x, y\\rangle$ &mdash; question then answer.</li>
           <li><i>Chain-of-thought (the only change):</i> each exemplar is the triple $\\langle x, c, y\\rangle$
           &mdash; question, then the reasoning steps $c$, then answer.</li>
          </ul></li>
        <li><b>Single forward generation.</b> Feed the prompt to $p_\\theta$ and decode greedily (one output, no
        sampling/voting). Under standard prompting the model emits an answer directly; under chain-of-thought it first
        emits its own reasoning $\\hat c$, then the answer $\\hat y$.</li>
        <li><b>Parse the answer.</b> Take the final answer from the end of the generated text. (For arithmetic, an
        external calculator can be applied post-hoc to the equations written in $\\hat c$.)</li>
       </ol>
       <p><b>What changed vs. standard prompting:</b> exactly one thing &mdash; the exemplars carry the middle term $c$,
       so the model is shown (and then imitates) the act of writing intermediate steps before answering. No weights,
       architecture, decoding rule, or training data change. The payoff of that single change is gated by scale
       (&sect;3.2): below $\\sim$100B parameters the generated chains are "fluent but illogical"; above it they become
       reliable enough to raise end-to-end accuracy.</p>`,
    symbols: [
      { sym: "“token”", desc: "a plain term: the unit a language model reads and predicts &mdash; a word or word-piece. The eight exemplars of text are just tokens prepended to your question." },
      { sym: "“in-context learning”", desc: "a plain term: steering a frozen (untrained) model by putting examples of the task in the input text. The model infers the pattern and continues it. No weights change." },
      { sym: "“few-shot prompting”", desc: "a plain term: in-context learning with a small number of examples (each one a &ldquo;shot&rdquo;). This paper uses eight (four for AQuA)." },
      { sym: "“exemplar”", desc: "a plain term: one worked example placed in the prompt. In this paper an exemplar is a <b>triple</b>: an input question, a chain of thought, and the final output answer." },
      { sym: "“chain of thought”", desc: "the paper's term (&sect;2): &ldquo;a series of intermediate natural language reasoning steps that lead to the final output.&rdquo; The model's written-out work, in plain language, before the answer." },
      { sym: "“emergent ability”", desc: "a plain term used by the paper (&sect;3.2): a capability that is essentially absent in small models and appears once the model is large enough &mdash; here, past about 100B (billion) parameters." },
      { sym: "“multi-step reasoning”", desc: "a plain term: a task whose answer requires chaining several intermediate deductions (e.g. a grade-school math word problem), as opposed to a one-step lookup or classification." },
      { sym: "$e$", desc: "our notation for one exemplar: the triple $\\langle x, c, y\\rangle$ placed in the prompt (&sect;2)." },
      { sym: "$x$", desc: "the input &mdash; the task question in an exemplar (and $x_{\\text{query}}$ is the real question you append after the exemplars)." },
      { sym: "$c$", desc: "the chain of thought &mdash; the intermediate natural-language reasoning steps inserted between the question and the answer (&sect;2). $\\hat c$ is the chain the model generates at test time." },
      { sym: "$y$", desc: "the output &mdash; the final answer in an exemplar. $\\hat y$ is the answer the model generates at test time." },
      { sym: "$n$", desc: "the number of exemplars in the prompt: $n = 8$ in the paper, $n = 4$ for the AQuA benchmark (&sect;3.1)." },
      { sym: "$\\Vert$", desc: "string concatenation &mdash; gluing the exemplars and the query together into one prompt." },
      { sym: "$p_\\theta$", desc: "the language model's next-token probability, with frozen parameters $\\theta$. The model maximizes $p_\\theta(c, y \\mid \\text{prompt})$ by greedy decoding; $\\theta$ is never updated (in-context learning, not training)." },
      { sym: "$\\#\\theta$", desc: "the model's parameter count. The emergence finding (&sect;3.2) is that chain of thought helps only once $\\#\\theta \\gtrsim$ 100 billion." },
      { sym: "$\\text{acc}_{\\text{CoT}}, \\text{acc}_{\\text{std}}$", desc: "accuracy with chain-of-thought prompting vs. standard prompting. Their difference is non-positive for small models and positive past the scale threshold (&sect;3.2)." },
      { sym: "$k$", desc: "in OUR toy illustration only (not the paper): the number of intermediate steps a problem decomposes into." },
      { sym: "$p$", desc: "in OUR toy illustration only (not the paper): the probability the model gets one single step right. The whole-problem success is then $p^k$ if every step must be correct." }
    ],
    formula:
      `<p><b>This is an empirical prompting paper: it has essentially no equations.</b> Section&nbsp;2 introduces a
       method, not a derived law &mdash; the only "math" is the <i>structure</i> of an exemplar and of the prompt
       built from exemplars. We formalize that structure here, plus the conditional-generation view and the
       emergence-at-scale finding. None of these is a closed-form result the paper proves; they are notation we use to
       make the method precise.</p>

       $$ e \\;=\\; \\big\\langle\\, x,\\ \\underbrace{c}_{\\text{chain of thought}},\\ y \\,\\big\\rangle \\qquad (\\text{Section 2}) $$
       <p>One chain-of-thought <b>exemplar</b> is a triple: input question $x$, chain of thought $c$ (intermediate
       natural-language reasoning steps), and final output $y$. Standard prompting drops the middle term and uses only
       $\\langle x, y\\rangle$.</p>

       $$ \\text{prompt} \\;=\\; e_1 \\,\\Vert\\, e_2 \\,\\Vert\\, \\cdots \\,\\Vert\\, e_n \\,\\Vert\\, x_{\\text{query}} \\qquad n = 8 \\;\\; (n = 4 \\text{ for AQuA},\\ \\text{Section 3.1}) $$
       <p>The full prompt is $n$ exemplars concatenated ($\\Vert$ = string concatenation), followed by the real
       question $x_{\\text{query}}$ ending in an answer cue. The paper uses $n = 8$ ($n = 4$ for the harder AQuA
       benchmark).</p>

       $$ (\\hat{c},\\ \\hat{y}) \\;=\\; \\arg\\max_{c,\\,y}\\; p_\\theta\\!\\left(c,\\,y \\mid \\text{prompt}\\right) \\qquad (\\text{greedy decoding, Section 3.1}) $$
       <p>Given the prompt, the model with parameters $\\theta$ generates its own chain of thought $\\hat{c}$ and then
       its answer $\\hat{y}$. The paper samples by <b>greedy decoding</b> (take the highest-probability token at each
       step) &mdash; one output per question. Nothing in $\\theta$ is updated; this is in-context learning, not
       training.</p>

       $$ \\text{acc}_{\\text{CoT}}(\\theta) - \\text{acc}_{\\text{std}}(\\theta) \\;\\begin{cases} \\le 0, & \\#\\theta \\ \\lt\\ \\sim\\!100\\text{B} \\\\[2pt] \\gt 0, & \\#\\theta \\ \\gtrsim\\ 100\\text{B} \\end{cases} \\qquad (\\text{emergence, Section 3.2}) $$
       <p>The central empirical finding, written as a sign: the accuracy gain from chain-of-thought prompting over
       standard prompting is non-positive for small models and becomes positive only once the parameter count
       $\\#\\theta$ reaches roughly 100 billion. This is a measured pattern across models, <b>not</b> a proven
       inequality &mdash; it is the paper's "emergent ability of model scale."</p>

       <p><i>The toy-model equation $P = p^{\\,k}$ below (whole-problem success when $k$ steps each succeed with
       probability $p$) is OUR illustration of why decomposition helps &mdash; it is not from the paper.</i></p>`,
    whatItDoes:
      `<p>None of these is a derived law &mdash; this is a prompting result. Each line just states a piece of the
       method in words.</p>
       <ul>
        <li><b>Exemplar $e = \\langle x, c, y\\rangle$ (&sect;2).</b> Read left to right: $x$ is the task question;
        $c$ is the inserted reasoning &mdash; the new part &mdash; written as intermediate natural-language steps;
        $y$ is the final answer. Standard prompting uses only the two ends, $\\langle x, y\\rangle$; chain-of-thought
        prompting keeps the middle term $c$.</li>
        <li><b>The prompt is a concatenation (&sect;3.1).</b> You glue $n$ such triples together, append your real
        input $x_{\\text{query}}$ ending in an answer cue, and let the model continue. $n = 8$ in the paper, $4$ for
        AQuA.</li>
        <li><b>Generation $(\\hat c, \\hat y) = \\arg\\max\\, p_\\theta(c, y \\mid \\text{prompt})$.</b> Having seen the
        pattern, the frozen model (parameters $\\theta$ unchanged) generates its own chain of thought $\\hat c$ then its
        answer $\\hat y$, picking the most-likely token at each step (greedy decoding).</li>
        <li><b>The emergence sign (&sect;3.2).</b> Keeping the middle term $c$ converts a flat reasoning curve into a
        steep one &mdash; but the accuracy gain over standard prompting is positive only once $\\#\\theta \\gtrsim$ 100
        billion parameters. Below that it is zero or negative.</li>
       </ul>`,
    derivation:
      `<p>This is an <b>empirical, behavioral</b> paper: there is no theorem to prove. "Why it is true" here means
       "why decomposing a multi-step problem into written steps should help," argued with a small, explicit toy model
       &mdash; <b>our own illustration, not a result from the paper.</b></p>
       <p><b>Errors compound when steps are hidden.</b> Suppose a problem needs $k$ correct sub-steps, and the final
       answer is right only if <i>every</i> step is right. Model each step as an independent coin flip that lands
       correct with probability $p$. Then the whole-problem success probability is the product</p>
       <p>$$ P(\\text{all } k \\text{ steps correct}) = p^{\\,k}. $$</p>
       <p>With $p = 0.8$ and $k = 4$: $0.8^4 = 0.4096$, about $41\\%$. A model that is right $80\\%$ of the time on
       any single step is right on the whole only $41\\%$ of the time &mdash; because the small per-step error
       <i>compounds</i> across four steps. If it must do all of this silently and emit only the final answer, it has
       one shot at the whole product.</p>
       <p><b>Writing each step out can raise the per-step success.</b> When the model emits each intermediate result
       as text, that result becomes part of the input the next step reads. The model no longer has to hold the entire
       computation implicitly; each step conditions on an explicit, already-written value. If writing the steps lifts
       the per-step success from $p = 0.8$ to, say, $p' = 0.92$, the whole-problem success becomes
       $0.92^4 \\approx 0.716$ &mdash; about $72\\%$, up from $41\\%$. <b>A modest gain per step, compounded over four
       steps, is a large gain on the whole problem.</b></p>
       <p><b>What the toy model captures and what it does not.</b> It captures the qualitative shape of the paper's
       result &mdash; that decomposing a problem into checkable steps can sharply raise end-to-end accuracy. It does
       <b>not</b> explain the emergence finding: the toy model has no notion of model size. The paper's actual finding
       (&sect;3.2) is that small models cannot use the chain (they "produced fluent but illogical chains of thought"),
       so the benefit appears only past about 100B (billion) parameters. The independence and fixed-$p$ assumptions
       here are deliberate simplifications to make the compounding visible, not claims about any real model.</p>`,
    example:
      `<p>Work the toy compounding model by hand (this is <b>our illustration</b>, not a paper number), using
       $k = 4$ steps and a single-step success probability $p = 0.8$.</p>
       <ul class="steps">
        <li><b>One-shot (hidden steps).</b> All four steps must be right and we see only the final answer, so the
        success probability is the product $p^k = 0.8^4$. Compute it step by step:
        $0.8^2 = 0.64$, then $0.64^2 = 0.4096$. So one-shot success $\\approx 0.410$, about <b>41%</b>.</li>
        <li><b>Step-by-step (written chain), same per-step $p$.</b> If writing the steps did <i>not</i> change the
        per-step success, the whole-problem probability would still be $0.8^4 \\approx 0.410$ &mdash; writing alone is
        not magic.</li>
        <li><b>Step-by-step with a higher per-step success.</b> Suppose writing each step out, so the next step
        conditions on an explicit value, lifts the per-step success to $p' = 0.92$. Then whole-problem success is
        $0.92^4$. Compute: $0.92^2 = 0.8464$, then $0.8464^2 \\approx 0.716$. So $\\approx$ <b>72%</b>.</li>
        <li><b>The point.</b> The per-step improvement is modest ($0.80 \\to 0.92$), but compounded over four steps it
        turns a $41\\%$ whole-problem success into $72\\%$. Decomposition plus a small per-step gain is a large
        end-to-end gain. This is the mechanism our CODEVIZ visualizes &mdash; <b>not</b> the paper's measured GSM8K
        accuracy.</li>
       </ul>
       <p>The CODEVIZ recomputes exactly these numbers ($0.8^4$ and $0.92^4$) and sweeps the per-step success $p$ to
       show how the one-shot and step-by-step curves separate. All numbers there are from this toy model.</p>`,
    recipe:
      `<p>This is a read-only paper, so there is no architecture to assemble. Instead, here is the <b>procedure to use
       chain-of-thought prompting</b>, as described in &sect;2&ndash;3.1 &mdash; the recipe you would follow yourself:</p>
       <ol>
        <li><b>Pick a few representative questions</b> from your task (the paper used <b>eight</b>; four for the
        harder AQuA benchmark).</li>
        <li><b>For each, write out the answer with its work</b> &mdash; the intermediate reasoning steps in plain
        natural language &mdash; ending in the final answer. This turns each example into the triple
        $\\langle$input, chain of thought, output$\\rangle$ (&sect;2).</li>
        <li><b>Concatenate the exemplars</b> into one prompt, in the model's expected question/answer format.</li>
        <li><b>Append your real question</b>, ending with the same answer cue (e.g. <code>A:</code>), and let the
        model continue.</li>
        <li><b>Read the model's continuation:</b> it should produce its own chain of thought and then the answer.
        Parse the final answer from the end of the generated text.</li>
        <li><b>Remember the scale caveat (&sect;3.2):</b> expect this to help only for large models ($\\sim$100B,
        billion, parameters and up). On small models the chains are "fluent but illogical" and can hurt.</li>
       </ol>`,
    results:
      `<p><b>From the abstract (quoted):</b> "we show how such reasoning abilities emerge naturally in sufficiently
       large language models via a simple method called chain-of-thought prompting, where a few chain-of-thought
       demonstrations are provided as exemplars in prompting." And: "Experiments on three large language models show
       that chain-of-thought prompting improves performance on a range of arithmetic, commonsense, and symbolic
       reasoning tasks. The empirical gains can be striking."</p>
       <p><b>The headline (quoted, abstract):</b> "prompting a PaLM 540B with just eight chain-of-thought exemplars
       achieves state-of-the-art accuracy on the GSM8K benchmark of math word problems, surpassing even finetuned
       GPT-3 with a verifier." (GSM8K is a benchmark of grade-school math word problems.)</p>
       <p><b>The emergence finding (quoted, &sect;3.2):</b> "chain-of-thought prompting is an emergent ability of
       model scale. That is, chain-of-thought prompting does not positively impact performance for small models, and
       only yields performance gains when used with models of $\\sim$100B parameters." And, on why small models fail,
       they "produced fluent but illogical chains of thought, leading to lower performance than standard prompting."</p>
       <p><b>From the discussion (quoted, &sect;6):</b> "chain-of-thought reasoning is an emergent property of model
       scale that allows sufficiently large language models to perform reasoning tasks that otherwise have flat
       scaling curves."</p>
       <p><b>The benchmarks tested:</b> arithmetic &mdash; GSM8K, SVAMP, ASDiv, AQuA, MAWPS (&sect;3.1); commonsense
       &mdash; CommonsenseQA, StrategyQA, and others (&sect;4); symbolic &mdash; last-letter concatenation and coin
       flip (&sect;5).</p>
       <p><i>These are the paper's own statements, transcribed from the abstract, &sect;3.2, and &sect;6. The numbers
       in the CODEVIZ panel below come from a small toy illustration of step-decomposition &mdash; not the paper's
       measured results, and using no language model.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>read-only</b> paper: a prompting-behavior result, with no model to build, train, or verify.
       There is no PyTorch primitive to reconstruct and no novel module to compose. What you <i>do</i> instead is
       <b>understand and use</b> the method: turn each few-shot example from an $\\langle$input, output$\\rangle$ pair
       into an $\\langle$input, chain of thought, output$\\rangle$ triple, and know that the payoff appears only at
       large scale (&sect;3.2). The optional code below is a tiny <b>conceptual illustration</b> of <i>why</i>
       decomposition can help &mdash; a toy probabilistic model of compounding step errors. It uses made-up
       per-step probabilities to show the <i>shape</i> of the effect; it does <b>not</b> run any language model,
       reproduce GSM8K, or recover the paper's measured numbers.</p>`,
    pitfalls:
      `<ul>
        <li><b>Expecting it to help small models.</b> Chain of thought is an emergent ability (&sect;3.2). On models
        below roughly 100B (billion) parameters it does not help and can hurt &mdash; the chains are "fluent but
        illogical." <b>Fix:</b> read this as a large-model technique; do not generalize the gains to small models.</li>
        <li><b>Confusing the toy compounding model with the paper.</b> Our $p^k$ illustration shows <i>why</i> writing
        steps could help, but it has no notion of model size and is not measured by the paper. <b>Fix:</b> quote the
        paper's emergence finding for "why it needs scale"; use the toy model only for the decomposition intuition.</li>
        <li><b>Thinking the model was trained or fine-tuned.</b> Nothing is trained. Chain-of-thought prompting only
        changes the few-shot examples in the input text (&sect;2). <b>Fix:</b> keep it filed under in-context
        learning, not fine-tuning.</li>
        <li><b>Reporting a benchmark number from memory.</b> The only headline this lesson quotes is the abstract's
        GSM8K / PaLM-540B / eight-exemplar state-of-the-art claim, verbatim. <b>Fix:</b> if you need a specific
        accuracy for another benchmark, read it from the paper's tables &mdash; do not recall it.</li>
        <li><b>Assuming more steps is always safer.</b> Each written step is also a chance to err; if per-step success
        is low, more steps compounds <i>more</i> error. <b>Fix:</b> the benefit comes from raising per-step success
        (clearer, checkable steps), not merely from having steps.</li>
      </ul>`,
    recall: [
      "State the one change chain-of-thought prompting makes to a standard few-shot exemplar (&sect;2).",
      "Define &ldquo;chain of thought&rdquo; in the paper's own terms.",
      "What does it mean that chain of thought is an &ldquo;emergent ability of model scale,&rdquo; and roughly what scale (&sect;3.2)?",
      "How many exemplars did the paper use (and the exception for AQuA)?",
      "In the toy model, write the whole-problem success probability for $k$ steps each at success $p$, and evaluate it for $p=0.8$, $k=4$."
    ],
    practice: [
      {
        q: `<b>Compounding steps.</b> In the toy error model, a problem needs $k$ correct steps, each right with
            probability $p$, and the answer is right only if all steps are right. (a) Whole-problem success for
            $p = 0.9$, $k = 5$? (b) For the same per-step $p = 0.9$, does a 3-step problem or an 8-step problem have a
            higher whole-problem success, and why?`,
        steps: [
          { do: `Use $P = p^k$. For (a): $0.9^5$.`, why: `The answer is correct only if every one of the $k$ independent steps is correct, so the probabilities multiply.` },
          { do: `Compute $0.9^5$: $0.9^2 = 0.81$, $0.9^4 = 0.81^2 = 0.6561$, times $0.9$ gives $\\approx 0.590$.`, why: `Square, square again, then one more factor &mdash; that is five factors of $0.9$.` },
          { do: `Compare exponents: $0.9^3 = 0.729$ vs $0.9^8 \\approx 0.430$. Fewer steps wins.`, why: `Each extra step multiplies by another $p < 1$, so more steps always lowers the product.` }
        ],
        answer: `<p>(a) $0.9^5 \\approx 0.590$, about <b>59%</b>. (b) The <b>3-step</b> problem
                 ($0.9^3 = 0.729$, about $73\\%$) beats the 8-step one ($0.9^8 \\approx 0.430$, about $43\\%$):
                 every additional step multiplies by another factor below 1, so success decays with length. This is
                 why raising <i>per-step</i> accuracy (clearer, checkable steps) matters so much for long problems.
                 (Toy illustration, not a paper number.)</p>`
      },
      {
        q: `<b>The emergence claim.</b> A colleague tries chain-of-thought prompting on a small (1B-parameter)
            model and sees <i>worse</i> accuracy than plain prompting. Is this consistent with the paper? Quote the
            relevant finding and explain what the colleague should change.`,
        steps: [
          { do: `Recall &sect;3.2: chain of thought is "an emergent ability of model scale," helping only at "$\\sim$100B parameters."`, why: `The paper explicitly states the benefit is scale-gated, not universal.` },
          { do: `Recall the small-model failure mode: they "produced fluent but illogical chains of thought, leading to lower performance than standard prompting."`, why: `This predicts exactly the colleague's observation &mdash; worse than plain prompting on a small model.` },
          { do: `Conclude: try a much larger model (around or above 100B parameters); the method is not expected to help at 1B.`, why: `The capability is emergent, so it appears only past the scale threshold.` }
        ],
        answer: `<p>Yes, fully consistent. The paper states chain of thought "is an emergent ability of model scale"
                 and "does not positively impact performance for small models, and only yields performance gains when
                 used with models of $\\sim$100B parameters" (&sect;3.2). Small models "produced fluent but illogical
                 chains of thought, leading to lower performance than standard prompting" &mdash; exactly what the
                 colleague saw. The fix is scale: use a model around or above 100B (billion) parameters. At 1B,
                 the result is expected.</p>`
      },
      {
        q: `<b>Per-step gain vs. more steps (ablation-style).</b> Two strategies for a problem: (A) keep it as a
            single hidden computation with success $p = 0.65$; (B) decompose it into $k = 3$ written steps, which
            raises per-step success to $p' = 0.85$ but now all three must be right. Which strategy wins, and what does
            this say about <i>why</i> chain of thought helps?`,
        steps: [
          { do: `Strategy A success: a single step, so $P_A = 0.65$.`, why: `One hidden computation, one chance, no decomposition.` },
          { do: `Strategy B success: $P_B = p'^k = 0.85^3$. Compute $0.85^2 = 0.7225$, times $0.85 \\approx 0.614$.`, why: `Three independent written steps, all must be correct, so multiply three factors of $0.85$.` },
          { do: `Compare: $0.65$ vs $0.614$. Here A barely wins, because the per-step lift ($0.65 \\to 0.85$) was not big enough to overcome three-way compounding.`, why: `Decomposition only pays off when the per-step accuracy gain outweighs the cost of needing every step right.` }
        ],
        answer: `<p>$P_A = 0.65$; $P_B = 0.85^3 \\approx 0.614$. Strategy A narrowly wins, so a $0.65 \\to 0.85$
                 per-step lift is <i>not</i> enough for three steps. The lesson: chain of thought helps when writing
                 the steps raises per-step accuracy <b>enough</b> to beat the compounding penalty of needing all
                 steps right. If decomposition makes each step much more reliable, the product wins; if the lift is
                 marginal, splitting a problem into more steps can even hurt. (Toy illustration, not the paper's
                 measurement &mdash; the paper's actual gate on "enough" is model scale, &sect;3.2.)</p>`
      }
    ]
  });

  window.CODE["paper-chain-of-thought"] = {
    lib: "NumPy",
    runnable: false,
    explain:
      `<p>This is a <b>read-only</b> paper, so there is no model to train or verify, and this snippet runs <b>no
       language model</b>. It is a tiny <b>conceptual illustration</b> of why decomposing a multi-step problem can
       help. It (1) recomputes the worked example &mdash; one-shot success $0.8^4$ vs. a higher-per-step
       step-by-step success $0.92^4$ &mdash; and (2) sweeps the per-step success $p$ to show the one-shot curve
       ($p^k$ with hidden steps) and the step-by-step curve (same form but with a lifted per-step success).
       Every probability here is MADE UP to expose the compounding mechanism; none is the paper's GSM8K number or
       any measurement. Pure NumPy, CPU, runs in well under a second.</p>`,
    code: `import numpy as np

# ---------------------------------------------------------------------------
# OUR ILLUSTRATION -- NOT the paper's numbers, and NO language model is run.
# Toy model: a problem needs k correct steps; the whole answer is right only
# if EVERY step is right. One step is correct with probability p, so the
# whole-problem success is p ** k (errors compound across steps).
# ---------------------------------------------------------------------------
def whole_problem_success(p, k):
    return p ** k

k = 4                                  # a 4-step problem

# (1) WORKED EXAMPLE from the lesson, recomputed.
p_oneshot = 0.80                       # per-step success, steps hidden
p_written = 0.92                       # writing each step lifts per-step success
print("one-shot   (p=0.80, k=4): %.3f" % whole_problem_success(p_oneshot, k))
print("step-by-step(p=0.92, k=4): %.3f" % whole_problem_success(p_written, k))
# one-shot   (p=0.80, k=4): 0.410
# step-by-step(p=0.92, k=4): 0.716
# A modest per-step gain (0.80 -> 0.92) compounds into 0.41 -> 0.72 on the whole
# problem. (Made-up numbers; illustrates the FORM of the effect, not the paper.)

# (2) SWEEP per-step success p. The step-by-step curve assumes writing the steps
#     out adds a fixed per-step lift (capped at 1.0). Both use the SAME p**k form.
lift = 0.12                            # made-up per-step boost from writing steps
ps   = np.linspace(0.50, 0.99, 6)      # six per-step success values
print("\\n  p_step | one-shot p^k | step-by-step (p+lift)^k")
for p in ps:
    p2 = min(p + lift, 1.0)
    print("   %.2f  |    %.3f     |    %.3f" % (
          p, whole_problem_success(p, k), whole_problem_success(p2, k)))
#   p_step | one-shot p^k | step-by-step (p+lift)^k
#    0.50  |    0.062     |    0.148
#    0.60  |    0.130     |    0.269
#    0.70  |    0.240     |    0.452
#    0.80  |    0.410     |    0.716
#    0.89  |    0.627     |    1.000
#    0.99  |    0.961     |    1.000
# The gap is widest in the middle: that is where lifting per-step accuracy and
# decomposing the problem buys the most. ILLUSTRATION ONLY -- no model, not GSM8K.`
  };

  window.CODEVIZ["paper-chain-of-thought"] = {
    question: "OUR ILLUSTRATION (no language model): if a problem needs k correct steps each solved with probability p, the whole-problem success is p**k. How does writing the steps out -- which we model as a fixed per-step lift -- change the whole-problem success as p varies? This visualizes WHY decomposition can help; it is NOT the paper's GSM8K number.",
    charts: [
      {
        type: "line",
        title: "Whole-problem success vs. per-step success (k=4) — one-shot vs. step-by-step (OUR ILLUSTRATION, not the paper's numbers)",
        xlabel: "per-step success probability p  [toy, made-up]",
        ylabel: "whole-problem success = p^k  [k=4 steps]",
        series: [
          {
            name: "one-shot: hidden steps, success p^4",
            color: "#ff7b72",
            points: [[0.50,0.0625],[0.60,0.1296],[0.70,0.2401],[0.80,0.4096],[0.89,0.6274],[0.99,0.9606]]
          },
          {
            name: "step-by-step: per-step lift +0.12, success (p+0.12)^4 (capped)",
            color: "#7ee787",
            points: [[0.50,0.1478],[0.60,0.2687],[0.70,0.4521],[0.80,0.7164],[0.89,1.0000],[0.99,1.0000]]
          }
        ]
      }
    ],
    caption: "OUR small illustration -- NOT the paper's measured result, and NO language model is run. A problem decomposes into k=4 steps; if every step must be right and one step is right with probability p, the whole-problem success is p^4 (red, one-shot with hidden steps). We model writing the steps out as a fixed per-step lift of +0.12 (capped at 1.0), giving (p+0.12)^4 (green, step-by-step). Recomputed in NumPy: at p=0.80 the one-shot success is 0.8^4=0.410 and the step-by-step is 0.92^4=0.716; the green curve sits above the red everywhere and the gap is widest in the mid-range, where a per-step gain buys the most after compounding over four steps. This is the qualitative reason the paper gives for chain-of-thought helping -- decomposing a hard problem into checkable steps (Section 1). It is NOT the paper's GSM8K / PaLM-540B accuracy, which is an emergent-at-scale result measured on real models (Section 3.2) and not reproduced here.",
    code: `import numpy as np

# OUR ILLUSTRATION -- no language model, NOT the paper's numbers.
# whole-problem success = p**k  (all k steps must be right; one step right w.p. p)
k = 4
lift = 0.12                                  # made-up per-step boost from writing
p = np.array([0.50, 0.60, 0.70, 0.80, 0.89, 0.99])

oneshot     = p ** k
stepbystep  = np.minimum(p + lift, 1.0) ** k

print(" p_step | one-shot p^k | step-by-step (p+lift)^k")
for pi, a, b in zip(p, oneshot, stepbystep):
    print("  %.2f  |    %.4f    |    %.4f" % (pi, a, b))
print("\\nworked example: 0.8^4 = %.3f,  0.92^4 = %.3f" % (0.8**4, 0.92**4))
#  p_step | one-shot p^k | step-by-step (p+lift)^k
#   0.50  |    0.0625    |    0.1478
#   0.60  |    0.1296    |    0.2687
#   0.70  |    0.2401    |    0.4521
#   0.80  |    0.4096    |    0.7164
#   0.89  |    0.6274    |    1.0000
#   0.99  |    0.9606    |    1.0000
#
# worked example: 0.8^4 = 0.410,  0.92^4 = 0.716
# The step-by-step curve dominates; the gap is widest mid-range. ILLUSTRATION
# ONLY -- this is the decomposition INTUITION, not the paper's measured accuracy.`
  };
})();
