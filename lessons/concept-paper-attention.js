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
       has rows, each with a <b>key</b> (a label saying what that row is about) and a <b>value</b> (the content
       stored there). Instead of returning one row, attention returns a <i>blend</i> of all the values, weighted
       by how well the query matches each key.</p>
       <ol>
         <li><b>Score.</b> For one query, take the <b>dot product</b> with every key. The dot product of two
         vectors is large when they point the same way, so it measures match. With many queries at once this is
         the matrix product $QK^\\top$: row $i$, column $j$ is "how well query $i$ matches key $j$".</li>
         <li><b>Scale.</b> Divide every score by $\\sqrt{d_k}$, where $d_k$ is the length of the key/query
         vectors. This is the paper's key detail; the next paragraph says why.</li>
         <li><b>Softmax.</b> Turn each query's row of scores into <b>weights</b> that are all positive and sum to
         1, by applying the softmax function across the keys. Big scores get most of the weight.</li>
         <li><b>Weighted sum.</b> Multiply the weights by the values and add them up: each query's output is a
         convex combination (a weighted average) of all the value vectors. As a matrix product, that is
         (weights)$\\,V$.</li>
       </ol>
       <p><b>Why the $\\sqrt{d_k}$?</b> Suppose each entry of the query and key is roughly independent with mean
       0 and variance 1. A dot product sums $d_k$ such products, so its variance grows like $d_k$ and its typical
       size grows like $\\sqrt{d_k}$. If those raw scores get large, the softmax becomes nearly one-hot and its
       gradient nearly vanishes &mdash; learning stalls. Dividing by $\\sqrt{d_k}$ rescales the scores back to
       variance about 1, keeping the softmax in a healthy range (Section 3.2.1).</p>`,

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
      { sym: "attention map", desc: "the $(n_q, n_k)$ matrix of softmax weights after scaling — how much each query attends to each key. Each row sums to 1." }
    ],

    formula:
      `$$\\mathrm{Attention}(Q,K,V)=\\mathrm{softmax}\\!\\left(\\frac{QK^{\\top}}{\\sqrt{d_k}}\\right)V$$`,

    whatItDoes:
      `<p>This is <b>Equation (1)</b> of the paper (Section 3.2.1). Read it right to left through the softmax:
       $QK^\\top$ scores every query against every key; dividing by $\\sqrt{d_k}$ keeps those scores at a sane
       scale; the softmax turns each query's row of scores into weights that sum to 1; and multiplying by $V$
       returns, for each query, the weighted average of the value vectors. The output has shape $(n_q, d_v)$ —
       one value-sized vector per query.</p>`,

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
