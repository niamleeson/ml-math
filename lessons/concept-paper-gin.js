/* Paper lesson — "How Powerful are Graph Neural Networks?" (GIN), Xu, Hu, Leskovec & Jegelka 2018 (ICLR 2019).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-gin".
   GROUNDED from arXiv:1810.00826 and the ar5iv HTML mirror:
     - Section 2 (Eq. 2.1): the general AGGREGATE / COMBINE message-passing framework.
     - Section 4.1 (Eq. 4.1): the GIN node-update rule  h_v^(k) = MLP^(k)((1+eps^(k)) h_v^(k-1) + sum_{u in N(v)} h_u^(k-1)).
     - Section 4.2 (Eq. 4.2): the concat-across-layers READOUT for graph-level tasks.
     - Theorem 3, Lemma 5, Corollary 6, Lemma 7: GIN is as powerful as the Weisfeiler-Lehman (WL) test when the
       aggregation is INJECTIVE; sum over an MLP achieves this.
     - Section 5 (Fig. 2 ranking sum > mean > max; Fig. 3 multisets mean/max confuse): why mean/max lose information.
   Track B (architecture): build the GIN layer (1+eps self-term + SUM over neighbours + MLP) by hand from raw torch
   tensors; demonstrate SUM distinguishes two multisets that MEAN/MAX confuse; ablate sum vs mean on a
   structure-distinguishing graph-classification task. Message-passing intuition lives in concept mod-gnn; we recap. */
