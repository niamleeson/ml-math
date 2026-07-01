module.exports = {
  "math-13-01": {
    connectionsProse:
      "<p>Topology begins after the reader already has some geometric language for points, distances, curves, and regions. Instead of asking for exact lengths or angles, it asks which qualitative features remain stable under continuous change. This makes it a natural bridge from geometry to modern data analysis, where the exact coordinates of a representation may shift while components, loops, and neighborhoods remain meaningful.</p>" +
      "<p>The lesson prepares the vocabulary used throughout the section. Open sets, continuity, compactness, homology, and persistence all depend on the same basic habit: separate metric facts from topological facts. That distinction helps explain why two embeddings can have very different distances but still describe the same underlying shape.</p>",
    motivation:
      "<p>Topology studies the parts of shape that survive stretching, bending, and continuous deformation. A circle drawn large or small is still one connected loop, and a coffee-cup-like surface and a torus-like surface can share the same kind of hole even if their measurements are different. The point is not that measurement is unimportant; it is that some questions are better answered before committing to a particular ruler.</p>" +
      "<p>This is useful in machine learning because learned representations often change under scaling, rotation, nonlinear embedding, or feature preprocessing. A classifier may care that data has two separated clusters, a trajectory may care that an obstacle creates a hole, and TDA may care that a loop persists across several scales. Topology supplies the language for those stable features: connected pieces, holes, neighborhoods, and invariants.</p>",
    definition:
      "<p>Topology distinguishes qualitative shape properties from numerical metric properties.</p>" +
      "<p><b>Assumptions that matter:</b> the lesson separates topological facts, such as components and holes, from metric facts, such as exact distances and angles.</p>",
    symbols: [
      { sym: "$X$", desc: "a space" },
      { sym: "$d(x,y)$", desc: "a distance when one is available" },
      { sym: "homeomorphism", desc: "the kind of continuous reversible deformation that preserves topology" }
    ],
    applications: [
      { title: "Component clustering", background: "Separated groups define topological pieces.", numbers: "groups of $40$ and $60$ separated by a gap give component count $2$." },
      { title: "Persistence", background: "A loop can be tracked across scale.", numbers: "a loop born at radius $0.3$ and dying at $1.1$ has lifetime $0.8$." },
      { title: "Digit holes", background: "Topology can distinguish enclosed regions in digit shapes.", numbers: "$8$ has $2$ holes, $0$ has $1$." },
      { title: "Robotics", background: "Obstacles change the topology of navigable space.", numbers: "one circular obstacle in a square creates one obstacle hole." },
      { title: "Representation geometry", background: "Scaling changes distances without changing loops.", numbers: "scaling a ring embedding by $3$ changes distances but keeps one loop." },
      { title: "Mesh QA", background: "Component counts can reveal broken geometry.", numbers: "a torus-like mesh changing from $1$ component to $2$ signals a tear." }
    ]
  },
  "math-13-02": {
    connectionsProse:
      "<p>The first lesson separated topological information from metric information. A topological space is the formal structure that makes that separation possible. It starts with a set of points and adds only the information needed to say which subsets count as open.</p>" +
      "<p>This definition supports the rest of the section. Once the open sets are chosen, closed sets, continuity, connectedness, compactness, and subspaces all become precise. The same underlying set can carry different topologies, so the topology is part of the mathematical model, not an afterthought.</p>",
    motivation:
      "<p>A topological space is a set together with a rule for which subsets count as open. In familiar Euclidean space, open intervals and open balls supply that rule, but topology allows more general rules. The important part is that the rule is consistent enough for unions and finite intersections of open sets to behave the way neighborhoods should behave.</p>" +
      "<p>This lets mathematics talk about nearness without always assigning a numerical distance. In data settings, a neighborhood may come from cosine similarity, graph adjacency, a thresholded score, or a learned representation. Once a topology is fixed, words like near, continuous, closed, connected, and compact have precise meanings inside that chosen structure.</p>",
    definition:
      "<p>A <b>topological space</b> consists of an underlying set and a collection of subsets declared to be open, satisfying the topology axioms.</p>" +
      "<p><b>Assumptions that matter:</b> the open sets must include the empty set and whole space, be closed under arbitrary unions, and be closed under finite intersections.</p>",
    symbols: [
      { sym: "$X$", desc: "the underlying set" },
      { sym: "$\\tau$", desc: "the collection of open subsets" },
      { sym: "$\\emptyset$", desc: "the empty set" },
      { sym: "$(X,\\tau)$", desc: "the topological space" }
    ],
    applications: [
      { title: "Finite spaces", background: "The discrete topology contains every subset.", numbers: "for $X=\\{a,b,c\\}$, the discrete topology has $2^3=8$ open sets." },
      { title: "Coarsest topology", background: "The indiscrete topology keeps only the required open sets.", numbers: "the indiscrete topology has exactly $2$ open sets, $\\emptyset$ and $X$." },
      { title: "Metric neighborhoods", background: "Open balls define familiar neighborhoods in $\\mathbb R$.", numbers: "the ball of radius $0.1$ around $2$ in $\\mathbb R$ is $(1.9,2.1)$." },
      { title: "Cosine neighborhoods", background: "Changing the threshold changes the neighborhood size.", numbers: "a threshold $0.8$ may give $47$ neighbors where $0.9$ gives $12$." },
      { title: "Parameter spaces", background: "A local Lipschitz estimate controls loss changes near a parameter.", numbers: "if $\\|\\Delta w\\|=0.01$ and a local Lipschitz constant is $5$, loss changes by at most $0.05$." },
      { title: "Distribution convergence", background: "A sequence of means can approach a limiting value.", numbers: "means $1,1.5,1.75,1.875$ are within $0.125$ of $2$ by the fourth value." }
    ]
  },
  "math-13-03": {
    connectionsProse:
      "<p>Open and closed sets are the first working tools inside a topological space. The previous lesson defined a topology by declaring which subsets are open. This lesson explains the paired idea: closed sets are defined by open complements.</p>" +
      "<p>The distinction is central for later lessons on continuity, compactness, and feasible regions. Open sets describe room to move locally, while closed sets describe including the limits that sequences or paths approach. Many ML constraints and safety thresholds are naturally closed because the boundary value is allowed.</p>",
    motivation:
      "<p>Open sets give points room to move inside the set. If a point lies in an open interval, a small enough wiggle keeps the point inside that interval. This is the local picture behind neighborhoods, local perturbations, and continuity checks.</p>" +
      "<p>Closed sets include the boundary points they are supposed to limit toward. The interval $[0,1]$ contains $0$ and $1$, so a sequence such as $0.9,0.99,0.999$ approaches a point still inside the set. In optimization and safety constraints, this matters because the best or limiting value may occur exactly on the boundary.</p>",
    definition:
      "<p>A set $F$ is <b>closed</b> in an ambient space $X$ when its complement $X\\setminus F$ is open.</p>" +
      "<p><b>Assumptions that matter:</b> closedness is defined relative to an ambient space $X$, so complements are always taken inside that space.</p>",
    symbols: [
      { sym: "$U$", desc: "an open set" },
      { sym: "$F$", desc: "a closed set" },
      { sym: "$X\\setminus F$", desc: "the complement of $F$ inside the ambient space $X$" }
    ],
    derivation: [
      { do: "In a space $X$, define $F$ to be closed when $X\\setminus F$ is open", result: "$F$ is closed $\\Longleftrightarrow X\\setminus F$ is open", why: "this is the general topological definition" },
      { do: "If $U$ is open, set $F=X\\setminus U$", result: "$X\\setminus F=X\\setminus(X\\setminus U)=U$", why: "this computes the complement of the complement" },
      { do: "Use the fact that $U$ is open", result: "$F$ is closed", why: "closed sets are exactly complements of open sets" },
      { do: "Start with $F$ closed", result: "$X\\setminus F$ is open", why: "this is the definition of closed" },
      { do: "Compare $(0,1)$ in $\\mathbb R$ with its limit points", result: "$(0,1)$ is open but not closed", why: "$0$ and $1$ are missing limit points" },
      { do: "Compute the complement of $[0,1]$ in $\\mathbb R$", result: "$(-\\infty,0)\\cup(1,\\infty)$ is open", why: "therefore $[0,1]$ is closed" }
    ],
    applications: [
      { title: "Feasible weights", background: "Boundary-inclusive constraints are closed.", numbers: "$0\\le w\\le1$ is closed; $0.9,0.99,0.999\\to1$ stays feasible." },
      { title: "Local gradients", background: "An open radius around a parameter gives room to move.", numbers: "radius $0.1$ around $w=2$ gives $(1.9,2.1)$." },
      { title: "Thresholds", background: "Including the decision threshold produces a closed interval inside the score range.", numbers: "accept scores $s\\ge0.7$ form $[0.7,1]$ inside $[0,1]$." },
      { title: "Image disks", background: "A closed disk includes its boundary pixels continuously.", numbers: "$r\\le10$ includes boundary and has area about $314$ pixels continuously." },
      { title: "Latency safety", background: "A safety constraint can include its limiting value.", numbers: "$L\\le100$ ms includes the limit $100$." },
      { title: "Closed balls", background: "Open and closed balls differ on the boundary.", numbers: "distance $5.0$ is outside the open radius-$5$ ball but inside the closed one." }
    ]
  },
  "math-13-04": {
    connectionsProse:
      "<p>Open sets can be large and complicated, but many topologies are generated from simpler local pieces. In the usual topology on the real line, open intervals are enough to describe every open set. A basis formalizes that kind of smaller vocabulary.</p>" +
      "<p>This lesson connects directly to metric balls, product spaces, local explanations, and manifold charts. Instead of listing every open set, one can describe a manageable family of basic neighborhoods. Later continuity and subspace arguments become easier because they can often be checked locally on basis elements.</p>",
    motivation:
      "<p>A basis is a small vocabulary of open pieces from which every open set is built by unions. Each point in an open set should sit inside some basic open piece that still remains inside the open set. This is the topological version of saying that local descriptions are enough to reconstruct the global open-set structure.</p>" +
      "<p>The overlap condition is what makes the vocabulary coherent. If a point lies in two basic neighborhoods, there should be a smaller basic neighborhood around that point lying inside their overlap. For intervals and balls this matches geometric intuition: when two neighborhoods overlap around a point, a sufficiently small neighborhood still fits inside both.</p>",
    definition:
      "<p>A <b>basis</b> is a collection of basic open sets whose unions define the open sets of a topology.</p>" +
      "<p><b>Assumptions that matter:</b> a basis must cover the space and must have compatible overlaps so that unions of basis elements define a topology.</p>",
    symbols: [
      { sym: "$\\mathcal B$", desc: "the basis" },
      { sym: "$B_1,B_2,B_3$", desc: "basic open sets" },
      { sym: "$U$", desc: "an open set generated as a union of basis elements" }
    ],
    applications: [
      { title: "Euclidean balls", background: "Metric balls serve as basic neighborhoods.", numbers: "$(1.9,2.1)$ is a radius-$0.1$ basic neighborhood of $2$." },
      { title: "Vision patches", background: "Image patches provide local pieces for a larger input.", numbers: "a $224\\times224$ image with $16\\times16$ patches has $14\\cdot14=196$ patches." },
      { title: "Product tolerances", background: "Independent feature tolerances form a rectangle.", numbers: "age within $\\pm2$ and income within $\\pm5000$ gives a rectangle of width $4$ by $10000$." },
      { title: "Local explanations", background: "Binary feature perturbations enumerate local variants.", numbers: "$10$ binary features have $2^{10}=1024$ local variants." },
      { title: "Range queries", background: "Feature intervals combine into a basic rectangle.", numbers: "price $(10,20)$ and rating $(4,5)$ form one basic rectangle in two features." },
      { title: "Manifold charts", background: "A small set of charts can describe a curved surface locally.", numbers: "two stereographic charts cover a sphere while each chart looks locally like $\\mathbb R^2$." }
    ]
  },
  "math-13-05": {
    connectionsProse:
      "<p>Many spaces are studied as parts of larger spaces. A circle sits inside the plane, a probability simplex sits inside Euclidean space, and a feasible interval may sit inside the real line. The subspace topology explains how the smaller space inherits openness from the larger one.</p>" +
      "<p>This is especially important when boundaries become part of the world being studied. A set that is not open in the full real line can be open relative to a constrained interval. That relative viewpoint is used repeatedly in constraints, manifolds, cohorts, and data subsets.</p>",
    motivation:
      "<p>A subspace inherits nearness from a larger space but only keeps points that belong to the smaller set. To find an open set in the subspace, start with an open set in the ambient space and intersect it with the subspace. The result may look cut off from the outside, but from inside the subspace it behaves like an open neighborhood.</p>" +
      "<p>Endpoints can behave differently when the endpoint lies inside the whole universe being studied. In $[0,1]$, a neighborhood of $0$ can look like $[0,0.2)$ because points below $0$ are not part of the subspace. This is the same logic behind feasible regions and manifolds: local neighborhoods are judged relative to the space where the problem actually lives.</p>",
    definition:
      "<p>For a subset $Y\\subseteq X$ of a topological space $(X,\\tau)$, the <b>subspace topology</b> is $$\\tau_Y=\\{Y\\cap U:U\\in\\tau\\}.$$</p>" +
      "<p><b>Assumptions that matter:</b> openness in $Y$ is inherited from the ambient space by intersection with $Y$.</p>",
    symbols: [
      { sym: "$Y$", desc: "the subspace" },
      { sym: "$\\tau_Y$", desc: "its inherited topology" },
      { sym: "$U$", desc: "open in the ambient space" },
      { sym: "$V=Y\\cap U$", desc: "open relative to $Y$" }
    ],
    derivation: [
      { do: "Let $(X,\\tau)$ be a topological space and $Y\\subseteq X$", result: "$\\tau_Y=\\{Y\\cap U:U\\in\\tau\\}$", why: "this defines the inherited open sets" },
      { do: "Intersect $Y$ with the empty set and with $X$", result: "$\\emptyset=Y\\cap\\emptyset$ and $Y=Y\\cap X$", why: "the empty set and whole subspace must be open in $Y$" },
      { do: "Take a family of subspace-open sets $Y\\cap U_i$", result: "$\\bigcup_i(Y\\cap U_i)=Y\\cap(\\bigcup_i U_i)$", why: "union distributes over intersection" },
      { do: "Use openness of $\\bigcup_i U_i$ in $X$", result: "$Y\\cap(\\bigcup_i U_i)\\in\\tau_Y$", why: "arbitrary unions are preserved" },
      { do: "Take finitely many subspace-open sets", result: "$(Y\\cap U_1)\\cap\\cdots\\cap(Y\\cap U_n)=Y\\cap(U_1\\cap\\cdots\\cap U_n)$", why: "finite intersections distribute over the common subspace" },
      { do: "Use openness of finite intersections in $X$", result: "$Y\\cap(U_1\\cap\\cdots\\cap U_n)\\in\\tau_Y$", why: "finite intersections are open in $Y$, so $\\tau_Y$ is a topology" }
    ],
    applications: [
      { title: "Relative feasibility", background: "A half-open-looking set can be open relative to its feasible universe.", numbers: "inside $[0,1]$, $[0,0.2)$ equals $[0,1]\\cap(-0.1,0.2)$ and is open in the subspace." },
      { title: "Manifold data", background: "Ambient balls intersected with a manifold give relative neighborhoods.", numbers: "a radius-$0.1$ disk intersected with a circle gives a small arc neighborhood." },
      { title: "Probability simplex", background: "Probabilities live in a lower-dimensional subspace of Euclidean coordinates.", numbers: "$3$ class probabilities form a $2$D triangle in $\\mathbb R^3$." },
      { title: "Road networks", background: "Neighborhoods along roads are inherited from the network, not the whole plane.", numbers: "a path with $20$ road nodes inherits neighborhoods along edges, not all nearby plane points." },
      { title: "Learning rates", background: "The endpoint of a constrained interval has relative neighborhoods.", numbers: "near $\\eta=0$ in $[0,1]$, $[0,0.01)$ is a relative neighborhood." },
      { title: "Cohorts", background: "Age ranges can be open relative to a cohort window.", numbers: "ages $[30,32)$ inside $[30,40]$ equal $[30,40]\\cap(29,32)$." }
    ]
  },
  "math-13-06": {
    connectionsProse:
      "<p>Continuity is where open sets begin to control functions. Earlier lessons defined open sets, closed sets, bases, and subspaces. This lesson uses those ideas to say that a function respects the topology of its domain and codomain.</p>" +
      "<p>The open-preimage definition is more flexible than the calculus definition based on graphs. It works for metric spaces, subspaces, quotient spaces, and many ML maps. A continuous score map can transform neighborhoods without tearing them into sudden jumps before a later thresholding step.</p>",
    motivation:
      "<p>Continuity means open output requirements pull back to open input requirements. If an output must land in a desired open band, the inputs that achieve that requirement should form an open set in the domain. This captures the idea that small-enough input changes can keep the output within a chosen tolerance.</p>" +
      "<p>In ML language, a continuous score map has decision-score bands whose preimages are topologically well behaved before hard thresholding. The hard threshold may introduce a jump, but the underlying score function can still be continuous. The affine example shows the mechanism directly: solving the output interval inequality produces another open interval in the input.</p>",
    definition:
      "<p>A map $f:X\\to Y$ is <b>continuous</b> when every open set in $Y$ has an open preimage in $X$.</p>" +
      "<p><b>Assumptions that matter:</b> the domain and codomain topologies determine what counts as open, and continuity is checked by preimages.</p>",
    symbols: [
      { sym: "$f:X\\to Y$", desc: "the map" },
      { sym: "$f^{-1}(U)$", desc: "the preimage of output set $U$" },
      { sym: "$\\tau_X,\\tau_Y$", desc: "the domain and codomain topologies" }
    ],
    derivation: [
      { do: "Let $f(x)=2x+1$ and take an open output interval $(a,b)$", result: "continuity can be checked by preimages of open intervals", why: "open intervals generate the usual topology on $\\mathbb R$" },
      { do: "Solve $a<2x+1<b$", result: "$a<2x+1<b$", why: "this states exactly which inputs land in the output interval" },
      { do: "Subtract $1$", result: "$a-1<2x<b-1$", why: "subtracting preserves the inequality" },
      { do: "Divide by $2>0$", result: "$(a-1)/2<x<(b-1)/2$", why: "division by a positive number preserves the inequality direction" },
      { do: "Write the preimage", result: "$f^{-1}((a,b))=((a-1)/2,(b-1)/2)$", why: "the solved inequality describes exactly the input set" },
      { do: "Use that the preimage is an open interval", result: "$f$ is continuous", why: "open intervals generate the usual topology on $\\mathbb R$" }
    ],
    applications: [
      { title: "Score bands", background: "An affine score band pulls back to an input interval.", numbers: "for $s(x)=2x+1$, output band $(5,9)$ pulls back to $(2,4)$." },
      { title: "ReLU", background: "The ReLU function has no jump at zero.", numbers: "inputs $-0.01,0,0.01$ produce $0,0,0.01$ with no jump." },
      { title: "Robust scaling", background: "A scaling map changes perturbation sizes predictably.", numbers: "$f(x)=4x$ changes by $0.04$ when $x$ changes by $0.01$." },
      { title: "Loss paths", background: "A continuous quadratic loss changes gradually near its minimum.", numbers: "$L(w)=(w-2)^2$ changes from $0$ to $0.01$ at $w=2.1$." },
      { title: "Preprocessing", background: "Standardization maps input intervals to output intervals.", numbers: "$z=(x-100)/20$ maps $(90,110)$ to $(-0.5,0.5)$." },
      { title: "Thresholding", background: "Hard labels can jump even when underlying scores vary slightly.", numbers: "$0.699$ and $0.701$ can map to labels $0$ and $1$, a jump of $1$ from input change $0.002$." }
    ]
  },
  "math-13-07": {
    connectionsProse:
      "<p>Continuity says a function respects open-set structure in one direction. A homeomorphism asks for continuous structure in both directions. It is the topology-level notion of two spaces being the same shape.</p>" +
      "<p>This lesson clarifies what topology preserves and what it intentionally ignores. Lengths, angles, and areas may change under a homeomorphism, but connectedness, compactness, and holes are preserved. That distinction supports later lessons on quotient spaces, homotopy, and topology-preserving transformations of embeddings.</p>",
    motivation:
      "<p>A homeomorphism is a continuous reversible reshaping. The function must be bijective, continuous, and have a continuous inverse. The inverse condition matters because a map can be one-to-one and onto while still damaging the topology when reversed.</p>" +
      "<p>Under a homeomorphism, topological facts are preserved exactly while measurements may change. An interval can be stretched, a circle can become an ellipse, and a ring-shaped embedding can be deformed without losing its loop. This is why topology can compare shapes across coordinate systems and representation scales.</p>",
    definition:
      "<p>A <b>homeomorphism</b> is a bijection $f:X\\to Y$ such that both $f$ and $f^{-1}$ are continuous.</p>" +
      "<p><b>Assumptions that matter:</b> the map must be one-to-one, onto, continuous, and have a continuous inverse.</p>",
    symbols: [
      { sym: "$f:X\\to Y$", desc: "the forward map" },
      { sym: "$f^{-1}:Y\\to X$", desc: "the inverse" },
      { sym: "bijective", desc: "one-to-one and onto" },
      { sym: "homeomorphic", desc: "related by such a map" }
    ],
    applications: [
      { title: "Intervals", background: "An affine map can homeomorphically stretch one interval to another.", numbers: "$(0,1)$ maps to $(2,5)$ by $3x+2$; $3.5$ maps back to $0.5$." },
      { title: "Shape scaling", background: "Scaling changes measurement but not the loop count.", numbers: "scaling a circle to an ellipse by factors $2$ and $3$ multiplies area by $6$ but keeps one loop." },
      { title: "Flows", background: "A one-dimensional invertible affine flow has a continuous inverse.", numbers: "$y=2x+1$ has inverse $x=(y-1)/2$ and density scale factor $1/2$." },
      { title: "Robot coordinates", background: "Angle ranges can be rescaled continuously.", numbers: "$(-\\pi,\\pi)$ maps to $(-1,1)$ by $\\theta/\\pi$." },
      { title: "Topology-preserving augmentation", background: "Stretching an image ring can preserve its topology.", numbers: "a ring stretched from $20\\times20$ to $30\\times15$ remains one component with one hole." },
      { title: "Embedding ideals", background: "A clean embedding of an interval should not identify endpoints accidentally.", numbers: "an embedding that bends a one-dimensional interval without gluing endpoints keeps component count $1$." }
    ]
  },
  "math-13-08": {
    connectionsProse:
      "<p>Connectedness makes precise the idea that a space is one piece. The earlier lessons supplied open sets, subspaces, and continuity; connectedness uses open sets to define what it means to split a space apart. A connected space has no separation into two nonempty disjoint open pieces.</p>" +
      "<p>This concept is useful for clusters, decision regions, free spaces in robotics, and user flows. It also behaves well under continuous maps. If the input is one connected piece, a continuous function cannot turn its image into two separated open pieces.</p>",
    motivation:
      "<p>Connectedness says a space is one piece in the topological sense. The definition does not depend on drawing a line between clusters or choosing a numerical threshold after the fact. It asks whether the space itself can be represented as two separated open parts.</p>" +
      "<p>The main theorem in this lesson explains why continuity matters. A continuous map cannot send one connected piece into two separated open worlds. If it did, pulling those two separated image pieces back to the domain would split the original space, contradicting connectedness.</p>",
    definition:
      "<p>A space is <b>connected</b> when it cannot be written as the union of two nonempty disjoint open sets in the relevant subspace topology.</p>" +
      "<p><b>Assumptions that matter:</b> openness and nonemptiness are judged inside the space or subspace being studied.</p>",
    symbols: [
      { sym: "$A,B$", desc: "the two pieces of a proposed separation" },
      { sym: "$f(X)$", desc: "the image" },
      { sym: "connected component", desc: "a maximal connected subset" }
    ],
    derivation: [
      { do: "Let $X$ be connected and $f:X\\to Y$ be continuous", result: "we prove $f(X)$ is connected", why: "this is the continuous-image theorem for connectedness" },
      { do: "Suppose $f(X)$ were disconnected", result: "$f(X)=A\\cup B$ with $A,B$ nonempty, disjoint, and open in the subspace $f(X)$", why: "this is the definition of a separation of the image" },
      { do: "Take preimages of the two image pieces", result: "$f^{-1}(A)$ and $f^{-1}(B)$ are open in $X$", why: "continuity turns open image-subspace sets into open input sets" },
      { do: "Use disjointness of $A$ and $B$", result: "$f^{-1}(A)$ and $f^{-1}(B)$ are disjoint", why: "one input cannot map into both disjoint image pieces" },
      { do: "Use nonemptiness of $A$ and $B$", result: "$f^{-1}(A)$ and $f^{-1}(B)$ are nonempty", why: "each image piece contains image points" },
      { do: "Use $f(X)=A\\cup B$", result: "$f^{-1}(A)\\cup f^{-1}(B)=X$", why: "every input maps into one of the two image pieces" },
      { do: "Recognize the resulting split", result: "a separation of $X$", why: "the preimages are nonempty, disjoint, open, and cover $X$" },
      { do: "Contradict connectedness of $X$", result: "$f(X)$ is connected", why: "the supposed separation of the image cannot exist" }
    ],
    applications: [
      { title: "Graph clusters", background: "Connected components summarize cluster pieces.", numbers: "component sizes $12,5,8$ give $3$ clusters and $25$ points." },
      { title: "Segmentation", background: "Pixel blobs can be counted as connected components.", numbers: "blobs of $40,70,15$ pixels give $3$ components; largest is $70$." },
      { title: "Robotics", background: "Different free-space components block continuous travel between them.", numbers: "free-space areas $12$ m$^2$ and $5$ m$^2$ in different components mean no continuous path between them." },
      { title: "Decision regions", background: "A class region can split into islands.", numbers: "a class region with $4$ islands has $4$ connected pieces." },
      { title: "Product funnels", background: "Disconnected flows split users into separate pathways.", numbers: "$8000$ and $2000$ users in disconnected flows means $20\\%$ are in the smaller flow." },
      { title: "Persistence", background: "Component merges are tracked as scale increases.", numbers: "components dropping $10\\to3\\to1$ means $7$ merges before radius $0.5$ and $2$ more by radius $1.0$." }
    ]
  },
  "math-13-09": {
    connectionsProse:
      "<p>Compactness sits between analysis and topology. Earlier lessons introduced open sets, closed sets, continuity, and subspaces. Compactness uses all of them to express one useful kind of finiteness: even when a space has infinitely many points, open-cover arguments can be reduced to finitely many open sets.</p>" +
      "<p>This lesson also points directly toward machine learning practice. A closed bounded perturbation box, a compact feasible parameter interval, or a finite point cloud gives analysts a controlled domain. On such domains, continuous functions behave better: extrema exist, images stay compact, and robustness checks can be stated without allowing points to escape to infinity or disappear through a missing boundary.</p>",
    motivation:
      "<p>The interval $[0,1]$ feels safer than $(0,1)$. A function such as $f(x)=x$ reaches its minimum and maximum on $[0,1]$, but on $(0,1)$ the value $0$ is only approached, never attained. The difference is not length; both intervals are bounded. The difference is that the open interval is missing its endpoints.</p>" +
      "<p>Compactness is the topological language for this kind of control. Its definition says that every open cover has a finite subcover. An open cover may contain infinitely many neighborhoods, but on a compact space finitely many of them already cover the whole space. That is why compactness often turns an infinite problem into a finite one.</p>" +
      "<p>In Euclidean space, the Heine-Borel theorem gives the familiar test: compact means closed and bounded. So $[0,1]$ is compact, $(0,1)$ is not compact because it is not closed, and $[0,\\infty)$ is not compact because it is not bounded. This closed-plus-bounded test is special to $\\mathbb R^n$, but it is exactly the case most ML examples use.</p>",
    definition:
      "<p>A space $X$ is <b>compact</b> when every open cover of $X$ has a finite subcover.</p>" +
      "<p><b>Assumptions that matter:</b> compactness is stated using open covers; in $\\mathbb R^n$, Heine-Borel gives the practical closed-and-bounded test.</p>",
    symbols: [
      { sym: "$X$", desc: "the space being covered" },
      { sym: "$U_\\alpha$", desc: "open sets in a cover" },
      { sym: "$V_\\alpha$", desc: "open sets in a cover of the image" },
      { sym: "$\\alpha$", desc: "indexes the cover" },
      { sym: "$f(X)$", desc: "the image of $X$ under $f$" },
      { sym: "closed", desc: "the complement is open" },
      { sym: "bounded", desc: "in $\\mathbb R^n$, contained in some finite-radius ball" }
    ],
    derivation: [
      { do: "Start with an open cover $\\{U_\\alpha\\}_{\\alpha\\in A}$ of $X$", result: "$X\\subseteq\\bigcup_{\\alpha\\in A}U_\\alpha$", why: "this names the infinite covering problem" },
      { do: "Apply compactness", result: "$X\\subseteq U_{\\alpha_1}\\cup\\cdots\\cup U_{\\alpha_n}$", why: "finitely many cover elements already cover $X$" },
      { do: "In $\\mathbb R^n$, apply Heine-Borel", result: "compact $\\Longleftrightarrow$ closed and bounded", why: "this gives the practical Euclidean test" },
      { do: "Test $[0,1]$", result: "$[0,1]$ is compact", why: "it contains its limit points and lies inside $[-1,2]$" },
      { do: "Test $(0,1)$", result: "$(0,1)$ is not compact in $\\mathbb R$", why: "$0$ is a limit point not included, so the set is not closed" },
      { do: "Test $[0,\\infty)$", result: "$[0,\\infty)$ is not compact in $\\mathbb R$", why: "no finite bound $M$ contains all its points" },
      { do: "Let $f:X\\to Y$ be continuous and $X$ compact, then take an open cover $\\{V_\\alpha\\}$ of $f(X)$", result: "a cover of the image", why: "this is the cover we want to make finite" },
      { do: "Pull the cover back by $f$", result: "$f^{-1}(V_\\alpha)$ are open in $X$ and cover $X$", why: "continuity turns the output cover into an input cover" },
      { do: "Use compactness of $X$ on those preimages", result: "finitely many preimages cover $X$", why: "compactness turns the pulled-back cover finite" },
      { do: "Apply $f$ back to the finite preimage cover", result: "$f(X)$ is covered by finitely many $V_\\alpha$", why: "continuous images of compact spaces are compact" }
    ],
    applications: [
      { title: "Optimizer existence", background: "A continuous loss on a compact feasible set attains its minimum.", numbers: "For $w\\in[-10,10]$ and $L(w)=(w-3)^2$, the feasible set is compact and $L$ is continuous, so the minimum exists; it is $0$ at $w=3$." },
      { title: "Closed perturbation boxes", background: "A closed bounded robustness set is compact in Euclidean space.", numbers: "The robustness set $[-0.03,0.03]^{784}$ is closed and bounded in $\\mathbb R^{784}$, hence compact by Heine-Borel." },
      { title: "Finite grids on compact domains", background: "A compact square can be sampled by a finite grid at fixed spacing.", numbers: "Sampling $[0,1]^2$ every $0.01$ in each coordinate gives $101\\cdot101=10201$ grid points." },
      { title: "Bounded continuous activations", background: "Continuous functions on compact domains have controlled output ranges.", numbers: "If $x\\in[-2,2]$ and $f(x)=e^x$, compactness plus continuity keeps outputs in $[e^{-2},e^2]\\approx[0.135,7.389]$." },
      { title: "Sensor coverage", background: "A finite set of sensors can be treated as a finite-subcover candidate.", numbers: "A $10$ m by $10$ m closed square is compact; a finite plan with $25$ sensors is a finite-subcover candidate for that area." },
      { title: "TDA control", background: "Finite point clouds and finite filtrations give finite recorded stages.", numbers: "A finite point cloud of $500$ samples is compact; a filtration evaluated at $20$ radii gives at most $20$ recorded stages for each feature." }
    ]
  },
  "math-13-10": {
    connectionsProse:
      "<p>Metrics add numerical distance to the topological story. Earlier lessons allowed open sets to be given abstractly, but many spaces in data analysis begin with a distance function. Open balls then provide a direct way to create a topology.</p>" +
      "<p>This lesson links topology to nearest neighbors, scaling, clustering, Lipschitz bounds, and TDA filtrations. The exact distance values matter for computation, but the topology records which points are locally near which other points. Changing the scale of a metric may change numbers while preserving the same open-set structure.</p>",
    motivation:
      "<p>A metric gives numerical distance, and open balls turn that distance into a topology. A set is open when every point inside it has some positive-radius ball still contained in the set. This matches the practical idea that an interior point has room for small perturbations.</p>" +
      "<p>The topology keeps the nearness structure and forgets the exact measurement scale. In applications, Euclidean distance, Manhattan distance, cosine-derived neighborhoods, and feature-scaled distances can generate different local structures. The derivation checks that metric-open sets satisfy the two core open-set closure rules: arbitrary unions and finite intersections.</p>",
    definition:
      "<p>In a metric space, open balls are defined from a distance function $d$, and open sets are those containing a ball around each of their points.</p>" +
      "<p><b>Assumptions that matter:</b> the metric supplies distances, open balls supply local neighborhoods, and openness is tested point by point.</p>",
    symbols: [
      { sym: "$d(x,y)$", desc: "distance" },
      { sym: "$B_r(x)$", desc: "the open ball of radius $r$ around $x$" },
      { sym: "$U,V$", desc: "open sets" }
    ],
    derivation: [
      { do: "In a metric space, call $U$ open when every $x\\in U$ has some $r>0$", result: "$B_r(x)\\subseteq U$", why: "this is the metric definition of open set" },
      { do: "For a union $U=\\bigcup_i U_i$, take $x\\in U$", result: "$x\\in U_j$ for some $j$", why: "membership in a union means membership in at least one piece" },
      { do: "Use openness of $U_j$", result: "there is $r>0$ with $B_r(x)\\subseteq U_j$", why: "every point of an open set has a ball inside it" },
      { do: "Compare $U_j$ with the full union $U$", result: "$B_r(x)\\subseteq U$", why: "$U_j\\subseteq U$, so arbitrary unions are open" },
      { do: "For $U\\cap V$, take $x\\in U\\cap V$", result: "choose $r_U$ with $B_{r_U}(x)\\subseteq U$ and $r_V$ with $B_{r_V}(x)\\subseteq V$", why: "the point lies in both open sets" },
      { do: "Let $r=\\min(r_U,r_V)$", result: "$B_r(x)$ lies in both $U$ and $V$", why: "the smaller radius fits inside both balls" },
      { do: "Conclude for the intersection", result: "$B_r(x)\\subseteq U\\cap V$", why: "finite intersections are open" }
    ],
    applications: [
      { title: "Nearest neighbors", background: "Euclidean distance can choose the closer point.", numbers: "distance from $(1,2)$ to $(4,6)$ is $5$, while to $(2,2)$ is $1$." },
      { title: "Manhattan metric", background: "The $L^1$ metric sums coordinate differences.", numbers: "between $(1,2)$ and $(4,6)$, $L^1$ distance is $7$." },
      { title: "Feature scaling", background: "Scaling prevents one large-unit feature from dominating distance.", numbers: "raw income difference $10000$ contributes $10000^2$ to squared distance; scaled by $10000$, it contributes $1$." },
      { title: "k-means line split", background: "Nearest-center regions split the line at the midpoint.", numbers: "centers $0$ and $10$ split at $5$; $x=4$ joins center $0$." },
      { title: "TDA balls", background: "Radius balls determine which point-cloud edges appear.", numbers: "points $0,0.2,1.0$ with radius $0.15$ connect the first two but not the third." },
      { title: "Lipschitz continuity", background: "A Lipschitz bound converts input closeness into output closeness.", numbers: "if $|f(x)-f(y)|\\le2|x-y|$, inputs within $0.01$ force outputs within $0.02$." }
    ]
  },
  "math-13-11": {
    connectionsProse:
      "<p>Subspaces study smaller pieces of a space, while quotient spaces study what happens when points are identified. This is a different way to build new spaces from old ones. It is useful when a model treats several original points as representing the same state.</p>" +
      "<p>Quotients appear whenever periodicity, symmetry, or gluing is part of the problem. Angles identify $0^\\circ$ with $360^\\circ$, time of day identifies midnight across adjacent days, and image symmetries may identify rotated versions of the same object. The quotient topology keeps the identification compatible with continuity.</p>",
    motivation:
      "<p>A quotient space is formed by declaring some points to be the same and then giving the set of equivalence classes the topology that makes the quotient map continuous. Instead of measuring all distinctions from the original space, the quotient remembers only distinctions between classes. Points in the same class become one point in the new space.</p>" +
      "<p>The topology is chosen so that openness can be tested upstairs in the original space. A set of equivalence classes is open when its preimage under the quotient map is open. This rule is what makes interval endpoints glue into a circle and what lets periodic features behave locally like ordinary neighborhoods while wrapping globally.</p>",
    definition:
      "<p>A <b>quotient space</b> starts with an equivalence relation on $X$ and uses the quotient map to define openness on the set of equivalence classes.</p>" +
      "<p><b>Assumptions that matter:</b> the quotient topology declares a set of classes open exactly when its preimage under the quotient map is open in the original space.</p>",
    symbols: [
      { sym: "$\\sim$", desc: "an equivalence relation" },
      { sym: "$[x]$", desc: "the class of $x$" },
      { sym: "$X/{\\sim}$", desc: "the quotient set" },
      { sym: "$q:X\\to X/{\\sim}$", desc: "the quotient map" }
    ],
    applications: [
      { title: "Time of day", background: "Clock time wraps around instead of living on a line.", numbers: "$23.9$ and $0.1$ hours are $0.2$ hours apart on the quotient circle, not $23.8$." },
      { title: "Periodic grids", background: "Horizontal coordinates can identify opposite edges.", numbers: "width-$100$ positions $99$ and $1$ are distance $2$ with wraparound." },
      { title: "Angle joints", background: "Angles near $0^\\circ$ and $360^\\circ$ are close on the quotient circle.", numbers: "$359^\\circ$ and $1^\\circ$ are $2^\\circ$ apart." },
      { title: "Image symmetry", background: "Symmetry can collapse equivalent transformed images into one class.", numbers: "four rotations of one image can form one quotient class of size $4$." },
      { title: "Two angles", background: "Two wrapped coordinates combine into a torus.", numbers: "two independent periodic coordinates form a torus." },
      { title: "Cyclic clusters", background: "Circular data should cluster across the midnight seam.", numbers: "samples $23.8,0.0,0.2$ cluster near midnight rather than near the line average $8.0$." }
    ]
  },
  "math-13-12": {
    connectionsProse:
      "<p>Homeomorphisms compare spaces by reversible reshaping. Homotopy compares maps by continuous deformation. It is a softer equivalence, focused on whether one map can be moved into another without tearing through forbidden regions.</p>" +
      "<p>This lesson prepares the path-based ideas behind fundamental groups, covering spaces, and holes. In applications, homotopy distinguishes routes that can be deformed into each other from routes blocked by obstacles. It also gives a language for shape morphing and deformation of optimization paths.</p>",
    motivation:
      "<p>Homotopy treats two maps as the same when one can be continuously deformed into the other. The deformation is encoded by a map $H$ that takes an input point and a time value. At time $0$ it gives the first map, and at time $1$ it gives the second map.</p>" +
      "<p>It is equality through a continuous movie, often with endpoints fixed for paths. In a convex region, straight-line interpolation gives a simple homotopy because the whole segment stays inside the region. In a punctured plane or a space with obstacles, a loop may fail to shrink because the required movie would have to pass through a missing point.</p>",
    definition:
      "<p>A <b>homotopy</b> between maps $f$ and $g$ is a continuous map $H:X\\times[0,1]\\to Y$ with $H(x,0)=f(x)$ and $H(x,1)=g(x)$.</p>" +
      "<p><b>Assumptions that matter:</b> the movie $H$ must stay continuous for all inputs and all times between $0$ and $1$.</p>",
    symbols: [
      { sym: "$f,g:X\\to Y$", desc: "the maps" },
      { sym: "$H:X\\times[0,1]\\to Y$", desc: "the homotopy" },
      { sym: "$t$", desc: "time" },
      { sym: "$f\\simeq g$", desc: "homotopic" }
    ],
    applications: [
      { title: "Robot paths", background: "Paths in an empty convex square can be deformed through straight interpolation.", numbers: "in an empty square, linear interpolation keeps paths inside the square." },
      { title: "Shrinking loops", background: "A loop in the plane can shrink by decreasing its radius.", numbers: "radius $1$ in the plane becomes radius $0.3$ at time $t=0.7$ under radius $1-t$." },
      { title: "Obstacles", background: "A missing point can block loop contraction.", numbers: "a loop around the removed origin cannot shrink through radius $0$ in $\\mathbb R^2\\setminus\\{0\\}$." },
      { title: "Shape morphing", background: "Vertex positions can move continuously over time.", numbers: "vertex $(2,0)$ moving to $(2,3)$ is at $(2,1.2)$ when $t=0.4$." },
      { title: "Optimization paths", background: "Paths in a convex feasible set can deform to a simpler route.", numbers: "a two-step path in a convex square can deform to the straight diagonal." },
      { title: "TDA", background: "Adding a filling point can make a loop contractible.", numbers: "eight points around a circle suggest a loop; adding a center point fills it and permits contraction." }
    ]
  },
  "math-13-13": {
    connectionsProse:
      "<p>Homotopy explains when loops can be continuously deformed into one another. The fundamental group organizes those loop classes into algebra. It turns the topology around a base point into a structure where loops can be composed and inverted.</p>" +
      "<p>This lesson is a bridge from geometric holes to computable loop information. The full construction is abstract, but the circle gives a clear model through winding numbers. Winding captures how many times a loop travels around a hole and in which direction.</p>",
    motivation:
      "<p>The fundamental group turns based loops into algebra. A loop starts and ends at a chosen base point, and two loops are treated as equivalent when one can be deformed into the other while keeping the base behavior fixed. The group operation means travel one loop and then the other.</p>" +
      "<p>It records how loops compose, reverse, and wind around holes. On a circle, winding number gives the computable picture: winding $2$ followed by winding $-1$ gives winding $1$. In spaces with obstacles or missing points, nonzero winding can prevent a loop from shrinking to a constant loop.</p>",
    definition:
      "<p>The <b>fundamental group</b> is built from homotopy classes of based loops, with multiplication given by loop concatenation.</p>" +
      "<p><b>Assumptions that matter:</b> loops share a base point, equivalence is by homotopy of based loops, and the product means traveling one loop and then the other.</p>",
    symbols: [
      { sym: "$\\pi_1(X,x_0)$", desc: "the fundamental group at base point $x_0$" },
      { sym: "$\\ell$", desc: "a loop" },
      { sym: "$m$", desc: "a loop" },
      { sym: "$[\\ell]$", desc: "a homotopy class" },
      { sym: "product", desc: "travel one loop then the other" }
    ],
    applications: [
      { title: "Circle loops", background: "Winding numbers add under loop composition.", numbers: "winding $2$ followed by winding $-1$ gives total winding $1$." },
      { title: "Punctured disk", background: "A loop around a missing center cannot be contracted away.", numbers: "winding $1$ around the missing center cannot shrink to winding $0$." },
      { title: "Robot routes", background: "Routes around a pole can have different winding classes.", numbers: "winding $0$ around a pole can shrink away; winding $1$ cannot without crossing the pole." },
      { title: "Phase", background: "Total phase change determines winding around a circle.", numbers: "total phase change $6.3$ gives winding $6.3/(2\\pi)\\approx1.00$." },
      { title: "Joint rotation", background: "Multiple full rotations record winding.", numbers: "motion through $4\\pi$ has winding $2$." },
      { title: "Vortex index", background: "Summed phase changes around a cell give an index.", numbers: "four phase changes of $\\pi/2$ sum to $2\\pi$, giving index $1$." }
    ]
  },
  "math-13-14": {
    connectionsProse:
      "<p>Quotients and fundamental groups both show how local and global structure can differ. Covering spaces make this difference concrete by replacing a wrapped space with another space that maps down to it in repeated local copies. The real line covering the circle is the standard example.</p>" +
      "<p>This lesson supports phase unwrapping, angle tracking, winding numbers, and periodic optimization. Locally, the cover looks like the base space. Globally, lifted paths reveal how many times the original path wrapped around.</p>",
    motivation:
      "<p>A covering space unwraps a space locally. Small neighborhoods in the base look like separate copies in the covering space, so local movement can be studied without immediately dealing with wraparound. For the circle, the real line covers it by sending each real number to its angle modulo one turn.</p>" +
      "<p>Global wrapping records winding. A loop that returns to the same point on the circle may lift to a path on the real line whose endpoint is shifted by an integer. That endpoint shift records the winding number and explains why covering spaces are useful for periodic coordinates and unwrapped phases.</p>",
    definition:
      "<p>A <b>covering map</b> $p:E\\to B$ maps neighborhoods in the covering space onto evenly covered neighborhoods in the base space.</p>" +
      "<p><b>Assumptions that matter:</b> locally the cover looks like disjoint copies of the base neighborhood, even when global wrapping is nontrivial.</p>",
    symbols: [
      { sym: "$p:E\\to B$", desc: "the covering map" },
      { sym: "$E$", desc: "the covering space" },
      { sym: "$B$", desc: "the base space" },
      { sym: "$\\tilde\\ell$", desc: "a lift satisfying $p\\circ\\tilde\\ell=\\ell$" }
    ],
    derivation: [
      { do: "Use the standard covering map $p:\\mathbb R\\to S^1$", result: "$p(t)=(\\cos2\\pi t,\\sin2\\pi t)$", why: "the real line wraps around the circle once per integer shift" },
      { do: "Define the circle loop", result: "$\\ell(s)=(\\cos2\\pi s,\\sin2\\pi s)$ with $s\\in[0,1]$", why: "this loop makes one full turn around the circle" },
      { do: "Choose the lifted path", result: "$\\tilde\\ell(s)=s$ starting at $\\tilde\\ell(0)=0$", why: "the lift starts over the loop base point" },
      { do: "Apply $p$ to the lift", result: "$p(\\tilde\\ell(s))=p(s)=(\\cos2\\pi s,\\sin2\\pi s)$", why: "this checks that the lifted path projects to the circle" },
      { do: "Compare with the loop", result: "$p(\\tilde\\ell(s))=\\ell(s)$ for every $s$", why: "$\\tilde\\ell$ is a valid lift" },
      { do: "Read the lifted endpoint", result: "$\\tilde\\ell(1)=1$ and endpoint shift $1-0=1$", why: "the shift records winding number $1$" }
    ],
    applications: [
      { title: "Phase unwrapping", background: "A wrapped phase sequence can be lifted to avoid an artificial jump.", numbers: "phases $6.1,0.1,0.3$ lift to $6.1,6.383,6.583$, avoiding a fake jump of $-6.0$." },
      { title: "Robot joints", background: "Joint angles should move through the short lifted displacement.", numbers: "$350^\\circ$ to $10^\\circ$ is a lifted $20^\\circ$ move, not $-340^\\circ$." },
      { title: "Winding", background: "Lift endpoints record how many turns occurred.", numbers: "a lift from $0$ to $-2$ has winding $-2$." },
      { title: "Textures", background: "Texture coordinates can agree modulo one repeat while differing upstairs.", numbers: "$u=2.3$ and $u=0.3$ show the same horizontal phase but differ by two repeats." },
      { title: "Periodic optimization", background: "Updates can be computed upstairs and then wrapped back down.", numbers: "$6.20+0.15=6.35$ wraps to $0.067$ radians." },
      { title: "Headings", background: "Heading measurements can be unwrapped into a continuous lift.", numbers: "$358^\\circ,1^\\circ,4^\\circ$ unwrap to $358^\\circ,361^\\circ,364^\\circ$." }
    ]
  },
  "math-13-15": {
    connectionsProse:
      "<p>The previous lessons described spaces through open sets, maps, loops, and covers. Simplicial complexes give a combinatorial way to build spaces from simple pieces. Vertices, edges, triangles, and higher-dimensional simplices make topology computable from finite data.</p>" +
      "<p>This is the entry point for many TDA constructions. Point clouds can become complexes when nearby points are connected, meshes can be checked through vertex-edge-face counts, and sensor overlaps can form nerves. The face rule keeps the combinatorics consistent enough for homology.</p>",
    motivation:
      "<p>A simplicial complex builds a shape from vertices, edges, filled triangles, and higher-dimensional pieces. A line segment is built from two vertices and an edge; a filled triangle is built from three vertices, three edges, and one two-dimensional face. Higher-dimensional simplices extend the same pattern.</p>" +
      "<p>The face rule says that when a simplex is included, all of its faces are included too. This prevents inconsistent shapes such as a filled triangle without its boundary edges. Once the pieces are counted consistently, quantities like Euler characteristic and homology can summarize the topology of the complex.</p>",
    definition:
      "<p>A <b>simplicial complex</b> is a collection of simplices closed under taking faces.</p>" +
      "<p><b>Assumptions that matter:</b> whenever a simplex is included, all of its faces must also be included.</p>",
    symbols: [
      { sym: "$K$", desc: "the complex" },
      { sym: "$V,E,F$", desc: "counts vertices, edges, and filled triangular faces" },
      { sym: "$\\chi$", desc: "Euler characteristic" },
      { sym: "$k$-simplex", desc: "a simplex with $k+1$ vertices" }
    ],
    derivation: [
      { do: "Start with a filled triangle $[a,b,c]$", result: "$3$ vertices: $a,b,c$", why: "a triangle has one vertex for each listed point" },
      { do: "List its one-dimensional faces", result: "$3$ edges: $[a,b]$, $[b,c]$, and $[a,c]$", why: "the face rule includes all boundary edges" },
      { do: "Count the filled two-dimensional piece", result: "$1$ two-dimensional face", why: "the triangle is filled, not just its boundary" },
      { do: "Use the two-dimensional Euler characteristic", result: "$\\chi=V-E+F$", why: "vertices, edges, and faces summarize this complex" },
      { do: "Substitute the counts", result: "$V=3$, $E=3$, $F=1$", why: "these are the counts for one filled triangle" },
      { do: "Compute", result: "$\\chi=3-3+1=1$", why: "this is the Euler characteristic" },
      { do: "Interpret the value", result: "one component and no hole", why: "a filled triangle is disk-like" }
    ],
    applications: [
      { title: "Sphere mesh", background: "Euler characteristic identifies a sphere-like mesh count.", numbers: "$V=1000,E=2994,F=1996$ gives $\\chi=2$." },
      { title: "Rips triangle", background: "Nearby points can form a filled simplex in a Rips complex.", numbers: "three points with all distances $\\le0.5$ form a filled triangle at threshold $0.5$." },
      { title: "Clique complex", background: "A clique contributes all lower-dimensional faces and one tetrahedron.", numbers: "a $4$-clique has $4$ vertices, $6$ edges, $4$ triangles, and $1$ tetrahedron." },
      { title: "Square split", background: "Triangulating a square gives disk-like Euler characteristic.", numbers: "$4$ vertices, $5$ edges, $2$ triangles gives $\\chi=1$." },
      { title: "Image block", background: "A filled pixel block has no central gap.", numbers: "a filled $2\\times2$ active-pixel block has one component and no central hole." },
      { title: "Sensors", background: "Common overlap among sensors becomes a filled simplex in the nerve.", numbers: "three sensors with common overlap contribute one filled triangle to the nerve." }
    ]
  },
  "math-13-16": {
    connectionsProse:
      "<p>Simplicial complexes turn shapes into finite combinatorial objects. Homology uses those objects to count components, loops, voids, and higher-dimensional holes. It is less detailed than the fundamental group but often easier to compute.</p>" +
      "<p>This lesson is the algebraic foundation for persistent homology. Chains, cycles, boundaries, and quotient groups identify which apparent loops are genuine holes and which are just boundaries of filled pieces. The triangle-boundary example gives the simplest nontrivial one-dimensional hole.</p>",
    motivation:
      "<p>Homology counts holes by comparing cycles with boundaries. A cycle is a closed chain with no exposed boundary, such as the three edges around a triangle. But not every cycle should count as a hole, because a cycle may simply be the boundary of a filled-in face.</p>" +
      "<p>A loop is meaningful only if it is not already the boundary of a filled-in piece. The triangle boundary with no filled triangle has one loop, while a filled triangle would remove that loop as a hole. This comparison is captured by $H_n=Z_n/B_n$: cycles modulo boundaries.</p>",
    definition:
      "<p>Homology groups are formed from chain groups, boundary maps, cycles, and boundaries, often over a chosen coefficient field such as $\\mathbb Z_2$: $$H_n=Z_n/B_n.$$</p>" +
      "<p><b>Assumptions that matter:</b> coefficients are chosen in advance, cycles are compared modulo boundaries, and Betti numbers record homology ranks.</p>",
    symbols: [
      { sym: "$C_n$", desc: "the group of $n$-chains" },
      { sym: "$\\partial_n$", desc: "the boundary map" },
      { sym: "$Z_n=\\ker\\partial_n$", desc: "cycles" },
      { sym: "$B_n=\\operatorname{im}\\partial_{n+1}$", desc: "boundaries" },
      { sym: "$H_n=Z_n/B_n$", desc: "homology" },
      { sym: "$\\beta_n$", desc: "the rank of $H_n$" }
    ],
    derivation: [
      { do: "Work over $\\mathbb Z_2$ with a triangle boundary", result: "$3$ vertices, $3$ edges, and no filled triangle", why: "this is the simplest one-loop complex" },
      { do: "Observe the graph is connected", result: "$\\beta_0=1$", why: "there is one connected component" },
      { do: "Use the connected graph cycle count", result: "$\\beta_1=E-V+1$", why: "independent one-dimensional cycles in a connected graph are edges minus vertices plus one" },
      { do: "Substitute $E=3$ and $V=3$", result: "$\\beta_1=3-3+1$", why: "the triangle boundary has three edges and three vertices" },
      { do: "Compute", result: "$\\beta_1=1$", why: "there is one independent cycle" },
      { do: "Use the absence of a filled triangle", result: "the edge cycle is not the boundary of a $2$-simplex", why: "no filled face is present to fill the loop" },
      { do: "Read the homology rank", result: "$H_1$ has rank $1$", why: "it records one one-dimensional hole" }
    ],
    applications: [
      { title: "Components", background: "Zeroth homology counts connected components.", numbers: "component sizes $5,3,2$ give $\\beta_0=3$." },
      { title: "Square loop", background: "A connected square boundary has one independent cycle.", numbers: "$V=4,E=4$ connected boundary gives $\\beta_1=4-4+1=1$." },
      { title: "Sphere mesh", background: "Euler characteristic agrees with sphere-like topology.", numbers: "$100-294+196=2$, consistent with a sphere-like surface." },
      { title: "Sensor gap", background: "Adjacent overlaps without diagonal filling leave a square-shaped hole.", numbers: "four sensors in a square with adjacent overlaps and no diagonal overlaps give $\\beta_1=1$." },
      { title: "Digit 8", background: "Digit topology can be summarized by components and holes.", numbers: "one component and two holes gives approximately $(\\beta_0,\\beta_1)=(1,2)$." },
      { title: "Feature vector", background: "Betti numbers can become model features.", numbers: "snapshot $\\beta_0=4,\\beta_1=1$ becomes topological feature vector $(4,1)$." }
    ]
  },
  "math-13-17": {
    connectionsProse:
      "<p>Homology studies holes at one fixed scale. Persistent homology studies how those holes appear and disappear across many scales. It combines simplicial complexes, homology groups, and filtrations into a scale-aware summary.</p>" +
      "<p>This is one of the main ways topology enters data analysis. Point clouds rarely come with a single obvious radius, so persistence tracks features over a range of thresholds. Long-lived bars are often treated as stronger evidence of structure than short-lived bars.</p>",
    motivation:
      "<p>Persistent homology watches homology across scale. At small radii, points may be isolated; as the radius grows, components merge, loops appear, and holes eventually fill in. Recording the birth and death of each feature gives a barcode or persistence diagram.</p>" +
      "<p>Long bars represent features that survive many thresholds; short bars often represent noise. This does not make persistence automatic proof of meaning, but it gives a stable quantitative summary to compare with domain expectations. The line example focuses on $H_0$, where death times record the scales at which components merge.</p>",
    definition:
      "<p>A <b>filtration</b> is a nested family of complexes $K_r$, and persistent homology records births and deaths of homology classes across $r$.</p>" +
      "<p><b>Assumptions that matter:</b> the complexes are nested as scale increases, and each class has a birth, a death, or persistence to infinity.</p>",
    symbols: [
      { sym: "$K_r$", desc: "the complex at scale $r$" },
      { sym: "$b$", desc: "birth" },
      { sym: "$d$", desc: "death" },
      { sym: "$[b,d)$", desc: "a persistence interval" },
      { sym: "$d-b$", desc: "lifetime" }
    ],
    derivation: [
      { do: "Put three points on the line", result: "$0$, $1$, and $3$", why: "this gives a simple ordered point cloud" },
      { do: "Use a Vietoris-Rips filtration with edge threshold $r$", result: "an edge appears when point distance is at most $r$", why: "the threshold controls connectivity" },
      { do: "Check the gap between $0$ and $1$", result: "components merge at $r=1$", why: "the distance between those points is $1$" },
      { do: "Check the gap between $1$ and $3$", result: "the remaining component merges at $r=2$", why: "the distance between those points is $2$" },
      { do: "Count components initially", result: "$\\beta_0=3$", why: "there are three isolated points" },
      { do: "Count after the two merge events", result: "after $r=1$, $\\beta_0=2$; after $r=2$, $\\beta_0=1$", why: "each merge reduces the component count by one" },
      { do: "Read the finite death times", result: "$1$ and $2$", why: "these are the scales where two $H_0$ classes merge into older components" }
    ],
    applications: [
      { title: "Noise filtering", background: "Longer bars are stronger candidates for signal than very short bars.", numbers: "bar lengths $0.02,0.05,0.7$ support keeping the $0.7$ bar with cutoff $0.1$." },
      { title: "Hierarchical clustering", background: "Line gaps become component death scales.", numbers: "line gaps $0.2,0.4,2.0$ produce $H_0$ deaths at those scales." },
      { title: "Shape classification", background: "Persistent $H_1$ can distinguish a circle-like point cloud from a disk-like one.", numbers: "a circle with one $H_1$ bar length $0.9$ differs from a disk with no $H_1$ bar longer than $0.1$." },
      { title: "Sensor holes", background: "A persistent bar records a hole over a physical scale range.", numbers: "a bar $[15,40)$ m lasts $25$ m." },
      { title: "Molecules", background: "Cavity lifetimes can be measured in angstrom-scale filtrations.", numbers: "a cavity born at $1.2$ angstroms and dying at $2.8$ has lifetime $1.6$." },
      { title: "Embedding diagnostics", background: "An unusually long component death can reveal subgroup separation.", numbers: "class $H_0$ deaths below $0.3$ except one at $1.5$ suggest a large subgroup separation." }
    ]
  },
  "math-13-18": {
    connectionsProse:
      "<p>This capstone gathers the section's main ideas into a machine-learning workflow. Topological spaces, metrics, subspaces, complexes, homology, and persistence all contribute to the same question: what shape the data seems to occupy. The manifold hypothesis gives one modeling reason to care about that shape.</p>" +
      "<p>The lesson should be read as interpretation rather than theorem proving. It connects topology to representation diagnostics, class separation, cyclic factors, anomaly detection, and topological regularization. The goal is to use the tools carefully, with the metric, filtration, and modeling question stated explicitly.</p>",
    motivation:
      "<p>The manifold hypothesis says high-dimensional data may concentrate near a lower-dimensional shape. Images, embeddings, and behavioral traces may live in a high-dimensional ambient space while varying along fewer meaningful degrees of freedom. Topology helps describe that lower-dimensional shape without reducing everything to linear coordinates.</p>" +
      "<p>TDA tests parts of that shape by building filtered complexes and looking for persistent components, loops, and voids. The workflow begins by choosing a metric, then building a filtration, computing persistent homology, and interpreting long-lived features against the modeling goal. A long loop may indicate a cyclic factor, a long component bar may indicate separation or anomaly, and a mismatch between expected and observed topology may guide model debugging.</p>",
    definition:
      "<p>The <b>manifold hypothesis and TDA workflow</b> assumes a point cloud or representation in an ambient feature space and uses topology to interpret its shape.</p>" +
      "<p><b>Assumptions that matter:</b> choose a metric, build a filtration, compute persistent homology, interpret long-lived features, and check the result against modeling goals.</p>",
    symbols: [
      { sym: "$\\mathbb R^D$", desc: "the ambient feature space" },
      { sym: "$d\\ll D$", desc: "the suspected intrinsic dimension" },
      { sym: "$(b,d)$", desc: "a persistence point" },
      { sym: "$H_0,H_1,H_2$", desc: "components, loops, and voids" }
    ],
    applications: [
      { title: "Local graph scale", background: "A nearest-neighbor graph uses local geometry rather than all pairwise edges.", numbers: "keeping $15$ nearest neighbors among $10000$ samples uses local geometry rather than all $49,995,000$ pairs." },
      { title: "Loop diagnostic", background: "A persistence point with long lifetime can pass a signal cutoff.", numbers: "a point $(0.18,0.92)$ has lifetime $0.74$, above a $0.20$ cutoff." },
      { title: "Class separation", background: "A large between-class merge scale can exceed within-class death scales.", numbers: "within-class deaths by $0.2$ and class merge at $1.4$ give a $7$ times larger separation scale." },
      { title: "Cyclic vision factor", background: "Rotations can form a circular factor in representation space.", numbers: "images at $0^\\circ,90^\\circ,180^\\circ,270^\\circ$ on the unit circle have adjacent distance $\\sqrt2\\approx1.414$." },
      { title: "Topological regularization", background: "A penalty can compare target and produced persistence lengths.", numbers: "target loop length $0.8$ versus output $0.2$ gives penalty $(0.8-0.2)^2=0.36$." },
      { title: "Anomaly detection", background: "An isolated point can produce a long $H_0$ bar.", numbers: "normal nearest-neighbor distance $0.10$ versus one point at $0.65$ suggests an isolated $H_0$ bar lasting about $0.65$." }
    ]
  }
};
