# Math · Part 15 — Graph theory  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four exposition
> principles: warm textbook voice, complete step-by-step derivations, case-by-case proof choices, and a plain-English
> gloss for every important symbol. Every numeric claim below was checked with `python3` + `numpy` from the repo root.

**Section:** Graph theory · **Lessons:** 27 · **Breadcrumb:** `Mathematics · Discrete & Foundations` · **Priority:** STANDARD (targeted deepening)

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate — lessons `math-15-18`…`math-15-26` share the block _Small network sanity checks · Recommendation graphs · Social networks · Molecular graphs · Infrastructure routing · ML preprocessing_ | 9 / 27 |
| Templated / thin motivation | 21 / 27 |
| Key formula not in display form | 13 / 27 |
| Authoring filler leaked into a definition (`math-15-23`) | 1 / 27 |
| LaTeX bugs found while reviewing this section | 0 / 27 |

**The core change:** every lesson gets six applications that compute this lesson's own object: degrees, path counts,
BFS layers, shortest-path costs, flow values, cut capacities, color counts, planar counts, adjacency powers,
Laplacian energy, eigenvalues, random-graph expectations, spectral-clustering signs, or message-passing updates.

---

## Priority & systemic issues

- **Replace the shared §5 block in `math-15-18`…`math-15-26`.** The current apps compute average degree or density
  for every lesson, even when the lesson is about planarity, Eulerian trails, Hamiltonian cycles, adjacency powers,
  Laplacian energy, spectra, random graphs, or spectral clustering.
- **Delete the filler sentence in `math-15-23`.** Remove: "The useful habit is to connect the definition to a
  checkable number or construction. Small examples reveal whether the condition is about vertices, edges, faces,
  matrices, probabilities, or learned messages." Replace it with the derivation of $x^T Lx$.
- **Display formulas and name symbols.** Promote central formulas such as $\sum_v\deg(v)=2|E|$, $(A^k)_{ij}$,
  $L=D-A$, $V-E+F=2$, and $\chi(G)$ into display form in the implemented lessons.
- **Compute log.** Verified with repo-root `python3` + `numpy`: degree sums, adjacency powers, BFS/Dijkstra/Bellman
  distances, MST and flow totals, planar counts, Laplacian products/eigenvalues, random-graph expectations,
  Fiedler-vector signs, and GNN aggregation values.
- **LaTeX bugs found:** none in this section plan review. The main rendering-adjacent defect is the prose filler in
  `math-15-23`, not broken math syntax.

---

## Model entry (full prose)

### `math-15-23` — The graph Laplacian  — **full-depth model entry (this is the bar)**

**Connections (§1).**
> This lesson builds on the adjacency matrix and the degree of a vertex. The adjacency matrix records who is
> connected to whom, while the degree matrix records how many neighbors each vertex has. The graph Laplacian puts
> those two pieces together in one matrix, $L=D-A$.
>
> The point of combining them is not just bookkeeping. The Laplacian measures how much a signal on the vertices
> disagrees across edges. That makes it central in spectral graph theory, graph clustering, diffusion on networks,
> and graph neural networks. Once the quadratic form $x^T Lx$ is derived, the matrix has a clear meaning: it turns
> graph structure into a numerical penalty for roughness.

**Motivation & Intuition (§2).**
> A graph often carries a number at each vertex. In a social graph the number might be a user's score, in a sensor
> network it might be a temperature, and in a GNN it might be one coordinate of a node embedding. A natural question
> is whether nearby vertices have similar values.
>
> The graph Laplacian answers that question. If connected vertices have nearly the same values, the Laplacian energy
> is small. If connected vertices disagree sharply, the energy is large. This is why the Laplacian appears in
> smoothing, diffusion, clustering, and semi-supervised learning: it turns the idea "neighbors should agree" into a
> formula that can be computed and optimized.
>
> For the path $1-2-3$, the matrices are
> $$
> A=\begin{bmatrix}0&1&0\\1&0&1\\0&1&0\end{bmatrix},\quad
> D=\begin{bmatrix}1&0&0\\0&2&0\\0&0&1\end{bmatrix},\quad
> L=D-A=\begin{bmatrix}1&-1&0\\-1&2&-1\\0&-1&1\end{bmatrix}.
> $$
> The middle vertex has degree $2$, so its diagonal entry is $2$; each edge contributes a $-1$ off the diagonal.

**Definition & Assumptions (§3).** Display
$$
L=D-A.
$$
Then derive the energy identity for a simple undirected graph:
1. Start with $x^T Lx=x^T(D-A)x$ because $L$ is defined as degree matrix minus adjacency matrix.
2. Expand the degree term: $x^TDx=\sum_i d_i x_i^2$ because $D$ is diagonal and $D_{ii}=d_i$.
3. Expand the adjacency term: $x^TAx=\sum_i\sum_j A_{ij}x_ix_j$ because matrix multiplication sums over ordered vertex pairs.
4. In an undirected simple graph, $A_{ij}=1$ exactly when $i$ and $j$ are adjacent. Each edge is counted twice in the ordered sum, so $x^TAx=2\sum_{(i,j)\in E}x_ix_j$.
5. Rewrite the degree term by edges: $\sum_i d_i x_i^2=\sum_{(i,j)\in E}(x_i^2+x_j^2)$ because each incident edge contributes one copy of its endpoint's square.
6. Subtract edge by edge:
$$
 x^TLx=\sum_{(i,j)\in E}(x_i^2+x_j^2-2x_ix_j)=\sum_{(i,j)\in E}(x_i-x_j)^2.
$$
7. Therefore $x^TLx$ is total squared disagreement across edges. It is $0$ exactly when $x_i=x_j$ on every edge, which means $x$ is constant on each connected component.

**Symbols.** $G=(V,E)$ is the graph; $V$ vertices; $E$ undirected edges; $A$ adjacency matrix; $D$ degree matrix;
$d_i$ degree of vertex $i$; $L$ graph Laplacian; $x_i$ value of a signal at vertex $i$; $x^TLx$ Laplacian energy.

**Real-World Applications (§5).**
1. **Smoothness energy:** on path $1-2-3$, $x=(3,1,3)$ gives $x^TLx=(3-1)^2+(1-3)^2=8$.
2. **Constant-signal check:** $x=(2,2,2)$ gives $x^TLx=0$, so the signal is perfectly smooth on the connected path.
3. **One heat/GNN smoothing step:** $Lx=(2,-4,2)$, so $x\leftarrow x-0.1Lx=(2.8,1.4,2.8)$.
4. **Connectedness test:** the path's Laplacian eigenvalues are $0,1,3$, so the $0$ eigenvalue has multiplicity $1$ and the graph is connected.
5. **Normalized Laplacian coefficient:** $L_{\mathrm{sym}}=I-D^{-1/2}AD^{-1/2}$ gives edge coefficient $-1/\sqrt{1\cdot2}\approx-0.707$ between an endpoint and the middle vertex.
6. **Effective-resistance feature:** in a unit-resistor path, the resistance between vertices $1$ and $3$ is $2$, matching the two series edges and recoverable from $L^+$.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted content for one lesson in compressed plan shorthand. The labels are
not app UI copy; the implemented lesson expands them into flowing prose in the same plain voice as the model entry.

