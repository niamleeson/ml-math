/* Paper lesson — Rotary Position Embedding / RoPE (Su et al., RoFormer, 2021).
   Grounded from arXiv:2104.09864 (abstract + ar5iv HTML: 2-D form Eq. 12-13, block-diagonal
   matrix + theta_i Eq. 15, relative-position inner product Eq. 16, efficient form Eq. 34).
   Track A (primitive): build RoPE from scratch with raw torch (rotate q,k in 2-D subspace pairs by
   position-dependent angles), VERIFY the relative-position property numerically
   (q_m . k_n depends only on m-n) with torch.allclose, then use it inside a tiny attention.
   conceptLink mod-transformer. Self-contained: lesson + CODE + CODEVIZ merged by id "paper-rope". */
(function () {
  window.LESSONS.push({
    id: "paper-rope",
    title: "RoPE — RoFormer: Rotary Position Embedding (2021)",
    tagline: "Rotate each query and key vector by an angle proportional to its position, so attention scores depend only on the relative distance between two tokens — never their absolute positions.",
    module: "Papers · Transformers & LLMs",
    track: "primitive",

    paper: {
      authors: "Jianlin Su, Yu Lu, Shengfeng Pan, Ahmed Murtadha, Bo Wen, Yunfeng Liu",
      org: "Zhuiyi Technology Co., Ltd., Shenzhen",
      year: 2021,
      venue: "arXiv preprint (arXiv:2104.09864, cs.CL)",
      citations: "",
      arxiv: "https://arxiv.org/abs/2104.09864",
      code: "https://github.com/ZhuiyiTechnology/roformer"
    },

    conceptLink: "mod-transformer",
    partOf: [],
    prereqs: ["mod-transformer", "paper-attention", "dl-attention", "pt-autograd"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> A Transformer reads a whole sentence at once. Its core operation,
       <b>self-attention</b>, compares every token to every other token by a <b>dot product</b> of their
       <b>query</b> and <b>key</b> vectors (a query is the "what am I looking for" vector for one token; a key
       is the "what do I offer" vector for another). See <code>dl-attention</code> and
       <code>mod-transformer</code>. But that dot product is the same no matter where the tokens sit &mdash;
       attention by itself is <b>position-blind</b>. "the dog chased the cat" and "the cat chased the dog" look
       identical to it. So the model must be <i>told</i> each token's position somehow.</p>
       <p><b>What the older fix got wrong.</b> The original Transformer <b>added</b> a fixed
       "position vector" (sinusoidal positional encoding) to each token's embedding before attention. The paper
       (Section 1, Section 3.1) notes the limits of this <b>additive, absolute</b> approach: it injects the
       <i>absolute</i> index of a token, yet what attention really cares about is the <b>relative</b> distance
       between two tokens (how far apart they are), and an additive code does not give a clean way to make the
       attention score depend purely on that distance.</p>`,

    contribution:
      `<p>RoPE (Rotary Position Embedding) changes <b>how</b> position enters: not by adding a vector, but by
       <b>rotating</b> the query and key. Its contributions (Abstract, Section 3):</p>
       <ul>
         <li><b>Rotate instead of add.</b> Multiply each token's query/key vector by a position-dependent
         <b>rotation matrix</b>: a token at position $m$ has its vector turned by an angle proportional to $m$.
         Rotation changes a vector's <i>direction</i> but never its <i>length</i>.</li>
         <li><b>Relative position falls out for free.</b> Because a rotation by $m$ followed by an un-rotation
         then a rotation by $n$ composes into a single rotation by $n-m$, the dot product of a rotated query at
         position $m$ with a rotated key at position $n$ depends <b>only on $m-n$</b> &mdash; the relative
         distance &mdash; not on $m$ or $n$ separately (Eq. 16).</li>
         <li><b>A simple, cheap recipe.</b> Split the $d$-dimensional vector into $d/2$ coordinate <b>pairs</b>,
         give each pair its own rotation speed $\\theta_i$, and rotate every pair. It plugs straight into
         existing attention with an elementwise cos/sin trick (Eq. 34) and adds almost no cost.</li>
       </ul>`,

    whyItMattered:
      `<p>RoPE became the position scheme inside most modern large language models &mdash; the LLaMA family,
       GPT-NeoX, PaLM, Mistral, Qwen and many others use it. It is popular because relative position is built
       in by construction, it adds no learned parameters, and it <b>extrapolates</b>: a model trained on short
       sequences can be pushed to longer ones by stretching the rotation angles. Wherever you see "rotary
       embeddings" in a modern Transformer, this is the paper. (Adoption is widely reported; specific downstream
       results are omitted here unless quoted from the paper itself.)</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Section 3.1, the 2-D case (Eqs. 12&ndash;13)</b> &mdash; the whole idea in two dimensions: a
         query/key vector turned by the $2\\times2$ rotation matrix $\\begin{psmallmatrix}\\cos m\\theta &amp;
         -\\sin m\\theta\\\\ \\sin m\\theta &amp; \\cos m\\theta\\end{psmallmatrix}$. Understand this and you
         understand RoPE.</li>
         <li><b>Section 3.2, the general $d$-dim form (Eq. 15)</b> &mdash; stack $d/2$ of those $2\\times2$
         blocks along the diagonal, each with its own frequency $\\theta_i=10000^{-2(i-1)/d}$.</li>
         <li><b>The relative-position identity (Eq. 16)</b> &mdash; the one line that shows the attention score
         is a function of $m-n$ only. This is the payoff.</li>
         <li><b>Section 3.4.2, the efficient implementation (Eq. 34)</b> &mdash; the elementwise cos/sin form
         with the $[-x_2,x_1,-x_4,x_3,\\dots]$ swap-and-negate trick, which is how you actually code it.</li>
       </ul>
       <p><b>Skim:</b> Section 3.3 (long-term decay property) and the experiment tables &mdash; you do not need
       the per-task numbers to implement RoPE.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> Take a fixed query vector and a fixed key vector. Rotate the query by its
       position $m$ and the key by its position $n$, then take their dot product. Now try several different
       $(m,n)$ pairs that all have the <b>same difference</b> $m-n=-3$ (say $(2,5)$, $(0,3)$, $(7,10)$). Will
       the dot product be the <b>same number</b> for all of them, or will it change as the absolute positions
       move? Write your guess, then check the <code>allclose</code> in the CODE cell.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write <code>rope_2d(v, pos, theta)</code> for the simplest case:
       a 2-D vector <code>v=[v0,v1]</code> at integer position <code>pos</code>, rotated by angle
       <code>pos*theta</code>, using raw tensors (no library helper):</p>
       <ul>
         <li>Compute the angle <code>a = pos*theta</code>, then <code>c=cos(a)</code>, <code>s=sin(a)</code>.</li>
         <li>Apply the $2\\times2$ rotation:
         <code># TODO: return [c*v0 - s*v1,  s*v0 + c*v1]</code> &mdash; note the minus sign on the top row.</li>
       </ul>
       <p>Then write the check: pick a fixed query <code>q</code> and key <code>k</code>; for several
       <code>(m,n)</code> with the same <code>m-n</code>, compute
       <code>dot(rope_2d(q,m,theta), rope_2d(k,n,theta))</code> and confirm they are all equal with
       <code>torch.allclose</code>. The CODE cell is the full reference, including the general $d$-dimensional
       paired version and a tiny attention that uses it.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p><b>Start in 2-D.</b> Forget the full vector for a moment and look at just <b>two</b> coordinates of a
       query vector, written as a point $(x_1,x_2)$ in a plane. RoPE <b>spins that point around the origin</b>
       by an angle equal to its position times a fixed speed: a token at position $m$ turns by $m\\theta$. The
       turn is done by the standard $2\\times2$ rotation matrix (Eq. 13). Spinning changes the point's
       <i>direction</i> but not its <i>distance from the origin</i> (its length), because rotation is
       length-preserving.</p>
       <p><b>Why relative position appears.</b> Two facts about rotations do all the work:</p>
       <ol>
         <li><b>Rotations compose by adding angles.</b> Turn by angle $\\alpha$, then by $\\beta$, and you have
         turned by $\\alpha+\\beta$.</li>
         <li><b>The transpose of a rotation is the reverse rotation.</b> The matrix that turns by $-\\alpha$ is
         exactly the transpose of the one that turns by $\\alpha$ (rotations are <b>orthogonal</b> matrices,
         so $R^\\top R = I$).</li>
       </ol>
       <p>An attention score is a dot product $q_m^\\top k_n$. Write the rotated query as $R_m q$ (turn $q$ by
       $m\\theta$) and the rotated key as $R_n k$. Then
       $(R_m q)^\\top (R_n k) = q^\\top R_m^\\top R_n\\, k = q^\\top R_{n-m}\\, k$: the un-turn by $m$ and the
       turn by $n$ merge into a single turn by $n-m$. So the score depends on $q$, $k$, and the
       <b>relative distance $m-n$ only</b> &mdash; the absolute positions $m$ and $n$ have cancelled (Eq. 16).
       Geometrically: rotating both vectors by the same extra amount does not change the angle <i>between</i>
       them, and the score only ever saw that in-between angle.</p>
       <p><b>From 2-D to $d$ dimensions.</b> A real query has $d$ coordinates, not 2. RoPE <b>pairs them up</b>:
       coordinates $(1,2)$ form one plane, $(3,4)$ the next, and so on &mdash; $d/2$ planes in all. Each plane
       gets its own rotation speed $\\theta_i = 10000^{-2(i-1)/d}$: early pairs spin fast (short wavelength),
       later pairs spin slowly (long wavelength), so different pairs encode position at different scales &mdash;
       just like the digits of a clock. Rotating every pair is the same as multiplying by one big
       <b>block-diagonal</b> matrix $R^d_{\\Theta,m}$ (Eq. 15), and the relative-position cancellation holds
       block by block, so it holds for the whole vector.</p>`,

    architecture:
      `<p><b>Where RoPE sits in a Transformer.</b> RoPE is not a new layer &mdash; it is a fixed transform
       inserted <i>inside</i> each self-attention head, between the query/key projections and the score
       dot-product. Nothing else in the Transformer changes.</p>
       <p><b>Data flow through one attention head</b> (sequence of $T$ tokens, model width $d$):</p>
       <ol>
         <li><b>Input.</b> Token embeddings $x_1,\\dots,x_T$, each a $d$-vector. Unlike sinusoidal encoding,
         <b>no position vector is added here</b> &mdash; the embeddings stay position-free.</li>
         <li><b>Projections.</b> For every token, compute the query, key, value:
         $q = W_q x$, $k = W_k x$, $v = W_v x$ (the standard learned $d\\times d$ matrices).</li>
         <li><b>Rotary transform (the only new step).</b> Apply $R^d_{\\Theta,m}$ to the query and
         $R^d_{\\Theta,n}$ to the key, each at its <i>own</i> position, via the element-wise Eq. 34 form:
         $\\tilde q_m = R^d_{\\Theta,m} q_m$, $\\tilde k_n = R^d_{\\Theta,n} k_n$. The <b>value $v$ is left
         untouched.</b></li>
         <li><b>Scores.</b> Scaled dot-product $\\tilde q_m^\\top \\tilde k_n/\\sqrt{d}$; by Eq. 16 this equals
         $x_m^\\top W_q^\\top R^d_{\\Theta,n-m} W_k x_n/\\sqrt{d}$ &mdash; a function of the two contents and the
         <b>relative distance $m-n$</b> only.</li>
         <li><b>Softmax + mix.</b> Softmax the $T\\times T$ score matrix over keys, then take the weighted sum
         of the (un-rotated) values $v$ to produce each token's output.</li>
       </ol>
       <p><b>Replicated across heads and layers.</b> Every head in every layer applies the same rotary transform
       to its own $q,k$, sharing the frequency set $\\Theta=\\{\\theta_1,\\dots,\\theta_{d_h/2}\\}$ ($d_h$ = per-head
       width). <b>Parameter cost: zero</b> &mdash; the angles are fixed, not learned, so RoPE adds no weights.
       <b>Compute cost: negligible</b> &mdash; two element-wise $\\cos/\\sin$ multiplies per token. Because the
       rotation is purely relative, the same trained model can be run on sequences longer than it was trained on
       by scaling the angles (the basis for later RoPE-extension methods).</p>`,

    symbols: [
      { sym: "query / key", desc: "in attention, the query $q$ is one token's 'what am I looking for' vector; the key $k$ is another token's 'what do I offer' vector. Their dot product is the raw attention score. See $dl\\text{-}attention$." },
      { sym: "$m,\\,n$", desc: "the integer positions (indices) of two tokens in the sequence, e.g. $m=3$ means the 4th token. RoPE rotates by an angle proportional to the position." },
      { sym: "$m-n$", desc: "the relative distance between the two tokens (how many steps apart they are). RoPE makes the attention score depend on this alone." },
      { sym: "$d$", desc: "the dimension of the query/key vector (number of coordinates). RoPE needs $d$ even, so it can split the coordinates into $d/2$ pairs." },
      { sym: "$\\theta_i$", desc: "the rotation speed (angular frequency) of the $i$-th coordinate pair: $\\theta_i=10000^{-2(i-1)/d}$, $i=1,\\dots,d/2$. Early pairs spin fast, later pairs slow." },
      { sym: "$m\\theta_i$", desc: "the actual angle (in radians) that pair $i$ is turned by for a token at position $m$ — position times that pair's speed." },
      { sym: "$R(\\phi)$", desc: "the $2\\times2$ rotation matrix that turns a 2-D vector by angle $\\phi$: $\\begin{psmallmatrix}\\cos\\phi & -\\sin\\phi\\\\ \\sin\\phi & \\cos\\phi\\end{psmallmatrix}$. Length-preserving." },
      { sym: "$R^d_{\\Theta,m}$", desc: "the full $d\\times d$ rotary matrix for position $m$ (Eq. 15): a block-diagonal stack of the $d/2$ small rotations $R(m\\theta_1),\\dots,R(m\\theta_{d/2})$, one per coordinate pair." },
      { sym: "orthogonal matrix", desc: "a matrix $R$ whose transpose is its inverse: $R^\\top R = I$. Rotations are orthogonal; this is exactly why $R_m^\\top R_n = R_{n-m}$." },
      { sym: "$R^\\top$", desc: "the transpose of $R$ (rows and columns swapped). For a rotation, $R(\\phi)^\\top = R(-\\phi)$ — the reverse turn." },
      { sym: "$\\Theta$", desc: "the set of all the per-pair frequencies $\\{\\theta_1,\\dots,\\theta_{d/2}\\}$." },
      { sym: "$x_m$", desc: "the raw $d$-dimensional embedding of the token at position $m$ (its content, before any position is applied). RoPE keeps these position-free." },
      { sym: "$W_q,\\,W_k,\\,W_v$", desc: "the learned projection matrices that turn an embedding $x$ into its query $W_q x$, key $W_k x$, and value $W_v x$. Standard Transformer weights; RoPE does not change them." },
      { sym: "$f_q,\\,f_k$", desc: "the position-encoding functions RoPE defines: $f_q(x_m,m)$ takes the query content $x_m$ and its position $m$ and returns the rotated query $R^d_{\\Theta,m}W_q x_m$ (likewise $f_k$ for keys)." },
      { sym: "$g$", desc: "the target function in the design requirement (Eq. 11): the inner product $\\langle f_q,f_k\\rangle$ must equal some $g(x_m,x_n,m-n)$ that uses only the contents and the relative distance." },
      { sym: "$e^{im\\theta}$", desc: "complex-exponential rotation by angle $m\\theta$ (Euler: $\\cos m\\theta + i\\sin m\\theta$). In the 2-D base case (Eq. 12), multiplying the query-as-complex-number by this is exactly the $2\\times2$ rotation." },
      { sym: "$\\odot$", desc: "the element-wise (Hadamard) product of two vectors — multiply matching entries. Used in the efficient Eq. 34 form." }
    ],

    formula:
      `$$\\langle f_q(x_m,m),\\,f_k(x_n,n)\\rangle = g(x_m,\\,x_n,\\,m-n)
        \\qquad(\\text{the design requirement, Eq. 11})$$
       <p>Demand that the dot product of the encoded query and key be some function $g$ of the two
       token contents and their <b>relative</b> distance $m-n$ only &mdash; never the absolute $m,n$.</p>
       $$f_q(x_m,m) = \\big(W_q\\,x_m\\big)\\,e^{i m\\theta},\\qquad
         f_k(x_n,n) = \\big(W_k\\,x_n\\big)\\,e^{i n\\theta}
        \\qquad(\\text{2-D base case, Eqs. 12--13})$$
       <p>The $d=2$ solution: project with $W_q$/$W_k$, treat the pair as a complex number, and multiply by
       $e^{im\\theta}$ &mdash; i.e. rotate by angle $m\\theta$.</p>
       $$R(m\\theta)=\\begin{pmatrix}\\cos m\\theta & -\\sin m\\theta\\\\[2pt] \\sin m\\theta & \\cos m\\theta\\end{pmatrix}
        \\qquad(\\text{the }2\\times2\\text{ rotation block, Eq. 13})$$
       <p>The same rotation written as a real matrix &mdash; the engine that turns a coordinate pair.</p>
       $$f_{q,k}(x_m,m) = R^d_{\\Theta,m}\\,W_{q,k}\\,x_m,\\qquad
         \\theta_i = 10000^{-2(i-1)/d},\\quad i=1,\\dots,d/2
        \\qquad(\\text{general }d\\text{-dim form + frequencies, Eqs. 14--15})$$
       <p>Project, then multiply by the block-diagonal rotary matrix $R^d_{\\Theta,m}$ (below). Each coordinate
       pair $i$ spins at its own speed $\\theta_i$.</p>
       $$R^d_{\\Theta,m}=\\begin{pmatrix}
         R(m\\theta_1) & & \\\\ & \\ddots & \\\\ & & R(m\\theta_{d/2})
       \\end{pmatrix}
        \\qquad(\\text{block-diagonal rotary matrix, Eq. 15})$$
       <p>$d/2$ of the small $2\\times2$ blocks stacked down the diagonal, one per pair.</p>
       $$q_m^\\top k_n = \\big(R^d_{\\Theta,m}W_q x_m\\big)^\\top\\big(R^d_{\\Theta,n}W_k x_n\\big)
        = x_m^\\top\\,W_q^\\top\\,R^d_{\\Theta,\\,n-m}\\,W_k\\,x_n
        \\qquad(\\text{relative-position property, Eq. 16})$$
       <p>The payoff: the two absolute rotations collapse into a single relative rotation $R^d_{\\Theta,n-m}$,
       so the attention score sees only the distance $m-n$.</p>
       $$R^d_{\\Theta,m}\\,x = x\\odot\\begin{pmatrix}\\cos m\\theta_1\\\\ \\cos m\\theta_1\\\\ \\vdots\\\\
         \\cos m\\theta_{d/2}\\\\ \\cos m\\theta_{d/2}\\end{pmatrix}
         + \\begin{pmatrix}-x_2\\\\ x_1\\\\ \\vdots\\\\ -x_d\\\\ x_{d-1}\\end{pmatrix}
         \\odot\\begin{pmatrix}\\sin m\\theta_1\\\\ \\sin m\\theta_1\\\\ \\vdots\\\\
         \\sin m\\theta_{d/2}\\\\ \\sin m\\theta_{d/2}\\end{pmatrix}
        \\qquad(\\text{efficient element-wise form, Eq. 34})$$
       <p>How you actually code it: an element-wise multiply by a $\\cos$ vector plus a swap-and-negate of $x$
       times a $\\sin$ vector &mdash; no dense matrix needed ($\\odot$ is element-wise product).</p>`,

    whatItDoes:
      `<p>The first line is the engine: a $2\\times2$ matrix that turns a coordinate pair by the angle
       $m\\theta$ (position $m$ times that pair's speed $\\theta$). The middle line sets each pair's speed so the
       pairs cover a wide range of scales. The third line is the whole point: when you rotate the query by its
       position $m$ and the key by its position $n$ and take their dot product, the two absolute positions
       collapse into the single <b>relative</b> rotation $n-m$. So the attention score between two tokens is a
       function of their contents and <b>how far apart they are</b>, never of where they sit in the sequence
       (Section 3, Eq. 16).</p>`,

    derivation:
      `<p>The cancellation rests on one identity about rotation (orthogonal) matrices: $R(\\alpha)^\\top
       R(\\beta) = R(\\beta-\\alpha)$. Proof for the $2\\times2$ case is just the angle-subtraction formulas.
       Multiply $R(\\alpha)^\\top = \\begin{psmallmatrix}\\cos\\alpha & \\sin\\alpha\\\\ -\\sin\\alpha &
       \\cos\\alpha\\end{psmallmatrix}$ by $R(\\beta)$ and use $\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta
       =\\cos(\\beta-\\alpha)$ and $\\cos\\alpha\\sin\\beta-\\sin\\alpha\\cos\\beta=\\sin(\\beta-\\alpha)$; the
       product is exactly $R(\\beta-\\alpha)$. Set $\\alpha=m\\theta$, $\\beta=n\\theta$ and you get
       $R_m^\\top R_n = R_{n-m}$. Hence $(R_m q)^\\top(R_n k)=q^\\top R_m^\\top R_n k = q^\\top R_{n-m} k$. The
       full $d$-dimensional matrix is block-diagonal, and block-diagonal matrices multiply block by block, so
       the same cancellation runs independently in every coordinate pair &mdash; the property holds for the
       whole vector. (The attention dot product itself is the machinery from <code>paper-attention</code> /
       <code>mod-transformer</code>; RoPE only changes the vectors that go into it.)</p>`,

    example:
      `<p><b>Worked numbers</b> &mdash; the simplest case, a single 2-D pair with speed $\\theta=1$. Take a
       query $q=[1,0]$ and a key $k=[0,1]$ (fixed contents). We will show the dot product depends only on
       $m-n$.</p>
       <ul>
         <li><b>At $m=2$, $n=5$ (so $m-n=-3$).</b> Rotate $q$ by $2$ rad:
         $q_2=[\\cos2,\\,\\sin2]=[-0.4161,\\,0.9093]$. Rotate $k$ by $5$ rad:
         $k_5=[-\\sin5,\\,\\cos5]=[0.9589,\\,0.2837]$. Dot product:
         $(-0.4161)(0.9589)+(0.9093)(0.2837)=-0.1411$.</li>
         <li><b>At $m=0$, $n=3$ (same $m-n=-3$).</b> $q_0=[1,0]$, $k_3=[-\\sin3,\\,\\cos3]=[-0.1411,-0.99]$.
         Dot product: $(1)(-0.1411)+(0)(-0.99)=-0.1411$. <b>Identical.</b></li>
         <li><b>At $m=7$, $n=10$ (same $m-n=-3$).</b> $q_7=[0.7539,\\,0.657]$,
         $k_{10}=[0.544,\\,-0.8391]$. Dot product:
         $(0.7539)(0.544)+(0.657)(-0.8391)=-0.1411$. <b>Identical again.</b></li>
       </ul>
       <p>Three completely different absolute positions, one shared difference $m-n=-3$, and the same score
       $-0.141120$ every time. Change the difference and the score changes; keep it fixed and the score is
       locked. The CODE cell recomputes these exact numbers and runs <code>torch.allclose</code> across many
       same-difference pairs.</p>`,

    recipe:
      `<p><b>RoPE as numbered steps</b> (query/key vector of even length $d$, at position $m$):</p>
       <ol>
         <li>Split the $d$ coordinates into $d/2$ <b>pairs</b>: $(x_1,x_2),(x_3,x_4),\\dots$.</li>
         <li>Give pair $i$ the frequency $\\theta_i=10000^{-2(i-1)/d}$ and the angle $m\\theta_i$.</li>
         <li>Rotate each pair by its angle with $R(m\\theta_i)$ (Eq. 13). In code, the cheap form (Eq. 34) is
         elementwise: $x\\odot\\cos + \\text{swap\\_negate}(x)\\odot\\sin$, where
         $\\text{swap\\_negate}([x_1,x_2,\\dots])=[-x_2,x_1,-x_4,x_3,\\dots]$.</li>
         <li>Do this to <b>both</b> the query (using its position) and the key (using its position).</li>
         <li>Feed the rotated query/key into ordinary scaled dot-product attention &mdash; nothing else
         changes. The score now depends only on relative position.</li>
       </ol>`,

    results:
      `<p>Quoted from the paper: RoPE "enables valuable properties, including the flexibility of sequence
       length, decaying inter-token dependency with increasing relative distances, and the capability of
       equipping the linear self-attention with relative position encoding" (Abstract, arXiv:2104.09864). The
       experiments report RoFormer improvements on machine-translation and GLUE-style benchmarks; we do not
       reproduce those headline numbers here to avoid misquoting. Every number in our CODE and CODEVIZ is our
       own small-scale run, not the paper's reported number.</p>`,

    evaluation:
      `<p><b>The metric &amp; baseline.</b> RoPE's defining claim is a <b>theorem</b>, not a benchmark, so
       the primary test is the <b>relative-position invariant</b>: for many $(m,n)$ pairs sharing the same
       difference $m-n$, the score $(R_m q)^\\top(R_n k)$ must be the <i>same number</i>
       ($\\texttt{torch.allclose}$, atol $\\approx 10^{-6}$). The no-skill comparison is the old
       <b>additive</b> position scheme $(q+p_m)^\\top(k+p_n)$: holding $m-n$ fixed, its score should
       <i>drift</i> as the absolute positions slide &mdash; that contrast is exactly what RoPE fixes. A
       secondary check: the rotation must preserve length, $\\lVert R_m q\\rVert=\\lVert q\\rVert$.</p>
       <ul>
         <li><b>Sanity checks before the full run.</b> Reproduce the worked numbers exactly: $q=[1,0]$,
         $k=[0,1]$, $\\theta=1$ &rarr; at $(m,n)=(2,5),(0,3),(7,10)$ every dot product is $-0.141120$;
         $q_2\\approx[-0.4161,0.9093]$, $k_5\\approx[0.9589,0.2837]$ (known-answer test). Check
         length-preservation: rotate $q=[1,2]$ and confirm the norm stays $\\sqrt5\\approx 2.236$. Verify
         the property holds in full $d$ dimensions too (rotate random 8-vectors at two pairs with the same
         $m-n$). Confirm $d$ is even and the swap-and-negate hits the <i>first</i> of each pair
         ($[-x_2,x_1,-x_4,x_3,\\dots]$).</li>
         <li><b>Expected range.</b> There is no loss to tune &mdash; correctness is binary: the
         same-difference scores must agree to atol $10^{-6}$ ($\\texttt{allclose}$ $\\texttt{True}$) and a
         <i>different</i> $m-n$ must give a different score (so the test is not trivially passing on a
         constant). In our run every same-difference RoPE score sits flat at $-0.1411$ while the additive
         scores spread across many values (our numbers, not the paper's).</li>
         <li><b>Ablation &mdash; prove the rotation earns its keep.</b> The central idea is
         <i>multiplicative</i> rotation. Swap it for the additive scheme $q+p_m$, $k+p_n$ and re-run the
         slide-both-positions test: the score must now <b>drift</b> (the cross terms $q^\\top p_n$ and
         $p_m^\\top k$ depend on absolute $m,n$). If your "additive" run also stays flat, the position
         vectors are not actually being added. A cheaper ablation: rotate the key by the <i>query's</i>
         position (or skip the key's rotation) &mdash; the $n-m$ cancellation breaks and same-difference
         scores stop matching.</li>
         <li><b>Failure signals &amp; what they mean.</b> Same-difference scores <i>almost</i> equal but
         off &rarr; sign error in the rotation (top row must be $[\\cos,-\\sin]$) or a pairing-convention
         mismatch (adjacent $(1,2)$ vs halves $(1,1{+}d/2)$ &mdash; pick one consistently). Scores match
         but the vector's norm changed &rarr; you scaled, not rotated. The property fails entirely &rarr;
         you rotated $q$ and $k$ with the <i>same</i> position, or rotated only one of them. Applying RoPE
         to the value $v$ or to the input embeddings &rarr; wrong: it lives inside attention, on $q$ and
         $k$ only.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> The rotation itself is a few lines of raw tensor math &mdash; that is what
       you build by hand: form the per-pair angles $m\\theta_i$, take cos/sin, and apply the swap-and-negate
       rotation (Eq. 34). The <i>verification</i> is the payoff: instead of an <code>nn</code> layer to copy,
       RoPE's defining property is a <b>theorem</b>, so we test the theorem directly &mdash;
       <code>torch.allclose</code> showing that $q_m\\cdot k_n$ is the <b>same number</b> for every $(m,n)$ with
       the same difference $m-n$. You then drop your rotated query/key into a tiny scaled dot-product attention
       (the plumbing is imported from the standard attention you already know) to see it work end to end.</p>`,

    pitfalls:
      `<ul>
         <li><b>Sign of the rotation &mdash; the #1 mistake.</b> The top row is $[\\cos,-\\sin]$, the bottom
         $[\\sin,\\cos]$. Flipping a sign rotates the wrong way; the relative-position property may still hold
         but it will not match the paper's convention. The elementwise form is
         $x\\cos + [-x_2,x_1,-x_4,x_3,\\dots]\\sin$ &mdash; negate the <i>first</i> of each swapped pair.</li>
         <li><b>Pairing convention.</b> The paper pairs <b>adjacent</b> coordinates $(1,2),(3,4),\\dots$. Many
         real implementations instead pair the two <b>halves</b> $(1,1{+}d/2),\\dots$; both give the same
         relative property but the cos/sin layout differs. Pick one and be consistent.</li>
         <li><b>$d$ must be even.</b> You cannot pair an odd number of coordinates.</li>
         <li><b>Rotate query AND key with their OWN positions.</b> Rotating only one, or using the same
         position for both, breaks the $n-m$ cancellation.</li>
         <li><b>RoPE is applied to $q$ and $k$, not to $v$ (the value) and not to the embeddings.</b> It lives
         <i>inside</i> attention, after the query/key projections &mdash; not added to the input like the old
         sinusoidal encoding.</li>
         <li><b>Length is preserved, direction is not.</b> Do not expect the rotated vector to equal the
         original; only its norm is unchanged.</li>
       </ul>`,

    recall: [
      "Write the 2-D rotation matrix $R(m\\theta)$ from memory — including which entry carries the minus sign.",
      "State the relative-position property in one line: $(R_m q)^\\top (R_n k) = \\,?$",
      "Why does $R_m^\\top R_n = R_{n-m}$? (Name the property of rotation matrices you used.)",
      "What is the per-pair frequency $\\theta_i$, and what does a fast vs slow pair encode?",
      "Is RoPE applied to the embeddings, or to the queries and keys? Is the value $v$ rotated?"
    ],

    practice: [
      {
        q: `Rotate the 2-D query $q=[1,2]$ for a token at position $m=3$ with frequency $\\theta=0.5$. (Give the rotated vector.)`,
        steps: [
          { do: `Angle: $m\\theta = 3\\times0.5 = 1.5$ rad. Then $\\cos1.5\\approx0.0707$, $\\sin1.5\\approx0.9975$.`, why: `Position times the pair's rotation speed.` },
          { do: `Apply $R(1.5)$: first coord $=\\cos\\cdot1 - \\sin\\cdot2 = 0.0707 - 1.995 = -1.9243$.`, why: `Top row is $[\\cos,-\\sin]$ — the minus sign sits here.` },
          { do: `Second coord $=\\sin\\cdot1 + \\cos\\cdot2 = 0.9975 + 0.1414 = 1.139$.`, why: `Bottom row is $[\\sin,\\cos]$.` }
        ],
        answer: `$q_3 \\approx [-1.9243,\\ 1.139]$. Its length is $\\sqrt{1^2+2^2}=\\sqrt5\\approx2.236$, unchanged by the rotation — only the direction moved.`
      },
      {
        q: `Show, in symbols, why the attention score between a query at position $m$ and a key at position $n$ depends only on $m-n$.`,
        steps: [
          { do: `Write the rotated vectors: query $=R_m q$, key $=R_n k$, with $R_m=R(m\\theta)$.`, why: `RoPE rotates each by its own position.` },
          { do: `Dot product: $(R_m q)^\\top (R_n k) = q^\\top R_m^\\top R_n\\, k$.`, why: `Move the transpose onto the first matrix: $(Ab)^\\top c = b^\\top A^\\top c$.` },
          { do: `Use $R_m^\\top R_n = R_{n-m}$ (rotations are orthogonal, $R(\\alpha)^\\top=R(-\\alpha)$, and rotations add).`, why: `Un-turn by $m$ then turn by $n$ = net turn by $n-m$.` }
        ],
        answer: `$(R_m q)^\\top (R_n k) = q^\\top R_{n-m}\\, k$ (Eq. 16). The absolute $m$ and $n$ have cancelled; only their difference survives.`
      },
      {
        q: `Ablation: in the CODE, replace the rotation with the OLD additive scheme — add a position vector $p_m$ to the query instead of rotating it: $q+p_m$, $k+p_n$. Does the score still depend only on $m-n$?`,
        steps: [
          { do: `Form the additive score: $(q+p_m)^\\top(k+p_n) = q^\\top k + q^\\top p_n + p_m^\\top k + p_m^\\top p_n$.`, why: `Expand the dot product of the two sums.` },
          { do: `Inspect the cross terms $q^\\top p_n$ and $p_m^\\top k$: each depends on a single absolute position ($n$ alone, $m$ alone), not on the difference.`, why: `There is no algebraic identity collapsing them to $m-n$.` },
          { do: `Run it: hold $m-n$ fixed but slide $m,n$ up together; the additive score CHANGES, the RoPE score does NOT.`, why: `Only the multiplicative rotation enjoys the $R_m^\\top R_n=R_{n-m}$ cancellation.` }
        ],
        answer: `No. The additive scheme leaves cross terms that depend on absolute $m$ and $n$ separately, so the score drifts as you slide both positions even with $m-n$ fixed. RoPE's multiplicative rotation is exactly what makes the absolute positions cancel — that is the contribution. (Our small run: the additive scores spread across many values while every same-difference RoPE score is identical.)`
      }
    ]
  });

  window.CODE["paper-rope"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build RoPE from scratch with raw torch. Step 1: a 2-D rotation rope_2d(v, pos, theta). VERIFY the ` +
      `paper's defining property — for many (m,n) pairs sharing the SAME difference m-n, the dot product ` +
      `rope_2d(q,m).rope_2d(k,n) is the SAME number (torch.allclose). Step 2: the general d-dim paired form ` +
      `via the elementwise cos/sin + swap-negate trick (Eq. 34), verified the same way. Step 3: drop the ` +
      `rotated q,k into a tiny scaled dot-product attention. Recomputes the [1,0]/[0,1], theta=1 worked ` +
      `example. Runs in Colab (torch is preinstalled).`,
    code: `import torch, torch.nn.functional as F

torch.manual_seed(0)

# ---------- Step 1: RoPE in 2-D, from scratch (Eq. 13) ----------
def rope_2d(v, pos, theta=1.0):
    """Rotate a 2-D vector v=[v0,v1] by angle pos*theta. Top row [cos,-sin], bottom [sin,cos]."""
    a = pos * theta
    c, s = torch.cos(a), torch.sin(a)
    v0, v1 = v[0], v[1]
    return torch.stack([c*v0 - s*v1,   # note the MINUS sign (top row)
                        s*v0 + c*v1])

# ---- THE ORACLE: q_m . k_n depends ONLY on (m - n) ----
q = torch.tensor([1.0, 0.0])
k = torch.tensor([0.0, 1.0])
theta = torch.tensor(1.0)

# many (m, n) pairs that all share the SAME difference m - n = -3
pairs = [(0,3), (2,5), (7,10), (100,103), (1,4)]
scores = []
for m, n in pairs:
    qm = rope_2d(q, torch.tensor(float(m)), theta)
    kn = rope_2d(k, torch.tensor(float(n)), theta)
    scores.append(torch.dot(qm, kn))
scores = torch.stack(scores)
print("scores for m-n=-3 pairs:", [round(x.item(), 6) for x in scores])
same = torch.allclose(scores, scores[0].expand_as(scores), atol=1e-6)
print("all equal (depends only on m-n)?", same)        # expect True  -> ~ -0.141120

# a DIFFERENT difference gives a DIFFERENT (but internally consistent) score
sc2 = torch.dot(rope_2d(q, torch.tensor(0.), theta), rope_2d(k, torch.tensor(1.), theta))
print("score for m-n=-1:", round(sc2.item(), 6), "(differs from -0.1411, as it should)")

# recompute the WORKED EXAMPLE numbers exactly
print("q_2 =", [round(x,4) for x in rope_2d(q, torch.tensor(2.), theta).tolist()])  # [-0.4161, 0.9093]
print("k_5 =", [round(x,4) for x in rope_2d(k, torch.tensor(5.), theta).tolist()])  # [ 0.9589, 0.2837]

# ---------- Step 2: general d-dim RoPE via the elementwise trick (Eq. 34) ----------
def rope(x, pos, base=10000.0):
    """x: (..., d) with d even. pos: scalar position. Pairs adjacent coords (Eq. 15)."""
    d = x.shape[-1]
    i = torch.arange(0, d, 2, dtype=x.dtype)           # 0,2,4,...
    theta = base ** (-(i) / d)                          # theta_i = 10000^{-2(i-1)/d}
    ang = pos * theta                                   # angle per pair
    cos = torch.repeat_interleave(torch.cos(ang), 2)   # [c1,c1,c2,c2,...]
    sin = torch.repeat_interleave(torch.sin(ang), 2)
    x1, x2 = x[..., 0::2], x[..., 1::2]
    swap = torch.stack([-x2, x1], dim=-1).reshape(x.shape)  # [-x2,x1,-x4,x3,...]
    return x * cos + swap * sin

# verify the relative property in d dimensions too
qd = torch.randn(8); kd = torch.randn(8)
s_a = torch.dot(rope(qd, torch.tensor(2.)), rope(kd, torch.tensor(5.)))   # m-n=-3
s_b = torch.dot(rope(qd, torch.tensor(9.)), rope(kd, torch.tensor(12.)))  # m-n=-3
print("d=8 relative property holds:", torch.allclose(s_a, s_b, atol=1e-5))  # expect True

# ---------- Step 3: use RoPE inside a tiny scaled dot-product attention ----------
T, d = 4, 8
Q = torch.randn(T, d); K = torch.randn(T, d); V = torch.randn(T, d)
Qr = torch.stack([rope(Q[p], torch.tensor(float(p))) for p in range(T)])  # rotate by position
Kr = torch.stack([rope(K[p], torch.tensor(float(p))) for p in range(T)])
attn = F.softmax((Qr @ Kr.T) / d**0.5, dim=-1)
out  = attn @ V
print("attention output shape:", out.shape)            # torch.Size([4, 8])`
  };

  window.CODEVIZ["paper-rope"] = {
    question: "Hold the relative distance m-n fixed and slide both absolute positions up together. RoPE's attention score should stay flat (depends only on m-n); the old ADDITIVE position scheme should drift (depends on absolute m,n). Does it?",
    charts: [
      {
        type: "line",
        title: "Query/key score as both positions slide up (relative distance fixed at m-n = -3)",
        xlabel: "absolute query position m  (key position n = m + 3)",
        ylabel: "dot-product score",
        series: [
          {
            name: "RoPE (rotate) — flat: depends only on m-n",
            color: "#7ee787",
            points: [[0,-0.1411],[1,-0.1411],[2,-0.1411],[3,-0.1411],[4,-0.1411],[5,-0.1411],[6,-0.1411],[7,-0.1411],[8,-0.1411],[9,-0.1411]]
          },
          {
            name: "Additive position code — drifts: depends on absolute m,n",
            color: "#ff7b72",
            points: [[0,1.2107],[1,-1.1823],[2,0.0871],[3,-4.617],[4,-0.7079],[5,-0.1768],[6,-0.9923],[7,-1.7013],[8,-0.7306],[9,2.4159]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (torch, seed 0), not the paper's reported numbers. A fixed 2-D query and key are scored at relative distance m-n = -3 while both absolute positions slide from 0 upward. GREEN (RoPE): the score is a perfectly flat line at -0.1411 — rotating both vectors by their positions makes the absolute positions cancel, leaving only the relative distance, exactly the paper's Eq. 16. RED (old additive scheme, q+p_m): the score wanders as the absolute positions grow, because additive cross terms q.p_n and p_m.k depend on m and n separately. This flat-vs-wandering contrast IS RoPE's contribution.",
    code: `import numpy as np
rng = np.random.default_rng(0)

def rope_2d(v, pos, theta=1.0):
    a = pos * theta
    c, s = np.cos(a), np.sin(a)
    return np.array([c*v[0]-s*v[1], s*v[0]+c*v[1]])

q = np.array([1.0, 0.0]); k = np.array([0.0, 1.0])
# old additive scheme: a fixed pseudo-random position vector per index
P = rng.normal(0, 1, (64, 2))

rope_scores, add_scores = [], []
for m in range(10):
    n = m + 3                                   # relative distance fixed at -3
    # RoPE: rotate each by its own position, then dot
    rope_scores.append(float(rope_2d(q, m) @ rope_2d(k, n)))
    # additive: add a position vector, then dot
    add_scores.append(float((q + P[m]) @ (k + P[n])))

print("RoPE  (flat):", [round(x,4) for x in rope_scores])   # all ~ -0.1411
print("Add   (drift):", [round(x,4) for x in add_scores])   # varies with m
print("RoPE all equal?", max(rope_scores)-min(rope_scores) < 1e-5)  # True`
  };
})();
