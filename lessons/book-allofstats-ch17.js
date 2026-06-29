/* All of Statistics (Larry Wasserman) — Chapter 17: Directed Graphs and Conditional Independence.
   Self-registering book-template lessons, one per key concept. */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODEVIZ = window.CODEVIZ || {};
  const M = "All of Statistics";
  const B = (o) => window.LESSONS.push(Object.assign({ module: M, template: "book", book: "All of Statistics" }, o));

  // 1 — Conditional independence
  B({
    id: "aos-ch17-conditional-independence",
    chapter: "Chapter 17",
    title: "Conditional Independence",
    tagline: "Once you know Z, learning Y tells you nothing more about X.",
    sections: [
      { h: "What the notation means", body:
        "<p>Before talking about graphs the chapter needs one idea: conditional independence. We write three random variables as $X$, $Y$ and $Z$ (a random variable is a quantity whose value is uncertain). The symbol $\\amalg$ here is read \"is independent of\". The expression $X \\amalg Y \\mid Z$ is read \"X is conditionally independent of Y given Z\". The vertical bar $\\mid$ means \"given\" or \"once we know\".</p>" +
        "<p><strong>Definition 17.1.</strong> $X$ and $Y$ are conditionally independent given $Z$, written $X \\amalg Y \\mid Z$, if</p>" +
        "<p>$f_{X,Y\\mid Z}(x,y\\mid z) = f_{X\\mid Z}(x\\mid z)\\, f_{Y\\mid Z}(y\\mid z)$</p>" +
        "<p>holds for all values $x$, $y$ and $z$. Here $f$ is a probability function (it tells you how likely each value is), and the subscripts say which variables it describes. So $f_{X,Y\\mid Z}$ is the joint probability of $X$ and $Y$ once $Z$ is known, and the right side multiplies the two separate conditional probabilities.</p>" },
      { h: "The intuition", body:
        "<p>The author's plain-English reading: once you know $Z$, the variable $Y$ gives you no extra information about $X$. Knowing $Z$ already told you everything $Y$ could have told you.</p>" +
        "<p>An equivalent way to write the same condition (Equation 17.2) is</p>" +
        "<p>$f(x\\mid y,z) = f(x\\mid z)$.</p>" +
        "<p>In words: the probability of $X$ given both $Y$ and $Z$ is the same as the probability of $X$ given $Z$ alone. Adding $Y$ to the conditioning changes nothing.</p>" },
      { h: "Basic properties", body:
        "<p><strong>Theorem 17.2.</strong> Conditional independence obeys some rules. In the list below, $h$ is any function and $U = h(X)$ means $U$ is computed from $X$. The implications are:</p>" +
        "<ul class=\"steps\">" +
        "<li>$X \\amalg Y \\mid Z \\;\\Rightarrow\\; Y \\amalg X \\mid Z$ — the relation is symmetric.</li>" +
        "<li>$X \\amalg Y \\mid Z$ and $U = h(X) \\;\\Rightarrow\\; U \\amalg Y \\mid Z$ — anything built from $X$ is also independent of $Y$ given $Z$.</li>" +
        "<li>$X \\amalg Y \\mid Z$ and $U = h(X) \\;\\Rightarrow\\; X \\amalg Y \\mid (Z,U)$ — you may add such a $U$ to the conditioning set.</li>" +
        "<li>$X \\amalg Y \\mid Z$ and $X \\amalg W \\mid (Y,Z) \\;\\Rightarrow\\; X \\amalg (W,Y) \\mid Z$.</li>" +
        "<li>$X \\amalg Y \\mid Z$ and $X \\amalg Z \\mid Y \\;\\Rightarrow\\; X \\amalg (Y,Z)$.</li>" +
        "</ul>" +
        "<p>The author footnotes that the last property needs every event to have positive probability; the first four do not.</p>" }
    ],
    takeaways: [
      "$X \\amalg Y \\mid Z$ means the conditional joint factors: $f(x,y\\mid z) = f(x\\mid z)f(y\\mid z)$.",
      "Equivalently $f(x\\mid y,z) = f(x\\mid z)$: given $Z$, adding $Y$ changes nothing about $X$.",
      "The relation is symmetric and survives transforming a variable or enlarging the conditioning set.",
      "Conditional independence is the language used to read graphs in the rest of the chapter."
    ]
  });

  // 2 — DAGs and d-separation
  B({
    id: "aos-ch17-dags-d-separation",
    chapter: "Chapter 17",
    title: "DAGs and d-Separation",
    tagline: "Arrows define parents, children, paths, and colliders — and three rules say when two nodes are blocked.",
    sections: [
      { h: "Vertices, edges, and family words", body:
        "<p>A <strong>directed graph</strong> $\\mathcal{G}$ is a set of vertices $V$ plus an edge set $E$ of ordered pairs of vertices. Each vertex stands for a random variable. If the pair $(X,Y)$ is in $E$ there is an arrow pointing from $X$ to $Y$.</p>" +
        "<p>The author defines the family vocabulary. If an arrow connects $X$ and $Y$ in either direction they are <strong>adjacent</strong>. If the arrow goes from $X$ to $Y$, then $X$ is a <strong>parent</strong> of $Y$ and $Y$ is a <strong>child</strong> of $X$. The set of all parents of $X$ is written $\\pi_X$ or $\\pi(X)$. A <strong>directed path</strong> is a chain of arrows all pointing the same way. $X$ is an <strong>ancestor</strong> of $Y$ if a directed path runs from $X$ to $Y$, and then $Y$ is a <strong>descendant</strong> of $X$. Ignoring arrow directions gives an <strong>undirected path</strong>; for example $\\{X,Y,Z\\}$ in the opening graph (with $Y$ pointing to both $X$ and $Z$) is an undirected path.</p>" },
      { h: "Colliders and acyclic graphs", body:
        "<p>A key configuration is the <strong>collider</strong>: two arrows pointing into the same node, the shape $X \\to Y \\leftarrow Z$, called a collider at $Y$. Any other shape at $Y$ (such as $X \\to Y \\to Z$, or both arrows pointing the same way) is a <strong>non-collider</strong>.</p>" +
        "<p>The author stresses that being a collider is path dependent. In Figure 17.7 the node $Y$ is a collider on the path $\\{X,Y,Z\\}$ but a non-collider on the path $\\{X,Y,W\\}$. If the two variables pointing into a collider are not themselves adjacent, the collider is <strong>unshielded</strong>.</p>" +
        "<p>A directed path that starts and ends at the same vertex is a <strong>cycle</strong>. A graph with no cycles is <strong>acyclic</strong>, and a directed acyclic graph is a <strong>DAG</strong>. From here on the book deals only with DAGs.</p>" },
      { h: "The three rules of d-separation", body:
        "<p>d-separation means \"directed separation\". The author summarizes it as three rules. Read $X$ and $Z$ as the two endpoints and $Y$ as the middle node:</p>" +
        "<ul class=\"steps\">" +
        "<li>When $Y$ is not a collider, $X$ and $Z$ are <strong>d-connected</strong>, but they become <strong>d-separated</strong> once you condition on $Y$.</li>" +
        "<li>If $X$ and $Z$ collide at $Y$, then $X$ and $Z$ are <strong>d-separated</strong> on their own, but conditioning on $Y$ makes them <strong>d-connected</strong>.</li>" +
        "<li>Conditioning on a descendant of a collider has the same effect as conditioning on the collider itself. So in Figure 17.7, $X$ and $Z$ are d-separated, but become d-connected given $W$ (the descendant of the collider).</li>" +
        "</ul>" },
      { h: "The formal definition", body:
        "<p>More formally, let $X$ and $Y$ be distinct vertices and let $W$ be a set of vertices containing neither. Then $X$ and $Y$ are <strong>d-separated given $W$</strong> if there is no undirected path $U$ between them such that (i) every collider on $U$ has a descendant in $W$, and (ii) no other vertex on $U$ is in $W$. Sets that are not d-separated are <strong>d-connected</strong>.</p>" +
        "<p><strong>Example 17.9.</strong> For the chain in Figure 17.8, the author reads off:</p>" +
        "<ul class=\"steps\">" +
        "<li>$X$ and $Y$ are d-separated given the empty set.</li>" +
        "<li>$X$ and $Y$ are d-connected given $\\{S_1,S_2\\}$ (the descendants of the colliders).</li>" +
        "<li>$X$ and $Y$ are d-separated given $\\{S_1,S_2,V\\}$.</li>" +
        "</ul>" }
    ],
    takeaways: [
      "A DAG is a directed graph with no cycles; each vertex is a random variable.",
      "Parents, children, ancestors, descendants, and colliders ($X \\to Y \\leftarrow Z$) are the structural vocabulary.",
      "Rule of thumb: conditioning blocks a non-collider but opens a collider (or its descendant).",
      "$X$ and $Y$ are d-separated given $W$ when no undirected path stays active under the rules."
    ]
  });

  // 3 — Probability and DAGs (factorization)
  B({
    id: "aos-ch17-probability-and-dags",
    chapter: "Chapter 17",
    title: "Probability and DAGs",
    tagline: "A DAG factors the joint distribution into one conditional per node given its parents.",
    sections: [
      { h: "The Markov factorization", body:
        "<p>Now attach a distribution to the graph. Let $\\mathcal{G}$ be a DAG with vertices $V = (X_1,\\dots,X_k)$.</p>" +
        "<p><strong>Definition 17.3.</strong> A distribution $\\mathbb{P}$ for $V$, with probability function $f$, is <strong>Markov to $\\mathcal{G}$</strong> (equivalently, $\\mathcal{G}$ <strong>represents</strong> $\\mathbb{P}$) if</p>" +
        "<p>$f(v) = \\prod_{i=1}^{k} f(x_i \\mid \\pi_i)$</p>" +
        "<p>where $\\pi_i$ are the parents of $X_i$. The big product symbol $\\prod$ means \"multiply all these together\". So the whole joint distribution is just the product of each variable's probability given its parents. The set of all distributions a graph can represent is written $M(\\mathcal{G})$.</p>" },
      { h: "Example 17.4 — four variables", body:
        "<p>Figure 17.2 is the medical DAG: <em>overweight</em> points to <em>heart disease</em>; <em>smoking</em> points to both <em>heart disease</em> and <em>cough</em>. Applying the definition, the joint factors as:</p>" +
        "<ul class=\"steps\">" +
        "<li>$f(\\text{overweight}, \\text{smoking}, \\text{heart disease}, \\text{cough})$</li>" +
        "<li>$= f(\\text{overweight}) \\times f(\\text{smoking})$ — the two parentless nodes stand alone.</li>" +
        "<li>$\\times\\, f(\\text{heart disease} \\mid \\text{overweight}, \\text{smoking})$ — heart disease given its two parents.</li>" +
        "<li>$\\times\\, f(\\text{cough} \\mid \\text{smoking})$ — cough given its one parent.</li>" +
        "</ul>" +
        "<p>Each node contributes exactly one factor; a node with no parents contributes its plain marginal probability.</p>" },
      { h: "Example 17.5 — the collider DAG", body:
        "<p>Figure 17.3 is the collider: $X$ and $Y$ both point into $Z$, and $Z$ points to $W$. By the same rule, a distribution is in $M(\\mathcal{G})$ for this graph exactly when its probability function $f$ has the form</p>" +
        "<p>$f(x,y,z,w) = f(x)\\, f(y)\\, f(z\\mid x,y)\\, f(w\\mid z)$.</p>" +
        "<p>Read off the factors: $X$ and $Y$ are parentless, $Z$ is given its two parents $X$ and $Y$, and $W$ is given its single parent $Z$.</p>" }
    ],
    takeaways: [
      "$\\mathbb{P}$ is Markov to $\\mathcal{G}$ when $f(v) = \\prod_i f(x_i \\mid \\pi_i)$.",
      "Every node contributes one factor: its probability given its parents.",
      "A parentless node contributes its plain marginal probability.",
      "$M(\\mathcal{G})$ is the set of all distributions the graph can represent."
    ]
  });

  // 4 — More independence relations
  B({
    id: "aos-ch17-more-independence-relations",
    chapter: "Chapter 17",
    title: "More Independence Relations",
    tagline: "The Markov Condition lists basic independences; d-separation finds the rest.",
    sections: [
      { h: "The Markov Condition", body:
        "<p>The factorization is equivalent to a statement about independence.</p>" +
        "<p><strong>Theorem 17.6.</strong> A distribution $\\mathbb{P}$ is in $M(\\mathcal{G})$ if and only if the <strong>Markov Condition</strong> holds: for every variable $W$,</p>" +
        "<p>$W \\amalg \\widetilde{W} \\mid \\pi_W$</p>" +
        "<p>where $\\widetilde{W}$ (W with a tilde) denotes all the other variables except the parents and descendants of $W$. The plain reading the author gives: every variable is independent of its \"past\" once you know its parents.</p>" },
      { h: "Reading independences off the graph", body:
        "<p><strong>Example 17.7.</strong> For the collider DAG (Figure 17.3) the Markov Condition gives $X \\amalg Y$ and $W \\amalg \\{X,Y\\} \\mid Z$.</p>" +
        "<p><strong>Example 17.8.</strong> For the diamond DAG (Figure 17.4), where $A$ points to $B$ and $C$, both $B$ and $C$ point to $D$, and $D$ points to $E$, the joint must factor as</p>" +
        "<p>$f(a,b,c,d,e) = f(a)\\,f(b\\mid a)\\,f(c\\mid a)\\,f(d\\mid b,c)\\,f(e\\mid d)$,</p>" +
        "<p>and the Markov Condition implies these independence relations:</p>" +
        "<ul class=\"steps\">" +
        "<li>$D \\amalg A \\mid \\{B,C\\}$ — given both of $D$'s parents, $D$ is independent of $A$.</li>" +
        "<li>$E \\amalg \\{A,B,C\\} \\mid D$ — given its parent $D$, $E$ is independent of everything earlier.</li>" +
        "<li>$B \\amalg C \\mid A$ — the two children of $A$ are independent once $A$ is known.</li>" +
        "</ul>" },
      { h: "Extra relations need d-separation", body:
        "<p>The Markov Condition lists some independences, but they may logically imply more. The author uses the DAG of Figure 17.5 (with vertices $X_1,\\dots,X_5$). The Markov Condition gives:</p>" +
        "<ul class=\"steps\">" +
        "<li>$X_1 \\amalg X_2$, &nbsp; $X_2 \\amalg \\{X_1,X_4\\}$, &nbsp; $X_3 \\amalg X_4 \\mid \\{X_1,X_2\\}$,</li>" +
        "<li>$X_4 \\amalg \\{X_2,X_3\\} \\mid X_1$, &nbsp; $X_5 \\amalg \\{X_1,X_2\\} \\mid \\{X_3,X_4\\}$.</li>" +
        "</ul>" +
        "<p>The author notes it is not obvious, but these conditions also imply $\\{X_4,X_5\\} \\amalg X_2 \\mid \\{X_1,X_3\\}$. The tool that finds such extra relations is d-separation.</p>" +
        "<p><strong>Theorem 17.10.</strong> For disjoint sets of vertices $A$, $B$, $C$: $A \\amalg B \\mid C$ if and only if $A$ and $B$ are d-separated by $C$. (This assumes $\\mathbb{P}$ is <strong>faithful</strong> to $\\mathcal{G}$ — it has no independences beyond those the Markov Condition forces.)</p>" },
      { h: "Colliders create dependence — the alien example", body:
        "<p><strong>Example 17.11</strong> (from Jordan 2004) makes the collider rule palatable. Your friend is late; Figure 17.9 has <em>aliens</em> and <em>watch</em> (forgetting to set it) both pointing into <em>late</em> — a collider. Aliens and Watch are blocked by the collider, so they are marginally independent, which is reasonable: before knowing anything we would not expect alien abduction and a forgotten watch to be related. But once your friend is late, the two explanations compete: learning the friend forgot the watch lowers the chance of abduction. So $\\mathbb{P}(\\text{Aliens}=\\text{yes}\\mid \\text{Late}=\\text{yes}) \\ne \\mathbb{P}(\\text{Aliens}=\\text{yes}\\mid \\text{Late}=\\text{yes}, \\text{Watch}=\\text{no})$. Conditioning on the collider <em>Late</em> makes Aliens and Watch dependent.</p>" +
        "<p><strong>Example 17.12.</strong> In Figure 17.2, <em>overweight</em> and <em>smoking</em> are marginally independent but become dependent given <em>heart disease</em> — the same collider effect.</p>" },
      { h: "Markov equivalence", body:
        "<p>Different-looking graphs can encode the same independences. Writing $\\mathcal{I}(\\mathcal{G})$ for all independence statements a DAG implies, two DAGs are <strong>Markov equivalent</strong> if $\\mathcal{I}(\\mathcal{G}_1) = \\mathcal{I}(\\mathcal{G}_2)$. The <strong>skeleton</strong> of a DAG is the undirected graph you get by erasing arrowheads.</p>" +
        "<p><strong>Theorem 17.13.</strong> Two DAGs are Markov equivalent if and only if (i) they have the same skeleton and (ii) the same unshielded colliders.</p>" +
        "<p><strong>Example 17.14.</strong> The first three DAGs in Figure 17.6 (the three with no collider) are Markov equivalent; the fourth (the collider $X \\to Y \\leftarrow Z$) is not equivalent to the others.</p>" }
    ],
    takeaways: [
      "Markov Condition: each $W$ is independent of its non-descendant non-parents given its parents $\\pi_W$.",
      "Non-colliders block when conditioned on; colliders (and their descendants) open dependence when conditioned on.",
      "Theorem 17.10: $A \\amalg B \\mid C$ exactly when $C$ d-separates $A$ and $B$ (under faithfulness).",
      "Two DAGs are Markov equivalent iff same skeleton and same unshielded colliders."
    ]
  });

  // 5 — Estimation for DAGs
  B({
    id: "aos-ch17-estimation-for-dags",
    chapter: "Chapter 17",
    title: "Estimation for DAGs",
    tagline: "Estimating the distribution is just maximum likelihood; estimating the graph itself is hard model selection.",
    sections: [
      { h: "Two different questions", body:
        "<p>The author separates two estimation problems. First: given a DAG $\\mathcal{G}$ and data $V_1,\\dots,V_n$ from a distribution $f$ consistent with $\\mathcal{G}$, how do we estimate $f$? Second: given the data alone, how do we estimate $\\mathcal{G}$ itself? The first is pure estimation; the second is model selection. The author calls both very involved and beyond the book's scope, and only sketches the main ideas.</p>" },
      { h: "Estimating the distribution by maximum likelihood", body:
        "<p>Typically one picks a parametric model $f(x \\mid \\pi_x; \\theta_x)$ for each conditional density — a formula with tunable parameters $\\theta_x$ for the distribution of a node given its parents. Because the joint factors into these conditionals, the likelihood (the probability of the observed data viewed as a function of the parameters) is</p>" +
        "<p>$\\mathcal{L}(\\theta) = \\prod_{i=1}^{n} f(V_i; \\theta) = \\prod_{i=1}^{n} \\prod_{j=1}^{m} f(X_{ij} \\mid \\pi_j; \\theta_j)$,</p>" +
        "<p>where $X_{ij}$ is the value of $X_j$ for the $i$-th data point and $\\theta_j$ are the parameters of the $j$-th conditional density. We then estimate the parameters by maximizing this likelihood.</p>" },
      { h: "Estimating the structure is hard", body:
        "<p>To estimate the graph itself, one could in principle fit every possible DAG by maximum likelihood and pick one using AIC (Akaike's information criterion, a score that rewards fit and penalizes complexity) or another method. The author lists why this is difficult:</p>" +
        "<ul class=\"steps\">" +
        "<li>There are very many possible DAGs, so you need a great deal of data for the method to be reliable.</li>" +
        "<li>Searching through all DAGs is a serious computational challenge.</li>" +
        "<li>Producing a valid, accurate confidence set for the structure would need astronomical sample sizes.</li>" +
        "</ul>" +
        "<p>The author adds one consolation: if prior background information pins down part of the structure, both the computational and statistical problems are at least partly eased.</p>" }
    ],
    takeaways: [
      "Two problems: estimate the distribution given the graph (estimation), or estimate the graph (model selection).",
      "Given the graph, the factored likelihood is maximized parameter-by-parameter — ordinary maximum likelihood.",
      "Learning the structure means searching enormously many DAGs; reliable confidence sets need astronomical sample sizes.",
      "Prior knowledge of part of the structure makes the problem more tractable."
    ]
  });
})();