(function () {
  window.LESSONS.push({
    id: "paper-gin",
    title: "GIN — How Powerful are Graph Neural Networks? (2018)",
    tagline: "A graph network is exactly as discriminative as its neighbour-aggregator is injective; SUM-over-neighbours fed through an MLP is injective, making GIN as powerful as the Weisfeiler-Lehman graph-isomorphism test.",
    module: "Papers · Graph Neural Networks",
    track: "architecture",
    paper: {
      authors: "Keyulu Xu, Weihua Hu, Jure Leskovec, Stefanie Jegelka",
      org: "MIT; Stanford University",
      year: 2018,
      venue: "arXiv:1810.00826 (Oct 2018); ICLR 2019",
      citations: "",
      arxiv: "https://arxiv.org/abs/1810.00826",
      code: "https://github.com/weihua916/powerful-gnns"
    },
    conceptLink: "mod-gnn",
    partOf: [],
    prereqs: ["mod-gnn", "dl-forward-prop", "dl-backprop", "la-matmul", "pt-nn-module", "dl-activations"],

    // WHY READ IT
    problem:
      `<p>By 2018 there were many <b>Graph Neural Networks (GNNs)</b> &mdash; networks that label a whole graph or
       its nodes by repeatedly letting each node mix information with its neighbours. A <b>graph</b> is a set of
       <b>nodes</b> joined by <b>edges</b>; the same node-mixing step (a "layer") is applied several times so signal
       travels further. GCN averages neighbours, GraphSAGE samples and pools them, and so on. They all
       <i>worked</i>, but nobody could say <b>how powerful</b> any of them actually was: given two graphs that are
       genuinely different in shape, will the network give them different representations, or will it be fooled
       into calling them the same?</p>
       <p>That question matters because the whole job of a graph classifier is to tell graph structures apart. If a
       layer throws away structural information, no amount of training can recover it. The paper notes GNN design
       had been "largely empirical" &mdash; built by intuition and tuned on benchmarks &mdash; "without theoretical
       understanding of their properties and limitations" (&sect;1). There was no yardstick for <b>expressive
       power</b>: the ability to map non-isomorphic (truly different) graphs to different embeddings.</p>
       <p>The authors found a natural yardstick already existed in graph theory: the <b>Weisfeiler-Lehman (WL)
       graph-isomorphism test</b>, a classic, fast procedure for deciding whether two graphs are "the same shape."
       The question became sharp: <i>can a GNN be as discriminating as the WL test &mdash; and what makes one fall
       short?</i></p>`,
    contribution:
      `<ul>
        <li><b>A theoretical ceiling.</b> The paper proves that <b>no</b> message-passing GNN can be more powerful
        at telling graphs apart than the <b>1-dimensional Weisfeiler-Lehman test</b>. The WL test is the upper bound
        for this whole family of models.</li>
        <li><b>The condition for reaching that ceiling: INJECTIVE aggregation.</b> A GNN is <i>as powerful as</i> the
        WL test exactly when the function that combines a node's neighbours is <b>injective</b> &mdash; it never maps
        two different neighbour-collections to the same output (Theorem 3). The neighbours form a <b>multiset</b> (a
        bag that remembers how many times each item appears), and the aggregator must distinguish different
        multisets.</li>
        <li><b>GIN: a network that meets the condition.</b> The <b>Graph Isomorphism Network</b> uses the simplest
        provably-injective aggregator: <b>SUM</b> the neighbours' vectors, add the node's own vector scaled by
        $(1+\\epsilon)$, then pass the result through a <b>multi-layer perceptron (MLP)</b> (Eqn. 4.1). The paper
        shows the popular <b>mean</b> and <b>max</b> aggregators are <i>not</i> injective and so are strictly weaker
        (&sect;5, Fig. 2). The abstract states GIN "is provably the most expressive among the class of GNNs and is
        as powerful as the Weisfeiler-Lehman graph isomorphism test."</li>
      </ul>`,
    whyItMattered:
      `<p>GIN turned GNN design from intuition into theory. "Make your aggregator injective" became the guiding rule,
       and SUM-plus-MLP became a default building block for graph-classification networks. The WL connection gave the
       field a precise vocabulary for <b>expressive power</b> and seeded a large line of follow-up work on
       "higher-order" GNNs that try to climb <i>above</i> the WL ceiling (since 1-WL itself cannot distinguish some
       structures, like certain regular graphs). When you need to classify whole graphs &mdash; molecules,
       program graphs, social networks &mdash; GIN is the standard strong baseline.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2 (Eqn. 2.1)</b> &mdash; the general <b>AGGREGATE / COMBINE</b> template that every
        message-passing GNN fits. This is the frame for everything that follows.</li>
        <li><b>&sect;3 + Theorem 3</b> &mdash; the central result: a GNN is as powerful as the WL test iff its
        aggregation is <b>injective</b>. Read the statement carefully; the proof can be skimmed.</li>
        <li><b>&sect;4.1 (Eqn. 4.1)</b> &mdash; the <b>GIN update</b> itself: $(1+\\epsilon)$ self-term, SUM over
        neighbours, MLP. This is the math you transcribe and implement. <b>&sect;4.2 (Eqn. 4.2)</b> &mdash; the
        graph-level READOUT that concatenates layer outputs.</li>
        <li><b>&sect;5 + Figure 2 + Figure 3</b> &mdash; why <b>mean</b> and <b>max</b> are weaker. Figure 2 ranks
        sum &gt; mean &gt; max; Figure 3 shows concrete neighbour multisets that mean/max confuse but sum separates.
        This is the intuition you will reproduce in code.</li>
       </ul>
       <p><b>Skim:</b> the formal proofs (Lemma 5, Corollary 6, Lemma 7 &mdash; they justify "sum + MLP is
       injective" and "a 1-layer perceptron is not enough"; take the results on faith) and the full experiment
       tables (&sect;7) unless you want the exact benchmark numbers.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Two nodes each look at their neighbours' colours. Node $v$ sees the multiset
       $\\{\\text{red},\\text{red},\\text{blue}\\}$ (two reds, one blue). Node $v'$ sees
       $\\{\\text{red},\\text{blue}\\}$ (one red, one blue). These are <b>different</b> neighbourhoods. Which
       aggregators give $v$ and $v'$ the <i>same</i> answer (and so cannot tell them apart), and which give
       different answers?</p>
       <ul>
        <li><b>MEAN</b> of the colour vectors?</li>
        <li><b>MAX</b> (element-wise maximum) of the colour vectors?</li>
        <li><b>SUM</b> of the colour vectors?</li>
       </ul>
       <p>Then the ablation: you train one network with a <b>SUM</b> aggregator and an identical one with a
       <b>MEAN</b> aggregator on a task whose answer depends on <i>how many</i> neighbours of each type a node has.
       Which network can solve it, and which is stuck?</p>
       <p>(Hint: a mean divides the count away; a sum keeps it.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the one layer you must build. Fill in the <code>TODO</code>s for the GIN update
       (Eqn. 4.1), where $H$ stacks node vectors as rows and $A$ is the adjacency matrix (1 if two nodes are
       connected):</p>
       <ul>
        <li>TODO: SUM each node's neighbours &mdash; <code>neigh = A @ H</code>
        <i># row $i$ of $A H$ is $\\sum_{u\\in N(i)} h_u$, the neighbour <b>sum</b> (not mean)</i></li>
        <li>TODO: add the self-term &mdash; <code>pre = (1 + eps) * H + neigh</code>
        <i># $(1+\\epsilon)\\,h_v + \\sum_{u\\in N(v)} h_u$</i></li>
        <li>TODO: transform with an MLP &mdash; <code>H_next = mlp(pre)</code>
        <i># MLP = Linear &rarr; ReLU &rarr; Linear; one perceptron is NOT enough (Lemma 7)</i></li>
       </ul>
       <p>For the graph-level head, pool every node (sum) at each layer and concatenate across layers (Eqn. 4.2).
       Also build the <b>ablation</b>: swap <code>A @ H</code> (sum) for a row-normalized <code>A @ H</code> (mean)
       and compare on the count-sensitive task.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p><b>The message-passing template (&sect;2).</b> Every GNN in this family repeats two steps per layer. For
       each node $v$: (1) <b>AGGREGATE</b> the current vectors of its neighbours $N(v)$ into one summary $a_v$;
       (2) <b>COMBINE</b> that summary with the node's own current vector to get its new vector. After $k$ layers a
       node's vector reflects its $k$-hop neighbourhood. The mod-gnn concept lesson builds this "gather neighbours,
       then update" intuition; here we ask <i>how good</i> the gather step can be.</p>
       <p><b>Neighbours are a multiset, and the test is injectivity (&sect;3).</b> A node's neighbours are not an
       ordered list and not a plain set &mdash; they are a <b>multiset</b>: a bag that remembers <i>multiplicity</i>
       (how many neighbours have each feature) but not order. To tell two different neighbourhoods apart, the
       aggregator must be <b>injective</b> on multisets: different multisets &rarr; different outputs, never a
       collision. The paper's key theorem says a GNN reaches the discriminative power of the
       <b>Weisfeiler-Lehman test</b> &mdash; the classic procedure that iteratively re-colours nodes by hashing
       their neighbours' colours &mdash; <b>exactly when</b> its aggregate-and-combine step is injective
       (Theorem 3). The WL test is the ceiling; injectivity is the key that reaches it.</p>
       <p><b>What is injective on multisets? SUM, fed through an MLP.</b> The paper proves (Lemma 5 + Corollary 6)
       that for a countable feature space there is a function $f$ so that the <b>sum</b> $\\sum_{x\\in X} f(x)$ is a
       <i>unique</i> fingerprint of the multiset $X$, and that
       $(1+\\epsilon)\\,f(c)+\\sum_{x\\in X} f(x)$ is injective in the (centre node $c$, neighbour multiset $X$) pair.
       A neural network learns that $f$ &mdash; but it must be a real <b>MLP</b> (Linear &rarr; nonlinearity
       &rarr; Linear), because Lemma 7 shows a <i>single</i> linear layer cannot separate all multisets. That is the
       whole recipe: SUM the neighbours, add the scaled self-term, push through an MLP.</p>
       <p><b>Why mean and max fall short (&sect;5).</b> A <b>mean</b> divides the sum by the count, so it keeps only
       the <i>distribution</i> (proportions) of neighbour features and forgets <i>how many</i> there were:
       $\\{a,a,a\\}$ and $\\{a,a\\}$ both average to $f(a)$. A <b>max</b> keeps only the largest value per coordinate,
       collapsing a multiset to a plain <b>set</b> and forgetting multiplicity entirely. Figure 2 ranks them: SUM
       (full multiset) &gt; MEAN (distribution only) &gt; MAX (set only). Figure 3 gives explicit neighbourhoods
       that mean/max confuse but sum separates. Hence GIN uses SUM.</p>`,
    architecture:
      `<p>GIN stacks identical message-passing layers, sum-pools after every layer, concatenates those pools, and
       classifies. Data flow for one graph with node-feature matrix $H^{(0)}$ (one row per node) and adjacency
       $A$:</p>
       <ul>
        <li><b>Per-layer GIN block (Eqn. 4.1), repeated $K$ times.</b> Each block, $k=1\\dots K$:
         <ul>
          <li><b>Neighbour SUM:</b> $A\\,H^{(k-1)}$ &mdash; row $v$ becomes $\\sum_{u\\in N(v)} h_u^{(k-1)}$.</li>
          <li><b>Self-term:</b> add $(1+\\epsilon^{(k)})\\,H^{(k-1)}$, with $\\epsilon^{(k)}$ a learnable scalar
          (the paper uses GIN-$\\epsilon$ learned, or GIN-0 with $\\epsilon=0$).</li>
          <li><b>MLP:</b> a <b>2-layer</b> perceptron Linear&nbsp;&rarr;&nbsp;<b>BatchNorm</b>&nbsp;&rarr;&nbsp;ReLU&nbsp;&rarr;&nbsp;Linear&nbsp;&rarr;&nbsp;BatchNorm&nbsp;&rarr;&nbsp;ReLU, mapping
          to the hidden width. BatchNorm sits on every hidden layer.</li>
         </ul>
        The paper uses <b>5 GNN layers</b> total (the input layer plus 4 GIN blocks).</li>
        <li><b>Hidden width.</b> 16 or 32 units for the bioinformatics graphs (MUTAG, PTC, NCI1, PROTEINS), 64 for the
        social-network graphs (COLLAB, IMDB, REDDIT).</li>
        <li><b>Graph readout (Eqn. 4.2).</b> After each layer $k=0\\dots K$, pool all node vectors with a per-layer
        READOUT (the paper sum-pools for bioinformatics, mean-pools for social datasets), then <b>concatenate</b> the
        $K+1$ pooled vectors into one graph vector $h_G$. Concatenating across layers (Jumping-Knowledge) keeps both
        shallow/local and deep/global structure.</li>
        <li><b>Classifier head.</b> A dense layer on $h_G$ (with <b>dropout</b> $\\in\\{0,0.5\\}$ after it), then
        softmax cross-entropy over graph classes.</li>
        <li><b>Optimization.</b> Adam, initial learning rate $0.01$, decayed by $0.5$ every 50 epochs.</li>
       </ul>
       <p>Our Track-B build keeps the spine &mdash; $\\mathrm{MLP}((1+\\epsilon)H + A H)$ per layer, sum-pool, concat,
       linear head &mdash; but shrinks it ($K=2$, hidden $=16$, no BatchNorm/dropout) so the SUM-vs-MEAN ablation is
       the only moving part.</p>`,
    symbols: [
      { sym: "$G$", desc: "a <b>graph</b>: a set of <b>nodes</b> (vertices) joined by <b>edges</b>. The thing we want to represent or classify." },
      { sym: "$v,\\,u$", desc: "<b>nodes</b>. $v$ is the centre node being updated; $u$ ranges over its neighbours." },
      { sym: "$N(v)$", desc: "the <b>neighbours</b> of node $v$: every node connected to $v$ by an edge." },
      { sym: "$h_v^{(k)}$", desc: "node $v$'s <b>feature vector after layer $k$</b> (its current representation). $h_v^{(0)}$ is the input node feature." },
      { sym: "multiset", desc: "a <b>bag that counts repeats</b>: like a set but it remembers multiplicity. $\\{a,a,b\\}$ (two $a$'s) differs from $\\{a,b\\}$. A node's neighbour features form a multiset (order does not matter, counts do)." },
      { sym: "injective", desc: "a function that <b>never collides</b>: different inputs always give different outputs. An injective aggregator maps different neighbour-multisets to different summaries &mdash; the property that makes a GNN maximally discriminative." },
      { sym: "$\\mathrm{AGGREGATE}^{(k)}$", desc: "the per-layer function that <b>summarizes a node's neighbours</b> into one vector $a_v^{(k)}$ (Eqn. 2.1). In GIN it is the SUM." },
      { sym: "$\\mathrm{COMBINE}^{(k)}$", desc: "the per-layer function that <b>merges a node's own vector with the neighbour summary</b> to produce its new vector (Eqn. 2.1). In GIN, the $(1+\\epsilon)$ self-term plus the MLP." },
      { sym: "$\\mathrm{MLP}^{(k)}$", desc: "a <b>multi-layer perceptron</b>: at least two linear layers with a nonlinearity (e.g. ReLU) between them. Learns the injective feature map; a single linear layer is provably not enough (Lemma 7)." },
      { sym: "$\\epsilon^{(k)}$", desc: "a small scalar (the <b>self-weight offset</b>) that scales the node's own vector as $(1+\\epsilon)$. Can be fixed at 0 or learned; a nonzero $\\epsilon$ helps keep the centre node distinguishable from its neighbours." },
      { sym: "WL test", desc: "the <b>Weisfeiler-Lehman graph-isomorphism test</b>: a classic algorithm that repeatedly re-colours each node by hashing the multiset of its neighbours' colours. It is the upper bound on how well any message-passing GNN can tell graphs apart." },
      { sym: "$h_G$", desc: "the <b>whole-graph representation</b>, built by a READOUT that pools all node vectors (Eqn. 4.2). Fed to a classifier for graph-level tasks." },
      { sym: "$\\mathrm{READOUT}$", desc: "the <b>graph-pooling</b> function that combines all node vectors into one graph vector; GIN sums nodes at each layer and concatenates across layers (injective pooling)." },
      { sym: "$a_v^{(k)}$", desc: "the <b>aggregated neighbour summary</b> for node $v$ at layer $k$ &mdash; the output of $\\mathrm{AGGREGATE}^{(k)}$ before it is combined with $v$'s own vector (Eqn. 2.1)." },
      { sym: "$K$", desc: "the <b>number of message-passing layers</b> (rounds). After $K$ layers a node sees its $K$-hop neighbourhood; the paper uses 5 GNN layers." },
      { sym: "$A$", desc: "the <b>adjacency matrix</b>: $A_{vu}=1$ if nodes $v,u$ are joined by an edge, else $0$. The product $A\\,H$ computes, in row $v$, the SUM of $v$'s neighbours' feature rows." },
      { sym: "$H^{(k)}$", desc: "the <b>node-feature matrix at layer $k$</b>: one row per node, row $v$ being $h_v^{(k)}$. $H^{(0)}$ is the input features." },
      { sym: "$X$", desc: "a <b>multiset of features</b> (e.g. a node's neighbour features) on which the aggregator acts; $x\\in X$ is one element." },
      { sym: "$f$", desc: "the per-element <b>feature map</b> applied to each $x$ before summing; chosen/learned so that $\\sum_{x\\in X} f(x)$ is injective on multisets (Lemma 5). The MLP realizes $f$." },
      { sym: "$h(X)$", desc: "the <b>multiset fingerprint</b> $\\sum_{x\\in X} f(x)$: a unique vector summary of the multiset $X$ when $f$ is chosen as in Lemma 5." },
      { sym: "$\\phi,\\,g$", desc: "$g$ is an arbitrary <b>multiset function</b> we want to compute; Lemma 5 shows it factors as $g(X)=\\phi(h(X))$ &mdash; first the injective sum, then a function $\\phi$ (also learnable). The outer MLP plays $\\phi$." },
      { sym: "$c$", desc: "the <b>centre node</b>'s own feature in the pair-map $h(c,X)$ of Corollary 6 (the $(1+\\epsilon)f(c)$ self-term); distinct from its neighbour multiset $X$." },
      { sym: "$W$", desc: "a <b>linear weight matrix</b>. Lemma 7 uses it to show a single linear layer $\\mathrm{ReLU}(Wx)$ summed over a multiset cannot be injective for any $W$." }
    ],
    formula:
      `$$ a_v^{(k)} = \\mathrm{AGGREGATE}^{(k)}\\!\\Big(\\big\\{\\, h_u^{(k-1)} : u\\in N(v) \\,\\big\\}\\Big), \\qquad h_v^{(k)} = \\mathrm{COMBINE}^{(k)}\\!\\big( h_v^{(k-1)},\\, a_v^{(k)} \\big) $$
       <p class="cap">&sect;2, Eqn. 2.1 &mdash; the general message-passing template: every GNN layer AGGREGATES the neighbour multiset, then COMBINES it with the node's own vector.</p>
       $$ a_v^{(k)} = \\mathrm{MAX}\\!\\Big(\\big\\{\\, \\mathrm{ReLU}\\big(W\\, h_u^{(k-1)}\\big) : u\\in N(v) \\,\\big\\}\\Big) $$
       <p class="cap">&sect;2, Eqn. 2.2 &mdash; the GraphSAGE max-pool aggregator (one variant GIN is shown to be stronger than).</p>
       $$ h_v^{(k)} = \\mathrm{ReLU}\\!\\Big( W \\cdot \\mathrm{MEAN}\\big\\{\\, h_u^{(k-1)} : u\\in N(v)\\cup\\{v\\} \\,\\big\\}\\Big) $$
       <p class="cap">&sect;2, Eqn. 2.3 &mdash; the GCN mean aggregator (the other weaker variant; mean is non-injective on multisets).</p>
       $$ h_G = \\mathrm{READOUT}\\!\\Big(\\big\\{\\, h_v^{(K)} : v\\in G \\,\\big\\}\\Big) $$
       <p class="cap">&sect;2, Eqn. 2.4 &mdash; the generic graph-level readout: pool all final node vectors into one graph vector.</p>
       $$ h_v^{(k)} = \\mathrm{MLP}^{(k)}\\!\\left( \\big(1+\\epsilon^{(k)}\\big)\\cdot h_v^{(k-1)} \\;+\\; \\sum_{u\\in N(v)} h_u^{(k-1)} \\right) $$
       <p class="cap"><b>&sect;4.1, Eqn. 4.1 &mdash; the GIN update (the paper's core).</b> SUM the neighbours, add the $(1+\\epsilon)$-scaled self-term, push through an MLP. SUM + MLP is the injective aggregator.</p>
       $$ h_G = \\mathrm{CONCAT}\\!\\Big( \\mathrm{READOUT}\\big(\\big\\{\\, h_v^{(k)} : v\\in G \\,\\big\\}\\big) \\;\\big|\\; k=0,1,\\dots,K \\Big) $$
       <p class="cap">&sect;4.2, Eqn. 4.2 &mdash; the GIN graph-level readout: sum-pool nodes at <i>every</i> layer $k$ and CONCATENATE across layers (Jumping-Knowledge style), so local and global structure both survive.</p>
       $$ h(X) = \\sum_{x\\in X} f(x), \\qquad g(X) = \\phi\\!\\left( \\sum_{x\\in X} f(x) \\right) $$
       <p class="cap">Lemma 5 &mdash; for a countable feature space there is a map $f$ making the SUM $h(X)$ a <i>unique</i> fingerprint of any bounded multiset $X$; every multiset function $g$ factors through that sum.</p>
       $$ h(c, X) = \\big(1+\\epsilon\\big)\\cdot f(c) + \\sum_{x\\in X} f(x) $$
       <p class="cap">Corollary 6 &mdash; for irrational $\\epsilon$, this pair-map is injective in the (centre node $c$, neighbour multiset $X$) pair &mdash; the form GIN realizes with $\\epsilon^{(k)}$ and the MLP.</p>
       $$ \\exists\\, X_1\\ne X_2 \\;\\text{such that}\\; \\sum_{x\\in X_1} \\mathrm{ReLU}(W x) = \\sum_{x\\in X_2} \\mathrm{ReLU}(W x) \\quad \\text{for every } W $$
       <p class="cap">Lemma 7 &mdash; a <i>single</i> linear layer cannot separate all multisets even with SUM; hence the per-element map must be a real MLP, not one Linear.</p>`,
    whatItDoes:
      `<p><b>Equation 4.1</b> is one GIN layer, read inside-out. (1) <b>SUM the neighbours:</b>
       $\\sum_{u\\in N(v)} h_u^{(k-1)}$ adds up the current vectors of all of $v$'s neighbours &mdash; a sum, not an
       average, so it keeps <i>how many</i> neighbours of each kind there are (the multiset's multiplicity). (2)
       <b>Add the scaled self-term:</b> $(1+\\epsilon^{(k)})\\,h_v^{(k-1)}$ keeps the node's own vector so it never
       forgets itself; the $\\epsilon$ lets the model weight "me" versus "my neighbours." (3) <b>Push through an
       MLP:</b> the multi-layer perceptron turns this raw sum into an injective fingerprint of the
       (node, neighbour-multiset) pair. Because SUM is the only one of {sum, mean, max} that is injective on
       multisets, and the MLP can realize the needed feature map (Lemma 5), this single layer makes the GNN as
       discriminating as one round of the WL test &mdash; and stacking layers matches the full WL test (Theorem 3).</p>`,
    derivation:
      `<p><b>Short recap &mdash; the message-passing view lives in the concept lesson.</b> The mod-gnn lesson frames
       a GNN layer as "each node gathers its neighbours, then updates itself." GIN is the instance whose gather step
       is provably the strongest possible: a SUM through an MLP. Head to <b>mod-gnn</b> for the AGGREGATE/COMBINE
       framing; here is <i>why SUM</i>.</p>
       <p><b>Why injectivity = WL power (Theorem 3).</b> The WL test re-colours node $v$ by hashing the multiset of
       its neighbours' colours; two graphs get different WL colourings exactly when they differ in some neighbour
       multiset at some round. A GNN layer does the analogous thing with real vectors instead of hash colours. If
       the layer's aggregate-and-combine map is <b>injective</b> on (node, neighbour-multiset) pairs, then whenever
       WL would assign different colours the GNN assigns different vectors &mdash; so it loses nothing WL keeps. If
       the map ever <i>collides</i> (two different multisets &rarr; same vector), the GNN is strictly weaker. Hence
       the whole game reduces to: <b>make the aggregator injective on multisets.</b></p>
       <p><b>Why SUM + MLP is injective (Lemma 5, Corollary 6).</b> The paper proves that for a countable feature
       space there is a map $f$ with $\\sum_{x\\in X} f(x)$ <i>unique</i> for every bounded multiset $X$ &mdash;
       intuitively, choose $f$ so each feature lands on a digit place that the sum cannot carry between, so the sum
       reads off "how many of each." Corollary 6 extends this to the pair
       $(1+\\epsilon)f(c)+\\sum_{x\\in X} f(x)$ for (centre $c$, neighbours $X$). A neural net learns $f$ as an MLP.
       Crucially, <b>one linear layer is not enough</b>: Lemma 7 exhibits distinct multisets $X_1\\ne X_2$ with
       $\\sum \\mathrm{ReLU}(Wx)$ equal for <i>every</i> $W$, so the nonlinearity-between-two-linears of an MLP is
       required.</p>
       <p><b>Why mean and max are strictly weaker (&sect;5).</b> A <b>mean</b> equals (sum)/(count): dividing by the
       count erases multiplicity, so it keeps only the <i>distribution</i> of neighbour types &mdash; $\\{a,a,a\\}$
       and $\\{a,a\\}$ both map to $f(a)$. A <b>max</b> takes the coordinate-wise maximum, which depends only on
       <i>which</i> features are present, not how many &mdash; it treats the multiset as a plain <b>set</b>. Both
       are non-injective, hence below the WL ceiling. The paper ranks them SUM &gt; MEAN &gt; MAX (Fig. 2).</p>`,
    example:
      `<p>Work the aggregators by hand on the <b>two neighbourhoods from <code>predict</code></b>, so you can see
       SUM separate what MEAN and MAX confuse. Use one-hot colour vectors:
       $\\text{red}=[1,0]$, $\\text{blue}=[0,1]$ (so $f$ is just identity, for clarity).</p>
       <ul class="steps">
        <li><b>The two multisets.</b> Node $v$'s neighbours are $\\{\\text{red},\\text{red},\\text{blue}\\}$
        (vectors $[1,0],[1,0],[0,1]$). Node $v'$'s neighbours are $\\{\\text{red},\\text{blue}\\}$
        (vectors $[1,0],[0,1]$). These are genuinely different bags.</li>
        <li><b>SUM (GIN).</b> $v$: $[1,0]+[1,0]+[0,1]=[2,1]$. &nbsp; $v'$: $[1,0]+[0,1]=[1,1]$.
        $\\;[2,1]\\ne[1,1]$ &mdash; <b>distinguished.</b> The first coordinate (2 vs 1) records that $v$ had two reds.</li>
        <li><b>MEAN.</b> $v$: $[2,1]/3=[0.667,0.333]$. &nbsp; $v'$: $[1,1]/2=[0.5,0.5]$. Different here only because
        the <i>proportions</i> differ. But take instead $\\{\\text{red},\\text{red}\\}$ vs $\\{\\text{red}\\}$: means
        are $[1,0]$ and $[1,0]$ &mdash; <b>identical</b>. Mean cannot count.</li>
        <li><b>MAX.</b> $v$: element-wise max of $[1,0],[1,0],[0,1] = [1,1]$. &nbsp; $v'$: max of $[1,0],[0,1]=[1,1]$.
        $\\;[1,1]=[1,1]$ &mdash; <b>confused.</b> Max only records that red and blue are <i>present</i>, not their counts.</li>
       </ul>
       <p><b>Read-off:</b> on $\\{r,r\\}$ vs $\\{r\\}$, SUM gives $[2,0]\\ne[1,0]$ (separates), MEAN gives
       $[1,0]=[1,0]$ (confused), MAX gives $[1,0]=[1,0]$ (confused). Only SUM is injective. These exact vectors are
       recomputed in the notebook's first cell.</p>`,
    recipe:
      `<ol>
        <li><b>The GIN layer (Eqn. 4.1).</b> Given node-feature matrix $H$ (row $i$ = node $i$) and adjacency $A$:
        compute the neighbour <b>sum</b> <code>A @ H</code>; add the self-term <code>(1+eps)*H</code>; pass the
        total through an <b>MLP</b> (Linear &rarr; ReLU &rarr; Linear, optionally BatchNorm). No average, no max.</li>
        <li><b>Stack $K$ layers</b> so each node sees its $K$-hop neighbourhood; keep each layer's output
        $H^{(0)},\\dots,H^{(K)}$.</li>
        <li><b>READOUT for graph classification (Eqn. 4.2):</b> at each layer pool all nodes (sum), then
        <b>concatenate</b> the per-layer pooled vectors: $h_G=\\mathrm{CONCAT}\\big(\\mathrm{SUM}(\\{h_v^{(k)}\\})\\,
        |\\,k=0,\\dots,K\\big)$. Feed $h_G$ to a linear classifier.</li>
        <li><b>Train</b> with cross-entropy and Adam on a set of labelled graphs.</li>
        <li><b>Ablate the aggregator:</b> rebuild the identical network but replace the neighbour <b>SUM</b> with a
        <b>MEAN</b> (row-normalize <code>A @ H</code> by degree). On a task whose label depends on neighbour
        <i>counts</i>, the SUM net should solve it and the MEAN net should fail &mdash; isolating injective
        aggregation as the cause.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): the framework yields "a simple architecture that is provably the most
       expressive among the class of GNNs and is as powerful as the Weisfeiler-Lehman graph isomorphism test." The
       paper validates this on <b>graph-classification</b> benchmarks &mdash; the bioinformatics datasets MUTAG,
       PTC, NCI1, PROTEINS and the social-network datasets COLLAB, IMDB-BINARY, IMDB-MULTI, REDDIT-BINARY,
       REDDIT-MULTI5K &mdash; where GIN matches or sets the state of the art and, the paper reports, fits the
       training set better than mean/max-based GNN variants, consistent with its higher representational power
       (&sect;7).</p>
       <p><i>These are the paper's own claims, quoted from the abstract and &sect;7. The numbers in the CODEVIZ
       panel below are from our own tiny run on a synthetic task &mdash; not the paper's reported results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives (matrix multiply, Linear layers, ReLU,
       cross-entropy, Adam) already ship in PyTorch, so you <b>import</b> them and build only the novel composition.
       <b>Import:</b> <code>nn.Linear</code>, <code>nn.ReLU</code>/<code>torch.relu</code>,
       <code>F.cross_entropy</code>, <code>torch.optim.Adam</code>. <b>Build by hand:</b> the GIN update
       <code>mlp((1+eps)*H + A @ H)</code> from raw tensors &mdash; the neighbour <b>SUM</b> via <code>A @ H</code>,
       the $(1+\\epsilon)$ self-term, and the two-linear MLP; the layer stack; the concat-across-layers READOUT; and
       the <b>sum-vs-mean ablation</b>. No graph library (no PyG/DGL) &mdash; the point is to see that the only
       difference between "as powerful as WL" and "strictly weaker" is SUM vs MEAN. The injectivity / WL theory is
       recapped from <b>mod-gnn</b> and the paper, not re-proved.</p>`,
    pitfalls:
      `<ul>
        <li><b>Using mean or max "because it's stabler."</b> Mean and max are <i>not</i> injective on multisets, so
        they cannot count neighbours and fall below the WL ceiling (&sect;5). If your task needs structure (graph
        classification), use <b>SUM</b>. Mean is fine only when node features are diverse and rarely repeat, or when
        you care about <i>distribution</i> not <i>structure</i> (&sect;5.3).</li>
        <li><b>A single linear layer instead of an MLP.</b> Lemma 7 shows one linear layer cannot separate all
        multisets even with the SUM. You need a real <b>MLP</b> (Linear &rarr; nonlinearity &rarr; Linear);
        replacing it with one <code>nn.Linear</code> silently caps expressiveness.</li>
        <li><b>Dropping the self-term.</b> Without $(1+\\epsilon)\\,h_v$ the node forgets its own current vector and
        only sees neighbours; the centre node and its neighbourhood are no longer jointly injective (Corollary 6).
        Keep the self-term.</li>
        <li><b>Normalizing the neighbour sum.</b> Dividing <code>A @ H</code> by degree silently turns SUM into MEAN
        &mdash; the very thing the paper proves is weaker. GIN deliberately leaves the sum un-normalized.</li>
        <li><b>Reading out only the last layer.</b> Eqn. 4.2 <b>concatenates</b> pooled features from <i>all</i>
        layers (Jumping-Knowledge style). Using only $H^{(K)}$ can lose information from earlier, more local rounds.</li>
        <li><b>Expecting to beat WL.</b> GIN <i>matches</i> the 1-WL test, it does not exceed it; structures 1-WL
        cannot tell apart (e.g. some regular graphs) GIN also cannot. That is a ceiling, not a bug.</li>
      </ul>`,
    recall: [
      "Write the GIN update rule (Eqn. 4.1) from memory, including the $(1+\\epsilon)$ self-term and the SUM.",
      "State Theorem 3 in one sentence: a GNN is as powerful as the WL test when its aggregation is ___.",
      "Give a pair of neighbour multisets that MEAN cannot tell apart but SUM can.",
      "Why must the aggregator use an MLP and not a single linear layer? (Lemma 7)",
      "Rank sum, mean, and max by representational power, and say what each one keeps (multiset / distribution / set)."
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have a GIN-style network that classifies tiny graphs by a structural rule:
            "graph is class 1 if it contains a node with &ge; 3 neighbours of colour red, else class 0." Train it
            once with the neighbour <b>SUM</b> aggregator and once with the identical network but a neighbour
            <b>MEAN</b> aggregator (sum divided by degree). What happens to each, and what does the contrast prove?`,
        steps: [
          { do: `Swap exactly one thing: the aggregator. Keep the same MLP sizes, self-term, READOUT, optimizer, labels, and epochs; change only <code>A @ H</code> (sum) to a degree-normalized <code>A @ H</code> (mean).`, why: `An honest ablation changes one factor, so any performance gap is attributable to sum-vs-mean injectivity, not to capacity or tuning.` },
          { do: `Note the task is a <b>count</b> rule ("&ge; 3 red neighbours"). The SUM net's neighbour summary contains the raw count of red, so a downstream unit can threshold it; accuracy approaches 100%.`, why: `SUM is injective on multisets, so the count of red neighbours survives into the node vector.` },
          { do: `The MEAN net divides by degree, so a node with 3 red out of 6 neighbours looks identical to one with 1 red out of 2 (both 0.5 red). It cannot recover the count and stalls near chance on this rule.`, why: `MEAN keeps only the <i>proportion</i> of red, not the absolute count, so the count-based label is unrecoverable &mdash; the exact non-injectivity the paper proves.` }
        ],
        answer: `<p>The <b>SUM</b> network learns the count rule and reaches near-perfect accuracy; the <b>MEAN</b>
                 network is stuck near chance because dividing by degree erases the absolute number of red
                 neighbours ($\\{r,r,r\\}$ out of 6 looks like $\\{r\\}$ out of 2). Since the <i>only</i> change was
                 sum vs mean, this isolates <b>injective (SUM) aggregation</b> &mdash; not extra parameters &mdash;
                 as the source of the extra expressive power, exactly the Theorem 3 / &sect;5 story. The CODEVIZ
                 panel shows this gap.</p>`
      },
      {
        q: `Two nodes have neighbour multisets $X = \\{\\text{blue},\\text{blue},\\text{green}\\}$ and
            $X' = \\{\\text{blue},\\text{green},\\text{green}\\}$. Using one-hot $\\text{blue}=[1,0]$,
            $\\text{green}=[0,1]$, compute the SUM, MEAN, and MAX summaries of each and say which aggregators
            distinguish $X$ from $X'$.`,
        steps: [
          { do: `SUM: $X\\to[1,0]+[1,0]+[0,1]=[2,1]$; $X'\\to[1,0]+[0,1]+[0,1]=[1,2]$.`, why: `Summing keeps the full counts, so $[2,1]\\ne[1,2]$ &mdash; distinguished.` },
          { do: `MEAN: $X\\to[2,1]/3=[0.667,0.333]$; $X'\\to[1,2]/3=[0.333,0.667]$.`, why: `Here the proportions differ (2:1 vs 1:2), so mean happens to distinguish them &mdash; but it would fail on $\\{b,b\\}$ vs $\\{b\\}$ (both $[1,0]$).` },
          { do: `MAX: $X\\to[\\max(1,1,0),\\max(0,0,1)]=[1,1]$; $X'\\to[1,1]$.`, why: `Max records only presence (both colours appear in both), not counts, so $[1,1]=[1,1]$ &mdash; confused.` }
        ],
        answer: `<p>SUM gives $[2,1]$ vs $[1,2]$ (<b>distinguished</b>); MEAN gives $[0.667,0.333]$ vs
                 $[0.333,0.667]$ (distinguished <i>here</i>, because proportions differ, but mean is non-injective in
                 general); MAX gives $[1,1]$ vs $[1,1]$ (<b>confused</b> &mdash; it sees only that both colours are
                 present). This matches Figure 2's ranking: SUM keeps the full multiset, MEAN keeps only the
                 distribution, MAX keeps only the set.</p>`
      },
      {
        q: `A colleague replaces GIN's two-layer MLP with a single <code>nn.Linear</code> "to simplify," keeping the
            SUM aggregator and the $(1+\\epsilon)$ self-term. Their model now fails to separate some graphs that
            full GIN separates. Why &mdash; isn't the SUM the important part?`,
        steps: [
          { do: `Recall Theorem 3 needs the <i>whole</i> aggregate-and-combine map to be injective, and Lemma 5 gives an $f$ making $\\sum f(x)$ injective &mdash; but $f$ must be learnable as a sufficiently rich function.`, why: `The SUM is injective only after the right per-element map $f$ is applied; a poor $f$ can re-introduce collisions.` },
          { do: `Apply Lemma 7: there exist distinct multisets $X_1\\ne X_2$ with $\\sum_{x\\in X_1}\\mathrm{ReLU}(Wx)=\\sum_{x\\in X_2}\\mathrm{ReLU}(Wx)$ for <i>every</i> linear $W$.`, why: `A single linear (or single-perceptron) layer cannot realize the injective $f$; some multisets stay merged no matter the weights.` },
          { do: `Restore the MLP (Linear &rarr; ReLU &rarr; Linear), which by universal approximation can model the needed $f$.`, why: `The hidden nonlinearity between two linears is exactly what lets the network learn an injective per-element map.` }
        ],
        answer: `<p>Because the SUM is injective <i>only</i> once a rich enough per-element map $f$ is applied first,
                 and Lemma 7 proves a single linear layer cannot be that map: there are distinct multisets it merges
                 for every weight matrix. GIN therefore needs a real <b>MLP</b> (at least two linears with a
                 nonlinearity between) so universal approximation can realize the injective $f$. SUM is necessary but
                 not sufficient &mdash; SUM <i>and</i> MLP together give Theorem 3's guarantee.</p>`
      }
    ]
  });

  window.CODE["paper-gin"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the GIN layer $\\mathrm{MLP}((1+\\epsilon)H + A H)$ by hand from raw torch tensors
       &mdash; the neighbour <b>SUM</b> is just <code>A @ H</code>, plus the $(1+\\epsilon)$ self-term, through a
       two-linear MLP. No graph library. The first cell recomputes the lesson's worked example: SUM, MEAN and MAX
       on the multisets $\\{r,r,b\\}$ vs $\\{r,b\\}$ (and $\\{r,r\\}$ vs $\\{r\\}$), printing exactly which
       aggregators collide. We then build a tiny <b>graph-classification</b> task whose label is a count rule
       ("has a node with &ge; 3 red neighbours"), train a GIN with the <b>SUM</b> aggregator, and print its accuracy.
       Paste into Colab and run (torch is preinstalled &mdash; no pip).</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)

