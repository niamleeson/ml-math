/* All ML — Part 12 applications (5 each). Loaded after content-part-12.js, before all-ml-register.js. */

/* ---- _apps-part12-A.js ---- */
/* All ML — Part 12A applications (12.1–12.5). Loaded after content-part-12.js. */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

window.ALLML_CONTENT["12.1"] = window.ALLML_CONTENT["12.1"] || {};
(window.ALLML_CONTENT["12.1"] = window.ALLML_CONTENT["12.1"] || {}).applications = [
  {
    title: "Social-network member modeling",
    background: "<p>Member graphs separate relationship evidence from profile evidence: edges say who connects, while node features say what each member carries into a model.</p>",
    numbers: "<p>On the lesson toy graph, $X\in\mathbb{R}^{4\times2}$ means 4 members with 2 features each, and the upper triangle has $|E|=4$ observed relationships.</p>"
  },
  {
    title: "Fraud-ring candidate scoring",
    background: "<p>Fraud graph triage often starts with candidate non-edges that share neighbors, because shared intermediaries can expose coordinated accounts.</p>",
    numbers: "<p>The lesson score $(A^2)_{2,3}=1$ is re-derivable as one two-hop path from node 2 to node 3, so that suspicious pair gets common-neighbor score 1.</p>"
  },
  {
    title: "Molecule property prediction",
    background: "<p>Molecular graph models need graph-level summaries before predicting a molecule-level property such as toxicity or solubility.</p>",
    numbers: "<p>The lesson summary $[|E|,\bar d,d_{\max}]=[4,2,3]$ reads as 4 bonds, average degree 2, and one node with maximum degree 3.</p>"
  },
  {
    title: "Road-network routing diagnostics",
    background: "<p>Road networks use adjacency row sums to identify intersections whose connectivity affects routing, congestion, or closure risk.</p>",
    numbers: "<p>For the lesson graph, $d=A\mathbf{1}=[2,3,2,1]$, so node 1 is the only 3-road hub and node 3 is a leaf-like endpoint with degree 1.</p>"
  },
  {
    title: "Recommender bipartite graphs",
    background: "<p>User-item graphs are sparse, and a missing entry usually means unobserved rather than disliked, so representation choices affect the loss.</p>",
    numbers: "<p>With 4 nodes there are $4\cdot3/2=6$ possible undirected pairs but only $|E|=4$ observed edges, so the 2 zeros should be masked or sampled carefully instead of blindly treated as negatives.</p>"
  }
];

window.ALLML_CONTENT["12.2"] = window.ALLML_CONTENT["12.2"] || {};
(window.ALLML_CONTENT["12.2"] = window.ALLML_CONTENT["12.2"] || {}).applications = [
  {
    title: "Web and community partitioning",
    background: "<p>Spectral partitioning uses the Fiedler vector as a relaxed graph cut, making it a classical seed for community splits.</p>",
    numbers: "<p>On the lesson 4-node path, the Fiedler signs split the nodes as $[0,0,1,1]$ up to reversal, a two-community seed from one eigenvector.</p>"
  },
  {
    title: "Sensor-network denoising",
    background: "<p>Graph signal denoising penalizes jumps across connected sensors, so smooth readings over edges have lower Laplacian energy.</p>",
    numbers: "<p>For $x=[1,1,3,3]$, the lesson energy is $x^\top Lx=(1-1)^2+(1-3)^2+(3-3)^2=4.000$.</p>"
  },
  {
    title: "Power-grid islanding checks",
    background: "<p>The zero Laplacian eigenvalue marks a connected component's constant mode, which is why spectra are useful in grid islanding diagnostics.</p>",
    numbers: "<p>The lesson path spectrum begins with $0$, then $0.586,2.000,3.414$; that single zero is consistent with one connected component.</p>"
  },
  {
    title: "Recommender graph regularization",
    background: "<p>Low-frequency graph filters suppress alternating high-frequency noise over a user-item or item-item graph.</p>",
    numbers: "<p>The lesson filter coefficient $1/(1+\lambda)$ is $1$ at $\lambda=0$ but only $1/(1+3.414)=0.226$ at the largest path eigenvalue, damping rough components more.</p>"
  },
  {
    title: "Hub-heavy social graphs",
    background: "<p>Normalized Laplacians reduce degree dominance when a few hubs would otherwise control the unnormalized spectrum.</p>",
    numbers: "<p>The lesson normalized path spectrum $0,0.500,1.500,2.000$ stays in the normalized range $[0,2]$, unlike unnormalized values that scale directly with degree.</p>"
  }
];

