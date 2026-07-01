# Math · Part 13 — Topology  (deep-authored reference)

> **Per-section execution plan.** Load together with the master [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four exposition principles, the fix recipe, and the Definition of Done. This plan rewrites the topology scaffold into lesson-level authoring specs in the same depth as Part 02. Numbers were checked with `python3` for Euler characteristics, Betti counts, compactness/grid checks, distances, wrapping, and persistence lifetimes.

**Section:** Topology · **Lessons:** 18 · **Breadcrumb:** `Mathematics · Geometry & Topology` · **Priority:** STANDARD (targeted deepening)

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate shared across sibling lessons | 0 / 18 |
| Thin motivation requiring replacement | 0 / 18 |
| Formula / definition needing display + symbol gloss | 6 / 18 |
| Genuine LaTeX bugs | 0 / 18 |
| Complete derivations to author | 10 / 18 |
| Explain-only lessons | 8 / 18 |

**Compute log.** Verified examples include: $101^2=10201$ grid points; $e^{-2}\approx0.135$, $e^2\approx7.389$; $1000-2994+1996=2$; $4-5+2=1$; triangle-boundary and square-boundary $\beta_1=1$; persistence lengths $0.92-0.18=0.74$ and $40-15=25$; $10000\cdot9999/2=49,995,000$ pairs; unit-circle adjacent distance $\sqrt2\approx1.414$.

## Priority & systemic issues

- No whole-section §5 boilerplate block was detected. The work is targeted deepening: make each lesson's applications use its own topology concept rather than generic shape language.
- Topology is definition-heavy. Do not force proofs into `math-13-01`, `13-02`, `13-04`, `13-11`, `13-12`, or `13-18`; these should teach the definitions and assumptions plainly.
- Use complete proofs only where they are short and genuinely explanatory: complements, subspaces, preimages, connectedness under continuous maps, compactness/Heine-Borel, metric-open intersections, covering lifts, Euler characteristic, Betti counts, and persistence intervals.
- ML through-line: connect the section to the manifold hypothesis, persistent homology/TDA, robust perturbation sets, representation geometry, and topology-preserving model behavior.
- LaTeX audit found no unclosed dollar delimiters and no lost matrix row breaks in the dumped lessons.

## Model entry (full prose)

### `math-13-09` — Compactness  — **full-depth model entry (this is the bar)**

**Connections (§1).**
> Compactness sits between analysis and topology. Earlier lessons introduced open sets, closed sets, continuity, and subspaces. Compactness uses all of them to express one useful kind of finiteness: even when a space has infinitely many points, open-cover arguments can be reduced to finitely many open sets.
>
> This lesson also points directly toward machine learning practice. A closed bounded perturbation box, a compact feasible parameter interval, or a finite point cloud gives analysts a controlled domain. On such domains, continuous functions behave better: extrema exist, images stay compact, and robustness checks can be stated without allowing points to escape to infinity or disappear through a missing boundary.

**Motivation & Intuition (§2).**
> The interval $[0,1]$ feels safer than $(0,1)$. A function such as $f(x)=x$ reaches its minimum and maximum on $[0,1]$, but on $(0,1)$ the value $0$ is only approached, never attained. The difference is not length; both intervals are bounded. The difference is that the open interval is missing its endpoints.
>
> Compactness is the topological language for this kind of control. Its definition says that every open cover has a finite subcover. An open cover may contain infinitely many neighborhoods, but on a compact space finitely many of them already cover the whole space. That is why compactness often turns an infinite problem into a finite one.
>
> In Euclidean space, the Heine-Borel theorem gives the familiar test: compact means closed and bounded. So $[0,1]$ is compact, $(0,1)$ is not compact because it is not closed, and $[0,\infty)$ is not compact because it is not bounded. This closed-plus-bounded test is special to $\mathbb R^n$, but it is exactly the case most ML examples use.

**Definition & Assumptions (§3).** Display the definition: a space $X$ is compact when every open cover of $X$ has a finite subcover.

**Derive (complete).**
1. Start with an open cover $\{U_\alpha\}_{\alpha\in A}$ of $X$, meaning $X\subseteq\bigcup_{\alpha\in A}U_\alpha$; this names the infinite covering problem.
2. Compactness says there are finitely many indices $\alpha_1,\dots,\alpha_n$ with $X\subseteq U_{\alpha_1}\cup\cdots\cup U_{\alpha_n}$; this is the finite-control conclusion.
3. In $\mathbb R^n$, apply Heine-Borel: compact $\Longleftrightarrow$ closed and bounded; this gives the practical Euclidean test.
4. For $[0,1]$, the set contains its limit points and lies inside $[-1,2]$; it is closed and bounded, so it is compact.
5. For $(0,1)$, the point $0$ is a limit point not included in the set; it is not closed, so it is not compact in $\mathbb R$.
6. For $[0,\infty)$, no finite bound $M$ contains all its points; it is not bounded, so it is not compact in $\mathbb R$.
7. If $f:X\to Y$ is continuous and $X$ is compact, take any open cover $\{V_\alpha\}$ of $f(X)$; this is the cover we want to make finite.
8. The preimages $f^{-1}(V_\alpha)$ are open in $X$ and cover $X$; continuity turns the output cover into an input cover.
9. Compactness of $X$ gives finitely many preimages covering $X$; applying $f$ back shows the corresponding finitely many $V_\alpha$ cover $f(X)$.
10. Therefore continuous images of compact spaces are compact; this is the theorem behind bounded continuous outputs on compact domains.

**Symbols.** $X$ is the space being covered; $U_\alpha$ and $V_\alpha$ are open sets in a cover; $\alpha$ indexes the cover; $f(X)$ is the image of $X$ under $f$; closed means the complement is open; bounded in $\mathbb R^n$ means contained in some finite-radius ball.

**Real-World Applications (§5).**
1. **Optimizer existence.** For $w\in[-10,10]$ and $L(w)=(w-3)^2$, the feasible set is compact and $L$ is continuous, so the minimum exists; it is $0$ at $w=3$.
2. **Closed perturbation boxes.** The robustness set $[-0.03,0.03]^{784}$ is closed and bounded in $\mathbb R^{784}$, hence compact by Heine-Borel.
3. **Finite grids on compact domains.** Sampling $[0,1]^2$ every $0.01$ in each coordinate gives $101\cdot101=10201$ grid points.
4. **Bounded continuous activations.** If $x\in[-2,2]$ and $f(x)=e^x$, compactness plus continuity keeps outputs in $[e^{-2},e^2]\approx[0.135,7.389]$.
5. **Sensor coverage.** A $10$ m by $10$ m closed square is compact; a finite plan with $25$ sensors is a finite-subcover candidate for that area.
6. **TDA control.** A finite point cloud of $500$ samples is compact; a filtration evaluated at $20$ radii gives at most $20$ recorded stages for each feature.

## Per-lesson change specs

**How to read these specs.** Each block is drafted content for one lesson in plan shorthand. In the app, expand it into flowing prose: connections and motivation first, then definition, derivation or explain-only rationale, symbol glossary, and exactly six applications with verified numbers.

### `math-13-01` — What topology studies  · explain-only

**Connections (§1).**
> Topology begins after the reader already has some geometric language for points, distances, curves, and regions. Instead of asking for exact lengths or angles, it asks which qualitative features remain stable under continuous change. This makes it a natural bridge from geometry to modern data analysis, where the exact coordinates of a representation may shift while components, loops, and neighborhoods remain meaningful.
>
> The lesson prepares the vocabulary used throughout the section. Open sets, continuity, compactness, homology, and persistence all depend on the same basic habit: separate metric facts from topological facts. That distinction helps explain why two embeddings can have very different distances but still describe the same underlying shape.

**Motivation & Intuition (§2).**
> Topology studies the parts of shape that survive stretching, bending, and continuous deformation. A circle drawn large or small is still one connected loop, and a coffee-cup-like surface and a torus-like surface can share the same kind of hole even if their measurements are different. The point is not that measurement is unimportant; it is that some questions are better answered before committing to a particular ruler.
>
> This is useful in machine learning because learned representations often change under scaling, rotation, nonlinear embedding, or feature preprocessing. A classifier may care that data has two separated clusters, a trajectory may care that an obstacle creates a hole, and TDA may care that a loop persists across several scales. Topology supplies the language for those stable features: connected pieces, holes, neighborhoods, and invariants.

**Definition & Assumptions (§3).** This is an orientation lesson, so the main assumption is that we distinguish qualitative shape properties from numerical metric properties.

**Derive (complete).** explain-only — this is an orientation lesson. There is no formula to prove; the lesson should distinguish topological facts from metric facts.

**Symbols.** $X$ is a space; $d(x,y)$ is a distance when one is available; a homeomorphism is the kind of continuous reversible deformation that preserves topology.

**Real-World Applications (§5).**
1. **Component clustering:** groups of $40$ and $60$ separated by a gap give component count $2$.
2. **Persistence:** a loop born at radius $0.3$ and dying at $1.1$ has lifetime $0.8$.
3. **Digit holes:** $8$ has $2$ holes, $0$ has $1$.
4. **Robotics:** one circular obstacle in a square creates one obstacle hole.
5. **Representation geometry:** scaling a ring embedding by $3$ changes distances but keeps one loop.
6. **Mesh QA:** a torus-like mesh changing from $1$ component to $2$ signals a tear.

### `math-13-02` — Topological spaces  · explain-only

**Connections (§1).**
> The first lesson separated topological information from metric information. A topological space is the formal structure that makes that separation possible. It starts with a set of points and adds only the information needed to say which subsets count as open.
>
> This definition supports the rest of the section. Once the open sets are chosen, closed sets, continuity, connectedness, compactness, and subspaces all become precise. The same underlying set can carry different topologies, so the topology is part of the mathematical model, not an afterthought.

**Motivation & Intuition (§2).**
> A topological space is a set together with a rule for which subsets count as open. In familiar Euclidean space, open intervals and open balls supply that rule, but topology allows more general rules. The important part is that the rule is consistent enough for unions and finite intersections of open sets to behave the way neighborhoods should behave.
>
> This lets mathematics talk about nearness without always assigning a numerical distance. In data settings, a neighborhood may come from cosine similarity, graph adjacency, a thresholded score, or a learned representation. Once a topology is fixed, words like near, continuous, closed, connected, and compact have precise meanings inside that chosen structure.

**Definition & Assumptions (§3).** A topological space consists of an underlying set and a collection of subsets declared to be open, satisfying the topology axioms.

**Derive (complete).** explain-only — the topology axioms are definitions, not a numerical identity. Use the finite example $X=\{a,b\}$ and $\tau=\{\emptyset,\{a\},X\}$ to check the rules in prose.

**Symbols.** $X$ is the underlying set; $\tau$ is the collection of open subsets; $\emptyset$ is the empty set; $(X,\tau)$ is the topological space.

**Real-World Applications (§5).**
1. **Finite spaces:** for $X=\{a,b,c\}$, the discrete topology has $2^3=8$ open sets.
2. **Coarsest topology:** the indiscrete topology has exactly $2$ open sets, $\emptyset$ and $X$.
3. **Metric neighborhoods:** the ball of radius $0.1$ around $2$ in $\mathbb R$ is $(1.9,2.1)$.
4. **Cosine neighborhoods:** a threshold $0.8$ may give $47$ neighbors where $0.9$ gives $12$.
5. **Parameter spaces:** if $\|\Delta w\|=0.01$ and a local Lipschitz constant is $5$, loss changes by at most $0.05$.
6. **Distribution convergence:** means $1,1.5,1.75,1.875$ are within $0.125$ of $2$ by the fourth value.

### `math-13-03` — Open and closed sets  · AUTHOR derivation

**Connections (§1).**
> Open and closed sets are the first working tools inside a topological space. The previous lesson defined a topology by declaring which subsets are open. This lesson explains the paired idea: closed sets are defined by open complements.
>
> The distinction is central for later lessons on continuity, compactness, and feasible regions. Open sets describe room to move locally, while closed sets describe including the limits that sequences or paths approach. Many ML constraints and safety thresholds are naturally closed because the boundary value is allowed.

**Motivation & Intuition (§2).**
> Open sets give points room to move inside the set. If a point lies in an open interval, a small enough wiggle keeps the point inside that interval. This is the local picture behind neighborhoods, local perturbations, and continuity checks.
>
> Closed sets include the boundary points they are supposed to limit toward. The interval $[0,1]$ contains $0$ and $1$, so a sequence such as $0.9,0.99,0.999$ approaches a point still inside the set. In optimization and safety constraints, this matters because the best or limiting value may occur exactly on the boundary.

**Definition & Assumptions (§3).** Closedness is defined relative to an ambient space $X$, so complements are always taken inside that space.

**Derive (complete).**
1. In a space $X$, define $F$ to be closed when $X\setminus F$ is open; this is the general topological definition.
2. If $U$ is open, set $F=X\setminus U$; then $X\setminus F=X\setminus(X\setminus U)=U$.
3. Since $U$ is open, $F$ is closed by the definition; complements of open sets are closed.
4. If $F$ is closed, $X\setminus F$ is open by definition; complements of closed sets are open.
5. In $\mathbb R$, $(0,1)$ is open because each point has a small interval inside it, but it is not closed because $0$ and $1$ are missing limit points.
6. The set $[0,1]$ is closed because its complement $(-\infty,0)\cup(1,\infty)$ is open.

**Symbols.** $U$ is an open set; $F$ is a closed set; $X\setminus F$ is the complement of $F$ inside the ambient space $X$.

**Real-World Applications (§5).**
1. **Feasible weights:** $0\le w\le1$ is closed; $0.9,0.99,0.999\to1$ stays feasible.
2. **Local gradients:** radius $0.1$ around $w=2$ gives $(1.9,2.1)$.
3. **Thresholds:** accept scores $s\ge0.7$ form $[0.7,1]$ inside $[0,1]$.
4. **Image disks:** $r\le10$ includes boundary and has area about $314$ pixels continuously.
5. **Latency safety:** $L\le100$ ms includes the limit $100$.
6. **Closed balls:** distance $5.0$ is outside the open radius-$5$ ball but inside the closed one.

### `math-13-04` — Bases  · explain-only

**Connections (§1).**
> Open sets can be large and complicated, but many topologies are generated from simpler local pieces. In the usual topology on the real line, open intervals are enough to describe every open set. A basis formalizes that kind of smaller vocabulary.
>
> This lesson connects directly to metric balls, product spaces, local explanations, and manifold charts. Instead of listing every open set, one can describe a manageable family of basic neighborhoods. Later continuity and subspace arguments become easier because they can often be checked locally on basis elements.

**Motivation & Intuition (§2).**
> A basis is a small vocabulary of open pieces from which every open set is built by unions. Each point in an open set should sit inside some basic open piece that still remains inside the open set. This is the topological version of saying that local descriptions are enough to reconstruct the global open-set structure.
>
> The overlap condition is what makes the vocabulary coherent. If a point lies in two basic neighborhoods, there should be a smaller basic neighborhood around that point lying inside their overlap. For intervals and balls this matches geometric intuition: when two neighborhoods overlap around a point, a sufficiently small neighborhood still fits inside both.

**Definition & Assumptions (§3).** A basis must cover the space and must have compatible overlaps so that unions of basis elements define a topology.

**Derive (complete).** explain-only — the basis conditions are structural definitions. Show with intervals that a point in an overlap has a smaller interval inside the overlap.

**Symbols.** $\mathcal B$ is the basis; $B_1,B_2,B_3$ are basic open sets; $U$ is an open set generated as a union of basis elements.

**Real-World Applications (§5).**
1. **Euclidean balls:** $(1.9,2.1)$ is a radius-$0.1$ basic neighborhood of $2$.
2. **Vision patches:** a $224\times224$ image with $16\times16$ patches has $14\cdot14=196$ patches.
3. **Product tolerances:** age within $\pm2$ and income within $\pm5000$ gives a rectangle of width $4$ by $10000$.
4. **Local explanations:** $10$ binary features have $2^{10}=1024$ local variants.
5. **Range queries:** price $(10,20)$ and rating $(4,5)$ form one basic rectangle in two features.
6. **Manifold charts:** two stereographic charts cover a sphere while each chart looks locally like $\mathbb R^2$.

### `math-13-05` — Subspace topology  · AUTHOR derivation

**Connections (§1).**
> Many spaces are studied as parts of larger spaces. A circle sits inside the plane, a probability simplex sits inside Euclidean space, and a feasible interval may sit inside the real line. The subspace topology explains how the smaller space inherits openness from the larger one.
>
> This is especially important when boundaries become part of the world being studied. A set that is not open in the full real line can be open relative to a constrained interval. That relative viewpoint is used repeatedly in constraints, manifolds, cohorts, and data subsets.

**Motivation & Intuition (§2).**
> A subspace inherits nearness from a larger space but only keeps points that belong to the smaller set. To find an open set in the subspace, start with an open set in the ambient space and intersect it with the subspace. The result may look cut off from the outside, but from inside the subspace it behaves like an open neighborhood.
>
> Endpoints can behave differently when the endpoint lies inside the whole universe being studied. In $[0,1]$, a neighborhood of $0$ can look like $[0,0.2)$ because points below $0$ are not part of the subspace. This is the same logic behind feasible regions and manifolds: local neighborhoods are judged relative to the space where the problem actually lives.

**Definition & Assumptions (§3).** The subspace topology is built from an ambient topological space $(X,\tau)$ and a subset $Y\subseteq X$.

**Derive (complete).**
1. Let $(X,\tau)$ be a topological space and $Y\subseteq X$; define $\tau_Y=\{Y\cap U:U\in\tau\}$.
2. $\emptyset=Y\cap\emptyset$ and $Y=Y\cap X$, so the empty set and whole subspace are open in $Y$.
3. For any family $Y\cap U_i$, the union is $\bigcup_i(Y\cap U_i)=Y\cap(\bigcup_i U_i)$; unions are preserved because union distributes over intersection.
4. Since $\bigcup_i U_i$ is open in $X$, the union is in $\tau_Y$.
5. For finitely many sets, $(Y\cap U_1)\cap\cdots\cap(Y\cap U_n)=Y\cap(U_1\cap\cdots\cap U_n)$.
6. Since finite intersections of the $U_i$ are open in $X$, finite intersections are open in $Y$; therefore $\tau_Y$ is a topology.

**Symbols.** $Y$ is the subspace; $\tau_Y$ is its inherited topology; $U$ is open in the ambient space; $V=Y\cap U$ is open relative to $Y$.

**Real-World Applications (§5).**
1. **Relative feasibility:** inside $[0,1]$, $[0,0.2)$ equals $[0,1]\cap(-0.1,0.2)$ and is open in the subspace.
2. **Manifold data:** a radius-$0.1$ disk intersected with a circle gives a small arc neighborhood.
3. **Probability simplex:** $3$ class probabilities form a $2$D triangle in $\mathbb R^3$.
4. **Road networks:** a path with $20$ road nodes inherits neighborhoods along edges, not all nearby plane points.
5. **Learning rates:** near $\eta=0$ in $[0,1]$, $[0,0.01)$ is a relative neighborhood.
6. **Cohorts:** ages $[30,32)$ inside $[30,40]$ equal $[30,40]\cap(29,32)$.

### `math-13-06` — Continuity  · AUTHOR derivation

**Connections (§1).**
> Continuity is where open sets begin to control functions. Earlier lessons defined open sets, closed sets, bases, and subspaces. This lesson uses those ideas to say that a function respects the topology of its domain and codomain.
>
> The open-preimage definition is more flexible than the calculus definition based on graphs. It works for metric spaces, subspaces, quotient spaces, and many ML maps. A continuous score map can transform neighborhoods without tearing them into sudden jumps before a later thresholding step.

**Motivation & Intuition (§2).**
> Continuity means open output requirements pull back to open input requirements. If an output must land in a desired open band, the inputs that achieve that requirement should form an open set in the domain. This captures the idea that small-enough input changes can keep the output within a chosen tolerance.
>
> In ML language, a continuous score map has decision-score bands whose preimages are topologically well behaved before hard thresholding. The hard threshold may introduce a jump, but the underlying score function can still be continuous. The affine example shows the mechanism directly: solving the output interval inequality produces another open interval in the input.

**Definition & Assumptions (§3).** The topological definition says that $f:X\to Y$ is continuous when every open set in $Y$ has an open preimage in $X$.

**Derive (complete).**
1. Let $f(x)=2x+1$ and take an open output interval $(a,b)$; continuity can be checked by preimages of open intervals.
2. Solve $a<2x+1<b$; this states exactly which inputs land in the output interval.
3. Subtract $1$ to get $a-1<2x<b-1$; this preserves the inequality.
4. Divide by $2>0$ to get $(a-1)/2<x<(b-1)/2$.
5. Therefore $f^{-1}((a,b))=((a-1)/2,(b-1)/2)$, an open interval.
6. Because open intervals generate the usual topology on $\mathbb R$, the affine map is continuous.

**Symbols.** $f:X\to Y$ is the map; $f^{-1}(U)$ is the preimage of output set $U$; $\tau_X,\tau_Y$ are the domain and codomain topologies.

**Real-World Applications (§5).**
1. **Score bands:** for $s(x)=2x+1$, output band $(5,9)$ pulls back to $(2,4)$.
2. **ReLU:** inputs $-0.01,0,0.01$ produce $0,0,0.01$ with no jump.
3. **Robust scaling:** $f(x)=4x$ changes by $0.04$ when $x$ changes by $0.01$.
4. **Loss paths:** $L(w)=(w-2)^2$ changes from $0$ to $0.01$ at $w=2.1$.
5. **Preprocessing:** $z=(x-100)/20$ maps $(90,110)$ to $(-0.5,0.5)$.
6. **Thresholding:** $0.699$ and $0.701$ can map to labels $0$ and $1$, a jump of $1$ from input change $0.002$.

### `math-13-07` — Homeomorphisms  · explain-only

**Connections (§1).**
> Continuity says a function respects open-set structure in one direction. A homeomorphism asks for continuous structure in both directions. It is the topology-level notion of two spaces being the same shape.
>
> This lesson clarifies what topology preserves and what it intentionally ignores. Lengths, angles, and areas may change under a homeomorphism, but connectedness, compactness, and holes are preserved. That distinction supports later lessons on quotient spaces, homotopy, and topology-preserving transformations of embeddings.

**Motivation & Intuition (§2).**
> A homeomorphism is a continuous reversible reshaping. The function must be bijective, continuous, and have a continuous inverse. The inverse condition matters because a map can be one-to-one and onto while still damaging the topology when reversed.
>
> Under a homeomorphism, topological facts are preserved exactly while measurements may change. An interval can be stretched, a circle can become an ellipse, and a ring-shaped embedding can be deformed without losing its loop. This is why topology can compare shapes across coordinate systems and representation scales.

**Definition & Assumptions (§3).** A homeomorphism is a bijection $f:X\to Y$ such that both $f$ and $f^{-1}$ are continuous.

**Derive (complete).** explain-only — the core lesson is the definition and the need for continuous inverse. Use $f(x)=3x+2$ from $(0,1)$ to $(2,5)$ as a verification example rather than a new theorem.

**Symbols.** $f:X\to Y$ is the forward map; $f^{-1}:Y\to X$ is the inverse; bijective means one-to-one and onto; homeomorphic means related by such a map.

**Real-World Applications (§5).**
1. **Intervals:** $(0,1)$ maps to $(2,5)$ by $3x+2$; $3.5$ maps back to $0.5$.
2. **Shape scaling:** scaling a circle to an ellipse by factors $2$ and $3$ multiplies area by $6$ but keeps one loop.
3. **Flows:** $y=2x+1$ has inverse $x=(y-1)/2$ and density scale factor $1/2$.
4. **Robot coordinates:** $(-\pi,\pi)$ maps to $(-1,1)$ by $\theta/\pi$.
5. **Topology-preserving augmentation:** a ring stretched from $20\times20$ to $30\times15$ remains one component with one hole.
6. **Embedding ideals:** an embedding that bends a one-dimensional interval without gluing endpoints keeps component count $1$.

### `math-13-08` — Connectedness  · AUTHOR derivation

**Connections (§1).**
> Connectedness makes precise the idea that a space is one piece. The earlier lessons supplied open sets, subspaces, and continuity; connectedness uses open sets to define what it means to split a space apart. A connected space has no separation into two nonempty disjoint open pieces.
>
> This concept is useful for clusters, decision regions, free spaces in robotics, and user flows. It also behaves well under continuous maps. If the input is one connected piece, a continuous function cannot turn its image into two separated open pieces.

**Motivation & Intuition (§2).**
> Connectedness says a space is one piece in the topological sense. The definition does not depend on drawing a line between clusters or choosing a numerical threshold after the fact. It asks whether the space itself can be represented as two separated open parts.
>
> The main theorem in this lesson explains why continuity matters. A continuous map cannot send one connected piece into two separated open worlds. If it did, pulling those two separated image pieces back to the domain would split the original space, contradicting connectedness.

**Definition & Assumptions (§3).** A space is connected when it cannot be written as the union of two nonempty disjoint open sets in the relevant subspace topology.

**Derive (complete).**
1. Let $X$ be connected and $f:X\to Y$ be continuous; we prove $f(X)$ is connected.
2. Suppose $f(X)$ were disconnected; then $f(X)=A\cup B$ with $A,B$ nonempty, disjoint, and open in the subspace $f(X)$.
3. Because $A$ and $B$ are open in the image subspace, their preimages $f^{-1}(A)$ and $f^{-1}(B)$ are open in $X$.
4. They are disjoint because $A$ and $B$ are disjoint.
5. They are nonempty because $A$ and $B$ contain image points.
6. They cover $X$ because every $x\in X$ maps into $f(X)=A\cup B$.
7. This gives a separation of $X$, contradicting connectedness.
8. Therefore $f(X)$ is connected.

**Symbols.** $A,B$ are the two pieces of a proposed separation; $f(X)$ is the image; a connected component is a maximal connected subset.

**Real-World Applications (§5).**
1. **Graph clusters:** component sizes $12,5,8$ give $3$ clusters and $25$ points.
2. **Segmentation:** blobs of $40,70,15$ pixels give $3$ components; largest is $70$.
3. **Robotics:** free-space areas $12$ m$^2$ and $5$ m$^2$ in different components mean no continuous path between them.
4. **Decision regions:** a class region with $4$ islands has $4$ connected pieces.
5. **Product funnels:** $8000$ and $2000$ users in disconnected flows means $20\%$ are in the smaller flow.
6. **Persistence:** components dropping $10\to3\to1$ means $7$ merges before radius $0.5$ and $2$ more by radius $1.0$.

### `math-13-10` — Metric-space topology  · AUTHOR derivation

**Connections (§1).**
> Metrics add numerical distance to the topological story. Earlier lessons allowed open sets to be given abstractly, but many spaces in data analysis begin with a distance function. Open balls then provide a direct way to create a topology.
>
> This lesson links topology to nearest neighbors, scaling, clustering, Lipschitz bounds, and TDA filtrations. The exact distance values matter for computation, but the topology records which points are locally near which other points. Changing the scale of a metric may change numbers while preserving the same open-set structure.

**Motivation & Intuition (§2).**
> A metric gives numerical distance, and open balls turn that distance into a topology. A set is open when every point inside it has some positive-radius ball still contained in the set. This matches the practical idea that an interior point has room for small perturbations.
>
> The topology keeps the nearness structure and forgets the exact measurement scale. In applications, Euclidean distance, Manhattan distance, cosine-derived neighborhoods, and feature-scaled distances can generate different local structures. The derivation checks that metric-open sets satisfy the two core open-set closure rules: arbitrary unions and finite intersections.

**Definition & Assumptions (§3).** In a metric space, open balls are defined from a distance function $d$, and open sets are those containing a ball around each of their points.

**Derive (complete).**
1. In a metric space, call $U$ open when every $x\in U$ has some $r>0$ with $B_r(x)\subseteq U$.
2. For a union $U=\bigcup_i U_i$, take $x\in U$; then $x\in U_j$ for some $j$.
3. Since $U_j$ is open, there is $r>0$ with $B_r(x)\subseteq U_j$.
4. Because $U_j\subseteq U$, the same ball lies inside $U$; arbitrary unions are open.
5. For $U\cap V$, take $x\in U\cap V$; choose $r_U$ with $B_{r_U}(x)\subseteq U$ and $r_V$ with $B_{r_V}(x)\subseteq V$.
6. Let $r=\min(r_U,r_V)$; then $B_r(x)$ lies in both $U$ and $V$.
7. Therefore $B_r(x)\subseteq U\cap V$, so finite intersections are open.

**Symbols.** $d(x,y)$ is distance; $B_r(x)$ is the open ball of radius $r$ around $x$; $U,V$ are open sets.

**Real-World Applications (§5).**
1. **Nearest neighbors:** distance from $(1,2)$ to $(4,6)$ is $5$, while to $(2,2)$ is $1$.
2. **Manhattan metric:** between $(1,2)$ and $(4,6)$, $L^1$ distance is $7$.
3. **Feature scaling:** raw income difference $10000$ contributes $10000^2$ to squared distance; scaled by $10000$, it contributes $1$.
4. **k-means line split:** centers $0$ and $10$ split at $5$; $x=4$ joins center $0$.
5. **TDA balls:** points $0,0.2,1.0$ with radius $0.15$ connect the first two but not the third.
6. **Lipschitz continuity:** if $|f(x)-f(y)|\le2|x-y|$, inputs within $0.01$ force outputs within $0.02$.

### `math-13-11` — Quotient spaces  · explain-only

**Connections (§1).**
> Subspaces study smaller pieces of a space, while quotient spaces study what happens when points are identified. This is a different way to build new spaces from old ones. It is useful when a model treats several original points as representing the same state.
>
> Quotients appear whenever periodicity, symmetry, or gluing is part of the problem. Angles identify $0^\circ$ with $360^\circ$, time of day identifies midnight across adjacent days, and image symmetries may identify rotated versions of the same object. The quotient topology keeps the identification compatible with continuity.

**Motivation & Intuition (§2).**
> A quotient space is formed by declaring some points to be the same and then giving the set of equivalence classes the topology that makes the quotient map continuous. Instead of measuring all distinctions from the original space, the quotient remembers only distinctions between classes. Points in the same class become one point in the new space.
>
> The topology is chosen so that openness can be tested upstairs in the original space. A set of equivalence classes is open when its preimage under the quotient map is open. This rule is what makes interval endpoints glue into a circle and what lets periodic features behave locally like ordinary neighborhoods while wrapping globally.

**Definition & Assumptions (§3).** A quotient space starts with an equivalence relation on $X$ and uses the quotient map to define openness on the set of equivalence classes.

**Derive (complete).** explain-only — quotient topology is a definition chosen for a purpose. Teach the interval-with-endpoints-glued example and emphasize that openness is tested by preimage under the quotient map.

**Symbols.** $\sim$ is an equivalence relation; $[x]$ is the class of $x$; $X/{\sim}$ is the quotient set; $q:X\to X/{\sim}$ is the quotient map.

**Real-World Applications (§5).**
1. **Time of day:** $23.9$ and $0.1$ hours are $0.2$ hours apart on the quotient circle, not $23.8$.
2. **Periodic grids:** width-$100$ positions $99$ and $1$ are distance $2$ with wraparound.
3. **Angle joints:** $359^\circ$ and $1^\circ$ are $2^\circ$ apart.
4. **Image symmetry:** four rotations of one image can form one quotient class of size $4$.
5. **Two angles:** two independent periodic coordinates form a torus.
6. **Cyclic clusters:** samples $23.8,0.0,0.2$ cluster near midnight rather than near the line average $8.0$.

### `math-13-12` — Homotopy  · explain-only

**Connections (§1).**
> Homeomorphisms compare spaces by reversible reshaping. Homotopy compares maps by continuous deformation. It is a softer equivalence, focused on whether one map can be moved into another without tearing through forbidden regions.
>
> This lesson prepares the path-based ideas behind fundamental groups, covering spaces, and holes. In applications, homotopy distinguishes routes that can be deformed into each other from routes blocked by obstacles. It also gives a language for shape morphing and deformation of optimization paths.

**Motivation & Intuition (§2).**
> Homotopy treats two maps as the same when one can be continuously deformed into the other. The deformation is encoded by a map $H$ that takes an input point and a time value. At time $0$ it gives the first map, and at time $1$ it gives the second map.
>
> It is equality through a continuous movie, often with endpoints fixed for paths. In a convex region, straight-line interpolation gives a simple homotopy because the whole segment stays inside the region. In a punctured plane or a space with obstacles, a loop may fail to shrink because the required movie would have to pass through a missing point.

**Definition & Assumptions (§3).** A homotopy between maps $f$ and $g$ is a continuous map $H:X\times[0,1]\to Y$ with the right endpoint maps at times $0$ and $1$.

**Derive (complete).** explain-only — this lesson introduces the definition and the role of the movie $H$. Do not overbuild; use linear interpolation in a convex set as the concrete example.

**Symbols.** $f,g:X\to Y$ are the maps; $H:X\times[0,1]\to Y$ is the homotopy; $t$ is time; $f\simeq g$ means homotopic.

**Real-World Applications (§5).**
1. **Robot paths:** in an empty square, linear interpolation keeps paths inside the square.
2. **Shrinking loops:** radius $1$ in the plane becomes radius $0.3$ at time $t=0.7$ under radius $1-t$.
3. **Obstacles:** a loop around the removed origin cannot shrink through radius $0$ in $\mathbb R^2\setminus\{0\}$.
4. **Shape morphing:** vertex $(2,0)$ moving to $(2,3)$ is at $(2,1.2)$ when $t=0.4$.
5. **Optimization paths:** a two-step path in a convex square can deform to the straight diagonal.
6. **TDA:** eight points around a circle suggest a loop; adding a center point fills it and permits contraction.

### `math-13-13` — The fundamental group  · explain-only

**Connections (§1).**
> Homotopy explains when loops can be continuously deformed into one another. The fundamental group organizes those loop classes into algebra. It turns the topology around a base point into a structure where loops can be composed and inverted.
>
> This lesson is a bridge from geometric holes to computable loop information. The full construction is abstract, but the circle gives a clear model through winding numbers. Winding captures how many times a loop travels around a hole and in which direction.

**Motivation & Intuition (§2).**
> The fundamental group turns based loops into algebra. A loop starts and ends at a chosen base point, and two loops are treated as equivalent when one can be deformed into the other while keeping the base behavior fixed. The group operation means travel one loop and then the other.
>
> It records how loops compose, reverse, and wind around holes. On a circle, winding number gives the computable picture: winding $2$ followed by winding $-1$ gives winding $1$. In spaces with obstacles or missing points, nonzero winding can prevent a loop from shrinking to a constant loop.

**Definition & Assumptions (§3).** The fundamental group is built from homotopy classes of based loops, with multiplication given by loop concatenation.

**Derive (complete).** explain-only — the full group construction depends on homotopy classes and reparameterization. Keep the proof burden light and use winding numbers on $S^1$ as the computable model.

**Symbols.** $\pi_1(X,x_0)$ is the fundamental group at base point $x_0$; $\ell$ and $m$ are loops; $[\ell]$ is a homotopy class; the product means travel one loop then the other.

**Real-World Applications (§5).**
1. **Circle loops:** winding $2$ followed by winding $-1$ gives total winding $1$.
2. **Punctured disk:** winding $1$ around the missing center cannot shrink to winding $0$.
3. **Robot routes:** winding $0$ around a pole can shrink away; winding $1$ cannot without crossing the pole.
4. **Phase:** total phase change $6.3$ gives winding $6.3/(2\pi)\approx1.00$.
5. **Joint rotation:** motion through $4\pi$ has winding $2$.
6. **Vortex index:** four phase changes of $\pi/2$ sum to $2\pi$, giving index $1$.

### `math-13-14` — Covering spaces  · AUTHOR derivation

**Connections (§1).**
> Quotients and fundamental groups both show how local and global structure can differ. Covering spaces make this difference concrete by replacing a wrapped space with another space that maps down to it in repeated local copies. The real line covering the circle is the standard example.
>
> This lesson supports phase unwrapping, angle tracking, winding numbers, and periodic optimization. Locally, the cover looks like the base space. Globally, lifted paths reveal how many times the original path wrapped around.

**Motivation & Intuition (§2).**
> A covering space unwraps a space locally. Small neighborhoods in the base look like separate copies in the covering space, so local movement can be studied without immediately dealing with wraparound. For the circle, the real line covers it by sending each real number to its angle modulo one turn.
>
> Global wrapping records winding. A loop that returns to the same point on the circle may lift to a path on the real line whose endpoint is shifted by an integer. That endpoint shift records the winding number and explains why covering spaces are useful for periodic coordinates and unwrapped phases.

**Definition & Assumptions (§3).** A covering map $p:E\to B$ maps neighborhoods in the covering space onto evenly covered neighborhoods in the base space.

**Derive (complete).**
1. Use the standard covering map $p:\mathbb R\to S^1$, $p(t)=(\cos2\pi t,\sin2\pi t)$.
2. The circle loop is $\ell(s)=(\cos2\pi s,\sin2\pi s)$ with $s\in[0,1]$.
3. Choose the lifted path $\tilde\ell(s)=s$ starting at $\tilde\ell(0)=0$.
4. Apply $p$ to the lift: $p(\tilde\ell(s))=p(s)=(\cos2\pi s,\sin2\pi s)$.
5. This equals $\ell(s)$ for every $s$, so $\tilde\ell$ is a valid lift.
6. The lifted endpoint is $\tilde\ell(1)=1$; endpoint shift $1-0=1$ records winding number $1$.

**Symbols.** $p:E\to B$ is the covering map; $E$ is the covering space; $B$ is the base space; a lift $\tilde\ell$ satisfies $p\circ\tilde\ell=\ell$.

**Real-World Applications (§5).**
1. **Phase unwrapping:** phases $6.1,0.1,0.3$ lift to $6.1,6.383,6.583$, avoiding a fake jump of $-6.0$.
2. **Robot joints:** $350^\circ$ to $10^\circ$ is a lifted $20^\circ$ move, not $-340^\circ$.
3. **Winding:** a lift from $0$ to $-2$ has winding $-2$.
4. **Textures:** $u=2.3$ and $u=0.3$ show the same horizontal phase but differ by two repeats.
5. **Periodic optimization:** $6.20+0.15=6.35$ wraps to $0.067$ radians.
6. **Headings:** $358^\circ,1^\circ,4^\circ$ unwrap to $358^\circ,361^\circ,364^\circ$.

### `math-13-15` — Simplicial complexes  · AUTHOR derivation

**Connections (§1).**
> The previous lessons described spaces through open sets, maps, loops, and covers. Simplicial complexes give a combinatorial way to build spaces from simple pieces. Vertices, edges, triangles, and higher-dimensional simplices make topology computable from finite data.
>
> This is the entry point for many TDA constructions. Point clouds can become complexes when nearby points are connected, meshes can be checked through vertex-edge-face counts, and sensor overlaps can form nerves. The face rule keeps the combinatorics consistent enough for homology.

**Motivation & Intuition (§2).**
> A simplicial complex builds a shape from vertices, edges, filled triangles, and higher-dimensional pieces. A line segment is built from two vertices and an edge; a filled triangle is built from three vertices, three edges, and one two-dimensional face. Higher-dimensional simplices extend the same pattern.
>
> The face rule says that when a simplex is included, all of its faces are included too. This prevents inconsistent shapes such as a filled triangle without its boundary edges. Once the pieces are counted consistently, quantities like Euler characteristic and homology can summarize the topology of the complex.

**Definition & Assumptions (§3).** A simplicial complex is a collection of simplices closed under taking faces.

**Derive (complete).**
1. A filled triangle $[a,b,c]$ has $3$ vertices: $a,b,c$.
2. Its faces include $3$ edges: $[a,b]$, $[b,c]$, and $[a,c]$.
3. The filled triangle contributes $1$ two-dimensional face.
4. The Euler characteristic in two dimensions is $\chi=V-E+F$.
5. Substitute $V=3$, $E=3$, $F=1$.
6. Compute $\chi=3-3+1=1$.
7. This matches a filled disk-like triangle, which has one component and no hole.

**Symbols.** $K$ is the complex; $V,E,F$ count vertices, edges, and filled triangular faces; $\chi$ is Euler characteristic; $k$-simplex means a simplex with $k+1$ vertices.

**Real-World Applications (§5).**
1. **Sphere mesh:** $V=1000,E=2994,F=1996$ gives $\chi=2$.
2. **Rips triangle:** three points with all distances $\le0.5$ form a filled triangle at threshold $0.5$.
3. **Clique complex:** a $4$-clique has $4$ vertices, $6$ edges, $4$ triangles, and $1$ tetrahedron.
4. **Square split:** $4$ vertices, $5$ edges, $2$ triangles gives $\chi=1$.
5. **Image block:** a filled $2\times2$ active-pixel block has one component and no central hole.
6. **Sensors:** three sensors with common overlap contribute one filled triangle to the nerve.

### `math-13-16` — Homology groups  · AUTHOR derivation

**Connections (§1).**
> Simplicial complexes turn shapes into finite combinatorial objects. Homology uses those objects to count components, loops, voids, and higher-dimensional holes. It is less detailed than the fundamental group but often easier to compute.
>
> This lesson is the algebraic foundation for persistent homology. Chains, cycles, boundaries, and quotient groups identify which apparent loops are genuine holes and which are just boundaries of filled pieces. The triangle-boundary example gives the simplest nontrivial one-dimensional hole.

**Motivation & Intuition (§2).**
> Homology counts holes by comparing cycles with boundaries. A cycle is a closed chain with no exposed boundary, such as the three edges around a triangle. But not every cycle should count as a hole, because a cycle may simply be the boundary of a filled-in face.
>
> A loop is meaningful only if it is not already the boundary of a filled-in piece. The triangle boundary with no filled triangle has one loop, while a filled triangle would remove that loop as a hole. This comparison is captured by $H_n=Z_n/B_n$: cycles modulo boundaries.

**Definition & Assumptions (§3).** Homology groups are formed from chain groups, boundary maps, cycles, and boundaries, often over a chosen coefficient field such as $\mathbb Z_2$.

**Derive (complete).**
1. Work over $\mathbb Z_2$ with a triangle boundary: $3$ vertices, $3$ edges, and no filled triangle.
2. The graph is connected, so $\beta_0=1$.
3. For a connected graph, independent one-dimensional cycles satisfy $\beta_1=E-V+1$.
4. Substitute $E=3$ and $V=3$.
5. Compute $\beta_1=3-3+1=1$.
6. Because there is no filled triangle, the edge cycle is not the boundary of a $2$-simplex.
7. Therefore $H_1$ has rank $1$, recording one one-dimensional hole.

**Symbols.** $C_n$ is the group of $n$-chains; $\partial_n$ is the boundary map; $Z_n=\ker\partial_n$ is cycles; $B_n=\operatorname{im}\partial_{n+1}$ is boundaries; $H_n=Z_n/B_n$; $\beta_n$ is the rank of $H_n$.

**Real-World Applications (§5).**
1. **Components:** component sizes $5,3,2$ give $\beta_0=3$.
2. **Square loop:** $V=4,E=4$ connected boundary gives $\beta_1=4-4+1=1$.
3. **Sphere mesh:** $100-294+196=2$, consistent with a sphere-like surface.
4. **Sensor gap:** four sensors in a square with adjacent overlaps and no diagonal overlaps give $\beta_1=1$.
5. **Digit 8:** one component and two holes gives approximately $(\beta_0,\beta_1)=(1,2)$.
6. **Feature vector:** snapshot $\beta_0=4,\beta_1=1$ becomes topological feature vector $(4,1)$.

### `math-13-17` — Persistent homology  · AUTHOR derivation

**Connections (§1).**
> Homology studies holes at one fixed scale. Persistent homology studies how those holes appear and disappear across many scales. It combines simplicial complexes, homology groups, and filtrations into a scale-aware summary.
>
> This is one of the main ways topology enters data analysis. Point clouds rarely come with a single obvious radius, so persistence tracks features over a range of thresholds. Long-lived bars are often treated as stronger evidence of structure than short-lived bars.

**Motivation & Intuition (§2).**
> Persistent homology watches homology across scale. At small radii, points may be isolated; as the radius grows, components merge, loops appear, and holes eventually fill in. Recording the birth and death of each feature gives a barcode or persistence diagram.
>
> Long bars represent features that survive many thresholds; short bars often represent noise. This does not make persistence automatic proof of meaning, but it gives a stable quantitative summary to compare with domain expectations. The line example focuses on $H_0$, where death times record the scales at which components merge.

**Definition & Assumptions (§3).** A filtration is a nested family of complexes $K_r$, and persistent homology records births and deaths of homology classes across $r$.

**Derive (complete).**
1. Put three points on the line at $0$, $1$, and $3$.
2. In a Vietoris-Rips filtration using edge threshold $r$, an edge appears when the point distance is at most $r$.
3. The gap between $0$ and $1$ is $1$, so those two components merge at $r=1$.
4. The gap between $1$ and $3$ is $2$, so the remaining component merges at $r=2$.
5. Initially $\beta_0=3$ because there are three isolated points.
6. After $r=1$, $\beta_0=2$; after $r=2$, $\beta_0=1$.
7. Thus the two finite $H_0$ death times are $1$ and $2$.

**Symbols.** $K_r$ is the complex at scale $r$; $b$ is birth; $d$ is death; $[b,d)$ is a persistence interval; $d-b$ is lifetime.

**Real-World Applications (§5).**
1. **Noise filtering:** bar lengths $0.02,0.05,0.7$ support keeping the $0.7$ bar with cutoff $0.1$.
2. **Hierarchical clustering:** line gaps $0.2,0.4,2.0$ produce $H_0$ deaths at those scales.
3. **Shape classification:** a circle with one $H_1$ bar length $0.9$ differs from a disk with no $H_1$ bar longer than $0.1$.
4. **Sensor holes:** a bar $[15,40)$ m lasts $25$ m.
5. **Molecules:** a cavity born at $1.2$ angstroms and dying at $2.8$ has lifetime $1.6$.
6. **Embedding diagnostics:** class $H_0$ deaths below $0.3$ except one at $1.5$ suggest a large subgroup separation.

### `math-13-18` — The manifold hypothesis & TDA  · explain-only · ML capstone

**Connections (§1).**
> This capstone gathers the section's main ideas into a machine-learning workflow. Topological spaces, metrics, subspaces, complexes, homology, and persistence all contribute to the same question: what shape the data seems to occupy. The manifold hypothesis gives one modeling reason to care about that shape.
>
> The lesson should be read as interpretation rather than theorem proving. It connects topology to representation diagnostics, class separation, cyclic factors, anomaly detection, and topological regularization. The goal is to use the tools carefully, with the metric, filtration, and modeling question stated explicitly.

**Motivation & Intuition (§2).**
> The manifold hypothesis says high-dimensional data may concentrate near a lower-dimensional shape. Images, embeddings, and behavioral traces may live in a high-dimensional ambient space while varying along fewer meaningful degrees of freedom. Topology helps describe that lower-dimensional shape without reducing everything to linear coordinates.
>
> TDA tests parts of that shape by building filtered complexes and looking for persistent components, loops, and voids. The workflow begins by choosing a metric, then building a filtration, computing persistent homology, and interpreting long-lived features against the modeling goal. A long loop may indicate a cyclic factor, a long component bar may indicate separation or anomaly, and a mismatch between expected and observed topology may guide model debugging.

**Definition & Assumptions (§3).** This lesson assumes a point cloud or representation in an ambient feature space and treats TDA as a workflow for interpreting its shape.

**Derive (complete).** explain-only — this capstone is a workflow and interpretation lesson, not a theorem. Explain the pipeline: choose a metric, build a filtration, compute persistent homology, interpret long-lived features, and check against modeling goals.

**Symbols.** $\mathbb R^D$ is the ambient feature space; $d\ll D$ is the suspected intrinsic dimension; $(b,d)$ is a persistence point; $H_0,H_1,H_2$ record components, loops, and voids.

**Real-World Applications (§5).**
1. **Local graph scale:** keeping $15$ nearest neighbors among $10000$ samples uses local geometry rather than all $49,995,000$ pairs.
2. **Loop diagnostic:** a point $(0.18,0.92)$ has lifetime $0.74$, above a $0.20$ cutoff.
3. **Class separation:** within-class deaths by $0.2$ and class merge at $1.4$ give a $7$ times larger separation scale.
4. **Cyclic vision factor:** images at $0^\circ,90^\circ,180^\circ,270^\circ$ on the unit circle have adjacent distance $\sqrt2\approx1.414$.
5. **Topological regularization:** target loop length $0.8$ versus output $0.2$ gives penalty $(0.8-0.2)^2=0.36$.
6. **Anomaly detection:** normal nearest-neighbor distance $0.10$ versus one point at $0.65$ suggests an isolated $H_0$ bar lasting about $0.65$.

## Build order

1. Author the compactness model entry first (`math-13-09`), including the Heine-Borel examples and continuous-image proof.
2. Author foundational definitions next: `13-01`, `13-02`, `13-03`, `13-04`, `13-05`, `13-06`, `13-07`, `13-08`, `13-10`.
3. Author quotient and homotopy material: `13-11`, `13-12`, `13-13`, `13-14`.
4. Author combinatorial/TDA lessons: `13-15`, `13-16`, `13-17`.
5. Finish with the ML capstone `13-18`, tying manifold hypothesis, persistent homology, robustness, and representation diagnostics together.
6. Final QA: check exactly 18 lessons, exactly six applications per lesson, no rhetorical openers, no hype, no unclosed dollar delimiters, and no unverified numbers.
