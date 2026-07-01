# Math · Part 10 — Representation theory  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four exposition principles and Definition of Done. Every numeric claim below was checked with `python3` and `numpy`; key checks include modular inverses, subgroup closure samples, orbit-stabilizer counts, cyclic-shift equivariance, CNN cyclic convolution, small character tables, rotation matrices, and permutation-equivariant graph aggregation.

**Section:** Representation theory · **Lessons:** 15 · **Breadcrumb:** `Mathematics · Algebra` · **Priority:** STANDARD (targeted deepening)

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate shared with a sibling | 0 / 15 |
| Templated / thin motivation | 0 / 15 |
| Key formula not in display form (`$$…$$`) | 10 / 15 |
| Genuine LaTeX bugs: unclosed `$` or lost matrix `\\` | 0 / 15 |
| Derivation action in this authored plan | 13 derivation / 2 explain-only |

**The core change:** representation theory is the algebra of symmetry acting on data. This plan keeps the existing strong symmetry framing, then deepens every lesson with a complete derivation when there is a real theorem or property to prove, a full symbol gloss, and six applications whose numbers come from that lesson's own symmetry object. The ML applications should be genuinely about symmetry: CNN translation-equivariance, GNN permutation-equivariance, invariant pooling, steerable channels, and geometric networks.

---

## Priority & systemic issues

- **No whole-section §5 boilerplate:** the current section already has concept-specific applications. Preserve that strength while adding more worked arithmetic and clearer derivation steps.
- **Display formulas:** promote group axioms, subgroup tests, orbit-stabilizer, representation homomorphism laws, Schur's lemma, character formulas, orthogonality, invariance, and equivariance to display form with every symbol named.
- **ML through-line:** lessons `math-10-13` to `math-10-15` should connect invariance, equivariance, and geometric neural networks explicitly. `math-10-14` remains the prose model entry because the master rates it strong and because it is the bridge from algebra to modern ML architectures.
- **LaTeX pass:** the current dump shows no genuine unbalanced math delimiters and no lost matrix row breaks. Keep matrices with source `\\` row separators and flag no false positives.

---

## Model entry (full prose)

### `math-10-14` — Equivariance  — **full-depth model entry**

**Connections (§1).**
> This lesson builds on group actions and invariance. A group action says how a symmetry moves an input, and invariance says a function gives the same output after that movement. Equivariance keeps more information than invariance. It says the output should move in the matching way.
>
> This distinction is central in machine learning. A classifier may be invariant to a small translation because the class label should stay the same. A segmentation map, keypoint detector, vector field, or graph-node predictor should not stay fixed; it should transform along with the input. That is why equivariance is the right language for CNN feature maps, GNN node embeddings, pose predictions, and geometric neural networks.

**Motivation & Intuition (§2).**
> Equivariance describes a map that respects symmetry without discarding it. Suppose an image shifts one pixel to the right. If a feature extractor detects an edge at position $5$ before the shift, the corresponding feature should appear at position $6$ after the shift. The answer has changed, but it changed in the predictable way dictated by the same group action.
>
> The compact statement is that processing and transforming commute. Transform the input and then apply the map, or apply the map and then transform the output; an equivariant map gives the same result. This is stronger than ordinary consistency. It lets an architecture share parameters across symmetric positions while still producing location-aware or geometry-aware outputs.
>
> A short cyclic-shift example makes the rule concrete. Let $S$ be the right cyclic shift on a length-$4$ vector, so $S(x_0,x_1,x_2,x_3)=(x_3,x_0,x_1,x_2)$. Define
> $$
> F(x_0,x_1,x_2,x_3)=(x_0+x_1,\,x_1+x_2,\,x_2+x_3,\,x_3+x_0).
> $$
> For $x=(1,3,0,2)$, $F(x)=(4,3,2,3)$ and $S(F(x))=(3,4,3,2)$. Also $Sx=(2,1,3,0)$, so $F(Sx)=(3,4,3,2)$. The two paths agree: shifting after $F$ gives the same vector as applying $F$ after shifting.

**Definition & Assumptions (§3).** Display
$$
F(g\cdot x)=g\cdot F(x)
$$
for every $g\in G$ and $x\in X$.

Then derive the cyclic-shift check completely:
1. Define the right cyclic shift $S(x_0,x_1,x_2,x_3)=(x_3,x_0,x_1,x_2)$ — this is the group action on positions.
2. Define $F(x)_i=x_i+x_{i+1}$ with indices modulo $4$ — each output uses the current entry and its right neighbor.
3. Compute the shifted input: $S(1,3,0,2)=(2,1,3,0)$ — the last entry wraps to the front.
4. Apply $F$ after shifting: $F(Sx)=(2+1,1+3,3+0,0+2)=(3,4,3,2)$ — this is the transform-then-process path.
5. Apply $F$ before shifting: $F(x)=(1+3,3+0,0+2,2+1)=(4,3,2,3)$ — this is the process path.
6. Shift that output: $S(F(x))=(3,4,3,2)$ — this is the process-then-transform path.
7. Compare the two results: $F(Sx)=S(F(x))$ — the map is equivariant for this shift.
8. The same index argument works for any length-$4$ vector — modulo indexing makes the neighbor rule commute with cyclic shifts.

**Symbols.** $G$ is the symmetry group; $X$ is the input set; $Y$ is the output set; $g\cdot x$ is the action of $g$ on the input; $g\cdot F(x)$ is the corresponding action on the output; $F:X\to Y$ is the map being tested; $S$ is a cyclic shift; indices modulo $4$ mean position $4$ is position $0$ again.