window.ALLML_CONTENT["12.3"] = window.ALLML_CONTENT["12.3"] || {};
(window.ALLML_CONTENT["12.3"] = window.ALLML_CONTENT["12.3"] || {}).applications = [
  {
    title: "Friend recommendation",
    background: "<p>DeepWalk-style systems turn nearby people in random walks into co-occurrence evidence for social recommendations.</p>",
    numbers: "<p>The lesson counts $C_{1,0}=5$ versus $C_{1,2}=2$, so node 0 appears 2.5 times as often as node 2 in node 1's sampled context.</p>"
  },
  {
    title: "Product graph retrieval",
    background: "<p>Two-hop transition probabilities expose related products or entities even when no direct edge exists.</p>",
    numbers: "<p>For the lesson path, $(P^2)_{0,2}=0.500$, so a two-step walk from node 0 reaches node 2 with probability 0.5.</p>"
  },
  {
    title: "Fraud role discovery",
    background: "<p>Node2vec changes the walk distribution to emphasize return, local breadth-first context, or outward structural roles.</p>",
    numbers: "<p>With illustrative $p=0.5,q=2$, return weight is $1/p=2$ and outward weight is $1/q=0.5$, so probabilities are $[2,0.5]/2.5=[0.800,0.200]$.</p>"
  },
  {
    title: "Biological protein networks",
    background: "<p>Protein interaction graphs can feed fixed-length node embeddings into classical classifiers for function prediction.</p>",
    numbers: "<p>The lesson's rank-2 SVD keeps two coordinates per node; on the path, it places node 0 closer to node 2 than to node 3 because two-step context gives $(P^2)_{0,2}=0.500$ while node 3 is farther away.</p>"
  },
  {
    title: "Disconnected enterprise graphs",
    background: "<p>Enterprise graphs often have isolated business units or systems; walk embeddings cannot invent context across missing paths.</p>",
    numbers: "<p>If no path connects two components, every sampled cross-component co-occurrence is 0, so the lesson pitfall is numeric: no window contributes evidence across that cut.</p>"
  }
];

window.ALLML_CONTENT["12.4"] = window.ALLML_CONTENT["12.4"] || {};
(window.ALLML_CONTENT["12.4"] = window.ALLML_CONTENT["12.4"] || {}).applications = [
  {
    title: "Citation classification",
    background: "<p>GCNs classify papers by mixing a paper's features with cited-neighbor evidence through a shared normalized propagation matrix.</p>",
    numbers: "<p>The exact lesson update is $H=\sigma(\tilde D^{-1/2}\tilde A\tilde D^{-1/2}XW)$, so every layer first smooths by $\tilde A$ and then learns through $W$.</p>"
  },
  {
    title: "Fraud account labeling",
    background: "<p>Degree-normalized messages avoid treating high-degree accounts as suspicious merely because they have more neighbors.</p>",
    numbers: "<p>The lesson raw node-0 message $[1,2]$ becomes mean $[0.5,1.0]$ after dividing by degree 2, halving both coordinates.</p>"
  },
  {
    title: "Molecular atom labeling",
    background: "<p>Self-loops keep an atom's own evidence in the update instead of replacing it entirely with neighboring atoms.</p>",
    numbers: "<p>On the lesson triangle with self-loops, each node has three equal normalized contributors, so every entry of $\tilde D^{-1}\tilde A$ is $1/3$.</p>"
  },
  {
    title: "Recommender graph smoothing",
    background: "<p>Stacked GCN layers spread positive evidence to multi-hop neighbors in sparse recommender graphs.</p>",
    numbers: "<p>The lesson path example says two applications of $S$ move mass from node 0 to nodes 1 and 2, matching the two-hop reachability intuition from $S^2$.</p>"
  },
  {
    title: "Knowledge cleanup",
    background: "<p>Repeated smoothing can blur labels, so cleanup systems need shallow depth, residuals, or other anti-over-smoothing checks.</p>",
    numbers: "<p>With $W=[1,-1]^\top$ and equal averaged features, the lesson activation is $\max(0,1-1)=0$, showing how smoothing plus weights can erase a signal.</p>"
  }
];

