module.exports = {
  "math-15-01": {
    "id": "math-15-01",
    "title": "Graphs and their representations",
    "tagline": "A graph is a small language for relationships: dots for objects, lines for connections.",
    "connections": {
      "buildsOn": [
        "sets",
        "relations",
        "matrices"
      ],
      "leadsTo": [
        "Degree and the handshake lemma",
        "Paths and walks",
        "Trees"
      ],
      "usedWith": [
        "adjacency matrices",
        "incidence matrices",
        "sets",
        "functions"
      ]
    },
    "motivation": "<p>You already draw little maps: friends connected to friends, webpages connected by links, cities connected by roads. Graph theory gives those maps a precise vocabulary.</p><p>A <b>graph</b> keeps only what matters for connection. Once the same graph can be written as a picture, a list, or a matrix, algorithms have something exact to compute with.</p>",
    "definition": "<p>An <b>undirected graph</b> is $G=(V,E)$, where $V$ is a set of vertices and $E$ is a set of edges. In a simple graph, each edge is a two-element set $\\{u,v\\}$ with $u,v\\in V$ and $u\\ne v$. An <b>adjacency list</b> records each vertex's neighbors. An <b>adjacency matrix</b> $A$ has $A_{ij}=1$ when vertices $i$ and $j$ are adjacent, and $0$ otherwise.</p><p>For an undirected simple graph, the matrix is symmetric because $\\{i,j\\}=\\{j,i\\}$: if $i$ is connected to $j$, then $j$ is connected to $i$. The diagonal is zero because simple graphs have no self-loops.</p><p><b>Assumptions that matter:</b> unless stated otherwise, graphs here are finite, undirected, and simple; vertex labels are names, not sizes; and the same graph may have many drawings but one connection structure.</p>",
    "worked": {
      "problem": "Represent the graph with $V=\\{A,B,C,D\\}$ and $E=\\{\\{A,B\\},\\{A,C\\},\\{B,D\\}\\}$ as an adjacency list and matrix in the order $A,B,C,D$.",
      "skills": [
        "vertex sets",
        "edge sets",
        "adjacency matrices"
      ],
      "strategy": "Read neighbors from the edge set, then place $1$s exactly where those neighbor pairs occur.",
      "steps": [
        {
          "do": "List neighbors of $A$",
          "result": "$B,C$",
          "why": "$A$ appears in edges with $B$ and $C$"
        },
        {
          "do": "List neighbors of $B$",
          "result": "$A,D$",
          "why": "$B$ appears with $A$ and $D$"
        },
        {
          "do": "List neighbors of $C$",
          "result": "$A$",
          "why": "$C$ appears only with $A$"
        },
        {
          "do": "List neighbors of $D$",
          "result": "$B$",
          "why": "$D$ appears only with $B$"
        },
        {
          "do": "Write the first matrix row",
          "result": "$[0,1,1,0]$",
          "why": "$A$ is adjacent to $B$ and $C$, not itself or $D$"
        },
        {
          "do": "Write the remaining rows",
          "result": "$[1,0,0,1]$, $[1,0,0,0]$, $[0,1,0,0]$",
          "why": "each row marks the listed neighbors in order"
        }
      ],
      "verify": "The matrix is symmetric and has three pairs of matching $1$s, one pair for each undirected edge.",
      "answer": "Adjacency list: $A:B,C$; $B:A,D$; $C:A$; $D:B$. Matrix rows are $[0,1,1,0]$, $[1,0,0,1]$, $[1,0,0,0]$, $[0,1,0,0]$.",
      "connects": "A representation is faithful when it preserves exactly the same adjacencies."
    },
    "practice": [
      {
        "problem": "For $V=\\{1,2,3\\}$ and $E=\\{\\{1,2\\},\\{2,3\\}\\}$, write the adjacency list and matrix.",
        "steps": [
          {
            "do": "List neighbors of $1$",
            "result": "$2$",
            "why": "edge $\\{1,2\\}$ touches $1$"
          },
          {
            "do": "List neighbors of $2$",
            "result": "$1,3$",
            "why": "both edges touch $2$"
          },
          {
            "do": "List neighbors of $3$",
            "result": "$2$",
            "why": "edge $\\{2,3\\}$ touches $3$"
          },
          {
            "do": "Write row $1$",
            "result": "$[0,1,0]$",
            "why": "$1$ connects only to $2$"
          },
          {
            "do": "Write rows $2$ and $3$",
            "result": "$[1,0,1]$ and $[0,1,0]$",
            "why": "mark each neighbor in vertex order"
          }
        ],
        "answer": "List: $1:2$, $2:1,3$, $3:2$; matrix rows $[0,1,0]$, $[1,0,1]$, $[0,1,0]$."
      },
      {
        "problem": "A matrix in order $A,B,C$ has rows $[0,1,1]$, $[1,0,0]$, $[1,0,0]$. Recover $E$.",
        "steps": [
          {
            "do": "Inspect row $A$",
            "result": "$A$ touches $B$ and $C$",
            "why": "row entries $1$ mark neighbors"
          },
          {
            "do": "Record edge to $B$",
            "result": "$\\{A,B\\}$",
            "why": "the $A,B$ entry is $1$"
          },
          {
            "do": "Record edge to $C$",
            "result": "$\\{A,C\\}$",
            "why": "the $A,C$ entry is $1$"
          },
          {
            "do": "Inspect row $B$",
            "result": "only $A$ already counted",
            "why": "undirected edges appear twice"
          },
          {
            "do": "Inspect row $C$",
            "result": "only $A$ already counted",
            "why": "avoid duplicate edges"
          }
        ],
        "answer": "$E=\\{\\{A,B\\},\\{A,C\\}\\}$."
      },
      {
        "problem": "For a simple graph with $5$ vertices, what is the largest possible number of edges?",
        "steps": [
          {
            "do": "Count possible partners for vertex $1$",
            "result": "$4$",
            "why": "it can connect to all other vertices"
          },
          {
            "do": "Count unordered vertex pairs",
            "result": "$\\binom52$",
            "why": "each edge is one two-vertex subset"
          },
          {
            "do": "Compute the numerator",
            "result": "$5\\cdot4=20$",
            "why": "choose first and second endpoint"
          },
          {
            "do": "Divide by $2$",
            "result": "$10$",
            "why": "each pair was counted in two orders"
          },
          {
            "do": "State the maximum",
            "result": "$10$ edges",
            "why": "the complete graph includes every possible pair"
          }
        ],
        "answer": "The largest simple graph on $5$ vertices has $\\binom52=10$ edges."
      },
      {
        "problem": "A directed graph has edges $A\\to B$, $B\\to A$, and $B\\to C$. Write its adjacency matrix in order $A,B,C$.",
        "steps": [
          {
            "do": "Use row as source",
            "result": "row $A$ records outgoing edges",
            "why": "directed matrices need an orientation convention"
          },
          {
            "do": "Write row $A$",
            "result": "$[0,1,0]$",
            "why": "$A$ points to $B$"
          },
          {
            "do": "Write row $B$",
            "result": "$[1,0,1]$",
            "why": "$B$ points to $A$ and $C$"
          },
          {
            "do": "Write row $C$",
            "result": "$[0,0,0]$",
            "why": "$C$ has no outgoing edges"
          },
          {
            "do": "Check symmetry",
            "result": "not symmetric",
            "why": "$B\\to C$ has no matching $C\\to B$"
          }
        ],
        "answer": "The matrix rows are $[0,1,0]$, $[1,0,1]$, and $[0,0,0]$."
      },
      {
        "problem": "A social network has $1000$ users and $5000$ friendships. Compare storage for an adjacency matrix and an adjacency list count of neighbor entries.",
        "steps": [
          {
            "do": "Count matrix entries",
            "result": "$1000^2=1,000,000$",
            "why": "a matrix stores every possible ordered pair"
          },
          {
            "do": "Count list neighbor entries",
            "result": "$2\\cdot5000=10,000$",
            "why": "each undirected friendship appears in two lists"
          },
          {
            "do": "Compute the ratio",
            "result": "$1,000,000/10,000=100$",
            "why": "compare entry counts"
          },
          {
            "do": "Interpret sparsity",
            "result": "list is much smaller",
            "why": "most possible friendships are absent"
          },
          {
            "do": "Name the representation choice",
            "result": "adjacency list",
            "why": "sparse graphs favor lists"
          }
        ],
        "answer": "The matrix has $1,000,000$ entries, while the adjacency lists store about $10,000$ neighbor entries, so lists are about $100$ times smaller here."
      }
    ],
    "applications": [
      {
        "title": "Web links",
        "background": "Search engines model pages as vertices and hyperlinks as directed edges, a view that made large-scale ranking possible.",
        "numbers": "If pages $A,B,C$ have links $A\\to B$, $A\\to C$, $C\\to A$, the adjacency matrix rows are $[0,1,1]$, $[0,0,0]$, $[1,0,0]$."
      },
      {
        "title": "Social recommendations",
        "background": "Friend and follow graphs record relationships so systems can suggest people or communities.",
        "numbers": "If user $u$ follows $12$ accounts and $3$ also follow $v$, then a common-neighbor feature can include the number $3$."
      },
      {
        "title": "Sparse ML features",
        "background": "Many datasets are mostly zeros, just like sparse graphs. Adjacency lists mirror sparse-vector storage.",
        "numbers": "A graph with $10,000$ vertices and $40,000$ edges stores $80,000$ undirected neighbor entries rather than $100,000,000$ matrix entries."
      },
      {
        "title": "Knowledge graphs",
        "background": "Knowledge bases represent entities and relations as graph triples. This supports question answering and retrieval.",
        "numbers": "Triples like $(Ada, wrote, Notes)$ and $(Notes, about, engines)$ form $2$ directed labeled edges among $3$ entities."
      },
      {
        "title": "Molecule graphs",
        "background": "Chemistry treats atoms as vertices and bonds as edges, letting ML predict molecular properties.",
        "numbers": "Water has vertices $O,H_1,H_2$ and edges $\\{O,H_1\\}$, $\\{O,H_2\\}$, so its adjacency list has $2+1+1=4$ neighbor entries."
      },
      {
        "title": "Neural network computation graphs",
        "background": "Automatic differentiation stores operations and dependencies as a directed graph.",
        "numbers": "For $z=(x+y)y$, edges $x\\to x+y$, $y\\to x+y$, $y\\to z$, and $x+y\\to z$ record $4$ dependencies."
      }
    ],
    "applicationsClose": "The same connection structure can wear many uniforms: links, friends, molecules, features, and computations all become vertices plus edges.",
    "takeaways": [
      "A graph is $G=(V,E)$: vertices plus edges.",
      "Adjacency lists are compact for sparse graphs; matrices make edge lookup direct.",
      "Undirected simple graph matrices are symmetric with zero diagonal.",
      "The drawing may change, but the adjacency structure is the graph."
    ]
  },
  "math-15-02": {
    "id": "math-15-02",
    "title": "Degree and the handshake lemma",
    "tagline": "Degree counts local connection, and the handshake lemma turns those local counts into a global truth.",
    "connections": {
      "buildsOn": [
        "Graphs and their representations",
        "counting",
        "summation notation"
      ],
      "leadsTo": [
        "Paths and walks",
        "Cycles",
        "Trees"
      ],
      "usedWith": [
        "summations",
        "parity",
        "adjacency matrices",
        "induction"
      ]
    },
    "motivation": "<p>You already know that a busy airport has many routes and a small town may have only one. In a graph, that local busyness is called degree.</p><p>The lovely surprise is that all degrees cannot vary independently. Because every edge touches two endpoints, the total degree count must be exactly twice the number of edges.</p>",
    "definition": "<p>In an undirected graph, the <b>degree</b> $\\deg(v)$ of a vertex $v$ is the number of edges incident to $v$. For a finite simple graph $G=(V,E)$, the <b>handshake lemma</b> says $$\\sum_{v\\in V}\\deg(v)=2|E|.$$</p><p>Why it is true: count endpoint-edge incidences. Each edge $\\{u,v\\}$ contributes one incidence at $u$ and one at $v$, so it contributes $2$ to the sum of degrees. Adding over all edges gives $2|E|$.</p><p><b>Assumptions that matter:</b> this statement is for finite undirected graphs; a loop would contribute $2$ to degree by convention; and in a simple graph no pair of vertices has more than one edge.</p>",
    "worked": {
      "problem": "A graph has degrees $3,2,2,1,0$. How many edges does it have, and how many vertices have odd degree?",
      "skills": [
        "degree sequences",
        "summation",
        "parity"
      ],
      "strategy": "Add the degrees first; the edge count is half that total.",
      "steps": [
        {
          "do": "Add the degrees",
          "result": "$3+2+2+1+0=8$",
          "why": "the handshake lemma starts with the total degree"
        },
        {
          "do": "Apply the handshake lemma",
          "result": "$8=2|E|$",
          "why": "degree sum equals twice the number of edges"
        },
        {
          "do": "Solve for $|E|$",
          "result": "$|E|=4$",
          "why": "divide by $2$"
        },
        {
          "do": "Identify odd degrees",
          "result": "$3$ and $1$",
          "why": "odd means not divisible by $2$"
        },
        {
          "do": "Count odd-degree vertices",
          "result": "$2$",
          "why": "there are two odd entries"
        }
      ],
      "verify": "The degree sum is even, as it must be, and the number of odd-degree vertices is even.",
      "answer": "The graph has $4$ edges and $2$ odd-degree vertices.",
      "connects": "Degree is local, but the handshake lemma makes it globally constrained."
    },
    "practice": [
      {
        "problem": "Find $|E|$ for degrees $2,2,2,2$.",
        "steps": [
          {
            "do": "Add degrees",
            "result": "$2+2+2+2=8$",
            "why": "sum all local counts"
          },
          {
            "do": "Use handshake",
            "result": "$8=2|E|$",
            "why": "each edge contributes two degree counts"
          },
          {
            "do": "Divide by $2$",
            "result": "$|E|=4$",
            "why": "solve for edges"
          },
          {
            "do": "Check parity",
            "result": "$8$ is even",
            "why": "degree sums in undirected graphs are even"
          },
          {
            "do": "Interpret",
            "result": "four edges total",
            "why": "the graph may be a $4$-cycle"
          }
        ],
        "answer": "$|E|=4$."
      },
      {
        "problem": "Can a simple graph have degrees $3,3,1$?",
        "steps": [
          {
            "do": "Add degrees",
            "result": "$3+3+1=7$",
            "why": "test the handshake condition"
          },
          {
            "do": "Check evenness",
            "result": "$7$ is odd",
            "why": "twice the number of edges must be even"
          },
          {
            "do": "Apply contradiction",
            "result": "impossible",
            "why": "no integer $|E|$ has $2|E|=7$"
          },
          {
            "do": "Count odd degrees",
            "result": "$3$ odd vertices",
            "why": "odd-degree vertices must come in an even count"
          },
          {
            "do": "State conclusion",
            "result": "not graphical",
            "why": "it cannot be a finite undirected graph"
          }
        ],
        "answer": "No. The degree sum is odd, so no such undirected graph exists."
      },
      {
        "problem": "A graph has $12$ vertices each of degree $5$. How many edges are there?",
        "steps": [
          {
            "do": "Compute degree sum",
            "result": "$12\\cdot5=60$",
            "why": "regular degree times vertex count"
          },
          {
            "do": "Use handshake",
            "result": "$60=2|E|$",
            "why": "each edge counted twice"
          },
          {
            "do": "Divide by $2$",
            "result": "$|E|=30$",
            "why": "solve for edges"
          },
          {
            "do": "Check plausibility",
            "result": "maximum is $\\binom{12}{2}=66$",
            "why": "$30$ is possible by count"
          },
          {
            "do": "State result",
            "result": "$30$ edges",
            "why": "attach the graph quantity"
          }
        ],
        "answer": "There are $30$ edges."
      },
      {
        "problem": "In a graph with $9$ edges, all vertices except two have total degree $14$. What is the sum of the two remaining degrees?",
        "steps": [
          {
            "do": "Compute total degree",
            "result": "$2|E|=18$",
            "why": "handshake lemma"
          },
          {
            "do": "Subtract known degree",
            "result": "$18-14=4$",
            "why": "remaining degrees make up the rest"
          },
          {
            "do": "Check nonnegativity",
            "result": "$4\\ge0$",
            "why": "degree sums cannot be negative"
          },
          {
            "do": "Note parity",
            "result": "remaining sum is even",
            "why": "it could be $0+4$, $1+3$, or $2+2$"
          },
          {
            "do": "State answer",
            "result": "$4$",
            "why": "the exact split is not determined"
          }
        ],
        "answer": "The two remaining degrees sum to $4$."
      },
      {
        "problem": "An undirected user graph has $2,000,000$ friendship edges. What is the average degree among $500,000$ users?",
        "steps": [
          {
            "do": "Compute total degree",
            "result": "$2\\cdot2,000,000=4,000,000$",
            "why": "each friendship contributes to two users"
          },
          {
            "do": "Write average degree",
            "result": "$4,000,000/500,000$",
            "why": "average is total divided by vertices"
          },
          {
            "do": "Divide",
            "result": "$8$",
            "why": "simplify the quotient"
          },
          {
            "do": "Interpret",
            "result": "average user has $8$ friendships",
            "why": "individual degrees can differ"
          },
          {
            "do": "Connect to sparsity",
            "result": "$8\\ll499,999$",
            "why": "the network is sparse compared with all possible friends"
          }
        ],
        "answer": "The average degree is $8$."
      }
    ],
    "applications": [
      {
        "title": "Friendship networks",
        "background": "Undirected friendship graphs are the namesake of the lemma: every friendship raises two people's friend counts.",
        "numbers": "If there are $10,000$ friendships, the sum of all friend counts is $20,000$."
      },
      {
        "title": "Average degree",
        "background": "Network scientists summarize sparsity with average degree before choosing algorithms.",
        "numbers": "A graph with $n=1000$ and $m=3000$ has average degree $2m/n=6000/1000=6$."
      },
      {
        "title": "Molecule valence checks",
        "background": "Chemical graphs use degrees to approximate valence and catch invalid structures.",
        "numbers": "Methane has carbon degree $4$ and four hydrogen degrees $1$, so the degree sum is $8$ and there are $4$ bonds."
      },
      {
        "title": "Feature engineering",
        "background": "Graph ML often uses node degree as a first structural feature.",
        "numbers": "If a creator connects to $37$ advertisers, the scalar feature $\\deg(v)=37$ can enter a ranking model."
      },
      {
        "title": "Anomaly detection",
        "background": "Unexpectedly high degree can signal spam, bots, or hubs in network data.",
        "numbers": "If median degree is $12$ but one account has degree $5000$, its degree is about $417$ times the median."
      },
      {
        "title": "Storage estimates",
        "background": "Degree sums estimate adjacency-list memory for undirected graphs.",
        "numbers": "For $m=75,000$ edges, adjacency lists contain $2m=150,000$ neighbor ids."
      }
    ],
    "applicationsClose": "Degree counting is humble but powerful: every local endpoint count is tied to a global edge count.",
    "takeaways": [
      "$\\deg(v)$ counts edges incident to vertex $v$.",
      "The handshake lemma is $\\sum_v\\deg(v)=2|E|$.",
      "Every finite undirected graph has an even number of odd-degree vertices.",
      "Average degree is $2|E|/|V|$."
    ]
  },
  "math-15-03": {
    "id": "math-15-03",
    "title": "Paths and walks",
    "tagline": "Walks let you move through a graph; paths remember not to repeat vertices.",
    "connections": {
      "buildsOn": [
        "Graphs and their representations",
        "Degree and the handshake lemma",
        "sequences"
      ],
      "leadsTo": [
        "Cycles",
        "Connectivity",
        "Breadth-first search"
      ],
      "usedWith": [
        "sequences",
        "relations",
        "induction",
        "matrix powers"
      ]
    },
    "motivation": "<p>You already know the difference between wandering and taking a clean route. A graph makes that distinction precise.</p><p>A walk may revisit places; a path is a no-repeated-vertices route. This simple vocabulary is the foundation for reachability, shortest paths, and graph search.</p>",
    "definition": "<p>A <b>walk</b> from $v_0$ to $v_k$ is a sequence $v_0,v_1,\\ldots,v_k$ where each consecutive pair is joined by an edge. Its length is $k$, the number of edges traversed. A <b>trail</b> repeats no edge. A <b>path</b> repeats no vertex.</p><p>Every path is a walk because it satisfies the same adjacency condition plus a stricter no-repeat rule. If a walk repeats a vertex, the closed loop between the repeats can be removed to produce a shorter walk with the same endpoints; repeating this gives a path whenever any walk exists.</p><p><b>Assumptions that matter:</b> length counts edges, not vertices; a single vertex is a path of length $0$; and in directed graphs every step must follow edge direction.</p>",
    "worked": {
      "problem": "In the graph with edges $AB,BC,CD,BD$, classify the sequence $A,B,C,B,D$ as a walk, trail, or path, and find its length.",
      "skills": [
        "walks",
        "trails",
        "paths"
      ],
      "strategy": "Check adjacency first, then check repeated edges and vertices.",
      "steps": [
        {
          "do": "Check $A$ to $B$",
          "result": "edge $AB$ exists",
          "why": "consecutive vertices must be adjacent"
        },
        {
          "do": "Check $B$ to $C$",
          "result": "edge $BC$ exists",
          "why": "second step is valid"
        },
        {
          "do": "Check $C$ to $B$",
          "result": "edge $BC$ exists",
          "why": "undirected edges can be used in either direction"
        },
        {
          "do": "Check $B$ to $D$",
          "result": "edge $BD$ exists",
          "why": "last step is valid"
        },
        {
          "do": "Count steps",
          "result": "$4$",
          "why": "length is the number of edge traversals"
        },
        {
          "do": "Check repeated edge",
          "result": "$BC$ is used twice",
          "why": "once as $B,C$ and once as $C,B$"
        },
        {
          "do": "Check repeated vertex",
          "result": "$B$ repeats",
          "why": "a path cannot repeat vertices"
        }
      ],
      "verify": "It is a valid walk of length $4$, but not a trail or path because it repeats an edge and a vertex.",
      "answer": "The sequence is a walk of length $4$ only.",
      "connects": "Paths are walks with memory: they avoid revisiting vertices."
    },
    "practice": [
      {
        "problem": "Is $A,C,D$ a path if the only edges are $AB,BC,CD$?",
        "steps": [
          {
            "do": "Check first step",
            "result": "$A$ to $C$",
            "why": "a path needs every consecutive pair adjacent"
          },
          {
            "do": "Look for edge $AC$",
            "result": "not present",
            "why": "only $AB$, $BC$, and $CD$ are available"
          },
          {
            "do": "Stop classification",
            "result": "not a walk",
            "why": "failure of adjacency is enough"
          },
          {
            "do": "Explain path status",
            "result": "not a path",
            "why": "every path must first be a walk"
          },
          {
            "do": "Offer a valid route",
            "result": "$A,B,C,D$",
            "why": "this sequence uses existing edges"
          }
        ],
        "answer": "No. $A,C,D$ is not even a walk; $A,B,C,D$ is a path."
      },
      {
        "problem": "For sequence $1,2,3,4$ with all consecutive edges present and no repeated vertices, classify it and find length.",
        "steps": [
          {
            "do": "Check adjacency",
            "result": "all consecutive edges exist",
            "why": "given in the problem"
          },
          {
            "do": "Count vertices",
            "result": "$4$ vertices",
            "why": "the sequence lists four positions"
          },
          {
            "do": "Count edges traversed",
            "result": "$3$",
            "why": "length is one less than the number of vertices"
          },
          {
            "do": "Check repeated vertices",
            "result": "none",
            "why": "path condition is satisfied"
          },
          {
            "do": "Classify",
            "result": "walk, trail, and path",
            "why": "a path is also a trail and walk"
          }
        ],
        "answer": "It is a path, trail, and walk of length $3$."
      },
      {
        "problem": "A walk $P,Q,R,Q,S$ uses edges $PQ,QR,QS$. Remove a repeated-vertex loop to get a path from $P$ to $S$.",
        "steps": [
          {
            "do": "Find the repeated vertex",
            "result": "$Q$",
            "why": "it appears in positions 2 and 4"
          },
          {
            "do": "Identify the loop segment",
            "result": "$Q,R,Q$",
            "why": "it starts and ends at the repeat"
          },
          {
            "do": "Remove that segment interior",
            "result": "$P,Q,S$",
            "why": "keep one copy of $Q$ to connect endpoints"
          },
          {
            "do": "Check adjacency",
            "result": "$PQ$ and $QS$ exist",
            "why": "the shortened sequence is valid"
          },
          {
            "do": "Check no repeats",
            "result": "$P,Q,S$ are distinct",
            "why": "it is a path"
          }
        ],
        "answer": "A path from $P$ to $S$ is $P,Q,S$."
      },
      {
        "problem": "In a directed graph with $A\\to B$, $B\\to C$, and $C\\to A$, is $C,A,B$ a directed path?",
        "steps": [
          {
            "do": "Check $C$ to $A$",
            "result": "$C\\to A$ exists",
            "why": "directed steps must follow arrows"
          },
          {
            "do": "Check $A$ to $B$",
            "result": "$A\\to B$ exists",
            "why": "the second arrow is present"
          },
          {
            "do": "Count length",
            "result": "$2$",
            "why": "two directed edges are traversed"
          },
          {
            "do": "Check repeated vertices",
            "result": "none",
            "why": "$C,A,B$ are distinct"
          },
          {
            "do": "Classify",
            "result": "directed path",
            "why": "all conditions hold"
          }
        ],
        "answer": "Yes. It is a directed path of length $2$."
      },
      {
        "problem": "A recommender graph has user $U$ connected to item $I_1$, $I_1$ to user $V$, and $V$ to item $I_2$. Interpret the path $U,I_1,V,I_2$.",
        "steps": [
          {
            "do": "Check first edge",
            "result": "$U$ used $I_1$",
            "why": "user-item edge exists"
          },
          {
            "do": "Check second edge",
            "result": "$I_1$ connects to $V$",
            "why": "another user used the same item"
          },
          {
            "do": "Check third edge",
            "result": "$V$ connects to $I_2$",
            "why": "that user used a second item"
          },
          {
            "do": "Count length",
            "result": "$3$",
            "why": "three relationships link $U$ to $I_2$"
          },
          {
            "do": "Interpret recommendation",
            "result": "$I_2$ is reachable through a similar user",
            "why": "the path gives collaborative evidence"
          }
        ],
        "answer": "The length-$3$ path says $U$ and $V$ share $I_1$, and $V$'s item $I_2$ may be recommendable to $U$."
      }
    ],
    "applications": [
      {
        "title": "Routing",
        "background": "Road and packet networks both need legal step-by-step routes through allowed connections.",
        "numbers": "A route $A,B,D,E$ has length $3$ because it traverses $AB$, $BD$, and $DE$."
      },
      {
        "title": "Collaborative filtering",
        "background": "User-item graphs use short paths to find similar users and candidate items.",
        "numbers": "The path user $U\\to$ item $X\\to$ user $V\\to$ item $Y$ has length $3$ and suggests $Y$."
      },
      {
        "title": "Knowledge graph reasoning",
        "background": "Multi-hop questions follow paths through facts rather than one direct edge.",
        "numbers": "If $Ada\\to London$ and $London\\to UK$, a length-$2$ path links Ada to UK."
      },
      {
        "title": "Program dependencies",
        "background": "Build systems walk dependency graphs to decide what must be compiled first.",
        "numbers": "If app depends on library $B$ and $B$ depends on $C$, the path app,$B$,$C$ has length $2$."
      },
      {
        "title": "Random walks",
        "background": "Many graph algorithms deliberately wander with walks that may revisit vertices.",
        "numbers": "A walk $A,B,A,C$ has length $3$ and revisits $A$, so it is useful for sampling but not a path."
      },
      {
        "title": "Matrix powers",
        "background": "Adjacency matrices count walks algebraically, linking graph movement to linear algebra.",
        "numbers": "If $(A^2)_{ij}=5$, there are $5$ walks of length $2$ from $i$ to $j$."
      }
    ],
    "applicationsClose": "From routing to recommendations, graph movement begins with the same question: which sequences of adjacent vertices are allowed?",
    "takeaways": [
      "A walk is an adjacent vertex sequence; its length is the number of edges used.",
      "A path is a walk with no repeated vertices.",
      "If a walk connects two vertices, a path also connects them after removing loops.",
      "Directed walks must follow edge directions."
    ]
  },
  "math-15-04": {
    "id": "math-15-04",
    "title": "Cycles",
    "tagline": "A cycle is a path that comes home, and its presence changes what a graph can guarantee.",
    "connections": {
      "buildsOn": [
        "Paths and walks",
        "Degree and the handshake lemma",
        "graphs and their representations"
      ],
      "leadsTo": [
        "Connectivity",
        "Trees",
        "Spanning trees"
      ],
      "usedWith": [
        "paths",
        "closed walks",
        "parity",
        "induction"
      ]
    },
    "motivation": "<p>You know the feeling of walking around a block and ending where you started. In a graph, that closed clean route is a cycle.</p><p>Cycles are the difference between a network with redundancy and a tree-like network with exactly one way between places. They are small loops with big consequences.</p>",
    "definition": "<p>A <b>cycle</b> is a sequence $v_0,v_1,\\ldots,v_k$ with $k\\ge3$, where $v_0=v_k$, consecutive vertices are adjacent, and $v_0,\\ldots,v_{k-1}$ are distinct. Its length is $k$.</p><p>A cycle is a closed walk with no repeated vertices except the return to the start. The condition $k\\ge3$ rules out immediate backtracking in a simple undirected graph. If every vertex in a finite graph has degree at least $2$, following unused exits must eventually repeat a vertex, and the first repeat contains a cycle.</p><p><b>Assumptions that matter:</b> this lesson uses simple undirected graphs unless stated otherwise; the same cycle can be written starting at different vertices; and reversing a cycle does not make a different undirected cycle.</p>",
    "worked": {
      "problem": "Show that $A,B,C,D,A$ is a cycle in a graph with edges $AB,BC,CD,DA,AC$, and state its length.",
      "skills": [
        "cycle definition",
        "closed walks",
        "length"
      ],
      "strategy": "Check closedness, adjacency, distinct interior vertices, and length.",
      "steps": [
        {
          "do": "Check the start and end",
          "result": "both are $A$",
          "why": "a cycle returns to its starting vertex"
        },
        {
          "do": "Check $A$ to $B$",
          "result": "edge $AB$ exists",
          "why": "each consecutive pair must be adjacent"
        },
        {
          "do": "Check $B$ to $C$",
          "result": "edge $BC$ exists",
          "why": "second step is valid"
        },
        {
          "do": "Check $C$ to $D$",
          "result": "edge $CD$ exists",
          "why": "third step is valid"
        },
        {
          "do": "Check $D$ to $A$",
          "result": "edge $DA$ exists",
          "why": "the return step is valid"
        },
        {
          "do": "Check distinct nonfinal vertices",
          "result": "$A,B,C,D$ are distinct",
          "why": "no vertex repeats before returning home"
        },
        {
          "do": "Count edges",
          "result": "$4$",
          "why": "four steps are traversed"
        }
      ],
      "verify": "The extra edge $AC$ is a chord, but it does not prevent $A,B,C,D,A$ from being a cycle.",
      "answer": "$A,B,C,D,A$ is a cycle of length $4$.",
      "connects": "A cycle is a clean closed path."
    },
    "practice": [
      {
        "problem": "Is $A,B,A$ a cycle in a simple graph with edge $AB$?",
        "steps": [
          {
            "do": "List the sequence length",
            "result": "$2$ edges",
            "why": "it goes $A\\to B\\to A$"
          },
          {
            "do": "Compare to cycle minimum",
            "result": "need $k\\ge3$",
            "why": "simple cycles have at least three edges"
          },
          {
            "do": "Check repeated edge",
            "result": "$AB$ is used twice",
            "why": "this is immediate backtracking"
          },
          {
            "do": "Classify",
            "result": "closed walk",
            "why": "it starts and ends at $A$"
          },
          {
            "do": "State conclusion",
            "result": "not a cycle",
            "why": "it fails the length and simplicity idea"
          }
        ],
        "answer": "No. It is a closed walk of length $2$, not a cycle."
      },
      {
        "problem": "Find a cycle in the graph with edges $12,23,31,34$.",
        "steps": [
          {
            "do": "Look for a closed triangle",
            "result": "$1,2,3,1$",
            "why": "edges $12$, $23$, and $31$ are present"
          },
          {
            "do": "Check adjacency",
            "result": "all three edges exist",
            "why": "each step is legal"
          },
          {
            "do": "Check return",
            "result": "starts and ends at $1$",
            "why": "closed condition holds"
          },
          {
            "do": "Check distinct vertices",
            "result": "$1,2,3$ are distinct",
            "why": "no repeat before return"
          },
          {
            "do": "State length",
            "result": "$3$",
            "why": "three edges are used"
          }
        ],
        "answer": "$1,2,3,1$ is a cycle of length $3$."
      },
      {
        "problem": "A graph has vertices $A,B,C,D$ and edges $AB,BC,CD$. Does it contain a cycle?",
        "steps": [
          {
            "do": "Inspect the structure",
            "result": "a single chain",
            "why": "edges connect vertices in a line"
          },
          {
            "do": "Check possible closed route",
            "result": "none from endpoints",
            "why": "$A$ and $D$ have degree $1$"
          },
          {
            "do": "Use edge count intuition",
            "result": "$3$ edges on $4$ connected vertices",
            "why": "a tree-like count suggests no cycle"
          },
          {
            "do": "Try to return from $A$",
            "result": "must go back along used edges",
            "why": "that would repeat vertices before a cycle"
          },
          {
            "do": "Conclude",
            "result": "acyclic",
            "why": "no simple closed route exists"
          }
        ],
        "answer": "No. The graph is a path on four vertices and has no cycle."
      },
      {
        "problem": "In a square with one diagonal $AC$, list two different cycles.",
        "steps": [
          {
            "do": "Use the outside square",
            "result": "$A,B,C,D,A$",
            "why": "all four boundary edges are present"
          },
          {
            "do": "State its length",
            "result": "$4$",
            "why": "four boundary edges"
          },
          {
            "do": "Use the diagonal for a triangle",
            "result": "$A,B,C,A$",
            "why": "edges $AB$, $BC$, and $AC$ are present"
          },
          {
            "do": "State triangle length",
            "result": "$3$",
            "why": "three edges"
          },
          {
            "do": "Note another triangle",
            "result": "$A,C,D,A$",
            "why": "the same diagonal makes a second triangle"
          }
        ],
        "answer": "Examples include $A,B,C,D,A$ and $A,B,C,A$."
      },
      {
        "problem": "A dependency graph for tasks has a directed cycle $A\\to B\\to C\\to A$. Why is scheduling impossible without breaking an edge?",
        "steps": [
          {
            "do": "Read $A\\to B$",
            "result": "$A$ must precede $B$",
            "why": "directed edge gives an ordering requirement"
          },
          {
            "do": "Read $B\\to C$",
            "result": "$B$ must precede $C$",
            "why": "second requirement"
          },
          {
            "do": "Read $C\\to A$",
            "result": "$C$ must precede $A$",
            "why": "third requirement closes the loop"
          },
          {
            "do": "Chain the requirements",
            "result": "$A$ before $B$ before $C$ before $A$",
            "why": "the order demands $A$ before itself"
          },
          {
            "do": "Conclude",
            "result": "impossible as stated",
            "why": "one dependency must be removed or changed"
          }
        ],
        "answer": "The cycle creates contradictory precedence constraints, so no valid schedule exists until the cycle is broken."
      }
    ],
    "applications": [
      {
        "title": "Network redundancy",
        "background": "Cycles give alternate routes, which is why communication networks often avoid pure tree shapes.",
        "numbers": "In cycle $A,B,C,D,A$, if edge $AB$ fails, $A$ can still reach $B$ through $A,D,C,B$ with length $3$."
      },
      {
        "title": "Deadlock detection",
        "background": "Operating systems look for cycles in resource-wait graphs to detect deadlocks.",
        "numbers": "If process $P_1$ waits for $P_2$, $P_2$ waits for $P_3$, and $P_3$ waits for $P_1$, the length-$3$ cycle signals deadlock risk."
      },
      {
        "title": "Build systems",
        "background": "Directed cycles in dependencies prevent a clean topological order.",
        "numbers": "Edges $parser\\to lexer$ and $lexer\\to parser$ form a length-$2$ directed cycle of mutual dependence."
      },
      {
        "title": "Chemistry rings",
        "background": "Molecular rings are graph cycles and strongly affect chemical properties.",
        "numbers": "Benzene is modeled as a $6$-cycle of carbon atoms, so it has $6$ ring edges."
      },
      {
        "title": "Graph neural networks",
        "background": "Cycles affect how messages return to a node through neighbors.",
        "numbers": "On triangle $A,B,C,A$, a two-layer message from $A$ can return through $A\\to B\\to C$ only with additional steps around the loop."
      },
      {
        "title": "Error-correcting codes",
        "background": "Factor graphs with short cycles can make belief propagation double-count evidence.",
        "numbers": "A $4$-cycle variable-check-variable-check-variable lets information return after $4$ messages."
      }
    ],
    "applicationsClose": "Cycles are loops of possibility and constraint: they give redundancy in routes but trouble in dependencies.",
    "takeaways": [
      "A cycle is a closed path of length at least $3$ in a simple undirected graph.",
      "Cycles can be written from different starting points without changing the underlying loop.",
      "Graphs without cycles are acyclic and lead naturally to trees.",
      "Directed cycles can represent circular dependencies."
    ]
  },
  "math-15-05": {
    "id": "math-15-05",
    "title": "Connectivity",
    "tagline": "Connectivity asks whether every place in the graph can reach every other place.",
    "connections": {
      "buildsOn": [
        "Paths and walks",
        "Cycles",
        "graphs and their representations"
      ],
      "leadsTo": [
        "Trees",
        "Spanning trees",
        "Breadth-first search"
      ],
      "usedWith": [
        "equivalence relations",
        "partitions",
        "paths",
        "components"
      ]
    },
    "motivation": "<p>A map is less useful if it secretly breaks into islands. Graph connectivity names that simple concern: can you get from here to there?</p><p>Once connectivity is clear, a graph can be split into components, searched systematically, or repaired by adding the right edges.</p>",
    "definition": "<p>An undirected graph is <b>connected</b> if for every pair of vertices $u,v\\in V$, there is a path from $u$ to $v$. A <b>connected component</b> is a largest set of vertices that are mutually reachable.</p><p>Reachability behaves like an equivalence relation: every vertex reaches itself by a length-$0$ path, paths can be reversed in undirected graphs, and two paths can be concatenated. Therefore vertices partition into components.</p><p><b>Assumptions that matter:</b> connected means path-connected in the graph; isolated vertices form one-vertex components; and directed graphs require separate notions such as strong and weak connectivity.</p>",
    "worked": {
      "problem": "Find the connected components of a graph with vertices $A,B,C,D,E$ and edges $AB,BC,DE$.",
      "skills": [
        "paths",
        "components",
        "partitions"
      ],
      "strategy": "Start from one vertex, collect everything reachable, then repeat with any unvisited vertex.",
      "steps": [
        {
          "do": "Start at $A$",
          "result": "reachable vertices include $A$",
          "why": "a vertex reaches itself"
        },
        {
          "do": "Follow edge $AB$",
          "result": "add $B$",
          "why": "$A$ is adjacent to $B$"
        },
        {
          "do": "Follow edge $BC$",
          "result": "add $C$",
          "why": "$B$ connects onward to $C$"
        },
        {
          "do": "Stop first component",
          "result": "$\\{A,B,C\\}$",
          "why": "no edge from these vertices reaches $D$ or $E$"
        },
        {
          "do": "Start at $D$",
          "result": "add $D$",
          "why": "choose an unvisited vertex"
        },
        {
          "do": "Follow edge $DE$",
          "result": "add $E$",
          "why": "$D$ and $E$ are adjacent"
        },
        {
          "do": "State components",
          "result": "$\\{A,B,C\\}$ and $\\{D,E\\}$",
          "why": "all vertices are now assigned"
        }
      ],
      "verify": "There is no path from $A$ to $D$, so two components are necessary.",
      "answer": "The components are $\\{A,B,C\\}$ and $\\{D,E\\}$.",
      "connects": "Connectivity turns many local edges into global reachability."
    },
    "practice": [
      {
        "problem": "Is the graph with edges $AB,BC,CD$ connected on vertices $A,B,C,D$?",
        "steps": [
          {
            "do": "Trace from $A$",
            "result": "$A\\to B\\to C\\to D$",
            "why": "the chain reaches every vertex"
          },
          {
            "do": "Check $B$ to $D$",
            "result": "$B\\to C\\to D$",
            "why": "interior pairs are reachable"
          },
          {
            "do": "Check $C$ to $A$",
            "result": "$C\\to B\\to A$",
            "why": "undirected paths reverse"
          },
          {
            "do": "Collect component",
            "result": "$\\{A,B,C,D\\}$",
            "why": "all vertices are mutually reachable"
          },
          {
            "do": "Conclude",
            "result": "connected",
            "why": "there is one component"
          }
        ],
        "answer": "Yes, the graph is connected."
      },
      {
        "problem": "How many components does a graph of $4$ vertices and no edges have?",
        "steps": [
          {
            "do": "Start with one vertex",
            "result": "it reaches only itself",
            "why": "no edges leave it"
          },
          {
            "do": "Repeat for each vertex",
            "result": "four singleton sets",
            "why": "each vertex is isolated"
          },
          {
            "do": "Check maximality",
            "result": "no singleton can merge",
            "why": "no path connects distinct vertices"
          },
          {
            "do": "Count components",
            "result": "$4$",
            "why": "one per vertex"
          },
          {
            "do": "State result",
            "result": "four components",
            "why": "the graph is totally disconnected"
          }
        ],
        "answer": "It has $4$ connected components."
      },
      {
        "problem": "Edges are $12,23,45,56,64$. List components.",
        "steps": [
          {
            "do": "Start at $1$",
            "result": "reach $1,2,3$",
            "why": "edges $12$ and $23$ form a chain"
          },
          {
            "do": "Stop first set",
            "result": "$\\{1,2,3\\}$",
            "why": "no listed edge leaves it"
          },
          {
            "do": "Start at $4$",
            "result": "reach $4,5,6$",
            "why": "edges form a triangle-like component"
          },
          {
            "do": "Stop second set",
            "result": "$\\{4,5,6\\}$",
            "why": "all remaining vertices are included"
          },
          {
            "do": "State partition",
            "result": "$\\{1,2,3\\}$, $\\{4,5,6\\}$",
            "why": "components partition vertices"
          }
        ],
        "answer": "The components are $\\{1,2,3\\}$ and $\\{4,5,6\\}$."
      },
      {
        "problem": "A graph has $3$ connected components. What is the fewest edges needed to make it connected?",
        "steps": [
          {
            "do": "Think of components as super-vertices",
            "result": "$3$ pieces",
            "why": "inside each piece is already reachable"
          },
          {
            "do": "Connect two components",
            "result": "one edge reduces component count by $1$",
            "why": "it merges two pieces"
          },
          {
            "do": "Need one component",
            "result": "reduce from $3$ to $1$",
            "why": "two reductions are needed"
          },
          {
            "do": "Compute edges",
            "result": "$3-1=2$",
            "why": "a tree on components has $c-1$ edges"
          },
          {
            "do": "State answer",
            "result": "$2$ edges",
            "why": "chosen between different components"
          }
        ],
        "answer": "At least $2$ new edges are needed."
      },
      {
        "problem": "A service graph has components of sizes $120$, $75$, and $5$. What fraction of nodes are in the largest component?",
        "steps": [
          {
            "do": "Add sizes",
            "result": "$120+75+5=200$",
            "why": "total nodes"
          },
          {
            "do": "Identify largest",
            "result": "$120$",
            "why": "largest component size"
          },
          {
            "do": "Write fraction",
            "result": "$120/200$",
            "why": "part over whole"
          },
          {
            "do": "Simplify",
            "result": "$0.60$",
            "why": "divide numerator and denominator by $200$"
          },
          {
            "do": "Interpret",
            "result": "$60\\%$",
            "why": "most but not all nodes are connected together"
          }
        ],
        "answer": "The largest component contains $60\\%$ of the nodes."
      }
    ],
    "applications": [
      {
        "title": "Network outage analysis",
        "background": "Engineers measure components after failures to see who remains reachable.",
        "numbers": "If a $1000$-node network splits into components $920$, $50$, and $30$, then $92\\%$ remain in the largest component."
      },
      {
        "title": "Social communities",
        "background": "Disconnected components can reveal separate populations or data-ingestion gaps.",
        "numbers": "A user graph with component sizes $10,000$ and $12$ suggests a tiny isolated group worth inspecting."
      },
      {
        "title": "Image segmentation",
        "background": "Connected components label neighboring pixels that belong to the same object.",
        "numbers": "If a binary image has blobs of $35$, $80$, and $12$ pixels, the largest connected component has $80$ pixels."
      },
      {
        "title": "Distributed systems",
        "background": "Service dependency graphs must stay connected enough for requests to flow.",
        "numbers": "If frontend reaches API and API reaches database, a path of length $2$ connects frontend to database."
      },
      {
        "title": "Graph ML sampling",
        "background": "Training often samples from the giant component to avoid isolated nodes with little context.",
        "numbers": "If $9500$ of $10,000$ nodes are in one component, sampling there covers $95\\%$ of nodes."
      },
      {
        "title": "Transportation planning",
        "background": "Connectivity checks whether every station can reach the rest of a transit network.",
        "numbers": "Adding one bridge edge between two subway components reduces components from $2$ to $1$."
      }
    ],
    "applicationsClose": "Connectivity is the graph's answer to belonging: which vertices live in the same reachable world?",
    "takeaways": [
      "A graph is connected when every pair of vertices has a path between them.",
      "Components are maximal mutually reachable vertex sets.",
      "Reachability partitions an undirected graph into components.",
      "Connecting $c$ components needs at least $c-1$ new edges."
    ]
  },
  "math-15-06": {
    "id": "math-15-06",
    "title": "Trees",
    "tagline": "A tree is connected without waste: exactly enough edges to hold everything together.",
    "connections": {
      "buildsOn": [
        "Connectivity",
        "Cycles",
        "degree counting"
      ],
      "leadsTo": [
        "Spanning trees",
        "Breadth-first search",
        "Minimum spanning trees"
      ],
      "usedWith": [
        "induction",
        "recursion",
        "paths",
        "acyclic graphs"
      ]
    },
    "motivation": "<p>You have seen family trees and folder trees: branching structures with no loop that brings you back. Graph theory makes that picture exact.</p><p>Trees matter because they are the simplest connected graphs. Remove any edge and connection breaks; add any new edge and a cycle appears.</p>",
    "definition": "<p>A <b>tree</b> is a connected undirected graph with no cycles. For a finite tree with $n$ vertices, the number of edges is $n-1$.</p><p>One reason: every tree with at least two vertices has a leaf, a vertex of degree $1$. Removing a leaf and its edge leaves a smaller tree. Repeating this removes one edge per removed vertex, so starting from $n$ vertices ends with $n-1$ edges.</p><p><b>Assumptions that matter:</b> a one-vertex graph is a tree with $0$ edges; finite tree facts may fail for infinite graphs without care; and connected plus acyclic are both required.</p>",
    "worked": {
      "problem": "A connected graph has $8$ vertices and $7$ edges. If it has no cycles, is it a tree?",
      "skills": [
        "tree definition",
        "edge count",
        "acyclicity"
      ],
      "strategy": "Use the definition first, then check the tree edge count as a consistency check.",
      "steps": [
        {
          "do": "Read connectedness",
          "result": "connected",
          "why": "given by the problem"
        },
        {
          "do": "Read cycle condition",
          "result": "no cycles",
          "why": "given by the problem"
        },
        {
          "do": "Apply definition",
          "result": "tree",
          "why": "connected plus acyclic means tree"
        },
        {
          "do": "Compute tree edge count",
          "result": "$8-1=7$",
          "why": "a tree on $n$ vertices has $n-1$ edges"
        },
        {
          "do": "Compare with given edges",
          "result": "$7=7$",
          "why": "the count agrees"
        }
      ],
      "verify": "Both defining conditions hold, and the edge count matches the theorem.",
      "answer": "Yes. It is a tree.",
      "connects": "Trees are exactly connected acyclic graphs."
    },
    "practice": [
      {
        "problem": "How many edges does a tree with $15$ vertices have?",
        "steps": [
          {
            "do": "Name $n$",
            "result": "$n=15$",
            "why": "tree formula uses vertex count"
          },
          {
            "do": "Apply formula",
            "result": "$n-1$",
            "why": "finite trees have one fewer edge than vertices"
          },
          {
            "do": "Compute",
            "result": "$15-1=14$",
            "why": "subtract one"
          },
          {
            "do": "Check positivity",
            "result": "$14$ edges",
            "why": "reasonable for connected sparse graph"
          },
          {
            "do": "State result",
            "result": "$14$",
            "why": "attach units"
          }
        ],
        "answer": "It has $14$ edges."
      },
      {
        "problem": "Can a connected graph with $6$ vertices and $6$ edges be a tree?",
        "steps": [
          {
            "do": "Compute tree edge count",
            "result": "$6-1=5$",
            "why": "a tree with $6$ vertices has $5$ edges"
          },
          {
            "do": "Compare edges",
            "result": "$6>5$",
            "why": "one extra edge exists"
          },
          {
            "do": "Use cycle fact",
            "result": "extra edge creates a cycle",
            "why": "connected graph beyond $n-1$ edges cannot be acyclic"
          },
          {
            "do": "Apply definition",
            "result": "not a tree",
            "why": "acyclicity fails"
          },
          {
            "do": "State conclusion",
            "result": "no",
            "why": "it has at least one cycle"
          }
        ],
        "answer": "No. It must contain a cycle."
      },
      {
        "problem": "A tree has degree sequence $3,2,1,1,1$. Verify it is consistent.",
        "steps": [
          {
            "do": "Count vertices",
            "result": "$5$",
            "why": "five degree entries"
          },
          {
            "do": "Compute expected edges",
            "result": "$5-1=4$",
            "why": "tree edge count"
          },
          {
            "do": "Compute expected degree sum",
            "result": "$2\\cdot4=8$",
            "why": "handshake lemma"
          },
          {
            "do": "Add degrees",
            "result": "$3+2+1+1+1=8$",
            "why": "actual sum"
          },
          {
            "do": "Compare",
            "result": "$8=8$",
            "why": "the sequence passes this necessary check"
          }
        ],
        "answer": "The degree sum is consistent with a $5$-vertex tree."
      },
      {
        "problem": "Why does removing a leaf from a tree with $n>1$ vertices leave a tree?",
        "steps": [
          {
            "do": "Remove the leaf vertex",
            "result": "one degree-$1$ vertex disappears",
            "why": "a leaf has one incident edge"
          },
          {
            "do": "Remove its incident edge",
            "result": "one edge disappears",
            "why": "that edge only served the leaf"
          },
          {
            "do": "Check connectivity among remaining vertices",
            "result": "still connected",
            "why": "paths between other vertices did not need to pass through the leaf"
          },
          {
            "do": "Check cycles",
            "result": "none appear",
            "why": "removing cannot create a cycle"
          },
          {
            "do": "Conclude",
            "result": "remaining graph is a tree",
            "why": "connected and acyclic remain true"
          }
        ],
        "answer": "The remaining graph is connected and acyclic, so it is a tree."
      },
      {
        "problem": "A decision tree model has $31$ nodes and is a tree. How many parent-child edges does it have?",
        "steps": [
          {
            "do": "Identify vertex count",
            "result": "$n=31$",
            "why": "nodes are vertices"
          },
          {
            "do": "Apply tree formula",
            "result": "$n-1$",
            "why": "a tree has one fewer edge"
          },
          {
            "do": "Compute",
            "result": "$30$",
            "why": "$31-1=30$"
          },
          {
            "do": "Interpret edges",
            "result": "parent-child links",
            "why": "each non-root node has one parent"
          },
          {
            "do": "Check with root view",
            "result": "$31-1$ non-root nodes",
            "why": "one incoming edge per non-root node"
          }
        ],
        "answer": "It has $30$ parent-child edges."
      }
    ],
    "applications": [
      {
        "title": "Decision trees",
        "background": "ML decision trees branch without cycles so each input follows one root-to-leaf route.",
        "numbers": "A tree with $16$ leaves and full binary splits has $31$ total nodes and $30$ edges."
      },
      {
        "title": "File systems",
        "background": "Directories are organized as trees to give each file a unique path from the root.",
        "numbers": "If a folder tree has $120$ folders/files, it has $119$ parent-child links."
      },
      {
        "title": "Parse trees",
        "background": "Compilers represent expressions as trees so nested operations have a clear structure.",
        "numbers": "Expression $(a+b)c$ has operator nodes $+$ and $\\cdot$ plus leaves $a,b,c$, giving $5$ nodes and $4$ edges."
      },
      {
        "title": "Phylogenetics",
        "background": "Evolutionary trees model branching ancestry without cycles.",
        "numbers": "A rooted binary tree with $8$ species leaves has $7$ internal branching nodes and $14$ edges."
      },
      {
        "title": "Broadcast protocols",
        "background": "A tree-shaped broadcast avoids duplicate messages while reaching everyone.",
        "numbers": "To reach $100$ machines in a tree, exactly $99$ transmissions along edges suffice."
      },
      {
        "title": "Hierarchical clustering",
        "background": "Dendrograms are trees showing how clusters merge over thresholds.",
        "numbers": "Merging $10$ singleton clusters into one requires $9$ merge events, matching the tree idea."
      }
    ],
    "applicationsClose": "Trees are the minimal connected skeletons hiding inside many hierarchical systems.",
    "takeaways": [
      "A tree is connected and acyclic.",
      "A finite tree with $n$ vertices has $n-1$ edges.",
      "Every edge of a tree is essential for connectivity.",
      "Adding one edge to a tree creates a cycle."
    ]
  },
  "math-15-07": {
    "id": "math-15-07",
    "title": "Spanning trees",
    "tagline": "A spanning tree keeps every vertex connected while trimming away every cycle.",
    "connections": {
      "buildsOn": [
        "Trees",
        "Connectivity",
        "Cycles"
      ],
      "leadsTo": [
        "Breadth-first search",
        "Depth-first search",
        "Minimum spanning trees"
      ],
      "usedWith": [
        "subgraphs",
        "trees",
        "cycle removal",
        "induction"
      ]
    },
    "motivation": "<p>A connected graph may have many redundant edges. That redundancy is useful, but sometimes you want the clean backbone.</p><p>A spanning tree is that backbone: all vertices remain, just enough edges stay to connect them, and every cycle has been removed.</p>",
    "definition": "<p>A <b>spanning tree</b> of a connected graph $G=(V,E)$ is a subgraph $T=(V,E_T)$ that uses all vertices, is connected, and is a tree. Therefore if $|V|=n$, then $|E_T|=n-1$.</p><p>Existence comes from cycle removal. Start with a connected graph. If it has a cycle, remove one edge from that cycle; the graph stays connected because the rest of the cycle still gives an alternate route. Repeat until no cycles remain.</p><p><b>Assumptions that matter:</b> a spanning tree exists only for connected undirected graphs; disconnected graphs have spanning forests; and edge weights are irrelevant here until minimum spanning trees.</p>",
    "worked": {
      "problem": "Find a spanning tree for the graph with vertices $A,B,C,D$ and edges $AB,BC,CD,DA,AC$.",
      "skills": [
        "subgraphs",
        "cycle removal",
        "tree edge count"
      ],
      "strategy": "Keep all vertices and choose enough edges to connect them without closing a loop.",
      "steps": [
        {
          "do": "Count vertices",
          "result": "$4$",
          "why": "the spanning tree must include all four"
        },
        {
          "do": "Compute needed edges",
          "result": "$4-1=3$",
          "why": "a tree on four vertices has three edges"
        },
        {
          "do": "Choose edge $AB$",
          "result": "include $AB$",
          "why": "start connecting from $A$"
        },
        {
          "do": "Choose edge $BC$",
          "result": "include $BC$",
          "why": "now $A,B,C$ are connected"
        },
        {
          "do": "Choose edge $CD$",
          "result": "include $CD$",
          "why": "now $D$ is connected too"
        },
        {
          "do": "Check for a cycle",
          "result": "none",
          "why": "$A,B,C,D$ forms a simple chain"
        },
        {
          "do": "State subgraph",
          "result": "edges $AB,BC,CD$",
          "why": "all vertices are spanned"
        }
      ],
      "verify": "The selected subgraph is connected, has $3$ edges on $4$ vertices, and has no cycle.",
      "answer": "One spanning tree uses edges $AB,BC,CD$.",
      "connects": "A spanning tree is the connected graph's cycle-free skeleton."
    },
    "practice": [
      {
        "problem": "How many edges are in any spanning tree of a connected graph with $20$ vertices?",
        "steps": [
          {
            "do": "Set $n$",
            "result": "$n=20$",
            "why": "spanning tree uses all vertices"
          },
          {
            "do": "Use tree edge formula",
            "result": "$n-1$",
            "why": "any tree on $n$ vertices has $n-1$ edges"
          },
          {
            "do": "Compute",
            "result": "$19$",
            "why": "subtract one"
          },
          {
            "do": "Note independence",
            "result": "original edge count does not matter",
            "why": "extra edges are removed"
          },
          {
            "do": "State answer",
            "result": "$19$ edges",
            "why": "all spanning trees have this count"
          }
        ],
        "answer": "Every spanning tree has $19$ edges."
      },
      {
        "problem": "Does a disconnected graph have a spanning tree?",
        "steps": [
          {
            "do": "Recall definition",
            "result": "spanning tree must be connected",
            "why": "tree condition includes connectivity"
          },
          {
            "do": "Read disconnected graph",
            "result": "some vertices have no path between them",
            "why": "components are separate"
          },
          {
            "do": "Consider subgraphs",
            "result": "removing edges cannot create new paths",
            "why": "a subgraph cannot connect components"
          },
          {
            "do": "Apply definition",
            "result": "no spanning tree",
            "why": "connectivity cannot be achieved"
          },
          {
            "do": "Name alternative",
            "result": "spanning forest",
            "why": "one tree per component"
          }
        ],
        "answer": "No. A disconnected graph has a spanning forest, not a spanning tree."
      },
      {
        "problem": "From cycle $A,B,C,A$ plus edge $C,D$, remove one edge to get a spanning tree.",
        "steps": [
          {
            "do": "Count vertices",
            "result": "$4$",
            "why": "need $3$ tree edges"
          },
          {
            "do": "Identify cycle",
            "result": "$A,B,C,A$",
            "why": "triangle has redundant edge"
          },
          {
            "do": "Remove edge $AC$",
            "result": "remaining edges $AB,BC,CD$",
            "why": "break the cycle"
          },
          {
            "do": "Check connectedness",
            "result": "$A-B-C-D$",
            "why": "all vertices are in one chain"
          },
          {
            "do": "Check edge count",
            "result": "$3$",
            "why": "matches $n-1$"
          }
        ],
        "answer": "Removing $AC$ leaves spanning tree $AB,BC,CD$."
      },
      {
        "problem": "A connected graph has $8$ vertices and $12$ edges. How many edges must be removed to reach a spanning tree?",
        "steps": [
          {
            "do": "Compute spanning-tree edges",
            "result": "$8-1=7$",
            "why": "tree edge count"
          },
          {
            "do": "Compare original edges",
            "result": "$12-7=5$",
            "why": "extra edges beyond a tree"
          },
          {
            "do": "Interpret removals",
            "result": "remove $5$ edges",
            "why": "cycle edges can be deleted"
          },
          {
            "do": "Check vertices",
            "result": "none removed",
            "why": "spanning keeps all vertices"
          },
          {
            "do": "State result",
            "result": "$5$",
            "why": "assuming removals preserve connectivity"
          }
        ],
        "answer": "Remove $5$ edges."
      },
      {
        "problem": "A network wants to send one broadcast to all $50$ nodes using a spanning tree. How many transmissions along edges are needed?",
        "steps": [
          {
            "do": "Identify nodes",
            "result": "$n=50$",
            "why": "all nodes must be reached"
          },
          {
            "do": "Use spanning tree edge count",
            "result": "$49$",
            "why": "tree has $n-1$ edges"
          },
          {
            "do": "Assign one transmission per tree edge",
            "result": "$49$ transmissions",
            "why": "broadcast crosses each selected link once"
          },
          {
            "do": "Compare to dense graph",
            "result": "fewer than all links",
            "why": "redundant edges are unused"
          },
          {
            "do": "State answer",
            "result": "$49$",
            "why": "one per spanning-tree edge"
          }
        ],
        "answer": "A spanning-tree broadcast uses $49$ edge transmissions."
      }
    ],
    "applications": [
      {
        "title": "Network broadcast",
        "background": "Spanning trees prevent broadcast storms by forwarding along a loop-free backbone.",
        "numbers": "For $500$ switches, a spanning tree uses $499$ active links."
      },
      {
        "title": "Circuit design",
        "background": "Loop-free connection backbones can reduce redundant wiring while preserving reachability.",
        "numbers": "Connecting $12$ modules minimally takes $11$ wires in a spanning tree."
      },
      {
        "title": "Clustering",
        "background": "A graph can be summarized by a tree backbone before cutting weak links into clusters.",
        "numbers": "A spanning tree on $100$ points has $99$ edges; cutting $4$ edges produces $5$ components."
      },
      {
        "title": "Maze generation",
        "background": "Perfect mazes are spanning trees of grid graphs: every cell reachable with no loops.",
        "numbers": "A $10\\times10$ grid has $100$ cells, so a perfect maze has $99$ open passages."
      },
      {
        "title": "Data lineage",
        "background": "A spanning tree can choose one explanation parent per artifact while keeping all artifacts reachable.",
        "numbers": "For $30$ artifacts, the lineage tree has $29$ selected dependency links."
      },
      {
        "title": "Approximation algorithms",
        "background": "Many graph algorithms first build a spanning tree as a cheap connected scaffold.",
        "numbers": "If a connected graph has $1000$ vertices and $5000$ edges, the scaffold keeps $999$ edges and ignores $4001$."
      }
    ],
    "applicationsClose": "A spanning tree keeps the promise of connectivity while removing every loop of redundancy.",
    "takeaways": [
      "A spanning tree includes all vertices and is a tree.",
      "Every spanning tree on $n$ vertices has $n-1$ edges.",
      "Connected graphs have spanning trees by repeated cycle removal.",
      "Disconnected graphs have spanning forests instead."
    ]
  },
  "math-15-08": {
    "id": "math-15-08",
    "title": "Breadth-first search",
    "tagline": "Breadth-first search explores a graph in waves, so the first time it reaches a vertex is by a shortest unweighted path.",
    "connections": {
      "buildsOn": [
        "Spanning trees",
        "Connectivity",
        "Paths and walks"
      ],
      "leadsTo": [
        "Depth-first search",
        "Dijkstra's shortest paths",
        "Network flows"
      ],
      "usedWith": [
        "queues",
        "levels",
        "shortest paths",
        "trees"
      ]
    },
    "motivation": "<p>If you ask who is one friendship away, then two friendships away, then three, you are already thinking breadth-first.</p><p><b>Breadth-first search</b> is the disciplined version: use a queue, explore nearest vertices first, and record levels from the start.</p>",
    "definition": "<p>Breadth-first search, or <b>BFS</b>, starts at a source vertex $s$, marks $s$ at distance $0$, and repeatedly removes the oldest discovered vertex from a queue. Any undiscovered neighbor gets distance one more than the current vertex and is added to the queue.</p><p>The shortest-path guarantee comes from the queue order. All vertices at distance $d$ are processed before vertices at distance $d+1$, so when a vertex is first discovered, no shorter unweighted path is still waiting.</p><p><b>Assumptions that matter:</b> BFS shortest distances count edges and require unweighted graphs; neighbor order can change the BFS tree but not distances; and disconnected vertices remain undiscovered from the source.</p>",
    "worked": {
      "problem": "Run BFS from $A$ on edges $AB,AC,BD,CE,DE$. Give distances from $A$.",
      "skills": [
        "queues",
        "levels",
        "unweighted shortest paths"
      ],
      "strategy": "Process vertices by increasing distance from $A$.",
      "steps": [
        {
          "do": "Initialize",
          "result": "$d(A)=0$",
          "why": "the source is zero edges from itself"
        },
        {
          "do": "Discover neighbors of $A$",
          "result": "$d(B)=1$, $d(C)=1$",
          "why": "$B$ and $C$ are one edge away"
        },
        {
          "do": "Process $B$",
          "result": "discover $D$ with $d(D)=2$",
          "why": "path $A,B,D$ has length $2$"
        },
        {
          "do": "Process $C$",
          "result": "discover $E$ with $d(E)=2$",
          "why": "path $A,C,E$ has length $2$"
        },
        {
          "do": "Process $D$",
          "result": "no shorter new discovery",
          "why": "$E$ is already at distance $2$"
        },
        {
          "do": "Process $E$",
          "result": "no new vertices",
          "why": "all reachable vertices are found"
        }
      ],
      "verify": "Every edge connects vertices whose BFS levels differ by at most one here, so no listed distance can be shortened.",
      "answer": "Distances are $d(A)=0$, $d(B)=1$, $d(C)=1$, $d(D)=2$, $d(E)=2$.",
      "connects": "BFS layers are shortest-path layers in unweighted graphs."
    },
    "practice": [
      {
        "problem": "In a star centered at $S$ with leaves $A,B,C$, run BFS from $S$.",
        "steps": [
          {
            "do": "Start at $S$",
            "result": "$d(S)=0$",
            "why": "source level"
          },
          {
            "do": "Inspect neighbors",
            "result": "$A,B,C$",
            "why": "all leaves are adjacent to $S$"
          },
          {
            "do": "Assign distances",
            "result": "$d(A)=d(B)=d(C)=1$",
            "why": "one edge from source"
          },
          {
            "do": "Process leaves",
            "result": "no new vertices",
            "why": "leaves connect only to $S$"
          },
          {
            "do": "State tree edges",
            "result": "$SA,SB,SC$",
            "why": "BFS tree is the star"
          }
        ],
        "answer": "Distances are $0$ for $S$ and $1$ for each leaf."
      },
      {
        "problem": "On path $1-2-3-4-5$, run BFS from $1$.",
        "steps": [
          {
            "do": "Start",
            "result": "$d(1)=0$",
            "why": "source"
          },
          {
            "do": "Discover $2$",
            "result": "$d(2)=1$",
            "why": "one edge away"
          },
          {
            "do": "Discover $3$",
            "result": "$d(3)=2$",
            "why": "through $2$"
          },
          {
            "do": "Discover $4$",
            "result": "$d(4)=3$",
            "why": "through $3$"
          },
          {
            "do": "Discover $5$",
            "result": "$d(5)=4$",
            "why": "through $4$"
          }
        ],
        "answer": "Distances are $0,1,2,3,4$ from vertex $1$."
      },
      {
        "problem": "Why can BFS ignore a later path of length $4$ to a vertex already discovered at length $2$?",
        "steps": [
          {
            "do": "Record first discovery",
            "result": "distance $2$",
            "why": "BFS found the vertex in level $2$"
          },
          {
            "do": "Use BFS order",
            "result": "levels increase by one",
            "why": "all shorter paths would have been explored first"
          },
          {
            "do": "Compare later path",
            "result": "$4>2$",
            "why": "it is not shorter"
          },
          {
            "do": "Keep old distance",
            "result": "$2$",
            "why": "shortest known is already better"
          },
          {
            "do": "Conclude",
            "result": "ignore for distance update",
            "why": "unweighted BFS first discovery is optimal"
          }
        ],
        "answer": "Because first discovery at level $2$ is already a shortest unweighted distance."
      },
      {
        "problem": "A graph has components $\\{A,B\\}$ and $\\{C,D\\}$. What does BFS from $A$ discover?",
        "steps": [
          {
            "do": "Start at $A$",
            "result": "discover $A$",
            "why": "source"
          },
          {
            "do": "Follow component edge",
            "result": "discover $B$",
            "why": "$B$ is connected to $A$"
          },
          {
            "do": "Look for cross edges",
            "result": "none",
            "why": "components are disconnected"
          },
          {
            "do": "Leave $C,D$",
            "result": "undiscovered",
            "why": "no path from $A$"
          },
          {
            "do": "State reachable set",
            "result": "$\\{A,B\\}$",
            "why": "BFS finds the source component"
          }
        ],
        "answer": "It discovers only $A$ and $B$."
      },
      {
        "problem": "In a word-ladder graph, changing one letter is one edge. If BFS finds CAT to DOG at level $4$, what does that mean?",
        "steps": [
          {
            "do": "Interpret vertices",
            "result": "words",
            "why": "each word is a graph vertex"
          },
          {
            "do": "Interpret edges",
            "result": "one-letter changes",
            "why": "unweighted steps"
          },
          {
            "do": "Read BFS level",
            "result": "$4$",
            "why": "DOG first appears after four edges"
          },
          {
            "do": "Use BFS guarantee",
            "result": "shortest ladder length is $4$",
            "why": "no shorter sequence exists"
          },
          {
            "do": "State meaning",
            "result": "four single-letter changes",
            "why": "CAT can become DOG in minimum four moves"
          }
        ],
        "answer": "The shortest word ladder from CAT to DOG uses $4$ one-letter changes."
      }
    ],
    "applications": [
      {
        "title": "Unweighted routing",
        "background": "BFS gives hop counts when every link has equal cost.",
        "numbers": "If router $T$ is discovered at level $5$, the minimum hop count from the source is $5$."
      },
      {
        "title": "Social distance",
        "background": "Degrees of separation are BFS levels in a friendship graph.",
        "numbers": "Your friends are level $1$; friends of friends not already seen are level $2$."
      },
      {
        "title": "Web crawling",
        "background": "Crawlers often explore links in breadth-first order to cover nearby pages before deep chains.",
        "numbers": "Starting from one page with $20$ links, the first wave can add up to $20$ level-$1$ pages."
      },
      {
        "title": "Puzzle solving",
        "background": "For puzzles with equal-cost moves, BFS finds the fewest moves.",
        "numbers": "If a state appears at depth $12$, then a $12$-move solution exists and no shorter one was missed."
      },
      {
        "title": "Bipartite checking",
        "background": "BFS levels can color a graph by parity to test bipartiteness.",
        "numbers": "Assign even levels blue and odd levels red; an edge within the same level reveals an odd cycle."
      },
      {
        "title": "Graph ML neighborhoods",
        "background": "Many neighborhood features collect nodes within $k$ BFS hops.",
        "numbers": "A $2$-hop neighborhood may include $10$ one-hop neighbors and $35$ new two-hop neighbors, total $45$ context nodes."
      }
    ],
    "applicationsClose": "BFS is the graph's ripple pattern: distance emerges from the order of discovery.",
    "takeaways": [
      "BFS uses a queue to explore vertices by increasing unweighted distance.",
      "First discovery gives a shortest path length in unweighted graphs.",
      "BFS from one source finds exactly that source's connected component.",
      "The BFS tree can vary with neighbor order, but distances do not."
    ]
  },
  "math-15-09": {
    "id": "math-15-09",
    "title": "Depth-first search",
    "tagline": "Depth-first search follows one path deeply before backtracking to try the next choice.",
    "connections": {
      "buildsOn": [
        "Breadth-first search",
        "Paths and walks",
        "Trees"
      ],
      "leadsTo": [
        "Dijkstra's shortest paths",
        "topological order",
        "connected components"
      ],
      "usedWith": [
        "recursion",
        "stacks",
        "trees",
        "cycles"
      ]
    },
    "motivation": "<p>Sometimes you explore a maze by committing to one corridor until it ends, then backing up. That instinct is depth-first search.</p><p><b>Depth-first search</b> is less about nearest distances and more about structure: components, cycles, finishing times, and rooted search trees.</p>",
    "definition": "<p>Depth-first search, or <b>DFS</b>, starts at a vertex, marks it visited, recursively visits an unvisited neighbor, and backtracks when no unvisited neighbor remains. Equivalently, it uses a stack.</p><p>DFS creates a search forest. Each tree edge records the first time a vertex is discovered. The backtracking order gives finishing times, which are useful because a vertex finishes only after all vertices reachable through its unvisited descendants have been explored.</p><p><b>Assumptions that matter:</b> DFS order depends on neighbor ordering; it does not guarantee shortest paths; and disconnected graphs require restarting DFS from unvisited vertices to cover all components.</p>",
    "worked": {
      "problem": "Run DFS from $A$ using alphabetical neighbors on edges $AB,AC,BD,CE$. List discovery order.",
      "skills": [
        "recursion",
        "stacks",
        "discovery order"
      ],
      "strategy": "Always take the alphabetically first unvisited neighbor, and backtrack only when stuck.",
      "steps": [
        {
          "do": "Start at $A$",
          "result": "discover $A$",
          "why": "source is visited first"
        },
        {
          "do": "Choose first neighbor of $A$",
          "result": "discover $B$",
          "why": "$B$ comes before $C$ alphabetically"
        },
        {
          "do": "Choose neighbor of $B$",
          "result": "discover $D$",
          "why": "$A$ is already visited, so go to $D$"
        },
        {
          "do": "Backtrack from $D$",
          "result": "return to $B$",
          "why": "$D$ has no unvisited neighbors"
        },
        {
          "do": "Backtrack to $A$",
          "result": "consider $C$",
          "why": "$B$ branch is done"
        },
        {
          "do": "Visit $C$",
          "result": "discover $C$",
          "why": "$C$ remains unvisited"
        },
        {
          "do": "Visit neighbor of $C$",
          "result": "discover $E$",
          "why": "$E$ is unvisited"
        }
      ],
      "verify": "The order follows one branch $A,B,D$ before returning to explore $C,E$.",
      "answer": "Discovery order: $A,B,D,C,E$.",
      "connects": "DFS is organized backtracking through graph choices."
    },
    "practice": [
      {
        "problem": "On path $1-2-3-4$, run DFS from $1$.",
        "steps": [
          {
            "do": "Start at $1$",
            "result": "discover $1$",
            "why": "source"
          },
          {
            "do": "Go to $2$",
            "result": "discover $2$",
            "why": "only unvisited neighbor"
          },
          {
            "do": "Go to $3$",
            "result": "discover $3$",
            "why": "continue down the path"
          },
          {
            "do": "Go to $4$",
            "result": "discover $4$",
            "why": "last unvisited neighbor"
          },
          {
            "do": "Backtrack",
            "result": "finish $4,3,2,1$",
            "why": "the path is exhausted"
          }
        ],
        "answer": "Discovery order is $1,2,3,4$."
      },
      {
        "problem": "Why is DFS not a shortest-path algorithm?",
        "steps": [
          {
            "do": "Consider choices",
            "result": "DFS commits to one neighbor",
            "why": "it may take a long branch first"
          },
          {
            "do": "Compare alternatives",
            "result": "a shorter edge may wait",
            "why": "DFS does not process by distance"
          },
          {
            "do": "Name BFS property",
            "result": "BFS explores levels",
            "why": "DFS lacks that queue-level order"
          },
          {
            "do": "Conclude",
            "result": "first discovery may be long",
            "why": "DFS can find a nonshortest route"
          },
          {
            "do": "State use",
            "result": "structure, not shortest unweighted distance",
            "why": "DFS is still valuable"
          }
        ],
        "answer": "DFS may discover a vertex through a long branch before a shorter route is explored."
      },
      {
        "problem": "A DFS sees an edge from a vertex to an already active ancestor in an undirected graph. What does it indicate?",
        "steps": [
          {
            "do": "Identify active ancestor",
            "result": "currently on recursion stack",
            "why": "not merely finished"
          },
          {
            "do": "Add the new edge",
            "result": "connects descendant to ancestor",
            "why": "it closes a route back"
          },
          {
            "do": "Combine with tree path",
            "result": "ancestor to descendant path already exists",
            "why": "tree edges give one route"
          },
          {
            "do": "Form closed route",
            "result": "tree path plus edge",
            "why": "this is a cycle"
          },
          {
            "do": "State indication",
            "result": "cycle present",
            "why": "DFS detects a loop"
          }
        ],
        "answer": "It indicates a cycle."
      },
      {
        "problem": "How does DFS cover a disconnected graph?",
        "steps": [
          {
            "do": "Start first DFS",
            "result": "visits one component",
            "why": "DFS follows reachable edges"
          },
          {
            "do": "Find unvisited vertex",
            "result": "choose a vertex not reached",
            "why": "it lies in another component"
          },
          {
            "do": "Restart DFS",
            "result": "visits that component",
            "why": "a new search tree begins"
          },
          {
            "do": "Repeat",
            "result": "until none unvisited",
            "why": "all components are covered"
          },
          {
            "do": "Name result",
            "result": "DFS forest",
            "why": "one tree per discovered component"
          }
        ],
        "answer": "Restart DFS from unvisited vertices; the result is a DFS forest."
      },
      {
        "problem": "A web crawler uses DFS and follows $10$ links down one chain before backtracking. What risk does that create compared with BFS?",
        "steps": [
          {
            "do": "Read DFS behavior",
            "result": "goes deep first",
            "why": "one chain can dominate early work"
          },
          {
            "do": "Compare breadth coverage",
            "result": "nearby pages wait",
            "why": "other source links are delayed"
          },
          {
            "do": "Quantify delay",
            "result": "$9$ deeper pages before sibling link",
            "why": "the crawler spent depth budget on one path"
          },
          {
            "do": "Name risk",
            "result": "poor early coverage",
            "why": "important nearby pages may be missed for a while"
          },
          {
            "do": "State tradeoff",
            "result": "low memory but less balanced",
            "why": "DFS uses stack-like exploration"
          }
        ],
        "answer": "DFS can delay broad coverage, following a deep chain before visiting other nearby pages."
      }
    ],
    "applications": [
      {
        "title": "Maze solving",
        "background": "DFS is the classic backtracking maze strategy: try a corridor, retreat at dead ends.",
        "numbers": "In a maze graph, a DFS path of length $12$ may be found before a shortest path of length $8$."
      },
      {
        "title": "Cycle detection",
        "background": "Compilers and build tools use DFS to find circular dependencies.",
        "numbers": "If DFS sees $A\\to B\\to C\\to A$, the active-stack edge back to $A$ reports a cycle."
      },
      {
        "title": "Topological sorting",
        "background": "Directed acyclic graphs can be ordered by reverse DFS finishing times.",
        "numbers": "If task $C$ finishes before dependency $B$ in DFS, reversing finish order can place $B$ before $C$."
      },
      {
        "title": "Connected components",
        "background": "DFS labels all vertices reachable from a start, then restarts for other components.",
        "numbers": "If restarts happen $4$ times, the graph has $4$ components."
      },
      {
        "title": "Program analysis",
        "background": "Control-flow analysis explores possible execution paths with DFS-like recursion.",
        "numbers": "A branch graph with two nested if-statements can expose $4$ possible path leaves."
      },
      {
        "title": "Memory tradeoffs",
        "background": "DFS often stores a path stack rather than a whole frontier.",
        "numbers": "In a depth-$100$ tree with branching factor $3$, DFS stack can hold about $100$ path nodes while BFS near the bottom may face $3^{10}=59049$ nodes at just level $10$."
      }
    ],
    "applicationsClose": "DFS is the patient explorer: it uncovers graph structure by going deep, finishing, and returning.",
    "takeaways": [
      "DFS uses recursion or a stack to explore deeply before backtracking.",
      "DFS discovery order depends on neighbor order.",
      "DFS does not guarantee shortest paths.",
      "DFS forests reveal components, cycles, and useful finishing orders."
    ]
  },
  "math-15-10": {
    "id": "math-15-10",
    "title": "Dijkstra's shortest paths",
    "tagline": "Dijkstra's algorithm grows a settled region in order of cheapest known distance.",
    "connections": {
      "buildsOn": [
        "Breadth-first search",
        "weighted graphs",
        "paths"
      ],
      "leadsTo": [
        "Bellman–Ford",
        "Minimum spanning trees",
        "Network flows"
      ],
      "usedWith": [
        "priority queues",
        "greedy algorithms",
        "inequalities",
        "weighted paths"
      ]
    },
    "motivation": "<p>BFS treats every edge as one step. But roads have lengths, links have latencies, and actions have costs.</p><p>Dijkstra's algorithm is the weighted version for nonnegative edges. It repeatedly trusts the unsettled vertex with the smallest tentative distance.</p>",
    "definition": "<p>For a weighted graph with nonnegative edge weights $w(u,v)\\ge0$, Dijkstra's algorithm maintains tentative distances $d(v)$ from a source $s$. It repeatedly selects an unsettled vertex with smallest $d(v)$, settles it, and relaxes its outgoing edges by testing whether $d(u)+w(u,v)<d(v)$.</p><p>The greedy step is safe because weights are nonnegative. Any alternate path to the smallest unsettled vertex would have to pass through another unsettled vertex with distance at least as large, then add a nonnegative edge, so it cannot be cheaper.</p><p><b>Assumptions that matter:</b> edge weights must be nonnegative; unreachable vertices keep distance $\\infty$; and directed graphs relax only outgoing edges.</p>",
    "worked": {
      "problem": "Run Dijkstra from $A$ with edges $AB=2$, $AC=5$, $BC=1$, $BD=4$, $CD=1$.",
      "skills": [
        "relaxation",
        "greedy choice",
        "weighted paths"
      ],
      "strategy": "Set tentative distances, then repeatedly settle the smallest unsettled distance.",
      "steps": [
        {
          "do": "Initialize distances",
          "result": "$d(A)=0$, others $\\infty$",
          "why": "source starts at zero"
        },
        {
          "do": "Settle $A$",
          "result": "relax $B$ to $2$ and $C$ to $5$",
          "why": "use edges out of $A$"
        },
        {
          "do": "Settle $B$",
          "result": "smallest unsettled distance is $2$",
          "why": "$2<5$"
        },
        {
          "do": "Relax edge $BC$",
          "result": "$d(C)=3$",
          "why": "$2+1=3$ improves $5$"
        },
        {
          "do": "Relax edge $BD$",
          "result": "$d(D)=6$",
          "why": "$2+4=6$ improves $\\infty$"
        },
        {
          "do": "Settle $C$",
          "result": "smallest unsettled distance is $3$",
          "why": "$3<6$"
        },
        {
          "do": "Relax edge $CD$",
          "result": "$d(D)=4$",
          "why": "$3+1=4$ improves $6$"
        },
        {
          "do": "Settle $D$",
          "result": "final distance $4$",
          "why": "all vertices are settled"
        }
      ],
      "verify": "The path $A,B,C,D$ costs $2+1+1=4$, matching the final distance to $D$.",
      "answer": "Distances are $d(A)=0$, $d(B)=2$, $d(C)=3$, $d(D)=4$.",
      "connects": "Dijkstra is BFS with cost-aware waves, valid when costs never go negative."
    },
    "practice": [
      {
        "problem": "From $S$, edges $SA=4$, $SB=1$, $BA=2$. Find shortest distance to $A$.",
        "steps": [
          {
            "do": "Initialize",
            "result": "$d(S)=0$, $d(A)=d(B)=\\infty$",
            "why": "source setup"
          },
          {
            "do": "Settle $S$",
            "result": "$d(A)=4$, $d(B)=1$",
            "why": "relax outgoing edges"
          },
          {
            "do": "Choose next",
            "result": "$B$",
            "why": "$1<4$"
          },
          {
            "do": "Relax $BA$",
            "result": "$d(A)=3$",
            "why": "$1+2=3$ improves $4$"
          },
          {
            "do": "Settle $A$",
            "result": "distance $3$",
            "why": "no smaller unsettled distance remains"
          }
        ],
        "answer": "The shortest distance to $A$ is $3$ via $S,B,A$."
      },
      {
        "problem": "Why does Dijkstra fail with negative edges?",
        "steps": [
          {
            "do": "Name greedy claim",
            "result": "settled distance is final",
            "why": "Dijkstra relies on this"
          },
          {
            "do": "Add negative edge possibility",
            "result": "later path can decrease cost",
            "why": "a future edge may subtract distance"
          },
          {
            "do": "Break safety proof",
            "result": "nonnegative inequality fails",
            "why": "adding an edge need not increase cost"
          },
          {
            "do": "Give tiny example",
            "result": "$S\\to A=2$, $S\\to B=5$, $B\\to A=-4$",
            "why": "$A$ settled at $2$ before better cost $1$ appears"
          },
          {
            "do": "Conclude",
            "result": "negative weights need another method",
            "why": "Bellman-Ford handles them"
          }
        ],
        "answer": "Negative edges can reveal a cheaper path after a vertex was already settled."
      },
      {
        "problem": "If Dijkstra settles vertices with distances $0,3,7,7,10$, can a later distance be $6$?",
        "steps": [
          {
            "do": "Read order property",
            "result": "settled distances are nondecreasing",
            "why": "always choose the smallest tentative value"
          },
          {
            "do": "Compare $6$ to last settled $10$",
            "result": "$6<10$",
            "why": "that would be out of order"
          },
          {
            "do": "Use priority rule",
            "result": "a tentative $6$ would have been chosen earlier",
            "why": "before $7$ or $10$"
          },
          {
            "do": "Assume no negative weights",
            "result": "distances cannot later drop below settled order",
            "why": "Dijkstra setting"
          },
          {
            "do": "Conclude",
            "result": "no",
            "why": "not in a correct run"
          }
        ],
        "answer": "No. Settled distances cannot decrease in Dijkstra's algorithm."
      },
      {
        "problem": "A graph has $d(U)=8$ and edge $UV=3$, while current $d(V)=15$. Relax $UV$.",
        "steps": [
          {
            "do": "Compute candidate",
            "result": "$d(U)+w(U,V)=8+3=11$",
            "why": "path through $U$"
          },
          {
            "do": "Compare with current",
            "result": "$11<15$",
            "why": "candidate is better"
          },
          {
            "do": "Update distance",
            "result": "$d(V)=11$",
            "why": "relaxation improves the estimate"
          },
          {
            "do": "Record predecessor",
            "result": "$pred(V)=U$",
            "why": "needed to reconstruct path"
          },
          {
            "do": "State result",
            "result": "$V$ improves to $11$",
            "why": "the old value is replaced"
          }
        ],
        "answer": "After relaxation, $d(V)=11$ and predecessor of $V$ is $U$."
      },
      {
        "problem": "A latency graph has route $A\\to B\\to D$ costs $12+8$ ms and $A\\to C\\to D$ costs $5+20$ ms. Which route is shorter?",
        "steps": [
          {
            "do": "Compute first route",
            "result": "$12+8=20$ ms",
            "why": "sum edge weights"
          },
          {
            "do": "Compute second route",
            "result": "$5+20=25$ ms",
            "why": "sum edge weights"
          },
          {
            "do": "Compare costs",
            "result": "$20<25$",
            "why": "smaller latency wins"
          },
          {
            "do": "Choose route",
            "result": "$A\\to B\\to D$",
            "why": "cost is lower"
          },
          {
            "do": "Interpret",
            "result": "save $5$ ms",
            "why": "difference $25-20=5$"
          }
        ],
        "answer": "$A\\to B\\to D$ is shorter at $20$ ms, saving $5$ ms."
      }
    ],
    "applications": [
      {
        "title": "Maps",
        "background": "Road navigation uses Dijkstra-like methods when edge costs are nonnegative travel times.",
        "numbers": "A route with edges $3.2$, $4.8$, and $2.0$ km has total length $10.0$ km."
      },
      {
        "title": "Network latency",
        "background": "Routers estimate least-latency paths through links with nonnegative delays.",
        "numbers": "Path delays $12+7+5=24$ ms beat $10+20=30$ ms."
      },
      {
        "title": "Game AI",
        "background": "Grid pathfinding uses nonnegative movement costs to guide agents.",
        "numbers": "Moving over grass cost $2$ and road cost $1$ makes three road steps cost $3$ versus two grass steps cost $4$."
      },
      {
        "title": "Robotics",
        "background": "Motion planners discretize space into weighted graphs of safe moves.",
        "numbers": "If turn cost is $0.5$ and move cost is $1$, a path with $6$ moves and $2$ turns costs $7$."
      },
      {
        "title": "Information retrieval",
        "background": "Weighted graph search can rank paths through entity relationships.",
        "numbers": "A confidence cost path $0.2+0.4+0.1=0.7$ is preferred over $1.3$ when lower cost is better."
      },
      {
        "title": "Feature pipelines",
        "background": "Data lineage systems find cheapest recomputation paths when transformations have costs.",
        "numbers": "If recomputing $X$ costs $6$ and loading cached $Y$ then transforming costs $2+1$, Dijkstra favors cost $3$."
      }
    ],
    "applicationsClose": "Dijkstra turns weighted reachability into an ordered expansion of trustworthy shortest distances.",
    "takeaways": [
      "Dijkstra solves single-source shortest paths with nonnegative edge weights.",
      "Relaxation tests whether going through one vertex improves another distance.",
      "The smallest unsettled tentative distance becomes final under nonnegative weights.",
      "Negative edges require a different algorithm."
    ]
  },
  "math-15-11": {
    "id": "math-15-11",
    "title": "Bellman–Ford",
    "tagline": "Bellman-Ford is slower than Dijkstra, but it can face negative edges honestly.",
    "connections": {
      "buildsOn": [
        "Dijkstra's shortest paths",
        "paths",
        "weighted graphs"
      ],
      "leadsTo": [
        "Network flows",
        "dynamic programming",
        "negative-cycle detection"
      ],
      "usedWith": [
        "relaxation",
        "induction",
        "inequalities",
        "paths"
      ]
    },
    "motivation": "<p>Sometimes a cost can be negative: a rebate, a currency exchange gain, or a modeling reward. Dijkstra's greedy certainty no longer works there.</p><p><b>Bellman-Ford</b> takes a steadier route. It relaxes every edge repeatedly, allowing shortest paths with more and more edges to settle into place.</p>",
    "definition": "<p>Bellman-Ford initializes $d(s)=0$ and all other distances to $\\infty$. Then it relaxes every edge $|V|-1$ times. For edge $u\\to v$ with weight $w(u,v)$, relaxation tests $d(u)+w(u,v)<d(v)$ and updates if true.</p><p>Why $|V|-1$ rounds: any shortest path with no negative cycle can be chosen simple, so it uses at most $|V|-1$ edges. After round $k$, all shortest paths using at most $k$ edges have been accounted for by induction over the last edge.</p><p><b>Assumptions that matter:</b> Bellman-Ford permits negative edges but reports failure if a reachable negative-weight cycle exists; distances to unreachable vertices remain $\\infty$; and edge order can affect intermediate values but not final correct distances.</p>",
    "worked": {
      "problem": "Run Bellman-Ford from $S$ on edges $S\\to A=4$, $S\\to B=5$, $B\\to A=-3$.",
      "skills": [
        "edge relaxation",
        "negative weights",
        "shortest paths"
      ],
      "strategy": "Relax all edges enough times for paths with up to two edges, since there are three vertices.",
      "steps": [
        {
          "do": "Initialize",
          "result": "$d(S)=0$, $d(A)=\\infty$, $d(B)=\\infty$",
          "why": "source setup"
        },
        {
          "do": "Relax $S\\to A$",
          "result": "$d(A)=4$",
          "why": "$0+4$ improves infinity"
        },
        {
          "do": "Relax $S\\to B$",
          "result": "$d(B)=5$",
          "why": "$0+5$ improves infinity"
        },
        {
          "do": "Relax $B\\to A$",
          "result": "$d(A)=2$",
          "why": "$5-3=2$ improves $4$"
        },
        {
          "do": "Start second round",
          "result": "distances are $0,2,5$",
          "why": "one more round checks two-edge paths"
        },
        {
          "do": "Relax all edges again",
          "result": "no change",
          "why": "$A=2$ and $B=5$ are already best"
        }
      ],
      "verify": "The path $S,B,A$ costs $5-3=2$, beating direct edge cost $4$.",
      "answer": "Final distances are $d(S)=0$, $d(B)=5$, and $d(A)=2$.",
      "connects": "Bellman-Ford lets improvements arrive later through negative edges."
    },
    "practice": [
      {
        "problem": "Relax edge $U\\to V$ with $d(U)=6$, weight $-2$, and $d(V)=9$.",
        "steps": [
          {
            "do": "Compute candidate",
            "result": "$6+(-2)=4$",
            "why": "distance through $U$"
          },
          {
            "do": "Compare",
            "result": "$4<9$",
            "why": "candidate improves current value"
          },
          {
            "do": "Update",
            "result": "$d(V)=4$",
            "why": "relaxation succeeds"
          },
          {
            "do": "Record predecessor",
            "result": "$U$",
            "why": "path to $V$ now comes through $U$"
          },
          {
            "do": "State result",
            "result": "$4$",
            "why": "new tentative distance"
          }
        ],
        "answer": "$d(V)$ updates to $4$."
      },
      {
        "problem": "How many relaxation rounds does Bellman-Ford use on $7$ vertices?",
        "steps": [
          {
            "do": "Read vertex count",
            "result": "$|V|=7$",
            "why": "given"
          },
          {
            "do": "Use round formula",
            "result": "$|V|-1$",
            "why": "simple shortest paths use at most this many edges"
          },
          {
            "do": "Compute",
            "result": "$6$",
            "why": "subtract one"
          },
          {
            "do": "Explain purpose",
            "result": "paths up to $6$ edges",
            "why": "covers simple paths"
          },
          {
            "do": "State answer",
            "result": "$6$ rounds",
            "why": "before negative-cycle check"
          }
        ],
        "answer": "It uses $6$ full relaxation rounds."
      },
      {
        "problem": "Detect a negative cycle if after $|V|-1$ rounds edge $A\\to B$ can still improve $d(B)$ from $3$ to $1$.",
        "steps": [
          {
            "do": "Recall finality condition",
            "result": "no edge should improve",
            "why": "after enough rounds without negative cycles"
          },
          {
            "do": "Observe improvement",
            "result": "$1<3$",
            "why": "an update remains possible"
          },
          {
            "do": "Interpret extra improvement",
            "result": "path keeps getting cheaper",
            "why": "requires a repeated vertex"
          },
          {
            "do": "Connect repeated vertex",
            "result": "cycle exists",
            "why": "more than $|V|-1$ useful edges repeat a vertex"
          },
          {
            "do": "Conclude",
            "result": "reachable negative cycle",
            "why": "distances are not well-defined finite minima"
          }
        ],
        "answer": "A reachable negative-weight cycle exists."
      },
      {
        "problem": "Why can shortest paths be assumed simple when there is no negative cycle?",
        "steps": [
          {
            "do": "Suppose a path repeats a vertex",
            "result": "it contains a cycle",
            "why": "the segment between repeats is closed"
          },
          {
            "do": "Consider cycle weight",
            "result": "not negative",
            "why": "no negative cycles exist"
          },
          {
            "do": "Remove the cycle",
            "result": "cost does not increase",
            "why": "removing nonnegative weight is safe"
          },
          {
            "do": "Repeat removal",
            "result": "get a simple path",
            "why": "no repeated vertices remain"
          },
          {
            "do": "Bound length",
            "result": "at most $|V|-1$ edges",
            "why": "simple path visits each vertex once"
          }
        ],
        "answer": "Because any repeated-vertex cycle can be removed without increasing cost."
      },
      {
        "problem": "A currency graph has exchange log-weights around a cycle summing to $-0.04$. What does Bellman-Ford's negative-cycle detection suggest?",
        "steps": [
          {
            "do": "Read cycle weight",
            "result": "$-0.04$",
            "why": "total cost around cycle is negative"
          },
          {
            "do": "Repeat cycle twice",
            "result": "$-0.08$",
            "why": "cost keeps decreasing"
          },
          {
            "do": "Repeat many times",
            "result": "unbounded decrease",
            "why": "no finite shortest distance"
          },
          {
            "do": "Interpret exchange",
            "result": "arbitrage signal",
            "why": "the cycle may multiply value above $1$"
          },
          {
            "do": "State algorithm result",
            "result": "negative cycle reported",
            "why": "Bellman-Ford flags it"
          }
        ],
        "answer": "It suggests an arbitrage-like negative cycle; repeated traversal keeps reducing total cost."
      }
    ],
    "applications": [
      {
        "title": "Currency arbitrage",
        "background": "Taking negative logs turns profitable exchange cycles into negative cycles.",
        "numbers": "If rates multiply to $1.05$, the log cost is $-\\ln(1.05)\\u0007pprox-0.049$, a negative cycle."
      },
      {
        "title": "Road rebates",
        "background": "Some route models include rewards or credits, producing negative edges but usually no negative cycles.",
        "numbers": "A toll credit of $3$ on a road with base cost $10$ gives edge weight $7$; a larger credit could make it $-2$."
      },
      {
        "title": "ML structured prediction",
        "background": "Dynamic programs over graphs can include negative scores when higher reward means lower cost.",
        "numbers": "A transition score $+4$ can be represented as cost $-4$ in a shortest-path formulation."
      },
      {
        "title": "Network protocols",
        "background": "Distance-vector routing resembles repeated edge relaxation and can suffer from problematic cycles.",
        "numbers": "If a route improves from $12$ to $9$ through a neighbor, that is exactly a relaxation update."
      },
      {
        "title": "Scheduling constraints",
        "background": "Difference constraints $x_v\\le x_u+w$ can be solved by Bellman-Ford.",
        "numbers": "Constraint $x_B\\le x_A+3$ acts like edge $A\\to B$ of weight $3$."
      },
      {
        "title": "Robotics with rewards",
        "background": "Planning graphs may combine costs and rewards before seeking minimum total value.",
        "numbers": "A path with costs $5,4$ and reward $3$ has total $5+4-3=6$."
      }
    ],
    "applicationsClose": "Bellman-Ford is the careful listener: it keeps relaxing until every finite simple path has had a chance to speak.",
    "takeaways": [
      "Bellman-Ford relaxes every edge $|V|-1$ times.",
      "It handles negative edge weights.",
      "A further improvement after those rounds signals a reachable negative cycle.",
      "Without negative cycles, a shortest path can be chosen simple."
    ]
  },
  "math-15-12": {
    "id": "math-15-12",
    "title": "Minimum spanning trees",
    "tagline": "A minimum spanning tree connects everything with the least total edge weight.",
    "connections": {
      "buildsOn": [
        "Spanning trees",
        "weighted graphs",
        "greedy algorithms"
      ],
      "leadsTo": [
        "Network flows",
        "Cuts and the max-flow min-cut theorem",
        "clustering"
      ],
      "usedWith": [
        "trees",
        "cuts",
        "cycles",
        "optimization"
      ]
    },
    "motivation": "<p>A spanning tree gives a connected backbone. If edges have costs, some backbones are cheaper than others.</p><p>A <b>minimum spanning tree</b> is the cheapest connected backbone. It is where graph structure and optimization first meet in a very friendly way.</p>",
    "definition": "<p>In a connected undirected weighted graph, a <b>minimum spanning tree</b>, or <b>MST</b>, is a spanning tree whose total edge weight is as small as possible. Kruskal's algorithm sorts edges by weight and adds an edge when it connects two different components. Prim's algorithm grows one tree by repeatedly adding the cheapest edge leaving it.</p><p>The cut property explains the greedy choice: for any cut, a lightest edge crossing that cut is safe to include in some MST. If an MST used a heavier crossing edge instead, swapping in the lighter one would preserve connectivity and not increase total weight.</p><p><b>Assumptions that matter:</b> the graph is connected and undirected; weights may tie, so MSTs need not be unique; and MST minimizes total tree weight, not shortest path distances from a source.</p>",
    "worked": {
      "problem": "Use Kruskal's algorithm on edges $AB=1$, $BC=2$, $AC=3$, $CD=4$, $BD=5$.",
      "skills": [
        "Kruskal's algorithm",
        "cycles",
        "total weight"
      ],
      "strategy": "Sort edges, then add the cheapest edge that does not create a cycle.",
      "steps": [
        {
          "do": "Sort edges",
          "result": "$AB=1$, $BC=2$, $AC=3$, $CD=4$, $BD=5$",
          "why": "Kruskal works from light to heavy"
        },
        {
          "do": "Add $AB$",
          "result": "selected weight $1$",
          "why": "it connects two components"
        },
        {
          "do": "Add $BC$",
          "result": "selected weights $1,2$",
          "why": "it connects $C$ to $A,B$"
        },
        {
          "do": "Consider $AC$",
          "result": "skip $AC$",
          "why": "$A,B,C$ are already connected, so it would form a cycle"
        },
        {
          "do": "Add $CD$",
          "result": "selected weights $1,2,4$",
          "why": "it connects $D$"
        },
        {
          "do": "Stop",
          "result": "$3$ edges selected",
          "why": "a tree on four vertices needs $3$ edges"
        },
        {
          "do": "Add total",
          "result": "$1+2+4=7$",
          "why": "sum selected weights"
        }
      ],
      "verify": "The selected edges connect all four vertices and have no cycle.",
      "answer": "An MST is $\\{AB,BC,CD\\}$ with total weight $7$.",
      "connects": "MST algorithms keep connectivity while refusing costly cycle redundancy."
    },
    "practice": [
      {
        "problem": "How many edges are in an MST of a connected graph with $9$ vertices?",
        "steps": [
          {
            "do": "Use spanning property",
            "result": "MST is a spanning tree",
            "why": "it includes all vertices"
          },
          {
            "do": "Set $n$",
            "result": "$n=9$",
            "why": "vertex count"
          },
          {
            "do": "Apply tree formula",
            "result": "$n-1$",
            "why": "any spanning tree has this many edges"
          },
          {
            "do": "Compute",
            "result": "$8$",
            "why": "subtract one"
          },
          {
            "do": "State answer",
            "result": "$8$ edges",
            "why": "weights do not change edge count"
          }
        ],
        "answer": "It has $8$ edges."
      },
      {
        "problem": "Kruskal sees edges $1,2,2,5$ on four vertices and the first three do not form a cycle. What is the MST weight?",
        "steps": [
          {
            "do": "Need edges",
            "result": "$4-1=3$",
            "why": "spanning tree on four vertices"
          },
          {
            "do": "Add first edge",
            "result": "weight $1$",
            "why": "cheapest safe edge"
          },
          {
            "do": "Add second edge",
            "result": "weight $2$",
            "why": "safe by problem"
          },
          {
            "do": "Add third edge",
            "result": "weight $2$",
            "why": "safe and now tree complete"
          },
          {
            "do": "Sum",
            "result": "$1+2+2=5$",
            "why": "total MST weight"
          }
        ],
        "answer": "The MST weight is $5$."
      },
      {
        "problem": "Why does Kruskal skip an edge whose endpoints are already connected?",
        "steps": [
          {
            "do": "Endpoints already connected",
            "result": "there is a path between them",
            "why": "current selected edges provide a route"
          },
          {
            "do": "Add the edge",
            "result": "path plus new edge closes a loop",
            "why": "that creates a cycle"
          },
          {
            "do": "Tree condition",
            "result": "spanning tree is acyclic",
            "why": "cycles are not allowed"
          },
          {
            "do": "Connectivity need",
            "result": "edge is redundant",
            "why": "it does not merge components"
          },
          {
            "do": "Conclude",
            "result": "skip it",
            "why": "Kruskal only adds component-connecting edges"
          }
        ],
        "answer": "It would create a cycle and would not help connect new vertices."
      },
      {
        "problem": "A graph has distinct edge weights. What can you say about its MST uniqueness?",
        "steps": [
          {
            "do": "Recall tie issue",
            "result": "multiple MSTs often come from equal choices",
            "why": "ties allow different safe edges"
          },
          {
            "do": "Use distinct weights",
            "result": "no equal-weight crossing choices",
            "why": "greedy comparisons are strict"
          },
          {
            "do": "Apply MST theorem",
            "result": "unique MST",
            "why": "distinct weights force one optimal tree"
          },
          {
            "do": "Caution",
            "result": "not every edge is selected",
            "why": "distinct does not mean all light edges fit"
          },
          {
            "do": "State result",
            "result": "MST is unique",
            "why": "there is exactly one minimum tree"
          }
        ],
        "answer": "With all edge weights distinct, the MST is unique."
      },
      {
        "problem": "A clustering method builds an MST with total weight $42$ on $20$ points, then removes the two largest MST edges of weights $9$ and $7$. What is the remaining forest weight?",
        "steps": [
          {
            "do": "Start total",
            "result": "$42$",
            "why": "MST weight"
          },
          {
            "do": "Sum removed edges",
            "result": "$9+7=16$",
            "why": "two cuts"
          },
          {
            "do": "Subtract",
            "result": "$42-16=26$",
            "why": "remaining selected edges"
          },
          {
            "do": "Count clusters",
            "result": "$3$",
            "why": "removing two tree edges creates three components"
          },
          {
            "do": "State result",
            "result": "weight $26$",
            "why": "forest has three clusters"
          }
        ],
        "answer": "The remaining forest has total weight $26$ and $3$ components."
      }
    ],
    "applications": [
      {
        "title": "Network design",
        "background": "MSTs model least-cost ways to connect sites when any connected backbone is acceptable.",
        "numbers": "If selected cable edges cost $4,6,9,10$, the tree cost is $29$."
      },
      {
        "title": "Clustering",
        "background": "Single-linkage clustering can be built from an MST, then cut large edges.",
        "numbers": "Removing the largest $3$ edges of an MST creates $4$ clusters."
      },
      {
        "title": "Image segmentation",
        "background": "Pixels or regions can be connected by similarity edges, then heavy edges are cut.",
        "numbers": "An MST edge of weight $0.8$ between regions is less similar than one of weight $0.1$."
      },
      {
        "title": "Approximation for tours",
        "background": "MSTs give lower bounds and building blocks for traveling-salesperson approximations.",
        "numbers": "Any tour on $10$ cities has at least the MST weight because deleting one tour edge leaves a spanning tree."
      },
      {
        "title": "Sensor networks",
        "background": "Battery-powered sensors may choose low-cost communication links to maintain connectivity.",
        "numbers": "Connecting $25$ sensors minimally uses $24$ links in the MST."
      },
      {
        "title": "Feature graph pruning",
        "background": "Graph-based ML pipelines can prune dense similarity graphs to a sparse backbone.",
        "numbers": "A complete graph on $100$ examples has $4950$ edges; an MST keeps only $99$."
      }
    ],
    "applicationsClose": "MSTs choose just enough weighted structure: all vertices connected, no cycles, and no cheaper tree left behind.",
    "takeaways": [
      "An MST is a minimum-total-weight spanning tree.",
      "Kruskal adds cheapest safe edges that connect different components.",
      "Prim grows a tree by cheapest outgoing edges.",
      "MSTs minimize total tree weight, not source-to-all shortest paths."
    ]
  },
  "math-15-13": {
    "id": "math-15-13",
    "title": "Network flows",
    "tagline": "Network flow measures how much can move from a source to a sink through capacity-limited edges.",
    "connections": {
      "buildsOn": [
        "Directed graphs",
        "weighted edges",
        "cuts"
      ],
      "leadsTo": [
        "Cuts and the max-flow min-cut theorem",
        "linear programming",
        "matching"
      ],
      "usedWith": [
        "conservation equations",
        "inequalities",
        "paths",
        "cuts"
      ]
    },
    "motivation": "<p>Pipes, roads, and servers all have limits. A graph with capacities asks a natural question: how much can we send from start to finish without exceeding any limit?</p><p>Network flow turns that question into equations: capacity on each edge and conservation at every intermediate vertex.</p>",
    "definition": "<p>A <b>flow network</b> is a directed graph with source $s$, sink $t$, and capacities $c(u,v)\\ge0$ on edges. A flow assigns values $f(u,v)$ satisfying capacity constraints $0\\le f(u,v)\\le c(u,v)$ and flow conservation at every vertex except $s,t$: inflow equals outflow. The <b>value</b> of the flow is the total flow leaving $s$.</p><p>Conservation is the graph version of no storage: an intermediate node cannot create or destroy flow. Augmenting-path methods increase flow by finding a path from $s$ to $t$ with unused residual capacity and pushing the minimum residual capacity along it.</p><p><b>Assumptions that matter:</b> capacities are nonnegative; this lesson uses single-source single-sink networks; and reverse residual edges represent the ability to undo previous choices.</p>",
    "worked": {
      "problem": "In a network $s\\to a$ capacity $5$, $s\\to b$ capacity $3$, $a\\to t$ capacity $4$, $b\\to t$ capacity $3$, send a feasible maximum-looking flow and compute its value.",
      "skills": [
        "capacities",
        "conservation",
        "flow value"
      ],
      "strategy": "Choose path flows that respect the smallest capacity on each source-to-sink path.",
      "steps": [
        {
          "do": "Use path $s,a,t$",
          "result": "send $4$",
          "why": "edge $a\\to t$ caps that path at $4$"
        },
        {
          "do": "Check $s\\to a$ capacity",
          "result": "$4\\le5$",
          "why": "source edge has enough room"
        },
        {
          "do": "Use path $s,b,t$",
          "result": "send $3$",
          "why": "both edges on this path allow $3$"
        },
        {
          "do": "Check conservation at $a$",
          "result": "inflow $4$ equals outflow $4$",
          "why": "intermediate node stores no flow"
        },
        {
          "do": "Check conservation at $b$",
          "result": "inflow $3$ equals outflow $3$",
          "why": "flow passes through"
        },
        {
          "do": "Compute value",
          "result": "$4+3=7$",
          "why": "total leaving $s$"
        }
      ],
      "verify": "The sink receives $4+3=7$, matching the total that leaves the source.",
      "answer": "A feasible flow has value $7$.",
      "connects": "A flow is a capacity-respecting movement plan through a directed graph."
    },
    "practice": [
      {
        "problem": "Can edge $u\\to v$ with capacity $10$ carry flow $12$?",
        "steps": [
          {
            "do": "Read capacity",
            "result": "$c(u,v)=10$",
            "why": "upper bound"
          },
          {
            "do": "Read proposed flow",
            "result": "$f(u,v)=12$",
            "why": "given"
          },
          {
            "do": "Apply constraint",
            "result": "$f(u,v)\\le c(u,v)$",
            "why": "capacity feasibility"
          },
          {
            "do": "Compare",
            "result": "$12>10$",
            "why": "constraint is violated"
          },
          {
            "do": "Conclude",
            "result": "not feasible",
            "why": "flow must be at most $10$"
          }
        ],
        "answer": "No. It exceeds capacity by $2$."
      },
      {
        "problem": "A node has inflows $3$ and $5$, and outflows $4$ and $4$. Does it satisfy conservation?",
        "steps": [
          {
            "do": "Add inflows",
            "result": "$3+5=8$",
            "why": "total entering"
          },
          {
            "do": "Add outflows",
            "result": "$4+4=8$",
            "why": "total leaving"
          },
          {
            "do": "Compare",
            "result": "$8=8$",
            "why": "inflow equals outflow"
          },
          {
            "do": "Apply rule",
            "result": "conservation holds",
            "why": "assuming it is not source or sink"
          },
          {
            "do": "State result",
            "result": "yes",
            "why": "no flow is created or lost"
          }
        ],
        "answer": "Yes, conservation holds."
      },
      {
        "problem": "A path has residual capacities $6,2,5$. How much can one augmentation send?",
        "steps": [
          {
            "do": "List residuals",
            "result": "$6,2,5$",
            "why": "available capacity on path edges"
          },
          {
            "do": "Take minimum",
            "result": "$2$",
            "why": "the bottleneck limits the whole path"
          },
          {
            "do": "Set augmentation",
            "result": "$2$",
            "why": "cannot exceed any edge"
          },
          {
            "do": "Update intuition",
            "result": "one edge saturates",
            "why": "the edge with residual $2$ becomes full"
          },
          {
            "do": "State answer",
            "result": "$2$ units",
            "why": "path bottleneck"
          }
        ],
        "answer": "It can send $2$ units."
      },
      {
        "problem": "If total flow leaving $s$ is $9$ and one outgoing edge carries $4$, what must the other outgoing edge carry?",
        "steps": [
          {
            "do": "Write total",
            "result": "$4+x=9$",
            "why": "two outgoing edges"
          },
          {
            "do": "Subtract $4$",
            "result": "$x=5$",
            "why": "solve for unknown flow"
          },
          {
            "do": "Check nonnegative",
            "result": "$5\\ge0$",
            "why": "valid flow amount"
          },
          {
            "do": "Interpret",
            "result": "second edge carries $5$",
            "why": "remaining source flow"
          },
          {
            "do": "State result",
            "result": "$5$ units",
            "why": "assuming no other outgoing edges"
          }
        ],
        "answer": "The other outgoing edge carries $5$ units."
      },
      {
        "problem": "A serving system sends requests through two data centers with capacities $800$ and $1200$ requests/sec. What is the most it can route if both connect directly to the sink with same capacities?",
        "steps": [
          {
            "do": "Identify first path capacity",
            "result": "$800$",
            "why": "first data center limit"
          },
          {
            "do": "Identify second path capacity",
            "result": "$1200$",
            "why": "second data center limit"
          },
          {
            "do": "Use both in parallel",
            "result": "$800+1200$",
            "why": "independent paths add"
          },
          {
            "do": "Compute",
            "result": "$2000$",
            "why": "sum capacities"
          },
          {
            "do": "State max-looking flow",
            "result": "$2000$ requests/sec",
            "why": "source and sink links match those limits"
          }
        ],
        "answer": "It can route up to $2000$ requests per second."
      }
    ],
    "applications": [
      {
        "title": "Traffic routing",
        "background": "Road networks have capacities, and flow models estimate how many cars can move from origin to destination.",
        "numbers": "Two parallel roads with capacities $600$ and $900$ cars/hour can carry $1500$ cars/hour together."
      },
      {
        "title": "Data-center serving",
        "background": "Request routing uses capacity constraints so no service tier is overloaded.",
        "numbers": "If model server A handles $300$ qps and B handles $500$ qps, total routed flow is $800$ qps."
      },
      {
        "title": "Bipartite matching",
        "background": "Matching can be written as a flow problem with unit capacities.",
        "numbers": "Three applicants and three jobs use capacity $1$ edges; a flow value $3$ means a perfect matching."
      },
      {
        "title": "Image segmentation",
        "background": "Graph-cut vision methods use source-sink flows to separate foreground and background.",
        "numbers": "A pixel edge capacity $0.2$ is easier to cut than one with capacity $5.0$."
      },
      {
        "title": "Supply chains",
        "background": "Factories, warehouses, and stores form capacity-limited directed networks.",
        "numbers": "If warehouse edges to stores carry $40$, $35$, and $25$ units, the outgoing warehouse flow is $100$."
      },
      {
        "title": "Fair allocation",
        "background": "Flow constraints can enforce quotas across groups or resources.",
        "numbers": "If group A has capacity $60$ and group B capacity $40$, a feasible allocation cannot send more than $100$ total through them."
      }
    ],
    "applicationsClose": "Flows are movement with bookkeeping: every unit respects capacities and is conserved until it reaches the sink.",
    "takeaways": [
      "A flow network has capacities, a source, and a sink.",
      "Feasible flows obey capacity constraints and conservation.",
      "Flow value is total flow leaving the source, equivalently entering the sink.",
      "Augmenting paths push flow by their bottleneck residual capacity."
    ]
  },
  "math-15-14": {
    "id": "math-15-14",
    "title": "Cuts and the max-flow min-cut theorem",
    "tagline": "The most flow you can send equals the smallest capacity wall separating source from sink.",
    "connections": {
      "buildsOn": [
        "Network flows",
        "connectivity",
        "weighted directed graphs"
      ],
      "leadsTo": [
        "linear programming duality",
        "matching",
        "graph cuts in ML"
      ],
      "usedWith": [
        "sets",
        "inequalities",
        "optimization",
        "cuts"
      ]
    },
    "motivation": "<p>Imagine trying to send water from a source to a sink. No matter how clever the routing is, any wall that separates source from sink limits the total water crossing it.</p><p>The max-flow min-cut theorem says the best routing and the tightest wall meet at the same number. That equality is one of graph theory's great organizing ideas.</p>",
    "definition": "<p>An <b>$s$-$t$ cut</b> is a partition $(S,T)$ of vertices with $s\\in S$ and $t\\in T$. Its capacity is the sum of capacities of directed edges from $S$ to $T$: $$c(S,T)=\\sum_{u\\in S,\\ v\\in T} c(u,v).$$ Every feasible flow has value at most every cut capacity.</p><p>The upper bound is simple: all flow from $s$ to $t$ must cross from $S$ to $T$ somewhere, and those crossing edges cannot carry more than their capacities. The <b>max-flow min-cut theorem</b> says the maximum flow value equals the minimum $s$-$t$ cut capacity.</p><p><b>Assumptions that matter:</b> cuts are directed from $S$ to $T$ for capacity; reverse edges from $T$ to $S$ do not add to cut capacity; and standard theorem statements assume finite networks with nonnegative capacities.</p>",
    "worked": {
      "problem": "For edges $s\\to a=5$, $s\\to b=3$, $a\\to t=4$, $b\\to t=3$, compute the cut capacity for $S=\\{s,a\\}$, $T=\\{b,t\\}$.",
      "skills": [
        "cuts",
        "capacity sums",
        "flow upper bounds"
      ],
      "strategy": "List only edges directed from $S$ to $T$, then add their capacities.",
      "steps": [
        {
          "do": "Identify $S$ vertices",
          "result": "$s,a$",
          "why": "given source side"
        },
        {
          "do": "Identify $T$ vertices",
          "result": "$b,t$",
          "why": "given sink side"
        },
        {
          "do": "Check edge $s\\to a$",
          "result": "not counted",
          "why": "both endpoints are in $S$"
        },
        {
          "do": "Check edge $s\\to b$",
          "result": "count capacity $3$",
          "why": "it goes from $S$ to $T$"
        },
        {
          "do": "Check edge $a\\to t$",
          "result": "count capacity $4$",
          "why": "it goes from $S$ to $T$"
        },
        {
          "do": "Check edge $b\\to t$",
          "result": "not counted",
          "why": "both endpoints are in $T$"
        },
        {
          "do": "Add counted capacities",
          "result": "$3+4=7$",
          "why": "cut capacity is the crossing sum"
        }
      ],
      "verify": "Any flow value is at most $7$ for this cut, and the previous network can achieve value $7$.",
      "answer": "The cut capacity is $7$.",
      "connects": "Cuts are capacity bottlenecks that upper-bound all possible flows."
    },
    "practice": [
      {
        "problem": "For cut $S=\\{s\\}$, $T=\\{a,b,t\\}$ with edges $s\\to a=5$ and $s\\to b=3$, find capacity.",
        "steps": [
          {
            "do": "List crossing edges",
            "result": "$s\\to a$, $s\\to b$",
            "why": "both go from $S$ to $T$"
          },
          {
            "do": "Write capacities",
            "result": "$5$ and $3$",
            "why": "given"
          },
          {
            "do": "Add",
            "result": "$5+3=8$",
            "why": "cut capacity sum"
          },
          {
            "do": "Ignore other edges",
            "result": "not from $S$ to $T$",
            "why": "only source-side to sink-side edges count"
          },
          {
            "do": "State result",
            "result": "$8$",
            "why": "capacity of this cut"
          }
        ],
        "answer": "The cut capacity is $8$."
      },
      {
        "problem": "If a cut has capacity $12$, can a feasible flow have value $15$?",
        "steps": [
          {
            "do": "Recall cut bound",
            "result": "flow value $\\le$ cut capacity",
            "why": "every flow crosses the cut"
          },
          {
            "do": "Substitute capacity",
            "result": "flow value $\\le12$",
            "why": "this cut is an upper bound"
          },
          {
            "do": "Compare proposed value",
            "result": "$15>12$",
            "why": "violates the bound"
          },
          {
            "do": "Conclude",
            "result": "not feasible",
            "why": "some crossing capacity would be exceeded"
          },
          {
            "do": "State answer",
            "result": "no",
            "why": "value $15$ is impossible"
          }
        ],
        "answer": "No. Any flow is at most $12$ across that cut."
      },
      {
        "problem": "A flow of value $9$ and a cut of capacity $9$ are found. What can you conclude?",
        "steps": [
          {
            "do": "Use weak dual bound",
            "result": "max flow $\\le$ min cut",
            "why": "all cuts upper-bound flows"
          },
          {
            "do": "Use found flow",
            "result": "max flow $\\ge9$",
            "why": "a feasible value $9$ exists"
          },
          {
            "do": "Use found cut",
            "result": "max flow $\\le9$",
            "why": "capacity $9$ upper-bounds it"
          },
          {
            "do": "Combine inequalities",
            "result": "max flow $=9$",
            "why": "both bounds meet"
          },
          {
            "do": "Conclude cut status",
            "result": "minimum cut capacity is $9$",
            "why": "no smaller cut can exist"
          }
        ],
        "answer": "The flow is maximum and the cut is minimum, both with value $9$."
      },
      {
        "problem": "Why are edges from $T$ to $S$ not included in an $s$-$t$ cut capacity?",
        "steps": [
          {
            "do": "Define cut direction",
            "result": "capacity counts $S\\to T$",
            "why": "the goal is source side to sink side"
          },
          {
            "do": "Consider $T\\to S$ edge",
            "result": "points backward",
            "why": "it does not carry net necessary crossing toward $t$"
          },
          {
            "do": "Flow accounting",
            "result": "net flow from $S$ to $T$ matters",
            "why": "backward flow subtracts rather than limits forward escape"
          },
          {
            "do": "Apply definition",
            "result": "exclude reverse edges",
            "why": "standard directed cut capacity"
          },
          {
            "do": "State reason",
            "result": "only forward crossing capacity blocks $s$-$t$ flow",
            "why": "reverse edges are not bottleneck capacity"
          }
        ],
        "answer": "Directed cut capacity counts only edges from $S$ to $T$."
      },
      {
        "problem": "An image cut has boundary edges with capacities $0.7$, $1.2$, $0.4$, and $2.0$. What is the cut cost?",
        "steps": [
          {
            "do": "List capacities",
            "result": "$0.7,1.2,0.4,2.0$",
            "why": "edges crossed by the cut"
          },
          {
            "do": "Add first two",
            "result": "$0.7+1.2=1.9$",
            "why": "partial sum"
          },
          {
            "do": "Add third",
            "result": "$1.9+0.4=2.3$",
            "why": "continue sum"
          },
          {
            "do": "Add fourth",
            "result": "$2.3+2.0=4.3$",
            "why": "final sum"
          },
          {
            "do": "Interpret",
            "result": "cut cost $4.3$",
            "why": "lower cuts are preferred in min-cut segmentation"
          }
        ],
        "answer": "The cut capacity is $4.3$."
      }
    ],
    "applications": [
      {
        "title": "Bottleneck analysis",
        "background": "Cuts identify the tightest separator limiting total throughput.",
        "numbers": "If all traffic must cross links of capacities $10$, $15$, and $5$, that cut permits at most $30$ units."
      },
      {
        "title": "Image segmentation",
        "background": "Graph cuts separate foreground and background by minimizing boundary plus label costs.",
        "numbers": "Cutting edges of weights $0.3$, $0.6$, and $1.1$ costs $2.0$."
      },
      {
        "title": "Bipartite matching certificates",
        "background": "A max flow paired with an equal cut proves no larger matching exists.",
        "numbers": "If matching flow is $42$ and a cut has capacity $42$, the maximum matching size is $42$."
      },
      {
        "title": "Data-center capacity planning",
        "background": "Min cuts reveal which service tier limits end-to-end throughput.",
        "numbers": "If API-to-model edges total $900$ qps while frontend-to-API totals $1500$ qps, the $900$ qps cut is tighter."
      },
      {
        "title": "Reliability",
        "background": "Small cuts point to fragile separators in infrastructure graphs.",
        "numbers": "A cut with two links of capacity $100$ each limits cross-region traffic to $200$ units."
      },
      {
        "title": "Fairness constraints",
        "background": "Flow cuts can certify that quota constraints cap feasible assignments.",
        "numbers": "If a group quota cut has capacity $60$, no feasible assignment can route more than $60$ units through that group."
      }
    ],
    "applicationsClose": "Max-flow min-cut is a perfect meeting of construction and certificate: a routing plan and a bottleneck wall prove each other optimal.",
    "takeaways": [
      "An $s$-$t$ cut partitions vertices with $s$ on one side and $t$ on the other.",
      "Cut capacity sums directed edges from the source side to the sink side.",
      "Every cut upper-bounds every feasible flow.",
      "The maximum flow value equals the minimum cut capacity."
    ]
  }
};
