/* Paper lesson — "Graph Convolutional Neural Networks for Web-Scale Recommender Systems" (PinSAGE),
   Ying, He, Chen, Eksombatchai, Hamilton, Leskovec, KDD 2018.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-pinsage".
   GROUNDED from arXiv:1806.01973 (abstract page) + the ar5iv HTML mirror: the importance-pooling
   CONVOLVE operation (Algorithm 1, Section 3.2) where the aggregator gamma is a weighted mean with
   weights = L1-normalized random-walk visit counts; the top-T neighbor selection by normalized visit
   count (Section 3.2, approximating Personalized PageRank); and the max-margin ranking loss on
   (query, positive, negative) triples (Eqn. 1, Section 3.3). Track B (architecture): compose with
   torch.nn (nn.Linear / Adam) and implement only the novel parts — importance-weighted neighborhood
   aggregation + the margin ranking loss — on a tiny synthetic item graph, and SHOW the margin / hit-rate
   improve as training drives the loss down. conceptLink = mod-gnn (message-passing recap).
   Cross-links paper-graphsage (PinSAGE is a web-scale GraphSAGE variant). */
(function () {
  window.LESSONS.push({
    id: "paper-pinsage",
    title: "PinSAGE — Graph Convolutional Neural Networks for Web-Scale Recommender Systems (2018)",
    tagline: "Make a Graph Convolutional Network scale to billions of items: pick each node's neighborhood with short random walks, aggregate neighbors as a weighted mean using their random-walk visit counts as importance weights, and train the embeddings with a max-margin ranking loss on (query, positive, negative) item triples.",
    module: "Papers · Graph Neural Networks",
    track: "architecture",
    paper: {
      authors: "Rex Ying, Ruining He, Kaifeng Chen, Pong Eksombatchai, William L. Hamilton, Jure Leskovec",
      org: "Pinterest; Stanford University",
      year: 2018,
      venue: "arXiv:1806.01973 (Jun 2018); KDD '18 (ACM SIGKDD)",
      citations: "", // no citation count shown on the fetched arXiv/ar5iv pages — omitted to avoid inventing one
      arxiv: "https://arxiv.org/abs/1806.01973",
      code: ""
    },
    conceptLink: "mod-gnn",
    partOf: [],
    prereqs: ["mod-gnn", "paper-graphsage"],

    // WHY READ IT
    problem:
      `<p>A <b>graph</b> (also called a <b>network</b>) is a set of <b>nodes</b> joined by <b>edges</b>. Here a
       node is an <b>item</b> &mdash; at Pinterest, a "pin" (an image) or a "board" (a collection of pins) &mdash;
       and an edge means two items are related (a pin belongs to a board). A <b>node embedding</b> is a short list
       of numbers, a vector, that summarizes an item so a recommender can find related items: items with
       <i>nearby</i> vectors are recommended together.</p>
       <p>A <b>Graph Convolutional Network (GCN)</b> learns such embeddings by <b>message passing</b>: each node
       repeatedly builds a new vector by <i>aggregating</i> the vectors of its neighbors (recapped in
       <code>mod-gnn</code>). That works on small graphs. The problem the paper raises (&sect;1): real
       recommendation graphs are <b>web-scale</b> &mdash; the abstract states Pinterest's graph has
       <b>3 billion nodes and 18 billion edges</b>. Two things break at that size:</p>
       <ul>
        <li><b>You cannot operate on the full graph.</b> Classic GCNs multiply by the whole graph's adjacency
        matrix every step. With billions of nodes that matrix does not fit in memory. You need a way to do the
        convolution using only a <i>small local neighborhood</i> per node.</li>
        <li><b>Which neighbors, and how much each counts?</b> A popular pin can have enormous degree (millions of
        neighbors). Treating all neighbors equally, or picking them uniformly at random, wastes the network on
        irrelevant ones. You want the <i>most relevant</i> neighbors, weighted by <i>how relevant</i> they are.</li>
       </ul>
       <p>PinSAGE is the GCN the authors built and deployed at Pinterest to solve exactly this.</p>`,
    contribution:
      `<ul>
        <li><b>Random-walk neighborhoods (importance-based).</b> Instead of using <i>all</i> graph neighbors,
        PinSAGE runs short <b>random walks</b> from each node and keeps only the <b>top $T$</b> nodes most often
        visited. Those visit counts (normalized) approximate <b>Personalized PageRank</b> &mdash; a principled
        "how relevant is this neighbor to me" score (&sect;3.2).</li>
        <li><b>Importance pooling.</b> The convolution aggregates those neighbors as a <b>weighted mean</b>, with
        weights equal to the random-walk visit counts (not a uniform average). Relevant neighbors count more
        (Algorithm 1, &sect;3.2).</li>
        <li><b>A max-margin ranking loss with curriculum.</b> Training pulls a query item's embedding toward a
        <b>positive</b> (a genuinely related item) and pushes it away from a <b>negative</b>, enforcing a fixed
        <b>margin</b> $\\Delta$ between them (Eqn. 1, &sect;3.3). The paper adds <b>hard negatives</b> that get
        harder over training to sharpen the embeddings.</li>
        <li><b>Engineering for scale</b> &mdash; producer&ndash;consumer minibatch construction on graphs too big
        for one machine, and a MapReduce inference algorithm. (We focus on the two ML ideas above.)</li>
      </ul>`,
    whyItMattered:
      `<p>PinSAGE showed that Graph Convolutional Networks &mdash; until then a research-scale technique &mdash;
       could be deployed in production on a graph with <b>billions of nodes</b> (per the abstract). It became the
       reference design for <b>web-scale graph recommendation</b>: localize the convolution with random-walk
       neighborhoods, weight neighbors by importance, and train with a ranking loss. It is a web-scale variant of
       <b>GraphSAGE</b> (<code>paper-graphsage</code>), which introduced sampling-and-aggregating neighborhoods so
       a GCN never needs the full graph at once; PinSAGE swaps GraphSAGE's uniform neighbor sampling for
       random-walk importance and adds the ranking objective. The graph context &mdash; message passing &mdash;
       is recapped in <code>mod-gnn</code>.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.2 (Importance-based neighborhoods) + Algorithm 1 (<code>convolve</code>)</b> &mdash; the
        heart of the method: how random-walk visit counts define both <i>which</i> neighbors (top $T$) and
        <i>their weights</i> $\\boldsymbol{\\alpha}$, and the three-line convolution (transform &rarr; weighted
        aggregate &rarr; combine + normalize). This is the equation you will transcribe and implement.</li>
        <li><b>&sect;3.3 (Loss function), Eqn. (1)</b> &mdash; the <b>max-margin ranking loss</b> over
        (query, positive, negative) triples. Read how the margin $\\Delta$ enters.</li>
        <li><b>&sect;3.3 (Hard negatives / curriculum)</b> &mdash; the harder-and-harder negative-sampling
        strategy. Understand <i>why</i> easy negatives stop teaching the model.</li>
       </ul>
       <p><b>Skim on the first pass:</b> &sect;3.1 (the stacked-convolution / minibatch setup), the MapReduce
       inference (&sect;3.4) and the systems details (&sect;3.5), and the experiments (&sect;4) &mdash; come back
       to the offline-metric and A/B-test tables once the convolution makes sense.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train tiny item embeddings on a synthetic graph using the <b>max-margin ranking loss</b>: for
       each <b>query</b> item you supply a <b>positive</b> (a related item) and a <b>negative</b> (an unrelated
       one), and the loss only pays when the negative is <i>not</i> at least a margin $\\Delta$ farther from the
       query than the positive. <b>Predict:</b> as training drives this loss toward zero, what happens to (a) the
       <b>hit-rate</b> &mdash; how often a query's nearest neighbor is a genuinely related item &mdash; and (b)
       the <b>gap</b> between the average related-item similarity and the average unrelated-item similarity? Write
       your guess (up, down, or flat) and one sentence of why before running.</p>`,
    attempt:
      `<p>Before the reveal, sketch the two novel pieces. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>TODO &mdash; <b>importance weights.</b> Given a node $u$ and the <b>visit counts</b> from random walks
        to its top-$T$ neighbors, compute $\\boldsymbol{\\alpha}$ = the <b>$L_1$-normalized</b> counts (divide each
        count by the sum of counts, so they add to $1$).</li>
        <li>TODO &mdash; <b>importance pooling.</b> Transform each neighbor's vector with
        $\\mathrm{ReLU}(\\mathbf{Q}\\mathbf{h}_v+\\mathbf{q})$, then aggregate them as a <b>weighted mean</b>
        using $\\boldsymbol{\\alpha}$ &mdash; <i>not</i> a plain average. Concatenate with the node's own vector,
        apply $\\mathrm{ReLU}(\\mathbf{W}\\cdot[\\,\\cdot\\,]+\\mathbf{w})$, and $L_2$-normalize.</li>
        <li>TODO &mdash; <b>max-margin loss.</b> For each (query $q$, positive $i$, negative $n$) triple, compute
        $\\max\\{0,\\ \\mathbf{z}_q\\!\\cdot\\!\\mathbf{z}_{n} - \\mathbf{z}_q\\!\\cdot\\!\\mathbf{z}_{i} + \\Delta\\}$
        and average over the batch.</li>
       </ul>
       <p>Then watch the hit-rate and the related-vs-unrelated similarity gap as the loss falls.</p>`,

    // HOW IT WORKS
    walkthrough:
      `<p>PinSAGE has two novel ML parts: a <b>localized convolution with importance pooling</b>, and a
       <b>max-margin ranking loss</b>. Both are built on top of ordinary neural-network pieces.</p>
       <p><b>Step 1 &mdash; pick the neighborhood with random walks (&sect;3.2).</b> A web-scale node can have
       millions of graph neighbors; you cannot aggregate them all. So from node $u$ PinSAGE simulates short
       <b>random walks</b> (start at $u$, repeatedly step to a random neighbor) and counts how often each other
       node is visited. The <b>neighborhood $\\mathcal{N}(u)$ is the top $T$ nodes with the highest normalized
       visit counts.</b> The paper notes that, in the limit of infinitely many walks, these normalized counts
       approximate the <b>Personalized PageRank</b> of $u$ &mdash; a standard relevance score. So the walk both
       <i>selects</i> the most relevant neighbors and, crucially, <i>scores</i> them.</p>
       <p><b>Step 2 &mdash; importance pooling: aggregate as a weighted mean (Algorithm 1, &sect;3.2).</b> The
       convolution (the paper calls it <code>convolve</code>) takes node $u$'s current vector $\\mathbf{z}_u$, its
       neighbors' vectors $\\{\\mathbf{z}_v\\}$, and the neighbor <b>weights</b> $\\boldsymbol{\\alpha}$ (the
       $L_1$-normalized visit counts), and does three things:</p>
       <ol>
        <li><b>Transform + aggregate.</b> Push each neighbor through a small dense layer
        $\\mathrm{ReLU}(\\mathbf{Q}\\mathbf{h}_v+\\mathbf{q})$, then combine them with the <b>symmetric
        aggregator</b> $\\gamma$. The key sentence (&sect;3.2): $\\gamma$ is a <b>weighted mean, with weights given
        by the $L_1$-normalized visit counts</b>. That is <b>importance pooling</b> &mdash; relevant neighbors
        (high visit count) contribute more. The result is the neighborhood vector $\\mathbf{n}_u$.</li>
        <li><b>Combine with self.</b> Concatenate $\\mathbf{z}_u$ with $\\mathbf{n}_u$ and push through another
        dense layer $\\mathrm{ReLU}(\\mathbf{W}\\cdot\\mathrm{concat}(\\mathbf{z}_u,\\mathbf{n}_u)+\\mathbf{w})$.</li>
        <li><b>Normalize.</b> Divide by its own length ($L_2$ norm) so all embeddings live on the unit sphere;
        this makes nearest-neighbor lookup well-behaved.</li>
       </ol>
       <p><b>Step 3 &mdash; train with a max-margin ranking loss (Eqn. 1, &sect;3.3).</b> The model is trained on
       (<b>query</b>, <b>positive</b>, <b>negative</b>) triples. A <b>query</b> $q$ and a <b>positive</b> $i$ are a
       known related pair; a <b>negative</b> $n$ is a sampled unrelated item. The loss wants the query&ndash;
       positive dot product to beat the query&ndash;negative dot product by at least a fixed <b>margin</b>
       $\\Delta$; if it already does, that triple costs nothing. The paper also <b>sharpens</b> training with
       <b>hard negatives</b> &mdash; items somewhat related to the query but not the true positive &mdash; and
       makes them <i>harder over epochs</i> (a curriculum), so the model keeps having something to learn.</p>`,
    architecture:
      `<p>PinSAGE is a <b>$K$-layer stack of the importance-pooling <code>convolve</code></b> (Algorithm 1) topped by
       a small output MLP, trained with the max-margin loss. The experiments use <b>$K=2$</b> convolution layers.</p>
       <p><b>Inputs.</b> Each node (pin) starts with a feature vector of <b>4,352</b> dimensions &mdash; the
       concatenation of a <b>4,096-d visual embedding</b> (from a VGG-style image network), a <b>256-d textual
       annotation embedding</b>, and the <b>log node degree</b> (&sect;3.1/&sect;4). Call this layer-$0$
       representation $\\mathbf{h}_u^{(0)}$.</p>
       <p><b>The two stacked convolution layers (Algorithm 2).</b> Layer $k$ runs <code>convolve</code> on every node
       using the previous layer's outputs as inputs &mdash; "the inputs to the convolutions at layer $k$ depend on
       the representations output from layer $k-1$." Each layer $k$ has its <i>own</i> parameters
       $\\mathbf{Q}^{(k)},\\mathbf{q}^{(k)}$ (the per-neighbor transform) and $\\mathbf{W}^{(k)},\\mathbf{w}^{(k)}$
       (the self+neighbor combine):</p>
       <ul>
        <li><b>Layer 1:</b> $\\mathbf{h}_u^{(0)}\\;(4{,}352\\text{-d})\\;\\longrightarrow\\;\\mathbf{h}_u^{(1)}\\;(d=1{,}024\\text{-d})$.
        The per-neighbor transform $\\mathrm{ReLU}(\\mathbf{Q}^{(1)}\\mathbf{h}_v+\\mathbf{q}^{(1)})$ produces a hidden
        vector of size $m=2{,}048$ before importance pooling; the combine step outputs $d=1{,}024$.</li>
        <li><b>Layer 2:</b> $\\mathbf{h}_u^{(1)}\\;(1{,}024\\text{-d})\\;\\longrightarrow\\;\\mathbf{h}_u^{(2)}\\;(1{,}024\\text{-d})$,
        same shapes ($m=2{,}048$ hidden, $d=1{,}024$ out). Two layers means each node sees its <b>2-hop</b>
        importance neighborhood.</li>
       </ul>
       <p><b>Importance neighborhoods feed every layer.</b> Before convolving, PinSAGE precomputes, for each node,
       its <b>top-$T$</b> random-walk neighbors and their <b>$L_1$-normalized visit counts</b>
       $\\boldsymbol{\\alpha}$; experiments use $T=50$. The same weighted-mean aggregator $\\gamma$ runs at both
       layers.</p>
       <p><b>Output head (Algorithm 2, lines 18&ndash;20).</b> The final layer-$K$ vector is mapped to the
       <b>1,024-d</b> embedding by a two-layer MLP:
       $\\mathbf{z}_u=\\mathbf{G}_2\\,\\mathrm{ReLU}(\\mathbf{G}_1\\mathbf{h}_u^{(K)}+\\mathbf{g})$. These $\\mathbf{z}_u$
       are what the ranking loss compares and what serves recommendations (nearest neighbors in embedding space).</p>
       <p><b>Minibatch construction (Algorithm 2).</b> For a minibatch of target nodes $\\mathcal{M}$, PinSAGE walks
       <i>backward</i>: it builds the sets $\\mathcal{S}^{(k)}$ of all nodes whose representations are needed at each
       layer (the $k$-hop importance neighborhoods of $\\mathcal{M}$), so only that small induced subgraph &mdash;
       not the 3-billion-node graph &mdash; is loaded and convolved per step. A producer&ndash;consumer pipeline
       overlaps this CPU graph-gathering with GPU model compute.</p>
       <p><b>Training head.</b> Embeddings are optimized with the max-margin ranking loss (Eqn. 1) over
       (query, positive, negative) triples, with a curriculum that adds <b>$n-1$ hard negatives</b> per item at
       epoch $n$. Our lesson code implements the two novel pieces &mdash; importance pooling and the margin loss
       &mdash; on a tiny graph; it does not reproduce these production dimensions.</p>`,
    symbols: [
      { sym: "$u$", desc: "the <b>node</b> (item) whose new embedding we are computing in this convolution." },
      { sym: "$\\mathcal{N}(u)$", desc: "the <b>neighborhood</b> of $u$: the <b>top $T$</b> nodes with the highest normalized random-walk visit counts from $u$ (not all graph neighbors)." },
      { sym: "$T$", desc: "the <b>neighborhood size</b> &mdash; how many top-visited neighbors we keep per node." },
      { sym: "$\\mathbf{z}_u$", desc: "the <b>current embedding</b> (input vector) of node $u$ for this layer." },
      { sym: "$\\mathbf{h}_v$", desc: "a <b>neighbor's input vector</b> ($v\\in\\mathcal{N}(u)$) fed into the per-neighbor transform." },
      { sym: "$\\boldsymbol{\\alpha}$", desc: "the <b>neighbor importance weights</b>: the random-walk visit counts to $u$'s neighbors, <b>$L_1$-normalized</b> (each divided by their sum, so they add to $1$). This is the novelty &mdash; non-uniform pooling weights." },
      { sym: "$\\gamma(\\cdot)$", desc: "the <b>symmetric aggregator</b> &mdash; the function that pools the neighbor vectors. In PinSAGE it is a <b>weighted mean</b> using $\\boldsymbol{\\alpha}$ (importance pooling)." },
      { sym: "$\\mathbf{Q},\\mathbf{q}$", desc: "the <b>weight matrix and bias of the per-neighbor transform</b> $\\mathrm{ReLU}(\\mathbf{Q}\\mathbf{h}_v+\\mathbf{q})$ applied to each neighbor before pooling." },
      { sym: "$\\mathbf{n}_u$", desc: "the <b>aggregated neighborhood vector</b>: the importance-weighted mean of the transformed neighbors." },
      { sym: "$\\mathbf{W},\\mathbf{w}$", desc: "the <b>weight matrix and bias of the combine step</b> that mixes a node's own vector with its neighborhood vector $\\mathbf{n}_u$." },
      { sym: "$\\mathbf{z}_u^{\\text{new}}$", desc: "the <b>output embedding</b> of $u$ after one convolution ($L_2$-normalized to unit length)." },
      { sym: "$K$", desc: "the <b>number of stacked convolution layers</b> &mdash; the depth of message passing (PinSAGE uses $K=2$, giving each node a 2-hop neighborhood)." },
      { sym: "$\\mathbf{h}_u^{(k)}$", desc: "the representation of node $u$ <b>after layer $k$</b>; $\\mathbf{h}_u^{(0)}$ is the input feature (visual + text + log-degree, 4,352-d) and layer $k$ takes layer $k-1$'s outputs as inputs." },
      { sym: "$\\mathbf{Q}^{(k)},\\mathbf{W}^{(k)}$", desc: "the <b>per-layer copies</b> of the transform and combine weights &mdash; each of the $K$ layers has its own $\\mathbf{Q},\\mathbf{q},\\mathbf{W},\\mathbf{w}$." },
      { sym: "$m,\\;d$", desc: "the <b>hidden dimension</b> $m$ (output of the per-neighbor transform, $2{,}048$) and the <b>convolution output dimension</b> $d$ ($1{,}024$, shared across layers and the final embedding)." },
      { sym: "$\\mathbf{G}_1,\\mathbf{G}_2,\\mathbf{g}$", desc: "the <b>output-head MLP</b> weights/bias that map the final layer-$K$ vector to the served embedding: $\\mathbf{z}_u=\\mathbf{G}_2\\,\\mathrm{ReLU}(\\mathbf{G}_1\\mathbf{h}_u^{(K)}+\\mathbf{g})$." },
      { sym: "$\\mathcal{M},\\;\\mathcal{S}^{(k)}$", desc: "a training <b>minibatch</b> $\\mathcal{M}$ of target nodes, and the sets $\\mathcal{S}^{(k)}$ of all nodes whose representations are needed at layer $k$ (the $k$-hop importance neighborhoods) &mdash; only this induced subgraph is loaded per step." },
      { sym: "$q,\\;i,\\;n_k$", desc: "a training <b>triple</b>: the <b>query</b> item $q$, a <b>positive</b> (related) item $i$, and a sampled <b>negative</b> item $n_k$." },
      { sym: "$\\mathbf{z}_q\\!\\cdot\\!\\mathbf{z}_i$", desc: "the <b>dot product</b> (inner product) of two embeddings &mdash; the similarity score. Larger means more related." },
      { sym: "$\\Delta$", desc: "the <b>margin</b>: how much farther the negative must be from the query than the positive before the loss is satisfied (zero)." },
      { sym: "$P_n(q)$", desc: "the <b>negative-sampling distribution</b> for query $q$ &mdash; where negatives $n_k$ are drawn from (including the paper's hard negatives)." }
    ],
    formula: `$$ \\textbf{convolve}(\\mathbf{z}_u,\\{\\mathbf{z}_v\\!: v\\in\\mathcal{N}(u)\\},\\boldsymbol{\\alpha};\\,\\gamma):\\quad \\mathbf{n}_u \\;\\leftarrow\\; \\gamma\\big(\\{\\,\\mathrm{ReLU}(\\mathbf{Q}\\mathbf{h}_v+\\mathbf{q})\\ :\\ v\\in\\mathcal{N}(u)\\,\\},\\ \\boldsymbol{\\alpha}\\big) $$
$$ \\mathbf{z}_u^{\\text{new}} \\;\\leftarrow\\; \\mathrm{ReLU}\\big(\\mathbf{W}\\cdot\\mathrm{concat}(\\mathbf{z}_u,\\mathbf{n}_u)+\\mathbf{w}\\big),\\qquad \\mathbf{z}_u^{\\text{new}} \\;\\leftarrow\\; \\mathbf{z}_u^{\\text{new}}/\\lVert \\mathbf{z}_u^{\\text{new}}\\rVert_2 \\qquad\\text{(Algorithm 1, \\S 3.2)} $$
$$ J_{\\mathcal{G}}(\\mathbf{z}_q,\\mathbf{z}_i) \\;=\\; \\mathbb{E}_{\\,n_k\\sim P_n(q)}\\;\\max\\!\\big\\{0,\\;\\; \\mathbf{z}_q\\!\\cdot\\!\\mathbf{z}_{n_k} \\,-\\, \\mathbf{z}_q\\!\\cdot\\!\\mathbf{z}_{i} \\,+\\, \\Delta\\big\\} \\qquad\\text{(Eqn. 1, \\S 3.3)} $$`,
    whatItDoes:
      `<p><b>Top two lines &mdash; the importance-pooling convolution (Algorithm 1).</b> First transform every
       neighbor's vector with one small dense layer (matrix $\\mathbf{Q}$, bias $\\mathbf{q}$, then $\\mathrm{ReLU}$
       to keep only positive parts). Then pool them with $\\gamma$ &mdash; here a <b>weighted mean</b> whose
       weights $\\boldsymbol{\\alpha}$ are the <b>$L_1$-normalized random-walk visit counts</b>: a neighbor visited
       twice as often pulls twice as hard. That gives $\\mathbf{n}_u$. Glue $\\mathbf{n}_u$ to the node's own
       vector $\\mathbf{z}_u$, pass through a second dense layer, and rescale to unit length. One layer of
       message passing &mdash; but with <i>importance</i> weights, not a flat average.</p>
       <p><b>Bottom line &mdash; the max-margin ranking loss (Eqn. 1).</b> Read it right to left inside the
       $\\max$: take the query&ndash;negative similarity, subtract the query&ndash;positive similarity, add the
       margin $\\Delta$. If the positive is already more similar to the query than the negative by at least
       $\\Delta$, this quantity is negative, the $\\max\\{0,\\cdot\\}$ clips it to <b>zero</b>, and the triple is
       "done." Otherwise the loss is positive and gradient descent <b>pulls the query toward the positive and
       pushes it from the negative</b> until the margin is met. Averaging over sampled negatives $n_k\\sim P_n(q)$
       gives the expectation. It is a <b>ranking</b> loss: it only cares that related beats unrelated by a margin,
       not about absolute scores.</p>`,
    derivation:
      `<p><b>Why a weighted mean by visit count (&sect;3.2).</b> A plain GCN convolution aggregates neighbors with
       a fixed, structure-only weighting (e.g. by node degree). PinSAGE instead asks "how relevant is this
       neighbor to $u$?" and answers with random walks: start many short walks at $u$ and count where they land.
       Nodes the walk keeps returning to are, by construction, well-connected to $u$ through many paths &mdash;
       and the normalized counts approximate <b>Personalized PageRank</b>, a standard relevance measure. Using
       those counts as the pooling weights $\\boldsymbol{\\alpha}$ means the aggregation <i>listens harder</i> to
       the more relevant neighbors. The $\\gamma$ stays a <b>symmetric</b> function (the order of neighbors must
       not matter), and a weighted mean is symmetric, so it is a valid aggregator. The graph message-passing
       framing this builds on is recapped in <code>mod-gnn</code>; PinSAGE is the web-scale, importance-weighted
       cousin of <code>paper-graphsage</code>'s sample-and-aggregate.</p>
       <p><b>Why a margin, and why the $\\max\\{0,\\cdot\\}$ (&sect;3.3).</b> For recommendation we do not need a
       calibrated probability &mdash; we need related items <i>ranked above</i> unrelated ones. A margin loss
       captures exactly that: it stops penalizing a triple the moment the positive wins by $\\Delta$, so the model
       does not waste effort widening gaps that are already wide enough, and instead spends its capacity on triples
       that are still wrong or borderline. The hinge $\\max\\{0,\\cdot\\}$ is what creates that "good enough,
       stop" behavior. Pairing it with <b>hard negatives</b> &mdash; negatives that are <i>almost</i> as similar
       as the positive &mdash; keeps the inside of the $\\max$ positive for longer, so there is always a gradient
       to learn from; making them harder over epochs is a <b>curriculum</b>.</p>`,
    example:
      `<p>Work <b>one importance-pooling aggregation</b> by hand. Node $u$ has three top-$T$ neighbors. Their
       transformed messages (after $\\mathrm{ReLU}(\\mathbf{Q}\\mathbf{h}_v+\\mathbf{q})$) are $2$-dimensional
       vectors, and the random walk visited each a different number of times:</p>
       <table class="extable">
        <caption>The three neighbors: transformed message, raw visit count, and the resulting
        $L_1$-normalized importance weight $\\alpha_v$ (uniform weight $1/3$ shown for the ablation).</caption>
        <thead><tr><th>neighbor</th><th class="num">message $\\mathbf{m}_v$</th><th class="num">visit count</th><th class="num">importance $\\alpha_v$</th><th class="num">uniform weight</th></tr></thead>
        <tbody>
         <tr><td class="row-h">$\\mathbf{m}_1$</td><td class="num">$(2,0)$</td><td class="num">6</td><td class="num">0.6</td><td class="num">0.3333</td></tr>
         <tr><td class="row-h">$\\mathbf{m}_2$</td><td class="num">$(0,4)$</td><td class="num">3</td><td class="num">0.3</td><td class="num">0.3333</td></tr>
         <tr><td class="row-h">$\\mathbf{m}_3$</td><td class="num">$(1,1)$</td><td class="num">1</td><td class="num">0.1</td><td class="num">0.3333</td></tr>
         <tr><td class="row-h">sum</td><td class="num">&mdash;</td><td class="num">10</td><td class="num">1.0</td><td class="num">1.0</td></tr>
        </tbody>
       </table>
       <ul class="steps">
        <li><b>Normalize the visit counts ($L_1$) into importance weights $\\boldsymbol{\\alpha}$.</b> Sum
        $=6+3+1=10$, so $\\boldsymbol{\\alpha}=(6/10,\\,3/10,\\,1/10)=(0.6,\\,0.3,\\,0.1)$. They add to $1$.</li>
        <li><b>Importance pooling = weighted mean, coordinate 1.</b>
        $0.6\\!\\cdot\\!2+0.3\\!\\cdot\\!0+0.1\\!\\cdot\\!1 = 1.2+0+0.1 = 1.3$.</li>
        <li><b>Importance pooling, coordinate 2.</b>
        $0.6\\!\\cdot\\!0+0.3\\!\\cdot\\!4+0.1\\!\\cdot\\!1 = 0+1.2+0.1 = 1.3$. So $\\mathbf{n}_u=(\\mathbf{1.3},\\,\\mathbf{1.3})$.</li>
        <li><b>Uniform-mean ablation.</b> $\\tfrac{1}{3}\\big((2,0)+(0,4)+(1,1)\\big) = \\tfrac{1}{3}(3,5) =
        (\\mathbf{1.0},\\,\\mathbf{1.6667})$.</li>
       </ul>
       <p>Read it off: importance pooling gives $(1.3,1.3)$, leaning toward the <b>frequently-visited</b> neighbor
       $\\mathbf{m}_1=(2,0)$ (weight $0.6$), whereas the uniform mean $(1.0,1.6667)$ over-weights the
       <b>rarely-visited</b> $\\mathbf{m}_2=(0,4)$ (only $1$ visit but a full $1/3$ share). Same neighbors,
       different aggregate &mdash; that is the entire point of the random-walk weights. These exact numbers are
       recomputed in the notebook's first cell.</p>`,
    recipe:
      `<ol>
        <li><b>Build importance neighborhoods.</b> From each node $u$, simulate short random walks; keep the
        <b>top $T$</b> most-visited nodes as $\\mathcal{N}(u)$, and store their <b>$L_1$-normalized visit counts</b>
        as the weights $\\boldsymbol{\\alpha}$.</li>
        <li><b>Importance-pooling convolution.</b> Transform each neighbor with
        $\\mathrm{ReLU}(\\mathbf{Q}\\mathbf{h}_v+\\mathbf{q})$; aggregate as a <b>weighted mean</b> with
        $\\boldsymbol{\\alpha}$; concatenate with the node's own vector; apply
        $\\mathrm{ReLU}(\\mathbf{W}\\cdot[\\,\\cdot\\,]+\\mathbf{w})$; $L_2$-normalize.</li>
        <li><b>Form triples.</b> For each <b>query</b> item draw a known <b>positive</b> (related) and a sampled
        <b>negative</b> (unrelated, plus hard negatives in the full paper).</li>
        <li><b>Max-margin ranking loss.</b> Optimize
        $\\max\\{0,\\ \\mathbf{z}_q\\!\\cdot\\!\\mathbf{z}_n-\\mathbf{z}_q\\!\\cdot\\!\\mathbf{z}_i+\\Delta\\}$ by
        gradient descent (Adam).</li>
        <li><b>Read out the effect.</b> Track the <b>hit-rate</b> (is a query's nearest neighbor truly related?)
        and the related-vs-unrelated similarity gap as the loss falls. <b>Ablate</b> importance pooling by
        swapping in a uniform aggregator and compare.</li>
      </ol>`,
    results:
      `<p>From the paper (abstract and &sect;4): PinSAGE was trained on <b>7.5 billion training examples</b> on a
       graph of <b>3 billion nodes</b> (pins and boards) and <b>18 billion edges</b>, and &mdash; per the abstract
       &mdash; "according to offline metrics, user studies and A/B tests, PinSage generates higher-quality
       recommendations than comparable deep learning and graph-based alternatives," which the authors describe as
       "the largest application of deep graph embeddings to date."</p>
       <p><i>Those are the paper's reported claims (quoted from the fetched abstract). The numbers in the CODEVIZ
       panel below are from our own tiny run &mdash; not the paper's results.</i></p>`,
    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> The natural metrics for a recommender are <b>hit-rate</b> (for a query
       item, is its nearest neighbor in embedding space a genuinely related item?) and the <b>related-vs-unrelated
       similarity gap</b> (mean intra-cluster cosine $-$ mean inter-cluster cosine). The paper's production metric
       is <b>recall@k / hit-rate@k</b> on held-out related pairs, plus the <b>MRR</b> it reports against deep-learning
       and graph baselines on Pinterest's <b>3B-node, 18B-edge</b> graph (trained on <b>7.5B examples</b>), where
       &mdash; per the abstract &mdash; "PinSage generates higher-quality recommendations than comparable&hellip;
       alternatives." The trivial floor: <b>random embeddings</b> give hit-rate $\\approx 1/(\\text{number of
       clusters})$ and a similarity gap near <b>0</b>; a recommender must clear both.</p>
       <p><b>2. Sanity checks BEFORE the full run.</b></p>
       <ul>
        <li><b>Replay the worked aggregation</b> (notebook cell 0): visit counts $6,3,1$ give
        $\\boldsymbol{\\alpha}=(0.6,0.3,0.1)$ and importance-pooled $\\mathbf{n}_u=(1.3,1.3)$ vs uniform
        $(1.0,1.6667)$. If these don't match, your weighting is wrong.</li>
        <li><b>Weights sum to 1.</b> Assert each node's $\\boldsymbol{\\alpha}$ is $L_1$-normalized
        ($\\sum_v \\alpha_v = 1$); un-normalized counts scale the aggregate by raw traffic.</li>
        <li><b>Loss sign / known-answer.</b> Hand a triple where the negative is closer than the positive
        ($\\mathbf{z}_q\\!\\cdot\\!\\mathbf{z}_n \\gt \\mathbf{z}_q\\!\\cdot\\!\\mathbf{z}_i$): the margin loss must
        be <b>positive</b>. Hand one where the positive already wins by more than $\\Delta$: the loss must be
        exactly <b>0</b> (the practice example: dots $0.8$ vs $0.5$, $\\Delta=0.1 \\Rightarrow \\max\\{0,-0.2\\}=0$).</li>
        <li><b>Output shape / norm.</b> Every embedding is $L_2$-normalized to unit length, so all self-similarities
        $\\mathbf{z}_u\\!\\cdot\\!\\mathbf{z}_u = 1$ and the dot product behaves like cosine.</li>
       </ul>
       <p><b>3. Expected range.</b> On our toy 21-item, 3-cluster graph (not the paper), a correct build drives the
       margin loss to <b>$\\approx 0$</b> while the similarity gap widens (<b>$0.235 \\to 0.933$</b>) and hit-rate
       climbs (<b>$0.667 \\to 1.0$</b>) over 150 epochs. A hit-rate stuck near the $1/3$ random floor, or a gap that
       stays near $0$, means the convolution or the loss is not learning. At Pinterest scale, anchor to the paper's
       claim of beating deep-learning and graph baselines on offline metrics, user studies, and A/B tests (abstract,
       &sect;4) &mdash; exact recall@k figures are best read off the paper's tables.</p>
       <p><b>4. Ablation &mdash; prove importance pooling earns its keep.</b> The central knob is the
       <b>weighted-mean aggregator</b> $\\gamma$. Swap it for a <b>uniform mean</b> over the same top-$T$ neighbors
       (the lesson's <code>importance=False</code> path), changing nothing else; the metric should <b>drop</b> &mdash;
       most visibly when the top-$T$ neighborhood is <b>noisy</b> (popular-but-irrelevant neighbors leak in), where
       the visit-count weights suppress noise a flat average over-weights. On an <i>easy</i> graph (top-$T$ already
       mostly correct) the two tie, so test the ablation on a noisy neighborhood or it will look like the idea does
       not matter. A second knob: drop <b>hard negatives</b> &rarr; the loss saturates to $0$ early and learning
       stalls.</p>
       <p><b>5. Failure signals &amp; what they mean.</b></p>
       <ul>
        <li><b>Hit-rate pinned at the $1/\\text{clusters}$ floor</b> &rarr; embeddings not learning: check the
        margin-loss sign, or that $\\gamma$ actually receives the neighbor messages.</li>
        <li><b>Loss drops to 0 in a few epochs but hit-rate stays low</b> &rarr; only <b>easy negatives</b>; the
        hinge is satisfied trivially. Add hard / increasingly-hard negatives (&sect;3.3).</li>
        <li><b>Importance and uniform pooling give identical results</b> &rarr; either $\\boldsymbol{\\alpha}$ is
        effectively uniform (forgot to weight before summing) or the graph is too easy &mdash; rerun the ablation on
        a noisy neighborhood.</li>
        <li><b>Loss negative or rewarding unrelated items</b> &rarr; margin-loss sign flipped; it must be
        $\\mathbf{z}_q\\!\\cdot\\!\\mathbf{z}_n - \\mathbf{z}_q\\!\\cdot\\!\\mathbf{z}_i + \\Delta$.</li>
        <li><b>Similarities outside $[-1,1]$ / unstable nearest-neighbor lookup</b> &rarr; skipped the $L_2$
        normalization of the output embeddings.</li>
       </ul>
       <p><i>The toy numbers ($0.235\\to0.933$, $0.667\\to1.0$) are our small run; the scale and baseline-beating
       claims are the paper's (abstract, &sect;4). The "few-epoch saturation" symptom is a rule of thumb.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives (dense layers, autograd, the optimizer)
       ship in PyTorch, so you <b>compose</b> with them and build only the novel parts.
       <b>Build by hand:</b> (1) the <b>random-walk neighborhood</b> &mdash; visit counts, top-$T$ selection, and
       $L_1$-normalized weights $\\boldsymbol{\\alpha}$; (2) the <b>importance-pooling convolution</b> &mdash; the
       weighted-mean aggregator (and a uniform aggregator for the ablation); (3) the <b>max-margin ranking
       loss</b> on (query, positive, negative) triples. <b>Import:</b> <code>nn.Linear</code> (the $\\mathbf{Q}$
       and $\\mathbf{W}$ transforms), <code>torch.optim.Adam</code>, and tensor ops. The graph/message-passing
       context is recapped from <code>mod-gnn</code>; the sample-and-aggregate predecessor is
       <code>paper-graphsage</code> (PinSAGE is its web-scale, importance-weighted variant). We use a tiny
       synthetic item graph and a few epochs on CPU.</p>`,
    pitfalls:
      `<ul>
        <li><b>Using a uniform mean instead of the visit-count weighted mean.</b> The whole contribution is that
        $\\gamma$ is a <b>weighted</b> mean with $\\boldsymbol{\\alpha}=$ $L_1$-normalized visit counts. A plain
        average throws the random-walk signal away. <b>Fix:</b> multiply each transformed neighbor by its
        $\\alpha$ before summing; check against the worked example $(1.3,1.3)$ vs $(1.0,1.6667)$.</li>
        <li><b>Forgetting to $L_1$-normalize the counts.</b> The weights must sum to $1$ (divide raw counts by
        their sum). Un-normalized counts would scale the aggregate by neighborhood traffic.</li>
        <li><b>Getting the margin-loss sign backwards.</b> Inside the $\\max$ it is
        <b>query&middot;negative &minus; query&middot;positive + $\\Delta$</b>. If you flip it you reward making
        unrelated items <i>more</i> similar. Sanity-check that the loss is large when a negative is closer than a
        positive.</li>
        <li><b>Only easy negatives.</b> With purely random negatives the loss saturates to zero early and the
        model stops learning. The paper's <b>hard, increasingly-hard negatives</b> (&sect;3.3) keep gradients
        alive; even our toy run shows the loss reaching $0$ quickly once the clusters separate.</li>
        <li><b>Skipping the $L_2$ normalization of the output.</b> PinSAGE normalizes each embedding to unit
        length so that the dot product behaves like a cosine similarity; nearest-neighbor recommendation relies on
        it.</li>
      </ul>`,
    recall: [
      "Write the importance-pooling step from memory: how is $\\boldsymbol{\\alpha}$ computed, and how does $\\gamma$ use it?",
      "Write the max-margin ranking loss $J_{\\mathcal{G}}$ (Eqn. 1) from memory, including where the margin $\\Delta$ goes.",
      "How does PinSAGE choose a node's neighborhood $\\mathcal{N}(u)$, and what do the normalized visit counts approximate?",
      "What does the $\\max\\{0,\\cdot\\}$ hinge accomplish &mdash; when is a triple's loss exactly zero?",
      "Define $\\boldsymbol{\\alpha}$, $\\mathbf{n}_u$, $T$, and $\\Delta$."
    ],
    practice: [
      {
        q: `<b>Recompute an importance aggregation.</b> Node $u$ has three neighbors with transformed messages
            $\\mathbf{m}_1=(1,0)$, $\\mathbf{m}_2=(0,2)$, $\\mathbf{m}_3=(2,2)$ and random-walk visit counts
            $5$, $4$, $1$. Give the importance weights $\\boldsymbol{\\alpha}$ and the pooled vector $\\mathbf{n}_u$,
            and compare with the uniform mean.`,
        steps: [
          { do: `Sum the visit counts: $5+4+1=10$. Normalize: $\\boldsymbol{\\alpha}=(0.5,\\,0.4,\\,0.1)$.`, why: `Importance weights are the $L_1$-normalized visit counts (sum to $1$).` },
          { do: `Weighted mean, coordinate 1: $0.5\\cdot1+0.4\\cdot0+0.1\\cdot2=0.5+0+0.2=0.7$.`, why: `Importance pooling multiplies each message by its $\\alpha$ then sums.` },
          { do: `Coordinate 2: $0.5\\cdot0+0.4\\cdot2+0.1\\cdot2=0+0.8+0.2=1.0$. So $\\mathbf{n}_u=(0.7,\\,1.0)$.`, why: `Same weighted sum on the other coordinate.` }
        ],
        answer: `<p>$\\boldsymbol{\\alpha}=(0.5,0.4,0.1)$ gives $\\mathbf{n}_u=(0.7,\\,1.0)$. The uniform mean is
                 $\\tfrac{1}{3}\\big((1,0)+(0,2)+(2,2)\\big)=\\tfrac{1}{3}(3,4)=(1.0,\\,1.333)$. Importance pooling
                 leans toward the most-visited neighbor $\\mathbf{m}_1=(1,0)$ (weight $0.5$) and down-weights the
                 once-visited $\\mathbf{m}_3=(2,2)$, so the two aggregates differ &mdash; exactly the effect the
                 random-walk weights are there to produce.</p>`
      },
      {
        q: `<b>When does the margin loss vanish?</b> Embeddings are unit vectors. For a triple, the
            query&ndash;positive dot product is $0.8$ and the query&ndash;negative dot product is $0.5$. With
            margin $\\Delta=0.1$, is the loss zero? What is the smallest $\\Delta$ that makes it positive?`,
        steps: [
          { do: `Evaluate the inside of the $\\max$: $\\mathbf{z}_q\\!\\cdot\\!\\mathbf{z}_n-\\mathbf{z}_q\\!\\cdot\\!\\mathbf{z}_i+\\Delta = 0.5-0.8+0.1=-0.2$.`, why: `Plug the dot products and the margin into Eqn. (1).` },
          { do: `Since $-0.2\\lt 0$, the hinge clips it: $\\max\\{0,-0.2\\}=0$.`, why: `The $\\max\\{0,\\cdot\\}$ makes already-satisfied triples cost nothing.` },
          { do: `Loss turns positive once $0.5-0.8+\\Delta\\gt 0$, i.e. $\\Delta\\gt 0.3$.`, why: `The margin must exceed the current similarity gap $0.8-0.5=0.3$ to still penalize this triple.` }
        ],
        answer: `<p>With $\\Delta=0.1$ the loss is $\\max\\{0,-0.2\\}=0$ &mdash; the positive already beats the
                 negative by $0.3\\gt\\Delta$, so this triple is "done" and contributes no gradient. The loss only
                 becomes positive when $\\Delta\\gt 0.3$ (the size of the current gap). This is why a fixed margin
                 plus easy negatives lets the loss saturate to zero, and why the paper introduces
                 <b>harder-and-harder negatives</b> (&sect;3.3) to keep the inside of the $\\max$ positive.</p>`
      },
      {
        q: `<b>Ablation &mdash; remove the importance weighting.</b> You replace PinSAGE's visit-count weighted
            mean with a plain uniform mean over the same top-$T$ neighbors, keeping everything else (the
            convolution shape, the max-margin loss) identical. On a graph whose top-$T$ neighbors are mostly the
            <i>correct</i> related items, do you expect a large or small change in hit-rate &mdash; and what would
            make the importance weighting matter more?`,
        steps: [
          { do: `Note that if the top-$T$ neighborhood is already almost all relevant items, both the weighted and uniform aggregate point in nearly the same direction.`, why: `When every neighbor is relevant, how you weight them barely changes the result.` },
          { do: `The weighting matters when the top-$T$ set is <b>mixed</b>: some relevant (high visit count), some noise (low count).`, why: `Then the $L_1$-normalized counts suppress the noisy neighbors that a uniform mean would over-weight.` },
          { do: `Measure hit-rate and the related-vs-unrelated similarity gap for both aggregators; change only the aggregator.`, why: `Isolating the aggregator attributes any difference to importance pooling &mdash; the exact part the paper introduces.` }
        ],
        answer: `<p>On an <i>easy</i> graph &mdash; where the random walk has already filtered the neighborhood down
                 to mostly-correct items &mdash; the change is <b>small</b>: both aggregators recover the clusters,
                 and our toy run shows comparable hit-rates. Importance pooling earns its keep when the top-$T$
                 set is <b>noisy</b> (popular but irrelevant neighbors leak in): there the visit-count weights
                 down-weight the noise that a uniform mean would treat as equally important. The CODEVIZ panel
                 reports the training-curve effect (margin gap and hit-rate rising as the max-margin loss falls);
                 the ablation print compares importance vs uniform pooling on the same toy graph.</p>`
      }
    ]
  });

  window.CODE["paper-pinsage"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>compose with</b> <code>nn.Linear</code> and Adam, and <b>build by hand</b> PinSAGE's two
       novel parts &mdash; the <b>random-walk importance neighborhood</b> (visit counts &rarr; top-$T$ &rarr;
       $L_1$-normalized weights $\\boldsymbol{\\alpha}$), the <b>importance-pooling convolution</b> (a
       <i>weighted</i> mean, plus a uniform-mean ablation), and the <b>max-margin ranking loss</b> on
       (query, positive, negative) triples. The first cell recomputes the worked aggregation
       ($\\boldsymbol{\\alpha}=[0.6,0.3,0.1]\\Rightarrow\\mathbf{n}_u=[1.3,1.3]$ vs uniform $[1.0,1.6667]$). Then,
       on a tiny synthetic item graph (three clusters of related items, with misleading cross-cluster edges), we
       train the embeddings and PRINT that as the margin loss falls the <b>hit-rate</b> climbs to $1.0$ and the
       <b>related-vs-unrelated similarity gap</b> widens. Paste into Colab and run (torch is preinstalled, CPU is
       fine).</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F
import numpy as np, random

np.random.seed(0); random.seed(0); torch.manual_seed(0)

# --- 0. Worked example: importance pooling of a tiny neighborhood. ---
# Three neighbors, transformed messages m1=(2,0), m2=(0,4), m3=(1,1); random-walk visit counts 6,3,1.
H = np.array([[2., 0.], [0., 4.], [1., 1.]])
visits = np.array([6., 3., 1.])
alpha = visits / visits.sum()                 # L1-normalized visit counts = importance weights
n_imp = (alpha[:, None] * H).sum(0)           # importance pooling = weighted mean
n_uni = H.mean(0)                              # uniform mean (the ablation)
print("alpha (L1-normalized visits):", np.round(alpha, 4))   # [0.6 0.3 0.1]
print("importance-pooled n_u:", np.round(n_imp, 4))          # [1.3 1.3]
print("uniform-mean n_u:      ", np.round(n_uni, 4))          # [1.     1.6667]

# --- 1. A tiny synthetic item graph: 3 clusters of related items + misleading cross-cluster edges. ---
C, PER = 3, 7; N = C * PER                      # 21 items, 3 clusters of 7
cluster = np.repeat(np.arange(C), PER)
adj = [[] for _ in range(N)]
for i in range(N):
    same  = [j for j in range(N) if j != i and cluster[j] == cluster[i]]
    other = [j for j in range(N) if cluster[j] != cluster[i]]
    adj[i] = same + random.sample(other, 5)    # 5 misleading cross-cluster edges per item

# --- 2. Random-walk importance neighborhoods: visit counts -> top-T -> L1-normalized weights. ---
def visit_counts(start, n_walks=300, length=6):
    cnt = np.zeros(N)
    for _ in range(n_walks):
        cur = start
        for _ in range(length):
            cur = random.choice(adj[cur]); cnt[cur] += 1
    return cnt

T = 6
NB, AL = [], []                                 # PinSAGE: top-T neighbors + importance weights
for u in range(N):
    cnt = visit_counts(u)
    order = np.argsort(-cnt)[:T]                 # top-T most-visited (approx. Personalized PageRank)
    w = cnt[order].astype(np.float32); w = w / w.sum()   # L1-normalize -> alpha
    NB.append(torch.tensor(order)); AL.append(torch.tensor(w))

# node input features, slightly cluster-correlated
feat = torch.randn(N, 8)
for c in range(C): feat[cluster == c] += torch.randn(8) * 1.0

# --- 3. The importance-pooling convolution (Algorithm 1). ---
class PinSageConv(nn.Module):
    def __init__(self, din=8, dh=16, dout=16):
        super().__init__()
        self.Q = nn.Linear(din, dh)             # per-neighbor transform  ReLU(Q h_v + q)
        self.W = nn.Linear(din + dh, dout)      # combine  ReLU(W concat(z_u, n_u) + w)
    def forward(self, z, NB, AL, importance=True):
        out = []
        for u in range(z.shape[0]):
            msg = F.relu(self.Q(z[NB[u]]))                       # transform each neighbor
            n_u = (AL[u][:, None] * msg).sum(0) if importance else msg.mean(0)  # weighted vs uniform pooling
            h = F.relu(self.W(torch.cat([z[u], n_u])))           # combine with self
            out.append(h / (h.norm() + 1e-9))                    # L2-normalize
        return torch.stack(out)

# --- 4. Max-margin ranking loss on (query, positive, negative) triples (Eqn. 1). ---
def hit_rate(z):
    z = F.normalize(z, dim=1); sim = z @ z.t(); sim.fill_diagonal_(-9)
    return float(np.mean([cluster[sim[u].argmax().item()] == cluster[u] for u in range(z.shape[0])]))
def gap(z):
    z = F.normalize(z, dim=1); ia, ie = [], []
    for i in range(z.shape[0]):
        for j in range(z.shape[0]):
            if i != j: (ia if cluster[i] == cluster[j] else ie).append(float((z[i] * z[j]).sum()))
    return float(np.mean(ia)), float(np.mean(ie))

def train(importance=True, epochs=150, margin=0.5, track=False):
    torch.manual_seed(0); random.seed(1)
    conv = PinSageConv(); opt = torch.optim.Adam(conv.parameters(), lr=0.01); snaps = {}
    for ep in range(epochs):
        z = conv(feat, NB, AL, importance)
        q   = torch.randint(0, N, (96,))
        pos = torch.tensor([random.choice([j for j in range(N) if cluster[j] == cluster[qi] and j != qi]) for qi in q])
        neg = torch.tensor([random.choice([j for j in range(N) if cluster[j] != cluster[qi]]) for qi in q])
        sq, sp, sn = z[q], z[pos], z[neg]
        # J = max(0,  z_q . z_neg  -  z_q . z_pos  +  margin)
        loss = torch.clamp((sq * sn).sum(1) - (sq * sp).sum(1) + margin, min=0).mean()
        if track and ep in (0, 25, 50, 100, 149):
            zd = z.detach(); ia, ie = gap(zd)
            snaps[ep] = (round(ia - ie, 3), round(hit_rate(zd), 3), round(float(loss.detach()), 3))
        opt.zero_grad(); loss.backward(); opt.step()
    return z.detach(), snaps

z_imp, snaps = train(importance=True, track=True)
z_uni, _     = train(importance=False)
print("\\ntraining curve  epoch -> (intra-inter cos gap, hit-rate, loss):")
for ep, s in snaps.items(): print(f"  ep {ep:3d}: gap={s[0]:+.3f}  hit={s[1]:.3f}  loss={s[2]:.3f}")
print("importance pooling: hit-rate", round(hit_rate(z_imp), 3), " intra/inter cos", tuple(round(x,3) for x in gap(z_imp)))
print("uniform-mean ablate: hit-rate", round(hit_rate(z_uni), 3), " intra/inter cos", tuple(round(x,3) for x in gap(z_uni)))

# Our small run (NOT the paper's numbers): with random-walk importance pooling + the max-margin ranking
# loss, training drives the loss to ~0 while the related-vs-unrelated similarity GAP widens
# (~0.24 -> ~0.93) and the hit-rate climbs (~0.67 -> 1.0) -- related items end up closer than negatives,
# exactly the qualitative effect PinSAGE is built to produce.`
  };

  window.CODEVIZ["paper-pinsage"] = {
    question: "As we train tiny item embeddings with random-walk importance pooling and the max-margin ranking loss, does the gap between related-item similarity and unrelated-item similarity actually widen — i.e. do related items end up closer than negatives — as the loss falls?",
    charts: [
      {
        type: "line",
        title: "Related-vs-unrelated similarity gap grows as the max-margin loss is trained down",
        xlabel: "epoch",
        ylabel: "mean intra-cluster cos − mean inter-cluster cos",
        series: [
          {
            name: "similarity gap (importance pooling)",
            color: "#7ee787",
            points: [[0, 0.235], [25, 0.894], [50, 0.901], [100, 0.933], [149, 0.933]]
          }
        ]
      },
      {
        type: "line",
        title: "Hit-rate (query's nearest neighbor is a genuinely related item) over training",
        xlabel: "epoch",
        ylabel: "hit-rate",
        series: [
          {
            name: "hit-rate",
            color: "#58a6ff",
            points: [[0, 0.667], [25, 1.0], [50, 1.0], [100, 1.0], [149, 1.0]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A tiny synthetic item graph: three clusters of seven related items each (21 items), with five misleading cross-cluster edges per item. Random walks select each item's top-6 neighbors and give their L1-normalized visit counts as importance weights; the importance-pooling convolution aggregates them as a weighted mean; the max-margin ranking loss (margin 0.5) pulls each query toward an in-cluster positive and pushes it from an out-of-cluster negative. Across 150 epochs the loss falls to ~0 while the related-vs-unrelated cosine GAP rises from 0.235 to 0.933 and the hit-rate rises from 0.667 to 1.0 — related items become closer than negatives, the effect PinSAGE is built to learn (Algorithm 1 + Eqn. 1, &sect;3.2-3.3). On this easy graph the uniform-mean ablation reaches a similar hit-rate; importance pooling's advantage shows most when the selected neighborhood is noisy.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F
import numpy as np, random
np.random.seed(0); random.seed(0); torch.manual_seed(0)

# Tiny synthetic item graph: 3 clusters of 7 related items + 5 misleading cross-cluster edges per item.
C, PER = 3, 7; N = C * PER
cluster = np.repeat(np.arange(C), PER)
adj = [[] for _ in range(N)]
for i in range(N):
    same  = [j for j in range(N) if j != i and cluster[j] == cluster[i]]
    other = [j for j in range(N) if cluster[j] != cluster[i]]
    adj[i] = same + random.sample(other, 5)

def visit_counts(start, n_walks=300, length=6):
    cnt = np.zeros(N)
    for _ in range(n_walks):
        cur = start
        for _ in range(length): cur = random.choice(adj[cur]); cnt[cur] += 1
    return cnt
T = 6; NB, AL = [], []
for u in range(N):
    cnt = visit_counts(u); order = np.argsort(-cnt)[:T]
    w = cnt[order].astype(np.float32); w = w / w.sum()
    NB.append(torch.tensor(order)); AL.append(torch.tensor(w))
feat = torch.randn(N, 8)
for c in range(C): feat[cluster == c] += torch.randn(8) * 1.0

class Conv(nn.Module):
    def __init__(s): super().__init__(); s.Q = nn.Linear(8, 16); s.W = nn.Linear(24, 16)
    def forward(s, z):
        out = []
        for u in range(z.shape[0]):
            msg = F.relu(s.Q(z[NB[u]])); n_u = (AL[u][:, None] * msg).sum(0)  # importance pooling
            h = F.relu(s.W(torch.cat([z[u], n_u]))); out.append(h / (h.norm() + 1e-9))
        return torch.stack(out)

def hit_rate(z):
    z = F.normalize(z, dim=1); sim = z @ z.t(); sim.fill_diagonal_(-9)
    return float(np.mean([cluster[sim[u].argmax().item()] == cluster[u] for u in range(N)]))
def gap(z):
    z = F.normalize(z, dim=1); ia, ie = [], []
    for i in range(N):
        for j in range(N):
            if i != j: (ia if cluster[i] == cluster[j] else ie).append(float((z[i]*z[j]).sum()))
    return np.mean(ia), np.mean(ie)

torch.manual_seed(0); random.seed(1)
conv = Conv(); opt = torch.optim.Adam(conv.parameters(), lr=0.01)
for ep in range(150):
    z = conv(feat)
    q   = torch.randint(0, N, (96,))
    pos = torch.tensor([random.choice([j for j in range(N) if cluster[j]==cluster[qi] and j!=qi]) for qi in q])
    neg = torch.tensor([random.choice([j for j in range(N) if cluster[j]!=cluster[qi]]) for qi in q])
    sq, sp, sn = z[q], z[pos], z[neg]
    loss = torch.clamp((sq*sn).sum(1) - (sq*sp).sum(1) + 0.5, min=0).mean()  # max-margin ranking loss
    if ep in (0, 25, 50, 100, 149):
        zd = z.detach(); ia, ie = gap(zd)
        print(f"ep {ep:3d}: gap={ia-ie:+.3f}  hit={hit_rate(zd):.3f}  loss={float(loss.detach()):.3f}")
    opt.zero_grad(); loss.backward(); opt.step()
# Our small run, not the paper's number: gap 0.235 -> 0.933, hit-rate 0.667 -> 1.0 as the loss -> 0.`
  };
})();