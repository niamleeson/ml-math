/* All ML — authored content for Part 12: Graph & Geometric Learning (12.1–12.15).
   Every numeric value was computed in the verified notebooks. LaTeX via String.raw;
   emphasis is bold (no prose italics). */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 12.1 Graph representation & tasks ---------------- */
window.ALLML_CONTENT["12.1"] = {
  tagline: "Representing a graph well is the first model choice in graph learning.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/12.1-graph-representation-tasks.ipynb",
  context: String.raw`
    <p>Graph learning begins where graph theory and linear algebra meet. The adjacency matrix $A\in\mathbb{R}^{n\times n}$ stores which nodes touch, the feature matrix $X\in\mathbb{R}^{n\times d}$ stores what each node knows, and labels can live on nodes, edges, or the whole graph. This notation feeds spectral graph theory (12.2), message passing (12.4), pooling (12.7), and link prediction (12.10).</p>
  `,
  intuition: String.raw`
    <p>The concrete problem is that relational data is not a bag of independent rows. If we flatten a graph too early, we erase the paths by which one object can influence another. The mental model is a map: nodes are places, edges are roads, features describe each place, and the task decides whether we predict a place, a road, or the whole map. The design decision people gloss over is how to treat a zero in $A$: it may mean a known non-edge, or it may mean an unobserved pair that must not be trained as negative evidence.</p>
  `,
  mathematics: String.raw`
    <p>Use an adjacency matrix $A$, degree vector $d=A\mathbf{1}$, node features $X$, node labels $y_v$, edge labels $y_e$, and graph label $y_G$.</p><ol class="work"><li>For the toy graph, row sums give $d=[2,3,2,1]$.</li><li>The upper triangle contains $(0,1),(0,2),(1,2),(1,3)$, so $|E|=4$.</li><li>Node learning uses $X\in\mathbb{R}^{4\times2}$ and $y_v\in\mathbb{R}^{4}$.</li><li>Common-neighbor link score is $(A^2)_{2,3}=1$.</li><li>Graph features are $[|E|,\bar d,d_{\max}]=[4,2,3]$.</li></ol><p>These numbers show why representation is already modeling: the same graph supports node, edge, and graph predictions without changing the raw relationships.</p>
  `,
  pitfalls: String.raw`
    <ul><li><b>Confusing missing with negative.</b> The zero entries of $A$ drive losses for non-edges; using unobserved pairs as negatives can teach the model false absence.</li><li><b>Dropping direction or type.</b> Symmetrizing $A$ changes which messages can flow, which changes every later matrix product.</li><li><b>Ignoring shapes.</b> A node task expects one output per row of $X$; a graph task expects pooling before prediction.</li></ul>
  `
};

/* ---------------- 12.2 Spectral graph theory ---------------- */
window.ALLML_CONTENT["12.2"] = {
  tagline: "The Laplacian turns connectivity into eigenvalues and eigenvectors.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/12.2-spectral-graph-theory.ipynb",
  context: String.raw`
    <p>This lesson uses the adjacency and degree notation from 12.1 and the eigenvector machinery of linear algebra. The Laplacian $L=D-A$ is the bridge: it turns cuts, smoothness, and diffusion into matrix questions. Spectral ideas explain why GCN normalization appears in 12.4 and why graph transformers later add structural bias in 12.9.</p>
  `,
  intuition: String.raw`
    <p>The pain in raw adjacency is that it lists edges but does not reveal global shape. The Laplacian acts like a graph second derivative: signals that change sharply across edges have high energy, while signals that vary slowly have low energy. The design decision is to study eigenvectors, not individual edges, because eigenvectors expose the graph's natural low-frequency directions.</p>
  `,
  mathematics: String.raw`
    <p>For $A\in\mathbb{R}^{n\times n}$, $D=\operatorname{diag}(A\mathbf{1})$ and $L=D-A$. A signal $x\in\mathbb{R}^n$ has energy $x^\top Lx=\sum_{(i,j)\in E}(x_i-x_j)^2$.</p><ol class="work"><li>For a 4-node path, eigenvalues of $L$ are $0,0.586,2.000,3.414$.</li><li>The Fiedler vector splits the path as two signs, $[0,0,1,1]$ up to reversal.</li><li>The normalized Laplacian has spectrum $0,0.500,1.500,2.000$.</li><li>For $x=[1,1,3,3]$, $x^\top Lx=(1-1)^2+(1-3)^2+(3-3)^2=4.000$.</li><li>Filtering coefficients by $1/(1+\lambda)$ lowers variance of $[1,-1,1,-1]$.</li></ol><p>The zero eigenvalue marks the constant signal, and the small second eigenvalue is the first useful direction for separating the graph.</p>
  `,
  pitfalls: String.raw`
    <ul><li><b>Forgetting the degree matrix.</b> $L=D-A$ is not just $-A$; degrees are what make constant signals have zero energy.</li><li><b>Using unnormalized spectra on highly uneven degrees.</b> Large hubs dominate $L$, which is why normalized variants matter.</li><li><b>Reading eigenvector signs as labels without checking degeneracy.</b> Equal or near-equal eigenvalues can rotate the eigenspace.</li></ul>
  `
};

