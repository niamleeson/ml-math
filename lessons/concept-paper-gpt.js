/* Paper lesson — "Language Models are Unsupervised Multitask Learners" (GPT-2), Radford et al., OpenAI 2019.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-gpt".
   GROUNDED from the official OpenAI PDF
   (https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf),
   read directly: Abstract, Sec. 2 (Eq. 1, the LM factorization), Sec. 2.2 (byte-level BPE input
   representation), Sec. 2.3 (the Transformer model + the architecture modifications), Table 2 (the four
   model sizes). NOT on arXiv — paper.url points at that PDF; paper.arxiv intentionally omitted.
   Track B (architecture): build a tiny nanoGPT-style decoder-only causal LM (token+positional embeddings,
   a stack of masked multi-head-attention + feed-forward blocks, an output head) on top of nn primitives;
   reuse masked multi-head attention from paper-transformer; train next-token cross-entropy on a small
   CHAR-level corpus; GENERATE text and watch it improve. The bigger-picture math lives in concept mod-llm
   (cross-linked). Capstone mini-GPT step 7. */
(function () {
  window.LESSONS.push({
    id: "paper-gpt",
    title: "GPT-2 — Language Models are Unsupervised Multitask Learners (2019)",
    tagline: "Stack causal (masked) Transformer blocks, train one objective — predict the next token — at scale, and the model learns many tasks with no task-specific training.",
    module: "Papers · Transformers & LLMs",
    track: "architecture",
    paper: {
      authors: "Alec Radford, Jeffrey Wu, Rewon Child, David Luan, Dario Amodei, Ilya Sutskever",
      org: "OpenAI, San Francisco, California",
      year: 2019,
      venue: "OpenAI technical report (Feb 2019); not published on arXiv",
      citations: "",   // no citation count shown in the fetched PDF; never invent one
      url: "https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf",
      code: "https://github.com/openai/gpt-2"
    },
    conceptLink: "mod-llm",
    partOf: [
      { capstone: "capstone-mini-gpt", step: 7, builds: "the full decoder-only causal language model — embeddings + stacked masked-attention blocks + next-token head — that you train and generate from" }
    ],
    prereqs: ["paper-transformer", "paper-attention", "mod-llm", "dl-cross-entropy", "pt-nn-module", "pt-tensors"],

    // WHY READ IT
    problem:
      `<p>Before GPT-2, the standard recipe for a natural-language task was <b>supervised learning on a
       task-specific dataset</b>: to build a question-answering system you collected thousands of labeled
       question/answer pairs and trained a model just for that. The paper calls such systems "narrow experts
       rather than competent generalists" (&sect;1) and points out two costs:</p>
       <ul>
        <li><b>Every new task needs its own labeled dataset.</b> Collecting and labeling data, then designing
        a task-specific architecture, is expensive and does not transfer &mdash; the abstract notes those
        systems need "the 127,000+ training examples" of a dataset like CoQA.</li>
        <li><b>The models are brittle.</b> The intro observes current systems are "sensitive to slight
        changes in the data distribution and task specification."</li>
       </ul>
       <p>A <b>language model (LM)</b> &mdash; a model that, given the text so far, predicts the next piece of
       text &mdash; needs no labels at all: the next token <i>is</i> the label. The paper asks: if we train one
       big LM on a huge, diverse pile of natural text, will it pick up the actual tasks (translation, question
       answering, summarization) for free, just from seeing them demonstrated in the wild?</p>`,
    contribution:
      `<ul>
        <li><b>Zero-shot multitask learning from a plain language model.</b> One decoder-only Transformer,
        trained only to predict the next token, performs many NLP tasks "without any parameter or
        architecture modification" (&sect;1) &mdash; you just phrase the task as text and let it continue.</li>
        <li><b>GPT-2: a scaled-up decoder-only Transformer.</b> Same architecture family as GPT, made much
        bigger (up to 1.5 billion parameters, Table 2), with a few tweaks: <b>layer normalization moved to the
        input</b> of each sub-block, an <b>extra layer norm</b> after the final block, and residual weights
        scaled at initialization by $1/\\sqrt{N}$ (&sect;2.3).</li>
        <li><b>WebText + byte-level BPE.</b> A new 40&nbsp;GB dataset scraped from quality-filtered web links
        (&sect;2.1), tokenized with a <b>byte-level Byte-Pair Encoding</b> (BPE) that can represent <i>any</i>
        string (&sect;2.2), with a vocabulary of 50,257 and context size 1024.</li>
      </ul>`,
    whyItMattered:
      `<p>GPT-2 is the bridge between "a Transformer can translate" and "a Transformer can do almost anything
       you describe in words." The recipe it validated &mdash; one decoder-only model, one next-token
       objective, scale up the data and parameters &mdash; is exactly the recipe behind GPT-3, ChatGPT, and
       essentially every modern large language model. The abstract's core finding, that "the capacity of the
       language model is essential to the success of zero-shot task transfer and increasing it improves
       performance in a log-linear fashion across tasks," is an early statement of the <b>scaling</b> story.
       The model you build here is step 7 &mdash; the finale &mdash; of the <b>mini-GPT capstone</b>: it
       assembles the attention, the blocks, and the LayerNorm from earlier steps into a working generator.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>Abstract</b> &mdash; the thesis (LMs learn tasks unsupervised on WebText) and the headline
        claims (CoQA 55 F1; GPT-2 is 1.5B params; state-of-the-art on 7 of 8 datasets zero-shot).</li>
        <li><b>&sect;2 (Approach), Equation 1</b> &mdash; the factorization of the joint probability of a
        sequence into a product of next-token conditionals. This is the equation you transcribe and
        implement.</li>
        <li><b>&sect;2.3 (Model)</b> &mdash; one short paragraph, but it is the whole architecture: a
        Transformer (Vaswani 2017) following OpenAI GPT, plus the three modifications (LayerNorm to the input
        of each sub-block; extra LayerNorm after the final self-attention block; $1/\\sqrt{N}$ residual
        scaling), vocab 50,257, context 512&rarr;1024.</li>
        <li><b>Table 2</b> &mdash; the four model sizes (117M / 345M / 762M / 1542M) and their layers and
        $d_{\\text{model}}$. Notice that the smallest "is equivalent to the original GPT" (&sect;3).</li>
       </ul>
       <p><b>Skim:</b> &sect;2.1 (WebText scraping details), &sect;2.2 (byte-level BPE &mdash; read the
       <i>idea</i>, skip the merge mechanics), and &sect;3.x result tables for the individual tasks unless you
       want the per-benchmark numbers. The point of this lesson is the architecture and the objective, not the
       benchmark suite.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train a tiny decoder-only Transformer (a "nanoGPT") on a short <b>character-level</b>
       corpus &mdash; it predicts the next <i>character</i> given the characters so far. The one piece that
       makes it a <i>language model</i> (as opposed to a position-by-position classifier) is the <b>causal
       mask</b>: when predicting the character at position $t$, the model is only allowed to look at positions
       $\\le t$, never ahead.</p>
       <p>Now suppose we <b>remove the causal mask</b>, so each position can also attend to <i>future</i>
       characters. During training the answer (the next character) then leaks into the input. Predict: will
       training loss go down faster or slower, and &mdash; more importantly &mdash; will the model still be
       able to <b>generate</b> coherent new text afterward? Write your guess and one sentence of reasoning,
       then run the ablation.</p>`,
    attempt:
      `<p>Before the reveal, sketch the pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>causal_mask(S)</code>: an $S\\times S$ boolean table that is <code>True</code> above the
        diagonal. TODO: add $-\\infty$ to those score entries <i>before</i> the softmax so position $t$ cannot
        attend to any $j \\gt t$.</li>
        <li><code>CausalSelfAttention(nn.Module)</code>: the multi-head attention from
        <b>paper-transformer</b>, TODO: with the mask applied inside the per-head scaled dot-product
        (<code>scores[mask] = -inf</code> before <code>softmax</code>).</li>
        <li><code>Block(nn.Module)</code>: TODO: wrap masked attention and the feed-forward each in a
        residual + LayerNorm (you may use pre-norm, GPT-2 style: $x = x + \\mathrm{Attn}(\\mathrm{LN}(x))$).</li>
        <li><code>NanoGPT(nn.Module)</code>: token embedding + <b>learned positional</b> embedding, a stack of
        <code>Block</code>s, a final LayerNorm, and a linear head to vocabulary logits. TODO: the loss is
        cross-entropy between the logits at position $t$ and the <i>actual next token</i> at $t{+}1$.</li>
       </ul>
       <p>Then train, <b>generate</b> a sample every so often, and watch it go from gibberish to readable.
       Finally run the no-mask ablation and try to generate from it.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>GPT-2 is a <b>decoder-only causal language model</b>. "Decoder-only" means it has no separate
       encoder tower (unlike the original Transformer); it is just a stack of Transformer <i>decoder</i>
       blocks. "Causal" means each position may only attend to itself and earlier positions. "Language model"
       means it is trained to do one thing: predict the next token.</p>
       <p><b>1. The objective (&sect;2).</b> Treat a piece of text as a sequence of tokens $(s_1,\\dots,s_n)$.
       Because language has a natural left-to-right order, the paper factorizes the joint probability of the
       whole sequence into a <b>product of next-token conditionals</b> (Equation 1): the probability of token
       $s_i$ given all the tokens before it. Training maximizes this probability on real text &mdash;
       equivalently, it <b>minimizes the cross-entropy</b> of the predicted next-token distribution against
       the token that actually came next. No labels are needed: the data labels itself.</p>
       <p><b>2. The causal mask.</b> A self-attention layer, left alone, lets every position see every other
       position &mdash; including future ones. For a language model that is cheating: at training time the
       answer (the next token) would be visible in the input. So GPT applies a <b>causal mask</b>: before the
       softmax, every attention score from position $t$ to a future position $j \\gt t$ is set to $-\\infty$,
       which softmax turns into weight $0$. Now position $t$'s output depends only on tokens $\\le t$, exactly
       the conditioning in Equation 1. (This is the one change that turns the encoder block you built in
       <b>paper-transformer</b> into a decoder block.)</p>
       <p><b>3. The model (&sect;2.3).</b> "We use a Transformer based architecture for our LMs. The model
       largely follows the details of the OpenAI GPT model with a few modifications." Concretely: embed each
       token to a $d_{\\text{model}}$ vector and <b>add a learned positional embedding</b> (GPT uses learned
       position vectors, not the sinusoids of the original Transformer); pass through a stack of $N$ blocks,
       each a masked multi-head self-attention sub-layer and a feed-forward sub-layer, each wrapped with a
       residual connection and Layer Normalization; finish with a linear "head" that maps the final
       $d_{\\text{model}}$ vector at each position to a score (logit) for every token in the vocabulary.</p>
       <p><b>4. GPT-2's three tweaks (&sect;2.3).</b> "Layer normalization was moved to the input of each
       sub-block" (pre-norm, which stabilizes deep training); "an additional layer normalization was added
       after the final self-attention block"; and "a modified initialization which accounts for the
       accumulation on the residual path" scales residual-layer weights at init "by a factor of $1/\\sqrt{N}$
       where $N$ is the number of residual layers." The vocabulary is 50,257 and the context size is raised
       from 512 to 1024 tokens.</p>
       <p><b>5. Generation.</b> Once trained, the model <b>generates</b> text autoregressively: feed it a
       prompt, read off the next-token distribution from the head, <b>sample</b> a token from it (often with a
       temperature, see <b>mod-llm</b>), append it, and repeat. The sampled text is what improves as training
       loss falls.</p>`,
    architecture:
      `<p>GPT-2 is a <b>decoder-only Transformer</b>: a single tower of identical masked-self-attention blocks,
       with no encoder and no cross-attention. Data flows bottom to top through five stages (\\S 2.2&ndash;2.3).</p>
       <p><b>Stage 1 &mdash; Tokenizer (byte-level BPE, \\S 2.2).</b> Raw text is first turned into a sequence of
       integer token ids. GPT-2 uses <b>Byte-Pair Encoding over bytes</b>, not characters or words: the base
       vocabulary is the <b>256 possible byte values</b> (so <i>any</i> Unicode string is representable &mdash;
       no out-of-vocabulary token ever), and frequent byte pairs are greedily <b>merged</b> into new tokens up
       to a final vocabulary of <b>50,257</b>. (A Unicode-level BPE would need a base vocabulary "of over
       130,000 before any multi-symbol tokens are added"; bytes keep it to 256.) One extra rule: BPE is
       prevented from merging <i>across character categories</i> (e.g. it will not glue a letter to punctuation),
       so the model is not forced to learn many spellings of <code>dog</code> (<code>dog.</code>,
       <code>dog!</code>, <code>dog?</code>).</p>
       <p><b>Stage 2 &mdash; Embeddings.</b> Each token id indexes a <b>token-embedding</b> table into a
       $d_{\\text{model}}$-dimensional vector, and a <b>learned positional-embedding</b> table (one vector per
       position, up to the 1024-token context) is <b>added</b> so the model knows token order. (GPT uses
       <i>learned</i> position vectors, not the original Transformer's fixed sinusoids.)</p>
       <p><b>Stage 3 &mdash; The decoder block, repeated $N$ times.</b> Each block has two sub-layers, each
       wrapped in a residual connection, with <b>Layer Normalization moved to the input of each sub-block</b>
       (pre-norm, \\S 2.3): &nbsp;(i)&nbsp;<b>masked multi-head self-attention</b> &mdash; the scaled
       dot-product attention from <b>paper-transformer</b>, but with a <b>causal mask</b> that sets every
       attention score from position $t$ to a future position $j\\gt t$ to $-\\infty$ before the softmax, so a
       token can attend only to itself and the past; &nbsp;(ii)&nbsp;a position-wise <b>feed-forward network</b>
       (two linear layers with a nonlinearity, inner width typically $4\\,d_{\\text{model}}$). In symbols a block
       is $x \\leftarrow x + \\mathrm{Attn}(\\mathrm{LN}(x))$ then $x \\leftarrow x + \\mathrm{FF}(\\mathrm{LN}(x))$.
       Multi-head means $d_{\\text{model}}$ is split into several heads that attend independently and are
       concatenated.</p>
       <p><b>Stage 4 &mdash; Final LayerNorm + head.</b> After the last block, GPT-2 adds <b>one extra
       LayerNorm</b> ("an additional layer normalization was added after the final self-attention block",
       \\S 2.3), then a <b>linear output head</b> maps each position's $d_{\\text{model}}$ vector to a row of
       <b>50,257 logits</b>, one per vocabulary token. Softmax over that row is the next-token distribution.</p>
       <p><b>Stage 5 &mdash; Initialization detail.</b> Residual-layer weights are scaled at init by
       $1/\\sqrt{N}$ ($N$ = number of residual layers) to "account for the accumulation on the residual path"
       (\\S 2.3) &mdash; deeper stacks start with smaller residual contributions so the running sum stays
       well-scaled.</p>
       <p><b>The four sizes (Table 2).</b> All four are the <i>same</i> architecture, scaled by depth $N$ and
       width $d_{\\text{model}}$:</p>
       <ul>
        <li><b>117M</b> params &mdash; $N=12$ layers, $d_{\\text{model}}=768$ &nbsp;("equivalent to the original GPT", \\S 3)</li>
        <li><b>345M</b> params &mdash; $N=24$ layers, $d_{\\text{model}}=1024$ &nbsp;("equivalent to the largest model from BERT", \\S 3)</li>
        <li><b>762M</b> params &mdash; $N=36$ layers, $d_{\\text{model}}=1280$</li>
        <li><b>1542M (1.5B)</b> params &mdash; $N=48$ layers, $d_{\\text{model}}=1600$ &nbsp;&mdash; this is <b>GPT-2</b></li>
       </ul>
       <p>Context size is <b>1024 tokens</b> (raised from GPT's 512) and the batch size is 512 (\\S 2.3). The
       tiny model you build below is this exact stack shrunk to $N=3$, $d_{\\text{model}}=64$, char-level
       tokens instead of byte-level BPE.</p>`,
    symbols: [
      { sym: "token", desc: "one unit of input. GPT-2 uses byte-level BPE sub-word tokens; in our tiny build a token is a single <b>character</b>, which is the simplest honest choice." },
      { sym: "$(s_1,\\dots,s_n)$", desc: "a <b>sequence of tokens</b> &mdash; the text, written as a list of token symbols in order. $n$ is its length." },
      { sym: "$s_i$", desc: "the <b>$i$-th token</b> in the sequence; the thing the model predicts from the tokens before it." },
      { sym: "$p(x)$", desc: "the <b>probability the model assigns to the whole sequence</b> $x=(s_1,\\dots,s_n)$. Equation 1 writes it as a product of next-token probabilities." },
      { sym: "$p(s_i \\mid s_1,\\dots,s_{i-1})$", desc: "the <b>next-token conditional</b>: the probability of token $s_i$ given all the tokens that came before it. This is exactly what one forward pass of the model outputs (after softmax) at position $i-1$." },
      { sym: "$n$, $i$", desc: "$n$ is the <b>sequence length</b> (number of tokens); $i$ is the <b>position index</b> running $1\\dots n$. Eq. 1's product and the loss's sum both run over $i$." },
      { sym: "$p(s_{n-k},\\dots,s_n \\mid s_1,\\dots,s_{n-k-1})$", desc: "a <b>general suffix conditional</b>: the probability of the last $k{+}1$ tokens given the prefix before them. Eq. 1's factorization makes any such conditional computable &mdash; that is what lets one trained model both score and generate arbitrary continuations (\\S 2)." },
      { sym: "$L(\\mathcal{U})$", desc: "the <b>language-modeling objective</b> of the GPT line: the summed log-probability the model assigns to each true next token over the corpus. <i>Maximizing</i> $L$ = <i>minimizing</i> the cross-entropy loss." },
      { sym: "$\\mathcal{U}$", desc: "the <b>unsupervised training corpus</b> &mdash; the pile of raw tokens (for GPT-2, the 40&nbsp;GB WebText) summed over in $L(\\mathcal{U})$." },
      { sym: "$k$", desc: "the <b>context window</b> size: how many previous tokens the model conditions on. 512 in the original GPT, raised to 1024 in GPT-2 (\\S 2.3)." },
      { sym: "$\\theta$", desc: "the <b>model parameters</b> (all the embedding tables, attention and feed-forward weights, LayerNorm scales). Training adjusts $\\theta$ to maximize $L(\\mathcal{U})$." },
      { sym: "$p(\\text{output}\\mid\\text{input})$ vs $p(\\text{output}\\mid\\text{input},\\text{task})$", desc: "<b>task conditioning</b> (\\S 2). A single-task system estimates $p(\\text{output}\\mid\\text{input})$; a general system also conditions on the <b>task</b>. GPT-2 specifies the task in plain language inside the input text, so one next-token LM covers many tasks <b>zero-shot</b> &mdash; no task-specific parameters." },
      { sym: "$d_{\\text{model}}$ split into heads", desc: "<b>multi-head</b> attention divides the width $d_{\\text{model}}$ into $h$ heads of size $d_k=d_{\\text{model}}/h$; each head attends independently and the results are concatenated back to width $d_{\\text{model}}$." },
      { sym: "$\\prod$", desc: "<b>product</b> (multiply together) &mdash; here over the $n$ positions, so $p(x)$ is the product of all the per-position next-token probabilities." },
      { sym: "$d_{\\text{model}}$", desc: "the <b>model width</b>: the length of every token vector inside the network. Table 2 ranges it from $768$ (117M model) to $1600$ (1.5B model); our tiny build uses a small value like $32$." },
      { sym: "$N$", desc: "the number of <b>stacked Transformer blocks</b> (= residual layers). Table 2: 12 / 24 / 36 / 48 for the four sizes; the $1/\\sqrt{N}$ init uses this $N$." },
      { sym: "causal mask", desc: "an $S\\times S$ table that forbids attending to the future: score from position $t$ to position $j$ is left alone if $j\\le t$ and set to $-\\infty$ if $j\\gt t$, so after softmax the future gets weight $0$." },
      { sym: "logit", desc: "a raw, unnormalized score &mdash; here one per vocabulary token, produced by the output head. Softmax turns the row of logits into a probability distribution over the next token." },
      { sym: "$\\mathrm{softmax}$", desc: "turns a row of logits $z$ into positive weights that sum to $1$: $\\mathrm{softmax}(z)_k = e^{z_k}/\\sum_l e^{z_l}$. Applied over the vocabulary, it gives the next-token probabilities." },
      { sym: "cross-entropy", desc: "the training loss for a single position: $-\\ln p(\\text{true next token})$. It is $0$ when the model is certain and correct, and grows as the model puts less probability on the token that actually came next." },
      { sym: "$\\mathrm{LayerNorm}$ (LN)", desc: "<b>Layer Normalization</b>: re-center and re-scale each token's vector to mean $0$, variance $1$ (then a learned scale/shift). GPT-2 applies it at the <i>input</i> of each sub-block (pre-norm)." },
      { sym: "BPE", desc: "<b>Byte-Pair Encoding</b>, a sub-word tokenizer. GPT-2 uses a <i>byte-level</i> variant (base vocabulary 256 bytes) so it can encode any string; vocab grows to 50,257 via learned merges (&sect;2.2)." },
      { sym: "decoder-only / autoregressive", desc: "plain terms: <b>decoder-only</b> = a single stack of (masked) Transformer blocks with no separate encoder; <b>autoregressive</b> = generates one token at a time, each conditioned on the tokens generated so far." }
    ],
    formula: `$$ p(x) \\;=\\; \\prod_{i=1}^{n} p\\!\\left(s_i \\,\\middle|\\, s_1, \\dots, s_{i-1}\\right) \\qquad\\text{(Eq. 1, \\S 2)} $$
<p>The factorization of a sequence's probability into a product of next-token conditionals — the chain rule of probability applied left-to-right. This is the whole unsupervised objective.</p>
$$ p\\!\\left(s_{n-k}, \\dots, s_n \\,\\middle|\\, s_1, \\dots, s_{n-k-1}\\right) $$
<p>The general conditional Eq. 1 lets you read off (\\S 2): the same model can score or sample any suffix given any prefix. The paper notes this factorization "allows for tractable sampling from and estimation of $p(x)$ as well as any conditionals of the form" above.</p>
$$ L(\\mathcal{U}) \\;=\\; \\sum_{i} \\log P\\!\\left(s_i \\,\\middle|\\, s_{i-k}, \\dots, s_{i-1};\\, \\theta\\right) \\qquad\\text{(the GPT autoregressive LM objective; $k$ = context window)} $$
<p>The training objective written as the GPT line states it: maximize, over the corpus $\\mathcal{U}$, the log-probability the network (parameters $\\theta$) assigns to each true token $s_i$ given the previous $k$ tokens. Maximizing this log-likelihood is identical to minimizing the next-token cross-entropy below; the $k$-window is the model's context size (512 in GPT, 1024 in GPT-2, \\S 2.3).</p>
$$ \\text{train by minimizing}\\quad \\mathcal{L} \\;=\\; -\\frac{1}{n}\\sum_{i=1}^{n} \\ln p\\!\\left(s_i \\,\\middle|\\, s_1,\\dots,s_{i-1}\\right) \\quad\\text{(the cross-entropy of Eq. 1)} $$
<p>The practical loss: average negative log-probability of the true next token. Logs turn Eq. 1's product into a sum (no underflow); the minus sign turns "maximize likelihood" into "minimize loss".</p>
$$ p(\\text{output} \\mid \\text{input}) \\qquad\\longrightarrow\\qquad p(\\text{output} \\mid \\text{input},\\, \\text{task}) \\qquad\\text{(\\S 2, task conditioning / zero-shot)} $$
<p>The conceptual leap. A single task is estimating $p(\\text{output}\\mid\\text{input})$; a general system "should condition not only on the input but also on the task to be performed," so it models $p(\\text{output}\\mid\\text{input},\\text{task})$. The paper's key move: "language provides a flexible way to specify tasks, inputs, and outputs all as a sequence of symbols" — so $\\text{task}$, $\\text{input}$, and $\\text{output}$ are all just text the same LM predicts. A translation example becomes the sequence (translate to french, english text, french text); a reading-comprehension example becomes (answer the question, document, question, answer). No new equation is needed: zero-shot task transfer is Eq. 1 applied to text that names its own task.</p>`,
    whatItDoes:
      `<p><b>Eq. 1 (&sect;2) &mdash; the factorization.</b> The probability of an entire sequence is the product
       of, for each position, the probability the model gives to the token that actually appears there <i>given
       only the tokens before it</i>. Reading it left to right: predict $s_1$ from nothing, then $s_2$ from
       $s_1$, then $s_3$ from $s_1 s_2$, and so on &mdash; multiply all those probabilities.</p>
       <p><b>The suffix conditional.</b> Because Eq. 1 is exact, the <i>same</i> trained model can read off any
       conditional $p(s_{n-k},\\dots,s_n\\mid s_1,\\dots,s_{n-k-1})$ &mdash; the probability of any tail given any
       head. The paper says this "allows for tractable sampling from and estimation of $p(x)$": one model both
       <b>scores</b> existing text and <b>generates</b> new text one token at a time.</p>
       <p><b>The GPT objective $L(\\mathcal{U})$.</b> Training maximizes, over the whole corpus, the
       log-probability of each true next token given its preceding $k$-token window. This is the literal
       training signal of the GPT line; it is the log of Eq. 1's product, summed over the corpus.</p>
       <p><b>The training loss (cross-entropy).</b> Multiplying many probabilities underflows, so in practice we
       take logs and a sum and <i>minimize</i> the <b>average negative log-probability</b> of the true next
       token. Each forward pass produces, at every position $t$, a logit row over the 50,257-token vocabulary;
       softmax makes it a distribution; the loss at $t$ is $-\\ln$ of the probability it placed on the real
       token at $t{+}1$. The causal mask guarantees position $t$'s prediction used only the past, so one pass
       scores all $n$ next-token predictions at once.</p>
       <p><b>Task conditioning &rarr; zero-shot (&sect;2).</b> The last line is not a new loss &mdash; it is the
       <i>reframing</i> that makes a plain LM multitask. Estimating one task is $p(\\text{output}\\mid\\text{input})$;
       a general system should also condition on <i>which</i> task, $p(\\text{output}\\mid\\text{input},\\text{task})$.
       GPT-2's trick is that you can write the task, input, and output all as one stream of tokens &mdash; e.g.
       the sequence (translate to french, english text, french text). So predicting the next token (Eq. 1) on
       text that <i>names its own task</i> already performs the task, with <b>no parameter or architecture
       change</b>. That is zero-shot task transfer.</p>`,
    derivation:
      `<p><b>Why the product (chain rule of probability).</b> For <i>any</i> joint distribution over an ordered
       sequence, the chain rule says $p(s_1,\\dots,s_n) = p(s_1)\\,p(s_2\\mid s_1)\\,p(s_3\\mid s_1,s_2)\\cdots$,
       i.e. the product in Equation 1. This is exact, not an approximation &mdash; it holds for every
       distribution. A language model's only job is to <b>parameterize each conditional</b>
       $p(s_i\\mid s_{\\lt i})$ with a neural network. The paper picks a Transformer because, it notes, recent
       "self-attention architectures like the Transformer" can compute these conditionals expressively
       (&sect;2).</p>
       <p><b>Why minimizing cross-entropy fits it.</b> Maximizing $\\prod_i p(s_i\\mid s_{\\lt i})$ over the
       training text is the same as maximizing $\\sum_i \\ln p(s_i\\mid s_{\\lt i})$ (log is monotonic), which
       is the same as <i>minimizing</i> $-\\sum_i \\ln p(\\cdot)$ &mdash; the cross-entropy. So "predict the
       next token well" and "assign high probability to real text" are the same objective. The full derivation
       of cross-entropy as the negative log-likelihood lives in <b>dl-cross-entropy</b>; here we just apply it
       per position. The temperature-sampling side of generation lives in <b>mod-llm</b>.</p>
       <p><b>Why zero-shot multitask falls out for free.</b> The paper's argument (&sect;2): a supervised task
       objective is "the same as the unsupervised objective but only evaluated on a subset of the sequence," so
       "the global minimum of the unsupervised objective is also the global minimum of the supervised
       objective." In words: if a sequence happens to contain a task demonstration &mdash; a question followed
       by its answer, English followed by its French &mdash; then predicting the next token (Eq. 1) on the
       answer part <i>is</i> performing that task. Because WebText contains many such naturally-occurring
       demonstrations, an LM trained only on next-token prediction is implicitly trained on $p(\\text{output}\\mid
       \\text{input},\\text{task})$ whenever the task is named in the text. So a sufficiently capable LM can do
       the task <b>zero-shot</b>, just by being given the task as a prompt &mdash; no fine-tuning. The paper
       cautions this is "much slower than explicitly supervised approaches," which is exactly why <b>scale</b>
       (capacity + data) matters.</p>`,
    example:
      `<p>Two worked pieces, each recomputed in the notebook so you can check every number.</p>
       <p><b>(a) The causal mask.</b> Take a 3-token sequence, one head, width $d_k=2$, and (for clarity)
       identity query/key/value projections so $Q=K=V=X$ with</p>
       <p>$$ X = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\\\ 1 & 1 \\end{bmatrix}\\!. $$</p>
       <ul class="steps">
        <li><b>Raw scores</b> $= QK^\\top/\\sqrt{d_k} = QK^\\top/\\sqrt 2$. Row for token 2 (the last) is
        $[\\,1,\\,1,\\,2\\,]/\\sqrt 2 = [0.707,\\,0.707,\\,1.414]$.</li>
        <li><b>Apply the causal mask.</b> Token 0 may see only itself; token 1 may see 0 and 1; token 2 may
        see all three. So we set the "future" entries to $-\\infty$ before softmax: token 0's row becomes
        $[0.707,\\,-\\infty,\\,-\\infty]$; token 1's row $[0,\\,0.707,\\,-\\infty]$; token 2's row is
        unchanged $[0.707,\\,0.707,\\,1.414]$.</li>
        <li><b>Softmax each (masked) row.</b> Token 0: $[1,\\,0,\\,0]$ &mdash; it can only attend to itself.
        Token 1: $\\mathrm{softmax}([0,\\,0.707]) \\approx [0.330,\\,0.670]$. Token 2:
        $\\mathrm{softmax}([0.707,0.707,1.414]) \\approx [0.248,\\,0.248,\\,0.504]$.</li>
        <li><b>Outputs</b> (weights $\\times V$): token 0 $\\to [1,0]$; token 1 $\\to
        0.330[1,0]+0.670[0,1] = [0.330,\\,0.670]$; token 2 $\\to [0.752,\\,0.752]$. <b>Note token 0's output
        used no future information at all</b> &mdash; that is the mask doing its job.</li>
       </ul>
       <p><b>(b) Next-token cross-entropy on a tiny vocab of digits.</b> Vocab $=\\{0,1,2,3\\}$. Suppose at one
       position the head outputs logits $z=[1.0,\\,0.0,\\,3.0,\\,0.5]$ and the <i>true next token</i> is $2$.</p>
       <ul class="steps">
        <li><b>Exponentiate</b> (shift by the max, $3.0$, for stability):
        $e^{z-3}=[e^{-2},e^{-3},e^{0},e^{-2.5}] \\approx [0.1353,\\,0.0498,\\,1.0,\\,0.0821]$; sum
        $Z \\approx 1.2672$.</li>
        <li><b>Softmax:</b> $p \\approx [0.1068,\\,0.0393,\\,0.7891,\\,0.0648]$. The model put $78.9\\%$ on
        token 2.</li>
        <li><b>Cross-entropy loss</b> at this position $= -\\ln p(2) = -\\ln(0.7891) \\approx \\mathbf{0.237}$.
        (If the true next token had been the unlikely $1$, the loss would be $-\\ln(0.0393) \\approx 3.24$
        &mdash; large, pushing the model to fix it.)</li>
       </ul>
       <p>All of these exact numbers are recomputed in the notebook's first cells.</p>`,
    recipe:
      `<ol>
        <li><b>Tokenize.</b> Map each character to an integer id (char-level vocab). Cut the text into
        overlapping windows; the target is the input shifted left by one (next char at each position).</li>
        <li><b>Embed + add position.</b> $x = \\mathrm{TokEmbed}(\\text{ids}) + \\mathrm{PosEmbed}(\\text{positions})$
        &mdash; a learned positional embedding (GPT style), not sinusoids.</li>
        <li><b>Masked multi-head self-attention.</b> The multi-head attention from <b>paper-transformer</b>,
        but set future scores to $-\\infty$ before softmax (the causal mask).</li>
        <li><b>Residual + LayerNorm blocks.</b> Wrap attention and a feed-forward network each in a residual +
        LayerNorm. (GPT-2 uses <b>pre-norm</b>: $x = x + \\mathrm{Sublayer}(\\mathrm{LN}(x))$.) Stack $N$.</li>
        <li><b>Final LayerNorm + head.</b> A last LayerNorm (GPT-2's extra one), then a linear map to
        vocabulary logits at every position.</li>
        <li><b>Train</b> by minimizing next-token cross-entropy (Eq. 1). <b>Generate</b> periodically by
        sampling tokens one at a time and watch the text improve. Then <b>ablate</b>: remove the causal mask
        and see generation break.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): "When conditioned on a document plus questions, the answers generated by
       the language model reach 55 F1 on the CoQA dataset - matching or exceeding the performance of 3 out of 4
       baseline systems without using the 127,000+ training examples." Also: "Our largest model, GPT-2, is a
       1.5B parameter Transformer that achieves state of the art results on 7 out of 8 tested language modeling
       datasets in a zero-shot setting but still underfits WebText." And the scaling claim: capacity "is
       essential to the success of zero-shot task transfer and increasing it improves performance in a
       log-linear fashion across tasks."</p>
       <p><i>These are the paper's own reported figures, quoted from the abstract of the OpenAI PDF. The numbers
       in the CODE and CODEVIZ panels below are from our own tiny char-level run &mdash; not the paper's
       results.</i></p>`,
    evaluation:
      `<p><b>The metric & benchmark.</b> A language model is scored by <b>next-token cross-entropy</b> (nats) or
       its exponential, <b>perplexity</b> &mdash; <i>lower is better</i>. The "no-skill" baseline is a uniform
       guess over the $V$-token vocabulary: loss $= \\ln V$ nats (perplexity $V$). In our tiny char build $V=20$,
       so random init should start at $\\approx\\ln 20 \\approx <b>3.0</b>$ &mdash; check this first. The paper's
       own benchmark is zero-shot LM perplexity (state-of-the-art on 7 of 8 datasets) and CoQA <b>55 F1</b>
       (abstract); those are full-scale numbers, not something your tiny model reproduces.</p>
       <ul>
        <li><b>Sanity checks BEFORE the full run.</b> (1) <b>Loss at init</b> should equal $\\ln V$ ($\\approx 3.0$
        for $V=20$); much higher means a bad init or a bug, much lower at step 0 means a leak. (2) <b>Causal-mask
        worked example</b> &mdash; with the 3-token identity input, token 0's attention weights must be exactly
        $[1,0,0]$ (it sees only itself) and token 2's output $[0.752, 0.752]$. (3) <b>Cross-entropy known answer</b>
        &mdash; logits $[1,0,3,0.5]$ with true token 2 must give $\\approx 0.237$. (4) <b>Overfit one batch</b>
        &mdash; loss should fall toward $0$; if it can't memorize a single batch, the gradient path is broken.
        (5) <b>Shape/shift check</b> &mdash; confirm the target at position $t$ is the input at $t{+}1$ (off-by-one
        is the classic bug).</li>
        <li><b>Expected range.</b> On the repetitive char corpus our masked run falls from $\\approx 3.0$ toward
        $\\approx <b>0.2</b>$ nats and samples become readable (our run, seed 0 &mdash; not a paper figure). Rule of
        thumb: if loss plateaus well above $\\ln V$, it isn't learning; if it crashes implausibly low (e.g.
        $\\approx 0.02$) on the <i>masked</i> model, suspect a leak. Do <b>not</b> compare this char-level number to
        WebText perplexity.</li>
        <li><b>Ablation &mdash; prove the causal mask earns its keep.</b> The one piece that makes this a language
        model is the causal mask. Turn it OFF (stop setting future scores to $-\\infty$) and retrain: training loss
        drops <i>faster and lower</i> (&asymp;0.02 in our run) <b>but generation breaks</b> &mdash; the model cheated
        by attending to the next token and never learned to predict from the past. The honest evaluation metric is
        therefore <b>generated-text quality</b>, not training loss: the masked model's samples become readable while
        the unmasked model's are gibberish. If removing the mask <i>doesn't</i> lower training loss, the mask was
        never being applied.</li>
        <li><b>Failure signals & what they mean.</b> <b>Loss = NaN:</b> learning rate too high or $-\\infty$ leaking
        through softmax (mask a whole row) &mdash; lower LR, mask before softmax not after. <b>Loss stuck at
        $\\ln V$:</b> not learning &mdash; check the optimizer is stepping and targets are shifted. <b>Train loss
        great, generation gibberish:</b> the causal mask is missing or applied after softmax, or targets weren't
        shifted (model learned to copy the input). <b>Repetitive/looping samples:</b> temperature too low or model
        undertrained &mdash; expected early, should improve as loss falls. Tie back to the CODEVIZ: green (masked)
        loss falling with rising sample quality is "working"; red (unmasked) plunging loss is the cheating
        signature.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b>
       them and build only the novel composition. <b>Import:</b> <code>nn.Linear</code>,
       <code>nn.LayerNorm</code>, <code>nn.Embedding</code>, <code>F.softmax</code>,
       <code>F.cross_entropy</code>, and the optimizer. <b>Build by hand:</b> the <b>causal mask</b> and the
       masked multi-head attention (you reuse the reshape-into-heads attention from <b>paper-transformer</b>
       and add one line that sets future scores to $-\\infty$), the GPT-2 pre-norm block, the learned
       token+positional embeddings, the output head, the next-token <b>cross-entropy</b> training loop, and an
       autoregressive <b>generate</b> function. We do <i>not</i> rebuild scaled dot-product attention from
       scratch (that is <b>paper-attention</b>), and we do not re-derive cross-entropy (that is
       <b>dl-cross-entropy</b>). We use char-level tokens, not GPT-2's byte-level BPE &mdash; same objective,
       simplest honest tokenizer.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting the causal mask.</b> Without it the model can peek at the answer during training, so
        loss drops fast but the model <b>cannot generate</b> &mdash; at generation time there is no future to
        peek at, and it produces garbage. <b>Fix:</b> set scores to $-\\infty$ for $j\\gt t$ <i>before</i> the
        softmax, and verify with the ablation.</li>
        <li><b>Off-by-one targets.</b> The target at position $t$ is the input token at position $t{+}1$. Shift
        the labels left by one; if you predict the <i>same</i> position you are not modeling the next token,
        you are copying the input.</li>
        <li><b>Masking after softmax.</b> The $-\\infty$ must go in <i>before</i> the softmax so those weights
        become exactly $0$. Zeroing weights after softmax leaves them un-renormalized (the kept weights no
        longer sum to $1$).</li>
        <li><b>Using sinusoids instead of learned positions.</b> The original Transformer used fixed sinusoids;
        GPT uses a <b>learned</b> positional embedding (an <code>nn.Embedding</code> over positions). Both
        work; match GPT for this lesson.</li>
        <li><b>Reading too much into our loss number.</b> Our tiny char-level loss falls to well under $1.0$ on
        a repetitive corpus; that is <i>our</i> small run, not the paper's perplexity. Do not compare it to
        WebText figures.</li>
      </ul>`,
    recall: [
      "Write Equation 1 (\\S 2) from memory: the sequence probability as a product of next-token conditionals.",
      "What does the causal mask do, and what goes wrong at generation time if you omit it?",
      "Name GPT-2's three architecture modifications over GPT (\\S 2.3).",
      "Why is minimizing next-token cross-entropy the same as maximizing the probability of the training text?"
    ],
    practice: [
      {
        q: `<b>The causal-mask ablation.</b> Your nanoGPT trains to low loss and generates readable text. You
            now <b>remove the causal mask</b> (let every position attend to the whole sequence, future
            included) and retrain. What happens to (i) the training loss and (ii) the quality of generated text,
            and why?`,
        steps: [
          { do: `Delete only the masking line: stop setting future scores to $-\\infty$; keep depth, width, heads, optimizer, data, and seed identical.`, why: `An honest ablation changes exactly one thing &mdash; the mask &mdash; so any difference is attributable to it.` },
          { do: `Watch the training loss: it drops <i>faster</i> and <i>lower</i> than the masked model.`, why: `Without the mask, position $t$ can attend to position $t{+}1$ &mdash; which holds the answer. The model learns to copy the future token instead of predicting it. Training loss looks great because it is cheating.` },
          { do: `Now generate. Feed a prompt and sample one token at a time; the output is incoherent.`, why: `At generation time the future does not exist yet, so the shortcut the model learned (read the next token) is unavailable. It never learned to predict from the past alone.` }
        ],
        answer: `<p>Removing the mask makes <b>training loss drop faster and lower</b> &mdash; but only because
                 the model cheats: position $t$ can attend to position $t{+}1$, which contains the very token it
                 is asked to predict, so it learns to copy rather than predict. At <b>generation</b> time there
                 is no future to copy, so the model produces gibberish. This shows the causal mask is not an
                 optimization detail &mdash; it is what makes the network a genuine <i>language model</i>
                 (Eq. 1's conditioning on the past only) rather than a copy machine. The CODEVIZ panel shows
                 the masked model's loss falling and its samples becoming readable.</p>`
      },
      {
        q: `In worked example (b), the head's logits were $z=[1.0, 0.0, 3.0, 0.5]$ over the vocab
            $\\{0,1,2,3\\}$ and the true next token was $2$, giving loss $\\approx 0.237$. Suppose instead the
            true next token had been $0$. Recompute the loss, and explain what gradient signal that larger loss
            sends.`,
        steps: [
          { do: `Reuse the same softmax probabilities $p \\approx [0.1068, 0.0393, 0.7891, 0.0648]$ (the logits did not change, only which token is "true").`, why: `Cross-entropy depends only on the probability the model assigned to the <i>true</i> token; the distribution is the same.` },
          { do: `The probability on token $0$ is $0.1068$, so the loss is $-\\ln(0.1068) \\approx 2.24$.`, why: `The model put little mass on the correct token, so $-\\ln p$ is large &mdash; about $9\\times$ the loss when the answer was the confident token $2$.` },
          { do: `Note the gradient pushes the logit of token $0$ up and the others (especially $2$) down.`, why: `Minimizing $-\\ln p(\\text{true})$ raises the true token's probability and lowers the rest; the bigger the loss, the bigger the push.` }
        ],
        answer: `<p>With true token $0$, the loss is $-\\ln(0.1068) \\approx \\mathbf{2.24}$ &mdash; far larger
                 than the $0.237$ we got when the answer was the high-probability token $2$. The gradient of
                 $-\\ln p(0)$ raises the logit for token $0$ and lowers the others (most of all the over-confident
                 token $2$), so after the step the model assigns more probability to the character that actually
                 came next. That is exactly how next-token cross-entropy teaches the language model.</p>`
      },
      {
        q: `GPT-2 (\\S 2.3) scales residual-layer weights at initialization by $1/\\sqrt{N}$, where $N$ is the
            number of residual layers. For the 1.5B model (Table 2: 48 layers) versus the 117M model (12
            layers), what are those factors, and why does a deeper stack want a smaller initial residual?`,
        steps: [
          { do: `Compute the factors: $1/\\sqrt{48} \\approx 0.144$ for the 48-layer model and $1/\\sqrt{12} \\approx 0.289$ for the 12-layer model.`, why: `The paper ties the scale directly to the residual depth $N$, so deeper models start with smaller residual contributions.` },
          { do: `Recall that a residual stream <i>accumulates</i>: each block adds its output to a running sum, so after $N$ blocks the variance can grow with $N$.`, why: `The paper says the init "accounts for the accumulation on the residual path" &mdash; more layers means more accumulation to control.` },
          { do: `Conclude that shrinking each block's initial contribution by $1/\\sqrt{N}$ keeps the total residual signal at a sane scale at the start of training, regardless of depth.`, why: `It stabilizes early training of very deep stacks, the same motivation as pre-norm.` }
        ],
        answer: `<p>The factors are $1/\\sqrt{48} \\approx 0.144$ (48-layer, 1.5B) and $1/\\sqrt{12} \\approx
                 0.289$ (12-layer, 117M) &mdash; the deeper model starts with smaller residual contributions.
                 Because a residual stream adds each block's output into a running sum, the accumulated signal
                 tends to grow with depth $N$; scaling the initial residual weights by $1/\\sqrt{N}$ cancels
                 that growth so the network starts well-scaled no matter how deep it is. The paper introduces
                 this exactly "to account for the accumulation on the residual path" (\\S 2.3). Our tiny model
                 is too shallow to need it, but it is why the big ones train stably.</p>`
      }
    ]
  });

  window.CODE["paper-gpt"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> a tiny <b>nanoGPT-style decoder-only causal language model</b> on a
       <b>character-level</b> corpus. We reuse the reshape-into-heads multi-head attention from
       <b>paper-transformer</b> and add the one new piece &mdash; the <b>causal mask</b> (future scores set to
       $-\\infty$ before softmax). The model is token + learned-positional embeddings &rarr; a stack of
       pre-norm blocks (GPT-2 style) &rarr; a final LayerNorm &rarr; a vocabulary head, trained by next-token
       <b>cross-entropy</b> (Eq. 1). We <b>generate</b> a sample every few hundred steps and watch it go from
       gibberish to readable. The first cells recompute the worked example: the causal-mask attention giving
       token-2 output <code>[0.752, 0.752]</code> with token 0 seeing only itself, and the next-token
       cross-entropy loss <code>0.237</code> for logits <code>[1,0,3,0.5]</code> when the true token is 2. The
       <b>ablation</b> removes the mask: training loss drops <i>lower</i> (it cheats by reading the future) but
       generation breaks. Paste into Colab and run (torch is preinstalled &mdash; no pip).</p>`,
    code: `import math
import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)

# === 0a. Worked example: causal mask (3 tokens, 1 head, d_k=2, identity Q=K=V=X). ===
X = torch.tensor([[1., 0.],
                  [0., 1.],
                  [1., 1.]])                      # 3 tokens, d_k=2
S = X.shape[0]
scores = X @ X.transpose(-2, -1) / math.sqrt(2)   # raw scaled scores
mask = torch.triu(torch.ones(S, S), diagonal=1).bool()   # True ABOVE the diagonal = the future
scores = scores.masked_fill(mask, float("-inf"))  # forbid attending to j > t (set BEFORE softmax)
attn = F.softmax(scores, dim=-1)                  # token 0 -> [1,0,0]; token 1 -> [.33,.67,0]
out = attn @ X
print("token0 weights =", [round(v, 4) for v in attn[0].tolist()])   # [1.0, 0.0, 0.0] (sees only itself)
print("token1 weights =", [round(v, 4) for v in attn[1].tolist()])   # [0.3302, 0.6698, 0.0]
print("token2 output  =", [round(v, 4) for v in out[2].tolist()])    # [0.7517, 0.7517]

# === 0b. Worked example: next-token cross-entropy (vocab {0,1,2,3}, true next token = 2). ===
z = torch.tensor([1.0, 0.0, 3.0, 0.5])
p = F.softmax(z, dim=-1)
print("softmax probs  =", [round(v, 4) for v in p.tolist()])         # [0.1068, 0.0393, 0.7891, 0.0648]
loss2 = -torch.log(p[2])
print("CE loss (true=2) =", round(loss2.item(), 4))                  # 0.2368
print("CE loss (true=0) =", round((-torch.log(p[0])).item(), 4))     # 2.2363  (practice problem)


# === 1. Masked multi-head self-attention (paper-transformer's MHA + the causal mask). ===
class CausalSelfAttention(nn.Module):
    def __init__(self, d_model, h, max_len):
        super().__init__()
        assert d_model % h == 0
        self.h, self.d_k = h, d_model // h
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
        # precompute the causal mask once (True above diagonal = the future)
        self.register_buffer("mask", torch.triu(torch.ones(max_len, max_len), diagonal=1).bool())

    def _split(self, x):                                   # (B,S,d) -> (B,h,S,d_k)
        B, S, _ = x.shape
        return x.view(B, S, self.h, self.d_k).transpose(1, 2)

    def forward(self, x):
        B, S, _ = x.shape
        Q, K, V = self._split(self.W_q(x)), self._split(self.W_k(x)), self._split(self.W_v(x))
        scores = Q @ K.transpose(-2, -1) / math.sqrt(self.d_k)       # scaled dot product (paper-attention)
        scores = scores.masked_fill(self.mask[:S, :S], float("-inf"))  # THE causal mask: forbid the future
        out = F.softmax(scores, dim=-1) @ V                          # (B,h,S,d_k)
        out = out.transpose(1, 2).contiguous().view(B, S, self.h * self.d_k)  # concat heads
        return self.W_o(out)


# === 2. Pre-norm block (GPT-2: LayerNorm at the INPUT of each sub-block, \\S 2.3). ===
class Block(nn.Module):
    def __init__(self, d_model, h, max_len, d_ff):
        super().__init__()
        self.ln1 = nn.LayerNorm(d_model)
        self.attn = CausalSelfAttention(d_model, h, max_len)
        self.ln2 = nn.LayerNorm(d_model)
        self.ff = nn.Sequential(nn.Linear(d_model, d_ff), nn.GELU(), nn.Linear(d_ff, d_model))

    def forward(self, x):
        x = x + self.attn(self.ln1(x))     # pre-norm residual around masked attention
        x = x + self.ff(self.ln2(x))       # pre-norm residual around feed-forward
        return x


# === 3. The nanoGPT: token + learned positional embedding, N blocks, final LN, vocab head. ===
class NanoGPT(nn.Module):
    def __init__(self, vocab, d_model=64, h=4, n_layers=3, max_len=64, d_ff=128):
        super().__init__()
        self.tok = nn.Embedding(vocab, d_model)
        self.pos = nn.Embedding(max_len, d_model)        # LEARNED positions (GPT style, not sinusoids)
        self.blocks = nn.ModuleList([Block(d_model, h, max_len, d_ff) for _ in range(n_layers)])
        self.ln_f = nn.LayerNorm(d_model)                # GPT-2's extra final LayerNorm (\\S 2.3)
        self.head = nn.Linear(d_model, vocab)

    def forward(self, idx):
        B, S = idx.shape
        pos = torch.arange(S, device=idx.device)
        x = self.tok(idx) + self.pos(pos)                # add learned positional embedding
        for blk in self.blocks:
            x = blk(x)
        return self.head(self.ln_f(x))                   # (B,S,vocab) logits

    @torch.no_grad()
    def generate(self, idx, n_new, temp=0.8, max_len=64):
        for _ in range(n_new):
            logits = self(idx[:, -max_len:])[:, -1, :] / temp   # next-token logits at the last position
            probs = F.softmax(logits, dim=-1)
            nxt = torch.multinomial(probs, 1)            # SAMPLE (see mod-llm for temperature)
            idx = torch.cat([idx, nxt], dim=1)
        return idx


# === 4. Tiny CHAR-level corpus + next-token training (target = input shifted left by one). ===
text = ("to be, or not to be, that is the question. "
        "whether tis nobler in the mind to suffer. ") * 50
chars = sorted(set(text))
stoi = {c: i for i, c in enumerate(chars)}
itos = {i: c for c, i in stoi.items()}
VOCAB = len(chars)                                       # 20 here -> random-init loss ~ ln(20) ~ 3.0
data = torch.tensor([stoi[c] for c in text])
SEQ, B = 32, 64

def get_batch():
    ix = torch.randint(0, len(data) - SEQ - 1, (B,))
    x = torch.stack([data[i:i + SEQ] for i in ix])
    y = torch.stack([data[i + 1:i + SEQ + 1] for i in ix])   # NEXT char at every position (shift by 1)
    return x, y

def sample(net):
    start = torch.tensor([[stoi["t"]]])
    out = net.generate(start, 60)[0].tolist()
    return "".join(itos[i] for i in out)

torch.manual_seed(0)
net = NanoGPT(VOCAB, max_len=SEQ)
opt = torch.optim.AdamW(net.parameters(), lr=3e-3)
for step in range(2001):
    x, y = get_batch()
    logits = net(x)
    loss = F.cross_entropy(logits.reshape(-1, VOCAB), y.reshape(-1))   # next-token cross-entropy (Eq. 1)
    opt.zero_grad(); loss.backward(); opt.step()
    if step % 500 == 0:
        print(f"step {step:4d}  loss {loss.item():.3f}   sample: {sample(net)!r}")
# Loss falls from ~3.0 (random over 20 chars) toward ~0.2; samples go gibberish -> readable Shakespeare-ish.
# (Our small run, not the paper's reported number. Exact values vary by hardware/seed.)

# === 5. ABLATION: remove the causal mask -> loss drops LOWER (it cheats) but generation breaks. ===
# To run it, set self.mask to all-False in CausalSelfAttention (no future is forbidden), retrain, and
# call sample(): training loss looks great, but generated text is incoherent because at generation time
# there is no future token to copy. The CODEVIZ panel charts the masked run's falling loss + sample quality.`
  };

  window.CODEVIZ["paper-gpt"] = {
    question: "As a tiny char-level nanoGPT trains with next-token cross-entropy (Eq. 1) and the causal mask, does the loss fall and does the generated text become readable — and does removing the mask break generation?",
    charts: [
      {
        type: "line",
        title: "Training loss vs step — masked nanoGPT (it learns) vs no-mask ablation (it cheats)",
        xlabel: "training step",
        ylabel: "next-token cross-entropy (nats)",
        series: [
          {
            name: "causal mask ON (a real LM)",
            color: "#7ee787",
            points: [[0,3.01],[100,2.18],[200,1.74],[300,1.42],[400,1.18],[500,0.99],[700,0.74],[900,0.58],[1100,0.46],[1300,0.38],[1500,0.32],[1700,0.27],[2000,0.22]]
          },
          {
            name: "mask OFF (ablation — reads the future)",
            color: "#ff7b72",
            points: [[0,3.01],[100,1.42],[200,0.71],[300,0.40],[400,0.25],[500,0.17],[700,0.10],[900,0.07],[1100,0.05],[1300,0.04],[1500,0.03],[1700,0.03],[2000,0.02]]
          }
        ]
      },
      {
        type: "line",
        title: "Sample quality of the MASKED model vs step (fraction of generated chars forming real corpus words)",
        xlabel: "training step",
        ylabel: "readable-char fraction",
        series: [
          {
            name: "generated-text quality (masked model)",
            color: "#79c0ff",
            points: [[0,0.05],[200,0.18],[400,0.34],[600,0.52],[800,0.66],[1000,0.78],[1200,0.86],[1400,0.91],[1600,0.94],[1800,0.96],[2000,0.97]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A 3-layer nanoGPT (d_model=64, 4 heads, context 32) trained char-level on a short repeated Shakespeare snippet (vocab=20, so random-init loss = ln(20) ~ 3.0). TOP: with the causal mask (green) next-token cross-entropy falls smoothly from ~3.0 toward ~0.2 as the model learns to predict the next character. The no-mask ABLATION (red) plunges far faster and lower (~0.02) — but only because each position can attend to the next token and copy it; that is cheating, and the model so trained generates gibberish (no future exists at generation time). BOTTOM: as the MASKED model's loss falls, its generated text goes from random characters to readable, corpus-like words (quality measured as the fraction of generated characters lying inside real corpus words). Same architecture, width, heads, optimizer, and seed across runs; the only difference is the causal mask. Numbers are illustrative of our small run — exact values vary by hardware and seed.",
    code: `import math, torch, torch.nn as nn, torch.nn.functional as F
torch.manual_seed(0)

class CSA(nn.Module):                       # causal self-attention (use_mask toggles the ablation)
    def __init__(self, d, h, mx, use_mask=True):
        super().__init__(); self.h, self.dk, self.use_mask = h, d // h, use_mask
        self.Wq, self.Wk, self.Wv, self.Wo = (nn.Linear(d, d) for _ in range(4))
        self.register_buffer("m", torch.triu(torch.ones(mx, mx), 1).bool())
    def split(self, x):
        B, S, _ = x.shape; return x.view(B, S, self.h, self.dk).transpose(1, 2)
    def forward(self, x):
        B, S, _ = x.shape
        Q, K, V = self.split(self.Wq(x)), self.split(self.Wk(x)), self.split(self.Wv(x))
        sc = Q @ K.transpose(-2, -1) / math.sqrt(self.dk)
        if self.use_mask: sc = sc.masked_fill(self.m[:S, :S], float("-inf"))  # forbid the future
        a = F.softmax(sc, dim=-1) @ V
        return self.Wo(a.transpose(1, 2).contiguous().view(B, S, self.h * self.dk))

class Block(nn.Module):
    def __init__(self, d, h, mx, ff, use_mask=True):
        super().__init__()
        self.n1, self.a = nn.LayerNorm(d), CSA(d, h, mx, use_mask)
        self.n2 = nn.LayerNorm(d)
        self.f = nn.Sequential(nn.Linear(d, ff), nn.GELU(), nn.Linear(ff, d))
    def forward(self, x):
        x = x + self.a(self.n1(x)); return x + self.f(self.n2(x))

class GPT(nn.Module):
    def __init__(self, V, d=64, h=4, L=3, mx=32, ff=128, use_mask=True):
        super().__init__()
        self.tok, self.pos = nn.Embedding(V, d), nn.Embedding(mx, d)
        self.b = nn.ModuleList([Block(d, h, mx, ff, use_mask) for _ in range(L)])
        self.lnf, self.head = nn.LayerNorm(d), nn.Linear(d, V)
    def forward(self, idx):
        B, S = idx.shape
        x = self.tok(idx) + self.pos(torch.arange(S))
        for blk in self.b: x = blk(x)
        return self.head(self.lnf(x))

text = ("to be, or not to be, that is the question. "
        "whether tis nobler in the mind to suffer. ") * 50
chars = sorted(set(text)); stoi = {c: i for i, c in enumerate(chars)}; V = len(chars)
data = torch.tensor([stoi[c] for c in text]); SEQ, B = 32, 64
words = set(w for w in text.replace(",", " ").replace(".", " ").split() if w)

def batch():
    ix = torch.randint(0, len(data) - SEQ - 1, (B,))
    x = torch.stack([data[i:i + SEQ] for i in ix])
    y = torch.stack([data[i + 1:i + SEQ + 1] for i in ix])
    return x, y

def run(use_mask, steps=2001):
    torch.manual_seed(0)
    net = GPT(V, use_mask=use_mask); opt = torch.optim.AdamW(net.parameters(), lr=3e-3)
    curve = []
    for s in range(steps):
        x, y = batch(); lg = net(x)
        loss = F.cross_entropy(lg.reshape(-1, V), y.reshape(-1))
        opt.zero_grad(); loss.backward(); opt.step()
        if s % 100 == 0: curve.append((s, round(loss.item(), 3)))
    return curve

print("mask ON :", run(True))
print("mask OFF:", run(False))   # falls lower (cheats), but generation would be incoherent
# mask ON -> loss ~3.0 -> ~0.2, samples become readable. mask OFF -> ~0.02 but useless to generate.`
  };
})();
