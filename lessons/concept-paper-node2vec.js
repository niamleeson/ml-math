/* Paper lesson — "node2vec: Scalable Feature Learning for Networks", Grover & Leskovec, KDD 2016.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-node2vec".
   GROUNDED from arXiv:1607.00653 via the ar5iv HTML mirror: the 2nd-order BIASED random-walk
   search bias alpha_pq(t,x) (Section 3.2.2, the 1/p, 1, 1/q cases), the skip-gram feature objective
   (Section 3.1, Eqns 1-3 with partition function Z_u), and the BFS<->structural-equivalence /
   DFS<->homophily framing (Section 3.1). Track B (architecture): build the biased-walk transition
   probabilities + skip-gram (negative sampling) by hand on a tiny graph and SHOW that p,q change the
   embedding (homophily vs structural equivalence). conceptLink = mod-gnn (message-passing/graph recap).
   Cross-links paper-deepwalk (the unbiased predecessor) and paper-word2vec (the skip-gram it reuses). */
(function () {
  window.LESSONS.push({
    id: "paper-node2vec",
    title: "node2vec — Scalable Feature Learning for Networks (2016)",
    tagline: "Bias the random walk with two knobs (return p, in-out q) so it interpolates between breadth-first and depth-first exploration, then run skip-gram on the walks to learn node embeddings.",
    module: "Papers · Graph Neural Networks",
    track: "architecture",
    paper: {
      authors: "Aditya Grover, Jure Leskovec",
      org: "Stanford University",
      year: 2016,
      venue: "arXiv:1607.00653 (Jul 2016); KDD '16 (ACM SIGKDD)",
      citations: "", // no citation count shown on the fetched ar5iv page — omitted to avoid inventing one
      arxiv: "https://arxiv.org/abs/1607.00653",
      code: "https://github.com/aditya-grover/node2vec"
    },
    conceptLink: "mod-gnn",
    partOf: [],
    prereqs: ["mod-gnn", "paper-word2vec", "dl-word-embeddings", "ml-softmax"],

    // WHY READ IT
    problem:
      `<p>A <b>graph</b> (also called a <b>network</b>) is a set of <b>nodes</b> &mdash; think each user in a
       social network, each page on a website &mdash; joined by <b>edges</b> (a friendship, a link). A
       <b>node embedding</b> is a short list of numbers, a vector, that summarizes a node so a plain
       downstream model (say a logistic-regression classifier) can use it to guess the node's label or
       whether two nodes should be linked. The question: how do you turn a node's <i>position in the graph</i>
       into such a vector?</p>
       <p>An earlier method, <b>DeepWalk</b> (see <code>paper-deepwalk</code>), took plain <b>random walks</b>
       &mdash; start at a node, repeatedly step to a uniformly-random neighbor &mdash; treated each walk as a
       "sentence" of nodes, and fed those sentences to <b>word2vec</b> (<code>paper-word2vec</code>). It worked,
       but the walk was <b>rigid</b>: one fixed, unbiased sampling strategy. The node2vec authors argue
       (&sect;1) that a single rigid notion of "neighborhood" cannot capture the two <i>different</i> kinds of
       similarity real networks contain:</p>
       <ul>
        <li><b>Homophily</b> &mdash; nodes in the same tightly-knit <b>community</b> should embed near each
        other (two friends in the same friend-group).</li>
        <li><b>Structural equivalence</b> &mdash; nodes that play the same <b>role</b> should embed near each
        other <i>even if they are far apart</i> (two "hub" nodes in different communities).</li>
       </ul>
       <p>Their complaint: prior walk-based methods give you no <b>control</b> over which of these the
       embedding captures.</p>`,
    contribution:
      `<ul>
        <li><b>A flexible, biased random walk.</b> node2vec replaces the uniform-random next-step with a
        <b>2nd-order</b> walk (it remembers the <i>previous</i> node, not just the current one) governed by
        two numbers: the <b>return parameter</b> $p$ and the <b>in-out parameter</b> $q$. They tilt each step
        toward going <i>back</i>, staying <i>local</i> (breadth-first-like, "BFS"), or wandering <i>outward</i>
        (depth-first-like, "DFS").</li>
        <li><b>One knob spans BFS&hellip;DFS.</b> The paper shows $p,q$ "smoothly interpolate between BFS and
        DFS" (&sect;3), so a single algorithm can be tuned to recover <b>homophily</b> at one extreme and
        <b>structural equivalence</b> at the other &mdash; you pick which similarity you want.</li>
        <li><b>Reuse skip-gram.</b> Once the biased walks are sampled, the embedding is learned with the same
        <b>skip-gram</b> objective from word2vec (&sect;3.1): make a node's vector predict the nodes that
        co-occur with it on the walks.</li>
      </ul>`,
    whyItMattered:
      `<p>node2vec became a default baseline for <b>unsupervised graph embeddings</b>: it is simple (walks +
       skip-gram), scalable, and &mdash; uniquely &mdash; <b>tunable</b> between community-based and role-based
       similarity by turning two dials. It generalizes <b>DeepWalk</b> (<code>paper-deepwalk</code>), which is
       the special case $p{=}q{=}1$ (an unbiased walk), and it cemented the "random-walk-as-sentence +
       word2vec" recipe before message-passing graph neural networks (recapped in <code>mod-gnn</code>; see
       also <code>paper-graphsage</code>) took over. The $p,q$ idea &mdash; explicitly choosing your notion of
       neighborhood &mdash; still shapes how people think about what a graph embedding should preserve.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.1 (Feature learning framework)</b> &mdash; the skip-gram objective: Eqn. (1), the two
        simplifying assumptions, and the resulting Eqn. (2) with the partition function $Z_u$. This is the
        word2vec loss, restated for graphs.</li>
        <li><b>&sect;3.1 (Search strategies) + Figure 2</b> &mdash; the BFS-vs-DFS picture and which one
        corresponds to <b>structural equivalence</b> vs <b>homophily</b>. Read this paragraph twice; it is the
        intuition the whole method is built to control.</li>
        <li><b>&sect;3.2.2 (node2vec walk / "Search bias $\\alpha$")</b> &mdash; the heart of the paper: the
        2nd-order transition with the $1/p,\\,1,\\,1/q$ cases (the equation you will transcribe and implement).
        Note Figure 3, the little triangle that shows the three move types.</li>
       </ul>
       <p><b>Skim:</b> &sect;3.2.1 (general random-walk setup), &sect;3.3 (the full algorithm pseudocode is
       worth one glance), and the experiments (&sect;4) on the first pass &mdash; come back for the
       BlogCatalog / Wikipedia / link-prediction tables once the walk makes sense.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will run the biased walk twice on the same graph: once with a <b>large $q$</b> (the
       <b>in-out parameter</b>; large $q$ makes far/outward steps <i>unlikely</i>, so the walk hugs the start
       node's immediate neighborhood &mdash; BFS-like), and once with a <b>small $q$</b> (far steps become
       likely, so the walk wanders outward &mdash; DFS-like). One regime will tend to place nodes that sit in
       the <b>same tight community</b> close together (homophily); the other will tend to place nodes that play
       the <b>same structural role</b> close together (structural equivalence). <b>Which regime gives which?</b>
       Write your guess and one sentence of why before running. (Hint: the paper ties one walk type to
       homophily and the other to structural equivalence in &sect;3.1.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the <b>one-step transition</b>. You are at node $v$, you arrived from node
       $t$, and you are choosing the next node $x$ among $v$'s neighbors. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>TODO &mdash; compute $d_{tx}$, the <b>shortest-path distance from $t$ to the candidate $x$</b>. It is
        one of three values: $0$ (the candidate <i>is</i> $t$ &mdash; going back), $1$ ($x$ is also a neighbor
        of $t$ &mdash; staying local), or $2$ ($x$ is one hop farther out).</li>
        <li>TODO &mdash; set the <b>unnormalized weight</b> $\\alpha$: use $1/p$ if $d_{tx}{=}0$, $1$ if
        $d_{tx}{=}1$, $1/q$ if $d_{tx}{=}2$.</li>
        <li>TODO &mdash; multiply by the edge weight $w_{vx}$ (here all $1$), then <b>normalize</b> the
        $\\alpha\\,w$ values over all candidates $x$ to get a probability distribution; sample the next node.</li>
       </ul>
       <p>Then run skip-gram on the sampled walks and check whether the embedding's nearest-neighbor structure
       changes when you swap $p,q$.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>node2vec has two stages. <b>Stage 1 &mdash; sample biased walks.</b> <b>Stage 2 &mdash; run
       skip-gram on them.</b> Stage 2 is exactly word2vec (<code>paper-word2vec</code>); the new idea is all in
       Stage 1's <i>bias</i>.</p>
       <p><b>The 2nd-order walk (&sect;3.2.2).</b> An ordinary random walk is <b>1st-order</b>: the next step
       depends only on where you are <i>now</i>. node2vec makes the walk <b>2nd-order</b> &mdash; it also
       remembers the node you <i>just came from</i>. Say the walk just traversed the edge $(t,v)$ and now sits
       at $v$. To pick the next node $x$ (a neighbor of $v$), it assigns each candidate an <b>unnormalized
       transition weight</b> $\\pi_{vx} = \\alpha_{pq}(t,x)\\cdot w_{vx}$, where $w_{vx}$ is the edge weight
       (1 for an unweighted graph) and $\\alpha_{pq}(t,x)$ is the <b>search bias</b>, defined by how far $x$ is
       from the <i>previous</i> node $t$:</p>
       <ul>
        <li>$d_{tx}{=}0$: $x$ <b>is</b> $t$ &mdash; you would step <b>straight back</b>. Weight $1/p$.</li>
        <li>$d_{tx}{=}1$: $x$ is a neighbor of <i>both</i> $t$ and $v$ &mdash; a <b>local, sideways</b> step
        that stays inside the immediate neighborhood. Weight $1$.</li>
        <li>$d_{tx}{=}2$: $x$ is <b>farther from $t$</b> &mdash; an <b>outward</b> step exploring new ground.
        Weight $1/q$.</li>
       </ul>
       <p><b>What the two knobs do (&sect;3.2.2).</b> The <b>return parameter $p$</b> controls how likely you
       are to immediately revisit a node: a large $p$ (so $1/p$ is small) discourages backtracking and keeps
       the walk moving; a small $p$ ($1/p$ large) keeps it close to the start. The <b>in-out parameter $q$</b>
       trades local for outward: with $q\\gt 1$ the outward weight $1/q$ is small, so the walk prefers nearby
       nodes &mdash; it behaves like <b>breadth-first search (BFS)</b>, sweeping the immediate neighborhood;
       with $q\\lt 1$ the outward weight is large, so the walk pushes away from the start &mdash; like
       <b>depth-first search (DFS)</b>.</p>
       <p><b>Why this matters (&sect;3.1).</b> The paper links the two extremes to the two kinds of similarity.
       A <b>BFS-like</b> walk re-samples the immediate neighbors over and over, so it characterizes a node by
       its <i>local wiring pattern</i> &mdash; this yields embeddings reflecting <b>structural equivalence</b>
       (nodes with the same role embed alike). A <b>DFS-like</b> walk roams across the community, so co-occurring
       nodes tend to be from the <i>same densely-connected region</i> &mdash; this yields <b>homophily</b>
       (community members embed alike). So $q$ is the dial between role-similarity and community-similarity.</p>`,
    architecture:
      `<p>node2vec is a <b>two-component pipeline</b> &mdash; a <b>biased-walk sampler</b> that turns the graph
       into node "sentences", feeding a <b>skip-gram</b> network that turns those sentences into embeddings.
       There are no neural layers in the sampler; the only learned weights are the two embedding tables. The
       paper's <b>Algorithm 1</b> (<code>LearnFeatures</code> calling <code>node2vecWalk</code>, &sect;3.2.2) runs
       three sequential stages:</p>
       <p><b>Component 1 &mdash; bias preprocessing (Algorithm 1, stage 1).</b> Walk the graph once. For every
       directed edge $(t,v)$ and every neighbor $x$ of $v$, classify $d_{tx}\\in\\{0,1,2\\}$ and store the
       unnormalized weight $\\pi_{vx}=\\alpha_{pq}(t,x)\\,w_{vx}$ (the $1/p,\\,1,\\,1/q$ table times the edge
       weight). Normalize per source state $(t,v)$ into a transition distribution and build an <b>alias table</b>
       so each later sampling step is $O(1)$. Cost $O(a^2|V|)$ for average degree $a$ and $|V|$ nodes &mdash;
       this is the only place $p,q$ enter.</p>
       <p><b>Component 2 &mdash; biased walk generation (Algorithm 1, stage 2).</b> From <i>every</i> node, start
       $r$ walks of fixed length $\\ell$. The walk state is the <b>pair</b> $(t,v)$ = (previous, current) node,
       not just $v$ &mdash; that is what makes it 2nd-order. At each step, alias-sample the next node $x$ from the
       precomputed distribution for $(t,v)$, then slide the state to $(v,x)$. Output: $r|V|$ walks, each a
       sequence of node ids &mdash; the "corpus".</p>
       <p><b>Component 3 &mdash; skip-gram with negative sampling (Algorithm 1, stage 3).</b> Two embedding
       tables, $f$ (target) and an output/context table, each $|V|\\times d$ for embedding dimension $d$. Slide a
       window of size $k$ over each walk to form (center, context) pairs; for each, the center's row from $f$ is
       dotted with the context's row, plus a handful of sampled <b>negative</b> nodes, through a logistic loss
       that approximates Eqn. 4's $-\\log Z_u$ term. Stochastic-gradient updates pull co-occurring nodes'
       vectors together and push negatives apart. The trained table $f$ is the node-embedding output.</p>
       <p><b>Data flow:</b> graph &rarr; (bias table $\\pi$, alias tables) &rarr; biased walks &rarr; windowed
       skip-gram pairs &rarr; SGD on two embedding tables &rarr; $f$. All three stages parallelize over nodes,
       which is what makes node2vec scale to millions of nodes (&sect;3.2.2). Swapping $p,q$ touches only
       Component 1; Components 2&ndash;3 are unchanged &mdash; the same machinery that gives the BFS&harr;DFS
       interpolation.</p>`,
    symbols: [
      { sym: "$t$", desc: "the <b>previous</b> node &mdash; the one the walk just came from before reaching $v$. The bias looks back at $t$, which is what makes the walk 2nd-order." },
      { sym: "$v$", desc: "the <b>current</b> node where the walk sits; we are choosing its next step." },
      { sym: "$x$", desc: "a <b>candidate next node</b> &mdash; one of $v$'s neighbors we might step to." },
      { sym: "$d_{tx}$", desc: "the <b>shortest-path distance</b> (number of hops) from the previous node $t$ to the candidate $x$. By construction it is $0$, $1$, or $2$." },
      { sym: "$p$", desc: "the <b>return parameter</b>. Controls the chance of stepping straight back to $t$ (the $d{=}0$ case gets weight $1/p$). Large $p$ &rarr; rarely backtrack; small $p$ &rarr; stay near the start." },
      { sym: "$q$", desc: "the <b>in-out parameter</b>. Controls outward exploration (the $d{=}2$ case gets weight $1/q$). $q\\gt 1$ &rarr; BFS-like (hug the neighborhood); $q\\lt 1$ &rarr; DFS-like (wander outward)." },
      { sym: "$\\alpha_{pq}(t,x)$", desc: "the <b>search bias</b>: the unnormalized multiplier ($1/p$, $1$, or $1/q$) chosen by $d_{tx}$. This is the whole novelty." },
      { sym: "$w_{vx}$", desc: "the <b>edge weight</b> between $v$ and $x$ ($1$ for an unweighted graph). The full unnormalized transition weight is $\\pi_{vx}=\\alpha_{pq}(t,x)\\,w_{vx}$." },
      { sym: "$\\pi_{vx}$", desc: "the <b>unnormalized transition weight</b> to $x$. Dividing each $\\pi_{vx}$ by the sum over all candidates gives the actual next-step probability." },
      { sym: "$f(u)$", desc: "the <b>embedding</b> (feature vector) of node $u$ &mdash; the thing we are learning. A short list of numbers." },
      { sym: "$N_S(u)$", desc: "the <b>network neighborhood</b> of $u$ produced by sampling strategy $S$ &mdash; the set of nodes that co-occur with $u$ in the walks (its skip-gram context)." },
      { sym: "$Z_u$", desc: "the <b>partition function</b> $\\sum_{v\\in V}\\exp(f(v)\\cdot f(u))$ &mdash; the per-node softmax denominator that normalizes the embedding probabilities (Eqn. 3). Sums over <i>all</i> nodes, so it is expensive and is approximated by negative sampling." },
      { sym: "$V$", desc: "the <b>set of all nodes</b> in the graph; $|V|$ is the node count. The objective sums over every $u\\in V$." },
      { sym: "$E$", desc: "the <b>set of edges</b>. The walk can only step to $x$ if $(v,x)\\in E$; otherwise the transition probability is $0$." },
      { sym: "$c_i$", desc: "the <b>$i$-th node visited</b> on a walk; $c_{i-1}=v$ is the current node and the next node $c_i=x$ is drawn from $\\Pr(c_i=x\\mid c_{i-1}=v)$." },
      { sym: "$Z$", desc: "the <b>walk normalizing constant</b> &mdash; the sum of $\\pi_{vx}$ over $v$'s neighbors, turning the unnormalized weights into a next-step probability. (Distinct from the embedding partition function $Z_u$.)" },
      { sym: "BFS / DFS", desc: "<b>Breadth-First / Depth-First Search</b>: two classic ways to explore a graph &mdash; BFS sweeps the immediate neighbors first; DFS plunges outward along a path. node2vec's $q$ interpolates between these two behaviors." }
    ],
    formula: `$$ \\max_{f}\\;\\sum_{u\\in V}\\;\\log\\Pr\\!\\big(N_S(u)\\mid f(u)\\big) \\qquad\\text{(Eqn. 1, \\S 3.1 — the skip-gram objective: each node's vector should predict its sampled neighborhood)} $$
$$ \\Pr\\!\\big(N_S(u)\\mid f(u)\\big)\\;=\\;\\prod_{n_i\\in N_S(u)}\\Pr\\!\\big(n_i\\mid f(u)\\big) \\qquad\\text{(Eqn. 2, \\S 3.1 — conditional-independence assumption: factor the neighborhood over its members)} $$
$$ \\Pr\\!\\big(n_i\\mid f(u)\\big)\\;=\\;\\frac{\\exp\\!\\big(f(n_i)\\cdot f(u)\\big)}{\\displaystyle\\sum_{v\\in V}\\exp\\!\\big(f(v)\\cdot f(u)\\big)}\\;=\\;\\frac{\\exp\\!\\big(f(n_i)\\cdot f(u)\\big)}{Z_u} \\qquad\\text{(Eqn. 3, \\S 3.1 — symmetric softmax; }Z_u\\text{ is the partition function)} $$
$$ \\max_{f}\\;\\sum_{u\\in V}\\Big[-\\log Z_u + \\sum_{n_i\\in N_S(u)} f(n_i)\\cdot f(u)\\Big]\\,,\\qquad Z_u=\\sum_{v\\in V}\\exp\\!\\big(f(u)\\cdot f(v)\\big) \\qquad\\text{(Eqn. 4, \\S 3.1 — combine 1–3, take logs; trained by negative sampling)} $$
$$ \\Pr\\!\\big(c_i=x \\mid c_{i-1}=v\\big)\\;=\\;\\begin{cases}\\dfrac{\\pi_{vx}}{Z} & \\text{if }(v,x)\\in E\\\\[4pt] 0 & \\text{otherwise}\\end{cases} \\qquad\\text{(\\S 3.2.2 — the walk's next-step distribution; }Z\\text{ normalizes over }v\\text{'s neighbors)} $$
$$ \\pi_{vx}=\\alpha_{pq}(t,x)\\cdot w_{vx}\\,,\\qquad \\alpha_{pq}(t,x) \\;=\\; \\begin{cases} \\dfrac{1}{p} & \\text{if } d_{tx}=0 \\\\[4pt] 1 & \\text{if } d_{tx}=1 \\\\[4pt] \\dfrac{1}{q} & \\text{if } d_{tx}=2 \\end{cases} \\qquad\\text{(\\S 3.2.2 — the 2nd-order search bias: return parameter }p\\text{, in-out parameter }q\\text{)} $$`,
    whatItDoes:
      `<p><b>The objective (Eqns. 1&ndash;4).</b> This is skip-gram, restated for graphs. <b>Eqn. 1</b>,
       $\\max_f\\sum_u\\log\\Pr(N_S(u)\\mid f(u))$, says "make each node's vector predict the nodes it co-occurs
       with on the walks." <b>Eqn. 2</b> assumes the neighbors are conditionally independent, so the
       neighborhood probability factors into a <i>product</i> over individual neighbors. <b>Eqn. 3</b> models
       each factor with a symmetric softmax $\\exp(f(n_i)\\cdot f(u))/Z_u$ &mdash; a node is "close" when the dot
       product of the two vectors is large, and $Z_u$ normalizes over all nodes. <b>Eqn. 4</b> takes logs of the
       product and substitutes the softmax: for every node, <b>pull its vector toward the vectors of its
       walk-neighbors</b> ($f(n_i)\\cdot f(u)$ large) while the $-\\log Z_u$ term pushes it away from everyone
       else. The bias decides <i>who</i> ends up in $N_S(u)$; this objective does the pulling.</p>
       <p><b>The walk's next step (&sect;3.2.2).</b> $\\Pr(c_i=x\\mid c_{i-1}=v)$ is the bias table, normalized.
       Standing at $v$ having come from $t$, score each candidate next node $x$ by a single number that depends
       <i>only</i> on $x$'s distance from the <i>previous</i> node $t$: <b>$1/p$ for going back</b> ($d{=}0$),
       <b>$1$ for a local sideways step</b> ($d{=}1$), and <b>$1/q$ for an outward step</b> ($d{=}2$). Multiply
       by the edge weight $w_{vx}$ to get $\\pi_{vx}$, divide by $Z$ (the sum over $v$'s neighbors), and sample.
       That is the entire transition rule &mdash; three cases.</p>`,
    derivation:
      `<p><b>Why three cases &mdash; and exactly $1/p,1,1/q$ &mdash; suffice (&sect;3.2.2).</b> Because the walk
       is 2nd-order, the candidate $x$ can only be at distance $0$, $1$, or $2$ from the previous node $t$:</p>
       <ul>
        <li>$x=t$ gives $d_{tx}=0$ (you stepped straight back).</li>
        <li>$x$ is connected to $t$ as well as to $v$ &mdash; a shared neighbor &mdash; so $d_{tx}=1$.</li>
        <li>$x$ is a neighbor of $v$ but <i>not</i> of $t$, so the only path is $t\\to v\\to x$, giving
        $d_{tx}=2$.</li>
       </ul>
       <p>No other distance is possible (any neighbor of $v$ is at most two hops from $t$ through $v$). So one
       multiplier per distance is all you need. Setting the middle case to $1$ fixes a reference; then $1/p$
       and $1/q$ are <i>relative</i> tilts &mdash; raising $p$ shrinks the back-step weight, raising $q$ shrinks
       the outward-step weight. The paper writes the bias as $1/p$ and $1/q$ (rather than $p,q$ directly) so
       that the <i>intuitive</i> reading holds: <b>big $p$ = avoid returning</b>, <b>big $q$ = avoid going
       outward (stay BFS-local)</b>. DeepWalk (<code>paper-deepwalk</code>) is the special case
       $p{=}q{=}1$: all three weights equal $1$, so the bias vanishes and you recover the plain uniform walk.</p>
       <p>The objective (Eqn. 1&rarr;2) is the standard skip-gram derivation &mdash; conditional independence
       turns the joint $\\Pr(N_S(u)\\mid f(u))$ into a product over neighbors, and the softmax turns each factor
       into $\\exp(f(n_i)\\cdot f(u))/Z_u$; taking logs gives the $-\\log Z_u + \\sum f(n_i)\\cdot f(u)$ form.
       That full derivation lives in <code>paper-word2vec</code>; we recap, not re-derive.</p>`,
    example:
      `<p>Work <b>one biased step</b> by hand. The walk just went $t\\to v$. Node $v$ has three neighbors:
       $t$ (going back), $a$ (also a neighbor of $t$), and $b$ (a neighbor of $v$ only, one hop farther out).
       Take edge weights all $1$, and pick $p=2$, $q=0.5$.</p>
       <ul class="steps">
        <li><b>Classify each candidate by $d_{tx}$.</b> $x{=}t$: $d{=}0$. $x{=}a$: $a$ touches $t$, so $d{=}1$.
        $x{=}b$: $b$ does not touch $t$, only reachable as $t\\to v\\to b$, so $d{=}2$.</li>
        <li><b>Look up the bias $\\alpha$.</b> $\\alpha(t)=1/p=1/2=0.5$ (back). $\\alpha(a)=1=1$ (local).
        $\\alpha(b)=1/q=1/0.5=2$ (outward).</li>
        <li><b>Unnormalized weights</b> $\\pi=\\alpha\\cdot w$ (all $w{=}1$): $\\pi_t=0.5$, $\\pi_a=1$,
        $\\pi_b=2$. Sum $=0.5+1+2=3.5$.</li>
        <li><b>Normalize</b> to probabilities: $P(t)=0.5/3.5\\approx 0.1429$, $P(a)=1/3.5\\approx 0.2857$,
        $P(b)=2/3.5\\approx 0.5714$.</li>
       </ul>
       <p>Read it off: with $q=0.5\\lt 1$ the <b>outward</b> node $b$ is <i>most</i> likely ($\\approx 57\\%$)
       &mdash; this is a <b>DFS-like</b> setting that wanders away from the start, biasing toward
       <b>homophily</b>. Flip to $q=2$ and the outward weight becomes $1/q=0.5$, so the sum is
       $0.5+1+0.5=2$ and $P(b)=0.5/2=0.25$ drops below the local step $P(a)=0.5$ &mdash; now the walk hugs the
       neighborhood (<b>BFS-like</b>, biasing toward <b>structural equivalence</b>). These exact numbers are
       recomputed in the notebook's first cell.</p>`,
    recipe:
      `<ol>
        <li><b>Precompute the bias.</b> For each directed edge $(t,v)$ and each neighbor $x$ of $v$, compute
        $d_{tx}\\in\\{0,1,2\\}$ and the unnormalized weight $\\alpha_{pq}(t,x)\\,w_{vx}$ ($1/p,\\,1,\\,1/q$
        times the edge weight); normalize over $x$ to a transition distribution.</li>
        <li><b>Sample walks.</b> From every node, take $r$ walks of length $\\ell$ using that 2nd-order
        transition (remember the previous node at each step).</li>
        <li><b>Build skip-gram pairs.</b> Slide a window of size $k$ over each walk: each (center, context) node
        pair is a positive example; draw a few random nodes as negatives.</li>
        <li><b>Train embeddings.</b> Optimize Eqn. (2) by negative sampling: pull $f(\\text{center})$ toward
        $f(\\text{context})$, push it from negatives.</li>
        <li><b>Use $p,q$ as dials.</b> Re-run with a BFS-like setting ($q\\gt 1$) and a DFS-like setting
        ($q\\lt 1$) and compare the embeddings &mdash; the ablation that proves the point.</li>
      </ol>`,
    results:
      `<p>From the paper (&sect;4): node2vec is evaluated on multi-label node classification (BlogCatalog,
       Protein-Protein Interaction, Wikipedia) and link prediction, where the authors report it outperforms
       DeepWalk and other baselines and analyze how $p,q$ select homophily vs structural equivalence
       (Figure 1's Les Mis&eacute;rables visualization).</p>
       <p><i>Those are the paper's reported claims. The numbers in the CODEVIZ panel below are from our own
       tiny run &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives (embedding tables, autograd, the
       optimizer) ship in PyTorch, so you <b>import</b> them and build only the novel composition.
       <b>Build by hand:</b> (1) the <b>2nd-order biased transition</b> &mdash; the $d_{tx}\\in\\{0,1,2\\}$
       classification and the $1/p,\\,1,\\,1/q$ weights; (2) the <b>biased walk sampler</b>; (3) the
       <b>skip-gram with negative sampling</b> loop over walk windows. <b>Import:</b> <code>nn.Embedding</code>,
       <code>torch.optim.Adam</code>, and tensor ops. The skip-gram math is recapped from
       <code>paper-word2vec</code>; the graph/message-passing context lives in <code>mod-gnn</code>; the
       unbiased predecessor is <code>paper-deepwalk</code> ($p{=}q{=}1$).</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting the walk is 2nd-order.</b> The bias depends on the <i>previous</i> node $t$, not just
        the current node $v$. If you sample the next step from $v$ alone you have rebuilt DeepWalk &mdash; $p,q$
        do nothing. <b>Fix:</b> carry $(t,v)$ as the state.</li>
        <li><b>Mixing up $q$ and $1/q$.</b> The outward case gets weight $1/q$, so <b>large $q$ &rarr; small
        outward weight &rarr; BFS-local</b> (not the other way round). Likewise the back-step is $1/p$. Sanity
        check against the worked example before trusting your code.</li>
        <li><b>Computing $d_{tx}$ wrong.</b> $d{=}1$ means $x$ is a neighbor of $t$ <i>too</i> (a shared
        neighbor of $t$ and $v$); $d{=}2$ means $x$ touches $v$ but not $t$. Test on a triangle vs a path.</li>
        <li><b>Swapping homophily and structural equivalence.</b> Per &sect;3.1 the paper ties <b>DFS-like</b>
        ($q\\lt 1$) walks to <b>homophily</b> (communities) and <b>BFS-like</b> ($q\\gt 1$) walks to
        <b>structural equivalence</b> (roles). It is easy to state it backwards &mdash; anchor on "BFS stays
        local, so it sees the local wiring pattern = role."</li>
        <li><b>Skipping negative sampling.</b> The exact partition function $Z_u$ sums over <i>all</i> nodes
        and is too slow; approximate it (negative sampling), exactly as in word2vec.</li>
      </ul>`,
    recall: [
      "Write the search-bias equation $\\alpha_{pq}(t,x)$ (the three $1/p,1,1/q$ cases) from memory, including which case is which $d_{tx}$.",
      "What does the return parameter $p$ control, and what does the in-out parameter $q$ control?",
      "Which walk regime (BFS-like or DFS-like) yields homophily, and which yields structural equivalence?",
      "What values of $p,q$ recover DeepWalk, and why?",
      "Define $d_{tx}$, $\\pi_{vx}$, $N_S(u)$, and $Z_u$."
    ],
    practice: [
      {
        q: `<b>Recompute the transition with different knobs.</b> Same step $t\\to v$ with candidates $t$
            ($d{=}0$), $a$ ($d{=}1$), $b$ ($d{=}2$), all edge weights $1$. Now use $p=0.25$, $q=4$. Give the
            unnormalized weights and the normalized probabilities, and say which behavior this encodes.`,
        steps: [
          { do: `Biases: $\\alpha(t)=1/p=1/0.25=4$; $\\alpha(a)=1$; $\\alpha(b)=1/q=1/4=0.25$.`, why: `Plug $p,q$ into the three cases of $\\alpha_{pq}$.` },
          { do: `Unnormalized $\\pi$ (all $w{=}1$): $\\pi_t=4,\\ \\pi_a=1,\\ \\pi_b=0.25$. Sum $=5.25$.`, why: `$\\pi_{vx}=\\alpha\\,w_{vx}$, then sum for normalization.` },
          { do: `Normalize: $P(t)=4/5.25\\approx 0.762$, $P(a)=1/5.25\\approx 0.190$, $P(b)=0.25/5.25\\approx 0.048$.`, why: `Divide each $\\pi$ by the sum.` }
        ],
        answer: `<p>Weights $\\pi=(4,\\,1,\\,0.25)$ give $P(t)\\approx 0.762,\\ P(a)\\approx 0.190,\\
                 P(b)\\approx 0.048$. The small $p=0.25$ makes <b>returning to $t$</b> overwhelmingly likely and
                 the large $q=4$ makes the <b>outward</b> step $b$ almost never chosen &mdash; the walk stays
                 glued to the start node's immediate neighborhood. This is a strongly <b>BFS-like</b> regime,
                 biasing the embedding toward <b>structural equivalence</b> (role similarity).</p>`
      },
      {
        q: `Show that $p=q=1$ reduces node2vec to an unbiased random walk (DeepWalk, <code>paper-deepwalk</code>).
            What are the three biases, and what is $P(b)$ for the example graph (candidates $t,a,b$)?`,
        steps: [
          { do: `Set $p=q=1$: $\\alpha(t)=1/p=1$, $\\alpha(a)=1$, $\\alpha(b)=1/q=1$.`, why: `Every case of $\\alpha_{pq}$ becomes $1$.` },
          { do: `Unnormalized weights all equal the edge weight ($1$ here); sum $=3$.`, why: `$\\pi_{vx}=1\\cdot w_{vx}$, so the bias has no effect.` },
          { do: `$P(b)=1/3\\approx 0.333$, same as $P(t)$ and $P(a)$.`, why: `Uniform over neighbors = an unbiased 1st-order walk.` }
        ],
        answer: `<p>With $p=q=1$ all three biases equal $1$, so $\\pi_{vx}=w_{vx}$ and the next node is chosen
                 <b>uniformly</b> among neighbors ($P(t)=P(a)=P(b)=1/3$). The dependence on the previous node
                 $t$ disappears &mdash; the walk is a plain unbiased random walk, which is exactly
                 <b>DeepWalk</b>. node2vec is its strict generalization.</p>`
      },
      {
        q: `<b>Ablation on the walk itself.</b> On a graph with two dense communities, you run length-$20$
            walks twice from every node: once DFS-like ($p=1,q=0.25$) and once BFS-like ($p=1,q=4$). Predict
            which regime visits <b>more distinct nodes per walk</b>, and tie that back to homophily vs
            structural equivalence (&sect;3.1).`,
        steps: [
          { do: `DFS-like ($q\\lt 1$): the outward weight $1/q=4$ is large, so each step tends to push to a farther node.`, why: `The walk keeps moving outward, so a single walk of fixed length covers more of the graph &mdash; more distinct nodes.` },
          { do: `BFS-like ($q\\gt 1$): the outward weight $1/q=0.25$ is small, so the walk re-samples the immediate neighborhood.`, why: `It revisits the same local nodes, so a fixed-length walk touches fewer distinct nodes &mdash; it characterizes a node by its local wiring (role).` },
          { do: `Count mean distinct nodes per walk in each regime; change only $q$.`, why: `Isolating $q$ attributes any difference to the BFS/DFS exploration bias &mdash; the exact knob the paper introduces.` }
        ],
        answer: `<p>The <b>DFS-like</b> walk ($q=0.25$) visits <b>more distinct nodes per walk</b> &mdash; it
                 roams outward across the community, which is why its co-occurrence statistics reflect
                 <b>homophily</b> (community membership). The <b>BFS-like</b> walk ($q=4$) visits <b>fewer</b>
                 distinct nodes &mdash; it hugs the immediate neighborhood, characterizing each node by its
                 local wiring pattern, which is the path to <b>structural equivalence</b> (role similarity).
                 The CODEVIZ panel measures exactly this distinct-nodes-per-walk gap on a toy graph &mdash; a
                 direct, robust read-out of the $q$ knob interpolating between BFS and DFS.</p>`
      }
    ]
  });

  window.CODE["paper-node2vec"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> node2vec's novelty by hand &mdash; the <b>2nd-order biased transition</b>
       ($d_{tx}\\in\\{0,1,2\\}$ &rarr; weights $1/p,\\,1,\\,1/q$), the <b>biased walk sampler</b>, and
       <b>skip-gram with negative sampling</b> &mdash; on top of PyTorch's <code>nn.Embedding</code> and Adam.
       The first cell recomputes the worked transition example ($p{=}2,q{=}0.5\\Rightarrow
       P\\approx[0.143,0.286,0.571]$ over back/local/outward). Then, on a toy <b>two-community</b> graph, we
       show $q$ changes the walk: the <b>DFS-like</b> ($q{=}0.25$) walk visits <i>more</i> distinct nodes per
       walk (roams outward &rarr; homophily) than the <b>BFS-like</b> ($q{=}4$) walk (hugs the neighborhood
       &rarr; structural equivalence). Finally we train skip-gram on the biased walks and print that the
       embedding recovers the two communities (intra-community cosine $\\gg$ inter-community). Paste into Colab
       and run (torch is preinstalled).</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F
import random

random.seed(0); torch.manual_seed(0)

# --- 0. Worked example: one biased step. Walk went t->v; candidates are t (d=0), a (d=1), b (d=2). ---
def transition_probs(p, q, w=(1., 1., 1.)):
    # weights for (back d=0, local d=1, outward d=2)
    alpha = [1.0 / p, 1.0, 1.0 / q]
    pi = [a * wi for a, wi in zip(alpha, w)]
    Z = sum(pi)
    return [round(x / Z, 4) for x in pi]

print("p=2, q=0.5 ->", transition_probs(2, 0.5))   # [0.1429, 0.2857, 0.5714]  outward most likely (DFS-like)
print("p=2, q=2.0 ->", transition_probs(2, 2.0))   # [0.25,   0.5,    0.25]     local > outward (BFS-ward)
print("p=q=1 (DeepWalk) ->", transition_probs(1, 1))  # [0.3333,0.3333,0.3333]  uniform = unbiased walk


# --- 1. A toy graph: two dense communities joined by a single bridge. ---
# Community A = nodes 0..5, Community B = nodes 6..11. Each has a hub (0, 6) wired to its members
# plus a ring; one bridge edge (0,6) connects the communities.
def make_graph():
    edges = set()
    def add(u, v): edges.add((min(u, v), max(u, v)))
    for comm in ([0,1,2,3,4,5], [6,7,8,9,10,11]):
        hub = comm[0]
        for u in comm[1:]:
            add(hub, u)                       # hub connects to everyone in its community
        for i in range(1, len(comm)):         # plus a ring so the community is dense
            add(comm[i], comm[(i % (len(comm)-1)) + 1])
    add(0, 6)                                  # the single bridge between the two hubs
    N = 12
    adj = [[] for _ in range(N)]
    for u, v in edges:
        adj[u].append(v); adj[v].append(u)
    return N, [sorted(set(a)) for a in adj]

N, adj = make_graph()
nbr_set = [set(a) for a in adj]

# --- 2. The 2nd-order BIASED transition (the heart of node2vec). ---
def d_tx(t, x):
    if x == t: return 0                        # stepping straight back
    if x in nbr_set[t]: return 1               # x is also a neighbor of t (local)
    return 2                                    # x is one hop farther out

def biased_next(t, v, p, q):
    cands = adj[v]
    w = []
    for x in cands:
        d = d_tx(t, x)
        w.append(1.0/p if d == 0 else (1.0 if d == 1 else 1.0/q))
    s = sum(w)
    r, acc = random.random() * s, 0.0
    for x, wi in zip(cands, w):                 # sample proportional to the biased weights
        acc += wi
        if r <= acc: return x
    return cands[-1]

def walk(start, length, p, q):
    path = [start]
    cur = start; prev = start
    for _ in range(length - 1):
        nxt = biased_next(prev, cur, p, q) if len(path) > 1 else random.choice(adj[cur])
        path.append(nxt); prev, cur = cur, nxt
    return path

def sample_walks(p, q, num_walks=20, length=20):
    walks = []
    for _ in range(num_walks):
        for start in range(N):
            walks.append(walk(start, length, p, q))
    return walks

# --- 3. Skip-gram with negative sampling over the walks. ---
def train_embeddings(walks, dim=8, window=2, negatives=5, epochs=60, lr=0.05):
    torch.manual_seed(0)
    emb = nn.Embedding(N, dim); ctx = nn.Embedding(N, dim)
    nn.init.normal_(emb.weight, std=0.1); nn.init.normal_(ctx.weight, std=0.1)
    opt = torch.optim.Adam(list(emb.parameters()) + list(ctx.parameters()), lr=lr)
    # build (center, context) positive pairs from sliding windows
    pairs = []
    for wlk in walks:
        for i, c in enumerate(wlk):
            for j in range(max(0, i-window), min(len(wlk), i+window+1)):
                if j != i: pairs.append((c, wlk[j]))
    pairs = torch.tensor(pairs)
    for _ in range(epochs):
        perm = pairs[torch.randperm(len(pairs))]
        centers, contexts = perm[:, 0], perm[:, 1]
        negs = torch.randint(0, N, (len(perm), negatives))
        opt.zero_grad()
        ce, co = emb(centers), ctx(contexts)
        pos = F.logsigmoid((ce * co).sum(1))                         # pull center -> true context
        neg = F.logsigmoid(-(emb(centers).unsqueeze(1) * ctx(negs)).sum(2)).sum(1)  # push from negatives
        loss = -(pos + neg).mean()
        loss.backward(); opt.step()
    return F.normalize(emb.weight.detach(), dim=1)

import statistics, itertools

# --- 4a. q CHANGES THE WALK: DFS-like roams (more distinct nodes), BFS-like hugs the neighborhood. ---
def mean_distinct(p, q, trials=500, length=20):
    return statistics.mean(len(set(walk(random.randrange(N), length, p, q))) for _ in range(trials))

random.seed(0); dfs = mean_distinct(1, 0.25)
random.seed(0); bfs = mean_distinct(1, 4.0)
print(f"distinct nodes / length-20 walk:  DFS-like q=0.25 = {dfs:.2f}   BFS-like q=4 = {bfs:.2f}")
# DFS-like ~8.0 (roams outward -> homophily);  BFS-like ~6.1 (stays local -> structural equivalence).

# --- 4b. Skip-gram on the biased walks recovers the two communities (homophily read-out). ---
A, B = list(range(0, 6)), list(range(6, 12))
intra = list(itertools.combinations(A, 2)) + list(itertools.combinations(B, 2))
inter = [(i, j) for i in A for j in B]
def avg_cos(z, pairs):
    return statistics.mean(float((z[i] * z[j]).sum()) for i, j in pairs)

random.seed(0)
z = train_embeddings(sample_walks(1, 0.25))      # DFS-like walks -> homophily
print(f"DFS-like embedding:  intra-community cos = {avg_cos(z, intra):+.3f}   "
      f"inter-community cos = {avg_cos(z, inter):+.3f}")

# Our small run (NOT the paper's numbers): the in-out parameter q visibly changes the walk --
# DFS-like (q<1) explores ~8 distinct nodes per walk vs ~6 for BFS-like (q>1) -- and skip-gram on the
# biased walks recovers the community structure (intra cos ~0.9 >> inter cos ~0.2), i.e. homophily.`
  };

  window.CODEVIZ["paper-node2vec"] = {
    question: "Does the in-out parameter q actually change the walk — does a DFS-like walk (q<1) roam outward and visit MORE distinct nodes per walk than a BFS-like walk (q>1) that hugs the immediate neighborhood?",
    charts: [
      {
        type: "bar",
        title: "Mean distinct nodes visited per length-20 walk: DFS-like (q<1) vs BFS-like (q>1)",
        xlabel: "walk regime (only q changes; p=1)",
        ylabel: "distinct nodes per walk",
        series: [
          {
            name: "exploration breadth",
            color: "#7ee787",
            points: [["DFS-like  q=0.25 (homophily)", 8.0], ["BFS-like  q=4 (struct. equiv.)", 6.1]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A toy 12-node graph: two dense communities (0-5 and 6-11) joined by a single bridge. We sample 500 length-20 biased walks per regime, changing ONLY the in-out parameter q. The DFS-like walk (q=0.25, outward weight 1/q=4) keeps pushing away from where it has been, so a single walk covers ~8.0 distinct nodes — it roams across the community, which is why its co-occurrence statistics reflect HOMOPHILY (community membership). The BFS-like walk (q=4, outward weight 1/q=0.25) re-samples the immediate neighborhood, so a walk of the same length touches only ~6.1 distinct nodes — it characterizes a node by its local wiring pattern, the path to STRUCTURAL EQUIVALENCE (role similarity). Changing one knob measurably changes how the walk explores — exactly the BFS<->DFS interpolation node2vec introduces (&sect;3.2.2).",
    code: `import random, statistics

# Toy graph: two dense communities (0-5, 6-11) joined by a single bridge edge (0,6).
def make_graph():
    edges = set()
    def add(u, v): edges.add((min(u, v), max(u, v)))
    for comm in ([0,1,2,3,4,5], [6,7,8,9,10,11]):
        hub = comm[0]
        for u in comm[1:]: add(hub, u)
        for i in range(1, len(comm)): add(comm[i], comm[(i % (len(comm)-1)) + 1])
    add(0, 6)
    adj = [[] for _ in range(12)]
    for u, v in edges: adj[u].append(v); adj[v].append(u)
    return [sorted(set(a)) for a in adj]

adj = make_graph(); N = 12; nbr = [set(a) for a in adj]

# The 2nd-order biased transition: weight depends on distance from the PREVIOUS node t.
def d_tx(t, x): return 0 if x == t else (1 if x in nbr[t] else 2)
def nxt(t, v, p, q):
    c = adj[v]; w = [1/p if d_tx(t,x)==0 else (1 if d_tx(t,x)==1 else 1/q) for x in c]
    s = sum(w); r = random.random()*s; acc = 0
    for x, wi in zip(c, w):
        acc += wi
        if r <= acc: return x
    return c[-1]
def walk(s, L, p, q):
    path=[s]; cur=s; prev=s
    for _ in range(L-1):
        n = nxt(prev,cur,p,q) if len(path)>1 else random.choice(adj[cur])
        path.append(n); prev,cur=cur,n
    return path

def mean_distinct(p, q, trials=500, length=20):
    return statistics.mean(len(set(walk(random.randrange(N), length, p, q))) for _ in range(trials))

random.seed(0); dfs = mean_distinct(1, 0.25)
random.seed(0); bfs = mean_distinct(1, 4.0)
print("DFS-like q=0.25 distinct/walk:", round(dfs, 2))   # ~8.0  (roams outward -> homophily)
print("BFS-like q=4    distinct/walk:", round(bfs, 2))   # ~6.1  (stays local -> structural equivalence)
# Our small run, not the paper's number. q interpolates between BFS and DFS exploration (&sect;3.2.2).`
  };
})();