/* ---------------- 12.3 Node embeddings (DeepWalk, node2vec) ---------------- */
window.ALLML_CONTENT["12.3"] = {
  tagline: "Random walks make graph neighborhoods look like sentences.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/12.3-node-embeddings-deepwalk-node2vec.ipynb",
  context: String.raw`
    <p>This lesson builds on graph representation (12.1) and prepares the latent-vector view used by graph autoencoders (12.8) and link prediction (12.10). The transition matrix $P=D^{-1}A$ is the key mechanism: it turns edges into walk probabilities, and walks create context windows just like words in a sentence.</p>
  `,
  intuition: String.raw`
    <p>The concrete problem is that many classical models want fixed-length vectors, while a graph gives each node a changing neighborhood. DeepWalk solves this by sampling walks and asking nodes that co-occur in windows to have similar embeddings. Node2vec adds one design knob: bias the walk toward returning, staying local, or exploring outward, because homophily and structural equivalence need different neighborhoods.</p>
  `,
  mathematics: String.raw`
    <p>With $P=D^{-1}A$, walk context is described by powers of $P$ and by co-occurrence counts $C$ from sampled windows.</p><ol class="work"><li>On a path, node 1 has transition row $[0.5,0,0.5,0]$.</li><li>Two steps from node 0 reach node 2 with probability $(P^2)_{0,2}=0.500$.</li><li>Fixed walks give co-occurrences $C_{1,0}=5$ and $C_{1,2}=2$.</li><li>A rank-2 SVD embedding places node 0 closer to node 2 than to node 3.</li><li>With node2vec $p=0.5,q=2$, probabilities from node 1 after coming from 0 are $[0.800,0.200]$ for return versus outward.</li></ol><p>The learned vector is therefore a compressed record of where random walks tend to carry local context.</p>
  `,
  pitfalls: String.raw`
    <ul><li><b>Window size changes the meaning of similarity.</b> Larger powers of $P$ mix farther neighborhoods and can blur communities.</li><li><b>Bias parameters are not decoration.</b> $p$ and $q$ alter the distribution that creates $C$, so they alter the objective itself.</li><li><b>Disconnected components cannot share walk evidence.</b> No sampled context crosses a missing path.</li></ul>
  `
};

