/* Paper lesson — "Language Models are Few-Shot Learners" (GPT-3),
   Brown, Mann, Ryder, Subbiah, Kaplan, ... , Sutskever, Amodei (OpenAI, 2020).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-gpt3".
   GROUNDED from arXiv:2005.14165 (abstract) and the ar5iv HTML mirror:
   the Abstract (175B params, "without any gradient updates or fine-tuning");
   Section 1 (Introduction) — meta-learning / in-context learning framing,
   Figure 1.1 and Figure 1.2 ("Larger models make increasingly efficient use of
   in-context information"; "remove random symbols from a word"); Section 2
   (Approach) — the Zero-Shot / One-Shot / Few-Shot definitions; Section 2.1
   (Model and Architectures) — "same model and architecture as GPT-2",
   autoregressive, K typically 10 to 100 in the 2048-token context window.
   Track: read-only (a pure-scale / emergent-behavior result). NO from-scratch
   model. The CODEVIZ is OUR OWN tiny conceptual in-context-learning demo on a
   toy rule — clearly labeled "our small run, not the paper's number." */
(function () {
  window.LESSONS.push({
    id: "paper-gpt3",
    title: "GPT-3 — Language Models are Few-Shot Learners (2020)",
    tagline: "Scale a language model to 175 billion parameters and it learns new tasks from a few in-prompt examples — with no weight updates.",
    module: "Papers · Transformers & LLMs",
    track: "read-only",
    paper: {
      authors: "Tom B. Brown, Benjamin Mann, Nick Ryder, Melanie Subbiah, Jared Kaplan, Prafulla Dhariwal, Arvind Neelakantan, Pranav Shyam, Girish Sastry, Amanda Askell, Sandhini Agarwal, Ariel Herbert-Voss, Gretchen Krueger, Tom Henighan, Rewon Child, Aditya Ramesh, Daniel M. Ziegler, Jeffrey Wu, Clemens Winter, Christopher Hesse, Mark Chen, Eric Sigler, Mateusz Litwin, Scott Gray, Benjamin Chess, Jack Clark, Christopher Berner, Sam McCandlish, Alec Radford, Ilya Sutskever, Dario Amodei",
      org: "OpenAI",
      year: 2020,
      venue: "arXiv:2005.14165 (May 2020); NeurIPS 2020",
      citations: "",
      arxiv: "https://arxiv.org/abs/2005.14165",
      code: ""
    },
    conceptLink: "fs-in-context",
    partOf: [],
    prereqs: ["fs-in-context", "fs-few-shot", "fs-zero-shot", "fs-meta-learning", "dl-language-model", "paper-transformer", "paper-gpt", "paper-scaling-laws"],

    // WHY READ IT
    problem:
      `<p>Before this paper, the standard recipe for a new natural-language task had two steps. First,
       <b>pre-train</b> a large model on a big pile of text (let it learn general language by predicting the next
       word over and over). Second, <b>fine-tune</b> it: collect a labeled dataset for your specific task and run
       more training to adjust the model's weights for that task. A <b>weight</b> (also called a parameter) is one
       of the millions of tunable numbers inside the network; <b>fine-tuning</b> changes those numbers using
       <b>gradient updates</b> &mdash; small nudges computed from labeled examples.</p>
       <p>The trouble, as the paper's abstract puts it, is that fine-tuning "still requires task-specific
       fine-tuning datasets of thousands or tens of thousands of examples." That is expensive, and it is unlike how
       people work: "humans can generally perform a new language task from only a few examples or from simple
       instructions." (Abstract.) Every new task meant a new labeled dataset and a new round of training.</p>
       <p>This paper asks a measurable question: <b>if you make the model big enough, can it perform a brand-new
       task from just a few examples shown in the prompt &mdash; with no fine-tuning and no weight changes at
       all?</b> A <b>prompt</b> is simply the text you feed the model at use time. The answer, the paper argues, is
       largely yes &mdash; and the bigger the model, the more true it becomes.</p>`,
    contribution:
      `<ul>
        <li><b>In-context learning at scale.</b> The paper shows that a large enough language model can do a new
        task when the task description and a handful of worked examples are placed in its <b>prompt</b> &mdash; and
        crucially, "GPT-3 is applied without any gradient updates or fine-tuning, with tasks and few-shot
        demonstrations specified purely via text interaction with the model." (Abstract.) The model's weights never
        change; it adapts only by <i>reading</i> the prompt.</li>
        <li><b>One concrete artifact: GPT-3, 175 billion parameters.</b> "we train GPT-3, an autoregressive
        language model with 175 billion parameters, 10x more than any previous non-sparse language model."
        (Abstract.) <b>Autoregressive</b> means it generates text one token at a time, each token conditioned on
        all the tokens before it. The architecture is "the same model and architecture as GPT-2." (&sect;2.1.)</li>
        <li><b>Scale improves in-context learning.</b> The headline empirical finding: "Larger models make
        increasingly efficient use of in-context information." (Figure 1.2.) Bigger models do not just score higher;
        their <i>ability to learn a task from the prompt</i> grows with size.</li>
      </ul>`,
    whyItMattered:
      `<p>This paper reframed what a trained language model <i>is</i>. Before it, a model was a fixed function you
       specialized per task by retraining. After it, a single frozen model became a general-purpose engine you
       steer with <b>prompts</b> &mdash; the foundation of the "prompt a big model" workflow that powers modern
       assistants. The practical payoff: to try a new task you write a few examples in text, not collect a labeled
       dataset and launch a training job.</p>
       <p>It also gave scale a clear purpose. The companion Scaling Laws result (Kaplan et al., 2020) had shown
       loss falls predictably with size; GPT-3 showed that one concrete <i>capability</i> &mdash; learning from the
       prompt &mdash; strengthens with size too. That argument is what justified building models at the hundreds-of-
       billions scale. The lasting idea: <b>a sufficiently large language model can pick up a new task from a few
       in-prompt examples, with no weight updates &mdash; and this ability is itself a function of scale.</b></p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>Abstract</b> &mdash; the thesis in five sentences: scale improves few-shot performance; GPT-3 is
        175 billion parameters; it is applied "without any gradient updates or fine-tuning." Memorize this framing.</li>
        <li><b>&sect;1 (Introduction), with Figures 1.1 and 1.2</b> &mdash; the <b>meta-learning</b> /
        <b>in-context learning</b> picture. Figure 1.2 is the key plot: in-context learning on a toy task
        ("remove random symbols from a word"), and how the learning curve gets <i>steeper</i> for larger models.</li>
        <li><b>&sect;2 (Approach)</b> &mdash; the exact definitions of <b>zero-shot</b>, <b>one-shot</b>, and
        <b>few-shot</b>, and the repeated insistence that "no weight updates are allowed" in any of them.</li>
        <li><b>&sect;2.1 (Model and Architectures)</b> &mdash; GPT-3 is "the same model and architecture as GPT-2";
        few-shot uses K examples (typically 10 to 100) that fit the 2048-token context window.</li>
       </ul>
       <p><b>Skim:</b> the long &sect;3 (Results) benchmark-by-benchmark tables, &sect;5 (Limitations), and &sect;6
       (Broader Impacts) &mdash; important, but not needed to grasp the core idea. You do <b>not</b> implement this
       paper; it is a scale / emergent-behavior result. Read it for the in-context-learning framing and the
       size-vs-ability trend.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Here is the setup the paper studies. You have one frozen language model. You want it to do a task it was
       never trained on &mdash; say, dropping a stray symbol out of a word. You will <i>not</i> change any weights.
       Your only lever is what you put in the <b>prompt</b> (the text you feed it).</p>
       <p>Guess before reading on: as you add more worked examples of the task into the prompt &mdash; zero, then
       one, then ten &mdash; what happens to accuracy? And does your guess about the <i>shape</i> of that curve
       depend on the model's size? Write one sentence. (Hint: the paper's title is "Few-Shot Learners," and Figure
       1.2 is titled "Larger models make increasingly efficient use of in-context information.")</p>`,
    attempt:
      `<p>This is a read-only paper, so there is nothing to build from scratch. Instead, fix the vocabulary before
       the reveal &mdash; these are the paper's own settings from &sect;2:</p>
       <ul>
        <li><b>Zero-shot:</b> the prompt has the task <i>description</i> only, and <b>no</b> examples. Write what
        the model has to go on.</li>
        <li><b>One-shot:</b> the prompt has the description plus exactly <b>one</b> worked example.</li>
        <li><b>Few-shot:</b> the prompt has the description plus <b>K</b> worked examples (the paper uses K from
        about 10 to 100). In all three, <b>no weight updates happen</b> &mdash; the model only reads.</li>
        <li>TODO: predict the order of the three accuracies (zero vs one vs few) for a simple rule, and explain in
        one sentence why "no weight updates" makes this <i>in-context</i> learning, not ordinary training.</li>
       </ul>
       <p>The CODEVIZ panel below runs a tiny toy version of exactly this &mdash; a frozen rule-matcher that infers
       a "drop the symbol" rule from K prompt examples, with no weights changing &mdash; so you can watch accuracy
       climb with K. It is clearly labeled as <i>our</i> small illustration, not the paper's measured numbers.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The paper's core idea is a shift in <i>how you use</i> a trained model. Normally you adapt a model by
       <b>fine-tuning</b>: feed it labeled examples and run gradient updates that change its weights. GPT-3 instead
       does <b>in-context learning</b>: you leave the weights frozen and supply the task entirely through the
       <b>prompt</b> &mdash; a description and, optionally, a few examples written as text. The model "learns" the
       task only in the sense of recognizing the pattern in its context and continuing it. Section 1 names this:
       the model uses its "abilities at inference time to rapidly adapt to or recognize the desired task," and the
       paper calls this inner process "in-context learning."</p>
       <p><b>The meta-learning picture (Figure 1.1).</b> During ordinary pre-training, the model is only ever asked
       to predict the next token over a huge corpus. The paper's framing (&sect;1) is that, in doing so, "a language
       model develops a broad set of skills and pattern recognition abilities." Many spans of natural text already
       look like little tasks &mdash; a list of "French: ... English: ..." pairs, a few arithmetic lines, a column
       of word-correction pairs. Predicting the next token in such spans is, implicitly, practice at picking up a
       task from context. At use time, the model puts that practiced ability to work.</p>
       <p><b>The three settings (&sect;2).</b> The paper defines a ladder by how many demonstrations <b>K</b> sit in
       the prompt. A <b>demonstration</b> is one input-output example of the task, written as text.</p>
       <ul>
        <li><b>Zero-shot (K = 0):</b> "no demonstrations are allowed, and the model is only given a natural
        language instruction describing the task." The model must do the task from the description alone.</li>
        <li><b>One-shot (K = 1):</b> "only one demonstration is allowed, in addition to a natural language
        description of the task."</li>
        <li><b>Few-shot (K examples):</b> "the model is given a few demonstrations of the task at inference time as
        conditioning, but no weight updates are allowed." K is "as many as fit in the model's context window,"
        typically 10 to 100 (the window is 2048 tokens).</li>
       </ul>
       <p><b>The non-negotiable rule.</b> In every setting, the abstract is emphatic: GPT-3 "is applied without any
       gradient updates or fine-tuning." No backpropagation, no parameter change. The demonstrations are
       <b>conditioning</b> &mdash; extra text the model reads &mdash; not training data. This is what separates
       in-context learning from few-shot fine-tuning, where weights <i>would</i> change.</p>
       <p><b>Where scale comes in (Figure 1.2).</b> The paper's central trend: the benefit of adding in-context
       examples grows with model size. The figure plots accuracy on a toy task ("remove random symbols from a
       word") against the number K of in-context examples, for models of different sizes. Larger models have
       <i>steeper</i> curves: "The steeper in-context learning curves for large models demonstrate improved ability
       to learn a task from contextual information." (Figure 1.2.) In the paper's one-line summary: "Larger models
       make increasingly efficient use of in-context information."</p>
       <p><b>Why this is "few-shot learning" without learning new weights.</b> Read "few-shot learner" carefully:
       the model performs a task from a few examples, but those examples teach it nothing permanent. Show it a
       different task next prompt and the same frozen weights handle that one instead. The "learning" lives in the
       forward pass over the prompt, not in the weights &mdash; which is exactly why no gradient updates are
       needed.</p>`,
    architecture:
      `<p>GPT-3 introduces <b>no new architecture</b>: it is "the same model and architecture as GPT-2"
       (&sect;2.1), a <b>decoder-only (autoregressive) Transformer</b>. The paper inherits GPT-2's "modified
       initialization, pre-normalization, and reversible tokenization," with one change to attention. The whole
       contribution is what happens when you scale that architecture up to 175 billion parameters.</p>
       <p><b>One block (repeated $L$ times).</b> Each Transformer block has two sub-layers, each wrapped in a
       residual connection with <b>pre-normalization</b> (LayerNorm applied to the input of each sub-layer):</p>
       <ul>
        <li><b>Masked multi-head self-attention</b> over the previous tokens (causal mask, so position $t$ can only
        see positions $\\le t$ &mdash; this is what makes it autoregressive). The block uses $n_{\\text{heads}}$
        heads, each of dimension $d_{\\text{head}}$.</li>
        <li><b>Position-wise feed-forward network</b> of width $d_{\\text{ff}} = 4 \\times d_{\\text{model}}$
        (&sect;2.1: "the feedforward layer four times the size of the bottleneck layer").</li>
       </ul>
       <p><b>Attention pattern (the one architectural tweak).</b> "we use <b>alternating dense and locally banded
       sparse attention patterns</b> in the layers of the transformer, similar to the Sparse Transformer" (&sect;2.1).
       So some layers attend densely to all previous tokens; others use a banded/sparse pattern that attends only to
       a local window &mdash; alternating layer by layer, which keeps long-context attention affordable.</p>
       <p><b>Data flow.</b> token ids &rarr; token embedding $W_e$ + learned positional embedding $W_p$ &rarr; a stack
       of $L$ identical blocks (attention then feed-forward, each residual + pre-norm) &rarr; final LayerNorm &rarr;
       project to the vocabulary with the tied embedding $W_e$ &rarr; softmax over the next token. Context window
       $n_{\\text{ctx}} = 2048$ tokens for every model.</p>
       <p><b>The GPT-3 family &mdash; Table 2.1</b> ("Sizes, architectures, and learning hyper-parameters... All
       models were trained for a total of 300 billion tokens"). Eight sizes span three orders of magnitude, from
       125M to 175B parameters:</p>
       <table class="arch">
        <thead><tr><th>Model</th><th>$n_{\\text{params}}$</th><th>$n_{\\text{layers}}$</th><th>$d_{\\text{model}}$</th><th>$n_{\\text{heads}}$</th><th>$d_{\\text{head}}$</th><th>batch</th><th>learning rate</th></tr></thead>
        <tbody>
         <tr><td>GPT-3 Small</td><td>125M</td><td>12</td><td>768</td><td>12</td><td>64</td><td>0.5M</td><td>$6.0\\times10^{-4}$</td></tr>
         <tr><td>GPT-3 Medium</td><td>350M</td><td>24</td><td>1024</td><td>16</td><td>64</td><td>0.5M</td><td>$3.0\\times10^{-4}$</td></tr>
         <tr><td>GPT-3 Large</td><td>760M</td><td>24</td><td>1536</td><td>16</td><td>96</td><td>0.5M</td><td>$2.5\\times10^{-4}$</td></tr>
         <tr><td>GPT-3 XL</td><td>1.3B</td><td>24</td><td>2048</td><td>24</td><td>128</td><td>1M</td><td>$2.0\\times10^{-4}$</td></tr>
         <tr><td>GPT-3 2.7B</td><td>2.7B</td><td>32</td><td>2560</td><td>32</td><td>80</td><td>1M</td><td>$1.6\\times10^{-4}$</td></tr>
         <tr><td>GPT-3 6.7B</td><td>6.7B</td><td>32</td><td>4096</td><td>32</td><td>128</td><td>2M</td><td>$1.2\\times10^{-4}$</td></tr>
         <tr><td>GPT-3 13B</td><td>13.0B</td><td>40</td><td>5140</td><td>40</td><td>128</td><td>2M</td><td>$1.0\\times10^{-4}$</td></tr>
         <tr><td>GPT-3 175B</td><td>175.0B</td><td>96</td><td>12288</td><td>96</td><td>128</td><td>3.2M</td><td>$0.6\\times10^{-4}$</td></tr>
        </tbody>
       </table>
       <p>Reading the flagship row: <b>GPT-3 175B</b> stacks $n_{\\text{layers}} = 96$ blocks, with hidden width
       $d_{\\text{model}} = 12288$, $n_{\\text{heads}} = 96$ attention heads each of size $d_{\\text{head}} = 128$
       (note $96 \\times 128 = 12288 = d_{\\text{model}}$), and a feed-forward width $d_{\\text{ff}} = 4 \\times 12288
       = 49152$. ($d_{\\text{model}}$ is the width of each "bottleneck" layer; $d_{\\text{head}}$ is the dimension of
       each attention head; values are transcribed verbatim from Table 2.1, including the 13B row's printed $5140$.)
       The model is partitioned across GPUs "along both the depth and width dimension" (&sect;2.1) to fit.</p>`,
    symbols: [
      { sym: "$\\mathcal{L}(\\theta)$", desc: "the <b>training objective</b> &mdash; the total log-likelihood the model maximizes over the corpus. Larger means the model assigns higher probability to the real next tokens. This is the only training signal (next-token prediction)." },
      { sym: "$\\theta$", desc: "the full set of model <b>parameters (weights)</b> &mdash; 175 billion numbers for GPT-3 (Table 2.1). Training adjusts $\\theta$; in-context learning leaves $\\theta$ <b>frozen</b>." },
      { sym: "$u_t$", desc: "the <b>token at position $t$</b> in a text sequence. $u_{\\lt t}$ (written $u_1,\\ldots,u_{t-1}$) is all the tokens before it; the model predicts $u_t$ from them." },
      { sym: "$T$", desc: "the <b>length</b> (number of tokens) of the training sequence the sum runs over." },
      { sym: "$p_{\\theta}(u_t \\mid u_{\\lt t})$", desc: "the <b>probability the model assigns to the next token</b> $u_t$ given all previous tokens, using its current weights $\\theta$. Computed by a softmax over the vocabulary." },
      { sym: "$h_t^{(\\ell)}$", desc: "the <b>hidden state</b> (a $d_{\\text{model}}$-dimensional vector) for position $t$ after Transformer block $\\ell$. $h_t^{(0)}$ is the input embedding; $h_t^{(L)}$ is the final layer's output, projected to the vocabulary." },
      { sym: "$W_e,\\; W_p$", desc: "the <b>token embedding matrix</b> $W_e$ (maps each token id to a vector, and is reused/tied to project back to vocabulary logits) and the learned <b>positional embedding</b> $W_p$ (adds a vector for the token's position)." },
      { sym: "$L$ (= $n_{\\text{layers}}$)", desc: "the <b>number of stacked Transformer blocks</b>. $L = 96$ for GPT-3 175B; ranges from 12 (Small) to 96 (175B) across the family (Table 2.1)." },
      { sym: "$d_{\\text{model}}$", desc: "the <b>hidden width</b> &mdash; the size of each token's vector inside the network (the \"bottleneck\" layer). $12288$ for GPT-3 175B (Table 2.1)." },
      { sym: "$n_{\\text{heads}},\\; d_{\\text{head}}$", desc: "the <b>number of attention heads</b> and the <b>dimension of each head</b>. For GPT-3 175B: $96$ heads of size $128$ (and $96 \\times 128 = d_{\\text{model}}$) (Table 2.1)." },
      { sym: "$d_{\\text{ff}}$", desc: "the <b>width of the feed-forward sub-layer</b> inside each block, set to $4 \\times d_{\\text{model}}$ (&sect;2.1)." },
      { sym: "$n_{\\text{ctx}}$", desc: "the <b>context window</b> &mdash; the maximum number of tokens the model can attend to at once: $2048$ for every GPT-3 size (&sect;2.1). This bounds how many demonstrations few-shot can fit." },
      { sym: "$x_{\\text{query}},\\; \\hat{y}$", desc: "the <b>new input</b> to be answered and the model's <b>predicted output</b> (its highest-probability continuation given the prompt)." },
      { sym: "<b>token</b>", desc: "the atomic unit of text the model reads and predicts &mdash; a word or word-piece. GPT-3's context window holds 2048 tokens (&sect;2.1)." },
      { sym: "<b>parameter (weight)</b>", desc: "one of the network's tunable numbers. GPT-3 has 175 billion of them (Abstract). In-context learning leaves every one of them <b>unchanged</b>." },
      { sym: "<b>autoregressive language model</b>", desc: "a model that generates text one token at a time, each token conditioned on all previous tokens. GPT-3 is autoregressive; its job is next-token prediction (&sect;2.1)." },
      { sym: "<b>prompt</b>", desc: "the text fed to the model at use time. In this paper it carries the task description and any demonstrations &mdash; it is the only channel through which the task is specified." },
      { sym: "<b>demonstration</b>", desc: "one worked input-output example of the task, written as text inside the prompt. The count of demonstrations is $K$." },
      { sym: "$K$", desc: "the <b>number of demonstrations</b> placed in the prompt. $K = 0$ is zero-shot, $K = 1$ is one-shot, $K$ between roughly 10 and 100 is few-shot (&sect;2), bounded by the 2048-token context window." },
      { sym: "<b>in-context learning</b>", desc: "the paper's term (&sect;1) for adapting to a task purely by reading the prompt at inference time &mdash; recognizing the pattern in the context and continuing it &mdash; with <b>no weight updates</b>." },
      { sym: "<b>fine-tuning</b>", desc: "the contrasting method: adapting a model by running gradient updates on a labeled dataset, which <i>changes</i> its weights. GPT-3 deliberately does <b>not</b> do this for the tasks it is evaluated on (Abstract)." },
      { sym: "<b>gradient update</b>", desc: "a small change to a weight computed from a labeled example via backpropagation. The repeated phrase in this paper is that few-shot involves \"no gradient updates\" &mdash; none of these happen." },
      { sym: "<b>zero-shot / one-shot / few-shot</b>", desc: "the three evaluation settings (&sect;2), distinguished only by $K$ = 0, 1, or many demonstrations in the prompt. All three forbid weight updates." }
    ],
    formula: `$$ \\mathcal{L}(\\theta) \\;=\\; \\sum_{t=1}^{T} \\log p_{\\theta}\\!\\left(u_t \\,\\mid\\, u_{t-1}, u_{t-2}, \\ldots, u_1\\right) $$
       <p class="cap">The <b>autoregressive language-modeling objective</b> the model is trained on (the standard GPT / GPT-2 objective, &sect;2.1: "the same model and architecture as GPT-2"). Maximize, over parameters $\\theta$, the sum over positions $t$ of the log-probability the model assigns to the actual next token $u_t$ given all the tokens before it. This is the <i>only</i> training signal &mdash; predict the next token, over and over, across the corpus (about 300 billion tokens, Table 2.1).</p>

       $$ p_{\\theta}(u_t \\mid u_{\\lt t}) \\;=\\; \\operatorname{softmax}\\!\\big(W_e\\, h_t^{(L)}\\big), \\qquad h_t^{(0)} = W_e\\,u_t + W_p[t], \\quad h^{(\\ell)} = \\text{TransformerBlock}_{\\ell}\\!\\big(h^{(\\ell-1)}\\big) $$
       <p class="cap">How that next-token probability is computed (decoder-only Transformer, &sect;2.1): embed each token and its position, pass through $L$ stacked Transformer blocks, then project the final hidden state $h_t^{(L)}$ back to the vocabulary with the tied embedding matrix $W_e$ and a softmax. $L = 96$ blocks for the 175B model (Table 2.1).</p>

       $$ \\text{output} \\;=\\; \\text{GPT-3}\\big(\\,\\underbrace{\\text{task description}}_{\\text{instruction}} \\;,\\; \\underbrace{(x_1, y_1),\\,\\ldots\\,,(x_K, y_K)}_{K\\ \\text{demonstrations}} \\;,\\; \\underbrace{x_{\\text{query}}}_{\\text{the new input}}\\,\\big) $$
       <p class="cap">The <b>in-context learning</b> formalization (&sect;2). The prediction for a new input is a single forward pass over a prompt that concatenates an instruction, $K$ demonstration pairs, and the query &mdash; the same trained $\\theta$, never modified.</p>

       $$ \\hat{y} \\;=\\; \\arg\\max_{y}\\; p_{\\theta}\\!\\left(y \\,\\mid\\, \\text{task description},\\; (x_1,y_1),\\ldots,(x_K,y_K),\\; x_{\\text{query}}\\right) \\qquad (\\theta \\text{ frozen}) $$
       <p class="cap">The same protocol as a conditional probability: the answer is the highest-probability continuation given the description, the $K$ demonstrations, and the query &mdash; all as conditioning text. Crucially $\\theta$ is <b>frozen</b> (&sect;2: "no weight updates are allowed").</p>

       $$ K = 0 \\;\\Rightarrow\\; \\text{zero-shot} \\qquad K = 1 \\;\\Rightarrow\\; \\text{one-shot} \\qquad K \\in [10, 100] \\;\\Rightarrow\\; \\text{few-shot} \\qquad (\\text{weights frozen throughout}) $$
       <p class="cap">The three settings (&sect;2) differ only by the count $K$ of demonstrations in the prompt, bounded by the $n_{\\text{ctx}} = 2048$-token context window. No setting allows a gradient update.</p>`,
    whatItDoes:
      `<p><b>The training objective $\\mathcal{L}(\\theta)$.</b> In words: go through the corpus token by token, and
       for each position add up the log of the probability the model gave to the token that <i>actually</i> came
       next. Maximizing that sum means "make the real next token as likely as possible, everywhere." That single
       objective &mdash; next-token prediction &mdash; is all GPT-3 is trained on. The forward-pass equation says
       <i>how</i> that probability is produced: embed the tokens and their positions, push them through $L$ stacked
       Transformer blocks, and softmax the last hidden state over the vocabulary.</p>
       <p><b>The in-context protocol.</b> The remaining equations are not something to solve &mdash; they describe the
       <b>protocol</b>, in the paper's own terms (&sect;2). They say: the model's prediction for a new input
       $x_{\\text{query}}$ is produced
       by a single forward pass over a prompt that concatenates the task description, $K$ demonstration pairs
       $(x_i, y_i)$, and the query. The integer $K$ is the only knob that distinguishes zero-, one-, and few-shot.</p>
       <p>The load-bearing phrase is "<b>weights frozen throughout</b>." Contrast it with fine-tuning, where you
       would instead compute $\\nabla_{\\theta} \\mathcal{L}$ &mdash; the gradient of a loss with respect to the
       parameters $\\theta$ &mdash; and step the weights. Here there is no loss, no gradient, no step. The
       demonstrations enter only as text the model conditions on. That is what makes the whole thing
       <b>in-context</b> learning: all adaptation happens inside one forward pass and vanishes when the prompt
       changes.</p>`,
    derivation:
      `<p>This is an <b>empirical / scale</b> paper, so there is no equation derived from first principles. What
       there <i>is</i> to make precise is <b>why reading examples can substitute for training</b> &mdash; the
       conceptual argument behind in-context learning &mdash; and what the size trend means.</p>
       <p><b>Why a frozen model can adapt from the prompt.</b> An autoregressive language model computes, for the
       next token, a probability conditioned on <i>everything</i> in its context: $p(\\text{next} \\mid
       \\text{prompt})$. If the prompt already contains several lines of the form "input &rarr; output, input
       &rarr; output," then continuing the pattern &mdash; emitting the output that fits the latest input &mdash; is
       just high-probability next-token prediction. The model was trained to be good at exactly that, on a corpus
       full of such patterned text. So no new training is needed at use time: the demonstrations reshape the
       <i>conditioning</i>, which reshapes the prediction. Section 1 frames this as the model having "developed a
       broad set of skills and pattern recognition abilities" during pre-training that it now "rapidly adapts" with.</p>
       <p><b>Why no weights change.</b> Fine-tuning changes $\\theta$ by $\\theta \\leftarrow \\theta - \\eta\\,
       \\nabla_{\\theta}\\mathcal{L}$ (a gradient step with learning rate $\\eta$). In-context learning performs no
       such step: the same $\\theta$ that handles a translation prompt handles an arithmetic prompt next. The
       "learning" is the change in the conditional distribution as the context fills with examples &mdash; not a
       change in $\\theta$. This is why the abstract can promise "no gradient updates or fine-tuning."</p>
       <p><b>What the size trend asserts.</b> The paper does not <i>derive</i> that bigger is better at this; it
       <i>measures</i> it. Figure 1.2's claim is about the <b>slope</b> of accuracy-versus-K: larger models have a
       steeper climb as K grows, so each extra in-context example buys more. The honest reading is empirical &mdash;
       a robust observed trend across model sizes, not a theorem.</p>`,
    example:
      `<p>Walk the protocol by hand on the paper's own toy flavor &mdash; "remove random symbols from a word"
       (Figure 1.2). Take the simple rule: the input is a letter followed by a stray symbol, and the correct output
       drops the symbol. So <code>a#</code> &rarr; <code>a</code>. The model's weights never change; only the
       prompt does.</p>
       <ul class="steps">
        <li><b>Zero-shot (K = 0).</b> Prompt: just the instruction, e.g. "Remove the symbol from the word:" then
        the query <code>a#</code>. The model has <i>seen no example of the mapping</i>. With nothing to pattern-match,
        a plausible default is to echo the input &mdash; so it is likely to answer <code>a#</code>, which is wrong.
        Accuracy here is essentially a guess.</li>
        <li><b>One-shot (K = 1).</b> Prompt: the instruction, one demonstration like "<code>b@</code> &rarr;
        <code>b</code>", then the query <code>a#</code>. Now there is a single pattern to copy. If the query shares
        structure with the demonstration, the model can imitate "drop the trailing non-letter" and answer
        <code>a</code>. But one example may not cover every symbol it later sees, so accuracy is partial.</li>
        <li><b>Few-shot (K large).</b> Prompt: the instruction plus several demonstrations covering different
        symbols &mdash; "<code>b@</code> &rarr; <code>b</code>", "<code>c#</code> &rarr; <code>c</code>",
        "<code>d*</code> &rarr; <code>d</code>", ... &mdash; then the query. With the rule demonstrated across cases,
        the pattern is unambiguous and accuracy climbs toward correct.</li>
        <li><b>The trend.</b> Accuracy rises with K: roughly nothing at K = 0, partial at K = 1, high once K covers
        the cases. That monotone climb &mdash; with the weights frozen &mdash; is in-context learning, and Figure
        1.2's point is that the climb is <i>steeper</i> for larger models.</li>
       </ul>
       <p>The CODEVIZ below runs this exact toy: a frozen rule-matcher with no weight updates, scored at K = 0, 1,
       2, 4, 8, 16. Our run gives accuracy 0.000 at K = 0, 0.325 at K = 1, and 0.952 at K = 16 &mdash; the climbing
       in-context curve. Those are <b>our small-scale numbers, not the paper's reported results.</b></p>`,
    recipe:
      `<p>This is a read-only paper &mdash; no <i>novel</i> architecture to assemble (GPT-3 is "the same model and
       architecture as GPT-2," &sect;2.1; see the Architecture section for the decoder-only Transformer it scales up).
       Instead, here is the <b>evaluation protocol</b> the paper uses to test in-context learning &mdash; the recipe
       you would follow yourself:</p>
       <ol>
        <li><b>Freeze the model.</b> Take a single pre-trained autoregressive language model and make <i>no</i>
        further weight changes. Every setting below uses the same frozen weights.</li>
        <li><b>Pick a task and write demonstrations</b> as plain input-output text pairs $(x_i, y_i)$.</li>
        <li><b>Build the prompt</b> by concatenating: a natural-language task description, then $K$ demonstrations,
        then the query input $x_{\\text{query}}$.</li>
        <li><b>Sweep K.</b> Run $K = 0$ (zero-shot), $K = 1$ (one-shot), and $K$ in the 10-to-100 range (few-shot),
        each as a fresh prompt &mdash; never a weight update.</li>
        <li><b>Read off the answer</b> from the model's continuation; score it against the gold output.</li>
        <li><b>Compare across model sizes.</b> Repeat the whole sweep for models of different parameter counts and
        compare the accuracy-versus-K <i>slopes</i>. Steeper slopes for bigger models is the paper's finding
        (Figure 1.2).</li>
       </ol>`,
    results:
      `<p><b>From the abstract (quoted):</b> "we show that scaling up language models greatly improves
       task-agnostic, few-shot performance, sometimes even reaching competitiveness with prior state-of-the-art
       fine-tuning approaches."</p>
       <p><b>On the model and the protocol (quoted, abstract):</b> "we train GPT-3, an autoregressive language
       model with 175 billion parameters, 10x more than any previous non-sparse language model... For all tasks,
       GPT-3 is applied without any gradient updates or fine-tuning, with tasks and few-shot demonstrations
       specified purely via text interaction with the model."</p>
       <p><b>On scale and in-context learning (quoted, Figure 1.2):</b> "Larger models make increasingly efficient
       use of in-context information." And: "The steeper in-context learning curves for large models demonstrate
       improved ability to learn a task from contextual information."</p>
       <p><b>On where it succeeds and struggles (quoted, abstract):</b> "GPT-3 achieves strong performance on many
       NLP datasets, including translation, question-answering, and cloze tasks... At the same time, we also
       identify some datasets where GPT-3's few-shot learning still struggles, as well as some datasets where GPT-3
       faces methodological issues related to training on large web corpora."</p>
       <p><i>These are the paper's own statements, transcribed from the abstract, &sect;1, &sect;2, and Figure 1.2.
       The per-benchmark accuracy tables in &sect;3 are not reproduced here. Every number in the CODEVIZ panel below
       comes from our own tiny illustration &mdash; not the paper's measured results.</i></p>`,
    evaluation:
      `<p><b>The metric & benchmark.</b> This is a <b>read-only</b> paper, so "working" means your understanding
       and the toy illustration behave correctly &mdash; there is no GPT-3 to train. The paper's own metric is
       <b>task accuracy as a function of $K$</b> (the number of in-prompt demonstrations) across many NLP
       benchmarks, plus the key trend: the accuracy-vs-$K$ <i>slope</i> steepens with model size (Figure 1.2). The
       "no-skill" anchors are the <b>zero-shot</b> ($K=0$) accuracy &mdash; what the model gets from the
       instruction alone &mdash; and chance for the task; few-shot must beat both. For the toy, the floor is the
       $K=0$ echo-the-input accuracy (<b>0.000</b> in our run) and the ceiling is $1.0$.</p>
       <ul>
        <li><b>Sanity checks BEFORE the full run.</b> Since there is nothing to train, the checks are on the
        <i>protocol</i> and the toy: (1) <b>Frozen-weights invariant</b> &mdash; assert no parameter/array changes
        between prompts; if anything updates, it's fine-tuning, not in-context learning. (2) <b>Known-answer toy
        points</b> &mdash; the illustration must reproduce $K=0\\to 0.000$, $K=1\\to 0.325$, $K=16\\to 0.952$ (seed
        0). (3) <b>Monotone-ish climb</b> &mdash; accuracy should rise (or plateau), never fall, as $K$ grows; a dip
        means the similarity match or the "removed = set(di) - set(do)" rule inference is buggy. (4) <b>Eval/demos
        disjoint</b> &mdash; confirm the held-out queries use a separate RNG from the demonstration pool, or you're
        leaking.</li>
        <li><b>Expected range.</b> Our toy curve: <b>0.000</b> ($K{=}0$), <b>0.325</b> ($K{=}1$), <b>0.603</b>
        ($K{=}2,4$), <b>0.777</b> ($K{=}8$), <b>0.952</b> ($K{=}16$) &mdash; our small run, not GPT-3's numbers. The
        $K{=}2$&ndash;$4$ plateau is honest: only three symbols exist, so accuracy jumps as demonstrations happen to
        cover each one. For the real paper, the target is to match the abstract's qualitative claims (few-shot
        approaches fine-tuning on some tasks; CoQA-style gains) &mdash; quote Figure 1.2 / the tables, never invent
        per-benchmark scores.</li>
        <li><b>Ablation &mdash; prove scale is what buys in-context learning.</b> The paper's central claim is that
        the benefit of demonstrations <i>grows with model size</i>. The conceptual ablation: re-run the same
        accuracy-vs-$K$ sweep on a <b>smaller / weaker</b> model and confirm the curve gets <b>flatter</b> (each
        added demonstration helps less). If a tiny model climbs just as steeply, then in-context learning isn't
        scale-dependent for your setup &mdash; contradicting Figure 1.2. (In the toy, you can mimic this by degrading
        the matcher's features and watching the slope drop.)</li>
        <li><b>Failure signals & what they mean.</b> <b>Accuracy flat at the $K=0$ value for all $K$:</b> the
        demonstrations aren't being read &mdash; the prompt isn't actually conditioning the prediction (wrong
        concatenation, or you scored zero-shot every time). <b>Accuracy = 1.0 even at $K=0$:</b> a leak &mdash; the
        answer is reachable without examples (e.g. gold copied into the query). <b>Accuracy decreases with $K$:</b>
        demonstrations are mislabeled or the similarity/rule-inference picks the wrong demo. <b>Weights changed
        between prompts:</b> you've accidentally implemented fine-tuning, not in-context learning &mdash; the one
        invariant the whole paper rests on ("no gradient updates or fine-tuning").</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>read-only</b> paper: a scale / emergent-behavior result, with no model to build from scratch
       (the architecture is just GPT-2's, &sect;2.1, and the contribution is what 175 billion parameters make
       possible). There is no PyTorch primitive to reconstruct and no novel module to compose. What you <i>do</i>
       instead is <b>understand and use</b> the in-context-learning protocol: distinguish zero- / one- / few-shot by
       the count K of prompt demonstrations, and hold fixed the rule that <b>no weights change</b>. The code below
       is a tiny <b>conceptual illustration</b> &mdash; a frozen, weightless rule-matcher that infers a "drop the
       symbol" rule from K in-prompt examples and shows accuracy climbing with K. It uses a toy model and toy data
       to show the <i>shape</i> of in-context learning; it does <b>not</b> run GPT-3, reproduce the paper's
       benchmark numbers, or download any real language model.</p>`,
    pitfalls:
      `<ul>
        <li><b>Thinking few-shot means the model is being trained on the examples.</b> It is not. The abstract is
        explicit: "without any gradient updates or fine-tuning." The demonstrations are <b>conditioning text</b>,
        read in the forward pass; no weight changes, nothing learned permanently. <b>Fix:</b> read "few-shot
        learner" as "adapts from a few in-prompt examples," not "fine-tuned on a few examples."</li>
        <li><b>Confusing in-context learning with fine-tuning.</b> Fine-tuning changes the weights via
        backpropagation on a labeled set; in-context learning leaves them frozen and works through the prompt. They
        are opposite mechanisms. <b>Fix:</b> ask "did any parameter change?" &mdash; if no, it is in-context.</li>
        <li><b>Reporting GPT-3's benchmark numbers from memory.</b> The paper's per-task scores (&sect;3) are
        specific and easy to misquote. <b>Fix:</b> cite the paper's table, or omit the number. The CODEVIZ numbers
        here are <i>ours</i>, on a toy task &mdash; not GPT-3's.</li>
        <li><b>Assuming few-shot always wins.</b> The abstract itself flags "some datasets where GPT-3's few-shot
        learning still struggles." In-context learning is powerful but not universal. <b>Fix:</b> treat it as a
        strong default, not a guarantee.</li>
        <li><b>Ignoring the context-window limit.</b> Few-shot K is bounded by the 2048-token window (&sect;2.1) &mdash;
        you cannot stuff in unlimited demonstrations. <b>Fix:</b> remember K is "as many as fit," typically 10 to
        100, not arbitrarily large.</li>
      </ul>`,
    recall: [
      "Define zero-shot, one-shot, and few-shot in terms of the count $K$ of prompt demonstrations (&sect;2).",
      "What is the one rule that holds in all three settings? (Hint: weights.)",
      "State GPT-3's parameter count and whether its architecture is novel.",
      "In one sentence, how does in-context learning differ from fine-tuning?",
      "What does Figure 1.2 claim about model size and the in-context learning curve?"
    ],
    practice: [
      {
        q: `<b>Classify the setting.</b> For each prompt, say whether it is zero-shot, one-shot, or few-shot, and
            confirm whether any weights change. (a) "Translate to French: cheese =&gt;". (b) "Translate to French:
            sea =&gt; mer. cheese =&gt;". (c) "Translate to French: sea =&gt; mer. otter =&gt; loutre. cheese =&gt;
            ... (eight pairs) ... cheese =&gt;".`,
        steps: [
          { do: `Count the demonstrations $K$ in each prompt &mdash; the input-output pairs shown before the query.`, why: `&sect;2 distinguishes the three settings only by $K$: 0, 1, or many.` },
          { do: `(a) has 0 demonstrations, (b) has 1, (c) has many (about 8).`, why: `$K = 0$ is zero-shot, $K = 1$ is one-shot, $K$ in the tens is few-shot.` },
          { do: `Check weights: in all three, the model is only reading text &mdash; no gradient updates.`, why: `The abstract: GPT-3 is applied "without any gradient updates or fine-tuning" in every setting.` }
        ],
        answer: `<p>(a) <b>Zero-shot</b> ($K = 0$). (b) <b>One-shot</b> ($K = 1$). (c) <b>Few-shot</b> ($K \\approx 8$).
                 In <i>all three</i>, <b>no weights change</b> &mdash; the demonstrations are conditioning text, read
                 in the forward pass. That is in-context learning, not training.</p>`
      },
      {
        q: `<b>Why is it called "learning" if nothing is learned?</b> A skeptic says: "If GPT-3's weights never
            change, then it is not learning the task &mdash; calling it a few-shot <i>learner</i> is marketing."
            Answer the skeptic using the paper's framing.`,
        steps: [
          { do: `State where the adaptation happens: in the forward pass over the prompt, not in the weights.`, why: `In-context learning (&sect;1) is the model "rapidly adapting to or recognizing the desired task" at inference time.` },
          { do: `Explain the mechanism: an autoregressive model conditions its next-token probability on the whole prompt, so demonstrations reshape the prediction without reshaping the weights.`, why: `Continuing a demonstrated input-output pattern is just high-probability next-token prediction for a model trained on patterned text.` },
          { do: `Concede the precise sense: nothing is learned <i>permanently</i>; a different prompt next turn gets handled by the same frozen weights.`, why: `That impermanence is exactly why no gradient updates are needed &mdash; the "learning" lives in the context.` }
        ],
        answer: `<p>The skeptic is half right: nothing is learned <i>permanently</i> &mdash; the weights are frozen,
                 and the next prompt is handled by the same parameters. But "learning" here refers to the model's
                 in-context adaptation: by conditioning its next-token distribution on the demonstrations, it
                 recognizes and continues the task's pattern within a single forward pass. The paper (&sect;1) names
                 this "in-context learning." It is genuine task adaptation; it just lives in the prompt, not the
                 weights &mdash; which is the whole point of "no gradient updates."</p>`
      },
      {
        q: `<b>Ablation &mdash; remove the scale.</b> Figure 1.2 shows larger models have steeper accuracy-vs-K
            curves. Suppose you re-ran the same in-context task on a much <i>smaller</i> model. Predict how the
            curve would change, and what that implies about whether in-context learning is "free."`,
        steps: [
          { do: `Recall the figure's claim: "Larger models make increasingly efficient use of in-context information," with steeper curves for larger models.`, why: `The benefit of each added demonstration grows with model size &mdash; that is the measured trend.` },
          { do: `Predict the small-model curve: flatter &mdash; accuracy rises little (or not at all) as K grows, because the small model is worse at recognizing the pattern from context.`, why: `A flatter accuracy-vs-K slope is exactly what "less efficient use of in-context information" means.` },
          { do: `Draw the implication: in-context learning is an ability that <i>emerges with scale</i>, not a property every model has.`, why: `If it were free, small and large models would have the same slope &mdash; but they do not.` }
        ],
        answer: `<p>On a much smaller model the accuracy-vs-K curve would be <b>flatter</b>: adding demonstrations
                 would help little, because the small model is weaker at recognizing and continuing the in-context
                 pattern. The implication is the paper's thesis &mdash; <b>in-context learning is not free; it
                 strengthens with scale.</b> "Larger models make increasingly efficient use of in-context
                 information" (Figure 1.2), so the steep, useful few-shot curve is itself a product of size.</p>`
      }
    ]
  });

  window.CODE["paper-gpt3"] = {
    lib: "NumPy",
    runnable: false,
    explain:
      `<p>This is a <b>read-only</b> paper, so there is no GPT-3 to train, run, or download. The snippet below is a
       tiny <b>conceptual illustration</b> of <i>in-context learning</i> only. It builds a frozen, weightless
       "model" that infers a simple rule &mdash; "drop the stray symbol from a word," the flavor of the paper's
       Figure 1.2 task &mdash; purely from K demonstration pairs placed in its <b>context</b>. No weights exist to
       update; adaptation happens only by reading the demonstrations, exactly as in-context learning does. It scores
       zero-shot ($K = 0$), one-shot ($K = 1$), and few-shot, and prints the accuracy-versus-K curve so you can
       watch it climb. The numbers are <b>our small-scale run, not the paper's reported results</b>, and the model
       is a toy &mdash; it does not reproduce GPT-3 or any benchmark. Pure NumPy, CPU, runs in well under a second.</p>`,
    code: `import numpy as np

# ---------------------------------------------------------------------------
# A TINY in-context-learning illustration -- OUR small run, NOT the paper's
# number. Hidden RULE (the model never sees it stated): an input is a letter
# followed by a stray symbol, e.g. "a#", and the correct output drops the
# symbol -> "a". This is the flavor of the paper's Figure 1.2 task
# ("remove random symbols from a word"). The model has NO weights to update:
# it adapts ONLY by reading K demonstration pairs in its CONTEXT.
# ---------------------------------------------------------------------------
rng = np.random.default_rng(0)
letters = list("abcdefgh")
symbols = list("#@*")
alphabet = letters + symbols
idx = {ch: i for i, ch in enumerate(alphabet)}

def feat(s):                       # fixed bag-of-characters map -- NOT learned
    v = np.zeros(len(alphabet))
    for ch in s: v[idx[ch]] += 1.0
    return v

def make_pair():
    c = rng.choice(letters); s = rng.choice(symbols)
    return c + s, c                # ("a#", "a")

def predict_zero_shot(query):
    # K = 0: no demonstrations. With no example of the mapping, the frozen model
    # falls back to echoing the input -> usually wrong. (No weights involved.)
    return query

def predict_in_context(query, demos):
    # K >= 1: find the demonstration whose INPUT is most similar, then apply the
    # SAME deletion it shows. Pure reading of the context -- no weight updates.
    qf = feat(query)
    sims = np.array([qf @ feat(di) for di, _ in demos])
    di, do = demos[int(np.argmax(sims))]
    removed = set(di) - set(do)            # what that demo deleted
    return "".join(ch for ch in query if ch not in removed)

def accuracy(demos, n=600):
    ev = np.random.default_rng(123)        # fixed eval set, separate from demos
    hits = 0
    for _ in range(n):
        c = ev.choice(letters); s = ev.choice(symbols)
        q, gold = c + s, c
        pred = predict_zero_shot(q) if demos is None else predict_in_context(q, demos)
        hits += (pred == gold)
    return hits / n

pool = [make_pair() for _ in range(60)]    # demonstration pool; prompts are prefixes

print("zero-shot (K=0): %.3f" % accuracy(None))
print("one-shot  (K=1): %.3f" % accuracy(pool[:1]))
print("few-shot  (K=8): %.3f" % accuracy(pool[:8]))
print("\\nin-context curve (K -> accuracy):")
for K in [0, 1, 2, 4, 8, 16]:
    a = accuracy(None) if K == 0 else accuracy(pool[:K])
    print("  K=%2d  acc=%.3f" % (K, a))

# zero-shot (K=0): 0.000
# one-shot  (K=1): 0.325
# few-shot  (K=8): 0.777
#
# in-context curve (K -> accuracy):
#   K= 0  acc=0.000
#   K= 1  acc=0.325
#   K= 2  acc=0.603
#   K= 4  acc=0.603
#   K= 8  acc=0.777
#   K=16  acc=0.952
# Accuracy CLIMBS with K, with NO weights changing -- that is in-context
# learning. Toy model, toy data: OUR illustration, NOT GPT-3's numbers.`
  };

  window.CODEVIZ["paper-gpt3"] = {
    question: "In-context learning means a FROZEN model (no weight updates) does a task by reading K examples in its prompt. If we put K demonstrations of a simple 'drop the symbol' rule in the context, does accuracy climb with K -- the shape of the paper's Figure 1.2?",
    charts: [
      {
        type: "line",
        title: "Toy in-context learning: accuracy vs. K demonstrations in the prompt (OUR illustration, not GPT-3's numbers)",
        xlabel: "K = number of in-context demonstrations in the prompt",
        ylabel: "accuracy on held-out queries (no weight updates)",
        series: [
          {
            name: "frozen rule-matcher (weights never change)",
            color: "#7ee787",
            points: [[0, 0.000], [1, 0.325], [2, 0.603], [4, 0.603], [8, 0.777], [16, 0.952]]
          }
        ]
      }
    ],
    caption: "OUR small run, NOT the paper's number. A frozen, weightless rule-matcher infers a 'drop the stray symbol from a word' rule purely from K demonstration pairs placed in its context -- no gradient updates, no fine-tuning. Accuracy climbs from 0.000 at K=0 (zero-shot: with no example shown, the model echoes the input and fails) to 0.325 at K=1 (one-shot) to 0.952 at K=16 (few-shot). The plateau from K=2 to K=4 is honest: the toy has only three symbols, so accuracy jumps as the demonstrations happen to cover each one. This is the SHAPE of the paper's Figure 1.2 ('Larger models make increasingly efficient use of in-context information') -- adaptation by reading the prompt, weights frozen. The model is a toy and the numbers are ours; this does NOT run GPT-3 or reproduce any benchmark from the paper.",
    code: `import numpy as np

# Toy IN-CONTEXT LEARNING -- OUR illustration, NOT the paper's number.
# A FROZEN model (no weights) infers 'drop the stray symbol' from K
# demonstrations in its context. We plot accuracy vs K (the Fig 1.2 shape).
rng = np.random.default_rng(0)
letters, symbols = list("abcdefgh"), list("#@*")
alphabet = letters + symbols
idx = {ch: i for i, ch in enumerate(alphabet)}

def feat(s):
    v = np.zeros(len(alphabet))
    for ch in s: v[idx[ch]] += 1.0
    return v

def make_pair():
    c = rng.choice(letters); s = rng.choice(symbols)
    return c + s, c

def predict_in_context(query, demos):
    sims = np.array([feat(query) @ feat(di) for di, _ in demos])
    di, do = demos[int(np.argmax(sims))]
    removed = set(di) - set(do)
    return "".join(ch for ch in query if ch not in removed)

def accuracy(demos, n=600):
    ev = np.random.default_rng(123); hits = 0
    for _ in range(n):
        c = ev.choice(letters); s = ev.choice(symbols)
        q, gold = c + s, c
        pred = q if demos is None else predict_in_context(q, demos)  # K=0 echoes
        hits += (pred == gold)
    return hits / n

pool = [make_pair() for _ in range(60)]
for K in [0, 1, 2, 4, 8, 16]:
    a = accuracy(None) if K == 0 else accuracy(pool[:K])
    print("K=%2d  acc=%.3f" % (K, a))
# K= 0  acc=0.000
# K= 1  acc=0.325
# K= 2  acc=0.603
# K= 4  acc=0.603
# K= 8  acc=0.777
# K=16  acc=0.952
# Accuracy climbs with K, weights frozen -> in-context learning.
# OUR toy numbers, NOT GPT-3's benchmark results.`
  };
})();