### `math-15-01` — Graphs and their representations  · deepen · explain-only

**Connections (§1).**
> This lesson begins with the basic language of graph theory: objects and the relationships between
> them. A graph separates vertices, which are the objects, from edges, which are the links. That
> separation makes the same structure easy to draw, store, or compute with. The lesson also prepares
> the reader for degree counts, paths, matrices, and algorithms, because all of those later ideas
> depend on choosing a clear representation.

**Motivation & Intuition (§2).**
> When a relationship dataset is small, a picture may be the easiest way to understand it. As soon as
> the graph is used in code, the same information has to be stored in a form that supports lookup,
> traversal, or matrix operations. Edge lists, adjacency lists, and adjacency matrices all describe
> the same graph, but they make different operations convenient.
>
> The important habit is to separate the graph itself from its representation. The graph is the set of
> vertices and edges; the representation is the storage choice. An edge list is compact for listing
> relationships, adjacency lists are natural for walking through neighbors, and an adjacency matrix
> makes connection tests and linear-algebra operations direct.

**Definition & Assumptions (§3).** Explain-only: this lesson defines equivalent representations, so there is no theorem to prove. Show the same four-edge graph as $E=\{12,13,24,35\}$, adjacency lists, and a $5\times5$ matrix.

**Symbols.** $G=(V,E)$ graph; $V$ vertices; $E$ edges; $n=|V|$; $m=|E|$; $A$ adjacency matrix; $A_{ij}=1$ if $ij\in E$.

**Real-World Applications (§5).**
1. Edge list stores $m=4$ records.
2. Undirected adjacency lists store $2m=8$ neighbor entries.
3. The $5\times5$ adjacency matrix has $25$ entries.
4. Matrix density is $2m/[n(n-1)]=8/20=0.4$.
5. Vertex $1$ has neighbors $\{2,3\}$, so lookup returns $2$ IDs.
6. Matrix row sums are degrees $(2,2,2,1,1)$.

### `math-15-02` — Degree and the handshake lemma  · AUTHOR derivation

**Connections (§1).**
> This lesson builds on the idea that edges touch vertices. The degree of a vertex turns that local
> picture into a number: how many edges meet at that vertex. Once every vertex has a degree, the whole
> graph has a simple global check. The handshake lemma is one of the first examples of a graph fact
> that follows from counting the same structure in two ways.

**Motivation & Intuition (§2).**
> Degree is local, but degree sums are global. If one vertex has degree $3$, that means three
> edge-ends touch it. Adding degrees across all vertices counts all of those edge-ends throughout the
> graph.
>
> In an undirected graph, every edge has two endpoints. That means each edge contributes exactly two
> to the total degree count. This explains both the formula $\sum_v \deg(v)=2|E|$ and the useful
> parity check that odd-degree vertices must occur in pairs.

**Definition & Assumptions (§3).** 1. Let $d(v)$ count incident edges at vertex $v$ because degree is local edge count. 2. Sum $\sum_{v\in V}d(v)$ over all vertices to count incidences. 3. Each undirected edge has exactly two endpoints, so it contributes $2$ incidences. 4. Therefore $\sum_{v\in V}d(v)=2|E|$. 5. Since the sum is even, the number of odd-degree vertices is even.

**Symbols.** $d(v)$ or $\deg(v)$ degree; $|E|=m$ number of edges; incidence means an edge-end touching a vertex.

**Real-World Applications (§5).**
1. Degrees $(3,2,2,1)$ sum to $8$, so $m=4$.
2. Average degree is $8/4=2$.
3. Odd-degree vertices are the two vertices of degrees $3$ and $1$.
4. A graph with degree sequence $(3,3,2,2,2)$ has sum $12$, so $m=6$.
5. A proposed sequence summing to $9$ is impossible.
6. In a tree with $n=7$, degree sum must be $12$ because $m=6$.

### `math-15-03` — Paths and walks  · explain-only

**Connections (§1).**
> This lesson follows naturally after graphs and degrees, because it asks what it means to move
> through a graph. A walk is any sequence of adjacent steps, while a path is a walk with no repeated
> vertices. That distinction supports later lessons on reachability, shortest paths, cycles, and
> matrix powers. It also gives precise language for routes that are allowed to revisit places and
> routes that are not.

**Motivation & Intuition (§2).**
> In many graph problems, moving from one vertex to another is the basic operation. Sometimes repeated
> vertices are harmless, as in a random walk or a process that can return to a previous state. Other
> times repetition is exactly what we want to avoid, as in a simple route or a shortest path in an
> unweighted graph.
>
> The load-bearing distinction is that walks are flexible and paths are simple. Walks are useful for
> counting all possible step sequences, especially with adjacency matrices. Paths are useful for
> distances, connectivity, and cycle definitions because they show that vertices can be connected
> without unnecessary repeats.

**Definition & Assumptions (§3).** Explain-only: path and walk are definitions. Use adjacency powers later for counting walks; do not pretend the definition itself has a proof.

**Symbols.** Walk $v_0,v_1,\ldots,v_k$; length $k$; path = no repeated vertices; endpoints $v_0,v_k$.

**Real-World Applications (§5).**
1. In path graph $1-2-3-4$, there is one length-$3$ path from $1$ to $4$.
2. In the same graph, $(A^2)_{13}=1$ counts one length-$2$ walk.
3. $(A^3)_{14}=1$ counts one length-$3$ walk.
4. Walk $1,2,1,2$ has length $3$ but is not a path.
5. Distance from $1$ to $4$ is $3$.
6. A route $1,2,3,2,1$ has length $4$ and endpoints both $1$.

### `math-15-04` — Cycles  · AUTHOR derivation

**Connections (§1).**
> This lesson extends paths by allowing a route to close back on itself. A cycle is a closed path, so
> it captures the first kind of redundancy in a graph. Earlier ideas about paths and connectivity
> explain why a cycle gives an alternate way around. Later lessons use cycles to understand trees,
> spanning trees, coloring, planarity, and algorithms.

**Motivation & Intuition (§2).**
> A connected graph can have just enough edges to hold together, or it can have extra edges. The extra
> edges are important because they create routes that return to where they started. That closed
> structure means one edge on the cycle is not essential for reachability between its endpoints.
>
> Cycle rank measures how many independent redundancies a connected graph has beyond a tree. A tree on
> $n$ vertices uses $n-1$ edges, so every additional independent edge creates one independent cycle.
> This makes $m-n+1$ a compact count of how far a connected graph is from being acyclic.

