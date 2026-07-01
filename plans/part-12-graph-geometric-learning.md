# Part 12 — Graph & Geometric Learning

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant family: F11 (Graph/GNN).

### 12.1 — Graph representation & tasks   [notebook: 12.1-graph-representation-tasks.ipynb]   (family: F11)

**Lesson — Real World Applications (5):**
1. Social-network member modeling — node table plus edge table; on the lesson toy graph $X\in\mathbb{R}^{4\times2}$ and $|E|=4$ show 4 members with 2 features.
2. Fraud-ring detection — edge prediction starts from candidate non-edges; lesson common-neighbor score $(A^2)_{2,3}=1$ is a re-derivable suspicious-pair score.
3. Molecule property prediction — graph-level features summarize a compound; lesson graph features $[|E|,\bar d,d_{\max}]=[4,2,3]$ illustrate bond count, average degree, max degree.
4. Road-network routing — adjacency row sums become intersection degrees; lesson $d=[2,3,2,1]$ identifies one 3-road hub.
5. Recommender bipartite graphs — zeros can mean unknown, not dislike; lesson pitfall says zero entries of $A$ must not all become negative evidence.

**Notebook plan:**
- Family: F11 Graph/GNN
- Concept built once (D1): `build_graph_tensors()` returns $A,X,d$ and task views; verify lesson numbers $d=[2,3,2,1]$, $|E|=4$, $(A^2)_{2,3}=1$, graph features $[4,2,3]$ on a 4-node toy graph
- Datasets D1–D5: D1 4-node toy · D2 karate club · D3 synthetic SBM (communities+noise) · D4 Cora subset · D5 larger/noisier graph
- Metric: node-accuracy for node labels across all rungs
- Closing viz: (a) graph layout colored by prediction/community panels (b) metric-vs-complexity curve
- Pitfall on D5: confusing missing with negative, reproduced by treating all unobserved pairs as negatives and fixed by masked/held-out negatives
- Notes: delete dead template `conv2d/iou/edit_distance/ce/kl`; CPU-only, tiny NetworkX/NumPy, no large downloads

### 12.2 — Spectral graph theory   [notebook: 12.2-spectral-graph-theory.ipynb]   (family: F11)

**Lesson — Real World Applications (5):**
1. Web/community partitioning — Fiedler signs split a graph; lesson path split $[0,0,1,1]$ is the 2-way cut seed.
2. Sensor-network denoising — smooth graph signals reduce edge jumps; lesson energy for $x=[1,1,3,3]$ is $4.000$.
3. Power-grid islanding — zero Laplacian eigenvalue marks connected constant mode; lesson spectrum begins at $0$.
4. Recommender graph regularization — low-frequency filters damp alternating noise; lesson filter $1/(1+\lambda)$ lowers variance of $[1,-1,1,-1]$.
5. Hub-heavy social graphs — normalized spectra prevent hubs dominating; lesson normalized path spectrum is $0,0.500,1.500,2.000$.

**Notebook plan:**
- Family: F11 Graph/GNN
- Concept built once (D1): `spectral_partition()` builds $L=D-A$, eigenvectors, energy, and normalized $L$; verify lesson path eigenvalues $0,0.586,2.000,3.414$, normalized spectrum $0,0.500,1.500,2.000$, and energy $4.000$
- Datasets D1–D5: D1 4-node toy · D2 karate club · D3 synthetic SBM (communities+noise) · D4 Cora subset · D5 larger/noisier graph
- Metric: cut conductance across all rungs
- Closing viz: (a) graph layout colored by Fiedler partition/community panels (b) conductance-vs-complexity curve
- Pitfall on D5: using unnormalized spectra on highly uneven degrees, reproduced with hubs and fixed by normalized Laplacian
- Notes: delete dead template helpers; CPU-only eigensolves on small matrices/subsets only; no large downloads

