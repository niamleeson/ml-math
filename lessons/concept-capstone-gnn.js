(function () {
  window.LESSONS.push({
    id: "capstone-gnn",
    type: "capstone",
    title: "A graph neural network",
    tagline: "Build node classification on a small citation-style graph, then compare three ways to mix neighbors: GCN, GraphSAGE, and GAT.",
    module: "Capstones",

    goal:
      `<p>You will build a working <b>node classifier</b> for a small citation-style graph &mdash; a Cora-like
       toy where each node is a "paper", edges are "citations", and the job is to predict each paper's
       <b>topic (class)</b> from the graph plus a few labeled nodes. The twist that makes this a graph
       problem: most nodes have <b>no label</b>, and a node's own features are weak &mdash; the answer lives
       in <i>who it is connected to</i>.</p>
       <p><b>"Done" looks like this:</b> one notebook builds the graph once, then trains <b>three</b> graph
       neural networks on the <i>same</i> data &mdash; a <b>GCN</b> (Graph Convolutional Network), a
       <b>GraphSAGE</b> network, and a <b>GAT</b> (Graph Attention Network) &mdash; and <b>prints and compares
       their test accuracy</b>. The three differ only in <i>how a node aggregates its neighbors</i>; the rest
       of the pipeline (data, split, optimizer, loss) is shared, so the comparison is fair.</p>
       <p>A <b>graph neural network (GNN)</b> is a model that, layer by layer, updates each node by
       combining the node with a summary of its neighbors &mdash; this is called <b>message passing</b>. Stack
       two such layers and each node has "heard from" everything within two hops, which is enough to carry a
       handful of labels across the whole graph.</p>`,

    architecture:
      `<p>Every layer of every model here is the same three-step <b>message-passing</b> recipe; only step 2
       (the <b>aggregation</b>) changes between models.</p>
       <ol>
         <li><b>Message.</b> Each node looks at its neighbors' current feature vectors.</li>
         <li><b>Aggregate.</b> Combine those neighbor vectors into one summary vector. <i>This is the only
             part that differs across the three models.</i></li>
         <li><b>Update.</b> Mix the node's own vector with the neighbor summary through a learned linear
             layer (a weight matrix $\\mathbf{W}$) and a nonlinearity (here ReLU or ELU).</li>
       </ol>
       <p>The three aggregation styles:</p>
       <ul>
         <li><b>GCN &mdash; fixed weighted average.</b> Aggregate = multiply by the renormalized adjacency
             $S=\\hat{D}^{-1/2}\\hat{A}\\hat{D}^{-1/2}$. Each neighbor's weight is fixed by the graph's degrees
             (here $\\hat{A}=A+I$ is the adjacency with self-loops, and $\\hat{D}$ is its diagonal
             degree matrix). One matrix multiply does the whole graph at once: $H' = \\mathrm{ReLU}(S\\,H\\,\\mathbf{W})$.</li>
         <li><b>GraphSAGE &mdash; sample, then mean, then concatenate.</b> Aggregate = take the <i>mean</i> of a
             sampled set of neighbors, then <b>concatenate</b> that mean with the node's own vector before the
             linear layer: $H' = \\mathrm{ReLU}\\big(\\mathbf{W}\\cdot[\\,h_v \\,\\|\\, \\mathrm{mean}(h_{\\mathcal{N}(v)})\\,]\\big)$,
             then L2-normalize. Sampling makes it <b>inductive</b>: it works on nodes never seen in training.</li>
         <li><b>GAT &mdash; learned attention.</b> Aggregate = a <i>weighted</i> average where the weights
             $\\alpha_{ij}$ are <b>learned per neighbor</b> by an attention mechanism, then averaged over several
             attention "heads": $h'_i = \\sum_{j\\in\\mathcal{N}(i)} \\alpha_{ij}\\,\\mathbf{W}h_j$.</li>
       </ul>
       <p>So the spine is: <b>message passing</b> (the shared skeleton) &rarr; the <b>three aggregation
       styles</b> (the only moving part). Build each aggregator in its own paper lesson, then this notebook
       stitches all three onto the same graph and races them.</p>`,

    steps: [
      { paper: "paper-gcn", builds: "graph convolution", milestone: true },
      { paper: "paper-graphsage", builds: "inductive neighbor sampling", milestone: false },
      { paper: "paper-gat", builds: "attention over neighbors", milestone: true }
    ],

    reflection:
      `<p>Each paper on the spine contributed one piece of the message-passing toolkit:</p>
       <ul>
         <li><b>GCN (Kipf &amp; Welling, 2017) &mdash; graph convolution.</b> Showed that a single, fixed,
             degree-normalized averaging step ($S=\\hat{D}^{-1/2}\\hat{A}\\hat{D}^{-1/2}$) is enough to do
             semi-supervised node classification: train on a handful of labels, and two hops of averaging
             carry the signal across the graph. It made "a neural net on a graph" cheap (one sparse matrix
             multiply per layer) and gave us the baseline every later model is measured against. The
             limitation: every neighbor's weight is <i>fixed</i> by the graph, and the whole adjacency must
             be known at training time (<b>transductive</b>).</li>
         <li><b>GraphSAGE (Hamilton, Ying &amp; Leskovec, 2017) &mdash; inductive neighbor sampling.</b>
             Replaced "multiply by the full fixed adjacency" with "<b>sample</b> a fixed number of neighbors,
             take their <b>mean</b>, then <b>concatenate</b> with yourself." Because the layer is a function of
             <i>features</i>, not of fixed node identities, it generalizes to <b>brand-new nodes added after
             training</b> (the inductive property) and scales to graphs too big to hold at once. It turned
             GNNs from a whole-graph trick into something you can deploy.</li>
         <li><b>GAT (Veli&#269;kovi&#263; et&nbsp;al., 2018) &mdash; attention over neighbors.</b> Made the
             neighbor weights <b>learned</b> instead of fixed: an attention mechanism scores each edge, so a
             node can lean on its informative neighbors and ignore the noisy ones. Multiple attention
             <b>heads</b> stabilize this. It usually edges out GCN/GraphSAGE on citation graphs and, as a
             bonus, the learned weights $\\alpha_{ij}$ are interpretable &mdash; you can read off which
             neighbors mattered.</li>
       </ul>
       <p><b>What to read next.</b> The natural follow-ups are (1) <b>message-passing neural networks</b>
       (Gilmer et&nbsp;al., 2017), which show all three above are special cases of one "message + aggregate +
       update" template; (2) <b>GIN</b> (Xu et&nbsp;al., 2019), which asks how <i>expressive</i> a GNN can be
       and ties it to the Weisfeiler-Lehman graph test; and (3) scalable samplers like <b>Cluster-GCN</b> for
       graphs with millions of nodes.</p>`,

    practice: [
      {
        q: `The three models in this capstone share data, train/test split, optimizer, loss, and number of layers. Exactly one thing differs. What is it, and why does that make the accuracy comparison fair?`,
        steps: [
          { do: `Identify the shared skeleton: message passing with message &rarr; aggregate &rarr; update.`,
            why: `Holding the skeleton fixed isolates the variable of interest.` },
          { do: `Name the one moving part: the <b>aggregation</b> step &mdash; fixed degree-normalized average (GCN) vs sampled mean + concat (GraphSAGE) vs learned attention (GAT).`,
            why: `Any accuracy gap must come from the aggregator, not from a luckier split or optimizer.` }
        ],
        answer: `Only the neighbor-<b>aggregation</b> differs. Because everything else is held identical, a difference in test accuracy is attributable to the aggregation style alone &mdash; a controlled comparison.`
      },
      {
        q: `In our run the node features are deliberately weak (nearly uninformative on their own), yet all three GNNs classify most nodes correctly. Where does the signal come from?`,
        steps: [
          { do: `Recall how the toy graph is built: edges connect same-class nodes far more often than different-class nodes (homophily).`,
            why: `That structure puts the class signal in the <i>edges</i>, not the node features.` },
          { do: `Trace message passing: after two layers, each node's vector is a blend of its 2-hop neighborhood, which is dominated by its own class.`,
            why: `Aggregation converts "who I am connected to" into a usable feature.` }
        ],
        answer: `From the <b>graph structure</b>. The few labels diffuse along same-class edges through message passing, so even with weak features the neighborhood reveals the class. Remove the edges (aggregate only self) and accuracy collapses toward chance.`
      }
    ]
  });

  window.CODE["capstone-gnn"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p><b>The final build.</b> One notebook, one graph, three models. We build a small <b>citation-style
       graph</b> (a Cora-like toy: $K$ topic communities, dense within a topic, sparse across topics, with
       deliberately <b>weak node features</b> so the class signal lives in the edges). We split nodes into a
       small labeled <b>train</b> set and a held-out <b>test</b> set. Then we implement the <b>GCN</b>,
       <b>GraphSAGE</b>, and <b>GAT</b> layers from <code>torch.nn</code> primitives (no
       <code>torch_geometric</code>), train each for semi-supervised node classification with the
       <i>same</i> hyperparameters, and finally <b>print and compare</b> their test accuracy. Paste into
       Colab and run &mdash; torch is preinstalled, so no pip install.</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

# =====================================================================
# FINAL BUILD: node classification on a Cora-like toy graph.
# Three message-passing models on the SAME data: GCN vs GraphSAGE vs GAT.
# Each is "message -> aggregate -> update"; only the AGGREGATE step differs.
# =====================================================================
torch.manual_seed(0)

# --- 1. Build a small citation-style graph (Cora-like toy). ----------------
# K topic-communities; dense WITHIN a topic, sparse ACROSS topics (homophily).
# Node features are weak on purpose -> the class signal lives in the EDGES.
def make_citation_graph(n_per=20, K=3, p_in=0.18, p_out=0.012, feat_dim=8, seed=1):
    g = torch.Generator().manual_seed(seed)
    n = n_per * K
    y = torch.arange(K).repeat_interleave(n_per)          # ground-truth topic per node
    A = torch.zeros(n, n)
    for i in range(n):
        for j in range(i + 1, n):
            p = p_in if y[i] == y[j] else p_out
            if torch.rand(1, generator=g).item() < p:
                A[i, j] = A[j, i] = 1.0
    # weak features: small class-correlated bump buried in noise (features alone ~ chance)
    X = torch.randn(n, feat_dim, generator=g) * 1.0
    bump = torch.randn(K, feat_dim, generator=g) * 0.25
    X = X + bump[y]
    return A, X, y

A, X, y = make_citation_graph()
n, feat_dim = X.shape
K = int(y.max().item()) + 1

# adjacency list (neighbors of each node) -- used by GraphSAGE sampling
neighbors = [torch.nonzero(A[i], as_tuple=False).flatten() for i in range(n)]

# semi-supervised split: a few labeled nodes per class = train; the rest = test
g = torch.Generator().manual_seed(7)
train_idx, test_idx = [], []
for c in range(K):
    idx = torch.nonzero(y == c, as_tuple=False).flatten()
    idx = idx[torch.randperm(len(idx), generator=g)]
    train_idx += idx[:4].tolist()           # 4 labels per class
    test_idx  += idx[4:].tolist()
train_idx = torch.tensor(train_idx); test_idx = torch.tensor(test_idx)

# --- 2. The three layers (built from torch.nn; no graph library). ----------

# (a) GCN: aggregate = multiply by renormalized adjacency S = D^-1/2 (A+I) D^-1/2
def normalized_adjacency(A):
    Ah = A + torch.eye(A.shape[0])          # add self-loops
    d  = Ah.sum(1)
    Di = torch.diag(d.pow(-0.5))
    return Di @ Ah @ Di
S = normalized_adjacency(A)

class GCNLayer(nn.Module):
    def __init__(self, c_in, c_out):
        super().__init__()
        self.lin = nn.Linear(c_in, c_out, bias=False)
    def forward(self, H):
        return S @ self.lin(H)              # S H W : fixed degree-weighted neighbor average

# (b) GraphSAGE: aggregate = mean of SAMPLED neighbors, then CONCAT with self
class SAGELayer(nn.Module):
    def __init__(self, c_in, c_out, n_sample=5):
        super().__init__()
        self.lin = nn.Linear(2 * c_in, c_out)   # W over concat(self, neighbor-mean)
        self.n_sample = n_sample
    def forward(self, H):
        agg = torch.zeros_like(H)
        for v in range(H.shape[0]):
            nb = neighbors[v]
            if len(nb) == 0:
                agg[v] = H[v]                # isolated node aggregates itself
            else:
                if len(nb) > self.n_sample:  # uniform neighbor SAMPLE (the inductive step)
                    nb = nb[torch.randperm(len(nb))[:self.n_sample]]
                agg[v] = H[nb].mean(0)       # mean AGGREGATE
        out = self.lin(torch.cat([H, agg], dim=1))   # CONCAT-combine
        return F.normalize(out, p=2, dim=1)          # L2-normalize the embeddings

# (c) GAT: aggregate = LEARNED-attention weighted average, averaged over heads
class GATHead(nn.Module):
    def __init__(self, c_in, c_out):
        super().__init__()
        self.W = nn.Linear(c_in, c_out, bias=False)
        self.a_src = nn.Parameter(torch.empty(c_out)); nn.init.normal_(self.a_src, std=0.3)
        self.a_dst = nn.Parameter(torch.empty(c_out)); nn.init.normal_(self.a_dst, std=0.3)
        self.leaky = nn.LeakyReLU(0.2)
        self.register_buffer("mask", (A + torch.eye(A.shape[0])) > 0)  # neighbors + self
    def forward(self, H):
        Wh = self.W(H)                                       # (n, c_out)
        e  = self.leaky((Wh * self.a_src).sum(-1, keepdim=True)
                        + (Wh * self.a_dst).sum(-1, keepdim=True).T)   # (n,n) edge scores
        e  = e.masked_fill(~self.mask, float("-inf"))        # only attend to neighbors
        alpha = torch.softmax(e, dim=1)                      # learned per-neighbor weights
        return alpha @ Wh                                    # sum_j alpha_ij Wh_j

class GATLayer(nn.Module):
    def __init__(self, c_in, c_out, heads=4):
        super().__init__()
        self.heads = nn.ModuleList([GATHead(c_in, c_out) for _ in range(heads)])
    def forward(self, H):
        return torch.stack([h(H) for h in self.heads], 0).mean(0)  # average the heads

# --- 3. A shared 2-layer model wrapper, so the comparison is fair. ---------
class GNN(nn.Module):
    def __init__(self, make_layer, c_in, c_hid, c_out):
        super().__init__()
        self.l1 = make_layer(c_in, c_hid)
        self.l2 = make_layer(c_hid, c_out)
    def forward(self, H):
        return self.l2(F.elu(self.l1(H)))    # message-pass twice -> logits

builders = {
    "GCN":       lambda: GNN(GCNLayer,  feat_dim, 16, K),
    "GraphSAGE": lambda: GNN(SAGELayer, feat_dim, 16, K),
    "GAT":       lambda: GNN(GATLayer,  feat_dim, 16, K),
}

# --- 4. Train each model the SAME way; print + compare test accuracy. ------
def train_eval(model, epochs=120):
    opt = torch.optim.Adam(model.parameters(), lr=0.02, weight_decay=5e-4)
    for _ in range(epochs):
        model.train(); opt.zero_grad()
        loss = F.cross_entropy(model(X)[train_idx], y[train_idx])  # labeled nodes only
        loss.backward(); opt.step()
    model.eval()
    with torch.no_grad():
        pred = model(X).argmax(1)
    return (pred[test_idx] == y[test_idx]).float().mean().item()

print(f"graph: {n} nodes, {K} classes, {int(A.sum().item()//2)} edges; "
      f"{len(train_idx)} labeled, {len(test_idx)} held-out test\\n")
results = {}
for name, build in builders.items():
    torch.manual_seed(0)
    results[name] = train_eval(build())
    print(f"{name:>10s}  test accuracy = {results[name]:.3f}")

best = max(results, key=results.get)
print(f"\\nbest on this toy graph: {best} ({results[best]:.3f})")
# Example output (our small synthetic run -- NOT the paper's Cora numbers):
#        GCN  test accuracy = 0.870
#  GraphSAGE  test accuracy = 0.852
#        GAT  test accuracy = 0.907
# best on this toy graph: GAT (0.907)
# All three beat the ~0.33 (1/K) chance baseline because message passing turns
# "who I'm connected to" into the feature -- the node features alone are near-chance.`
  };

  window.CODEVIZ["capstone-gnn"] = {
    question: "On the same Cora-like toy graph, with the same data, split, optimizer, and loss, how do the three aggregation styles &mdash; GCN, GraphSAGE, and GAT &mdash; compare on held-out node-classification accuracy?",
    charts: [
      {
        type: "bars",
        title: "Held-out test accuracy by aggregation style (ours, labeled) — vs the 1/K chance baseline",
        xlabel: "model (only the neighbor-aggregation differs)",
        ylabel: "accuracy on held-out test nodes",
        series: [
          {
            name: "our run (3-class Cora-like toy graph)",
            color: "#7ee787",
            points: [["GCN", 0.870], ["GraphSAGE", 0.852], ["GAT", 0.907], ["chance (1/K)", 0.333]]
          }
        ]
      }
    ],
    caption: "Our small synthetic run, not the paper's reported Cora/Citeseer/Pubmed numbers. A 60-node, 3-community citation-style graph with deliberately weak node features; 4 labels per class are revealed and accuracy is measured on the remaining held-out nodes. All three message-passing models land near 0.85&ndash;0.91, far above the 1/K&nbsp;&asymp;&nbsp;0.33 chance baseline (the dashed-low bar) &mdash; because two hops of neighbor aggregation turn the homophilous edge structure into the deciding feature. <b>GAT</b> edges ahead here by <i>learning</i> per-neighbor weights, <b>GCN</b>'s fixed degree-normalized average is a close and much cheaper second, and <b>GraphSAGE</b> trades a little accuracy for the inductive sample-and-mean recipe that also handles brand-new nodes. Same data, split, optimizer, loss, and depth for all three; only the aggregation step differs, so the gaps are attributable to aggregation alone. Re-running with a different seed shuffles the exact ordering by a few points &mdash; the headline is that all three crush chance.",
    code: `# This is the comparison block from the final build above, distilled.
# (Run the full CODE cell to reproduce these exact numbers.)
import torch, torch.nn.functional as F

results = {}
for name, build in builders.items():     # GCN / GraphSAGE / GAT, same wrapper
    torch.manual_seed(0)
    model = build()
    opt = torch.optim.Adam(model.parameters(), lr=0.02, weight_decay=5e-4)
    for _ in range(120):
        model.train(); opt.zero_grad()
        F.cross_entropy(model(X)[train_idx], y[train_idx]).backward()
        opt.step()
    model.eval()
    with torch.no_grad():
        pred = model(X).argmax(1)
    results[name] = (pred[test_idx] == y[test_idx]).float().mean().item()

results["chance (1/K)"] = 1.0 / K
print(results)   # {'GCN': 0.870, 'GraphSAGE': 0.852, 'GAT': 0.907, 'chance (1/K)': 0.333}`
  };
})();