**Definition & Assumptions (§3).** 1. A connected graph with $n$ vertices needs at least $n-1$ edges to connect all vertices. 2. A tree has exactly $n-1$ edges and no cycle. 3. Adding one extra edge to a tree creates one closed route between the edge's endpoints. 4. Each independent extra edge creates one independent cycle. 5. Thus the cycle rank of a connected graph is $m-n+1$.

**Symbols.** Cycle; $n=|V|$; $m=|E|$; cycle rank $m-n+1$ for one connected component.

**Real-World Applications (§5).**
1. $C_5$ has $5$ vertices and $5$ edges.
2. Its degree sum is $10$.
3. Its cycle rank is $5-5+1=1$.
4. A square with one diagonal has $n=4,m=5$, so cycle rank $2$.
5. Removing one edge from $C_5$ leaves a path with $4$ edges.
6. A triangle has cycle length $3$.

### `math-15-05` — Connectivity  · explain-only

**Connections (§1).**
> This lesson uses paths to define when a graph is in one piece. If every vertex can reach every other
> vertex, the graph is connected. If not, the connected components are the separate maximal pieces.
> This language is used by traversal algorithms, spanning trees, Laplacians, and spectral tests for
> connectedness.

**Motivation & Intuition (§2).**
> Reachability is one of the most basic questions a graph can answer. Two vertices may be in the same
> dataset and still have no path between them. Components organize this situation by grouping together
> exactly the vertices that can reach each other.
>
> The word maximal matters. A component is not just any connected subgraph; it is a connected piece
> that cannot be enlarged without losing connectedness. Algorithms such as BFS or DFS find components
> by starting at one vertex, exploring everything reachable from it, and then repeating from an
> unvisited vertex if needed.

**Definition & Assumptions (§3).** Explain-only: connectedness and connected components are definitions. The lesson should explain maximality and why algorithms find components by exploring all reachable vertices.

**Symbols.** Connected graph; component; reachable; bridge edge; $c(G)$ number of components.

**Real-World Applications (§5).**
1. Edges $12,23,45$ give component sizes $3$ and $2$.
2. Therefore $c(G)=2$.
3. Adding edge $34$ makes $c(G)=1$.
4. Removing bridge $23$ from path $1-2-3$ gives $2$ components.
5. In a connected $5$-vertex graph, BFS from one vertex visits $5$ vertices.
6. In the disconnected example, BFS from $1$ visits only $3$ vertices.

### `math-15-06` — Trees  · explain-only

**Connections (§1).**
> This lesson combines connectivity and cycles. A tree is connected enough to hold all vertices
> together, but sparse enough to have no cycles. That makes trees the minimal connected graphs. They
> are the reference point for spanning trees, traversal trees, recursion, and many proofs by induction
> on graphs.

**Motivation & Intuition (§2).**
> A connected graph can contain redundant routes, but a tree has none. Between any two vertices there
> is exactly one path, so removing an edge separates the graph. This is why trees are useful whenever
> the goal is to preserve reachability with no extra edges.
>
> The standard characterizations all describe the same structure from different angles. Connected and
> acyclic emphasizes the definition, unique paths emphasize navigation, and $m=n-1$ emphasizes the
> edge count. Together they make trees a bridge between graph structure and simple counting.

**Definition & Assumptions (§3).** Explain-only: the lesson should present the equivalent characterizations and explain them, not fake a proof. Include the standard facts: connected + acyclic, unique path between vertices, and $m=n-1$.

**Symbols.** Tree; leaf; root when oriented; parent/child; $n$ vertices; $m$ edges.

**Real-World Applications (§5).**
1. A tree with $7$ vertices has $6$ edges.
2. Its degree sum is $12$.
3. Path $P_7$ has $2$ leaves.
4. Star $K_{1,6}$ has $6$ leaves.
5. The unique path between two leaves in $P_7$ has length $6$.
6. Adding one edge to a $7$-vertex tree creates cycle rank $1$.

### `math-15-07` — Spanning trees  · deepen derivation

**Connections (§1).**
> This lesson builds from trees to connected graphs that may contain cycles. A spanning tree keeps
> every vertex but removes the cycle edges that are not needed for connectivity. It is a way to
> extract a minimal connected backbone from a larger graph. This idea prepares the reader for minimum
> spanning trees, network design, and cycle-rank reasoning.

**Motivation & Intuition (§2).**
> A connected graph often contains more edges than are needed just to keep all vertices reachable.
> Those extra edges may be useful in the original network, but if the goal is only connectivity, they
> can be removed carefully. A spanning tree is what remains when all redundancy has been discarded
> without losing any vertex.
>
> The key operation is removing an edge from a cycle. The rest of the cycle still connects the removed
> edge's endpoints, so the graph stays connected. Repeating this operation eventually leaves a
> connected graph with no cycles, which is exactly a tree spanning all vertices.

**Definition & Assumptions (§3).** 1. Start with any connected graph. 2. If there is a cycle, remove one edge from that cycle because the rest of the cycle still connects its endpoints. 3. Connectivity is preserved after the removal. 4. Repeat until no cycles remain. 5. The result is connected and acyclic, hence a spanning tree with $n-1$ edges.

**Symbols.** Spanning tree; spanning = includes all vertices; tree edge; non-tree edge; $\tau(G)$ number of spanning trees.

**Real-World Applications (§5).**
1. Any spanning tree on $5$ vertices has $4$ edges.
2. $K_4$ has $4^{4-2}=16$ spanning trees.
3. A cycle $C_5$ has $5$ spanning trees, one per removed edge.
4. A graph that is already a tree has $1$ spanning tree.
5. A square with one diagonal has $8$ spanning trees.
6. Removing two cycle edges from a connected $6$-vertex, $7$-edge graph reaches $5$ tree edges.

### `math-15-08` — Breadth-first search  · explain-only

**Connections (§1).**
> This lesson turns reachability into an algorithm. Breadth-first search starts at one source vertex
> and explores the graph layer by layer. The layers match unweighted distances from the source. This
> prepares the reader for shortest paths, components, recommendation neighborhoods, and traversal
> trees.

**Motivation & Intuition (§2).**
> When every edge has the same cost, the shortest way to reach a vertex is the one with the fewest
> edges. BFS respects that structure by visiting all neighbors first, then all vertices two steps
> away, then all vertices three steps away, and so on. The queue enforces this layer order.
>
> The main invariant is that vertices at distance $k$ are processed before vertices at distance $k+1$.
> Therefore, when BFS first discovers a vertex, no shorter unweighted route to it is still waiting to
> be found. The predecessor links recorded during discovery form a shortest-path tree for all reached
> vertices.

**Definition & Assumptions (§3).** Explain-only with algorithm invariant: BFS processes all vertices at distance $k$ before distance $k+1$, so first discovery gives shortest unweighted distance.

**Symbols.** Source $s$; queue; layer; distance $d(v)$; predecessor $p(v)$.

