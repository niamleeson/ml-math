module.exports = {
  "math-10-01": {
    id: "math-10-01",
    title: "Groups",
    tagline: "A group is a set of moves you can compose, undo, and trust to stay inside the same world.",
    connections: {
      buildsOn: ["sets", "functions", "composition"],
      leadsTo: ["Subgroups and homomorphisms", "Group actions", "Linear representations"],
      usedWith: ["symmetry", "modular arithmetic", "permutations", "matrices"]
    },
    motivation:
      "<p>You already know many reversible moves. Adding $3$ then adding $-3$ gets you back; rotating a square by $90^\\circ$ four times returns it to where it started.</p>" +
      "<p>A <b>group</b> is the language for those dependable moves. It keeps track of how moves combine, what counts as doing nothing, and how every move is undone. Representation theory begins here because symmetries become useful once we can name their algebra.</p>",
    definition:
      "<p>A <b>group</b> is a set $G$ with an operation, often written $ab$, satisfying four rules. Closure: if $a,b\\in G$, then $ab\\in G$. Associativity: $(ab)c=a(bc)$. Identity: there is an element $e\\in G$ with $eg=ge=g$ for every $g\\in G$. Inverses: for every $g\\in G$, there is $g^{-1}\\in G$ with $gg^{-1}=g^{-1}g=e$.</p>" +
      "<p>The rules are exactly what makes repeated motion safe. Closure says you never leave the system; associativity says parentheses do not change a sequence of moves; the identity is the no-op; and inverses let you reverse. <b>Assumptions that matter:</b> the operation is part of the data, the identity must work on both sides, and inverses must stay inside $G$.</p>",
    worked: {
      problem: "Show that $\\mathbb Z_5=\\{0,1,2,3,4\\}$ with addition modulo $5$ is a group, and find the inverse of $3$.",
      skills: ["modular arithmetic", "group axioms", "inverses"],
      strategy: "Modulo addition wraps numbers back into the set, so check the four axioms with that wraparound in mind.",
      steps: [
        { do: "State the operation", result: "$a+b$ is reduced modulo $5$", why: "the set contains only residues $0$ through $4$" },
        { do: "Check closure", result: "every sum has a residue in $\\mathbb Z_5$", why: "division by $5$ always leaves one of five remainders" },
        { do: "Check associativity", result: "$(a+b)+c\\equiv a+(b+c)\\pmod 5$", why: "ordinary integer addition is associative before reducing" },
        { do: "Identify the identity", result: "$0$", why: "$a+0\\equiv a\\pmod 5$" },
        { do: "Solve for the inverse of $3$", result: "$3+x\\equiv0\\pmod 5$", why: "an inverse adds to the identity" },
        { do: "Choose $x=2$", result: "$3+2=5\\equiv0\\pmod 5$", why: "$5$ wraps to the residue $0$" }
      ],
      verify: "The inverse list is $0,4,3,2,1$ for residues $0,1,2,3,4$, so every element has one.",
      answer: "$\\mathbb Z_5$ under addition modulo $5$ is a group, and the inverse of $3$ is $2$.",
      connects: "A group packages a whole reversible arithmetic system into one object."
    },
    practice: [
      { problem: "In $\\mathbb Z_7$ under addition, find the identity and the inverse of $5$.", steps: [
        { do: "Name the identity condition", result: "$a+e\\equiv a\\pmod 7$", why: "the identity leaves every element unchanged" },
        { do: "Choose the identity", result: "$e=0$", why: "adding zero changes nothing" },
        { do: "Write the inverse equation for $5$", result: "$5+x\\equiv0\\pmod 7$", why: "inverse means sum to the identity" },
        { do: "Subtract $5$ modulo $7$", result: "$x\\equiv2\\pmod 7$", why: "$-5\\equiv2$ modulo $7$" },
        { do: "Check", result: "$5+2=7\\equiv0\\pmod 7$", why: "the sum wraps to zero" }
      ], answer: "The identity is $0$, and the inverse of $5$ is $2$." },
      { problem: "Decide whether positive real numbers under multiplication form a group.", steps: [
        { do: "Check closure", result: "positive times positive is positive", why: "the product stays in the set" },
        { do: "Check associativity", result: "$(ab)c=a(bc)$", why: "real multiplication is associative" },
        { do: "Find the identity", result: "$1$", why: "$1\\cdot a=a\\cdot1=a$" },
        { do: "Find the inverse of $a>0$", result: "$1/a$", why: "$a(1/a)=1$" },
        { do: "Check the inverse stays positive", result: "$1/a>0$", why: "the reciprocal of a positive number is positive" }
      ], answer: "Yes. Positive real numbers under multiplication form a group." },
      { problem: "Decide whether integers under multiplication form a group.", steps: [
        { do: "Check closure", result: "integer times integer is integer", why: "closure holds" },
        { do: "Identify the identity", result: "$1$", why: "$1\\cdot n=n$" },
        { do: "Test the element $2$", result: "an inverse would be $1/2$", why: "$2x=1$ gives $x=1/2$" },
        { do: "Check membership", result: "$1/2\\notin\\mathbb Z$", why: "the inverse is not an integer" },
        { do: "Apply the group rule", result: "not a group", why: "every element must have an inverse inside the set" }
      ], answer: "No. Integers under multiplication fail the inverse axiom." },
      { problem: "For rotations of an equilateral triangle, list the group elements and compute $r^2r$ where $r$ is a $120^\\circ$ rotation.", steps: [
        { do: "List the rotations", result: "$\\{e,r,r^2\\}$", why: "three $120^\\circ$ turns return to the start" },
        { do: "Interpret $r^2$", result: "$240^\\circ$ rotation", why: "two turns of $120^\\circ$" },
        { do: "Compose $r^2$ with $r$", result: "$r^2r=r^3$", why: "exponents add for repeated rotations" },
        { do: "Reduce $r^3$", result: "$e$", why: "$360^\\circ$ is the identity rotation" },
        { do: "Check closure", result: "$e\\in\\{e,r,r^2\\}$", why: "the product remains in the group" }
      ], answer: "The elements are $e,r,r^2$, and $r^2r=e$." },
      { problem: "A data augmentation uses horizontal flip $f$ and identity $e$ on images, with $f^2=e$. Write the multiplication table.", steps: [
        { do: "List elements", result: "$\\{e,f\\}$", why: "there are two moves" },
        { do: "Use identity on the left", result: "$ee=e$ and $ef=f$", why: "identity changes nothing" },
        { do: "Use identity on the right", result: "$fe=f$", why: "identity changes nothing after the flip" },
        { do: "Use the flip rule", result: "$ff=e$", why: "flipping twice returns the original image" },
        { do: "Arrange the table", result: "$e$ row: $e,f$; $f$ row: $f,e$", why: "each entry is the composed move" }
      ], answer: "The table is $ee=e$, $ef=f$, $fe=f$, $ff=e$." }
    ],
    applications: [
      { title: "Clock arithmetic", background: "Modular arithmetic is a friendly finite group, used anywhere values wrap around instead of growing forever.", numbers: "On a $12$-hour clock, $9+5=14\\equiv2$, and the inverse of $9$ under addition is $3$ because $9+3\\equiv0$." },
      { title: "Rotations in graphics", background: "Computer graphics composes rotations constantly. The group view says rotations can be chained and undone without leaving the rotation system.", numbers: "Four $90^\\circ$ rotations give $360^\\circ$, so $r^4=e$ and $r^{-1}=r^3$." },
      { title: "Permutation shuffles", background: "Sorting, ranking, and data pipelines use permutations, which form groups under composition.", numbers: "The swap $(1\\ 2)$ applied twice returns every item, so its square is $e$." },
      { title: "Cryptographic structure", background: "Many public-key systems rely on finite groups where multiplication and inverses are easy but some reverse problems are hard.", numbers: "Modulo $11$, $3\\cdot4=12\\equiv1$, so $4$ is the multiplicative inverse of $3$." },
      { title: "Symmetry in molecules", background: "Chemistry classifies molecules by their symmetry groups; equivalent rotations and reflections constrain allowed vibrations.", numbers: "A square planar molecule has rotations by $0,90,180,270$ degrees, giving $4$ rotational symmetries before reflections." },
      { title: "Image augmentation", background: "ML data augmentation often applies transformations that have identities and inverses, such as flips and rotations.", numbers: "A $180^\\circ$ image rotation applied twice gives the original image, so the transformation has order $2$." }
    ],
    applicationsClose: "The same four rules quietly organize clocks, rotations, shuffles, cryptography, molecules, and augmented data.",
    takeaways: [
      "A group is a set with a closed, associative operation, an identity, and inverses.",
      "The operation is part of the structure; the same set can behave differently with a different operation.",
      "Groups are the basic language of symmetry and reversible transformations."
    ]
  },

  "math-10-02": {
    id: "math-10-02",
    title: "Subgroups and homomorphisms",
    tagline: "Subgroups are smaller symmetry worlds, and homomorphisms are structure-preserving translations between them.",
    connections: {
      buildsOn: ["Groups", "sets", "functions"],
      leadsTo: ["Group actions", "Linear representations", "characters"],
      usedWith: ["kernels", "images", "quotient groups", "isomorphisms"]
    },
    motivation:
      "<p>Once you have a group, you often notice a smaller collection of moves that is complete by itself. The even rotations of a square, for example, still compose and undo cleanly.</p>" +
      "<p>A <b>subgroup</b> lets you zoom in without losing the group rules. A <b>homomorphism</b> lets you translate one group into another while preserving multiplication. These two ideas are how representation theory turns abstract symmetries into matrices without breaking the symmetry story.</p>",
    definition:
      "<p>A subset $H\\subseteq G$ is a <b>subgroup</b> if $H$ is itself a group using the operation from $G$. A practical test is: $H$ is nonempty, and for all $a,b\\in H$, the element $ab^{-1}$ is in $H$. A <b>homomorphism</b> from $G$ to $K$ is a function $\\phi:G\\to K$ satisfying $\\phi(ab)=\\phi(a)\\phi(b)$ for all $a,b\\in G$.</p>" +
      "<p>The subgroup test works because $ab^{-1}$ gives both closure and inverses: using $a=e$ gives $b^{-1}$, and then using $b^{-1}$ lets products stay inside. <b>Assumptions that matter:</b> $H$ uses the same operation as $G$, and a homomorphism must preserve the operation, not just map elements one by one.</p>",
    worked: {
      problem: "Show that $H=\\{0,3,6,9\\}$ is a subgroup of $\\mathbb Z_{12}$ under addition, and compute the image of $H$ under $\\phi(x)=x\\bmod 3$.",
      skills: ["subgroup test", "modular arithmetic", "homomorphism images"],
      strategy: "Use the additive subgroup test, then apply the map to each element.",
      steps: [
        { do: "Check nonempty", result: "$0\\in H$", why: "a subgroup candidate must contain at least one element" },
        { do: "Take two generic elements", result: "$a=3m$ and $b=3n$", why: "every element of $H$ is a multiple of $3$ modulo $12$" },
        { do: "Compute the additive test", result: "$a-b=3m-3n=3(m-n)$", why: "subgroups under addition use $a-b$" },
        { do: "Reduce modulo $12$", result: "$a-b\\in\\{0,3,6,9\\}$", why: "multiples of $3$ modulo $12$ have exactly these residues" },
        { do: "Apply $\\phi$ to all elements", result: "$0,0,0,0$", why: "each member of $H$ is divisible by $3$" },
        { do: "State the image", result: "$\\{0\\}$", why: "sets list distinct outputs only" }
      ],
      verify: "Adding any two elements of $H$ modulo $12$ stays in $H$, and every element has its negative in $H$.",
      answer: "$H$ is a subgroup of $\\mathbb Z_{12}$, and $\\phi(H)=\\{0\\}$.",
      connects: "Subgroups identify smaller closed systems, while homomorphisms reveal what structure survives under a map."
    },
    practice: [
      { problem: "Show that even integers form a subgroup of $\\mathbb Z$ under addition.", steps: [
        { do: "Name the set", result: "$2\\mathbb Z=\\{2k:k\\in\\mathbb Z\\}$", why: "even integers are multiples of $2$" },
        { do: "Check nonempty", result: "$0=2\\cdot0\\in2\\mathbb Z$", why: "the identity is present" },
        { do: "Choose two elements", result: "$a=2m$ and $b=2n$", why: "use generic even integers" },
        { do: "Compute $a-b$", result: "$2m-2n=2(m-n)$", why: "the subgroup test for addition" },
        { do: "Check membership", result: "$2(m-n)\\in2\\mathbb Z$", why: "$m-n$ is an integer" }
      ], answer: "The even integers are a subgroup of $\\mathbb Z$ under addition." },
      { problem: "In $\\mathbb Z_{10}$ under addition, decide whether $\\{0,5\\}$ is a subgroup.", steps: [
        { do: "Check nonempty", result: "$0\\in\\{0,5\\}$", why: "identity is present" },
        { do: "Compute $5-0$", result: "$5$", why: "one subgroup-test difference" },
        { do: "Compute $0-5$ modulo $10$", result: "$5$", why: "$-5\\equiv5\\pmod{10}$" },
        { do: "Compute $5-5$", result: "$0$", why: "difference of equal elements is identity" },
        { do: "Conclude closure under differences", result: "all results are $0$ or $5$", why: "the subgroup test is satisfied" }
      ], answer: "Yes. $\\{0,5\\}$ is a subgroup of $\\mathbb Z_{10}$." },
      { problem: "Show that $\\phi:\\mathbb Z\\to\\mathbb Z_4$ given by $\\phi(n)=n\\bmod4$ is a homomorphism.", steps: [
        { do: "Take two integers", result: "$m,n\\in\\mathbb Z$", why: "homomorphism must hold for all inputs" },
        { do: "Apply $\\phi$ to the sum", result: "$\\phi(m+n)=(m+n)\\bmod4$", why: "use the definition of the map" },
        { do: "Separate residues", result: "$(m+n)\\bmod4=(m\\bmod4+n\\bmod4)\\bmod4$", why: "modular reduction respects addition" },
        { do: "Rewrite with $\\phi$", result: "$\\phi(m+n)=\\phi(m)+\\phi(n)$ in $\\mathbb Z_4$", why: "the operation in the target is addition modulo $4$" },
        { do: "State preservation", result: "operation is preserved", why: "this is the homomorphism condition" }
      ], answer: "$\\phi$ is a group homomorphism." },
      { problem: "Find the kernel of $\\phi:\\mathbb Z\\to\\mathbb Z_6$ with $\\phi(n)=n\\bmod6$.", steps: [
        { do: "Recall the kernel", result: "$\\ker\\phi=\\{n:\\phi(n)=0\\}$", why: "kernel means elements sent to the identity" },
        { do: "Apply the map", result: "$n\\bmod6=0$", why: "the target identity under addition is $0$" },
        { do: "Translate the congruence", result: "$6$ divides $n$", why: "zero residue means multiple of $6$" },
        { do: "Write the set", result: "$6\\mathbb Z$", why: "all integer multiples of $6$" },
        { do: "Check one example", result: "$\\phi(12)=0$", why: "$12$ is divisible by $6$" }
      ], answer: "$\\ker\\phi=6\\mathbb Z$." },
      { problem: "A representation sends a $90^\\circ$ rotation $r$ to the matrix $R=\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}$. Check the homomorphism rule for $r^2$.", steps: [
        { do: "Write the rule to check", result: "$\\rho(r^2)=\\rho(r)\\rho(r)$", why: "homomorphisms preserve products" },
        { do: "Square the matrix", result: "$R^2=\\begin{pmatrix}-1&0\\\\0&-1\\end{pmatrix}$", why: "multiply rows by columns" },
        { do: "Interpret the matrix", result: "$R^2=-I$", why: "a $180^\\circ$ rotation negates both coordinates" },
        { do: "Identify $r^2$", result: "$180^\\circ$ rotation", why: "two quarter-turns make a half-turn" },
        { do: "Compare", result: "$\\rho(r^2)=R^2$", why: "the matrix product matches the composed rotation" }
      ], answer: "The homomorphism rule holds for $r^2$: $\\rho(r^2)=\\rho(r)^2=-I$." }
    ],
    applications: [
      { title: "Parity maps", background: "Parity is one of the simplest homomorphisms: it forgets exact integers and keeps even-versus-odd structure.", numbers: "The map $n\\mapsto n\\bmod2$ sends $7+9=16$ to $0$, matching $1+1=0$ in $\\mathbb Z_2$." },
      { title: "Feature hashing", background: "Hashing often maps large key spaces into smaller residue classes while preserving a chosen modular operation.", numbers: "Keys $14$ and $29$ both map to bucket $4$ modulo $5$ because $14\\equiv29\\equiv4$." },
      { title: "Signal symmetries", background: "A signal may have a subgroup of shifts that leave it unchanged, which helps compression and frequency analysis.", numbers: "A length-$8$ pattern repeating every $2$ samples is fixed by shifts $0,2,4,6$, a subgroup of four shifts." },
      { title: "Robotics constraints", background: "Allowed motions of a robot arm can form a subgroup of all rigid motions when joints restrict movement.", numbers: "If only rotations by multiples of $30^\\circ$ are allowed, there are $12$ allowed rotations in a full turn." },
      { title: "Representation learning", background: "A neural layer that maps symmetries to matrices is useful only when composition is preserved.", numbers: "If $r$ is a $120^\\circ$ turn, a representation must satisfy $\\rho(r)^3=I$, so three matrix multiplications return identity." },
      { title: "Error-correcting codes", background: "Linear codes are subgroups of bit strings under bitwise addition modulo $2$.", numbers: "The code $\\{000,111\\}$ is closed because $111+111=000$ modulo $2$." }
    ],
    applicationsClose: "Subgroups find stable smaller worlds, and homomorphisms let those worlds be translated without losing their multiplication law.",
    takeaways: [
      "A subgroup is a subset that is a group under the inherited operation.",
      "A homomorphism satisfies $\\phi(ab)=\\phi(a)\\phi(b)$.",
      "Kernels and images reveal what a homomorphism collapses and what it preserves."
    ]
  },

  "math-10-03": {
    id: "math-10-03",
    title: "Group actions",
    tagline: "A group action turns abstract symmetry into actual movement on a set.",
    connections: {
      buildsOn: ["Groups", "Subgroups and homomorphisms", "functions"],
      leadsTo: ["Orbits and stabilizers", "Linear representations", "invariance"],
      usedWith: ["sets", "permutations", "equivalence relations", "symmetry groups"]
    },
    motivation:
      "<p>A group by itself can feel like a box of labeled moves. A square, an image, or a set of labels gives those moves somewhere to act.</p>" +
      "<p>A <b>group action</b> is the bridge: each group element becomes a transformation of a set, and multiplication in the group matches doing transformations in sequence. This is the first moment where symmetry starts visibly moving data.</p>",
    definition:
      "<p>A <b>left action</b> of a group $G$ on a set $X$ assigns to each $g\\in G$ and $x\\in X$ an element $g\\cdot x\\in X$ such that $e\\cdot x=x$ and $(gh)\\cdot x=g\\cdot(h\\cdot x)$ for all $g,h\\in G$ and $x\\in X$.</p>" +
      "<p>The second rule is the key derivation: doing $h$ first and then $g$ must equal doing the combined group element $gh$. Thus the action is the same as a homomorphism $G\\to \\operatorname{Sym}(X)$, where $\\operatorname{Sym}(X)$ is the group of permutations of $X$. <b>Assumptions that matter:</b> every action output stays in $X$, and the order of multiplication matters for noncommutative groups.</p>",
    worked: {
      problem: "Let $\\mathbb Z_4$ act on positions $X=\\{0,1,2,3\\}$ by $k\\cdot x=(x+k)\\bmod4$. Compute $2\\cdot3$ and verify the action rule for $1$ and $2$ at $x=3$.",
      skills: ["modular arithmetic", "action axioms", "composition"],
      strategy: "Treat each group element as a shift, then compare one combined shift with two successive shifts.",
      steps: [
        { do: "Apply the action", result: "$2\\cdot3=(3+2)\\bmod4$", why: "the element $2$ shifts by two positions" },
        { do: "Reduce modulo $4$", result: "$1$", why: "$5$ leaves remainder $1$" },
        { do: "Combine the group elements", result: "$1+2=3$ in $\\mathbb Z_4$", why: "the group operation is addition modulo $4$" },
        { do: "Act with the combined element", result: "$3\\cdot3=(3+3)\\bmod4=2$", why: "one shift by three" },
        { do: "Act successively inside first", result: "$2\\cdot3=1$", why: "start with the inner action" },
        { do: "Act by $1$ afterward", result: "$1\\cdot1=2$", why: "shift the result by one" }
      ],
      verify: "Both the combined action and the successive action give $2$, so $(1+2)\\cdot3=1\\cdot(2\\cdot3)$.",
      answer: "$2\\cdot3=1$, and the action rule holds in the checked case.",
      connects: "An action is a promise that group multiplication matches composition of movements."
    },
    practice: [
      { problem: "Let $\\mathbb Z_5$ act on itself by addition. Compute $4\\cdot3$ and $2\\cdot(4\\cdot3)$.", steps: [
        { do: "Compute the first action", result: "$4\\cdot3=(3+4)\\bmod5$", why: "shift by $4$" },
        { do: "Reduce", result: "$2$", why: "$7\\equiv2\\pmod5$" },
        { do: "Use the intermediate value", result: "$2\\cdot(4\\cdot3)=2\\cdot2$", why: "$4\\cdot3=2$" },
        { do: "Apply the second action", result: "$(2+2)\\bmod5$", why: "shift by $2$" },
        { do: "Reduce", result: "$4$", why: "$4$ is already a residue" }
      ], answer: "$4\\cdot3=2$ and $2\\cdot(4\\cdot3)=4$." },
      { problem: "A flip group $\\{e,f\\}$ acts on two labels $\\{L,R\\}$ by swapping them. Compute $f\\cdot L$ and $f\\cdot(f\\cdot L)$.", steps: [
        { do: "Apply the flip to $L$", result: "$f\\cdot L=R$", why: "the flip swaps the two labels" },
        { do: "Use the intermediate result", result: "$f\\cdot(f\\cdot L)=f\\cdot R$", why: "substitute $R$" },
        { do: "Apply the flip to $R$", result: "$L$", why: "the flip swaps back" },
        { do: "Use the group rule", result: "$f^2=e$", why: "two flips equal identity" },
        { do: "Compare with identity", result: "$e\\cdot L=L$", why: "the action respects multiplication" }
      ], answer: "$f\\cdot L=R$ and $f\\cdot(f\\cdot L)=L$." },
      { problem: "Let rotations of a square act on its vertices $\\{0,1,2,3\\}$ by $r\\cdot x=x+1\\bmod4$. Find $r^3\\cdot2$.", steps: [
        { do: "Interpret $r^3$", result: "shift by $3$ vertices", why: "each $r$ advances one vertex" },
        { do: "Apply the shift", result: "$r^3\\cdot2=(2+3)\\bmod4$", why: "use the vertex action" },
        { do: "Add", result: "$5\\bmod4$", why: "$2+3=5$" },
        { do: "Reduce", result: "$1$", why: "$5$ leaves remainder $1$" },
        { do: "Check by steps", result: "$2\\to3\\to0\\to1$", why: "three one-step rotations agree" }
      ], answer: "$r^3\\cdot2=1$." },
      { problem: "Show that the identity rule fails if $k\\cdot x=(x+k+1)\\bmod4$ for $\\mathbb Z_4$ on $\\{0,1,2,3\\}$.", steps: [
        { do: "Identify the group identity", result: "$0$", why: "$\\mathbb Z_4$ uses addition" },
        { do: "Apply the proposed action with $k=0$", result: "$0\\cdot x=(x+1)\\bmod4$", why: "substitute $k=0$" },
        { do: "Test $x=2$", result: "$0\\cdot2=3$", why: "$2+1=3$" },
        { do: "Compare to the identity requirement", result: "$3\\ne2$", why: "identity should leave every point fixed" },
        { do: "Conclude", result: "not a group action", why: "one action axiom fails" }
      ], answer: "This rule is not a group action because the identity element does not act as the identity map." },
      { problem: "A cyclic shift acts on vector entries $[a,b,c]$ by $s\\cdot[a,b,c]=[c,a,b]$. Compute $s^2\\cdot[2,5,9]$.", steps: [
        { do: "Apply one shift", result: "$s\\cdot[2,5,9]=[9,2,5]$", why: "last entry moves to the front" },
        { do: "Apply the second shift", result: "$s\\cdot[9,2,5]=[5,9,2]$", why: "repeat the same action" },
        { do: "Name the result", result: "$s^2\\cdot[2,5,9]=[5,9,2]$", why: "two shifts equal $s^2$" },
        { do: "Check a third shift", result: "$s^3\\cdot[2,5,9]=[2,5,9]$", why: "three cyclic shifts return the vector" },
        { do: "Interpret the group", result: "$s^3=e$", why: "the action comes from a cyclic group of order $3$" }
      ], answer: "$s^2\\cdot[2,5,9]=[5,9,2]$." }
    ],
    applications: [
      { title: "Image translations", background: "Computer vision treats pixel shifts as actions on image grids. The same abstract rule moves every pixel coordinate.", numbers: "A shift by $(2,-1)$ sends pixel $(10,7)$ to $(12,6)$." },
      { title: "Data augmentation labels", background: "When augmentation transforms an input, it may also act on labels or coordinates.", numbers: "A horizontal flip in a width-$100$ image sends keypoint $x=20$ to $x=79$ if coordinates run $0$ to $99$." },
      { title: "Permutation of tokens", background: "Some models reason about sets where reordering elements should not change the object. Permutations act on the order of entries.", numbers: "The permutation $(1\\ 3)$ sends vector $[4,8,2]$ to $[2,8,4]$." },
      { title: "Rotating point clouds", background: "Geometry processing uses rotation groups acting on points in space.", numbers: "A $90^\\circ$ rotation sends $(3,1)$ to $(-1,3)$." },
      { title: "Scheduling cycles", background: "Cyclic groups act on recurring states such as days, shards, or time slots.", numbers: "A shift of $5$ slots on $8$ workers sends worker $6$ to $(6+5)\\bmod8=3$." },
      { title: "Graph automorphisms", background: "Graph symmetries act on vertices while preserving edges, a foundation for graph neural network symmetry.", numbers: "On a triangle, rotation $r$ sends vertices $0\\to1$, $1\\to2$, and $2\\to0$." }
    ],
    applicationsClose: "An action is the moment symmetry touches objects: pixels, points, labels, tokens, schedules, and graphs all become movable in a lawful way.",
    takeaways: [
      "A group action assigns each group element a transformation of a set.",
      "The identity must act as doing nothing, and products must act like composition.",
      "Actions are equivalent to homomorphisms into a permutation group."
    ]
  },

  "math-10-04": {
    id: "math-10-04",
    title: "Orbits and stabilizers",
    tagline: "Orbits tell where a point can go; stabilizers tell which symmetries keep it still.",
    connections: {
      buildsOn: ["Group actions", "Groups", "sets"],
      leadsTo: ["Linear representations", "Invariance", "Equivariance"],
      usedWith: ["equivalence classes", "subgroups", "counting", "symmetry"]
    },
    motivation:
      "<p>Once a group acts, each point has a little story. Some symmetries move it to many places; others leave it exactly where it was.</p>" +
      "<p>The <b>orbit</b> is the reachable set. The <b>stabilizer</b> is the set of group elements that fix the point. Together they separate movement from sameness, a distinction that appears constantly in invariant features and equivariant models.</p>",
    definition:
      "<p>For an action of $G$ on $X$ and a point $x\\in X$, the <b>orbit</b> of $x$ is $G\\cdot x=\\{g\\cdot x:g\\in G\\}$. The <b>stabilizer</b> of $x$ is $G_x=\\{g\\in G:g\\cdot x=x\\}$.</p>" +
      "<p>The stabilizer is a subgroup: the identity fixes $x$; if $g$ and $h$ fix $x$, then $gh^{-1}$ fixes $x$ because $h^{-1}\\cdot x=x$ and then $g\\cdot x=x$. For finite groups, orbit-stabilizer says $|G|=|G\\cdot x|\\,|G_x|$. <b>Assumptions that matter:</b> the action law must hold, and the counting formula requires $G$ finite.</p>",
    worked: {
      problem: "The rotation group of a square acts on its four vertices. For vertex $0$, find its orbit and stabilizer under rotations only.",
      skills: ["orbits", "stabilizers", "orbit-stabilizer"],
      strategy: "List where the vertex goes under each rotation, then list which rotations return it to itself.",
      steps: [
        { do: "List the rotations", result: "$\\{e,r,r^2,r^3\\}$", why: "a square has four rotational symmetries" },
        { do: "Act by $e$ on vertex $0$", result: "$0$", why: "identity fixes every vertex" },
        { do: "Act by $r$", result: "$1$", why: "one quarter-turn advances one vertex" },
        { do: "Act by $r^2$", result: "$2$", why: "two quarter-turns advance two vertices" },
        { do: "Act by $r^3$", result: "$3$", why: "three quarter-turns advance three vertices" },
        { do: "Collect the orbit", result: "$\\{0,1,2,3\\}$", why: "these are all reachable vertices" },
        { do: "Find rotations fixing $0$", result: "$\\{e\\}$", why: "only the identity leaves vertex $0$ in place" }
      ],
      verify: "$|G|=4$, orbit size is $4$, stabilizer size is $1$, and $4=4\\cdot1$.",
      answer: "The orbit is all four vertices, and the stabilizer is $\\{e\\}$.",
      connects: "Orbit-stabilizer quantifies the tradeoff between how far a point moves and how much symmetry fixes it."
    },
    practice: [
      { problem: "Let $\\mathbb Z_6$ act on itself by addition. Find the orbit and stabilizer of $2$.", steps: [
        { do: "Write the orbit set", result: "$\\{k+2\\bmod6:k\\in\\mathbb Z_6\\}$", why: "apply every group element" },
        { do: "List outputs", result: "$\\{2,3,4,5,0,1\\}$", why: "shifts by $0$ through $5$ reach every residue" },
        { do: "Simplify the orbit", result: "$\\mathbb Z_6$", why: "all six residues appear" },
        { do: "Solve for stabilizer", result: "$k+2\\equiv2\\pmod6$", why: "fixed means the output equals $2$" },
        { do: "Subtract $2$", result: "$k\\equiv0\\pmod6$", why: "only the identity shift fixes the point" }
      ], answer: "Orbit of $2$ is all of $\\mathbb Z_6$; stabilizer is $\\{0\\}$." },
      { problem: "The flip group $\\{e,f\\}$ acts on labels $\\{L,R\\}$ by swapping them. Find the orbit and stabilizer of $L$.", steps: [
        { do: "Apply $e$", result: "$e\\cdot L=L$", why: "identity fixes labels" },
        { do: "Apply $f$", result: "$f\\cdot L=R$", why: "the flip swaps labels" },
        { do: "Collect the orbit", result: "$\\{L,R\\}$", why: "these are reachable from $L$" },
        { do: "Find elements fixing $L$", result: "$e$ only", why: "$f$ sends $L$ to $R$" },
        { do: "Check sizes", result: "$2=2\\cdot1$", why: "orbit-stabilizer holds" }
      ], answer: "Orbit $\\{L,R\\}$; stabilizer $\\{e\\}$." },
      { problem: "Rotations of a regular hexagon act on its center point. Find the orbit and stabilizer of the center.", steps: [
        { do: "Name the point", result: "center $c$", why: "the center is unchanged by rotations" },
        { do: "Apply any rotation", result: "$g\\cdot c=c$", why: "rotations are around the center" },
        { do: "Collect the orbit", result: "$\\{c\\}$", why: "the center reaches only itself" },
        { do: "Collect fixing rotations", result: "all $6$ rotations", why: "every rotation fixes the center" },
        { do: "Check sizes", result: "$6=1\\cdot6$", why: "orbit-stabilizer matches" }
      ], answer: "The orbit is $\\{c\\}$, and the stabilizer is the whole rotation group." },
      { problem: "A group of size $24$ acts on a finite set. If a point has stabilizer size $6$, find its orbit size.", steps: [
        { do: "Write orbit-stabilizer", result: "$|G|=|G\\cdot x|\\,|G_x|$", why: "finite group action" },
        { do: "Substitute known sizes", result: "$24=|G\\cdot x|\\cdot6$", why: "group size is $24$ and stabilizer size is $6$" },
        { do: "Divide by $6$", result: "$|G\\cdot x|=4$", why: "isolate orbit size" },
        { do: "Interpret", result: "the point reaches $4$ distinct positions", why: "orbit size counts reachable outputs" },
        { do: "Check integrality", result: "$4$ is an integer divisor", why: "orbit sizes divide finite group sizes" }
      ], answer: "The orbit has size $4$." },
      { problem: "A $4\\times4$ image has a bright pixel at coordinate $(1,2)$. Cyclic horizontal shifts act on columns modulo $4$. Find the orbit and stabilizer of the pixel coordinate.", steps: [
        { do: "List possible shifts", result: "$0,1,2,3$", why: "columns are modulo $4$" },
        { do: "Apply shift $k$", result: "$(1,2+k\\bmod4)$", why: "only the column changes" },
        { do: "List coordinates", result: "$(1,2),(1,3),(1,0),(1,1)$", why: "use $k=0,1,2,3$" },
        { do: "Solve for fixed shifts", result: "$2+k\\equiv2\\pmod4$", why: "stabilizer fixes the column" },
        { do: "Solve", result: "$k=0$", why: "only the zero shift fixes a single pixel column" }
      ], answer: "The orbit is all four positions in row $1$; the stabilizer is the zero shift." }
    ],
    applications: [
      { title: "Data augmentation coverage", background: "An orbit describes every sample obtained by applying an augmentation group to one example.", numbers: "Four rotations of an image produce an orbit of size $4$ unless the image is rotationally symmetric." },
      { title: "Invariant features", background: "A feature constant on orbits ignores transformations that should not matter.", numbers: "If a digit image and its $1$-pixel shift are in the same orbit, an invariant score might give both $0.92$." },
      { title: "Symmetric objects", background: "A large stabilizer means an object has many symmetries. This matters in geometry and chemistry.", numbers: "The center of a hexagon has stabilizer size $6$ under rotations, while a vertex has stabilizer size $1$." },
      { title: "Graph isomorphism", background: "Automorphism groups act on vertices; orbits identify vertices that are structurally indistinguishable.", numbers: "In a $5$-cycle, every vertex lies in one orbit of size $5$." },
      { title: "Counting configurations", background: "Orbit-stabilizer reduces repeated counting by separating distinct positions from symmetries that fix them.", numbers: "If $|G|=12$ and a configuration has $3$ stabilizers, it has $12/3=4$ distinct transformed versions." },
      { title: "Robotics grasp planning", background: "Equivalent grasps under object symmetry belong to the same orbit, reducing search.", numbers: "A cylinder with $8$ sampled rotations may turn $8$ candidate grasps into $1$ orbit if all rotations are equivalent." }
    ],
    applicationsClose: "Orbits and stabilizers teach the same lesson from two sides: what can move, and what is genuinely unchanged.",
    takeaways: [
      "The orbit of $x$ is the set of all points reachable from $x$ by the group action.",
      "The stabilizer of $x$ is the subgroup of elements that fix $x$.",
      "For finite groups, $|G|=|G\\cdot x|\\,|G_x|$."
    ]
  },

  "math-10-05": {
    id: "math-10-05",
    title: "Linear representations",
    tagline: "A representation lets a group act by matrices, so symmetry can be computed with linear algebra.",
    connections: {
      buildsOn: ["Groups", "Group actions", "matrices", "linear maps"],
      leadsTo: ["Subrepresentations", "Reducibility", "Characters"],
      usedWith: ["vector spaces", "eigenvectors", "change of basis", "matrix multiplication"]
    },
    motivation:
      "<p>Groups describe symmetry, but computers are happiest with vectors and matrices. Representation theory begins by asking: can each symmetry be written as a linear transformation?</p>" +
      "<p>A <b>linear representation</b> answers yes in a disciplined way. Each group element becomes an invertible matrix, and group multiplication becomes matrix multiplication. Now abstract symmetry can act on coordinates, features, signals, and neural activations.</p>",
    definition:
      "<p>A <b>representation</b> of a group $G$ on a vector space $V$ is a homomorphism $\\rho:G\\to GL(V)$, where $GL(V)$ is the group of invertible linear maps from $V$ to itself. Thus $\\rho(e)=I$ and $\\rho(gh)=\\rho(g)\\rho(h)$.</p>" +
      "<p>The identity rule follows from the homomorphism law: $\\rho(e)=\\rho(ee)=\\rho(e)^2$, and because $\\rho(e)$ is invertible, multiplying by $\\rho(e)^{-1}$ gives $\\rho(e)=I$. <b>Assumptions that matter:</b> all maps are linear, all matrices are invertible, and the order of multiplication must match the group operation.</p>",
    worked: {
      problem: "Let $C_4=\\langle r:r^4=e\\rangle$ act on $\\mathbb R^2$ by $90^\\circ$ rotation with $\\rho(r)=\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}$. Compute $\\rho(r)^2$ and $\\rho(r)^4$.",
      skills: ["matrix multiplication", "cyclic groups", "homomorphism rule"],
      strategy: "Square the rotation matrix, then square again to see the group relation $r^4=e$ in matrix form.",
      steps: [
        { do: "Write the matrix", result: "$R=\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}$", why: "this is $\\rho(r)$" },
        { do: "Multiply $R$ by $R$", result: "$R^2=\\begin{pmatrix}-1&0\\\\0&-1\\end{pmatrix}$", why: "row-column multiplication" },
        { do: "Interpret $R^2$", result: "$-I$", why: "two quarter-turns make a half-turn" },
        { do: "Square $R^2$", result: "$R^4=(-I)^2$", why: "four turns are two half-turns" },
        { do: "Compute the square", result: "$I$", why: "negating twice returns each coordinate" },
        { do: "Compare to the group", result: "$\\rho(r^4)=\\rho(e)=I$", why: "the matrix relation matches $r^4=e$" }
      ],
      verify: "Applying $R$ four times to $(1,0)$ gives $(0,1)$, $(-1,0)$, $(0,-1)$, and back to $(1,0)$.",
      answer: "$\\rho(r)^2=-I$ and $\\rho(r)^4=I$.",
      connects: "A representation turns group relations into matrix equations."
    },
    practice: [
      { problem: "For $C_2=\\{e,s\\}$, let $\\rho(s)=\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$. Check that this defines the relation $s^2=e$.", steps: [
        { do: "Name the matrix", result: "$S=\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$", why: "this is the image of $s$" },
        { do: "Square $S$", result: "$S^2=\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}$", why: "$1^2=1$ and $(-1)^2=1$" },
        { do: "Identify the result", result: "$I$", why: "the identity matrix leaves vectors fixed" },
        { do: "Compare with the group relation", result: "$\\rho(s^2)=\\rho(e)$", why: "$s^2=e$" },
        { do: "Conclude", result: "$\\rho(s)^2=\\rho(e)$", why: "the relation is respected" }
      ], answer: "Yes. Since $S^2=I$, the representation respects $s^2=e$." },
      { problem: "Let $\\rho(n)=[2^n]$ be a $1\\times1$ matrix for $n\\in\\mathbb Z$ under addition. Show $\\rho(m+n)=\\rho(m)\\rho(n)$.", steps: [
        { do: "Apply $\\rho$ to the sum", result: "$\\rho(m+n)=[2^{m+n}]$", why: "use the definition" },
        { do: "Use exponent laws", result: "$[2^{m+n}]=[2^m2^n]$", why: "adding exponents multiplies powers" },
        { do: "Write the matrix product", result: "$[2^m][2^n]$", why: "$1\\times1$ matrix multiplication is scalar multiplication" },
        { do: "Rewrite with $\\rho$", result: "$\\rho(m)\\rho(n)$", why: "match the definition" },
        { do: "Check invertibility", result: "$2^n\\ne0$", why: "representation matrices must be invertible" }
      ], answer: "$\\rho$ is a representation of $\\mathbb Z$ on $\\mathbb R$." },
      { problem: "For the sign representation of $\\{e,f\\}$, define $\\rho(e)=1$ and $\\rho(f)=-1$. Verify all products.", steps: [
        { do: "Check $ee=e$", result: "$\\rho(e)\\rho(e)=1\\cdot1=1=\\rho(e)$", why: "identity times identity" },
        { do: "Check $ef=f$", result: "$1\\cdot(-1)=-1=\\rho(f)$", why: "identity then flip" },
        { do: "Check $fe=f$", result: "$(-1)\\cdot1=-1=\\rho(f)$", why: "flip then identity" },
        { do: "Check $ff=e$", result: "$(-1)(-1)=1=\\rho(e)$", why: "two signs cancel" },
        { do: "Conclude", result: "homomorphism holds", why: "all group products are preserved" }
      ], answer: "The sign representation is valid." },
      { problem: "A cyclic group $C_3$ has generator $r$. Does $\\rho(r)=\\begin{pmatrix}0&-1\\\\1&-1\\end{pmatrix}$ satisfy $\\rho(r)^3=I$?", steps: [
        { do: "Name the matrix", result: "$A=\\begin{pmatrix}0&-1\\\\1&-1\\end{pmatrix}$", why: "this is the proposed image" },
        { do: "Compute $A^2$", result: "$\\begin{pmatrix}-1&1\\\\-1&0\\end{pmatrix}$", why: "multiply $A$ by itself" },
        { do: "Compute $A^3$", result: "$A^2A$", why: "one more multiplication" },
        { do: "Multiply", result: "$\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}$", why: "row-column products give the identity" },
        { do: "Compare with $r^3=e$", result: "$A^3=I$", why: "the generator relation is satisfied" }
      ], answer: "Yes. The matrix satisfies $A^3=I$." },
      { problem: "Apply the $90^\\circ$ rotation representation to vector $v=(2,3)$ twice.", steps: [
        { do: "Apply $R$ once", result: "$R(2,3)=(-3,2)$", why: "$90^\\circ$ rotation sends $(x,y)$ to $(-y,x)$" },
        { do: "Apply $R$ again", result: "$R(-3,2)=(-2,-3)$", why: "repeat the same rule" },
        { do: "Use $R^2$", result: "$R^2=-I$", why: "two quarter-turns make a half-turn" },
        { do: "Apply $-I$ directly", result: "$-I(2,3)=(-2,-3)$", why: "negate both coordinates" },
        { do: "Compare", result: "same vector", why: "the representation respects composition" }
      ], answer: "After two rotations, $v$ becomes $(-2,-3)$." }
    ],
    applications: [
      { title: "2-D rotations", background: "Graphics and robotics use matrix representations of rotation groups to move coordinates.", numbers: "A $90^\\circ$ rotation matrix sends $(4,1)$ to $(-1,4)$." },
      { title: "Fourier modes", background: "Cyclic shifts are represented by complex phases, which is why Fourier transforms diagonalize circular convolution.", numbers: "For length $4$, one shift acts on frequency $1$ by multiplying by $e^{2\\pi i/4}=i$." },
      { title: "Quantum spin", background: "Physics represents rotation symmetries by matrices acting on state vectors.", numbers: "A two-state spin vector may be transformed by a $2\\times2$ unitary matrix with norm preserved at $1$." },
      { title: "Feature transformations", background: "In equivariant ML, feature channels transform by representation matrices when the input is transformed.", numbers: "A vector feature $(3,4)$ rotated by $90^\\circ$ becomes $(-4,3)$, preserving length $5$." },
      { title: "Permutation matrices", background: "Reordering coordinates is a representation of a permutation group.", numbers: "The swap matrix $\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$ sends $(7,2)$ to $(2,7)$ and squares to $I$." },
      { title: "Spherical data", background: "Representations of rotation groups organize signals on spheres, used in molecular modeling and climate data.", numbers: "A 3-D rotation matrix keeps $\\|(1,2,2)\\|=3$ unchanged after rotation." }
    ],
    applicationsClose: "Representations are the computational face of symmetry: group laws become matrix products that vectors can feel.",
    takeaways: [
      "A representation is a homomorphism $\\rho:G\\to GL(V)$.",
      "Group identities and relations become identity and product relations among matrices.",
      "Representations let symmetry act on vectors, features, and signals."
    ]
  },

  "math-10-06": {
    id: "math-10-06",
    title: "Subrepresentations",
    tagline: "A subrepresentation is a smaller vector space that the whole group action respects.",
    connections: {
      buildsOn: ["Linear representations", "subspaces", "matrix multiplication"],
      leadsTo: ["Reducibility", "Irreducible representations", "Schur's lemma"],
      usedWith: ["invariant subspaces", "direct sums", "eigenvectors", "change of basis"]
    },
    motivation:
      "<p>A matrix can preserve a line, a plane, or a coordinate block. When every symmetry in a representation preserves the same subspace, that subspace is not just geometric decoration; it is a smaller representation living inside the larger one.</p>" +
      "<p>Subrepresentations help us decompose complicated actions into simpler pieces. They are the representation-theory version of noticing that a problem has a stable part you can study on its own.</p>",
    definition:
      "<p>Let $\\rho:G\\to GL(V)$ be a representation. A subspace $W\\subseteq V$ is a <b>subrepresentation</b> if $\\rho(g)w\\in W$ for every $g\\in G$ and every $w\\in W$. In that case, the restricted maps $\\rho(g)|_W$ form a representation on $W$.</p>" +
      "<p>The restriction is a representation because the same product law survives on $W$: $\\rho(gh)w=\\rho(g)\\rho(h)w$, and $\\rho(h)w$ is still in $W$. <b>Assumptions that matter:</b> $W$ must be a linear subspace, not just a subset, and it must be preserved by every group element, not merely one convenient matrix.</p>",
    worked: {
      problem: "Let $C_2=\\{e,s\\}$ act on $\\mathbb R^2$ by $\\rho(s)=\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$. Show that the $x$-axis is a subrepresentation.",
      skills: ["invariant subspaces", "matrix action", "restriction"],
      strategy: "Describe a generic vector on the $x$-axis and check that both group elements keep it there.",
      steps: [
        { do: "Name the subspace", result: "$W=\\{(a,0):a\\in\\mathbb R\\}$", why: "the $x$-axis consists of vectors with zero second coordinate" },
        { do: "Apply the identity", result: "$I(a,0)=(a,0)$", why: "identity preserves every subspace" },
        { do: "Apply $\\rho(s)$", result: "$\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}\\begin{pmatrix}a\\\\0\\end{pmatrix}=\\begin{pmatrix}a\\\\0\\end{pmatrix}$", why: "the second coordinate is zero" },
        { do: "Check membership", result: "$(a,0)\\in W$", why: "the output still has zero second coordinate" },
        { do: "State preservation", result: "$\\rho(g)W\\subseteq W$ for $g=e,s$", why: "both group elements preserve the line" }
      ],
      verify: "The $y$-axis is also preserved, so the representation visibly splits into two one-dimensional actions.",
      answer: "The $x$-axis is a subrepresentation.",
      connects: "Subrepresentations are invariant subspaces for the entire group action."
    },
    practice: [
      { problem: "For the same reflection representation, show the $y$-axis is a subrepresentation.", steps: [
        { do: "Name the subspace", result: "$Y=\\{(0,b):b\\in\\mathbb R\\}$", why: "vectors on the $y$-axis have zero first coordinate" },
        { do: "Apply identity", result: "$I(0,b)=(0,b)$", why: "identity preserves all vectors" },
        { do: "Apply $\\rho(s)$", result: "$(0,-b)$", why: "the matrix negates the second coordinate" },
        { do: "Check membership", result: "$(0,-b)\\in Y$", why: "the first coordinate remains zero" },
        { do: "Conclude", result: "$Y$ is preserved", why: "every group element sends $Y$ to itself" }
      ], answer: "The $y$-axis is a subrepresentation." },
      { problem: "Let $C_3$ cyclically permute coordinates in $\\mathbb R^3$. Show the line $W=\\operatorname{span}\\{(1,1,1)\\}$ is a subrepresentation.", steps: [
        { do: "Take a vector in $W$", result: "$a(1,1,1)=(a,a,a)$", why: "generic vector on the line" },
        { do: "Apply a cyclic shift", result: "$(a,a,a)$", why: "all coordinates are equal" },
        { do: "Apply a second shift", result: "$(a,a,a)$", why: "shifting equal coordinates changes nothing" },
        { do: "Check membership", result: "$(a,a,a)\\in W$", why: "it is still a multiple of $(1,1,1)$" },
        { do: "Conclude", result: "$W$ is invariant", why: "the generator preserves it, so all powers preserve it" }
      ], answer: "$\\operatorname{span}\\{(1,1,1)\\}$ is a subrepresentation." },
      { problem: "For the $90^\\circ$ rotation representation on $\\mathbb R^2$, decide whether the $x$-axis is a subrepresentation.", steps: [
        { do: "Choose a vector on the $x$-axis", result: "$(1,0)$", why: "one counterexample is enough if it leaves the line" },
        { do: "Apply the rotation", result: "$R(1,0)=(0,1)$", why: "$90^\\circ$ rotation sends $x$-axis to $y$-axis" },
        { do: "Check membership", result: "$(0,1)\\notin$ the $x$-axis", why: "the second coordinate is not zero" },
        { do: "Apply the definition", result: "not preserved", why: "every vector must stay in the subspace" },
        { do: "Conclude", result: "not a subrepresentation", why: "one group element moves the line out of itself" }
      ], answer: "No. The $x$-axis is not a subrepresentation for $90^\\circ$ rotations." },
      { problem: "Let diagonal matrices $\\rho(g)=\\begin{pmatrix}2&0\\\\0&3\\end{pmatrix}$ act for a single generator of $\\mathbb Z$. Is $W=\\operatorname{span}\\{(1,1)\\}$ invariant under this matrix?", steps: [
        { do: "Take the basis vector", result: "$(1,1)$", why: "it spans $W$" },
        { do: "Apply the matrix", result: "$(2,3)$", why: "multiply diagonal entries coordinatewise" },
        { do: "Test for membership", result: "$(2,3)=a(1,1)$ would require $a=2$ and $a=3$", why: "both coordinates of a multiple must be equal" },
        { do: "Identify the contradiction", result: "$2\\ne3$", why: "no single scalar works" },
        { do: "Conclude", result: "$W$ is not invariant", why: "the spanning vector leaves the line" }
      ], answer: "$W=\\operatorname{span}\\{(1,1)\\}$ is not a subrepresentation." },
      { problem: "A feature vector splits as $(u,v)$ with $u\\in\\mathbb R^2$ and $v\\in\\mathbb R$. A group acts by block matrices $\\begin{pmatrix}A_g&0\\\\0&1\\end{pmatrix}$. Show the last coordinate line is a subrepresentation.", steps: [
        { do: "Name the line", result: "$W=\\{(0,0,b):b\\in\\mathbb R\\}$", why: "only the last coordinate is active" },
        { do: "Apply the block matrix", result: "$\\begin{pmatrix}A_g&0\\\\0&1\\end{pmatrix}\\begin{pmatrix}0\\\\0\\\\b\\end{pmatrix}=\\begin{pmatrix}0\\\\0\\\\b\\end{pmatrix}$", why: "the off-diagonal blocks are zero" },
        { do: "Check membership", result: "the output is in $W$", why: "the first two coordinates remain zero" },
        { do: "Repeat for all $g$", result: "$\\rho(g)W\\subseteq W$", why: "the block form is assumed for every group element" },
        { do: "Interpret", result: "scalar feature is invariant inside the representation", why: "the last coordinate transforms trivially" }
      ], answer: "The last-coordinate line is a subrepresentation." }
    ],
    applications: [
      { title: "Separating invariant channels", background: "Equivariant networks often maintain channels that transform differently; invariant scalar channels form subrepresentations.", numbers: "A block vector with $2$ vector channels and $1$ scalar channel has a $1$-dimensional subrepresentation for the scalar." },
      { title: "Fourier decomposition", background: "Cyclic shift representations split into frequency subspaces, each preserved by shifts.", numbers: "For length $4$, the constant vector $(1,1,1,1)$ spans a subrepresentation fixed by every shift." },
      { title: "Principal axes", background: "When a symmetry preserves an axis, computations can be reduced to that axis.", numbers: "Reflection across the $x$-axis preserves both coordinate axes, so two $1$-D subproblems replace one $2$-D problem." },
      { title: "Graph neural features", background: "Permutation representations often contain the all-ones subspace, corresponding to global average features.", numbers: "For $5$ nodes, the vector $(1,1,1,1,1)$ remains unchanged by all $5!$ node permutations." },
      { title: "Physics conserved modes", background: "Symmetry-preserved subspaces can represent modes that do not mix with other modes.", numbers: "A diagonal action with entries $1,-1$ keeps the first coordinate line fixed and flips the second." },
      { title: "Dimensionality reduction", background: "If a learned representation preserves a subspace, a model can compute there without tracking the full space.", numbers: "A $10$-D feature space with a preserved $3$-D subspace can run a $3\\times3$ block separately." }
    ],
    applicationsClose: "Subrepresentations find the stable rooms inside a larger vector space, where the group action can be studied without interference.",
    takeaways: [
      "A subrepresentation is a group-invariant linear subspace.",
      "Every group element must preserve the subspace.",
      "Restricting the action to an invariant subspace gives a smaller representation."
    ]
  },

  "math-10-07": {
    id: "math-10-07",
    title: "Reducibility",
    tagline: "A reducible representation has a meaningful smaller invariant piece hiding inside it.",
    connections: {
      buildsOn: ["Subrepresentations", "Linear representations", "subspaces"],
      leadsTo: ["Irreducible representations", "Schur's lemma", "Characters"],
      usedWith: ["direct sums", "block diagonal matrices", "change of basis", "invariant subspaces"]
    },
    motivation:
      "<p>Large matrices can look intimidating until a good basis reveals blocks. If the group action never mixes one subspace with another, the representation was really made of smaller stories.</p>" +
      "<p><b>Reducibility</b> names this possibility. It is not a flaw; it is a gift. A reducible representation can be decomposed, understood, and computed more efficiently.</p>",
    definition:
      "<p>A representation $\\rho:G\\to GL(V)$ is <b>reducible</b> if $V$ has a nonzero proper subrepresentation $W$, meaning $W\\ne\\{0\\}$, $W\\ne V$, and $\\rho(g)W\\subseteq W$ for every $g\\in G$. If no such $W$ exists, the representation is irreducible.</p>" +
      "<p>When an invariant complement also exists, a basis adapted to $W$ and its complement makes all representation matrices block diagonal. The blocks are smaller representations. <b>Assumptions that matter:</b> reducible only requires one nonzero proper invariant subspace; a full direct-sum decomposition may need extra hypotheses, such as finite groups over $\\mathbb C$ or $\\mathbb R$ with averaged inner products.</p>",
    worked: {
      problem: "Show that $\\rho(s)=\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$ for $C_2$ is reducible on $\\mathbb R^2$.",
      skills: ["reducibility", "invariant lines", "block diagonal form"],
      strategy: "Find one nonzero proper subspace preserved by every group element.",
      steps: [
        { do: "Choose a candidate subspace", result: "$W=\\operatorname{span}\\{(1,0)\\}$", why: "a coordinate axis is easy to test" },
        { do: "Check nonzero", result: "$W\\ne\\{0\\}$", why: "it contains $(1,0)$" },
        { do: "Check proper", result: "$W\\ne\\mathbb R^2$", why: "it is one-dimensional" },
        { do: "Apply $\\rho(s)$", result: "$\\rho(s)(a,0)=(a,0)$", why: "the first coordinate is unchanged" },
        { do: "Apply $\\rho(e)$", result: "$(a,0)$", why: "identity preserves every subspace" },
        { do: "Conclude", result: "$W$ is a nonzero proper subrepresentation", why: "that is exactly reducibility" }
      ],
      verify: "The $y$-axis is another invariant line, so the matrices are already block diagonal.",
      answer: "The representation is reducible.",
      connects: "Reducibility means the group action contains a smaller invariant representation."
    },
    practice: [
      { problem: "Show that the trivial representation on $\\mathbb R^3$ is reducible.", steps: [
        { do: "Recall the action", result: "$\\rho(g)=I$ for every $g$", why: "trivial representation fixes all vectors" },
        { do: "Choose a line", result: "$W=\\operatorname{span}\\{(1,0,0)\\}$", why: "a line is nonzero and proper in $\\mathbb R^3$" },
        { do: "Apply any group element", result: "$\\rho(g)w=w$", why: "all matrices are identity" },
        { do: "Check preservation", result: "$w\\in W$", why: "the vector did not move" },
        { do: "Conclude reducible", result: "nonzero proper invariant subspace exists", why: "this meets the definition" }
      ], answer: "The trivial representation on $\\mathbb R^3$ is reducible." },
      { problem: "For $90^\\circ$ rotations on $\\mathbb R^2$, explain why no real line through the origin is invariant.", steps: [
        { do: "Assume a line is invariant", result: "$W=\\operatorname{span}\\{v\\}$", why: "a proper nonzero subspace of $\\mathbb R^2$ is a line" },
        { do: "Use invariance", result: "$Rv\\in W$", why: "the rotation must keep the line" },
        { do: "Translate to scalar form", result: "$Rv=\\lambda v$", why: "vectors in the same line are scalar multiples" },
        { do: "Use geometry", result: "$Rv$ is perpendicular to $v$", why: "$90^\\circ$ rotation turns every nonzero vector by a right angle" },
        { do: "Compare", result: "a nonzero vector cannot be both perpendicular and parallel to $v$", why: "only the zero vector has that property" }
      ], answer: "No real invariant line exists, so this real $2$-D rotation representation is irreducible." },
      { problem: "A representation has matrices $\\begin{pmatrix}A_g&0\\\\0&B_g\\end{pmatrix}$ on $U\\oplus W$. Show it is reducible if $U$ and $W$ are nonzero.", steps: [
        { do: "Choose the first block subspace", result: "$U\\oplus0$", why: "vectors with zero $W$ component" },
        { do: "Apply a block matrix", result: "$\\begin{pmatrix}A_g&0\\\\0&B_g\\end{pmatrix}\\begin{pmatrix}u\\\\0\\end{pmatrix}=\\begin{pmatrix}A_gu\\\\0\\end{pmatrix}$", why: "the off-diagonal block is zero" },
        { do: "Check membership", result: "output lies in $U\\oplus0$", why: "the second component remains zero" },
        { do: "Check nonzero and proper", result: "$U\\oplus0$ is nonzero and not all of $U\\oplus W$", why: "both blocks are nonzero" },
        { do: "Conclude", result: "reducible", why: "a nonzero proper invariant subspace exists" }
      ], answer: "The representation is reducible." },
      { problem: "For the cyclic shift on $\\mathbb R^3$, show the line $\\operatorname{span}\\{(1,1,1)\\}$ makes the representation reducible.", steps: [
        { do: "Name the line", result: "$W=\\operatorname{span}\\{(1,1,1)\\}$", why: "constant vectors form a one-dimensional subspace" },
        { do: "Apply the shift", result: "$(a,a,a)\\mapsto(a,a,a)$", why: "cyclically shifting equal coordinates changes nothing" },
        { do: "Check nonzero", result: "$(1,1,1)\\in W$", why: "the line is not zero" },
        { do: "Check proper", result: "$\\dim W=1<3$", why: "it is not all of $\\mathbb R^3$" },
        { do: "Conclude", result: "reducible", why: "the invariant line is a subrepresentation" }
      ], answer: "The cyclic shift representation on $\\mathbb R^3$ is reducible." },
      { problem: "A feature representation splits into scalar channel $s$ and vector channel $v\\in\\mathbb R^2$ with matrices $\\operatorname{diag}(1,R_g)$. Identify a reducing subspace and its dimension.", steps: [
        { do: "Write a scalar-only vector", result: "$(s,0,0)$", why: "turn off the vector channel" },
        { do: "Apply the matrix", result: "$(s,0,0)$", why: "the scalar block is $1$ and no mixing blocks appear" },
        { do: "Name the subspace", result: "$W=\\{(s,0,0):s\\in\\mathbb R\\}$", why: "all scalar-only features" },
        { do: "Compute dimension", result: "$\\dim W=1$", why: "one scalar parameter" },
        { do: "Check properness", result: "$1<3$", why: "the full feature space has three coordinates" }
      ], answer: "The scalar channel $W$ is a $1$-dimensional reducing subspace." }
    ],
    applications: [
      { title: "Block diagonal computation", background: "Reducible representations allow matrix operations to be performed block by block.", numbers: "A $100\\times100$ matrix split into two $50\\times50$ blocks uses about $2\\cdot50^3=250000$ multiplications instead of $100^3=1000000$." },
      { title: "Equivariant feature types", background: "Neural features often decompose into scalars, vectors, and tensors that should not be mixed arbitrarily.", numbers: "A $7$-channel feature with $3$ scalars and two $2$-D vectors has blocks of sizes $3,2,2$." },
      { title: "Fourier speedups", background: "Shift representations decompose by frequency, reducing convolution to separate scalar multiplications.", numbers: "A length-$8$ circular signal has $8$ Fourier modes, each preserved by shifts." },
      { title: "Molecular symmetry", background: "Vibrations split into symmetry types, so reducibility helps identify independent modes.", numbers: "A $6$-dimensional vibration space might split into blocks $1+2+3$, reducing coupled equations." },
      { title: "Graph pooling", background: "The constant subspace of node features is invariant under permutations, supporting global mean pooling.", numbers: "For $10$ nodes, averaging projects onto the $1$-D constant subspace spanned by $(1,\\ldots,1)$." },
      { title: "Model compression", background: "If learned weights respect a reducible symmetry, redundant mixing between blocks can be removed.", numbers: "Removing off-block weights in a $4+4$ split removes $2\\cdot4\\cdot4=32$ cross-block parameters." }
    ],
    applicationsClose: "Reducibility is the mathematical permission to simplify: if symmetry does not mix pieces, we can study and compute those pieces separately.",
    takeaways: [
      "A representation is reducible when it has a nonzero proper invariant subspace.",
      "Block diagonal form is the visible sign of a decomposition.",
      "Reducibility often leads to faster computation and clearer feature organization."
    ]
  },

  "math-10-08": {
    id: "math-10-08",
    title: "Irreducible representations",
    tagline: "Irreducible representations are the atoms of symmetry: no smaller invariant subspace remains.",
    connections: {
      buildsOn: ["Reducibility", "Subrepresentations", "linear algebra"],
      leadsTo: ["Schur's lemma", "Characters", "Orthogonality relations"],
      usedWith: ["direct sums", "eigenvalues", "Fourier analysis", "change of basis"]
    },
    motivation:
      "<p>Factoring numbers into primes is powerful because primes cannot be factored further. Representation theory has a similar idea.</p>" +
      "<p>An <b>irreducible representation</b> has no smaller nonzero invariant piece. Once a representation is decomposed into irreducibles, each piece is as simple as symmetry allows. These pieces are the alphabet for characters, Fourier transforms, and equivariant feature types.</p>",
    definition:
      "<p>A representation $\\rho:G\\to GL(V)$ is <b>irreducible</b> if the only subrepresentations of $V$ are $\\{0\\}$ and $V$ itself. Over $\\mathbb C$, irreducible representations of finite abelian groups are one-dimensional; nonabelian groups can have higher-dimensional irreducibles.</p>" +
      "<p>For finite groups over $\\mathbb C$, every representation decomposes into a direct sum of irreducible representations after choosing a suitable invariant inner product. <b>Assumptions that matter:</b> irreducibility depends on the field; a real representation may be irreducible over $\\mathbb R$ but reducible after allowing complex vectors.</p>",
    worked: {
      problem: "Show that the $90^\\circ$ rotation representation of $C_4$ on $\\mathbb R^2$ is irreducible over $\\mathbb R$.",
      skills: ["irreducibility", "invariant subspaces", "rotation geometry"],
      strategy: "In $\\mathbb R^2$, a nonzero proper subspace must be a line, so show no line is preserved by a quarter-turn.",
      steps: [
        { do: "List possible proper nonzero subspaces", result: "lines through the origin", why: "$\\mathbb R^2$ has only one-dimensional proper nonzero subspaces" },
        { do: "Assume a line $W$ is invariant", result: "$R v\\in W$ for nonzero $v\\in W$", why: "invariance must hold for the rotation matrix" },
        { do: "Translate line membership", result: "$R v=\\lambda v$ for some real $\\lambda$", why: "vectors on the same line are scalar multiples" },
        { do: "Use the quarter-turn", result: "$Rv$ is perpendicular to $v$", why: "$R$ rotates by $90^\\circ$" },
        { do: "Compare parallel and perpendicular", result: "impossible for nonzero $v$", why: "a nonzero vector cannot be perpendicular to its own line" },
        { do: "Conclude", result: "no invariant line exists", why: "there is no nonzero proper subrepresentation" }
      ],
      verify: "The only preserved subspaces are $\\{0\\}$ and the whole plane.",
      answer: "The representation is irreducible over $\\mathbb R$.",
      connects: "Irreducibility means the symmetry action cannot be split into smaller real invariant pieces."
    },
    practice: [
      { problem: "Decide whether a one-dimensional nonzero representation is irreducible.", steps: [
        { do: "List subspaces of a line", result: "$\\{0\\}$ and the whole line", why: "a one-dimensional vector space has no other subspaces" },
        { do: "Check invariant candidates", result: "$\\{0\\}$ and $V$ are always invariant", why: "zero and the whole space are unavoidable" },
        { do: "Look for proper nonzero subspaces", result: "none", why: "there is no dimension between $0$ and $1$" },
        { do: "Apply the definition", result: "irreducible", why: "no forbidden subrepresentation exists" },
        { do: "State condition", result: "$V\\ne\\{0\\}$", why: "the representation is nonzero" }
      ], answer: "Every nonzero one-dimensional representation is irreducible." },
      { problem: "Is the reflection representation $\\operatorname{diag}(1,-1)$ on $\\mathbb R^2$ irreducible?", steps: [
        { do: "Choose the $x$-axis", result: "$W=\\operatorname{span}\\{(1,0)\\}$", why: "test a one-dimensional subspace" },
        { do: "Apply the reflection", result: "$(a,0)\\mapsto(a,0)$", why: "the first coordinate is fixed" },
        { do: "Check proper and nonzero", result: "$0<\\dim W=1<2$", why: "it is a nontrivial subspace" },
        { do: "Apply the definition", result: "reducible", why: "a nonzero proper invariant subspace exists" },
        { do: "Negate irreducibility", result: "not irreducible", why: "irreducible means no such subspace" }
      ], answer: "No. It is reducible, so it is not irreducible." },
      { problem: "Over $\\mathbb C$, the $90^\\circ$ rotation matrix has eigenvector $(1,-i)$. Explain why the real irreducible representation becomes reducible over $\\mathbb C$.", steps: [
        { do: "Write the eigenvector", result: "$v=(1,-i)$", why: "work in complex coordinates" },
        { do: "Apply the rotation", result: "$Rv=(i,1)$", why: "$R(x,y)=(-y,x)$" },
        { do: "Factor the result", result: "$(i,1)=i(1,-i)$", why: "$i(1,-i)=(i,1)$" },
        { do: "Identify invariant line", result: "$\\mathbb C v$", why: "the matrix sends $v$ to a scalar multiple" },
        { do: "Conclude", result: "reducible over $\\mathbb C$", why: "a complex invariant line exists" }
      ], answer: "The representation has a complex invariant line, so it is reducible over $\\mathbb C$." },
      { problem: "The cyclic shift representation on $\\mathbb R^3$ has invariant line $\\operatorname{span}\\{(1,1,1)\\}$. Can it be irreducible?", steps: [
        { do: "Name the invariant line", result: "$W=\\operatorname{span}\\{(1,1,1)\\}$", why: "constant vectors are fixed by cyclic shifts" },
        { do: "Check nonzero", result: "$W\\ne\\{0\\}$", why: "it contains $(1,1,1)$" },
        { do: "Check proper", result: "$\\dim W=1<3$", why: "the whole space is three-dimensional" },
        { do: "Apply definition", result: "representation is reducible", why: "a nonzero proper invariant subspace exists" },
        { do: "Answer irreducibility", result: "not irreducible", why: "reducible and irreducible are opposites here" }
      ], answer: "No. It is not irreducible." },
      { problem: "A model uses irreducible feature blocks of dimensions $1,1,2$. What is the total feature dimension, and how many invariant proper blocks are listed?", steps: [
        { do: "Add dimensions", result: "$1+1+2=4$", why: "direct-sum dimensions add" },
        { do: "Count listed irreducible blocks", result: "$3$", why: "there are three summands" },
        { do: "Identify proper blocks", result: "each block has dimension less than $4$", why: "all block sizes are $1$ or $2$" },
        { do: "Count proper invariant blocks listed", result: "$3$", why: "each summand is invariant in the decomposition" },
        { do: "Interpret", result: "the full representation is reducible", why: "it splits into multiple irreducibles" }
      ], answer: "Total dimension is $4$, with three listed proper irreducible blocks." }
    ],
    applications: [
      { title: "Fourier atoms", background: "For cyclic groups, irreducible representations are the frequency atoms used by the discrete Fourier transform.", numbers: "A length-$8$ signal decomposes into $8$ complex one-dimensional frequency irreps." },
      { title: "Steerable CNN channels", background: "Equivariant CNNs organize channels by irreducible representation type so rotations mix only compatible channels.", numbers: "A feature with two scalar irreps and one $2$-D vector irrep has $1+1+2=4$ channels." },
      { title: "Molecular tensor features", background: "Three-dimensional rotation irreps classify scalar, vector, and higher-order geometric quantities.", numbers: "A scalar has $1$ component, a vector has $3$, and a symmetric traceless rank-$2$ tensor has $5$." },
      { title: "Block diagonal learning", background: "Irreducibles are the smallest blocks allowed by symmetry, so they guide parameter sharing.", numbers: "A $6$-D feature split as $1+2+3$ can use three blocks instead of a dense $6\\times6$ mixing matrix." },
      { title: "Spectral graph methods", background: "Graph symmetries decompose node signals into irreducible symmetry modes.", numbers: "On a $4$-cycle, Fourier modes $0,1,2,3$ are the symmetry-adapted components." },
      { title: "Physics selection rules", background: "Interactions between states are constrained by irreducible symmetry types.", numbers: "If two states transform under incompatible irreps, a symmetry-preserving operator can have matrix entry $0$." }
    ],
    applicationsClose: "Irreducibles are the pieces that remain when every symmetry-respecting decomposition has been carried as far as it can go.",
    takeaways: [
      "An irreducible representation has no nonzero proper invariant subspaces.",
      "Irreducibility can depend on the field, such as $\\mathbb R$ versus $\\mathbb C$.",
      "Irreducibles are the building blocks for characters, Fourier analysis, and equivariant features."
    ]
  },

  "math-10-09": {
    id: "math-10-09",
    title: "Schur's lemma",
    tagline: "Maps between irreducible representations are forced to be either zero or beautifully rigid.",
    connections: {
      buildsOn: ["Irreducible representations", "linear maps", "kernels and images"],
      leadsTo: ["Characters", "Orthogonality relations", "representation decomposition"],
      usedWith: ["intertwining maps", "eigenvalues", "kernels", "images"]
    },
    motivation:
      "<p>Irreducible representations are supposed to be atoms. Schur's lemma explains why maps that respect the group action cannot partially mix atoms in arbitrary ways.</p>" +
      "<p>An <b>intertwiner</b> is a linear map that commutes with the group action. Schur's lemma says that between irreducible complex representations, such maps are severely constrained. This rigidity is one reason characters and orthogonality become so clean.</p>",
    definition:
      "<p>If $V$ and $W$ are irreducible representations of $G$ over $\\mathbb C$, and $T:V\\to W$ satisfies $T\\rho_V(g)=\\rho_W(g)T$ for every $g\\in G$, then either $T=0$ or $T$ is an isomorphism. If $V=W$, then every such $T$ is a scalar multiple of the identity: $T=\\lambda I$.</p>" +
      "<p>The reason is structural. The kernel of an intertwiner is a subrepresentation of $V$, and the image is a subrepresentation of $W$. Irreducibility allows only zero or everything. For $V=W$, one eigenvalue $\\lambda$ of $T$ exists over $\\mathbb C$, and $T-\\lambda I$ has nonzero kernel, forcing $T=\\lambda I$. <b>Assumptions that matter:</b> the scalar conclusion uses algebraic closure of $\\mathbb C$ and irreducibility.</p>",
    worked: {
      problem: "Let $V$ be a complex irreducible representation. If an intertwiner $T:V\\to V$ has eigenvalue $3$, use Schur's lemma to determine $T$.",
      skills: ["Schur's lemma", "intertwiners", "eigenvalues"],
      strategy: "Subtract the eigenvalue times identity; the new map is still an intertwiner with nonzero kernel.",
      steps: [
        { do: "Form the shifted map", result: "$S=T-3I$", why: "remove the known eigenvalue" },
        { do: "Use the eigenvalue", result: "$S$ has nonzero kernel", why: "an eigenvector for $3$ is killed by $T-3I$" },
        { do: "Check intertwining", result: "$S\\rho(g)=\\rho(g)S$", why: "both $T$ and $I$ commute with the representation" },
        { do: "Apply Schur's lemma", result: "$S=0$", why: "a nonzero-kernel endomorphism of an irreducible representation cannot be an isomorphism" },
        { do: "Solve for $T$", result: "$T=3I$", why: "add $3I$ back" }
      ],
      verify: "A scalar matrix $3I$ certainly commutes with every representation matrix.",
      answer: "$T=3I$.",
      connects: "Schur's lemma turns commuting with symmetry into a powerful scalar constraint."
    },
    practice: [
      { problem: "If $T:V\\to W$ is a nonzero intertwiner between irreducible complex representations, what can you say about $T$?", steps: [
        { do: "Recall Schur's lemma", result: "a nonzero intertwiner is an isomorphism", why: "irreducible kernel and image leave no middle option" },
        { do: "Check kernel", result: "$\\ker T\\ne V$", why: "$T$ is not the zero map" },
        { do: "Use irreducibility of $V$", result: "$\\ker T=\\{0\\}$", why: "the kernel is a subrepresentation" },
        { do: "Check image", result: "$\\operatorname{im}T\\ne\\{0\\}$", why: "$T$ is nonzero" },
        { do: "Use irreducibility of $W$", result: "$\\operatorname{im}T=W$", why: "the image is a subrepresentation" }
      ], answer: "$T$ is an isomorphism." },
      { problem: "Suppose $V$ and $W$ are nonisomorphic irreducible complex representations. What intertwiners $T:V\\to W$ exist?", steps: [
        { do: "Assume $T$ is nonzero", result: "$T\\ne0$", why: "test the only possible alternative" },
        { do: "Apply Schur's lemma", result: "$T$ is an isomorphism", why: "nonzero intertwiners between irreducibles are isomorphisms" },
        { do: "Compare with hypothesis", result: "contradiction", why: "$V$ and $W$ are nonisomorphic" },
        { do: "Reject the assumption", result: "$T=0$", why: "the nonzero case is impossible" },
        { do: "State the space", result: "$\\operatorname{Hom}_G(V,W)=\\{0\\}$", why: "only the zero intertwiner remains" }
      ], answer: "Only the zero intertwiner exists." },
      { problem: "For an irreducible complex representation, a commuting operator has trace $12$ on a $4$-dimensional space. Find the scalar.", steps: [
        { do: "Use Schur's lemma", result: "$T=\\lambda I$", why: "commuting endomorphisms are scalar" },
        { do: "Compute the trace", result: "$\\operatorname{tr}(T)=\\operatorname{tr}(\\lambda I)$", why: "substitute scalar form" },
        { do: "Use dimension", result: "$\\operatorname{tr}(\\lambda I)=4\\lambda$", why: "there are four diagonal entries" },
        { do: "Set equal to $12$", result: "$4\\lambda=12$", why: "given trace" },
        { do: "Solve", result: "$\\lambda=3$", why: "divide by $4$" }
      ], answer: "The operator is $3I$." },
      { problem: "Show why the kernel of an intertwiner $T:V\\to W$ is invariant.", steps: [
        { do: "Take $v\\in\\ker T$", result: "$T v=0$", why: "definition of kernel" },
        { do: "Apply a group element", result: "$\\rho_V(g)v$", why: "test invariance" },
        { do: "Apply $T$", result: "$T\\rho_V(g)v$", why: "check whether the result is in the kernel" },
        { do: "Use intertwining", result: "$T\\rho_V(g)v=\\rho_W(g)Tv$", why: "intertwiner relation" },
        { do: "Substitute $Tv=0$", result: "$\\rho_W(g)0=0$", why: "linear maps send zero to zero" }
      ], answer: "$\\rho_V(g)v\\in\\ker T$, so the kernel is invariant." },
      { problem: "An equivariant layer maps between two feature types known to be distinct irreducibles. If it is linear and symmetry-preserving, how many free scalar parameters can it have?", steps: [
        { do: "Model the layer", result: "$T:V\\to W$", why: "a linear equivariant layer is an intertwiner" },
        { do: "Use distinct irreducibles", result: "$V\\not\\cong W$", why: "feature types are different" },
        { do: "Apply Schur's lemma", result: "$T=0$", why: "no nonzero intertwiner exists between distinct irreducibles" },
        { do: "Count parameters", result: "$0$", why: "the zero map has no free scalar coefficient" },
        { do: "Interpret", result: "the layer cannot mix these types", why: "symmetry forbids it" }
      ], answer: "It has $0$ free parameters between those distinct irreducible types." }
    ],
    applications: [
      { title: "Equivariant layer design", background: "Schur's lemma explains why symmetry-preserving neural layers have sparse block structure between irreducible feature types.", numbers: "Between two distinct irreps, the allowed block has $0$ parameters; between matching irreps, it is one scalar times identity." },
      { title: "Physics selection rules", background: "Operators respecting symmetry cannot connect arbitrary states; Schur's lemma formalizes forbidden transitions.", numbers: "If two states lie in nonisomorphic irreps, the symmetry-preserving matrix element is $0$." },
      { title: "Character theory", background: "The rigidity of intertwiners makes character inner products count multiplicities cleanly.", numbers: "An inner product value $3$ means an irrep appears with multiplicity $3$." },
      { title: "Block diagonalization", background: "When representations are decomposed into irreps, commuting operators become scalar on each irreducible block.", numbers: "On blocks of sizes $2,3$, a commuting operator looks like $\\lambda I_2\\oplus\\mu I_3$." },
      { title: "Parameter tying", background: "Schur's lemma justifies parameter sharing in steerable networks rather than treating it as a heuristic.", numbers: "A dense $3\\times3$ block has $9$ entries, but a scalar multiple of identity has $1$ parameter." },
      { title: "Spectral multiplicities", background: "Symmetry can force repeated eigenvalues because operators commute with group actions.", numbers: "If a $2$-D irrep occurs once, a symmetric operator has the same eigenvalue repeated $2$ times on that block." }
    ],
    applicationsClose: "Schur's lemma is a quiet gatekeeper: symmetry-respecting maps between irreducible pieces are either impossible or almost completely determined.",
    takeaways: [
      "An intertwiner is a linear map that commutes with the group action.",
      "Between irreducible complex representations, a nonzero intertwiner is an isomorphism.",
      "An endomorphism of an irreducible complex representation is a scalar multiple of the identity."
    ]
  },

  "math-10-10": {
    id: "math-10-10",
    title: "Characters",
    tagline: "A character compresses a representation into traces that still remember surprising amounts of symmetry.",
    connections: {
      buildsOn: ["Linear representations", "trace", "matrices"],
      leadsTo: ["Orthogonality relations", "representation decomposition", "Fourier analysis"],
      usedWith: ["conjugacy classes", "eigenvalues", "direct sums", "inner products"]
    },
    motivation:
      "<p>A representation can contain many matrices. Looking at every entry can feel like too much information, especially after a change of basis changes the entries anyway.</p>" +
      "<p>The <b>character</b> keeps the trace of each matrix. Trace is stable under change of basis, adds across direct sums, and often identifies irreducible pieces. Characters are representation theory's compact fingerprints.</p>",
    definition:
      "<p>For a finite-dimensional representation $\\rho:G\\to GL(V)$, the <b>character</b> is the function $\\chi_\\rho:G\\to\\mathbb C$ defined by $\\chi_\\rho(g)=\\operatorname{tr}(\\rho(g))$. The value $\\chi_\\rho(e)=\\dim V$ because $\\rho(e)=I$.</p>" +
      "<p>Characters are constant on conjugacy classes: $\\chi(hgh^{-1})=\\operatorname{tr}(\\rho(h)\\rho(g)\\rho(h)^{-1})=\\operatorname{tr}(\\rho(g))$, using cyclic invariance of trace. <b>Assumptions that matter:</b> the representation must be finite-dimensional for ordinary trace, and equivalent representations have the same character.</p>",
    worked: {
      problem: "For the $90^\\circ$ rotation representation of $C_4$ on $\\mathbb R^2$, compute the character values on $e,r,r^2,r^3$.",
      skills: ["trace", "rotation matrices", "characters"],
      strategy: "Write each rotation matrix and add its diagonal entries.",
      steps: [
        { do: "Compute $\\chi(e)$", result: "$\\operatorname{tr}(I)=2$", why: "the identity matrix has diagonal entries $1,1$" },
        { do: "Write $\\rho(r)$", result: "$\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}$", why: "$r$ is a $90^\\circ$ rotation" },
        { do: "Trace $\\rho(r)$", result: "$0$", why: "the diagonal entries are $0$ and $0$" },
        { do: "Write $\\rho(r^2)$", result: "$-I$", why: "$r^2$ is a $180^\\circ$ rotation" },
        { do: "Trace $\\rho(r^2)$", result: "$-2$", why: "the diagonal entries are $-1,-1$" },
        { do: "Trace $\\rho(r^3)$", result: "$0$", why: "$270^\\circ$ rotation also has zero diagonal entries" }
      ],
      verify: "The character values match $2\\cos\\theta$ for rotations by angle $\\theta$: $2,0,-2,0$.",
      answer: "$\\chi=(2,0,-2,0)$ on $(e,r,r^2,r^3)$.",
      connects: "A character turns each representing matrix into a basis-independent trace value."
    },
    practice: [
      { problem: "Find the character of the trivial representation on a $3$-dimensional space.", steps: [
        { do: "Write each matrix", result: "$\\rho(g)=I_3$", why: "trivial representation fixes every vector" },
        { do: "Take the trace", result: "$\\operatorname{tr}(I_3)=3$", why: "three diagonal ones" },
        { do: "Apply to all $g$", result: "$\\chi(g)=3$", why: "the matrix is the same for every element" },
        { do: "Check identity value", result: "$\\chi(e)=3$", why: "character at identity equals dimension" },
        { do: "State the function", result: "constant character $3$", why: "all values match" }
      ], answer: "$\\chi(g)=3$ for every $g$." },
      { problem: "For the sign representation of $C_2$, compute $\\chi(e)$ and $\\chi(s)$.", steps: [
        { do: "Write $\\rho(e)$", result: "$[1]$", why: "identity acts by $1$" },
        { do: "Trace $\\rho(e)$", result: "$1$", why: "$1\\times1$ trace is the entry" },
        { do: "Write $\\rho(s)$", result: "$[-1]$", why: "the sign representation sends the nonidentity to $-1$" },
        { do: "Trace $\\rho(s)$", result: "$-1$", why: "$1\\times1$ trace is the entry" },
        { do: "Collect values", result: "$(1,-1)$", why: "list in order $(e,s)$" }
      ], answer: "$\\chi(e)=1$ and $\\chi(s)=-1$." },
      { problem: "If $\\rho=\\rho_1\\oplus\\rho_2$ has characters $\\chi_1=(1,1)$ and $\\chi_2=(1,-1)$ on $C_2$, find $\\chi_\\rho$.", steps: [
        { do: "Use direct-sum trace", result: "$\\chi_\\rho=\\chi_1+\\chi_2$", why: "trace of block diagonal matrices adds" },
        { do: "Add identity values", result: "$1+1=2$", why: "first group element" },
        { do: "Add nonidentity values", result: "$1+(-1)=0$", why: "second group element" },
        { do: "Collect", result: "$(2,0)$", why: "character values are pointwise sums" },
        { do: "Check dimension", result: "$\\chi(e)=2$", why: "the direct sum has dimension $2$" }
      ], answer: "$\\chi_\\rho=(2,0)$." },
      { problem: "A $2\\times2$ matrix representing $g$ has eigenvalues $i$ and $-i$. Find $\\chi(g)$.", steps: [
        { do: "Recall trace from eigenvalues", result: "$\\operatorname{tr}=i+(-i)$", why: "trace equals sum of eigenvalues with multiplicity" },
        { do: "Add", result: "$0$", why: "the imaginary parts cancel" },
        { do: "Relate to character", result: "$\\chi(g)=0$", why: "character is trace of $\\rho(g)$" },
        { do: "Check with rotation intuition", result: "$90^\\circ$ rotation has trace $0$", why: "eigenvalues $i,-i$ match a quarter-turn" },
        { do: "State value", result: "$0$", why: "the character value is scalar" }
      ], answer: "$\\chi(g)=0$." },
      { problem: "For a permutation representation on $4$ objects, a group element fixes exactly $2$ objects. Find its character.", steps: [
        { do: "Recall permutation matrices", result: "diagonal entry is $1$ when an object is fixed", why: "fixed basis vector remains in its own position" },
        { do: "Count fixed objects", result: "$2$", why: "given in the problem" },
        { do: "Take the trace", result: "$2$", why: "trace sums diagonal fixed-object indicators" },
        { do: "Relate to character", result: "$\\chi(g)=2$", why: "character is trace" },
        { do: "Check bounds", result: "$0\\le2\\le4$", why: "a permutation can fix between zero and four objects" }
      ], answer: "$\\chi(g)=2$." }
    ],
    applications: [
      { title: "Decomposition fingerprints", background: "Characters let mathematicians decompose representations without writing every invariant subspace explicitly.", numbers: "If $\\chi=2\\chi_a+\\chi_b$, then irrep $a$ appears twice and irrep $b$ once." },
      { title: "Permutation fixed counts", background: "For permutation representations, characters count fixed points, which connects group theory to combinatorics.", numbers: "A permutation of $5$ items with cycle type $(12)(345)$ fixes $0$ items, so its character is $0$." },
      { title: "Fourier analysis on groups", background: "For abelian groups, irreducible characters are the Fourier basis functions.", numbers: "On $C_4$, the frequency-$1$ character sends $r$ to $i$ and $r^2$ to $-1$." },
      { title: "Molecular spectroscopy", background: "Character tables classify how molecular vibrations transform under symmetry.", numbers: "A $3$-D vector under $180^\\circ$ rotation about $z$ has matrix $\\operatorname{diag}(-1,-1,1)$ and character $-1$." },
      { title: "Equivariant ML channels", background: "Characters summarize feature types and help count allowed equivariant maps.", numbers: "A direct sum of three scalar channels has identity character $3$ and every group element character $3$." },
      { title: "Change-of-basis safety", background: "Trace does not change under similarity, so characters describe the representation rather than a chosen coordinate system.", numbers: "If $A$ has trace $5$, then $PAP^{-1}$ also has trace $5$ for any invertible $P$." }
    ],
    applicationsClose: "Characters are compact but powerful: by recording traces, they keep the symmetry information that survives every change of coordinates.",
    takeaways: [
      "The character of $\\rho$ is $\\chi_\\rho(g)=\\operatorname{tr}(\\rho(g))$.",
      "$\\chi(e)=\\dim V$ for finite-dimensional representations.",
      "Characters are constant on conjugacy classes and add over direct sums."
    ]
  },

  "math-10-11": {
    id: "math-10-11",
    title: "Orthogonality relations",
    tagline: "Character orthogonality makes irreducible representations behave like perpendicular basis vectors.",
    connections: {
      buildsOn: ["Characters", "inner products", "complex numbers"],
      leadsTo: ["representation decomposition", "Fourier analysis", "group-equivariant networks"],
      usedWith: ["irreducible representations", "direct sums", "projection", "basis expansions"]
    },
    motivation:
      "<p>In linear algebra, orthogonal vectors make decomposition clean: dot products tell you coefficients. Character theory has a similar miracle.</p>" +
      "<p>The <b>orthogonality relations</b> say irreducible characters of a finite group are orthonormal under a natural average. That turns representation decomposition into a calculation, not a guessing game.</p>",
    definition:
      "<p>For class functions $\\chi$ and $\\psi$ on a finite group $G$, define $$\\langle \\chi,\\psi\\rangle=\\frac1{|G|}\\sum_{g\\in G}\\chi(g)\\overline{\\psi(g)}.$$ If $\\chi_i$ and $\\chi_j$ are irreducible complex characters, then $\\langle\\chi_i,\\chi_j\\rangle=1$ when $i=j$ and $0$ otherwise.</p>" +
      "<p>If a representation has character $\\chi$, then $\\langle\\chi,\\chi_i\\rangle$ is the multiplicity of irreducible $i$ inside it. <b>Assumptions that matter:</b> the group is finite, characters are complex-valued, and the conjugate is necessary for a true complex inner product.</p>",
    worked: {
      problem: "For $C_2=\\{e,s\\}$, the trivial character is $(1,1)$ and the sign character is $(1,-1)$. Compute their inner product.",
      skills: ["character inner products", "finite sums", "orthogonality"],
      strategy: "Average the pointwise product over the two group elements.",
      steps: [
        { do: "Write the inner product", result: "$\\langle\\chi_{triv},\\chi_{sign}\\rangle=\\frac12(1\\cdot1+1\\cdot(-1))$", why: "sum over $e$ and $s$" },
        { do: "Multiply terms", result: "$\\frac12(1-1)$", why: "the second character values are $1$ and $-1$" },
        { do: "Add inside parentheses", result: "$\\frac12\\cdot0$", why: "the terms cancel" },
        { do: "Compute the average", result: "$0$", why: "zero divided by two is zero" },
        { do: "Interpret", result: "orthogonal", why: "distinct irreducible characters have inner product zero" }
      ],
      verify: "Each character has norm one: $\\frac12(1^2+1^2)=1$ and $\\frac12(1^2+(-1)^2)=1$.",
      answer: "$\\langle\\chi_{triv},\\chi_{sign}\\rangle=0$.",
      connects: "Orthogonality lets character inner products detect irreducible components."
    },
    practice: [
      { problem: "Compute the norm of the trivial character $(1,1)$ of $C_2$.", steps: [
        { do: "Write the norm squared", result: "$\\langle\\chi,\\chi\\rangle=\\frac12(1\\cdot1+1\\cdot1)$", why: "average over two elements" },
        { do: "Add terms", result: "$\\frac12(2)$", why: "$1+1=2$" },
        { do: "Compute", result: "$1$", why: "divide by two" },
        { do: "Interpret", result: "unit norm", why: "irreducible characters have norm one" },
        { do: "State irreducibility", result: "consistent with irreducible", why: "trivial representation is one-dimensional" }
      ], answer: "The norm is $1$." },
      { problem: "For character $\\chi=(2,0)$ of a $2$-D representation of $C_2$, compute multiplicities of trivial $(1,1)$ and sign $(1,-1)$.", steps: [
        { do: "Inner product with trivial", result: "$\\frac12(2\\cdot1+0\\cdot1)$", why: "use pointwise products" },
        { do: "Compute first multiplicity", result: "$1$", why: "$2/2=1$" },
        { do: "Inner product with sign", result: "$\\frac12(2\\cdot1+0\\cdot(-1))$", why: "use sign values" },
        { do: "Compute second multiplicity", result: "$1$", why: "$2/2=1$" },
        { do: "Interpret", result: "$\\chi=\\chi_{triv}+\\chi_{sign}$", why: "both multiplicities are one" }
      ], answer: "The representation contains one trivial and one sign representation." },
      { problem: "For $C_3$, characters $\\chi_0=(1,1,1)$ and $\\chi_1=(1,\\omega,\\omega^2)$ with $1+\\omega+\\omega^2=0$. Compute $\\langle\\chi_0,\\chi_1\\rangle$.", steps: [
        { do: "Write the inner product", result: "$\\frac13(1+\\overline{\\omega}+\\overline{\\omega^2})$", why: "multiply by the conjugate of $\\chi_1$" },
        { do: "Use conjugates", result: "$\\overline{\\omega}=\\omega^2$ and $\\overline{\\omega^2}=\\omega$", why: "third roots lie on the unit circle" },
        { do: "Substitute", result: "$\\frac13(1+\\omega^2+\\omega)$", why: "replace conjugates" },
        { do: "Use root sum", result: "$\\frac13\\cdot0$", why: "$1+\\omega+\\omega^2=0$" },
        { do: "Compute", result: "$0$", why: "distinct irreducible characters are orthogonal" }
      ], answer: "$\\langle\\chi_0,\\chi_1\\rangle=0$." },
      { problem: "A character decomposes as $\\chi=3\\chi_a+2\\chi_b$. If irreducible characters are orthonormal, compute $\\langle\\chi,\\chi_b\\rangle$.", steps: [
        { do: "Use linearity", result: "$\\langle3\\chi_a+2\\chi_b,\\chi_b\\rangle=3\\langle\\chi_a,\\chi_b\\rangle+2\\langle\\chi_b,\\chi_b\\rangle$", why: "inner products distribute over sums" },
        { do: "Use orthogonality", result: "$\\langle\\chi_a,\\chi_b\\rangle=0$", why: "distinct irreducibles" },
        { do: "Use unit norm", result: "$\\langle\\chi_b,\\chi_b\\rangle=1$", why: "irreducible character with itself" },
        { do: "Substitute", result: "$3\\cdot0+2\\cdot1$", why: "replace inner products" },
        { do: "Compute", result: "$2$", why: "the coefficient of $\\chi_b$ is two" }
      ], answer: "$\\langle\\chi,\\chi_b\\rangle=2$." },
      { problem: "For a permutation representation of $C_2$ with character $(4,2)$, find multiplicities of trivial and sign irreps.", steps: [
        { do: "Compute trivial multiplicity", result: "$\\frac12(4\\cdot1+2\\cdot1)$", why: "inner product with $(1,1)$" },
        { do: "Simplify", result: "$3$", why: "$6/2=3$" },
        { do: "Compute sign multiplicity", result: "$\\frac12(4\\cdot1+2\\cdot(-1))$", why: "inner product with $(1,-1)$" },
        { do: "Simplify", result: "$1$", why: "$2/2=1$" },
        { do: "Check dimension", result: "$3\\cdot1+1\\cdot1=4$", why: "multiplicities match the identity character value" }
      ], answer: "It decomposes as three trivial copies plus one sign copy." }
    ],
    applications: [
      { title: "Representation decomposition", background: "Orthogonality turns decomposition into projection, much like resolving a vector along orthonormal axes.", numbers: "If $\\langle\\chi,\\chi_i\\rangle=4$, then irrep $i$ appears four times." },
      { title: "Discrete Fourier transform", background: "The DFT is character orthogonality for cyclic groups in computational clothing.", numbers: "For length $4$, $1+i-1-i=0$, showing frequencies $0$ and $1$ are orthogonal." },
      { title: "Signal filtering", background: "Orthogonal characters let filters isolate frequency components without cross-talk.", numbers: "A constant signal $[3,3,3,3]$ has average coefficient $12/4=3$ and zero nonzero-frequency coefficients." },
      { title: "Equivariant parameter counts", background: "Multiplicity counts tell equivariant networks how many copies of each feature type are present.", numbers: "If a feature character has inner product $5$ with a scalar irrep, there are $5$ scalar channels." },
      { title: "Molecular mode classification", background: "Character inner products classify vibrational modes by symmetry type.", numbers: "A character with inner products $(2,1,0)$ contains two copies of type A, one of type B, and none of type C." },
      { title: "Compression by symmetry", background: "Orthogonality separates components so symmetric data can be stored by coefficients.", numbers: "A signal with only $3$ nonzero character coefficients among $16$ stores $3$ complex numbers instead of $16$ samples." }
    ],
    applicationsClose: "Orthogonality makes symmetry measurable: inner products reveal which irreducible pieces are present and how many times.",
    takeaways: [
      "Character inner products average products over the finite group.",
      "Irreducible complex characters are orthonormal.",
      "Inner products with irreducible characters compute multiplicities."
    ]
  },

  "math-10-12": {
    id: "math-10-12",
    title: "Representations of continuous groups",
    tagline: "Continuous symmetries, like rotations by any angle, need representations that vary smoothly, not just element by element.",
    connections: {
      buildsOn: ["Linear representations", "trigonometric functions", "matrices"],
      leadsTo: ["Invariance", "Equivariance", "geometric neural networks"],
      usedWith: ["Lie groups", "matrix exponentials", "rotations", "differentiation"]
    },
    motivation:
      "<p>Finite groups describe symmetries like flipping a coin or rotating a square. But many important symmetries are continuous: rotate a camera by $17.2^\\circ$, translate a robot by $0.03$ meters, or change phase by any real angle.</p>" +
      "<p>Representations of continuous groups keep the same homomorphism idea, but add regularity. Nearby group elements should act by nearby matrices, so calculus can join algebra.</p>",
    definition:
      "<p>A continuous group, often a <b>Lie group</b>, is a group whose elements vary continuously. A representation is a homomorphism $\\rho:G\\to GL(V)$ that is continuous, and often smooth. For the circle group $SO(2)$, a standard representation is $$\\rho(\\theta)=\\begin{pmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{pmatrix}.$$</p>" +
      "<p>The homomorphism law follows from angle addition: $\\rho(\\theta+\\phi)=\\rho(\\theta)\\rho(\\phi)$ because sine and cosine addition formulas are exactly the entries produced by multiplying the two rotation matrices. <b>Assumptions that matter:</b> the parameterization must respect the group law, and continuity or smoothness is part of the representation data.</p>",
    worked: {
      problem: "For the $SO(2)$ rotation representation, compute $\\rho(\\pi/2)(1,2)$ and verify length is preserved.",
      skills: ["rotation matrices", "continuous groups", "norms"],
      strategy: "Use the special values $\\cos(\\pi/2)=0$ and $\\sin(\\pi/2)=1$, then compare squared lengths.",
      steps: [
        { do: "Write the matrix", result: "$\\rho(\\pi/2)=\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}$", why: "use cosine $0$ and sine $1$" },
        { do: "Multiply by the vector", result: "$\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}\\begin{pmatrix}1\\\\2\\end{pmatrix}$", why: "apply the representation" },
        { do: "Compute the first coordinate", result: "$-2$", why: "$0\\cdot1-1\\cdot2=-2$" },
        { do: "Compute the second coordinate", result: "$1$", why: "$1\\cdot1+0\\cdot2=1$" },
        { do: "Compute original squared length", result: "$1^2+2^2=5$", why: "Euclidean norm squared" },
        { do: "Compute new squared length", result: "$(-2)^2+1^2=5$", why: "rotation preserves length" }
      ],
      verify: "The vector rotated from $(1,2)$ to $(-2,1)$, exactly a quarter-turn counterclockwise.",
      answer: "$\\rho(\\pi/2)(1,2)=(-2,1)$, and the length remains $\\sqrt5$.",
      connects: "Continuous representations let every angle act by a compatible matrix."
    },
    practice: [
      { problem: "Compute $\\rho(\\pi)(3,-4)$ for the $SO(2)$ representation.", steps: [
        { do: "Use trig values", result: "$\\cos\\pi=-1$ and $\\sin\\pi=0$", why: "$\\pi$ radians is a half-turn" },
        { do: "Write the matrix", result: "$\\rho(\\pi)=\\begin{pmatrix}-1&0\\\\0&-1\\end{pmatrix}$", why: "substitute into the rotation matrix" },
        { do: "Multiply", result: "$(-3,4)$", why: "both coordinates are negated" },
        { do: "Check original length squared", result: "$3^2+(-4)^2=25$", why: "compute before rotation" },
        { do: "Check new length squared", result: "$(-3)^2+4^2=25$", why: "same length after rotation" }
      ], answer: "$\\rho(\\pi)(3,-4)=(-3,4)$." },
      { problem: "Verify $\\rho(\\pi/2)\\rho(\\pi/2)=\\rho(\\pi)$.", steps: [
        { do: "Write $R=\\rho(\\pi/2)$", result: "$R=\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}$", why: "quarter-turn matrix" },
        { do: "Square $R$", result: "$R^2=\\begin{pmatrix}-1&0\\\\0&-1\\end{pmatrix}$", why: "matrix multiplication" },
        { do: "Write $\\rho(\\pi)$", result: "$\\begin{pmatrix}-1&0\\\\0&-1\\end{pmatrix}$", why: "half-turn matrix" },
        { do: "Compare matrices", result: "$R^2=\\rho(\\pi)$", why: "two quarter-turns equal one half-turn" },
        { do: "Connect to angles", result: "$\\pi/2+\\pi/2=\\pi$", why: "homomorphism preserves the group law" }
      ], answer: "$\\rho(\\pi/2)\\rho(\\pi/2)=\\rho(\\pi)$." },
      { problem: "For the one-dimensional circle representation $\\rho_k(\\theta)=e^{ik\\theta}$ with $k=2$, compute $\\rho_2(\\pi/3)$.", steps: [
        { do: "Substitute $k=2$", result: "$\\rho_2(\\theta)=e^{2i\\theta}$", why: "frequency two representation" },
        { do: "Substitute $\\theta=\\pi/3$", result: "$e^{2\\pi i/3}$", why: "multiply the angle by two" },
        { do: "Use Euler form", result: "$\\cos(2\\pi/3)+i\\sin(2\\pi/3)$", why: "$e^{i\\alpha}=\\cos\\alpha+i\\sin\\alpha$" },
        { do: "Evaluate trig values", result: "$-\\frac12+i\\frac{\\sqrt3}{2}$", why: "standard unit-circle values" },
        { do: "Check magnitude", result: "$1$", why: "complex phases lie on the unit circle" }
      ], answer: "$\\rho_2(\\pi/3)=-\\frac12+i\\frac{\\sqrt3}{2}$." },
      { problem: "Approximate a small rotation by $\\theta=0.01$ radians applied to $(1,0)$ using $\\cos\\theta\\approx1$ and $\\sin\\theta\\approx0.01$.", steps: [
        { do: "Write the approximate matrix", result: "$\\begin{pmatrix}1&-0.01\\\\0.01&1\\end{pmatrix}$", why: "small-angle approximations" },
        { do: "Multiply by $(1,0)$", result: "$(1,0.01)$", why: "use the first column" },
        { do: "Compute length squared", result: "$1^2+0.01^2=1.0001$", why: "first-order approximation slightly changes length" },
        { do: "Compare to exact", result: "exact length is $1$", why: "true rotation matrices preserve norm" },
        { do: "Interpret error", result: "$0.0001$ in squared length", why: "the approximation ignored second-order cosine change" }
      ], answer: "The first-order rotated vector is approximately $(1,0.01)$." },
      { problem: "A continuous translation group acts on scalar functions by $(T_a f)(x)=f(x-a)$. Compute $(T_2 f)(5)$ for $f(x)=x^2$.", steps: [
        { do: "Write the action", result: "$(T_2f)(x)=f(x-2)$", why: "translation by $2$ shifts the input" },
        { do: "Substitute $x=5$", result: "$(T_2f)(5)=f(3)$", why: "$5-2=3$" },
        { do: "Apply $f(x)=x^2$", result: "$f(3)=9$", why: "square the input" },
        { do: "Compare original value", result: "$f(5)=25$", why: "translation changes where the function is sampled" },
        { do: "Interpret", result: "the graph shifted right by $2$", why: "new value at $5$ comes from old value at $3$" }
      ], answer: "$(T_2f)(5)=9$." }
    ],
    applications: [
      { title: "Rigid-body robotics", background: "Robots move through continuous rotation and translation groups, so representations convert poses into matrices.", numbers: "A $90^\\circ$ rotation followed by translation $(2,3)$ sends point $(1,0)$ to $(2,4)$." },
      { title: "Steerable filters", background: "Steerable CNNs represent continuous rotations so filters can rotate by arbitrary angles, not just grid symmetries.", numbers: "A vector channel $(1,0)$ rotated by $30^\\circ$ becomes $(0.866,0.5)$." },
      { title: "Physics symmetries", background: "Continuous symmetries such as rotations and translations constrain physical laws and conservation quantities.", numbers: "A rotation matrix preserves kinetic energy proportional to $\\|v\\|^2$: velocity $(3,4)$ keeps norm $5$." },
      { title: "Phase signals", background: "Audio, communications, and Fourier features use circle-group representations as complex phases.", numbers: "Phase shift $\\pi/2$ multiplies a complex coefficient by $i$." },
      { title: "Pose estimation", background: "Vision systems predict orientations in continuous groups rather than choosing only discrete classes.", numbers: "An angle error from $35^\\circ$ to $38^\\circ$ is $3^\\circ$, about $0.052$ radians." },
      { title: "Neural ODE symmetries", background: "Smooth group actions can be differentiated, linking representations to generators and flows.", numbers: "A small time step $0.1$ with generator speed $2$ produces first-order phase change $0.2$ radians." }
    ],
    applicationsClose: "Continuous representations keep the algebra of symmetry while allowing angles, shifts, and phases to vary smoothly.",
    takeaways: [
      "Continuous group representations are homomorphisms that vary continuously or smoothly.",
      "$SO(2)$ rotations are represented by sine-cosine matrices.",
      "Continuous symmetry connects representation theory with calculus, physics, and geometric ML."
    ]
  },

  "math-10-13": {
    id: "math-10-13",
    title: "Invariance",
    tagline: "An invariant quantity stays the same when the allowed symmetries act.",
    connections: {
      buildsOn: ["Group actions", "Orbits and stabilizers", "functions"],
      leadsTo: ["Equivariance", "Group-equivariant & geometric neural networks"],
      usedWith: ["orbits", "quotients", "norms", "symmetric functions"]
    },
    motivation:
      "<p>Some details should not matter. A cat shifted a few pixels is still a cat; a triangle rotated on the page has the same side lengths.</p>" +
      "<p><b>Invariance</b> names this kind of stability. A function is invariant when transforming the input by a group leaves the output unchanged. It is the mathematical heart of features that ignore nuisance variation while keeping the information we care about.</p>",
    definition:
      "<p>Let $G$ act on $X$. A function $f:X\\to Y$ is <b>invariant</b> under $G$ if $f(g\\cdot x)=f(x)$ for every $g\\in G$ and $x\\in X$. Equivalently, $f$ is constant on each orbit of the action.</p>" +
      "<p>The orbit statement follows directly: if $y$ lies in the orbit of $x$, then $y=g\\cdot x$ for some $g$, so invariance gives $f(y)=f(g\\cdot x)=f(x)$. <b>Assumptions that matter:</b> the group action must be specified, and invariance is always relative to that group, not to every possible transformation.</p>",
    worked: {
      problem: "Show that the squared norm $f(x,y)=x^2+y^2$ is invariant under $90^\\circ$ rotation $R(x,y)=(-y,x)$.",
      skills: ["invariance", "rotations", "algebraic verification"],
      strategy: "Apply the transformation first, then compute the feature and compare with the original.",
      steps: [
        { do: "Apply the rotation", result: "$R(x,y)=(-y,x)$", why: "$90^\\circ$ rotation swaps coordinates with a sign" },
        { do: "Evaluate $f$ after rotation", result: "$f(R(x,y))=(-y)^2+x^2$", why: "substitute transformed coordinates" },
        { do: "Simplify the square", result: "$y^2+x^2$", why: "squaring removes the sign" },
        { do: "Reorder terms", result: "$x^2+y^2$", why: "addition is commutative" },
        { do: "Compare with original", result: "$f(R(x,y))=f(x,y)$", why: "the value did not change" }
      ],
      verify: "For $(3,4)$, the norm squared is $25$; after rotation to $(-4,3)$, it is $16+9=25$.",
      answer: "$x^2+y^2$ is invariant under the $90^\\circ$ rotation.",
      connects: "Invariant functions are constant along symmetry orbits."
    },
    practice: [
      { problem: "Show that $f(x,y)=x+y$ is invariant under swapping coordinates.", steps: [
        { do: "Define the swap", result: "$s(x,y)=(y,x)$", why: "the group action exchanges coordinates" },
        { do: "Evaluate after swap", result: "$f(s(x,y))=f(y,x)$", why: "apply the transformation first" },
        { do: "Substitute into $f$", result: "$y+x$", why: "sum the swapped coordinates" },
        { do: "Use commutativity", result: "$x+y$", why: "addition order does not matter" },
        { do: "Compare", result: "$f(s(x,y))=f(x,y)$", why: "the value is unchanged" }
      ], answer: "$x+y$ is invariant under coordinate swap." },
      { problem: "Decide whether $f(x,y)=x-y$ is invariant under swapping coordinates.", steps: [
        { do: "Apply the swap", result: "$s(x,y)=(y,x)$", why: "exchange coordinates" },
        { do: "Evaluate after swap", result: "$f(s(x,y))=y-x$", why: "substitute into $x-y$" },
        { do: "Compare to original", result: "$y-x\\ne x-y$ in general", why: "they are negatives except when $x=y$" },
        { do: "Test a point", result: "$f(3,1)=2$ and $f(1,3)=-2$", why: "one counterexample disproves invariance" },
        { do: "Conclude", result: "not invariant", why: "the value changes under the group action" }
      ], answer: "$x-y$ is not invariant under coordinate swap." },
      { problem: "For a set of numbers $\\{2,5,9\\}$, show the mean is invariant under permutation.", steps: [
        { do: "Compute the original sum", result: "$2+5+9=16$", why: "mean starts with the sum" },
        { do: "Compute the original mean", result: "$16/3$", why: "divide by three items" },
        { do: "Permute the order", result: "$[9,2,5]$", why: "a permutation reorders entries" },
        { do: "Compute the permuted sum", result: "$9+2+5=16$", why: "addition is commutative" },
        { do: "Compute the permuted mean", result: "$16/3$", why: "same sum and same count" }
      ], answer: "The mean is invariant under permutation." },
      { problem: "A grayscale image feature sums all pixel values. Show it is invariant under a pixel permutation that only reorders pixels.", steps: [
        { do: "List sample pixels", result: "$[10,30,5,15]$", why: "use concrete values" },
        { do: "Sum original pixels", result: "$10+30+5+15=60$", why: "feature is total brightness" },
        { do: "Reorder pixels", result: "$[5,10,15,30]$", why: "a permutation changes positions" },
        { do: "Sum reordered pixels", result: "$5+10+15+30=60$", why: "same values in a new order" },
        { do: "Compare", result: "both totals are $60$", why: "sum is permutation-invariant" }
      ], answer: "Total pixel brightness is invariant under pixel reordering." },
      { problem: "For vector $v=(3,4)$, compute an invariant length feature before and after $180^\\circ$ rotation.", steps: [
        { do: "Compute original norm", result: "$\\sqrt{3^2+4^2}=5$", why: "Euclidean length" },
        { do: "Apply $180^\\circ$ rotation", result: "$(-3,-4)$", why: "negate both coordinates" },
        { do: "Compute new norm", result: "$\\sqrt{(-3)^2+(-4)^2}$", why: "same length formula" },
        { do: "Simplify", result: "$\\sqrt{9+16}=5$", why: "squares remove signs" },
        { do: "Compare", result: "$5=5$", why: "length is rotation-invariant" }
      ], answer: "The length is $5$ before and after rotation." }
    ],
    applications: [
      { title: "Classification under translation", background: "Image classifiers often aim to predict the same label when an object shifts slightly.", numbers: "If an image score is $0.91$ for a centered digit and $0.90$ after a $2$-pixel shift, the desired invariant label remains digit $7$." },
      { title: "Set pooling", background: "Deep Sets and many graph models use permutation-invariant pooling because set order is not meaningful.", numbers: "Mean of node features $[2,4,10]$ is $16/3$ in any order." },
      { title: "Distance features", background: "Geometry tasks use distances because they are invariant under rigid rotations and translations.", numbers: "Points $(0,0)$ and $(3,4)$ stay distance $5$ after shifting both by $(10,-2)$." },
      { title: "Audio loudness", background: "Some audio features ignore phase and keep energy, which is invariant under sign flips of samples.", numbers: "Samples $[2,-3]$ have energy $4+9=13$; sign-flipped $[-2,3]$ also has $13$." },
      { title: "Graph readouts", background: "Graph-level prediction should not depend on node numbering, so readouts are permutation-invariant.", numbers: "Summing four node embeddings with first coordinates $1,0,3,2$ gives $6$ regardless of node order." },
      { title: "Molecular properties", background: "A molecule's energy should not change when the molecule is rotated in space.", numbers: "If two atoms are $1.5$ angstroms apart, rotating coordinates leaves the bond length $1.5$." }
    ],
    applicationsClose: "Invariance is how we intentionally forget nuisance motion while preserving the quantity the task truly cares about.",
    takeaways: [
      "A function is invariant if $f(g\\cdot x)=f(x)$ for all group actions.",
      "Invariant functions are constant on orbits.",
      "Invariance is useful when transformed inputs should have the same output."
    ]
  },

  "math-10-14": {
    id: "math-10-14",
    title: "Equivariance",
    tagline: "An equivariant map does not ignore symmetry; it carries the transformation through to the output.",
    connections: {
      buildsOn: ["Invariance", "Group actions", "Linear representations"],
      leadsTo: ["Group-equivariant & geometric neural networks"],
      usedWith: ["commutative diagrams", "intertwiners", "convolution", "feature maps"]
    },
    motivation:
      "<p>Sometimes the output should stay the same under a transformation. But often it should move in a predictable way. If an image shifts right, a segmentation mask should shift right too.</p>" +
      "<p><b>Equivariance</b> captures this stronger behavior. The map and the symmetry commute: transform then process, or process then transform, and you arrive at the same result.</p>",
    definition:
      "<p>Let $G$ act on $X$ and $Y$. A function $F:X\\to Y$ is <b>equivariant</b> if $$F(g\\cdot x)=g\\cdot F(x)$$ for every $g\\in G$ and $x\\in X$. If the action on $Y$ is trivial, equivariance reduces to invariance.</p>" +
      "<p>For linear representations, an equivariant linear map $T:V\\to W$ satisfies $T\\rho_V(g)=\\rho_W(g)T$ for every $g$, so equivariant linear maps are exactly intertwiners. <b>Assumptions that matter:</b> the input and output actions must both be specified, and the same group element $g$ is used on both sides.</p>",
    worked: {
      problem: "Let shifts act on length-$4$ vectors cyclically. Define $F(x_0,x_1,x_2,x_3)=(x_0+x_1,x_1+x_2,x_2+x_3,x_3+x_0)$. Show $F$ is equivariant to a one-step cyclic shift.",
      skills: ["equivariance", "cyclic shifts", "feature maps"],
      strategy: "Compute shift then $F$, and $F$ then shift, using a generic vector.",
      steps: [
        { do: "Define the shift", result: "$S(x_0,x_1,x_2,x_3)=(x_3,x_0,x_1,x_2)$", why: "one cyclic shift moves the last entry to the front" },
        { do: "Apply $F$ after shifting", result: "$F(Sx)=(x_3+x_0,x_0+x_1,x_1+x_2,x_2+x_3)$", why: "sum neighboring entries of the shifted vector" },
        { do: "Apply $F$ before shifting", result: "$F(x)=(x_0+x_1,x_1+x_2,x_2+x_3,x_3+x_0)$", why: "definition of $F$" },
        { do: "Shift $F(x)$", result: "$S(F(x))=(x_3+x_0,x_0+x_1,x_1+x_2,x_2+x_3)$", why: "move the last output to the front" },
        { do: "Compare", result: "$F(Sx)=S(F(x))$", why: "the two ordered outputs match" }
      ],
      verify: "For $x=(1,2,4,8)$, both routes give $(9,3,6,12)$.",
      answer: "$F$ is equivariant to the cyclic shift.",
      connects: "Equivariance means transformations pass through the map in a controlled way."
    },
    practice: [
      { problem: "Show that $F(x,y)=(2x,2y)$ is equivariant under rotations of the plane.", steps: [
        { do: "Write the map", result: "$F(v)=2v$", why: "double both coordinates" },
        { do: "Transform first", result: "$F(Rv)=2Rv$", why: "apply $F$ to the rotated vector" },
        { do: "Process first", result: "$R(F(v))=R(2v)$", why: "rotate the doubled vector" },
        { do: "Use linearity of $R$", result: "$R(2v)=2Rv$", why: "rotations are linear maps" },
        { do: "Compare", result: "$F(Rv)=R(F(v))$", why: "both routes agree" }
      ], answer: "$F(v)=2v$ is rotation-equivariant." },
      { problem: "Decide whether $F(x,y)=x^2+y^2$ is equivariant or invariant under rotations when the output has trivial action.", steps: [
        { do: "Identify output action", result: "trivial", why: "numbers do not move under the group" },
        { do: "Use rotation preservation", result: "$F(Rv)=\\|Rv\\|^2$", why: "apply the feature after rotation" },
        { do: "Simplify", result: "$\\|Rv\\|^2=\\|v\\|^2$", why: "rotations preserve length" },
        { do: "Compare to output action", result: "$g\\cdot F(v)=F(v)$", why: "trivial action leaves scalar unchanged" },
        { do: "Classify", result: "invariant, hence equivariant to trivial output", why: "equivariance reduces to invariance" }
      ], answer: "It is invariant; equivalently, it is equivariant when the output action is trivial." },
      { problem: "A map $F(x,y)=(x,0)$ projects onto the $x$-axis. Is it equivariant under $90^\\circ$ rotations?", steps: [
        { do: "Choose a test vector", result: "$v=(1,0)$", why: "one counterexample can disprove equivariance" },
        { do: "Rotate then project", result: "$F(Rv)=F(0,1)=(0,0)$", why: "$R(1,0)=(0,1)$" },
        { do: "Project then rotate", result: "$R(F(v))=R(1,0)=(0,1)$", why: "$F(1,0)=(1,0)$" },
        { do: "Compare", result: "$(0,0)\\ne(0,1)$", why: "the two routes differ" },
        { do: "Conclude", result: "not equivariant", why: "equivariance must hold for all vectors" }
      ], answer: "$F$ is not equivariant under $90^\\circ$ rotations." },
      { problem: "For a one-dimensional signal, let convolution be $F(x)_i=x_i+x_{i-1}$ with cyclic indices. Show it is shift-equivariant.", steps: [
        { do: "Shift input by $s$", result: "$(Sx)_i=x_{i-1}$", why: "one-step shift convention" },
        { do: "Convolve shifted input", result: "$F(Sx)_i=(Sx)_i+(Sx)_{i-1}$", why: "apply the filter" },
        { do: "Substitute shifted entries", result: "$x_{i-1}+x_{i-2}$", why: "use the shift definition" },
        { do: "Convolve first", result: "$F(x)_{i-1}=x_{i-1}+x_{i-2}$", why: "look at the shifted output index" },
        { do: "Compare", result: "$F(Sx)_i=(SF(x))_i$", why: "all coordinates match" }
      ], answer: "The convolution is shift-equivariant." },
      { problem: "An image keypoint detector outputs coordinate $(10,4)$. If the input image is shifted by $(3,-2)$ and the detector is equivariant, what output should it produce?", steps: [
        { do: "Write the original output", result: "$(10,4)$", why: "detected keypoint before transformation" },
        { do: "Write the input shift", result: "$(3,-2)$", why: "same group element acts on the output coordinates" },
        { do: "Add the shift", result: "$(10+3,4-2)$", why: "coordinates transform by translation" },
        { do: "Compute", result: "$(13,2)$", why: "add componentwise" },
        { do: "Interpret equivariance", result: "output shifts with the input", why: "detection location should move predictably" }
      ], answer: "The equivariant output should be $(13,2)$." }
    ],
    applications: [
      { title: "Convolutional layers", background: "CNNs became central in vision because convolution is translation-equivariant before pooling or classification.", numbers: "If a bright pixel shifts from index $5$ to $7$, a convolution response peak shifts by the same $2$ indices." },
      { title: "Segmentation masks", background: "Pixelwise prediction should move with the image, unlike a class label that may stay invariant.", numbers: "A mask pixel at $(20,10)$ shifts to $(23,8)$ when the image shifts by $(3,-2)$." },
      { title: "Keypoint detection", background: "Pose and landmark systems need coordinates to transform predictably under image transformations.", numbers: "A face keypoint at $(40,60)$ in a width-$100$ image flips horizontally to $(59,60)$." },
      { title: "Vector fields", background: "Physical vector outputs, such as velocity or force, should rotate when the coordinate system rotates.", numbers: "A force $(2,0)$ rotated by $90^\\circ$ becomes $(0,2)$." },
      { title: "Graph neural networks", background: "GNN message passing is permutation-equivariant: relabeling nodes relabels outputs the same way.", numbers: "Swapping node labels $1$ and $3$ swaps their output embeddings, while values attached to other nodes stay aligned." },
      { title: "Robotic policies", background: "A geometric policy can be equivariant so rotating the scene rotates the chosen action.", numbers: "If action vector is $(1,2)$, a $180^\\circ$ scene rotation should output $(-1,-2)$." }
    ],
    applicationsClose: "Equivariance is symmetry with memory: the output changes, but it changes in exactly the way the input did.",
    takeaways: [
      "Equivariance means $F(g\\cdot x)=g\\cdot F(x)$.",
      "Invariant maps are equivariant maps with a trivial output action.",
      "Linear equivariant maps are intertwiners between representations."
    ]
  },

  "math-10-15": {
    id: "math-10-15",
    title: "Group-equivariant & geometric neural networks",
    tagline: "Geometric neural networks build symmetry into the model so transformed inputs produce transformed, not confused, outputs.",
    connections: {
      buildsOn: ["Equivariance", "Invariance", "Representations of continuous groups"],
      leadsTo: ["geometric deep learning", "steerable filters", "message passing"],
      usedWith: ["convolution", "tensor products", "irreducible representations", "graph symmetries"]
    },
    motivation:
      "<p>You have already seen the two key promises: invariant outputs stay the same, and equivariant outputs move predictably. Neural networks can either learn these promises from data, or we can build them into the architecture.</p>" +
      "<p><b>Group-equivariant and geometric neural networks</b> choose layers that respect a group action by construction. CNNs are the classic translation-equivariant example; modern geometric networks extend the same idea to rotations, permutations, graphs, molecules, and 3-D point clouds.</p>",
    definition:
      "<p>A neural layer $F$ is <b>$G$-equivariant</b> if $F(g\\cdot x)=g\\cdot F(x)$ for every transformation $g\\in G$. A network for classification often stacks equivariant layers and ends with an invariant readout, such as pooling over a group orbit or over graph nodes.</p>" +
      "<p>Convolution is translation-equivariant because shifting an input shifts every local window by the same amount, and shared weights apply the same linear rule everywhere. In representation language, feature channels transform by chosen representations, and learned linear maps must be intertwiners. <b>Assumptions that matter:</b> equivariance holds for the modeled group and boundary convention; discretization, padding, interpolation, and nonlinearities must also respect the chosen symmetry.</p>",
    worked: {
      problem: "A 1-D CNN layer uses cyclic convolution with kernel $w=[2,-1,0]$ on input $x=[1,3,0,2]$, where $(F x)_i=2x_i-x_{i-1}$. Compute $F(x)$, shift $x$ right by one, and verify translation equivariance.",
      skills: ["cyclic convolution", "translation equivariance", "real-number verification"],
      strategy: "Compute the convolution once, then compare convolving the shifted input with shifting the output.",
      steps: [
        { do: "Compute $(Fx)_0$", result: "$2\\cdot1-2=0$", why: "cyclic previous entry before index $0$ is $x_3=2$" },
        { do: "Compute $(Fx)_1$", result: "$2\\cdot3-1=5$", why: "previous entry is $x_0=1$" },
        { do: "Compute $(Fx)_2$", result: "$2\\cdot0-3=-3$", why: "previous entry is $x_1=3$" },
        { do: "Compute $(Fx)_3$", result: "$2\\cdot2-0=4$", why: "previous entry is $x_2=0$" },
        { do: "Collect $F(x)$", result: "$[0,5,-3,4]$", why: "list the four outputs in order" },
        { do: "Shift input right", result: "$Sx=[2,1,3,0]$", why: "last entry moves to the front" },
        { do: "Compute $F(Sx)$", result: "$[4,0,5,-3]$", why: "apply the same formula to the shifted input" },
        { do: "Shift the original output", result: "$S(Fx)=[4,0,5,-3]$", why: "move the last output to the front" }
      ],
      verify: "$F(Sx)$ equals $S(Fx)$ exactly, so this layer is translation-equivariant under cyclic shifts.",
      answer: "$F(x)=[0,5,-3,4]$, $F(Sx)=[4,0,5,-3]$, and $S(Fx)=[4,0,5,-3]$.",
      connects: "A CNN works because shared local weights make translation commute with the layer."
    },
    practice: [
      { problem: "A max-pooling classifier takes feature map $[0,5,-3,4]$ and outputs the maximum. Show the output is invariant to cyclic shift.", steps: [
        { do: "Compute original maximum", result: "$\\max[0,5,-3,4]=5$", why: "largest entry is $5$" },
        { do: "Shift the feature map", result: "$[4,0,5,-3]$", why: "cyclic right shift" },
        { do: "Compute shifted maximum", result: "$\\max[4,0,5,-3]=5$", why: "same entries in different order" },
        { do: "Compare outputs", result: "$5=5$", why: "pooling ignored location" },
        { do: "Interpret", result: "shift-invariant readout", why: "classification often needs the same label after translation" }
      ], answer: "The max output is $5$ before and after the shift." },
      { problem: "For a 2-D vector feature $(3,4)$ in a rotation-equivariant network, compute its transformed value after a $90^\\circ$ input rotation.", steps: [
        { do: "Write the rotation rule", result: "$R(x,y)=(-y,x)$", why: "$90^\\circ$ counterclockwise rotation" },
        { do: "Apply to $(3,4)$", result: "$(-4,3)$", why: "swap coordinates and negate the old $y$" },
        { do: "Compute original norm", result: "$\\sqrt{3^2+4^2}=5$", why: "length of the vector feature" },
        { do: "Compute new norm", result: "$\\sqrt{(-4)^2+3^2}=5$", why: "rotations preserve vector length" },
        { do: "Interpret", result: "feature rotates, scalar length stays invariant", why: "equivariance and invariance can coexist" }
      ], answer: "The vector feature becomes $(-4,3)$, with length still $5$." },
      { problem: "A graph neural network sums neighbor messages. Node features are $h_1=2$, $h_2=5$, $h_3=7$, with edges from node $1$ to nodes $2$ and $3$. Compute the message at node $1$, then swap labels $2$ and $3$.", steps: [
        { do: "Sum original neighbor features", result: "$5+7=12$", why: "node $1$ receives from nodes $2$ and $3$" },
        { do: "Swap labels $2$ and $3$", result: "$h_2=7$ and $h_3=5$", why: "permutation relabels the two neighbors" },
        { do: "Sum swapped neighbor features", result: "$7+5=12$", why: "addition is permutation-invariant over the neighbor set" },
        { do: "Compare", result: "$12=12$", why: "the aggregate is unchanged by neighbor order" },
        { do: "Interpret", result: "permutation-equivariant message passing", why: "node outputs follow relabeling, not list order" }
      ], answer: "The message at node $1$ is $12$ before and after swapping the two neighbor labels." },
      { problem: "A molecule model uses pairwise distance between atoms at $p_1=(0,0,0)$ and $p_2=(1,2,2)$. Compute the distance and show translation by $(5,0,-1)$ preserves it.", steps: [
        { do: "Compute the difference", result: "$p_2-p_1=(1,2,2)$", why: "distance uses relative position" },
        { do: "Compute distance", result: "$\\sqrt{1^2+2^2+2^2}=3$", why: "Euclidean norm" },
        { do: "Translate both points", result: "$p_1'=(5,0,-1)$ and $p_2'=(6,2,1)$", why: "add $(5,0,-1)$ to each point" },
        { do: "Compute new difference", result: "$p_2'-p_1'=(1,2,2)$", why: "translation cancels in differences" },
        { do: "Compute new distance", result: "$3$", why: "same difference vector" }
      ], answer: "The distance is $3$ both before and after translation." },
      { problem: "A rotation-equivariant layer maps two scalar channels to two scalar channels with matrix $A=\\begin{pmatrix}1&2\\\\0&3\\end{pmatrix}$. If scalar features are $[4,5]$, compute the output and explain why scalar channels do not rotate.", steps: [
        { do: "Write the input vector", result: "$s=\\begin{pmatrix}4\\\\5\\end{pmatrix}$", why: "two scalar channels" },
        { do: "Multiply by $A$", result: "$As=\\begin{pmatrix}1\\cdot4+2\\cdot5\\\\0\\cdot4+3\\cdot5\\end{pmatrix}$", why: "linear channel mixing" },
        { do: "Compute entries", result: "$\\begin{pmatrix}14\\\\15\\end{pmatrix}$", why: "$4+10=14$ and $15=15$" },
        { do: "State scalar action", result: "rotation acts as identity on scalars", why: "scalar representations are trivial" },
        { do: "Interpret equivariance", result: "any scalar mixing matrix commutes with identity actions", why: "there is no orientation to rotate" }
      ], answer: "The output is $[14,15]$, and scalar channels stay unchanged under rotations." }
    ],
    applications: [
      { title: "CNN translation equivariance", background: "Convolutional neural networks share one kernel across positions, so a shifted input produces a shifted feature map before boundary effects.", numbers: "With kernel rule $(Fx)_i=2x_i-x_{i-1}$ and $x=[1,3,0,2]$, shifting input gives $F(Sx)=[4,0,5,-3]=S(Fx)$." },
      { title: "Classification via invariant pooling", background: "After equivariant layers locate patterns anywhere, pooling can produce a translation-invariant class score.", numbers: "Feature maps $[0,5,-3,4]$ and shifted $[4,0,5,-3]$ both have max value $5$." },
      { title: "Group-equivariant CNNs", background: "G-CNNs extend convolution from translations to groups such as rotations and reflections by sharing filters over transformed copies.", numbers: "Using rotations $0,90,180,270$ degrees gives $4$ orientation channels per learned filter." },
      { title: "Steerable networks", background: "Steerable CNNs use representation theory so feature vectors rotate by matrices rather than by arbitrary channel permutations.", numbers: "A vector channel $(3,4)$ under $90^\\circ$ rotation becomes $(-4,3)$ while its norm remains $5$." },
      { title: "Graph neural networks", background: "Graphs have no canonical node order, so GNN layers are designed to be permutation-equivariant.", numbers: "Neighbor features $5$ and $7$ sum to $12$ no matter whether their labels are ordered $(2,3)$ or $(3,2)$." },
      { title: "Molecular geometric networks", background: "Molecule models use translation and rotation symmetries because physical properties do not depend on where the molecule is placed in space.", numbers: "Atoms separated by vector $(1,2,2)$ have distance $3$ before and after translating both atoms by $(5,0,-1)$." },
      { title: "3-D point cloud segmentation", background: "For point clouds, output labels or vectors should transform consistently when the whole object rotates.", numbers: "A normal vector $(0,1,0)$ rotated $90^\\circ$ about the $z$-axis becomes $(-1,0,0)$." },
      { title: "Sample efficiency", background: "Building symmetry into a model reduces how many transformed examples it must learn separately.", numbers: "If rotations by $0,90,180,270$ degrees are handled exactly, one labeled image can cover an orbit of $4$ orientations." }
    ],
    applicationsClose: "Geometric neural networks succeed when architecture and data symmetry agree: equivariant layers move features correctly, and invariant readouts answer the task cleanly.",
    takeaways: [
      "Group-equivariant layers satisfy $F(g\\cdot x)=g\\cdot F(x)$ by construction.",
      "CNN convolution is the canonical example of translation equivariance.",
      "Geometric networks use group actions and representations for rotations, translations, permutations, graphs, molecules, and point clouds.",
      "Equivariant processing followed by invariant pooling is a common ML pattern."
    ]
  }
};
