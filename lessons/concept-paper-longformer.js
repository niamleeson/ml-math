/* Paper lesson — Longformer: The Long-Document Transformer (Beltagy, Peters, Cohan; 2020).
   Grounded from arXiv:2004.05150 (abstract) + ar5iv HTML (Section 1, Section 3.1, Section 4.1/4.2).
   Track B (architecture): build sliding-window (+ a few global) attention on top of nn primitives;
   show on a toy long sequence that the windowed map matches FULL attention on local structure at far
   lower cost; plot attention cost (sparse O(n*w) vs full O(n^2)) vs sequence length; ablate the window.
   Cross-links the scaled-dot-product primitive (paper-attention) and the dl-attention concept lesson.
   Self-contained: lesson + CODE + CODEVIZ by id. */
(function () {
  window.LESSONS.push({
    id: "paper-longformer",
    title: "Longformer — The Long-Document Transformer (2020)",
    tagline: "Make self-attention scale to thousands of tokens by letting each token look only at a local window plus a few global tokens, turning O(n^2) cost into O(n).",
    module: "Papers · Transformers & LLMs",
    track: "architecture",

    paper: {
      authors: "Iz Beltagy, Matthew E. Peters, Arman Cohan",
      org: "Allen Institute for Artificial Intelligence (AI2), Seattle",
      year: 2020,
      venue: "arXiv:2004.05150",
      citations: "",
      arxiv: "https://arxiv.org/abs/2004.05150",
      code: "https://github.com/allenai/longformer"
    },

    conceptLink: "dl-attention",
    partOf: [],
    prereqs: ["dl-attention", "paper-attention", "ml-softmax", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> A Transformer reads a sequence by letting every token attend to every other token.
       ("Token" = one unit of input, a word or sub-word. "Attend" = score how relevant each other token is,
       then take a weighted average of their value vectors — the scaled-dot-product attention of
       <code>paper-attention</code>.) With $n$ tokens, that is an $n\\times n$ table of scores.</p>
       <p><b>What was broken.</b> That $n\\times n$ table is the bottleneck. The paper states it plainly in the
       Introduction (Section 1): <i>"The memory and computational requirements of self-attention grow
       quadratically with sequence length, making it infeasible (or very expensive) to process long sequences."</i>
       Doubling the document quadruples the cost and memory. So standard models (e.g. BERT) cap input at about
       512 tokens — fine for a sentence or paragraph, useless for a full document, a book chapter, or a long
       question-answering context.</p>
       <p><b>The question.</b> Most tokens mostly care about their neighbours. Do we really need the full
       $n\\times n$ table? Longformer's answer: replace it with a <b>sparse</b> attention pattern whose cost grows
       only <i>linearly</i> in $n$, so the same model can read thousands of tokens.</p>`,

    contribution:
      `<p>Longformer introduces a drop-in attention pattern (Section 3.1) that replaces full self-attention:</p>
       <ul>
         <li><b>Sliding-window attention.</b> Each token attends only to a fixed window of $\\tfrac{1}{2}w$ tokens
         on each side (a band of width $w$). Stacking layers grows the reach: after $\\ell$ layers the receptive
         field is $\\ell\\times w$, so faraway tokens still influence each other indirectly.</li>
         <li><b>Dilated sliding window (optional).</b> Put gaps of size $d$ between the attended positions so the
         same window reaches further ($\\ell\\times d\\times w$) without more compute — used on a few attention
         heads.</li>
         <li><b>Global attention on a few pre-selected tokens.</b> A handful of special tokens (e.g. the
         classification token, or the question tokens in question-answering) attend to <i>everyone</i> and are
         attended <i>by</i> everyone, so task-critical information can still flow across the whole sequence.</li>
       </ul>
       <p>Together these give attention that costs <b>$O(n\\times w)$</b> — linear in sequence length $n$ — instead
       of $O(n^2)$ (Section 3.1). The math owner for "what attention is" stays the <code>dl-attention</code>
       concept lesson and the <code>paper-attention</code> primitive; Longformer only changes <i>which pairs</i>
       of tokens are scored.</p>`,

    whyItMattered:
      `<p>Linear-cost attention made it practical to run Transformers over long documents — the paper reports
       processing up to thousands of tokens (Section 4) where a standard model runs out of memory. The pattern
       became a template for a whole family of "efficient Transformers" (BigBird, ETC, and later structured-sparse
       and windowed attentions) and is the conceptual ancestor of the windowed attention used in many long-context
       language models today. It is the natural sequel to the <code>paper-attention</code> primitive: same
       softmax-weighted lookup, far fewer pairs scored.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Section 1 (Introduction)</b> — the one sentence on quadratic cost that motivates everything.</li>
         <li><b>Section 3.1, "Attention Pattern", and Figure 1</b> — the whole subject of this lesson: sliding
         window, dilated window, and global attention, plus the $O(n\\times w)$ complexity claim. Figure 1 shows
         the four attention masks side by side (full vs window vs dilated-window vs window+global).</li>
       </ul>
       <p><b>Skim:</b> Section 3.2 (the custom CUDA/banded-matrix implementation — an engineering detail, not the
       idea), Section 4 (character-level language-modeling setup and the per-layer window schedule), and Section 6
       (downstream document tasks). Note the headline numbers there but treat the <i>idea</i> in 3.1 as the core.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> You will build sliding-window attention (window $w$) and compare its
       attention map to <i>full</i> attention on a toy sequence whose signal is mostly local (each token relates
       to its near neighbours). Two questions. (1) For a token in the middle, will the windowed weights over its
       <i>in-window</i> neighbours be close to the full-attention weights over those same neighbours, or wildly
       different? (2) As the sequence length $n$ doubles, will the number of scored pairs for the windowed version
       roughly double, or roughly quadruple? Write your guesses, then check the worked example and the cost plot.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write <code>sliding_window_attention(Q, K, V, w)</code> using the
       scaled-dot-product idea from <code>paper-attention</code>, but mask out far pairs:</p>
       <ul>
         <li>Compute full scores $S=QK^\\top/\\sqrt{d_k}$ (shape $n\\times n$). <code># TODO: scores = Q @ K.transpose(-2,-1) / d_k**0.5</code></li>
         <li>Build a band mask: position $i$ may attend to $j$ only if $|i-j|\\le \\tfrac{1}{2}w$.
         <code># TODO: allowed = (abs(i-j) &lt;= w//2)</code></li>
         <li>Set disallowed scores to $-\\infty$ <b>before</b> softmax so they get zero weight.
         <code># TODO: scores = scores.masked_fill(~allowed, float('-inf'))</code></li>
         <li>Softmax over keys, then multiply by $V$. <code># TODO: (scores.softmax(-1)) @ V</code></li>
         <li>Optionally mark a few <b>global</b> rows/columns as always-allowed (the global tokens).</li>
       </ul>
       <p>The CODE cell is the full reference. (We compute the full $n\\times n$ table and mask it for clarity; the
       paper's real implementation never materializes it — that is the $O(n\\times w)$ banded version in
       Section 3.2.)</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Full self-attention scores <i>every</i> pair of tokens: an $n\\times n$ table. Longformer keeps the same
       scoring rule (dot-product, scale, softmax, weighted sum of values) but <b>only fills in a few entries</b> of
       that table. Three pieces (Section 3.1):</p>
       <ol>
         <li><b>Sliding window.</b> Fix a window size $w$. Token $i$ attends only to tokens within $\\tfrac{1}{2}w$
         positions on each side — a diagonal band of width $w$. Each row of the score table has at most $w$ live
         entries instead of $n$, so the total work is about $n\\times w$, not $n\\times n$. Because $w$ is a fixed
         constant, this is <b>linear</b> in $n$.</li>
         <li><b>Stacking restores long range.</b> One layer only sees $\\pm\\tfrac{1}{2}w$. But the output of a
         token feeds the next layer's window, so reach grows with depth: after $\\ell$ layers the receptive field
         is $\\ell\\times w$ (Section 3.1). With dilation $d$ (gaps inside the window) it grows to
         $\\ell\\times d\\times w$ — "tens of thousands of tokens even for small $d$" (Section 3.1).</li>
         <li><b>Global tokens.</b> A few hand-picked positions (the classification token, or question tokens for
         question-answering) are exempt from the window: they attend to all tokens, and all tokens attend to them.
         This is the express lane that lets task-critical signal cross the whole sequence in one layer. There are
         only a handful of them, so they add $O(n)$ work, not $O(n^2)$.</li>
       </ol>
       <p><b>Why it works.</b> Language is mostly local: a token's meaning depends most on its neighbours, and the
       rare long-range link is carried either by stacking windows or by a global token. So the dropped entries are
       mostly near-zero anyway — Longformer spends compute where the attention weight actually lives.</p>`,

    symbols: [
      { sym: "$n$", desc: "the sequence length — the number of tokens. Full attention cost grows like $n^2$; Longformer's like $n$." },
      { sym: "$w$", desc: "the sliding-window size: each token attends to a band of $w$ neighbours total ($\\tfrac{1}{2}w$ on each side). A fixed constant, not growing with $n$." },
      { sym: "$\\tfrac{1}{2}w$", desc: "half the window — how many tokens on each side a token attends to (Section 3.1)." },
      { sym: "$d$", desc: "the dilation: the gap size between attended positions inside the window, used to reach further without more compute (Section 3.1)." },
      { sym: "$\\ell$", desc: "the number of stacked attention layers. After $\\ell$ layers the receptive field is $\\ell\\times w$ (or $\\ell\\times d\\times w$ with dilation)." },
      { sym: "$d_k$", desc: "the length of each query/key vector; scores are divided by $\\sqrt{d_k}$ (the scaling from paper-attention)." },
      { sym: "$Q,K,V$", desc: "the query, key, and value matrices (shape $n\\times d_k$, $n\\times d_k$, $n\\times d_v$) — the same inputs as scaled-dot-product attention." },
      { sym: "$QK^\\top$", desc: "the raw $n\\times n$ score table; Longformer only keeps a band (window) plus a few global rows/columns of it." },
      { sym: "receptive field", desc: "how far apart two tokens can be and still influence each other. One window layer reaches $\\pm\\tfrac{1}{2}w$; $\\ell$ layers reach $\\ell\\times w$." },
      { sym: "global token", desc: "a pre-selected position (e.g. the classification token) that attends to all tokens and is attended by all — its own projections in the paper." },
      { sym: "$O(n\\times w)$", desc: "big-O notation: the work grows in proportion to $n$ times $w$; with $w$ fixed this is linear in $n$ (Section 3.1)." },
      { sym: "$O(n^2)$", desc: "the cost of full self-attention: proportional to $n$ squared, so doubling $n$ quadruples the cost (Section 1)." },
      { sym: "BPC", desc: "bits-per-character: a character-level language-modeling score; lower is better. The paper's character-LM metric (Section 4.2)." }
    ],

    formula:
      `$$\\text{cost}_{\\text{full}} = O(n^2) \\quad\\longrightarrow\\quad \\text{cost}_{\\text{Longformer}} = O(n\\times w)$$`,

    whatItDoes:
      `<p>This is the complexity claim of Section 3.1, not a learned equation: full self-attention scores all
       $n^2$ token pairs, while sliding-window attention scores only the $\\approx n\\times w$ pairs inside the band
       (plus a constant number of global pairs). Because the window $w$ is a fixed constant chosen by the
       designer, $n\\times w$ is <b>linear</b> in the sequence length. The paper states it directly: <i>"The
       computation complexity of this pattern is $O(n\\times w)$, which scales linearly with input sequence length
       $n$"</i> (Section 3.1). Everything below the band is simply never computed.</p>`,

    derivation:
      `<p>The attention mechanism itself — query/key/value, dot-product scores, softmax weights, weighted sum of
       values — is derived in the <code>dl-attention</code> concept lesson and built from scratch in
       <code>paper-attention</code>; we do not re-derive it. Longformer changes only the <b>set of scored pairs</b>,
       so the cost argument is just counting that set:</p>
       <ul>
         <li><b>Full attention.</b> Every token attends to all $n$ tokens, so the score table has $n\\times n = n^2$
         entries — quadratic.</li>
         <li><b>Sliding window.</b> Each token attends to at most $w$ neighbours (the band of width $w$). With $n$
         tokens that is at most $n\\times w$ entries. Since $w$ is fixed, this grows like $n$ — linear.</li>
         <li><b>Global tokens.</b> If $g$ tokens are global, they add $\\approx g\\times n$ entries (each global
         token's row and column). With $g$ a small constant this is still $O(n)$.</li>
       </ul>
       <p>So total cost $= O(n\\times w) + O(g\\times n) = O(n)$ for fixed $w$ and $g$. The masking before the
       softmax (set dropped entries to $-\\infty$) makes those pairs contribute exactly zero weight — same
       reasoning as decoder masking in <code>paper-attention</code>.</p>`,

    example:
      `<p><b>Worked numbers — cost.</b> Take a window $w=4$ ($\\tfrac{1}{2}w=2$ on each side) and compare the
       number of scored pairs for full vs sliding-window attention as $n$ grows:</p>
       <ul>
         <li>$n=8$: full $=8^2=64$ pairs; window $\\approx 8\\times4=32$ pairs (interior rows have 5 live entries,
         edges fewer; exact count $=34$). Already about half.</li>
         <li>$n=64$: full $=4096$; window $\\approx 64\\times4=256$. A 16$\\times$ saving.</li>
         <li>$n=512$: full $=262{,}144$; window $\\approx 512\\times4=2048$. A 128$\\times$ saving.</li>
       </ul>
       <p>Doubling $n$ from 256 to 512 <b>quadruples</b> the full cost ($65{,}536\\to262{,}144$) but only
       <b>doubles</b> the windowed cost ($1024\\to2048$) — that is $O(n^2)$ vs $O(n\\times w)$ in numbers.</p>
       <p><b>Worked numbers — local match.</b> For a middle token $i$ whose true signal is local, the full-attention
       weights over its in-window neighbours are already nearly all the weight; renormalizing just those (dropping
       the tiny far weights and softmax-ing again over the window) barely changes them. The CODE cell measures this
       gap on a toy sequence and prints it — typically a small fraction.</p>`,

    recipe:
      `<p><b>Longformer attention (Section 3.1), as numbered steps:</b></p>
       <ol>
         <li>Score with the usual rule: $S=QK^\\top/\\sqrt{d_k}$ (conceptually $n\\times n$; the real code never
         builds the full table).</li>
         <li>Build the <b>band mask</b>: allow pair $(i,j)$ iff $|i-j|\\le\\tfrac{1}{2}w$. (With dilation $d$, allow
         only every $d$-th position in the band.)</li>
         <li>Mark a few <b>global</b> rows/columns as always-allowed (classification or question tokens).</li>
         <li>Set every disallowed score to $-\\infty$, then softmax over keys so dropped pairs get zero weight.</li>
         <li>Output $=$ (weights)$\\,V$, exactly as in scaled-dot-product attention.</li>
         <li>Stack $\\ell$ layers; the receptive field grows to $\\ell\\times w$ (or $\\ell\\times d\\times w$).</li>
       </ol>`,

    results:
      `<p>The paper reports (we QUOTE, with source):</p>
       <ul>
         <li>Character-level language modeling: <i>state-of-the-art</i> bits-per-character of <b>1.10 on text8</b>
         and <b>1.00 on enwik8</b> with the "small" model; the "large" model reaches <b>0.99 BPC on enwik8</b>
         (Section 4.2 / Tables 2–3, arXiv:2004.05150). BPC = bits-per-character, lower is better.</li>
         <li>Long-document tasks: Longformer-large reaches <b>81.9 F1 on WikiHop</b> and <b>77.3 F1 on TriviaQA</b>,
         above the prior numbers reported in the paper (Section 6, arXiv:2004.05150). F1 is a 0–100 accuracy-style
         score; higher is better.</li>
       </ul>
       <p>These are the paper's own large-scale numbers. Every number in the CODE/CODEVIZ below is instead
       <b>our own small run</b>, labeled as such — it demonstrates the cost saving and the local match, not the
       paper's benchmark.</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track B (architecture).</b> We do <i>not</i> rebuild the scaled-dot-product primitive — that is
       <code>paper-attention</code> and PyTorch's <code>F.scaled_dot_product_attention</code>. We implement only
       Longformer's novel piece: the <b>band mask</b> (sliding window) plus a few <b>global</b> rows/columns, then
       reuse the standard softmax-weighted-sum. For clarity our toy code materializes the full $n\\times n$ table
       and masks it; the paper's contribution in Section 3.2 is a banded implementation that never does so, which
       is what makes the memory genuinely $O(n)$. The <b>ablation</b> shrinks the window to show the receptive
       field collapse, and the <b>cost plot</b> shows sparse $O(n\\times w)$ vs full $O(n^2)$ as $n$ grows.</p>`,

    pitfalls:
      `<ul>
         <li><b>Masking after softmax instead of before.</b> Disallowed pairs must be set to $-\\infty$
         <i>before</i> the softmax so their weight is exactly 0. Zeroing weights <i>after</i> the softmax leaves
         the rows un-normalized (they no longer sum to 1).</li>
         <li><b>Off-by-one on the window.</b> Window $w$ means $\\tfrac{1}{2}w$ on <i>each</i> side; the band width
         is $w+1$ counting the token itself. Mixing up $w$ and $\\tfrac{1}{2}w$ halves or doubles the receptive
         field.</li>
         <li><b>Thinking one layer sees far.</b> A single window layer only reaches $\\pm\\tfrac{1}{2}w$. Long-range
         dependence comes from <i>stacking</i> ($\\ell\\times w$) or from <i>global</i> tokens — not from one layer.</li>
         <li><b>Forgetting global columns.</b> A global token must be attended <i>by</i> everyone (its column) as
         well as attend to everyone (its row). Allowing only the row makes it a sink that no one reads.</li>
         <li><b>Materializing the full table and calling it $O(n)$.</b> Our toy builds and masks the $n\\times n$
         table for clarity — that is still $O(n^2)$ memory. The paper's banded kernel (Section 3.2) is what
         actually achieves linear memory.</li>
       </ul>`,

    recall: [
      "State the cost of full self-attention and of Longformer's pattern in big-O notation.",
      "What is the receptive field after $\\ell$ stacked sliding-window layers of window $w$?",
      "Define $w$, $\\tfrac{1}{2}w$, and dilation $d$ in plain English.",
      "Why must disallowed pairs be masked to $-\\infty$ before the softmax, not zeroed after?",
      "What is a global token, and why does adding a few of them keep cost $O(n)$?"
    ],

    practice: [
      {
        q: `With window $w=6$, how many tokens can a single sliding-window layer attend to, and what is the receptive field after $\\ell=4$ stacked layers (no dilation)?`,
        steps: [
          { do: `One layer: $\\tfrac{1}{2}w=3$ on each side, so $3+3=6$ neighbours plus itself = 7 tokens.`, why: `Window $w$ means $\\tfrac{1}{2}w$ per side (Section 3.1).` },
          { do: `Receptive field after $\\ell$ layers $=\\ell\\times w = 4\\times6 = 24$.`, why: `Stacking grows reach linearly with depth.` }
        ],
        answer: `One layer attends to 7 tokens (6 neighbours + itself); after 4 layers the receptive field spans 24 tokens. Stacking is how a local window reaches far.`
      },
      {
        q: `For $n=1000$ and window $w=10$, roughly how many scored pairs does full attention need vs sliding-window attention, and what is the ratio?`,
        steps: [
          { do: `Full $= n^2 = 1000^2 = 1{,}000{,}000$ pairs.`, why: `Every token attends to all $n$ tokens — $O(n^2)$.` },
          { do: `Window $\\approx n\\times w = 1000\\times10 = 10{,}000$ pairs.`, why: `Each token attends to ~$w$ neighbours — $O(n\\times w)$.` },
          { do: `Ratio $= 1{,}000{,}000 / 10{,}000 = 100\\times$.`, why: `The saving is $n/w$.` }
        ],
        answer: `Full needs ~1,000,000 pairs; sliding-window ~10,000 — a 100$\\times$ reduction. The saving grows as $n/w$, so it is larger for longer documents.`
      },
      {
        q: `Ablation: you shrink the window from $w=8$ to $w=2$ in a 3-layer model. What happens to the receptive field, and what kind of dependency can the model no longer capture in 3 layers?`,
        steps: [
          { do: `Old receptive field $=\\ell\\times w = 3\\times8 = 24$ tokens; new $=3\\times2 = 6$ tokens.`, why: `Receptive field is $\\ell\\times w$ (Section 3.1).` },
          { do: `Any dependency between tokens more than 6 apart can no longer be formed by stacking alone.`, why: `Information cannot hop further than the receptive field in $\\ell$ layers.` },
          { do: `To recover long range you must either add layers, dilate the window, or add a global token.`, why: `Those are the paper's three reach mechanisms.` }
        ],
        answer: `Receptive field collapses from 24 to 6 tokens, so dependencies spanning more than 6 positions are lost without extra depth, dilation, or a global token. The CODE ablation prints exactly this collapse — the small window can no longer connect distant tokens.`
      }
    ]
  });

  window.CODE["paper-longformer"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build Longformer's sliding-window (+ a few global) attention by masking the scaled-dot-product score ` +
      `table (Section 3.1). On a toy sequence with mostly-local signal, show the windowed attention map matches ` +
      `FULL attention on the in-window neighbours (small gap), recompute the worked cost numbers, and demonstrate ` +
      `the ablation (shrinking the window collapses the receptive field). Runs in Colab (torch preinstalled).`,
    code: `import torch, torch.nn.functional as F

torch.manual_seed(0)

def scores_full(Q, K):
    d_k = Q.shape[-1]
    return (Q @ K.transpose(-2, -1)) / (d_k ** 0.5)          # (n,n) scaled scores

def band_mask(n, w, global_idx=()):
    """Allow (i,j) iff |i-j| <= w//2; global tokens attend/are-attended by all. Section 3.1."""
    i = torch.arange(n).unsqueeze(1)
    j = torch.arange(n).unsqueeze(0)
    allowed = (i - j).abs() <= (w // 2)                       # sliding window band
    for g in global_idx:                                     # global rows AND columns
        allowed[g, :] = True
        allowed[:, g] = True
    return allowed

def longformer_attention(Q, K, V, w, global_idx=()):
    S = scores_full(Q, K)
    allowed = band_mask(Q.shape[0], w, global_idx)
    S = S.masked_fill(~allowed, float('-inf'))               # mask BEFORE softmax
    W = S.softmax(dim=-1)                                    # zero weight on dropped pairs
    return W @ V, W

def full_attention(Q, K, V):
    W = scores_full(Q, K).softmax(dim=-1)
    return W @ V, W

# ---- toy sequence with MOSTLY-LOCAL signal: token t correlates with its neighbours ----
n, d_k, w = 40, 16, 8
base = torch.randn(n, d_k)
local = base.clone()
for t in range(1, n):                                        # smooth -> nearby tokens are similar
    local[t] = 0.7 * local[t - 1] + 0.3 * base[t]
Q = K = V = local                                            # self-attention style

out_w, Wwin = longformer_attention(Q, K, V, w)
out_f, Wfull = full_attention(Q, K, V)

# ---- does the WINDOW match FULL attention on the in-window neighbours? ----
allowed = band_mask(n, w)
# renormalize full weights over just the in-window positions, compare to windowed weights
full_in = (Wfull * allowed)
full_in = full_in / full_in.sum(-1, keepdim=True)
gap = (full_in - Wwin).abs().max().item()
print("max |full(in-window, renormed) - window| weight gap:", round(gap, 4))   # small
print("mass full attention already puts inside the window (avg):",
      round(Wfull.mul(allowed).sum(-1).mean().item(), 4))                       # close to 1 for local signal

# ---- worked cost numbers: full n^2 vs window ~ n*w ----
for nn in (8, 64, 512):
    am = band_mask(nn, 4)
    print(f"n={nn:>4}: full pairs={nn*nn:>7}, window live pairs={int(am.sum()):>6}")

# ---- ABLATION: shrink the window -> receptive field of ONE layer collapses ----
for ww in (8, 2):
    am = band_mask(n, ww)
    reach = (am[n//2]).nonzero().flatten()
    print(f"w={ww}: middle token reaches {reach.min().item()}..{reach.max().item()} "
          f"({int(am[n//2].sum())} tokens in one layer)")

# ---- global token demo: token 0 made global attends to / is attended by all ----
_, Wg = longformer_attention(Q, K, V, w=4, global_idx=(0,))
print("global token 0 attends to", int((Wg[0] > 0).sum()), "of", n, "tokens (full row)")
print("everyone attends to token 0:", bool((Wg[:, 0] > 0).all().item()))`
  };

  window.CODEVIZ["paper-longformer"] = {
    question: "How does the cost of attention grow with sequence length n — full O(n^2) vs Longformer's sliding-window O(n*w)? And on a local-signal sequence, how close is the windowed attention map to full attention over the in-window neighbours?",
    charts: [
      {
        type: "line",
        title: "Scored pairs vs sequence length n (our count, w=8) — full attention explodes quadratically; the window stays linear",
        xlabel: "sequence length n",
        ylabel: "number of scored token-pairs",
        series: [
          {
            name: "full  O(n^2)",
            color: "#f85149",
            points: [[16, 256], [32, 1024], [64, 4096], [128, 16384], [256, 65536], [512, 262144]]
          },
          {
            name: "window  O(n*w), w=8",
            color: "#7ee787",
            points: [[16, 124], [32, 268], [64, 556], [128, 1132], [256, 2284], [512, 4588]]
          }
        ]
      }
    ],
    caption: "Our small-scale count (torch, w=8), not a number from the paper. We count live (allowed) pairs in the attention mask as n grows. Full attention scores n^2 pairs: going 256->512 quadruples the work (65,536->262,144). The sliding window scores only the band, ~n*w pairs: the same step merely doubles it (2,284->4,588). That is exactly the O(n^2) vs O(n*w) gap of Section 3.1 — the saving (n/w) widens for longer documents. On a separate local-signal sequence, full attention already places nearly all of its weight inside the window, so the windowed map (renormalized over those neighbours) differs from full attention by only a tiny fraction — sparse attention loses almost nothing when the signal is local.",
    code: `import torch

def band_live_pairs(n, w):
    i = torch.arange(n).unsqueeze(1); j = torch.arange(n).unsqueeze(0)
    return int(((i - j).abs() <= (w // 2)).sum())

w = 8
print("n | full n^2 | window live pairs")
for n in (16, 32, 64, 128, 256, 512):
    print(f"{n:>4} | {n*n:>8} | {band_live_pairs(n, w):>6}")
# full:   256, 1024, 4096, 16384, 65536, 262144   (quadratic)
# window: 124,  268,  556,  1132,  2284,   4588   (linear in n)`
  };
})();