### 12.3 — Node embeddings (DeepWalk, node2vec)   [notebook: 12.3-node-embeddings-deepwalk-node2vec.ipynb]   (family: F11)

**Lesson — Real World Applications (5):**
1. Friend recommendation — random-walk co-occurrence embeds nearby people; lesson has $C_{1,0}=5$ versus $C_{1,2}=2$.
2. Product graph retrieval — two-hop paths expose related items; lesson $(P^2)_{0,2}=0.500$ is a re-derivable reachability signal.
3. Fraud role discovery — node2vec outward bias changes structural-equivalence evidence; lesson $p=0.5,q=2$ gives return/outward probabilities $[0.800,0.200]$.
4. Biological protein networks — fixed-length embeddings feed classical classifiers; lesson rank-2 SVD places node 0 closer to node 2 than node 3.
5. Disconnected enterprise graphs — isolated components cannot share evidence; lesson pitfall says no sampled context crosses a missing path.

**Notebook plan:**
- Family: F11 Graph/GNN
- Concept built once (D1): `walk_embedding()` builds $P=D^{-1}A$, deterministic walks, co-occurrence matrix, and SVD embeddings; verify transition row $[0.5,0,0.5,0]$, $(P^2)_{0,2}=0.500$, $C_{1,0}=5$, $C_{1,2}=2$, and node2vec $[0.800,0.200]$
- Datasets D1–D5: D1 4-node toy · D2 karate club · D3 synthetic SBM (communities+noise) · D4 Cora subset · D5 larger/noisier graph
- Metric: node-accuracy using embeddings plus a tiny logistic/readout classifier
- Closing viz: (a) graph layout colored by embedding-based predictions/community panels (b) node-accuracy-vs-complexity curve
- Pitfall on D5: disconnected components cannot share walk evidence, reproduced by adding an isolated component and fixed by component-aware training/reporting
- Notes: delete dead template helpers; CPU-only deterministic walks/SVD; no gensim or large downloads

### 12.4 — Message passing & Graph Convolutional Networks   [notebook: 12.4-message-passing-gcn.ipynb]   (family: F11)

**Lesson — Real World Applications (5):**
1. Citation classification — papers borrow evidence from cited neighbors; lesson $H=\sigma(\tilde D^{-1/2}\tilde A\tilde D^{-1/2}XW)$ is the exact update.
2. Fraud account labeling — normalized neighbor averages avoid hub magnitude; lesson raw node-0 message $[1,2]$ becomes mean $[0.5,1.0]$.
3. Molecular atom labeling — self-loops preserve atom evidence; lesson triangle self-loop normalized entries are all $1/3$.
4. Recommender graph smoothing — two layers expand evidence radius; lesson says two applications of $S$ spread positive mass from node 0 to nodes 1 and 2.
5. Knowledge cleanup — too many layers blur labels; lesson pitfall names over-smoothing from repeated multiplication by $S$.

**Notebook plan:**
- Family: F11 Graph/GNN
- Concept built once (D1): `gcn_step()` computes $S=\tilde D^{-1/2}\tilde A\tilde D^{-1/2}$ and one/two message-passing layers; verify raw message $[1,2]$, mean $[0.5,1.0]$, self-loop weights $1/3$, ReLU output $0$ with $W=[1,-1]^\top$
- Datasets D1–D5: D1 4-node toy · D2 karate club · D3 synthetic SBM (communities+noise) · D4 Cora subset · D5 larger/noisier graph
- Metric: node-accuracy across all rungs
- Closing viz: (a) graph layout colored by GCN predictions/community panels (b) node-accuracy-vs-complexity curve
- Pitfall on D5: too many layers over-smooth, reproduced with 8–16 smoothing steps and fixed with fewer layers/residual self evidence
- Notes: delete dead template helpers; implement NumPy-only GCN-style propagation, no torch requirement, no large downloads

