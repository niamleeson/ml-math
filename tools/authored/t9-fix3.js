module.exports = {
  "math-09-35": {
    id: "math-09-35",
    title: "Matrix norms",
    tagline: "A matrix norm measures how large a linear transformation is, either by its entries or by its biggest possible stretch.",
    connections: {
      buildsOn: ["Vector norms", "Matrix-vector multiplication", "Eigenvalues and eigenvectors"],
      leadsTo: ["condition numbers", "singular value decomposition", "regularization in linear models"],
      usedWith: ["dot products", "orthogonality", "quadratic forms", "least squares"]
    },
    motivation:
      "<p>You already know how to measure the length of a vector. For $v=\\begin{bmatrix}3 \\ 4\\end{bmatrix}$, the Euclidean length is $5$. A matrix asks for one more layer of thinking: is the matrix large because its entries are large, or because it can stretch some input vector a lot?</p>" +
      "<p><b>Matrix norms</b> give both readings. The Frobenius norm treats the matrix like one long list of entries. The spectral norm treats the matrix like a transformation and asks for its largest stretch. In ML, both ideas show up constantly: parameter size, perturbation size, stable training, and sensitivity to noise.</p>",
    definition:
      "<p>For a matrix $A=[a_{ij}]$, the <b>Frobenius norm</b> is $\\|A\\|_F=\\sqrt{\\sum_{i,j} a_{ij}^2}$. It is the ordinary Euclidean length of all entries after flattening the matrix into one vector.</p>" +
      "<p>The <b>spectral norm</b> is $\\|A\\|_2=\\max_{x\\ne0}\\dfrac{\\|Ax\\|_2}{\\|x\\|_2}=\\sigma_{\\max}(A)$. It measures the largest factor by which $A$ can stretch any nonzero vector. For a real matrix, $\\|A\\|_2=\\sqrt{\\lambda_{\\max}(A^T A)}$, because $\\|Ax\\|_2^2=x^T A^T A x$ and the largest Rayleigh quotient of the symmetric matrix $A^T A$ is its largest eigenvalue.</p>" +
      "<p><b>Assumptions that matter:</b> entries are real unless stated otherwise; $\\|x\\|_2$ is the Euclidean vector norm; $\\sigma_{\\max}(A)$ means the largest singular value; norms are nonnegative, equal zero only for the zero matrix, scale by $|c|$ under multiplication by a scalar, and obey the triangle inequality. The spectral norm is an operator norm, so it also satisfies $\\|Ax\\|_2\\le\\|A\\|_2\\|x\\|_2$.</p>",
    worked: {
      problem: "For $A=\\begin{bmatrix}1 & 2 \\ 0 & 3\\end{bmatrix}$, compute $\\|A\\|_F$ and $\\|A\\|_2$.",
      skills: ["Frobenius norm", "transpose products", "eigenvalues", "spectral norm"],
      strategy: "The entries give $\\|A\\|_F$ directly; the largest stretch comes from the largest eigenvalue of $A^T A$.",
      steps: [
        { do: "Square the entries", result: "$1^2+2^2+0^2+3^2$", why: "the Frobenius norm sums entry squares" },
        { do: "Add the squares", result: "$14$", why: "$1+4+0+9=14$" },
        { do: "Take the square root", result: "$\\|A\\|_F=\\sqrt{14}\\approx3.742$", why: "finish the Frobenius norm" },
        { do: "Form the transpose", result: "$A^T=\\begin{bmatrix}1 & 0 \\ 2 & 3\\end{bmatrix}$", why: "columns become rows" },
        { do: "Multiply $A^T A$", result: "$\\begin{bmatrix}1 & 0 \\ 2 & 3\\end{bmatrix}\\begin{bmatrix}1 & 2 \\ 0 & 3\\end{bmatrix}=\\begin{bmatrix}1 & 2 \\ 2 & 13\\end{bmatrix}$", why: "spectral norm uses the symmetric product" },
        { do: "Write the characteristic equation", result: "$\\det\\left(\\begin{bmatrix}1-\\lambda & 2 \\ 2 & 13-\\lambda\\end{bmatrix}\\right)=0$", why: "eigenvalues make the determinant zero" },
        { do: "Expand the determinant", result: "$(1-\\lambda)(13-\\lambda)-4=0$", why: "use $ad-bc$ for a $2\\times2$ determinant" },
        { do: "Simplify the polynomial", result: "$\\lambda^2-14\\lambda+9=0$", why: "collect like terms" },
        { do: "Solve for the larger eigenvalue", result: "$\\lambda_{\\max}=7+2\\sqrt{10}\\approx13.325$", why: "the quadratic formula gives $7\\pm2\\sqrt{10}$" },
        { do: "Take the square root", result: "$\\|A\\|_2=\\sqrt{7+2\\sqrt{10}}\\approx3.650$", why: "the spectral norm is the square root of the largest eigenvalue of $A^T A$" }
      ],
      verify: "$\\|A\\|_2\\le\\|A\\|_F$ here, since $3.650\\le3.742$; that is expected because the biggest stretch cannot exceed the total entry energy.",
      answer: "$\\|A\\|_F=\\sqrt{14}\\approx3.742$ and $\\|A\\|_2=\\sqrt{7+2\\sqrt{10}}\\approx3.650$.",
      connects: "The Frobenius norm reads the matrix as data; the spectral norm reads it as an action on vectors."
    },
    practice: [
      { problem: "Compute the Frobenius norm of $B=\\begin{bmatrix}2 & -1 \\ 2 & 4\\end{bmatrix}$.", steps: [
        { do: "List the entries", result: "$2,-1,2,4$", why: "the Frobenius norm uses every entry" },
        { do: "Square the entries", result: "$2^2+(-1)^2+2^2+4^2$", why: "signs disappear when squared" },
        { do: "Add the squares", result: "$4+1+4+16=25$", why: "sum the entry energies" },
        { do: "Take the square root", result: "$\\sqrt{25}=5$", why: "the norm is the square root of the sum" },
        { do: "State the norm", result: "$\\|B\\|_F=5$", why: "attach the matrix-norm notation" }
      ], answer: "$\\|B\\|_F=5$." },
      { problem: "For the diagonal matrix $D=\\begin{bmatrix}4 & 0 \\ 0 & -2\\end{bmatrix}$, compute $\\|D\\|_F$ and $\\|D\\|_2$.", steps: [
        { do: "Square the diagonal entries", result: "$4^2+(-2)^2$", why: "the off-diagonal entries are zero" },
        { do: "Compute the Frobenius sum", result: "$16+4=20$", why: "add the nonzero entry squares" },
        { do: "Take the Frobenius square root", result: "$\\|D\\|_F=\\sqrt{20}=2\\sqrt5$", why: "simplify the radical" },
        { do: "Read the coordinate stretches", result: "$4$ and $2$", why: "a diagonal matrix scales coordinate axes by the absolute diagonal values" },
        { do: "Choose the largest stretch", result: "$\\|D\\|_2=4$", why: "the spectral norm is the maximum stretch" }
      ], answer: "$\\|D\\|_F=2\\sqrt5$ and $\\|D\\|_2=4$." },
      { problem: "For $C=\\begin{bmatrix}1 & 0 \\ 0 & 2\\end{bmatrix}$ and $x=\\begin{bmatrix}3 \\ 4\\end{bmatrix}$, verify $\\|Cx\\|_2\\le\\|C\\|_2\\|x\\|_2$.", steps: [
        { do: "Compute the matrix-vector product", result: "$Cx=\\begin{bmatrix}3 \\ 8\\end{bmatrix}$", why: "the second coordinate is doubled" },
        { do: "Compute $\\|Cx\\|_2$", result: "$\\sqrt{3^2+8^2}=\\sqrt{73}$", why: "use the Euclidean norm" },
        { do: "Compute $\\|x\\|_2$", result: "$\\sqrt{3^2+4^2}=5$", why: "the vector is a $3$-$4$-$5$ triangle" },
        { do: "Read $\\|C\\|_2$", result: "$2$", why: "the largest diagonal stretch is 2" },
        { do: "Compare both sides", result: "$\\sqrt{73}\\le10$", why: "$\\sqrt{73}\\approx8.544$ and $\\|C\\|_2\\|x\\|_2=2\\cdot5=10$" }
      ], answer: "$\\|Cx\\|_2=\\sqrt{73}$ and $\\|C\\|_2\\|x\\|_2=10$, so the inequality holds." },
      { problem: "For $R=\\begin{bmatrix}0 & -1 \\ 1 & 0\\end{bmatrix}$, compute $\\|R\\|_F$ and $\\|R\\|_2$.", steps: [
        { do: "Square the entries", result: "$0^2+(-1)^2+1^2+0^2$", why: "the Frobenius norm counts all entries" },
        { do: "Add the squares", result: "$2$", why: "two entries have magnitude 1" },
        { do: "Take the Frobenius square root", result: "$\\|R\\|_F=\\sqrt2$", why: "finish the entrywise norm" },
        { do: "Compute $R^T R$", result: "$\\begin{bmatrix}0 & 1 \\ -1 & 0\\end{bmatrix}\\begin{bmatrix}0 & -1 \\ 1 & 0\\end{bmatrix}=\\begin{bmatrix}1 & 0 \\ 0 & 1\\end{bmatrix}$", why: "a rotation preserves lengths" },
        { do: "Take the largest singular value", result: "$\\|R\\|_2=1$", why: "the largest eigenvalue of $R^T R$ is 1, and its square root is 1" }
      ], answer: "$\\|R\\|_F=\\sqrt2$ and $\\|R\\|_2=1$." },
      { problem: "A weight-update matrix is $E=\\begin{bmatrix}0.1 & -0.2 \\ 0.0 & 0.2\\end{bmatrix}$. Compute $\\|E\\|_F$ and decide whether it is below a clipping threshold of $0.35$.", steps: [
        { do: "Square the entries", result: "$0.1^2+(-0.2)^2+0.0^2+0.2^2$", why: "the Frobenius norm measures total update size" },
        { do: "Compute each square", result: "$0.01+0.04+0+0.04$", why: "square each decimal carefully" },
        { do: "Add the squares", result: "$0.09$", why: "sum the update energy" },
        { do: "Take the square root", result: "$\\|E\\|_F=0.3$", why: "$\\sqrt{0.09}=0.3$" },
        { do: "Compare with the threshold", result: "$0.3<0.35$", why: "the update is smaller than the clipping limit" }
      ], answer: "$\\|E\\|_F=0.3$, so it is below the $0.35$ clipping threshold." }
    ],
    applications: [
      { title: "Weight decay in linear models", background: "Regularization became central in statistics because models with smaller parameters often generalize better. Matrix norms make smallness measurable for a whole weight table.", numbers: "For weights $W=\\begin{bmatrix}1 & -2 \\ 0 & 2\\end{bmatrix}$, $\\|W\\|_F=\\sqrt{1+4+0+4}=3$, so an $L_2$ penalty with strength $0.01$ contributes $0.01\\cdot9=0.09$ if it uses $\\|W\\|_F^2$." },
      { title: "Gradient clipping", background: "Deep-learning optimizers clip large updates to avoid unstable jumps. The Frobenius norm is the natural size measure when a gradient is a matrix.", numbers: "For $G=\\begin{bmatrix}3 & 4 \\ 0 & 0\\end{bmatrix}$, $\\|G\\|_F=5$. A clip threshold $2$ rescales by $2/5=0.4$, producing entries $1.2,1.6,0,0$." },
      { title: "Sensitivity of a linear layer", background: "A neural-network layer $y=Wx$ cannot amplify input changes by more than its spectral norm. This is why spectral normalization is used to control Lipschitz behavior.", numbers: "If $\\|W\\|_2=1.8$ and an input perturbation has $\\|\\Delta x\\|_2=0.05$, then $\\|W\\Delta x\\|_2\\le1.8\\cdot0.05=0.09$." },
      { title: "Image filter energy", background: "Convolution kernels are small matrices. Their Frobenius norm measures total filter energy, a useful sanity check in signal processing and computer vision.", numbers: "For edge filter $K=\\begin{bmatrix}1 & 0 & -1 \\ 1 & 0 & -1 \\ 1 & 0 & -1\\end{bmatrix}$, $\\|K\\|_F=\\sqrt{6}\\approx2.449$ because six entries have square $1$." },
      { title: "Low-rank approximation error", background: "The Eckart-Young theorem connects singular values to best low-rank approximations. Frobenius error tells how much squared energy remains after truncation.", numbers: "If singular values are $5,2,1$, the best rank-$1$ Frobenius error is $\\sqrt{2^2+1^2}=\\sqrt5\\approx2.236$." },
      { title: "Condition numbers", background: "Numerical linear algebra studies how input errors grow when solving systems. The spectral norm feeds the common condition number $\\kappa_2(A)=\\|A\\|_2\\|A^{-1}\\|_2$.", numbers: "If $\\|A\\|_2=10$ and $\\|A^{-1}\\|_2=0.4$, then $\\kappa_2(A)=4$, so relative errors can be amplified by about a factor of $4$." },
      { title: "Covariance and whitening", background: "Whitening rescales data so directions have comparable variance. The spectral norm of a covariance matrix reads the largest variance direction.", numbers: "For covariance $\\Sigma=\\begin{bmatrix}9 & 0 \\ 0 & 1\\end{bmatrix}$, $\\|\\Sigma\\|_2=9$; after scaling by $\\begin{bmatrix}1/3 & 0 \\ 0 & 1\\end{bmatrix}$, both variances become $1$." }
    ],
    applicationsClose: "Across regularization, clipping, filtering, compression, conditioning, and whitening, matrix norms turn a table of numbers into a dependable statement about size or stretch.",
    takeaways: [
      "$\\|A\\|_F=\\sqrt{\\sum_{i,j}a_{ij}^2}$ is the Euclidean length of all matrix entries.",
      "$\\|A\\|_2=\\sigma_{\\max}(A)$ is the largest factor by which $A$ stretches a vector.",
      "For real matrices, $\\|A\\|_2=\\sqrt{\\lambda_{\\max}(A^T A)}$.",
      "Frobenius norms are convenient for total parameter or error size; spectral norms control sensitivity and amplification."
    ]
  }
};
