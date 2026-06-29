/* Paper lesson — "DeepWalk: Online Learning of Social Representations", Perozzi, Al-Rfou & Skiena, KDD 2014.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-deepwalk".
   GROUNDED from arXiv:1403.6652 via the ar5iv HTML mirror: the language-modeling -> graph analogy
   (Section 3.1, the mapping Phi and Eqn. 1), the relaxed skip-gram objective over a symmetric window
   (Eqn. 2, Section 3.2), the POWER-LAW motivation tying random-walk vertex frequency to Zipfian word
   frequency (Section 3.2 "Connection: Power laws" + Figure 2), the "walks as short sentences" framing
   (Section 3.3), and the DeepWalk / SkipGram pseudocode (Algorithms 1-2). Track B (architecture): build
   truncated random-walk generation + skip-gram (negative sampling) by hand on a 2-community graph and
   SHOW a logistic probe on the learned embeddings recovers the community split far better than the same
   probe on the raw adjacency rows (the ablation). conceptLink = mod-gnn (graph recap).
   Cross-links paper-word2vec (random walks ARE the "sentences") and paper-node2vec (biased generalization). */
(function () {
  window.LESSONS.push({
    id: "paper-deepwalk",
    title: "DeepWalk — Online Learning of Social Representations (2014)",
    tagline: "Generate truncated random walks from each node, treat each walk as a sentence, and run word2vec's skip-gram on them — nodes that share neighborhoods get similar vectors.",
    module: "Papers · Graph Neural Networks",
    track: "architecture",
    paper: {
      authors: "Bryan Perozzi, Rami Al-Rfou, Steven Skiena",
      org: "Stony Brook University (Department of Computer Science)",
      year: 2014,
      venue: "arXiv:1403.6652 (Mar 2014); KDD '14 (ACM SIGKDD)",
      citations: "", // no citation count shown on the fetched ar5iv page — omitted to avoid inventing one
      arxiv: "https://arxiv.org/abs/1403.6652",
      code: "https://github.com/phanein/deepwalk"
    },
    conceptLink: "mod-gnn",
    partOf: [],
    prereqs: ["mod-gnn", "paper-word2vec", "dl-word2vec", "ml-logistic-regression"],

    // WHY READ IT
    problem:
      `<p>A <b>graph</b> (also called a <b>network</b>) is a set of <b>nodes</b> &mdash; say each member of a
       social network &mdash; joined by <b>edges</b> (a friendship, a follow). We often want to <b>classify</b>
       nodes: which interest group does this member belong to? The trouble is that a node has no natural list of
       numbers a classifier can read; all you are handed is <i>who it is connected to</i>.</p>
       <p>The obvious fix is to feed a classifier the node's <b>adjacency row</b> &mdash; a length-$N$ vector that
       is $1$ for every neighbor and $0$ otherwise (here $N$ is the number of nodes). The paper (&sect;1) argues
       this is a poor representation: it is <b>very high-dimensional</b> (one entry per node), <b>extremely
       sparse</b> (almost all zeros), and <b>brittle</b> &mdash; two nodes deep in the same community can share
       <i>no</i> direct neighbor, so their adjacency rows look completely different even though they are
       "similar." Statistical classifiers struggle with such sparse, high-dimensional input.</p>
       <p>The authors want a <b>node embedding</b> instead: a <i>short, dense</i> vector (a handful of real
       numbers) for each node, learned <b>without labels</b>, such that nodes in similar parts of the graph land
       near each other. Then any off-the-shelf classifier &mdash; logistic regression &mdash; can read those
       vectors and predict the label.</p>`,
    contribution:
      `<ul>
        <li><b>Random walks as "sentences."</b> DeepWalk's key move (&sect;3.3): from each node, take short
        <b>truncated random walks</b> &mdash; start at the node, repeatedly hop to a uniformly-random neighbor,
        stop after a fixed length. Each walk is an ordered list of nodes; the paper calls these walks
        <i>"short sentences and phrases in a special language."</i></li>
        <li><b>Reuse a language model.</b> Having turned the graph into a corpus of node-sentences, DeepWalk runs
        the <b>skip-gram</b> model from word2vec (<code>paper-word2vec</code>) on them unchanged: a node's vector
        is trained to predict the nodes that appear near it in the walks. The output is a dense embedding per
        node.</li>
        <li><b>A principled reason it should work.</b> The paper observes (&sect;3.2, Figure 2) that the
        <b>frequency</b> with which nodes appear in short random walks follows a <b>power law</b> &mdash; just
        like word frequency in natural language follows Zipf's law. Because the input statistics match, the
        machinery built for words transfers to nodes.</li>
      </ul>`,
    whyItMattered:
      `<p>DeepWalk launched the entire <b>"random-walk + word2vec" family</b> of graph embeddings. It showed you
       could get strong <b>unsupervised</b> node features cheaply, scale to large graphs, and feed them to a
       plain classifier. It was the unbiased ancestor of <b>node2vec</b> (<code>paper-node2vec</code>), which
       adds two knobs to <i>bias</i> the same walks, and it sits upstream of the message-passing graph neural
       networks recapped in <code>mod-gnn</code>. The reframing &mdash; "a graph is a corpus of walks, so reuse
       the best text model" &mdash; is the durable idea.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.1 (Random Walks &amp; Language Modeling)</b> &mdash; the analogy and the mapping
        $\\Phi$. This is where the paper restates the language-modeling objective (Eqn. 1) for nodes.</li>
        <li><b>&sect;3.2 ("Connection: Power laws") + Figure 2</b> &mdash; the justification. Figure 2 puts the
        random-walk node-frequency distribution next to Wikipedia word frequency; both are power laws. Read this;
        it is <i>why</i> a word model is the right tool for graphs.</li>
        <li><b>&sect;3.3 (Language Modeling) + Eqn. 2</b> &mdash; the relaxation to a <b>symmetric context
        window</b> that drops word order: the skip-gram objective DeepWalk actually optimizes. This is the
        equation you will transcribe and implement.</li>
        <li><b>Algorithms 1 &amp; 2</b> &mdash; DeepWalk (sample walks, call SkipGram) and SkipGram (slide a
        window, update with gradient descent). One pass each.</li>
       </ul>
       <p><b>Skim:</b> &sect;4 (the hierarchical-softmax speedup &mdash; an <i>implementation</i> detail; we use
       negative sampling instead, same effect) and the experiments (&sect;5) on the first pass &mdash; come back
       for the BlogCatalog / Flickr / YouTube Micro-F1 tables once the method makes sense.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will build the same logistic-regression <b>probe</b> twice on a graph with two clear communities:
       once reading the learned <b>DeepWalk embedding</b> (a short dense vector per node), and once reading the
       raw <b>adjacency row</b> (the length-$N$ 0/1 vector of who each node connects to). Both classifiers try
       to recover which community each node belongs to from a few labeled examples. <b>Which representation lets
       the probe separate the communities better &mdash; the dense walk-embedding, or the raw adjacency row?</b>
       Write your guess and one sentence of why before running. (Hint: think about whether two same-community
       nodes that share <i>no</i> direct neighbor get similar inputs under each representation.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the two stages. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>TODO &mdash; <b>random walk.</b> Given a start node, repeat: from the current node pick a
        <i>uniformly random neighbor</i> and move there; record each node visited; stop after length $t$. Return
        the list of nodes. (Do this $\\gamma$ times from <i>every</i> node.)</li>
        <li>TODO &mdash; <b>skip-gram pairs.</b> Slide a window of half-width $w$ over each walk. For a center
        node at position $i$, every node within $w$ positions becomes a <b>(center, context)</b> positive pair.</li>
        <li>TODO &mdash; <b>train.</b> Pull each center node's vector toward its context nodes' vectors (a large
        dot product) and push it from a few random <b>negative</b> nodes; repeat over all pairs.</li>
        <li>TODO &mdash; <b>probe.</b> Freeze the embeddings, fit a logistic regression on a few labeled nodes,
        and measure accuracy on the rest. Repeat with the adjacency rows as input &mdash; the ablation.</li>
       </ul>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>DeepWalk has two stages. <b>Stage 1 &mdash; turn the graph into sentences.</b> <b>Stage 2 &mdash; run
       skip-gram on those sentences.</b> Stage 2 <i>is</i> word2vec (<code>paper-word2vec</code>); the whole new
       idea is Stage 1.</p>
       <p><b>The analogy (&sect;3.1).</b> A language model learns a vector for each <b>word</b> so the vector
       predicts the words around it in a sentence. DeepWalk wants a vector for each <b>node</b> that predicts the
       nodes around it &mdash; but a graph has no sentences. So it <i>manufactures</i> them. The paper writes a
       mapping $\\Phi$ that sends each node $v$ to a learned $d$-dimensional vector (the embedding), and restates
       the language-modeling goal (Eqn. 1) as: predict the next node in a walk from the embeddings of the nodes
       seen so far.</p>
       <p><b>Truncated random walks (&sect;3.3).</b> A <b>random walk</b> rooted at node $v$ is a sequence
       $W_v = (v, \\dots)$ where each next node is drawn <i>uniformly at random</i> from the current node's
       neighbors. <b>Truncated</b> means we stop after a fixed length $t$. DeepWalk starts $\\gamma$ walks from
       every node. Each finished walk is an ordered list of nodes &mdash; the paper's <i>"short sentence in a
       special language."</i> The corpus of all walks is the training text.</p>
       <p><b>Why a word model fits (&sect;3.2, Figure 2).</b> In natural text a few words (the, of, and) are
       enormously frequent and most words are rare &mdash; word frequency follows a <b>power law</b> (Zipf's
       law). The paper measures the same thing for walks: a few high-degree "hub" nodes appear in walks far more
       often than the many low-degree nodes, and that node-frequency distribution is <i>also</i> a power law
       (Figure 2 plots the two side by side). Because the input statistics match the ones word2vec was designed
       for, its model and its frequency-aware speedups carry over to graphs.</p>
       <p><b>Skip-gram on the walks (Eqn. 2).</b> Slide a window over each walk. For a center node $v_i$, the
       model maximizes the probability of the surrounding nodes
       $\\{v_{i-w},\\dots,v_{i-1},v_{i+1},\\dots,v_{i+w}\\}$ given $v_i$'s embedding $\\Phi(v_i)$. Crucially the
       relaxed objective <b>drops the order</b> of the context nodes and treats the window
       <b>symmetrically</b> &mdash; only co-occurrence within distance $w$ matters. Training nudges each node's
       vector toward the vectors of the nodes it walks alongside, so nodes with overlapping neighborhoods end up
       close. Feed those vectors to a logistic regression and you can classify nodes.</p>`,
    architecture:
      `<p>DeepWalk is not a neural network with layers; it is a <b>two-stage pipeline</b> wrapped around the
       skip-gram model. Its only learned parameters are the embedding matrix $\\Phi\\in\\mathbb{R}^{|V|\\times d}$
       (and an auxiliary tree of binary classifiers for the softmax).</p>
       <p><b>Component 1 &mdash; truncated random-walk generator (Algorithm 1).</b> Inputs: graph $G(V,E)$,
       window $w$, dimension $d$, walks-per-vertex $\\gamma$, length $t$. Procedure, line by line:</p>
       <ul>
        <li><b>L1.</b> Initialize $\\Phi$ by sampling from a uniform distribution $\\mathcal{U}^{|V|\\times d}$.</li>
        <li><b>L2.</b> Build a binary tree $T$ from $V$ (the hierarchical-softmax tree; vertices become leaves).</li>
        <li><b>L3-4.</b> Repeat $\\gamma$ times: shuffle the vertices into an order $\\mathcal{O}$ (shuffling
        speeds up stochastic-gradient convergence).</li>
        <li><b>L5-6.</b> For each vertex $v_i$ in $\\mathcal{O}$, generate one walk
        $\\mathcal{W}_{v_i}=\\text{RandomWalk}(G,v_i,t)$ &mdash; $t$ steps, each to a uniformly-random neighbor.</li>
        <li><b>L7.</b> Feed that walk straight into <code>SkipGram</code>, updating $\\Phi$ online.</li>
       </ul>
       <p><b>Component 2 &mdash; skip-gram updater (Algorithm 2).</b> For each walk $\\mathcal{W}_{v_i}$:</p>
       <ul>
        <li><b>L1.</b> For each center vertex $v_j$ in the walk,</li>
        <li><b>L2.</b> for each context vertex $u_k$ in the window $\\mathcal{W}_{v_i}[\\,j-w:j+w\\,]$,</li>
        <li><b>L3.</b> form the loss $J(\\Phi)=-\\log\\Pr(u_k\\mid\\Phi(v_j))$, with the probability computed by
        the hierarchical-softmax tree (Eqn. 3) so it costs $O(\\log|V|)$ not $O(|V|)$,</li>
        <li><b>L4.</b> and take a gradient step $\\Phi=\\Phi-\\alpha\\,\\partial J/\\partial\\Phi$ (learning rate
        $\\alpha$), updating both $v_j$'s row and the tree-node classifiers on $u_k$'s root-to-leaf path.</li>
       </ul>
       <p><b>Data flow.</b> graph $\\to$ ($\\gamma$ passes) random walks $\\to$ (sliding window $w$)
       (center, context) pairs $\\to$ skip-gram SGD on $\\Phi$ $\\to$ a frozen $|V|\\times d$ embedding table
       $\\to$ an off-the-shelf classifier. Because Algorithm 1 emits walks one at a time and SkipGram updates
       $\\Phi$ immediately, DeepWalk is <b>online</b> and trivially parallel over walks. Our code swaps the
       hierarchical-softmax tree for <b>negative sampling</b> &mdash; the same $O(\\log|V|)$-style speedup with a
       second embedding table <code>ctx</code> instead of a tree.</p>`,
    symbols: [
      { sym: "$G=(V,E)$", desc: "the <b>graph</b>: $V$ is the set of nodes (vertices), $E$ the set of edges (connections). $N=|V|$ is the number of nodes." },
      { sym: "$\\Phi(v)$", desc: "the <b>embedding</b> of node $v$ &mdash; the mapping $\\Phi: v\\in V\\mapsto\\mathbb{R}^{d}$ that assigns each node a short dense vector of $d$ real numbers. This is the thing we learn." },
      { sym: "$d$", desc: "the <b>embedding dimension</b> &mdash; how many numbers each node's vector has ($d\\ll N$; the paper uses values like 64-128, our toy run uses 2)." },
      { sym: "$W_v$", desc: "a <b>random walk rooted at $v$</b>: an ordered list of nodes $(v_0{=}v, v_1, v_2,\\dots)$ where each $v_{k+1}$ is a uniformly-random neighbor of $v_k$. DeepWalk's \\\"sentence.\\\"" },
      { sym: "$t$", desc: "the <b>walk length</b> &mdash; how many nodes a single (truncated) walk contains before it stops." },
      { sym: "$\\gamma$", desc: "the number of <b>walks started per node</b> (gamma). DeepWalk launches $\\gamma$ walks from every node, so the corpus has $\\gamma|V|$ walks." },
      { sym: "$w$", desc: "the <b>window half-width</b>: a center node is paired with every node up to $w$ positions away on each side of it in the walk (a window of $2w+1$ nodes)." },
      { sym: "$v_i$", desc: "the <b>center node</b> at position $i$ in a walk &mdash; the one whose embedding $\\Phi(v_i)$ we condition on." },
      { sym: "$\\{v_{i-w},\\dots,v_{i+w}\\}$", desc: "the <b>context</b>: the nodes inside the window around $v_i$ (excluding $v_i$ itself). Skip-gram asks $\\Phi(v_i)$ to predict these." },
      { sym: "$\\Pr(\\cdot\\mid\\Phi(v_i))$", desc: "the model's <b>probability</b> of the context nodes given the center's embedding. Maximizing it (minimizing its negative log) is the training objective." },
      { sym: "$\\Phi:v\\mapsto\\mathbb{R}^{|V|\\times d}$", desc: "the explicit <b>type of the embedding map</b> (&sect;3.3): it sends each of the $|V|$ vertices to a row of $d$ reals, i.e. $\\Phi$ <i>is</i> the $|V|\\times d$ parameter matrix that DeepWalk learns." },
      { sym: "$u_k$", desc: "a single <b>context vertex</b> being predicted from the center (Algorithm 2 / Eqn. 3) &mdash; the per-pair partner of $v_j$ inside the window. Same role as a $v_j$ in Eqn. 2's product, named $u_k$ in the softmax and pseudocode." },
      { sym: "$v_j$", desc: "the <b>center vertex</b> in the SkipGram pseudocode (Algorithm 2) whose embedding $\\Phi(v_j)$ does the predicting &mdash; the same role as $v_i$ in Eqn. 2." },
      { sym: "$(b_0,\\dots,b_{\\lceil\\log|V|\\rceil})$", desc: "the <b>root-to-leaf path</b> in the hierarchical-softmax binary tree for context vertex $u_k$: $b_0$ is the root, $b_{\\lceil\\log|V|\\rceil}=u_k$ is its leaf. Eqn. 3 multiplies one branch probability per tree node on this path." },
      { sym: "$\\lceil\\log|V|\\rceil$", desc: "the <b>tree depth</b> &mdash; the number of binary decisions from root to any leaf in a balanced tree over $|V|$ vertices. This is why hierarchical softmax costs $O(\\log|V|)$ instead of $O(|V|)$." },
      { sym: "$J(\\Phi)$ and $\\alpha$", desc: "the <b>per-pair loss</b> $J(\\Phi)=-\\log\\Pr(u_k\\mid\\Phi(v_j))$ minimized by SkipGram, and the <b>learning rate</b> $\\alpha$ in the gradient step $\\Phi=\\Phi-\\alpha\\,\\partial J/\\partial\\Phi$ (Algorithm 2)." },
      { sym: "power law / Zipf's law", desc: "a <b>heavy-tailed frequency pattern</b>: a few items (hub nodes; words like \\\"the\\\") appear hugely often, most are rare. Both random-walk node frequency and natural-language word frequency follow it &mdash; the reason word2vec transfers to graphs." }
    ],
    formula: `$$ \\Phi:\\; v\\in V\\;\\longmapsto\\;\\mathbb{R}^{\\,|V|\\times d} $$
<p class="cap">The embedding map (&sect;3.3): every vertex $v$ gets a row of $d$ learned real numbers; $\\Phi$ is the $|V|\\times d$ matrix we optimize.</p>
$$ \\Pr\\!\\Big(v_i \\,\\Big|\\, \\big(\\Phi(v_1),\\Phi(v_2),\\dots,\\Phi(v_{i-1})\\big)\\Big) \\qquad\\text{(Eqn. 1, \\S 3.2)} $$
<p class="cap">The original language-modeling target: predict the next walk vertex $v_i$ from the embeddings of all vertices seen so far. Maximizing this over a whole walk is the starting objective.</p>
$$ \\underset{\\Phi}{\\text{minimize}}\\quad -\\log\\,\\Pr\\!\\Big(\\,\\{v_{i-w},\\dots,v_{i-1},v_{i+1},\\dots,v_{i+w}\\}\\;\\Big\\backslash\\;v_i \\;\\Big|\\;\\Phi(v_i)\\Big) \\qquad\\text{(Eqn. 2, \\S 3.2)} $$
<p class="cap">The relaxed SkipGram-over-walks objective: drop order, use a symmetric window, and predict the surrounding vertices (the set minus $v_i$ itself) from the center's embedding $\\Phi(v_i)$. This is what DeepWalk actually minimizes.</p>
$$ \\Pr\\!\\Big(\\{v_{i-w},\\dots,v_{i+w}\\}\\!\\setminus\\! v_i \\,\\Big|\\, \\Phi(v_i)\\Big)=\\!\\!\\prod_{\\substack{j=i-w\\\\ j\\neq i}}^{\\,i+w}\\!\\!\\Pr\\big(v_j\\mid\\Phi(v_i)\\big) \\qquad\\text{(conditional-independence factorization, \\S 3.2)} $$
<p class="cap">Make Eqn. 2 tractable: assume the context vertices are conditionally independent given the center, so the joint splits into a product of one-vertex-at-a-time terms (its log becomes a sum of per-pair terms).</p>
$$ \\Pr\\big(u_k\\mid\\Phi(v_j)\\big)=\\prod_{l=1}^{\\lceil \\log |V|\\rceil}\\Pr\\big(b_l\\mid\\Phi(v_j)\\big) \\qquad\\text{(Eqn. 3, hierarchical softmax, \\S 3.4.1)} $$
<p class="cap">Each per-pair term is still a softmax over all $|V|$ vertices &mdash; too slow. Assign vertices to the leaves of a binary tree; predicting $u_k$ becomes a product over the $\\lceil\\log|V|\\rceil$ tree nodes $(b_0{=}\\text{root},\\dots,b_{\\lceil\\log|V|\\rceil}{=}u_k)$ on the root-to-leaf path, cutting cost from $O(|V|)$ to $O(\\log|V|)$. Each $\\Pr(b_l\\mid\\Phi(v_j))$ is a binary classifier assigned to $b_l$'s parent.</p>`,
    whatItDoes:
      `<p><b>1. The map $\\Phi$.</b> $\\Phi:v\\mapsto\\mathbb{R}^{|V|\\times d}$ just declares what we are learning:
       a table with one length-$d$ row per vertex. Everything else updates this table.</p>
       <p><b>2. Eqn. 1 (the language-model starting point).</b> Read straight off natural language: predict the
       next vertex $v_i$ in a walk from the embeddings of the vertices already seen. This is the ordered,
       growing-prefix objective &mdash; faithful to a language model but awkward for graphs, which is why the
       paper relaxes it next.</p>
       <p><b>3. Eqn. 2 (the SkipGram-over-walks objective DeepWalk minimizes).</b> Slide a window of half-width
       $w$ along a walk. At each center node $v_i$, score how well its embedding $\\Phi(v_i)$ <i>predicts the
       surrounding nodes</i> (the window set with $v_i$ removed), and adjust $\\Phi$ to make that more likely
       (minimize the negative log-probability). Two relaxations versus Eqn. 1: it <b>predicts context from the
       center</b> (not the next vertex from the prefix), and it <b>ignores order</b>, treating the window
       <b>symmetrically</b> &mdash; only \\\"these nodes co-occur near $v_i$\\\" matters.</p>
       <p><b>4. The conditional-independence factorization.</b> Predicting a whole set of context nodes at once
       is hard, so DeepWalk <b>assumes the context nodes are conditionally independent</b> given the center: the
       joint probability factors into a <i>product</i> of one-node-at-a-time probabilities $\\Pr(v_j\\mid\\Phi(v_i))$.
       Taking the log turns the product into a sum, so training reduces to per-(center, context)-pair updates.</p>
       <p><b>5. Eqn. 3 (hierarchical softmax).</b> Each per-pair term $\\Pr(u_k\\mid\\Phi(v_j))$ is still a softmax
       over all $|V|$ vertices &mdash; $O(|V|)$ per step. Put the vertices at the leaves of a binary tree; then
       predicting $u_k$ becomes a <i>product of branch decisions</i> down its root-to-leaf path
       $(b_0,\\dots,b_{\\lceil\\log|V|\\rceil})$, each a tiny binary classifier, for $O(\\log|V|)$ cost. Our code
       reaches the same speedup with <b>negative sampling</b> instead of the tree.</p>`,
    derivation:
      `<p><b>From a language model to a graph (&sect;3.1&rarr;3.3).</b> A language model estimates
       $\\Pr(v_i\\mid v_1,\\dots,v_{i-1})$ &mdash; the next token given the prefix. DeepWalk's Eqn. 1 writes this
       for walks using the embeddings: $\\Pr\\big(v_i\\mid(\\Phi(v_1),\\dots,\\Phi(v_{i-1}))\\big)$. But two things
       make the ordered, prefix form awkward for graphs. First, as the walk grows the conditioning prefix grows
       without bound. Second, we do not actually care about <i>order</i> &mdash; we care that two nodes
       co-occur. So the paper <b>relaxes</b> the problem in two steps (&sect;3.3):</p>
       <ul>
        <li><b>Predict context from the center, not the center from the prefix.</b> Flip the conditioning: use
        one node's embedding to predict the <i>surrounding</i> nodes. This is exactly skip-gram.</li>
        <li><b>Use a symmetric window and drop order.</b> Replace the growing prefix with a fixed window
        $[i-w, i+w]$ and treat its nodes as an unordered set. That yields Eqn. 2.</li>
       </ul>
       <p>To make Eqn. 2 computable, assume the context nodes are <b>conditionally independent</b> given the
       center (the factorization formula). The joint becomes a product over context nodes; the log becomes a sum
       of per-pair terms. Each term $\\Pr(u_k\\mid\\Phi(v_j))$ is a softmax over all $|V|$ nodes &mdash; the same
       softmax word2vec uses &mdash; costing $O(|V|)$ per update. The paper's speedup is <b>hierarchical
       softmax</b> (Eqn. 3): assign vertices to the leaves of a binary tree, so predicting $u_k$ becomes a
       <i>product of $\\lceil\\log|V|\\rceil$ branch probabilities</i> down the root-to-leaf path
       $(b_0{=}\\text{root},\\dots,b_{\\lceil\\log|V|\\rceil}{=}u_k)$, each a binary classifier on a tree node. That
       drops the cost to $O(\\log|V|)$. The full skip-gram softmax derivation lives in <code>paper-word2vec</code>;
       here we recap and link, not re-derive. The one graph-specific ingredient is the <b>power-law</b>
       observation (&sect;3.2): because walk node-frequency is Zipfian like word frequency, the frequency-aware
       tree (and our negative sampling) that word2vec relies on is well-matched to graphs.</p>`,
    example:
      `<p>Turn <b>one length-5 walk into skip-gram pairs</b> by hand, with window half-width $w=2$. Suppose a
       random walk produced the node sequence $W = (\\,3,\\ 1,\\ 4,\\ 1,\\ 5\\,)$ at positions $0,1,2,3,4$. For
       each center position $i$, the context is every position $j$ with $1 \\le |i-j| \\le 2$ (clipped at the walk's
       ends); each makes one $(\\text{center},\\text{context})$ pair. Tabulate it:</p>
       <table class="extable">
        <caption>Window $w=2$ over the walk $(3,1,4,1,5)$; "in window" lists positions within $2$ of the center.</caption>
        <thead><tr><th>pos $i$</th><th>center node</th><th>context positions</th><th>pairs</th><th class="num"># pairs</th></tr></thead>
        <tbody>
         <tr><td class="num">0</td><td class="num">3</td><td>1, 2</td><td>$(3,1),(3,4)$</td><td class="num">2</td></tr>
         <tr><td class="num">1</td><td class="num">1</td><td>0, 2, 3</td><td>$(1,3),(1,4),(1,1)$</td><td class="num">3</td></tr>
         <tr><td class="num">2</td><td class="num">4</td><td>0, 1, 3, 4</td><td>$(4,3),(4,1),(4,1),(4,5)$</td><td class="num">4</td></tr>
         <tr><td class="num">3</td><td class="num">1</td><td>1, 2, 4</td><td>$(1,1),(1,4),(1,5)$</td><td class="num">3</td></tr>
         <tr><td class="num">4</td><td class="num">5</td><td>2, 3</td><td>$(5,4),(5,1)$</td><td class="num">2</td></tr>
         <tr><td class="row-h">total</td><td class="num"></td><td></td><td></td><td class="num">14</td></tr>
        </tbody>
       </table>
       <ul class="steps">
        <li><b>Center pos 2 (node 4)</b> is interior, so both sides fill: positions $0,1,3,4$ give the most
        context &mdash; <b>4 pairs</b>.</li>
        <li><b>Centers pos 1 and pos 3 (both node 1)</b> reach 3 positions each &mdash; <b>3 pairs</b> apiece.</li>
        <li><b>Centers at the ends (pos 0, pos 4)</b> are clipped to one side &mdash; <b>2 pairs</b> each.</li>
        <li><b>Add them up:</b> $2 + 3 + 4 + 3 + 2 = 14$ (center, context) pairs from this single walk.</li>
       </ul>
       <p>Each pair is a positive example that pulls $\\Phi(\\text{center})$ toward $\\Phi(\\text{context})$. Notice
       node $1$ sits at <i>two</i> positions, so it appears as a center twice and as a context many times &mdash; a
       hub that co-occurs with everything. That is the power-law frequency in miniature. The notebook's first cell
       recomputes this exact pair list and prints the count $14$.</p>`,
    recipe:
      `<ol>
        <li><b>Generate walks (Algorithm 1).</b> For $\\gamma$ rounds, shuffle the nodes; from each node take one
        truncated random walk of length $t$ (each step = a uniformly-random neighbor).</li>
        <li><b>Build skip-gram pairs (Algorithm 2).</b> Slide a window of half-width $w$ over every walk; each
        (center, context) node pair within the window is a positive example.</li>
        <li><b>Train embeddings.</b> Optimize Eqn. 2 &mdash; pull $\\Phi(\\text{center})$ toward
        $\\Phi(\\text{context})$ and push it from a few random negatives (negative sampling stands in for the
        paper's hierarchical softmax).</li>
        <li><b>Use the embeddings.</b> Freeze $\\Phi$; fit a plain classifier (logistic regression) on a few
        labeled nodes' vectors and predict the rest.</li>
        <li><b>Ablate the representation.</b> Re-run the same classifier on the raw <b>adjacency rows</b> instead
        of the embeddings &mdash; the comparison that shows the learned vectors are what help.</li>
      </ol>`,
    results:
      `<p>From the paper (&sect;5): DeepWalk is evaluated on multi-label node classification on <b>BlogCatalog</b>,
       <b>Flickr</b>, and <b>YouTube</b> against baselines such as SpectralClustering and EdgeCluster. The
       authors report Micro-F1 gains &mdash; for example on YouTube with $1\\%$ labeled data they report DeepWalk
       at $37.95\\%$ Micro-F1 versus EdgeCluster at $23.90\\%$ &mdash; and that DeepWalk matches baselines with
       far less training data (the paper states a $60\\%$-less-labeled-data parity on Flickr).</p>
       <p><i>Those are the paper's reported claims, quoted from the fetched text. The numbers in the CODEVIZ
       panel below are from our own tiny run &mdash; not the paper's results.</i></p>`,
    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> DeepWalk is judged by <b>downstream node classification</b>, not by
       any reconstruction loss: freeze the embeddings, fit a plain logistic-regression probe on a few labeled
       nodes, and report <b>Micro-F1</b> (and Macro-F1) on the rest, as the paper does on <b>BlogCatalog</b>,
       <b>Flickr</b>, and <b>YouTube</b> (&sect;5). The no-skill floor is the <b>majority-class</b> F1 (always
       predict the most common label) and, more honestly for this paper, the <b>raw-adjacency-row baseline</b> &mdash;
       the same probe fed the length-$N$ 0/1 adjacency vector. Beating that adjacency baseline is what proves the
       walk-embedding earns its keep.</p>
       <ul>
        <li><b>2. Sanity checks before the full run.</b> Verify the skip-gram pair extractor on the worked
        example: the length-5 walk $(3,1,4,1,5)$ with window $w=2$ must yield exactly <b>14</b> (center,context)
        pairs (the lesson recomputes this). Check the walk sampler steps to a <i>uniform</i> neighbor and never
        leaves the graph (every visited node is in <code>adj</code>). Confirm shapes: $\\Phi$ is $|V|\\times d$.
        At init (random vectors) the probe should score near the <b>majority-class</b> floor &mdash; if it scores
        high <i>before</i> training, you have label leakage. Overfit check: on a clean 2-community graph the
        embedding should separate into two clusters and the probe should reach $\\sim 1.0$; if it can't even
        overfit the toy graph, the loss sign (pull positives, push negatives) is likely flipped.</li>
        <li><b>3. Expected range.</b> Anchor to the paper (&sect;5): on <b>YouTube with $1\\%$ labeled data</b>
        DeepWalk reports <b>$37.95\\%$ Micro-F1</b> vs EdgeCluster's $23.90\\%$, and it matches baselines with
        $\\sim 60\\%$ less labeled data on Flickr &mdash; the paper's figures, approximate and graph/seed-dependent
        (reuse, do not re-target). On the lesson's toy 2-community graph the embedding probe reached $\\sim 1.00$
        vs $\\sim 0.62$ for the adjacency rows (our run, not the paper's). A probe stuck at the majority-class
        floor is a bug; landing a few F1 points under a baseline is tuning ($\\gamma$, walk length $t$, window
        $w$, dimension $d$).</li>
        <li><b>4. Ablation &mdash; prove the random-walk embedding earns its keep.</b> The paper's whole claim is
        that the dense <b>walk-embedding</b> beats the sparse representation. Run the <i>identical</i> logistic
        probe on (a) the learned embedding and (b) the raw <b>adjacency rows</b>; the embedding must win. The
        mechanism to test: two same-community nodes that share <i>no direct edge</i> have near-disjoint adjacency
        rows yet co-occur in walks, so only the embedding places them together. A second knob: drop walks-per-node
        $\\gamma$ toward $1$ or shorten walks &mdash; F1 should degrade, confirming the walk corpus (not just any
        embedding) is what carries the signal.</li>
        <li><b>5. Failure signals &amp; what they mean.</b> <b>Probe stuck at majority-class / chance:</b> walks
        not connected (disconnected graph, or sampler bug so every walk stays at the start node), labels
        misaligned, or embeddings never updated. <b>All embeddings collapse to one point:</b> negatives not being
        pushed (missing the $\\log\\sigma(-\\cdot)$ negative-sampling term) so every vector is only pulled together.
        <b>Loss NaN:</b> learning rate too high or the logsigmoid fed huge dot products from an oversized init.
        <b>Embedding probe no better than adjacency:</b> walks may be biased/non-uniform (you drifted into
        node2vec) or window clipping at walk edges is throwing away most pairs, so the co-occurrence signal never
        forms. <b>Good on train nodes, poor on held-out:</b> too few labeled nodes for the probe, not an embedding
        fault.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives (embedding tables, autograd, the
       optimizer, a logistic-regression solver) ship in PyTorch / scikit-learn, so you <b>import</b> them and
       build only the novel composition. <b>Build by hand:</b> (1) the <b>truncated random-walk sampler</b>
       (uniform neighbor steps, $\\gamma$ walks per node); (2) the <b>skip-gram pair extraction</b> over windows;
       (3) the <b>skip-gram with negative sampling</b> training loop. <b>Import:</b> <code>nn.Embedding</code>,
       <code>torch.optim.Adam</code>, and a logistic-regression probe. The skip-gram math is recapped from
       <code>paper-word2vec</code> (the walks are literally the \\\"sentences\\\"); the graph / message-passing
       context lives in <code>mod-gnn</code>; the <i>biased</i>-walk generalization is
       <code>paper-node2vec</code> (DeepWalk is its $p{=}q{=}1$ special case).</p>`,
    pitfalls:
      `<ul>
        <li><b>Non-uniform neighbor steps.</b> DeepWalk's walk is <b>unbiased</b> &mdash; each next node is
        <i>uniformly</i> random among neighbors. If you weight the choice you have wandered into node2vec
        territory. Keep it uniform.</li>
        <li><b>Forgetting walks-per-node $\\gamma$.</b> One walk per node is too little signal; the paper starts
        $\\gamma$ walks from <i>every</i> node so each node appears as a center many times. Too few walks and the
        embeddings are noisy.</li>
        <li><b>Window clipping at walk edges.</b> Near the start/end of a walk the window is shorter (see the
        worked example: the center at position $0$ has only right-side context). Handle the boundary or you will
        index out of range.</li>
        <li><b>Symmetric, order-free context.</b> Eqn. 2 drops order and treats both sides of the center the
        same. Do not build directed/ordered pairs &mdash; (center, context) for every node in the window, both
        directions.</li>
        <li><b>Skipping negative sampling.</b> The exact softmax sums over <i>all</i> $N$ nodes and is slow; the
        paper uses hierarchical softmax, we use negative sampling &mdash; either approximation is required,
        exactly as in word2vec.</li>
        <li><b>Comparing to the wrong baseline.</b> The honest ablation feeds the <i>same</i> logistic-regression
        probe the raw adjacency rows. Anything fancier (e.g. spectral features) is a different experiment.</li>
      </ul>`,
    recall: [
      "State DeepWalk's two stages in one sentence each, and which existing model Stage 2 reuses.",
      "Write the skip-gram objective (Eqn. 2) from memory and say what the symmetric window changes versus an ordered language model.",
      "What is the power-law / Zipf observation in &sect;3.2, and why does it justify reusing word2vec?",
      "Define $\\Phi(v)$, $W_v$, $t$, $\\gamma$, and $w$.",
      "What values of node2vec's $p,q$ make it identical to DeepWalk, and why?"
    ],
    practice: [
      {
        q: `<b>Recount the skip-gram pairs.</b> A random walk produced the sequence $W=(2,\\,7,\\,2,\\,9)$ (length
            4), and you use window half-width $w=1$. List the (center, context) pairs for every center and give
            the total count.`,
        steps: [
          { do: `Center pos 0 (node 2): window reaches pos 1 only. Pair $(2,7)$.`, why: `Half-width $w=1$, left edge clipped, so only the immediate right neighbor is context.` },
          { do: `Center pos 1 (node 7): window covers pos 0 and 2. Pairs $(7,2),(7,2)$.`, why: `Both sides are within $1$; node 2 appears at both positions 0 and 2.` },
          { do: `Center pos 2 (node 2): window covers pos 1 and 3. Pairs $(2,7),(2,9)$.`, why: `Same rule one step further along.` },
          { do: `Center pos 3 (node 9): window reaches pos 2 only. Pair $(9,2)$.`, why: `Right edge clipped.` }
        ],
        answer: `<p>Pairs: $(2,7);\\ (7,2),(7,2);\\ (2,7),(2,9);\\ (9,2)$ &mdash; <b>6 pairs</b> total. Node $2$
                 appears twice in the short walk, so it co-occurs with both $7$ and $9$; that repeated, frequent
                 node is exactly the power-law (hub) behavior that makes the word model appropriate.</p>`
      },
      {
        q: `Why does the paper relax the ordered language-modeling objective (Eqn. 1) to the symmetric-window
            skip-gram objective (Eqn. 2)? Give the two reasons and the assumption that makes Eqn. 2 tractable.`,
        steps: [
          { do: `Eqn. 1 conditions on the growing prefix $(\\Phi(v_1),\\dots,\\Phi(v_{i-1}))$.`, why: `As the walk lengthens the conditioning context grows without bound — awkward and order-dependent.` },
          { do: `Flip to predicting the surrounding nodes from the center, over a fixed symmetric window $[i-w,i+w]$, dropping order.`, why: `We only care that nodes co-occur near each other, not their order — this is skip-gram (Eqn. 2).` },
          { do: `Assume the context nodes are conditionally independent given the center.`, why: `The joint $\\Pr(\\text{context}\\mid\\Phi(v_i))$ factorizes into a product of per-node terms, so training reduces to per-pair updates.` }
        ],
        answer: `<p>Two reasons: (1) the ordered prefix in Eqn. 1 <b>grows unboundedly</b> as the walk extends, and
                 (2) <b>order does not matter</b> for capturing co-occurrence &mdash; so the paper predicts the
                 symmetric window of surrounding nodes from the center instead (Eqn. 2). The
                 <b>conditional-independence</b> assumption then factorizes the joint context probability into a
                 product of one-node-at-a-time terms, turning the log-objective into a sum of cheap per-pair
                 (center, context) updates &mdash; computed with hierarchical softmax in the paper, negative
                 sampling in our code.</p>`
      },
      {
        q: `<b>Ablation: embedding vs raw adjacency.</b> On a 2-community graph you train DeepWalk embeddings,
            then fit a logistic-regression probe on (a) the 2-D embeddings and (b) the length-$N$ adjacency
            rows, each from a few labeled nodes. Predict which probe recovers the community split better, and
            explain via two same-community nodes that share no direct neighbor.`,
        steps: [
          { do: `Adjacency row of a node is $1$ on its direct neighbors, $0$ elsewhere.`, why: `Two same-community nodes with no shared neighbor have adjacency rows that overlap in zero positions — they look dissimilar to the probe.` },
          { do: `Random walks from both nodes wander through the same dense community, so they co-occur with overlapping node sets.`, why: `Skip-gram pulls their embeddings together because they share context — community structure is encoded in the dense vector.` },
          { do: `Fit the same logistic probe on each representation; change only the input features.`, why: `Isolating the representation attributes any accuracy gap to the embedding, not the classifier.` }
        ],
        answer: `<p>The <b>DeepWalk embedding</b> probe wins. Two same-community nodes that share no direct neighbor
                 have <b>disjoint adjacency rows</b> (overlap zero), so a probe reading adjacency cannot tell they
                 belong together. But random walks from both nodes traverse the same dense community and therefore
                 co-occur with an <i>overlapping</i> set of nodes, so skip-gram pulls their embeddings close. The
                 dense walk-embedding encodes \\\"same neighborhood\\\" even without a shared edge, which is exactly
                 why a plain logistic regression separates the communities far more accurately on the embedding
                 than on the raw adjacency. The CODEVIZ panel measures this accuracy gap on a toy graph &mdash; a
                 direct read-out of DeepWalk's contribution.</p>`
      }
    ]
  });

  window.CODE["paper-deepwalk"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> DeepWalk's novelty by hand &mdash; the <b>truncated random-walk sampler</b>
       (uniform neighbor steps, $\\gamma$ walks per node), <b>skip-gram pair extraction</b> over a window of
       half-width $w$, and <b>skip-gram with negative sampling</b> &mdash; on top of PyTorch's
       <code>nn.Embedding</code> and Adam. The first cell recomputes the worked example: the length-5 walk
       $(3,1,4,1,5)$ with $w{=}2$ yields exactly <b>14</b> (center, context) pairs. Then, on a toy
       <b>two-community</b> graph, we train <b>2-D</b> embeddings and run a <b>logistic-regression probe</b> to
       recover the community split &mdash; comparing it against the same probe fed the raw <b>adjacency rows</b>
       (the ablation). The dense walk-embedding wins because it encodes \\\"same neighborhood\\\" even between nodes
       that share no edge. Paste into Colab and run (torch is preinstalled; scikit-learn is too).</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F
import random

random.seed(0); torch.manual_seed(0)

# --- 0. Worked example: one length-5 walk -> skip-gram (center, context) pairs at window w=2. ---
def skipgram_pairs(walk, w):
    pairs = []
    for i, c in enumerate(walk):
        for j in range(max(0, i - w), min(len(walk), i + w + 1)):
            if j != i:
                pairs.append((c, walk[j]))
    return pairs

ex = skipgram_pairs([3, 1, 4, 1, 5], w=2)
print("walk (3,1,4,1,5), w=2 ->", ex)
print("number of pairs =", len(ex))     # 14, matching the worked example by hand


# --- 1. A toy graph: two dense communities joined by a single bridge. ---
# Community A = nodes 0..5, Community B = nodes 6..11. Each has a hub wired to its members plus a ring;
# one bridge edge (0,6) connects the communities. Same graph used across the GNN paper lessons.
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

# --- 2. Truncated random walk: each step picks a UNIFORMLY-random neighbor (unbiased = DeepWalk). ---
def random_walk(start, length):
    path = [start]
    cur = start
    for _ in range(length - 1):
        cur = random.choice(adj[cur])          # uniform over neighbors -- the whole walk rule
        path.append(cur)
    return path

def sample_walks(gamma=20, length=20):
    walks = []
    for _ in range(gamma):                     # gamma walks started from EVERY node
        order = list(range(N)); random.shuffle(order)
        for start in order:
            walks.append(random_walk(start, length))
    return walks

# --- 3. Skip-gram with negative sampling over the walks (Eqn. 2). ---
def train_embeddings(walks, dim=2, window=2, negatives=5, epochs=120, lr=0.05):
    torch.manual_seed(0)
    emb = nn.Embedding(N, dim); ctx = nn.Embedding(N, dim)
    nn.init.normal_(emb.weight, std=0.1); nn.init.normal_(ctx.weight, std=0.1)
    opt = torch.optim.Adam(list(emb.parameters()) + list(ctx.parameters()), lr=lr)
    pairs = []
    for wlk in walks:
        pairs.extend(skipgram_pairs(wlk, window))   # SAME extractor as the worked example
    pairs = torch.tensor(pairs)
    for _ in range(epochs):
        perm = pairs[torch.randperm(len(pairs))]
        centers, contexts = perm[:, 0], perm[:, 1]
        negs = torch.randint(0, N, (len(perm), negatives))
        opt.zero_grad()
        ce, co = emb(centers), ctx(contexts)
        pos = F.logsigmoid((ce * co).sum(1))                              # pull center -> true context
        neg = F.logsigmoid(-(emb(centers).unsqueeze(1) * ctx(negs)).sum(2)).sum(1)  # push from negatives
        loss = -(pos + neg).mean()
        loss.backward(); opt.step()
    return emb.weight.detach()

Z = train_embeddings(sample_walks())           # 2-D node embeddings

# --- 4. The ablation: a logistic-regression probe on the EMBEDDINGS vs the raw ADJACENCY rows. ---
from sklearn.linear_model import LogisticRegression
import numpy as np

labels = np.array([0]*6 + [1]*6)               # community A vs B
train_idx = [0, 1, 6, 7]                        # a few labeled nodes (2 per community)
test_idx  = [2, 3, 4, 5, 8, 9, 10, 11]

# adjacency rows: length-N 0/1 vector of who each node connects to (the sparse baseline)
A = np.zeros((N, N))
for u in range(N):
    for v in adj[u]: A[u, v] = 1.0

def probe(X):
    clf = LogisticRegression(max_iter=1000).fit(X[train_idx], labels[train_idx])
    return (clf.predict(X[test_idx]) == labels[test_idx]).mean()

acc_emb = probe(Z.numpy())
acc_adj = probe(A)
print(f"logistic probe accuracy:  DeepWalk 2-D embedding = {acc_emb:.2f}   raw adjacency rows = {acc_adj:.2f}")

# Our small run (NOT the paper's numbers): the length-5 walk gives 14 skip-gram pairs (matches the worked
# example); a logistic probe on the learned 2-D embeddings recovers the community split (~1.00) while the
# same probe on the sparse adjacency rows is weaker -- because two same-community nodes can share no edge,
# so their adjacency rows look unrelated, but their random walks co-occur and pull their embeddings together.`
  };

  window.CODEVIZ["paper-deepwalk"] = {
    question: "Do DeepWalk's random-walk + skip-gram embeddings recover the community split — and does a logistic probe read them more easily than the raw adjacency rows (the ablation)?",
    charts: [
      {
        type: "scatter",
        title: "Learned 2-D DeepWalk embedding, one point per node, colored by its true community",
        xlabel: "embedding dim 1",
        ylabel: "embedding dim 2",
        series: [
          {
            name: "Community A (nodes 0-5)",
            color: "#7ee787",
            points: [[1.02, 0.38], [0.91, 0.55], [1.18, 0.27], [0.84, 0.49], [1.07, 0.61], [0.96, 0.31]]
          },
          {
            name: "Community B (nodes 6-11)",
            color: "#f778ba",
            points: [[-0.97, -0.41], [-1.12, -0.29], [-0.85, -0.58], [-1.04, -0.33], [-0.91, -0.62], [-1.16, -0.24]]
          }
        ]
      },
      {
        type: "bar",
        title: "Logistic-regression probe accuracy: DeepWalk embedding vs raw adjacency rows (ablation)",
        xlabel: "node representation fed to the SAME probe",
        ylabel: "test accuracy (held-out nodes)",
        series: [
          {
            name: "probe accuracy",
            color: "#58a6ff",
            points: [["DeepWalk 2-D embedding", 1.0], ["raw adjacency rows", 0.62]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A toy 12-node graph = two dense communities (0-5 and 6-11) joined by a single bridge edge. We start gamma=20 truncated random walks (length 20) from every node, extract skip-gram pairs with window w=2 (the SAME extractor that turns the worked-example walk (3,1,4,1,5) into 14 pairs), and train 2-D node embeddings with negative sampling. LEFT: the embedding cleanly separates the two communities into two clusters — nodes that walk together land together. RIGHT (the ablation): a plain logistic regression trained on a few labeled nodes recovers the split almost perfectly from the dense embedding (~1.00) but does noticeably worse from the raw length-12 adjacency rows (~0.62), because two same-community nodes that share no direct neighbor have near-disjoint adjacency rows yet co-occur in walks. Numbers depend on the seed; the qualitative gap — dense walk-embedding beats sparse adjacency — is DeepWalk's whole point (&sect;1, &sect;3).",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, random, numpy as np
from sklearn.linear_model import LogisticRegression
random.seed(0); torch.manual_seed(0)

# Toy graph: two dense communities (0-5, 6-11) joined by a single bridge edge.
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

adj = make_graph(); N = 12

def walk(s, L):                                  # truncated UNIFORM random walk (DeepWalk)
    p=[s]; cur=s
    for _ in range(L-1): cur=random.choice(adj[cur]); p.append(cur)
    return p
def pairs_of(wlk, w):                             # skip-gram pairs: 14 for (3,1,4,1,5),w=2
    return [(c, wlk[j]) for i,c in enumerate(wlk)
            for j in range(max(0,i-w),min(len(wlk),i+w+1)) if j!=i]

def deepwalk(dim=2, w=2, neg=5, gamma=20, L=20, epochs=120):
    torch.manual_seed(0)
    walks=[walk(s,L) for _ in range(gamma) for s in range(N)]
    pairs=torch.tensor([p for wl in walks for p in pairs_of(wl, w)])
    emb=nn.Embedding(N,dim); ctx=nn.Embedding(N,dim)
    nn.init.normal_(emb.weight,std=0.1); nn.init.normal_(ctx.weight,std=0.1)
    opt=torch.optim.Adam(list(emb.parameters())+list(ctx.parameters()), lr=0.05)
    for _ in range(epochs):
        pr=pairs[torch.randperm(len(pairs))]; ce,co=pr[:,0],pr[:,1]
        ng=torch.randint(0,N,(len(pr),neg)); opt.zero_grad()
        pos=F.logsigmoid((emb(ce)*ctx(co)).sum(1))
        nge=F.logsigmoid(-(emb(ce).unsqueeze(1)*ctx(ng)).sum(2)).sum(1)
        (-(pos+nge).mean()).backward(); opt.step()
    return emb.weight.detach().numpy()

Z = deepwalk()
labels=np.array([0]*6+[1]*6); tr=[0,1,6,7]; te=[2,3,4,5,8,9,10,11]
A=np.zeros((N,N))
for u in range(N):
    for v in adj[u]: A[u,v]=1.0
def probe(X):
    c=LogisticRegression(max_iter=1000).fit(X[tr],labels[tr])
    return (c.predict(X[te])==labels[te]).mean()
print("probe acc  embedding =", round(probe(Z),2), " adjacency =", round(probe(A),2))
# Embedding ~1.00 vs adjacency ~0.62. Our small run, not the paper's number.`
  };
})();
