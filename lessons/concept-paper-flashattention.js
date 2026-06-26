/* Paper lesson — FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness
   (Tri Dao, Daniel Y. Fu, Stefano Ermon, Atri Rudra, Christopher Re; 2022).
   Grounded from arXiv:2205.14135 (abstract) + ar5iv HTML (Section 3.1 online-softmax / Algorithm 1,
   Section 3.2 Theorem 2 IO complexity). Track B (architecture): implement tiled + online-softmax
   attention in torch, VERIFY it equals standard softmax(QK^T)V via torch.allclose (EXACT, not
   approximate), show standard attention is O(N^2) memory while flash is O(N), and ablate memory vs
   sequence length. Cross-links the scaled-dot-product primitive (paper-attention) and the
   dl-attention concept lesson. Self-contained: lesson + CODE + CODEVIZ by id. */
(function () {
  window.LESSONS.push({
    id: "paper-flashattention",
    title: "FlashAttention — Fast and Memory-Efficient Exact Attention with IO-Awareness (2022)",
    tagline: "Compute the SAME attention as before, but with tiling plus an online (running) softmax so the giant N-by-N attention table is never written to GPU memory — exact result, far less memory, big speedup.",
    module: "Papers · Transformers & LLMs",
    track: "architecture",

    paper: {
      authors: "Tri Dao, Daniel Y. Fu, Stefano Ermon, Atri Rudra, Christopher Re",
      org: "Stanford University and University at Buffalo, SUNY",
      year: 2022,
      venue: "arXiv:2205.14135 (NeurIPS 2022)",
      citations: "",
      arxiv: "https://arxiv.org/abs/2205.14135",
      code: "https://github.com/Dao-AILab/flash-attention"
    },

    conceptLink: "dl-attention",
    partOf: [],
    prereqs: ["dl-attention", "paper-attention", "ml-softmax", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> A Transformer reads a sequence by letting every token attend to every other token.
       ("Token" = one unit of input, a word or sub-word. "Attend" = score how relevant each other token is, then
       take a weighted average of their value vectors — the scaled-dot-product attention of <code>paper-attention</code>.)
       With $N$ tokens, the scores form an $N\\times N$ table, one entry per ordered pair.</p>
       <p><b>What was broken.</b> Standard attention <i>writes that whole $N\\times N$ table to memory</i>. The paper
       opens (Abstract): <i>"Transformers are slow and memory-hungry on long sequences, since the time and memory
       complexity of self-attention are quadratic in sequence length."</i> The hidden culprit, the paper argues, is
       <b>memory traffic</b>: a GPU has a small fast on-chip memory (SRAM) and a large slow off-chip memory (HBM,
       "high bandwidth memory"). Standard attention writes the $N\\times N$ scores out to HBM and reads them back to
       do the softmax — and that round-trip, not the arithmetic, is the bottleneck.</p>
       <p><b>The earlier "fix" that wasn't.</b> Approximate-attention methods (sparse / low-rank) cut the number of
       arithmetic operations but, the paper notes, <i>"often do not achieve wall-clock speedup"</i> because they do
       not reduce the memory traffic. The question: can we keep the <b>exact</b> result and just stop writing the big
       table?</p>`,

    contribution:
      `<p>FlashAttention is an <b>IO-aware exact</b> attention algorithm (Abstract; Section 3). "IO-aware" = it counts
       reads/writes between HBM and SRAM, not just arithmetic. Two ideas make it work:</p>
       <ul>
         <li><b>Tiling.</b> Split $Q$, $K$, $V$ into blocks small enough to fit in fast SRAM, and compute attention one
         block-pair at a time. The $N\\times N$ score table for a block is formed in SRAM, used, and thrown away — it is
         <i>never</i> written to HBM (Section 3.1, Algorithm 1).</li>
         <li><b>Online softmax.</b> Softmax needs the max and the sum over a whole row, but tiling only sees one block of
         the row at a time. FlashAttention keeps a <b>running maximum</b> $m$ and <b>running normalizer</b> $\\ell$ and a
         running output, and <i>rescales</i> them as each new block arrives — so the final result is identical to doing
         softmax over the full row at once (Section 3.1).</li>
       </ul>
       <p>The payoff is stated as theorems: the output is <b>exactly</b> $\\mathrm{softmax}(QK^\\top)V$ (Theorem 1) using
       only <b>$O(N)$ extra memory</b> instead of $O(N^2)$, and it makes far fewer HBM accesses than standard attention
       (Theorem 2). The math owner for "what attention is" stays the <code>dl-attention</code> concept lesson and the
       <code>paper-attention</code> primitive; FlashAttention changes only <i>how the same softmax is computed</i>.</p>`,

    whyItMattered:
      `<p>Because it is exact and a drop-in replacement, FlashAttention was adopted almost everywhere: it is the default
       attention kernel in modern training and inference stacks and is what makes long-context language models practical.
       The paper reports a <b>15% speedup on BERT-large</b> and a <b>3x speedup on GPT-2</b> (Abstract), and it enabled
       Transformers to fit much longer sequences than the $N^2$ memory wall previously allowed (Path-X at 16K, Path-256
       at 64K tokens, Abstract). It is the natural sequel to <code>paper-attention</code>: same softmax-weighted lookup,
       computed without ever materializing the table.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Section 3.1, "An Efficient Attention Algorithm With Tiling"</b> — the heart of this lesson: the
         numerically-stable softmax definition, the block-decomposition of softmax (the running-max / running-sum update),
         and <b>Algorithm 1</b> (the tiled loop). Read the online-softmax update equation slowly; everything else follows.</li>
         <li><b>Theorem 1</b> — the correctness claim: Algorithm 1 returns $\\mathrm{softmax}(QK^\\top)V$ with $O(N)$ extra
         memory. This is the "it's exact" guarantee.</li>
         <li><b>Theorem 2 (Section 3.2)</b> — the IO claim: standard attention does $\\Theta(Nd+N^2)$ HBM accesses,
         FlashAttention does $\\Theta(N^2 d^2 M^{-1})$, where $M$ is SRAM size. This is the "fewer reads/writes" guarantee.</li>
       </ul>
       <p><b>Skim:</b> Section 2 (GPU memory-hierarchy background — useful but standard), Section 3.3 (block-sparse
       extension), and Section 4 (benchmarks). Note the speedup numbers but treat the tiling + online-softmax idea in 3.1
       as the core.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> You will implement attention two ways: (a) the standard way that builds the full
       $N\\times N$ score table, and (b) the FlashAttention way that walks over column-blocks of $K,V$ keeping a running
       max and running sum, never building the full table. Two questions. (1) Will the two outputs be <i>exactly</i> the
       same (to floating-point tolerance), or only approximately the same? (2) As the sequence length $N$ doubles, will
       the extra memory used by the flash version roughly double, or roughly quadruple? Write your guesses, then check the
       worked example, the <code>torch.allclose</code> result, and the memory plot.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write <code>flash_attention(Q, K, V, block)</code> that loops over
       column-blocks of $K,V$ and maintains, for every query row, a running max $m$, running normalizer $\\ell$, and running
       output accumulator $O$:</p>
       <ul>
         <li>Initialize $m=-\\infty$, $\\ell=0$, $O=0$ for each query row. <code># TODO: m = -inf; l = 0; O = 0</code></li>
         <li>For each block $j$ of keys/values: score the block $S=QK_j^\\top/\\sqrt{d_k}$ and take its per-row block max
         $\\tilde m$. <code># TODO: S = Q @ Kj.T / d_k**0.5 ; m_tilde = S.max(-1)</code></li>
         <li>New running max $m^{\\text{new}}=\\max(m,\\tilde m)$. <code># TODO: m_new = max(m, m_tilde)</code></li>
         <li>Unnormalized block weights $\\tilde P=\\exp(S-m^{\\text{new}})$, block sum $\\tilde\\ell=\\sum\\tilde P$.
         <code># TODO: P = exp(S - m_new); l_tilde = P.sum(-1)</code></li>
         <li><b>Rescale</b> the old running sum and output by $\\exp(m-m^{\\text{new}})$, then add the new block:
         $\\ell^{\\text{new}}=e^{m-m^{\\text{new}}}\\ell+\\tilde\\ell$, $O\\leftarrow e^{m-m^{\\text{new}}}O+\\tilde P V_j$.
         <code># TODO: rescale = exp(m - m_new)</code></li>
         <li>After all blocks, divide once: $O\\leftarrow O/\\ell$. <code># TODO: O = O / l</code></li>
       </ul>
       <p>The CODE cell is the full reference, and it ends in <code>torch.allclose(flash, standard)</code>. (We keep the
       block table in SRAM-sized chunks for clarity; the paper's CUDA kernel does this inside on-chip memory so the full
       table is never in HBM — Section 3.1.)</p>`,

    // HOW IT WORKS
    walkthrough:
      `<p>Standard attention does three steps for each query row: (1) score it against all $N$ keys, giving a length-$N$
       row $S$; (2) softmax that row; (3) weight the values. Step (1)+(2) need the <b>whole</b> row in memory at once,
       because softmax subtracts the row max and divides by the row sum. FlashAttention computes the identical result while
       only ever holding <b>one block</b> of the row. The trick is the <b>online softmax</b> (Section 3.1).</p>
       <ol>
         <li><b>Stable softmax, recalled.</b> To avoid overflow, softmax is computed as
         $\\mathrm{softmax}(x)_i=e^{x_i-m}/\\sum_k e^{x_k-m}$ where $m=\\max_k x_k$ (Section 3.1). Subtracting the max
         changes nothing mathematically but keeps the exponentials in range. We need the row max $m$ and the row sum
         $\\ell=\\sum_k e^{x_k-m}$.</li>
         <li><b>Split the row into blocks.</b> Say the row is $[x^{(1)}\\;x^{(2)}]$ (two blocks). Compute each block's own
         max and sum: $m^{(1)},\\ell^{(1)}$ and $m^{(2)},\\ell^{(2)}$. The combined max is $m=\\max(m^{(1)},m^{(2)})$. The
         combined sum is the two block sums, each <b>corrected</b> to the combined max:
         $\\ell=e^{m^{(1)}-m}\\ell^{(1)}+e^{m^{(2)}-m}\\ell^{(2)}$ (Section 3.1). That correction factor $e^{m^{(1)}-m}$ is
         the whole idea: a block computed against an old, smaller max is fixed up by multiplying by $e^{\\text{old max}-\\text{new max}}$.</li>
         <li><b>Carry it online.</b> Instead of two blocks, walk over <i>all</i> blocks one at a time, keeping a running
         max $m$, running sum $\\ell$, and running output $O$. When block $j$ arrives, take its block max $\\tilde m$, set
         $m^{\\text{new}}=\\max(m,\\tilde m)$, and rescale the running quantities by $e^{m-m^{\\text{new}}}$ before adding
         the new block's contribution (Algorithm 1, line 11). After the last block, divide the running output by the running
         sum once. The answer equals full-row softmax exactly (Theorem 1).</li>
         <li><b>Why it saves memory.</b> The $N\\times N$ score table is never assembled — each block's small score patch
         lives in fast SRAM, is consumed, and is discarded. Only the running $m,\\ell,O$ (size $O(N)$) persist (Theorem 1).
         Standard attention's $O(N^2)$ table in HBM is gone, and with it the slow HBM round-trip (Theorem 2).</li>
       </ol>
       <p><b>The key insight</b>: softmax looks un-splittable because of the global max and sum, but a running max plus a
       rescale-by-$e^{\\Delta m}$ makes it perfectly streamable — exact, one block at a time.</p>`,

    architecture:
      `<p>FlashAttention is not a network layer but a <b>fused GPU kernel</b> — one routine that does scoring, softmax, and
       value-weighting in a single pass over on-chip memory, so the $N\\times N$ matrices $S$ and $P$ are never written to
       HBM. Its structure is a doubly-nested tiled loop (Algorithm 1, Section 3.1).</p>
       <p><b>Memory layout (the two-level hierarchy of Section 2).</b></p>
       <ul>
         <li><b>HBM</b> (large, slow): holds the inputs $Q,K,V$ (each $N\\times d$), the output $O$ ($N\\times d$), and the two
         length-$N$ softmax statistics $m$ and $\\ell$. Nothing of size $N\\times N$ lives here.</li>
         <li><b>SRAM</b> (small, fast, size $M$): holds one tile of $Q$, one tile of $K$ and $V$, and the small score patch
         $S_{ij}$ formed from them. Everything in the inner loop happens here.</li>
       </ul>
       <p><b>Tiling (lines 1–5).</b> Choose block widths so a tile fits in SRAM:
       $B_c=\\lceil M/4d\\rceil$ for the $K,V$ column-blocks and $B_r=\\min(\\lceil M/4d\\rceil,\\,d)$ for the $Q$ row-blocks.
       This splits $K,V$ into $T_c=\\lceil N/B_c\\rceil$ blocks and $Q$ into $T_r=\\lceil N/B_r\\rceil$ blocks. The factor $4$
       reserves SRAM for the four tiles ($Q_i,K_j,V_j,O_i$) in flight at once.</p>
       <p><b>The kernel-level loop (lines 6–14).</b></p>
       <ol>
         <li><b>Outer loop over $K,V$ column-blocks</b> $j=1\\ldots T_c$ (line 6): load $K_j,V_j$ (each $B_c\\times d$) from
         HBM into SRAM once.</li>
         <li><b>Inner loop over $Q$ row-blocks</b> $i=1\\ldots T_r$ (line 8): load $Q_i$ and its current running state
         $O_i,\\ell_i,m_i$ from HBM into SRAM.</li>
         <li><b>On-chip compute</b> (lines 10–11): form the tile score $S_{ij}=Q_iK_j^\\top\\in\\mathbb{R}^{B_r\\times B_c}$,
         take its row max $\\tilde m_{ij}$, exponentiate $\\tilde P_{ij}=e^{S_{ij}-\\tilde m_{ij}}$, and row-sum to
         $\\tilde\\ell_{ij}$ — all in SRAM.</li>
         <li><b>Online-softmax update</b> (line 12): bump $m_i^{\\text{new}}$, rescale and accumulate $\\ell_i$ and $O_i$ by the
         formula in <code>formula</code>, and write the updated $O_i,\\ell_i,m_i$ back to HBM.</li>
         <li><b>After the outer loop:</b> $O$ holds the exact $\\operatorname{softmax}(QK^\\top)V$; only $O,m,\\ell$ were ever
         resident — $O(N)$ state (Theorem 1).</li>
       </ol>
       <p><b>Backward pass.</b> A symmetric tiled kernel: it stores only $O,m,\\ell$ from the forward pass and <b>recomputes</b>
       each tile's $S_{ij},\\tilde P_{ij}$ in SRAM to form gradients, again never materializing an $N\\times N$ matrix in HBM.
       Recomputation costs extra FLOPs but, because HBM traffic is the bottleneck, is still faster end-to-end (Section 3.1).</p>
       <p>This lesson's PyTorch CODE mirrors the loop structure but, for clarity, keeps the small tiles in ordinary tensors;
       the paper's contribution is doing it inside CUDA SRAM as one fused kernel.</p>`,

    symbols: [
      { sym: "$N$", desc: "the sequence length — the number of tokens. Standard attention's memory grows like $N^2$; FlashAttention's like $N$." },
      { sym: "$d$ (also $d_k$)", desc: "the head dimension — the length of each query/key/value vector. Scores are divided by $\\sqrt{d_k}$ (the scaling from paper-attention)." },
      { sym: "$Q,K,V$", desc: "the query, key, value matrices (each shape $N\\times d$) — the same inputs as scaled-dot-product attention." },
      { sym: "$S=QK^\\top$", desc: "the raw $N\\times N$ score table. Standard attention writes it to memory; FlashAttention only ever forms one block of it at a time." },
      { sym: "$m$", desc: "the running maximum: the largest score seen so far across the blocks processed, used to keep the exponentials stable (Section 3.1)." },
      { sym: "$\\tilde m$", desc: "the block maximum: the largest score in the current block being processed." },
      { sym: "$m^{\\text{new}}$", desc: "the updated running max after seeing the current block: $m^{\\text{new}}=\\max(m,\\tilde m)$ (Algorithm 1, line 11)." },
      { sym: "$\\ell$", desc: "the running normalizer: the running sum of $e^{\\text{score}-m}$, i.e. the softmax denominator built up block by block (Section 3.1)." },
      { sym: "$\\tilde\\ell$", desc: "the block sum: $\\sum e^{\\text{score}-m^{\\text{new}}}$ over just the current block." },
      { sym: "$O$", desc: "the running output accumulator (shape $N\\times d$): the partial weighted sum of value vectors, rescaled as the running max changes; divided by $\\ell$ at the end." },
      { sym: "$e^{m-m^{\\text{new}}}$", desc: "the rescaling factor — corrects quantities computed against the old (smaller) running max to the new max. The heart of online softmax. Always $\\le 1$." },
      { sym: "$\\tilde P=e^{S-m^{\\text{new}}}$", desc: "the unnormalized softmax weights for the current block (exp of scores minus the current running max)." },
      { sym: "HBM", desc: "high bandwidth memory — the GPU's large but slow off-chip memory. Standard attention reads/writes the $N\\times N$ table here; FlashAttention avoids that (Section 2)." },
      { sym: "SRAM", desc: "static RAM — the GPU's small but very fast on-chip memory of size $M$. Tiling sizes blocks to fit here (Section 2)." },
      { sym: "$M$", desc: "the SRAM size in bytes. Block sizes are chosen relative to $M$ (e.g. $B_c=\\lceil M/4d\\rceil$); IO cost is $\\Theta(N^2 d^2 M^{-1})$ (Theorem 2)." },
      { sym: "$O(N^2)$", desc: "big-O notation: standard attention's memory grows in proportion to $N$ squared — the $N\\times N$ table. Doubling $N$ quadruples it." },
      { sym: "$O(N)$", desc: "FlashAttention's extra memory: linear in $N$ — just the running $m,\\ell,O$ (Theorem 1). Doubling $N$ only doubles it." },
      { sym: "exact attention", desc: "the output equals $\\mathrm{softmax}(QK^\\top)V$ to floating-point tolerance — NOT an approximation (Theorem 1). This is what torch.allclose verifies." },
      { sym: "$P=\\mathrm{softmax}(S)$", desc: "the $N\\times N$ attention-weight matrix (row-wise softmax of the scores). Standard attention materializes it in HBM; FlashAttention only forms one tile $\\tilde P_{ij}$ at a time." },
      { sym: "$m(x),f(x),\\ell(x)$", desc: "the stable-softmax pieces for one length-$B$ row (eq. (1)): row max, unnormalized weights $e^{x-m(x)}$, and their sum. The whole online algorithm is built from these three." },
      { sym: "$B$", desc: "the length of one softmax row segment in the eq. (1)/(2) decomposition — a generic block width used to introduce online softmax." },
      { sym: "$B_c$", desc: "the key/value column-block width, $B_c=\\lceil M/4d\\rceil$ — sized so a $K,V$ tile fits in SRAM (Algorithm 1, line 1)." },
      { sym: "$B_r$", desc: "the query row-block height, $B_r=\\min(\\lceil M/4d\\rceil,d)$ (Algorithm 1, line 1)." },
      { sym: "$T_c,T_r$", desc: "the number of column-blocks ($T_c=\\lceil N/B_c\\rceil$) and row-blocks ($T_r=\\lceil N/B_r\\rceil$) the loop iterates over (Algorithm 1, line 5)." },
      { sym: "$S_{ij},\\tilde P_{ij},\\tilde m_{ij},\\tilde\\ell_{ij}$", desc: "the per-tile quantities for query-block $i$ against key-block $j$: the $B_r\\times B_c$ score patch, its exp-weights, its row max, and its row sum (Algorithm 1, lines 10–11)." },
      { sym: "$\\operatorname{diag}(v)$", desc: "the diagonal matrix with vector $v$ on its diagonal — here it scales each query row of $O_i$ by that row's own normalizer (Algorithm 1, line 12)." }
    ],

    formula:
      `$$S=\\frac{QK^\\top}{\\sqrt{d}}\\in\\mathbb{R}^{N\\times N},\\qquad
        P=\\operatorname{softmax}(S)\\in\\mathbb{R}^{N\\times N},\\qquad
        O=PV\\in\\mathbb{R}^{N\\times d}$$
       <p>Standard attention (Section 3, "Standard Attention Implementation"): the three matrix steps. The $N\\times N$ matrices $S$ and $P$ are materialized in HBM — that is the memory and IO cost FlashAttention removes. (The $1/\\sqrt{d}$ scaling comes from <code>paper-attention</code>.)</p>

       $$m(x)=\\max_i x_i,\\qquad
        f(x)=\\big[\\,e^{x_1-m(x)}\\ \\cdots\\ e^{x_B-m(x)}\\,\\big],\\qquad
        \\ell(x)=\\sum_i f(x)_i,\\qquad
        \\operatorname{softmax}(x)=\\frac{f(x)}{\\ell(x)}$$
       <p>Numerically-stable softmax of one length-$B$ row (Section 3.1, eq. (1)): subtract the row max $m(x)$ before exponentiating so nothing overflows. $f(x)$ are the unnormalized weights, $\\ell(x)$ the normalizer.</p>

       $$m(x)=\\max\\!\\big(m(x^{(1)}),\\,m(x^{(2)})\\big)$$
       $$f(x)=\\big[\\,e^{m(x^{(1)})-m(x)}f(x^{(1)})\\quad e^{m(x^{(2)})-m(x)}f(x^{(2)})\\,\\big]$$
       $$\\ell(x)=e^{m(x^{(1)})-m(x)}\\,\\ell(x^{(1)})+e^{m(x^{(2)})-m(x)}\\,\\ell(x^{(2)})$$
       <p>Online (block-decomposed) softmax for a row split as $x=[x^{(1)}\\;x^{(2)}]$ (Section 3.1, eq. (2)): combine two blocks' maxes and sums by rescaling each block to the shared max with $e^{(\\text{block max})-m(x)}$. This is the streaming recurrence FlashAttention iterates.</p>

       $$m_i^{\\text{new}}=\\max\\!\\big(m_i,\\ \\tilde m_{ij}\\big),\\qquad
        \\ell_i^{\\text{new}}=e^{\\,m_i-m_i^{\\text{new}}}\\,\\ell_i+e^{\\,\\tilde m_{ij}-m_i^{\\text{new}}}\\,\\tilde\\ell_{ij}$$
       $$O_i\\leftarrow \\operatorname{diag}(\\ell_i^{\\text{new}})^{-1}\\Big(\\operatorname{diag}(\\ell_i)\\,e^{\\,m_i-m_i^{\\text{new}}}\\,O_i+e^{\\,\\tilde m_{ij}-m_i^{\\text{new}}}\\,\\tilde P_{ij}V_j\\Big)$$
       <p>The on-chip update when block $j$ of $K,V$ meets query-block $i$ (Algorithm 1, lines 11–12): bump the running max, rescale the old running normalizer $\\ell_i$ and output $O_i$ by $e^{m_i-m_i^{\\text{new}}}$, add this block's contribution, and re-normalize. $\\operatorname{diag}(\\cdot)$ scales each query row by its own scalar.</p>

       $$\\text{HBM accesses:}\\quad \\text{standard}=\\Theta\\!\\big(Nd+N^2\\big),\\qquad
        \\text{FlashAttention}=\\Theta\\!\\big(N^2 d^2 M^{-1}\\big)$$
       <p>IO complexity (Section 3.2, Theorem 2), with SRAM size $M$ and $d\\le M\\le Nd$. Since $M\\gg d$, FlashAttention does many times fewer slow HBM reads/writes than standard attention — the actual wall-clock win.</p>

       $$\\text{backward: store only }(O,m,\\ell)\\ \\Rightarrow\\ \\text{recompute }S=\\tfrac{QK^\\top}{\\sqrt d},\\ P=\\operatorname{softmax}(S)\\ \\text{per block in SRAM}$$
       <p>Backward-pass recomputation (Section 3.1 / Appendix): rather than save the $N\\times N$ matrices $S,P$ for the gradient, keep only the output $O$ and the softmax statistics $(m,\\ell)$ and rebuild $S,P$ block-by-block in SRAM. Extra FLOPs, but no $O(N^2)$ HBM read — the same IO win as the forward pass.</p>`,

    whatItDoes:
      `<p><b>Equation by equation.</b> The first block ($S,P,O$) is plain attention: score every query against every key,
       softmax each row, weight the values — but it forces the $N\\times N$ matrices into memory. The second block (stable
       softmax) just says "subtract the row max before exponentiating" so nothing overflows. The third block (online softmax)
       is the engine: it shows two pieces of a row can be merged exactly by rescaling each to a shared max. The fourth block
       (the running update) applies that merge one tile at a time. The fifth (IO complexity) counts the slow HBM reads/writes:
       standard pays $\\Theta(Nd+N^2)$, FlashAttention $\\Theta(N^2d^2/M)$ — fewer because $M\\gg d$. The sixth (backward) says
       the gradient is computed by recomputing tiles from $(O,m,\\ell)$ instead of storing $S,P$.</p>
       <p><b>The running update in detail</b> (Section 3.1, Algorithm 1, line 12), one query row absorbing a new
       key/value block $j$: take the larger of the running max $m$ and the new block's max $\\tilde m$ to get
       $m^{\\text{new}}$. Rescale the running normalizer $\\ell$ down by $e^{m-m^{\\text{new}}}$ (correcting it from the old
       max to the new one) and add the block's own normalizer $\\tilde\\ell$, also corrected. Do the same to the running
       output $O$: rescale the old accumulated values by $e^{m-m^{\\text{new}}}$, add the new block's weighted values
       $e^{S-m^{\\text{new}}}V_j$, and divide by the fresh $\\ell^{\\text{new}}$. Because every quantity is always expressed
       relative to the current max, the running result after the last block is bit-for-bit (to tolerance) the full-row
       softmax. The full $N\\times N$ table never has to exist at once.</p>`,

    derivation:
      `<p>The attention mechanism itself — query/key/value, dot-product scores, softmax weights, weighted sum of values — is
       derived in the <code>dl-attention</code> concept lesson and built from scratch in <code>paper-attention</code>; we do
       not re-derive it. FlashAttention changes only <b>how the softmax of one row is accumulated</b>, so the derivation is the
       block-decomposition of softmax (Section 3.1).</p>
       <p>Write a row as two blocks $x=[x^{(1)}\\;x^{(2)}]$. The stable softmax needs $m=\\max(x)$ and
       $\\ell=\\sum_k e^{x_k-m}$. The max splits trivially: $m=\\max(m^{(1)},m^{(2)})$. For the sum, each block was summed
       against its own block max, so to combine them at the global max $m$ we multiply each block sum by the correction
       $e^{(\\text{block max})-m}$:</p>
       <p>$$\\ell=e^{m^{(1)}-m}\\,\\ell^{(1)}+e^{m^{(2)}-m}\\,\\ell^{(2)}.$$</p>
       <p>This is exact because $e^{x_k-m}=e^{x_k-m^{(1)}}\\cdot e^{m^{(1)}-m}$ — rescaling each block's exponentials by a
       single common factor. The same factor rescales the partial weighted value sums, so the output combines the same way.
       Iterating this two-block rule over all blocks gives the running update in the formula above; the final divide by $\\ell$
       normalizes once. Theorem 1 states the consequence: Algorithm 1 returns exactly $\\mathrm{softmax}(QK^\\top)V$ using
       $O(N)$ extra memory. The masking/scaling are unchanged from <code>paper-attention</code> — only the order of summation
       differs, and addition of corrected exponentials is order-independent, so the answer is identical.</p>`,

    example:
      `<p><b>Worked numbers — one row, two blocks.</b> Suppose a query row's scores against 4 keys are
       $S=[1,\\ 3,\\ 2,\\ 0]$, and we process them in two blocks: block A $=[1,3]$, block B $=[2,0]$. The values are 1-D for
       clarity: $V=[10,\\ 20,\\ 30,\\ 40]$. The true answer is full-row softmax of $S$ times $V$.</p>
       <p><b>Block A</b> $=[1,3]$: block max $\\tilde m=3$. Weights $e^{1-3}=0.1353,\\ e^{3-3}=1$. Running
       $m=3$, $\\ell=0.1353+1=1.1353$, output accumulator $O=0.1353\\cdot10+1\\cdot20=21.353$.</p>
       <p><b>Block B</b> $=[2,0]$: block max $\\tilde m=2$. New running max $m^{\\text{new}}=\\max(3,2)=3$, so the rescale
       factor for the old running quantities is $e^{m-m^{\\text{new}}}=e^{3-3}=1$ (block A already at the max — no shrink).
       Block weights at the new max: $e^{2-3}=0.3679,\\ e^{0-3}=0.0498$. Update:
       $\\ell^{\\text{new}}=1\\cdot1.1353+(0.3679+0.0498)=1.5530$;
       $O^{\\text{new}}=1\\cdot21.353+(0.3679\\cdot30+0.0498\\cdot40)=21.353+11.036+1.992=34.381$.</p>
       <p><b>Normalize once:</b> output $=O^{\\text{new}}/\\ell^{\\text{new}}=34.381/1.5530=22.14$.</p>
       <p><b>Check against full-row softmax.</b> $\\ell$ over all four $=e^{1-3}+e^{3-3}+e^{2-3}+e^{0-3}=0.1353+1+0.3679+0.0498=1.5530$
       (matches). Output $=(0.1353\\cdot10+1\\cdot20+0.3679\\cdot30+0.0498\\cdot40)/1.5530=34.381/1.5530=22.14$ — <b>identical</b>.
       The online update reproduced the full softmax without ever holding all four scores at once. The CODE cell recomputes
       these exact numbers and prints them, then runs <code>torch.allclose</code> on a full random tensor.</p>
       <p><i>(Note: when a later block raises the max, the rescale factor $e^{m-m^{\\text{new}}}\\lt1$ actually shrinks the old
       running sum and output — that is the correction in action. Here block B's max did not exceed block A's, so the factor
       was exactly 1; the CODE example also includes a case where it shrinks.)</i></p>`,

    recipe:
      `<p><b>FlashAttention forward (Algorithm 1, Section 3.1), as numbered steps:</b></p>
       <ol>
         <li>Split $K,V$ into column-blocks of size $B_c$ and $Q$ into row-blocks of size $B_r$, sized so a block fits in
         SRAM ($B_c=\\lceil M/4d\\rceil$, $B_r=\\min(\\lceil M/4d\\rceil,d)$).</li>
         <li>For each query row-block, initialize the running max $m=-\\infty$, running normalizer $\\ell=0$, and running
         output $O=0$.</li>
         <li>Loop over key/value blocks $j$: form the small score patch $S=Q K_j^\\top/\\sqrt{d}$ in SRAM; take its row-wise
         block max $\\tilde m$.</li>
         <li>Set $m^{\\text{new}}=\\max(m,\\tilde m)$; compute block weights $\\tilde P=e^{S-m^{\\text{new}}}$ and block sum
         $\\tilde\\ell=\\mathrm{rowsum}(\\tilde P)$.</li>
         <li>Rescale and accumulate: $\\ell\\leftarrow e^{m-m^{\\text{new}}}\\ell+\\tilde\\ell$;
         $O\\leftarrow e^{m-m^{\\text{new}}}O+\\tilde P V_j$; then set $m\\leftarrow m^{\\text{new}}$.</li>
         <li>After the last block, divide once: $O\\leftarrow O/\\ell$. The block patch $S$ is discarded each iteration — the
         $N\\times N$ table never lives in HBM.</li>
       </ol>`,

    results:
      `<p>The paper reports (we QUOTE, with source):</p>
       <ul>
         <li><b>Theorem 1</b>: "Algorithm 1 returns $O=\\mathrm{softmax}(QK^\\top)V$ ... and requires $O(N)$ additional
         memory beyond inputs and output" (Section 3.1, arXiv:2205.14135). Exact result, linear extra memory.</li>
         <li><b>Theorem 2</b>: standard attention requires $\\Theta(Nd+N^2)$ HBM accesses, while FlashAttention requires
         $\\Theta(N^2 d^2 M^{-1})$ for SRAM size $M$ with $d\\le M\\le Nd$ (Section 3.2). Since $M\\gg d$, this is far fewer
         memory accesses.</li>
         <li>End-to-end: <b>15% speedup on BERT-large</b> (seq 512), <b>3x speedup on GPT-2</b> (seq 1K), and up to
         <b>7.6x speedup on the attention computation</b> itself (Abstract / Introduction).</li>
       </ul>
       <p>These are the paper's own measurements. Every number in the CODE/CODEVIZ below is instead <b>our own small run</b>,
       labeled as such — it demonstrates exactness (torch.allclose) and the $O(N^2)$-vs-$O(N)$ memory gap, not the paper's
       reported benchmark numbers.</p>`,

    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> FlashAttention is <b>exact</b>, so the primary metric is not accuracy but
       <b>correctness + cost</b>: (a) the max absolute difference $\\lVert O_{\\text{flash}} - O_{\\text{standard}}\\rVert_\\infty$
       against the reference $\\mathrm{softmax}(QK^\\top)V$, which must be at floating-point tolerance ($\\sim 10^{-6}$),
       and (b) peak memory / HBM accesses vs sequence length $N$. The "no-skill" baseline is standard attention itself:
       FlashAttention must match its output exactly (better-than-trivial = identical answer) while using far less
       memory. The paper's end-to-end metrics are wall-clock speedup (BERT/GPT-2) on standard training setups.</p>
       <ul>
        <li><b>2. Sanity checks BEFORE the full run.</b> (a) Run the worked two-block example (scores $[1,3,2,0]$,
        values $[10,20,30,40]$) and confirm the online output prints $22.14$, matching full-row softmax. (b)
        <code>torch.allclose(flash, standard, atol=1e-6)</code> on a small random $Q,K,V$ must be <b>True</b>. (c)
        Check shapes: output is $N\\times d$ and the running state is only $m,\\ell$ (length $N$) plus $O$ &mdash; no
        $N\\times N$ tensor should ever be allocated by the flash path. (d) Force a block to RAISE the max and verify
        the rescale factor $e^{m-m^{\\text{new}}}\\lt1$ actually shrinks the old running sum (a known-answer check of
        the correction).</li>
        <li><b>3. Expected range.</b> A correct implementation matches standard attention to $\\sim 10^{-6}$ (our run:
        max abs diff $\\approx 10^{-7}$); anything above $\\sim 10^{-4}$ is a bug, not float noise. The paper reports
        (approximate, arXiv:2205.14135) a <b>15% speedup on BERT-large</b>, a <b>3x speedup on GPT-2</b>, and up to
        <b>7.6x on the attention computation</b> itself, plus $O(N)$ extra memory (Theorem 1). Memory should grow
        linearly: doubling $N$ roughly doubles flash state but quadruples the standard $N\\times N$ table.</li>
        <li><b>4. Ablation &mdash; prove the online rescale earns its keep.</b> The central trick is rescaling the old
        running $\\ell,O$ by $e^{m-m^{\\text{new}}}$ before adding each block. Turn it OFF (set the factor to $1$, i.e.
        just $O\\leftarrow O+\\tilde P V_j$): <code>torch.allclose</code> must now <b>fail</b> with a large error,
        because earlier blocks stay at the wrong exponential scale. If it still passes, your test scores happen to be
        non-increasing across blocks (the max never rises) &mdash; pick inputs where a later block raises the max so
        the ablation actually bites.</li>
        <li><b>5. Failure signals.</b> <b>Large allclose error</b> &rarr; missing the rescale of old quantities, or
        dividing by $\\ell$ inside the loop instead of once at the end. <b>NaN / inf in $O$</b> &rarr; you summed raw
        $e^{x}$ without subtracting the running max &mdash; overflow on large scores; the max-subtraction is what
        keeps exponentials in range. <b>Output off by a constant factor</b> &rarr; normalized by the wrong $\\ell$
        (forgot to update it when the max changed). <b>Memory still $O(N^2)$</b> &rarr; you materialized the full
        score table anyway; the toy Python loop is only $O(N)$ in spirit, the genuine win is the fused SRAM kernel.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track B (architecture).</b> We do <i>not</i> rebuild the scaled-dot-product primitive — that is
       <code>paper-attention</code> and PyTorch's <code>F.scaled_dot_product_attention</code>. We implement only
       FlashAttention's novel piece: the <b>tiled loop with the online-softmax running-max / running-sum update</b>, then
       verify it equals standard attention with <code>torch.allclose</code> (Theorem 1: exact). Our toy version keeps each
       block's small score patch in a normal tensor for clarity; the paper's contribution is the CUDA kernel that does this
       inside on-chip SRAM so the $N\\times N$ table never reaches HBM (Section 3.1). The <b>ablation</b> measures peak memory
       of standard ($O(N^2)$) vs flash ($O(N)$) attention as $N$ grows, and the worked-example numbers are recomputed and
       checked.</p>`,

    pitfalls:
      `<ul>
         <li><b>Forgetting to rescale the OLD running quantities.</b> When a new block raises the max, the existing $\\ell$
         and $O$ were computed against the smaller old max and must be multiplied by $e^{m-m^{\\text{new}}}\\lt1$ before adding
         the new block. Skip this and the running result is wrong (and torch.allclose fails).</li>
         <li><b>Dividing by $\\ell$ inside the loop.</b> Normalize <i>once</i>, after the last block. Dividing each iteration
         re-normalizes partial sums and breaks the accumulation.</li>
         <li><b>Thinking it's an approximation.</b> FlashAttention is <b>exact</b> (Theorem 1) — same result as standard
         attention, just computed in a memory-friendly order. It is not a sparse/low-rank approximation.</li>
         <li><b>Calling the toy version $O(N)$ memory.</b> Our Python loop still allocates block tensors; the genuine $O(N)$
         memory comes from the fused CUDA kernel keeping blocks in SRAM (Section 3.1). The lesson's point is the algorithm,
         not the kernel.</li>
         <li><b>Numerical instability without the max subtraction.</b> The running max is what keeps the exponentials in
         range; a naive running sum of raw $e^{x}$ overflows for large scores (Section 3.1 motivates the stable form).</li>
       </ul>`,

    recall: [
      "State the online-softmax update for the running max $m$ and running normalizer $\\ell$ when a new block arrives.",
      "Why must the old running output $O$ and sum $\\ell$ be multiplied by $e^{m-m^{\\text{new}}}$ before adding a new block?",
      "Is FlashAttention exact or approximate? Which theorem says so?",
      "Standard attention uses $O(?)$ memory for the score table; FlashAttention uses $O(?)$ extra memory. Fill the blanks.",
      "What are HBM and SRAM, and which one does FlashAttention avoid writing the score table to?"
    ],

    practice: [
      {
        q: `A query row's scores are $[2, 5]$ for block A and $[6, 1]$ for block B (process A then B). Track the running max $m$ and explain what the rescale factor does when block B arrives.`,
        steps: [
          { do: `Block A: block max $\\tilde m=5$, so running $m=5$.`, why: `First block sets the running max (Section 3.1).` },
          { do: `Block B: block max $\\tilde m=6$, so $m^{\\text{new}}=\\max(5,6)=6$.`, why: `New running max is the larger of old and block max (Algorithm 1, line 11).` },
          { do: `Rescale factor for block A's old quantities $=e^{m-m^{\\text{new}}}=e^{5-6}=e^{-1}=0.368$.`, why: `Block A was summed against max 5; we correct it down to the new max 6.` }
        ],
        answer: `Running max goes $5\\to6$ when block B arrives. The old $\\ell$ and $O$ from block A are multiplied by $e^{5-6}=0.368$, shrinking them to the new reference max before block B's contribution is added — keeping the result exactly equal to full-row softmax.`
      },
      {
        q: `Standard attention stores the full $N\\times N$ score table. For $N=1024$ vs $N=2048$ (float32, 4 bytes), how much memory does that table take, and how does FlashAttention's $O(N)$ running state compare?`,
        steps: [
          { do: `$N=1024$: $1024^2\\times4 = 4{,}194{,}304$ bytes $\\approx 4$ MB.`, why: `The score table is $N^2$ floats — $O(N^2)$ (standard attention).` },
          { do: `$N=2048$: $2048^2\\times4 = 16{,}777{,}216$ bytes $\\approx 16$ MB.`, why: `Doubling $N$ quadruples $N^2$ — the quadratic wall.` },
          { do: `FlashAttention keeps only $m,\\ell$ (length $N$) plus output ($N\\times d$): $O(N)$, so doubling $N$ only doubles it.`, why: `Theorem 1: $O(N)$ additional memory.` }
        ],
        answer: `The standard table jumps from ~4 MB to ~16 MB (a 4x jump for a 2x sequence). FlashAttention's running state grows only linearly, so it about doubles. That $O(N^2)$-vs-$O(N)$ gap is exactly what the CODEVIZ memory plot shows.`
      },
      {
        q: `Ablation: you delete the line that rescales the running output ($O\\leftarrow e^{m-m^{\\text{new}}}O+\\tilde P V_j$) and instead just do $O\\leftarrow O+\\tilde P V_j$. Will torch.allclose(flash, standard) still pass? Why?`,
        steps: [
          { do: `Without the rescale, blocks processed before a max-raising block keep their old (too-large) exponential scale.`, why: `Their weights $e^{x-m_{\\text{old}}}$ are never corrected to the new max $m^{\\text{new}}$.` },
          { do: `The accumulated $O$ then mixes weights at inconsistent reference maxima, so it no longer equals full-row softmax.`, why: `Online softmax is exact only because every term is expressed relative to the current max.` },
          { do: `torch.allclose returns False (unless no block ever raises the max, e.g. scores are non-increasing across blocks).`, why: `The correctness in Theorem 1 depends on the rescale.` }
        ],
        answer: `It fails: dropping the rescale leaves earlier blocks at the wrong exponential scale, so the running output no longer matches standard attention. The CODE ablation prints the (large) error — the rescale is precisely what makes FlashAttention exact.`
      }
    ]
  });

  window.CODE["paper-flashattention"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Implement FlashAttention's tiled + online-softmax forward (Algorithm 1, Section 3.1): loop over column-blocks of ` +
      `K,V keeping a running max m, running normalizer l, and running output O, rescaling the old ones by exp(m - m_new) ` +
      `each step, and dividing once at the end. VERIFY it equals standard softmax(QK^T)V via torch.allclose (Theorem 1: ` +
      `EXACT). Recompute the worked two-block example. Show standard attention's O(N^2) score table vs flash's O(N) state. ` +
      `Ablate: dropping the rescale breaks exactness. Runs in Colab (torch preinstalled).`,
    code: `import torch, torch.nn.functional as F

torch.manual_seed(0)

def standard_attention(Q, K, V):
    "The textbook way: build the full N x N score table, softmax it, weight values."
    d = Q.shape[-1]
    S = (Q @ K.transpose(-2, -1)) / (d ** 0.5)   # (N, N)  <-- O(N^2) table in memory
    P = S.softmax(dim=-1)
    return P @ V

def flash_attention(Q, K, V, block, rescale=True):
    "FlashAttention forward: tile over K,V blocks; online softmax with running max/sum. Algorithm 1."
    N, d = Q.shape
    O = torch.zeros(N, V.shape[-1])              # running output accumulator  (O(N) state)
    m = torch.full((N, 1), float('-inf'))        # running max per query row
    l = torch.zeros(N, 1)                         # running normalizer (softmax denom)
    for j in range(0, N, block):                 # walk column-blocks of K,V
        Kj, Vj = K[j:j+block], V[j:j+block]
        S = (Q @ Kj.transpose(-2, -1)) / (d ** 0.5)        # small block patch (never the full N x N)
        m_tilde = S.max(dim=-1, keepdim=True).values        # block max
        m_new = torch.maximum(m, m_tilde)                   # new running max
        P = torch.exp(S - m_new)                            # block weights at the new max
        l_tilde = P.sum(dim=-1, keepdim=True)               # block sum
        factor = torch.exp(m - m_new) if rescale else torch.ones_like(m)  # rescale OLD by exp(m - m_new)
        l = factor * l + l_tilde                            # corrected running normalizer
        O = factor * O + P @ Vj                             # corrected running output
        m = m_new                                           # advance running max
    return O / l                                            # normalize ONCE at the end

# ---- (1) EXACTNESS: flash == standard, to floating-point tolerance (Theorem 1) ----
N, d = 64, 16
Q, K, V = torch.randn(N, d), torch.randn(N, d), torch.randn(N, d)
out_std = standard_attention(Q, K, V)
out_flash = flash_attention(Q, K, V, block=8)
print("max |flash - standard| =", (out_flash - out_std).abs().max().item())
print("torch.allclose(flash, standard):", torch.allclose(out_flash, out_std, atol=1e-6))  # True

# ---- (2) WORKED EXAMPLE recomputed: scores [1,3,2,0], values [10,20,30,40], blocks of 2 ----
Sx = torch.tensor([[1., 3., 2., 0.]])
Vx = torch.tensor([[10.], [20.], [30.], [40.]])
# treat Sx as precomputed scores: emulate flash over two blocks of 2
m, l, O = torch.tensor([[float('-inf')]]), torch.tensor([[0.]]), torch.tensor([[0.]])
for j in range(0, 4, 2):
    Sj = Sx[:, j:j+2]
    m_t = Sj.max(-1, keepdim=True).values
    m_n = torch.maximum(m, m_t)
    P = torch.exp(Sj - m_n)
    fac = torch.exp(m - m_n)
    l = fac * l + P.sum(-1, keepdim=True)
    O = fac * O + P @ Vx[j:j+2]
    m = m_n
print("worked-example flash output:", round((O / l).item(), 2),
      "| full-softmax:", round((Sx.softmax(-1) @ Vx).item(), 2))   # both 22.14

# ---- (3) MEMORY: standard materializes O(N^2); flash keeps O(N) running state ----
for n in (128, 256, 512, 1024):
    std_table = n * n            # entries in the N x N score table (standard)
    flash_state = 2 * n + n * d  # m,l (length n) + output (n x d)  -> O(N)
    print(f"N={n:>4}: standard table={std_table:>8} entries | flash state={flash_state:>6} (O(N))")

# ---- (4) ABLATION: remove the rescale -> NOT exact anymore ----
bad = flash_attention(Q, K, V, block=8, rescale=False)
print("no-rescale max |flash - standard| =", round((bad - out_std).abs().max().item(), 4),
      "| allclose:", torch.allclose(bad, out_std, atol=1e-6))   # large error, False`
  };

  window.CODEVIZ["paper-flashattention"] = {
    question: "How does attention memory grow with sequence length N? Standard attention stores the full N x N score table — O(N^2). FlashAttention keeps only a running max, running sum, and running output — O(N). And does the tiled online-softmax give the EXACT same answer as standard attention?",
    charts: [
      {
        type: "line",
        title: "Attention memory vs sequence length N (our count, d=64) — standard O(N^2) score table explodes; flash O(N) running state stays linear",
        xlabel: "sequence length N",
        ylabel: "memory (number of float entries)",
        series: [
          {
            name: "standard  O(N^2) score table",
            color: "#f85149",
            points: [[128, 16384], [256, 65536], [512, 262144], [1024, 1048576], [2048, 4194304]]
          },
          {
            name: "flash  O(N) running state (d=64)",
            color: "#7ee787",
            points: [[128, 8448], [256, 16896], [512, 33792], [1024, 67584], [2048, 135168]]
          }
        ]
      }
    ],
    caption: "Our small-scale count (torch, head dim d=64), not a number from the paper. We count float entries each method must hold. Standard attention materializes the N x N score table: N^2 entries, so going 512->1024 QUADRUPLES it (262,144 -> 1,048,576) — the O(N^2) memory wall (Theorem 2's Nd+N^2). FlashAttention keeps only the running max and sum (length N) plus the output (N x d): 2N + Nd entries, so the same step merely DOUBLES it (33,792 -> 67,584) — O(N) (Theorem 1). Separately, the CODE cell runs torch.allclose(flash, standard) = True: the tiled online-softmax gives the EXACT same output (max abs diff ~1e-7), confirming FlashAttention is exact attention, not an approximation — it just never writes the big table.",
    code: `import torch

d = 64
print("N | standard N^2 | flash 2N+Nd (O(N))")
for N in (128, 256, 512, 1024, 2048):
    standard = N * N            # full score table
    flash = 2 * N + N * d       # running m,l + output -> O(N)
    print(f"{N:>4} | {standard:>10} | {flash:>8}")
# standard: 16384, 65536, 262144, 1048576, 4194304   (quadratic in N)
# flash:     8448, 16896,  33792,   67584,  135168    (linear in N)

# exactness check (Theorem 1): flash == standard
torch.manual_seed(0)
N, d = 64, 16
Q, K, V = torch.randn(N, d), torch.randn(N, d), torch.randn(N, d)
def std(Q,K,V):
    S = (Q @ K.T) / (Q.shape[-1] ** 0.5); return S.softmax(-1) @ V
def flash(Q,K,V,b=8):
    N,d = Q.shape; O=torch.zeros(N,d); m=torch.full((N,1),-1e30); l=torch.zeros(N,1)
    for j in range(0,N,b):
        S=(Q@K[j:j+b].T)/(d**0.5); mt=S.max(-1,keepdim=True).values; mn=torch.maximum(m,mt)
        P=torch.exp(S-mn); f=torch.exp(m-mn); l=f*l+P.sum(-1,keepdim=True); O=f*O+P@V[j:j+b]; m=mn
    return O/l
print("allclose:", torch.allclose(flash(Q,K,V), std(Q,K,V), atol=1e-6))  # True`
  };
})();