**Real-World Applications (§5).**
1. **CNN translation-equivariance** — a bright pixel moving from index $5$ to index $7$ should move the convolution response peak by the same $2$ indices.
2. **Segmentation masks** — if an image shifts by $(3,-2)$, a mask pixel at $(20,10)$ should shift to $(23,8)$.
3. **Keypoint detection** — in a width-$100$ image with coordinates $0$ to $99$, a horizontal flip sends keypoint $(40,60)$ to $(59,60)$.
4. **Vector fields** — a force vector $(2,0)$ rotated by $90^\circ$ becomes $(0,2)$, so the output rotates with the coordinate system.
5. **GNN node embeddings** — swapping node labels $0$ and $2$ in a path graph changes aggregate outputs from $[7,14,12]$ to $[12,14,7]$, the same swap applied to the original output.
6. **Robotic policies** — if an action vector is $(1,2)$, a $180^\circ$ scene rotation should produce $(-1,-2)$.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted content for one lesson. The labels are plan shorthand; in the app they become flowing prose in the same plain textbook voice as the model entry. Each Apps line has exactly six concept-specific, verified numeric uses.

### `math-10-01` — Groups  · AUTHOR derivation

**Connections (§1).**
> This lesson starts with the basic language of symmetry. You have already seen operations such as adding numbers, rotating shapes, and swapping objects; a group is the common structure behind those examples. The point is not that the objects look alike, but that their moves can be combined, undone, and organized around an identity move. This gives representation theory its foundation, because later lessons will turn these abstract moves into actions on data and matrices.

**Motivation & Intuition (§2).**
> A group is a set of moves that can be composed, undone, and kept inside the same system. If you rotate a square by $90^\circ$ and then by another $90^\circ$, the result is still one of the allowed rotations of the square. If you add times on a clock, the result wraps around but remains a clock time. This closure is what lets symmetry be studied as its own algebraic object.
>
> The identity and inverse conditions make the system stable. The identity is the no-op move, such as rotating by $0^\circ$ or adding $0$ modulo a number. An inverse is the move that gets you back where you started. These requirements are what make rotations, modular addition, and permutations usable as exact symmetry models in later lessons.

**Definition & Assumptions (§3).** Check that $\mathbb Z_5=\{0,1,2,3,4\}$ under addition modulo $5$ is a group: 1. Closure: $(a+b)\bmod5$ is one of $0,1,2,3,4$ — remainders modulo $5$ stay in the set. 2. Associativity: $(a+b)+c\equiv a+(b+c)\pmod5$ — ordinary integer addition is associative before taking the remainder. 3. Identity: $0+a\equiv a+0\equiv a\pmod5$ — adding zero changes no remainder. 4. Inverse: each $a$ has $5-a$ modulo $5$ — their sum is $0$ modulo $5$. 5. For $3$, the inverse is $2$ because $3+2=5\equiv0\pmod5$.

**Symbols.** $G$ is the set; $ab$ or $a+b$ is the group operation; $e$ is the identity; $g^{-1}$ is the inverse; $\mathbb Z_5$ is integers modulo $5$.

**Real-World Applications (§5).**
1. **Clock arithmetic** — on a $12$-hour clock, $9+5\equiv2$ and $9^{-1}=3$ under addition.
2. **Square rotations** — four $90^\circ$ turns give $r^4=e$.
3. **Permutation swaps** — $(1\ 2)^2=e$.
4. **Modular multiplication** — modulo $11$, $3\cdot4\equiv1$, so $4$ is the inverse of $3$.
5. **Image flips** — a horizontal flip has order $2$.
6. **Data augmentation** — by $0,90,180,270^\circ$ rotations forms a $4$-element cyclic group.

### `math-10-02` — Subgroups and homomorphisms  · deepen derivation

**Connections (§1).**
> Groups often contain smaller symmetry systems inside them, and different groups can also describe the same composition pattern at different levels of detail. This lesson introduces both ideas. A subgroup keeps only some moves while still satisfying the group rules. A homomorphism translates one group into another while preserving how operations combine.

**Motivation & Intuition (§2).**
> A subgroup is a smaller collection of moves that is still complete as a group. If the larger group is all shifts around a $12$-hour clock, the shifts by multiples of $3$ form a smaller stable system. You can combine them, undo them, and remain inside the same four shifts.
>
> A homomorphism is a structure-preserving translation. It may simplify the group by forgetting detail, such as reducing an integer modulo $3$, but it must preserve the way products or sums compose. This is why homomorphisms are the right tool for comparing symmetries across clocks, codes, feature hashes, and matrix representations.

**Definition & Assumptions (§3).** Prove the subgroup test and verify $H=\{0,3,6,9\}\subset\mathbb Z_{12}$: 1. State the test: nonempty $H$ is a subgroup if $a,b\in H$ implies $ab^{-1}\in H$ — this single condition packages closure and inverses. 2. In additive notation, $ab^{-1}$ becomes $a-b$ — inverse means negation. 3. $0\in H$, so $H$ is nonempty — the identity is present. 4. Differences of multiples of $3$ are multiples of $3$ modulo $12$ — $a-b$ stays in $\{0,3,6,9\}$. 5. Taking $a=0$ gives $-b\in H$ — inverses are included. 6. Using $-b\in H$ and the test with $a$ and $-b$ gives $a+b\in H$ — closure follows. 7. For $\phi(x)=x\bmod3$, $\phi(a+b)=\phi(a)+\phi(b)$ because remainders preserve addition modulo $3$.

**Symbols.** $H\subseteq G$ is a candidate subgroup; $\phi:G\to K$ is a homomorphism; $ab^{-1}$ means compose $a$ with the inverse of $b$; $\mathbb Z_{12}$ is addition modulo $12$.

**Real-World Applications (§5).**
1. **Parity map** — $7+9=16$ maps to $0$, matching $1+1=0$ in $\mathbb Z_2$.
2. **Feature hashing** — $14\equiv29\equiv4\pmod5$.
3. **Periodic signal** — length-$8$ pattern with period $2$ is fixed by shifts $0,2,4,6$, a $4$-element subgroup.
4. **Robot rotations** — in $30^\circ$ increments give $12$ allowed turns.
5. **Representation sanity check** — if $r^3=e$, then a homomorphic matrix representation must satisfy $\rho(r)^3=I$.
6. **Binary code** — $111+111=000$ modulo $2$, so $\{000,111\}$ is closed.

### `math-10-03` — Group actions  · deepen derivation

**Connections (§1).**
> Once a group has been defined, the next step is to let it move something. A group action connects the algebra of symmetry to a concrete set, such as pixels, vertices, tokens, or points in the plane. This is the bridge from abstract group elements to transformations of data. Later lessons use the same idea to define orbits, stabilizers, invariance, and equivariance.