**Real-World Applications (§5).**
1. With edges $sa,sb,ac,bd,ce$, BFS distances are $d(s)=0,d(a)=1,d(b)=1,d(c)=2,d(d)=2,d(e)=3$.
2. The shortest $s\to e$ path has length $3$.
3. Layer $2$ contains $2$ vertices.
4. A two-hop friend recommendation from $s$ returns $\{c,d\}$, count $2$.
5. The BFS tree has $5$ edges for $6$ reached vertices.
6. Vertex $e$ is discovered after $c$, because it is in layer $3$.

### `math-15-09` — Depth-first search  · explain-only

**Connections (§1).**
> This lesson introduces the other basic graph traversal. Depth-first search follows one path as far
> as possible before backtracking. That different exploration order reveals structure that BFS does
> not emphasize, such as recursion stacks, back edges, and finish times. DFS becomes a tool for
> components, cycle detection, and topological ordering.

**Motivation & Intuition (§2).**
> DFS is useful when a graph problem depends on nested exploration. The algorithm commits to a branch,
> records what is currently on the recursion stack, and only returns when no unexplored outgoing step
> remains. This makes the history of the search part of the information it discovers.
>
> In directed graphs, a back edge to a vertex still on the stack signals a cycle because the current
> path can return to an ancestor. In a DAG, no such back edge exists, and reverse finish order places
> each prerequisite before the vertices that depend on it. The same traversal idea therefore supports
> both detecting cycles and ordering acyclic dependencies.

**Definition & Assumptions (§3).** Explain-only with invariant: DFS maintains a recursion stack; a back edge to the stack signals a directed cycle, and reverse finish order gives a topological order in a DAG.

**Symbols.** Discovery time; finish time; recursion stack; tree edge; back edge; topological order.

**Real-World Applications (§5).**
1. In DAG $A\to B,A\to C,B\to D,C\to D$, DFS can output topological order $A,B,C,D$ with $4$ vertices.
2. The recursion stack length can reach $3$ on path $A\to B\to D$.
3. A back edge $D\to B$ creates one directed cycle.
4. DFS over two components starts $2$ root calls.
5. A DFS tree on $6$ reached vertices has $5$ tree edges.
6. In an undirected triangle, DFS finds $1$ non-tree edge completing the cycle.

### `math-15-10` — Dijkstra's shortest paths  · deepen derivation

**Connections (§1).**
> This lesson moves from unweighted distance to weighted shortest paths. Dijkstra's algorithm applies
> when edge weights are nonnegative. It keeps tentative distances and gradually settles vertices whose
> shortest distances are known. The method builds on paths, relaxation, and the idea that a shortest
> route can be extended edge by edge.

**Motivation & Intuition (§2).**
> In a weighted graph, the closest vertex is not necessarily the one with the fewest edges from the
> source. The algorithm therefore tracks the best distance found so far for each vertex. Relaxing an
> edge means checking whether a route through the current vertex improves that tentative value.
>
> The nonnegative-weight assumption is what makes settling safe. Once the unsettled vertex with
> smallest tentative distance is chosen, any future route to it would have to pass through another
> unsettled vertex and then add nonnegative cost. That future route cannot be shorter, so the current
> distance can be finalized.

**Definition & Assumptions (§3).** 1. Keep tentative distances $d(v)$, with $d(s)=0$ and others $\infty$. 2. Choose the unsettled vertex $u$ with smallest $d(u)$. 3. Because all edge weights are nonnegative, any later route to $u$ must be at least as long as the current best. 4. Settle $u$. 5. Relax every edge $u\to v$ by replacing $d(v)$ with $\min(d(v),d(u)+w(u,v))$. 6. Repeat until all needed vertices are settled.

**Symbols.** $d(v)$ tentative distance; $w(u,v)$ edge weight; relaxation; priority queue; settled vertex.

**Real-World Applications (§5).**
1. In graph $s\to a=2,s\to b=5,a\to b=1,a\to c=2,b\to c=1,c\to d=1,b\to d=3$, shortest $d(a)=2$.
2. Relaxing $a\to b$ changes $d(b)$ from $5$ to $3$.
3. Shortest $d(c)=4$.
4. Shortest $d(d)=5$.
5. Path $s,a,c,d$ has cost $2+2+1=5$.
6. The settled order is $s,a,b,c,d$, five vertices.

### `math-15-11` — Bellman–Ford  · AUTHOR derivation

**Connections (§1).**
> This lesson keeps the shortest-path goal but relaxes the weight assumption. Bellman–Ford can handle
> negative edge weights as long as reachable negative cycles are absent. It does this by repeated
> relaxation rather than by permanently settling the nearest vertex. The lesson prepares the reader
> for graphs where costs, credits, or adjustments may be negative.

**Motivation & Intuition (§2).**
> Negative edges break the reasoning used by Dijkstra's algorithm. A vertex that looks settled could
> later be improved by a path that uses a negative edge. Bellman–Ford avoids that problem by allowing
> improvements to propagate gradually through paths with more and more edges.
>
> The core observation is that, without a negative cycle, a shortest path can be taken to be simple. A
> simple path on $n$ vertices has at most $n-1$ edges. After enough full passes of edge relaxation,
> every such path length has had a chance to influence the distances, and any further improvement
> indicates a reachable negative cycle.

**Definition & Assumptions (§3).** 1. A shortest simple path uses at most $n-1$ edges because repeating a vertex would create a removable cycle unless a negative cycle exists. 2. After one full pass, all shortest paths using one edge are correct. 3. After $k$ passes, all shortest paths using at most $k$ edges are correct. 4. After $n-1$ passes, every simple shortest path is covered. 5. A further improvement means a negative cycle is reachable.

**Symbols.** $n=|V|$; edge $(u,v,w)$; relaxation $d(v)\leftarrow\min(d(v),d(u)+w)$; negative cycle.

**Real-World Applications (§5).**
1. With $s\to a=4,s\to b=5,a\to b=-2,b\to c=3,a\to c=4$, final $d(a)=4$.
2. Relaxing $a\to b$ gives $d(b)=2$.
3. Then $d(c)=5$ through $b$.
4. Direct $a\to c$ gives cost $8$, so it is not chosen.
5. For $4$ vertices, Bellman–Ford uses $3$ main passes.
6. If an extra edge $c\to a=-10$ improves after pass $3$, a negative cycle is detected.

### `math-15-12` — Minimum spanning trees  · explain-only

**Connections (§1).**
> This lesson adds weights to spanning trees. A minimum spanning tree connects every vertex while
> minimizing total edge weight. It keeps the same tree structure as before, but now every edge has a
> cost. The idea supports network design, clustering, approximation algorithms, and greedy methods
> such as Kruskal and Prim.

**Motivation & Intuition (§2).**
> A spanning tree answers the question of how to connect all vertices with no redundant edges. In a
> weighted graph, there may be many spanning trees, and some are cheaper than others. The minimum
> spanning tree chooses the connected backbone with least total cost.
>
> The cut property explains why greedy algorithms can be trusted. If a cut separates the vertices into
> two sides, any spanning tree must cross that cut at least once. Choosing the lightest available
> crossing edge is safe because a more expensive crossing edge can be exchanged without increasing the
> total weight.

