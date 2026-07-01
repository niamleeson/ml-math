module.exports = {
  "math-08-13": {
    "id": "math-08-13",
    "title": "Cholesky factorization",
    "tagline": "Cholesky turns a friendly positive-definite matrix into a triangular square root you can solve with.",
    "connections": {
      "buildsOn": [
        "matrix multiplication",
        "transpose",
        "positive definite matrices"
      ],
      "leadsTo": [
        "Pivoting",
        "Matrix condition number",
        "least-squares approximation"
      ],
      "usedWith": [
        "triangular systems",
        "inner products",
        "symmetric matrices"
      ]
    },
    "motivation": "<p>You already know that $9=3^2$: a positive number can be written as a square. Some matrices have a similar square-root structure.</p><p><b>Cholesky factorization</b> writes a symmetric positive-definite matrix as $A=LL^T$. The reward is practical: one hard solve becomes two triangular solves.</p>",
    "definition": "<p>If $A$ is symmetric positive definite, then $A=LL^T$, where $L$ is lower triangular with positive diagonal entries. Matching entries of $LL^T$ determines the entries of $L$ one column at a time.</p><p>The diagonal square roots stay real because positive definiteness says every remaining Schur complement has positive quadratic form. That is the structural reason Cholesky needs no pivoting under its assumptions.</p><p><b>Assumptions that matter:</b> $A$ is square, symmetric, and positive definite; $L^T$ means transpose; the diagonal of $L$ is positive; and one solves $Ly=b$ then $L^Tx=y$, not by forming $A^{-1}$.</p>",
    "worked": {
      "problem": "Find the Cholesky factorization of $A=[[4,2],[2,3]]$.",
      "skills": [
        "triangular factors",
        "matrix multiplication",
        "positive definiteness"
      ],
      "strategy": "Match the unknown lower-triangular factor to $A=LL^T$.",
      "steps": [
        {
          "do": "Write the factor form",
          "result": "$L=[[a,0],[b,c]]$",
          "why": "a two-by-two lower triangular factor has three unknowns"
        },
        {
          "do": "Multiply the factor by its transpose",
          "result": "$LL^T=[[a^2,ab],[ab,b^2+c^2]]$",
          "why": "the product must equal $A$"
        },
        {
          "do": "Match the first diagonal entry",
          "result": "$a^2=4$",
          "why": "the top-left entries agree"
        },
        {
          "do": "Choose the positive root",
          "result": "$a=2$",
          "why": "Cholesky uses positive diagonal entries"
        },
        {
          "do": "Match the off-diagonal entry",
          "result": "$2b=2$",
          "why": "use $ab=2$"
        },
        {
          "do": "Solve for $b$",
          "result": "$b=1$",
          "why": "divide by 2"
        },
        {
          "do": "Match the second diagonal entry",
          "result": "$1+c^2=3$",
          "why": "use $b^2+c^2=3$"
        },
        {
          "do": "Solve for $c$",
          "result": "$c=\\sqrt2$",
          "why": "take the positive square root"
        }
      ],
      "verify": "Multiplying $[[2,0],[1,\\sqrt2]]$ by its transpose gives $[[4,2],[2,3]]$.",
      "answer": "$L=[[2,0],[1,\\sqrt2]]$.",
      "connects": "The factor is a matrix square root that makes solving much easier."
    },
    "practice": [
      {
        "problem": "Factor $[[9,3],[3,2]]$ as $LL^T$.",
        "steps": [
          {
            "do": "Use $a^2=9$",
            "result": "$a=3$",
            "why": "positive root"
          },
          {
            "do": "Use $ab=3$",
            "result": "$3b=3$",
            "why": "off-diagonal match"
          },
          {
            "do": "Solve for $b$",
            "result": "$b=1$",
            "why": "divide by 3"
          },
          {
            "do": "Use $b^2+c^2=2$",
            "result": "$1+c^2=2$",
            "why": "second diagonal match"
          },
          {
            "do": "Solve for $c$",
            "result": "$c=1$",
            "why": "positive root"
          }
        ],
        "answer": "$L=[[3,0],[1,1]]$."
      },
      {
        "problem": "Use $L=[[2,0],[1,\\sqrt2]]$ to solve $Ax=(6,5)$.",
        "steps": [
          {
            "do": "Solve $Ly=b$",
            "result": "$2y_1=6$",
            "why": "forward substitution starts at the first row"
          },
          {
            "do": "Find $y_1$",
            "result": "$y_1=3$",
            "why": "divide by 2"
          },
          {
            "do": "Use row 2",
            "result": "$3+\\sqrt2y_2=5$",
            "why": "substitute $y_1=3$"
          },
          {
            "do": "Find $y_2$",
            "result": "$y_2=\\sqrt2$",
            "why": "divide by $\\sqrt2$"
          },
          {
            "do": "Solve $L^Tx=y$",
            "result": "$x_2=1$, then $x_1=1$",
            "why": "back substitution finishes"
          }
        ],
        "answer": "$x=(1,1)$."
      },
      {
        "problem": "Decide whether $[[1,2],[2,1]]$ has a real Cholesky factor.",
        "steps": [
          {
            "do": "Start with $a^2=1$",
            "result": "$a=1$",
            "why": "positive root"
          },
          {
            "do": "Match $ab=2$",
            "result": "$b=2$",
            "why": "off-diagonal entry"
          },
          {
            "do": "Match the lower-right entry",
            "result": "$4+c^2=1$",
            "why": "use $b^2+c^2=1$"
          },
          {
            "do": "Solve for $c^2$",
            "result": "$c^2=-3$",
            "why": "subtract 4"
          },
          {
            "do": "Interpret",
            "result": "no real factor",
            "why": "positive definiteness fails"
          }
        ],
        "answer": "No. A real positive-diagonal Cholesky factor does not exist."
      },
      {
        "problem": "Factor $[[25,15],[15,18]]$.",
        "steps": [
          {
            "do": "Use $a^2=25$",
            "result": "$a=5$",
            "why": "positive root"
          },
          {
            "do": "Use $ab=15$",
            "result": "$b=3$",
            "why": "divide by 5"
          },
          {
            "do": "Use $b^2+c^2=18$",
            "result": "$9+c^2=18$",
            "why": "second diagonal"
          },
          {
            "do": "Solve for $c$",
            "result": "$c=3$",
            "why": "positive root"
          },
          {
            "do": "Assemble the factor",
            "result": "$L=[[5,0],[3,3]]$",
            "why": "lower triangular form"
          }
        ],
        "answer": "$L=[[5,0],[3,3]]$."
      },
      {
        "problem": "Factor the ridge matrix $[[5,2],[2,2]]$.",
        "steps": [
          {
            "do": "Use $a^2=5$",
            "result": "$a=\\sqrt5$",
            "why": "positive root"
          },
          {
            "do": "Use $ab=2$",
            "result": "$b=2/\\sqrt5$",
            "why": "off-diagonal match"
          },
          {
            "do": "Square $b$",
            "result": "$b^2=4/5$",
            "why": "needed for the last diagonal"
          },
          {
            "do": "Use $b^2+c^2=2$",
            "result": "$c^2=6/5$",
            "why": "subtract $4/5$"
          },
          {
            "do": "Choose $c$",
            "result": "$c=\\sqrt{6/5}$",
            "why": "positive root"
          }
        ],
        "answer": "$L=[[\\sqrt5,0],[2/\\sqrt5,\\sqrt{6/5}]]$."
      }
    ],
    "applications": [
      {
        "title": "Gaussian covariance sampling",
        "background": "Statistics uses Cholesky to transform independent normal noise into correlated noise.",
        "numbers": "With $L=[[2,0],[1,\\sqrt2]]$ and $z=(1,-1)$, $Lz=(2,1-1.414)=(2,-0.414)$."
      },
      {
        "title": "Ridge regression solves",
        "background": "Ridge normal equations are symmetric positive definite when regularization is positive.",
        "numbers": "For matrix $[[5,2],[2,2]]$ and right side $(7,4)$, the solution is $(1,1)$."
      },
      {
        "title": "Kalman filters",
        "background": "Square-root filters store covariance factors to keep uncertainty positive.",
        "numbers": "Covariance $[[9,3],[3,2]]$ has factor $[[3,0],[1,1]]$, storing scales 3 and 1."
      },
      {
        "title": "Gaussian processes",
        "background": "Kernel methods commonly factor kernel matrices with Cholesky.",
        "numbers": "For $K=[[1,0.5],[0.5,1]]$, the factor has lower-right value $\\sqrt{0.75}\\approx0.866$."
      },
      {
        "title": "Mahalanobis distance",
        "background": "A factor lets you whiten residuals before measuring length.",
        "numbers": "With $L=[[2,0],[1,\\sqrt2]]$ and $r=(2,1)$, solving $Ly=r$ gives $y=(1,0)$, so distance squared is 1."
      },
      {
        "title": "Curvature preconditioning",
        "background": "Second-order optimizers solve systems with positive curvature approximations.",
        "numbers": "Curvature $[[4,2],[2,3]]$ and gradient $(6,5)$ give step $(1,1)$ after triangular solves."
      }
    ],
    "applicationsClose": "Cholesky is the same square-root idea in many uniforms: covariance, kernels, ridge regression, and curvature all become triangular solves.",
    "takeaways": [
      "Cholesky factors a symmetric positive-definite matrix as $A=LL^T$.",
      "Positive definiteness keeps the diagonal square roots real and positive.",
      "Use two triangular solves rather than a matrix inverse.",
      "ML covariance, kernel, and least-squares computations often rely on this factorization."
    ]
  },
  "math-08-14": {
    "id": "math-08-14",
    "title": "Pivoting",
    "tagline": "Pivoting is the practical habit of moving a safer number into the pivot position before elimination.",
    "connections": {
      "buildsOn": [
        "Gaussian elimination",
        "row operations",
        "triangular systems"
      ],
      "leadsTo": [
        "Matrix condition number",
        "Jacobi and Gauss-Seidel iteration",
        "Eigenvalue computation"
      ],
      "usedWith": [
        "LU factorization",
        "permutation matrices",
        "roundoff error"
      ]
    },
    "motivation": "<p>You already know elimination: use a leading number to clear entries below it. The fragile part is that leading number, the <b>pivot</b>.</p><p>If the pivot is zero, elimination stops. If it is tiny, division can magnify roundoff. <b>Pivoting</b> swaps rows so safer arithmetic happens first.</p>",
    "definition": "<p>A pivot is the entry used to eliminate entries below it. In <b>partial pivoting</b>, at each column we swap in the row with the largest absolute entry in that column. With swaps recorded by a permutation matrix $P$, Gaussian elimination produces $PA=LU$.</p><p>The multiplier is $m=a_{ik}/a_{kk}$. A larger pivot $a_{kk}$ keeps $|m|$ smaller, so errors in the pivot row are not multiplied by huge numbers.</p><p><b>Assumptions that matter:</b> row swaps must also be applied to $b$; partial pivoting searches one column; complete pivoting may also swap columns; and pivoting improves stability but cannot repair a truly singular system.</p>",
    "worked": {
      "problem": "Solve $[[0.001,1],[1,1]]x=(1,2)$ using partial pivoting.",
      "skills": [
        "row swaps",
        "elimination",
        "back substitution"
      ],
      "strategy": "The first pivot is tiny, so swap rows before dividing.",
      "steps": [
        {
          "do": "Compare first-column magnitudes",
          "result": "$0.001<1$",
          "why": "partial pivoting chooses the larger magnitude"
        },
        {
          "do": "Swap the rows",
          "result": "$[[1,1],[0.001,1]]x=(2,1)$",
          "why": "row order changes, not the solution"
        },
        {
          "do": "Compute the multiplier",
          "result": "$m=0.001$",
          "why": "lower entry divided by pivot"
        },
        {
          "do": "Eliminate below the pivot",
          "result": "$R_2\\leftarrow R_2-0.001R_1$",
          "why": "remove the lower-left entry"
        },
        {
          "do": "Write the second row",
          "result": "$0.999x_2=0.998$",
          "why": "subtract the scaled pivot row"
        },
        {
          "do": "Solve for $x_2$",
          "result": "$x_2\\approx0.998999$",
          "why": "divide by $0.999$"
        },
        {
          "do": "Solve for $x_1$",
          "result": "$x_1\\approx1.001001$",
          "why": "use $x_1+x_2=2$"
        }
      ],
      "verify": "Substitution gives both equations to rounding accuracy.",
      "answer": "$x\\approx(1.001001,0.998999)$.",
      "connects": "Pivoting changed the arithmetic order, not the mathematical solution."
    },
    "practice": [
      {
        "problem": "For column entries $2,-5,3$, choose the partial pivot row.",
        "steps": [
          {
            "do": "Take absolute values",
            "result": "$2,5,3$",
            "why": "pivoting compares magnitudes"
          },
          {
            "do": "Find the largest",
            "result": "$5$",
            "why": "largest magnitude is safest"
          },
          {
            "do": "Locate it",
            "result": "row 2",
            "why": "the entry is $-5$"
          },
          {
            "do": "State the swap",
            "result": "swap row 1 with row 2",
            "why": "bring it to the pivot position"
          }
        ],
        "answer": "Use row 2."
      },
      {
        "problem": "Perform one pivoted elimination step on $[[2,1],[6,5]]$.",
        "steps": [
          {
            "do": "Compare magnitudes",
            "result": "$2<6$",
            "why": "row 2 has the safer pivot"
          },
          {
            "do": "Swap rows",
            "result": "$[[6,5],[2,1]]$",
            "why": "put 6 first"
          },
          {
            "do": "Compute multiplier",
            "result": "$m=2/6=1/3$",
            "why": "lower entry over pivot"
          },
          {
            "do": "Update row 2",
            "result": "$R_2-(1/3)R_1$",
            "why": "eliminate below"
          },
          {
            "do": "Compute new row",
            "result": "$[0,-2/3]$",
            "why": "because $1-5/3=-2/3$"
          }
        ],
        "answer": "After one step, the matrix is $[[6,5],[0,-2/3]]$."
      },
      {
        "problem": "Explain why no swap is needed for entries $8,3,-4$.",
        "steps": [
          {
            "do": "Compute magnitudes",
            "result": "$8,3,4$",
            "why": "compare absolute values"
          },
          {
            "do": "Find the largest",
            "result": "$8$",
            "why": "the current pivot is already largest"
          },
          {
            "do": "Check multipliers",
            "result": "$3/8$ and $-4/8$",
            "why": "both magnitudes are at most 1"
          },
          {
            "do": "Decide",
            "result": "no swap",
            "why": "partial pivoting keeps row 1"
          }
        ],
        "answer": "No swap is needed."
      },
      {
        "problem": "Compute $PA$ for $P=[[0,1],[1,0]]$ and $A=[[0,2],[3,4]]$.",
        "steps": [
          {
            "do": "Read $P$",
            "result": "it swaps two rows",
            "why": "the first row selects old row 2"
          },
          {
            "do": "Move old row 2 upward",
            "result": "$[3,4]$",
            "why": "new row 1"
          },
          {
            "do": "Move old row 1 downward",
            "result": "$[0,2]$",
            "why": "new row 2"
          },
          {
            "do": "Assemble",
            "result": "$PA=[[3,4],[0,2]]$",
            "why": "row swap encoded"
          }
        ],
        "answer": "$PA=[[3,4],[0,2]]$."
      },
      {
        "problem": "A pivot is $0.0001$ and the entry below is $2$. Find the multiplier.",
        "steps": [
          {
            "do": "Write the multiplier",
            "result": "$m=2/0.0001$",
            "why": "entry below over pivot"
          },
          {
            "do": "Divide",
            "result": "$m=20000$",
            "why": "tiny pivot creates huge multiplier"
          },
          {
            "do": "Read the row update",
            "result": "$R_2-20000R_1$",
            "why": "roundoff can be amplified"
          },
          {
            "do": "Compare after swapping",
            "result": "$0.0001/2=0.00005$",
            "why": "a larger pivot is safer"
          },
          {
            "do": "State the lesson",
            "result": "pivot before dividing",
            "why": "finite precision matters"
          }
        ],
        "answer": "The multiplier is $20000$, which is numerically dangerous."
      }
    ],
    "applications": [
      {
        "title": "General linear solves",
        "background": "Production solvers pivot because ordinary inputs can place tiny pivots first.",
        "numbers": "The worked system would use multiplier $1000$ without swapping but $0.001$ after swapping."
      },
      {
        "title": "LU libraries",
        "background": "Libraries often return $P$, $L$, and $U$ so row swaps are explicit.",
        "numbers": "One two-row swap uses $P=[[0,1],[1,0]]$."
      },
      {
        "title": "Feature matrices",
        "background": "Regression matrices with uneven scales can produce small pivots.",
        "numbers": "A pivot $10^{-6}$ with lower entry 1 gives multiplier $10^6$ before pivoting."
      },
      {
        "title": "Sparse solvers",
        "background": "Sparse solvers pivot while trying to avoid extra fill-in.",
        "numbers": "A matrix with 10 nonzeros per row can become much denser if row order is careless."
      },
      {
        "title": "Newton systems",
        "background": "Optimization often solves linear systems inside each step.",
        "numbers": "A Hessian pivot $0.02$ and lower entry 1 create multiplier 50 without a swap."
      },
      {
        "title": "Numerical stability teaching",
        "background": "Pivoting shows that equivalent algebra can be unequal arithmetic.",
        "numbers": "In 3-digit arithmetic, subtracting 20000 times a rounded row can erase all useful digits."
      }
    ],
    "applicationsClose": "Pivoting is a first lesson in numerical wisdom: choose arithmetic that respects finite precision, not just algebra that looks legal.",
    "takeaways": [
      "A pivot is the entry used to eliminate below a column.",
      "Partial pivoting swaps in the largest available column entry by absolute value.",
      "Large multipliers amplify roundoff; pivoting controls them.",
      "With row swaps, LU factorization is written $PA=LU$."
    ]
  },
  "math-08-15": {
    "id": "math-08-15",
    "title": "Matrix condition number",
    "tagline": "A condition number measures how loudly a matrix can amplify small input errors.",
    "connections": {
      "buildsOn": [
        "matrix norms",
        "linear systems",
        "singular values"
      ],
      "leadsTo": [
        "Jacobi and Gauss-Seidel iteration",
        "Least-squares approximation",
        "Numerical precision & stability in deep learning"
      ],
      "usedWith": [
        "relative error",
        "eigenvalues",
        "norms"
      ]
    },
    "motivation": "<p>You already know some calculations are sensitive. Subtract nearly equal numbers and a tiny measurement error can dominate. Matrices have that same personality.</p><p>The <b>condition number</b> tells how much a matrix solve can magnify relative errors. A large value says the problem itself is listening too closely to noise.</p>",
    "definition": "<p>For an invertible matrix $A$, the norm condition number is $\\kappa(A)=\\|A\\|\\|A^{-1}\\|$. In the 2-norm, $\\kappa_2(A)=\\sigma_{\\max}/\\sigma_{\\min}$, the ratio of largest to smallest singular value. For symmetric positive-definite $A$, it equals $\\lambda_{\\max}/\\lambda_{\\min}$.</p><p>If $Ax=b$ and $b$ changes by $\\Delta b$, then $\\Delta x=A^{-1}\\Delta b$. That is why relative solution error can be bounded by roughly $\\kappa(A)$ times relative data error.</p><p><b>Assumptions that matter:</b> $A$ must be invertible for finite $\\kappa$; the number depends on the norm; $\\kappa\\ge1$ in common norms; and conditioning describes problem sensitivity, not just algorithm quality.</p>",
    "worked": {
      "problem": "Compute $\\kappa_2$ for $A=[[4,0],[0,1]]$.",
      "skills": [
        "singular values",
        "diagonal matrices",
        "relative error"
      ],
      "strategy": "For a positive diagonal matrix, singular values are the diagonal entries.",
      "steps": [
        {
          "do": "List singular values",
          "result": "$4$ and $1$",
          "why": "diagonal entries are stretches"
        },
        {
          "do": "Identify the largest",
          "result": "$\\sigma_{\\max}=4$",
          "why": "maximum stretch"
        },
        {
          "do": "Identify the smallest",
          "result": "$\\sigma_{\\min}=1$",
          "why": "minimum stretch"
        },
        {
          "do": "Apply the formula",
          "result": "$\\kappa_2=4/1$",
          "why": "largest over smallest"
        },
        {
          "do": "Simplify",
          "result": "$\\kappa_2=4$",
          "why": "worst-case relative amplification"
        }
      ],
      "verify": "The inverse has diagonal entries $1/4$ and 1, so the largest forward and inverse stretches multiply to 4.",
      "answer": "$\\kappa_2(A)=4$.",
      "connects": "The condition number compares the strongest and weakest matrix directions."
    },
    "practice": [
      {
        "problem": "Compute $\\kappa_2$ for $D=\\operatorname{diag}(10,2)$.",
        "steps": [
          {
            "do": "List singular values",
            "result": "$10$ and $2$",
            "why": "positive diagonal entries"
          },
          {
            "do": "Find largest",
            "result": "$10$",
            "why": "maximum stretch"
          },
          {
            "do": "Find smallest",
            "result": "$2$",
            "why": "minimum stretch"
          },
          {
            "do": "Divide",
            "result": "$10/2=5$",
            "why": "condition ratio"
          },
          {
            "do": "Interpret",
            "result": "factor 5",
            "why": "worst-case amplification"
          }
        ],
        "answer": "$\\kappa_2(D)=5$."
      },
      {
        "problem": "Compute $\\kappa_2$ for $D=\\operatorname{diag}(1,0.001)$.",
        "steps": [
          {
            "do": "List singular values",
            "result": "$1$ and $0.001$",
            "why": "absolute diagonal entries"
          },
          {
            "do": "Divide",
            "result": "$1/0.001$",
            "why": "largest over smallest"
          },
          {
            "do": "Simplify",
            "result": "$1000$",
            "why": "small direction makes inverse large"
          },
          {
            "do": "Interpret",
            "result": "high sensitivity",
            "why": "relative errors can grow greatly"
          },
          {
            "do": "Connect to solving",
            "result": "division by $0.001$",
            "why": "small scales amplify noise"
          }
        ],
        "answer": "$\\kappa_2(D)=1000$."
      },
      {
        "problem": "For SPD eigenvalues $9$ and $3$, compute $\\kappa_2$.",
        "steps": [
          {
            "do": "Use the SPD rule",
            "result": "$\\kappa_2=\\lambda_{\\max}/\\lambda_{\\min}$",
            "why": "positive eigenvalues are stretches"
          },
          {
            "do": "Choose largest",
            "result": "$9$",
            "why": "maximum eigenvalue"
          },
          {
            "do": "Choose smallest",
            "result": "$3$",
            "why": "minimum eigenvalue"
          },
          {
            "do": "Divide",
            "result": "$9/3=3$",
            "why": "condition number"
          },
          {
            "do": "Interpret",
            "result": "moderate sensitivity",
            "why": "not extremely stretched"
          }
        ],
        "answer": "$\\kappa_2=3$."
      },
      {
        "problem": "If $\\kappa(A)=200$ and relative error in $b$ is $0.001$, estimate the worst-case relative error in $x$.",
        "steps": [
          {
            "do": "Write the bound",
            "result": "error in $x\\lesssim\\kappa(A)$ times error in $b$",
            "why": "condition number multiplies relative error"
          },
          {
            "do": "Substitute",
            "result": "$200\\cdot0.001$",
            "why": "use the data"
          },
          {
            "do": "Multiply",
            "result": "$0.2$",
            "why": "compute the bound"
          },
          {
            "do": "Convert to percent",
            "result": "$20\\%$",
            "why": "interpret the relative value"
          },
          {
            "do": "Add caution",
            "result": "worst-case",
            "why": "actual error may be smaller"
          }
        ],
        "answer": "About $0.2$, or $20\\%$."
      },
      {
        "problem": "A covariance matrix has eigenvalues $100,25,1$. Compute its condition number and ML concern.",
        "steps": [
          {
            "do": "Find largest eigenvalue",
            "result": "$100$",
            "why": "largest variance direction"
          },
          {
            "do": "Find smallest eigenvalue",
            "result": "$1$",
            "why": "smallest variance direction"
          },
          {
            "do": "Use the SPD formula",
            "result": "$100/1$",
            "why": "condition ratio"
          },
          {
            "do": "Simplify",
            "result": "$100$",
            "why": "condition number"
          },
          {
            "do": "Interpret",
            "result": "optimization can zigzag",
            "why": "directions have very different scales"
          }
        ],
        "answer": "The condition number is $100$; scaling or whitening may help."
      }
    ],
    "applications": [
      {
        "title": "Linear regression",
        "background": "Ill-conditioned normal equations make coefficients sensitive to small data changes.",
        "numbers": "If $\\kappa(X^TX)=10000$, a $0.01\\%$ data perturbation can become an order-$100\\%$ coefficient error in the worst case."
      },
      {
        "title": "Feature scaling",
        "background": "Standardization reduces conditioning problems by equalizing feature directions.",
        "numbers": "Standard deviations 100 and 1 give a scale ratio near 100; after standardization both are 1."
      },
      {
        "title": "Gradient descent speed",
        "background": "For quadratic losses, condition number measures how elongated the bowl is.",
        "numbers": "Hessian eigenvalues 100 and 1 give $\\kappa=100$, making safe steps slow along the flat direction."
      },
      {
        "title": "Kernel methods",
        "background": "Kernel matrices become ill-conditioned when examples are nearly duplicates.",
        "numbers": "If $\\sigma_{\\max}=2$ and $\\sigma_{\\min}=10^{-6}$, then $\\kappa=2,000,000$."
      },
      {
        "title": "Solver diagnostics",
        "background": "Numerical packages estimate reciprocal condition numbers to warn about near singularity.",
        "numbers": "If $1/\\kappa=10^{-12}$, then $\\kappa=10^{12}$, far beyond comfortable double precision."
      },
      {
        "title": "Whitening embeddings",
        "background": "Whitening equalizes covariance directions but amplifies tiny-variance directions.",
        "numbers": "Eigenvalues 9 and 0.01 give covariance condition number 900; whitening scales by $1/3$ and 10."
      }
    ],
    "applicationsClose": "A condition number is a sensitivity forecast: it tells whether small noise stays small or can become the answer.",
    "takeaways": [
      "$\\kappa(A)=\\|A\\|\\|A^{-1}\\|$ measures worst-case relative amplification.",
      "In the 2-norm, $\\kappa_2=\\sigma_{\\max}/\\sigma_{\\min}$.",
      "Large condition numbers signal sensitivity and slow optimization.",
      "Scaling, regularization, and better formulations can improve practical conditioning."
    ]
  },
  "math-08-16": {
    "id": "math-08-16",
    "title": "Jacobi and Gauss–Seidel iteration",
    "tagline": "Iterative solvers improve a guess by repeatedly letting each equation correct it.",
    "connections": {
      "buildsOn": [
        "linear systems",
        "matrix splitting",
        "convergence of sequences"
      ],
      "leadsTo": [
        "Polynomial interpolation",
        "Least-squares approximation",
        "Eigenvalue computation"
      ],
      "usedWith": [
        "fixed-point iteration",
        "diagonal dominance",
        "residuals"
      ]
    },
    "motivation": "<p>You already know how to solve small systems by elimination. But large sparse systems can be too big to factor comfortably.</p><p><b>Jacobi</b> and <b>Gauss-Seidel</b> instead improve a guess repeatedly. Jacobi waits to use new values; Gauss-Seidel uses them immediately.</p>",
    "definition": "<p>Write $A=D+L+U$, with diagonal part $D$, strictly lower part $L$, and strictly upper part $U$. Jacobi uses $x^{(k+1)}=D^{-1}(b-(L+U)x^{(k)})$. Gauss-Seidel uses $(D+L)x^{(k+1)}=b-Ux^{(k)}$.</p><p>Both are fixed-point iterations. If the updates converge to $x$, then the fixed-point equation rearranges to $Ax=b$. Strict diagonal dominance is a common sufficient condition for convergence.</p><p><b>Assumptions that matter:</b> diagonal entries must be nonzero; convergence depends on $A$; residual $r=b-Ax$ measures progress; and Gauss-Seidel update order can matter.</p>",
    "worked": {
      "problem": "Starting from $(0,0)$, do two Jacobi iterations for $4x+y=9$, $x+3y=7$.",
      "skills": [
        "Jacobi iteration",
        "linear systems",
        "residuals"
      ],
      "strategy": "Solve each equation for its own variable, then update both variables from the old guess.",
      "steps": [
        {
          "do": "Solve for $x$",
          "result": "$x=(9-y)/4$",
          "why": "first equation update"
        },
        {
          "do": "Solve for $y$",
          "result": "$y=(7-x)/3$",
          "why": "second equation update"
        },
        {
          "do": "Use $(0,0)$",
          "result": "$x^{(1)}=2.25$, $y^{(1)}\\approx2.333$",
          "why": "Jacobi uses old values"
        },
        {
          "do": "Update $x$ again",
          "result": "$x^{(2)}=(9-2.333)/4\\approx1.667$",
          "why": "use old $y^{(1)}$"
        },
        {
          "do": "Update $y$ again",
          "result": "$y^{(2)}=(7-2.25)/3\\approx1.583$",
          "why": "use old $x^{(1)}$"
        }
      ],
      "verify": "The exact solution is $(1.6,1.8)$, so the iterate has moved toward the answer.",
      "answer": "After two Jacobi iterations, $x^{(2)}\\approx(1.667,1.583)$.",
      "connects": "Jacobi is a conversation among equations using yesterday's numbers."
    },
    "practice": [
      {
        "problem": "Do one Gauss-Seidel step from $(0,0)$ for the same system.",
        "steps": [
          {
            "do": "Use the $x$ update",
            "result": "$x=(9-0)/4=2.25$",
            "why": "start with old $y$"
          },
          {
            "do": "Use new $x$ in the $y$ update",
            "result": "$y=(7-2.25)/3$",
            "why": "Gauss-Seidel uses fresh values"
          },
          {
            "do": "Compute $y$",
            "result": "$y\\approx1.583$",
            "why": "divide by 3"
          },
          {
            "do": "State the iterate",
            "result": "$(2.25,1.583)$",
            "why": "one full sweep"
          }
        ],
        "answer": "One Gauss-Seidel step gives $(2.25,1.583)$."
      },
      {
        "problem": "Check strict diagonal dominance of $[[5,1],[2,6]]$.",
        "steps": [
          {
            "do": "Check row 1",
            "result": "$5>1$",
            "why": "diagonal exceeds off-diagonal sum"
          },
          {
            "do": "Check row 2",
            "result": "$6>2$",
            "why": "diagonal exceeds off-diagonal sum"
          },
          {
            "do": "State result",
            "result": "strictly diagonally dominant",
            "why": "both rows pass"
          },
          {
            "do": "Connect to iteration",
            "result": "convergence is expected",
            "why": "this is a sufficient condition"
          }
        ],
        "answer": "The matrix is strictly diagonally dominant."
      },
      {
        "problem": "Compute the residual for $x=(1,1)$ in $4x+y=9$, $x+3y=7$.",
        "steps": [
          {
            "do": "Compute row 1",
            "result": "$4(1)+1=5$",
            "why": "left side"
          },
          {
            "do": "Subtract from $b_1$",
            "result": "$9-5=4$",
            "why": "first residual"
          },
          {
            "do": "Compute row 2",
            "result": "$1+3(1)=4$",
            "why": "left side"
          },
          {
            "do": "Subtract from $b_2$",
            "result": "$7-4=3$",
            "why": "second residual"
          }
        ],
        "answer": "The residual is $(4,3)$."
      },
      {
        "problem": "Do one Jacobi step from $(1,1)$ for $10x-y=9$, $-2x+8y=6$.",
        "steps": [
          {
            "do": "Solve for $x$",
            "result": "$x=(9+y)/10$",
            "why": "first equation"
          },
          {
            "do": "Solve for $y$",
            "result": "$y=(6+2x)/8$",
            "why": "second equation"
          },
          {
            "do": "Update $x$",
            "result": "$x^{(1)}=1$",
            "why": "use old $y=1$"
          },
          {
            "do": "Update $y$",
            "result": "$y^{(1)}=1$",
            "why": "use old $x=1$"
          }
        ],
        "answer": "The iterate remains $(1,1)$."
      },
      {
        "problem": "Residual norms are $10,4,1.6,0.64$. Estimate the convergence factor.",
        "steps": [
          {
            "do": "Divide first pair",
            "result": "$4/10=0.4$",
            "why": "successive ratio"
          },
          {
            "do": "Check second pair",
            "result": "$1.6/4=0.4$",
            "why": "same ratio"
          },
          {
            "do": "Check third pair",
            "result": "$0.64/1.6=0.4$",
            "why": "consistent"
          },
          {
            "do": "Predict next",
            "result": "$0.64\\cdot0.4=0.256$",
            "why": "multiply by factor"
          }
        ],
        "answer": "The convergence factor is about $0.4$, and the next residual is about $0.256$."
      }
    ],
    "applications": [
      {
        "title": "PageRank-style systems",
        "background": "Large graph algorithms motivated iterative linear algebra because matrices are sparse and enormous.",
        "numbers": "A graph with $10^8$ nodes and 20 links per node has about $2\\cdot10^9$ nonzeros, too many for dense factorization."
      },
      {
        "title": "Image smoothing",
        "background": "Jacobi-like averaging updates pixels from neighboring old values, making it parallel-friendly.",
        "numbers": "Neighbors 10, 20, 30, 40 average to 25."
      },
      {
        "title": "PDE simulation",
        "background": "Finite-difference heat equations create sparse systems solved by relaxation methods.",
        "numbers": "A grid point with four neighbors summing 80 gets update 20 in a simple Laplace solve."
      },
      {
        "title": "Model training",
        "background": "Numerical methods quietly support the calculations inside training loops.",
        "numbers": "A batch of 128 examples with 768-dimensional embeddings already contains 98,304 feature numbers."
      },
      {
        "title": "Monitoring dashboards",
        "background": "Engineering dashboards turn discrete logs into estimates, rates, and trends.",
        "numbers": "Loss values 0.80 and 0.68 over 4 epochs imply an average drop of 0.03 per epoch."
      },
      {
        "title": "Scientific computing",
        "background": "Simulation codes rely on numerical approximations when exact formulas are unavailable.",
        "numbers": "A grid with 1000 time steps and 500 spatial points stores 500,000 values."
      }
    ],
    "applicationsClose": "Iterative solvers show numerical patience: cheap repeated corrections can beat one expensive direct solve on large sparse problems.",
    "takeaways": [
      "Jacobi updates all variables from the previous iterate.",
      "Gauss-Seidel uses new values immediately.",
      "Convergence depends on the matrix, with diagonal dominance a useful sufficient condition.",
      "Residuals measure how close the current guess is to satisfying $Ax=b$."
    ]
  },
  "math-08-17": {
    "id": "math-08-17",
    "title": "Polynomial interpolation",
    "tagline": "Interpolation builds a polynomial that passes exactly through known data points.",
    "connections": {
      "buildsOn": [
        "polynomials",
        "systems of equations",
        "function values"
      ],
      "leadsTo": [
        "Spline interpolation",
        "Least-squares approximation",
        "Numerical integration"
      ],
      "usedWith": [
        "Vandermonde matrices",
        "finite differences",
        "approximation error"
      ]
    },
    "motivation": "<p>You already know that two points determine a line. Three points can determine a quadratic, and in general $n+1$ distinct points determine one polynomial of degree at most $n$.</p><p><b>Polynomial interpolation</b> uses that promise to fill in between samples. It is exact at the data, which is powerful and sometimes dangerous.</p>",
    "definition": "<p>Given distinct nodes $x_0,\\dots,x_n$ and values $y_0,\\dots,y_n$, there is a unique polynomial $p$ of degree at most $n$ with $p(x_i)=y_i$. In Lagrange form, $p(x)=\\sum_{i=0}^n y_i\\ell_i(x)$, where each $\\ell_i$ is 1 at its own node and 0 at the others.</p><p>The basis polynomials act like switches. Uniqueness follows because two different interpolants would have a difference polynomial of degree at most $n$ with $n+1$ roots, forcing it to be zero.</p><p><b>Assumptions that matter:</b> nodes must be distinct; interpolation matches noise exactly; high degree can oscillate; and extrapolation outside the nodes is risky.</p>",
    "worked": {
      "problem": "Find the line through $(1,3)$ and $(4,9)$, then estimate $x=2$.",
      "skills": [
        "linear interpolation",
        "slope",
        "evaluation"
      ],
      "strategy": "Two points determine a degree-one interpolating polynomial.",
      "steps": [
        {
          "do": "Compute the slope",
          "result": "$(9-3)/(4-1)=2$",
          "why": "rise over run"
        },
        {
          "do": "Use point-slope form",
          "result": "$p(x)=3+2(x-1)$",
          "why": "anchor at $(1,3)$"
        },
        {
          "do": "Simplify",
          "result": "$p(x)=2x+1$",
          "why": "expand"
        },
        {
          "do": "Evaluate at 2",
          "result": "$p(2)=5$",
          "why": "substitute the target"
        }
      ],
      "verify": "The line gives $p(1)=3$ and $p(4)=9$, so it hits both data points.",
      "answer": "$p(x)=2x+1$ and $p(2)=5$.",
      "connects": "Interpolation uses exact anchors to create a function between them."
    },
    "practice": [
      {
        "problem": "Interpolate $(0,2)$ and $(3,8)$ with a line.",
        "steps": [
          {
            "do": "Compute slope",
            "result": "$(8-2)/3=2$",
            "why": "rise over run"
          },
          {
            "do": "Use intercept",
            "result": "$p(x)=2+2x$",
            "why": "value at $x=0$"
          },
          {
            "do": "Check $x=3$",
            "result": "$p(3)=8$",
            "why": "matches second point"
          },
          {
            "do": "State polynomial",
            "result": "$2x+2$",
            "why": "degree one"
          }
        ],
        "answer": "$p(x)=2x+2$."
      },
      {
        "problem": "Linearly interpolate between $(0,10)$ and $(4,18)$ at $x=1$.",
        "steps": [
          {
            "do": "Compute slope",
            "result": "$(18-10)/4=2$",
            "why": "change per unit"
          },
          {
            "do": "Write line",
            "result": "$p(x)=10+2x$",
            "why": "start at 10"
          },
          {
            "do": "Evaluate",
            "result": "$p(1)=12$",
            "why": "substitute"
          },
          {
            "do": "Check",
            "result": "12 lies between 10 and 18",
            "why": "reasonable interior value"
          }
        ],
        "answer": "The estimate is 12."
      },
      {
        "problem": "Find a quadratic through $(0,1)$, $(1,3)$, $(2,7)$.",
        "steps": [
          {
            "do": "Let $p=ax^2+bx+c$",
            "result": "$c=1$",
            "why": "use $p(0)=1$"
          },
          {
            "do": "Use $p(1)=3$",
            "result": "$a+b=2$",
            "why": "subtract 1"
          },
          {
            "do": "Use $p(2)=7$",
            "result": "$4a+2b=6$",
            "why": "subtract 1"
          },
          {
            "do": "Simplify second equation",
            "result": "$2a+b=3$",
            "why": "divide by 2"
          },
          {
            "do": "Solve",
            "result": "$a=1$, $b=1$",
            "why": "subtract equations"
          }
        ],
        "answer": "$p(x)=x^2+x+1$."
      },
      {
        "problem": "Build $\\ell_0$ for nodes $0,1,3$.",
        "steps": [
          {
            "do": "Use roots at other nodes",
            "result": "$(x-1)(x-3)$",
            "why": "basis vanishes at 1 and 3"
          },
          {
            "do": "Evaluate at 0",
            "result": "$3$",
            "why": "normalizing value"
          },
          {
            "do": "Divide by 3",
            "result": "$\\ell_0=(x-1)(x-3)/3$",
            "why": "make value 1 at 0"
          },
          {
            "do": "Check",
            "result": "$\\ell_0(1)=\\ell_0(3)=0$",
            "why": "turns off elsewhere"
          }
        ],
        "answer": "$\\ell_0(x)=(x-1)(x-3)/3$."
      },
      {
        "problem": "Validation loss is 0.8 at epoch 1 and 0.5 at epoch 3. Interpolate epoch 2.",
        "steps": [
          {
            "do": "Compute slope",
            "result": "$(0.5-0.8)/2=-0.15$",
            "why": "drop per epoch"
          },
          {
            "do": "Write line",
            "result": "$p(t)=0.8-0.15(t-1)$",
            "why": "anchor at epoch 1"
          },
          {
            "do": "Evaluate at 2",
            "result": "$p(2)=0.65$",
            "why": "one epoch later"
          },
          {
            "do": "Check",
            "result": "0.65 lies between 0.8 and 0.5",
            "why": "reasonable"
          }
        ],
        "answer": "Estimated loss is 0.65."
      }
    ],
    "applications": [
      {
        "title": "Sensor calibration",
        "background": "Calibration tables record known inputs and interpolate between them.",
        "numbers": "2.0 V at 20 C and 2.5 V at 30 C gives 2.2 V at 24 C."
      },
      {
        "title": "Animation keyframes",
        "background": "Animation fills frames between artist-specified poses.",
        "numbers": "Position 10 to 22 over 6 frames gives position 14 after 2 frames."
      },
      {
        "title": "Learning curves",
        "background": "Dashboards interpolate between logged epochs for smooth reading.",
        "numbers": "Loss 0.8 at epoch 1 and 0.5 at epoch 3 gives 0.65 at epoch 2."
      },
      {
        "title": "Model training",
        "background": "Numerical methods quietly support the calculations inside training loops.",
        "numbers": "A batch of 128 examples with 768-dimensional embeddings already contains 98,304 feature numbers."
      },
      {
        "title": "Monitoring dashboards",
        "background": "Engineering dashboards turn discrete logs into estimates, rates, and trends.",
        "numbers": "Loss values 0.80 and 0.68 over 4 epochs imply an average drop of 0.03 per epoch."
      },
      {
        "title": "Scientific computing",
        "background": "Simulation codes rely on numerical approximations when exact formulas are unavailable.",
        "numbers": "A grid with 1000 time steps and 500 spatial points stores 500,000 values."
      }
    ],
    "applicationsClose": "Interpolation honors data exactly, which is both its gift and its warning.",
    "takeaways": [
      "Distinct nodes determine a unique polynomial of degree at most $n$.",
      "Lagrange basis polynomials act like switches at the nodes.",
      "Interpolation matches samples exactly, including noise.",
      "Low-degree local interpolation is often safer than one high-degree global polynomial."
    ]
  },
  "math-08-18": {
    "id": "math-08-18",
    "title": "Spline interpolation",
    "tagline": "Splines keep interpolation local, smooth, and much less dramatic than one giant polynomial.",
    "connections": {
      "buildsOn": [
        "functions",
        "linear algebra",
        "approximation"
      ],
      "leadsTo": [
        "Numerical precision & stability in deep learning",
        "advanced numerical methods"
      ],
      "usedWith": [
        "error analysis",
        "conditioning",
        "floating-point arithmetic"
      ]
    },
    "motivation": "<p>You already have the core algebra and calculus. This lesson turns that knowledge into a numerical tool that computers can actually use.</p><p>The central idea is to replace an exact object with a carefully chosen approximation, then keep track of what that approximation costs.</p>",
    "definition": "<p>A spline joins low-degree polynomials piece by piece. Cubic splines are popular because they can match values, slopes, and curvatures at knots while staying local.</p><p><b>Assumptions that matter:</b> knots are ordered; smoothness conditions must be chosen; boundary conditions such as natural or clamped change the result; and splines interpolate unless a smoothing spline is requested.</p>",
    "worked": {
      "problem": "Linearly interpolate with two spline pieces through $(0,0)$, $(1,2)$, $(3,3)$ and estimate $x=2$.",
      "skills": [
        "piecewise interpolation",
        "knots",
        "locality"
      ],
      "strategy": "Use only the interval containing the target.",
      "steps": [
        {
          "do": "Locate $x=2$",
          "result": "between knots 1 and 3",
          "why": "use the second piece"
        },
        {
          "do": "Compute slope",
          "result": "$(3-2)/(3-1)=0.5$",
          "why": "rise over run"
        },
        {
          "do": "Write local line",
          "result": "$s(x)=2+0.5(x-1)$",
          "why": "anchor at $(1,2)$"
        },
        {
          "do": "Evaluate at 2",
          "result": "$s(2)=2.5$",
          "why": "substitute"
        }
      ],
      "verify": "The first interval is irrelevant for $x=2$, showing locality.",
      "answer": "$s(2)=2.5$.",
      "connects": "A spline is a coordinated set of local interpolants."
    },
    "practice": [
      {
        "problem": "Interpolate at $x=0.5$ between $(0,0)$ and $(1,2)$.",
        "steps": [
          {
            "do": "Compute slope",
            "result": "2",
            "why": "rise over run"
          },
          {
            "do": "Write line",
            "result": "$s(x)=2x$",
            "why": "first piece"
          },
          {
            "do": "Evaluate",
            "result": "$s(0.5)=1$",
            "why": "substitute"
          },
          {
            "do": "Check",
            "result": "1 is between 0 and 2",
            "why": "reasonable"
          }
        ],
        "answer": "$s(0.5)=1$."
      },
      {
        "problem": "Find the slope on the segment from $(1,2)$ to $(3,3)$.",
        "steps": [
          {
            "do": "Compute rise",
            "result": "$3-2=1$",
            "why": "change in value"
          },
          {
            "do": "Compute run",
            "result": "$3-1=2$",
            "why": "change in input"
          },
          {
            "do": "Divide",
            "result": "$1/2=0.5$",
            "why": "slope"
          },
          {
            "do": "Interpret",
            "result": "gentle increase",
            "why": "local segment rises slowly"
          }
        ],
        "answer": "The slope is 0.5."
      },
      {
        "problem": "For natural cubic boundary conditions, state $s^{\\prime\\prime}(0)$ and $s^{\\prime\\prime}(3)$.",
        "steps": [
          {
            "do": "Recall natural condition",
            "result": "endpoint second derivatives are zero",
            "why": "natural means no endpoint bending"
          },
          {
            "do": "Apply at left",
            "result": "$s^{\\prime\\prime}(0)=0$",
            "why": "left endpoint"
          },
          {
            "do": "Apply at right",
            "result": "$s^{\\prime\\prime}(3)=0$",
            "why": "right endpoint"
          },
          {
            "do": "Interpret",
            "result": "free ends",
            "why": "the curve is not forced to bend at boundaries"
          }
        ],
        "answer": "Both endpoint second derivatives are 0."
      },
      {
        "problem": "A clamped spline has endpoint slopes 4 and 1. What conditions are imposed?",
        "steps": [
          {
            "do": "Name left condition",
            "result": "$s^{\\prime}(0)=4$",
            "why": "left slope is specified"
          },
          {
            "do": "Name right condition",
            "result": "$s^{\\prime}(3)=1$",
            "why": "right slope is specified"
          },
          {
            "do": "Compare to natural",
            "result": "slopes replace zero-curvature conditions",
            "why": "different boundary information"
          },
          {
            "do": "Interpret",
            "result": "guided ends",
            "why": "the curve leaves endpoints with chosen directions"
          }
        ],
        "answer": "Use $s^{\\prime}(0)=4$ and $s^{\\prime}(3)=1$."
      },
      {
        "problem": "A smoothing spline trades fit error 6 for roughness 2 with weight $\\lambda=0.5$. Compute objective.",
        "steps": [
          {
            "do": "Write objective",
            "result": "fit $+\\lambda$ roughness",
            "why": "standard tradeoff"
          },
          {
            "do": "Substitute",
            "result": "$6+0.5\\cdot2$",
            "why": "use numbers"
          },
          {
            "do": "Multiply",
            "result": "$0.5\\cdot2=1$",
            "why": "roughness penalty"
          },
          {
            "do": "Add",
            "result": "$7$",
            "why": "total objective"
          }
        ],
        "answer": "The objective is 7."
      }
    ],
    "applications": [
      {
        "title": "Font rendering",
        "background": "Digital fonts use spline curves to draw smooth letters.",
        "numbers": "A cubic Bezier segment with endpoints 0 and 10 can bend through control values 3 and 7."
      },
      {
        "title": "Robot paths",
        "background": "Robots use splines for smooth paths through waypoints.",
        "numbers": "Waypoints at meters 0, 2, and 5 can be connected with continuous velocity at the middle point."
      },
      {
        "title": "Time-series imputation",
        "background": "Spline interpolation fills missing sensor readings smoothly.",
        "numbers": "Readings 20 at 10:00 and 26 at 10:06 give a local linear estimate 23 at 10:03."
      },
      {
        "title": "Model training",
        "background": "Numerical methods quietly support the calculations inside training loops.",
        "numbers": "A batch of 128 examples with 768-dimensional embeddings already contains 98,304 feature numbers."
      },
      {
        "title": "Monitoring dashboards",
        "background": "Engineering dashboards turn discrete logs into estimates, rates, and trends.",
        "numbers": "Loss values 0.80 and 0.68 over 4 epochs imply an average drop of 0.03 per epoch."
      },
      {
        "title": "Scientific computing",
        "background": "Simulation codes rely on numerical approximations when exact formulas are unavailable.",
        "numbers": "A grid with 1000 time steps and 500 spatial points stores 500,000 values."
      }
    ],
    "applicationsClose": "The same pattern keeps returning: approximate deliberately, compute the error you can, and stay honest about the assumptions.",
    "takeaways": [
      "Splines use low-degree polynomials on intervals.",
      "Knots are the points where pieces meet.",
      "Smoothness conditions coordinate neighboring pieces.",
      "Boundary conditions affect the final spline."
    ]
  },
  "math-08-19": {
    "id": "math-08-19",
    "title": "Least-squares approximation",
    "tagline": "Least squares chooses the best compromise when exact fitting is impossible or unwise.",
    "connections": {
      "buildsOn": [
        "functions",
        "linear algebra",
        "approximation"
      ],
      "leadsTo": [
        "Numerical precision & stability in deep learning",
        "advanced numerical methods"
      ],
      "usedWith": [
        "error analysis",
        "conditioning",
        "floating-point arithmetic"
      ]
    },
    "motivation": "<p>You already have the core algebra and calculus. This lesson turns that knowledge into a numerical tool that computers can actually use.</p><p>The central idea is to replace an exact object with a carefully chosen approximation, then keep track of what that approximation costs.</p>",
    "definition": "<p>Least squares minimizes the sum of squared residuals $\\sum_i(y_i-\\hat y_i)^2$. For a linear model $Ax\\approx b$, the normal equations are $A^TAx=A^Tb$ when $A^TA$ is invertible.</p><p><b>Assumptions that matter:</b> residuals are measured in the chosen scale; outliers get squared emphasis; full column rank gives a unique solution; and QR or SVD is often more stable than normal equations.</p>",
    "worked": {
      "problem": "Fit a line $y=c$ only, a constant model, to data $2,4,7$.",
      "skills": [
        "residuals",
        "minimization",
        "averages"
      ],
      "strategy": "A constant least-squares fit is the mean.",
      "steps": [
        {
          "do": "Write the objective",
          "result": "$(2-c)^2+(4-c)^2+(7-c)^2$",
          "why": "sum squared residuals"
        },
        {
          "do": "Differentiate",
          "result": "$2(c-2)+2(c-4)+2(c-7)$",
          "why": "derivative with respect to $c$"
        },
        {
          "do": "Set to zero",
          "result": "$6c-26=0$",
          "why": "stationary point"
        },
        {
          "do": "Solve",
          "result": "$c=26/6=13/3$",
          "why": "divide by 6"
        }
      ],
      "verify": "The mean of $2,4,7$ is also $13/3$.",
      "answer": "$c=13/3\\approx4.333$.",
      "connects": "Least squares balances residuals by making their signed sum zero for a constant model."
    },
    "practice": [
      {
        "problem": "Find the constant least-squares fit to $1,3,5$.",
        "steps": [
          {
            "do": "Add values",
            "result": "$1+3+5=9$",
            "why": "sum data"
          },
          {
            "do": "Count values",
            "result": "$3$",
            "why": "number of observations"
          },
          {
            "do": "Divide",
            "result": "$9/3=3$",
            "why": "mean"
          },
          {
            "do": "State model",
            "result": "$c=3$",
            "why": "best constant"
          }
        ],
        "answer": "$c=3$."
      },
      {
        "problem": "For predictions $2,5,6$ and labels $3,4,10$, compute squared error.",
        "steps": [
          {
            "do": "Find residuals",
            "result": "$1,-1,4$",
            "why": "label minus prediction"
          },
          {
            "do": "Square residuals",
            "result": "$1,1,16$",
            "why": "squared errors"
          },
          {
            "do": "Sum",
            "result": "$18$",
            "why": "total squared error"
          },
          {
            "do": "Average",
            "result": "$6$",
            "why": "mean squared error"
          }
        ],
        "answer": "SSE is 18 and MSE is 6."
      },
      {
        "problem": "Solve one-parameter least squares with $A=(1,2)$ and $b=(3,5)$ for $x$.",
        "steps": [
          {
            "do": "Write normal equation",
            "result": "$(1^2+2^2)x=1\\cdot3+2\\cdot5$",
            "why": "use $A^TAx=A^Tb$"
          },
          {
            "do": "Compute left coefficient",
            "result": "$5x$",
            "why": "sum squares"
          },
          {
            "do": "Compute right side",
            "result": "$13$",
            "why": "dot product"
          },
          {
            "do": "Solve",
            "result": "$x=13/5=2.6$",
            "why": "divide"
          }
        ],
        "answer": "$x=2.6$."
      },
      {
        "problem": "Compute residuals for model $\\hat y=2x$ at points $(1,3)$ and $(2,5)$.",
        "steps": [
          {
            "do": "Predict first",
            "result": "$2$",
            "why": "use $x=1$"
          },
          {
            "do": "Residual first",
            "result": "$3-2=1$",
            "why": "label minus prediction"
          },
          {
            "do": "Predict second",
            "result": "$4$",
            "why": "use $x=2$"
          },
          {
            "do": "Residual second",
            "result": "$5-4=1$",
            "why": "label minus prediction"
          }
        ],
        "answer": "Residuals are $(1,1)$."
      },
      {
        "problem": "Ridge objective is squared error 8 plus $\\lambda\\|w\\|^2$ with $\\lambda=0.1$ and $\\|w\\|=5$. Compute total.",
        "steps": [
          {
            "do": "Square the norm",
            "result": "$25$",
            "why": "regularization uses norm squared"
          },
          {
            "do": "Multiply penalty",
            "result": "$0.1\\cdot25=2.5$",
            "why": "weighted penalty"
          },
          {
            "do": "Add data error",
            "result": "$8+2.5=10.5$",
            "why": "total objective"
          },
          {
            "do": "Interpret",
            "result": "penalty raises objective",
            "why": "large weights cost more"
          }
        ],
        "answer": "The total objective is 10.5."
      }
    ],
    "applications": [
      {
        "title": "Linear regression",
        "background": "Least squares is the classical foundation of regression.",
        "numbers": "For data $1,3,5$, the best constant predictor is 3."
      },
      {
        "title": "Matrix factor models",
        "background": "Recommenders often minimize squared rating errors.",
        "numbers": "Predictions 4.0 and 3.5 for labels 5 and 3 have squared errors 1 and 0.25."
      },
      {
        "title": "Sensor fusion",
        "background": "Multiple noisy readings can be combined by least squares.",
        "numbers": "Readings 9.8, 10.1, 10.0 average to 9.967 as a constant fit."
      },
      {
        "title": "Model training",
        "background": "Numerical methods quietly support the calculations inside training loops.",
        "numbers": "A batch of 128 examples with 768-dimensional embeddings already contains 98,304 feature numbers."
      },
      {
        "title": "Monitoring dashboards",
        "background": "Engineering dashboards turn discrete logs into estimates, rates, and trends.",
        "numbers": "Loss values 0.80 and 0.68 over 4 epochs imply an average drop of 0.03 per epoch."
      },
      {
        "title": "Scientific computing",
        "background": "Simulation codes rely on numerical approximations when exact formulas are unavailable.",
        "numbers": "A grid with 1000 time steps and 500 spatial points stores 500,000 values."
      }
    ],
    "applicationsClose": "The same pattern keeps returning: approximate deliberately, compute the error you can, and stay honest about the assumptions.",
    "takeaways": [
      "Least squares minimizes a sum of squared residuals.",
      "A constant least-squares fit is the mean.",
      "Normal equations are compact but can worsen conditioning.",
      "QR and SVD are often preferred for numerical stability."
    ]
  },
  "math-08-20": {
    "id": "math-08-20",
    "title": "Numerical integration (quadrature)",
    "tagline": "Quadrature estimates area by replacing a hard curve with simple pieces whose areas we can compute.",
    "connections": {
      "buildsOn": [
        "functions",
        "linear algebra",
        "approximation"
      ],
      "leadsTo": [
        "Numerical precision & stability in deep learning",
        "advanced numerical methods"
      ],
      "usedWith": [
        "error analysis",
        "conditioning",
        "floating-point arithmetic"
      ]
    },
    "motivation": "<p>You already have the core algebra and calculus. This lesson turns that knowledge into a numerical tool that computers can actually use.</p><p>The central idea is to replace an exact object with a carefully chosen approximation, then keep track of what that approximation costs.</p>",
    "definition": "<p>Numerical integration estimates $\\int_a^b f(x)\\,dx$ from sampled function values. Rectangle, trapezoid, and Simpson rules are common quadrature formulas.</p><p><b>Assumptions that matter:</b> smoothness controls accuracy; smaller step sizes usually help; endpoint and midpoint choices change the rule; and highly oscillatory or singular functions need special care.</p>",
    "worked": {
      "problem": "Use the trapezoid rule with one panel to estimate $\\int_0^2 x^2\\,dx$.",
      "skills": [
        "trapezoid rule",
        "area",
        "approximation"
      ],
      "strategy": "Replace the curve by the line through endpoint values.",
      "steps": [
        {
          "do": "Evaluate the endpoints",
          "result": "$f(0)=0$, $f(2)=4$",
          "why": "trapezoid rule uses endpoint heights"
        },
        {
          "do": "Compute the width",
          "result": "$h=2$",
          "why": "interval length"
        },
        {
          "do": "Apply the rule",
          "result": "$h(f(0)+f(2))/2$",
          "why": "area of a trapezoid"
        },
        {
          "do": "Substitute",
          "result": "$2(0+4)/2=4$",
          "why": "calculate estimate"
        }
      ],
      "verify": "The exact integral is $8/3\\approx2.667$, so one trapezoid overestimates this convex curve.",
      "answer": "The estimate is 4.",
      "connects": "Quadrature turns area into weighted sums of function values."
    },
    "practice": [
      {
        "problem": "Use midpoint rule for $\\int_0^2 x^2\\,dx$ with one panel.",
        "steps": [
          {
            "do": "Find midpoint",
            "result": "$1$",
            "why": "middle of interval"
          },
          {
            "do": "Evaluate",
            "result": "$f(1)=1$",
            "why": "height at midpoint"
          },
          {
            "do": "Use width",
            "result": "$2$",
            "why": "interval length"
          },
          {
            "do": "Multiply",
            "result": "$2\\cdot1=2$",
            "why": "midpoint estimate"
          }
        ],
        "answer": "The estimate is 2."
      },
      {
        "problem": "Use Simpson rule on $[0,2]$ for $x^2$ with midpoint 1.",
        "steps": [
          {
            "do": "Evaluate values",
            "result": "$0,1,4$",
            "why": "at 0, 1, 2"
          },
          {
            "do": "Apply Simpson",
            "result": "$2(0+4\\cdot1+4)/6$",
            "why": "width times weighted average"
          },
          {
            "do": "Add weights",
            "result": "$8$",
            "why": "inside sum"
          },
          {
            "do": "Compute",
            "result": "$16/6=8/3$",
            "why": "exact for quadratics"
          }
        ],
        "answer": "The estimate is $8/3$."
      },
      {
        "problem": "Trapezoid estimate for points $(0,1)$ and $(3,5)$.",
        "steps": [
          {
            "do": "Find width",
            "result": "$3$",
            "why": "interval length"
          },
          {
            "do": "Average heights",
            "result": "$(1+5)/2=3$",
            "why": "mean endpoint height"
          },
          {
            "do": "Multiply",
            "result": "$3\\cdot3=9$",
            "why": "area estimate"
          },
          {
            "do": "State units",
            "result": "area units",
            "why": "height times width"
          }
        ],
        "answer": "The estimate is 9."
      },
      {
        "problem": "Composite trapezoid with values $1,3,5$ at step $h=2$.",
        "steps": [
          {
            "do": "Use formula",
            "result": "$h(\\tfrac12f_0+f_1+\\tfrac12f_2)$",
            "why": "composite trapezoid"
          },
          {
            "do": "Substitute",
            "result": "$2(0.5+3+2.5)$",
            "why": "use endpoint halves"
          },
          {
            "do": "Add inside",
            "result": "$6$",
            "why": "weighted height sum"
          },
          {
            "do": "Multiply",
            "result": "$12$",
            "why": "area estimate"
          }
        ],
        "answer": "The estimate is 12."
      },
      {
        "problem": "A validation curve has metric values $0.6,0.8,0.7$ at step 1. Estimate area by trapezoid.",
        "steps": [
          {
            "do": "Use endpoint halves",
            "result": "$0.5(0.6)+0.8+0.5(0.7)$",
            "why": "composite rule"
          },
          {
            "do": "Compute halves",
            "result": "$0.3+0.8+0.35$",
            "why": "weighted values"
          },
          {
            "do": "Add",
            "result": "$1.45$",
            "why": "step size is 1"
          },
          {
            "do": "Interpret",
            "result": "average performance over time",
            "why": "area summarizes metric history"
          }
        ],
        "answer": "Estimated area is 1.45."
      }
    ],
    "applications": [
      {
        "title": "Expected values",
        "background": "Many expectations are integrals, and quadrature approximates them from function evaluations.",
        "numbers": "At points 0, 1, 2 with values 1, 2, 5 and step 1, trapezoid area is 5."
      },
      {
        "title": "AUC metrics",
        "background": "Area under a curve summarizes classifier tradeoffs.",
        "numbers": "TPR values 0, 0.7, 1 at FPR 0, 0.5, 1 give trapezoid AUC $0.5(0+0.7)0.5+0.5(0.7+1)0.5=0.6$."
      },
      {
        "title": "Physics simulation",
        "background": "Work is force integrated over distance.",
        "numbers": "For forces 10 N and 14 N over 3 m, trapezoid work is 36 J."
      },
      {
        "title": "Model training",
        "background": "Numerical methods quietly support the calculations inside training loops.",
        "numbers": "A batch of 128 examples with 768-dimensional embeddings already contains 98,304 feature numbers."
      },
      {
        "title": "Monitoring dashboards",
        "background": "Engineering dashboards turn discrete logs into estimates, rates, and trends.",
        "numbers": "Loss values 0.80 and 0.68 over 4 epochs imply an average drop of 0.03 per epoch."
      },
      {
        "title": "Scientific computing",
        "background": "Simulation codes rely on numerical approximations when exact formulas are unavailable.",
        "numbers": "A grid with 1000 time steps and 500 spatial points stores 500,000 values."
      }
    ],
    "applicationsClose": "The same pattern keeps returning: approximate deliberately, compute the error you can, and stay honest about the assumptions.",
    "takeaways": [
      "Quadrature approximates integrals with weighted sums.",
      "The trapezoid rule uses endpoint values.",
      "Simpson rule is exact for quadratics on one panel.",
      "Smoothness and step size control accuracy."
    ]
  },
  "math-08-21": {
    "id": "math-08-21",
    "title": "Numerical differentiation",
    "tagline": "Numerical differentiation estimates a slope from nearby function values, balancing truncation and roundoff.",
    "connections": {
      "buildsOn": [
        "functions",
        "linear algebra",
        "approximation"
      ],
      "leadsTo": [
        "Numerical precision & stability in deep learning",
        "advanced numerical methods"
      ],
      "usedWith": [
        "error analysis",
        "conditioning",
        "floating-point arithmetic"
      ]
    },
    "motivation": "<p>You already have the core algebra and calculus. This lesson turns that knowledge into a numerical tool that computers can actually use.</p><p>The central idea is to replace an exact object with a carefully chosen approximation, then keep track of what that approximation costs.</p>",
    "definition": "<p>Numerical differentiation replaces an exact derivative by a finite difference such as $(f(x+h)-f(x))/h$ or $(f(x+h)-f(x-h))/(2h)$.</p><p><b>Assumptions that matter:</b> the function must be smooth enough near the point; smaller $h$ reduces truncation error at first; too-small $h$ increases roundoff and cancellation; and central differences are usually more accurate than forward differences.</p>",
    "worked": {
      "problem": "Estimate $f^\\prime(2)$ for $f(x)=x^2$ using forward difference with $h=0.1$.",
      "skills": [
        "finite differences",
        "derivatives",
        "error"
      ],
      "strategy": "Use the nearby function value at $x+h$.",
      "steps": [
        {
          "do": "Evaluate $f(2.1)$",
          "result": "$4.41$",
          "why": "square 2.1"
        },
        {
          "do": "Evaluate $f(2)$",
          "result": "$4$",
          "why": "square 2"
        },
        {
          "do": "Subtract",
          "result": "$0.41$",
          "why": "change in output"
        },
        {
          "do": "Divide by $h$",
          "result": "$0.41/0.1=4.1$",
          "why": "forward difference slope"
        }
      ],
      "verify": "The exact derivative is $2x=4$, so the estimate has error $0.1$.",
      "answer": "$f^\\prime(2)\\approx4.1$.",
      "connects": "Finite differences turn derivatives into local measurements."
    },
    "practice": [
      {
        "problem": "Use central difference with $h=0.1$ for $f(x)=x^2$ at $x=2$.",
        "steps": [
          {
            "do": "Evaluate $f(2.1)$",
            "result": "$4.41$",
            "why": "right value"
          },
          {
            "do": "Evaluate $f(1.9)$",
            "result": "$3.61$",
            "why": "left value"
          },
          {
            "do": "Subtract",
            "result": "$0.80$",
            "why": "symmetric change"
          },
          {
            "do": "Divide by $0.2$",
            "result": "$4$",
            "why": "central denominator"
          }
        ],
        "answer": "The estimate is 4."
      },
      {
        "problem": "Forward difference for $f(x)=3x+1$ at $x=5$ with $h=0.01$.",
        "steps": [
          {
            "do": "Evaluate right value",
            "result": "$f(5.01)=16.03$",
            "why": "linear function"
          },
          {
            "do": "Evaluate base",
            "result": "$f(5)=16$",
            "why": "base value"
          },
          {
            "do": "Subtract",
            "result": "$0.03$",
            "why": "change"
          },
          {
            "do": "Divide",
            "result": "$0.03/0.01=3$",
            "why": "slope"
          }
        ],
        "answer": "The derivative estimate is 3."
      },
      {
        "problem": "Estimate derivative from values $f(1)=2$ and $f(1.2)=2.48$.",
        "steps": [
          {
            "do": "Compute change in $f$",
            "result": "$0.48$",
            "why": "output difference"
          },
          {
            "do": "Compute change in $x$",
            "result": "$0.2$",
            "why": "input difference"
          },
          {
            "do": "Divide",
            "result": "$0.48/0.2=2.4$",
            "why": "secant slope"
          },
          {
            "do": "State estimate",
            "result": "$2.4$",
            "why": "forward difference"
          }
        ],
        "answer": "The estimate is 2.4."
      },
      {
        "problem": "For $f(x)=x^3$, central difference at 1 with $h=0.1$.",
        "steps": [
          {
            "do": "Evaluate $f(1.1)$",
            "result": "$1.331$",
            "why": "right value"
          },
          {
            "do": "Evaluate $f(0.9)$",
            "result": "$0.729$",
            "why": "left value"
          },
          {
            "do": "Subtract",
            "result": "$0.602$",
            "why": "symmetric difference"
          },
          {
            "do": "Divide by $0.2$",
            "result": "$3.01$",
            "why": "central estimate"
          }
        ],
        "answer": "The estimate is 3.01."
      },
      {
        "problem": "A gradient check gives analytic 0.250 and numerical 0.251. Compute relative difference using denominator 0.250.",
        "steps": [
          {
            "do": "Subtract",
            "result": "$0.001$",
            "why": "absolute difference"
          },
          {
            "do": "Divide",
            "result": "$0.001/0.250=0.004$",
            "why": "relative difference"
          },
          {
            "do": "Convert",
            "result": "$0.4\\%$",
            "why": "percentage"
          },
          {
            "do": "Interpret",
            "result": "close",
            "why": "likely gradient is correct"
          }
        ],
        "answer": "The relative difference is $0.004$, or $0.4\\%$."
      }
    ],
    "applications": [
      {
        "title": "Gradient checking",
        "background": "ML engineers compare backprop gradients to finite differences.",
        "numbers": "Loss 1.000 at $w=2$ and 1.00025 at $w=2.001$ gives slope 0.25."
      },
      {
        "title": "Sensitivity analysis",
        "background": "Finite differences estimate how outputs react to inputs.",
        "numbers": "If latency rises from 80 ms to 82 ms when QPS rises by 100, slope is 0.02 ms per QPS."
      },
      {
        "title": "Physics velocity",
        "background": "Velocity is numerically differentiated position.",
        "numbers": "Position 10 m at 2 s and 10.6 m at 2.1 s gives about 6 m/s."
      },
      {
        "title": "Model training",
        "background": "Numerical methods quietly support the calculations inside training loops.",
        "numbers": "A batch of 128 examples with 768-dimensional embeddings already contains 98,304 feature numbers."
      },
      {
        "title": "Monitoring dashboards",
        "background": "Engineering dashboards turn discrete logs into estimates, rates, and trends.",
        "numbers": "Loss values 0.80 and 0.68 over 4 epochs imply an average drop of 0.03 per epoch."
      },
      {
        "title": "Scientific computing",
        "background": "Simulation codes rely on numerical approximations when exact formulas are unavailable.",
        "numbers": "A grid with 1000 time steps and 500 spatial points stores 500,000 values."
      }
    ],
    "applicationsClose": "The same pattern keeps returning: approximate deliberately, compute the error you can, and stay honest about the assumptions.",
    "takeaways": [
      "Forward differences are simple but first-order accurate.",
      "Central differences often reduce truncation error.",
      "Too-small steps can cause cancellation and roundoff.",
      "Gradient checks use numerical differentiation as an independent test."
    ]
  },
  "math-08-22": {
    "id": "math-08-22",
    "title": "Eigenvalue computation",
    "tagline": "Eigenvalue algorithms repeatedly expose the directions a matrix stretches without changing direction.",
    "connections": {
      "buildsOn": [
        "functions",
        "linear algebra",
        "approximation"
      ],
      "leadsTo": [
        "Numerical precision & stability in deep learning",
        "advanced numerical methods"
      ],
      "usedWith": [
        "error analysis",
        "conditioning",
        "floating-point arithmetic"
      ]
    },
    "motivation": "<p>You already have the core algebra and calculus. This lesson turns that knowledge into a numerical tool that computers can actually use.</p><p>The central idea is to replace an exact object with a carefully chosen approximation, then keep track of what that approximation costs.</p>",
    "definition": "<p>An eigenpair satisfies $Av=\\lambda v$: the vector direction survives multiplication, only scaled by $\\lambda$. Computing eigenvalues exactly is rarely how numerical software works.</p><p><b>Assumptions that matter:</b> convergence depends on eigenvalue separation; symmetric matrices have especially stable algorithms; normalization prevents overflow; and repeated eigenvalues need extra care.</p>",
    "worked": {
      "problem": "Use two steps of power iteration for $A=[[2,0],[0,1]]$ starting from $v=(1,1)$.",
      "skills": [
        "power iteration",
        "normalization",
        "dominant eigenvalues"
      ],
      "strategy": "Repeatedly multiply by $A$ and normalize to reveal the dominant direction.",
      "steps": [
        {
          "do": "Multiply once",
          "result": "$Av=(2,1)$",
          "why": "apply the matrix"
        },
        {
          "do": "Normalize by largest component",
          "result": "$(1,0.5)$",
          "why": "keep numbers controlled"
        },
        {
          "do": "Multiply again",
          "result": "$A(1,0.5)=(2,0.5)$",
          "why": "second power step"
        },
        {
          "do": "Normalize again",
          "result": "$(1,0.25)$",
          "why": "direction moves toward the first coordinate"
        }
      ],
      "verify": "The dominant eigenvector is $(1,0)$, and the iterates are approaching it.",
      "answer": "After two normalized steps, $v\\approx(1,0.25)$.",
      "connects": "Power iteration lets repeated stretching reveal the dominant eigenvector."
    },
    "practice": [
      {
        "problem": "Compute eigenvalues of diagonal matrix $[[3,0],[0,1]]$.",
        "steps": [
          {
            "do": "Read diagonal entries",
            "result": "$3$ and $1$",
            "why": "diagonal matrices scale coordinate axes"
          },
          {
            "do": "Use coordinate vectors",
            "result": "$(1,0)$ and $(0,1)$",
            "why": "directions stay fixed"
          },
          {
            "do": "State eigenvalues",
            "result": "$3,1$",
            "why": "scales on those directions"
          },
          {
            "do": "Identify dominant",
            "result": "$3$",
            "why": "largest magnitude"
          }
        ],
        "answer": "Eigenvalues are 3 and 1."
      },
      {
        "problem": "One power step for $[[4,0],[0,2]]$ from $(1,1)$.",
        "steps": [
          {
            "do": "Multiply",
            "result": "$Av=(4,2)$",
            "why": "apply matrix"
          },
          {
            "do": "Normalize by 4",
            "result": "$(1,0.5)$",
            "why": "scale largest component to 1"
          },
          {
            "do": "Interpret",
            "result": "closer to $(1,0)$",
            "why": "dominant direction"
          },
          {
            "do": "Dominant eigenvalue",
            "result": "about 4",
            "why": "largest stretch"
          }
        ],
        "answer": "The normalized vector is $(1,0.5)$."
      },
      {
        "problem": "Estimate Rayleigh quotient for $A=[[2,0],[0,1]]$ and $v=(1,0.5)$.",
        "steps": [
          {
            "do": "Compute $Av$",
            "result": "$(2,0.5)$",
            "why": "matrix-vector product"
          },
          {
            "do": "Compute $v^TAv$",
            "result": "$2+0.25=2.25$",
            "why": "dot product"
          },
          {
            "do": "Compute $v^Tv$",
            "result": "$1+0.25=1.25$",
            "why": "norm squared"
          },
          {
            "do": "Divide",
            "result": "$2.25/1.25=1.8$",
            "why": "Rayleigh quotient"
          }
        ],
        "answer": "The estimate is 1.8."
      },
      {
        "problem": "Why normalize in power iteration if $\\lambda=5$?",
        "steps": [
          {
            "do": "Track growth after 1 step",
            "result": "factor 5",
            "why": "vector length multiplies"
          },
          {
            "do": "Track after 4 steps",
            "result": "$5^4=625$",
            "why": "rapid growth"
          },
          {
            "do": "Name the problem",
            "result": "overflow risk",
            "why": "numbers can become huge"
          },
          {
            "do": "State fix",
            "result": "normalize every step",
            "why": "keep direction, control scale"
          }
        ],
        "answer": "Normalization prevents overflow while preserving direction."
      },
      {
        "problem": "For eigenvalues $10$ and $9$, explain slow power convergence.",
        "steps": [
          {
            "do": "Compute ratio",
            "result": "$9/10=0.9$",
            "why": "subdominant over dominant"
          },
          {
            "do": "After 5 steps",
            "result": "$0.9^5\\approx0.590$",
            "why": "unwanted component decays slowly"
          },
          {
            "do": "After 20 steps",
            "result": "$0.9^{20}\\approx0.122$",
            "why": "still present"
          },
          {
            "do": "Interpret",
            "result": "small eigenvalue gap",
            "why": "dominant direction is hard to isolate"
          }
        ],
        "answer": "Power iteration converges slowly because the ratio is 0.9."
      }
    ],
    "applications": [
      {
        "title": "PCA",
        "background": "Principal component analysis finds eigenvectors of covariance matrices.",
        "numbers": "Eigenvalues 9 and 1 mean the first principal direction has 9 times the variance of the second."
      },
      {
        "title": "Graph ranking",
        "background": "Eigenvectors of link matrices underlie centrality and ranking algorithms.",
        "numbers": "A transition matrix repeatedly applied 50 times can approach a steady eigenvector."
      },
      {
        "title": "Stability analysis",
        "background": "Eigenvalues of update matrices determine whether errors grow or shrink.",
        "numbers": "If the largest magnitude eigenvalue is 0.8, errors shrink by about $0.8^{10}\\approx0.107$ after 10 steps."
      },
      {
        "title": "Model training",
        "background": "Numerical methods quietly support the calculations inside training loops.",
        "numbers": "A batch of 128 examples with 768-dimensional embeddings already contains 98,304 feature numbers."
      },
      {
        "title": "Monitoring dashboards",
        "background": "Engineering dashboards turn discrete logs into estimates, rates, and trends.",
        "numbers": "Loss values 0.80 and 0.68 over 4 epochs imply an average drop of 0.03 per epoch."
      },
      {
        "title": "Scientific computing",
        "background": "Simulation codes rely on numerical approximations when exact formulas are unavailable.",
        "numbers": "A grid with 1000 time steps and 500 spatial points stores 500,000 values."
      }
    ],
    "applicationsClose": "The same pattern keeps returning: approximate deliberately, compute the error you can, and stay honest about the assumptions.",
    "takeaways": [
      "An eigenvector keeps direction under matrix multiplication.",
      "Power iteration reveals the dominant eigenvector through repeated multiplication.",
      "Normalization controls scale without changing direction.",
      "Eigenvalue gaps strongly affect convergence speed."
    ]
  },
  "math-08-23": {
    "id": "math-08-23",
    "title": "Numerical precision & stability in deep learning",
    "tagline": "Deep learning works best when the math respects finite precision instead of pretending computers store real numbers.",
    "connections": {
      "buildsOn": [
        "floating-point representation",
        "condition number",
        "numerical differentiation",
        "eigenvalue computation"
      ],
      "leadsTo": [
        "mixed-precision training",
        "stable optimization",
        "large-scale ML systems"
      ],
      "usedWith": [
        "roundoff error",
        "stable algorithms",
        "gradient scaling"
      ]
    },
    "motivation": "<p>You have now seen the numerical theme from many angles: errors propagate, conditioning matters, and stable algorithms can make the same mathematical expression behave very differently.</p><p>Deep learning gathers all of these ideas at scale. Billions of operations, tiny gradients, large logits, and mixed precision mean that numerical stability is not decoration. It is part of the model.</p>",
    "definition": "<p><b>Numerical precision</b> describes how many bits a format uses to store numbers, such as fp32, fp16, or bfloat16. <b>Stability</b> means an algorithm keeps roundoff and scaling errors from overwhelming the intended computation. Common deep-learning stabilizers include log-sum-exp, max-shifted softmax, gradient clipping, loss scaling, normalization, and well-conditioned parameterizations.</p><p>For softmax, compute $\\operatorname{softmax}(z)_i=e^{z_i}/\\sum_j e^{z_j}$. Subtracting $m=\\max_j z_j$ gives the equivalent expression $e^{z_i-m}/\\sum_j e^{z_j-m}$, because the common factor $e^{-m}$ cancels. The shifted version avoids overflow.</p><p><b>Assumptions that matter:</b> floating-point arithmetic rounds every operation; fp16 has limited exponent range; bfloat16 has wider range but fewer mantissa bits than fp32; and algebraically identical formulas can have very different numerical behavior.</p>",
    "worked": {
      "problem": "Compute softmax for logits $[1000,1001,1002]$ stably and find the largest probability.",
      "skills": [
        "softmax",
        "log-sum-exp",
        "overflow avoidance"
      ],
      "strategy": "Direct exponentials overflow, so subtract the maximum logit first.",
      "steps": [
        {
          "do": "Find the maximum logit",
          "result": "$m=1002$",
          "why": "use the largest logit as the shift"
        },
        {
          "do": "Shift the logits",
          "result": "$[-2,-1,0]$",
          "why": "subtract 1002 from each logit"
        },
        {
          "do": "Exponentiate shifted logits",
          "result": "$[0.1353,0.3679,1]$",
          "why": "these exponentials are safe"
        },
        {
          "do": "Sum the weights",
          "result": "$1.5032$",
          "why": "normalization denominator"
        },
        {
          "do": "Divide the largest weight",
          "result": "$1/1.5032\\approx0.6652$",
          "why": "largest shifted logit has weight 1"
        }
      ],
      "verify": "The probabilities sum to about 1, and no huge exponential was formed.",
      "answer": "The largest-class probability is approximately $0.665$.",
      "connects": "The stable formula is mathematically identical but numerically safe."
    },
    "practice": [
      {
        "problem": "Compute stable softmax probabilities for logits $[0,1]$.",
        "steps": [
          {
            "do": "Find max",
            "result": "$m=1$",
            "why": "shift by largest logit"
          },
          {
            "do": "Shift",
            "result": "[-1,0]",
            "why": "subtract max"
          },
          {
            "do": "Exponentiate",
            "result": "$[0.3679,1]$",
            "why": "safe weights"
          },
          {
            "do": "Sum",
            "result": "$1.3679$",
            "why": "denominator"
          },
          {
            "do": "Divide",
            "result": "$[0.269,0.731]$",
            "why": "normalize"
          }
        ],
        "answer": "The probabilities are approximately $[0.269,0.731]$."
      },
      {
        "problem": "A gradient norm is 12 and clipping threshold is 3. Compute the scaling factor.",
        "steps": [
          {
            "do": "Write factor",
            "result": "$3/12$",
            "why": "threshold over norm"
          },
          {
            "do": "Divide",
            "result": "$0.25$",
            "why": "scale factor"
          },
          {
            "do": "Scale a gradient component 8",
            "result": "$8\\cdot0.25=2$",
            "why": "example component"
          },
          {
            "do": "Check new norm",
            "result": "$12\\cdot0.25=3$",
            "why": "meets threshold"
          }
        ],
        "answer": "Scale gradients by 0.25."
      },
      {
        "problem": "Loss scaling multiplies a tiny fp16 gradient $2\\cdot10^{-8}$ by scale $1024$. Compute scaled value.",
        "steps": [
          {
            "do": "Write product",
            "result": "$2\\cdot10^{-8}\\cdot1024$",
            "why": "apply scale"
          },
          {
            "do": "Multiply",
            "result": "$2.048\\cdot10^{-5}$",
            "why": "scaled gradient"
          },
          {
            "do": "Explain benefit",
            "result": "larger than before",
            "why": "less likely to underflow"
          },
          {
            "do": "Unscale later",
            "result": "divide by 1024",
            "why": "recover original magnitude"
          }
        ],
        "answer": "The scaled gradient is $2.048\\cdot10^{-5}$."
      },
      {
        "problem": "Compute log-sum-exp for $[10,12]$ stably.",
        "steps": [
          {
            "do": "Find max",
            "result": "$m=12$",
            "why": "shift value"
          },
          {
            "do": "Shift logits",
            "result": "[-2,0]",
            "why": "subtract 12"
          },
          {
            "do": "Compute sum",
            "result": "$e^{-2}+1\\approx1.1353$",
            "why": "safe exponentials"
          },
          {
            "do": "Take log and add max",
            "result": "$12+\\ln(1.1353)\\approx12.127$",
            "why": "stable log-sum-exp"
          }
        ],
        "answer": "$\\operatorname{LSE}(10,12)\\approx12.127$."
      },
      {
        "problem": "A Hessian has eigenvalues $1000$ and $1$. What learning-rate issue appears for gradient descent?",
        "steps": [
          {
            "do": "Compute condition number",
            "result": "$1000/1=1000$",
            "why": "curvature ratio"
          },
          {
            "do": "Safe step for steep direction",
            "result": "about $1/1000$",
            "why": "large curvature limits step"
          },
          {
            "do": "Progress in flat direction",
            "result": "very slow",
            "why": "same step is tiny for curvature 1"
          },
          {
            "do": "Name remedy",
            "result": "preconditioning or normalization",
            "why": "reduce curvature imbalance"
          }
        ],
        "answer": "The loss is badly conditioned; stable training may need scaling, normalization, or adaptive methods."
      }
    ],
    "applications": [
      {
        "title": "Stable softmax",
        "background": "Classification models often see logits large enough to overflow if exponentiated directly.",
        "numbers": "Logits $[1000,1001,1002]$ become safe weights $[0.1353,0.3679,1]$ after subtracting 1002."
      },
      {
        "title": "Cross-entropy",
        "background": "Computing log probabilities directly is safer than taking a log after a rounded probability.",
        "numbers": "For true probability $0.001$, loss is $-\\ln(0.001)\\approx6.908$."
      },
      {
        "title": "Mixed precision",
        "background": "fp16 speeds training but needs care with tiny gradients.",
        "numbers": "A gradient $2\\cdot10^{-8}$ scaled by 1024 becomes $2.048\\cdot10^{-5}$ before unscaling."
      },
      {
        "title": "Gradient clipping",
        "background": "Clipping prevents a rare large batch from causing a destructive parameter jump.",
        "numbers": "Norm 12 clipped to threshold 3 scales every gradient component by 0.25."
      },
      {
        "title": "Layer normalization",
        "background": "Normalization keeps activation scales in a numerically friendly range.",
        "numbers": "Values $[2,4,6]$ have mean 4 and standard deviation about 1.633, so normalized values are about $[-1.225,0,1.225]$."
      },
      {
        "title": "Attention scores",
        "background": "Transformer attention uses softmax on dot-product scores, so max-shifting matters there too.",
        "numbers": "Scores $[30,35]$ shift to $[-5,0]$, giving weights $[0.0067,1]$ and probabilities about $[0.0067,0.9933]$."
      },
      {
        "title": "Optimizer state",
        "background": "Adam stores moving averages, and precision affects small second-moment estimates.",
        "numbers": "With $v_t=0.999v_{t-1}+0.001g^2$ and $g=0.01$, the new contribution is $10^{-7}$."
      },
      {
        "title": "Conditioned loss surfaces",
        "background": "Curvature imbalance makes training slow or unstable.",
        "numbers": "Eigenvalues $1000$ and $1$ give condition number 1000, so a step safe for the steep direction crawls in the flat one."
      }
    ],
    "applicationsClose": "Deep-learning stability is numerical analysis at scale: the model succeeds when formulas, formats, and optimization respect the limits of arithmetic.",
    "takeaways": [
      "Algebraically equivalent formulas can differ dramatically in floating-point arithmetic.",
      "Max-shifted softmax and log-sum-exp prevent overflow without changing the result.",
      "Mixed precision often needs loss scaling, clipping, and normalization.",
      "Conditioning and eigenvalue spread shape how stable and fast optimization feels."
    ]
  }
};