**Motivation & Intuition (§2).**
> A group action gives abstract symmetry somewhere to move. The group element is the instruction, and the set supplies the objects being moved. A shift by $2$ in a cyclic group can move a position label, a rotation can move a point, and a permutation can move entries of a vector.
>
> The important rule is compatibility with composition. Doing two group moves and then acting on the set must agree with acting one move at a time. This makes the action faithful to the group law, so the algebraic product corresponds to the actual transformation seen by the data.

**Definition & Assumptions (§3).** Verify the action of $\mathbb Z_4$ on positions $X=\{0,1,2,3\}$ by $k\cdot x=(x+k)\bmod4$: 1. Closure: $(x+k)\bmod4$ is in $X$ — positions wrap around. 2. Identity: $0\cdot x=(x+0)\bmod4=x$ — the zero shift changes nothing. 3. Composition: $(a+b)\cdot x=(x+a+b)\bmod4$ — combine shifts before acting. 4. Acting in stages gives $a\cdot(b\cdot x)=((x+b)+a)\bmod4$ — first shift by $b$, then by $a$. 5. The two expressions are equal because addition is associative and commutative in $\mathbb Z_4$ — the action law holds. 6. Example: $2\cdot3=(3+2)\bmod4=1$, and $1\cdot(2\cdot3)=1\cdot1=2=(1+2)\cdot3$.

**Symbols.** $G$ is the group; $X$ is the set being acted on; $g\cdot x$ is the image of $x$ under $g$; $e$ is the identity; $\operatorname{Sym}(X)$ is the permutation group of $X$.

**Real-World Applications (§5).**
1. **Pixel translation** — shift $(2,-1)$ sends pixel $(10,7)$ to $(12,6)$.
2. **Horizontal flip** — in width $100$ sends $x=20$ to $79$.
3. **Token swap** — $(1\ 3)$ sends $[4,8,2]$ to $[2,8,4]$.
4. **Plane rotation** — a $90^\circ$ rotation sends $(3,1)$ to $(-1,3)$.
5. **Worker scheduling** — shift by $5$ on $8$ workers sends worker $6$ to $3$.
6. **Triangle rotation** — sends vertices $0\to1$, $1\to2$, $2\to0$.

### `math-10-04` — Orbits and stabilizers  · deepen derivation

**Connections (§1).**
> Group actions let symmetries move points, and this lesson studies what those movements reveal. The orbit records all places a point can go under the group. The stabilizer records all moves that keep that point fixed. Together they describe how a global symmetry group appears from the viewpoint of one chosen point.

**Motivation & Intuition (§2).**
> The orbit of a point is everywhere the group can move it. For a vertex of a square, rotations and reflections may carry it to any of the four vertices. For the center of a regular polygon, many symmetries may act but the point does not move at all, so its orbit is small.
>
> The stabilizer measures the opposite behavior: it is the set of group elements that leave the point fixed. Orbit-stabilizer says these two pieces multiply back to the group size. If many symmetries fix the point, fewer distinct orbit positions remain; if almost no symmetry fixes it, the orbit is large.

**Definition & Assumptions (§3).** Prove $|G\cdot x|=|G|/|G_x|$ for finite $G$: 1. Define $\pi:G\to G\cdot x$ by $\pi(g)=g\cdot x$ — every group element sends $x$ somewhere in its orbit. 2. The map is onto by the definition of orbit — every orbit point is $g\cdot x$ for some $g$. 3. Two elements $g,h$ land at the same point when $g\cdot x=h\cdot x$ — this is equality of images. 4. Apply $h^{-1}$ to get $(h^{-1}g)\cdot x=x$ — the difference between $g$ and $h$ stabilizes $x$. 5. Thus $h^{-1}g\in G_x$, so $g\in hG_x$ — the elements landing at a fixed orbit point form a coset of the stabilizer. 6. Each coset has $|G_x|$ elements — multiplying by $h$ is a bijection. 7. The group splits into one such coset for each orbit point, so $|G|=|G\cdot x|\,|G_x|$.

**Symbols.** $G\cdot x$ is the orbit; $G_x$ is the stabilizer; $|A|$ is the number of elements in finite set $A$; $hG_x$ is a left coset.

**Real-World Applications (§5).**
1. **Dihedral square symmetries** — a vertex has orbit size $4$ and stabilizer size $2$, so $4\cdot2=8$.
2. **Rotations only** — a square vertex has orbit size $4$ and stabilizer size $1$.
3. **Hexagon center** — under rotations, orbit size $1$ and stabilizer size $6$.
4. **$5$-cycle graph** — every vertex lies in an orbit of size $5$.
5. **Finite group count** — if $|G|=12$ and $|G_x|=3$, then the orbit has $4$ points.
6. **Cylinder grasping** — eight sampled cylinder rotations can collapse one grasp orbit to size $1$ when every rotation fixes the grasp class.

### `math-10-05` — Linear representations  · deepen derivation

**Connections (§1).**
> A group action can move arbitrary objects, but machine learning often represents data as vectors. Linear representations bring symmetry into vector spaces by assigning a matrix to each group element. This keeps the group law while making the action compatible with linear algebra. It prepares the ground for feature channels, irreducible pieces, characters, and equivariant neural layers.

**Motivation & Intuition (§2).**
> A linear representation turns each group element into an invertible matrix. A rotation becomes a rotation matrix, a swap becomes a permutation matrix, and a cyclic shift becomes a matrix that rearranges coordinates. The original symmetry is now something that can act directly on vectors and activations.
>
> The key requirement is that the group law becomes matrix multiplication. If two quarter-turns make a half-turn in the group, the two corresponding matrices must multiply to the half-turn matrix. This is why representations let abstract symmetry constrain concrete computations.