**Definition & Assumptions (§3).** Explain-only with cut property: for any cut, the lightest edge crossing that cut is safe to add to some MST. Use this to justify Kruskal and Prim rather than proving the full theorem here.

**Symbols.** Weighted graph; spanning tree; total weight; cut; safe edge; MST.

**Real-World Applications (§5).**
1. Kruskal choosing weights $1,2,3$ gives MST total $6$.
2. A $4$-vertex MST has $3$ edges.
3. If edge weights are $1,2,3,10$, the $10$ edge is skipped when it closes a cycle.
4. Replacing a chosen edge of weight $3$ by crossing edge $5$ raises total by $2$.
5. A complete graph $K_4$ candidate MST still uses only $3$ of $6$ edges.
6. A disconnected two-component input has no MST; it has $2$ component trees instead.

### `math-15-13` — Network flows  · explain-only

**Connections (§1).**
> This lesson changes the role of edges from connections to channels with capacity. A network flow
> sends quantity from a source to a sink while respecting those capacities. Intermediate vertices
> conserve flow, so they pass along what they receive. This language prepares the reader for cuts, max
> flow, bipartite matching, and routing problems.

**Motivation & Intuition (§2).**
> Many networks carry something: data packets, vehicles, water, tasks, or matched assignments. Each
> edge has a limit, and the total amount sent from the source to the sink depends on how these limits
> interact. A valid flow must never exceed an edge's capacity.
>
> The second rule is conservation. Except at the source and sink, a vertex is not allowed to create or
> destroy flow; inflow must equal outflow. The value of the flow is then measured at the source or
> sink, giving a single number for how much the network successfully transports.

**Definition & Assumptions (§3).** Explain-only: define capacity constraints and flow conservation, then show the value as total flow leaving the source. The theorem connecting flows to cuts is in the next lesson.

**Symbols.** Source $s$; sink $t$; capacity $c(e)$; flow $f(e)$; conservation; value $|f|$.

**Real-World Applications (§5).**
1. Two paths carrying $2$ and $2$ units give flow value $4$.
2. Edge capacity $3$ with flow $2$ has residual capacity $1$.
3. Conservation at vertex $a$ with inflow $2$ requires outflow $2$.
4. Source outflow $5$ and inflow $1$ gives value $4$.
5. A bottleneck edge of capacity $2$ limits that path to $2$.
6. Augmenting by residual amount $1$ raises total flow from $4$ to $5$.

### `math-15-14` — Cuts and the max-flow min-cut theorem  · AUTHOR derivation

**Connections (§1).**
> This lesson pairs flows with cuts. A cut separates the source from the sink, so every unit of flow
> must cross from the source side to the sink side somewhere. That makes cut capacity an upper bound
> on possible flow. The max-flow min-cut theorem explains when this upper bound is exactly attainable.

**Motivation & Intuition (§2).**
> A flow is a constructive object: it shows how much can be sent. A cut is an obstruction: it shows a
> boundary that all source-to-sink traffic must cross. If the total capacity across that boundary is
> small, no routing strategy can push more flow through the network than the cut allows.
>
> The theorem says that the best construction and the tightest obstruction meet. When no augmenting
> path remains in the residual graph, the vertices still reachable from the source define a cut. Its
> capacity equals the current flow value, proving at the same time that the flow is maximum and the
> cut is minimum.

**Definition & Assumptions (§3).** 1. Partition vertices into $S$ and $T$ with $s\in S,t\in T$. 2. By conservation, net flow leaving $S$ equals the value of the flow. 3. Net flow leaving $S$ is at most the sum of capacities of edges from $S$ to $T$. 4. Therefore every cut capacity upper-bounds every flow value. 5. When no augmenting path remains, the reachable residual vertices define a cut whose capacity equals the current flow. 6. Thus maximum flow equals minimum cut capacity.

**Symbols.** Cut $(S,T)$; cut capacity $c(S,T)$; residual graph; augmenting path; max flow.

**Real-World Applications (§5).**
1. Cut capacities $3$ and $2$ sum to $5$.
2. A flow of value $5$ proves that cut is minimum.
3. No flow can exceed $5$ across that cut.
4. If the current flow is $4$, one residual augment of $1$ can reach $5$.
5. Removing the two cut edges disconnects $s$ from $t$ with capacity loss $5$.
6. In bipartite matching, a max flow of $3$ gives matching size $3$.

### `math-15-15` — Bipartite graphs  · AUTHOR derivation

**Connections (§1).**
> This lesson studies graphs whose vertices split into two types. In a bipartite graph, every edge
> crosses between the two parts and no edge stays inside one part. That structure appears in user-item
> data, assignment problems, and matching. It also connects graph coloring to the absence of odd
> cycles.

**Motivation & Intuition (§2).**
> When relationships always join two different kinds of objects, a bipartite graph is the natural
> model. Users connect to items, students to projects, and workers to tasks. The two-side structure
> prevents triangles and, more generally, prevents every odd cycle.
>
> Parity is the central idea. Along a cycle in a bipartite graph, the vertices must alternate sides,
> so returning to the starting side takes an even number of steps. Conversely, if no odd cycle exists,
> distance parity from a root consistently assigns vertices to two sides in each component.

**Definition & Assumptions (§3).** 1. If a graph is bipartite with sides $L,R$, any cycle must alternate $L,R,L,R$. 2. Returning to the starting side requires an even number of steps, so no odd cycle exists. 3. Conversely, if there is no odd cycle, assign each vertex a side by parity of its distance from a chosen root in each component. 4. An edge joining same-parity vertices would create an odd cycle through the root paths. 5. Therefore the parity assignment is a bipartition.

**Symbols.** Parts $L,R$; bipartition; odd cycle; parity; $K_{a,b}$ complete bipartite graph.

**Real-World Applications (§5).**
1. $K_{2,3}$ has $2\cdot3=6$ edges.
2. $C_6$ is bipartite with sides of size $3$ and $3$.
3. $K_3$ is not bipartite because it has a $3$-cycle.
4. A path on $5$ vertices splits as $3$ and $2$.
5. A user-item graph with $4$ users and $5$ items can have at most $20$ edges.
6. Two-coloring a connected bipartite graph uses exactly $2$ colors if it has at least one edge.

### `math-15-16` — Matching  · AUTHOR derivation

**Connections (§1).**
> This lesson builds on bipartite graphs and flows. A matching chooses edges that do not share
> endpoints, so each selected relationship uses each vertex at most once. This is the graph model
> behind assignments, pairings, and one-to-one recommendations. The flow construction gives a useful
> way to compute maximum matchings in bipartite graphs.