/* ---------------- 12.4 Message passing & Graph Convolutional Networks ---------------- */
window.ALLML_CONTENT["12.4"] = {
  tagline: "A GCN layer averages neighbor information with a normalized adjacency.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/12.4-message-passing-gcn.ipynb",
  context: String.raw`
    <p>Message passing uses the representation from 12.1 and the smoothing instinct from 12.2. A GCN layer is a learned feature transform after a normalized neighborhood average. GraphSAGE (12.5), GAT (12.6), and WL expressiveness (12.13) are variations on exactly this update pattern.</p>
  `,
  intuition: String.raw`
    <p>The naive approach would train each node independently and ignore its neighbors. Message passing says that a node's representation should be partly made of nearby evidence. The design decision is normalization: raw sums make high-degree nodes numerically larger, while normalized sums make messages comparable across degrees.</p>
  `,
  mathematics: String.raw`
    <p>A GCN layer uses $\tilde A=A+I$, $\tilde D=\operatorname{diag}(\tilde A\mathbf{1})$, and $H=\sigma(\tilde D^{-1/2}\tilde A\tilde D^{-1/2}XW)$.</p><ol class="work"><li>Raw neighbor sums on the triangle give node 0 message $[1,2]$.</li><li>Dividing by degree gives node 0 mean $[0.5,1.0]$.</li><li>With self-loops on the triangle, every normalized entry is $1/3$.</li><li>Using $W=[1,-1]^\top$, the averaged activation is $0$ after ReLU for all three nodes.</li><li>On a path, two applications of $S$ spread positive mass from node 0 to nodes 1 and 2.</li></ol><p>The formula is deliberately simple: learn in $W$, share information through $S$, and let depth decide how far evidence travels.</p>
  `,
  pitfalls: String.raw`
    <ul><li><b>Raw sums confound degree with signal.</b> The term $AX$ grows with node degree even if features are identical.</li><li><b>Too many layers over-smooth.</b> Repeated multiplication by $S$ pushes node features toward low-frequency components.</li><li><b>Forgetting self-loops removes the node's own evidence.</b> Then $H_i$ can be overwritten by neighbors alone.</li></ul>
  `
};

/* ---------------- 12.5 GraphSAGE ---------------- */
window.ALLML_CONTENT["12.5"] = {
  tagline: "GraphSAGE learns sampled neighborhood aggregation for new nodes.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/12.5-graphsage.ipynb",
  context: String.raw`
    <p>GraphSAGE extends message passing (12.4) by making aggregation inductive. Instead of learning one embedding table for fixed nodes, it learns a function of a node's features and sampled neighbors. This feeds production-scale GNNs and motivates attention-based neighbor weighting in 12.6.</p>
  `,
  intuition: String.raw`
    <p>The pain is scale and novelty: real graphs add nodes faster than a transductive embedding table can be retrained. GraphSAGE treats a node embedding as a recipe. Sample neighbors, aggregate their features, concatenate the node's own features, and apply shared weights. The glossed-over decision is sampling: it introduces noise, but it makes fixed-size computation possible.</p>
  `,
  mathematics: String.raw`
    <p>For node $v$, GraphSAGE computes $h_v=\sigma(W[x_v\|\operatorname{AGG}\{x_u:u\in N(v)\}])$.</p><ol class="work"><li>The full neighbor mean for node 0 is $[1.000,0.667]$.</li><li>Sampling neighbors 1 and 3 gives $[1.000,0.500]$.</li><li>Concatenating self $[1,0]$ with the full mean gives $[1,0,1,0.667]$.</li><li>A new node with feature $[0.5,0.5]$ and neighbors 0,2 uses $[0.5,0.5,1,0.5]$.</li><li>Estimated mean variance falls as sample size increases from 1 to 3.</li></ol><p>The important shift is that the model learns an aggregation rule, not just a node identity.</p>
  `,
  pitfalls: String.raw`
    <ul><li><b>Sampling variance is real.</b> The sampled mean is an estimator of the full neighborhood term, so small fanouts can be noisy.</li><li><b>Dropping self features weakens induction.</b> New nodes need their own $x_v$ as well as neighbors.</li><li><b>Mean aggregation can hide multiplicity.</b> Different neighborhoods with the same average become indistinguishable.</li></ul>
  `
};

