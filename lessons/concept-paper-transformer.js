/* Paper lesson — "Attention Is All You Need" (the Transformer), Vaswani et al. 2017.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-transformer".
   GROUNDED from arXiv:1706.03762 (abstract) and the ar5iv HTML mirror (Sections 3.1-3.5, Eqns 1-2).
   Track B (architecture): build multi-head attention + sinusoidal positional encoding + an encoder
   block by hand on top of nn.Linear; train a tiny transformer on a toy reverse-sequence task; ablate the
   positional encoding (order is lost). The scaled-dot-product derivation lives in paper-attention
   (cross-linked); the bigger-picture math lives in concept mod-transformer. */
(function () {
  window.LESSONS.push({
    id: "paper-transformer",
    title: "Transformer — Attention Is All You Need (2017)",
    tagline: "Drop recurrence and convolution; build a sequence model out of attention, positional encoding, and residual+LayerNorm blocks.",
    module: "Papers · Transformers & LLMs",
    track: "architecture",
    paper: {
      authors: "Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin",
      org: "Google Brain, Google Research, University of Toronto",
      year: 2017,
      venue: "arXiv:1706.03762 (Jun 2017); NeurIPS 2017",
      citations: "Very highly cited; exact count not fetched, so omitted to avoid an invented number.",
      arxiv: "https://arxiv.org/abs/1706.03762",
      code: "https://github.com/tensorflow/tensor2tensor"
    },
    conceptLink: "mod-transformer",
    partOf: [
      { capstone: "capstone-mini-gpt", step: 3, builds: "the multi-head attention + positional encoding + encoder block" }
    ],
    prereqs: ["mod-transformer", "dl-attention", "pt-nn-module", "pt-tensors", "dl-backprop"],

    // WHY READ IT
    problem:
      `<p>Before this paper, the standard way to model a sequence (a sentence, a time series) was a
       <b>Recurrent Neural Network (RNN)</b>: a model that reads one token at a time, carrying a running
       summary (the <b>hidden state</b>) forward step by step. A <b>token</b> is one unit of input &mdash; a
       word or sub-word piece. That left-to-right chain has two costs the paper calls out (&sect;1):</p>
       <ul>
        <li><b>It cannot parallelize within a sequence.</b> Step $t$ needs the hidden state from step
        $t-1$, so the $T$ steps of a length-$T$ sequence must run in order &mdash; you cannot compute them
        all at once. The paper notes this "precludes parallelization within training examples."</li>
        <li><b>Long-range dependencies are hard.</b> For one token to influence a token far away, the
        signal must survive many recurrent steps; information decays over distance.</li>
       </ul>
       <p>Attention had already been bolted <i>onto</i> RNNs to help with the second problem (letting a
       decoder look back at any encoder position). This paper asks the radical question: what if attention
       is the <i>whole</i> model and we throw the recurrence away entirely?</p>`,
    contribution:
      `<ul>
        <li><b>The Transformer architecture.</b> A sequence model "based solely on attention mechanisms,
        dispensing with recurrence and convolutions entirely" (abstract). Because every position is
        processed in parallel, training is far faster than an RNN.</li>
        <li><b>Multi-head attention.</b> Instead of one attention function, run $h$ of them in parallel on
        <i>different learned projections</i> of the input, then concatenate. Each "head" can specialize on a
        different relationship (&sect;3.2.2).</li>
        <li><b>Sinusoidal positional encoding.</b> Attention is order-blind by itself (it is a weighted sum,
        order does not matter). The paper injects position by <b>adding</b> fixed sine/cosine waves of
        different frequencies to the token embeddings (&sect;3.5).</li>
        <li><b>The encoder/decoder block.</b> Each sub-layer (attention, feed-forward) is wrapped in a
        <b>residual connection</b> followed by <b>Layer Normalization</b>: $\\mathrm{LayerNorm}(x +
        \\mathrm{Sublayer}(x))$ (&sect;3.1).</li>
      </ul>`,
    whyItMattered:
      `<p>This architecture is the backbone of essentially every modern large language model &mdash; GPT,
       BERT, T5, and their descendants are all stacks of Transformer blocks. The parallelism it unlocked is
       what made training on internet-scale text feasible. The phrase "attention is all you need" became
       literally true for a decade of progress. The encoder block you build here is also step 3 of the
       <b>mini-GPT capstone</b>.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.1 (Encoder and Decoder Stacks)</b> &mdash; the block structure: $N=6$ identical
        layers, two sub-layers each, and the residual+LayerNorm wrapper $\\mathrm{LayerNorm}(x +
        \\mathrm{Sublayer}(x))$. Note that all sub-layers output dimension $d_{\\text{model}}=512$ so the
        residual add lines up.</li>
        <li><b>&sect;3.2.2 (Multi-Head Attention)</b> &mdash; Equation for $\\mathrm{MultiHead}$ and
        $\\mathrm{head}_i$; the values $h=8$, $d_k=d_v=d_{\\text{model}}/h=64$. This is the equation you
        transcribe and implement.</li>
        <li><b>&sect;3.5 (Positional Encoding)</b> &mdash; the sine/cosine formulas and the one-sentence
        reason they chose them (extrapolation to longer sequences).</li>
        <li><b>Figure 1</b> &mdash; the full encoder-decoder diagram. For this lesson, focus on the
        <i>left</i> tower (the encoder).</li>
       </ul>
       <p><b>Skim:</b> &sect;3.2.1 (scaled dot-product attention itself) &mdash; we recap it but its full
       derivation is its own lesson, <b>paper-attention</b>. Also skim the decoder masking details
       (&sect;3.2.3 masked attention), the BLEU result tables (&sect;6), and the training schedule
       (&sect;5.3) unless you want to reproduce the paper.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train a tiny Transformer encoder on a <b>reverse task</b>: given a short sequence of
       symbols, output it <i>backwards</i> (so the output at position $i$ must be the input at position
       $N{-}1{-}i$). Now suppose we <b>remove the positional encoding</b> &mdash; the model sees only the
       token embeddings with no signal about <i>where</i> each token sits. Self-attention is a weighted
       <i>sum</i> over positions. Will the model still be able to reverse the sequence, or will it lose track
       of order? Write your guess and one sentence of reasoning, then run the ablation.</p>
       <p>(We use <b>reverse</b> rather than plain copy on purpose: copying needs no position &mdash; each
       output token equals the input token at the same spot &mdash; so it would not expose the ablation.
       Reversing <i>requires</i> knowing position, so it does.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the three pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>positional_encoding(seq_len, d_model)</code>: a table where row $pos$, column $2i$ is
        $\\sin(pos / 10000^{2i/d_{\\text{model}}})$ and column $2i{+}1$ is the matching $\\cos$. TODO: build
        it once and <b>add</b> it to the token embeddings.</li>
        <li><code>MultiHeadAttention(nn.Module)</code>: linear maps <code>W_q, W_k, W_v</code> (each
        <code>nn.Linear(d_model, d_model)</code>), then TODO: <b>reshape</b> the output into $h$ heads of
        size $d_k = d_{\\text{model}}/h$, run scaled dot-product attention <i>per head</i>, concatenate, and
        apply the output projection <code>W_o</code>.</li>
        <li><code>EncoderBlock(nn.Module)</code>: TODO: wrap attention and the feed-forward network each in
        <code>x = LayerNorm(x + sublayer(x))</code> (&sect;3.1).</li>
       </ul>
       <p>Then train on the reverse task with positional encoding ON, and again with it OFF (the ablation).
       Predict which one learns.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The Transformer encoder turns a sequence of token embeddings into a sequence of
       <b>context-aware</b> embeddings &mdash; same length, but now each position's vector has absorbed
       information from the others. It does this with no recurrence; every position is computed in parallel.
       Three ideas combine.</p>
       <p><b>1. Self-attention (recap; full derivation in paper-attention).</b> Each token produces three
       vectors via learned linear maps: a <b>query</b> $q$ ("what am I looking for?"), a <b>key</b> $k$
       ("what do I offer?"), and a <b>value</b> $v$ ("what I'll pass on if attended to"). A token's output is
       a weighted sum of all the values, where the weight on token $j$ comes from how well query $i$ matches
       key $j$. Stacking queries/keys/values into matrices $Q,K,V$, &sect;3.2.1 gives
       $\\mathrm{Attention}(Q,K,V) = \\mathrm{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V$.
       The $\\sqrt{d_k}$ divisor keeps the dot products from growing with dimension &mdash; that scaling and
       its gradient argument are the subject of the <b>paper-attention</b> lesson, so we only use it here.</p>
       <p><b>2. Multi-head attention (&sect;3.2.2).</b> One attention function can only blend information one
       way. The paper instead runs $h$ attentions in parallel, each on its own learned low-dimensional
       projection of $Q,K,V$. With $d_{\\text{model}}=512$ and $h=8$ heads, each head works in
       $d_k=d_v=512/8=64$ dimensions. The $h$ head outputs are concatenated back to $d_{\\text{model}}$ and
       passed through a final linear map $W^O$. Different heads can specialize &mdash; one might track the
       previous word, another a long-range subject-verb link.</p>
       <p><b>3. Positional encoding (&sect;3.5).</b> Attention is a weighted sum, so by itself it is
       <b>permutation-invariant</b> &mdash; shuffle the tokens and the output set is unchanged. To give the
       model word order, the paper <b>adds</b> a fixed vector to each token embedding that depends only on
       the position. That vector is built from sine and cosine waves of geometrically increasing wavelength,
       so each position gets a unique, smoothly varying "fingerprint."</p>
       <p><b>The block (&sect;3.1).</b> An encoder layer applies multi-head <i>self</i>-attention (queries,
       keys, values all come from the same sequence), then a small position-wise feed-forward network. Each
       of those two sub-layers is wrapped as $\\mathrm{LayerNorm}(x + \\mathrm{Sublayer}(x))$: a
       <b>residual connection</b> (add the input back, the same "$+x$" trick as ResNet) followed by
       <b>Layer Normalization</b> (re-center and re-scale each token's vector). All sub-layers output the
       same dimension $d_{\\text{model}}=512$ so the residual add lines up. Stack $N=6$ such layers.</p>`,
    symbols: [
      { sym: "token", desc: "one unit of input &mdash; a word or sub-word piece. A sequence is a list of tokens." },
      { sym: "$d_{\\text{model}}$", desc: "the <b>model width</b>: the length of every token vector throughout the encoder. The paper uses $512$; the residual add forces every sub-layer to keep this width." },
      { sym: "$N$", desc: "the number of <b>stacked encoder layers</b> (identical blocks). The paper uses $N=6$." },
      { sym: "$Q, K, V$", desc: "the <b>query</b>, <b>key</b>, and <b>value</b> matrices: rows are the per-token query / key / value vectors. Query = what a token looks for; key = what a token offers; value = what it passes on when attended to." },
      { sym: "$d_k,\\ d_v$", desc: "the <b>per-head</b> width of the key/query and the value. With $h$ heads, $d_k=d_v=d_{\\text{model}}/h$ (here $64$)." },
      { sym: "$\\mathrm{softmax}$", desc: "turns a row of scores into positive weights that sum to $1$: $\\mathrm{softmax}(z)_j = e^{z_j}/\\sum_l e^{z_l}$. Here it makes each token's attention over the others a probability distribution." },
      { sym: "$\\sqrt{d_k}$", desc: "the <b>scaling factor</b> dividing the scores $QK^\\top$, so the dot products do not grow with dimension. (Why exactly $\\sqrt{d_k}$ is derived in the paper-attention lesson.)" },
      { sym: "$h$", desc: "the number of <b>attention heads</b> run in parallel. The paper uses $h=8$." },
      { sym: "$\\mathrm{head}_i$", desc: "the output of the $i$-th attention head: scaled dot-product attention on $Q,K,V$ first projected by that head's matrices $W_i^Q, W_i^K, W_i^V$." },
      { sym: "$W_i^Q, W_i^K, W_i^V$", desc: "per-head learned <b>projection matrices</b> ($d_{\\text{model}}\\times d_k$ or $\\times d_v$) that map the full-width $Q,K,V$ down into head $i$'s subspace." },
      { sym: "$W^O$", desc: "the <b>output projection</b> ($hd_v \\times d_{\\text{model}}$) applied after concatenating the $h$ heads, mixing them back into one $d_{\\text{model}}$ vector." },
      { sym: "$\\mathrm{Concat}$", desc: "concatenation: lay the $h$ head outputs (each $d_v$ wide) side by side into one $hd_v = d_{\\text{model}}$ vector." },
      { sym: "$PE_{(pos,\\,i)}$", desc: "the <b>positional encoding</b>: entry $i$ of the fixed vector added to the token at position $pos$. Even $i$ uses $\\sin$, odd $i$ uses $\\cos$." },
      { sym: "$pos$", desc: "the <b>position index</b> of a token in the sequence ($0,1,2,\\dots$)." },
      { sym: "$\\mathrm{LayerNorm}$", desc: "<b>Layer Normalization</b>: re-center and re-scale each token's vector to mean $0$, variance $1$ (then a learned scale/shift). Applied per token, over its features." },
      { sym: "$\\mathrm{Sublayer}(x)$", desc: "either the multi-head self-attention or the feed-forward network &mdash; the function whose output is added back to its input $x$ (the residual) before LayerNorm." },
      { sym: "permutation-invariant", desc: "a plain term: an operation whose output does not depend on input order. Plain self-attention is permutation-invariant, which is exactly why positional encoding is needed." }
    ],
    formula: `$$ \\mathrm{MultiHead}(Q,K,V) = \\mathrm{Concat}(\\mathrm{head}_1,\\dots,\\mathrm{head}_h)\\,W^O, \\qquad \\mathrm{head}_i = \\mathrm{Attention}(QW_i^Q,\\,KW_i^K,\\,VW_i^V) \\quad\\text{(\\S 3.2.2)} $$
$$ PE_{(pos,\\,2i)} = \\sin\\!\\Big(\\tfrac{pos}{10000^{\\,2i/d_{\\text{model}}}}\\Big), \\qquad PE_{(pos,\\,2i+1)} = \\cos\\!\\Big(\\tfrac{pos}{10000^{\\,2i/d_{\\text{model}}}}\\Big) \\quad\\text{(\\S 3.5)} $$`,
    whatItDoes:
      `<p><b>Top line (multi-head attention, &sect;3.2.2).</b> Project $Q,K,V$ into $h$ separate
       lower-dimensional spaces with the learned matrices $W_i^Q,W_i^K,W_i^V$; run the scaled dot-product
       attention $\\mathrm{Attention}(\\cdot)=\\mathrm{softmax}(QK^\\top/\\sqrt{d_k})V$ <i>inside each</i>
       space to get $\\mathrm{head}_i$; concatenate the $h$ results and mix them with $W^O$. The win:
       $h$ heads attend in $h$ different ways at once, for the same total compute as one full-width head.</p>
       <p><b>Bottom line (positional encoding, &sect;3.5).</b> Build a fixed table indexed by position $pos$
       and feature $i$. Even features are sine waves, odd features are cosine waves, and the wavelength grows
       geometrically with $i$ (from $2\\pi$ up to $10000\\cdot 2\\pi$). <b>Add</b> this table to the token
       embeddings. Now two tokens with identical content but different positions get different inputs, so the
       order-blind attention can tell them apart. The paper chose sines over learned position vectors because
       "it may allow the model to extrapolate to sequence lengths longer than the ones encountered during
       training" (&sect;3.5).</p>`,
    derivation:
      `<p><b>Why multi-head, briefly.</b> A single attention output is one convex combination of the value
       vectors per query &mdash; one "lens" on the sequence. The paper's argument (&sect;3.2.2) is that
       averaging through a single attention "inhibits" the model from attending to different things at once;
       splitting into $h$ heads on different projected subspaces lets the model "jointly attend to
       information from different representation subspaces at different positions." Keeping each head at
       $d_k=d_{\\text{model}}/h$ means the total cost matches a single full-width head.</p>
       <p><b>Why sinusoids, briefly.</b> For a fixed offset $k$, $PE_{(pos+k)}$ is a <i>fixed linear
       function</i> of $PE_{(pos)}$ &mdash; this follows from the angle-addition identities
       $\\sin(a+b)=\\sin a\\cos b + \\cos a\\sin b$ and $\\cos(a+b)=\\cos a\\cos b - \\sin a\\sin b$: shifting
       position by $k$ rotates each sine/cosine pair by a fixed angle. The paper hypothesized this makes it
       "easy for the model to learn to attend by relative positions" (&sect;3.5). The scaled dot-product
       scaling argument (why $\\sqrt{d_k}$) is the heart of the <b>paper-attention</b> lesson &mdash; head
       there for that derivation; here we only consume the result.</p>`,
    example:
      `<p>Work multi-head attention by hand with a <b>2-head split</b>, tiny enough to check every number.
       Let $d_{\\text{model}}=4$, $h=2$ heads, so each head has width $d_k=d_v=4/2=2$. Take a 2-token sequence
       and assume (for clarity) that the query/key/value projections are the identity, so $Q=K=V=X$ with</p>
       <p>$$ X = \\begin{bmatrix} 2 & 0 & 1 & 1 \\\\ 0 & 2 & 1 & -1 \\end{bmatrix}\\!. $$</p>
       <p><b>Split into heads.</b> Head 1 takes columns $0,1$; head 2 takes columns $2,3$:</p>
       <ul class="steps">
        <li><b>Head 1.</b> $Q=K=V=\\begin{bmatrix}2&0\\\\0&2\\end{bmatrix}$. Scores
        $= QK^\\top/\\sqrt{2} = \\begin{bmatrix}4&0\\\\0&4\\end{bmatrix}/\\sqrt 2 =
        \\begin{bmatrix}2.83&0\\\\0&2.83\\end{bmatrix}$.
        Softmax of token 0's row $[2.83, 0]$: weights $\\approx [0.944,\\,0.056]$. Head-1 output for token 0
        $= 0.944\\,[2,0] + 0.056\\,[0,2] = [1.888,\\,0.112]$.</li>
        <li><b>Head 2.</b> $Q=K=V=\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}$. Scores for token 0
        $= [\\,(1\\cdot1+1\\cdot1),\\,(1\\cdot1+1\\cdot(-1))\\,]/\\sqrt 2 = [2,0]/\\sqrt 2 = [1.414,\\,0]$.
        Softmax: weights $\\approx [0.804,\\,0.196]$. Head-2 output for token 0
        $= 0.804\\,[1,1] + 0.196\\,[1,-1] = [1.0,\\,0.609]$.</li>
        <li><b>Concatenate the heads</b> back to width $4$:
        $\\mathrm{Concat}([1.888,0.112],\\,[1.0,0.609]) = [1.888,\\,0.112,\\,1.0,\\,0.609]$ &mdash; then $W^O$
        (here identity) would mix it. <b>Notice the heads attended differently</b>: head 1 put $94\\%$ on
        token 0, head 2 only $80\\%$. That is the whole point &mdash; two lenses, one pass.</li>
       </ul>
       <p>And a <b>positional-encoding</b> check ($d_{\\text{model}}=4$, &sect;3.5). Position $pos=1$:
       column $0$ is $\\sin(1/10000^{0}) = \\sin(1) \\approx 0.8415$; column $1$ is $\\cos(1)\\approx 0.5403$;
       column $2$ is $\\sin(1/10000^{1/2}) = \\sin(0.01) \\approx 0.0100$; column $3$ is
       $\\cos(0.01)\\approx 1.0$. So $PE_{(1)} \\approx [0.8415,\\,0.5403,\\,0.0100,\\,1.0]$, while
       $PE_{(0)} = [0,1,0,1]$ &mdash; different positions, different vectors.</p>
       <p>All of these exact numbers are recomputed in the notebook's first cells so you can check them by
       running.</p>`,
    recipe:
      `<ol>
        <li><b>Embed + add position.</b> Map tokens to $d_{\\text{model}}$-dim vectors; build the sinusoidal
        $PE$ table (&sect;3.5) and <b>add</b> it: $x = \\mathrm{Embed}(\\text{tokens}) + PE$.</li>
        <li><b>Multi-head self-attention (&sect;3.2.2).</b> Project $x$ to $Q,K,V$ with three
        <code>nn.Linear</code>s; reshape each into $h$ heads of width $d_k$; run scaled dot-product attention
        per head; concatenate; apply the output projection $W^O$.</li>
        <li><b>Residual + LayerNorm (&sect;3.1).</b> $x = \\mathrm{LayerNorm}(x + \\mathrm{Attn}(x))$.</li>
        <li><b>Feed-forward (&sect;3.3).</b> A two-layer position-wise network
        $\\mathrm{FFN}(x)=\\max(0, xW_1+b_1)W_2 + b_2$; then $x = \\mathrm{LayerNorm}(x + \\mathrm{FFN}(x))$.</li>
        <li><b>Stack</b> $N$ such blocks (we use a small $N$ for the toy task).</li>
        <li><b>Train</b> on the reverse task; then <b>ablate</b>: remove the $+PE$ and retrain &mdash; order is lost.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): the Transformer "achieves 28.4 BLEU on the WMT 2014
       English-to-German translation task" and "a new single-model state-of-the-art BLEU score of 41.8" on
       English-to-French, "after training for 3.5 days on eight GPUs, a small fraction of the training costs
       of the best models from the literature." (BLEU = Bilingual Evaluation Understudy, a translation-quality
       score; higher is better.)</p>
       <p><i>These are the paper's reported figures, quoted from the abstract. The numbers in the CODE and
       CODEVIZ panels below are from our own tiny reverse-task run &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you
       <b>import</b> them and build only the novel composition. <b>Import:</b> <code>nn.Linear</code>,
       <code>nn.LayerNorm</code>, <code>nn.Embedding</code>, the optimizer, and <code>F.softmax</code>.
       <b>Build by hand:</b> the sinusoidal positional-encoding table, the reshape-into-$h$-heads multi-head
       attention (you MAY reuse your own scaled-dot-product from <b>paper-attention</b>), the encoder block's
       residual+LayerNorm wiring, and the <b>positional-encoding ablation</b>. We recap scaled dot-product
       attention but do not re-derive the $\\sqrt{d_k}$ scaling &mdash; that is the paper-attention lesson.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting positional encoding.</b> Without it, self-attention is permutation-invariant: the
        model literally cannot tell <code>"a b c"</code> from <code>"c b a"</code>. <b>Fix:</b> add the $PE$
        table to the embeddings (and verify with the ablation that removing it breaks the reverse task).</li>
        <li><b>Reshaping heads wrong.</b> To split width $d_{\\text{model}}$ into $h$ heads of $d_k$, reshape
        to <code>(batch, seq, h, d_k)</code> then <b>transpose</b> to <code>(batch, h, seq, d_k)</code> so
        attention runs per head. Forgetting the transpose attends across the wrong axis. Concatenation must
        exactly invert this.</li>
        <li><b>Scaling by the wrong $d$.</b> The softmax scaling is $\\sqrt{d_k}$ (the <i>per-head</i> width,
        $64$ in the paper), not $\\sqrt{d_{\\text{model}}}$. Using the full width over-shrinks the scores.</li>
        <li><b>Residual then norm, in that order.</b> The paper applies $\\mathrm{LayerNorm}(x +
        \\mathrm{Sublayer}(x))$ &mdash; add the input back <i>first</i>, then normalize. (Some later variants
        do "pre-norm"; the original is post-norm. Match the paper for this lesson.)</li>
        <li><b>Mismatched widths break the residual.</b> The "$+x$" needs the sub-layer to output
        $d_{\\text{model}}$; that is why $W^O$ maps $hd_v \\to d_{\\text{model}}$ and the FFN returns to
        $d_{\\text{model}}$.</li>
      </ul>`,
    recall: [
      "Write the multi-head attention equation (\\S 3.2.2) from memory, including what $\\mathrm{head}_i$ is.",
      "Why is plain self-attention permutation-invariant, and how does positional encoding fix it?",
      "State the encoder sub-layer wrapper $\\mathrm{LayerNorm}(x + \\mathrm{Sublayer}(x))$ and name the two sub-layers.",
      "With $d_{\\text{model}}=512$ and $h=8$, what is $d_k$? Why divide the scores by $\\sqrt{d_k}$?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> Your tiny Transformer reverses a sequence correctly with positional encoding
            ON (it reaches ~100% token accuracy). Remove the single line that adds the $PE$ table to the
            embeddings and retrain. What happens to the accuracy, and what does that demonstrate about
            self-attention?`,
        steps: [
          { do: `Delete only the position signal: change <code>x = embed(tokens) + PE</code> to <code>x = embed(tokens)</code>; keep depth, width, heads, optimizer, data, and seed identical.`, why: `An honest ablation changes exactly one thing &mdash; the positional encoding &mdash; so any difference is attributable to it.` },
          { do: `Retrain and watch token accuracy: with $PE$ ON it climbs toward ~100%; with $PE$ OFF it plateaus near chance (~0.32 in our run) and never reverses.`, why: `Reversing needs the output at position $i$ to fetch the input at position $N{-}1{-}i$ &mdash; impossible without a position signal, since self-attention is a permutation-invariant weighted sum.` },
          { do: `Conclude that positional encoding, not extra capacity, is what lets the attention-only model respect order.`, why: `Both runs share architecture and parameter count; only the $+PE$ differs, isolating it as the cause.` }
        ],
        answer: `<p>With positional encoding removed, accuracy collapses to near chance &mdash; the model can still
                 learn <i>which</i> symbols appear but cannot place them in reversed order, because
                 self-attention is permutation-invariant (a weighted sum does not depend on position). Since
                 the two runs are
                 identical except for the "$+PE$", this isolates positional encoding as the source of order
                 information. The CODEVIZ panel shows exactly this contrast.</p>`
      },
      {
        q: `In the worked example ($d_{\\text{model}}=4$, $h=2$), head 1 put weight $[0.944, 0.056]$ on the two
            tokens while head 2 put $[0.804, 0.196]$. Why is it <i>useful</i> that the two heads attend
            differently, and what would $h=1$ (a single full-width head) cost you?`,
        steps: [
          { do: `Note that each head ran on a different 2-dim slice of the input, so they "saw" different content and produced different attention weights.`, why: `That is multi-head's purpose (\\S 3.2.2): jointly attend to different representation subspaces at once.` },
          { do: `Imagine collapsing to one head over all 4 dims: you get a single attention distribution per query, one lens on the sequence.`, why: `A single averaged attention can only express one relationship at a time; the paper says this "inhibits" attending to several things.` },
          { do: `Confirm the cost is the same: $h$ heads of width $d_{\\text{model}}/h$ total the same compute as one head of width $d_{\\text{model}}$.`, why: `Splitting buys expressivity (multiple lenses) for free.` }
        ],
        answer: `<p>Different heads give the model several attention patterns in one pass &mdash; e.g. one head
                 tracking a nearby token, another a distant one. A single head ($h=1$) forces one averaged
                 distribution per query, which the paper notes inhibits attending to multiple things at once.
                 Because each head is $1/h$ as wide, the total compute is unchanged, so multi-head buys
                 expressivity essentially for free.</p>`
      },
      {
        q: `Your positional-encoding check gave $PE_{(0)} = [0,1,0,1]$ and
            $PE_{(1)} \\approx [0.8415, 0.5403, 0.0100, 1.0]$ for $d_{\\text{model}}=4$. Why is column 2
            ($0.0100$) so much smaller than column 0 ($0.8415$) at the same position, and what does that
            spread of frequencies buy the model?`,
        steps: [
          { do: `Read the formula: column $0$ uses $\\sin(pos/10000^{0})=\\sin(pos)$; column $2$ uses $\\sin(pos/10000^{1/2})=\\sin(pos/100)$.`, why: `The exponent $2i/d_{\\text{model}}$ grows with the column, so the angular frequency shrinks &mdash; later columns are slow waves.` },
          { do: `At $pos=1$: $\\sin(1)\\approx0.8415$ but $\\sin(0.01)\\approx0.01$.`, why: `The slow wave has barely moved from position $0$, so its value is near $0$.` },
          { do: `Conclude the table mixes fast and slow waves, so each position gets a unique multi-scale fingerprint and nearby positions stay similar on slow channels.`, why: `Multi-scale frequencies let the model read both fine and coarse position, and (via angle-addition) shifts become linear &mdash; aiding relative-position attention.` }
        ],
        answer: `<p>The exponent $2i/d_{\\text{model}}$ makes higher columns lower-frequency: column 0 is
                 $\\sin(pos)$ (fast), column 2 is $\\sin(pos/100)$ (slow), so at $pos=1$ the slow wave is still
                 near $0$ ($\\sin(0.01)\\approx0.01$). Spanning many frequencies gives every position a unique,
                 smoothly varying fingerprint at multiple scales, and the angle-addition identities make a
                 shift by $k$ a fixed linear map &mdash; which is why the paper expected it to help the model
                 attend by relative position.</p>`
      }
    ]
  });

  window.CODE["paper-transformer"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> sinusoidal positional encoding, multi-head attention (reshape into
       $h$ heads, scaled dot-product per head, concat, $W^O$), and an encoder block (residual + LayerNorm)
       by hand on top of <code>nn.Linear</code> / <code>nn.LayerNorm</code> / <code>nn.Embedding</code>. We
       then train a tiny Transformer on a <b>reverse task</b> (output is the input backwards) and <b>print it
       learning</b>. The <b>ablation</b> removes the $+PE$ and retrains &mdash; accuracy collapses to near
       chance because attention is permutation-invariant (a plain copy would <i>not</i> expose this, since
       copying needs no position). The first cells recompute the worked example: the 2-head split giving
       <code>[1.888, 0.112, 1.0, 0.609]</code> and $PE_{(1)}=[0.8415, 0.5403, 0.0100, 1.0]$. Paste into Colab
       and run (torch is preinstalled &mdash; no pip).</p>`,
    code: `import math
import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)

