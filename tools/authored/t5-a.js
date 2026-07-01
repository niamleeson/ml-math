module.exports = {
  "math-05-01": {
    id: "math-05-01",
    title: "Vector spaces",
    tagline: "A vector space is where adding directions and scaling them keeps you inside the same world.",
    connections: {
      buildsOn: ["vectors", "scalars", "systems of equations"],
      leadsTo: ["Linear operators", "Norms and normed spaces", "Hilbert spaces"],
      usedWith: ["subspaces", "linear combinations", "span", "bases"]
    },
    motivation:
      "<p>You already add arrows and multiply them by numbers. If a feature vector is $[2,5]$, doubling it gives $[4,10]$, and adding $[1,-1]$ gives $[3,4]$.</p>" +
      "<p>A <b>vector space</b> is the setting where those two operations are legal and reliable. Functional analysis begins by letting the vectors be functions, signals, or infinite sequences, not just short coordinate lists.</p>",
    definition:
      "<p>A <b>vector space</b> $V$ over a field such as $\\mathbb{R}$ is a set whose elements can be added and multiplied by scalars. For $u,v\\in V$ and $a\\in\\mathbb{R}$, closure requires $u+v\\in V$ and $av\\in V$. The operations also obey the familiar rules: associativity, commutativity of addition, a zero vector, additive inverses, distributive laws, and $1v=v$.</p>" +
      "<p>The reason these rules matter is that they make linear combinations meaningful. If $a_1v_1+\\cdots+a_kv_k$ always stays in $V$, then span, basis, dimension, and linear maps have a stable home.</p>" +
      "<p><b>Assumptions that matter:</b> the scalar field must be fixed; the zero vector must be in the set; and checking a proposed space usually reduces to checking closure under addition and scalar multiplication, because the other rules are inherited from the ambient space.</p>",
    worked: {
      problem: "Show that $W=\\{(x,y)\\in\\mathbb{R}^2: x+y=0\\}$ is a vector space under ordinary addition and scalar multiplication.",
      skills: ["closure", "zero vector", "subspaces"],
      strategy: "Treat $W$ as a subset of $\\mathbb{R}^2$ and check whether addition and scaling preserve the defining equation.",
      steps: [
        { do: "Write a typical vector in $W$", result: "$u=(a,-a)$", why: "$a+(-a)=0$" },
        { do: "Write another typical vector in $W$", result: "$v=(b,-b)$", why: "use a second arbitrary input" },
        { do: "Add the vectors", result: "$u+v=(a+b,-a-b)$", why: "add coordinates" },
        { do: "Check the defining equation", result: "$(a+b)+(-a-b)=0$", why: "the sum stays in $W$" },
        { do: "Scale a typical vector", result: "$cu=(ca,-ca)$", why: "multiply each coordinate by $c$" },
        { do: "Check the scaled equation", result: "$ca+(-ca)=0$", why: "the scalar multiple stays in $W$" },
        { do: "Check the zero vector", result: "$(0,0)\\in W$", why: "$0+0=0$" }
      ],
      verify: "The set is a line through the origin, and lines through the origin are the geometric subspaces of $\\mathbb{R}^2$.",
      answer: "$W$ is a vector space, more specifically a subspace of $\\mathbb{R}^2$.",
      connects: "Vector spaces are sets where linear combinations cannot escape."
    },
    practice: [
      { problem: "Decide whether $U=\\{(x,y): y=2x\\}$ is a vector space.", steps: [
        { do: "Write a typical vector", result: "$(a,2a)$", why: "it satisfies $y=2x$" },
        { do: "Add two typical vectors", result: "$(a,2a)+(b,2b)=(a+b,2a+2b)$", why: "test closure under addition" },
        { do: "Rewrite the second coordinate", result: "$2a+2b=2(a+b)$", why: "the sum has the same form" },
        { do: "Scale a typical vector", result: "$c(a,2a)=(ca,2ca)$", why: "test closure under scalar multiplication" },
        { do: "Check zero", result: "$(0,0)$ satisfies $0=2\\cdot0$", why: "the zero vector is present" }
      ], answer: "$U$ is a vector space." },
      { problem: "Decide whether $A=\\{(x,y): x+y=1\\}$ is a vector space.", steps: [
        { do: "Check the zero vector", result: "$(0,0)$ gives $0+0=0$", why: "a vector space must contain zero" },
        { do: "Compare with the condition", result: "$0\\ne1$", why: "zero is not in $A$" },
        { do: "Give a vector in $A$", result: "$(1,0)\\in A$", why: "$1+0=1$" },
        { do: "Scale it by $2$", result: "$2(1,0)=(2,0)$", why: "test scalar closure" },
        { do: "Check membership", result: "$2+0=2\\ne1$", why: "scaling leaves the set" }
      ], answer: "$A$ is not a vector space." },
      { problem: "Show that all polynomials of degree at most $2$ form a vector space.", steps: [
        { do: "Write two typical elements", result: "$p=a+bx+cx^2$ and $q=d+ex+fx^2$", why: "degree at most $2$ means no higher powers" },
        { do: "Add them", result: "$p+q=(a+d)+(b+e)x+(c+f)x^2$", why: "combine like terms" },
        { do: "Check the degree", result: "degree at most $2$", why: "no $x^3$ term appears" },
        { do: "Scale $p$ by $r$", result: "$rp=ra+rbx+rcx^2$", why: "multiply each coefficient" },
        { do: "Check the zero polynomial", result: "$0+0x+0x^2$", why: "it belongs to the set" }
      ], answer: "The set is a vector space." },
      { problem: "Is $P=\\{p: p(0)=1\\}$ a vector space of functions?", steps: [
        { do: "Check the zero function", result: "$0(0)=0$", why: "zero must belong to any vector space" },
        { do: "Compare with the condition", result: "$0\\ne1$", why: "the zero function is missing" },
        { do: "Choose one member", result: "$p(x)=1$", why: "$p(0)=1$" },
        { do: "Scale by $2$", result: "$(2p)(0)=2$", why: "scalar multiplication changes the required value" },
        { do: "Check membership", result: "$2p\\notin P$", why: "the condition $p(0)=1$ fails" }
      ], answer: "$P$ is not a vector space." },
      { problem: "For vectors $v_1=(1,0)$ and $v_2=(1,1)$, express $(3,2)$ as a linear combination.", steps: [
        { do: "Set up the combination", result: "$a(1,0)+b(1,1)=(3,2)$", why: "use unknown coefficients" },
        { do: "Add coordinates", result: "$(a+b,b)=(3,2)$", why: "combine the two scaled vectors" },
        { do: "Read the second coordinate", result: "$b=2$", why: "coordinates must match" },
        { do: "Use the first coordinate", result: "$a+2=3$", why: "substitute $b=2$" },
        { do: "Solve for $a$", result: "$a=1$", why: "subtract $2$" }
      ], answer: "$(3,2)=1v_1+2v_2$." }
    ],
    applications: [
      { title: "Feature vectors", background: "Machine-learning examples are usually encoded as vectors so arithmetic can be shared across data points.", numbers: "If $x=[2,5]$ and $z=[1,-1]$, then $0.5x+z=[2,1.5]$, still a valid two-feature vector." },
      { title: "Image space", background: "A grayscale image with fixed size can be treated as one vector of pixel intensities.", numbers: "Two $2$ by $2$ images $[1,2,3,4]$ and $[4,3,2,1]$ average to $[2.5,2.5,2.5,2.5]$." },
      { title: "Polynomial models", background: "Regression with polynomial features uses a vector space of basis functions.", numbers: "$3+2x-x^2$ plus $1+x^2$ equals $4+2x$, still degree at most $2$." },
      { title: "Signals", background: "Audio and sensor traces are functions, and many function families behave like vector spaces.", numbers: "Signals $s(t)=2t$ and $r(t)=1-t$ combine as $s+r=1+t$." },
      { title: "Embeddings", background: "Text and item embeddings are vectors so systems can add, average, and compare them.", numbers: "A mean embedding of $[1,3]$, $[2,5]$, and $[4,1]$ is $[7/3,3]$." },
      { title: "Constraint subspaces", background: "Linear constraints through the origin define feasible directions in optimization.", numbers: "The constraint $x_1+x_2+x_3=0$ accepts $[1,-1,0]$ and $[2,0,-2]$; their sum $[3,-1,-2]$ also sums to $0$." }
    ],
    applicationsClose: "The common thread is closure: once your objects form a vector space, linear combinations become safe moves.",
    takeaways: [
      "A vector space is closed under vector addition and scalar multiplication.",
      "The zero vector is a fast test: if it is missing, the set is not a vector space.",
      "Functions, polynomials, signals, images, and embeddings can all be vectors when the operations fit."
    ]
  },

  "math-05-02": {
    id: "math-05-02",
    title: "Linear operators",
    tagline: "A linear operator respects the two moves a vector space knows: add and scale.",
    connections: {
      buildsOn: ["Vector spaces", "linear combinations", "matrices"],
      leadsTo: ["Norms and normed spaces", "Bounded linear operators", "eigenvectors"],
      usedWith: ["matrix multiplication", "kernels", "range", "composition"]
    },
    motivation:
      "<p>You already know matrices as machines that turn one vector into another. A matrix sends $[1,2]$ to a new vector by multiplying and adding coordinates.</p>" +
      "<p>A <b>linear operator</b> is the same idea in a wider setting. It may act on coordinate vectors, functions, signals, or sequences, but it must preserve linear combinations exactly.</p>",
    definition:
      "<p>A map $T:V\\to W$ between vector spaces is <b>linear</b> if for every $u,v\\in V$ and scalars $a,b$, $$T(au+bv)=aT(u)+bT(v).$$ This one statement contains additivity $T(u+v)=T(u)+T(v)$ and homogeneity $T(av)=aT(v)$.</p>" +
      "<p>The formula is powerful because it says the operator is determined by what it does to a basis. If $x=c_1v_1+\\cdots+c_nv_n$, then $T(x)=c_1T(v_1)+\\cdots+c_nT(v_n)$.</p>" +
      "<p><b>Assumptions that matter:</b> the domain and codomain must be vector spaces over the same scalar field; linearity must hold for all vectors and scalars, not just examples; and maps with offsets, such as $T(x)=Ax+b$ with $b\\ne0$, are affine rather than linear.</p>",
    worked: {
      problem: "Let $T(x,y)=(2x-y,x+3y)$. Show that $T$ is linear and compute $T(3,-1)$.",
      skills: ["operator notation", "linearity", "coordinate computation"],
      strategy: "First recognize the matrix form, then evaluate the requested vector.",
      steps: [
        { do: "Write $T$ as a matrix", result: "$T(x,y)=\\begin{bmatrix}2&-1\\\\1&3\\end{bmatrix}\\begin{bmatrix}x\\\\y\\end{bmatrix}$", why: "each output coordinate is a linear combination of inputs" },
        { do: "Name the matrix", result: "$A=\\begin{bmatrix}2&-1\\\\1&3\\end{bmatrix}$", why: "matrix multiplication is linear" },
        { do: "State the linearity rule", result: "$A(au+bv)=aAu+bAv$", why: "matrix multiplication distributes over addition and scaling" },
        { do: "Substitute $(3,-1)$", result: "$T(3,-1)=(2\\cdot3-(-1),3+3(-1))$", why: "use the operator formula" },
        { do: "Simplify the first coordinate", result: "$7$", why: "$6+1=7$" },
        { do: "Simplify the second coordinate", result: "$0$", why: "$3-3=0$" }
      ],
      verify: "Also $T(0,0)=(0,0)$, which every linear map must satisfy.",
      answer: "$T$ is linear and $T(3,-1)=(7,0)$.",
      connects: "Linear operators are structure-preserving maps between vector spaces."
    },
    practice: [
      { problem: "Decide whether $S(x,y)=(x+y,2x)$ is linear.", steps: [
        { do: "Write the first output", result: "$x+y$", why: "a linear combination of inputs" },
        { do: "Write the second output", result: "$2x$", why: "also a linear combination" },
        { do: "Write a matrix", result: "$\\begin{bmatrix}1&1\\\\2&0\\end{bmatrix}$", why: "matrix form proves linearity" },
        { do: "Check zero", result: "$S(0,0)=(0,0)$", why: "necessary for linearity" },
        { do: "State the conclusion", result: "linear", why: "matrix maps are linear" }
      ], answer: "$S$ is linear." },
      { problem: "Decide whether $F(x)=2x+1$ from $\\mathbb{R}$ to $\\mathbb{R}$ is linear.", steps: [
        { do: "Evaluate zero", result: "$F(0)=1$", why: "linear maps must send zero to zero" },
        { do: "Compare with zero", result: "$1\\ne0$", why: "the necessary condition fails" },
        { do: "Test additivity with $1$ and $2$", result: "$F(3)=7$", why: "left side" },
        { do: "Compute $F(1)+F(2)$", result: "$3+5=8$", why: "right side" },
        { do: "Compare", result: "$7\\ne8$", why: "additivity fails" }
      ], answer: "$F$ is not linear." },
      { problem: "For $D(p)=p'$ on polynomials, compute $D(3x^2-2x+5)$ and explain linearity.", steps: [
        { do: "Differentiate $3x^2$", result: "$6x$", why: "power rule" },
        { do: "Differentiate $-2x$", result: "$-2$", why: "derivative of $ax$ is $a$" },
        { do: "Differentiate $5$", result: "$0$", why: "constant derivative" },
        { do: "Combine", result: "$D(p)=6x-2$", why: "derivative distributes over sums" },
        { do: "State linearity", result: "$D(ap+bq)=aD(p)+bD(q)$", why: "derivatives preserve addition and scaling" }
      ], answer: "$D(3x^2-2x+5)=6x-2$, and $D$ is linear." },
      { problem: "If $T(e_1)=(1,2)$ and $T(e_2)=(3,-1)$, compute $T(4,5)$.", steps: [
        { do: "Write $(4,5)$ in the standard basis", result: "$4e_1+5e_2$", why: "coordinates are basis coefficients" },
        { do: "Apply linearity", result: "$T(4,5)=4T(e_1)+5T(e_2)$", why: "linear maps preserve combinations" },
        { do: "Substitute images", result: "$4(1,2)+5(3,-1)$", why: "use the given operator values" },
        { do: "Scale", result: "$(4,8)+(15,-5)$", why: "multiply coordinates" },
        { do: "Add", result: "$(19,3)$", why: "combine coordinates" }
      ], answer: "$T(4,5)=(19,3)$." },
      { problem: "Let $A=\\begin{bmatrix}1&2\\\\0&-1\\end{bmatrix}$ and $B=\\begin{bmatrix}3&0\\\\1&1\\end{bmatrix}$. Compute $(AB)(1,2)$.", steps: [
        { do: "Apply $B$ first", result: "$B\\begin{bmatrix}1\\\\2\\end{bmatrix}=\\begin{bmatrix}3\\\\3\\end{bmatrix}$", why: "composition $AB$ means $A(Bx)$" },
        { do: "Apply $A$ to the result", result: "$A\\begin{bmatrix}3\\\\3\\end{bmatrix}=\\begin{bmatrix}9\\\\-3\\end{bmatrix}$", why: "multiply the second matrix output" },
        { do: "Compute $AB$ directly", result: "$\\begin{bmatrix}5&2\\\\-1&-1\\end{bmatrix}$", why: "matrix product represents composition" },
        { do: "Apply $AB$", result: "$\\begin{bmatrix}5&2\\\\-1&-1\\end{bmatrix}\\begin{bmatrix}1\\\\2\\end{bmatrix}=\\begin{bmatrix}9\\\\-3\\end{bmatrix}$", why: "direct check" },
        { do: "Compare", result: "both methods match", why: "operator composition is matrix multiplication" }
      ], answer: "$(AB)(1,2)=(9,-3)$." }
    ],
    applications: [
      { title: "Dense neural-network layers", background: "A dense layer before adding bias is a linear operator from input features to hidden units.", numbers: "With $A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$ and $x=[1,2]$, $Ax=[5,11]$." },
      { title: "Convolutions", background: "Signal filters are linear when the filter weights are fixed, which is why they can be analyzed as operators.", numbers: "Kernel $[1,0,-1]$ on samples $[2,5,4]$ gives $1\\cdot2+0\\cdot5-1\\cdot4=-2$." },
      { title: "Differentiation", background: "Calculus operators such as differentiation are linear on suitable function spaces.", numbers: "If $p=3x^2$ and $q=5x$, then $(p+q)'=6x+5=p'+q'$." },
      { title: "Expectation", background: "Probability uses expectation as a linear operator from random variables to numbers.", numbers: "If $E[X]=2$ and $E[Y]=5$, then $E[3X-Y]=6-5=1$." },
      { title: "Dimensionality reduction", background: "PCA projection is a linear operator that keeps selected directions.", numbers: "Projecting $[3,4]$ onto the first coordinate gives $[3,0]$." },
      { title: "Graph transformations", background: "Adjacency matrices act linearly on node-feature vectors in graph learning.", numbers: "For $A=\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$ and features $[7,2]$, $Ax=[2,7]$." }
    ],
    applicationsClose: "Whenever a system distributes over add-and-scale, linear-operator thinking lets you study the whole map from a few reliable rules.",
    takeaways: [
      "A linear operator satisfies $T(au+bv)=aT(u)+bT(v)$.",
      "Matrices, derivatives, expectations, and fixed convolutions are central examples.",
      "Offsets break linearity, even when the rest of the formula looks matrix-like."
    ]
  },

  "math-05-03": {
    id: "math-05-03",
    title: "Norms and normed spaces",
    tagline: "A norm turns vectors into lengths, giving size and distance a common language.",
    connections: {
      buildsOn: ["Vector spaces", "absolute value", "distance"],
      leadsTo: ["Banach spaces and completeness", "Inner products", "Bounded linear operators"],
      usedWith: ["metrics", "unit balls", "convergence", "inequalities"]
    },
    motivation:
      "<p>You already measure ordinary vectors by length. The vector $(3,4)$ has length $5$, and that number tells you how large the vector is.</p>" +
      "<p>A <b>norm</b> extends length to many vector spaces, including spaces of functions. Once a norm is chosen, we can discuss distance, convergence, stability, and error in one precise vocabulary.</p>",
    definition:
      "<p>A <b>norm</b> on a vector space $V$ is a function $\\|\\cdot\\|:V\\to[0,\\infty)$ satisfying three rules: $\\|v\\|=0$ only for $v=0$, $\\|av\\|=|a|\\|v\\|$, and $\\|u+v\\|\\le\\|u\\|+\\|v\\|$. A vector space with a chosen norm is a <b>normed space</b>.</p>" +
      "<p>The triangle inequality is the key geometric rule. Going from $0$ to $u+v$ directly cannot be longer than going first to $u$ and then adding $v$. The norm also creates distance by $d(u,v)=\\|u-v\\|$.</p>" +
      "<p><b>Assumptions that matter:</b> different norms can live on the same vector space; convergence depends on the chosen norm; and in finite dimensions common norms agree about which sequences converge, although they measure sizes differently.</p>",
    worked: {
      problem: "Compute $\\|x\\|_1$, $\\|x\\|_2$, and $\\|x\\|_\\infty$ for $x=(3,-4,12)$.",
      skills: ["norm formulas", "absolute values", "Euclidean length"],
      strategy: "Use each norm's definition: sum, square-root of sum of squares, and maximum coordinate size.",
      steps: [
        { do: "Take absolute values", result: "$|3|=3,\\ |-4|=4,\\ |12|=12$", why: "all three norms use coordinate magnitudes" },
        { do: "Compute the $1$-norm", result: "$\\|x\\|_1=3+4+12=19$", why: "add magnitudes" },
        { do: "Square the coordinates", result: "$3^2=9,\\ (-4)^2=16,\\ 12^2=144$", why: "prepare for Euclidean length" },
        { do: "Add the squares", result: "$9+16+144=169$", why: "sum of squared coordinates" },
        { do: "Take the square root", result: "$\\|x\\|_2=13$", why: "$\\sqrt{169}=13$" },
        { do: "Take the largest magnitude", result: "$\\|x\\|_\\infty=12$", why: "maximum coordinate size" }
      ],
      verify: "The sizes obey $\\|x\\|_\\infty\\le\\|x\\|_2\\le\\|x\\|_1$, here $12\\le13\\le19$.",
      answer: "$\\|x\\|_1=19$, $\\|x\\|_2=13$, and $\\|x\\|_\\infty=12$.",
      connects: "Different norms measure the same vector with different notions of size."
    },
    practice: [
      { problem: "Compute the distance between $u=(1,5)$ and $v=(4,1)$ using $\\|\\cdot\\|_2$.", steps: [
        { do: "Subtract the vectors", result: "$u-v=(-3,4)$", why: "distance uses the difference" },
        { do: "Square the first coordinate", result: "$(-3)^2=9$", why: "Euclidean norm squares components" },
        { do: "Square the second coordinate", result: "$4^2=16$", why: "second component contribution" },
        { do: "Add the squares", result: "$25$", why: "$9+16=25$" },
        { do: "Take the square root", result: "$5$", why: "$\\sqrt{25}=5$" }
      ], answer: "$d(u,v)=5$." },
      { problem: "For $x=(-2,0,5)$, compute $\\|2x\\|_1$ and compare with $2\\|x\\|_1$.", steps: [
        { do: "Compute $2x$", result: "$(-4,0,10)$", why: "scale each coordinate" },
        { do: "Compute $\\|2x\\|_1$", result: "$4+0+10=14$", why: "sum magnitudes" },
        { do: "Compute $\\|x\\|_1$", result: "$2+0+5=7$", why: "original size" },
        { do: "Multiply by $2$", result: "$2\\|x\\|_1=14$", why: "homogeneity prediction" },
        { do: "Compare", result: "$\\|2x\\|_1=2\\|x\\|_1$", why: "the norm scales correctly" }
      ], answer: "Both values are $14$." },
      { problem: "Verify the triangle inequality for $u=(1,2)$ and $v=(3,-1)$ with $\\|\\cdot\\|_1$.", steps: [
        { do: "Compute $u+v$", result: "$(4,1)$", why: "left side uses the sum" },
        { do: "Compute $\\|u+v\\|_1$", result: "$4+1=5$", why: "sum absolute values" },
        { do: "Compute $\\|u\\|_1$", result: "$1+2=3$", why: "first size" },
        { do: "Compute $\\|v\\|_1$", result: "$3+1=4$", why: "second size" },
        { do: "Compare", result: "$5\\le3+4$", why: "triangle inequality holds" }
      ], answer: "$\\|u+v\\|_1=5\\le7=\\|u\\|_1+\\|v\\|_1$." },
      { problem: "For $f(t)=t$ on $[0,1]$, compute $\\|f\\|_\\infty$ and $\\|f\\|_1=\\int_0^1|f(t)|\\,dt$.", steps: [
        { do: "Find the largest value", result: "$\\max_{0\\le t\\le1}|t|=1$", why: "$t$ increases from $0$ to $1$" },
        { do: "State the sup norm", result: "$\\|f\\|_\\infty=1$", why: "largest magnitude" },
        { do: "Remove the absolute value", result: "$|t|=t$ on $[0,1]$", why: "the function is nonnegative" },
        { do: "Integrate", result: "$\\int_0^1 t\\,dt=\\frac12$", why: "area under a line" },
        { do: "State the integral norm", result: "$\\|f\\|_1=\\frac12$", why: "total magnitude over the interval" }
      ], answer: "$\\|f\\|_\\infty=1$ and $\\|f\\|_1=\\tfrac12$." },
      { problem: "A model update changes weights from $w=(1,-2,2)$ to $w'=(1.1,-1.7,1.9)$. Compute the $\\ell_2$ update size.", steps: [
        { do: "Subtract", result: "$w'-w=(0.1,0.3,-0.1)$", why: "the update is the difference" },
        { do: "Square components", result: "$0.01,\\ 0.09,\\ 0.01$", why: "Euclidean norm" },
        { do: "Add squares", result: "$0.11$", why: "$0.01+0.09+0.01=0.11$" },
        { do: "Take the square root", result: "$\\sqrt{0.11}\\approx0.332$", why: "update length" },
        { do: "Interpret", result: "about $0.332$", why: "a single number measures the step" }
      ], answer: "The update has $\\ell_2$ norm about $0.332$." }
    ],
    applications: [
      { title: "Training error", background: "Losses often measure prediction error by a norm of residuals.", numbers: "Residuals $[2,-1,2]$ have $\\ell_2$ norm $\\sqrt{4+1+4}=3$." },
      { title: "Regularization", background: "Norm penalties keep parameter vectors from growing too large.", numbers: "Weights $[3,4]$ have $\\ell_2$ penalty $\\|w\\|_2^2=25$." },
      { title: "Gradient clipping", background: "Optimizers cap update size by rescaling large gradient vectors.", numbers: "Gradient $[6,8]$ has norm $10$; clipping to norm $5$ scales it to $[3,4]$." },
      { title: "Adversarial perturbations", background: "Robustness work measures how small an input change can fool a model.", numbers: "Perturbation $[0.01,-0.02,0.02]$ has $\\ell_\\infty$ size $0.02$." },
      { title: "Nearest neighbors", background: "Retrieval systems need a distance between embeddings before they can search.", numbers: "Embeddings $[1,2]$ and $[4,6]$ are Euclidean distance $5$ apart." },
      { title: "Function approximation", background: "Approximation theory measures the error between functions with norms.", numbers: "If $|f(t)-g(t)|\\le0.03$ for all $t$, then $\\|f-g\\|_\\infty\\le0.03$." }
    ],
    applicationsClose: "A norm is the measuring stick that turns abstract vectors into sizes, distances, errors, and stable comparisons.",
    takeaways: [
      "A norm is nonnegative, scales by absolute scalar size, and satisfies the triangle inequality.",
      "A normed space is a vector space together with a chosen norm.",
      "Different norms answer different practical questions about size and error."
    ]
  },

  "math-05-04": {
    id: "math-05-04",
    title: "Banach spaces and completeness",
    tagline: "A Banach space has no missing limit points: every internally converging sequence lands inside.",
    connections: {
      buildsOn: ["Norms and normed spaces", "sequences", "limits"],
      leadsTo: ["Hilbert spaces", "fixed-point theorems", "bounded linear operators"],
      usedWith: ["Cauchy sequences", "convergence", "closed subspaces", "series"]
    },
    motivation:
      "<p>You have seen decimal approximations like $1$, $1.4$, $1.41$, $1.414$. The terms get closer to each other because they are trying to reach $\\sqrt2$.</p>" +
      "<p><b>Completeness</b> asks whether the place you are working contains the limit of every sequence that should converge. A <b>Banach space</b> is a normed space complete enough that limits do not fall through cracks.</p>",
    definition:
      "<p>A sequence $(x_n)$ in a normed space is <b>Cauchy</b> if for every tolerance $\\varepsilon>0$, there is an index $N$ such that $\\|x_n-x_m\\|<\\varepsilon$ whenever $n,m\\ge N$. A normed space is <b>complete</b> if every Cauchy sequence converges to a point in the space. A complete normed space is called a <b>Banach space</b>.</p>" +
      "<p>Cauchy means the terms eventually crowd together, even if we do not yet know the destination. Completeness says every such crowding sequence has a destination inside the same space.</p>" +
      "<p><b>Assumptions that matter:</b> Cauchy is measured with the chosen norm; a sequence can be Cauchy in a larger space while failing to converge inside a smaller one; and finite-dimensional normed spaces over $\\mathbb{R}$ are complete, but infinite-dimensional function spaces require care.</p>",
    worked: {
      problem: "Show that $x_n=1/n$ is Cauchy in $\\mathbb{R}$ and find its limit.",
      skills: ["Cauchy sequences", "epsilon estimates", "limits"],
      strategy: "Make both late terms small, then their difference is small by the triangle inequality.",
      steps: [
        { do: "Choose a tolerance", result: "$\\varepsilon>0$", why: "Cauchy requires an arbitrary target accuracy" },
        { do: "Pick $N$", result: "$N>2/\\varepsilon$", why: "late reciprocals will be below $\\varepsilon/2$" },
        { do: "Assume $n,m\\ge N$", result: "$1/n<\\varepsilon/2$ and $1/m<\\varepsilon/2$", why: "reciprocals decrease" },
        { do: "Bound the difference", result: "$|1/n-1/m|\\le1/n+1/m$", why: "triangle inequality" },
        { do: "Substitute the bounds", result: "$|1/n-1/m|<\\varepsilon$", why: "$\\varepsilon/2+\\varepsilon/2=\\varepsilon$" },
        { do: "Find the ordinary limit", result: "$1/n\\to0$", why: "reciprocals approach zero" }
      ],
      verify: "The limit $0$ belongs to $\\mathbb{R}$, so this Cauchy sequence converges inside the space.",
      answer: "$(1/n)$ is Cauchy in $\\mathbb{R}$ and converges to $0$.",
      connects: "Completeness is about whether every Cauchy sequence has such an in-space destination."
    },
    practice: [
      { problem: "Show that the constant sequence $x_n=5$ is Cauchy.", steps: [
        { do: "Take two late terms", result: "$x_n=5$ and $x_m=5$", why: "the sequence is constant" },
        { do: "Compute the difference", result: "$|x_n-x_m|=|5-5|$", why: "Cauchy uses pairwise distances" },
        { do: "Simplify", result: "$0$", why: "the terms are identical" },
        { do: "Compare with $\\varepsilon$", result: "$0<\\varepsilon$", why: "every positive tolerance works" },
        { do: "Choose $N$", result: "$N=1$", why: "no waiting is needed" }
      ], answer: "The sequence is Cauchy and converges to $5$." },
      { problem: "Is $x_n=(-1)^n$ Cauchy in $\\mathbb{R}$?", steps: [
        { do: "Look at consecutive terms", result: "$x_{2k}=1$ and $x_{2k+1}=-1$", why: "the sequence alternates" },
        { do: "Compute their distance", result: "$|1-(-1)|=2$", why: "late terms stay far apart" },
        { do: "Choose a tolerance", result: "$\\varepsilon=1$", why: "one counter-tolerance is enough" },
        { do: "Compare", result: "$2>1$", why: "the Cauchy condition fails" },
        { do: "Conclude", result: "not Cauchy", why: "no late index makes all pairwise distances small" }
      ], answer: "$(-1)^n$ is not Cauchy." },
      { problem: "In the space $\\mathbb{Q}$ with the usual norm, explain why decimal approximations to $\\sqrt2$ reveal incompleteness.", steps: [
        { do: "List rational approximations", result: "$1,1.4,1.41,1.414,\\ldots$", why: "each finite decimal is rational" },
        { do: "Observe the target", result: "the sequence approaches $\\sqrt2$", why: "the decimals refine the square root" },
        { do: "Use convergence in $\\mathbb{R}$", result: "convergent sequences are Cauchy", why: "the terms get mutually close" },
        { do: "Check the limit's membership", result: "$\\sqrt2\\notin\\mathbb{Q}$", why: "the square root of $2$ is irrational" },
        { do: "State the consequence", result: "$\\mathbb{Q}$ is not complete", why: "a Cauchy sequence has no rational limit" }
      ], answer: "$\\mathbb{Q}$ is not a Banach space under the usual norm." },
      { problem: "Show that $\\mathbb{R}^2$ with $\\|\\cdot\\|_2$ contains the limit of $x_n=(1/n,2-1/n)$.", steps: [
        { do: "Take coordinate limits", result: "$1/n\\to0$ and $2-1/n\\to2$", why: "ordinary real limits" },
        { do: "State the vector limit", result: "$(0,2)$", why: "coordinatewise limits define the candidate" },
        { do: "Check membership", result: "$(0,2)\\in\\mathbb{R}^2$", why: "both coordinates are real" },
        { do: "Compute the error vector", result: "$(1/n,-1/n)$", why: "subtract the limit" },
        { do: "Compute the error norm", result: "$\\sqrt{2}/n\\to0$", why: "Euclidean distance goes to zero" }
      ], answer: "$x_n\\to(0,2)$ inside $\\mathbb{R}^2$." },
      { problem: "A contraction iteration has errors $e_n\\le10(0.5)^n$. How many iterations make $e_n<0.01$?", steps: [
        { do: "Set the target inequality", result: "$10(0.5)^n<0.01$", why: "error must be below tolerance" },
        { do: "Divide by $10$", result: "$(0.5)^n<0.001$", why: "isolate the geometric factor" },
        { do: "Rewrite with powers of $2$", result: "$2^{-n}<10^{-3}$", why: "$0.5=2^{-1}$" },
        { do: "Test $n=10$", result: "$2^{-10}=1/1024\\approx0.000977$", why: "slightly below $0.001$" },
        { do: "State the iteration count", result: "$n=10$", why: "this is the first integer that works" }
      ], answer: "After $10$ iterations, the error is below $0.01$." }
    ],
    applications: [
      { title: "Fixed-point algorithms", background: "Banach's fixed-point theorem guarantees convergence for contractions on complete spaces.", numbers: "If error shrinks by $0.5$ each step from $10$, after $10$ steps it is $10/1024\\approx0.00977$." },
      { title: "Infinite series of updates", background: "Optimization and numerical methods often add infinitely many corrections, so the sum needs a complete home.", numbers: "Updates with norms $1/2,1/4,1/8,\\ldots$ have total size $1$." },
      { title: "Uniform limits of functions", background: "Spaces of continuous functions with sup norm are Banach spaces, so uniform limits stay continuous.", numbers: "If $\\|f_n-f\\|_\\infty<0.001$, every output differs by less than $0.001$." },
      { title: "Stable numerical solvers", background: "Completeness lets a sequence of approximations converge to an actual solution rather than a missing object.", numbers: "Approximations $0.7,0.70,0.707,0.7071$ can converge to $1/\\sqrt2\\approx0.7071$ in $\\mathbb{R}$." },
      { title: "Parameter spaces", background: "Finite-dimensional weight spaces are complete under usual norms, which supports convergence arguments.", numbers: "Weights $w_n=(1/n,3)$ converge to $(0,3)$, still a valid weight vector." },
      { title: "Reinforcement-learning value iteration", background: "Discounted Bellman operators are contractions under sup norm in standard theory.", numbers: "With discount $\\gamma=0.9$, an initial value error $5$ is bounded by $5(0.9)^{20}\\approx0.608$." }
    ],
    applicationsClose: "Completeness is quiet but essential: it says the limits promised by approximation actually live where the problem lives.",
    takeaways: [
      "A Banach space is a complete normed space.",
      "Cauchy sequences are sequences whose late terms become mutually close.",
      "Completeness depends on the normed space, not just on the formula for the sequence."
    ]
  },

  "math-05-05": {
    id: "math-05-05",
    title: "Inner products",
    tagline: "An inner product measures alignment, and length appears as alignment with yourself.",
    connections: {
      buildsOn: ["Vector spaces", "Norms and normed spaces", "dot products"],
      leadsTo: ["Hilbert spaces", "Orthonormal bases", "Orthogonal projections"],
      usedWith: ["angles", "orthogonality", "Cauchy-Schwarz inequality", "Pythagorean theorem"]
    },
    motivation:
      "<p>You already know the dot product: $[1,2]\\cdot[3,4]=11$. It is not just multiplication; it tells whether two directions point together, against each other, or at right angles.</p>" +
      "<p>An <b>inner product</b> carries that alignment idea into abstract vector spaces. It gives geometry to vectors: angles, orthogonality, projection, and the norm $\\|x\\|=\\sqrt{\\langle x,x\\rangle}$.</p>",
    definition:
      "<p>An inner product on a real vector space $V$ assigns a number $\\langle x,y\\rangle$ to each pair of vectors. It is linear in one slot, symmetric $\\langle x,y\\rangle=\\langle y,x\\rangle$, and positive definite: $\\langle x,x\\rangle\\ge0$ with equality only when $x=0$.</p>" +
      "<p>The induced norm comes from self-alignment: $$\\|x\\|=\\sqrt{\\langle x,x\\rangle}.$$ Orthogonality means $\\langle x,y\\rangle=0$. In $\\mathbb{R}^n$, the standard inner product is $\\langle x,y\\rangle=\\sum_i x_i y_i$.</p>" +
      "<p><b>Assumptions that matter:</b> complex spaces use conjugate symmetry instead of ordinary symmetry; positive definiteness is what prevents nonzero vectors from having zero length; and not every norm comes from an inner product.</p>",
    worked: {
      problem: "For $x=(1,2,2)$ and $y=(2,0,1)$, compute $\\langle x,y\\rangle$, $\\|x\\|$, and decide whether the vectors are orthogonal.",
      skills: ["dot product", "induced norm", "orthogonality"],
      strategy: "Multiply matching coordinates for the inner product, then use self-inner-product for length.",
      steps: [
        { do: "Multiply first coordinates", result: "$1\\cdot2=2$", why: "dot products pair matching entries" },
        { do: "Multiply second coordinates", result: "$2\\cdot0=0$", why: "second contribution" },
        { do: "Multiply third coordinates", result: "$2\\cdot1=2$", why: "third contribution" },
        { do: "Add the products", result: "$\\langle x,y\\rangle=4$", why: "$2+0+2=4$" },
        { do: "Compute $\\langle x,x\\rangle$", result: "$1^2+2^2+2^2=9$", why: "length squared" },
        { do: "Take the square root", result: "$\\|x\\|=3$", why: "norm induced by the inner product" },
        { do: "Test orthogonality", result: "$4\\ne0$", why: "orthogonal vectors have zero inner product" }
      ],
      verify: "The positive inner product means the vectors have some same-direction alignment.",
      answer: "$\\langle x,y\\rangle=4$, $\\|x\\|=3$, and the vectors are not orthogonal.",
      connects: "Inner products turn algebraic pairs into geometric information."
    },
    practice: [
      { problem: "Compute $\\langle (3,-1),(2,6)\\rangle$.", steps: [
        { do: "Multiply first coordinates", result: "$3\\cdot2=6$", why: "first dot-product term" },
        { do: "Multiply second coordinates", result: "$(-1)\\cdot6=-6$", why: "second dot-product term" },
        { do: "Add the terms", result: "$6+(-6)=0$", why: "sum matching products" },
        { do: "Interpret", result: "zero inner product", why: "no net alignment" },
        { do: "Name the relation", result: "orthogonal", why: "zero inner product defines orthogonality" }
      ], answer: "The inner product is $0$, so the vectors are orthogonal." },
      { problem: "Find the norm induced by the dot product for $v=(-2,3,6)$.", steps: [
        { do: "Compute self-inner-product", result: "$\\langle v,v\\rangle=(-2)^2+3^2+6^2$", why: "norm squared" },
        { do: "Square the entries", result: "$4+9+36$", why: "each term is nonnegative" },
        { do: "Add", result: "$49$", why: "total self-alignment" },
        { do: "Take the square root", result: "$7$", why: "$\\|v\\|=\\sqrt{\\langle v,v\\rangle}$" },
        { do: "Check positivity", result: "$7>0$", why: "nonzero vectors have positive norm" }
      ], answer: "$\\|v\\|=7$." },
      { problem: "For functions $f(t)=t$ and $g(t)=1-t$ on $[0,1]$, compute $\\langle f,g\\rangle=\\int_0^1 f(t)g(t)\\,dt$.", steps: [
        { do: "Multiply the functions", result: "$t(1-t)=t-t^2$", why: "inner product integrates the product" },
        { do: "Set up the integral", result: "$\\int_0^1(t-t^2)\\,dt$", why: "use the definition" },
        { do: "Integrate", result: "$\\left[\\frac{t^2}{2}-\\frac{t^3}{3}\\right]_0^1$", why: "power rule" },
        { do: "Evaluate at $1$", result: "$\\frac12-\\frac13=\\frac16$", why: "upper endpoint" },
        { do: "Evaluate at $0$", result: "$0$", why: "lower endpoint contributes nothing" }
      ], answer: "$\\langle f,g\\rangle=\\frac16$." },
      { problem: "Compute the cosine similarity of $x=(1,1)$ and $y=(2,0)$.", steps: [
        { do: "Compute the inner product", result: "$\\langle x,y\\rangle=2$", why: "$1\\cdot2+1\\cdot0=2$" },
        { do: "Compute $\\|x\\|$", result: "$\\sqrt2$", why: "$1^2+1^2=2$" },
        { do: "Compute $\\|y\\|$", result: "$2$", why: "$2^2+0^2=4$" },
        { do: "Divide", result: "$\\dfrac{2}{2\\sqrt2}$", why: "cosine similarity formula" },
        { do: "Simplify", result: "$\\dfrac{1}{\\sqrt2}\\approx0.707$", why: "cancel the factor $2$" }
      ], answer: "Cosine similarity is $1/\\sqrt2\\approx0.707$." },
      { problem: "Use Cauchy-Schwarz to bound $|\\langle x,y\\rangle|$ when $\\|x\\|=3$ and $\\|y\\|=5$, then give a case where equality holds.", steps: [
        { do: "State Cauchy-Schwarz", result: "$|\\langle x,y\\rangle|\\le\\|x\\|\\|y\\|$", why: "inner products are bounded by lengths" },
        { do: "Substitute norms", result: "$|\\langle x,y\\rangle|\\le3\\cdot5$", why: "use the given sizes" },
        { do: "Multiply", result: "$15$", why: "product of lengths" },
        { do: "Choose parallel vectors", result: "$x=(3,0),\\ y=(5,0)$", why: "equality occurs when directions align" },
        { do: "Check equality", result: "$\\langle x,y\\rangle=15$", why: "the bound is attained" }
      ], answer: "$|\\langle x,y\\rangle|\\le15$, with equality for parallel same-direction vectors such as $(3,0)$ and $(5,0)$." }
    ],
    applications: [
      { title: "Cosine similarity", background: "Search and recommendation systems compare embeddings by the angle between them.", numbers: "$[1,1]\\cdot[2,0]=2$ and norms are $\\sqrt2$ and $2$, so similarity is $0.707$." },
      { title: "Least squares geometry", background: "Residuals at the best fit are orthogonal to the model's feature directions.", numbers: "If residual $r=[1,-1]$ and feature $x=[1,1]$, then $\\langle r,x\\rangle=0$." },
      { title: "Signal energy", background: "Signal processing uses inner products to measure energy and correlation.", numbers: "For samples $s=[2,-1,2]$, energy is $\\langle s,s\\rangle=9$." },
      { title: "Attention scores", background: "Transformer attention begins by comparing query and key vectors with dot products.", numbers: "Query $[1,2]$ and key $[3,1]$ give score $1\\cdot3+2\\cdot1=5$." },
      { title: "Kernel methods", background: "Many kernels behave like inner products in hidden feature spaces.", numbers: "The linear kernel gives $K([1,2],[3,4])=11$." },
      { title: "Fourier coefficients", background: "Orthogonal basis functions let signals be decomposed by inner products.", numbers: "If a unit basis vector $e$ has $\\langle f,e\\rangle=2.5$, then the coefficient along $e$ is $2.5$." }
    ],
    applicationsClose: "Inner products reveal alignment, and alignment is the hidden geometry behind similarity, projection, energy, and decomposition.",
    takeaways: [
      "An inner product is a positive, symmetric, linear pairing of vectors.",
      "It induces the norm $\\|x\\|=\\sqrt{\\langle x,x\\rangle}$.",
      "Orthogonality means inner product zero, not necessarily visual perpendicularity on a page."
    ]
  },

  "math-05-06": {
    id: "math-05-06",
    title: "Hilbert spaces",
    tagline: "A Hilbert space is a complete inner-product space, so geometry and limits work together.",
    connections: {
      buildsOn: ["Inner products", "Banach spaces and completeness", "norms"],
      leadsTo: ["Orthonormal bases", "Orthogonal projections", "The Riesz representation theorem"],
      usedWith: ["orthogonality", "Fourier series", "closed subspaces", "projection theorem"]
    },
    motivation:
      "<p>Inner products give geometry. Completeness gives trustworthy limits. Functional analysis becomes especially powerful when a space has both.</p>" +
      "<p>A <b>Hilbert space</b> is where infinite-dimensional geometry behaves as much as possible like Euclidean geometry. You can talk about right angles, lengths, projections, and convergent approximation sequences in one place.</p>",
    definition:
      "<p>A <b>Hilbert space</b> is an inner-product space that is complete under the norm $\\|x\\|=\\sqrt{\\langle x,x\\rangle}$. Completeness means every Cauchy sequence measured by that norm converges to an element of the space.</p>" +
      "<p>Every finite-dimensional Euclidean space $\\mathbb{R}^n$ is Hilbert. Infinite-dimensional examples include $\\ell^2$, the space of square-summable sequences, and $L^2$ spaces of square-integrable functions. In each case, squared size must add up to something finite.</p>" +
      "<p><b>Assumptions that matter:</b> the norm must come from the inner product; completeness is part of the definition; and some natural inner-product spaces, such as polynomials with an $L^2$ inner product, are not complete until their limits are included.</p>",
    worked: {
      problem: "Show that $x=(1,1/2,1/4,1/8,\\ldots)$ belongs to $\\ell^2$ and compute its $\\ell^2$ norm.",
      skills: ["square-summable sequences", "geometric series", "Hilbert norm"],
      strategy: "Square the sequence entries and sum the resulting geometric series.",
      steps: [
        { do: "Square the $n$th pattern", result: "$1,\\frac14,\\frac1{16},\\frac1{64},\\ldots$", why: "the $\\ell^2$ norm uses squared magnitudes" },
        { do: "Identify the ratio", result: "$r=\\frac14$", why: "each squared term is one fourth of the previous one" },
        { do: "Use the geometric sum", result: "$\\sum_{k=0}^\\infty (\\frac14)^k=\\frac{1}{1-1/4}$", why: "the ratio has magnitude below $1$" },
        { do: "Simplify the sum", result: "$\\frac43$", why: "$1/(3/4)=4/3$" },
        { do: "Take the square root", result: "$\\|x\\|_2=\\sqrt{4/3}$", why: "norm is square root of sum of squares" },
        { do: "Simplify", result: "$\\frac{2}{\\sqrt3}$", why: "square root of $4$ is $2$" }
      ],
      verify: "The squared sum is finite, so the sequence really is an element of $\\ell^2$.",
      answer: "$x\\in\\ell^2$ and $\\|x\\|_2=2/\\sqrt3$.",
      connects: "$\\ell^2$ is the model Hilbert space for infinite coordinate vectors."
    },
    practice: [
      { problem: "Compute the $\\ell^2$ norm of $x=(3,4,0,0,\\ldots)$.", steps: [
        { do: "Square the first entry", result: "$3^2=9$", why: "norm squared adds squares" },
        { do: "Square the second entry", result: "$4^2=16$", why: "second contribution" },
        { do: "Add remaining squares", result: "$0$", why: "all later entries are zero" },
        { do: "Sum", result: "$25$", why: "$9+16=25$" },
        { do: "Take the square root", result: "$5$", why: "$\\sqrt{25}=5$" }
      ], answer: "$\\|x\\|_2=5$." },
      { problem: "Does $x=(1,1,1,\\ldots)$ belong to $\\ell^2$?", steps: [
        { do: "Square each entry", result: "$1,1,1,\\ldots$", why: "all magnitudes are one" },
        { do: "Form the squared sum", result: "$\\sum_{k=1}^\\infty 1$", why: "$\\ell^2$ requires a finite sum" },
        { do: "Evaluate behavior", result: "diverges", why: "partial sums grow without bound" },
        { do: "Compare with the definition", result: "not square-summable", why: "the squared sum is not finite" },
        { do: "Conclude membership", result: "$x\\notin\\ell^2$", why: "finite norm is required" }
      ], answer: "No. The sequence is not in $\\ell^2$." },
      { problem: "For $f(t)=t$ in $L^2[0,1]$, compute $\\|f\\|_2$.", steps: [
        { do: "Write the norm squared", result: "$\\|f\\|_2^2=\\int_0^1 t^2\\,dt$", why: "$L^2$ uses the integral of the square" },
        { do: "Integrate", result: "$\\left[t^3/3\\right]_0^1$", why: "power rule" },
        { do: "Evaluate", result: "$1/3$", why: "upper endpoint gives $1/3$" },
        { do: "Take the square root", result: "$\\|f\\|_2=1/\\sqrt3$", why: "norm is square root of norm squared" },
        { do: "Check finiteness", result: "finite", why: "so $f\\in L^2[0,1]$" }
      ], answer: "$\\|f\\|_2=1/\\sqrt3$." },
      { problem: "Show that $e_1=(1,0,0,\\ldots)$ and $e_2=(0,1,0,\\ldots)$ are orthogonal in $\\ell^2$.", steps: [
        { do: "Write the inner product", result: "$\\langle e_1,e_2\\rangle=\\sum_{k=1}^\\infty (e_1)_k(e_2)_k$", why: "$\\ell^2$ uses coordinate products" },
        { do: "Compute the first term", result: "$1\\cdot0=0$", why: "only $e_1$ has first entry" },
        { do: "Compute the second term", result: "$0\\cdot1=0$", why: "only $e_2$ has second entry" },
        { do: "Compute later terms", result: "$0$", why: "both are zero afterward" },
        { do: "Sum", result: "$0$", why: "all terms vanish" }
      ], answer: "$e_1$ and $e_2$ are orthogonal." },
      { problem: "A truncated signal has coefficients $(1,1/2,1/4)$ in an orthonormal system. Compute its Hilbert-space norm.", steps: [
        { do: "Use Parseval for orthonormal coefficients", result: "$\\|x\\|^2=1^2+(1/2)^2+(1/4)^2$", why: "squared norm is sum of squared coefficients" },
        { do: "Square terms", result: "$1+1/4+1/16$", why: "compute coefficient energies" },
        { do: "Use sixteenths", result: "$16/16+4/16+1/16$", why: "common denominator" },
        { do: "Add", result: "$21/16$", why: "total squared norm" },
        { do: "Take the square root", result: "$\\sqrt{21}/4$", why: "norm is square root" }
      ], answer: "The norm is $\\sqrt{21}/4\\approx1.146$." }
    ],
    applications: [
      { title: "Signal energy", background: "Hilbert spaces formalize finite-energy signals, a core idea in communications and audio.", numbers: "Samples $[1,2,2]$ have energy $1^2+2^2+2^2=9$ and norm $3$." },
      { title: "Fourier analysis", background: "Square-integrable functions form the natural home for Fourier series.", numbers: "Coefficients $1,1/2,1/4,\\ldots$ have squared energy $4/3$." },
      { title: "Kernel methods", background: "Reproducing-kernel Hilbert spaces let algorithms act linearly in high-dimensional feature spaces.", numbers: "If feature vectors have inner product $K(x,z)=0.8$ and norms $1$, their cosine similarity is $0.8$." },
      { title: "Quantum states", background: "Quantum mechanics models states as unit vectors in Hilbert space.", numbers: "Amplitudes $(1/\\sqrt2,1/\\sqrt2)$ have squared norm $1/2+1/2=1$." },
      { title: "Least-squares approximation", background: "Hilbert geometry guarantees closest points in closed subspaces.", numbers: "Approximating $[3,4]$ by the $x$-axis gives $[3,0]$ with error norm $4$." },
      { title: "Embedding normalization", background: "Many retrieval systems normalize vectors so they lie on a unit sphere in Euclidean Hilbert space.", numbers: "Vector $[3,4]$ normalizes to $[0.6,0.8]$ with norm $1$." }
    ],
    applicationsClose: "Hilbert spaces are where infinite-dimensional approximation keeps the geometric comfort of dot products and right angles.",
    takeaways: [
      "A Hilbert space is a complete inner-product space.",
      "The norm in a Hilbert space comes from $\\|x\\|=\\sqrt{\\langle x,x\\rangle}$.",
      "$\\ell^2$ and $L^2$ are central infinite-dimensional examples."
    ]
  },

  "math-05-07": {
    id: "math-05-07",
    title: "Orthonormal bases",
    tagline: "An orthonormal basis gives clean coordinates because every direction is unit length and mutually perpendicular.",
    connections: {
      buildsOn: ["Hilbert spaces", "Inner products", "linear combinations"],
      leadsTo: ["Orthogonal projections", "Best approximation", "Fourier series"],
      usedWith: ["coordinates", "Parseval identity", "Gram-Schmidt", "orthogonality"]
    },
    motivation:
      "<p>Coordinates are easiest when the axes are perpendicular and each axis has length $1$. Then the coefficient along an axis is just a dot product.</p>" +
      "<p>An <b>orthonormal basis</b> carries that clean coordinate system into Hilbert spaces. It lets vectors, functions, and signals be decomposed into independent pieces whose energies add simply.</p>",
    definition:
      "<p>A family $(e_k)$ in an inner-product space is <b>orthonormal</b> if $\\langle e_i,e_j\\rangle=0$ for $i\\ne j$ and $\\|e_k\\|=1$ for every $k$. It is an orthonormal basis when its closed span is the whole space. In finite dimensions, every vector has the expansion $x=\\sum_k \\langle x,e_k\\rangle e_k$.</p>" +
      "<p>The coefficient formula comes from taking an inner product with $e_j$: if $x=\\sum_k c_k e_k$, then $\\langle x,e_j\\rangle=\\sum_k c_k\\langle e_k,e_j\\rangle=c_j$ because all cross terms vanish and $\\langle e_j,e_j\\rangle=1$.</p>" +
      "<p><b>Assumptions that matter:</b> orthonormal means both orthogonal and unit length; infinite bases may require limits of partial sums; and a merely orthogonal basis needs division by $\\|e_k\\|^2$ to compute coefficients.</p>",
    worked: {
      problem: "For $e_1=(1/\\sqrt2,1/\\sqrt2)$ and $e_2=(1/\\sqrt2,-1/\\sqrt2)$, show they are orthonormal and find coordinates of $x=(3,1)$.",
      skills: ["orthogonality", "unit norm", "coordinate coefficients"],
      strategy: "Check inner products, then compute coordinates by projecting onto each basis vector.",
      steps: [
        { do: "Compute $\\|e_1\\|^2$", result: "$1/2+1/2=1$", why: "unit length check" },
        { do: "Compute $\\|e_2\\|^2$", result: "$1/2+1/2=1$", why: "second unit length check" },
        { do: "Compute $\\langle e_1,e_2\\rangle$", result: "$1/2-1/2=0$", why: "orthogonality check" },
        { do: "Compute first coefficient", result: "$\\langle x,e_1\\rangle=(3+1)/\\sqrt2=2\\sqrt2$", why: "coordinate along $e_1$" },
        { do: "Compute second coefficient", result: "$\\langle x,e_2\\rangle=(3-1)/\\sqrt2=\\sqrt2$", why: "coordinate along $e_2$" },
        { do: "Write the expansion", result: "$x=2\\sqrt2\\,e_1+\\sqrt2\\,e_2$", why: "orthonormal coordinates reconstruct the vector" }
      ],
      verify: "$2\\sqrt2 e_1=(2,2)$ and $\\sqrt2 e_2=(1,-1)$, whose sum is $(3,1)$.",
      answer: "The vectors are orthonormal, and $(3,1)$ has coordinates $(2\\sqrt2,\\sqrt2)$ in this basis.",
      connects: "Orthonormal bases turn coordinates into inner products."
    },
    practice: [
      { problem: "Show that $(1,0)$ and $(0,1)$ are orthonormal in $\\mathbb{R}^2$.", steps: [
        { do: "Compute the first norm", result: "$\\|(1,0)\\|=1$", why: "unit length" },
        { do: "Compute the second norm", result: "$\\|(0,1)\\|=1$", why: "unit length" },
        { do: "Compute the inner product", result: "$1\\cdot0+0\\cdot1=0$", why: "orthogonality" },
        { do: "Count vectors", result: "$2$ vectors in $\\mathbb{R}^2$", why: "enough independent directions" },
        { do: "Conclude", result: "orthonormal basis", why: "orthonormal and spans the plane" }
      ], answer: "They form an orthonormal basis of $\\mathbb{R}^2$." },
      { problem: "Normalize $v=(3,4)$.", steps: [
        { do: "Compute the norm", result: "$\\|v\\|=5$", why: "$3^2+4^2=25$" },
        { do: "Divide by the norm", result: "$v/\\|v\\|=(3/5,4/5)$", why: "normalization makes length one" },
        { do: "Check the new norm squared", result: "$9/25+16/25=1$", why: "unit check" },
        { do: "Take the square root", result: "$1$", why: "norm is positive" },
        { do: "State direction", result: "same direction as $v$", why: "positive scaling preserves direction" }
      ], answer: "The normalized vector is $(3/5,4/5)$." },
      { problem: "Given orthonormal $e_1,e_2$ and $x=3e_1-4e_2$, compute $\\|x\\|$.", steps: [
        { do: "Use Parseval", result: "$\\|x\\|^2=3^2+(-4)^2$", why: "orthonormal coefficients have additive energy" },
        { do: "Square coefficients", result: "$9+16$", why: "coefficient energies" },
        { do: "Add", result: "$25$", why: "total squared norm" },
        { do: "Take the square root", result: "$5$", why: "norm" },
        { do: "Interpret", result: "a $3$-$4$-$5$ coordinate triangle", why: "orthonormal axes behave like Euclidean axes" }
      ], answer: "$\\|x\\|=5$." },
      { problem: "Use Gram-Schmidt on $v_1=(1,1)$ and $v_2=(1,0)$ to get an orthonormal pair.", steps: [
        { do: "Normalize $v_1$", result: "$e_1=(1/\\sqrt2,1/\\sqrt2)$", why: "$\\|v_1\\|=\\sqrt2$" },
        { do: "Compute projection coefficient", result: "$\\langle v_2,e_1\\rangle=1/\\sqrt2$", why: "remove the part along $e_1$" },
        { do: "Subtract the projection", result: "$u_2=v_2-(1/\\sqrt2)e_1=(1/2,-1/2)$", why: "make the second vector orthogonal" },
        { do: "Compute $\\|u_2\\|$", result: "$1/\\sqrt2$", why: "square sum is $1/2$" },
        { do: "Normalize $u_2$", result: "$e_2=(1/\\sqrt2,-1/\\sqrt2)$", why: "divide by $1/\\sqrt2$" }
      ], answer: "One orthonormal pair is $(1/\\sqrt2,1/\\sqrt2)$ and $(1/\\sqrt2,-1/\\sqrt2)$." },
      { problem: "In an orthonormal basis, a signal has coefficients $2,-1,0.5$. Compute its energy and norm.", steps: [
        { do: "Square the first coefficient", result: "$2^2=4$", why: "energy contribution" },
        { do: "Square the second coefficient", result: "$(-1)^2=1$", why: "energy contribution" },
        { do: "Square the third coefficient", result: "$0.5^2=0.25$", why: "energy contribution" },
        { do: "Add energies", result: "$5.25$", why: "Parseval identity" },
        { do: "Take the square root", result: "$\\sqrt{5.25}\\approx2.291$", why: "norm from energy" }
      ], answer: "Energy is $5.25$ and norm is about $2.291$." }
    ],
    applications: [
      { title: "Fourier features", background: "Fourier bases decompose signals into orthogonal waves.", numbers: "Coefficients $3$ and $4$ on unit waves give signal norm $5$." },
      { title: "PCA coordinates", background: "Principal components are chosen orthonormally so coordinates are uncorrelated directions of variance.", numbers: "Data point coordinates $(2,-1)$ in two PCs have squared length $4+1=5$." },
      { title: "Embedding compression", background: "An orthonormal basis lets systems keep the largest coefficients and discard small ones cleanly.", numbers: "Keeping coefficients $5$ and $1$ while dropping $0.1$ loses energy $0.01$." },
      { title: "Wavelet transforms", background: "Wavelets use orthonormal localized basis functions for images and audio.", numbers: "Coefficients $[8,0,0,0]$ have energy $64$, concentrated in one component." },
      { title: "QR factorization", background: "Numerical linear algebra builds orthonormal columns to solve least-squares problems stably.", numbers: "If $Q$ has orthonormal columns and $c=[3,4]$, then $\\|Qc\\|=5$." },
      { title: "Attention head analysis", background: "Orthogonal directions can separate independent semantic features in representation analysis.", numbers: "A vector $x=2e_1+0.5e_2$ has coefficient $2$ along feature direction $e_1$." }
    ],
    applicationsClose: "Orthonormal bases make decomposition honest: coefficients are independent, energies add, and reconstruction is transparent.",
    takeaways: [
      "Orthonormal means mutually orthogonal and each vector has norm $1$.",
      "In an orthonormal basis, coefficients are inner products $\\langle x,e_k\\rangle$.",
      "Parseval's identity says squared norm is the sum of squared orthonormal coefficients."
    ]
  },

  "math-05-08": {
    id: "math-05-08",
    title: "Orthogonal projections",
    tagline: "Projection keeps the component inside a subspace and leaves a perpendicular error behind.",
    connections: {
      buildsOn: ["Inner products", "Orthonormal bases", "subspaces"],
      leadsTo: ["Best approximation", "least squares", "The Riesz representation theorem"],
      usedWith: ["orthogonal complements", "projection matrices", "Pythagorean theorem", "normal equations"]
    },
    motivation:
      "<p>If sunlight drops a shadow of a point onto the floor, the shadow is the closest floor point directly below it. Orthogonal projection is the same idea in vector geometry.</p>" +
      "<p>A <b>projection</b> onto a subspace keeps the part you can represent in that subspace and leaves an error perpendicular to everything in the subspace. This is the geometry behind least squares.</p>",
    definition:
      "<p>For a Hilbert space vector $x$ and a closed subspace $M$, the orthogonal projection $p=P_Mx$ is the vector in $M$ such that $x-p\\perp M$. If $M$ has an orthonormal basis $e_1,\\ldots,e_k$, then $$P_Mx=\\sum_{j=1}^k\\langle x,e_j\\rangle e_j.$$</p>" +
      "<p>The formula works because each coefficient captures exactly the component of $x$ along one unit direction in $M$, and orthogonality makes the remaining error invisible to every basis direction.</p>" +
      "<p><b>Assumptions that matter:</b> the subspace should be closed for existence in infinite dimensions; the simple coefficient formula assumes an orthonormal basis; and projection is linear, idempotent $P^2=P$, and distance-decreasing.</p>",
    worked: {
      problem: "Project $x=(3,4)$ onto the line spanned by $u=(1,0)$.",
      skills: ["projection onto a line", "orthogonality", "error vector"],
      strategy: "Use the unit direction formula and then check that the leftover error is perpendicular.",
      steps: [
        { do: "Check that $u$ is unit length", result: "$\\|u\\|=1$", why: "the formula is simplest for unit vectors" },
        { do: "Compute the coefficient", result: "$\\langle x,u\\rangle=3$", why: "$3\\cdot1+4\\cdot0=3$" },
        { do: "Multiply by the unit direction", result: "$p=3u=(3,0)$", why: "keep the component along the line" },
        { do: "Compute the error", result: "$x-p=(0,4)$", why: "subtract the projection" },
        { do: "Check orthogonality", result: "$\\langle (0,4),(1,0)\\rangle=0$", why: "the error is perpendicular to the line" },
        { do: "Compute distances", result: "$\\|x-p\\|=4$", why: "projection leaves vertical distance" }
      ],
      verify: "Any point on the line has form $(a,0)$; the squared distance to $(3,4)$ is $(3-a)^2+16$, minimized at $a=3$.",
      answer: "The projection is $(3,0)$, with orthogonal error $(0,4)$.",
      connects: "Projection is the closest subspace component plus perpendicular residual."
    },
    practice: [
      { problem: "Project $x=(2,3)$ onto the $y$-axis.", steps: [
        { do: "Choose the unit direction", result: "$e=(0,1)$", why: "the $y$-axis is spanned by $e$" },
        { do: "Compute the coefficient", result: "$\\langle x,e\\rangle=3$", why: "dot product with the axis direction" },
        { do: "Form the projection", result: "$3e=(0,3)$", why: "keep the $y$ component" },
        { do: "Compute the error", result: "$(2,3)-(0,3)=(2,0)$", why: "subtract projected part" },
        { do: "Check orthogonality", result: "$\\langle (2,0),(0,1)\\rangle=0$", why: "error is horizontal" }
      ], answer: "Projection is $(0,3)$." },
      { problem: "Project $x=(3,1)$ onto the line spanned by $u=(1,1)$.", steps: [
        { do: "Compute $\\langle x,u\\rangle$", result: "$4$", why: "$3+1=4$" },
        { do: "Compute $\\langle u,u\\rangle$", result: "$2$", why: "$1^2+1^2=2$" },
        { do: "Compute the projection coefficient", result: "$4/2=2$", why: "nonunit line formula" },
        { do: "Multiply by $u$", result: "$2(1,1)=(2,2)$", why: "point on the line" },
        { do: "Check the error", result: "$(3,1)-(2,2)=(1,-1)$", why: "perpendicular to $(1,1)$" }
      ], answer: "The projection is $(2,2)$." },
      { problem: "With orthonormal $e_1,e_2$, project $x=3e_1-2e_2+5e_3$ onto $\\operatorname{span}\\{e_1,e_2\\}$.", steps: [
        { do: "Identify kept directions", result: "$e_1$ and $e_2$", why: "these span the target subspace" },
        { do: "Keep the $e_1$ coefficient", result: "$3e_1$", why: "projection preserves this component" },
        { do: "Keep the $e_2$ coefficient", result: "$-2e_2$", why: "projection preserves this component" },
        { do: "Drop the $e_3$ component", result: "$5e_3$ is omitted", why: "$e_3$ is orthogonal to the subspace" },
        { do: "Write the projection", result: "$3e_1-2e_2$", why: "sum the kept components" }
      ], answer: "$P x=3e_1-2e_2$." },
      { problem: "For projection $p=(2,2)$ of $x=(3,1)$ onto span$(1,1)$, verify the Pythagorean identity.", steps: [
        { do: "Compute $\\|x\\|^2$", result: "$3^2+1^2=10$", why: "original squared length" },
        { do: "Compute $\\|p\\|^2$", result: "$2^2+2^2=8$", why: "projection squared length" },
        { do: "Compute the error", result: "$x-p=(1,-1)$", why: "residual" },
        { do: "Compute error squared length", result: "$1^2+(-1)^2=2$", why: "residual energy" },
        { do: "Add", result: "$8+2=10$", why: "orthogonal components have additive energy" }
      ], answer: "$\\|x\\|^2=\\|p\\|^2+\\|x-p\\|^2=10$." },
      { problem: "Project data vector $y=(1,2,2)$ onto the constant-vector subspace span$(1,1,1)$.", steps: [
        { do: "Compute $\\langle y,u\\rangle$ for $u=(1,1,1)$", result: "$5$", why: "sum the entries" },
        { do: "Compute $\\langle u,u\\rangle$", result: "$3$", why: "three ones" },
        { do: "Compute the coefficient", result: "$5/3$", why: "projection onto a nonunit vector" },
        { do: "Multiply by $u$", result: "$(5/3,5/3,5/3)$", why: "constant fitted vector" },
        { do: "Interpret", result: "mean value $5/3$", why: "projection onto constants averages the data" }
      ], answer: "The projection is $(5/3,5/3,5/3)$." }
    ],
    applications: [
      { title: "Least-squares regression", background: "Linear regression projects labels onto the column space of the design matrix.", numbers: "Projecting $y=[1,2,2]$ onto constants gives prediction $[5/3,5/3,5/3]$." },
      { title: "PCA reconstruction", background: "PCA keeps the projection onto top principal directions.", numbers: "If coefficients are $5,2,0.1$, keeping the first two leaves squared error $0.01$." },
      { title: "Residual diagnostics", background: "At a least-squares solution, the residual is orthogonal to all fitted features.", numbers: "Residual $[1,-1]$ and feature $[1,1]$ have dot product $0$." },
      { title: "Denoising", background: "Signal processing projects noisy data onto a subspace of trusted signal patterns.", numbers: "Signal $3e_1+0.2e_2$ projected onto span$(e_1)$ becomes $3e_1$, dropping noise energy $0.04$." },
      { title: "Embedding debiasing", background: "Some representation methods remove a direction by subtracting its projection.", numbers: "For $x=[3,4]$ and direction $u=[1,0]$, removing projection leaves $[0,4]$." },
      { title: "Computer graphics shadows", background: "A shadow on a plane is a geometric projection of a point onto a lower-dimensional surface.", numbers: "Point $(2,3,5)$ projected onto the $xy$-plane becomes $(2,3,0)$." }
    ],
    applicationsClose: "Projection separates what a subspace can explain from the perpendicular error it cannot.",
    takeaways: [
      "The orthogonal projection $p$ lies in the subspace and has residual $x-p$ perpendicular to it.",
      "With an orthonormal basis, projection keeps coefficients $\\langle x,e_j\\rangle$ along the basis directions.",
      "Projection is the geometric heart of least squares and low-dimensional approximation."
    ]
  },

  "math-05-09": {
    id: "math-05-09",
    title: "Best approximation",
    tagline: "Best approximation finds the nearest point in a chosen subspace by making the error orthogonal.",
    connections: {
      buildsOn: ["Orthogonal projections", "Hilbert spaces", "norm minimization"],
      leadsTo: ["least squares", "Fourier approximation", "The Riesz representation theorem"],
      usedWith: ["projection theorem", "normal equations", "orthogonal complements", "convex sets"]
    },
    motivation:
      "<p>Approximation is honest math for limited resources. You may not be able to store a whole signal, fit every data point, or keep every basis direction.</p>" +
      "<p>The best approximation principle says: in a Hilbert space, the closest point in a closed subspace is the orthogonal projection. The error is not random; it is perpendicular to everything the approximation was allowed to use.</p>",
    definition:
      "<p>Given a Hilbert space $H$, a closed subspace $M$, and a vector $x\\in H$, a <b>best approximation</b> is a point $m^\\ast\\in M$ minimizing $\\|x-m\\|$ over $m\\in M$. The projection theorem says $m^\\ast=P_Mx$, and it is characterized by $$x-m^\\ast\\perp M.$$</p>" +
      "<p>Why orthogonality is necessary: if the error had a component along some direction in $M$, moving a little in that direction would reduce the error. At the minimum, no allowed direction can reduce it, so every allowed direction is orthogonal to the residual.</p>" +
      "<p><b>Assumptions that matter:</b> closedness of the subspace gives existence; Hilbert geometry gives the orthogonal characterization; and for non-subspace or non-closed sets, closest points may require extra conditions.</p>",
    worked: {
      problem: "Find the best constant approximation to data $y=(2,4,7)$ in Euclidean norm.",
      skills: ["projection onto constants", "means", "residual orthogonality"],
      strategy: "Project the data vector onto the subspace of constant vectors.",
      steps: [
        { do: "Define the constant direction", result: "$u=(1,1,1)$", why: "constant vectors are multiples of $u$" },
        { do: "Compute $\\langle y,u\\rangle$", result: "$2+4+7=13$", why: "sum the data" },
        { do: "Compute $\\langle u,u\\rangle$", result: "$3$", why: "three entries of $1$" },
        { do: "Compute the projection coefficient", result: "$13/3$", why: "coefficient is $\\langle y,u\\rangle/\\langle u,u\\rangle$" },
        { do: "Write the best constant vector", result: "$(13/3,13/3,13/3)$", why: "multiply the coefficient by $u$" },
        { do: "Compute the residual", result: "$(-7/3,-1/3,8/3)$", why: "subtract the approximation from $y$" },
        { do: "Check residual sum", result: "$-7/3-1/3+8/3=0$", why: "orthogonal to constant vectors" }
      ],
      verify: "The best constant is the arithmetic mean $13/3\\approx4.333$, exactly as statistics predicts.",
      answer: "The best constant approximation is $(13/3,13/3,13/3)$.",
      connects: "Best approximation is projection with an orthogonal residual."
    },
    practice: [
      { problem: "Find the closest point on the $x$-axis to $(3,4)$.", steps: [
        { do: "Describe the subspace", result: "points $(a,0)$", why: "the $x$-axis" },
        { do: "Write squared distance", result: "$(3-a)^2+4^2$", why: "distance from $(3,4)$ to $(a,0)$" },
        { do: "Minimize the variable part", result: "$(3-a)^2$ is smallest at $a=3$", why: "a square is minimized at zero" },
        { do: "Write the closest point", result: "$(3,0)$", why: "set $a=3$" },
        { do: "Compute the error", result: "$(0,4)$", why: "perpendicular to the $x$-axis" }
      ], answer: "The closest point is $(3,0)$." },
      { problem: "Approximate $x=(1,2,3)$ by a multiple of $u=(1,1,1)$.", steps: [
        { do: "Compute $\\langle x,u\\rangle$", result: "$6$", why: "sum entries" },
        { do: "Compute $\\langle u,u\\rangle$", result: "$3$", why: "three ones" },
        { do: "Find the coefficient", result: "$6/3=2$", why: "projection coefficient" },
        { do: "Write the approximation", result: "$2u=(2,2,2)$", why: "closest constant vector" },
        { do: "Compute residual", result: "$(-1,0,1)$", why: "error is orthogonal to $u$" }
      ], answer: "The best approximation is $(2,2,2)$." },
      { problem: "In an orthonormal basis, best approximate $x=4e_1-e_2+3e_3$ using span$(e_1,e_3)$.", steps: [
        { do: "Identify allowed directions", result: "$e_1$ and $e_3$", why: "these span the approximation space" },
        { do: "Keep the $e_1$ term", result: "$4e_1$", why: "allowed component" },
        { do: "Drop the $e_2$ term", result: "$-e_2$ is residual", why: "orthogonal to allowed space" },
        { do: "Keep the $e_3$ term", result: "$3e_3$", why: "allowed component" },
        { do: "Write approximation", result: "$4e_1+3e_3$", why: "projection onto the allowed span" }
      ], answer: "$m^\\ast=4e_1+3e_3$." },
      { problem: "Fit a line through the origin $\\hat y=ax$ to points $(1,2)$ and $(2,3)$ by least squares.", steps: [
        { do: "Write the feature vector", result: "$x=(1,2)$", why: "one coefficient multiplies both inputs" },
        { do: "Write the target vector", result: "$y=(2,3)$", why: "observed outputs" },
        { do: "Use projection coefficient", result: "$a=\\langle y,x\\rangle/\\langle x,x\\rangle$", why: "best multiple of $x$" },
        { do: "Compute numerator", result: "$2\\cdot1+3\\cdot2=8$", why: "dot product" },
        { do: "Compute denominator", result: "$1^2+2^2=5$", why: "feature energy" },
        { do: "Divide", result: "$a=8/5=1.6$", why: "least-squares coefficient" }
      ], answer: "The best through-origin line is $\\hat y=1.6x$." },
      { problem: "A signal has orthonormal coefficients $5,1,0.2,0.1$. If you keep the first two, what is the approximation error norm?", steps: [
        { do: "Identify dropped coefficients", result: "$0.2$ and $0.1$", why: "the first two are kept" },
        { do: "Square dropped coefficients", result: "$0.04$ and $0.01$", why: "orthonormal error energy" },
        { do: "Add error energy", result: "$0.05$", why: "Pythagorean sum" },
        { do: "Take the square root", result: "$\\sqrt{0.05}$", why: "error norm" },
        { do: "Approximate", result: "$0.224$", why: "square-root value" }
      ], answer: "The approximation error norm is about $0.224$." }
    ],
    applications: [
      { title: "Linear regression", background: "Least squares chooses predictions closest to labels in Euclidean norm.", numbers: "For through-origin fit to $(1,2),(2,3)$, the slope is $8/5=1.6$." },
      { title: "PCA compression", background: "PCA gives the best low-dimensional reconstruction under squared error among linear subspaces.", numbers: "Dropping coefficient $0.1$ loses squared error $0.01$." },
      { title: "Fourier truncation", background: "Keeping the largest Fourier modes is an orthogonal best approximation among chosen frequencies.", numbers: "Dropping coefficients $0.3$ and $0.4$ gives error norm $0.5$." },
      { title: "Averaging as approximation", background: "The mean is the best constant predictor under squared loss.", numbers: "Data $2,4,7$ have best constant $13/3\\approx4.333$." },
      { title: "Denoising autoencoders", background: "A model bottleneck approximates data inside a lower-dimensional representational family.", numbers: "If reconstruction error vector is $[0.1,-0.2]$, squared error is $0.05$." },
      { title: "Model distillation", background: "A smaller model tries to approximate a larger model's outputs as closely as its class allows.", numbers: "Predictions $[0.7,0.2]$ versus targets $[0.8,0.1]$ have error norm $\\sqrt{0.02}\\approx0.141$." }
    ],
    applicationsClose: "Best approximation says that limited models do their best when the remaining error points in no allowed direction.",
    takeaways: [
      "In a Hilbert space, the closest point in a closed subspace is the orthogonal projection.",
      "The residual of the best approximation is orthogonal to every allowed direction.",
      "Least squares, PCA, averaging, and Fourier truncation are all best-approximation stories."
    ]
  },

  "math-05-10": {
    id: "math-05-10",
    title: "The Riesz representation theorem",
    tagline: "In a Hilbert space, every continuous linear measurement is an inner product with one unique vector.",
    connections: {
      buildsOn: ["Hilbert spaces", "Inner products", "Bounded linear operators"],
      leadsTo: ["duality", "gradients", "reproducing kernels"],
      usedWith: ["linear functionals", "duals", "Cauchy-Schwarz inequality", "adjoints"]
    },
    motivation:
      "<p>A linear measurement turns a vector into a number: sum its coordinates, sample a feature score, or compute a weighted average. In Euclidean space, every such measurement is a dot product with some weight vector.</p>" +
      "<p>The <b>Riesz representation theorem</b> says the same beautiful fact holds in every Hilbert space, as long as the measurement is continuous. Linear functionals are not mysterious; they are inner products with representing vectors.</p>",
    definition:
      "<p>For a real Hilbert space $H$, every bounded linear functional $F:H\\to\\mathbb{R}$ has a unique vector $y\\in H$ such that $$F(x)=\\langle x,y\\rangle\\quad\\text{for all }x\\in H.$$ Also $\\|F\\|=\\|y\\|$.</p>" +
      "<p>Uniqueness comes from geometry: if $\\langle x,y_1\\rangle=\\langle x,y_2\\rangle$ for all $x$, then $\\langle x,y_1-y_2\\rangle=0$ for all $x$. Taking $x=y_1-y_2$ forces $\\|y_1-y_2\\|^2=0$, so the vectors are equal.</p>" +
      "<p><b>Assumptions that matter:</b> the space must be Hilbert, not just normed; the functional must be bounded, equivalently continuous; and complex Hilbert spaces require a convention about which inner-product slot is linear.</p>",
    worked: {
      problem: "For $F(x_1,x_2,x_3)=2x_1-x_2+4x_3$ on $\\mathbb{R}^3$, find the Riesz representing vector and $\\|F\\|$.",
      skills: ["linear functionals", "representing vectors", "operator norm"],
      strategy: "Match the functional to a dot product and use the representing vector's norm.",
      steps: [
        { do: "Write a generic inner product", result: "$\\langle x,y\\rangle=x_1y_1+x_2y_2+x_3y_3$", why: "standard Euclidean inner product" },
        { do: "Match the first coefficient", result: "$y_1=2$", why: "$F$ has coefficient $2$ on $x_1$" },
        { do: "Match the second coefficient", result: "$y_2=-1$", why: "$F$ has coefficient $-1$ on $x_2$" },
        { do: "Match the third coefficient", result: "$y_3=4$", why: "$F$ has coefficient $4$ on $x_3$" },
        { do: "Write the representing vector", result: "$y=(2,-1,4)$", why: "$F(x)=\\langle x,y\\rangle$" },
        { do: "Compute its norm", result: "$\\|y\\|=\\sqrt{4+1+16}=\\sqrt{21}$", why: "Riesz gives $\\|F\\|=\\|y\\|$" }
      ],
      verify: "For $x=(1,2,3)$, $F(x)=2-2+12=12$ and $\\langle x,y\\rangle=2-2+12=12$.",
      answer: "The representing vector is $(2,-1,4)$ and $\\|F\\|=\\sqrt{21}$.",
      connects: "Riesz turns a continuous linear measurement into a concrete vector."
    },
    practice: [
      { problem: "Find the representing vector for $F(x,y)=3x+5y$ on $\\mathbb{R}^2$.", steps: [
        { do: "Write the dot product form", result: "$\\langle (x,y),(a,b)\\rangle=ax+by$", why: "standard inner product" },
        { do: "Match the $x$ coefficient", result: "$a=3$", why: "coefficient in $F$" },
        { do: "Match the $y$ coefficient", result: "$b=5$", why: "coefficient in $F$" },
        { do: "Write the vector", result: "$(3,5)$", why: "represents the functional" },
        { do: "Check quickly", result: "$\\langle (x,y),(3,5)\\rangle=3x+5y$", why: "matches $F$" }
      ], answer: "The representing vector is $(3,5)$." },
      { problem: "For $F(x,y)=3x+5y$, compute $\\|F\\|$.", steps: [
        { do: "Use the representing vector", result: "$z=(3,5)$", why: "from Riesz" },
        { do: "Square the first coordinate", result: "$9$", why: "norm squared" },
        { do: "Square the second coordinate", result: "$25$", why: "norm squared" },
        { do: "Add", result: "$34$", why: "total squared norm" },
        { do: "Take the square root", result: "$\\sqrt{34}$", why: "$\\|F\\|=\\|z\\|$" }
      ], answer: "$\\|F\\|=\\sqrt{34}$." },
      { problem: "On $L^2[0,1]$, let $F(f)=\\int_0^1 f(t)t\\,dt$. Find the representing function.", steps: [
        { do: "Recall the $L^2$ inner product", result: "$\\langle f,g\\rangle=\\int_0^1 f(t)g(t)\\,dt$", why: "function-space dot product" },
        { do: "Compare with $F(f)$", result: "$\\int_0^1 f(t)t\\,dt$", why: "same form" },
        { do: "Identify $g(t)$", result: "$g(t)=t$", why: "the weight multiplying $f(t)$" },
        { do: "Check membership", result: "$\\int_0^1 t^2\\,dt=1/3$", why: "$t\\in L^2[0,1]$" },
        { do: "State representation", result: "$F(f)=\\langle f,t\\rangle$", why: "Riesz form" }
      ], answer: "The representing function is $g(t)=t$." },
      { problem: "Compute the norm of $F(f)=\\int_0^1 f(t)t\\,dt$ on $L^2[0,1]$.", steps: [
        { do: "Use representing function", result: "$g(t)=t$", why: "from the previous representation" },
        { do: "Write $\\|g\\|_2^2$", result: "$\\int_0^1 t^2\\,dt$", why: "function norm squared" },
        { do: "Integrate", result: "$1/3$", why: "power rule" },
        { do: "Take the square root", result: "$1/\\sqrt3$", why: "norm of $g$" },
        { do: "Apply Riesz", result: "$\\|F\\|=1/\\sqrt3$", why: "functional norm equals representing-vector norm" }
      ], answer: "$\\|F\\|=1/\\sqrt3$." },
      { problem: "If $F(x)=\\langle x,y\\rangle$ and $\\|y\\|=4$, show $|F(x)|\\le4\\|x\\|$ and give equality example.", steps: [
        { do: "Apply Cauchy-Schwarz", result: "$|\\langle x,y\\rangle|\\le\\|x\\|\\|y\\|$", why: "inner-product bound" },
        { do: "Substitute $\\|y\\|=4$", result: "$|F(x)|\\le4\\|x\\|$", why: "use the given norm" },
        { do: "Choose $x=y$", result: "$F(y)=\\langle y,y\\rangle=16$", why: "parallel direction maximizes alignment" },
        { do: "Compute the bound at $x=y$", result: "$4\\|y\\|=16$", why: "right side" },
        { do: "Compare", result: "equality holds", why: "the bound is sharp" }
      ], answer: "$|F(x)|\\le4\\|x\\|$, with equality when $x=y$ in this example." }
    ],
    applications: [
      { title: "Gradients as representing vectors", background: "In Euclidean optimization, the derivative as a linear functional is represented by the gradient vector.", numbers: "If $Df(w)[h]=2h_1-3h_2$, then $\\nabla f(w)=(2,-3)$." },
      { title: "Attention scoring", background: "A fixed query defines a linear score on keys by inner product.", numbers: "Query $q=[2,-1]$ gives functional $F(k)=2k_1-k_2$ with representing vector $q$." },
      { title: "Weighted averages", background: "A weighted integral is a linear measurement represented by its weight function in $L^2$.", numbers: "$F(f)=\\int_0^1 f(t)2t\\,dt$ has representing function $2t$ and norm $2/\\sqrt3$." },
      { title: "Kernel evaluation", background: "Reproducing-kernel Hilbert spaces use Riesz to represent evaluation by a kernel section.", numbers: "If $f(x)=\\langle f,k_x\\rangle$ and $\\|k_x\\|=2$, then $|f(x)|\\le2\\|f\\|$." },
      { title: "Sensitivity analysis", background: "A linear sensitivity map has a vector whose norm is the worst-case amplification.", numbers: "Sensitivity $F(h)=3h_1+4h_2$ has norm $5$, so unit perturbations change output by at most $5$." },
      { title: "Dual embeddings", background: "Linear probes in representation learning are functionals, represented by probe weight vectors.", numbers: "Probe weight $w=[1,2,2]$ has norm $3$, so $|w\\cdot x|\\le3\\|x\\|$." }
    ],
    applicationsClose: "Riesz says continuous linear questions in Hilbert space always have a vector asking them.",
    takeaways: [
      "Every bounded linear functional on a Hilbert space is inner product with one unique vector.",
      "The functional norm equals the norm of its representing vector.",
      "Gradients, linear probes, weighted averages, and kernel evaluation all use this representation idea."
    ]
  },

  "math-05-11": {
    id: "math-05-11",
    title: "Bounded linear operators",
    tagline: "A bounded linear operator cannot stretch vectors by more than one fixed factor.",
    connections: {
      buildsOn: ["Linear operators", "Norms and normed spaces", "Banach spaces and completeness"],
      leadsTo: ["operator norms", "stability", "spectral theory"],
      usedWith: ["continuity", "Lipschitz maps", "matrix norms", "duality"]
    },
    motivation:
      "<p>A linear map can rotate, scale, mix, smooth, or differentiate. But for analysis and ML, we often need to know whether small inputs stay controlled.</p>" +
      "<p>A <b>bounded linear operator</b> has one global stretch limit. That single number, the operator norm, turns vague stability into a precise inequality.</p>",
    definition:
      "<p>A linear operator $T:V\\to W$ between normed spaces is <b>bounded</b> if there exists $C\\ge0$ such that $$\\|Tx\\|_W\\le C\\|x\\|_V\\quad\\text{for all }x\\in V.$$ The smallest such $C$ is the <b>operator norm</b>, written $$\\|T\\|=\\sup_{\\|x\\|\\le1}\\|Tx\\|.$$</p>" +
      "<p>For linear maps, boundedness and continuity are equivalent. If $\\|Tx\\|\\le C\\|x\\|$, then nearby inputs have nearby outputs because $\\|Tx-Ty\\|=\\|T(x-y)\\|\\le C\\|x-y\\|$.</p>" +
      "<p><b>Assumptions that matter:</b> the norms on domain and codomain must be specified; all linear maps in finite-dimensional spaces are bounded; and in infinite-dimensional spaces some natural linear maps, such as differentiation on broad function spaces, can be unbounded.</p>",
    worked: {
      problem: "For $T(x,y)=(2x,3y)$ on $\\mathbb{R}^2$ with the Euclidean norm, find $\\|T\\|$.",
      skills: ["operator norm", "stretch factors", "supremum"],
      strategy: "Compute the output length on a unit input and find the largest possible stretch.",
      steps: [
        { do: "Write the squared output norm", result: "$\\|T(x,y)\\|^2=4x^2+9y^2$", why: "square the scaled coordinates" },
        { do: "Use the unit-input condition", result: "$x^2+y^2=1$", why: "operator norm checks unit vectors" },
        { do: "Bound the expression", result: "$4x^2+9y^2\\le9x^2+9y^2$", why: "$4x^2\\le9x^2$" },
        { do: "Simplify the bound", result: "$4x^2+9y^2\\le9$", why: "$x^2+y^2=1$" },
        { do: "Take square roots", result: "$\\|T(x,y)\\|\\le3$", why: "unit inputs stretch by at most $3$" },
        { do: "Test $x=(0,1)$", result: "$\\|T(0,1)\\|=3$", why: "the bound is attained" }
      ],
      verify: "The map stretches the $y$-axis by $3$ and the $x$-axis by $2$, so the largest stretch should be $3$.",
      answer: "$\\|T\\|=3$.",
      connects: "The operator norm is the worst-case stretch of a linear map."
    },
    practice: [
      { problem: "For $S(x,y)=(x,0)$ with Euclidean norm, find $\\|S\\|$.", steps: [
        { do: "Compute output norm", result: "$\\|S(x,y)\\|=|x|$", why: "only the first coordinate remains" },
        { do: "Compare with input norm", result: "$|x|\\le\\sqrt{x^2+y^2}$", why: "input norm includes both coordinates" },
        { do: "Get an upper bound", result: "$\\|S(x,y)\\|\\le\\|(x,y)\\|$", why: "stretch factor at most $1$" },
        { do: "Test $(1,0)$", result: "$\\|S(1,0)\\|=1$", why: "unit input reaches the bound" },
        { do: "Conclude", result: "$\\|S\\|=1$", why: "smallest valid bound is attained" }
      ], answer: "$\\|S\\|=1$." },
      { problem: "For $F(x,y)=x-y$ as a map from $\\mathbb{R}^2$ to $\\mathbb{R}$ with Euclidean norm, find $\\|F\\|$.", steps: [
        { do: "Represent $F$ by a vector", result: "$a=(1,-1)$", why: "$F(z)=\\langle z,a\\rangle$" },
        { do: "Use Riesz/Cauchy-Schwarz", result: "$|F(z)|\\le\\|a\\|\\|z\\|$", why: "functional norm equals representing-vector norm" },
        { do: "Compute $\\|a\\|$", result: "$\\sqrt{1^2+(-1)^2}=\\sqrt2$", why: "Euclidean norm" },
        { do: "Find an attaining direction", result: "$z=a/\\sqrt2$", why: "parallel to the representing vector" },
        { do: "Conclude", result: "$\\|F\\|=\\sqrt2$", why: "upper bound is sharp" }
      ], answer: "$\\|F\\|=\\sqrt2$." },
      { problem: "Show that $T(x)=5x$ on a normed space has operator norm $5$.", steps: [
        { do: "Compute output norm", result: "$\\|T x\\|=\\|5x\\|$", why: "apply the operator" },
        { do: "Use norm homogeneity", result: "$\\|5x\\|=5\\|x\\|$", why: "scalar factor leaves the norm" },
        { do: "Read a valid bound", result: "$C=5$", why: "$\\|Tx\\|\\le5\\|x\\|$" },
        { do: "Use any unit vector", result: "$\\|Tx\\|=5$ when $\\|x\\|=1$", why: "the bound is attained" },
        { do: "Conclude", result: "$\\|T\\|=5$", why: "no smaller bound can work" }
      ], answer: "$\\|T\\|=5$." },
      { problem: "For diagonal matrix $A=\\operatorname{diag}(1,4,2)$ with Euclidean norm, find the operator norm.", steps: [
        { do: "Write output squared norm", result: "$x_1^2+16x_2^2+4x_3^2$", why: "diagonal scaling" },
        { do: "Use unit input", result: "$x_1^2+x_2^2+x_3^2=1$", why: "operator norm checks unit sphere" },
        { do: "Bound by largest square", result: "$x_1^2+16x_2^2+4x_3^2\\le16$", why: "each coefficient is at most $16$ times its squared coordinate" },
        { do: "Take square roots", result: "$\\|Ax\\|\\le4$", why: "largest possible stretch" },
        { do: "Test $e_2$", result: "$\\|Ae_2\\|=4$", why: "the largest diagonal entry is attained" }
      ], answer: "$\\|A\\|=4$." },
      { problem: "A linear layer has operator norm at most $2.5$. If input perturbation norm is $0.04$, bound the output perturbation.", steps: [
        { do: "Write the boundedness inequality", result: "$\\|T\\Delta x\\|\\le\\|T\\|\\,\\|\\Delta x\\|$", why: "operator norm controls stretch" },
        { do: "Substitute the norm bound", result: "$\\|T\\Delta x\\|\\le2.5\\cdot0.04$", why: "use the given values" },
        { do: "Multiply", result: "$0.10$", why: "$2.5\\cdot0.04=0.10$" },
        { do: "Interpret", result: "output perturbation is at most $0.10$", why: "worst-case stability bound" },
        { do: "State dependence", result: "the actual change may be smaller", why: "operator norm is a worst-case bound" }
      ], answer: "The output perturbation norm is at most $0.10$." }
    ],
    applications: [
      { title: "Neural-network Lipschitz bounds", background: "Bounding layer norms helps control how much inputs can affect outputs.", numbers: "Layer norms $2$, $1.5$, and $3$ give network bound at most $2\\cdot1.5\\cdot3=9$." },
      { title: "Gradient stability", background: "Backpropagation multiplies by linearized operators, so their norms influence exploding or vanishing gradients.", numbers: "Repeated norm $0.8$ over $10$ layers gives factor $0.8^{10}\\approx0.107$." },
      { title: "Convolution filters", background: "A fixed filter is a bounded linear operator on finite signals.", numbers: "A moving average of three values has weights $1/3,1/3,1/3$ and does not amplify constant input $[6,6,6]$, returning $6$." },
      { title: "Robustness certificates", background: "If a classifier's score map has a small operator norm, input perturbation effects are limited.", numbers: "With norm bound $4$, perturbation $0.01$ changes score by at most $0.04$." },
      { title: "Numerical conditioning", background: "Matrix operator norms quantify how much data errors can be amplified.", numbers: "If $\\|A\\|=20$ and input error is $0.001$, output error is at most $0.02$." },
      { title: "Regularizing linear layers", background: "Spectral normalization constrains the largest singular value, which is the Euclidean operator norm.", numbers: "If the largest singular value is clipped from $5$ to $1$, worst-case stretch drops by factor $5$." }
    ],
    applicationsClose: "Bounded operators make stability quantitative: one stretch factor controls every input direction.",
    takeaways: [
      "A bounded linear operator satisfies $\\|Tx\\|\\le C\\|x\\|$ for all inputs.",
      "The operator norm is the smallest such $C$, equivalently the largest unit-input output norm.",
      "For linear maps, boundedness is the same as continuity."
    ]
  }
};