/* ---------------- 12.6 Graph Attention Networks ---------------- */
window.ALLML_CONTENT["12.6"] = {
  tagline: "Attention lets a node choose which neighbors matter.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/12.6-graph-attention-networks.ipynb",
  context: String.raw`
    <p>GAT starts from message passing (12.4) and fixes a limitation of uniform averaging. Instead of treating every neighbor equally, it computes a softmax weight per edge. This prepares the structural-attention logic of graph transformers (12.9).</p>
  `,
  intuition: String.raw`
    <p>The concrete problem is that not every neighbor is equally helpful. A citation, friend, or item relation may carry different evidence depending on the target node. GAT's mental model is a local committee: each neighbor votes, but the node learns how much each vote counts. The key design choice is masking attention to graph edges, so softmax competition happens only among valid neighbors.</p>
  `,
  mathematics: String.raw`
    <p>For neighbors $j\in N(i)$, attention uses logits $e_{ij}$, coefficients $\alpha_{ij}=\operatorname{softmax}_j(e_{ij})$, and message $h'_i=\sum_j\alpha_{ij}Wh_j$.</p><ol class="work"><li>Dot logits for one query are $[1,0,1]$.</li><li>Softmax gives $[0.422,0.155,0.422]$.</li><li>Weighted values produce message $[1.267,0.733]$.</li><li>Averaging with a second head $[0.8,1.2]$ gives $[1.033,0.967]$.</li><li>Masking non-neighbors sets their coefficient to $0$ and keeps neighbor weights summing to $1$.</li></ol><p>The coefficients are interpretable only as part of this local normalization, not as global importance scores.</p>
  `,
  pitfalls: String.raw`
    <ul><li><b>Forgetting the mask makes non-edges vote.</b> Softmax must run over $N(i)$, not all nodes unless the model is a graph transformer.</li><li><b>Large logits saturate the softmax.</b> Then one neighbor dominates and gradients through other edges shrink.</li><li><b>Attention is not causal explanation.</b> $\alpha_{ij}$ is a learned routing weight inside one layer.</li></ul>
  `
};

/* ---------------- 12.7 Graph pooling ---------------- */
window.ALLML_CONTENT["12.7"] = {
  tagline: "Pooling decides what survives when node features become graph features.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/12.7-graph-pooling.ipynb",
  context: String.raw`
    <p>Pooling follows message passing when the task label belongs to the whole graph. It uses the node states produced by lessons 12.4 through 12.6 and compresses them into fewer states or one readout. Graph autoencoders (12.8) and graph transformers (12.9) use related readout ideas.</p>
  `,
  intuition: String.raw`
    <p>The pain is that graphs have different numbers of nodes, but classifiers expect fixed-size inputs. Pooling is the compression decision. Sum pooling preserves counts, mean pooling normalizes graph size, and assignment pooling learns supernodes. The design decision is what invariance you want: size-sensitive evidence or size-normalized composition.</p>
  `,
  mathematics: String.raw`
    <p>Readout can be $r=\sum_i h_i$ or $r=\frac{1}{n}\sum_i h_i$. Assignment pooling uses $X'=S^\top X$ and $A'=S^\top AS$.</p><ol class="work"><li>Sum pooling gives $[4,3]$.</li><li>Mean pooling gives $[1,0.750]$.</li><li>With two clusters, $S^\top X=\begin{bmatrix}1&1\\3&2\end{bmatrix}$.</li><li>Top-k scores keep nodes 1 and 3.</li><li>Pooled adjacency is $\begin{bmatrix}2&2\\2&2\end{bmatrix}$.</li></ol><p>Pooling is not an afterthought: it defines which graph-level distinctions remain visible.</p>
  `,
  pitfalls: String.raw`
    <ul><li><b>Mean pooling can erase graph size.</b> Two graphs with identical average node features become the same readout.</li><li><b>Sum pooling can overemphasize size.</b> Larger graphs naturally produce larger $r$ even with similar composition.</li><li><b>Hard top-k can drop crucial bridge nodes.</b> The score vector controls what evidence survives.</li></ul>
  `
};