**Definition & Assumptions (§3).** Work with $C_4=\langle r:r^4=e\rangle$ and $\rho(r)=\begin{pmatrix}0&-1\\1&0\end{pmatrix}$: 1. Compute $\rho(r)^2=\begin{pmatrix}-1&0\\0&-1\end{pmatrix}$ — two quarter-turns make a half-turn. 2. Compute $\rho(r)^4=I$ — four quarter-turn matrices return the identity. 3. Since $r^4=e$, the matrix equation $\rho(r)^4=\rho(e)$ matches the group relation. 4. The homomorphism law gives $\rho(r^a r^b)=\rho(r^{a+b})=\rho(r)^a\rho(r)^b$ — composition of rotations becomes multiplication of matrices. 5. The identity follows from $\rho(e)=\rho(ee)=\rho(e)^2$ and invertibility — multiplying by $\rho(e)^{-1}$ gives $\rho(e)=I$.

**Symbols.** $\rho$ is the representation map; $GL(V)$ is the group of invertible linear maps on $V$; $I$ is the identity matrix; $C_4$ is the cyclic group of four rotations.

**Real-World Applications (§5).**
1. **Plane rotation** — a $90^\circ$ rotation sends $(4,1)$ to $(-1,4)$.
2. **Fourier shift** — for length $4$, one cyclic shift acts on Fourier frequency $1$ by multiplying by $i$.
3. **Swap matrix** — $\begin{pmatrix}0&1\\1&0\end{pmatrix}$ sends $(7,2)$ to $(2,7)$ and squares to $I$.
4. **Vector feature** — rotating vector feature $(3,4)$ by $90^\circ$ gives $(-4,3)$ with length $5$.
5. **$3$-D rotation** — preserves $\|(1,2,2)\|=3$.
6. **Group relation check** — if $r$ is a $120^\circ$ turn, a representation must satisfy $\rho(r)^3=I$.

### `math-10-06` — Subrepresentations  · deepen derivation

**Connections (§1).**
> A representation may contain smaller vector spaces that are preserved by all symmetry operations. These preserved pieces are subrepresentations. They are the representation-theoretic analogue of subgroups, but now the smaller object is a subspace rather than a subset of moves. Finding them is the first step toward decomposing a representation into simpler feature types.

**Motivation & Intuition (§2).**
> A subrepresentation is an invariant subspace that the whole group action respects. If every allowed matrix sends vectors in a line back to that same line, then the line carries its own smaller representation. The symmetry does not mix that line with the rest of the space.
>
> This matters because invariant subspaces reveal structure in features. A scalar channel, a constant signal, or a preserved coordinate axis can be processed separately while still respecting the same group action. Later lessons use this idea to distinguish reducible and irreducible representations.

**Definition & Assumptions (§3).** Show the $x$-axis is a subrepresentation for $C_2=\{e,s\}$ acting by $\rho(s)=\begin{pmatrix}1&0\\0&-1\end{pmatrix}$: 1. Let $W=\{(t,0):t\in\mathbb R\}$ — this is the $x$-axis. 2. Check $W$ is a subspace — sums and scalar multiples of $(t,0)$ still have second coordinate $0$. 3. Apply the identity: $\rho(e)(t,0)=(t,0)$ — identity preserves $W$. 4. Apply the reflection: $\rho(s)(t,0)=(t,0)$ — the $x$-axis is fixed pointwise. 5. Every group element preserves $W$, so $W$ is a subrepresentation. 6. The restricted maps still multiply correctly because they are the same maps, only viewed on $W$.

**Symbols.** $V$ is the full vector space; $W\subseteq V$ is the candidate subspace; $\rho(g)W\subseteq W$ means every vector in $W$ stays in $W$ after applying $\rho(g)$; $\rho(g)|_W$ is the restricted map.

**Real-World Applications (§5).**
1. **Scalar feature channel** — a block with two vector channels and one scalar has a $1$-D scalar subrepresentation.
2. **Constant signal** — length-$4$ constant signal $(1,1,1,1)$ is fixed by all cyclic shifts.
3. **Coordinate axes** — reflection across the $x$-axis preserves two $1$-D coordinate-axis subrepresentations.
4. **Node permutations** — for $5$ nodes, $(1,1,1,1,1)$ is fixed by all $5!$ node permutations.
5. **Diagonal action** — $\operatorname{diag}(1,-1)$ preserves the first coordinate line and flips the second.
6. **Block processing** — a preserved $3$-D subspace inside a $10$-D feature space can be processed by a $3\times3$ block.

### `math-10-07` — Reducibility  · explain-only

**Connections (§1).**
> Subrepresentations show that a representation may contain smaller invariant pieces. Reducibility names the case where such a nontrivial piece exists. This lesson is mainly about classification rather than a computation. It helps explain why some symmetry-aware models can be written in blocks instead of as one large dense transformation.

**Motivation & Intuition (§2).**
> A representation is reducible when it contains a nonzero proper subrepresentation. The subspace must not be the zero space and must not be the whole space, but it must be preserved by every group element. When this happens, part of the representation can evolve under the symmetry without mixing with the rest.
>
> In a good basis, reducibility often reveals block structure and smaller symmetry stories. Instead of one large matrix acting on all coordinates at once, the action may separate into independent blocks. This is useful both conceptually and computationally, because it identifies feature groups that should or should not communicate under symmetry-preserving maps.

**Definition & Assumptions (§3).** Explain-only: reducibility is a classification definition rather than a non-obvious identity. Teach it by checking invariant subspaces and by contrasting reducible with irreducible examples.

**Symbols.** $V$ is the whole representation space; $W$ is a nonzero proper invariant subspace; reducible means $\{0\}\ne W\ne V$ and $\rho(g)W\subseteq W$ for all $g$.

**Real-World Applications (§5).**
1. **Block computation** — two $50\times50$ blocks cost about $2\cdot50^3=250{,}000$ multiplications versus $100^3=1{,}000{,}000$ for one dense block.
2. **Equivariant features** — a $7$-channel equivariant feature can split into blocks $3,2,2$.
3. **Shift signals** — a length-$8$ shift representation decomposes into $8$ Fourier modes.
4. **Molecular vibrations** — a $6$-D molecular vibration space may split as $1+2+3$.
5. **Graph pooling** — for $10$ nodes, mean pooling projects onto the $1$-D constant subspace.
6. **Parameter removal** — removing cross-block weights in a $4+4$ split removes $2\cdot4\cdot4=32$ parameters.