### 12.5 — GraphSAGE   [notebook: 12.5-graphsage.ipynb]   (family: F11)

**Lesson — Real World Applications (5):**
1. New-user recommendation — inductive embeddings handle unseen nodes; lesson new node $[0.5,0.5]$ with neighbors 0,2 uses $[0.5,0.5,1,0.5]$.
2. Large social graphs — sampled fanout bounds compute; lesson sampled neighbors 1 and 3 give mean $[1.000,0.500]$.
3. Seller-risk graphs — full-neighbor baseline is auditable; lesson full mean for node 0 is $[1.000,0.667]$.
4. Cold-start content graphs — self features must stay in the recipe; lesson concatenation gives $[1,0,1,0.667]$.
5. Noisy neighborhood sampling — variance falls with fanout; lesson states estimated mean variance falls as sample size increases 1 to 3.

**Notebook plan:**
- Family: F11 Graph/GNN
- Concept built once (D1): `sage_aggregate()` samples/fulls neighbor sets, concatenates self features, and applies a shared linear rule; verify full mean $[1.000,0.667]$, sampled mean $[1.000,0.500]$, concat $[1,0,1,0.667]$, and new-node vector $[0.5,0.5,1,0.5]$
- Datasets D1–D5: D1 4-node toy · D2 karate club · D3 synthetic SBM (communities+noise) · D4 Cora subset · D5 larger/noisier graph
- Metric: node-accuracy across all rungs
- Closing viz: (a) graph layout colored by GraphSAGE predictions/community panels (b) node-accuracy-vs-complexity curve
- Pitfall on D5: sampling variance is real, reproduced with tiny fanout and fixed by increasing fanout/averaging seeds
- Notes: delete dead template helpers; CPU-only NumPy sampling, deterministic seed, no large downloads

### 12.6 — Graph Attention Networks   [notebook: 12.6-graph-attention-networks.ipynb]   (family: F11)

**Lesson — Real World Applications (5):**
1. Citation networks — relevant citations should vote more; lesson softmax weights $[0.422,0.155,0.422]$ show unequal neighbor voting.
2. Fraud-neighbor triage — mask attention to observed edges; lesson says non-neighbor coefficients become $0$ and neighbor weights sum to $1$.
3. Marketplace graph ranking — weighted values aggregate evidence; lesson message is $[1.267,0.733]$.
4. Multi-signal social graphs — multi-head averaging stabilizes routes; lesson second head average gives $[1.033,0.967]$.
5. Explanation dashboards — attention is routing, not causality; lesson pitfall says $\alpha_{ij}$ is not a causal explanation.

**Notebook plan:**
- Family: F11 Graph/GNN
- Concept built once (D1): `gat_attention()` computes masked logits, softmax, weighted messages, and two-head averaging; verify logits $[1,0,1]$, weights $[0.422,0.155,0.422]$, message $[1.267,0.733]$, and head average $[1.033,0.967]$
- Datasets D1–D5: D1 4-node toy · D2 karate club · D3 synthetic SBM (communities+noise) · D4 Cora subset · D5 larger/noisier graph
- Metric: node-accuracy across all rungs
- Closing viz: (a) graph layout colored by GAT predictions/community panels with edge alpha overlays (b) node-accuracy-vs-complexity curve
- Pitfall on D5: forgetting the mask makes non-edges vote, reproduced with dense softmax and fixed by masking to $N(i)$
- Notes: delete dead template helpers; CPU-only NumPy attention, no large downloads; explain attention weights cautiously

### 12.7 — Graph pooling   [notebook: 12.7-graph-pooling.ipynb]   (family: F11)