/* ---------------- 12.8 Graph autoencoders ---------------- */
window.ALLML_CONTENT["12.8"] = {
  tagline: "Graph autoencoders learn embeddings by reconstructing edges.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/12.8-graph-autoencoders.ipynb",
  context: String.raw`
    <p>Graph autoencoders combine node embeddings (12.3), message passing (12.4), and link prediction (12.10). The encoder produces latent node vectors $Z$; the decoder asks whether pairs of vectors reconstruct the observed adjacency.</p>
  `,
  intuition: String.raw`
    <p>The concrete problem is unsupervised graph representation: we may not have labels, but we do have edges. A GAE turns edges into supervision by making nearby latent vectors score high and negative pairs score low. The subtle design choice is negative sampling, because the number of absent pairs can overwhelm positives.</p>
  `,
  mathematics: String.raw`
    <p>The standard decoder is $\hat A_{ij}=\sigma(z_i^\top z_j)$ with binary cross-entropy on positive and sampled negative edges.</p><ol class="work"><li>The positive score $z_0^\top z_1=0.800$.</li><li>The probability is $\sigma(0.800)=0.690$.</li><li>For positive score $0.8$ and negative score $-1.0$, BCE is $0.342$.</li><li>Thresholding at $0.6$ reconstructs edge $(0,1)$ but not $(0,2)$.</li><li>A balanced mini-batch uses $2$ positives and $2$ sampled negatives.</li></ol><p>The decoder makes geometry meaningful: dot products become edge beliefs.</p>
  `,
  pitfalls: String.raw`
    <ul><li><b>Using every non-edge as negative can swamp the loss.</b> The BCE sum becomes dominated by absent pairs.</li><li><b>Ignoring self-loops changes reconstruction targets.</b> Diagonal entries must be defined or masked consistently.</li><li><b>High dot product is not a calibrated probability by itself.</b> Calibration depends on sampling and class balance.</li></ul>
  `
};

/* ---------------- 12.9 Graph transformers ---------------- */
window.ALLML_CONTENT["12.9"] = {
  tagline: "Graph transformers add structural bias to global node attention.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/12.9-graph-transformers.ipynb",
  context: String.raw`
    <p>Graph transformers borrow attention from sequence models but must reintroduce graph structure. GAT (12.6) attends locally; this lesson shows what changes when every node can attend globally. Structural encodings connect back to spectral and distance ideas from 12.2.</p>
  `,
  intuition: String.raw`
    <p>The naive transformer treats nodes as an unordered set and can miss the graph's roads. A graph transformer says global attention is useful, but it needs bias terms such as distance, degree, or edge type. The design decision is to let attention see far nodes while still pricing how graph-close they are.</p>
  `,
  mathematics: String.raw`
    <p>Attention uses $\operatorname{softmax}(QK^\top/\sqrt d+B)$, where $B$ stores structural bias such as shortest-path distance.</p><ol class="work"><li>Vanilla attention from node 0 puts its largest mass on itself.</li><li>Adding bias $-0.5\,\operatorname{dist}$ makes self weight larger than far-node weight.</li><li>Degree encoding changes features from $3\times2$ to $3\times3$ and gives node 1 degree $2$.</li><li>A graph token readout gives $[0.726,0.726]$.</li><li>With structural bias, the mass gap between close and far nodes increases.</li></ol><p>The model becomes both global and graph-aware: it can jump across the graph, but not blindly.</p>
  `,
  pitfalls: String.raw`
    <ul><li><b>Dropping positional or structural encodings makes many node permutations indistinguishable.</b> Attention alone does not know graph distance.</li><li><b>Dense attention costs $O(n^2)$.</b> Small graphs are easy; large graphs need sparsity or batching care.</li><li><b>Bias scale matters.</b> If $B$ is too large it overwhelms learned content scores.</li></ul>
  `
};

