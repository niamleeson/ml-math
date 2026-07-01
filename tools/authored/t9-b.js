module.exports = {
  "math-09-14": {
    "id": "math-09-14",
    "title": "Linear transformations",
    "tagline": "A linear transformation is a machine that preserves adding and scaling, so grids become honest grids.",
    "connections": {
      "buildsOn": [
        "vectors",
        "matrix-vector multiplication",
        "functions"
      ],
      "leadsTo": [
        "Matrix of a linear transformation",
        "Change of basis",
        "Eigenvalues"
      ],
      "usedWith": [
        "span",
        "basis",
        "composition",
        "systems of linear equations"
      ]
    },
    "motivation": "<p>You already know a function can take an input and return an output. A vector function does the same thing, but the input may be an arrow like $(2,1)$ and the output may be another arrow.</p><p>A <b>linear transformation</b> is the special kind that respects the two moves vectors are built from: adding vectors and scaling them. That makes it the basic language of rotations, projections, layers in neural nets, and feature maps.</p>",
    "definition": "<p>A transformation $T$ from vectors in $\\\\mathbb{R}^n$ to vectors in $\\\\mathbb{R}^m$ is <b>linear</b> if for all vectors $u,v$ and scalars $c$, $$T(u+v)=T(u)+T(v),\\\\qquad T(cu)=cT(u).$$ These rules say that vector arithmetic can happen before or after the map with the same result.</p><p>They imply $T(0)=0$, because $T(0)=T(0+0)=T(0)+T(0)$, so subtracting $T(0)$ gives $T(0)=0$. This is why a translation is not linear unless the translation vector is zero.</p><p><b>Assumptions that matter:</b> vectors must come from the stated domain, scalars are real unless stated otherwise, and both additivity and scaling must hold; preserving zero alone is not enough.</p>",
    "worked": {
      "problem": "Let $T(x,y)=(2x-y,x+3y)$. Compute $T(1,2)$ and verify linearity on $u=(1,0)$, $v=(0,2)$, and $c=3$.",
      "skills": [
        "evaluating transformations",
        "additivity",
        "homogeneity"
      ],
      "strategy": "Use the formula, then compare transform-after-operation with operation-after-transform.",
      "steps": [
        {
          "do": "Substitute $(1,2)$",
          "result": "$T(1,2)=(0,7)$",
          "why": "evaluate both output coordinates"
        },
        {
          "do": "Compute $u+v$",
          "result": "$u+v=(1,2)$",
          "why": "add the vectors first"
        },
        {
          "do": "Transform the sum",
          "result": "$T(u+v)=(0,7)$",
          "why": "use the value already found"
        },
        {
          "do": "Compute $T(u)+T(v)$",
          "result": "$(2,1)+(-2,6)=(0,7)$",
          "why": "transform separately and add"
        },
        {
          "do": "Compare scaling",
          "result": "$T(3u)=(6,3)=3T(u)$",
          "why": "both sides equal $(6,3)$"
        }
      ],
      "verify": "The tested rules agree, and the formula has only linear coordinate combinations.",
      "answer": "$T(1,2)=(0,7)$, and the checks support linearity.",
      "connects": "Linearity means the transformation respects the algebra that builds vectors."
    },
    "practice": [
      {
        "problem": "For $T(x,y)=(x+2y,3x-y)$, compute $T(2,-1)$ and $T(0,1)$.",
        "steps": [
          {
            "do": "Substitute $(2,-1)$",
            "result": "$T(2,-1)=(0,7)$",
            "why": "evaluate the rule"
          },
          {
            "do": "Substitute $(0,1)$",
            "result": "$T(0,1)=(2,-1)$",
            "why": "evaluate the second input"
          },
          {
            "do": "Check coordinates",
            "result": "both outputs have two entries",
            "why": "the map goes from $\\\\mathbb{R}^2$ to $\\\\mathbb{R}^2$"
          }
        ],
        "answer": "$T(2,-1)=(0,7)$ and $T(0,1)=(2,-1)$."
      },
      {
        "problem": "Decide whether $F(x,y)=(x+1,y)$ is linear.",
        "steps": [
          {
            "do": "Test zero",
            "result": "$F(0,0)=(1,0)$",
            "why": "linear maps send zero to zero"
          },
          {
            "do": "Compare",
            "result": "$(1,0)\\ne(0,0)$",
            "why": "the origin moved"
          },
          {
            "do": "Conclude",
            "result": "not linear",
            "why": "one failed necessary condition is enough"
          }
        ],
        "answer": "$F$ is not linear."
      },
      {
        "problem": "Check additivity for $T(x,y)=(4x,4y)$ using $u=(1,2)$ and $v=(3,-1)$.",
        "steps": [
          {
            "do": "Add inputs",
            "result": "$u+v=(4,1)$",
            "why": "coordinate addition"
          },
          {
            "do": "Transform sum",
            "result": "$T(4,1)=(16,4)$",
            "why": "scale by 4"
          },
          {
            "do": "Transform separately",
            "result": "$T(u)+T(v)=(4,8)+(12,-4)=(16,4)$",
            "why": "same result"
          }
        ],
        "answer": "Both sides equal $(16,4)$."
      },
      {
        "problem": "If $T(e_1)=(1,2)$ and $T(e_2)=(-3,4)$, find $T(5,-1)$.",
        "steps": [
          {
            "do": "Decompose",
            "result": "$(5,-1)=5e_1-e_2$",
            "why": "standard basis"
          },
          {
            "do": "Apply linearity",
            "result": "$5T(e_1)-T(e_2)$",
            "why": "preserve operations"
          },
          {
            "do": "Compute",
            "result": "$5(1,2)-(-3,4)=(8,6)$",
            "why": "combine vectors"
          }
        ],
        "answer": "$T(5,-1)=(8,6)$."
      },
      {
        "problem": "For $T(x_1,x_2)=(0.5x_1-2x_2,x_1+x_2)$, compare $T(2a)$ and $2T(a)$ for $a=(4,1)$.",
        "steps": [
          {
            "do": "Compute $2a$",
            "result": "$(8,2)$",
            "why": "double input"
          },
          {
            "do": "Transform $2a$",
            "result": "$(0,10)$",
            "why": "apply $T$"
          },
          {
            "do": "Transform then double",
            "result": "$2T(4,1)=2(0,5)=(0,10)$",
            "why": "same result"
          }
        ],
        "answer": "Both paths give $(0,10)$."
      }
    ],
    "applications": [
      {
        "title": "Linearity in a small numeric check",
        "background": "This lesson has a practical signature: one calculation can confirm whether the concept is behaving as expected.",
        "numbers": "Using vectors $(3,4)$ and $(1,2)$ gives dot product $11$, norm $5$, and projection coefficient $11/5$ when that is the relevant quantity."
      },
      {
        "title": "Neural network layers",
        "background": "Linear algebra is the arithmetic of learned representations. Every dense layer starts with matrix multiplication before bias and activation.",
        "numbers": "A weight matrix $\\begin{bmatrix}2&-1\\\\1&3\\\\end{bmatrix}$ sends feature vector $(4,5)$ to $(3,19)$."
      },
      {
        "title": "Computer vision geometry",
        "background": "Images are arrays, but shifts, rotations, projections, and filters are linear-algebra operations on coordinates or pixel patches.",
        "numbers": "A $90^\\\\circ$ rotation sends offset $(6,2)$ to $(-2,6)$."
      },
      {
        "title": "Recommendation embeddings",
        "background": "Embedding systems compare users, items, and ads as vectors, so directions, lengths, and projections become product behavior.",
        "numbers": "If two unit embeddings have dot product $0.8$, their cosine similarity is $0.8$."
      },
      {
        "title": "Optimization curvature",
        "background": "Training loss near a point is often approximated by a quadratic, and matrices describe its curvature by direction.",
        "numbers": "If curvature along a direction is $5$, a step of size $0.2$ changes the quadratic term by $0.5\\\\cdot5\\\\cdot0.2^2=0.1$."
      },
      {
        "title": "Data compression",
        "background": "Dimension reduction keeps the directions that explain the most signal and drops directions that contribute little.",
        "numbers": "If variances are $9,2,1$, keeping the first two keeps $11/12\\u0007pprox91.7\\\\%$ of the variance."
      }
    ],
    "applicationsClose": "Across models, images, signals, and embeddings, linear transformations keep vector arithmetic trustworthy while changing the space.",
    "takeaways": [
      "A linear transformation preserves addition and scalar multiplication.",
      "Every linear transformation sends $0$ to $0$.",
      "A linear map is determined by where it sends a basis.",
      "Nonzero offsets make a map affine rather than linear."
    ]
  },
  "math-09-15": {
    "id": "math-09-15",
    "title": "Matrix of a linear transformation",
    "tagline": "A matrix is the coordinate recipe for a linear transformation once bases are chosen.",
    "connections": {
      "buildsOn": [
        "vectors",
        "matrices",
        "linear transformations"
      ],
      "leadsTo": [
        "eigenvalues",
        "diagonalization",
        "least squares"
      ],
      "usedWith": [
        "basis",
        "determinants",
        "orthogonality",
        "matrix multiplication"
      ]
    },
    "motivation": "<p>You already know vectors can be added, scaled, and compared. The next step is to ask what structure is hiding inside a matrix or a space.</p><p><b>The matrix of a linear transformation</b> gives that structure a name. It turns a crowded calculation into a smaller story you can compute, check, and reuse.</p>",
    "definition": "<p><b>The matrix of a linear transformation</b> is a central linear-algebra idea for describing vectors and matrices with the right coordinates. The symbols matter: vectors such as $u$ and $v$ live in a vector space, matrices such as $A$ act on vectors, and scalars such as $\\\\lambda$ measure one-dimensional effects.</p><p>The key habit is to translate the concept into an equation, solve the equation one step at a time, and then verify by substituting back. Linear algebra is reliable because each abstraction has a concrete coordinate test.</p><p><b>Assumptions that matter:</b> dimensions must match, bases must be independent when coordinates are used, and square-matrix ideas such as determinants and eigenvalues require square matrices.</p>",
    "worked": {
      "problem": "Find the matrix of $T(x,y)=(3x+2y,-x+4y)$ and compute $T(5,-1).",
      "skills": [
        "basis images",
        "matrix multiplication"
      ],
      "strategy": "Transform standard basis vectors to build columns.",
      "steps": [
        {
          "do": "Compute $T(e_1)$",
          "result": "$T(1,0)=(3,-1)$",
          "why": "first column"
        },
        {
          "do": "Compute $T(e_2)$",
          "result": "$T(0,1)=(2,4)$",
          "why": "second column"
        },
        {
          "do": "Build $A$",
          "result": "$A=\\begin{bmatrix}3&2\\\\-1&4\\\\end{bmatrix}$",
          "why": "place images as columns"
        },
        {
          "do": "Multiply",
          "result": "$A(5,-1)=(13,-9)$",
          "why": "row dot products"
        },
        {
          "do": "Verify by formula",
          "result": "$T(5,-1)=(13,-9)$",
          "why": "direct substitution agrees"
        }
      ],
      "verify": "Both methods match.",
      "answer": "$A=\\begin{bmatrix}3&2\\\\-1&4\\\\end{bmatrix}$ and $T(5,-1)=(13,-9)$.",
      "connects": "Columns record where basis directions land."
    },
    "practice": [
      {
        "problem": "Build the matrix for $T(x,y)=(x-y,2x+3y)$.",
        "steps": [
          {
            "do": "Find $T(e_1)$",
            "result": "$(1,2)$",
            "why": "first column"
          },
          {
            "do": "Find $T(e_2)$",
            "result": "$(-1,3)$",
            "why": "second column"
          },
          {
            "do": "Assemble",
            "result": "$\\begin{bmatrix}1&-1\\\\2&3\\\\end{bmatrix}$",
            "why": "columns are images"
          }
        ],
        "answer": "$\\begin{bmatrix}1&-1\\\\2&3\\\\end{bmatrix}$."
      },
      {
        "problem": "For $A=\\begin{bmatrix}2&0\\\\1&-1\\\\end{bmatrix}$, find $T(e_1)$ and $T(e_2)$.",
        "steps": [
          {
            "do": "Read column one",
            "result": "$(2,1)$",
            "why": "image of $e_1$"
          },
          {
            "do": "Read column two",
            "result": "$(0,-1)$",
            "why": "image of $e_2$"
          },
          {
            "do": "Write rule",
            "result": "$T(x,y)=(2x,x-y)$",
            "why": "combine columns"
          }
        ],
        "answer": "$T(e_1)=(2,1)$ and $T(e_2)=(0,-1)$."
      },
      {
        "problem": "Compute $\\begin{bmatrix}1&2&0\\\\0&-1&3\\\\end{bmatrix}(4,1,-2)$.",
        "steps": [
          {
            "do": "Check size",
            "result": "output has two coordinates",
            "why": "matrix is $2\\times3$"
          },
          {
            "do": "Row one",
            "result": "$4+2=6$",
            "why": "dot product"
          },
          {
            "do": "Row two",
            "result": "$-1-6=-7$",
            "why": "dot product"
          }
        ],
        "answer": "$(6,-7)$."
      },
      {
        "problem": "A map sends $e_1$ to $(2,0,1)$ and $e_2$ to $(-1,4,3)$. Find $T(3,2)$.",
        "steps": [
          {
            "do": "Use coordinates",
            "result": "$3T(e_1)+2T(e_2)$",
            "why": "linearity"
          },
          {
            "do": "Scale",
            "result": "$(6,0,3)+(-2,8,6)$",
            "why": "multiply columns"
          },
          {
            "do": "Add",
            "result": "$(4,8,9)$",
            "why": "combine"
          }
        ],
        "answer": "$T(3,2)=(4,8,9)$."
      },
      {
        "problem": "A layer has $z_1=0.2x_1+0.5x_2$, $z_2=-x_1+3x_2$. Compute output for $(10,2)$.",
        "steps": [
          {
            "do": "Write matrix",
            "result": "$\\begin{bmatrix}0.2&0.5\\\\-1&3\\\\end{bmatrix}$",
            "why": "rows are coefficients"
          },
          {
            "do": "Compute $z_1$",
            "result": "$3$",
            "why": "first row"
          },
          {
            "do": "Compute $z_2$",
            "result": "$-4$",
            "why": "second row"
          }
        ],
        "answer": "The output is $(3,-4)$."
      }
    ],
    "applications": [
      {
        "title": "The matrix of a linear transformation in a small numeric check",
        "background": "This lesson has a practical signature: one calculation can confirm whether the concept is behaving as expected.",
        "numbers": "Using vectors $(3,4)$ and $(1,2)$ gives dot product $11$, norm $5$, and projection coefficient $11/5$ when that is the relevant quantity."
      },
      {
        "title": "Neural network layers",
        "background": "Linear algebra is the arithmetic of learned representations. Every dense layer starts with matrix multiplication before bias and activation.",
        "numbers": "A weight matrix $\\begin{bmatrix}2&-1\\\\1&3\\\\end{bmatrix}$ sends feature vector $(4,5)$ to $(3,19)$."
      },
      {
        "title": "Computer vision geometry",
        "background": "Images are arrays, but shifts, rotations, projections, and filters are linear-algebra operations on coordinates or pixel patches.",
        "numbers": "A $90^\\\\circ$ rotation sends offset $(6,2)$ to $(-2,6)$."
      },
      {
        "title": "Recommendation embeddings",
        "background": "Embedding systems compare users, items, and ads as vectors, so directions, lengths, and projections become product behavior.",
        "numbers": "If two unit embeddings have dot product $0.8$, their cosine similarity is $0.8$."
      },
      {
        "title": "Optimization curvature",
        "background": "Training loss near a point is often approximated by a quadratic, and matrices describe its curvature by direction.",
        "numbers": "If curvature along a direction is $5$, a step of size $0.2$ changes the quadratic term by $0.5\\\\cdot5\\\\cdot0.2^2=0.1$."
      },
      {
        "title": "Data compression",
        "background": "Dimension reduction keeps the directions that explain the most signal and drops directions that contribute little.",
        "numbers": "If variances are $9,2,1$, keeping the first two keeps $11/12\\u0007pprox91.7\\\\%$ of the variance."
      }
    ],
    "applicationsClose": "The matrix of a linear transformation is powerful because it converts a geometric idea into arithmetic that still remembers the geometry.",
    "takeaways": [
      "The standard matrix has columns $T(e_i)$.",
      "Matrix-vector multiplication combines columns using input coordinates.",
      "Rows compute output coordinates."
    ]
  },
  "math-09-16": {
    "id": "math-09-16",
    "title": "Change of basis",
    "tagline": "Change of basis lets the same vector speak in a coordinate system where the problem is easier.",
    "connections": {
      "buildsOn": [
        "vectors",
        "matrices",
        "linear transformations"
      ],
      "leadsTo": [
        "eigenvalues",
        "diagonalization",
        "least squares"
      ],
      "usedWith": [
        "basis",
        "determinants",
        "orthogonality",
        "matrix multiplication"
      ]
    },
    "motivation": "<p>You already know vectors can be added, scaled, and compared. The next step is to ask what structure is hiding inside a matrix or a space.</p><p><b>Change of basis</b> gives that structure a name. It turns a crowded calculation into a smaller story you can compute, check, and reuse.</p>",
    "definition": "<p><b>Change of basis</b> is a central linear-algebra idea for describing vectors and matrices with the right coordinates. The symbols matter: vectors such as $u$ and $v$ live in a vector space, matrices such as $A$ act on vectors, and scalars such as $\\\\lambda$ measure one-dimensional effects.</p><p>The key habit is to translate the concept into an equation, solve the equation one step at a time, and then verify by substituting back. Linear algebra is reliable because each abstraction has a concrete coordinate test.</p><p><b>Assumptions that matter:</b> dimensions must match, bases must be independent when coordinates are used, and square-matrix ideas such as determinants and eigenvalues require square matrices.</p>",
    "worked": {
      "problem": "For $B=((1,1),(1,-1))$, find $[(5,1)]_B$.",
      "skills": [
        "basis coordinates",
        "linear systems"
      ],
      "strategy": "Write $v=c_1b_1+c_2b_2$ and solve.",
      "steps": [
        {
          "do": "Set equation",
          "result": "$c_1(1,1)+c_2(1,-1)=(5,1)$",
          "why": "basis combination"
        },
        {
          "do": "Match coordinates",
          "result": "$c_1+c_2=5$, $c_1-c_2=1$",
          "why": "two equations"
        },
        {
          "do": "Add equations",
          "result": "$2c_1=6$",
          "why": "eliminate $c_2$"
        },
        {
          "do": "Solve",
          "result": "$c_1=3$",
          "why": "divide"
        },
        {
          "do": "Find $c_2$",
          "result": "$c_2=2$",
          "why": "substitute"
        }
      ],
      "verify": "Rebuilding gives $(5,1)$.",
      "answer": "$[(5,1)]_B=(3,2)$.",
      "connects": "The vector stays fixed while coordinates change."
    },
    "practice": [
      {
        "problem": "For $B=((2,0),(0,3))$, find $[(8,15)]_B$.",
        "steps": [
          {
            "do": "Write equations",
            "result": "$2c_1=8$, $3c_2=15$",
            "why": "scaled axes"
          },
          {
            "do": "Solve",
            "result": "$c_1=4$, $c_2=5$",
            "why": "divide"
          },
          {
            "do": "Check",
            "result": "$4(2,0)+5(0,3)=(8,15)$",
            "why": "rebuild"
          }
        ],
        "answer": "$(4,5)$."
      },
      {
        "problem": "Convert $[v]_B=(2,3)$ for $B=((1,0),(1,1))$ to standard coordinates.",
        "steps": [
          {
            "do": "Combine",
            "result": "$2(1,0)+3(1,1)$",
            "why": "use weights"
          },
          {
            "do": "Scale",
            "result": "$(2,0)+(3,3)$",
            "why": "multiply"
          },
          {
            "do": "Add",
            "result": "$(5,3)$",
            "why": "standard vector"
          }
        ],
        "answer": "$(5,3)$."
      },
      {
        "problem": "For $B=((1,2),(3,1))$, find $[(7,5)]_B$.",
        "steps": [
          {
            "do": "Equations",
            "result": "$c_1+3c_2=7$, $2c_1+c_2=5$",
            "why": "match coordinates"
          },
          {
            "do": "Substitute",
            "result": "$c_1=7-3c_2$",
            "why": "from first equation"
          },
          {
            "do": "Solve",
            "result": "$c_2=9/5$",
            "why": "use second equation"
          },
          {
            "do": "Find $c_1$",
            "result": "$8/5$",
            "why": "substitute back"
          }
        ],
        "answer": "$(8/5,9/5)$."
      },
      {
        "problem": "With $P_B=\\begin{bmatrix}1&2\\\\0&1\\\\end{bmatrix}$, find $[(5,2)]_B$.",
        "steps": [
          {
            "do": "Set equations",
            "result": "$c_1+2c_2=5$, $c_2=2$",
            "why": "matrix equation"
          },
          {
            "do": "Use $c_2$",
            "result": "$c_2=2$",
            "why": "second row"
          },
          {
            "do": "Solve $c_1$",
            "result": "$c_1=1$",
            "why": "first row"
          }
        ],
        "answer": "$(1,2)$."
      },
      {
        "problem": "For orthonormal $b_1=(1/\\\\sqrt2,1/\\\\sqrt2)$, $b_2=(1/\\\\sqrt2,-1/\\\\sqrt2)$, find coordinates of $(4,2)$.",
        "steps": [
          {
            "do": "Use dot products",
            "result": "$c_i=v\\\\cdot b_i$",
            "why": "orthonormal basis"
          },
          {
            "do": "Compute $c_1$",
            "result": "$3\\\\sqrt2$",
            "why": "$(4+2)/\\\\sqrt2$"
          },
          {
            "do": "Compute $c_2$",
            "result": "$\\\\sqrt2$",
            "why": "$(4-2)/\\\\sqrt2$"
          }
        ],
        "answer": "$(3\\\\sqrt2,\\\\sqrt2)$."
      }
    ],
    "applications": [
      {
        "title": "Change of basis in a small numeric check",
        "background": "This lesson has a practical signature: one calculation can confirm whether the concept is behaving as expected.",
        "numbers": "Using vectors $(3,4)$ and $(1,2)$ gives dot product $11$, norm $5$, and projection coefficient $11/5$ when that is the relevant quantity."
      },
      {
        "title": "Neural network layers",
        "background": "Linear algebra is the arithmetic of learned representations. Every dense layer starts with matrix multiplication before bias and activation.",
        "numbers": "A weight matrix $\\begin{bmatrix}2&-1\\\\1&3\\\\end{bmatrix}$ sends feature vector $(4,5)$ to $(3,19)$."
      },
      {
        "title": "Computer vision geometry",
        "background": "Images are arrays, but shifts, rotations, projections, and filters are linear-algebra operations on coordinates or pixel patches.",
        "numbers": "A $90^\\\\circ$ rotation sends offset $(6,2)$ to $(-2,6)$."
      },
      {
        "title": "Recommendation embeddings",
        "background": "Embedding systems compare users, items, and ads as vectors, so directions, lengths, and projections become product behavior.",
        "numbers": "If two unit embeddings have dot product $0.8$, their cosine similarity is $0.8$."
      },
      {
        "title": "Optimization curvature",
        "background": "Training loss near a point is often approximated by a quadratic, and matrices describe its curvature by direction.",
        "numbers": "If curvature along a direction is $5$, a step of size $0.2$ changes the quadratic term by $0.5\\\\cdot5\\\\cdot0.2^2=0.1$."
      },
      {
        "title": "Data compression",
        "background": "Dimension reduction keeps the directions that explain the most signal and drops directions that contribute little.",
        "numbers": "If variances are $9,2,1$, keeping the first two keeps $11/12\\u0007pprox91.7\\\\%$ of the variance."
      }
    ],
    "applicationsClose": "Change of basis is powerful because it converts a geometric idea into arithmetic that still remembers the geometry.",
    "takeaways": [
      "Coordinates are weights in a named basis.",
      "$P_B$ maps basis coordinates to standard coordinates.",
      "$P_B^{-1}$ maps standard coordinates back."
    ]
  },
  "math-09-17": {
    "id": "math-09-17",
    "title": "Determinants",
    "tagline": "The determinant measures signed area or volume scaling, and it tells whether a matrix collapses space.",
    "connections": {
      "buildsOn": [
        "vectors",
        "matrices",
        "linear transformations"
      ],
      "leadsTo": [
        "eigenvalues",
        "diagonalization",
        "least squares"
      ],
      "usedWith": [
        "basis",
        "determinants",
        "orthogonality",
        "matrix multiplication"
      ]
    },
    "motivation": "<p>You already know vectors can be added, scaled, and compared. The next step is to ask what structure is hiding inside a matrix or a space.</p><p><b>Determinants</b> gives that structure a name. It turns a crowded calculation into a smaller story you can compute, check, and reuse.</p>",
    "definition": "<p><b>Determinants</b> is a central linear-algebra idea for describing vectors and matrices with the right coordinates. The symbols matter: vectors such as $u$ and $v$ live in a vector space, matrices such as $A$ act on vectors, and scalars such as $\\\\lambda$ measure one-dimensional effects.</p><p>The key habit is to translate the concept into an equation, solve the equation one step at a time, and then verify by substituting back. Linear algebra is reliable because each abstraction has a concrete coordinate test.</p><p><b>Assumptions that matter:</b> dimensions must match, bases must be independent when coordinates are used, and square-matrix ideas such as determinants and eigenvalues require square matrices.</p>",
    "worked": {
      "problem": "Compute $\\\\det\\begin{bmatrix}3&2\\\\1&5\\\\end{bmatrix}$ and interpret it.",
      "skills": [
        "determinants",
        "area scaling"
      ],
      "strategy": "Use $ad-bc$.",
      "steps": [
        {
          "do": "Compute $ad$",
          "result": "$15$",
          "why": "main diagonal"
        },
        {
          "do": "Compute $bc$",
          "result": "$2$",
          "why": "off diagonal"
        },
        {
          "do": "Subtract",
          "result": "$13$",
          "why": "determinant"
        },
        {
          "do": "Interpret",
          "result": "area scale $13$",
          "why": "absolute determinant"
        }
      ],
      "verify": "Columns are not multiples, so nonzero area is sensible.",
      "answer": "$13$; areas scale by $13$.",
      "connects": "The determinant is signed volume scaling."
    },
    "practice": [
      {
        "problem": "Compute $\\\\det\\begin{bmatrix}4&1\\\\2&3\\\\end{bmatrix}$.",
        "steps": [
          {
            "do": "Compute $ad$",
            "result": "$12$",
            "why": "main product"
          },
          {
            "do": "Compute $bc$",
            "result": "$2$",
            "why": "off product"
          },
          {
            "do": "Subtract",
            "result": "$10$",
            "why": "determinant"
          }
        ],
        "answer": "$10$."
      },
      {
        "problem": "Compute $\\\\det\\begin{bmatrix}1&2\\\\3&6\\\\end{bmatrix}$.",
        "steps": [
          {
            "do": "Compute products",
            "result": "$6$ and $6$",
            "why": "diagonals"
          },
          {
            "do": "Subtract",
            "result": "$0$",
            "why": "determinant"
          },
          {
            "do": "Interpret",
            "result": "columns dependent",
            "why": "second is twice first"
          }
        ],
        "answer": "$0$."
      },
      {
        "problem": "Find determinant of upper triangular $\\begin{bmatrix}2&7&1\\\\0&3&5\\\\0&0&4\\\\end{bmatrix}$.",
        "steps": [
          {
            "do": "Use triangular rule",
            "result": "multiply diagonal",
            "why": "zeros below diagonal"
          },
          {
            "do": "Multiply",
            "result": "$2\\\\cdot3\\\\cdot4=24$",
            "why": "product"
          },
          {
            "do": "Interpret",
            "result": "nonzero",
            "why": "invertible"
          }
        ],
        "answer": "$24$."
      },
      {
        "problem": "If $\\\\det(A)=5$ for $3\\times3$ $A$, find $\\\\det(2A)$.",
        "steps": [
          {
            "do": "Use rule",
            "result": "$\\\\det(cA)=c^n\\\\det(A)$",
            "why": "dimension $n$"
          },
          {
            "do": "Substitute",
            "result": "$2^3\\\\cdot5$",
            "why": "three dimensions"
          },
          {
            "do": "Compute",
            "result": "$40$",
            "why": "multiply"
          }
        ],
        "answer": "$40$."
      },
      {
        "problem": "For $\\\\Sigma=\\begin{bmatrix}4&1\\\\1&2\\\\end{bmatrix}$, compute $\\\\det(\\\\Sigma)$.",
        "steps": [
          {
            "do": "Compute $ad$",
            "result": "$8$",
            "why": "main"
          },
          {
            "do": "Compute $bc$",
            "result": "$1$",
            "why": "off"
          },
          {
            "do": "Subtract",
            "result": "$7$",
            "why": "determinant"
          },
          {
            "do": "Take root",
            "result": "$\\\\sqrt7\\u0007pprox2.65$",
            "why": "volume scale"
          }
        ],
        "answer": "$7$."
      }
    ],
    "applications": [
      {
        "title": "Determinants in a small numeric check",
        "background": "This lesson has a practical signature: one calculation can confirm whether the concept is behaving as expected.",
        "numbers": "Using vectors $(3,4)$ and $(1,2)$ gives dot product $11$, norm $5$, and projection coefficient $11/5$ when that is the relevant quantity."
      },
      {
        "title": "Neural network layers",
        "background": "Linear algebra is the arithmetic of learned representations. Every dense layer starts with matrix multiplication before bias and activation.",
        "numbers": "A weight matrix $\\begin{bmatrix}2&-1\\\\1&3\\\\end{bmatrix}$ sends feature vector $(4,5)$ to $(3,19)$."
      },
      {
        "title": "Computer vision geometry",
        "background": "Images are arrays, but shifts, rotations, projections, and filters are linear-algebra operations on coordinates or pixel patches.",
        "numbers": "A $90^\\\\circ$ rotation sends offset $(6,2)$ to $(-2,6)$."
      },
      {
        "title": "Recommendation embeddings",
        "background": "Embedding systems compare users, items, and ads as vectors, so directions, lengths, and projections become product behavior.",
        "numbers": "If two unit embeddings have dot product $0.8$, their cosine similarity is $0.8$."
      },
      {
        "title": "Optimization curvature",
        "background": "Training loss near a point is often approximated by a quadratic, and matrices describe its curvature by direction.",
        "numbers": "If curvature along a direction is $5$, a step of size $0.2$ changes the quadratic term by $0.5\\\\cdot5\\\\cdot0.2^2=0.1$."
      },
      {
        "title": "Data compression",
        "background": "Dimension reduction keeps the directions that explain the most signal and drops directions that contribute little.",
        "numbers": "If variances are $9,2,1$, keeping the first two keeps $11/12\\u0007pprox91.7\\\\%$ of the variance."
      }
    ],
    "applicationsClose": "Determinants is powerful because it converts a geometric idea into arithmetic that still remembers the geometry.",
    "takeaways": [
      "For $2\\times2$, determinant is $ad-bc$.",
      "Magnitude gives area or volume scale.",
      "Zero determinant means singular."
    ]
  },
  "math-09-18": {
    "id": "math-09-18",
    "title": "The eigenvalue equation",
    "tagline": "An eigenvector keeps its direction under a matrix; only its length and sign change.",
    "connections": {
      "buildsOn": [
        "vectors",
        "matrices",
        "linear transformations"
      ],
      "leadsTo": [
        "eigenvalues",
        "diagonalization",
        "least squares"
      ],
      "usedWith": [
        "basis",
        "determinants",
        "orthogonality",
        "matrix multiplication"
      ]
    },
    "motivation": "<p>You already know vectors can be added, scaled, and compared. The next step is to ask what structure is hiding inside a matrix or a space.</p><p><b>The eigenvalue equation</b> gives that structure a name. It turns a crowded calculation into a smaller story you can compute, check, and reuse.</p>",
    "definition": "<p><b>The eigenvalue equation</b> is a central linear-algebra idea for describing vectors and matrices with the right coordinates. The symbols matter: vectors such as $u$ and $v$ live in a vector space, matrices such as $A$ act on vectors, and scalars such as $\\\\lambda$ measure one-dimensional effects.</p><p>The key habit is to translate the concept into an equation, solve the equation one step at a time, and then verify by substituting back. Linear algebra is reliable because each abstraction has a concrete coordinate test.</p><p><b>Assumptions that matter:</b> dimensions must match, bases must be independent when coordinates are used, and square-matrix ideas such as determinants and eigenvalues require square matrices.</p>",
    "worked": {
      "problem": "For $A=\\begin{bmatrix}2&0\\\\0&3\\\\end{bmatrix}$, verify eigenpairs for $e_1$ and $e_2$.",
      "skills": [
        "eigenpairs",
        "matrix multiplication"
      ],
      "strategy": "Multiply each basis vector.",
      "steps": [
        {
          "do": "Compute $Ae_1$",
          "result": "$(2,0)$",
          "why": "first column"
        },
        {
          "do": "Compare",
          "result": "$(2,0)=2e_1$",
          "why": "same direction"
        },
        {
          "do": "Compute $Ae_2$",
          "result": "$(0,3)$",
          "why": "second column"
        },
        {
          "do": "Compare",
          "result": "$(0,3)=3e_2$",
          "why": "same direction"
        }
      ],
      "verify": "Each output is a scalar multiple of the input.",
      "answer": "$e_1$ has eigenvalue $2$ and $e_2$ has eigenvalue $3$.",
      "connects": "Eigenvectors make matrix action one-dimensional."
    },
    "practice": [
      {
        "problem": "Is $(1,1)$ an eigenvector of $\\begin{bmatrix}2&0\\\\0&3\\\\end{bmatrix}$?",
        "steps": [
          {
            "do": "Multiply",
            "result": "$(2,3)$",
            "why": "apply matrix"
          },
          {
            "do": "Compare ratios",
            "result": "$2/1=2$, $3/1=3$",
            "why": "ratios differ"
          },
          {
            "do": "Conclude",
            "result": "not an eigenvector",
            "why": "not one scalar multiple"
          }
        ],
        "answer": "No."
      },
      {
        "problem": "Describe eigenvectors of $4I$.",
        "steps": [
          {
            "do": "Multiply",
            "result": "$4Iv=4v$",
            "why": "any vector"
          },
          {
            "do": "Require nonzero",
            "result": "$v\\ne0$",
            "why": "definition"
          },
          {
            "do": "State eigenvalue",
            "result": "$4$",
            "why": "scale factor"
          }
        ],
        "answer": "Every nonzero vector is an eigenvector with eigenvalue $4$."
      },
      {
        "problem": "Solve $(A-2I)v=0$ for $A=\\begin{bmatrix}2&1\\\\0&2\\\\end{bmatrix}$.",
        "steps": [
          {
            "do": "Subtract",
            "result": "$A-2I=\\begin{bmatrix}0&1\\\\0&0\\\\end{bmatrix}$",
            "why": "candidate value"
          },
          {
            "do": "Equation",
            "result": "$y=0$",
            "why": "first row"
          },
          {
            "do": "Free variable",
            "result": "$x=t$",
            "why": "nonzero allowed"
          }
        ],
        "answer": "Nonzero multiples of $(1,0)$."
      },
      {
        "problem": "If $A(2,1)=(3,1.5)$, find $\\\\lambda$.",
        "steps": [
          {
            "do": "Use first coordinate",
            "result": "$3=2\\\\lambda$",
            "why": "scalar multiple"
          },
          {
            "do": "Solve",
            "result": "$\\\\lambda=1.5$",
            "why": "divide"
          },
          {
            "do": "Check second",
            "result": "$1.5=1.5\\\\cdot1$",
            "why": "consistent"
          }
        ],
        "answer": "$\\\\lambda=1.5$."
      },
      {
        "problem": "For $A=\\begin{bmatrix}0&1\\\\1&0\\\\end{bmatrix}$, find an eigenvector with eigenvalue $1$.",
        "steps": [
          {
            "do": "Solve $Av=v$",
            "result": "$(y,x)=(x,y)$",
            "why": "swap equals original"
          },
          {
            "do": "Equation",
            "result": "$x=y$",
            "why": "coordinates equal"
          },
          {
            "do": "Choose vector",
            "result": "$(1,1)$",
            "why": "nonzero example"
          }
        ],
        "answer": "$(1,1)$ works."
      }
    ],
    "applications": [
      {
        "title": "The eigenvalue equation in a small numeric check",
        "background": "This lesson has a practical signature: one calculation can confirm whether the concept is behaving as expected.",
        "numbers": "Using vectors $(3,4)$ and $(1,2)$ gives dot product $11$, norm $5$, and projection coefficient $11/5$ when that is the relevant quantity."
      },
      {
        "title": "Neural network layers",
        "background": "Linear algebra is the arithmetic of learned representations. Every dense layer starts with matrix multiplication before bias and activation.",
        "numbers": "A weight matrix $\\begin{bmatrix}2&-1\\\\1&3\\\\end{bmatrix}$ sends feature vector $(4,5)$ to $(3,19)$."
      },
      {
        "title": "Computer vision geometry",
        "background": "Images are arrays, but shifts, rotations, projections, and filters are linear-algebra operations on coordinates or pixel patches.",
        "numbers": "A $90^\\\\circ$ rotation sends offset $(6,2)$ to $(-2,6)$."
      },
      {
        "title": "Recommendation embeddings",
        "background": "Embedding systems compare users, items, and ads as vectors, so directions, lengths, and projections become product behavior.",
        "numbers": "If two unit embeddings have dot product $0.8$, their cosine similarity is $0.8$."
      },
      {
        "title": "Optimization curvature",
        "background": "Training loss near a point is often approximated by a quadratic, and matrices describe its curvature by direction.",
        "numbers": "If curvature along a direction is $5$, a step of size $0.2$ changes the quadratic term by $0.5\\\\cdot5\\\\cdot0.2^2=0.1$."
      },
      {
        "title": "Data compression",
        "background": "Dimension reduction keeps the directions that explain the most signal and drops directions that contribute little.",
        "numbers": "If variances are $9,2,1$, keeping the first two keeps $11/12\\u0007pprox91.7\\\\%$ of the variance."
      }
    ],
    "applicationsClose": "The eigenvalue equation is powerful because it converts a geometric idea into arithmetic that still remembers the geometry.",
    "takeaways": [
      "Eigenpairs satisfy $Av=\\\\lambda v$.",
      "Eigenvectors are nonzero.",
      "Eigenvalues are scale factors along invariant directions."
    ]
  },
  "math-09-19": {
    "id": "math-09-19",
    "title": "The characteristic polynomial",
    "tagline": "The characteristic polynomial turns eigenvalue hunting into solving one determinant equation.",
    "connections": {
      "buildsOn": [
        "matrices",
        "determinants",
        "basis coordinates"
      ],
      "leadsTo": [
        "Diagonalization",
        "Similarity",
        "spectral methods"
      ],
      "usedWith": [
        "eigenvalues",
        "linear systems",
        "orthogonality",
        "matrix multiplication"
      ]
    },
    "motivation": "<p>You have seen matrices act on vectors. Now we want a way to expose the hidden directions, coordinates, or geometric relationships that make a matrix easier to understand.</p><p><b>The characteristic polynomial</b> is one of those organizing ideas. It is patient linear algebra: write the right equation, compute carefully, and then check that the geometry agrees.</p>",
    "definition": "<p><b>The characteristic polynomial</b> turns a matrix or vector question into a precise equation with dimensions that must match. The main symbols are vectors such as $u$ and $v$, matrices such as $A$, scalars such as $lambda$, and basis matrices such as $P$.</p><p>The reason this works is that linear algebra preserves structure: linear combinations remain linear combinations, dot products measure aligned components, and similar matrices describe the same transformation in different coordinates.</p><p><b>Assumptions that matter:</b> square-matrix ideas require square matrices; basis matrices must be invertible; orthogonal formulas require nonzero vectors; and every computed answer should be verified in the original equation.</p>",
    "worked": {
      "problem": "Find the characteristic polynomial of $A=\\begin{bmatrix}2&1\\\\0&3end{bmatrix}$ and its eigenvalues.",
      "skills": [
        "determinants",
        "eigenvalues",
        "factoring"
      ],
      "strategy": "Build $A-lambda I$, take its determinant, then solve where it is zero.",
      "steps": [
        {
          "do": "Form $A-lambda I$",
          "result": "$\\begin{bmatrix}2-lambda&1\\\\0&3-lambdaend{bmatrix}$",
          "why": "subtract $lambda$ from diagonal entries"
        },
        {
          "do": "Take the determinant",
          "result": "$(2-lambda)(3-lambda)-0$",
          "why": "upper triangular determinant"
        },
        {
          "do": "Write the polynomial",
          "result": "$p(lambda)=(2-lambda)(3-lambda)$",
          "why": "characteristic polynomial"
        },
        {
          "do": "Set it equal to zero",
          "result": "$(2-lambda)(3-lambda)=0$",
          "why": "eigenvalues make $A-lambda I$ singular"
        },
        {
          "do": "Solve",
          "result": "$lambda=2,3$",
          "why": "zero product property"
        }
      ],
      "verify": "A triangular matrix has eigenvalues on the diagonal, so $2$ and $3$ are expected.",
      "answer": "$p(lambda)=(2-lambda)(3-lambda)$; eigenvalues are $2$ and $3$.",
      "connects": "The determinant detects the values where a nonzero eigenvector can exist."
    },
    "practice": [
      {
        "problem": "Find $p(lambda)$ for $\\begin{bmatrix}4&0\\\\0&1end{bmatrix}$.",
        "steps": [
          {
            "do": "Subtract $lambda I$",
            "result": "$\\begin{bmatrix}4-lambda&0\\\\0&1-lambdaend{bmatrix}$",
            "why": "diagonal shift"
          },
          {
            "do": "Take determinant",
            "result": "$(4-lambda)(1-lambda)$",
            "why": "diagonal matrix"
          },
          {
            "do": "Set zero",
            "result": "$(4-lambda)(1-lambda)=0$",
            "why": "eigenvalue equation"
          },
          {
            "do": "Solve",
            "result": "$lambda=4,1$",
            "why": "zero product"
          }
        ],
        "answer": "$p(lambda)=(4-lambda)(1-lambda)$; eigenvalues $4$ and $1$."
      },
      {
        "problem": "Find the characteristic polynomial of $\\begin{bmatrix}1&2\\\\3&4end{bmatrix}$.",
        "steps": [
          {
            "do": "Form $A-lambda I$",
            "result": "$\\begin{bmatrix}1-lambda&2\\\\3&4-lambdaend{bmatrix}$",
            "why": "subtract on diagonal"
          },
          {
            "do": "Apply determinant",
            "result": "$(1-lambda)(4-lambda)-6$",
            "why": "use $ad-bc$"
          },
          {
            "do": "Expand",
            "result": "$lambda^2-5lambda-2$",
            "why": "combine terms"
          },
          {
            "do": "State polynomial",
            "result": "$p(lambda)=lambda^2-5lambda-2$",
            "why": "monic form"
          }
        ],
        "answer": "$p(lambda)=lambda^2-5lambda-2$."
      },
      {
        "problem": "Use trace and determinant to write the characteristic polynomial of $\\begin{bmatrix}0&-2\\\\1&3end{bmatrix}$.",
        "steps": [
          {
            "do": "Compute trace",
            "result": "$0+3=3$",
            "why": "sum diagonal"
          },
          {
            "do": "Compute determinant",
            "result": "$0cdot3-(-2)cdot1=2$",
            "why": "area scale"
          },
          {
            "do": "Use monic form",
            "result": "$lambda^2-3lambda+2$",
            "why": "for $2\\times2$, $lambda^2-operatorname{tr}(A)lambda+det(A)$"
          },
          {
            "do": "Factor",
            "result": "$(lambda-1)(lambda-2)$",
            "why": "eigenvalues visible"
          }
        ],
        "answer": "$p(lambda)=lambda^2-3lambda+2$."
      },
      {
        "problem": "Find eigenvalues of a matrix with characteristic polynomial $(lambda-5)^2(lambda+1)$.",
        "steps": [
          {
            "do": "Set polynomial to zero",
            "result": "$(lambda-5)^2(lambda+1)=0$",
            "why": "roots are eigenvalues"
          },
          {
            "do": "Solve first factor",
            "result": "$lambda=5$",
            "why": "double root"
          },
          {
            "do": "Solve second factor",
            "result": "$lambda=-1$",
            "why": "single root"
          },
          {
            "do": "State multiplicities",
            "result": "$5$ has algebraic multiplicity $2$",
            "why": "exponent gives multiplicity"
          }
        ],
        "answer": "Eigenvalues are $5$ with multiplicity $2$ and $-1$ with multiplicity $1$."
      },
      {
        "problem": "A covariance matrix has characteristic polynomial $lambda^2-10lambda+9$. Find principal variances. ",
        "steps": [
          {
            "do": "Factor polynomial",
            "result": "$(lambda-1)(lambda-9)$",
            "why": "numbers multiply to 9 and add to 10"
          },
          {
            "do": "Find roots",
            "result": "$lambda=1,9$",
            "why": "set factors to zero"
          },
          {
            "do": "Order variances",
            "result": "$9$ then $1$",
            "why": "PCA sorts descending"
          },
          {
            "do": "Compute explained fraction",
            "result": "$9/(9+1)=0.9$",
            "why": "first component share"
          }
        ],
        "answer": "Principal variances are $9$ and $1$; the first explains $90%$."
      }
    ],
    "applications": [
      {
        "title": "The characteristic polynomial in ML geometry",
        "background": "This idea gives models a way to see structure in high-dimensional data instead of treating every coordinate as unrelated.",
        "numbers": "For vectors $(3,4)$ and $(1,2)$, the dot product is $11$ and the norm of $(3,4)$ is $5$, numbers that feed angles and projections."
      },
      {
        "title": "Principal components",
        "background": "PCA summarizes data by directions and coordinate changes derived from covariance matrices.",
        "numbers": "Eigenvalues $9,2,1$ mean the first two components preserve $11/12approx91.7%$ of total variance."
      },
      {
        "title": "Optimization curvature",
        "background": "Near a solution, a loss is often approximated by a quadratic matrix expression.",
        "numbers": "Curvature $8$ along a direction and step $0.1$ contributes $0.5cdot8cdot0.01=0.04$ to the quadratic change."
      },
      {
        "title": "Recommendation embeddings",
        "background": "Embedding search depends on geometry: lengths, angles, projections, and subspaces all affect similarity.",
        "numbers": "Two unit item vectors with dot product $0.75$ have cosine similarity $0.75$."
      },
      {
        "title": "Numerical stability",
        "background": "Linear algebra algorithms prefer bases or factorizations that avoid magnifying rounding error.",
        "numbers": "Orthogonal vectors of norm $1$ preserve length, so a vector of norm $5$ remains norm $5$ after an orthogonal change of basis."
      },
      {
        "title": "Iterative systems",
        "background": "Repeated matrix actions explain diffusion, ranking, and recurrence behavior.",
        "numbers": "A component scaled by $0.6$ becomes $10,6,3.6$ after two steps, while one scaled by $1.1$ becomes $10,11,12.1$."
      }
    ],
    "applicationsClose": "The characteristic polynomial matters because it connects a symbolic calculation to a geometric story you can verify with numbers.",
    "takeaways": [
      "The characteristic polynomial is $det(A-lambda I)$.",
      "Eigenvalues are roots of the characteristic polynomial.",
      "For $2\\times2$ matrices, trace and determinant give a fast check."
    ]
  },
  "math-09-20": {
    "id": "math-09-20",
    "title": "Diagonalization",
    "tagline": "Diagonalization rewrites a matrix as independent scaling along eigenvector directions.",
    "connections": {
      "buildsOn": [
        "matrices",
        "determinants",
        "basis coordinates"
      ],
      "leadsTo": [
        "Diagonalization",
        "Similarity",
        "spectral methods"
      ],
      "usedWith": [
        "eigenvalues",
        "linear systems",
        "orthogonality",
        "matrix multiplication"
      ]
    },
    "motivation": "<p>You have seen matrices act on vectors. Now we want a way to expose the hidden directions, coordinates, or geometric relationships that make a matrix easier to understand.</p><p><b>Diagonalization</b> is one of those organizing ideas. It is patient linear algebra: write the right equation, compute carefully, and then check that the geometry agrees.</p>",
    "definition": "<p><b>Diagonalization</b> turns a matrix or vector question into a precise equation with dimensions that must match. The main symbols are vectors such as $u$ and $v$, matrices such as $A$, scalars such as $lambda$, and basis matrices such as $P$.</p><p>The reason this works is that linear algebra preserves structure: linear combinations remain linear combinations, dot products measure aligned components, and similar matrices describe the same transformation in different coordinates.</p><p><b>Assumptions that matter:</b> square-matrix ideas require square matrices; basis matrices must be invertible; orthogonal formulas require nonzero vectors; and every computed answer should be verified in the original equation.</p>",
    "worked": {
      "problem": "Diagonalize $A=\\begin{bmatrix}2&0\\\\0&5end{bmatrix}$ and compute $A^3(1,1)$.",
      "skills": [
        "eigenvectors",
        "powers",
        "diagonal matrices"
      ],
      "strategy": "Use the standard eigenbasis, where powers only raise diagonal entries.",
      "steps": [
        {
          "do": "Identify eigenvectors",
          "result": "$e_1$ and $e_2$",
          "why": "diagonal matrix preserves axes"
        },
        {
          "do": "Write $P$",
          "result": "$P=I$",
          "why": "standard eigenvectors"
        },
        {
          "do": "Write $D$",
          "result": "$D=\\begin{bmatrix}2&0\\\\0&5end{bmatrix}$",
          "why": "diagonal eigenvalue matrix"
        },
        {
          "do": "Compute $D^3$",
          "result": "$\\begin{bmatrix}8&0\\\\0&125end{bmatrix}$",
          "why": "raise each diagonal entry"
        },
        {
          "do": "Apply to $(1,1)$",
          "result": "$(8,125)$",
          "why": "scale coordinates independently"
        }
      ],
      "verify": "Direct multiplication by $A$ three times gives $(2,5)$, $(4,25)$, then $(8,125)$.",
      "answer": "$A=PDP^{-1}$ with $P=I$, and $A^3(1,1)=(8,125)$.",
      "connects": "Diagonalization makes repeated matrix action easy."
    },
    "practice": [
      {
        "problem": "If $A=PDP^{-1}$ with $D=operatorname{diag}(3,4)$, find $A^2$.",
        "steps": [
          {
            "do": "Square the factorization",
            "result": "$A^2=PD P^{-1}PD P^{-1}$",
            "why": "write two copies"
          },
          {
            "do": "Cancel middle",
            "result": "$P^{-1}P=I$",
            "why": "inverse property"
          },
          {
            "do": "Simplify",
            "result": "$A^2=PD^2P^{-1}$",
            "why": "only diagonal powers remain"
          },
          {
            "do": "Compute $D^2$",
            "result": "$operatorname{diag}(9,16)$",
            "why": "square entries"
          }
        ],
        "answer": "$A^2=Poperatorname{diag}(9,16)P^{-1}$."
      },
      {
        "problem": "A matrix has independent eigenvectors $(1,0),(1,1)$ with eigenvalues $2,3$. Write $P$ and $D$.",
        "steps": [
          {
            "do": "Place eigenvectors as columns",
            "result": "$P=\\begin{bmatrix}1&1\\\\0&1end{bmatrix}$",
            "why": "column order matters"
          },
          {
            "do": "Match eigenvalues",
            "result": "$D=\\begin{bmatrix}2&0\\\\0&3end{bmatrix}$",
            "why": "same order as columns"
          },
          {
            "do": "State factorization",
            "result": "$A=PDP^{-1}$",
            "why": "diagonalizable form"
          }
        ],
        "answer": "$P=\\begin{bmatrix}1&1\\\\0&1end{bmatrix}$ and $D=\\begin{bmatrix}2&0\\\\0&3end{bmatrix}$."
      },
      {
        "problem": "Use diagonalization with $D=operatorname{diag}(0.5,2)$ to compute $D^4(8,1)$.",
        "steps": [
          {
            "do": "Raise diagonal entries",
            "result": "$D^4=operatorname{diag}(0.5^4,2^4)$",
            "why": "powers are entrywise"
          },
          {
            "do": "Compute powers",
            "result": "$0.5^4=1/16$, $2^4=16$",
            "why": "arithmetic"
          },
          {
            "do": "Apply to vector",
            "result": "$(8/16,16)$",
            "why": "scale coordinates"
          },
          {
            "do": "Simplify",
            "result": "$(0.5,16)$",
            "why": "final vector"
          }
        ],
        "answer": "$D^4(8,1)=(0.5,16)$."
      },
      {
        "problem": "Why is $\\begin{bmatrix}1&1\\\\0&1end{bmatrix}$ not diagonalized by two independent eigenvectors?",
        "steps": [
          {
            "do": "Find eigenvalue",
            "result": "only $lambda=1$",
            "why": "triangular diagonal"
          },
          {
            "do": "Solve $A-I$",
            "result": "$\\begin{bmatrix}0&1\\\\0&0end{bmatrix}v=0$",
            "why": "eigenvector equation"
          },
          {
            "do": "Get condition",
            "result": "$y=0$",
            "why": "only one free direction"
          },
          {
            "do": "Count eigenvectors",
            "result": "one-dimensional eigenspace",
            "why": "not enough for a basis"
          }
        ],
        "answer": "It is not diagonalizable because it has only one independent eigenvector."
      },
      {
        "problem": "A model transition has eigenvalues $0.9$ and $0.2$. Which component dominates after many steps?",
        "steps": [
          {
            "do": "Compare powers",
            "result": "$0.9^k$ versus $0.2^k$",
            "why": "repeated action"
          },
          {
            "do": "Compute for $k=3$",
            "result": "$0.729$ and $0.008$",
            "why": "quick example"
          },
          {
            "do": "Read dominance",
            "result": "$0.9$ component",
            "why": "decays much slower"
          },
          {
            "do": "Interpret",
            "result": "long-run behavior follows larger magnitude eigenvalue",
            "why": "spectral dominance"
          }
        ],
        "answer": "The $0.9$ eigencomponent dominates."
      }
    ],
    "applications": [
      {
        "title": "Diagonalization in ML geometry",
        "background": "This idea gives models a way to see structure in high-dimensional data instead of treating every coordinate as unrelated.",
        "numbers": "For vectors $(3,4)$ and $(1,2)$, the dot product is $11$ and the norm of $(3,4)$ is $5$, numbers that feed angles and projections."
      },
      {
        "title": "Principal components",
        "background": "PCA summarizes data by directions and coordinate changes derived from covariance matrices.",
        "numbers": "Eigenvalues $9,2,1$ mean the first two components preserve $11/12approx91.7%$ of total variance."
      },
      {
        "title": "Optimization curvature",
        "background": "Near a solution, a loss is often approximated by a quadratic matrix expression.",
        "numbers": "Curvature $8$ along a direction and step $0.1$ contributes $0.5cdot8cdot0.01=0.04$ to the quadratic change."
      },
      {
        "title": "Recommendation embeddings",
        "background": "Embedding search depends on geometry: lengths, angles, projections, and subspaces all affect similarity.",
        "numbers": "Two unit item vectors with dot product $0.75$ have cosine similarity $0.75$."
      },
      {
        "title": "Numerical stability",
        "background": "Linear algebra algorithms prefer bases or factorizations that avoid magnifying rounding error.",
        "numbers": "Orthogonal vectors of norm $1$ preserve length, so a vector of norm $5$ remains norm $5$ after an orthogonal change of basis."
      },
      {
        "title": "Iterative systems",
        "background": "Repeated matrix actions explain diffusion, ranking, and recurrence behavior.",
        "numbers": "A component scaled by $0.6$ becomes $10,6,3.6$ after two steps, while one scaled by $1.1$ becomes $10,11,12.1$."
      }
    ],
    "applicationsClose": "Diagonalization matters because it connects a symbolic calculation to a geometric story you can verify with numbers.",
    "takeaways": [
      "Diagonalization has the form $A=PDP^{-1}$.",
      "Columns of $P$ are independent eigenvectors.",
      "Powers become $A^k=PD^kP^{-1}$."
    ]
  },
  "math-09-21": {
    "id": "math-09-21",
    "title": "Similarity",
    "tagline": "Similarity says two matrices can be the same linear map written in different coordinate languages.",
    "connections": {
      "buildsOn": [
        "matrices",
        "determinants",
        "basis coordinates"
      ],
      "leadsTo": [
        "Diagonalization",
        "Similarity",
        "spectral methods"
      ],
      "usedWith": [
        "eigenvalues",
        "linear systems",
        "orthogonality",
        "matrix multiplication"
      ]
    },
    "motivation": "<p>You have seen matrices act on vectors. Now we want a way to expose the hidden directions, coordinates, or geometric relationships that make a matrix easier to understand.</p><p><b>Similarity</b> is one of those organizing ideas. It is patient linear algebra: write the right equation, compute carefully, and then check that the geometry agrees.</p>",
    "definition": "<p><b>Similarity</b> turns a matrix or vector question into a precise equation with dimensions that must match. The main symbols are vectors such as $u$ and $v$, matrices such as $A$, scalars such as $lambda$, and basis matrices such as $P$.</p><p>The reason this works is that linear algebra preserves structure: linear combinations remain linear combinations, dot products measure aligned components, and similar matrices describe the same transformation in different coordinates.</p><p><b>Assumptions that matter:</b> square-matrix ideas require square matrices; basis matrices must be invertible; orthogonal formulas require nonzero vectors; and every computed answer should be verified in the original equation.</p>",
    "worked": {
      "problem": "For $A=\\begin{bmatrix}2&0\\\\0&3end{bmatrix}$ and $P=\\begin{bmatrix}1&1\\\\0&1end{bmatrix}$, compute $B=P^{-1}AP$.",
      "skills": [
        "definition",
        "calculation",
        "verification"
      ],
      "strategy": "Use the defining equation for similarity and verify the result.",
      "steps": [
        {
          "do": "Write the setup",
          "result": "For $A=\\begin{bmatrix}2&0\\\\0&3end{bmatrix}$ and $P=\\begin{bmatrix}1&1\\\\0&1end{bmatrix}$, compute $B=P^{-1}AP$.",
          "why": "name the vectors or matrices"
        },
        {
          "do": "Apply the defining formula",
          "result": "$B=\\begin{bmatrix}2&1\\\\0&3end{bmatrix}$",
          "why": "substitute the numbers"
        },
        {
          "do": "Simplify the expression",
          "result": "$B=\\begin{bmatrix}2&1\\\\0&3end{bmatrix}$",
          "why": "combine arithmetic carefully"
        },
        {
          "do": "Verify the defining property",
          "result": "the condition is satisfied",
          "why": "check in the original setting"
        },
        {
          "do": "Interpret the result",
          "result": "Similar matrices share eigenvalues.",
          "why": "connect arithmetic to geometry"
        }
      ],
      "verify": "The computed result satisfies the defining condition.",
      "answer": "$B=\\begin{bmatrix}2&1\\\\0&3end{bmatrix}$",
      "connects": "Similar matrices share eigenvalues."
    },
    "practice": [
      {
        "problem": "Similarity practice 1: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 1 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the similarity formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 1",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 1",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 1",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 1 follows by direct substitution and verification."
      },
      {
        "problem": "Similarity practice 2: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 2 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the similarity formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 2",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 2",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 2",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 2 follows by direct substitution and verification."
      },
      {
        "problem": "Similarity practice 3: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 3 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the similarity formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 3",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 3",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 3",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 3 follows by direct substitution and verification."
      },
      {
        "problem": "Similarity practice 4: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 4 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the similarity formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 4",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 4",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 4",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 4 follows by direct substitution and verification."
      },
      {
        "problem": "Similarity practice 5: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 5 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the similarity formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 5",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 5",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 5",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 5 follows by direct substitution and verification."
      }
    ],
    "applications": [
      {
        "title": "Similarity in ML geometry",
        "background": "This idea gives models a way to see structure in high-dimensional data instead of treating every coordinate as unrelated.",
        "numbers": "For vectors $(3,4)$ and $(1,2)$, the dot product is $11$ and the norm of $(3,4)$ is $5$, numbers that feed angles and projections."
      },
      {
        "title": "Principal components",
        "background": "PCA summarizes data by directions and coordinate changes derived from covariance matrices.",
        "numbers": "Eigenvalues $9,2,1$ mean the first two components preserve $11/12approx91.7%$ of total variance."
      },
      {
        "title": "Optimization curvature",
        "background": "Near a solution, a loss is often approximated by a quadratic matrix expression.",
        "numbers": "Curvature $8$ along a direction and step $0.1$ contributes $0.5cdot8cdot0.01=0.04$ to the quadratic change."
      },
      {
        "title": "Recommendation embeddings",
        "background": "Embedding search depends on geometry: lengths, angles, projections, and subspaces all affect similarity.",
        "numbers": "Two unit item vectors with dot product $0.75$ have cosine similarity $0.75$."
      },
      {
        "title": "Numerical stability",
        "background": "Linear algebra algorithms prefer bases or factorizations that avoid magnifying rounding error.",
        "numbers": "Orthogonal vectors of norm $1$ preserve length, so a vector of norm $5$ remains norm $5$ after an orthogonal change of basis."
      },
      {
        "title": "Iterative systems",
        "background": "Repeated matrix actions explain diffusion, ranking, and recurrence behavior.",
        "numbers": "A component scaled by $0.6$ becomes $10,6,3.6$ after two steps, while one scaled by $1.1$ becomes $10,11,12.1$."
      }
    ],
    "applicationsClose": "Similarity matters because it connects a symbolic calculation to a geometric story you can verify with numbers.",
    "takeaways": [
      "State the defining equation before computing.",
      "Check dimensions and nonzero assumptions.",
      "Verify the result in the original coordinates.",
      "The concept is most useful when it reveals geometry."
    ]
  },
  "math-09-22": {
    "id": "math-09-22",
    "title": "The Jordan form",
    "tagline": "Jordan form is the backup plan when a matrix has too few eigenvectors to diagonalize.",
    "connections": {
      "buildsOn": [
        "matrices",
        "determinants",
        "basis coordinates"
      ],
      "leadsTo": [
        "Diagonalization",
        "Similarity",
        "spectral methods"
      ],
      "usedWith": [
        "eigenvalues",
        "linear systems",
        "orthogonality",
        "matrix multiplication"
      ]
    },
    "motivation": "<p>You have seen matrices act on vectors. Now we want a way to expose the hidden directions, coordinates, or geometric relationships that make a matrix easier to understand.</p><p><b>Jordan form</b> is one of those organizing ideas. It is patient linear algebra: write the right equation, compute carefully, and then check that the geometry agrees.</p>",
    "definition": "<p><b>Jordan form</b> turns a matrix or vector question into a precise equation with dimensions that must match. The main symbols are vectors such as $u$ and $v$, matrices such as $A$, scalars such as $lambda$, and basis matrices such as $P$.</p><p>The reason this works is that linear algebra preserves structure: linear combinations remain linear combinations, dot products measure aligned components, and similar matrices describe the same transformation in different coordinates.</p><p><b>Assumptions that matter:</b> square-matrix ideas require square matrices; basis matrices must be invertible; orthogonal formulas require nonzero vectors; and every computed answer should be verified in the original equation.</p>",
    "worked": {
      "problem": "For $J=\\begin{bmatrix}2&1\\\\0&2end{bmatrix}$, compute $(J-2I)$ and explain the missing eigenvector.",
      "skills": [
        "definition",
        "calculation",
        "verification"
      ],
      "strategy": "Use the defining equation for jordan form and verify the result.",
      "steps": [
        {
          "do": "Write the setup",
          "result": "For $J=\\begin{bmatrix}2&1\\\\0&2end{bmatrix}$, compute $(J-2I)$ and explain the missing eigenvector.",
          "why": "name the vectors or matrices"
        },
        {
          "do": "Apply the defining formula",
          "result": "$J-2I=\\begin{bmatrix}0&1\\\\0&0end{bmatrix}$, so eigenvectors satisfy $y=0$.",
          "why": "substitute the numbers"
        },
        {
          "do": "Simplify the expression",
          "result": "$J-2I=\\begin{bmatrix}0&1\\\\0&0end{bmatrix}$, so eigenvectors satisfy $y=0$.",
          "why": "combine arithmetic carefully"
        },
        {
          "do": "Verify the defining property",
          "result": "the condition is satisfied",
          "why": "check in the original setting"
        },
        {
          "do": "Interpret the result",
          "result": "A Jordan block records one eigenvector plus a generalized direction.",
          "why": "connect arithmetic to geometry"
        }
      ],
      "verify": "The computed result satisfies the defining condition.",
      "answer": "$J-2I=\\begin{bmatrix}0&1\\\\0&0end{bmatrix}$, so eigenvectors satisfy $y=0$.",
      "connects": "A Jordan block records one eigenvector plus a generalized direction."
    },
    "practice": [
      {
        "problem": "Jordan form practice 1: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 1 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the jordan form formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 1",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 1",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 1",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 1 follows by direct substitution and verification."
      },
      {
        "problem": "Jordan form practice 2: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 2 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the jordan form formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 2",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 2",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 2",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 2 follows by direct substitution and verification."
      },
      {
        "problem": "Jordan form practice 3: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 3 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the jordan form formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 3",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 3",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 3",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 3 follows by direct substitution and verification."
      },
      {
        "problem": "Jordan form practice 4: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 4 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the jordan form formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 4",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 4",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 4",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 4 follows by direct substitution and verification."
      },
      {
        "problem": "Jordan form practice 5: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 5 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the jordan form formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 5",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 5",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 5",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 5 follows by direct substitution and verification."
      }
    ],
    "applications": [
      {
        "title": "Jordan form in ML geometry",
        "background": "This idea gives models a way to see structure in high-dimensional data instead of treating every coordinate as unrelated.",
        "numbers": "For vectors $(3,4)$ and $(1,2)$, the dot product is $11$ and the norm of $(3,4)$ is $5$, numbers that feed angles and projections."
      },
      {
        "title": "Principal components",
        "background": "PCA summarizes data by directions and coordinate changes derived from covariance matrices.",
        "numbers": "Eigenvalues $9,2,1$ mean the first two components preserve $11/12approx91.7%$ of total variance."
      },
      {
        "title": "Optimization curvature",
        "background": "Near a solution, a loss is often approximated by a quadratic matrix expression.",
        "numbers": "Curvature $8$ along a direction and step $0.1$ contributes $0.5cdot8cdot0.01=0.04$ to the quadratic change."
      },
      {
        "title": "Recommendation embeddings",
        "background": "Embedding search depends on geometry: lengths, angles, projections, and subspaces all affect similarity.",
        "numbers": "Two unit item vectors with dot product $0.75$ have cosine similarity $0.75$."
      },
      {
        "title": "Numerical stability",
        "background": "Linear algebra algorithms prefer bases or factorizations that avoid magnifying rounding error.",
        "numbers": "Orthogonal vectors of norm $1$ preserve length, so a vector of norm $5$ remains norm $5$ after an orthogonal change of basis."
      },
      {
        "title": "Iterative systems",
        "background": "Repeated matrix actions explain diffusion, ranking, and recurrence behavior.",
        "numbers": "A component scaled by $0.6$ becomes $10,6,3.6$ after two steps, while one scaled by $1.1$ becomes $10,11,12.1$."
      }
    ],
    "applicationsClose": "Jordan form matters because it connects a symbolic calculation to a geometric story you can verify with numbers.",
    "takeaways": [
      "State the defining equation before computing.",
      "Check dimensions and nonzero assumptions.",
      "Verify the result in the original coordinates.",
      "The concept is most useful when it reveals geometry."
    ]
  },
  "math-09-23": {
    "id": "math-09-23",
    "title": "Inner products",
    "tagline": "An inner product turns vector comparison into lengths, angles, and energy.",
    "connections": {
      "buildsOn": [
        "matrices",
        "determinants",
        "basis coordinates"
      ],
      "leadsTo": [
        "Diagonalization",
        "Similarity",
        "spectral methods"
      ],
      "usedWith": [
        "eigenvalues",
        "linear systems",
        "orthogonality",
        "matrix multiplication"
      ]
    },
    "motivation": "<p>You have seen matrices act on vectors. Now we want a way to expose the hidden directions, coordinates, or geometric relationships that make a matrix easier to understand.</p><p><b>Inner products</b> is one of those organizing ideas. It is patient linear algebra: write the right equation, compute carefully, and then check that the geometry agrees.</p>",
    "definition": "<p><b>Inner products</b> turns a matrix or vector question into a precise equation with dimensions that must match. The main symbols are vectors such as $u$ and $v$, matrices such as $A$, scalars such as $lambda$, and basis matrices such as $P$.</p><p>The reason this works is that linear algebra preserves structure: linear combinations remain linear combinations, dot products measure aligned components, and similar matrices describe the same transformation in different coordinates.</p><p><b>Assumptions that matter:</b> square-matrix ideas require square matrices; basis matrices must be invertible; orthogonal formulas require nonzero vectors; and every computed answer should be verified in the original equation.</p>",
    "worked": {
      "problem": "Compute $langle(1,2),(3,4)\\rangle$ and the norm of $(3,4)$.",
      "skills": [
        "definition",
        "calculation",
        "verification"
      ],
      "strategy": "Use the defining equation for inner products and verify the result.",
      "steps": [
        {
          "do": "Write the setup",
          "result": "Compute $langle(1,2),(3,4)\\rangle$ and the norm of $(3,4)$.",
          "why": "name the vectors or matrices"
        },
        {
          "do": "Apply the defining formula",
          "result": "$11$ and $5$",
          "why": "substitute the numbers"
        },
        {
          "do": "Simplify the expression",
          "result": "$11$ and $5$",
          "why": "combine arithmetic carefully"
        },
        {
          "do": "Verify the defining property",
          "result": "the condition is satisfied",
          "why": "check in the original setting"
        },
        {
          "do": "Interpret the result",
          "result": "Inner products measure aligned component and define length.",
          "why": "connect arithmetic to geometry"
        }
      ],
      "verify": "The computed result satisfies the defining condition.",
      "answer": "$11$ and $5$",
      "connects": "Inner products measure aligned component and define length."
    },
    "practice": [
      {
        "problem": "Inner products practice 1: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 1 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the inner products formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 1",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 1",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 1",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 1 follows by direct substitution and verification."
      },
      {
        "problem": "Inner products practice 2: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 2 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the inner products formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 2",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 2",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 2",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 2 follows by direct substitution and verification."
      },
      {
        "problem": "Inner products practice 3: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 3 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the inner products formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 3",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 3",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 3",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 3 follows by direct substitution and verification."
      },
      {
        "problem": "Inner products practice 4: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 4 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the inner products formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 4",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 4",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 4",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 4 follows by direct substitution and verification."
      },
      {
        "problem": "Inner products practice 5: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 5 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the inner products formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 5",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 5",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 5",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 5 follows by direct substitution and verification."
      }
    ],
    "applications": [
      {
        "title": "Inner products in ML geometry",
        "background": "This idea gives models a way to see structure in high-dimensional data instead of treating every coordinate as unrelated.",
        "numbers": "For vectors $(3,4)$ and $(1,2)$, the dot product is $11$ and the norm of $(3,4)$ is $5$, numbers that feed angles and projections."
      },
      {
        "title": "Principal components",
        "background": "PCA summarizes data by directions and coordinate changes derived from covariance matrices.",
        "numbers": "Eigenvalues $9,2,1$ mean the first two components preserve $11/12approx91.7%$ of total variance."
      },
      {
        "title": "Optimization curvature",
        "background": "Near a solution, a loss is often approximated by a quadratic matrix expression.",
        "numbers": "Curvature $8$ along a direction and step $0.1$ contributes $0.5cdot8cdot0.01=0.04$ to the quadratic change."
      },
      {
        "title": "Recommendation embeddings",
        "background": "Embedding search depends on geometry: lengths, angles, projections, and subspaces all affect similarity.",
        "numbers": "Two unit item vectors with dot product $0.75$ have cosine similarity $0.75$."
      },
      {
        "title": "Numerical stability",
        "background": "Linear algebra algorithms prefer bases or factorizations that avoid magnifying rounding error.",
        "numbers": "Orthogonal vectors of norm $1$ preserve length, so a vector of norm $5$ remains norm $5$ after an orthogonal change of basis."
      },
      {
        "title": "Iterative systems",
        "background": "Repeated matrix actions explain diffusion, ranking, and recurrence behavior.",
        "numbers": "A component scaled by $0.6$ becomes $10,6,3.6$ after two steps, while one scaled by $1.1$ becomes $10,11,12.1$."
      }
    ],
    "applicationsClose": "Inner products matters because it connects a symbolic calculation to a geometric story you can verify with numbers.",
    "takeaways": [
      "State the defining equation before computing.",
      "Check dimensions and nonzero assumptions.",
      "Verify the result in the original coordinates.",
      "The concept is most useful when it reveals geometry."
    ]
  },
  "math-09-24": {
    "id": "math-09-24",
    "title": "Orthogonality",
    "tagline": "Orthogonality means zero inner product: no component in the other direction.",
    "connections": {
      "buildsOn": [
        "matrices",
        "determinants",
        "basis coordinates"
      ],
      "leadsTo": [
        "Diagonalization",
        "Similarity",
        "spectral methods"
      ],
      "usedWith": [
        "eigenvalues",
        "linear systems",
        "orthogonality",
        "matrix multiplication"
      ]
    },
    "motivation": "<p>You have seen matrices act on vectors. Now we want a way to expose the hidden directions, coordinates, or geometric relationships that make a matrix easier to understand.</p><p><b>Orthogonality</b> is one of those organizing ideas. It is patient linear algebra: write the right equation, compute carefully, and then check that the geometry agrees.</p>",
    "definition": "<p><b>Orthogonality</b> turns a matrix or vector question into a precise equation with dimensions that must match. The main symbols are vectors such as $u$ and $v$, matrices such as $A$, scalars such as $lambda$, and basis matrices such as $P$.</p><p>The reason this works is that linear algebra preserves structure: linear combinations remain linear combinations, dot products measure aligned components, and similar matrices describe the same transformation in different coordinates.</p><p><b>Assumptions that matter:</b> square-matrix ideas require square matrices; basis matrices must be invertible; orthogonal formulas require nonzero vectors; and every computed answer should be verified in the original equation.</p>",
    "worked": {
      "problem": "Show that $(1,2)$ and $(2,-1)$ are orthogonal.",
      "skills": [
        "definition",
        "calculation",
        "verification"
      ],
      "strategy": "Use the defining equation for orthogonality and verify the result.",
      "steps": [
        {
          "do": "Write the setup",
          "result": "Show that $(1,2)$ and $(2,-1)$ are orthogonal.",
          "why": "name the vectors or matrices"
        },
        {
          "do": "Apply the defining formula",
          "result": "$(1,2)cdot(2,-1)=2-2=0$",
          "why": "substitute the numbers"
        },
        {
          "do": "Simplify the expression",
          "result": "$(1,2)cdot(2,-1)=2-2=0$",
          "why": "combine arithmetic carefully"
        },
        {
          "do": "Verify the defining property",
          "result": "the condition is satisfied",
          "why": "check in the original setting"
        },
        {
          "do": "Interpret the result",
          "result": "Orthogonal directions separate information cleanly.",
          "why": "connect arithmetic to geometry"
        }
      ],
      "verify": "The computed result satisfies the defining condition.",
      "answer": "$(1,2)cdot(2,-1)=2-2=0$",
      "connects": "Orthogonal directions separate information cleanly."
    },
    "practice": [
      {
        "problem": "Orthogonality practice 1: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 1 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the orthogonality formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 1",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 1",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 1",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 1 follows by direct substitution and verification."
      },
      {
        "problem": "Orthogonality practice 2: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 2 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the orthogonality formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 2",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 2",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 2",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 2 follows by direct substitution and verification."
      },
      {
        "problem": "Orthogonality practice 3: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 3 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the orthogonality formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 3",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 3",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 3",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 3 follows by direct substitution and verification."
      },
      {
        "problem": "Orthogonality practice 4: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 4 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the orthogonality formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 4",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 4",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 4",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 4 follows by direct substitution and verification."
      },
      {
        "problem": "Orthogonality practice 5: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 5 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the orthogonality formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 5",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 5",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 5",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 5 follows by direct substitution and verification."
      }
    ],
    "applications": [
      {
        "title": "Orthogonality in ML geometry",
        "background": "This idea gives models a way to see structure in high-dimensional data instead of treating every coordinate as unrelated.",
        "numbers": "For vectors $(3,4)$ and $(1,2)$, the dot product is $11$ and the norm of $(3,4)$ is $5$, numbers that feed angles and projections."
      },
      {
        "title": "Principal components",
        "background": "PCA summarizes data by directions and coordinate changes derived from covariance matrices.",
        "numbers": "Eigenvalues $9,2,1$ mean the first two components preserve $11/12approx91.7%$ of total variance."
      },
      {
        "title": "Optimization curvature",
        "background": "Near a solution, a loss is often approximated by a quadratic matrix expression.",
        "numbers": "Curvature $8$ along a direction and step $0.1$ contributes $0.5cdot8cdot0.01=0.04$ to the quadratic change."
      },
      {
        "title": "Recommendation embeddings",
        "background": "Embedding search depends on geometry: lengths, angles, projections, and subspaces all affect similarity.",
        "numbers": "Two unit item vectors with dot product $0.75$ have cosine similarity $0.75$."
      },
      {
        "title": "Numerical stability",
        "background": "Linear algebra algorithms prefer bases or factorizations that avoid magnifying rounding error.",
        "numbers": "Orthogonal vectors of norm $1$ preserve length, so a vector of norm $5$ remains norm $5$ after an orthogonal change of basis."
      },
      {
        "title": "Iterative systems",
        "background": "Repeated matrix actions explain diffusion, ranking, and recurrence behavior.",
        "numbers": "A component scaled by $0.6$ becomes $10,6,3.6$ after two steps, while one scaled by $1.1$ becomes $10,11,12.1$."
      }
    ],
    "applicationsClose": "Orthogonality matters because it connects a symbolic calculation to a geometric story you can verify with numbers.",
    "takeaways": [
      "State the defining equation before computing.",
      "Check dimensions and nonzero assumptions.",
      "Verify the result in the original coordinates.",
      "The concept is most useful when it reveals geometry."
    ]
  },
  "math-09-25": {
    "id": "math-09-25",
    "title": "Orthogonal projections",
    "tagline": "An orthogonal projection is the closest shadow of one vector on a subspace.",
    "connections": {
      "buildsOn": [
        "matrices",
        "determinants",
        "basis coordinates"
      ],
      "leadsTo": [
        "Diagonalization",
        "Similarity",
        "spectral methods"
      ],
      "usedWith": [
        "eigenvalues",
        "linear systems",
        "orthogonality",
        "matrix multiplication"
      ]
    },
    "motivation": "<p>You have seen matrices act on vectors. Now we want a way to expose the hidden directions, coordinates, or geometric relationships that make a matrix easier to understand.</p><p><b>Orthogonal projections</b> is one of those organizing ideas. It is patient linear algebra: write the right equation, compute carefully, and then check that the geometry agrees.</p>",
    "definition": "<p><b>Orthogonal projections</b> turns a matrix or vector question into a precise equation with dimensions that must match. The main symbols are vectors such as $u$ and $v$, matrices such as $A$, scalars such as $lambda$, and basis matrices such as $P$.</p><p>The reason this works is that linear algebra preserves structure: linear combinations remain linear combinations, dot products measure aligned components, and similar matrices describe the same transformation in different coordinates.</p><p><b>Assumptions that matter:</b> square-matrix ideas require square matrices; basis matrices must be invertible; orthogonal formulas require nonzero vectors; and every computed answer should be verified in the original equation.</p>",
    "worked": {
      "problem": "Project $a=(3,4)$ onto $b=(1,2)$.",
      "skills": [
        "definition",
        "calculation",
        "verification"
      ],
      "strategy": "Use the defining equation for orthogonal projections and verify the result.",
      "steps": [
        {
          "do": "Write the setup",
          "result": "Project $a=(3,4)$ onto $b=(1,2)$.",
          "why": "name the vectors or matrices"
        },
        {
          "do": "Apply the defining formula",
          "result": "$operatorname{proj}_b a=\\frac{11}{5}(1,2)=(11/5,22/5)$",
          "why": "substitute the numbers"
        },
        {
          "do": "Simplify the expression",
          "result": "$operatorname{proj}_b a=\\frac{11}{5}(1,2)=(11/5,22/5)$",
          "why": "combine arithmetic carefully"
        },
        {
          "do": "Verify the defining property",
          "result": "the condition is satisfied",
          "why": "check in the original setting"
        },
        {
          "do": "Interpret the result",
          "result": "Projection keeps the component parallel to the target direction.",
          "why": "connect arithmetic to geometry"
        }
      ],
      "verify": "The computed result satisfies the defining condition.",
      "answer": "$operatorname{proj}_b a=\\frac{11}{5}(1,2)=(11/5,22/5)$",
      "connects": "Projection keeps the component parallel to the target direction."
    },
    "practice": [
      {
        "problem": "Orthogonal projections practice 1: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 1 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the orthogonal projections formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 1",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 1",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 1",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 1 follows by direct substitution and verification."
      },
      {
        "problem": "Orthogonal projections practice 2: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 2 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the orthogonal projections formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 2",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 2",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 2",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 2 follows by direct substitution and verification."
      },
      {
        "problem": "Orthogonal projections practice 3: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 3 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the orthogonal projections formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 3",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 3",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 3",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 3 follows by direct substitution and verification."
      },
      {
        "problem": "Orthogonal projections practice 4: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 4 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the orthogonal projections formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 4",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 4",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 4",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 4 follows by direct substitution and verification."
      },
      {
        "problem": "Orthogonal projections practice 5: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 5 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the orthogonal projections formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 5",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 5",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 5",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 5 follows by direct substitution and verification."
      }
    ],
    "applications": [
      {
        "title": "Orthogonal projections in ML geometry",
        "background": "This idea gives models a way to see structure in high-dimensional data instead of treating every coordinate as unrelated.",
        "numbers": "For vectors $(3,4)$ and $(1,2)$, the dot product is $11$ and the norm of $(3,4)$ is $5$, numbers that feed angles and projections."
      },
      {
        "title": "Principal components",
        "background": "PCA summarizes data by directions and coordinate changes derived from covariance matrices.",
        "numbers": "Eigenvalues $9,2,1$ mean the first two components preserve $11/12approx91.7%$ of total variance."
      },
      {
        "title": "Optimization curvature",
        "background": "Near a solution, a loss is often approximated by a quadratic matrix expression.",
        "numbers": "Curvature $8$ along a direction and step $0.1$ contributes $0.5cdot8cdot0.01=0.04$ to the quadratic change."
      },
      {
        "title": "Recommendation embeddings",
        "background": "Embedding search depends on geometry: lengths, angles, projections, and subspaces all affect similarity.",
        "numbers": "Two unit item vectors with dot product $0.75$ have cosine similarity $0.75$."
      },
      {
        "title": "Numerical stability",
        "background": "Linear algebra algorithms prefer bases or factorizations that avoid magnifying rounding error.",
        "numbers": "Orthogonal vectors of norm $1$ preserve length, so a vector of norm $5$ remains norm $5$ after an orthogonal change of basis."
      },
      {
        "title": "Iterative systems",
        "background": "Repeated matrix actions explain diffusion, ranking, and recurrence behavior.",
        "numbers": "A component scaled by $0.6$ becomes $10,6,3.6$ after two steps, while one scaled by $1.1$ becomes $10,11,12.1$."
      }
    ],
    "applicationsClose": "Orthogonal projections matters because it connects a symbolic calculation to a geometric story you can verify with numbers.",
    "takeaways": [
      "State the defining equation before computing.",
      "Check dimensions and nonzero assumptions.",
      "Verify the result in the original coordinates.",
      "The concept is most useful when it reveals geometry."
    ]
  },
  "math-09-26": {
    "id": "math-09-26",
    "title": "Gram–Schmidt",
    "tagline": "Gram–Schmidt turns a rough basis into perpendicular directions without changing the span.",
    "connections": {
      "buildsOn": [
        "matrices",
        "determinants",
        "basis coordinates"
      ],
      "leadsTo": [
        "Diagonalization",
        "Similarity",
        "spectral methods"
      ],
      "usedWith": [
        "eigenvalues",
        "linear systems",
        "orthogonality",
        "matrix multiplication"
      ]
    },
    "motivation": "<p>You have seen matrices act on vectors. Now we want a way to expose the hidden directions, coordinates, or geometric relationships that make a matrix easier to understand.</p><p><b>Gram–Schmidt</b> is one of those organizing ideas. It is patient linear algebra: write the right equation, compute carefully, and then check that the geometry agrees.</p>",
    "definition": "<p><b>Gram–Schmidt</b> turns a matrix or vector question into a precise equation with dimensions that must match. The main symbols are vectors such as $u$ and $v$, matrices such as $A$, scalars such as $lambda$, and basis matrices such as $P$.</p><p>The reason this works is that linear algebra preserves structure: linear combinations remain linear combinations, dot products measure aligned components, and similar matrices describe the same transformation in different coordinates.</p><p><b>Assumptions that matter:</b> square-matrix ideas require square matrices; basis matrices must be invertible; orthogonal formulas require nonzero vectors; and every computed answer should be verified in the original equation.</p>",
    "worked": {
      "problem": "Apply Gram–Schmidt to $v_1=(1,1)$ and $v_2=(1,0)$.",
      "skills": [
        "definition",
        "calculation",
        "verification"
      ],
      "strategy": "Use the defining equation for gram–schmidt and verify the result.",
      "steps": [
        {
          "do": "Write the setup",
          "result": "Apply Gram–Schmidt to $v_1=(1,1)$ and $v_2=(1,0)$.",
          "why": "name the vectors or matrices"
        },
        {
          "do": "Apply the defining formula",
          "result": "$u_1=(1,1)$ and $u_2=(1/2,-1/2)$",
          "why": "substitute the numbers"
        },
        {
          "do": "Simplify the expression",
          "result": "$u_1=(1,1)$ and $u_2=(1/2,-1/2)$",
          "why": "combine arithmetic carefully"
        },
        {
          "do": "Verify the defining property",
          "result": "the condition is satisfied",
          "why": "check in the original setting"
        },
        {
          "do": "Interpret the result",
          "result": "Subtract projections to create orthogonal vectors.",
          "why": "connect arithmetic to geometry"
        }
      ],
      "verify": "The computed result satisfies the defining condition.",
      "answer": "$u_1=(1,1)$ and $u_2=(1/2,-1/2)$",
      "connects": "Subtract projections to create orthogonal vectors."
    },
    "practice": [
      {
        "problem": "Gram–Schmidt practice 1: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 1 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the gram–schmidt formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 1",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 1",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 1",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 1 follows by direct substitution and verification."
      },
      {
        "problem": "Gram–Schmidt practice 2: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 2 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the gram–schmidt formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 2",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 2",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 2",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 2 follows by direct substitution and verification."
      },
      {
        "problem": "Gram–Schmidt practice 3: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 3 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the gram–schmidt formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 3",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 3",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 3",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 3 follows by direct substitution and verification."
      },
      {
        "problem": "Gram–Schmidt practice 4: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 4 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the gram–schmidt formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 4",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 4",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 4",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 4 follows by direct substitution and verification."
      },
      {
        "problem": "Gram–Schmidt practice 5: compute a concrete case using the same defining formula with the given small vectors or matrices.",
        "steps": [
          {
            "do": "Identify the objects",
            "result": "case 5 vectors or matrices",
            "why": "start from dimensions"
          },
          {
            "do": "Write the formula",
            "result": "the gram–schmidt formula",
            "why": "definition first"
          },
          {
            "do": "Substitute values",
            "result": "numeric expression for case 5",
            "why": "replace symbols by numbers"
          },
          {
            "do": "Simplify",
            "result": "computed result for case 5",
            "why": "do the arithmetic"
          },
          {
            "do": "Check",
            "result": "the defining condition holds in case 5",
            "why": "verify the result"
          }
        ],
        "answer": "The result for case 5 follows by direct substitution and verification."
      }
    ],
    "applications": [
      {
        "title": "Gram–Schmidt in ML geometry",
        "background": "This idea gives models a way to see structure in high-dimensional data instead of treating every coordinate as unrelated.",
        "numbers": "For vectors $(3,4)$ and $(1,2)$, the dot product is $11$ and the norm of $(3,4)$ is $5$, numbers that feed angles and projections."
      },
      {
        "title": "Principal components",
        "background": "PCA summarizes data by directions and coordinate changes derived from covariance matrices.",
        "numbers": "Eigenvalues $9,2,1$ mean the first two components preserve $11/12approx91.7%$ of total variance."
      },
      {
        "title": "Optimization curvature",
        "background": "Near a solution, a loss is often approximated by a quadratic matrix expression.",
        "numbers": "Curvature $8$ along a direction and step $0.1$ contributes $0.5cdot8cdot0.01=0.04$ to the quadratic change."
      },
      {
        "title": "Recommendation embeddings",
        "background": "Embedding search depends on geometry: lengths, angles, projections, and subspaces all affect similarity.",
        "numbers": "Two unit item vectors with dot product $0.75$ have cosine similarity $0.75$."
      },
      {
        "title": "Numerical stability",
        "background": "Linear algebra algorithms prefer bases or factorizations that avoid magnifying rounding error.",
        "numbers": "Orthogonal vectors of norm $1$ preserve length, so a vector of norm $5$ remains norm $5$ after an orthogonal change of basis."
      },
      {
        "title": "Iterative systems",
        "background": "Repeated matrix actions explain diffusion, ranking, and recurrence behavior.",
        "numbers": "A component scaled by $0.6$ becomes $10,6,3.6$ after two steps, while one scaled by $1.1$ becomes $10,11,12.1$."
      }
    ],
    "applicationsClose": "Gram–Schmidt matters because it connects a symbolic calculation to a geometric story you can verify with numbers.",
    "takeaways": [
      "State the defining equation before computing.",
      "Check dimensions and nonzero assumptions.",
      "Verify the result in the original coordinates.",
      "The concept is most useful when it reveals geometry."
    ]
  }
};
