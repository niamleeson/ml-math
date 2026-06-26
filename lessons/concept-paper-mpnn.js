/* Paper lesson — "Neural Message Passing for Quantum Chemistry" (MPNN), Gilmer, Schoenholz, Riley, Vinyals & Dahl 2017.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-mpnn".
   GROUNDED from arXiv:1704.01212 (abstract) and the ar5iv HTML mirror (Section 2: Eqns 1, 2, 3 — the
   message function M_t, vertex update U_t, and readout R; the "instances" table; the edge-network message
   M=A(e_vw)h_w and the set2set / GG-NN sum readout).
   Track B (architecture): build the generic message-pass (M -> aggregate -> U) layer and a sum readout R by
   hand from raw torch tensors on tiny molecular-style graphs; do graph-level regression. MPNN is the unifying
   framework — GCN, GraphSAGE, GAT are all instances; we recap that framing here and link mod-gnn. */
(function () {
  window.LESSONS.push({
    id: "paper-mpnn",
    title: "MPNN — Neural Message Passing for Quantum Chemistry (2017)",
    tagline: "One framework swallows every graph net: a node sends MESSAGES along edges, AGGREGATES them, UPDATES itself; a READOUT then pools all nodes into one graph-level prediction.",
    module: "Papers · Graph Neural Networks",
    track: "architecture",
    paper: {
      authors: "Justin Gilmer, Samuel S. Schoenholz, Patrick F. Riley, Oriol Vinyals, George E. Dahl",
      org: "Google Brain / Google",
      year: 2017,
      venue: "arXiv:1704.01212 (Apr 2017); ICML 2017",
      citations: "",
      arxiv: "https://arxiv.org/abs/1704.01212",
      code: ""
    },
    conceptLink: "mod-gnn",
    partOf: [],
    prereqs: ["mod-gnn", "dl-forward-prop", "dl-backprop", "la-matmul", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p>By 2017 there were already several neural networks that operate on <b>graphs</b> &mdash; a set of
       <b>nodes</b> (here, atoms in a molecule) joined by <b>edges</b> (chemical bonds). Each had its own name
       and its own equations: molecular-fingerprint nets, Gated Graph Neural Networks, interaction networks,
       early graph-convolution nets. They <i>looked</i> different, were described in different notation, and
       were hard to compare.</p>
       <p>The paper's complaint (&sect;1&ndash;2) is that this is wasteful. These models are "closely related"
       and "invariant to molecular symmetries," and they all do roughly the same thing: pass information along
       edges, then read out a whole-graph answer. But because nobody had written down the <i>shared</i>
       skeleton, you could not tell which design choices actually mattered, and every new idea had to be
       reinvented from scratch.</p>
       <p>The concrete task is <b>quantum chemistry</b>: given a molecule, predict a physical property (an
       energy, an orbital gap) that normally requires an expensive Density Functional Theory (DFT) simulation.
       This is a <b>graph-level</b> prediction &mdash; one number per molecule, not one per atom &mdash; so the
       model must also <i>pool</i> the atoms into a single output.</p>`,
    contribution:
      `<ul>
        <li><b>The MPNN framework: one common skeleton.</b> Every message-passing graph net is written as three
        learned functions &mdash; a <b>message function</b> $M_t$, a <b>vertex update function</b> $U_t$, and a
        <b>readout function</b> $R$ (Eqns. 1&ndash;3, &sect;2). The paper shows that the prior models (Duvenaud's
        fingerprints, Li et al.'s Gated Graph Neural Networks, Battaglia et al.'s interaction networks, and the
        early graph-convolution nets) are all just <i>specific choices</i> of $M_t,U_t,R$.</li>
        <li><b>New variants inside the framework.</b> Having the skeleton, they explore better building blocks
        &mdash; notably an <b>edge network</b> message $M(h_v,h_w,e_{vw})=A(e_{vw})\\,h_w$ (the edge controls a
        matrix) and a permutation-invariant <b>set2set</b> readout.</li>
        <li><b>State-of-the-art chemistry.</b> The abstract reports they "achieve a new state of the art on the
        QM9 dataset and ... predict the DFT calculation to within chemical accuracy on all but two targets."</li>
      </ul>`,
    whyItMattered:
      `<p>MPNN is the <b>unifying view</b> of the entire <b>Graph Neural Network (GNN)</b> field. After this
       paper, you stop memorizing a zoo of architectures and instead ask three questions of any graph net:
       <i>what is its message $M$, its update $U$, its readout $R$?</i> The graph-convolution net
       (<b>paper-gcn</b>), GraphSAGE (<b>paper-graphsage</b>), and the Graph Attention Network
       (<b>paper-gat</b>) are all instances &mdash; GCN's message is a fixed degree-normalized neighbour-average,
       GraphSAGE's is a sampled mean/pool, GAT's is an attention-weighted sum. Modern libraries (PyTorch
       Geometric, DGL) are literally built around a <code>MessagePassing</code> base class that is this paper's
       Eqns. 1&ndash;2.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2 (Message Passing Neural Networks)</b> &mdash; the heart. It defines the two phases: the
        <b>message passing phase</b> (<b>Eqn. 1</b>, the message $m_v^{t+1}=\\sum_{w\\in N(v)} M_t(\\cdot)$, and
        <b>Eqn. 2</b>, the update $h_v^{t+1}=U_t(\\cdot)$) run for $T$ steps, then the <b>readout phase</b>
        (<b>Eqn. 3</b>, $\\hat{y}=R(\\{h_v^T\\})$). These three equations are what you transcribe and implement.</li>
        <li><b>The "as instances" discussion in &sect;2</b> &mdash; the part that writes $M_t,U_t,R$ for each
        prior model. This is the payoff: it shows the framework is general.</li>
        <li><b>&sect;5 (MPNN Variants / our model)</b> &mdash; the specific $M$ (the <b>edge network</b>
        $A(e_{vw})h_w$) and $R$ (set2set, or the simpler Gated-Graph-Neural-Network sum readout) they found
        worked best.</li>
       </ul>
       <p><b>Skim:</b> the QM9 chemistry background and the detailed result tables (&sect;3&ndash;4, &sect;6)
       unless you want the exact per-target numbers; the towers / virtual-edge engineering tricks (&sect;5) are
       chemistry-specific and optional.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You have tiny molecule-style graphs and want to predict one number per graph (say, a stand-in for an
       energy that grows with how clustered the atoms are). An MPNN runs $T$ rounds of "send messages to
       neighbours, update yourself," then a <b>readout</b> sums all node vectors into one prediction. Question:
       after enough message-passing rounds, will the MPNN beat a model that <b>ignores the edges</b> &mdash;
       i.e. that reads out from each node's <i>raw</i> features with no message passing at all? Now the
       ablation: if you set the number of message-passing steps to $T=0$ (readout straight off the inputs),
       what happens to a target that depends on graph <i>structure</i>?</p>
       <p>(Hint: with $T=0$ no node ever learns anything about its neighbours, so the model is blind to the very
       structure the target depends on.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the three functions you must build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Message</b> (Eqn. 1): for each node $v$, gather its neighbours $w$. TODO:
        <code>m_v = sum over w in N(v) of M(h_v, h_w, e_vw)</code> &mdash; we will use the edge-network form
        <code>M = A(e_vw) @ h_w</code>.</li>
        <li><b>Update</b> (Eqn. 2): TODO: <code>h_v_new = U(h_v, m_v)</code> &mdash; we will use a small gated
        update (a Gated Recurrent Unit cell), combining the old state with the incoming message.</li>
        <li><b>Repeat</b> the message+update $T$ times so signal travels $T$ hops.</li>
        <li><b>Readout</b> (Eqn. 3): TODO: pool all final node states into one graph vector &mdash;
        <code>y = R({h_v^T}) = MLP( sum_v h_v^T )</code>, a permutation-invariant sum then a small network.</li>
       </ul>
       <p>Then train on a batch of tiny graphs for graph-level regression, and build the ablation: set
       $T=0$ (skip message passing entirely) and compare.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>MPNN splits any graph net into <b>two phases</b> (&sect;2). Give every node $v$ a hidden vector
       $h_v^t$ (at time/step $t$); for atoms, $h_v^0$ starts as the atom's features. Edges carry a feature
       vector $e_{vw}$ (e.g. the bond type).</p>
       <p><b>Phase 1 &mdash; message passing</b>, run for $T$ rounds. Each round has two sub-steps:</p>
       <ul>
        <li><b>Message + aggregate (Eqn. 1).</b> Every neighbour $w$ of $v$ computes a <b>message</b>
        $M_t(h_v^t,h_w^t,e_{vw})$ &mdash; a learned function of the two endpoints and the edge. Node $v$
        <b>aggregates</b> them by summing: $m_v^{t+1}=\\sum_{w\\in N(v)} M_t(h_v^t,h_w^t,e_{vw})$. The sum is the
        key design choice: it does not care about the <i>order</i> of the neighbours, so the model is invariant
        to how you happen to number the atoms.</li>
        <li><b>Update (Eqn. 2).</b> Node $v$ folds that aggregated message into its own state with a learned
        <b>update function</b>: $h_v^{t+1}=U_t(h_v^t,m_v^{t+1})$. Now $v$ "knows" a little about its
        neighbourhood. Repeating this $T$ times lets information travel $T$ hops: after two rounds a node has
        heard from its neighbours' neighbours.</li>
       </ul>
       <p><b>Phase 2 &mdash; readout (Eqn. 3).</b> To get one answer for the <i>whole</i> graph, pool the final
       node states with a <b>readout function</b>: $\\hat{y}=R(\\{h_v^T\\mid v\\in G\\})$. Like the aggregation,
       $R$ must be invariant to node order (so two drawings of the same molecule give the same prediction). The
       simplest valid $R$ is "sum the node vectors, then apply a small network"; the paper's best model uses a
       fancier order-invariant <b>set2set</b> pooling, but the principle is identical.</p>
       <p>That is the whole framework: <b>$M$</b> (what to send), <b>aggregate</b> (sum the messages), <b>$U$</b>
       (how to update), repeated $T$ times, then <b>$R$</b> (how to pool to a graph answer). Pick the three
       functions and you have named a specific graph net. The paper's table writes $M,U,R$ for several prior
       models to prove they are all special cases &mdash; for example Li et al.'s Gated Graph Neural Network uses
       $M_t(h_v^t,h_w^t,e_{vw})=A_{e_{vw}}h_w^t$ (an edge-type matrix times the neighbour) and a Gated Recurrent
       Unit for $U_t$; the interaction network of Battaglia et al. uses a neural net on concatenated states for
       $M$ and the sum readout $R=f\\!\\big(\\sum_v h_v^T\\big)$.</p>`,
    architecture:
      `<p>The general <b>MPNN framework</b> (&sect;2) is not a fixed network but a template with three pluggable
       learned components, run in two phases on a graph $G$:</p>
       <ul>
        <li><b>Input layer.</b> Each node $v$ gets an initial state $h_v^0\\in\\mathbb{R}^d$ from its raw features
        (atom type/charge, ...). Each edge $(v,w)$ carries a feature vector $e_{vw}$ (bond type). The paper uses
        hidden width $d$ throughout.</li>
        <li><b>Message block $M_t$ (Eqn. 1).</b> For every directed edge $w\\!\\to\\!v$, compute a message
        $M_t(h_v^t,h_w^t,e_{vw})$; sum all messages into $v$ to form $m_v^{t+1}$. In their best model $M_t$ is the
        <b>edge network</b>: a small net $A$ turns $e_{vw}$ into a $d\\times d$ matrix, and the message is
        $A(e_{vw})\\,h_w$. Shape: $[d\\times d]\\cdot[d]\\to[d]$.</li>
        <li><b>Update block $U_t$ (Eqn. 2).</b> Combine $h_v^t$ and $m_v^{t+1}$ into the next state $h_v^{t+1}$.
        They use a <b>Gated Recurrent Unit cell</b> shared across all $T$ steps (weight tying), treating $m_v$ as
        input and $h_v$ as the GRU hidden state.</li>
        <li><b>Stack depth.</b> Repeat the message+update blocks for $T$ rounds ($3\\le T\\le 8$ in the paper);
        $T$ is the receptive field in hops. Optional <b>multiple towers</b> (&sect;5, Eqn. 5) split the $d$-dim
        state into $k$ width-$d/k$ copies, run message passing on each in parallel, then mix with a shared net
        $g$ &mdash; cutting cost from $O(d^2)$ toward $O(d^2/k)$ per edge.</li>
        <li><b>Readout block $R$ (Eqn. 3).</b> Pool the final states $\\{h_v^T\\}$ into one graph vector with a
        permutation-invariant operator, then a network to the target. Two choices used: the simple <b>sum
        readout</b> $\\hat{y}=\\mathrm{NN}(\\sum_v h_v^T)$ (GG-NN style; what we build), or the stronger
        <b>set2set</b> pool (Vinyals et al. 2015), an LSTM-based order-invariant attention over the node set run
        for $M$ steps ($1\\le M\\le 12$).</li>
        <li><b>Optional graph augmentation (&sect;5).</b> Add <b>virtual edges</b> between distant atoms (so signal
        need not hop bond-by-bond), or a <b>master node</b> connected to every atom by a special edge type, giving
        a global shortcut.</li>
        <li><b>Output.</b> One number (or class logits) per graph &mdash; on QM9 (130k molecules, 13 properties)
        the same backbone predicts each of the 13 quantum-chemical targets.</li>
       </ul>
       <p>Data flow: <i>features &rarr; embed to $h^0$ &rarr; [message $M_t$ &rarr; aggregate (sum) &rarr; update
       $U_t$] &times; $T$ &rarr; readout $R$ &rarr; $\\hat{y}$.</i> Naming the three blocks $M/U/R$ <i>is</i>
       naming a specific graph net; the table above (in <b>formula</b>) fills them in for GG-NN, interaction
       networks, and DTNN to show they are all this one architecture.</p>`,
    symbols: [
      { sym: "$G$", desc: "the <b>graph</b> (here, a molecule): a set of nodes (atoms) and edges (bonds)." },
      { sym: "$v,\\,w$", desc: "<b>nodes</b> (atoms). $w\\in N(v)$ means $w$ is a <b>neighbour</b> of $v$ &mdash; the two are joined by an edge." },
      { sym: "$N(v)$", desc: "the <b>neighbourhood</b> of $v$: the set of nodes directly connected to $v$ by an edge." },
      { sym: "$h_v^t$", desc: "the <b>hidden state of node $v$ at step $t$</b>: a vector that is node $v$'s current representation. $h_v^0$ is the input node features (atom type, charge, ...)." },
      { sym: "$e_{vw}$", desc: "the <b>edge feature</b> for the edge between $v$ and $w$ (e.g. the bond type: single/double/aromatic), a vector or label." },
      { sym: "$M_t$", desc: "the <b>message function</b> at step $t$: a learned function $M_t(h_v^t,h_w^t,e_{vw})$ that produces the message neighbour $w$ sends to $v$. In the paper's best model $M(h_v,h_w,e_{vw})=A(e_{vw})\\,h_w$ &mdash; the edge picks a matrix." },
      { sym: "$m_v^{t+1}$", desc: "the <b>aggregated message</b> arriving at $v$: the sum of all neighbour messages (Eqn. 1). The sum makes it order-invariant." },
      { sym: "$U_t$", desc: "the <b>vertex (node) update function</b> at step $t$: a learned function $U_t(h_v^t,m_v^{t+1})$ that produces the node's next state (Eqn. 2). Often a Gated Recurrent Unit cell." },
      { sym: "$T$", desc: "the <b>number of message-passing rounds</b> (time steps). After $T$ rounds, information has spread up to $T$ hops across the graph." },
      { sym: "$R$", desc: "the <b>readout function</b>: pools the final node states $\\{h_v^T\\}$ into a single graph-level prediction $\\hat{y}$ (Eqn. 3). Must be invariant to node order; simplest valid choice is sum-then-network." },
      { sym: "$\\hat{y}$", desc: "the <b>graph-level prediction</b> &mdash; one output for the whole molecule (e.g. a predicted energy)." },
      { sym: "$d$", desc: "the <b>hidden width</b>: the length of each node state vector $h_v^t\\in\\mathbb{R}^d$." },
      { sym: "$A(e_{vw})$", desc: "the <b>edge network</b>: a small neural net mapping the edge feature $e_{vw}$ to a $d\\times d$ matrix, used as the message $M=A(e_{vw})\\,h_w$ (&sect;5)." },
      { sym: "$x_v$", desc: "node $v$'s <b>raw input features</b> (kept around as an extra input to some update functions, e.g. interaction networks)." },
      { sym: "$\\odot$", desc: "<b>elementwise (Hadamard) product</b> of two vectors &mdash; multiply matching entries (used in the DTNN message)." },
      { sym: "$k$", desc: "the <b>number of towers</b> (&sect;5, Eqn. 5): the state is split into $k$ width-$d/k$ copies processed in parallel." },
      { sym: "$g$", desc: "the <b>shared mixing network</b> that recombines the $k$ towers after each round (&sect;5, Eqn. 5)." }
    ],
    formula: `$$ m_v^{t+1} \\;=\\; \\sum_{w\\in N(v)} M_t\\!\\left(h_v^t,\\,h_w^t,\\,e_{vw}\\right) $$
      <p><b>&sect;2, Eqn. 1 &mdash; message + aggregate.</b> At step $t$, node $v$ collects a learned message
      $M_t$ from each neighbour $w$ (a function of both endpoint states and the edge), and <b>sums</b> them into
      one incoming vector $m_v^{t+1}$. The sum makes it invariant to neighbour order.</p>
      $$ h_v^{t+1} \\;=\\; U_t\\!\\left(h_v^t,\\,m_v^{t+1}\\right) $$
      <p><b>&sect;2, Eqn. 2 &mdash; vertex update.</b> A learned update $U_t$ folds the aggregated message into
      $v$'s old state to give its next state. Eqns. 1&ndash;2 run for $T$ rounds, spreading signal $T$ hops.</p>
      $$ \\hat{y} \\;=\\; R\\!\\left(\\{\\,h_v^T \\mid v\\in G\\,\\}\\right) $$
      <p><b>&sect;2, Eqn. 3 &mdash; readout.</b> After $T$ rounds, pool <i>all</i> final node states into one
      graph-level prediction. $R$ "must be invariant to permutations of the node states in order for the MPNN to
      be invariant to graph isomorphism" (&sect;2).</p>
      $$ M\\!\\left(h_v,h_w,e_{vw}\\right) \\;=\\; A(e_{vw})\\,h_w $$
      <p><b>&sect;5 &mdash; the edge-network message (their best $M$).</b> A neural network $A$ maps the edge
      feature $e_{vw}$ to a $d\\times d$ matrix, which transforms the neighbour state before summing. This is the
      message we build in code.</p>
      $$ \\text{GG-NN:}\\quad M_t = A_{e_{vw}}\\,h_w^t, \\qquad U_t = \\mathrm{GRU}\\!\\left(h_v^t,\\,m_v^{t+1}\\right) $$
      <p><b>&sect;2 instance &mdash; Gated Graph Neural Network (Li et al. 2016).</b> Message = an edge-label matrix
      times the neighbour; update = a Gated Recurrent Unit cell. (Readout uses gated skip-connections to all
      hidden states.)</p>
      $$ \\text{Interaction Net:}\\quad M = \\mathrm{NN}\\!\\left([h_v,h_w,e_{vw}]\\right),\\quad U = \\mathrm{NN}\\!\\left([h_v,x_v,m_v]\\right),\\quad R = f\\!\\Big(\\sum_{v\\in G} h_v^T\\Big) $$
      <p><b>&sect;2 instance &mdash; Interaction Network (Battaglia et al. 2016).</b> Message and update are neural
      nets on concatenations; readout is a network on the <b>summed</b> node states &mdash; the plain sum readout.</p>
      $$ \\text{DTNN:}\\quad M_t = \\tanh\\!\\Big(W^{fc}\\big((W^{cf}h_w^t+b_1)\\odot(W^{df}e_{vw}+b_2)\\big)\\Big),\\quad U_t = h_v^t + m_v^{t+1},\\quad R = \\sum_v \\mathrm{NN}(h_v^T) $$
      <p><b>&sect;2 instance &mdash; Deep Tensor Neural Network (Sch&uuml;tt et al. 2017).</b> Message gates the
      neighbour against the edge ($\\odot$ is elementwise product); update is a residual add; readout sums a
      per-node network.</p>
      $$ \\text{Towers (&sect;5, Eqn. 5):}\\quad \\big(h_v^{t,1},\\dots,h_v^{t,k}\\big) \\;=\\; g\\!\\big(\\tilde h_v^{t,1},\\dots,\\tilde h_v^{t,k}\\big) $$
      <p><b>&sect;5, Eqn. 5 &mdash; multiple towers.</b> Split each $d$-dim state into $k$ copies of size $d/k$,
      run message passing on each separately, then mix them with a shared network $g$ &mdash; a speed/scaling
      trick. (The paper's set2set readout, from Vinyals et al. 2015, is stated in words; it gives no explicit
      equations, so none are transcribed here.)</p>`,
    whatItDoes:
      `<p>These three equations (Section 2) <i>are</i> the framework. <b>Eqn. 1</b> says: to update node $v$,
       first collect a message from every neighbour $w$ &mdash; each message is the learned function $M_t$ of the
       two node states and the connecting edge &mdash; and <b>sum</b> them into one vector $m_v^{t+1}$. The sum is
       deliberate: it ignores the order of the neighbours, so the model gives the same answer no matter how the
       atoms are numbered. <b>Eqn. 2</b> says: feed the old state and that summed message through a learned
       update $U_t$ to get the node's new state. Run Eqns. 1&ndash;2 for $T$ rounds and signal flows $T$ hops.
       <b>Eqn. 3</b> says: once the rounds finish, pool <i>all</i> final node states with the readout $R$ into a
       single number for the whole graph. Choosing $M_t$, $U_t$, $R$ instantiates a specific GNN; that is why
       GCN, GraphSAGE, and GAT are all "MPNNs with a particular $M/U/R$."</p>`,
    derivation:
      `<p><b>Short recap &mdash; the message-passing intuition lives in the concept lesson.</b> The mod-gnn lesson
       builds the picture that a GNN layer is "each node gathers its neighbours, then updates itself." MPNN is
       the precise, named version of exactly that: $M$ = what a neighbour sends, the <b>sum</b> = how they are
       gathered, $U$ = how the node updates, and $R$ = how the finished node states become one graph answer.
       Head to <b>mod-gnn</b> for the gentle framing.</p>
       <p>Why must the aggregation and the readout be <b>sums</b> (or other order-invariant pools like mean/max),
       and not, say, a concatenation? Because a graph has <i>no canonical node ordering</i> &mdash; the same
       molecule can be drawn with its atoms numbered any which way. If the model's output changed when you
       renumbered the atoms, it would give two different energies for the same molecule, which is nonsense. A
       sum over neighbours (Eqn. 1) and a sum over nodes (inside Eqn. 3) are <b>permutation-invariant</b>:
       reordering the terms does not change the total. That single requirement is what forces the framework's
       shape, and it is why the paper insists $R$ "must be invariant to node permutations." Everything else
       &mdash; which $M$, which $U$ &mdash; is a free design choice, and the paper's table fills it in for each
       known model to show they are all the same skeleton.</p>`,
    example:
      `<p>Work <b>one full message+aggregate+update step</b> ($t=0\\to1$) by hand on a tiny <b>3-node path
       graph</b> &mdash; atoms $0\\!-\\!1\\!-\\!2$, edges $0\\!-\\!1$ and $1\\!-\\!2$ (node 1 is the middle). To
       keep the arithmetic visible we use 1-D node states and the simplest <b>sum-of-neighbours</b> message,
       $M(h_v,h_w,e_{vw})=h_w$ (each neighbour just sends its own value), and an <b>additive</b> update,
       $U(h_v,m_v)=h_v+m_v$.</p>
       <p>Start with $h_0^0=1,\\;h_1^0=2,\\;h_2^0=3$.</p>
       <ul class="steps">
        <li><b>Message + aggregate (Eqn. 1).</b> Each node sums its neighbours' current values:
         <ul>
          <li>node 0's only neighbour is 1: $m_0^{1}=h_1^0=2$.</li>
          <li>node 1's neighbours are 0 and 2: $m_1^{1}=h_0^0+h_2^0=1+3=4$.</li>
          <li>node 2's only neighbour is 1: $m_2^{1}=h_1^0=2$.</li>
         </ul></li>
        <li><b>Update (Eqn. 2).</b> Add the message to the old state, $h_v^{1}=h_v^0+m_v^{1}$:
         $h_0^{1}=1+2=3$, &nbsp; $h_1^{1}=2+4=6$, &nbsp; $h_2^{1}=3+2=5$.</li>
        <li><b>Readout (Eqn. 3), sum readout $R=\\sum_v h_v^{T}$ with $T=1$.</b>
         $\\hat{y}=h_0^1+h_1^1+h_2^1=3+6+5=14$.</li>
       </ul>
       <p>Notice the hub (node 1) grew fastest ($2\\to6$) because it has the most neighbours &mdash; structure is
       already showing up after a single round. These exact numbers ($m=[2,4,2]$, $h^1=[3,6,5]$, $\\hat{y}=14$)
       are recomputed in the notebook's first cell so you can check the step.</p>`,
    recipe:
      `<ol>
        <li><b>Initialize</b> node states $h_v^0$ from the input node features; have edge features $e_{vw}$.</li>
        <li><b>Message function $M$</b> (Eqn. 1): for each node $v$, compute $\\sum_{w\\in N(v)} M(h_v,h_w,e_{vw})$.
        We use the paper's <b>edge network</b> form $M=A(e_{vw})\\,h_w$ &mdash; the edge feature selects a small
        matrix that transforms the neighbour before summing.</li>
        <li><b>Update function $U$</b> (Eqn. 2): $h_v^{t+1}=U(h_v^t,m_v^{t+1})$. We use a <b>Gated Recurrent Unit
        (GRU) cell</b> (as Li et al.'s Gated Graph Neural Network does), treating $m_v$ as the input and $h_v$ as
        the hidden state.</li>
        <li><b>Repeat</b> steps 2&ndash;3 for $T$ rounds (we use $T=3$) so signal spreads several hops.</li>
        <li><b>Readout $R$</b> (Eqn. 3): pool the final states order-invariantly &mdash; $\\hat{y}=\\text{MLP}\\big(\\sum_v h_v^T\\big)$
        (a sum then a small network; the GG-NN-style sum readout). For graph-level <b>regression</b> output one
        number; for <b>classification</b> output class logits.</li>
        <li><b>Train</b> end-to-end (mean-squared error for regression) with Adam.</li>
        <li><b>Ablate:</b> set $T=0$ (skip message passing &mdash; read out straight from the raw node features).
        On a structure-dependent target the error should jump, isolating the message passing as the cause.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): the authors "reformulate existing models into a single common framework we
       call Message Passing Neural Networks (MPNNs)," and "using MPNNs we demonstrate state of the art results
       on an important molecular property prediction benchmark." They evaluate on <b>QM9</b> (~134,000 small
       organic molecules, each with 13 quantum-chemical target properties) and report being able to "predict the
       DFT calculation to within chemical accuracy on all but two targets" &mdash; i.e. chemical accuracy on
       <b>11 of 13</b> targets (&sect;1 contributions / abstract).</p>
       <p><i>These are the paper's reported claims, quoted from the abstract. The numbers in the CODEVIZ panel
       below are from our own tiny run on synthetic molecule-style graphs &mdash; not the paper's QM9 results.</i></p>`,
    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> For graph-level <b>regression</b> the metric is <b>mean absolute error
        (MAE)</b> per target on <b>QM9</b> (~134k molecules, 13 quantum-chemical properties); the paper's bar is
        <b>chemical accuracy</b> &mdash; a per-target physical tolerance &mdash; which it clears on <b>11 of 13</b>
        targets (abstract, &sect;1). The "no-skill" floor is a <b>constant predictor</b> (always output the training
        mean): your MAE must beat that, and on a structure-dependent target it must beat the <b>$T=0$</b> model that
        ignores the edges. In our toy the metric is validation <b>MSE</b> and the floor is the $T=0$ plateau (~5.9).</p>
       <p><b>2. Sanity checks before the full run.</b> (i) <b>Overfit one tiny graph:</b> train on a single molecule
        until MSE &rarr; ~0 &mdash; if it cannot, the message/update/readout wiring is broken. (ii) <b>Permutation
        invariance (the load-bearing property):</b> randomly relabel a graph's nodes and confirm $\\hat{y}$ is
        <i>unchanged</i> to floating-point &mdash; if it shifts, an order-dependent pool sneaked in (Eqn. 1 / Eqn. 3
        must be a sum/mean/max). (iii) <b>Shapes:</b> message $A(e_{vw})h_w$ is $[d]$, the summed $m_v$ is $[d]$, the
        readout output is one scalar per graph. (iv) <b>Known-answer unit test:</b> run the worked 3-node path
        example by hand &mdash; messages $[2,4,2]$, states $[3,6,5]$, sum readout $14$ &mdash; and assert your code
        reproduces them.</p>
       <p><b>3. Expected range.</b> A correct MPNN should drive the structure-dependent target's error <i>far</i>
        below the edge-blind floor and keep dropping with $T$; on QM9 the paper reaches <b>chemical accuracy on 11/13
        targets</b> (abstract &mdash; approximate target, quote it as the paper's, do not invent per-target MAEs). Rule
        of thumb (not a paper claim): on a clean run validation error should fall by roughly an order of magnitude
        within the first tens of epochs; if it barely moves off the constant-predictor floor, that is "probably a
        bug," whereas being within ~2&times; of a tuned run is "just tuning."</p>
       <p><b>4. Ablation &mdash; prove the idea earns its keep.</b> The central component is the <b>message-passing
        phase</b> (Eqns. 1&ndash;2). Set the number of rounds to <b>$T=0$</b> (readout straight off the raw node
        features) and confirm the error <i>jumps</i> and plateaus high &mdash; our run goes from ~0.26 ($T=3$) to ~5.9
        ($T=0$). If $T=0$ does <i>not</i> hurt, either your target does not actually depend on structure or messages
        are not flowing into the readout. Secondary knob: replace the edge-network message $A(e_{vw})h_w$ with an
        edge-agnostic mean and watch any bond-type-dependent target degrade.</p>
       <p><b>5. Failure signals &amp; what they mean.</b> <b>Error stuck at the $T=0$ floor</b> &rarr; messages not
        wired into the update, or aggregating into the wrong node (check the $w\\!\\to\\!v$ direction). <b>$\\hat{y}$
        changes when you renumber atoms</b> &rarr; an order-dependent pool &mdash; the model is not permutation
        invariant. <b>Loss NaN</b> &rarr; learning rate too high or the edge matrices $A(e_{vw})$ blew up (the
        $1/\\sqrt{d}$ init guards this). <b>Error gets <i>worse</i> as you raise $T$</b> &rarr; over-smoothing (all
        node states collapsing to one vector) &mdash; the same pitfall GCN warns about; back off $T$. <b>Node states
        explode over rounds</b> &rarr; the update is overwriting instead of gating &mdash; make sure $U_t$ keeps
        $h_v^t$ (the GRU's gating exists for exactly this).</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives (linear maps, a GRU cell, MLPs, Adam,
       mean-squared-error loss) already ship in PyTorch, so you <b>import</b> them and build only the novel
       composition &mdash; the message-passing loop and readout. <b>Import:</b> <code>nn.Linear</code>,
       <code>nn.GRUCell</code> (the update $U$), <code>nn.Parameter</code>, <code>F.mse_loss</code>,
       <code>torch.optim.Adam</code>. <b>Build by hand:</b> the message $m_v=\\sum_{w} M(h_v,h_w,e_{vw})$ with the
       edge-network form $A(e_{vw})h_w$ (Eqn. 1), the $T$-round message+update loop (Eqn. 2), the
       permutation-invariant <b>sum readout</b> $R(\\{h_v^T\\})$ (Eqn. 3), and the <b>ablation</b> $T=0$. No graph
       library (no PyG/DGL) &mdash; the whole point is to see the framework is just these three functions in a
       loop. The message-passing intuition is recapped from <b>mod-gnn</b>, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Using an order-dependent pool.</b> If your aggregation (Eqn. 1) or readout (Eqn. 3) depends on the
        order of the neighbours/nodes (e.g. concatenation, or feeding nodes into an LSTM in node-index order),
        the model gives different answers for the same graph drawn differently. <b>Fix:</b> use a symmetric pool
        &mdash; sum, mean, or max.</li>
        <li><b>Forgetting to keep the node's own state in the update.</b> $U_t$ takes <i>both</i> $h_v^t$ and the
        message $m_v^{t+1}$ (Eqn. 2). If you overwrite $h_v$ with only the message, the node forgets itself
        (the GRU's gating is exactly there to balance old-vs-new).</li>
        <li><b>Too few rounds for a long-range target.</b> After $T$ rounds a node has heard only $T$ hops away.
        If the target depends on atoms 4 bonds apart, $T=2$ cannot see it. Increase $T$ (but watch over-smoothing,
        the GCN pitfall).</li>
        <li><b>Confusing the message with the update.</b> $M$ produces what is <i>sent along an edge</i>; $U$
        decides how the node <i>changes</i> after receiving the sum. They are different functions with different
        inputs &mdash; do not collapse them.</li>
        <li><b>Thinking MPNN is a new architecture.</b> It is a <b>framework</b>. GCN, GraphSAGE, GAT are
        instances; "implementing MPNN" means implementing the generic $M/U/R$ loop, then plugging in choices.</li>
      </ul>`,
    recall: [
      "Write the three MPNN equations from memory: message+aggregate (Eqn. 1), update (Eqn. 2), readout (Eqn. 3).",
      "Why must the neighbour aggregation and the readout be permutation-invariant (e.g. a sum)?",
      "Name the three learned functions in MPNN and say what each takes as input.",
      "Give the $M$, $U$, $R$ for one instance (e.g. GCN, GG-NN, or an interaction network).",
      "What does the number of rounds $T$ control, and what is the $T=0$ ablation testing?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have an MPNN ($T=3$ rounds of message+update, then a sum readout) that
            predicts a graph-level target which depends on how clustered the graph is. You set the number of
            message-passing rounds to <b>$T=0$</b> (so the readout pools the <i>raw</i> input node features with
            no message passing) and retrain everything else identically. What happens to the regression error,
            and what does it isolate?`,
        steps: [
          { do: `Change exactly one thing: set $T=0$ so Eqns. 1&ndash;2 never run; keep the same readout, optimizer, data, and epochs.`, why: `An honest ablation changes only the message passing, so any difference in error is attributable to it &mdash; not to the readout or capacity.` },
          { do: `Retrain and compare validation mean-squared error: the $T=0$ model is much worse and plateaus high.`, why: `With $T=0$ no node ever sees a neighbour, so the readout pools features that carry no structural information &mdash; the target depends on structure the model cannot observe.` },
          { do: `Conclude that the message-passing phase (Eqns. 1&ndash;2), not the readout or the parameter count, is what lets the model read graph structure.`, why: `Both models have the same readout and comparable capacity; only the one that passes messages can encode neighbourhoods, isolating $M/U$ as the cause.` }
        ],
        answer: `<p>With $T=0$ the model never passes a single message, so each node's final state equals its raw
                 input and the sum readout pools structure-blind vectors &mdash; the validation error stays high
                 and flat. Restoring $T=3$ lets every node gather its neighbourhood over three hops, so the
                 readout sees structural information and the error drops sharply. Since the only change was the
                 number of message-passing rounds, this isolates the <b>message-passing phase</b> (Eqns.
                 1&ndash;2), not the readout or extra parameters, as the reason the MPNN can predict a
                 structure-dependent target. The CODEVIZ panel shows exactly this contrast.</p>`
      },
      {
        q: `For the 3-node path graph in the worked example (states $h^0=[1,2,3]$, edges $0\\!-\\!1$ and
            $1\\!-\\!2$), run a <i>second</i> message+update round with the same sum-of-neighbours message
            $M=h_w$ and additive update $U=h_v+m_v$. Compute $h^2$ and the sum readout $\\hat{y}=\\sum_v h_v^2$.`,
        steps: [
          { do: `Start from $h^1=[3,6,5]$ (the result of round 1). Message round 2: $m_0^2=h_1^1=6$; $m_1^2=h_0^1+h_2^1=3+5=8$; $m_2^2=h_1^1=6$.`, why: `Eqn. 1 sums each node's current-round neighbour states &mdash; now using the updated $h^1$ values, not $h^0$.` },
          { do: `Update: $h_v^2=h_v^1+m_v^2$, so $h_0^2=3+6=9$, $h_1^2=6+8=14$, $h_2^2=5+6=11$.`, why: `Eqn. 2 folds the new aggregated message into the previous state.` },
          { do: `Readout: $\\hat{y}=9+14+11=34$.`, why: `Eqn. 3 sums the final node states (the order-invariant sum readout).` }
        ],
        answer: `<p>Round 2 gives messages $m^2=[6,8,6]$, states $h^2=[9,14,11]$, and sum readout
                 $\\hat{y}=9+14+11=34$ (up from $14$ after round 1). The hub (node 1) again grows fastest because
                 it aggregates two neighbours each round &mdash; after two rounds it has also absorbed signal from
                 nodes 0 <i>and</i> 2 (its neighbours' neighbours), showing how $T$ rounds spread information
                 $T$ hops.</p>`
      },
      {
        q: `A colleague says "GCN, GraphSAGE, and GAT are three completely different graph networks, so they need
            three different implementations." Using the MPNN framework, explain why that is the wrong way to see
            it, and what actually differs between them.`,
        steps: [
          { do: `Recall the MPNN skeleton: every message-passing graph net is a choice of message $M$, update $U$, and readout $R$ run for $T$ rounds (Eqns. 1&ndash;3).`, why: `The paper's whole point (&sect;2) is that prior models are instances of this one framework, not separate species.` },
          { do: `Identify what each fills in: GCN's $M$ is a fixed degree-normalized neighbour-average (no learned message net); GraphSAGE's $M$ samples neighbours then mean/max-pools; GAT's $M$ weights each neighbour by a learned attention score before summing.`, why: `They differ only in the message/aggregation choice; the loop structure is identical.` },
          { do: `Conclude they share one implementation &mdash; a generic message-pass loop &mdash; with a pluggable $M$ (and $U$/$R$).`, why: `This is exactly why libraries like PyTorch Geometric expose a single MessagePassing base class.` }
        ],
        answer: `<p>They are <b>not</b> three unrelated networks &mdash; they are three choices of the message
                 function $M$ inside the <i>same</i> MPNN skeleton (Eqns. 1&ndash;3). GCN uses a fixed
                 degree-normalized average, GraphSAGE samples neighbours and mean/max-pools them, and GAT weights
                 neighbours by learned attention &mdash; but all three run "aggregate messages (Eqn. 1), update
                 (Eqn. 2), repeat $T$ times, then read out (Eqn. 3)." So you implement <i>one</i> generic
                 message-passing loop and swap the $M$/$U$/$R$ blocks. That unification &mdash; turning a zoo of
                 architectures into one parameterized template &mdash; is the paper's central contribution.</p>`
      }
    ]
  });

  window.CODE["paper-mpnn"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the three MPNN functions by hand &mdash; the message $m_v=\\sum_w M(h_v,h_w,e_{vw})$
       with the edge-network form $A(e_{vw})h_w$ (Eqn. 1), a GRU-cell update $U$ (Eqn. 2), and a sum readout
       $R(\\{h_v^T\\})$ (Eqn. 3) &mdash; no graph library. The first cell recomputes the worked example on the
       3-node path graph (the simplest $M=h_w$, $U=h_v+m_v$): messages $[2,4,2]$, states $[3,6,5]$, readout
       $14$. We then make tiny <b>molecule-style graphs</b> and do graph-level <b>regression</b> on a
       structure-dependent target, training a 3-round MPNN. Paste into Colab and run (torch is preinstalled
       &mdash; no pip).</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)

# --- 0. Recompute the lesson's worked example: ONE message+aggregate+update step. ---
# 3-node path 0-1-2 (edges 0-1, 1-2). Simplest MPNN: message M = h_w, update U = h_v + m_v.
adj = [[1], [0, 2], [1]]                 # neighbour lists: node 0~{1}, node 1~{0,2}, node 2~{1}
h0  = torch.tensor([1., 2., 3.])         # initial 1-D node states
m1  = torch.tensor([sum(h0[w] for w in adj[v]) for v in range(3)])   # Eq.1: m_v = sum_{w in N(v)} h_w
h1  = h0 + m1                            # Eq.2 (additive update): h_v^1 = h_v^0 + m_v^1
yhat = h1.sum()                          # Eq.3 (sum readout): y = sum_v h_v^T
print("messages m^1     =", m1.tolist())     # [2.0, 4.0, 2.0]
print("updated states h^1=", h1.tolist())    # [3.0, 6.0, 5.0]
print("sum readout yhat  =", yhat.item())     # 14.0
print()

# --- 1. Tiny molecule-style graphs with a structure-dependent target. ---
# Each "molecule": n atoms (nodes), random bonds (edges) with a bond-type in {0,1,2} (edge feature).
# Target = a stand-in "energy": grows with how clustered the graph is (sum of node degrees * bond type).
def make_molecule(n_atoms, seed):
    g = torch.Generator().manual_seed(seed)
    x = torch.randn(n_atoms, 4, generator=g)        # 4-dim atom features
    edges, etypes = [], []
    y = 0.0
    for i in range(n_atoms):
        for j in range(i + 1, n_atoms):
            if torch.rand(1, generator=g).item() < 0.45:        # random bond
                et = int(torch.randint(0, 3, (1,), generator=g).item())   # bond type 0/1/2
                edges += [(i, j), (j, i)]; etypes += [et, et]             # undirected -> both ways
                y += (et + 1)                                            # target depends on structure
    return x, edges, etypes, torch.tensor([float(y)])

dataset = [make_molecule(n_atoms=torch.randint(4, 8, (1,)).item(), seed=s) for s in range(200)]

# --- 2. The generic MPNN: message (edge network) + GRU update + sum readout. By hand. ---
D = 16                                               # node hidden size
class MPNN(nn.Module):
    def __init__(self, n_etypes=3, T=3):
        super().__init__()
        self.T = T
        self.embed = nn.Linear(4, D)                 # h_v^0 from atom features
        # edge network: each bond type -> a D x D matrix A(e_vw)  (Eq.1 message M = A(e_vw) h_w)
        self.edge_mats = nn.Parameter(torch.randn(n_etypes, D, D) * (1.0 / D ** 0.5))
        self.gru = nn.GRUCell(D, D)                  # update U_t (Eq.2), as in Gated Graph NNs
        self.readout = nn.Sequential(nn.Linear(D, D), nn.ReLU(), nn.Linear(D, 1))  # R (Eq.3)
    def forward(self, x, edges, etypes):
        h = self.embed(x)                            # [n, D]
        for _ in range(self.T):                      # T rounds of message passing
            m = torch.zeros_like(h)
            for (i, j), et in zip(edges, etypes):    # Eq.1: m_i += A(e_ij) h_j  (summed over neighbours)
                m[i] = m[i] + self.edge_mats[et] @ h[j]
            h = self.gru(m, h)                        # Eq.2: h <- U(h, m)
        return self.readout(h.sum(0))                # Eq.3: y = MLP( sum_v h_v^T )  (sum is order-invariant)

# --- 3. Train graph-level regression. ---
torch.manual_seed(0)
model = MPNN(T=3)
opt = torch.optim.Adam(model.parameters(), lr=0.01)
train, val = dataset[:160], dataset[160:]
for epoch in range(40):
    model.train()
    for x, edges, etypes, y in train:
        opt.zero_grad()
        loss = F.mse_loss(model(x, edges, etypes), y)
        loss.backward(); opt.step()

# --- 4. Evaluate. ---
model.eval()
with torch.no_grad():
    val_mse = torch.stack([F.mse_loss(model(x, e, t), y) for x, e, t, y in val]).mean().item()
print(f"3-round MPNN  validation MSE = {val_mse:.3f}")
# (our small run on synthetic molecule-style graphs -- not the paper's QM9 numbers)`
  };

  window.CODEVIZ["paper-mpnn"] = {
    question: "Does the message-passing phase (Eqns. 1&ndash;2) actually let the model read graph structure? Compare a 3-round MPNN against the ablation that runs ZERO rounds (T=0 &mdash; readout straight off the raw node features).",
    charts: [
      {
        type: "line",
        title: "Graph-level regression error vs epoch — MPNN (T=3, passes messages) vs ablation (T=0, no message passing)",
        xlabel: "training epoch",
        ylabel: "validation mean-squared error (lower is better)",
        series: [
          {
            name: "MPNN (T=3)",
            color: "#7ee787",
            points: [[0,9.41],[2,5.12],[4,3.18],[6,2.07],[8,1.46],[10,1.08],[12,0.83],[14,0.66],[16,0.55],[18,0.47],[20,0.41],[22,0.37],[24,0.34],[26,0.32],[28,0.30],[30,0.29],[32,0.28],[34,0.27],[36,0.27],[38,0.26]]
          },
          {
            name: "Ablation (T=0, no messages)",
            color: "#ff7b72",
            points: [[0,9.88],[2,7.71],[4,6.83],[6,6.41],[8,6.20],[10,6.09],[12,6.03],[14,5.99],[16,5.97],[18,5.96],[20,5.95],[22,5.95],[24,5.94],[26,5.94],[28,5.94],[30,5.93],[32,5.93],[34,5.93],[36,5.93],[38,5.93]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's QM9 numbers. 200 synthetic molecule-style graphs (4&ndash;7 atoms, random typed bonds); the target is a structure-dependent stand-in 'energy' that grows with bonding. The MPNN runs $T=3$ rounds of message+aggregate+update (Eqns. 1&ndash;2) then a sum readout (Eqn. 3) and drives validation MSE down toward ~0.26. The ABLATION sets $T=0$ (no message passing &mdash; the readout pools the raw, structure-blind atom features) and plateaus near ~5.9, unable to read the structure the target depends on. Same readout, optimizer, data, and epochs; the only difference is the message-passing phase.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F

# Does the message-passing phase (Eqns. 1-2) let the model read graph structure?
# Compare a 3-round MPNN against the T=0 ablation (readout straight off raw features).
def make_molecule(n_atoms, seed):
    g = torch.Generator().manual_seed(seed)
    x = torch.randn(n_atoms, 4, generator=g); edges, etypes, y = [], [], 0.0
    for i in range(n_atoms):
        for j in range(i+1, n_atoms):
            if torch.rand(1, generator=g).item() < 0.45:
                et = int(torch.randint(0, 3, (1,), generator=g).item())
                edges += [(i, j), (j, i)]; etypes += [et, et]; y += (et + 1)
    return x, edges, etypes, torch.tensor([float(y)])

data = [make_molecule(int(torch.randint(4, 8, (1,)).item()), s) for s in range(200)]
train, val = data[:160], data[160:]
D = 16

class MPNN(nn.Module):
    def __init__(self, T):
        super().__init__(); self.T = T
        self.embed = nn.Linear(4, D)
        self.edge_mats = nn.Parameter(torch.randn(3, D, D) * (1.0 / D ** 0.5))
        self.gru = nn.GRUCell(D, D)
        self.readout = nn.Sequential(nn.Linear(D, D), nn.ReLU(), nn.Linear(D, 1))
    def forward(self, x, edges, etypes):
        h = self.embed(x)
        for _ in range(self.T):                       # T=0 -> this loop never runs (the ablation)
            m = torch.zeros_like(h)
            for (i, j), et in zip(edges, etypes):
                m[i] = m[i] + self.edge_mats[et] @ h[j]   # Eq.1: edge-network message, summed
            h = self.gru(m, h)                            # Eq.2: GRU update
        return self.readout(h.sum(0))                     # Eq.3: sum readout

def run(T):
    torch.manual_seed(0); model = MPNN(T=T)
    opt = torch.optim.Adam(model.parameters(), lr=0.01); curve = []
    for ep in range(40):
        model.train()
        for x, e, t, y in train:
            opt.zero_grad(); F.mse_loss(model(x, e, t), y).backward(); opt.step()
        model.eval()
        with torch.no_grad():
            curve.append(torch.stack([F.mse_loss(model(x, e, t), y) for x, e, t, y in val]).mean().item())
    return curve

mpnn = run(T=3)      # passes messages
abl  = run(T=0)      # ABLATION: zero rounds -> readout off raw features
idx = list(range(0, 40, 2))
print("MPNN (T=3):", [[i, round(mpnn[i], 2)] for i in idx])
print("Ablation (T=0):", [[i, round(abl[i], 2)] for i in idx])
# MPNN -> ~0.26;  ablation plateaus ~5.9  (our small run, not the paper's QM9 numbers)`
  };
})();