/* ---------------- 12.10 Link prediction ---------------- */
window.ALLML_CONTENT["12.10"] = {
  tagline: "Link prediction ranks absent edges by evidence of connection.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/12.10-link-prediction.ipynb",
  context: String.raw`
    <p>Link prediction is the edge-level task introduced in 12.1. It uses neighborhood counts, embeddings from 12.3 or 12.8, and evaluation by ranking. It is also the most direct place to see why missing versus negative edges matters.</p>
  `,
  intuition: String.raw`
    <p>The concrete problem is to decide which currently absent pair is most likely to become or truly be an edge. The naive approach scores all non-edges equally. Graph methods use evidence: shared neighbors, endpoint popularity, or latent vector compatibility. The design decision is to rank candidates, because in sparse graphs probabilities are less useful than ordering the few pairs worth inspecting.</p>
  `,
  mathematics: String.raw`
    <p>Common neighbors use $(A^2)_{ij}$, Adamic-Adar uses $\sum_{z\in N(i)\cap N(j)}1/\log d_z$, and embeddings often use $z_i^\top z_j$.</p><ol class="work"><li>Common-neighbor score for $(2,3)$ is $1$.</li><li>Adamic-Adar for that pair is $1/\log 3=0.910$.</li><li>Preferential attachment is $d_2d_3=2\cdot1=2$.</li><li>Embedding score $z_2^\top z_3=0.420$.</li><li>Two positive scores above three negatives give pairwise AUC $1.000$.</li></ol><p>Each score encodes a different belief about why links form.</p>
  `,
  pitfalls: String.raw`
    <ul><li><b>Training on future edges leaks time.</b> The candidate set must respect the timestamp of the prediction.</li><li><b>Popularity baselines can dominate.</b> Preferential attachment may rank hubs rather than meaningful compatibility.</li><li><b>Random negatives may be false negatives.</b> Unobserved pairs are not always truly absent.</li></ul>
  `
};

/* ---------------- 12.11 Community detection ---------------- */
window.ALLML_CONTENT["12.11"] = {
  tagline: "Communities have more internal connection than the graph expects by chance.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/12.11-community-detection.ipynb",
  context: String.raw`
    <p>Community detection uses adjacency and degree from 12.1 plus spectral tools from 12.2. It gives unsupervised structure that can feed node embeddings, pooling, and graph-level interpretation in later lessons.</p>
  `,
  intuition: String.raw`
    <p>The pain is that clusters in graphs are not just points near each other in Euclidean space. A community is about edge density relative to a null model. The design decision in modularity is to subtract expected edges under degree preservation, so high-degree nodes do not automatically create fake communities.</p>
  `,
  mathematics: String.raw`
    <p>Modularity is $Q=\frac{1}{2m}\sum_{ij}(A_{ij}-d_id_j/(2m))\mathbf{1}[c_i=c_j]$; conductance is cut divided by the smaller volume.</p><ol class="work"><li>Partition $\{0,1,2\}|\{3\}$ has $Q=-0.03125$.</li><li>Partition $\{0,1\}|\{2,3\}$ has a larger modularity on the toy graph.</li><li>One label-propagation step changes labels to $[0,0,0,1]$.</li><li>Spectral signs produce two nonempty groups.</li><li>For $S=\{0,1\}$, cut $=2$, volume $=4$, conductance $=0.500$.</li></ol><p>A good community is therefore not merely dense; it is denser than its degree sequence predicts.</p>
  `,
  pitfalls: String.raw`
    <ul><li><b>Modularity has a resolution limit.</b> The $2m$ denominator can merge small real communities in large graphs.</li><li><b>Label propagation can be unstable.</b> Tie-breaking changes the copied labels.</li><li><b>Conductance penalizes boundaries.</b> A dense group with many outside edges may still be a poor community.</li></ul>
  `
};