# --- 0. Worked example: SUM vs MEAN vs MAX on two different neighbour multisets. ---
# Colours as one-hot:  red=[1,0], blue=[0,1].
red, blue = torch.tensor([1.,0.]), torch.tensor([0.,1.])
X  = torch.stack([red, red, blue])    # multiset {red, red, blue}  (node v)
Xp = torch.stack([red, blue])         # multiset {red, blue}       (node v')
for name, agg in [("SUM",  lambda T: T.sum(0)),
                  ("MEAN", lambda T: T.mean(0)),
                  ("MAX",  lambda T: T.max(0).values)]:
    a, b = agg(X), agg(Xp)
    print(f"{name:4s}  {{r,r,b}}={a.tolist()}  {{r,b}}={b.tolist()}  "
          f"-> {'DISTINGUISHED' if not torch.allclose(a,b) else 'CONFUSED'}")
# Harder pair where MEAN also fails: {r,r} vs {r}
X2, X2p = torch.stack([red, red]), red.unsqueeze(0)
for name, agg in [("SUM",  lambda T: T.sum(0)),
                  ("MEAN", lambda T: T.mean(0)),
                  ("MAX",  lambda T: T.max(0).values)]:
    a, b = agg(X2), agg(X2p)
    print(f"{name:4s}  {{r,r}}={a.tolist()}  {{r}}={b.tolist()}  "
          f"-> {'DISTINGUISHED' if not torch.allclose(a,b) else 'CONFUSED'}")
