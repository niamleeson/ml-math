module.exports = {
  "math-09-27": {
    id: "math-09-27",
    title: "QR factorization",
    tagline: "QR factorization turns columns into perpendicular directions, so projection problems become calm triangular algebra.",
    connections: { buildsOn: ["orthogonality", "matrix multiplication", "linear independence"], leadsTo: ["Least squares", "The Spectral Theorem", "Singular Value Decomposition (SVD)"], usedWith: ["Gram-Schmidt", "orthogonal projections", "triangular systems"] },
    motivation: "<p>You already know that perpendicular axes make geometry easier: a shadow on the $x$-axis does not interfere with a shadow on the $y$-axis. Matrices become easier for the same reason.</p><p><b>QR factorization</b> rewrites a matrix as an orthonormal part $Q$ and an upper-triangular part $R$. It is one of linear algebra's best housekeeping tools: first straighten the directions, then solve with a triangle.</p>",
    definition: "<p>For a matrix $A$ with linearly independent columns, a <b>QR factorization</b> is $A=QR$, where the columns of $Q$ are orthonormal, so $Q^TQ=I$, and $R$ is upper triangular. If $A$ is $m\\times n$ with $m\\ge n$, the thin form has $Q$ of size $m\\times n$ and $R$ of size $n\\times n$.</p><p>Why it works: Gram-Schmidt builds $q_1,q_2,\\ldots$ by subtracting from each new column its projections onto the earlier $q$ directions, then normalizing. The coefficients of those projections become entries of $R$, so each original column is reconstructed from the orthonormal columns of $Q$.</p><p><b>Assumptions that matter:</b> the basic thin QR described here needs independent columns so no zero vector appears during normalization; $Q^TQ=I$ does not mean $QQ^T=I$ unless $Q$ is square; and signs of columns can differ while still giving a valid QR.</p>",
    worked: {
      problem: "Find a thin QR factorization of $A=\\begin{bmatrix}1&1\\\\1&0\\\\0&1\\end{bmatrix}$.",
      skills: ["Gram-Schmidt", "normalization", "upper-triangular coefficients"],
      strategy: "The columns are not perpendicular — make orthonormal columns first, then record how the originals are rebuilt.",
      steps: [
        { do: "Name the columns", result: "$a_1=(1,1,0)^T$, $a_2=(1,0,1)^T$", why: "QR works column by column" },
        { do: "Compute the first length", result: "$\\|a_1\\|=\\sqrt2$", why: "$1^2+1^2+0^2=2$" },
        { do: "Normalize the first column", result: "$q_1=\\dfrac1{\\sqrt2}(1,1,0)^T$", why: "orthonormal columns must have length 1" },
        { do: "Project $a_2$ onto $q_1$", result: "$r_{12}=q_1^Ta_2=\\dfrac1{\\sqrt2}$", why: "this is the amount of $a_2$ in the $q_1$ direction" },
        { do: "Subtract the projection", result: "$u_2=a_2-r_{12}q_1=(\\tfrac12,-\\tfrac12,1)^T$", why: "remove the part parallel to $q_1$" },
        { do: "Compute the new length", result: "$r_{22}=\\|u_2\\|=\\sqrt{\\tfrac32}$", why: "$1/4+1/4+1=3/2$" },
        { do: "Normalize the second column", result: "$q_2=(1,-1,2)^T/\\sqrt6$", why: "divide $u_2$ by $\\sqrt{3/2}$" },
        { do: "Write $R$", result: "$R=\\begin{bmatrix}\\sqrt2&1/\\sqrt2\\\\0&\\sqrt{3/2}\\end{bmatrix}$", why: "diagonal lengths and projection coefficients fill the upper triangle" }
      ],
      verify: "$q_1^Tq_2=(1-1+0)/\\sqrt{12}=0$, and $Q R$ reconstructs both columns of $A$.",
      answer: "$Q=\\begin{bmatrix}1/\\sqrt2&1/\\sqrt6\\\\1/\\sqrt2&-1/\\sqrt6\\\\0&2/\\sqrt6\\end{bmatrix}$ and $R=\\begin{bmatrix}\\sqrt2&1/\\sqrt2\\\\0&\\sqrt{3/2}\\end{bmatrix}$.",
      connects: "QR is orthogonalization plus a triangular memory of what was subtracted."
    },
    practice: [
      { problem: "Find the QR factorization of $A=\\begin{bmatrix}3&0\\\\4&5\\end{bmatrix}$.", steps: [
        { do: "Name the first column", result: "$a_1=(3,4)^T$", why: "start Gram-Schmidt" },
        { do: "Compute its length", result: "$r_{11}=5$", why: "$3^2+4^2=25$" },
        { do: "Normalize", result: "$q_1=(3/5,4/5)^T$", why: "divide by 5" },
        { do: "Project $a_2=(0,5)^T$ onto $q_1$", result: "$r_{12}=4$", why: "$0\\cdot3/5+5\\cdot4/5=4$" },
        { do: "Subtract the projection", result: "$u_2=a_2-4q_1=(-12/5,9/5)^T$", why: "make the second direction perpendicular" },
        { do: "Normalize $u_2$", result: "$q_2=(-4/5,3/5)^T$", why: "$\\|u_2\\|=3$" }
      ], answer: "$Q=\\begin{bmatrix}3/5&-4/5\\\\4/5&3/5\\end{bmatrix}$, $R=\\begin{bmatrix}5&4\\\\0&3\\end{bmatrix}$." },
      { problem: "For $q_1=(1,0,0)^T$ and $a_2=(2,3,0)^T$, compute the Gram-Schmidt residual and normalized $q_2$.", steps: [
        { do: "Compute the projection coefficient", result: "$q_1^Ta_2=2$", why: "dot with the unit direction" },
        { do: "Form the projection", result: "$2q_1=(2,0,0)^T$", why: "scale the unit vector" },
        { do: "Subtract it", result: "$u_2=(0,3,0)^T$", why: "remove the parallel part" },
        { do: "Compute the length", result: "$\\|u_2\\|=3$", why: "only the middle coordinate is nonzero" },
        { do: "Normalize", result: "$q_2=(0,1,0)^T$", why: "divide by 3" }
      ], answer: "$u_2=(0,3,0)^T$ and $q_2=(0,1,0)^T$." },
      { problem: "Given $Q=\\begin{bmatrix}1/\\sqrt2&1/\\sqrt2\\\\1/\\sqrt2&-1/\\sqrt2\\end{bmatrix}$ and $R=\\begin{bmatrix}4&2\\\\0&6\\end{bmatrix}$, compute $A=QR$.", steps: [
        { do: "Multiply for the first column", result: "$4q_1=(2\\sqrt2,2\\sqrt2)^T$", why: "the first column of $R$ is $(4,0)^T$" },
        { do: "Multiply for the second column", result: "$2q_1+6q_2$", why: "use the second column of $R$" },
        { do: "Compute the top entry", result: "$2/\\sqrt2+6/\\sqrt2=4\\sqrt2$", why: "add top components" },
        { do: "Compute the bottom entry", result: "$2/\\sqrt2-6/\\sqrt2=-2\\sqrt2$", why: "add bottom components" },
        { do: "Assemble the matrix", result: "$A=\\begin{bmatrix}2\\sqrt2&4\\sqrt2\\\\2\\sqrt2&-2\\sqrt2\\end{bmatrix}$", why: "place the two computed columns" }
      ], answer: "$A=\\begin{bmatrix}2\\sqrt2&4\\sqrt2\\\\2\\sqrt2&-2\\sqrt2\\end{bmatrix}$." },
      { problem: "Use QR to solve $Rx=Q^Tb$ with $R=\\begin{bmatrix}2&1\\\\0&3\\end{bmatrix}$ and $Q^Tb=(5,6)^T$.", steps: [
        { do: "Write the triangular system", result: "$2x_1+x_2=5$, $3x_2=6$", why: "$R$ is upper triangular" },
        { do: "Solve the second equation", result: "$x_2=2$", why: "back substitution starts at the bottom" },
        { do: "Substitute into the first equation", result: "$2x_1+2=5$", why: "use the known second variable" },
        { do: "Subtract 2", result: "$2x_1=3$", why: "isolate the first term" },
        { do: "Divide by 2", result: "$x_1=3/2$", why: "finish back substitution" }
      ], answer: "$x=(3/2,2)^T$." },
      { problem: "A data matrix has columns $a_1=(1,1,1)^T$ and $a_2=(1,2,3)^T$. Find the orthogonal residual after removing the $a_1$ direction from $a_2$.", steps: [
        { do: "Compute $a_1^Ta_1$", result: "$3$", why: "projection onto a nonunit vector needs this denominator" },
        { do: "Compute $a_1^Ta_2$", result: "$6$", why: "$1+2+3=6$" },
        { do: "Find the projection coefficient", result: "$6/3=2$", why: "scale of $a_1$ inside $a_2$" },
        { do: "Subtract the projection", result: "$u_2=a_2-2a_1=(-1,0,1)^T$", why: "remove the mean direction" },
        { do: "Check orthogonality", result: "$a_1^Tu_2=0$", why: "$-1+0+1=0$" }
      ], answer: "The residual direction is $(-1,0,1)^T$, orthogonal to $(1,1,1)^T$." }
    ],
    applications: [
      { title: "Least-squares regression", background: "QR is a numerically stable way to solve tall regression systems without forming $A^TA$ directly.", numbers: "If $R=\\begin{bmatrix}10&2\\\\0&3\\end{bmatrix}$ and $Q^Ty=(14,6)^T$, back substitution gives $x_2=2$, then $10x_1+4=14$, so $x_1=1$." },
      { title: "Feature orthogonalization", background: "Correlated features make coefficients hard to interpret. QR separates new information from what earlier features already explain.", numbers: "For $a_1=(1,1,1)$ and $a_2=(1,2,3)$, the residual $(-1,0,1)$ has dot product $0$ with $a_1$." },
      { title: "Eigenvalue algorithms", background: "The classic QR algorithm repeatedly factors a matrix and reverses the factors to reveal eigenvalues.", numbers: "A diagonal matrix $\\operatorname{diag}(5,2)$ already has $Q=I$, $R=A$, so one QR step keeps diagonal entries $5$ and $2$." },
      { title: "Streaming sensor bases", background: "When new sensor channels arrive, Gram-Schmidt can keep only the part not explained by older channels.", numbers: "If a new channel $(2,3,0)$ follows basis $(1,0,0)$, the retained novelty is $(0,3,0)$." },
      { title: "Solving rotations separately from scales", background: "In graphics and robotics, orthogonal matrices preserve lengths while triangular matrices encode shear and scale.", numbers: "A vector length $5$ stays length $5$ after multiplying by square $Q$ because $\\|Qv\\|^2=v^TQ^TQv=v^Tv$." },
      { title: "Avoiding squared condition numbers", background: "Normal equations use $A^TA$, which can magnify numerical sensitivity. QR avoids that square in many solvers.", numbers: "If $\\kappa(A)=100$, then $\\kappa(A^TA)=10000$ for full-rank $A$, a much harsher solve." }
    ],
    applicationsClose: "QR's shared gift is clean geometry before computation: perpendicular columns first, triangular arithmetic second.",
    takeaways: ["QR writes $A=QR$ with orthonormal columns in $Q$ and upper-triangular $R$.", "Gram-Schmidt subtracts projections and normalizes what remains.", "Thin QR is especially useful for tall matrices with independent columns.", "Least squares, eigenvalue methods, and stable numerical linear algebra rely on QR."]
  },

  "math-09-28": {
    id: "math-09-28",
    title: "The Spectral Theorem",
    tagline: "Symmetric matrices are the friendly ones: they can be understood completely through perpendicular eigen-directions.",
    connections: { buildsOn: ["eigenvalues and eigenvectors", "orthogonality", "matrix transpose"], leadsTo: ["Positive-definite matrices", "Quadratic forms", "Principal Component Analysis (PCA)"], usedWith: ["orthogonal diagonalization", "projections", "symmetric matrices"] },
    motivation: "<p>You already know a diagonal matrix is easy: it stretches each coordinate axis separately. The hard question is when a non-diagonal matrix is secretly just that simple in a rotated coordinate system.</p><p>The <b>Spectral Theorem</b> says symmetric real matrices have exactly this kindness. They have real eigenvalues, perpendicular eigenvectors, and an orthonormal basis that turns the matrix into pure axis-by-axis scaling.</p>",
    definition: "<p>If $A$ is a real symmetric matrix, meaning $A^T=A$, then there is an orthogonal matrix $Q$ and a real diagonal matrix $\\Lambda$ such that $$A=Q\\Lambda Q^T.$$ The columns of $Q$ are orthonormal eigenvectors of $A$, and the diagonal entries of $\\Lambda$ are the corresponding eigenvalues.</p><p>The key reason is symmetry: for eigenvectors $u$ and $v$ with eigenvalues $\\lambda$ and $\\mu$, $u^TAv=(Au)^Tv$ gives $\\mu u^Tv=\\lambda u^Tv$. If $\\lambda\\ne\\mu$, then $(\\mu-\\lambda)u^Tv=0$, so $u$ and $v$ are orthogonal. The full theorem also guarantees enough eigenvectors to form a basis.</p><p><b>Assumptions that matter:</b> this statement is for real symmetric matrices; non-symmetric matrices may have complex eigenvalues or too few eigenvectors; and $Q^T=Q^{-1}$ because $Q$ is orthogonal.</p>",
    worked: {
      problem: "Diagonalize $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$ using the Spectral Theorem.",
      skills: ["eigenvalues", "orthonormal eigenvectors", "orthogonal diagonalization"],
      strategy: "Symmetry promises perpendicular eigenvectors — find them, normalize them, and place the eigenvalues on the diagonal.",
      steps: [
        { do: "Compute the characteristic determinant", result: "$(2-\\lambda)^2-1$", why: "eigenvalues solve $\\det(A-\\lambda I)=0$" },
        { do: "Set it equal to zero", result: "$(2-\\lambda)^2=1$", why: "zero determinant means a nonzero eigenvector exists" },
        { do: "Solve for eigenvalues", result: "$\\lambda=3$ and $\\lambda=1$", why: "$2-\\lambda=\\pm1$" },
        { do: "Find an eigenvector for $\\lambda=3$", result: "$(1,1)^T$", why: "$A(1,1)^T=3(1,1)^T$" },
        { do: "Find an eigenvector for $\\lambda=1$", result: "$(1,-1)^T$", why: "$A(1,-1)^T=(1,-1)^T$" },
        { do: "Normalize both eigenvectors", result: "$q_1=(1,1)^T/\\sqrt2$, $q_2=(1,-1)^T/\\sqrt2$", why: "orthogonal diagonalization uses unit columns" },
        { do: "Assemble $Q$ and $\\Lambda$", result: "$Q=\\begin{bmatrix}1/\\sqrt2&1/\\sqrt2\\\\1/\\sqrt2&-1/\\sqrt2\\end{bmatrix}$, $\\Lambda=\\begin{bmatrix}3&0\\\\0&1\\end{bmatrix}$", why: "match columns with diagonal entries" }
      ],
      verify: "$Q\\Lambda Q^T$ multiplies back to $\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$.",
      answer: "$A=Q\\Lambda Q^T$ with the $Q$ and $\\Lambda$ above.",
      connects: "The matrix is just stretch by $3$ and $1$ in a rotated orthonormal basis."
    },
    practice: [
      { problem: "Diagonalize $A=\\begin{bmatrix}4&0\\\\0&7\\end{bmatrix}$.", steps: [
        { do: "Read the first eigenvalue", result: "$\\lambda_1=4$", why: "diagonal matrices scale $e_1$ by the first diagonal entry" },
        { do: "Read the second eigenvalue", result: "$\\lambda_2=7$", why: "diagonal matrices scale $e_2$ by the second diagonal entry" },
        { do: "Choose eigenvectors", result: "$e_1=(1,0)^T$, $e_2=(0,1)^T$", why: "standard axes are already eigenvectors" },
        { do: "Assemble $Q$", result: "$Q=I$", why: "the eigenvectors are already orthonormal" },
        { do: "Assemble $\\Lambda$", result: "$\\Lambda=A$", why: "the matrix is already diagonal" }
      ], answer: "$A=I\\,A\\,I^T$, with eigenvalues $4$ and $7$." },
      { problem: "For $A=\\begin{bmatrix}5&2\\\\2&5\\end{bmatrix}$, find the eigenvalues using the same pattern as the worked example.", steps: [
        { do: "Write the determinant", result: "$(5-\\lambda)^2-4$", why: "subtract $\\lambda$ from the diagonal" },
        { do: "Set it equal to zero", result: "$(5-\\lambda)^2=4$", why: "eigenvalues make the determinant zero" },
        { do: "Take square roots", result: "$5-\\lambda=\\pm2$", why: "solve the square equation" },
        { do: "Solve both cases", result: "$\\lambda=3$ and $\\lambda=7$", why: "subtract from 5" },
        { do: "Order them", result: "$7,3$", why: "larger and smaller stretches are often listed together" }
      ], answer: "The eigenvalues are $7$ and $3$." },
      { problem: "Show that eigenvectors $(1,1)^T$ and $(1,-1)^T$ are orthogonal and normalize them.", steps: [
        { do: "Compute the dot product", result: "$1\\cdot1+1\\cdot(-1)=0$", why: "zero dot product means orthogonal" },
        { do: "Compute the first length", result: "$\\sqrt2$", why: "$1^2+1^2=2$" },
        { do: "Normalize the first vector", result: "$(1,1)^T/\\sqrt2$", why: "divide by its length" },
        { do: "Compute the second length", result: "$\\sqrt2$", why: "$1^2+(-1)^2=2$" },
        { do: "Normalize the second vector", result: "$(1,-1)^T/\\sqrt2$", why: "divide by its length" }
      ], answer: "They are orthogonal; the unit vectors are $(1,1)^T/\\sqrt2$ and $(1,-1)^T/\\sqrt2$." },
      { problem: "If $A=Q\\operatorname{diag}(10,2)Q^T$ and $x=3q_1-4q_2$, compute $Ax$.", steps: [
        { do: "Use the eigenbasis coordinates", result: "$x=3q_1-4q_2$", why: "the $q$ vectors are eigenvectors" },
        { do: "Scale the $q_1$ coordinate", result: "$10\\cdot3q_1=30q_1$", why: "eigenvalue 10 acts on $q_1$" },
        { do: "Scale the $q_2$ coordinate", result: "$2\\cdot(-4)q_2=-8q_2$", why: "eigenvalue 2 acts on $q_2$" },
        { do: "Add the scaled components", result: "$Ax=30q_1-8q_2$", why: "linearity combines the directions" },
        { do: "Compare with $x$", result: "the first coordinate is amplified more", why: "10 is larger than 2" }
      ], answer: "$Ax=30q_1-8q_2$." },
      { problem: "Use spectral form to compute $x^TAx$ when $A=Q\\operatorname{diag}(4,1)Q^T$ and $x=2q_1+3q_2$.", steps: [
        { do: "Read the eigenbasis coordinates", result: "$y=(2,3)$", why: "$Q^Tx$ gives coordinates in the $q$ basis" },
        { do: "Write the quadratic form", result: "$x^TAx=y^T\\Lambda y$", why: "orthogonal changes preserve dot products" },
        { do: "Apply the diagonal matrix", result: "$4\\cdot2^2+1\\cdot3^2$", why: "each coordinate is weighted by an eigenvalue" },
        { do: "Compute the terms", result: "$16+9$", why: "$4\\cdot4=16$" },
        { do: "Add", result: "$25$", why: "sum the spectral contributions" }
      ], answer: "$x^TAx=25$." }
    ],
    applications: [
      { title: "PCA directions", background: "PCA studies a symmetric covariance matrix, so the Spectral Theorem guarantees perpendicular principal directions.", numbers: "Covariance $\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$ has eigenvalues $3$ and $1$, so variance is three times larger along $(1,1)$ than along $(1,-1)$." },
      { title: "Graph Laplacians", background: "Undirected graph Laplacians are symmetric, making their spectra central to clustering and graph learning.", numbers: "For two nodes connected by one edge, $L=\\begin{bmatrix}1&-1\\\\-1&1\\end{bmatrix}$ has eigenvalues $0$ and $2$." },
      { title: "Stable covariance models", background: "Covariance matrices must be symmetric, and spectral decomposition exposes their variance axes.", numbers: "If eigenvalues are $9$ and $1$, one standard deviation is $3$ along the first eigenvector and $1$ along the second." },
      { title: "Quadratic loss geometry", background: "Near a minimum, many losses look like $\\tfrac12 x^THx$ with symmetric Hessian $H$.", numbers: "Eigenvalues $100$ and $1$ mean curvature is 100 times steeper in one orthogonal direction." },
      { title: "Symmetric attention kernels", background: "Some kernel methods build symmetric similarity matrices so eigenvectors give reusable basis functions.", numbers: "A $2\\times2$ kernel $\\begin{bmatrix}1&0.6\\\\0.6&1\\end{bmatrix}$ has eigenvalues $1.6$ and $0.4$." },
      { title: "Matrix powers", background: "Spectral form makes repeated symmetric transformations easy to compute.", numbers: "If $A=Q\\operatorname{diag}(3,1)Q^T$, then $A^4=Q\\operatorname{diag}(81,1)Q^T$." }
    ],
    applicationsClose: "The Spectral Theorem says symmetric structure is readable as perpendicular axes and real stretches, a language reused across ML.",
    takeaways: ["Real symmetric matrices can be orthogonally diagonalized as $A=Q\\Lambda Q^T$.", "Eigenvectors for distinct eigenvalues are orthogonal.", "In the eigenbasis, applying $A$ means scaling each coordinate separately.", "PCA, covariance, Hessians, kernels, and graph Laplacians all lean on this theorem."]
  },

  "math-09-29": {
    id: "math-09-29",
    title: "Positive-definite matrices",
    tagline: "Positive-definite matrices are the multidimensional bowls of linear algebra.",
    connections: { buildsOn: ["The Spectral Theorem", "quadratic expressions", "eigenvalues"], leadsTo: ["Quadratic forms", "The condition number", "optimization"], usedWith: ["symmetric matrices", "Cholesky factorization", "Hessians"] },
    motivation: "<p>You already trust the one-dimensional square $ax^2$ when $a>0$: it is never negative and it forms a bowl. In many variables, the expression $x^TAx$ plays the same role.</p><p>A <b>positive-definite</b> matrix makes that bowl positive in every nonzero direction. This is why it appears in covariance, least squares, Newton's method, and the geometry of safe optimization.</p>",
    definition: "<p>A real symmetric matrix $A$ is <b>positive definite</b> if $x^TAx>0$ for every nonzero vector $x$. It is positive semidefinite if $x^TAx\\ge0$ for every $x$. By the Spectral Theorem, $A=Q\\Lambda Q^T$, and $x^TAx=y^T\\Lambda y=\\sum_i \\lambda_i y_i^2$ with $y=Q^Tx$.</p><p>This derivation gives the key test: a symmetric matrix is positive definite exactly when all eigenvalues are positive. For a $2\\times2$ symmetric matrix $\\begin{bmatrix}a&b\\\\b&d\\end{bmatrix}$, positive definiteness is also equivalent to $a>0$ and $ad-b^2>0$.</p><p><b>Assumptions that matter:</b> the eigenvalue test is stated for symmetric matrices; $x=0$ is excluded from strict positivity because it always gives $0$; and positive semidefinite allows flat directions while positive definite does not.</p>",
    worked: {
      problem: "Decide whether $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$ is positive definite.",
      skills: ["quadratic forms", "eigenvalues", "principal minors"],
      strategy: "The matrix is symmetric — either eigenvalues or the $2\\times2$ minor test can prove positivity.",
      steps: [
        { do: "Check symmetry", result: "$A^T=A$", why: "positive definiteness is normally tested on symmetric matrices" },
        { do: "Read the leading entry", result: "$a=2>0$", why: "first $2\\times2$ condition" },
        { do: "Compute the determinant", result: "$\\det A=2\\cdot2-1\\cdot1=3$", why: "second $2\\times2$ condition" },
        { do: "Check the determinant sign", result: "$3>0$", why: "both principal conditions are positive" },
        { do: "State the conclusion", result: "$A$ is positive definite", why: "the symmetric $2\\times2$ test passes" }
      ],
      verify: "Its eigenvalues are $3$ and $1$, both positive, matching the conclusion.",
      answer: "$A$ is positive definite.",
      connects: "Positive definiteness means every nonzero direction sees positive curvature."
    },
    practice: [
      { problem: "Use the $2\\times2$ test on $A=\\begin{bmatrix}4&1\\\\1&3\\end{bmatrix}$.", steps: [
        { do: "Check symmetry", result: "$A^T=A$", why: "the off-diagonal entries match" },
        { do: "Check the first entry", result: "$4>0$", why: "first leading minor" },
        { do: "Compute the determinant", result: "$4\\cdot3-1\\cdot1=11$", why: "area scaling of the matrix" },
        { do: "Check the determinant sign", result: "$11>0$", why: "second leading minor" },
        { do: "Conclude", result: "positive definite", why: "both tests pass" }
      ], answer: "$A$ is positive definite." },
      { problem: "Decide whether $B=\\begin{bmatrix}1&2\\\\2&1\\end{bmatrix}$ is positive definite.", steps: [
        { do: "Check symmetry", result: "$B^T=B$", why: "the test applies" },
        { do: "Check the first entry", result: "$1>0$", why: "first condition passes" },
        { do: "Compute the determinant", result: "$1\\cdot1-2\\cdot2=-3$", why: "second condition" },
        { do: "Check the determinant sign", result: "$-3<0$", why: "the matrix has mixed curvature" },
        { do: "Conclude", result: "not positive definite", why: "one required condition fails" }
      ], answer: "$B$ is not positive definite." },
      { problem: "Use eigenvalues to classify $C=\\operatorname{diag}(5,0,2)$.", steps: [
        { do: "Read the eigenvalues", result: "$5,0,2$", why: "diagonal entries are eigenvalues" },
        { do: "Check nonnegativity", result: "all are $\\ge0$", why: "positive semidefinite allows zero" },
        { do: "Check strict positivity", result: "one eigenvalue is $0$", why: "positive definite needs all positive" },
        { do: "Identify a flat vector", result: "$e_2^TCe_2=0$", why: "the zero eigenvalue gives a flat direction" },
        { do: "Classify", result: "positive semidefinite but not positive definite", why: "nonnegative with a flat direction" }
      ], answer: "$C$ is positive semidefinite, not positive definite." },
      { problem: "For $A=\\begin{bmatrix}a&0\\\\0&9\\end{bmatrix}$, find the values of $a$ that make $A$ positive definite.", steps: [
        { do: "Read eigenvalues", result: "$a$ and $9$", why: "the matrix is diagonal" },
        { do: "Require the first eigenvalue positive", result: "$a>0$", why: "positive definite needs every eigenvalue positive" },
        { do: "Require the second eigenvalue positive", result: "$9>0$", why: "already true" },
        { do: "Combine conditions", result: "$a>0$", why: "only the first condition restricts $a$" },
        { do: "Check a sample", result: "$a=2$ works", why: "both diagonal entries are then positive" }
      ], answer: "$a>0$." },
      { problem: "A Hessian is $H=\\begin{bmatrix}6&2\\\\2&2\\end{bmatrix}$. Decide whether a stationary point is a strict local minimum.", steps: [
        { do: "Check symmetry", result: "$H^T=H$", why: "Hessians of smooth scalar functions are symmetric under usual conditions" },
        { do: "Check the first entry", result: "$6>0$", why: "first leading minor" },
        { do: "Compute determinant", result: "$6\\cdot2-2\\cdot2=8$", why: "second leading minor" },
        { do: "Check positivity", result: "$8>0$", why: "the Hessian is positive definite" },
        { do: "Interpret", result: "strict local minimum", why: "positive-definite curvature forms a bowl" }
      ], answer: "Yes. The stationary point has a strict local minimum by the positive-definite Hessian test." }
    ],
    applications: [
      { title: "Convex quadratic losses", background: "Least-squares objectives have Hessians of the form $2X^TX$, often positive definite when features are independent.", numbers: "If $X^TX=\\begin{bmatrix}4&1\\\\1&3\\end{bmatrix}$, determinant $11>0$ and first entry $4>0$, so the bowl is strict." },
      { title: "Covariance matrices", background: "Covariance measures spread, and variance in any direction cannot be negative, so covariance matrices are positive semidefinite.", numbers: "For variances $4$ and $9$ with covariance $3$, determinant $36-9=27>0$, so the covariance is positive definite." },
      { title: "Gaussian distributions", background: "A multivariate Gaussian needs a positive-definite covariance so distances and densities are meaningful.", numbers: "With covariance $\\operatorname{diag}(4,1)$, vector $(2,1)$ has Mahalanobis square $2^2/4+1^2/1=2$." },
      { title: "Kernel methods", background: "Kernel matrices must be positive semidefinite so they behave like dot products in a feature space.", numbers: "Matrix $\\begin{bmatrix}1&0.8\\\\0.8&1\\end{bmatrix}$ has determinant $0.36>0$, so it is positive definite." },
      { title: "Newton optimization", background: "Newton's method trusts curvature; positive-definite Hessians point toward local minima.", numbers: "For $H=\\operatorname{diag}(10,2)$ and gradient $(5,4)$, the Newton step solves $Hp=-g$, giving $p=(-0.5,-2)$." },
      { title: "Regularization", background: "Adding $\\lambda I$ lifts eigenvalues and can turn flat curvature into strict curvature.", numbers: "Eigenvalues $0$ and $3$ become $0.1$ and $3.1$ after adding $0.1I$, making the matrix positive definite." }
    ],
    applicationsClose: "Positive definiteness is the same trustworthy bowl shape wearing covariance, kernel, Hessian, and regularization clothing.",
    takeaways: ["A symmetric $A$ is positive definite when $x^TAx>0$ for every nonzero $x$.", "For symmetric matrices, positive definiteness is equivalent to all eigenvalues being positive.", "Positive semidefinite matrices may have zero eigenvalues and flat directions.", "Covariances, kernels, Hessians, and regularized losses use this positivity condition."]
  },

  "math-09-30": {
    id: "math-09-30",
    title: "Quadratic forms",
    tagline: "A quadratic form measures a vector by mixing its coordinates through a matrix.",
    connections: { buildsOn: ["Positive-definite matrices", "dot products", "matrix multiplication"], leadsTo: ["Least squares", "The condition number", "PCA"], usedWith: ["Hessians", "ellipses", "eigenvalues"] },
    motivation: "<p>You already know $3x^2$ as a one-variable curve. In two or more variables, squared terms can also mix: $2x_1x_2$ matters just as much as $x_1^2$.</p><p>A <b>quadratic form</b> packages all of that into $x^TAx$. It is the language of ellipses, energy, curvature, variance, and second-order approximations in ML.</p>",
    definition: "<p>Given a square matrix $A$ and vector $x$, the expression $x^TAx$ is a <b>quadratic form</b>. When $A$ is symmetric, the coefficients are easy to read: for $A=\\begin{bmatrix}a&b\\\\b&d\\end{bmatrix}$, $$x^TAx=ax_1^2+2bx_1x_2+dx_2^2.$$ The factor $2$ appears because the off-diagonal terms $b x_1x_2$ and $b x_2x_1$ both contribute.</p><p>If $A=Q\\Lambda Q^T$, then $x^TAx=\\sum_i\\lambda_i y_i^2$ where $y=Q^Tx$. So eigenvalues tell whether the form is a bowl, cap, saddle, or flat in particular directions.</p><p><b>Assumptions that matter:</b> only the symmetric part of $A$ affects $x^TAx$; positive, negative, and zero eigenvalues determine shape; and geometric statements usually assume $A$ is symmetric.</p>",
    worked: {
      problem: "Expand and classify $q(x)=x^TAx$ for $A=\\begin{bmatrix}3&1\\\\1&2\\end{bmatrix}$.",
      skills: ["matrix multiplication", "expansion", "positive definiteness"],
      strategy: "Expand the form, then use the positive-definite test to read its shape.",
      steps: [
        { do: "Write the vector", result: "$x=(x_1,x_2)^T$", why: "name the coordinates" },
        { do: "Multiply $Ax$", result: "$(3x_1+x_2,\\ x_1+2x_2)^T$", why: "apply the matrix to the vector" },
        { do: "Dot with $x$", result: "$x_1(3x_1+x_2)+x_2(x_1+2x_2)$", why: "compute $x^T(Ax)$" },
        { do: "Collect terms", result: "$3x_1^2+2x_1x_2+2x_2^2$", why: "the cross terms add" },
        { do: "Check the first leading minor", result: "$3>0$", why: "positive-definite test" },
        { do: "Check the determinant", result: "$3\\cdot2-1=5>0$", why: "second condition passes" },
        { do: "Classify the shape", result: "positive definite bowl", why: "the quadratic form is positive away from zero" }
      ],
      verify: "At $x=(1,-1)$, $q=3-2+2=3>0$; at $x=(1,1)$, $q=7>0$.",
      answer: "$q(x)=3x_1^2+2x_1x_2+2x_2^2$, and it is positive definite.",
      connects: "The matrix stores the squared and mixed curvature terms compactly."
    },
    practice: [
      { problem: "Expand $x^T\\begin{bmatrix}2&0\\\\0&5\\end{bmatrix}x$.", steps: [
        { do: "Write $x$", result: "$x=(x_1,x_2)^T$", why: "name coordinates" },
        { do: "Multiply by the matrix", result: "$(2x_1,5x_2)^T$", why: "diagonal entries scale coordinates" },
        { do: "Dot with $x$", result: "$2x_1^2+5x_2^2$", why: "multiply matching coordinates" },
        { do: "Check cross terms", result: "none", why: "off-diagonal entries are zero" },
        { do: "Classify signs", result: "positive for nonzero $x$", why: "both coefficients are positive" }
      ], answer: "$2x_1^2+5x_2^2$, positive definite." },
      { problem: "Find the matrix for $q(x)=4x_1^2-6x_1x_2+2x_2^2$.", steps: [
        { do: "Read the $x_1^2$ coefficient", result: "$a=4$", why: "diagonal entry $a$ multiplies $x_1^2$" },
        { do: "Read the $x_2^2$ coefficient", result: "$d=2$", why: "diagonal entry $d$ multiplies $x_2^2$" },
        { do: "Split the cross coefficient", result: "$2b=-6$", why: "symmetric off-diagonal terms add" },
        { do: "Solve for $b$", result: "$b=-3$", why: "divide the cross coefficient by 2" },
        { do: "Assemble the matrix", result: "$A=\\begin{bmatrix}4&-3\\\\-3&2\\end{bmatrix}$", why: "place $b$ symmetrically" }
      ], answer: "$A=\\begin{bmatrix}4&-3\\\\-3&2\\end{bmatrix}$." },
      { problem: "Evaluate $x^TAx$ for $A=\\begin{bmatrix}1&2\\\\2&5\\end{bmatrix}$ and $x=(3,-1)^T$.", steps: [
        { do: "Compute $Ax$", result: "$(1,1)^T$", why: "$(3-2,6-5)=(1,1)$" },
        { do: "Dot with $x$", result: "$(3,-1)\\cdot(1,1)$", why: "finish $x^T(Ax)$" },
        { do: "Multiply coordinates", result: "$3-1$", why: "dot product arithmetic" },
        { do: "Add", result: "$2$", why: "sum the products" },
        { do: "Check with expansion", result: "$9-12+5=2$", why: "both methods agree" }
      ], answer: "$x^TAx=2$." },
      { problem: "Classify $q(x)=x_1^2-x_2^2$ using eigenvalues.", steps: [
        { do: "Write the matrix", result: "$A=\\operatorname{diag}(1,-1)$", why: "diagonal coefficients are $1$ and $-1$" },
        { do: "Read eigenvalues", result: "$1$ and $-1$", why: "diagonal matrix" },
        { do: "Check signs", result: "one positive and one negative", why: "mixed signs create different curvature directions" },
        { do: "Evaluate one direction", result: "$q(1,0)=1$", why: "positive along $x_1$" },
        { do: "Evaluate another direction", result: "$q(0,1)=-1$", why: "negative along $x_2$" }
      ], answer: "The form is indefinite, a saddle." },
      { problem: "A local loss is approximated by $L(w)\\approx L_0+\\tfrac12 h^THh$ with $H=\\operatorname{diag}(8,2)$ and $h=(0.1,-0.3)$. Compute the quadratic increase.", steps: [
        { do: "Apply $H$ to $h$", result: "$(0.8,-0.6)$", why: "scale by diagonal entries" },
        { do: "Compute $h^THh$", result: "$0.1\\cdot0.8+(-0.3)(-0.6)$", why: "dot with $h$" },
        { do: "Add the products", result: "$0.08+0.18=0.26$", why: "sum the two curvature contributions" },
        { do: "Multiply by $1/2$", result: "$0.13$", why: "the Taylor quadratic term has factor $1/2$" },
        { do: "Interpret", result: "loss increases by about $0.13$", why: "positive curvature penalizes the step" }
      ], answer: "The approximate increase is $0.13$." }
    ],
    applications: [
      { title: "Second-order loss approximations", background: "Taylor expansion near a parameter vector uses a quadratic form to describe curvature.", numbers: "With $H=\\operatorname{diag}(8,2)$ and step $(0.1,-0.3)$, the increase is $0.13$." },
      { title: "Mahalanobis distance", background: "Statistics measures distance using covariance-aware ellipses rather than ordinary circles.", numbers: "If $\\Sigma=\\operatorname{diag}(4,1)$, then $x=(2,1)$ has distance square $x^T\\Sigma^{-1}x=1+1=2$." },
      { title: "Ridge penalties", background: "Regularization often adds a quadratic form to discourage large weights.", numbers: "For $\\lambda=0.1$ and $w=(3,4)$, penalty $0.1w^Tw=0.1\\cdot25=2.5$." },
      { title: "Energy in physical systems", background: "Many energies are quadratic in displacement or velocity, which makes quadratic forms a shared language across engineering.", numbers: "With stiffness $K=\\operatorname{diag}(10,2)$ and displacement $(0.5,1)$, energy $\\tfrac12 x^TKx=\\tfrac12(2.5+2)=2.25$." },
      { title: "Confidence ellipses", background: "Ellipses arise from setting a positive-definite quadratic form equal to a constant.", numbers: "$x_1^2/9+x_2^2/4=1$ has radii $3$ and $2$ along the coordinate axes." },
      { title: "Curvature-aware optimization", background: "Optimizers use curvature to avoid stepping too far in steep directions.", numbers: "If eigenvalues of $H$ are $100$ and $1$, the same coordinate step costs 100 times more in the first eigen-direction." }
    ],
    applicationsClose: "Quadratic forms let one expression describe bowls, ellipses, penalties, energies, and local loss geometry.",
    takeaways: ["A quadratic form has the shape $x^TAx$.", "For symmetric $2\\times2$ matrices, off-diagonal entries contribute twice to the cross term.", "Eigenvalue signs classify the shape as bowl, cap, saddle, or flat.", "ML uses quadratic forms for curvature, covariance-aware distance, and regularization."]
  },

  "math-09-31": {
    id: "math-09-31",
    title: "Singular Value Decomposition (SVD)",
    tagline: "SVD says every matrix rotates, stretches along perpendicular axes, and rotates again.",
    connections: { buildsOn: ["The Spectral Theorem", "orthogonality", "matrix rank"], leadsTo: ["The pseudoinverse", "Principal Component Analysis (PCA)", "low-rank factorization"], usedWith: ["orthogonal matrices", "matrix norms", "least squares"] },
    motivation: "<p>You already know symmetric matrices have eigenvectors that behave beautifully. But ML is full of rectangular matrices: data tables, embeddings, image patches, and neural-network weights.</p><p>The <b>Singular Value Decomposition</b> is the version that works for every matrix. It finds input directions, output directions, and nonnegative stretch factors connecting them.</p>",
    definition: "<p>Every real $m\\times n$ matrix $A$ has an SVD $$A=U\\Sigma V^T,$$ where $U$ and $V$ have orthonormal columns and $\\Sigma$ is diagonal-shaped with nonnegative entries $\\sigma_1\\ge\\sigma_2\\ge\\cdots\\ge0$ called <b>singular values</b>. The columns of $V$ are right singular vectors, and the columns of $U$ are left singular vectors.</p><p>Why this follows from spectral ideas: $A^TA$ is symmetric positive semidefinite, so it has orthonormal eigenvectors $v_i$ and nonnegative eigenvalues $\\lambda_i$. The singular values are $\\sigma_i=\\sqrt{\\lambda_i}$, and when $\\sigma_i>0$, $u_i=Av_i/\\sigma_i$.</p><p><b>Assumptions that matter:</b> singular values are never negative; zero singular values reveal rank deficiency; and unlike eigen-decomposition, SVD exists for rectangular and non-symmetric matrices.</p>",
    worked: {
      problem: "Find an SVD of $A=\\begin{bmatrix}3&0\\\\0&1\\end{bmatrix}$.",
      skills: ["singular values", "orthogonal factors", "diagonal matrices"],
      strategy: "The matrix already stretches coordinate axes, so the singular vectors are the standard basis.",
      steps: [
        { do: "Compute $A^TA$", result: "$\\begin{bmatrix}9&0\\\\0&1\\end{bmatrix}$", why: "right singular vectors come from $A^TA$" },
        { do: "Read eigenvalues of $A^TA$", result: "$9$ and $1$", why: "the matrix is diagonal" },
        { do: "Take square roots", result: "$\\sigma_1=3$, $\\sigma_2=1$", why: "singular values are square roots of eigenvalues" },
        { do: "Choose right singular vectors", result: "$v_1=e_1$, $v_2=e_2$", why: "standard axes diagonalize $A^TA$" },
        { do: "Compute left singular vectors", result: "$u_1=Ae_1/3=e_1$, $u_2=Ae_2/1=e_2$", why: "use $u_i=Av_i/\\sigma_i$" },
        { do: "Assemble the SVD", result: "$U=I$, $\\Sigma=\\operatorname{diag}(3,1)$, $V=I$", why: "the matrix is already diagonal and nonnegative" }
      ],
      verify: "$U\\Sigma V^T=I\\Sigma I=\\begin{bmatrix}3&0\\\\0&1\\end{bmatrix}$.",
      answer: "One SVD is $A=I\\operatorname{diag}(3,1)I^T$.",
      connects: "SVD reads a matrix as perpendicular input directions stretched into perpendicular output directions."
    },
    practice: [
      { problem: "Find the singular values of $A=\\begin{bmatrix}0&2\\\\0&0\\\\0&0\\end{bmatrix}$.", steps: [
        { do: "Compute $A^TA$", result: "$\\begin{bmatrix}0&0\\\\0&4\\end{bmatrix}$", why: "singular values come from $A^TA$" },
        { do: "Read eigenvalues", result: "$4$ and $0$", why: "diagonal matrix" },
        { do: "Take square roots", result: "$2$ and $0$", why: "singular values are nonnegative roots" },
        { do: "Order them", result: "$\\sigma_1=2$, $\\sigma_2=0$", why: "singular values are listed descending" },
        { do: "Read rank", result: "$1$", why: "one singular value is positive" }
      ], answer: "The singular values are $2$ and $0$; the rank is $1$." },
      { problem: "For $A=\\begin{bmatrix}1&0\\\\0&1\\\\0&0\\end{bmatrix}$, compute $A^TA$ and the singular values.", steps: [
        { do: "Compute the first diagonal entry", result: "$1$", why: "first column has length 1" },
        { do: "Compute the second diagonal entry", result: "$1$", why: "second column has length 1" },
        { do: "Compute the off-diagonal entry", result: "$0$", why: "the columns are orthogonal" },
        { do: "Write $A^TA$", result: "$I_2$", why: "columns are orthonormal" },
        { do: "Take square roots of eigenvalues", result: "$1,1$", why: "eigenvalues of $I_2$ are both 1" }
      ], answer: "The singular values are $1$ and $1$." },
      { problem: "If singular values are $5,2,0$, find the rank and Frobenius norm.", steps: [
        { do: "Count positive singular values", result: "$2$", why: "rank equals the number of nonzero singular values" },
        { do: "Square the singular values", result: "$25,4,0$", why: "Frobenius norm squares add" },
        { do: "Add the squares", result: "$29$", why: "sum all singular-value squares" },
        { do: "Take the square root", result: "$\\sqrt{29}$", why: "finish the norm" },
        { do: "Approximate", result: "$\\sqrt{29}\\approx5.385$", why: "numerical size" }
      ], answer: "Rank $2$ and $\\|A\\|_F=\\sqrt{29}\\approx5.385$." },
      { problem: "For $A=U\\operatorname{diag}(4,1)V^T$, compute $A v_1$ and $A v_2$.", steps: [
        { do: "Use the first right singular vector", result: "$V^Tv_1=e_1$", why: "$v_1$ is the first column of $V$" },
        { do: "Apply $\\Sigma$", result: "$4e_1$", why: "the first singular value is 4" },
        { do: "Apply $U$", result: "$4u_1$", why: "the first coordinate maps to the first left singular vector" },
        { do: "Repeat for $v_2$", result: "$A v_2=1u_2$", why: "the second singular value is 1" },
        { do: "Interpret", result: "two perpendicular inputs stretch by $4$ and $1$", why: "this is the SVD geometry" }
      ], answer: "$Av_1=4u_1$ and $Av_2=u_2$." },
      { problem: "A matrix has singular values $10,3,1$. What fraction of squared Frobenius energy is captured by the top two?", steps: [
        { do: "Square the singular values", result: "$100,9,1$", why: "energy uses squared singular values" },
        { do: "Compute total energy", result: "$100+9+1=110$", why: "sum all squared singular values" },
        { do: "Compute top-two energy", result: "$100+9=109$", why: "keep the first two components" },
        { do: "Divide", result: "$109/110\\approx0.991$", why: "fraction captured" },
        { do: "Convert to percent", result: "$99.1\\%$", why: "easier to interpret" }
      ], answer: "The top two singular values capture about $99.1\\%$ of the squared Frobenius energy." }
    ],
    applications: [
      { title: "Low-rank approximation", background: "SVD gives the best rank-$k$ approximation in Frobenius and spectral norm, which is why it is a compression workhorse.", numbers: "If singular values are $10,3,1$, rank 2 keeps $109/110=99.1\\%$ of squared energy." },
      { title: "Latent semantic analysis", background: "Early information retrieval used SVD to reduce term-document matrices into latent topics.", numbers: "A rank-50 approximation to a $10000\\times1000$ matrix stores roughly $50(10000+1000+1)=550050$ numbers instead of $10,000,000$." },
      { title: "Image compression", background: "Grayscale images are matrices, and SVD stores dominant visual patterns first.", numbers: "A $100\\times100$ image rank 10 approximation stores $10(100+100+1)=2010$ numbers instead of $10000$." },
      { title: "PCA computation", background: "PCA can be computed by applying SVD to a centered data matrix.", numbers: "If centered $X$ has singular values $6$ and $2$ over $n=5$ examples, variances are $36/4=9$ and $4/4=1$." },
      { title: "Numerical rank detection", background: "Small singular values often signal redundant columns or near-dependencies.", numbers: "Singular values $100,1,0.0001$ suggest effective rank $2$ if tolerance is $0.001$." },
      { title: "Embedding analysis", background: "SVD reveals dominant directions in embedding or activation matrices.", numbers: "If the first singular value is $20$ and total squared energy is $500$, the first direction explains $400/500=80\\%$." }
    ],
    applicationsClose: "SVD is the universal matrix microscope: it shows directions, stretches, rank, compression, and energy in one view.",
    takeaways: ["Every real matrix has an SVD $A=U\\Sigma V^T$.", "Singular values are nonnegative square roots of eigenvalues of $A^TA$.", "Rank equals the number of positive singular values.", "Low-rank approximation, PCA, compression, and numerical diagnostics all use SVD."]
  },

  "math-09-32": {
    id: "math-09-32",
    title: "Least squares",
    tagline: "Least squares finds the prediction that misses the data as little as possible in squared distance.",
    connections: { buildsOn: ["QR factorization", "orthogonal projections", "quadratic forms"], leadsTo: ["The pseudoinverse", "PCA", "regularized regression"], usedWith: ["normal equations", "projections", "linear regression"] },
    motivation: "<p>You already know that an overdetermined system can ask for too much: three data points may not lie exactly on one line. Instead of giving up, we ask for the closest line.</p><p><b>Least squares</b> chooses parameters that minimize the squared residual $\\|Ax-b\\|^2$. Geometrically, it projects $b$ onto the column space of $A$.</p>",
    definition: "<p>For a tall matrix $A$ and target vector $b$, the least-squares problem is $$\\min_x \\|Ax-b\\|_2^2.$$ At the optimum $\\hat x$, the residual $r=b-A\\hat x$ is orthogonal to every column of $A$, so $A^Tr=0$. This gives the <b>normal equations</b> $$A^TA\\hat x=A^Tb.$$</p><p>If $A$ has independent columns, $A^TA$ is positive definite and the solution is unique. With QR, $A=QR$, the problem becomes $R\\hat x=Q^Tb$, which is usually more stable than solving the normal equations directly.</p><p><b>Assumptions that matter:</b> uniqueness needs full column rank; squared residuals emphasize large errors; and forming $A^TA$ can worsen conditioning even though it is algebraically correct.</p>",
    worked: {
      problem: "Fit $y\\approx c$ to data $2,4,5$ by least squares.",
      skills: ["constant model", "normal equations", "mean as projection"],
      strategy: "A constant model has one column of ones — solve the one-parameter normal equation.",
      steps: [
        { do: "Write the design matrix", result: "$A=\\begin{bmatrix}1\\\\1\\\\1\\end{bmatrix}$", why: "a constant model predicts the same $c$ each time" },
        { do: "Write the target", result: "$b=(2,4,5)^T$", why: "these are the observed values" },
        { do: "Compute $A^TA$", result: "$3$", why: "there are three ones" },
        { do: "Compute $A^Tb$", result: "$11$", why: "$2+4+5=11$" },
        { do: "Solve the normal equation", result: "$3c=11$", why: "least squares sets $A^TAc=A^Tb$" },
        { do: "Divide by 3", result: "$c=11/3$", why: "the best constant is the mean" }
      ],
      verify: "Residuals are $-5/3$, $1/3$, and $4/3$, and they sum to $0$, so they are orthogonal to the column of ones.",
      answer: "The least-squares constant is $c=11/3\\approx3.667$.",
      connects: "Least squares projects the data vector onto the model's column space."
    },
    practice: [
      { problem: "Fit a constant to data $1,3,8$.", steps: [
        { do: "Write $A^TA$", result: "$3$", why: "three observations of one constant" },
        { do: "Compute $A^Tb$", result: "$1+3+8=12$", why: "sum the observations" },
        { do: "Write the normal equation", result: "$3c=12$", why: "least-squares condition" },
        { do: "Solve", result: "$c=4$", why: "divide by 3" },
        { do: "Check residual sum", result: "$-3-1+4=0$", why: "residuals are orthogonal to constants" }
      ], answer: "The best constant is $4$." },
      { problem: "Fit $y=mx$ to points $(1,2)$ and $(2,5)$.", steps: [
        { do: "Write $A$ and $b$", result: "$A=(1,2)^T$, $b=(2,5)^T$", why: "the one feature is $x$" },
        { do: "Compute $A^TA$", result: "$1^2+2^2=5$", why: "sum feature squares" },
        { do: "Compute $A^Tb$", result: "$1\\cdot2+2\\cdot5=12$", why: "feature-target dot product" },
        { do: "Solve", result: "$5m=12$", why: "normal equation" },
        { do: "Divide", result: "$m=12/5=2.4$", why: "best slope through the origin" }
      ], answer: "$m=2.4$." },
      { problem: "For $A=\\begin{bmatrix}1&0\\\\1&1\\\\1&2\\end{bmatrix}$ and $b=(1,2,2)^T$, compute $A^TA$ and $A^Tb$.", steps: [
        { do: "Dot the first column with itself", result: "$3$", why: "three ones" },
        { do: "Dot the columns together", result: "$0+1+2=3$", why: "off-diagonal entry" },
        { do: "Dot the second column with itself", result: "$0^2+1^2+2^2=5$", why: "second diagonal entry" },
        { do: "Compute first entry of $A^Tb$", result: "$1+2+2=5$", why: "sum targets" },
        { do: "Compute second entry of $A^Tb$", result: "$0\\cdot1+1\\cdot2+2\\cdot2=6$", why: "feature-target dot product" }
      ], answer: "$A^TA=\\begin{bmatrix}3&3\\\\3&5\\end{bmatrix}$ and $A^Tb=(5,6)^T$." },
      { problem: "Solve $\\begin{bmatrix}3&3\\\\3&5\\end{bmatrix}\\begin{bmatrix}c\\\\m\\end{bmatrix}=\\begin{bmatrix}5\\\\6\\end{bmatrix}$.", steps: [
        { do: "Write equations", result: "$3c+3m=5$, $3c+5m=6$", why: "expand the matrix equation" },
        { do: "Subtract the first equation from the second", result: "$2m=1$", why: "eliminate $c$" },
        { do: "Solve for $m$", result: "$m=1/2$", why: "divide by 2" },
        { do: "Substitute into the first equation", result: "$3c+3/2=5$", why: "solve for intercept" },
        { do: "Solve for $c$", result: "$c=7/6$", why: "$3c=7/2$" }
      ], answer: "$c=7/6$, $m=1/2$." },
      { problem: "Given residual $r=(1,-2,1)^T$ and design columns $a_1=(1,1,1)^T$, $a_2=(0,1,2)^T$, check least-squares optimality.", steps: [
        { do: "Compute $a_1^Tr$", result: "$1-2+1=0$", why: "residual must be orthogonal to first column" },
        { do: "Compute $a_2^Tr$", result: "$0\\cdot1+1(-2)+2(1)=0$", why: "residual must be orthogonal to second column" },
        { do: "Combine dot products", result: "$A^Tr=(0,0)^T$", why: "both columns are orthogonal to the residual" },
        { do: "State optimality", result: "normal equations hold", why: "$A^T(b-A\\hat x)=0$" },
        { do: "Interpret", result: "the fit is least-squares optimal", why: "no column-space adjustment reduces squared error" }
      ], answer: "Yes. The residual satisfies the least-squares orthogonality condition." }
    ],
    applications: [
      { title: "Linear regression", background: "Least squares is the classical foundation of supervised regression and still underlies many ML baselines.", numbers: "For points $(1,2)$ and $(2,5)$ through the origin, slope $m=12/5=2.4$." },
      { title: "Calibration", background: "Models often need a linear correction to align scores with observed outcomes.", numbers: "If predictions $[1,2,3]$ should match $[2,4,5]$, a fitted slope through zero is $(1\\cdot2+2\\cdot4+3\\cdot5)/(1+4+9)=25/14$." },
      { title: "Sensor fusion", background: "Multiple noisy measurements of one quantity are often combined by minimizing squared error.", numbers: "Readings $9.8,10.1,10.0$ have least-squares constant $9.9667$." },
      { title: "Recommendation baselines", background: "A simple user or item bias can be fitted as an average residual before more complex models are added.", numbers: "Residuals $1,-2,4$ give best constant bias $(1-2+4)/3=1$." },
      { title: "Curve fitting", background: "Polynomial regression is least squares with columns $1,x,x^2$ and beyond.", numbers: "For $x=2$, row $[1,2,4]$ times coefficients $(1,0.5,-0.1)$ predicts $1.6$." },
      { title: "Batch metric smoothing", background: "When a line is fit to noisy daily metrics, squared residuals choose the trend with minimum total squared miss.", numbers: "Errors $1,-1,2$ have squared loss $1+1+4=6$, while errors $0,0,3$ have squared loss $9$." }
    ],
    applicationsClose: "Least squares is projection thinking with data: choose the model point whose residual is perpendicular to every allowed adjustment.",
    takeaways: ["Least squares minimizes $\\|Ax-b\\|_2^2$.", "At the solution, the residual is orthogonal to the column space of $A$.", "The normal equations are $A^TA\\hat x=A^Tb$.", "QR often solves least squares more stably than forming $A^TA$."]
  },

  "math-09-33": {
    id: "math-09-33",
    title: "The pseudoinverse",
    tagline: "The pseudoinverse is the inverse that still knows what to do when a matrix is rectangular or rank deficient.",
    connections: { buildsOn: ["Singular Value Decomposition (SVD)", "Least squares", "matrix inverses"], leadsTo: ["Principal Component Analysis (PCA)", "low-rank factorization", "regularization"], usedWith: ["least-squares solutions", "minimum-norm solutions", "SVD"] },
    motivation: "<p>You already know that square invertible matrices solve $Ax=b$ by $x=A^{-1}b$. But real data matrices are often tall, wide, or redundant, so the ordinary inverse does not exist.</p><p>The <b>pseudoinverse</b> $A^+$ extends the inverse idea. It gives least-squares solutions when exact solutions are impossible and minimum-norm solutions when many exact solutions exist.</p>",
    definition: "<p>If $A=U\\Sigma V^T$ is an SVD, the <b>Moore-Penrose pseudoinverse</b> is $$A^+=V\\Sigma^+U^T,$$ where $\\Sigma^+$ is formed by replacing each positive singular value $\\sigma_i$ with $1/\\sigma_i$ and leaving zeros as zeros, then transposing the diagonal shape.</p><p>For a full-column-rank tall matrix, $A^+=(A^TA)^{-1}A^T$, so $A^+b$ is the least-squares solution. For a full-row-rank wide matrix, $A^+=A^T(AA^T)^{-1}$, giving the minimum-norm exact solution when one exists.</p><p><b>Assumptions that matter:</b> tiny singular values can make $A^+b$ unstable; zeros are not inverted; and regularized variants often replace $1/\\sigma$ by safer shrinkage factors.</p>",
    worked: {
      problem: "Find $A^+$ for $A=\\begin{bmatrix}2&0\\\\0&0\\end{bmatrix}$ and solve $A^+b$ for $b=(6,5)^T$.",
      skills: ["SVD intuition", "reciprocals of singular values", "least-squares solutions"],
      strategy: "Invert the nonzero stretch and ignore the zero stretch.",
      steps: [
        { do: "Read the singular values", result: "$2$ and $0$", why: "the matrix is diagonal with nonnegative entries" },
        { do: "Invert the positive singular value", result: "$1/2$", why: "pseudoinverse reverses nonzero stretches" },
        { do: "Leave the zero singular value", result: "$0$", why: "division by zero is not allowed" },
        { do: "Write the pseudoinverse", result: "$A^+=\\begin{bmatrix}1/2&0\\\\0&0\\end{bmatrix}$", why: "same diagonal directions" },
        { do: "Multiply by $b$", result: "$A^+b=(3,0)^T$", why: "half of 6 is 3 and the zero direction stays 0" }
      ],
      verify: "$A(3,0)^T=(6,0)^T$, the closest vector in the column space to $(6,5)^T$.",
      answer: "$A^+=\\begin{bmatrix}1/2&0\\\\0&0\\end{bmatrix}$ and $A^+b=(3,0)^T$.",
      connects: "The pseudoinverse reverses what the matrix can do and stays quiet where the matrix loses information."
    },
    practice: [
      { problem: "Find the pseudoinverse of $A=\\operatorname{diag}(4,2)$.", steps: [
        { do: "Read singular values", result: "$4$ and $2$", why: "positive diagonal entries" },
        { do: "Invert the first", result: "$1/4$", why: "reverse stretch by 4" },
        { do: "Invert the second", result: "$1/2$", why: "reverse stretch by 2" },
        { do: "Assemble", result: "$A^+=\\operatorname{diag}(1/4,1/2)$", why: "ordinary inverse and pseudoinverse match here" },
        { do: "Check", result: "$AA^+=I$", why: "both directions are invertible" }
      ], answer: "$A^+=\\begin{bmatrix}1/4&0\\\\0&1/2\\end{bmatrix}$." },
      { problem: "For $A=\\begin{bmatrix}1\\\\1\\\\1\\end{bmatrix}$, compute $A^+$.", steps: [
        { do: "Compute $A^TA$", result: "$3$", why: "full column rank tall matrix" },
        { do: "Invert $A^TA$", result: "$1/3$", why: "scalar inverse" },
        { do: "Use the tall formula", result: "$A^+=(A^TA)^{-1}A^T$", why: "one independent column" },
        { do: "Multiply", result: "$A^+=\\begin{bmatrix}1/3&1/3&1/3\\end{bmatrix}$", why: "scale the row of ones" },
        { do: "Interpret", result: "it averages", why: "multiplying by data returns the mean" }
      ], answer: "$A^+=\\begin{bmatrix}1/3&1/3&1/3\\end{bmatrix}$." },
      { problem: "Use the previous $A^+$ to fit the best constant to $b=(2,4,5)^T$.", steps: [
        { do: "Write $A^+b$", result: "$(1/3)(2+4+5)$", why: "the pseudoinverse row averages entries" },
        { do: "Add the entries", result: "$11$", why: "sum the data" },
        { do: "Divide by 3", result: "$11/3$", why: "compute the mean" },
        { do: "State the fitted constant", result: "$c=11/3$", why: "least-squares solution" },
        { do: "Check residual sum", result: "$-5/3+1/3+4/3=0$", why: "least-squares residual is orthogonal to ones" }
      ], answer: "$c=11/3$." },
      { problem: "For wide matrix $A=\\begin{bmatrix}1&1\\end{bmatrix}$, find $A^+$ and the minimum-norm solution to $x_1+x_2=6$.", steps: [
        { do: "Compute $AA^T$", result: "$2$", why: "full row rank formula" },
        { do: "Invert $AA^T$", result: "$1/2$", why: "scalar inverse" },
        { do: "Use the wide formula", result: "$A^+=A^T(AA^T)^{-1}$", why: "minimum-norm exact solution" },
        { do: "Compute $A^+$", result: "$(1/2,1/2)^T$", why: "scale both entries" },
        { do: "Multiply by 6", result: "$x=(3,3)^T$", why: "split the solution evenly for smallest norm" }
      ], answer: "$A^+=(1/2,1/2)^T$ and the minimum-norm solution is $(3,3)^T$." },
      { problem: "A matrix has SVD singular values $10,0.5,0$. What singular values does $A^+$ have?", steps: [
        { do: "Invert $10$", result: "$0.1$", why: "positive singular values are reciprocated" },
        { do: "Invert $0.5$", result: "$2$", why: "$1/0.5=2$" },
        { do: "Handle $0$", result: "$0$", why: "zero singular values stay zero" },
        { do: "List pseudoinverse singular values", result: "$2,0.1,0$ after sorting", why: "singular values are conventionally ordered descending" },
        { do: "Notice sensitivity", result: "the small $0.5$ becomes a large $2$", why: "small singular values amplify noise" }
      ], answer: "$A^+$ has singular values $2$, $0.1$, and $0$." }
    ],
    applications: [
      { title: "Least-squares prediction", background: "The pseudoinverse gives the fitted coefficients directly when a system has more equations than unknowns.", numbers: "For a constant fit to $2,4,5$, $A^+b=(2+4+5)/3=11/3$." },
      { title: "Minimum-norm solutions", background: "Underdetermined systems have many exact answers, and the pseudoinverse picks the smallest Euclidean norm.", numbers: "$x_1+x_2=6$ has $(6,0)$ and $(3,3)$, but $(3,3)$ has norm $\\sqrt{18}$ versus $6$." },
      { title: "Linear decoder fitting", background: "A linear decoder from activations to targets is often solved by least squares with a pseudoinverse.", numbers: "If $A^+y=(0.2,-0.5,1.1)$, those are the decoder weights minimizing squared training error." },
      { title: "Deblurring toy systems", background: "Inverse problems often lose information; pseudoinverses reverse only recoverable directions.", numbers: "Matrix $\\operatorname{diag}(2,0)$ maps $(3,9)$ to $(6,0)$, so the pseudoinverse returns $(3,0)$, not the lost 9." },
      { title: "Numerical instability", background: "Tiny singular values turn into huge reciprocals, amplifying noise.", numbers: "A singular value $0.001$ becomes reciprocal $1000$, so noise $0.01$ can become size $10$." },
      { title: "Ridge as softened pseudoinverse", background: "Regularization replaces harsh reciprocals with shrinkage factors to control noise.", numbers: "For singular value $0.1$ and ridge $\\lambda=0.01$, factor $\\sigma/(\\sigma^2+\\lambda)=0.1/0.02=5$ instead of $10$." }
    ],
    applicationsClose: "The pseudoinverse is practical humility: invert the directions you can, choose the cleanest answer when you cannot.",
    takeaways: ["If $A=U\\Sigma V^T$, then $A^+=V\\Sigma^+U^T$.", "Positive singular values are reciprocated; zero singular values remain zero.", "$A^+b$ gives least-squares solutions for tall systems and minimum-norm solutions for wide systems.", "Small singular values can make pseudoinverse solutions sensitive to noise."]
  },

  "math-09-34": {
    id: "math-09-34",
    title: "Principal Component Analysis (PCA)",
    tagline: "PCA finds the perpendicular directions where centered data varies the most.",
    connections: { buildsOn: ["The Spectral Theorem", "SVD", "covariance matrices"], leadsTo: ["low-rank approximation", "dimensionality reduction", "representation learning"], usedWith: ["orthogonal projections", "variance", "matrix norms"] },
    motivation: "<p>You already know that a cloud of points can be stretched more in one direction than another. If we want a simpler picture, we should keep the direction where the data actually moves.</p><p><b>PCA</b> turns that instinct into an algorithm: center the data, find covariance eigenvectors, and project onto the directions with largest variance.</p>",
    definition: "<p>Given centered data matrix $X$ with rows as examples, the sample covariance is $S=\\dfrac1{n-1}X^TX$. PCA chooses orthonormal directions $v_i$ that maximize projected variance. By the Spectral Theorem, $S=V\\Lambda V^T$, and the principal components are the eigenvectors with largest eigenvalues.</p><p>Equivalently, if $X=U\\Sigma V^T$, then the PCA directions are columns of $V$, and the variances are $\\sigma_i^2/(n-1)$. Keeping the top $k$ directions gives the best rank-$k$ reconstruction among all $k$-dimensional linear subspaces.</p><p><b>Assumptions that matter:</b> data should be centered before PCA; feature scaling affects the directions; PCA is linear; and high variance is useful only when it aligns with the signal you care about.</p>",
    worked: {
      problem: "For centered points $(1,1)$, $(-1,-1)$, $(2,2)$, and $(-2,-2)$, find the first principal direction and variance.",
      skills: ["centering", "covariance", "eigenvectors"],
      strategy: "The data lies on a line — compute covariance and read the largest eigen-direction.",
      steps: [
        { do: "Confirm the mean", result: "$(0,0)$", why: "positive and negative points balance" },
        { do: "Compute sum of $x_1^2$", result: "$1+1+4+4=10$", why: "first covariance numerator" },
        { do: "Compute sum of $x_1x_2$", result: "$1+1+4+4=10$", why: "coordinates are equal in every point" },
        { do: "Write covariance", result: "$S=\\dfrac13\\begin{bmatrix}10&10\\\\10&10\\end{bmatrix}$", why: "$n-1=3$ for sample covariance" },
        { do: "Find the top eigenvector", result: "$v_1=(1,1)^T/\\sqrt2$", why: "both coordinates move together" },
        { do: "Find the top eigenvalue", result: "$20/3$", why: "$\\begin{bmatrix}10&10\\\\10&10\\end{bmatrix}$ has eigenvalue 20" },
        { do: "Find the second eigenvalue", result: "$0$", why: "there is no variation along $(1,-1)$" }
      ],
      verify: "Projecting $(2,2)$ onto $v_1$ gives $2\\sqrt2$, while projection onto $(1,-1)/\\sqrt2$ gives $0$.",
      answer: "The first principal direction is $(1,1)^T/\\sqrt2$ with variance $20/3$; the second variance is $0$.",
      connects: "PCA finds the axis where the centered cloud casts the longest shadow."
    },
    practice: [
      { problem: "Center one-dimensional data $2,4,6$ and compute its sample variance.", steps: [
        { do: "Compute the mean", result: "$(2+4+6)/3=4$", why: "center before measuring variance" },
        { do: "Subtract the mean", result: "$-2,0,2$", why: "centered data has mean zero" },
        { do: "Square deviations", result: "$4,0,4$", why: "variance uses squared distances" },
        { do: "Sum squares", result: "$8$", why: "total centered energy" },
        { do: "Divide by $n-1$", result: "$8/2=4$", why: "sample variance" }
      ], answer: "The centered values are $-2,0,2$ and the sample variance is $4$." },
      { problem: "For covariance $S=\\begin{bmatrix}5&0\\\\0&2\\end{bmatrix}$, identify PCA directions and variances.", steps: [
        { do: "Read the first eigenvalue", result: "$5$", why: "diagonal covariance" },
        { do: "Read the second eigenvalue", result: "$2$", why: "diagonal covariance" },
        { do: "Choose first direction", result: "$e_1$", why: "largest variance is along coordinate 1" },
        { do: "Choose second direction", result: "$e_2$", why: "remaining coordinate axis" },
        { do: "Order the components", result: "$e_1$ before $e_2$", why: "$5>2$" }
      ], answer: "PC1 is $e_1$ with variance $5$; PC2 is $e_2$ with variance $2$." },
      { problem: "A centered data matrix has singular values $6,2$ and $n=5$ rows. Compute PCA variances and explained fraction of PC1.", steps: [
        { do: "Square singular values", result: "$36$ and $4$", why: "variance comes from squared singular values" },
        { do: "Divide by $n-1$", result: "$9$ and $1$", why: "$n-1=4$" },
        { do: "Compute total variance", result: "$10$", why: "sum component variances" },
        { do: "Compute PC1 fraction", result: "$9/10=0.9$", why: "first variance over total" },
        { do: "Convert to percent", result: "$90\\%$", why: "interpretation" }
      ], answer: "The variances are $9$ and $1$; PC1 explains $90\\%$." },
      { problem: "Project point $x=(3,1)^T$ onto direction $v=(1,1)^T/\\sqrt2$ and reconstruct from that one component.", steps: [
        { do: "Compute the score", result: "$v^Tx=(3+1)/\\sqrt2=2\\sqrt2$", why: "projection coordinate" },
        { do: "Multiply score by direction", result: "$(2\\sqrt2)(1,1)^T/\\sqrt2$", why: "reconstruct along the direction" },
        { do: "Simplify", result: "$(2,2)^T$", why: "the square roots cancel" },
        { do: "Compute residual", result: "$(3,1)-(2,2)=(1,-1)$", why: "lost component is perpendicular" },
        { do: "Check orthogonality", result: "$(1,-1)\\cdot(1,1)=0$", why: "projection residual is perpendicular" }
      ], answer: "The one-component reconstruction is $(2,2)^T$." },
      { problem: "Choose the smallest $k$ for singular values $8,4,2$ to keep at least $95\\%$ squared energy.", steps: [
        { do: "Square singular values", result: "$64,16,4$", why: "PCA energy uses squares" },
        { do: "Compute total", result: "$84$", why: "sum all energy" },
        { do: "Check $k=1$", result: "$64/84\\approx76.2\\%$", why: "one component is not enough" },
        { do: "Check $k=2$", result: "$80/84\\approx95.2\\%$", why: "top two components pass the threshold" },
        { do: "Choose $k$", result: "$k=2$", why: "smallest value meeting 95 percent" }
      ], answer: "Keep $k=2$ components." }
    ],
    applications: [
      { title: "Dimensionality reduction", background: "PCA reduces feature dimension while keeping directions with large variance.", numbers: "Singular values $8,4,2$ need top two components for $80/84=95.2\\%$ energy." },
      { title: "Visualization", background: "High-dimensional data is often projected onto two principal components for plotting.", numbers: "If PC scores are $(2.1,-0.4)$ for one example, that point appears at those coordinates in the PCA plot." },
      { title: "Noise filtering", background: "Low-variance directions can be dominated by measurement noise, so truncating PCA can denoise.", numbers: "Variances $25,9,0.04$ suggest dropping the third direction if sensor noise variance is about $0.05$." },
      { title: "Image compression", background: "PCA and SVD both express images or patches using dominant patterns.", numbers: "Keeping 20 components for 784-pixel digits stores 20 scores per image instead of 784 raw values." },
      { title: "Whitening", background: "Whitening rescales PCA coordinates to unit variance, often before independent component methods.", numbers: "A component with variance $9$ is divided by $3$, so a score $6$ becomes $2$." },
      { title: "Embedding diagnostics", background: "PCA can reveal whether embeddings collapse into a few dominant directions.", numbers: "If PC1 explains $70\\%$ of variance, subtracting or normalizing that direction may change similarity behavior strongly." }
    ],
    applicationsClose: "PCA is disciplined simplification: rotate to variance axes, keep the loud directions, and know exactly how much you kept.",
    takeaways: ["PCA uses eigenvectors of the centered covariance matrix.", "PCA directions are orthonormal and ordered by variance.", "SVD of centered data gives the same directions through $X=U\\Sigma V^T$.", "Centering and scaling choices matter before interpreting PCA."]
  },

  "math-09-35": {
    id: "math-09-35",
    title: "Matrix norms",
    tagline: "Matrix norms put a single size on a linear map, so we can compare, bound, and debug transformations.",
    connections: { buildsOn: ["vector norms", "SVD", "matrix multiplication"], leadsTo: ["The condition number", "generalization bounds", "optimization stability"], usedWith: ["singular values", "operator norms", "Frobenius norm"] },
    motivation: "<p>You already measure vectors by length. Matrices also need a size, but there are two natural questions: how much total weight is inside, and how much can the matrix stretch an input?</p><p><b>Matrix norms</b> answer those questions. The Frobenius norm measures all entries like one long vector; the spectral norm measures the largest possible stretch.</p>",
    definition: "<p>The <b>Frobenius norm</b> is $\\|A\\|_F=\\sqrt{\\sum_{i,j}a_{ij}^2}$, the Euclidean length of all entries. The <b>spectral norm</b> is $\\|A\\|_2=\\max_{x\\ne0}\\dfrac{\\|Ax\\|_2}{\\|x\\|_2}$, the largest stretch of any vector.</p><p>SVD makes both precise: if $A$ has singular values $\\sigma_i$, then $\\|A\\|_2=\\sigma_1$ and $\\|A\\|_F=\\sqrt{\\sum_i\\sigma_i^2}$. This is why singular values are the natural scale ruler for matrices.</p><p><b>Assumptions that matter:</b> different norms answer different questions; submultiplicative norms satisfy $\\|AB\\|\\le\\|A\\|\\|B\\|$; and the spectral norm uses Euclidean vector length unless another norm is named.</p>",
    worked: {
      problem: "Compute $\\|A\\|_F$ and $\\|A\\|_2$ for $A=\\begin{bmatrix}3&0\\\\0&4\\end{bmatrix}$.",
      skills: ["Frobenius norm", "spectral norm", "singular values"],
      strategy: "The diagonal entries are the singular values, so total size and max stretch are easy to read.",
      steps: [
        { do: "Square all entries", result: "$9,0,0,16$", why: "Frobenius norm squares entries" },
        { do: "Add the squares", result: "$25$", why: "sum entry energy" },
        { do: "Take the square root", result: "$\\|A\\|_F=5$", why: "finish Frobenius norm" },
        { do: "Read singular values", result: "$4$ and $3$", why: "diagonal nonnegative stretches" },
        { do: "Take the largest singular value", result: "$\\|A\\|_2=4$", why: "spectral norm is maximum stretch" }
      ],
      verify: "$A(0,1)^T=(0,4)^T$, so a unit vector is stretched by $4$; no direction can exceed the largest singular value.",
      answer: "$\\|A\\|_F=5$ and $\\|A\\|_2=4$.",
      connects: "Frobenius sees total weight; spectral norm sees worst-case stretching."
    },
    practice: [
      { problem: "Compute $\\left\\|\\begin{bmatrix}1&2\\\\2&1\\end{bmatrix}\\right\\|_F$.", steps: [
        { do: "Square entries", result: "$1,4,4,1$", why: "Frobenius norm uses entry squares" },
        { do: "Add them", result: "$10$", why: "total squared entry size" },
        { do: "Take square root", result: "$\\sqrt{10}$", why: "norm is square root of squared size" },
        { do: "Approximate", result: "$3.162$", why: "numerical scale" },
        { do: "Check positivity", result: "nonzero norm", why: "the matrix is not zero" }
      ], answer: "$\\|A\\|_F=\\sqrt{10}\\approx3.162$." },
      { problem: "A matrix has singular values $6,2,1$. Find $\\|A\\|_2$ and $\\|A\\|_F$.", steps: [
        { do: "Choose the largest singular value", result: "$\\|A\\|_2=6$", why: "spectral norm is max stretch" },
        { do: "Square singular values", result: "$36,4,1$", why: "Frobenius energy" },
        { do: "Add squares", result: "$41$", why: "sum singular-value energy" },
        { do: "Take square root", result: "$\\sqrt{41}$", why: "finish Frobenius norm" },
        { do: "Approximate", result: "$6.403$", why: "scale comparison" }
      ], answer: "$\\|A\\|_2=6$ and $\\|A\\|_F=\\sqrt{41}\\approx6.403$." },
      { problem: "For $A=\\begin{bmatrix}0&5\\\\0&0\\end{bmatrix}$, compute $\\|A\\|_F$ and $\\|A\\|_2$.", steps: [
        { do: "Compute Frobenius square", result: "$25$", why: "only one entry is nonzero" },
        { do: "Take square root", result: "$\\|A\\|_F=5$", why: "entry norm" },
        { do: "Compute $A^TA$", result: "$\\begin{bmatrix}0&0\\\\0&25\\end{bmatrix}$", why: "singular values come from $A^TA$" },
        { do: "Read largest eigenvalue", result: "$25$", why: "diagonal matrix" },
        { do: "Take square root", result: "$\\|A\\|_2=5$", why: "largest singular value" }
      ], answer: "Both norms equal $5$ for this rank-one matrix." },
      { problem: "Use $\\|AB\\|_2\\le\\|A\\|_2\\|B\\|_2$ with $\\|A\\|_2=3$ and $\\|B\\|_2=4$.", steps: [
        { do: "Write the inequality", result: "$\\|AB\\|_2\\le\\|A\\|_2\\|B\\|_2$", why: "spectral norm is submultiplicative" },
        { do: "Substitute values", result: "$\\|AB\\|_2\\le3\\cdot4$", why: "use the given norms" },
        { do: "Multiply", result: "$12$", why: "compute the bound" },
        { do: "State the implication", result: "no vector is stretched by more than $12$", why: "operator norm bounds stretch" },
        { do: "Note sharpness", result: "actual stretch may be smaller", why: "the inequality is an upper bound" }
      ], answer: "$\\|AB\\|_2\\le12$." },
      { problem: "A weight update matrix has entries $\\\\begin{bmatrix}0.1&-0.2\\\\\\\\0.0&0.2\\\\end{bmatrix}$; compute its Frobenius norm.", steps: [
        { do: "Square entries", result: "$0.01,0.04,0,0.04$", why: "Frobenius norm squares every entry" },
        { do: "Add squares", result: "$0.09$", why: "total update energy" },
        { do: "Take square root", result: "$0.3$", why: "$\\sqrt{0.09}=0.3$" },
        { do: "Compare with entry size", result: "larger than any single entry", why: "it combines all entries" },
        { do: "Interpret", result: "update size is $0.3$", why: "Frobenius norm is a parameter-change magnitude" }
      ], answer: "The Frobenius norm is $0.3$." }
    ],
    applications: [
      { title: "Weight decay", background: "L2 regularization on matrix weights often uses the squared Frobenius norm.", numbers: "For entries $[1,2;0,3]$, $\\|W\\|_F^2=1+4+0+9=14$." },
      { title: "Lipschitz bounds", background: "The spectral norm controls how much a linear layer can amplify input changes.", numbers: "If $\\|W\\|_2=4$ and $\\|\\Delta x\\|=0.1$, then $\\|W\\Delta x\\|\\le0.4$." },
      { title: "Gradient clipping", background: "Training sometimes rescales updates when their norm is too large.", numbers: "A matrix gradient with Frobenius norm $10$ clipped to $2$ is multiplied by $0.2$." },
      { title: "Low-rank error", background: "SVD truncation error is measured cleanly by discarded singular values.", numbers: "Discarding singular values $2$ and $1$ gives Frobenius error $\\sqrt{5}$." },
      { title: "Robustness diagnostics", background: "Large operator norms can amplify adversarial or noisy perturbations.", numbers: "Two layers with spectral norms $3$ and $5$ have combined stretch at most $15$." },
      { title: "Model difference measurement", background: "Comparing checkpoints often means measuring the size of parameter changes.", numbers: "An update with entries $0.1,-0.2,0,0.2$ has Frobenius norm $0.3$." }
    ],
    applicationsClose: "Matrix norms give scale to transformations, updates, errors, and stability claims.",
    takeaways: ["$\\|A\\|_F$ is the square root of the sum of squared entries.", "$\\|A\\|_2$ is the largest singular value and largest Euclidean stretch.", "Frobenius norm measures total energy; spectral norm measures worst-case amplification.", "Norm bounds are central to regularization, clipping, compression, and robustness."]
  },

  "math-09-36": {
    id: "math-09-36",
    title: "The condition number",
    tagline: "The condition number measures how much a matrix can magnify small relative errors.",
    connections: { buildsOn: ["Matrix norms", "SVD", "linear systems"], leadsTo: ["numerical stability", "regularization", "low-rank approximation"], usedWith: ["singular values", "least squares", "matrix inverses"] },
    motivation: "<p>You already know some calculations are touchy: a tiny change in input can produce a big change in output. Matrices have the same personality.</p><p>The <b>condition number</b> measures this sensitivity. A well-conditioned matrix behaves predictably; an ill-conditioned one stretches some directions much more than others, so noise can dominate.</p>",
    definition: "<p>For an invertible matrix $A$, the 2-norm condition number is $$\\kappa_2(A)=\\|A\\|_2\\|A^{-1}\\|_2=\\dfrac{\\sigma_{\\max}}{\\sigma_{\\min}},$$ where $\\sigma_{\\max}$ and $\\sigma_{\\min}$ are the largest and smallest singular values. If $A$ is singular, $\\kappa_2(A)=\\infty$.</p><p>The ratio appears because $A$ can stretch one direction by $\\sigma_{\\max}$ while barely stretching another by $\\sigma_{\\min}$. Solving $Ax=b$ reverses those stretches, so small components in weak directions can be amplified.</p><p><b>Assumptions that matter:</b> condition number depends on the chosen norm; this lesson uses the Euclidean 2-norm; large condition number does not mean every input is unstable, but it warns that some direction is.</p>",
    worked: {
      problem: "Find $\\kappa_2(A)$ for $A=\\begin{bmatrix}10&0\\\\0&1\\end{bmatrix}$ and interpret it.",
      skills: ["singular values", "matrix norms", "sensitivity"],
      strategy: "For a diagonal positive matrix, singular values are the diagonal stretches.",
      steps: [
        { do: "Read singular values", result: "$10$ and $1$", why: "the matrix stretches coordinate axes by those amounts" },
        { do: "Identify the largest", result: "$\\sigma_{\\max}=10$", why: "maximum stretch" },
        { do: "Identify the smallest", result: "$\\sigma_{\\min}=1$", why: "minimum nonzero stretch" },
        { do: "Compute the ratio", result: "$\\kappa_2(A)=10/1=10$", why: "condition number is stretch ratio" },
        { do: "Interpret", result: "relative errors can be amplified by up to about $10$", why: "some directions are much weaker than others" }
      ],
      verify: "$A^{-1}=\\operatorname{diag}(0.1,1)$, so $\\|A\\|_2\\|A^{-1}\\|_2=10\\cdot1=10$.",
      answer: "$\\kappa_2(A)=10$.",
      connects: "Conditioning is the gap between strongest and weakest singular directions."
    },
    practice: [
      { problem: "Find $\\kappa_2$ for $A=\\operatorname{diag}(5,2)$.", steps: [
        { do: "Read singular values", result: "$5$ and $2$", why: "positive diagonal matrix" },
        { do: "Choose the maximum", result: "$5$", why: "largest stretch" },
        { do: "Choose the minimum", result: "$2$", why: "smallest stretch" },
        { do: "Divide", result: "$5/2=2.5$", why: "condition number ratio" },
        { do: "Interpret", result: "moderate sensitivity", why: "the stretches differ by a factor of 2.5" }
      ], answer: "$\\kappa_2=2.5$." },
      { problem: "A matrix has singular values $100,1,0.01$. Find its condition number if it is invertible.", steps: [
        { do: "Identify largest singular value", result: "$100$", why: "maximum stretch" },
        { do: "Identify smallest singular value", result: "$0.01$", why: "minimum nonzero stretch" },
        { do: "Form the ratio", result: "$100/0.01$", why: "definition of $\\kappa_2$" },
        { do: "Compute", result: "$10000$", why: "divide by one hundredth" },
        { do: "Interpret", result: "very ill-conditioned", why: "large error amplification is possible" }
      ], answer: "$\\kappa_2=10000$." },
      { problem: "What is the condition number of an orthogonal matrix $Q$?", steps: [
        { do: "Use length preservation", result: "$\\|Qx\\|=\\|x\\|$", why: "$Q^TQ=I$" },
        { do: "Read largest stretch", result: "$\\sigma_{\\max}=1$", why: "no vector grows" },
        { do: "Read smallest stretch", result: "$\\sigma_{\\min}=1$", why: "no vector shrinks" },
        { do: "Compute ratio", result: "$1/1=1$", why: "best possible conditioning" },
        { do: "Interpret", result: "perfectly conditioned", why: "orthogonal transformations preserve relative geometry" }
      ], answer: "$\\kappa_2(Q)=1$." },
      { problem: "If $\\kappa(A)=200$ and relative data error is $0.1\\%$, estimate the worst-case relative solution error bound.", steps: [
        { do: "Convert percent to decimal", result: "$0.1\\%=0.001$", why: "use decimal in multiplication" },
        { do: "Multiply by condition number", result: "$200\\cdot0.001$", why: "worst-case amplification bound" },
        { do: "Compute", result: "$0.2$", why: "product of sensitivity and input error" },
        { do: "Convert to percent", result: "$20\\%$", why: "interpret solution error" },
        { do: "State caution", result: "worst-case bound", why: "actual error may be smaller" }
      ], answer: "The worst-case relative solution error can be about $20\\%$." },
      { problem: "For least squares, explain why forming $A^TA$ is risky when $\\kappa(A)=50$.", steps: [
        { do: "Use the singular-value fact", result: "$\\kappa(A^TA)=\\kappa(A)^2$", why: "singular values are squared in $A^TA$" },
        { do: "Substitute $50$", result: "$50^2$", why: "square the condition number" },
        { do: "Compute", result: "$2500$", why: "conditioning worsens" },
        { do: "Compare", result: "$2500$ versus $50$", why: "normal equations amplify sensitivity" },
        { do: "Choose a safer method", result: "QR or SVD", why: "they avoid explicitly squaring the condition number" }
      ], answer: "$A^TA$ has condition number about $2500$, so QR or SVD is safer." }
    ],
    applications: [
      { title: "Linear solves", background: "Numerical linear algebra uses condition numbers to predict how input error affects solutions.", numbers: "If $\\kappa=1000$ and input error is $10^{-6}$, solution error may be around $10^{-3}$." },
      { title: "Least-squares design matrices", background: "Highly correlated features make regression coefficients unstable.", numbers: "If singular values are $20$ and $0.02$, then $\\kappa=1000$, a warning sign for coefficient variance." },
      { title: "Feature scaling", background: "Standardizing features can reduce artificial conditioning problems caused by units.", numbers: "Columns with norms $1000$ and $1$ can give stretch ratios near $1000$ before scaling." },
      { title: "Regularization", background: "Ridge regression lifts small singular directions and improves effective conditioning.", numbers: "Eigenvalues $100$ and $0.01$ become $101$ and $1.01$ after adding $1I$, reducing ratio from $10000$ to $100$." },
      { title: "Neural network layers", background: "Very large or tiny singular values can cause activation or gradient amplification and shrinkage.", numbers: "Five layers each with spectral stretch $3$ can amplify a direction by up to $3^5=243$." },
      { title: "Data inversion", background: "Inverse problems such as deblurring are sensitive when blur nearly erases some frequencies.", numbers: "A frequency singular value $0.001$ means inversion multiplies that component by $1000$." }
    ],
    applicationsClose: "The condition number is a sensitivity thermometer: it does not fix instability, but it tells you when to respect it.",
    takeaways: ["In 2-norm, $\\kappa(A)=\\sigma_{\\max}/\\sigma_{\\min}$ for invertible $A$.", "Orthogonal matrices have condition number $1$, the best possible.", "Singular matrices have infinite condition number.", "Large condition numbers warn of possible error amplification in solves, inverses, and regression."]
  },

  "math-09-37": {
    id: "math-09-37",
    title: "Tensors",
    tagline: "Tensors are arrays with axes, and deep learning is largely the art of shaping those axes correctly.",
    connections: { buildsOn: ["vectors", "matrices", "multilinear notation"], leadsTo: ["The Kronecker product", "linear maps on batches", "deep-learning layers"], usedWith: ["index notation", "matrix multiplication", "outer products"] },
    motivation: "<p>You already know scalars, vectors, and matrices. A grayscale image needs two axes, a color image needs height, width, and channel, and a batch adds another axis in front.</p><p>A <b>tensor</b> is the common language for these multi-axis arrays. The math is not mystical: it is careful bookkeeping of indices and how operations sum over them.</p>",
    definition: "<p>In ML practice, a tensor is a multidimensional array. A scalar has order 0, a vector order 1, a matrix order 2, and an array $T_{i,j,k}$ has order 3. The <b>shape</b> lists axis lengths, such as $2\\times3\\times4$.</p><p>Many tensor operations are built from two ideas: elementwise operations keep the same shape, while contractions sum over one or more matching indices. Matrix multiplication is a contraction: $(AB)_{ij}=\\sum_k A_{ik}B_{kj}$.</p><p><b>Assumptions that matter:</b> ML libraries use specific axis conventions; reshaping changes how entries are grouped but not their values; broadcasting can silently repeat axes; and tensor in ML often means array, while tensor in differential geometry has a stricter transformation meaning.</p>",
    worked: {
      problem: "A batch of $2$ RGB images has shape $2\\times4\\times4\\times3$. How many numbers are stored, and what is the shape after flattening each image?",
      skills: ["shape reading", "flattening", "axis bookkeeping"],
      strategy: "Multiply axis lengths for storage, then keep the batch axis and combine image axes.",
      steps: [
        { do: "Identify the axes", result: "batch $2$, height $4$, width $4$, channels $3$", why: "read the shape in order" },
        { do: "Multiply image axes", result: "$4\\cdot4\\cdot3=48$", why: "one image has 48 numbers" },
        { do: "Multiply by batch size", result: "$2\\cdot48=96$", why: "two images are stored" },
        { do: "Keep the batch axis", result: "$2$", why: "flattening each image does not merge examples" },
        { do: "Flatten each image", result: "shape $2\\times48$", why: "height, width, and channel axes combine" }
      ],
      verify: "The flattened tensor still stores $2\\cdot48=96$ numbers, so no data was added or removed.",
      answer: "It stores $96$ numbers; flattened per image, the shape is $2\\times48$.",
      connects: "Tensor work is often preserving meaning while changing shape."
    },
    practice: [
      { problem: "How many entries are in a tensor of shape $3\\times5\\times2$?", steps: [
        { do: "Read axis lengths", result: "$3$, $5$, and $2$", why: "shape lists sizes" },
        { do: "Multiply first two", result: "$3\\cdot5=15$", why: "count entries in the first two axes" },
        { do: "Multiply by the third", result: "$15\\cdot2=30$", why: "include all axes" },
        { do: "Attach meaning", result: "$30$ entries", why: "total storage is product of dimensions" },
        { do: "Check order", result: "order $3$", why: "there are three axes" }
      ], answer: "The tensor has $30$ entries and order $3$." },
      { problem: "A tensor has shape $10\\times20\\times30$. Reshape it to $10\\times600$. Verify the entry count.", steps: [
        { do: "Compute original count", result: "$10\\cdot20\\cdot30=6000$", why: "product of dimensions" },
        { do: "Compute new count", result: "$10\\cdot600=6000$", why: "reshaping must preserve entries" },
        { do: "Compare counts", result: "$6000=6000$", why: "the reshape is valid" },
        { do: "Identify merged axes", result: "$20\\cdot30=600$", why: "last two axes were combined" },
        { do: "State result", result: "valid reshape", why: "no entries are lost or created" }
      ], answer: "The reshape is valid because both shapes contain $6000$ entries." },
      { problem: "For matrices, compute $(AB)_{12}$ when row 1 of $A$ is $(2,3)$ and column 2 of $B$ is $(4,5)^T$.", steps: [
        { do: "Write the contraction", result: "$(AB)_{12}=\\sum_k A_{1k}B_{k2}$", why: "matrix multiplication sums over $k$" },
        { do: "Substitute entries", result: "$2\\cdot4+3\\cdot5$", why: "match row and column entries" },
        { do: "Multiply", result: "$8+15$", why: "compute products" },
        { do: "Add", result: "$23$", why: "sum over the contracted index" },
        { do: "Interpret", result: "one output entry", why: "a contraction reduces the shared axis" }
      ], answer: "$(AB)_{12}=23$." },
      { problem: "A tensor of shape $8\\times16\\times32$ is summed over the middle axis. What is the output shape and how many additions per output entry?", steps: [
        { do: "Identify the summed axis", result: "length $16$", why: "middle axis is contracted" },
        { do: "Remove that axis", result: "shape $8\\times32$", why: "summation collapses the summed index" },
        { do: "Count terms per output", result: "$16$", why: "one term from each middle-axis position" },
        { do: "Count additions", result: "$15$", why: "adding 16 numbers takes 15 binary additions" },
        { do: "Check output entries", result: "$8\\cdot32=256$", why: "remaining axes define outputs" }
      ], answer: "The output shape is $8\\times32$, with 16 terms and 15 additions per output entry." },
      { problem: "A mini-batch has shape $32\\times128$ and a weight matrix has shape $128\\times10$. What is the output shape?", steps: [
        { do: "Identify batch size", result: "$32$", why: "first axis counts examples" },
        { do: "Check matching feature dimension", result: "$128$ matches $128$", why: "matrix multiplication contracts this axis" },
        { do: "Identify output features", result: "$10$", why: "second dimension of the weight matrix" },
        { do: "Write output shape", result: "$32\\times10$", why: "batch axis remains and feature axis changes" },
        { do: "Count outputs", result: "$320$", why: "$32\\cdot10$ predictions or logits" }
      ], answer: "The output shape is $32\\times10$." }
    ],
    applications: [
      { title: "Image batches", background: "Computer vision models process images as tensors with batch, spatial, and channel axes.", numbers: "A batch $16\\times224\\times224\\times3$ stores $16\\cdot224\\cdot224\\cdot3=2,408,448$ numbers." },
      { title: "Transformer activations", background: "Language models use tensors indexed by batch, token position, and hidden channel.", numbers: "Shape $4\\times128\\times768$ contains $393,216$ activation values." },
      { title: "Convolution kernels", background: "A convolution layer stores filters with spatial, input-channel, and output-channel axes.", numbers: "A $3\\times3\\times64\\times128$ kernel has $73,728$ weights." },
      { title: "Attention scores", background: "Attention forms pairwise token scores for each head and example.", numbers: "Batch $2$, heads $8$, sequence $128$ gives score tensor $2\\times8\\times128\\times128=262,144$ entries." },
      { title: "Broadcasting bias", background: "Bias vectors are often broadcast across batch and sequence axes.", numbers: "Adding bias shape $768$ to activations $4\\times128\\times768$ reuses the 768 numbers across $512$ token examples." },
      { title: "Loss aggregation", background: "Training losses often reduce tensors by summing or averaging over examples and tokens.", numbers: "A token-loss tensor $32\\times50$ has $1600$ losses; its mean divides their sum by $1600$." }
    ],
    applicationsClose: "Tensors are the shape grammar of ML: once axes are clear, operations become sums, broadcasts, reshapes, and linear maps.",
    takeaways: ["In ML, a tensor is a multidimensional array with a shape.", "Entry count is the product of axis lengths.", "Contractions sum over matching indices; matrix multiplication is the basic example.", "Clear axis bookkeeping prevents many deep-learning bugs."]
  },

  "math-09-38": {
    id: "math-09-38",
    title: "The Kronecker product",
    tagline: "The Kronecker product builds big structured matrices from small ones, block by block.",
    connections: { buildsOn: ["Tensors", "matrix multiplication", "block matrices"], leadsTo: ["low-rank factorization", "tensor reshaping", "structured linear maps"], usedWith: ["vectorization", "outer products", "separable operators"] },
    motivation: "<p>You already know how a scalar times a matrix scales every entry. The Kronecker product does that idea repeatedly: each entry of one matrix scales a full copy of another matrix.</p><p>This creates large matrices with strong structure. In ML and scientific computing, that structure can save memory, speed computation, and express separable transformations.</p>",
    definition: "<p>For matrices $A=[a_{ij}]$ of size $m\\times n$ and $B$ of size $p\\times q$, the <b>Kronecker product</b> $A\\otimes B$ is the $mp\\times nq$ block matrix where block $(i,j)$ is $a_{ij}B$.</p><p>A key identity connects it to vectorization: $\\operatorname{vec}(AXB^T)=(B\\otimes A)\\operatorname{vec}(X)$, when dimensions match and $\\operatorname{vec}$ stacks columns. This is how two smaller left-right transformations become one large linear map on a flattened matrix.</p><p><b>Assumptions that matter:</b> order matters, so usually $A\\otimes B\\ne B\\otimes A$; vectorization convention matters; and Kronecker structure is useful only when the problem truly separates across axes.</p>",
    worked: {
      problem: "Compute $A\\otimes B$ for $A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$ and $B=\\begin{bmatrix}0&5\\\\6&7\\end{bmatrix}$.",
      skills: ["block matrices", "scalar multiplication", "shape tracking"],
      strategy: "Replace each entry of $A$ by that entry times the whole matrix $B$.",
      steps: [
        { do: "Compute the first block", result: "$1B=\\begin{bmatrix}0&5\\\\6&7\\end{bmatrix}$", why: "top-left entry of $A$ is 1" },
        { do: "Compute the second block", result: "$2B=\\begin{bmatrix}0&10\\\\12&14\\end{bmatrix}$", why: "top-right entry of $A$ is 2" },
        { do: "Compute the third block", result: "$3B=\\begin{bmatrix}0&15\\\\18&21\\end{bmatrix}$", why: "bottom-left entry of $A$ is 3" },
        { do: "Compute the fourth block", result: "$4B=\\begin{bmatrix}0&20\\\\24&28\\end{bmatrix}$", why: "bottom-right entry of $A$ is 4" },
        { do: "Assemble the blocks", result: "$\\begin{bmatrix}0&5&0&10\\\\6&7&12&14\\\\0&15&0&20\\\\18&21&24&28\\end{bmatrix}$", why: "place blocks in the same layout as $A$" }
      ],
      verify: "The result is $4\\times4$ because both inputs are $2\\times2$, so dimensions multiply.",
      answer: "$A\\otimes B=\\begin{bmatrix}0&5&0&10\\\\6&7&12&14\\\\0&15&0&20\\\\18&21&24&28\\end{bmatrix}$.",
      connects: "Kronecker products turn scalar entries into whole blocks."
    },
    practice: [
      { problem: "Compute $[2\\ 3]\\otimes\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}$.", steps: [
        { do: "Identify blocks", result: "$2I$ and $3I$", why: "the row has two entries" },
        { do: "Compute $2I$", result: "$\\begin{bmatrix}2&0\\\\0&2\\end{bmatrix}$", why: "scale the identity" },
        { do: "Compute $3I$", result: "$\\begin{bmatrix}3&0\\\\0&3\\end{bmatrix}$", why: "scale the identity" },
        { do: "Place blocks side by side", result: "$\\begin{bmatrix}2&0&3&0\\\\0&2&0&3\\end{bmatrix}$", why: "the first matrix is a row" },
        { do: "Check shape", result: "$2\\times4$", why: "$(1\\cdot2)\\times(2\\cdot2)$" }
      ], answer: "$\\begin{bmatrix}2&0&3&0\\\\0&2&0&3\\end{bmatrix}$." },
      { problem: "Find the shape of $A\\otimes B$ if $A$ is $3\\times2$ and $B$ is $4\\times5$.", steps: [
        { do: "Multiply row counts", result: "$3\\cdot4=12$", why: "each row of $A$ creates 4 block rows" },
        { do: "Multiply column counts", result: "$2\\cdot5=10$", why: "each column of $A$ creates 5 block columns" },
        { do: "Write the shape", result: "$12\\times10$", why: "dimensions multiply" },
        { do: "Check block count", result: "$3\\cdot2=6$ blocks", why: "one block per entry of $A$" },
        { do: "Check block size", result: "$4\\times5$", why: "each block is a scaled $B$" }
      ], answer: "$A\\otimes B$ has shape $12\\times10$." },
      { problem: "Compute $\\begin{bmatrix}1\\\\2\\end{bmatrix}\\otimes\\begin{bmatrix}3\\\\4\\end{bmatrix}$.", steps: [
        { do: "Scale $B$ by the first entry", result: "$1B=(3,4)^T$", why: "top block" },
        { do: "Scale $B$ by the second entry", result: "$2B=(6,8)^T$", why: "bottom block" },
        { do: "Stack the blocks", result: "$(3,4,6,8)^T$", why: "the first matrix is a column" },
        { do: "Check shape", result: "$4\\times1$", why: "$(2\\cdot2)\\times(1\\cdot1)$" },
        { do: "Interpret", result: "all pairwise products", why: "column Kronecker product lists products of entries" }
      ], answer: "$(3,4,6,8)^T$." },
      { problem: "Use $(A\\otimes B)^T=A^T\\otimes B^T$ for $A$ of shape $2\\times3$ and $B$ of shape $4\\times1$ to find the transpose shape.", steps: [
        { do: "Find $A\\otimes B$ shape", result: "$(2\\cdot4)\\times(3\\cdot1)=8\\times3$", why: "multiply dimensions" },
        { do: "Transpose the shape", result: "$3\\times8$", why: "rows and columns swap" },
        { do: "Find $A^T$ shape", result: "$3\\times2$", why: "transpose of $A$" },
        { do: "Find $B^T$ shape", result: "$1\\times4$", why: "transpose of $B$" },
        { do: "Check product shape", result: "$(3\\cdot1)\\times(2\\cdot4)=3\\times8$", why: "identity is dimensionally consistent" }
      ], answer: "The transpose shape is $3\\times8$." },
      { problem: "A separable image transform uses $Y=AXB^T$ with $A$ $2\\times2$, $X$ $2\\times3$, and $B$ $3\\times3$. What is the size of the equivalent Kronecker matrix on $\\operatorname{vec}(X)$?", steps: [
        { do: "Count entries in $X$", result: "$2\\cdot3=6$", why: "vectorized input length" },
        { do: "Find shape of $Y$", result: "$2\\times3$", why: "$A$ changes rows and $B^T$ preserves three columns" },
        { do: "Count entries in $Y$", result: "$6$", why: "vectorized output length" },
        { do: "Write equivalent matrix", result: "$B\\otimes A$", why: "vectorization identity" },
        { do: "Find its shape", result: "$6\\times6$", why: "it maps $\\operatorname{vec}(X)$ to $\\operatorname{vec}(Y)$" }
      ], answer: "The equivalent Kronecker matrix is $6\\times6$." }
    ],
    applications: [
      { title: "Separable image filters", background: "A 2-D blur can sometimes be applied as separate row and column operations instead of one huge matrix.", numbers: "A $100\\times100$ image has $10000$ pixels; two $100\\times100$ factors use $20000$ entries instead of a dense $10000\\times10000$ matrix." },
      { title: "Structured covariance", background: "Multi-axis data may use covariance that separates time and space with a Kronecker product.", numbers: "A time covariance $10\\times10$ and sensor covariance $5\\times5$ produce a $50\\times50$ covariance from only $100+25$ stored entries." },
      { title: "Fast linear layers", background: "Kronecker-factored weights approximate a large matrix with smaller factors.", numbers: "A $64\\times64$ dense matrix has $4096$ weights; $8\\times8$ and $8\\times8$ Kronecker factors have $128$ weights." },
      { title: "Second-order optimization", background: "K-FAC approximates neural-network curvature with Kronecker factors to make natural-gradient steps practical.", numbers: "Factors $100\\times100$ and $50\\times50$ store $12500$ entries versus a dense $5000\\times5000$ matrix with $25,000,000$." },
      { title: "Tensor product features", background: "Feature crosses can be represented as products of entries from two feature vectors.", numbers: "Vectors of lengths $3$ and $4$ create $12$ pairwise product features." },
      { title: "Grid operators", background: "Finite-difference operators on rectangular grids often separate into Kronecker sums and products.", numbers: "A $20\\times30$ grid has $600$ states, but row and column operators are only $20\\times20$ and $30\\times30$." }
    ],
    applicationsClose: "The Kronecker product is block structure made algebraic: small maps combine into large maps without forgetting their axes.",
    takeaways: ["$A\\otimes B$ replaces each entry $a_{ij}$ with the block $a_{ij}B$.", "Shapes multiply: $(m\\times n)\\otimes(p\\times q)$ becomes $mp\\times nq$.", "Vectorization identities connect Kronecker products to matrix transformations on flattened tensors.", "Kronecker structure saves memory when a large map separates across axes."]
  },

  "math-09-39": {
    id: "math-09-39",
    title: "Weights as linear maps; low-rank factorization",
    tagline: "A neural-network weight matrix is a linear map, and low-rank factorization is a disciplined way to make that map smaller and trainable.",
    connections: { buildsOn: ["SVD", "matrix rank", "matrix multiplication"], leadsTo: ["representation learning", "efficient fine-tuning", "model compression"], usedWith: ["linear maps", "low-rank approximation", "matrix norms"] },
    motivation: "<p>You already multiply inputs by a matrix: $y=Wx$. In a neural network, that matrix is not just a table of numbers. It is a learned linear map from one representation space to another.</p><p>The ML capstone idea is that many useful updates or weights are lower-dimensional than they look. <b>Low-rank factorization</b> writes a big matrix as two skinny matrices, reducing parameters and focusing learning on a smaller subspace.</p>",
    definition: "<p>A weight matrix $W\\in\\mathbb{R}^{m\\times n}$ maps an input vector $x\\in\\mathbb{R}^n$ to output $y=Wx\\in\\mathbb{R}^m$. If $W$ has rank $r$, it can be factored as $W=BA$ with $B\\in\\mathbb{R}^{m\\times r}$ and $A\\in\\mathbb{R}^{r\\times n}$. The computation becomes $$x\\mapsto A x\\mapsto B(Ax).$$</p><p>When $r\\ll\\min(m,n)$, the factorization stores $r(m+n)$ parameters instead of $mn$. SVD gives the best rank-$r$ approximation $W_r=U_r\\Sigma_rV_r^T$. In LoRA-style fine-tuning, the frozen base weight $W_0$ is updated by a trainable low-rank matrix $\\Delta W=BA$, so the layer uses $W_0x+BAx$.</p><p><b>Assumptions that matter:</b> low rank restricts the update to an $r$-dimensional bottleneck; rank must be chosen large enough for the task; and factorization saves parameters only when $r(m+n)<mn$.</p>",
    worked: {
      problem: "A frozen $4\\times3$ weight $W_0$ is adapted by LoRA-style $\\Delta W=BA$ with rank $r=2$, where $A=\\begin{bmatrix}1&0&2\\\\0&1&-1\\end{bmatrix}$ and $B=\\begin{bmatrix}1&0\\\\0&2\\\\1&1\\\\-1&1\\end{bmatrix}$. For $x=(2,3,1)^T$, compute $\\Delta y=BAx$ and compare parameter counts.",
      skills: ["linear maps", "low-rank multiplication", "parameter counting"],
      strategy: "Use the bottleneck first: compute $Ax$, then map that small vector back up with $B$.",
      steps: [
        { do: "Compute the first bottleneck coordinate", result: "$1\\cdot2+0\\cdot3+2\\cdot1=4$", why: "first row of $A$ dotted with $x$" },
        { do: "Compute the second bottleneck coordinate", result: "$0\\cdot2+1\\cdot3-1\\cdot1=2$", why: "second row of $A$ dotted with $x$" },
        { do: "Write the bottleneck vector", result: "$z=Ax=(4,2)^T$", why: "rank 2 update passes through two numbers" },
        { do: "Compute the first output update", result: "$1\\cdot4+0\\cdot2=4$", why: "first row of $B$" },
        { do: "Compute the second output update", result: "$0\\cdot4+2\\cdot2=4$", why: "second row of $B$" },
        { do: "Compute the third output update", result: "$1\\cdot4+1\\cdot2=6$", why: "third row of $B$" },
        { do: "Compute the fourth output update", result: "$-1\\cdot4+1\\cdot2=-2$", why: "fourth row of $B$" },
        { do: "Count dense update parameters", result: "$4\\cdot3=12$", why: "a full update matrix has one parameter per entry" },
        { do: "Count low-rank parameters", result: "$2(4+3)=14$", why: "$B$ has $4\\cdot2$ and $A$ has $2\\cdot3$ parameters" }
      ],
      verify: "Here rank 2 does not save parameters because the example is tiny; for large matrices the same formula can save a lot.",
      answer: "$\\Delta y=(4,4,6,-2)^T$. Dense has $12$ parameters; this tiny rank-2 factorization has $14$.",
      connects: "Low-rank updates are useful because they change a large map through a small intermediate representation."
    },
    practice: [
      { problem: "A dense weight maps $128$ inputs to $64$ outputs. How many parameters does it have?", steps: [
        { do: "Identify output dimension", result: "$64$", why: "rows of the weight matrix" },
        { do: "Identify input dimension", result: "$128$", why: "columns of the weight matrix" },
        { do: "Multiply dimensions", result: "$64\\cdot128$", why: "one parameter per matrix entry" },
        { do: "Compute", result: "$8192$", why: "dense parameter count" },
        { do: "State map shape", result: "$W\\in\\mathbb{R}^{64\\times128}$", why: "maps $\\mathbb{R}^{128}$ to $\\mathbb{R}^{64}$" }
      ], answer: "The dense layer has $8192$ parameters." },
      { problem: "For the same $64\\times128$ layer, count rank-$8$ factor parameters $B\\in\\mathbb{R}^{64\\times8}$ and $A\\in\\mathbb{R}^{8\\times128}$.", steps: [
        { do: "Count $B$ parameters", result: "$64\\cdot8=512$", why: "output-by-rank factor" },
        { do: "Count $A$ parameters", result: "$8\\cdot128=1024$", why: "rank-by-input factor" },
        { do: "Add factor parameters", result: "$512+1024=1536$", why: "both factors are trainable" },
        { do: "Compare with dense", result: "$1536<8192$", why: "rank 8 saves parameters" },
        { do: "Compute percent", result: "$1536/8192=18.75\\%$", why: "fraction of dense parameters" }
      ], answer: "Rank 8 uses $1536$ parameters, $18.75\\%$ of the dense layer." },
      { problem: "Let $A=\\begin{bmatrix}1&2&0\\end{bmatrix}$ and $B=\\begin{bmatrix}3\\\\-1\\end{bmatrix}$. Compute $BA$ and its rank.", steps: [
        { do: "Multiply first row of $B$ by $A$", result: "$3A=(3,6,0)$", why: "outer-product row from first output" },
        { do: "Multiply second row of $B$ by $A$", result: "$-1A=(-1,-2,0)$", why: "outer-product row from second output" },
        { do: "Assemble $BA$", result: "$\\begin{bmatrix}3&6&0\\\\-1&-2&0\\end{bmatrix}$", why: "rank-one product" },
        { do: "Compare rows", result: "row 2 is $-1/3$ row 1", why: "rows are dependent" },
        { do: "State rank", result: "$1$", why: "nonzero outer product has rank 1" }
      ], answer: "$BA=\\begin{bmatrix}3&6&0\\\\-1&-2&0\\end{bmatrix}$ with rank $1$." },
      { problem: "A matrix has singular values $20,5,1$. What is the Frobenius error of its best rank-1 approximation?", steps: [
        { do: "Identify discarded singular values", result: "$5$ and $1$", why: "rank 1 keeps only the largest" },
        { do: "Square discarded values", result: "$25$ and $1$", why: "Frobenius error squares discarded singular values" },
        { do: "Add them", result: "$26$", why: "total discarded energy" },
        { do: "Take square root", result: "$\\sqrt{26}$", why: "Frobenius norm error" },
        { do: "Approximate", result: "$5.10$", why: "numerical error size" }
      ], answer: "The best rank-1 Frobenius error is $\\sqrt{26}\\approx5.10$." },
      { problem: "A LoRA update for a $4096\\times4096$ weight uses rank $8$. Compare trainable update parameters with a dense update.", steps: [
        { do: "Count dense update parameters", result: "$4096\\cdot4096=16,777,216$", why: "full matrix update" },
        { do: "Count $B$ parameters", result: "$4096\\cdot8=32,768$", why: "output-by-rank factor" },
        { do: "Count $A$ parameters", result: "$8\\cdot4096=32,768$", why: "rank-by-input factor" },
        { do: "Add LoRA parameters", result: "$65,536$", why: "both low-rank factors are trained" },
        { do: "Compute fraction", result: "$65,536/16,777,216=1/256\\approx0.39\\%$", why: "low rank is much smaller" }
      ], answer: "Rank-8 LoRA trains $65,536$ parameters, about $0.39\\%$ of a dense $4096\\times4096$ update." }
    ],
    applications: [
      { title: "LoRA fine-tuning", background: "LoRA freezes a pretrained weight and trains a low-rank update, making adaptation cheaper while preserving the base model.", numbers: "For $4096\\times4096$ and rank $8$, train $65,536$ update parameters instead of $16,777,216$." },
      { title: "Bottleneck linear layers", background: "A factorization $W=BA$ computes through a smaller hidden dimension, like a linear bottleneck.", numbers: "A $512\\times512$ dense map has $262,144$ weights; rank $32$ factors use $32(512+512)=32,768$." },
      { title: "Model compression", background: "SVD can replace a trained dense matrix by a lower-rank approximation when singular values decay.", numbers: "Singular values $20,5,1$ keep rank 1 with error $\\sqrt{26}$ and retain $400/(426)\\approx93.9\\%$ energy." },
      { title: "Embedding factorization", background: "Large user-item or token-context tables can be modeled as products of lower-dimensional embeddings.", numbers: "A $10000\\times5000$ table has $50,000,000$ entries; rank $64$ factors use $64(10000+5000)=960,000$." },
      { title: "Adapter modules", background: "Adapters often down-project activations, apply a small transformation, then up-project, mirroring low-rank maps.", numbers: "Hidden size $768$ with bottleneck $16$ uses $768\\cdot16+16\\cdot768=24,576$ weights before biases." },
      { title: "Controlling update capacity", background: "Low rank limits how many independent directions a fine-tuning update can change, which can reduce overfitting.", numbers: "Rank $4$ update $BA$ maps every input through only 4 intermediate coordinates, no matter how large $m$ and $n$ are." }
    ],
    applicationsClose: "Weights as linear maps make ML architecture concrete: every factorization changes parameter count, compute path, rank, and what directions the model can adapt.",
    takeaways: ["A weight matrix maps inputs by $y=Wx$.", "A rank-$r$ factorization $W=BA$ uses $r(m+n)$ parameters instead of $mn$.", "SVD gives the best low-rank approximation to an existing matrix.", "LoRA-style updates train $\\Delta W=BA$ while keeping the base weight frozen."]
  }
};
