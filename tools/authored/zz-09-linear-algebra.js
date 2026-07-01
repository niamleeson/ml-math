module.exports = {
  "math-09-01": {
    connectionsProse: "<p>This lesson focuses on vectors and linear combinations as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. A vector records several coordinates as one object. Span, basis, projections, and least squares all reuse this same operation.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. A vector records several coordinates as one object. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>A linear combination scales vectors and adds them, which is the basic operation behind feature weights and embedding mixtures. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> Length and combination rule:</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$v_i$", desc: "coordinate $i$" },
      { sym: "$c_i$", desc: "scalar weights" },
      { sym: "$\\lVert v\\rVert$", desc: "Euclidean length." },
    ],
    derivation: [
      { do: "Write $v=(v_1,\\dots,v_n)$", result: "$v=(v_1,\\dots,v_n)$", why: "list the coordinates." },
      { do: "In two perpendicular axes, Pythagoras gives $\\lVert v\\rVert^2=v_1^2+v_2^2$", result: "$\\lVert v\\rVert^2=v_1^2+v_2^2$", why: "squared lengths add for right angles." },
      { do: "Add each new perpendicular coordinate the same way", result: "Add each new perpendicular coordinate the same way", why: "this gives $\\lVert v\\rVert=\\sqrt{\\sum_i v_i^2}$." },
      { do: "For $c_1a+c_2b$, multiply each vector coordinate by its scalar", result: "$c_1a+c_2b$", why: "scaling changes length and direction." },
      { do: "Add matching coordinates", result: "Add matching coordinates", why: "vector addition is coordinatewise." },
    ],
    applications: [
      { title: "Embedding mixture", background: "The computation is shown directly.", numbers: "$0.7(2,1)+0.3(0,3)=(1.4,1.6)$." },
      { title: "RGB blend", background: "The computation is shown directly.", numbers: "$0.25(255,0,0)+0.75(0,0,255)=(63.75,0,191.25)$." },
      { title: "Force sum", background: "The computation is shown directly.", numbers: "$(3,2)+(-1,4)=(2,6)$." },
      { title: "Linear score", background: "The computation is shown directly.", numbers: "$2(1,0,-1)-3(0,1,1)=(2,-3,-5)$." },
      { title: "Application 5", background: "Portfolio weights", numbers: "Portfolio weights $0.6,0.4$ on returns $0.10,0.02$ give $0.068$." },
      { title: "Application 6", background: "Length of", numbers: "Length of $(3,2)$ is $\\sqrt{13}\\approx3.606$." },
    ]
  },
  "math-09-02": {
    connectionsProse: "<p>This lesson focuses on systems of linear equations as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. A linear system asks for numbers that satisfy several linear constraints at once. Gaussian elimination and augmented matrices turn these constraints into a repeatable solving process.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. A linear system asks for numbers that satisfy several linear constraints at once. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>In ML, the same form appears when a model must fit multiple equations or when normal equations summarize least squares. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> Solve $2x+y=5$, $x-y=1$:</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$A$", desc: "the coefficient matrix" },
      { sym: "$x$", desc: "the unknown vector" },
      { sym: "$b$", desc: "the right-hand side" },
      { sym: "an augmented matrix $[A\\mid b]$ stores both.", desc: "an augmented matrix $[A\\mid b]$ stores both." },
    ],
    derivation: [
      { do: "Write augmented matrix $\\begin{bmatrix}2&1&5\\1&-1&1\\end{bmatrix}$", result: "$\\begin{bmatrix}2&1&5\\1&-1&1\\end{bmatrix}$", why: "coefficients and outputs sit together." },
      { do: "Swap rows to put pivot $1$ first", result: "$1$", why: "smaller pivots simplify arithmetic." },
      { do: "Replace row 2 by row 2 minus $2$ row 1: $[0,3,3]$", result: "$[0,3,3]$", why: "eliminate $x$ from the second equation." },
      { do: "Divide row 2 by $3$: $[0,1,1]$", result: "$[0,1,1]$", why: "solve for $y$." },
      { do: "Substitute into row 1: $x-y=1$ gives $x=2$", result: "$x=2$", why: "back-substitution finishes the system." },
    ],
    applications: [
      { title: "Application 1", background: "Two lines meet at", numbers: "Two lines meet at $(2,1)$." },
      { title: "Application 2", background: "Linear model", numbers: "Linear model $a+b=3$, $a+2b=4$ gives $a=2,b=1$." },
      { title: "Application 3", background: "Circuit currents satisfying", numbers: "Circuit currents satisfying $i_1+i_2=5$, $i_1-i_2=1$ give $3,2$." },
      { title: "Application 4", background: "Resource mix", numbers: "Resource mix $2x+y=5$, $x-y=1$ gives $x=2,y=1$." },
      { title: "Application 5", background: "Calibration offsets", numbers: "Calibration offsets $c_1+c_2=7$, $c_1-c_2=1$ give $4,3$." },
      { title: "Application 6", background: "Inconsistent equations", numbers: "Inconsistent equations $x+y=1$, $2x+2y=3$ have parallel augmented rows and no solution." },
    ]
  },
  "math-09-03": {
    connectionsProse: "<p>This lesson focuses on Gaussian elimination as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Gaussian elimination is a systematic way to solve a system by removing one variable at a time. The same row operations later become elementary matrices and LU factors.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Gaussian elimination is a systematic way to solve a system by removing one variable at a time. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>It turns a tangled system into triangular form, where back-substitution is direct. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> For $\\begin{bmatrix}2&1\\4&3\\end{bmatrix}x=(5,11)$:</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "A pivot", desc: "the coefficient used to eliminate entries below it" },
      { sym: "an augmented row stores one equation", desc: "an augmented row stores one equation" },
      { sym: "triangular form", desc: "zeros below pivots." },
    ],
    derivation: [
      { do: "Use the first row as pivot", result: "Use the first row as pivot", why: "it contains $2x+y=5$." },
      { do: "Replace row 2 by row 2 minus $2$ row 1", result: "$2$", why: "this cancels the $4x$ term." },
      { do: "The second row becomes $y=1$", result: "$y=1$", why: "the lower equation has one unknown." },
      { do: "Substitute $y=1$ into $2x+y=5$", result: "$2x+y=5$", why: "back-substitution uses the solved variable." },
      { do: "Solve $x=2$", result: "$x=2$", why: "the solution is $(2,1)$." },
      { do: "The row operation preserves the solution set because subtracting a multiple of one true equation from another true equation gives another true equation.", result: "The row operation preserves the solution set because subtracting a multiple of one true equation from another true equation gives another true equation.", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Application 1", background: "The worked system solves to", numbers: "The worked system solves to $(2,1)$." },
      { title: "Application 2", background: "Elimination multiplier is", numbers: "Elimination multiplier is $4/2=2$." },
      { title: "Residual check", background: "The computation is shown directly.", numbers: "$A(2,1)=(5,11)$." },
      { title: "Application 4", background: "Determinant from pivots after elimination is", numbers: "Determinant from pivots after elimination is $2\\cdot1=2$." },
      { title: "Application 5", background: "Three right-hand sides with the same", numbers: "Three right-hand sides with the same $A$ reuse the same elimination." },
      { title: "Application 6", background: "A zero pivot triggers a row swap; swapping", numbers: "A zero pivot triggers a row swap; swapping $\\begin{bmatrix}0&1\\2&3\\end{bmatrix}$ puts pivot $2$ first." },
    ]
  },
  "math-09-04": {
    connectionsProse: "<p>This lesson focuses on matrix algebra as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Matrix algebra defines how arrays add, scale, and multiply so they act consistently on vectors. These rules support composition, inverses, transformations, and model weight matrices.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Matrix algebra defines how arrays add, scale, and multiply so they act consistently on vectors. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>This is a language lesson: no theorem needs forcing, but the operations must be explained with concrete arithmetic. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> the lesson introduces operations and compatibility rules rather than a non-obvious formula. Show addition, scalar multiplication, and multiplication by examples.</p><p><b>Assumptions that matter:</b> Use the stated closure, compatibility, indexing, or shape conditions; this lesson is conceptual rather than a proof.</p>",
    symbols: [
      { sym: "$A_{ij}$", desc: "row $i$, column $j$" },
      { sym: "$A+B$ adds matching entries", desc: "$A+B$ adds matching entries" },
      { sym: "$cA$ scales every entry", desc: "$cA$ scales every entry" },
      { sym: "$AB$", desc: "defined when columns of $A$ match rows of $B$." },
    ],
    applications: [
      { title: "Application 1", background: "The computation is shown directly.", numbers: "$\\begin{bmatrix}1&2\\3&4\\end{bmatrix}+\\begin{bmatrix}2&0\\1&2\\end{bmatrix}=\\begin{bmatrix}3&2\\4&6\\end{bmatrix}$." },
      { title: "Application 2", background: "The computation is shown directly.", numbers: "$3A=\\begin{bmatrix}3&6\\9&12\\end{bmatrix}$." },
      { title: "Application 3", background: "The computation is shown directly.", numbers: "$AB=\\begin{bmatrix}4&4\\10&8\\end{bmatrix}$." },
      { title: "Application 4", background: "A", numbers: "A $64\\times128$ weight matrix maps $128$ features to $64$ outputs." },
      { title: "Application 5", background: "A", numbers: "A $3\\times3$ image kernel has $9$ learned numbers." },
      { title: "Application 6", background: "A", numbers: "A $1000\\times50$ data matrix has $50{,}000$ entries." },
    ]
  },
  "math-09-05": {
    connectionsProse: "<p>This lesson focuses on matrix multiplication as composition, as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Matrix multiplication represents doing one linear transformation after another. Layered models, Markov steps, and coordinate changes all use this composition view.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Matrix multiplication represents doing one linear transformation after another. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>The product $AB$ means apply $B$ first, then $A$. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> Matrix multiplication as composition is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$A\\circ B$", desc: "composition" },
      { sym: "$AB$", desc: "its matrix" },
      { sym: "$i,j,k$ index rows, columns, and the summed middle dimension.", desc: "$i,j,k$ index rows, columns, and the summed middle dimension." },
    ],
    derivation: [
      { do: "Let $B$ send input $x$ to $Bx$", result: "$Bx$", why: "first transformation." },
      { do: "Apply $A$ to that output: $A(Bx)$", result: "$A(Bx)$", why: "second transformation." },
      { do: "The composed map is linear, so it has a matrix.", result: "The composed map is linear, so it has a matrix.", why: "This is the next computation or definition step." },
      { do: "Its $j$th column is $A$ times the $j$th column of $B$", result: "$B$", why: "columns track where basis vectors go." },
      { do: "Therefore $(AB)_{ij}=\\sum_k A_{ik}B_{kj}$", result: "$(AB)_{ij}=\\sum_k A_{ik}B_{kj}$", why: "row $i$ of $A$ dots column $j$ of $B$." },
    ],
    applications: [
      { title: "Application 1", background: "The computation is shown directly.", numbers: "$A=\\begin{bmatrix}1&2\\3&4\\end{bmatrix}$, $B=\\begin{bmatrix}2&0\\1&2\\end{bmatrix}$ gives $AB=\\begin{bmatrix}4&4\\10&8\\end{bmatrix}$." },
      { title: "Application 2", background: "Applying", numbers: "Applying $B$ then $A$ to $(1,1)$ gives $(8,18)$." },
      { title: "Application 3", background: "A", numbers: "A $256\\times128$ layer after a $128\\times64$ layer gives a $256\\times64$ product." },
      { title: "Application 4", background: "Two Markov steps use", numbers: "Two Markov steps use $P^2$; if stay probability is $0.8$, two stays give $0.64$." },
      { title: "Application 5", background: "Rotation then scale is one matrix product.", numbers: "Rotation then scale is one matrix product." },
      { title: "Application 6", background: "Database factor product", numbers: "Database factor product $(1000\\times20)(20\\times500)$ gives $1000\\times500$ scores." },
    ]
  },
  "math-09-06": {
    connectionsProse: "<p>This lesson focuses on matrix inverses as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. An inverse matrix undoes a linear transformation. Determinants, conditioning, and pseudoinverses refine when this undoing is possible or stable.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. An inverse matrix undoes a linear transformation. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>Solving $Ax=b$ is the same as applying $A^{-1}$ when the inverse exists. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> For $A=\\begin{bmatrix}2&1\\1&1\\end{bmatrix}$:</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$A^{-1}$", desc: "the inverse" },
      { sym: "$I$", desc: "the identity" },
      { sym: "$\\det A$ detects invertibility in square matrices.", desc: "$\\det A$ detects invertibility in square matrices." },
    ],
    derivation: [
      { do: "Compute determinant $2\\cdot1-1\\cdot1=1$", result: "$2\\cdot1-1\\cdot1=1$", why: "nonzero means invertible." },
      { do: "Swap diagonal entries and negate off-diagonal entries", result: "Swap diagonal entries and negate off-diagonal entries", why: "the 2-by-2 adjugate rule." },
      { do: "Divide by determinant to get $A^{-1}=\\begin{bmatrix}1&-1\\-1&2\\end{bmatrix}$.", result: "$A^{-1}=\\begin{bmatrix}1&-1\\-1&2\\end{bmatrix}$", why: "This is the next computation or definition step." },
      { do: "Multiply $AA^{-1}$", result: "$AA^{-1}$", why: "the result is $I$, so the matrix really undoes $A$." },
      { do: "Solve $Ax=(5,3)$ by $x=A^{-1}b=(2,1)$.", result: "$x=A^{-1}b=(2,1)$", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Undo normalization $z=(x-10)/2$", background: "inverse gives", numbers: "inverse gives $x=2z+10$, so $z=3$ gives $16$." },
      { title: "Application 2", background: "The worked inverse solves", numbers: "The worked inverse solves $b=(5,3)$ as $(2,1)$." },
      { title: "Application 3", background: "Graphics inverse scale by", numbers: "Graphics inverse scale by $2$ is scale by $0.5$." },
      { title: "Application 4", background: "Whitening by covariance", numbers: "Whitening by covariance $\\operatorname{diag}(4,9)$ uses inverse square roots $0.5,0.333$." },
      { title: "Control gain inverse", background: "output", numbers: "output $6$ through gain $3$ needs input $2$." },
      { title: "Application 6", background: "A singular matrix", numbers: "A singular matrix $\\begin{bmatrix}1&2\\2&4\\end{bmatrix}$ has determinant $0$ and no inverse." },
    ]
  },
  "math-09-07": {
    connectionsProse: "<p>This lesson focuses on elementary matrices as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. An elementary matrix performs one row operation by ordinary matrix multiplication. This prepares for LU factorization, where many row operations are recorded together.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. An elementary matrix performs one row operation by ordinary matrix multiplication. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>This connects elimination to matrix algebra and explains why row operations can be stored and composed. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> Row operation $R_2\\leftarrow R_2-2R_1$:</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$E$", desc: "an elementary matrix" },
      { sym: "$R_i$", desc: "row $i$" },
      { sym: "left multiplication changes rows.", desc: "left multiplication changes rows." },
    ],
    derivation: [
      { do: "Start with identity $I$", result: "$I$", why: "multiplying by $I$ leaves rows unchanged." },
      { do: "Perform the same row operation on $I$ to get $E=\\begin{bmatrix}1&0\\-2&1\\end{bmatrix}$.", result: "$E=\\begin{bmatrix}1&0\\-2&1\\end{bmatrix}$", why: "This is the next computation or definition step." },
      { do: "Multiply $EA$", result: "$EA$", why: "row 1 stays row 1, row 2 becomes row 2 minus $2$ row" },
      { do: "4. For $A=\\begin{bmatrix}2&1\\4&3\\end{bmatrix}$, $EA=\\begin{bmatrix}2&1\\0&1\\end{bmatrix}$.", result: "$EA=\\begin{bmatrix}2&1\\0&1\\end{bmatrix}$", why: "This is the next computation or definition step." },
      { do: "The inverse elementary matrix reverses the operation: $E^{-1}=\\begin{bmatrix}1&0\\2&1\\end{bmatrix}$.", result: "$E^{-1}=\\begin{bmatrix}1&0\\2&1\\end{bmatrix}$", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Application 1", background: "Elimination matrix above creates zero below the pivot.", numbers: "Elimination matrix above creates zero below the pivot." },
      { title: "Application 2", background: "Swap matrix", numbers: "Swap matrix $\\begin{bmatrix}0&1\\1&0\\end{bmatrix}$ swaps two rows and has determinant $-1$." },
      { title: "Application 3", background: "Scaling row 1 by", numbers: "Scaling row 1 by $3$ uses $\\begin{bmatrix}3&0\\0&1\\end{bmatrix}$ and determinant $3$." },
      { title: "Application 4", background: "Applying", numbers: "Applying $E$ to $b=(5,11)$ gives $(5,1)$." },
      { title: "Application 5", background: "Undoing the elimination applies", numbers: "Undoing the elimination applies $E^{-1}$ to recover row 2." },
      { title: "Application 6", background: "Product", numbers: "Product $E_2E_1$ stores two elimination steps for reuse." },
    ]
  },
  "math-09-08": {
    connectionsProse: "<p>This lesson focuses on LU factorization as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. LU factorization records Gaussian elimination as $A=LU$. This factorization is a practical bridge from elimination to numerical solving.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. LU factorization records Gaussian elimination as $A=LU$. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>The upper matrix $U$ is what elimination produces, and the lower matrix $L$ stores the multipliers needed to recover $A$. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> For $A=\\begin{bmatrix}2&1\\4&3\\end{bmatrix}$:</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$L$", desc: "lower triangular" },
      { sym: "$U$", desc: "upper triangular" },
      { sym: "multipliers", desc: "entries below the diagonal of $L$." },
    ],
    derivation: [
      { do: "Pivot on $2$", result: "$2$", why: "first pivot." },
      { do: "Multiplier is $4/2=2$", result: "$4/2=2$", why: "amount of row 1 subtracted from row" },
      { do: "3. Eliminate to get $U=\\begin{bmatrix}2&1\\0&1\\end{bmatrix}$.", result: "$U=\\begin{bmatrix}2&1\\0&1\\end{bmatrix}$", why: "This is the next computation or definition step." },
      { do: "Store the multiplier below the diagonal in $L=\\begin{bmatrix}1&0\\2&1\\end{bmatrix}$.", result: "$L=\\begin{bmatrix}1&0\\2&1\\end{bmatrix}$", why: "This is the next computation or definition step." },
      { do: "Multiply $LU$ to check $\\begin{bmatrix}2&1\\4&3\\end{bmatrix}$", result: "$\\begin{bmatrix}2&1\\4&3\\end{bmatrix}$", why: "factorization is correct." },
      { do: "Solve $Ly=b$ then $Ux=y$", result: "$Ux=y$", why: "two triangular solves replace fresh elimination." },
    ],
    applications: [
      { title: "Application 1", background: "Worked", numbers: "Worked $A$ has $L=\\begin{bmatrix}1&0\\2&1\\end{bmatrix}$ and $U=\\begin{bmatrix}2&1\\0&1\\end{bmatrix}$." },
      { title: "Application 2", background: "The computation is shown directly.", numbers: "$b=(5,11)$ gives $y=(5,1)$, then $x=(2,1)$." },
      { title: "Determinant is product of $U$ pivots", background: "The computation is shown directly.", numbers: "$2\\cdot1=2$." },
      { title: "Application 4", background: "Ten right-hand sides reuse one LU.", numbers: "Ten right-hand sides reuse one LU." },
      { title: "Application 5", background: "Pivot", numbers: "Pivot $0$ requires row permutation $PA=LU$." },
      { title: "Triangular solve with $U$ needs back-substitution", background: "The computation is shown directly.", numbers: "$y=1$, then $x=2$." },
    ]
  },
  "math-09-09": {
    connectionsProse: "<p>This lesson focuses on vector spaces and subspaces as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. A vector space is a set where vectors can be added and scaled without leaving the set. Null spaces, column spaces, and solution sets all use this language.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. A vector space is a set where vectors can be added and scaled without leaving the set. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>A subspace is a smaller vector space inside a larger one, such as all solutions of a homogeneous linear system. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> this is a definition lesson. Teach the two closure checks with examples rather than inventing a proof.</p><p><b>Assumptions that matter:</b> Use the stated closure, compatibility, indexing, or shape conditions; this lesson is conceptual rather than a proof.</p>",
    symbols: [
      { sym: "$V$", desc: "a vector space" },
      { sym: "$W\\subseteq V$", desc: "a subspace" },
      { sym: "closure", desc: "$u+v$ and $cu$ remain in the set." },
    ],
    applications: [
      { title: "Null space of $[1\\ 1]$ is $\\{(t,-t)", background: "t\\in\\mathbb R\\}", numbers: "t\\in\\mathbb R\\}$; using $t=3$ gives $(3,-3)$." },
      { title: "Plane $z=0$ is closed", background: "The computation is shown directly.", numbers: "$(1,2,0)+(3,4,0)=(4,6,0)$." },
      { title: "Application 3", background: "The set", numbers: "The set $x+y=1$ is not a subspace because $(0,0)$ is missing." },
      { title: "Application 4", background: "Signals spanned by two basis waves form a", numbers: "Signals spanned by two basis waves form a 2-D subspace." },
      { title: "Application 5", background: "Residuals orthogonal to two columns live in a subspace of dimension", numbers: "Residuals orthogonal to two columns live in a subspace of dimension $n-2$." },
      { title: "Application 6", background: "Embedding directions satisfying", numbers: "Embedding directions satisfying $w^Tx=0$ form a hyperplane subspace." },
    ]
  },
  "math-09-10": {
    connectionsProse: "<p>This lesson focuses on span as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. The span of vectors is everything you can build from their linear combinations. Solvability, rank, projections, and PCA all depend on knowing what a span can reach.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. The span of vectors is everything you can build from their linear combinations. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>It tells which targets a set of features or directions can represent. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> Span is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$\\operatorname{span}\\{v_i\\}$", desc: "all linear combinations" },
      { sym: "$c_i$", desc: "coefficients" },
      { sym: "$V$", desc: "the matrix with $v_i$ as columns." },
    ],
    derivation: [
      { do: "Start with vectors $v_1,\\dots,v_k$", result: "$v_1,\\dots,v_k$", why: "available directions." },
      { do: "Scale them by arbitrary coefficients $c_i$", result: "$c_i$", why: "choose how much of each direction." },
      { do: "Add them: $c_1v_1+\\cdots+c_kv_k$", result: "$c_1v_1+\\cdots+c_kv_k$", why: "this creates one reachable vector." },
      { do: "Let coefficients range over all real numbers", result: "Let coefficients range over all real numbers", why: "the collection of all reachable vectors is the span." },
      { do: "To test whether $b$ is in the span, solve $Vc=b$", result: "$Vc=b$", why: "columns of $V$ are the spanning vectors." },
    ],
    applications: [
      { title: "Application 1", background: "The computation is shown directly.", numbers: "$(3,7)$ is in span of $(3,2)$ and $(1,-1)$ because $2(3,2)-3(1,-1)=(3,7)$." },
      { title: "Application 2", background: "Columns", numbers: "Columns $(1,0),(0,1)$ span $\\mathbb R^2$." },
      { title: "Application 3", background: "One vector", numbers: "One vector $(2,4)$ spans a line; $(1,3)$ is not on it." },
      { title: "Application 4", background: "Three RGB basis colors span all triples", numbers: "Three RGB basis colors span all triples; $(128,64,0)$ uses coefficients $128,64,0$." },
      { title: "Application 5", background: "PCA with two components spans a", numbers: "PCA with two components spans a 2-D reconstruction plane." },
      { title: "Application 6", background: "Robot motions", numbers: "Robot motions $(1,0)$ and $(0,2)$ reach $(3,4)$ with coefficients $3,2$." },
    ]
  },
  "math-09-11": {
    connectionsProse: "<p>This lesson focuses on linear independence as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Vectors are linearly independent when none is redundant. Basis, dimension, rank, and identifiable features all rely on this nonredundancy test.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Vectors are linearly independent when none is redundant. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>In a data matrix, independence means columns carry distinct directions rather than repeating the same feature. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> Linear independence is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$c_i$", desc: "dependence coefficients" },
      { sym: "the zero vector", desc: "the target in the test" },
      { sym: "trivial solution", desc: "all coefficients are zero." },
    ],
    derivation: [
      { do: "Set $c_1v_1+\\cdots+c_kv_k=0$", result: "$c_1v_1+\\cdots+c_kv_k=0$", why: "ask whether zero can be built nontrivially." },
      { do: "If only $c_i=0$ works, the vectors are independent", result: "$c_i=0$", why: "no vector can be made from the others." },
      { do: "If a nonzero coefficient solution exists, isolate one vector", result: "If a nonzero coefficient solution exists, isolate one vector", why: "it is a combination of the rest." },
      { do: "For $(1,1)$ and $(1,-1)$, solve $c_1(1,1)+c_2(1,-1)=0$: equations $c_1+c_2=0$, $c_1-c_2=0$ give $c_1=c_2=0$.", result: "$c_1=c_2=0$", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Application 1", background: "The computation is shown directly.", numbers: "$(1,1)$ and $(1,-1)$ are independent; determinant $-2\\ne0$." },
      { title: "Application 2", background: "The computation is shown directly.", numbers: "$(1,2)$ and $(2,4)$ are dependent because $2(1,2)-(2,4)=0$." },
      { title: "Application 3", background: "Duplicate feature columns give rank", numbers: "Duplicate feature columns give rank $1$ for $\\begin{bmatrix}1&2\\2&4\\end{bmatrix}$." },
      { title: "Application 4", background: "Three one-hot vectors in", numbers: "Three one-hot vectors in $\\mathbb R^3$ are independent." },
      { title: "Application 5", background: "Basis compression removes a vector if coefficients like", numbers: "Basis compression removes a vector if coefficients like $(2,-1,0)$ produce zero." },
      { title: "Application 6", background: "Independent columns make a unique coordinate vector.", numbers: "Independent columns make a unique coordinate vector." },
    ]
  },
  "math-09-12": {
    connectionsProse: "<p>This lesson focuses on basis and dimension as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. A basis is a nonredundant set of vectors that spans a space. Rank, nullity, PCA components, and low-rank models are all dimension counts in practice.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. A basis is a nonredundant set of vectors that spans a space. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>Dimension is the number of vectors in any basis, so it counts degrees of freedom. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> this lesson defines a structural pair. Demonstrate the two checks, spanning and independence, with small coordinate examples.</p><p><b>Assumptions that matter:</b> Use the stated closure, compatibility, indexing, or shape conditions; this lesson is conceptual rather than a proof.</p>",
    symbols: [
      { sym: "A basis", desc: "a spanning independent set" },
      { sym: "$\\dim V$", desc: "its size" },
      { sym: "coordinates", desc: "coefficients in that basis." },
    ],
    applications: [
      { title: "Application 1", background: "The computation is shown directly.", numbers: "$\\{(1,0),(0,1)\\}$ is a basis of $\\mathbb R^2$ and dimension is $2$." },
      { title: "Application 2", background: "Basis", numbers: "Basis $\\{(1,1),(1,-1)\\}$ represents $(3,1)$ as $2(1,1)+1(1,-1)$." },
      { title: "Application 3", background: "A plane through the origin in", numbers: "A plane through the origin in $\\mathbb R^3$ has dimension $2$." },
      { title: "Application 4", background: "Null space", numbers: "Null space $x+y+z=0$ has dimension $2$." },
      { title: "Application 5", background: "A rank-", numbers: "A rank-$5$ embedding subspace needs $5$ basis vectors." },
      { title: "Application 6", background: "A", numbers: "A $10$-feature model with rank $7$ has $7$ independent feature directions." },
    ]
  },
  "math-09-13": {
    connectionsProse: "<p>This lesson focuses on the four fundamental subspaces as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Every matrix organizes four spaces: what its columns can produce, which inputs it kills, what its rows measure, and which output directions are unreachable. Projection, least squares, and pseudoinverses use these spaces to explain what can and cannot be solved.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Every matrix organizes four spaces: what its columns can produce, which inputs it kills, what its rows measure, and which output directions are unreachable. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>These spaces explain solvability and least squares. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> For $A\\in\\mathbb R^{m\\times n}$:</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$\\mathcal C(A)$ column space", desc: "$\\mathcal C(A)$ column space" },
      { sym: "$\\mathcal N(A)$ null space", desc: "$\\mathcal N(A)$ null space" },
      { sym: "$\\mathcal C(A^T)$ row space", desc: "$\\mathcal C(A^T)$ row space" },
      { sym: "$\\mathcal N(A^T)$ left null space", desc: "$\\mathcal N(A^T)$ left null space" },
      { sym: "rank", desc: "column-space dimension." },
    ],
    derivation: [
      { do: "Column space is $\\{Ax:x\\in\\mathbb R^n\\}$", result: "$\\{Ax:x\\in\\mathbb R^n\\}$", why: "all reachable outputs." },
      { do: "Null space is $\\{x:Ax=0\\}$", result: "$\\{x:Ax=0\\}$", why: "inputs erased by $A$." },
      { do: "Row space is the column space of $A^T$", result: "$A^T$", why: "directions measured by rows." },
      { do: "Left null space is $\\{y:A^Ty=0\\}$", result: "$\\{y:A^Ty=0\\}$", why: "output directions orthogonal to every column." },
      { do: "Rank-nullity gives $\\dim\\operatorname{col}(A)+\\dim\\operatorname{null}(A)=n$", result: "$\\dim\\operatorname{col}(A)+\\dim\\operatorname{null}(A)=n$", why: "domain splits into measured and erased directions." },
    ],
    applications: [
      { title: "Application 1", background: "For", numbers: "For $A=[1\\ 1]$, column space is $\\mathbb R$ and null space is span of $(1,-1)$." },
      { title: "Application 2", background: "Rank is", numbers: "Rank is $1$, nullity is $1$, total $2$." },
      { title: "Application 3", background: "For", numbers: "For $A=\\begin{bmatrix}1&0\\0&0\\end{bmatrix}$, left null space is span of $(0,1)$." },
      { title: "Application 4", background: "Least-squares residual lies in", numbers: "Least-squares residual lies in $\\mathcal N(A^T)$." },
      { title: "Application 5", background: "Unidentifiable model updates live in", numbers: "Unidentifiable model updates live in $\\mathcal N(A)$." },
      { title: "Application 6", background: "A", numbers: "A $100\\times20$ design matrix of rank $18$ has nullity $2$." },
    ]
  },
  "math-09-14": {
    connectionsProse: "<p>This lesson focuses on linear transformations as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. A linear transformation preserves addition and scaling. This connects abstract maps with the concrete matrices used in data and models.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. A linear transformation preserves addition and scaling. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>That makes it predictable from what it does to basis vectors. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> Linear transformations is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$T$", desc: "a transformation" },
      { sym: "$e_i$", desc: "basis vectors" },
      { sym: "$A$", desc: "the matrix representing $T$." },
    ],
    derivation: [
      { do: "Linearity means $T(u+v)=T(u)+T(v)$ and $T(cu)=cT(u)$", result: "$T(cu)=cT(u)$", why: "sums and scales pass through." },
      { do: "Write any $x$ in the standard basis: $x=x_1e_1+\\cdots+x_ne_n$.", result: "$x=x_1e_1+\\cdots+x_ne_n$", why: "This is the next computation or definition step." },
      { do: "Apply $T$: $T(x)=x_1T(e_1)+\\cdots+x_nT(e_n)$", result: "$T(x)=x_1T(e_1)+\\cdots+x_nT(e_n)$", why: "use linearity term by term." },
      { do: "Put $T(e_i)$ as columns of a matrix $A$", result: "$A$", why: "then $T(x)=Ax$." },
    ],
    applications: [
      { title: "Application 1", background: "Rotation by", numbers: "Rotation by $90^\\circ$ sends $(1,0)$ to $(0,1)$ and $(0,1)$ to $(-1,0)$." },
      { title: "Application 2", background: "Scaling", numbers: "Scaling $(x,y)$ by $(2,3)$ sends $(4,5)$ to $(8,15)$." },
      { title: "Application 3", background: "Projection onto x-axis sends", numbers: "Projection onto x-axis sends $(3,4)$ to $(3,0)$." },
      { title: "Application 4", background: "Audio mix matrix", numbers: "Audio mix matrix $\\begin{bmatrix}0.5&0.5\\0.5&-0.5\\end{bmatrix}$ sends $(6,2)$ to $(4,2)$." },
      { title: "Application 5", background: "Finite difference", numbers: "Finite difference $T(x_1,x_2,x_3)=(x_2-x_1,x_3-x_2)$ sends $(1,4,9)$ to $(3,5)$." },
      { title: "Application 6", background: "Feature mixing", numbers: "Feature mixing $\\begin{bmatrix}1&2\\0&1\\end{bmatrix}(2,3)=(8,3)$." },
    ]
  },
  "math-09-15": {
    connectionsProse: "<p>This lesson focuses on the matrix of a linear transformation as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Once a basis is chosen, every linear transformation has a matrix. Change of basis and similarity build on this column interpretation.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Once a basis is chosen, every linear transformation has a matrix. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>The columns are the transformed basis vectors. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> Matrix of a linear transformation is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$A_j$", desc: "column $j$ of $A$" },
      { sym: "$T(e_j)$", desc: "the image of basis vector $e_j$" },
      { sym: "coordinates depend on the chosen basis.", desc: "coordinates depend on the chosen basis." },
    ],
    derivation: [
      { do: "Choose basis vectors $e_1,\\dots,e_n$", result: "$e_1,\\dots,e_n$", why: "these define coordinates." },
      { do: "Compute $T(e_j)$ for each basis vector", result: "$T(e_j)$", why: "this shows where each coordinate direction goes." },
      { do: "Place $T(e_j)$ in column $j$", result: "$j$", why: "column $j$ is the output caused by input coordinate $j=1$." },
      { do: "For $x=\\sum_j x_je_j$, linearity gives $T(x)=\\sum_j x_jT(e_j)$.", result: "$T(x)=\\sum_j x_jT(e_j)$", why: "This is the next computation or definition step." },
      { do: "Matrix-column multiplication gives the same sum, so $T(x)=Ax$.", result: "$T(x)=Ax$", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Application 1", background: "If", numbers: "If $T(e_1)=(2,1)$ and $T(e_2)=(0,3)$, then $A=\\begin{bmatrix}2&0\\1&3\\end{bmatrix}$." },
      { title: "Application 2", background: "The computation is shown directly.", numbers: "$T(4,5)=4(2,1)+5(0,3)=(8,19)$." },
      { title: "Application 3", background: "Dense layer with 3 inputs and 2 outputs has a", numbers: "Dense layer with 3 inputs and 2 outputs has a $2\\times3$ matrix." },
      { title: "Application 4", background: "Color transform from RGB to grayscale weights", numbers: "Color transform from RGB to grayscale weights $(0.3,0.6,0.1)$ maps $(100,50,0)$ to $60$." },
      { title: "Application 5", background: "Markov transition columns summing to", numbers: "Markov transition columns summing to $1$ preserve total probability." },
      { title: "Application 6", background: "Linear regression design matrix with", numbers: "Linear regression design matrix with 100 rows and 3 features maps weights to 100 predictions." },
    ]
  },
  "math-09-16": {
    connectionsProse: "<p>This lesson focuses on change of basis as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Change of basis rewrites the same vector using a different coordinate grid. Eigenvector coordinates, PCA coordinates, whitening, and Fourier features all use this translation.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Change of basis rewrites the same vector using a different coordinate grid. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>The point does not move; only its coordinates change. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> Change of basis is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$P$", desc: "the basis matrix" },
      { sym: "$[x]_B$", desc: "coordinates of $x$ in basis $B$" },
      { sym: "$P^{-1}AP$", desc: "the same transformation in the new coordinates." },
    ],
    derivation: [
      { do: "Put new basis vectors as columns of $P$", result: "$P$", why: "$P$ maps new coordinates to standard coordinates." },
      { do: "If $[x]_B$ is the coordinate vector in basis $B$, then $x=P[x]_B$", result: "$x=P[x]_B$", why: "basis vectors are combined by those coordinates." },
      { do: "Multiply by $P^{-1}$ to get $[x]_B=P^{-1}x$", result: "$[x]_B=P^{-1}x$", why: "inverse converts standard coordinates back." },
      { do: "A matrix in the new basis is $P^{-1}AP$", result: "$P^{-1}AP$", why: "convert in, apply $A$, convert out." },
    ],
    applications: [
      { title: "Application 1", background: "Basis", numbers: "Basis $b_1=(1,1)$, $b_2=(1,-1)$ represents $(3,1)$ as $(2,1)$." },
      { title: "Application 2", background: "PCA coordinates are", numbers: "PCA coordinates are $Q^Tx$; if $Q=I$, coordinates stay $(3,1)$." },
      { title: "Application 3", background: "Camera basis changes a world point into camera coordinates.", numbers: "Camera basis changes a world point into camera coordinates." },
      { title: "Application 4", background: "Diagonal basis for", numbers: "Diagonal basis for $A$ makes powers easy." },
      { title: "Application 5", background: "Whitening with standard deviations", numbers: "Whitening with standard deviations $2,3$ uses coordinates $(x_1/2,x_2/3)$." },
      { title: "Application 6", background: "Fourier basis coefficient for a normalized vector is an inner product, e.g. dot with", numbers: "Fourier basis coefficient for a normalized vector is an inner product, e.g. dot with $(1,1)/\\sqrt2$ gives $4/\\sqrt2\\approx2.828$ for $(3,1)$." },
    ]
  },
  "math-09-17": {
    connectionsProse: "<p>This lesson focuses on determinants as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. The determinant measures signed area or volume scaling. This determinant test leads directly to invertibility and eigenvalue computations.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. The determinant measures signed area or volume scaling. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>It also detects whether a square linear map collapses space. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> For $2\\times2$ matrix $A=\\begin{bmatrix}a&b\\c&d\\end{bmatrix}$:</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$\\det A$", desc: "signed volume scale" },
      { sym: "sign", desc: "orientation" },
      { sym: "zero determinant", desc: "collapse." },
    ],
    derivation: [
      { do: "Columns are edge vectors $(a,c)$ and $(b,d)$ of a parallelogram.", result: "$(b,d)$", why: "This is the next computation or definition step." },
      { do: "The signed area equals base-times-height with orientation.", result: "The signed area equals base-times-height with orientation.", why: "This is the next computation or definition step." },
      { do: "Expanding that oriented area gives $ad-bc$", result: "$ad-bc$", why: "the positive diagonal contribution minus the crossing contribution." },
      { do: "If $ad-bc=0$, the parallelogram has zero area", result: "$ad-bc=0$", why: "columns lie on one line." },
      { do: "Therefore a square matrix is invertible only when its determinant is nonzero.", result: "Therefore a square matrix is invertible only when its determinant is nonzero.", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Application 1", background: "The computation is shown directly.", numbers: "$\\det\\begin{bmatrix}2&1\\1&1\\end{bmatrix}=1$, so invertible." },
      { title: "Application 2", background: "The computation is shown directly.", numbers: "$\\det\\begin{bmatrix}1&2\\2&4\\end{bmatrix}=0$, so columns are dependent." },
      { title: "Application 3", background: "Area of a unit square under", numbers: "Area of a unit square under $\\begin{bmatrix}3&0\\0&2\\end{bmatrix}$ becomes $6$." },
      { title: "Application 4", background: "Reflection has determinant", numbers: "Reflection has determinant $-1$." },
      { title: "Application 5", background: "Change-of-variables density under scale", numbers: "Change-of-variables density under scale $2,3$ divides by $6$." },
      { title: "Application 6", background: "Triangle area from columns", numbers: "Triangle area from columns $(3,0),(0,4)$ is $\\frac12|12|=6$." },
    ]
  },
  "math-09-18": {
    connectionsProse: "<p>This lesson builds on matrix multiplication and linear transformations. A matrix usually turns a vector and changes its direction, but some special vectors keep their direction and only get stretched or flipped. Those vectors are eigenvectors, and the stretch factors are eigenvalues.</p><p>This idea leads directly into many of the strongest tools in the rest of the section. The characteristic polynomial is how we find eigenvalues, diagonalization uses eigenvectors to simplify matrix powers, the spectral theorem explains why symmetric matrices have especially clean geometry, and PCA chooses directions by solving an eigenvalue problem for a covariance matrix.</p>",
    motivation: "<p>A matrix can mix coordinates in a way that is hard to read from its entries alone. For example, $A=\\begin{bmatrix}4&1\\2&3\\end{bmatrix}$ sends most vectors to a new direction. But the vector $v=\\begin{bmatrix}1\\1\\end{bmatrix}$ behaves simply: $Av=\\begin{bmatrix}5\\5\\end{bmatrix}=5v$. Along that line, the whole matrix acts like multiplication by the number $5$.</p><p>That is the point of the eigenvalue equation. It searches for directions where the matrix becomes a scalar stretch. If $Av=\\lambda v$, then repeated application is easy: $A^k v=\\lambda^k v$. This is why eigenvalues describe growth in linear dynamical systems, variance directions in PCA, and stability of optimization updates.</p>",
    definition: "<p><b>Definition.</b> The lesson defines The eigenvalue equation with the central condition.</p><p>$$Av=\\lambda v,\\qquad v\\ne0.$$</p><p><b>Assumptions that matter:</b> The eigenvector is nonzero, and matrix dimensions must make the products meaningful.</p>",
    symbols: [
      { sym: "$A$", desc: "the matrix or linear map" },
      { sym: "$v$", desc: "an eigenvector and must be nonzero" },
      { sym: "$\\lambda$", desc: "the eigenvalue, the scalar stretch on that vector" },
      { sym: "$I$", desc: "the identity matrix" },
      { sym: "$\\det$", desc: "the determinant, used here to detect when a nonzero null-space vector exists." },
    ],
    derivation: [
      { do: "Start with $Av=\\lambda v$", result: "$Av=\\lambda v$", why: "this is the defining condition: the matrix output stays on the same line." },
      { do: "Move the right side to the left: $Av-\\lambda v=0$", result: "$Av-\\lambda v=0$", why: "eigenvectors are solutions of a homogeneous system." },
      { do: "Insert the identity matrix: $Av-\\lambda Iv=0$", result: "$Av-\\lambda Iv=0$", why: "$Iv=v$, so this only lets the scalar multiply through a matrix." },
      { do: "Factor the vector: $(A-\\lambda I)v=0$", result: "$(A-\\lambda I)v=0$", why: "the unknown vector is now acted on by one matrix." },
      { do: "A nonzero solution exists only if $A-\\lambda I$ is singular", result: "$A-\\lambda I$", why: "an invertible matrix would force $v=0$." },
      { do: "Singularity is detected by determinant zero, so $\\det(A-\\lambda I)=0$", result: "$\\det(A-\\lambda I)=0$", why: "this is the eigenvalue equation." },
      { do: "For $A=\\begin{bmatrix}4&1\\2&3\\end{bmatrix}$, compute $\\det\\begin{bmatrix}4-\\lambda&1\\2&3-\\lambda\\end{bmatrix}=(4-\\lambda)(3-\\lambda)-2=\\lambda^2-7\\lambda+10$.", result: "$\\det\\begin{bmatrix}4-\\lambda&1\\2&3-\\lambda\\end{bmatrix}=(4-\\lambda)(3-\\lambda)-2=\\lambda^2-7\\lambda+10$", why: "This is the next computation or definition step." },
      { do: "Factor $\\lambda^2-7\\lambda+10=(\\lambda-5)(\\lambda-2)$", result: "$\\lambda^2-7\\lambda+10=(\\lambda-5)(\\lambda-2)$", why: "the eigenvalues are $5$ and $2$." },
      { do: "For $\\lambda=5$, solve $(A-5I)v=0$ to get $v\\propto(1,1)$; for $\\lambda=2$, solve $(A-2I)v=0$ to get $v\\propto(1,-2)$.", result: "$v\\propto(1,-2)$", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "PCA variance direction", background: "covariance", numbers: "covariance $\\begin{bmatrix}4&1\\1&3\\end{bmatrix}$ has eigenvalues $\\frac{7\\pm\\sqrt5}{2}\\approx4.618,2.382$, so the first principal direction explains more variance." },
      { title: "Linear dynamics", background: "if", numbers: "if $x_{t+1}=Ax_t$ and $x_0=(1,1)$, then $x_3=5^3(1,1)=(125,125)$ for the worked $A$." },
      { title: "Optimization stability", background: "error update", numbers: "error update $e_{t+1}=0.8e_t$ has eigenvalue $0.8$, so after $10$ steps the multiplier is $0.8^{10}\\approx0.107$." },
      { title: "Graph diffusion", background: "a graph operator with eigenvalue", numbers: "a graph operator with eigenvalue $0.5$ halves that mode each step; after $4$ steps it is $0.5^4=0.0625$ of its start." },
      { title: "PageRank-style steady direction", background: "a stochastic matrix eigenvalue", numbers: "a stochastic matrix eigenvalue $1$ marks a stationary direction; $P=\\begin{bmatrix}0.8&0.3\\0.2&0.7\\end{bmatrix}$ has stationary vector proportional to $(3,2)$." },
      { title: "Spectral filtering", background: "a filter", numbers: "a filter $g(\\lambda)=1/(1+\\lambda)$ applied to Laplacian eigenvalue $3$ scales that component by $0.25$." },
    ]
  },
  "math-09-19": {
    connectionsProse: "<p>This lesson focuses on the characteristic polynomial as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. The characteristic polynomial packages eigenvalue finding into one scalar equation. Diagonalization, stability analysis, and recurrences all use this polynomial view.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. The characteristic polynomial packages eigenvalue finding into one scalar equation. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>Its roots are the eigenvalues. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> The characteristic polynomial is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$p(\\lambda)$", desc: "the characteristic polynomial" },
      { sym: "roots", desc: "eigenvalues" },
      { sym: "trace", desc: "diagonal sum." },
    ],
    derivation: [
      { do: "Start from eigenvalue equation $Av=\\lambda v$.", result: "$Av=\\lambda v$", why: "This is the next computation or definition step." },
      { do: "Rearrange to $(A-\\lambda I)v=0$.", result: "$(A-\\lambda I)v=0$", why: "This is the next computation or definition step." },
      { do: "Require a nonzero solution, so $A-\\lambda I$ must be singular.", result: "$A-\\lambda I$", why: "This is the next computation or definition step." },
      { do: "Set $p(\\lambda)=\\det(A-\\lambda I)$.", result: "$p(\\lambda)=\\det(A-\\lambda I)$", why: "This is the next computation or definition step." },
      { do: "For $A=\\begin{bmatrix}4&1\\2&3\\end{bmatrix}$, $p(\\lambda)=\\lambda^2-7\\lambda+10$.", result: "$p(\\lambda)=\\lambda^2-7\\lambda+10$", why: "This is the next computation or definition step." },
      { do: "Roots $5,2$ are the eigenvalues.", result: "$5,2$", why: "This is the next computation or definition step." },
      { do: "The coefficients record trace and determinant in 2-D: $\\lambda^2-\\operatorname{tr}(A)\\lambda+\\det(A)$.", result: "$\\lambda^2-\\operatorname{tr}(A)\\lambda+\\det(A)$", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Application 1", background: "Worked trace", numbers: "Worked trace $7$ and determinant $10$ give $\\lambda^2-7\\lambda+10$." },
      { title: "Application 2", background: "Stability of update with roots", numbers: "Stability of update with roots $0.9,0.5$ is stable because both magnitudes are below $1$." },
      { title: "Application 3", background: "Recurrence polynomial", numbers: "Recurrence polynomial $r^2-3r+2$ has modes $2^t$ and $1^t$." },
      { title: "Application 4", background: "Matrix with characteristic", numbers: "Matrix with characteristic $\\lambda^2+1$ has rotation eigenvalues $\\pm i$." },
      { title: "Application 5", background: "Graph Laplacian polynomial with root", numbers: "Graph Laplacian polynomial with root $0$ signals a connected component." },
      { title: "Application 6", background: "Damped rotation roots", numbers: "Damped rotation roots $0.8e^{\\pm i\\theta}$ decay by $0.8^{5}\\approx0.328$ after 5 steps." },
    ]
  },
  "math-09-20": {
    connectionsProse: "<p>This lesson focuses on diagonalization as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Diagonalization rewrites a matrix in its eigenvector coordinates. Matrix powers, differential systems, PCA, and graph filters become simpler in this basis.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Diagonalization rewrites a matrix in its eigenvector coordinates. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>In that basis, the matrix only scales each coordinate. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> Diagonalization is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$P$ eigenvector matrix", desc: "$P$ eigenvector matrix" },
      { sym: "$D$ diagonal eigenvalue matrix", desc: "$D$ diagonal eigenvalue matrix" },
      { sym: "diagonalizable", desc: "enough independent eigenvectors." },
    ],
    derivation: [
      { do: "Put independent eigenvectors in $P$", result: "$P$", why: "columns are directions where $A$ acts simply." },
      { do: "Put matching eigenvalues in diagonal $D$", result: "$D$", why: "each eigenvector's stretch." },
      { do: "Since $Av_i=\\lambda_i v_i$, matrix form is $AP=PD$.", result: "$AP=PD$", why: "This is the next computation or definition step." },
      { do: "Multiply by $P^{-1}$ to get $A=PDP^{-1}$.", result: "$A=PDP^{-1}$", why: "This is the next computation or definition step." },
      { do: "Powers become $A^k=PD^kP^{-1}$", result: "$A^k=PD^kP^{-1}$", why: "middle factors cancel." },
      { do: "For $P=\\begin{bmatrix}1&1\\1&-1\\end{bmatrix}$ and $D=\\operatorname{diag}(5,2)$, $A=\\begin{bmatrix}3.5&1.5\\1.5&3.5\\end{bmatrix}$.", result: "$A=\\begin{bmatrix}3.5&1.5\\1.5&3.5\\end{bmatrix}$", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Application 1", background: "The computation is shown directly.", numbers: "$A^3=P\\operatorname{diag}(125,8)P^{-1}$." },
      { title: "Application 2", background: "PCA diagonalizes covariance into variances.", numbers: "PCA diagonalizes covariance into variances." },
      { title: "Application 3", background: "Markov chain long-run behavior keeps eigenvalue", numbers: "Markov chain long-run behavior keeps eigenvalue $1$ and damps $|\\lambda|<1$." },
      { title: "Application 4", background: "Graph filter", numbers: "Graph filter $g(D)$ applies one scalar per eigenmode." },
      { title: "Application 5", background: "Differential system", numbers: "Differential system $x'=Ax$ has $e^{At}=Pe^{Dt}P^{-1}$." },
      { title: "Application 6", background: "Anisotropy correction scales eigenvalue", numbers: "Anisotropy correction scales eigenvalue $5$ direction by $1/\\sqrt5\\approx0.447$." },
    ]
  },
  "math-09-21": {
    connectionsProse: "<p>This lesson focuses on similarity as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Similar matrices describe the same linear transformation in different coordinates. Diagonalization is the central example, and invariants make coordinate changes safe.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Similar matrices describe the same linear transformation in different coordinates. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>Their entries change, but eigenvalues, trace, determinant, and rank stay the same. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> Similarity is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$B=P^{-1}AP$", desc: "similar to $A$" },
      { sym: "$P$", desc: "invertible" },
      { sym: "invariants", desc: "quantities unchanged by coordinate change." },
    ],
    derivation: [
      { do: "Let $x=Py$ convert new coordinates $y$ into old coordinates.", result: "$y$", why: "This is the next computation or definition step." },
      { do: "Apply $A$ in old coordinates: $Ax=APy$.", result: "$Ax=APy$", why: "This is the next computation or definition step." },
      { do: "Convert back by $P^{-1}$: $y'=P^{-1}APy$.", result: "$y'=P^{-1}APy$", why: "This is the next computation or definition step." },
      { do: "Therefore the new-coordinate matrix is $B=P^{-1}AP$.", result: "$B=P^{-1}AP$", why: "This is the next computation or definition step." },
      { do: "If $Av=\\lambda v$, then $B(P^{-1}v)=\\lambda(P^{-1}v)$", result: "$B(P^{-1}v)=\\lambda(P^{-1}v)$", why: "eigenvalues are preserved." },
    ],
    applications: [
      { title: "Application 1", background: "Diagonalization is similarity with", numbers: "Diagonalization is similarity with $B=D$." },
      { title: "Application 2", background: "Similar matrices have the same determinant; worked", numbers: "Similar matrices have the same determinant; worked $D$ has determinant $10$, so $A$ does too." },
      { title: "Same trace", background: "The computation is shown directly.", numbers: "$5+2=7$." },
      { title: "Application 4", background: "State-space coordinate changes preserve system poles.", numbers: "State-space coordinate changes preserve system poles." },
      { title: "Application 5", background: "Whitening changes coordinates but not rank.", numbers: "Whitening changes coordinates but not rank." },
      { title: "Application 6", background: "If", numbers: "If $A$ has eigenvalues $5,2$, every similar $B$ has spectral radius $5$." },
    ]
  },
  "math-09-22": {
    connectionsProse: "<p>This lesson focuses on the Jordan form as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Jordan form handles matrices that do not have enough eigenvectors to diagonalize. This explains repeated-eigenvalue behavior in powers and differential equations.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Jordan form handles matrices that do not have enough eigenvectors to diagonalize. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>It shows that a repeated eigenvalue can bring a small coupling term along with the scalar stretch. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> The Jordan form is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$J$ Jordan block", desc: "$J$ Jordan block" },
      { sym: "$N$ nilpotent part", desc: "$N$ nilpotent part" },
      { sym: "generalized eigenvector extends an eigenvector chain.", desc: "generalized eigenvector extends an eigenvector chain." },
    ],
    derivation: [
      { do: "For a defective eigenvalue $\\lambda$, find eigenvectors from $(A-\\lambda I)v=0$", result: "$(A-\\lambda I)v=0$", why: "there are too few." },
      { do: "Find a generalized eigenvector $w$ satisfying $(A-\\lambda I)w=v$", result: "$(A-\\lambda I)w=v$", why: "this creates the missing chain." },
      { do: "In basis $(v,w)$, the block becomes $J=\\begin{bmatrix}\\lambda&1\\0&\\lambda\\end{bmatrix}$.", result: "$J=\\begin{bmatrix}\\lambda&1\\0&\\lambda\\end{bmatrix}$", why: "This is the next computation or definition step." },
      { do: "Write $J=\\lambda I+N$ with $N^2=0$", result: "$N^2=0$", why: "split scalar part and nilpotent coupling." },
      { do: "Then $J^k=\\lambda^k I+k\\lambda^{k-1}N$", result: "$J^k=\\lambda^k I+k\\lambda^{k-1}N$", why: "binomial expansion stops at $N^2$." },
    ],
    applications: [
      { title: "Application 1", background: "The computation is shown directly.", numbers: "$J=\\begin{bmatrix}2&1\\0&2\\end{bmatrix}$ has one eigenvalue $2$ repeated." },
      { title: "Application 2", background: "The computation is shown directly.", numbers: "$J^3=\\begin{bmatrix}8&12\\0&8\\end{bmatrix}$." },
      { title: "Application 3", background: "The computation is shown directly.", numbers: "$e^{Jt}=e^{2t}\\begin{bmatrix}1&t\\0&1\\end{bmatrix}$." },
      { title: "Application 4", background: "Defective dynamics include a", numbers: "Defective dynamics include a $t e^{\\lambda t}$ term." },
      { title: "Application 5", background: "Near repeated eigenvalues, small perturbations can change eigenvectors sharply.", numbers: "Near repeated eigenvalues, small perturbations can change eigenvectors sharply." },
      { title: "Application 6", background: "Optimization update with Jordan block", numbers: "Optimization update with Jordan block $0.9I+N$ has polynomial factor $k0.9^{k-1}$." },
    ]
  },
  "math-09-23": {
    connectionsProse: "<p>This lesson focuses on inner products as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. An inner product generalizes the dot product. Orthogonality, projections, QR, and least squares all depend on this measurement.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. An inner product generalizes the dot product. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>It turns vectors into lengths, angles, and projections in spaces that may not look like ordinary coordinate space. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> this is an axiomatic definition. Explain positivity, symmetry, and linearity, then show how the usual dot product satisfies them.</p><p><b>Assumptions that matter:</b> Use the stated closure, compatibility, indexing, or shape conditions; this lesson is conceptual rather than a proof.</p>",
    symbols: [
      { sym: "$\\langle u,v\\rangle$", desc: "the inner product" },
      { sym: "$\\lVert v\\rVert=\\sqrt{\\langle v,v\\rangle}$", desc: "the induced norm" },
      { sym: "orthogonality", desc: "inner product zero." },
    ],
    applications: [
      { title: "Application 1", background: "Dot product", numbers: "Dot product $\\langle(1,2),(3,4)\\rangle=11$." },
      { title: "Length from inner product", background: "The computation is shown directly.", numbers: "$\\sqrt{11}$ for $(1,\\sqrt{10})$." },
      { title: "Application 3", background: "Weighted inner product with weights", numbers: "Weighted inner product with weights $(2,1)$ gives $\\langle(1,2),(3,4)\\rangle_W=2\\cdot3+2\\cdot4=14$." },
      { title: "Application 4", background: "Function inner product", numbers: "Function inner product $\\int_0^1 x\\cdot x^2dx=1/4$." },
      { title: "Application 5", background: "Cosine similarity", numbers: "Cosine similarity $11/(\\sqrt5\\sqrt{25})\\approx0.984$." },
      { title: "Application 6", background: "Orthogonal residual has inner product", numbers: "Orthogonal residual has inner product $0$ with fitted column." },
    ]
  },
  "math-09-24": {
    connectionsProse: "<p>This lesson focuses on orthogonality as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Orthogonal vectors have zero inner product. Orthonormal bases, QR, PCA, and residual checks all use this separation.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Orthogonal vectors have zero inner product. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>They separate information cleanly because movement in one direction contributes nothing to the other. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> Orthogonality is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$u\\perp v$", desc: "orthogonal" },
      { sym: "$\\theta$", desc: "angle" },
      { sym: "dot product zero", desc: "the algebraic test." },
    ],
    derivation: [
      { do: "Start from the geometric dot product $u\\cdot v=\\lVert u\\rVert\\lVert v\\rVert\\cos\\theta$.", result: "$u\\cdot v=\\lVert u\\rVert\\lVert v\\rVert\\cos\\theta$", why: "This is the next computation or definition step." },
      { do: "Orthogonal means angle $90^\\circ$", result: "$90^\\circ$", why: "directions meet at a right angle." },
      { do: "Since $\\cos90^\\circ=0$, $u\\cdot v=0$.", result: "$u\\cdot v=0$", why: "This is the next computation or definition step." },
      { do: "Conversely, if nonzero vectors have dot product zero, then $\\cos\\theta=0$, so $\\theta=90^\\circ$.", result: "$\\theta=90^\\circ$", why: "This is the next computation or definition step." },
      { do: "Pythagoras follows: $\\lVert u+v\\rVert^2=\\lVert u\\rVert^2+2u\\cdot v+\\lVert v\\rVert^2$ becomes a sum of squares.", result: "$\\lVert u+v\\rVert^2=\\lVert u\\rVert^2+2u\\cdot v+\\lVert v\\rVert^2$", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Application 1", background: "The computation is shown directly.", numbers: "$(1,1)\\cdot(1,-1)=0$." },
      { title: "Application 2", background: "Pythagorean length of", numbers: "Pythagorean length of $(1,1)+(1,-1)=(2,0)$ is $2$." },
      { title: "Application 3", background: "Orthogonal feature columns have cross-product", numbers: "Orthogonal feature columns have cross-product $X_i^TX_j=0$." },
      { title: "Application 4", background: "PCA directions are orthogonal; two components have dot", numbers: "PCA directions are orthogonal; two components have dot $0$." },
      { title: "Application 5", background: "QR columns satisfy", numbers: "QR columns satisfy $q_1^Tq_2=0$." },
      { title: "Application 6", background: "Residual", numbers: "Residual $r=(1,-1)$ is orthogonal to column $(1,1)$ since dot is $0$." },
    ]
  },
  "math-09-25": {
    connectionsProse: "<p>This lesson focuses on orthogonal projections as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Projection finds the closest point on a line or subspace. Least squares is the same closest-point idea in a column space.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Projection finds the closest point on a line or subspace. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>It keeps the component in the chosen direction and drops the orthogonal residual. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> Projection onto nonzero $u$:</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$\\hat v$", desc: "projected vector" },
      { sym: "$r=v-\\hat v$", desc: "residual" },
      { sym: "$u$", desc: "the target direction." },
    ],
    derivation: [
      { do: "Seek $\\hat v=cu$ on the line", result: "$\\hat v=cu$", why: "any point on the line is a scalar multiple." },
      { do: "The residual $v-cu$ should be orthogonal to $u$ at the closest point.", result: "$u$", why: "This is the next computation or definition step." },
      { do: "Set $u^T(v-cu)=0$", result: "$u^T(v-cu)=0$", why: "perpendicular residual condition." },
      { do: "Solve $u^Tv-c u^Tu=0$ for $c=(u^Tv)/(u^Tu)$.", result: "$c=(u^Tv)/(u^Tu)$", why: "This is the next computation or definition step." },
      { do: "Thus $\\operatorname{proj}_u v=\\frac{u^Tv}{u^Tu}u$.", result: "$\\operatorname{proj}_u v=\\frac{u^Tv}{u^Tu}u$", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Application 1", background: "Project", numbers: "Project $(3,4)$ onto $(1,0)$ gives $(3,0)$." },
      { title: "Application 2", background: "Project", numbers: "Project $(3,4)$ onto $(1,1)$ gives $3.5(1,1)=(3.5,3.5)$." },
      { title: "Application 3", background: "Residual from second projection is", numbers: "Residual from second projection is $(-0.5,0.5)$ with dot $0$." },
      { title: "Application 4", background: "Least squares projects", numbers: "Least squares projects $y$ onto column space." },
      { title: "Application 5", background: "Recommendation latent factor keeps component along user vector.", numbers: "Recommendation latent factor keeps component along user vector." },
      { title: "Application 6", background: "Cosine projection length onto unit", numbers: "Cosine projection length onto unit $u=(0.6,0.8)$ is $3\\cdot0.6+4\\cdot0.8=5$." },
    ]
  },
  "math-09-26": {
    connectionsProse: "<p>This lesson focuses on Gram–Schmidt as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Gram–Schmidt turns independent vectors into orthonormal vectors spanning the same subspace. QR factorization stores this orthonormalization process in matrix form.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Gram–Schmidt turns independent vectors into orthonormal vectors spanning the same subspace. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>It does this by subtracting projections that point in directions already chosen. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> Gram–Schmidt is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$v_i$", desc: "original vectors" },
      { sym: "$q_i$", desc: "orthonormal vectors" },
      { sym: "$u_i$", desc: "residual directions before normalization." },
    ],
    derivation: [
      { do: "Set $q_1=v_1/\\lVert v_1\\rVert$", result: "$q_1=v_1/\\lVert v_1\\rVert$", why: "normalize the first direction." },
      { do: "Remove from $v_2$ its component along $q_1$: $u_2=v_2-(q_1^Tv_2)q_1$", result: "$u_2=v_2-(q_1^Tv_2)q_1$", why: "subtract the projection." },
      { do: "Check $q_1^Tu_2=0$", result: "$q_1^Tu_2=0$", why: "the remaining part is orthogonal." },
      { do: "Normalize $q_2=u_2/\\lVert u_2\\rVert$.", result: "$q_2=u_2/\\lVert u_2\\rVert$", why: "This is the next computation or definition step." },
      { do: "Repeat for later vectors by subtracting all previous projections.", result: "Repeat for later vectors by subtracting all previous projections.", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Application 1", background: "From", numbers: "From $v_1=(1,1)$, $q_1=(1,1)/\\sqrt2$." },
      { title: "Application 2", background: "With", numbers: "With $v_2=(1,-1)$, projection is $0$, so $q_2=(1,-1)/\\sqrt2$." },
      { title: "Application 3", background: "For", numbers: "For $v_2=(1,0)$ after $v_1=(1,1)$, residual is $(0.5,-0.5)$." },
      { title: "Application 4", background: "Residual norm is", numbers: "Residual norm is $\\sqrt{0.5}\\approx0.707$." },
      { title: "Application 5", background: "Orthonormal design columns make", numbers: "Orthonormal design columns make $X^TX=I$." },
      { title: "Application 6", background: "QR factorization stores Gram–Schmidt coefficients in", numbers: "QR factorization stores Gram–Schmidt coefficients in $R$." },
    ]
  },
  "math-09-27": {
    connectionsProse: "<p>This lesson focuses on QR factorization as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. QR factorization writes a matrix as orthonormal directions times an upper-triangular coefficient matrix. Least squares solvers and eigenvalue algorithms both use this factorization.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. QR factorization writes a matrix as orthonormal directions times an upper-triangular coefficient matrix. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>It is a stable way to solve least squares without forming $A^TA$. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> QR factorization is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$Q$ has orthonormal columns", desc: "$Q$ has orthonormal columns" },
      { sym: "$R$", desc: "upper triangular" },
      { sym: "$r_{ij}=q_i^Ta_j$.", desc: "$r_{ij}=q_i^Ta_j$." },
    ],
    derivation: [
      { do: "Apply Gram–Schmidt to columns of $A$", result: "$A$", why: "produce orthonormal columns $q_i$." },
      { do: "Each original column $a_j$ can be expressed as $a_j=\\sum_{i\\le j} r_{ij}q_i$", result: "$a_j=\\sum_{i\\le j} r_{ij}q_i$", why: "later columns use current and previous directions." },
      { do: "Put $q_i$ into $Q$ and coefficients $r_{ij}$ into $R$", result: "$R$", why: "matrix form is $A=QR$." },
      { do: "Since $Q^TQ=I$, least squares $\\min\\lVert Ax-b\\rVert$ becomes $\\min\\lVert Rx-Q^Tb\\rVert$.", result: "$\\min\\lVert Rx-Q^Tb\\rVert$", why: "This is the next computation or definition step." },
      { do: "Solve triangular $Rx=Q^Tb$ by back-substitution.", result: "$Rx=Q^Tb$", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Application 1", background: "For", numbers: "For $A=\\begin{bmatrix}1&1\\1&2\\1&3\\end{bmatrix}$, QR has diagonal magnitudes $\\sqrt3\\approx1.732$ and $\\sqrt2\\approx1.414$." },
      { title: "Application 2", background: "The computation is shown directly.", numbers: "$Q^TQ=I$ keeps column norms $1$." },
      { title: "Application 3", background: "Least squares via QR avoids squaring condition numbers.", numbers: "Least squares via QR avoids squaring condition numbers." },
      { title: "Application 4", background: "Orthogonalizing features makes cross-products", numbers: "Orthogonalizing features makes cross-products $0$." },
      { title: "Application 5", background: "QR iteration is the basis of eigenvalue algorithms.", numbers: "QR iteration is the basis of eigenvalue algorithms." },
      { title: "Application 6", background: "A rotation matrix is already", numbers: "A rotation matrix is already $Q$, so its $R$ is identity." },
    ]
  },
  "math-09-28": {
    connectionsProse: "<p>This lesson focuses on the spectral theorem as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Symmetric matrices have perpendicular eigenvectors and real eigenvalues. Covariance matrices, Hessians, graph Laplacians, and quadratic forms use this structure.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Symmetric matrices have perpendicular eigenvectors and real eigenvalues. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>This is why covariance matrices, Hessians, and graph Laplacians have clean geometric interpretations. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> The Spectral Theorem is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "Symmetric", desc: "$A=A^T$" },
      { sym: "$Q$", desc: "orthogonal" },
      { sym: "$\\Lambda$", desc: "diagonal eigenvalue matrix." },
    ],
    derivation: [
      { do: "Let $A=A^T$ and $Av=\\lambda v$, $Aw=\\mu w$.", result: "$Aw=\\mu w$", why: "This is the next computation or definition step." },
      { do: "Compute $v^TAw$ two ways: $v^TAw=\\mu v^Tw$ from $Aw=\\mu w$.", result: "$Aw=\\mu w$", why: "This is the next computation or definition step." },
      { do: "Also $v^TAw=(A v)^Tw=\\lambda v^Tw$ because $A^T=A$.", result: "$A^T=A$", why: "This is the next computation or definition step." },
      { do: "Subtract to get $(\\mu-\\lambda)v^Tw=0$.", result: "$(\\mu-\\lambda)v^Tw=0$", why: "This is the next computation or definition step." },
      { do: "If $\\lambda\\ne\\mu$, then $v^Tw=0$", result: "$v^Tw=0$", why: "different eigenspaces are orthogonal." },
      { do: "With an orthonormal eigenbasis, $A=Q\\Lambda Q^T$.", result: "$A=Q\\Lambda Q^T$", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Application 1", background: "The computation is shown directly.", numbers: "$S=\\begin{bmatrix}3&1\\1&3\\end{bmatrix}$ has eigenvalues $4,2$." },
      { title: "Application 2", background: "Eigenvectors", numbers: "Eigenvectors $(1,1)/\\sqrt2$ and $(1,-1)/\\sqrt2$ are orthogonal." },
      { title: "Application 3", background: "Covariance eigendecomposition gives PCA axes.", numbers: "Covariance eigendecomposition gives PCA axes." },
      { title: "Application 4", background: "Quadratic", numbers: "Quadratic $x^TSx$ in eigen-coordinates is $4z_1^2+2z_2^2$." },
      { title: "Application 5", background: "Graph Laplacian eigenvectors form graph Fourier modes.", numbers: "Graph Laplacian eigenvectors form graph Fourier modes." },
      { title: "Application 6", background: "Matrix power", numbers: "Matrix power $S^3=Q\\operatorname{diag}(64,8)Q^T$." },
    ]
  },
  "math-09-29": {
    connectionsProse: "<p>This lesson focuses on positive-definite matrices as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. A positive-definite matrix makes every nonzero quadratic form positive. Convex optimization, covariance regularization, kernels, and Cholesky factorization all use this test.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. A positive-definite matrix makes every nonzero quadratic form positive. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>In optimization, it means the local surface is a bowl. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> Positive-definite matrices is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$A\\succ0$", desc: "positive definite" },
      { sym: "$x^TAx$", desc: "a quadratic form" },
      { sym: "$\\lambda_i$", desc: "eigenvalues." },
    ],
    derivation: [
      { do: "For symmetric $A$, spectral theorem gives $A=Q\\Lambda Q^T$.", result: "$A=Q\\Lambda Q^T$", why: "This is the next computation or definition step." },
      { do: "Write $x^TAx=x^TQ\\Lambda Q^Tx$.", result: "$x^TAx=x^TQ\\Lambda Q^Tx$", why: "This is the next computation or definition step." },
      { do: "Let $z=Q^Tx$", result: "$z=Q^Tx$", why: "rotation preserves nonzero vectors." },
      { do: "Then $x^TAx=z^T\\Lambda z=\\sum_i\\lambda_i z_i^2$.", result: "$x^TAx=z^T\\Lambda z=\\sum_i\\lambda_i z_i^2$", why: "This is the next computation or definition step." },
      { do: "This is positive for every nonzero $x$ exactly when all $\\lambda_i>0$.", result: "$\\lambda_i>0$", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Application 1", background: "The computation is shown directly.", numbers: "$\\begin{bmatrix}2&1\\1&2\\end{bmatrix}$ has eigenvalues $1,3$, so it is positive definite." },
      { title: "Application 2", background: "For", numbers: "For $x=(1,2)$, $x^TAx=14$." },
      { title: "Application 3", background: "Covariance with positive variances is PSD; adding", numbers: "Covariance with positive variances is PSD; adding $0.1I$ makes eigenvalues at least $0.1$." },
      { title: "Application 4", background: "Hessian", numbers: "Hessian $\\operatorname{diag}(2,200)$ gives convex quadratic." },
      { title: "Application 5", background: "Kernel Gram matrix must be PSD; negative eigenvalue fails.", numbers: "Kernel Gram matrix must be PSD; negative eigenvalue fails." },
      { title: "Application 6", background: "Cholesky works on PD matrices; diagonal", numbers: "Cholesky works on PD matrices; diagonal $4,9$ has Cholesky diagonal $2,3$." },
    ]
  },
  "math-09-30": {
    connectionsProse: "<p>This lesson focuses on quadratic forms as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. A quadratic form $x^TAx$ measures how a matrix weights directions. Curvature, Mahalanobis distance, and confidence ellipses are all quadratic-form ideas.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. A quadratic form $x^TAx$ measures how a matrix weights directions. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>It is the local shape of a second-order loss and the geometry of ellipses. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> Quadratic forms is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$x$", desc: "the input vector" },
      { sym: "$A$ sets curvature", desc: "$A$ sets curvature" },
      { sym: "$\\lambda_i$", desc: "directional curvatures." },
    ],
    derivation: [
      { do: "Start with symmetric $A=Q\\Lambda Q^T$", result: "$A=Q\\Lambda Q^T$", why: "rotate to eigen-directions." },
      { do: "Let $z=Q^Tx$", result: "$z=Q^Tx$", why: "express $x$ in eigen-coordinates." },
      { do: "Substitute: $x^TAx=z^T\\Lambda z$.", result: "$x^TAx=z^T\\Lambda z$", why: "This is the next computation or definition step." },
      { do: "Expand diagonal multiplication: $\\sum_i\\lambda_i z_i^2$.", result: "$\\sum_i\\lambda_i z_i^2$", why: "This is the next computation or definition step." },
      { do: "Signs and sizes of $\\lambda_i$ tell whether the form is a bowl, dome, or saddle.", result: "$\\lambda_i$", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Application 1", background: "With", numbers: "With $A=\\begin{bmatrix}2&1\\1&2\\end{bmatrix}$ and $x=(1,2)$, value is $14$." },
      { title: "Application 2", background: "Ridge penalty", numbers: "Ridge penalty $\\lambda\\lVert w\\rVert^2$ with $\\lambda=0.1$, $\\lVert w\\rVert^2=25$ gives $2.5$." },
      { title: "Application 3", background: "Mahalanobis distance with covariance", numbers: "Mahalanobis distance with covariance $\\operatorname{diag}(4,9)$ and $x=(2,3)$ is $1+1=2$." },
      { title: "Application 4", background: "Confidence ellipse", numbers: "Confidence ellipse $x^TA^{-1}x=5.99$ is a 95% boundary in 2-D." },
      { title: "Application 5", background: "Hessian eigenvalues", numbers: "Hessian eigenvalues $1,3$ mean curvature ratio $3$." },
      { title: "Application 6", background: "Energy in spring matrix", numbers: "Energy in spring matrix $K=2I$ at $x=(3,4)$ is $x^TKx=50$." },
    ]
  },
  "math-09-31": {
    connectionsProse: "<p>This lesson focuses on Singular Value Decomposition (SVD) as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. SVD decomposes any matrix into input directions, stretches, and output directions. Pseudoinverses, PCA, low-rank approximation, and conditioning all use singular values.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. SVD decomposes any matrix into input directions, stretches, and output directions. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>Unlike eigen-decomposition, it works for rectangular matrices too. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> Singular Value Decomposition (SVD) is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$U$ output singular vectors", desc: "$U$ output singular vectors" },
      { sym: "$\\Sigma$ diagonal singular-value matrix", desc: "$\\Sigma$ diagonal singular-value matrix" },
      { sym: "$V$ input singular vectors", desc: "$V$ input singular vectors" },
      { sym: "$\\sigma_i$ singular values.", desc: "$\\sigma_i$ singular values." },
    ],
    derivation: [
      { do: "Form $A^TA$", result: "$A^TA$", why: "it is symmetric positive semidefinite." },
      { do: "Spectral theorem gives $A^TA=V\\Lambda V^T$ with orthonormal $V$.", result: "$V$", why: "This is the next computation or definition step." },
      { do: "Singular values are $\\sigma_i=\\sqrt{\\lambda_i}$", result: "$\\sigma_i=\\sqrt{\\lambda_i}$", why: "$\\lambda_i$ are squared output lengths of input directions." },
      { do: "Define $u_i=Av_i/\\sigma_i$ for nonzero $\\sigma_i$", result: "$\\sigma_i$", why: "normalize each output direction." },
      { do: "Then $Av_i=\\sigma_i u_i$ for every singular pair.", result: "$Av_i=\\sigma_i u_i$", why: "This is the next computation or definition step." },
      { do: "Stacking these relations gives $A=U\\Sigma V^T$.", result: "$A=U\\Sigma V^T$", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Application 1", background: "The computation is shown directly.", numbers: "$A=\\begin{bmatrix}3&0\\0&1\\0&0\\end{bmatrix}$ has singular values $3,1$." },
      { title: "Application 2", background: "Rank-1 approximation keeps error", numbers: "Rank-1 approximation keeps error $\\sigma_2=1$ in spectral norm." },
      { title: "Application 3", background: "Explained Frobenius energy by first singular value is", numbers: "Explained Frobenius energy by first singular value is $9/(9+1)=0.9$." },
      { title: "Application 4", background: "Numerical rank with threshold", numbers: "Numerical rank with threshold $2$ is $1$." },
      { title: "Application 5", background: "Condition number is", numbers: "Condition number is $3/1=3$." },
      { title: "Application 6", background: "Low-rank image compression with", numbers: "Low-rank image compression with $100\\times100$ rank $10$ stores about $10(100+100+1)=2010$ numbers." },
    ]
  },
  "math-09-32": {
    connectionsProse: "<p>This lesson focuses on least squares as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Least squares finds the vector whose predictions are closest to the data when exact equations cannot all be satisfied. QR and pseudoinverse methods solve the same fitting problem from different factorizations.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Least squares finds the vector whose predictions are closest to the data when exact equations cannot all be satisfied. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>It is projection onto the column space of the design matrix. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> Least squares is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$A$ design matrix", desc: "$A$ design matrix" },
      { sym: "$x$ coefficients", desc: "$x$ coefficients" },
      { sym: "$b$ observations", desc: "$b$ observations" },
      { sym: "$r$ residual", desc: "$r$ residual" },
      { sym: "normal equations", desc: "$A^TAx=A^Tb$." },
    ],
    derivation: [
      { do: "Minimize $\\lVert Ax-b\\rVert^2$", result: "$\\lVert Ax-b\\rVert^2$", why: "squared residual length." },
      { do: "Let residual $r=b-Ax$.", result: "$r=b-Ax$", why: "This is the next computation or definition step." },
      { do: "At the closest point, residual is orthogonal to every column of $A$", result: "$A$", why: "otherwise moving in that column direction would reduce error." },
      { do: "Orthogonality gives $A^Tr=0$.", result: "$A^Tr=0$", why: "This is the next computation or definition step." },
      { do: "Substitute $r=b-Ax$: $A^T(b-Ax)=0$.", result: "$A^T(b-Ax)=0$", why: "This is the next computation or definition step." },
      { do: "Rearrange to normal equations $A^TAx=A^Tb$.", result: "$A^TAx=A^Tb$", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Application 1", background: "For", numbers: "For $A=\\begin{bmatrix}1&1\\1&2\\1&3\\end{bmatrix}$, $b=(1,2,2)$ gives $x=(2/3,1/2)$." },
      { title: "Application 2", background: "Predictions are", numbers: "Predictions are $(1.167,1.667,2.167)$." },
      { title: "Application 3", background: "Residual is", numbers: "Residual is $(-0.167,0.333,-0.167)$ and sums to $0$." },
      { title: "Application 4", background: "Calibration line slope is", numbers: "Calibration line slope is $0.5$." },
      { title: "Application 5", background: "Residual norm squared is about", numbers: "Residual norm squared is about $0.167$." },
      { title: "Application 6", background: "Ridge version adds", numbers: "Ridge version adds $\\lambda I$ to $A^TA$." },
    ]
  },
  "math-09-33": {
    connectionsProse: "<p>This lesson focuses on the pseudoinverse as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. The pseudoinverse extends inverse-like solving to rectangular or rank-deficient matrices. Least squares, minimum-norm solutions, and regularization all use this inverse-like operator.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. The pseudoinverse extends inverse-like solving to rectangular or rank-deficient matrices. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>It gives least-squares solutions and, when many exact solutions exist, chooses the minimum-norm one. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> The pseudoinverse is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$A^+$", desc: "pseudoinverse" },
      { sym: "$\\Sigma^+$ reciprocates nonzero singular values", desc: "$\\Sigma^+$ reciprocates nonzero singular values" },
      { sym: "zero singular values stay zero.", desc: "zero singular values stay zero." },
    ],
    derivation: [
      { do: "Start with SVD $A=U\\Sigma V^T$.", result: "$A=U\\Sigma V^T$", why: "This is the next computation or definition step." },
      { do: "Nonzero singular directions satisfy $Av_i=\\sigma_i u_i$.", result: "$Av_i=\\sigma_i u_i$", why: "This is the next computation or definition step." },
      { do: "To invert that direction, map $u_i$ back to $v_i$ and divide by $\\sigma_i$.", result: "$\\sigma_i$", why: "This is the next computation or definition step." },
      { do: "Leave zero singular directions at zero", result: "Leave zero singular directions at zero", why: "they cannot be inverted." },
      { do: "Stack those reciprocal actions in $\\Sigma^+$.", result: "$\\Sigma^+$", why: "This is the next computation or definition step." },
      { do: "The pseudoinverse is $A^+=V\\Sigma^+U^T$.", result: "$A^+=V\\Sigma^+U^T$", why: "This is the next computation or definition step." },
      { do: "Least-squares solution is $x=A^+b$.", result: "$x=A^+b$", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Application 1", background: "For diagonal", numbers: "For diagonal $A=\\operatorname{diag}(3,1,0)$, $A^+=\\operatorname{diag}(1/3,1,0)$." },
      { title: "Application 2", background: "The computation is shown directly.", numbers: "$b=(6,2,5)$ maps to $x=(2,2,0)$." },
      { title: "Application 3", background: "Least-squares line example gives", numbers: "Least-squares line example gives $A^+b=(2/3,1/2)$." },
      { title: "Application 4", background: "Minimum-norm solution of", numbers: "Minimum-norm solution of $[1\\ 1]x=4$ is $(2,2)$." },
      { title: "Application 5", background: "Small singular value", numbers: "Small singular value $0.01$ becomes reciprocal $100$, showing instability." },
      { title: "Application 6", background: "Ridge filter for singular value", numbers: "Ridge filter for singular value $3$ with $\\lambda=1$ is $3/(9+1)=0.3$." },
    ]
  },
  "math-09-34": {
    connectionsProse: "<p>This lesson focuses on Principal Component Analysis (PCA) as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. PCA finds orthogonal directions of maximum variance. Dimensionality reduction, whitening, denoising, and reconstruction all use these coordinates.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. PCA finds orthogonal directions of maximum variance. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>Algebraically, those directions are eigenvectors of the covariance matrix. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> Principal Component Analysis (PCA) is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$X$ centered data matrix", desc: "$X$ centered data matrix" },
      { sym: "$C=X^TX/n$ covariance", desc: "$C=X^TX/n$ covariance" },
      { sym: "$u$ principal direction", desc: "$u$ principal direction" },
      { sym: "$\\lambda$ explained variance.", desc: "$\\lambda$ explained variance." },
    ],
    derivation: [
      { do: "Center data so each feature has mean zero", result: "Center data so each feature has mean zero", why: "PCA studies variance around the mean." },
      { do: "For unit direction $u$, projected data are $Xu$.", result: "$Xu$", why: "This is the next computation or definition step." },
      { do: "Projected variance is $\\frac1n\\lVert Xu\\rVert^2=u^T(\\frac1nX^TX)u=u^TCu$.", result: "$\\frac1n\\lVert Xu\\rVert^2=u^T(\\frac1nX^TX)u=u^TCu$", why: "This is the next computation or definition step." },
      { do: "Maximize $u^TCu$ subject to $u^Tu=1$.", result: "$u^Tu=1$", why: "This is the next computation or definition step." },
      { do: "Lagrange multipliers give $Cu=\\lambda u$", result: "$Cu=\\lambda u$", why: "principal directions are covariance eigenvectors." },
      { do: "The variance in direction $u$ is the eigenvalue $\\lambda$.", result: "$\\lambda$", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Application 1", background: "Data", numbers: "Data $(2,0),(0,1),(-2,0),(0,-1)$ has covariance $\\operatorname{diag}(2,0.5)$." },
      { title: "Application 2", background: "First PC is x-axis with variance", numbers: "First PC is x-axis with variance $2$." },
      { title: "Application 3", background: "Explained variance ratio of PC1 is", numbers: "Explained variance ratio of PC1 is $2/(2+0.5)=0.8$." },
      { title: "Application 4", background: "Project point", numbers: "Project point $(2,1)$ onto PC1 gives coordinate $2$." },
      { title: "Application 5", background: "Whitening scales x by", numbers: "Whitening scales x by $1/\\sqrt2\\approx0.707$ and y by $1/\\sqrt{0.5}\\approx1.414$." },
      { title: "Application 6", background: "Dropping PC2 leaves reconstruction", numbers: "Dropping PC2 leaves reconstruction $(2,0)$ for point $(2,1)$." },
    ]
  },
  "math-09-35": {
    connectionsProse: "<p>This lesson focuses on matrix norms as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. A matrix norm measures the size of a matrix as an operator or as a collection of entries. Condition numbers and approximation errors are measured through these norms.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. A matrix norm measures the size of a matrix as an operator or as a collection of entries. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>Norms control sensitivity, regularization, and approximation error. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> Matrix norms is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$\\lVert A\\rVert_2$", desc: "spectral norm" },
      { sym: "$\\lVert A\\rVert_F$", desc: "Frobenius norm" },
      { sym: "$\\sigma_{\\max}$", desc: "largest singular value." },
    ],
    derivation: [
      { do: "The operator 2-norm is $\\lVert A\\rVert_2=\\max_{\\lVert x\\rVert=1}\\lVert Ax\\rVert$", result: "$\\lVert A\\rVert_2=\\max_{\\lVert x\\rVert=1}\\lVert Ax\\rVert$", why: "maximum stretch of a unit vector." },
      { do: "Square it: $\\lVert Ax\\rVert^2=x^TA^TAx$.", result: "$\\lVert Ax\\rVert^2=x^TA^TAx$", why: "This is the next computation or definition step." },
      { do: "The maximum Rayleigh quotient of $A^TA$ is its largest eigenvalue.", result: "$A^TA$", why: "This is the next computation or definition step." },
      { do: "Therefore $\\lVert A\\rVert_2=\\sqrt{\\lambda_{\\max}(A^TA)}=\\sigma_{\\max}$.", result: "$\\lVert A\\rVert_2=\\sqrt{\\lambda_{\\max}(A^TA)}=\\sigma_{\\max}$", why: "This is the next computation or definition step." },
      { do: "Frobenius norm sums squared entries: $\\lVert A\\rVert_F=\\sqrt{\\sum_{ij}A_{ij}^2}$.", result: "$\\lVert A\\rVert_F=\\sqrt{\\sum_{ij}A_{ij}^2}$", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Application 1", background: "For", numbers: "For $A=\\begin{bmatrix}1&2\\3&4\\end{bmatrix}$, $\\lVert A\\rVert_2\\approx5.465$." },
      { title: "Application 2", background: "Frobenius norm is", numbers: "Frobenius norm is $\\sqrt{30}\\approx5.477$." },
      { title: "Application 3", background: "Diagonal", numbers: "Diagonal $\\operatorname{diag}(3,1)$ has spectral norm $3$." },
      { title: "Application 4", background: "Gradient clipping rescales vector norm", numbers: "Gradient clipping rescales vector norm $10$ to $5$ by multiplier $0.5$." },
      { title: "Application 5", background: "Rank-1 SVD error for singular values", numbers: "Rank-1 SVD error for singular values $3,1$ is spectral norm $1$." },
      { title: "Application 6", background: "Weight decay penalty", numbers: "Weight decay penalty $0.01\\lVert W\\rVert_F^2$ with $\\lVert W\\rVert_F^2=30$ gives $0.3$." },
    ]
  },
  "math-09-36": {
    connectionsProse: "<p>This lesson focuses on the condition number as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. The condition number measures how much a matrix can amplify relative error. Scaling, ridge regularization, and SVD diagnostics all respond to this sensitivity.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. The condition number measures how much a matrix can amplify relative error. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>Large condition numbers warn that solves and least-squares fits may be unstable. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> The condition number is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$\\kappa(A)$", desc: "condition number" },
      { sym: "$\\delta b$ input perturbation", desc: "$\\delta b$ input perturbation" },
      { sym: "$\\delta x$ solution perturbation", desc: "$\\delta x$ solution perturbation" },
      { sym: "norm", desc: "usually the 2-norm." },
    ],
    derivation: [
      { do: "A perturbation in $b$ changes solution by $\\delta x=A^{-1}\\delta b$", result: "$\\delta x=A^{-1}\\delta b$", why: "from $A(x+\\delta x)=b+\\delta b$." },
      { do: "Bound output error: $\\lVert\\delta x\\rVert\\le\\lVert A^{-1}\\rVert\\lVert\\delta b\\rVert$.", result: "$\\lVert\\delta x\\rVert\\le\\lVert A^{-1}\\rVert\\lVert\\delta b\\rVert$", why: "This is the next computation or definition step." },
      { do: "Also $\\lVert b\\rVert=\\lVert Ax\\rVert\\le\\lVert A\\rVert\\lVert x\\rVert$, so $1/\\lVert x\\rVert\\le\\lVert A\\rVert/\\lVert b\\rVert$.", result: "$1/\\lVert x\\rVert\\le\\lVert A\\rVert/\\lVert b\\rVert$", why: "This is the next computation or definition step." },
      { do: "Combine to get relative error bound $\\frac{\\lVert\\delta x\\rVert}{\\lVert x\\rVert}\\le\\lVert A\\rVert\\lVert A^{-1}\\rVert\\frac{\\lVert\\delta b\\rVert}{\\lVert b\\rVert}$.", result: "$\\frac{\\lVert\\delta x\\rVert}{\\lVert x\\rVert}\\le\\lVert A\\rVert\\lVert A^{-1}\\rVert\\frac{\\lVert\\delta b\\rVert}{\\lVert b\\rVert}$", why: "This is the next computation or definition step." },
      { do: "Define $\\kappa(A)=\\lVert A\\rVert\\lVert A^{-1}\\rVert$.", result: "$\\kappa(A)=\\lVert A\\rVert\\lVert A^{-1}\\rVert$", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Application 1", background: "The computation is shown directly.", numbers: "$A=\\operatorname{diag}(2,0.5)$ has condition number $4$." },
      { title: "Application 2", background: "A", numbers: "A $1\\%$ input error can become about $4\\%$ solution error." },
      { title: "Normal equations square conditioning", background: "The computation is shown directly.", numbers: "$\\kappa(A^TA)=16$ for this $A$." },
      { title: "Application 4", background: "Feature scaling from standard deviations", numbers: "Feature scaling from standard deviations $100,1$ gives condition number $100$." },
      { title: "Application 5", background: "Ridge raises smallest singular value, reducing instability.", numbers: "Ridge raises smallest singular value, reducing instability." },
      { title: "Application 6", background: "SVD singular values", numbers: "SVD singular values $10,0.01$ give $\\kappa=1000$." },
    ]
  },
  "math-09-37": {
    connectionsProse: "<p>This lesson focuses on tensors as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. A tensor is a multi-index array. Modern model activations, attention scores, and convolution kernels all have tensor shapes.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. A tensor is a multi-index array. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>Vectors have one index, matrices have two, and tensors add more axes for batches, channels, heads, time, or spatial dimensions. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> this lesson is about representation and indexing rather than a formula. Explain shape, axes, slicing, and contraction with concrete shapes.</p><p><b>Assumptions that matter:</b> Use the stated closure, compatibility, indexing, or shape conditions; this lesson is conceptual rather than a proof.</p>",
    symbols: [
      { sym: "$T_{ijk}$", desc: "an entry with three indices" },
      { sym: "shape lists axis lengths", desc: "shape lists axis lengths" },
      { sym: "contraction sums over a shared index.", desc: "contraction sums over a shared index." },
    ],
    applications: [
      { title: "Application 1", background: "Image batch shape", numbers: "Image batch shape $32\\times224\\times224\\times3$ has $4{,}816{,}896$ numbers." },
      { title: "Application 2", background: "Transformer activations", numbers: "Transformer activations $16\\times128\\times768$ have $1{,}572{,}864$ numbers." },
      { title: "Application 3", background: "Conv kernel", numbers: "Conv kernel $3\\times3\\times64\\times128$ has $73{,}728$ weights." },
      { title: "Application 4", background: "Attention scores with batch", numbers: "Attention scores with batch $2$, heads $8$, length $128$ have $262{,}144$ entries." },
      { title: "Application 5", background: "Bias of shape", numbers: "Bias of shape $768$ broadcasts across $16\\times128$ positions." },
      { title: "Application 6", background: "Mean loss over", numbers: "Mean loss over $32$ examples sums losses then divides by $32$." },
    ]
  },
  "math-09-38": {
    connectionsProse: "<p>This lesson focuses on the Kronecker product as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. The Kronecker product builds a large structured matrix by replacing each entry of one matrix with a scaled copy of another. Separable filters, grid covariances, and tensor-product features use this structure.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. The Kronecker product builds a large structured matrix by replacing each entry of one matrix with a scaled copy of another. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>It is how separable grids, tensor-product features, and structured covariance matrices stay manageable. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> The Kronecker product is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$\\otimes$", desc: "Kronecker product" },
      { sym: "blocks", desc: "scaled copies" },
      { sym: "dimensions multiply by axis.", desc: "dimensions multiply by axis." },
    ],
    derivation: [
      { do: "Take matrices $A=[a_{ij}]$ and $B$", result: "$B$", why: "one provides block weights, the other provides block shape." },
      { do: "Replace each scalar $a_{ij}$ by block $a_{ij}B$", result: "$a_{ij}B$", why: "this preserves the row-column layout of $A$." },
      { do: "The resulting block matrix is $A\\otimes B$.", result: "$A\\otimes B$", why: "This is the next computation or definition step." },
      { do: "Dimensions multiply: if $A$ is $m\\times n$ and $B$ is $p\\times q$, then $A\\otimes B$ is $mp\\times nq$.", result: "$mp\\times nq$", why: "This is the next computation or definition step." },
      { do: "Matrix-vector products can be interpreted as applying one factor along one tensor axis and the other factor along another.", result: "Matrix-vector products can be interpreted as applying one factor along one tensor axis and the other factor along another.", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Application 1", background: "The computation is shown directly.", numbers: "$\\begin{bmatrix}1&2\\3&4\\end{bmatrix}\\otimes\\begin{bmatrix}0&1\\1&0\\end{bmatrix}$ is $4\\times4$." },
      { title: "Application 2", background: "Sum of its entries is", numbers: "Sum of its entries is $(1+2+3+4)(0+1+1+0)=20$." },
      { title: "Application 3", background: "Determinant rule for two", numbers: "Determinant rule for two $2\\times2$ matrices gives $\\det(A\\otimes B)=\\det(A)^2\\det(B)^2$; with dets $-2,-1$ gives $4$." },
      { title: "Application 4", background: "Separable image filter", numbers: "Separable image filter $3\\times3$ from two length-3 vectors uses $6$ parameters instead of $9$." },
      { title: "Application 5", background: "Grid covariance", numbers: "Grid covariance $20\\times20$ and $30\\times30$ factors produce a $600\\times600$ covariance." },
      { title: "Application 6", background: "Tensor-product features of sizes", numbers: "Tensor-product features of sizes $5$ and $7$ produce $35$ features." },
    ]
  },
  "math-09-39": {
    connectionsProse: "<p>This lesson focuses on weights as linear maps and low-rank factorization, as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. A weight matrix is a linear map from input features to output features. Compression, adapter layers, and SVD approximations all use this factorized-map view.</p>",
    motivation: "<p>Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. A weight matrix is a linear map from input features to output features. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.</p><p>Low-rank factorization replaces one large map by two smaller maps through a bottleneck. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.</p>",
    definition: "<p><b>Definition.</b> Weights as linear maps; low-rank factorization is defined by the computation below.</p><p><b>Assumptions that matter:</b> Work with compatible dimensions over the real numbers unless the lesson states a nonzero, invertible, symmetric, or rank condition.</p>",
    symbols: [
      { sym: "$W$", desc: "the weight matrix" },
      { sym: "$r$", desc: "rank or bottleneck size" },
      { sym: "$A,B$", desc: "low-rank factors" },
      { sym: "singular values order approximation quality.", desc: "singular values order approximation quality." },
    ],
    derivation: [
      { do: "A dense layer computes $y=Wx$", result: "$y=Wx$", why: "matrix rows are output features." },
      { do: "If $W\\in\\mathbb R^{m\\times n}$ has rank $r$, write $W\\approx AB$ with $A\\in\\mathbb R^{m\\times r}$ and $B\\in\\mathbb R^{r\\times n}$", result: "$B\\in\\mathbb R^{r\\times n}$", why: "the map passes through $r$ latent coordinates." },
      { do: "Parameter count changes from $mn$ to $r(m+n)$", result: "$r(m+n)$", why: "count entries in both factors." },
      { do: "SVD gives best rank-$r$ approximation by keeping the top $r$ singular values.", result: "$r$", why: "This is the next computation or definition step." },
      { do: "The approximation error in spectral norm is the next singular value $\\sigma_{r+1}$.", result: "$\\sigma_{r+1}$", why: "This is the next computation or definition step." },
    ],
    applications: [
      { title: "Application 1", background: "A", numbers: "A $1024\\times1024$ dense layer has $1{,}048{,}576$ weights." },
      { title: "Application 2", background: "Rank-", numbers: "Rank-$8$ LoRA update stores $8(1024+1024)=16{,}384$ weights." },
      { title: "Application 3", background: "Compression ratio is", numbers: "Compression ratio is $16{,}384/1{,}048{,}576=1.5625\\%$." },
      { title: "Application 4", background: "Bottleneck", numbers: "Bottleneck $512\\to64\\to512$ stores $65{,}536$ weights instead of $262{,}144$." },
      { title: "Application 5", background: "Rank of", numbers: "Rank of $AB$ is at most $8$ if bottleneck is $8$." },
      { title: "Application 6", background: "SVD singular values", numbers: "SVD singular values $10,3,1$ rank-2 approximation has spectral error $1$." },
    ]
  }
};
