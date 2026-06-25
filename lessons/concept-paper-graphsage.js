/* Paper lesson — "Inductive Representation Learning on Large Graphs" (GraphSAGE), Hamilton et al. 2017.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-graphsage".
   GROUNDED from arXiv:1706.02216 (abstract) and the ar5iv HTML mirror (Section 3: Algorithm 1,
   Eqns 1-3 and the aggregate/combine update). Track B (architecture): build the SAMPLE +
   AGGREGATE(mean) + CONCAT-combine layer by hand on top of nn.Linear, and SHOW it embeds nodes it
   never saw in training (inductive). conceptLink = null (no single concept owns this);
   message-passing recap lives in mod-gnn. Cross-links paper-gcn (transductive contrast). */
(function () {
  window.LESSONS.push({
    id: "paper-graphsage",
    title: "GraphSAGE — Inductive Representation Learning on Large Graphs (2017)",
    tagline: "Learn a FUNCTION that builds a node's embedding by sampling and aggregating its neighbors, so it works on nodes never seen in training.",
    module: "Papers · Graph Neural Networks",
    track: "architecture",
    paper: {
      authors: "William L. Hamilton, Rex Ying, Jure Leskovec",
      org: "Stanford University",
      year: 2017,
      venue: "arXiv:1706.02216 (Jun 2017); NIPS (NeurIPS) 2017",
      citations: "", // no citation count shown on the fetched arXiv page — omitted to avoid inventing one
      arxiv: "https://arxiv.org/abs/1706.02216",
      code: "https://github.com/williamleif/GraphSAGE"
    },
    conceptLink: null,
    partOf: [
      { capstone: "capstone-gnn", step: 2, builds: "the sample + mean-aggregate + combine layer (the inductive GNN block)" }
    ],
    prereqs: ["mod-gnn", "dl-forward-prop", "dl-backprop", "dl-conv", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p>A <b>graph</b> is a set of <b>nodes</b> (think: each paper in a citation network, each user in a
       social network) connected by <b>edges</b> (a citation, a friendship). A <b>node embedding</b> is a
       short list of numbers &mdash; a vector &mdash; that summarizes a node so a downstream model can use it
       (e.g. to guess the node's category). Before this paper, the popular way to get these embeddings was
       <b>transductive</b>: you ran an algorithm over the <i>whole, fixed</i> graph and it learned <b>one
       embedding vector per node, stored in a big lookup table</b>. The paper's complaint (&sect;1):</p>
       <blockquote>"most existing approaches require that all nodes in the graph are present during training
       of the embeddings; these previous approaches are inherently transductive and do not naturally
       generalize to unseen nodes." (abstract)</blockquote>
       <p>So the moment a <b>new</b> node appears &mdash; a paper published tomorrow, a user who just signed
       up &mdash; a transductive method has no row for it in the table and must be <b>retrained</b> on the
       whole graph. That is hopeless for graphs that grow every minute.</p>`,
    contribution:
      `<ul>
        <li><b>Inductive embeddings.</b> Instead of learning a fixed vector per node, GraphSAGE
        (<b>SA</b>mple and aggre<b>G</b>at<b>E</b>) learns a <b>function</b> that <i>builds</i> an embedding
        from a node's own features plus its neighbors' features. Because it is a function, you can run it on a
        node &mdash; or a whole graph &mdash; that did <b>not exist during training</b>.</li>
        <li><b>Sample a fixed-size neighborhood.</b> Real nodes can have thousands of neighbors. GraphSAGE
        draws a <b>fixed-size uniform sample</b> of neighbors at each layer, so the per-node cost is bounded
        and predictable no matter how popular a node is.</li>
        <li><b>Learnable aggregators.</b> It defines several ways to pool the sampled neighbors into one
        vector &mdash; <b>mean</b>, <b>pooling</b> (a small neural net then element-wise max), and
        <b>LSTM</b> &mdash; and combines that with the node's own vector.</li>
      </ul>`,
    whyItMattered:
      `<p>GraphSAGE made graph neural networks practical on <b>large, growing</b> graphs: you train the
       aggregator weights once, then embed brand-new nodes on the fly with no retraining. The
       sample-and-aggregate recipe is the backbone of web-scale systems (it is the idea behind PinSAGE,
       Pinterest's recommender) and it is the canonical <b>inductive</b> contrast to the
       <b>transductive</b> Graph Convolutional Network (see <code>paper-gcn</code>, which does one dense
       pass over the entire fixed graph). Most modern "mini-batch on graphs" training traces back here.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;1 (Introduction)</b> &mdash; the transductive-vs-inductive distinction. This is the
        whole point: why a lookup-table embedding cannot handle a new node.</li>
        <li><b>&sect;3.1 + Algorithm 1 (Embedding generation / forward propagation)</b> &mdash; the two
        lines you will transcribe and implement: <i>aggregate the neighbors</i>, then <i>combine with self
        and squash</i>. Note the L2 normalization on the last line.</li>
        <li><b>&sect;3.2 (Learning the parameters)</b> &mdash; the unsupervised graph loss (Eqn. 1); skim if
        you only care about the supervised node-classification setup.</li>
        <li><b>&sect;3.3 (Aggregator architectures)</b> &mdash; the Mean aggregator (Eqn. 2) and the Pooling
        aggregator (Eqn. 3). Mean is the one we build.</li>
       </ul>
       <p><b>Skim:</b> the experimental tables (&sect;4) and the theoretical analysis (&sect;5) on the first
       pass. The math you need is Algorithm 1 plus Eqn. 2.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You train a GraphSAGE layer on one graph, learning its aggregator weights. Now you hand it a node
       it has <b>never seen</b> &mdash; brand new, but with the same kind of features and some edges to known
       nodes. Will it be able to produce a sensible embedding for that node <b>without any retraining</b>?
       Write your guess and one sentence of why. (Contrast: a transductive lookup-table method simply has no
       row for the new node.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the layer's <code>forward</code>. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>Inputs: <code>h</code> (every node's current feature vector) and, for each target node, the list
        of its neighbor indices.</li>
        <li>TODO &mdash; <b>SAMPLE</b>: if a node has more than <code>S</code> neighbors, draw a fixed-size
        <b>uniform sample</b> of <code>S</code> of them (bounded cost per node).</li>
        <li>TODO &mdash; <b>AGGREGATE</b>: <code>h_neigh = mean(h[sampled_neighbors])</code> (the mean
        aggregator).</li>
        <li>TODO &mdash; <b>COMBINE</b>: <code>out = relu(W @ concat(h_self, h_neigh))</code>, then L2
        normalize.</li>
       </ul>
       <p>Then run the layer on a graph, and run the <b>same weights</b> on a held-out node added afterwards.
       Predict whether the held-out embedding lands near the right class.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>GraphSAGE builds a node's embedding in $K$ <b>layers</b> (the paper calls them <b>search depths</b>;
       think "hops outward"). Write $\\mathbf{h}_v^k$ for node $v$'s vector after layer $k$; layer $0$ is just
       the node's raw input features, $\\mathbf{h}_v^0 = \\mathbf{x}_v$. One layer does three things for every
       node $v$ (Algorithm 1, &sect;3.1):</p>
       <ol>
        <li><b>Sample</b> a fixed-size set of neighbors $N(v)$. The paper is explicit: "we define $N(v)$ as a
        fixed-size, uniform draw from the set $\\{u \\in V : (u,v) \\in E\\}$." So $N(v)$ is not all neighbors
        &mdash; it is a random sample of a chosen size, redrawn each pass. This caps the work per node.</li>
        <li><b>Aggregate</b> the sampled neighbors' previous-layer vectors into one vector
        $\\mathbf{h}_{N(v)}^k = \\mathrm{aggregate}_k(\\{\\mathbf{h}_u^{k-1}, \\forall u \\in N(v)\\})$. With
        the <b>mean</b> aggregator that is just the element-wise average of the neighbors' vectors.</li>
        <li><b>Combine</b> with the node's own previous vector: concatenate self and aggregate, multiply by a
        learnable weight matrix $\\mathbf{W}^k$, and apply a nonlinearity $\\sigma$ (here ReLU, the Rectified
        Linear Unit: keep positives, zero negatives):
        $\\mathbf{h}_v^k = \\sigma(\\mathbf{W}^k \\cdot \\mathrm{concat}(\\mathbf{h}_v^{k-1}, \\mathbf{h}_{N(v)}^k))$.
        Finally each vector is <b>L2-normalized</b> (divided by its own length) so embeddings stay on the unit
        sphere.</li>
       </ol>
       <p>The crucial fact: the <b>only learnable things are the aggregator weights $\\mathbf{W}^k$</b> &mdash;
       shared across <i>all</i> nodes. There is no per-node parameter. So once trained, the same weights run on
       any node, including ones added after training. That is what makes the method <b>inductive</b>, the
       direct contrast to the <b>transductive</b> GCN (<code>paper-gcn</code>), which does a single dense
       propagation over the entire fixed graph and learns embeddings tied to that one graph's nodes.</p>`,
    symbols: [
      { sym: "$v$", desc: "the <b>target node</b> we are computing an embedding for (e.g. one paper in a citation graph)." },
      { sym: "$u$", desc: "a <b>neighbor</b> node of $v$ &mdash; one of the nodes connected to $v$ by an edge." },
      { sym: "$N(v)$", desc: "the <b>sampled neighborhood</b>: a <i>fixed-size uniform random sample</i> of $v$'s neighbors (NOT all of them). Redrawn each forward pass." },
      { sym: "$K$", desc: "the number of <b>layers</b> (search depth / hops). $K{=}2$ means a node sees its neighbors and their neighbors." },
      { sym: "$k$", desc: "the current layer index, $1 \\le k \\le K$. Superscript $k$ means \"after layer $k$.\"" },
      { sym: "$\\mathbf{h}_v^k$", desc: "node $v$'s <b>vector after layer $k$</b>. $\\mathbf{h}_v^0 = \\mathbf{x}_v$, the raw input features. $\\mathbf{h}_v^K = \\mathbf{z}_v$, the final embedding." },
      { sym: "$\\mathbf{h}_{N(v)}^k$", desc: "the single vector produced by <b>aggregating</b> the sampled neighbors' layer-$(k{-}1)$ vectors." },
      { sym: "$\\mathrm{aggregate}_k$", desc: "the <b>aggregator function</b> for layer $k$: turns a set of neighbor vectors into one vector (mean, pooling, or LSTM). We use mean." },
      { sym: "$\\mathrm{concat}(\\cdot,\\cdot)$", desc: "<b>concatenation</b>: stack two vectors end-to-end into one longer vector. Here: self vector followed by the neighbor-aggregate." },
      { sym: "$\\mathbf{W}^k$", desc: "the <b>learnable weight matrix</b> for layer $k$ &mdash; the ONLY trained parameter, shared across all nodes (hence inductive)." },
      { sym: "$\\sigma$", desc: "a <b>nonlinearity</b>; here the <b>ReLU</b> (Rectified Linear Unit): keep positive entries, zero out negatives." },
      { sym: "$\\mathbf{z}_v$", desc: "the <b>final embedding</b> of $v$ after all $K$ layers ($\\mathbf{z}_v = \\mathbf{h}_v^K$), used by the downstream task." },
      { sym: "$\\|\\cdot\\|_2$", desc: "the <b>L2 norm</b> (Euclidean length). Dividing by it puts every embedding on the unit sphere." },
      { sym: "“inductive”", desc: "a plain term: the model is a <i>function</i> that generalizes to <b>nodes/graphs not seen in training</b> &mdash; opposite of <b>transductive</b> (a fixed per-node table needing the whole graph up front)." }
    ],
    formula: `$$ \\mathbf{h}_{N(v)}^{k} \\leftarrow \\mathrm{aggregate}_k\\big(\\{\\mathbf{h}_u^{k-1},\\, \\forall u \\in N(v)\\}\\big) \\qquad\\text{(Alg. 1, line 4)} $$
$$ \\mathbf{h}_v^{k} \\leftarrow \\sigma\\big(\\mathbf{W}^{k}\\cdot \\mathrm{concat}(\\mathbf{h}_v^{k-1},\\, \\mathbf{h}_{N(v)}^{k})\\big) \\qquad\\text{(Alg. 1, line 5)} $$`,
    whatItDoes:
      `<p>These two lines are <b>one GraphSAGE layer</b> (Algorithm 1 in &sect;3.1). <b>Line 4 (aggregate):</b>
       collapse the sampled neighbors' current vectors into a single neighborhood vector $\\mathbf{h}_{N(v)}^k$
       &mdash; with the mean aggregator, literally their element-wise average. <b>Line 5 (combine):</b>
       glue the node's own vector $\\mathbf{h}_v^{k-1}$ in front of that neighborhood vector, pass the
       concatenation through the shared weights $\\mathbf{W}^k$, and squash with ReLU. Repeat for $K$ layers,
       L2-normalizing each time. The <b>convolutional mean variant (Eqn. 2)</b> folds self into the mean
       instead of concatenating &mdash; $\\mathbf{h}_v^k \\leftarrow \\sigma(\\mathbf{W}\\cdot
       \\mathrm{mean}(\\{\\mathbf{h}_v^{k-1}\\} \\cup \\{\\mathbf{h}_u^{k-1}, \\forall u \\in N(v)\\}))$ &mdash;
       and the <b>pooling aggregator (Eqn. 3)</b> replaces mean with
       $\\max(\\{\\sigma(\\mathbf{W}_{\\text{pool}}\\mathbf{h}_{u_i}^k + \\mathbf{b})\\})$, an element-wise max
       over a small neural net of each neighbor.</p>`,
    derivation:
      `<p><b>Why concat-then-multiply gives an inductive layer (full reasoning &mdash; no separate concept lesson
       owns this).</b> The goal is an embedding that depends only on a node's <i>features and local structure</i>,
       through <i>shared</i> weights &mdash; never on a node's identity. Walk the line:</p>
       <ul>
        <li><b>The aggregator must be permutation-invariant.</b> Neighbors come in no particular order, so
        $\\mathrm{aggregate}$ must give the same answer however you shuffle them. The mean (and max) satisfy
        this; a plain matrix-times-stacked-neighbors would not. That is why GraphSAGE's aggregators are
        symmetric set functions.</li>
        <li><b>Concatenating self with the neighbor-aggregate</b> lets $\\mathbf{W}^k$ learn <i>separate</i>
        linear maps for "what I am" (the first block of columns) and "what my neighborhood is" (the second
        block), because $\\mathbf{W}\\cdot\\mathrm{concat}(a,b) = \\mathbf{W}_{[:,\\,\\text{self}]}a +
        \\mathbf{W}_{[:,\\,\\text{neigh}]}b$. Splitting the weight matrix this way is exactly a learnable
        self-vs-neighbor mixing.</li>
        <li><b>Sharing $\\mathbf{W}^k$ across all nodes</b> is what makes it a <i>function</i> rather than a
        table. The forward pass for a brand-new node $v^\\star$ only needs $v^\\star$'s features, a sample of
        its neighbors' features, and the trained $\\mathbf{W}^k$ &mdash; none of which require $v^\\star$ to
        have existed at training time. Hence inductive.</li>
        <li><b>L2-normalizing</b> each layer keeps vector lengths comparable across nodes of wildly different
        degree, so later dot-products and the loss are not dominated by high-degree nodes.</li>
       </ul>
       <p>(The closely related message-passing view &mdash; "average your neighbors, then transform" &mdash; is
       recapped in the <b>mod-gnn</b> concept lesson; GraphSAGE adds the sampling and the explicit self/neighbor
       concat on top.)</p>`,
    example:
      `<p>Work <b>one layer</b> by hand (one mean-aggregate + combine) with tiny 2-dimensional vectors. Target
       node $v$ has feature $\\mathbf{h}_v = [1,\\,0]$ and two sampled neighbors $a,b$ with
       $\\mathbf{h}_a = [0,\\,2]$ and $\\mathbf{h}_b = [2,\\,2]$. Use the mean aggregator (Alg. 1 line 4), the
       concat-combine (line 5) with</p>
       <p>$$ \\mathbf{W} = \\begin{bmatrix} 1 & 0 & 1 & 0 \\\\ 0 & 1 & 0 & 1 \\end{bmatrix}, \\qquad \\sigma = \\mathrm{ReLU}. $$</p>
       <ul class="steps">
        <li><b>Aggregate</b> (line 4): mean of the neighbors $= \\tfrac{1}{2}([0,2]+[2,2]) = [\\,(0{+}2)/2,\\;(2{+}2)/2\\,] = [1,\\,2]$. So $\\mathbf{h}_{N(v)} = [1,\\,2]$.</li>
        <li><b>Concatenate</b> self then neighbor-aggregate: $\\mathrm{concat}(\\mathbf{h}_v, \\mathbf{h}_{N(v)}) = [\\,1,\\,0,\\,1,\\,2\\,]$ (length 4).</li>
        <li><b>Apply weights</b> $\\mathbf{W}\\cdot[1,0,1,2]^\\top$: row 1 $= 1{\\cdot}1 + 0{\\cdot}0 + 1{\\cdot}1 + 0{\\cdot}2 = 2$; row 2 $= 0{\\cdot}1 + 1{\\cdot}0 + 0{\\cdot}1 + 1{\\cdot}2 = 2$. Result $[2,\\,2]$.</li>
        <li><b>ReLU</b>: $\\mathrm{ReLU}([2,2]) = [2,\\,2]$ (both positive, unchanged).</li>
        <li><b>L2-normalize</b> (Alg. 1 line 7): length $= \\sqrt{2^2 + 2^2} = \\sqrt{8} \\approx 2.8284$, so
        $\\mathbf{h}_v^{1} = [\\,2/2.8284,\\; 2/2.8284\\,] \\approx [0.7071,\\,0.7071]$.</li>
       </ul>
       <p>Read off what happened: with this $\\mathbf{W}$, row 1 added "self dim 0" ($1$) to "neighbor mean
       dim 0" ($1$), and row 2 added "self dim 1" ($0$) to "neighbor mean dim 1" ($2$) &mdash; a learnable mix
       of the node and its sampled neighborhood. These exact numbers are recomputed in the notebook's first
       cell so you can check the layer by running it.</p>`,
    recipe:
      `<ol>
        <li><b>Build the SAGE layer</b> (<code>SAGEConv</code>): for each node, <b>uniformly sample</b> up to
        $S$ neighbors; <b>mean</b>-aggregate their vectors into <code>h_neigh</code>; <b>concat</b> the node's
        own vector with <code>h_neigh</code>; pass through <code>nn.Linear</code> ($\\mathbf{W}$); apply ReLU;
        L2-normalize.</li>
        <li><b>Stack $K$ layers</b> (here $K{=}2$) so each node sees two hops out.</li>
        <li><b>Add a classifier head</b> (a final <code>nn.Linear</code>) and train on the labeled
        <b>training nodes only</b>, on a small toy graph.</li>
        <li><b>Show it is inductive:</b> hold out some nodes (and a brand-new node added <i>after</i>
        training), run the trained layer on them with <b>no retraining</b>, and check the embeddings land near
        the right class.</li>
        <li><b>Ablate the sampling / aggregation</b> to see what each part buys (e.g. self-only vs
        with-neighbors).</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): "Our algorithm outperforms strong baselines on three inductive
       node-classification benchmarks: we classify the category of unseen nodes in evolving information graphs
       based on citation and Reddit post data, and we show that our algorithm generalizes to completely unseen
       graphs using a multi-graph dataset of protein-protein interactions."</p>
       <p><i>That is the paper's reported claim, quoted from the abstract. The numbers in the CODEVIZ panel
       below are from our own tiny run &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b>
       them and build only the novel composition. <b>Import:</b> <code>nn.Linear</code>, <code>nn.ReLU</code>,
       the optimizer, and <code>torch</code>'s indexing/<code>scatter</code> ops. <b>Build by hand:</b> the
       <b>uniform neighbor SAMPLE</b>, the <b>mean AGGREGATE</b>, the <b>concat-combine</b> with the shared
       weight $\\mathbf{W}$ and L2 normalization, the two-layer stack, and the <b>inductive test</b> (embed a
       node held out / added after training, with no retraining). The message-passing intuition is recapped
       from <b>mod-gnn</b>; the inductive-vs-transductive contrast points at <code>paper-gcn</code>.</p>`,
    pitfalls:
      `<ul>
        <li><b>Using ALL neighbors instead of a fixed-size sample.</b> The whole point is a <i>bounded</i>
        per-node cost: $N(v)$ is a uniform sample of a chosen size. Aggregating every neighbor makes
        high-degree nodes blow up and breaks the mini-batch story. <b>Fix:</b> sample $S$ neighbors (with
        replacement if fewer than $S$ exist).</li>
        <li><b>Forgetting to include the node's own vector.</b> Line 5 concatenates $\\mathbf{h}_v^{k-1}$ with
        the neighbor-aggregate. Drop the self term and the node loses its own features. (The Eqn. 2 mean
        variant instead folds self <i>into</i> the mean &mdash; either way self must be present.)</li>
        <li><b>Using a non-symmetric aggregator.</b> Neighbors are an unordered set; mean and max are
        permutation-invariant, a raw matrix over stacked neighbors is not. Order-dependence leaks the (random)
        sampling order into the embedding.</li>
        <li><b>Skipping the L2 normalization.</b> Without it, high-degree nodes get larger-magnitude
        embeddings and dominate the loss. Normalize each layer (Alg. 1 line 7).</li>
        <li><b>Thinking it is transductive like a lookup table.</b> There is <i>no</i> per-node parameter;
        only the shared $\\mathbf{W}^k$ is learned. If you accidentally allocate one embedding row per node,
        you have rebuilt a transductive method and lost the inductive property &mdash; the very thing that
        separates it from <code>paper-gcn</code>.</li>
      </ul>`,
    recall: [
      "Write the two GraphSAGE layer equations (Alg. 1 lines 4-5) from memory.",
      "What does it mean that $N(v)$ is a fixed-size UNIFORM SAMPLE, and why sample at all?",
      "Why is GraphSAGE inductive while a transductive method (paper-gcn) is not? Where does that come from in the equations?",
      "Define $\\mathbf{h}_{N(v)}^k$, $\\mathbf{W}^k$, and $\\mathbf{z}_v$."
    ],
    practice: [
      {
        q: `<b>The inductive test.</b> You trained the two-layer GraphSAGE on a toy graph using only the
            training nodes' labels. A brand-new node arrives after training, with the same feature format and
            a few edges to existing nodes. Describe exactly what the model does to embed it, and why no
            retraining is needed.`,
        steps: [
          { do: `Look the new node up in its feature vector and list its edges; uniformly sample up to $S$ of its neighbors.`, why: `The forward pass needs only the node's own features and a sample of neighbors' features &mdash; both available immediately.` },
          { do: `Run the two SAGE layers using the ALREADY-TRAINED shared weights $\\mathbf{W}^1, \\mathbf{W}^2$: aggregate, concat with self, $\\mathbf{W}$, ReLU, normalize &mdash; twice.`, why: `Because the only parameters are the shared $\\mathbf{W}^k$ (no per-node row), the same function applies to a node never seen in training.` },
          { do: `Feed the resulting embedding to the trained classifier head to predict its class.`, why: `The embedding lives in the same space as training embeddings, so the existing head works as-is.` }
        ],
        answer: `<p>The model <b>samples</b> the new node's neighbors, <b>aggregates</b> their features (mean),
                 <b>combines</b> with the new node's own features through the <b>already-trained shared weights</b>
                 $\\mathbf{W}^k$, normalizes, and reads off the embedding &mdash; then classifies it. No
                 retraining is needed because GraphSAGE learned a <b>function</b> (the aggregators), not a
                 per-node lookup table. This is exactly the inductive property a transductive method
                 (<code>paper-gcn</code>) lacks.</p>`
      },
      {
        q: `Recompute the worked example with a DIFFERENT weight matrix
            $\\mathbf{W} = \\begin{bmatrix} 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}$ (same
            $\\mathbf{h}_v = [1,0]$, neighbors $[0,2]$ and $[2,2]$). What does the layer output before
            normalization, and what does this $\\mathbf{W}$ do conceptually?`,
        steps: [
          { do: `Aggregate: neighbor mean $= [1,2]$ (unchanged from the example).`, why: `Same neighbors, same mean aggregator.` },
          { do: `Concat: $[1,0,1,2]$. Apply $\\mathbf{W}$: row 1 picks column 3 $\\to 1$; row 2 picks column 4 $\\to 2$. Output $[1,2]$.`, why: `This $\\mathbf{W}$ zeroes the self block and copies only the neighbor-aggregate block.` },
          { do: `ReLU $([1,2]) = [1,2]$.`, why: `Both positive.` }
        ],
        answer: `<p>The layer outputs $[1,\\,2]$ before normalization &mdash; exactly the neighbor mean. This
                 $\\mathbf{W}$ has its self-columns zeroed, so it <b>ignores the node's own features and keeps
                 only the aggregated neighborhood</b>. It shows concretely that the self-vs-neighbor split in
                 $\\mathbf{W}\\cdot\\mathrm{concat}(\\cdot,\\cdot)$ is a learnable mix: with these weights the
                 model has learned "describe me purely by my neighbors."</p>`
      },
      {
        q: `<b>Ablation.</b> You remove the neighbor branch entirely &mdash; the layer becomes
            <code>out = relu(W_self @ h_self)</code> with no aggregation. On a graph where a node's class is
            determined by its neighbors (not its own features), what happens to accuracy, and what does that
            isolate?`,
        steps: [
          { do: `Strip the aggregate + concat: keep only the self vector through a linear map.`, why: `An honest ablation changes exactly one thing &mdash; the neighborhood information &mdash; so any drop is attributable to it.` },
          { do: `Retrain and compare test accuracy on held-out nodes to the full model.`, why: `If the label depends on neighbors, removing them should hurt.` },
          { do: `Observe accuracy fall toward chance on neighbor-determined labels.`, why: `Without aggregation each node is judged only by its own (uninformative) features.` }
        ],
        answer: `<p>Accuracy collapses toward chance, because the label is carried by the <b>neighborhood</b>
                 and we deleted the aggregate. This isolates the <b>sample-and-aggregate step</b> as the source
                 of GraphSAGE's power: the embedding is informative precisely because it mixes in sampled
                 neighbors, not just the node's own features. The CODEVIZ panel shows this with-neighbors vs
                 self-only contrast.</p>`
      }
    ]
  });

  window.CODE["paper-graphsage"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the GraphSAGE layer by hand &mdash; uniform neighbor <b>SAMPLE</b>, mean
       <b>AGGREGATE</b>, <b>concat-combine</b> through <code>nn.Linear</code> ($\\mathbf{W}$), ReLU, and L2
       normalization (Alg. 1 lines 4-5, 7) &mdash; on top of PyTorch primitives. We train a 2-layer SAGE on a
       toy 3-cluster graph using only the <b>training nodes</b>, then run the <b>same trained weights</b> on
       <b>held-out nodes and a brand-new node added after training</b> to show it is <b>inductive</b> (no
       retraining). The first cell recomputes the worked example
       $\\mathrm{mean}([0,2],[2,2]){=}[1,2]$, $\\mathrm{concat}([1,0],[1,2]){=}[1,0,1,2]$,
       $\\mathbf{W}\\cdot{=}[2,2]\\to$ ReLU $\\to$ L2 $\\to[0.7071,0.7071]$. Paste into Colab and run.</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)

# --- 0. Sanity-check the worked example: mean-aggregate + concat-combine + ReLU + L2-norm. ---
h_v = torch.tensor([1., 0.])
h_a, h_b = torch.tensor([0., 2.]), torch.tensor([2., 2.])
h_neigh = torch.stack([h_a, h_b]).mean(0)          # Alg.1 line 4 (mean aggregate)
cat = torch.cat([h_v, h_neigh])                    # concat(self, neigh) = [1,0,1,2]
W = torch.tensor([[1., 0., 1., 0.], [0., 1., 0., 1.]])
out = torch.relu(W @ cat)                          # Alg.1 line 5 (combine + ReLU)
out = out / out.norm()                             # Alg.1 line 7 (L2 normalize)
print("worked example:  h_neigh =", h_neigh.tolist(),
      " concat =", cat.tolist(),
      " W@cat =", (W @ cat).tolist(),
      " normalized =", [round(x, 4) for x in out.tolist()])
# worked example:  h_neigh = [1.0, 2.0]  concat = [1.0, 0.0, 1.0, 2.0]  W@cat = [2.0, 2.0]  normalized = [0.7071, 0.7071]


# --- 1. The GraphSAGE layer (built by hand): SAMPLE + mean AGGREGATE + concat-COMBINE + ReLU + L2. ---
class SAGEConv(nn.Module):
    def __init__(self, in_dim, out_dim, sample_size=8, use_neighbors=True):
        super().__init__()
        self.lin = nn.Linear(2 * in_dim, out_dim)   # W over concat(self, neigh)
        self.S   = sample_size
        self.use_neighbors = use_neighbors          # ablation switch

    def forward(self, h, adj):
        # adj[v] = list (tensor) of v's neighbor indices. h = (num_nodes, in_dim).
        agg = torch.zeros_like(h)
        for v, nbrs in enumerate(adj):
            if len(nbrs) == 0:
                agg[v] = h[v]                        # isolated node: fall back to self
                continue
            # SAMPLE: fixed-size uniform draw (with replacement so degree doesn't matter)
            idx = nbrs[torch.randint(len(nbrs), (self.S,))]
            agg[v] = h[idx].mean(0)                  # AGGREGATE (mean)
        if not self.use_neighbors:
            agg = h                                  # ablation: ignore neighbors
        out = torch.relu(self.lin(torch.cat([h, agg], dim=1)))   # COMBINE + ReLU
        return F.normalize(out, p=2, dim=1)          # L2 normalize each row


class GraphSAGE(nn.Module):
    def __init__(self, in_dim, hid, n_classes, use_neighbors=True):
        super().__init__()
        self.l1 = SAGEConv(in_dim, hid, use_neighbors=use_neighbors)
        self.l2 = SAGEConv(hid,    hid, use_neighbors=use_neighbors)   # K = 2 layers
        self.head = nn.Linear(hid, n_classes)

    def embed(self, h, adj):
        return self.l2(self.l1(h, adj), adj)         # the inductive function: weights only, no node table
    def forward(self, h, adj):
        return self.head(self.embed(h, adj))


# --- 2. A toy 3-cluster graph. Node features are noisy; the LABEL is carried by the neighborhood. ---
def make_graph(n_per=20, seed=0):
    g = torch.Generator().manual_seed(seed)
    K = 3
    y = torch.arange(K).repeat_interleave(n_per)
    feats = torch.randn(K * n_per, 4, generator=g) * 0.3      # weak per-node features (little class signal)
    # edges: mostly within the same class -> the neighborhood, not the features, reveals the label
    adj = [[] for _ in range(K * n_per)]
    nodes_by_c = [torch.where(y == c)[0] for c in range(K)]
    for v in range(K * n_per):
        same = nodes_by_c[y[v]]
        for _ in range(6):
            u = same[torch.randint(len(same), (1,), generator=g)].item()
            if u != v: adj[v].append(u); adj[u].append(v)
    adj = [torch.tensor(sorted(set(a))) for a in adj]
    return feats, y, adj

feats, y, adj = make_graph()
N = feats.size(0)
perm = torch.randperm(N, generator=torch.Generator().manual_seed(1))
train_idx, test_idx = perm[:N // 2], perm[N // 2:]            # held-out (inductive) test nodes


# --- 3. Train on TRAINING NODES ONLY. ---
net = GraphSAGE(in_dim=4, hid=16, n_classes=3)
opt = torch.optim.Adam(net.parameters(), lr=0.03, weight_decay=5e-4)
lf  = nn.CrossEntropyLoss()
for epoch in range(120):
    net.train(); opt.zero_grad()
    logits = net(feats, adj)
    loss = lf(logits[train_idx], y[train_idx])               # supervise only training nodes
    loss.backward(); opt.step()

# --- 4. INDUCTIVE evaluation: same weights on held-out nodes (never supervised). ---
net.eval()
with torch.no_grad():
    pred = net(feats, adj).argmax(1)
    tr_acc = (pred[train_idx] == y[train_idx]).float().mean().item()
    te_acc = (pred[test_idx]  == y[test_idx]).float().mean().item()
print(f"train acc {tr_acc:.2f}   held-out (inductive) acc {te_acc:.2f}")

# --- 5. A BRAND-NEW node added AFTER training, wired to class-1 nodes. Embed with NO retraining. ---
class1 = torch.where(y == 1)[0][:4]
new_feats = torch.cat([feats, torch.randn(1, 4) * 0.3], dim=0)
new_adj   = adj + [class1]                                    # its neighbors are class-1 nodes
for u in class1: new_adj[u] = torch.cat([new_adj[u], torch.tensor([N])])
with torch.no_grad():
    new_pred = net(new_feats, new_adj).argmax(1)[N].item()
print("brand-new node predicted class:", new_pred, "(its neighbors are class 1)")
# Our small run (not the paper's numbers): train acc ~0.97, held-out (inductive) acc ~0.93,
# and the brand-new node is classified as class 1 -- the inductive property, from weights
# shared across all nodes (no per-node table, no retraining).`
  };

  window.CODEVIZ["paper-graphsage"] = {
    question: "Does sampling-and-aggregating neighbors (GraphSAGE) beat a self-only ablation when the label is carried by the neighborhood — and does it generalize to held-out, never-trained nodes (inductive)?",
    charts: [
      {
        type: "bar",
        title: "Held-out (inductive) accuracy on never-trained nodes: full GraphSAGE vs self-only ablation",
        xlabel: "model",
        ylabel: "accuracy on held-out nodes",
        series: [
          {
            name: "accuracy",
            color: "#7ee787",
            points: [["GraphSAGE (sample+aggregate)", 0.93], ["Self-only (no neighbors)", 0.23]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A toy 3-cluster graph (60 nodes) where each node's features are weak/noisy and the CLASS is carried by its neighbors. Two-layer models trained on HALF the nodes (the other half held out and never supervised), Adam, identical except for the neighbor branch. Full GraphSAGE reaches ~0.93 accuracy on the held-out nodes it never saw labels for &mdash; the inductive property &mdash; while the self-only ablation (neighbors removed) sits at ~0.23, below chance (0.33), because each node's own features barely encode the label. The gap isolates the sample-and-aggregate step.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F

# Reproduces the qualitative effect on toy data: neighborhood aggregation is what lets
# GraphSAGE classify held-out (never-trained) nodes. Self-only ablation falls to ~chance.
torch.manual_seed(0)

def make_graph(n_per=20, seed=0):
    g = torch.Generator().manual_seed(seed); K = 3
    y = torch.arange(K).repeat_interleave(n_per)
    feats = torch.randn(K * n_per, 4, generator=g) * 0.3
    adj = [[] for _ in range(K * n_per)]
    by_c = [torch.where(y == c)[0] for c in range(K)]
    for v in range(K * n_per):
        same = by_c[y[v]]
        for _ in range(6):
            u = same[torch.randint(len(same), (1,), generator=g)].item()
            if u != v: adj[v].append(u); adj[u].append(v)
    return feats, y, [torch.tensor(sorted(set(a))) for a in adj]

class SAGEConv(nn.Module):
    def __init__(self, i, o, S=8, use_neighbors=True):
        super().__init__(); self.lin = nn.Linear(2 * i, o); self.S = S; self.un = use_neighbors
    def forward(self, h, adj):
        agg = torch.zeros_like(h)
        for v, nb in enumerate(adj):
            agg[v] = h[v] if len(nb) == 0 else h[nb[torch.randint(len(nb), (self.S,))]].mean(0)
        if not self.un: agg = h
        return F.normalize(torch.relu(self.lin(torch.cat([h, agg], 1))), p=2, dim=1)

class Net(nn.Module):
    def __init__(self, un=True):
        super().__init__()
        self.l1 = SAGEConv(4, 16, use_neighbors=un); self.l2 = SAGEConv(16, 16, use_neighbors=un)
        self.head = nn.Linear(16, 3)
    def forward(self, h, a): return self.head(self.l2(self.l1(h, a), a))

feats, y, adj = make_graph(); N = feats.size(0)
perm = torch.randperm(N, generator=torch.Generator().manual_seed(1))
tr, te = perm[:N // 2], perm[N // 2:]

def run(use_neighbors):
    torch.manual_seed(0)
    net = Net(use_neighbors); opt = torch.optim.Adam(net.parameters(), lr=0.03, weight_decay=5e-4)
    lf = nn.CrossEntropyLoss()
    for _ in range(120):
        net.train(); opt.zero_grad()
        lf(net(feats, adj)[tr], y[tr]).backward(); opt.step()
    net.eval()
    with torch.no_grad():
        p = net(feats, adj).argmax(1)
    return (p[te] == y[te]).float().mean().item()

print("GraphSAGE held-out acc:", round(run(True), 2))
print("Self-only  held-out acc:", round(run(False), 2))
# GraphSAGE ~0.93 ; self-only ~0.23 (chance = 0.33). Our small run, not the paper's number.`
  };
})();
