/* Paper lesson — "Switch Transformers: Scaling to Trillion Parameter Models with
   Simple and Efficient Sparsity", Fedus, Zoph, Shazeer (Google), JMLR 2022.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-switch-transformer".
   GROUNDED from arXiv:2101.03961 (abstract) and the ar5iv HTML mirror:
   Section 2.1 (Simplifying Sparse Routing: softmax router Eqn 1, top-1 output Eqn 2);
   Section 2.2 (Efficient Sparse Routing: expert capacity Eqn 3, load-balancing
   auxiliary loss Eqn 4 with f_i Eqn 5 and P_i Eqn 6, and alpha = 1e-2).
   Track B (architecture): compose experts + a router with torch.nn, then implement the
   NOVEL part by hand — a Switch (Mixture-of-Experts) layer with TOP-1 routing, the
   load-balancing aux loss, and an expert capacity factor with token dropping. */
(function () {
  window.LESSONS.push({
    id: "paper-switch-transformer",
    title: "Switch Transformer — Scaling to Trillion Parameter Models with Simple and Efficient Sparsity (2022)",
    tagline: "Send each token to just ONE expert: huge parameter count, near-constant compute per token.",
    module: "Papers · Transformers & LLMs",
    track: "architecture",
    paper: {
      authors: "William Fedus, Barret Zoph, Noam Shazeer",
      org: "Google",
      year: 2022,
      venue: "arXiv:2101.03961 (Jan 2021); JMLR 2022",
      citations: "",
      arxiv: "https://arxiv.org/abs/2101.03961",
      url: "https://arxiv.org/abs/2101.03961",
      code: "https://github.com/google-research/t5x"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["pt-nn-module", "pt-autograd"],

    // WHY READ IT
    problem:
      `<p>A normal neural network uses the <b>same</b> weights for every input. To make it smarter you make
       those weights bigger &mdash; but then every token pays the full compute bill. Compute and parameter
       count rise together. That is the wall.</p>
       <p><b>Mixture of Experts (MoE = a layer that holds many sub-networks called "experts" and uses only a
       few per input)</b> breaks that link. It stores many experts but runs only a chosen few per token. So
       you can add parameters (capacity) without adding much compute per token. From the abstract:</p>
       <blockquote>"Mixture of Experts (MoE) defies this and instead selects different parameters for each
       incoming example. The result is a sparsely-activated model &mdash; with outrageous numbers of
       parameters &mdash; but a constant computational cost." (Abstract)</blockquote>
       <p>Earlier MoE layers were hard to use. The abstract names the blockers:</p>
       <blockquote>"despite several notable successes of MoE, widespread adoption has been hindered by
       complexity, communication costs and training instability." (Abstract)</blockquote>
       <p>The question this paper answers: can we make the routing <b>dead simple</b> &mdash; one expert per
       token &mdash; and still train it stably at massive scale?</p>`,
    contribution:
      `<ul>
        <li><b>Top-1 routing (the "Switch" layer).</b> Earlier MoE work routed each token to several experts.
        Switch routes each token to exactly <b>one</b>. The paper calls this $k=1$ routing and argues it cuts
        complexity and communication while keeping quality. This is the novel piece you implement.</li>
        <li><b>A load-balancing auxiliary loss.</b> Left alone, routing collapses: a few experts grab all the
        tokens and the rest go unused. The paper adds a small extra loss term that pushes token traffic to
        spread evenly across experts (Section 2.2, their Equation 4).</li>
        <li><b>An expert capacity factor.</b> Each expert gets a fixed buffer size. Tokens past that buffer are
        "dropped" &mdash; skipped and passed forward unchanged through the residual connection. This keeps the
        per-expert compute fixed and predictable (Section 2.2, Equation 3).</li>
      </ul>`,
    whyItMattered:
      `<p>Switch Transformer made sparse Mixture-of-Experts models <b>practical and simple</b>. The abstract
       reports models with "outrageous numbers of parameters" at "constant computational cost," up to
       "trillion parameter models." Top-1 routing plus a balancing loss became the standard recipe that later
       sparse large language models built on. The lasting idea: you can grow a model's <i>parameter count</i>
       far faster than its <i>per-token compute</i>, as long as you route each token to a small, balanced set
       of experts.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2.1 (Simplifying Sparse Routing)</b> &mdash; the router. A softmax over experts
        (their <b>Equation 1</b>), then route each token to the single highest-probability expert; the layer
        output is that expert's output scaled by its router probability (<b>Equation 2</b>). This is the top-1
        idea you transcribe and implement.</li>
        <li><b>&sect;2.2 (Efficient Sparse Routing)</b> &mdash; the two mechanisms that make it work at scale:
        the <b>expert capacity</b> formula (<b>Equation 3</b>) and what happens on overflow (dropped tokens via
        the residual), and the <b>load-balancing auxiliary loss</b> (<b>Equation 4</b>) built from $f_i$
        (<b>Equation 5</b>) and $P_i$ (<b>Equation 6</b>), with $\\alpha = 10^{-2}$.</li>
       </ul>
       <p><b>Skim:</b> the large-scale results sections (T5-Base / T5-Large speedups, multilingual, trillion-
       parameter training, bfloat16 stability tricks) unless you want the engineering. The core algorithm is
       entirely in &sect;2.1 and &sect;2.2.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will build a Switch layer with 4 experts and train it twice on toy tokens that come in 4 distinct
       "types" (4 clusters in feature space). Once <b>with</b> the load-balancing auxiliary loss, once
       <b>without</b> it. After training, you measure what fraction of tokens each expert receives.</p>
       <p>Question: <b>without</b> the balancing loss, will the 4 experts end up roughly equally used &mdash; or
       will routing collapse onto a few experts while others go dead (receive almost no tokens)? And does adding
       the loss fix it? Write your guess and one sentence of reasoning.</p>
       <p>(Hint: the router is rewarded only for low task loss. If sending most tokens to one strong expert
       already lowers the task loss, what stops it?)</p>`,
    attempt:
      `<p>Before the reveal, sketch the Switch layer you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Router:</b> a single <code>nn.Linear(d_model, N)</code> giving logits, then
        <code>p = softmax(logits)</code> over the $N$ experts.</li>
        <li><b>Top-1 pick:</b> <code>pick = p.argmax(dim=1)</code>; keep the chosen probability
        <code>gate = p[pick]</code> as the scale on the expert output.</li>
        <li><b>TODO &mdash; capacity:</b> compute <code>capacity = int((T / N) * capacity_factor)</code>. For
        each expert, if more than <code>capacity</code> tokens chose it, keep the first <code>capacity</code>
        and <b>drop</b> the rest (leave their output at zero / pass through residual).</li>
        <li><b>TODO &mdash; aux loss:</b> compute $f_i$ = fraction of tokens that picked expert $i$, and $P_i$ =
        mean router probability for expert $i$. Return
        <code>aux = alpha * N * sum(f_i * P_i)</code>.</li>
        <li>TODO: why multiply $f_i$ by $P_i$ rather than just penalizing uneven $f$? (Hint: $f$ is a hard
        count &mdash; not differentiable. Which factor carries the gradient?)</li>
       </ul>
       <p>Then train with and without the aux term and compare expert usage. Predict which collapses.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>A Switch layer replaces the usual feed-forward block in a Transformer with <b>$N$ parallel
       feed-forward networks</b> (the experts) plus a tiny <b>router</b> that decides, per token, which single
       expert handles it.</p>
       <p><b>Step 1 &mdash; route (&sect;2.1).</b> For a token vector $x$, the router is a small linear map with
       weights $W_r$. It produces one logit per expert, then a softmax turns those into probabilities
       (<b>Equation 1</b>):</p>
       <p>$$ p_i(x) = \\frac{e^{h(x)_i}}{\\sum_{j=1}^{N} e^{h(x)_j}}, \\qquad h(x) = W_r \\, x. $$</p>
       <p>Here $p_i(x)$ is the router's probability that token $x$ should go to expert $i$, and $N$ is the
       number of experts. <b>Top-1 routing:</b> send the token to the single expert with the largest
       probability &mdash; the $\\arg\\max$ over $i$. Earlier MoE layers picked several; Switch picks one.</p>
       <p><b>Step 2 &mdash; compute (&sect;2.1).</b> Run the token through only that chosen expert $E_i$, and
       scale its output by the router probability $p_i(x)$ (<b>Equation 2</b>):</p>
       <p>$$ y = \\sum_{i \\in \\mathcal{T}} p_i(x)\\, E_i(x), $$</p>
       <p>where $\\mathcal{T}$ is the set of selected indices &mdash; for top-1 that set holds exactly one
       expert. Keeping the $p_i(x)$ factor lets the gradient reach the router: if the chosen expert did well,
       raising $p_i(x)$ lowers the loss.</p>
       <p><b>Step 3 &mdash; capacity (&sect;2.2).</b> On a parallel machine each expert needs a fixed-size
       buffer. The <b>expert capacity</b> (<b>Equation 3</b>) is the tokens-per-batch divided by the number of
       experts, times a <b>capacity factor</b>:</p>
       <p>$$ \\text{expert capacity} = \\Big(\\frac{\\text{tokens per batch}}{\\text{number of experts}}\\Big)
       \\times \\text{capacity factor}. $$</p>
       <p>A capacity factor above $1.0$ leaves slack for uneven routing. If too many tokens pick one expert,
       the overflow tokens are <b>dropped</b>: their expert computation is skipped and the token passes forward
       unchanged through the residual connection (&sect;2.2).</p>
       <p><b>Step 4 &mdash; balance (&sect;2.2).</b> Nothing so far stops the router from dumping every token on
       one favorite expert. The <b>load-balancing auxiliary loss</b> (<b>Equation 4</b>) is a small extra term,
       added to the main task loss, that is minimized when traffic is spread evenly:</p>
       <p>$$ \\text{loss} = \\alpha \\cdot N \\cdot \\sum_{i=1}^{N} f_i \\cdot P_i. $$</p>
       <p>$f_i$ is the fraction of tokens that <i>actually</i> went to expert $i$ (a hard count,
       <b>Equation 5</b>); $P_i$ is the average router probability for expert $i$ (soft, differentiable,
       <b>Equation 6</b>). Their product is small when load is even and large when one expert hogs traffic. The
       paper sets $\\alpha = 10^{-2}$.</p>`,
    architecture:
      `<p>A Transformer block alternates a self-attention sub-layer with a position-wise <b>feed-forward network
       (FFN)</b>. The Switch Transformer leaves attention untouched and <b>replaces the single dense FFN with a
       Switch (Mixture-of-Experts) layer</b> (&sect;2). From the paper: "we replace the dense feed forward
       network (FFN) ... with a sparse Switch FFN layer." Both encoder and decoder blocks can use it (in the
       paper, typically every other FFN is swapped).</p>
       <p><b>Inside the Switch FFN layer:</b></p>
       <ul>
        <li><b>$N$ expert FFNs in parallel.</b> Each expert $E_i$ is its own full feed-forward network
        ($\\text{Linear} \\to \\text{ReLU} \\to \\text{Linear}$, inner width $d_{ff}$), identical in shape to the
        dense FFN it replaces. They share no weights, so the layer holds $N\\times$ the FFN parameters.</li>
        <li><b>One router</b> &mdash; a small linear map $W_r$ of shape $d_{model}\\times N$ producing one logit
        per expert, softmaxed (Eqn 1).</li>
        <li><b>Top-1 dispatch.</b> Each token independently goes to the single $\\arg\\max$ expert (Eqn 2); its
        output is scaled by the gate $p_i(x)$ and written back to that token's position.</li>
        <li><b>Capacity buffer.</b> Each expert has a fixed-size slot count (Eqn 3); on a distributed setup the
        experts sit on different devices, so the buffer must be static. Overflow tokens are dropped and ride the
        <b>residual connection</b> forward unchanged.</li>
       </ul>
       <p><b>Data flow for one token:</b> input $x$ &rarr; router softmax &rarr; pick top-1 expert &rarr; (if
       within that expert's capacity) run $E_i(x)$ and scale by $p_i(x)$, else pass $x$ through unchanged &rarr;
       add residual &rarr; layer-norm, exactly as a normal Transformer FFN sub-layer.</p>
       <p><b>Sparse routing at ~constant FLOPs.</b> Because each token activates only <b>one</b> expert, the
       compute per token is essentially that of a <i>single</i> dense FFN regardless of how many experts $N$ the
       layer holds. So $N$ scales the <b>parameter count</b> (and memory / device count) while leaving the
       <b>per-token FLOPs</b> nearly fixed &mdash; the whole point of sparsity. This decoupling is what lets the
       paper push to trillion-parameter models at the compute budget of a much smaller dense model.</p>`,
    symbols: [
      { sym: "“expert”", desc: "a plain term: one of the $N$ parallel feed-forward sub-networks inside the Switch layer. Each token is processed by exactly one of them." },
      { sym: "“router”", desc: "a plain term: a tiny linear layer (weights $W_r$) that scores how well each expert suits a token, then a softmax picks the best one." },
      { sym: "$N$", desc: "the <b>number of experts</b> in the layer. The layer's parameter count grows with $N$, but per token only ONE expert runs, so per-token compute stays roughly fixed." },
      { sym: "$x$", desc: "a single <b>token vector</b> entering the layer (one row of the batch); $h(x) = W_r x$ are its router logits." },
      { sym: "$p_i(x)$", desc: "the <b>router probability</b> that token $x$ belongs to expert $i$ &mdash; softmax of the logits (Eqn 1). Top-1 routing sends $x$ to the expert with the largest $p_i(x)$." },
      { sym: "$E_i(x)$", desc: "the output of <b>expert $i$</b> on token $x$. Only the chosen expert is actually run." },
      { sym: "$\\mathcal{T}$", desc: "the set of <b>selected expert indices</b> for a token. For Switch's top-1 routing it contains exactly one index." },
      { sym: "“capacity factor”", desc: "a knob (e.g. $1.25$): each expert's buffer holds $(\\text{tokens}/N)\\times\\text{factor}$ tokens (Eqn 3). Above $1.0$ leaves slack; tokens past the buffer are dropped." },
      { sym: "$f_i$", desc: "the <b>fraction of tokens dispatched to expert $i$</b> (Eqn 5): count the tokens whose $\\arg\\max$ is $i$, divide by the total. A hard, non-differentiable count." },
      { sym: "$P_i$", desc: "the <b>mean router probability for expert $i$</b> (Eqn 6): average $p_i(x)$ over all tokens. Soft and differentiable &mdash; this factor carries the gradient in the aux loss." },
      { sym: "$\\alpha$", desc: "the <b>aux-loss weight</b>. The paper uses $\\alpha = 10^{-2}$: large enough to balance load, small enough not to overwhelm the main task loss." }
    ],
    formula:
      `<p>$$ p_i(x) = \\frac{e^{h(x)_i}}{\\sum_{j=1}^{N} e^{h(x)_j}}, \\qquad h(x) = W_r\\, x. $$</p>
       <p><b>&sect;2.1, Equation 1</b> &mdash; the router softmax: turn the router logits $h(x)=W_r x$ into a
       probability $p_i(x)$ per expert.</p>
       <p>$$ y = p_i(x)\\, E_i(x), \\qquad i = \\arg\\max_{j} p_j(x). $$</p>
       <p><b>&sect;2.1, Equation 2</b> &mdash; top-1 ($k=1$) routing: send the token only to its single
       highest-probability expert $E_i$, then scale that expert's output by the gate value $p_i(x)$.</p>
       <p>$$ \\text{expert capacity} = \\Big(\\frac{\\text{tokens per batch}}{\\text{number of experts}}\\Big)
       \\times \\text{capacity factor}. $$</p>
       <p><b>&sect;2.2, Equation 3</b> &mdash; each expert's fixed buffer size; a capacity factor $\\gt 1.0$ adds
       slack for uneven routing, and tokens past the buffer are dropped (passed through the residual).</p>
       <p>$$ \\text{loss} = \\alpha \\cdot N \\cdot \\sum_{i=1}^{N} f_i \\cdot P_i. $$</p>
       <p><b>&sect;2.2, Equation 4</b> &mdash; the load-balancing auxiliary loss, added to the task loss
       ($\\alpha = 10^{-2}$); minimized when token traffic is spread evenly across the $N$ experts.</p>
       <p>$$ f_i = \\frac{1}{T}\\sum_{x \\in \\mathcal{B}} \\mathbb{1}\\{\\arg\\max p(x) = i\\}. $$</p>
       <p><b>&sect;2.2, Equation 5</b> &mdash; $f_i$, the dispatch fraction: the fraction of the $T$ tokens in
       batch $\\mathcal{B}$ whose top-1 expert is $i$ (a hard, non-differentiable count).</p>
       <p>$$ P_i = \\frac{1}{T}\\sum_{x \\in \\mathcal{B}} p_i(x). $$</p>
       <p><b>&sect;2.2, Equation 6</b> &mdash; $P_i$, the mean router probability for expert $i$ over the batch
       (soft and differentiable &mdash; the factor that carries the gradient in Equation 4).</p>`,
    whatItDoes:
      `<p><b>Equation 1</b> is the router: a softmax over experts. <b>Top-1</b> just takes the $\\arg\\max$ &mdash;
       one expert per token. This is the whole simplification over older multi-expert MoE.</p>
       <p><b>Equation 2</b> is the layer output, $y = p_i(x)\\,E_i(x)$: run only the chosen expert, then multiply
       its output by the router's own probability $p_i(x)$. That multiply is the <b>differentiable-routing
       trick</b> &mdash; the $\\arg\\max$ pick itself has no gradient, but the gate factor $p_i(x)$ is a smooth
       function of $W_r$. So when the chosen expert lowers the task loss, the gradient flows back through $p_i(x)$
       and teaches the router to raise that probability; the routing becomes trainable end-to-end.</p>
       <p><b>Equation 3</b> sets each expert's fixed buffer size so the dispatch tensor has a static shape (needed
       when experts live on separate devices); overflow tokens are dropped to the residual.</p>
       <p><b>Equation 4</b> is the load-balancing aux loss. Read $f_i \\cdot P_i$ as "how many tokens went there"
       times "how confident the router was about going there." Summed and scaled, it is smallest when both are
       spread evenly across experts &mdash; i.e. $f_i \\approx P_i \\approx 1/N$. The $N$ factor makes the ideal
       balanced value equal to $\\alpha$ regardless of expert count: at perfect balance,
       $N \\sum_i (1/N)(1/N) = 1$, so the loss is $\\alpha \\cdot 1$. The clever bit: $f_i$ (Eqn 5) is a hard
       count with no gradient, but $P_i$ (Eqn 6) is a smooth average of probabilities. Multiplying them lets
       the gradient flow through $P_i$ &mdash; lowering the loss nudges the router to put <i>less probability</i>
       on already-overloaded experts. The result is even expert usage.</p>`,
    derivation:
      `<p>Why is the balanced state the minimum of $N \\sum_i f_i P_i$? Treat both $f$ and $P$ as probability
       vectors over the $N$ experts (each sums to $1$, since $\\sum_i f_i = 1$ and $\\sum_i P_i = 1$). The aux
       loss is then $N$ times their dot product, $N \\, (f \\cdot P)$.</p>
       <p>Consider the symmetric case $f = P$ (the router's confidence matches where tokens actually go, which
       training drives toward). Then the term is $N \\sum_i f_i^2$. Minimizing $\\sum_i f_i^2$ subject to
       $\\sum_i f_i = 1$ over the probability simplex has a unique minimum at the uniform vector
       $f_i = 1/N$ for all $i$ (this is just the fact that, among probability vectors, the uniform one has the
       smallest sum of squares). At that uniform point $N \\sum_i (1/N)^2 = N \\cdot N \\cdot (1/N^2) = 1$, so
       the loss equals $\\alpha$. Any imbalance &mdash; some $f_i$ large, others near zero &mdash; raises
       $\\sum_i f_i^2$ above $1/N$ and pushes the loss above $\\alpha$. So driving this term down <b>is</b>
       driving the routing toward uniform load.</p>
       <p>Gradients: $f_i$ is a counting indicator (an $\\arg\\max$), so $\\partial f_i / \\partial W_r = 0$
       almost everywhere &mdash; it cannot teach the router. $P_i$ is an average of softmax probabilities, fully
       differentiable in $W_r$. Treating $f_i$ as a constant weight, the gradient of $\\alpha N \\sum_i f_i P_i$
       reduces softmax mass on whichever experts have large $f_i$ &mdash; exactly the overloaded ones. That is
       how a hard load count steers a soft router.</p>`,
    example:
      `<p>Work the aux loss by hand on a tiny batch so it is concrete. Take $N=2$ experts and $T=4$ tokens.
       Suppose the router logits $h(x)$ for the four tokens are:</p>
       <ul class="steps">
        <li><b>Softmax each token (Eqn 1).</b> With logits $[2,0],[1,0],[0,1],[3,0]$:
        token&nbsp;1 $\\to[0.8808,0.1192]$, token&nbsp;2 $\\to[0.7311,0.2689]$,
        token&nbsp;3 $\\to[0.2689,0.7311]$, token&nbsp;4 $\\to[0.9526,0.0474]$.
        (For token 1: $e^{2}/(e^{2}+e^{0}) = 7.389/8.389 = 0.8808$.)</li>
        <li><b>Top-1 pick ($\\arg\\max$).</b> Tokens 1, 2, 4 pick expert&nbsp;0; token 3 picks expert&nbsp;1.
        So picks $=[0,0,1,0]$.</li>
        <li><b>$f_i$ &mdash; fraction dispatched (Eqn 5).</b> Expert&nbsp;0 got 3 of 4 tokens, expert&nbsp;1 got
        1 of 4: $f = [0.75,\\; 0.25]$.</li>
        <li><b>$P_i$ &mdash; mean router prob (Eqn 6).</b> Average each column:
        $P_0 = (0.8808+0.7311+0.2689+0.9526)/4 = 2.8334/4 = 0.7083$, and
        $P_1 = 1 - 0.7083 = 0.2917$. So $P = [0.7083,\\; 0.2917]$.</li>
        <li><b>Aux loss (Eqn 4).</b> $\\sum_i f_i P_i = 0.75\\cdot0.7083 + 0.25\\cdot0.2917 = 0.5312+0.0729
        = 0.6042$. Times $N=2$: $1.2083$. Times $\\alpha=0.01$: $\\text{loss}=0.012083$.</li>
        <li><b>Sanity vs balanced.</b> Perfectly balanced ($f=P=[0.5,0.5]$) would give
        $N\\sum f_i P_i = 2(0.25+0.25)=1.0$, loss $=\\alpha=0.01$. Our skewed batch sits ABOVE that at
        $0.012083$ &mdash; the loss is higher precisely because expert&nbsp;0 is overloaded.</li>
       </ul>
       <p>These exact numbers ($f=[0.75,0.25]$, $P=[0.7083,0.2917]$, loss $=0.012083$) are recomputed in the
       notebook's first cell so you can check them.</p>`,
    recipe:
      `<ol>
        <li><b>Build experts</b> with <code>torch.nn</code>: $N$ parallel feed-forward networks, each
        <code>Linear &rarr; ReLU &rarr; Linear</code>.</li>
        <li><b>Build the router:</b> one <code>nn.Linear(d_model, N)</code> giving logits; softmax over experts
        (Eqn 1).</li>
        <li><b>Top-1 route:</b> <code>pick = p.argmax(dim=1)</code>; keep <code>gate = p[pick]</code> as the
        output scale (Eqn 2).</li>
        <li><b>Capacity:</b> <code>capacity = int((T/N) * capacity_factor)</code> (Eqn 3). Per expert, keep at
        most <code>capacity</code> tokens; <b>drop</b> overflow (output stays zero / residual passthrough).</li>
        <li><b>Run experts:</b> for each expert, gather its kept tokens, run them, scatter
        <code>gate * E_i(x)</code> back.</li>
        <li><b>Aux loss:</b> compute $f_i$ (Eqn 5) and $P_i$ (Eqn 6); return
        <code>alpha * N * sum(f_i*P_i)</code> (Eqn 4). Add it to the task loss.</li>
        <li><b>Ablate:</b> train once WITH the aux loss and once WITHOUT, and compare per-expert token shares.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): the Switch Transformer obtains "up to 7x increases in pre-training speed
       with the same computational resources" over T5-Base / T5-Large, extends to "all 101 languages" in the
       multilingual setting, and scales "up to trillion parameter models" with "a 4x speedup over the T5-XXL
       model."</p>
       <p>On the routing simplification, the abstract states the contribution plainly: "We simplify the MoE
       routing algorithm and design intuitive improved models with reduced communication and computational
       costs." The aux-loss weight is given in &sect;2.2: "we use an $\\alpha = 10^{-2}$ which was sufficiently
       large to ensure load balancing while small enough to not overwhelm the primary cross-entropy
       objective."</p>
       <p><i>These are the paper's own statements, quoted from the abstract and &sect;2.2. The numbers in the
       CODEVIZ panel below are from our own tiny run on toy tokens &mdash; not the paper's reported
       results.</i></p>`,
    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> A Switch layer is a drop-in FFN replacement, so you score it
        two ways at once. (a) <b>Quality:</b> the model's task loss / perplexity on held-out data &mdash;
        a correctly wired Switch FFN must do at least as well as the single dense FFN it replaced (the
        "trivial" baseline here is the dense model at the same per-token FLOPs; the paper's headline is up
        to "7x increases in pre-training speed" over T5-Base/Large at equal compute, quoted in
        <code>results</code>). (b) <b>Routing health:</b> per-expert token share and the fraction of
        <b>dropped</b> tokens. Define "no skill" as the degenerate router that dumps everything on one
        expert (share $=1$ on one expert, $0$ elsewhere); a working layer spreads load near $1/N$.</p>
       <p><b>2. Sanity checks BEFORE the full run.</b></p>
       <ul>
        <li>Reproduce the worked example exactly &mdash; $N=2$, $T=4$, logits $[2,0],[1,0],[0,1],[3,0]$
        must give $f=[0.75,0.25]$, $P=[0.7083,0.2917]$, aux $=0.012083$. Any drift means a wrong softmax
        axis or a wrong $f$/$P$ definition.</li>
        <li>Check shapes/ranges: the router output sums to 1 per token ($\\sum_i p_i(x)=1$); the layer output
        has the same shape as its input; $f$ and $P$ each sum to 1 over experts.</li>
        <li>At init the router is roughly uniform, so expect $f_i \\approx P_i \\approx 1/N$ and the aux loss
        $\\approx \\alpha$ (its balanced floor) &mdash; a useful known-answer check ($\\alpha=10^{-2}$).</li>
        <li>Overfit a single tiny batch with the task loss only: it should fall toward $0$, which proves the
        experts and the differentiable gate $p_i(x)$ are actually receiving gradient.</li>
       </ul>
       <p><b>3. Expected range.</b> On the toy 4-type task the balanced run should land all four experts
        near $0.25$ with $0$ dropped (our small run: CV $\\approx 0.17$, in <code>results</code>/CODEVIZ &mdash;
        not a paper number); treat per-expert shares inside roughly $[0.15,0.35]$ as healthy and a dead
        expert at $\\approx 0$ as a bug, not tuning. At scale, anchor quality to the paper's claim of matching
        or beating the dense T5 baseline at equal FLOPs (approximate, see <code>results</code>); being
        <i>worse</i> than the dense FFN it replaced means the routing or gate is broken, not merely untuned.</p>
       <p><b>4. Ablation &mdash; prove the idea earns its keep.</b> The paper's central additions are the
        <b>top-1 router</b> and the <b>load-balancing aux loss</b>. Turn the aux loss OFF
        (<code>use_aux=False</code>), retrain identically, and the routing must <b>collapse</b>: a couple of
        experts grab most tokens, others go dead, drops spike (our run: one expert $\\approx 75\\%$, two at $0\\%$,
        112 tokens dropped, CV $\\approx 1.23$). If usage stays balanced with the aux loss off, the loss term
        isn't wired into the optimizer. As a second knob, compare top-1 against a dense (all-experts) baseline:
        top-1 should hold quality at a fraction of the compute.</p>
       <p><b>5. Failure signals &amp; what they mean.</b></p>
       <ul>
        <li><b>One expert at $\\approx 100\\%$, others dead, many drops</b> &rarr; routing collapse: aux loss
        missing, too weak, or the leading $N$ factor dropped (rule of thumb).</li>
        <li><b>Router never improves / experts get no gradient</b> &rarr; you returned $E_i(x)$ without the
        gate $p_i(x)$, so the $\\arg\\max$ pick has no learnable signal.</li>
        <li><b>Huge drop fraction even when balanced</b> &rarr; capacity factor set to $1.0$ or below; raise it
        (the demo uses $1.25$).</li>
        <li><b>Aux loss not near $\\alpha$ at init</b> &rarr; wrong $f$/$P$ definition or a missing $N$ scale;
        the balanced floor should be $\\alpha=10^{-2}$.</li>
        <li><b>Loss NaN</b> &rarr; LR too high, or a divide-by-zero in a per-expert normalization when an expert
        receives zero tokens.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper. The building blocks already ship in PyTorch, so you
       <b>import</b> them and build only the novel composition. <b>Import:</b> <code>nn.Linear</code>,
       <code>nn.ReLU</code> for each expert and the router, <code>F.softmax</code>, and
       <code>torch.optim.Adam</code>. <b>Build by hand:</b> the <b>Switch layer</b> itself &mdash; the top-1
       $\\arg\\max$ routing (Eqn 1&ndash;2), the <b>load-balancing auxiliary loss</b> $\\alpha N\\sum_i f_i P_i$
       (Eqn 4&ndash;6), and the <b>expert capacity</b> buffer with token dropping (Eqn 3). PyTorch has no
       "Switch layer" primitive; the routing, the balance loss, and the capacity logic are the paper's
       contribution and you assemble them yourself.</p>`,
    pitfalls:
      `<ul>
        <li><b>Dropping the $p_i(x)$ factor on the expert output.</b> Equation 2 scales the chosen expert's
        output by its router probability. If you return $E_i(x)$ alone, the router gets no gradient from the
        task loss and never learns <i>which</i> expert to prefer. <b>Fix:</b> multiply by <code>gate</code>.</li>
        <li><b>Penalizing only $f_i$ in the aux loss.</b> $f_i$ is an $\\arg\\max$ count with zero gradient.
        A loss built from $f$ alone cannot move the router. <b>Fix:</b> use the product $f_i P_i$ &mdash; the
        differentiable $P_i$ carries the gradient (Eqn 4).</li>
        <li><b>Forgetting the $N$ scale.</b> Without the leading $N$, the balanced-state loss depends on the
        expert count and the term shrinks as you add experts, weakening balancing. The $N$ normalizes it so the
        ideal value is $\\alpha$ for any $N$.</li>
        <li><b>Capacity factor set to exactly 1.0 (or below).</b> Real routing is uneven; a factor of $1.0$
        leaves no slack and drops many tokens every step, hurting quality. <b>Fix:</b> use a factor above $1.0$
        (the demo uses $1.25$).</li>
        <li><b>Confusing top-1 with top-k.</b> Switch routes to ONE expert. Older MoE routed to several. If you
        sum over multiple experts per token you have rebuilt the thing the paper simplified away.</li>
      </ul>`,
    recall: [
      "Write the router softmax (Eqn 1) and say what top-1 routing does to its output.",
      "Write the load-balancing aux loss (Eqn 4) and define $f_i$ and $P_i$.",
      "Which of $f_i$ and $P_i$ carries the gradient, and why?",
      "State the expert-capacity formula (Eqn 3) and what happens to overflow tokens."
    ],
    practice: [
      {
        q: `<b>The aux-loss ablation.</b> You have a working Switch layer with 4 experts that trains WITH the
            load-balancing loss and ends up using all four experts fairly evenly. You set
            <code>use_aux=False</code> and retrain, everything else identical. What do you expect to happen to
            the per-expert token shares, and why?`,
        steps: [
          { do: `Identify what the router is now optimizing: only the task loss, with no pressure to spread tokens.`, why: `Nothing rewards balance, so if concentrating tokens on a strong expert lowers task loss, the router will do it.` },
          { do: `Predict the failure mode: a few experts capture most tokens; others receive almost none (go "dead"). With a fixed capacity factor, the overloaded experts also start DROPPING overflow tokens.`, why: `This is routing collapse &mdash; the exact failure the aux loss exists to prevent (&sect;2.2).` },
          { do: `Re-enable the aux loss and confirm usage re-balances toward $1/N$ per expert.`, why: `The $f_i P_i$ term pushes softmax mass off overloaded experts, evening out load.` }
        ],
        answer: `<p>Without the aux loss, routing <b>collapses</b>: usage concentrates on a couple of experts
                 while others go dead, and the overloaded experts begin dropping tokens once they exceed
                 capacity. In our small run (CODEVIZ) the WITHOUT-aux case sends one expert ~75% of tokens and
                 leaves two others at 0% (112 tokens dropped), while WITH the aux loss all four sit near 25% with
                 zero drops. The balancing loss is what makes sparse MoE actually use its capacity.</p>`
      },
      {
        q: `Recompute the worked example, then change one token. Keep $N=2$, $T=4$, but change token&nbsp;3's
            logits from $[0,1]$ to $[2,0]$ (so it now strongly prefers expert&nbsp;0). New logits:
            $[2,0],[1,0],[2,0],[3,0]$. Compute the new picks, $f$, $P$, and aux loss. Did balance get better or
            worse?`,
        steps: [
          { do: `Softmax (Eqn 1): token 3 now $\\to [0.8808, 0.1192]$; the others unchanged ($[0.8808,0.1192],[0.7311,0.2689],-,[0.9526,0.0474]$).`, why: `Only token 3's logits changed; $e^{2}/(e^{2}+1)=0.8808$.` },
          { do: `Picks: now ALL four tokens $\\arg\\max$ to expert 0, so picks $=[0,0,0,0]$ and $f=[1.0,\\,0.0]$.`, why: `Every token's largest probability is on expert 0.` },
          { do: `$P$ (Eqn 6): $P_0 = (0.8808+0.7311+0.8808+0.9526)/4 = 3.4453/4 = 0.8613$, $P_1 = 0.1387$. Aux (Eqn 4): $N\\sum f_i P_i = 2(1.0\\cdot0.8613 + 0) = 1.7227$, times $\\alpha=0.01 = 0.017227$.`, why: `All load on one expert pushes $\\sum f_i P_i$ up; the loss rises.` }
        ],
        answer: `<p>Now every token routes to expert&nbsp;0: $f=[1.0,0.0]$, $P=[0.8613,0.1387]$, and the aux loss
                 rises to $0.017227$ &mdash; <b>higher</b> than the original $0.012083$, which was itself above the
                 balanced $0.01$. Balance got <b>worse</b>, and the loss correctly reports it: the more skewed the
                 routing, the larger the penalty. Training would push back against exactly this state.</p>`
      },
      {
        q: `Your batch has $T = 256$ tokens and $N = 4$ experts, with capacity factor $1.25$. (a) What is each
            expert's capacity? (b) If one expert is chosen by 100 tokens in a step, how many of its tokens are
            dropped? (c) What happens to a dropped token?`,
        steps: [
          { do: `Apply Eqn 3: capacity $= (T/N)\\times\\text{factor} = (256/4)\\times1.25 = 64\\times1.25 = 80$.`, why: `Each expert buffers 80 tokens; the factor 1.25 adds 25% slack over the even share of 64.` },
          { do: `Overflow $= 100 - 80 = 20$ tokens dropped for that expert.`, why: `Tokens past the capacity buffer cannot be processed by the expert this step.` },
          { do: `A dropped token skips expert computation and is passed forward unchanged through the residual connection (&sect;2.2).`, why: `The residual path means a dropped token is not lost &mdash; it just isn't transformed by this layer.` }
        ],
        answer: `<p>(a) Capacity $= (256/4)\\times1.25 = 80$ tokens per expert. (b) With 100 tokens chosen, $100-80
                 = 20$ are dropped. (c) Each dropped token skips the expert and passes through the residual
                 connection unchanged. A higher capacity factor would reduce drops at the cost of more compute and
                 memory per expert; this is the slack-vs-cost trade the factor controls.</p>`
      }
    ]
  });

  window.CODE["paper-switch-transformer"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>compose</b> $N$ expert feed-forward networks and a linear router with
       <code>nn.Linear</code> / <code>nn.ReLU</code>, then build the <b>novel</b> Switch layer by hand: top-1
       $\\arg\\max$ routing (Eqn 1&ndash;2), the expert <b>capacity</b> buffer with token dropping (Eqn 3), and
       the <b>load-balancing auxiliary loss</b> $\\alpha N\\sum_i f_i P_i$ (Eqn 4&ndash;6, $\\alpha=10^{-2}$).
       The first cell recomputes the worked example ($N=2$, $T=4$ &rarr; $f=[0.75,0.25]$, $P=[0.7083,0.2917]$,
       aux $=0.012083$). Then we train the layer twice on toy tokens drawn from 4 distinct "types" (4 clusters):
       once WITH the aux loss, once WITHOUT &mdash; and print each expert's token share. CPU, a few hundred fast
       steps each. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F
import numpy as np
torch.manual_seed(0); np.random.seed(0)

# --- 0. Worked example: router softmax -> top-1 pick -> aux loss, N=2, T=4. ---
logits = torch.tensor([[2.,0.],[1.,0.],[0.,1.],[3.,0.]])   # 4 tokens, 2 experts
N = 2; T = logits.shape[0]
p = F.softmax(logits, dim=1)
pick = p.argmax(dim=1)                                      # top-1 (argmax)
f = torch.stack([(pick==i).float().mean() for i in range(N)])   # Eqn 5
P = p.mean(dim=0)                                           # Eqn 6
alpha = 1e-2
aux = alpha * N * (f*P).sum()                              # Eqn 4
print("router probs:\\n", np.round(p.numpy(),4))
print("top-1 picks:", pick.tolist())
print("f =", np.round(f.numpy(),4), " P =", np.round(P.numpy(),4))
print("aux loss = alpha*N*sum(f*P) =", round(aux.item(),6))
# router probs: [[0.8808 0.1192][0.7311 0.2689][0.2689 0.7311][0.9526 0.0474]]
# top-1 picks: [0, 0, 1, 0]
# f = [0.75 0.25]  P = [0.7083 0.2917]   aux loss = 0.012083

# --- 1. The Switch (MoE) layer: top-1 routing + capacity + aux loss, by hand. ---
class SwitchFFN(nn.Module):
    def __init__(self, d_model, d_ff, n_experts, capacity_factor=1.25, use_aux=True, alpha=1e-2):
        super().__init__()
        self.N, self.cf, self.use_aux, self.alpha = n_experts, capacity_factor, use_aux, alpha
        self.router = nn.Linear(d_model, n_experts, bias=False)          # Eqn 1: h(x)=W_r x
        self.experts = nn.ModuleList([nn.Sequential(
            nn.Linear(d_model, d_ff), nn.ReLU(), nn.Linear(d_ff, d_model))
            for _ in range(n_experts)])
    def forward(self, x):                                  # x: (tokens, d_model)
        T = x.shape[0]
        p = F.softmax(self.router(x), dim=1)               # Eqn 1
        pick = p.argmax(dim=1)                             # top-1 route
        gate = p.gather(1, pick[:,None]).squeeze(1)         # chosen prob (Eqn 2 scale)
        capacity = int((T / self.N) * self.cf)             # Eqn 3
        out = torch.zeros_like(x); counts = torch.zeros(self.N); dropped = 0
        for i in range(self.N):
            idx = (pick==i).nonzero(as_tuple=True)[0]
            counts[i] = idx.numel()
            keep = idx[:capacity]                          # drop overflow past capacity
            dropped += max(0, idx.numel()-capacity)
            if keep.numel():                               # Eqn 2: y = p_i(x) * E_i(x)
                out[keep] = gate[keep,None] * self.experts[i](x[keep])
        f = torch.stack([(pick==i).float().mean() for i in range(self.N)])   # Eqn 5
        P = p.mean(dim=0)                                                    # Eqn 6
        aux = self.alpha * self.N * (f*P).sum() if self.use_aux else x.new_zeros(())  # Eqn 4
        return out, aux, counts, dropped

# --- 2. Toy data: 4 token "types" (4 clusters); each should learn a type-specific target. ---
d_model, d_ff, N_EXP, n_types = 16, 32, 4, 4
centers = torch.randn(n_types, d_model) * 3.0
targets = torch.randn(n_types, d_model)
def make_batch(n=64):
    xs = [centers[t] + 0.3*torch.randn(n, d_model) for t in range(n_types)]
    y  = torch.tensor(sum([[t]*n for t in range(n_types)], []))
    x  = torch.cat(xs, 0); perm = torch.randperm(x.shape[0])
    return x[perm], y[perm]

def train(use_aux, steps=600):
    torch.manual_seed(1); np.random.seed(1)
    layer = SwitchFFN(d_model, d_ff, N_EXP, use_aux=use_aux)
    opt = torch.optim.Adam(layer.parameters(), lr=1e-2)
    for _ in range(steps):
        x, y = make_batch()
        out, aux, counts, dropped = layer(x)
        loss = F.mse_loss(out, targets[y]) + aux           # task + balance
        opt.zero_grad(); loss.backward(); opt.step()
    x, y = make_batch()
    with torch.no_grad(): out, aux, counts, dropped = layer(x)
    return (counts/counts.sum()).numpy(), dropped

frac_aux, drop_aux = train(use_aux=True)
frac_no,  drop_no  = train(use_aux=False)
cv = lambda fr: float(np.std(fr)/np.mean(fr))              # 0 = perfectly balanced
print("\\nExpert token share (4 experts), fresh batch of 256 tokens:")
print("  WITH aux   :", np.round(frac_aux,3), " CV=%.3f"%cv(frac_aux), " dropped=", drop_aux)
print("  WITHOUT aux:", np.round(frac_no,3),  " CV=%.3f"%cv(frac_no),  " dropped=", drop_no)
# WITH aux   : [0.25  0.25  0.191 0.309]  CV=0.166  dropped= 0
# WITHOUT aux: [0.    0.25  0.75  0.   ]   CV=1.225  dropped= 112
# (Our small run, not the paper's reported numbers. Exact values vary by seed/hardware.)`
  };

  window.CODEVIZ["paper-switch-transformer"] = {
    question: "Does the load-balancing auxiliary loss actually even out how many tokens each expert receives?",
    charts: [
      {
        type: "bar",
        title: "Per-expert token share after training — WITH vs WITHOUT the load-balancing aux loss (4 experts)",
        xlabel: "expert index",
        ylabel: "fraction of tokens routed to this expert",
        series: [
          { name: "WITH aux loss", color: "#7ee787", points: [["E0",0.250],["E1",0.250],["E2",0.191],["E3",0.309]] },
          { name: "WITHOUT aux loss", color: "#ff7b72", points: [["E0",0.000],["E1",0.250],["E2",0.750],["E3",0.000]] }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A 4-expert Switch layer (top-1 routing, capacity factor 1.25) trained on toy tokens from 4 distinct types. WITHOUT the load-balancing aux loss, routing COLLAPSES: expert E2 grabs 75% of tokens while E0 and E3 go dead at 0% (coefficient of variation 1.225, 112 tokens dropped past capacity). WITH the aux loss &alpha;&middot;N&middot;&Sigma; f_i&middot;P_i (&alpha;=0.01), all four experts land near the ideal 25% (CV 0.166, 0 dropped). The auxiliary loss is exactly what makes a sparse Mixture-of-Experts layer use its full capacity instead of collapsing onto a few experts.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
torch.manual_seed(0); np.random.seed(0)

class SwitchFFN(nn.Module):
    def __init__(self, d_model, d_ff, n, cf=1.25, use_aux=True, alpha=1e-2):
        super().__init__()
        self.N, self.cf, self.use_aux, self.alpha = n, cf, use_aux, alpha
        self.router = nn.Linear(d_model, n, bias=False)
        self.experts = nn.ModuleList([nn.Sequential(
            nn.Linear(d_model,d_ff), nn.ReLU(), nn.Linear(d_ff,d_model)) for _ in range(n)])
    def forward(self, x):
        T = x.shape[0]
        p = F.softmax(self.router(x), dim=1); pick = p.argmax(1)
        gate = p.gather(1, pick[:,None]).squeeze(1)
        cap = int((T/self.N)*self.cf)
        out = torch.zeros_like(x); counts = torch.zeros(self.N); dropped = 0
        for i in range(self.N):
            idx = (pick==i).nonzero(as_tuple=True)[0]; counts[i] = idx.numel()
            keep = idx[:cap]; dropped += max(0, idx.numel()-cap)
            if keep.numel(): out[keep] = gate[keep,None]*self.experts[i](x[keep])
        f = torch.stack([(pick==i).float().mean() for i in range(self.N)])
        P = p.mean(0)
        aux = self.alpha*self.N*(f*P).sum() if self.use_aux else x.new_zeros(())
        return out, aux, counts, dropped

d_model,d_ff,N_EXP,n_types = 16,32,4,4
centers = torch.randn(n_types,d_model)*3.0; targets = torch.randn(n_types,d_model)
def make_batch(n=64):
    xs = [centers[t]+0.3*torch.randn(n,d_model) for t in range(n_types)]
    y = torch.tensor(sum([[t]*n for t in range(n_types)],[])); x = torch.cat(xs,0)
    perm = torch.randperm(x.shape[0]); return x[perm], y[perm]

def train(use_aux, steps=600):
    torch.manual_seed(1); np.random.seed(1)
    layer = SwitchFFN(d_model,d_ff,N_EXP,use_aux=use_aux)
    opt = torch.optim.Adam(layer.parameters(), lr=1e-2)
    for _ in range(steps):
        x,y = make_batch(); out,aux,c,d = layer(x)
        loss = F.mse_loss(out,targets[y])+aux
        opt.zero_grad(); loss.backward(); opt.step()
    x,y = make_batch()
    with torch.no_grad(): out,aux,c,d = layer(x)
    return (c/c.sum()).numpy(), d

fa, da = train(True); fn, dn = train(False)
cv = lambda fr: float(np.std(fr)/np.mean(fr))
print("WITH aux   :", [round(v,3) for v in fa], "CV=%.3f"%cv(fa), "dropped", da)
print("WITHOUT aux:", [round(v,3) for v in fn], "CV=%.3f"%cv(fn), "dropped", dn)
# WITH aux   : [0.25, 0.25, 0.191, 0.309] CV=0.166 dropped 0
# WITHOUT aux: [0.0, 0.25, 0.75, 0.0]     CV=1.225 dropped 112
# Our small run, not the paper's number.`
  };
})();