window.ALLML_CONTENT["12.5"] = window.ALLML_CONTENT["12.5"] || {};
(window.ALLML_CONTENT["12.5"] = window.ALLML_CONTENT["12.5"] || {}).applications = [
  {
    title: "New-user recommendation",
    background: "<p>GraphSAGE is useful for cold-start nodes because it computes an embedding from features and neighbors rather than looking up a fixed node id.</p>",
    numbers: "<p>The lesson new node with feature $[0.5,0.5]$ and neighbors 0,2 uses concatenated vector $[0.5,0.5,1,0.5]$ before the shared linear rule.</p>"
  },
  {
    title: "Large social graphs",
    background: "<p>Sampling a fixed fanout bounds compute in large graphs where full neighborhoods are too large for every batch.</p>",
    numbers: "<p>The lesson sampled neighbors 1 and 3 give mean $[1.000,0.500]$, a two-neighbor estimate rather than the full-neighborhood value.</p>"
  },
  {
    title: "Seller-risk graphs",
    background: "<p>Full-neighbor aggregation remains an auditable baseline for risk models before sampling approximations are introduced.</p>",
    numbers: "<p>For node 0, the lesson full mean is $[1.000,0.667]$; comparing it with sampled $[1.000,0.500]$ reveals the sampling error in the second coordinate.</p>"
  },
  {
    title: "Cold-start content graphs",
    background: "<p>Content items need their own features in the embedding recipe because neighbors alone may not describe a new item.</p>",
    numbers: "<p>The lesson concatenation keeps self $[1,0]$ and neighbor mean $[1,0.667]$, producing $[1,0,1,0.667]$.</p>"
  },
  {
    title: "Noisy neighborhood sampling",
    background: "<p>Sampling variance is the operational cost of bounded fanout, so production systems often raise fanout or average several samples.</p>",
    numbers: "<p>The lesson states estimated mean variance falls as sample size increases from 1 to 3; for independent samples the usual scale is proportional to $1/k$, so tripling fanout gives about one-third the variance.</p>"
  }
];

/* ---- _apps-part12-B.js ---- */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

(window.ALLML_CONTENT["12.6"] = window.ALLML_CONTENT["12.6"] || {}).applications = [
  {
    title: "Citation networks",
    background: "<p>Graph Attention Networks were designed for citation graphs where a paper should not average every cited neighbor equally.</p>",
    numbers: "<p>Using the lesson logits $[1,0,1]$, the local softmax is $[0.422,0.155,0.422]$. Thus two relevant citations can each receive about $0.422$ of the vote while the weaker route receives $0.155$.</p>"
  },
  {
    title: "Fraud-neighbor triage",
    background: "<p>Fraud graphs often contain many possible account pairs, but attention must be masked to the observed investigation graph.</p>",
    numbers: "<p>The lesson mask sets non-neighbor coefficients to $0$ and keeps observed-neighbor weights summing to $1$. For three observed neighbors, $0.422+0.155+0.422=0.999$ after rounding.</p>"
  },
  {
    title: "Marketplace graph ranking",
    background: "<p>Marketplace recommendations can weight seller, item, and member neighbors according to current evidence rather than fixed degree averages.</p>",
    numbers: "<p>The lesson weighted values produce message $[1.267,0.733]$. The first coordinate is larger by $1.267-0.733=0.534$, so the routed evidence favors the first latent signal.</p>"
  },
  {
    title: "Multi-signal social graphs",
    background: "<p>Multi-head attention gives several routing views of the same neighborhood and then averages them for stability.</p>",
    numbers: "<p>Averaging the lesson first head $[1.267,0.733]$ with an illustrative second head $[0.8,1.2]$ gives $[1.033,0.967]$, reducing the coordinate gap to $0.066$.</p>"
  },
  {
    title: "Explanation dashboards",
    background: "<p>Attention weights can be shown as routing diagnostics, but they are not causal explanations of why a prediction was correct.</p>",
    numbers: "<p>The largest lesson weights are both $0.422$. That tie says two edges routed equal mass in one layer; it does not prove that either edge causally changes the outcome by $42.2\%$.</p>"
  }
];