# === 0a. Worked example: 2-head split (d_model=4, h=2, d_k=2), identity projections. ===
X = torch.tensor([[2., 0., 1., 1.],
                  [0., 2., 1., -1.]])          # 2 tokens, d_model=4
def sdpa(Q, K, V):                              # scaled dot-product attention (your paper-attention primitive)
    dk = Q.shape[-1]
    scores = Q @ K.transpose(-2, -1) / math.sqrt(dk)
    return F.softmax(scores, dim=-1) @ V
h1 = sdpa(X[:, 0:2], X[:, 0:2], X[:, 0:2])      # head 1 = columns 0,1
h2 = sdpa(X[:, 2:4], X[:, 2:4], X[:, 2:4])      # head 2 = columns 2,3
concat = torch.cat([h1, h2], dim=-1)
print("head1 token0 =", [round(v, 4) for v in h1[0].tolist()])   # [1.8884, 0.1116]
print("head2 token0 =", [round(v, 4) for v in h2[0].tolist()])   # [1.0, 0.6089]
print("concat token0 =", [round(v, 4) for v in concat[0].tolist()])  # [1.8884, 0.1116, 1.0, 0.6089]

# === 0b. Worked example: sinusoidal positional encoding (d_model=4). ===
def positional_encoding(seq_len, d_model):
    pos = torch.arange(seq_len).unsqueeze(1).float()             # (seq_len, 1)
    i2  = torch.arange(0, d_model, 2).float()                    # 0, 2, 4, ...  (the "2i")
    denom = torch.pow(10000.0, i2 / d_model)                     # 10000^(2i/d_model)
    pe = torch.zeros(seq_len, d_model)
    pe[:, 0::2] = torch.sin(pos / denom)                         # even cols: sin
    pe[:, 1::2] = torch.cos(pos / denom)                         # odd cols:  cos
    return pe