**Motivation & Intuition (§2).**
> In an assignment problem, choosing one edge can rule out several others because the same user or
> item cannot be reused. A matching captures exactly that no-duplicate rule. The size of the matching
> counts how many successful pairings have been made.
>
> The flow viewpoint turns the combinatorial rule into capacity constraints. Source-to-left and
> right-to-sink edges of capacity $1$ ensure that each vertex can carry at most one unit of selected
> assignment flow. An integral flow of value $k$ therefore corresponds to $k$ matched edges.

**Definition & Assumptions (§3).** 1. Model each possible assignment as an edge in a bipartite graph. 2. The no-duplicate rule means no two chosen edges may share an endpoint. 3. Therefore a feasible assignment is exactly a matching. 4. Add source-to-left and right-to-sink edges of capacity $1$. 5. Any integral flow sends at most one unit through each vertex, so it corresponds to a matching. 6. A flow of value $k$ gives a matching of size $k$.

**Symbols.** Matching $M$; matched/unmatched vertex; augmenting path; maximum matching; perfect matching.

**Real-World Applications (§5).**
1. Edges $u_1i_1,u_2i_2,u_3i_3$ form matching size $3$.
2. With $4$ users and $3$ items, matching size is at most $3$.
3. One augmenting path raises size from $2$ to $3$.
4. A perfect matching on $6$ vertices has $3$ edges.
5. In $K_{2,3}$, maximum matching size is $2$.
6. A max-flow value $3$ in the assignment network means $3$ assignments.

### `math-15-17` — Graph coloring  · deepen derivation

**Connections (§1).**
> This lesson uses labels to manage conflicts. A graph coloring assigns colors so adjacent vertices
> receive different colors. The chromatic number is the smallest number of colors that can do the job.
> This connects graph structure to scheduling, resource allocation, independent sets, and cliques.

**Motivation & Intuition (§2).**
> Coloring is a way to group vertices that do not conflict with each other. Vertices with the same
> color form an independent set, because an edge inside one color class would violate the rule.
> Finding a good coloring means covering all vertices with as few independent sets as possible.
>
> Two kinds of evidence determine the exact chromatic number. A clique of size $r$ proves that at
> least $r$ colors are necessary, because every pair in the clique conflicts. An explicit coloring
> with $r$ colors proves that $r$ colors are sufficient, so the lower and upper bounds meet.

**Definition & Assumptions (§3).** 1. A proper coloring is a partition of vertices into independent sets because same-colored vertices cannot be adjacent. 2. A clique of size $r$ needs at least $r$ colors since every pair conflicts. 3. A coloring using $k$ colors proves $\chi(G)\le k$. 4. A lower bound $r$ and an explicit $r$-coloring together prove $\chi(G)=r$.

**Symbols.** Coloring; color class; independent set; clique; chromatic number $\chi(G)$.

**Real-World Applications (§5).**
1. $C_5$ needs $3$ colors.
2. $K_4$ needs $4$ colors.
3. A bipartite graph with an edge has $\chi=2$.
4. A triangle-free tree with at least one edge has $\chi=2$.
5. A schedule conflict graph colored with $4$ colors needs $4$ time slots.
6. A clique of size $5$ proves at least $5$ colors.

### `math-15-18` — Planar graphs  · rewrite §5 · explain-only

**Connections (§1).**
> This lesson introduces graphs that can be drawn without crossings. A planar graph is not defined by
> one particular drawing, but by whether some crossing-free drawing exists. This makes planarity a
> structural property rather than an artistic one. The idea prepares the reader for faces, Euler's
> formula, and planar edge bounds.

**Motivation & Intuition (§2).**
> A messy drawing can make a planar graph look nonplanar. Edges may cross simply because of how the
> picture was arranged. The question of planarity asks whether the graph can be redrawn so edges meet
> only at shared endpoints.
>
> Once a drawing has no crossings, the regions of the plane become part of the structure. These
> regions are called faces, including the unbounded outer face. Later formulas connect the numbers of
> vertices, edges, and faces, but this lesson first fixes the definitions needed to talk about planar
> drawings precisely.

**Definition & Assumptions (§3).** Explain-only: define planar drawing, faces, and crossings. Euler's formula and edge bounds are derived in the next lesson.

**Symbols.** Planar graph; plane embedding; face; crossing; outer face.

**Real-World Applications (§5).**
1. $K_4$ is planar with $V=4,E=6,F=4$.
2. $K_5$ is nonplanar; it has $10$ edges while planar simple graphs with $5$ vertices have at most $9$.
3. $K_{3,3}$ is nonplanar; it exceeds the bipartite planar bound $2V-4=8$ by $1$ edge.
4. A tree with $6$ vertices is planar and has $1$ face in an embedding.
5. A planar road graph with $8$ vertices has at most $18$ edges.
6. A crossing-free square with a diagonal has $V=4,E=5,F=3$.

### `math-15-19` — Euler's formula  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson gives the central invariant for connected planar graphs. After a planar drawing is
> fixed, it has vertices, edges, and faces. The individual drawing can change, but the quantity
> $V-E+F$ remains equal to $2$. This formula supports edge bounds, nonplanarity tests, and many
> counting arguments in planar graph theory.

**Motivation & Intuition (§2).**
> A planar graph can be built from a tree by adding edges that create cycles without crossings. The
> tree case is easy to count: it has $V-1$ edges and one face. That already gives $V-E+F=2$.
>
> Adding a planar edge inside a face increases the number of edges by one and splits one face into
> two. The two changes cancel in the expression $V-E+F$. This is why the same value persists as the
> drawing gains cycles and becomes a general connected planar graph.

**Definition & Assumptions (§3).** 1. A tree drawn in the plane has $E=V-1$ and one face, so $V-E+F=V-(V-1)+1=2$. 2. Add an edge that stays planar. 3. The new edge creates one new cycle and splits one face into two. 4. Thus $E$ increases by $1$ and $F$ increases by $1$, so $V-E+F$ is unchanged. 5. Repeating until the connected planar graph is built gives $V-E+F=2$.

**Symbols.** $V$ vertices; $E$ edges; $F$ faces including the outer face; connected planar graph.

**Real-World Applications (§5).**
1. Cube graph: $8-12+6=2$.
2. $K_4$: $4-6+4=2$.
3. Square with a diagonal: $4-5+3=2$.
4. A planar connected graph with $V=6,E=9$ has $F=5$.
5. A triangulated planar graph with $V=6$ has maximum $E=12$.
6. A tree with $V=10,E=9$ has $F=1$.

### `math-15-20` — Eulerian graphs  · rewrite §5 · explain-only

**Connections (§1).**
> This lesson studies routes that use every edge exactly once. An Eulerian circuit returns to its
> starting vertex, while an Eulerian trail may start and end at different vertices. The key condition
> is about vertex degrees, not about the overall shape of the drawing. This contrasts with Hamiltonian
> questions, which focus on visiting vertices.

**Motivation & Intuition (§2).**
> When a route uses edges exactly once, every arrival at an internal vertex must be paired with a
> departure. That pairing explains why even degree is the natural condition for a closed Eulerian
> circuit. If all edge-containing parts are connected and all degrees are even, the route can keep
> pairing entrances and exits until every edge is used.
>
> For an open Eulerian trail, exactly two vertices are allowed to be unpaired: the start and the end.
> Those two vertices have odd degree, while all other vertices still need even degree. This parity
> reasoning gives a clean local test for a global edge-covering route.