(window.ALLML_CONTENT["12.7"] = window.ALLML_CONTENT["12.7"] || {}).applications = [
  {
    title: "Molecule classification",
    background: "<p>Molecules have variable atom counts, so graph classifiers use pooling to make a fixed-size graph vector.</p>",
    numbers: "<p>The lesson sum pooling gives $[4,3]$. If the two coordinates count illustrative atom-state evidence, the graph contains $4+3=7$ total units before classification.</p>"
  },
  {
    title: "Document citation graph labels",
    background: "<p>Mean pooling removes graph size so citation collections with different paper counts can be compared by composition.</p>",
    numbers: "<p>The lesson mean pooling gives $[1,0.750]$. Because the sum is $[4,3]$, the implied graph has $4$ nodes and the second feature average is $3/4=0.750$.</p>"
  },
  {
    title: "Traffic-region summarization",
    background: "<p>Assignment pooling compresses intersections into supernodes for city-region summaries.</p>",
    numbers: "<p>The lesson computes $S^\top X=\begin{bmatrix}1&1\\3&2\end{bmatrix}$. The second region therefore carries $3$ units of coordinate one and $2$ units of coordinate two.</p>"
  },
  {
    title: "Hierarchical fraud rings",
    background: "<p>Top-k pooling keeps high-risk entities for a smaller follow-up graph, trading recall against inspection cost.</p>",
    numbers: "<p>The lesson top-k keeps nodes $1$ and $3$. With $4$ original nodes, this illustrative pooling ratio is $2/4=0.5$ of the graph.</p>"
  },
  {
    title: "Bridge-sensitive networks",
    background: "<p>Bridge nodes connect communities, so dropping them can break the evidence path that a graph model needs.</p>",
    numbers: "<p>The lesson pooled adjacency is $\begin{bmatrix}2&2\\2&2\end{bmatrix}$. The off-diagonal total $2+2=4$ shows cross-supernode connectivity that would disappear if a bridge were removed.</p>"
  }
];

(window.ALLML_CONTENT["12.8"] = window.ALLML_CONTENT["12.8"] || {}).applications = [
  {
    title: "Missing-edge discovery",
    background: "<p>Graph autoencoders rank likely missing links by reconstructing adjacency from node embeddings.</p>",
    numbers: "<p>The lesson positive score is $z_0^\top z_1=0.800$. Its sigmoid probability is $\sigma(0.800)=0.690$, so the model assigns about $69.0\%$ edge belief before calibration.</p>"
  },
  {
    title: "Fraud-link anomaly scans",
    background: "<p>Dot-product decoders make suspicious pair scores inspectable and easy to threshold in a review queue.</p>",
    numbers: "<p>With threshold $0.6$, the lesson probability $0.690$ reconstructs $(0,1)$. A negative score $-1.0$ gives $\sigma(-1.0)=0.269$, which stays below the same threshold.</p>"
  },
  {
    title: "Protein interaction completion",
    background: "<p>Protein graphs use learned geometry to propose interactions that are absent from the observed network.</p>",
    numbers: "<p>The lesson says threshold $0.6$ reconstructs $(0,1)$ but not $(0,2)$. Numerically, $0.690\gt0.6$ for $(0,1)$ while the negative example remains below $0.6$.</p>"
  },
  {
    title: "Sparse recommender graphs",
    background: "<p>Recommendation graphs are sparse, so training usually samples negatives instead of using every missing pair.</p>",
    numbers: "<p>The lesson balanced mini-batch uses $2$ positives and $2$ negatives. That makes the positive fraction $2/(2+2)=0.5$ instead of letting absent pairs dominate.</p>"
  },
  {
    title: "Calibration-sensitive alerts",
    background: "<p>Autoencoder scores can rank pairs well while still needing calibration before they become business probabilities.</p>",
    numbers: "<p>The lesson BCE for positive score $0.8$ and negative score $-1.0$ is $0.342$. Changing the negative sampling ratio changes this loss, so $0.690$ should not be treated as a calibrated base rate.</p>"
  }
];

