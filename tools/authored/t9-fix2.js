module.exports = {
  "math-09-19": {
    id: "math-09-19",
    title: "The characteristic polynomial",
    tagline: "The characteristic polynomial turns the search for eigenvalues into ordinary algebra.",
    connections: {
      buildsOn: ["determinants", "matrix multiplication", "identity matrices", "eigenvectors"],
      leadsTo: ["Diagonalization", "Similarity", "The Jordan form"],
      usedWith: ["determinants", "null spaces", "polynomial roots", "matrix powers"]
    },
    motivation:
      "<p>You already know how to test whether a square matrix collapses space: compute its determinant. If $\\det(A)=0$, some nonzero direction gets sent to zero.</p>" +
      "<p>Eigenvalues ask a slightly gentler question. Instead of asking whether $A$ sends a direction to zero, we ask whether $A-\\lambda I$ does. The values of $\\lambda$ that make this happen are the eigenvalues, and the determinant packages all of them into one polynomial.</p>",
    definition:
      "<p>For an $n\\times n$ matrix $A$, the <b>characteristic polynomial</b> is $p_A(\\lambda)=\\det(A-\\lambda I)$, where $I$ is the $n\\times n$ identity matrix and $\\lambda$ is a scalar. The <b>characteristic equation</b> is $\\det(A-\\lambda I)=0$.</p>" +
      "<p>Here is why this finds eigenvalues. A nonzero vector $v$ is an eigenvector with eigenvalue $\\lambda$ when $Av=\\lambda v$. Subtracting gives $(A-\\lambda I)v=0$. A nonzero solution exists exactly when $A-\\lambda I$ is singular, and that happens exactly when $\\det(A-\\lambda I)=0$.</p>" +
      "<p><b>Assumptions that matter:</b> $A$ must be square; $I$ has the same size as $A$; roots may be real or complex; repeated roots count with algebraic multiplicity; and some authors use $\\det(\\lambda I-A)$, which changes signs in some degrees but has the same roots.</p>",
    worked: {
      problem: "Find the characteristic polynomial and eigenvalues of $A=\\begin{bmatrix}2 & 1 \\\\ 0 & 3\\end{bmatrix}$.",
      skills: ["forming $A-\\lambda I$", "2 by 2 determinants", "polynomial roots"],
      strategy: "The off-diagonal entry looks distracting — form $A-\\lambda I$ and let the triangular determinant simplify it.",
      steps: [
        { do: "Write the shifted matrix", result: "$A-\\lambda I=\\begin{bmatrix}2-\\lambda & 1 \\\\ 0 & 3-\\lambda\\end{bmatrix}$", why: "subtract $\\lambda$ only from diagonal entries" },
        { do: "Take the determinant", result: "$p_A(\\lambda)=\\det\\begin{bmatrix}2-\\lambda & 1 \\\\ 0 & 3-\\lambda\\end{bmatrix}$", why: "the characteristic polynomial is a determinant" },
        { do: "Use the 2 by 2 determinant rule", result: "$p_A(\\lambda)=(2-\\lambda)(3-\\lambda)-1\\cdot0$", why: "$ad-bc$ for $\\begin{bmatrix}a & b \\\\ c & d\\end{bmatrix}$" },
        { do: "Remove the zero term", result: "$p_A(\\lambda)=(2-\\lambda)(3-\\lambda)$", why: "the lower-left zero makes the product vanish" },
        { do: "Set the polynomial equal to zero", result: "$(2-\\lambda)(3-\\lambda)=0$", why: "eigenvalues are roots of the characteristic equation" },
        { do: "Solve the factors", result: "$\\lambda=2$ or $\\lambda=3$", why: "a product is zero when one factor is zero" }
      ],
      verify: "Because $A$ is triangular, its eigenvalues should be the diagonal entries $2$ and $3$, matching the roots we found.",
      answer: "$p_A(\\lambda)=(2-\\lambda)(3-\\lambda)$, with eigenvalues $2$ and $3$.",
      connects: "The characteristic polynomial converts the geometry of invariant directions into roots of a determinant."
    },
    practice: [
      { problem: "Find the characteristic polynomial and eigenvalues of $B=\\begin{bmatrix}4 & 0 \\\\ 0 & -1\\end{bmatrix}$.", steps: [
        { do: "Form $B-\\lambda I$", result: "$\\begin{bmatrix}4-\\lambda & 0 \\\\ 0 & -1-\\lambda\\end{bmatrix}$", why: "subtract $\\lambda$ from each diagonal entry" },
        { do: "Take the determinant", result: "$(4-\\lambda)(-1-\\lambda)-0\\cdot0$", why: "use the 2 by 2 determinant rule" },
        { do: "Simplify the determinant", result: "$(4-\\lambda)(-1-\\lambda)$", why: "the off-diagonal product is zero" },
        { do: "Set it equal to zero", result: "$(4-\\lambda)(-1-\\lambda)=0$", why: "eigenvalues are characteristic roots" },
        { do: "Solve each factor", result: "$\\lambda=4$ or $\\lambda=-1$", why: "each zero factor gives one eigenvalue" }
      ], answer: "$p_B(\\lambda)=(4-\\lambda)(-1-\\lambda)$, with eigenvalues $4$ and $-1$." },
      { problem: "Find the characteristic polynomial of $C=\\begin{bmatrix}1 & 2 \\\\ 3 & 4\\end{bmatrix}$ and its eigenvalues.", steps: [
        { do: "Form $C-\\lambda I$", result: "$\\begin{bmatrix}1-\\lambda & 2 \\\\ 3 & 4-\\lambda\\end{bmatrix}$", why: "only diagonal entries shift" },
        { do: "Take the determinant", result: "$(1-\\lambda)(4-\\lambda)-2\\cdot3$", why: "apply $ad-bc$" },
        { do: "Expand the first product", result: "$4-5\\lambda+\\lambda^2-6$", why: "multiply the binomials and subtract 6" },
        { do: "Collect terms", result: "$\\lambda^2-5\\lambda-2$", why: "$4-6=-2$" },
        { do: "Use the quadratic formula", result: "$\\lambda=\\dfrac{5\\pm\\sqrt{33}}{2}$", why: "the roots of $\\lambda^2-5\\lambda-2$ are found from $b^2-4ac=33$" }
      ], answer: "$p_C(\\lambda)=\\lambda^2-5\\lambda-2$, with eigenvalues $\\dfrac{5\\pm\\sqrt{33}}{2}$." },
      { problem: "For $D=\\begin{bmatrix}0 & -1 \\\\ 1 & 0\\end{bmatrix}$, find $p_D(\\lambda)$ and describe the eigenvalues.", steps: [
        { do: "Form $D-\\lambda I$", result: "$\\begin{bmatrix}-\\lambda & -1 \\\\ 1 & -\\lambda\\end{bmatrix}$", why: "the diagonal entries are $0-\\lambda$" },
        { do: "Take the determinant", result: "$(-\\lambda)(-\\lambda)-(-1)(1)$", why: "use $ad-bc$" },
        { do: "Simplify the products", result: "$\\lambda^2+1$", why: "subtracting $-1$ adds 1" },
        { do: "Set equal to zero", result: "$\\lambda^2+1=0$", why: "roots give eigenvalues" },
        { do: "Solve over the complex numbers", result: "$\\lambda=\\pm i$", why: "$\\lambda^2=-1$ has no real roots" }
      ], answer: "$p_D(\\lambda)=\\lambda^2+1$; the eigenvalues are complex, $i$ and $-i$." },
      { problem: "Find the characteristic polynomial and eigenvalues of $E=\\begin{bmatrix}5 & 2 \\\\ 0 & 5\\end{bmatrix}$.", steps: [
        { do: "Form $E-\\lambda I$", result: "$\\begin{bmatrix}5-\\lambda & 2 \\\\ 0 & 5-\\lambda\\end{bmatrix}$", why: "both diagonal entries shift by $\\lambda$" },
        { do: "Take the determinant", result: "$(5-\\lambda)(5-\\lambda)-2\\cdot0$", why: "apply the determinant rule" },
        { do: "Simplify", result: "$(5-\\lambda)^2$", why: "the lower-left zero removes the off-diagonal product" },
        { do: "Set equal to zero", result: "$(5-\\lambda)^2=0$", why: "solve the characteristic equation" },
        { do: "Read the repeated root", result: "$\\lambda=5$ with multiplicity $2$", why: "the same factor appears twice" }
      ], answer: "$p_E(\\lambda)=(5-\\lambda)^2$; the only eigenvalue is $5$, repeated twice." },
      { problem: "A two-state update matrix is $F=\\begin{bmatrix}0.8 & 0.1 \\\\ 0.2 & 0.9\\end{bmatrix}$. Find its characteristic polynomial and eigenvalues.", steps: [
        { do: "Form $F-\\lambda I$", result: "$\\begin{bmatrix}0.8-\\lambda & 0.1 \\\\ 0.2 & 0.9-\\lambda\\end{bmatrix}$", why: "subtract $\\lambda$ from the diagonal" },
        { do: "Take the determinant", result: "$(0.8-\\lambda)(0.9-\\lambda)-0.1\\cdot0.2$", why: "use the 2 by 2 determinant rule" },
        { do: "Expand the product", result: "$0.72-1.7\\lambda+\\lambda^2-0.02$", why: "multiply and subtract the off-diagonal product" },
        { do: "Collect terms", result: "$\\lambda^2-1.7\\lambda+0.70$", why: "$0.72-0.02=0.70$" },
        { do: "Factor", result: "$(\\lambda-1)(\\lambda-0.7)$", why: "the roots multiply to $0.70$ and add to $1.7$" },
        { do: "Read the roots", result: "$\\lambda=1$ and $\\lambda=0.7$", why: "each factor gives one long-term mode" }
      ], answer: "$p_F(\\lambda)=\\lambda^2-1.7\\lambda+0.70$, with eigenvalues $1$ and $0.7$." }
    ],
    applications: [
      { title: "Stability of an iterative update", background: "Numerical algorithms often repeat $x_{k+1}=Ax_k$. The characteristic roots describe whether repeated application grows, shrinks, or preserves modes.", numbers: "For $A=\\begin{bmatrix}0.5 & 0 \\\\ 0 & 0.2\\end{bmatrix}$, $p_A(\\lambda)=(0.5-\\lambda)(0.2-\\lambda)$, so both modes shrink because $0.5$ and $0.2$ are below $1$." },
      { title: "Markov-chain mixing", background: "A Markov chain moves probability mass between states. The root $1$ preserves total probability, while smaller roots control how quickly memory of the start fades.", numbers: "For $\\begin{bmatrix}0.9 & 0.1 \\\\ 0.1 & 0.9\\end{bmatrix}$, the characteristic roots are $1$ and $0.8$, so the difference between states shrinks by $20\\%$ per step." },
      { title: "Principal component analysis", background: "PCA studies eigenvalues of a covariance matrix. The characteristic polynomial is the algebraic route to the variances of principal directions.", numbers: "For covariance $\\begin{bmatrix}4 & 0 \\\\ 0 & 1\\end{bmatrix}$, the roots are $4$ and $1$, so the first principal direction carries four times the variance of the second." },
      { title: "Second-order recurrence behavior", background: "Linear recurrences can be written with companion matrices. Their characteristic roots tell whether sequences grow, decay, or oscillate.", numbers: "The recurrence $x_{k+2}=3x_{k+1}-2x_k$ has companion roots from $r^2-3r+2=0$, namely $1$ and $2$, so one mode doubles." },
      { title: "Graph diffusion", background: "Graph-based smoothing uses matrices built from adjacency or Laplacian operators. Characteristic roots reveal which patterns survive smoothing.", numbers: "For $A=\\begin{bmatrix}1 & 1 \\\\ 1 & 1\\end{bmatrix}$, $p_A(\\lambda)=\\lambda^2-2\\lambda$, so roots $2$ and $0$ separate the all-ones pattern from the difference pattern." },
      { title: "Damped rotations", background: "Optimization and control can create spiral dynamics. Complex characteristic roots identify oscillation plus decay or growth.", numbers: "For $0.9\\begin{bmatrix}0 & -1 \\\\ 1 & 0\\end{bmatrix}$, roots are $0.9i$ and $-0.9i$, so the state rotates while its size is scaled by $0.9$ each step." }
    ],
    applicationsClose: "Across updates, chains, covariance, recurrences, graphs, and rotations, the determinant equation names the hidden modes.",
    takeaways: [
      "$p_A(\\lambda)=\\det(A-\\lambda I)$ is defined only for square matrices.",
      "Eigenvalues are exactly the roots of $\\det(A-\\lambda I)=0$.",
      "Triangular matrices reveal their characteristic roots on the diagonal.",
      "Repeated or complex roots are normal and carry important geometric information."
    ]
  },

  "math-09-20": {
    id: "math-09-20",
    title: "Diagonalization",
    tagline: "Diagonalization changes coordinates so a matrix acts by simple independent scaling.",
    connections: {
      buildsOn: ["The characteristic polynomial", "eigenvectors", "matrix inverses", "basis coordinates"],
      leadsTo: ["Similarity", "The Jordan form", "spectral decompositions"],
      usedWith: ["bases", "matrix powers", "change of coordinates", "linear recurrences"]
    },
    motivation:
      "<p>You already know diagonal matrices are easy. Multiplying by $\\begin{bmatrix}3 & 0 \\\\ 0 & 5\\end{bmatrix}$ just scales the first coordinate by $3$ and the second by $5$.</p>" +
      "<p>Diagonalization asks whether a not-so-diagonal matrix becomes that simple after choosing better axes. If the axes are eigenvectors, the matrix stops mixing coordinates and only stretches each one. That is why powers, recurrences, and dynamics become much easier.</p>",
    definition:
      "<p>A square matrix $A$ is <b>diagonalizable</b> if there is an invertible matrix $P$ and a diagonal matrix $D$ such that $A=PDP^{-1}$. The columns of $P$ are eigenvectors of $A$, and the matching diagonal entries of $D$ are their eigenvalues.</p>" +
      "<p>Why the formula appears: if $Ap_i=\\lambda_i p_i$ for each eigenvector column $p_i$, then $AP=PD$, because multiplying $A$ by $P$ applies $A$ to each column, while multiplying $P$ by $D$ scales each column by its eigenvalue. Since the columns form a basis, $P$ is invertible, and $AP=PD$ becomes $A=PDP^{-1}$.</p>" +
      "<p><b>Assumptions that matter:</b> $A$ must be square; $P$ must have a full basis of linearly independent eigenvectors; repeated eigenvalues may or may not provide enough eigenvectors; and distinct eigenvalues always give linearly independent eigenvectors.</p>",
    worked: {
      problem: "Diagonalize $A=\\begin{bmatrix}2 & 1 \\\\ 0 & 3\\end{bmatrix}$.",
      skills: ["eigenvalues", "eigenvectors", "change of basis"],
      strategy: "The eigenvalues are visible from the triangular matrix — find one eigenvector for each and place them as columns of $P$.",
      steps: [
        { do: "Read the eigenvalues", result: "$\\lambda=2$ and $\\lambda=3$", why: "triangular matrices have diagonal eigenvalues" },
        { do: "Form $A-2I$", result: "$\\begin{bmatrix}0 & 1 \\\\ 0 & 1\\end{bmatrix}$", why: "subtract 2 from the diagonal" },
        { do: "Solve $(A-2I)v=0$", result: "$v_1=\\begin{bmatrix}1 \\\\ 0\\end{bmatrix}$", why: "the equations force the second coordinate to be 0" },
        { do: "Form $A-3I$", result: "$\\begin{bmatrix}-1 & 1 \\\\ 0 & 0\\end{bmatrix}$", why: "subtract 3 from the diagonal" },
        { do: "Solve $(A-3I)v=0$", result: "$v_2=\\begin{bmatrix}1 \\\\ 1\\end{bmatrix}$", why: "the equation $-x+y=0$ gives $y=x$" },
        { do: "Build $P$ from eigenvectors", result: "$P=\\begin{bmatrix}1 & 1 \\\\ 0 & 1\\end{bmatrix}$", why: "eigenvectors become the new coordinate axes" },
        { do: "Build $D$ in the same order", result: "$D=\\begin{bmatrix}2 & 0 \\\\ 0 & 3\\end{bmatrix}$", why: "the diagonal entries match the columns of $P$" }
      ],
      verify: "$AP$ has columns $Av_1=2v_1$ and $Av_2=3v_2$, so $AP=PD$ and therefore $A=PDP^{-1}$.",
      answer: "$A=PDP^{-1}$ with $P=\\begin{bmatrix}1 & 1 \\\\ 0 & 1\\end{bmatrix}$ and $D=\\begin{bmatrix}2 & 0 \\\\ 0 & 3\\end{bmatrix}$.",
      connects: "Diagonalization is eigenvector coordinates: in those coordinates, the matrix only scales."
    },
    practice: [
      { problem: "Diagonalize $B=\\begin{bmatrix}4 & 0 \\\\ 0 & -1\\end{bmatrix}$.", steps: [
        { do: "Read the first eigenvalue", result: "$\\lambda=4$", why: "the first diagonal entry is an eigenvalue" },
        { do: "Choose its eigenvector", result: "$v_1=\\begin{bmatrix}1 \\\\ 0\\end{bmatrix}$", why: "the first coordinate axis is unchanged except for scaling" },
        { do: "Read the second eigenvalue", result: "$\\lambda=-1$", why: "the second diagonal entry is an eigenvalue" },
        { do: "Choose its eigenvector", result: "$v_2=\\begin{bmatrix}0 \\\\ 1\\end{bmatrix}$", why: "the second coordinate axis is scaled by $-1$" },
        { do: "Build the matrices", result: "$P=\\begin{bmatrix}1 & 0 \\\\ 0 & 1\\end{bmatrix}$, $D=\\begin{bmatrix}4 & 0 \\\\ 0 & -1\\end{bmatrix}$", why: "the matrix is already diagonal" }
      ], answer: "$B=IDI^{-1}$ with $D=B$; it is already diagonalized." },
      { problem: "Diagonalize $C=\\begin{bmatrix}1 & 1 \\\\ 1 & 1\\end{bmatrix}$.", steps: [
        { do: "Find the eigenvalue for the all-ones direction", result: "$C\\begin{bmatrix}1 \\\\ 1\\end{bmatrix}=\\begin{bmatrix}2 \\\\ 2\\end{bmatrix}$", why: "each row sums to 2" },
        { do: "Record the first pair", result: "$\\lambda_1=2$, $v_1=\\begin{bmatrix}1 \\\\ 1\\end{bmatrix}$", why: "the output is $2v_1$" },
        { do: "Find the difference direction", result: "$C\\begin{bmatrix}1 \\\\ -1\\end{bmatrix}=\\begin{bmatrix}0 \\\\ 0\\end{bmatrix}$", why: "the entries cancel in each row" },
        { do: "Record the second pair", result: "$\\lambda_2=0$, $v_2=\\begin{bmatrix}1 \\\\ -1\\end{bmatrix}$", why: "the output is $0v_2$" },
        { do: "Build $P$ and $D$", result: "$P=\\begin{bmatrix}1 & 1 \\\\ 1 & -1\\end{bmatrix}$, $D=\\begin{bmatrix}2 & 0 \\\\ 0 & 0\\end{bmatrix}$", why: "place eigenvalues in the same order as eigenvectors" }
      ], answer: "$C=PDP^{-1}$ with $P=\\begin{bmatrix}1 & 1 \\\\ 1 & -1\\end{bmatrix}$ and $D=\\begin{bmatrix}2 & 0 \\\\ 0 & 0\\end{bmatrix}$." },
      { problem: "Show that $E=\\begin{bmatrix}5 & 2 \\\\ 0 & 5\\end{bmatrix}$ is not diagonalizable.", steps: [
        { do: "Find the repeated eigenvalue", result: "$\\lambda=5$", why: "the triangular matrix has both diagonal entries equal to 5" },
        { do: "Form $E-5I$", result: "$\\begin{bmatrix}0 & 2 \\\\ 0 & 0\\end{bmatrix}$", why: "subtract 5 from the diagonal" },
        { do: "Solve $(E-5I)v=0$", result: "$2y=0$", why: "the first row gives the only equation" },
        { do: "Describe the eigenspace", result: "$v=\\begin{bmatrix}x \\\\ 0\\end{bmatrix}$", why: "$y=0$ and $x$ is free" },
        { do: "Count independent eigenvectors", result: "only one independent eigenvector", why: "the eigenspace is one-dimensional" },
        { do: "Compare with the required basis size", result: "not diagonalizable", why: "a 2 by 2 matrix needs two independent eigenvectors" }
      ], answer: "$E$ is not diagonalizable because the repeated eigenvalue provides only one independent eigenvector." },
      { problem: "Use $A=PDP^{-1}$ to compute $A^3$ when $D=\\begin{bmatrix}2 & 0 \\\\ 0 & 3\\end{bmatrix}$.", steps: [
        { do: "Write the power rule", result: "$A^3=PD^3P^{-1}$", why: "middle factors $P^{-1}P$ cancel" },
        { do: "Cube the first diagonal entry", result: "$2^3=8$", why: "powers of diagonal matrices act entry by entry" },
        { do: "Cube the second diagonal entry", result: "$3^3=27$", why: "each eigenvalue is raised to the power" },
        { do: "Write $D^3$", result: "$D^3=\\begin{bmatrix}8 & 0 \\\\ 0 & 27\\end{bmatrix}$", why: "off-diagonal entries remain zero" },
        { do: "Substitute into the formula", result: "$A^3=P\\begin{bmatrix}8 & 0 \\\\ 0 & 27\\end{bmatrix}P^{-1}$", why: "the diagonalized form makes the power simple" }
      ], answer: "$A^3=P\\begin{bmatrix}8 & 0 \\\\ 0 & 27\\end{bmatrix}P^{-1}$." },
      { problem: "A feature update has eigenvectors $v_1=\\begin{bmatrix}1 \\\\ 1\\end{bmatrix}$ and $v_2=\\begin{bmatrix}1 \\\\ -1\\end{bmatrix}$ with eigenvalues $1$ and $0.6$. If $x_0=3v_1+2v_2$, find $x_4$.", steps: [
        { do: "Apply the first eigenvalue for four steps", result: "$1^4\\cdot3v_1=3v_1$", why: "the first mode is preserved" },
        { do: "Apply the second eigenvalue for four steps", result: "$0.6^4\\cdot2v_2$", why: "the second mode shrinks each step" },
        { do: "Compute the power", result: "$0.6^4=0.1296$", why: "multiply $0.6$ four times" },
        { do: "Scale the second coefficient", result: "$2\\cdot0.1296=0.2592$", why: "the initial coefficient was 2" },
        { do: "Combine the modes", result: "$x_4=3v_1+0.2592v_2$", why: "eigenvector coordinates evolve independently" }
      ], answer: "$x_4=3\\begin{bmatrix}1 \\\\ 1\\end{bmatrix}+0.2592\\begin{bmatrix}1 \\\\ -1\\end{bmatrix}=\\begin{bmatrix}3.2592 \\\\ 2.7408\\end{bmatrix}$." }
    ],
    applications: [
      { title: "Fast matrix powers", background: "Repeated transitions appear in simulations, recurrences, and discrete-time systems. Diagonalization turns many multiplications into simple powers of eigenvalues.", numbers: "If $D=\\begin{bmatrix}0.9 & 0 \\\\ 0 & 0.5\\end{bmatrix}$, then $D^{10}=\\begin{bmatrix}0.9^{10} & 0 \\\\ 0 & 0.5^{10}\\end{bmatrix}\\approx\\begin{bmatrix}0.349 & 0 \\\\ 0 & 0.00098\\end{bmatrix}$." },
      { title: "PCA coordinate systems", background: "PCA rotates data into eigenvector directions of the covariance matrix. In that basis, covariance is diagonal, so features are uncorrelated by construction.", numbers: "If the diagonal covariance is $\\begin{bmatrix}9 & 0 \\\\ 0 & 1\\end{bmatrix}$, the first principal coordinate has standard deviation $3$ and the second has standard deviation $1$." },
      { title: "Markov-chain long-term behavior", background: "A diagonal form separates the steady distribution from decaying modes. This explains why many chains forget their initial state.", numbers: "A mode with eigenvalue $0.7$ has weight $0.7^5\\approx0.168$ after five steps, while the eigenvalue $1$ mode remains unchanged." },
      { title: "Graph spectral filters", background: "Graph signal processing diagonalizes graph operators so filters can scale low- and high-frequency graph patterns separately.", numbers: "A filter that maps eigenvalues $0,2$ to gains $1,0.2$ keeps a smooth component of size $5$ at $5$ and shrinks a rough component of size $5$ to $1$." },
      { title: "Linear differential systems", background: "Continuous-time dynamics $x'(t)=Ax(t)$ become independent exponentials after diagonalization. Each eigenvalue controls one mode.", numbers: "If $D=\\begin{bmatrix}-1 & 0 \\\\ 0 & -3\\end{bmatrix}$, then after $t=2$ the mode scales are $e^{-2}\\approx0.135$ and $e^{-6}\\approx0.00248$." },
      { title: "Embedding anisotropy correction", background: "Some representation pipelines whiten or rescale embedding directions using eigencoordinates of a covariance estimate.", numbers: "If variances along two eigenvectors are $16$ and $4$, whitening scales those coordinates by $1/4$ and $1/2$, making both output variances equal to $1$." }
    ],
    applicationsClose: "Diagonalization is the same comfort in many settings: find the right axes, then each coordinate tells its own simpler story.",
    takeaways: [
      "$A=PDP^{-1}$ means the columns of $P$ are a basis of eigenvectors.",
      "The order of eigenvectors in $P$ must match the order of eigenvalues in $D$.",
      "A matrix is diagonalizable exactly when it has enough independent eigenvectors to form a basis.",
      "Matrix powers and linear dynamics become simple in diagonal coordinates."
    ]
  },

  "math-09-21": {
    id: "math-09-21",
    title: "Similarity",
    tagline: "Similar matrices are the same linear map described in different coordinate languages.",
    connections: {
      buildsOn: ["Diagonalization", "matrix inverses", "basis changes", "The characteristic polynomial"],
      leadsTo: ["The Jordan form", "canonical forms", "spectral algorithms"],
      usedWith: ["change of basis", "trace", "determinants", "matrix representations"]
    },
    motivation:
      "<p>You already know a vector can have different coordinates in different bases. The vector itself has not changed; only the measuring grid has changed.</p>" +
      "<p>Similarity applies that idea to matrices. Two matrices can look different while representing the same linear transformation in two coordinate systems. This is why diagonalization is a special case of similarity, and why eigenvalues survive coordinate changes.</p>",
    definition:
      "<p>Square matrices $A$ and $B$ are <b>similar</b> if there is an invertible matrix $P$ such that $B=P^{-1}AP$. The matrix $P$ changes coordinates from the $B$-coordinate description to the $A$-coordinate description.</p>" +
      "<p>The characteristic polynomial is preserved by similarity: $\\det(B-\\lambda I)=\\det(P^{-1}AP-\\lambda I)=\\det(P^{-1}(A-\\lambda I)P)$. Determinants multiply, so this equals $\\det(P^{-1})\\det(A-\\lambda I)\\det(P)=\\det(A-\\lambda I)$ because $\\det(P^{-1})\\det(P)=1$.</p>" +
      "<p><b>Assumptions that matter:</b> $A$ and $B$ must be square matrices of the same size; $P$ must be invertible; similarity preserves eigenvalues, trace, determinant, rank, and characteristic polynomial; but it does not mean entries are equal or that the matrices are visually close.</p>",
    worked: {
      problem: "Let $A=\\begin{bmatrix}2 & 1 \\\\ 0 & 3\\end{bmatrix}$ and $P=\\begin{bmatrix}1 & 1 \\\\ 0 & 1\\end{bmatrix}$. Compute $B=P^{-1}AP$.",
      skills: ["matrix inverse", "matrix multiplication", "change of basis"],
      strategy: "Compute the coordinate change carefully — multiply one pair at a time and keep the order $P^{-1}AP$.",
      steps: [
        { do: "Invert $P$", result: "$P^{-1}=\\begin{bmatrix}1 & -1 \\\\ 0 & 1\\end{bmatrix}$", why: "this upper-triangular inverse undoes the shear" },
        { do: "Multiply $A$ by $P$", result: "$AP=\\begin{bmatrix}2 & 3 \\\\ 0 & 3\\end{bmatrix}$", why: "compute the right product first" },
        { do: "Multiply on the left by $P^{-1}$", result: "$P^{-1}AP=\\begin{bmatrix}2 & 0 \\\\ 0 & 3\\end{bmatrix}$", why: "the coordinate change removes the off-diagonal mixing" },
        { do: "Name the similar matrix", result: "$B=\\begin{bmatrix}2 & 0 \\\\ 0 & 3\\end{bmatrix}$", why: "this is the representation in the eigenvector basis" },
        { do: "Compare eigenvalues", result: "$2$ and $3$ in both matrices", why: "similarity preserves the characteristic polynomial" }
      ],
      verify: "The trace stays $5$ and determinant stays $6$, so the diagonal result keeps the basic invariants of $A$.",
      answer: "$P^{-1}AP=\\begin{bmatrix}2 & 0 \\\\ 0 & 3\\end{bmatrix}$, so $A$ is similar to this diagonal matrix.",
      connects: "Similarity explains diagonalization as a change of coordinate language, not a change of the underlying map."
    },
    practice: [
      { problem: "For $A=\\begin{bmatrix}3 & 0 \\\\ 0 & 1\\end{bmatrix}$ and $P=\\begin{bmatrix}1 & 1 \\\\ 0 & 1\\end{bmatrix}$, compute $B=P^{-1}AP$.", steps: [
        { do: "Write $P^{-1}$", result: "$\\begin{bmatrix}1 & -1 \\\\ 0 & 1\\end{bmatrix}$", why: "the inverse of this shear changes the sign above the diagonal" },
        { do: "Compute $AP$", result: "$\\begin{bmatrix}3 & 3 \\\\ 0 & 1\\end{bmatrix}$", why: "multiply $A$ by each column of $P$" },
        { do: "Compute $P^{-1}(AP)$", result: "$\\begin{bmatrix}3 & 2 \\\\ 0 & 1\\end{bmatrix}$", why: "left multiplication changes the coordinate rows" },
        { do: "State the similar matrix", result: "$B=\\begin{bmatrix}3 & 2 \\\\ 0 & 1\\end{bmatrix}$", why: "this equals $P^{-1}AP$" },
        { do: "Check the trace", result: "$3+1=4$ for both", why: "similar matrices preserve trace" }
      ], answer: "$B=\\begin{bmatrix}3 & 2 \\\\ 0 & 1\\end{bmatrix}$." },
      { problem: "Show that $A=\\begin{bmatrix}2 & 1 \\\\ 0 & 3\\end{bmatrix}$ and $D=\\begin{bmatrix}2 & 0 \\\\ 0 & 3\\end{bmatrix}$ have the same characteristic polynomial.", steps: [
        { do: "Compute $p_A(\\lambda)$", result: "$(2-\\lambda)(3-\\lambda)$", why: "$A-\\lambda I$ is triangular" },
        { do: "Compute $p_D(\\lambda)$", result: "$(2-\\lambda)(3-\\lambda)$", why: "$D-\\lambda I$ is diagonal" },
        { do: "Compare the polynomials", result: "$p_A(\\lambda)=p_D(\\lambda)$", why: "the formulas match exactly" },
        { do: "Read the roots", result: "$\\lambda=2$ and $\\lambda=3$", why: "equal polynomials have equal roots" },
        { do: "Interpret", result: "the matrices can be similar", why: "matching characteristic roots are necessary for similarity" }
      ], answer: "Both characteristic polynomials are $(2-\\lambda)(3-\\lambda)$, so both have eigenvalues $2$ and $3$." },
      { problem: "Use invariants to decide whether $A=\\begin{bmatrix}1 & 0 \\\\ 0 & 4\\end{bmatrix}$ can be similar to $B=\\begin{bmatrix}2 & 0 \\\\ 0 & 3\\end{bmatrix}$.", steps: [
        { do: "Compute the trace of $A$", result: "$1+4=5$", why: "trace is the sum of diagonal entries" },
        { do: "Compute the trace of $B$", result: "$2+3=5$", why: "the traces agree so far" },
        { do: "Compute the determinant of $A$", result: "$1\\cdot4=4$", why: "diagonal determinant is the product of diagonal entries" },
        { do: "Compute the determinant of $B$", result: "$2\\cdot3=6$", why: "again use the diagonal determinant" },
        { do: "Compare determinants", result: "$4\\ne6$", why: "similar matrices must have equal determinants" }
      ], answer: "They are not similar because their determinants differ." },
      { problem: "If $B=P^{-1}AP$ and $A^2-5A+6I=0$, show that $B^2-5B+6I=0$.", steps: [
        { do: "Square $B$", result: "$B^2=(P^{-1}AP)(P^{-1}AP)$", why: "substitute the similarity formula" },
        { do: "Cancel the middle factors", result: "$B^2=P^{-1}A^2P$", why: "$PP^{-1}=I$ in the middle" },
        { do: "Substitute into the polynomial", result: "$B^2-5B+6I=P^{-1}A^2P-5P^{-1}AP+6I$", why: "replace $B^2$ and $B$" },
        { do: "Rewrite the identity term", result: "$6I=6P^{-1}IP$", why: "$P^{-1}IP=I$" },
        { do: "Factor the similarity", result: "$P^{-1}(A^2-5A+6I)P$", why: "each term now has $P^{-1}$ on the left and $P$ on the right" },
        { do: "Use the assumption", result: "$P^{-1}0P=0$", why: "$A^2-5A+6I=0$" }
      ], answer: "$B^2-5B+6I=0$ as well." },
      { problem: "A diagonal matrix $D=\\begin{bmatrix}1 & 0 \\\\ 0 & 0.7\\end{bmatrix}$ is similar to an update matrix $A$. If a state in $D$-coordinates is $y_0=\\begin{bmatrix}4 \\\\ 10\\end{bmatrix}$, find $y_3$.", steps: [
        { do: "Write the diagonal-coordinate update", result: "$y_3=D^3y_0$", why: "similarity lets us work in the easier coordinates" },
        { do: "Compute the first diagonal power", result: "$1^3=1$", why: "the first mode is steady" },
        { do: "Compute the second diagonal power", result: "$0.7^3=0.343$", why: "the second mode decays each step" },
        { do: "Apply $D^3$ to $y_0$", result: "$\\begin{bmatrix}1 & 0 \\\\ 0 & 0.343\\end{bmatrix}\\begin{bmatrix}4 \\\\ 10\\end{bmatrix}$", why: "scale each coordinate independently" },
        { do: "Multiply the coordinates", result: "$y_3=\\begin{bmatrix}4 \\\\ 3.43\\end{bmatrix}$", why: "$0.343\\cdot10=3.43$" }
      ], answer: "In the similar diagonal coordinates, $y_3=\\begin{bmatrix}4 \\\\ 3.43\\end{bmatrix}$." }
    ],
    applications: [
      { title: "Coordinate changes in graphics", background: "Graphics pipelines describe the same geometric transformation in object, world, camera, and screen coordinates. Similarity is the matrix version of changing that coordinate language.", numbers: "If a scale has diagonal form $D=\\begin{bmatrix}2 & 0 \\\\ 0 & 1\\end{bmatrix}$ in object axes, a basis change $P$ gives world representation $PDP^{-1}$ with the same determinant $2$." },
      { title: "Diagonalization as similarity", background: "When an eigenvector basis exists, diagonalization is just choosing coordinates where the transformation is easiest to read.", numbers: "$A=\\begin{bmatrix}2 & 1 \\\\ 0 & 3\\end{bmatrix}$ is similar to $D=\\begin{bmatrix}2 & 0 \\\\ 0 & 3\\end{bmatrix}$, and both have trace $5$ and determinant $6$." },
      { title: "Numerical algorithms", background: "Algorithms often transform a matrix to a similar Hessenberg, triangular, or Schur form to make eigenvalue computation more stable.", numbers: "A similarity step preserves $p_A(\\lambda)$, so a matrix with determinant $12$ and trace $7$ keeps determinant $12$ and trace $7$ after the step." },
      { title: "State-space models", background: "Control systems can use different state coordinates for the same physical system. Similar matrices represent the same dynamics under different state variables.", numbers: "A mode with eigenvalue $0.95$ remains $0.95$ after any invertible state reparameterization, so its ten-step decay remains $0.95^{10}\\approx0.599$." },
      { title: "Feature whitening", background: "Whitening changes feature coordinates so covariance becomes diagonal or identity-like. The underlying linear structure is easier to read after the coordinate change.", numbers: "If covariance eigenvalues are $9$ and $4$, rescaling eigencoordinates by $1/3$ and $1/2$ gives variances $1$ and $1$." },
      { title: "Graph embeddings", background: "Graph operators may be represented in node coordinates or spectral coordinates. Similarity-like basis changes preserve the operator's eigenvalue information.", numbers: "If a graph filter has spectral gains $1$ and $0.25$, a component of size $8$ in the second spectral coordinate becomes $2$ after filtering." }
    ],
    applicationsClose: "Similarity keeps the transformation fixed while changing the coordinate story, so invariants become the things you can trust.",
    takeaways: [
      "Similar matrices satisfy $B=P^{-1}AP$ for some invertible $P$.",
      "Similarity represents a change of basis, not a change of the underlying linear map.",
      "Characteristic polynomial, eigenvalues, trace, determinant, and rank are preserved.",
      "Diagonalization is the special case where a matrix is similar to a diagonal matrix."
    ]
  },

  "math-09-22": {
    id: "math-09-22",
    title: "The Jordan form",
    tagline: "Jordan form is what remains when a matrix is almost diagonal but not quite.",
    connections: {
      buildsOn: ["Similarity", "Diagonalization", "eigenvectors", "null spaces"],
      leadsTo: ["matrix functions", "linear dynamical systems", "generalized eigenvectors"],
      usedWith: ["similarity", "nilpotent matrices", "matrix powers", "canonical forms"]
    },
    motivation:
      "<p>You already know the happy case: enough eigenvectors give a diagonal matrix in the right coordinates. But some matrices refuse to provide a full eigenvector basis.</p>" +
      "<p>Jordan form is the honest backup plan. It says a matrix can still be organized into nearly diagonal blocks. Each block has one eigenvalue on the diagonal and small ones just above it, recording the missing eigenvectors and the extra polynomial behavior they create.</p>",
    definition:
      "<p>A <b>Jordan block</b> of size $k$ for eigenvalue $\\lambda$ is $J_k(\\lambda)=\\begin{bmatrix}\\lambda & 1 & 0 \\\\ 0 & \\lambda & 1 \\\\ 0 & 0 & \\lambda\\end{bmatrix}$ in the $k=3$ case, with the same pattern for other sizes. A Jordan form is a block diagonal matrix made from such blocks.</p>" +
      "<p>The reason it appears is generalized eigenvectors. If $A$ has too few ordinary eigenvectors for an eigenvalue, we build chains such as $(A-\\lambda I)v_1=0$ and $(A-\\lambda I)v_2=v_1$. In that chain basis, $A$ acts like $\\lambda$ times the identity plus a shift along the chain, which creates the ones above the diagonal.</p>" +
      "<p><b>Assumptions that matter:</b> exact Jordan form is normally stated over the complex numbers; numerical software often uses Schur form instead because Jordan form is sensitive to perturbations; diagonal matrices are Jordan forms with only size-one blocks; and a matrix is diagonalizable exactly when every Jordan block has size $1$.</p>",
    worked: {
      problem: "Find a Jordan form for $A=\\begin{bmatrix}5 & 2 \\\\ 0 & 5\\end{bmatrix}$.",
      skills: ["repeated eigenvalues", "eigenspace dimension", "Jordan blocks"],
      strategy: "The repeated eigenvalue is not enough — count eigenvectors to decide whether the block splits or stays size 2.",
      steps: [
        { do: "Read the eigenvalue", result: "$\\lambda=5$ with algebraic multiplicity $2$", why: "the triangular matrix has both diagonal entries equal to 5" },
        { do: "Form $A-5I$", result: "$\\begin{bmatrix}0 & 2 \\\\ 0 & 0\\end{bmatrix}$", why: "subtract the eigenvalue from the diagonal" },
        { do: "Solve $(A-5I)v=0$", result: "$2y=0$", why: "the first row gives the only constraint" },
        { do: "Describe the eigenspace", result: "$v=\\begin{bmatrix}x \\\\ 0\\end{bmatrix}$", why: "$x$ is free and $y=0$" },
        { do: "Count ordinary eigenvectors", result: "one independent eigenvector", why: "the eigenspace is one-dimensional" },
        { do: "Choose the Jordan block size", result: "$J=\\begin{bmatrix}5 & 1 \\\\ 0 & 5\\end{bmatrix}$", why: "one eigenvector for a double root gives one size-2 block" }
      ],
      verify: "The trace of $J$ is $10$ and determinant is $25$, matching $A$; the single block records that $A$ is not diagonalizable.",
      answer: "A Jordan form is $J=\\begin{bmatrix}5 & 1 \\\\ 0 & 5\\end{bmatrix}$.",
      connects: "Jordan form preserves the eigenvalue while recording the missing eigenvector with the superdiagonal $1$."
    },
    practice: [
      { problem: "Give the Jordan form of $B=\\begin{bmatrix}4 & 0 \\\\ 0 & 4\\end{bmatrix}$.", steps: [
        { do: "Read the repeated eigenvalue", result: "$\\lambda=4$ with multiplicity $2$", why: "both diagonal entries are 4" },
        { do: "Form $B-4I$", result: "$\\begin{bmatrix}0 & 0 \\\\ 0 & 0\\end{bmatrix}$", why: "subtracting 4 removes the diagonal" },
        { do: "Find the eigenspace", result: "all vectors in $\\mathbb{R}^2$", why: "the zero matrix imposes no constraints" },
        { do: "Count eigenvectors", result: "two independent eigenvectors", why: "the eigenspace has dimension 2" },
        { do: "Choose Jordan blocks", result: "$\\begin{bmatrix}4 & 0 \\\\ 0 & 4\\end{bmatrix}$", why: "two eigenvectors give two size-one blocks" }
      ], answer: "The Jordan form is $\\begin{bmatrix}4 & 0 \\\\ 0 & 4\\end{bmatrix}$, already diagonal." },
      { problem: "Give the Jordan form of $C=\\begin{bmatrix}2 & 1 \\\\ 0 & 2\\end{bmatrix}$.", steps: [
        { do: "Read the eigenvalue", result: "$\\lambda=2$ with multiplicity $2$", why: "the matrix is triangular" },
        { do: "Form $C-2I$", result: "$\\begin{bmatrix}0 & 1 \\\\ 0 & 0\\end{bmatrix}$", why: "subtract 2 from the diagonal" },
        { do: "Solve the eigenvector equation", result: "$y=0$", why: "the first row gives the constraint" },
        { do: "Count eigenspace dimension", result: "one", why: "vectors have the form $\\begin{bmatrix}x \\\\ 0\\end{bmatrix}$" },
        { do: "Select the block", result: "$J=\\begin{bmatrix}2 & 1 \\\\ 0 & 2\\end{bmatrix}$", why: "one eigenvector for a double root gives one size-2 block" }
      ], answer: "The Jordan form is $J=\\begin{bmatrix}2 & 1 \\\\ 0 & 2\\end{bmatrix}$." },
      { problem: "For $D=\\begin{bmatrix}3 & 0 & 0 \\\\ 0 & 3 & 1 \\\\ 0 & 0 & 3\\end{bmatrix}$, identify the Jordan blocks.", steps: [
        { do: "Read the diagonal", result: "$\\lambda=3$ with multiplicity $3$", why: "all diagonal entries are 3" },
        { do: "Inspect the first coordinate", result: "a size-one block $[3]$", why: "the first row and column are separated from the others" },
        { do: "Inspect the lower-right part", result: "$\\begin{bmatrix}3 & 1 \\\\ 0 & 3\\end{bmatrix}$", why: "the superdiagonal 1 links two coordinates" },
        { do: "Name the second block", result: "a size-two block $J_2(3)$", why: "it has 3 on the diagonal and 1 above" },
        { do: "Write the block structure", result: "$[3]\\oplus J_2(3)$", why: "block diagonal pieces are combined by direct sum" }
      ], answer: "The Jordan blocks are one size-one block $[3]$ and one size-two block $J_2(3)$." },
      { problem: "Compute $J^3$ for $J=\\begin{bmatrix}2 & 1 \\\\ 0 & 2\\end{bmatrix}$ using $J=2I+N$ with $N=\\begin{bmatrix}0 & 1 \\\\ 0 & 0\\end{bmatrix}$.", steps: [
        { do: "Note the nilpotent square", result: "$N^2=0$", why: "the single superdiagonal shift cannot be applied twice in a 2 by 2 block" },
        { do: "Expand $(2I+N)^3$", result: "$8I+12N+6N^2+N^3$", why: "use the binomial theorem since $I$ and $N$ commute" },
        { do: "Remove zero terms", result: "$8I+12N$", why: "$N^2=0$ makes higher powers zero" },
        { do: "Write $8I$", result: "$\\begin{bmatrix}8 & 0 \\\\ 0 & 8\\end{bmatrix}$", why: "scale the identity by 8" },
        { do: "Write $12N$", result: "$\\begin{bmatrix}0 & 12 \\\\ 0 & 0\\end{bmatrix}$", why: "scale the nilpotent part by 12" },
        { do: "Add the matrices", result: "$J^3=\\begin{bmatrix}8 & 12 \\\\ 0 & 8\\end{bmatrix}$", why: "combine diagonal and superdiagonal parts" }
      ], answer: "$J^3=\\begin{bmatrix}8 & 12 \\\\ 0 & 8\\end{bmatrix}$." },
      { problem: "A defective update has Jordan block $J=\\begin{bmatrix}0.9 & 1 \\\\ 0 & 0.9\\end{bmatrix}$. Estimate $J^5$ using $J=0.9I+N$ and $N^2=0$.", steps: [
        { do: "Use the binomial form", result: "$J^5=0.9^5I+5\\cdot0.9^4N$", why: "only the $N^0$ and $N^1$ terms survive" },
        { do: "Compute the diagonal scale", result: "$0.9^5=0.59049$", why: "multiply $0.9$ five times" },
        { do: "Compute the superdiagonal coefficient", result: "$5\\cdot0.9^4=5\\cdot0.6561=3.2805$", why: "the chain contribution has an extra factor of the step count" },
        { do: "Place the coefficients", result: "$\\begin{bmatrix}0.59049 & 3.2805 \\\\ 0 & 0.59049\\end{bmatrix}$", why: "the identity fills the diagonal and $N$ fills the superdiagonal" },
        { do: "Interpret the growth", result: "decay with a temporary polynomial boost", why: "the $5$ factor can amplify before the $0.9^k$ decay dominates" }
      ], answer: "$J^5\\approx\\begin{bmatrix}0.59049 & 3.2805 \\\\ 0 & 0.59049\\end{bmatrix}$." }
    ],
    applications: [
      { title: "Defective dynamical systems", background: "Some repeated updates have too few eigenvectors, so diagonalization misses a transient term. Jordan form shows the polynomial factor multiplying the usual exponential behavior.", numbers: "For $J=\\begin{bmatrix}0.8 & 1 \\\\ 0 & 0.8\\end{bmatrix}$, $J^4=\\begin{bmatrix}0.4096 & 2.048 \\\\ 0 & 0.4096\\end{bmatrix}$ because $4\\cdot0.8^3=2.048$." },
      { title: "Matrix exponentials", background: "Linear differential equations use $e^{At}$. A Jordan block makes the exponential include both $e^{\\lambda t}$ and polynomial factors in $t$.", numbers: "For $J=\\begin{bmatrix}-2 & 1 \\\\ 0 & -2\\end{bmatrix}$, $e^{Jt}=e^{-2t}\\begin{bmatrix}1 & t \\\\ 0 & 1\\end{bmatrix}$, so at $t=1$ the scale is $e^{-2}\\approx0.135$." },
      { title: "Sensitivity of eigen-computations", background: "Jordan form is mathematically clean but numerically fragile. Tiny perturbations can split a repeated eigenvalue, which is why software prefers more stable decompositions.", numbers: "$\\begin{bmatrix}1 & 1 \\\\ 0 & 1\\end{bmatrix}$ has repeated eigenvalue $1$, but changing the lower-left entry to $0.0001$ gives approximate eigenvalues $1.01$ and $0.99$." },
      { title: "Optimization momentum near degeneracy", background: "Linearized training dynamics can have nearly defective blocks. Jordan-style thinking explains why a decaying mode may still create a temporary surge.", numbers: "A block with eigenvalue $0.95$ has superdiagonal coefficient $10\\cdot0.95^9\\approx6.30$ in the tenth power, even though the diagonal scale is $0.95^{10}\\approx0.599$." },
      { title: "Controllability and state chains", background: "Control theory uses chains of generalized eigenvectors to understand how inputs move through state variables. Jordan blocks reveal linked state directions.", numbers: "In $J=\\begin{bmatrix}3 & 1 \\\\ 0 & 3\\end{bmatrix}$, the second coordinate contributes to the first after one multiplication because $J\\begin{bmatrix}0 \\\\ 1\\end{bmatrix}=\\begin{bmatrix}1 \\\\ 3\\end{bmatrix}$." },
      { title: "Polynomial features of repeated roots", background: "Repeated roots in linear recurrences create terms like $k\\lambda^k$, not just $\\lambda^k$. Jordan blocks are the matrix reason for that extra factor.", numbers: "For a repeated root $0.5$ with one size-two block, the extra term at $k=6$ is $6\\cdot0.5^6=0.09375$." }
    ],
    applicationsClose: "Jordan form teaches one final linear-algebra lesson: even when diagonal simplicity fails, the remaining structure is still organized and computable.",
    takeaways: [
      "A Jordan block has one eigenvalue on the diagonal and ones just above the diagonal.",
      "Diagonal matrices are Jordan forms whose blocks all have size $1$.",
      "A size-larger-than-one block records missing ordinary eigenvectors and uses generalized eigenvectors instead.",
      "Powers and exponentials of Jordan blocks include polynomial factors as well as eigenvalue powers."
    ]
  }
};