**Definition & Assumptions (§3).** Explain-only with parity reasoning: all degrees even gives an Eulerian circuit in each connected component containing edges; exactly two odd vertices gives an Eulerian trail but not a circuit.

**Symbols.** Eulerian circuit; Eulerian trail; odd/even degree; connected support.

**Real-World Applications (§5).**
1. Cycle $C_4$ has $0$ odd vertices, so it has an Eulerian circuit.
2. Path $P_4$ has $2$ odd vertices, so it has an Eulerian trail.
3. Star $K_{1,3}$ has $4$ odd vertices, so it has neither.
4. A graph with degrees $(2,2,4,4)$ passes the parity test with $0$ odd vertices.
5. Degrees $(1,3,2,2)$ give exactly $2$ odd vertices, so an open trail exists.
6. An Eulerian circuit in a $6$-edge graph uses exactly $6$ edges.

### `math-15-21` — Hamiltonian graphs  · rewrite §5 · explain-only

**Connections (§1).**
> This lesson shifts from covering edges to covering vertices. A Hamiltonian path visits every vertex
> exactly once, and a Hamiltonian cycle also returns to the start. The definition is simple, but the
> problem is much harder than the Eulerian case. It is the graph-theoretic core of tour and ordering
> problems such as the traveling salesperson problem.

**Motivation & Intuition (§2).**
> Eulerian routes allow vertices to repeat as long as edges are used exactly once. Hamiltonian routes
> do the opposite: vertices are the scarce resource, so revisiting a vertex is not allowed. This makes
> the problem sensitive to the global arrangement of the graph.
>
> There is no simple parity test like the one for Eulerian graphs. A graph may have many vertices of
> large degree and still fail to contain a Hamiltonian cycle, while complete graphs have many such
> cycles. The lesson therefore focuses on the definitions and on contrasting vertex-covering routes
> with edge-covering routes.

**Definition & Assumptions (§3).** Explain-only: define Hamiltonian paths/cycles and contrast them with Eulerian trails. Mention that there is no simple degree-parity test like the Eulerian case.

**Symbols.** Hamiltonian path; Hamiltonian cycle; spanning cycle; $n$ vertices.

**Real-World Applications (§5).**
1. $C_5$ has a Hamiltonian cycle of length $5$.
2. $K_4$ has $3\cdot2\cdot1/2=3$ undirected Hamiltonian cycles.
3. Path $P_5$ has a Hamiltonian path with $4$ edges but no Hamiltonian cycle.
4. Star $K_{1,4}$ has no Hamiltonian path covering all leaves; it would need to revisit the center.
5. A TSP tour on $6$ cities is a Hamiltonian cycle with $6$ edges.
6. A complete graph $K_5$ has $4\cdot3\cdot2\cdot1/2=12$ undirected Hamiltonian cycles.

### `math-15-22` — The adjacency matrix  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson returns to graph representations and connects them to linear algebra. The adjacency
> matrix records edges as entries of a matrix. Multiplying the matrix by itself combines adjacent
> steps. That makes matrix powers a systematic way to count walks of a fixed length.

**Motivation & Intuition (§2).**
> An adjacency matrix answers a one-step question: whether vertex $i$ is connected to vertex $j$. A
> two-step walk from $i$ to $j$ must choose an intermediate vertex $k$. Matrix multiplication does
> exactly that kind of summation over possible intermediate choices.
>
> This is the main bridge between graphs and matrix methods. The entry $(A^2)_{ij}$ counts length-$2$
> walks, and the same reasoning extends by induction to $(A^k)_{ij}$. The graph has not changed, but
> the matrix representation lets algebra count routes through it.

**Definition & Assumptions (§3).** 1. $A_{ij}=1$ if there is an edge from $i$ to $j$, otherwise $0$. 2. The product $(A^2)_{ij}=\sum_k A_{ik}A_{kj}$. 3. Each term is $1$ exactly when $i\to k\to j$ is a length-$2$ walk. 4. Therefore $(A^2)_{ij}$ counts length-$2$ walks. 5. Inductively, $(A^k)_{ij}=\sum_r(A^{k-1})_{ir}A_{rj}$ counts length-$k$ walks.

**Symbols.** $A$ adjacency matrix; $A_{ij}$ entry; $A^k$ matrix power; walk length $k$.

**Real-World Applications (§5).**
1. For $K_3$, $A^2$ has diagonal entries $2$.
2. For $K_3$, off-diagonal entries of $A^2$ are $1$.
3. $\mathrm{tr}(A^3)/6=1$ triangle in $K_3$.
4. For path $1-2-3-4$, $(A^3)_{14}=1$.
5. Row sum of $A$ gives degrees $(2,2,2)$ in $K_3$.
6. Total sum of $A$ in $K_3$ is $6=2|E|$.

### `math-15-24` — Spectral graph theory  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson continues from the graph Laplacian. Once a graph is represented by a symmetric matrix,
> its eigenvalues and eigenvectors describe modes of variation on the vertices. The spectrum gives
> numerical information about connectivity and bottlenecks. This prepares the reader for spectral
> clustering and graph-based learning methods.

**Motivation & Intuition (§2).**
> The Laplacian energy measures how much a vertex signal changes across edges. Eigenvectors of the
> Laplacian give special signals whose variation is organized by the graph itself. Small eigenvalues
> correspond to smooth signals, while larger eigenvalues correspond to more rapidly varying patterns.
>
> The zero eigenvalue has a direct structural meaning. Since energy $0$ means no disagreement across
> any edge, the signal must be constant on each connected component. The second-smallest eigenvalue is
> therefore the first nonconstant mode in a connected graph, and it carries information about how
> strongly the graph holds together.

**Definition & Assumptions (§3).** 1. Since $L$ is symmetric for an undirected graph, it has real eigenvalues and orthogonal eigenvectors. 2. The energy identity gives $x^TLx\ge0$, so every eigenvalue is nonnegative. 3. The constant vector has $L\mathbf1=0$, so $0$ is always an eigenvalue. 4. The multiplicity of $0$ equals the number of connected components because energy $0$ means constant on each component. 5. The second-smallest eigenvalue measures the first nonconstant smooth mode.

**Symbols.** Eigenvalue $\lambda$; eigenvector $v$; spectrum; $\lambda_2$ algebraic connectivity; $L$ Laplacian.

**Real-World Applications (§5).**
1. Path $P_3$ has Laplacian eigenvalues $0,1,3$.
2. Therefore $\lambda_2=1$.
3. Star $K_{1,3}$ has eigenvalues $0,1,1,4$.
4. The star has one zero eigenvalue, so it is connected.
5. The largest star eigenvalue is $4$.
6. For $P_3$, condition ratio among nonzero Laplacian modes is $3/1=3$.