(window.ALLML_CONTENT["12.9"] = window.ALLML_CONTENT["12.9"] || {}).applications = [
  {
    title: "Molecular graph property models",
    background: "<p>Graph transformers let each atom attend globally while structural bias keeps bond distance visible.</p>",
    numbers: "<p>The lesson attention uses $\operatorname{softmax}(QK^\top/\sqrt d+B)$. With distance bias $B=-0.5\operatorname{dist}$, a two-hop atom receives an illustrative penalty $-0.5\cdot2=-1.0$.</p>"
  },
  {
    title: "Citation graph reasoning",
    background: "<p>Global attention can connect distant papers, but shortest-path bias prices far evidence lower than close evidence.</p>",
    numbers: "<p>For distances $0$ and $2$, the lesson bias gives penalties $0$ and $-1.0$. Before content scores, the far node has $e^{-1.0}=0.368$ times the unnormalized self mass.</p>"
  },
  {
    title: "Social graph moderation",
    background: "<p>Degree encodings tell the model which accounts are hubs, a signal that plain content features may omit.</p>",
    numbers: "<p>The lesson changes features from $3\times2$ to $3\times3$. Node 1 has degree $2$, so the added third coordinate explicitly records its two observed neighbors.</p>"
  },
  {
    title: "Whole-graph classification",
    background: "<p>A graph token works like a learned readout that gathers node information for graph-level prediction.</p>",
    numbers: "<p>The lesson graph token readout is $[0.726,0.726]$. Its two coordinates are equal, so a downstream linear head would need other terms to prefer one coordinate over the other.</p>"
  },
  {
    title: "Large knowledge graphs",
    background: "<p>Dense graph attention is powerful on small graphs but expensive for large knowledge graphs.</p>",
    numbers: "<p>The lesson pitfall is $O(n^2)$ cost. Increasing from $100$ to $1{,}000$ nodes changes the score matrix from $10{,}000$ to $1{,}000{,}000$ entries, a $100\times$ increase.</p>"
  }
];

(window.ALLML_CONTENT["12.10"] = window.ALLML_CONTENT["12.10"] || {}).applications = [
  {
    title: "Friend suggestions",
    background: "<p>Common-neighbor scoring recommends people who share contacts with the user.</p>",
    numbers: "<p>The lesson common-neighbor score for $(2,3)$ is $1$. That is exactly $(A^2)_{2,3}=1$, one two-hop path through a shared neighbor.</p>"
  },
  {
    title: "Scientific collaboration prediction",
    background: "<p>Adamic-Adar discounts popular shared collaborators so rare shared contacts count more.</p>",
    numbers: "<p>The lesson shared neighbor has degree $3$, giving $1/\log 3=0.910$. A higher-degree shared neighbor would contribute less because $\log d$ is larger.</p>"
  },
  {
    title: "Marketplace cross-sell",
    background: "<p>Preferential attachment is a hub baseline: popular items or sellers are more likely to receive new links.</p>",
    numbers: "<p>The lesson degree product is $d_2d_3=2\cdot1=2$. If node 3 had degree $4$ instead, the same baseline would rise to $2\cdot4=8$.</p>"
  },
  {
    title: "Knowledge-base completion",
    background: "<p>Embedding scores capture compatibility that neighborhood counts can miss, especially in sparse graphs.</p>",
    numbers: "<p>The lesson embedding score is $z_2^\top z_3=0.420$. If three negative candidate scores are $0.4$, $0.3$, and $0.2$, this positive would outrank all three.</p>"
  },
  {
    title: "Temporal recommendation",
    background: "<p>Production link prediction must hide future edges at training time or evaluation leaks the answer.</p>",
    numbers: "<p>The lesson AUC example has two positive scores above three negatives, so all $2\cdot3=6$ positive-negative comparisons are wins and AUC is $6/6=1.000$.</p>"
  }
];

/* ---- _apps-part12-C.js ---- */
/* All ML — Part 12C applications (12.11–12.15). Loaded after content-part-12.js. */

