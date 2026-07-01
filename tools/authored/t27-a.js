module.exports = {
  "math-27-01": {
    "id": "math-27-01",
    "title": "The scientific computing workflow",
    "tagline": "Scientific computing turns a mathematical question into a trustworthy numerical answer, one checked step at a time.",
    "connections": {
      "buildsOn": [
        "functions",
        "vectors and matrices",
        "basic algorithms",
        "error estimates"
      ],
      "leadsTo": [
        "Vectorization",
        "Applied floating-point error",
        "Direct linear solvers in practice"
      ],
      "usedWith": [
        "modeling assumptions",
        "discretization",
        "conditioning",
        "residuals"
      ]
    },
    "motivation": "<p>You already solve word problems by translating them into equations. Scientific computing is the same habit at a larger scale: start with a real question, choose a mathematical model, compute carefully, and check whether the answer deserves trust.</p><p>The workflow matters because computers are fast, not automatically wise. A simulation can look polished while hiding a bad model, a coarse grid, or a numerically fragile calculation. The calm habit is to ask at every stage: what problem am I solving, what approximation did I introduce, and how do I know the answer is reasonable?</p>",
    "definition": "<p>A <b>scientific computing workflow</b> is the chain $$\\text{question}\\to\\text{model}\\to\\text{discretization}\\to\\text{algorithm}\\to\\text{implementation}\\to\\text{verification}\\to\\text{interpretation}.$$ The question is the real-world target, the model is the mathematical description, the discretization turns continuous objects into finite arrays, the algorithm computes, and verification checks whether the computation solved the intended numerical problem.</p><p>The central split is between <b>modeling error</b>, <b>discretization error</b>, <b>roundoff error</b>, and <b>iteration error</b>. A useful error budget is $|\\text{truth}-\\text{computed}|\\le |\\text{truth}-\\text{model}|+|\\text{model}-\\text{discrete}|+|\\text{discrete}-\\text{algorithm}|+|\\text{algorithm}-\\text{computed}|$. This is just the triangle inequality, but it gives the workflow its discipline.</p><p><b>Assumptions that matter:</b> the mathematical model must match the question closely enough; units and scales must be consistent; finite arrays only approximate continuous quantities; and a small residual proves the equations were nearly solved, not that the original model was perfect.</p>",
    "worked": {
      "problem": "A temperature simulation has modeling error about $0.8^\\circ$C, grid error $0.3^\\circ$C, solver tolerance $0.05^\\circ$C, and roundoff below $0.01^\\circ$C. Bound the total error and identify the dominant source.",
      "skills": [
        "error budgets",
        "triangle inequality",
        "scientific interpretation"
      ],
      "strategy": "Separate the sources first, then add worst-case magnitudes and compare sizes.",
      "steps": [
        {
          "do": "Write the error-budget inequality",
          "result": "$E\\le E_{\\text{model}}+E_{\\text{grid}}+E_{\\text{solver}}+E_{\\text{round}}$",
          "why": "the triangle inequality gives a safe worst-case bound"
        },
        {
          "do": "Substitute the four numbers",
          "result": "$E\\le0.8+0.3+0.05+0.01$",
          "why": "each contribution is measured in degrees Celsius"
        },
        {
          "do": "Add the first two terms",
          "result": "$0.8+0.3=1.1$",
          "why": "combine the largest sources first"
        },
        {
          "do": "Add the remaining terms",
          "result": "$1.1+0.05+0.01=1.16$",
          "why": "finish the worst-case sum"
        },
        {
          "do": "Compare contributions",
          "result": "$0.8$ is the largest term",
          "why": "the biggest term is the dominant source in the budget"
        }
      ],
      "verify": "The bound is larger than each individual source, as a worst-case total should be; improving the $0.05$ solver tolerance would barely change a $1.16$ bound.",
      "answer": "The total error is bounded by about $1.16^\\circ$C, dominated by modeling error.",
      "connects": "The workflow keeps numerical speed attached to error sources you can name and improve."
    },
    "practice": [
      {
        "problem": "A computed drug concentration has model error $2.0$ mg/L, discretization error $0.4$ mg/L, and solver error $0.1$ mg/L. Give a worst-case total bound and the percentage due to the model term.",
        "steps": [
          {
            "do": "Write the bound",
            "result": "$E\\le2.0+0.4+0.1$",
            "why": "worst-case absolute errors add"
          },
          {
            "do": "Add the terms",
            "result": "$E\\le2.5$ mg/L",
            "why": "$2.0+0.4+0.1=2.5$"
          },
          {
            "do": "Form the model fraction",
            "result": "$2.0/2.5$",
            "why": "percentage means contribution divided by total bound"
          },
          {
            "do": "Convert to percent",
            "result": "$2.0/2.5=0.8=80\\%$",
            "why": "multiply the fraction by 100"
          },
          {
            "do": "Interpret",
            "result": "modeling dominates",
            "why": "most of the budget comes before computation begins"
          }
        ],
        "answer": "Worst-case error is $2.5$ mg/L, with $80\\%$ of that bound from modeling error."
      },
      {
        "problem": "A grid method has error approximately $C h^2$. If the error is $0.012$ at step size $h=0.1$, estimate the error at $h=0.05$.",
        "steps": [
          {
            "do": "Write the error law",
            "result": "$E(h)=C h^2$",
            "why": "second-order methods scale like the square of step size"
          },
          {
            "do": "Form the ratio",
            "result": "$\\dfrac{E(0.05)}{E(0.1)}=\\left(\\dfrac{0.05}{0.1}\\right)^2$",
            "why": "the constant $C$ cancels"
          },
          {
            "do": "Compute the step ratio",
            "result": "$0.05/0.1=0.5$",
            "why": "the step size is halved"
          },
          {
            "do": "Square the ratio",
            "result": "$0.5^2=0.25$",
            "why": "second-order error quarters when $h$ halves"
          },
          {
            "do": "Multiply the old error",
            "result": "$E(0.05)=0.012\\cdot0.25=0.003$",
            "why": "apply the ratio"
          }
        ],
        "answer": "The estimated error is $0.003$."
      },
      {
        "problem": "A nonlinear solver reports residual norm $\\|r\\|=10^{-5}$ for a problem whose data norm is $\\|b\\|=20$. Compute the relative residual and decide whether it meets tolerance $10^{-6}$.",
        "steps": [
          {
            "do": "Write the relative residual",
            "result": "$\\|r\\|/\\|b\\|$",
            "why": "scale the residual by the problem size"
          },
          {
            "do": "Substitute values",
            "result": "$10^{-5}/20$",
            "why": "use the reported residual and data norm"
          },
          {
            "do": "Rewrite $20$",
            "result": "$20=2\\cdot10$",
            "why": "this makes the power of ten easy"
          },
          {
            "do": "Divide",
            "result": "$10^{-5}/20=5\\cdot10^{-7}$",
            "why": "one twentieth of $10^{-5}$ is $0.05\\cdot10^{-5}$"
          },
          {
            "do": "Compare with tolerance",
            "result": "$5\\cdot10^{-7}<10^{-6}$",
            "why": "the relative residual is smaller than required"
          }
        ],
        "answer": "The relative residual is $5\\cdot10^{-7}$, so it meets the $10^{-6}$ tolerance."
      },
      {
        "problem": "A simulation takes $12$ seconds on a $200\\times200$ grid. If the algorithm cost scales like $n^3$ where $n$ is the grid width, estimate the time for a $400\\times400$ grid.",
        "steps": [
          {
            "do": "Find the size ratio",
            "result": "$400/200=2$",
            "why": "the grid width doubles"
          },
          {
            "do": "Apply cubic scaling",
            "result": "$2^3=8$",
            "why": "cost grows like the third power of width"
          },
          {
            "do": "Multiply the old time",
            "result": "$12\\cdot8=96$",
            "why": "new time is old time times cost factor"
          },
          {
            "do": "Attach units",
            "result": "$96$ seconds",
            "why": "the original measurement was in seconds"
          },
          {
            "do": "Convert if helpful",
            "result": "$96$ seconds is $1.6$ minutes",
            "why": "divide by 60"
          }
        ],
        "answer": "The estimated runtime is $96$ seconds, about $1.6$ minutes."
      },
      {
        "problem": "An ML training run uses a physical simulator. Validation fails unless total numerical error is below $0.2$. Current errors are model $0.12$, discretization $0.09$, iteration $0.03$, and roundoff $0.01$. Does the run pass, and what should be improved first?",
        "steps": [
          {
            "do": "Add model and discretization errors",
            "result": "$0.12+0.09=0.21$",
            "why": "start with the two largest terms"
          },
          {
            "do": "Add iteration error",
            "result": "$0.21+0.03=0.24$",
            "why": "include incomplete solver convergence"
          },
          {
            "do": "Add roundoff error",
            "result": "$0.24+0.01=0.25$",
            "why": "finish the total bound"
          },
          {
            "do": "Compare with requirement",
            "result": "$0.25>0.2$",
            "why": "the bound exceeds the target"
          },
          {
            "do": "Identify largest adjustable term",
            "result": "$0.12$ is largest",
            "why": "model error contributes the most, followed by discretization"
          }
        ],
        "answer": "It does not pass under the worst-case bound; improve the model first, then the discretization."
      }
    ],
    "applications": [
      {
        "title": "Weather and climate models",
        "background": "Forecasting turns physics into finite computations on a grid. The workflow separates model assumptions, grid spacing, time stepping, and solver checks.",
        "numbers": "If a regional model has $1.5^\\circ$C model error and $0.4^\\circ$C grid error, the safe budget is at least $1.9^\\circ$C before roundoff or solver error."
      },
      {
        "title": "Computational fluid dynamics",
        "background": "Aircraft and vehicle design use simulations because physical prototypes are expensive. Engineers refine grids and compare residuals before trusting lift or drag numbers.",
        "numbers": "If drag changes from $0.312$ to $0.318$ when the grid doubles, the grid-change estimate is $0.006$, about $1.9\\%$ of $0.318$."
      },
      {
        "title": "Training data generated by simulators",
        "background": "ML models sometimes learn from synthetic data produced by physics engines. The simulator's numerical errors become part of the training data quality.",
        "numbers": "If simulator labels have error bound $0.05$ and model training loss is $0.02$, reducing loss below $0.05$ may not improve label truth much."
      },
      {
        "title": "Reproducible experiments",
        "background": "Scientific computing values logs, seeds, versions, and unit tests because tiny implementation changes can alter numerical results.",
        "numbers": "If two runs report objective values $1.2341$ and $1.2344$, their absolute difference is $0.0003$, which is below a tolerance of $10^{-3}$."
      },
      {
        "title": "Mesh refinement studies",
        "background": "A standard verification move is to solve the same problem on several grid sizes and look for predictable convergence.",
        "numbers": "For second-order behavior, errors $0.08$, $0.02$, and $0.005$ after halving $h$ twice show factors near $4$ each time."
      },
      {
        "title": "Scientific ML pipelines",
        "background": "Hybrid systems combine numerical solvers with learned components. The workflow clarifies whether a failure comes from data, equations, optimization, or floating-point arithmetic.",
        "numbers": "If total error is $0.31$ and the learned surrogate contributes $0.22$, then the surrogate accounts for $0.22/0.31\\approx71\\%$ of the budget."
      }
    ],
    "applicationsClose": "The same workflow wears many uniforms: model, discretize, compute, verify, and only then interpret the answer.",
    "takeaways": [
      "Scientific computing is a workflow, not just code that runs fast.",
      "Error budgets separate modeling, discretization, iteration, and roundoff effects.",
      "Residuals check numerical equations; they do not by themselves validate the real-world model.",
      "Scaling estimates help you predict whether a computation will remain practical."
    ]
  },
  "math-27-02": {
    "id": "math-27-02",
    "title": "Vectorization",
    "tagline": "Vectorization lets you say the mathematical operation once and let optimized array machinery do the repeated work.",
    "connections": {
      "buildsOn": [
        "vectors and matrices",
        "dot products",
        "functions as rules",
        "the scientific computing workflow"
      ],
      "leadsTo": [
        "Applied floating-point error",
        "Direct linear solvers in practice",
        "Power iteration"
      ],
      "usedWith": [
        "matrix multiplication",
        "broadcasting",
        "linear maps",
        "array shapes"
      ]
    },
    "motivation": "<p>You already know how to add two lists entry by entry. A loop says that instruction many times; vectorization says the whole operation in one mathematical sentence, such as $y=3x+2$ for every entry of $x$.</p><p>The point is not just shorter code. Modern numerical libraries hand vector and matrix operations to carefully tuned kernels that use cache, SIMD instructions, and sometimes GPUs. Vectorization is how your code speaks the language those machines are built to accelerate.</p>",
    "definition": "<p><b>Vectorization</b> means expressing repeated scalar operations as operations on whole arrays. If $x\\in\\mathbb{R}^n$, then $y=2x+1$ means $y_i=2x_i+1$ for each index $i$. If $X\\in\\mathbb{R}^{m\\times d}$ and $w\\in\\mathbb{R}^d$, then $Xw\\in\\mathbb{R}^m$ collects all $m$ dot products at once.</p><p>The key identity is that a batch of linear predictions is a matrix-vector product: row $i$ of $Xw$ equals $\\sum_{j=1}^d X_{ij}w_j$. That is exactly the loop over features, but the matrix notation exposes the whole computation to optimized linear algebra.</p><p><b>Assumptions that matter:</b> array shapes must agree; broadcasting must mean what you intend; vectorized code still performs the same arithmetic up to possible ordering changes; and memory layout can matter as much as the number of arithmetic operations.</p>",
    "worked": {
      "problem": "For $X=\\begin{bmatrix}1&2\\3&4\\5&6\\end{bmatrix}$ and $w=\\begin{bmatrix}0.5\\-1\\end{bmatrix}$, compute the vectorized predictions $Xw$.",
      "skills": [
        "matrix-vector products",
        "shape checking",
        "batch prediction"
      ],
      "strategy": "Check the shapes, then compute one row dot product at a time while keeping the vector form in view.",
      "steps": [
        {
          "do": "Identify the shapes",
          "result": "$X\\in\\mathbb{R}^{3\\times2}$ and $w\\in\\mathbb{R}^2$",
          "why": "the inner dimension 2 matches"
        },
        {
          "do": "Determine the output shape",
          "result": "$Xw\\in\\mathbb{R}^3$",
          "why": "three rows produce three predictions"
        },
        {
          "do": "Compute row 1 dot product",
          "result": "$1(0.5)+2(-1)=-1.5$",
          "why": "multiply matching entries and add"
        },
        {
          "do": "Compute row 2 dot product",
          "result": "$3(0.5)+4(-1)=-2.5$",
          "why": "use the second row of $X$"
        },
        {
          "do": "Compute row 3 dot product",
          "result": "$5(0.5)+6(-1)=-3.5$",
          "why": "use the third row of $X$"
        },
        {
          "do": "Assemble the vector",
          "result": "$Xw=\\begin{bmatrix}-1.5\\-2.5\\-3.5\\end{bmatrix}$",
          "why": "stack the three row results"
        }
      ],
      "verify": "The output has three entries, one for each row, and every entry is negative because the $-1$ weight on the larger second column dominates.",
      "answer": "$Xw=\\begin{bmatrix}-1.5\\-2.5\\-3.5\\end{bmatrix}$.",
      "connects": "Vectorization turns many repeated dot products into one matrix-vector operation."
    },
    "practice": [
      {
        "problem": "Let $x=[2,-1,4]$. Compute $y=3x-5$ entry by entry and as a vector.",
        "steps": [
          {
            "do": "Multiply the vector by $3$",
            "result": "$3x=[6,-3,12]$",
            "why": "scale each entry"
          },
          {
            "do": "Write the broadcasted constant",
            "result": "$[5,5,5]$",
            "why": "subtract 5 from every entry"
          },
          {
            "do": "Subtract entry 1",
            "result": "$6-5=1$",
            "why": "first component"
          },
          {
            "do": "Subtract entry 2",
            "result": "$-3-5=-8$",
            "why": "second component"
          },
          {
            "do": "Subtract entry 3",
            "result": "$12-5=7$",
            "why": "third component"
          }
        ],
        "answer": "$y=[1,-8,7]$."
      },
      {
        "problem": "Compute the squared Euclidean distances from rows $[1,0]$, $[2,2]$, and $[-1,3]$ to $c=[1,2]$.",
        "steps": [
          {
            "do": "Subtract $c$ from the first row",
            "result": "$[1,0]-[1,2]=[0,-2]$",
            "why": "broadcast the center to each row"
          },
          {
            "do": "Square and sum first difference",
            "result": "$0^2+(-2)^2=4$",
            "why": "squared distance"
          },
          {
            "do": "Subtract $c$ from the second row",
            "result": "$[2,2]-[1,2]=[1,0]$",
            "why": "second difference vector"
          },
          {
            "do": "Square and sum second difference",
            "result": "$1^2+0^2=1$",
            "why": "squared distance"
          },
          {
            "do": "Subtract and square for third row",
            "result": "$[-2,1]$ gives $(-2)^2+1^2=5$",
            "why": "third squared distance"
          }
        ],
        "answer": "The squared distances are $[4,1,5]$."
      },
      {
        "problem": "For scores $s=[1,3,2]$, compute a stable softmax by subtracting the maximum before exponentiating. Use $e^{-2}\\approx0.135$, $e^{-1}\\approx0.368$, and $e^0=1$.",
        "steps": [
          {
            "do": "Find the maximum score",
            "result": "$\\max(s)=3$",
            "why": "subtracting it prevents large exponentials"
          },
          {
            "do": "Shift the scores",
            "result": "$s-3=[-2,0,-1]$",
            "why": "broadcast the maximum"
          },
          {
            "do": "Exponentiate",
            "result": "$[e^{-2},e^0,e^{-1}]\\approx[0.135,1,0.368]$",
            "why": "turn scores into positive weights"
          },
          {
            "do": "Sum the weights",
            "result": "$0.135+1+0.368=1.503$",
            "why": "normalization denominator"
          },
          {
            "do": "Divide each weight",
            "result": "$[0.090,0.665,0.245]$",
            "why": "each weight divided by $1.503$"
          }
        ],
        "answer": "The stable softmax is approximately $[0.090,0.665,0.245]$."
      },
      {
        "problem": "A mini-batch has $X\\in\\mathbb{R}^{4\\times3}$ and weights $W\\in\\mathbb{R}^{3\\times2}$. How many outputs does $XW$ contain, and how many multiply-add terms form each output?",
        "steps": [
          {
            "do": "Check inner dimensions",
            "result": "$3$ and $3$ match",
            "why": "matrix multiplication is defined"
          },
          {
            "do": "Determine output shape",
            "result": "$XW\\in\\mathbb{R}^{4\\times2}$",
            "why": "outer dimensions remain"
          },
          {
            "do": "Count output entries",
            "result": "$4\\cdot2=8$",
            "why": "rows times columns"
          },
          {
            "do": "Read dot-product length",
            "result": "$3$",
            "why": "each output pairs a row of length 3 with a column of length 3"
          },
          {
            "do": "State arithmetic per output",
            "result": "$3$ multiplications and $2$ additions",
            "why": "a length-3 dot product has three products summed"
          }
        ],
        "answer": "$XW$ has $8$ outputs, each from a length-$3$ dot product."
      },
      {
        "problem": "A loop computes $z_i=(x_i-\\mu)/\\sigma$ for $5$ features with $x=[12,9,15,6,18]$, $\\mu=12$, and $\\sigma=3$. Vectorize and compute $z$.",
        "steps": [
          {
            "do": "Write the vector expression",
            "result": "$z=(x-12)/3$",
            "why": "subtract and divide are applied to every entry"
          },
          {
            "do": "Subtract the mean",
            "result": "$x-12=[0,-3,3,-6,6]$",
            "why": "center the features"
          },
          {
            "do": "Divide by the scale",
            "result": "$[0,-3,3,-6,6]/3$",
            "why": "standardize by standard deviation"
          },
          {
            "do": "Compute the entries",
            "result": "$[0,-1,1,-2,2]$",
            "why": "divide each component by 3"
          },
          {
            "do": "Check the center",
            "result": "the original value $12$ maps to $0$",
            "why": "standardization centers the feature"
          }
        ],
        "answer": "$z=[0,-1,1,-2,2]$."
      }
    ],
    "applications": [
      {
        "title": "Batch prediction",
        "background": "Linear and neural models usually score many examples at once. Vectorization collects the examples into a matrix so a single kernel does the work.",
        "numbers": "If $X$ has shape $1000\\times20$ and $w$ has length $20$, then $Xw$ produces $1000$ predictions."
      },
      {
        "title": "Image processing",
        "background": "Images are arrays, and filters often apply the same arithmetic to millions of pixels. Vectorized operations avoid slow Python-level pixel loops.",
        "numbers": "Increasing brightness by $15$ sends pixel values $[20,100,240]$ to $[35,115,255]$ after clipping at $255$."
      },
      {
        "title": "Distance computations in clustering",
        "background": "K-means repeatedly computes distances from many points to a few centers. Broadcasting makes the point-center differences explicit as arrays.",
        "numbers": "For point $(2,5)$ and center $(4,1)$, squared distance is $(2-4)^2+(5-1)^2=20$."
      },
      {
        "title": "Gradient updates",
        "background": "Optimizers update every parameter with the same rule. A vectorized update is both clearer and faster.",
        "numbers": "With $w=[1,-2]$, gradient $g=[0.3,-0.5]$, and $\\eta=0.1$, the update gives $w-\\eta g=[0.97,-1.95]$."
      },
      {
        "title": "GPU acceleration",
        "background": "GPUs are designed for many similar operations in parallel. Matrix operations expose enough regular work to keep them busy.",
        "numbers": "A batch matrix multiply of shapes $64\\times128$ and $128\\times256$ produces $64\\times256=16384$ outputs."
      },
      {
        "title": "Simulation state updates",
        "background": "Particle simulations store positions and velocities in arrays. One vectorized formula advances every particle.",
        "numbers": "With positions $[0,2,5]$, velocities $[1,-1,0.5]$, and $\\Delta t=0.1$, new positions are $[0.1,1.9,5.05]$."
      }
    ],
    "applicationsClose": "Vectorization is the habit of matching your code to the mathematical array operation and the hardware that already knows how to run it well.",
    "takeaways": [
      "Vectorization expresses repeated scalar work as array operations.",
      "Shape checking is part of the mathematics, not a coding afterthought.",
      "Matrix products collect many dot products into one operation.",
      "Broadcasting is powerful only when the repeated dimension is intentional."
    ]
  },
  "math-27-03": {
    "id": "math-27-03",
    "title": "Applied floating-point error",
    "tagline": "Floating-point arithmetic is reliable when you know where its tiny rounding promises become large numerical surprises.",
    "connections": {
      "buildsOn": [
        "scientific notation",
        "relative error",
        "Vectorization",
        "the scientific computing workflow"
      ],
      "leadsTo": [
        "Direct linear solvers in practice",
        "Preconditioning",
        "iterative stopping criteria"
      ],
      "usedWith": [
        "rounding",
        "conditioning",
        "cancellation",
        "machine epsilon"
      ]
    },
    "motivation": "<p>You already round numbers in daily life. Saying a bill is about $20$ dollars instead of $19.97 is harmless because the scale of the task allows it. Computers do a disciplined version of that rounding at enormous speed.</p><p>The danger is that some formulas magnify small rounding errors. Subtracting nearly equal numbers, summing a long list in an unlucky order, or solving an ill-conditioned system can turn harmless-looking roundoff into a visible mistake. Floating-point wisdom is learning which computations are sensitive.</p>",
    "definition": "<p>A floating-point number stores a sign, a significand, and an exponent, so most real numbers are rounded to nearby representable numbers. The common model is $\\operatorname{fl}(x\\circ y)=(x\\circ y)(1+\\delta)$ with $|\\delta|\\le u$, where $\\circ$ is one arithmetic operation and $u$ is the unit roundoff.</p><p><b>Absolute error</b> is $|\\hat x-x|$, and <b>relative error</b> is $|\\hat x-x|/|x|$ when $x\\ne0$. Relative error explains why $0.001$ error is large for $0.002$ but tiny for $1000$. Cancellation matters because subtracting close numbers shrinks the true result while previous absolute errors remain.</p><p><b>Assumptions that matter:</b> the simple one-step model assumes no overflow, underflow, or invalid operations; relative error is meaningful only away from zero; and stable algorithms control error growth rather than eliminating rounding entirely.</p>",
    "worked": {
      "problem": "A computation returns $\\hat x=1.0004$ for a true value $x=1.0000$, and returns $\\hat y=0.0004$ for a true value $y=0.0001$. Compare the relative errors.",
      "skills": [
        "absolute error",
        "relative error",
        "scale awareness"
      ],
      "strategy": "Compute absolute errors first, then divide by the size of the true value.",
      "steps": [
        {
          "do": "Compute the first absolute error",
          "result": "$|1.0004-1.0000|=0.0004$",
          "why": "absolute error measures raw distance"
        },
        {
          "do": "Compute the first relative error",
          "result": "$0.0004/1.0000=0.0004$",
          "why": "divide by the true value"
        },
        {
          "do": "Convert the first relative error",
          "result": "$0.0004=0.04\\%$",
          "why": "multiply by 100"
        },
        {
          "do": "Compute the second absolute error",
          "result": "$|0.0004-0.0001|=0.0003$",
          "why": "raw error is slightly smaller"
        },
        {
          "do": "Compute the second relative error",
          "result": "$0.0003/0.0001=3$",
          "why": "the true value is tiny"
        },
        {
          "do": "Convert the second relative error",
          "result": "$3=300\\%$",
          "why": "the estimate is four times the true value"
        }
      ],
      "verify": "The smaller absolute error gives the larger relative error because it occurs near zero.",
      "answer": "The first relative error is $0.04\\%$; the second is $300\\%$.",
      "connects": "Floating-point error must be judged relative to the scale of the quantity you care about."
    },
    "practice": [
      {
        "problem": "Round $x=3.14159$ to $\\hat x=3.14$. Compute absolute and relative error.",
        "steps": [
          {
            "do": "Subtract",
            "result": "$3.14-3.14159=-0.00159$",
            "why": "signed error shows direction"
          },
          {
            "do": "Take absolute value",
            "result": "$0.00159$",
            "why": "absolute error ignores direction"
          },
          {
            "do": "Form relative error",
            "result": "$0.00159/3.14159$",
            "why": "scale by the true value"
          },
          {
            "do": "Approximate",
            "result": "$0.00159/3.14159\\approx0.000506$",
            "why": "divide the numbers"
          },
          {
            "do": "Convert to percent",
            "result": "$0.0506\\%$",
            "why": "multiply by 100"
          }
        ],
        "answer": "Absolute error $0.00159$; relative error about $5.06\\cdot10^{-4}$, or $0.0506\\%$."
      },
      {
        "problem": "In decimal arithmetic rounded to three significant digits, compute the cancellation in $1.01-1.00$ if each input has possible absolute error $0.005$.",
        "steps": [
          {
            "do": "Compute the exact displayed difference",
            "result": "$1.01-1.00=0.01$",
            "why": "the subtraction result is small"
          },
          {
            "do": "Add possible input errors",
            "result": "$0.005+0.005=0.010$",
            "why": "absolute errors can combine in subtraction"
          },
          {
            "do": "Compare error to result",
            "result": "$0.010/0.01=1$",
            "why": "relative uncertainty is the error bound over the result"
          },
          {
            "do": "Convert to percent",
            "result": "$1=100\\%$",
            "why": "the result can be completely uncertain"
          },
          {
            "do": "Name the issue",
            "result": "catastrophic cancellation",
            "why": "close subtraction magnifies relative error"
          }
        ],
        "answer": "The difference $0.01$ can have about $100\\%$ relative uncertainty from the input rounding."
      },
      {
        "problem": "Sum $10^8+1-10^8$ exactly and then in an arithmetic system that loses the $+1$ when added to $10^8$.",
        "steps": [
          {
            "do": "Group left to right exactly",
            "result": "$(10^8+1)-10^8=1$",
            "why": "ordinary real arithmetic keeps the small increment"
          },
          {
            "do": "Apply the floating addition loss",
            "result": "$\\operatorname{fl}(10^8+1)=10^8$",
            "why": "the $1$ is below the represented spacing"
          },
          {
            "do": "Subtract the large number",
            "result": "$10^8-10^8=0$",
            "why": "the stored increment vanished"
          },
          {
            "do": "Compute absolute error",
            "result": "$|0-1|=1$",
            "why": "compare computed to exact"
          },
          {
            "do": "Interpret",
            "result": "the order lost the small contribution",
            "why": "finite precision can make addition non-associative"
          }
        ],
        "answer": "Exact result is $1$; the described floating-point computation returns $0$."
      },
      {
        "problem": "A residual norm is $\\|r\\|=10^{-10}$, but the matrix condition number is $\\kappa(A)=10^8$. Estimate a possible relative solution error using $\\kappa(A)\\|r\\|/\\|b\\|$ with $\\|b\\|=1$.",
        "steps": [
          {
            "do": "Write the estimate",
            "result": "$\\kappa(A)\\|r\\|/\\|b\\|$",
            "why": "conditioning can amplify residuals"
          },
          {
            "do": "Substitute values",
            "result": "$10^8\\cdot10^{-10}/1$",
            "why": "use the given norm and condition number"
          },
          {
            "do": "Combine powers",
            "result": "$10^{8-10}=10^{-2}$",
            "why": "multiply powers of ten"
          },
          {
            "do": "Convert to percent",
            "result": "$10^{-2}=1\\%$",
            "why": "relative error as a percent"
          },
          {
            "do": "Interpret",
            "result": "small residual may still allow $1\\%$ error",
            "why": "ill-conditioning magnifies"
          }
        ],
        "answer": "The possible relative solution error is about $10^{-2}$, or $1\\%$."
      },
      {
        "problem": "A loss is computed as $L=(a-b)^2$ with $a=1000.001$ and $b=1000.000$. If each value is stored only to three decimal places, what is $L$? What if both were rounded to the nearest integer first?",
        "steps": [
          {
            "do": "Subtract with three decimals",
            "result": "$1000.001-1000.000=0.001$",
            "why": "the small difference is still represented"
          },
          {
            "do": "Square the difference",
            "result": "$(0.001)^2=10^{-6}$",
            "why": "apply the loss formula"
          },
          {
            "do": "Round both inputs to integers",
            "result": "$1000.001\\mapsto1000$ and $1000.000\\mapsto1000$",
            "why": "nearest integer removes the difference"
          },
          {
            "do": "Subtract rounded integers",
            "result": "$1000-1000=0$",
            "why": "the signal disappears"
          },
          {
            "do": "Square the rounded difference",
            "result": "$0^2=0$",
            "why": "the computed loss becomes zero"
          }
        ],
        "answer": "With three decimals, $L=10^{-6}$; after integer rounding, $L=0$."
      }
    ],
    "applications": [
      {
        "title": "Stable softmax",
        "background": "Classification code subtracts the maximum logit before exponentiating to avoid overflow while preserving probabilities.",
        "numbers": "Logits $[1000,1001]$ become $[-1,0]$, giving weights $[0.368,1]$ instead of impossible values like $e^{1001}$."
      },
      {
        "title": "Summing gradients",
        "background": "Training often sums many small gradient contributions. Summation order affects roundoff, especially in low precision.",
        "numbers": "Adding $10^6$ copies of $10^{-6}$ should give $1$; an error of $10^{-8}$ per addition could accumulate to about $0.01$."
      },
      {
        "title": "Mixed-precision training",
        "background": "Modern accelerators use lower precision for speed and memory, then protect sensitive accumulations in higher precision.",
        "numbers": "A batch of $1024$ products around $10^{-3}$ sums to about $1.024$; accumulating in too few bits can lose small product differences."
      },
      {
        "title": "Ill-conditioned linear systems",
        "background": "A matrix can make tiny data errors produce large solution errors. The condition number measures that sensitivity.",
        "numbers": "If $\\kappa(A)=10^6$ and data relative error is $10^{-8}$, solution relative error can be around $10^{-2}$."
      },
      {
        "title": "Finite-difference derivatives",
        "background": "Approximating derivatives by subtracting nearby function values balances truncation error against cancellation.",
        "numbers": "For $f(x)=x^2$ at $x=1$ and $h=10^{-4}$, $(f(1+h)-f(1))/h=2.0001$, close to $2$."
      },
      {
        "title": "Probability products",
        "background": "Multiplying many probabilities can underflow. Logs keep the same information on a safer scale.",
        "numbers": "One hundred factors of $0.01$ give $10^{-200}$, while the log sum is $100\\ln0.01\\approx-460.5$."
      }
    ],
    "applicationsClose": "Floating-point arithmetic is not broken; it is a precise finite system that rewards formulas designed with scale and sensitivity in mind.",
    "takeaways": [
      "Absolute error measures raw distance; relative error measures distance compared with scale.",
      "Cancellation can turn small absolute input errors into large relative output errors.",
      "Conditioning describes problem sensitivity; stability describes algorithm behavior.",
      "Stable formulas often compute the same mathematical quantity in a numerically safer way."
    ]
  },
  "math-27-04": {
    "id": "math-27-04",
    "title": "Direct linear solvers in practice",
    "tagline": "Direct solvers turn $Ax=b$ into a sequence of eliminations whose residuals and conditioning tell you how much to trust the answer.",
    "connections": {
      "buildsOn": [
        "matrices",
        "systems of linear equations",
        "Applied floating-point error",
        "Vectorization"
      ],
      "leadsTo": [
        "Conjugate gradient (CG)",
        "GMRES",
        "Preconditioning"
      ],
      "usedWith": [
        "LU factorization",
        "pivoting",
        "condition numbers",
        "residuals"
      ]
    },
    "motivation": "<p>You already know elimination from small systems: use one equation to remove a variable from another, then back-substitute. Direct linear solvers are that same idea organized for large matrices.</p><p>In practice, the question is not just whether a solver returns numbers. We ask whether pivoting was needed, whether the matrix was nearly singular, how large the residual is, and whether the computed answer is accurate enough for the surrounding model.</p>",
    "definition": "<p>A <b>direct linear solver</b> computes a solution of $Ax=b$ in a finite planned sequence, commonly by factoring $A$ as $PA=LU$. Here $P$ is a permutation matrix for pivoting, $L$ is lower triangular, and $U$ is upper triangular. The solve becomes $Ly=Pb$ followed by $Ux=y$.</p><p>The reason this helps is that triangular systems are easy: the first equation gives one unknown, then each following equation gives the next. Gaussian elimination constructs $L$ and $U$ by subtracting multiples of pivot rows. Pivoting swaps rows so pivots are not dangerously small.</p><p><b>Assumptions that matter:</b> $A$ should be square and nonsingular for a unique solution; small pivots can magnify roundoff; a small residual $r=b-A\\hat x$ is strongest when $A$ is well-conditioned; and dense LU costs about $O(n^3)$ operations and $O(n^2)$ memory.</p>",
    "worked": {
      "problem": "Solve $\\begin{bmatrix}2&1\\4&3\\end{bmatrix}x=\\begin{bmatrix}5\\11\\end{bmatrix}$ by elimination and compute the residual.",
      "skills": [
        "elimination",
        "back-substitution",
        "residuals"
      ],
      "strategy": "Eliminate the lower-left entry, back-substitute, then check $b-Ax$.",
      "steps": [
        {
          "do": "Write the equations",
          "result": "$2x_1+x_2=5$ and $4x_1+3x_2=11$",
          "why": "translate the matrix system"
        },
        {
          "do": "Eliminate $x_1$ from the second equation",
          "result": "$(4x_1+3x_2)-2(2x_1+x_2)=11-10$",
          "why": "subtract twice the first equation"
        },
        {
          "do": "Simplify the second equation",
          "result": "$x_2=1$",
          "why": "the $x_1$ terms cancel and $3x_2-2x_2=x_2$"
        },
        {
          "do": "Substitute into the first equation",
          "result": "$2x_1+1=5$",
          "why": "back-substitute the known variable"
        },
        {
          "do": "Solve for $x_1$",
          "result": "$x_1=2$",
          "why": "subtract 1 and divide by 2"
        },
        {
          "do": "Compute $Ax$",
          "result": "$\\begin{bmatrix}2&1\\4&3\\end{bmatrix}\\begin{bmatrix}2\\1\\end{bmatrix}=\\begin{bmatrix}5\\11\\end{bmatrix}$",
          "why": "multiply to verify"
        }
      ],
      "verify": "The residual $b-Ax$ is the zero vector, so the computed solution exactly satisfies the system.",
      "answer": "$x=\\begin{bmatrix}2\\1\\end{bmatrix}$ with residual $\\begin{bmatrix}0\\0\\end{bmatrix}$.",
      "connects": "A direct solve is elimination plus verification, not just a black-box call."
    },
    "practice": [
      {
        "problem": "Solve $3x+y=7$ and $6x+5y=23$ by elimination.",
        "steps": [
          {
            "do": "Double the first equation",
            "result": "$6x+2y=14$",
            "why": "match the $x$ coefficient"
          },
          {
            "do": "Subtract from the second equation",
            "result": "$(6x+5y)-(6x+2y)=23-14$",
            "why": "eliminate $x$"
          },
          {
            "do": "Simplify",
            "result": "$3y=9$",
            "why": "combine like terms"
          },
          {
            "do": "Solve for $y$",
            "result": "$y=3$",
            "why": "divide by 3"
          },
          {
            "do": "Substitute into $3x+y=7$",
            "result": "$3x+3=7$",
            "why": "use the first equation"
          },
          {
            "do": "Solve for $x$",
            "result": "$x=4/3$",
            "why": "subtract 3 and divide by 3"
          }
        ],
        "answer": "$x=4/3$, $y=3$."
      },
      {
        "problem": "For $A=\\begin{bmatrix}1&2\\3&8\\end{bmatrix}$ and $\\hat x=[2,1]^T$, compute the residual for $b=[4,14]^T$.",
        "steps": [
          {
            "do": "Compute the first entry of $A\\hat x$",
            "result": "$1\\cdot2+2\\cdot1=4$",
            "why": "row 1 dot product"
          },
          {
            "do": "Compute the second entry of $A\\hat x$",
            "result": "$3\\cdot2+8\\cdot1=14$",
            "why": "row 2 dot product"
          },
          {
            "do": "Assemble $A\\hat x$",
            "result": "$[4,14]^T$",
            "why": "stack row products"
          },
          {
            "do": "Subtract from $b$",
            "result": "$r=b-A\\hat x=[4,14]^T-[4,14]^T$",
            "why": "definition of residual"
          },
          {
            "do": "Simplify",
            "result": "$r=[0,0]^T$",
            "why": "both entries match"
          }
        ],
        "answer": "The residual is $[0,0]^T$."
      },
      {
        "problem": "A dense LU factorization takes $2$ seconds for $n=1000$. Estimate time for $n=2000$ if cost scales as $n^3$.",
        "steps": [
          {
            "do": "Compute the size ratio",
            "result": "$2000/1000=2$",
            "why": "dimension doubles"
          },
          {
            "do": "Apply cubic scaling",
            "result": "$2^3=8$",
            "why": "LU is roughly cubic"
          },
          {
            "do": "Multiply time",
            "result": "$2\\cdot8=16$",
            "why": "new time estimate"
          },
          {
            "do": "Attach units",
            "result": "$16$ seconds",
            "why": "same timing units"
          },
          {
            "do": "Interpret",
            "result": "doubling size costs about eight times more",
            "why": "cubic growth is steep"
          }
        ],
        "answer": "About $16$ seconds."
      },
      {
        "problem": "Given residual norm $\\|r\\|=10^{-8}$, $\\|b\\|=10$, and $\\kappa(A)=10^5$, estimate relative solution error by $\\kappa(A)\\|r\\|/\\|b\\|$.",
        "steps": [
          {
            "do": "Write the estimate",
            "result": "$10^5\\cdot10^{-8}/10$",
            "why": "substitute into the bound"
          },
          {
            "do": "Combine numerator powers",
            "result": "$10^5\\cdot10^{-8}=10^{-3}$",
            "why": "multiply powers"
          },
          {
            "do": "Divide by $10$",
            "result": "$10^{-3}/10=10^{-4}$",
            "why": "scale by $\\|b\\|$"
          },
          {
            "do": "Convert to percent",
            "result": "$10^{-4}=0.01\\%$",
            "why": "multiply by 100"
          },
          {
            "do": "Interpret",
            "result": "accuracy may be around four digits",
            "why": "conditioning limits what residual implies"
          }
        ],
        "answer": "Estimated relative solution error is $10^{-4}$, or $0.01\\%$."
      },
      {
        "problem": "A solver without pivoting would use pivot $10^{-6}$ in the first row, while another row has candidate pivot $2$. By what factor is the larger pivot bigger, and why swap?",
        "steps": [
          {
            "do": "Form the pivot ratio",
            "result": "$2/10^{-6}$",
            "why": "compare available pivots"
          },
          {
            "do": "Rewrite $2$",
            "result": "$2=2\\cdot10^0$",
            "why": "prepare powers"
          },
          {
            "do": "Divide",
            "result": "$2/10^{-6}=2\\cdot10^6$",
            "why": "moving $10^{-6}$ to denominator multiplies by $10^6$"
          },
          {
            "do": "State the factor",
            "result": "$2{,}000{,}000$",
            "why": "decimal form"
          },
          {
            "do": "Interpret",
            "result": "swap rows",
            "why": "a much larger pivot reduces amplification of roundoff"
          }
        ],
        "answer": "The larger pivot is $2{,}000{,}000$ times bigger, so pivoting is strongly preferred."
      }
    ],
    "applications": [
      {
        "title": "Least-squares normal equations",
        "background": "Some regression pipelines solve linear systems as part of fitting. Direct solvers are reliable for moderate dense problems when conditioning is acceptable.",
        "numbers": "A $100\\times20$ design matrix leads to a $20\\times20$ normal-equation matrix, small enough for dense factorization."
      },
      {
        "title": "Circuit simulation",
        "background": "Modified nodal analysis produces sparse linear systems for voltages and currents. Direct sparse solvers are valued for robustness.",
        "numbers": "A circuit with $5000$ unknown node voltages may have only about $30000$ nonzero matrix entries, far less than $25$ million dense entries."
      },
      {
        "title": "Kalman filtering",
        "background": "State estimation often solves covariance-related linear systems. Factorizations help maintain numerical reliability.",
        "numbers": "Solving a $6\\times6$ system costs on the order of $6^3=216$ basic cubic units, tiny compared with image-scale matrices."
      },
      {
        "title": "Finite-element analysis",
        "background": "Engineering meshes produce linear systems from local stiffness relationships. Direct solvers are common for smaller or especially delicate models.",
        "numbers": "If a mesh has $20000$ degrees of freedom with about $10$ nonzeros per row, sparse storage holds about $200000$ entries."
      },
      {
        "title": "Implicit time stepping",
        "background": "Stiff differential equations often require solving a linear system each time step. Direct solvers can reuse a factorization when the matrix stays fixed.",
        "numbers": "If one factorization costs $8$ seconds and each triangular solve costs $0.02$ seconds, $100$ steps cost about $8+2=10$ seconds."
      },
      {
        "title": "Residual checks in production",
        "background": "Numerical services often log residual norms to catch solver failures before results reach downstream models.",
        "numbers": "If $\\|b\\|=50$ and $\\|r\\|=5\\cdot10^{-7}$, the relative residual is $10^{-8}$."
      }
    ],
    "applicationsClose": "Direct solvers are the dependable workhorses of numerical linear algebra, especially when you pair the answer with pivoting, residuals, and conditioning.",
    "takeaways": [
      "LU factorization rewrites one hard system as two triangular solves.",
      "Pivoting protects elimination from dangerously small pivots.",
      "Residuals measure equation satisfaction; conditioning connects residual to solution accuracy.",
      "Dense direct solvers scale roughly like $O(n^3)$, so size matters quickly."
    ]
  },
  "math-27-05": {
    "id": "math-27-05",
    "title": "Conjugate gradient (CG)",
    "tagline": "Conjugate gradient solves large symmetric positive definite systems by taking mutually respectful search directions.",
    "connections": {
      "buildsOn": [
        "dot products",
        "quadratic forms",
        "Direct linear solvers in practice",
        "orthogonality"
      ],
      "leadsTo": [
        "GMRES",
        "Preconditioning",
        "Lanczos iteration"
      ],
      "usedWith": [
        "symmetric positive definite matrices",
        "Krylov subspaces",
        "residuals",
        "energy norms"
      ]
    },
    "motivation": "<p>You already know steepest descent: move opposite the gradient to reduce a bowl-shaped loss. For solving $Ax=b$ with a symmetric positive definite matrix, the same problem is minimizing a quadratic bowl.</p><p>CG improves on plain steepest descent by remembering directions in a special way. Each new direction is chosen so it does not undo progress made along earlier directions, measured in the geometry of $A$.</p>",
    "definition": "<p><b>Conjugate gradient</b> solves $Ax=b$ when $A$ is symmetric positive definite. It minimizes $\\phi(x)=\\tfrac12 x^T A x-b^T x$ over growing Krylov subspaces. The residual is $r_k=b-Ax_k$, and the search directions satisfy $p_i^T A p_j=0$ for $i\\ne j$.</p><p>The step length comes from minimizing along $x_k+\\u0007lpha p_k$. Setting the derivative of $\\phi(x_k+\\u0007lpha p_k)$ to zero gives $\\u0007lpha_k=(r_k^T r_k)/(p_k^T A p_k)$ for the standard CG recurrence. This is why each step is a one-dimensional exact minimization inside a smarter sequence of directions.</p><p><b>Assumptions that matter:</b> $A$ must be symmetric positive definite; convergence depends strongly on the condition number; exact arithmetic would finish in at most $n$ steps, while floating-point arithmetic usually stops by tolerance; and matrix-vector products are the main cost.</p>",
    "worked": {
      "problem": "Run one CG step for $A=\\begin{bmatrix}4&1\\1&3\\end{bmatrix}$, $b=\\begin{bmatrix}1\\2\\end{bmatrix}$, and $x_0=\\begin{bmatrix}0\\0\\end{bmatrix}$.",
      "skills": [
        "residuals",
        "CG step length",
        "matrix-vector products"
      ],
      "strategy": "Start with $r_0=b-Ax_0$ and $p_0=r_0$, then compute the exact step length.",
      "steps": [
        {
          "do": "Compute the initial residual",
          "result": "$r_0=b-Ax_0=\\begin{bmatrix}1\\2\\end{bmatrix}$",
          "why": "$Ax_0=0$"
        },
        {
          "do": "Set the first direction",
          "result": "$p_0=r_0=\\begin{bmatrix}1\\2\\end{bmatrix}$",
          "why": "CG starts in the residual direction"
        },
        {
          "do": "Compute $Ap_0$",
          "result": "$\\begin{bmatrix}4&1\\1&3\\end{bmatrix}\\begin{bmatrix}1\\2\\end{bmatrix}=\\begin{bmatrix}6\\7\\end{bmatrix}$",
          "why": "matrix-vector product"
        },
        {
          "do": "Compute $r_0^T r_0$",
          "result": "$1^2+2^2=5$",
          "why": "numerator of $\\u0007lpha_0$"
        },
        {
          "do": "Compute $p_0^T A p_0$",
          "result": "$[1,2]\\cdot[6,7]=20$",
          "why": "denominator of $\\u0007lpha_0$"
        },
        {
          "do": "Compute the step length",
          "result": "$\\u0007lpha_0=5/20=0.25$",
          "why": "divide numerator by denominator"
        },
        {
          "do": "Update $x$",
          "result": "$x_1=x_0+0.25p_0=\\begin{bmatrix}0.25\\0.5\\end{bmatrix}$",
          "why": "move along the search direction"
        }
      ],
      "verify": "The quadratic should decrease because $A$ is positive definite and $\\u0007lpha_0$ minimizes along $p_0$.",
      "answer": "After one CG step, $x_1=\\begin{bmatrix}0.25\\0.5\\end{bmatrix}$.",
      "connects": "CG combines residual information with the geometry of $A$ to choose productive directions."
    },
    "practice": [
      {
        "problem": "For $A=\\begin{bmatrix}2&0\\0&8\\end{bmatrix}$, compute $x^TAx$ for $x=[3,1]^T$ and decide whether this example supports positive definiteness.",
        "steps": [
          {
            "do": "Compute $Ax$",
            "result": "$[6,8]^T$",
            "why": "multiply by the diagonal matrix"
          },
          {
            "do": "Compute the dot product",
            "result": "$x^TAx=[3,1]\\cdot[6,8]$",
            "why": "definition of quadratic form"
          },
          {
            "do": "Multiply entries",
            "result": "$3\\cdot6+1\\cdot8=26$",
            "why": "sum products"
          },
          {
            "do": "Compare with zero",
            "result": "$26>0$",
            "why": "positive for this nonzero vector"
          },
          {
            "do": "Interpret",
            "result": "supports positive definiteness",
            "why": "a diagonal matrix with positive diagonal entries is SPD"
          }
        ],
        "answer": "$x^TAx=26$, and the positive diagonal matrix is SPD."
      },
      {
        "problem": "Given residual $r=[2,-1,2]^T$, compute $r^Tr$ and the residual norm.",
        "steps": [
          {
            "do": "Square the first entry",
            "result": "$2^2=4$",
            "why": "part of $r^Tr$"
          },
          {
            "do": "Square the second entry",
            "result": "$(-1)^2=1$",
            "why": "squares are nonnegative"
          },
          {
            "do": "Square the third entry",
            "result": "$2^2=4$",
            "why": "last contribution"
          },
          {
            "do": "Add the squares",
            "result": "$r^Tr=4+1+4=9$",
            "why": "dot product with itself"
          },
          {
            "do": "Take the square root",
            "result": "$\\|r\\|=3$",
            "why": "Euclidean norm"
          }
        ],
        "answer": "$r^Tr=9$ and $\\|r\\|=3$."
      },
      {
        "problem": "If CG reduces the $A$-norm error by a factor $0.2$ every iteration, how many iterations reduce error from $10$ to below $0.1$?",
        "steps": [
          {
            "do": "Write the model",
            "result": "$E_k=10(0.2)^k$",
            "why": "geometric decay"
          },
          {
            "do": "Set the target inequality",
            "result": "$10(0.2)^k<0.1$",
            "why": "want error below $0.1$"
          },
          {
            "do": "Divide by $10$",
            "result": "$(0.2)^k<0.01$",
            "why": "isolate the decay factor"
          },
          {
            "do": "Test $k=2$",
            "result": "$(0.2)^2=0.04$",
            "why": "not small enough"
          },
          {
            "do": "Test $k=3$",
            "result": "$(0.2)^3=0.008$",
            "why": "below $0.01$"
          }
        ],
        "answer": "Three iterations are enough under this model."
      },
      {
        "problem": "For direction $p=[1,1]^T$ and $A=\\begin{bmatrix}3&0\\0&1\\end{bmatrix}$, compute $p^TAp$.",
        "steps": [
          {
            "do": "Compute $Ap$",
            "result": "$[3,1]^T$",
            "why": "scale by the diagonal"
          },
          {
            "do": "Write $p^TAp$",
            "result": "$[1,1]\\cdot[3,1]$",
            "why": "dot product"
          },
          {
            "do": "Multiply entries",
            "result": "$1\\cdot3+1\\cdot1$",
            "why": "pair matching components"
          },
          {
            "do": "Add",
            "result": "$4$",
            "why": "sum products"
          },
          {
            "do": "Interpret positivity",
            "result": "$4>0$",
            "why": "valid denominator for a CG step"
          }
        ],
        "answer": "$p^TAp=4$."
      },
      {
        "problem": "A sparse SPD matrix has $10^6$ rows and $7$ nonzeros per row. One CG iteration uses one matrix-vector product. Estimate the number of multiply operations for $40$ iterations.",
        "steps": [
          {
            "do": "Count nonzeros",
            "result": "$10^6\\cdot7=7\\cdot10^6$",
            "why": "one multiply per nonzero in a sparse matvec"
          },
          {
            "do": "Assign per-iteration multiplies",
            "result": "$7\\cdot10^6$",
            "why": "one matvec per iteration"
          },
          {
            "do": "Multiply by iterations",
            "result": "$40\\cdot7\\cdot10^6$",
            "why": "forty iterations"
          },
          {
            "do": "Compute",
            "result": "$280\\cdot10^6=2.8\\cdot10^8$",
            "why": "combine factors"
          },
          {
            "do": "Interpret",
            "result": "about $280$ million multiplies",
            "why": "sparse iterative methods scale with nonzeros"
          }
        ],
        "answer": "About $2.8\\cdot10^8$ multiply operations."
      }
    ],
    "applications": [
      {
        "title": "Poisson equations",
        "background": "Discretized diffusion and pressure problems often create sparse SPD systems, a natural home for CG.",
        "numbers": "A $1000\\times1000$ grid has $10^6$ unknowns; with about $5$ nonzeros per row, one matvec uses about $5\\cdot10^6$ multiplies."
      },
      {
        "title": "Kernel methods",
        "background": "Some kernel ridge regression systems are symmetric positive definite after regularization. CG can avoid forming expensive factorizations.",
        "numbers": "Adding $\\lambda I$ with $\\lambda=0.1$ shifts eigenvalues from $[0.01,5]$ to $[0.11,5.1]$, improving conditioning."
      },
      {
        "title": "Graph Laplacian solves",
        "background": "Graph-based learning and ranking use Laplacian systems, often symmetric and positive semidefinite until anchored or regularized.",
        "numbers": "A graph with $2$ million edges gives roughly $4$ million off-diagonal nonzeros plus diagonals in a sparse Laplacian."
      },
      {
        "title": "Implicit diffusion steps",
        "background": "Heat and smoothing equations can require solving SPD systems at each time step. CG uses only matrix-vector products.",
        "numbers": "If each CG solve takes $25$ iterations and each matvec is $0.004$ seconds, matvec time is about $0.1$ seconds per step."
      },
      {
        "title": "Large least-squares subproblems",
        "background": "Optimization methods sometimes solve normal-equation-like SPD systems approximately. CG is useful when exact solves are unnecessary.",
        "numbers": "If tolerance $10^{-4}$ needs $30$ iterations but $10^{-8}$ needs $90$, the looser solve saves two thirds of iterations."
      },
      {
        "title": "Preconditioned training objectives",
        "background": "Second-order ML methods may use CG to compute approximate Newton steps without forming a dense Hessian.",
        "numbers": "A Hessian-vector product for $10^7$ parameters can be used inside CG without storing a $10^7\\times10^7$ matrix."
      }
    ],
    "applicationsClose": "CG is powerful because it asks for matrix-vector products, not dense factorizations, while still using the geometry of a positive definite system.",
    "takeaways": [
      "CG applies to symmetric positive definite systems.",
      "Each step minimizes the quadratic along an $A$-conjugate direction.",
      "The residual $r=b-Ax$ drives the iteration and stopping rule.",
      "Conditioning and preconditioning often decide whether CG is fast in practice."
    ]
  },
  "math-27-06": {
    "id": "math-27-06",
    "title": "GMRES",
    "tagline": "GMRES tackles nonsymmetric linear systems by choosing the Krylov approximation with the smallest residual.",
    "connections": {
      "buildsOn": [
        "matrix-vector products",
        "residuals",
        "least squares",
        "Conjugate gradient (CG)"
      ],
      "leadsTo": [
        "Preconditioning",
        "Power iteration",
        "Lanczos iteration"
      ],
      "usedWith": [
        "Krylov subspaces",
        "Arnoldi iteration",
        "least-squares minimization",
        "orthogonality"
      ]
    },
    "motivation": "<p>CG is wonderfully efficient when the matrix is symmetric positive definite. But many real systems from transport, circuits, and linearized dynamics are nonsymmetric. The old assumptions no longer fit.</p><p>GMRES keeps the Krylov spirit: build approximations from $r_0, Ar_0, A^2r_0,\\ldots$. Its promise is simple to state and very practical: among the candidates in the current Krylov subspace, choose the one with the smallest residual norm.</p>",
    "definition": "<p><b>GMRES</b>, the generalized minimal residual method, solves $Ax=b$ by searching $x_k=x_0+q$ with $q\\in\\mathcal{K}_k(A,r_0)=\\operatorname{span}\\{r_0,Ar_0,\\ldots,A^{k-1}r_0\\}$ and minimizing $\\|b-Ax_k\\|_2$.</p><p>Arnoldi iteration builds an orthonormal basis $V_k$ for the Krylov subspace and a small Hessenberg matrix $H_k$ satisfying approximately $AV_k=V_{k+1}H_k$. Then the large residual minimization becomes a small least-squares problem in $k$ variables.</p><p><b>Assumptions that matter:</b> GMRES can handle nonsymmetric matrices, but storage and orthogonalization costs grow with iteration count; restarted GMRES limits memory but may slow convergence; and preconditioning is often essential for hard systems.</p>",
    "worked": {
      "problem": "With $x_0=0$, $b=[1,0]^T$, and $A=\\begin{bmatrix}1&2\\0&3\\end{bmatrix}$, find the first Krylov vector direction and the one-dimensional residual-minimizing step $x_1=\\u0007lpha b$.",
      "skills": [
        "Krylov subspaces",
        "residual minimization",
        "one-dimensional least squares"
      ],
      "strategy": "The first Krylov subspace is the span of $b$; minimize $\\|b-A(\\u0007lpha b)\\|^2$ over one scalar.",
      "steps": [
        {
          "do": "Compute the initial residual",
          "result": "$r_0=b-Ax_0=[1,0]^T$",
          "why": "$x_0=0$ makes $Ax_0=0$"
        },
        {
          "do": "State the first subspace",
          "result": "$\\mathcal{K}_1=\\operatorname{span}\\{[1,0]^T\\}$",
          "why": "GMRES starts from the residual"
        },
        {
          "do": "Write the candidate",
          "result": "$x_1=\\u0007lpha[1,0]^T$",
          "why": "one scalar parameter in the first subspace"
        },
        {
          "do": "Compute $Ax_1$",
          "result": "$A[\\u0007lpha,0]^T=[\\u0007lpha,0]^T$",
          "why": "multiply by the first column direction"
        },
        {
          "do": "Compute the residual",
          "result": "$b-Ax_1=[1-\\u0007lpha,0]^T$",
          "why": "subtract the candidate prediction"
        },
        {
          "do": "Minimize the norm",
          "result": "$\\|b-Ax_1\\|=|1-\\u0007lpha|$",
          "why": "the norm is smallest when the entry is zero"
        },
        {
          "do": "Choose $\\u0007lpha$",
          "result": "$\\u0007lpha=1$",
          "why": "this makes the residual zero"
        }
      ],
      "verify": "With $x_1=[1,0]^T$, $Ax_1=[1,0]^T=b$, so the residual is exactly zero.",
      "answer": "The first direction is $[1,0]^T$, and GMRES chooses $x_1=[1,0]^T$ here.",
      "connects": "GMRES is built around residual minimization over a Krylov subspace."
    },
    "practice": [
      {
        "problem": "For $r=[3,4]^T$, compute the residual norm GMRES tries to minimize.",
        "steps": [
          {
            "do": "Square the first entry",
            "result": "$3^2=9$",
            "why": "Euclidean norm"
          },
          {
            "do": "Square the second entry",
            "result": "$4^2=16$",
            "why": "Euclidean norm"
          },
          {
            "do": "Add squares",
            "result": "$9+16=25$",
            "why": "norm squared"
          },
          {
            "do": "Take the square root",
            "result": "$\\sqrt{25}=5$",
            "why": "norm"
          },
          {
            "do": "Interpret",
            "result": "residual size is $5$",
            "why": "GMRES seeks smaller residual norms"
          }
        ],
        "answer": "$\\|r\\|_2=5$."
      },
      {
        "problem": "If restarted GMRES stores $m=30$ basis vectors of length $n=100000$, how many floating-point numbers are stored for the basis?",
        "steps": [
          {
            "do": "Identify vector length",
            "result": "$100000$",
            "why": "each basis vector has one entry per unknown"
          },
          {
            "do": "Identify number of vectors",
            "result": "$30$",
            "why": "restart length"
          },
          {
            "do": "Multiply",
            "result": "$30\\cdot100000=3000000$",
            "why": "basis storage count"
          },
          {
            "do": "Write in scientific notation",
            "result": "$3\\cdot10^6$",
            "why": "compact form"
          },
          {
            "do": "Interpret",
            "result": "three million numbers",
            "why": "memory grows with restart length"
          }
        ],
        "answer": "The basis stores $3\\cdot10^6$ floating-point numbers."
      },
      {
        "problem": "A GMRES residual decreases from $10^{-1}$ to $10^{-3}$ in one restart cycle. What factor reduction is that?",
        "steps": [
          {
            "do": "Form the ratio",
            "result": "$10^{-3}/10^{-1}$",
            "why": "new residual over old residual"
          },
          {
            "do": "Subtract exponents",
            "result": "$10^{-2}$",
            "why": "divide powers of ten"
          },
          {
            "do": "Convert",
            "result": "$10^{-2}=0.01$",
            "why": "decimal form"
          },
          {
            "do": "Find reduction factor",
            "result": "$1/0.01=100$",
            "why": "old residual is 100 times larger"
          },
          {
            "do": "Interpret",
            "result": "two orders of magnitude",
            "why": "each order is a factor of 10"
          }
        ],
        "answer": "The residual was reduced by a factor of $100$."
      },
      {
        "problem": "Let $q_1=[1,0]^T$ and $v=[2,3]^T$. Orthogonalize $v$ against $q_1$.",
        "steps": [
          {
            "do": "Compute the projection coefficient",
            "result": "$q_1^Tv=2$",
            "why": "dot with the unit basis vector"
          },
          {
            "do": "Compute the projection",
            "result": "$2q_1=[2,0]^T$",
            "why": "component along $q_1$"
          },
          {
            "do": "Subtract the projection",
            "result": "$v-2q_1=[0,3]^T$",
            "why": "remove the old direction"
          },
          {
            "do": "Compute the norm",
            "result": "$\\|[0,3]^T\\|=3$",
            "why": "needed to normalize"
          },
          {
            "do": "Normalize",
            "result": "$q_2=[0,1]^T$",
            "why": "divide by 3"
          }
        ],
        "answer": "The orthogonal component is $[0,3]^T$, and the normalized vector is $[0,1]^T$."
      },
      {
        "problem": "A nonsymmetric sparse system has $5\\cdot10^5$ nonzeros. GMRES(20) takes $60$ iterations. Estimate matvec multiply count.",
        "steps": [
          {
            "do": "Assign multiplies per matvec",
            "result": "$5\\cdot10^5$",
            "why": "one multiply per nonzero"
          },
          {
            "do": "Count iterations",
            "result": "$60$",
            "why": "one main matvec per iteration"
          },
          {
            "do": "Multiply",
            "result": "$60\\cdot5\\cdot10^5$",
            "why": "total matvec multiplies"
          },
          {
            "do": "Compute",
            "result": "$300\\cdot10^5=3\\cdot10^7$",
            "why": "combine factors"
          },
          {
            "do": "Interpret",
            "result": "about $30$ million multiplies",
            "why": "orthogonalization adds more work beyond this"
          }
        ],
        "answer": "About $3\\cdot10^7$ matvec multiplies, plus orthogonalization overhead."
      }
    ],
    "applications": [
      {
        "title": "Advection-diffusion equations",
        "background": "Transport terms make discretized PDE matrices nonsymmetric. GMRES is a standard Krylov method for these systems.",
        "numbers": "If a matrix has $2\\cdot10^6$ nonzeros, each GMRES matvec uses about $2\\cdot10^6$ multiplications."
      },
      {
        "title": "Circuit and device simulation",
        "background": "Linearized circuit equations can be nonsymmetric and sparse. GMRES works with matrix-vector products and preconditioners.",
        "numbers": "A residual drop from $10^{-2}$ to $10^{-8}$ is a factor of $10^6$, often a practical convergence target."
      },
      {
        "title": "Implicit neural differential equations",
        "background": "Solving implicit layers can require nonsymmetric linear solves inside Newton or fixed-point methods.",
        "numbers": "If each solve uses $15$ GMRES iterations and each Jacobian-vector product takes $4$ ms, matvec time is $60$ ms."
      },
      {
        "title": "Restart tradeoffs",
        "background": "Full GMRES stores every basis vector, so restarted GMRES limits memory. The tradeoff is that old search information is discarded.",
        "numbers": "With $n=10^6$ and restart $m=50$, the basis holds $5\\cdot10^7$ numbers."
      },
      {
        "title": "Least-squares viewpoint",
        "background": "GMRES reduces a large linear solve to a small least-squares problem at each iteration. That is why residual minimization is explicit.",
        "numbers": "At iteration $k=20$, the small problem has about $21$ rows and $20$ columns."
      },
      {
        "title": "Preconditioned solvers",
        "background": "Production GMRES is commonly paired with a preconditioner that makes the transformed system easier.",
        "numbers": "If preconditioning cuts iterations from $200$ to $40$ while doubling per-iteration cost, the rough work becomes $80/200=40\\%$ of the original."
      }
    ],
    "applicationsClose": "GMRES is the nonsymmetric Krylov workhorse: build a good subspace, solve a small least-squares problem, and keep the residual in view.",
    "takeaways": [
      "GMRES minimizes the residual norm over a Krylov subspace.",
      "Arnoldi iteration builds the orthonormal basis used by GMRES.",
      "Storage grows with iteration count, motivating restarted GMRES.",
      "Preconditioning often determines whether GMRES is practical."
    ]
  },
  "math-27-07": {
    "id": "math-27-07",
    "title": "Preconditioning",
    "tagline": "Preconditioning changes the coordinates of a hard linear system so an iterative solver sees an easier one.",
    "connections": {
      "buildsOn": [
        "condition numbers",
        "Direct linear solvers in practice",
        "Conjugate gradient (CG)",
        "GMRES"
      ],
      "leadsTo": [
        "Power iteration",
        "The QR algorithm",
        "Lanczos iteration"
      ],
      "usedWith": [
        "matrix factorizations",
        "spectral clustering",
        "Krylov methods",
        "scaling"
      ]
    },
    "motivation": "<p>You already know that the same path can feel steep or gentle depending on the coordinate scale of the map. Linear systems behave similarly: a solver may struggle not because the answer is strange, but because the coordinates make the problem lopsided.</p><p>A preconditioner is a helpful change of viewpoint. It does not change the true solution of $Ax=b$; it changes the system an iterative method works with so residuals shrink faster.</p>",
    "definition": "<p>A <b>preconditioner</b> is a matrix $M$ chosen so $M^{-1}A$ or $AM^{-1}$ is easier for an iterative method than $A$, while applying $M^{-1}$ is cheap. Left preconditioning solves $M^{-1}Ax=M^{-1}b$; right preconditioning solves $AM^{-1}y=b$ and then $x=M^{-1}y$.</p><p>The goal is usually to cluster eigenvalues or reduce the condition number. For SPD systems, CG convergence improves when $\\kappa(M^{-1}A)$ is much smaller than $\\kappa(A)$. A diagonal preconditioner uses $M=\\operatorname{diag}(A)$, which is simple but sometimes surprisingly helpful.</p><p><b>Assumptions that matter:</b> applying the preconditioner must be cheaper than the iterations it saves; the preconditioned system should preserve the solver's required structure; and a preconditioner can improve convergence while slightly increasing per-iteration cost.</p>",
    "worked": {
      "problem": "For $A=\\begin{bmatrix}100&0\\0&1\\end{bmatrix}$, use the diagonal preconditioner $M=\\operatorname{diag}(A)$. Compute $M^{-1}A$ and compare condition numbers.",
      "skills": [
        "diagonal scaling",
        "condition numbers",
        "preconditioned systems"
      ],
      "strategy": "Invert the diagonal preconditioner, multiply, then compare eigenvalue ratios.",
      "steps": [
        {
          "do": "Write the preconditioner",
          "result": "$M=\\begin{bmatrix}100&0\\0&1\\end{bmatrix}$",
          "why": "the diagonal of $A$"
        },
        {
          "do": "Compute its inverse",
          "result": "$M^{-1}=\\begin{bmatrix}0.01&0\\0&1\\end{bmatrix}$",
          "why": "invert each diagonal entry"
        },
        {
          "do": "Multiply $M^{-1}A$",
          "result": "$\\begin{bmatrix}0.01&0\\0&1\\end{bmatrix}\\begin{bmatrix}100&0\\0&1\\end{bmatrix}=\\begin{bmatrix}1&0\\0&1\\end{bmatrix}$",
          "why": "diagonal entries multiply"
        },
        {
          "do": "Compute $\\kappa(A)$",
          "result": "$100/1=100$",
          "why": "condition number is largest over smallest eigenvalue"
        },
        {
          "do": "Compute $\\kappa(M^{-1}A)$",
          "result": "$1/1=1$",
          "why": "the preconditioned matrix is the identity"
        },
        {
          "do": "Compare",
          "result": "$100$ becomes $1$",
          "why": "the scaled system is perfectly conditioned"
        }
      ],
      "verify": "The solution is unchanged because multiplying both sides by $M^{-1}$ preserves equality for invertible $M$.",
      "answer": "$M^{-1}A=I$, and the condition number improves from $100$ to $1$.",
      "connects": "A good preconditioner reshapes the system seen by the iterative solver."
    },
    "practice": [
      {
        "problem": "For diagonal $A=\\operatorname{diag}(9,3)$, compute the Jacobi preconditioned matrix.",
        "steps": [
          {
            "do": "Choose $M$",
            "result": "$M=\\operatorname{diag}(9,3)$",
            "why": "Jacobi uses the diagonal"
          },
          {
            "do": "Invert $M$",
            "result": "$M^{-1}=\\operatorname{diag}(1/9,1/3)$",
            "why": "invert diagonal entries"
          },
          {
            "do": "Multiply",
            "result": "$M^{-1}A=\\operatorname{diag}(1,1)$",
            "why": "entrywise diagonal product"
          },
          {
            "do": "Name the result",
            "result": "$I$",
            "why": "identity matrix"
          },
          {
            "do": "Interpret",
            "result": "condition number $1$",
            "why": "all eigenvalues are equal"
          }
        ],
        "answer": "The Jacobi preconditioned matrix is the identity."
      },
      {
        "problem": "A solver needs $300$ iterations without preconditioning. A preconditioner makes each iteration twice as expensive but reduces iterations to $80$. What is the work ratio?",
        "steps": [
          {
            "do": "Set unpreconditioned work",
            "result": "$300\\cdot1=300$",
            "why": "one cost unit per iteration"
          },
          {
            "do": "Set preconditioned work",
            "result": "$80\\cdot2=160$",
            "why": "twice the cost for 80 iterations"
          },
          {
            "do": "Form ratio",
            "result": "$160/300$",
            "why": "new work over old work"
          },
          {
            "do": "Approximate",
            "result": "$160/300\\approx0.533$",
            "why": "divide"
          },
          {
            "do": "Interpret",
            "result": "about $53\\%$ of original work",
            "why": "preconditioning pays off"
          }
        ],
        "answer": "The preconditioned run uses about $53\\%$ of the original work."
      },
      {
        "problem": "If eigenvalues of $A$ lie in $[1,1000]$ and preconditioned eigenvalues lie in $[0.5,2]$, compare condition numbers.",
        "steps": [
          {
            "do": "Compute original condition number",
            "result": "$1000/1=1000$",
            "why": "largest over smallest"
          },
          {
            "do": "Compute preconditioned condition number",
            "result": "$2/0.5=4$",
            "why": "largest over smallest"
          },
          {
            "do": "Form improvement factor",
            "result": "$1000/4=250$",
            "why": "old divided by new"
          },
          {
            "do": "Interpret clustering",
            "result": "eigenvalues are much closer",
            "why": "iterative methods usually converge faster"
          },
          {
            "do": "State result",
            "result": "condition number improves by factor $250$",
            "why": "quantify the change"
          }
        ],
        "answer": "$\\kappa$ improves from $1000$ to $4$, a factor of $250$."
      },
      {
        "problem": "For $A=\\begin{bmatrix}4&1\\1&9\\end{bmatrix}$ and Jacobi $M=\\operatorname{diag}(4,9)$, compute $M^{-1}b$ for $b=[8,18]^T$.",
        "steps": [
          {
            "do": "Write $M^{-1}$",
            "result": "$\\operatorname{diag}(1/4,1/9)$",
            "why": "invert diagonal entries"
          },
          {
            "do": "Apply to first entry",
            "result": "$(1/4)\\cdot8=2$",
            "why": "scale by first inverse diagonal"
          },
          {
            "do": "Apply to second entry",
            "result": "$(1/9)\\cdot18=2$",
            "why": "scale by second inverse diagonal"
          },
          {
            "do": "Assemble",
            "result": "$M^{-1}b=[2,2]^T$",
            "why": "stack entries"
          },
          {
            "do": "Interpret",
            "result": "right-hand side is scaled",
            "why": "left preconditioning scales equations"
          }
        ],
        "answer": "$M^{-1}b=[2,2]^T$."
      },
      {
        "problem": "An incomplete factorization costs $5$ seconds to build and reduces solve time from $40$ seconds to $9$ seconds per right-hand side. How many right-hand sides are needed to save time?",
        "steps": [
          {
            "do": "Compute per-solve savings",
            "result": "$40-9=31$ seconds",
            "why": "benefit after setup"
          },
          {
            "do": "Set break-even inequality",
            "result": "$31m>5$",
            "why": "savings for $m$ solves must exceed setup"
          },
          {
            "do": "Divide",
            "result": "$m>5/31\\approx0.161$",
            "why": "solve for number of right-hand sides"
          },
          {
            "do": "Round to whole solves",
            "result": "$m=1$",
            "why": "one solve is enough"
          },
          {
            "do": "Check",
            "result": "$5+9=14<40$",
            "why": "preconditioned total for one solve is smaller"
          }
        ],
        "answer": "Even one right-hand side saves time: $14$ seconds versus $40$ seconds."
      }
    ],
    "applications": [
      {
        "title": "Diagonal feature scaling",
        "background": "Standardizing ML features is a preconditioning idea in optimization clothing: make coordinates have comparable scale.",
        "numbers": "Features with standard deviations $100$ and $2$ become unit-scale after dividing by $100$ and $2$."
      },
      {
        "title": "Jacobi preconditioning",
        "background": "The simplest linear-system preconditioner rescales equations by diagonal entries. It is cheap and often a useful baseline.",
        "numbers": "A diagonal entry $50$ turns equation residual $5$ into scaled residual $0.1$ after multiplying by $1/50$."
      },
      {
        "title": "Incomplete LU",
        "background": "Sparse direct factorization can be approximated to form a preconditioner. The incomplete factors are cheaper than exact LU.",
        "numbers": "If ILU has $4\\cdot10^6$ stored entries instead of $40\\cdot10^6$ for full fill-in, memory drops by a factor of $10$."
      },
      {
        "title": "Multigrid as preconditioning",
        "background": "PDE solvers use coarse grids to remove low-frequency error that simple smoothers handle poorly. As a preconditioner, multigrid can make iteration counts nearly size-independent.",
        "numbers": "If grids of $10^5$ and $10^6$ unknowns both need about $12$ iterations, scaling is close to linear in unknowns."
      },
      {
        "title": "Natural gradient methods",
        "background": "Some ML optimizers precondition gradients with curvature information so steps are measured in a better geometry.",
        "numbers": "For gradient $[10,1]$ and diagonal preconditioner $[0.1,1]$, the scaled step becomes $[1,1]$."
      },
      {
        "title": "Whitening in statistics",
        "background": "Whitening transforms correlated variables so covariance becomes closer to identity, a statistical form of preconditioning.",
        "numbers": "A variance $25$ coordinate divided by standard deviation $5$ becomes variance $1$."
      }
    ],
    "applicationsClose": "Preconditioning is the practical art of making the same solution easier for an algorithm to reach.",
    "takeaways": [
      "A preconditioner transforms the system without changing the desired solution.",
      "Good preconditioners reduce condition numbers or cluster eigenvalues.",
      "The setup and application cost must be worth the iterations saved.",
      "Scaling, whitening, and curvature adjustment are preconditioning ideas across ML and scientific computing."
    ]
  },
  "math-27-08": {
    "id": "math-27-08",
    "title": "Power iteration",
    "tagline": "Power iteration finds a dominant eigenvector by repeatedly applying a matrix and renormalizing what survives.",
    "connections": {
      "buildsOn": [
        "matrix-vector multiplication",
        "eigenvalues and eigenvectors",
        "Vectorization",
        "Preconditioning"
      ],
      "leadsTo": [
        "The QR algorithm",
        "Lanczos iteration",
        "spectral methods"
      ],
      "usedWith": [
        "eigenvectors",
        "normalization",
        "spectral gap",
        "Rayleigh quotient"
      ]
    },
    "motivation": "<p>You already know that repeatedly multiplying by $2$ eventually dominates repeatedly multiplying by $0.5$. Power iteration applies that idea to matrices: components in the strongest eigenvector direction grow fastest.</p><p>The method is almost humbly simple. Multiply by the matrix, rescale to avoid overflow, and repeat. When one eigenvalue is clearly largest in magnitude, the direction left standing points to its eigenvector.</p>",
    "definition": "<p><b>Power iteration</b> starts with a nonzero vector $v_0$ and repeats $w_{k+1}=Av_k$, $v_{k+1}=w_{k+1}/\\|w_{k+1}\\|$. If $A$ has a dominant eigenvalue $|\\lambda_1|>|\\lambda_2|\\ge\\cdots$ and $v_0$ has some component in the dominant eigenvector direction, then $v_k$ approaches that eigenvector direction.</p><p>The reason is eigenvector expansion. If $v_0=c_1q_1+c_2q_2+\\cdots$, then $A^kv_0=c_1\\lambda_1^kq_1+c_2\\lambda_2^kq_2+\\cdots$. Dividing by $\\lambda_1^k$ leaves the other terms scaled by $(\\lambda_i/\\lambda_1)^k$, which shrink when $|\\lambda_i|<|\\lambda_1|$.</p><p><b>Assumptions that matter:</b> there should be a unique dominant eigenvalue in magnitude; the start vector must not be orthogonal to the dominant direction; convergence speed depends on $|\\lambda_2/\\lambda_1|$; and normalization changes length, not direction.</p>",
    "worked": {
      "problem": "Apply two normalized power-iteration steps to $A=\\begin{bmatrix}2&0\\0&1\\end{bmatrix}$ starting from $v_0=\\begin{bmatrix}1\\1\\end{bmatrix}$ using max-entry normalization.",
      "skills": [
        "matrix-vector products",
        "normalization",
        "dominant eigenvectors"
      ],
      "strategy": "Multiply by $A$, then divide by the largest absolute entry after each step.",
      "steps": [
        {
          "do": "Compute the first product",
          "result": "$w_1=Av_0=\\begin{bmatrix}2\\1\\end{bmatrix}$",
          "why": "the diagonal scales each component"
        },
        {
          "do": "Find the largest absolute entry",
          "result": "$\\max |w_1|=2$",
          "why": "max-entry normalization"
        },
        {
          "do": "Normalize the first vector",
          "result": "$v_1=\\begin{bmatrix}1\\0.5\\end{bmatrix}$",
          "why": "divide both entries by 2"
        },
        {
          "do": "Compute the second product",
          "result": "$w_2=Av_1=\\begin{bmatrix}2\\0.5\\end{bmatrix}$",
          "why": "multiply by $A$ again"
        },
        {
          "do": "Find the largest absolute entry",
          "result": "$\\max |w_2|=2$",
          "why": "normalization scale"
        },
        {
          "do": "Normalize the second vector",
          "result": "$v_2=\\begin{bmatrix}1\\0.25\\end{bmatrix}$",
          "why": "divide both entries by 2"
        }
      ],
      "verify": "The second component shrinks from $1$ to $0.5$ to $0.25$, so the direction is moving toward $[1,0]^T$.",
      "answer": "$v_1=[1,0.5]^T$ and $v_2=[1,0.25]^T$, approaching the dominant eigenvector $[1,0]^T$.",
      "connects": "Power iteration amplifies the component associated with the largest eigenvalue."
    },
    "practice": [
      {
        "problem": "For $A=\\operatorname{diag}(5,2)$ and $v_0=[1,1]^T$, compute $A^2v_0$ before normalization.",
        "steps": [
          {
            "do": "Compute $Av_0$",
            "result": "$[5,2]^T$",
            "why": "diagonal scaling"
          },
          {
            "do": "Apply $A$ again",
            "result": "$A[5,2]^T=[25,4]^T$",
            "why": "scale each component again"
          },
          {
            "do": "Identify dominant growth",
            "result": "$25$ versus $4$",
            "why": "the eigenvalue 5 grows faster"
          },
          {
            "do": "Form component ratio",
            "result": "$4/25=0.16$",
            "why": "second component relative to first"
          },
          {
            "do": "Interpret",
            "result": "direction is closer to $[1,0]^T$",
            "why": "dominant component is taking over"
          }
        ],
        "answer": "$A^2v_0=[25,4]^T$."
      },
      {
        "problem": "If $|\\lambda_2/\\lambda_1|=0.1$, how much is a non-dominant component reduced after $4$ iterations?",
        "steps": [
          {
            "do": "Write the factor",
            "result": "$(0.1)^4$",
            "why": "error components shrink by the eigenvalue ratio power"
          },
          {
            "do": "Square once",
            "result": "$(0.1)^2=0.01$",
            "why": "two iterations"
          },
          {
            "do": "Square again",
            "result": "$(0.01)^2=0.0001$",
            "why": "four iterations"
          },
          {
            "do": "Write as power of ten",
            "result": "$10^{-4}$",
            "why": "compact notation"
          },
          {
            "do": "Interpret",
            "result": "ten-thousand-fold reduction",
            "why": "a large spectral gap converges quickly"
          }
        ],
        "answer": "The component is reduced by $10^{-4}$."
      },
      {
        "problem": "Compute the Rayleigh quotient $v^TAv/(v^Tv)$ for $A=\\begin{bmatrix}3&0\\0&1\\end{bmatrix}$ and $v=[1,1]^T$.",
        "steps": [
          {
            "do": "Compute $Av$",
            "result": "$[3,1]^T$",
            "why": "matrix-vector product"
          },
          {
            "do": "Compute numerator",
            "result": "$v^TAv=[1,1]\\cdot[3,1]=4$",
            "why": "dot product"
          },
          {
            "do": "Compute denominator",
            "result": "$v^Tv=1^2+1^2=2$",
            "why": "norm squared"
          },
          {
            "do": "Divide",
            "result": "$4/2=2$",
            "why": "Rayleigh quotient"
          },
          {
            "do": "Interpret",
            "result": "$2$ lies between eigenvalues $1$ and $3$",
            "why": "reasonable estimate"
          }
        ],
        "answer": "The Rayleigh quotient is $2$."
      },
      {
        "problem": "Normalize $w=[3,4]^T$ to unit Euclidean norm.",
        "steps": [
          {
            "do": "Compute squared norm",
            "result": "$3^2+4^2=25$",
            "why": "sum squares"
          },
          {
            "do": "Take square root",
            "result": "$\\|w\\|=5$",
            "why": "Euclidean norm"
          },
          {
            "do": "Divide first entry",
            "result": "$3/5=0.6$",
            "why": "unit scaling"
          },
          {
            "do": "Divide second entry",
            "result": "$4/5=0.8$",
            "why": "unit scaling"
          },
          {
            "do": "Check norm",
            "result": "$0.6^2+0.8^2=1$",
            "why": "unit vector"
          }
        ],
        "answer": "The unit vector is $[0.6,0.8]^T$."
      },
      {
        "problem": "A web graph iteration uses $10^8$ nonzeros and runs $25$ power steps. Estimate sparse multiply operations.",
        "steps": [
          {
            "do": "Assign operations per step",
            "result": "$10^8$",
            "why": "one multiply per nonzero"
          },
          {
            "do": "Count steps",
            "result": "$25$",
            "why": "number of iterations"
          },
          {
            "do": "Multiply",
            "result": "$25\\cdot10^8$",
            "why": "total multiplications"
          },
          {
            "do": "Write compactly",
            "result": "$2.5\\cdot10^9$",
            "why": "scientific notation"
          },
          {
            "do": "Interpret",
            "result": "billions of simple operations",
            "why": "sparse structure makes the computation possible"
          }
        ],
        "answer": "About $2.5\\cdot10^9$ multiply operations."
      }
    ],
    "applications": [
      {
        "title": "PageRank",
        "background": "The original web-ranking idea repeatedly applied a link matrix until the dominant stationary direction emerged.",
        "numbers": "If rank mass vector sums to $1$, a page with score $0.02$ has about twice the mass of a page with score $0.01$."
      },
      {
        "title": "Principal components",
        "background": "The top principal component is the dominant eigenvector of a covariance matrix. Power iteration can estimate it without full decomposition.",
        "numbers": "For variances $9$ and $1$, the top direction explains $9/(9+1)=90\\%$ of variance."
      },
      {
        "title": "Spectral norm estimates",
        "background": "Optimization and generalization checks sometimes need the largest singular value. Power iteration on $A^TA$ estimates it.",
        "numbers": "If the dominant eigenvalue of $A^TA$ is $25$, the spectral norm of $A$ is $\\sqrt{25}=5$."
      },
      {
        "title": "Graph centrality",
        "background": "Eigenvector centrality scores nodes highly when they connect to other high-scoring nodes. Power iteration computes the fixed direction.",
        "numbers": "In a tiny star graph, the center receives contributions from all $4$ leaves, while each leaf receives only the center's contribution."
      },
      {
        "title": "Neural-network diagnostics",
        "background": "Largest eigenvalue estimates of Hessians or Jacobians help diagnose sharpness and stability.",
        "numbers": "If power iteration estimates Hessian top eigenvalue $120$, a gradient step size above about $2/120\\approx0.0167$ may be unstable for a quadratic."
      },
      {
        "title": "Markov chains",
        "background": "Repeated transition-matrix multiplication approaches a stationary distribution when the chain mixes well.",
        "numbers": "For state vector $[1,0]$ and transition matrix with first row $[0.8,0.2]$, one step gives $[0.8,0.2]$."
      }
    ],
    "applicationsClose": "Power iteration is repeated amplification with normalization: simple enough to trust, useful enough to appear everywhere.",
    "takeaways": [
      "Power iteration estimates a dominant eigenvector using repeated matrix-vector products.",
      "Convergence depends on the spectral gap $|\\lambda_2/\\lambda_1|$.",
      "Normalization prevents overflow and keeps the direction visible.",
      "Rayleigh quotients turn approximate eigenvectors into approximate eigenvalues."
    ]
  },
  "math-27-09": {
    "id": "math-27-09",
    "title": "The QR algorithm",
    "tagline": "The QR algorithm finds eigenvalues by repeatedly factoring a matrix into an orthogonal part and an upper-triangular part.",
    "connections": {
      "buildsOn": [
        "orthogonal vectors",
        "matrix multiplication",
        "Power iteration",
        "eigenvalues"
      ],
      "leadsTo": [
        "Lanczos iteration",
        "singular value methods",
        "modern eigensolvers"
      ],
      "usedWith": [
        "QR factorization",
        "similarity transforms",
        "orthogonality",
        "triangular matrices"
      ]
    },
    "motivation": "<p>You have seen that power iteration can find one dominant eigenvector. But scientific computing often needs many eigenvalues, not just the biggest one. The QR algorithm is the classic stable route from one-at-a-time thinking to a whole spectrum.</p><p>Its rhythm is elegant: factor $A_k=Q_kR_k$, then reverse the factors to get $A_{k+1}=R_kQ_k$. The matrices remain similar, so the eigenvalues stay the same, while the entries often move toward triangular form where eigenvalues are easy to read.</p>",
    "definition": "<p>A <b>QR factorization</b> writes $A=QR$, where $Q^TQ=I$ and $R$ is upper triangular. The basic QR eigenvalue iteration forms $A_k=Q_kR_k$ and then $A_{k+1}=R_kQ_k=Q_k^TA_kQ_k$.</p><p>The equality $A_{k+1}=Q_k^TA_kQ_k$ shows this is a similarity transform by an orthogonal matrix, so eigenvalues are preserved. For many matrices, repeated shifted QR steps drive $A_k$ toward nearly upper triangular form; the diagonal entries then reveal eigenvalues.</p><p><b>Assumptions that matter:</b> practical QR algorithms use shifts and first reduce to Hessenberg or tridiagonal form; orthogonality of $Q$ protects numerical stability; convergence can be slow without shifts; and real matrices with complex eigenvalues appear as $2\\times2$ blocks in real Schur form.</p>",
    "worked": {
      "problem": "For $A=\\begin{bmatrix}2&0\\0&1\\end{bmatrix}$, perform one QR eigenvalue iteration.",
      "skills": [
        "QR factorization",
        "similarity",
        "eigenvalue reading"
      ],
      "strategy": "Recognize that a positive diagonal matrix already has a simple QR factorization.",
      "steps": [
        {
          "do": "Choose $Q$",
          "result": "$Q=I$",
          "why": "the columns of a diagonal positive matrix already align with the standard orthonormal basis"
        },
        {
          "do": "Choose $R$",
          "result": "$R=A$",
          "why": "with $Q=I$, the factorization $A=QR$ holds"
        },
        {
          "do": "Reverse the factors",
          "result": "$A_1=RQ$",
          "why": "QR iteration forms $R$ times $Q$"
        },
        {
          "do": "Multiply",
          "result": "$A_1=AI=A$",
          "why": "multiplying by the identity changes nothing"
        },
        {
          "do": "Read the diagonal",
          "result": "$2$ and $1$",
          "why": "a triangular matrix's eigenvalues are its diagonal entries"
        }
      ],
      "verify": "The algorithm should not change a diagonal matrix whose eigenvalues are already exposed.",
      "answer": "One QR step leaves $A$ unchanged, and the eigenvalues are $2$ and $1$.",
      "connects": "QR iteration preserves eigenvalues while trying to reveal them on the diagonal."
    },
    "practice": [
      {
        "problem": "Check that $Q=\\begin{bmatrix}0&1\\1&0\\end{bmatrix}$ is orthogonal.",
        "steps": [
          {
            "do": "Compute column norms",
            "result": "$\\|[0,1]^T\\|=1$ and $\\|[1,0]^T\\|=1$",
            "why": "orthonormal columns need unit length"
          },
          {
            "do": "Compute column dot product",
            "result": "$0\\cdot1+1\\cdot0=0$",
            "why": "columns must be perpendicular"
          },
          {
            "do": "Form $Q^TQ$",
            "result": "$I$",
            "why": "orthonormal columns imply identity"
          },
          {
            "do": "State orthogonality",
            "result": "$Q$ is orthogonal",
            "why": "definition is $Q^TQ=I$"
          },
          {
            "do": "Interpret",
            "result": "multiplication by $Q$ preserves lengths",
            "why": "orthogonal transforms are stable"
          }
        ],
        "answer": "$Q$ is orthogonal."
      },
      {
        "problem": "For upper triangular $T=\\begin{bmatrix}4&7\\0&-2\\end{bmatrix}$, read the eigenvalues.",
        "steps": [
          {
            "do": "Identify triangular form",
            "result": "entries below the diagonal are zero",
            "why": "this is upper triangular"
          },
          {
            "do": "Recall triangular rule",
            "result": "eigenvalues are diagonal entries",
            "why": "the characteristic determinant multiplies diagonal terms"
          },
          {
            "do": "Read first diagonal entry",
            "result": "$4$",
            "why": "top-left entry"
          },
          {
            "do": "Read second diagonal entry",
            "result": "$-2$",
            "why": "bottom-right entry"
          },
          {
            "do": "List eigenvalues",
            "result": "$4$ and $-2$",
            "why": "include both diagonal values"
          }
        ],
        "answer": "The eigenvalues are $4$ and $-2$."
      },
      {
        "problem": "Show that $A_{k+1}=R_kQ_k$ is similar to $A_k$ when $A_k=Q_kR_k$ and $Q_k^TQ_k=I$.",
        "steps": [
          {
            "do": "Start from $A_k=Q_kR_k$",
            "result": "$A_k=Q_kR_k$",
            "why": "QR factorization"
          },
          {
            "do": "Left-multiply by $Q_k^T$",
            "result": "$Q_k^TA_k=R_k$",
            "why": "because $Q_k^TQ_k=I$"
          },
          {
            "do": "Substitute into $R_kQ_k$",
            "result": "$A_{k+1}=Q_k^TA_kQ_k$",
            "why": "replace $R_k$"
          },
          {
            "do": "Identify similarity form",
            "result": "$Q_k^{-1}A_kQ_k$",
            "why": "orthogonal matrices satisfy $Q_k^{-1}=Q_k^T$"
          },
          {
            "do": "Conclude",
            "result": "eigenvalues are preserved",
            "why": "similar matrices share eigenvalues"
          }
        ],
        "answer": "$A_{k+1}=Q_k^TA_kQ_k$, so it is orthogonally similar to $A_k$."
      },
      {
        "problem": "A practical QR eigensolver first reduces a dense $1000\\times1000$ matrix to Hessenberg form, then QR steps cost $O(n^2)$. Compare $n^3$ and $n^2$ scale units at $n=1000$.",
        "steps": [
          {
            "do": "Compute $n^2$",
            "result": "$1000^2=10^6$",
            "why": "quadratic scale"
          },
          {
            "do": "Compute $n^3$",
            "result": "$1000^3=10^9$",
            "why": "cubic scale"
          },
          {
            "do": "Form ratio",
            "result": "$10^9/10^6=10^3$",
            "why": "cubic over quadratic"
          },
          {
            "do": "Interpret",
            "result": "a cubic step is $1000$ times larger",
            "why": "structure matters"
          },
          {
            "do": "Connect to Hessenberg",
            "result": "QR steps become cheaper after reduction",
            "why": "zeros are preserved"
          }
        ],
        "answer": "At $n=1000$, $n^3$ is $1000$ times larger than $n^2$."
      },
      {
        "problem": "A shifted QR step uses shift $\\mu=2.9$ for a matrix with eigenvalue near $3$. If an off-diagonal error is multiplied by roughly $0.1$ per shifted step, how many steps reduce $10^{-2}$ below $10^{-5}$?",
        "steps": [
          {
            "do": "Write the error model",
            "result": "$E_k=10^{-2}(0.1)^k$",
            "why": "geometric reduction"
          },
          {
            "do": "Set the target",
            "result": "$10^{-2}(0.1)^k<10^{-5}$",
            "why": "want below tolerance"
          },
          {
            "do": "Divide by $10^{-2}$",
            "result": "$(0.1)^k<10^{-3}$",
            "why": "isolate reduction"
          },
          {
            "do": "Test $k=3$",
            "result": "$(0.1)^3=10^{-3}$",
            "why": "equal to the boundary"
          },
          {
            "do": "Choose strict reduction",
            "result": "$k=4$ gives $10^{-4}<10^{-3}$",
            "why": "strictly below the target"
          }
        ],
        "answer": "Four shifted steps make the error strictly below $10^{-5}$ under this model."
      }
    ],
    "applications": [
      {
        "title": "Dense eigenvalue computations",
        "background": "Scientific packages use QR-family algorithms to compute all eigenvalues of moderate dense matrices.",
        "numbers": "A $500\\times500$ matrix has $250000$ entries, so dense eigensolvers are reasonable on modern machines."
      },
      {
        "title": "Principal component analysis",
        "background": "PCA can be computed from eigenvalues of a covariance matrix. QR methods are part of the dense linear algebra toolkit behind such decompositions.",
        "numbers": "If covariance eigenvalues are $9$, $4$, and $1$, the first two components explain $(9+4)/(9+4+1)=92.9\\%$ of variance."
      },
      {
        "title": "Stability of dynamical systems",
        "background": "Eigenvalues determine whether linear dynamics grow or decay. QR algorithms help reveal those eigenvalues.",
        "numbers": "For eigenvalues $0.8$ and $1.2$, the $1.2$ mode grows by $1.2^{10}\\approx6.19$ after $10$ steps."
      },
      {
        "title": "Vibration analysis",
        "background": "Mechanical systems use eigenvalues to find natural frequencies. Dense subproblems often rely on QR-like routines.",
        "numbers": "An eigenvalue $\\lambda=400$ in a stiffness-mass model corresponds to angular frequency $\\sqrt{400}=20$ rad/s."
      },
      {
        "title": "Schur decompositions",
        "background": "Modern QR algorithms usually deliver Schur form, a stable triangular or block-triangular representation.",
        "numbers": "A real $2\\times2$ block can encode complex conjugate eigenvalues while keeping all matrix entries real."
      },
      {
        "title": "Small Hessian diagnostics",
        "background": "Optimization diagnostics sometimes compute eigenvalues of a smaller projected Hessian to understand curvature.",
        "numbers": "If projected Hessian diagonal Schur values include $-0.5$, the point has a negative-curvature direction."
      }
    ],
    "applicationsClose": "The QR algorithm is a masterclass in numerical design: preserve eigenvalues exactly in theory while moving the matrix toward a form where they are easy to read.",
    "takeaways": [
      "QR factorization writes $A=QR$ with orthogonal $Q$ and upper triangular $R$.",
      "QR eigenvalue iteration uses $A_{k+1}=R_kQ_k$, an orthogonal similarity transform.",
      "Triangular and Schur forms expose eigenvalues on diagonals or small blocks.",
      "Practical QR uses shifts and structure reduction for speed and convergence."
    ]
  },
  "math-27-10": {
    "id": "math-27-10",
    "title": "Lanczos iteration",
    "tagline": "Lanczos iteration compresses a large symmetric matrix into a small tridiagonal mirror that preserves the most important spectral behavior.",
    "connections": {
      "buildsOn": [
        "Power iteration",
        "Conjugate gradient (CG)",
        "orthogonal projection",
        "symmetric matrices"
      ],
      "leadsTo": [
        "large-scale eigensolvers",
        "kernel approximations",
        "spectral graph methods"
      ],
      "usedWith": [
        "Krylov subspaces",
        "tridiagonal matrices",
        "Rayleigh-Ritz",
        "orthogonality"
      ]
    },
    "motivation": "<p>Power iteration finds one dominant direction. But many large symmetric problems need several leading eigenvalues or a compact picture of the spectrum. Full QR may be too expensive when the matrix has millions of rows.</p><p>Lanczos iteration builds a carefully chosen orthonormal basis for a Krylov subspace. In that basis, the large symmetric matrix looks like a small tridiagonal matrix, which is much easier to analyze.</p>",
    "definition": "<p><b>Lanczos iteration</b> applies to symmetric matrices. Starting with unit vector $q_1$, it builds orthonormal vectors $q_1,\\ldots,q_k$ and a tridiagonal matrix $T_k$ such that $Q_k^TAQ_k=T_k$, where $Q_k$ has the $q_i$ as columns.</p><p>The three-term recurrence is $\\beta_{j+1}q_{j+1}=Aq_j-\\u0007lpha_jq_j-\\beta_jq_{j-1}$, with $\\u0007lpha_j=q_j^TAq_j$. Symmetry is what keeps only the previous direction, current direction, and next direction coupled, producing the tridiagonal structure.</p><p><b>Assumptions that matter:</b> $A$ should be symmetric for the three-term recurrence; finite precision can erode orthogonality and create repeated ghost eigenvalues; reorthogonalization may be needed; and the useful output is often Ritz values, the eigenvalues of $T_k$.</p>",
    "worked": {
      "problem": "Run the first Lanczos step for $A=\\begin{bmatrix}2&1\\1&2\\end{bmatrix}$ starting with $q_1=\\begin{bmatrix}1\\0\\end{bmatrix}$.",
      "skills": [
        "matrix-vector products",
        "orthogonalization",
        "tridiagonal projection"
      ],
      "strategy": "Compute $Aq_1$, extract $\\u0007lpha_1$, subtract the component along $q_1$, and normalize what remains.",
      "steps": [
        {
          "do": "Compute $Aq_1$",
          "result": "$\\begin{bmatrix}2\\1\\end{bmatrix}$",
          "why": "multiply by the first basis vector"
        },
        {
          "do": "Compute $\\u0007lpha_1$",
          "result": "$q_1^TAq_1=[1,0]\\cdot[2,1]=2$",
          "why": "diagonal entry of $T$"
        },
        {
          "do": "Subtract the $q_1$ component",
          "result": "$Aq_1-\\u0007lpha_1q_1=[2,1]^T-2[1,0]^T=[0,1]^T$",
          "why": "remove the current basis direction"
        },
        {
          "do": "Compute the norm",
          "result": "$\\beta_2=\\|[0,1]^T\\|=1$",
          "why": "subdiagonal entry"
        },
        {
          "do": "Normalize",
          "result": "$q_2=[0,1]^T$",
          "why": "divide by $\\beta_2$"
        },
        {
          "do": "Write the first projected entries",
          "result": "$\\u0007lpha_1=2$, $\\beta_2=1$",
          "why": "these begin the tridiagonal matrix"
        }
      ],
      "verify": "$q_1^Tq_2=0$, so the new vector is orthogonal to the old one as required.",
      "answer": "$\\u0007lpha_1=2$, $\\beta_2=1$, and $q_2=[0,1]^T$.",
      "connects": "Lanczos turns repeated matrix-vector products into a small tridiagonal spectral summary."
    },
    "practice": [
      {
        "problem": "For unit vector $q=[0,1]^T$ and $A=\\begin{bmatrix}4&2\\2&3\\end{bmatrix}$, compute $\\u0007lpha=q^TAq$.",
        "steps": [
          {
            "do": "Compute $Aq$",
            "result": "$[2,3]^T$",
            "why": "use the second column"
          },
          {
            "do": "Compute the dot product",
            "result": "$q^TAq=[0,1]\\cdot[2,3]$",
            "why": "Rayleigh quotient numerator for unit $q$"
          },
          {
            "do": "Multiply entries",
            "result": "$0\\cdot2+1\\cdot3=3$",
            "why": "sum products"
          },
          {
            "do": "State $\\u0007lpha$",
            "result": "$\\u0007lpha=3$",
            "why": "Lanczos diagonal coefficient"
          },
          {
            "do": "Interpret",
            "result": "local projected curvature is $3$",
            "why": "diagonal entry of $T$"
          }
        ],
        "answer": "$\\u0007lpha=3$."
      },
      {
        "problem": "Normalize residual vector $z=[6,8]^T$ to create the next Lanczos vector.",
        "steps": [
          {
            "do": "Compute squared norm",
            "result": "$6^2+8^2=100$",
            "why": "sum squares"
          },
          {
            "do": "Take square root",
            "result": "$\\|z\\|=10$",
            "why": "norm"
          },
          {
            "do": "Divide first entry",
            "result": "$6/10=0.6$",
            "why": "normalize"
          },
          {
            "do": "Divide second entry",
            "result": "$8/10=0.8$",
            "why": "normalize"
          },
          {
            "do": "Check",
            "result": "$0.6^2+0.8^2=1$",
            "why": "unit length"
          }
        ],
        "answer": "The next unit vector is $[0.6,0.8]^T$."
      },
      {
        "problem": "A $4$-step Lanczos run produces tridiagonal $T_4$. How many diagonal and off-diagonal stored numbers define symmetric tridiagonal $T_4$?",
        "steps": [
          {
            "do": "Count diagonal entries",
            "result": "$4$",
            "why": "one $\\u0007lpha_j$ per step"
          },
          {
            "do": "Count subdiagonal entries",
            "result": "$3$",
            "why": "entries connect neighboring rows"
          },
          {
            "do": "Use symmetry",
            "result": "superdiagonal repeats the same $3$ numbers",
            "why": "no need to store twice"
          },
          {
            "do": "Add stored values",
            "result": "$4+3=7$",
            "why": "diagonal plus one off-diagonal"
          },
          {
            "do": "Compare dense storage",
            "result": "$4^2=16$",
            "why": "tridiagonal is smaller"
          }
        ],
        "answer": "Seven numbers define the symmetric tridiagonal $T_4$."
      },
      {
        "problem": "If Ritz values from $T_k$ are $9.8$, $4.1$, and $0.7$, estimate the top eigenvalue and its absolute error if the true top eigenvalue is $10$.",
        "steps": [
          {
            "do": "Select largest Ritz value",
            "result": "$9.8$",
            "why": "largest Ritz value estimates largest eigenvalue"
          },
          {
            "do": "Write true value",
            "result": "$10$",
            "why": "given top eigenvalue"
          },
          {
            "do": "Compute signed error",
            "result": "$9.8-10=-0.2$",
            "why": "estimate minus true"
          },
          {
            "do": "Take absolute value",
            "result": "$0.2$",
            "why": "absolute error"
          },
          {
            "do": "Interpret",
            "result": "top estimate is close",
            "why": "Ritz values often converge first at spectral extremes"
          }
        ],
        "answer": "The top eigenvalue estimate is $9.8$ with absolute error $0.2$."
      },
      {
        "problem": "A symmetric sparse matrix has $2\\cdot10^7$ nonzeros. Lanczos uses $80$ matrix-vector products. Estimate multiply count and compare with storing a dense $10^6\\times10^6$ matrix.",
        "steps": [
          {
            "do": "Compute matvec multiplies",
            "result": "$80\\cdot2\\cdot10^7=1.6\\cdot10^9$",
            "why": "one multiply per nonzero per iteration"
          },
          {
            "do": "Compute dense entries",
            "result": "$(10^6)^2=10^{12}$",
            "why": "dense matrix storage count"
          },
          {
            "do": "Compare nonzeros to dense",
            "result": "$2\\cdot10^7/10^{12}=2\\cdot10^{-5}$",
            "why": "sparse fraction"
          },
          {
            "do": "Convert to percent",
            "result": "$0.002\\%$",
            "why": "multiply by 100"
          },
          {
            "do": "Interpret",
            "result": "sparsity makes Lanczos feasible",
            "why": "dense methods would be too large"
          }
        ],
        "answer": "Lanczos uses about $1.6\\cdot10^9$ multiplies; the sparse matrix stores only about $0.002\\%$ of dense entries."
      }
    ],
    "applications": [
      {
        "title": "Large sparse eigenproblems",
        "background": "Physics, graphs, and PDEs often need a few extreme eigenvalues of enormous symmetric matrices. Lanczos targets those without dense factorization.",
        "numbers": "For $n=10^7$ and $50$ Lanczos vectors, basis storage is $5\\cdot10^8$ numbers, large but far below dense matrix storage."
      },
      {
        "title": "Spectral graph partitioning",
        "background": "Graph cuts use eigenvectors of Laplacian matrices. Lanczos can estimate the relevant low eigenvectors for large sparse graphs.",
        "numbers": "A graph with $1$ million nodes and $5$ million edges gives a Laplacian with roughly $11$ million nonzeros including diagonals."
      },
      {
        "title": "Kernel PCA approximations",
        "background": "Kernel methods can form huge symmetric matrices. Lanczos approximates leading eigenspaces for dimensionality reduction.",
        "numbers": "Keeping $20$ Ritz vectors from $10000$ samples stores $200000$ vector entries instead of a full $10000^2=10^8$ kernel entries."
      },
      {
        "title": "Gaussian process log determinants",
        "background": "Stochastic Lanczos quadrature estimates traces and log determinants using Lanczos tridiagonal matrices.",
        "numbers": "If $10$ probe vectors each run $30$ Lanczos steps, the method uses $300$ matrix-vector products."
      },
      {
        "title": "Hessian spectrum in deep learning",
        "background": "Researchers estimate top Hessian eigenvalues to understand sharpness. Lanczos uses Hessian-vector products rather than storing the Hessian.",
        "numbers": "For $10^8$ parameters, storing a dense Hessian would require $10^{16}$ entries, impossible in ordinary memory."
      },
      {
        "title": "Connection to CG",
        "background": "CG and Lanczos are deeply linked for SPD systems: CG residual behavior can be explained through Lanczos tridiagonalization.",
        "numbers": "After $k=25$ CG steps, the related Krylov subspace has dimension at most $25$, represented by a $25\\times25$ tridiagonal matrix."
      }
    ],
    "applicationsClose": "Lanczos is how large symmetric matrices whisper their spectra through a much smaller tridiagonal representative.",
    "takeaways": [
      "Lanczos builds an orthonormal Krylov basis for symmetric matrices.",
      "The projected matrix $T_k=Q_k^TAQ_k$ is tridiagonal because of symmetry.",
      "Ritz values from $T_k$ approximate eigenvalues of the large matrix.",
      "Finite precision can damage orthogonality, so reorthogonalization may be needed."
    ]
  }
};
