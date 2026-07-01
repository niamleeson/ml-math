module.exports = {
  "math-05-12": {
    "id": "math-05-12",
    "title": "Operator norms",
    "tagline": "An operator norm measures the largest stretch a linear map can apply to a unit input.",
    "connections": {
      "buildsOn": [
        "normed vector spaces",
        "linear maps",
        "Cauchy-Schwarz inequality"
      ],
      "leadsTo": [
        "dual spaces",
        "compact operators",
        "spectral theory"
      ],
      "usedWith": [
        "matrix norms",
        "singular values",
        "Lipschitz constants"
      ]
    },
    "motivation": "<p>You already measure vectors by length. Operator norms ask the next natural question: how much can a linear map enlarge that length?</p><p>The answer is a worst-case stretch over unit inputs. That single number lets you bound errors, gradients, perturbations, and stability with calm confidence.</p>",
    "definition": "<p>For a linear map $A:X\\to Y$ between normed spaces, the <b>operator norm</b> is $$\\|A\\|=\\sup_{x\\ne0}\\frac{\\|Ax\\|_Y}{\\|x\\|_X}=\\sup_{\\|x\\|_X=1}\\|Ax\\|_Y.$$ The two forms agree because any nonzero $x$ can be written as $\\|x\\|u$ with $\\|u\\|=1$.</p><p><b>Assumptions that matter:</b> the map is linear, the domain and codomain norms are fixed, and a finite operator norm is exactly boundedness for a linear operator.</p>",
    "worked": {
      "problem": "Find the Euclidean operator norm of $A=\\begin{pmatrix}3&0\\\\0&2\\end{pmatrix}$.",
      "skills": [
        "unit vectors",
        "matrix stretch",
        "maximization"
      ],
      "strategy": "Write a unit vector and maximize the squared output length.",
      "steps": [
        {
          "do": "Let $x=(u,v)$ be unit",
          "result": "$u^2+v^2=1$",
          "why": "operator norms test unit inputs"
        },
        {
          "do": "Apply the matrix",
          "result": "$Ax=(3u,2v)$",
          "why": "the diagonal entries scale coordinates"
        },
        {
          "do": "Square the output norm",
          "result": "$\\|Ax\\|^2=9u^2+4v^2$",
          "why": "squaring removes the square root"
        },
        {
          "do": "Use $v^2=1-u^2$",
          "result": "$\\|Ax\\|^2=4+5u^2$",
          "why": "one variable remains"
        },
        {
          "do": "Maximize over $0\\le u^2\\le1$",
          "result": "$\\|Ax\\|^2\\le9$",
          "why": "the largest value occurs at $u^2=1$"
        },
        {
          "do": "Take the square root",
          "result": "$\\|A\\|=3$",
          "why": "the operator norm is the length, not its square"
        }
      ],
      "verify": "The unit vector $(1,0)$ maps to $(3,0)$, so stretch $3$ is actually attained.",
      "answer": "$\\|A\\|_2=3$.",
      "connects": "The norm records the largest stretch direction."
    },
    "practice": [
      {
        "problem": "Find $\\|\\operatorname{diag}(2,1)\\|_2$.",
        "steps": [
          {
            "do": "Let $x=(u,v)$ be unit",
            "result": "$u^2+v^2=1$",
            "why": "start with the unit sphere"
          },
          {
            "do": "Apply the matrix",
            "result": "$(2u,v)$",
            "why": "coordinate scaling"
          },
          {
            "do": "Square the output",
            "result": "$4u^2+v^2$",
            "why": "Euclidean norm"
          },
          {
            "do": "Substitute $v^2=1-u^2$",
            "result": "$1+3u^2$",
            "why": "one variable"
          },
          {
            "do": "Maximize",
            "result": "$1+3u^2\\le4$",
            "why": "$u^2$ is at most $1$"
          },
          {
            "do": "Take the square root",
            "result": "$2$",
            "why": "largest output length"
          }
        ],
        "answer": "$2$."
      },
      {
        "problem": "For $T(x)=5x$ on $\\mathbb{R}$, find $\\|T\\|$.",
        "steps": [
          {
            "do": "Write the ratio",
            "result": "$|T(x)|/|x|=|5x|/|x|$",
            "why": "definition for $x\\ne0"
          },
          {
            "do": "Factor the absolute value",
            "result": "$5|x|/|x|$",
            "why": "$5$ is positive"
          },
          {
            "do": "Cancel",
            "result": "$5$",
            "why": "$x\\ne0$"
          },
          {
            "do": "Take the supremum",
            "result": "$5$",
            "why": "the ratio is constant"
          },
          {
            "do": "Check a unit input",
            "result": "$|T(1)|=5$",
            "why": "the bound is attained"
          }
        ],
        "answer": "$\\|T\\|=5$."
      },
      {
        "problem": "If $\\|A\\|=4$ and $\\|x\\|=0.3$, bound $\\|Ax\\|$.",
        "steps": [
          {
            "do": "Start with the operator inequality",
            "result": "$\\|Ax\\|\\le\\|A\\|\\|x\\|$",
            "why": "definition of norm"
          },
          {
            "do": "Substitute $\\|A\\|$",
            "result": "$\\|Ax\\|\\le4\\|x\\|$",
            "why": "given value"
          },
          {
            "do": "Substitute $\\|x\\|$",
            "result": "$\\|Ax\\|\\le4(0.3)$",
            "why": "given input size"
          },
          {
            "do": "Multiply",
            "result": "$1.2$",
            "why": "arithmetic"
          },
          {
            "do": "State the result",
            "result": "$\\|Ax\\|\\le1.2$",
            "why": "worst-case bound"
          }
        ],
        "answer": "At most $1.2$."
      },
      {
        "problem": "Find the $\\ell_1$ operator norm of $A=\\begin{pmatrix}1&-3\\\\2&4\\end{pmatrix}$.",
        "steps": [
          {
            "do": "Recall the $\\ell_1$ formula",
            "result": "$\\|A\\|_1=$ maximum absolute column sum",
            "why": "matrix norm fact"
          },
          {
            "do": "Sum column 1",
            "result": "$|1|+|2|=3$",
            "why": "absolute column sum"
          },
          {
            "do": "Sum column 2",
            "result": "$|-3|+|4|=7$",
            "why": "absolute column sum"
          },
          {
            "do": "Take the maximum",
            "result": "$7$",
            "why": "worst column"
          },
          {
            "do": "Check the selecting vector",
            "result": "$x=(0,1)$",
            "why": "it picks column 2"
          }
        ],
        "answer": "$\\|A\\|_1=7$."
      },
      {
        "problem": "A layer has $\\|W\\|=1.8$. If inputs differ by $0.05$, bound the output difference.",
        "steps": [
          {
            "do": "Name the difference",
            "result": "$d=x-y$",
            "why": "compare two inputs"
          },
          {
            "do": "Use linearity",
            "result": "$Wx-Wy=Wd$",
            "why": "subtract outputs"
          },
          {
            "do": "Apply the norm bound",
            "result": "$\\|Wd\\|\\le1.8\\|d\\|$",
            "why": "operator norm"
          },
          {
            "do": "Substitute",
            "result": "$1.8(0.05)$",
            "why": "given difference"
          },
          {
            "do": "Multiply",
            "result": "$0.09$",
            "why": "numeric result"
          }
        ],
        "answer": "The outputs differ by at most $0.09$."
      }
    ],
    "applications": [
      {
        "title": "Neural-network sensitivity",
        "background": "A linear layer cannot amplify perturbations by more than its operator norm.",
        "numbers": "If $\\|W\\|=2.5$ and $\\|\\Delta x\\|=0.04$, then $\\|W\\Delta x\\|\\le0.10$."
      },
      {
        "title": "Adversarial robustness",
        "background": "Worst-case score movement begins with bounding each layer's stretch.",
        "numbers": "A norm-$3$ score layer maps an input change $0.01$ to at most $0.03$."
      },
      {
        "title": "Gradient descent stability",
        "background": "Smoothness constants are often operator norms of Hessians or Jacobians.",
        "numbers": "If $\\|H\\|=8$, a basic safe step scale is about $1/8=0.125$."
      },
      {
        "title": "Feature scaling",
        "background": "Preprocessing can stretch some directions much more than others.",
        "numbers": "Scaling coordinates by $10$ and $0.5$ has Euclidean operator norm $10$."
      },
      {
        "title": "Numerical error",
        "background": "Matrix computations propagate roundoff according to operator norms.",
        "numbers": "With $\\|A\\|=6$ and input error $0.0002$, output error is at most $0.0012$."
      },
      {
        "title": "Attention projections",
        "background": "Query and key projections are linear maps before attention scores are formed.",
        "numbers": "If $\\|W_Q\\|=1.2$ and $\\|x\\|=5$, then $\\|q\\|\\le6$."
      }
    ],
    "applicationsClose": "Operator norms are stretch meters: one number controls amplification, stability, and perturbation size.",
    "takeaways": [
      "$\\|A\\|=\\sup_{\\|x\\|=1}\\|Ax\\|$.",
      "Finite operator norm means a linear map is bounded.",
      "The chosen vector norms matter.",
      "Euclidean matrix operator norms are largest singular values."
    ]
  },
  "math-05-13": {
    "id": "math-05-13",
    "title": "Dual spaces",
    "tagline": "The dual space collects all continuous linear measurements you can make on vectors.",
    "connections": {
      "buildsOn": [
        "linear functionals",
        "operator norms",
        "inner products"
      ],
      "leadsTo": [
        "Hahn-Banach theorem",
        "weak convergence",
        "RKHS"
      ],
      "usedWith": [
        "dual norms",
        "gradients",
        "basis coordinates"
      ]
    },
    "motivation": "<p>A coordinate, a dot product with a weight vector, and a directional derivative all do the same kind of thing: they measure a vector linearly.</p><p>The <b>dual space</b> gathers every continuous linear measurement into one space, so we can reason about observers as carefully as we reason about the objects observed.</p>",
    "definition": "<p>For a normed space $X$, the <b>dual space</b> $X^\\ast$ is the space of continuous linear functionals $f:X\\to\\mathbb{R}$ or $\\mathbb{C}$. Its norm is $$\\|f\\|=\\sup_{\\|x\\|\\le1}|f(x)|.$$ In a Hilbert space, each vector $a$ gives $f_a(x)=\\langle x,a\\rangle$, with $\\|f_a\\|=\\|a\\|$.</p><p><b>Assumptions that matter:</b> the functionals are linear and continuous, the norm on $X$ determines the dual norm, and identifying functionals with vectors requires inner-product structure.</p>",
    "worked": {
      "problem": "On Euclidean $\\mathbb{R}^2$, find the norm of $f(x,y)=3x-4y$.",
      "skills": [
        "linear functionals",
        "dual norm",
        "Cauchy-Schwarz"
      ],
      "strategy": "Represent the functional as a dot product with its coefficient vector.",
      "steps": [
        {
          "do": "Write the coefficient vector",
          "result": "$a=(3,-4)$",
          "why": "the functional is a dot product"
        },
        {
          "do": "Rewrite the functional",
          "result": "$f(z)=\\langle z,a\\rangle$",
          "why": "where $z=(x,y)$"
        },
        {
          "do": "Apply Cauchy-Schwarz",
          "result": "$|f(z)|\\le\\|z\\|\\|a\\|$",
          "why": "inner products are bounded"
        },
        {
          "do": "Restrict to the unit ball",
          "result": "$|f(z)|\\le\\|a\\|$",
          "why": "dual norm tests $\\|z\\|\\le1$"
        },
        {
          "do": "Compute the coefficient norm",
          "result": "$\\sqrt{3^2+(-4)^2}=5$",
          "why": "Euclidean length"
        },
        {
          "do": "Choose the attaining vector",
          "result": "$z=a/5$",
          "why": "alignment gives equality"
        }
      ],
      "verify": "At $z=(3/5,-4/5)$, the value is $9/5+16/5=5$.",
      "answer": "$\\|f\\|=5$.",
      "connects": "Dual norms measure the largest possible reading on the unit ball."
    },
    "practice": [
      {
        "problem": "Find the Euclidean dual norm of $f(x,y)=x+y$.",
        "steps": [
          {
            "do": "Identify coefficients",
            "result": "$a=(1,1)$",
            "why": "dot-product form"
          },
          {
            "do": "Use the Hilbert dual rule",
            "result": "$\\|f\\|=\\|a\\|$",
            "why": "Riesz representation"
          },
          {
            "do": "Compute the square",
            "result": "$1^2+1^2=2$",
            "why": "Euclidean norm"
          },
          {
            "do": "Take the square root",
            "result": "$\\sqrt2$",
            "why": "length of $a$"
          },
          {
            "do": "Check direction",
            "result": "$(1/\\sqrt2,1/\\sqrt2)$",
            "why": "unit vector attaining the value"
          }
        ],
        "answer": "$\\sqrt2$."
      },
      {
        "problem": "On $\\ell_1^2$, find the dual norm of $f(x,y)=2x-5y$.",
        "steps": [
          {
            "do": "Recall the dual of $\\ell_1^2$",
            "result": "$\\ell_\\infty^2$",
            "why": "coefficients use max norm"
          },
          {
            "do": "List absolute coefficients",
            "result": "$2$ and $5$",
            "why": "absolute values"
          },
          {
            "do": "Take the maximum",
            "result": "$5$",
            "why": "largest coefficient controls the unit ball"
          },
          {
            "do": "Choose an input",
            "result": "$(0,-1)$",
            "why": "it has $\\ell_1$ norm $1$"
          },
          {
            "do": "Evaluate",
            "result": "$f(0,-1)=5$",
            "why": "the bound is reached"
          }
        ],
        "answer": "$5$."
      },
      {
        "problem": "If $f(x)=\\langle x,a\\rangle$, $\\|a\\|=7$, and $\\|x\\|=0.2$, bound $|f(x)|$.",
        "steps": [
          {
            "do": "Apply Cauchy-Schwarz",
            "result": "$|f(x)|\\le\\|x\\|\\|a\\|$",
            "why": "inner-product bound"
          },
          {
            "do": "Substitute $\\|x\\|$",
            "result": "$0.2\\|a\\|$",
            "why": "given size"
          },
          {
            "do": "Substitute $\\|a\\|$",
            "result": "$0.2\\cdot7$",
            "why": "given functional norm"
          },
          {
            "do": "Multiply",
            "result": "$1.4$",
            "why": "arithmetic"
          },
          {
            "do": "State the bound",
            "result": "$|f(x)|\\le1.4$",
            "why": "largest reading"
          }
        ],
        "answer": "At most $1.4$."
      },
      {
        "problem": "Find $\\|f\\|$ for $f(x_1,x_2,x_3)=x_1-2x_2+2x_3$ on Euclidean $\\mathbb{R}^3$.",
        "steps": [
          {
            "do": "Write coefficients",
            "result": "$a=(1,-2,2)$",
            "why": "dot-product vector"
          },
          {
            "do": "Use Euclidean duality",
            "result": "$\\|f\\|=\\|a\\|$",
            "why": "Hilbert-space identification"
          },
          {
            "do": "Square entries",
            "result": "$1+4+4$",
            "why": "sum of squares"
          },
          {
            "do": "Add",
            "result": "$9$",
            "why": "arithmetic"
          },
          {
            "do": "Take the square root",
            "result": "$3$",
            "why": "dual norm"
          }
        ],
        "answer": "$3$."
      },
      {
        "problem": "A gradient $g=(0.6,-0.8)$ acts as $df(h)=g\\cdot h$. Find the largest $|df(h)|$ for $\\|h\\|\\le0.05$.",
        "steps": [
          {
            "do": "Compute gradient norm",
            "result": "$\\sqrt{0.36+0.64}=1$",
            "why": "dual norm"
          },
          {
            "do": "Use the dual bound",
            "result": "$|df(h)|\\le\\|g\\|\\|h\\|$",
            "why": "functional inequality"
          },
          {
            "do": "Substitute",
            "result": "$1\\cdot0.05$",
            "why": "allowed radius"
          },
          {
            "do": "Simplify",
            "result": "$0.05$",
            "why": "largest value"
          },
          {
            "do": "Choose direction",
            "result": "$h=0.05g$",
            "why": "alignment attains increase"
          }
        ],
        "answer": "The largest absolute first-order change is $0.05$."
      }
    ],
    "applications": [
      {
        "title": "Gradients",
        "background": "A derivative is a linear functional that reads a small move and returns first-order loss change.",
        "numbers": "For $g=(3,4)$ and $h=(0.01,0)$, $df(h)=0.03$ and $\\|df\\|=5$."
      },
      {
        "title": "Linear probes",
        "background": "A probe reads an embedding by applying a dual vector.",
        "numbers": "$a=(1,-1,2)$ on $(0.5,0.2,0.1)$ returns $0.5$."
      },
      {
        "title": "Sensitivity",
        "background": "Dual norms turn perturbation budgets into score-change bounds.",
        "numbers": "For $w=(2,-3,1)$ and $\\ell_\\infty$ radius $0.01$, the bound is $0.01\\|w\\|_1=0.06$."
      },
      {
        "title": "Constraints",
        "background": "Linear constraints in optimization are dual-space objects.",
        "numbers": "The constraint differential $h_1+2h_2$ has Euclidean norm $\\sqrt5\\approx2.236$."
      },
      {
        "title": "Expectations",
        "background": "Expectation is a linear functional on random variables.",
        "numbers": "If $|X|\\le3$, then $|E[X]|\\le3$."
      },
      {
        "title": "Model scores",
        "background": "A linear classifier score is a dual pairing between weights and features.",
        "numbers": "With $w=(0.2,-0.5)$ and $x=(10,4)$, the score is $0$."
      }
    ],
    "applicationsClose": "Dual spaces make measurement mathematical, from gradients to probes to optimization certificates.",
    "takeaways": [
      "The dual space contains continuous linear functionals.",
      "The dual norm is $\\sup_{\\|x\\|\\le1}|f(x)|$.",
      "Inner products identify Hilbert spaces with their duals.",
      "Changing the primal norm changes the dual norm."
    ]
  },
  "math-05-14": {
    "id": "math-05-14",
    "title": "The Hahn–Banach theorem",
    "tagline": "Hahn-Banach extends bounded linear measurements without increasing their norm.",
    "connections": {
      "buildsOn": [
        "dual spaces",
        "linear subspaces",
        "operator norms"
      ],
      "leadsTo": [
        "weak convergence",
        "separation theorems",
        "convex duality"
      ],
      "usedWith": [
        "linear functionals",
        "normed spaces",
        "convex sets"
      ]
    },
    "motivation": "<p>Sometimes a measurement is defined only on a smaller subspace. The hopeful question is whether it can be extended consistently to the whole space.</p><p><b>Hahn-Banach</b> says that bounded linear measurements can be extended without becoming larger. It is a quiet engine behind separation, duality, and the abundance of linear witnesses.</p>",
    "definition": "<p>If $M$ is a linear subspace of a real normed space $X$ and $f:M\\to\\mathbb{R}$ is bounded and linear, then there is a bounded linear $F:X\\to\\mathbb{R}$ with $F|_M=f$ and $\\|F\\|=\\|f\\|$. Related real, complex, and dominated-sublinear versions carry the same extension idea.</p><p><b>Assumptions that matter:</b> the starting map is linear on a subspace, boundedness is measured by the given norm, the extension is not usually unique, and the theorem guarantees existence rather than a simple formula in every setting.</p>",
    "worked": {
      "problem": "Let $M=\\{(t,0):t\\in\\mathbb{R}\\}$ and $f(t,0)=2t$ in Euclidean $\\mathbb{R}^2$. Give a norm-preserving extension.",
      "skills": [
        "subspaces",
        "functional norms",
        "extensions"
      ],
      "strategy": "Compute the norm on the line and choose a full-space functional with the same size.",
      "steps": [
        {
          "do": "Compute the ratio on $M$",
          "result": "$|2t|/\\|(t,0)\\|=|2t|/|t|$",
          "why": "use nonzero vectors"
        },
        {
          "do": "Simplify",
          "result": "$2$",
          "why": "the $|t|$ cancels"
        },
        {
          "do": "State the subspace norm",
          "result": "$\\|f\\|=2$",
          "why": "constant ratio"
        },
        {
          "do": "Define the extension",
          "result": "$F(x,y)=2x$",
          "why": "it agrees when $y=0$"
        },
        {
          "do": "Find its coefficient vector",
          "result": "$(2,0)$",
          "why": "Euclidean dual vector"
        },
        {
          "do": "Compute its norm",
          "result": "$2$",
          "why": "no increase"
        }
      ],
      "verify": "For every $(t,0)$, $F(t,0)=2t=f(t,0)$ and both norms are $2$.",
      "answer": "$F(x,y)=2x$ is a norm-preserving extension.",
      "connects": "Hahn-Banach guarantees this kind of extension even when the space is not two-dimensional."
    },
    "practice": [
      {
        "problem": "Extend $f(0,t)=-3t$ from the $y$-axis to Euclidean $\\mathbb{R}^2$ without norm increase.",
        "steps": [
          {
            "do": "Compute the subspace ratio",
            "result": "$|-3t|/|t|$",
            "why": "nonzero points on the axis"
          },
          {
            "do": "Simplify",
            "result": "$3$",
            "why": "absolute value"
          },
          {
            "do": "Define an extension",
            "result": "$F(x,y)=-3y$",
            "why": "agrees on $x=0$"
          },
          {
            "do": "Compute coefficient norm",
            "result": "$\\|(0,-3)\\|=3$",
            "why": "Euclidean dual norm"
          },
          {
            "do": "Compare norms",
            "result": "$3=3$",
            "why": "norm preserved"
          }
        ],
        "answer": "$F(x,y)=-3y$."
      },
      {
        "problem": "For $M=\\operatorname{span}\\{(1,1)\\}$ and $f(t,t)=4t$, find a minimum-norm Euclidean extension.",
        "steps": [
          {
            "do": "Compute input norm",
            "result": "$\\|(t,t)\\|=\\sqrt2|t|$",
            "why": "length on the diagonal"
          },
          {
            "do": "Compute subspace norm",
            "result": "$|4t|/(\\sqrt2|t|)=2\\sqrt2$",
            "why": "ratio"
          },
          {
            "do": "Set $F(x,y)=ax+by$",
            "result": "$a+b=4$",
            "why": "agreement on $(t,t)$"
          },
          {
            "do": "Choose shortest coefficients",
            "result": "$a=b=2$",
            "why": "equal split minimizes length"
          },
          {
            "do": "Compute norm",
            "result": "$\\sqrt{2^2+2^2}=2\\sqrt2$",
            "why": "matches subspace norm"
          }
        ],
        "answer": "$F(x,y)=2x+2y$."
      },
      {
        "problem": "Why is $G(x,y)=12x-8y$ an extension in the previous problem but not norm-preserving?",
        "steps": [
          {
            "do": "Check agreement",
            "result": "$G(t,t)=12t-8t=4t$",
            "why": "it extends $f$"
          },
          {
            "do": "Compute coefficient norm",
            "result": "$\\sqrt{12^2+(-8)^2}$",
            "why": "Euclidean dual norm"
          },
          {
            "do": "Simplify",
            "result": "$\\sqrt{208}$",
            "why": "arithmetic"
          },
          {
            "do": "Compare",
            "result": "$\\sqrt{208}>2\\sqrt2$",
            "why": "larger than the minimal norm"
          },
          {
            "do": "State the issue",
            "result": "extension yes, norm-preserving no",
            "why": "Hahn-Banach promises a better one"
          }
        ],
        "answer": "It agrees on the subspace but its norm is too large."
      },
      {
        "problem": "If $\\|f\\|=6$ on a subspace, what extension norm is guaranteed?",
        "steps": [
          {
            "do": "Name the data",
            "result": "$\\|f\\|=6$",
            "why": "given"
          },
          {
            "do": "Apply Hahn-Banach",
            "result": "$F|_M=f$",
            "why": "extension exists"
          },
          {
            "do": "Use norm preservation",
            "result": "$\\|F\\|=\\|f\\|$",
            "why": "the theorem's key point"
          },
          {
            "do": "Substitute",
            "result": "$\\|F\\|=6$",
            "why": "given norm"
          },
          {
            "do": "Interpret",
            "result": "no norm increase",
            "why": "same boundedness"
          }
        ],
        "answer": "There is an extension with norm $6$."
      },
      {
        "problem": "A score is known on $(t,t)$ as $s(t,t)=t$. Find the minimum-norm linear score on $\\mathbb{R}^2$.",
        "steps": [
          {
            "do": "Write $S(x,y)=ax+by$",
            "result": "$a+b=1$",
            "why": "agreement condition"
          },
          {
            "do": "Minimize coefficient length",
            "result": "$a=b=1/2$",
            "why": "equal split"
          },
          {
            "do": "Write the extension",
            "result": "$S(x,y)=(x+y)/2$",
            "why": "substitute coefficients"
          },
          {
            "do": "Compute its norm",
            "result": "$\\sqrt{1/4+1/4}=1/\\sqrt2$",
            "why": "Euclidean dual norm"
          },
          {
            "do": "Check on the line",
            "result": "$S(t,t)=t$",
            "why": "agreement"
          }
        ],
        "answer": "$S(x,y)=(x+y)/2$."
      }
    ],
    "applications": [
      {
        "title": "Separating hyperplanes",
        "background": "Hahn-Banach supports theorems that separate points from convex sets.",
        "numbers": "The unit disk and point $(3,0)$ are separated by $F(x,y)=x$: values are at most $1$ on the disk and $3$ at the point."
      },
      {
        "title": "Support vector machines",
        "background": "Maximum-margin classifiers use separating hyperplane geometry.",
        "numbers": "If projections differ by $2$, a unit normal gives margin $1$ on each side."
      },
      {
        "title": "Dual certificates",
        "background": "Optimization can prove optimality with a linear witness.",
        "numbers": "If every feasible $x$ has $c\\cdot x\\le10$ and one reaches $10$, optimality is certified."
      },
      {
        "title": "Norm witnesses",
        "background": "The theorem implies enough functionals exist to detect vector norms.",
        "numbers": "For $x=(3,4)$, $F(z)=\\langle z,x/5\\rangle$ has norm $1$ and $F(x)=5$."
      },
      {
        "title": "Regularization",
        "background": "Dual norms describe certificates for sparse or robust solutions.",
        "numbers": "For $w=(2,-1,0)$, $\\|w\\|_\\infty=2$ is the dual norm to $\\ell_1$."
      },
      {
        "title": "Fairness penalties",
        "background": "Linear measurements of gaps can become terms in larger objectives.",
        "numbers": "A gap $0.04$ with multiplier $25$ contributes $1.0$ to a Lagrangian."
      }
    ],
    "applicationsClose": "Hahn-Banach is an extension and witness theorem: it ensures linear measurements are plentiful enough for analysis.",
    "takeaways": [
      "Bounded functionals on subspaces can be extended.",
      "The extension can preserve the norm.",
      "Extensions need not be unique.",
      "Separation and convex duality grow from this idea."
    ]
  },
  "math-05-15": {
    "id": "math-05-15",
    "title": "Weak convergence",
    "tagline": "Weak convergence watches every continuous linear measurement instead of demanding full norm closeness.",
    "connections": {
      "buildsOn": [
        "dual spaces",
        "sequences",
        "inner products"
      ],
      "leadsTo": [
        "compact operators",
        "spectral theorem",
        "RKHS"
      ],
      "usedWith": [
        "bounded sequences",
        "Hilbert spaces",
        "linear functionals"
      ]
    },
    "motivation": "<p>Norm convergence asks vectors to become close in length. Weak convergence asks a gentler question: does every continuous linear observer see convergence?</p><p>This is powerful in infinite dimensions, where sequences may keep moving while all fixed measurements settle down.</p>",
    "definition": "<p>A sequence $x_n$ in a normed space $X$ <b>converges weakly</b> to $x$, written $x_n\\rightharpoonup x$, if $f(x_n)\\to f(x)$ for every $f\\in X^\\ast$. In a Hilbert space this becomes $\\langle x_n,y\\rangle\\to\\langle x,y\\rangle$ for every fixed $y$.</p><p><b>Assumptions that matter:</b> the continuous dual determines the tests, norm convergence implies weak convergence, and in infinite dimensions weak convergence can be strictly weaker than norm convergence.</p>",
    "worked": {
      "problem": "In $\\ell_2$, show that the standard basis vectors $e_n$ converge weakly to $0$ but not in norm.",
      "skills": [
        "inner products",
        "sequence limits",
        "norms"
      ],
      "strategy": "Test against a fixed vector, then compare lengths.",
      "steps": [
        {
          "do": "Fix $y\\in\\ell_2$",
          "result": "$y=(y_1,y_2,\\ldots)$",
          "why": "weak convergence uses fixed tests"
        },
        {
          "do": "Compute the inner product",
          "result": "$\\langle e_n,y\\rangle=y_n$",
          "why": "only coordinate $n$ remains"
        },
        {
          "do": "Use square summability",
          "result": "$y_n\\to0$",
          "why": "terms of a convergent square-sum vanish"
        },
        {
          "do": "Conclude weak convergence",
          "result": "$\\langle e_n,y\\rangle\\to0$ for every $y$",
          "why": "Hilbert-space criterion"
        },
        {
          "do": "Compute norms",
          "result": "$\\|e_n\\|=1$",
          "why": "one nonzero coordinate"
        },
        {
          "do": "Compare to norm convergence",
          "result": "$\\|e_n-0\\|=1\\not\\to0$",
          "why": "norm convergence fails"
        }
      ],
      "verify": "The vectors keep full length but move into fresh coordinates, so fixed observers see them fade.",
      "answer": "$e_n\\rightharpoonup0$ but $e_n$ does not converge to $0$ in norm.",
      "connects": "Weak convergence is convergence through all continuous linear measurements."
    },
    "practice": [
      {
        "problem": "Show norm convergence implies weak convergence.",
        "steps": [
          {
            "do": "Choose $f\\in X^\\ast$",
            "result": "$f$ is bounded",
            "why": "continuous linear functional"
          },
          {
            "do": "Use linearity",
            "result": "$f(x_n)-f(x)=f(x_n-x)$",
            "why": "subtract readings"
          },
          {
            "do": "Apply boundedness",
            "result": "$|f(x_n-x)|\\le\\|f\\|\\|x_n-x\\|$",
            "why": "dual norm bound"
          },
          {
            "do": "Take the limit",
            "result": "$\\|f\\|\\|x_n-x\\|\\to0$",
            "why": "norm convergence is given"
          },
          {
            "do": "Conclude",
            "result": "$f(x_n)\\to f(x)$",
            "why": "every observer agrees"
          }
        ],
        "answer": "Norm convergence implies weak convergence."
      },
      {
        "problem": "In $\\mathbb{R}^2$, find the weak limit of $(1/n,2+1/n)$.",
        "steps": [
          {
            "do": "Take coordinate limits",
            "result": "$1/n\\to0$ and $2+1/n\\to2$",
            "why": "ordinary convergence"
          },
          {
            "do": "State norm limit",
            "result": "$(0,2)$",
            "why": "finite-dimensional vector limit"
          },
          {
            "do": "Use finite-dimensional agreement",
            "result": "weak limit is also $(0,2)$",
            "why": "weak and norm convergence agree"
          },
          {
            "do": "Check a probe",
            "result": "$a\\cdot x_n\\to a\\cdot(0,2)$",
            "why": "dot products are continuous"
          },
          {
            "do": "State result",
            "result": "$(0,2)$",
            "why": "the limit vector"
          }
        ],
        "answer": "$(0,2)$."
      },
      {
        "problem": "Does $(-1)^n$ converge weakly in $\\mathbb{R}$?",
        "steps": [
          {
            "do": "Use the identity functional",
            "result": "$f(t)=t$",
            "why": "continuous and linear"
          },
          {
            "do": "Evaluate",
            "result": "$f((-1)^n)=(-1)^n$",
            "why": "same sequence"
          },
          {
            "do": "Observe behavior",
            "result": "$1,-1,1,-1,\\ldots$",
            "why": "alternation"
          },
          {
            "do": "Check convergence",
            "result": "does not converge",
            "why": "two subsequences differ"
          },
          {
            "do": "Conclude",
            "result": "no weak convergence",
            "why": "one test fails"
          }
        ],
        "answer": "No."
      },
      {
        "problem": "If $x_n\\rightharpoonup x$ and $g\\in X^\\ast$, what happens to $g(x_n)$?",
        "steps": [
          {
            "do": "Recall the definition",
            "result": "$f(x_n)\\to f(x)$ for every $f\\in X^\\ast$",
            "why": "weak convergence"
          },
          {
            "do": "Choose the test",
            "result": "$f=g$",
            "why": "$g$ is allowed"
          },
          {
            "do": "Apply the definition",
            "result": "$g(x_n)\\to g(x)$",
            "why": "direct use"
          },
          {
            "do": "Interpret",
            "result": "measurements converge",
            "why": "linear observer settles"
          },
          {
            "do": "State the limit",
            "result": "$g(x)$",
            "why": "reading at the weak limit"
          }
        ],
        "answer": "$g(x_n)\\to g(x)$."
      },
      {
        "problem": "Coordinate probes of embeddings in $\\mathbb{R}^3$ converge to $0.2,-0.1,0.4$. What is the weak limit?",
        "steps": [
          {
            "do": "Use the first probe",
            "result": "$e_1\\cdot v_n\\to0.2$",
            "why": "first coordinate"
          },
          {
            "do": "Use the second probe",
            "result": "$e_2\\cdot v_n\\to-0.1$",
            "why": "second coordinate"
          },
          {
            "do": "Use the third probe",
            "result": "$e_3\\cdot v_n\\to0.4$",
            "why": "third coordinate"
          },
          {
            "do": "Assemble coordinates",
            "result": "$v=(0.2,-0.1,0.4)$",
            "why": "coordinates determine the vector"
          },
          {
            "do": "Name the convergence",
            "result": "$v_n\\rightharpoonup v$",
            "why": "finite-dimensional weak limit"
          }
        ],
        "answer": "$(0.2,-0.1,0.4)$."
      }
    ],
    "applications": [
      {
        "title": "Training probes",
        "background": "A model representation can be stable under many linear probes even if parameters move.",
        "numbers": "If probe readings change by less than $0.001$ after epoch $50$, those measured behaviors are stable."
      },
      {
        "title": "Probability limits",
        "background": "Convergence in distribution is a weak-style idea using test functions.",
        "numbers": "A sample mean near $0.50$ with error $0.01$ stabilizes expectations of simple bounded tests."
      },
      {
        "title": "Embedding drift",
        "background": "A vector can move into directions fixed probes barely see.",
        "numbers": "For $e_n$, coordinate probe $5$ reads $0$ for every $n\\ne5$, while $\\|e_n\\|=1$."
      },
      {
        "title": "Inverse problems",
        "background": "Weak convergence can be enough when only sensor readings matter.",
        "numbers": "If $20$ sensor functionals vary by at most $0.005$, measured predictions are stable."
      },
      {
        "title": "Kernel analysis",
        "background": "Bounded RKHS sequences are often studied through weak subsequences.",
        "numbers": "If $\\|f_n\\|\\le3$ and $k(x,x)=4$, then $|f_n(x)|\\le6$."
      },
      {
        "title": "Optimization existence",
        "background": "Weak compactness helps prove minimizers exist for regularized objectives.",
        "numbers": "A sequence with norms at most $2$ has uniformly bounded linear readings by $2\\|f\\|$."
      }
    ],
    "applicationsClose": "Weak convergence is the art of trusting all linear measurements, even when full norm distance is too strict.",
    "takeaways": [
      "$x_n\\rightharpoonup x$ means every continuous linear functional converges on the sequence.",
      "Norm convergence implies weak convergence.",
      "Infinite-dimensional weak convergence may not imply norm convergence.",
      "Hilbert-space weak convergence is tested by fixed inner products."
    ]
  },
  "math-05-16": {
    "id": "math-05-16",
    "title": "Compact operators",
    "tagline": "A compact operator turns bounded inputs into outputs with convergent subsequences.",
    "connections": {
      "buildsOn": [
        "operator norms",
        "weak convergence",
        "bounded sequences"
      ],
      "leadsTo": [
        "spectral theorem",
        "Mercer's theorem",
        "integral operators"
      ],
      "usedWith": [
        "finite-rank maps",
        "Hilbert spaces",
        "eigenvalues"
      ]
    },
    "motivation": "<p>Bounded operators control size. Compact operators do more: they squeeze bounded families into output families with convergent subsequences.</p><p>That extra squeezing makes infinite-dimensional problems feel closer to finite-dimensional ones, especially in approximation and kernels.</p>",
    "definition": "<p>A linear operator $T:X\\to Y$ is <b>compact</b> if every bounded sequence $(x_n)$ in $X$ has a subsequence $(Tx_{n_k})$ that converges in norm in $Y$. Every bounded finite-rank operator is compact because bounded sets in finite-dimensional spaces have convergent subsequences.</p><p><b>Assumptions that matter:</b> compactness is stronger than boundedness in infinite dimensions, automatic for bounded maps from finite-dimensional domains, and central to matrix-like spectral behavior.</p>",
    "worked": {
      "problem": "For $T:\\ell_2\\to\\ell_2$ with $T(x)_n=x_n/n$, show $T e_n\\to0$ in norm.",
      "skills": [
        "sequence spaces",
        "diagonal operators",
        "norm convergence"
      ],
      "strategy": "Apply the operator to each basis vector and compute the resulting norm.",
      "steps": [
        {
          "do": "Write $e_n$",
          "result": "$1$ in coordinate $n$",
          "why": "standard basis"
        },
        {
          "do": "Apply $T$",
          "result": "$T e_n$ has coordinate $1/n$ in position $n$",
          "why": "diagonal damping"
        },
        {
          "do": "Compute the norm",
          "result": "$\\|T e_n\\|=1/n$",
          "why": "single nonzero coordinate"
        },
        {
          "do": "Take the limit",
          "result": "$1/n\\to0$",
          "why": "reciprocal sequence"
        },
        {
          "do": "State convergence",
          "result": "$T e_n\\to0$",
          "why": "norms go to zero"
        }
      ],
      "verify": "The original basis vectors do not converge in norm, but the damped outputs do.",
      "answer": "$T e_n$ converges in norm to $0$.",
      "connects": "Compact operators often tame high-index or high-frequency directions."
    },
    "practice": [
      {
        "problem": "Show $T(x)=\\langle x,a\\rangle b$ is bounded and finite rank.",
        "steps": [
          {
            "do": "Bound the scalar",
            "result": "$|\\langle x,a\\rangle|\\le\\|x\\|\\|a\\|$",
            "why": "Cauchy-Schwarz"
          },
          {
            "do": "Compute output norm",
            "result": "$\\|Tx\\|=|\\langle x,a\\rangle|\\|b\\|$",
            "why": "scalar times vector"
          },
          {
            "do": "Substitute",
            "result": "$\\|Tx\\|\\le\\|x\\|\\|a\\|\\|b\\|$",
            "why": "boundedness"
          },
          {
            "do": "Describe the range",
            "result": "$\\operatorname{span}\\{b\\}$",
            "why": "one-dimensional"
          },
          {
            "do": "Conclude compactness",
            "result": "finite rank",
            "why": "finite-rank bounded maps are compact"
          }
        ],
        "answer": "It is bounded and compact."
      },
      {
        "problem": "Why is the identity on $\\ell_2$ not compact?",
        "steps": [
          {
            "do": "Use the sequence",
            "result": "$e_n$",
            "why": "bounded unit vectors"
          },
          {
            "do": "Apply identity",
            "result": "$I e_n=e_n$",
            "why": "unchanged outputs"
          },
          {
            "do": "Compute pairwise distance",
            "result": "$\\|e_n-e_m\\|=\\sqrt2$ for $n\\ne m$",
            "why": "two coordinates differ"
          },
          {
            "do": "Check subsequences",
            "result": "no Cauchy subsequence",
            "why": "distances stay large"
          },
          {
            "do": "Conclude",
            "result": "not compact",
            "why": "compactness would require a convergent output subsequence"
          }
        ],
        "answer": "The identity on $\\ell_2$ is not compact."
      },
      {
        "problem": "In $\\mathbb{R}^3$, why is every bounded linear operator compact?",
        "steps": [
          {
            "do": "Take bounded inputs",
            "result": "$\\|x_n\\|\\le C$",
            "why": "start with any bounded sequence"
          },
          {
            "do": "Use boundedness",
            "result": "$\\|Tx_n\\|\\le\\|T\\|C$",
            "why": "outputs bounded"
          },
          {
            "do": "Use finite-dimensional theorem",
            "result": "bounded sequences have convergent subsequences",
            "why": "Bolzano-Weierstrass"
          },
          {
            "do": "Apply it",
            "result": "$Tx_{n_k}\\to y$",
            "why": "output subsequence converges"
          },
          {
            "do": "Conclude",
            "result": "$T$ is compact",
            "why": "definition met"
          }
        ],
        "answer": "Finite-dimensional bounded operators are compact."
      },
      {
        "problem": "For $T(x)_n=2^{-n}x_n$, compute $\\|T e_3\\|$ and $\\|T e_{10}\\|$.",
        "steps": [
          {
            "do": "Apply $T$ to $e_3$",
            "result": "coordinate value $2^{-3}$",
            "why": "diagonal rule"
          },
          {
            "do": "Compute norm",
            "result": "$1/8$",
            "why": "single coordinate"
          },
          {
            "do": "Apply $T$ to $e_{10}$",
            "result": "coordinate value $2^{-10}$",
            "why": "same rule"
          },
          {
            "do": "Compute norm",
            "result": "$1/1024$",
            "why": "power of two"
          },
          {
            "do": "Compare",
            "result": "$1/1024<1/8$",
            "why": "higher coordinates shrink more"
          }
        ],
        "answer": "$1/8$ and $1/1024$."
      },
      {
        "problem": "A feature map outputs only $5$ linear coefficients. Why is it compact if bounded?",
        "steps": [
          {
            "do": "Identify range",
            "result": "$\\mathbb{R}^5$",
            "why": "finite-dimensional output"
          },
          {
            "do": "Take bounded inputs",
            "result": "$\\|x_n\\|\\le C$",
            "why": "compactness test"
          },
          {
            "do": "Bound outputs",
            "result": "$\\|Tx_n\\|\\le\\|T\\|C$",
            "why": "bounded operator"
          },
          {
            "do": "Extract subsequence",
            "result": "$Tx_{n_k}$ converges",
            "why": "bounded sequence in $\\mathbb{R}^5$"
          },
          {
            "do": "Conclude compactness",
            "result": "definition satisfied",
            "why": "finite-dimensional squeezing"
          }
        ],
        "answer": "It is compact."
      }
    ],
    "applications": [
      {
        "title": "Low-rank compression",
        "background": "Finite-rank maps are compact and model dimensionality reduction.",
        "numbers": "A rank-$5$ projection keeps $5$ numbers from a $1000$-coordinate vector."
      },
      {
        "title": "Integral smoothing",
        "background": "Smoothing kernels often define compact operators.",
        "numbers": "A $5$-point average maps $[1,3,5,7,9]$ to center value $5$."
      },
      {
        "title": "PCA covariance",
        "background": "Covariance operators often have compact spectral behavior.",
        "numbers": "Eigenvalues $4,1,0.25$ have first-two variance share $5/5.25\\approx95.2\\%$."
      },
      {
        "title": "Denoising",
        "background": "Compact-like diagonal damping reduces high-frequency components.",
        "numbers": "Weights $1,1/2,1/4,1/8$ reduce the fourth component to $12.5\\%$."
      },
      {
        "title": "Kernel approximations",
        "background": "Mercer operators are compact in common settings.",
        "numbers": "Eigenvalues $0.5,0.2,0.05$ have first-two mass $0.7$."
      },
      {
        "title": "Recommender embeddings",
        "background": "Finite embeddings are compact approximations of high-dimensional behavior.",
        "numbers": "Using $64$ factors instead of $1024$ raw coordinates is a $16$ times reduction."
      }
    ],
    "applicationsClose": "Compact operators provide the finite-dimensional feeling inside infinite-dimensional analysis.",
    "takeaways": [
      "Compact operators send bounded sequences to outputs with convergent subsequences.",
      "Finite-rank bounded operators are compact.",
      "Bounded does not imply compact in infinite dimensions.",
      "Compactness supports eigenvalue decay and approximation."
    ]
  },
  "math-05-17": {
    "id": "math-05-17",
    "title": "The spectral theorem for operators",
    "tagline": "The spectral theorem says the nicest operators are diagonal in the right orthonormal coordinates.",
    "connections": {
      "buildsOn": [
        "inner products",
        "eigenvectors",
        "compact operators"
      ],
      "leadsTo": [
        "RKHS",
        "Mercer's theorem",
        "PCA"
      ],
      "usedWith": [
        "orthonormal bases",
        "quadratic forms",
        "self-adjoint operators"
      ]
    },
    "motivation": "<p>Diagonal matrices are easy because each coordinate acts independently. The spectral theorem tells us when an operator can be understood that way after rotating coordinates.</p><p>For symmetric matrices, and for compact self-adjoint operators, orthonormal eigenvectors reveal independent modes of action.</p>",
    "definition": "<p>In finite-dimensional real Euclidean space, every symmetric matrix $A=A^T$ has an orthonormal eigenbasis and can be written $A=Q\\Lambda Q^T$, where $Q$ is orthogonal and $\\Lambda$ is diagonal. Compact self-adjoint operators on Hilbert spaces have an analogous eigen-expansion for their nonzero spectrum.</p><p><b>Assumptions that matter:</b> self-adjointness gives orthogonal eigenvectors, compactness keeps infinite-dimensional spectra matrix-like, and eigenvalues control quadratic forms and operator size.</p>",
    "worked": {
      "problem": "For $A=\\operatorname{diag}(2,5)$ and $x=(3,4)$, compute $x^TAx$ spectrally.",
      "skills": [
        "eigenvalues",
        "orthonormal coordinates",
        "quadratic forms"
      ],
      "strategy": "Use the standard basis as the eigenbasis and weight squared coordinates.",
      "steps": [
        {
          "do": "Read eigenvalues",
          "result": "$2$ and $5$",
          "why": "diagonal entries"
        },
        {
          "do": "Read coordinates of $x$",
          "result": "$(3,4)$",
          "why": "standard eigenbasis"
        },
        {
          "do": "Square coordinates",
          "result": "$3^2=9$ and $4^2=16$",
          "why": "quadratic form"
        },
        {
          "do": "Weight by eigenvalues",
          "result": "$2\\cdot9+5\\cdot16$",
          "why": "spectral formula"
        },
        {
          "do": "Compute",
          "result": "$18+80=98$",
          "why": "arithmetic"
        }
      ],
      "verify": "Directly, $Ax=(6,20)$ and $x\\cdot Ax=18+80=98$.",
      "answer": "$x^TAx=98$.",
      "connects": "Spectral coordinates turn an operator into independent scalar weights."
    },
    "practice": [
      {
        "problem": "For $\\operatorname{diag}(4,1)$ and $x=(1,2)$, compute $x^TAx$.",
        "steps": [
          {
            "do": "Read eigenvalues",
            "result": "$4,1$",
            "why": "diagonal matrix"
          },
          {
            "do": "Square coordinates",
            "result": "$1^2,2^2$",
            "why": "eigenbasis components"
          },
          {
            "do": "Weight",
            "result": "$4\\cdot1^2+1\\cdot2^2$",
            "why": "quadratic form"
          },
          {
            "do": "Compute",
            "result": "$4+4$",
            "why": "terms"
          },
          {
            "do": "Add",
            "result": "$8$",
            "why": "final value"
          }
        ],
        "answer": "$8$."
      },
      {
        "problem": "Show eigenvectors of a symmetric matrix with distinct eigenvalues are orthogonal.",
        "steps": [
          {
            "do": "Let $Au=\\lambda u$ and $Av=\\mu v$",
            "result": "$\\lambda\\ne\\mu$",
            "why": "distinct eigenvalues"
          },
          {
            "do": "Use symmetry",
            "result": "$\\langle Au,v\\rangle=\\langle u,Av\\rangle$",
            "why": "self-adjoint property"
          },
          {
            "do": "Substitute",
            "result": "$\\lambda\\langle u,v\\rangle=\\mu\\langle u,v\\rangle$",
            "why": "eigen equations"
          },
          {
            "do": "Subtract",
            "result": "$(\\lambda-\\mu)\\langle u,v\\rangle=0$",
            "why": "collect terms"
          },
          {
            "do": "Conclude",
            "result": "$\\langle u,v\\rangle=0$",
            "why": "distinct eigenvalues"
          }
        ],
        "answer": "They are orthogonal."
      },
      {
        "problem": "If eigenvalues are $10$ and $2$, find $\\|A\\|_2$ for a positive symmetric matrix.",
        "steps": [
          {
            "do": "Read spectrum",
            "result": "$10,2$",
            "why": "given"
          },
          {
            "do": "Use symmetric positive rule",
            "result": "$\\|A\\|_2=$ largest eigenvalue",
            "why": "singular values equal eigenvalues"
          },
          {
            "do": "Take maximum",
            "result": "$10$",
            "why": "largest value"
          },
          {
            "do": "Find maximizing direction",
            "result": "top eigenvector",
            "why": "attains the norm"
          },
          {
            "do": "State norm",
            "result": "$\\|A\\|_2=10$",
            "why": "operator size"
          }
        ],
        "answer": "$10$."
      },
      {
        "problem": "Covariance eigenvalues are $9,4,1$. What variance fraction do the first two explain?",
        "steps": [
          {
            "do": "Add total",
            "result": "$9+4+1=14$",
            "why": "total variance"
          },
          {
            "do": "Add first two",
            "result": "$9+4=13$",
            "why": "kept variance"
          },
          {
            "do": "Form fraction",
            "result": "$13/14$",
            "why": "explained share"
          },
          {
            "do": "Divide",
            "result": "$0.9286$",
            "why": "decimal"
          },
          {
            "do": "Convert",
            "result": "$92.86\\%$",
            "why": "percentage"
          }
        ],
        "answer": "About $92.9\\%$."
      },
      {
        "problem": "With eigenvalues $3,-1$ and unit coordinates $(a,b)$, minimize $x^TAx$.",
        "steps": [
          {
            "do": "Write constraint",
            "result": "$a^2+b^2=1$",
            "why": "unit vector"
          },
          {
            "do": "Write form",
            "result": "$3a^2-b^2$",
            "why": "eigenvalue weights"
          },
          {
            "do": "Use $a^2=1-b^2$",
            "result": "$3-4b^2$",
            "why": "one variable"
          },
          {
            "do": "Maximize $b^2$",
            "result": "$b^2=1$",
            "why": "negative coefficient"
          },
          {
            "do": "Compute minimum",
            "result": "$-1$",
            "why": "smallest eigenvalue"
          }
        ],
        "answer": "$-1$."
      }
    ],
    "applications": [
      {
        "title": "PCA",
        "background": "PCA diagonalizes covariance to find orthogonal variance directions.",
        "numbers": "Eigenvalues $9,4,1$ give first PC share $9/14\\approx64.3\\%$."
      },
      {
        "title": "Hessian curvature",
        "background": "Optimization curvature is read from Hessian eigenvalues.",
        "numbers": "Eigenvalues $100$ and $1$ mean one direction is $100$ times steeper."
      },
      {
        "title": "Graph learning",
        "background": "Graph Laplacian eigenvectors reveal clusters and smooth modes.",
        "numbers": "A second eigenvalue $0.03$ suggests a weakly connected cut."
      },
      {
        "title": "Kernel methods",
        "background": "Mercer's theorem is spectral decomposition for kernel operators.",
        "numbers": "Eigenvalues $0.6,0.3,0.1$ have first-two mass $90\\%$."
      },
      {
        "title": "Signal filtering",
        "background": "Orthogonal spectral modes separate frequencies for compression.",
        "numbers": "Keeping $12$ of $64$ modes keeps $18.75\\%$ of coefficients."
      },
      {
        "title": "Linear dynamics",
        "background": "Eigenvalues determine mode growth or decay.",
        "numbers": "A mode with eigenvalue $0.8$ becomes $0.8^5\\approx0.328$ after $5$ steps."
      }
    ],
    "applicationsClose": "The spectral theorem is diagonal thinking with proof: right coordinates turn operators into independent modes.",
    "takeaways": [
      "Symmetric matrices have orthonormal eigenbases.",
      "Finite-dimensional spectral form is $A=Q\\Lambda Q^T$.",
      "Eigenvalues control quadratic forms and norms for self-adjoint operators.",
      "Compact self-adjoint operators preserve much of this structure."
    ]
  },
  "math-05-18": {
    "id": "math-05-18",
    "title": "Reproducing kernel Hilbert spaces (RKHS)",
    "tagline": "An RKHS is a Hilbert space of functions where evaluation is an inner product.",
    "connections": {
      "buildsOn": [
        "Hilbert spaces",
        "dual spaces",
        "kernels"
      ],
      "leadsTo": [
        "positive-definite kernels",
        "Mercer's theorem",
        "kernel methods"
      ],
      "usedWith": [
        "inner products",
        "function spaces",
        "orthogonal projection"
      ]
    },
    "motivation": "<p>An RKHS lets functions behave like vectors in a Hilbert space. The special gift is that evaluating a function at a point is a continuous linear measurement.</p><p>That means kernels are not just similarities; they are the inner-product machinery of a function space.</p>",
    "definition": "<p>A <b>reproducing kernel Hilbert space</b> $\\mathcal{H}$ is a Hilbert space of functions where each evaluation map $f\\mapsto f(x)$ is continuous. Therefore there is a representer $k_x\\in\\mathcal{H}$ such that $$f(x)=\\langle f,k_x\\rangle_{\\mathcal{H}}.$$ The kernel is $k(x,z)=\\langle k_z,k_x\\rangle_{\\mathcal{H}}$.</p><p><b>Assumptions that matter:</b> point evaluation must be continuous, the kernel is positive definite, and the inner product lives in function space rather than raw input space.</p>",
    "worked": {
      "problem": "With $k(x,z)=1+xz$ and $f=2k_1-k_3$, compute $f(4)$.",
      "skills": [
        "kernel evaluation",
        "linear combinations",
        "reproduction"
      ],
      "strategy": "Evaluate the same kernel combination at the test point.",
      "steps": [
        {
          "do": "Use reproduction",
          "result": "$f(4)=2k(4,1)-k(4,3)$",
          "why": "kernel sections reproduce values"
        },
        {
          "do": "Compute $k(4,1)$",
          "result": "$1+4=5$",
          "why": "kernel formula"
        },
        {
          "do": "Compute $k(4,3)$",
          "result": "$1+12=13$",
          "why": "kernel formula"
        },
        {
          "do": "Substitute",
          "result": "$2\\cdot5-13$",
          "why": "linear combination"
        },
        {
          "do": "Compute",
          "result": "$-3$",
          "why": "arithmetic"
        }
      ],
      "verify": "Expanding gives $f(x)=2(1+x)-(1+3x)=1-x$, so $f(4)=-3$.",
      "answer": "$f(4)=-3$.",
      "connects": "Function values are inner products with kernel sections."
    },
    "practice": [
      {
        "problem": "For $k(x,z)=1+xz$, compute $k(2,5)$ and $k(2,2)$.",
        "steps": [
          {
            "do": "Substitute in $k(2,5)$",
            "result": "$1+2\\cdot5$",
            "why": "formula"
          },
          {
            "do": "Compute",
            "result": "$11$",
            "why": "arithmetic"
          },
          {
            "do": "Substitute in $k(2,2)$",
            "result": "$1+2\\cdot2$",
            "why": "diagonal value"
          },
          {
            "do": "Compute",
            "result": "$5$",
            "why": "arithmetic"
          },
          {
            "do": "Interpret",
            "result": "$k(2,2)=\\|k_2\\|^2$",
            "why": "kernel diagonal"
          }
        ],
        "answer": "$11$ and $5$."
      },
      {
        "problem": "If $f=3k_0+2k_2$, compute $f(1)$ for $k(x,z)=1+xz$.",
        "steps": [
          {
            "do": "Use reproduction",
            "result": "$f(1)=3k(1,0)+2k(1,2)$",
            "why": "evaluate sections"
          },
          {
            "do": "Compute $k(1,0)$",
            "result": "$1$",
            "why": "formula"
          },
          {
            "do": "Compute $k(1,2)$",
            "result": "$3$",
            "why": "formula"
          },
          {
            "do": "Substitute",
            "result": "$3\\cdot1+2\\cdot3$",
            "why": "coefficients"
          },
          {
            "do": "Add",
            "result": "$9$",
            "why": "value"
          }
        ],
        "answer": "$9$."
      },
      {
        "problem": "For $f=k_1-k_2$, compute $\\|f\\|^2$ with $k(x,z)=1+xz$.",
        "steps": [
          {
            "do": "Expand",
            "result": "$\\langle k_1-k_2,k_1-k_2\\rangle$",
            "why": "squared norm"
          },
          {
            "do": "Use kernels",
            "result": "$k(1,1)-2k(1,2)+k(2,2)$",
            "why": "inner products of sections"
          },
          {
            "do": "Compute values",
            "result": "$2-2\\cdot3+5$",
            "why": "kernel formula"
          },
          {
            "do": "Simplify",
            "result": "$2-6+5$",
            "why": "arithmetic"
          },
          {
            "do": "Add",
            "result": "$1$",
            "why": "squared norm"
          }
        ],
        "answer": "$1$."
      },
      {
        "problem": "If $\\|f\\|=2$ and $k(x,x)=9$, bound $|f(x)|$.",
        "steps": [
          {
            "do": "Use RKHS bound",
            "result": "$|f(x)|\\le\\|f\\|\\sqrt{k(x,x)}$",
            "why": "Cauchy-Schwarz"
          },
          {
            "do": "Substitute",
            "result": "$2\\sqrt9$",
            "why": "given values"
          },
          {
            "do": "Take square root",
            "result": "$2\\cdot3$",
            "why": "$\\sqrt9=3$"
          },
          {
            "do": "Multiply",
            "result": "$6$",
            "why": "bound"
          },
          {
            "do": "State result",
            "result": "$|f(x)|\\le6$",
            "why": "pointwise control"
          }
        ],
        "answer": "$6$."
      },
      {
        "problem": "For $f(x)=0.5k(x,1)-0.2k(x,4)$ and $k(x,z)=xz$, compute $f(3)$.",
        "steps": [
          {
            "do": "Compute $k(3,1)$",
            "result": "$3$",
            "why": "linear kernel"
          },
          {
            "do": "Compute $k(3,4)$",
            "result": "$12$",
            "why": "linear kernel"
          },
          {
            "do": "Apply coefficients",
            "result": "$0.5\\cdot3-0.2\\cdot12$",
            "why": "representer form"
          },
          {
            "do": "Compute terms",
            "result": "$1.5-2.4$",
            "why": "arithmetic"
          },
          {
            "do": "Subtract",
            "result": "$-0.9$",
            "why": "prediction"
          }
        ],
        "answer": "$-0.9$."
      }
    ],
    "applications": [
      {
        "title": "Kernel ridge regression",
        "background": "RKHS norms regularize learned functions.",
        "numbers": "If $\\lambda=0.1$ and $\\|f\\|=3$, the penalty is $0.1\\cdot9=0.9$."
      },
      {
        "title": "Gaussian processes",
        "background": "Kernels are covariance functions, while RKHS gives matching deterministic geometry.",
        "numbers": "If $k(x,x)=1$, the prior variance at $x$ is $1$."
      },
      {
        "title": "Similarity geometry",
        "background": "Kernel sections act like hidden feature vectors.",
        "numbers": "If $k(a,a)=4$, $k(b,b)=9$, and $k(a,b)=3$, cosine is $3/(2\\cdot3)=0.5$."
      },
      {
        "title": "SVMs",
        "background": "SVM decision functions are finite sums of RKHS kernel sections.",
        "numbers": "Coefficients $1.2,-0.7$ give $1.2k(x,x_1)-0.7k(x,x_2)+b$."
      },
      {
        "title": "Interpolation",
        "background": "RKHS interpolation balances fit and norm.",
        "numbers": "Errors $0.1$ and $-0.2$ have squared error $0.01+0.04=0.05$."
      },
      {
        "title": "Uncertainty bounds",
        "background": "Norm bounds imply pointwise bounds through kernel diagonals.",
        "numbers": "If $\\|f\\|\\le4$ and $k(x,x)=0.25$, then $|f(x)|\\le2$."
      }
    ],
    "applicationsClose": "RKHS thinking turns function learning into Hilbert-space geometry carried by kernels.",
    "takeaways": [
      "Reproduction means $f(x)=\\langle f,k_x\\rangle_{\\mathcal{H}}$.",
      "Kernel sections represent point evaluation.",
      "$k(x,x)$ controls pointwise bounds.",
      "Kernel predictors are finite linear combinations of kernel sections."
    ]
  },
  "math-05-19": {
    "id": "math-05-19",
    "title": "Positive-definite kernels",
    "tagline": "A positive-definite kernel is a similarity function that can be an inner product somewhere.",
    "connections": {
      "buildsOn": [
        "inner products",
        "Gram matrices",
        "RKHS"
      ],
      "leadsTo": [
        "Mercer's theorem",
        "kernel trick",
        "Gaussian processes"
      ],
      "usedWith": [
        "quadratic forms",
        "feature maps",
        "symmetric matrices"
      ]
    },
    "motivation": "<p>A similarity score is useful only if it describes possible geometry. Positive definiteness is the test that prevents impossible inner products.</p><p>When every finite Gram matrix is positive semidefinite, the kernel can safely act like an inner product in a hidden feature space.</p>",
    "definition": "<p>A symmetric kernel $k$ is <b>positive definite</b> if for every finite set $x_1,\\ldots,x_n$ and coefficients $c_i$, $$\\sum_i\\sum_j c_i c_j k(x_i,x_j)\\ge0.$$ Equivalently, each Gram matrix $K_{ij}=k(x_i,x_j)$ is positive semidefinite.</p><p><b>Assumptions that matter:</b> the condition must hold for every finite sample and coefficient vector; positive semidefinite allows zero directions; and symmetry is part of the real-valued kernel setting.</p>",
    "worked": {
      "problem": "For $k(x,z)=1+xz$ and points $1,2$, build the Gram matrix and check it is positive definite.",
      "skills": [
        "Gram matrices",
        "determinants",
        "PSD tests"
      ],
      "strategy": "Compute the two-by-two matrix and check its principal minors.",
      "steps": [
        {
          "do": "Compute $k(1,1)$",
          "result": "$2$",
          "why": "diagonal entry"
        },
        {
          "do": "Compute $k(1,2)$",
          "result": "$3$",
          "why": "off-diagonal entry"
        },
        {
          "do": "Compute $k(2,2)$",
          "result": "$5$",
          "why": "diagonal entry"
        },
        {
          "do": "Write the matrix",
          "result": "$K=\\begin{pmatrix}2&3\\\\3&5\\end{pmatrix}$",
          "why": "symmetry fills the matrix"
        },
        {
          "do": "Compute determinant",
          "result": "$2\\cdot5-3\\cdot3=1$",
          "why": "two-by-two test"
        },
        {
          "do": "Conclude",
          "result": "positive definite",
          "why": "positive diagonal and determinant"
        }
      ],
      "verify": "Both principal minors are positive, so the quadratic form is positive except at zero.",
      "answer": "$K=\\begin{pmatrix}2&3\\\\3&5\\end{pmatrix}$ is positive definite.",
      "connects": "Positive kernels create valid inner-product Gram matrices."
    },
    "practice": [
      {
        "problem": "Check if $\\begin{pmatrix}1&0.5\\\\0.5&1\\end{pmatrix}$ is positive definite.",
        "steps": [
          {
            "do": "Check symmetry",
            "result": "$0.5=0.5$",
            "why": "required"
          },
          {
            "do": "Check first minor",
            "result": "$1>0$",
            "why": "positive diagonal"
          },
          {
            "do": "Compute determinant",
            "result": "$1-0.25$",
            "why": "two-by-two determinant"
          },
          {
            "do": "Simplify",
            "result": "$0.75>0$",
            "why": "positive"
          },
          {
            "do": "Conclude",
            "result": "positive definite",
            "why": "both tests pass"
          }
        ],
        "answer": "Yes."
      },
      {
        "problem": "Show $\\begin{pmatrix}1&2\\\\2&1\\end{pmatrix}$ is not PSD.",
        "steps": [
          {
            "do": "Choose coefficients",
            "result": "$c=(1,-1)$",
            "why": "contrast direction"
          },
          {
            "do": "Compute $Kc$",
            "result": "$(-1,1)$",
            "why": "matrix product"
          },
          {
            "do": "Compute quadratic form",
            "result": "$c^TKc=-2$",
            "why": "dot product"
          },
          {
            "do": "Compare to PSD rule",
            "result": "$-2<0$",
            "why": "PSD cannot be negative"
          },
          {
            "do": "Conclude",
            "result": "not PSD",
            "why": "one counterexample is enough"
          }
        ],
        "answer": "It is not positive semidefinite."
      },
      {
        "problem": "Show $k(x,z)=xz$ is positive definite on $\\mathbb{R}$.",
        "steps": [
          {
            "do": "Write the sum",
            "result": "$\\sum_i\\sum_j c_i c_j x_i x_j$",
            "why": "definition"
          },
          {
            "do": "Factor",
            "result": "$(\\sum_i c_i x_i)(\\sum_j c_j x_j)$",
            "why": "separate indices"
          },
          {
            "do": "Recognize square",
            "result": "$(\\sum_i c_i x_i)^2$",
            "why": "same factor twice"
          },
          {
            "do": "Use nonnegativity",
            "result": "$\\ge0$",
            "why": "squares are nonnegative"
          },
          {
            "do": "Conclude",
            "result": "positive definite",
            "why": "all choices work"
          }
        ],
        "answer": "It is positive definite."
      },
      {
        "problem": "For $k(x,z)=(1+xz)^2$, compute $k(1,2)$ and state why the kernel is PSD.",
        "steps": [
          {
            "do": "Compute inside",
            "result": "$1+2=3$",
            "why": "substitute"
          },
          {
            "do": "Square",
            "result": "$9$",
            "why": "kernel value"
          },
          {
            "do": "Use closure",
            "result": "product of PSD kernels is PSD",
            "why": "Schur product idea"
          },
          {
            "do": "Identify base",
            "result": "$1+xz$",
            "why": "known PSD kernel"
          },
          {
            "do": "Conclude",
            "result": "$(1+xz)^2$ is PSD",
            "why": "square of a PSD kernel"
          }
        ],
        "answer": "$k(1,2)=9$, and the kernel is PSD."
      },
      {
        "problem": "A Gram matrix has eigenvalues $4,1,0$. Is it PSD and what is its rank?",
        "steps": [
          {
            "do": "List eigenvalues",
            "result": "$4,1,0$",
            "why": "given"
          },
          {
            "do": "Check signs",
            "result": "all are $\\ge0$",
            "why": "PSD spectral criterion"
          },
          {
            "do": "Conclude PSD",
            "result": "yes",
            "why": "no negative eigenvalues"
          },
          {
            "do": "Count positive eigenvalues",
            "result": "$2$",
            "why": "rank criterion"
          },
          {
            "do": "Interpret zero",
            "result": "one dependence direction",
            "why": "feature vectors are not independent"
          }
        ],
        "answer": "It is PSD with rank $2$."
      }
    ],
    "applications": [
      {
        "title": "SVM convexity",
        "background": "Kernel SVM dual problems need PSD Gram matrices.",
        "numbers": "A determinant $0.75>0$ with diagonal $1$ is safe for two points."
      },
      {
        "title": "Gaussian processes",
        "background": "Covariance kernels must be PSD to define valid finite covariances.",
        "numbers": "Covariance $0.8$ with variances $1,1$ has determinant $0.36>0$."
      },
      {
        "title": "Similarity design",
        "background": "PSD tests catch impossible similarities.",
        "numbers": "Matrix $[[1,2],[2,1]]$ fails because $(1,-1)$ gives $-2$."
      },
      {
        "title": "Polynomial features",
        "background": "Polynomial kernels compute expanded-feature dot products.",
        "numbers": "$(1+2\\cdot3)^2=49$."
      },
      {
        "title": "Kernel distances",
        "background": "PSD kernels define squared feature distances.",
        "numbers": "If $k(a,a)=k(b,b)=1$ and $k(a,b)=0.2$, distance squared is $1.6$."
      },
      {
        "title": "Numerical repair",
        "background": "Tiny negative eigenvalues can be clipped to restore PSD.",
        "numbers": "Changing eigenvalue $-0.001$ to $0$ changes trace by $0.001$."
      }
    ],
    "applicationsClose": "Positive definiteness is the trust contract that lets similarities become geometry.",
    "takeaways": [
      "Every finite Gram matrix of a PSD kernel is positive semidefinite.",
      "The test is $c^T K c\\ge0$ for all coefficient vectors.",
      "Inner-product kernels are automatically PSD.",
      "SVMs, Gaussian processes, and kernel PCA depend on PSD kernels."
    ]
  },
  "math-05-20": {
    "id": "math-05-20",
    "title": "Mercer's theorem",
    "tagline": "Mercer's theorem expands a nice positive kernel into eigenvalues and eigenfunctions.",
    "connections": {
      "buildsOn": [
        "positive-definite kernels",
        "compact operators",
        "spectral theorem"
      ],
      "leadsTo": [
        "kernel trick",
        "kernel PCA",
        "Gaussian processes"
      ],
      "usedWith": [
        "integral operators",
        "orthonormal functions",
        "RKHS"
      ]
    },
    "motivation": "<p>A kernel can feel like a black box. Mercer's theorem opens it by showing that nice kernels decompose into orthogonal modes.</p><p>It is the kernel version of diagonalizing a symmetric positive matrix: similarities become weighted products of eigenfunctions.</p>",
    "definition": "<p>For a continuous symmetric positive-definite kernel on a compact domain, the integral operator $(Tf)(x)=\\int k(x,z)f(z)\\,dz$ is compact, self-adjoint, and positive under standard hypotheses. Mercer's theorem gives $$k(x,z)=\\sum_{m=1}^{\\infty}\\lambda_m\\phi_m(x)\\phi_m(z),$$ with $\\lambda_m\\ge0$ and orthonormal eigenfunctions $\\phi_m$.</p><p><b>Assumptions that matter:</b> compact domain, continuity, symmetry, positive definiteness, and measure choices matter; convergence details depend on the theorem version; and the expansion generalizes PSD matrix diagonalization.</p>",
    "worked": {
      "problem": "Given $k(x,z)=4\\phi_1(x)\\phi_1(z)+\\phi_2(x)\\phi_2(z)$, with $\\phi_1(a)=0.5$, $\\phi_1(b)=1$, $\\phi_2(a)=2$, $\\phi_2(b)=-1$, compute $k(a,b)$.",
      "skills": [
        "eigenfunction expansion",
        "weighted features",
        "kernel evaluation"
      ],
      "strategy": "Evaluate each spectral product and add the weighted contributions.",
      "steps": [
        {
          "do": "Compute first product",
          "result": "$0.5\\cdot1=0.5$",
          "why": "first eigenfunction"
        },
        {
          "do": "Weight it",
          "result": "$4\\cdot0.5=2$",
          "why": "eigenvalue $4$"
        },
        {
          "do": "Compute second product",
          "result": "$2\\cdot(-1)=-2$",
          "why": "second eigenfunction"
        },
        {
          "do": "Weight it",
          "result": "$1\\cdot(-2)=-2$",
          "why": "eigenvalue $1$"
        },
        {
          "do": "Add",
          "result": "$2+(-2)=0$",
          "why": "kernel value"
        }
      ],
      "verify": "The two modes cancel exactly for this pair.",
      "answer": "$k(a,b)=0$.",
      "connects": "Mercer expansions compute kernels as spectral feature dot products."
    },
    "practice": [
      {
        "problem": "Using the same expansion, compute $k(a,a)$ when $\\phi_1(a)=0.5$ and $\\phi_2(a)=2$.",
        "steps": [
          {
            "do": "Square first value",
            "result": "$0.5^2=0.25$",
            "why": "diagonal term"
          },
          {
            "do": "Weight first",
            "result": "$4\\cdot0.25=1$",
            "why": "eigenvalue"
          },
          {
            "do": "Square second value",
            "result": "$2^2=4$",
            "why": "diagonal term"
          },
          {
            "do": "Weight second",
            "result": "$1\\cdot4=4$",
            "why": "eigenvalue"
          },
          {
            "do": "Add",
            "result": "$5$",
            "why": "kernel diagonal"
          }
        ],
        "answer": "$5$."
      },
      {
        "problem": "Eigenvalues are $5,2,0.5$. What trace fraction is in the first two?",
        "steps": [
          {
            "do": "Add total",
            "result": "$7.5$",
            "why": "$5+2+0.5$"
          },
          {
            "do": "Add first two",
            "result": "$7$",
            "why": "kept mass"
          },
          {
            "do": "Form fraction",
            "result": "$7/7.5$",
            "why": "share"
          },
          {
            "do": "Divide",
            "result": "$0.9333$",
            "why": "decimal"
          },
          {
            "do": "Convert",
            "result": "$93.33\\%$",
            "why": "percent"
          }
        ],
        "answer": "About $93.3\\%$."
      },
      {
        "problem": "For feature map $\\Phi(x)=(\\sqrt4\\phi_1(x),\\sqrt1\\phi_2(x))$, compute $\\Phi(a)$ from $(0.5,2)$.",
        "steps": [
          {
            "do": "Take first scale",
            "result": "$\\sqrt4=2$",
            "why": "eigenvalue square root"
          },
          {
            "do": "Scale first coordinate",
            "result": "$2\\cdot0.5=1$",
            "why": "feature coordinate"
          },
          {
            "do": "Take second scale",
            "result": "$\\sqrt1=1$",
            "why": "eigenvalue square root"
          },
          {
            "do": "Scale second coordinate",
            "result": "$1\\cdot2=2$",
            "why": "feature coordinate"
          },
          {
            "do": "Write vector",
            "result": "$(1,2)$",
            "why": "Mercer feature"
          }
        ],
        "answer": "$(1,2)$."
      },
      {
        "problem": "With $\\Phi(a)=(1,2)$ and $\\Phi(b)=(2,-1)$, compute $k(a,b)$.",
        "steps": [
          {
            "do": "Write dot product",
            "result": "$\\Phi(a)\\cdot\\Phi(b)$",
            "why": "kernel as feature inner product"
          },
          {
            "do": "Substitute",
            "result": "$(1,2)\\cdot(2,-1)$",
            "why": "given vectors"
          },
          {
            "do": "Multiply",
            "result": "$1\\cdot2+2\\cdot(-1)$",
            "why": "dot product"
          },
          {
            "do": "Compute",
            "result": "$2-2$",
            "why": "terms"
          },
          {
            "do": "Add",
            "result": "$0$",
            "why": "kernel value"
          }
        ],
        "answer": "$0$."
      },
      {
        "problem": "Keep eigenvalues $3$ and $1$ and drop tail sum $0.2$. If tail basis weight at a point totals $1$, bound lost diagonal value.",
        "steps": [
          {
            "do": "Identify tail mass",
            "result": "$0.2$",
            "why": "dropped eigenvalues"
          },
          {
            "do": "Use total tail weight",
            "result": "$1$",
            "why": "given point weight"
          },
          {
            "do": "Multiply",
            "result": "$0.2\\cdot1=0.2$",
            "why": "lost diagonal"
          },
          {
            "do": "Compare kept mass",
            "result": "$3+1=4$",
            "why": "kept eigenvalues"
          },
          {
            "do": "Compute relative size",
            "result": "$0.2/4=0.05$",
            "why": "five percent"
          }
        ],
        "answer": "Lost diagonal contribution is at most $0.2$."
      }
    ],
    "applications": [
      {
        "title": "Kernel PCA",
        "background": "Mercer eigenfunctions are population kernel PCA directions.",
        "numbers": "Eigenvalues $5,2,0.5$ give first share $5/7.5=66.7\\%$."
      },
      {
        "title": "Gaussian processes",
        "background": "Mercer modes describe covariance structure.",
        "numbers": "Eigenvalue $4$ corresponds to mode standard deviation $2$."
      },
      {
        "title": "Low-rank kernels",
        "background": "Nyström methods keep leading spectral mass.",
        "numbers": "Keeping $10$ and $3$ out of total $14$ preserves $92.9\\%$."
      },
      {
        "title": "Smoothing splines",
        "background": "Smooth kernels often have fast eigenvalue decay.",
        "numbers": "Values $1,1/4,1/9$ make the third mode $11.1\\%$ of the first."
      },
      {
        "title": "Effective dimension",
        "background": "Learning is easier when only a few eigenvalues are large.",
        "numbers": "If $20$ of $1000$ eigenvalues exceed $0.01$, active dimension is near $20$."
      },
      {
        "title": "Spectral denoising",
        "background": "Small eigenvalue components can be filtered out.",
        "numbers": "Dropping a $0.03$ mode removes only $0.03$ variance contribution."
      }
    ],
    "applicationsClose": "Mercer's theorem is spectral geometry for kernels: similarity decomposes into weighted orthogonal modes.",
    "takeaways": [
      "Mercer's theorem expands nice PSD kernels into eigenvalues and eigenfunctions.",
      "The expansion generalizes PSD matrix diagonalization.",
      "Large eigenvalues mark dominant kernel features.",
      "Low-rank kernel approximations keep leading components."
    ]
  },
  "math-05-21": {
    "id": "math-05-21",
    "title": "The kernel trick and representer theorem",
    "tagline": "Kernel methods learn nonlinear functions by doing linear algebra with similarities.",
    "connections": {
      "buildsOn": [
        "RKHS",
        "positive-definite kernels",
        "Mercer's theorem"
      ],
      "leadsTo": [
        "support vector machines",
        "kernel ridge regression",
        "Gaussian processes"
      ],
      "usedWith": [
        "regularization",
        "Gram matrices",
        "orthogonal projection"
      ]
    },
    "motivation": "<p>Linear models are trainable and understandable, but raw data often need nonlinear boundaries. Kernels give us nonlinear feature spaces while keeping the computations in similarities.</p><p>The <b>kernel trick</b> computes hidden feature dot products with $k(x,z)$. The <b>representer theorem</b> says many regularized learners only need kernels centered at training points.</p>",
    "definition": "<p>If $k(x,z)=\\langle\\Phi(x),\\Phi(z)\\rangle$, the <b>kernel trick</b> replaces feature-space dot products by kernel evaluations. The <b>representer theorem</b> says that for many objectives consisting of training loss plus a nondecreasing penalty in $\\|f\\|_{\\mathcal{H}}$, a minimizer has $$f(x)=\\sum_{i=1}^n\\alpha_i k(x_i,x).$$ Learning becomes solving for coefficients using the Gram matrix $K_{ij}=k(x_i,x_j)$.</p><p><b>Assumptions that matter:</b> $k$ must be positive definite, the regularizer must depend appropriately on the RKHS norm, and the $n\\times n$ Gram matrix can be expensive for large $n$.</p>",
    "worked": {
      "problem": "Kernel ridge regression uses $\\alpha=(K+\\lambda I)^{-1}y$. For $x_1=0$, $x_2=2$, $k(x,z)=1+xz$, $y=(1,3)$, and $\\lambda=1$, compute $\\alpha$ and $f(1)$.",
      "skills": [
        "Gram matrices",
        "regularization",
        "kernel prediction"
      ],
      "strategy": "Build $K$, solve two equations, then use the representer form at the test point.",
      "steps": [
        {
          "do": "Compute $K_{11}$",
          "result": "$k(0,0)=1$",
          "why": "kernel value"
        },
        {
          "do": "Compute cross entries",
          "result": "$k(0,2)=k(2,0)=1$",
          "why": "product term is zero"
        },
        {
          "do": "Compute $K_{22}$",
          "result": "$k(2,2)=5$",
          "why": "$1+4=5$"
        },
        {
          "do": "Add regularization",
          "result": "$K+I=\\begin{pmatrix}2&1\\\\1&6\\end{pmatrix}$",
          "why": "$\\lambda=1$"
        },
        {
          "do": "Write equations",
          "result": "$2\\alpha_1+\\alpha_2=1$, $\\alpha_1+6\\alpha_2=3$",
          "why": "linear system"
        },
        {
          "do": "Solve",
          "result": "$\\alpha_1=3/11$, $\\alpha_2=5/11$",
          "why": "substitution"
        },
        {
          "do": "Compute test kernels",
          "result": "$k(0,1)=1$, $k(2,1)=3$",
          "why": "similarities to training points"
        },
        {
          "do": "Predict",
          "result": "$f(1)=\\frac3{11}+3\\frac5{11}=\\frac{18}{11}$",
          "why": "representer theorem form"
        }
      ],
      "verify": "$18/11\\approx1.636$, between the two labels and smoothed by regularization.",
      "answer": "$\\alpha=(3/11,5/11)$ and $f(1)=18/11\\approx1.636$.",
      "connects": "The capstone pattern is finite coefficient learning in a rich kernel space."
    },
    "practice": [
      {
        "problem": "For $x_1=1$, $x_2=3$ and $k(x,z)=xz$, build $K$.",
        "steps": [
          {
            "do": "Compute $K_{11}$",
            "result": "$1$",
            "why": "$1\\cdot1$"
          },
          {
            "do": "Compute $K_{12}$",
            "result": "$3$",
            "why": "$1\\cdot3$"
          },
          {
            "do": "Compute $K_{21}$",
            "result": "$3$",
            "why": "symmetry"
          },
          {
            "do": "Compute $K_{22}$",
            "result": "$9$",
            "why": "$3\\cdot3$"
          },
          {
            "do": "Assemble",
            "result": "$\\begin{pmatrix}1&3\\\\3&9\\end{pmatrix}$",
            "why": "Gram matrix"
          }
        ],
        "answer": "$\\begin{pmatrix}1&3\\\\3&9\\end{pmatrix}$."
      },
      {
        "problem": "With $f(x)=2k(1,x)-k(3,x)$ and $k(x,z)=xz$, compute $f(4)$.",
        "steps": [
          {
            "do": "Compute $k(1,4)$",
            "result": "$4$",
            "why": "linear kernel"
          },
          {
            "do": "Compute $k(3,4)$",
            "result": "$12$",
            "why": "linear kernel"
          },
          {
            "do": "Apply coefficients",
            "result": "$2\\cdot4-12$",
            "why": "representer form"
          },
          {
            "do": "Compute",
            "result": "$8-12$",
            "why": "arithmetic"
          },
          {
            "do": "Subtract",
            "result": "$-4$",
            "why": "prediction"
          }
        ],
        "answer": "$-4$."
      },
      {
        "problem": "For $k(x,z)=(1+xz)^2$, compute the hidden feature dot product of $2$ and $3$.",
        "steps": [
          {
            "do": "Multiply inputs",
            "result": "$2\\cdot3=6$",
            "why": "inside term"
          },
          {
            "do": "Add one",
            "result": "$7$",
            "why": "bias term"
          },
          {
            "do": "Square",
            "result": "$49$",
            "why": "kernel value"
          },
          {
            "do": "Interpret",
            "result": "$\\langle\\Phi(2),\\Phi(3)\\rangle=49$",
            "why": "kernel trick"
          },
          {
            "do": "Notice",
            "result": "no explicit features needed",
            "why": "computational shortcut"
          }
        ],
        "answer": "$49$."
      },
      {
        "problem": "Solve kernel ridge with $K=\\begin{pmatrix}2&0\\\\0&2\\end{pmatrix}$, $y=(2,-2)$, and $\\lambda=2$.",
        "steps": [
          {
            "do": "Add ridge term",
            "result": "$K+2I=\\begin{pmatrix}4&0\\\\0&4\\end{pmatrix}$",
            "why": "regularization"
          },
          {
            "do": "First equation",
            "result": "$4\\alpha_1=2$",
            "why": "diagonal system"
          },
          {
            "do": "Solve first",
            "result": "$\\alpha_1=1/2$",
            "why": "divide by $4$"
          },
          {
            "do": "Second equation",
            "result": "$4\\alpha_2=-2$",
            "why": "second label"
          },
          {
            "do": "Solve second",
            "result": "$\\alpha_2=-1/2$",
            "why": "divide by $4$"
          }
        ],
        "answer": "$\\alpha=(1/2,-1/2)$."
      },
      {
        "problem": "An RBF kernel has $k(a,a)=k(b,b)=1$ and $k(a,b)=0.2$. Compute feature distance squared.",
        "steps": [
          {
            "do": "Write formula",
            "result": "$\\|\\Phi(a)-\\Phi(b)\\|^2=k(a,a)+k(b,b)-2k(a,b)$",
            "why": "expand squared norm"
          },
          {
            "do": "Substitute",
            "result": "$1+1-2(0.2)$",
            "why": "given values"
          },
          {
            "do": "Compute",
            "result": "$1.6$",
            "why": "arithmetic"
          },
          {
            "do": "Take distance",
            "result": "$\\sqrt{1.6}\\approx1.265$",
            "why": "optional length"
          },
          {
            "do": "Interpret",
            "result": "low similarity means separated features",
            "why": "ML geometry"
          }
        ],
        "answer": "The squared feature distance is $1.6$."
      }
    ],
    "applications": [
      {
        "title": "Kernel ridge regression",
        "background": "The representer theorem turns function learning into solving for $n$ coefficients.",
        "numbers": "With $500$ examples, the Gram matrix has $500^2=250000$ entries."
      },
      {
        "title": "Support vector machines",
        "background": "SVM predictions use kernels against support vectors.",
        "numbers": "If $80$ of $1000$ examples are support vectors, prediction needs $80$ kernel evaluations."
      },
      {
        "title": "Nonlinear classification",
        "background": "Polynomial kernels create nonlinear boundaries through linear algebra.",
        "numbers": "For $k(x,z)=(1+xz)^2$, points $2$ and $3$ have similarity $49$ instead of linear similarity $6$."
      },
      {
        "title": "RBF similarity",
        "background": "Gaussian kernels make nearby points much more similar than far points.",
        "numbers": "With distance $2$, $e^{-2}\\approx0.135$ for $k=e^{-\\|x-z\\|^2/2}$."
      },
      {
        "title": "Kernel PCA",
        "background": "Kernel PCA replaces dot products by Gram entries.",
        "numbers": "Eigenvalues $6,2,1$ give first component share $6/9=66.7\\%$."
      },
      {
        "title": "Gaussian processes",
        "background": "GP posterior means are weighted kernel similarities.",
        "numbers": "Weights $(0.4,-0.1)$ and similarities $(0.8,0.3)$ give mean $0.32-0.03=0.29$."
      },
      {
        "title": "Scaling limits",
        "background": "Kernel methods can be memory-heavy because Gram matrices grow quadratically.",
        "numbers": "$10000$ examples require $100000000$ entries, about $800$ MB at $8$ bytes each."
      }
    ],
    "applicationsClose": "The kernel trick and representer theorem make rich nonlinear learning finite: similarities in, coefficients out.",
    "takeaways": [
      "The kernel trick computes hidden feature dot products directly.",
      "The representer theorem gives $f(x)=\\sum_i\\alpha_i k(x_i,x)$ for many regularized learners.",
      "Positive-definite kernels are required for valid geometry.",
      "Kernel power comes with quadratic Gram-matrix scaling."
    ]
  }
};