(window.ALLML_CONTENT["12.11"] = window.ALLML_CONTENT["12.11"] || {}).applications = [
  { title: "Social group discovery", background: "<p>Social platforms use community detection to summarize friendship, follow, or messaging graphs without labels.</p>", numbers: "<p>Modularity asks whether inside edges exceed a degree-preserving null. On the lesson graph, $\\{0,1,2\\}|\\{3\\}$ gives $Q=-0.03125$, so that split is worse than the null expectation.</p>" },
  { title: "Fraud-ring grouping", background: "<p>Fraud teams inspect dense account clusters, but a ring with many outside edges is risky to call a true community.</p>", numbers: "<p>For $S=\\{0,1\\}$, the lesson cut is $2$ and volume is $4$, so conductance is $2/4=0.500$ before any alert is trusted.</p>" },
  { title: "Citation field mapping", background: "<p>Citation graphs often reveal research areas through spectral or modularity-based partitions.</p>", numbers: "<p>The lesson spectral split must produce two nonempty groups; that is a structural sanity check before interpreting either group as a field.</p>" },
  { title: "Communication clustering", background: "<p>Label propagation gives a fast baseline for clustering email or chat graphs, especially when the graph is too large for expensive searches.</p>", numbers: "<p>One lesson update changes labels to $[0,0,0,1]$, showing how a neighborhood vote can pull node 2 into the first group while node 3 stays separate.</p>" },
  { title: "Large-platform communities", background: "<p>On large platforms, modularity can merge small real groups because the null model is normalized by the whole graph.</p>", numbers: "<p>The same $2m$ denominator in $Q$ that gives $-0.03125$ on the toy split is the term behind the resolution-limit pitfall, so D5 reports multiscale resolution values.</p>" }
];

(window.ALLML_CONTENT["12.12"] = window.ALLML_CONTENT["12.12"] || {}).applications = [
  { title: "Ads click graphs", background: "<p>Ad systems distinguish user-click-item relations from user-follows-user relations because the matrix shape and semantics differ.</p>", numbers: "<p>The lesson user-item matrix is $3\\times2$ while the user-user matrix is $3\\times3$, so collapsing them would mix unlike rows and columns.</p>" },
  { title: "Fraud evolution monitoring", background: "<p>Temporal fraud graphs look for new links after a cutoff rather than treating all historical edges as simultaneous.</p>", numbers: "<p>The lesson new edge $(0,2)$ gives $\\Delta_{0,2}=1$ and total directed change $2$, because both directions appear in the directed snapshot change.</p>" },
  { title: "Recommender freshness", background: "<p>Fresh interactions often matter more than old ones in recommendations, so age-weighted neighborhoods are common.</p>", numbers: "<p>With age $1$ and decay rate $0.5$, the lesson weight is $\\exp(-0.5)=0.607$, leaving about $60.7\%$ of the edge's original influence.</p>" },
  { title: "Marketplace meta-paths", background: "<p>Heterogeneous marketplaces use meta-paths such as user-item-user to identify users connected by shared inventory.</p>", numbers: "<p>The lesson U-I-U product gives $M_{0,1}=1$ but $M_{0,2}=0$, so user 0 shares one item with user 1 and none with user 2.</p>" },
  { title: "Temporal validation", background: "<p>Link-prediction validation must hide future edges or it silently turns the target into a feature.</p>", numbers: "<p>At time $2$, the lesson edge $(0,2)$ at time $3$ is a valid temporal negative, so it cannot be included in the training adjacency.</p>" }
];

