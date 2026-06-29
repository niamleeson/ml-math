/* Paper lesson — "ALBERT: A Lite BERT for Self-supervised Learning of Language Representations",
   Lan et al. 2019. Self-contained: lesson + CODE + CODEVIZ merged by id "paper-albert".
   GROUNDED from arXiv:1909.11942 (abstract) and the ar5iv HTML mirror (Section 3.1 — factorized
   embedding parameterization, cross-layer parameter sharing, sentence-order prediction; Tables 1,3,4,5).
   Track B (architecture): build a tiny BERT-style encoder, then apply ALBERT's two parameter-reduction
   tricks (factorize the embedding V*H -> V*E + E*H; share ONE encoder block across all L layers); count
   params with/without; train a small masked-language-model (MLM); ablate the weight sharing. The
   big-picture LLM math lives in concept mod-llm (cross-linked); cross-links paper-bert and paper-transformer. */
(function () {
  window.LESSONS.push({
    id: "paper-albert",
    title: "ALBERT — A Lite BERT for Self-supervised Learning of Language Representations (2019)",
    tagline: "Shrink BERT with two parameter-reduction tricks — factorize the embedding and share one block across all layers — and swap next-sentence prediction for sentence-order prediction.",
    module: "Papers · Transformers & LLMs",
    track: "architecture",
    paper: {
      authors: "Zhenzhong Lan, Mingda Chen, Sebastian Goodman, Kevin Gimpel, Piyush Sharma, Radu Soricut",
      org: "Google Research, Toyota Technological Institute at Chicago",
      year: 2019,
      venue: "arXiv:1909.11942 (Sep 2019); ICLR 2020",
      citations: "",
      arxiv: "https://arxiv.org/abs/1909.11942",
      code: "https://github.com/google-research/albert"
    },
    conceptLink: "mod-llm",
    partOf: [],
    prereqs: ["mod-llm", "mod-transformer", "dl-attention", "pt-nn-module", "pt-tensors"],

    // WHY READ IT
    problem:
      `<p>By 2019 the recipe for better language models was "make BERT bigger." <b>BERT</b>
       (Bidirectional Encoder Representations from Transformers) is a stack of Transformer encoder blocks
       pre-trained on a fill-in-the-blank task; growing its <b>hidden size</b> $H$ (the width of every token
       vector) and its <b>number of layers</b> kept improving downstream scores. But the paper opens
       (&sect;1) by noting two walls that bigger models hit:</p>
       <ul>
        <li><b>Memory.</b> The parameters and activations must fit in GPU/TPU memory. "Further model increases
        become harder due to GPU/TPU memory limitations" (abstract).</li>
        <li><b>Training time.</b> More parameters means each step is slower, "and longer training times"
        (abstract). The authors also observe that naively making BERT very wide can actually <i>hurt</i>
        (a model they call BERT-xlarge does worse than BERT-large).</li>
       </ul>
       <p>So the question ALBERT asks is not "how do we make BERT bigger?" but "where are BERT's parameters
       <i>wasted</i>, and can we cut them without losing accuracy?" <b>ALBERT</b> stands for
       <b>A Lite BERT</b>. If you have not yet read the <b>paper-bert</b> lesson, read it first &mdash; ALBERT
       is a direct modification of BERT and assumes you know its masked-language-model pre-training.</p>`,
    contribution:
      `<ul>
        <li><b>Factorized embedding parameterization (&sect;3.1).</b> BERT ties the embedding size to the
        hidden size ($E = H$). ALBERT unties them: project each token first into a <i>small</i> embedding of
        size $E$, then up into the hidden size $H$ with a shared matrix. This turns the embedding parameter
        count from $O(V \\times H)$ into $O(V \\times E + E \\times H)$, where $V$ is the vocabulary size.</li>
        <li><b>Cross-layer parameter sharing (&sect;3.1).</b> Instead of $L$ separately-weighted encoder
        layers, ALBERT uses <i>one</i> block's weights and applies it $L$ times. "The default decision for
        ALBERT is to share all parameters across layers" (&sect;3.1). The model is just as deep but stores one
        layer's worth of weights.</li>
        <li><b>Sentence-order prediction, SOP (&sect;3.1).</b> A new self-supervised loss that replaces BERT's
        next-sentence prediction (NSP). It "focuses on modeling inter-sentence coherence" (abstract) and
        "consistently helps downstream tasks with multi-sentence inputs."</li>
      </ul>`,
    whyItMattered:
      `<p>ALBERT showed that much of a large language model's parameter budget is <i>redundant</i>. From
       Table 1: ALBERT-base has <b>12M</b> parameters versus BERT-base's <b>108M</b> &mdash; about $9\\times$
       fewer &mdash; and ALBERT-large (24 layers) has <b>18M</b> versus BERT-large's 334M, about $18\\times$
       fewer. Because the saved memory frees room to grow the hidden size, the paper's best model
       (ALBERT-xxlarge) reached "new state-of-the-art results on the GLUE, RACE, and SQuAD benchmarks while
       having fewer parameters compared to BERT-large" (abstract). Parameter sharing and factorized
       embeddings are now standard tools in efficient-model design, and the SOP-style coherence objective
       influenced later pre-training losses.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.1 (The Elements of ALBERT)</b> &mdash; all three contributions live here. Read the
        three sub-parts in order: "Factorized embedding parameterization," "Cross-layer parameter sharing,"
        and the inter-sentence coherence loss / SOP.</li>
        <li><b>Table 1</b> &mdash; the configuration + parameter counts of BERT-base/large vs
        ALBERT-base/large/xlarge/xxlarge. This is where the "$9\\times$ / $18\\times$ fewer params" numbers
        come from. Note $E = 128$ for all ALBERT models.</li>
        <li><b>Tables 3, 4, 5</b> &mdash; the ablations: Table 3 varies the embedding size $E$ (factorization);
        Table 4 compares sharing all / attention-only / FFN-only / nothing; Table 5 compares SOP vs NSP vs no
        sentence loss. These tell you <i>how much each trick costs or buys</i>.</li>
       </ul>
       <p><b>Skim:</b> &sect;2 (related work on scaling and parameter sharing), the data/training-setup details
       (&sect;4.1), and the full benchmark leaderboard tables (&sect;4.9) unless you want to reproduce the
       paper. You can also skim "n-gram masking" &mdash; it is a small data tweak, not one of the three core
       ideas.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will build a tiny BERT-style encoder and train it on a small <b>masked-language-model (MLM)</b>
       task: hide ~15% of the tokens with a <code>[MASK]</code> symbol and predict them from context. Then you
       will apply ALBERT's two parameter tricks and compare.</p>
       <p>Here is the prediction to commit to before running. ALBERT replaces $L$ independently-weighted
       encoder layers with <i>one</i> shared block applied $L$ times &mdash; the model is the same depth but
       stores far fewer parameters. <b>Question:</b> when you switch from no-sharing (BERT-style, $L$ distinct
       layers) to sharing (ALBERT-style, one block reused), will the masked-token accuracy stay about the
       same, drop a little, or collapse? And by roughly what factor will the parameter count shrink? Write
       your guesses, then run the ablation.</p>`,
    attempt:
      `<p>Before the reveal, sketch the two changes you will make to a plain BERT encoder. Fill in the
       <code>TODO</code>s:</p>
       <ul>
        <li><b>Factorized embedding.</b> Replace <code>nn.Embedding(V, H)</code> with
        <code>nn.Embedding(V, E)</code> followed by <code>nn.Linear(E, H)</code>. TODO: pick $E \\lt H$ (we use
        $E=16$, $H=64$) and confirm the embedding parameter count drops from $V\\times H$ to
        $V\\times E + E\\times H$.</li>
        <li><b>Cross-layer sharing.</b> Replace the <code>nn.ModuleList</code> of $L$ distinct
        <code>EncoderBlock</code>s with a <i>single</i> <code>EncoderBlock</code> that you call $L$ times in a
        loop. TODO: write the forward pass <code>for _ in range(L): x = block(x)</code> &mdash; same depth, one
        block's weights.</li>
       </ul>
       <p>Then train the MLM with sharing ON (ALBERT-style) and again with sharing OFF (BERT-style, the
       ablation). Predict which reaches higher accuracy, and by how much the parameter count differs.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>ALBERT keeps BERT's architecture &mdash; a stack of Transformer encoder blocks pre-trained as a
       masked-language model &mdash; and changes <b>three</b> things, all in &sect;3.1. The first two cut
       parameters; the third improves the pre-training signal.</p>
       <p><b>1. Factorized embedding parameterization.</b> In BERT the token embedding has the same width as
       the hidden state: every one of the $V$ vocabulary entries owns a vector of size $H$, so the embedding
       table has $V \\times H$ parameters. The paper argues this is wasteful (&sect;3.1): the embedding learns
       a <i>context-independent</i> representation of each word, while the hidden layers learn
       <i>context-dependent</i> ones, so "it is more efficient to use the total number of model parameters by
       setting $H \\gg E$." ALBERT projects a token first into a small space of size $E$ (the
       context-independent embedding), then up to the hidden size $H$ with a single shared matrix
       (size $E \\times H$). The embedding parameter count drops from $O(V \\times H)$ to
       $O(V \\times E + E \\times H)$. When $V$ is tens of thousands and $E \\ll H$, that is a huge cut.</p>
       <p><b>2. Cross-layer parameter sharing.</b> A normal Transformer has $L$ encoder layers, each with its
       <i>own</i> attention and feed-forward weights, so deep models store $L$ copies of a block's parameters.
       ALBERT stores <i>one</i> block and applies it $L$ times. "The default decision for ALBERT is to share
       all parameters across layers" (&sect;3.1) &mdash; both the attention and the feed-forward weights are
       reused at every depth. The network is still $L$ layers <i>deep</i> (the input passes through $L$
       transformations), but it has only <i>one layer's worth</i> of distinct weights. The paper also tested
       sharing only the attention weights or only the feed-forward weights (Table 4).</p>
       <p><b>3. Sentence-order prediction (SOP).</b> BERT's second pre-training loss, <b>next-sentence
       prediction (NSP)</b>, asks: is sentence B the real next sentence after A, or a random sentence from
       another document? The paper argues (&sect;3.1) that NSP is too easy and conflates two signals &mdash;
       <i>topic</i> (a random B is usually about a different subject) and <i>coherence</i>. ALBERT's
       <b>SOP</b> removes the topic shortcut: both the positive and the negative example are two consecutive
       segments <i>from the same document</i>; the negative is just those two segments <b>with their order
       swapped</b>. To win, the model must learn genuine discourse coherence, not topic matching.</p>
       <p>For this lesson's notebook we implement the two <b>parameter</b> tricks (factorization + sharing) on
       a tiny encoder and measure them, because they are the architectural core; SOP is a data/loss change we
       describe and ablate conceptually (see the practice section).</p>`,
    architecture:
      `<p>ALBERT is a BERT encoder with three modifications. Component by component, a token flows like this:</p>
       <ol>
        <li><b>Factorized embedding (input stage).</b> Token id &rarr; <code>Embedding(V, E)</code> giving a
        small width-$E$ vector ($V\\times E$ table) &rarr; <code>Linear(E, H)</code> up-projection ($E\\times H$,
        shared by all tokens) giving the width-$H$ hidden state. Add positional + segment embeddings. BERT skips
        this split and uses one $V\\times H$ table ($E = H$).</li>
        <li><b>One shared encoder block, applied $L$ times.</b> The block is a standard Transformer encoder
        layer: multi-head self-attention (with $H/64$ heads) &rarr; residual + LayerNorm &rarr; feed-forward of
        inner size $4H$ (so <code>Linear(H, 4H)</code> &rarr; activation &rarr; <code>Linear(4H, H)</code>) &rarr;
        residual + LayerNorm. ALBERT stores this block's weights <i>once</i> ($\\theta$) and loops the input
        through it $L$ times; the network is $L$ deep but holds one layer's parameters.</li>
        <li><b>Two pre-training heads.</b> (a) The <b>MLM head</b> ($H\\to V$) predicts the original token at each
        masked position. (b) The <b>SOP head</b> ($H\\to 2$) reads the <code>[CLS]</code> vector and classifies
        in-order vs swapped &mdash; replacing BERT's NSP head.</li>
       </ol>
       <p><b>Config table (Table 1).</b> All ALBERT models use $E = 128$, feed-forward inner size $4H$, and
       $H/64$ attention heads; all are fully cross-layer shared. BERT uses $E = H$ and no sharing.</p>
       <table>
        <thead><tr>
          <th>Model</th><th>Params</th><th>Layers $L$</th><th>Hidden $H$</th><th>Embed $E$</th><th>Shared</th>
        </tr></thead>
        <tbody>
          <tr><td>BERT-base</td><td>108M</td><td>12</td><td>768</td><td>768</td><td>no</td></tr>
          <tr><td>BERT-large</td><td>334M</td><td>24</td><td>1024</td><td>1024</td><td>no</td></tr>
          <tr><td>ALBERT-base</td><td>12M</td><td>12</td><td>768</td><td>128</td><td>all</td></tr>
          <tr><td>ALBERT-large</td><td>18M</td><td>24</td><td>1024</td><td>128</td><td>all</td></tr>
          <tr><td>ALBERT-xlarge</td><td>60M</td><td>24</td><td>2048</td><td>128</td><td>all</td></tr>
          <tr><td>ALBERT-xxlarge</td><td>235M</td><td>12</td><td>4096</td><td>128</td><td>all</td></tr>
        </tbody>
       </table>
       <p><b>Parameter savings (Table 1).</b> ALBERT-base has <b>12M</b> vs BERT-base's <b>108M</b> ($\\approx
       9\\times$ fewer); ALBERT-large (24 layers) has <b>18M</b> vs BERT-large's <b>334M</b> ($\\approx 18\\times$
       fewer). The two cuts compound: factorization shrinks the embedding ($23.0$M $\\to 3.9$M for $H=768$), and
       sharing divides the encoder's distinct layer weights by $L$. ALBERT-xxlarge has only $H=4096$ with $L=12$
       and still lands at 235M &mdash; <i>fewer</i> than BERT-large's 334M &mdash; while beating it on GLUE/RACE/SQuAD
       (abstract). Note xxlarge stops at $L=12$ because the paper found 24 layers gave no further gain.</p>`,
    symbols: [
      { sym: "$V$", desc: "the <b>vocabulary size</b>: how many distinct tokens (word-pieces) the model knows. BERT-base uses about $30{,}000$." },
      { sym: "$H$", desc: "the <b>hidden size</b> (model width): the length of every token vector inside the encoder. ALBERT-base uses $H=768$." },
      { sym: "$E$", desc: "the <b>embedding size</b>: the width of the small token embedding <i>before</i> it is projected up to $H$. In BERT $E=H$; ALBERT unties them and sets $E=128$ (much smaller than $H$)." },
      { sym: "$L$", desc: "the <b>number of stacked encoder layers</b> (the depth). With sharing, the model is still $L$ layers deep but stores one block's weights." },
      { sym: "$V \\times H$", desc: "the <b>BERT embedding parameter count</b>: one $H$-dimensional vector per vocabulary entry." },
      { sym: "$V \\times E + E \\times H$", desc: "the <b>ALBERT factorized embedding parameter count</b>: a $V\\times E$ small-embedding table plus one $E\\times H$ up-projection matrix shared by all tokens." },
      { sym: "$x_\\ell$", desc: "the <b>hidden state entering layer $\\ell$</b>: the width-$H$ token vectors after $\\ell$ passes through the encoder block ($x_0$ is the embedded input)." },
      { sym: "$\\theta$", desc: "the <b>single shared encoder-block weights</b> (attention + feed-forward + LayerNorms). Under cross-layer sharing the same $\\theta$ is used at every one of the $L$ layers." },
      { sym: "$P_{\\text{layer}}$", desc: "the <b>parameter count of one encoder block</b>. BERT stores $L\\cdot P_{\\text{layer}}$; ALBERT stores just $P_{\\text{layer}}$." },
      { sym: "$\\mathcal{L}_{\\text{SOP}}$", desc: "the <b>sentence-order prediction loss</b>: binary cross-entropy on whether segments $A,B$ are in order or swapped." },
      { sym: "$y$", desc: "the <b>SOP label</b>: $y=1$ when $A,B$ are in their true consecutive order, $y=0$ when the two segments are swapped." },
      { sym: "$A,\\,B$", desc: "the <b>two consecutive text segments</b> from the same document fed to the SOP head; the negative example uses the same pair with order reversed." },
      { sym: "$n,\\,N$", desc: "in n-gram masking, the <b>span length</b> $n$ to mask and the <b>maximum span length</b> $N=3$; longer spans are masked less often." },
      { sym: "MLM", desc: "<b>masked-language model</b>: the fill-in-the-blank pre-training task &mdash; hide ~15% of tokens with a <code>[MASK]</code> symbol and predict the originals from the surrounding context." },
      { sym: "NSP", desc: "<b>next-sentence prediction</b>: BERT's second loss &mdash; classify whether sentence B truly follows sentence A or is a random sentence from another document." },
      { sym: "SOP", desc: "<b>sentence-order prediction</b>: ALBERT's replacement loss &mdash; both examples are two consecutive segments from the <i>same</i> document; the model must say whether they are in the correct order or swapped." },
      { sym: "cross-layer sharing", desc: "a plain term: reusing one encoder block's weights at every layer instead of giving each layer its own weights." },
      { sym: "factorization", desc: "a plain term: writing one big matrix (here the $V\\times H$ embedding) as a product of two smaller ones ($V\\times E$ and $E\\times H$) to cut its parameter count." }
    ],
    formula: `$$ \\underbrace{O(V \\times H)}_{\\text{BERT embedding}} \\;\\longrightarrow\\; \\underbrace{O(V \\times E + E \\times H)}_{\\text{ALBERT factorized embedding}} \\qquad (E \\ll H) \\quad\\text{(\\S 3.1)} $$
<p>Factorized embedding parameterization (&sect;3.1): instead of one big $V\\times H$ table, store a small $V\\times E$ table and lift it with one shared $E\\times H$ matrix. With $E \\ll H$ this is far smaller.</p>
$$ x_{\\ell+1} = \\text{Block}(x_\\ell;\\,\\theta), \\qquad \\ell = 0, 1, \\dots, L-1 \\quad\\text{(one shared } \\theta \\text{ for all } L \\text{ layers, \\S 3.1)} $$
$$ \\text{distinct encoder-layer params:}\\quad \\underbrace{L \\cdot P_{\\text{layer}}}_{\\text{no sharing (BERT)}} \\;\\longrightarrow\\; \\underbrace{P_{\\text{layer}}}_{\\text{share all layers (ALBERT)}} \\quad\\text{(\\S 3.1)} $$
<p>Cross-layer parameter sharing (&sect;3.1): one block's weights $\\theta$ are reused at every depth, so the encoder stores $P_{\\text{layer}}$ instead of $L\\cdot P_{\\text{layer}}$ &mdash; a factor-$L$ cut.</p>
$$ \\mathcal{L}_{\\text{SOP}} = -\\,\\mathbb{E}\\big[\\, y\\,\\log p(\\text{in-order}\\mid A,B) + (1-y)\\,\\log p(\\text{swapped}\\mid A,B) \\,\\big] $$
<p>Sentence-order prediction loss (&sect;3.1) replacing BERT's next-sentence prediction. Positive ($y{=}1$): two consecutive segments $A,B$ from the same document, in order. Negative ($y{=}0$): the <i>same</i> two segments with their order swapped. Same topic in both cases, so only coherence/order separates them. The paper reports an SOP-trained model scores $86.5\\%$ on SOP while an NSP-trained model scores only $52.0\\%$ (chance).</p>
$$ p(n) = \\frac{1/n}{\\sum_{k=1}^{N} 1/k}, \\qquad N = 3 $$
<p>N-gram masking probability (&sect;3, a small data tweak): the masked span length $n$ is sampled with probability inversely proportional to $n$, up to $N=3$. Shorter spans are masked more often.</p>`,
    whatItDoes:
      `<p><b>Top line (factorized embedding, &sect;3.1).</b> BERT's embedding table stores one $H$-wide vector
       for each of the $V$ tokens: $V \\times H$ numbers. ALBERT instead stores a small $V \\times E$ table
       (one $E$-wide vector per token) plus a single $E \\times H$ matrix that lifts every token from width $E$
       to width $H$. The cost becomes $V\\times E + E\\times H$. Because $V$ is huge and $E \\ll H$, the
       $V\\times E$ term shrinks a lot relative to $V\\times H$, while the added $E\\times H$ term is tiny.</p>
       <p><b>Bottom line (cross-layer sharing, &sect;3.1).</b> Let $P_{\\text{layer}}$ be the parameters of one
       encoder block. A standard $L$-layer Transformer stores $L \\cdot P_{\\text{layer}}$. ALBERT stores just
       $P_{\\text{layer}}$ and applies it $L$ times, so the depth (and compute) is unchanged but the distinct
       weight count drops by a factor of $L$. Together the two tricks are why ALBERT-base has ~12M parameters
       where BERT-base has ~108M (Table 1).</p>
       <p><b>SOP loss (&sect;3.1).</b> $\\mathcal{L}_{\\text{SOP}}$ is a binary cross-entropy: given two
       consecutive segments $A,B$ from one document, predict whether they are in their true order ($y=1$) or
       swapped ($y=0$). Because both classes share topic, the only separating signal is discourse coherence
       &mdash; which is why an NSP-trained model can only guess (~52%) on this task.</p>
       <p><b>N-gram masking (&sect;3).</b> The span-length formula $p(n) = (1/n)/\\sum_{k=1}^{N}(1/k)$ says: when
       masking, prefer short spans &mdash; length-1 is most likely, length-3 ($N=3$) least &mdash; a minor data
       tweak layered on top of the 15% MLM masking.</p>`,
    derivation:
      `<p>This is an architecture/efficiency paper, not a new equation, so the "derivation" is the parameter
       arithmetic &mdash; and that is exactly what the notebook checks.</p>
       <p><b>Embedding factorization.</b> A direct $V \\to H$ embedding is a $V \\times H$ matrix:
       $V\\cdot H$ parameters. Factoring it as $V \\to E \\to H$ is a $V \\times E$ matrix followed by an
       $E \\times H$ matrix: $V\\cdot E + E\\cdot H$ parameters. The ratio is
       $\\frac{V H}{V E + E H} = \\frac{V H}{E(V + H)}$. With $E \\ll H$ and $V \\gg H$ this is close to
       $H/E$ &mdash; e.g. $H/E = 768/128 = 6$. The paper's justification (&sect;3.1) for why this loses little
       accuracy: the embedding is meant to hold a small, <i>context-independent</i> code per word, so it does
       not need the full hidden width.</p>
       <p><b>Cross-layer sharing.</b> There is nothing to derive about the count &mdash; reusing one block's
       weights $L$ times stores $P_{\\text{layer}}$ instead of $L\\cdot P_{\\text{layer}}$, a factor-$L$ cut in
       the encoder's distinct parameters. The non-obvious empirical fact the paper reports is that this barely
       hurts accuracy (Table 4) and even slightly <i>stabilizes</i> training. The full "why a deep stack still
       works with tied weights" intuition lives in the <b>mod-llm</b> concept lesson; here we measure the
       effect directly.</p>`,
    example:
      `<p>Work the parameter savings with the paper's actual ALBERT-base configuration (Table 1):
       vocabulary $V = 30{,}000$, hidden size $H = 768$, embedding size $E = 128$. Plug these into both
       embedding formulas and subtract.</p>
       <ul class="steps">
        <li><b>BERT embedding.</b> $V \\times H = 30{,}000 \\times 768 = 23{,}040{,}000$ &mdash; about
        $23.0$M just for the token table.</li>
        <li><b>ALBERT small table.</b> $V \\times E = 30{,}000 \\times 128 = 3{,}840{,}000$ &mdash; the
        per-token vector shrinks from width $768$ to width $128$.</li>
        <li><b>ALBERT up-projection.</b> $E \\times H = 128 \\times 768 = 98{,}304$ &mdash; one matrix shared
        by every token, not one per token.</li>
        <li><b>ALBERT factorized total.</b> $V \\times E + E \\times H = 3{,}840{,}000 + 98{,}304
        = 3{,}938{,}304$ &mdash; about $3.9$M.</li>
        <li><b>Saving.</b> $23{,}040{,}000 - 3{,}938{,}304 = 19{,}101{,}696$ parameters removed from the
        embedding alone &mdash; a $5.85\\times$ smaller embedding ($23{,}040{,}000 / 3{,}938{,}304 = 5.85$).</li>
        <li><b>Cross-layer sharing.</b> ALBERT-base has $L=12$ layers; sharing stores $1$ block's weights
        instead of $12$, so the encoder's distinct layer parameters drop by a factor of $12$. The two tricks
        together are why Table 1 lists <b>12M</b> ALBERT-base params versus <b>108M</b> for BERT-base.</li>
       </ul>
       <table class="extable">
        <caption>Embedding parameter count, BERT vs ALBERT-base ($V=30{,}000$, $H=768$, $E=128$).</caption>
        <thead>
         <tr><th>Quantity</th><th class="num">BERT ($V\\times H$)</th><th class="num">ALBERT ($V\\times E + E\\times H$)</th></tr>
        </thead>
        <tbody>
         <tr><td class="row-h">Token table</td><td class="num">23,040,000</td><td class="num">3,840,000</td></tr>
         <tr><td class="row-h">Up-projection $E\\times H$</td><td class="num">&mdash;</td><td class="num">98,304</td></tr>
         <tr><td class="row-h">Total embedding params</td><td class="num">23,040,000</td><td class="num">3,938,304</td></tr>
         <tr><td class="row-h">Saving</td><td class="num">&mdash;</td><td class="num">19,101,696 ($5.85\\times$)</td></tr>
        </tbody>
       </table>
       <p>The notebook recomputes these exact numbers, and also reports the <i>same</i> arithmetic on the
       tiny model it trains, so you can check every figure by running.</p>`,
    recipe:
      `<ol>
        <li><b>Tokens &rarr; small embedding.</b> Map each token id to an $E$-dimensional vector with
        <code>nn.Embedding(V, E)</code> (the $V\\times E$ table).</li>
        <li><b>Project up to hidden size.</b> Apply one <code>nn.Linear(E, H)</code> (the $E\\times H$ shared
        up-projection); add positional encoding. Now every token is $H$-wide.</li>
        <li><b>Build ONE encoder block.</b> Multi-head self-attention + feed-forward, each wrapped in
        residual + LayerNorm (the Transformer block from <b>paper-transformer</b>).</li>
        <li><b>Apply it $L$ times (sharing).</b> <code>for _ in range(L): x = block(x)</code> &mdash; same
        block, reused at every depth.</li>
        <li><b>MLM head.</b> A linear map $H \\to V$ predicts the original token at each masked position;
        train with cross-entropy over the masked positions only.</li>
        <li><b>Count + ablate.</b> Print the parameter count with factorization+sharing, then with neither
        (BERT-style: <code>nn.Embedding(V, H)</code> and $L$ distinct blocks); retrain the no-share version to
        compare accuracy.</li>
      </ol>`,
    results:
      `<p>From the paper (quoted): ALBERT's best model "establishes new state-of-the-art results on the GLUE,
       RACE, and SQuAD benchmarks while having fewer parameters compared to BERT-large" (abstract). The
       ablations report (&sect;3.1, Tables 4&ndash;5): sharing all parameters costs only a small drop in the
       downstream average versus not sharing, and the SOP loss beats NSP &mdash; a model trained with NSP
       scores only ~52% on the SOP task (about chance), while a model trained with SOP scores ~86.5% on it,
       and SOP gives a small downstream gain over using no sentence-level loss.</p>
       <p><i>These are the paper's reported figures, quoted from its abstract and Section&nbsp;3.1 tables. The
       numbers in the CODE and CODEVIZ panels below are from our own tiny MLM run &mdash; not the paper's
       results.</i></p>`,

    evaluation:
      `<p><b>The metric &amp; benchmark.</b> ALBERT has two things to verify: an <i>exact parameter count</i> and a
       <i>learning</i> metric. (1) Parameter arithmetic is deterministic, so it is a known-answer check: the
       factorized embedding must equal $V\\times E+E\\times H$ exactly (ALBERT-base: $30000\\times128+128\\times768=3{,}938{,}304$,
       a $5.85\\times$ cut from $V\\times H=23{,}040{,}000$). (2) The model metric is <b>masked-token accuracy</b> on
       the held-out MLM task (the paper's own pre-training objective; downstream it would be GLUE/RACE/SQuAD). The
       no-skill baseline is random guessing $=1/V$ (for the tiny $V=32$ vocab, ~$3\\%$ &mdash; matching the
       CODEVIZ curves' step-0 values ~0.028&ndash;0.034), and the cross-entropy at init should be about
       $-\\ln(1/V)=\\ln 32\\approx3.47$.</p>
       <ul>
         <li><b>Sanity checks before the full run.</b> (1) Print the param counts and assert the factorized
         embedding equals $V\\times E+E\\times H$ and the shared model stores one block's weights, not $L$ (shared
         should be ~$L\\times$ fewer encoder params than not-shared). (2) Check output shape is
         $(B,\\text{SEQ},V)$ and that initial loss $\\approx\\ln V$. (3) Overfit a single batch with masking
         turned up &mdash; masked-token accuracy should climb toward ~1.0; if it cannot memorize one batch, the
         masking/loss wiring is broken (loss must be computed over masked positions only).</li>
         <li><b>Expected range.</b> On the tiny arithmetic-progression MLM, a correct build reaches roughly
         ~0.80 masked-token accuracy shared and ~0.87 not-shared by step ~600 (our run, approximate, not the
         paper's). Far above the ~$3\\%$ random baseline means it is learning; stuck near $3\\%$ means it is not.
         For the paper's headline, quote it as-is: ALBERT-base 12M vs BERT-base 108M params (~$9\\times$ fewer),
         new SOTA on GLUE/RACE/SQuAD (abstract, Table 1) &mdash; do not reproduce these on the toy model.</li>
         <li><b>Ablation &mdash; prove the key idea earns its keep.</b> The central trick is <b>cross-layer
         parameter sharing</b>. Toggle it OFF (one block looped $L$ times &rarr; an <code>nn.ModuleList</code> of
         $L$ distinct blocks), changing nothing else (same $E,H,L$, data, optimizer, seed). The parameter count
         must jump (~37k &rarr; ~138k in our run, ~$3.7\\times$) and accuracy must rise only modestly
         (~0.80 &rarr; ~0.87) &mdash; the small-cost/large-cut trade of Table 4. If sharing changes the param count
         but not by ~$L\\times$ on the encoder, the block is being duplicated rather than reused. Separately, the
         SOP-vs-NSP ablation is conceptual here: an NSP-trained model scores ~52% (chance) on SOP while an
         SOP-trained one scores ~86.5% (paper, &sect;3.1, Table 5).</li>
         <li><b>Failure signals &amp; what they mean.</b> <i>Accuracy stuck at ~$1/V$ (~3%)</i> &rarr; labels/targets
         misaligned, loss not restricted to masked positions, or learning rate dead. <i>Shared and not-shared have
         the same param count</i> &rarr; the "shared" path is still instantiating $L$ blocks. <i>Residual-add shape
         mismatch</i> &rarr; forgot the <code>Linear(E,H)</code> up-projection, so width-$E$ vectors hit the
         width-$H$ encoder. <i>Loss starts far from $\\ln V$</i> &rarr; head dimension wrong ($H\\to V$) or logits
         not over the full vocab. <i>Tiny-vocab embedding "saving" looks negligible</i> &rarr; expected, not a bug:
         the factorization win scales with $V$ ($\\approx H/E$ only when $V\\gg H$); read it from the large worked
         example.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the Transformer primitives ship in PyTorch and you
       built them in <b>paper-transformer</b>, so here you <b>import</b> the block and implement only ALBERT's
       two parameter tricks plus the measurement. <b>Import:</b> <code>nn.Embedding</code>,
       <code>nn.Linear</code>, <code>nn.LayerNorm</code>, multi-head attention (reuse your
       paper-transformer block), the optimizer, and <code>F.cross_entropy</code>. <b>Build by hand:</b> the
       factorized embedding (<code>Embedding(V,E)</code> then <code>Linear(E,H)</code>), the cross-layer
       sharing loop (one block applied $L$ times), the parameter-count comparison, and the
       <b>sharing ablation</b> (one shared block vs $L$ distinct blocks). SOP is a loss/data change we
       describe and reason about in practice, not a coded cell.</p>`,
    pitfalls:
      `<ul>
        <li><b>Thinking sharing makes the model shallower.</b> A shared model is still $L$ layers <i>deep</i>
        &mdash; the input passes through $L$ transformations &mdash; it just reuses one block's <i>weights</i>.
        Compute per forward pass is unchanged; only the stored parameter count shrinks. <b>Fix:</b> loop the
        same block $L$ times, do <i>not</i> reduce the loop count.</li>
        <li><b>Expecting the embedding saving on a tiny vocab.</b> The factorization win scales with $V$:
        $\\frac{VH}{VE+EH}\\approx H/E$ only when $V \\gg H$. On a toy vocab of 32 tokens the saving is small;
        on $V=30{,}000$ it is dramatic. <b>Fix:</b> read the saving from the large worked example, not just
        the tiny run.</li>
        <li><b>Confusing SOP with NSP.</b> Both are binary sentence-pair losses, but NSP's negative is a
        sentence from <i>another</i> document (so topic alone can solve it), while SOP's negative is the
        <i>same two</i> consecutive segments with their <b>order swapped</b> (same topic, only coherence
        differs). Mixing them up misses the whole point of &sect;3.1.</li>
        <li><b>Forgetting the up-projection.</b> After <code>Embedding(V, E)</code> the vectors are width $E$;
        you must apply the <code>Linear(E, H)</code> before the encoder, or the residual adds will not line up
        with the hidden size $H$.</li>
        <li><b>Reading our small numbers as the paper's.</b> Our tiny MLM accuracy and param counts are an
        illustration. The headline GLUE/RACE/SQuAD figures are only those QUOTED from the paper.</li>
      </ul>`,
    recall: [
      "State the embedding factorization: from $O(V \\times H)$ to what, and why is it smaller when $E \\ll H$?",
      "What exactly does cross-layer parameter sharing reuse, and is the model still $L$ layers deep?",
      "How does SOP's negative example differ from NSP's, and why does that force the model to learn coherence not topic?",
      "Roughly how many parameters does ALBERT-base have versus BERT-base (Table 1)?"
    ],
    practice: [
      {
        q: `<b>The sharing ablation.</b> Your tiny encoder trains an MLM. With cross-layer sharing ON
            (ALBERT-style, one block applied $L$ times) it reaches ~0.80 masked-token accuracy with about
            37k parameters; turn sharing OFF (BERT-style, $L$ distinct blocks) and it reaches ~0.87 with about
            138k parameters. What is the trade-off ALBERT is making, and does it match the paper's Table 4?`,
        steps: [
          { do: `Change only the layer wiring: ALBERT-style uses one <code>EncoderBlock</code> looped $L$ times; the ablation uses an <code>nn.ModuleList</code> of $L$ distinct blocks. Keep $E$, $H$, $L$, data, optimizer, and seed identical.`, why: `An honest ablation changes exactly one thing &mdash; weight sharing &mdash; so any difference is attributable to it.` },
          { do: `Compare both axes: parameters (37k shared vs 138k not-shared, ~3.7&times; fewer) and final accuracy (~0.80 vs ~0.87).`, why: `Sharing's value is parameters-per-accuracy: a small accuracy cost buys a large parameter cut.` },
          { do: `Relate to the paper: Table 4 reports sharing-all costs only a small drop in the downstream average versus not sharing (about &minus;1.5 absolute for ALBERT-base).`, why: `The qualitative effect &mdash; big parameter cut, small accuracy cost &mdash; reproduces on toy data even though the absolute numbers are ours, not the paper's.` }
        ],
        answer: `<p>Sharing trades a small accuracy drop for a large parameter cut: in our run ~0.80 vs ~0.87
                 accuracy but ~3.7&times; fewer parameters (37k vs 138k). That is exactly ALBERT's bet &mdash;
                 the redundant per-layer weights buy little, so removing them costs little. It matches the
                 direction of Table 4, where sharing all parameters drops the downstream average only modestly
                 (~&minus;1.5 for ALBERT-base) while shrinking the model. The CODEVIZ panel shows the two
                 training curves and the parameter counts side by side.</p>`
      },
      {
        q: `In the worked example ($V=30{,}000$, $H=768$, $E=128$) the embedding shrank from $23.0$M to
            $3.9$M parameters. Where did almost all of that saving come from, and why does the extra
            $E\\times H$ matrix not matter?`,
        steps: [
          { do: `Split the factorized count: $V\\times E = 30{,}000\\times128 = 3{,}840{,}000$ and $E\\times H = 128\\times768 = 98{,}304$.`, why: `The token table $V\\times E$ dominates because $V$ is huge; the up-projection $E\\times H$ does not depend on $V$.` },
          { do: `Compare the big terms: $V\\times H = 23{,}040{,}000$ vs $V\\times E = 3{,}840{,}000$, a $6\\times$ cut, because $E$ is $6\\times$ smaller than $H$.`, why: `The whole saving is the per-token vector going from width $H=768$ to width $E=128$.` },
          { do: `Note $98{,}304$ is ~0.4% of $23$M, so adding it back is negligible.`, why: `The up-projection is one small matrix shared by all tokens, not one-per-token.` }
        ],
        answer: `<p>Almost all the saving comes from shrinking the per-token vector from $H=768$ to $E=128$:
                 the $V\\times E$ table ($3.84$M) is $6\\times$ smaller than the $V\\times H$ table ($23.0$M)
                 because $E$ is $6\\times$ smaller than $H$. The added $E\\times H = 98{,}304$ up-projection is
                 a single shared matrix &mdash; about 0.4% of the original &mdash; so it does not undo the win.
                 This is why the factorization helps most when the vocabulary $V$ is large.</p>`
      },
      {
        q: `<b>SOP vs NSP (conceptual ablation).</b> Suppose you pre-train one model with BERT's NSP and
            another with ALBERT's SOP, then test each on the SOP task (decide if two same-document segments are
            in order or swapped). The paper finds the NSP-trained model scores ~52% (about chance) while the
            SOP-trained one scores ~86.5%. Why can't the NSP-trained model do SOP?`,
        steps: [
          { do: `Recall NSP's negative: sentence B is drawn from a <i>different</i> document, so topic usually differs from A.`, why: `NSP can be solved by topic-matching alone &mdash; "are these about the same subject?" &mdash; without modeling order or coherence.` },
          { do: `Recall SOP's negative: the <i>same two</i> consecutive segments with their order swapped &mdash; identical topic, only the order flipped.`, why: `Topic gives zero signal on SOP, so the model must judge discourse coherence/order.` },
          { do: `Conclude an NSP-trained model never learned order, so on SOP it is near chance (~52%); an SOP-trained model did, so it scores ~86.5%.`, why: `Each loss teaches the skill its own negatives require; only SOP's negatives require coherence.` }
        ],
        answer: `<p>NSP's negative comes from a different document, so it is solvable by topic alone &mdash; the
                 model never has to learn sentence order. SOP's negative is the same two segments with order
                 swapped, so topic is useless and only coherence/order separates positive from negative. A model
                 trained on NSP therefore never acquired the ordering skill and scores ~52% (chance) on SOP,
                 while the SOP-trained model scores ~86.5%. This is why ALBERT replaced NSP with SOP for
                 multi-sentence downstream tasks (&sect;3.1, Table 5).</p>`
      }
    ]
  });

  window.CODE["paper-albert"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we reuse a standard Transformer encoder block (built in <b>paper-transformer</b>) and add
       ALBERT's two parameter tricks (&sect;3.1): a <b>factorized embedding</b>
       (<code>Embedding(V, E)</code> then <code>Linear(E, H)</code> with $E \\lt H$) and <b>cross-layer
       sharing</b> (one block applied $L$ times). The first cell recomputes the worked example exactly
       &mdash; ALBERT-base's embedding $23{,}040{,}000 \\to 3{,}938{,}304$ ($5.85\\times$ smaller). Then we
       print the parameter counts of our tiny model with both tricks vs neither, and train a small
       <b>masked-language model</b> (hide ~15% of tokens, predict them) in both settings as the
       <b>sharing ablation</b>. Sharing reaches slightly lower accuracy for far fewer parameters &mdash;
       ALBERT's trade. Paste into Colab and run (torch is preinstalled &mdash; no pip).</p>`,
    code: `import math
import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)

# === 0. Worked example: ALBERT-base embedding factorization (Table 1: V=30000, H=768, E=128). ===
V_big, H_big, E_big = 30000, 768, 128
emb_bert   = V_big * H_big                     # 23,040,000
emb_albert = V_big * E_big + E_big * H_big     # 3,840,000 + 98,304 = 3,938,304
print("BERT-base embedding   V*H      =", emb_bert)        # 23040000
print("ALBERT-base embedding V*E+E*H  =", emb_albert,
      "=", V_big * E_big, "+", E_big * H_big)               # 3938304 = 3840000 + 98304
print("saving =", emb_bert - emb_albert,
      " ratio = %.2fx smaller" % (emb_bert / emb_albert))   # 19101696, 5.85x


# === 1. A standard Transformer encoder block (from paper-transformer): MHA + FFN, residual+LayerNorm. ===
class MHA(nn.Module):
    def __init__(self, d, h):
        super().__init__()
        self.h, self.dk = h, d // h
        self.Wq, self.Wk, self.Wv, self.Wo = (nn.Linear(d, d) for _ in range(4))
    def _split(self, x):
        B, S, _ = x.shape
        return x.view(B, S, self.h, self.dk).transpose(1, 2)
    def forward(self, x):
        Q, K, Vv = self._split(self.Wq(x)), self._split(self.Wk(x)), self._split(self.Wv(x))
        a = F.softmax(Q @ K.transpose(-2, -1) / math.sqrt(self.dk), dim=-1) @ Vv
        B, _, S, _ = a.shape
        return self.Wo(a.transpose(1, 2).contiguous().view(B, S, self.h * self.dk))

class EncoderBlock(nn.Module):
    def __init__(self, d, h, ff):
        super().__init__()
        self.attn = MHA(d, h)
        self.ff = nn.Sequential(nn.Linear(d, ff), nn.ReLU(), nn.Linear(ff, d))
        self.n1, self.n2 = nn.LayerNorm(d), nn.LayerNorm(d)
    def forward(self, x):
        x = self.n1(x + self.attn(x))
        return self.n2(x + self.ff(x))


# === 2. Tiny ALBERT-style encoder. Two flags toggle the tricks (and the ablation). ===
V, H, E, L, h, ff = 32, 64, 16, 4, 4, 128   # tiny vocab/width so it trains fast
SEQ, B = 12, 64
MASK = 1                                    # token id reserved for [MASK]

def positional_encoding(n, d):
    pos = torch.arange(n).unsqueeze(1).float()
    i2 = torch.arange(0, d, 2).float()
    den = torch.pow(10000.0, i2 / d)
    pe = torch.zeros(n, d)
    pe[:, 0::2] = torch.sin(pos / den)
    pe[:, 1::2] = torch.cos(pos / den)
    return pe

class TinyALBERT(nn.Module):
    def __init__(self, factorized=True, shared=True):
        super().__init__()
        self.shared = shared
        if factorized:                                  # ALBERT: V->E then E->H  (\\S 3.1)
            self.emb = nn.Embedding(V, E)
            self.proj = nn.Linear(E, H)
        else:                                           # BERT: V->H directly
            self.emb = nn.Embedding(V, H)
            self.proj = None
        self.register_buffer("pe", positional_encoding(SEQ, H))
        if shared:                                      # ALBERT: ONE block reused L times (\\S 3.1)
            self.block = EncoderBlock(H, h, ff)
            self.blocks = None
        else:                                           # BERT: L distinct blocks (ablation)
            self.blocks = nn.ModuleList([EncoderBlock(H, h, ff) for _ in range(L)])
            self.block = None
        self.head = nn.Linear(H, V)                     # MLM head: predict the token at each position
    def forward(self, t):
        x = self.emb(t)
        if self.proj is not None:
            x = self.proj(x)                            # up-project E -> H
        x = x + self.pe[:x.shape[1]]
        if self.shared:
            for _ in range(L):                          # same weights, applied L times (still L deep)
                x = self.block(x)
        else:
            for b in self.blocks:
                x = b(x)
        return self.head(x)
    def nparams(self):
        return sum(p.numel() for p in self.parameters())

# Parameter-count comparison on the tiny model.
bert_style   = TinyALBERT(factorized=False, shared=False)   # no tricks
albert_style = TinyALBERT(factorized=True,  shared=True)    # both tricks
print("\\ntiny BERT-style   (no factorize, no share) params:", bert_style.nparams())
print("tiny ALBERT-style (factorize + share)      params:", albert_style.nparams())
print("tiny embedding  V*H =", V * H, "  vs  V*E+E*H =", V * E + E * H)


# === 3. Small MLM task with LEARNABLE structure: arithmetic-progression sequences. ===
# token[i] = (start + i*step) mod (V-2) + 2  -> a masked token is recoverable from its neighbors.
def mask_batch():
    start = torch.randint(0, V - 2, (B, 1))
    step = torch.randint(1, 5, (B, 1))
    idx = torch.arange(SEQ).unsqueeze(0)
    t = ((start + idx * step) % (V - 2)) + 2          # tokens 2..V-1 (0,1 reserved)
    inp = t.clone()
    m = (torch.rand(B, SEQ) < 0.15)                   # mask ~15% (BERT/ALBERT rate)
    inp[m] = MASK
    return inp, t, m

def train(factorized, shared, steps=600, lr=3e-3):
    torch.manual_seed(0)
    net = TinyALBERT(factorized, shared)
    opt = torch.optim.Adam(net.parameters(), lr=lr)
    for s in range(steps):
        inp, tgt, m = mask_batch()
        logits = net(inp)
        loss = F.cross_entropy(logits[m], tgt[m])     # loss over masked positions only
        opt.zero_grad(); loss.backward(); opt.step()
        if s % 150 == 0 or s == steps - 1:
            acc = (logits[m].argmax(-1) == tgt[m]).float().mean().item()
            print(f"  step {s:4d}  loss {loss.item():.4f}  masked-acc {acc:.3f}")
    return net, acc

print("\\nALBERT-style (factorize + SHARE):")
net_share, acc_share = train(factorized=True, shared=True)
print("BERT-style ablation (factorize, NO share):")
net_nosh, acc_nosh = train(factorized=True, shared=False)
print(f"\\nfinal masked-acc  shared: {acc_share:.3f} ({net_share.nparams()} params)"
      f"   not-shared: {acc_nosh:.3f} ({net_nosh.nparams()} params)")
# shared reaches ~0.80 acc with ~37k params; not-shared ~0.87 with ~138k params (~3.7x more).
# Sharing trades a small accuracy drop for a big parameter cut -- ALBERT's bet (\\S 3.1, Table 4).
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-albert"] = {
    question: "Does ALBERT's cross-layer sharing (one block reused L times) keep MLM accuracy close to a BERT-style stack of L distinct blocks, while using far fewer parameters?",
    charts: [
      {
        type: "line",
        title: "Masked-token accuracy vs step — ALBERT-style sharing vs BERT-style distinct layers (ablation)",
        xlabel: "training step",
        ylabel: "masked-token accuracy",
        series: [
          {
            name: "shared (ALBERT, ~37k params)",
            color: "#7ee787",
            points: [[0,0.028],[50,0.035],[100,0.064],[150,0.080],[200,0.124],[250,0.191],[300,0.291],[350,0.333],[400,0.461],[450,0.423],[500,0.635],[550,0.697],[599,0.798]]
          },
          {
            name: "not shared (BERT, ~138k params)",
            color: "#ff7b72",
            points: [[0,0.034],[50,0.142],[100,0.312],[150,0.476],[200,0.822],[250,0.734],[300,0.836],[350,0.881],[400,0.873],[450,0.855],[500,0.936],[550,0.907],[599,0.870]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A tiny BERT-style encoder (vocab 32, H=64, E=16, L=4, 4 heads) trained as a masked-language model on arithmetic-progression sequences (~15% tokens masked). GREEN shares ONE encoder block across all 4 layers (ALBERT, \\S 3.1) and reaches ~0.80 masked-token accuracy with only ~37k parameters. RED uses 4 distinct blocks (BERT-style, the ablation) and reaches ~0.87 with ~138k parameters (~3.7x more). Same depth, width, embedding factorization, data, optimizer, and seed; the only difference is weight sharing. This reproduces the paper's qualitative finding (Table 4): sharing costs only a small accuracy drop for a large parameter cut.",
    code: `import math, torch, torch.nn as nn, torch.nn.functional as F

V, H, E, L, h, ff = 32, 64, 16, 4, 4, 128
SEQ, B, MASK = 12, 64, 1

def pe_table(n, d):
    pos = torch.arange(n).unsqueeze(1).float(); i2 = torch.arange(0, d, 2).float()
    den = torch.pow(10000.0, i2 / d); t = torch.zeros(n, d)
    t[:, 0::2] = torch.sin(pos / den); t[:, 1::2] = torch.cos(pos / den); return t

class MHA(nn.Module):
    def __init__(s, d, h):
        super().__init__(); s.h, s.dk = h, d // h
        s.Wq, s.Wk, s.Wv, s.Wo = (nn.Linear(d, d) for _ in range(4))
    def sp(s, x): B, S, _ = x.shape; return x.view(B, S, s.h, s.dk).transpose(1, 2)
    def forward(s, x):
        Q, K, Vv = s.sp(s.Wq(x)), s.sp(s.Wk(x)), s.sp(s.Wv(x))
        a = F.softmax(Q @ K.transpose(-2, -1) / math.sqrt(s.dk), -1) @ Vv
        B, _, S, _ = a.shape
        return s.Wo(a.transpose(1, 2).contiguous().view(B, S, s.h * s.dk))

class Block(nn.Module):
    def __init__(s, d, h, ff):
        super().__init__(); s.a = MHA(d, h)
        s.f = nn.Sequential(nn.Linear(d, ff), nn.ReLU(), nn.Linear(ff, d))
        s.n1, s.n2 = nn.LayerNorm(d), nn.LayerNorm(d)
    def forward(s, x): x = s.n1(x + s.a(x)); return s.n2(x + s.f(x))

class ALBERT(nn.Module):
    def __init__(s, shared=True):
        super().__init__(); s.shared = shared
        s.emb = nn.Embedding(V, E); s.proj = nn.Linear(E, H)   # factorized embedding (both runs)
        s.register_buffer("pe", pe_table(SEQ, H))
        if shared: s.block = Block(H, h, ff); s.blocks = None
        else: s.blocks = nn.ModuleList([Block(H, h, ff) for _ in range(L)]); s.block = None
        s.head = nn.Linear(H, V)
    def forward(s, t):
        x = s.proj(s.emb(t)) + s.pe[:t.shape[1]]
        if s.shared:
            for _ in range(L): x = s.block(x)
        else:
            for b in s.blocks: x = b(x)
        return s.head(x)
    def n(s): return sum(p.numel() for p in s.parameters())

def mask_batch():
    start = torch.randint(0, V - 2, (B, 1)); step = torch.randint(1, 5, (B, 1))
    idx = torch.arange(SEQ).unsqueeze(0)
    t = ((start + idx * step) % (V - 2)) + 2
    inp = t.clone(); m = (torch.rand(B, SEQ) < 0.15); inp[m] = MASK
    return inp, t, m

def run(shared, steps=600):
    torch.manual_seed(0)
    net = ALBERT(shared); opt = torch.optim.Adam(net.parameters(), lr=3e-3); accs = []
    for s in range(steps):
        inp, tgt, m = mask_batch(); lg = net(inp)
        loss = F.cross_entropy(lg[m], tgt[m])
        opt.zero_grad(); loss.backward(); opt.step()
        accs.append((lg[m].argmax(-1) == tgt[m]).float().mean().item())
    return net, accs

ns, sh = run(True); nn_, no = run(False)
idx = list(range(0, 600, 50)) + [599]
print("shared  (%d params):" % ns.n(),  [[i, round(sh[i], 3)] for i in idx])
print("noshare (%d params):" % nn_.n(), [[i, round(no[i], 3)] for i in idx])
# shared -> ~0.80 acc, ~37k params; noshare -> ~0.87 acc, ~138k params (~3.7x more).`
  };
})();