**Lesson — Real World Applications (5):**
1. Molecule classification — variable atom counts need fixed graph readout; lesson sum pooling gives $[4,3]$.
2. Document citation graph labels — size-normalized composition uses mean pooling; lesson mean pooling gives $[1,0.750]$.
3. Traffic-region summarization — supernodes compress city intersections; lesson $S^\top X=\begin{bmatrix}1&1\\3&2\end{bmatrix}$.
4. Hierarchical fraud rings — top-k keeps highest-risk nodes; lesson top-k keeps nodes 1 and 3.
5. Bridge-sensitive networks — dropping bridge nodes can break evidence; lesson pitfall says hard top-k can drop crucial bridge nodes.

**Notebook plan:**
- Family: F11 Graph/GNN
- Concept built once (D1): `pool_graph()` implements sum/mean, assignment pooling, and top-k; verify sum $[4,3]$, mean $[1,0.750]$, assignment pooled features $[[1,1],[3,2]]$, top-k nodes 1 and 3, pooled adjacency $[[2,2],[2,2]]$
- Datasets D1–D5: D1 4-node toy · D2 karate club · D3 synthetic SBM (communities+noise) · D4 Cora subset · D5 larger/noisier graph
- Metric: graph/node-accuracy from pooled readout across all rungs
- Closing viz: (a) graph layout colored by retained/pooled supernodes and predictions (b) accuracy-vs-complexity curve
- Pitfall on D5: hard top-k can drop crucial bridge nodes, reproduced by scoring away a bridge and fixed with bridge-aware/soft pooling
- Notes: delete dead template helpers; CPU-only NetworkX/NumPy, tiny graphs/subsets, no large downloads

### 12.8 — Graph autoencoders   [notebook: 12.8-graph-autoencoders.ipynb]   (family: F11)

**Lesson — Real World Applications (5):**
1. Missing-edge discovery — reconstruct likely edges from embeddings; lesson positive score $z_0^\top z_1=0.800$.
2. Fraud-link anomaly scans — sigmoid edge probability makes score inspectable; lesson $\sigma(0.800)=0.690$.
3. Protein interaction completion — thresholding proposes interactions; lesson threshold $0.6$ reconstructs $(0,1)$ but not $(0,2)$.
4. Sparse recommender graphs — balanced mini-batches keep positives visible; lesson uses $2$ positives and $2$ sampled negatives.
5. Calibration-sensitive alerts — dot products are not calibrated probabilities; lesson pitfall ties calibration to sampling/class balance.

**Notebook plan:**
- Family: F11 Graph/GNN
- Concept built once (D1): `gae_reconstruct()` encodes simple node features, decodes $\hat A_{ij}=\sigma(z_i^\top z_j)$, samples negatives, and thresholds; verify score $0.800$, probability $0.690$, BCE $0.342$, threshold $0.6$, and balanced 2+2 batch
- Datasets D1–D5: D1 4-node toy · D2 karate club · D3 synthetic SBM (communities+noise) · D4 Cora subset · D5 larger/noisier graph
- Metric: pairwise edge AUC across all rungs
- Closing viz: (a) graph layout colored by reconstructed/missed edges or community predictions (b) AUC-vs-complexity curve
- Pitfall on D5: using every non-edge as negative swamps the loss, reproduced with all non-edges and fixed by balanced negative sampling
- Notes: delete dead template helpers; CPU-only NumPy logistic decoder, no large downloads

### 12.9 — Graph transformers   [notebook: 12.9-graph-transformers.ipynb]   (family: F11)

**Lesson — Real World Applications (5):**
1. Molecular graph property models — global attention sees distant atoms; lesson attention uses $\operatorname{softmax}(QK^\top/\sqrt d+B)$.
2. Citation graph reasoning — shortest-path bias prices far papers; lesson bias $-0.5\operatorname{dist}$ makes self weight larger than far-node weight.
3. Social graph moderation — degree encodings expose hubs; lesson degree encoding changes features from $3\times2$ to $3\times3$ with node-1 degree $2$.
4. Whole-graph classification — graph token readout summarizes nodes; lesson token readout gives $[0.726,0.726]$.
5. Large knowledge graphs — dense attention is costly; lesson pitfall names $O(n^2)$ cost.