pe = positional_encoding(2, 4)
print("PE(pos=0) =", [round(v, 4) for v in pe[0].tolist()])     # [0.0, 1.0, 0.0, 1.0]
print("PE(pos=1) =", [round(v, 4) for v in pe[1].tolist()])     # [0.8415, 0.5403, 0.01, 0.9999]


# === 1. Multi-head attention, built by hand (reshape -> per-head SDPA -> concat -> W^O). ===
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, h):
        super().__init__()
        assert d_model % h == 0
        self.h, self.d_k = h, d_model // h
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)

    def _split(self, x):                                  # (B, S, d_model) -> (B, h, S, d_k)
        B, S, _ = x.shape
        return x.view(B, S, self.h, self.d_k).transpose(1, 2)

    def forward(self, x):
        Q, K, V = self.W_q(x), self.W_k(x), self.W_v(x)
        Q, K, V = self._split(Q), self._split(K), self._split(V)
        scores = Q @ K.transpose(-2, -1) / math.sqrt(self.d_k)   # \\S 3.2.1 scaling = sqrt(d_k)
        out = F.softmax(scores, dim=-1) @ V                      # (B, h, S, d_k)
        B, _, S, _ = out.shape
        out = out.transpose(1, 2).contiguous().view(B, S, self.h * self.d_k)  # concat heads
        return self.W_o(out)                                     # \\S 3.2.2 multi-head + W^O


