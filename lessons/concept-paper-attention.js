/* Paper lesson — Scaled Dot-Product Attention (Vaswani et al., 2017).
   Grounded from arXiv:1706.03762 (abstract) + ar5iv HTML (Section 3.2 / 3.2.1, Equation 1).
   Scope: ONLY the scaled dot-product attention primitive, §3.2.1. The full Transformer
   (multi-head, positional encoding, encoder/decoder) is the separate lesson paper-transformer.
   Track A (primitive): build softmax(QK^T/sqrt(d_k))V from scratch with raw torch, verify with
   torch.allclose vs F.scaled_dot_product_attention. Self-contained: lesson + CODE + CODEVIZ by id. */
(function () {
  window.LESSONS.push({
    id: "paper-attention",
    title: "Scaled Dot-Product Attention — Attention Is All You Need (2017)",
    tagline: "Let every token look at every other token: weight values by how well a query matches each key, with one scaled-dot-product softmax.",
    module: "Papers · Transformers & LLMs",
    track: "primitive",

    paper: {
      authors: "Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin",
      org: "Google Brain / Google Research / University of Toronto",
      year: 2017,
      venue: "NeurIPS 2017 (arXiv:1706.03762)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1706.03762",
      code: "https://github.com/tensorflow/tensor2tensor"
    },

    conceptLink: "dl-attention",
    partOf: [
      { capstone: "capstone-mini-gpt", step: 2, builds: "Scaled dot-product attention from scratch" }
    ],
    prereqs: ["dl-attention", "ml-softmax", "pt-nn-module", "pt-autograd"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> To process a sentence, a model must let each word use information from other words.
       Before this paper the standard tool was the <b>recurrent neural network</b> (RNN): a model that reads a
       sequence one token at a time, carrying a running summary (a "hidden state") forward from step to step.
       ("Token" = one unit of input, here a word or sub-word.)</p>
       <p>RNNs have two problems. First, they are <b>sequential</b>: step $t$ cannot start until step $t-1$
       finishes, so they are hard to run in parallel on modern hardware. Second, information from a far-away word
       has to survive many small update steps to reach the current word, so <b>long-range</b> dependencies are
       weak. <b>Attention</b> had already been bolted onto RNNs (the Bahdanau 2014 lesson) to help, but it was
       always an add-on to the recurrence.</p>
       <p>This paper asks: what if attention is the <i>only</i> mechanism &mdash; no recurrence at all? The
       primitive that makes this work is <b>scaled dot-product attention</b> (Section 3.2.1), the single idea this
       lesson covers. (Stacking it into the full Transformer is the separate <code>paper-transformer</code> lesson.)</p>`,

    contribution:
      `<p>This lesson focuses on ONE contribution from the paper &mdash; the attention primitive of Section 3.2.1:</p>
       <ul>
         <li><b>Scaled dot-product attention.</b> A way for a set of <b>queries</b> to read from a set of
         <b>keys</b> and <b>values</b>: score each query against every key with a dot product, scale by
         $1/\\sqrt{d_k}$, softmax the scores into weights, and return the weighted average of the values.</li>
         <li><b>The $1/\\sqrt{d_k}$ scaling.</b> The small but crucial fix that keeps the dot products from
         growing so large that the softmax saturates and its gradients vanish (Section 3.2.1).</li>
       </ul>
       <p>The paper's larger contributions &mdash; <b>multi-head</b> attention, <b>positional encoding</b>, and
       the full encoder/decoder <b>Transformer</b> &mdash; build on top of this primitive and are covered in
       <code>paper-transformer</code>. We cross-link there; we do not duplicate them here.</p>`,

    whyItMattered:
      `<p>Scaled dot-product attention is the computational core of the Transformer, which became the backbone of
       essentially all modern large language models (GPT, BERT, T5) and spread to vision, audio, and biology.
       Because the operation is just two matrix multiplies and a softmax, it runs fully in parallel across the
       sequence &mdash; the property that made training on huge corpora practical. In this course it is step 2 of
       the <b>mini-GPT capstone</b>: the exact primitive you build here is the one a GPT block calls.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Section 3.2.1, "Scaled Dot-Product Attention", and Equation (1)</b> &mdash; the whole subject of
         this lesson. One equation plus the paragraph explaining the $1/\\sqrt{d_k}$ scaling.</li>
         <li><b>Figure 2 (left)</b> &mdash; the diagram of the primitive: MatMul &rarr; Scale &rarr; (Mask) &rarr;
         SoftMax &rarr; MatMul.</li>
       </ul>
       <p><b>Skim now, save for <code>paper-transformer</code>:</b> Section 3.2.2 (Multi-Head Attention),
       Section 3.5 (Positional Encoding), and Sections 3.1/3.3 (the encoder/decoder stack). They compose this
       primitive but are out of scope here.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> You will feed a tiny set of 2 query vectors, 2 key vectors, and 2 value
       vectors through the formula by hand and in code. If a query's dot product with key&nbsp;1 is much larger
       than with key&nbsp;2, what will the two attention <b>weights</b> for that query look like &mdash; close to
       $[1,0]$, or close to $[0.5,0.5]$? And the output: closer to value&nbsp;1 or to the average of the two
       values? Write your guess, then check the worked example and the attention map.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write <code>my_attention(Q, K, V)</code> with raw tensors, no
       <code>F.scaled_dot_product_attention</code>:</p>
       <ul>
         <li><code>Q</code> is <code>(n_q, d_k)</code>, <code>K</code> is <code>(n_k, d_k)</code>, <code>V</code>
         is <code>(n_k, d_v)</code>. Compute raw scores. <code># TODO: scores = Q @ K.transpose(-2,-1)</code></li>
         <li>Scale by $1/\\sqrt{d_k}$. <code># TODO: scores = scores / (d_k ** 0.5)</code> &mdash; read
         <code>d_k</code> off <code>Q.shape[-1]</code>.</li>
         <li>Softmax over the <b>last</b> dimension (over keys), one weight row per query.
         <code># TODO: w = scores.softmax(dim=-1)</code></li>
         <li>Weighted average of the values. <code># TODO: return w @ V</code></li>
       </ul>
       <p>The CODE cell below is the full reference, including the <code>torch.allclose</code> check against
       <code>F.scaled_dot_product_attention</code> &mdash; that passing check proves your formula IS PyTorch's.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Think of attention as a soft lookup table. You hold a <b>query</b> (what you are looking for). The table
       has rows, each with a <b>key</b> (a label for that row) and a <b>value</b> (its content). Instead of
       returning one row, attention returns a <i>blend</i> of all the values, weighted by how well the query
       matches each key. Trace one query through Equation (1):</p>
       <ol>
         <li><b>Score.</b> Dot the query with every key. The dot product is large when two vectors point the same
         way, so it measures match. For all queries at once this is the matrix $QK^\\top$.</li>
         <li><b>Scale.</b> Divide every score by $\\sqrt{d_k}$ (the query/key length). See <code>derivation</code>
         for why this exact factor.</li>
         <li><b>Softmax.</b> Across the keys, turn each query's row of scores into positive weights that sum to 1.
         Big scores get most of the weight.</li>
         <li><b>Blend.</b> Each query's output is those weights times the values &mdash; a weighted average of all
         value vectors. As a matrix product, (weights)$\\,V$.</li>
       </ol>
       <p>One such operation is one "head". The <code>architecture</code> field shows how the model stacks $h$ of
       them (multi-head) and follows each attention block with a per-position feed-forward network.</p>`,

    architecture:
      `<p>The attention block has three parts, each a piece of one of the three equations above.</p>
       <p><b>Q, K, V.</b> Every token is turned into three vectors. A <b>query</b> $Q$ says "what I want"; a
       <b>key</b> $K$ says "what I offer"; a <b>value</b> $V$ says "what I pass on if chosen". In self-attention
       all three come from the same tokens through separate learned linear maps. Queries and keys must share length
       $d_k$ so their dot product is defined; values use length $d_v$, which sets the output width.</p>
       <p><b>The single-head flow (Equation 1), in order:</b></p>
       <ul>
         <li><b>Dot-product score</b> $QK^\\top$, shape $(n_q,n_k)$: entry $(i,j)$ is query $i$ dotted with key $j$ &mdash; a raw match score.</li>
         <li><b>Scale</b> by $1/\\sqrt{d_k}$. The score is a sum of $d_k$ unit-variance products, so its spread grows like $\\sqrt{d_k}$; dividing pulls it back to spread $\\approx1$ and stops the softmax from saturating.</li>
         <li><b>Softmax over keys</b> (the last axis): each query's row becomes positive weights that sum to 1 &mdash; the attention map.</li>
         <li><b>Weighted sum</b> of values: multiply the weight matrix by $V$. Each query's output is a convex blend of all value vectors, shape $(n_q,d_v)$.</li>
       </ul>
       <p><b>Multi-head (Equation set 2).</b> One attention can only average one way. The model runs $h$ heads in
       parallel: head $i$ first projects $Q,K,V$ down with its own learned matrices $W_i^{Q},W_i^{K},W_i^{V}$
       (from $d_{\\mathrm{model}}=512$ to $d_k=d_v=64$), then runs scaled dot-product attention. Each head can
       specialize on a different relationship (e.g. one tracks the previous word, another tracks the subject). The
       $h=8$ head outputs are <b>concatenated</b> back to width $h\\,d_v=512$ and mixed by one final projection
       $W^{O}$. Total cost is similar to one full-width head because each head is $1/h$ as wide.</p>
       <p><b>Position-wise feed-forward (Equation 3).</b> After attention mixes information <i>across</i> positions,
       the FFN transforms each position <i>independently</i>: a linear map up to $d_{ff}=2048$, a ReLU, then a
       linear map back down to $d_{\\mathrm{model}}=512$. Same weights at every position. Attention moves
       information between tokens; the FFN does the per-token nonlinear processing.</p>`,

    symbols: [
      { sym: "token", desc: "one unit of the input sequence (a word or sub-word). Attention operates over a set of tokens." },
      { sym: "query", desc: "a vector saying 'what this position is looking for'. One query per position that is doing the reading." },
      { sym: "key", desc: "a vector labelling 'what a position offers', compared against a query by dot product to score relevance." },
      { sym: "value", desc: "a vector holding the actual content at a position; the output is a weighted average of the values." },
      { sym: "$Q$", desc: "the query matrix, shape $(n_q, d_k)$: $n_q$ query vectors stacked as rows, each of length $d_k$." },
      { sym: "$K$", desc: "the key matrix, shape $(n_k, d_k)$: $n_k$ key vectors as rows, each of length $d_k$ (same length as a query)." },
      { sym: "$V$", desc: "the value matrix, shape $(n_k, d_v)$: $n_k$ value vectors as rows, each of length $d_v$ (one value per key)." },
      { sym: "$d_k$", desc: "the dimension (length) of each query and key vector. The scaling factor uses its square root. In the paper, $d_k=64$." },
      { sym: "$d_v$", desc: "the dimension (length) of each value vector, and so of each output vector. In the paper, $d_v=64$." },
      { sym: "$n_q$", desc: "the number of queries (rows of $Q$ and of the output)." },
      { sym: "$n_k$", desc: "the number of keys, which equals the number of values (rows of $K$ and $V$)." },
      { sym: "$K^\\top$", desc: "the transpose of $K$ (rows become columns), shape $(d_k, n_k)$, so that $QK^\\top$ is a valid matrix product giving an $(n_q, n_k)$ score matrix." },
      { sym: "$QK^\\top$", desc: "the raw score matrix, shape $(n_q, n_k)$: entry $(i,j)$ is the dot product of query $i$ with key $j$ — how well they match." },
      { sym: "$\\sqrt{d_k}$", desc: "the square root of $d_k$; dividing the scores by it keeps the dot products from growing large and saturating the softmax (Section 3.2.1)." },
      { sym: "softmax", desc: "a function that turns a row of real numbers into positive weights that sum to 1; here applied across keys so each query's weights form a distribution." },
      { sym: "attention map", desc: "the $(n_q, n_k)$ matrix of softmax weights after scaling — how much each query attends to each key. Each row sums to 1." },
      { sym: "$d_{\\mathrm{model}}$", desc: "the model's main embedding width — the length of each token vector flowing between layers. In the paper, $d_{\\mathrm{model}}=512$." },
      { sym: "$h$", desc: "the number of attention heads run in parallel. In the paper, $h=8$, and $d_k=d_v=d_{\\mathrm{model}}/h=64$." },
      { sym: "$\\mathrm{head}_i$", desc: "the output of the $i$-th attention head: scaled dot-product attention on $Q,K,V$ after each is projected by that head's own learned matrices." },
      { sym: "$W_i^{Q},W_i^{K},W_i^{V}$", desc: "per-head learned projection matrices, shapes $d_{\\mathrm{model}}\\times d_k$, $d_{\\mathrm{model}}\\times d_k$, $d_{\\mathrm{model}}\\times d_v$ — they map full-width vectors down into head $i$'s subspace." },
      { sym: "$\\mathrm{Concat}$", desc: "stacking the $h$ head outputs side by side along the feature axis, giving width $h\\,d_v$ (which equals $d_{\\mathrm{model}}$ here)." },
      { sym: "$W^{O}$", desc: "the output projection, shape $h\\,d_v\\times d_{\\mathrm{model}}$, that mixes the concatenated heads back into one $d_{\\mathrm{model}}$-wide vector." },
      { sym: "$x$", desc: "in the feed-forward network, the $d_{\\mathrm{model}}$-wide vector at one position (the attention output for that token)." },
      { sym: "$W_1,b_1$", desc: "the first feed-forward layer: weight $d_{\\mathrm{model}}\\times d_{ff}$ and bias, expanding each position from width $d_{\\mathrm{model}}$ up to $d_{ff}$." },
      { sym: "$W_2,b_2$", desc: "the second feed-forward layer: weight $d_{ff}\\times d_{\\mathrm{model}}$ and bias, projecting back down to width $d_{\\mathrm{model}}$." },
      { sym: "$d_{ff}$", desc: "the inner (hidden) width of the position-wise feed-forward network. In the paper, $d_{ff}=2048$." },
      { sym: "$\\max(0,\\cdot)$", desc: "the ReLU nonlinearity: keep positive values, set negatives to 0. The only nonlinearity inside the feed-forward network." }
    ],

    formula:
      `<p><b>(1) Scaled dot-product attention</b> &mdash; the core operation (Equation&nbsp;1, §3.2.1):</p>
       $$\\mathrm{Attention}(Q,K,V)=\\mathrm{softmax}\\!\\left(\\frac{QK^{\\top}}{\\sqrt{d_k}}\\right)V$$
       <p><b>(2) Multi-head attention</b> &mdash; run $h$ attentions in parallel on learned projections, concatenate, project once more (§3.2.2):</p>
       $$\\mathrm{MultiHead}(Q,K,V)=\\mathrm{Concat}(\\mathrm{head}_1,\\dots,\\mathrm{head}_h)\\,W^{O}$$
       $$\\mathrm{head}_i=\\mathrm{Attention}\\!\\left(QW_i^{Q},\\,KW_i^{K},\\,VW_i^{V}\\right)$$
       <p>with projection shapes $W_i^{Q}\\in\\mathbb{R}^{d_{\\mathrm{model}}\\times d_k}$, $W_i^{K}\\in\\mathbb{R}^{d_{\\mathrm{model}}\\times d_k}$, $W_i^{V}\\in\\mathbb{R}^{d_{\\mathrm{model}}\\times d_v}$, and $W^{O}\\in\\mathbb{R}^{h\\,d_v\\times d_{\\mathrm{model}}}$. The paper uses $h=8$, $d_k=d_v=d_{\\mathrm{model}}/h=64$, $d_{\\mathrm{model}}=512$.</p>
       <p><b>(3) Position-wise feed-forward network</b> &mdash; applied to each position separately after attention (Equation&nbsp;2, §3.3):</p>
       $$\\mathrm{FFN}(x)=\\max(0,\\,xW_1+b_1)\\,W_2+b_2$$
       <p>Input and output have width $d_{\\mathrm{model}}=512$; the inner layer has width $d_{ff}=2048$. The $\\max(0,\\cdot)$ is a ReLU.</p>`,

    whatItDoes:
      `<p><b>Equation (1), in words.</b> $QK^\\top$ scores every query against every key; dividing by $\\sqrt{d_k}$
       keeps those scores at a sane scale; the softmax turns each query's row of scores into weights that sum to 1;
       multiplying by $V$ returns, for each query, the weighted average of the value vectors. Output shape
       $(n_q,d_v)$ — one value-sized vector per query.</p>
       <p><b>Equation set (2), in words.</b> Instead of one attention over full-width vectors, project $Q,K,V$ into
       $h$ smaller subspaces with learned matrices, run scaled dot-product attention separately in each (the
       heads), glue the $h$ outputs together, and apply one more learned projection $W^{O}$. Result: the model
       attends to several kinds of relationships at once for about the same compute as one full head.</p>
       <p><b>Equation (2)/FFN, in words.</b> Take each position's vector on its own, push it through a one-hidden-layer
       network (widen to $d_{ff}$, ReLU, narrow back to $d_{\\mathrm{model}}$). This adds per-token nonlinear
       processing on top of the cross-token mixing that attention provides.</p>`,

    derivation:
      `<p>The intuition behind attention &mdash; soft, content-based lookup, and how dot-product scores become a
       weighted average &mdash; is built up in the <code>dl-attention</code> concept lesson. Recap of the one new
       idea this paper adds on top: the <b>scaling</b>. The dot product of two length-$d_k$ vectors with
       unit-variance, mean-zero entries has variance $d_k$ (it is a sum of $d_k$ independent unit-variance terms),
       so standard deviation $\\sqrt{d_k}$. Large pre-softmax scores push the softmax toward a one-hot vector,
       where its Jacobian (and thus the gradient) is almost zero. Dividing by $\\sqrt{d_k}$ restores unit-scale
       scores and healthy gradients. See <code>dl-attention</code> for the alignment/weighted-sum derivation.</p>`,

    example:
      `<p><b>Worked numbers</b> (2 tokens, $d_k=d_v=2$). Take</p>
       <ul>
         <li>$Q=\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}$, $K=\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}$,
         $V=\\begin{bmatrix}10&0\\\\0&10\\end{bmatrix}$, so $d_k=2$.</li>
         <li><b>Scores</b> $QK^\\top=\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}$ (each query dotted with each key).</li>
         <li><b>Scale</b> by $\\sqrt{d_k}=\\sqrt2\\approx1.414$: scores become
         $\\begin{bmatrix}0.707&0\\\\0&0.707\\end{bmatrix}$.</li>
         <li><b>Softmax</b> each row. Row 1: $e^{0.707}\\approx2.028$, $e^{0}=1$, sum $3.028$, so weights
         $[0.6698,\\,0.3302]$. Row 2 is the mirror $[0.3302,\\,0.6698]$. This is the <b>attention map</b>.</li>
         <li><b>Weighted sum</b> with $V$. Output row 1 $=0.6698\\cdot[10,0]+0.3302\\cdot[0,10]=[6.698,\\,3.302]$.
         Row 2 $=[3.302,\\,6.698]$.</li>
       </ul>
       <p>Each query leans toward the value whose key it matched, but blends in the other. The CODE cell
       recomputes these exact numbers and prints them, and checks them against PyTorch.</p>`,

    recipe:
      `<p><b>Scaled dot-product attention (Equation 1 / Figure 2 left), as numbered steps:</b></p>
       <ol>
         <li>Compute raw scores $S=QK^\\top$ (shape $n_q\\times n_k$).</li>
         <li>Scale: $S\\leftarrow S/\\sqrt{d_k}$, reading $d_k$ from the query length.</li>
         <li>(Optional, for decoders) add a mask of $-\\infty$ to disallowed positions so they get zero weight.
         Out of scope here; used in <code>paper-transformer</code>.</li>
         <li>Softmax over the key axis (last dim): $W=\\mathrm{softmax}(S)$, each row summing to 1.</li>
         <li>Output $=WV$ (shape $n_q\\times d_v$).</li>
       </ol>`,

    results:
      `<p>The paper's headline numbers are for the <b>full Transformer</b>, not this primitive alone, so they
       belong to <code>paper-transformer</code>; we do not restate them as a result of this lesson. For the
       record, the abstract reports the Transformer reaching "28.4 BLEU on the WMT 2014 English-to-German
       translation task" and "41.8" BLEU on English-to-French (Source: arXiv:1706.03762 abstract). BLEU is a
       0&ndash;100 machine-translation quality score; higher is better. The correctness check for THIS lesson is
       the code oracle below, not a benchmark.</p>`,

    evaluation:
      `<p><b>What "working" means here.</b> This is a primitive, not a trainable model, so the metric is
       <b>exactness against an oracle</b>, not a benchmark score. Your <code>my_attention(Q,K,V)</code> must
       agree numerically with PyTorch's reference <code>F.scaled_dot_product_attention</code>. The pass/fail
       line is the one in the CODE cell: <code>torch.allclose(mine, ref, atol=1e-6)</code> must be
       <b>True</b>. There is no "random baseline" to beat &mdash; either the formula matches bit-for-bit
       (up to float tolerance) or it is wrong.</p>
       <p><b>Sanity checks before anything else.</b></p>
       <ul>
         <li><b>Shapes.</b> For $Q:(n_q,d_k)$, $K:(n_k,d_k)$, $V:(n_k,d_v)$ the attention map must be
         $(n_q,n_k)$ and the output $(n_q,d_v)$. Wrong output width usually means $d_k$/$d_v$ confused.</li>
         <li><b>Each weight row sums to 1.</b> <code>amap.sum(-1)</code> should be all $\\approx1.0$. If a
         <i>column</i> sums to 1 instead, you softmaxed over queries (wrong axis).</li>
         <li><b>Weights are non-negative and in $[0,1]$</b> &mdash; a softmax cannot produce negatives.</li>
         <li><b>Known-answer test.</b> Re-run the worked 2-token example ($d_k=d_v=2$, identity $Q,K$):
         the map should be $\\approx[[0.6698,0.3302],[0.3302,0.6698]]$ and the output
         $\\approx[[6.698,3.302],[3.302,6.698]]$.</li>
       </ul>
       <p><b>Expected range.</b> The oracle check should pass to <code>atol=1e-6</code> exactly &mdash; this
       is arithmetic, not optimization, so anything beyond float rounding (say a mismatch larger than
       $10^{-5}$) is a bug, not "tuning." The headline BLEU numbers (28.4 EN&ndash;DE, 41.8 EN&ndash;FR;
       Source: arXiv:1706.03762 abstract) belong to the full Transformer in <code>paper-transformer</code>,
       not to this primitive.</p>
       <p><b>Ablation &mdash; prove the scaling earns its keep.</b> The paper's one new idea here is the
       $1/\\sqrt{d_k}$ factor. Turn it OFF (the <code>unscaled</code> function in the CODE cell): the
       allclose vs <code>F.scaled_dot_product_attention</code> now returns <b>False</b>. Then push $d_k$ up
       (say $d_k=64$, entries $\\sim N(0,1)$): the unscaled scores have spread $\\approx\\sqrt{d_k}=8$, the
       softmax saturates toward one-hot, and (in a real training loop) its gradient nearly vanishes &mdash;
       exactly the failure Section 3.2.1 cites. If removing the scale does <i>not</i> change the output, the
       scaling was never wired in.</p>
       <p><b>Failure signals &amp; what they mean.</b></p>
       <ul>
         <li><b>allclose False but shapes correct</b> &rarr; usually the missing/extra $1/\\sqrt{d_k}$, or
         softmax over the wrong axis.</li>
         <li><b>Shape error in the matmul</b> &rarr; you used <code>.T</code> (which flips a batch dim)
         instead of <code>K.transpose(-2,-1)</code>, or mismatched $d_k$ between $Q$ and $K$.</li>
         <li><b>Row sums $\\ne 1$</b> &rarr; softmax over queries, not keys (the classic axis bug).</li>
         <li><b>Weights collapse to nearly one-hot at large $d_k$</b> &rarr; the scale is missing; in
         training this shows up as a stalled loss (saturated-softmax, vanishing gradient).</li>
         <li><b>NaNs</b> &rarr; usually a later masking bug (adding $-\\infty$ on an all-masked row); out of
         scope here, handled in <code>paper-transformer</code>.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> PyTorch ships this as <code>F.scaled_dot_product_attention</code> in one
       call. Here you <b>build it from scratch</b> with raw tensors: $QK^\\top$, divide by $\\sqrt{d_k}$, softmax
       over keys, multiply by $V$. The payoff is the
       <code>torch.allclose(my_attention(Q,K,V), F.scaled_dot_product_attention(Q,K,V))</code> check &mdash; if it
       passes, your formula is provably identical to PyTorch's. Multi-head, masking, and positional encoding are
       <i>not</i> built here; they live in <code>paper-transformer</code>.</p>`,

    pitfalls:
      `<ul>
         <li><b>Softmax over the wrong axis.</b> The softmax must run over the <b>key</b> dimension (the last
         dim of the score matrix), so each <i>query's</i> weights sum to 1. Softmaxing over queries instead
         silently computes nonsense and the allclose fails.</li>
         <li><b>Forgetting the scale.</b> Dropping the $1/\\sqrt{d_k}$ gives a different (un-scaled) attention;
         it will not match <code>F.scaled_dot_product_attention</code>, and at large $d_k$ it trains badly.</li>
         <li><b>Transposing wrong.</b> Scores are $QK^\\top$, i.e. <code>K.transpose(-2,-1)</code> on the last two
         dims &mdash; not a full <code>.T</code>, which mis-transposes any batch dimension.</li>
         <li><b>Confusing $d_k$ and $d_v$.</b> Queries/keys share length $d_k$ (so the dot product is defined);
         values may have a different length $d_v$, which becomes the output length. Mixing them up gives a shape
         error or a wrong output width.</li>
         <li><b>Mask sign.</b> When you later add masking (decoder), disallowed positions get $-\\infty$
         <i>before</i> the softmax (so their weight is 0), not 0 after. Out of scope here, but a classic bug.</li>
       </ul>`,

    recall: [
      "Write Equation (1) from memory: $\\mathrm{Attention}(Q,K,V)=\\mathrm{softmax}(QK^\\top/\\sqrt{d_k})V$.",
      "Define $Q$, $K$, $V$, $d_k$, and $d_v$ in plain English.",
      "Why divide the scores by $\\sqrt{d_k}$ rather than, say, $d_k$?",
      "Over which axis does the softmax run, and why must each row sum to 1?"
    ],

    practice: [
      {
        q: `A query has scores $[2, 0]$ against two keys, with $d_k=4$. Compute the scaled scores and the attention weights.`,
        steps: [
          { do: `Scale by $\\sqrt{d_k}=\\sqrt4=2$: $[2/2,\\,0/2]=[1,\\,0]$.`, why: `Equation (1) divides every score by $\\sqrt{d_k}$.` },
          { do: `Softmax: $e^1\\approx2.718$, $e^0=1$, sum $3.718$. Weights $[2.718/3.718,\\,1/3.718]=[0.731,\\,0.269]$.`, why: `Turns scores into positive weights summing to 1.` }
        ],
        answer: `Scaled scores $[1,0]$; attention weights $[0.731, 0.269]$. The query puts about 73% of its weight on key 1.`
      },
      {
        q: `Ablation: remove the $1/\\sqrt{d_k}$ scaling and use large keys/queries (say $d_k=64$, entries ~$N(0,1)$). What happens to the attention weights and the gradient?`,
        steps: [
          { do: `Note the raw dot products now have standard deviation $\\sqrt{d_k}=8$, so scores like $\\pm16$ are common.`, why: `Variance of a $d_k$-term dot product is $d_k$.` },
          { do: `Softmax of scores that differ by ~16 is nearly one-hot, e.g. $[0.9999,\\dots]$.`, why: `Large gaps saturate the softmax.` },
          { do: `At a near one-hot softmax, its Jacobian (sensitivity) is almost zero, so almost no gradient flows back.`, why: `This is exactly the failure the scaling prevents.` }
        ],
        answer: `Without scaling the weights collapse to nearly one-hot and the softmax's gradient nearly vanishes, so learning stalls — the paper's stated reason for the $1/\\sqrt{d_k}$ factor (Section 3.2.1). The CODE cell shows the unscaled version no longer matches PyTorch.`
      },
      {
        q: `If $Q$ is $(3, 8)$, $K$ is $(5, 8)$, and $V$ is $(5, 16)$, what is the shape of the attention map and of the output?`,
        steps: [
          { do: `Score matrix is $QK^\\top$: $(3,8)\\times(8,5)=(3,5)$.`, why: `Each of 3 queries scored against each of 5 keys.` },
          { do: `Softmax does not change shape, so the attention map is $(3,5)$.`, why: `Weights, one row per query over the 5 keys.` },
          { do: `Output is (weights)$\\,V$: $(3,5)\\times(5,16)=(3,16)$.`, why: `Each query returns a $d_v=16$-length blended value.` }
        ],
        answer: `Attention map $(3,5)$; output $(3,16)$. Note $d_k=8$ must match between $Q$ and $K$, while $d_v=16$ sets the output width.`
      }
    ]
  });

  window.CODE["paper-attention"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build scaled dot-product attention from scratch with raw tensors: scores = Q @ K^T, divide by ` +
      `sqrt(d_k), softmax over the key axis, multiply by V. Then prove it is identical to PyTorch with ` +
      `torch.allclose vs F.scaled_dot_product_attention, recompute the 2-token worked example, and print the ` +
      `tiny attention map. Runs in Colab (torch is preinstalled).`,
    code: `import torch, torch.nn.functional as F

torch.manual_seed(0)

def my_attention(Q, K, V):
    """Scaled dot-product attention — Eq.(1) of Vaswani et al. (2017), Section 3.2.1.
       Q:(n_q,d_k)  K:(n_k,d_k)  V:(n_k,d_v)  ->  (n_q,d_v), plus the attention map."""
    d_k = Q.shape[-1]
    scores = Q @ K.transpose(-2, -1)        # (n_q, n_k): query i vs key j
    scores = scores / (d_k ** 0.5)          # scale by 1/sqrt(d_k)
    weights = scores.softmax(dim=-1)        # softmax over KEYS (last dim); each row sums to 1
    out = weights @ V                       # weighted average of the values
    return out, weights

# ---- THE ORACLE: my version must equal F.scaled_dot_product_attention ----
n_q, n_k, d_k, d_v = 3, 5, 8, 16
Q = torch.randn(n_q, d_k); K = torch.randn(n_k, d_k); V = torch.randn(n_k, d_v)
mine, _ = my_attention(Q, K, V)
ref = F.scaled_dot_product_attention(Q, K, V)   # PyTorch's built-in, same scaling
print("allclose vs F.scaled_dot_product_attention:", torch.allclose(mine, ref, atol=1e-6))  # expect True

# show that DROPPING the scale breaks the match (the ablation)
def unscaled(Q, K, V):
    return (Q @ K.transpose(-2,-1)).softmax(dim=-1) @ V
print("allclose if we forget 1/sqrt(d_k):", torch.allclose(unscaled(Q,K,V), ref, atol=1e-6))  # expect False

# ---- recompute the worked example: 2 tokens, d_k=d_v=2 ----
Qe = torch.eye(2); Ke = torch.eye(2); Ve = torch.tensor([[10.,0.],[0.,10.]])
out_e, w_e = my_attention(Qe, Ke, Ve)
print("worked-example attention map:\\n", w_e)        # ~ [[0.6698,0.3302],[0.3302,0.6698]]
print("worked-example output:\\n", out_e)             # ~ [[6.698,3.302],[3.302,6.698]]

# ---- a tiny attention map you can read ----
torch.manual_seed(1)
Qt = torch.randn(4, 8); Kt = torch.randn(4, 8); Vt = torch.randn(4, 8)
_, amap = my_attention(Qt, Kt, Vt)
print("4x4 attention map (rows=queries, cols=keys, each row sums to 1):")
for row in amap.tolist():
    print("  ", [round(x, 2) for x in row])
print("row sums:", [round(s, 3) for s in amap.sum(-1).tolist()])  # all ~1.0`
  };

  window.CODEVIZ["paper-attention"] = {
    question: "On a tiny set of tokens, what does the scaled-dot-product attention map look like — does each query concentrate weight on the key it matches best, and does each row sum to 1?",
    charts: [
      {
        type: "bar",
        title: "Attention weights for query 0 over 4 keys (our toy run) — most weight lands on the best-matching key",
        xlabel: "key index",
        ylabel: "attention weight (row of the softmax)",
        series: [
          {
            name: "query 0 weights",
            color: "#7ee787",
            points: [[0, 0.0841], [1, 0.1228], [2, 0.0421], [3, 0.7510]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (torch, seed 1), not a number from the paper. Four random 8-dim tokens used as Q, K, V; we plot the first row of softmax(QK^T/sqrt(8)). Query 0 puts ~0.75 of its weight on key 3 (its best dot-product match) and spreads the rest thinly over the others. The four weights sum to 1.000 — that row-normalization is exactly what the softmax over the key axis guarantees. This is the qualitative behavior of Equation (1): content-based, soft selection that still blends in the other values.",
    code: `import torch, torch.nn.functional as F
torch.manual_seed(1)

# 4 toy tokens, d_k = 8; same tensors are Q, K and V (self-attention style)
Q = torch.randn(4, 8); K = torch.randn(4, 8); V = torch.randn(4, 8)
d_k = Q.shape[-1]
amap = (Q @ K.transpose(-2,-1) / d_k**0.5).softmax(dim=-1)   # (4,4) attention map

print("full attention map (rows sum to 1):")
for r in amap.tolist():
    print("  ", [round(x,4) for x in r])
print("query 0 weights:", [round(x,4) for x in amap[0].tolist()])  # ~[0.0841,0.1228,0.0421,0.7510]
print("row sums:", [round(s,3) for s in amap.sum(-1).tolist()])    # all 1.0`
  };
})();