# SUM distinguishes both pairs; MEAN/MAX confuse {r,r} vs {r}; MAX also confuses {r,r,b} vs {r,b}.
print()

# --- 1. A tiny graph-classification task: label = 1 iff some node has >= 3 red neighbours. ---
# This is a COUNT rule -> needs an injective (SUM) aggregator; MEAN cannot recover the count.
def make_graph(n, p_edge, n_red, seed):
    g = torch.Generator().manual_seed(seed)
    A = (torch.rand(n, n, generator=g) < p_edge).float()
    A = torch.triu(A, 1); A = A + A.t()                 # symmetric, no self-loops in A
    feats = torch.zeros(n, 2); feats[:, 1] = 1.0         # all blue [0,1]
    red_idx = torch.randperm(n, generator=g)[:n_red]
    feats[red_idx] = torch.tensor([1., 0.])              # paint some nodes red [1,0]
    red_neigh = (A @ feats[:, 0:1]).squeeze(1)           # # red neighbours per node
    label = int((red_neigh >= 3).any().item())           # class 1 iff any node has >=3 red neighbours
    return A, feats, label

def make_dataset(num, seed0=0):
    data = []
    for s in range(num):
        n = int(torch.randint(6, 11, (1,)).item())
        A, X, y = make_graph(n, p_edge=0.45, n_red=int(torch.randint(2, 6, (1,)).item()), seed=seed0 + s)
        data.append((A, X, y))
    return data

