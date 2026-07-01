module.exports = {
  "math-10-01": {
    connectionsProse: "<p>This lesson starts with the basic language of symmetry. You have already seen operations such as adding numbers, rotating shapes, and swapping objects; a group is the common structure behind those examples. The point is not that the objects look alike, but that their moves can be combined, undone, and organized around an identity move. This gives representation theory its foundation, because later lessons will turn these abstract moves into actions on data and matrices.</p>",
    motivation: "<p>A group is a set of moves that can be composed, undone, and kept inside the same system. If you rotate a square by $90^\\circ$ and then by another $90^\\circ$, the result is still one of the allowed rotations of the square. If you add times on a clock, the result wraps around but remains a clock time. This closure is what lets symmetry be studied as its own algebraic object.</p>" +
                "<p>The identity and inverse conditions make the system stable. The identity is the no-op move, such as rotating by $0^\\circ$ or adding $0$ modulo a number. An inverse is the move that gets you back where you started. These requirements are what make rotations, modular addition, and permutations usable as exact symmetry models in later lessons.</p>",
    definition: "<p>A group is a set $G$ with an operation that is closed, associative, has an identity, and gives every element an inverse.</p>" +
                "<p>For the example $\\mathbb Z_5=\\{0,1,2,3,4\\}$ under addition modulo $5$, the inverse condition includes $$3+2=5\\equiv0\\pmod5.$$</p>" +
                "<p><b>Assumptions that matter:</b> the operation is addition modulo $5$, so all results are reduced to one of the five remainders.</p>",
    symbols: [
      { sym: "$G$", desc: "the set" },
      { sym: "$ab$ or $a+b$", desc: "the group operation" },
      { sym: "$e$", desc: "the identity" },
      { sym: "$g^{-1}$", desc: "the inverse" },
      { sym: "$\\mathbb Z_5$", desc: "integers modulo $5$" }
    ],
    derivation: [
      { do: "Check closure in $\\mathbb Z_5$.", result: "$(a+b)\\bmod5$ is one of $0,1,2,3,4$", why: "remainders modulo $5$ stay in the set" },
      { do: "Check associativity.", result: "$(a+b)+c\\equiv a+(b+c)\\pmod5$", why: "ordinary integer addition is associative before taking the remainder" },
      { do: "Identify the identity.", result: "$0+a\\equiv a+0\\equiv a\\pmod5$", why: "adding zero changes no remainder" },
      { do: "Find inverses.", result: "each $a$ has $5-a$ modulo $5$", why: "their sum is $0$ modulo $5$" },
      { do: "Check the inverse of $3$.", result: "$3+2=5\\equiv0\\pmod5$", why: "$2$ gets $3$ back to the identity" }
    ],
    applications: [
      { title: "Clock arithmetic", background: "on a $12$-hour clock", numbers: "$9+5\\equiv2$ and $9^{-1}=3$ under addition" },
      { title: "Square rotations", background: "four quarter-turns return to the identity", numbers: "four $90^\\circ$ turns give $r^4=e$" },
      { title: "Permutation swaps", background: "doing the same swap twice is the identity", numbers: "$(1\\ 2)^2=e$" },
      { title: "Modular multiplication", background: "modulo $11$, $4$ undoes multiplication by $3$", numbers: "$3\\cdot4\\equiv1$, so $4$ is the inverse of $3$" },
      { title: "Image flips", background: "a horizontal flip undoes itself", numbers: "a horizontal flip has order $2$" },
      { title: "Data augmentation", background: "rotating by right angles gives a finite symmetry group", numbers: "by $0,90,180,270^\\circ$ rotations forms a $4$-element cyclic group" }
    ]
  },

  "math-10-02": {
    connectionsProse: "<p>Groups often contain smaller symmetry systems inside them, and different groups can also describe the same composition pattern at different levels of detail. This lesson introduces both ideas. A subgroup keeps only some moves while still satisfying the group rules. A homomorphism translates one group into another while preserving how operations combine.</p>",
    motivation: "<p>A subgroup is a smaller collection of moves that is still complete as a group. If the larger group is all shifts around a $12$-hour clock, the shifts by multiples of $3$ form a smaller stable system. You can combine them, undo them, and remain inside the same four shifts.</p>" +
                "<p>A homomorphism is a structure-preserving translation. It may simplify the group by forgetting detail, such as reducing an integer modulo $3$, but it must preserve the way products or sums compose. This is why homomorphisms are the right tool for comparing symmetries across clocks, codes, feature hashes, and matrix representations.</p>",
    definition: "<p>A subgroup is a subset $H\\subseteq G$ that is itself a group under the inherited operation, and a homomorphism is a map $\\phi:G\\to K$ that preserves products.</p>" +
                "<p>The subgroup test and homomorphism law are $$a,b\\in H\\Rightarrow ab^{-1}\\in H,\\qquad \\phi(ab)=\\phi(a)\\phi(b).$$</p>" +
                "<p><b>Assumptions that matter:</b> $H$ is nonempty, the operation is inherited from $G$, and additive notation changes $ab^{-1}$ into $a-b$.</p>",
    symbols: [
      { sym: "$H\\subseteq G$", desc: "a candidate subgroup" },
      { sym: "$\\phi:G\\to K$", desc: "a homomorphism" },
      { sym: "$ab^{-1}$", desc: "compose $a$ with the inverse of $b$" },
      { sym: "$\\mathbb Z_{12}$", desc: "addition modulo $12$" }
    ],
    derivation: [
      { do: "State the subgroup test.", result: "nonempty $H$ is a subgroup if $a,b\\in H$ implies $ab^{-1}\\in H$", why: "this single condition packages closure and inverses" },
      { do: "Translate to additive notation.", result: "$ab^{-1}$ becomes $a-b$", why: "inverse means negation" },
      { do: "Check nonemptiness for $H=\\{0,3,6,9\\}$.", result: "$0\\in H$", why: "the identity is present" },
      { do: "Check differences.", result: "differences of multiples of $3$ are multiples of $3$ modulo $12$", why: "$a-b$ stays in $\\{0,3,6,9\\}$" },
      { do: "Set $a=0$ in the test.", result: "$-b\\in H$", why: "inverses are included" },
      { do: "Use the test with $a$ and $-b$.", result: "$a+b\\in H$", why: "closure follows" },
      { do: "Check $\\phi(x)=x\\bmod3$.", result: "$\\phi(a+b)=\\phi(a)+\\phi(b)$", why: "remainders preserve addition modulo $3$" }
    ],
    applications: [
      { title: "Parity map", background: "addition then parity matches parity addition", numbers: "$7+9=16$ maps to $0$, matching $1+1=0$ in $\\mathbb Z_2$" },
      { title: "Feature hashing", background: "two ids can land in the same residue class", numbers: "$14\\equiv29\\equiv4\\pmod5$" },
      { title: "Periodic signal", background: "a repeating pattern is fixed by a subgroup of shifts", numbers: "length-$8$ pattern with period $2$ is fixed by shifts $0,2,4,6$, a $4$-element subgroup" },
      { title: "Robot rotations", background: "discretizing turns gives a cyclic subgroup of all rotations", numbers: "in $30^\\circ$ increments give $12$ allowed turns" },
      { title: "Representation sanity check", background: "relations must survive under a homomorphic matrix representation", numbers: "if $r^3=e$, then a homomorphic matrix representation must satisfy $\\rho(r)^3=I$" },
      { title: "Binary code", background: "the two codewords remain closed under bitwise addition", numbers: "$111+111=000$ modulo $2$, so $\\{000,111\\}$ is closed" }
    ]
  },

  "math-10-03": {
    connectionsProse: "<p>Once a group has been defined, the next step is to let it move something. A group action connects the algebra of symmetry to a concrete set, such as pixels, vertices, tokens, or points in the plane. This is the bridge from abstract group elements to transformations of data. Later lessons use the same idea to define orbits, stabilizers, invariance, and equivariance.</p>",
    motivation: "<p>A group action gives abstract symmetry somewhere to move. The group element is the instruction, and the set supplies the objects being moved. A shift by $2$ in a cyclic group can move a position label, a rotation can move a point, and a permutation can move entries of a vector.</p>" +
                "<p>The important rule is compatibility with composition. Doing two group moves and then acting on the set must agree with acting one move at a time. This makes the action faithful to the group law, so the algebraic product corresponds to the actual transformation seen by the data.</p>",
    definition: "<p>A group action of $G$ on $X$ assigns each $g\\in G$ a transformation of $X$ in a way that preserves identity and composition.</p>" +
                "<p>For $\\mathbb Z_4$ acting on $X=\\{0,1,2,3\\}$, the action is $$k\\cdot x=(x+k)\\bmod4.$$</p>" +
                "<p><b>Assumptions that matter:</b> positions are reduced modulo $4$, and the group operation is addition in $\\mathbb Z_4$.</p>",
    symbols: [
      { sym: "$G$", desc: "the group" },
      { sym: "$X$", desc: "the set being acted on" },
      { sym: "$g\\cdot x$", desc: "the image of $x$ under $g$" },
      { sym: "$e$", desc: "the identity" },
      { sym: "$\\operatorname{Sym}(X)$", desc: "the permutation group of $X$" }
    ],
    derivation: [
      { do: "Check closure.", result: "$(x+k)\\bmod4$ is in $X$", why: "positions wrap around" },
      { do: "Check the identity.", result: "$0\\cdot x=(x+0)\\bmod4=x$", why: "the zero shift changes nothing" },
      { do: "Combine shifts before acting.", result: "$(a+b)\\cdot x=(x+a+b)\\bmod4$", why: "this is the group product acting at once" },
      { do: "Act in stages.", result: "$a\\cdot(b\\cdot x)=((x+b)+a)\\bmod4$", why: "first shift by $b$, then by $a$" },
      { do: "Compare the two expressions.", result: "$(x+a+b)\\bmod4=((x+b)+a)\\bmod4$", why: "addition is associative and commutative in $\\mathbb Z_4$" },
      { do: "Work the example.", result: "$2\\cdot3=(3+2)\\bmod4=1$, and $1\\cdot(2\\cdot3)=1\\cdot1=2=(1+2)\\cdot3$", why: "the action law holds in concrete positions" }
    ],
    applications: [
      { title: "Pixel translation", background: "a shift adds the displacement to the pixel coordinates", numbers: "shift $(2,-1)$ sends pixel $(10,7)$ to $(12,6)$" },
      { title: "Horizontal flip", background: "flipping reverses the horizontal coordinate in a finite width", numbers: "in width $100$ sends $x=20$ to $79$" },
      { title: "Token swap", background: "a permutation swaps entries of a vector", numbers: "$(1\\ 3)$ sends $[4,8,2]$ to $[2,8,4]$" },
      { title: "Plane rotation", background: "a quarter-turn rotates coordinates", numbers: "a $90^\\circ$ rotation sends $(3,1)$ to $(-1,3)$" },
      { title: "Worker scheduling", background: "cyclic shifts can model reassignment", numbers: "shift by $5$ on $8$ workers sends worker $6$ to $3$" },
      { title: "Triangle rotation", background: "a $120^\\circ$ turn cycles the vertices", numbers: "sends vertices $0\\to1$, $1\\to2$, $2\\to0$" }
    ]
  },

  "math-10-04": {
    connectionsProse: "<p>Group actions let symmetries move points, and this lesson studies what those movements reveal. The orbit records all places a point can go under the group. The stabilizer records all moves that keep that point fixed. Together they describe how a global symmetry group appears from the viewpoint of one chosen point.</p>",
    motivation: "<p>The orbit of a point is everywhere the group can move it. For a vertex of a square, rotations and reflections may carry it to any of the four vertices. For the center of a regular polygon, many symmetries may act but the point does not move at all, so its orbit is small.</p>" +
                "<p>The stabilizer measures the opposite behavior: it is the set of group elements that leave the point fixed. Orbit-stabilizer says these two pieces multiply back to the group size. If many symmetries fix the point, fewer distinct orbit positions remain; if almost no symmetry fixes it, the orbit is large.</p>",
    definition: "<p>The orbit $G\\cdot x$ is all points reachable from $x$, and the stabilizer $G_x$ is all group elements that fix $x$.</p>" +
                "<p>For a finite group, orbit-stabilizer says $$|G\\cdot x|=\\frac{|G|}{|G_x|}.$$</p>" +
                "<p><b>Assumptions that matter:</b> $G$ is finite, and the action satisfies the group-action laws.</p>",
    symbols: [
      { sym: "$G\\cdot x$", desc: "the orbit" },
      { sym: "$G_x$", desc: "the stabilizer" },
      { sym: "$|A|$", desc: "the number of elements in finite set $A$" },
      { sym: "$hG_x$", desc: "a left coset" }
    ],
    derivation: [
      { do: "Define the orbit map.", result: "$\\pi:G\\to G\\cdot x$ by $\\pi(g)=g\\cdot x$", why: "every group element sends $x$ somewhere in its orbit" },
      { do: "Check surjectivity.", result: "$\\pi$ is onto", why: "every orbit point is $g\\cdot x$ for some $g$" },
      { do: "Compare two elements with the same image.", result: "$g\\cdot x=h\\cdot x$", why: "this is equality of images" },
      { do: "Apply $h^{-1}$.", result: "$(h^{-1}g)\\cdot x=x$", why: "the difference between $g$ and $h$ stabilizes $x$" },
      { do: "Rewrite using the stabilizer.", result: "$h^{-1}g\\in G_x$, so $g\\in hG_x$", why: "the elements landing at a fixed orbit point form a coset of the stabilizer" },
      { do: "Count each coset.", result: "each coset has $|G_x|$ elements", why: "multiplying by $h$ is a bijection" },
      { do: "Partition the group by orbit points.", result: "$|G|=|G\\cdot x|\\,|G_x|$", why: "the group splits into one such coset for each orbit point" }
    ],
    applications: [
      { title: "Dihedral square symmetries", background: "a vertex can move to four vertices and has two symmetries fixing it", numbers: "a vertex has orbit size $4$ and stabilizer size $2$, so $4\\cdot2=8$" },
      { title: "Rotations only", background: "rotations move a square vertex freely", numbers: "a square vertex has orbit size $4$ and stabilizer size $1$" },
      { title: "Hexagon center", background: "the center stays fixed under all rotations", numbers: "under rotations, orbit size $1$ and stabilizer size $6$" },
      { title: "$5$-cycle graph", background: "rotations carry each vertex to every other vertex", numbers: "every vertex lies in an orbit of size $5$" },
      { title: "Finite group count", background: "orbit size follows by dividing by the stabilizer", numbers: "if $|G|=12$ and $|G_x|=3$, then the orbit has $4$ points" },
      { title: "Cylinder grasping", background: "rotationally equivalent grasps may all belong to one class", numbers: "eight sampled cylinder rotations can collapse one grasp orbit to size $1$ when every rotation fixes the grasp class" }
    ]
  },

  "math-10-05": {
    connectionsProse: "<p>A group action can move arbitrary objects, but machine learning often represents data as vectors. Linear representations bring symmetry into vector spaces by assigning a matrix to each group element. This keeps the group law while making the action compatible with linear algebra. It prepares the ground for feature channels, irreducible pieces, characters, and equivariant neural layers.</p>",
    motivation: "<p>A linear representation turns each group element into an invertible matrix. A rotation becomes a rotation matrix, a swap becomes a permutation matrix, and a cyclic shift becomes a matrix that rearranges coordinates. The original symmetry is now something that can act directly on vectors and activations.</p>" +
                "<p>The key requirement is that the group law becomes matrix multiplication. If two quarter-turns make a half-turn in the group, the two corresponding matrices must multiply to the half-turn matrix. This is why representations let abstract symmetry constrain concrete computations.</p>",
    definition: "<p>A linear representation of $G$ on $V$ is a homomorphism $\\rho:G\\to GL(V)$, so group products become products of invertible linear maps.</p>" +
                "<p>For $C_4=\\langle r:r^4=e\\rangle$, the quarter-turn representation uses $$\\rho(r)=\\begin{pmatrix}0&-1\\1&0\\end{pmatrix}.$$</p>" +
                "<p><b>Assumptions that matter:</b> matrices are invertible, and the relation $r^4=e$ must be respected by the assigned matrix.</p>",
    symbols: [
      { sym: "$\\rho$", desc: "the representation map" },
      { sym: "$GL(V)$", desc: "the group of invertible linear maps on $V$" },
      { sym: "$I$", desc: "the identity matrix" },
      { sym: "$C_4$", desc: "the cyclic group of four rotations" }
    ],
    derivation: [
      { do: "Square the quarter-turn matrix.", result: "$\\rho(r)^2=\\begin{pmatrix}-1&0\\0&-1\\end{pmatrix}$", why: "two quarter-turns make a half-turn" },
      { do: "Raise the matrix to the fourth power.", result: "$\\rho(r)^4=I$", why: "four quarter-turn matrices return the identity" },
      { do: "Compare with the group relation.", result: "$\\rho(r)^4=\\rho(e)$", why: "the matrix equation matches $r^4=e$" },
      { do: "Use the homomorphism law.", result: "$\\rho(r^a r^b)=\\rho(r^{a+b})=\\rho(r)^a\\rho(r)^b$", why: "composition of rotations becomes multiplication of matrices" },
      { do: "Derive the identity matrix.", result: "$\\rho(e)=I$", why: "$\\rho(e)=\\rho(ee)=\\rho(e)^2$ and multiplying by $\\rho(e)^{-1}$ gives the result" }
    ],
    applications: [
      { title: "Plane rotation", background: "a quarter-turn acts by the rotation matrix", numbers: "a $90^\\circ$ rotation sends $(4,1)$ to $(-1,4)$" },
      { title: "Fourier shift", background: "a cyclic shift acts diagonally in a Fourier mode", numbers: "for length $4$, one cyclic shift acts on Fourier frequency $1$ by multiplying by $i$" },
      { title: "Swap matrix", background: "the swap matrix exchanges coordinates and has order two", numbers: "$\\begin{pmatrix}0&1\\1&0\\end{pmatrix}$ sends $(7,2)$ to $(2,7)$ and squares to $I$" },
      { title: "Vector feature", background: "rotating a vector feature preserves its type and length", numbers: "rotating vector feature $(3,4)$ by $90^\\circ$ gives $(-4,3)$ with length $5$" },
      { title: "$3$-D rotation", background: "orthogonal rotations preserve Euclidean norm", numbers: "preserves $\\|(1,2,2)\\|=3$" },
      { title: "Group relation check", background: "a matrix representation must satisfy the same relation as the generator", numbers: "if $r$ is a $120^\\circ$ turn, a representation must satisfy $\\rho(r)^3=I$" }
    ]
  },

  "math-10-06": {
    connectionsProse: "<p>A representation may contain smaller vector spaces that are preserved by all symmetry operations. These preserved pieces are subrepresentations. They are the representation-theoretic analogue of subgroups, but now the smaller object is a subspace rather than a subset of moves. Finding them is the first step toward decomposing a representation into simpler feature types.</p>",
    motivation: "<p>A subrepresentation is an invariant subspace that the whole group action respects. If every allowed matrix sends vectors in a line back to that same line, then the line carries its own smaller representation. The symmetry does not mix that line with the rest of the space.</p>" +
                "<p>This matters because invariant subspaces reveal structure in features. A scalar channel, a constant signal, or a preserved coordinate axis can be processed separately while still respecting the same group action. Later lessons use this idea to distinguish reducible and irreducible representations.</p>",
    definition: "<p>A subrepresentation is a subspace $W\\subseteq V$ preserved by every represented group element.</p>" +
                "<p>The condition is $$\\rho(g)W\\subseteq W\\quad\\text{for all }g\\in G.$$</p>" +
                "<p><b>Assumptions that matter:</b> $W$ must first be a subspace, and the restriction of each $\\rho(g)$ to $W$ must stay inside $W$.</p>",
    symbols: [
      { sym: "$V$", desc: "the full vector space" },
      { sym: "$W\\subseteq V$", desc: "the candidate subspace" },
      { sym: "$\\rho(g)W\\subseteq W$", desc: "every vector in $W$ stays in $W$ after applying $\\rho(g)$" },
      { sym: "$\\rho(g)|_W$", desc: "the restricted map" }
    ],
    derivation: [
      { do: "Define the candidate subspace.", result: "$W=\\{(t,0):t\\in\\mathbb R\\}$", why: "this is the $x$-axis" },
      { do: "Check $W$ is a subspace.", result: "sums and scalar multiples of $(t,0)$ still have second coordinate $0$", why: "the $x$-axis is closed under vector-space operations" },
      { do: "Apply the identity.", result: "$\\rho(e)(t,0)=(t,0)$", why: "identity preserves $W$" },
      { do: "Apply the reflection $\\rho(s)=\\begin{pmatrix}1&0\\0&-1\\end{pmatrix}$.", result: "$\\rho(s)(t,0)=(t,0)$", why: "the $x$-axis is fixed pointwise" },
      { do: "Check every element of $C_2=\\{e,s\\}$.", result: "every group element preserves $W$", why: "$W$ is a subrepresentation" },
      { do: "Restrict the maps to $W$.", result: "the restricted maps still multiply correctly", why: "they are the same maps, only viewed on $W$" }
    ],
    applications: [
      { title: "Scalar feature channel", background: "scalar channels can be preserved separately from vector channels", numbers: "a block with two vector channels and one scalar has a $1$-D scalar subrepresentation" },
      { title: "Constant signal", background: "a constant vector is fixed by cyclic shifts", numbers: "length-$4$ constant signal $(1,1,1,1)$ is fixed by all cyclic shifts" },
      { title: "Coordinate axes", background: "reflection across one axis preserves coordinate lines", numbers: "reflection across the $x$-axis preserves two $1$-D coordinate-axis subrepresentations" },
      { title: "Node permutations", background: "the all-ones vector is invariant under any relabeling", numbers: "for $5$ nodes, $(1,1,1,1,1)$ is fixed by all $5!$ node permutations" },
      { title: "Diagonal action", background: "a diagonal matrix preserves coordinate lines", numbers: "$\\operatorname{diag}(1,-1)$ preserves the first coordinate line and flips the second" },
      { title: "Block processing", background: "a preserved subspace can be processed with a smaller block", numbers: "a preserved $3$-D subspace inside a $10$-D feature space can be processed by a $3\\times3$ block" }
    ]
  },

  "math-10-07": {
    connectionsProse: "<p>Subrepresentations show that a representation may contain smaller invariant pieces. Reducibility names the case where such a nontrivial piece exists. This lesson is mainly about classification rather than a computation. It helps explain why some symmetry-aware models can be written in blocks instead of as one large dense transformation.</p>",
    motivation: "<p>A representation is reducible when it contains a nonzero proper subrepresentation. The subspace must not be the zero space and must not be the whole space, but it must be preserved by every group element. When this happens, part of the representation can evolve under the symmetry without mixing with the rest.</p>" +
                "<p>In a good basis, reducibility often reveals block structure and smaller symmetry stories. Instead of one large matrix acting on all coordinates at once, the action may separate into independent blocks. This is useful both conceptually and computationally, because it identifies feature groups that should or should not communicate under symmetry-preserving maps.</p>",
    definition: "<p>A representation on $V$ is reducible when it has a nonzero proper invariant subspace $W$.</p>" +
                "<p>The classification condition is $$\\{0\\}\\ne W\\ne V\\quad\\text{and}\\quad \\rho(g)W\\subseteq W\\text{ for all }g.$$</p>" +
                "<p><b>Assumptions that matter:</b> this is a definition to check by finding invariant subspaces and contrasting reducible with irreducible examples.</p>",
    symbols: [
      { sym: "$V$", desc: "the whole representation space" },
      { sym: "$W$", desc: "a nonzero proper invariant subspace" },
      { sym: "reducible", desc: "$\\{0\\}\\ne W\\ne V$ and $\\rho(g)W\\subseteq W$ for all $g$" }
    ],
    applications: [
      { title: "Block computation", background: "splitting one dense computation into two blocks reduces cubic cost", numbers: "two $50\\times50$ blocks cost about $2\\cdot50^3=250{,}000$ multiplications versus $100^3=1{,}000{,}000$ for one dense block" },
      { title: "Equivariant features", background: "channels can split into invariant blocks", numbers: "a $7$-channel equivariant feature can split into blocks $3,2,2$" },
      { title: "Shift signals", background: "cyclic shift representations split into Fourier pieces", numbers: "a length-$8$ shift representation decomposes into $8$ Fourier modes" },
      { title: "Molecular vibrations", background: "vibration spaces can separate into symmetry types", numbers: "a $6$-D molecular vibration space may split as $1+2+3$" },
      { title: "Graph pooling", background: "mean pooling selects the constant invariant piece", numbers: "for $10$ nodes, mean pooling projects onto the $1$-D constant subspace" },
      { title: "Parameter removal", background: "blocking removes cross-block connections", numbers: "removing cross-block weights in a $4+4$ split removes $2\\cdot4\\cdot4=32$ parameters" }
    ]
  },

  "math-10-08": {
    connectionsProse: "<p>Reducibility asks whether a representation can be split into smaller invariant parts. Irreducibility is the complementary idea: a representation has no smaller nonzero invariant subspace. These irreducible pieces are the basic building blocks used throughout representation theory. Later tools such as Schur's lemma, characters, and orthogonality are most powerful on these pieces.</p>",
    motivation: "<p>An irreducible representation has no smaller nonzero invariant subspace. Once a vector in the space is allowed to move under the group action, the symmetry can reach enough directions that no proper subspace remains closed under all moves. This makes the representation an indivisible feature type for that symmetry.</p>" +
                "<p>After decomposition, irreducibles describe the basic feature types allowed by the symmetry. Scalars, vectors, Fourier modes, and higher geometric feature types can behave differently under the same group. The field matters because a representation that splits over $\\mathbb C$ may not split the same way over $\\mathbb R$.</p>",
    definition: "<p>A representation on $V$ is irreducible when it has no subrepresentations except the zero space and the whole space.</p>" +
                "<p>The condition is $$W\\text{ invariant}\\Rightarrow W=\\{0\\}\\text{ or }W=V.$$</p>" +
                "<p><b>Assumptions that matter:</b> irreducibility is checked over a chosen field, such as $\\mathbb R$ or $\\mathbb C$, because the available subspaces can change.</p>",
    symbols: [
      { sym: "irreducible", desc: "the only subrepresentations are $\\{0\\}$ and $V$" },
      { sym: "field", desc: "the scalar system, such as $\\mathbb R$ or $\\mathbb C$, which changes which subspaces are available" }
    ],
    applications: [
      { title: "Cyclic signal", background: "complex Fourier modes are one-dimensional irreducible pieces", numbers: "a length-$8$ cyclic signal has $8$ complex one-dimensional Fourier irreps" },
      { title: "Channel accounting", background: "feature dimensions add across irrep types", numbers: "two scalar irreps plus one $2$-D vector irrep give $1+1+2=4$ channels" },
      { title: "$3$-D rotation features", background: "different geometric feature types have fixed component counts", numbers: "scalar, vector, and rank-$2$ symmetric traceless types have $1$, $3$, and $5$ components" },
      { title: "Feature splitting", background: "a representation can be inventoried by irrep block sizes", numbers: "a $6$-D feature split as $1+2+3$ uses three irrep blocks" },
      { title: "Cycle graph", background: "the cycle graph modes correspond to Fourier modes", numbers: "a $4$-cycle graph has Fourier modes $0,1,2,3$" },
      { title: "Symmetry-preserving operator", background: "Schur-type restrictions prevent mixing incompatible irreps", numbers: "between incompatible irreps has matrix entry $0$" }
    ]
  },

  "math-10-09": {
    connectionsProse: "<p>Irreducible representations are the atomic pieces of a symmetry action, and Schur's lemma explains how rigid maps between those pieces must be. The maps in this lesson are intertwiners: linear maps that commute with the group action. This connects decomposition to model design, because equivariant linear layers are exactly the maps that respect symmetry. Schur's lemma tells us many such blocks are forced to be zero or scalar.</p>",
    motivation: "<p>Schur's lemma says maps that respect group actions are rigid on irreducible pieces. If a map sends one irreducible representation to another while commuting with every group element, its kernel and image must themselves be invariant subspaces. Irreducibility leaves very few possibilities for those subspaces.</p>" +
                "<p>Between different irreducible atoms, an intertwiner cannot partially mix one feature type into another. It either vanishes or becomes an isomorphism in the compatible case. On one complex irreducible piece, any self-map that commutes with the whole group is only a scalar multiple of identity, which sharply limits the parameters of equivariant layers.</p>",
    definition: "<p>Schur's lemma describes intertwiners $T:V\\to W$ between irreducible representations: a nonzero intertwiner is an isomorphism, and over $\\mathbb C$ an irreducible self-intertwiner is scalar.</p>" +
                "<p>The commuting condition is $$T\\rho_V(g)=\\rho_W(g)T\\quad\\text{for all }g\\in G.$$</p>" +
                "<p><b>Assumptions that matter:</b> $V$ and $W$ are irreducible, and the scalar conclusion for self-maps uses the complex field.</p>",
    symbols: [
      { sym: "$T$", desc: "an intertwiner" },
      { sym: "$\\rho_V$ and $\\rho_W$", desc: "group representations" },
      { sym: "$\\ker T$", desc: "the set mapped to zero" },
      { sym: "$\\operatorname{im}T$", desc: "the image" },
      { sym: "$\\lambda$", desc: "an eigenvalue" }
    ],
    derivation: [
      { do: "Start with an intertwiner.", result: "$T:V\\to W$ satisfies $T\\rho_V(g)=\\rho_W(g)T$", why: "this is an intertwiner" },
      { do: "Test a vector in the kernel.", result: "if $v\\in\\ker T$, then $T\\rho_V(g)v=\\rho_W(g)Tv=0$", why: "the kernel is preserved by $G$" },
      { do: "Use irreducibility of $V$.", result: "$\\ker T$ is either $0$ or $V$", why: "no other invariant subspace exists" },
      { do: "Check the image.", result: "$\\rho_W(g)T(v)=T\\rho_V(g)v$", why: "outputs of $T$ stay in the image after the group acts" },
      { do: "Use irreducibility of $W$.", result: "$\\operatorname{im}T$ is either $0$ or $W$", why: "the image is an invariant subspace" },
      { do: "Assume $T\\ne0$.", result: "$\\ker T=0$ and $\\operatorname{im}T=W$, so $T$ is an isomorphism", why: "the zero alternatives are ruled out" },
      { do: "Specialize to $V=W$ over $\\mathbb C$.", result: "choose an eigenvalue $\\lambda$ of $T$", why: "complex matrices have eigenvalues" },
      { do: "Subtract the scalar identity.", result: "$T-\\lambda I$ is also an intertwiner and has nonzero kernel", why: "subtracting a scalar identity preserves commutation" },
      { do: "Use irreducibility again.", result: "$T-\\lambda I=0$, so $T=\\lambda I$", why: "a nonzero kernel forces the whole irreducible space into the kernel" }
    ],
    applications: [
      { title: "Nonisomorphic irreps", background: "different irreducible feature types cannot be mixed by an equivariant map", numbers: "between nonisomorphic irreps, an equivariant linear block has $0$ parameters" },
      { title: "Matching complex irreps", background: "a multiplicity-one matching block is forced to be scalar", numbers: "between matching complex irreps with multiplicity one, the block is one scalar times identity" },
      { title: "Parameter count", background: "Schur's lemma collapses a dense block to one scalar", numbers: "a dense $3\\times3$ block has $9$ entries, but Schur's scalar block has $1$ parameter" },
      { title: "Commuting operator", background: "on separate irrep blocks, commuting operators are scalar on each block", numbers: "on irrep blocks of sizes $2$ and $3$, a commuting operator looks like $\\lambda I_2\\oplus\\mu I_3$" },
      { title: "Repeated eigenvalue", background: "a scalar block repeats the same eigenvalue across the whole irrep", numbers: "if a $2$-D irrep occurs once, a symmetric operator has the same eigenvalue repeated $2$ times on that block" },
      { title: "Scalar self-map", background: "a complex irreducible self-intertwiner is determined by one eigenvalue", numbers: "if an intertwiner on a complex irreducible representation has eigenvalue $3$, then $T=3I$" }
    ]
  },

  "math-10-10": {
    connectionsProse: "<p>Representations can contain many matrix entries, and those entries change when the basis changes. Characters compress a representation by recording only the trace of each group element's matrix. This loses some basis-dependent detail but keeps important symmetry information. The next lesson uses characters as vectors whose inner products count irreducible pieces.</p>",
    motivation: "<p>A character records the trace of each representation matrix. The trace is stable under change of basis, so it captures something intrinsic about how a group element acts. At the identity, the character simply counts the dimension of the representation space.</p>" +
                "<p>Characters also respect conjugacy. Group elements that are the same up to relabeling have representation matrices that are similar, and similar matrices have the same trace. This makes characters especially efficient for finite groups, where many elements can be summarized by conjugacy classes rather than treated one at a time.</p>",
    definition: "<p>The character of a representation $\\rho$ is the trace function $\\chi_\\rho$ on group elements.</p>" +
                "<p>It is defined by $$\\chi_\\rho(g)=\\operatorname{tr}(\\rho(g)).$$</p>" +
                "<p><b>Assumptions that matter:</b> trace is basis-invariant, and representation homomorphisms turn conjugate group elements into similar matrices.</p>",
    symbols: [
      { sym: "$\\chi_\\rho$", desc: "the character of representation $\\rho$" },
      { sym: "$\\operatorname{tr}$", desc: "sums diagonal entries" },
      { sym: "$hgh^{-1}$", desc: "a conjugate of $g$" },
      { sym: "$\\dim V$", desc: "the vector-space dimension" }
    ],
    derivation: [
      { do: "Define the character.", result: "$\\chi_\\rho(g)=\\operatorname{tr}(\\rho(g))$", why: "the character is trace after representing $g$" },
      { do: "Represent the identity.", result: "$\\rho(e)=I_V$", why: "representations send identity to identity" },
      { do: "Take the trace at the identity.", result: "$\\chi_\\rho(e)=\\operatorname{tr}(I_V)=\\dim V$", why: "the identity trace counts basis vectors" },
      { do: "Represent a conjugate element.", result: "$\\rho(hgh^{-1})=\\rho(h)\\rho(g)\\rho(h)^{-1}$", why: "homomorphism turns conjugation into similarity" },
      { do: "Use trace invariance under similarity.", result: "$\\chi_\\rho(hgh^{-1})=\\chi_\\rho(g)$", why: "characters are constant on conjugacy classes" },
      { do: "Compute the $C_4$ rotation example.", result: "traces of $I,R,R^2,R^3$ are $2,0,-2,0$", why: "the character summarizes each represented rotation by its trace" }
    ],
    applications: [
      { title: "Decomposition fingerprint", background: "character coefficients record irrep multiplicities", numbers: "if $\\chi=2\\chi_a+\\chi_b$, then irrep $a$ appears twice and $b$ once" },
      { title: "Permutation character", background: "the permutation character counts fixed points", numbers: "cycle type $(12)(345)$ on $5$ items fixes $0$ points, so character $0$" },
      { title: "$C_4$ frequency", background: "a Fourier frequency gives a one-dimensional character", numbers: "on $C_4$, frequency-$1$ character sends $r$ to $i$ and $r^2$ to $-1$" },
      { title: "Rotation trace", background: "trace summarizes a rotation matrix", numbers: "a $180^\\circ$ rotation about $z$ has matrix $\\operatorname{diag}(-1,-1,1)$ and character $-1$" },
      { title: "Scalar channels", background: "identity character counts dimensions", numbers: "three scalar channels have identity character $3$" },
      { title: "Similarity invariance", background: "change of basis leaves trace unchanged", numbers: "if $A$ has trace $5$, then $PAP^{-1}$ also has trace $5$" }
    ]
  },

  "math-10-11": {
    connectionsProse: "<p>Characters turn representations into compact functions on the group. Orthogonality relations explain why those functions are useful for decomposition. Irreducible characters behave like an orthonormal basis for the representation information we need. This gives a practical way to count feature types by taking averaged inner products.</p>",
    motivation: "<p>Character orthogonality makes irreducible characters behave like perpendicular unit vectors. The inner product averages over the group, so it compares two symmetry fingerprints across every group element at once. Distinct irreducible characters average to zero against each other, while each one has norm one.</p>" +
                "<p>Once this orthogonality is available, multiplicities become projections. If a representation character is a sum of irreducible characters, its inner product with one irreducible character extracts exactly that irrep's coefficient. This turns a structural decomposition problem into a calculation with numbers.</p>",
    definition: "<p>The character inner product averages a product of class functions over the group, and irreducible complex characters are orthonormal for this inner product.</p>" +
                "<p>The inner product is $$\\langle\\chi,\\psi\\rangle=\\frac1{|G|}\\sum_{g\\in G}\\chi(g)\\overline{\\psi(g)}.$$</p>" +
                "<p><b>Assumptions that matter:</b> the group is finite, characters are complex-valued, and irreducible characters are taken over $\\mathbb C$.</p>",
    symbols: [
      { sym: "$\\chi,\\psi$", desc: "class functions or characters" },
      { sym: "$\\overline{\\psi(g)}$", desc: "complex conjugation" },
      { sym: "$|G|$", desc: "group size" },
      { sym: "$m_i$", desc: "the multiplicity of irreducible $i$" }
    ],
    derivation: [
      { do: "Define the inner product.", result: "$\\langle\\chi,\\psi\\rangle=\\frac1{|G|}\\sum_{g\\in G}\\chi(g)\\overline{\\psi(g)}$", why: "this is the averaged complex dot product" },
      { do: "Write the $C_2=\\{e,s\\}$ characters.", result: "the trivial character is $(1,1)$ and the sign character is $(1,-1)$", why: "these are the two irreducible characters in the example" },
      { do: "Compute the cross inner product.", result: "$\\langle\\chi_{\\mathrm{triv}},\\chi_{\\mathrm{sign}}\\rangle=\\frac12(1\\cdot1+1\\cdot(-1))=0$", why: "different irreducibles are orthogonal" },
      { do: "Compute the sign norm.", result: "$\\langle\\chi_{\\mathrm{sign}},\\chi_{\\mathrm{sign}}\\rangle=\\frac12(1^2+(-1)^2)=1$", why: "each irreducible has unit norm" },
      { do: "State the finite-group theorem.", result: "the same holds for all irreducible complex characters", why: "irreducible characters are orthonormal" },
      { do: "Project a decomposed character.", result: "if $\\chi=\\sum_i m_i\\chi_i$, then $\\langle\\chi,\\chi_j\\rangle=m_j$", why: "all cross terms vanish and $\\langle\\chi_j,\\chi_j\\rangle=1$" }
    ],
    applications: [
      { title: "Multiplicity count", background: "inner products read off irrep counts", numbers: "if $\\langle\\chi,\\chi_i\\rangle=4$, irrep $i$ appears four times" },
      { title: "Fourier orthogonality", background: "roots of unity cancel across one period", numbers: "for length $4$, $1+i-1-i=0$, so Fourier frequencies $0$ and $1$ are orthogonal" },
      { title: "Constant signal", background: "the average coefficient captures the constant mode", numbers: "constant signal $[3,3,3,3]$ has average coefficient $12/4=3$ and zero nonzero-frequency coefficients" },
      { title: "Scalar channels", background: "projection onto the scalar irrep counts scalar channels", numbers: "if a feature character has inner product $5$ with the scalar irrep, it has $5$ scalar channels" },
      { title: "Irrep inventory", background: "a vector of inner products gives a compact inventory", numbers: "character inner products $(2,1,0)$ mean two copies of type A, one of B, none of C" },
      { title: "Compression", background: "storing only active character coefficients can reduce representation size", numbers: "a signal with $3$ nonzero character coefficients among $16$ stores $3$ complex coefficients instead of $16$ samples" }
    ]
  },

  "math-10-12": {
    connectionsProse: "<p>Finite groups describe symmetries with separate moves, such as four rotations of a square. Continuous groups describe symmetries that vary smoothly, such as rotations by any angle. Their representations still preserve the group law, but now the matrices change continuously with a parameter. This is the setting where calculus, geometry, and symmetry begin to interact directly.</p>",
    motivation: "<p>Continuous groups, such as rotations by any angle, need representations that vary continuously or smoothly. A tiny change in angle should produce a tiny change in the matrix and in the transformed vector. Without that regularity, the representation would not reflect the geometry of the underlying group.</p>" +
                "<p>The homomorphism law remains the same as in finite representation theory. Applying a rotation by $\\phi$ and then by $\\theta$ should match the matrix for rotation by $\\theta+\\phi$. The new ingredient is that the entries are functions of a continuous parameter, so differential ideas such as generators and small-angle approximations become available.</p>",
    definition: "<p>A representation of a continuous group assigns matrices to continuously varying group elements in a way that preserves the group law and varies continuously with the parameter.</p>" +
                "<p>For $SO(2)$, the standard representation is $$\\rho(\\theta)=\\begin{pmatrix}\\cos\\theta&-\\sin\\theta\\\sin\\theta&\\cos\\theta\\end{pmatrix}.$$</p>" +
                "<p><b>Assumptions that matter:</b> $\\theta$ and $\\phi$ are real angles, matrix entries are continuous functions of the angle, and rotation composition adds angles.</p>",
    symbols: [
      { sym: "$SO(2)$", desc: "the circle group of plane rotations" },
      { sym: "$\\theta,\\phi$", desc: "angles" },
      { sym: "$\\rho(\\theta)$", desc: "the rotation matrix" },
      { sym: "continuity", desc: "matrix entries vary continuously with the group parameter" }
    ],
    derivation: [
      { do: "Define the standard rotation representation.", result: "$\\rho(\\theta)=\\begin{pmatrix}\\cos\\theta&-\\sin\\theta\\\sin\\theta&\\cos\\theta\\end{pmatrix}$", why: "this rotates vectors by angle $\\theta$" },
      { do: "Multiply two rotation matrices.", result: "$\\rho(\\theta)\\rho(\\phi)$", why: "matrix multiplication gives entries with products of sines and cosines" },
      { do: "Use angle-addition formulas.", result: "$\\cos(\\theta+\\phi)=\\cos\\theta\\cos\\phi-\\sin\\theta\\sin\\phi$ and $\\sin(\\theta+\\phi)=\\sin\\theta\\cos\\phi+\\cos\\theta\\sin\\phi$", why: "these simplify the product entries" },
      { do: "Compare the product to a single rotation.", result: "$\\rho(\\theta)\\rho(\\phi)=\\rho(\\theta+\\phi)$", why: "the homomorphism law holds" },
      { do: "Check regularity.", result: "entries are continuous functions of $\\theta$", why: "nearby rotations give nearby matrices" },
      { do: "Work a quarter-turn example.", result: "$\\rho(\\pi/2)(1,2)=(-2,1)$ and both vectors have length $\\sqrt5$", why: "the representation rotates while preserving length" }
    ],
    applications: [
      { title: "Rigid motion", background: "rotation followed by translation transforms a point in the plane", numbers: "a $90^\\circ$ rotation followed by translation $(2,3)$ sends point $(1,0)$ to $(2,4)$" },
      { title: "Vector channel", background: "continuous rotation acts on vector features", numbers: "a vector channel $(1,0)$ rotated by $30^\\circ$ becomes approximately $(0.866,0.5)$" },
      { title: "Velocity norm", background: "rotations preserve vector length", numbers: "velocity $(3,4)$ keeps norm $5$ under any rotation" },
      { title: "Phase shift", background: "circle actions appear as complex phase multipliers", numbers: "phase shift $\\pi/2$ multiplies a complex Fourier coefficient by $i$" },
      { title: "Angle error", background: "small angular differences are naturally measured in radians", numbers: "angle error from $35^\\circ$ to $38^\\circ$ is $3^\\circ\\approx0.052$ radians" },
      { title: "Generator step", background: "continuous representations support first-order generator approximations", numbers: "a small time step $0.1$ with generator speed $2$ gives first-order phase change $0.2$ radians" }
    ]
  },

  "math-10-13": {
    connectionsProse: "<p>Group actions describe how inputs move under symmetry, and orbits collect all transformed versions of one input. Invariance describes functions that deliberately ignore movement along those orbits. This is the right language for labels, scores, distances, energies, and pooled summaries that should not change when the input is transformed. It also sets up equivariance by showing what happens when the output action is trivial.</p>",
    motivation: "<p>An invariant function gives the same value across every transformed version of an input. If an image shifts slightly but its class label stays the same, the classifier is being asked to behave invariantly. If a molecule rotates in space but its bond length remains the same, the bond-length function is invariant to rotation.</p>" +
                "<p>Invariance intentionally forgets variation along group orbits. It collapses all transformed copies of an input to one shared output value. This is useful for final decisions and summaries, but it can discard location or orientation information that some tasks still need.</p>",
    definition: "<p>An invariant map $f:X\\to Y$ gives the same output after any group transformation of the input.</p>" +
                "<p>The condition is $$f(g\\cdot x)=f(x)\\quad\\text{for all }g\\in G.$$</p>" +
                "<p><b>Assumptions that matter:</b> $G$ acts on $X$, and invariance is equivariance when the action on $Y$ is trivial.</p>",
    symbols: [
      { sym: "$f:X\\to Y$", desc: "the invariant map" },
      { sym: "$G$", desc: "acts on $X$" },
      { sym: "trivial action on $Y$", desc: "outputs do not move" },
      { sym: "orbit", desc: "all points $g\\cdot x$" }
    ],
    derivation: [
      { do: "State invariance.", result: "$f(g\\cdot x)=f(x)$ for all $g$", why: "transforming input does not change output" },
      { do: "Give $Y$ the trivial action.", result: "$g\\cdot y=y$ for all $g$ and $y$", why: "the group does nothing to outputs" },
      { do: "Write the equivariance equation.", result: "$f(g\\cdot x)=g\\cdot f(x)$", why: "this is the general commute rule" },
      { do: "Substitute the trivial action.", result: "$g\\cdot f(x)=f(x)$", why: "the equation is exactly invariance" },
      { do: "Take a point in the orbit.", result: "if $y$ lies in the orbit of $x$, then $y=g\\cdot x$ for some $g$", why: "this is the definition of orbit" },
      { do: "Apply invariance to the orbit point.", result: "$f(y)=f(g\\cdot x)=f(x)$", why: "invariant functions are constant on orbits" },
      { do: "Check squared norm under a quarter-turn.", result: "for $f(x,y)=x^2+y^2$ and $R(x,y)=(-y,x)$, $f(R(x,y))=(-y)^2+x^2=x^2+y^2$", why: "squared norm is rotation-invariant" }
    ],
    applications: [
      { title: "Digit classification", background: "a small shift should not change the class label", numbers: "shifted digit scores $0.91$ and $0.90$ should keep label $7$" },
      { title: "Set features", background: "a mean does not depend on element order", numbers: "mean of set features $[2,4,10]$ is $16/3$ in any order" },
      { title: "Distances", background: "translating both points preserves their separation", numbers: "points $(0,0)$ and $(3,4)$ remain distance $5$ after shifting both by $(10,-2)$" },
      { title: "Energy", background: "sign-flipped samples can have the same squared energy", numbers: "samples $[2,-3]$ and $[-2,3]$ both have energy $13$" },
      { title: "Node feature sum", background: "summing node features ignores node order", numbers: "four node first-coordinates $1,0,3,2$ sum to $6$ under any node order" },
      { title: "Molecular rotation", background: "bond length is independent of molecular orientation", numbers: "a bond length of $1.5$ angstroms stays $1.5$ after rotating the molecule" }
    ]
  },

  "math-10-14": {
    connectionsProse: "<p>This lesson builds on group actions and invariance. A group action says how a symmetry moves an input, and invariance says a function gives the same output after that movement. Equivariance keeps more information than invariance. It says the output should move in the matching way. This distinction is central in machine learning. A classifier may be invariant to a small translation because the class label should stay the same. A segmentation map, keypoint detector, vector field, or graph-node predictor should not stay fixed; it should transform along with the input. That is why equivariance is the right language for CNN feature maps, GNN node embeddings, pose predictions, and geometric neural networks.</p>",
    motivation: "<p>Equivariance describes a map that respects symmetry without discarding it. Suppose an image shifts one pixel to the right. If a feature extractor detects an edge at position $5$ before the shift, the corresponding feature should appear at position $6$ after the shift. The answer has changed, but it changed in the predictable way dictated by the same group action.</p>" +
                "<p>The compact statement is that processing and transforming commute. Transform the input and then apply the map, or apply the map and then transform the output; an equivariant map gives the same result. This is stronger than ordinary consistency. It lets an architecture share parameters across symmetric positions while still producing location-aware or geometry-aware outputs.</p>" +
                "<p>A short cyclic-shift example makes the rule concrete. Let $S$ be the right cyclic shift on a length-$4$ vector, so $S(x_0,x_1,x_2,x_3)=(x_3,x_0,x_1,x_2)$. Define $$F(x_0,x_1,x_2,x_3)=(x_0+x_1,\\,x_1+x_2,\\,x_2+x_3,\\,x_3+x_0).$$ For $x=(1,3,0,2)$, $F(x)=(4,3,2,3)$ and $S(F(x))=(3,4,3,2)$. Also $Sx=(2,1,3,0)$, so $F(Sx)=(3,4,3,2)$. The two paths agree: shifting after $F$ gives the same vector as applying $F$ after shifting.</p>",
    definition: "<p>An equivariant map respects symmetry by making transformation and processing commute.</p>" +
                "<p>The condition is $$F(g\\cdot x)=g\\cdot F(x)$$ for every $g\\in G$ and $x\\in X$.</p>" +
                "<p><b>Assumptions that matter:</b> $G$ acts on the input set and has a corresponding action on the output set.</p>",
    symbols: [
      { sym: "$G$", desc: "the symmetry group" },
      { sym: "$X$", desc: "the input set" },
      { sym: "$Y$", desc: "the output set" },
      { sym: "$g\\cdot x$", desc: "the action of $g$ on the input" },
      { sym: "$g\\cdot F(x)$", desc: "the corresponding action on the output" },
      { sym: "$F:X\\to Y$", desc: "the map being tested" },
      { sym: "$S$", desc: "a cyclic shift" },
      { sym: "indices modulo $4$", desc: "position $4$ is position $0$ again" }
    ],
    derivation: [
      { do: "Define the right cyclic shift.", result: "$S(x_0,x_1,x_2,x_3)=(x_3,x_0,x_1,x_2)$", why: "this is the group action on positions" },
      { do: "Define the local map.", result: "$F(x)_i=x_i+x_{i+1}$ with indices modulo $4$", why: "each output uses the current entry and its right neighbor" },
      { do: "Compute the shifted input.", result: "$S(1,3,0,2)=(2,1,3,0)$", why: "the last entry wraps to the front" },
      { do: "Apply $F$ after shifting.", result: "$F(Sx)=(2+1,1+3,3+0,0+2)=(3,4,3,2)$", why: "this is the transform-then-process path" },
      { do: "Apply $F$ before shifting.", result: "$F(x)=(1+3,3+0,0+2,2+1)=(4,3,2,3)$", why: "this is the process path" },
      { do: "Shift that output.", result: "$S(F(x))=(3,4,3,2)$", why: "this is the process-then-transform path" },
      { do: "Compare the two results.", result: "$F(Sx)=S(F(x))$", why: "the map is equivariant for this shift" },
      { do: "Generalize the index argument.", result: "the same index argument works for any length-$4$ vector", why: "modulo indexing makes the neighbor rule commute with cyclic shifts" }
    ],
    applications: [
      { title: "CNN translation-equivariance", background: "a shifted input should shift the response peak by the same amount", numbers: "a bright pixel moving from index $5$ to index $7$ should move the convolution response peak by the same $2$ indices" },
      { title: "Segmentation masks", background: "a mask should move with the shifted image", numbers: "if an image shifts by $(3,-2)$, a mask pixel at $(20,10)$ should shift to $(23,8)$" },
      { title: "Keypoint detection", background: "a keypoint should transform with the image geometry", numbers: "in a width-$100$ image with coordinates $0$ to $99$, a horizontal flip sends keypoint $(40,60)$ to $(59,60)$" },
      { title: "Vector fields", background: "vector outputs rotate with the coordinate system", numbers: "a force vector $(2,0)$ rotated by $90^\\circ$ becomes $(0,2)$, so the output rotates with the coordinate system" },
      { title: "GNN node embeddings", background: "node outputs should relabel the same way as node inputs", numbers: "swapping node labels $0$ and $2$ in a path graph changes aggregate outputs from $[7,14,12]$ to $[12,14,7]$, the same swap applied to the original output" },
      { title: "Robotic policies", background: "actions should rotate with the scene", numbers: "if an action vector is $(1,2)$, a $180^\\circ$ scene rotation should produce $(-1,-2)$" }
    ]
  },

  "math-10-15": {
    connectionsProse: "<p>This lesson gathers the representation-theory ideas into neural-network architecture. Group actions specify how inputs transform, representations specify how feature spaces transform, and equivariance says each layer should commute with the symmetry. Invariant pooling then turns structured equivariant features into final predictions when the task requires a symmetry-independent answer. This is the path from algebraic symmetry to CNNs, GNNs, steerable channels, and geometric neural networks.</p>",
    motivation: "<p>Group-equivariant and geometric neural networks build symmetry into layers instead of hoping data augmentation teaches it. A convolutional rule with shared weights can produce outputs that shift when the input shifts. A steerable layer can rotate vector features in the same way the input geometry rotates. A graph layer can aggregate neighbors without depending on arbitrary node labels.</p>" +
                "<p>Equivariant layers preserve structured outputs, and invariant readouts turn those structured features into class or graph-level predictions. This separation is useful because early layers often need to keep track of position, orientation, node identity, or geometry, while the final prediction may need to ignore some of those transformations. The cyclic convolution example shows the same commute rule in a small neural layer.</p>",
    definition: "<p>A group-equivariant neural layer is a map $F$ whose output transforms in the corresponding way when the input is transformed; invariant pooling then removes the group position for final readout.</p>" +
                "<p>For the cyclic convolution example, $$(Fx)_i=2x_i-x_{i-1}.$$</p>" +
                "<p><b>Assumptions that matter:</b> indices are cyclic, shared weights $2$ and $-1$ are used at every position, and $S$ is the right cyclic shift.</p>",
    symbols: [
      { sym: "$F$", desc: "a neural layer" },
      { sym: "$S$", desc: "a cyclic shift" },
      { sym: "$x_i$", desc: "input at position $i$" },
      { sym: "shared weights", desc: "the same coefficients $2$ and $-1$ are used at every position" },
      { sym: "pooling", desc: "a readout that removes the group position" }
    ],
    derivation: [
      { do: "Compute the cyclic convolution on $x=[1,3,0,2]$.", result: "$F(x)=[2\\cdot1-2,\\,2\\cdot3-1,\\,2\\cdot0-3,\\,2\\cdot2-0]=[0,5,-3,4]$", why: "the kernel is applied at every cyclic position" },
      { do: "Right-shift the input.", result: "$Sx=[2,1,3,0]$", why: "cyclic boundary wraps the last entry" },
      { do: "Apply the same convolution to $Sx$.", result: "$F(Sx)=[4,0,5,-3]$", why: "shared weights use the same local rule after shifting" },
      { do: "Right-shift the original output.", result: "$S(Fx)=[4,0,5,-3]$", why: "the output shifted by the same group action" },
      { do: "Compare the two paths.", result: "$F(Sx)=S(Fx)$", why: "the layer is translation-equivariant under cyclic shifts" },
      { do: "Add invariant pooling.", result: "$\\max[0,5,-3,4]=5$ and $\\max[4,0,5,-3]=5$", why: "pooling converts equivariant features into an invariant score" }
    ],
    applications: [
      { title: "1-D CNN", background: "a cyclic convolution commutes with the shift", numbers: "$F([1,3,0,2])=[0,5,-3,4]$ and $F(Sx)=S(Fx)=[4,0,5,-3]$" },
      { title: "Invariant pooling", background: "max pooling removes the shift position", numbers: "both shifted feature maps have max value $5$" },
      { title: "Group CNN", background: "rotation handling creates separate orientation channels", numbers: "over rotations $0,90,180,270^\\circ$ creates $4$ orientation channels per learned filter" },
      { title: "Steerable vector channel", background: "vector channels rotate predictably and preserve length", numbers: "$(3,4)$ rotates by $90^\\circ$ to $(-4,3)$ and keeps norm $5$" },
      { title: "GNN aggregation", background: "symmetric aggregation ignores arbitrary neighbor order", numbers: "neighbor features $5$ and $7$ sum to $12$ regardless of whether labels are ordered $(2,3)$ or $(3,2)$" },
      { title: "Orbit coverage", background: "exact symmetry handling lets one example cover its rotations", numbers: "if rotations by $0,90,180,270^\\circ$ are handled exactly, one labeled image covers an orbit of $4$ orientations" }
    ]
  }
};