# === 2. Encoder block: LayerNorm(x + Sublayer(x)) for attention and feed-forward (\\S 3.1, 3.3). ===
class EncoderBlock(nn.Module):
    def __init__(self, d_model, h, d_ff):
        super().__init__()
        self.attn = MultiHeadAttention(d_model, h)
        self.ff = nn.Sequential(nn.Linear(d_model, d_ff), nn.ReLU(), nn.Linear(d_ff, d_model))
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)

    def forward(self, x):
        x = self.norm1(x + self.attn(x))      # residual + LayerNorm around attention
        x = self.norm2(x + self.ff(x))        # residual + LayerNorm around feed-forward
        return x


# === 3. A tiny Transformer encoder for the COPY task. use_pe toggles the ablation. ===
class TinyTransformer(nn.Module):
    def __init__(self, vocab, d_model=32, h=4, d_ff=64, n_layers=2, max_len=12, use_pe=True):
        super().__init__()
        self.use_pe = use_pe
        self.embed = nn.Embedding(vocab, d_model)
        self.register_buffer("pe", positional_encoding(max_len, d_model))
        self.blocks = nn.ModuleList([EncoderBlock(d_model, h, d_ff) for _ in range(n_layers)])
        self.out = nn.Linear(d_model, vocab)

    def forward(self, tokens):
        x = self.embed(tokens)
        if self.use_pe:
            x = x + self.pe[:x.shape[1]]      # the single line the ablation removes
        for blk in self.blocks:
            x = blk(x)
        return self.out(x)                    # (B, S, vocab) -> predict the target token at each position