### `math-10-08` — Irreducible representations  · explain-only

**Connections (§1).**
> Reducibility asks whether a representation can be split into smaller invariant parts. Irreducibility is the complementary idea: a representation has no smaller nonzero invariant subspace. These irreducible pieces are the basic building blocks used throughout representation theory. Later tools such as Schur's lemma, characters, and orthogonality are most powerful on these pieces.

**Motivation & Intuition (§2).**
> An irreducible representation has no smaller nonzero invariant subspace. Once a vector in the space is allowed to move under the group action, the symmetry can reach enough directions that no proper subspace remains closed under all moves. This makes the representation an indivisible feature type for that symmetry.
>
> After decomposition, irreducibles describe the basic feature types allowed by the symmetry. Scalars, vectors, Fourier modes, and higher geometric feature types can behave differently under the same group. The field matters because a representation that splits over $\mathbb C$ may not split the same way over $\mathbb R$.

**Definition & Assumptions (§3).** Explain-only: irreducibility is a definition whose content is checked by ruling out invariant subspaces. Do not force a proof; show representative cases and note dependence on the field.

**Symbols.** Irreducible means the only subrepresentations are $\{0\}$ and $V$; the field, such as $\mathbb R$ or $\mathbb C$, matters because it changes which subspaces are available.

**Real-World Applications (§5).**
1. **Cyclic signal** — a length-$8$ cyclic signal has $8$ complex one-dimensional Fourier irreps.
2. **Channel accounting** — two scalar irreps plus one $2$-D vector irrep give $1+1+2=4$ channels.
3. **$3$-D rotation features** — scalar, vector, and rank-$2$ symmetric traceless types have $1$, $3$, and $5$ components.
4. **Feature splitting** — a $6$-D feature split as $1+2+3$ uses three irrep blocks.
5. **Cycle graph** — a $4$-cycle graph has Fourier modes $0,1,2,3$.
6. **Symmetry-preserving operator** — between incompatible irreps has matrix entry $0$.

### `math-10-09` — Schur's lemma  · AUTHOR derivation

**Connections (§1).**
> Irreducible representations are the atomic pieces of a symmetry action, and Schur's lemma explains how rigid maps between those pieces must be. The maps in this lesson are intertwiners: linear maps that commute with the group action. This connects decomposition to model design, because equivariant linear layers are exactly the maps that respect symmetry. Schur's lemma tells us many such blocks are forced to be zero or scalar.

**Motivation & Intuition (§2).**
> Schur's lemma says maps that respect group actions are rigid on irreducible pieces. If a map sends one irreducible representation to another while commuting with every group element, its kernel and image must themselves be invariant subspaces. Irreducibility leaves very few possibilities for those subspaces.
>
> Between different irreducible atoms, an intertwiner cannot partially mix one feature type into another. It either vanishes or becomes an isomorphism in the compatible case. On one complex irreducible piece, any self-map that commutes with the whole group is only a scalar multiple of identity, which sharply limits the parameters of equivariant layers.

**Definition & Assumptions (§3).** Prove the standard complex form: 1. Let $T:V\to W$ satisfy $T\rho_V(g)=\rho_W(g)T$ — this is an intertwiner. 2. If $v\in\ker T$, then $T\rho_V(g)v=\rho_W(g)Tv=0$ — the kernel is preserved by $G$. 3. Since $V$ is irreducible, $\ker T$ is either $0$ or $V$ — no other invariant subspace exists. 4. The image is preserved because $\rho_W(g)T(v)=T\rho_V(g)v$ — outputs of $T$ stay in the image after the group acts. 5. Since $W$ is irreducible, $\operatorname{im}T$ is either $0$ or $W$. 6. If $T\ne0$, then $\ker T=0$ and $\operatorname{im}T=W$, so $T$ is an isomorphism. 7. If $V=W$ over $\mathbb C$, choose an eigenvalue $\lambda$ of $T$ — complex matrices have eigenvalues. 8. The map $T-\lambda I$ is also an intertwiner and has nonzero kernel — subtracting a scalar identity preserves commutation. 9. Irreducibility forces $T-\lambda I=0$, so $T=\lambda I$.

**Symbols.** $T$ is an intertwiner; $\rho_V$ and $\rho_W$ are group representations; $\ker T$ is the set mapped to zero; $\operatorname{im}T$ is the image; $\lambda$ is an eigenvalue.

**Real-World Applications (§5).**
1. **Nonisomorphic irreps** — between nonisomorphic irreps, an equivariant linear block has $0$ parameters.
2. **Matching complex irreps** — between matching complex irreps with multiplicity one, the block is one scalar times identity.
3. **Parameter count** — a dense $3\times3$ block has $9$ entries, but Schur's scalar block has $1$ parameter.
4. **Commuting operator** — on irrep blocks of sizes $2$ and $3$, a commuting operator looks like $\lambda I_2\oplus\mu I_3$.
5. **Repeated eigenvalue** — if a $2$-D irrep occurs once, a symmetric operator has the same eigenvalue repeated $2$ times on that block.
6. **Scalar self-map** — if an intertwiner on a complex irreducible representation has eigenvalue $3$, then $T=3I$.

### `math-10-10` — Characters  · deepen derivation

**Connections (§1).**
> Representations can contain many matrix entries, and those entries change when the basis changes. Characters compress a representation by recording only the trace of each group element's matrix. This loses some basis-dependent detail but keeps important symmetry information. The next lesson uses characters as vectors whose inner products count irreducible pieces.

**Motivation & Intuition (§2).**
> A character records the trace of each representation matrix. The trace is stable under change of basis, so it captures something intrinsic about how a group element acts. At the identity, the character simply counts the dimension of the representation space.
>
> Characters also respect conjugacy. Group elements that are the same up to relabeling have representation matrices that are similar, and similar matrices have the same trace. This makes characters especially efficient for finite groups, where many elements can be summarized by conjugacy classes rather than treated one at a time.

