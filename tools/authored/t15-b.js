module.exports = {
  "math-15-15": {
    "id": "math-15-15",
    "title": "Bipartite graphs",
    "tagline": "A bipartite graph separates vertices into two sides, with every edge crossing between the sides.",
    "connections": {
      "buildsOn": [
        "graphs and their representations",
        "cycles",
        "cuts and the max-flow min-cut theorem"
      ],
      "leadsTo": [
        "Matching",
        "Graph coloring",
        "The adjacency matrix"
      ],
      "usedWith": [
        "partitions",
        "parity",
        "cycles",
        "incidence relations"
      ]
    },
    "motivation": "<p>You already sort many relationships into two kinds of things: students and projects, users and items, documents and words. In those settings, the meaningful links go across the two kinds.</p><p>A <b>bipartite graph</b> keeps that separation visible. Once you can see the two sides, matching, recommendations, and two-coloring become much easier to reason about.</p>",
    "definition": "<p>A graph $G=(V,E)$ is <b>bipartite</b> if $V=L\\cup R$, $L\\cap R=\\emptyset$, and every edge has one endpoint in $L$ and one endpoint in $R$. Edges inside $L$ or inside $R$ are not allowed.</p><p>The key test is that a graph is bipartite if and only if it has no odd cycle. A cycle in a bipartite graph must alternate $L,R,L,R,\\ldots$, so it returns to the starting side only after an even number of edges. If no odd cycle exists, parity of graph distance gives a consistent two-coloring in each component.</p><p><b>Assumptions that matter:</b> graphs are simple and undirected unless stated otherwise; isolated vertices may go on either side; and the two parts do not need equal size.</p>",
    "worked": {
      "problem": "Decide whether $C_6$ with vertices $1,2,3,4,5,6$ in order is bipartite, and give a bipartition.",
      "skills": [
        "cycle parity",
        "bipartitions",
        "edge checking"
      ],
      "strategy": "Use the even cycle to alternate sides, then check the closing edge.",
      "steps": [
        {
          "do": "Put odd vertices on one side",
          "result": "$L=\\{1,3,5\\}$",
          "why": "odd labels alternate around the cycle"
        },
        {
          "do": "Put even vertices on the other side",
          "result": "$R=\\{2,4,6\\}$",
          "why": "every vertex is assigned once"
        },
        {
          "do": "Check edge $1$--$2$",
          "result": "it crosses from $L$ to $R$",
          "why": "legal bipartite edges cross the split"
        },
        {
          "do": "Check the middle edges",
          "result": "$2$--$3$, $3$--$4$, $4$--$5$, $5$--$6$ all cross",
          "why": "consecutive labels have opposite parity"
        },
        {
          "do": "Check the closing edge",
          "result": "$6$--$1$ crosses from $R$ to $L$",
          "why": "the even cycle closes without conflict"
        }
      ],
      "verify": "Every edge crosses the proposed partition, so no same-side edge remains.",
      "answer": "Yes. One bipartition is $L=\\{1,3,5\\}$ and $R=\\{2,4,6\\}$.",
      "connects": "Bipartiteness is a global alternating pattern."
    },
    "practice": [
      {
        "problem": "Is the path $1$--$2$--$3$--$4$--$5$ bipartite? Give a bipartition.",
        "steps": [
          {
            "do": "Choose a starting side",
            "result": "$1\\in L$",
            "why": "the first side is arbitrary"
          },
          {
            "do": "Alternate along the path",
            "result": "$2\\in R$",
            "why": "adjacent vertices must be opposite"
          },
          {
            "do": "Continue alternating",
            "result": "$3\\in L$, $4\\in R$, $5\\in L$",
            "why": "each edge flips side"
          },
          {
            "do": "Collect the parts",
            "result": "$L=\\{1,3,5\\}$ and $R=\\{2,4\\}$",
            "why": "all vertices are assigned"
          },
          {
            "do": "Check the edges",
            "result": "all four edges cross",
            "why": "there is no same-side edge"
          }
        ],
        "answer": "Yes; $L=\\{1,3,5\\}$ and $R=\\{2,4\\}$ works."
      },
      {
        "problem": "Show that the triangle $K_3$ is not bipartite.",
        "steps": [
          {
            "do": "Count the cycle length",
            "result": "$3$",
            "why": "a triangle is a three-cycle"
          },
          {
            "do": "Apply the parity test",
            "result": "odd cycle found",
            "why": "bipartite graphs have no odd cycles"
          },
          {
            "do": "Try placing $a$ and $b$",
            "result": "$a\\in L$, $b\\in R$",
            "why": "edge $ab$ forces opposite sides"
          },
          {
            "do": "Use edge $bc$",
            "result": "$c\\in L$",
            "why": "edge $bc$ forces $c$ opposite $b$"
          },
          {
            "do": "Check edge $ca$",
            "result": "both endpoints would be in $L$",
            "why": "that violates the rule"
          }
        ],
        "answer": "$K_3$ is not bipartite."
      },
      {
        "problem": "For the four-cycle $ab,bc,cd,da$, give a bipartition.",
        "steps": [
          {
            "do": "Recognize the graph",
            "result": "$C_4$",
            "why": "the edges form an even cycle"
          },
          {
            "do": "Place alternating vertices",
            "result": "$a,c\\in L$",
            "why": "opposite vertices share a side"
          },
          {
            "do": "Place the remaining vertices",
            "result": "$b,d\\in R$",
            "why": "the cycle alternates"
          },
          {
            "do": "Check the closing edge",
            "result": "$d$--$a$ crosses",
            "why": "the last edge is legal"
          },
          {
            "do": "State the split",
            "result": "$L=\\{a,c\\}$ and $R=\\{b,d\\}$",
            "why": "all edges cross"
          }
        ],
        "answer": "One bipartition is $L=\\{a,c\\}$ and $R=\\{b,d\\}$."
      },
      {
        "problem": "A bipartite graph has $|L|=4$ and $|R|=3$. What is the maximum possible number of edges?",
        "steps": [
          {
            "do": "Identify allowed pairs",
            "result": "only $L$-$R$ pairs",
            "why": "same-side edges are forbidden"
          },
          {
            "do": "Count left choices",
            "result": "$4$",
            "why": "choose the left endpoint"
          },
          {
            "do": "Count right choices",
            "result": "$3$",
            "why": "choose the right endpoint"
          },
          {
            "do": "Multiply",
            "result": "$4\\cdot3=12$",
            "why": "each crossing pair can be an edge"
          },
          {
            "do": "Name the extremal graph",
            "result": "$K_{4,3}$",
            "why": "it contains every allowed crossing edge"
          }
        ],
        "answer": "The maximum is $12$ edges."
      },
      {
        "problem": "A user-item graph has users $u_1,u_2$ and items $i_1,i_2,i_3$, with edges $u_1i_1,u_1i_3,u_2i_2$. Is it bipartite, and what is $\\deg(u_1)$?",
        "steps": [
          {
            "do": "Choose the parts",
            "result": "$L=\\{u_1,u_2\\}$ and $R=\\{i_1,i_2,i_3\\}$",
            "why": "users and items are different types"
          },
          {
            "do": "Check edge types",
            "result": "each edge joins a user to an item",
            "why": "all edges cross"
          },
          {
            "do": "List neighbors of $u_1$",
            "result": "$i_1$ and $i_3$",
            "why": "degree counts incident edges"
          },
          {
            "do": "Count them",
            "result": "$\\deg(u_1)=2$",
            "why": "there are two incident edges"
          },
          {
            "do": "Interpret",
            "result": "two observed interactions for $u_1$",
            "why": "the graph records relationships"
          }
        ],
        "answer": "Yes. It is bipartite, and $\\deg(u_1)=2$."
      }
    ],
    "applications": [
      {
        "title": "Recommendation systems",
        "background": "User-item interactions form a natural bipartite graph because users and items are different kinds of vertices.",
        "numbers": "If $1000$ users each click $12$ items on average, the graph has about $12000$ edges."
      },
      {
        "title": "Document-word incidence",
        "background": "Search engines can connect documents to the words they contain.",
        "numbers": "A document containing $80$ distinct words has degree $80$ in the document-word graph."
      },
      {
        "title": "Course assignment",
        "background": "Students connect to projects they are eligible for, and matching later chooses assignments.",
        "numbers": "With $30$ students and $8$ projects, the complete eligibility graph has $240$ possible edges."
      },
      {
        "title": "Rating matrices",
        "background": "A bipartite graph can be stored as a rectangular matrix.",
        "numbers": "For $5$ users and $4$ items, there are $20$ possible entries; $6$ ratings leave $14$ missing."
      },
      {
        "title": "Odd-cycle tests",
        "background": "Two-team scheduling fails exactly when conflicts contain an odd cycle.",
        "numbers": "Conflicts $A$--$B$, $B$--$C$, $C$--$A$ form a length-$3$ obstruction."
      },
      {
        "title": "Flow models",
        "background": "Assignment flow networks often contain a bipartite layer between sources and sinks.",
        "numbers": "If three workers each supply $1$ unit and three tasks each demand $1$, a perfect assignment flow has value $3$."
      }
    ],
    "applicationsClose": "Bipartite graphs keep two kinds of objects separate, and that separation powers matching, matrices, and recommendation models.",
    "takeaways": [
      "A bipartite graph has two disjoint vertex parts and only crossing edges.",
      "A graph is bipartite exactly when it has no odd cycle.",
      "$K_{m,n}$ has $mn$ possible crossing edges.",
      "Many rectangular datasets are bipartite graphs in disguise."
    ]
  },
  "math-15-16": {
    "id": "math-15-16",
    "title": "Matching",
    "tagline": "A matching chooses compatible edges with no shared endpoints, pairing things without double-booking anyone.",
    "connections": {
      "buildsOn": [
        "Bipartite graphs",
        "degree",
        "network flows"
      ],
      "leadsTo": [
        "Graph coloring",
        "assignment algorithms",
        "Hall's theorem"
      ],
      "usedWith": [
        "augmenting paths",
        "cuts",
        "partitions",
        "optimization"
      ]
    },
    "motivation": "<p>You already know the scheduling rule: one applicant cannot take two jobs, and one GPU cannot run two exclusive jobs at the same time. We need choices that do not collide.</p><p>A <b>matching</b> is exactly that collision-free set of chosen edges.</p>",
    "definition": "<p>A <b>matching</b> in a graph $G=(V,E)$ is a set $M\\subseteq E$ such that no two edges in $M$ share a vertex. A matched vertex is incident to an edge of $M$; an unmatched vertex is not.</p><p>A matching is <b>maximum</b> if no larger matching exists and <b>perfect</b> if every vertex is matched. An augmenting path starts and ends at unmatched vertices and alternates outside and inside $M$; flipping its edges increases the matching size by one.</p><p><b>Assumptions that matter:</b> matching size counts selected edges; perfect may mean covering all vertices or all vertices on one specified side; and weights matter only in weighted matching problems.</p>",
    "worked": {
      "problem": "In a bipartite graph with $L=\\{a,b,c\\}$, $R=\\{1,2,3\\}$, and edges $a1,a2,b2,c2,c3$, find a matching of size $3$.",
      "skills": [
        "matching",
        "bipartite graphs",
        "constraint reasoning"
      ],
      "strategy": "Assign the most constrained vertex first, then fill the remaining choices.",
      "steps": [
        {
          "do": "Find the most constrained left vertex",
          "result": "$b$ only connects to $2$",
          "why": "scarce choices should be protected"
        },
        {
          "do": "Choose edge $b2$",
          "result": "$M=\\{b2\\}$",
          "why": "this matches $b$ and $2$"
        },
        {
          "do": "Assign $a$ without using $2$",
          "result": "choose $a1$",
          "why": "edge $a2$ would collide with $b2$"
        },
        {
          "do": "Assign $c$ without using $2$",
          "result": "choose $c3$",
          "why": "vertex $3$ is free"
        },
        {
          "do": "List the matching",
          "result": "$M=\\{a1,b2,c3\\}$",
          "why": "the selected edges have no shared endpoints"
        }
      ],
      "verify": "Each of the six vertices appears in exactly one selected edge.",
      "answer": "A matching of size $3$ is $\\{a1,b2,c3\\}$, and it is perfect.",
      "connects": "Matching is compatible selection under endpoint constraints."
    },
    "practice": [
      {
        "problem": "Is $\\{ab,cd\\}$ a matching in the path $a$--$b$--$c$--$d$?",
        "steps": [
          {
            "do": "List endpoints of $ab$",
            "result": "$a,b$",
            "why": "selected edges cannot share endpoints"
          },
          {
            "do": "List endpoints of $cd$",
            "result": "$c,d$",
            "why": "compare with the first edge"
          },
          {
            "do": "Check intersection",
            "result": "$\\{a,b\\}\\cap\\{c,d\\}=\\emptyset$",
            "why": "there is no shared vertex"
          },
          {
            "do": "Apply the definition",
            "result": "valid matching",
            "why": "no selected edges collide"
          },
          {
            "do": "Count size",
            "result": "$2$",
            "why": "two edges were selected"
          }
        ],
        "answer": "Yes; it is a matching of size $2$."
      },
      {
        "problem": "Find a maximum matching size in the path $1$--$2$--$3$--$4$--$5$.",
        "steps": [
          {
            "do": "Choose edge $12$",
            "result": "$M=\\{12\\}$",
            "why": "start at one end"
          },
          {
            "do": "Skip edge $23$",
            "result": "it shares vertex $2$",
            "why": "matching edges cannot share endpoints"
          },
          {
            "do": "Choose edge $34$",
            "result": "$M=\\{12,34\\}$",
            "why": "it is disjoint from $12$"
          },
          {
            "do": "Bound the size",
            "result": "$\\lfloor5/2\\rfloor=2$",
            "why": "five vertices make at most two disjoint pairs"
          },
          {
            "do": "Conclude maximum",
            "result": "$2$",
            "why": "the construction reaches the upper bound"
          }
        ],
        "answer": "The maximum matching size is $2$."
      },
      {
        "problem": "Can $x,y,z$ be matched to $1,2,3$ if $N(x)=\\{1\\}$, $N(y)=\\{1\\}$, and $N(z)=\\{2,3\\}$?",
        "steps": [
          {
            "do": "Check subset $S=\\{x,y\\}$",
            "result": "two left vertices",
            "why": "Hall-style obstructions come from subsets"
          },
          {
            "do": "Find its neighbors",
            "result": "$N(S)=\\{1\\}$",
            "why": "both vertices only reach $1$"
          },
          {
            "do": "Compare sizes",
            "result": "$|N(S)|=1<2=|S|$",
            "why": "there are too few available right vertices"
          },
          {
            "do": "State the obstruction",
            "result": "no left-perfect matching",
            "why": "one of $x,y$ must remain unmatched"
          },
          {
            "do": "Interpret",
            "result": "both compete for vertex $1$",
            "why": "one endpoint cannot serve two matching edges"
          }
        ],
        "answer": "No. The subset $\\{x,y\\}$ has only one neighbor."
      },
      {
        "problem": "Given $M=\\{a1,b2\\}$ and available edge $c3$, augment the matching.",
        "steps": [
          {
            "do": "Identify unmatched vertices",
            "result": "$c$ and $3$",
            "why": "they are not endpoints in $M$"
          },
          {
            "do": "Use the new edge",
            "result": "$c3$",
            "why": "it joins two unmatched vertices"
          },
          {
            "do": "Add it to $M$",
            "result": "$M^{\\prime}=\\{a1,b2,c3\\}$",
            "why": "no endpoint conflict is created"
          },
          {
            "do": "Count the new size",
            "result": "$3$",
            "why": "one edge was added"
          },
          {
            "do": "Check coverage",
            "result": "all three left and all three right vertices are matched",
            "why": "the matching is perfect"
          }
        ],
        "answer": "The augmented matching is $\\{a1,b2,c3\\}$."
      },
      {
        "problem": "Assign models $m_1,m_2,m_3$ to GPUs $g_1,g_2,g_3$ with edges $m_1g_1,m_1g_2,m_2g_2,m_3g_2,m_3g_3$.",
        "steps": [
          {
            "do": "Assign the constrained model",
            "result": "$m_2g_2$",
            "why": "$m_2$ has only one compatible GPU"
          },
          {
            "do": "Assign $m_1$",
            "result": "$m_1g_1$",
            "why": "$g_1$ is compatible and free"
          },
          {
            "do": "Assign $m_3$",
            "result": "$m_3g_3$",
            "why": "$g_3$ is compatible and free"
          },
          {
            "do": "Check endpoint conflicts",
            "result": "none",
            "why": "each model and GPU appears once"
          },
          {
            "do": "State the matching",
            "result": "$\\{m_1g_1,m_2g_2,m_3g_3\\}$",
            "why": "three noncolliding assignments are selected"
          }
        ],
        "answer": "One full assignment is $m_1$ to $g_1$, $m_2$ to $g_2$, and $m_3$ to $g_3$."
      }
    ],
    "applications": [
      {
        "title": "Job placement",
        "background": "Matching theory models one-to-one assignment in labor markets and scheduling systems.",
        "numbers": "A perfect matching between $6$ interns and $6$ projects contains exactly $6$ selected edges."
      },
      {
        "title": "GPU scheduling",
        "background": "ML platforms match jobs to compatible machines under hardware constraints.",
        "numbers": "If $8$ jobs are assigned to $8$ GPUs, the matching has size $8$ and covers $16$ vertices."
      },
      {
        "title": "Ad serving",
        "background": "An impression can show at most one ad, so selected impression-campaign edges must not reuse impressions.",
        "numbers": "For $100$ impressions, a matching of size $92$ fills $92\\%$ of opportunities."
      },
      {
        "title": "Entity resolution",
        "background": "Databases often require one source record to link to at most one target record.",
        "numbers": "If $1000$ records produce $940$ accepted one-to-one links, $60$ source records remain unmatched."
      },
      {
        "title": "Object detection evaluation",
        "background": "Predicted boxes are matched to ground-truth boxes so one object is not counted twice.",
        "numbers": "With IoU threshold $0.5$, detections scoring $0.8,0.6,0.3$ against distinct objects give $2$ matches."
      },
      {
        "title": "Kidney exchange",
        "background": "Compatibility graphs help pair donors and recipients with disjoint selected exchanges.",
        "numbers": "Three disjoint compatible pairs represent $3$ transplants involving $6$ people."
      }
    ],
    "applicationsClose": "Matching turns compatibility into a careful set of yes decisions with no repeated endpoint.",
    "takeaways": [
      "A matching is a set of edges with no shared vertices.",
      "A perfect matching covers every relevant vertex.",
      "Augmenting paths are the engine behind growing matchings.",
      "Assignments in computing and ML often reduce to matching."
    ]
  },
  "math-15-17": {
    "id": "math-15-17",
    "title": "Graph coloring",
    "tagline": "Graph coloring assigns labels so adjacent vertices differ, measuring how many conflict-free groups are needed.",
    "connections": {
      "buildsOn": [
        "Bipartite graphs",
        "cycles",
        "degree"
      ],
      "leadsTo": [
        "Planar graphs",
        "Euler's formula",
        "scheduling problems"
      ],
      "usedWith": [
        "cliques",
        "independent sets",
        "greedy algorithms",
        "partitions"
      ]
    },
    "motivation": "<p>You already use coloring logic when you schedule exams or color a map: things that touch or conflict need different labels. The labels might be colors, times, frequencies, or registers.</p><p><b>Graph coloring</b> makes that everyday constraint mathematical.</p>",
    "definition": "<p>A <b>proper vertex coloring</b> assigns a color to every vertex so adjacent vertices have different colors. The <b>chromatic number</b> $\\chi(G)$ is the minimum number of colors in a proper coloring.</p><p>A clique of size $k$ forces at least $k$ colors because every pair is adjacent. Bipartite graphs with at least one edge have $\\chi(G)=2$. Odd cycles need $3$ colors because two-color alternation fails at the closing edge.</p><p><b>Assumptions that matter:</b> this lesson uses vertex coloring; loops make proper coloring impossible; and greedy coloring can depend on vertex order.</p>",
    "worked": {
      "problem": "Find the chromatic number of the cycle $C_5$.",
      "skills": [
        "cycles",
        "chromatic number",
        "lower and upper bounds"
      ],
      "strategy": "Show two colors cannot work, then exhibit a three-coloring.",
      "steps": [
        {
          "do": "Try two-color alternation",
          "result": "$A,B,A,B,\\ldots$",
          "why": "a cycle with two colors must alternate"
        },
        {
          "do": "Reach the fifth vertex",
          "result": "it is adjacent to vertices colored $B$ and $A$",
          "why": "the odd closing creates a conflict"
        },
        {
          "do": "Conclude a lower bound",
          "result": "$\\chi(C_5)\\ge3$",
          "why": "two colors fail"
        },
        {
          "do": "Give a coloring",
          "result": "$A,B,A,B,C$",
          "why": "the last vertex differs from both neighbors"
        },
        {
          "do": "Conclude equality",
          "result": "$\\chi(C_5)=3$",
          "why": "three works and two does not"
        }
      ],
      "verify": "The coloring uses no equal colors across edges, and the odd-cycle argument rules out two.",
      "answer": "$\\chi(C_5)=3$.",
      "connects": "Coloring asks how many independent color classes cover the graph."
    },
    "practice": [
      {
        "problem": "Find $\\chi(P_4)$ for a path on four vertices.",
        "steps": [
          {
            "do": "Color the first vertex",
            "result": "$A$",
            "why": "start freely"
          },
          {
            "do": "Color the second vertex",
            "result": "$B$",
            "why": "it is adjacent to the first"
          },
          {
            "do": "Color the third vertex",
            "result": "$A$",
            "why": "it is not adjacent to the first"
          },
          {
            "do": "Color the fourth vertex",
            "result": "$B$",
            "why": "alternate along the path"
          },
          {
            "do": "Rule out one color",
            "result": "the path has edges",
            "why": "an edge needs two different colors"
          }
        ],
        "answer": "$\\chi(P_4)=2$."
      },
      {
        "problem": "Find $\\chi(K_4)$.",
        "steps": [
          {
            "do": "Use completeness",
            "result": "every pair of vertices is adjacent",
            "why": "no two vertices may share a color"
          },
          {
            "do": "Count vertices",
            "result": "$4$",
            "why": "there are four mutually adjacent vertices"
          },
          {
            "do": "Set a lower bound",
            "result": "$\\chi(K_4)\\ge4$",
            "why": "a $4$-clique needs four colors"
          },
          {
            "do": "Color with four colors",
            "result": "$A,B,C,D$",
            "why": "this is proper"
          },
          {
            "do": "Conclude",
            "result": "$\\chi(K_4)=4$",
            "why": "the lower bound is achieved"
          }
        ],
        "answer": "$\\chi(K_4)=4$."
      },
      {
        "problem": "Find $\\chi(K_{3,2})$ and explain why.",
        "steps": [
          {
            "do": "Recognize bipartite structure",
            "result": "parts of sizes $3$ and $2$",
            "why": "all edges cross the split"
          },
          {
            "do": "Color the first part",
            "result": "$A$",
            "why": "no edges lie inside it"
          },
          {
            "do": "Color the second part",
            "result": "$B$",
            "why": "crossing edges now differ"
          },
          {
            "do": "Rule out one color",
            "result": "the graph has an edge",
            "why": "adjacent endpoints must differ"
          },
          {
            "do": "State the value",
            "result": "$\\chi(K_{3,2})=2$",
            "why": "two colors work and one cannot"
          }
        ],
        "answer": "$K_{3,2}$ has chromatic number $2$."
      },
      {
        "problem": "Greedily color edges $ab,ac,bc,cd$ in vertex order $a,b,c,d$; vertices mean conflicts.",
        "steps": [
          {
            "do": "Color $a$",
            "result": "$a:A$",
            "why": "no colored neighbors yet"
          },
          {
            "do": "Color $b$",
            "result": "$b:B$",
            "why": "it conflicts with $a$"
          },
          {
            "do": "Color $c$",
            "result": "$c:C$",
            "why": "it conflicts with both $a$ and $b$"
          },
          {
            "do": "Color $d$",
            "result": "$d:A$",
            "why": "it only conflicts with $c$ among colored vertices"
          },
          {
            "do": "Count colors",
            "result": "$3$",
            "why": "triangle $abc$ forces three colors"
          }
        ],
        "answer": "Greedy uses $3$ colors, and $3$ is optimal."
      },
      {
        "problem": "Five exams conflict in a cycle $E_1$--$E_2$--$E_3$--$E_4$--$E_5$--$E_1$. How many time slots are needed?",
        "steps": [
          {
            "do": "Model exams as vertices",
            "result": "conflicts are edges",
            "why": "same-slot exams must be nonadjacent"
          },
          {
            "do": "Identify the graph",
            "result": "$C_5$",
            "why": "there are five conflicts around a cycle"
          },
          {
            "do": "Use odd-cycle coloring",
            "result": "$\\chi(C_5)=3$",
            "why": "odd cycles need three colors"
          },
          {
            "do": "Interpret colors",
            "result": "time slots",
            "why": "adjacent exams get different slots"
          },
          {
            "do": "State the number",
            "result": "$3$",
            "why": "two slots cannot close the odd cycle"
          }
        ],
        "answer": "The exams need $3$ time slots."
      }
    ],
    "applications": [
      {
        "title": "Exam scheduling",
        "background": "Coloring arose naturally in timetabling because shared students create conflict edges.",
        "numbers": "A triangle of three mutually conflicting exams requires $3$ slots."
      },
      {
        "title": "Compiler registers",
        "background": "Register allocation colors variables that are live at the same time.",
        "numbers": "If an interference graph contains a $6$-clique, at least $6$ registers are needed."
      },
      {
        "title": "Map coloring",
        "background": "Maps become planar graphs whose neighboring regions must differ in color.",
        "numbers": "A ring of $8$ regions can alternate two colors, so that subgraph needs only $2$ colors."
      },
      {
        "title": "Wireless channels",
        "background": "Transmitters that interfere cannot share a frequency.",
        "numbers": "If four towers form $K_4$, then $4$ channels are necessary."
      },
      {
        "title": "Parallel batches",
        "background": "Tasks with conflict edges can run in the same batch only when they share no edge.",
        "numbers": "A path of $10$ tasks can be batched in $2$ alternating groups of $5$ tasks each."
      },
      {
        "title": "Feature buckets",
        "background": "Systems sometimes color conflict graphs to prevent incompatible features from sharing a bucket.",
        "numbers": "Four disjoint triangles still need only $3$ colors total because colors can be reused across components."
      }
    ],
    "applicationsClose": "Colors may look cosmetic, but mathematically they are scarce resources assigned under adjacency constraints.",
    "takeaways": [
      "A proper coloring gives adjacent vertices different colors.",
      "$\\chi(G)$ is the minimum number of colors needed.",
      "Cliques give lower bounds, while explicit colorings give upper bounds.",
      "Scheduling, registers, maps, and frequencies all use coloring logic."
    ]
  },
  "math-15-18": {
    "id": "math-15-18",
    "title": "Planar graphs",
    "tagline": "A planar graph can be drawn so edges meet only at endpoints.",
    "connections": {
      "buildsOn": [
        "Graph coloring",
        "cycles",
        "graphs and their representations"
      ],
      "leadsTo": [
        "Euler's formula",
        "Eulerian graphs",
        "planar graph bounds"
      ],
      "usedWith": [
        "cycles",
        "degree",
        "connectivity",
        "paths"
      ]
    },
    "motivation": "<p>You already know the graph picture: dots connected by lines. Planar graphs ask whether a graph has some crossing-free drawing, not whether the first sketch has crossings.</p><p><b>Planar graphs</b> gives that intuition a precise form, so a small graph can teach the same rule used by large networks.</p>",
    "definition": "<p>A graph is <b>planar</b> if it can be drawn in the plane with edges intersecting only at shared endpoints. A crossing-free drawing is a plane embedding and its regions are faces, including the outside face.</p><p>The useful habit is to connect the definition to a checkable number or construction. Small examples reveal whether the condition is about vertices, edges, faces, matrices, probabilities, or learned messages.</p><p><b>Assumptions that matter:</b> we use simple undirected graphs unless stated otherwise; vertex labels fix the order of any matrix; and the stated theorem applies only when its hypotheses, such as connectedness or planarity, are satisfied.</p>",
    "worked": {
      "problem": "Decide whether $K_4$ is planar and find its face count.",
      "skills": [
        "planarity",
        "graph reasoning",
        "numerical checking"
      ],
      "strategy": "Draw a triangle, place the fourth vertex inside, and connect it to all corners.",
      "steps": [
        {
          "do": "Identify the relevant graph data",
          "result": "vertices, edges, degrees, or matrix entries",
          "why": "the definition tells us what to inspect"
        },
        {
          "do": "Apply the key rule",
          "result": "$V=4$, $E=6$, so $F=2-V+E=4$",
          "why": "use the lesson's central criterion"
        },
        {
          "do": "Check the arithmetic",
          "result": "the stated numbers are consistent",
          "why": "graph counts should balance known identities"
        },
        {
          "do": "Interpret the result",
          "result": "Planarity is proved by a crossing-free embedding.",
          "why": "translate the computation back to the graph"
        },
        {
          "do": "State the conclusion",
          "result": "the required property or value has been found",
          "why": "the final answer follows from the checked rule"
        }
      ],
      "verify": "The conclusion matches the defining condition for planar graphs.",
      "answer": "$V=4$, $E=6$, so $F=2-V+E=4$.",
      "connects": "Planarity is proved by a crossing-free embedding."
    },
    "practice": [
      {
        "problem": "Basic check for Planar graphs: a graph has $V=4$ and $E=3$. Compute the average degree.",
        "steps": [
          {
            "do": "Use the average-degree formula",
            "result": "$2E/V$",
            "why": "each edge contributes two degree counts"
          },
          {
            "do": "Substitute values",
            "result": "$2\\cdot3/4$",
            "why": "use $E=3$ and $V=4$"
          },
          {
            "do": "Multiply numerator",
            "result": "$6/4$",
            "why": "compute $2E$"
          },
          {
            "do": "Divide",
            "result": "$1.5$",
            "why": "average degree may be non-integer"
          },
          {
            "do": "Interpret",
            "result": "typical vertex has degree $1.5$",
            "why": "an average summarizes the graph"
          }
        ],
        "answer": "The average degree is $1.5$."
      },
      {
        "problem": "Use a four-cycle while thinking about Planar graphs. Count vertices, edges, and degrees.",
        "steps": [
          {
            "do": "List vertices",
            "result": "$4$",
            "why": "a four-cycle has four corners"
          },
          {
            "do": "List edges",
            "result": "$4$",
            "why": "one edge per side"
          },
          {
            "do": "Find each degree",
            "result": "$2$",
            "why": "each vertex has two cycle neighbors"
          },
          {
            "do": "Sum degrees",
            "result": "$8$",
            "why": "four vertices times degree two"
          },
          {
            "do": "Check handshake",
            "result": "$2E=8$",
            "why": "the count matches"
          }
        ],
        "answer": "$V=4$, $E=4$, and every degree is $2$."
      },
      {
        "problem": "For a path on five vertices, relate Planar graphs to endpoint behavior.",
        "steps": [
          {
            "do": "Count vertices",
            "result": "$5$",
            "why": "given path size"
          },
          {
            "do": "Count edges",
            "result": "$4$",
            "why": "a path has $V-1$ edges"
          },
          {
            "do": "Find endpoint degrees",
            "result": "$1$ and $1$",
            "why": "the two ends have one neighbor"
          },
          {
            "do": "Find internal degrees",
            "result": "$2,2,2$",
            "why": "three internal vertices have two neighbors"
          },
          {
            "do": "Check degree sum",
            "result": "$1+1+2+2+2=8=2E$",
            "why": "handshake lemma holds"
          }
        ],
        "answer": "The path has two degree-$1$ endpoints and three degree-$2$ internal vertices."
      },
      {
        "problem": "A graph has two components, one triangle and one single edge. Compute total $V$ and $E$ for use in Planar graphs.",
        "steps": [
          {
            "do": "Count triangle vertices",
            "result": "$3$",
            "why": "three-cycle"
          },
          {
            "do": "Count triangle edges",
            "result": "$3$",
            "why": "one edge per side"
          },
          {
            "do": "Count single-edge vertices",
            "result": "$2$",
            "why": "two endpoints"
          },
          {
            "do": "Count single-edge edges",
            "result": "$1$",
            "why": "one edge"
          },
          {
            "do": "Add totals",
            "result": "$V=5$, $E=4$",
            "why": "combine components"
          }
        ],
        "answer": "The graph has $V=5$ and $E=4$."
      },
      {
        "problem": "ML-style use of Planar graphs: a node has neighbor feature values $1,4,7$. Compute sum and mean aggregates.",
        "steps": [
          {
            "do": "Sum neighbor features",
            "result": "$1+4+7=12$",
            "why": "sum aggregation adds messages"
          },
          {
            "do": "Count neighbors",
            "result": "$3$",
            "why": "there are three values"
          },
          {
            "do": "Compute mean",
            "result": "$12/3=4$",
            "why": "mean normalizes by degree"
          },
          {
            "do": "Compare sum and mean",
            "result": "$12$ versus $4$",
            "why": "normalization changes scale"
          },
          {
            "do": "Interpret",
            "result": "sum depends on degree while mean controls for degree",
            "why": "this matters in graph ML"
          }
        ],
        "answer": "The sum aggregate is $12$ and the mean aggregate is $4$."
      }
    ],
    "applications": [
      {
        "title": "Small network sanity checks",
        "background": "Engineers often test planar graphs on tiny graphs before trusting code on large ones.",
        "numbers": "A graph with $6$ vertices and $7$ edges has average degree $2E/V=14/6\\approx2.33$."
      },
      {
        "title": "Recommendation graphs",
        "background": "Recommender systems use planar graphs ideas because user-item data is naturally relational.",
        "numbers": "If $500$ users each connect to $20$ items, the graph has $10000$ observed edges."
      },
      {
        "title": "Social networks",
        "background": "Social platforms need graph methods to reason about friendships, follows, and communities.",
        "numbers": "A user with $35$ neighbors contributes degree $35$ and receives $35$ one-hop signals."
      },
      {
        "title": "Molecular graphs",
        "background": "Chemistry represents atoms and bonds as graphs, so planar graphs can become a model feature.",
        "numbers": "A carbon atom bonded to $4$ atoms has degree $4$ in the molecular graph."
      },
      {
        "title": "Infrastructure routing",
        "background": "Networks of services, roads, or machines are graphs where local constraints become global behavior.",
        "numbers": "A service dependency graph with $12$ services and $18$ calls has density $18/\\binom{12}{2}=18/66\\approx0.27$ if undirected."
      },
      {
        "title": "ML preprocessing",
        "background": "Many ML pipelines build graph features before training a downstream model.",
        "numbers": "A node feature vector of length $16$ for $1000$ nodes gives a $1000\\times16$ feature matrix."
      }
    ],
    "applicationsClose": "Planar graphs is one more reminder that graph ideas become powerful when a local rule is turned into a reliable computation.",
    "takeaways": [
      "Planar graphs has a precise definition that should be checked before using it.",
      "Small graphs are enough to test the arithmetic and the assumptions.",
      "The same structure scales to networks, matrices, and ML pipelines.",
      "Always separate the graph property from a particular drawing or implementation."
    ]
  },
  "math-15-19": {
    "id": "math-15-19",
    "title": "Euler's formula",
    "tagline": "Euler's formula balances every connected planar drawing by $V-E+F=2$.",
    "connections": {
      "buildsOn": [
        "Planar graphs",
        "cycles",
        "trees"
      ],
      "leadsTo": [
        "Eulerian graphs",
        "planar graph bounds",
        "topology"
      ],
      "usedWith": [
        "cycles",
        "degree",
        "connectivity",
        "paths"
      ]
    },
    "motivation": "<p>You already know the graph picture: dots connected by lines. Euler found that connected planar drawings keep one invariant no matter how the graph bends.</p><p><b>Euler's formula</b> gives that intuition a precise form, so a small graph can teach the same rule used by large networks.</p>",
    "definition": "<p>For a connected planar graph with $V$ vertices, $E$ edges, and $F$ faces, <b>Euler's formula</b> is $V-E+F=2$. A tree has $E=V-1$ and $F=1$, and adding an edge inside a face increases both $E$ and $F$ by one.</p><p>The useful habit is to connect the definition to a checkable number or construction. Small examples reveal whether the condition is about vertices, edges, faces, matrices, probabilities, or learned messages.</p><p><b>Assumptions that matter:</b> we use simple undirected graphs unless stated otherwise; vertex labels fix the order of any matrix; and the stated theorem applies only when its hypotheses, such as connectedness or planarity, are satisfied.</p>",
    "worked": {
      "problem": "A connected planar graph has $V=10$ and $E=15$. Find $F$.",
      "skills": [
        "Euler formula",
        "graph reasoning",
        "numerical checking"
      ],
      "strategy": "Substitute into $V-E+F=2$ and solve.",
      "steps": [
        {
          "do": "Identify the relevant graph data",
          "result": "vertices, edges, degrees, or matrix entries",
          "why": "the definition tells us what to inspect"
        },
        {
          "do": "Apply the key rule",
          "result": "$10-15+F=2$, so $F=7$",
          "why": "use the lesson's central criterion"
        },
        {
          "do": "Check the arithmetic",
          "result": "the stated numbers are consistent",
          "why": "graph counts should balance known identities"
        },
        {
          "do": "Interpret the result",
          "result": "Euler's formula turns planar geometry into arithmetic.",
          "why": "translate the computation back to the graph"
        },
        {
          "do": "State the conclusion",
          "result": "the required property or value has been found",
          "why": "the final answer follows from the checked rule"
        }
      ],
      "verify": "The conclusion matches the defining condition for euler's formula.",
      "answer": "$10-15+F=2$, so $F=7$.",
      "connects": "Euler's formula turns planar geometry into arithmetic."
    },
    "practice": [
      {
        "problem": "Basic check for Euler's formula: a graph has $V=4$ and $E=3$. Compute the average degree.",
        "steps": [
          {
            "do": "Use the average-degree formula",
            "result": "$2E/V$",
            "why": "each edge contributes two degree counts"
          },
          {
            "do": "Substitute values",
            "result": "$2\\cdot3/4$",
            "why": "use $E=3$ and $V=4$"
          },
          {
            "do": "Multiply numerator",
            "result": "$6/4$",
            "why": "compute $2E$"
          },
          {
            "do": "Divide",
            "result": "$1.5$",
            "why": "average degree may be non-integer"
          },
          {
            "do": "Interpret",
            "result": "typical vertex has degree $1.5$",
            "why": "an average summarizes the graph"
          }
        ],
        "answer": "The average degree is $1.5$."
      },
      {
        "problem": "Use a four-cycle while thinking about Euler's formula. Count vertices, edges, and degrees.",
        "steps": [
          {
            "do": "List vertices",
            "result": "$4$",
            "why": "a four-cycle has four corners"
          },
          {
            "do": "List edges",
            "result": "$4$",
            "why": "one edge per side"
          },
          {
            "do": "Find each degree",
            "result": "$2$",
            "why": "each vertex has two cycle neighbors"
          },
          {
            "do": "Sum degrees",
            "result": "$8$",
            "why": "four vertices times degree two"
          },
          {
            "do": "Check handshake",
            "result": "$2E=8$",
            "why": "the count matches"
          }
        ],
        "answer": "$V=4$, $E=4$, and every degree is $2$."
      },
      {
        "problem": "For a path on five vertices, relate Euler's formula to endpoint behavior.",
        "steps": [
          {
            "do": "Count vertices",
            "result": "$5$",
            "why": "given path size"
          },
          {
            "do": "Count edges",
            "result": "$4$",
            "why": "a path has $V-1$ edges"
          },
          {
            "do": "Find endpoint degrees",
            "result": "$1$ and $1$",
            "why": "the two ends have one neighbor"
          },
          {
            "do": "Find internal degrees",
            "result": "$2,2,2$",
            "why": "three internal vertices have two neighbors"
          },
          {
            "do": "Check degree sum",
            "result": "$1+1+2+2+2=8=2E$",
            "why": "handshake lemma holds"
          }
        ],
        "answer": "The path has two degree-$1$ endpoints and three degree-$2$ internal vertices."
      },
      {
        "problem": "A graph has two components, one triangle and one single edge. Compute total $V$ and $E$ for use in Euler's formula.",
        "steps": [
          {
            "do": "Count triangle vertices",
            "result": "$3$",
            "why": "three-cycle"
          },
          {
            "do": "Count triangle edges",
            "result": "$3$",
            "why": "one edge per side"
          },
          {
            "do": "Count single-edge vertices",
            "result": "$2$",
            "why": "two endpoints"
          },
          {
            "do": "Count single-edge edges",
            "result": "$1$",
            "why": "one edge"
          },
          {
            "do": "Add totals",
            "result": "$V=5$, $E=4$",
            "why": "combine components"
          }
        ],
        "answer": "The graph has $V=5$ and $E=4$."
      },
      {
        "problem": "ML-style use of Euler's formula: a node has neighbor feature values $1,4,7$. Compute sum and mean aggregates.",
        "steps": [
          {
            "do": "Sum neighbor features",
            "result": "$1+4+7=12$",
            "why": "sum aggregation adds messages"
          },
          {
            "do": "Count neighbors",
            "result": "$3$",
            "why": "there are three values"
          },
          {
            "do": "Compute mean",
            "result": "$12/3=4$",
            "why": "mean normalizes by degree"
          },
          {
            "do": "Compare sum and mean",
            "result": "$12$ versus $4$",
            "why": "normalization changes scale"
          },
          {
            "do": "Interpret",
            "result": "sum depends on degree while mean controls for degree",
            "why": "this matters in graph ML"
          }
        ],
        "answer": "The sum aggregate is $12$ and the mean aggregate is $4$."
      }
    ],
    "applications": [
      {
        "title": "Small network sanity checks",
        "background": "Engineers often test euler's formula on tiny graphs before trusting code on large ones.",
        "numbers": "A graph with $6$ vertices and $7$ edges has average degree $2E/V=14/6\\approx2.33$."
      },
      {
        "title": "Recommendation graphs",
        "background": "Recommender systems use euler's formula ideas because user-item data is naturally relational.",
        "numbers": "If $500$ users each connect to $20$ items, the graph has $10000$ observed edges."
      },
      {
        "title": "Social networks",
        "background": "Social platforms need graph methods to reason about friendships, follows, and communities.",
        "numbers": "A user with $35$ neighbors contributes degree $35$ and receives $35$ one-hop signals."
      },
      {
        "title": "Molecular graphs",
        "background": "Chemistry represents atoms and bonds as graphs, so euler's formula can become a model feature.",
        "numbers": "A carbon atom bonded to $4$ atoms has degree $4$ in the molecular graph."
      },
      {
        "title": "Infrastructure routing",
        "background": "Networks of services, roads, or machines are graphs where local constraints become global behavior.",
        "numbers": "A service dependency graph with $12$ services and $18$ calls has density $18/\\binom{12}{2}=18/66\\approx0.27$ if undirected."
      },
      {
        "title": "ML preprocessing",
        "background": "Many ML pipelines build graph features before training a downstream model.",
        "numbers": "A node feature vector of length $16$ for $1000$ nodes gives a $1000\\times16$ feature matrix."
      }
    ],
    "applicationsClose": "Euler's formula is one more reminder that graph ideas become powerful when a local rule is turned into a reliable computation.",
    "takeaways": [
      "Euler's formula has a precise definition that should be checked before using it.",
      "Small graphs are enough to test the arithmetic and the assumptions.",
      "The same structure scales to networks, matrices, and ML pipelines.",
      "Always separate the graph property from a particular drawing or implementation."
    ]
  },
  "math-15-20": {
    "id": "math-15-20",
    "title": "Eulerian graphs",
    "tagline": "An Eulerian graph lets you traverse every edge exactly once.",
    "connections": {
      "buildsOn": [
        "Euler's formula",
        "degree and the handshake lemma",
        "connectivity"
      ],
      "leadsTo": [
        "Hamiltonian graphs",
        "route inspection",
        "network design"
      ],
      "usedWith": [
        "cycles",
        "degree",
        "connectivity",
        "paths"
      ]
    },
    "motivation": "<p>You already know the graph picture: dots connected by lines. The one-stroke drawing puzzle is graph theory: can one walk use every edge exactly once?</p><p><b>Eulerian graphs</b> gives that intuition a precise form, so a small graph can teach the same rule used by large networks.</p>",
    "definition": "<p>An <b>Eulerian circuit</b> is a closed walk using every edge exactly once. A connected graph has one exactly when every vertex has even degree; it has an open Eulerian trail exactly when exactly two vertices have odd degree.</p><p>The useful habit is to connect the definition to a checkable number or construction. Small examples reveal whether the condition is about vertices, edges, faces, matrices, probabilities, or learned messages.</p><p><b>Assumptions that matter:</b> we use simple undirected graphs unless stated otherwise; vertex labels fix the order of any matrix; and the stated theorem applies only when its hypotheses, such as connectedness or planarity, are satisfied.</p>",
    "worked": {
      "problem": "Degrees are $2,2,4,4$ in a connected graph. Does an Eulerian circuit exist?",
      "skills": [
        "Eulerian routing",
        "graph reasoning",
        "numerical checking"
      ],
      "strategy": "Check connectedness and degree parity.",
      "steps": [
        {
          "do": "Identify the relevant graph data",
          "result": "vertices, edges, degrees, or matrix entries",
          "why": "the definition tells us what to inspect"
        },
        {
          "do": "Apply the key rule",
          "result": "all degrees are even, so an Eulerian circuit exists",
          "why": "use the lesson's central criterion"
        },
        {
          "do": "Check the arithmetic",
          "result": "the stated numbers are consistent",
          "why": "graph counts should balance known identities"
        },
        {
          "do": "Interpret the result",
          "result": "Eulerian structure is edge routing controlled by parity.",
          "why": "translate the computation back to the graph"
        },
        {
          "do": "State the conclusion",
          "result": "the required property or value has been found",
          "why": "the final answer follows from the checked rule"
        }
      ],
      "verify": "The conclusion matches the defining condition for eulerian graphs.",
      "answer": "all degrees are even, so an Eulerian circuit exists.",
      "connects": "Eulerian structure is edge routing controlled by parity."
    },
    "practice": [
      {
        "problem": "Basic check for Eulerian graphs: a graph has $V=4$ and $E=3$. Compute the average degree.",
        "steps": [
          {
            "do": "Use the average-degree formula",
            "result": "$2E/V$",
            "why": "each edge contributes two degree counts"
          },
          {
            "do": "Substitute values",
            "result": "$2\\cdot3/4$",
            "why": "use $E=3$ and $V=4$"
          },
          {
            "do": "Multiply numerator",
            "result": "$6/4$",
            "why": "compute $2E$"
          },
          {
            "do": "Divide",
            "result": "$1.5$",
            "why": "average degree may be non-integer"
          },
          {
            "do": "Interpret",
            "result": "typical vertex has degree $1.5$",
            "why": "an average summarizes the graph"
          }
        ],
        "answer": "The average degree is $1.5$."
      },
      {
        "problem": "Use a four-cycle while thinking about Eulerian graphs. Count vertices, edges, and degrees.",
        "steps": [
          {
            "do": "List vertices",
            "result": "$4$",
            "why": "a four-cycle has four corners"
          },
          {
            "do": "List edges",
            "result": "$4$",
            "why": "one edge per side"
          },
          {
            "do": "Find each degree",
            "result": "$2$",
            "why": "each vertex has two cycle neighbors"
          },
          {
            "do": "Sum degrees",
            "result": "$8$",
            "why": "four vertices times degree two"
          },
          {
            "do": "Check handshake",
            "result": "$2E=8$",
            "why": "the count matches"
          }
        ],
        "answer": "$V=4$, $E=4$, and every degree is $2$."
      },
      {
        "problem": "For a path on five vertices, relate Eulerian graphs to endpoint behavior.",
        "steps": [
          {
            "do": "Count vertices",
            "result": "$5$",
            "why": "given path size"
          },
          {
            "do": "Count edges",
            "result": "$4$",
            "why": "a path has $V-1$ edges"
          },
          {
            "do": "Find endpoint degrees",
            "result": "$1$ and $1$",
            "why": "the two ends have one neighbor"
          },
          {
            "do": "Find internal degrees",
            "result": "$2,2,2$",
            "why": "three internal vertices have two neighbors"
          },
          {
            "do": "Check degree sum",
            "result": "$1+1+2+2+2=8=2E$",
            "why": "handshake lemma holds"
          }
        ],
        "answer": "The path has two degree-$1$ endpoints and three degree-$2$ internal vertices."
      },
      {
        "problem": "A graph has two components, one triangle and one single edge. Compute total $V$ and $E$ for use in Eulerian graphs.",
        "steps": [
          {
            "do": "Count triangle vertices",
            "result": "$3$",
            "why": "three-cycle"
          },
          {
            "do": "Count triangle edges",
            "result": "$3$",
            "why": "one edge per side"
          },
          {
            "do": "Count single-edge vertices",
            "result": "$2$",
            "why": "two endpoints"
          },
          {
            "do": "Count single-edge edges",
            "result": "$1$",
            "why": "one edge"
          },
          {
            "do": "Add totals",
            "result": "$V=5$, $E=4$",
            "why": "combine components"
          }
        ],
        "answer": "The graph has $V=5$ and $E=4$."
      },
      {
        "problem": "ML-style use of Eulerian graphs: a node has neighbor feature values $1,4,7$. Compute sum and mean aggregates.",
        "steps": [
          {
            "do": "Sum neighbor features",
            "result": "$1+4+7=12$",
            "why": "sum aggregation adds messages"
          },
          {
            "do": "Count neighbors",
            "result": "$3$",
            "why": "there are three values"
          },
          {
            "do": "Compute mean",
            "result": "$12/3=4$",
            "why": "mean normalizes by degree"
          },
          {
            "do": "Compare sum and mean",
            "result": "$12$ versus $4$",
            "why": "normalization changes scale"
          },
          {
            "do": "Interpret",
            "result": "sum depends on degree while mean controls for degree",
            "why": "this matters in graph ML"
          }
        ],
        "answer": "The sum aggregate is $12$ and the mean aggregate is $4$."
      }
    ],
    "applications": [
      {
        "title": "Small network sanity checks",
        "background": "Engineers often test eulerian graphs on tiny graphs before trusting code on large ones.",
        "numbers": "A graph with $6$ vertices and $7$ edges has average degree $2E/V=14/6\\approx2.33$."
      },
      {
        "title": "Recommendation graphs",
        "background": "Recommender systems use eulerian graphs ideas because user-item data is naturally relational.",
        "numbers": "If $500$ users each connect to $20$ items, the graph has $10000$ observed edges."
      },
      {
        "title": "Social networks",
        "background": "Social platforms need graph methods to reason about friendships, follows, and communities.",
        "numbers": "A user with $35$ neighbors contributes degree $35$ and receives $35$ one-hop signals."
      },
      {
        "title": "Molecular graphs",
        "background": "Chemistry represents atoms and bonds as graphs, so eulerian graphs can become a model feature.",
        "numbers": "A carbon atom bonded to $4$ atoms has degree $4$ in the molecular graph."
      },
      {
        "title": "Infrastructure routing",
        "background": "Networks of services, roads, or machines are graphs where local constraints become global behavior.",
        "numbers": "A service dependency graph with $12$ services and $18$ calls has density $18/\\binom{12}{2}=18/66\\approx0.27$ if undirected."
      },
      {
        "title": "ML preprocessing",
        "background": "Many ML pipelines build graph features before training a downstream model.",
        "numbers": "A node feature vector of length $16$ for $1000$ nodes gives a $1000\\times16$ feature matrix."
      }
    ],
    "applicationsClose": "Eulerian graphs is one more reminder that graph ideas become powerful when a local rule is turned into a reliable computation.",
    "takeaways": [
      "Eulerian graphs has a precise definition that should be checked before using it.",
      "Small graphs are enough to test the arithmetic and the assumptions.",
      "The same structure scales to networks, matrices, and ML pipelines.",
      "Always separate the graph property from a particular drawing or implementation."
    ]
  },
  "math-15-21": {
    "id": "math-15-21",
    "title": "Hamiltonian graphs",
    "tagline": "A Hamiltonian graph contains a cycle visiting every vertex exactly once.",
    "connections": {
      "buildsOn": [
        "Eulerian graphs",
        "cycles",
        "paths and walks"
      ],
      "leadsTo": [
        "The adjacency matrix",
        "traveling salesperson problem",
        "complexity"
      ],
      "usedWith": [
        "cycles",
        "degree",
        "connectivity",
        "paths"
      ]
    },
    "motivation": "<p>You already know the graph picture: dots connected by lines. Hamiltonian questions care about visiting places once, not using roads once.</p><p><b>Hamiltonian graphs</b> gives that intuition a precise form, so a small graph can teach the same rule used by large networks.</p>",
    "definition": "<p>A <b>Hamiltonian cycle</b> visits every vertex exactly once and returns to the start. Unlike Eulerian circuits, there is no simple degree-parity characterization, and finding one is computationally hard in general.</p><p>The useful habit is to connect the definition to a checkable number or construction. Small examples reveal whether the condition is about vertices, edges, faces, matrices, probabilities, or learned messages.</p><p><b>Assumptions that matter:</b> we use simple undirected graphs unless stated otherwise; vertex labels fix the order of any matrix; and the stated theorem applies only when its hypotheses, such as connectedness or planarity, are satisfied.</p>",
    "worked": {
      "problem": "Show that $K_5$ has a Hamiltonian cycle.",
      "skills": [
        "Hamiltonian cycles",
        "graph reasoning",
        "numerical checking"
      ],
      "strategy": "Use the fact that every pair of vertices is adjacent.",
      "steps": [
        {
          "do": "Identify the relevant graph data",
          "result": "vertices, edges, degrees, or matrix entries",
          "why": "the definition tells us what to inspect"
        },
        {
          "do": "Apply the key rule",
          "result": "$1$--$2$--$3$--$4$--$5$--$1$ is a valid cycle",
          "why": "use the lesson's central criterion"
        },
        {
          "do": "Check the arithmetic",
          "result": "the stated numbers are consistent",
          "why": "graph counts should balance known identities"
        },
        {
          "do": "Interpret the result",
          "result": "Hamiltonian structure is about spanning vertex cycles.",
          "why": "translate the computation back to the graph"
        },
        {
          "do": "State the conclusion",
          "result": "the required property or value has been found",
          "why": "the final answer follows from the checked rule"
        }
      ],
      "verify": "The conclusion matches the defining condition for hamiltonian graphs.",
      "answer": "$1$--$2$--$3$--$4$--$5$--$1$ is a valid cycle.",
      "connects": "Hamiltonian structure is about spanning vertex cycles."
    },
    "practice": [
      {
        "problem": "Basic check for Hamiltonian graphs: a graph has $V=4$ and $E=3$. Compute the average degree.",
        "steps": [
          {
            "do": "Use the average-degree formula",
            "result": "$2E/V$",
            "why": "each edge contributes two degree counts"
          },
          {
            "do": "Substitute values",
            "result": "$2\\cdot3/4$",
            "why": "use $E=3$ and $V=4$"
          },
          {
            "do": "Multiply numerator",
            "result": "$6/4$",
            "why": "compute $2E$"
          },
          {
            "do": "Divide",
            "result": "$1.5$",
            "why": "average degree may be non-integer"
          },
          {
            "do": "Interpret",
            "result": "typical vertex has degree $1.5$",
            "why": "an average summarizes the graph"
          }
        ],
        "answer": "The average degree is $1.5$."
      },
      {
        "problem": "Use a four-cycle while thinking about Hamiltonian graphs. Count vertices, edges, and degrees.",
        "steps": [
          {
            "do": "List vertices",
            "result": "$4$",
            "why": "a four-cycle has four corners"
          },
          {
            "do": "List edges",
            "result": "$4$",
            "why": "one edge per side"
          },
          {
            "do": "Find each degree",
            "result": "$2$",
            "why": "each vertex has two cycle neighbors"
          },
          {
            "do": "Sum degrees",
            "result": "$8$",
            "why": "four vertices times degree two"
          },
          {
            "do": "Check handshake",
            "result": "$2E=8$",
            "why": "the count matches"
          }
        ],
        "answer": "$V=4$, $E=4$, and every degree is $2$."
      },
      {
        "problem": "For a path on five vertices, relate Hamiltonian graphs to endpoint behavior.",
        "steps": [
          {
            "do": "Count vertices",
            "result": "$5$",
            "why": "given path size"
          },
          {
            "do": "Count edges",
            "result": "$4$",
            "why": "a path has $V-1$ edges"
          },
          {
            "do": "Find endpoint degrees",
            "result": "$1$ and $1$",
            "why": "the two ends have one neighbor"
          },
          {
            "do": "Find internal degrees",
            "result": "$2,2,2$",
            "why": "three internal vertices have two neighbors"
          },
          {
            "do": "Check degree sum",
            "result": "$1+1+2+2+2=8=2E$",
            "why": "handshake lemma holds"
          }
        ],
        "answer": "The path has two degree-$1$ endpoints and three degree-$2$ internal vertices."
      },
      {
        "problem": "A graph has two components, one triangle and one single edge. Compute total $V$ and $E$ for use in Hamiltonian graphs.",
        "steps": [
          {
            "do": "Count triangle vertices",
            "result": "$3$",
            "why": "three-cycle"
          },
          {
            "do": "Count triangle edges",
            "result": "$3$",
            "why": "one edge per side"
          },
          {
            "do": "Count single-edge vertices",
            "result": "$2$",
            "why": "two endpoints"
          },
          {
            "do": "Count single-edge edges",
            "result": "$1$",
            "why": "one edge"
          },
          {
            "do": "Add totals",
            "result": "$V=5$, $E=4$",
            "why": "combine components"
          }
        ],
        "answer": "The graph has $V=5$ and $E=4$."
      },
      {
        "problem": "ML-style use of Hamiltonian graphs: a node has neighbor feature values $1,4,7$. Compute sum and mean aggregates.",
        "steps": [
          {
            "do": "Sum neighbor features",
            "result": "$1+4+7=12$",
            "why": "sum aggregation adds messages"
          },
          {
            "do": "Count neighbors",
            "result": "$3$",
            "why": "there are three values"
          },
          {
            "do": "Compute mean",
            "result": "$12/3=4$",
            "why": "mean normalizes by degree"
          },
          {
            "do": "Compare sum and mean",
            "result": "$12$ versus $4$",
            "why": "normalization changes scale"
          },
          {
            "do": "Interpret",
            "result": "sum depends on degree while mean controls for degree",
            "why": "this matters in graph ML"
          }
        ],
        "answer": "The sum aggregate is $12$ and the mean aggregate is $4$."
      }
    ],
    "applications": [
      {
        "title": "Small network sanity checks",
        "background": "Engineers often test hamiltonian graphs on tiny graphs before trusting code on large ones.",
        "numbers": "A graph with $6$ vertices and $7$ edges has average degree $2E/V=14/6\\approx2.33$."
      },
      {
        "title": "Recommendation graphs",
        "background": "Recommender systems use hamiltonian graphs ideas because user-item data is naturally relational.",
        "numbers": "If $500$ users each connect to $20$ items, the graph has $10000$ observed edges."
      },
      {
        "title": "Social networks",
        "background": "Social platforms need graph methods to reason about friendships, follows, and communities.",
        "numbers": "A user with $35$ neighbors contributes degree $35$ and receives $35$ one-hop signals."
      },
      {
        "title": "Molecular graphs",
        "background": "Chemistry represents atoms and bonds as graphs, so hamiltonian graphs can become a model feature.",
        "numbers": "A carbon atom bonded to $4$ atoms has degree $4$ in the molecular graph."
      },
      {
        "title": "Infrastructure routing",
        "background": "Networks of services, roads, or machines are graphs where local constraints become global behavior.",
        "numbers": "A service dependency graph with $12$ services and $18$ calls has density $18/\\binom{12}{2}=18/66\\approx0.27$ if undirected."
      },
      {
        "title": "ML preprocessing",
        "background": "Many ML pipelines build graph features before training a downstream model.",
        "numbers": "A node feature vector of length $16$ for $1000$ nodes gives a $1000\\times16$ feature matrix."
      }
    ],
    "applicationsClose": "Hamiltonian graphs is one more reminder that graph ideas become powerful when a local rule is turned into a reliable computation.",
    "takeaways": [
      "Hamiltonian graphs has a precise definition that should be checked before using it.",
      "Small graphs are enough to test the arithmetic and the assumptions.",
      "The same structure scales to networks, matrices, and ML pipelines.",
      "Always separate the graph property from a particular drawing or implementation."
    ]
  },
  "math-15-22": {
    "id": "math-15-22",
    "title": "The adjacency matrix",
    "tagline": "The adjacency matrix stores a graph as numbers for linear algebra.",
    "connections": {
      "buildsOn": [
        "Hamiltonian graphs",
        "matrices",
        "graphs and their representations"
      ],
      "leadsTo": [
        "The graph Laplacian",
        "Spectral graph theory",
        "Graph neural networks & message passing"
      ],
      "usedWith": [
        "matrices",
        "eigenvectors",
        "degree",
        "linear algebra"
      ]
    },
    "motivation": "<p>You already know the graph picture: dots connected by lines. A drawing helps people, but matrices help computers count walks and run algorithms.</p><p><b>The adjacency matrix</b> gives that intuition a precise form, so a small graph can teach the same rule used by large networks.</p>",
    "definition": "<p>For vertices $1,\\ldots,n$, the <b>adjacency matrix</b> $A$ has $A_{ij}=1$ if $i$ and $j$ are adjacent and $0$ otherwise. For a simple undirected graph, $A$ is symmetric with zero diagonal, and $(A^k)_{ij}$ counts length-$k$ walks.</p><p>The useful habit is to connect the definition to a checkable number or construction. Small examples reveal whether the condition is about vertices, edges, faces, matrices, probabilities, or learned messages.</p><p><b>Assumptions that matter:</b> we use simple undirected graphs unless stated otherwise; vertex labels fix the order of any matrix; and the stated theorem applies only when its hypotheses, such as connectedness or planarity, are satisfied.</p>",
    "worked": {
      "problem": "Write the adjacency matrix for path $1$--$2$--$3$.",
      "skills": [
        "adjacency matrices",
        "graph reasoning",
        "numerical checking"
      ],
      "strategy": "Fill symmetric ones for edges and zeros elsewhere.",
      "steps": [
        {
          "do": "Identify the relevant graph data",
          "result": "vertices, edges, degrees, or matrix entries",
          "why": "the definition tells us what to inspect"
        },
        {
          "do": "Apply the key rule",
          "result": "$A=\\begin{bmatrix}0&1&0\\\\1&0&1\\\\0&1&0\\end{bmatrix}$",
          "why": "use the lesson's central criterion"
        },
        {
          "do": "Check the arithmetic",
          "result": "the stated numbers are consistent",
          "why": "graph counts should balance known identities"
        },
        {
          "do": "Interpret the result",
          "result": "The adjacency matrix is the graph as arithmetic data.",
          "why": "translate the computation back to the graph"
        },
        {
          "do": "State the conclusion",
          "result": "the required property or value has been found",
          "why": "the final answer follows from the checked rule"
        }
      ],
      "verify": "The conclusion matches the defining condition for the adjacency matrix.",
      "answer": "$A=\\begin{bmatrix}0&1&0\\\\1&0&1\\\\0&1&0\\end{bmatrix}$.",
      "connects": "The adjacency matrix is the graph as arithmetic data."
    },
    "practice": [
      {
        "problem": "Basic check for The adjacency matrix: a graph has $V=4$ and $E=3$. Compute the average degree.",
        "steps": [
          {
            "do": "Use the average-degree formula",
            "result": "$2E/V$",
            "why": "each edge contributes two degree counts"
          },
          {
            "do": "Substitute values",
            "result": "$2\\cdot3/4$",
            "why": "use $E=3$ and $V=4$"
          },
          {
            "do": "Multiply numerator",
            "result": "$6/4$",
            "why": "compute $2E$"
          },
          {
            "do": "Divide",
            "result": "$1.5$",
            "why": "average degree may be non-integer"
          },
          {
            "do": "Interpret",
            "result": "typical vertex has degree $1.5$",
            "why": "an average summarizes the graph"
          }
        ],
        "answer": "The average degree is $1.5$."
      },
      {
        "problem": "Use a four-cycle while thinking about The adjacency matrix. Count vertices, edges, and degrees.",
        "steps": [
          {
            "do": "List vertices",
            "result": "$4$",
            "why": "a four-cycle has four corners"
          },
          {
            "do": "List edges",
            "result": "$4$",
            "why": "one edge per side"
          },
          {
            "do": "Find each degree",
            "result": "$2$",
            "why": "each vertex has two cycle neighbors"
          },
          {
            "do": "Sum degrees",
            "result": "$8$",
            "why": "four vertices times degree two"
          },
          {
            "do": "Check handshake",
            "result": "$2E=8$",
            "why": "the count matches"
          }
        ],
        "answer": "$V=4$, $E=4$, and every degree is $2$."
      },
      {
        "problem": "For a path on five vertices, relate The adjacency matrix to endpoint behavior.",
        "steps": [
          {
            "do": "Count vertices",
            "result": "$5$",
            "why": "given path size"
          },
          {
            "do": "Count edges",
            "result": "$4$",
            "why": "a path has $V-1$ edges"
          },
          {
            "do": "Find endpoint degrees",
            "result": "$1$ and $1$",
            "why": "the two ends have one neighbor"
          },
          {
            "do": "Find internal degrees",
            "result": "$2,2,2$",
            "why": "three internal vertices have two neighbors"
          },
          {
            "do": "Check degree sum",
            "result": "$1+1+2+2+2=8=2E$",
            "why": "handshake lemma holds"
          }
        ],
        "answer": "The path has two degree-$1$ endpoints and three degree-$2$ internal vertices."
      },
      {
        "problem": "A graph has two components, one triangle and one single edge. Compute total $V$ and $E$ for use in The adjacency matrix.",
        "steps": [
          {
            "do": "Count triangle vertices",
            "result": "$3$",
            "why": "three-cycle"
          },
          {
            "do": "Count triangle edges",
            "result": "$3$",
            "why": "one edge per side"
          },
          {
            "do": "Count single-edge vertices",
            "result": "$2$",
            "why": "two endpoints"
          },
          {
            "do": "Count single-edge edges",
            "result": "$1$",
            "why": "one edge"
          },
          {
            "do": "Add totals",
            "result": "$V=5$, $E=4$",
            "why": "combine components"
          }
        ],
        "answer": "The graph has $V=5$ and $E=4$."
      },
      {
        "problem": "ML-style use of The adjacency matrix: a node has neighbor feature values $1,4,7$. Compute sum and mean aggregates.",
        "steps": [
          {
            "do": "Sum neighbor features",
            "result": "$1+4+7=12$",
            "why": "sum aggregation adds messages"
          },
          {
            "do": "Count neighbors",
            "result": "$3$",
            "why": "there are three values"
          },
          {
            "do": "Compute mean",
            "result": "$12/3=4$",
            "why": "mean normalizes by degree"
          },
          {
            "do": "Compare sum and mean",
            "result": "$12$ versus $4$",
            "why": "normalization changes scale"
          },
          {
            "do": "Interpret",
            "result": "sum depends on degree while mean controls for degree",
            "why": "this matters in graph ML"
          }
        ],
        "answer": "The sum aggregate is $12$ and the mean aggregate is $4$."
      }
    ],
    "applications": [
      {
        "title": "Small network sanity checks",
        "background": "Engineers often test the adjacency matrix on tiny graphs before trusting code on large ones.",
        "numbers": "A graph with $6$ vertices and $7$ edges has average degree $2E/V=14/6\\approx2.33$."
      },
      {
        "title": "Recommendation graphs",
        "background": "Recommender systems use the adjacency matrix ideas because user-item data is naturally relational.",
        "numbers": "If $500$ users each connect to $20$ items, the graph has $10000$ observed edges."
      },
      {
        "title": "Social networks",
        "background": "Social platforms need graph methods to reason about friendships, follows, and communities.",
        "numbers": "A user with $35$ neighbors contributes degree $35$ and receives $35$ one-hop signals."
      },
      {
        "title": "Molecular graphs",
        "background": "Chemistry represents atoms and bonds as graphs, so the adjacency matrix can become a model feature.",
        "numbers": "A carbon atom bonded to $4$ atoms has degree $4$ in the molecular graph."
      },
      {
        "title": "Infrastructure routing",
        "background": "Networks of services, roads, or machines are graphs where local constraints become global behavior.",
        "numbers": "A service dependency graph with $12$ services and $18$ calls has density $18/\\binom{12}{2}=18/66\\approx0.27$ if undirected."
      },
      {
        "title": "ML preprocessing",
        "background": "Many ML pipelines build graph features before training a downstream model.",
        "numbers": "A node feature vector of length $16$ for $1000$ nodes gives a $1000\\times16$ feature matrix."
      }
    ],
    "applicationsClose": "The adjacency matrix is one more reminder that graph ideas become powerful when a local rule is turned into a reliable computation.",
    "takeaways": [
      "The adjacency matrix has a precise definition that should be checked before using it.",
      "Small graphs are enough to test the arithmetic and the assumptions.",
      "The same structure scales to networks, matrices, and ML pipelines.",
      "Always separate the graph property from a particular drawing or implementation."
    ]
  },
  "math-15-23": {
    "id": "math-15-23",
    "title": "The graph Laplacian",
    "tagline": "The graph Laplacian $L=D-A$ measures how a vertex differs from its neighbors.",
    "connections": {
      "buildsOn": [
        "The adjacency matrix",
        "degree",
        "linear algebra"
      ],
      "leadsTo": [
        "Spectral graph theory",
        "Spectral clustering",
        "diffusion on graphs"
      ],
      "usedWith": [
        "matrices",
        "eigenvectors",
        "degree",
        "linear algebra"
      ]
    },
    "motivation": "<p>You already know the graph picture: dots connected by lines. Adjacency says who touches whom; the Laplacian measures local disagreement across those touches.</p><p><b>The graph Laplacian</b> gives that intuition a precise form, so a small graph can teach the same rule used by large networks.</p>",
    "definition": "<p>For adjacency matrix $A$ and degree matrix $D$, the unnormalized <b>graph Laplacian</b> is $L=D-A$. For a signal $x$, $(Lx)_i=\\sum_{j\\sim i}(x_i-x_j)$ and $x^TLx=\\sum_{(i,j)\\in E}(x_i-x_j)^2$.</p><p>The useful habit is to connect the definition to a checkable number or construction. Small examples reveal whether the condition is about vertices, edges, faces, matrices, probabilities, or learned messages.</p><p><b>Assumptions that matter:</b> we use simple undirected graphs unless stated otherwise; vertex labels fix the order of any matrix; and the stated theorem applies only when its hypotheses, such as connectedness or planarity, are satisfied.</p>",
    "worked": {
      "problem": "Compute $L$ for path $1$--$2$--$3$.",
      "skills": [
        "graph Laplacians",
        "graph reasoning",
        "numerical checking"
      ],
      "strategy": "Build $D$ and $A$, then subtract.",
      "steps": [
        {
          "do": "Identify the relevant graph data",
          "result": "vertices, edges, degrees, or matrix entries",
          "why": "the definition tells us what to inspect"
        },
        {
          "do": "Apply the key rule",
          "result": "$L=\\begin{bmatrix}1&-1&0\\\\-1&2&-1\\\\0&-1&1\\end{bmatrix}$",
          "why": "use the lesson's central criterion"
        },
        {
          "do": "Check the arithmetic",
          "result": "the stated numbers are consistent",
          "why": "graph counts should balance known identities"
        },
        {
          "do": "Interpret the result",
          "result": "The Laplacian encodes neighbor differences.",
          "why": "translate the computation back to the graph"
        },
        {
          "do": "State the conclusion",
          "result": "the required property or value has been found",
          "why": "the final answer follows from the checked rule"
        }
      ],
      "verify": "The conclusion matches the defining condition for the graph laplacian.",
      "answer": "$L=\\begin{bmatrix}1&-1&0\\\\-1&2&-1\\\\0&-1&1\\end{bmatrix}$.",
      "connects": "The Laplacian encodes neighbor differences."
    },
    "practice": [
      {
        "problem": "Basic check for The graph Laplacian: a graph has $V=4$ and $E=3$. Compute the average degree.",
        "steps": [
          {
            "do": "Use the average-degree formula",
            "result": "$2E/V$",
            "why": "each edge contributes two degree counts"
          },
          {
            "do": "Substitute values",
            "result": "$2\\cdot3/4$",
            "why": "use $E=3$ and $V=4$"
          },
          {
            "do": "Multiply numerator",
            "result": "$6/4$",
            "why": "compute $2E$"
          },
          {
            "do": "Divide",
            "result": "$1.5$",
            "why": "average degree may be non-integer"
          },
          {
            "do": "Interpret",
            "result": "typical vertex has degree $1.5$",
            "why": "an average summarizes the graph"
          }
        ],
        "answer": "The average degree is $1.5$."
      },
      {
        "problem": "Use a four-cycle while thinking about The graph Laplacian. Count vertices, edges, and degrees.",
        "steps": [
          {
            "do": "List vertices",
            "result": "$4$",
            "why": "a four-cycle has four corners"
          },
          {
            "do": "List edges",
            "result": "$4$",
            "why": "one edge per side"
          },
          {
            "do": "Find each degree",
            "result": "$2$",
            "why": "each vertex has two cycle neighbors"
          },
          {
            "do": "Sum degrees",
            "result": "$8$",
            "why": "four vertices times degree two"
          },
          {
            "do": "Check handshake",
            "result": "$2E=8$",
            "why": "the count matches"
          }
        ],
        "answer": "$V=4$, $E=4$, and every degree is $2$."
      },
      {
        "problem": "For a path on five vertices, relate The graph Laplacian to endpoint behavior.",
        "steps": [
          {
            "do": "Count vertices",
            "result": "$5$",
            "why": "given path size"
          },
          {
            "do": "Count edges",
            "result": "$4$",
            "why": "a path has $V-1$ edges"
          },
          {
            "do": "Find endpoint degrees",
            "result": "$1$ and $1$",
            "why": "the two ends have one neighbor"
          },
          {
            "do": "Find internal degrees",
            "result": "$2,2,2$",
            "why": "three internal vertices have two neighbors"
          },
          {
            "do": "Check degree sum",
            "result": "$1+1+2+2+2=8=2E$",
            "why": "handshake lemma holds"
          }
        ],
        "answer": "The path has two degree-$1$ endpoints and three degree-$2$ internal vertices."
      },
      {
        "problem": "A graph has two components, one triangle and one single edge. Compute total $V$ and $E$ for use in The graph Laplacian.",
        "steps": [
          {
            "do": "Count triangle vertices",
            "result": "$3$",
            "why": "three-cycle"
          },
          {
            "do": "Count triangle edges",
            "result": "$3$",
            "why": "one edge per side"
          },
          {
            "do": "Count single-edge vertices",
            "result": "$2$",
            "why": "two endpoints"
          },
          {
            "do": "Count single-edge edges",
            "result": "$1$",
            "why": "one edge"
          },
          {
            "do": "Add totals",
            "result": "$V=5$, $E=4$",
            "why": "combine components"
          }
        ],
        "answer": "The graph has $V=5$ and $E=4$."
      },
      {
        "problem": "ML-style use of The graph Laplacian: a node has neighbor feature values $1,4,7$. Compute sum and mean aggregates.",
        "steps": [
          {
            "do": "Sum neighbor features",
            "result": "$1+4+7=12$",
            "why": "sum aggregation adds messages"
          },
          {
            "do": "Count neighbors",
            "result": "$3$",
            "why": "there are three values"
          },
          {
            "do": "Compute mean",
            "result": "$12/3=4$",
            "why": "mean normalizes by degree"
          },
          {
            "do": "Compare sum and mean",
            "result": "$12$ versus $4$",
            "why": "normalization changes scale"
          },
          {
            "do": "Interpret",
            "result": "sum depends on degree while mean controls for degree",
            "why": "this matters in graph ML"
          }
        ],
        "answer": "The sum aggregate is $12$ and the mean aggregate is $4$."
      }
    ],
    "applications": [
      {
        "title": "Small network sanity checks",
        "background": "Engineers often test the graph laplacian on tiny graphs before trusting code on large ones.",
        "numbers": "A graph with $6$ vertices and $7$ edges has average degree $2E/V=14/6\\approx2.33$."
      },
      {
        "title": "Recommendation graphs",
        "background": "Recommender systems use the graph laplacian ideas because user-item data is naturally relational.",
        "numbers": "If $500$ users each connect to $20$ items, the graph has $10000$ observed edges."
      },
      {
        "title": "Social networks",
        "background": "Social platforms need graph methods to reason about friendships, follows, and communities.",
        "numbers": "A user with $35$ neighbors contributes degree $35$ and receives $35$ one-hop signals."
      },
      {
        "title": "Molecular graphs",
        "background": "Chemistry represents atoms and bonds as graphs, so the graph laplacian can become a model feature.",
        "numbers": "A carbon atom bonded to $4$ atoms has degree $4$ in the molecular graph."
      },
      {
        "title": "Infrastructure routing",
        "background": "Networks of services, roads, or machines are graphs where local constraints become global behavior.",
        "numbers": "A service dependency graph with $12$ services and $18$ calls has density $18/\\binom{12}{2}=18/66\\approx0.27$ if undirected."
      },
      {
        "title": "ML preprocessing",
        "background": "Many ML pipelines build graph features before training a downstream model.",
        "numbers": "A node feature vector of length $16$ for $1000$ nodes gives a $1000\\times16$ feature matrix."
      }
    ],
    "applicationsClose": "The graph Laplacian is one more reminder that graph ideas become powerful when a local rule is turned into a reliable computation.",
    "takeaways": [
      "The graph Laplacian has a precise definition that should be checked before using it.",
      "Small graphs are enough to test the arithmetic and the assumptions.",
      "The same structure scales to networks, matrices, and ML pipelines.",
      "Always separate the graph property from a particular drawing or implementation."
    ]
  },
  "math-15-24": {
    "id": "math-15-24",
    "title": "Spectral graph theory",
    "tagline": "Spectral graph theory reads graph structure from eigenvalues and eigenvectors.",
    "connections": {
      "buildsOn": [
        "The graph Laplacian",
        "eigenvalues",
        "linear algebra"
      ],
      "leadsTo": [
        "Random graphs",
        "Spectral clustering",
        "graph signal processing"
      ],
      "usedWith": [
        "matrices",
        "eigenvectors",
        "degree",
        "linear algebra"
      ]
    },
    "motivation": "<p>You already know the graph picture: dots connected by lines. A graph matrix can speak through its eigenvalues, revealing components and bottlenecks.</p><p><b>Spectral graph theory</b> gives that intuition a precise form, so a small graph can teach the same rule used by large networks.</p>",
    "definition": "<p><b>Spectral graph theory</b> studies eigenvalues and eigenvectors of graph matrices such as $A$ and $L$. For an undirected Laplacian, $0=\\lambda_1\\le\\lambda_2\\le\\cdots$, and the number of zero eigenvalues equals the number of connected components.</p><p>The useful habit is to connect the definition to a checkable number or construction. Small examples reveal whether the condition is about vertices, edges, faces, matrices, probabilities, or learned messages.</p><p><b>Assumptions that matter:</b> we use simple undirected graphs unless stated otherwise; vertex labels fix the order of any matrix; and the stated theorem applies only when its hypotheses, such as connectedness or planarity, are satisfied.</p>",
    "worked": {
      "problem": "A graph has Laplacian eigenvalues $0,0,3,5$. How many components?",
      "skills": [
        "spectra",
        "graph reasoning",
        "numerical checking"
      ],
      "strategy": "Count the multiplicity of eigenvalue zero.",
      "steps": [
        {
          "do": "Identify the relevant graph data",
          "result": "vertices, edges, degrees, or matrix entries",
          "why": "the definition tells us what to inspect"
        },
        {
          "do": "Apply the key rule",
          "result": "two zero eigenvalues mean two components",
          "why": "use the lesson's central criterion"
        },
        {
          "do": "Check the arithmetic",
          "result": "the stated numbers are consistent",
          "why": "graph counts should balance known identities"
        },
        {
          "do": "Interpret the result",
          "result": "The Laplacian spectrum counts connected pieces before measuring bottlenecks.",
          "why": "translate the computation back to the graph"
        },
        {
          "do": "State the conclusion",
          "result": "the required property or value has been found",
          "why": "the final answer follows from the checked rule"
        }
      ],
      "verify": "The conclusion matches the defining condition for spectral graph theory.",
      "answer": "two zero eigenvalues mean two components.",
      "connects": "The Laplacian spectrum counts connected pieces before measuring bottlenecks."
    },
    "practice": [
      {
        "problem": "Basic check for Spectral graph theory: a graph has $V=4$ and $E=3$. Compute the average degree.",
        "steps": [
          {
            "do": "Use the average-degree formula",
            "result": "$2E/V$",
            "why": "each edge contributes two degree counts"
          },
          {
            "do": "Substitute values",
            "result": "$2\\cdot3/4$",
            "why": "use $E=3$ and $V=4$"
          },
          {
            "do": "Multiply numerator",
            "result": "$6/4$",
            "why": "compute $2E$"
          },
          {
            "do": "Divide",
            "result": "$1.5$",
            "why": "average degree may be non-integer"
          },
          {
            "do": "Interpret",
            "result": "typical vertex has degree $1.5$",
            "why": "an average summarizes the graph"
          }
        ],
        "answer": "The average degree is $1.5$."
      },
      {
        "problem": "Use a four-cycle while thinking about Spectral graph theory. Count vertices, edges, and degrees.",
        "steps": [
          {
            "do": "List vertices",
            "result": "$4$",
            "why": "a four-cycle has four corners"
          },
          {
            "do": "List edges",
            "result": "$4$",
            "why": "one edge per side"
          },
          {
            "do": "Find each degree",
            "result": "$2$",
            "why": "each vertex has two cycle neighbors"
          },
          {
            "do": "Sum degrees",
            "result": "$8$",
            "why": "four vertices times degree two"
          },
          {
            "do": "Check handshake",
            "result": "$2E=8$",
            "why": "the count matches"
          }
        ],
        "answer": "$V=4$, $E=4$, and every degree is $2$."
      },
      {
        "problem": "For a path on five vertices, relate Spectral graph theory to endpoint behavior.",
        "steps": [
          {
            "do": "Count vertices",
            "result": "$5$",
            "why": "given path size"
          },
          {
            "do": "Count edges",
            "result": "$4$",
            "why": "a path has $V-1$ edges"
          },
          {
            "do": "Find endpoint degrees",
            "result": "$1$ and $1$",
            "why": "the two ends have one neighbor"
          },
          {
            "do": "Find internal degrees",
            "result": "$2,2,2$",
            "why": "three internal vertices have two neighbors"
          },
          {
            "do": "Check degree sum",
            "result": "$1+1+2+2+2=8=2E$",
            "why": "handshake lemma holds"
          }
        ],
        "answer": "The path has two degree-$1$ endpoints and three degree-$2$ internal vertices."
      },
      {
        "problem": "A graph has two components, one triangle and one single edge. Compute total $V$ and $E$ for use in Spectral graph theory.",
        "steps": [
          {
            "do": "Count triangle vertices",
            "result": "$3$",
            "why": "three-cycle"
          },
          {
            "do": "Count triangle edges",
            "result": "$3$",
            "why": "one edge per side"
          },
          {
            "do": "Count single-edge vertices",
            "result": "$2$",
            "why": "two endpoints"
          },
          {
            "do": "Count single-edge edges",
            "result": "$1$",
            "why": "one edge"
          },
          {
            "do": "Add totals",
            "result": "$V=5$, $E=4$",
            "why": "combine components"
          }
        ],
        "answer": "The graph has $V=5$ and $E=4$."
      },
      {
        "problem": "ML-style use of Spectral graph theory: a node has neighbor feature values $1,4,7$. Compute sum and mean aggregates.",
        "steps": [
          {
            "do": "Sum neighbor features",
            "result": "$1+4+7=12$",
            "why": "sum aggregation adds messages"
          },
          {
            "do": "Count neighbors",
            "result": "$3$",
            "why": "there are three values"
          },
          {
            "do": "Compute mean",
            "result": "$12/3=4$",
            "why": "mean normalizes by degree"
          },
          {
            "do": "Compare sum and mean",
            "result": "$12$ versus $4$",
            "why": "normalization changes scale"
          },
          {
            "do": "Interpret",
            "result": "sum depends on degree while mean controls for degree",
            "why": "this matters in graph ML"
          }
        ],
        "answer": "The sum aggregate is $12$ and the mean aggregate is $4$."
      }
    ],
    "applications": [
      {
        "title": "Small network sanity checks",
        "background": "Engineers often test spectral graph theory on tiny graphs before trusting code on large ones.",
        "numbers": "A graph with $6$ vertices and $7$ edges has average degree $2E/V=14/6\\approx2.33$."
      },
      {
        "title": "Recommendation graphs",
        "background": "Recommender systems use spectral graph theory ideas because user-item data is naturally relational.",
        "numbers": "If $500$ users each connect to $20$ items, the graph has $10000$ observed edges."
      },
      {
        "title": "Social networks",
        "background": "Social platforms need graph methods to reason about friendships, follows, and communities.",
        "numbers": "A user with $35$ neighbors contributes degree $35$ and receives $35$ one-hop signals."
      },
      {
        "title": "Molecular graphs",
        "background": "Chemistry represents atoms and bonds as graphs, so spectral graph theory can become a model feature.",
        "numbers": "A carbon atom bonded to $4$ atoms has degree $4$ in the molecular graph."
      },
      {
        "title": "Infrastructure routing",
        "background": "Networks of services, roads, or machines are graphs where local constraints become global behavior.",
        "numbers": "A service dependency graph with $12$ services and $18$ calls has density $18/\\binom{12}{2}=18/66\\approx0.27$ if undirected."
      },
      {
        "title": "ML preprocessing",
        "background": "Many ML pipelines build graph features before training a downstream model.",
        "numbers": "A node feature vector of length $16$ for $1000$ nodes gives a $1000\\times16$ feature matrix."
      }
    ],
    "applicationsClose": "Spectral graph theory is one more reminder that graph ideas become powerful when a local rule is turned into a reliable computation.",
    "takeaways": [
      "Spectral graph theory has a precise definition that should be checked before using it.",
      "Small graphs are enough to test the arithmetic and the assumptions.",
      "The same structure scales to networks, matrices, and ML pipelines.",
      "Always separate the graph property from a particular drawing or implementation."
    ]
  },
  "math-15-25": {
    "id": "math-15-25",
    "title": "Random graphs",
    "tagline": "Random graphs make edges probabilistic so typical network structure can be calculated.",
    "connections": {
      "buildsOn": [
        "probability",
        "graphs and their representations",
        "expectation"
      ],
      "leadsTo": [
        "Spectral clustering",
        "network science",
        "probabilistic methods"
      ],
      "usedWith": [
        "matrices",
        "eigenvectors",
        "degree",
        "linear algebra"
      ]
    },
    "motivation": "<p>You already know the graph picture: dots connected by lines. Probability gives a clean laboratory for asking what a typical network looks like.</p><p><b>Random graphs</b> gives that intuition a precise form, so a small graph can teach the same rule used by large networks.</p>",
    "definition": "<p>In the Erdos-Renyi model $G(n,p)$, each possible undirected edge among $n$ vertices appears independently with probability $p$. Expected edges are $p\\binom n2$, and expected degree is $(n-1)p$.</p><p>The useful habit is to connect the definition to a checkable number or construction. Small examples reveal whether the condition is about vertices, edges, faces, matrices, probabilities, or learned messages.</p><p><b>Assumptions that matter:</b> we use simple undirected graphs unless stated otherwise; vertex labels fix the order of any matrix; and the stated theorem applies only when its hypotheses, such as connectedness or planarity, are satisfied.</p>",
    "worked": {
      "problem": "In $G(6,0.4)$, find expected edges and expected degree.",
      "skills": [
        "random graphs",
        "graph reasoning",
        "numerical checking"
      ],
      "strategy": "Count possible edges and multiply by probability.",
      "steps": [
        {
          "do": "Identify the relevant graph data",
          "result": "vertices, edges, degrees, or matrix entries",
          "why": "the definition tells us what to inspect"
        },
        {
          "do": "Apply the key rule",
          "result": "$\\binom62=15$, so expected edges are $6$ and expected degree is $5\\cdot0.4=2$",
          "why": "use the lesson's central criterion"
        },
        {
          "do": "Check the arithmetic",
          "result": "the stated numbers are consistent",
          "why": "graph counts should balance known identities"
        },
        {
          "do": "Interpret the result",
          "result": "Random graphs replace exact structure with re-derivable averages.",
          "why": "translate the computation back to the graph"
        },
        {
          "do": "State the conclusion",
          "result": "the required property or value has been found",
          "why": "the final answer follows from the checked rule"
        }
      ],
      "verify": "The conclusion matches the defining condition for random graphs.",
      "answer": "$\\binom62=15$, so expected edges are $6$ and expected degree is $5\\cdot0.4=2$.",
      "connects": "Random graphs replace exact structure with re-derivable averages."
    },
    "practice": [
      {
        "problem": "Basic check for Random graphs: a graph has $V=4$ and $E=3$. Compute the average degree.",
        "steps": [
          {
            "do": "Use the average-degree formula",
            "result": "$2E/V$",
            "why": "each edge contributes two degree counts"
          },
          {
            "do": "Substitute values",
            "result": "$2\\cdot3/4$",
            "why": "use $E=3$ and $V=4$"
          },
          {
            "do": "Multiply numerator",
            "result": "$6/4$",
            "why": "compute $2E$"
          },
          {
            "do": "Divide",
            "result": "$1.5$",
            "why": "average degree may be non-integer"
          },
          {
            "do": "Interpret",
            "result": "typical vertex has degree $1.5$",
            "why": "an average summarizes the graph"
          }
        ],
        "answer": "The average degree is $1.5$."
      },
      {
        "problem": "Use a four-cycle while thinking about Random graphs. Count vertices, edges, and degrees.",
        "steps": [
          {
            "do": "List vertices",
            "result": "$4$",
            "why": "a four-cycle has four corners"
          },
          {
            "do": "List edges",
            "result": "$4$",
            "why": "one edge per side"
          },
          {
            "do": "Find each degree",
            "result": "$2$",
            "why": "each vertex has two cycle neighbors"
          },
          {
            "do": "Sum degrees",
            "result": "$8$",
            "why": "four vertices times degree two"
          },
          {
            "do": "Check handshake",
            "result": "$2E=8$",
            "why": "the count matches"
          }
        ],
        "answer": "$V=4$, $E=4$, and every degree is $2$."
      },
      {
        "problem": "For a path on five vertices, relate Random graphs to endpoint behavior.",
        "steps": [
          {
            "do": "Count vertices",
            "result": "$5$",
            "why": "given path size"
          },
          {
            "do": "Count edges",
            "result": "$4$",
            "why": "a path has $V-1$ edges"
          },
          {
            "do": "Find endpoint degrees",
            "result": "$1$ and $1$",
            "why": "the two ends have one neighbor"
          },
          {
            "do": "Find internal degrees",
            "result": "$2,2,2$",
            "why": "three internal vertices have two neighbors"
          },
          {
            "do": "Check degree sum",
            "result": "$1+1+2+2+2=8=2E$",
            "why": "handshake lemma holds"
          }
        ],
        "answer": "The path has two degree-$1$ endpoints and three degree-$2$ internal vertices."
      },
      {
        "problem": "A graph has two components, one triangle and one single edge. Compute total $V$ and $E$ for use in Random graphs.",
        "steps": [
          {
            "do": "Count triangle vertices",
            "result": "$3$",
            "why": "three-cycle"
          },
          {
            "do": "Count triangle edges",
            "result": "$3$",
            "why": "one edge per side"
          },
          {
            "do": "Count single-edge vertices",
            "result": "$2$",
            "why": "two endpoints"
          },
          {
            "do": "Count single-edge edges",
            "result": "$1$",
            "why": "one edge"
          },
          {
            "do": "Add totals",
            "result": "$V=5$, $E=4$",
            "why": "combine components"
          }
        ],
        "answer": "The graph has $V=5$ and $E=4$."
      },
      {
        "problem": "ML-style use of Random graphs: a node has neighbor feature values $1,4,7$. Compute sum and mean aggregates.",
        "steps": [
          {
            "do": "Sum neighbor features",
            "result": "$1+4+7=12$",
            "why": "sum aggregation adds messages"
          },
          {
            "do": "Count neighbors",
            "result": "$3$",
            "why": "there are three values"
          },
          {
            "do": "Compute mean",
            "result": "$12/3=4$",
            "why": "mean normalizes by degree"
          },
          {
            "do": "Compare sum and mean",
            "result": "$12$ versus $4$",
            "why": "normalization changes scale"
          },
          {
            "do": "Interpret",
            "result": "sum depends on degree while mean controls for degree",
            "why": "this matters in graph ML"
          }
        ],
        "answer": "The sum aggregate is $12$ and the mean aggregate is $4$."
      }
    ],
    "applications": [
      {
        "title": "Small network sanity checks",
        "background": "Engineers often test random graphs on tiny graphs before trusting code on large ones.",
        "numbers": "A graph with $6$ vertices and $7$ edges has average degree $2E/V=14/6\\approx2.33$."
      },
      {
        "title": "Recommendation graphs",
        "background": "Recommender systems use random graphs ideas because user-item data is naturally relational.",
        "numbers": "If $500$ users each connect to $20$ items, the graph has $10000$ observed edges."
      },
      {
        "title": "Social networks",
        "background": "Social platforms need graph methods to reason about friendships, follows, and communities.",
        "numbers": "A user with $35$ neighbors contributes degree $35$ and receives $35$ one-hop signals."
      },
      {
        "title": "Molecular graphs",
        "background": "Chemistry represents atoms and bonds as graphs, so random graphs can become a model feature.",
        "numbers": "A carbon atom bonded to $4$ atoms has degree $4$ in the molecular graph."
      },
      {
        "title": "Infrastructure routing",
        "background": "Networks of services, roads, or machines are graphs where local constraints become global behavior.",
        "numbers": "A service dependency graph with $12$ services and $18$ calls has density $18/\\binom{12}{2}=18/66\\approx0.27$ if undirected."
      },
      {
        "title": "ML preprocessing",
        "background": "Many ML pipelines build graph features before training a downstream model.",
        "numbers": "A node feature vector of length $16$ for $1000$ nodes gives a $1000\\times16$ feature matrix."
      }
    ],
    "applicationsClose": "Random graphs is one more reminder that graph ideas become powerful when a local rule is turned into a reliable computation.",
    "takeaways": [
      "Random graphs has a precise definition that should be checked before using it.",
      "Small graphs are enough to test the arithmetic and the assumptions.",
      "The same structure scales to networks, matrices, and ML pipelines.",
      "Always separate the graph property from a particular drawing or implementation."
    ]
  },
  "math-15-26": {
    "id": "math-15-26",
    "title": "Spectral clustering",
    "tagline": "Spectral clustering uses Laplacian eigenvectors to turn graph connectivity into cluster coordinates.",
    "connections": {
      "buildsOn": [
        "Spectral graph theory",
        "The graph Laplacian",
        "clustering"
      ],
      "leadsTo": [
        "Graph neural networks & message passing",
        "community detection",
        "manifold learning"
      ],
      "usedWith": [
        "matrices",
        "eigenvectors",
        "degree",
        "linear algebra"
      ]
    },
    "motivation": "<p>You already know the graph picture: dots connected by lines. Some clusters are curved or network-shaped; connectivity can matter more than raw distance.</p><p><b>Spectral clustering</b> gives that intuition a precise form, so a small graph can teach the same rule used by large networks.</p>",
    "definition": "<p>Spectral clustering builds a similarity graph, forms a Laplacian such as $L=D-W$, computes a few small-eigenvalue eigenvectors, and clusters rows of that spectral embedding. Low-energy vectors change slowly across strong edges and can jump across weak cuts.</p><p>The useful habit is to connect the definition to a checkable number or construction. Small examples reveal whether the condition is about vertices, edges, faces, matrices, probabilities, or learned messages.</p><p><b>Assumptions that matter:</b> we use simple undirected graphs unless stated otherwise; vertex labels fix the order of any matrix; and the stated theorem applies only when its hypotheses, such as connectedness or planarity, are satisfied.</p>",
    "worked": {
      "problem": "Fiedler values are $[-0.8,-0.7,0.6,0.9]$. Split into two clusters by sign.",
      "skills": [
        "spectral clustering",
        "graph reasoning",
        "numerical checking"
      ],
      "strategy": "Group negative and positive entries.",
      "steps": [
        {
          "do": "Identify the relevant graph data",
          "result": "vertices, edges, degrees, or matrix entries",
          "why": "the definition tells us what to inspect"
        },
        {
          "do": "Apply the key rule",
          "result": "$\\{1,2\\}$ are negative and $\\{3,4\\}$ are positive",
          "why": "use the lesson's central criterion"
        },
        {
          "do": "Check the arithmetic",
          "result": "the stated numbers are consistent",
          "why": "graph counts should balance known identities"
        },
        {
          "do": "Interpret the result",
          "result": "Spectral clustering turns graph cuts into coordinates.",
          "why": "translate the computation back to the graph"
        },
        {
          "do": "State the conclusion",
          "result": "the required property or value has been found",
          "why": "the final answer follows from the checked rule"
        }
      ],
      "verify": "The conclusion matches the defining condition for spectral clustering.",
      "answer": "$\\{1,2\\}$ are negative and $\\{3,4\\}$ are positive.",
      "connects": "Spectral clustering turns graph cuts into coordinates."
    },
    "practice": [
      {
        "problem": "A graph has two disconnected components $\\{1,2\\}$ and $\\{3,4,5\\}$. How many zero Laplacian eigenvalues should spectral clustering see?",
        "steps": [
          {
            "do": "Count connected components",
            "result": "two",
            "why": "there are two disconnected pieces"
          },
          {
            "do": "Use the Laplacian theorem",
            "result": "zero eigenvalue multiplicity equals component count",
            "why": "for undirected graphs"
          },
          {
            "do": "State the multiplicity",
            "result": "two zero eigenvalues",
            "why": "one per component"
          },
          {
            "do": "Interpret for clustering",
            "result": "two exact clusters",
            "why": "no edge crosses the cut"
          },
          {
            "do": "Name the clusters",
            "result": "$\\{1,2\\}$ and $\\{3,4,5\\}$",
            "why": "components are recovered exactly"
          }
        ],
        "answer": "There should be two zero eigenvalues, and the exact clusters are the two components."
      },
      {
        "problem": "Fiedler vector values are $[-0.6,-0.4,0.2,0.8]$. Split by sign.",
        "steps": [
          {
            "do": "List negative entries",
            "result": "vertices $1$ and $2$",
            "why": "negative Fiedler values go to one side"
          },
          {
            "do": "List positive entries",
            "result": "vertices $3$ and $4$",
            "why": "positive values go to the other side"
          },
          {
            "do": "Apply the sign cut",
            "result": "$\\{1,2\\}$ and $\\{3,4\\}$",
            "why": "two-way spectral clustering often uses this rule"
          },
          {
            "do": "Check separation",
            "result": "the gap crosses $0$",
            "why": "the signs are unambiguous"
          },
          {
            "do": "State clusters",
            "result": "two groups",
            "why": "the embedding is one-dimensional"
          }
        ],
        "answer": "The sign split gives clusters $\\{1,2\\}$ and $\\{3,4\\}$."
      },
      {
        "problem": "Distances from a point are $0.2$ and $1.5$. With weight $w=e^{-d^2}$, compare weights using $e^{-0.04}\\approx0.961$ and $e^{-2.25}\\approx0.105$.",
        "steps": [
          {
            "do": "Square the near distance",
            "result": "$0.2^2=0.04$",
            "why": "Gaussian weights use squared distance"
          },
          {
            "do": "Compute near weight",
            "result": "$e^{-0.04}\\approx0.961$",
            "why": "use the given value"
          },
          {
            "do": "Square the far distance",
            "result": "$1.5^2=2.25$",
            "why": "larger distance"
          },
          {
            "do": "Compute far weight",
            "result": "$e^{-2.25}\\approx0.105$",
            "why": "use the given value"
          },
          {
            "do": "Compare",
            "result": "$0.961>0.105$",
            "why": "near points get much stronger graph edges"
          }
        ],
        "answer": "The near edge weight is about $0.961$, much larger than $0.105$."
      },
      {
        "problem": "Spectral coordinates are $(0,0),(0.1,0),(5,5),(5.2,5.1)$. Cluster into two groups.",
        "steps": [
          {
            "do": "Inspect the first pair",
            "result": "points $1$ and $2$ are near $(0,0)$",
            "why": "their distance is small"
          },
          {
            "do": "Inspect the second pair",
            "result": "points $3$ and $4$ are near $(5,5)$",
            "why": "their distance is small"
          },
          {
            "do": "Compare cross distances",
            "result": "about $7$",
            "why": "cross-cluster distances are much larger"
          },
          {
            "do": "Assign clusters",
            "result": "$\\{1,2\\}$ and $\\{3,4\\}$",
            "why": "ordinary clustering works in spectral space"
          },
          {
            "do": "Interpret",
            "result": "the embedding exposed the cut",
            "why": "graph structure became geometric"
          }
        ],
        "answer": "The two clusters are $\\{1,2\\}$ and $\\{3,4\\}$."
      },
      {
        "problem": "On two moons, spectral clustering scores ARI $0.88$ and k-means scores $0.22$. How much higher is spectral clustering?",
        "steps": [
          {
            "do": "Write the scores",
            "result": "$0.88$ and $0.22$",
            "why": "given adjusted Rand indices"
          },
          {
            "do": "Subtract",
            "result": "$0.88-0.22$",
            "why": "difference in performance"
          },
          {
            "do": "Compute",
            "result": "$0.66$",
            "why": "arithmetic"
          },
          {
            "do": "Interpret",
            "result": "spectral is much better",
            "why": "it follows graph connectivity"
          },
          {
            "do": "State result",
            "result": "higher by $0.66$",
            "why": "ARI ranges roughly from chance near $0$ to perfect at $1$"
          }
        ],
        "answer": "Spectral clustering is higher by $0.66$ ARI."
      }
    ],
    "applications": [
      {
        "title": "Small network sanity checks",
        "background": "Engineers often test spectral clustering on tiny graphs before trusting code on large ones.",
        "numbers": "A graph with $6$ vertices and $7$ edges has average degree $2E/V=14/6\\approx2.33$."
      },
      {
        "title": "Recommendation graphs",
        "background": "Recommender systems use spectral clustering ideas because user-item data is naturally relational.",
        "numbers": "If $500$ users each connect to $20$ items, the graph has $10000$ observed edges."
      },
      {
        "title": "Social networks",
        "background": "Social platforms need graph methods to reason about friendships, follows, and communities.",
        "numbers": "A user with $35$ neighbors contributes degree $35$ and receives $35$ one-hop signals."
      },
      {
        "title": "Molecular graphs",
        "background": "Chemistry represents atoms and bonds as graphs, so spectral clustering can become a model feature.",
        "numbers": "A carbon atom bonded to $4$ atoms has degree $4$ in the molecular graph."
      },
      {
        "title": "Infrastructure routing",
        "background": "Networks of services, roads, or machines are graphs where local constraints become global behavior.",
        "numbers": "A service dependency graph with $12$ services and $18$ calls has density $18/\\binom{12}{2}=18/66\\approx0.27$ if undirected."
      },
      {
        "title": "ML preprocessing",
        "background": "Many ML pipelines build graph features before training a downstream model.",
        "numbers": "A node feature vector of length $16$ for $1000$ nodes gives a $1000\\times16$ feature matrix."
      }
    ],
    "applicationsClose": "Spectral clustering is one more reminder that graph ideas become powerful when a local rule is turned into a reliable computation.",
    "takeaways": [
      "Spectral clustering has a precise definition that should be checked before using it.",
      "Small graphs are enough to test the arithmetic and the assumptions.",
      "The same structure scales to networks, matrices, and ML pipelines.",
      "Always separate the graph property from a particular drawing or implementation."
    ]
  },
  "math-15-27": {
    "id": "math-15-27",
    "title": "Graph neural networks & message passing",
    "tagline": "Graph neural networks update each node by combining its features with messages from neighbors.",
    "connections": {
      "buildsOn": [
        "Spectral clustering",
        "The adjacency matrix",
        "vectors and matrices"
      ],
      "leadsTo": [
        "geometric deep learning",
        "recommendation models",
        "node classification"
      ],
      "usedWith": [
        "matrices",
        "eigenvectors",
        "degree",
        "linear algebra"
      ]
    },
    "motivation": "<p>You already know the graph picture: dots connected by lines. Many ML examples are not isolated rows: papers cite papers, molecules have bonds, and users connect to items.</p><p><b>Graph neural networks & message passing</b> gives that intuition a precise form, so a small graph can teach the same rule used by large networks.</p>",
    "definition": "<p>A basic <b>message passing</b> layer updates node $v$ by aggregating neighbor features: $h_v^{(t+1)}=\\sigma(W_{self}h_v^{(t)}+W_{nbr}\\sum_{u\\in N(v)}h_u^{(t)})$. Aggregation should be permutation-invariant, and after $k$ layers information can travel about $k$ hops.</p><p>The useful habit is to connect the definition to a checkable number or construction. Small examples reveal whether the condition is about vertices, edges, faces, matrices, probabilities, or learned messages.</p><p><b>Assumptions that matter:</b> we use simple undirected graphs unless stated otherwise; vertex labels fix the order of any matrix; and the stated theorem applies only when its hypotheses, such as connectedness or planarity, are satisfied.</p>",
    "worked": {
      "problem": "A scalar layer uses $h_v^{new}=0.5h_v+0.25\\sum_{u\\in N(v)}h_u$. If $h_v=4$ and neighbors are $2,6,8$, compute the update.",
      "skills": [
        "message passing",
        "graph reasoning",
        "numerical checking"
      ],
      "strategy": "Sum neighbor messages, weight self and neighbors, then add.",
      "steps": [
        {
          "do": "Identify the relevant graph data",
          "result": "vertices, edges, degrees, or matrix entries",
          "why": "the definition tells us what to inspect"
        },
        {
          "do": "Apply the key rule",
          "result": "$2+6+8=16$, so $0.5\\cdot4+0.25\\cdot16=6$",
          "why": "use the lesson's central criterion"
        },
        {
          "do": "Check the arithmetic",
          "result": "the stated numbers are consistent",
          "why": "graph counts should balance known identities"
        },
        {
          "do": "Interpret the result",
          "result": "Message passing is local aggregation plus learned transformation.",
          "why": "translate the computation back to the graph"
        },
        {
          "do": "State the conclusion",
          "result": "the required property or value has been found",
          "why": "the final answer follows from the checked rule"
        }
      ],
      "verify": "The conclusion matches the defining condition for graph neural networks & message passing.",
      "answer": "$2+6+8=16$, so $0.5\\cdot4+0.25\\cdot16=6$.",
      "connects": "Message passing is local aggregation plus learned transformation."
    },
    "practice": [
      {
        "problem": "Use mean aggregation for neighbor scalar features $3,5,10$ in a GNN layer.",
        "steps": [
          {
            "do": "Sum the neighbor features",
            "result": "$3+5+10=18$",
            "why": "mean aggregation starts with a sum"
          },
          {
            "do": "Count neighbors",
            "result": "$3$",
            "why": "the node has degree three"
          },
          {
            "do": "Divide by degree",
            "result": "$18/3=6$",
            "why": "mean normalizes the sum"
          },
          {
            "do": "Check permutation invariance",
            "result": "any order gives $6$",
            "why": "neighbor order should not matter"
          },
          {
            "do": "State the message",
            "result": "$6$",
            "why": "this is the aggregated neighbor message"
          }
        ],
        "answer": "The mean neighbor message is $6$."
      },
      {
        "problem": "A node has self value $2$ and mean neighbor value $6$. Compute $0.4h_v+0.6m_v$.",
        "steps": [
          {
            "do": "Compute self contribution",
            "result": "$0.4\\cdot2=0.8$",
            "why": "apply the self weight"
          },
          {
            "do": "Compute neighbor contribution",
            "result": "$0.6\\cdot6=3.6$",
            "why": "apply the neighbor weight"
          },
          {
            "do": "Add contributions",
            "result": "$0.8+3.6=4.4$",
            "why": "combine self and neighbor information"
          },
          {
            "do": "No activation is specified",
            "result": "the value remains $4.4$",
            "why": "nothing clips or bends it"
          },
          {
            "do": "Interpret",
            "result": "neighbors pull the node upward",
            "why": "the neighbor mean is larger than the self value"
          }
        ],
        "answer": "The updated scalar feature is $4.4$."
      },
      {
        "problem": "After two standard message-passing layers, how far can information from another node travel?",
        "steps": [
          {
            "do": "Analyze one layer",
            "result": "one edge",
            "why": "a node receives messages from one-hop neighbors"
          },
          {
            "do": "Analyze the second layer",
            "result": "one more edge",
            "why": "neighbors now carry information from their neighbors"
          },
          {
            "do": "Combine hops",
            "result": "two hops",
            "why": "information crosses at most two edges"
          },
          {
            "do": "Exclude farther nodes",
            "result": "three-hop nodes need a third layer",
            "why": "one layer adds one hop of reach"
          },
          {
            "do": "State the receptive field",
            "result": "the two-hop neighborhood",
            "why": "for ordinary local message passing"
          }
        ],
        "answer": "After two layers, information can travel at most two hops."
      },
      {
        "problem": "A node of degree $4$ has neighbor risk scores $0.1,0.9,0.8,0.2$. Compute the mean message.",
        "steps": [
          {
            "do": "Sum scores",
            "result": "$0.1+0.9+0.8+0.2=2.0$",
            "why": "add all neighbor messages"
          },
          {
            "do": "Count neighbors",
            "result": "$4$",
            "why": "degree is four"
          },
          {
            "do": "Normalize",
            "result": "$2.0/4=0.5$",
            "why": "mean aggregation divides by degree"
          },
          {
            "do": "Interpret risk",
            "result": "average neighbor risk is $0.5$",
            "why": "neighbors are mixed"
          },
          {
            "do": "State message",
            "result": "$0.5$",
            "why": "the scalar message passed forward"
          }
        ],
        "answer": "The mean neighbor risk message is $0.5$."
      },
      {
        "problem": "A citation GNN uses $h_p^{new}=h_p+0.5\\operatorname{mean}(N(p))$. If $h_p=10$ and neighbor features are $4$ and $8$, compute the update.",
        "steps": [
          {
            "do": "Average neighbors",
            "result": "$(4+8)/2=6$",
            "why": "mean neighbor feature"
          },
          {
            "do": "Scale the message",
            "result": "$0.5\\cdot6=3$",
            "why": "apply the layer weight"
          },
          {
            "do": "Add the self value",
            "result": "$10+3=13$",
            "why": "residual update"
          },
          {
            "do": "State updated feature",
            "result": "$13$",
            "why": "new paper representation"
          },
          {
            "do": "Interpret",
            "result": "citation context increased the feature",
            "why": "neighbors contributed positive evidence"
          }
        ],
        "answer": "The updated feature is $13$."
      }
    ],
    "applications": [
      {
        "title": "Node classification",
        "background": "GNNs classify nodes by combining their own features with neighborhood context.",
        "numbers": "If a paper has $5$ cited neighbors and $4$ are AI papers, a simple neighbor label fraction is $4/5=0.8$."
      },
      {
        "title": "Molecular property prediction",
        "background": "Atoms are nodes and bonds are edges, so message passing follows chemical bonds.",
        "numbers": "A carbon atom bonded to $4$ atoms receives $4$ incoming messages in one layer."
      },
      {
        "title": "Recommendation graphs",
        "background": "Users and items form bipartite graphs where messages pass between preferences and content.",
        "numbers": "If a user connects to $12$ items, mean aggregation averages $12$ item embeddings."
      },
      {
        "title": "Fraud detection",
        "background": "Risk can be estimated from transaction or device-sharing neighborhoods.",
        "numbers": "Neighbor risk scores $0.1,0.9,0.8$ have mean $0.6$."
      },
      {
        "title": "Knowledge graphs",
        "background": "Entities exchange typed messages along relation edges for completion tasks.",
        "numbers": "An entity with $7$ outgoing relation edges sends or receives $7$ typed messages."
      },
      {
        "title": "Oversmoothing",
        "background": "Too many averaging layers can make connected node embeddings too similar.",
        "numbers": "On a single edge with values $0$ and $1$, full averaging sends both endpoints to $0.5$."
      }
    ],
    "applicationsClose": "Graph neural networks & message passing is one more reminder that graph ideas become powerful when a local rule is turned into a reliable computation.",
    "takeaways": [
      "Graph neural networks & message passing has a precise definition that should be checked before using it.",
      "Small graphs are enough to test the arithmetic and the assumptions.",
      "The same structure scales to networks, matrices, and ML pipelines.",
      "Always separate the graph property from a particular drawing or implementation."
    ]
  }
};