(window.ALLML_CONTENT["12.13"] = window.ALLML_CONTENT["12.13"] || {}).applications = [
  { title: "Molecule isomorphism screening", background: "<p>WL refinement is widely used as a fast graph-structure screen before more expensive molecule comparisons.</p>", numbers: "<p>The lesson star separates into $2$ colors, one for the center and one for the leaves, so atom neighborhoods with different roles are not collapsed.</p>" },
  { title: "Fraud motif detection", background: "<p>Fraud motifs often begin as degree and neighbor-color patterns before a learned GNN is trained.</p>", numbers: "<p>The lesson first signatures are $[1,3,1,1]$, making the high-degree node visible immediately.</p>" },
  { title: "Architecture selection", background: "<p>Aggregator choice determines what a message-passing model can prove different, independent of training effort.</p>", numbers: "<p>The means of $[1,1]$ and $[1]$ are both $1$, so a mean aggregator loses multiplicity unless another feature carries the count.</p>" },
  { title: "Multiset feature design", background: "<p>Injective multiset encodings are important when counts themselves carry graph meaning.</p>", numbers: "<p>The lesson multisets $[1,1,1]$ and $[1,2]$ both sum to $3$, but their counts are $3$ and $2$, so sum alone is insufficient.</p>" },
  { title: "Regular graph analysis", background: "<p>Regular graphs expose the boundary of message passing because every node can start with identical local evidence.</p>", numbers: "<p>A regular 4-cycle starts with all nodes degree $2$, so a symmetric 1-WL run can keep one color class across iterations.</p>" }
];

(window.ALLML_CONTENT["12.14"] = window.ALLML_CONTENT["12.14"] || {}).applications = [
  { title: "Enterprise knowledge-base completion", background: "<p>Knowledge bases use typed facts such as employee-worksOn-project and rank missing tails for completion.</p>", numbers: "<p>For the lesson embeddings $h=[1,1]$, $r=[2,0]$, and $t=[3,1]$, $\\lVert h+r-t\\rVert_2=0.000$, so the fact is perfectly translated.</p>" },
  { title: "Search entity linking", background: "<p>Entity-linking systems compare candidate entities by how well a relation vector lands on each tail.</p>", numbers: "<p>Corrupting the lesson tail to $[2,2]$ gives distance $\\sqrt{2}=1.414$, which ranks below the true zero-distance tail.</p>" },
  { title: "Recommendation via typed facts", background: "<p>Recommendation graphs can encode user-likes-item or item-similarTo-item as triples and train positives above negatives.</p>", numbers: "<p>With margin $\\gamma=1$, the lesson loss is $\\max(0,1+0-1.414)=0.000$, so that easy negative already satisfies the margin.</p>" },
  { title: "Reverse-edge reasoning", background: "<p>Directed relations need inverse parameters because reversing a fact is not the same relation.</p>", numbers: "<p>The lesson inverse relation vector is $[-2,0]$, exactly the negative of $[2,0]$ for this toy translation.</p>" },
  { title: "One-to-many relation modeling", background: "<p>Pure translations struggle when one head and relation must point to many distant tails.</p>", numbers: "<p>If one relation vector lands exactly on one tail at distance $0.000$, another distant valid tail can remain near $1.414$ away, motivating filtered MRR and richer relation models.</p>" }
];

(window.ALLML_CONTENT["12.15"] = window.ALLML_CONTENT["12.15"] || {}).applications = [
  { title: "Molecular force fields", background: "<p>Molecular energies should ignore rotation, while force vectors should rotate with the molecule.</p>", numbers: "<p>The lesson separates contracts: invariant means $f(gx)=f(x)$ for energy, while equivariant means $f(gx)=g f(x)$ for forces.</p>" },
  { title: "Robotics point clouds", background: "<p>Robots perceive objects from changing camera angles, so distances should survive rotations.</p>", numbers: "<p>Rotating $[1,0]$ and $[0,1]$ preserves their distance $\\sqrt{2}=1.414$, giving a cheap geometry sanity check.</p>" },
  { title: "Physics simulators", background: "<p>Physical vector updates should commute with rotations rather than relearning every orientation.</p>", numbers: "<p>The lesson scalar multiplication check gives $R(3x)-3R(x)=[0,0]$, so scaling and rotating are consistent.</p>" },
  { title: "Mesh and scene graphs", background: "<p>Meshes and scenes are usually modeled with relative edges so moving the whole scene does not change its internal geometry.</p>", numbers: "<p>The lesson edge vector $p_1-p_0=[2,1]$ is unchanged after translating both endpoints by the same shift.</p>" },
  { title: "Graph node ordering", background: "<p>Node array order is not node identity, so graph layers must commute with reindexing.</p>", numbers: "<p>The lesson permutation identity is $(PAP^\\top)(PX)=P(AX)$, proving that message passing reorders outputs exactly when inputs are reordered.</p>" }
];