**Notebook plan:**
- Family: F11 Graph/GNN
- Concept built once (D1): `graph_attention_with_bias()` computes global attention with distance/degree bias and graph-token readout; verify feature shape $3\times2\to3\times3$, node-1 degree $2$, token readout $[0.726,0.726]$, and increased close-vs-far mass gap
- Datasets D1–D5: D1 4-node toy · D2 karate club · D3 synthetic SBM (communities+noise) · D4 Cora subset · D5 larger/noisier graph
- Metric: node-accuracy across all rungs
- Closing viz: (a) graph layout colored by transformer predictions with close/far attention panels (b) node-accuracy-vs-complexity curve
- Pitfall on D5: dense attention costs $O(n^2)$, reproduced by timing/memory curve and fixed with sparse/local attention mask
- Notes: delete dead template helpers; CPU-only tiny matrices, no large downloads; structural bias scale must be visible

### 12.10 — Link prediction   [notebook: 12.10-link-prediction.ipynb]   (family: F11)

**Lesson — Real World Applications (5):**
1. Friend suggestions — common neighbors rank candidate people; lesson score for $(2,3)$ is $1$.
2. Scientific collaboration prediction — Adamic-Adar downweights popular shared neighbors; lesson $1/\log3=0.910$.
3. Marketplace cross-sell — preferential attachment surfaces hubs; lesson degree product is $d_2d_3=2\cdot1=2$.
4. Knowledge-base completion — embedding compatibility scores triples/edges; lesson embedding score is $z_2^\top z_3=0.420$.
5. Temporal recommendation — future edges must be hidden; lesson pitfall says training on future edges leaks time.

**Notebook plan:**
- Family: F11 Graph/GNN
- Concept built once (D1): `rank_links()` computes common neighbors, Adamic-Adar, preferential attachment, embedding dot scores, and pairwise AUC; verify scores $1$, $0.910$, $2$, $0.420$, and AUC $1.000$
- Datasets D1–D5: D1 4-node toy · D2 karate club · D3 synthetic SBM (communities+noise) · D4 Cora subset · D5 larger/noisier graph
- Metric: pairwise edge AUC across all rungs
- Closing viz: (a) graph layout colored by held-out/predicted links and community panels (b) AUC-vs-complexity curve
- Pitfall on D5: training on future edges leaks time, reproduced with temporal split violation and fixed by timestamp-respecting train/test split
- Notes: delete dead template helpers; CPU-only NetworkX/NumPy; random negatives may be false negatives, no large downloads

### 12.11 — Community detection   [notebook: 12.11-community-detection.ipynb]   (family: F11)

**Lesson — Real World Applications (5):**
1. Social group discovery — modularity compares inside edges to a degree-preserving null; lesson partition $\{0,1,2\}|\{3\}$ has $Q=-0.03125$.
2. Fraud-ring grouping — conductance flags boundary leakage; lesson $S=\{0,1\}$ has cut $2$, volume $4$, conductance $0.500$.
3. Citation field mapping — spectral signs seed two nonempty groups, per lesson.
4. Communication clustering — label propagation updates neighborhoods; lesson one step changes labels to $[0,0,0,1]$.
5. Large-platform communities — small groups may merge; lesson pitfall names modularity's resolution limit from the $2m$ denominator.

**Notebook plan:**
- Family: F11 Graph/GNN
- Concept built once (D1): `detect_communities()` computes modularity, conductance, spectral split, and one label-propagation step; verify $Q=-0.03125$, larger modularity for $\{0,1\}|\{2,3\}$, labels $[0,0,0,1]$, and conductance $0.500$
- Datasets D1–D5: D1 4-node toy · D2 karate club · D3 synthetic SBM (communities+noise) · D4 Cora subset · D5 larger/noisier graph
- Metric: modularity across all rungs
- Closing viz: (a) graph layout colored by detected communities (b) modularity-vs-complexity curve
- Pitfall on D5: modularity resolution limit, reproduced by embedding small communities in a large graph and fixed by resolution parameter/multiscale reporting
- Notes: delete dead template helpers; CPU-only NetworkX algorithms on tiny/subsampled graphs, no large downloads

