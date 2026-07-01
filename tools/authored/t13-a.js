module.exports = {
  "math-13-01": {
    id: "math-13-01",
    title: "What topology studies",
    tagline: "Topology studies which features survive continuous stretching, bending, and reshaping.",
    connections: {
      buildsOn: ["sets", "functions", "distance and neighborhoods"],
      leadsTo: ["Topological spaces", "continuity", "compactness"],
      usedWith: ["set operations", "equivalence relations", "metric spaces"]
    },
    motivation:
      "<p>You already know that a circle and an oval feel like the same kind of shape, while a circle and two separate circles do not. The exact lengths and angles changed, but something deeper stayed put.</p>" +
      "<p><b>Topology</b> is the mathematics of that deeper sameness. It asks what remains true when we are allowed to stretch or bend without cutting, gluing, or tearing. For machine learning, this becomes a language for shape in data: connected pieces, holes, neighborhoods, and stable structure.</p>",
    definition:
      "<p>Topology studies properties preserved by continuous deformation and continuous maps. A property is <b>topological</b> if it is unchanged by a homeomorphism, meaning a bijective map whose forward and inverse directions are continuous. Examples include number of connected components, compactness, and whether removing a point disconnects a space.</p>" +
      "<p>The core move is to replace exact distance with the idea of <b>nearness</b>. In metric spaces, nearness comes from distances like $d(x,y)$. In general topology, nearness is encoded by open sets. This lets the same reasoning apply to curves, point clouds, function spaces, and parameter spaces.</p>" +
      "<p><b>Assumptions that matter:</b> topology does not ignore all geometry; it ignores only measurements that can change under continuous deformation. Cutting a loop, identifying two points, or changing the number of separated pieces changes the topology. The chosen notion of open set determines what counts as near.</p>",
    worked: {
      problem: "Decide which features are topological for a circle: radius $2$, circumference $4\\pi$, one connected component, and one hole.",
      skills: ["topological invariance", "continuous deformation", "shape comparison"],
      strategy: "Separate measurements that can stretch from structure that cannot be removed without cutting or gluing.",
      steps: [
        { do: "Imagine stretching the circle to radius $3$", result: "radius changes from $2$ to $3$", why: "stretching is allowed in topology" },
        { do: "Compute the new circumference", result: "$2\\pi\\cdot3=6\\pi$", why: "length changes when the circle stretches" },
        { do: "Track connected components", result: "still $1$ component", why: "stretching does not split the circle" },
        { do: "Track holes", result: "still $1$ central hole", why: "removing the hole would require filling or cutting" },
        { do: "Classify the features", result: "radius and circumference are not topological; component count and hole count are", why: "only the latter survive all homeomorphic reshaping" }
      ],
      verify: "An ellipse has different lengths from the circle but remains one loop with one hole, matching the topological features.",
      answer: "Topological features here are one connected component and one hole; radius $2$ and circumference $4\\pi$ are geometric, not topological.",
      connects: "Topology asks which shape facts remain after geometry is allowed to flex."
    },
    practice: [
      { problem: "A rubber band circle is stretched into an oval. Which of these change topologically: diameter, number of components, number of holes?", steps: [
        { do: "Compare diameters", result: "diameter can change", why: "stretching can lengthen one direction" },
        { do: "Count components before stretching", result: "$1$", why: "the original rubber band is one piece" },
        { do: "Count components after stretching", result: "$1$", why: "stretching does not tear the band" },
        { do: "Count holes before and after", result: "$1$ and $1$", why: "the loop still surrounds one opening" },
        { do: "Classify", result: "diameter changes; components and holes do not", why: "topology preserves connection and holes under deformation" }
      ], answer: "Diameter is not topological; number of components and holes are topological in this comparison." },
      { problem: "Compare a line segment $[0,1]$ with a circle. Use the effect of removing one point to show they are not topologically the same.", steps: [
        { do: "Remove an interior point from $[0,1]$", result: "two separated intervals", why: "for example removing $1/2$ leaves left and right pieces" },
        { do: "Count resulting components for the segment", result: "$2$", why: "the remaining pieces no longer touch" },
        { do: "Remove one point from a circle", result: "one open arc", why: "the rest can be followed continuously around the missing point" },
        { do: "Count resulting components for the circle", result: "$1$", why: "the remaining arc is still connected" },
        { do: "Compare the removal behavior", result: "$2\\ne1$", why: "homeomorphisms preserve this kind of connectedness behavior" }
      ], answer: "$[0,1]$ and a circle are not homeomorphic." },
      { problem: "A data cloud has two separated clusters with $40$ points and $60$ points. If each cluster is smoothly warped but not merged, how many connected components should the topology report?", steps: [
        { do: "Identify separated pieces", result: "two clusters", why: "there is a gap between the groups" },
        { do: "Warp the first cluster", result: "still one piece", why: "smooth deformation does not split it" },
        { do: "Warp the second cluster", result: "still one piece", why: "the same reasoning applies" },
        { do: "Check whether merging occurred", result: "no merger", why: "the problem says they are not merged" },
        { do: "Count components", result: "$2$", why: "component count ignores the exact point counts and shapes" }
      ], answer: "The topological component count remains $2$." },
      { problem: "A square frame is made of four edges and has an empty middle. Compare it topologically with a circle.", steps: [
        { do: "Count components of the square frame", result: "$1$", why: "all four edges meet into one loop" },
        { do: "Count holes of the square frame", result: "$1$", why: "the middle is enclosed and empty" },
        { do: "Count components of the circle", result: "$1$", why: "a circle is one loop" },
        { do: "Count holes of the circle", result: "$1$", why: "it also encloses one middle region" },
        { do: "Compare the counts", result: "same basic topological pattern", why: "corners can be rounded continuously" }
      ], answer: "A square frame and a circle have the same basic topology: one connected component with one hole." },
      { problem: "In a $2$D embedding, class A forms a ring around class B. Why can a linear rescaling preserve the ring fact even if all distances double?", steps: [
        { do: "Apply a scale factor $2$", result: "each distance becomes twice as large", why: "linear rescaling changes measurement" },
        { do: "Track class A", result: "still one surrounding ring", why: "scaling does not cut the ring" },
        { do: "Track class B", result: "still inside the ring", why: "relative containment is unchanged by the scaling" },
        { do: "Compare distance facts", result: "distances changed", why: "metric information is geometric" },
        { do: "Compare ring structure", result: "ring structure is preserved", why: "the deformation is continuous and reversible" }
      ], answer: "Distances double, but the surrounding-loop structure is preserved as a topological feature." }
    ],
    applications: [
      { title: "Clustering by connected pieces", background: "Topological thinking treats clusters as connected regions rather than only as Gaussian blobs. This helps when data is curved or stretched.", numbers: "If a point cloud separates into groups of $40$ and $60$ points with a clear gap, the component count is $2$ even if one group is long and curved." },
      { title: "Persistent homology", background: "Topological data analysis studies features that persist as a scale parameter grows. It was built to distinguish noise from shape.", numbers: "If a loop appears at radius $0.3$ and disappears at $1.1$, its persistence is $1.1-0.3=0.8$." },
      { title: "Image holes", background: "Computer vision sometimes needs shape facts that survive resizing and mild deformation. Counting holes is a simple topological feature.", numbers: "A digit $8$ has $2$ holes, while a digit $0$ has $1$; resizing from $28\\times28$ to $56\\times56$ should not change those counts." },
      { title: "Robotics configuration spaces", background: "A robot's possible positions form a space, and obstacles remove regions from it. Topology asks whether a path exists around those holes.", numbers: "In a square room with one circular obstacle, a path space may have one obstacle hole; a planned route of length $12$ m and another of length $15$ m can still wind around the same hole." },
      { title: "Neural representation geometry", background: "Embeddings often stretch and rotate under training while preserving neighborhood shape. Topology gives language for the preserved structure.", numbers: "If $1000$ points form one ring in layer $6$, multiplying all coordinates by $3$ changes norms but keeps one ring component." },
      { title: "Mesh processing", background: "Graphics meshes need checks that smoothing did not accidentally tear a surface. Topological counts catch those errors.", numbers: "A torus mesh should have one connected surface and one tunnel; if smoothing creates two connected components, the component count changed from $1$ to $2$." }
    ],
    applicationsClose: "Topology is the habit of asking which shape facts survive flexible change, whether the object is rubber, data, a mesh, or a model representation.",
    takeaways: [
      "Topology studies properties preserved by continuous, reversible deformation.",
      "Exact lengths and angles are geometric; connectedness and holes are topological.",
      "Open sets are the general language of nearness.",
      "Data analysis uses topology to find stable shape rather than fragile measurement."
    ]
  },

  "math-13-02": {
    id: "math-13-02",
    title: "Topological spaces",
    tagline: "A topological space is a set together with a chosen rule for which subsets count as open.",
    connections: {
      buildsOn: ["What topology studies", "sets", "unions and intersections"],
      leadsTo: ["Open and closed sets", "Bases", "Continuity"],
      usedWith: ["power sets", "metric spaces", "logic of set containment"]
    },
    motivation:
      "<p>You already know open intervals such as $(0,1)$ on the real line. But topology asks for a more flexible idea: what if the objects are strings, graphs, probability distributions, or model parameters?</p>" +
      "<p>A <b>topological space</b> packages the answer. It starts with a set of points and names which subsets are open. Once that choice is made, words like near, continuous, closed, connected, and compact have a place to live.</p>",
    definition:
      "<p>A <b>topology</b> on a set $X$ is a collection $\\tau$ of subsets of $X$ satisfying three rules: $\\emptyset\\in\\tau$ and $X\\in\\tau$; any union of sets in $\\tau$ is in $\\tau$; and any finite intersection of sets in $\\tau$ is in $\\tau$. The pair $(X,\\tau)$ is a <b>topological space</b>.</p>" +
      "<p>These rules preserve the behavior we expect from open intervals. Empty and whole spaces are harmless extremes. Arbitrary unions let many local open regions combine. Finite intersections let two or five requirements be imposed at once without demanding impossible infinite precision.</p>" +
      "<p><b>Assumptions that matter:</b> the same set $X$ can carry different topologies; open means member of $\\tau$, not necessarily open in the usual Euclidean sense; and arbitrary intersections of open sets need not be open.</p>",
    worked: {
      problem: "Let $X=\\{a,b\\}$ and $\\tau=\\{\\emptyset,\\{a\\},X\\}$. Verify that $\\tau$ is a topology.",
      skills: ["checking axioms", "set unions", "finite intersections"],
      strategy: "Check the three topology rules directly on this small collection.",
      steps: [
        { do: "Check the empty set", result: "$\\emptyset\\in\\tau$", why: "it is listed" },
        { do: "Check the whole set", result: "$X\\in\\tau$", why: "it is listed" },
        { do: "List possible nontrivial unions", result: "$\\{a\\}\\cup X=X$ and $\\{a\\}\\cup\\emptyset=\\{a\\}$", why: "unions stay in the listed collection" },
        { do: "List possible nontrivial intersections", result: "$\\{a\\}\\cap X=\\{a\\}$ and $\\{a\\}\\cap\\emptyset=\\emptyset$", why: "finite intersections stay listed" },
        { do: "Conclude", result: "$\\tau$ is a topology", why: "all three axioms hold" }
      ],
      verify: "No subset outside $\\emptyset$, $\\{a\\}$, and $X$ is forced by the axioms, so the collection is complete as listed.",
      answer: "Yes. $\\tau=\\{\\emptyset,\\{a\\},X\\}$ is a topology on $X=\\{a,b\\}$.",
      connects: "A topology is not a formula for distance; it is a legal collection of open sets."
    },
    practice: [
      { problem: "Let $X=\\{1,2\\}$ and $\\tau=\\{\\emptyset,X\\}$. Show this is a topology.", steps: [
        { do: "Check $\\emptyset$", result: "$\\emptyset\\in\\tau$", why: "required and listed" },
        { do: "Check $X$", result: "$X\\in\\tau$", why: "required and listed" },
        { do: "Union the listed sets", result: "$\\emptyset\\cup X=X$", why: "the only nontrivial union stays in $\\tau$" },
        { do: "Intersect the listed sets", result: "$\\emptyset\\cap X=\\emptyset$", why: "the only nontrivial finite intersection stays in $\\tau$" },
        { do: "State the topology name", result: "indiscrete topology", why: "only the empty set and whole set are open" }
      ], answer: "It is a topology, called the indiscrete topology." },
      { problem: "Let $X=\\{1,2\\}$ and $\\tau=\\{\\emptyset,\\{1\\},\\{2\\},X\\}$. Show this is a topology.", steps: [
        { do: "Recognize the collection", result: "$\\tau$ contains every subset of $X$", why: "there are four subsets total" },
        { do: "Check extremes", result: "$\\emptyset$ and $X$ are included", why: "topology rule one" },
        { do: "Take any union", result: "a subset of $X$", why: "unions of subsets of $X$ remain subsets of $X$" },
        { do: "Take any finite intersection", result: "a subset of $X$", why: "intersections of subsets of $X$ remain subsets of $X$" },
        { do: "Use membership", result: "the result is in $\\tau$", why: "$\\tau$ contains all subsets" }
      ], answer: "It is a topology, called the discrete topology." },
      { problem: "Let $X=\\{a,b,c\\}$ and $\\tau=\\{\\emptyset,\\{a\\},\\{b\\},X\\}$. Explain why this is not a topology.", steps: [
        { do: "Check the required extremes", result: "$\\emptyset$ and $X$ are included", why: "the first axiom is fine" },
        { do: "Take the union of $\\{a\\}$ and $\\{b\\}$", result: "$\\{a,b\\}$", why: "unions of open sets must be open" },
        { do: "Check membership", result: "$\\{a,b\\}\\notin\\tau$", why: "it is not listed" },
        { do: "Identify the failed axiom", result: "arbitrary union closure fails", why: "two listed open sets produced an unlisted set" },
        { do: "Conclude", result: "not a topology", why: "one failed axiom is enough" }
      ], answer: "It is not a topology because $\\{a\\}\\cup\\{b\\}=\\{a,b\\}$ is not included." },
      { problem: "On $X=\\{a,b,c\\}$, let $\\tau=\\{\\emptyset,\\{a\\},\\{a,b\\},X\\}$. Verify the finite-intersection rule.", steps: [
        { do: "Intersect $\\{a\\}$ and $\\{a,b\\}$", result: "$\\{a\\}$", why: "common elements only" },
        { do: "Intersect $\\{a\\}$ and $X$", result: "$\\{a\\}$", why: "$X$ does not remove anything" },
        { do: "Intersect $\\{a,b\\}$ and $X$", result: "$\\{a,b\\}$", why: "again $X$ is neutral" },
        { do: "Include intersections with $\\emptyset$", result: "$\\emptyset$", why: "intersection with empty is empty" },
        { do: "Check membership", result: "all results lie in $\\tau$", why: "finite-intersection closure holds" }
      ], answer: "The finite-intersection rule holds for this $\\tau$." },
      { problem: "A finite dataset $X$ has $5$ points. In the discrete topology, how many open sets are there?", steps: [
        { do: "Recall the discrete topology", result: "every subset is open", why: "discrete means all subsets are in $\\tau$" },
        { do: "Count subsets of a $5$-point set", result: "$2^5$", why: "each point is either included or not" },
        { do: "Compute the power", result: "$32$", why: "$2\\cdot2\\cdot2\\cdot2\\cdot2=32$" },
        { do: "Connect to open sets", result: "$32$ open sets", why: "open sets equal subsets in the discrete topology" },
        { do: "Compare with the indiscrete topology", result: "$2$ open sets", why: "only $\\emptyset$ and $X$ would be open there" }
      ], answer: "There are $32$ open sets in the discrete topology on $5$ points." }
    ],
    applications: [
      { title: "Digital finite spaces", background: "Finite topological spaces model simple systems where only certain observations are distinguishable.", numbers: "For $X=\\{a,b,c\\}$, the discrete topology has $2^3=8$ open sets, while the indiscrete topology has $2$." },
      { title: "Metric spaces become topological spaces", background: "Every distance rule creates open balls, and open balls create a topology. This is how calculus fits inside topology.", numbers: "On $\\mathbb{R}$, the ball of radius $0.1$ around $2$ is $(1.9,2.1)$, one basic open neighborhood." },
      { title: "Feature spaces with different notions of nearness", background: "ML features can use Euclidean, cosine, or graph-based neighborhoods. Each choice can induce a different topology-like structure.", numbers: "For vectors with cosine similarity at least $0.9$, a point may have $12$ neighbors; with threshold $0.8$, it may have $47$." },
      { title: "Program semantics", background: "Computer science uses topologies to discuss approximation and observable behavior, especially in domain theory.", numbers: "A three-state approximation chain $\\bot<a<b$ can use opens like $\\{b\\}$ and $\\{a,b\\}$ to encode what finite observations can confirm." },
      { title: "Probability distributions", background: "Spaces of distributions need a topology to say when one distribution converges to another.", numbers: "A sequence with means $1,1.5,1.75,1.875$ moves within $0.125$ of mean $2$ by the fourth value." },
      { title: "Neural network parameter spaces", background: "A parameter vector space inherits the usual topology from Euclidean distance, which makes continuous loss functions meaningful.", numbers: "If weights differ by norm $0.01$ and a loss is locally Lipschitz with constant $5$, the loss changes by at most about $0.05$." }
    ],
    applicationsClose: "A topological space is the quiet setup that lets all later shape words mean something precise.",
    takeaways: [
      "A topology $\\tau$ is a collection of open subsets of a set $X$.",
      "$\\emptyset$ and $X$ must be open; arbitrary unions and finite intersections of opens stay open.",
      "The same set can have many different topologies.",
      "Metric spaces are important examples, but topology is more general than distance."
    ]
  },

  "math-13-03": {
    id: "math-13-03",
    title: "Open and closed sets",
    tagline: "Open sets describe room to move; closed sets contain their boundary points.",
    connections: {
      buildsOn: ["Topological spaces", "set complements", "interval notation"],
      leadsTo: ["Bases", "Subspace topology", "Compactness"],
      usedWith: ["limits", "metric balls", "boundary points"]
    },
    motivation:
      "<p>You already feel the difference between being inside a room and standing on its wall. If you are safely inside, you can wiggle a little and stay inside. On the wall, every tiny wiggle may leave.</p>" +
      "<p><b>Open</b> and <b>closed</b> make that feeling precise. Open sets are neighborhoods with breathing room. Closed sets include all points they are supposed to limit toward. Many careful arguments in analysis, optimization, and ML begin by knowing which kind of set they are using.</p>",
    definition:
      "<p>In a topological space $(X,\\tau)$, a set $U\\subseteq X$ is <b>open</b> if $U\\in\\tau$. A set $F\\subseteq X$ is <b>closed</b> if its complement $X\\setminus F$ is open. In $\\mathbb{R}$ with the usual topology, $(0,1)$ is open, $[0,1]$ is closed, and $(0,1]$ is neither open nor closed.</p>" +
      "<p>Closed does not mean locked or finite. It means boundary-respecting: if a sequence of points in $F$ converges to a point of $X$, that limit point should still lie in $F$ for familiar metric spaces. The complement definition is the general topological one.</p>" +
      "<p><b>Assumptions that matter:</b> open and closed are relative to the chosen topology and ambient space $X$; a set can be both open and closed; and a set can be neither open nor closed.</p>",
    worked: {
      problem: "In $\\mathbb{R}$ with the usual topology, classify $(0,1)$, $[0,1]$, and $(0,1]$ as open, closed, both, or neither.",
      skills: ["intervals", "complements", "boundary points"],
      strategy: "Use breathing room for openness and complements for closedness.",
      steps: [
        { do: "Check $(0,1)$ for openness", result: "open", why: "each point has a small interval around it inside $(0,1)$" },
        { do: "Check the complement of $(0,1)$", result: "$(-\\infty,0]\\cup[1,\\infty)$", why: "the endpoints remain in the complement" },
        { do: "Classify $(0,1)$ as closed or not", result: "not closed", why: "its complement is not open in the usual topology" },
        { do: "Check $[0,1]$ via complement", result: "$(-\\infty,0)\\cup(1,\\infty)$ is open", why: "a union of open intervals is open" },
        { do: "Check $(0,1]$", result: "neither open nor closed", why: "$1$ blocks openness and missing $0$ blocks closedness" }
      ],
      verify: "The endpoints are the clue: including both gives closed, excluding both gives open, including only one gives neither in the usual real line.",
      answer: "$(0,1)$ is open not closed; $[0,1]$ is closed not open; $(0,1]$ is neither.",
      connects: "Open and closed describe how a set handles nearby points and boundary points."
    },
    practice: [
      { problem: "Classify $\\emptyset$ and $X$ in any topological space $(X,\\tau)$.", steps: [
        { do: "Use the topology axiom", result: "$\\emptyset$ is open", why: "every topology contains it" },
        { do: "Use the topology axiom again", result: "$X$ is open", why: "every topology contains the whole space" },
        { do: "Take complement of $\\emptyset$", result: "$X$", why: "closedness depends on open complements" },
        { do: "Take complement of $X$", result: "$\\emptyset$", why: "the whole space leaves nothing outside" },
        { do: "Classify both sets", result: "both open and closed", why: "each has an open complement" }
      ], answer: "$\\emptyset$ and $X$ are both open and closed in every topological space." },
      { problem: "In $\\mathbb{R}$, decide whether $(-\\infty,3)$ is open and whether it is closed.", steps: [
        { do: "Check openness", result: "open", why: "every point less than $3$ has room before reaching $3$" },
        { do: "Compute the complement", result: "$[3,\\infty)$", why: "all real numbers not less than $3$" },
        { do: "Check complement openness", result: "not open", why: "the endpoint $3$ has no left-side room inside the complement" },
        { do: "Use closed definition", result: "not closed", why: "a closed set needs open complement" },
        { do: "State classification", result: "open but not closed", why: "only the openness test passed" }
      ], answer: "$(-\\infty,3)$ is open but not closed." },
      { problem: "In $\\mathbb{R}$, decide whether $\\{2\\}$ is closed.", steps: [
        { do: "Compute the complement", result: "$(-\\infty,2)\\cup(2,\\infty)$", why: "remove the single point $2$" },
        { do: "Check the first piece", result: "$(-\\infty,2)$ is open", why: "open ray in the usual topology" },
        { do: "Check the second piece", result: "$(2,\\infty)$ is open", why: "open ray in the usual topology" },
        { do: "Union the pieces", result: "open", why: "unions of open sets are open" },
        { do: "Apply the definition", result: "$\\{2\\}$ is closed", why: "its complement is open" }
      ], answer: "$\\{2\\}$ is closed in $\\mathbb{R}$." },
      { problem: "In the discrete topology on $X=\\{a,b,c\\}$, classify $A=\\{a,c\\}$.", steps: [
        { do: "Recall discrete topology", result: "every subset is open", why: "that is the definition of discrete" },
        { do: "Apply to $A$", result: "$A$ is open", why: "$A\\subseteq X$" },
        { do: "Compute the complement", result: "$X\\setminus A=\\{b\\}$", why: "only $b$ is outside" },
        { do: "Check complement openness", result: "$\\{b\\}$ is open", why: "every subset is open" },
        { do: "Classify $A$", result: "open and closed", why: "it is open and has open complement" }
      ], answer: "$A$ is both open and closed in the discrete topology." },
      { problem: "For the constraint set $C=[0,1]$ in $\\mathbb{R}$, explain why a convergent sequence $0.9,0.99,0.999,\\ldots$ has its limit inside $C$.", steps: [
        { do: "Identify the sequence", result: "$x_n=1-10^{-n}$", why: "the listed numbers approach $1$" },
        { do: "Compute the limit", result: "$\\lim x_n=1$", why: "$10^{-n}\\to0$" },
        { do: "Check membership of the limit", result: "$1\\in[0,1]$", why: "the endpoint is included" },
        { do: "Name the closed-set behavior", result: "the limit stays in $C$", why: "closed intervals contain their boundary limits" },
        { do: "Contrast with $(0,1)$", result: "$1\\notin(0,1)$", why: "the open interval would lose this limit" }
      ], answer: "The limit is $1$, and $1$ lies in the closed set $[0,1]$." }
    ],
    applications: [
      { title: "Feasible regions in optimization", background: "Constraints often form closed sets so limit points of improving solutions remain feasible.", numbers: "If weights must satisfy $0\\le w\\le1$, the sequence $0.9,0.99,0.999$ approaches $1$, still feasible." },
      { title: "Open neighborhoods for gradients", background: "Differentiability is local, so analysts use open neighborhoods where small perturbations are allowed.", numbers: "Around $w=2$ with radius $0.1$, the open interval $(1.9,2.1)$ permits steps like $2.03$ and $1.95$." },
      { title: "Threshold decision regions", background: "Classifier regions can be open, closed, or neither depending on whether the threshold is included.", numbers: "Scores with accept rule $s\\ge0.7$ form $[0.7,1]$, while reject scores $s<0.7$ form $[0,0.7)$ inside $[0,1]$." },
      { title: "Image masks", background: "A binary mask may include or exclude boundary pixels. Topology helps describe whether the boundary belongs to the object.", numbers: "A disk mask with radius condition $r\\le10$ includes about $\\pi\\cdot10^2\\approx314$ square pixels in a continuous approximation." },
      { title: "Safe parameter sets", background: "Safety constraints are often closed so a limit of safe models stays safe.", numbers: "If latency must be at most $100$ ms, measured latencies $99.9,99.99,99.999$ approach $100$, still allowed by $L\\le100$." },
      { title: "Nearest-neighbor balls", background: "Open and closed balls differ by whether the boundary radius is included, which can affect ties.", numbers: "With radius $5$, a point at distance $4.9$ is in both balls; a point at distance $5.0$ is only in the closed ball." }
    ],
    applicationsClose: "Open and closed sets are boundary discipline: they tell us where motion has room and where limits are retained.",
    takeaways: [
      "Open means member of the topology; closed means the complement is open.",
      "A set may be open, closed, both, or neither.",
      "In metric spaces, open sets give room to wiggle and closed sets keep their limit points.",
      "Open and closed are always relative to the chosen space and topology."
    ]
  },

  "math-13-04": {
    id: "math-13-04",
    title: "Bases",
    tagline: "A basis builds every open set from small, reusable open pieces.",
    connections: {
      buildsOn: ["Open and closed sets", "unions", "intervals"],
      leadsTo: ["Subspace topology", "Continuity", "local arguments"],
      usedWith: ["metric balls", "product sets", "neighborhoods"]
    },
    motivation:
      "<p>Listing every open set is usually impossible. On the real line, there are far too many open sets to write down one by one. But you already know a smaller vocabulary: open intervals.</p>" +
      "<p>A <b>basis</b> is that vocabulary. It gives small open building blocks, and every open set is made by taking unions of them. This makes topology practical: prove something locally on basic pieces, then extend by unions.</p>",
    definition:
      "<p>A collection $\\mathcal{B}$ of subsets of $X$ is a <b>basis</b> for a topology if every point of $X$ lies in some $B\\in\\mathcal{B}$, and whenever $x\\in B_1\\cap B_2$ with $B_1,B_2\\in\\mathcal{B}$, there is a basis element $B_3\\in\\mathcal{B}$ such that $x\\in B_3\\subseteq B_1\\cap B_2$. The topology generated by $\\mathcal{B}$ consists of all unions of basis elements.</p>" +
      "<p>For $\\mathbb{R}$, the open intervals $(a,b)$ form a basis for the usual topology. If a set $U$ is open and $x\\in U$, there is a small interval around $x$ contained in $U$; unioning all such intervals recovers $U$.</p>" +
      "<p><b>Assumptions that matter:</b> basis elements need not be disjoint; the generated open sets are arbitrary unions of basis elements; and the intersection condition is local at each point of overlap, not a demand that the whole intersection be a single basis element.</p>",
    worked: {
      problem: "Show that open intervals form a basis for the usual topology on $\\mathbb{R}$ by finding a smaller interval around $x=1$ inside $(0,3)\\cap(0.5,2)$.",
      skills: ["basis condition", "interval intersections", "containment"],
      strategy: "Intersect the two intervals, then choose a smaller open interval containing the point.",
      steps: [
        { do: "Compute the intersection", result: "$(0,3)\\cap(0.5,2)=(0.5,2)$", why: "the stricter lower and upper bounds win" },
        { do: "Check the point", result: "$1\\in(0.5,2)$", why: "$0.5<1<2$" },
        { do: "Choose a smaller interval", result: "$(0.75,1.25)$", why: "it surrounds $1$" },
        { do: "Check containment", result: "$(0.75,1.25)\\subseteq(0.5,2)$", why: "both endpoints lie inside the larger interval" },
        { do: "State the basis condition", result: "a basis element around $1$ lies inside the overlap", why: "this is the required local refinement" }
      ],
      verify: "The same midpoint-margin idea works for any point in the overlap of two open intervals.",
      answer: "For $x=1$, $(0.75,1.25)$ is a basis element contained in $(0,3)\\cap(0.5,2)$.",
      connects: "Bases reduce topology to local building blocks."
    },
    practice: [
      { problem: "Write the open set $(0,2)\\cup(3,5)$ as a union of basis elements from the usual basis on $\\mathbb{R}$.", steps: [
        { do: "Identify the basis", result: "open intervals", why: "the usual basis on $\\mathbb{R}$" },
        { do: "Observe the first piece", result: "$(0,2)$ is a basis element", why: "it is an open interval" },
        { do: "Observe the second piece", result: "$(3,5)$ is a basis element", why: "it is also an open interval" },
        { do: "Union the pieces", result: "$(0,2)\\cup(3,5)$", why: "open sets are unions of basis elements" },
        { do: "Count the basis elements used", result: "$2$", why: "two intervals are enough" }
      ], answer: "$(0,2)\\cup(3,5)$ is the union of the two basis elements $(0,2)$ and $(3,5)$." },
      { problem: "In $\\mathbb{R}^2$, rectangles $(a,b)\\times(c,d)$ form a basis. Find a basis rectangle around $(1,2)$ inside $(0,3)\\times(1,5)$.", steps: [
        { do: "Check the point", result: "$(1,2)\\in(0,3)\\times(1,5)$", why: "$0<1<3$ and $1<2<5$" },
        { do: "Choose horizontal bounds", result: "$(0.5,1.5)$", why: "they contain $1$ and fit inside $(0,3)$" },
        { do: "Choose vertical bounds", result: "$(1.5,2.5)$", why: "they contain $2$ and fit inside $(1,5)$" },
        { do: "Form the rectangle", result: "$(0.5,1.5)\\times(1.5,2.5)$", why: "basis elements are products of open intervals" },
        { do: "Check containment", result: "contained in $(0,3)\\times(1,5)$", why: "each coordinate interval is contained" }
      ], answer: "One valid basis rectangle is $(0.5,1.5)\\times(1.5,2.5)$." },
      { problem: "On $X=\\{a,b,c\\}$, let $\\mathcal{B}=\\{\\{a\\},\\{b,c\\}\\}$. What topology does it generate?", steps: [
        { do: "List unions using no basis elements", result: "$\\emptyset$", why: "empty union gives the empty set" },
        { do: "Use the first basis element", result: "$\\{a\\}$", why: "single-element union" },
        { do: "Use the second basis element", result: "$\\{b,c\\}$", why: "single-element union" },
        { do: "Use both basis elements", result: "$\\{a,b,c\\}=X$", why: "their union covers all points" },
        { do: "Collect the topology", result: "$\\{\\emptyset,\\{a\\},\\{b,c\\},X\\}$", why: "all generated opens are unions of basis elements" }
      ], answer: "The generated topology is $\\{\\emptyset,\\{a\\},\\{b,c\\},X\\}$." },
      { problem: "Explain why $\\mathcal{B}=\\{(a,b):a<b\\}$ covers every point of $\\mathbb{R}$.", steps: [
        { do: "Take an arbitrary point", result: "$x\\in\\mathbb{R}$", why: "coverage must work for every point" },
        { do: "Choose an interval", result: "$(x-1,x+1)$", why: "it is an open interval" },
        { do: "Check membership", result: "$x\\in(x-1,x+1)$", why: "$x-1<x<x+1$" },
        { do: "Check basis membership", result: "$(x-1,x+1)\\in\\mathcal{B}$", why: "the left endpoint is smaller than the right endpoint" },
        { do: "Conclude coverage", result: "every point lies in a basis element", why: "the arbitrary $x$ was covered" }
      ], answer: "The open intervals cover $\\mathbb{R}$ because every $x$ lies in $(x-1,x+1)$." },
      { problem: "In nearest-neighbor learning, suppose open balls of radius $0.5$ around training points are used as local basis pieces. If point $p$ has coordinates $(2,3)$, give a square neighborhood contained in the ball of radius $0.5$ using half-width $0.25$.", steps: [
        { do: "Write the square", result: "$(1.75,2.25)\\times(2.75,3.25)$", why: "half-width $0.25$ around each coordinate" },
        { do: "Compute maximum coordinate change", result: "$0.25$ in each coordinate", why: "that is how the square was chosen" },
        { do: "Bound Euclidean distance", result: "$\\sqrt{0.25^2+0.25^2}\\approx0.354$", why: "corner distance is the largest" },
        { do: "Compare with radius", result: "$0.354<0.5$", why: "the square fits inside the ball" },
        { do: "State containment", result: "the square is a local basis-like neighborhood", why: "every point in it remains within radius $0.5$" }
      ], answer: "The square $(1.75,2.25)\\times(2.75,3.25)$ is contained in the radius-$0.5$ ball." }
    ],
    applications: [
      { title: "Euclidean neighborhoods", background: "Calculus uses balls and intervals as local pieces. Bases formalize why local interval arguments build global open sets.", numbers: "The interval $(1.9,2.1)$ is a radius-$0.1$ basis neighborhood around $2$." },
      { title: "Image patches", background: "Computer vision often reasons locally with patches. A topology-like basis viewpoint says global image regions are unions of local patches.", numbers: "A $224\\times224$ image divided into $16\\times16$ patches has $14\\cdot14=196$ local pieces." },
      { title: "Product feature spaces", background: "When features combine, rectangular basis sets describe independent tolerances in each coordinate.", numbers: "Age within $\\pm2$ years and income within $\\pm5000$ dollars gives a rectangle of width $4$ by $10000$." },
      { title: "Local explanations", background: "Model explanations such as LIME sample local neighborhoods around an input. Basis thinking clarifies the chosen local region.", numbers: "If perturbations allow each of $10$ binary features to flip independently, there are $2^{10}=1024$ local binary variants." },
      { title: "Database range queries", background: "Range indexes answer queries that look like basic open or half-open intervals; unions of ranges build more complex filters.", numbers: "The query price between $10$ and $20$ and rating between $4$ and $5$ is a rectangle in two features." },
      { title: "Manifold charts", background: "Differential geometry uses coordinate neighborhoods as local building blocks for curved spaces.", numbers: "A globe can be covered by two stereographic charts; each chart behaves locally like $\\mathbb{R}^2$." }
    ],
    applicationsClose: "Bases are efficient vocabulary: small local pieces that generate the open worlds we actually reason in.",
    takeaways: [
      "A basis covers the space and refines overlaps locally.",
      "The generated topology consists of all unions of basis elements.",
      "Open intervals form a basis for the usual topology on $\\mathbb{R}$.",
      "Basis thinking is local-to-global thinking."
    ]
  },

  "math-13-05": {
    id: "math-13-05",
    title: "Subspace topology",
    tagline: "A subspace inherits openness by intersecting the larger world's open sets with the smaller set.",
    connections: {
      buildsOn: ["Bases", "Open and closed sets", "set intersections"],
      leadsTo: ["Continuity", "Connectedness", "Compactness"],
      usedWith: ["relative openness", "metric restrictions", "embedded spaces"]
    },
    motivation:
      "<p>You already know that a point at the end of a line segment feels like a boundary in the full real line. But if the line segment is the whole universe, that endpoint has a different local feel: there is no outside direction to the left inside the subspace.</p>" +
      "<p>The <b>subspace topology</b> lets a smaller set inherit topology from a larger one. It is the natural way to talk about a circle sitting in the plane, a constraint set inside parameter space, or a dataset sitting inside feature space.</p>",
    definition:
      "<p>If $(X,\\tau)$ is a topological space and $Y\\subseteq X$, the <b>subspace topology</b> on $Y$ is $$\\tau_Y=\\{Y\\cap U:U\\in\\tau\\}.$$ A set $V\\subseteq Y$ is open in the subspace if it equals $Y\\cap U$ for some open set $U$ in $X$.</p>" +
      "<p>This definition keeps the larger notion of nearness but restricts attention to points that live in $Y$. For example, $[0,1)$ is open in the subspace $[0,2]$ because $[0,1)=[0,2]\\cap(-1,1)$, even though $[0,1)$ is not open in $\\mathbb{R}$.</p>" +
      "<p><b>Assumptions that matter:</b> open in $Y$ does not necessarily mean open in $X$; complements for closedness are taken inside $Y$; and all inherited neighborhoods are intersections with the ambient open sets.</p>",
    worked: {
      problem: "Let $Y=[0,2]\\subseteq\\mathbb{R}$. Show that $[0,1)$ is open in the subspace $Y$.",
      skills: ["relative openness", "intersections", "intervals"],
      strategy: "Find an open set in $\\mathbb{R}$ whose intersection with $Y$ gives the target set.",
      steps: [
        { do: "Choose an ambient open set", result: "$U=(-1,1)$", why: "it is open in $\\mathbb{R}$" },
        { do: "Intersect with $Y$", result: "$[0,2]\\cap(-1,1)$", why: "subspace opens have this form" },
        { do: "Compute the intersection", result: "$[0,1)$", why: "points must be at least $0$ from $Y$ and less than $1$ from $U$" },
        { do: "Match the target", result: "$Y\\cap U=[0,1)$", why: "the intersection equals the set we wanted" },
        { do: "Conclude relative openness", result: "$[0,1)$ is open in $Y$", why: "it is the intersection of $Y$ with an ambient open set" }
      ],
      verify: "This does not claim $[0,1)$ is open in $\\mathbb{R}$; it is open only relative to $Y=[0,2]$.",
      answer: "$[0,1)$ is open in the subspace $[0,2]$ because $[0,1)=[0,2]\\cap(-1,1)$.",
      connects: "Subspace topology changes the ambient universe while preserving inherited nearness."
    },
    practice: [
      { problem: "Let $Y=[0,2]$. Show that $(0,2]$ is open in $Y$.", steps: [
        { do: "Choose an ambient open set", result: "$U=(0,3)$", why: "it is open in $\\mathbb{R}$" },
        { do: "Intersect with $Y$", result: "$[0,2]\\cap(0,3)$", why: "subspace definition" },
        { do: "Compute the intersection", result: "$(0,2]$", why: "points are greater than $0$ and at most $2$" },
        { do: "Match the target", result: "$Y\\cap U=(0,2]$", why: "the desired set has the required form" },
        { do: "Conclude", result: "open in $Y$", why: "relative openness is proved" }
      ], answer: "$(0,2]$ is open in the subspace $Y=[0,2]$." },
      { problem: "Let $Y=\\{0\\}\\cup(1,2)$ as a subspace of $\\mathbb{R}$. Is $\\{0\\}$ open in $Y$?", steps: [
        { do: "Choose an ambient open set around $0$", result: "$U=(-0.5,0.5)$", why: "it isolates $0$ from the interval $(1,2)$" },
        { do: "Intersect with $Y$", result: "$Y\\cap U$", why: "subspace opens are intersections" },
        { do: "Compute the intersection", result: "$\\{0\\}$", why: "no point of $(1,2)$ lies between $-0.5$ and $0.5$" },
        { do: "Check the form", result: "$\\{0\\}=Y\\cap U$", why: "it comes from an ambient open set" },
        { do: "Conclude", result: "$\\{0\\}$ is open in $Y$", why: "isolated points can be open in a subspace" }
      ], answer: "Yes. $\\{0\\}$ is open in $Y$." },
      { problem: "In $Y=[0,1]$, classify $(0,1]$ as open, closed, both, or neither relative to $Y$.", steps: [
        { do: "Show relative openness", result: "$(0,1]=[0,1]\\cap(0,2)$", why: "$(0,2)$ is open in $\\mathbb{R}$" },
        { do: "Compute the complement in $Y$", result: "$Y\\setminus(0,1]=\\{0\\}$", why: "only $0$ is missing" },
        { do: "Show complement is open in $Y$", result: "$\\{0\\}=[0,1]\\cap(-1,0.5)$", why: "it is a subspace-open set" },
        { do: "Use closed definition", result: "$(0,1]$ is closed in $Y$", why: "its relative complement is open" },
        { do: "Classify", result: "both open and closed in $Y$", why: "both tests passed" }
      ], answer: "$(0,1]$ is both open and closed in the subspace $Y=[0,1]$." },
      { problem: "Let $Y$ be the unit circle in $\\mathbb{R}^2$. Describe an open arc as a subspace-open set.", steps: [
        { do: "Let the target be a short arc", result: "points on the circle with angles between $0$ and $\\pi/2$", why: "this is a quarter arc without endpoints" },
        { do: "Choose an ambient open region", result: "the first quadrant $\\{(x,y):x>0,y>0\\}$", why: "it is open in $\\mathbb{R}^2$" },
        { do: "Intersect with the circle", result: "$Y\\cap\\{(x,y):x>0,y>0\\}$", why: "subspace rule" },
        { do: "Read the result", result: "the open first-quadrant arc", why: "only circle points in that open quadrant remain" },
        { do: "Conclude relative openness", result: "the arc is open in $Y$", why: "it is an ambient-open intersection" }
      ], answer: "The first-quadrant open arc is open in the circle subspace." },
      { problem: "A feasible parameter set is $Y=[0,10]$. Show the learning-rate region $[0,0.1)$ is open in $Y$ if $Y$ is viewed as a subspace of $\\mathbb{R}$.", steps: [
        { do: "Choose an ambient open interval", result: "$U=(-1,0.1)$", why: "it is open in $\\mathbb{R}$" },
        { do: "Intersect with $Y$", result: "$[0,10]\\cap(-1,0.1)$", why: "relative topology" },
        { do: "Compute the intersection", result: "$[0,0.1)$", why: "the lower endpoint comes from $Y$" },
        { do: "Match the region", result: "the learning-rate region is $Y\\cap U$", why: "it has the subspace-open form" },
        { do: "State the interpretation", result: "open relative to feasible rates", why: "negative rates are outside the universe" }
      ], answer: "$[0,0.1)$ is open relative to $Y=[0,10]$." }
    ],
    applications: [
      { title: "Constraint sets in ML", background: "Parameters often live in a subset such as probabilities or nonnegative weights. Openness is then relative to the feasible set.", numbers: "Inside $[0,1]$, the region $[0,0.2)$ is open because it equals $[0,1]\\cap(-0.1,0.2)$." },
      { title: "Manifold learning", background: "Data may lie on a curved subspace inside a high-dimensional ambient space. Neighborhoods are inherited from the ambient metric.", numbers: "A circle embedded in $\\mathbb{R}^2$ can use a radius-$0.1$ disk; intersecting with the circle gives a small arc." },
      { title: "Probability simplex", background: "Class probabilities for $k$ classes live in a simplex, not all of $\\mathbb{R}^k$. Its topology is inherited from Euclidean space.", numbers: "For $3$ classes, probabilities satisfy $p_1+p_2+p_3=1$ and $p_i\\ge0$, a $2$D triangle in $\\mathbb{R}^3$." },
      { title: "Embedded graphs", background: "Road networks or knowledge graphs can be seen as subspaces of larger geometric or combinatorial spaces.", numbers: "A path with $20$ road nodes inherits neighborhoods along edges rather than all nearby points in the plane." },
      { title: "Boundary-aware optimization", background: "An endpoint can be open relative to the feasible set even if it is not open in the ambient line.", numbers: "For learning rate $\\eta\\in[0,1]$, a small relative neighborhood of $0$ can look like $[0,0.01)$." },
      { title: "Data slices", background: "Analysts often study a cohort as a subspace of all users. Relative open sets describe neighborhoods inside that cohort.", numbers: "If a cohort has ages $30$ to $40$, the relative age band $[30,32)$ equals $[30,40]\\cap(29,32)$." }
    ],
    applicationsClose: "Subspace topology teaches a gentle but important lesson: openness depends on the universe you are standing in.",
    takeaways: [
      "Subspace-open sets have the form $Y\\cap U$ where $U$ is open in the ambient space.",
      "A set can be open in a subspace without being open in the ambient space.",
      "Relative complements are taken inside the subspace.",
      "Constraints, manifolds, simplexes, and embedded data all use inherited topology."
    ]
  },

  "math-13-06": {
    id: "math-13-06",
    title: "Continuity",
    tagline: "A continuous map sends nearby inputs to outputs that remain nearby in the topological sense.",
    connections: {
      buildsOn: ["Open and closed sets", "Subspace topology", "functions"],
      leadsTo: ["Homeomorphisms", "Connectedness", "Compactness"],
      usedWith: ["preimages", "limits", "metric spaces"]
    },
    motivation:
      "<p>You already know continuity on the real line as no jumps or tears. Topology keeps that intuition but removes dependence on formulas, derivatives, or exact distances.</p>" +
      "<p>The topological definition is beautifully practical: a function is continuous if the preimage of every open set is open. Instead of chasing every nearby point one by one, we test whether open output requirements pull back to open input requirements.</p>",
    definition:
      "<p>Let $(X,\\tau_X)$ and $(Y,\\tau_Y)$ be topological spaces. A function $f:X\\to Y$ is <b>continuous</b> if for every open set $U\\in\\tau_Y$, the preimage $f^{-1}(U)=\\{x\\in X:f(x)\\in U\\}$ is open in $X$. Equivalently, preimages of closed sets are closed.</p>" +
      "<p>For real functions, this matches the familiar epsilon-delta idea. If an output interval around $f(a)$ is requested, continuity says the inputs that land inside that interval form a neighborhood around $a$. The open-set version works in spaces where no numeric distance is available.</p>" +
      "<p><b>Assumptions that matter:</b> continuity depends on the topologies on both domain and codomain; preimage is used, not image; and a function can be continuous under one choice of topology but not another.</p>",
    worked: {
      problem: "Show that $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=2x+1$, is continuous by checking the preimage of an open interval $(a,b)$.",
      skills: ["preimages", "linear inequalities", "open intervals"],
      strategy: "Pull the output interval back through the formula and see whether the input set is open.",
      steps: [
        { do: "Write the preimage condition", result: "$f(x)\\in(a,b)$", why: "preimage means outputs land in the target set" },
        { do: "Substitute the formula", result: "$2x+1\\in(a,b)$", why: "$f(x)=2x+1$" },
        { do: "Turn membership into inequalities", result: "$a<2x+1<b$", why: "interval membership is a double inequality" },
        { do: "Subtract $1$", result: "$a-1<2x<b-1$", why: "isolate the term with $x$" },
        { do: "Divide by $2$", result: "$(a-1)/2<x<(b-1)/2$", why: "positive division preserves inequalities" },
        { do: "Read the preimage", result: "$f^{-1}((a,b))=((a-1)/2,(b-1)/2)$", why: "the solution set is an open interval" }
      ],
      verify: "Open intervals generate the usual topology, and every basic open interval pulls back to an open interval.",
      answer: "$f$ is continuous because preimages of basic open intervals are open intervals.",
      connects: "Continuity is openness preserved backward through the function."
    },
    practice: [
      { problem: "For $f(x)=x^2$, find $f^{-1}((1,4))$ in $\\mathbb{R}$ and decide whether it is open.", steps: [
        { do: "Write the preimage condition", result: "$1<x^2<4$", why: "outputs must lie in $(1,4)$" },
        { do: "Solve $x^2>1$", result: "$x<-1$ or $x>1$", why: "outside the unit interval" },
        { do: "Solve $x^2<4$", result: "$-2<x<2$", why: "inside radius $2$" },
        { do: "Combine the conditions", result: "$(-2,-1)\\cup(1,2)$", why: "both inequalities must hold" },
        { do: "Check openness", result: "open", why: "a union of open intervals is open" }
      ], answer: "$f^{-1}((1,4))=(-2,-1)\\cup(1,2)$, which is open." },
      { problem: "Let $g:\\mathbb{R}\\to\\mathbb{R}$ be the step function $g(x)=0$ for $x<0$ and $g(x)=1$ for $x\\ge0$. Use $U=(0.5,1.5)$ to show $g$ is not continuous.", steps: [
        { do: "Check that $U$ is open", result: "$(0.5,1.5)$ is open", why: "ordinary open interval" },
        { do: "Find where $g(x)\\in U$", result: "$x\\ge0$", why: "only output $1$ lies in $(0.5,1.5)$" },
        { do: "Write the preimage", result: "$g^{-1}(U)=[0,\\infty)$", why: "all nonnegative inputs map to $1$" },
        { do: "Check openness of the preimage", result: "not open in $\\mathbb{R}$", why: "$0$ has no left-side room inside the set" },
        { do: "Conclude", result: "$g$ is not continuous", why: "one open set with non-open preimage is enough" }
      ], answer: "$g$ is not continuous." },
      { problem: "Show that a constant function $c:X\\to Y$ is continuous for any topological space $X$.", steps: [
        { do: "Take an open set $U\\subseteq Y$", result: "two cases", why: "the constant value is either in $U$ or not" },
        { do: "If the constant value lies in $U$", result: "$c^{-1}(U)=X$", why: "every input maps into $U$" },
        { do: "If the constant value does not lie in $U$", result: "$c^{-1}(U)=\\emptyset$", why: "no input maps into $U$" },
        { do: "Check openness", result: "$X$ and $\\emptyset$ are open", why: "topology axioms" },
        { do: "Conclude continuity", result: "constant functions are continuous", why: "every open preimage is open" }
      ], answer: "Every constant function is continuous." },
      { problem: "Let $X$ have the discrete topology. Explain why every function $f:X\\to Y$ is continuous.", steps: [
        { do: "Take an open set $U\\subseteq Y$", result: "$U$ is arbitrary", why: "continuity must hold for every open target set" },
        { do: "Form the preimage", result: "$f^{-1}(U)\\subseteq X$", why: "preimages are subsets of the domain" },
        { do: "Use discreteness", result: "$f^{-1}(U)$ is open", why: "every subset of $X$ is open" },
        { do: "Repeat for all $U$", result: "all open preimages are open", why: "the argument did not depend on $U$" },
        { do: "Conclude", result: "$f$ is continuous", why: "the open-preimage condition holds" }
      ], answer: "Every function from a discrete space is continuous." },
      { problem: "A model map $f(w)=3w-2$ sends weights to scores. Find the preimage of acceptable scores $(1,7)$ and interpret it.", steps: [
        { do: "Write the score condition", result: "$1<3w-2<7$", why: "acceptable scores lie in $(1,7)$" },
        { do: "Add $2$", result: "$3<3w<9$", why: "isolate the weight term" },
        { do: "Divide by $3$", result: "$1<w<3$", why: "positive division preserves inequalities" },
        { do: "Write the preimage", result: "$f^{-1}((1,7))=(1,3)$", why: "these weights produce acceptable scores" },
        { do: "Check openness", result: "open interval", why: "small weight changes remain acceptable inside the interval" }
      ], answer: "Acceptable scores correspond to weights $w\\in(1,3)$." }
    ],
    applications: [
      { title: "Neural networks with continuous activations", background: "Affine maps, sigmoid, tanh, and ReLU are continuous, and compositions of continuous maps remain continuous.", numbers: "For ReLU, inputs $-0.01,0,0.01$ give outputs $0,0,0.01$, with no jump at $0$." },
      { title: "Preimage decision regions", background: "Classifiers define score regions in output space; preimages show which inputs land there.", numbers: "For score $s(x)=2x+1$, the output range $(5,9)$ pulls back to inputs $(2,4)$." },
      { title: "Robustness to perturbations", background: "Continuity is the first mathematical reason small input changes should create small output changes, though it does not guarantee a large margin.", numbers: "If $f(x)=4x$, changing $x$ by $0.01$ changes output by $0.04$." },
      { title: "Loss surfaces", background: "Continuous losses allow optimization paths to be interpreted without jumps in objective value.", numbers: "For $L(w)=(w-2)^2$, moving from $w=2$ to $2.1$ changes loss from $0$ to $0.01$." },
      { title: "Data pipelines", background: "Some preprocessing maps are continuous, such as scaling; others, such as rounding, are not.", numbers: "Scaling $z=(x-100)/20$ maps the open band $(90,110)$ to $(-0.5,0.5)$." },
      { title: "Thresholding breaks continuity", background: "Hard decisions often introduce jumps, which can make gradient training difficult.", numbers: "A threshold at $0.7$ sends $0.699$ to $0$ and $0.701$ to $1$, a jump of $1$ from a change of $0.002$." }
    ],
    applicationsClose: "Continuity says open output demands pull back to open input freedoms, a compact idea that powers analysis and learning.",
    takeaways: [
      "A map is continuous when preimages of open sets are open.",
      "Use preimages, not images, in the definition.",
      "Continuity depends on the topologies chosen on domain and codomain.",
      "Compositions of continuous maps are continuous, which is why many model pipelines behave predictably."
    ]
  },

  "math-13-07": {
    id: "math-13-07",
    title: "Homeomorphisms",
    tagline: "A homeomorphism is a continuous, reversible reshaping that preserves topology exactly.",
    connections: {
      buildsOn: ["Continuity", "bijections", "inverse functions"],
      leadsTo: ["Connectedness", "Compactness", "topological invariants"],
      usedWith: ["equivalence relations", "subspace topology", "continuous maps"]
    },
    motivation:
      "<p>You already know that two formulas can describe the same line after a change of coordinates. Topology has a deeper version: two spaces can be the same shape even when their geometry looks different.</p>" +
      "<p>A <b>homeomorphism</b> is the official certificate of sameness. It is continuous, one-to-one, onto, and has a continuous inverse. That last condition matters: it prevents a map from crushing or gluing information together.</p>",
    definition:
      "<p>A function $f:X\\to Y$ is a <b>homeomorphism</b> if it is bijective, continuous, and its inverse $f^{-1}:Y\\to X$ is continuous. When such an $f$ exists, $X$ and $Y$ are <b>homeomorphic</b>, written informally as the same topological space.</p>" +
      "<p>Homeomorphisms preserve topological properties. If $X$ is connected, compact, or has one hole, then $Y$ has the corresponding property. But they do not preserve distances, angles, areas, or straightness.</p>" +
      "<p><b>Assumptions that matter:</b> bijective and continuous is not always enough unless the inverse is also continuous; the topologies on both spaces are part of the statement; and proving two spaces are not homeomorphic usually requires finding a topological invariant that differs.</p>",
    worked: {
      problem: "Show that $f:(0,1)\\to(2,5)$ given by $f(x)=3x+2$ is a homeomorphism.",
      skills: ["bijections", "inverse functions", "continuity"],
      strategy: "Prove the map is bijective, compute the inverse, and check both directions are continuous.",
      steps: [
        { do: "Check the range of $f$", result: "$0<x<1$ gives $2<3x+2<5$", why: "the formula lands in $(2,5)$" },
        { do: "Solve $y=3x+2$ for $x$", result: "$x=(y-2)/3$", why: "this gives the inverse formula" },
        { do: "Write the inverse", result: "$f^{-1}(y)=(y-2)/3$", why: "each output has exactly one input" },
        { do: "Check inverse lands in $(0,1)$", result: "$2<y<5$ gives $0<(y-2)/3<1$", why: "the inverse is well-defined" },
        { do: "Check continuity of $f$", result: "continuous", why: "linear functions are continuous" },
        { do: "Check continuity of $f^{-1}$", result: "continuous", why: "the inverse is also linear" }
      ],
      verify: "The map stretches by factor $3$ and shifts by $2$; it changes length but not interval topology.",
      answer: "$f$ is a homeomorphism from $(0,1)$ to $(2,5)$.",
      connects: "Homeomorphism is topology's equality sign for spaces."
    },
    practice: [
      { problem: "Show that $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x+7$, is a homeomorphism.", steps: [
        { do: "Check injectivity", result: "$x_1+7=x_2+7$ implies $x_1=x_2$", why: "subtract $7$" },
        { do: "Check surjectivity", result: "for any $y$, choose $x=y-7$", why: "$f(y-7)=y$" },
        { do: "Write the inverse", result: "$f^{-1}(y)=y-7$", why: "solve $y=x+7$" },
        { do: "Check continuity of $f$", result: "continuous", why: "linear function" },
        { do: "Check continuity of the inverse", result: "continuous", why: "also linear" }
      ], answer: "$f(x)=x+7$ is a homeomorphism of $\\mathbb{R}$ with itself." },
      { problem: "Show that $(0,1)$ and $\\mathbb{R}$ are homeomorphic using $f(x)=\\tan(\\pi(x-1/2))$.", steps: [
        { do: "Check endpoint behavior", result: "$x\\to0^+$ gives $f(x)\\to-\\infty$", why: "the angle approaches $-\\pi/2$" },
        { do: "Check the other endpoint", result: "$x\\to1^-$ gives $f(x)\\to\\infty$", why: "the angle approaches $\\pi/2$" },
        { do: "Use monotonicity", result: "one-to-one and onto $\\mathbb{R}$", why: "tangent increases across this interval" },
        { do: "Write inverse form", result: "$f^{-1}(y)=1/2+(1/\\pi)\\arctan y$", why: "solve using arctangent" },
        { do: "Check continuity", result: "both formulas are continuous", why: "tangent on the interval and arctangent are continuous" }
      ], answer: "The given $f$ is a homeomorphism from $(0,1)$ to $\\mathbb{R}$." },
      { problem: "Explain why $[0,1]$ and $(0,1)$ are not homeomorphic using compactness as an invariant.", steps: [
        { do: "State compactness of $[0,1]$", result: "compact", why: "closed and bounded in $\\mathbb{R}$" },
        { do: "State compactness of $(0,1)$", result: "not compact", why: "it is not closed and misses endpoint limits" },
        { do: "Recall invariant behavior", result: "homeomorphisms preserve compactness", why: "continuous images of compact spaces are compact" },
        { do: "Compare", result: "compact versus not compact", why: "the invariant differs" },
        { do: "Conclude", result: "not homeomorphic", why: "homeomorphic spaces cannot differ on compactness" }
      ], answer: "$[0,1]$ and $(0,1)$ are not homeomorphic." },
      { problem: "Show that a circle and an ellipse are homeomorphic by using a coordinate scaling idea.", steps: [
        { do: "Let the circle be $x^2+y^2=1$", result: "unit circle", why: "standard model" },
        { do: "Define a map", result: "$f(x,y)=(2x,3y)$", why: "scale horizontal and vertical coordinates" },
        { do: "Compute the image equation", result: "$(X/2)^2+(Y/3)^2=1$", why: "$X=2x$ and $Y=3y$" },
        { do: "Write the inverse", result: "$f^{-1}(X,Y)=(X/2,Y/3)$", why: "undo the scaling" },
        { do: "Check continuity", result: "both maps are continuous", why: "coordinate scaling is linear" }
      ], answer: "The unit circle and the ellipse $(X/2)^2+(Y/3)^2=1$ are homeomorphic." },
      { problem: "A learned embedding maps a one-dimensional interval by $f(t)=(2t,5t+1)$ for $0<t<1$. Show the embedded curve is homeomorphic to $(0,1)$.", steps: [
        { do: "Check continuity of $f$", result: "continuous", why: "each coordinate is linear in $t$" },
        { do: "Check injectivity", result: "$2t_1=2t_2$ implies $t_1=t_2$", why: "the first coordinate recovers $t$" },
        { do: "Define the inverse on the image", result: "$t=X/2$", why: "the first coordinate is $X=2t$" },
        { do: "Check inverse continuity", result: "continuous on the image", why: "coordinate projection and scaling are continuous" },
        { do: "Conclude", result: "homeomorphic to $(0,1)$", why: "the map is continuous, bijective onto its image, with continuous inverse" }
      ], answer: "The embedded curve is homeomorphic to $(0,1)$." }
    ],
    applications: [
      { title: "Data embeddings", background: "A good embedding may bend a manifold while preserving its topology. Homeomorphism is the ideal version of no tearing or gluing.", numbers: "Mapping $t\\in(0,1)$ to $(2t,5t+1)$ changes length scale but keeps one interval of points." },
      { title: "Shape matching", background: "Computer graphics distinguishes deformations that preserve topology from edits that cut holes or merge parts.", numbers: "Scaling a circle to an ellipse by factors $2$ and $3$ changes area from $\\pi$ to $6\\pi$ but preserves one loop." },
      { title: "Normalizing flows", background: "Some generative models use invertible continuous maps, close in spirit to homeomorphisms when inverse continuity holds.", numbers: "In one dimension, $y=2x+1$ changes density by scale factor $1/2$ under the inverse $x=(y-1)/2$." },
      { title: "Coordinate changes", background: "Physics and geometry often change coordinates without changing the underlying space. Homeomorphisms formalize safe coordinate replacement.", numbers: "The interval $(2,5)$ maps to $(0,1)$ by $(y-2)/3$, so $y=3.5$ maps to $0.5$." },
      { title: "Robotics configuration spaces", background: "Two parameterizations of the same motion space should be homeomorphic when they encode the same configurations.", numbers: "An angle interval $(-\\pi,\\pi)$ and $(-1,1)$ are homeomorphic by $x=\\theta/\\pi$." },
      { title: "Topology-preserving augmentation", background: "Image augmentation can stretch or warp objects while preserving labels when it does not alter topology.", numbers: "A $20\\times20$ circle stretched to width $30$ and height $15$ changes pixel geometry but should remain one connected object with one hole if it was a ring." }
    ],
    applicationsClose: "Homeomorphisms are the precise promise that a new representation changed coordinates, not topology.",
    takeaways: [
      "A homeomorphism is bijective, continuous, and has continuous inverse.",
      "Homeomorphic spaces share topological properties such as connectedness and compactness.",
      "Distances, lengths, angles, and areas need not be preserved.",
      "To prove non-homeomorphism, find a topological invariant that differs."
    ]
  },

  "math-13-08": {
    id: "math-13-08",
    title: "Connectedness",
    tagline: "Connectedness says a space is one piece, not separable into two disjoint open worlds.",
    connections: {
      buildsOn: ["Homeomorphisms", "Open and closed sets", "Subspace topology"],
      leadsTo: ["Compactness", "path connectedness", "topological data analysis"],
      usedWith: ["components", "intervals", "continuous images"]
    },
    motivation:
      "<p>You can see when a shape is in one piece. But topology asks for a definition that works even when the shape is abstract and no picture is available.</p>" +
      "<p><b>Connectedness</b> captures one-piece-ness. A connected space cannot be split into two nonempty pieces that are both open relative to the space. This simple idea powers clustering, intervals, path planning, and the Intermediate Value Theorem's deeper topology.</p>",
    definition:
      "<p>A topological space $X$ is <b>connected</b> if it cannot be written as $X=A\\cup B$ where $A$ and $B$ are nonempty, disjoint, and open in $X$. Such a split is called a separation. A <b>connected component</b> is a maximal connected subset.</p>" +
      "<p>Intervals in $\\mathbb{R}$ are connected. The union $(0,1)\\cup(2,3)$ is not connected because it is the union of two separated open pieces in the subspace topology. Continuous images of connected spaces are connected, which is why continuous curves do not jump into disconnected pieces.</p>" +
      "<p><b>Assumptions that matter:</b> openness is relative to the space being studied; connected does not always mean path connected in every topology; and component counts are preserved by homeomorphisms.</p>",
    worked: {
      problem: "Show that $X=(0,1)\\cup(2,3)$ is disconnected as a subspace of $\\mathbb{R}$.",
      skills: ["subspace openness", "separations", "intervals"],
      strategy: "Exhibit two nonempty disjoint open subsets whose union is the whole subspace.",
      steps: [
        { do: "Define the first piece", result: "$A=(0,1)$", why: "one interval component of $X$" },
        { do: "Define the second piece", result: "$B=(2,3)$", why: "the other interval component of $X$" },
        { do: "Check nonempty", result: "$0.5\\in A$ and $2.5\\in B$", why: "both pieces contain points" },
        { do: "Check disjointness", result: "$A\\cap B=\\emptyset$", why: "no number is both between $0,1$ and $2,3$" },
        { do: "Check union", result: "$A\\cup B=X$", why: "these are exactly the two pieces of $X$" },
        { do: "Check relative openness", result: "$A$ and $B$ are open in $X$", why: "each is an intersection of $X$ with an open set of $\\mathbb{R}$" }
      ],
      verify: "The gap from $1$ to $2$ prevents any continuous movement inside $X$ from one piece to the other.",
      answer: "$X$ is disconnected, with separation $(0,1)$ and $(2,3)$.",
      connects: "Disconnected means the space can be separated into two open, nonempty, noncommunicating pieces."
    },
    practice: [
      { problem: "Explain why $[0,1]$ is connected in the usual topology on $\\mathbb{R}$.", steps: [
        { do: "Recognize the set", result: "$[0,1]$ is an interval", why: "it contains every point between any two of its points" },
        { do: "Recall the theorem", result: "intervals in $\\mathbb{R}$ are connected", why: "a separation would create a missing cut point" },
        { do: "Test the intuition", result: "between $0.2$ and $0.8$ lies $0.5$", why: "no gap appears inside the interval" },
        { do: "Compare with a separated union", result: "no gap like $(1,2)$ is removed", why: "removed gaps cause disconnection" },
        { do: "Conclude", result: "connected", why: "the interval is one piece" }
      ], answer: "$[0,1]$ is connected." },
      { problem: "Find the connected components of $X=\\{0\\}\\cup[2,4]$ in $\\mathbb{R}$.", steps: [
        { do: "Identify isolated point", result: "$\\{0\\}$", why: "there is a gap between $0$ and $2$" },
        { do: "Identify interval piece", result: "$[2,4]$", why: "closed intervals are connected" },
        { do: "Check separation", result: "$X=\\{0\\}\\cup[2,4]$", why: "these pieces cover $X$" },
        { do: "Check disjointness", result: "$\\{0\\}\\cap[2,4]=\\emptyset$", why: "$0$ is not in $[2,4]$" },
        { do: "State maximal connected pieces", result: "$\\{0\\}$ and $[2,4]$", why: "neither can be enlarged across the gap" }
      ], answer: "The connected components are $\\{0\\}$ and $[2,4]$." },
      { problem: "Use connectedness to show there is no homeomorphism from $(0,1)$ to $(0,1)\\cup(2,3)$.", steps: [
        { do: "Classify $(0,1)$", result: "connected", why: "it is an interval" },
        { do: "Classify $(0,1)\\cup(2,3)$", result: "disconnected", why: "it splits into two open interval pieces" },
        { do: "Recall invariant", result: "homeomorphisms preserve connectedness", why: "continuous reversible maps preserve separations" },
        { do: "Compare invariant values", result: "connected versus disconnected", why: "the spaces differ" },
        { do: "Conclude", result: "no homeomorphism exists", why: "a topological invariant disagrees" }
      ], answer: "They are not homeomorphic because one is connected and the other is disconnected." },
      { problem: "If $f:[0,1]\\to\\mathbb{R}$ is continuous with $f(0)=-2$ and $f(1)=3$, explain why $f([0,1])$ is connected and contains $0$.", steps: [
        { do: "Classify the domain", result: "$[0,1]$ is connected", why: "intervals are connected" },
        { do: "Use continuous image theorem", result: "$f([0,1])$ is connected", why: "continuous images preserve connectedness" },
        { do: "Use real-line connected sets", result: "$f([0,1])$ is an interval", why: "connected subsets of $\\mathbb{R}$ are intervals" },
        { do: "Compare endpoint values", result: "$-2<0<3$", why: "zero lies between the image values" },
        { do: "Conclude", result: "$0\\in f([0,1])$", why: "an interval containing $-2$ and $3$ contains all between" }
      ], answer: "$f([0,1])$ is connected and contains $0$." },
      { problem: "A point cloud graph has edges connecting points within distance $1$. If components have sizes $12$, $5$, and $8$, how many connected components does the graph have and what fraction is in the largest one?", steps: [
        { do: "Count the listed components", result: "$3$", why: "three component sizes are given" },
        { do: "Find total points", result: "$12+5+8=25$", why: "sum component sizes" },
        { do: "Find largest component", result: "$12$", why: "$12$ is greater than $8$ and $5$" },
        { do: "Compute fraction", result: "$12/25=0.48$", why: "largest divided by total" },
        { do: "Convert to percent", result: "$48\\%$", why: "$0.48\\cdot100=48$" }
      ], answer: "There are $3$ connected components, and the largest contains $48\\%$ of the points." }
    ],
    applications: [
      { title: "Clustering as components", background: "Graph-based clustering connects nearby points and reads clusters as connected components.", numbers: "If an epsilon graph has component sizes $12$, $5$, and $8$, it has $3$ clusters and $25$ total points." },
      { title: "Image segmentation", background: "Connected-component labeling finds contiguous foreground regions in binary images.", numbers: "A mask with blobs of $40$, $70$, and $15$ pixels has $3$ components; the largest has $70$ pixels." },
      { title: "Path planning", background: "Robotics checks whether start and goal lie in the same connected free-space component.", numbers: "If free-space components have areas $12$ m$^2$ and $5$ m$^2$, start in the first and goal in the second means no path without crossing an obstacle." },
      { title: "Neural activation regions", background: "Decision regions can split into multiple connected pieces, which affects interpretability and robustness.", numbers: "A class region with $4$ disconnected islands in a $2$D slice can be hit by four separated input neighborhoods." },
      { title: "A/B experiment funnels", background: "User journey graphs can be analyzed by reachability components to find disconnected product flows.", numbers: "If $10000$ users split into reachable groups of $8000$ and $2000$, then $20\\%$ are in the smaller disconnected flow." },
      { title: "Persistent connectedness", background: "Topological data analysis tracks how components merge as neighborhood radius grows.", numbers: "If components drop from $10$ at radius $0.1$ to $3$ at radius $0.5$ to $1$ at radius $1.0$, seven merges happened before $0.5$." }
    ],
    applicationsClose: "Connectedness is one-piece structure, whether that piece is an interval, an image blob, a graph cluster, or a free-motion region.",
    takeaways: [
      "A connected space cannot be split into two nonempty disjoint open subsets.",
      "Intervals in $\\mathbb{R}$ are connected; separated unions are not.",
      "Continuous images of connected spaces are connected.",
      "Connected components are maximal connected pieces and are useful cluster-like summaries."
    ]
  },

  "math-13-09": {
    id: "math-13-09",
    title: "Compactness",
    tagline: "Compactness is the topological version of finite control over an infinite set.",
    connections: {
      buildsOn: ["Connectedness", "Open and closed sets", "Subspace topology"],
      leadsTo: ["uniform continuity", "existence of optima", "topological data analysis"],
      usedWith: ["open covers", "closed and bounded sets", "continuous functions"]
    },
    motivation:
      "<p>You already trust closed intervals like $[0,1]$ more than open intervals like $(0,1)$. A continuous function on $[0,1]$ reaches a maximum and minimum; on $(0,1)$ it might keep chasing an endpoint it never reaches.</p>" +
      "<p><b>Compactness</b> is the reason. It says that whenever open sets cover the space, finitely many already cover it. That sounds abstract, but it is the engine behind existence theorems, finite approximations, and stable optimization on bounded feasible regions.</p>",
    definition:
      "<p>A topological space $X$ is <b>compact</b> if every open cover of $X$ has a finite subcover. An open cover is a collection of open sets whose union contains $X$. In $\\mathbb{R}^n$ with the usual topology, the Heine-Borel theorem says compact sets are exactly the closed and bounded sets.</p>" +
      "<p>Compactness turns infinite checking into finite checking. If infinitely many local neighborhoods cover a compact space, some finite selection already does the job. Continuous functions preserve compactness: if $X$ is compact and $f:X\\to Y$ is continuous, then $f(X)$ is compact.</p>" +
      "<p><b>Assumptions that matter:</b> closed and bounded characterizes compactness in Euclidean spaces, not in every topology; the cover sets must be open in the relevant space; and compactness is stronger than boundedness alone.</p>",
    worked: {
      problem: "Use Heine-Borel to decide whether $[0,1]$, $(0,1)$, and $[0,\\infty)$ are compact in $\\mathbb{R}$.",
      skills: ["closed and bounded", "Euclidean compactness", "intervals"],
      strategy: "In $\\mathbb{R}$, check closedness and boundedness for each interval.",
      steps: [
        { do: "Check $[0,1]$ for closedness", result: "closed", why: "it contains both endpoints" },
        { do: "Check $[0,1]$ for boundedness", result: "bounded", why: "all points lie between $0$ and $1$" },
        { do: "Classify $[0,1]$", result: "compact", why: "closed and bounded in $\\mathbb{R}$" },
        { do: "Check $(0,1)$", result: "bounded but not closed", why: "it misses endpoint limits $0$ and $1$" },
        { do: "Classify $(0,1)$", result: "not compact", why: "both closed and bounded are required in $\\mathbb{R}$" },
        { do: "Check $[0,\\infty)$", result: "closed but not bounded", why: "values grow without an upper bound" },
        { do: "Classify $[0,\\infty)$", result: "not compact", why: "boundedness fails" }
      ],
      verify: "The open interval can chase endpoints, and the ray can chase infinity; neither has the finite-control behavior of $[0,1]$.",
      answer: "$[0,1]$ is compact; $(0,1)$ and $[0,\\infty)$ are not compact in $\\mathbb{R}$.",
      connects: "Compactness makes closed bounded Euclidean sets behave like finite spaces for many purposes."
    },
    practice: [
      { problem: "Decide whether $[-2,5]$ is compact in $\\mathbb{R}$.", steps: [
        { do: "Check closedness", result: "closed", why: "the interval includes endpoints $-2$ and $5$" },
        { do: "Check lower bound", result: "$x\\ge-2$", why: "no point goes below $-2$" },
        { do: "Check upper bound", result: "$x\\le5$", why: "no point goes above $5$" },
        { do: "State boundedness", result: "bounded", why: "both lower and upper bounds exist" },
        { do: "Apply Heine-Borel", result: "compact", why: "closed and bounded in $\\mathbb{R}$" }
      ], answer: "$[-2,5]$ is compact." },
      { problem: "Decide whether $(0,1]$ is compact in $\\mathbb{R}$.", steps: [
        { do: "Check boundedness", result: "bounded", why: "all points lie between $0$ and $1$" },
        { do: "Check endpoint $1$", result: "included", why: "right bracket includes it" },
        { do: "Check endpoint $0$", result: "not included", why: "left parenthesis excludes it" },
        { do: "State closedness", result: "not closed", why: "the sequence $1/n$ lies in the set and converges to $0$" },
        { do: "Apply Heine-Borel", result: "not compact", why: "closedness fails" }
      ], answer: "$(0,1]$ is not compact in $\\mathbb{R}$." },
      { problem: "Decide whether the closed disk $D=\\{(x,y):x^2+y^2\\le4\\}$ is compact in $\\mathbb{R}^2$.", steps: [
        { do: "Read the radius", result: "$2$", why: "$x^2+y^2\\le4$ means distance from the origin is at most $2$" },
        { do: "Check boundedness", result: "bounded", why: "all points lie within radius $2$" },
        { do: "Check closedness", result: "closed", why: "the inequality $\\le4$ includes the boundary circle" },
        { do: "Apply Heine-Borel in $\\mathbb{R}^2$", result: "compact", why: "closed and bounded subsets of Euclidean space are compact" },
        { do: "Note the boundary", result: "$x^2+y^2=4$ is included", why: "this is essential for closedness" }
      ], answer: "The closed disk is compact." },
      { problem: "A continuous loss $L$ on compact set $K=[0,1]$ has values $L(0)=3$, $L(0.5)=1$, and $L(1)=2$. What does compactness guarantee beyond these samples?", steps: [
        { do: "Classify $K$", result: "compact", why: "$[0,1]$ is closed and bounded" },
        { do: "Use continuity", result: "$L(K)$ is compact in $\\mathbb{R}$", why: "continuous images of compact spaces are compact" },
        { do: "Translate compact image", result: "$L(K)$ is closed and bounded", why: "Heine-Borel in $\\mathbb{R}$" },
        { do: "State extreme value theorem", result: "a minimum and maximum are attained", why: "continuous functions on compact domains reach extrema" },
        { do: "Use samples carefully", result: "minimum is at most $1$ and maximum is at least $3$", why: "sampled values are included but may not be extreme" }
      ], answer: "Compactness guarantees that $L$ attains a global minimum and maximum on $[0,1]$." },
      { problem: "For a finite dataset of $100$ points with the discrete topology, explain why it is compact by using an open cover.", steps: [
        { do: "Take any open cover", result: "each of the $100$ points is covered", why: "cover means every point lies in some open set" },
        { do: "Choose one cover set for point $1$", result: "one selected set", why: "point $1$ must be covered" },
        { do: "Repeat for all points", result: "at most $100$ selected sets", why: "choose one set per point" },
        { do: "Check coverage", result: "selected sets cover all points", why: "each point's selected set contains it" },
        { do: "Conclude compactness", result: "finite subcover exists", why: "the chosen subcover has at most $100$ sets" }
      ], answer: "Every finite dataset is compact; here any cover has a subcover of at most $100$ sets." }
    ],
    applications: [
      { title: "Existence of optimal parameters", background: "If a feasible parameter set is compact and the loss is continuous, a global minimizer exists. This is a foundational comfort in optimization.", numbers: "For $w\\in[-10,10]$ and $L(w)=(w-3)^2$, the minimum $0$ is attained at $w=3$." },
      { title: "Grid approximation", background: "Compact domains can often be approximated by finite grids because there is no escaping to infinity or missing endpoint.", numbers: "A $[0,1]^2$ square sampled every $0.01$ has $101\\cdot101=10201$ grid points." },
      { title: "Bounded activations", background: "Compact input ranges lead to bounded continuous outputs, helping with numerical guarantees.", numbers: "If $x\\in[-2,2]$ and $f(x)=e^x$, outputs lie in $[e^{-2},e^2]\\approx[0.135,7.389]$." },
      { title: "Finite subcovers in sensing", background: "Sensor coverage problems often ask whether finitely many sensing regions cover a compact area.", numbers: "A $10$ m by $10$ m square area is compact; a grid of $25$ sensors with $2.5$ m spacing is a finite coverage candidate." },
      { title: "Model robustness certificates", background: "Verification over a compact perturbation set can reduce to finite or bounded checks under continuity assumptions.", numbers: "An $\\ell_\\infty$ perturbation box $[-0.03,0.03]^{784}$ is closed and bounded in $\\mathbb{R}^{784}$, hence compact." },
      { title: "Persistent homology filtrations", background: "Topological data analysis often restricts to finite point clouds or compact domains so features can be computed and controlled.", numbers: "A finite cloud of $500$ points is compact; a filtration with $20$ radius values gives at most $20$ recorded stages per feature." }
    ],
    applicationsClose: "Compactness is finite reliability in an infinite-looking world: covers become finite, continuous images stay controlled, and optima are attained.",
    takeaways: [
      "Compact means every open cover has a finite subcover.",
      "In $\\mathbb{R}^n$, compact is equivalent to closed and bounded.",
      "Continuous images of compact spaces are compact.",
      "Continuous real-valued functions on compact sets attain maxima and minima."
    ]
  }
};
