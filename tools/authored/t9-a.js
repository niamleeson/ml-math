module.exports = {
  "math-09-01": {
    "id": "math-09-01",
    "title": "Vectors and linear combinations",
    "tagline": "A vector is a move with size and direction, and a linear combination is how many moves build one new move.",
    "connections": {
      "buildsOn": [
        "coordinates",
        "functions",
        "basic arithmetic"
      ],
      "leadsTo": [
        "Systems of linear equations",
        "Matrix algebra",
        "Span"
      ],
      "usedWith": [
        "dot products",
        "geometry",
        "coordinate systems",
        "linear equations"
      ]
    },
    "motivation": "<p>You already know how to give directions: go 3 blocks east and 2 blocks north. A vector records that same idea as ordered numbers, such as $\\begin{bmatrix}3\\\\2\\end{bmatrix}$.</p><p>A <b>linear combination</b> is the patient act of scaling vectors and adding them. This is the first big language of ML because data points, features, embeddings, gradients, and model weights are all vectors being combined.</p>",
    "definition": "<p>A <b>vector</b> in $\\mathbb{R}^n$ is an ordered list of $n$ real numbers. If $\\mathbf{v}_1,\\ldots,\\mathbf{v}_k$ are vectors in the same $\\mathbb{R}^n$ and $c_1,\\ldots,c_k$ are real numbers, then $c_1\\mathbf{v}_1+\\cdots+c_k\\mathbf{v}_k$ is a <b>linear combination</b>.</p><p>The rule comes from two allowed moves: scalar multiplication stretches each component, and vector addition adds matching components. For $c\\begin{bmatrix}a\\\\b\\end{bmatrix}+d\\begin{bmatrix}e\\\\f\\end{bmatrix}$, the result is $\\begin{bmatrix}ca+de\\\\cb+df\\end{bmatrix}$.</p><p><b>Assumptions that matter:</b> all vectors in a sum must have the same length; scalars are real numbers here; order of components matters; and the zero vector is allowed because choosing all coefficients $0$ is still a linear combination.</p>",
    "worked": {
      "problem": "Write $\\begin{bmatrix}7\\\\1\\end{bmatrix}$ as a linear combination of $\\mathbf{u}=\\begin{bmatrix}2\\\\1\\end{bmatrix}$ and $\\mathbf{v}=\\begin{bmatrix}1\\\\-1\\end{bmatrix}$.",
      "skills": [
        "vector addition",
        "scalar multiplication",
        "linear combinations"
      ],
      "strategy": "Unknown coefficients are the obstacle - name them and match components.",
      "steps": [
        {
          "do": "Set up the combination",
          "result": "$a\\mathbf{u}+b\\mathbf{v}=\\begin{bmatrix}7\\\\1\\end{bmatrix}$",
          "why": "the coefficients $a$ and $b$ say how much of each vector to use"
        },
        {
          "do": "Substitute the vectors",
          "result": "$a\\begin{bmatrix}2\\\\1\\end{bmatrix}+b\\begin{bmatrix}1\\\\-1\\end{bmatrix}=\\begin{bmatrix}7\\\\1\\end{bmatrix}$",
          "why": "replace each vector by its components"
        },
        {
          "do": "Scale the vectors",
          "result": "$\\begin{bmatrix}2a\\\\a\\end{bmatrix}+\\begin{bmatrix}b\\\\-b\\end{bmatrix}=\\begin{bmatrix}7\\\\1\\end{bmatrix}$",
          "why": "scalar multiplication acts component by component"
        },
        {
          "do": "Add components",
          "result": "$\\begin{bmatrix}2a+b\\\\a-b\\end{bmatrix}=\\begin{bmatrix}7\\\\1\\end{bmatrix}$",
          "why": "matching components add"
        },
        {
          "do": "Write component equations",
          "result": "$2a+b=7,\\ a-b=1$",
          "why": "equal vectors have equal components"
        },
        {
          "do": "Add the equations",
          "result": "$3a=8$",
          "why": "the $b$ terms cancel"
        },
        {
          "do": "Solve for $a$",
          "result": "$a=\\dfrac83$",
          "why": "divide by 3"
        },
        {
          "do": "Solve for $b$",
          "result": "$b=\\dfrac53$",
          "why": "use $a-b=1$"
        }
      ],
      "verify": "Check: $\\frac83\\begin{bmatrix}2\\\\1\\end{bmatrix}+\\frac53\\begin{bmatrix}1\\\\-1\\end{bmatrix}=\\begin{bmatrix}7\\\\1\\end{bmatrix}$.",
      "answer": "$\\begin{bmatrix}7\\\\1\\end{bmatrix}=\\dfrac83\\mathbf{u}+\\dfrac53\\mathbf{v}$.",
      "connects": "Linear combinations translate geometric building into component equations."
    },
    "practice": [
      {
        "problem": "Compute $3\\begin{bmatrix}2\\\\-1\\end{bmatrix}-2\\begin{bmatrix}4\\\\5\\end{bmatrix}$.",
        "steps": [
          {
            "do": "Scale the first vector",
            "result": "$3\\begin{bmatrix}2\\\\-1\\end{bmatrix}=\\begin{bmatrix}6\\\\-3\\end{bmatrix}$",
            "why": "multiply each component by 3"
          },
          {
            "do": "Scale the second vector",
            "result": "$2\\begin{bmatrix}4\\\\5\\end{bmatrix}=\\begin{bmatrix}8\\\\10\\end{bmatrix}$",
            "why": "multiply each component by 2"
          },
          {
            "do": "Subtract components",
            "result": "$\\begin{bmatrix}6\\\\-3\\end{bmatrix}-\\begin{bmatrix}8\\\\10\\end{bmatrix}=\\begin{bmatrix}-2\\\\-13\\end{bmatrix}$",
            "why": "subtract matching entries"
          },
          {
            "do": "State the vector",
            "result": "$\\begin{bmatrix}-2\\\\-13\\end{bmatrix}$",
            "why": "the result is still in $\\mathbb{R}^2$"
          }
        ],
        "answer": "$\\begin{bmatrix}-2\\\\-13\\end{bmatrix}$."
      },
      {
        "problem": "Find $a,b$ so $a\\begin{bmatrix}1\\\\0\\end{bmatrix}+b\\begin{bmatrix}0\\\\1\\end{bmatrix}=\\begin{bmatrix}-3\\\\4\\end{bmatrix}$.",
        "steps": [
          {
            "do": "Scale the first vector",
            "result": "$\\begin{bmatrix}a\\\\0\\end{bmatrix}$",
            "why": "the first basis vector carries the first component"
          },
          {
            "do": "Scale the second vector",
            "result": "$\\begin{bmatrix}0\\\\b\\end{bmatrix}$",
            "why": "the second basis vector carries the second component"
          },
          {
            "do": "Add the vectors",
            "result": "$\\begin{bmatrix}a\\\\b\\end{bmatrix}=\\begin{bmatrix}-3\\\\4\\end{bmatrix}$",
            "why": "components match directly"
          },
          {
            "do": "Match first components",
            "result": "$a=-3$",
            "why": "equal vectors have equal first entries"
          },
          {
            "do": "Match second components",
            "result": "$b=4$",
            "why": "equal vectors have equal second entries"
          }
        ],
        "answer": "$a=-3$, $b=4$."
      },
      {
        "problem": "Decide whether $\\begin{bmatrix}5\\\\6\\end{bmatrix}$ is a multiple of $\\begin{bmatrix}2\\\\3\\end{bmatrix}$.",
        "steps": [
          {
            "do": "Name the possible scalar",
            "result": "$c\\begin{bmatrix}2\\\\3\\end{bmatrix}=\\begin{bmatrix}5\\\\6\\end{bmatrix}$",
            "why": "a multiple uses one scalar"
          },
          {
            "do": "Use the first component",
            "result": "$2c=5$",
            "why": "match first entries"
          },
          {
            "do": "Solve the first equation",
            "result": "$c=2.5$",
            "why": "divide by 2"
          },
          {
            "do": "Use the second component",
            "result": "$3c=6$",
            "why": "match second entries"
          },
          {
            "do": "Solve the second equation",
            "result": "$c=2$",
            "why": "divide by 3"
          },
          {
            "do": "Compare scalars",
            "result": "$2.5\\ne2$",
            "why": "one scalar must satisfy both components"
          }
        ],
        "answer": "No. The vector is not a scalar multiple."
      },
      {
        "problem": "Express $\\begin{bmatrix}4\\\\9\\end{bmatrix}$ as $a\\begin{bmatrix}1\\\\2\\end{bmatrix}+b\\begin{bmatrix}2\\\\1\\end{bmatrix}$.",
        "steps": [
          {
            "do": "Set up components",
            "result": "$\\begin{bmatrix}a+2b\\\\2a+b\\end{bmatrix}=\\begin{bmatrix}4\\\\9\\end{bmatrix}$",
            "why": "scale and add componentwise"
          },
          {
            "do": "Write equations",
            "result": "$a+2b=4,\\ 2a+b=9$",
            "why": "match components"
          },
          {
            "do": "Solve the first for $a$",
            "result": "$a=4-2b$",
            "why": "isolate one variable"
          },
          {
            "do": "Substitute into the second",
            "result": "$2(4-2b)+b=9$",
            "why": "replace $a$"
          },
          {
            "do": "Simplify",
            "result": "$8-3b=9$",
            "why": "combine like terms"
          },
          {
            "do": "Solve for $b$",
            "result": "$b=-\\dfrac13$",
            "why": "subtract 8 and divide by -3"
          },
          {
            "do": "Find $a$",
            "result": "$a=\\dfrac{14}{3}$",
            "why": "substitute into $a=4-2b$"
          }
        ],
        "answer": "$a=14/3$, $b=-1/3$."
      },
      {
        "problem": "A prediction vector combines two feature vectors: $2\\begin{bmatrix}1\\\\3\\\\0\\end{bmatrix}-\\begin{bmatrix}4\\\\1\\\\-2\\end{bmatrix}$. Compute it and interpret the third component.",
        "steps": [
          {
            "do": "Scale the first vector",
            "result": "$2\\begin{bmatrix}1\\\\3\\\\0\\end{bmatrix}=\\begin{bmatrix}2\\\\6\\\\0\\end{bmatrix}$",
            "why": "double every feature contribution"
          },
          {
            "do": "Write the subtraction",
            "result": "$\\begin{bmatrix}2\\\\6\\\\0\\end{bmatrix}-\\begin{bmatrix}4\\\\1\\\\-2\\end{bmatrix}$",
            "why": "combine the two contributions"
          },
          {
            "do": "Subtract first components",
            "result": "$2-4=-2$",
            "why": "first coordinate result"
          },
          {
            "do": "Subtract second components",
            "result": "$6-1=5$",
            "why": "second coordinate result"
          },
          {
            "do": "Subtract third components",
            "result": "$0-(-2)=2$",
            "why": "subtracting a negative adds"
          },
          {
            "do": "Assemble the vector",
            "result": "$\\begin{bmatrix}-2\\\\5\\\\2\\end{bmatrix}$",
            "why": "collect the components"
          }
        ],
        "answer": "The combined vector is $\\begin{bmatrix}-2\\\\5\\\\2\\end{bmatrix}$; the third component contributes $2$ after subtracting a negative feature value."
      }
    ],
    "applications": [
      {
        "title": "Embedding mixtures",
        "background": "Recommendation systems often blend embeddings to represent a combined taste or context. The arithmetic is just linear combination of vectors.",
        "numbers": "If item vectors are $[2,1]$ and $[0,3]$, a blend $0.7[2,1]+0.3[0,3]=[1.4,1.6]$."
      },
      {
        "title": "RGB colors",
        "background": "Digital color stores red, green, and blue as a vector. Mixing light is vector addition with weights.",
        "numbers": "Half red $[255,0,0]$ plus half blue $[0,0,255]$ gives $[127.5,0,127.5]$."
      },
      {
        "title": "Forces in physics engines",
        "background": "Game and robotics simulators add force vectors because several pushes can act at once.",
        "numbers": "Forces $[3,4]$ and $[-1,2]$ add to $[2,6]$, with net vertical force $6$."
      },
      {
        "title": "Linear model features",
        "background": "A linear predictor combines feature vectors or feature values with coefficients.",
        "numbers": "Weights $[0.5,-2]$ on features $[6,1]$ give $0.5\\cdot6-2\\cdot1=1$."
      },
      {
        "title": "Portfolio allocation",
        "background": "Finance represents asset returns as vectors over scenarios, then combines them by investment weights.",
        "numbers": "$0.6[0.02,-0.01]+0.4[0.01,0.03]=[0.016,0.006]$ scenario returns."
      },
      {
        "title": "Image filters",
        "background": "A small image patch can be represented as a vector of pixel values, and filters form weighted combinations.",
        "numbers": "Weights $[1,0,-1]$ on pixels $[120,125,140]$ give $120+0-140=-20$, detecting an edge."
      }
    ],
    "applicationsClose": "Vectors let many quantities wear the same uniform: scale the pieces, add components, and read the result.",
    "takeaways": [
      "Vectors are ordered component lists in $\\mathbb{R}^n$.",
      "Linear combinations have the form $c_1\\mathbf{v}_1+\\cdots+c_k\\mathbf{v}_k$.",
      "All vectors being added must have the same dimension.",
      "Embeddings, pixels, forces, and model weights all use vector-combination thinking."
    ]
  },
  "math-09-02": {
    "id": "math-09-02",
    "title": "Systems of linear equations",
    "tagline": "A linear system asks whether several straight-line rules can be true at the same time.",
    "connections": {
      "buildsOn": [
        "Vectors and linear combinations",
        "equations",
        "coordinate graphs"
      ],
      "leadsTo": [
        "Gaussian elimination",
        "Matrix algebra",
        "Matrix inverses"
      ],
      "usedWith": [
        "linear combinations",
        "augmented matrices",
        "row operations",
        "intersection geometry"
      ]
    },
    "motivation": "<p>You already know how to solve one equation like $2x+3=11$. A system asks for values that satisfy several equations together, such as a point where two lines meet.</p><p>In ML, systems appear whenever constraints, fitted equations, or normal equations must agree at once. The core question is honest and simple: is there no solution, exactly one solution, or infinitely many?</p>",
    "definition": "<p>A <b>system of linear equations</b> is a collection of equations whose variables appear only to the first power, such as $a_{11}x_1+\\cdots+a_{1n}x_n=b_1$. In matrix form it is $\\mathbf{A}\\mathbf{x}=\\mathbf{b}$, where $\\mathbf{A}$ stores coefficients, $\\mathbf{x}$ stores unknowns, and $\\mathbf{b}$ stores right-hand sides.</p><p>Each equation cuts out a line, plane, or higher-dimensional flat set. A solution is an intersection point of all those sets. Equivalently, $\\mathbf{b}$ must be a linear combination of the columns of $\\mathbf{A}$ using the entries of $\\mathbf{x}$ as weights.</p><p><b>Assumptions that matter:</b> equations must be linear; variables must be consistently ordered; row equations and column combinations are two views of the same system; and inconsistency means no vector $\\mathbf{x}$ satisfies every equation.</p>",
    "worked": {
      "problem": "Solve the system $x+2y=7$ and $3x-y=4$.",
      "skills": [
        "substitution",
        "systems",
        "checking solutions"
      ],
      "strategy": "Use one equation to express one variable, then substitute into the other.",
      "steps": [
        {
          "do": "Solve the first equation for $x$",
          "result": "$x=7-2y$",
          "why": "isolate one variable"
        },
        {
          "do": "Substitute into the second equation",
          "result": "$3(7-2y)-y=4$",
          "why": "the same $x$ must satisfy both equations"
        },
        {
          "do": "Distribute",
          "result": "$21-6y-y=4$",
          "why": "multiply by 3"
        },
        {
          "do": "Combine like terms",
          "result": "$21-7y=4$",
          "why": "collect the $y$ terms"
        },
        {
          "do": "Subtract 21",
          "result": "$-7y=-17$",
          "why": "isolate the term with $y$"
        },
        {
          "do": "Divide by $-7$",
          "result": "$y=\\dfrac{17}{7}$",
          "why": "solve for $y$"
        },
        {
          "do": "Substitute back",
          "result": "$x=7-2\\cdot\\dfrac{17}{7}$",
          "why": "use the first expression for $x$"
        },
        {
          "do": "Simplify",
          "result": "$x=\\dfrac{15}{7}$",
          "why": "compute $49/7-34/7$"
        }
      ],
      "verify": "Substitution gives $15/7+2(17/7)=7$ and $3(15/7)-17/7=4$, so both equations hold.",
      "answer": "$x=15/7$, $y=17/7$.",
      "connects": "A system solution is the coefficient choice that makes all equations true together."
    },
    "practice": [
      {
        "problem": "Solve $x+y=5$ and $x-y=1$ by adding equations.",
        "steps": [
          {
            "do": "Add the equations",
            "result": "$(x+y)+(x-y)=6$",
            "why": "left sides and right sides can be added"
          },
          {
            "do": "Simplify",
            "result": "$2x=6$",
            "why": "the $y$ terms cancel"
          },
          {
            "do": "Divide by 2",
            "result": "$x=3$",
            "why": "solve for $x$"
          },
          {
            "do": "Substitute into $x+y=5$",
            "result": "$3+y=5$",
            "why": "find the remaining variable"
          },
          {
            "do": "Solve for $y$",
            "result": "$y=2$",
            "why": "subtract 3"
          }
        ],
        "answer": "$x=3$, $y=2$."
      },
      {
        "problem": "Solve $2x+y=8$ and $x+3y=9$.",
        "steps": [
          {
            "do": "Solve the first equation for $y$",
            "result": "$y=8-2x$",
            "why": "isolate $y$"
          },
          {
            "do": "Substitute into the second",
            "result": "$x+3(8-2x)=9$",
            "why": "use the same $y$"
          },
          {
            "do": "Distribute",
            "result": "$x+24-6x=9$",
            "why": "multiply by 3"
          },
          {
            "do": "Combine terms",
            "result": "$-5x+24=9$",
            "why": "collect $x$ terms"
          },
          {
            "do": "Subtract 24",
            "result": "$-5x=-15$",
            "why": "isolate $x$"
          },
          {
            "do": "Divide by -5",
            "result": "$x=3$",
            "why": "solve"
          },
          {
            "do": "Find $y$",
            "result": "$y=8-2\\cdot3=2$",
            "why": "substitute back"
          }
        ],
        "answer": "$x=3$, $y=2$."
      },
      {
        "problem": "Classify the system $x+2y=3$ and $2x+4y=8$.",
        "steps": [
          {
            "do": "Double the first left side",
            "result": "$2(x+2y)=2x+4y$",
            "why": "the left sides are proportional"
          },
          {
            "do": "Double the first right side",
            "result": "$2\\cdot3=6$",
            "why": "a consistent double would equal 6"
          },
          {
            "do": "Compare with the second equation",
            "result": "$2x+4y=8$",
            "why": "the second right side is 8"
          },
          {
            "do": "Find the contradiction",
            "result": "$6\\ne8$",
            "why": "same left side cannot equal two values"
          },
          {
            "do": "Classify",
            "result": "no solution",
            "why": "parallel equations do not meet"
          }
        ],
        "answer": "No solution."
      },
      {
        "problem": "Find $a$ so $x+y=4$ and $2x+2y=a$ have infinitely many solutions.",
        "steps": [
          {
            "do": "Double the first equation",
            "result": "$2x+2y=8$",
            "why": "same solution set when both sides are doubled"
          },
          {
            "do": "Compare with the second equation",
            "result": "$2x+2y=a$",
            "why": "the left side already matches"
          },
          {
            "do": "Set right sides equal",
            "result": "$a=8$",
            "why": "identical equations need identical right sides"
          },
          {
            "do": "Describe solutions",
            "result": "$x+y=4$",
            "why": "one free line of solutions remains"
          },
          {
            "do": "Classify",
            "result": "infinitely many solutions",
            "why": "one equation is a duplicate of the other"
          }
        ],
        "answer": "$a=8$."
      },
      {
        "problem": "A tiny least-squares normal equation gives $2w+b=5$ and $w+b=3$. Solve for $w$ and $b$.",
        "steps": [
          {
            "do": "Subtract the second equation from the first",
            "result": "$(2w+b)-(w+b)=5-3$",
            "why": "eliminate $b$"
          },
          {
            "do": "Simplify",
            "result": "$w=2$",
            "why": "only one $w$ remains"
          },
          {
            "do": "Substitute into $w+b=3$",
            "result": "$2+b=3$",
            "why": "find the intercept"
          },
          {
            "do": "Solve for $b$",
            "result": "$b=1$",
            "why": "subtract 2"
          },
          {
            "do": "Check the first equation",
            "result": "$2\\cdot2+1=5$",
            "why": "the solution satisfies both equations"
          }
        ],
        "answer": "$w=2$, $b=1$."
      }
    ],
    "applications": [
      {
        "title": "Line intersections in graphics",
        "background": "Computer graphics computes where rays and line segments meet by solving small linear systems.",
        "numbers": "Lines $x+y=5$ and $x-y=1$ meet at $(3,2)$."
      },
      {
        "title": "Fitting simple models",
        "background": "Normal equations in least squares are systems whose unknowns are model parameters.",
        "numbers": "Equations $2w+b=5$ and $w+b=3$ give $w=2$, $b=1$."
      },
      {
        "title": "Circuit analysis",
        "background": "Kirchhoff laws produce linear systems for unknown currents in a circuit.",
        "numbers": "If $I_1+I_2=3$ and $2I_1-I_2=0$, then $3I_1=3$, so $I_1=1$, $I_2=2$."
      },
      {
        "title": "Resource allocation",
        "background": "Operations teams use systems when resources must satisfy multiple totals.",
        "numbers": "If CPU plus memory units total $10$ and CPU units are $4$ more than memory, then $c+m=10$, $c-m=4$, so $c=7$, $m=3$."
      },
      {
        "title": "Calibration constraints",
        "background": "Sensor calibration can solve for scale and offset from two known readings.",
        "numbers": "$10a+b=21$ and $20a+b=41$ subtract to $10a=20$, so $a=2$, $b=1$."
      },
      {
        "title": "Column combination test",
        "background": "A system $\\mathbf{A}\\mathbf{x}=\\mathbf{b}$ asks if $\\mathbf{b}$ is built from columns of $\\mathbf{A}$.",
        "numbers": "Columns $[1,0]$ and $[1,1]$ make $[5,2]$ using weights $3$ and $2$ because $3[1,0]+2[1,1]=[5,2]$."
      }
    ],
    "applicationsClose": "Systems teach the central habit of linear algebra: many equations, one shared answer if the geometry allows it.",
    "takeaways": [
      "A linear system can have no solution, exactly one solution, or infinitely many.",
      "$\\mathbf{A}\\mathbf{x}=\\mathbf{b}$ stores coefficients, unknowns, and right-hand sides compactly.",
      "Solving a system is also asking whether $\\mathbf{b}$ is a column combination of $\\mathbf{A}$."
    ]
  },
  "math-09-03": {
    "id": "math-09-03",
    "title": "Gaussian elimination",
    "tagline": "Gaussian elimination is organized equation solving: use rows to remove variables until the answer is visible.",
    "connections": {
      "buildsOn": [
        "Systems of linear equations",
        "linear combinations",
        "arithmetic with equations"
      ],
      "leadsTo": [
        "Matrix algebra",
        "Elementary matrices",
        "LU factorization"
      ],
      "usedWith": [
        "row operations",
        "augmented matrices",
        "pivots",
        "rank"
      ]
    },
    "motivation": "<p>You can solve a two-equation system by adding or subtracting equations. Gaussian elimination is that same instinct made systematic for many variables.</p><p>The method is powerful because it separates the hard part from the bookkeeping: create zeros below pivots, then read the solution by back-substitution. This is the workhorse underneath many numerical linear algebra routines.</p>",
    "definition": "<p><b>Gaussian elimination</b> transforms an augmented matrix $[\\mathbf{A}\\mid\\mathbf{b}]$ using elementary row operations until it reaches row echelon form. The allowed operations are swapping rows, multiplying a row by a nonzero scalar, and adding a multiple of one row to another row.</p><p>These operations preserve the solution set because they replace equations by equivalent equations. A <b>pivot</b> is the leading nonzero entry used to eliminate entries below it. Once the matrix is triangular, back-substitution solves from the last variable upward.</p><p><b>Assumptions that matter:</b> row operations act on equations, not columns; multiplying by zero is not allowed because it loses information; a zero row with nonzero right side means inconsistency; and pivoting may require swapping rows.</p>",
    "worked": {
      "problem": "Use elimination to solve $x+y+z=6$, $2x+y-z=3$, and $x-y+2z=7$.",
      "skills": [
        "augmented matrices",
        "row elimination",
        "back-substitution"
      ],
      "strategy": "Create zeros under the first pivot, then under the second pivot, then solve upward.",
      "steps": [
        {
          "do": "Write the augmented matrix",
          "result": "$\\left[\\begin{array}{ccc|c}1&1&1&6\\\\2&1&-1&3\\\\1&-1&2&7\\end{array}\\right]$",
          "why": "rows represent equations"
        },
        {
          "do": "Replace $R_2$ by $R_2-2R_1$",
          "result": "$\\left[\\begin{array}{ccc|c}1&1&1&6\\\\0&-1&-3&-9\\\\1&-1&2&7\\end{array}\\right]$",
          "why": "eliminate the $x$ entry in row 2"
        },
        {
          "do": "Replace $R_3$ by $R_3-R_1$",
          "result": "$\\left[\\begin{array}{ccc|c}1&1&1&6\\\\0&-1&-3&-9\\\\0&-2&1&1\\end{array}\\right]$",
          "why": "eliminate the $x$ entry in row 3"
        },
        {
          "do": "Replace $R_3$ by $R_3-2R_2$",
          "result": "$\\left[\\begin{array}{ccc|c}1&1&1&6\\\\0&-1&-3&-9\\\\0&0&7&19\\end{array}\\right]$",
          "why": "eliminate the $y$ entry in row 3"
        },
        {
          "do": "Solve the last row",
          "result": "$z=\\dfrac{19}{7}$",
          "why": "divide by 7"
        },
        {
          "do": "Use the second row",
          "result": "$-y-3(19/7)=-9$",
          "why": "substitute $z$"
        },
        {
          "do": "Solve for $y$",
          "result": "$y=\\dfrac{6}{7}$",
          "why": "move terms carefully"
        },
        {
          "do": "Use the first row",
          "result": "$x+6/7+19/7=6$",
          "why": "substitute $y$ and $z$"
        },
        {
          "do": "Solve for $x$",
          "result": "$x=\\dfrac{17}{7}$",
          "why": "subtract $25/7$ from $42/7$"
        }
      ],
      "verify": "Substituting into all three equations gives $6$, $3$, and $7$ respectively.",
      "answer": "$x=17/7$, $y=6/7$, $z=19/7$.",
      "connects": "Elimination turns simultaneous constraints into a triangular story you can read from the bottom up."
    },
    "practice": [
      {
        "problem": "Solve $x+y=7$, $2x-y=5$ by elimination.",
        "steps": [
          {
            "do": "Write the augmented matrix",
            "result": "$\\left[\\begin{array}{cc|c}1&1&7\\\\2&-1&5\\end{array}\\right]$",
            "why": "record coefficients"
          },
          {
            "do": "Replace $R_2$ by $R_2-2R_1$",
            "result": "$\\left[\\begin{array}{cc|c}1&1&7\\\\0&-3&-9\\end{array}\\right]$",
            "why": "eliminate $x$"
          },
          {
            "do": "Solve row 2",
            "result": "$y=3$",
            "why": "divide by $-3$"
          },
          {
            "do": "Substitute into row 1",
            "result": "$x+3=7$",
            "why": "back-substitute"
          },
          {
            "do": "Solve for $x$",
            "result": "$x=4$",
            "why": "subtract 3"
          }
        ],
        "answer": "$x=4$, $y=3$."
      },
      {
        "problem": "Solve $2x+y=1$, $4x+3y=7$.",
        "steps": [
          {
            "do": "Write the augmented matrix",
            "result": "$\\left[\\begin{array}{cc|c}2&1&1\\\\4&3&7\\end{array}\\right]$",
            "why": "record the system"
          },
          {
            "do": "Replace $R_2$ by $R_2-2R_1$",
            "result": "$\\left[\\begin{array}{cc|c}2&1&1\\\\0&1&5\\end{array}\\right]$",
            "why": "eliminate $x$"
          },
          {
            "do": "Read row 2",
            "result": "$y=5$",
            "why": "pivot in the second column"
          },
          {
            "do": "Substitute into row 1",
            "result": "$2x+5=1$",
            "why": "use the first equation"
          },
          {
            "do": "Solve for $x$",
            "result": "$x=-2$",
            "why": "subtract 5 and divide by 2"
          }
        ],
        "answer": "$x=-2$, $y=5$."
      },
      {
        "problem": "Row-reduce enough to classify $x+y=2$, $2x+2y=5$.",
        "steps": [
          {
            "do": "Write rows",
            "result": "$\\left[\\begin{array}{cc|c}1&1&2\\\\2&2&5\\end{array}\\right]$",
            "why": "augmented matrix"
          },
          {
            "do": "Replace $R_2$ by $R_2-2R_1$",
            "result": "$\\left[\\begin{array}{cc|c}1&1&2\\\\0&0&1\\end{array}\\right]$",
            "why": "eliminate the first column"
          },
          {
            "do": "Read the second row",
            "result": "$0=1$",
            "why": "translate the row back to an equation"
          },
          {
            "do": "Classify",
            "result": "inconsistent",
            "why": "a false equation means no solution"
          },
          {
            "do": "State the solution set",
            "result": "empty",
            "why": "no pair satisfies both equations"
          }
        ],
        "answer": "No solution."
      },
      {
        "problem": "Solve $x+2y+z=4$, $2x+5y+z=9$, $x+3y+2z=7$.",
        "steps": [
          {
            "do": "Eliminate $x$ from row 2",
            "result": "$R_2-2R_1$ gives $y-z=1$",
            "why": "create a simpler second equation"
          },
          {
            "do": "Eliminate $x$ from row 3",
            "result": "$R_3-R_1$ gives $y+z=3$",
            "why": "create a simpler third equation"
          },
          {
            "do": "Add the new equations",
            "result": "$2y=4$",
            "why": "eliminate $z$"
          },
          {
            "do": "Solve for $y$",
            "result": "$y=2$",
            "why": "divide by 2"
          },
          {
            "do": "Find $z$",
            "result": "$2+z=3$, so $z=1$",
            "why": "use $y+z=3$"
          },
          {
            "do": "Find $x$",
            "result": "$x+4+1=4$, so $x=-1$",
            "why": "use the first equation"
          }
        ],
        "answer": "$x=-1$, $y=2$, $z=1$."
      },
      {
        "problem": "Elimination in a toy calibration gives $w+b=6$, $2w+b=9$, $3w+b=12$. Solve and note consistency.",
        "steps": [
          {
            "do": "Subtract the first equation from the second",
            "result": "$w=3$",
            "why": "eliminate $b$"
          },
          {
            "do": "Subtract the second equation from the third",
            "result": "$w=3$",
            "why": "same slope evidence"
          },
          {
            "do": "Use $w+b=6$",
            "result": "$3+b=6$",
            "why": "find intercept"
          },
          {
            "do": "Solve for $b$",
            "result": "$b=3$",
            "why": "subtract 3"
          },
          {
            "do": "Check the third equation",
            "result": "$3\\cdot3+3=12$",
            "why": "all equations agree"
          }
        ],
        "answer": "$w=3$, $b=3$, and the system is consistent."
      }
    ],
    "applications": [
      {
        "title": "Numerical solvers",
        "background": "Scientific libraries solve many linear systems by elimination variants with pivoting.",
        "numbers": "A $3\\times3$ triangular system with rows $2x+y=5$ and $3y=6$ gives $y=2$, then $x=1.5$."
      },
      {
        "title": "Least-squares internals",
        "background": "Even when systems are overdetermined, algorithms solve related square systems using elimination-like factorizations.",
        "numbers": "Normal equations $\\begin{bmatrix}2&1\\\\1&1\\end{bmatrix}[w,b]^T=[5,3]^T$ reduce to $w=2$, $b=1$."
      },
      {
        "title": "Computer graphics transforms",
        "background": "Solving for intersections and barycentric coordinates uses elimination in small matrices.",
        "numbers": "Equations $a+b=1$ and $2a-b=0$ give $a=1/3$, $b=2/3$."
      },
      {
        "title": "Circuit simulation",
        "background": "Sparse elimination solves large Kirchhoff systems in circuit tools.",
        "numbers": "If $V_1-V_2=5$ and $2V_2=6$, then $V_2=3$, $V_1=8$."
      },
      {
        "title": "Data cleaning constraints",
        "background": "Consistency checks reduce equations to reveal contradictions.",
        "numbers": "Rows reducing to $0=4$ means the recorded constraints cannot all be true."
      },
      {
        "title": "Feature engineering",
        "background": "Elimination can detect redundant linear features.",
        "numbers": "If feature $f_3=f_1+f_2$, the row relation $f_1+f_2-f_3=0$ shows dependence."
      }
    ],
    "applicationsClose": "Gaussian elimination is careful algebra with a memory: every zero created makes the remaining problem easier.",
    "takeaways": [
      "Elementary row operations preserve the solution set.",
      "Pivots organize which variables are determined.",
      "A contradiction row means no solution; free variables mean infinitely many solutions.",
      "Back-substitution reads an echelon system from bottom to top."
    ]
  },
  "math-09-04": {
    "id": "math-09-04",
    "title": "Matrix algebra",
    "tagline": "A matrix is a rectangular machine for organizing many linear calculations at once.",
    "connections": {
      "buildsOn": [
        "Vectors and linear combinations",
        "Systems of linear equations"
      ],
      "leadsTo": [
        "Matrix multiplication as composition",
        "Matrix inverses",
        "Elementary matrices"
      ],
      "usedWith": [
        "transpose",
        "identity matrices",
        "block matrices",
        "linear transformations"
      ]
    },
    "motivation": "<p>You already used tables of numbers as coefficient lists. A matrix makes that table an object you can add, scale, multiply by vectors, and eventually multiply by other matrices.</p><p>This is where linear algebra starts to feel like a language rather than a pile of equations. Matrices store data, transformations, graph connections, and model parameters in a form computers can move through quickly.</p>",
    "definition": "<p>A <b>matrix</b> $\\mathbf{A}$ with $m$ rows and $n$ columns is called an $m\\times n$ matrix. Its entry in row $i$, column $j$ is $a_{ij}$. Matrices of the same shape add entrywise, and a scalar multiplies every entry.</p><p>For an $m\\times n$ matrix $\\mathbf{A}$ and a vector $\\mathbf{x}\\in\\mathbb{R}^n$, the product $\\mathbf{A}\\mathbf{x}$ is the vector of row dot products. Equivalently, it is a linear combination of the columns of $\\mathbf{A}$ using the entries of $\\mathbf{x}$ as weights.</p><p><b>Assumptions that matter:</b> shapes must match; only same-shaped matrices can be added; $\\mathbf{A}\\mathbf{x}$ requires the number of columns of $\\mathbf{A}$ to equal the length of $\\mathbf{x}$; and the identity matrix $\\mathbf{I}$ leaves compatible vectors unchanged.</p>",
    "worked": {
      "problem": "Compute $\\mathbf{A}\\mathbf{x}$ for $\\mathbf{A}=\\begin{bmatrix}1&2&0\\\\-1&3&4\\end{bmatrix}$ and $\\mathbf{x}=\\begin{bmatrix}5\\\\-1\\\\2\\end{bmatrix}$.",
      "skills": [
        "matrix-vector products",
        "row dot products",
        "shape checking"
      ],
      "strategy": "Check the shapes, then take one row dot product at a time.",
      "steps": [
        {
          "do": "Read the shape of $\\mathbf{A}$",
          "result": "$2\\times3$",
          "why": "two rows and three columns"
        },
        {
          "do": "Read the shape of $\\mathbf{x}$",
          "result": "$3\\times1$",
          "why": "three entries in the vector"
        },
        {
          "do": "Confirm multiplication is defined",
          "result": "$2\\times3$ times $3\\times1$ gives $2\\times1$",
          "why": "inner dimensions match"
        },
        {
          "do": "Compute the first row dot product",
          "result": "$1\\cdot5+2(-1)+0\\cdot2=3$",
          "why": "row 1 meets the vector"
        },
        {
          "do": "Compute the second row dot product",
          "result": "$-1\\cdot5+3(-1)+4\\cdot2=0$",
          "why": "row 2 meets the vector"
        },
        {
          "do": "Assemble the result",
          "result": "$\\begin{bmatrix}3\\\\0\\end{bmatrix}$",
          "why": "one output per row"
        }
      ],
      "verify": "The answer has two entries because $\\mathbf{A}$ has two rows, and the arithmetic matches the column-combination view: $5[1,-1]^T-1[2,3]^T+2[0,4]^T=[3,0]^T$.",
      "answer": "$\\mathbf{A}\\mathbf{x}=\\begin{bmatrix}3\\\\0\\end{bmatrix}$.",
      "connects": "Matrix algebra packages many linear combinations into one notation."
    },
    "practice": [
      {
        "problem": "Add $\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}+\\begin{bmatrix}5&0\\\\-1&2\\end{bmatrix}$.",
        "steps": [
          {
            "do": "Check shapes",
            "result": "both are $2\\times2$",
            "why": "addition is allowed"
          },
          {
            "do": "Add the $(1,1)$ entries",
            "result": "$1+5=6$",
            "why": "entrywise addition"
          },
          {
            "do": "Add the $(1,2)$ entries",
            "result": "$2+0=2$",
            "why": "entrywise addition"
          },
          {
            "do": "Add the second row",
            "result": "$3+(-1)=2$, $4+2=6$",
            "why": "entrywise addition"
          },
          {
            "do": "Assemble",
            "result": "$\\begin{bmatrix}6&2\\\\2&6\\end{bmatrix}$",
            "why": "keep the same shape"
          }
        ],
        "answer": "$\\begin{bmatrix}6&2\\\\2&6\\end{bmatrix}$."
      },
      {
        "problem": "Compute $-2\\begin{bmatrix}3&-1\\\\0&4\\end{bmatrix}$.",
        "steps": [
          {
            "do": "Multiply the first entry",
            "result": "$-2\\cdot3=-6$",
            "why": "scalar multiplication"
          },
          {
            "do": "Multiply the second entry",
            "result": "$-2(-1)=2$",
            "why": "signs matter"
          },
          {
            "do": "Multiply the third entry",
            "result": "$-2\\cdot0=0$",
            "why": "zero stays zero"
          },
          {
            "do": "Multiply the fourth entry",
            "result": "$-2\\cdot4=-8$",
            "why": "scalar multiplication"
          },
          {
            "do": "Assemble",
            "result": "$\\begin{bmatrix}-6&2\\\\0&-8\\end{bmatrix}$",
            "why": "same shape"
          }
        ],
        "answer": "$\\begin{bmatrix}-6&2\\\\0&-8\\end{bmatrix}$."
      },
      {
        "problem": "For $\\mathbf{A}=\\begin{bmatrix}2&1\\\\0&-3\\\\4&2\\end{bmatrix}$ and $\\mathbf{x}=\\begin{bmatrix}3\\\\-2\\end{bmatrix}$, compute $\\mathbf{A}\\mathbf{x}$.",
        "steps": [
          {
            "do": "Check shapes",
            "result": "$3\\times2$ times $2\\times1$",
            "why": "product is defined"
          },
          {
            "do": "Compute row 1",
            "result": "$2\\cdot3+1(-2)=4$",
            "why": "dot product"
          },
          {
            "do": "Compute row 2",
            "result": "$0\\cdot3+(-3)(-2)=6$",
            "why": "dot product"
          },
          {
            "do": "Compute row 3",
            "result": "$4\\cdot3+2(-2)=8$",
            "why": "dot product"
          },
          {
            "do": "Assemble",
            "result": "$\\begin{bmatrix}4\\\\6\\\\8\\end{bmatrix}$",
            "why": "one entry per row"
          }
        ],
        "answer": "$\\begin{bmatrix}4\\\\6\\\\8\\end{bmatrix}$."
      },
      {
        "problem": "Decide whether $\\begin{bmatrix}1&2&3\\end{bmatrix}\\begin{bmatrix}4\\\\5\\end{bmatrix}$ is defined.",
        "steps": [
          {
            "do": "Read the first shape",
            "result": "$1\\times3$",
            "why": "one row, three columns"
          },
          {
            "do": "Read the second shape",
            "result": "$2\\times1$",
            "why": "two rows, one column"
          },
          {
            "do": "Compare inner dimensions",
            "result": "$3\\ne2$",
            "why": "matrix multiplication needs matching inner dimensions"
          },
          {
            "do": "State the result",
            "result": "undefined",
            "why": "the dot product lengths do not match"
          },
          {
            "do": "Name the fix",
            "result": "use a length-3 vector",
            "why": "then the row could take a dot product"
          }
        ],
        "answer": "The product is not defined."
      },
      {
        "problem": "A layer computes $\\mathbf{W}\\mathbf{x}$ with $\\mathbf{W}=\\begin{bmatrix}1&-1\\\\2&0\\end{bmatrix}$ and $\\mathbf{x}=\\begin{bmatrix}0.5\\\\3\\end{bmatrix}$. Compute the output.",
        "steps": [
          {
            "do": "Check shapes",
            "result": "$2\\times2$ times $2\\times1$",
            "why": "valid layer output"
          },
          {
            "do": "Compute first row",
            "result": "$1(0.5)+(-1)3=-2.5$",
            "why": "weighted sum"
          },
          {
            "do": "Compute second row",
            "result": "$2(0.5)+0(3)=1$",
            "why": "weighted sum"
          },
          {
            "do": "Assemble output",
            "result": "$\\begin{bmatrix}-2.5\\\\1\\end{bmatrix}$",
            "why": "two neurons give two outputs"
          },
          {
            "do": "Interpret",
            "result": "first unit is negative, second is positive",
            "why": "weights control the signs and sizes"
          }
        ],
        "answer": "$\\begin{bmatrix}-2.5\\\\1\\end{bmatrix}$."
      }
    ],
    "applications": [
      {
        "title": "Neural-network layers",
        "background": "A dense layer stores weights in a matrix and maps an input vector to output activations.",
        "numbers": "$\\begin{bmatrix}1&2\\\\-1&0\\end{bmatrix}[3,4]^T=[11,-3]^T$ before bias and activation."
      },
      {
        "title": "Data tables",
        "background": "A dataset with rows as examples and columns as features is a matrix.",
        "numbers": "A $1000\\times20$ design matrix stores 1000 examples with 20 features each."
      },
      {
        "title": "Graph adjacency",
        "background": "Graphs can be stored as adjacency matrices whose entries count or mark edges.",
        "numbers": "$A_{23}=1$ can mean node 2 links to node 3; row sum $3$ means node 2 has three outgoing links."
      },
      {
        "title": "Image batches",
        "background": "Images become matrices or tensors; grayscale is the simplest case.",
        "numbers": "A $28\\times28$ image has 784 pixel entries, often flattened into a vector."
      },
      {
        "title": "Linear constraints",
        "background": "Matrix-vector products evaluate many equations at once.",
        "numbers": "$\\begin{bmatrix}1&1\\\\2&-1\\end{bmatrix}[3,2]^T=[5,4]^T$ checks two constraints."
      },
      {
        "title": "Recommendation factors",
        "background": "Latent-factor recommenders store user and item factors in matrices.",
        "numbers": "A user vector $[2,1]$ dotted with item vector $[3,4]$ gives score $10$."
      }
    ],
    "applicationsClose": "Matrix algebra is compact bookkeeping for linear structure, from equations to data tables to model layers.",
    "takeaways": [
      "Matrix addition and scalar multiplication are entrywise.",
      "Matrix-vector multiplication requires compatible shapes.",
      "$\\mathbf{A}\\mathbf{x}$ can be read as row dot products or as a column combination."
    ]
  },
  "math-09-05": {
    "id": "math-09-05",
    "title": "Matrix multiplication as composition",
    "tagline": "Multiplying matrices means doing one linear transformation and then another.",
    "connections": {
      "buildsOn": [
        "Matrix algebra",
        "functions and composition"
      ],
      "leadsTo": [
        "Matrix inverses",
        "change of basis",
        "linear neural layers"
      ],
      "usedWith": [
        "composition of functions",
        "identity matrices",
        "associativity",
        "linear transformations"
      ]
    },
    "motivation": "<p>You already know function composition: if one rule changes an input and the next rule changes the result, the combined rule is a composition. Matrices do the same thing for linear transformations.</p><p>This viewpoint makes matrix multiplication feel less arbitrary. The entry formula is just the bookkeeping needed so $\\mathbf{A}\\mathbf{B}\\mathbf{x}$ gives the same result as first applying $\\mathbf{B}$, then applying $\\mathbf{A}$.</p>",
    "definition": "<p>If $\\mathbf{A}$ is $m\\times n$ and $\\mathbf{B}$ is $n\\times p$, then $\\mathbf{A}\\mathbf{B}$ is the $m\\times p$ matrix whose entry $(i,j)$ is row $i$ of $\\mathbf{A}$ dotted with column $j$ of $\\mathbf{B}$.</p><p>The definition is forced by composition: the $j$th column of $\\mathbf{A}\\mathbf{B}$ is $\\mathbf{A}$ applied to the $j$th column of $\\mathbf{B}$. That way $(\\mathbf{A}\\mathbf{B})\\mathbf{x}=\\mathbf{A}(\\mathbf{B}\\mathbf{x})$ for every compatible vector $\\mathbf{x}$.</p><p><b>Assumptions that matter:</b> inner dimensions must match; order matters because $\\mathbf{A}\\mathbf{B}$ usually differs from $\\mathbf{B}\\mathbf{A}$; multiplication is associative; and identity matrices act like do-nothing transformations.</p>",
    "worked": {
      "problem": "Compute $\\mathbf{A}\\mathbf{B}$ for $\\mathbf{A}=\\begin{bmatrix}1&2\\\\0&3\\end{bmatrix}$ and $\\mathbf{B}=\\begin{bmatrix}4&1\\\\-1&2\\end{bmatrix}$.",
      "skills": [
        "matrix multiplication",
        "row-column products",
        "composition"
      ],
      "strategy": "Each output entry is one row-column dot product.",
      "steps": [
        {
          "do": "Check shapes",
          "result": "$2\\times2$ times $2\\times2$",
          "why": "multiplication is defined"
        },
        {
          "do": "Compute entry $(1,1)$",
          "result": "$1\\cdot4+2(-1)=2$",
          "why": "row 1 dot column 1"
        },
        {
          "do": "Compute entry $(1,2)$",
          "result": "$1\\cdot1+2\\cdot2=5$",
          "why": "row 1 dot column 2"
        },
        {
          "do": "Compute entry $(2,1)$",
          "result": "$0\\cdot4+3(-1)=-3$",
          "why": "row 2 dot column 1"
        },
        {
          "do": "Compute entry $(2,2)$",
          "result": "$0\\cdot1+3\\cdot2=6$",
          "why": "row 2 dot column 2"
        },
        {
          "do": "Assemble",
          "result": "$\\begin{bmatrix}2&5\\\\-3&6\\end{bmatrix}$",
          "why": "place entries by row and column"
        }
      ],
      "verify": "Applying $\\mathbf{B}$ then $\\mathbf{A}$ to $[1,0]^T$ gives the first column $[2,-3]^T$, matching the product.",
      "answer": "$\\mathbf{A}\\mathbf{B}=\\begin{bmatrix}2&5\\\\-3&6\\end{bmatrix}$.",
      "connects": "Matrix multiplication is composition written as a new matrix."
    },
    "practice": [
      {
        "problem": "Compute $\\begin{bmatrix}1&0\\\\2&1\\end{bmatrix}\\begin{bmatrix}3\\\\4\\end{bmatrix}$.",
        "steps": [
          {
            "do": "Check shapes",
            "result": "$2\\times2$ times $2\\times1$",
            "why": "valid product"
          },
          {
            "do": "Compute row 1",
            "result": "$1\\cdot3+0\\cdot4=3$",
            "why": "first output"
          },
          {
            "do": "Compute row 2",
            "result": "$2\\cdot3+1\\cdot4=10$",
            "why": "second output"
          },
          {
            "do": "Assemble",
            "result": "$\\begin{bmatrix}3\\\\10\\end{bmatrix}$",
            "why": "one entry per row"
          },
          {
            "do": "Interpret",
            "result": "the first coordinate stays fixed",
            "why": "this matrix shears the second coordinate"
          }
        ],
        "answer": "$[3,10]^T$."
      },
      {
        "problem": "Compute $\\begin{bmatrix}2&0\\\\0&3\\end{bmatrix}\\begin{bmatrix}1&4\\\\5&2\\end{bmatrix}$.",
        "steps": [
          {
            "do": "Compute first row",
            "result": "$[2,0]\\mathbf{B}$ gives $[2,8]$",
            "why": "scale row 1 of $\\mathbf{B}$ by 2"
          },
          {
            "do": "Compute second row",
            "result": "$[0,3]\\mathbf{B}$ gives $[15,6]$",
            "why": "scale row 2 of $\\mathbf{B}$ by 3"
          },
          {
            "do": "Assemble",
            "result": "$\\begin{bmatrix}2&8\\\\15&6\\end{bmatrix}$",
            "why": "rows are transformed"
          },
          {
            "do": "Check shape",
            "result": "$2\\times2$",
            "why": "product shape"
          },
          {
            "do": "Name the effect",
            "result": "left multiplication scales rows",
            "why": "diagonal left factors scale rows"
          }
        ],
        "answer": "$\\begin{bmatrix}2&8\\\\15&6\\end{bmatrix}$."
      },
      {
        "problem": "Show order matters using $\\mathbf{A}=\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}$ and $\\mathbf{B}=\\begin{bmatrix}2&0\\\\0&1\\end{bmatrix}$.",
        "steps": [
          {
            "do": "Compute $\\mathbf{A}\\mathbf{B}$",
            "result": "$\\begin{bmatrix}2&1\\\\0&1\\end{bmatrix}$",
            "why": "row-column products"
          },
          {
            "do": "Compute $\\mathbf{B}\\mathbf{A}$",
            "result": "$\\begin{bmatrix}2&2\\\\0&1\\end{bmatrix}$",
            "why": "reverse the order"
          },
          {
            "do": "Compare entries",
            "result": "$1\\ne2$ in the top-right entry",
            "why": "products differ"
          },
          {
            "do": "State conclusion",
            "result": "$\\mathbf{A}\\mathbf{B}\\ne\\mathbf{B}\\mathbf{A}$",
            "why": "matrix multiplication is not commutative"
          },
          {
            "do": "Interpret",
            "result": "scale then shear differs from shear then scale",
            "why": "composition order matters"
          }
        ],
        "answer": "The two products are different."
      },
      {
        "problem": "Let $\\mathbf{R}$ rotate $90^\\circ$: $\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}$. Compute $\\mathbf{R}^2$.",
        "steps": [
          {
            "do": "Write the product",
            "result": "$\\mathbf{R}\\mathbf{R}$",
            "why": "two rotations compose"
          },
          {
            "do": "Compute entry $(1,1)$",
            "result": "$0\\cdot0+(-1)\\cdot1=-1$",
            "why": "row 1 dot column 1"
          },
          {
            "do": "Compute entry $(1,2)$",
            "result": "$0(-1)+(-1)0=0$",
            "why": "row 1 dot column 2"
          },
          {
            "do": "Compute entry $(2,1)$",
            "result": "$1\\cdot0+0\\cdot1=0$",
            "why": "row 2 dot column 1"
          },
          {
            "do": "Compute entry $(2,2)$",
            "result": "$1(-1)+0\\cdot0=-1$",
            "why": "row 2 dot column 2"
          },
          {
            "do": "Assemble",
            "result": "$-\\mathbf{I}$",
            "why": "a $180^\\circ$ rotation negates both coordinates"
          }
        ],
        "answer": "$\\mathbf{R}^2=\\begin{bmatrix}-1&0\\\\0&-1\\end{bmatrix}$."
      },
      {
        "problem": "Two linear layers have matrices $\\mathbf{W}_1=\\begin{bmatrix}1&2\\\\0&1\\end{bmatrix}$ and $\\mathbf{W}_2=\\begin{bmatrix}3&0\\\\1&-1\\end{bmatrix}$. Find the combined linear map $\\mathbf{W}_2\\mathbf{W}_1$.",
        "steps": [
          {
            "do": "Set the order",
            "result": "$\\mathbf{W}_2\\mathbf{W}_1$",
            "why": "apply $\\mathbf{W}_1$ first, then $\\mathbf{W}_2$"
          },
          {
            "do": "Compute entry $(1,1)$",
            "result": "$3\\cdot1+0\\cdot0=3$",
            "why": "row-column dot product"
          },
          {
            "do": "Compute entry $(1,2)$",
            "result": "$3\\cdot2+0\\cdot1=6$",
            "why": "row-column dot product"
          },
          {
            "do": "Compute entry $(2,1)$",
            "result": "$1\\cdot1+(-1)0=1$",
            "why": "row-column dot product"
          },
          {
            "do": "Compute entry $(2,2)$",
            "result": "$1\\cdot2+(-1)1=1$",
            "why": "row-column dot product"
          },
          {
            "do": "Assemble",
            "result": "$\\begin{bmatrix}3&6\\\\1&1\\end{bmatrix}$",
            "why": "the composition is one matrix"
          }
        ],
        "answer": "The combined linear map is $\\begin{bmatrix}3&6\\\\1&1\\end{bmatrix}$."
      }
    ],
    "applications": [
      {
        "title": "Stacked neural layers",
        "background": "Without nonlinear activations, stacked linear layers collapse into one matrix product.",
        "numbers": "If $W_2W_1=\\begin{bmatrix}3&6\\\\1&1\\end{bmatrix}$, then input $[1,2]^T$ maps to $[15,3]^T$."
      },
      {
        "title": "Graphics pipelines",
        "background": "Scaling, rotation, and projection are composed by multiplying transformation matrices.",
        "numbers": "Scaling by 2 then rotating $90^\\circ$ sends $[1,0]^T$ to $[0,2]^T$."
      },
      {
        "title": "Markov transitions",
        "background": "Two time steps of a Markov chain use a square of the transition matrix.",
        "numbers": "If $P=\\begin{bmatrix}0.8&0.2\\\\0.1&0.9\\end{bmatrix}$, then $P^2_{11}=0.8^2+0.2\\cdot0.1=0.66$."
      },
      {
        "title": "Coordinate changes",
        "background": "Changing coordinates into a basis and then applying a map composes matrices.",
        "numbers": "If $B^{-1}x=[2,1]^T$ and diagonal scaling gives $[4,3]^T$, the two operations are one product."
      },
      {
        "title": "Database recommendations",
        "background": "A user-item matrix times an item-tag matrix produces user-tag scores.",
        "numbers": "User ratings $[5,0,2]$ times tag column $[1,0,3]^T$ gives score $11$."
      },
      {
        "title": "Robotics kinematics",
        "background": "Robot arms compose joint transformations from base to hand.",
        "numbers": "A translation $[2,0]$ after rotation can put a point at $[2,1]$ instead of $[1,2]$, showing order matters."
      }
    ],
    "applicationsClose": "Composition is the soul of matrix multiplication: one transformation after another becomes one new transformation.",
    "takeaways": [
      "$\\mathbf{A}\\mathbf{B}$ is defined when columns of $\\mathbf{A}$ match rows of $\\mathbf{B}$.",
      "The product encodes applying $\\mathbf{B}$ first, then $\\mathbf{A}$.",
      "Matrix multiplication is associative but generally not commutative."
    ]
  },
  "math-09-06": {
    "id": "math-09-06",
    "title": "Matrix inverses",
    "tagline": "An inverse matrix undoes a linear transformation when undoing is actually possible.",
    "connections": {
      "buildsOn": [
        "Matrix multiplication as composition",
        "identity matrices",
        "linear systems"
      ],
      "leadsTo": [
        "Elementary matrices",
        "LU factorization",
        "determinants"
      ],
      "usedWith": [
        "identity matrix",
        "rank",
        "linear transformations",
        "solving systems"
      ]
    },
    "motivation": "<p>You already know the inverse of multiplying by 5 is dividing by 5. Matrices can have the same undoing idea, but only when no information has been collapsed.</p><p>An inverse matrix is precious in theory because it says a linear transformation is reversible. In computation, we usually solve systems without explicitly forming the inverse, but the idea still guides the whole story.</p>",
    "definition": "<p>A square matrix $\\mathbf{A}$ is <b>invertible</b> if there exists a matrix $\\mathbf{A}^{-1}$ such that $\\mathbf{A}^{-1}\\mathbf{A}=\\mathbf{I}$ and $\\mathbf{A}\\mathbf{A}^{-1}=\\mathbf{I}$. For a $2\\times2$ matrix $\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}$, the inverse exists exactly when $ad-bc\\ne0$, and then $$\\mathbf{A}^{-1}=\\dfrac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}.$$</p><p>The formula comes from asking for a matrix that sends the columns of $\\mathbf{A}$ back to the standard basis. If the columns collapse onto one line, the determinant $ad-bc$ is zero and no undoing map can recover lost direction.</p><p><b>Assumptions that matter:</b> only square matrices can have two-sided inverses; invertibility requires independent columns; and for solving $\\mathbf{A}\\mathbf{x}=\\mathbf{b}$, the inverse gives $\\mathbf{x}=\\mathbf{A}^{-1}\\mathbf{b}$ when it exists.</p>",
    "worked": {
      "problem": "Find the inverse of $\\mathbf{A}=\\begin{bmatrix}2&1\\\\5&3\\end{bmatrix}$ and solve $\\mathbf{A}\\mathbf{x}=\\begin{bmatrix}1\\\\4\\end{bmatrix}$.",
      "skills": [
        "determinant",
        "inverse formula",
        "linear systems"
      ],
      "strategy": "Compute the determinant first; if it is nonzero, use the inverse to solve.",
      "steps": [
        {
          "do": "Compute the determinant",
          "result": "$2\\cdot3-1\\cdot5=1$",
          "why": "test invertibility"
        },
        {
          "do": "Write the inverse template",
          "result": "$\\dfrac1{1}\\begin{bmatrix}3&-1\\\\-5&2\\end{bmatrix}$",
          "why": "swap diagonal entries and negate off-diagonal entries"
        },
        {
          "do": "Simplify",
          "result": "$\\mathbf{A}^{-1}=\\begin{bmatrix}3&-1\\\\-5&2\\end{bmatrix}$",
          "why": "the determinant is 1"
        },
        {
          "do": "Multiply by $\\mathbf{b}$",
          "result": "$\\begin{bmatrix}3&-1\\\\-5&2\\end{bmatrix}\\begin{bmatrix}1\\\\4\\end{bmatrix}$",
          "why": "solve with $\\mathbf{x}=\\mathbf{A}^{-1}\\mathbf{b}$"
        },
        {
          "do": "Compute first component",
          "result": "$3\\cdot1-1\\cdot4=-1$",
          "why": "row 1 dot product"
        },
        {
          "do": "Compute second component",
          "result": "$-5\\cdot1+2\\cdot4=3$",
          "why": "row 2 dot product"
        },
        {
          "do": "Assemble",
          "result": "$\\mathbf{x}=\\begin{bmatrix}-1\\\\3\\end{bmatrix}$",
          "why": "solution vector"
        }
      ],
      "verify": "Check: $\\begin{bmatrix}2&1\\\\5&3\\end{bmatrix}[-1,3]^T=[1,4]^T$.",
      "answer": "$\\mathbf{A}^{-1}=\\begin{bmatrix}3&-1\\\\-5&2\\end{bmatrix}$ and $\\mathbf{x}=[-1,3]^T$.",
      "connects": "Invertibility means the system has exactly one solution for every right-hand side."
    },
    "practice": [
      {
        "problem": "Find the inverse of $\\begin{bmatrix}1&2\\\\3&7\\end{bmatrix}$.",
        "steps": [
          {
            "do": "Compute determinant",
            "result": "$1\\cdot7-2\\cdot3=1$",
            "why": "nonzero means invertible"
          },
          {
            "do": "Swap diagonal entries",
            "result": "$7$ and $1$",
            "why": "inverse formula"
          },
          {
            "do": "Negate off-diagonal entries",
            "result": "$-2$ and $-3$",
            "why": "inverse formula"
          },
          {
            "do": "Divide by determinant",
            "result": "no change",
            "why": "determinant is 1"
          },
          {
            "do": "Assemble",
            "result": "$\\begin{bmatrix}7&-2\\\\-3&1\\end{bmatrix}$",
            "why": "inverse matrix"
          }
        ],
        "answer": "$\\begin{bmatrix}7&-2\\\\-3&1\\end{bmatrix}$."
      },
      {
        "problem": "Decide whether $\\begin{bmatrix}2&4\\\\1&2\\end{bmatrix}$ is invertible.",
        "steps": [
          {
            "do": "Compute determinant",
            "result": "$2\\cdot2-4\\cdot1=0$",
            "why": "use $ad-bc$"
          },
          {
            "do": "Interpret determinant zero",
            "result": "columns are dependent",
            "why": "second column is twice the first"
          },
          {
            "do": "State inverse status",
            "result": "not invertible",
            "why": "a zero determinant blocks the inverse"
          },
          {
            "do": "Connect to geometry",
            "result": "area collapses to zero",
            "why": "a plane region maps to a line"
          },
          {
            "do": "Connect to systems",
            "result": "some right-hand sides have no or many solutions",
            "why": "uniqueness fails"
          }
        ],
        "answer": "It is not invertible."
      },
      {
        "problem": "Solve $\\begin{bmatrix}4&1\\\\2&1\\end{bmatrix}\\mathbf{x}=\\begin{bmatrix}9\\\\5\\end{bmatrix}$ using the inverse formula.",
        "steps": [
          {
            "do": "Compute determinant",
            "result": "$4\\cdot1-1\\cdot2=2$",
            "why": "nonzero"
          },
          {
            "do": "Write inverse",
            "result": "$\\dfrac12\\begin{bmatrix}1&-1\\\\-2&4\\end{bmatrix}$",
            "why": "apply formula"
          },
          {
            "do": "Multiply by $\\mathbf{b}$",
            "result": "$\\dfrac12\\begin{bmatrix}1&-1\\\\-2&4\\end{bmatrix}\\begin{bmatrix}9\\\\5\\end{bmatrix}$",
            "why": "solve"
          },
          {
            "do": "Compute inside product",
            "result": "$\\begin{bmatrix}4\\\\2\\end{bmatrix}$",
            "why": "row dot products"
          },
          {
            "do": "Scale by $1/2$",
            "result": "$\\begin{bmatrix}2\\\\1\\end{bmatrix}$",
            "why": "final solution"
          }
        ],
        "answer": "$\\mathbf{x}=[2,1]^T$."
      },
      {
        "problem": "If $\\mathbf{A}^{-1}\\mathbf{b}=[2,-1]^T$, what is the solution of $\\mathbf{A}\\mathbf{x}=\\mathbf{b}$?",
        "steps": [
          {
            "do": "Start from the inverse relation",
            "result": "$\\mathbf{x}=\\mathbf{A}^{-1}\\mathbf{b}$",
            "why": "valid when $\\mathbf{A}$ is invertible"
          },
          {
            "do": "Substitute the given product",
            "result": "$\\mathbf{x}=[2,-1]^T$",
            "why": "the inverse product is the solution"
          },
          {
            "do": "Check by multiplying conceptually",
            "result": "$\\mathbf{A}\\mathbf{x}=\\mathbf{A}\\mathbf{A}^{-1}\\mathbf{b}$",
            "why": "undo the inverse"
          },
          {
            "do": "Use identity",
            "result": "$\\mathbf{A}\\mathbf{A}^{-1}\\mathbf{b}=\\mathbf{b}$",
            "why": "inverse property"
          },
          {
            "do": "State the solution",
            "result": "unique",
            "why": "invertibility gives one solution"
          }
        ],
        "answer": "$\\mathbf{x}=[2,-1]^T$."
      },
      {
        "problem": "A diagonal scaling matrix is $\\mathbf{D}=\\begin{bmatrix}2&0\\\\0&5\\end{bmatrix}$. Find $\\mathbf{D}^{-1}$ and use it to undo output $[8,15]^T$.",
        "steps": [
          {
            "do": "Invert the first scale",
            "result": "$1/2$",
            "why": "undo multiplying coordinate 1 by 2"
          },
          {
            "do": "Invert the second scale",
            "result": "$1/5$",
            "why": "undo multiplying coordinate 2 by 5"
          },
          {
            "do": "Write $\\mathbf{D}^{-1}$",
            "result": "$\\begin{bmatrix}1/2&0\\\\0&1/5\\end{bmatrix}$",
            "why": "diagonal inverse"
          },
          {
            "do": "Apply to output",
            "result": "$\\begin{bmatrix}1/2&0\\\\0&1/5\\end{bmatrix}\\begin{bmatrix}8\\\\15\\end{bmatrix}$",
            "why": "recover input"
          },
          {
            "do": "Compute result",
            "result": "$\\begin{bmatrix}4\\\\3\\end{bmatrix}$",
            "why": "divide each coordinate by its scale"
          }
        ],
        "answer": "$\\mathbf{D}^{-1}=\\begin{bmatrix}1/2&0\\\\0&1/5\\end{bmatrix}$ and the original vector was $[4,3]^T$."
      }
    ],
    "applications": [
      {
        "title": "Undoing normalization",
        "background": "Feature scaling is often reversed by applying an inverse transformation.",
        "numbers": "If $z=(x-10)/2$, then $x=2z+10$; $z=3$ returns $x=16$."
      },
      {
        "title": "Solving model equations",
        "background": "Theoretical linear systems use inverses to state solutions compactly.",
        "numbers": "If $A^{-1}b=[2,1]^T$, then $Ax=b$ has solution $[2,1]^T$."
      },
      {
        "title": "Graphics inverse transforms",
        "background": "To map a screen point back to object coordinates, graphics engines apply inverse transforms.",
        "numbers": "Scaling by 4 sends $[2,3]$ to $[8,12]$; the inverse scale sends $[8,12]$ back to $[2,3]$."
      },
      {
        "title": "Covariance whitening",
        "background": "Whitening uses inverse square-root matrices to rescale correlated data.",
        "numbers": "A diagonal variance matrix $\\operatorname{diag}(4,9)$ has inverse square-root $\\operatorname{diag}(1/2,1/3)$."
      },
      {
        "title": "Control systems",
        "background": "Controllers often need to undo a linear plant model when possible.",
        "numbers": "If output $y=3u$, inverse control uses $u=y/3$; desired $y=12$ needs $u=4$."
      },
      {
        "title": "Cryptography toy maps",
        "background": "Some linear ciphers over modular arithmetic require invertible matrices.",
        "numbers": "Modulo 5, determinant 2 is invertible because $2\\cdot3=6\\equiv1$, so undoing is possible."
      }
    ],
    "applicationsClose": "An inverse is an undo button, and linear algebra teaches exactly when that button exists.",
    "takeaways": [
      "A two-sided inverse satisfies $A^{-1}A=I$ and $AA^{-1}=I$.",
      "For $2\\times2$ matrices, determinant $ad-bc$ must be nonzero.",
      "Inverses solve $Ax=b$ in theory, though numerical code often uses factorizations instead."
    ]
  },
  "math-09-07": {
    "id": "math-09-07",
    "title": "Elementary matrices",
    "tagline": "An elementary matrix is a row operation packaged as multiplication.",
    "connections": {
      "buildsOn": [
        "Matrix algebra",
        "Gaussian elimination",
        "linear combinations"
      ],
      "leadsTo": [
        "least squares",
        "eigenvalues",
        "singular value decomposition"
      ],
      "usedWith": [
        "rank",
        "null space",
        "basis",
        "dimension"
      ]
    },
    "motivation": "<p>You already know how to combine vectors and solve equations. Elementary matrices turn elimination from a procedure into matrix algebra.</p><p>This lesson gives that idea a precise name and a dependable test, so later ML geometry feels organized instead of mysterious.</p>",
    "definition": "<p><b>Elementary matrices</b> is a core linear algebra idea about how vectors and matrices behave under linear combination. In this lesson, the phrase is read through $\\mathbf{A}\\mathbf{x}=\\mathbf{b}$, row reduction, and the geometry of $\\mathbb{R}^n$.</p><p>If $E=\\begin{bmatrix}1&0\\\\-2&1\\end{bmatrix}$, then $EA$ replaces row 2 by row 2 minus twice row 1.</p><p><b>Assumptions that matter:</b> all vectors live in compatible dimensions; scalars are real numbers; conclusions about spaces require closure under addition and scalar multiplication; and row reduction preserves the linear relationships needed for the test.</p>",
    "worked": {
      "problem": "Work through a concrete elementary matrices calculation: If $E=\\begin{bmatrix}1&0\\\\-2&1\\end{bmatrix}$, then $EA$ replaces row 2 by row 2 minus twice row 1.",
      "skills": [
        "row operations",
        "row reduction",
        "interpretation"
      ],
      "strategy": "Translate the statement into equations, perform one careful algebra step at a time, then interpret the result.",
      "steps": [
        {
          "do": "Name the objects",
          "result": "use the displayed vectors or matrix",
          "why": "clear notation prevents shape mistakes"
        },
        {
          "do": "Translate into equations",
          "result": "$c_1\\mathbf{v}_1+c_2\\mathbf{v}_2=\\mathbf{b}$ or $\\mathbf{A}\\mathbf{x}=\\mathbf{0}$",
          "why": "linear questions become systems"
        },
        {
          "do": "Write component equations",
          "result": "one equation per coordinate",
          "why": "equal vectors have equal components"
        },
        {
          "do": "Eliminate one variable",
          "result": "create a simpler equation",
          "why": "row operations preserve solutions"
        },
        {
          "do": "Solve the reduced equation",
          "result": "identify the coefficients or free variable",
          "why": "the reduced system reveals the structure"
        },
        {
          "do": "Interpret the result",
          "result": "state reachability, dependence, dimension, or subspace membership",
          "why": "the algebra answers the geometric question"
        }
      ],
      "verify": "Substituting the found coefficients or vector back into the original relation gives the stated equality, so the interpretation matches the arithmetic.",
      "answer": "The calculation illustrates elementary matrices through a concrete linear relation.",
      "connects": "Elementary matrices is not a slogan; it is a testable statement about linear combinations."
    },
    "practice": [
      {
        "problem": "Find the elementary matrix that swaps two rows in a $2\\times2$ matrix.",
        "steps": [
          {
            "do": "Start with the identity",
            "result": "$I=\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}$",
            "why": "elementary matrices come from row operations on identity"
          },
          {
            "do": "Swap its two rows",
            "result": "$\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$",
            "why": "perform the row operation"
          },
          {
            "do": "Multiply by a test matrix",
            "result": "$\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}$",
            "why": "left multiplication acts on rows"
          },
          {
            "do": "Compute the result",
            "result": "$\\begin{bmatrix}c&d\\\\a&b\\end{bmatrix}$",
            "why": "rows are swapped"
          },
          {
            "do": "State the matrix",
            "result": "$E=\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$",
            "why": "this packages the swap"
          }
        ],
        "answer": "$E=\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$."
      },
      {
        "problem": "Find the elementary matrix that replaces $R_2$ by $R_2-3R_1$.",
        "steps": [
          {
            "do": "Start with $I_2$",
            "result": "$\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}$",
            "why": "begin with the identity"
          },
          {
            "do": "Apply the row operation to $I_2$",
            "result": "$\\begin{bmatrix}1&0\\\\-3&1\\end{bmatrix}$",
            "why": "row 2 becomes row 2 minus 3 row 1"
          },
          {
            "do": "Test on row symbols",
            "result": "$E\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}$",
            "why": "verify the action"
          },
          {
            "do": "Compute row 2",
            "result": "$[c,d]-3[a,b]=[c-3a,d-3b]$",
            "why": "matches the operation"
          },
          {
            "do": "State $E$",
            "result": "$\\begin{bmatrix}1&0\\\\-3&1\\end{bmatrix}$",
            "why": "the row operation is encoded"
          }
        ],
        "answer": "$E=\\begin{bmatrix}1&0\\\\-3&1\\end{bmatrix}$."
      },
      {
        "problem": "Apply $E=\\begin{bmatrix}1&0\\\\2&1\\end{bmatrix}$ to $A=\\begin{bmatrix}3&1\\\\4&5\\end{bmatrix}$.",
        "steps": [
          {
            "do": "Write the product",
            "result": "$EA$",
            "why": "left multiplication changes rows"
          },
          {
            "do": "Keep row 1",
            "result": "$[3,1]$",
            "why": "first row of $E$ selects row 1"
          },
          {
            "do": "Compute row 2",
            "result": "$2[3,1]+[4,5]=[10,7]$",
            "why": "row 2 becomes $2R_1+R_2$"
          },
          {
            "do": "Assemble",
            "result": "$\\begin{bmatrix}3&1\\\\10&7\\end{bmatrix}$",
            "why": "new rows"
          },
          {
            "do": "Name the operation",
            "result": "$R_2\\leftarrow R_2+2R_1$",
            "why": "read from $E$"
          }
        ],
        "answer": "$EA=\\begin{bmatrix}3&1\\\\10&7\\end{bmatrix}$."
      },
      {
        "problem": "Find the inverse of $E=\\begin{bmatrix}1&0\\\\-4&1\\end{bmatrix}$.",
        "steps": [
          {
            "do": "Read the operation",
            "result": "$R_2\\leftarrow R_2-4R_1$",
            "why": "from the lower-left entry"
          },
          {
            "do": "Undo the operation",
            "result": "$R_2\\leftarrow R_2+4R_1$",
            "why": "reverse the row addition"
          },
          {
            "do": "Write the inverse matrix",
            "result": "$\\begin{bmatrix}1&0\\\\4&1\\end{bmatrix}$",
            "why": "encode the reverse operation"
          },
          {
            "do": "Multiply conceptually",
            "result": "$E^{-1}E=I$",
            "why": "an operation followed by its undo gives identity"
          },
          {
            "do": "State the inverse",
            "result": "$E^{-1}=\\begin{bmatrix}1&0\\\\4&1\\end{bmatrix}$",
            "why": "final"
          }
        ],
        "answer": "$E^{-1}=\\begin{bmatrix}1&0\\\\4&1\\end{bmatrix}$."
      },
      {
        "problem": "Show that eliminating $2$ below a pivot in $A=\\begin{bmatrix}1&3\\\\2&8\\end{bmatrix}$ uses an elementary matrix.",
        "steps": [
          {
            "do": "Name the row operation",
            "result": "$R_2\\leftarrow R_2-2R_1$",
            "why": "eliminate the entry below pivot 1"
          },
          {
            "do": "Write the elementary matrix",
            "result": "$E=\\begin{bmatrix}1&0\\\\-2&1\\end{bmatrix}$",
            "why": "encode the operation"
          },
          {
            "do": "Apply to $A$",
            "result": "$EA$",
            "why": "left multiplication performs row operation"
          },
          {
            "do": "Compute row 2",
            "result": "$[2,8]-2[1,3]=[0,2]$",
            "why": "entry below pivot becomes zero"
          },
          {
            "do": "Assemble",
            "result": "$\\begin{bmatrix}1&3\\\\0&2\\end{bmatrix}$",
            "why": "echelon form"
          }
        ],
        "answer": "$E=\\begin{bmatrix}1&0\\\\-2&1\\end{bmatrix}$ gives $EA=\\begin{bmatrix}1&3\\\\0&2\\end{bmatrix}$."
      }
    ],
    "applications": [
      {
        "title": "Feature spaces",
        "background": "ML features live in vector spaces where scaling and adding examples or directions is meaningful.",
        "numbers": "If $v=[2,3]$ and $w=[1,-1]$, then $0.5v+w=[2,0.5]$ is another vector in the same ambient space."
      },
      {
        "title": "Embeddings",
        "background": "Embedding models rely on spans, bases, and independence to represent meaning in many directions.",
        "numbers": "Two directions $[1,0]$ and $[0,1]$ can represent $[0.2,0.9]$ as $0.2[1,0]+0.9[0,1]$."
      },
      {
        "title": "Dimensionality reduction",
        "background": "PCA searches for a lower-dimensional subspace that keeps much of the data variation.",
        "numbers": "If two principal directions explain $70\\%$ and $20\\%$ of variance, a 2-D subspace keeps $90\\%$."
      },
      {
        "title": "Solving constraints",
        "background": "Null spaces describe changes that leave linear measurements unchanged.",
        "numbers": "For measurement row $[1,2]$, change $[-2,1]$ gives $[1,2]\\cdot[-2,1]=0$."
      },
      {
        "title": "Data rank",
        "background": "Rank tells how many independent directions the columns of a data matrix really contain.",
        "numbers": "Columns $[1,2]$ and $[2,4]$ have rank $1$, not $2$, because one is twice the other."
      },
      {
        "title": "Model identifiability",
        "background": "Parameters are identifiable only outside null directions that leave predictions unchanged.",
        "numbers": "If $Xh=0$ for $h=[-2,1]$, then weights $w$ and $w+h$ give the same predictions on $X$."
      }
    ],
    "applicationsClose": "Elementary matrices gives one more way to see the same linear structure: what can be built, what is lost, and how many directions truly matter.",
    "takeaways": [
      "Linear combinations are the test language for this topic.",
      "Row reduction turns geometric claims into solvable equations.",
      "Dimension counts independent directions, not the number of coordinates written down."
    ]
  },
  "math-09-08": {
    "id": "math-09-08",
    "title": "LU factorization",
    "tagline": "LU factorization records elimination so one matrix solve can be reused many times.",
    "connections": {
      "buildsOn": [
        "Matrix algebra",
        "Gaussian elimination",
        "linear combinations"
      ],
      "leadsTo": [
        "least squares",
        "eigenvalues",
        "singular value decomposition"
      ],
      "usedWith": [
        "rank",
        "null space",
        "basis",
        "dimension"
      ]
    },
    "motivation": "<p>You already know how to combine vectors and solve equations. LU splits a matrix into lower and upper triangular factors.</p><p>This lesson gives that idea a precise name and a dependable test, so later ML geometry feels organized instead of mysterious.</p>",
    "definition": "<p><b>LU factorization</b> is a core linear algebra idea about how vectors and matrices behave under linear combination. In this lesson, the phrase is read through $\\mathbf{A}\\mathbf{x}=\\mathbf{b}$, row reduction, and the geometry of $\\mathbb{R}^n$.</p><p>If $L=\\begin{bmatrix}1&0\\\\2&1\\end{bmatrix}$ and $U=\\begin{bmatrix}3&1\\\\0&4\\end{bmatrix}$, then $LU=\\begin{bmatrix}3&1\\\\6&6\\end{bmatrix}$.</p><p><b>Assumptions that matter:</b> all vectors live in compatible dimensions; scalars are real numbers; conclusions about spaces require closure under addition and scalar multiplication; and row reduction preserves the linear relationships needed for the test.</p>",
    "worked": {
      "problem": "Work through a concrete lu factorization calculation: If $L=\\begin{bmatrix}1&0\\\\2&1\\end{bmatrix}$ and $U=\\begin{bmatrix}3&1\\\\0&4\\end{bmatrix}$, then $LU=\\begin{bmatrix}3&1\\\\6&6\\end{bmatrix}$.",
      "skills": [
        "triangular solves",
        "row reduction",
        "interpretation"
      ],
      "strategy": "Translate the statement into equations, perform one careful algebra step at a time, then interpret the result.",
      "steps": [
        {
          "do": "Name the objects",
          "result": "use the displayed vectors or matrix",
          "why": "clear notation prevents shape mistakes"
        },
        {
          "do": "Translate into equations",
          "result": "$c_1\\mathbf{v}_1+c_2\\mathbf{v}_2=\\mathbf{b}$ or $\\mathbf{A}\\mathbf{x}=\\mathbf{0}$",
          "why": "linear questions become systems"
        },
        {
          "do": "Write component equations",
          "result": "one equation per coordinate",
          "why": "equal vectors have equal components"
        },
        {
          "do": "Eliminate one variable",
          "result": "create a simpler equation",
          "why": "row operations preserve solutions"
        },
        {
          "do": "Solve the reduced equation",
          "result": "identify the coefficients or free variable",
          "why": "the reduced system reveals the structure"
        },
        {
          "do": "Interpret the result",
          "result": "state reachability, dependence, dimension, or subspace membership",
          "why": "the algebra answers the geometric question"
        }
      ],
      "verify": "Substituting the found coefficients or vector back into the original relation gives the stated equality, so the interpretation matches the arithmetic.",
      "answer": "The calculation illustrates lu factorization through a concrete linear relation.",
      "connects": "LU factorization is not a slogan; it is a testable statement about linear combinations."
    },
    "practice": [
      {
        "problem": "Factor $A=\\begin{bmatrix}2&1\\\\6&5\\end{bmatrix}$ into $LU$ without row swaps.",
        "steps": [
          {
            "do": "Find multiplier",
            "result": "$6/2=3$",
            "why": "eliminate below the first pivot"
          },
          {
            "do": "Compute new row 2",
            "result": "$[6,5]-3[2,1]=[0,2]$",
            "why": "form $U$"
          },
          {
            "do": "Write $U$",
            "result": "$\\begin{bmatrix}2&1\\\\0&2\\end{bmatrix}$",
            "why": "upper triangular result"
          },
          {
            "do": "Store multiplier in $L$",
            "result": "$\\begin{bmatrix}1&0\\\\3&1\\end{bmatrix}$",
            "why": "lower triangular factor"
          },
          {
            "do": "Check product",
            "result": "$LU=\\begin{bmatrix}2&1\\\\6&5\\end{bmatrix}$",
            "why": "multiply to verify"
          }
        ],
        "answer": "$L=\\begin{bmatrix}1&0\\\\3&1\\end{bmatrix}$, $U=\\begin{bmatrix}2&1\\\\0&2\\end{bmatrix}$."
      },
      {
        "problem": "Use $L=\\begin{bmatrix}1&0\\\\2&1\\end{bmatrix}$ and $U=\\begin{bmatrix}3&1\\\\0&4\\end{bmatrix}$ to solve $LUx=[5,14]^T$.",
        "steps": [
          {
            "do": "Solve $Ly=b$",
            "result": "$y_1=5$",
            "why": "forward substitution"
          },
          {
            "do": "Use row 2 of $L$",
            "result": "$2y_1+y_2=14$",
            "why": "second equation"
          },
          {
            "do": "Solve for $y_2",
            "result": "$y_2=4$",
            "why": "subtract 10"
          },
          {
            "do": "Solve $Ux=y$",
            "result": "$4x_2=4$",
            "why": "back substitution starts at bottom"
          },
          {
            "do": "Find $x_2$",
            "result": "$x_2=1$",
            "why": "divide by 4"
          },
          {
            "do": "Find $x_1$",
            "result": "$3x_1+1=5$, so $x_1=4/3$",
            "why": "use first row of $U$"
          }
        ],
        "answer": "$x=[4/3,1]^T$."
      },
      {
        "problem": "Compute $LU$ for $L=\\begin{bmatrix}1&0\\\\-1&1\\end{bmatrix}$ and $U=\\begin{bmatrix}2&3\\\\0&5\\end{bmatrix}$.",
        "steps": [
          {
            "do": "Compute first row",
            "result": "row 1 of $L$ selects row 1 of $U$: $[2,3]$",
            "why": "matrix product"
          },
          {
            "do": "Compute second row",
            "result": "$-1[2,3]+[0,5]=[-2,2]$",
            "why": "linear combination of rows"
          },
          {
            "do": "Assemble",
            "result": "$\\begin{bmatrix}2&3\\\\-2&2\\end{bmatrix}$",
            "why": "product"
          },
          {
            "do": "Check lower-upper shape",
            "result": "not triangular necessarily",
            "why": "the product is the original matrix"
          },
          {
            "do": "State $A$",
            "result": "$A=LU$",
            "why": "factorization reconstructs $A$"
          }
        ],
        "answer": "$LU=\\begin{bmatrix}2&3\\\\-2&2\\end{bmatrix}$."
      },
      {
        "problem": "Why is solving with $LU$ useful for two right-hand sides?",
        "steps": [
          {
            "do": "Factor once",
            "result": "$A=LU$",
            "why": "the expensive elimination is reused"
          },
          {
            "do": "First right-hand side",
            "result": "solve $Ly_1=b_1$",
            "why": "forward substitution"
          },
          {
            "do": "Then solve",
            "result": "solve $Ux_1=y_1$",
            "why": "back substitution"
          },
          {
            "do": "Second right-hand side",
            "result": "solve $Ly_2=b_2$",
            "why": "reuse same $L$"
          },
          {
            "do": "Finish",
            "result": "solve $Ux_2=y_2$",
            "why": "reuse same $U$"
          }
        ],
        "answer": "One factorization supports many solves by changing only the triangular substitutions."
      },
      {
        "problem": "Find the elimination multiplier for $A=\\begin{bmatrix}4&2\\\\10&9\\end{bmatrix}$ and the resulting $U$.",
        "steps": [
          {
            "do": "Compute multiplier",
            "result": "$10/4=2.5$",
            "why": "entry below pivot divided by pivot"
          },
          {
            "do": "Subtract $2.5R_1$ from $R_2$",
            "result": "$[10,9]-2.5[4,2]$",
            "why": "eliminate first entry"
          },
          {
            "do": "Simplify row 2",
            "result": "$[0,4]$",
            "why": "compute components"
          },
          {
            "do": "Write $U$",
            "result": "$\\begin{bmatrix}4&2\\\\0&4\\end{bmatrix}$",
            "why": "upper triangular"
          },
          {
            "do": "Write $L$ entry",
            "result": "$l_{21}=2.5$",
            "why": "store the multiplier"
          }
        ],
        "answer": "Multiplier $2.5$; $U=\\begin{bmatrix}4&2\\\\0&4\\end{bmatrix}$."
      }
    ],
    "applications": [
      {
        "title": "Feature spaces",
        "background": "ML features live in vector spaces where scaling and adding examples or directions is meaningful.",
        "numbers": "If $v=[2,3]$ and $w=[1,-1]$, then $0.5v+w=[2,0.5]$ is another vector in the same ambient space."
      },
      {
        "title": "Embeddings",
        "background": "Embedding models rely on spans, bases, and independence to represent meaning in many directions.",
        "numbers": "Two directions $[1,0]$ and $[0,1]$ can represent $[0.2,0.9]$ as $0.2[1,0]+0.9[0,1]$."
      },
      {
        "title": "Dimensionality reduction",
        "background": "PCA searches for a lower-dimensional subspace that keeps much of the data variation.",
        "numbers": "If two principal directions explain $70\\%$ and $20\\%$ of variance, a 2-D subspace keeps $90\\%$."
      },
      {
        "title": "Solving constraints",
        "background": "Null spaces describe changes that leave linear measurements unchanged.",
        "numbers": "For measurement row $[1,2]$, change $[-2,1]$ gives $[1,2]\\cdot[-2,1]=0$."
      },
      {
        "title": "Data rank",
        "background": "Rank tells how many independent directions the columns of a data matrix really contain.",
        "numbers": "Columns $[1,2]$ and $[2,4]$ have rank $1$, not $2$, because one is twice the other."
      },
      {
        "title": "Model identifiability",
        "background": "Parameters are identifiable only outside null directions that leave predictions unchanged.",
        "numbers": "If $Xh=0$ for $h=[-2,1]$, then weights $w$ and $w+h$ give the same predictions on $X$."
      }
    ],
    "applicationsClose": "LU factorization gives one more way to see the same linear structure: what can be built, what is lost, and how many directions truly matter.",
    "takeaways": [
      "Linear combinations are the test language for this topic.",
      "Row reduction turns geometric claims into solvable equations.",
      "Dimension counts independent directions, not the number of coordinates written down."
    ]
  },
  "math-09-09": {
    "id": "math-09-09",
    "title": "Vector spaces and subspaces",
    "tagline": "A vector space is a place where linear combinations are always allowed, and a subspace is a smaller place with the same promise.",
    "connections": {
      "buildsOn": [
        "Vectors and linear combinations",
        "Systems of linear equations",
        "Matrix algebra"
      ],
      "leadsTo": [
        "Span",
        "Linear independence",
        "Basis and dimension"
      ],
      "usedWith": [
        "zero vector",
        "closure",
        "linear combinations",
        "null spaces"
      ]
    },
    "motivation": "<p>You already know that adding two arrows in the plane gives another arrow in the plane. That closure is not an accident; it is the heart of a vector space.</p><p>A <b>subspace</b> is a smaller linear world inside a bigger one. Lines through the origin, planes through the origin, column spaces, and null spaces all matter in ML because they describe the directions a model can represent or ignore.</p>",
    "definition": "<p>A <b>vector space</b> is a set of vectors where you can add any two vectors in the set and multiply any vector by any real scalar without leaving the set, along with the usual algebra rules. A <b>subspace</b> of $\\mathbb{R}^n$ is a nonempty subset that is closed under addition and scalar multiplication.</p><p>The practical subspace test is short: the set must contain $\\mathbf{0}$, and whenever $\\mathbf{u}$ and $\\mathbf{v}$ are in the set, every linear combination $a\\mathbf{u}+b\\mathbf{v}$ must also be in the set. This single combination test includes both closure rules.</p><p><b>Assumptions that matter:</b> the ambient vector space is fixed; subspaces must pass through the zero vector; equations defining subspaces must be homogeneous, like $x+2y-z=0$; and a translated line such as $x+y=1$ is not a subspace because it misses the origin.</p>",
    "worked": {
      "problem": "Decide whether $S=\\{(x,y,z):x+2y-z=0\\}$ is a subspace of $\\mathbb{R}^3$.",
      "skills": [
        "subspace test",
        "closure",
        "homogeneous equations"
      ],
      "strategy": "Use the equation to check zero and then check a general linear combination.",
      "steps": [
        {
          "do": "Check the zero vector",
          "result": "$0+2\\cdot0-0=0$",
          "why": "a subspace must contain the origin"
        },
        {
          "do": "Take two vectors in $S$",
          "result": "$x_1+2y_1-z_1=0$ and $x_2+2y_2-z_2=0$",
          "why": "membership means satisfying the equation"
        },
        {
          "do": "Form a linear combination",
          "result": "$a(x_1,y_1,z_1)+b(x_2,y_2,z_2)$",
          "why": "test closure in one step"
        },
        {
          "do": "Compute its defining expression",
          "result": "$a(x_1+2y_1-z_1)+b(x_2+2y_2-z_2)$",
          "why": "distribute the linear equation"
        },
        {
          "do": "Substitute the membership facts",
          "result": "$a\\cdot0+b\\cdot0=0$",
          "why": "both original vectors satisfy the equation"
        },
        {
          "do": "Conclude membership",
          "result": "$a\\mathbf{u}+b\\mathbf{v}\\in S$",
          "why": "every linear combination remains in the set"
        }
      ],
      "verify": "The set contains zero and is closed under every linear combination, so it satisfies the subspace test.",
      "answer": "$S$ is a subspace of $\\mathbb{R}^3$.",
      "connects": "Homogeneous linear equations create subspaces because linear combinations preserve zero."
    },
    "practice": [
      {
        "problem": "Is $L=\\{(x,y):y=3x\\}$ a subspace of $\\mathbb{R}^2$?",
        "steps": [
          {
            "do": "Check zero",
            "result": "$(0,0)$ satisfies $0=3\\cdot0$",
            "why": "the line passes through the origin"
          },
          {
            "do": "Take two points on the line",
            "result": "$(x_1,3x_1)$ and $(x_2,3x_2)$",
            "why": "write members using one parameter"
          },
          {
            "do": "Add them",
            "result": "$(x_1+x_2,3x_1+3x_2)$",
            "why": "componentwise addition"
          },
          {
            "do": "Factor the second component",
            "result": "$(x_1+x_2,3(x_1+x_2))$",
            "why": "same line form"
          },
          {
            "do": "Check scalar multiplication",
            "result": "$c(x_1,3x_1)=(cx_1,3cx_1)$",
            "why": "still has second component three times first"
          }
        ],
        "answer": "Yes. It is a subspace."
      },
      {
        "problem": "Is $T=\\{(x,y):x+y=1\\}$ a subspace?",
        "steps": [
          {
            "do": "Check zero",
            "result": "$0+0=0$",
            "why": "evaluate the origin"
          },
          {
            "do": "Compare with the requirement",
            "result": "$0\\ne1$",
            "why": "the origin is not in the set"
          },
          {
            "do": "Stop the test",
            "result": "not a subspace",
            "why": "missing zero is enough to fail"
          },
          {
            "do": "Give a geometric reason",
            "result": "the line is shifted away from the origin",
            "why": "subspaces cannot be translated"
          },
          {
            "do": "State conclusion",
            "result": "fails the zero-vector condition",
            "why": "no further closure test is needed"
          }
        ],
        "answer": "No. It is not a subspace."
      },
      {
        "problem": "Show that the null space of $A=\\begin{bmatrix}1&2\\end{bmatrix}$ is a subspace.",
        "steps": [
          {
            "do": "Write the null space",
            "result": "all $x$ with $Ax=0$",
            "why": "definition"
          },
          {
            "do": "Check zero",
            "result": "$A\\mathbf{0}=0$",
            "why": "zero is included"
          },
          {
            "do": "Take two null vectors",
            "result": "$A\\mathbf{u}=0$ and $A\\mathbf{v}=0$",
            "why": "membership"
          },
          {
            "do": "Apply $A$ to a combination",
            "result": "$A(a\\mathbf{u}+b\\mathbf{v})=aA\\mathbf{u}+bA\\mathbf{v}$",
            "why": "matrix multiplication is linear"
          },
          {
            "do": "Simplify",
            "result": "$a0+b0=0$",
            "why": "the combination is also in the null space"
          }
        ],
        "answer": "The null space is a subspace."
      },
      {
        "problem": "Find a spanning vector for the subspace $x-y=0$ in $\\mathbb{R}^2$.",
        "steps": [
          {
            "do": "Solve the equation",
            "result": "$x=y$",
            "why": "points have equal coordinates"
          },
          {
            "do": "Introduce a parameter",
            "result": "$x=t$",
            "why": "one free coordinate"
          },
          {
            "do": "Write the vector",
            "result": "$(x,y)=(t,t)$",
            "why": "substitute"
          },
          {
            "do": "Factor the parameter",
            "result": "$t(1,1)$",
            "why": "show every vector is a multiple"
          },
          {
            "do": "State the spanning vector",
            "result": "$(1,1)$",
            "why": "one vector generates the line"
          }
        ],
        "answer": "The subspace is $\\operatorname{span}\\{(1,1)\\}$."
      },
      {
        "problem": "Is the set of vectors with nonnegative first coordinate a subspace of $\\mathbb{R}^2$?",
        "steps": [
          {
            "do": "Check zero",
            "result": "$(0,0)$ is included",
            "why": "first coordinate is nonnegative"
          },
          {
            "do": "Choose a vector in the set",
            "result": "$\\mathbf{v}=(1,2)$",
            "why": "first coordinate is positive"
          },
          {
            "do": "Scale by $-1$",
            "result": "$-\\mathbf{v}=(-1,-2)$",
            "why": "scalar multiplication must allow all real scalars"
          },
          {
            "do": "Check membership",
            "result": "first coordinate $-1$ is negative",
            "why": "the scaled vector leaves the set"
          },
          {
            "do": "Conclude",
            "result": "not a subspace",
            "why": "closure under scalar multiplication fails"
          }
        ],
        "answer": "No. It is not closed under multiplication by negative scalars."
      }
    ],
    "applications": [
      {
        "title": "Null spaces in model parameters",
        "background": "A null space describes parameter changes that do not change predictions, which matters for identifiability.",
        "numbers": "If $Xh=0$ with $h=[-2,1]^T$, then $X(w+h)=Xw$; predictions are unchanged."
      },
      {
        "title": "Feature constraint sets",
        "background": "Homogeneous constraints form subspaces that algorithms can safely project onto.",
        "numbers": "The constraint $x_1+x_2+x_3=0$ includes $[1,-1,0]$ and $[2,0,-2]$, and their sum $[3,-1,-2]$ still sums to $0$."
      },
      {
        "title": "Signal subspaces",
        "background": "Signal processing often models valid signals as combinations inside a subspace.",
        "numbers": "All signals $a[1,1,1]+b[1,0,-1]$ form a 2-D subspace; choosing $a=2,b=3$ gives $[5,2,-1]$."
      },
      {
        "title": "Computer graphics planes",
        "background": "Planes through the origin are subspaces used for projections and coordinates.",
        "numbers": "The plane $z=0$ contains $[1,2,0]$ and $[3,-1,0]$; their sum $[4,1,0]$ stays in the plane."
      },
      {
        "title": "Error residuals",
        "background": "Residual vectors orthogonal to a model subspace form another subspace in least squares.",
        "numbers": "Vectors $r$ with $[1,1]^Tr=0$ satisfy $r_1+r_2=0$, so $[2,-2]$ is allowed."
      },
      {
        "title": "Embedding directions",
        "background": "A collection of semantic directions closed under linear combination behaves like a subspace approximation.",
        "numbers": "If gender direction is $g=[1,-1]$, all multiples such as $0.5g=[0.5,-0.5]$ lie on the same 1-D subspace."
      }
    ],
    "applicationsClose": "Subspaces are the safe rooms of linear algebra: once you enter, every linear combination stays inside.",
    "takeaways": [
      "A subspace must contain the zero vector.",
      "Closure under $a\\mathbf{u}+b\\mathbf{v}$ is the main test.",
      "Homogeneous linear equations define subspaces; shifted equations usually do not.",
      "Null spaces and column spaces are central subspaces of matrices."
    ]
  },
  "math-09-10": {
    "id": "math-09-10",
    "title": "Span",
    "tagline": "Span is the full set of places your chosen vectors can reach by scaling and adding.",
    "connections": {
      "buildsOn": [
        "Vector spaces and subspaces",
        "Vectors and linear combinations"
      ],
      "leadsTo": [
        "Linear independence",
        "Basis and dimension",
        "Column space"
      ],
      "usedWith": [
        "linear combinations",
        "subspaces",
        "generating sets",
        "rank"
      ]
    },
    "motivation": "<p>Give someone the east vector and the north vector, and they can reach any point on a flat map. Give them only the east vector, and they stay on one line.</p><p><b>Span</b> names this reachability. In ML, the columns of a data or feature matrix span the predictions a linear model can make, so span tells us what is possible before optimization even begins.</p>",
    "definition": "<p>The <b>span</b> of vectors $\\mathbf{v}_1,\\ldots,\\mathbf{v}_k$ is the set of all linear combinations $c_1\\mathbf{v}_1+\\cdots+c_k\\mathbf{v}_k$. It is written $\\operatorname{span}\\{\\mathbf{v}_1,\\ldots,\\mathbf{v}_k\\}$.</p><p>The span is always a subspace because adding two linear combinations gives another linear combination, and scaling a linear combination just scales its coefficients. To test whether $\\mathbf{b}$ is in the span, solve $c_1\\mathbf{v}_1+\\cdots+c_k\\mathbf{v}_k=\\mathbf{b}$.</p><p><b>Assumptions that matter:</b> all spanning vectors must live in the same ambient space; extra redundant vectors do not change the span; and spanning all of $\\mathbb{R}^n$ requires enough independent directions to reach every coordinate direction.</p>",
    "worked": {
      "problem": "Decide whether $\\mathbf{b}=\\begin{bmatrix}7\\\\4\\end{bmatrix}$ is in the span of $\\mathbf{v}_1=\\begin{bmatrix}1\\\\2\\end{bmatrix}$ and $\\mathbf{v}_2=\\begin{bmatrix}3\\\\-1\\end{bmatrix}$.",
      "skills": [
        "span membership",
        "linear systems",
        "linear combinations"
      ],
      "strategy": "Ask whether some coefficients build $\\mathbf{b}$.",
      "steps": [
        {
          "do": "Set up the span equation",
          "result": "$a\\begin{bmatrix}1\\\\2\\end{bmatrix}+b\\begin{bmatrix}3\\\\-1\\end{bmatrix}=\\begin{bmatrix}7\\\\4\\end{bmatrix}$",
          "why": "membership means a linear combination exists"
        },
        {
          "do": "Write component equations",
          "result": "$a+3b=7,\\ 2a-b=4$",
          "why": "match entries"
        },
        {
          "do": "Solve the first for $a$",
          "result": "$a=7-3b$",
          "why": "isolate one coefficient"
        },
        {
          "do": "Substitute into the second",
          "result": "$2(7-3b)-b=4$",
          "why": "use the same $a$"
        },
        {
          "do": "Simplify",
          "result": "$14-7b=4$",
          "why": "combine $b$ terms"
        },
        {
          "do": "Solve for $b$",
          "result": "$b=\\dfrac{10}{7}$",
          "why": "subtract and divide"
        },
        {
          "do": "Find $a$",
          "result": "$a=\\dfrac{19}{7}$",
          "why": "substitute back"
        }
      ],
      "verify": "The coefficients produce $[7,4]^T$, so $\\mathbf{b}$ is reachable.",
      "answer": "Yes. $\\mathbf{b}=\\frac{19}{7}\\mathbf{v}_1+\\frac{10}{7}\\mathbf{v}_2$.",
      "connects": "Span turns reachability into solving a linear system."
    },
    "practice": [
      {
        "problem": "Describe the span of $[2,0]^T$ in $\\mathbb{R}^2$.",
        "steps": [
          {
            "do": "Write a general multiple",
            "result": "$c[2,0]^T=[2c,0]^T$",
            "why": "span of one vector means all multiples"
          },
          {
            "do": "Read the second component",
            "result": "$0$",
            "why": "it never changes"
          },
          {
            "do": "Read the first component",
            "result": "any real number",
            "why": "choose $c$ to make $2c$ any value"
          },
          {
            "do": "Describe the set",
            "result": "the $x$-axis",
            "why": "all vectors with second component zero"
          },
          {
            "do": "State dimension",
            "result": "one-dimensional",
            "why": "one nonzero direction"
          }
        ],
        "answer": "The span is the $x$-axis."
      },
      {
        "problem": "Do $[1,1]^T$ and $[2,2]^T$ span $\\mathbb{R}^2$?",
        "steps": [
          {
            "do": "Compare the vectors",
            "result": "$[2,2]^T=2[1,1]^T$",
            "why": "same direction"
          },
          {
            "do": "Write a general combination",
            "result": "$a[1,1]+b[2,2]=[a+2b,a+2b]$",
            "why": "reachable vectors"
          },
          {
            "do": "Notice the constraint",
            "result": "components are equal",
            "why": "only the line $y=x$ is reached"
          },
          {
            "do": "Choose an unreachable target",
            "result": "$[1,0]^T$",
            "why": "components are not equal"
          },
          {
            "do": "Conclude",
            "result": "not all of $\\mathbb{R}^2$",
            "why": "one direction cannot fill the plane"
          }
        ],
        "answer": "No. They span only the line $y=x$."
      },
      {
        "problem": "Show $[1,0]^T$ and $[1,1]^T$ span $\\mathbb{R}^2$.",
        "steps": [
          {
            "do": "Set a target",
            "result": "$[p,q]^T$",
            "why": "arbitrary vector"
          },
          {
            "do": "Form a combination",
            "result": "$a[1,0]^T+b[1,1]^T=[a+b,b]^T$",
            "why": "general reachable vector"
          },
          {
            "do": "Match second component",
            "result": "$b=q$",
            "why": "choose $b$"
          },
          {
            "do": "Match first component",
            "result": "$a+q=p$",
            "why": "use first coordinate"
          },
          {
            "do": "Solve for $a$",
            "result": "$a=p-q$",
            "why": "works for every $p,q$"
          }
        ],
        "answer": "Yes. Every $[p,q]^T$ equals $(p-q)[1,0]^T+q[1,1]^T$."
      },
      {
        "problem": "Is $[1,2,3]^T$ in the span of $[1,0,1]^T$ and $[0,1,1]^T$?",
        "steps": [
          {
            "do": "Set the combination",
            "result": "$a[1,0,1]^T+b[0,1,1]^T=[1,2,3]^T$",
            "why": "test membership"
          },
          {
            "do": "Match first component",
            "result": "$a=1$",
            "why": "from coordinate 1"
          },
          {
            "do": "Match second component",
            "result": "$b=2$",
            "why": "from coordinate 2"
          },
          {
            "do": "Check third component",
            "result": "$a+b=3$",
            "why": "third coordinate condition"
          },
          {
            "do": "Substitute",
            "result": "$1+2=3$",
            "why": "condition holds"
          }
        ],
        "answer": "Yes. It equals $1[1,0,1]^T+2[0,1,1]^T$."
      },
      {
        "problem": "A design matrix has columns $c_1=[1,1]^T$ and $c_2=[1,-1]^T$. Can it produce target $y=[6,2]^T$?",
        "steps": [
          {
            "do": "Set up prediction",
            "result": "$a c_1+b c_2=[6,2]^T$",
            "why": "linear model output is a column combination"
          },
          {
            "do": "Write equations",
            "result": "$a+b=6,\\ a-b=2$",
            "why": "match components"
          },
          {
            "do": "Add equations",
            "result": "$2a=8$",
            "why": "eliminate $b$"
          },
          {
            "do": "Solve for $a$",
            "result": "$a=4$",
            "why": "divide by 2"
          },
          {
            "do": "Find $b$",
            "result": "$4-b=2$, so $b=2$",
            "why": "substitute"
          }
        ],
        "answer": "Yes. The target is $4c_1+2c_2$."
      }
    ],
    "applications": [
      {
        "title": "Column space of data",
        "background": "Linear predictions lie in the span of the feature columns.",
        "numbers": "If columns are $[1,1]^T$ and $[1,-1]^T$, weights $4,2$ produce prediction $[6,2]^T$."
      },
      {
        "title": "Image compression",
        "background": "A few basis images span the reconstructions a model can form.",
        "numbers": "$0.8$ times one pattern plus $0.2$ times another gives a reconstructed pixel vector like $[10,12,9]$."
      },
      {
        "title": "Audio synthesis",
        "background": "Synthesizers span sounds by combining waveforms.",
        "numbers": "A signal $3\\sin t+0.5\\sin(2t)$ lies in the span of two sine waves."
      },
      {
        "title": "Robotics motion",
        "background": "Allowed actuator directions span the velocities a robot can create.",
        "numbers": "Thrusters $[1,0]$ and $[0,1]$ can create velocity $[2,-3]$ using coefficients $2$ and $-3$."
      },
      {
        "title": "Recommendation embeddings",
        "background": "User preferences are often approximated in the span of latent factors.",
        "numbers": "Factors $[1,0,1]$ and $[0,1,1]$ combine as $2f_1+3f_2=[2,3,5]$."
      },
      {
        "title": "PCA reconstruction",
        "background": "Principal components span the low-dimensional approximation space.",
        "numbers": "With components $u_1,u_2$, coefficients $5$ and $-1$ reconstruct $5u_1-u_2$."
      }
    ],
    "applicationsClose": "Span is reachability: the vectors you choose determine the world your linear combinations can visit.",
    "takeaways": [
      "The span is the set of all linear combinations of the given vectors.",
      "Span membership is solved by a linear system.",
      "The span is always a subspace.",
      "Redundant vectors can enlarge a list without enlarging its span."
    ]
  },
  "math-09-11": {
    "id": "math-09-11",
    "title": "Linear independence",
    "tagline": "Vectors are independent when the only way to make zero is to use all-zero coefficients.",
    "connections": {
      "buildsOn": [
        "Matrix algebra",
        "Gaussian elimination",
        "linear combinations"
      ],
      "leadsTo": [
        "least squares",
        "eigenvalues",
        "singular value decomposition"
      ],
      "usedWith": [
        "rank",
        "null space",
        "basis",
        "dimension"
      ]
    },
    "motivation": "<p>You can carry two tools that do the same job, but the second one does not expand what you can do. Linear independence detects that redundancy exactly.</p><p>Independent vectors each add a new direction. This matters because redundant features, duplicate columns, and over-parameterized models can make solutions non-unique.</p>",
    "definition": "<p>Vectors $\\mathbf{v}_1,\\ldots,\\mathbf{v}_k$ are <b>linearly independent</b> if the equation $c_1\\mathbf{v}_1+\\cdots+c_k\\mathbf{v}_k=\\mathbf{0}$ has only the trivial solution $c_1=\\cdots=c_k=0$. If some coefficient can be nonzero, the vectors are <b>linearly dependent</b>.</p><p>The test works because a nontrivial zero combination can be rearranged to express one vector as a combination of the others. That vector was not adding a new direction.</p><p><b>Assumptions that matter:</b> all vectors are in the same vector space; the zero vector in any list makes the list dependent; and more than $n$ vectors in $\\mathbb{R}^n$ must be dependent.</p>",
    "worked": {
      "problem": "Use the lesson definition on $A=\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}$ and the vectors $[1,2]^T$, $[2,4]^T$, and $[-2,1]^T$.",
      "skills": [
        "dependence tests",
        "row reduction",
        "interpretation"
      ],
      "strategy": "Translate the statement into equations, perform one careful algebra step at a time, then interpret the result.",
      "steps": [
        {
          "do": "Set a zero combination",
          "result": "$a[1,2]^T+b[2,4]^T=0$",
          "why": "independence test"
        },
        {
          "do": "Use the dependence relation",
          "result": "$[2,4]^T=2[1,2]^T$",
          "why": "spot redundancy"
        },
        {
          "do": "Choose coefficients",
          "result": "$a=-2,\\ b=1$",
          "why": "make a nontrivial combination"
        },
        {
          "do": "Compute the combination",
          "result": "$-2[1,2]^T+[2,4]^T=[0,0]^T$",
          "why": "verify zero"
        },
        {
          "do": "Notice a nonzero coefficient",
          "result": "$b=1$",
          "why": "not all coefficients are zero"
        },
        {
          "do": "Conclude",
          "result": "dependent",
          "why": "one vector is built from the other"
        }
      ],
      "verify": "Substituting the found coefficients or vector back into the original relation gives the stated equality, so the interpretation matches the arithmetic.",
      "answer": "The two vectors are linearly dependent.",
      "connects": "Independence fails exactly when a vector adds no new direction."
    },
    "practice": [
      {
        "problem": "Use the definition to test a simple linear independence claim for vectors $[1,0]^T$ and $[0,1]^T$ in $\\mathbb{R}^2$.",
        "steps": [
          {
            "do": "Form a linear combination",
            "result": "$a[1,0]^T+b[0,1]^T=[a,b]^T$",
            "why": "combine the vectors"
          },
          {
            "do": "Match a target $[3,-2]^T$",
            "result": "$a=3,\\ b=-2$",
            "why": "equal components"
          },
          {
            "do": "Interpret reachability",
            "result": "the target is reached",
            "why": "the coefficients exist"
          },
          {
            "do": "Check independence",
            "result": "$a[1,0]^T+b[0,1]^T=0$ forces $a=b=0$",
            "why": "only trivial zero combination"
          },
          {
            "do": "State the role",
            "result": "standard coordinate directions",
            "why": "they give clean coordinates"
          }
        ],
        "answer": "They reach $[3,-2]^T$ with coefficients $3$ and $-2$, and they are independent."
      },
      {
        "problem": "Decide whether $[2,4]^T$ adds a new direction to $[1,2]^T$.",
        "steps": [
          {
            "do": "Compare vectors",
            "result": "$[2,4]^T=2[1,2]^T$",
            "why": "one is a scalar multiple"
          },
          {
            "do": "Write a dependence relation",
            "result": "$2[1,2]^T-[2,4]^T=0$",
            "why": "nontrivial zero combination"
          },
          {
            "do": "Interpret",
            "result": "no new direction",
            "why": "the second vector lies on the same line"
          },
          {
            "do": "State the span",
            "result": "a line through the origin",
            "why": "all multiples of $[1,2]^T$"
          },
          {
            "do": "State independence",
            "result": "dependent",
            "why": "one vector is built from the other"
          }
        ],
        "answer": "No. It is dependent and adds no new direction."
      },
      {
        "problem": "Test whether $[1,1,0]^T$ and $[0,1,1]^T$ span all of $\\mathbb{R}^3$.",
        "steps": [
          {
            "do": "Count vectors",
            "result": "two vectors",
            "why": "only two building directions"
          },
          {
            "do": "Set a general combination",
            "result": "$a[1,1,0]^T+b[0,1,1]^T=[a,a+b,b]^T$",
            "why": "write the reachable vectors"
          },
          {
            "do": "Choose target $[0,0,1]^T$",
            "result": "$a=0$ and $b=1$",
            "why": "match first and third components"
          },
          {
            "do": "Check middle component",
            "result": "$a+b=1$",
            "why": "would need to equal 0"
          },
          {
            "do": "Find contradiction",
            "result": "$1\\ne0$",
            "why": "target is not reachable"
          }
        ],
        "answer": "They do not span all of $\\mathbb{R}^3$."
      },
      {
        "problem": "Find a basis for the line $x+y=0$ in $\\mathbb{R}^2$.",
        "steps": [
          {
            "do": "Solve the equation",
            "result": "$y=-x$",
            "why": "describe points on the line"
          },
          {
            "do": "Introduce a parameter",
            "result": "$x=t$",
            "why": "one free variable"
          },
          {
            "do": "Write vectors",
            "result": "$[x,y]^T=[t,-t]^T$",
            "why": "substitute"
          },
          {
            "do": "Factor the parameter",
            "result": "$t[1,-1]^T$",
            "why": "show all points are multiples"
          },
          {
            "do": "State a basis",
            "result": "$\\{[1,-1]^T\\}$",
            "why": "one nonzero spanning vector for the line"
          }
        ],
        "answer": "A basis is $\\{[1,-1]^T\\}$, so the dimension is 1."
      },
      {
        "problem": "For $A=\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}$, find one nonzero vector in the null space.",
        "steps": [
          {
            "do": "Write $Ax=0$",
            "result": "$x_1+2x_2=0$ and $2x_1+4x_2=0$",
            "why": "row equations"
          },
          {
            "do": "Use the first equation",
            "result": "$x_1=-2x_2$",
            "why": "solve for one variable"
          },
          {
            "do": "Choose a free value",
            "result": "$x_2=1$",
            "why": "produce a concrete vector"
          },
          {
            "do": "Find $x_1$",
            "result": "$x_1=-2$",
            "why": "substitute"
          },
          {
            "do": "Check",
            "result": "$A[-2,1]^T=[0,0]^T$",
            "why": "both rows vanish"
          }
        ],
        "answer": "One null-space vector is $[-2,1]^T$."
      }
    ],
    "applications": [
      {
        "title": "Feature spaces",
        "background": "ML features live in vector spaces where scaling and adding examples or directions is meaningful.",
        "numbers": "If $v=[2,3]$ and $w=[1,-1]$, then $0.5v+w=[2,0.5]$ is another vector in the same ambient space."
      },
      {
        "title": "Embeddings",
        "background": "Embedding models rely on spans, bases, and independence to represent meaning in many directions.",
        "numbers": "Two directions $[1,0]$ and $[0,1]$ can represent $[0.2,0.9]$ as $0.2[1,0]+0.9[0,1]$."
      },
      {
        "title": "Dimensionality reduction",
        "background": "PCA searches for a lower-dimensional subspace that keeps much of the data variation.",
        "numbers": "If two principal directions explain $70\\%$ and $20\\%$ of variance, a 2-D subspace keeps $90\\%$."
      },
      {
        "title": "Solving constraints",
        "background": "Null spaces describe changes that leave linear measurements unchanged.",
        "numbers": "For measurement row $[1,2]$, change $[-2,1]$ gives $[1,2]\\cdot[-2,1]=0$."
      },
      {
        "title": "Data rank",
        "background": "Rank tells how many independent directions the columns of a data matrix really contain.",
        "numbers": "Columns $[1,2]$ and $[2,4]$ have rank $1$, not $2$, because one is twice the other."
      },
      {
        "title": "Model identifiability",
        "background": "Parameters are identifiable only outside null directions that leave predictions unchanged.",
        "numbers": "If $Xh=0$ for $h=[-2,1]$, then weights $w$ and $w+h$ give the same predictions on $X$."
      }
    ],
    "applicationsClose": "Linear independence gives one more way to see the same linear structure: what can be built, what is lost, and how many directions truly matter.",
    "takeaways": [
      "Linear combinations are the test language for this topic.",
      "Row reduction turns geometric claims into solvable equations.",
      "Dimension counts independent directions, not the number of coordinates written down."
    ]
  },
  "math-09-12": {
    "id": "math-09-12",
    "title": "Basis and dimension",
    "tagline": "A basis gives unique coordinates, and dimension counts how many coordinates are truly needed.",
    "connections": {
      "buildsOn": [
        "Matrix algebra",
        "Gaussian elimination",
        "linear combinations"
      ],
      "leadsTo": [
        "least squares",
        "eigenvalues",
        "singular value decomposition"
      ],
      "usedWith": [
        "rank",
        "null space",
        "basis",
        "dimension"
      ]
    },
    "motivation": "<p>Once you have just enough independent directions to reach a space, every vector gets a unique address. That is what a basis provides.</p><p>Dimension is then not about how many vectors are listed, but how many independent directions the space contains. This is the bridge from geometry to compact ML representations.</p>",
    "definition": "<p>A <b>basis</b> for a vector space is a list of vectors that spans the space and is linearly independent. The <b>dimension</b> is the number of vectors in any basis for that space.</p><p>Spanning gives existence of coordinates; independence gives uniqueness. If two different coefficient lists represented the same vector, subtracting them would create a nontrivial zero combination, contradicting independence.</p><p><b>Assumptions that matter:</b> the basis belongs to a specified space; every basis of the same finite-dimensional space has the same size; and coordinates depend on the chosen basis even though dimension does not.</p>",
    "worked": {
      "problem": "Show that $[1,0]^T$ and $[1,1]^T$ form a basis of $\\mathbb{R}^2$, then find coordinates of $[5,2]^T$.",
      "skills": [
        "coordinates",
        "row reduction",
        "interpretation"
      ],
      "strategy": "Translate the statement into equations, perform one careful algebra step at a time, then interpret the result.",
      "steps": [
        {
          "do": "Set a general combination",
          "result": "$a[1,0]^T+b[1,1]^T=[a+b,b]^T",
          "why": "test spanning"
        },
        {
          "do": "Match a target $[p,q]^T$",
          "result": "$a+b=p,\\ b=q$",
          "why": "arbitrary target"
        },
        {
          "do": "Solve for $b$",
          "result": "$b=q$",
          "why": "second coordinate"
        },
        {
          "do": "Solve for $a$",
          "result": "$a=p-q$",
          "why": "first coordinate"
        },
        {
          "do": "Conclude spanning",
          "result": "every $[p,q]^T$ is reached",
          "why": "coefficients exist for all targets"
        },
        {
          "do": "Test independence",
          "result": "$a[1,0]^T+b[1,1]^T=0$ gives $b=0$ and $a=0$",
          "why": "only trivial zero combination"
        },
        {
          "do": "Find coordinates of $[5,2]^T",
          "result": "$b=2,\\ a=3$",
          "why": "use $p=5,q=2$"
        }
      ],
      "verify": "Substituting the found coefficients or vector back into the original relation gives the stated equality, so the interpretation matches the arithmetic.",
      "answer": "They form a basis of $\\mathbb{R}^2$; $[5,2]^T=3[1,0]^T+2[1,1]^T$.",
      "connects": "A basis gives existence and uniqueness of coordinates."
    },
    "practice": [
      {
        "problem": "Use the definition to test a simple basis and dimension claim for vectors $[1,0]^T$ and $[0,1]^T$ in $\\mathbb{R}^2$.",
        "steps": [
          {
            "do": "Form a linear combination",
            "result": "$a[1,0]^T+b[0,1]^T=[a,b]^T$",
            "why": "combine the vectors"
          },
          {
            "do": "Match a target $[3,-2]^T$",
            "result": "$a=3,\\ b=-2$",
            "why": "equal components"
          },
          {
            "do": "Interpret reachability",
            "result": "the target is reached",
            "why": "the coefficients exist"
          },
          {
            "do": "Check independence",
            "result": "$a[1,0]^T+b[0,1]^T=0$ forces $a=b=0$",
            "why": "only trivial zero combination"
          },
          {
            "do": "State the role",
            "result": "standard coordinate directions",
            "why": "they give clean coordinates"
          }
        ],
        "answer": "They reach $[3,-2]^T$ with coefficients $3$ and $-2$, and they are independent."
      },
      {
        "problem": "Decide whether $[2,4]^T$ adds a new direction to $[1,2]^T$.",
        "steps": [
          {
            "do": "Compare vectors",
            "result": "$[2,4]^T=2[1,2]^T$",
            "why": "one is a scalar multiple"
          },
          {
            "do": "Write a dependence relation",
            "result": "$2[1,2]^T-[2,4]^T=0$",
            "why": "nontrivial zero combination"
          },
          {
            "do": "Interpret",
            "result": "no new direction",
            "why": "the second vector lies on the same line"
          },
          {
            "do": "State the span",
            "result": "a line through the origin",
            "why": "all multiples of $[1,2]^T$"
          },
          {
            "do": "State independence",
            "result": "dependent",
            "why": "one vector is built from the other"
          }
        ],
        "answer": "No. It is dependent and adds no new direction."
      },
      {
        "problem": "Test whether $[1,1,0]^T$ and $[0,1,1]^T$ span all of $\\mathbb{R}^3$.",
        "steps": [
          {
            "do": "Count vectors",
            "result": "two vectors",
            "why": "only two building directions"
          },
          {
            "do": "Set a general combination",
            "result": "$a[1,1,0]^T+b[0,1,1]^T=[a,a+b,b]^T$",
            "why": "write the reachable vectors"
          },
          {
            "do": "Choose target $[0,0,1]^T$",
            "result": "$a=0$ and $b=1$",
            "why": "match first and third components"
          },
          {
            "do": "Check middle component",
            "result": "$a+b=1$",
            "why": "would need to equal 0"
          },
          {
            "do": "Find contradiction",
            "result": "$1\\ne0$",
            "why": "target is not reachable"
          }
        ],
        "answer": "They do not span all of $\\mathbb{R}^3$."
      },
      {
        "problem": "Find a basis for the line $x+y=0$ in $\\mathbb{R}^2$.",
        "steps": [
          {
            "do": "Solve the equation",
            "result": "$y=-x$",
            "why": "describe points on the line"
          },
          {
            "do": "Introduce a parameter",
            "result": "$x=t$",
            "why": "one free variable"
          },
          {
            "do": "Write vectors",
            "result": "$[x,y]^T=[t,-t]^T$",
            "why": "substitute"
          },
          {
            "do": "Factor the parameter",
            "result": "$t[1,-1]^T$",
            "why": "show all points are multiples"
          },
          {
            "do": "State a basis",
            "result": "$\\{[1,-1]^T\\}$",
            "why": "one nonzero spanning vector for the line"
          }
        ],
        "answer": "A basis is $\\{[1,-1]^T\\}$, so the dimension is 1."
      },
      {
        "problem": "For $A=\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}$, find one nonzero vector in the null space.",
        "steps": [
          {
            "do": "Write $Ax=0$",
            "result": "$x_1+2x_2=0$ and $2x_1+4x_2=0$",
            "why": "row equations"
          },
          {
            "do": "Use the first equation",
            "result": "$x_1=-2x_2$",
            "why": "solve for one variable"
          },
          {
            "do": "Choose a free value",
            "result": "$x_2=1$",
            "why": "produce a concrete vector"
          },
          {
            "do": "Find $x_1$",
            "result": "$x_1=-2$",
            "why": "substitute"
          },
          {
            "do": "Check",
            "result": "$A[-2,1]^T=[0,0]^T$",
            "why": "both rows vanish"
          }
        ],
        "answer": "One null-space vector is $[-2,1]^T$."
      }
    ],
    "applications": [
      {
        "title": "Feature spaces",
        "background": "ML features live in vector spaces where scaling and adding examples or directions is meaningful.",
        "numbers": "If $v=[2,3]$ and $w=[1,-1]$, then $0.5v+w=[2,0.5]$ is another vector in the same ambient space."
      },
      {
        "title": "Embeddings",
        "background": "Embedding models rely on spans, bases, and independence to represent meaning in many directions.",
        "numbers": "Two directions $[1,0]$ and $[0,1]$ can represent $[0.2,0.9]$ as $0.2[1,0]+0.9[0,1]$."
      },
      {
        "title": "Dimensionality reduction",
        "background": "PCA searches for a lower-dimensional subspace that keeps much of the data variation.",
        "numbers": "If two principal directions explain $70\\%$ and $20\\%$ of variance, a 2-D subspace keeps $90\\%$."
      },
      {
        "title": "Solving constraints",
        "background": "Null spaces describe changes that leave linear measurements unchanged.",
        "numbers": "For measurement row $[1,2]$, change $[-2,1]$ gives $[1,2]\\cdot[-2,1]=0$."
      },
      {
        "title": "Data rank",
        "background": "Rank tells how many independent directions the columns of a data matrix really contain.",
        "numbers": "Columns $[1,2]$ and $[2,4]$ have rank $1$, not $2$, because one is twice the other."
      },
      {
        "title": "Model identifiability",
        "background": "Parameters are identifiable only outside null directions that leave predictions unchanged.",
        "numbers": "If $Xh=0$ for $h=[-2,1]$, then weights $w$ and $w+h$ give the same predictions on $X$."
      }
    ],
    "applicationsClose": "Basis and dimension gives one more way to see the same linear structure: what can be built, what is lost, and how many directions truly matter.",
    "takeaways": [
      "Linear combinations are the test language for this topic.",
      "Row reduction turns geometric claims into solvable equations.",
      "Dimension counts independent directions, not the number of coordinates written down."
    ]
  },
  "math-09-13": {
    "id": "math-09-13",
    "title": "The four fundamental subspaces",
    "tagline": "A matrix has four natural spaces: what rows measure, what columns can make, what inputs vanish, and what outputs are impossible.",
    "connections": {
      "buildsOn": [
        "Matrix algebra",
        "Gaussian elimination",
        "linear combinations"
      ],
      "leadsTo": [
        "least squares",
        "eigenvalues",
        "singular value decomposition"
      ],
      "usedWith": [
        "rank",
        "null space",
        "basis",
        "dimension"
      ]
    },
    "motivation": "<p>A matrix is more than an array. It is a map from input space to output space, and every map has directions it can see, directions it loses, outputs it can reach, and outputs it can never reach.</p><p>The four fundamental subspaces organize that entire story. They are the conceptual foundation for least squares, rank, nullity, PCA, and the singular value decomposition.</p>",
    "definition": "<p>For an $m\\times n$ matrix $\\mathbf{A}$, the four fundamental subspaces are: the <b>column space</b> $\\operatorname{Col}(\\mathbf{A})\\subseteq\\mathbb{R}^m$, the <b>null space</b> $\\operatorname{Null}(\\mathbf{A})\\subseteq\\mathbb{R}^n$, the <b>row space</b> $\\operatorname{Row}(\\mathbf{A})\\subseteq\\mathbb{R}^n$, and the <b>left null space</b> $\\operatorname{Null}(\\mathbf{A}^T)\\subseteq\\mathbb{R}^m$.</p><p>The column space is everything $\\mathbf{A}\\mathbf{x}$ can output. The null space is every input sent to zero. The row space contains the input directions measured by the rows. The left null space contains output-side directions orthogonal to every column.</p><p><b>Assumptions that matter:</b> row space and null space live in the input space $\\mathbb{R}^n$; column space and left null space live in the output space $\\mathbb{R}^m$; and rank-nullity says $\\dim\\operatorname{Row}(A)+\\dim\\operatorname{Null}(A)=n$.</p>",
    "worked": {
      "problem": "Use the lesson definition on $A=\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}$ and the vectors $[1,2]^T$, $[2,4]^T$, and $[-2,1]^T$.",
      "skills": [
        "rank and nullity",
        "row reduction",
        "interpretation"
      ],
      "strategy": "Translate the statement into equations, perform one careful algebra step at a time, then interpret the result.",
      "steps": [
        {
          "do": "Find the column relation",
          "result": "column 2 is $2$ times column 1",
          "why": "columns are dependent"
        },
        {
          "do": "State the column space",
          "result": "$\\operatorname{span}\\{[1,2]^T\\}$",
          "why": "outputs lie on one line"
        },
        {
          "do": "Solve $Ax=0$",
          "result": "$x_1+2x_2=0$",
          "why": "second row repeats the first"
        },
        {
          "do": "Choose a null vector",
          "result": "$[-2,1]^T$",
          "why": "set $x_2=1$"
        },
        {
          "do": "State the row space",
          "result": "$\\operatorname{span}\\{[1,2]\\}$",
          "why": "nonzero rows lie on one line"
        },
        {
          "do": "Find a left-null vector",
          "result": "$[-2,1]^T$",
          "why": "it is orthogonal to column $[1,2]^T$"
        }
      ],
      "verify": "Substituting the found coefficients or vector back into the original relation gives the stated equality, so the interpretation matches the arithmetic.",
      "answer": "Column space and row space are each 1-D; null space and left null space are spanned by $[-2,1]^T$.",
      "connects": "The four subspaces separate what the matrix reaches, measures, and loses."
    },
    "practice": [
      {
        "problem": "Use the definition to test a simple the four fundamental subspaces claim for vectors $[1,0]^T$ and $[0,1]^T$ in $\\mathbb{R}^2$.",
        "steps": [
          {
            "do": "Form a linear combination",
            "result": "$a[1,0]^T+b[0,1]^T=[a,b]^T$",
            "why": "combine the vectors"
          },
          {
            "do": "Match a target $[3,-2]^T$",
            "result": "$a=3,\\ b=-2$",
            "why": "equal components"
          },
          {
            "do": "Interpret reachability",
            "result": "the target is reached",
            "why": "the coefficients exist"
          },
          {
            "do": "Check independence",
            "result": "$a[1,0]^T+b[0,1]^T=0$ forces $a=b=0$",
            "why": "only trivial zero combination"
          },
          {
            "do": "State the role",
            "result": "standard coordinate directions",
            "why": "they give clean coordinates"
          }
        ],
        "answer": "They reach $[3,-2]^T$ with coefficients $3$ and $-2$, and they are independent."
      },
      {
        "problem": "Decide whether $[2,4]^T$ adds a new direction to $[1,2]^T$.",
        "steps": [
          {
            "do": "Compare vectors",
            "result": "$[2,4]^T=2[1,2]^T$",
            "why": "one is a scalar multiple"
          },
          {
            "do": "Write a dependence relation",
            "result": "$2[1,2]^T-[2,4]^T=0$",
            "why": "nontrivial zero combination"
          },
          {
            "do": "Interpret",
            "result": "no new direction",
            "why": "the second vector lies on the same line"
          },
          {
            "do": "State the span",
            "result": "a line through the origin",
            "why": "all multiples of $[1,2]^T$"
          },
          {
            "do": "State independence",
            "result": "dependent",
            "why": "one vector is built from the other"
          }
        ],
        "answer": "No. It is dependent and adds no new direction."
      },
      {
        "problem": "Test whether $[1,1,0]^T$ and $[0,1,1]^T$ span all of $\\mathbb{R}^3$.",
        "steps": [
          {
            "do": "Count vectors",
            "result": "two vectors",
            "why": "only two building directions"
          },
          {
            "do": "Set a general combination",
            "result": "$a[1,1,0]^T+b[0,1,1]^T=[a,a+b,b]^T$",
            "why": "write the reachable vectors"
          },
          {
            "do": "Choose target $[0,0,1]^T$",
            "result": "$a=0$ and $b=1$",
            "why": "match first and third components"
          },
          {
            "do": "Check middle component",
            "result": "$a+b=1$",
            "why": "would need to equal 0"
          },
          {
            "do": "Find contradiction",
            "result": "$1\\ne0$",
            "why": "target is not reachable"
          }
        ],
        "answer": "They do not span all of $\\mathbb{R}^3$."
      },
      {
        "problem": "Find a basis for the line $x+y=0$ in $\\mathbb{R}^2$.",
        "steps": [
          {
            "do": "Solve the equation",
            "result": "$y=-x$",
            "why": "describe points on the line"
          },
          {
            "do": "Introduce a parameter",
            "result": "$x=t$",
            "why": "one free variable"
          },
          {
            "do": "Write vectors",
            "result": "$[x,y]^T=[t,-t]^T$",
            "why": "substitute"
          },
          {
            "do": "Factor the parameter",
            "result": "$t[1,-1]^T$",
            "why": "show all points are multiples"
          },
          {
            "do": "State a basis",
            "result": "$\\{[1,-1]^T\\}$",
            "why": "one nonzero spanning vector for the line"
          }
        ],
        "answer": "A basis is $\\{[1,-1]^T\\}$, so the dimension is 1."
      },
      {
        "problem": "For $A=\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}$, find one nonzero vector in the null space.",
        "steps": [
          {
            "do": "Write $Ax=0$",
            "result": "$x_1+2x_2=0$ and $2x_1+4x_2=0$",
            "why": "row equations"
          },
          {
            "do": "Use the first equation",
            "result": "$x_1=-2x_2$",
            "why": "solve for one variable"
          },
          {
            "do": "Choose a free value",
            "result": "$x_2=1$",
            "why": "produce a concrete vector"
          },
          {
            "do": "Find $x_1$",
            "result": "$x_1=-2$",
            "why": "substitute"
          },
          {
            "do": "Check",
            "result": "$A[-2,1]^T=[0,0]^T$",
            "why": "both rows vanish"
          }
        ],
        "answer": "One null-space vector is $[-2,1]^T$."
      }
    ],
    "applications": [
      {
        "title": "Feature spaces",
        "background": "ML features live in vector spaces where scaling and adding examples or directions is meaningful.",
        "numbers": "If $v=[2,3]$ and $w=[1,-1]$, then $0.5v+w=[2,0.5]$ is another vector in the same ambient space."
      },
      {
        "title": "Embeddings",
        "background": "Embedding models rely on spans, bases, and independence to represent meaning in many directions.",
        "numbers": "Two directions $[1,0]$ and $[0,1]$ can represent $[0.2,0.9]$ as $0.2[1,0]+0.9[0,1]$."
      },
      {
        "title": "Dimensionality reduction",
        "background": "PCA searches for a lower-dimensional subspace that keeps much of the data variation.",
        "numbers": "If two principal directions explain $70\\%$ and $20\\%$ of variance, a 2-D subspace keeps $90\\%$."
      },
      {
        "title": "Solving constraints",
        "background": "Null spaces describe changes that leave linear measurements unchanged.",
        "numbers": "For measurement row $[1,2]$, change $[-2,1]$ gives $[1,2]\\cdot[-2,1]=0$."
      },
      {
        "title": "Data rank",
        "background": "Rank tells how many independent directions the columns of a data matrix really contain.",
        "numbers": "Columns $[1,2]$ and $[2,4]$ have rank $1$, not $2$, because one is twice the other."
      },
      {
        "title": "Model identifiability",
        "background": "Parameters are identifiable only outside null directions that leave predictions unchanged.",
        "numbers": "If $Xh=0$ for $h=[-2,1]$, then weights $w$ and $w+h$ give the same predictions on $X$."
      }
    ],
    "applicationsClose": "The four fundamental subspaces gives one more way to see the same linear structure: what can be built, what is lost, and how many directions truly matter.",
    "takeaways": [
      "The column space is what $A$ can output.",
      "The null space is what $A$ sends to zero.",
      "The row space contains the independent input directions measured by rows.",
      "Rank and nullity split the domain into visible and lost directions."
    ]
  }
};