**Definition & Assumptions (§3).** Derive two character facts: 1. Define $\chi_\rho(g)=\operatorname{tr}(\rho(g))$ — the character is trace after representing $g$. 2. At the identity, $\rho(e)=I_V$ — representations send identity to identity. 3. Therefore $\chi_\rho(e)=\operatorname{tr}(I_V)=\dim V$ — the identity trace counts basis vectors. 4. For a conjugate element, $\rho(hgh^{-1})=\rho(h)\rho(g)\rho(h)^{-1}$ — homomorphism turns conjugation into similarity. 5. Trace is invariant under similarity, so $\chi_\rho(hgh^{-1})=\chi_\rho(g)$ — characters are constant on conjugacy classes. 6. For $C_4$ on $\mathbb R^2$ by rotations, traces of $I,R,R^2,R^3$ are $2,0,-2,0$.

**Symbols.** $\chi_\rho$ is the character of representation $\rho$; $\operatorname{tr}$ sums diagonal entries; $hgh^{-1}$ is a conjugate of $g$; $\dim V$ is the vector-space dimension.

**Real-World Applications (§5).**
1. **Decomposition fingerprint** — if $\chi=2\chi_a+\chi_b$, then irrep $a$ appears twice and $b$ once.
2. **Permutation character** — cycle type $(12)(345)$ on $5$ items fixes $0$ points, so character $0$.
3. **$C_4$ frequency** — on $C_4$, frequency-$1$ character sends $r$ to $i$ and $r^2$ to $-1$.
4. **Rotation trace** — a $180^\circ$ rotation about $z$ has matrix $\operatorname{diag}(-1,-1,1)$ and character $-1$.
5. **Scalar channels** — three scalar channels have identity character $3$.
6. **Similarity invariance** — if $A$ has trace $5$, then $PAP^{-1}$ also has trace $5$.

### `math-10-11` — Orthogonality relations  · AUTHOR derivation

**Connections (§1).**
> Characters turn representations into compact functions on the group. Orthogonality relations explain why those functions are useful for decomposition. Irreducible characters behave like an orthonormal basis for the representation information we need. This gives a practical way to count feature types by taking averaged inner products.

**Motivation & Intuition (§2).**
> Character orthogonality makes irreducible characters behave like perpendicular unit vectors. The inner product averages over the group, so it compares two symmetry fingerprints across every group element at once. Distinct irreducible characters average to zero against each other, while each one has norm one.
>
> Once this orthogonality is available, multiplicities become projections. If a representation character is a sum of irreducible characters, its inner product with one irreducible character extracts exactly that irrep's coefficient. This turns a structural decomposition problem into a calculation with numbers.

**Definition & Assumptions (§3).** Work the $C_2$ character table and state the general theorem: 1. Define $\langle\chi,\psi\rangle=\frac1{|G|}\sum_{g\in G}\chi(g)\overline{\psi(g)}$ — this is the averaged complex dot product. 2. For $C_2=\{e,s\}$, the trivial character is $(1,1)$ and the sign character is $(1,-1)$. 3. Compute $\langle\chi_{\mathrm{triv}},\chi_{\mathrm{sign}}\rangle=\frac12(1\cdot1+1\cdot(-1))=0$ — different irreducibles are orthogonal. 4. Compute $\langle\chi_{\mathrm{sign}},\chi_{\mathrm{sign}}\rangle=\frac12(1^2+(-1)^2)=1$ — each irreducible has unit norm. 5. The finite-group theorem says the same holds for all irreducible complex characters. 6. If $\chi=\sum_i m_i\chi_i$, then $\langle\chi,\chi_j\rangle=m_j$ because all cross terms vanish and $\langle\chi_j,\chi_j\rangle=1$.

**Symbols.** $\chi,\psi$ are class functions or characters; $\overline{\psi(g)}$ is complex conjugation; $|G|$ is group size; $m_i$ is the multiplicity of irreducible $i$.

**Real-World Applications (§5).**
1. **Multiplicity count** — if $\langle\chi,\chi_i\rangle=4$, irrep $i$ appears four times.
2. **Fourier orthogonality** — for length $4$, $1+i-1-i=0$, so Fourier frequencies $0$ and $1$ are orthogonal.
3. **Constant signal** — constant signal $[3,3,3,3]$ has average coefficient $12/4=3$ and zero nonzero-frequency coefficients.
4. **Scalar channels** — if a feature character has inner product $5$ with the scalar irrep, it has $5$ scalar channels.
5. **Irrep inventory** — character inner products $(2,1,0)$ mean two copies of type A, one of B, none of C.
6. **Compression** — a signal with $3$ nonzero character coefficients among $16$ stores $3$ complex coefficients instead of $16$ samples.

### `math-10-12` — Representations of continuous groups  · deepen derivation

**Connections (§1).**
> Finite groups describe symmetries with separate moves, such as four rotations of a square. Continuous groups describe symmetries that vary smoothly, such as rotations by any angle. Their representations still preserve the group law, but now the matrices change continuously with a parameter. This is the setting where calculus, geometry, and symmetry begin to interact directly.

**Motivation & Intuition (§2).**
> Continuous groups, such as rotations by any angle, need representations that vary continuously or smoothly. A tiny change in angle should produce a tiny change in the matrix and in the transformed vector. Without that regularity, the representation would not reflect the geometry of the underlying group.
>
> The homomorphism law remains the same as in finite representation theory. Applying a rotation by $\phi$ and then by $\theta$ should match the matrix for rotation by $\theta+\phi$. The new ingredient is that the entries are functions of a continuous parameter, so differential ideas such as generators and small-angle approximations become available.