/* ---------------- 12.12 Temporal & heterogeneous graphs ---------------- */
window.ALLML_CONTENT["12.12"] = {
  tagline: "Time and type are part of the graph, not metadata to discard.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/12.12-temporal-heterogeneous-graphs.ipynb",
  context: String.raw`
    <p>This lesson generalizes 12.1 beyond one static adjacency matrix. Temporal graphs attach times to edges; heterogeneous graphs attach node and relation types. These ideas feed link prediction (12.10), graph transformers (12.9), and knowledge graphs (12.14).</p>
  `,
  intuition: String.raw`
    <p>The concrete problem is that real relations change and are typed. Flattening all edge types into one $A$ says that user-click-item and user-follows-user are the same kind of evidence. Ignoring time lets the model learn from the future. The design decision is to keep separate relation matrices and time-aware neighborhoods even though that makes batching harder.</p>
  `,
  mathematics: String.raw`
    <p>A temporal edge is $(u,v,t)$; a heterogeneous graph stores matrices such as $A^{\text{user,item}}$ and composes meta-paths by multiplication.</p><ol class="work"><li>Between snapshots, new edge $(0,2)$ makes $\Delta_{0,2}=1$ and total directed change $2$.</li><li>Decay with age $1$ gives $\exp(-0.5)=0.607$.</li><li>User-item adjacency has shape $3\times2$ while user-user adjacency has shape $3\times3$.</li><li>The U-I-U meta-path gives shared item count $M_{0,1}=1$ and $M_{0,2}=0$.</li><li>At time $2$, edge $(0,2)$ at time $3$ is a valid temporal negative.</li></ol><p>The model now learns not only who is connected, but which relation connected them and when.</p>
  `,
  pitfalls: String.raw`
    <ul><li><b>Time leakage is silent.</b> If edges after prediction time enter $A$, validation can look excellent for the wrong reason.</li><li><b>Collapsing relation types erases semantics.</b> Matrix products over typed paths mean different things.</li><li><b>Old edges may not be equally informative.</b> The decay term changes the effective neighborhood.</li></ul>
  `
};

/* ---------------- 12.13 GNN expressiveness & the Weisfeiler-Leman test ---------------- */
window.ALLML_CONTENT["12.13"] = {
  tagline: "Message-passing GNNs inherit the strengths and limits of 1-WL refinement.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/12.13-gnn-expressiveness-wl.ipynb",
  context: String.raw`
    <p>This lesson looks back at message passing (12.4), GraphSAGE (12.5), and GAT (12.6) and asks what they can distinguish in principle. The Weisfeiler-Leman test is the comparison point: it repeatedly recolors nodes from neighbor-color multisets.</p>
  `,
  intuition: String.raw`
    <p>The concrete problem is that two non-isomorphic graphs can look identical to local aggregation. WL gives a clean mental model: each node says, "my old color plus the multiset of neighbor colors." The design decision behind expressive GNNs such as GIN is to preserve multisets with injective aggregation; means can lose counts.</p>
  `,
  mathematics: String.raw`
    <p>1-WL updates $c_v^{(k+1)}=\operatorname{HASH}(c_v^{(k)},\{\!\{c_u^{(k)}:u\in N(v)\}\!\})$.</p><ol class="work"><li>In the toy graph, first signatures expose neighbor counts $[1,3,1,1]$.</li><li>A star separates into two colors: center and leaves.</li><li>Multisets $[1,1,1]$ and $[1,2]$ have equal sum $3$ but different count $3$ versus $2$.</li><li>Means of $[1,1]$ and $[1]$ both equal $1$, so multiplicity is lost.</li><li>A regular 4-cycle starts with all nodes degree $2$, so symmetry can persist.</li></ol><p>The lesson is not that GNNs are weak; it is that their aggregation choice sets the boundary of what they can prove different.</p>
  `,
  pitfalls: String.raw`
    <ul><li><b>Mean aggregation is not injective on multisets.</b> The term $\operatorname{mean}$ can collapse neighborhoods with different counts.</li><li><b>Attention does not automatically beat WL.</b> If inputs and neighborhoods are symmetric, learned weights can remain symmetric too.</li><li><b>More layers do not fix indistinguishability.</b> Repeating the same non-injective update preserves the blind spot.</li></ul>
  `
};

