module.exports = {
  "math-09-14": {
    id: "math-09-14",
    title: "Linear transformations",
    tagline: "A linear transformation is a dependable machine that moves vectors while respecting addition and scaling.",
    connections: {
      buildsOn: ["vectors", "matrix-vector multiplication", "span and linear combinations"],
      leadsTo: ["Matrix of a linear transformation", "Change of basis", "eigenvalues and eigenvectors"],
      usedWith: ["basis vectors", "composition of functions", "null space", "range"]
    },
    motivation:
      "<p>You already know how to move a vector such as $\\begin{bmatrix}2 \\\\ 1\\end{bmatrix}$ by stretching, rotating, or projecting it. The new question is not just where one vector goes, but whether the rule behaves predictably for every vector.</p>" +
      "<p>A <b>linear transformation</b> is the kind of vector-moving rule that respects the structure of vector space. If you understand what it does to a few building blocks, you can understand what it does to every vector built from them.</p>",
    definition:
      "<p>A transformation $T:V\\to W$ from a vector space $V$ to a vector space $W$ is <b>linear</b> if for all vectors $u,v\\in V$ and all scalars $c$, it satisfies $T(u+v)=T(u)+T(v)$ and $T(cu)=cT(u)$. The first rule says adding before or after applying $T$ gives the same result; the second says scaling before or after applying $T$ gives the same result.</p>" +
      "<p>These two rules combine into one useful fact: $T(au+bv)=aT(u)+bT(v)$. Derive it directly: $T(au+bv)=T(au)+T(bv)=aT(u)+bT(v)$. So a linear transformation preserves linear combinations, which is why bases are so powerful.</p>" +
      "<p><b>Assumptions that matter:</b> the zero vector must map to the zero vector because $T(0)=T(0\\cdot v)=0\\cdot T(v)=0$; translations such as $T(x)=x+b$ with $b\\ne0$ are not linear; and the domain and codomain must be vector spaces over the same scalar field.</p>",
    worked: {
      problem: "Let $T:\\mathbb R^2\\to\\mathbb R^2$ be $T\\left(\\begin{bmatrix}x \\\\ y\\end{bmatrix}\\right)=\\begin{bmatrix}2x-y \\\\ x+3y\\end{bmatrix}$. Compute $T\\left(\\begin{bmatrix}3 \\\\ -1\\end{bmatrix}\\right)$ and verify one linearity check using $u=\\begin{bmatrix}1 \\\\ 2\\end{bmatrix}$ and $v=\\begin{bmatrix}2 \\\\ -1\\end{bmatrix}$.",
      skills: ["evaluating transformations", "matrix-style vector arithmetic", "linearity checks"],
      strategy: "The rule has two output coordinates — substitute carefully, then compare $T(u+v)$ with $T(u)+T(v)$.",
      steps: [
        { do: "Substitute $x=3$ and $y=-1$", result: "$T\\left(\\begin{bmatrix}3 \\\\ -1\\end{bmatrix}\\right)=\\begin{bmatrix}2\\cdot3-(-1) \\\\ 3+3(-1)\\end{bmatrix}$", why: "replace each coordinate in the rule" },
        { do: "Simplify the first output", result: "$2\\cdot3-(-1)=7$", why: "subtracting $-1$ adds 1" },
        { do: "Simplify the second output", result: "$3+3(-1)=0$", why: "the terms cancel" },
        { do: "Add the test vectors", result: "$u+v=\\begin{bmatrix}3 \\\\ 1\\end{bmatrix}$", why: "add coordinates" },
        { do: "Apply $T$ to the sum", result: "$T(u+v)=\\begin{bmatrix}5 \\\\ 6\\end{bmatrix}$", why: "$2\\cdot3-1=5$ and $3+3\\cdot1=6$" },
        { do: "Apply $T$ to $u$", result: "$T(u)=\\begin{bmatrix}0 \\\\ 7\\end{bmatrix}$", why: "$2\\cdot1-2=0$ and $1+3\\cdot2=7$" },
        { do: "Apply $T$ to $v$", result: "$T(v)=\\begin{bmatrix}5 \\\\ -1\\end{bmatrix}$", why: "$2\\cdot2-(-1)=5$ and $2+3(-1)=-1$" },
        { do: "Add the images", result: "$T(u)+T(v)=\\begin{bmatrix}5 \\\\ 6\\end{bmatrix}$", why: "the image of the sum matches the sum of the images" }
      ],
      verify: "The rule also sends $\\begin{bmatrix}0 \\\\ 0\\end{bmatrix}$ to $\\begin{bmatrix}0 \\\\ 0\\end{bmatrix}$, which is required for linearity.",
      answer: "$T\\left(\\begin{bmatrix}3 \\\\ -1\\end{bmatrix}\\right)=\\begin{bmatrix}7 \\\\ 0\\end{bmatrix}$, and the additivity check works for the chosen vectors.",
      connects: "A linear transformation preserves the arithmetic of vectors, not merely their shape in a picture."
    },
    practice: [
      { problem: "For $S\\left(\\begin{bmatrix}x \\\\ y\\end{bmatrix}\\right)=\\begin{bmatrix}x+2y \\\\ 4y\\end{bmatrix}$, compute $S\\left(\\begin{bmatrix}1 \\\\ 3\\end{bmatrix}\\right)$ and $S\\left(2\\begin{bmatrix}1 \\\\ 3\\end{bmatrix}\\right)$.", steps: [
        { do: "Evaluate $S$ at the vector", result: "$S\\left(\\begin{bmatrix}1 \\\\ 3\\end{bmatrix}\\right)=\\begin{bmatrix}1+2\\cdot3 \\\\ 4\\cdot3\\end{bmatrix}$", why: "substitute $x=1$, $y=3$" },
        { do: "Simplify the image", result: "$\\begin{bmatrix}7 \\\\ 12\\end{bmatrix}$", why: "$1+6=7$ and $12=12$" },
        { do: "Scale the input", result: "$2\\begin{bmatrix}1 \\\\ 3\\end{bmatrix}=\\begin{bmatrix}2 \\\\ 6\\end{bmatrix}$", why: "multiply both coordinates by 2" },
        { do: "Apply $S$ to the scaled input", result: "$S\\left(\\begin{bmatrix}2 \\\\ 6\\end{bmatrix}\\right)=\\begin{bmatrix}14 \\\\ 24\\end{bmatrix}$", why: "$2+12=14$ and $4\\cdot6=24$" },
        { do: "Compare with twice the first image", result: "$2\\begin{bmatrix}7 \\\\ 12\\end{bmatrix}=\\begin{bmatrix}14 \\\\ 24\\end{bmatrix}$", why: "this scaling check agrees" }
      ], answer: "$S\\left(\\begin{bmatrix}1 \\\\ 3\\end{bmatrix}\\right)=\\begin{bmatrix}7 \\\\ 12\\end{bmatrix}$ and $S\\left(2\\begin{bmatrix}1 \\\\ 3\\end{bmatrix}\\right)=\\begin{bmatrix}14 \\\\ 24\\end{bmatrix}$." },
      { problem: "Decide whether $T\\left(\\begin{bmatrix}x \\\\ y\\end{bmatrix}\\right)=\\begin{bmatrix}x+1 \\\\ y\\end{bmatrix}$ can be linear.", steps: [
        { do: "Evaluate the zero vector", result: "$T\\left(\\begin{bmatrix}0 \\\\ 0\\end{bmatrix}\\right)=\\begin{bmatrix}1 \\\\ 0\\end{bmatrix}$", why: "substitute $x=0$, $y=0$" },
        { do: "Recall the required zero behavior", result: "$T(0)=0$ for every linear transformation", why: "homogeneity with scalar 0 forces this" },
        { do: "Compare the two zero vectors", result: "$\\begin{bmatrix}1 \\\\ 0\\end{bmatrix}\\ne\\begin{bmatrix}0 \\\\ 0\\end{bmatrix}$", why: "the rule shifts every vector right" },
        { do: "Name the failing feature", result: "translation by $\\begin{bmatrix}1 \\\\ 0\\end{bmatrix}$", why: "adding a fixed nonzero vector breaks linearity" },
        { do: "Conclude", result: "not linear", why: "one required property fails" }
      ], answer: "The transformation is not linear because it does not send the zero vector to the zero vector." },
      { problem: "Let $P\\left(\\begin{bmatrix}x \\\\ y\\end{bmatrix}\\right)=\\begin{bmatrix}x \\\\ 0\\end{bmatrix}$. Compute $P(a u+b v)$ for $u=\\begin{bmatrix}2 \\\\ 5\\end{bmatrix}$, $v=\\begin{bmatrix}-1 \\\\ 3\\end{bmatrix}$, $a=3$, $b=2$.", steps: [
        { do: "Scale $u$", result: "$3u=\\begin{bmatrix}6 \\\\ 15\\end{bmatrix}$", why: "multiply both coordinates by 3" },
        { do: "Scale $v$", result: "$2v=\\begin{bmatrix}-2 \\\\ 6\\end{bmatrix}$", why: "multiply both coordinates by 2" },
        { do: "Add the scaled vectors", result: "$3u+2v=\\begin{bmatrix}4 \\\\ 21\\end{bmatrix}$", why: "add coordinates" },
        { do: "Apply the projection", result: "$P(3u+2v)=\\begin{bmatrix}4 \\\\ 0\\end{bmatrix}$", why: "the rule keeps the first coordinate and sets the second to zero" },
        { do: "Interpret the result", result: "only the $x$-component survives", why: "projection onto the $x$-axis discards vertical information" }
      ], answer: "$P(3u+2v)=\\begin{bmatrix}4 \\\\ 0\\end{bmatrix}$." },
      { problem: "A transformation is known by $T(e_1)=\\begin{bmatrix}2 \\\\ 1\\end{bmatrix}$ and $T(e_2)=\\begin{bmatrix}-1 \\\\ 3\\end{bmatrix}$, where $e_1=\\begin{bmatrix}1 \\\\ 0\\end{bmatrix}$ and $e_2=\\begin{bmatrix}0 \\\\ 1\\end{bmatrix}$. Find $T\\left(\\begin{bmatrix}4 \\\\ -2\\end{bmatrix}\\right)$.", steps: [
        { do: "Write the input in the standard basis", result: "$\\begin{bmatrix}4 \\\\ -2\\end{bmatrix}=4e_1-2e_2$", why: "coordinates are coefficients of basis vectors" },
        { do: "Use linearity", result: "$T(4e_1-2e_2)=4T(e_1)-2T(e_2)$", why: "linear transformations preserve linear combinations" },
        { do: "Substitute the known images", result: "$4\\begin{bmatrix}2 \\\\ 1\\end{bmatrix}-2\\begin{bmatrix}-1 \\\\ 3\\end{bmatrix}$", why: "replace $T(e_1)$ and $T(e_2)$" },
        { do: "Scale the images", result: "$\\begin{bmatrix}8 \\\\ 4\\end{bmatrix}-\\begin{bmatrix}-2 \\\\ 6\\end{bmatrix}$", why: "multiply each coordinate" },
        { do: "Subtract coordinates", result: "$\\begin{bmatrix}10 \\\\ -2\\end{bmatrix}$", why: "$8-(-2)=10$ and $4-6=-2$" }
      ], answer: "$T\\left(\\begin{bmatrix}4 \\\\ -2\\end{bmatrix}\\right)=\\begin{bmatrix}10 \\\\ -2\\end{bmatrix}$." },
      { problem: "In a simple feature map, $F\\left(\\begin{bmatrix}x \\\\ y\\end{bmatrix}\\right)=\\begin{bmatrix}0.5x+0.5y \\\\ x-y\\end{bmatrix}$. Compute the transformed feature for $\\begin{bmatrix}8 \\\\ 2\\end{bmatrix}$ and explain whether the rule is linear.", steps: [
        { do: "Substitute the feature values", result: "$F\\left(\\begin{bmatrix}8 \\\\ 2\\end{bmatrix}\\right)=\\begin{bmatrix}0.5\\cdot8+0.5\\cdot2 \\\\ 8-2\\end{bmatrix}$", why: "use $x=8$, $y=2$" },
        { do: "Simplify the average coordinate", result: "$0.5\\cdot8+0.5\\cdot2=5$", why: "$4+1=5$" },
        { do: "Simplify the contrast coordinate", result: "$8-2=6$", why: "subtract the two feature values" },
        { do: "State the output", result: "$\\begin{bmatrix}5 \\\\ 6\\end{bmatrix}$", why: "combine the two coordinates" },
        { do: "Check the form of each coordinate", result: "linear combinations with no constant term", why: "that form preserves addition and scaling" }
      ], answer: "The transformed feature is $\\begin{bmatrix}5 \\\\ 6\\end{bmatrix}$, and the rule is linear." }
    ],
    applications: [
      { title: "Image rotation", background: "Computer graphics uses linear transformations to rotate pixel coordinates around the origin before drawing them on screen.", numbers: "A $90^{\\circ}$ rotation sends $\\begin{bmatrix}x \\\\ y\\end{bmatrix}$ to $\\begin{bmatrix}-y \\\\ x\\end{bmatrix}$, so $\\begin{bmatrix}3 \\\\ 1\\end{bmatrix}$ becomes $\\begin{bmatrix}-1 \\\\ 3\\end{bmatrix}$." },
      { title: "Feature mixing", background: "Many ML preprocessing steps create new features as weighted sums of old features. With no intercept, that mixing is linear.", numbers: "From features $\\begin{bmatrix}10 \\\\ 4\\end{bmatrix}$, the map $\\begin{bmatrix}0.7x+0.3y \\\\ x-y\\end{bmatrix}$ gives $\\begin{bmatrix}8.2 \\\\ 6\\end{bmatrix}$." },
      { title: "Projection onto an axis", background: "Projection removes a component while keeping the part aligned with a chosen direction, a basic operation in geometry and data reduction.", numbers: "Projecting $\\begin{bmatrix}5 \\\\ -2\\end{bmatrix}$ onto the $x$-axis gives $\\begin{bmatrix}5 \\\\ 0\\end{bmatrix}$." },
      { title: "Audio channel mixing", background: "Stereo-to-mono conversion combines left and right audio channels by a weighted linear rule.", numbers: "Left $0.8$ and right $0.2$ become mono $0.5(0.8)+0.5(0.2)=0.5$." },
      { title: "Embedding compression", background: "A learned linear layer can compress an embedding before a classifier uses it. The layer preserves linear-combination arithmetic before nonlinearities appear.", numbers: "For $z=0.2x_1-0.1x_2+0.5x_3$ and input $(3,4,2)$, the compressed coordinate is $0.6-0.4+1=1.2$." },
      { title: "Finite differences in signals", background: "Signal processing often uses linear transformations to measure change between neighboring samples.", numbers: "The difference map $(a,b,c)\\mapsto(b-a,c-b)$ sends $(2,5,4)$ to $(3,-1)$." }
    ],
    applicationsClose: "The same idea wears many uniforms: rotate, project, mix, compress, or differ, but preserve vector addition and scaling.",
    takeaways: [
      "A linear transformation preserves addition and scalar multiplication.",
      "Every linear transformation sends the zero vector to the zero vector.",
      "Knowing the images of basis vectors determines the whole transformation.",
      "Rotations, projections, feature mixing, and linear layers are transformation thinking in practice."
    ]
  },

  "math-09-15": {
    id: "math-09-15",
    title: "Matrix of a linear transformation",
    tagline: "A matrix records where a linear transformation sends the basis vectors, one column at a time.",
    connections: {
      buildsOn: ["Linear transformations", "standard basis", "matrix-vector multiplication"],
      leadsTo: ["Change of basis", "Determinants", "eigenvalue equation"],
      usedWith: ["composition", "basis vectors", "column space", "systems of linear equations"]
    },
    motivation:
      "<p>You just learned that a linear transformation is determined by what it does to basis vectors. A matrix is the most compact way to store that information.</p>" +
      "<p>For a transformation from $\\mathbb R^2$ to $\\mathbb R^2$, the first column tells where $e_1$ goes and the second column tells where $e_2$ goes. Then matrix-vector multiplication rebuilds the image of any input vector as the same linear combination of those columns.</p>",
    definition:
      "<p>If $T:\\mathbb R^n\\to\\mathbb R^m$ is linear, its standard matrix $A$ is the $m\\times n$ matrix whose $j$th column is $T(e_j)$, where $e_j$ is the $j$th standard basis vector. Then for every $x\\in\\mathbb R^n$, $T(x)=Ax$.</p>" +
      "<p>Why this works: every input $x=\\begin{bmatrix}x_1 \\\\ \\cdots \\\\ x_n\\end{bmatrix}$ equals $x_1e_1+\\cdots+x_ne_n$. By linearity, $T(x)=x_1T(e_1)+\\cdots+x_nT(e_n)$, which is exactly how $Ax$ combines the columns of $A$.</p>" +
      "<p><b>Assumptions that matter:</b> the columns are written in the chosen ordered basis; a map $\\mathbb R^n\\to\\mathbb R^m$ has an $m\\times n$ matrix; and changing the basis changes the matrix even when the underlying transformation stays the same.</p>",
    worked: {
      problem: "Find the standard matrix for the linear transformation with $T(e_1)=\\begin{bmatrix}2 \\\\ 1\\end{bmatrix}$ and $T(e_2)=\\begin{bmatrix}-1 \\\\ 3\\end{bmatrix}$, then compute $T\\left(\\begin{bmatrix}4 \\\\ -2\\end{bmatrix}\\right)$.",
      skills: ["standard matrices", "basis images", "matrix-vector multiplication"],
      strategy: "The columns are already given — assemble them, then multiply by the coordinate vector.",
      steps: [
        { do: "Place $T(e_1)$ as the first column", result: "$\\begin{bmatrix}2 \\\\ 1\\end{bmatrix}$", why: "the first standard basis vector controls column 1" },
        { do: "Place $T(e_2)$ as the second column", result: "$\\begin{bmatrix}-1 \\\\ 3\\end{bmatrix}$", why: "the second standard basis vector controls column 2" },
        { do: "Write the matrix", result: "$A=\\begin{bmatrix}2 & -1 \\\\ 1 & 3\\end{bmatrix}$", why: "columns are written side by side" },
        { do: "Set up the product", result: "$A\\begin{bmatrix}4 \\\\ -2\\end{bmatrix}=\\begin{bmatrix}2 & -1 \\\\ 1 & 3\\end{bmatrix}\\begin{bmatrix}4 \\\\ -2\\end{bmatrix}$", why: "the matrix represents $T$" },
        { do: "Compute the first coordinate", result: "$2\\cdot4+(-1)(-2)=10$", why: "dot row 1 with the input" },
        { do: "Compute the second coordinate", result: "$1\\cdot4+3(-2)=-2$", why: "dot row 2 with the input" },
        { do: "Write the output vector", result: "$\\begin{bmatrix}10 \\\\ -2\\end{bmatrix}$", why: "combine the two coordinates" }
      ],
      verify: "The input $\\begin{bmatrix}4 \\\\ -2\\end{bmatrix}$ means $4e_1-2e_2$, so the output $4T(e_1)-2T(e_2)$ also gives $\\begin{bmatrix}10 \\\\ -2\\end{bmatrix}$.",
      answer: "$A=\\begin{bmatrix}2 & -1 \\\\ 1 & 3\\end{bmatrix}$ and $T\\left(\\begin{bmatrix}4 \\\\ -2\\end{bmatrix}\\right)=\\begin{bmatrix}10 \\\\ -2\\end{bmatrix}$.",
      connects: "A matrix is a table of basis-vector destinations, and multiplication performs the linear recombination."
    },
    practice: [
      { problem: "Find the standard matrix for $T(x,y)=(x+3y,2x-y)$.", steps: [
        { do: "Apply $T$ to $e_1$", result: "$T(1,0)=(1,2)$", why: "set $x=1$, $y=0$" },
        { do: "Apply $T$ to $e_2$", result: "$T(0,1)=(3,-1)$", why: "set $x=0$, $y=1$" },
        { do: "Make the first column", result: "$\\begin{bmatrix}1 \\\\ 2\\end{bmatrix}$", why: "this is $T(e_1)$" },
        { do: "Make the second column", result: "$\\begin{bmatrix}3 \\\\ -1\\end{bmatrix}$", why: "this is $T(e_2)$" },
        { do: "Assemble the matrix", result: "$\\begin{bmatrix}1 & 3 \\\\ 2 & -1\\end{bmatrix}$", why: "columns store basis images" }
      ], answer: "The standard matrix is $\\begin{bmatrix}1 & 3 \\\\ 2 & -1\\end{bmatrix}$." },
      { problem: "For $A=\\begin{bmatrix}0 & -1 \\\\ 1 & 0\\end{bmatrix}$, compute $Ae_1$, $Ae_2$, and identify the geometric action.", steps: [
        { do: "Multiply by $e_1$", result: "$A\\begin{bmatrix}1 \\\\ 0\\end{bmatrix}=\\begin{bmatrix}0 \\\\ 1\\end{bmatrix}$", why: "matrix times $e_1$ selects column 1" },
        { do: "Multiply by $e_2$", result: "$A\\begin{bmatrix}0 \\\\ 1\\end{bmatrix}=\\begin{bmatrix}-1 \\\\ 0\\end{bmatrix}$", why: "matrix times $e_2$ selects column 2" },
        { do: "Track the $x$-axis unit vector", result: "$e_1\\mapsto\\begin{bmatrix}0 \\\\ 1\\end{bmatrix}$", why: "the horizontal unit vector becomes vertical" },
        { do: "Track the $y$-axis unit vector", result: "$e_2\\mapsto\\begin{bmatrix}-1 \\\\ 0\\end{bmatrix}$", why: "the vertical unit vector becomes leftward" },
        { do: "Name the transformation", result: "$90^{\\circ}$ counterclockwise rotation", why: "both basis vectors rotate by the same quarter turn" }
      ], answer: "$Ae_1=\\begin{bmatrix}0 \\\\ 1\\end{bmatrix}$, $Ae_2=\\begin{bmatrix}-1 \\\\ 0\\end{bmatrix}$; the matrix rotates by $90^{\\circ}$ counterclockwise." },
      { problem: "A linear map $T:\\mathbb R^3\\to\\mathbb R^2$ satisfies $T(e_1)=\\begin{bmatrix}1 \\\\ 0\\end{bmatrix}$, $T(e_2)=\\begin{bmatrix}2 \\\\ -1\\end{bmatrix}$, and $T(e_3)=\\begin{bmatrix}0 \\\\ 4\\end{bmatrix}$. Find its matrix and compute $T\\left(\\begin{bmatrix}3 \\\\ 1 \\\\ -2\\end{bmatrix}\\right)$.", steps: [
        { do: "Write the columns", result: "$\\begin{bmatrix}1 \\\\ 0\\end{bmatrix}$, $\\begin{bmatrix}2 \\\\ -1\\end{bmatrix}$, $\\begin{bmatrix}0 \\\\ 4\\end{bmatrix}$", why: "each column is one basis image" },
        { do: "Assemble the $2\\times3$ matrix", result: "$A=\\begin{bmatrix}1 & 2 & 0 \\\\ 0 & -1 & 4\\end{bmatrix}$", why: "the codomain has 2 coordinates and the domain has 3" },
        { do: "Set up the multiplication", result: "$A\\begin{bmatrix}3 \\\\ 1 \\\\ -2\\end{bmatrix}$", why: "apply the matrix to the input" },
        { do: "Compute the first coordinate", result: "$1\\cdot3+2\\cdot1+0(-2)=5$", why: "dot row 1 with the input" },
        { do: "Compute the second coordinate", result: "$0\\cdot3+(-1)\\cdot1+4(-2)=-9$", why: "dot row 2 with the input" }
      ], answer: "$A=\\begin{bmatrix}1 & 2 & 0 \\\\ 0 & -1 & 4\\end{bmatrix}$ and $T\\left(\\begin{bmatrix}3 \\\\ 1 \\\\ -2\\end{bmatrix}\\right)=\\begin{bmatrix}5 \\\\ -9\\end{bmatrix}$." },
      { problem: "Let $A=\\begin{bmatrix}2 & 0 \\\\ 0 & 3\\end{bmatrix}$ and $B=\\begin{bmatrix}1 & 1 \\\\ 0 & 1\\end{bmatrix}$. Compute the matrix of $A\\circ B$.", steps: [
        { do: "Write the composition matrix", result: "$AB$", why: "$B$ acts first and $A$ acts second" },
        { do: "Set up the product", result: "$\\begin{bmatrix}2 & 0 \\\\ 0 & 3\\end{bmatrix}\\begin{bmatrix}1 & 1 \\\\ 0 & 1\\end{bmatrix}$", why: "compose by multiplying matrices" },
        { do: "Compute entry $(1,1)$", result: "$2\\cdot1+0\\cdot0=2$", why: "row 1 dot column 1" },
        { do: "Compute entry $(1,2)$", result: "$2\\cdot1+0\\cdot1=2$", why: "row 1 dot column 2" },
        { do: "Compute the second row", result: "$0,3$", why: "$0\\cdot1+3\\cdot0=0$ and $0\\cdot1+3\\cdot1=3$" }
      ], answer: "The matrix of $A\\circ B$ is $AB=\\begin{bmatrix}2 & 2 \\\\ 0 & 3\\end{bmatrix}$." },
      { problem: "A linear layer maps two features to two hidden values with matrix $W=\\begin{bmatrix}0.2 & 0.8 \\\\ -1 & 0.5\\end{bmatrix}$. Compute $Wx$ for $x=\\begin{bmatrix}10 \\\\ 4\\end{bmatrix}$.", steps: [
        { do: "Set up the product", result: "$\\begin{bmatrix}0.2 & 0.8 \\\\ -1 & 0.5\\end{bmatrix}\\begin{bmatrix}10 \\\\ 4\\end{bmatrix}$", why: "weights multiply the input feature vector" },
        { do: "Compute hidden value 1", result: "$0.2\\cdot10+0.8\\cdot4=5.2$", why: "$2+3.2=5.2$" },
        { do: "Compute hidden value 2", result: "$-1\\cdot10+0.5\\cdot4=-8$", why: "$-10+2=-8$" },
        { do: "Write the output vector", result: "$\\begin{bmatrix}5.2 \\\\ -8\\end{bmatrix}$", why: "stack the hidden values" },
        { do: "Interpret the matrix columns", result: "$10$ times column 1 plus $4$ times column 2", why: "matrix multiplication is column recombination" }
      ], answer: "$Wx=\\begin{bmatrix}5.2 \\\\ -8\\end{bmatrix}$." }
    ],
    applications: [
      { title: "Dense neural-network layers", background: "Before an activation function, a dense layer is matrix multiplication. Each row forms one weighted sum for a hidden unit.", numbers: "With $W=\\begin{bmatrix}1 & -2 \\\\ 0.5 & 3\\end{bmatrix}$ and $x=\\begin{bmatrix}4 \\\\ 1\\end{bmatrix}$, $Wx=\\begin{bmatrix}2 \\\\ 5\\end{bmatrix}$." },
      { title: "2-D graphics transforms", background: "Graphics libraries store rotations, scalings, and shears as matrices so they can be applied quickly to many points.", numbers: "The scale matrix $\\begin{bmatrix}2 & 0 \\\\ 0 & 0.5\\end{bmatrix}$ sends $\\begin{bmatrix}3 \\\\ 8\\end{bmatrix}$ to $\\begin{bmatrix}6 \\\\ 4\\end{bmatrix}$." },
      { title: "Color transformations", background: "Image pipelines use matrices to mix color channels, for example converting RGB-like values into luminance and contrast channels.", numbers: "The row $[0.3,0.6,0.1]$ applied to RGB $(100,150,80)$ gives luminance $30+90+8=128$." },
      { title: "Dimensionality reduction", background: "Linear projections are the first step in methods such as PCA, where data is expressed along selected directions.", numbers: "Projecting $x=\\begin{bmatrix}6 \\\\ 2\\end{bmatrix}$ onto direction row $[0.8,0.6]$ gives $0.8\\cdot6+0.6\\cdot2=6.0$." },
      { title: "Markov transition matrices", background: "Stochastic matrices move probability vectors between states in simulations and ranking systems.", numbers: "With $P=\\begin{bmatrix}0.9 & 0.2 \\\\ 0.1 & 0.8\\end{bmatrix}$ and state $\\begin{bmatrix}0.7 \\\\ 0.3\\end{bmatrix}$, the next state is $\\begin{bmatrix}0.69 \\\\ 0.31\\end{bmatrix}$." },
      { title: "Linear regression design matrices", background: "Batch prediction for many examples is matrix multiplication: rows hold examples and columns hold features.", numbers: "For features $(1,2,5)$ and weights $(0.5,1,-0.2)$, the prediction is $0.5+2-1=1.5$." }
    ],
    applicationsClose: "Matrices turn linear transformations into computable objects: columns store geometry, rows compute outputs, and products compose actions.",
    takeaways: [
      "The standard matrix has columns $T(e_1),T(e_2),\\ldots,T(e_n)$.",
      "A map $\\mathbb R^n\\to\\mathbb R^m$ is represented by an $m\\times n$ matrix.",
      "Matrix-vector multiplication recombines the image columns using the input coordinates.",
      "Composition of linear transformations corresponds to matrix multiplication."
    ]
  },

  "math-09-16": {
    id: "math-09-16",
    title: "Change of basis",
    tagline: "Changing basis is changing the coordinate language while keeping the vector itself unchanged.",
    connections: {
      buildsOn: ["basis vectors", "coordinates", "Matrix of a linear transformation"],
      leadsTo: ["similar matrices", "eigenvectors", "diagonalization"],
      usedWith: ["invertible matrices", "coordinate systems", "linear transformations", "orthonormal bases"]
    },
    motivation:
      "<p>The vector itself is not its coordinate list. The same arrow in the plane can be described as $\\begin{bmatrix}3 \\\\ 1\\end{bmatrix}$ in the standard basis, or by different coordinates in a tilted basis.</p>" +
      "<p>Change of basis is the careful bookkeeping that translates between coordinate languages. This matters because a transformation may look complicated in one basis and simple in another, especially when the basis vectors line up with the transformation's natural directions.</p>",
    definition:
      "<p>Let $B=(b_1,\\ldots,b_n)$ be an ordered basis of $\\mathbb R^n$. The coordinate vector $[v]_B=\\begin{bmatrix}c_1 \\\\ \\cdots \\\\ c_n\\end{bmatrix}$ means $v=c_1b_1+\\cdots+c_nb_n$. If $P_B=\\begin{bmatrix}b_1 & \\cdots & b_n\\end{bmatrix}$ has the basis vectors as columns, then $v=P_B[v]_B$.</p>" +
      "<p>To move from standard coordinates to $B$-coordinates, solve $P_B[v]_B=v$, so $[v]_B=P_B^{-1}v$. For a transformation with standard matrix $A$, its matrix in the $B$ basis is $[T]_B=P_B^{-1}AP_B$, because $P_B$ converts $B$-coordinates to standard coordinates, $A$ applies the transformation, and $P_B^{-1}$ converts back.</p>" +
      "<p><b>Assumptions that matter:</b> the basis vectors must be linearly independent so $P_B$ is invertible; the order of basis vectors matters; and a change of basis changes coordinate descriptions, not the geometric vector or transformation itself.</p>",
    worked: {
      problem: "Let $B=(b_1,b_2)$ with $b_1=\\begin{bmatrix}1 \\\\ 1\\end{bmatrix}$ and $b_2=\\begin{bmatrix}1 \\\\ -1\\end{bmatrix}$. Find $[v]_B$ for $v=\\begin{bmatrix}4 \\\\ 2\\end{bmatrix}$.",
      skills: ["basis coordinates", "linear combinations", "solving small systems"],
      strategy: "The vector is known in standard coordinates — write it as $c_1b_1+c_2b_2$ and solve for the new coordinates.",
      steps: [
        { do: "Write the coordinate equation", result: "$c_1\\begin{bmatrix}1 \\\\ 1\\end{bmatrix}+c_2\\begin{bmatrix}1 \\\\ -1\\end{bmatrix}=\\begin{bmatrix}4 \\\\ 2\\end{bmatrix}$", why: "$B$-coordinates are coefficients of the basis vectors" },
        { do: "Convert to scalar equations", result: "$c_1+c_2=4$ and $c_1-c_2=2$", why: "match the first and second coordinates" },
        { do: "Add the equations", result: "$2c_1=6$", why: "the $c_2$ terms cancel" },
        { do: "Solve for $c_1$", result: "$c_1=3$", why: "divide by 2" },
        { do: "Substitute into the first equation", result: "$3+c_2=4$", why: "use $c_1=3$" },
        { do: "Solve for $c_2$", result: "$c_2=1$", why: "subtract 3" },
        { do: "Write the basis-coordinate vector", result: "$[v]_B=\\begin{bmatrix}3 \\\\ 1\\end{bmatrix}$", why: "coordinates list the coefficients in basis order" }
      ],
      verify: "$3\\begin{bmatrix}1 \\\\ 1\\end{bmatrix}+1\\begin{bmatrix}1 \\\\ -1\\end{bmatrix}=\\begin{bmatrix}4 \\\\ 2\\end{bmatrix}$, so the new coordinates describe the same vector.",
      answer: "$[v]_B=\\begin{bmatrix}3 \\\\ 1\\end{bmatrix}$.",
      connects: "The coordinates changed, but the vector they reconstruct did not."
    },
    practice: [
      { problem: "For $B=(\\begin{bmatrix}2 \\\\ 0\\end{bmatrix},\\begin{bmatrix}0 \\\\ 3\\end{bmatrix})$, find $[\\begin{bmatrix}8 \\\\ 9\\end{bmatrix}]_B$.", steps: [
        { do: "Write the coordinate equation", result: "$c_1\\begin{bmatrix}2 \\\\ 0\\end{bmatrix}+c_2\\begin{bmatrix}0 \\\\ 3\\end{bmatrix}=\\begin{bmatrix}8 \\\\ 9\\end{bmatrix}$", why: "express the vector as a basis combination" },
        { do: "Match the first coordinate", result: "$2c_1=8$", why: "only $b_1$ contributes to the first coordinate" },
        { do: "Solve for $c_1$", result: "$c_1=4$", why: "divide by 2" },
        { do: "Match the second coordinate", result: "$3c_2=9$", why: "only $b_2$ contributes to the second coordinate" },
        { do: "Solve for $c_2$", result: "$c_2=3$", why: "divide by 3" }
      ], answer: "$[\\begin{bmatrix}8 \\\\ 9\\end{bmatrix}]_B=\\begin{bmatrix}4 \\\\ 3\\end{bmatrix}$." },
      { problem: "Let $B=(\\begin{bmatrix}1 \\\\ 2\\end{bmatrix},\\begin{bmatrix}3 \\\\ 1\\end{bmatrix})$. Convert $[v]_B=\\begin{bmatrix}2 \\\\ -1\\end{bmatrix}$ to standard coordinates.", steps: [
        { do: "Write the reconstruction", result: "$v=2\\begin{bmatrix}1 \\\\ 2\\end{bmatrix}-1\\begin{bmatrix}3 \\\\ 1\\end{bmatrix}$", why: "basis coordinates are coefficients" },
        { do: "Scale the first basis vector", result: "$\\begin{bmatrix}2 \\\\ 4\\end{bmatrix}$", why: "multiply by 2" },
        { do: "Scale the second basis vector", result: "$\\begin{bmatrix}-3 \\\\ -1\\end{bmatrix}$", why: "multiply by $-1$" },
        { do: "Add the scaled vectors", result: "$\\begin{bmatrix}-1 \\\\ 3\\end{bmatrix}$", why: "combine coordinates" },
        { do: "State the standard vector", result: "$v=\\begin{bmatrix}-1 \\\\ 3\\end{bmatrix}$", why: "the arrow is now in standard coordinates" }
      ], answer: "$v=\\begin{bmatrix}-1 \\\\ 3\\end{bmatrix}$ in standard coordinates." },
      { problem: "For $P_B=\\begin{bmatrix}1 & 1 \\\\ 1 & -1\\end{bmatrix}$, verify that $P_B^{-1}=\\begin{bmatrix}1/2 & 1/2 \\\\ 1/2 & -1/2\\end{bmatrix}$ by multiplying $P_B^{-1}\\begin{bmatrix}4 \\\\ 2\\end{bmatrix}$.", steps: [
        { do: "Set up the coordinate conversion", result: "$[v]_B=P_B^{-1}v$", why: "inverse basis matrix converts standard coordinates to basis coordinates" },
        { do: "Multiply by the vector", result: "$\\begin{bmatrix}1/2 & 1/2 \\\\ 1/2 & -1/2\\end{bmatrix}\\begin{bmatrix}4 \\\\ 2\\end{bmatrix}$", why: "use the provided inverse" },
        { do: "Compute the first coordinate", result: "$2+1=3$", why: "row 1 dot the vector" },
        { do: "Compute the second coordinate", result: "$2-1=1$", why: "row 2 dot the vector" },
        { do: "Write the converted coordinates", result: "$\\begin{bmatrix}3 \\\\ 1\\end{bmatrix}$", why: "the result matches the basis coefficients" }
      ], answer: "$P_B^{-1}\\begin{bmatrix}4 \\\\ 2\\end{bmatrix}=\\begin{bmatrix}3 \\\\ 1\\end{bmatrix}$." },
      { problem: "Let $A=\\begin{bmatrix}2 & 0 \\\\ 0 & 3\\end{bmatrix}$ and $B$ be the standard basis. What is $[T]_B$, and why?", steps: [
        { do: "Write the basis matrix", result: "$P_B=I=\\begin{bmatrix}1 & 0 \\\\ 0 & 1\\end{bmatrix}$", why: "the standard basis columns form the identity" },
        { do: "Write the change-of-basis formula", result: "$[T]_B=P_B^{-1}AP_B$", why: "convert into, apply, and convert back" },
        { do: "Use the inverse of the identity", result: "$P_B^{-1}=I$", why: "the identity matrix is its own inverse" },
        { do: "Simplify the product", result: "$IAI=A$", why: "multiplying by identity changes nothing" },
        { do: "State the matrix in the standard basis", result: "$[T]_B=\\begin{bmatrix}2 & 0 \\\\ 0 & 3\\end{bmatrix}$", why: "standard coordinates already use the standard basis" }
      ], answer: "$[T]_B=A=\\begin{bmatrix}2 & 0 \\\\ 0 & 3\\end{bmatrix}$." },
      { problem: "A two-feature vector is represented in principal-component coordinates by $[v]_B=\\begin{bmatrix}5 \\\\ 1\\end{bmatrix}$, where $b_1=\\begin{bmatrix}0.8 \\\\ 0.6\\end{bmatrix}$ and $b_2=\\begin{bmatrix}-0.6 \\\\ 0.8\\end{bmatrix}$. Convert to standard coordinates.", steps: [
        { do: "Write the reconstruction", result: "$v=5b_1+1b_2$", why: "basis coordinates are component weights" },
        { do: "Scale $b_1$", result: "$5\\begin{bmatrix}0.8 \\\\ 0.6\\end{bmatrix}=\\begin{bmatrix}4 \\\\ 3\\end{bmatrix}$", why: "multiply each coordinate by 5" },
        { do: "Scale $b_2$", result: "$1\\begin{bmatrix}-0.6 \\\\ 0.8\\end{bmatrix}=\\begin{bmatrix}-0.6 \\\\ 0.8\\end{bmatrix}$", why: "the second coefficient is 1" },
        { do: "Add the components", result: "$\\begin{bmatrix}3.4 \\\\ 3.8\\end{bmatrix}$", why: "$4-0.6=3.4$ and $3+0.8=3.8$" },
        { do: "Interpret the result", result: "standard feature coordinates", why: "the vector has been translated out of the principal-component language" }
      ], answer: "$v=\\begin{bmatrix}3.4 \\\\ 3.8\\end{bmatrix}$ in standard coordinates." }
    ],
    applications: [
      { title: "Principal component coordinates", background: "PCA rotates data into directions of largest variance. The data point is the same, but its coordinate language changes.", numbers: "If PC coordinates are $\\begin{bmatrix}5 \\\\ 1\\end{bmatrix}$ with basis vectors $\\begin{bmatrix}0.8 \\\\ 0.6\\end{bmatrix}$ and $\\begin{bmatrix}-0.6 \\\\ 0.8\\end{bmatrix}$, the standard vector is $\\begin{bmatrix}3.4 \\\\ 3.8\\end{bmatrix}$." },
      { title: "Camera coordinate frames", background: "Robotics and vision constantly translate between world coordinates and camera coordinates. The object does not move when the basis changes.", numbers: "If camera basis vectors are $b_1=(0,1)$ and $b_2=(-1,0)$, camera coordinates $(2,3)$ reconstruct world vector $2(0,1)+3(-1,0)=(-3,2)$." },
      { title: "Fourier bases", background: "Signals are often easier to describe by sinusoidal basis functions than by raw time samples.", numbers: "A signal with coefficients $3$ on a low-frequency basis and $0.5$ on a high-frequency basis is represented as $3\\phi_1+0.5\\phi_2$." },
      { title: "Word embedding subspaces", background: "Researchers sometimes examine embeddings in a smaller basis of interpretable directions, such as sentiment and formality axes.", numbers: "If an embedding has coordinates $\\begin{bmatrix}1.2 \\\\ -0.4\\end{bmatrix}$ in those axes, the negative second coordinate means $0.4$ units opposite the formality basis direction." },
      { title: "Diagonalizing dynamics", background: "A linear recurrence can be hard in standard coordinates but simple in an eigenbasis, where directions evolve independently.", numbers: "If eigenbasis coordinates are $\\begin{bmatrix}2 \\\\ 1\\end{bmatrix}$ and eigenvalues are $3$ and $0.5$, one step gives $\\begin{bmatrix}6 \\\\ 0.5\\end{bmatrix}$ in that basis." },
      { title: "Whitening features", background: "Some preprocessing changes to a basis where features are uncorrelated and similarly scaled, which can help optimization.", numbers: "If a centered feature vector has new coordinates $\\begin{bmatrix}2 \\\\ -1\\end{bmatrix}$ after whitening, its squared length in the whitened space is $2^2+(-1)^2=5$." }
    ],
    applicationsClose: "Change of basis reminds you to separate the object from its description: vectors stay put while coordinate languages shift around them.",
    takeaways: [
      "$[v]_B$ lists the coefficients that rebuild $v$ from the ordered basis $B$.",
      "The basis matrix $P_B$ converts $B$-coordinates to standard coordinates by $v=P_B[v]_B$.",
      "$P_B^{-1}$ converts standard coordinates back to $B$-coordinates when $B$ is a true basis.",
      "The same transformation has matrix $P_B^{-1}AP_B$ in the $B$ basis."
    ]
  },

  "math-09-17": {
    id: "math-09-17",
    title: "Determinants",
    tagline: "A determinant measures signed area or volume scaling, with orientation included.",
    connections: {
      buildsOn: ["Matrix of a linear transformation", "area", "linear transformations"],
      leadsTo: ["invertibility", "eigenvalues", "Jacobian determinants"],
      usedWith: ["row operations", "cross products", "change of variables", "orientation"]
    },
    motivation:
      "<p>A matrix does more than move points. It stretches regions. A square might become a parallelogram, a cube might become a slanted box, and sometimes an entire region collapses flat.</p>" +
      "<p>The <b>determinant</b> is the number that records this scaling. Its absolute value tells how area or volume changes, and its sign tells whether orientation is preserved or flipped.</p>",
    definition:
      "<p>For a $2\\times2$ matrix $A=\\begin{bmatrix}a & b \\\\ c & d\\end{bmatrix}$, the determinant is $\\det(A)=ad-bc$, also written $\\begin{vmatrix}a & b \\\\ c & d\\end{vmatrix}=ad-bc$. For a square $n\\times n$ matrix, $|\\det(A)|$ is the factor by which $A$ scales $n$-dimensional volume.</p>" +
      "<p>In two dimensions, the columns $\\begin{bmatrix}a \\\\ c\\end{bmatrix}$ and $\\begin{bmatrix}b \\\\ d\\end{bmatrix}$ form a parallelogram. The signed area is $ad-bc$: the $ad$ part measures one diagonal product and $bc$ subtracts the opposite slant. If the columns line up, the parallelogram has area zero, and the determinant is zero.</p>" +
      "<p><b>Assumptions that matter:</b> determinants are defined only for square matrices; a zero determinant means the transformation is not invertible; swapping two rows flips the sign; and multiplying one row by $c$ multiplies the determinant by $c$.</p>",
    worked: {
      problem: "Compute the determinant of $A=\\begin{bmatrix}2 & -1 \\\\ 1 & 3\\end{bmatrix}$ and interpret the result as area scaling.",
      skills: ["2 by 2 determinants", "signed area", "invertibility"],
      strategy: "Use $ad-bc$, then read the magnitude and sign geometrically.",
      steps: [
        { do: "Identify $a,b,c,d$", result: "$a=2$, $b=-1$, $c=1$, $d=3$", why: "match $\\begin{bmatrix}a & b \\\\ c & d\\end{bmatrix}$" },
        { do: "Write the determinant formula", result: "$\\det(A)=ad-bc$", why: "this is the $2\\times2$ rule" },
        { do: "Substitute the entries", result: "$\\det(A)=2\\cdot3-(-1)(1)$", why: "replace each letter by its matrix entry" },
        { do: "Multiply the products", result: "$6-(-1)$", why: "$2\\cdot3=6$ and $(-1)(1)=-1$" },
        { do: "Subtract", result: "$7$", why: "subtracting $-1$ adds 1" },
        { do: "Interpret magnitude", result: "area scale factor $7$", why: "absolute determinant gives area scaling" },
        { do: "Interpret sign", result: "orientation preserved", why: "the determinant is positive" }
      ],
      verify: "A nonzero determinant means the columns are not collapsed onto one line, so the transformation is invertible in the plane.",
      answer: "$\\det(A)=7$; the transformation multiplies areas by $7$ and preserves orientation.",
      connects: "The determinant turns a matrix into a single geometric scale-and-orientation number."
    },
    practice: [
      { problem: "Compute $\\det\\left(\\begin{bmatrix}4 & 2 \\\\ 1 & 5\\end{bmatrix}\\right)$.", steps: [
        { do: "Identify the entries", result: "$a=4$, $b=2$, $c=1$, $d=5$", why: "match the $2\\times2$ pattern" },
        { do: "Apply the formula", result: "$ad-bc=4\\cdot5-2\\cdot1$", why: "determinant of $\\begin{bmatrix}a & b \\\\ c & d\\end{bmatrix}$ is $ad-bc$" },
        { do: "Compute the first product", result: "$20$", why: "$4\\cdot5=20$" },
        { do: "Compute the second product", result: "$2$", why: "$2\\cdot1=2$" },
        { do: "Subtract", result: "$18$", why: "$20-2=18$" }
      ], answer: "The determinant is $18$." },
      { problem: "Decide whether $A=\\begin{bmatrix}1 & 2 \\\\ 2 & 4\\end{bmatrix}$ is invertible.", steps: [
        { do: "Write the determinant", result: "$\\det(A)=1\\cdot4-2\\cdot2$", why: "use $ad-bc$" },
        { do: "Compute the products", result: "$4-4$", why: "both diagonal products equal 4" },
        { do: "Subtract", result: "$0$", why: "the signed area collapses" },
        { do: "Connect determinant to invertibility", result: "not invertible", why: "a square matrix is invertible only when its determinant is nonzero" },
        { do: "Read the columns", result: "$\\begin{bmatrix}2 \\\\ 4\\end{bmatrix}=2\\begin{bmatrix}1 \\\\ 2\\end{bmatrix}$", why: "dependent columns collapse area to a line" }
      ], answer: "It is not invertible because $\\det(A)=0$." },
      { problem: "Find the area of the parallelogram spanned by $u=\\begin{bmatrix}3 \\\\ 1\\end{bmatrix}$ and $v=\\begin{bmatrix}2 \\\\ 5\\end{bmatrix}$.", steps: [
        { do: "Place the vectors as columns", result: "$A=\\begin{bmatrix}3 & 2 \\\\ 1 & 5\\end{bmatrix}$", why: "column vectors span the parallelogram" },
        { do: "Compute the determinant", result: "$\\det(A)=3\\cdot5-2\\cdot1$", why: "signed area comes from the determinant" },
        { do: "Multiply", result: "$15-2$", why: "compute the diagonal products" },
        { do: "Subtract", result: "$13$", why: "signed area is positive" },
        { do: "Take absolute value", result: "$13$", why: "ordinary area is nonnegative" }
      ], answer: "The parallelogram area is $13$." },
      { problem: "A matrix has determinant $-3$. What happens to a region of area $8$ under this transformation?", steps: [
        { do: "Take the absolute determinant", result: "$|-3|=3$", why: "area scaling uses magnitude" },
        { do: "Multiply the original area", result: "$3\\cdot8=24$", why: "the transformation scales all areas by 3" },
        { do: "Read the sign", result: "orientation flips", why: "negative determinant reverses orientation" },
        { do: "State the new area", result: "$24$", why: "area is not signed" },
        { do: "State the geometric meaning", result: "larger by factor 3 and flipped", why: "magnitude and sign carry different information" }
      ], answer: "The area becomes $24$, and orientation is reversed." },
      { problem: "For the feature transform $W=\\begin{bmatrix}0.5 & 0 \\\\ 0 & 2\\end{bmatrix}$, compute $\\det(W)$ and interpret the area change.", steps: [
        { do: "Identify the entries", result: "$a=0.5$, $b=0$, $c=0$, $d=2$", why: "match the $2\\times2$ matrix form" },
        { do: "Apply the determinant formula", result: "$0.5\\cdot2-0\\cdot0$", why: "use $ad-bc$" },
        { do: "Multiply", result: "$1-0$", why: "half in one direction and double in the other" },
        { do: "Subtract", result: "$1$", why: "the products differ by 1" },
        { do: "Interpret", result: "area preserved", why: "determinant magnitude 1 means no area scaling" }
      ], answer: "$\\det(W)=1$, so areas are preserved even though individual axes are rescaled." }
    ],
    applications: [
      { title: "Invertibility checks", background: "Linear systems have unique solutions exactly when the coefficient matrix does not collapse space. The determinant is a quick square-matrix test.", numbers: "$\\det\\left(\\begin{bmatrix}2 & 1 \\\\ 5 & 3\\end{bmatrix}\\right)=6-5=1$, so the system has a unique solution." },
      { title: "Area scaling in graphics", background: "A 2-D transform can resize every drawn shape. The determinant tells how much area changes.", numbers: "Scaling $x$ by $3$ and $y$ by $2$ has matrix $\\begin{bmatrix}3 & 0 \\\\ 0 & 2\\end{bmatrix}$ and determinant $6$, so a $10$ pixel area becomes $60$." },
      { title: "Change of variables", background: "Calculus uses Jacobian determinants to adjust area or volume when changing coordinates.", numbers: "The polar-coordinate area factor is $r$; at radius $r=4$, a tiny rectangle in $(r,\\theta)$ space scales by factor $4$." },
      { title: "Detecting degenerate features", background: "If two feature directions are dependent, a determinant can reveal that a two-dimensional feature space has collapsed.", numbers: "Columns $(1,2)$ and $(3,6)$ give determinant $1\\cdot6-3\\cdot2=0$, so they carry only one direction of information." },
      { title: "Probability density transforms", background: "Normalizing flows in ML transform random variables and adjust density using determinant magnitudes.", numbers: "If a 2-D flow has determinant magnitude $0.25$, density multiplies by $1/0.25=4$ at that local transform." },
      { title: "Orientation in meshes", background: "Computer graphics and geometry use determinant signs to detect whether triangles have been flipped.", numbers: "A transform with determinant $-2$ doubles triangle area and reverses vertex orientation." }
    ],
    applicationsClose: "Determinants compress a square linear transformation into one geometric fact: how much volume changes and whether orientation survives.",
    takeaways: [
      "For $\\begin{bmatrix}a & b \\\\ c & d\\end{bmatrix}$, the determinant is $ad-bc$.",
      "The absolute determinant is the area or volume scale factor.",
      "A zero determinant means collapse and non-invertibility.",
      "A negative determinant means orientation is reversed."
    ]
  },

  "math-09-18": {
    id: "math-09-18",
    title: "The eigenvalue equation",
    tagline: "Eigenvectors are the special directions a matrix stretches without turning.",
    connections: {
      buildsOn: ["Matrix of a linear transformation", "Determinants", "Change of basis"],
      leadsTo: ["diagonalization", "principal components", "linear dynamical systems"],
      usedWith: ["null spaces", "characteristic polynomials", "basis changes", "orthogonal directions"]
    },
    motivation:
      "<p>Most vectors change direction when a matrix acts on them. But some directions are special: the transformation only stretches, shrinks, or reverses them. Those directions reveal the matrix's natural axes.</p>" +
      "<p>The eigenvalue equation is the language for finding those axes. It is central in ML because covariance matrices, graph matrices, linear recurrences, and attention-style transformations all have directions that explain dominant behavior.</p>",
    definition:
      "<p>For a square matrix $A$, a nonzero vector $v$ is an <b>eigenvector</b> with <b>eigenvalue</b> $\\lambda$ if $Av=\\lambda v$. The matrix may change the length and sign of $v$, but it does not push $v$ out of its own span.</p>" +
      "<p>To find eigenvalues, rewrite $Av=\\lambda v$ as $(A-\\lambda I)v=0$. A nonzero solution exists only when $A-\\lambda I$ is singular, so $\\det(A-\\lambda I)=0$. This determinant equation is the characteristic equation.</p>" +
      "<p><b>Assumptions that matter:</b> $A$ must be square; the eigenvector $v$ cannot be the zero vector; eigenvalues may be real or complex; and repeated eigenvalues do not automatically provide enough independent eigenvectors for diagonalization.</p>",
    worked: {
      problem: "Find the eigenvalues and one eigenvector for each eigenvalue of $A=\\begin{bmatrix}2 & 0 \\\\ 0 & 3\\end{bmatrix}$.",
      skills: ["eigenvalue equation", "determinants", "null spaces"],
      strategy: "Diagonal matrices reveal the idea cleanly — solve $\\det(A-\\lambda I)=0$, then solve $(A-\\lambda I)v=0$.",
      steps: [
        { do: "Form $A-\\lambda I$", result: "$\\begin{bmatrix}2-\\lambda & 0 \\\\ 0 & 3-\\lambda\\end{bmatrix}$", why: "subtract $\\lambda$ from each diagonal entry" },
        { do: "Compute the determinant", result: "$(2-\\lambda)(3-\\lambda)$", why: "determinant of a diagonal matrix is the product of diagonal entries" },
        { do: "Set the determinant equal to zero", result: "$(2-\\lambda)(3-\\lambda)=0$", why: "nonzero eigenvectors require singularity" },
        { do: "Solve for eigenvalues", result: "$\\lambda=2$ or $\\lambda=3$", why: "one factor must be zero" },
        { do: "Solve for $\\lambda=2$", result: "$(A-2I)v=\\begin{bmatrix}0 & 0 \\\\ 0 & 1\\end{bmatrix}\\begin{bmatrix}x \\\\ y\\end{bmatrix}=\\begin{bmatrix}0 \\\\ 0\\end{bmatrix}$", why: "plug in the first eigenvalue" },
        { do: "Read the first eigenspace", result: "$y=0$, so choose $v_1=\\begin{bmatrix}1 \\\\ 0\\end{bmatrix}$", why: "any nonzero vector on the $x$-axis works" },
        { do: "Solve for $\\lambda=3$", result: "$(A-3I)v=\\begin{bmatrix}-1 & 0 \\\\ 0 & 0\\end{bmatrix}\\begin{bmatrix}x \\\\ y\\end{bmatrix}=\\begin{bmatrix}0 \\\\ 0\\end{bmatrix}$", why: "plug in the second eigenvalue" },
        { do: "Read the second eigenspace", result: "$x=0$, so choose $v_2=\\begin{bmatrix}0 \\\\ 1\\end{bmatrix}$", why: "any nonzero vector on the $y$-axis works" }
      ],
      verify: "$A\\begin{bmatrix}1 \\\\ 0\\end{bmatrix}=\\begin{bmatrix}2 \\\\ 0\\end{bmatrix}=2\\begin{bmatrix}1 \\\\ 0\\end{bmatrix}$ and $A\\begin{bmatrix}0 \\\\ 1\\end{bmatrix}=\\begin{bmatrix}0 \\\\ 3\\end{bmatrix}=3\\begin{bmatrix}0 \\\\ 1\\end{bmatrix}$.",
      answer: "Eigenvalue $2$ has eigenvector $\\begin{bmatrix}1 \\\\ 0\\end{bmatrix}$; eigenvalue $3$ has eigenvector $\\begin{bmatrix}0 \\\\ 1\\end{bmatrix}$.",
      connects: "Eigenvectors expose directions where a matrix acts like simple scalar multiplication."
    },
    practice: [
      { problem: "Verify that $v=\\begin{bmatrix}1 \\\\ 1\\end{bmatrix}$ is an eigenvector of $A=\\begin{bmatrix}2 & 1 \\\\ 1 & 2\\end{bmatrix}$ and find its eigenvalue.", steps: [
        { do: "Multiply $A$ by $v$", result: "$\\begin{bmatrix}2 & 1 \\\\ 1 & 2\\end{bmatrix}\\begin{bmatrix}1 \\\\ 1\\end{bmatrix}$", why: "apply the matrix to the candidate vector" },
        { do: "Compute the first coordinate", result: "$2\\cdot1+1\\cdot1=3$", why: "row 1 dot vector" },
        { do: "Compute the second coordinate", result: "$1\\cdot1+2\\cdot1=3$", why: "row 2 dot vector" },
        { do: "Write the image", result: "$Av=\\begin{bmatrix}3 \\\\ 3\\end{bmatrix}$", why: "combine the coordinates" },
        { do: "Factor the original vector", result: "$\\begin{bmatrix}3 \\\\ 3\\end{bmatrix}=3\\begin{bmatrix}1 \\\\ 1\\end{bmatrix}$", why: "the direction did not change" }
      ], answer: "$v$ is an eigenvector with eigenvalue $3$." },
      { problem: "Find the eigenvalues of $A=\\begin{bmatrix}4 & 0 \\\\ 0 & -1\\end{bmatrix}$.", steps: [
        { do: "Form $A-\\lambda I$", result: "$\\begin{bmatrix}4-\\lambda & 0 \\\\ 0 & -1-\\lambda\\end{bmatrix}$", why: "subtract $\\lambda$ from diagonal entries" },
        { do: "Compute the determinant", result: "$(4-\\lambda)(-1-\\lambda)$", why: "diagonal determinant is product of diagonal entries" },
        { do: "Set equal to zero", result: "$(4-\\lambda)(-1-\\lambda)=0$", why: "eigenvalues make $A-\\lambda I$ singular" },
        { do: "Solve the first factor", result: "$\\lambda=4$", why: "$4-\\lambda=0$" },
        { do: "Solve the second factor", result: "$\\lambda=-1$", why: "$-1-\\lambda=0$" }
      ], answer: "The eigenvalues are $4$ and $-1$." },
      { problem: "Find eigenvalues of $A=\\begin{bmatrix}1 & 2 \\\\ 2 & 1\\end{bmatrix}$.", steps: [
        { do: "Form $A-\\lambda I$", result: "$\\begin{bmatrix}1-\\lambda & 2 \\\\ 2 & 1-\\lambda\\end{bmatrix}$", why: "subtract $\\lambda$ from the diagonal" },
        { do: "Compute the determinant", result: "$(1-\\lambda)^2-4$", why: "use $ad-bc$" },
        { do: "Set the characteristic equation", result: "$(1-\\lambda)^2-4=0$", why: "eigenvalues make the determinant zero" },
        { do: "Factor as a difference of squares", result: "$(1-\\lambda-2)(1-\\lambda+2)=0$", why: "$a^2-2^2=(a-2)(a+2)$" },
        { do: "Simplify the factors", result: "$(-1-\\lambda)(3-\\lambda)=0$", why: "combine constants" },
        { do: "Solve", result: "$\\lambda=-1$ or $\\lambda=3$", why: "set each factor to zero" }
      ], answer: "The eigenvalues are $3$ and $-1$." },
      { problem: "For $A=\\begin{bmatrix}1 & 2 \\\\ 2 & 1\\end{bmatrix}$, find an eigenvector for $\\lambda=3$.", steps: [
        { do: "Form $A-3I$", result: "$\\begin{bmatrix}-2 & 2 \\\\ 2 & -2\\end{bmatrix}$", why: "subtract 3 from diagonal entries" },
        { do: "Set up the null-space equation", result: "$\\begin{bmatrix}-2 & 2 \\\\ 2 & -2\\end{bmatrix}\\begin{bmatrix}x \\\\ y\\end{bmatrix}=\\begin{bmatrix}0 \\\\ 0\\end{bmatrix}$", why: "eigenvectors solve $(A-\\lambda I)v=0$" },
        { do: "Read the first equation", result: "$-2x+2y=0$", why: "use row 1" },
        { do: "Solve the relation", result: "$y=x$", why: "move $-2x$ and divide by 2" },
        { do: "Choose a nonzero vector", result: "$v=\\begin{bmatrix}1 \\\\ 1\\end{bmatrix}$", why: "set $x=1$ so $y=1$" }
      ], answer: "One eigenvector for $\\lambda=3$ is $\\begin{bmatrix}1 \\\\ 1\\end{bmatrix}$." },
      { problem: "A covariance matrix is $C=\\begin{bmatrix}5 & 0 \\\\ 0 & 2\\end{bmatrix}$. Find the dominant eigenvalue and its direction.", steps: [
        { do: "Use the diagonal entries", result: "eigenvalues $5$ and $2$", why: "diagonal matrices have diagonal entries as eigenvalues" },
        { do: "Compare the eigenvalues", result: "$5>2$", why: "dominant means largest" },
        { do: "Find the direction for $\\lambda=5$", result: "$e_1=\\begin{bmatrix}1 \\\\ 0\\end{bmatrix}$", why: "the first coordinate axis is scaled by 5" },
        { do: "Check the multiplication", result: "$C\\begin{bmatrix}1 \\\\ 0\\end{bmatrix}=\\begin{bmatrix}5 \\\\ 0\\end{bmatrix}$", why: "multiply by the first basis vector" },
        { do: "Write as scalar multiple", result: "$\\begin{bmatrix}5 \\\\ 0\\end{bmatrix}=5\\begin{bmatrix}1 \\\\ 0\\end{bmatrix}$", why: "this confirms the eigenvalue and eigenvector" }
      ], answer: "The dominant eigenvalue is $5$, with direction $\\begin{bmatrix}1 \\\\ 0\\end{bmatrix}$." }
    ],
    applications: [
      { title: "Principal component analysis", background: "PCA finds directions of largest variance by solving an eigenvalue problem for the covariance matrix.", numbers: "For $C=\\begin{bmatrix}5 & 0 \\\\ 0 & 2\\end{bmatrix}$, eigenvalue $5$ is larger than $2$, so the first coordinate is the principal direction." },
      { title: "PageRank-style steady directions", background: "Ranking algorithms based on link graphs look for vectors that are unchanged up to scale by a transition matrix.", numbers: "If $Pp=p$, then $p$ is an eigenvector with eigenvalue $1$; for $p=\\begin{bmatrix}0.6 \\\\ 0.4\\end{bmatrix}$, the probabilities still sum to $1$." },
      { title: "Linear dynamical systems", background: "Repeatedly applying a matrix amplifies eigen-directions according to their eigenvalues.", numbers: "If $Av=1.2v$, then after $5$ steps $A^5v=1.2^5v\\approx2.49v$." },
      { title: "Stability of updates", background: "Optimization and control use eigenvalues to decide whether repeated linearized updates grow or decay.", numbers: "An eigenvalue $0.8$ shrinks after $10$ steps to $0.8^{10}\\approx0.107$ of its original size." },
      { title: "Spectral graph features", background: "Graph ML often studies eigenvectors of adjacency or Laplacian matrices to reveal communities and smooth signals.", numbers: "For a two-node connected graph adjacency $\\begin{bmatrix}0 & 1 \\\\ 1 & 0\\end{bmatrix}$, $\\begin{bmatrix}1 \\\\ 1\\end{bmatrix}$ has eigenvalue $1$ and represents both nodes moving together." },
      { title: "Attention and low-rank structure", background: "Large models often contain matrices with dominant directions. Eigen-analysis helps describe which directions are amplified.", numbers: "If a symmetric weight matrix has top eigenvalue $6$ and next eigenvalue $1.5$, the top direction is amplified $4$ times as strongly in one multiplication." }
    ],
    applicationsClose: "Eigenvalues and eigenvectors reveal the directions a matrix treats as its own natural coordinate system.",
    takeaways: [
      "The eigenvalue equation is $Av=\\lambda v$ with $v\\ne0$.",
      "Eigenvectors keep their direction under $A$; eigenvalues tell the stretch, shrink, or reversal factor.",
      "Eigenvalues solve $\\det(A-\\lambda I)=0$.",
      "PCA, graph methods, dynamics, and stability all rely on eigen-directions."
    ]
  }
};
