/* Paper lesson — "PaLM: Scaling Language Modeling with Pathways", Chowdhery,
   Narang, Devlin, Bosma, ... Dean, Petrov, Fiedel (Google, 2022; JMLR 2023).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-palm".
   GROUNDED from arXiv:2204.02311 (abstract) and the ar5iv HTML mirror:
     - Section 2 (Model Architecture): SwiGLU activation, Parallel Layers,
       Multi-Query Attention, RoPE embeddings, Shared Input-Output Embeddings,
       No Biases; SentencePiece 256k-token vocabulary.
     - Table 1: PaLM 8B / 62B / 540B layers, heads, d_model; d_head = 256 always.
     - Section 3: 780-billion-token pretraining corpus.
     - Section 4 (Training Infrastructure / Pathways): 6144 TPU v4 chips across
       two pods; model FLOPs utilization (MFU) 46.2%, hardware FLOPs 57.8%.
     - Section 6.2 (BIG-bench): discontinuous improvements / emergent abilities.
     - Section 6.3.1 (GSM8K): 58% with 8-shot chain-of-thought + calculator.
   Track: read-only (pure-scale result). No from-scratch model.
   The CODEVIZ is OUR OWN small illustration: a tiny SwiGLU-vs-ReLU gate compared
   on the SAME synthetic inputs, plus a synthetic "emergent jump" curve. Both are
   clearly labeled as our illustrations, NOT the paper's measured numbers. */