### 12.12 — Temporal & heterogeneous graphs   [notebook: 12.12-temporal-heterogeneous-graphs.ipynb]   (family: F11)

**Lesson — Real World Applications (5):**
1. Ads click graphs — user-click-item differs from user-follows-user; lesson user-item adjacency is $3\times2$ while user-user is $3\times3$.
2. Fraud evolution monitoring — snapshot deltas flag new ties; lesson new edge $(0,2)$ gives $\Delta_{0,2}=1$ and directed change $2$.
3. Recommender freshness — old edges decay; lesson age 1 with rate 0.5 gives $\exp(-0.5)=0.607$.
4. Marketplace meta-paths — U-I-U paths count shared items; lesson $M_{0,1}=1$, $M_{0,2}=0$.
5. Temporal validation — future edges cannot train the model; lesson says at time 2, edge $(0,2)$ at time 3 is a valid temporal negative.

**Notebook plan:**
- Family: F11 Graph/GNN
- Concept built once (D1): `temporal_hetero_features()` builds per-relation matrices, snapshot deltas, decay weights, and meta-path products; verify $\Delta_{0,2}=1$, total directed change $2$, $\exp(-0.5)=0.607$, shapes $3\times2$/$3\times3$, and U-I-U counts $1/0$
- Datasets D1–D5: D1 4-node toy · D2 karate club with synthetic timestamps/types · D3 synthetic SBM (communities+noise+times/types) · D4 Cora subset with citation years/typed feature proxy · D5 larger/noisier temporal graph
- Metric: node-accuracy with time-respecting split across all rungs
- Closing viz: (a) graph layout colored by prediction/community panels with edge-age/type styling (b) node-accuracy-vs-complexity curve
- Pitfall on D5: time leakage is silent, reproduced by including post-cutoff edges and fixed by temporal neighborhood masking
- Notes: delete dead template helpers; CPU-only tiny typed matrices, no large downloads; preserve relation semantics

### 12.13 — GNN expressiveness & the Weisfeiler–Leman test   [notebook: 12.13-gnn-expressiveness-wl.ipynb]   (family: F11)

**Lesson — Real World Applications (5):**
1. Molecule isomorphism screening — WL colors distinguish many atom neighborhoods; lesson star separates into 2 colors: center and leaves.
2. Fraud motif detection — neighbor-count signatures expose degree patterns; lesson first signatures are $[1,3,1,1]$.
3. Architecture selection — mean aggregators can lose counts; lesson means of $[1,1]$ and $[1]$ both equal $1$.
4. Multiset feature design — sums can collide; lesson $[1,1,1]$ and $[1,2]$ both sum to $3$ but counts differ 3 vs 2.
5. Regular graph analysis — symmetry can persist; lesson regular 4-cycle starts with all nodes degree $2$.

**Notebook plan:**
- Family: F11 Graph/GNN
- Concept built once (D1): `wl_refine()` performs 1-WL hashing plus sum/mean aggregation comparisons; verify signatures $[1,3,1,1]$, star two colors, sum collision $3$, mean collision $1$, and 4-cycle symmetry
- Datasets D1–D5: D1 4-node toy · D2 karate club · D3 synthetic SBM (communities+noise) · D4 Cora subset · D5 larger/noisier graph
- Metric: node-accuracy from WL/aggregation features across all rungs
- Closing viz: (a) graph layout colored by WL colors/predictions/community panels (b) node-accuracy-vs-complexity curve
- Pitfall on D5: mean aggregation is not injective on multisets, reproduced with colliding neighborhoods and fixed by injective/count-aware aggregation
- Notes: delete dead template helpers; CPU-only hashing/NumPy, no large downloads; note expressiveness limits rather than model failure

