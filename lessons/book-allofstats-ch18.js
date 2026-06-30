/* All of Statistics (Larry Wasserman) — Chapter 18: Undirected Graphs.
   Self-registering book-template lessons, one per key concept. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "All of Statistics" }, o));

  // 1 — Undirected graphs: vocabulary
  B({
    id: "aos-ch18-undirected-graphs",
    chapter: "Chapter 18",
    title: "Undirected Graphs",
    tagline: "An undirected graph is a set of vertices joined by unordered edges; this lesson fixes the vocabulary used to read the graph.",
    sections: [
      { h: "Why undirected graphs", body:
        "<p>The previous chapter used directed graphs to encode independence relations among random variables. This chapter introduces <strong>undirected graphs</strong> as an alternative. Both kinds are used in practice, so it helps to know both. The book stresses that the main difference is not the picture but the <em>rules</em>: the way you read independence relations off the graph is different for the two kinds.</p>" },
      { h: "Vertices and edges", body:
        "<p>An <strong>undirected graph</strong> $\\mathcal{G} = (V,E)$ has a finite set $V$ of <strong>vertices</strong> (also called nodes) and a set $E$ of <strong>edges</strong> (also called arcs). Each edge is a <em>pair</em> of vertices. The vertices stand for random variables $X, Y, Z, \\dots$ One edge is written as an <em>unordered</em> pair: writing $(X,Y) \\in E$ means $X$ and $Y$ are joined by an edge. Unordered means $(X,Y)$ and $(Y,X)$ describe the same edge — there is no direction.</p>" +
        "<p>The book's first picture (Figure 18.1) is the graph on $V = \\{X,Y,Z\\}$ with edge set $E = \\{(X,Y),(Y,Z)\\}$: $X$ joins $Y$, and $Y$ joins $Z$, but $X$ and $Z$ are not directly joined.</p>" +
        "<table class=\"extable\"><thead><tr><th>Figure 18.1 pair</th><th>edge present?</th><th>book notation</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">X, Y</td><td>yes</td><td>$X\\sim Y$</td></tr>" +
        "<tr><td class=\"row-h\">Y, Z</td><td>yes</td><td>$Y\\sim Z$</td></tr>" +
        "<tr><td class=\"row-h\">X, Z</td><td>no</td><td>$X\\not\\sim Z$</td></tr>" +
        "</tbody></table>" },
      { h: "Adjacent, path, complete, subgraph", body:
        "<p>Four more terms, all read off the picture:</p>" +
        "<ul class=\"steps\">" +
        "<li><strong>Adjacent</strong>, written $X \\sim Y$: there is an edge between $X$ and $Y$. In Figure 18.1, $X$ and $Y$ are adjacent, but $X$ and $Z$ are not.</li>" +
        "<li><strong>Path</strong>: a sequence of vertices $X_0, \\dots, X_n$ where each consecutive pair is adjacent, i.e. $X_{i-1} \\sim X_i$ for every $i$. In Figure 18.1 the sequence $X, Y, Z$ is a path.</li>" +
        "<li><strong>Complete</strong> graph: there is an edge between <em>every</em> pair of vertices.</li>" +
        "<li><strong>Subgraph</strong>: a subset $U \\subset V$ of the vertices together with their edges.</li>" +
        "</ul>" },
      { h: "Separation", body:
        "<p>The key structural idea for reading the graph is <strong>separation</strong>. Let $A$, $B$, $C$ be three distinct subsets of the vertices $V$. We say $C$ <strong>separates</strong> $A$ and $B$ if every path from a variable in $A$ to a variable in $B$ passes through (intersects) a variable in $C$. In other words, you cannot get from $A$'s side to $B$'s side without stepping on a vertex in $C$.</p>" +
        "<p>The book's example (Figure 18.2) is the graph on $\\{W,X,Y,Z\\}$ with edges making $X$ the hub: there $\\{Y,W\\}$ and $\\{Z\\}$ are separated by $\\{X\\}$, and $W$ and $Z$ are separated by $\\{X,Y\\}$. Separation is the device the next lessons turn into independence statements.</p>" +
        "<table class=\"extable\"><thead><tr><th>sets in Figure 18.2</th><th>separator</th><th>why every path is hit</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">$\\{Y,W\\}$ and $\\{Z\\}$</td><td>$\\{X\\}$</td><td>to reach $Z$, paths from $Y$ or $W$ must pass through $X$</td></tr>" +
        "<tr><td class=\"row-h\">$W$ and $Z$</td><td>$\\{X,Y\\}$</td><td>the listed separator blocks all routes from $W$ to $Z$</td></tr>" +
        "</tbody></table>" }
    ],
    takeaways: [
      "An undirected graph G = (V,E) has vertices (random variables) and unordered edges (pairs of vertices).",
      "X ~ Y (adjacent) means there is an edge; a path is a chain of adjacent vertices.",
      "Complete = an edge between every pair; a subgraph is a vertex subset with its edges.",
      "C separates A and B when every path from A to B must pass through C — the basis for reading independence."
    ]
  });
  window.CODEVIZ["aos-ch18-undirected-graphs"] = { charts: [ {
    type: "heatmap",
    title: "Figure 18.1 — undirected adjacency",
    interpret: "The symmetric ones encode the book's edge set {(X,Y),(Y,Z)}; the X-Z cells are zero because X and Z are not adjacent.",
    rows: ["X", "Y", "Z"],
    cols: ["X", "Y", "Z"],
    matrix: [[0,1,0],[1,0,1],[0,1,0]],
    showVals: true
  } ] };

  // 2 — Probability and graphs: the pairwise Markov graph
  B({
    id: "aos-ch18-pairwise-markov-graph",
    chapter: "Chapter 18",
    title: "The Pairwise Markov Graph",
    tagline: "Build the graph by erasing an edge between two variables exactly when they are independent given all the others.",
    sections: [
      { h: "The construction rule", body:
        "<p>Take a set $V$ of random variables with joint distribution $\\mathbb{P}$. Build a graph with one vertex per variable. The rule for whether to draw an edge is about <em>conditional independence given everything else</em>:</p>" +
        "<p>$\\text{no edge between } X \\text{ and } Y \\iff X \\amalg Y \\mid \\text{rest}.$</p>" +
        "<p>Here $X \\amalg Y \\mid \\text{rest}$ means $X$ and $Y$ are independent once we condition on all the other variables, and \"rest\" is every variable besides $X$ and $Y$. So you <em>omit</em> the edge between a pair precisely when that pair is conditionally independent given the rest; otherwise you draw it. The graph produced this way is called the <strong>pairwise Markov graph</strong>.</p>" },
      { h: "Reading a single edge", body:
        "<p>By construction, each <em>missing</em> edge is a pairwise conditional independence statement. Figure 18.3 is the graph $X - Y - Z$ (edges $X\\sim Y$ and $Y \\sim Z$, none between $X$ and $Z$). The missing $X$–$Z$ edge says exactly $X \\amalg Z \\mid Y$: $X$ and $Z$ are independent given $Y$.</p>" +
        "<p>By contrast, Figure 18.4 is the complete triangle on $\\{X,Y,Z\\}$ — every pair joined. With no missing edges, there are no implied independence relations at all.</p>" +
        "<table class=\"extable\"><thead><tr><th>figure</th><th>missing edge(s)</th><th>implied relation</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">18.3 chain $X-Y-Z$</td><td>$X-Z$</td><td>$X \\amalg Z\\mid Y$</td></tr>" +
        "<tr><td class=\"row-h\">18.4 complete triangle</td><td>none</td><td>no implied independence relations</td></tr>" +
        "</tbody></table>" },
      { h: "Implied relations come for free", body:
        "<p>The graph directly encodes a set of <em>pairwise</em> conditional independence relations (one per missing edge). But these pairwise relations imply other conditional independence relations too. The pleasant fact, developed in the next lesson, is that you can read those other relations straight off the same graph using separation — no algebra required.</p>" }
    ],
    takeaways: [
      "One vertex per variable; omit the edge between X and Y exactly when X is independent of Y given all the rest.",
      "The resulting graph is the pairwise Markov graph.",
      "Each missing edge is a pairwise conditional independence: e.g. missing X-Z edge means X is independent of Z given Y.",
      "A complete graph (no missing edges) implies no independence relations."
    ]
  });

  // 3 — The Markov properties: pairwise, global, and their equivalence
  B({
    id: "aos-ch18-markov-properties",
    chapter: "Chapter 18",
    title: "Pairwise and Global Markov Properties",
    tagline: "Separation in the graph implies conditional independence, and the easy-to-state pairwise property turns out to be equivalent to the powerful global one.",
    sections: [
      { h: "The separation theorem", body:
        "<p><strong>Theorem 18.1.</strong> Let $\\mathcal{G} = (V,E)$ be a pairwise Markov graph for a distribution $\\mathbb{P}$, and let $A$, $B$, $C$ be distinct subsets of $V$ such that $C$ separates $A$ and $B$. Then $A \\amalg B \\mid C$ — $A$ and $B$ are conditionally independent given $C$.</p>" +
        "<p>This is the payoff of the construction. You only have to <em>state</em> the simple pairwise rule (one missing edge at a time), but you can <em>read off</em> the much richer family of conditional independences just by checking which subsets separate which.</p>" +
        "<p><strong>Remark 18.2.</strong> If $A$ and $B$ are not connected at all (no path from $A$ to $B$), we may treat them as separated by the empty set; then Theorem 18.1 gives the unconditional independence $A \\amalg B$.</p>" },
      { h: "Naming the two properties", body:
        "<p>The condition in Theorem 18.1 — independence from separation — is called the <strong>global Markov property</strong>. The book makes the two properties precise as sets of distributions for a fixed graph $\\mathcal{G}$:</p>" +
        "<ul class=\"steps\">" +
        "<li>$M_{\\text{pair}}(\\mathcal{G})$: the distributions with the <strong>pairwise</strong> Markov property — under $\\mathbb{P}$, $X \\amalg Y \\mid \\text{rest}$ holds if and only if there is no edge between $X$ and $Y$.</li>" +
        "<li>$M_{\\text{global}}(\\mathcal{G})$: the distributions with the <strong>global</strong> Markov property — under $\\mathbb{P}$, $A \\amalg B \\mid C$ holds if and only if $C$ separates $A$ and $B$.</li>" +
        "</ul>" },
      { h: "They are the same", body:
        "<p><strong>Theorem 18.3.</strong> For any graph $\\mathcal{G}$, $M_{\\text{pair}}(\\mathcal{G}) = M_{\\text{global}}(\\mathcal{G})$. The two properties pick out exactly the same set of distributions, so we may speak simply of a distribution being Markov to $\\mathcal{G}$.</p>" +
        "<p>This equivalence is what makes undirected graphs useful: construct a graph using the easy pairwise property, then deduce all the other independence relations using the global property. The book remarks how hard the same deductions would be to carry out purely algebraically.</p>" },
      { h: "Worked examples on the same graphs", body:
        "<p>Apply separation to read independences directly:</p>" +
        "<ul class=\"steps\">" +
        "<li><strong>Figure 18.6</strong> — the chain $X - Y - Z - W$. Pairwise, the missing $X$–$Z$ edge gives $X \\amalg Z \\mid \\{Y,W\\}$. Using the global property, $\\{Y\\}$ separates $X$ from $Z$, so also $X \\amalg Z \\mid Y$, and likewise $Y \\amalg W \\mid Z$.</li>" +
        "<li><strong>Figure 18.5</strong> — the four-cycle (square) $X - W$, $W - Z$, $Z - Y$, $Y - X$. Here $X \\amalg Z \\mid \\{Y,W\\}$ and $Y \\amalg W \\mid \\{X,Z\\}$: each diagonal pair is separated by the other two corners.</li>" +
        "<li><strong>Example 18.4 (Figure 18.7)</strong> — vertices $\\{X,Y,Z\\}$ with the single edge $Y - Z$ and $X$ isolated. Then $X \\amalg Y$, $X \\amalg Z$, and $X \\amalg (Y,Z)$: the disconnected $X$ is separated from the rest by the empty set.</li>" +
        "<li><strong>Example 18.5 (Figure 18.8)</strong> — $X - Y$, plus the triangle $Y - Z$, $Y - W$, $Z - W$. Then $X \\amalg W \\mid (Y,Z)$ and $X \\amalg Z \\mid Y$.</li>" +
        "</ul>" +
        "<table class=\"extable\"><thead><tr><th>figure</th><th>separator</th><th>independence read globally</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">18.5 square</td><td>$\\{Y,W\\}$</td><td>$X \\amalg Z\\mid\\{Y,W\\}$</td></tr>" +
        "<tr><td class=\"row-h\">18.5 square</td><td>$\\{X,Z\\}$</td><td>$Y \\amalg W\\mid\\{X,Z\\}$</td></tr>" +
        "<tr><td class=\"row-h\">18.6 chain</td><td>$Y$</td><td>$X \\amalg Z\\mid Y$</td></tr>" +
        "<tr><td class=\"row-h\">18.6 chain</td><td>$Z$</td><td>$Y \\amalg W\\mid Z$</td></tr>" +
        "<tr><td class=\"row-h\">18.7 isolated $X$</td><td>empty set</td><td>$X \\amalg Y$, $X \\amalg Z$, $X \\amalg (Y,Z)$</td></tr>" +
        "<tr><td class=\"row-h\">18.8 triangle plus $X-Y$</td><td>$Y$</td><td>$X \\amalg Z\\mid Y$</td></tr>" +
        "<tr><td class=\"row-h\">18.8 triangle plus $X-Y$</td><td>$\\{Y,Z\\}$</td><td>$X \\amalg W\\mid(Y,Z)$</td></tr>" +
        "</tbody></table>" }
    ],
    takeaways: [
      "Theorem 18.1: if C separates A and B in the graph, then A is independent of B given C (global Markov property).",
      "Disconnected sets count as separated by the empty set, giving unconditional independence (Remark 18.2).",
      "M_pair(G) is defined by missing edges; M_global(G) is defined by separation.",
      "Theorem 18.3: the pairwise and global properties define the same set of distributions, so build with pairwise and deduce with global."
    ]
  });
  window.CODEVIZ["aos-ch18-markov-properties"] = { charts: [ {
    type: "heatmap",
    title: "Figure 18.6 — adjacency for the chain X-Y-Z-W",
    interpret: "The ones are exactly the undirected edges X-Y, Y-Z, and Z-W; the zero at X-Z is why pairwise Markov gives X independent of Z given {Y,W}.",
    rows: ["X", "Y", "Z", "W"],
    cols: ["X", "Y", "Z", "W"],
    matrix: [[0,1,0,0],[1,0,1,0],[0,1,0,1],[0,0,1,0]],
    showVals: true
  } ] };

  // 4 — Cliques and potentials: the factorization
  B({
    id: "aos-ch18-cliques-potentials",
    chapter: "Chapter 18",
    title: "Cliques and Potentials",
    tagline: "A Markov distribution factors into a product of positive functions, one per maximal clique, divided by a normalizing constant.",
    sections: [
      { h: "Cliques, maximal cliques, potentials", body:
        "<p>Three definitions set up the factorization:</p>" +
        "<ul class=\"steps\">" +
        "<li>A <strong>clique</strong> is a set of variables that are all adjacent to one another — every pair in the set is joined by an edge.</li>" +
        "<li>A <strong>maximal clique</strong> is a clique you cannot enlarge: adding any other variable would break the all-adjacent property.</li>" +
        "<li>A <strong>potential</strong> is any positive function (a function whose values are all greater than $0$).</li>" +
        "</ul>" },
      { h: "The clique decomposition", body:
        "<p>Under certain conditions, $\\mathbb{P}$ is Markov to $\\mathcal{G}$ if and only if its probability function $f$ factors over the maximal cliques (Equation 18.1):</p>" +
        "<p>$f(x) = \\dfrac{\\prod_{C \\in \\mathcal{C}} \\psi_C(x_C)}{Z},$</p>" +
        "<p>where $\\mathcal{C}$ is the set of maximal cliques, each $\\psi_C$ is a potential acting only on the variables $x_C$ in that clique, and the denominator</p>" +
        "<p>$Z = \\sum_x \\prod_{C \\in \\mathcal{C}} \\psi_C(x_C)$</p>" +
        "<p>is the normalizing constant that makes $f$ sum to $1$. Notice the potentials need not be probabilities themselves — only positive — and the independence structure of the graph is captured entirely by <em>which</em> variables share a clique.</p>" },
      { h: "Example — the three-vertex chain", body:
        "<p><strong>Example 18.6.</strong> For the graph in Figure 18.1 (edges $X\\sim Y$ and $Y\\sim Z$) the maximal cliques are $C_1 = \\{X,Y\\}$ and $C_2 = \\{Y,Z\\}$. Note $\\{X,Y,Z\\}$ is <em>not</em> a clique because $X$ and $Z$ are not adjacent. Hence if $\\mathbb{P}$ is Markov to the graph, its probability function factors as</p>" +
        "<p>$f(x,y,z) \\propto \\psi_1(x,y)\\,\\psi_2(y,z)$</p>" +
        "<p>for some positive functions $\\psi_1$ and $\\psi_2$. The shared variable $Y$ links the two factors, exactly matching the graph.</p>" },
      { h: "Example — a six-vertex graph", body:
        "<p><strong>Example 18.7 (Figure 18.9).</strong> A graph on $X_1,\\dots,X_6$ has maximal cliques $\\{X_1,X_2\\}$, $\\{X_1,X_3\\}$, $\\{X_2,X_4\\}$, $\\{X_3,X_5\\}$, and $\\{X_2,X_5,X_6\\}$. The last is a triple because those three variables are mutually adjacent. The probability function therefore factors as</p>" +
        "<p>$f(x_1,\\dots,x_6) \\propto \\psi_{12}(x_1,x_2)\\,\\psi_{13}(x_1,x_3)\\,\\psi_{24}(x_2,x_4)\\,\\psi_{35}(x_3,x_5)\\,\\psi_{256}(x_2,x_5,x_6).$</p>" +
        "<p>One potential per maximal clique, each depending only on its own clique's variables. The table lists the cliques and the variables each potential uses.</p>" +
        "<table class=\"extable\">" +
        "<thead><tr><th>Maximal clique</th><th class=\"num\">Size</th><th>Potential</th></tr></thead>" +
        "<tbody>" +
        "<tr><td class=\"row-h\">{X1, X2}</td><td class=\"num\">2</td><td>$\\psi_{12}(x_1,x_2)$</td></tr>" +
        "<tr><td class=\"row-h\">{X1, X3}</td><td class=\"num\">2</td><td>$\\psi_{13}(x_1,x_3)$</td></tr>" +
        "<tr><td class=\"row-h\">{X2, X4}</td><td class=\"num\">2</td><td>$\\psi_{24}(x_2,x_4)$</td></tr>" +
        "<tr><td class=\"row-h\">{X3, X5}</td><td class=\"num\">2</td><td>$\\psi_{35}(x_3,x_5)$</td></tr>" +
        "<tr><td class=\"row-h\">{X2, X5, X6}</td><td class=\"num\">3</td><td>$\\psi_{256}(x_2,x_5,x_6)$</td></tr>" +
        "</tbody></table>" +
        "<pre><code class=\"language-python\"># Examples 18.6 and 18.7: one factor per maximal clique\ncliques_181 = [('X','Y'), ('Y','Z')]\nprint('f(x,y,z) proportional to psi_1(x,y) * psi_2(y,z)')\n\ncliques_189 = [('X1','X2'), ('X1','X3'), ('X2','X4'),\n               ('X3','X5'), ('X2','X5','X6')]\nfactor = ' * '.join('psi_' + ''.join(c).replace('X','') for c in cliques_189)\nprint(factor)\n# psi_12 * psi_13 * psi_24 * psi_35 * psi_256</code></pre>" }
    ],
    takeaways: [
      "A clique is an all-adjacent set; a maximal clique cannot be enlarged; a potential is any positive function.",
      "P is Markov to G iff f(x) = (product over maximal cliques of psi_C(x_C)) / Z, with Z the normalizing sum.",
      "Potentials need not be probabilities — only positive; the graph's structure lives in which variables share a clique.",
      "Three-vertex chain: cliques {X,Y},{Y,Z} give f proportional to psi_1(x,y)psi_2(y,z)."
    ]
  });
  window.CODEVIZ["aos-ch18-cliques-potentials"] = { charts: [ {
    type: "heatmap",
    title: "Figure 18.9 — adjacency implied by the maximal cliques",
    interpret: "The triple clique {X2,X5,X6} appears as a fully connected 3-by-3 block, while the other maximal cliques are single edges.",
    rows: ["X1", "X2", "X3", "X4", "X5", "X6"],
    cols: ["X1", "X2", "X3", "X4", "X5", "X6"],
    matrix: [[0,1,1,0,0,0],[1,0,0,1,1,1],[1,0,0,0,1,0],[0,1,0,0,0,0],[0,1,1,0,0,1],[0,1,0,0,1,0]],
    showVals: true
  } ] };

  // 5 — Fitting graphs to data
  B({
    id: "aos-ch18-fitting-graphs-to-data",
    chapter: "Chapter 18",
    title: "Fitting Graphs to Data",
    tagline: "Finding the graph that fits a data set is a big topic; in the discrete case the log-linear model is the standard route.",
    sections: [
      { h: "The question", body:
        "<p>So far the graph has been given. The practical question is the reverse: given a data set, how do we <em>find</em> a graphical model that fits it? As with directed graphs, the book flags this as a large topic that it does not treat in full here.</p>" },
      { h: "The discrete case: log-linear models", body:
        "<p>The book does point to one concrete approach for the <strong>discrete</strong> case — when the variables take finitely many values. There, a standard way to fit a graph to data is to use a <strong>log-linear model</strong>. A log-linear model parameterizes the probability function so that its logarithm is a sum of terms; choosing which terms to include corresponds to choosing which clique potentials are present, and hence which edges the graph has. Wasserman notes this is the subject of the next chapter, where the fitting is developed in detail.</p>" },
      { h: "Book data table — breast cancer exercise", body:
        "<p>The chapter closes with a discrete three-way table from Morrison et al. (1973), using diagnostic center $X_1$, nuclear grade $X_2$, and survival $X_3$. The book asks the reader to treat it as multinomial data and test conditional-independence graphs.</p>" +
        "<table class=\"extable\"><thead><tr><th>diagnostic center</th><th>nuclear grade</th><th>survival</th><th class=\"num\">count</th></tr></thead><tbody>" +
        "<tr><td class=\"row-h\">Boston</td><td>malignant</td><td>died</td><td class=\"num\">35</td></tr>" +
        "<tr><td class=\"row-h\">Glamorgan</td><td>malignant</td><td>died</td><td class=\"num\">42</td></tr>" +
        "<tr><td class=\"row-h\">Boston</td><td>malignant</td><td>survived</td><td class=\"num\">59</td></tr>" +
        "<tr><td class=\"row-h\">Glamorgan</td><td>malignant</td><td>survived</td><td class=\"num\">77</td></tr>" +
        "<tr><td class=\"row-h\">Boston</td><td>benign</td><td>died</td><td class=\"num\">47</td></tr>" +
        "<tr><td class=\"row-h\">Glamorgan</td><td>benign</td><td>died</td><td class=\"num\">26</td></tr>" +
        "<tr><td class=\"row-h\">Boston</td><td>benign</td><td>survived</td><td class=\"num\">112</td></tr>" +
        "<tr><td class=\"row-h\">Glamorgan</td><td>benign</td><td>survived</td><td class=\"num\">76</td></tr>" +
        "</tbody></table>" +
        "<ul class=\"steps\">" +
        "<li>The multinomial MLE for a cell is its count divided by the total count, and the total here is $35+42+59+77+47+26+112+76=474$.</li>" +
        "<li>For a benign tumor at Glamorgan, the estimated death probability is $26/(26+76)=26/102=0.2549$.</li>" +
        "<li>A binomial standard-error calculation for that conditional proportion is $\\sqrt{0.2549(1-0.2549)/102}=0.0432$.</li>" +
        "</ul>" +
        "<pre><code class=\"language-python\"># Exercise 18.5 table calculation\ncounts = [35, 42, 59, 77, 47, 26, 112, 76]\ntotal = sum(counts)\nmle = [c / total for c in counts]\nprint(total)                 # 474\nprint(round(mle[0], 4))      # 35/474 = 0.0738\n\np = 26 / (26 + 76)\nse = (p * (1 - p) / (26 + 76)) ** 0.5\nprint(round(p, 4), round(se, 4))  # 0.2549, 0.0432</code></pre>" },
      { h: "Where to read more", body:
        "<p>For thorough treatments of undirected graphs the book's bibliographic remarks point to Whittaker (1990) and Lauritzen (1996); several of the chapter's exercises are drawn from Whittaker (1990).</p>" }
    ],
    takeaways: [
      "Fitting a graph to data — choosing the model from data rather than assuming it — is a large topic the chapter only gestures at.",
      "In the discrete case, the standard route is the log-linear model, covered in the next chapter.",
      "Choosing log-linear terms corresponds to choosing clique potentials, hence edges.",
      "Thorough references: Whittaker (1990) and Lauritzen (1996)."
    ]
  });
})();
