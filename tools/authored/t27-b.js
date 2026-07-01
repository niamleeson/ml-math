module.exports = {
  "math-27-11": {
    id: "math-27-11",
    title: "Sparse matrices",
    tagline: "Sparse matrices save work by remembering only the entries that matter.",
    connections: {
      buildsOn: ["Matrices", "linear systems", "matrix-vector multiplication", "orders of growth"],
      leadsTo: ["iterative solvers", "randomized numerical linear algebra", "GPU and parallel computing"],
      usedWith: ["graphs", "eigenvalues", "preconditioning", "finite differences"]
    },
    motivation:
      "<p>You already know how to multiply a matrix by a vector. If the matrix is full, every entry asks for attention. But many scientific and ML matrices are mostly zeros: a web graph, a finite-difference grid, or a bag-of-words table only connects nearby or observed things.</p>" +
      "<p>A <b>sparse matrix</b> is the practical promise that zeros should not cost the same as information. We store only nonzeros, count work by the number of nonzeros, and suddenly matrices with millions of rows become usable on ordinary machines.</p>",
    definition:
      "<p>A matrix $A\\in\\mathbb{R}^{m\\times n}$ is called <b>sparse</b> when its number of nonzero entries, written $\\operatorname{nnz}(A)$, is much smaller than $mn$. Sparse matrix-vector multiplication computes $y=Ax$ using only nonzeros: for every stored entry $a_{ij}$, add $a_{ij}x_j$ to $y_i$.</p>" +
      "<p>The work is therefore $O(\\operatorname{nnz}(A))$, not $O(mn)$. Compressed sparse row storage keeps three arrays: nonzero values, their column indices, and row pointers. The row pointers say where each row starts and stops in the values array.</p>" +
      "<p><b>Assumptions that matter:</b> sparse methods help when zeros are true zeros and the access pattern is compatible with the storage format; inserting new nonzeros can be expensive in compressed formats; and algorithms may create fill-in, where operations on a sparse matrix produce a less sparse one.</p>",
    worked: {
      problem: "Store $A=\\begin{bmatrix}0&5&0&0\\\\2&0&0&3\\\\0&0&4&0\\end{bmatrix}$ in compressed sparse row form and compute $Ax$ for $x=[1,2,3,4]^T$.",
      skills: ["sparse storage", "matrix-vector multiplication", "operation counting"],
      strategy: "Ignore the zeros — record each row's nonzeros, then accumulate one product at a time.",
      steps: [
        { do: "List row 1 nonzeros", result: "value $5$ at column $2$", why: "only the second entry of row 1 is nonzero" },
        { do: "List row 2 nonzeros", result: "values $2,3$ at columns $1,4$", why: "row 2 has two stored entries" },
        { do: "List row 3 nonzeros", result: "value $4$ at column $3$", why: "only the third entry of row 3 is nonzero" },
        { do: "Write CSR values and columns", result: "values $[5,2,3,4]$, columns $[2,1,4,3]$", why: "store nonzeros row by row" },
        { do: "Write CSR row pointers", result: "rowptr $[0,1,3,4]$", why: "row 1 uses entries 0 to 1, row 2 uses 1 to 3, row 3 uses 3 to 4" },
        { do: "Compute the first output", result: "$y_1=5\\cdot2=10$", why: "row 1 uses only column 2" },
        { do: "Compute the second output", result: "$y_2=2\\cdot1+3\\cdot4=14$", why: "row 2 uses columns 1 and 4" },
        { do: "Compute the third output", result: "$y_3=4\\cdot3=12$", why: "row 3 uses only column 3" }
      ],
      verify: "A dense multiplication would touch $12$ entries, but the sparse computation used $4$ nonzero products and gives a length-3 vector.",
      answer: "CSR values $[5,2,3,4]$, columns $[2,1,4,3]$, rowptr $[0,1,3,4]$, and $Ax=[10,14,12]^T$.",
      connects: "Sparse storage changes the unit of work from entries in the rectangle to entries that actually exist."
    },
    practice: [
      { problem: "A $1000\\times1000$ matrix has $7000$ nonzeros. Compare dense and sparse storage if each number uses $8$ bytes and each stored column index uses $4$ bytes. Ignore row pointers first.", steps: [
        { do: "Count dense entries", result: "$1000\\cdot1000=1,000,000$", why: "dense storage keeps every position" },
        { do: "Compute dense bytes", result: "$1,000,000\\cdot8=8,000,000$ bytes", why: "each value uses 8 bytes" },
        { do: "Compute sparse bytes per nonzero", result: "$8+4=12$ bytes", why: "store a value and its column index" },
        { do: "Compute sparse bytes", result: "$7000\\cdot12=84,000$ bytes", why: "store only nonzeros" },
        { do: "Compute the storage ratio", result: "$8,000,000/84,000\\approx95.2$", why: "dense storage is about 95 times larger" }
      ], answer: "Dense storage uses $8,000,000$ bytes; sparse value-plus-column storage uses about $84,000$ bytes, about $95$ times smaller before row pointers." },
      { problem: "For rowptr $[0,2,2,5]$, columns $[0,3,0,1,3]$, and values $[4,-1,2,7,5]$, identify the nonzeros in each row.", steps: [
        { do: "Read row 1 range", result: "indices $0$ through $1$", why: "rowptr goes from 0 to 2" },
        { do: "List row 1 entries", result: "$(1,1)=4$ and $(1,4)=-1$", why: "columns 0 and 3 mean columns 1 and 4 in one-based notation" },
        { do: "Read row 2 range", result: "empty", why: "rowptr entries 2 and 2 are equal" },
        { do: "Read row 3 range", result: "indices $2$ through $4$", why: "rowptr goes from 2 to 5" },
        { do: "List row 3 entries", result: "$(3,1)=2$, $(3,2)=7$, $(3,4)=5$", why: "use the remaining column-value pairs" }
      ], answer: "Row 1 has $4$ in column 1 and $-1$ in column 4; row 2 has no nonzeros; row 3 has $2,7,5$ in columns 1, 2, and 4." },
      { problem: "A graph with $n=5$ nodes has undirected edges $(1,2)$, $(1,5)$, $(3,4)$, and $(4,5)$. How many nonzeros are in its symmetric adjacency matrix with no self-loops?", steps: [
        { do: "Count undirected edges", result: "$4$", why: "the list contains four edges" },
        { do: "Account for symmetry", result: "$2$ nonzeros per edge", why: "edge $(i,j)$ gives entries $A_{ij}$ and $A_{ji}$" },
        { do: "Multiply", result: "$4\\cdot2=8$", why: "each edge contributes two stored ones" },
        { do: "Check self-loops", result: "$0$ diagonal nonzeros", why: "the graph has no self-loops" },
        { do: "State density", result: "$8/25=0.32$", why: "a $5\\times5$ matrix has 25 positions" }
      ], answer: "The adjacency matrix has $8$ nonzeros and density $0.32$." },
      { problem: "A 2-D $4\\times4$ grid uses the five-point stencil: each interior point connects to itself and four neighbors. How many nonzeros are in one interior row and one corner row?", steps: [
        { do: "Count the self connection", result: "$1$", why: "the center coefficient is stored" },
        { do: "Count interior neighbors", result: "$4$", why: "up, down, left, and right all exist" },
        { do: "Add for an interior row", result: "$1+4=5$", why: "five-point stencil" },
        { do: "Count corner neighbors", result: "$2$", why: "a corner has only two grid neighbors" },
        { do: "Add for a corner row", result: "$1+2=3$", why: "self plus two neighbors" }
      ], answer: "An interior row has $5$ nonzeros; a corner row has $3$ nonzeros." },
      { problem: "A recommender matrix has $1,000,000$ users, $50,000$ items, and $80,000,000$ observed ratings. Compute its density and the products needed for one sparse matrix-vector multiply.", steps: [
        { do: "Count all possible entries", result: "$1,000,000\\cdot50,000=50,000,000,000$", why: "users times items" },
        { do: "Write the nonzero count", result: "$\\operatorname{nnz}=80,000,000$", why: "only observed ratings are stored" },
        { do: "Compute density", result: "$80,000,000/50,000,000,000=0.0016$", why: "nonzeros divided by all positions" },
        { do: "Convert density to percent", result: "$0.16\\%$", why: "multiply by 100" },
        { do: "Count sparse products", result: "$80,000,000$", why: "one multiply per stored rating" }
      ], answer: "The matrix is $0.16\\%$ dense, and one sparse matrix-vector multiply uses $80,000,000$ products instead of $50$ billion." }
    ],
    applications: [
      { title: "Web graphs and PageRank", background: "Search engines popularized sparse graph matrices because each page links to only a tiny fraction of the web. PageRank repeatedly multiplies by a sparse transition matrix.", numbers: "If $10^9$ pages average $20$ links, $\\operatorname{nnz}\\approx2\\cdot10^{10}$, far below $10^{18}$ possible entries." },
      { title: "Recommender systems", background: "User-item matrices are sparse because each user rates or clicks only a few items. Collaborative filtering depends on not storing missing interactions as real zeros.", numbers: "$5$ million users and $100,000$ items give $5\\cdot10^{11}$ possible entries; $200$ million clicks mean density $0.04\\%$." },
      { title: "Finite-difference PDEs", background: "Discretized physical equations connect each grid point only to nearby neighbors. This creates sparse matrices with predictable bands.", numbers: "A $100\\times100$ grid has $10,000$ unknowns; about $5$ nonzeros per row gives roughly $50,000$ nonzeros, not $100,000,000$." },
      { title: "Bag-of-words features", background: "Text classifiers use vocabularies with many words, but each document contains only a small subset. Sparse rows keep NLP features manageable.", numbers: "A document with $120$ distinct words in a $50,000$ word vocabulary has row density $120/50,000=0.24\\%$." },
      { title: "Graph neural networks", background: "GNN layers aggregate messages along edges, which is sparse matrix multiplication in graph clothing. The edge list is the computation plan.", numbers: "With $1,000,000$ nodes, $8,000,000$ directed edges, and $64$ features, aggregation costs about $8,000,000\\cdot64=512$ million multiply-adds." },
      { title: "Sparse regularization", background: "Lasso and pruning encourage parameters or activations to become zero, reducing storage and sometimes inference cost.", numbers: "A weight vector of length $1,000,000$ with $95\\%$ zeros stores $50,000$ values; at $8$ bytes each that is $0.4$ MB before indices." }
    ],
    applicationsClose: "Sparse thinking is a simple kindness to computation: do not pay for zeros when structure lets you skip them.",
    takeaways: [
      "Sparse matrices are governed by $\\operatorname{nnz}(A)$, the number of nonzero entries.",
      "Sparse matrix-vector multiplication costs $O(\\operatorname{nnz}(A))$ rather than $O(mn)$.",
      "CSR stores values, column indices, and row pointers for fast row-wise operations.",
      "Graphs, PDE grids, text data, and recommender systems are naturally sparse."
    ]
  },

  "math-27-12": {
    id: "math-27-12",
    title: "Numerical optimization in practice",
    tagline: "Optimization becomes practical when we choose steps that are small enough to trust and large enough to matter.",
    connections: {
      buildsOn: ["gradients", "Taylor approximation", "convexity", "linear algebra"],
      leadsTo: ["Automatic differentiation", "stochastic optimization", "mixed precision training"],
      usedWith: ["line search", "conditioning", "Newton's method", "eigenvalues"]
    },
    motivation:
      "<p>You already know the gradient points uphill. Training a model asks for the opposite: move downhill in parameter space until the loss is small. The hard part is not the slogan; it is choosing the step.</p>" +
      "<p><b>Numerical optimization</b> is the craft of making those downhill moves reliable. It balances local information, step size, curvature, noise, and stopping rules so an algorithm improves for real numbers on a real machine.</p>",
    definition:
      "<p>For a differentiable loss $f(\\theta)$, basic gradient descent updates $\\theta_{k+1}=\\theta_k-\\alpha_k\\nabla f(\\theta_k)$, where $\\alpha_k>0$ is the learning rate. Newton's method uses curvature: $\\theta_{k+1}=\\theta_k-H_k^{-1}\\nabla f(\\theta_k)$, where $H_k$ is the Hessian matrix.</p>" +
      "<p>The descent idea comes from the first-order approximation $f(\\theta+s)\\approx f(\\theta)+\\nabla f(\\theta)^Ts$. Choosing $s=-\\alpha\\nabla f(\\theta)$ gives predicted change $-\\alpha\\|\\nabla f(\\theta)\\|^2$, which is negative when the gradient is nonzero.</p>" +
      "<p><b>Assumptions that matter:</b> a step that is too large can increase the loss; ill-conditioned curvature makes some directions much slower than others; stochastic gradients add noise; and nonconvex losses can have saddles and local minima rather than one guaranteed global answer.</p>",
    worked: {
      problem: "Minimize $f(w)=(w-3)^2+1$ from $w_0=0$ using gradient descent with learning rate $\\alpha=0.25$ for three steps.",
      skills: ["gradients", "learning rates", "iteration"],
      strategy: "The loss is a bowl — compute the gradient, step opposite it, and watch the distance to $3$ shrink.",
      steps: [
        { do: "Differentiate the loss", result: "$f'(w)=2(w-3)$", why: "use the chain rule on the square" },
        { do: "Evaluate the first gradient", result: "$f'(0)=-6$", why: "substitute $w_0=0$" },
        { do: "Take the first step", result: "$w_1=0-0.25(-6)=1.5$", why: "move opposite the negative gradient" },
        { do: "Evaluate the second gradient", result: "$f'(1.5)=-3$", why: "the point is closer to 3" },
        { do: "Take the second step", result: "$w_2=1.5-0.25(-3)=2.25$", why: "apply the same update" },
        { do: "Evaluate the third gradient", result: "$f'(2.25)=-1.5$", why: "the slope keeps shrinking" },
        { do: "Take the third step", result: "$w_3=2.25-0.25(-1.5)=2.625$", why: "one more descent step" },
        { do: "Compute the final loss", result: "$f(2.625)=0.375^2+1=1.140625$", why: "measure progress after three steps" }
      ],
      verify: "The optimum is $w=3$ with loss $1$; the iterates $0,1.5,2.25,2.625$ move steadily toward it.",
      answer: "After three steps, $w_3=2.625$ and $f(w_3)=1.140625$.",
      connects: "The practical optimization story is step, measure, and adjust without losing the downhill direction."
    },
    practice: [
      { problem: "For $f(w)=w^2$, start at $w_0=4$ and use $\\alpha=0.1$ for two gradient descent steps.", steps: [
        { do: "Differentiate", result: "$f'(w)=2w$", why: "power rule" },
        { do: "Evaluate the first gradient", result: "$f'(4)=8$", why: "substitute $w_0=4$" },
        { do: "Update once", result: "$w_1=4-0.1\\cdot8=3.2$", why: "step opposite the gradient" },
        { do: "Evaluate the second gradient", result: "$f'(3.2)=6.4$", why: "use the new point" },
        { do: "Update twice", result: "$w_2=3.2-0.1\\cdot6.4=2.56$", why: "repeat the descent rule" }
      ], answer: "$w_1=3.2$ and $w_2=2.56$." },
      { problem: "For $f(w)=5w^2$, compare one step from $w_0=1$ with $\\alpha=0.05$ and $\\alpha=0.3$.", steps: [
        { do: "Differentiate", result: "$f'(w)=10w$", why: "the curvature is steep" },
        { do: "Evaluate at $w_0=1$", result: "$f'(1)=10$", why: "initial gradient" },
        { do: "Take the small step", result: "$w_1=1-0.05\\cdot10=0.5$", why: "moderate learning rate" },
        { do: "Take the large step", result: "$\\tilde w_1=1-0.3\\cdot10=-2$", why: "large learning rate overshoots across zero" },
        { do: "Compare losses", result: "$f(0.5)=1.25$ and $f(-2)=20$", why: "the large step made the loss worse" }
      ], answer: "$\\alpha=0.05$ improves the loss, while $\\alpha=0.3$ overshoots and increases it to $20$." },
      { problem: "Use one Newton step to minimize $f(w)=2(w-5)^2+7$ from $w_0=1$.", steps: [
        { do: "Differentiate", result: "$f'(w)=4(w-5)$", why: "gradient of the quadratic" },
        { do: "Compute the second derivative", result: "$f''(w)=4$", why: "curvature is constant" },
        { do: "Evaluate the gradient", result: "$f'(1)=-16$", why: "substitute $w_0=1$" },
        { do: "Apply Newton's update", result: "$w_1=1-(-16)/4=5$", why: "divide gradient by curvature" },
        { do: "Evaluate the loss", result: "$f(5)=7$", why: "the quadratic minimum is reached" }
      ], answer: "One Newton step reaches $w=5$, the exact minimizer." },
      { problem: "A validation loss sequence is $[1.20,1.05,1.01,1.00,1.04]$. With patience $1$, at which epoch would early stopping trigger after the first increase?", steps: [
        { do: "Find the best after epoch 1", result: "$1.20$", why: "first observed loss" },
        { do: "Compare epoch 2", result: "$1.05<1.20$", why: "the loss improves" },
        { do: "Compare epoch 3", result: "$1.01<1.05$", why: "the loss improves again" },
        { do: "Compare epoch 4", result: "$1.00<1.01$", why: "new best loss" },
        { do: "Compare epoch 5", result: "$1.04>1.00$", why: "one non-improving epoch triggers patience 1" }
      ], answer: "Early stopping would trigger at epoch $5$ under patience $1$." },
      { problem: "A mini-batch gradient estimate from four examples is $[2.0,1.0,3.0,0.0]$. Compute the mean gradient and one update from $w=10$ with $\\alpha=0.2$.", steps: [
        { do: "Add the example gradients", result: "$2+1+3+0=6$", why: "mini-batch gradients are averaged" },
        { do: "Divide by batch size", result: "$6/4=1.5$", why: "four examples" },
        { do: "Write the update", result: "$w_{new}=10-0.2\\cdot1.5$", why: "gradient descent step" },
        { do: "Multiply the step size", result: "$0.2\\cdot1.5=0.3$", why: "learning-rate scaling" },
        { do: "Subtract", result: "$w_{new}=9.7$", why: "move downhill" }
      ], answer: "The mean gradient is $1.5$ and the updated parameter is $9.7$." }
    ],
    applications: [
      { title: "Training linear regression", background: "Least squares can be solved exactly, but gradient methods scale naturally to large data and streaming updates.", numbers: "If gradient is $[-4,2]$ and $\\alpha=0.05$, weights change by $-[0.05][-4,2]=[0.2,-0.1]$." },
      { title: "Deep learning with SGD", background: "Neural networks use noisy mini-batch gradients because full gradients over huge datasets are expensive.", numbers: "With $1,000,000$ examples and batch size $500$, one epoch has $2000$ parameter updates." },
      { title: "Line search in scientific codes", background: "Classical optimization often tests candidate step sizes until the objective decreases enough.", numbers: "If $f=10$ and predicted decrease is $2$, an Armijo fraction $0.1$ asks for new loss at most $10-0.2=9.8$." },
      { title: "Ill-conditioning", background: "A narrow valley makes descent slow because one direction is steep and another is flat. Feature scaling is a practical cure.", numbers: "A quadratic with curvatures $1$ and $1000$ has condition number $1000/1=1000$." },
      { title: "Momentum", background: "Momentum smooths updates by remembering past descent directions, which helps cross shallow noisy regions.", numbers: "If $v_{old}=3$, gradient $g=2$, and momentum $0.9$, then $v=0.9\\cdot3+2=4.7$." },
      { title: "Hyperparameter tuning", background: "The learning rate is often the most important optimization hyperparameter because it controls stability and speed.", numbers: "A log grid $10^{-4},10^{-3},10^{-2},10^{-1}$ tests four rates separated by factors of $10$." }
    ],
    applicationsClose: "Optimization practice is the art of respecting local math while listening carefully to numerical behavior.",
    takeaways: [
      "Gradient descent uses $\\theta_{k+1}=\\theta_k-\\alpha_k\\nabla f(\\theta_k)$.",
      "The first-order Taylor approximation explains why the negative gradient is a descent direction.",
      "Learning rate, conditioning, noise, and stopping rules decide practical success.",
      "Newton's method can be fast when curvature is trustworthy but expensive or unstable when it is not."
    ]
  },

  "math-27-13": {
    id: "math-27-13",
    title: "Automatic differentiation",
    tagline: "Automatic differentiation turns a computation into exact derivative bookkeeping, one local rule at a time.",
    connections: {
      buildsOn: ["chain rule", "computational graphs", "gradients", "matrix calculus"],
      leadsTo: ["backpropagation", "numerical optimization in practice", "mixed precision training"],
      usedWith: ["dual numbers", "Jacobians", "reverse accumulation", "Taylor approximation"]
    },
    motivation:
      "<p>You already know how to differentiate a formula by hand. But a modern model is not one neat formula on a page; it is a long program with matrix multiplies, activations, reshapes, losses, and branches.</p>" +
      "<p><b>Automatic differentiation</b> keeps the derivative exact by applying the chain rule to the actual computation. It is not finite differences, and it is not symbolic algebra. It is careful local bookkeeping through the program you ran.</p>",
    definition:
      "<p>Automatic differentiation represents a computation as intermediate variables. If $v=g(u)$, then a local derivative $\\partial v/\\partial u$ is recorded. In <b>forward mode</b>, tangents move from inputs to outputs. In <b>reverse mode</b>, adjoints move from outputs back to inputs.</p>" +
      "<p>Reverse mode is efficient for scalar losses with many parameters. If $L$ is scalar and $v$ feeds into $L$, the adjoint $\\bar v=\\partial L/\\partial v$ propagates by $\\bar u\\mathrel{+}=\\bar v\\,\\partial v/\\partial u$. This is the chain rule written as an accumulation rule.</p>" +
      "<p><b>Assumptions that matter:</b> AD differentiates the executed operations; nondifferentiable points need chosen subgradient conventions or special handling; reverse mode stores or recomputes intermediate values; and numerical floating-point errors can still affect the primal and derivative values.</p>",
    worked: {
      problem: "Use reverse-mode automatic differentiation for $x=2$, $u=3x$, $v=u^2$, $L=v+5u$. Find $\\dfrac{dL}{dx}$.",
      skills: ["chain rule", "reverse mode", "computational graphs"],
      strategy: "Run the computation forward, then send one adjoint backward through each local derivative.",
      steps: [
        { do: "Compute $u$", result: "$u=3\\cdot2=6$", why: "forward pass stores the intermediate" },
        { do: "Compute $v$", result: "$v=6^2=36$", why: "use the stored $u$" },
        { do: "Compute $L$", result: "$L=36+5\\cdot6=66$", why: "finish the forward pass" },
        { do: "Seed the output adjoint", result: "$\\bar L=1$", why: "$\\partial L/\\partial L=1$" },
        { do: "Backpropagate through $L=v+5u$ to $v$", result: "$\\bar v=1$", why: "$\\partial L/\\partial v=1$" },
        { do: "Backpropagate through $L=v+5u$ to $u$", result: "$\\bar u=5$", why: "$\\partial L/\\partial u$ from this path is 5" },
        { do: "Backpropagate through $v=u^2$", result: "$\\bar u=5+1\\cdot2u=17$", why: "add the path through $v$ with $u=6$" },
        { do: "Backpropagate through $u=3x$", result: "$\\bar x=17\\cdot3=51$", why: "$\\partial u/\\partial x=3$" }
      ],
      verify: "Directly, $L=(3x)^2+5(3x)=9x^2+15x$, so $L'=18x+15=51$ at $x=2$.",
      answer: "$dL/dx=51$.",
      connects: "Reverse mode is the chain rule arranged to reuse shared intermediate computations."
    },
    practice: [
      { problem: "Forward-mode AD for $f(x)=x^2+3x$ at $x=4$: propagate value and tangent with seed $\\dot x=1$.", steps: [
        { do: "Set the input pair", result: "$(x,\\dot x)=(4,1)$", why: "the tangent tracks derivative with respect to $x$" },
        { do: "Compute $a=x^2$", result: "$a=16$, $\\dot a=2x\\dot x=8$", why: "differentiate the square operation" },
        { do: "Compute $b=3x$", result: "$b=12$, $\\dot b=3$", why: "differentiate multiplication by 3" },
        { do: "Add the values", result: "$f=a+b=28$", why: "the primal output is the ordinary computation" },
        { do: "Add the tangents", result: "$\\dot f=8+3=11$", why: "derivatives add" }
      ], answer: "$f(4)=28$ and $f'(4)=11$." },
      { problem: "Reverse-mode AD for $x=1$, $a=x+2$, $b=4a$, $L=b^2$. Find $dL/dx$.", steps: [
        { do: "Forward compute $a$", result: "$a=3$", why: "$1+2=3$" },
        { do: "Forward compute $b$", result: "$b=12$", why: "$4\\cdot3=12$" },
        { do: "Forward compute $L$", result: "$L=144$", why: "$12^2=144$" },
        { do: "Seed and backpropagate to $b$", result: "$\\bar b=2b=24$", why: "local derivative of $b^2$" },
        { do: "Backpropagate to $x$", result: "$\\bar x=24\\cdot4\\cdot1=96$", why: "$db/da=4$ and $da/dx=1$" }
      ], answer: "$dL/dx=96$." },
      { problem: "For $L=(xy+1)^2$ at $x=2$, $y=3$, compute $\\partial L/\\partial x$ and $\\partial L/\\partial y$.", steps: [
        { do: "Compute the inner value", result: "$u=xy+1=7$", why: "$2\\cdot3+1=7$" },
        { do: "Differentiate with respect to $u$", result: "$\\partial L/\\partial u=2u=14$", why: "square rule" },
        { do: "Differentiate $u$ with respect to $x$", result: "$\\partial u/\\partial x=y=3$", why: "hold $y$ fixed" },
        { do: "Compute $\\partial L/\\partial x$", result: "$14\\cdot3=42$", why: "chain rule" },
        { do: "Compute $\\partial L/\\partial y$", result: "$14\\cdot2=28$", why: "$\\partial u/\\partial y=x=2$" }
      ], answer: "$\\partial L/\\partial x=42$ and $\\partial L/\\partial y=28$." },
      { problem: "Estimate the derivative of $f(x)=x^3$ at $x=2$ by finite differences with $h=0.01$, then compare to AD's exact local derivative.", steps: [
        { do: "Compute $f(2+h)$", result: "$f(2.01)=8.120601$", why: "cube the perturbed input" },
        { do: "Compute $f(2)$", result: "$8$", why: "baseline value" },
        { do: "Form the finite difference", result: "$(8.120601-8)/0.01=12.0601$", why: "slope over a small interval" },
        { do: "Compute the AD derivative", result: "$3x^2=12$", why: "differentiate the cube operation exactly" },
        { do: "Compare", result: "finite difference error $0.0601$", why: "finite differences are approximations" }
      ], answer: "Finite difference gives $12.0601$; AD gives the exact derivative value $12$ in real arithmetic." },
      { problem: "A scalar neural unit is $z=wx+b$, $a=\\max(0,z)$, $L=(a-y)^2$. For $w=2$, $x=3$, $b=-1$, $y=4$, compute $\\partial L/\\partial w$.", steps: [
        { do: "Compute $z$", result: "$z=2\\cdot3-1=5$", why: "linear pre-activation" },
        { do: "Compute $a$", result: "$a=5$", why: "ReLU passes positive inputs" },
        { do: "Differentiate the loss with respect to $a$", result: "$\\partial L/\\partial a=2(a-y)=2$", why: "$a-y=1$" },
        { do: "Differentiate ReLU at $z=5$", result: "$\\partial a/\\partial z=1$", why: "positive side of ReLU" },
        { do: "Differentiate $z$ with respect to $w$", result: "$\\partial z/\\partial w=x=3$", why: "hold $x$ and $b$ fixed" },
        { do: "Multiply the chain", result: "$\\partial L/\\partial w=2\\cdot1\\cdot3=6$", why: "reverse-mode accumulation" }
      ], answer: "$\\partial L/\\partial w=6$." }
    ],
    applications: [
      { title: "Backpropagation", background: "Deep learning made reverse-mode AD famous because a scalar loss depends on millions or billions of parameters.", numbers: "A network with $10^7$ parameters gets one full gradient with cost on the order of a few forward passes, not $10^7$ separate finite differences." },
      { title: "Physics-informed neural networks", background: "Scientific ML often needs derivatives of a neural network with respect to space and time. AD supplies those derivatives inside the loss.", numbers: "For a residual $u_t-0.1u_{xx}$ at $1000$ collocation points, AD can compute both derivative terms at all points." },
      { title: "Hyperparameter gradients", background: "Differentiable programming treats parts of algorithms as differentiable computations, allowing gradients through optimization loops.", numbers: "If validation loss changes by adjoint $0.8$ through a learning-rate node and local derivative is $-0.03$, the hypergradient contribution is $-0.024$." },
      { title: "Sensitivity analysis", background: "Engineers ask how outputs change when inputs or constants change. Forward mode is efficient when the number of inputs of interest is small.", numbers: "For $f(a,b)=ab^2$ at $(3,2)$, sensitivities are $\\partial f/\\partial a=4$ and $\\partial f/\\partial b=12$." },
      { title: "Probabilistic programming", background: "Hamiltonian Monte Carlo needs gradients of log densities. AD lets model builders write probability programs without hand-coding every derivative.", numbers: "For log density $-x^2/2$ at $x=1.5$, AD returns gradient $-1.5$." },
      { title: "Neural architecture components", background: "Modern frameworks define layers as code. AD makes custom operations trainable as long as their local derivative rule is available.", numbers: "If a custom scale layer outputs $3x$, the backward pass multiplies incoming gradient $0.7$ by $3$ to return $2.1$." }
    ],
    applicationsClose: "Automatic differentiation is the chain rule made executable, which is why modern optimization can follow gradients through real programs.",
    takeaways: [
      "AD differentiates the operations that actually ran, not a separate symbolic expression.",
      "Forward mode pushes tangents from inputs to outputs; reverse mode pulls adjoints from outputs to inputs.",
      "Reverse mode is ideal for scalar losses with many parameters.",
      "AD gives exact derivatives of the floating-point computation, though the computation itself is still numerical."
    ]
  },

  "math-27-14": {
    id: "math-27-14",
    title: "ODE solvers in practice",
    tagline: "An ODE solver walks a changing system forward by trusting local slope information carefully.",
    connections: {
      buildsOn: ["derivatives", "Taylor approximation", "initial value problems", "numerical error"],
      leadsTo: ["PDE solvers in practice", "neural ODEs", "stability analysis"],
      usedWith: ["Euler's method", "Runge-Kutta methods", "stiffness", "adaptive step size"]
    },
    motivation:
      "<p>You already know a derivative gives an instantaneous rate of change. An ordinary differential equation turns that around: it tells you the rate, and asks you to recover the evolving state.</p>" +
      "<p>Most useful ODEs do not have a convenient closed form. A solver makes a sequence of small, honest predictions: look at the slope, step forward, estimate the error, and choose whether the next step should be smaller or larger.</p>",
    definition:
      "<p>An <b>initial value problem</b> has the form $y'(t)=f(t,y(t))$ with $y(t_0)=y_0$. Euler's method uses $y_{n+1}=y_n+h f(t_n,y_n)$. The classical fourth-order Runge-Kutta method samples several slopes inside the step and combines them.</p>" +
      "<p>Euler's update comes from Taylor's formula: $y(t+h)=y(t)+hy'(t)+O(h^2)$. Replacing $y'(t)$ by $f(t,y)$ gives the numerical step. Smaller $h$ usually reduces local error, but uses more steps.</p>" +
      "<p><b>Assumptions that matter:</b> the function $f$ should be regular enough for existence and uniqueness; explicit methods can be unstable on stiff equations; local error and accumulated global error are different; and adaptive solvers need a tolerance that matches the scale of the problem.</p>",
    worked: {
      problem: "Use Euler's method with step $h=0.5$ for $y'=-2y$, $y(0)=3$, up to $t=1$.",
      skills: ["Euler's method", "initial value problems", "stability intuition"],
      strategy: "The slope is proportional to the current value — compute it, step, then repeat.",
      steps: [
        { do: "Record the initial state", result: "$t_0=0$, $y_0=3$", why: "the initial condition starts the solver" },
        { do: "Compute the first slope", result: "$f(t_0,y_0)=-2\\cdot3=-6$", why: "use the ODE rule" },
        { do: "Take the first Euler step", result: "$y_1=3+0.5(-6)=0$", why: "add step size times slope" },
        { do: "Advance time", result: "$t_1=0.5$", why: "one step of length $0.5$" },
        { do: "Compute the second slope", result: "$f(t_1,y_1)=-2\\cdot0=0$", why: "the Euler value is now zero" },
        { do: "Take the second Euler step", result: "$y_2=0+0.5(0)=0$", why: "repeat the update" },
        { do: "Advance time again", result: "$t_2=1$", why: "two half-steps reach 1" }
      ],
      verify: "The exact solution is $3e^{-2}\\approx0.406$ at $t=1$, so this coarse step was stable-looking but too dissipative.",
      answer: "Euler with $h=0.5$ gives $y(1)\\approx0$.",
      connects: "ODE solvers are only as trustworthy as their step size and stability allow."
    },
    practice: [
      { problem: "Use Euler's method with $h=0.25$ for $y'=4$, $y(0)=1$, up to $t=0.5$.", steps: [
        { do: "Record the first state", result: "$t_0=0$, $y_0=1$", why: "initial condition" },
        { do: "Take the first step", result: "$y_1=1+0.25\\cdot4=2$", why: "constant slope" },
        { do: "Advance time", result: "$t_1=0.25$", why: "one step" },
        { do: "Take the second step", result: "$y_2=2+0.25\\cdot4=3$", why: "same constant slope" },
        { do: "Advance time", result: "$t_2=0.5$", why: "two steps reach the target" }
      ], answer: "$y(0.5)\\approx3$, which is exact here because the solution is linear." },
      { problem: "For $y'=y$, $y(0)=1$, use Euler with $h=0.1$ for two steps.", steps: [
        { do: "Compute the first slope", result: "$f(0,1)=1$", why: "the slope equals the current value" },
        { do: "Update once", result: "$y_1=1+0.1\\cdot1=1.1$", why: "Euler step" },
        { do: "Compute the second slope", result: "$f(0.1,1.1)=1.1$", why: "use the new value" },
        { do: "Update twice", result: "$y_2=1.1+0.1\\cdot1.1=1.21$", why: "repeat" },
        { do: "Compare to exact", result: "$e^{0.2}\\approx1.221$", why: "Euler is close but low" }
      ], answer: "Euler gives $y(0.2)\\approx1.21$." },
      { problem: "Use the midpoint method for $y'=t+y$, $y(0)=1$, $h=0.2$, one step.", steps: [
        { do: "Compute the initial slope", result: "$k_1=0+1=1$", why: "evaluate $f(t,y)$" },
        { do: "Estimate the midpoint value", result: "$y_{mid}=1+0.1\\cdot1=1.1$", why: "half step using $k_1$" },
        { do: "Estimate the midpoint time", result: "$t_{mid}=0.1$", why: "half of $h=0.2$" },
        { do: "Compute the midpoint slope", result: "$k_2=0.1+1.1=1.2$", why: "sample slope in the middle" },
        { do: "Take the full step", result: "$y_1=1+0.2\\cdot1.2=1.24$", why: "midpoint slope drives the update" }
      ], answer: "The midpoint estimate at $t=0.2$ is $1.24$." },
      { problem: "For $y'=-10y$, test explicit Euler stability with $h=0.05$ and $h=0.25$ by computing the amplification factor $1-10h$.", steps: [
        { do: "Compute the small-step factor", result: "$1-10(0.05)=0.5$", why: "Euler multiplies the value by this factor" },
        { do: "Check its magnitude", result: "$|0.5|<1$", why: "errors decay" },
        { do: "Compute the large-step factor", result: "$1-10(0.25)=-1.5$", why: "larger step" },
        { do: "Check its magnitude", result: "$|-1.5|=1.5>1$", why: "oscillations grow" },
        { do: "Classify", result: "$h=0.05$ stable, $h=0.25$ unstable", why: "stability requires factor magnitude below 1" }
      ], answer: "$h=0.05$ is stable for this test equation; $h=0.25$ is unstable." },
      { problem: "An adaptive solver estimates local errors $0.008$ and $0.0005$ with tolerance $0.001$. Decide whether to accept each step.", steps: [
        { do: "Compare the first error", result: "$0.008>0.001$", why: "the error exceeds tolerance" },
        { do: "Decide the first step", result: "reject", why: "too inaccurate" },
        { do: "Choose direction for next $h$", result: "decrease step size", why: "smaller steps reduce local error" },
        { do: "Compare the second error", result: "$0.0005<0.001$", why: "the error is below tolerance" },
        { do: "Decide the second step", result: "accept", why: "accuracy target is met" }
      ], answer: "Reject the first step and accept the second; the first needs a smaller step size." }
    ],
    applications: [
      { title: "Neural ODEs", background: "Neural ODEs model hidden states as continuous-time dynamics and use ODE solvers inside learning.", numbers: "If a solver takes $40$ function evaluations per example for a batch of $128$, it evaluates the neural dynamics $5120$ times." },
      { title: "Epidemic models", background: "SIR models are classic ODE systems for disease spread, dating back to early mathematical epidemiology.", numbers: "With $S=990$, $I=10$, $\\beta=0.0003$, new infection rate is $\\beta SI=2.97$ people per day." },
      { title: "Optimizer dynamics", background: "Gradient descent can be viewed as a time discretization of continuous gradient flow $\\dot w=-\\nabla L(w)$.", numbers: "For $L(w)=w^2$, gradient flow has $\\dot w=-2w$; at $w=3$, the instantaneous velocity is $-6$." },
      { title: "Control and robotics", background: "Robots integrate equations of motion to predict position and velocity under applied controls.", numbers: "At velocity $2$ m/s with acceleration $0.5$ m/s$^2$, Euler with $h=0.1$ updates velocity to $2.05$ m/s." },
      { title: "Pharmacokinetics", background: "Drug concentration models use ODEs for absorption and clearance, often solved numerically for dosing schedules.", numbers: "For $C'=-0.2C$ and $C=50$, the clearance rate is $-10$ units per hour." },
      { title: "Rendering and animation", background: "Physical animation integrates springs, fluids, and rigid-body motion one frame at a time.", numbers: "A $60$ FPS simulation uses $h=1/60\\approx0.0167$ seconds per frame." }
    ],
    applicationsClose: "ODE solvers turn local rates into global motion, provided the steps respect accuracy and stability.",
    takeaways: [
      "An initial value problem specifies both an ODE and a starting value.",
      "Euler's method comes directly from the first Taylor approximation.",
      "Smaller steps usually improve accuracy but increase cost.",
      "Stiffness and instability are practical reasons to choose better methods or adaptive steps."
    ]
  },

  "math-27-15": {
    id: "math-27-15",
    title: "PDE solvers in practice",
    tagline: "PDE solvers turn fields over space and time into structured linear algebra.",
    connections: {
      buildsOn: ["partial derivatives", "linear algebra", "finite differences", "ODE solvers in practice"],
      leadsTo: ["scientific machine learning", "finite element methods", "multigrid"],
      usedWith: ["sparse matrices", "boundary conditions", "stability", "Fourier analysis"]
    },
    motivation:
      "<p>You already know an ODE tracks one evolving state. A partial differential equation tracks a whole field: temperature along a rod, pressure in air, probability density in space, or an image being smoothed.</p>" +
      "<p>The practical trick is discretization. Replace a continuum by grid values, replace derivatives by differences or basis functions, and solve the resulting algebra carefully. The PDE becomes a computational object.</p>",
    definition:
      "<p>A <b>PDE solver</b> approximates equations involving partial derivatives, such as the heat equation $u_t=\\kappa u_{xx}$. On a grid with spacing $\\Delta x$ and time step $\\Delta t$, one explicit finite-difference update is $u_i^{n+1}=u_i^n+r(u_{i-1}^n-2u_i^n+u_{i+1}^n)$, where $r=\\kappa\\Delta t/\\Delta x^2$.</p>" +
      "<p>The second-difference formula comes from Taylor expansion: $u(x+\\Delta x)-2u(x)+u(x-\\Delta x)\\approx\\Delta x^2u_{xx}(x)$. That turns curvature into neighbor arithmetic.</p>" +
      "<p><b>Assumptions that matter:</b> boundary conditions are part of the problem, not decoration; grid resolution controls discretization error; explicit schemes have stability limits; and many multidimensional PDE discretizations produce large sparse linear systems.</p>",
    worked: {
      problem: "For the heat equation with $\\kappa=1$, $\\Delta x=0.5$, $\\Delta t=0.1$, and interior values $[u_1,u_2,u_3]=[0,10,0]$ with boundary values $0$, compute one explicit step.",
      skills: ["finite differences", "heat equation", "stability parameter"],
      strategy: "Compute $r$, then update each grid point from its two neighbors and itself.",
      steps: [
        { do: "Compute $\\Delta x^2$", result: "$0.5^2=0.25$", why: "the heat update uses squared grid spacing" },
        { do: "Compute $r$", result: "$r=1\\cdot0.1/0.25=0.4$", why: "substitute into $\\kappa\\Delta t/\\Delta x^2$" },
        { do: "Update $u_1$", result: "$u_1^{new}=0+0.4(0-2\\cdot0+10)=4$", why: "left boundary is 0 and right neighbor is 10" },
        { do: "Update $u_2$", result: "$u_2^{new}=10+0.4(0-20+0)=2$", why: "the hot center diffuses outward" },
        { do: "Update $u_3$", result: "$u_3^{new}=0+0.4(10-0+0)=4$", why: "symmetric neighbor arithmetic" },
        { do: "Write the new vector", result: "$[4,2,4]$", why: "collect the three updated interiors" }
      ],
      verify: "Total interior heat changes from $10$ to $10$ because the zero boundaries did not receive heat in this one interior accounting; the hot center cooled while neighbors warmed.",
      answer: "One explicit heat step gives interior values $[4,2,4]$.",
      connects: "A PDE stencil is local calculus rewritten as neighbor-to-neighbor computation."
    },
    practice: [
      { problem: "Compute the second-difference approximation to $u_{xx}$ at values $u_{i-1}=3$, $u_i=5$, $u_{i+1}=4$ with $\\Delta x=0.2$.", steps: [
        { do: "Form the numerator", result: "$3-2\\cdot5+4=-3$", why: "use left minus twice center plus right" },
        { do: "Compute $\\Delta x^2$", result: "$0.2^2=0.04$", why: "second derivatives divide by squared spacing" },
        { do: "Divide", result: "$-3/0.04=-75$", why: "apply the finite-difference formula" },
        { do: "Interpret the sign", result: "negative curvature", why: "the center is high relative to neighbors" },
        { do: "State the approximation", result: "$u_{xx}\\approx-75$", why: "units are per space squared" }
      ], answer: "$u_{xx}\\approx-75$." },
      { problem: "For explicit heat with $\\kappa=0.5$, $\\Delta x=0.1$, and $\\Delta t=0.005$, compute $r$ and check the 1-D stability rule $r\\le0.5$.", steps: [
        { do: "Square the grid spacing", result: "$\\Delta x^2=0.01$", why: "$0.1^2=0.01$" },
        { do: "Multiply $\\kappa\\Delta t$", result: "$0.5\\cdot0.005=0.0025$", why: "numerator of $r$" },
        { do: "Compute $r$", result: "$0.0025/0.01=0.25$", why: "divide by squared spacing" },
        { do: "Compare to the limit", result: "$0.25\\le0.5$", why: "stability condition is satisfied" },
        { do: "Classify", result: "stable by this rule", why: "explicit 1-D heat permits this step size" }
      ], answer: "$r=0.25$, so the step satisfies the $r\\le0.5$ rule." },
      { problem: "A 1-D Poisson problem with $4$ interior points uses the stencil $[-1,2,-1]$. How many nonzeros are in the matrix?", steps: [
        { do: "Count main diagonal entries", result: "$4$", why: "one center coefficient per interior point" },
        { do: "Count upper diagonal entries", result: "$3$", why: "connections from point $i$ to $i+1$" },
        { do: "Count lower diagonal entries", result: "$3$", why: "connections from point $i$ to $i-1$" },
        { do: "Add the nonzeros", result: "$4+3+3=10$", why: "tridiagonal pattern" },
        { do: "Compare to dense", result: "$10$ of $16$ entries", why: "a $4\\times4$ dense matrix has 16 positions" }
      ], answer: "The matrix has $10$ nonzeros." },
      { problem: "Use one upwind advection step $u_i^{n+1}=u_i^n-c(u_i^n-u_{i-1}^n)$ with $c=0.3$, $u_{i-1}=2$, $u_i=5$.", steps: [
        { do: "Compute the backward difference", result: "$u_i-u_{i-1}=5-2=3$", why: "upwind uses the left neighbor for positive speed" },
        { do: "Scale by $c$", result: "$0.3\\cdot3=0.9$", why: "Courant number controls the step" },
        { do: "Subtract from current value", result: "$5-0.9=4.1$", why: "apply the update" },
        { do: "Check direction", result: "value decreases", why: "left neighbor is smaller and flow comes from left" },
        { do: "State the new value", result: "$u_i^{n+1}=4.1$", why: "one time step completed" }
      ], answer: "$u_i^{n+1}=4.1$." },
      { problem: "A $50\\times50$ 2-D grid uses a five-point Poisson stencil. Estimate unknowns and nonzeros using $5$ per row.", steps: [
        { do: "Count unknowns", result: "$50\\cdot50=2500$", why: "one unknown per grid point" },
        { do: "Use the stencil estimate", result: "$5$ nonzeros per row", why: "center plus four neighbors" },
        { do: "Multiply", result: "$2500\\cdot5=12,500$", why: "estimate total nonzeros" },
        { do: "Count dense entries", result: "$2500^2=6,250,000$", why: "dense matrix size" },
        { do: "Compute sparse fraction", result: "$12,500/6,250,000=0.002$", why: "compare sparse to dense" }
      ], answer: "There are $2500$ unknowns and about $12,500$ nonzeros, roughly $0.2\\%$ of a dense matrix." }
    ],
    applications: [
      { title: "Heat diffusion in chips", background: "Thermal simulation helps engineers prevent processors and accelerators from overheating. Heat equations model how temperature spreads.", numbers: "With $r=0.25$ and local values $60,80,70$, the next center is $80+0.25(60-160+70)=72.5$." },
      { title: "Computational fluid dynamics", background: "CFD solves PDEs for airflow, weather, and fluids. Discretization converts conservation laws into large numerical systems.", numbers: "A $200\\times200\\times50$ grid has $2,000,000$ cells before even storing velocity components." },
      { title: "Image denoising", background: "Diffusion PDEs smooth images by letting pixel values spread to neighbors, while variants preserve edges.", numbers: "A pixel $100$ with neighbors $80,90,110,120$ has Laplacian $80+90+110+120-4\\cdot100=0$." },
      { title: "Option pricing", background: "The Black-Scholes PDE from mathematical finance can be solved on grids when closed forms are unavailable or contracts are complex.", numbers: "A grid of $500$ stock prices and $1000$ time levels tracks $500,000$ state values." },
      { title: "Scientific ML surrogates", background: "Neural networks are often trained to approximate expensive PDE solvers, but the solver data still comes from discretized equations.", numbers: "If one PDE solve takes $30$ seconds, generating $10,000$ training samples costs about $300,000$ seconds, or $83.3$ hours." },
      { title: "Electrostatics and Poisson equations", background: "Fields from charges, potentials in devices, and pressure corrections in fluids often reduce to Poisson-like sparse systems.", numbers: "A million-unknown five-point system has about $5$ million nonzeros, feasible sparsely but impossible as a dense trillion-entry matrix." }
    ],
    applicationsClose: "PDE solvers are where calculus, grids, sparsity, and stability meet to make fields computable.",
    takeaways: [
      "PDE discretization replaces derivatives with algebra on grid values or basis coefficients.",
      "Boundary conditions are part of the mathematical problem and the numerical system.",
      "Explicit schemes are simple but often constrained by stability limits.",
      "Sparse matrices are central because local stencils connect only nearby unknowns."
    ]
  },

  "math-27-16": {
    id: "math-27-16",
    title: "Monte Carlo methods",
    tagline: "Monte Carlo methods trade exact formulas for many random trials whose average becomes reliable.",
    connections: {
      buildsOn: ["probability", "expectation", "variance", "law of large numbers"],
      leadsTo: ["Bayesian computation", "stochastic optimization", "randomized numerical linear algebra"],
      usedWith: ["sampling", "confidence intervals", "Markov chains", "numerical integration"]
    },
    motivation:
      "<p>You already trust averages. Flip a fair coin many times and the fraction of heads settles near one half. Monte Carlo methods turn that settling behavior into a numerical tool.</p>" +
      "<p>When a sum, integral, or probability is too complicated to compute directly, we sample. Each sample is noisy, but the average has a direction: error usually shrinks like $1/\\sqrt{N}$, which is slow but wonderfully dimension-independent.</p>",
    definition:
      "<p>A <b>Monte Carlo estimator</b> writes a target quantity as an expectation $\\mu=\\mathbb{E}[X]$ and approximates it with $\\hat\\mu_N=\\frac1N\\sum_{i=1}^N X_i$, where $X_i$ are sampled values. If the samples are independent with variance $\\sigma^2$, then $\\operatorname{Var}(\\hat\\mu_N)=\\sigma^2/N$.</p>" +
      "<p>The variance formula comes from independence: the variance of a sum is the sum of variances, so $\\operatorname{Var}(\\sum X_i/N)=N\\sigma^2/N^2=\\sigma^2/N$. The standard error is therefore $\\sigma/\\sqrt{N}$.</p>" +
      "<p><b>Assumptions that matter:</b> samples must represent the target distribution; dependence changes the variance calculation; rare events can require many samples; and random error should be reported with uncertainty, not only a point estimate.</p>",
    worked: {
      problem: "Estimate $\\int_0^1 x^2\\,dx$ from samples $x=[0.1,0.4,0.8,0.9]$ drawn uniformly on $[0,1]$.",
      skills: ["Monte Carlo integration", "sample averages", "error intuition"],
      strategy: "For a uniform interval of length 1, average the function values at random sample points.",
      steps: [
        { do: "Evaluate the first sample", result: "$0.1^2=0.01$", why: "apply $f(x)=x^2$" },
        { do: "Evaluate the second sample", result: "$0.4^2=0.16$", why: "apply the same function" },
        { do: "Evaluate the third sample", result: "$0.8^2=0.64$", why: "square the sample" },
        { do: "Evaluate the fourth sample", result: "$0.9^2=0.81$", why: "square the sample" },
        { do: "Add the values", result: "$0.01+0.16+0.64+0.81=1.62$", why: "prepare the sample mean" },
        { do: "Divide by the number of samples", result: "$1.62/4=0.405$", why: "Monte Carlo estimator is an average" },
        { do: "Compare to the exact integral", result: "$1/3\\approx0.333$", why: "four samples are still noisy" }
      ],
      verify: "The estimate is plausible because $x^2$ lies between 0 and 1, but the small sample happened to include two large $x$ values.",
      answer: "The Monte Carlo estimate is $0.405$.",
      connects: "Monte Carlo replaces area with an average of randomly sampled heights."
    },
    practice: [
      { problem: "Samples of a random loss are $[2,4,6,8]$. Estimate the expected loss and the sample variance using denominator $N-1$.", steps: [
        { do: "Add the samples", result: "$2+4+6+8=20$", why: "sum before averaging" },
        { do: "Compute the mean", result: "$20/4=5$", why: "four samples" },
        { do: "Compute squared deviations", result: "$9,1,1,9$", why: "subtract 5 and square" },
        { do: "Add squared deviations", result: "$9+1+1+9=20$", why: "total variability" },
        { do: "Divide by $N-1$", result: "$20/3\\approx6.667$", why: "sample variance estimate" }
      ], answer: "Estimated expected loss is $5$; sample variance is about $6.667$." },
      { problem: "A Monte Carlo estimate has sample standard deviation $12$ from $N=400$ independent samples. Compute the standard error.", steps: [
        { do: "Write the formula", result: "$\\operatorname{SE}=s/\\sqrt{N}$", why: "averaging reduces standard deviation" },
        { do: "Compute the square root", result: "$\\sqrt{400}=20$", why: "sample count" },
        { do: "Divide", result: "$12/20=0.6$", why: "standard error of the mean" },
        { do: "Interpret", result: "typical average error about $0.6$", why: "standard error measures estimator noise" },
        { do: "Predict effect of quadrupling $N$", result: "SE would become $0.3$", why: "four times samples halves $1/\\sqrt N$ error" }
      ], answer: "The standard error is $0.6$." },
      { problem: "Estimate $\\pi$ using $1000$ random points in the unit square when $790$ land inside the quarter circle.", steps: [
        { do: "Compute the inside fraction", result: "$790/1000=0.79$", why: "fraction estimates quarter-circle area" },
        { do: "Recall the quarter-circle area", result: "$\\pi/4$", why: "radius is 1" },
        { do: "Set the estimate", result: "$\\hat\\pi/4=0.79$", why: "match estimated area" },
        { do: "Multiply by 4", result: "$\\hat\\pi=3.16$", why: "solve for $\\pi$" },
        { do: "Compare", result: "$3.16$ is close to $3.1416$", why: "sampling error remains" }
      ], answer: "The Monte Carlo estimate is $\\hat\\pi=3.16$." },
      { problem: "Importance sampling uses weights $[0.5,1.5,2.0]$ and function values $[10,4,1]$. Compute the weighted estimate $\\sum w_if_i/N$.", steps: [
        { do: "Multiply the first pair", result: "$0.5\\cdot10=5$", why: "weight the sample contribution" },
        { do: "Multiply the second pair", result: "$1.5\\cdot4=6$", why: "second contribution" },
        { do: "Multiply the third pair", result: "$2.0\\cdot1=2$", why: "third contribution" },
        { do: "Add contributions", result: "$5+6+2=13$", why: "sum weighted values" },
        { do: "Divide by $N=3$", result: "$13/3\\approx4.333$", why: "Monte Carlo average" }
      ], answer: "The weighted estimate is approximately $4.333$." },
      { problem: "A dropout layer keeps each of $1000$ units with probability $0.8$. Estimate the mean and standard deviation of the number kept.", steps: [
        { do: "Use the binomial mean", result: "$np=1000\\cdot0.8=800$", why: "expected kept units" },
        { do: "Compute $1-p$", result: "$0.2$", why: "needed for variance" },
        { do: "Use the binomial variance", result: "$np(1-p)=1000\\cdot0.8\\cdot0.2=160$", why: "independent keep/drop decisions" },
        { do: "Take the square root", result: "$\\sqrt{160}\\approx12.65$", why: "standard deviation" },
        { do: "Interpret", result: "about $800\\pm13$ units kept typically", why: "one standard deviation scale" }
      ], answer: "Mean kept units $800$; standard deviation about $12.65$." }
    ],
    applications: [
      { title: "Bayesian posterior estimation", background: "Bayesian statistics often needs integrals over complicated posterior distributions. Monte Carlo samples approximate posterior means and intervals.", numbers: "If posterior samples of a parameter average $2.4$ with standard deviation $0.5$ over $2500$ samples, SE is $0.5/50=0.01$." },
      { title: "Dropout in neural networks", background: "Dropout randomly removes units during training, effectively sampling subnetworks to regularize the model.", numbers: "With keep probability $0.9$ and $4096$ activations, expected kept activations are $3686.4$." },
      { title: "Policy evaluation in reinforcement learning", background: "RL estimates expected returns by simulating episodes because exact environment sums are usually unavailable.", numbers: "Returns $[10,6,14,8,12]$ average to $50/5=10$." },
      { title: "Uncertainty in A/B testing", background: "Simulation can approximate uncertainty for conversion rates and lift when formulas become awkward.", numbers: "If simulated lift samples have mean $0.03$ and SD $0.02$ over $10,000$ runs, SE is $0.0002$." },
      { title: "Rendering", background: "Physically based graphics estimates light transport integrals by tracing random rays. More rays reduce grainy noise.", numbers: "Increasing samples per pixel from $64$ to $256$ halves noise scale because $\\sqrt{256/64}=2$." },
      { title: "High-dimensional integration", background: "Grid quadrature explodes with dimension, while Monte Carlo error depends mainly on sample count, not dimension directly.", numbers: "A grid with $10$ points in each of $20$ dimensions has $10^{20}$ points; Monte Carlo might use $10^6$ samples." }
    ],
    applicationsClose: "Monte Carlo is patient arithmetic: random samples are noisy alone, but averages reveal stable structure.",
    takeaways: [
      "Monte Carlo estimates expectations with sample averages.",
      "Independent-sample standard error shrinks like $1/\\sqrt{N}$.",
      "The method is broadly useful but can be slow for rare events or high variance quantities.",
      "Good reporting includes uncertainty, not just the estimate."
    ]
  },

  "math-27-17": {
    id: "math-27-17",
    title: "Randomized numerical linear algebra",
    tagline: "Random projections let large matrices reveal their main structure without reading every detail equally.",
    connections: {
      buildsOn: ["linear algebra", "probability", "matrix decompositions", "least squares"],
      leadsTo: ["large-scale PCA", "sketching", "GPU and parallel computing"],
      usedWith: ["SVD", "Monte Carlo methods", "subspaces", "concentration inequalities"]
    },
    motivation:
      "<p>You already know matrices can be decomposed to reveal directions, ranks, and least-squares solutions. The obstacle is scale: a data matrix may have millions of rows and thousands of columns.</p>" +
      "<p><b>Randomized numerical linear algebra</b> asks a friendly question: can a small random sketch preserve enough geometry to solve the problem faster? Often yes. Randomness becomes a measuring tool, not a lack of rigor.</p>",
    definition:
      "<p>A <b>sketch</b> multiplies a large matrix or vector by a random matrix $S$ to form a smaller object, such as $SA$ or $A\\Omega$. Randomized range finding for a rank-$k$ approximation samples $Y=A\\Omega$, builds an orthonormal basis $Q$ for the columns of $Y$, then approximates $A\\approx QQ^TA$.</p>" +
      "<p>The intuition is that random test vectors are unlikely to miss a large direction. If $A$ has most of its action in a $k$-dimensional subspace, then a few extra random probes often capture that subspace well.</p>" +
      "<p><b>Assumptions that matter:</b> randomized algorithms return high-probability guarantees, not deterministic certainty; oversampling improves reliability; power iterations help when singular values decay slowly; and sketches must preserve the geometry relevant to the task.</p>",
    worked: {
      problem: "Use a random projection vector $\\omega=[1,-1]^T$ with $A=\\begin{bmatrix}3&0\\\\0&1\\\\0&0\\end{bmatrix}$. Compute $y=A\\omega$ and the unit basis vector $q=y/\\|y\\|$.",
      skills: ["random projections", "matrix-vector products", "normalization"],
      strategy: "Probe the matrix with one random direction, then normalize the response.",
      steps: [
        { do: "Multiply the first row", result: "$3\\cdot1+0\\cdot(-1)=3$", why: "row 1 action" },
        { do: "Multiply the second row", result: "$0\\cdot1+1\\cdot(-1)=-1$", why: "row 2 action" },
        { do: "Multiply the third row", result: "$0$", why: "the third row is zero" },
        { do: "Write $y$", result: "$y=[3,-1,0]^T$", why: "collect the row products" },
        { do: "Compute the norm", result: "$\\|y\\|=\\sqrt{3^2+(-1)^2}=\\sqrt{10}$", why: "Euclidean normalization" },
        { do: "Normalize", result: "$q=[3/\\sqrt{10},-1/\\sqrt{10},0]^T$", why: "divide by the norm" }
      ],
      verify: "$q$ has norm $1$ because $(9+1)/10=1$.",
      answer: "$y=[3,-1,0]^T$ and $q=[3/\\sqrt{10},-1/\\sqrt{10},0]^T$.",
      connects: "A random probe turns hidden matrix action into a vector whose span can approximate an important subspace."
    },
    practice: [
      { problem: "Project $x=[2,-1,3,0]^T$ with $s=[1,0,-1,1]$. Compute the one-dimensional sketch $sx$.", steps: [
        { do: "Multiply first entries", result: "$1\\cdot2=2$", why: "first sketch contribution" },
        { do: "Multiply second entries", result: "$0\\cdot(-1)=0$", why: "zero weight ignores this coordinate" },
        { do: "Multiply third entries", result: "$-1\\cdot3=-3$", why: "signed contribution" },
        { do: "Multiply fourth entries", result: "$1\\cdot0=0$", why: "last coordinate is zero" },
        { do: "Add", result: "$2+0-3+0=-1$", why: "complete the sketch" }
      ], answer: "The sketch value is $-1$." },
      { problem: "A randomized SVD target rank is $k=20$ with oversampling $p=10$ for a matrix with $n=5000$ columns. What size should $\\Omega$ have?", steps: [
        { do: "Add rank and oversampling", result: "$20+10=30$", why: "number of random probe vectors" },
        { do: "Identify row dimension", result: "$5000$", why: "$\\Omega$ multiplies on the right of $A$" },
        { do: "Write the shape", result: "$5000\\times30$", why: "one column per random probe" },
        { do: "Interpret", result: "$Y=A\\Omega$ has 30 sampled columns", why: "range finder captures a 30-dimensional candidate space" },
        { do: "Name the extra vectors", result: "$10$ oversampling directions", why: "they reduce the chance of missing important directions" }
      ], answer: "$\\Omega$ should be $5000\\times30$." },
      { problem: "A Johnson-Lindenstrauss sketch changes a distance from $10$ to $9.4$. Compute the relative error.", steps: [
        { do: "Compute the absolute change", result: "$|9.4-10|=0.6$", why: "distance changed by 0.6" },
        { do: "Divide by the original distance", result: "$0.6/10=0.06$", why: "relative error" },
        { do: "Convert to percent", result: "$6\\%$", why: "multiply by 100" },
        { do: "Compare to a $10\\%$ tolerance", result: "$6\\%<10\\%$", why: "the sketch is within tolerance" },
        { do: "State preservation", result: "distance is reasonably preserved", why: "small relative distortion" }
      ], answer: "The relative distance error is $6\\%$." },
      { problem: "A CountSketch hashes values $[4,7,-2]$ into two buckets with bucket indices $[1,2,1]$ and signs $[1,-1,1]$. Compute the buckets.", steps: [
        { do: "Initialize buckets", result: "$b_1=0$, $b_2=0$", why: "start with an empty sketch" },
        { do: "Add the first value", result: "$b_1=4$", why: "value 4 goes to bucket 1 with positive sign" },
        { do: "Add the second value", result: "$b_2=-7$", why: "value 7 goes to bucket 2 with negative sign" },
        { do: "Add the third value", result: "$b_1=4+(-2)=2$", why: "value -2 goes to bucket 1 with positive sign" },
        { do: "Write the sketch", result: "$[2,-7]$", why: "two buckets remain" }
      ], answer: "The sketch buckets are $[2,-7]$." },
      { problem: "A matrix-vector product with $A$ costs $2$ seconds. A randomized range finder uses $30$ probes and one power iteration, which needs $3$ multiplies per probe. Estimate the time.", steps: [
        { do: "Count multiplies per probe", result: "$3$", why: "given by one power-iteration setup" },
        { do: "Count total multiplies", result: "$30\\cdot3=90$", why: "one count per probe" },
        { do: "Multiply by time per product", result: "$90\\cdot2=180$ seconds", why: "each product costs 2 seconds" },
        { do: "Convert to minutes", result: "$180/60=3$ minutes", why: "more interpretable time" },
        { do: "Interpret", result: "about $3$ minutes", why: "range finding cost is dominated by matrix products" }
      ], answer: "The estimated time is $180$ seconds, or $3$ minutes." }
    ],
    applications: [
      { title: "Large-scale PCA", background: "PCA uses singular vectors to find dominant directions. Randomized SVD makes PCA feasible when the data matrix is too large for exact decomposition.", numbers: "For $1,000,000\\times1000$ data and target rank $50$, a $60$-vector sketch uses $60$ passes of matrix-vector style work instead of full SVD." },
      { title: "Least-squares sketching", background: "Overdetermined regression can be sped up by sketching rows while approximately preserving the geometry of residuals.", numbers: "A problem with $10,000,000$ rows and $100$ features might be sketched to $20,000$ rows, a $500$ times row reduction." },
      { title: "Embedding compression", background: "Random projections can reduce embedding dimension while roughly preserving pairwise distances.", numbers: "Compressing $768$ dimensions to $128$ dimensions reduces storage for $1$ million vectors from $768$ million to $128$ million numbers." },
      { title: "Leverage score sampling", background: "Important rows in least squares can be sampled more often using leverage scores, which measure geometric influence.", numbers: "If a row has leverage $0.02$ and total rank is $100$, its normalized sampling weight is $0.02/100=0.0002$ before scaling by sample count." },
      { title: "Fast kernel approximations", background: "Random features approximate kernel methods by replacing infinite or large feature maps with sampled features.", numbers: "Using $2000$ random Fourier features turns kernel evaluation into a $2000$-dimensional dot product." },
      { title: "Streaming data summaries", background: "Sketches summarize streams without storing every item. They are useful when data arrives faster than it can be kept.", numbers: "A stream of $10^9$ events summarized into $10^6$ counters uses about $0.1\\%$ as many stored counts." }
    ],
    applicationsClose: "Randomized linear algebra works because large geometry can often be sensed accurately through a surprisingly small number of random measurements.",
    takeaways: [
      "Sketches reduce dimension or sample information while preserving the structure needed for a task.",
      "Randomized range finding approximates $A$ by capturing its dominant column space.",
      "Oversampling and power iterations improve reliability.",
      "The guarantees are probabilistic, so error and failure probability matter."
    ]
  },

  "math-27-18": {
    id: "math-27-18",
    title: "GPU and parallel computing",
    tagline: "Parallel computing is the discipline of giving many simple workers enough independent work to stay busy.",
    connections: {
      buildsOn: ["vectors and matrices", "orders of growth", "memory layout", "matrix multiplication"],
      leadsTo: ["mixed precision training", "large-scale optimization", "distributed numerical methods"],
      usedWith: ["linear algebra kernels", "sparse matrices", "reductions", "conditioning"]
    },
    motivation:
      "<p>You already know a matrix multiply contains many repeated arithmetic operations. A CPU can do them quickly, but a GPU is built to do many of them at once, as long as the work is regular and data arrives fast enough.</p>" +
      "<p>The practical lesson is that speed is not only about counting operations. It is about parallelism, memory bandwidth, data movement, occupancy, and using well-tuned kernels. The fastest computation is often the one that keeps data close and workers full.</p>",
    definition:
      "<p><b>Parallel computing</b> splits work across processing units. If a serial job takes time $T_1$ and a parallel job on $p$ workers takes $T_p$, the speedup is $S=T_1/T_p$ and efficiency is $E=S/p$. GPUs use thousands of lightweight threads organized around high-throughput linear algebra.</p>" +
      "<p>Amdahl's law explains the limit: if fraction $s$ of a program is serial, then ideal speedup on $p$ workers is $1/(s+(1-s)/p)$. Even infinite parallel workers cannot beat $1/s$ because the serial part remains.</p>" +
      "<p><b>Assumptions that matter:</b> parallel speedups require enough independent work; memory transfers can dominate arithmetic; reductions and synchronization add overhead; and numerical results may differ slightly because floating-point addition is not associative.</p>",
    worked: {
      problem: "A training step takes $120$ ms on one CPU core. On a GPU it spends $20$ ms transferring data, $15$ ms launching and synchronizing kernels, and $25$ ms doing computation. Compute speedup and efficiency relative to $1000$ GPU cores.",
      skills: ["speedup", "efficiency", "overhead accounting"],
      strategy: "Add all parallel-time costs first; then compare with serial time and divide by worker count.",
      steps: [
        { do: "Add transfer time", result: "$20$ ms", why: "data movement is part of wall time" },
        { do: "Add synchronization time", result: "$20+15=35$ ms", why: "kernel overhead also counts" },
        { do: "Add compute time", result: "$35+25=60$ ms", why: "total GPU step time" },
        { do: "Compute speedup", result: "$S=120/60=2$", why: "serial time divided by parallel time" },
        { do: "Compute efficiency", result: "$E=2/1000=0.002$", why: "speedup per core" },
        { do: "Convert efficiency", result: "$0.2\\%$", why: "multiply by 100" }
      ],
      verify: "The GPU computation itself was fast, but transfer and launch overhead limited the overall speedup to only $2$.",
      answer: "The GPU step takes $60$ ms, giving speedup $2$ and efficiency $0.2\\%$ relative to $1000$ cores.",
      connects: "Parallel performance is wall-clock accounting, not just peak arithmetic."
    },
    practice: [
      { problem: "A matrix multiply takes $500$ ms on one core and $40$ ms on a GPU. Compute speedup.", steps: [
        { do: "Write serial time", result: "$T_1=500$ ms", why: "baseline" },
        { do: "Write GPU time", result: "$T_p=40$ ms", why: "parallel run" },
        { do: "Compute speedup", result: "$S=500/40=12.5$", why: "definition of speedup" },
        { do: "Interpret", result: "$12.5$ times faster", why: "wall time is reduced by that factor" },
        { do: "Compute time saved", result: "$500-40=460$ ms", why: "absolute improvement" }
      ], answer: "The speedup is $12.5$ times." },
      { problem: "A job has serial fraction $s=0.1$. Use Amdahl's law to estimate ideal speedup on $p=16$ workers.", steps: [
        { do: "Compute parallel fraction", result: "$1-s=0.9$", why: "the rest can parallelize" },
        { do: "Divide by workers", result: "$0.9/16=0.05625$", why: "parallel part is shared" },
        { do: "Add serial part", result: "$0.1+0.05625=0.15625$", why: "total normalized time" },
        { do: "Invert", result: "$1/0.15625=6.4$", why: "Amdahl speedup" },
        { do: "Compare to workers", result: "$6.4<16$", why: "serial work limits speedup" }
      ], answer: "Ideal speedup is $6.4$ times." },
      { problem: "A GPU has memory bandwidth $800$ GB/s. How long is the minimum time to read $16$ GB once?", steps: [
        { do: "Write the bandwidth formula", result: "time $=$ bytes divided by bandwidth", why: "bandwidth limits transfer rate" },
        { do: "Substitute", result: "$16/800$ seconds", why: "GB units cancel" },
        { do: "Divide", result: "$0.02$ seconds", why: "minimum read time" },
        { do: "Convert to milliseconds", result: "$20$ ms", why: "multiply by 1000" },
        { do: "State the limit", result: "at least $20$ ms", why: "real kernels may take longer" }
      ], answer: "The bandwidth lower bound is $20$ ms." },
      { problem: "A reduction sums $1,048,576=2^{20}$ numbers by halving the active count each round. How many parallel reduction rounds are needed?", steps: [
        { do: "Write the count as a power", result: "$1,048,576=2^{20}$", why: "given" },
        { do: "Identify halving rounds", result: "one exponent decreases per round", why: "each round halves the active values" },
        { do: "Count rounds to one value", result: "$20$", why: "$2^{20}$ halved 20 times becomes $1$" },
        { do: "Compare to serial additions", result: "$1,048,575$ serial additions", why: "serial summation combines all numbers one by one" },
        { do: "Interpret", result: "depth $20$", why: "parallel reductions reduce time depth logarithmically" }
      ], answer: "The reduction needs $20$ parallel rounds." },
      { problem: "A model step computes $200$ GFLOP and moves $50$ GB. Its arithmetic intensity is FLOP per byte. Compute it and decide if it is below a machine balance of $10$ FLOP/byte.", steps: [
        { do: "Convert GFLOP and GB consistently", result: "$200/50$ FLOP per byte", why: "the giga factors cancel" },
        { do: "Divide", result: "$4$ FLOP/byte", why: "arithmetic intensity" },
        { do: "Compare to machine balance", result: "$4<10$", why: "below the threshold" },
        { do: "Classify", result: "memory-bandwidth limited", why: "not enough arithmetic per byte moved" },
        { do: "Suggest improvement", result: "reuse data more", why: "higher reuse raises arithmetic intensity" }
      ], answer: "Arithmetic intensity is $4$ FLOP/byte, below $10$, so the step is likely memory-bandwidth limited." }
    ],
    applications: [
      { title: "Deep learning matrix multiplies", background: "Dense neural network layers and attention blocks are dominated by matrix multiplies, which GPUs execute efficiently through tiled kernels.", numbers: "Multiplying $1024\\times1024$ by $1024\\times1024$ costs about $2\\cdot1024^3\\approx2.15$ billion FLOP." },
      { title: "Mini-batch parallelism", background: "Examples in a mini-batch often share the same model but independent data, making them natural parallel work.", numbers: "A batch of $256$ images split across $8$ devices gives $32$ images per device." },
      { title: "Data transfer bottlenecks", background: "Moving data between host memory and GPU memory can erase compute gains if done too often.", numbers: "At $25$ GB/s PCIe bandwidth, transferring $5$ GB takes at least $0.2$ seconds." },
      { title: "Parallel reductions in loss computation", background: "Losses and gradients often sum contributions across examples or parameters. Reductions need synchronization.", numbers: "Summing $2^{16}=65,536$ values can have reduction depth $16$ with enough parallel workers." },
      { title: "Sparse GPU workloads", background: "Sparse operations save arithmetic but can be harder for GPUs because memory access is irregular.", numbers: "A sparse matrix with $10$ million nonzeros and $64$ features performs about $640$ million feature multiplications per aggregation." },
      { title: "Distributed training", background: "Large models may use many GPUs and communicate gradients between them. Communication can become the limiting serial-like part.", numbers: "A $4$ GB gradient all-reduced over a $100$ GB/s link has a raw bandwidth time of at least $0.04$ seconds." }
    ],
    applicationsClose: "GPU computing rewards the same habits as good numerical thinking: count the real bottleneck, not only the beautiful formula.",
    takeaways: [
      "Speedup compares serial and parallel wall time; efficiency divides speedup by worker count.",
      "Amdahl's law shows how serial work limits total speedup.",
      "Memory movement, synchronization, and kernel overhead can dominate arithmetic.",
      "Floating-point reductions may give slightly different answers when the order changes."
    ]
  },

  "math-27-19": {
    id: "math-27-19",
    title: "Mixed precision & stability in training",
    tagline: "Mixed precision training is fast only when scaling and stability keep tiny gradients from disappearing and large values from overflowing.",
    connections: {
      buildsOn: ["floating-point arithmetic", "gradients", "numerical optimization in practice", "GPU and parallel computing"],
      leadsTo: ["large-model training", "distributed optimization", "numerical debugging"],
      usedWith: ["conditioning", "loss scaling", "matrix multiplication", "stochastic gradients"]
    },
    motivation:
      "<p>You have now seen the whole practical chain: matrices, solvers, randomness, optimization, automatic differentiation, and parallel hardware. Modern ML training uses all of them at once. Mixed precision sits at the final handoff between math and machine.</p>" +
      "<p>Lower precision can make training dramatically faster and smaller, especially on GPUs. But float16 has a narrow numerical range. The wise move is not simply to use fewer bits; it is to know which quantities can be low precision, which must stay high precision, and when loss scaling protects gradients.</p>",
    definition:
      "<p><b>Mixed precision training</b> uses low-precision formats such as float16 or bfloat16 for many matrix operations while keeping sensitive quantities, often master weights and some reductions, in float32. Float16 has maximum finite value about $65504$ and smallest positive normal value about $6.10\\cdot10^{-5}$; bfloat16 has fewer mantissa bits but a wider exponent range like float32.</p>" +
      "<p><b>Loss scaling</b> multiplies the loss by a scale $S$ before backpropagation. Gradients are then multiplied by $S$, helping tiny float16 gradients avoid underflow. Before the optimizer update, gradients are divided by $S$ so the mathematical update is unchanged, unless overflow is detected.</p>" +
      "<p><b>Assumptions that matter:</b> low precision changes rounding error; reductions can accumulate error if not done carefully; overflow creates infinities and NaNs; underflow turns small values into zero; and stable training usually keeps master weights, optimizer states, and some normalization statistics in higher precision.</p>",
    worked: {
      problem: "A float16 training step has gradient $g=2.0\\cdot10^{-7}$, weight $w=1.0000$, learning rate $\\alpha=10^{-3}$, and loss scale $S=1024$. Show how scaling preserves the gradient and compute the float32 master-weight update.",
      skills: ["loss scaling", "underflow", "gradient descent", "ML stability"],
      strategy: "Scale before backward so the gradient is representable, then unscale before the optimizer update.",
      steps: [
        { do: "Compare the raw gradient to float16 normal scale", result: "$2.0\\cdot10^{-7}<6.10\\cdot10^{-5}$", why: "the raw gradient is below the smallest positive normal float16 value" },
        { do: "Scale the gradient", result: "$Sg=1024\\cdot2.0\\cdot10^{-7}=2.048\\cdot10^{-4}$", why: "loss scaling multiplies backpropagated gradients" },
        { do: "Check scaled representability", result: "$2.048\\cdot10^{-4}>6.10\\cdot10^{-5}$", why: "the scaled gradient is in the normal float16 range" },
        { do: "Unscale before the update", result: "$(2.048\\cdot10^{-4})/1024=2.0\\cdot10^{-7}$", why: "recover the intended gradient" },
        { do: "Compute the update size", result: "$\\alpha g=10^{-3}\\cdot2.0\\cdot10^{-7}=2.0\\cdot10^{-10}$", why: "gradient descent step magnitude" },
        { do: "Update the master weight", result: "$w_{new}=1.0000-2.0\\cdot10^{-10}=0.9999999998$", why: "float32 master weights can track tiny changes better than float16 weights" },
        { do: "Check overflow risk for the scaled gradient", result: "$2.048\\cdot10^{-4}\\ll65504$", why: "this scale is safe for this gradient" }
      ],
      verify: "Scaling changed the representation during backpropagation but not the mathematical gradient used by the optimizer.",
      answer: "With $S=1024$, the gradient becomes $2.048\\cdot10^{-4}$ during backward, unscales to $2.0\\cdot10^{-7}$, and updates the float32 master weight to $0.9999999998$.",
      connects: "Mixed precision succeeds when speedups are paired with explicit protection against underflow, overflow, and fragile accumulation."
    },
    practice: [
      { problem: "A float16 activation value $300$ is multiplied by weight $250$. Does the product overflow float16's maximum finite value $65504$?", steps: [
        { do: "Multiply the values", result: "$300\\cdot250=75,000$", why: "compute the product before storage" },
        { do: "Write the float16 maximum", result: "$65,504$", why: "given range limit" },
        { do: "Compare", result: "$75,000>65,504$", why: "the product exceeds the maximum" },
        { do: "Classify the result", result: "overflow", why: "float16 cannot represent this finite value" },
        { do: "Name the symptom", result: "infinity or NaN can appear downstream", why: "overflow contaminates later arithmetic" }
      ], answer: "Yes. The product $75,000$ exceeds $65,504$, so it overflows float16." },
      { problem: "Gradients $[3\\cdot10^{-8},8\\cdot10^{-8},2\\cdot10^{-7}]$ are scaled by $S=2048$. Compute the scaled gradients.", steps: [
        { do: "Scale the first gradient", result: "$2048\\cdot3\\cdot10^{-8}=6.144\\cdot10^{-5}$", why: "multiply by the loss scale" },
        { do: "Scale the second gradient", result: "$2048\\cdot8\\cdot10^{-8}=1.6384\\cdot10^{-4}$", why: "same scale" },
        { do: "Scale the third gradient", result: "$2048\\cdot2\\cdot10^{-7}=4.096\\cdot10^{-4}$", why: "same scale" },
        { do: "Compare to float16 normal threshold", result: "all are at or above about $6.10\\cdot10^{-5}$", why: "scaling lifted them into normal range" },
        { do: "State unscale rule", result: "divide each by $2048$ before the update", why: "preserve the intended optimizer step" }
      ], answer: "The scaled gradients are $6.144\\cdot10^{-5}$, $1.6384\\cdot10^{-4}$, and $4.096\\cdot10^{-4}$." },
      { problem: "A dynamic loss scaler uses $S=4096$. A batch produces maximum scaled gradient $80,000$. Should the step be applied if float16 max is $65,504$? What new scale might be tried by halving?", steps: [
        { do: "Compare maximum scaled gradient", result: "$80,000>65,504$", why: "overflow threshold is exceeded" },
        { do: "Decide on the optimizer step", result: "skip the step", why: "overflowed gradients are not trustworthy" },
        { do: "Halve the loss scale", result: "$4096/2=2048$", why: "dynamic scaling backs off" },
        { do: "Estimate new maximum if gradients are same", result: "$80,000/2=40,000$", why: "halving scale halves scaled gradients" },
        { do: "Compare again", result: "$40,000<65,504$", why: "the reduced scale would likely avoid overflow" }
      ], answer: "Skip the step and try scale $2048$; the same gradients would scale to about $40,000$, below float16 max." },
      { problem: "A dot product sums $1024$ terms, each about $0.01$. Estimate the sum and explain why float32 accumulation is safer than float16 accumulation.", steps: [
        { do: "Compute the exact-scale sum", result: "$1024\\cdot0.01=10.24$", why: "all terms have the same approximate size" },
        { do: "Note the accumulation count", result: "$1024$ additions", why: "many roundings can accumulate" },
        { do: "Compare precision roles", result: "float16 stores fewer significant bits", why: "rounding error per addition is larger" },
        { do: "Choose accumulation type", result: "float32 accumulator", why: "higher precision reduces summation error" },
        { do: "State the practical pattern", result: "multiply in low precision, accumulate in float32", why: "common tensor-core strategy" }
      ], answer: "The sum is about $10.24$; float32 accumulation is safer because $1024$ low-precision additions can accumulate noticeable rounding error." },
      { problem: "An Adam optimizer keeps first moment $m=10^{-5}$ and second moment $v=10^{-10}$. Explain why storing optimizer state in float32 is safer, and compute the unscaled update direction $m/(\\sqrt v+10^{-8})$.", steps: [
        { do: "Compute the square root", result: "$\\sqrt{10^{-10}}=10^{-5}$", why: "second moment scale" },
        { do: "Add epsilon", result: "$10^{-5}+10^{-8}=1.001\\cdot10^{-5}$", why: "avoid division by zero and stabilize" },
        { do: "Divide", result: "$10^{-5}/(1.001\\cdot10^{-5})\\approx0.999$", why: "Adam normalizes by RMS gradient" },
        { do: "Assess state magnitudes", result: "$10^{-10}$ is very small", why: "low precision may underflow or lose detail" },
        { do: "Choose storage", result: "keep optimizer state in float32", why: "moments need dynamic range and precision" }
      ], answer: "The update direction is about $0.999$; storing $m$ and especially $v$ in float32 is safer for range and precision." }
    ],
    applications: [
      { title: "Transformer training throughput", background: "Large transformers are dominated by matrix multiplications. Tensor cores can run float16 or bfloat16 matrix multiplies much faster than float32 on supported GPUs.", numbers: "If a step falls from $800$ ms in float32 to $320$ ms mixed precision, speedup is $800/320=2.5$ times." },
      { title: "Memory capacity for larger batches", background: "Lower-precision activations and gradients reduce memory use, letting practitioners use larger batches or longer sequences.", numbers: "A tensor with $1$ billion values uses about $4$ GB in float32 and $2$ GB in float16, saving $2$ GB." },
      { title: "Loss scaling for tiny gradients", background: "Backpropagation can produce gradients far below float16's normal range. Loss scaling lifts them during backward without changing the final update.", numbers: "A gradient $5\\cdot10^{-8}$ scaled by $4096$ becomes $2.048\\cdot10^{-4}$, then unscales back to $5\\cdot10^{-8}$." },
      { title: "Overflow detection", background: "Mixed precision training loops commonly check gradients for infinity or NaN before applying an optimizer step.", numbers: "If scale $8192$ makes a maximum gradient $100,000$, halving to $4096$ would make the same value about $50,000$, below $65,504$." },
      { title: "Float32 master weights", background: "Very small learning-rate updates may not change a float16-stored weight near $1$. Master weights preserve small accumulated changes.", numbers: "An update of $2\\cdot10^{-5}$ is far below float16 spacing near $1$ of roughly $9.77\\cdot10^{-4}$, but float32 can represent its effect." },
      { title: "bfloat16 range advantage", background: "bfloat16 keeps an 8-bit exponent like float32, so it is less prone to overflow than float16 but has fewer mantissa bits.", numbers: "A value $10^{20}$ is impossible in float16 but within bfloat16's broad exponent range, though with coarse relative precision." },
      { title: "Stable softmax and normalization", background: "Even in mixed precision, numerically stable formulas remain essential. Subtracting the maximum logit protects exponentials.", numbers: "Logits $[1000,999]$ become $[0,-1]$ after subtracting $1000$, so softmax uses $e^0=1$ and $e^{-1}\\approx0.368$ instead of overflowing." }
    ],
    applicationsClose: "The capstone habit is clear: use faster arithmetic where structure allows it, and protect the quantities that carry training stability.",
    takeaways: [
      "Mixed precision uses low precision for speed and memory, while keeping sensitive state in higher precision.",
      "Loss scaling helps tiny gradients avoid float16 underflow and must be undone before the optimizer update.",
      "Overflow, underflow, accumulation error, and optimizer-state precision are the main stability risks.",
      "A strong ML training system combines numerical methods, automatic differentiation, parallel hardware, and careful floating-point judgment."
    ]
  }
};