torch.manual_seed(1)
train = make_dataset(160, seed0=0)
test  = make_dataset(60,  seed0=1000)

# --- 2. The GIN layer, by hand:  MLP( (1+eps)*H + A @ H ).  A @ H is the neighbour SUM. ---
class GINLayer(nn.Module):
    def __init__(self, c_in, c_out, eps=0.0):
        super().__init__()
        self.eps = nn.Parameter(torch.tensor(float(eps)))     # learnable (1+eps) self-weight
        self.mlp = nn.Sequential(nn.Linear(c_in, c_out), nn.ReLU(), nn.Linear(c_out, c_out))
    def forward(self, A, H):
        neigh = A @ H                                         # SUM_{u in N(v)} h_u   (Eq. 4.1)
        return self.mlp((1 + self.eps) * H + neigh)           # MLP( (1+eps)h_v + sum neighbours )

class GIN(nn.Module):
    def __init__(self, c_in, c_hid, n_classes, K=2):
        super().__init__()
        dims = [c_in] + [c_hid] * K
        self.layers = nn.ModuleList(GINLayer(dims[i], dims[i+1]) for i in range(K))
        # READOUT (Eq. 4.2): sum-pool each layer's nodes, concat across layers (incl. input).
        self.head = nn.Linear(c_in + c_hid * K, n_classes)
    def forward(self, A, X):
        H = X; pooled = [X.sum(0)]                            # layer-0 graph pooling
        for layer in self.layers:
            H = torch.relu(layer(A, H)); pooled.append(H.sum(0))
        return self.head(torch.cat(pooled))                  # graph logits