(function () {
  window.LESSONS.push({
    id: "paper-palm",
    title: "PaLM — Scaling Language Modeling with Pathways (2022)",
    tagline: "A 540-billion-parameter dense Transformer, trained across thousands of TPU chips, whose reasoning skills jump sharply with scale.",
    module: "Papers · Transformers & LLMs",
    track: "read-only",
    paper: {
      authors: "Aakanksha Chowdhery, Sharan Narang, Jacob Devlin, Maarten Bosma, Gaurav Mishra, Adam Roberts, Paul Barham, Hyung Won Chung, Charles Sutton, Sebastian Gehrmann, ... Jeff Dean, Slav Petrov, Noah Fiedel (67 authors)",
      org: "Google",
      year: 2022,
      venue: "arXiv:2204.02311 (Apr 2022); later in the Journal of Machine Learning Research (JMLR), 2023",
      citations: "",
      arxiv: "https://arxiv.org/abs/2204.02311",
      code: ""
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["paper-transformer", "paper-scaling-laws", "paper-rope", "paper-swish", "dl-attention", "dl-language-model", "fs-in-context"],

    // WHY READ IT
    problem:
      `<p>By 2022, two facts about <b>large language models</b> were clear. A large language model
       (often shortened to LLM) is a neural network trained to predict the next token &mdash; a word or
       word-piece &mdash; in text, and it can then be steered by a prompt to perform many tasks. Fact one:
       the scaling-laws work had shown that test loss falls smoothly and predictably as you grow the model.
       Fact two: very large models could solve new tasks from just a few examples in the prompt, with no
       weight updates &mdash; so-called <b>few-shot</b> learning.</p>
       <p>But two practical walls stood in the way of going much bigger. First, an <b>engineering</b> wall:
       a model with hundreds of billions of weights does not fit on one chip, so training must be split
       across thousands of accelerator chips spanning multiple machines &mdash; and doing that efficiently,
       without the chips sitting idle waiting on each other, is hard. Second, an <b>open scientific
       question</b>: would the next big jump in size keep paying off, and would it unlock <i>qualitatively
       new</i> abilities &mdash; especially multi-step reasoning, which smaller models were bad at &mdash;
       or just shave a little more off the loss?</p>
       <p>PaLM (Pathways Language Model) is the answer to both. It is one <b>dense</b> 540-billion-parameter
       Transformer (dense means every weight is used for every token, unlike sparse mixture-of-experts
       models), trained on Google's <b>Pathways</b> system across thousands of Tensor Processing Unit (TPU)
       chips. A TPU is Google's custom chip for neural-network math. The paper asks: at this scale, what
       breaks, and what newly works?</p>`,
    contribution:
      `<ul>
        <li><b>A 540B-parameter dense Transformer, trained efficiently at scale.</b> PaLM is "a 540-billion
        parameter, densely activated, Transformer language model" (abstract) trained "on 6144 TPU v4 chips
        using Pathways" (&sect;4). The headline systems result: a <b>model FLOPs utilization</b> (the fraction
        of the chips' peak arithmetic throughput actually spent on useful model math) of "46.2%" (&sect;4)
        &mdash; high for a model this large.</li>
        <li><b>A bundle of architecture choices for stability and speed at scale.</b> SwiGLU activations,
        parallel transformer blocks, multi-query attention, rotary position embeddings (RoPE), shared
        input/output embeddings, and no bias terms (&sect;2). None is brand-new on its own; the contribution
        is showing they work together at 540B parameters.</li>
        <li><b>Breakthrough, discontinuous gains on reasoning.</b> PaLM sets "state-of-the-art few-shot
        learning results on hundreds of language understanding and generation benchmarks" and shows that on
        many tasks, ability appears as a sharp jump with scale: "discontinuous improvements from scale are a
        common phenomenon on challenging few-shot language tasks" (&sect;6.2). With chain-of-thought
        prompting it reaches strong multi-step arithmetic and commonsense reasoning (&sect;6.3).</li>
      </ul>`,
    whyItMattered:
      `<p>PaLM was, at release, one of the largest <b>dense</b> language models trained, and the clearest
       public demonstration that careful systems engineering plus the right architecture bundle could push a
       single dense model to 540B parameters at high hardware efficiency. It made the case that the
       scaling-laws extrapolation kept holding far past where anyone had measured it.</p>
       <p>Its more lasting influence was on <b>reasoning</b>. PaLM's results were a centerpiece of the
       evidence that some abilities are <b>emergent</b> &mdash; nearly absent in smaller models, then
       appearing abruptly past a scale threshold &mdash; and that <b>chain-of-thought</b> prompting (asking
       the model to write out intermediate steps before the answer) unlocks multi-step reasoning that
       direct-answer prompting misses. Together with contemporaries it shaped how the field thinks about
       what scale buys you, and it fed directly into the next generation of Google's models. (The follow-up
       Chinchilla work, which you may read separately, argued PaLM-era models were under-trained on data for
       their size &mdash; a complementary lesson about <i>how</i> to spend a budget.)</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2 (Model Architecture)</b> &mdash; the six bullet choices (SwiGLU, parallel layers,
        multi-query attention, RoPE, shared embeddings, no biases) and <b>Table 1</b>, which lists the three
        model sizes (8B, 62B, 540B) with their layer counts, head counts, and $d_{\\text{model}}$. This is
        the part you must understand precisely; the rest is evidence.</li>
        <li><b>&sect;4 (Training Infrastructure)</b> &mdash; how Pathways splits one model across 6144 TPU v4
        chips in two pods, and the efficiency metric (model FLOPs utilization, 46.2%). Read for the idea of
        <i>why utilization matters</i>, not the low-level systems detail.</li>
        <li><b>&sect;6.2 (BIG-bench) and &sect;6.3 (Reasoning)</b> &mdash; the breakthrough results: the
        discontinuous-jump scaling curves and the chain-of-thought arithmetic results (e.g. GSM8K).</li>
       </ul>
       <p><b>Skim:</b> the long per-benchmark tables (&sect;6 has many), the multilingual and code sections,
       and the memorization / bias / toxicity analyses &mdash; important for a full read, not needed to grasp
       the architecture and the scale story. You do <b>not</b> implement this paper; it is a read-only,
       large-scale-result paper. Read it for the architecture bundle and what scale unlocks.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>PaLM swaps the usual <b>serial</b> transformer block &mdash; attention, then the feed-forward
       network (the MLP), one after the other &mdash; for a <b>parallel</b> block, where attention and the
       MLP both read the <i>same</i> layer-normalized input and their outputs are added. The paper reports
       this gives "roughly 15% faster training speed at large scales" (&sect;2).</p>
       <p>Guess before reading on: <b>why would running attention and the MLP in parallel be faster, and
       what might it cost?</b> (Hint: in the serial form, the MLP must wait for attention to finish on the
       same input; in the parallel form, the two big matrix multiplications that feed each can be fused and
       the input normalized once. Think about which dependency disappears.) Write one sentence on the speed
       gain and one on the possible quality risk at small scale.</p>`,
    attempt:
      `<p>This is a read-only paper, so there is nothing to build from scratch. Before the reveal, work the
       architecture out on paper:</p>
       <ul>
        <li>Write the <b>serial</b> block update the paper contrasts against:
        $y = x + \\text{MLP}(\\text{LayerNorm}(x + \\text{Attention}(\\text{LayerNorm}(x))))$. Here $x$ is the
        input vector for a token, LayerNorm is layer normalization (rescales a vector to zero mean and unit
        variance, then applies learned scale), and the outer $x +$ is the residual (skip) connection.</li>
        <li>Now write PaLM's <b>parallel</b> block:
        $y = x + \\text{MLP}(\\text{LayerNorm}(x)) + \\text{Attention}(\\text{LayerNorm}(x))$. Note what
        changed: the MLP no longer sees the attention output, and LayerNorm is applied to $x$ <i>once</i>,
        shared by both branches.</li>
        <li>TODO: count the <b>LayerNorm</b> calls per block in each form. TODO: in the parallel form, which
        two large input-projection matrices (the MLP's first layer and attention's query/key/value
        projection) now act on the <i>same</i> vector, and could therefore be fused into one matmul?</li>
       </ul>
       <p>The CODEVIZ below is OUR OWN small illustration: it compares the SwiGLU gate against a plain ReLU
       on the same toy inputs, and sketches a synthetic "emergent jump" curve. It is labeled throughout as
       our illustration, not the paper's numbers.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>PaLM is a standard <b>decoder-only</b> Transformer &mdash; the same family as GPT &mdash; scaled up
       and tuned. "Decoder-only" means it reads text left to right and predicts each next token from the ones
       before it. The paper's contribution is a specific bundle of design choices (&sect;2) plus the systems
       work (&sect;4) to train it. We walk the choices one by one, defining each term.</p>

       <p><b>1. SwiGLU activation (the MLP non-linearity).</b> Inside each block is an MLP: a two-layer
       feed-forward network applied to every token. A plain MLP computes $\\text{ReLU}(xW)\\,W_2$, where ReLU
       (rectified linear unit) zeros out negatives. PaLM instead uses <b>SwiGLU</b>, a <i>gated</i>
       activation. The paper writes it as $\\text{Swish}(xW)\\cdot xV$ (&sect;2, citing Shazeer 2020). Read it
       this way: the input $x$ is sent through <i>two</i> separate linear maps, $xW$ and $xV$. One branch,
       $xW$, is passed through <b>Swish</b> &mdash; a smooth activation, $\\text{Swish}(z) = z\\cdot
       \\sigma(z)$, where $\\sigma$ is the logistic sigmoid $\\sigma(z)=1/(1+e^{-z})$. The result acts as a
       soft <b>gate</b>: an elementwise multiplier between 0 and roughly the input's magnitude. That gate
       then multiplies the other branch $xV$ elementwise. The paper reports SwiGLU "significantly increase[s]
       quality compared to standard ReLU, GeLU, or Swish activations." The cost: two input matrices ($W$ and
       $V$) instead of one, so the hidden width is shrunk to keep the parameter count matched.</p>

       <p><b>2. Parallel layers (faster blocks).</b> The standard block runs attention and the MLP in series:
       $y = x + \\text{MLP}(\\text{LayerNorm}(x + \\text{Attention}(\\text{LayerNorm}(x))))$. PaLM runs them in
       <b>parallel</b> off the same normalized input:
       $y = x + \\text{MLP}(\\text{LayerNorm}(x)) + \\text{Attention}(\\text{LayerNorm}(x))$ (&sect;2). Now the
       MLP and attention both read $\\text{LayerNorm}(x)$, so LayerNorm runs once, and the two input
       projections can be fused into a single larger matrix multiply. The paper reports "roughly 15% faster
       training speed at large scales," with quality degradation that "is small" at the 8B scale and
       negligible at 62B.</p>

       <p><b>3. Multi-query attention (cheaper generation).</b> Attention projects each token into a
       <b>query</b>, a <b>key</b>, and a <b>value</b> vector, for each of several heads. Standard
       <b>multi-head attention</b> gives every head its own key and value. PaLM uses <b>multi-query
       attention</b>: "the key/value projections are shared for each head, i.e. 'key' and 'value' are
       projected to $[1, h]$, but 'query' is still projected to shape $[k, h]$" (&sect;2), where $k$ is the
       number of heads and $h$ the head size. So all heads share one key and one value, but keep separate
       queries. The paper notes this barely changes training but is "a significant cost savings at
       autoregressive decoding time" &mdash; at generation, the shared key/value cache is far smaller, so
       fewer memory loads per step.</p>

       <p><b>4. RoPE position embeddings.</b> A Transformer needs to know token <i>order</i>. PaLM uses
       <b>RoPE</b> (rotary position embeddings) "rather than absolute or relative position embeddings, since
       RoPE embeddings have been shown to have better performance on long sequence lengths" (&sect;2). RoPE
       encodes a token's position by <i>rotating</i> its query and key vectors by an angle proportional to
       the position, so that the dot product between two tokens depends only on their <i>relative</i>
       distance. (You can study RoPE in depth in the linked prerequisite.)</p>

       <p><b>5. Shared input-output embeddings.</b> "We share the input and output embedding matrices"
       (&sect;2): the same matrix that maps a token id to a vector at the input is reused (transposed) to
       turn the final hidden vector into next-token scores. This ties parameters and is a common space-saver.</p>

       <p><b>6. No biases.</b> "No biases were used in any of the dense kernels or layer norms" (&sect;2) &mdash;
       i.e. the linear layers and LayerNorms have no additive constant term. The paper: "We found this to
       result in increased training stability for large models." Fewer parameters that can drift, steadier
       training.</p>

       <p><b>Scale and data.</b> Table 1 gives three sizes; the largest, PaLM 540B, has 118 layers, 48
       attention heads, $d_{\\text{model}} = 18432$ (the per-token vector width), and a fixed attention head
       size of 256. The vocabulary is a SentencePiece tokenizer with 256k tokens (&sect;2), chosen to cover
       many languages. It is pretrained on "a high-quality corpus of 780 billion tokens" (&sect;3).</p>

       <p><b>The Pathways systems result.</b> A 540B-parameter model cannot fit on one chip, so it is sharded
       across "6144 TPU v4 chips" in two pods (3072 chips each) using the Pathways system (&sect;4). The key
       efficiency number is <b>model FLOPs utilization (MFU)</b>: of the chips' peak floating-point
       operations per second, what fraction goes to useful model arithmetic (not idling, communication, or
       recomputation). PaLM reports MFU of "46.2%" and a hardware FLOPs utilization of "57.8%" (&sect;4) &mdash;
       strong numbers at this scale, and a large part of the paper's engineering contribution.</p>

       <p><b>The scientific payoff.</b> With this model the paper documents <b>discontinuous</b> improvements:
       on many BIG-bench tasks the score barely moves from 8B to 62B, then jumps sharply at 540B &mdash;
       "certain capabilities of the model only emerge once a certain scale is reached" (&sect;6.2). And with
       chain-of-thought prompting, multi-step reasoning becomes strong (&sect;6.3).</p>`,
    symbols: [
      { sym: "$x$", desc: "the <b>input vector</b> for one token entering a transformer block (its current hidden representation, a list of $d_{\\text{model}}$ numbers)." },
      { sym: "$\\text{LayerNorm}(\\cdot)$", desc: "<b>layer normalization</b>: rescale a vector to zero mean and unit variance across its entries, then apply a learned scale. In PaLM there is no additive bias term (the 'no biases' choice)." },
      { sym: "$\\text{Attention}(\\cdot)$", desc: "the <b>self-attention</b> sublayer: each token mixes in information from earlier tokens, weighted by query&ndash;key similarity. PaLM uses multi-query attention (one shared key/value, many queries)." },
      { sym: "$\\text{MLP}(\\cdot)$", desc: "the <b>feed-forward network</b> (multi-layer perceptron) sublayer applied to each token independently: expand the width, apply a non-linearity, project back. PaLM's non-linearity is SwiGLU." },
      { sym: "$\\text{Swish}(z)$", desc: "a smooth activation, $\\text{Swish}(z) = z\\,\\sigma(z)$ with $\\sigma$ the logistic sigmoid $\\sigma(z)=1/(1+e^{-z})$. Like a soft ReLU: it passes large positive $z$ through and squashes negatives toward 0, but smoothly." },
      { sym: "$\\sigma(z)$", desc: "the <b>logistic sigmoid</b>, $\\sigma(z)=1/(1+e^{-z})$: squashes any real number into the open interval $(0, 1)$. It is the gate's 'how much to let through' knob." },
      { sym: "$W,\\ V$", desc: "the <b>two input weight matrices</b> of the SwiGLU MLP. $x$ is mapped by both: $xW$ goes through Swish to form the gate, $xV$ is the value being gated. A plain MLP has only one such matrix." },
      { sym: "$\\cdot$", desc: "in $\\text{Swish}(xW)\\cdot xV$, this is <b>elementwise multiplication</b>: multiply the two equal-length vectors entry by entry. This is the 'gating' operation." },
      { sym: "$d_{\\text{model}}$", desc: "the <b>model width</b>: the length of each token's hidden vector. PaLM 540B uses $d_{\\text{model}} = 18432$ (Table 1)." },
      { sym: "$k,\\ h$", desc: "in the attention description, $k$ is the <b>number of attention heads</b> and $h$ the <b>head size</b>. Multi-query projects key/value to shape $[1, h]$ (shared) and query to $[k, h]$ (per-head)." },
      { sym: "“dense (model)”", desc: "a plain term: every parameter is used for every token. Contrast with a sparse mixture-of-experts model, where each token uses only a few of many expert sub-networks." },
      { sym: "“few-shot”", desc: "a plain term: solving a task from a handful of examples placed in the prompt, with no weight updates &mdash; in-context learning." },
      { sym: "“TPU (Tensor Processing Unit)”", desc: "Google's custom chip for neural-network math. PaLM 540B was trained on 6144 TPU v4 chips (&sect;4)." },
      { sym: "“MFU (model FLOPs utilization)”", desc: "a plain term: the fraction of the hardware's peak floating-point throughput that is spent on useful model arithmetic. PaLM reports 46.2% (&sect;4). Higher means less idle/communication waste." },
      { sym: "“emergent / discontinuous”", desc: "a plain term: an ability that is nearly absent at small scale, then appears as a sharp jump past a scale threshold &mdash; not a smooth, gradual climb." }
    ],
    formula: `$$ \\textbf{SwiGLU (MLP activation, §2): }\\quad \\text{SwiGLU}(x) = \\text{Swish}(xW)\\,\\cdot\\, xV, \\qquad \\text{Swish}(z) = z\\,\\sigma(z),\\ \\ \\sigma(z)=\\tfrac{1}{1+e^{-z}}. $$ $$ \\textbf{Serial block (standard): }\\quad y = x + \\text{MLP}\\big(\\text{LayerNorm}(x + \\text{Attention}(\\text{LayerNorm}(x)))\\big). $$ $$ \\textbf{Parallel block (PaLM, §2): }\\quad y = x + \\text{MLP}\\big(\\text{LayerNorm}(x)\\big) + \\text{Attention}\\big(\\text{LayerNorm}(x)\\big). $$`,
    whatItDoes:
      `<p><b>The SwiGLU line</b> says the MLP non-linearity is a <b>gate times a value</b>. The input is split
       down two learned linear maps. One map's output is passed through Swish to produce a soft per-entry
       multiplier (the gate); the other map's output is what gets multiplied. So instead of "rectify, then
       project" (plain ReLU MLP), it is "compute a value and a learned gate, multiply them, then project."
       The gate lets the network learn <i>which</i> features to pass and <i>how much</i>, smoothly &mdash;
       which the paper found raises quality.</p>
       <p><b>The two block lines</b> contrast serial vs parallel computation. In the serial block, the MLP
       reads the <i>already-attended</i> input, so it must wait for attention. In PaLM's parallel block, both
       the MLP and attention read the <i>same</i> normalized input $\\text{LayerNorm}(x)$ and their results
       are simply added to the residual. Two consequences: LayerNorm runs once per block instead of twice,
       and the MLP's and attention's input projections both multiply the same vector, so they can be fused
       into one big matrix multiply &mdash; the source of the "roughly 15% faster training" (&sect;2). The
       trade-off is a small quality cost at small scale that the paper found vanishes by 62B.</p>`,
    derivation:
      `<p>This is a read-only, large-scale-result paper, not a from-scratch derivation. There is no theorem to
       prove; the "why" is about <i>why each choice helps</i> and how the pieces fit. Two short arguments you
       can check yourself.</p>
       <p><b>Why SwiGLU is parameter-matched to a plain MLP.</b> A plain MLP first layer is one matrix
       $W_1 \\in \\mathbb{R}^{d \\times f}$ (width $d$ to hidden $f$). SwiGLU needs <i>two</i> input matrices
       $W, V \\in \\mathbb{R}^{d \\times f'}$. To keep the total parameter count the same, you shrink the
       hidden width: set $f' = \\tfrac{2}{3} f$, so $2 \\cdot d f' = 2 \\cdot d \\cdot \\tfrac{2}{3} f =
       \\tfrac{4}{3} d f$ &mdash; matching the plain MLP's two matrices ($d f$ in and $f d$ out) up to the
       same budget. So SwiGLU's quality gain is <i>not</i> from extra parameters; it is from the gating shape.
       (PaLM follows this standard $\\tfrac{2}{3}$ convention.)</p>
       <p><b>Why parallel layers save work.</b> Count the LayerNorm calls: the serial block applies LayerNorm
       twice (once before attention, once before the MLP, on different inputs). The parallel block applies it
       <i>once</i>, to $x$, shared by both branches. And because both branches now consume the identical
       vector $\\text{LayerNorm}(x)$, the attention input projection and the MLP input projection can be
       concatenated into a single matrix multiply &mdash; one large matmul is faster on a TPU than two smaller
       ones (better use of the systolic array, fewer kernel launches). That fusion plus the single LayerNorm
       is what buys the speed. The cost is that the MLP can no longer see what attention computed this layer;
       empirically the paper found that cost negligible at large scale.</p>
       <p><b>Why "emergent" looks discontinuous.</b> The paper does not claim a theory of emergence; it
       <i>reports</i> that many task-accuracy-vs-scale curves are flat then jump (&sect;6.2). A common
       informal explanation: a hard task needs several sub-skills to all work at once; below a threshold one
       sub-skill is missing and accuracy stays near chance, then past the threshold they align and accuracy
       leaps. The paper's contribution here is the <i>measurement</i>, not a derivation.</p>`,
    example:
      `<p>Let us run a single number through the <b>SwiGLU gate</b> $\\text{Swish}(a)\\cdot b$ and compare it
       to a plain <b>ReLU</b> on the same input, so you can feel what the gate does. (We use scalar branch
       values $a$ and $b$ to keep arithmetic by hand; in the real MLP these are whole vectors.)</p>
       <ul class="steps">
        <li><b>Pick branch values.</b> Suppose for one hidden unit the gate branch is $a = 2.0$ (this is one
        entry of $xW$) and the value branch is $b = 3.0$ (one entry of $xV$).</li>
        <li><b>Swish on the gate branch.</b> $\\text{Swish}(a) = a\\,\\sigma(a)$. First
        $\\sigma(2.0) = 1/(1 + e^{-2.0}) = 1/(1 + 0.13534) = 0.88080$. Then
        $\\text{Swish}(2.0) = 2.0 \\times 0.88080 = 1.76159$.</li>
        <li><b>Gate the value branch.</b> SwiGLU output $= \\text{Swish}(a)\\cdot b = 1.76159 \\times 3.0 =
        5.28478$. The gate ($\\approx 1.76$) <i>amplified</i> the value because $a$ was solidly positive.</li>
        <li><b>Compare to ReLU.</b> A plain MLP unit would just compute $\\text{ReLU}(a) = \\max(0, 2.0) =
        2.0$ &mdash; it ignores the second branch entirely and passes the gate input straight through.</li>
        <li><b>Now a negative gate.</b> Take $a = -1.0$, $b = 3.0$. $\\sigma(-1.0) = 1/(1 + e^{1.0}) =
        1/(1 + 2.71828) = 0.26894$, so $\\text{Swish}(-1.0) = -1.0 \\times 0.26894 = -0.26894$, and SwiGLU
        output $= -0.26894 \\times 3.0 = -0.80682$ &mdash; a small <i>signed</i> leak. ReLU would output
        $\\max(0, -1.0) = 0$ &mdash; a hard zero. SwiGLU's gate is smooth and can pass a little signed
        information where ReLU clips to nothing.</li>
       </ul>
       <p>The CODEVIZ recomputes these exact numbers in NumPy and plots the SwiGLU and ReLU outputs across a
       range of gate inputs, so you can verify $5.285$ and $-0.807$ and see the smooth-vs-hard difference.
       Those are OUR small illustration of the activation shape &mdash; not any number from the paper.</p>`,
    recipe:
      `<p>This is a read-only paper, so there is no architecture to assemble from scratch. Here instead is the
       <b>recipe of PaLM's design</b> &mdash; the choices you would copy to build a model in its style:</p>
       <ol>
        <li><b>Start from a decoder-only Transformer</b> (left-to-right next-token prediction), the GPT
        family.</li>
        <li><b>Use SwiGLU</b> in every MLP: split the input down two matrices $W, V$; gate
        $\\text{Swish}(xW)$ times $xV$; shrink the hidden width to $\\tfrac{2}{3}$ to keep parameters matched.</li>
        <li><b>Use parallel blocks</b>: $y = x + \\text{MLP}(\\text{LayerNorm}(x)) +
        \\text{Attention}(\\text{LayerNorm}(x))$; one LayerNorm, fused input projections.</li>
        <li><b>Use multi-query attention</b>: one shared key and one shared value across heads, per-head
        queries &mdash; for cheap decoding.</li>
        <li><b>Use RoPE</b> position embeddings; <b>share</b> input and output embedding matrices; use
        <b>no bias</b> terms anywhere.</li>
        <li><b>Tokenize</b> with a 256k SentencePiece vocabulary; pretrain on a large multilingual corpus
        (780B tokens for PaLM 540B).</li>
        <li><b>Train across thousands of TPU chips with Pathways</b>, tuning the sharding to keep model FLOPs
        utilization high (PaLM hit 46.2%).</li>
       </ol>`,
    results:
      `<p><b>Scale (abstract, &sect;4):</b> "a 540-billion parameter, densely activated, Transformer language
       model" trained "on 6144 TPU v4 chips using Pathways." Efficiency: "model FLOPs utilization (MFU) of
       46.2%" and "hardware FLOPs utilization of 57.8%" (&sect;4).</p>
       <p><b>Breadth (abstract):</b> PaLM achieves "state-of-the-art few-shot learning results on hundreds of
       language understanding and generation benchmarks," and on BIG-bench it surpasses "the average score of
       the humans asked to solve the same tasks" (&sect;6.2, quoted).</p>
       <p><b>Discontinuous gains (&sect;6.2, quoted):</b> "certain capabilities of the model only emerge once
       a certain scale is reached," and "discontinuous improvements from scale are a common phenomenon on
       challenging few-shot language tasks."</p>
       <p><b>Chain-of-thought reasoning (&sect;6.3.1, quoted):</b> "Using 8-shot chain-of-thought prompting in
       combination with an external calculator, PaLM 540B achieves a performance of 58%, which outperforms the
       prior SOTA of 55%" on the GSM8K grade-school math word-problem benchmark.</p>
       <p><i>All numbers above are the paper's own, transcribed from the abstract, &sect;4, &sect;6.2, and
       &sect;6.3.1. Every number in the CODEVIZ below is OUR small illustration &mdash; not the paper's
       measured result.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>read-only</b>, large-scale-result paper: there is no model to build from scratch and no
       single PyTorch primitive to reconstruct. Training a 540B-parameter model needs thousands of TPU chips
       and is far out of scope. What you <i>do</i> instead is <b>understand</b> the architecture bundle &mdash;
       be able to write the SwiGLU gate and the parallel-block formula, and explain what multi-query attention,
       RoPE, shared embeddings, and no-biases each buy &mdash; and <b>read</b> the scale story (Pathways,
       MFU 46.2%, and the discontinuous reasoning jumps).</p>
       <p>The code below is purely <b>conceptual</b> and runs on a CPU in well under a second. It (1) recomputes
       the worked SwiGLU-vs-ReLU example so you can verify the numbers, and (2) draws a synthetic "emergent
       jump" curve to illustrate the <i>shape</i> the paper describes. The activation comparison reflects the
       real SwiGLU formula; the emergent curve uses made-up round numbers and is <b>not</b> any PaLM
       benchmark score.</p>`,
    pitfalls:
      `<ul>
        <li><b>Thinking SwiGLU adds parameters "for free."</b> SwiGLU needs two input matrices, so a fair
        comparison <i>shrinks the hidden width</i> (to $\\tfrac{2}{3}$) to keep the parameter budget equal.
        Its quality gain is from the gating shape, not extra weights. <b>Fix:</b> always parameter-match when
        comparing activations.</li>
        <li><b>Confusing multi-query with multi-head attention.</b> Multi-head gives each head its own key and
        value; <b>multi-query</b> shares one key and one value across all heads (queries stay per-head). The
        win is at <i>decoding</i> time (smaller key/value cache), not training accuracy. <b>Fix:</b> remember
        what is shared ($K$, $V$) and what is not ($Q$).</li>
        <li><b>Reading "emergent" as magic.</b> A discontinuous task-accuracy curve is a <i>measurement</i>
        (&sect;6.2), and how you measure (exact-match vs partial credit, which metric) can change how sharp the
        jump looks. The paper reports the phenomenon; it does not claim a mechanism. <b>Fix:</b> treat
        emergence as an empirical observation, not an explanation.</li>
        <li><b>Mixing up PaLM with sparse models.</b> PaLM is a <b>dense</b> model &mdash; all 540B parameters
        are used for every token. That is different from a sparse mixture-of-experts model (like Switch
        Transformer) where each token uses only a few experts. <b>Fix:</b> "dense" is doing real work in the
        abstract; do not equate parameter count across the two regimes.</li>
        <li><b>Quoting MFU and HFU interchangeably.</b> Model FLOPs utilization (46.2%) counts only useful
        model arithmetic; hardware FLOPs utilization (57.8%) also counts recomputation. They are different
        numbers (&sect;4). <b>Fix:</b> cite the one you mean.</li>
        <li><b>Treating 540B as compute-optimal.</b> Later Chinchilla analysis argued PaLM-era models were
        trained on too few tokens for their size. PaLM is a landmark of <i>scale and systems</i>, not of
        compute-optimal data allocation. <b>Fix:</b> read PaLM and Chinchilla together.</li>
      </ul>`,
    recall: [
      "Write the SwiGLU activation from memory: $\\text{SwiGLU}(x) = ?$ and $\\text{Swish}(z) = ?$.",
      "Write PaLM's parallel-block update and contrast it with the standard serial block.",
      "In multi-query attention, which projections are shared across heads and which are per-head?",
      "List the six §2 architecture choices and one reason the paper gives for each.",
      "State PaLM 540B's chip count, the Pathways framing, and the model FLOPs utilization number (§4).",
      "What does the paper mean by 'discontinuous improvements from scale' (§6.2)?"
    ],
    practice: [
      {
        q: `<b>Recompute the SwiGLU gate.</b> For a hidden unit with gate-branch value $a = 1.0$ and
            value-branch value $b = 4.0$, compute the SwiGLU output $\\text{Swish}(a)\\cdot b$, and compare it
            to the plain ReLU output $\\text{ReLU}(a)$. (Use $e \\approx 2.71828$.)`,
        steps: [
          { do: `Sigmoid of the gate branch: $\\sigma(1.0) = 1/(1 + e^{-1.0}) = 1/(1 + 0.36788) = 0.73106$.`, why: `Swish needs $\\sigma(a)$; $e^{-1} \\approx 0.36788$.` },
          { do: `Swish: $\\text{Swish}(1.0) = 1.0 \\times 0.73106 = 0.73106$.`, why: `$\\text{Swish}(z) = z\\,\\sigma(z)$.` },
          { do: `Gate the value branch: SwiGLU $= 0.73106 \\times 4.0 = 2.92424$. ReLU $= \\max(0, 1.0) = 1.0$.`, why: `SwiGLU multiplies the smooth gate by the second branch $b$; ReLU ignores $b$ and just clips $a$.` }
        ],
        answer: `<p>SwiGLU output $\\approx 0.731 \\times 4.0 = \\mathbf{2.924}$; ReLU output $= \\mathbf{1.0}$.
                 The gate ($\\approx 0.731$) lets most of the value branch through and the result depends on
                 <i>both</i> branches, whereas ReLU passes only the (clipped) gate input and discards the
                 value branch entirely. This is the gating behaviour the CODEVIZ plots.</p>`
      },
      {
        q: `<b>Count the savings in a parallel block.</b> Compare the standard serial block
            $y = x + \\text{MLP}(\\text{LayerNorm}(x + \\text{Attention}(\\text{LayerNorm}(x))))$ with PaLM's
            parallel block $y = x + \\text{MLP}(\\text{LayerNorm}(x)) + \\text{Attention}(\\text{LayerNorm}(x))$.
            (a) How many LayerNorm calls per block in each? (b) Which two input projections can be fused in the
            parallel form, and why does that need them to act on the same vector?`,
        steps: [
          { do: `Count LayerNorms in the serial block: one before Attention on $x$, one before the MLP on $(x + \\text{Attention}(...))$ — that is 2 distinct calls on 2 distinct inputs.`, why: `Each sublayer normalizes its own input, and those inputs differ.` },
          { do: `Count LayerNorms in the parallel block: both branches read $\\text{LayerNorm}(x)$ — that is 1 call, shared.`, why: `In the parallel form both sublayers consume the identical normalized vector.` },
          { do: `Identify the fusable projections: the MLP's input matrix and attention's query/key/value projection both multiply $\\text{LayerNorm}(x)$, so they can be concatenated into one matmul.`, why: `Two matrices applied to the same input vector are equivalent to one stacked matrix applied once — a single larger matmul, which is faster on a TPU.` }
        ],
        answer: `<p>(a) Serial block: <b>2</b> LayerNorm calls (different inputs). Parallel block: <b>1</b>
                 LayerNorm call, shared by both branches. (b) The MLP's first-layer projection and attention's
                 QKV projection both act on the <i>same</i> vector $\\text{LayerNorm}(x)$, so they can be fused
                 into a single large matrix multiply. The fusion is only possible <i>because</i> both branches
                 read the same input — that is exactly what the parallel form arranges. One LayerNorm plus one
                 fused matmul is the source of the "roughly 15% faster training at large scales" (§2).</p>`
      },
      {
        q: `<b>Ablation — break the parallel block.</b> Suppose you revert PaLM 540B to <i>serial</i> blocks
            (the standard form) and change nothing else. Per the paper's own statements, predict the effect on
            (a) training speed and (b) final quality at the 540B scale, and explain the mechanism for each.`,
        steps: [
          { do: `Speed: reverting to serial restores two LayerNorm calls and unfused projections, so you lose the "roughly 15% faster training speed at large scales" (§2).`, why: `The parallel form's speed came precisely from the single LayerNorm and the fused input matmul; undo it and the work returns.` },
          { do: `Quality: the paper reports the parallel form's quality cost is small at 8B and shrinks at 62B (negligible by large scale), so reverting buys little or no quality at 540B.`, why: `The empirical finding is that the parallel-vs-serial quality gap closes as scale grows.` },
          { do: `Conclude the trade: at 540B, serial is slower with no meaningful quality gain — so PaLM keeps parallel.`, why: `That is the paper's justification for the choice: speed for negligible cost at scale.` }
        ],
        answer: `<p>(a) Training gets <b>slower</b> — you give back the ~15% speedup, because the two
                 efficiency sources (single shared LayerNorm, fused input projection) are gone. (b) Final
                 quality at 540B is <b>essentially unchanged</b>: the paper found the parallel form's quality
                 cost is small at 8B and negligible by large scale. So the ablation is a clear loss — slower
                 training for no quality payoff — which is exactly why PaLM adopts parallel layers (§2). This
                 illustrates the general theme: several PaLM choices trade a tiny small-scale cost for a real
                 large-scale benefit.</p>`
      }
    ]
  });

  window.CODE["paper-palm"] = {
    lib: "NumPy",
    runnable: false,
    explain:
      `<p>This is a <b>read-only</b> paper, so there is no model to train or verify. The snippet below is a
       tiny <b>conceptual illustration</b>, CPU-only, runs in under a second. It (1) recomputes the worked
       SwiGLU example through the real formula $\\text{Swish}(a)\\cdot b$, checking $5.285$ for $(a,b)=(2,3)$
       and $-0.807$ for $(a,b)=(-1,3)$, and compares against plain ReLU; and (2) builds a synthetic
       "emergent jump" accuracy-vs-scale curve to show the <i>shape</i> the paper describes (&sect;6.2). The
       activation numbers reflect SwiGLU's true formula; the emergent curve uses round, made-up numbers and
       is <b>NOT</b> any PaLM benchmark score.</p>`,
    code: `import numpy as np

# ---------------------------------------------------------------------------
# (1) WORKED EXAMPLE: SwiGLU gate  Swish(a) * b  vs plain ReLU(a).
#     This is the REAL SwiGLU formula from the paper (Sec 2), on toy scalars.
# ---------------------------------------------------------------------------
def sigmoid(z): return 1.0 / (1.0 + np.exp(-z))
def swish(z):   return z * sigmoid(z)          # Swish(z) = z * sigmoid(z)
def swiglu(a, b): return swish(a) * b          # SwiGLU = Swish(xW) . xV
def relu(z):    return np.maximum(0.0, z)

for a, b in [(2.0, 3.0), (-1.0, 3.0), (1.0, 4.0)]:
    print("a=%5.1f b=%5.1f | SwiGLU=%.5f | ReLU(a)=%.5f" % (
          a, b, swiglu(a, b), relu(a)))
# a=  2.0 b=  3.0 | SwiGLU=5.28478 | ReLU(a)=2.00000
# a= -1.0 b=  3.0 | SwiGLU=-0.80682 | ReLU(a)=0.00000
# a=  1.0 b=  4.0 | SwiGLU=2.92423 | ReLU(a)=1.00000
# SwiGLU depends on BOTH branches and leaks a small signed value where ReLU
# hard-clips to 0. These match the worked example in the lesson.

# ---------------------------------------------------------------------------
# (2) SYNTHETIC "EMERGENT JUMP": accuracy vs log10(model params). The paper
#     reports many tasks stay near chance, then jump sharply with scale
#     (Sec 6.2). We MAKE UP a smooth step to show the SHAPE -- these are NOT
#     PaLM's numbers and not any real benchmark.
# ---------------------------------------------------------------------------
log_params = np.array([8.0, 9.0, 10.0, 11.0, 12.0])   # ~1e8 .. 1e12 params
threshold, sharpness, chance, ceiling = 11.0, 4.0, 0.05, 0.85
acc = chance + (ceiling - chance) * sigmoid(sharpness * (log_params - threshold))
print("\\nsynthetic emergent curve (ILLUSTRATION ONLY, not PaLM numbers):")
for lp, a in zip(log_params, acc):
    print("  log10(params)=%.1f  acc=%.3f" % (lp, a))
# synthetic emergent curve (ILLUSTRATION ONLY, not PaLM numbers):
#   log10(params)=8.0  acc=0.050
#   log10(params)=9.0  acc=0.050
#   log10(params)=10.0 acc=0.064
#   log10(params)=11.0 acc=0.450
#   log10(params)=12.0 acc=0.836
# Flat-then-jump: the shape the paper calls "discontinuous improvements from
# scale" (Sec 6.2). Round, made-up numbers -- NOT a PaLM benchmark.`
  };

  window.CODEVIZ["paper-palm"] = {
    question: "Two illustrations of PaLM ideas on toy data: (1) how does the SwiGLU gate Swish(a)*b differ from plain ReLU(a) across inputs? (2) what does a 'discontinuous improvement from scale' curve look like? (All numbers ours, not the paper's.)",
    charts: [
      {
        type: "line",
        title: "SwiGLU gate vs ReLU on the same gate input (value branch b=3) — OUR illustration of the activation shape",
        xlabel: "gate-branch input a  (one entry of xW)",
        ylabel: "activation output",
        series: [
          {
            name: "SwiGLU output  Swish(a)*b  (b=3)",
            color: "#7ee787",
            points: [[-3.0,-0.4268],[-2.0,-0.7152],[-1.0,-0.8068],[0.0,0.0],[1.0,2.1932],[2.0,5.2848],[3.0,8.5732]]
          },
          {
            name: "ReLU(a)  (ignores the value branch)",
            color: "#ff7b72",
            points: [[-3.0,0.0],[-2.0,0.0],[-1.0,0.0],[0.0,0.0],[1.0,1.0],[2.0,2.0],[3.0,3.0]]
          }
        ]
      },
      {
        type: "line",
        title: "Synthetic 'emergent jump': accuracy vs model scale — OUR illustration, NOT PaLM's numbers",
        xlabel: "log10(model parameters)  [synthetic]",
        ylabel: "task accuracy  [synthetic, arbitrary task]",
        series: [
          {
            name: "synthetic accuracy (flat then jumps)",
            color: "#79c0ff",
            points: [[8.0,0.050],[9.0,0.050],[10.0,0.064],[11.0,0.450],[12.0,0.836]]
          },
          {
            name: "chance baseline",
            color: "#8b949e",
            points: [[8.0,0.050],[12.0,0.050]]
          }
        ]
      }
    ],
    caption: "BOTH panels are OUR small illustrations, not the paper's measured numbers. LEFT: the REAL SwiGLU formula Swish(a)*b (Swish(z)=z*sigmoid(z)) with value branch b=3, against plain ReLU(a). SwiGLU is smooth, depends on BOTH branches, and leaks a small signed value for negative a (e.g. a=-1 gives -0.807), where ReLU hard-clips to 0. This is the gated MLP non-linearity PaLM adopts (Sec 2). RIGHT: a made-up accuracy-vs-scale curve (chance=0.05, ceiling=0.85, a logistic step at log10(params)=11) that is flat near chance then jumps sharply — the SHAPE the paper calls 'discontinuous improvements from scale' (Sec 6.2). The y-values are round, invented numbers for teaching; PaLM's real BIG-bench and GSM8K results (e.g. 58% on GSM8K with 8-shot chain-of-thought, Sec 6.3.1) are in the paper, NOT reproduced here.",
    code: `import numpy as np

def sigmoid(z): return 1.0 / (1.0 + np.exp(-z))
def swish(z):   return z * sigmoid(z)

# LEFT panel: SwiGLU gate Swish(a)*b (b=3) vs ReLU(a) -- the REAL formula.
a = np.array([-3.0, -2.0, -1.0, 0.0, 1.0, 2.0, 3.0])
b = 3.0
swiglu = swish(a) * b
relu   = np.maximum(0.0, a)
print("a       SwiGLU(*b=3)   ReLU(a)")
for ai, si, ri in zip(a, swiglu, relu):
    print("  %5.1f   %8.4f   %6.4f" % (ai, si, ri))
# a       SwiGLU(*b=3)   ReLU(a)
#   -3.0    -0.4268   0.0000
#   -2.0    -0.7152   0.0000
#   -1.0    -0.8068   0.0000
#    0.0     0.0000   0.0000
#    1.0     2.1932   1.0000
#    2.0     5.2848   2.0000
#    3.0     8.5732   3.0000

# RIGHT panel: SYNTHETIC emergent jump -- ROUND, MADE-UP numbers, NOT PaLM's.
log_params = np.array([8.0, 9.0, 10.0, 11.0, 12.0])
threshold, sharpness, chance, ceiling = 11.0, 4.0, 0.05, 0.85
acc = chance + (ceiling - chance) * sigmoid(sharpness * (log_params - threshold))
print("\\nsynthetic emergent curve (ILLUSTRATION ONLY):")
for lp, ac in zip(log_params, acc):
    print("  log10(params)=%.1f  acc=%.3f" % (lp, ac))
# synthetic emergent curve (ILLUSTRATION ONLY):
#   log10(params)=8.0  acc=0.050
#   log10(params)=9.0  acc=0.050
#   log10(params)=10.0 acc=0.064
#   log10(params)=11.0 acc=0.450
#   log10(params)=12.0 acc=0.836
# Flat near chance, then a sharp jump: the SHAPE the paper calls 'discontinuous
# improvements from scale' (Sec 6.2). NOT a real PaLM benchmark score.`
  };
})();