# === 4. Toy REVERSE task: target is the input sequence backwards. ===
# (We use reverse, not plain copy: copying needs no position -- each output = same-position input --
#  so it would NOT expose the positional-encoding ablation. Reversing requires position, so it does.)
VOCAB, SEQ, B = 10, 8, 128
def batch():
    t = torch.randint(1, VOCAB, (B, SEQ))     # symbols 1..VOCAB-1 (0 reserved/unused)
    return t, torch.flip(t, dims=[1])         # reverse: target = input read backwards

def train(use_pe, steps=800, lr=3e-3):
    torch.manual_seed(0)
    net = TinyTransformer(VOCAB, use_pe=use_pe)
    opt = torch.optim.Adam(net.parameters(), lr=lr)
    lf = nn.CrossEntropyLoss()
    for s in range(steps):
        x, y = batch()
        logits = net(x)
        loss = lf(logits.reshape(-1, VOCAB), y.reshape(-1))
        opt.zero_grad(); loss.backward(); opt.step()
        if s % 200 == 0 or s == steps - 1:
            acc = (logits.argmax(-1) == y).float().mean().item()
            print(f"  step {s:4d}  loss {loss.item():.4f}  token-acc {acc:.3f}")
    return acc

print("\\nWITH positional encoding (use_pe=True):")
acc_pe = train(use_pe=True)
print("WITHOUT positional encoding  (ABLATION, use_pe=False):")
acc_no = train(use_pe=False)
print(f"\\nfinal token accuracy  PE-on: {acc_pe:.3f}   PE-off: {acc_no:.3f}")
# PE-on climbs toward ~1.0 (it learns to reverse); PE-off plateaus near chance (~0.32 in our run)
# because self-attention is permutation-invariant and cannot tell which position to fetch.
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-transformer"] = {
    question: "On a reverse task, does the tiny Transformer learn with positional encoding, and does removing it (ablation) destroy the ability to recover order?",
    charts: [
      {
        type: "line",
        title: "Reverse-task token accuracy vs step — positional encoding ON vs OFF (ablation)",
        xlabel: "training step",
        ylabel: "token accuracy",
        series: [
          {
            name: "PE on",
            color: "#7ee787",
            points: [[0,0.098],[50,0.403],[100,1.0],[150,1.0],[200,1.0],[250,1.0],[300,1.0],[350,1.0],[400,1.0],[450,1.0],[500,1.0],[550,1.0],[600,1.0],[650,1.0],[700,1.0],[750,1.0],[799,1.0]]
          },
          {
            name: "PE off (ablation)",
            color: "#ff7b72",
            points: [[0,0.098],[50,0.322],[100,0.318],[150,0.302],[200,0.325],[250,0.319],[300,0.322],[350,0.314],[400,0.324],[450,0.338],[500,0.325],[550,0.336],[600,0.349],[650,0.337],[700,0.317],[750,0.345],[799,0.318]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A 2-layer tiny Transformer encoder (d_model=32, 4 heads) trained to REVERSE length-8 sequences over a 9-symbol vocabulary (output[i] = input[N-1-i]). WITH sinusoidal positional encoding (green) token accuracy jumps to 1.0 by ~step 100 &mdash; it learns to reverse. The ABLATION (red, the same model with the '+ PE' line removed) plateaus near chance (~0.32): with no position signal, the permutation-invariant self-attention can identify which symbols are present but cannot tell which position to place each one in. Same architecture, width, heads, optimizer, and seed; the only difference is the positional encoding. (We use reverse, not copy: copying needs no position, so it would not expose the ablation.)",
    code: `import math, torch, torch.nn as nn, torch.nn.functional as F
torch.manual_seed(0)

def positional_encoding(seq_len, d_model):
    pos = torch.arange(seq_len).unsqueeze(1).float()
    i2  = torch.arange(0, d_model, 2).float()
    denom = torch.pow(10000.0, i2 / d_model)
    pe = torch.zeros(seq_len, d_model)
    pe[:, 0::2] = torch.sin(pos / denom)
    pe[:, 1::2] = torch.cos(pos / denom)
    return pe

class MHA(nn.Module):
    def __init__(self, d, h):
        super().__init__(); self.h, self.dk = h, d // h
        self.Wq, self.Wk, self.Wv, self.Wo = (nn.Linear(d, d) for _ in range(4))
    def split(self, x):
        B, S, _ = x.shape; return x.view(B, S, self.h, self.dk).transpose(1, 2)
    def forward(self, x):
        Q, K, V = self.split(self.Wq(x)), self.split(self.Wk(x)), self.split(self.Wv(x))
        a = F.softmax(Q @ K.transpose(-2, -1) / math.sqrt(self.dk), dim=-1) @ V
        B, _, S, _ = a.shape
        return self.Wo(a.transpose(1, 2).contiguous().view(B, S, self.h * self.dk))

class Block(nn.Module):
    def __init__(self, d, h, ff):
        super().__init__(); self.a = MHA(d, h)
        self.f = nn.Sequential(nn.Linear(d, ff), nn.ReLU(), nn.Linear(ff, d))
        self.n1, self.n2 = nn.LayerNorm(d), nn.LayerNorm(d)
    def forward(self, x):
        x = self.n1(x + self.a(x)); return self.n2(x + self.f(x))

class T(nn.Module):
    def __init__(self, V, d=32, h=4, ff=64, L=2, mx=12, use_pe=True):
        super().__init__(); self.use_pe = use_pe
        self.e = nn.Embedding(V, d); self.register_buffer("pe", positional_encoding(mx, d))
        self.b = nn.ModuleList([Block(d, h, ff) for _ in range(L)]); self.o = nn.Linear(d, V)
    def forward(self, t):
        x = self.e(t)
        if self.use_pe: x = x + self.pe[:x.shape[1]]
        for blk in self.b: x = blk(x)
        return self.o(x)

V, S, B = 10, 8, 128
def batch():
    t = torch.randint(1, V, (B, S)); return t, torch.flip(t, dims=[1])   # reverse task
def run(use_pe, steps=800):
    torch.manual_seed(0)
    net = T(V, use_pe=use_pe); opt = torch.optim.Adam(net.parameters(), lr=3e-3)
    lf = nn.CrossEntropyLoss(); accs = []
    for s in range(steps):
        x, y = batch(); lg = net(x)
        loss = lf(lg.reshape(-1, V), y.reshape(-1))
        opt.zero_grad(); loss.backward(); opt.step()
        accs.append((lg.argmax(-1) == y).float().mean().item())
    return accs

on  = run(True)
off = run(False)
idx = list(range(0, 800, 50)) + [799]
print("PE on :", [[i, round(on[i], 3)]  for i in idx])
print("PE off:", [[i, round(off[i], 3)] for i in idx])
# PE on -> jumps to 1.0 by ~step 100 (learns to reverse). PE off -> flat near chance ~0.32 (order lost).`
  };
})();