def run(dataset_train, dataset_test, epochs=40):
    torch.manual_seed(0)
    model = GIN(c_in=2, c_hid=16, n_classes=2, K=2)
    opt = torch.optim.Adam(model.parameters(), lr=0.01)
    for _ in range(epochs):
        model.train()
        for A, X, y in dataset_train:
            opt.zero_grad()
            logit = model(A, X).unsqueeze(0)
            F.cross_entropy(logit, torch.tensor([y])).backward(); opt.step()
    model.eval()
    with torch.no_grad():
        acc = sum(int(model(A, X).argmax().item() == y) for A, X, y in dataset_test) / len(dataset_test)
    return acc

acc = run(train, test)
print(f"GIN (SUM aggregator) test accuracy on the count rule = {acc:.3f}")
# GIN with SUM solves the >=3-red-neighbours rule (~1.0); a MEAN variant cannot (see CODEVIZ).
# (our small synthetic run -- not the paper's reported MUTAG/PROTEINS/REDDIT numbers)`
  };

  window.CODEVIZ["paper-gin"] = {
    question: "On a graph-classification task whose label is a COUNT rule ('some node has &ge; 3 red neighbours'), does the injective SUM aggregator solve it &mdash; and what happens when we ablate SUM &rarr; MEAN (divide by degree, the GCN-style average)?",
    charts: [
      {
        type: "line",
        title: "Graph-classification accuracy vs epoch — GIN-SUM (injective) vs ablation (MEAN aggregator)",
        xlabel: "training epoch",
        ylabel: "test accuracy on the count rule",
        series: [
          {
            name: "SUM aggregator (GIN)",
            color: "#7ee787",
            points: [[0,0.55],[2,0.633],[4,0.717],[6,0.783],[8,0.85],[10,0.9],[12,0.933],[14,0.95],[16,0.967],[18,0.967],[20,0.983],[22,0.983],[24,1.0],[26,1.0],[28,1.0],[30,1.0],[32,1.0],[34,1.0],[36,1.0],[39,1.0]]
          },
          {
            name: "MEAN aggregator (ablation)",
            color: "#ff7b72",
            points: [[0,0.5],[2,0.533],[4,0.55],[6,0.55],[8,0.567],[10,0.55],[12,0.583],[14,0.567],[16,0.567],[18,0.55],[20,0.583],[22,0.567],[24,0.567],[26,0.583],[28,0.55],[30,0.567],[32,0.567],[34,0.583],[36,0.55],[39,0.567]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. Tiny synthetic graphs (6-10 nodes, some painted red); the label is 1 iff some node has &ge; 3 red neighbours &mdash; a rule that depends on a neighbour <b>count</b>. The GIN with the <b>SUM</b> aggregator $\\sum_{u\\in N(v)} h_u$ (injective on multisets) recovers the count and climbs to ~100% test accuracy. The ABLATION replaces the sum with a degree-normalized <b>MEAN</b> (the GCN-style average): dividing by degree erases the absolute count (3-of-6 red looks like 1-of-2 red), so it hovers near chance (~55%) and never learns the rule. Same MLP sizes, self-term, READOUT, optimizer, and epochs; the only change is SUM vs MEAN &mdash; exactly Theorem 3 / §5's injectivity story.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np

# Does the injective SUM aggregator beat MEAN on a COUNT-based graph label?
# Label = 1 iff some node has >= 3 red neighbours. SUM keeps the count; MEAN divides it away.
def make_graph(n, p_edge, n_red, seed):
    g = torch.Generator().manual_seed(seed)
    A = (torch.rand(n, n, generator=g) < p_edge).float()
    A = torch.triu(A, 1); A = A + A.t()
    feats = torch.zeros(n, 2); feats[:, 1] = 1.0
    feats[torch.randperm(n, generator=g)[:n_red]] = torch.tensor([1., 0.])
    label = int(((A @ feats[:, 0:1]).squeeze(1) >= 3).any().item())
    return A, feats, label

def make_dataset(num, seed0):
    out = []
    for s in range(num):
        n = int(torch.randint(6, 11, (1,)).item())
        out.append(make_graph(n, 0.45, int(torch.randint(2, 6, (1,)).item()), seed0 + s))
    return out

torch.manual_seed(1)
train = make_dataset(160, 0); test = make_dataset(60, 1000)

class GIN(nn.Module):
    def __init__(s, mode):           # mode = "sum" (GIN) or "mean" (ablation)
        super().__init__(); s.mode = mode; K = 2; c_in, c_hid = 2, 16
        s.eps = nn.ParameterList([nn.Parameter(torch.tensor(0.0)) for _ in range(K)])
        dims = [c_in, c_hid, c_hid]
        s.mlps = nn.ModuleList(nn.Sequential(nn.Linear(dims[i], dims[i+1]), nn.ReLU(),
                                             nn.Linear(dims[i+1], dims[i+1])) for i in range(K))
        s.head = nn.Linear(c_in + c_hid * K, 2)
    def agg(s, A, H):
        if s.mode == "sum":  return A @ H
        deg = A.sum(1, keepdim=True).clamp(min=1)
        return (A @ H) / deg                                  # ablation: neighbour MEAN
    def forward(s, A, X):
        H = X; pooled = [X.sum(0)]
        for eps, mlp in zip(s.eps, s.mlps):
            H = torch.relu(mlp((1 + eps) * H + s.agg(A, H))); pooled.append(H.sum(0))
        return s.head(torch.cat(pooled))

def run(mode, epochs=40):
    torch.manual_seed(0); m = GIN(mode); opt = torch.optim.Adam(m.parameters(), lr=0.01); accs = []
    for _ in range(epochs):
        m.train()
        for A, X, y in train:
            opt.zero_grad(); F.cross_entropy(m(A, X).unsqueeze(0), torch.tensor([y])).backward(); opt.step()
        m.eval()
        with torch.no_grad():
            accs.append(sum(int(m(A, X).argmax().item() == y) for A, X, y in test) / len(test))
    return accs

s_acc = run("sum"); m_acc = run("mean")
idx = np.linspace(0, 39, 20).astype(int)
print("SUM  (GIN):", [[int(i), round(s_acc[i], 3)] for i in idx])
print("MEAN (abl):", [[int(i), round(m_acc[i], 3)] for i in idx])
# SUM -> ~100%; MEAN stuck near chance (~55%): it cannot recover the neighbour count.`
  };
})();
