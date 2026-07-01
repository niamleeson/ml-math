module.exports = {
  "math-15-01": {
    connectionsProse: "<p>This lesson begins with the basic language of graph theory: objects and the relationships between them. A graph separates vertices, which are the objects, from edges, which are the links. That separation makes the same structure easy to draw, store, or compute with. The lesson also prepares the reader for degree counts, paths, matrices, and algorithms, because all of those later ideas depend on choosing a clear representation.</p>",
    motivation: "<p>When a relationship dataset is small, a picture may be the easiest way to understand it. As soon as the graph is used in code, the same information has to be stored in a form that supports lookup, traversal, or matrix operations. Edge lists, adjacency lists, and adjacency matrices all describe the same graph, but they make different operations convenient.</p>" +
                "<p>The important habit is to separate the graph itself from its representation. The graph is the set of vertices and edges; the representation is the storage choice. An edge list is compact for listing relationships, adjacency lists are natural for walking through neighbors, and an adjacency matrix makes connection tests and linear-algebra operations direct.</p>",
    definition: "<p>A graph is a set of vertices together with edges between selected pairs of vertices. The same graph can be shown as an edge list, adjacency lists, or an adjacency matrix; for the four-edge graph, one representation is $E=\\{12,13,24,35\\}$.</p>" +
                "<p><b>Assumptions that matter:</b> The lesson defines equivalent representations, so there is no theorem to prove. Use the same four-edge graph as $E=\\{12,13,24,35\\}$, adjacency lists, and a $5\\times5$ matrix.</p>",
    symbols: [
      { sym: "$G=(V,E)$", desc: "graph" },
      { sym: "$V$", desc: "vertices" },
      { sym: "$E$", desc: "edges" },
      { sym: "$n=|V|$", desc: "number of vertices" },
      { sym: "$m=|E|$", desc: "number of edges" },
      { sym: "$A$", desc: "adjacency matrix" },
      { sym: "$A_{ij}=1$", desc: "if $ij\\in E$" }
    ],
    applications: [
      { title: "Edge-list storage", background: "Edge list storage records each edge once.", numbers: "$m=4$ records" },
      { title: "Adjacency-list storage", background: "Undirected adjacency lists store each edge at both endpoints.", numbers: "$2m=8$ neighbor entries" },
      { title: "Matrix storage", background: "The adjacency matrix stores one entry for each ordered vertex pair.", numbers: "The $5\\times5$ adjacency matrix has $25$ entries" },
      { title: "Matrix density", background: "Matrix density compares present off-diagonal entries with possible ones.", numbers: "$2m/[n(n-1)]=8/20=0.4$" },
      { title: "Neighbor lookup", background: "Vertex $1$ has neighbors $\\{2,3\\}$.", numbers: "lookup returns $2$ IDs" },
      { title: "Degree row sums", background: "Matrix row sums are degrees.", numbers: "$(2,2,2,1,1)$" }
    ]
  },
  "math-15-02": {
    connectionsProse: "<p>This lesson builds on the idea that edges touch vertices. The degree of a vertex turns that local picture into a number: how many edges meet at that vertex. Once every vertex has a degree, the whole graph has a simple global check. The handshake lemma is one of the first examples of a graph fact that follows from counting the same structure in two ways.</p>",
    motivation: "<p>Degree is local, but degree sums are global. If one vertex has degree $3$, that means three edge-ends touch it. Adding degrees across all vertices counts all of those edge-ends throughout the graph.</p>" +
                "<p>In an undirected graph, every edge has two endpoints. That means each edge contributes exactly two to the total degree count. This explains both the formula $\\sum_v \\deg(v)=2|E|$ and the useful parity check that odd-degree vertices must occur in pairs.</p>",
    definition: "<p>The handshake lemma says that in an undirected graph, the sum of all vertex degrees equals twice the number of edges.</p>" +
                "<p>$$\\sum_{v\\in V}d(v)=2|E|$$</p>" +
                "<p><b>Assumptions that matter:</b> Edges are undirected and each edge has exactly two endpoints, so every edge contributes two incidences.</p>",
    symbols: [
      { sym: "$d(v)$", desc: "degree of vertex $v$" },
      { sym: "$\\deg(v)$", desc: "degree of vertex $v$" },
      { sym: "$|E|=m$", desc: "number of edges" },
      { sym: "incidence", desc: "an edge-end touching a vertex" }
    ],
    derivation: [
      { do: "Let $d(v)$ count incident edges at vertex $v$.", result: "$d(v)$", why: "degree is local edge count" },
      { do: "Sum $d(v)$ over all vertices.", result: "$\\sum_{v\\in V}d(v)$", why: "this counts incidences" },
      { do: "Count the contribution of one undirected edge.", result: "$2$ incidences", why: "each undirected edge has exactly two endpoints" },
      { do: "Replace the incidence count by the edge count.", result: "$\\sum_{v\\in V}d(v)=2|E|$", why: "each edge contributes exactly two incidences" },
      { do: "Use parity of the total degree sum.", result: "the number of odd-degree vertices is even", why: "the sum is even" }
    ],
    applications: [
      { title: "Recover edge count", background: "Degrees $(3,2,2,1)$ sum to $8$.", numbers: "$m=4$" },
      { title: "Average degree", background: "The same degree sum over four vertices gives average degree.", numbers: "$8/4=2$" },
      { title: "Odd-degree parity", background: "Odd-degree vertices are the vertices with odd entries in the sequence.", numbers: "the two vertices of degrees $3$ and $1$" },
      { title: "Degree sequence edge count", background: "A graph with degree sequence $(3,3,2,2,2)$ has sum $12$.", numbers: "$m=6$" },
      { title: "Impossible parity", background: "A proposed degree sequence cannot have odd total degree.", numbers: "summing to $9$ is impossible" },
      { title: "Tree degree sum", background: "In a tree with $n=7$, the edge count is $m=6$.", numbers: "degree sum must be $12$" }
    ]
  },
  "math-15-03": {
    connectionsProse: "<p>This lesson follows naturally after graphs and degrees, because it asks what it means to move through a graph. A walk is any sequence of adjacent steps, while a path is a walk with no repeated vertices. That distinction supports later lessons on reachability, shortest paths, cycles, and matrix powers. It also gives precise language for routes that are allowed to revisit places and routes that are not.</p>",
    motivation: "<p>In many graph problems, moving from one vertex to another is the basic operation. Sometimes repeated vertices are harmless, as in a random walk or a process that can return to a previous state. Other times repetition is exactly what we want to avoid, as in a simple route or a shortest path in an unweighted graph.</p>" +
                "<p>The load-bearing distinction is that walks are flexible and paths are simple. Walks are useful for counting all possible step sequences, especially with adjacency matrices. Paths are useful for distances, connectivity, and cycle definitions because they show that vertices can be connected without unnecessary repeats.</p>",
    definition: "<p>A walk is a sequence $v_0,v_1,\\ldots,v_k$ in which consecutive vertices are adjacent, and its length is $k$. A path is a walk with no repeated vertices.</p>" +
                "<p><b>Assumptions that matter:</b> Path and walk are definitions. Use adjacency powers later for counting walks; do not pretend the definition itself has a proof.</p>",
    symbols: [
      { sym: "$v_0,v_1,\\ldots,v_k$", desc: "walk" },
      { sym: "$k$", desc: "length" },
      { sym: "path", desc: "walk with no repeated vertices" },
      { sym: "$v_0,v_k$", desc: "endpoints" }
    ],
    applications: [
      { title: "Simple path", background: "In path graph $1-2-3-4$, there is one length-$3$ path from $1$ to $4$.", numbers: "one length-$3$ path" },
      { title: "Two-step walk count", background: "In the same graph, the adjacency-square entry counts two-step walks.", numbers: "$(A^2)_{13}=1$" },
      { title: "Three-step walk count", background: "The adjacency-cube entry counts three-step walks.", numbers: "$(A^3)_{14}=1$" },
      { title: "Walk that is not a path", background: "Walk $1,2,1,2$ repeats vertices.", numbers: "length $3$ but is not a path" },
      { title: "Distance", background: "Distance from $1$ to $4$ is the length of the shortest path.", numbers: "$3$" },
      { title: "Closed route", background: "A route $1,2,3,2,1$ returns to its start.", numbers: "length $4$ and endpoints both $1$" }
    ]
  },
  "math-15-04": {
    connectionsProse: "<p>This lesson extends paths by allowing a route to close back on itself. A cycle is a closed path, so it captures the first kind of redundancy in a graph. Earlier ideas about paths and connectivity explain why a cycle gives an alternate way around. Later lessons use cycles to understand trees, spanning trees, coloring, planarity, and algorithms.</p>",
    motivation: "<p>A connected graph can have just enough edges to hold together, or it can have extra edges. The extra edges are important because they create routes that return to where they started. That closed structure means one edge on the cycle is not essential for reachability between its endpoints.</p>" +
                "<p>Cycle rank measures how many independent redundancies a connected graph has beyond a tree. A tree on $n$ vertices uses $n-1$ edges, so every additional independent edge creates one independent cycle. This makes $m-n+1$ a compact count of how far a connected graph is from being acyclic.</p>",
    definition: "<p>A cycle is a closed path. For a connected graph, the cycle rank counts independent redundancies beyond a tree.</p>" +
                "<p>$$m-n+1$$</p>" +
                "<p><b>Assumptions that matter:</b> The formula stated here is for one connected component, with $n=|V|$ and $m=|E|$.</p>",
    symbols: [
      { sym: "Cycle", desc: "closed path" },
      { sym: "$n=|V|$", desc: "number of vertices" },
      { sym: "$m=|E|$", desc: "number of edges" },
      { sym: "$m-n+1$", desc: "cycle rank for one connected component" }
    ],
    derivation: [
      { do: "Start with a connected graph with $n$ vertices.", result: "at least $n-1$ edges", why: "that many edges are needed to connect all vertices" },
      { do: "Compare with a tree.", result: "$n-1$ edges and no cycle", why: "a tree is minimally connected" },
      { do: "Add one extra edge to a tree.", result: "one closed route", why: "the tree already has a path between the edge's endpoints" },
      { do: "Count independent extra edges.", result: "one independent cycle per independent extra edge", why: "each extra edge creates one independent redundancy" },
      { do: "Subtract the tree edge count from $m$.", result: "$m-n+1$", why: "these are the edges beyond a tree" }
    ],
    applications: [
      { title: "Cycle size", background: "$C_5$ has $5$ vertices and $5$ edges.", numbers: "$5$ vertices and $5$ edges" },
      { title: "Cycle degree sum", background: "Each vertex of $C_5$ has degree $2$.", numbers: "degree sum is $10$" },
      { title: "Cycle rank", background: "$C_5$ has one independent cycle.", numbers: "$5-5+1=1$" },
      { title: "Diagonal redundancy", background: "A square with one diagonal has $n=4,m=5$.", numbers: "cycle rank $2$" },
      { title: "Breaking a cycle", background: "Removing one edge from $C_5$ leaves a path.", numbers: "$4$ edges" },
      { title: "Triangle", background: "A triangle is the shortest cycle.", numbers: "cycle length $3$" }
    ]
  },
  "math-15-05": {
    connectionsProse: "<p>This lesson uses paths to define when a graph is in one piece. If every vertex can reach every other vertex, the graph is connected. If not, the connected components are the separate maximal pieces. This language is used by traversal algorithms, spanning trees, Laplacians, and spectral tests for connectedness.</p>",
    motivation: "<p>Reachability is one of the most basic questions a graph can answer. Two vertices may be in the same dataset and still have no path between them. Components organize this situation by grouping together exactly the vertices that can reach each other.</p>" +
                "<p>The word maximal matters. A component is not just any connected subgraph; it is a connected piece that cannot be enlarged without losing connectedness. Algorithms such as BFS or DFS find components by starting at one vertex, exploring everything reachable from it, and then repeating from an unvisited vertex if needed.</p>",
    definition: "<p>A graph is connected when every vertex can reach every other vertex by a path. A connected component is a maximal connected piece, and $c(G)$ counts the components.</p>" +
                "<p><b>Assumptions that matter:</b> Connectedness and connected components are definitions. The lesson should explain maximality and why algorithms find components by exploring all reachable vertices.</p>",
    symbols: [
      { sym: "Connected graph", desc: "a graph in which every vertex can reach every other vertex" },
      { sym: "component", desc: "maximal connected piece" },
      { sym: "reachable", desc: "connected by a path" },
      { sym: "bridge edge", desc: "edge whose removal can increase the number of components" },
      { sym: "$c(G)$", desc: "number of components" }
    ],
    applications: [
      { title: "Component sizes", background: "Edges $12,23,45$ split the graph into two pieces.", numbers: "component sizes $3$ and $2$" },
      { title: "Component count", background: "The disconnected example has two components.", numbers: "$c(G)=2$" },
      { title: "Connecting components", background: "Adding edge $34$ joins the two pieces.", numbers: "$c(G)=1$" },
      { title: "Bridge removal", background: "Removing bridge $23$ from path $1-2-3$ disconnects it.", numbers: "$2$ components" },
      { title: "Connected BFS", background: "In a connected $5$-vertex graph, BFS from one vertex reaches all vertices.", numbers: "$5$ vertices" },
      { title: "Disconnected BFS", background: "In the disconnected example, BFS from $1$ reaches only its component.", numbers: "$3$ vertices" }
    ]
  },
  "math-15-06": {
    connectionsProse: "<p>This lesson combines connectivity and cycles. A tree is connected enough to hold all vertices together, but sparse enough to have no cycles. That makes trees the minimal connected graphs. They are the reference point for spanning trees, traversal trees, recursion, and many proofs by induction on graphs.</p>",
    motivation: "<p>A connected graph can contain redundant routes, but a tree has none. Between any two vertices there is exactly one path, so removing an edge separates the graph. This is why trees are useful whenever the goal is to preserve reachability with no extra edges.</p>" +
                "<p>The standard characterizations all describe the same structure from different angles. Connected and acyclic emphasizes the definition, unique paths emphasize navigation, and $m=n-1$ emphasizes the edge count. Together they make trees a bridge between graph structure and simple counting.</p>",
    definition: "<p>A tree is a graph that is connected and acyclic. Equivalently, there is a unique path between any two vertices, and a tree with $n$ vertices has $m=n-1$ edges.</p>" +
                "<p><b>Assumptions that matter:</b> The lesson should present the equivalent characterizations and explain them, not fake a proof.</p>",
    symbols: [
      { sym: "Tree", desc: "connected acyclic graph" },
      { sym: "leaf", desc: "vertex with degree $1$" },
      { sym: "root", desc: "chosen starting vertex when oriented" },
      { sym: "parent/child", desc: "oriented tree relationship" },
      { sym: "$n$", desc: "vertices" },
      { sym: "$m$", desc: "edges" }
    ],
    applications: [
      { title: "Tree edge count", background: "A tree with $7$ vertices has one fewer edge.", numbers: "$6$ edges" },
      { title: "Tree degree sum", background: "The degree sum is twice the edge count.", numbers: "$12$" },
      { title: "Path leaves", background: "Path $P_7$ has leaves only at its endpoints.", numbers: "$2$ leaves" },
      { title: "Star leaves", background: "Star $K_{1,6}$ has all noncenter vertices as leaves.", numbers: "$6$ leaves" },
      { title: "Unique path", background: "The unique path between two leaves in $P_7$ runs through the whole path.", numbers: "length $6$" },
      { title: "Adding redundancy", background: "Adding one edge to a $7$-vertex tree creates one independent cycle.", numbers: "cycle rank $1$" }
    ]
  },
  "math-15-07": {
    connectionsProse: "<p>This lesson builds from trees to connected graphs that may contain cycles. A spanning tree keeps every vertex but removes the cycle edges that are not needed for connectivity. It is a way to extract a minimal connected backbone from a larger graph. This idea prepares the reader for minimum spanning trees, network design, and cycle-rank reasoning.</p>",
    motivation: "<p>A connected graph often contains more edges than are needed just to keep all vertices reachable. Those extra edges may be useful in the original network, but if the goal is only connectivity, they can be removed carefully. A spanning tree is what remains when all redundancy has been discarded without losing any vertex.</p>" +
                "<p>The key operation is removing an edge from a cycle. The rest of the cycle still connects the removed edge's endpoints, so the graph stays connected. Repeating this operation eventually leaves a connected graph with no cycles, which is exactly a tree spanning all vertices.</p>",
    definition: "<p>A spanning tree of a connected graph is a subgraph that includes all vertices and is a tree. It therefore has $n-1$ edges.</p>" +
                "<p><b>Assumptions that matter:</b> The starting graph is connected, and removing an edge from a cycle preserves connectivity.</p>",
    symbols: [
      { sym: "Spanning tree", desc: "tree subgraph that includes all vertices" },
      { sym: "spanning", desc: "includes all vertices" },
      { sym: "tree edge", desc: "edge kept in the spanning tree" },
      { sym: "non-tree edge", desc: "edge not kept in the spanning tree" },
      { sym: "$\\tau(G)$", desc: "number of spanning trees" }
    ],
    derivation: [
      { do: "Start with any connected graph.", result: "all vertices are reachable", why: "the graph is connected" },
      { do: "If there is a cycle, remove one edge from that cycle.", result: "one fewer edge", why: "the rest of the cycle still connects its endpoints" },
      { do: "Check connectivity after the removal.", result: "connectivity is preserved", why: "the removed edge's endpoints still have an alternate route" },
      { do: "Repeat until no cycles remain.", result: "connected and acyclic graph", why: "each removal decreases the edge count while preserving connectivity" },
      { do: "Recognize the final graph.", result: "a spanning tree with $n-1$ edges", why: "it is connected, acyclic, and includes all vertices" }
    ],
    applications: [
      { title: "Spanning-tree edge count", background: "Any spanning tree on $5$ vertices has one fewer edge.", numbers: "$4$ edges" },
      { title: "Cayley count", background: "$K_4$ has $4^{4-2}$ spanning trees.", numbers: "$16$ spanning trees" },
      { title: "Cycle spanning trees", background: "A cycle $C_5$ has one spanning tree per removed edge.", numbers: "$5$ spanning trees" },
      { title: "Already a tree", background: "A graph that is already a tree has no cycle edge to choose.", numbers: "$1$ spanning tree" },
      { title: "Square with diagonal", background: "A square with one diagonal has several spanning backbones.", numbers: "$8$ spanning trees" },
      { title: "Removing redundancy", background: "Removing two cycle edges from a connected $6$-vertex, $7$-edge graph reaches.", numbers: "$5$ tree edges" }
    ]
  },
  "math-15-08": {
    connectionsProse: "<p>This lesson turns reachability into an algorithm. Breadth-first search starts at one source vertex and explores the graph layer by layer. The layers match unweighted distances from the source. This prepares the reader for shortest paths, components, recommendation neighborhoods, and traversal trees.</p>",
    motivation: "<p>When every edge has the same cost, the shortest way to reach a vertex is the one with the fewest edges. BFS respects that structure by visiting all neighbors first, then all vertices two steps away, then all vertices three steps away, and so on. The queue enforces this layer order.</p>" +
                "<p>The main invariant is that vertices at distance $k$ are processed before vertices at distance $k+1$. Therefore, when BFS first discovers a vertex, no shorter unweighted route to it is still waiting to be found. The predecessor links recorded during discovery form a shortest-path tree for all reached vertices.</p>",
    definition: "<p>Breadth-first search starts from a source $s$, uses a queue, and processes vertices layer by layer. The key invariant is that all vertices at distance $k$ are processed before vertices at distance $k+1$.</p>" +
                "<p><b>Assumptions that matter:</b> Edges are unweighted, so first discovery gives shortest unweighted distance.</p>",
    symbols: [
      { sym: "$s$", desc: "source" },
      { sym: "queue", desc: "first-in, first-out structure that enforces layer order" },
      { sym: "layer", desc: "vertices at the same distance from the source" },
      { sym: "$d(v)$", desc: "distance to vertex $v$" },
      { sym: "$p(v)$", desc: "predecessor of vertex $v$" }
    ],
    applications: [
      { title: "BFS distances", background: "With edges $sa,sb,ac,bd,ce$, BFS layers give.", numbers: "$d(s)=0,d(a)=1,d(b)=1,d(c)=2,d(d)=2,d(e)=3$" },
      { title: "Shortest path", background: "The shortest $s\\to e$ path follows the layers.", numbers: "length $3$" },
      { title: "Layer size", background: "Layer $2$ contains vertices $c$ and $d$.", numbers: "$2$ vertices" },
      { title: "Two-hop recommendation", background: "A two-hop friend recommendation from $s$ returns $\\{c,d\\}$.", numbers: "count $2$" },
      { title: "BFS tree", background: "The BFS tree has one fewer edge than reached vertices.", numbers: "$5$ edges for $6$ reached vertices" },
      { title: "Discovery order", background: "Vertex $e$ is discovered after $c$.", numbers: "because it is in layer $3$" }
    ]
  },
  "math-15-09": {
    connectionsProse: "<p>This lesson introduces the other basic graph traversal. Depth-first search follows one path as far as possible before backtracking. That different exploration order reveals structure that BFS does not emphasize, such as recursion stacks, back edges, and finish times. DFS becomes a tool for components, cycle detection, and topological ordering.</p>",
    motivation: "<p>DFS is useful when a graph problem depends on nested exploration. The algorithm commits to a branch, records what is currently on the recursion stack, and only returns when no unexplored outgoing step remains. This makes the history of the search part of the information it discovers.</p>" +
                "<p>In directed graphs, a back edge to a vertex still on the stack signals a cycle because the current path can return to an ancestor. In a DAG, no such back edge exists, and reverse finish order places each prerequisite before the vertices that depend on it. The same traversal idea therefore supports both detecting cycles and ordering acyclic dependencies.</p>",
    definition: "<p>Depth-first search follows one path as far as possible before backtracking, maintaining discovery times, finish times, and a recursion stack.</p>" +
                "<p><b>Assumptions that matter:</b> DFS maintains a recursion stack; a back edge to the stack signals a directed cycle, and reverse finish order gives a topological order in a DAG.</p>",
    symbols: [
      { sym: "Discovery time", desc: "time when a vertex is first reached" },
      { sym: "finish time", desc: "time when all outgoing exploration from a vertex is complete" },
      { sym: "recursion stack", desc: "currently active DFS path" },
      { sym: "tree edge", desc: "edge used to discover a new vertex" },
      { sym: "back edge", desc: "edge to a vertex still on the recursion stack" },
      { sym: "topological order", desc: "ordering of a DAG with prerequisites before dependents" }
    ],
    applications: [
      { title: "Topological order", background: "In DAG $A\\to B,A\\to C,B\\to D,C\\to D$, DFS can output topological order.", numbers: "$A,B,C,D$ with $4$ vertices" },
      { title: "Stack depth", background: "The recursion stack length can reach $3$ on path.", numbers: "$A\\to B\\to D$" },
      { title: "Back-edge cycle", background: "A back edge $D\\to B$ creates.", numbers: "one directed cycle" },
      { title: "Multiple components", background: "DFS over two components starts.", numbers: "$2$ root calls" },
      { title: "DFS tree size", background: "A DFS tree on $6$ reached vertices has.", numbers: "$5$ tree edges" },
      { title: "Undirected triangle", background: "In an undirected triangle, DFS finds.", numbers: "$1$ non-tree edge completing the cycle" }
    ]
  },
  "math-15-10": {
    connectionsProse: "<p>This lesson moves from unweighted distance to weighted shortest paths. Dijkstra's algorithm applies when edge weights are nonnegative. It keeps tentative distances and gradually settles vertices whose shortest distances are known. The method builds on paths, relaxation, and the idea that a shortest route can be extended edge by edge.</p>",
    motivation: "<p>In a weighted graph, the closest vertex is not necessarily the one with the fewest edges from the source. The algorithm therefore tracks the best distance found so far for each vertex. Relaxing an edge means checking whether a route through the current vertex improves that tentative value.</p>" +
                "<p>The nonnegative-weight assumption is what makes settling safe. Once the unsettled vertex with smallest tentative distance is chosen, any future route to it would have to pass through another unsettled vertex and then add nonnegative cost. That future route cannot be shorter, so the current distance can be finalized.</p>",
    definition: "<p>Dijkstra's algorithm keeps tentative distances, repeatedly settles the unsettled vertex with smallest tentative distance, and relaxes outgoing edges.</p>" +
                "<p>$$d(v)\\leftarrow\\min(d(v),d(u)+w(u,v))$$</p>" +
                "<p><b>Assumptions that matter:</b> All edge weights are nonnegative, so settling the smallest tentative distance is safe.</p>",
    symbols: [
      { sym: "$d(v)$", desc: "tentative distance" },
      { sym: "$w(u,v)$", desc: "edge weight" },
      { sym: "relaxation", desc: "updating a tentative distance through an edge" },
      { sym: "priority queue", desc: "data structure for choosing the smallest tentative distance" },
      { sym: "settled vertex", desc: "vertex whose shortest distance is finalized" }
    ],
    derivation: [
      { do: "Initialize tentative distances.", result: "$d(s)=0$ and others $\\infty$", why: "the source is reached with cost zero and all other costs are unknown" },
      { do: "Choose the unsettled vertex $u$ with smallest $d(u)$.", result: "$u$ is next", why: "it is currently the closest unsettled vertex" },
      { do: "Use the nonnegative-weight assumption.", result: "any later route to $u$ is at least as long as the current best", why: "a later route must add nonnegative cost after reaching another unsettled vertex" },
      { do: "Settle $u$.", result: "$d(u)$ is final", why: "no shorter route can appear later" },
      { do: "Relax every edge $u\\to v$.", result: "$d(v)\\leftarrow\\min(d(v),d(u)+w(u,v))$", why: "a route through $u$ may improve the best known distance to $v$" },
      { do: "Repeat.", result: "all needed vertices are settled", why: "each step finalizes one shortest distance" }
    ],
    applications: [
      { title: "Shortest to $a$", background: "In graph $s\\to a=2,s\\to b=5,a\\to b=1,a\\to c=2,b\\to c=1,c\\to d=1,b\\to d=3$.", numbers: "shortest $d(a)=2$" },
      { title: "Relaxing $a\\to b$", background: "The route through $a$ improves the old tentative value.", numbers: "changes $d(b)$ from $5$ to $3$" },
      { title: "Shortest to $c$", background: "The best route to $c$ has cost.", numbers: "$d(c)=4$" },
      { title: "Shortest to $d$", background: "The best route to $d$ has cost.", numbers: "$d(d)=5$" },
      { title: "Path cost", background: "Path $s,a,c,d$ has cost.", numbers: "$2+2+1=5$" },
      { title: "Settled order", background: "The settled order is.", numbers: "$s,a,b,c,d$, five vertices" }
    ]
  },
  "math-15-11": {
    connectionsProse: "<p>This lesson keeps the shortest-path goal but relaxes the weight assumption. Bellman–Ford can handle negative edge weights as long as reachable negative cycles are absent. It does this by repeated relaxation rather than by permanently settling the nearest vertex. The lesson prepares the reader for graphs where costs, credits, or adjustments may be negative.</p>",
    motivation: "<p>Negative edges break the reasoning used by Dijkstra's algorithm. A vertex that looks settled could later be improved by a path that uses a negative edge. Bellman–Ford avoids that problem by allowing improvements to propagate gradually through paths with more and more edges.</p>" +
                "<p>The core observation is that, without a negative cycle, a shortest path can be taken to be simple. A simple path on $n$ vertices has at most $n-1$ edges. After enough full passes of edge relaxation, every such path length has had a chance to influence the distances, and any further improvement indicates a reachable negative cycle.</p>",
    definition: "<p>Bellman–Ford repeatedly relaxes all edges to find shortest paths even when some edge weights are negative.</p>" +
                "<p>$$d(v)\\leftarrow\\min(d(v),d(u)+w)$$</p>" +
                "<p><b>Assumptions that matter:</b> Reachable negative cycles are absent when shortest distances are to be returned; an improvement after $n-1$ passes signals a reachable negative cycle.</p>",
    symbols: [
      { sym: "$n=|V|$", desc: "number of vertices" },
      { sym: "$(u,v,w)$", desc: "edge from $u$ to $v$ with weight $w$" },
      { sym: "$d(v)\\leftarrow\\min(d(v),d(u)+w)$", desc: "relaxation" },
      { sym: "negative cycle", desc: "cycle with negative total weight" }
    ],
    derivation: [
      { do: "Consider a shortest simple path.", result: "at most $n-1$ edges", why: "repeating a vertex would create a removable cycle unless a negative cycle exists" },
      { do: "Make one full pass over all edges.", result: "all shortest paths using one edge are correct", why: "each one-edge route has been relaxed" },
      { do: "Repeat for $k$ passes.", result: "all shortest paths using at most $k$ edges are correct", why: "each pass extends correct paths by one edge" },
      { do: "Run $n-1$ passes.", result: "every simple shortest path is covered", why: "a simple path has at most $n-1$ edges" },
      { do: "Check for a further improvement.", result: "a negative cycle is reachable", why: "no simple shortest path should still improve after $n-1$ passes" }
    ],
    applications: [
      { title: "Shortest to $a$", background: "With $s\\to a=4,s\\to b=5,a\\to b=-2,b\\to c=3,a\\to c=4$.", numbers: "final $d(a)=4$" },
      { title: "Negative-edge relaxation", background: "Relaxing $a\\to b$ gives.", numbers: "$d(b)=2$" },
      { title: "Shortest to $c$", background: "Then the best route to $c$ goes through $b$.", numbers: "$d(c)=5$" },
      { title: "Rejected direct route", background: "Direct $a\\to c$ gives cost.", numbers: "$8$, so it is not chosen" },
      { title: "Pass count", background: "For $4$ vertices, Bellman–Ford uses.", numbers: "$3$ main passes" },
      { title: "Negative-cycle detection", background: "If an extra edge $c\\to a=-10$ improves after pass $3$.", numbers: "a negative cycle is detected" }
    ]
  },
  "math-15-12": {
    connectionsProse: "<p>This lesson adds weights to spanning trees. A minimum spanning tree connects every vertex while minimizing total edge weight. It keeps the same tree structure as before, but now every edge has a cost. The idea supports network design, clustering, approximation algorithms, and greedy methods such as Kruskal and Prim.</p>",
    motivation: "<p>A spanning tree answers the question of how to connect all vertices with no redundant edges. In a weighted graph, there may be many spanning trees, and some are cheaper than others. The minimum spanning tree chooses the connected backbone with least total cost.</p>" +
                "<p>The cut property explains why greedy algorithms can be trusted. If a cut separates the vertices into two sides, any spanning tree must cross that cut at least once. Choosing the lightest available crossing edge is safe because a more expensive crossing edge can be exchanged without increasing the total weight.</p>",
    definition: "<p>A minimum spanning tree is a spanning tree of a weighted connected graph with minimum possible total edge weight.</p>" +
                "<p><b>Assumptions that matter:</b> For any cut, the lightest edge crossing that cut is safe to add to some MST. Use this to justify Kruskal and Prim rather than proving the full theorem here.</p>",
    symbols: [
      { sym: "Weighted graph", desc: "graph whose edges have weights" },
      { sym: "spanning tree", desc: "tree that includes all vertices" },
      { sym: "total weight", desc: "sum of chosen edge weights" },
      { sym: "cut", desc: "partition of the vertices into two sides" },
      { sym: "safe edge", desc: "edge that can be added to some MST" },
      { sym: "MST", desc: "minimum spanning tree" }
    ],
    applications: [
      { title: "Kruskal total", background: "Kruskal choosing weights $1,2,3$ gives.", numbers: "MST total $6$" },
      { title: "MST edge count", background: "A $4$-vertex MST has.", numbers: "$3$ edges" },
      { title: "Cycle skip", background: "If edge weights are $1,2,3,10$, the $10$ edge is skipped.", numbers: "when it closes a cycle" },
      { title: "Exchange cost", background: "Replacing a chosen edge of weight $3$ by crossing edge $5$ raises total by.", numbers: "$2$" },
      { title: "Complete graph candidate", background: "A complete graph $K_4$ candidate MST still uses only.", numbers: "$3$ of $6$ edges" },
      { title: "Disconnected input", background: "A disconnected two-component input has no MST.", numbers: "it has $2$ component trees instead" }
    ]
  },
  "math-15-13": {
    connectionsProse: "<p>This lesson changes the role of edges from connections to channels with capacity. A network flow sends quantity from a source to a sink while respecting those capacities. Intermediate vertices conserve flow, so they pass along what they receive. This language prepares the reader for cuts, max flow, bipartite matching, and routing problems.</p>",
    motivation: "<p>Many networks carry something: data packets, vehicles, water, tasks, or matched assignments. Each edge has a limit, and the total amount sent from the source to the sink depends on how these limits interact. A valid flow must never exceed an edge's capacity.</p>" +
                "<p>The second rule is conservation. Except at the source and sink, a vertex is not allowed to create or destroy flow; inflow must equal outflow. The value of the flow is then measured at the source or sink, giving a single number for how much the network successfully transports.</p>",
    definition: "<p>A network flow assigns flow $f(e)$ to directed edges with capacities $c(e)$, respecting capacity constraints and conservation at intermediate vertices. The value $|f|$ is the total net flow leaving the source.</p>" +
                "<p><b>Assumptions that matter:</b> Define capacity constraints and flow conservation, then show the value as total flow leaving the source. The theorem connecting flows to cuts is in the next lesson.</p>",
    symbols: [
      { sym: "$s$", desc: "source" },
      { sym: "$t$", desc: "sink" },
      { sym: "$c(e)$", desc: "capacity of edge $e$" },
      { sym: "$f(e)$", desc: "flow on edge $e$" },
      { sym: "conservation", desc: "inflow equals outflow at intermediate vertices" },
      { sym: "$|f|$", desc: "value of the flow" }
    ],
    applications: [
      { title: "Two-path flow", background: "Two paths carrying $2$ and $2$ units give.", numbers: "flow value $4$" },
      { title: "Residual capacity", background: "Edge capacity $3$ with flow $2$ has.", numbers: "residual capacity $1$" },
      { title: "Conservation", background: "Conservation at vertex $a$ with inflow $2$ requires.", numbers: "outflow $2$" },
      { title: "Net source value", background: "Source outflow $5$ and inflow $1$ gives.", numbers: "value $4$" },
      { title: "Bottleneck", background: "A bottleneck edge of capacity $2$ limits that path to.", numbers: "$2$" },
      { title: "Augmentation", background: "Augmenting by residual amount $1$ raises total flow.", numbers: "from $4$ to $5$" }
    ]
  },
  "math-15-14": {
    connectionsProse: "<p>This lesson pairs flows with cuts. A cut separates the source from the sink, so every unit of flow must cross from the source side to the sink side somewhere. That makes cut capacity an upper bound on possible flow. The max-flow min-cut theorem explains when this upper bound is exactly attainable.</p>",
    motivation: "<p>A flow is a constructive object: it shows how much can be sent. A cut is an obstruction: it shows a boundary that all source-to-sink traffic must cross. If the total capacity across that boundary is small, no routing strategy can push more flow through the network than the cut allows.</p>" +
                "<p>The theorem says that the best construction and the tightest obstruction meet. When no augmenting path remains in the residual graph, the vertices still reachable from the source define a cut. Its capacity equals the current flow value, proving at the same time that the flow is maximum and the cut is minimum.</p>",
    definition: "<p>The max-flow min-cut theorem says that the maximum value of an $s$-$t$ flow equals the minimum capacity of an $s$-$t$ cut.</p>" +
                "<p>$$\\max |f|=\\min c(S,T)$$</p>" +
                "<p><b>Assumptions that matter:</b> The cut partitions vertices into $S$ and $T$ with $s\\in S,t\\in T$, and the residual graph has no augmenting path at optimality.</p>",
    symbols: [
      { sym: "$(S,T)$", desc: "cut" },
      { sym: "$c(S,T)$", desc: "cut capacity" },
      { sym: "residual graph", desc: "graph of remaining augmenting possibilities" },
      { sym: "augmenting path", desc: "residual path that can increase flow" },
      { sym: "max flow", desc: "flow with maximum possible value" }
    ],
    derivation: [
      { do: "Partition vertices into $S$ and $T$.", result: "$s\\in S,t\\in T$", why: "this defines an $s$-$t$ cut" },
      { do: "Measure net flow leaving $S$.", result: "the value of the flow", why: "conservation cancels flow through intermediate vertices inside $S$" },
      { do: "Compare net flow with crossing capacities.", result: "net flow leaving $S\\le c(S,T)$", why: "flow on each edge from $S$ to $T$ cannot exceed capacity" },
      { do: "Apply this to every cut.", result: "every cut capacity upper-bounds every flow value", why: "all $s$-$t$ flow must cross the cut" },
      { do: "Stop when no augmenting path remains.", result: "reachable residual vertices define a cut whose capacity equals the current flow", why: "all forward crossing residual capacity has been exhausted" },
      { do: "Match the lower and upper bounds.", result: "maximum flow equals minimum cut capacity", why: "the current flow reaches a cut upper bound" }
    ],
    applications: [
      { title: "Cut capacity", background: "Cut capacities $3$ and $2$ sum to.", numbers: "$5$" },
      { title: "Optimality certificate", background: "A flow of value $5$ proves.", numbers: "that cut is minimum" },
      { title: "Upper bound", background: "No flow can exceed.", numbers: "$5$ across that cut" },
      { title: "Residual augment", background: "If the current flow is $4$, one residual augment of $1$ can reach.", numbers: "$5$" },
      { title: "Disconnecting cut", background: "Removing the two cut edges disconnects $s$ from $t$ with.", numbers: "capacity loss $5$" },
      { title: "Matching via flow", background: "In bipartite matching, a max flow of $3$ gives.", numbers: "matching size $3$" }
    ]
  },
  "math-15-15": {
    connectionsProse: "<p>This lesson studies graphs whose vertices split into two types. In a bipartite graph, every edge crosses between the two parts and no edge stays inside one part. That structure appears in user-item data, assignment problems, and matching. It also connects graph coloring to the absence of odd cycles.</p>",
    motivation: "<p>When relationships always join two different kinds of objects, a bipartite graph is the natural model. Users connect to items, students to projects, and workers to tasks. The two-side structure prevents triangles and, more generally, prevents every odd cycle.</p>" +
                "<p>Parity is the central idea. Along a cycle in a bipartite graph, the vertices must alternate sides, so returning to the starting side takes an even number of steps. Conversely, if no odd cycle exists, distance parity from a root consistently assigns vertices to two sides in each component.</p>",
    definition: "<p>A graph is bipartite when its vertices can be split into parts $L$ and $R$ so every edge crosses between the parts. Equivalently, it has no odd cycle.</p>" +
                "<p><b>Assumptions that matter:</b> The parity assignment is made within each component from a chosen root.</p>",
    symbols: [
      { sym: "$L,R$", desc: "parts of the bipartition" },
      { sym: "bipartition", desc: "split of vertices into two parts with all edges crossing" },
      { sym: "odd cycle", desc: "cycle with odd length" },
      { sym: "parity", desc: "even or odd distance from a root" },
      { sym: "$K_{a,b}$", desc: "complete bipartite graph" }
    ],
    derivation: [
      { do: "Assume a graph is bipartite with sides $L,R$.", result: "cycles alternate $L,R,L,R$", why: "every edge crosses between the two parts" },
      { do: "Return to the starting side along a cycle.", result: "the number of steps is even", why: "alternation returns to the same side only after an even number of moves" },
      { do: "Assume conversely that there is no odd cycle.", result: "assign sides by parity of distance from a root", why: "distance parity is the natural two-side label" },
      { do: "Check an edge joining same-parity vertices.", result: "it would create an odd cycle through the root paths", why: "same parity root paths plus one edge have odd total length after cancelling overlap" },
      { do: "Conclude the parity assignment works.", result: "a bipartition", why: "no edge can join vertices on the same side" }
    ],
    applications: [
      { title: "Complete bipartite edge count", background: "$K_{2,3}$ has.", numbers: "$2\\cdot3=6$ edges" },
      { title: "Even cycle", background: "$C_6$ is bipartite with sides.", numbers: "size $3$ and $3$" },
      { title: "Triangle obstruction", background: "$K_3$ is not bipartite because it has.", numbers: "a $3$-cycle" },
      { title: "Path split", background: "A path on $5$ vertices splits as.", numbers: "$3$ and $2$" },
      { title: "User-item maximum", background: "A user-item graph with $4$ users and $5$ items can have at most.", numbers: "$20$ edges" },
      { title: "Two-coloring", background: "Two-coloring a connected bipartite graph uses exactly.", numbers: "$2$ colors if it has at least one edge" }
    ]
  },
  "math-15-16": {
    connectionsProse: "<p>This lesson builds on bipartite graphs and flows. A matching chooses edges that do not share endpoints, so each selected relationship uses each vertex at most once. This is the graph model behind assignments, pairings, and one-to-one recommendations. The flow construction gives a useful way to compute maximum matchings in bipartite graphs.</p>",
    motivation: "<p>In an assignment problem, choosing one edge can rule out several others because the same user or item cannot be reused. A matching captures exactly that no-duplicate rule. The size of the matching counts how many successful pairings have been made.</p>" +
                "<p>The flow viewpoint turns the combinatorial rule into capacity constraints. Source-to-left and right-to-sink edges of capacity $1$ ensure that each vertex can carry at most one unit of selected assignment flow. An integral flow of value $k$ therefore corresponds to $k$ matched edges.</p>",
    definition: "<p>A matching is a set of edges no two of which share an endpoint. In a bipartite assignment network, an integral flow of value $k$ corresponds to a matching of size $k$.</p>" +
                "<p><b>Assumptions that matter:</b> Source-to-left and right-to-sink capacities are $1$, so each vertex can be used at most once.</p>",
    symbols: [
      { sym: "$M$", desc: "matching" },
      { sym: "matched/unmatched vertex", desc: "vertex that is or is not incident to a chosen edge" },
      { sym: "augmenting path", desc: "path that can increase the size of a matching" },
      { sym: "maximum matching", desc: "matching with largest possible size" },
      { sym: "perfect matching", desc: "matching that covers every vertex" }
    ],
    derivation: [
      { do: "Model each possible assignment as an edge in a bipartite graph.", result: "assignment graph", why: "left and right vertices represent the two object types" },
      { do: "Apply the no-duplicate rule.", result: "no two chosen edges may share an endpoint", why: "a user or item cannot be reused" },
      { do: "Identify the feasible object.", result: "a matching", why: "that is exactly the no-shared-endpoint rule" },
      { do: "Add source-to-left and right-to-sink edges of capacity $1$.", result: "unit vertex capacities through the flow network", why: "each left or right vertex can carry at most one unit" },
      { do: "Read an integral flow.", result: "at most one unit through each vertex", why: "the capacity-$1$ edges enforce the matching constraint" },
      { do: "Count the flow value.", result: "a matching of size $k$", why: "a flow of value $k$ selects $k$ assignment edges" }
    ],
    applications: [
      { title: "Matching size", background: "Edges $u_1i_1,u_2i_2,u_3i_3$ form.", numbers: "matching size $3$" },
      { title: "Side-size bound", background: "With $4$ users and $3$ items, matching size is at most.", numbers: "$3$" },
      { title: "Augmenting path", background: "One augmenting path raises size.", numbers: "from $2$ to $3$" },
      { title: "Perfect matching", background: "A perfect matching on $6$ vertices has.", numbers: "$3$ edges" },
      { title: "Complete bipartite matching", background: "In $K_{2,3}$, maximum matching size is.", numbers: "$2$" },
      { title: "Flow assignment", background: "A max-flow value $3$ in the assignment network means.", numbers: "$3$ assignments" }
    ]
  },
  "math-15-17": {
    connectionsProse: "<p>This lesson uses labels to manage conflicts. A graph coloring assigns colors so adjacent vertices receive different colors. The chromatic number is the smallest number of colors that can do the job. This connects graph structure to scheduling, resource allocation, independent sets, and cliques.</p>",
    motivation: "<p>Coloring is a way to group vertices that do not conflict with each other. Vertices with the same color form an independent set, because an edge inside one color class would violate the rule. Finding a good coloring means covering all vertices with as few independent sets as possible.</p>" +
                "<p>Two kinds of evidence determine the exact chromatic number. A clique of size $r$ proves that at least $r$ colors are necessary, because every pair in the clique conflicts. An explicit coloring with $r$ colors proves that $r$ colors are sufficient, so the lower and upper bounds meet.</p>",
    definition: "<p>A proper coloring assigns colors to vertices so adjacent vertices receive different colors. The chromatic number $\\chi(G)$ is the smallest number of colors needed.</p>" +
                "<p>$$\\chi(G)$$</p>" +
                "<p><b>Assumptions that matter:</b> A clique gives a lower bound, and an explicit coloring gives an upper bound.</p>",
    symbols: [
      { sym: "Coloring", desc: "assignment of colors to vertices" },
      { sym: "color class", desc: "set of vertices with the same color" },
      { sym: "independent set", desc: "set with no internal edges" },
      { sym: "clique", desc: "set in which every pair of vertices is adjacent" },
      { sym: "$\\chi(G)$", desc: "chromatic number" }
    ],
    derivation: [
      { do: "View a proper coloring as color classes.", result: "a partition of vertices into independent sets", why: "same-colored vertices cannot be adjacent" },
      { do: "Find a clique of size $r$.", result: "at least $r$ colors are needed", why: "every pair in the clique conflicts" },
      { do: "Produce a coloring using $k$ colors.", result: "$\\chi(G)\\le k$", why: "the coloring proves $k$ colors are sufficient" },
      { do: "Match a lower bound and a coloring.", result: "$\\chi(G)=r$", why: "a lower bound $r$ and an explicit $r$-coloring prove necessity and sufficiency" }
    ],
    applications: [
      { title: "Odd cycle", background: "$C_5$ needs.", numbers: "$3$ colors" },
      { title: "Complete graph", background: "$K_4$ needs.", numbers: "$4$ colors" },
      { title: "Bipartite graph", background: "A bipartite graph with an edge has.", numbers: "$\\chi=2$" },
      { title: "Tree coloring", background: "A triangle-free tree with at least one edge has.", numbers: "$\\chi=2$" },
      { title: "Scheduling", background: "A schedule conflict graph colored with $4$ colors needs.", numbers: "$4$ time slots" },
      { title: "Clique lower bound", background: "A clique of size $5$ proves.", numbers: "at least $5$ colors" }
    ]
  },
  "math-15-18": {
    connectionsProse: "<p>This lesson introduces graphs that can be drawn without crossings. A planar graph is not defined by one particular drawing, but by whether some crossing-free drawing exists. This makes planarity a structural property rather than an artistic one. The idea prepares the reader for faces, Euler's formula, and planar edge bounds.</p>",
    motivation: "<p>A messy drawing can make a planar graph look nonplanar. Edges may cross simply because of how the picture was arranged. The question of planarity asks whether the graph can be redrawn so edges meet only at shared endpoints.</p>" +
                "<p>Once a drawing has no crossings, the regions of the plane become part of the structure. These regions are called faces, including the unbounded outer face. Later formulas connect the numbers of vertices, edges, and faces, but this lesson first fixes the definitions needed to talk about planar drawings precisely.</p>",
    definition: "<p>A planar graph is a graph that has some drawing in the plane with no edge crossings except at shared endpoints. A plane embedding is such a crossing-free drawing, and its regions are faces.</p>" +
                "<p><b>Assumptions that matter:</b> This lesson defines planar drawing, faces, and crossings. Euler's formula and edge bounds are derived in the next lesson.</p>",
    symbols: [
      { sym: "Planar graph", desc: "graph that can be drawn without crossings" },
      { sym: "plane embedding", desc: "a crossing-free drawing" },
      { sym: "face", desc: "region of the plane in an embedding" },
      { sym: "crossing", desc: "intersection of edges away from shared endpoints" },
      { sym: "outer face", desc: "unbounded face" }
    ],
    applications: [
      { title: "Planar $K_4$", background: "$K_4$ is planar with.", numbers: "$V=4,E=6,F=4$" },
      { title: "Nonplanar $K_5$", background: "$K_5$ is nonplanar; it has $10$ edges while planar simple graphs with $5$ vertices have at most.", numbers: "$9$" },
      { title: "Nonplanar $K_{3,3}$", background: "$K_{3,3}$ is nonplanar; it exceeds the bipartite planar bound $2V-4=8$ by.", numbers: "$1$ edge" },
      { title: "Tree embedding", background: "A tree with $6$ vertices is planar and has.", numbers: "$1$ face in an embedding" },
      { title: "Road graph bound", background: "A planar road graph with $8$ vertices has at most.", numbers: "$18$ edges" },
      { title: "Square with diagonal", background: "A crossing-free square with a diagonal has.", numbers: "$V=4,E=5,F=3$" }
    ]
  },
  "math-15-19": {
    connectionsProse: "<p>This lesson gives the central invariant for connected planar graphs. After a planar drawing is fixed, it has vertices, edges, and faces. The individual drawing can change, but the quantity $V-E+F$ remains equal to $2$. This formula supports edge bounds, nonplanarity tests, and many counting arguments in planar graph theory.</p>",
    motivation: "<p>A planar graph can be built from a tree by adding edges that create cycles without crossings. The tree case is easy to count: it has $V-1$ edges and one face. That already gives $V-E+F=2$.</p>" +
                "<p>Adding a planar edge inside a face increases the number of edges by one and splits one face into two. The two changes cancel in the expression $V-E+F$. This is why the same value persists as the drawing gains cycles and becomes a general connected planar graph.</p>",
    definition: "<p>Euler's formula says that every connected planar graph satisfies</p>" +
                "<p>$$V-E+F=2$$</p>" +
                "<p><b>Assumptions that matter:</b> The graph is connected and planar, and $F$ counts faces including the outer face.</p>",
    symbols: [
      { sym: "$V$", desc: "vertices" },
      { sym: "$E$", desc: "edges" },
      { sym: "$F$", desc: "faces including the outer face" },
      { sym: "connected planar graph", desc: "connected graph with a crossing-free plane drawing" }
    ],
    derivation: [
      { do: "Start with a tree drawn in the plane.", result: "$E=V-1$ and one face, so $V-E+F=V-(V-1)+1=2$", why: "a tree is connected and acyclic with one outer face" },
      { do: "Add an edge that stays planar.", result: "one new edge", why: "the drawing remains crossing-free" },
      { do: "Track the face count.", result: "one face splits into two", why: "the new edge creates one new cycle inside a face" },
      { do: "Compare changes in the invariant.", result: "$E$ increases by $1$ and $F$ increases by $1$, so $V-E+F$ is unchanged", why: "the two changes cancel" },
      { do: "Repeat until the connected planar graph is built.", result: "$V-E+F=2$", why: "the invariant stayed equal to the tree value" }
    ],
    applications: [
      { title: "Cube graph", background: "Cube graph satisfies Euler's formula.", numbers: "$8-12+6=2$" },
      { title: "$K_4$", background: "$K_4$ satisfies Euler's formula.", numbers: "$4-6+4=2$" },
      { title: "Square with diagonal", background: "A square with a diagonal satisfies Euler's formula.", numbers: "$4-5+3=2$" },
      { title: "Solving for faces", background: "A planar connected graph with $V=6,E=9$ has.", numbers: "$F=5$" },
      { title: "Triangulated maximum", background: "A triangulated planar graph with $V=6$ has maximum.", numbers: "$E=12$" },
      { title: "Tree faces", background: "A tree with $V=10,E=9$ has.", numbers: "$F=1$" }
    ]
  },
  "math-15-20": {
    connectionsProse: "<p>This lesson studies routes that use every edge exactly once. An Eulerian circuit returns to its starting vertex, while an Eulerian trail may start and end at different vertices. The key condition is about vertex degrees, not about the overall shape of the drawing. This contrasts with Hamiltonian questions, which focus on visiting vertices.</p>",
    motivation: "<p>When a route uses edges exactly once, every arrival at an internal vertex must be paired with a departure. That pairing explains why even degree is the natural condition for a closed Eulerian circuit. If all edge-containing parts are connected and all degrees are even, the route can keep pairing entrances and exits until every edge is used.</p>" +
                "<p>For an open Eulerian trail, exactly two vertices are allowed to be unpaired: the start and the end. Those two vertices have odd degree, while all other vertices still need even degree. This parity reasoning gives a clean local test for a global edge-covering route.</p>",
    definition: "<p>An Eulerian circuit is a closed route that uses every edge exactly once. An Eulerian trail uses every edge exactly once but may start and end at different vertices.</p>" +
                "<p><b>Assumptions that matter:</b> All degrees even gives an Eulerian circuit in each connected component containing edges; exactly two odd vertices gives an Eulerian trail but not a circuit.</p>",
    symbols: [
      { sym: "Eulerian circuit", desc: "closed route using every edge exactly once" },
      { sym: "Eulerian trail", desc: "route using every edge exactly once" },
      { sym: "odd/even degree", desc: "degree parity of a vertex" },
      { sym: "connected support", desc: "the edge-containing part is connected" }
    ],
    applications: [
      { title: "Cycle circuit", background: "Cycle $C_4$ has $0$ odd vertices.", numbers: "it has an Eulerian circuit" },
      { title: "Path trail", background: "Path $P_4$ has $2$ odd vertices.", numbers: "it has an Eulerian trail" },
      { title: "Star obstruction", background: "Star $K_{1,3}$ has $4$ odd vertices.", numbers: "it has neither" },
      { title: "Even sequence", background: "A graph with degrees $(2,2,4,4)$ passes the parity test with.", numbers: "$0$ odd vertices" },
      { title: "Open trail sequence", background: "Degrees $(1,3,2,2)$ give exactly $2$ odd vertices.", numbers: "an open trail exists" },
      { title: "Circuit edge use", background: "An Eulerian circuit in a $6$-edge graph uses exactly.", numbers: "$6$ edges" }
    ]
  },
  "math-15-21": {
    connectionsProse: "<p>This lesson shifts from covering edges to covering vertices. A Hamiltonian path visits every vertex exactly once, and a Hamiltonian cycle also returns to the start. The definition is simple, but the problem is much harder than the Eulerian case. It is the graph-theoretic core of tour and ordering problems such as the traveling salesperson problem.</p>",
    motivation: "<p>Eulerian routes allow vertices to repeat as long as edges are used exactly once. Hamiltonian routes do the opposite: vertices are the scarce resource, so revisiting a vertex is not allowed. This makes the problem sensitive to the global arrangement of the graph.</p>" +
                "<p>There is no simple parity test like the one for Eulerian graphs. A graph may have many vertices of large degree and still fail to contain a Hamiltonian cycle, while complete graphs have many such cycles. The lesson therefore focuses on the definitions and on contrasting vertex-covering routes with edge-covering routes.</p>",
    definition: "<p>A Hamiltonian path visits every vertex exactly once. A Hamiltonian cycle visits every vertex exactly once and returns to the start.</p>" +
                "<p><b>Assumptions that matter:</b> There is no simple degree-parity test like the Eulerian case; the lesson contrasts vertex-covering routes with edge-covering routes.</p>",
    symbols: [
      { sym: "Hamiltonian path", desc: "path visiting every vertex exactly once" },
      { sym: "Hamiltonian cycle", desc: "cycle visiting every vertex exactly once" },
      { sym: "spanning cycle", desc: "cycle covering all vertices" },
      { sym: "$n$", desc: "vertices" }
    ],
    applications: [
      { title: "Cycle graph", background: "$C_5$ has a Hamiltonian cycle of.", numbers: "length $5$" },
      { title: "$K_4$ cycles", background: "$K_4$ has.", numbers: "$3\\cdot2\\cdot1/2=3$ undirected Hamiltonian cycles" },
      { title: "Path graph", background: "Path $P_5$ has a Hamiltonian path with $4$ edges.", numbers: "but no Hamiltonian cycle" },
      { title: "Star obstruction", background: "Star $K_{1,4}$ has no Hamiltonian path covering all leaves.", numbers: "it would need to revisit the center" },
      { title: "TSP tour", background: "A TSP tour on $6$ cities is a Hamiltonian cycle with.", numbers: "$6$ edges" },
      { title: "$K_5$ cycles", background: "A complete graph $K_5$ has.", numbers: "$4\\cdot3\\cdot2\\cdot1/2=12$ undirected Hamiltonian cycles" }
    ]
  },
  "math-15-22": {
    connectionsProse: "<p>This lesson returns to graph representations and connects them to linear algebra. The adjacency matrix records edges as entries of a matrix. Multiplying the matrix by itself combines adjacent steps. That makes matrix powers a systematic way to count walks of a fixed length.</p>",
    motivation: "<p>An adjacency matrix answers a one-step question: whether vertex $i$ is connected to vertex $j$. A two-step walk from $i$ to $j$ must choose an intermediate vertex $k$. Matrix multiplication does exactly that kind of summation over possible intermediate choices.</p>" +
                "<p>This is the main bridge between graphs and matrix methods. The entry $(A^2)_{ij}$ counts length-$2$ walks, and the same reasoning extends by induction to $(A^k)_{ij}$. The graph has not changed, but the matrix representation lets algebra count routes through it.</p>",
    definition: "<p>The adjacency matrix has entry $A_{ij}=1$ when there is an edge from $i$ to $j$, and $0$ otherwise. Matrix powers count walks:</p>" +
                "<p>$$(A^k)_{ij}$$</p>" +
                "<p><b>Assumptions that matter:</b> The walk-counting statement follows from ordinary matrix multiplication over possible intermediate vertices.</p>",
    symbols: [
      { sym: "$A$", desc: "adjacency matrix" },
      { sym: "$A_{ij}$", desc: "entry of the adjacency matrix" },
      { sym: "$A^k$", desc: "matrix power" },
      { sym: "$k$", desc: "walk length" }
    ],
    derivation: [
      { do: "Define the adjacency entries.", result: "$A_{ij}=1$ if there is an edge from $i$ to $j$, otherwise $0$", why: "the matrix records one-step connections" },
      { do: "Write the square entry.", result: "$(A^2)_{ij}=\\sum_k A_{ik}A_{kj}$", why: "matrix multiplication sums over intermediate vertices" },
      { do: "Interpret one term.", result: "$A_{ik}A_{kj}=1$ exactly when $i\\to k\\to j$ is a length-$2$ walk", why: "both one-step edges must exist" },
      { do: "Sum over $k$.", result: "$(A^2)_{ij}$ counts length-$2$ walks", why: "each valid intermediate vertex contributes one" },
      { do: "Extend by induction.", result: "$(A^k)_{ij}=\\sum_r(A^{k-1})_{ir}A_{rj}$ counts length-$k$ walks", why: "a length-$k$ walk is a length-$(k-1)$ walk followed by one edge" }
    ],
    applications: [
      { title: "$K_3$ diagonal", background: "For $K_3$, $A^2$ has diagonal entries.", numbers: "$2$" },
      { title: "$K_3$ off-diagonal", background: "For $K_3$, off-diagonal entries of $A^2$ are.", numbers: "$1$" },
      { title: "Triangle trace", background: "The trace of $A^3$ counts directed closed triangle walks.", numbers: "$\\mathrm{tr}(A^3)/6=1$ triangle in $K_3$" },
      { title: "Path walk", background: "For path $1-2-3-4$.", numbers: "$(A^3)_{14}=1$" },
      { title: "Degree row sums", background: "Row sum of $A$ gives degrees in $K_3$.", numbers: "$(2,2,2)$" },
      { title: "Total adjacency sum", background: "Total sum of $A$ in $K_3$ is.", numbers: "$6=2|E|$" }
    ]
  },
  "math-15-23": {
    connectionsProse: "<p>This lesson builds on the adjacency matrix and the degree of a vertex. The adjacency matrix records who is connected to whom, while the degree matrix records how many neighbors each vertex has. The graph Laplacian puts those two pieces together in one matrix, $L=D-A$.</p>" +
                      "<p>The point of combining them is not just bookkeeping. The Laplacian measures how much a signal on the vertices disagrees across edges. That makes it central in spectral graph theory, graph clustering, diffusion on networks, and graph neural networks. Once the quadratic form $x^T Lx$ is derived, the matrix has a clear meaning: it turns graph structure into a numerical penalty for roughness.</p>",
    motivation: "<p>A graph often carries a number at each vertex. In a social graph the number might be a user's score, in a sensor network it might be a temperature, and in a GNN it might be one coordinate of a node embedding. A natural question is whether nearby vertices have similar values.</p>" +
                "<p>The graph Laplacian answers that question. If connected vertices have nearly the same values, the Laplacian energy is small. If connected vertices disagree sharply, the energy is large. This is why the Laplacian appears in smoothing, diffusion, clustering, and semi-supervised learning: it turns the idea \"neighbors should agree\" into a formula that can be computed and optimized.</p>" +
                "<p>For the path $1-2-3$, the matrices are $$A=\\begin{bmatrix}0&1&0\\1&0&1\\0&1&0\\end{bmatrix},\\quad D=\\begin{bmatrix}1&0&0\\0&2&0\\0&0&1\\end{bmatrix},\\quad L=D-A=\\begin{bmatrix}1&-1&0\\-1&2&-1\\0&-1&1\\end{bmatrix}.$$ The middle vertex has degree $2$, so its diagonal entry is $2$; each edge contributes a $-1$ off the diagonal.</p>",
    definition: "<p>The graph Laplacian is the degree matrix minus the adjacency matrix.</p>" +
                "<p>$$L=D-A$$</p>" +
                "<p><b>Assumptions that matter:</b> The energy identity below is derived for a simple undirected graph.</p>",
    symbols: [
      { sym: "$G=(V,E)$", desc: "the graph" },
      { sym: "$V$", desc: "vertices" },
      { sym: "$E$", desc: "undirected edges" },
      { sym: "$A$", desc: "adjacency matrix" },
      { sym: "$D$", desc: "degree matrix" },
      { sym: "$d_i$", desc: "degree of vertex $i$" },
      { sym: "$L$", desc: "graph Laplacian" },
      { sym: "$x_i$", desc: "value of a signal at vertex $i$" },
      { sym: "$x^TLx$", desc: "Laplacian energy" }
    ],
    derivation: [
      { do: "Start with the definition of $L$.", result: "$x^T Lx=x^T(D-A)x$", why: "$L$ is defined as degree matrix minus adjacency matrix" },
      { do: "Expand the degree term.", result: "$x^TDx=\\sum_i d_i x_i^2$", why: "$D$ is diagonal and $D_{ii}=d_i$" },
      { do: "Expand the adjacency term.", result: "$x^TAx=\\sum_i\\sum_j A_{ij}x_ix_j$", why: "matrix multiplication sums over ordered vertex pairs" },
      { do: "Use the simple undirected adjacency entries.", result: "$x^TAx=2\\sum_{(i,j)\\in E}x_ix_j$", why: "$A_{ij}=1$ exactly when $i$ and $j$ are adjacent, and each edge is counted twice" },
      { do: "Rewrite the degree term by edges.", result: "$\\sum_i d_i x_i^2=\\sum_{(i,j)\\in E}(x_i^2+x_j^2)$", why: "each incident edge contributes one copy of its endpoint's square" },
      { do: "Subtract edge by edge.", result: "$x^TLx=\\sum_{(i,j)\\in E}(x_i^2+x_j^2-2x_ix_j)=\\sum_{(i,j)\\in E}(x_i-x_j)^2$", why: "combine the degree and adjacency contributions for each edge" },
      { do: "Interpret the identity.", result: "$x^TLx$ is total squared disagreement across edges", why: "it is $0$ exactly when $x_i=x_j$ on every edge, meaning $x$ is constant on each connected component" }
    ],
    applications: [
      { title: "Smoothness energy", background: "On path $1-2-3$, $x=(3,1,3)$ gives.", numbers: "$x^TLx=(3-1)^2+(1-3)^2=8$" },
      { title: "Constant-signal check", background: "$x=(2,2,2)$ gives.", numbers: "$x^TLx=0$, so the signal is perfectly smooth on the connected path" },
      { title: "One heat/GNN smoothing step", background: "$Lx=(2,-4,2)$, so.", numbers: "$x\\leftarrow x-0.1Lx=(2.8,1.4,2.8)$" },
      { title: "Connectedness test", background: "The path's Laplacian eigenvalues are $0,1,3$.", numbers: "the $0$ eigenvalue has multiplicity $1$ and the graph is connected" },
      { title: "Normalized Laplacian coefficient", background: "$L_{\\mathrm{sym}}=I-D^{-1/2}AD^{-1/2}$ gives edge coefficient.", numbers: "$-1/\\sqrt{1\\cdot2}\\approx-0.707$ between an endpoint and the middle vertex" },
      { title: "Effective-resistance feature", background: "In a unit-resistor path, the resistance between vertices $1$ and $3$ is.", numbers: "$2$, matching the two series edges and recoverable from $L^+$" }
    ]
  },
  "math-15-24": {
    connectionsProse: "<p>This lesson continues from the graph Laplacian. Once a graph is represented by a symmetric matrix, its eigenvalues and eigenvectors describe modes of variation on the vertices. The spectrum gives numerical information about connectivity and bottlenecks. This prepares the reader for spectral clustering and graph-based learning methods.</p>",
    motivation: "<p>The Laplacian energy measures how much a vertex signal changes across edges. Eigenvectors of the Laplacian give special signals whose variation is organized by the graph itself. Small eigenvalues correspond to smooth signals, while larger eigenvalues correspond to more rapidly varying patterns.</p>" +
                "<p>The zero eigenvalue has a direct structural meaning. Since energy $0$ means no disagreement across any edge, the signal must be constant on each connected component. The second-smallest eigenvalue is therefore the first nonconstant mode in a connected graph, and it carries information about how strongly the graph holds together.</p>",
    definition: "<p>Spectral graph theory studies eigenvalues and eigenvectors of graph matrices such as the Laplacian. For an undirected graph, Laplacian eigenvalues are nonnegative and the multiplicity of $0$ equals the number of connected components.</p>" +
                "<p><b>Assumptions that matter:</b> The graph is undirected, so $L$ is symmetric and has real eigenvalues and orthogonal eigenvectors.</p>",
    symbols: [
      { sym: "$\\lambda$", desc: "eigenvalue" },
      { sym: "$v$", desc: "eigenvector" },
      { sym: "spectrum", desc: "set of eigenvalues" },
      { sym: "$\\lambda_2$", desc: "algebraic connectivity" },
      { sym: "$L$", desc: "Laplacian" }
    ],
    derivation: [
      { do: "Use symmetry of $L$ for an undirected graph.", result: "real eigenvalues and orthogonal eigenvectors", why: "symmetric matrices have this spectral structure" },
      { do: "Apply the energy identity.", result: "$x^TLx\\ge0$", why: "the energy is a sum of squared edge disagreements" },
      { do: "Transfer nonnegativity to eigenvalues.", result: "every eigenvalue is nonnegative", why: "an eigenvector $v$ has $v^TLv=\\lambda v^Tv\\ge0$" },
      { do: "Check the constant vector.", result: "$L\\mathbf1=0$", why: "constant signals have no edge disagreement" },
      { do: "Interpret the zero eigenspace.", result: "multiplicity of $0$ equals the number of connected components", why: "energy $0$ means constant on each component" },
      { do: "Look at the first nonconstant mode.", result: "$\\lambda_2$ measures the first nonconstant smooth mode", why: "the zero mode is constant on a connected graph" }
    ],
    applications: [
      { title: "$P_3$ spectrum", background: "Path $P_3$ has Laplacian eigenvalues.", numbers: "$0,1,3$" },
      { title: "Algebraic connectivity", background: "Therefore.", numbers: "$\\lambda_2=1$" },
      { title: "Star spectrum", background: "Star $K_{1,3}$ has eigenvalues.", numbers: "$0,1,1,4$" },
      { title: "Connected star", background: "The star has one zero eigenvalue.", numbers: "so it is connected" },
      { title: "Largest star mode", background: "The largest star eigenvalue is.", numbers: "$4$" },
      { title: "Condition ratio", background: "For $P_3$, condition ratio among nonzero Laplacian modes is.", numbers: "$3/1=3$" }
    ]
  },
  "math-15-25": {
    connectionsProse: "<p>This lesson introduces probability into graph theory. A random graph model describes a distribution over possible graphs rather than one fixed graph. In $G(n,p)$, each possible edge is included independently with probability $p$. This gives a clean setting for expected edge counts, degrees, triangles, and isolated vertices.</p>",
    motivation: "<p>Random graphs are useful when the exact edge set is uncertain or when a simple baseline model is needed. Instead of asking whether one particular edge exists, the model assigns a probability to each possible edge. The simplest version treats all possible edges independently with the same probability.</p>" +
                "<p>Many first computations use indicator variables and linearity of expectation. Each possible edge contributes probability $p$ to the expected edge count, each possible triangle contributes probability $p^3$, and each fixed vertex is isolated only if all its possible incident edges are absent. These calculations are expectations, not threshold theorems.</p>",
    definition: "<p>In the random graph model $G(n,p)$, there are $n$ vertices and each possible edge is included independently with probability $p$.</p>" +
                "<p><b>Assumptions that matter:</b> This lesson defines the model and computes expectations by linearity. Do not present threshold theorems as if derived in this lesson.</p>",
    symbols: [
      { sym: "$G(n,p)$", desc: "random graph model" },
      { sym: "$n$", desc: "vertices" },
      { sym: "$p$", desc: "edge probability" },
      { sym: "$\\mathbb E$", desc: "expected value" },
      { sym: "indicator variable", desc: "variable that is $1$ when an event occurs and $0$ otherwise" }
    ],
    applications: [
      { title: "Expected edges", background: "In $G(10,0.2)$, expected edges are.", numbers: "$\\binom{10}{2}0.2=9$" },
      { title: "Expected degree", background: "Expected degree of a vertex is.", numbers: "$(10-1)0.2=1.8$" },
      { title: "Expected triangles", background: "Expected triangles are.", numbers: "$\\binom{10}{3}0.2^3=0.96$" },
      { title: "Absent edge", background: "Probability a specific edge is absent is.", numbers: "$0.8$" },
      { title: "Isolated vertex", background: "Probability a fixed vertex is isolated is.", numbers: "$0.8^9\\approx0.134$" },
      { title: "Expected isolated vertices", background: "Expected isolated vertices are.", numbers: "$10\\cdot0.8^9\\approx1.342$" }
    ]
  },
  "math-15-26": {
    connectionsProse: "<p>This lesson uses spectral graph theory for clustering. A good two-way split should cut relatively few edges while keeping the sides meaningful. Spectral clustering relaxes that discrete cut problem into an eigenvector problem. The Fiedler vector then gives a real-valued guide for separating the vertices.</p>",
    motivation: "<p>A cut can be encoded by assigning different labels to vertices on different sides. The Laplacian energy of that label vector is large when many edges cross the split, because cut edges connect vertices with different labels. Minimizing that energy would favor cuts with few crossing edges.</p>" +
                "<p>The exact label problem is discrete and hard, so spectral clustering relaxes the labels to real numbers with normalization constraints. Under that relaxation, the Rayleigh quotient is minimized by the eigenvector for $\\lambda_2$. Sorting or taking signs of that vector turns the relaxed solution back into a practical graph partition.</p>",
    definition: "<p>Spectral clustering relaxes a discrete graph cut problem into an eigenvector problem. The relaxed Rayleigh quotient is minimized by the eigenvector for $\\lambda_2$.</p>" +
                "<p>$$\\frac{x^TLx}{x^Tx}$$</p>" +
                "<p><b>Assumptions that matter:</b> The relaxed vector is real-valued, constrained to be orthogonal to $\\mathbf1$, and has fixed length.</p>",
    symbols: [
      { sym: "Fiedler vector", desc: "eigenvector associated with $\\lambda_2$" },
      { sym: "$\\lambda_2$", desc: "second-smallest Laplacian eigenvalue" },
      { sym: "Rayleigh quotient", desc: "$x^TLx/x^Tx$" },
      { sym: "cut", desc: "partition of vertices" },
      { sym: "relaxed labels", desc: "real-valued replacements for discrete side labels" }
    ],
    derivation: [
      { do: "Encode a two-way split by a vector $x$.", result: "entries differ by side", why: "the vector stores the side labels" },
      { do: "Evaluate Laplacian energy.", result: "$x^TLx$ sums squared disagreements across edges", why: "the Laplacian energy identity counts edge disagreements" },
      { do: "Notice which edges contribute heavily.", result: "cut edges", why: "cut edges connect vertices with different labels" },
      { do: "Relax the discrete problem.", result: "real-valued $x$ orthogonal to $\\mathbf1$ with fixed length", why: "exact discrete minimization is hard" },
      { do: "Minimize the relaxed objective.", result: "$x^TLx/x^Tx$ is minimized by the eigenvector for $\\lambda_2$", why: "the Rayleigh quotient selects the first nonconstant Laplacian mode" },
      { do: "Convert the relaxed vector to a partition.", result: "split vertices by signs or sorted values", why: "the Fiedler vector gives an ordered real-valued guide" }
    ],
    applications: [
      { title: "$P_4$ eigenvalues", background: "For path $P_4$, eigenvalues are approximately.", numbers: "$0,0.586,2,3.414$" },
      { title: "Fiedler signs", background: "The Fiedler vector has signs.", numbers: "$+,+,-,-$" },
      { title: "Balanced split", background: "Splitting after vertex $2$ cuts.", numbers: "$1$ edge" },
      { title: "Unbalanced split", background: "Splitting $\\{1\\}$ from the rest also cuts $1$ edge.", numbers: "but is less balanced" },
      { title: "Relaxed objective", background: "The relaxed objective value is.", numbers: "$\\lambda_2\\approx0.586$" },
      { title: "Disconnected pairs", background: "On two disconnected pairs, $\\lambda_2=0$ and the exact split has.", numbers: "cut size $0$" }
    ]
  },
  "math-15-27": {
    connectionsProse: "<p>This lesson connects graph structure to learned representations. A graph neural network updates node features by sending messages along edges. The same local rule is shared across the graph, while the adjacency pattern decides which nodes exchange information. This brings together adjacency matrices, neighborhoods, smoothing, and modern graph-based machine learning.</p>",
    motivation: "<p>A node feature by itself describes one vertex, but many graph tasks depend on nearby context. In a citation graph, a paper is informed by neighboring papers; in a social graph, a user is informed by nearby users; in a molecule, an atom is informed by bonded atoms. Message passing is the mechanism for combining that local context.</p>" +
                "<p>A basic layer aggregates neighbor features, includes the node's own feature through a self-loop, and applies shared learned weights. Matrix notation expresses the same operation for all vertices at once. Repeating layers expands the receptive field, so information can travel from immediate neighbors to two-hop and farther neighborhoods.</p>",
    definition: "<p>A graph neural network message-passing layer updates each node feature from its neighbors, a self-loop, shared weights, and an activation. One mean-aggregation layer is</p>" +
                "<p>$$H^{(t+1)}=\\sigma(\\tilde D^{-1}\\tilde A H^{(t)}W)$$</p>" +
                "<p><b>Assumptions that matter:</b> The displayed layer uses self-loops and mean aggregation.</p>",
    symbols: [
      { sym: "$h_v$", desc: "node feature" },
      { sym: "$N(v)$", desc: "neighbors of $v$" },
      { sym: "$H$", desc: "feature matrix" },
      { sym: "$\\tilde A=A+I$", desc: "self-loop adjacency" },
      { sym: "$\\tilde D$", desc: "self-loop degree matrix" },
      { sym: "$W$", desc: "trainable weights" },
      { sym: "$\\sigma$", desc: "activation" }
    ],
    derivation: [
      { do: "Give each node a feature vector.", result: "$h_v^{(t)}$", why: "the superscript records the layer or time step" },
      { do: "Collect neighbor messages.", result: "sum or average $h_u^{(t)}$ over $u\\in N(v)$", why: "neighbors provide the local graph context" },
      { do: "Include a self-loop.", result: "the node keeps its own information", why: "the update should not discard the current node feature" },
      { do: "Apply a shared weight matrix and nonlinearity.", result: "the same rule works at every node", why: "parameters are shared across the graph" },
      { do: "Write the mean-aggregation layer in matrix form.", result: "$H^{(t+1)}=\\sigma(\\tilde D^{-1}\\tilde A H^{(t)}W)$", why: "the matrix expression performs all node updates at once" }
    ],
    applications: [
      { title: "Node $1$ mean", background: "On path $1-2-3$ with features $(1,2,4)$, self-loop mean aggregation gives node $1$.", numbers: "$(1+2)/2=1.5$" },
      { title: "Node $2$ mean", background: "Node $2$ gets.", numbers: "$(1+2+4)/3=2.333$" },
      { title: "Node $3$ mean", background: "Node $3$ gets.", numbers: "$(2+4)/2=3$" },
      { title: "Sum aggregation", background: "Sum aggregation gives.", numbers: "$(3,7,6)$" },
      { title: "Scalar weight", background: "With scalar weight $W=2$ and no activation, mean outputs become.", numbers: "$(3,4.667,6)$" },
      { title: "Two-hop receptive field", background: "Two hops let node $1$ receive information from node $3$ through node $2$.", numbers: "its two-hop receptive-field size is $3$" }
    ]
  }
};
