/* Paper lesson — "Semi-Supervised Classification with Graph Convolutional Networks" (GCN), Kipf & Welling 2016/2017.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-gcn".
   GROUNDED from arXiv:1609.02907 (abstract) and the ar5iv HTML mirror (Section 2.2 Eqn 2 & 8, Section 3.1 Eqn 9 & 10).
   Track B (architecture): build the graph-convolution layer (normalized adjacency S = D-hat^{-1/2} A-hat D-hat^{-1/2}
   and the propagation S H W) by hand from raw torch tensors on a tiny synthetic community graph; do semi-supervised
   node classification from a couple of labels. The message-passing intuition lives in concept mod-gnn; here we recap. */
(function () {
  window.LESSONS.push({
    id: "paper-gcn",
    title: "GCN — Semi-Supervised Classification with Graph Convolutional Networks (2017)",
    tagline: "Each layer mixes every node with its neighbours through one fixed normalized-adjacency matrix, so a handful of labels spread across the whole graph.",
    module: "Papers · Graph Neural Networks",
    track: "architecture",
    paper: {
      authors: "Thomas N. Kipf, Max Welling",
      org: "University of Amsterdam",
      year: 2017,
      venue: "arXiv:1609.02907 (Sept 2016); ICLR 2017",
      citations: "",
      arxiv: "https://arxiv.org/abs/1609.02907",
      code: "https://github.com/tkipf/gcn"
    },
    conceptLink: "mod-gnn",
    partOf: [
      { capstone: "capstone-gnn", step: 1, builds: "the graph-convolution layer + semi-supervised node classification" }
    ],
    prereqs: ["mod-gnn", "dl-backprop", "la-matmul", "dl-cross-entropy", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p>The data here is a <b>graph</b>: a set of <b>nodes</b> (e.g. scientific papers) joined by <b>edges</b>
       (e.g. one paper citing another). We want to label every node (which topic is each paper about?) but we
       only have labels for a <i>few</i> of them. That is the <b>semi-supervised</b> setting: many nodes, few
       labels, and a graph that tells us which nodes are related.</p>
       <p>Before this paper, the standard move was clumsy. You either ignored the graph and ran a plain
       classifier on each node's features (throwing away the connections), or you bolted on a separate
       <b>graph-regularization</b> term &mdash; an extra penalty that just says "connected nodes should get
       similar labels" &mdash; which the paper notes "relies on the assumption that connected nodes ... are
       likely to share the same label" and so "limits modeling capacity" (&sect;1). Neither approach lets the
       network <i>learn</i> how to use the graph structure itself.</p>
       <p>The other obstacle was efficiency. Earlier "spectral" graph networks defined convolution through the
       graph's eigenvectors, which is expensive (an eigendecomposition) and non-local. The paper wanted
       something that <b>scales linearly in the number of edges</b> and reads only each node's immediate
       neighbours.</p>`,
    contribution:
      `<ul>
        <li><b>A simple, fast graph-convolution layer.</b> One layer is a single matrix product: mix every
        node's vector with its neighbours' vectors using a fixed <b>normalized adjacency matrix</b>, then apply
        a learned linear map and a nonlinearity. The abstract states the model "scales linearly in the number
        of graph edges."</li>
        <li><b>The renormalization trick.</b> Add a self-loop to every node ($\\tilde{A} = A + I$) and normalize
        symmetrically by node degree. This keeps the operation numerically stable when you stack several layers
        (it constrains the eigenvalues to a safe range).</li>
        <li><b>End-to-end semi-supervised learning on graphs.</b> Train the whole network with an ordinary
        cross-entropy loss computed <i>only on the few labeled nodes</i>; the graph structure carries the
        signal to the unlabeled ones. The abstract reports it "outperforms related methods by a significant
        margin."</li>
      </ul>`,
    whyItMattered:
      `<p>This layer is the canonical entry point to the whole field of <b>Graph Neural Networks (GNNs)</b>:
       networks that operate directly on graph-structured data. The "mix-with-neighbours, then transform"
       template here is the simplest member of the <b>message-passing</b> family that later models
       (GraphSAGE's sampling, Graph Attention Networks' learned edge weights) generalize. GCNs are now a
       default baseline for node classification, link prediction, and recommendation over graphs.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2 &amp; &sect;2.2 (Fast Approximate Convolutions on Graphs)</b> &mdash; this is the core.
        It derives the layer-wise rule (<b>Eqn. 2</b>), introduces self-loops $\\tilde{A}=A+I_N$, and gives the
        <b>renormalization trick</b> (the line just before <b>Eqn. 8</b>). This is the math you will transcribe
        and implement.</li>
        <li><b>&sect;3.1 (Example)</b> &mdash; the concrete two-layer model (<b>Eqn. 9</b>) and the
        semi-supervised cross-entropy loss over labeled nodes (<b>Eqn. 10</b>).</li>
        <li><b>Figure 1</b> &mdash; the schematic: input features &rarr; hidden layers &rarr; per-node
        softmax, with the few labeled nodes highlighted.</li>
       </ul>
       <p><b>Skim:</b> the spectral-graph-convolution background (&sect;2.1, Eqns. 3-7 &mdash; the Chebyshev /
       eigenvector derivation that <i>motivates</i> the layer; you can take the result on faith) and the
       experimental tables (&sect;5-6) unless you want the exact citation-network numbers.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You have a graph of 20 nodes in two communities, but you reveal the true label of just <b>one node
       per community</b> (2 labels total). A GCN propagates information from neighbour to neighbour, one hop
       per layer. After training a 2-layer GCN, what fraction of the <i>other</i> 18 nodes do you expect it to
       label correctly &mdash; near <b>chance (~50%)</b>, or <b>much higher</b>? Now the key ablation: if you
       <b>delete the neighbour-mixing</b> (replace the normalized adjacency with the identity matrix, so each
       node sees only itself), what happens to those 18 unlabeled nodes?</p>
       <p>(Hint: with no mixing, the 18 unlabeled nodes never receive any label signal at all.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the one matrix you must build by hand. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>Take the adjacency matrix $A$ (1 if nodes $i,j$ are connected, else 0).</li>
        <li>TODO: add self-loops &mdash; <code>Atil = A + torch.eye(n)</code>  <i># $\\tilde{A}=A+I_N$</i></li>
        <li>TODO: degrees of $\\tilde{A}$ &mdash; <code>deg = Atil.sum(1)</code>, then
        <code>Dinv = torch.diag(deg.pow(-0.5))</code>  <i># $\\tilde{D}^{-1/2}$</i></li>
        <li>TODO: the propagation matrix &mdash; <code>S = Dinv @ Atil @ Dinv</code>
        <i># $\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$</i></li>
        <li>One GCN layer is then <code>relu(S @ H @ W)</code> &mdash; mix, transform, squash.</li>
       </ul>
       <p>Then stack two such layers, compute cross-entropy on the 2 labeled nodes only, and predict every
       node. Also build the ablation: replace <code>S</code> with <code>torch.eye(n)</code> and predict which
       version labels the unlabeled nodes.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Start with the graph's <b>adjacency matrix</b> $A$: an $N\\times N$ table where $A_{ij}=1$ if node $i$
       and node $j$ are connected and $0$ otherwise ($N$ = number of nodes). Stack every node's feature vector
       as the rows of a matrix $H$ (so row $i$ is node $i$'s current representation).</p>
       <p>The product $A H$ has a beautiful reading: row $i$ of $A H$ is the <b>sum of the feature vectors of
       node $i$'s neighbours</b>. That is the "message passing" core &mdash; each node gathers its neighbours.
       But raw $A H$ has two problems the paper fixes (&sect;2.2):</p>
       <ul>
        <li><b>A node forgets itself.</b> $A$ has zeros on its diagonal, so $A H$ drops node $i$'s own vector.
        Fix: add a <b>self-loop</b> to every node &mdash; use $\\tilde{A} = A + I_N$, where $I_N$ is the identity
        matrix (1s on the diagonal). Now each node's sum includes itself.</li>
        <li><b>High-degree nodes blow up.</b> A node with 50 neighbours produces a sum 50&times; larger than a
        node with one neighbour, which destabilizes training. Fix: <b>normalize by degree</b>. Let $\\tilde{D}$
        be the diagonal <b>degree matrix</b> of $\\tilde{A}$ ($\\tilde{D}_{ii}$ = how many connections node $i$ has,
        counting its self-loop). Multiplying by $\\tilde{D}^{-1/2}$ on both sides &mdash;
        $\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ &mdash; turns the raw neighbour-<i>sum</i> into a balanced,
        degree-aware <b>weighted average</b>. The two-sided (symmetric) form scales the edge between $i$ and
        $j$ by $1/\\sqrt{\\tilde{d}_i\\,\\tilde{d}_j}$.</li>
       </ul>
       <p>Call that fixed, precomputed matrix $S = \\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ (the paper's
       <b>renormalized adjacency</b> $\\hat{A}$; the swap from $I_N + D^{-1/2}AD^{-1/2}$ to this self-looped form
       is the <b>renormalization trick</b>, just before Eqn. 8). One GCN <b>layer</b> then does three things: (1) mix
       &mdash; multiply by $S$ to average each node with its neighbours; (2) transform &mdash; multiply by a
       learned weight matrix $W$; (3) squash &mdash; apply a nonlinearity $\\sigma$ (ReLU). Stacking $L$ layers
       lets information travel $L$ hops across the graph: after two layers a node has heard from its neighbours'
       neighbours.</p>`,
    architecture:
      `<p>The model in the paper (&sect;3.1, Figure 1) is a <b>2-layer GCN</b> over a fixed graph. Sizes:
       $N$ nodes, input feature dimension $C$ (columns of $X$), hidden width $H$, and $F$ output classes.</p>
       <ul>
        <li><b>Precompute (no parameters):</b> from adjacency $A$ build $\\tilde{A}=A+I_N$, the diagonal degree
        matrix $\\tilde{D}$ ($\\tilde{D}_{ii}=\\sum_j\\tilde{A}_{ij}$), and the renormalized adjacency
        $\\hat{A}=\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ &mdash; one $N\\times N$ (sparse) matrix, fixed for
        the whole run.</li>
        <li><b>Inputs:</b> node features $X$ ($N\\times C$). In the citation experiments $X$ is the bag-of-words
        rows; with no features it degrades to the $N\\times N$ identity (one-hot node ids).</li>
        <li><b>Layer 1 (graph conv + ReLU):</b> $\\;\\hat{A}\\,X\\,W^{(0)}\\;$ then ReLU, with weight
        $W^{(0)}$ of shape $C\\times H$. Output: $N\\times H$ hidden node embeddings. (Dropout is applied to the
        input and the hidden layer.)</li>
        <li><b>Layer 2 (graph conv + softmax):</b> $\\;\\hat{A}\\,(\\cdot)\\,W^{(1)}\\;$ with weight $W^{(1)}$ of
        shape $H\\times F$, then a <b>row-wise softmax</b>. Output: $Z$, an $N\\times F$ matrix of per-node class
        probabilities.</li>
       </ul>
       <p><b>Data flow:</b> $X \\;\\xrightarrow{\\hat{A}\\,\\cdot\\,W^{(0)},\\,\\mathrm{ReLU}}\\; H^{(1)}
       \\;\\xrightarrow{\\hat{A}\\,\\cdot\\,W^{(1)},\\,\\mathrm{softmax}}\\; Z$. Only $W^{(0)}$ and $W^{(1)}$ are
       learned (just two small dense matrices); $\\hat{A}$ is fixed, so each layer is one sparse matrix product
       and the forward pass costs $O(|\\mathcal{E}|)$ &mdash; linear in the number of edges. Two layers means each
       node's prediction depends on its <b>2-hop</b> neighbourhood. The cross-entropy loss (Eqn. 10) is read off
       only the rows of $Z$ for labeled nodes; gradients still flow through $\\hat{A}$ to every node, so the
       handful of labels updates the whole graph's representations. Trained full-batch with Adam.</p>`,
    symbols: [
      { sym: "$A$", desc: "the <b>adjacency matrix</b> ($N\\times N$): $A_{ij}=1$ if nodes $i$ and $j$ are connected by an edge, else $0$. $N$ is the number of nodes." },
      { sym: "$I_N$", desc: "the <b>identity matrix</b> of size $N$: 1s on the diagonal, 0s elsewhere. Adding it puts a <b>self-loop</b> on every node." },
      { sym: "$\\tilde{A}$", desc: "the <b>adjacency with self-loops</b>: $\\tilde{A} = A + I_N$ (the paper's tilde). Multiplying by it keeps each node's own vector, not just its neighbours'." },
      { sym: "$\\tilde{D}$", desc: "the <b>degree matrix</b> of $\\tilde{A}$: a diagonal matrix with $\\tilde{D}_{ii} = \\sum_j \\tilde{A}_{ij}$ = the number of connections of node $i$ (including its self-loop)." },
      { sym: "$\\tilde{D}^{-1/2}$", desc: "the inverse square root of the degree matrix (each diagonal entry $1/\\sqrt{\\tilde{D}_{ii}}$). Used on both sides to normalize." },
      { sym: "$\\hat{A} = \\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$", desc: "the <b>renormalized (symmetric-normalized) adjacency</b> &mdash; the paper's $\\hat{A}$ in Eqn. 9; we also call it $S$. The fixed matrix that turns 'sum your neighbours' into a degree-balanced weighted average. Precomputed once." },
      { sym: "$L$", desc: "the <b>normalized graph Laplacian</b> $L = I_N - D^{-1/2}AD^{-1/2}$ (here $D$ is the degree matrix of the plain $A$, no self-loops). Its eigenbasis defines the spectral convolution." },
      { sym: "$U,\\ \\Lambda$", desc: "the <b>eigenvectors</b> ($U$) and diagonal matrix of <b>eigenvalues</b> ($\\Lambda$) of $L$, from $L = U\\Lambda U^{\\top}$. The spectral filter acts in the $U$ basis (Eqn. 3)." },
      { sym: "$g_\\theta,\\ \\theta$", desc: "the <b>spectral filter</b> and its parameters; $\\theta'_k$ are the Chebyshev coefficients, tied to a single $\\theta$ in the first-order model (Eqns. 4-7)." },
      { sym: "$T_k,\\ \\tilde{\\Lambda},\\ \\tilde{L},\\ \\lambda_{\\max}$", desc: "the <b>Chebyshev polynomials</b> $T_k$ evaluated at the rescaled Laplacian $\\tilde{L}=\\tfrac{2}{\\lambda_{\\max}}L-I_N$ (and $\\tilde{\\Lambda}$ for its eigenvalues); $\\lambda_{\\max}$ is the largest eigenvalue of $L$, approximated as $2$." },
      { sym: "$X$", desc: "the <b>input node features</b>: an $N\\times C$ matrix ($C$ = feature dimension). $H^{(0)}=X$. With no features it is the $N\\times N$ identity (one-hot node ids)." },
      { sym: "$H^{(l)}$", desc: "the <b>node representations at layer $l$</b>: an $N\\times d$ matrix whose row $i$ is node $i$'s feature vector. $H^{(0)}=X$." },
      { sym: "$W^{(l)},\\ \\Theta$", desc: "the <b>learnable weight matrices</b> ($W^{(0)}$ is $C\\times H$, $W^{(1)}$ is $H\\times F$); $\\Theta$ is the per-channel filter parameters in Eqn. 8. This is what training updates." },
      { sym: "$\\sigma$", desc: "an <b>activation function</b>, the ReLU (Rectified Linear Unit): keep positives, zero out negatives. The paper's Eqn. 2 uses $\\sigma=$ ReLU for hidden layers." },
      { sym: "$Z$", desc: "the <b>output</b>: an $N\\times F$ matrix, each node's class probabilities ($Z_{lf}$ = predicted probability of class $f$ for node $l$, after the row-wise softmax)." },
      { sym: "$Y,\\ F$", desc: "$Y$ the <b>one-hot true labels</b> ($Y_{lf}=1$ if node $l$ is class $f$) and $F$ the <b>number of classes</b>, both used in the cross-entropy loss (Eqn. 10)." },
      { sym: "$\\mathcal{Y}_L$", desc: "the set of <b>labeled node indices</b> &mdash; the few nodes whose true class we know and on which the loss is computed (Eqn. 10)." }
    ],
    formula:
      `<p><b>The renormalization trick (the layer-wise propagation rule), Eqn. 2.</b> One graph-convolution layer:</p>
       $$ H^{(l+1)} = \\sigma\\!\\left( \\tilde{D}^{-\\frac{1}{2}}\\,\\tilde{A}\\,\\tilde{D}^{-\\frac{1}{2}}\\, H^{(l)}\\, W^{(l)} \\right), \\qquad \\tilde{A} = A + I_N, \\qquad \\tilde{D}_{ii} = \\sum_j \\tilde{A}_{ij}. $$
       <p>Add a self-loop to every node ($\\tilde{A}=A+I_N$), symmetric-normalize by the self-looped degree, mix, transform by the learned $W^{(l)}$, squash by $\\sigma$ (ReLU). This is the only equation you implement.</p>

       <p><b>Where $S=\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ comes from &mdash; the spectral motivation (&sect;2.1).</b> A spectral graph convolution is a multiplication in the basis of the graph Laplacian's eigenvectors (Eqn. 3):</p>
       $$ g_\\theta \\star x = U\\, g_\\theta\\, U^{\\top} x, \\qquad L = I_N - D^{-\\frac{1}{2}} A D^{-\\frac{1}{2}} = U \\Lambda U^{\\top}. $$
       <p>$U$ are the eigenvectors of the normalized Laplacian $L$ and $\\Lambda$ its eigenvalues; $g_\\theta$ is a filter applied in that basis. Computing $U$ needs a full eigendecomposition &mdash; expensive and non-local.</p>

       <p><b>Chebyshev approximation (&sect;2.1, Eqns. 4-5).</b> Approximate the filter by a truncated $K$-th order Chebyshev polynomial $T_k$ in the rescaled Laplacian, which avoids ever forming $U$:</p>
       $$ g_{\\theta'}(\\Lambda) \\approx \\sum_{k=0}^{K} \\theta'_k\\, T_k(\\tilde{\\Lambda}), \\qquad
          g_{\\theta'} \\star x \\approx \\sum_{k=0}^{K} \\theta'_k\\, T_k(\\tilde{L})\\, x, \\qquad
          \\tilde{L} = \\tfrac{2}{\\lambda_{\\max}} L - I_N. $$
       <p>This is already $K$-localized (each node reads only its $K$-hop neighbourhood) and cheap.</p>

       <p><b>First-order approximation (&sect;2.2, Eqns. 6-7).</b> Take $K=1$ and $\\lambda_{\\max}\\approx 2$, then tie the two filter weights ($\\theta = \\theta'_0 = -\\theta'_1$) to limit overfitting:</p>
       $$ g_{\\theta'} \\star x \\approx \\theta'_0\\, x - \\theta'_1\\, D^{-\\frac{1}{2}} A D^{-\\frac{1}{2}} x
          \\;\\;\\longrightarrow\\;\\; g_\\theta \\star x \\approx \\theta\\,\\big( I_N + D^{-\\frac{1}{2}} A D^{-\\frac{1}{2}} \\big) x. $$
       <p>The operator $I_N + D^{-1/2}AD^{-1/2}$ has eigenvalues in $[0,2]$; stacking it repeatedly is numerically unstable. The <b>renormalization trick</b> replaces it with $\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ (using $\\tilde{A}=A+I_N$), giving the multi-channel filter (Eqn. 8) that becomes Eqn. 2:</p>
       $$ Z = \\tilde{D}^{-\\frac{1}{2}}\\,\\tilde{A}\\,\\tilde{D}^{-\\frac{1}{2}}\\, X\\, \\Theta. $$

       <p><b>The 2-layer semi-supervised model (&sect;3.1, Eqn. 9).</b> With $\\hat{A} = \\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ precomputed once:</p>
       $$ Z = f(X, A) = \\mathrm{softmax}\\!\\Big( \\hat{A}\\; \\mathrm{ReLU}\\big( \\hat{A}\\, X\\, W^{(0)} \\big)\\, W^{(1)} \\Big). $$
       <p>First layer mixes one hop and transforms input features $X$ by $W^{(0)}$; ReLU; second layer mixes a second hop and maps to class scores by $W^{(1)}$; a per-node softmax gives class probabilities.</p>

       <p><b>Semi-supervised cross-entropy loss (&sect;3.1, Eqn. 10).</b> Summed over the labeled nodes only:</p>
       $$ \\mathcal{L} = -\\sum_{l \\in \\mathcal{Y}_L} \\sum_{f=1}^{F} Y_{lf}\\, \\ln Z_{lf}. $$
       <p>$\\mathcal{Y}_L$ is the set of labeled node indices, $F$ the number of classes, $Y$ the one-hot true labels, $Z$ the predicted probabilities. Unlabeled nodes get no direct supervision &mdash; the graph carries the signal.</p>`,
    whatItDoes:
      `<p><b>Equation 2</b> is one graph-convolution layer, read right-to-left. Start with the current node
       representations $H^{(l)}$. (1) <b>Transform:</b> $H^{(l)} W^{(l)}$ applies the learned linear map to every
       node. (2) <b>Mix:</b> multiplying on the left by $\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ replaces each
       node's vector with a degree-normalized average of itself and its neighbours (the self-loop from
       $\\tilde{A}=A+I_N$ is what keeps "itself" in the average). (3) <b>Squash:</b> $\\sigma$ (ReLU) adds the
       nonlinearity. Stack these and information flows one extra hop per layer. Because $S$ is precomputed and
       the only learned object is the small matrix $W^{(l)}$, the whole layer is one sparse matrix product
       &mdash; hence "scales linearly in the number of edges."</p>`,
    derivation:
      `<p><b>Short recap &mdash; the message-passing view lives in the concept lesson.</b> The mod-gnn lesson
       builds the intuition that a GNN layer is "each node averages its neighbours, then squishes." GCN is the
       cleanest instance of that: the averaging is the fixed matrix $S=\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$
       and the squish is $\\sigma$, with one shared weight $W$ in between. Head to <b>mod-gnn</b> for the
       message-passing framing.</p>
       <p>Where does the specific matrix $S$ come from? The paper <i>motivates</i> it from <b>spectral graph
       convolution</b> (&sect;2.1): a graph convolution is multiplication in the graph's eigenvector basis,
       $g_\\theta \\star x = U g_\\theta U^\\top x$ (Eqn. 3). Computing $U$ is expensive, so they approximate the
       filter with a first-order (linear) <b>Chebyshev polynomial</b>, set $K=1$ and $\\lambda_{\\max}\\approx 2$,
       which collapses the convolution to a single term $I_N + D^{-1/2}AD^{-1/2}$. Repeatedly applying that
       operator is numerically unstable (its eigenvalues can grow), so they apply the <b>renormalization
       trick</b> (just before Eqn. 8): replace it with $\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ using
       $\\tilde{A}=A+I_N$, which keeps eigenvalues in a stable range. That is exactly the $S$ in Eqn. 2. You can
       take the spectral derivation on faith &mdash; the layer stands on its own as "normalized neighbour
       averaging."</p>`,
    example:
      `<p>Work one GCN layer by hand on a tiny <b>3-node path graph</b>: nodes $0-1-2$, with edges $0\\!-\\!1$
       and $1\\!-\\!2$ (node 1 is the middle). So</p>
       <p>$$ A = \\begin{bmatrix} 0&1&0 \\\\ 1&0&1 \\\\ 0&1&0 \\end{bmatrix}, \\qquad
            \\tilde{A} = A + I_3 = \\begin{bmatrix} 1&1&0 \\\\ 1&1&1 \\\\ 0&1&1 \\end{bmatrix}. $$</p>
       <table class="extable">
        <caption>Per-node degree of $\\tilde{A}$ (row sums, self-loop included) and $1/\\sqrt{\\tilde{d}}$.</caption>
        <thead><tr><th>node</th><th class="num">row of $\\tilde{A}$</th><th class="num">$\\tilde{d}_i$</th><th class="num">$1/\\sqrt{\\tilde{d}_i}$</th></tr></thead>
        <tbody>
         <tr><td class="row-h">0</td><td class="num">$1{+}1{+}0$</td><td class="num">2</td><td class="num">0.7071</td></tr>
         <tr><td class="row-h">1 (hub)</td><td class="num">$1{+}1{+}1$</td><td class="num">3</td><td class="num">0.5774</td></tr>
         <tr><td class="row-h">2</td><td class="num">$0{+}1{+}1$</td><td class="num">2</td><td class="num">0.7071</td></tr>
        </tbody>
       </table>
       <ul class="steps">
        <li><b>Degree matrix.</b> $\\tilde{D}^{-1/2}=\\mathrm{diag}(1/\\sqrt2,\\,1/\\sqrt3,\\,1/\\sqrt2)$ from the table above.</li>
        <li><b>Renormalized adjacency $S=\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$.</b> Each entry $S_{ij}=\\tilde{A}_{ij}/\\sqrt{\\tilde{d}_i\\tilde{d}_j}$:
        $$ S = \\begin{bmatrix} 1/2 & 1/\\sqrt6 & 0 \\\\ 1/\\sqrt6 & 1/3 & 1/\\sqrt6 \\\\ 0 & 1/\\sqrt6 & 1/2 \\end{bmatrix}
             \\approx \\begin{bmatrix} 0.500 & 0.408 & 0 \\\\ 0.408 & 0.333 & 0.408 \\\\ 0 & 0.408 & 0.500 \\end{bmatrix}. $$
        (Check: $1/2$ is the self-weight of a degree-2 node, $1/\\sqrt6\\approx0.408$ is the hub edge $1/\\sqrt{2\\cdot3}$.)</li>
        <li><b>Mix the features.</b> Let node features be $H=\\begin{bmatrix}1&0\\\\0&1\\\\1&1\\end{bmatrix}$. Then
        $S H = \\begin{bmatrix} 0.500 & 0.408 \\\\ 0.816 & 0.742 \\\\ 0.500 & 0.908 \\end{bmatrix}$ &mdash; e.g.
        row 0 = $0.5\\cdot[1,0] + 0.408\\cdot[0,1] = [0.500,\\,0.408]$: node 0 blended with the hub.</li>
        <li><b>Transform + squash.</b> With $W=\\begin{bmatrix}1&-1\\\\0&2\\end{bmatrix}$,
        $S H W = \\begin{bmatrix} 0.500 & 0.316 \\\\ 0.816 & 0.667 \\\\ 0.500 & 1.316 \\end{bmatrix}$, and
        since every entry is $\\geq 0$, $\\mathrm{ReLU}(SHW)=SHW$. That is one layer, Eqn. 2.</li>
       </ul>
       <p>These exact numbers are recomputed in the notebook's first cell so you can check the layer by
       running it.</p>`,
    recipe:
      `<ol>
        <li><b>Build the propagation matrix once.</b> From the adjacency $A$: add self-loops
        $\\tilde{A}=A+I_N$; take degrees $\\tilde{d}_i=\\sum_j\\tilde{A}_{ij}$; form $S=\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$
        (the paper's $\\hat{A}$). $S$ is fixed (no parameters) and precomputed.</li>
        <li><b>Define one GCN layer:</b> <code>H_next = relu(S @ H @ W)</code> &mdash; mix ($S$), transform
        ($W$, learnable), squash (ReLU).</li>
        <li><b>Stack two layers</b> (Eqn. 9): $Z = \\mathrm{softmax}\\big(S\\,\\mathrm{ReLU}(S X W^{(0)})\\,W^{(1)}\\big)$.
        The first layer mixes one hop, the second mixes a second hop, then a per-node softmax gives class
        probabilities.</li>
        <li><b>Loss on labeled nodes only</b> (Eqn. 10): cross-entropy summed over the labeled set
        $\\mathcal{Y}_L$. The unlabeled nodes get no direct supervision &mdash; the graph carries the signal.</li>
        <li><b>Train</b> with Adam; predict every node by $\\arg\\max$ over its class scores.</li>
        <li><b>Ablate:</b> replace $S$ with the identity $I_N$ (no neighbour mixing &mdash; a plain per-node
        MLP) and compare. The unlabeled nodes should collapse to chance.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): the model is "based on an efficient variant of convolutional neural
       networks which operate directly on graphs," "scales linearly in the number of graph edges," and on
       "citation networks and on a knowledge graph dataset we demonstrate that our approach outperforms related
       methods by a significant margin." The experiments (Table 2) report classification accuracy on three
       citation networks &mdash; <b>Cora 81.5%, Citeseer 70.3%, Pubmed 79.0%</b> &mdash; using only <b>20
       labeled nodes per class</b> for training (&sect;5.1).</p>
       <p><i>These are the paper's reported figures, quoted from the abstract and Table 2. The numbers in the
       CODEVIZ panel below are from our own tiny run on a synthetic graph &mdash; not the paper's results.</i></p>`,
    evaluation:
      `<p><b>Metric &amp; benchmark.</b> GCN is judged on <b>semi-supervised node-classification accuracy</b>:
       the fraction of <i>held-out</i> nodes labeled correctly, training on only $20$ labeled nodes per class
       (&sect;5.1). The paper's benchmarks are the citation networks Cora, Citeseer, Pubmed. The "no-skill"
       floor is majority-class / random = $1/F$ for $F$ classes (so $\\approx50\\%$ on a balanced 2-class toy
       graph); the meaningful bar is beating a graph-blind per-node classifier (the $S\\to I$ ablation) and the
       prior methods GCN reports it "outperforms ... by a significant margin."</p>
       <ul>
        <li><b>Sanity checks before the full run.</b> Recompute the worked 3-node path graph and confirm
        $S=\\begin{bmatrix}0.5&0.408&0\\\\0.408&0.333&0.408\\\\0&0.408&0.5\\end{bmatrix}$ and $S H W$ as in the
        lesson &mdash; a known-answer unit test for the renormalized adjacency. Check $S$ is <b>symmetric</b>,
        has the self-loop weight $1/2$ on a degree-2 node, and that each row sums sensibly (degree-balanced).
        <b>Overfit the 2 labeled nodes:</b> their training loss should fall toward $0$; the $F$-class
        cross-entropy at init should sit near $-\\ln(1/F)$ (rule of thumb, $\\approx0.69$ for $F=2$). Verify the
        output $Z$ is $N\\times F$ and each row softmaxes to $1$.</li>
        <li><b>Expected range.</b> A correct implementation should reach roughly the paper's reported accuracy:
        <b>Cora 81.5%, Citeseer 70.3%, Pubmed 79.0%</b> (Table 2, &sect;5.1 &mdash; quoted in <code>results</code>),
        each with only $20$ labels per class. Landing within a couple of points of those is "tuning"; sitting
        near majority-class, or far below them, is "probably a bug." On the toy two-community graph a correct
        GCN should hit $\\approx100\\%$ on all nodes within a few epochs (our run, not a paper number).</li>
        <li><b>Ablation &mdash; prove message passing earns its keep.</b> The central knob is the
        <b>neighbour mixing</b> $S=\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$. Replace $S$ with the identity
        $I_N$ (the lesson's built-in ablation &mdash; each layer becomes a plain per-node MLP), keep weights,
        optimizer, labels, and epochs identical, and confirm accuracy on the <i>unlabeled</i> nodes <b>collapses
        to chance</b> ($\\approx40$-$50\\%$) and never climbs &mdash; with no mixing the unlabeled nodes get zero
        label signal. If accuracy does <i>not</i> drop, $S$ is not actually wired in. The CODEVIZ panel shows
        exactly this: GCN reaches $100\\%$ in $\\sim2$ epochs while the $S\\to I$ ablation hovers near chance.</li>
        <li><b>Failure signals &amp; what they mean.</b> Unlabeled accuracy stuck at chance &rarr; you used $A$
        without the self-loop, normalized the wrong matrix, or effectively lost the mixing (silent $S\\to I$).
        Loss NaN &rarr; LR too high, or a zero-degree node gave $\\tilde{D}^{-1/2}=\\infty$ (every node has a
        self-loop, so degrees should be $\\ge1$). Accuracy <b>drops as you add layers</b> &rarr;
        <b>over-smoothing</b>: too many hops average every node toward the same vector &mdash; use 2-3 layers.
        Train-good (the 2 seeds memorized) but unlabeled-bad &rarr; the graph signal is not propagating (check
        $S$, the self-loop, and that the loss is summed over $\\mathcal{Y}_L$ only, not all nodes). One-sided
        $\\tilde{D}^{-1}\\tilde{A}$ instead of the symmetric form &rarr; subtly wrong scaling that lets hubs
        dominate.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives (matrix multiply, ReLU, softmax
       cross-entropy, Adam) already ship in PyTorch, so you <b>import</b> them and build only the novel
       composition. <b>Import:</b> <code>nn.Parameter</code>, <code>torch.relu</code>,
       <code>F.cross_entropy</code>, and <code>torch.optim.Adam</code>. <b>Build by hand:</b> the renormalized
       adjacency $S=\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ from raw tensors (self-loops, degree, the symmetric
       normalization), the GCN layer <code>S @ H @ W</code>, the 2-layer model, and the <b>ablation</b> that
       removes the mixing. No graph library (no PyG/DGL) &mdash; the whole point is to see the layer is one
       matrix product. The spectral / message-passing motivation is recapped from <b>mod-gnn</b>, not
       re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting the self-loop.</b> If you normalize the bare $A$ (no $+I_N$), each node averages only
        its neighbours and <i>drops its own features</i>, so its identity is lost after one layer. <b>Fix:</b>
        $\\tilde{A}=A+I_N$ before normalizing.</li>
        <li><b>Normalizing $A$ instead of $\\tilde{A}$.</b> The degrees in $\\tilde{D}$ must be the <i>row sums of
        $\\tilde{A}$</i> (which include the self-loop), not of $A$. Using $A$'s degrees mis-scales every edge.</li>
        <li><b>One-sided (row) normalization.</b> $\\tilde{D}^{-1}\\tilde{A}$ (a plain neighbour mean) is <i>not</i>
        the paper's operator. GCN uses the <b>symmetric</b> $\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$, which
        weights each edge by $1/\\sqrt{\\tilde{d}_i\\tilde{d}_j}$ &mdash; it down-weights edges to high-degree hubs.</li>
        <li><b>Loss on all nodes.</b> In the semi-supervised setting the cross-entropy is summed over the
        <i>labeled</i> set $\\mathcal{Y}_L$ only (Eqn. 10). Computing it over unlabeled nodes (whose labels you
        do not have, or that you cheated by peeking at) is wrong.</li>
        <li><b>Stacking too many layers.</b> Each layer is one more hop of averaging; pile on too many and every
        node's vector converges to the same blurred average (<b>over-smoothing</b>), and accuracy drops. Two or
        three layers is usually best.</li>
      </ul>`,
    recall: [
      "Write the layer-wise propagation rule (Eqn. 2) from memory, including $\\tilde{A}=A+I_N$.",
      "Why add the self-loop $I_N$ before normalizing?",
      "What does the symmetric normalization $\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ do that a raw neighbour-sum does not?",
      "In semi-supervised training, which nodes does the cross-entropy loss (Eqn. 10) run over?",
      "What is over-smoothing, and how many layers typically avoid it?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have a 2-layer GCN that labels a 20-node, two-community graph correctly
            from just 2 labels (one per community). Replace the propagation matrix $S$ with the identity
            $I_N$ (so each layer is <code>relu(I @ H @ W) = relu(H @ W)</code> &mdash; a plain per-node MLP with
            no neighbour mixing) and retrain. What happens to the 18 <i>unlabeled</i> nodes, and what does that
            demonstrate?`,
        steps: [
          { do: `Swap one matrix: change <code>S</code> to <code>torch.eye(n)</code>; keep the same weights, optimizer, labels, and epochs.`, why: `An honest ablation changes exactly one thing &mdash; the neighbour mixing &mdash; so any difference is attributable to the graph convolution.` },
          { do: `Retrain and look at accuracy on the 18 unlabeled nodes: it sits near chance (~50%) and never climbs.`, why: `With $S=I$, no node ever sees a neighbour, so the 18 unlabeled nodes receive zero label signal &mdash; the model can only fit the 2 it was shown.` },
          { do: `Conclude that the normalized adjacency $S$ (the message passing), not the weights, is what spreads the labels.`, why: `Both models have identical learnable weights and capacity; only the one that mixes neighbours generalizes, isolating $S$ as the cause.` }
        ],
        answer: `<p>With $S=I_N$ the unlabeled nodes collapse to roughly chance accuracy &mdash; the model can
                 only memorize the 2 labeled nodes because nothing carries their signal outward. Restoring
                 $S=\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ lets each layer average neighbours, so after two hops
                 every node has heard from a labeled one and the accuracy jumps to ~100%. Since the only change
                 was $S$ vs $I$, this isolates the <b>graph convolution</b> (message passing), not extra
                 parameters, as the reason a handful of labels generalizes. The CODEVIZ panel shows exactly this
                 contrast.</p>`
      },
      {
        q: `For the 3-node path graph in the worked example ($\\tilde{A}=\\begin{bmatrix}1&1&0\\\\1&1&1\\\\0&1&1\\end{bmatrix}$),
            compute the renormalized weight $S_{12}$ on the edge between the hub (node 1, degree 3) and node 2
            (degree 2). Why is it smaller than node 2's self-weight $S_{22}$?`,
        steps: [
          { do: `Use $S_{ij}=\\tilde{A}_{ij}/\\sqrt{\\tilde{d}_i\\tilde{d}_j}$. Here $\\tilde{A}_{12}=1$, $\\tilde{d}_1=3$, $\\tilde{d}_2=2$, so $S_{12}=1/\\sqrt{3\\cdot2}=1/\\sqrt6\\approx0.408$.`, why: `The symmetric normalization divides each edge by the geometric mean of the two endpoints' degrees.` },
          { do: `Compute the self-weight: $S_{22}=\\tilde{A}_{22}/\\sqrt{\\tilde{d}_2\\tilde{d}_2}=1/\\sqrt{2\\cdot2}=1/2=0.5$.`, why: `A self-loop is an edge from a node to itself, normalized by its own degree on both sides.` },
          { do: `Compare: $0.408 \\lt 0.5$, so the edge to the higher-degree hub is down-weighted relative to node 2's own contribution.`, why: `Symmetric normalization deliberately damps connections to high-degree hubs, preventing them from dominating every neighbour's average.` }
        ],
        answer: `<p>$S_{12}=1/\\sqrt{3\\cdot2}=1/\\sqrt6\\approx0.408$, while node 2's self-weight is
                 $S_{22}=1/\\sqrt{2\\cdot2}=0.5$. The edge to the hub is smaller because the symmetric
                 normalization divides by $\\sqrt{\\tilde{d}_i\\tilde{d}_j}$, so a connection to a high-degree node
                 (degree 3) is penalized more than a self-loop on a low-degree node (degree 2). This is exactly
                 the "don't let hubs dominate" behavior that makes GCN stable.</p>`
      },
      {
        q: `A friend builds a GCN and trains it for 12 layers "to capture long-range structure," but accuracy
            on a small graph gets <i>worse</i> than their 2-layer version. They have no bug. What is happening,
            and what is the fix?`,
        steps: [
          { do: `Recall each layer multiplies by $S$ once, averaging every node with its neighbours one more hop.`, why: `Repeated averaging is a smoothing (diffusion) operation on the graph.` },
          { do: `After many layers every node's representation has been averaged over most of the graph, so all node vectors converge toward the same value &mdash; they become indistinguishable.`, why: `This is <b>over-smoothing</b>: the very mixing that helps at 2-3 hops erases per-node information when overdone.` },
          { do: `Reduce to 2-3 layers (or add residual connections / jumping-knowledge links if deep mixing is truly needed).`, why: `A shallow stack mixes enough to spread labels without washing out each node's identity.` }
        ],
        answer: `<p>It is <b>over-smoothing</b>: because every GCN layer averages each node with its neighbours,
                 stacking 12 of them smooths the whole graph until all node representations look the same and
                 become inseparable, so accuracy collapses. The fix is to use only 2-3 layers (the typical GCN
                 depth), or, if many hops are genuinely needed, add residual / skip connections to preserve each
                 node's own signal.</p>`
      }
    ]
  });

  window.CODE["paper-gcn"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the renormalized adjacency $S=\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ and the
       graph-convolution layer <code>S @ H @ W</code> by hand from raw torch tensors &mdash; no graph library.
       The first cell recomputes the worked example on the 3-node path graph ($S$, then $SHW$, then ReLU),
       so you can check the layer. We then make a tiny <b>two-community graph</b> (Karate-club style),
       reveal just <b>2 labels</b> (one node per community), train a 2-layer GCN (Eqn. 9) with cross-entropy on
       those 2 nodes only (Eqn. 10), and classify <i>all</i> 20 nodes. Paste into Colab and run (torch is
       preinstalled &mdash; no pip).</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)

# --- 0. Recompute the lesson's worked example: one GCN layer on a 3-node path graph. ---
# Graph 0-1-2 (edges 0-1, 1-2). A-hat = A + I (add self-loops), then symmetric-normalize.
A = torch.tensor([[0.,1.,0.],[1.,0.,1.],[0.,1.,0.]])
Ahat = A + torch.eye(3)                          # A-hat = A + I_N        (Section 2.2)
deg  = Ahat.sum(1)                               # d-hat_ii = sum_j A-hat_ij  ->  [2,3,2]
Dinv = torch.diag(deg.pow(-0.5))                 # D-hat^{-1/2}
S    = Dinv @ Ahat @ Dinv                        # S = D-hat^{-1/2} A-hat D-hat^{-1/2}
H    = torch.tensor([[1.,0.],[0.,1.],[1.,1.]])   # node features (3 nodes x 2)
W    = torch.tensor([[1.,-1.],[0.,2.]])          # layer weights (2 x 2)
out  = torch.relu(S @ H @ W)                     # Eq. 2:  sigma( S H W )
print("normalized adjacency S =\\n", S.round(decimals=4))
print("S @ H @ W (pre-ReLU) =\\n", (S @ H @ W).round(decimals=4))
print("worked-example layer output =\\n", out.round(decimals=4))
# S =  [[0.5000, 0.4082, 0.0000],
#       [0.4082, 0.3333, 0.4082],
#       [0.0000, 0.4082, 0.5000]]
# S@H@W = [[0.5000, 0.3165], [0.8165, 0.6667], [0.5000, 1.3165]]   (all >= 0, so ReLU is identity)
print()

# --- 1. A tiny synthetic community graph (two clusters, dense within / sparse between). ---
def make_two_community_graph(n_per=10, p_in=0.45, p_out=0.03, seed=1):
    g = torch.Generator().manual_seed(seed)
    n = 2 * n_per
    comm = torch.cat([torch.zeros(n_per), torch.ones(n_per)]).long()   # ground-truth community
    A = torch.zeros(n, n)
    for i in range(n):
        for j in range(i + 1, n):
            p = p_in if comm[i] == comm[j] else p_out
            if torch.rand(1, generator=g).item() < p:
                A[i, j] = A[j, i] = 1.0
    return A, comm

A, labels = make_two_community_graph()
n = A.shape[0]
X = torch.eye(n)                                 # featureless: one-hot identity features

# Build the renormalized adjacency S once (built by hand, the heart of the paper).
def normalized_adjacency(A):
    Ah = A + torch.eye(A.shape[0])               # add self-loops:  A-hat = A + I_N
    d  = Ah.sum(1)                               # degrees of A-hat
    Di = torch.diag(d.pow(-0.5))                 # D-hat^{-1/2}
    return Di @ Ah @ Di                          # D-hat^{-1/2} A-hat D-hat^{-1/2}

S = normalized_adjacency(A)

# --- 2. The GCN layer and a 2-layer model, from raw tensors (no graph library). ---
class GCNLayer(nn.Module):
    def __init__(self, c_in, c_out):
        super().__init__()
        self.W = nn.Parameter(torch.empty(c_in, c_out))
        nn.init.xavier_uniform_(self.W)
    def forward(self, S, H):
        return S @ (H @ self.W)                  # Eq. 2 (pre-activation):  S H W

class GCN(nn.Module):
    def __init__(self, c_in, c_hid, c_out):
        super().__init__()
        self.l1 = GCNLayer(c_in, c_hid)
        self.l2 = GCNLayer(c_hid, c_out)
    def forward(self, S, X):
        h = torch.relu(self.l1(S, X))            # Eq. 9:  ReLU( S X W0 )
        return self.l2(S, h)                     # logits; softmax handled by cross_entropy

# --- 3. Semi-supervised: reveal ONE label per community; train on those only. ---
train_idx = torch.tensor([0, n - 1])            # one seed per cluster
torch.manual_seed(0)
model = GCN(c_in=n, c_hid=8, c_out=2)
opt   = torch.optim.Adam(model.parameters(), lr=0.05, weight_decay=5e-4)

for epoch in range(120):
    model.train(); opt.zero_grad()
    logits = model(S, X)
    loss = F.cross_entropy(logits[train_idx], labels[train_idx])   # Eq. 10: loss over labeled set only
    loss.backward(); opt.step()

# --- 4. Classify ALL nodes (we only ever showed 2 labels). ---
model.eval()
with torch.no_grad():
    pred = model(S, X).argmax(1)
acc = (pred == labels).float().mean().item()
print(f"trained on {len(train_idx)} labels; full-graph node-classification accuracy = {acc:.3f}")
# trained on 2 labels; full-graph node-classification accuracy = 0.950
# (our small run on a synthetic graph -- not the paper's reported Cora/Citeseer/Pubmed numbers)`
  };

  window.CODEVIZ["paper-gcn"] = {
    question: "From just 2 labels on a 30-node two-community graph, does the normalized-adjacency mixing (S) spread the labels &mdash; and what happens if we remove it (S &rarr; identity)?",
    charts: [
      {
        type: "line",
        title: "Node-classification accuracy vs epoch — GCN (mixes neighbours) vs ablation (S &rarr; I, no mixing)",
        xlabel: "training epoch",
        ylabel: "accuracy on all 30 nodes",
        series: [
          {
            name: "GCN (uses S)",
            color: "#7ee787",
            points: [[0,0.733],[2,1.0],[4,1.0],[6,1.0],[8,1.0],[10,1.0],[12,1.0],[14,1.0],[16,1.0],[18,1.0],[20,1.0],[22,1.0],[24,1.0],[26,1.0],[28,1.0],[30,1.0],[32,1.0],[34,1.0],[36,1.0],[38,1.0],[40,1.0],[42,1.0],[44,1.0],[46,1.0],[48,1.0],[50,1.0],[52,1.0],[54,1.0],[56,1.0],[59,1.0]]
          },
          {
            name: "Ablation (S\\u2192I, no graph)",
            color: "#ff7b72",
            points: [[0,0.367],[2,0.433],[4,0.467],[6,0.5],[8,0.533],[10,0.567],[12,0.6],[14,0.533],[16,0.467],[18,0.467],[20,0.433],[22,0.433],[24,0.4],[26,0.367],[28,0.467],[30,0.433],[32,0.433],[34,0.433],[36,0.567],[38,0.467],[40,0.567],[42,0.5],[44,0.467],[46,0.533],[48,0.533],[50,0.5],[52,0.5],[54,0.467],[56,0.5],[59,0.4]]
        }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A synthetic 30-node graph in two communities (dense within, sparse between); only 2 nodes are labeled (one per community), and accuracy is measured on all 30. The GCN that uses the renormalized adjacency $S=\\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ reaches 100% within ~2 epochs &mdash; two hops of neighbour-averaging carry the 2 labels across the whole graph. The ABLATION replaces $S$ with the identity (each node sees only itself, a plain per-node MLP): it hovers near chance (~40-50%) and never climbs, because the 28 unlabeled nodes receive no label signal. Same weights, optimizer, labels, epochs; the only difference is the neighbour mixing.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np

# Does the normalized-adjacency mixing (S) actually spread a few labels? Compare a GCN
# that uses S against an ablation that replaces S with the identity (no neighbour mixing).
def make_graph(n_per=15, p_in=0.40, p_out=0.02, seed=2):
    g = torch.Generator().manual_seed(seed)
    n = 2*n_per
    comm = torch.cat([torch.zeros(n_per), torch.ones(n_per)]).long()
    A = torch.zeros(n, n)
    for i in range(n):
        for j in range(i+1, n):
            p = p_in if comm[i]==comm[j] else p_out
            if torch.rand(1, generator=g).item() < p:
                A[i,j] = A[j,i] = 1.0
    return A, comm

def norm_adj(A):
    Ah = A + torch.eye(A.shape[0]); d = Ah.sum(1)
    Di = torch.diag(d.pow(-0.5)); return Di @ Ah @ Di

A, labels = make_graph()
n = A.shape[0]; X = torch.eye(n)
S = norm_adj(A); I = torch.eye(n)
train_idx = torch.tensor([0, n-1])               # one labeled node per community

class GCN(nn.Module):
    def __init__(s):
        super().__init__()
        s.W0 = nn.Parameter(torch.empty(n, 8)); s.W1 = nn.Parameter(torch.empty(8, 2))
        nn.init.xavier_uniform_(s.W0); nn.init.xavier_uniform_(s.W1)
    def forward(s, M, X):
        h = torch.relu(M @ (X @ s.W0)); return M @ (h @ s.W1)

def run(M, seed=0):
    torch.manual_seed(seed)
    m = GCN(); opt = torch.optim.Adam(m.parameters(), lr=0.05, weight_decay=5e-4); accs = []
    for ep in range(60):
        m.train(); opt.zero_grad()
        F.cross_entropy(m(M, X)[train_idx], labels[train_idx]).backward(); opt.step()
        with torch.no_grad():
            accs.append((m(M, X).argmax(1) == labels).float().mean().item())
    return accs

gcn = run(S)        # uses the graph (S)
mlp = run(I)        # ABLATION: identity instead of S -> no neighbour mixing
idx = np.linspace(0, 59, 30).astype(int)
print("GCN (uses S):", [[int(i), round(gcn[i],3)] for i in idx])
print("Ablation (S->I):", [[int(i), round(mlp[i],3)] for i in idx])
# GCN -> 100% within ~2 epochs; ablation stays near chance (~40-50%).`
  };
})();