**Definition & Assumptions (§3).** Verify the standard $SO(2)$ representation: 1. Define $\rho(\theta)=\begin{pmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{pmatrix}$ — this rotates vectors by angle $\theta$. 2. Multiply $\rho(\theta)\rho(\phi)$ — matrix multiplication gives entries with products of sines and cosines. 3. Use angle-addition formulas: $\cos(\theta+\phi)=\cos\theta\cos\phi-\sin\theta\sin\phi$ and $\sin(\theta+\phi)=\sin\theta\cos\phi+\cos\theta\sin\phi$. 4. The product equals $\rho(\theta+\phi)$ — the homomorphism law holds. 5. Entries are continuous functions of $\theta$ — nearby rotations give nearby matrices. 6. Example: $\rho(\pi/2)(1,2)=(-2,1)$ and both vectors have length $\sqrt5$.

**Symbols.** $SO(2)$ is the circle group of plane rotations; $\theta,\phi$ are angles; $\rho(\theta)$ is the rotation matrix; continuity means matrix entries vary continuously with the group parameter.

**Real-World Applications (§5).**
1. **Rigid motion** — a $90^\circ$ rotation followed by translation $(2,3)$ sends point $(1,0)$ to $(2,4)$.
2. **Vector channel** — a vector channel $(1,0)$ rotated by $30^\circ$ becomes approximately $(0.866,0.5)$.
3. **Velocity norm** — velocity $(3,4)$ keeps norm $5$ under any rotation.
4. **Phase shift** — phase shift $\pi/2$ multiplies a complex Fourier coefficient by $i$.
5. **Angle error** — angle error from $35^\circ$ to $38^\circ$ is $3^\circ\approx0.052$ radians.
6. **Generator step** — a small time step $0.1$ with generator speed $2$ gives first-order phase change $0.2$ radians.

### `math-10-13` — Invariance  · AUTHOR derivation

**Connections (§1).**
> Group actions describe how inputs move under symmetry, and orbits collect all transformed versions of one input. Invariance describes functions that deliberately ignore movement along those orbits. This is the right language for labels, scores, distances, energies, and pooled summaries that should not change when the input is transformed. It also sets up equivariance by showing what happens when the output action is trivial.

**Motivation & Intuition (§2).**
> An invariant function gives the same value across every transformed version of an input. If an image shifts slightly but its class label stays the same, the classifier is being asked to behave invariantly. If a molecule rotates in space but its bond length remains the same, the bond-length function is invariant to rotation.
>
> Invariance intentionally forgets variation along group orbits. It collapses all transformed copies of an input to one shared output value. This is useful for final decisions and summaries, but it can discard location or orientation information that some tasks still need.

**Definition & Assumptions (§3).** Show invariance is equivariance with a trivial output action, and prove the orbit statement: 1. Invariance is $f(g\cdot x)=f(x)$ for all $g$ — transforming input does not change output. 2. Give $Y$ the trivial action $g\cdot y=y$ for all $g$ and $y$ — the group does nothing to outputs. 3. The equivariance equation becomes $f(g\cdot x)=g\cdot f(x)$. 4. Substitute the trivial action: $g\cdot f(x)=f(x)$ — the equation is exactly invariance. 5. If $y$ lies in the orbit of $x$, then $y=g\cdot x$ for some $g$ — this is the definition of orbit. 6. Invariance gives $f(y)=f(g\cdot x)=f(x)$ — invariant functions are constant on orbits. 7. For $f(x,y)=x^2+y^2$ and $R(x,y)=(-y,x)$, $f(R(x,y))=(-y)^2+x^2=x^2+y^2$ — squared norm is rotation-invariant.

**Symbols.** $f:X\to Y$ is the invariant map; $G$ acts on $X$; trivial action on $Y$ means outputs do not move; an orbit is all points $g\cdot x$.

**Real-World Applications (§5).**
1. **Digit classification** — shifted digit scores $0.91$ and $0.90$ should keep label $7$.
2. **Set features** — mean of set features $[2,4,10]$ is $16/3$ in any order.
3. **Distances** — points $(0,0)$ and $(3,4)$ remain distance $5$ after shifting both by $(10,-2)$.
4. **Energy** — samples $[2,-3]$ and $[-2,3]$ both have energy $13$.
5. **Node feature sum** — four node first-coordinates $1,0,3,2$ sum to $6$ under any node order.
6. **Molecular rotation** — a bond length of $1.5$ angstroms stays $1.5$ after rotating the molecule.

### `math-10-14` — Equivariance  · AUTHOR derivation

**Connections (§1).**
> This lesson builds on group actions and invariance. A group action says how a symmetry moves an input, and invariance says a function gives the same output after that movement. Equivariance keeps more information than invariance. It says the output should move in the matching way.
>
> This distinction is central in machine learning. A classifier may be invariant to a small translation because the class label should stay the same. A segmentation map, keypoint detector, vector field, or graph-node predictor should not stay fixed; it should transform along with the input. That is why equivariance is the right language for CNN feature maps, GNN node embeddings, pose predictions, and geometric neural networks.

**Motivation & Intuition (§2).**
> Equivariance describes a map that respects symmetry without discarding it. Suppose an image shifts one pixel to the right. If a feature extractor detects an edge at position $5$ before the shift, the corresponding feature should appear at position $6$ after the shift. The answer has changed, but it changed in the predictable way dictated by the same group action.
>
> The compact statement is that processing and transforming commute. Transform the input and then apply the map, or apply the map and then transform the output; an equivariant map gives the same result. This is stronger than ordinary consistency. It lets an architecture share parameters across symmetric positions while still producing location-aware or geometry-aware outputs.
>
> A short cyclic-shift example makes the rule concrete. Let $S$ be the right cyclic shift on a length-$4$ vector, so $S(x_0,x_1,x_2,x_3)=(x_3,x_0,x_1,x_2)$. Define
> $$
> F(x_0,x_1,x_2,x_3)=(x_0+x_1,\,x_1+x_2,\,x_2+x_3,\,x_3+x_0).
> $$
> For $x=(1,3,0,2)$, $F(x)=(4,3,2,3)$ and $S(F(x))=(3,4,3,2)$. Also $Sx=(2,1,3,0)$, so $F(Sx)=(3,4,3,2)$. The two paths agree: shifting after $F$ gives the same vector as applying $F$ after shifting.

**Definition & Assumptions (§3).** Display
$$
F(g\cdot x)=g\cdot F(x)
$$
for every $g\in G$ and $x\in X$.

Then derive the cyclic-shift check completely:
1. Define the right cyclic shift $S(x_0,x_1,x_2,x_3)=(x_3,x_0,x_1,x_2)$ — this is the group action on positions.
2. Define $F(x)_i=x_i+x_{i+1}$ with indices modulo $4$ — each output uses the current entry and its right neighbor.
3. Compute the shifted input: $S(1,3,0,2)=(2,1,3,0)$ — the last entry wraps to the front.
4. Apply $F$ after shifting: $F(Sx)=(2+1,1+3,3+0,0+2)=(3,4,3,2)$ — this is the transform-then-process path.
5. Apply $F$ before shifting: $F(x)=(1+3,3+0,0+2,2+1)=(4,3,2,3)$ — this is the process path.
6. Shift that output: $S(F(x))=(3,4,3,2)$ — this is the process-then-transform path.
7. Compare the two results: $F(Sx)=S(F(x))$ — the map is equivariant for this shift.
8. The same index argument works for any length-$4$ vector — modulo indexing makes the neighbor rule commute with cyclic shifts.

**Symbols.** $G$ is the symmetry group; $X$ is the input set; $Y$ is the output set; $g\cdot x$ is the action of $g$ on the input; $g\cdot F(x)$ is the corresponding action on the output; $F:X\to Y$ is the map being tested; $S$ is a cyclic shift; indices modulo $4$ mean position $4$ is position $0$ again.

**Real-World Applications (§5).**
1. **CNN translation-equivariance** — a bright pixel moving from index $5$ to index $7$ should move the convolution response peak by the same $2$ indices.
2. **Segmentation masks** — if an image shifts by $(3,-2)$, a mask pixel at $(20,10)$ should shift to $(23,8)$.
3. **Keypoint detection** — in a width-$100$ image with coordinates $0$ to $99$, a horizontal flip sends keypoint $(40,60)$ to $(59,60)$.
4. **Vector fields** — a force vector $(2,0)$ rotated by $90^\circ$ becomes $(0,2)$, so the output rotates with the coordinate system.
5. **GNN node embeddings** — swapping node labels $0$ and $2$ in a path graph changes aggregate outputs from $[7,14,12]$ to $[12,14,7]$, the same swap applied to the original output.
6. **Robotic policies** — if an action vector is $(1,2)$, a $180^\circ$ scene rotation should produce $(-1,-2)$.

### `math-10-15` — Group-equivariant & geometric neural networks  · deepen derivation

**Connections (§1).**
> This lesson gathers the representation-theory ideas into neural-network architecture. Group actions specify how inputs transform, representations specify how feature spaces transform, and equivariance says each layer should commute with the symmetry. Invariant pooling then turns structured equivariant features into final predictions when the task requires a symmetry-independent answer. This is the path from algebraic symmetry to CNNs, GNNs, steerable channels, and geometric neural networks.

**Motivation & Intuition (§2).**
> Group-equivariant and geometric neural networks build symmetry into layers instead of hoping data augmentation teaches it. A convolutional rule with shared weights can produce outputs that shift when the input shifts. A steerable layer can rotate vector features in the same way the input geometry rotates. A graph layer can aggregate neighbors without depending on arbitrary node labels.
>
> Equivariant layers preserve structured outputs, and invariant readouts turn those structured features into class or graph-level predictions. This separation is useful because early layers often need to keep track of position, orientation, node identity, or geometry, while the final prediction may need to ignore some of those transformations. The cyclic convolution example shows the same commute rule in a small neural layer.

**Definition & Assumptions (§3).** Verify cyclic convolution equivariance for $(Fx)_i=2x_i-x_{i-1}$ on $x=[1,3,0,2]$: 1. Compute $F(x)=[2\cdot1-2,\,2\cdot3-1,\,2\cdot0-3,\,2\cdot2-0]=[0,5,-3,4]$ — the kernel is applied at every cyclic position. 2. Right-shift the input: $Sx=[2,1,3,0]$ — cyclic boundary wraps the last entry. 3. Apply the same convolution to $Sx$: $F(Sx)=[4,0,5,-3]$ — shared weights use the same local rule after shifting. 4. Right-shift the original output: $S(Fx)=[4,0,5,-3]$ — the output shifted by the same group action. 5. Compare: $F(Sx)=S(Fx)$ — the layer is translation-equivariant under cyclic shifts. 6. Add invariant pooling: $\max[0,5,-3,4]=5$ and $\max[4,0,5,-3]=5$ — pooling converts equivariant features into an invariant score.

**Symbols.** $F$ is a neural layer; $S$ is a cyclic shift; $x_i$ is input at position $i$; shared weights mean the same coefficients $2$ and $-1$ are used at every position; pooling is a readout that removes the group position.

**Real-World Applications (§5).**
1. **1-D CNN** — $F([1,3,0,2])=[0,5,-3,4]$ and $F(Sx)=S(Fx)=[4,0,5,-3]$.
2. **Invariant pooling** — both shifted feature maps have max value $5$.
3. **Group CNN** — over rotations $0,90,180,270^\circ$ creates $4$ orientation channels per learned filter.
4. **Steerable vector channel** — $(3,4)$ rotates by $90^\circ$ to $(-4,3)$ and keeps norm $5$.
5. **GNN aggregation** — neighbor features $5$ and $7$ sum to $12$ regardless of whether labels are ordered $(2,3)$ or $(3,2)$.
6. **Orbit coverage** — if rotations by $0,90,180,270^\circ$ are handled exactly, one labeled image covers an orbit of $4$ orientations.

---

## Build order

1. **Lock the model entry first:** author `math-10-14` in full prose, including the cyclic-shift worked example and the distinction between invariance and equivariance.
2. **Build the algebra spine:** author `math-10-01` through `math-10-06` so groups, homomorphisms, actions, orbit-stabilizer, representations, and subrepresentations have complete derivations.
3. **Handle decomposition carefully:** write `math-10-07` and `math-10-08` as explain-only definition lessons, then use `math-10-09` through `math-10-11` for Schur's lemma, characters, and orthogonality.
4. **Connect continuous and ML symmetry:** author `math-10-12` through `math-10-15` as the bridge into invariant features, equivariant maps, CNNs, GNNs, steerable channels, and geometric neural networks.
5. **Final QA:** re-run numeric checks with `python3` and `numpy`, scan for genuine unbalanced `$` delimiters or lost matrix row breaks, and confirm there are exactly 15 lesson specs with six applications each.