### 12.14 — Knowledge graphs & embeddings (TransE)   [notebook: 12.14-knowledge-graphs-transe.ipynb]   (family: F11)

**Lesson — Real World Applications (5):**
1. Enterprise knowledge-base completion — facts score as head plus relation near tail; lesson true triple distance is $0.000$.
2. Search entity linking — corrupted candidates rank lower; lesson corrupted tail distance is $\sqrt2=1.414$.
3. Recommendation via typed facts — margin ranking trains positives over negatives; lesson margin loss with $\gamma=1$ is $0.000$.
4. Reverse-edge reasoning — inverse relations need separate vectors; lesson inverse relation is $[-2,0]$.
5. One-to-many relation modeling — pure translations strain multiple tails; lesson pitfall names one-to-many as a TransE limitation.

**Notebook plan:**
- Family: F11 Graph/GNN
- Concept built once (D1): `transe_rank()` scores triples with $\lVert e_h+e_r-e_t\rVert_2$, corrupts negatives, applies margin loss, and ranks tails; verify distance $0.000$, corrupted distance $1.414$, margin loss $0.000$, inverse $[-2,0]$, and true tail ranked first
- Datasets D1–D5: D1 4-node toy KG · D2 karate club as typed relations · D3 synthetic SBM (communities+typed noise) · D4 Cora subset as citation/type KG · D5 larger/noisier graph
- Metric: pairwise edge/triple AUC across all rungs
- Closing viz: (a) graph layout colored by predicted true/corrupt triples or communities (b) AUC-vs-complexity curve
- Pitfall on D5: one-to-many relations strain pure translation, reproduced with one head/relation and many tails and fixed by relation-specific caveat or filtered ranking
- Notes: delete dead template helpers; CPU-only tiny embeddings/gradient-free demonstration, no large downloads

### 12.15 — Geometric deep learning & equivariance   [notebook: 12.15-geometric-deep-learning-equivariance.ipynb]   (family: F11)

**Lesson — Real World Applications (5):**
1. Molecular force fields — forces should rotate with molecules; lesson distinguishes invariant energies from equivariant force vectors.
2. Robotics point clouds — distances survive rotations; lesson rotating $[1,0]$ and $[0,1]$ preserves distance $1.414$.
3. Physics simulators — scalar operations commute with rotations; lesson $R(3x)-3R(x)=[0,0]$.
4. Mesh/scene graphs — relative edges avoid translation failure; lesson edge vector $p_1-p_0=[2,1]$ is unchanged by translating both endpoints.
5. Graph node ordering — reindexing must not change meaning; lesson permutation message passing satisfies $(PAP^\top)(PX)=P(AX)$.

**Notebook plan:**
- Family: F11 Graph/GNN
- Concept built once (D1): `equivariant_message()` computes distances, relative edge vectors, permutation-equivariant $AX$, and radial messages; verify distance $1.414$, rotation commute residual $[0,0]$, translation-invariant edge $[2,1]$, permutation identity $(PAP^\top)(PX)=P(AX)$, and radial message rotation
- Datasets D1–D5: D1 4-node geometric toy · D2 karate club with 2D layout coordinates · D3 synthetic SBM (communities+coordinate noise) · D4 Cora subset with spectral/layout coordinates · D5 larger/noisier graph
- Metric: node-accuracy under transformed inputs across all rungs
- Closing viz: (a) graph layout colored by prediction/community panels before/after transformation (b) node-accuracy-vs-complexity curve
- Pitfall on D5: absolute coordinates can break translation symmetry, reproduced with shifted coordinates and fixed by relative edge vectors
- Notes: delete dead template helpers; CPU-only NumPy transforms, no large downloads; make invariant vs equivariant contract explicit