/* ---------------- 12.14 Knowledge graphs & embeddings (TransE) ---------------- */
window.ALLML_CONTENT["12.14"] = {
  tagline: "TransE models a fact as head plus relation near tail.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/12.14-knowledge-graphs-transe.ipynb",
  context: String.raw`
    <p>Knowledge graphs are heterogeneous graphs whose edges are typed facts. This lesson connects the typed-relation view of 12.12 with embedding and link prediction ideas from 12.3 and 12.10.</p>
  `,
  intuition: String.raw`
    <p>The concrete problem is to score triples such as (person, works_at, company). A plain node embedding misses that the same two entities can have different relations. TransE's mental model is translation: the relation vector should move the head embedding toward the tail. The design decision is margin ranking, which trains positives to be closer than corrupted negatives rather than requiring calibrated probabilities.</p>
  `,
  mathematics: String.raw`
    <p>TransE scores a triple by $f(h,r,t)=\lVert e_h+e_r-e_t
Vert_2$ and uses loss $\max(0,\gamma+f(h,r,t)-f(h',r,t'))$.</p><ol class="work"><li>For $h=[1,1]$, $r=[2,0]$, $t=[3,1]$, distance is $0.000$.</li><li>Corrupting the tail to $[2,2]$ gives distance $\sqrt2=1.414$.</li><li>With margin $\gamma=1$, loss $\max(0,1+0-1.414)=0.000$.</li><li>The inverse relation vector is $[-2,0]$.</li><li>Candidate distances rank the true tail first.</li></ol><p>The geometry is intentionally simple, which makes it scalable and easy to inspect.</p>
  `,
  pitfalls: String.raw`
    <ul><li><b>One-to-many relations strain pure translation.</b> The same $h+r$ cannot land near many distant tails.</li><li><b>Negative sampling defines the task difficulty.</b> Easy corruptions can drive the margin loss to zero without teaching fine distinctions.</li><li><b>Relation direction matters.</b> Reversing a triple should use an inverse relation, not the same vector.</li></ul>
  `
};

/* ---------------- 12.15 Geometric deep learning & equivariance ---------------- */
window.ALLML_CONTENT["12.15"] = {
  tagline: "Equivariant models respect the symmetries of geometric data.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/12.15-geometric-deep-learning-equivariance.ipynb",
  context: String.raw`
    <p>This final lesson links graph learning to geometry. Graph representation gave permutation symmetry; coordinates add rotations and translations. Equivariance explains why specialized models for molecules, meshes, and physical systems can generalize from far less data.</p>
  `,
  intuition: String.raw`
    <p>The concrete problem is that rotating a molecule or permuting node order should not change its physical meaning. A generic network can learn this only by seeing many transformed copies. A geometric model builds the symmetry into the computation. The design decision is whether the output should be invariant, like an energy, or equivariant, like a force vector that rotates with the input.</p>
  `,
  mathematics: String.raw`
    <p>A map $f$ is invariant if $f(gx)=f(x)$ and equivariant if $f(gx)=g f(x)$ for transformation $g$.</p><ol class="work"><li>Rotating points $[1,0]$ and $[0,1]$ preserves their distance $1.414$.</li><li>Scalar multiplication commutes with rotation: $R(3x)-3R(x)=[0,0]$.</li><li>Edge vector $p_1-p_0=[2,1]$ is unchanged by translating both endpoints.</li><li>Permutation message passing satisfies $(PAP^\top)(PX)=P(AX)$.</li><li>A radial message based on relative vectors rotates exactly with the coordinates.</li></ol><p>Symmetry is a promise the architecture keeps for every input, not a pattern it hopes to memorize.</p>
  `,
  pitfalls: String.raw`
    <ul><li><b>Invariant and equivariant are different contracts.</b> Energies should ignore rotation; forces should rotate with the system.</li><li><b>Absolute coordinates can break translation symmetry.</b> Relative edge vectors avoid this failure.</li><li><b>Permutation order is not node identity.</b> Graph layers must commute with reindexing.</li></ul>
  `
};