### `math-15-25` — Random graphs  · rewrite §5 · explain-only

**Connections (§1).**
> This lesson introduces probability into graph theory. A random graph model describes a distribution
> over possible graphs rather than one fixed graph. In $G(n,p)$, each possible edge is included
> independently with probability $p$. This gives a clean setting for expected edge counts, degrees,
> triangles, and isolated vertices.

**Motivation & Intuition (§2).**
> Random graphs are useful when the exact edge set is uncertain or when a simple baseline model is
> needed. Instead of asking whether one particular edge exists, the model assigns a probability to
> each possible edge. The simplest version treats all possible edges independently with the same
> probability.
>
> Many first computations use indicator variables and linearity of expectation. Each possible edge
> contributes probability $p$ to the expected edge count, each possible triangle contributes
> probability $p^3$, and each fixed vertex is isolated only if all its possible incident edges are
> absent. These calculations are expectations, not threshold theorems.

**Definition & Assumptions (§3).** Explain-only: define the model and compute expectations by linearity. Do not present threshold theorems as if derived in this lesson.

**Symbols.** $G(n,p)$; $n$ vertices; edge probability $p$; expected value $\mathbb E$; indicator variable.

**Real-World Applications (§5).**
1. In $G(10,0.2)$, expected edges are $\binom{10}{2}0.2=9$.
2. Expected degree of a vertex is $(10-1)0.2=1.8$.
3. Expected triangles are $\binom{10}{3}0.2^3=0.96$.
4. Probability a specific edge is absent is $0.8$.
5. Probability a fixed vertex is isolated is $0.8^9\approx0.134$.
6. Expected isolated vertices are $10\cdot0.8^9\approx1.342$.

### `math-15-26` — Spectral clustering  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson uses spectral graph theory for clustering. A good two-way split should cut relatively
> few edges while keeping the sides meaningful. Spectral clustering relaxes that discrete cut problem
> into an eigenvector problem. The Fiedler vector then gives a real-valued guide for separating the
> vertices.

**Motivation & Intuition (§2).**
> A cut can be encoded by assigning different labels to vertices on different sides. The Laplacian
> energy of that label vector is large when many edges cross the split, because cut edges connect
> vertices with different labels. Minimizing that energy would favor cuts with few crossing edges.
>
> The exact label problem is discrete and hard, so spectral clustering relaxes the labels to real
> numbers with normalization constraints. Under that relaxation, the Rayleigh quotient is minimized by
> the eigenvector for $\lambda_2$. Sorting or taking signs of that vector turns the relaxed solution
> back into a practical graph partition.

**Definition & Assumptions (§3).** 1. Encode a two-way split by a vector $x$ whose entries differ by side. 2. The Laplacian energy $x^TLx$ sums squared disagreements across edges, so only cut edges contribute heavily. 3. Exact discrete minimization is hard because $x$ is restricted to side labels. 4. Relax $x$ to real values, constrain it to be orthogonal to $\mathbf1$, and fix its length. 5. The Rayleigh quotient $x^TLx/x^Tx$ is minimized by the eigenvector for $\lambda_2$. 6. Split vertices by the signs or sorted values of that vector.

**Symbols.** Fiedler vector; $\lambda_2$; Rayleigh quotient; cut; relaxed labels.

**Real-World Applications (§5).**
1. For path $P_4$, eigenvalues are approximately $0,0.586,2,3.414$.
2. The Fiedler vector has signs $+,+,-,-$.
3. Splitting after vertex $2$ cuts $1$ edge.
4. Splitting $\{1\}$ from the rest also cuts $1$ edge but is less balanced.
5. The relaxed objective value is $\lambda_2\approx0.586$.
6. On two disconnected pairs, $\lambda_2=0$ and the exact split has cut size $0$.

### `math-15-27` — Graph neural networks & message passing  · AUTHOR derivation

**Connections (§1).**
> This lesson connects graph structure to learned representations. A graph neural network updates node
> features by sending messages along edges. The same local rule is shared across the graph, while the
> adjacency pattern decides which nodes exchange information. This brings together adjacency matrices,
> neighborhoods, smoothing, and modern graph-based machine learning.

**Motivation & Intuition (§2).**
> A node feature by itself describes one vertex, but many graph tasks depend on nearby context. In a
> citation graph, a paper is informed by neighboring papers; in a social graph, a user is informed by
> nearby users; in a molecule, an atom is informed by bonded atoms. Message passing is the mechanism
> for combining that local context.
>
> A basic layer aggregates neighbor features, includes the node's own feature through a self-loop, and
> applies shared learned weights. Matrix notation expresses the same operation for all vertices at
> once. Repeating layers expands the receptive field, so information can travel from immediate
> neighbors to two-hop and farther neighborhoods.

**Definition & Assumptions (§3).** 1. Give each node a feature vector $h_v^{(t)}$. 2. Collect neighbor messages by summing or averaging $h_u^{(t)}$ over $u\in N(v)$. 3. Include a self-loop so the node keeps its own information. 4. Apply a shared weight matrix and nonlinearity so the same rule works at every node. 5. In matrix form, one simple layer is $H^{(t+1)}=\sigma(\tilde D^{-1}\tilde A H^{(t)}W)$ for mean aggregation.

**Symbols.** $h_v$ node feature; $N(v)$ neighbors; $H$ feature matrix; $\tilde A=A+I$ self-loop adjacency; $\tilde D$ self-loop degree matrix; $W$ trainable weights; $\sigma$ activation.

**Real-World Applications (§5).**
1. On path $1-2-3$ with features $(1,2,4)$, self-loop mean aggregation gives node $1$: $(1+2)/2=1.5$.
2. Node $2$ gets $(1+2+4)/3=2.333$.
3. Node $3$ gets $(2+4)/2=3$.
4. Sum aggregation gives $(3,7,6)$.
5. With scalar weight $W=2$ and no activation, mean outputs become $(3,4.667,6)$.
6. Two hops let node $1$ receive information from node $3$ through node $2$, so its two-hop receptive-field size is $3$.

---

## Build order

1. **Start with `math-15-23`** and replace the leaked authoring filler with the Laplacian-energy derivation and the six verified Laplacian applications.
2. **Rewrite the shared §5 block in `math-15-18`…`math-15-26`** next, because it is the largest systemic defect and every replacement app above uses the lesson's own object.
3. **Author complete derivations** for `15-02,04,07,10,11,14,15,16,17,19,22,24,26,27` and the model `15-23`.
4. **Expand explain-only lessons** `15-01,03,05,06,08,09,12,13,18,20,21,25` with careful definitions, invariants, and worked checks without inventing fake proofs.
5. **Promote formulas to display math and add symbol glosses** across all 27 lessons.
6. **Final QA:** run lesson rendering, check that each §5 has exactly six applications, re-run the Python/numpy verification, and confirm no unclosed dollar delimiters or broken matrix row separators were introduced.
