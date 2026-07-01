module.exports = {
  "math-02-01": {
    "id": "math-02-01",
    "title": "Points and vectors in Rⁿ",
    "tagline": "A vector is a precise package of numbers: location, displacement, or features depending on how you read it.",
    "connections": {
      "buildsOn": [
        "ordered pairs",
        "real numbers",
        "coordinate axes"
      ],
      "leadsTo": [
        "The dot product",
        "Lines in space",
        "Functions of several variables"
      ],
      "usedWith": [
        "coordinate geometry",
        "norms",
        "linear combinations",
        "matrices"
      ]
    },
    "motivation": "<p>You already know how to locate a point with two coordinates, such as $(3,2)$. The move to $\\mathbb R^n$ keeps that same friendly idea and simply allows more coordinates.</p><p>That matters because ML examples are usually lists of numbers. A row of features, a pixel color, an embedding, and a parameter setting can all be read as vectors.</p>",
    "definition": "<p>A <b>point</b> in $\\mathbb R^n$ is an ordered list $p=(p_1,\\ldots,p_n)$ of real coordinates. A <b>vector</b> $v=\\langle v_1,\\ldots,v_n\\rangle$ can describe displacement or features. Addition and scalar multiplication are coordinatewise.</p><p>The displacement from $P$ to $Q$ is $Q-P$ because $P+(Q-P)=Q$. The length is $\\|v\\|=\\sqrt{v_1^2+\\cdots+v_n^2}$, a repeated Pythagorean theorem.</p><p><b>Assumptions that matter:</b> coordinate order matters; vectors being added must have the same dimension; and points name positions while vectors often name changes or feature lists.</p>",
    "worked": {
      "problem": "Let $P=(2,-1,4)$ and $Q=(5,3,-2)$. Find $\\overrightarrow{PQ}$ and its length.",
      "skills": [
        "coordinate subtraction",
        "norms",
        "geometry"
      ],
      "strategy": "Subtract start from end, then use the norm formula.",
      "steps": [
        {
          "do": "Subtract first coordinates",
          "result": "$5-2=3$",
          "why": "endpoint minus start gives displacement"
        },
        {
          "do": "Subtract second coordinates",
          "result": "$3-(-1)=4$",
          "why": "keep the sign"
        },
        {
          "do": "Subtract third coordinates",
          "result": "$-2-4=-6$",
          "why": "repeat coordinatewise"
        },
        {
          "do": "Write the vector",
          "result": "$\\overrightarrow{PQ}=\\langle3,4,-6\\rangle$",
          "why": "collect components"
        },
        {
          "do": "Compute the norm",
          "result": "$\\sqrt{3^2+4^2+(-6)^2}=\\sqrt{61}$",
          "why": "sum squares and take the square root"
        }
      ],
      "verify": "Adding $\\langle3,4,-6\\rangle$ to $P$ gives $Q$.",
      "answer": "$\\overrightarrow{PQ}=\\langle3,4,-6\\rangle$ and $\\|\\overrightarrow{PQ}\\|=\\sqrt{61}$.",
      "connects": "A vector turns two locations into one reusable displacement."
    },
    "practice": [
      {
        "problem": "Compute $2\\langle1,-3,4\\rangle-\\langle5,2,-1\\rangle$.",
        "steps": [
          {
            "do": "Scale the first vector",
            "result": "$\\langle2,-6,8\\rangle$",
            "why": "multiply each component by 2"
          },
          {
            "do": "Subtract first components",
            "result": "$2-5=-3$",
            "why": "coordinatewise subtraction"
          },
          {
            "do": "Subtract second components",
            "result": "$-6-2=-8$",
            "why": "coordinatewise subtraction"
          },
          {
            "do": "Subtract third components",
            "result": "$8-(-1)=9$",
            "why": "subtracting a negative adds"
          },
          {
            "do": "Collect components",
            "result": "$\\langle-3,-8,9\\rangle$",
            "why": "write the vector"
          }
        ],
        "answer": "$\\langle-3,-8,9\\rangle$."
      },
      {
        "problem": "Find the midpoint of $A=(-2,6)$ and $B=(8,-4)$.",
        "steps": [
          {
            "do": "Average $x$ values",
            "result": "$(-2+8)/2=3$",
            "why": "midpoints average coordinates"
          },
          {
            "do": "Average $y$ values",
            "result": "$(6-4)/2=1$",
            "why": "repeat for $y$"
          },
          {
            "do": "Write the midpoint",
            "result": "$(3,1)$",
            "why": "combine averages"
          },
          {
            "do": "Check first half",
            "result": "$(3,1)-(-2,6)=\\langle5,-5\\rangle$",
            "why": "one side of midpoint"
          },
          {
            "do": "Check second half",
            "result": "$(8,-4)-(3,1)=\\langle5,-5\\rangle$",
            "why": "the halves match"
          }
        ],
        "answer": "The midpoint is $(3,1)$."
      },
      {
        "problem": "Find the unit vector in the direction $\\langle6,8\\rangle$.",
        "steps": [
          {
            "do": "Compute the length",
            "result": "$\\sqrt{6^2+8^2}=10$",
            "why": "use the norm"
          },
          {
            "do": "Divide first component",
            "result": "$6/10=3/5$",
            "why": "normalize"
          },
          {
            "do": "Divide second component",
            "result": "$8/10=4/5$",
            "why": "normalize"
          },
          {
            "do": "Write the unit vector",
            "result": "$\\langle3/5,4/5\\rangle$",
            "why": "length is 1"
          },
          {
            "do": "Check length",
            "result": "$\\sqrt{9/25+16/25}=1$",
            "why": "sanity check"
          }
        ],
        "answer": "$\\langle3/5,4/5\\rangle$."
      },
      {
        "problem": "Center $x=\\langle2,0,5,1\\rangle$ by subtracting $\\mu=\\langle1,1,3,1\\rangle$ and find the norm.",
        "steps": [
          {
            "do": "Subtract components",
            "result": "$\\langle1,-1,2,0\\rangle$",
            "why": "center coordinatewise"
          },
          {
            "do": "Square entries",
            "result": "$1,1,4,0$",
            "why": "prepare the norm"
          },
          {
            "do": "Add squares",
            "result": "$1+1+4+0=6$",
            "why": "norm squared"
          },
          {
            "do": "Take square root",
            "result": "$\\sqrt6$",
            "why": "norm"
          },
          {
            "do": "Interpret",
            "result": "centered feature vector",
            "why": "the mean has been removed"
          }
        ],
        "answer": "Centered vector $\\langle1,-1,2,0\\rangle$ has norm $\\sqrt6$."
      },
      {
        "problem": "Starting at $(1,2,3)$, move by $0.5\\langle4,-2,6\\rangle$. Find the new point and distance moved.",
        "steps": [
          {
            "do": "Scale the displacement",
            "result": "$\\langle2,-1,3\\rangle$",
            "why": "multiply by 0.5"
          },
          {
            "do": "Add to the start",
            "result": "$(3,1,6)$",
            "why": "position plus displacement"
          },
          {
            "do": "Square displacement components",
            "result": "$4+1+9=14$",
            "why": "distance moved uses displacement"
          },
          {
            "do": "Take square root",
            "result": "$\\sqrt{14}$",
            "why": "length"
          },
          {
            "do": "State both results",
            "result": "$(3,1,6)$ and $\\sqrt{14}$",
            "why": "point and distance"
          }
        ],
        "answer": "New point $(3,1,6)$; distance $\\sqrt{14}$."
      }
    ],
    "applications": [
      {
        "title": "Feature vectors",
        "background": "ML tables store examples as rows of numbers, and geometry lets those rows have distances and directions.",
        "numbers": "For $x=\\langle1200,3,10\\rangle$ and $\\mu=\\langle1000,2,8\\rangle$, $x-\\mu=\\langle200,1,2\\rangle$."
      },
      {
        "title": "Pixel color",
        "background": "Computer vision often reads RGB color as a three-dimensional vector.",
        "numbers": "Color $\\langle200,120,40\\rangle$ has channel average $(200+120+40)/3=120$."
      },
      {
        "title": "Recommendation embeddings",
        "background": "Users and items can be points in an embedding space where nearby points tend to match.",
        "numbers": "From $u=\\langle1,2\\rangle$ to $i=\\langle4,6\\rangle$ the displacement is $\\langle3,4\\rangle$ with length $5$."
      },
      {
        "title": "Robot motion",
        "background": "Robot positions update by adding displacement vectors.",
        "numbers": "Starting at $(2,5)$ and moving $\\langle3,-1\\rangle$ lands at $(5,4)$."
      },
      {
        "title": "Parameter updates",
        "background": "Training changes a parameter vector by adding an update vector.",
        "numbers": "Weights $\\langle0.5,-1.0\\rangle$ plus $\\langle0.1,0.3\\rangle$ become $\\langle0.6,-0.7\\rangle$."
      },
      {
        "title": "Nearest-neighbor distance",
        "background": "Simple search methods compare examples by Euclidean distance.",
        "numbers": "Distance from $(1,2)$ to $(4,6)$ is $\\sqrt{3^2+4^2}=5$."
      }
    ],
    "applicationsClose": "The same idea keeps changing clothes: geometry, data, and optimization all use this structure once the numbers are in place.",
    "takeaways": [
      "Points record location; vectors record displacement or features.",
      "Vector arithmetic is coordinatewise.",
      "The norm measures vector length.",
      "The displacement from $P$ to $Q$ is $Q-P$."
    ]
  },
  "math-02-02": {
    "id": "math-02-02",
    "title": "The dot product",
    "tagline": "The dot product turns two vectors into one number that measures alignment.",
    "connections": {
      "buildsOn": [
        "Points and vectors in Rⁿ",
        "norms",
        "coordinate arithmetic"
      ],
      "leadsTo": [
        "Lines in space",
        "Planes in space",
        "The gradient"
      ],
      "usedWith": [
        "orthogonality",
        "angles",
        "projections",
        "normal vectors"
      ]
    },
    "motivation": "<p>You already have the coordinate tools from the previous lessons. Now we use them to read dot product as something concrete rather than as a symbol to memorize.</p><p>The goal is steady and practical: compute carefully, then ask what the result says about direction, shape, rate, or data.</p>",
    "definition": "<p>The <b>dot product</b> of $u=\\langle u_1,\\ldots,u_n\\rangle$ and $v=\\langle v_1,\\ldots,v_n\\rangle$ is $u\\cdot v=u_1v_1+\\cdots+u_nv_n$. It also satisfies $u\\cdot v=\\|u\\|\\|v\\|\\cos\\theta$ for nonzero vectors.</p><p>This second formula comes from expanding $\\|u-v\\|^2$ and comparing it with the law of cosines. The arithmetic sum is secretly an angle measurement.</p><p><b>Assumptions that matter:</b> vectors must have the same dimension; the angle formula needs nonzero vectors; and zero dot product means orthogonality.</p>",
    "worked": {
      "problem": "For $u=\\langle2,-1,3\\rangle$ and $v=\\langle4,0,-2\\rangle$, compute $u\\cdot v$ and interpret the sign.",
      "skills": [
        "dot product",
        "calculation",
        "interpretation"
      ],
      "strategy": "Use the definition one piece at a time, then read the result geometrically.",
      "steps": [
        {
          "do": "Multiply first components",
          "result": "$2\\cdot4=8$",
          "why": "pair matching entries"
        },
        {
          "do": "Multiply second components",
          "result": "$(-1)\\cdot0=0$",
          "why": "second pair"
        },
        {
          "do": "Multiply third components",
          "result": "$3(-2)=-6$",
          "why": "third pair"
        },
        {
          "do": "Add products",
          "result": "$8+0-6=2$",
          "why": "definition of dot product"
        },
        {
          "do": "Interpret the sign",
          "result": "positive, so the angle is acute",
          "why": "positive dot product means positive cosine"
        }
      ],
      "verify": "The result matches the expected type and passes the built-in sanity check for this concept.",
      "answer": "$u\\cdot v=2$, so the angle is acute.",
      "connects": "This is the central move for understanding dot product in later ML examples."
    },
    "practice": [
      {
        "problem": "Compute $\\langle3,1\\rangle\\cdot\\langle2,5\\rangle$.",
        "steps": [
          {
            "do": "Multiply first pair",
            "result": "$6$",
            "why": "$3\\cdot2$"
          },
          {
            "do": "Multiply second pair",
            "result": "$5$",
            "why": "$1\\cdot5$"
          },
          {
            "do": "Add",
            "result": "$11$",
            "why": "dot product"
          },
          {
            "do": "Interpret sign",
            "result": "positive",
            "why": "acute alignment"
          }
        ],
        "answer": "$11$."
      },
      {
        "problem": "Are $\\langle2,-3,1\\rangle$ and $\\langle4,2,-2\\rangle$ orthogonal?",
        "steps": [
          {
            "do": "Compute products",
            "result": "$8,-6,-2$",
            "why": "pair entries"
          },
          {
            "do": "Add",
            "result": "$0$",
            "why": "sum products"
          },
          {
            "do": "Apply test",
            "result": "orthogonal",
            "why": "zero dot product"
          },
          {
            "do": "Check nonzero",
            "result": "both vectors are nonzero",
            "why": "orthogonality is meaningful"
          }
        ],
        "answer": "Yes."
      },
      {
        "problem": "Find cosine similarity of $\\langle1,2\\rangle$ and $\\langle2,0\\rangle$.",
        "steps": [
          {
            "do": "Dot",
            "result": "$2$",
            "why": "numerator"
          },
          {
            "do": "Norms",
            "result": "$\\sqrt5$ and $2$",
            "why": "lengths"
          },
          {
            "do": "Divide",
            "result": "$2/(2\\sqrt5)$",
            "why": "cosine formula"
          },
          {
            "do": "Simplify",
            "result": "$1/\\sqrt5$",
            "why": "cancel 2"
          }
        ],
        "answer": "$1/\\sqrt5$."
      },
      {
        "problem": "Project $\\langle3,4\\rangle$ onto $\\langle1,0\\rangle$.",
        "steps": [
          {
            "do": "Dot with direction",
            "result": "$3$",
            "why": "projection numerator"
          },
          {
            "do": "Dot direction with itself",
            "result": "$1$",
            "why": "denominator"
          },
          {
            "do": "Coefficient",
            "result": "$3$",
            "why": "divide"
          },
          {
            "do": "Multiply direction",
            "result": "$\\langle3,0\\rangle$",
            "why": "projection vector"
          }
        ],
        "answer": "$\\langle3,0\\rangle$."
      },
      {
        "problem": "Compute embedding cosine for $q=\\langle1,2,2\\rangle$, $d=\\langle2,1,2\\rangle$.",
        "steps": [
          {
            "do": "Dot",
            "result": "$8$",
            "why": "$2+2+4$"
          },
          {
            "do": "Norm of $q$",
            "result": "$3$",
            "why": "$\\sqrt9$"
          },
          {
            "do": "Norm of $d$",
            "result": "$3$",
            "why": "$\\sqrt9$"
          },
          {
            "do": "Divide",
            "result": "$8/9$",
            "why": "cosine"
          },
          {
            "do": "Interpret",
            "result": "about $0.889$",
            "why": "high similarity"
          }
        ],
        "answer": "$8/9$."
      }
    ],
    "applications": [
      {
        "title": "Machine learning model geometry",
        "background": "Dot Product appears when feature vectors, parameters, or losses need a geometric reading.",
        "numbers": "For features $\\langle2,3\\rangle$ and weights $\\langle0.5,1\\rangle$, the score is $4$."
      },
      {
        "title": "Computer graphics",
        "background": "Graphics uses dot product ideas to place objects, trace rays, or measure surfaces.",
        "numbers": "A point $(1,2,3)$ shifted by $\\langle4,0,-1\\rangle$ becomes $(5,2,2)$."
      },
      {
        "title": "Robotics",
        "background": "Robots use dot product calculations to update position, direction, and local motion.",
        "numbers": "Velocity $\\langle3,4\\rangle$ has speed $5$ per second."
      },
      {
        "title": "Optimization",
        "background": "Training algorithms rely on dot product structure to decide how parameters should move.",
        "numbers": "With learning rate $0.1$ and gradient $\\langle4,-2\\rangle$, the update is $\\langle-0.4,0.2\\rangle$."
      },
      {
        "title": "Data visualization",
        "background": "Plots and maps use dot product to turn tables of numbers into shapes a person can read.",
        "numbers": "A contour value $10$ for $x+y$ includes $(4,6)$ and $(7,3)$."
      },
      {
        "title": "Similarity search",
        "background": "Search systems compare numerical objects, and dot product gives one of the basic comparison languages.",
        "numbers": "Distance from $(0,0)$ to $(6,8)$ is $10$."
      }
    ],
    "applicationsClose": "The same idea keeps changing clothes: geometry, data, and optimization all use this structure once the numbers are in place.",
    "takeaways": [
      "The dot product has a definition you can compute directly.",
      "The geometric interpretation is as important as the arithmetic.",
      "Small numerical examples are the safest way to build intuition.",
      "The same concept reappears in optimization, graphics, and ML data."
    ]
  },
  "math-02-03": {
    "id": "math-02-03",
    "title": "The cross product",
    "tagline": "The cross product builds a vector perpendicular to two three-dimensional directions.",
    "connections": {
      "buildsOn": [
        "Points and vectors in Rⁿ",
        "norms",
        "coordinate arithmetic"
      ],
      "leadsTo": [
        "Lines in space",
        "Planes in space",
        "The gradient"
      ],
      "usedWith": [
        "orthogonality",
        "angles",
        "projections",
        "normal vectors"
      ]
    },
    "motivation": "<p>You already have the coordinate tools from the previous lessons. Now we use them to read cross product as something concrete rather than as a symbol to memorize.</p><p>The goal is steady and practical: compute carefully, then ask what the result says about direction, shape, rate, or data.</p>",
    "definition": "<p>For $u=\\langle u_1,u_2,u_3\\rangle$ and $v=\\langle v_1,v_2,v_3\\rangle$, $u\\times v=\\langle u_2v_3-u_3v_2, u_3v_1-u_1v_3, u_1v_2-u_2v_1\\rangle$.</p><p>The result is perpendicular to both inputs, and its length is $\\|u\\|\\|v\\|\\sin\\theta$, the area of the parallelogram they span.</p><p><b>Assumptions that matter:</b> this standard operation is for $\\mathbb R^3$; order matters; and parallel inputs give the zero vector.</p>",
    "worked": {
      "problem": "Compute $\\langle1,2,3\\rangle\\times\\langle4,0,-1\\rangle$.",
      "skills": [
        "cross product",
        "calculation",
        "interpretation"
      ],
      "strategy": "Use the definition one piece at a time, then read the result geometrically.",
      "steps": [
        {
          "do": "Compute component 1",
          "result": "$2(-1)-3(0)=-2$",
          "why": "use the cross product formula"
        },
        {
          "do": "Compute component 2",
          "result": "$3(4)-1(-1)=13$",
          "why": "second component"
        },
        {
          "do": "Compute component 3",
          "result": "$1(0)-2(4)=-8$",
          "why": "third component"
        },
        {
          "do": "Assemble",
          "result": "$\\langle-2,13,-8\\rangle$",
          "why": "collect components"
        },
        {
          "do": "Check perpendicularity",
          "result": "$\\langle-2,13,-8\\rangle\\cdot\\langle1,2,3\\rangle=0$",
          "why": "dot product with one input is zero"
        }
      ],
      "verify": "The result matches the expected type and passes the built-in sanity check for this concept.",
      "answer": "$\\langle-2,13,-8\\rangle$.",
      "connects": "This is the central move for understanding cross product in later ML examples."
    },
    "practice": [
      {
        "problem": "Compute $\\langle1,0,0\\rangle\\times\\langle0,1,0\\rangle$.",
        "steps": [
          {
            "do": "Component 1",
            "result": "$0$",
            "why": "formula"
          },
          {
            "do": "Component 2",
            "result": "$0$",
            "why": "formula"
          },
          {
            "do": "Component 3",
            "result": "$1$",
            "why": "formula"
          },
          {
            "do": "Assemble",
            "result": "$\\langle0,0,1\\rangle$",
            "why": "right-hand orientation"
          }
        ],
        "answer": "$\\langle0,0,1\\rangle$."
      },
      {
        "problem": "Find a normal to $\\langle2,0,1\\rangle$ and $\\langle1,3,0\\rangle$.",
        "steps": [
          {
            "do": "Component 1",
            "result": "$-3$",
            "why": "$0\\cdot0-1\\cdot3$"
          },
          {
            "do": "Component 2",
            "result": "$1$",
            "why": "$1\\cdot1-2\\cdot0$"
          },
          {
            "do": "Component 3",
            "result": "$6$",
            "why": "$2\\cdot3-0\\cdot1$"
          },
          {
            "do": "Assemble",
            "result": "$\\langle-3,1,6\\rangle$",
            "why": "normal vector"
          }
        ],
        "answer": "$\\langle-3,1,6\\rangle$."
      },
      {
        "problem": "Find area from $\\langle1,2,0\\rangle$ and $\\langle3,0,0\\rangle$.",
        "steps": [
          {
            "do": "Cross product",
            "result": "$\\langle0,0,-6\\rangle$",
            "why": "area vector"
          },
          {
            "do": "Norm",
            "result": "$6$",
            "why": "parallelogram area"
          },
          {
            "do": "State units",
            "result": "$6$ square units",
            "why": "area"
          },
          {
            "do": "Check base-height",
            "result": "$3\\cdot2=6$",
            "why": "reasonable"
          }
        ],
        "answer": "$6$."
      },
      {
        "problem": "Show $\\langle1,2,3\\rangle$ and $\\langle2,4,6\\rangle$ are parallel using the cross product.",
        "steps": [
          {
            "do": "Component 1",
            "result": "$12-12=0$",
            "why": "formula"
          },
          {
            "do": "Component 2",
            "result": "$6-6=0$",
            "why": "formula"
          },
          {
            "do": "Component 3",
            "result": "$4-4=0$",
            "why": "formula"
          },
          {
            "do": "Interpret",
            "result": "zero vector",
            "why": "parallel inputs"
          }
        ],
        "answer": "The cross product is $\\langle0,0,0\\rangle$."
      },
      {
        "problem": "Triangle with edges $\\langle2,0,0\\rangle$ and $\\langle0,3,4\\rangle$: find area.",
        "steps": [
          {
            "do": "Cross product",
            "result": "$\\langle0,-8,6\\rangle$",
            "why": "edge area vector"
          },
          {
            "do": "Norm",
            "result": "$10$",
            "why": "parallelogram area"
          },
          {
            "do": "Halve",
            "result": "$5$",
            "why": "triangle area"
          },
          {
            "do": "State result",
            "result": "$5$",
            "why": "square units"
          }
        ],
        "answer": "$5$."
      }
    ],
    "applications": [
      {
        "title": "Machine learning model geometry",
        "background": "Cross Product appears when feature vectors, parameters, or losses need a geometric reading.",
        "numbers": "For features $\\langle2,3\\rangle$ and weights $\\langle0.5,1\\rangle$, the score is $4$."
      },
      {
        "title": "Computer graphics",
        "background": "Graphics uses cross product ideas to place objects, trace rays, or measure surfaces.",
        "numbers": "A point $(1,2,3)$ shifted by $\\langle4,0,-1\\rangle$ becomes $(5,2,2)$."
      },
      {
        "title": "Robotics",
        "background": "Robots use cross product calculations to update position, direction, and local motion.",
        "numbers": "Velocity $\\langle3,4\\rangle$ has speed $5$ per second."
      },
      {
        "title": "Optimization",
        "background": "Training algorithms rely on cross product structure to decide how parameters should move.",
        "numbers": "With learning rate $0.1$ and gradient $\\langle4,-2\\rangle$, the update is $\\langle-0.4,0.2\\rangle$."
      },
      {
        "title": "Data visualization",
        "background": "Plots and maps use cross product to turn tables of numbers into shapes a person can read.",
        "numbers": "A contour value $10$ for $x+y$ includes $(4,6)$ and $(7,3)$."
      },
      {
        "title": "Similarity search",
        "background": "Search systems compare numerical objects, and cross product gives one of the basic comparison languages.",
        "numbers": "Distance from $(0,0)$ to $(6,8)$ is $10$."
      }
    ],
    "applicationsClose": "The same idea keeps changing clothes: geometry, data, and optimization all use this structure once the numbers are in place.",
    "takeaways": [
      "The cross product has a definition you can compute directly.",
      "The geometric interpretation is as important as the arithmetic.",
      "Small numerical examples are the safest way to build intuition.",
      "The same concept reappears in optimization, graphics, and ML data."
    ]
  },
  "math-02-04": {
    "id": "math-02-04",
    "title": "Lines in space",
    "tagline": "A line in space is a starting point plus every scalar multiple of one direction vector.",
    "connections": {
      "buildsOn": [
        "Points and vectors in Rⁿ",
        "The dot product",
        "coordinate equations"
      ],
      "leadsTo": [
        "Vector-valued functions",
        "Space curves",
        "Level sets and contour maps"
      ],
      "usedWith": [
        "direction vectors",
        "normal vectors",
        "parametric equations",
        "linear equations"
      ]
    },
    "motivation": "<p>You already have the coordinate tools from the previous lessons. Now we use them to read line as something concrete rather than as a symbol to memorize.</p><p>The goal is steady and practical: compute carefully, then ask what the result says about direction, shape, rate, or data.</p>",
    "definition": "<p>A line through $P=(x_0,y_0,z_0)$ with nonzero direction $v=\\langle a,b,c\\rangle$ is $r(t)=P+tv=\\langle x_0+at,y_0+bt,z_0+ct\\rangle$.</p><p>The formula works because every point on the line differs from $P$ by some scalar multiple of the same direction. The parameter $t$ tells how many direction-vector steps to take.</p><p><b>Assumptions that matter:</b> the direction must be nonzero; many parameterizations can describe the same line; and one value of $t$ must satisfy all coordinates.</p>",
    "worked": {
      "problem": "Find a line through $(1,2,3)$ in direction $\\langle2,-1,4\\rangle$ and the point at $t=3$.",
      "skills": [
        "line",
        "calculation",
        "interpretation"
      ],
      "strategy": "Use the definition one piece at a time, then read the result geometrically.",
      "steps": [
        {
          "do": "Write vector form",
          "result": "$r(t)=(1,2,3)+t\\langle2,-1,4\\rangle$",
          "why": "point plus direction"
        },
        {
          "do": "Distribute $t$",
          "result": "$\\langle2t,-t,4t\\rangle$",
          "why": "scale components"
        },
        {
          "do": "Add coordinates",
          "result": "$r(t)=\\langle1+2t,2-t,3+4t\\rangle$",
          "why": "parametric form"
        },
        {
          "do": "Substitute $t=3$",
          "result": "$\\langle7,-1,15\\rangle$",
          "why": "evaluate"
        },
        {
          "do": "Check displacement",
          "result": "$\\langle6,-3,12\\rangle=3\\langle2,-1,4\\rangle$",
          "why": "it lies on the line"
        }
      ],
      "verify": "The result matches the expected type and passes the built-in sanity check for this concept.",
      "answer": "$r(t)=(1,2,3)+t\\langle2,-1,4\\rangle$ and $r(3)=(7,-1,15)$.",
      "connects": "This is the central move for understanding line in later ML examples."
    },
    "practice": [
      {
        "problem": "Write a line through $(0,1,2)$ with direction $\\langle1,1,-1\\rangle$ and find $r(2)$.",
        "steps": [
          {
            "do": "Write vector form",
            "result": "$r(t)=(0,1,2)+t\\langle1,1,-1\\rangle$",
            "why": "point plus direction"
          },
          {
            "do": "Distribute $t$",
            "result": "$\\langle t,t,-t\\rangle$",
            "why": "scale components"
          },
          {
            "do": "Add coordinates",
            "result": "$r(t)=\\langle t,1+t,2-t\\rangle$",
            "why": "parametric form"
          },
          {
            "do": "Substitute $t=2$",
            "result": "$r(2)=\\langle2,3,0\\rangle$",
            "why": "evaluate"
          }
        ],
        "answer": "$r(t)=\\langle t,1+t,2-t\\rangle$ and $r(2)=(2,3,0)$."
      },
      {
        "problem": "Find a direction vector for the line through $A=(1,0,4)$ and $B=(3,-2,5)$.",
        "steps": [
          {
            "do": "Subtract endpoints",
            "result": "$B-A$",
            "why": "direction is endpoint minus start"
          },
          {
            "do": "Compute components",
            "result": "$\\langle3-1,-2-0,5-4\\rangle$",
            "why": "coordinate subtraction"
          },
          {
            "do": "Simplify",
            "result": "$\\langle2,-2,1\\rangle$",
            "why": "direction vector"
          },
          {
            "do": "Check",
            "result": "$A+\\langle2,-2,1\\rangle=B$",
            "why": "the displacement lands at $B$"
          }
        ],
        "answer": "$\\langle2,-2,1\\rangle$."
      },
      {
        "problem": "Does $(5,0,7)$ lie on $r(t)=\\langle1+2t,2-t,3+t\\rangle$?",
        "steps": [
          {
            "do": "Use first coordinate",
            "result": "$1+2t=5$",
            "why": "solve for a candidate parameter"
          },
          {
            "do": "Solve",
            "result": "$t=2$",
            "why": "subtract 1 and divide by 2"
          },
          {
            "do": "Check second coordinate",
            "result": "$2-2=0$",
            "why": "matches"
          },
          {
            "do": "Check third coordinate",
            "result": "$3+2=5$",
            "why": "does not equal 7"
          },
          {
            "do": "Conclude",
            "result": "not on the line",
            "why": "one parameter must satisfy all coordinates"
          }
        ],
        "answer": "No."
      },
      {
        "problem": "Find where $r(t)=\\langle2+t,4-2t,1+3t\\rangle$ has $y=0$.",
        "steps": [
          {
            "do": "Set $y$ coordinate to zero",
            "result": "$4-2t=0$",
            "why": "use the condition"
          },
          {
            "do": "Solve",
            "result": "$t=2$",
            "why": "isolate $t$"
          },
          {
            "do": "Compute $x$",
            "result": "$2+2=4$",
            "why": "substitute"
          },
          {
            "do": "Compute $z$",
            "result": "$1+3(2)=7$",
            "why": "substitute"
          },
          {
            "do": "Write point",
            "result": "$(4,0,7)$",
            "why": "collect coordinates"
          }
        ],
        "answer": "$(4,0,7)$."
      },
      {
        "problem": "A parameter vector follows $w(t)=\\langle1,1\\rangle+t\\langle-0.2,0.5\\rangle$. Find $w(4)$.",
        "steps": [
          {
            "do": "Scale direction",
            "result": "$4\\langle-0.2,0.5\\rangle=\\langle-0.8,2\\rangle$",
            "why": "four steps"
          },
          {
            "do": "Add to start",
            "result": "$\\langle1,1\\rangle+\\langle-0.8,2\\rangle$",
            "why": "position plus displacement"
          },
          {
            "do": "Simplify",
            "result": "$\\langle0.2,3\\rangle$",
            "why": "new parameter"
          },
          {
            "do": "Interpret",
            "result": "four equal updates",
            "why": "constant-direction motion"
          }
        ],
        "answer": "$w(4)=\\langle0.2,3\\rangle$."
      }
    ],
    "applications": [
      {
        "title": "Machine learning model geometry",
        "background": "Line appears when feature vectors, parameters, or losses need a geometric reading.",
        "numbers": "For features $\\langle2,3\\rangle$ and weights $\\langle0.5,1\\rangle$, the score is $4$."
      },
      {
        "title": "Computer graphics",
        "background": "Graphics uses line ideas to place objects, trace rays, or measure surfaces.",
        "numbers": "A point $(1,2,3)$ shifted by $\\langle4,0,-1\\rangle$ becomes $(5,2,2)$."
      },
      {
        "title": "Robotics",
        "background": "Robots use line calculations to update position, direction, and local motion.",
        "numbers": "Velocity $\\langle3,4\\rangle$ has speed $5$ per second."
      },
      {
        "title": "Optimization",
        "background": "Training algorithms rely on line structure to decide how parameters should move.",
        "numbers": "With learning rate $0.1$ and gradient $\\langle4,-2\\rangle$, the update is $\\langle-0.4,0.2\\rangle$."
      },
      {
        "title": "Data visualization",
        "background": "Plots and maps use line to turn tables of numbers into shapes a person can read.",
        "numbers": "A contour value $10$ for $x+y$ includes $(4,6)$ and $(7,3)$."
      },
      {
        "title": "Similarity search",
        "background": "Search systems compare numerical objects, and line gives one of the basic comparison languages.",
        "numbers": "Distance from $(0,0)$ to $(6,8)$ is $10$."
      }
    ],
    "applicationsClose": "The same idea keeps changing clothes: geometry, data, and optimization all use this structure once the numbers are in place.",
    "takeaways": [
      "Lines in space has a definition you can compute directly.",
      "The geometric interpretation is as important as the arithmetic.",
      "Small numerical examples are the safest way to build intuition.",
      "The same concept reappears in optimization, graphics, and ML data."
    ]
  },
  "math-02-05": {
    "id": "math-02-05",
    "title": "Planes in space",
    "tagline": "A plane is the set of points whose displacement from a base point is perpendicular to one normal vector.",
    "connections": {
      "buildsOn": [
        "Points and vectors in Rⁿ",
        "The dot product",
        "coordinate equations"
      ],
      "leadsTo": [
        "Vector-valued functions",
        "Space curves",
        "Level sets and contour maps"
      ],
      "usedWith": [
        "direction vectors",
        "normal vectors",
        "parametric equations",
        "linear equations"
      ]
    },
    "motivation": "<p>You already have the coordinate tools from the previous lessons. Now we use them to read plane as something concrete rather than as a symbol to memorize.</p><p>The goal is steady and practical: compute carefully, then ask what the result says about direction, shape, rate, or data.</p>",
    "definition": "<p>A plane through $P_0=(x_0,y_0,z_0)$ with nonzero normal $n=\\langle a,b,c\\rangle$ is $n\\cdot\\langle x-x_0,y-y_0,z-z_0\\rangle=0$.</p><p>Expanding gives $a(x-x_0)+b(y-y_0)+c(z-z_0)=0$, or $ax+by+cz=d$. The dot product is zero because in-plane displacement is perpendicular to the normal.</p><p><b>Assumptions that matter:</b> the normal must be nonzero; proportional normals give parallel planes; and the equation describes a flat two-dimensional set in $\\mathbb R^3$.</p>",
    "worked": {
      "problem": "Find the plane through $(1,2,3)$ with normal $\\langle2,-1,4\\rangle$.",
      "skills": [
        "plane",
        "calculation",
        "interpretation"
      ],
      "strategy": "Use the definition one piece at a time, then read the result geometrically.",
      "steps": [
        {
          "do": "Write displacement",
          "result": "$\\langle x-1,y-2,z-3\\rangle$",
          "why": "from base point"
        },
        {
          "do": "Dot with normal",
          "result": "$2(x-1)-(y-2)+4(z-3)=0$",
          "why": "perpendicular condition"
        },
        {
          "do": "Expand",
          "result": "$2x-2-y+2+4z-12=0$",
          "why": "distribute"
        },
        {
          "do": "Simplify constants",
          "result": "$2x-y+4z-12=0$",
          "why": "combine constants"
        },
        {
          "do": "Solve standard form",
          "result": "$2x-y+4z=12$",
          "why": "move constant"
        }
      ],
      "verify": "The result matches the expected type and passes the built-in sanity check for this concept.",
      "answer": "$2x-y+4z=12$.",
      "connects": "This is the central move for understanding plane in later ML examples."
    },
    "practice": [
      {
        "problem": "Find a plane through $(0,0,1)$ with normal $\\langle1,2,3\\rangle$.",
        "steps": [
          {
            "do": "Write displacement",
            "result": "$\\langle x,y,z-1\\rangle$",
            "why": "subtract base point"
          },
          {
            "do": "Dot with normal",
            "result": "$x+2y+3(z-1)=0$",
            "why": "perpendicular condition"
          },
          {
            "do": "Expand",
            "result": "$x+2y+3z-3=0$",
            "why": "distribute"
          },
          {
            "do": "Solve standard form",
            "result": "$x+2y+3z=3$",
            "why": "move constant"
          }
        ],
        "answer": "$x+2y+3z=3$."
      },
      {
        "problem": "Does $(2,1,3)$ lie on $x+2y-z=1$?",
        "steps": [
          {
            "do": "Substitute",
            "result": "$2+2(1)-3$",
            "why": "evaluate left side"
          },
          {
            "do": "Simplify",
            "result": "$1$",
            "why": "arithmetic"
          },
          {
            "do": "Compare",
            "result": "$1=1$",
            "why": "equation holds"
          },
          {
            "do": "Conclude",
            "result": "point lies on the plane",
            "why": "membership test passed"
          }
        ],
        "answer": "Yes."
      },
      {
        "problem": "Find a normal vector to $3x-y+2z=7$.",
        "steps": [
          {
            "do": "Read $x$ coefficient",
            "result": "$3$",
            "why": "plane coefficients form a normal"
          },
          {
            "do": "Read $y$ coefficient",
            "result": "$-1$",
            "why": "include sign"
          },
          {
            "do": "Read $z$ coefficient",
            "result": "$2$",
            "why": "third coefficient"
          },
          {
            "do": "Write vector",
            "result": "$\\langle3,-1,2\\rangle$",
            "why": "normal vector"
          }
        ],
        "answer": "$\\langle3,-1,2\\rangle$."
      },
      {
        "problem": "Are $2x+4y-2z=1$ and $x+2y-z=5$ parallel?",
        "steps": [
          {
            "do": "Read normals",
            "result": "$\\langle2,4,-2\\rangle$ and $\\langle1,2,-1\\rangle$",
            "why": "coefficients"
          },
          {
            "do": "Compare normals",
            "result": "$\\langle2,4,-2\\rangle=2\\langle1,2,-1\\rangle$",
            "why": "proportional"
          },
          {
            "do": "Compare constants",
            "result": "$1\\ne10$",
            "why": "not the same plane"
          },
          {
            "do": "Conclude",
            "result": "parallel and distinct",
            "why": "same normal direction, different offset"
          }
        ],
        "answer": "They are parallel and distinct."
      },
      {
        "problem": "Find the plane through the origin spanned by $\\langle1,0,1\\rangle$ and $\\langle0,2,1\\rangle$.",
        "steps": [
          {
            "do": "Compute a normal",
            "result": "$\\langle1,0,1\\rangle\\times\\langle0,2,1\\rangle=\\langle-2,-1,2\\rangle$",
            "why": "cross product"
          },
          {
            "do": "Use origin displacement",
            "result": "$\\langle x,y,z\\rangle$",
            "why": "base point is zero"
          },
          {
            "do": "Dot with normal",
            "result": "$-2x-y+2z=0$",
            "why": "plane condition"
          },
          {
            "do": "Check first direction",
            "result": "$-2+0+2=0$",
            "why": "spanning vector lies in plane"
          },
          {
            "do": "Check second direction",
            "result": "$0-2+2=0$",
            "why": "second vector also lies in plane"
          }
        ],
        "answer": "$-2x-y+2z=0$."
      }
    ],
    "applications": [
      {
        "title": "Machine learning model geometry",
        "background": "Plane appears when feature vectors, parameters, or losses need a geometric reading.",
        "numbers": "For features $\\langle2,3\\rangle$ and weights $\\langle0.5,1\\rangle$, the score is $4$."
      },
      {
        "title": "Computer graphics",
        "background": "Graphics uses plane ideas to place objects, trace rays, or measure surfaces.",
        "numbers": "A point $(1,2,3)$ shifted by $\\langle4,0,-1\\rangle$ becomes $(5,2,2)$."
      },
      {
        "title": "Robotics",
        "background": "Robots use plane calculations to update position, direction, and local motion.",
        "numbers": "Velocity $\\langle3,4\\rangle$ has speed $5$ per second."
      },
      {
        "title": "Optimization",
        "background": "Training algorithms rely on plane structure to decide how parameters should move.",
        "numbers": "With learning rate $0.1$ and gradient $\\langle4,-2\\rangle$, the update is $\\langle-0.4,0.2\\rangle$."
      },
      {
        "title": "Data visualization",
        "background": "Plots and maps use plane to turn tables of numbers into shapes a person can read.",
        "numbers": "A contour value $10$ for $x+y$ includes $(4,6)$ and $(7,3)$."
      },
      {
        "title": "Similarity search",
        "background": "Search systems compare numerical objects, and plane gives one of the basic comparison languages.",
        "numbers": "Distance from $(0,0)$ to $(6,8)$ is $10$."
      }
    ],
    "applicationsClose": "The same idea keeps changing clothes: geometry, data, and optimization all use this structure once the numbers are in place.",
    "takeaways": [
      "Planes in space has a definition you can compute directly.",
      "The geometric interpretation is as important as the arithmetic.",
      "Small numerical examples are the safest way to build intuition.",
      "The same concept reappears in optimization, graphics, and ML data."
    ]
  },
  "math-02-06": {
    "id": "math-02-06",
    "title": "Vector-valued functions",
    "tagline": "A vector-valued function lets each input time return a whole position vector.",
    "connections": {
      "buildsOn": [
        "Lines in space",
        "derivatives",
        "vectors"
      ],
      "leadsTo": [
        "Functions of several variables",
        "Level sets and contour maps",
        "The gradient"
      ],
      "usedWith": [
        "tangent vectors",
        "speed",
        "parametric equations",
        "coordinate functions"
      ]
    },
    "motivation": "<p>You already have the coordinate tools from the previous lessons. Now we use them to read vector-valued function as something concrete rather than as a symbol to memorize.</p><p>The goal is steady and practical: compute carefully, then ask what the result says about direction, shape, rate, or data.</p>",
    "definition": "<p>A <b>vector-valued function</b> has form $r(t)=\\langle f(t),g(t),h(t)\\rangle$. Its derivative is componentwise: $r'(t)=\\langle f'(t),g'(t),h'(t)\\rangle$.</p><p>When $t$ is time, $r(t)$ is position, $r'(t)$ is velocity, and $\\|r'(t)\\|$ is speed. The coordinates change separately but describe one motion together.</p><p><b>Assumptions that matter:</b> each component must be defined; differentiability requires differentiable components; and the parameter need not be time unless the model says so.</p>",
    "worked": {
      "problem": "For $r(t)=\\langle t^2,2t,3-t\\rangle$, find $r(2)$ and $r'(2)$.",
      "skills": [
        "vector-valued function",
        "calculation",
        "interpretation"
      ],
      "strategy": "Use the definition one piece at a time, then read the result geometrically.",
      "steps": [
        {
          "do": "Evaluate first component",
          "result": "$2^2=4$",
          "why": "position coordinate"
        },
        {
          "do": "Evaluate second component",
          "result": "$2\\cdot2=4$",
          "why": "position coordinate"
        },
        {
          "do": "Evaluate third component",
          "result": "$3-2=1$",
          "why": "position coordinate"
        },
        {
          "do": "Differentiate",
          "result": "$r'(t)=\\langle2t,2,-1\\rangle$",
          "why": "componentwise"
        },
        {
          "do": "Evaluate derivative",
          "result": "$r'(2)=\\langle4,2,-1\\rangle$",
          "why": "velocity at $t=2$"
        }
      ],
      "verify": "The result matches the expected type and passes the built-in sanity check for this concept.",
      "answer": "$r(2)=\\langle4,4,1\\rangle$ and $r'(2)=\\langle4,2,-1\\rangle$.",
      "connects": "This is the central move for understanding vector-valued function in later ML examples."
    },
    "practice": [
      {
        "problem": "Evaluate $r(1)$ for $r(t)=\\langle t,t^2,2-t\\rangle$.",
        "steps": [
          {
            "do": "First component",
            "result": "$1$",
            "why": "substitute"
          },
          {
            "do": "Second component",
            "result": "$1^2=1$",
            "why": "substitute"
          },
          {
            "do": "Third component",
            "result": "$2-1=1$",
            "why": "substitute"
          },
          {
            "do": "Collect",
            "result": "$\\langle1,1,1\\rangle$",
            "why": "vector output"
          }
        ],
        "answer": "$\\langle1,1,1\\rangle$."
      },
      {
        "problem": "Differentiate $r(t)=\\langle3t,t^2,e^t\\rangle$.",
        "steps": [
          {
            "do": "Differentiate first component",
            "result": "$3$",
            "why": "derivative of $3t$"
          },
          {
            "do": "Differentiate second component",
            "result": "$2t$",
            "why": "power rule"
          },
          {
            "do": "Differentiate third component",
            "result": "$e^t$",
            "why": "exponential derivative"
          },
          {
            "do": "Assemble",
            "result": "$r'(t)=\\langle3,2t,e^t\\rangle$",
            "why": "componentwise derivative"
          }
        ],
        "answer": "$r'(t)=\\langle3,2t,e^t\\rangle$."
      },
      {
        "problem": "Find the speed for $r(t)=\\langle3t,4t\\rangle$.",
        "steps": [
          {
            "do": "Differentiate",
            "result": "$r'(t)=\\langle3,4\\rangle$",
            "why": "velocity"
          },
          {
            "do": "Square components",
            "result": "$3^2+4^2=25$",
            "why": "norm squared"
          },
          {
            "do": "Take square root",
            "result": "$5$",
            "why": "speed"
          },
          {
            "do": "Interpret",
            "result": "constant speed",
            "why": "velocity does not depend on $t$"
          }
        ],
        "answer": "$5$."
      },
      {
        "problem": "Find the tangent line to $r(t)=\\langle t,t^2,1\\rangle$ at $t=2$.",
        "steps": [
          {
            "do": "Compute point",
            "result": "$r(2)=\\langle2,4,1\\rangle$",
            "why": "base point"
          },
          {
            "do": "Differentiate",
            "result": "$r'(t)=\\langle1,2t,0\\rangle$",
            "why": "tangent direction"
          },
          {
            "do": "Evaluate direction",
            "result": "$r'(2)=\\langle1,4,0\\rangle$",
            "why": "direction at the point"
          },
          {
            "do": "Write line",
            "result": "$\\ell(s)=\\langle2,4,1\\rangle+s\\langle1,4,0\\rangle$",
            "why": "point plus direction"
          }
        ],
        "answer": "$\\ell(s)=\\langle2,4,1\\rangle+s\\langle1,4,0\\rangle$."
      },
      {
        "problem": "For $w(t)=\\langle1-0.2t,0.5t\\rangle$, find $w(5)$ and speed.",
        "steps": [
          {
            "do": "Evaluate position",
            "result": "$w(5)=\\langle0,2.5\\rangle$",
            "why": "substitute"
          },
          {
            "do": "Differentiate",
            "result": "$w'(t)=\\langle-0.2,0.5\\rangle$",
            "why": "velocity"
          },
          {
            "do": "Compute speed squared",
            "result": "$0.04+0.25=0.29$",
            "why": "norm squared"
          },
          {
            "do": "Take square root",
            "result": "$\\sqrt{0.29}\\u0007pprox0.539$",
            "why": "speed"
          },
          {
            "do": "Interpret",
            "result": "constant velocity",
            "why": "same speed for all $t$"
          }
        ],
        "answer": "$w(5)=\\langle0,2.5\\rangle$, speed $\\sqrt{0.29}\\u0007pprox0.539$."
      }
    ],
    "applications": [
      {
        "title": "Machine learning model geometry",
        "background": "Vector-Valued Function appears when feature vectors, parameters, or losses need a geometric reading.",
        "numbers": "For features $\\langle2,3\\rangle$ and weights $\\langle0.5,1\\rangle$, the score is $4$."
      },
      {
        "title": "Computer graphics",
        "background": "Graphics uses vector-valued function ideas to place objects, trace rays, or measure surfaces.",
        "numbers": "A point $(1,2,3)$ shifted by $\\langle4,0,-1\\rangle$ becomes $(5,2,2)$."
      },
      {
        "title": "Robotics",
        "background": "Robots use vector-valued function calculations to update position, direction, and local motion.",
        "numbers": "Velocity $\\langle3,4\\rangle$ has speed $5$ per second."
      },
      {
        "title": "Optimization",
        "background": "Training algorithms rely on vector-valued function structure to decide how parameters should move.",
        "numbers": "With learning rate $0.1$ and gradient $\\langle4,-2\\rangle$, the update is $\\langle-0.4,0.2\\rangle$."
      },
      {
        "title": "Data visualization",
        "background": "Plots and maps use vector-valued function to turn tables of numbers into shapes a person can read.",
        "numbers": "A contour value $10$ for $x+y$ includes $(4,6)$ and $(7,3)$."
      },
      {
        "title": "Similarity search",
        "background": "Search systems compare numerical objects, and vector-valued function gives one of the basic comparison languages.",
        "numbers": "Distance from $(0,0)$ to $(6,8)$ is $10$."
      }
    ],
    "applicationsClose": "The same idea keeps changing clothes: geometry, data, and optimization all use this structure once the numbers are in place.",
    "takeaways": [
      "Vector-valued functions has a definition you can compute directly.",
      "The geometric interpretation is as important as the arithmetic.",
      "Small numerical examples are the safest way to build intuition.",
      "The same concept reappears in optimization, graphics, and ML data."
    ]
  },
  "math-02-07": {
    "id": "math-02-07",
    "title": "Space curves",
    "tagline": "A space curve is the path traced by a vector-valued function as its parameter changes.",
    "connections": {
      "buildsOn": [
        "Lines in space",
        "derivatives",
        "vectors"
      ],
      "leadsTo": [
        "Functions of several variables",
        "Level sets and contour maps",
        "The gradient"
      ],
      "usedWith": [
        "tangent vectors",
        "speed",
        "parametric equations",
        "coordinate functions"
      ]
    },
    "motivation": "<p>You already have the coordinate tools from the previous lessons. Now we use them to read space curve as something concrete rather than as a symbol to memorize.</p><p>The goal is steady and practical: compute carefully, then ask what the result says about direction, shape, rate, or data.</p>",
    "definition": "<p>A <b>space curve</b> is the set of points traced by $r(t)=\\langle x(t),y(t),z(t)\\rangle$. The tangent vector is $r'(t)$, and the speed is $\\|r'(t)\\|$.</p><p>The helix $\\langle\\cos t,\\sin t,t\\rangle$ is a good mental model: circular motion in two coordinates while the third coordinate rises.</p><p><b>Assumptions that matter:</b> the parameter interval matters; a nonzero derivative gives a tangent direction; and different parameterizations can trace the same curve at different speeds.</p>",
    "worked": {
      "problem": "For $r(t)=\\langle\\cos t,\\sin t,t\\rangle$, find the speed at $t=0$.",
      "skills": [
        "space curve",
        "calculation",
        "interpretation"
      ],
      "strategy": "Use the definition one piece at a time, then read the result geometrically.",
      "steps": [
        {
          "do": "Differentiate",
          "result": "$r'(t)=\\langle-\\sin t,\\cos t,1\\rangle$",
          "why": "componentwise derivative"
        },
        {
          "do": "Evaluate sine",
          "result": "$-\\sin0=0$",
          "why": "first velocity component"
        },
        {
          "do": "Evaluate cosine",
          "result": "$\\cos0=1$",
          "why": "second velocity component"
        },
        {
          "do": "Write velocity",
          "result": "$r'(0)=\\langle0,1,1\\rangle$",
          "why": "collect components"
        },
        {
          "do": "Compute speed",
          "result": "$\\sqrt{0^2+1^2+1^2}=\\sqrt2$",
          "why": "norm of velocity"
        }
      ],
      "verify": "The result matches the expected type and passes the built-in sanity check for this concept.",
      "answer": "The speed is $\\sqrt2$.",
      "connects": "This is the central move for understanding space curve in later ML examples."
    },
    "practice": [
      {
        "problem": "For $r(t)=\\langle t,0,t^2\\rangle$, find velocity at $t=3$.",
        "steps": [
          {
            "do": "Differentiate",
            "result": "$r'(t)=\\langle1,0,2t\\rangle$",
            "why": "tangent vector"
          },
          {
            "do": "Substitute $t=3$",
            "result": "$r'(3)=\\langle1,0,6\\rangle$",
            "why": "velocity"
          },
          {
            "do": "Compute speed if desired",
            "result": "$\\sqrt{1+36}=\\sqrt{37}$",
            "why": "norm"
          },
          {
            "do": "Interpret",
            "result": "tangent direction",
            "why": "instantaneous motion"
          }
        ],
        "answer": "Velocity is $\\langle1,0,6\\rangle$."
      },
      {
        "problem": "Find speed of $r(t)=\\langle\\cos t,\\sin t,0\\rangle$.",
        "steps": [
          {
            "do": "Differentiate",
            "result": "$r'(t)=\\langle-\\sin t,\\cos t,0\\rangle$",
            "why": "velocity"
          },
          {
            "do": "Square components",
            "result": "$\\sin^2t+\\cos^2t$",
            "why": "norm squared"
          },
          {
            "do": "Use identity",
            "result": "$1$",
            "why": "unit circle identity"
          },
          {
            "do": "Take square root",
            "result": "$1$",
            "why": "constant speed"
          }
        ],
        "answer": "Speed is $1$."
      },
      {
        "problem": "Find the point on $r(t)=\\langle2t,1-t,t+3\\rangle$ when $z=7$.",
        "steps": [
          {
            "do": "Set $z$ coordinate",
            "result": "$t+3=7$",
            "why": "condition"
          },
          {
            "do": "Solve",
            "result": "$t=4$",
            "why": "subtract 3"
          },
          {
            "do": "Compute $x$",
            "result": "$2(4)=8$",
            "why": "substitute"
          },
          {
            "do": "Compute $y$",
            "result": "$1-4=-3$",
            "why": "substitute"
          },
          {
            "do": "Write point",
            "result": "$(8,-3,7)$",
            "why": "collect"
          }
        ],
        "answer": "$(8,-3,7)$."
      },
      {
        "problem": "For helix $r(t)=\\langle\\cos t,\\sin t,t\\rangle$, find the rise after one turn.",
        "steps": [
          {
            "do": "One turn in angle",
            "result": "$\\Delta t=2\\pi$",
            "why": "sine and cosine repeat"
          },
          {
            "do": "Read $z(t)$",
            "result": "$z=t$",
            "why": "height coordinate"
          },
          {
            "do": "Compute rise",
            "result": "$2\\pi-0=2\\pi$",
            "why": "change in $z$"
          },
          {
            "do": "Interpret",
            "result": "one turn rises $2\\pi$",
            "why": "helix pitch"
          }
        ],
        "answer": "The rise is $2\\pi$."
      },
      {
        "problem": "A tracked point moves from $(0,0,0)$ to $(1,2,2)$ in one frame. Find displacement and distance.",
        "steps": [
          {
            "do": "Subtract positions",
            "result": "$\\langle1,2,2\\rangle$",
            "why": "end minus start"
          },
          {
            "do": "Square components",
            "result": "$1+4+4=9$",
            "why": "distance squared"
          },
          {
            "do": "Take square root",
            "result": "$3$",
            "why": "distance"
          },
          {
            "do": "Interpret",
            "result": "average speed is $3$ per frame",
            "why": "if frame interval is one"
          }
        ],
        "answer": "Displacement $\\langle1,2,2\\rangle$, distance $3$."
      }
    ],
    "applications": [
      {
        "title": "Machine learning model geometry",
        "background": "Space Curve appears when feature vectors, parameters, or losses need a geometric reading.",
        "numbers": "For features $\\langle2,3\\rangle$ and weights $\\langle0.5,1\\rangle$, the score is $4$."
      },
      {
        "title": "Computer graphics",
        "background": "Graphics uses space curve ideas to place objects, trace rays, or measure surfaces.",
        "numbers": "A point $(1,2,3)$ shifted by $\\langle4,0,-1\\rangle$ becomes $(5,2,2)$."
      },
      {
        "title": "Robotics",
        "background": "Robots use space curve calculations to update position, direction, and local motion.",
        "numbers": "Velocity $\\langle3,4\\rangle$ has speed $5$ per second."
      },
      {
        "title": "Optimization",
        "background": "Training algorithms rely on space curve structure to decide how parameters should move.",
        "numbers": "With learning rate $0.1$ and gradient $\\langle4,-2\\rangle$, the update is $\\langle-0.4,0.2\\rangle$."
      },
      {
        "title": "Data visualization",
        "background": "Plots and maps use space curve to turn tables of numbers into shapes a person can read.",
        "numbers": "A contour value $10$ for $x+y$ includes $(4,6)$ and $(7,3)$."
      },
      {
        "title": "Similarity search",
        "background": "Search systems compare numerical objects, and space curve gives one of the basic comparison languages.",
        "numbers": "Distance from $(0,0)$ to $(6,8)$ is $10$."
      }
    ],
    "applicationsClose": "The same idea keeps changing clothes: geometry, data, and optimization all use this structure once the numbers are in place.",
    "takeaways": [
      "Space curves has a definition you can compute directly.",
      "The geometric interpretation is as important as the arithmetic.",
      "Small numerical examples are the safest way to build intuition.",
      "The same concept reappears in optimization, graphics, and ML data."
    ]
  },
  "math-02-08": {
    "id": "math-02-08",
    "title": "Functions of several variables",
    "tagline": "A multivariable function turns several inputs into one output, like height over a landscape.",
    "connections": {
      "buildsOn": [
        "Functions and their graphs",
        "Points and vectors in Rⁿ",
        "single-variable limits"
      ],
      "leadsTo": [
        "Partial derivatives",
        "The gradient",
        "Directional derivatives"
      ],
      "usedWith": [
        "domains",
        "surfaces",
        "contours",
        "paths"
      ]
    },
    "motivation": "<p>You already have the coordinate tools from the previous lessons. Now we use them to read multivariable function as something concrete rather than as a symbol to memorize.</p><p>The goal is steady and practical: compute carefully, then ask what the result says about direction, shape, rate, or data.</p>",
    "definition": "<p>A <b>function of several variables</b> assigns one scalar output to each allowed input tuple, such as $z=f(x,y)$ or $f(x_1,\\ldots,x_n)$.</p><p>For two inputs, the graph is a surface. The domain is a region of input space, and restrictions come from denominators, roots, logarithms, or the model context.</p><p><b>Assumptions that matter:</b> the input tuple must be in the domain; output here is scalar; and order of variables matters.</p>",
    "worked": {
      "problem": "For $f(x,y)=x^2+3xy-y^2$, compute $f(2,-1)$.",
      "skills": [
        "multivariable function",
        "calculation",
        "interpretation"
      ],
      "strategy": "Use the definition one piece at a time, then read the result geometrically.",
      "steps": [
        {
          "do": "Substitute both variables",
          "result": "$2^2+3(2)(-1)-(-1)^2$",
          "why": "replace $x$ and $y$"
        },
        {
          "do": "Compute first term",
          "result": "$4+3(2)(-1)-(-1)^2$",
          "why": "square $2$"
        },
        {
          "do": "Compute product term",
          "result": "$4-6-(-1)^2$",
          "why": "multiply"
        },
        {
          "do": "Compute last term",
          "result": "$4-6-1$",
          "why": "square $-1$"
        },
        {
          "do": "Add",
          "result": "$-3$",
          "why": "combine terms"
        }
      ],
      "verify": "The result matches the expected type and passes the built-in sanity check for this concept.",
      "answer": "$f(2,-1)=-3$.",
      "connects": "This is the central move for understanding multivariable function in later ML examples."
    },
    "practice": [
      {
        "problem": "Compute $f(1,3)$ for $f(x,y)=2x+y^2$.",
        "steps": [
          {
            "do": "Substitute",
            "result": "$2(1)+3^2$",
            "why": "use both inputs"
          },
          {
            "do": "Square",
            "result": "$2+9$",
            "why": "power first"
          },
          {
            "do": "Add",
            "result": "$11$",
            "why": "scalar output"
          },
          {
            "do": "Write graph point",
            "result": "$(1,3,11)$",
            "why": "surface point"
          }
        ],
        "answer": "$11$."
      },
      {
        "problem": "Find the domain of $g(x,y)=\\sqrt{x-y}$.",
        "steps": [
          {
            "do": "Require radicand nonnegative",
            "result": "$x-y\\ge0$",
            "why": "real square root"
          },
          {
            "do": "Solve",
            "result": "$x\\ge y$",
            "why": "add $y$"
          },
          {
            "do": "Describe region",
            "result": "on or below $y=x$",
            "why": "same inequality"
          },
          {
            "do": "Include boundary",
            "result": "$x=y$ allowed",
            "why": "square root of zero is legal"
          }
        ],
        "answer": "All $(x,y)$ with $x\\ge y$."
      },
      {
        "problem": "Evaluate $L(w,b)=(2w+b-5)^2$ at $(1,2)$.",
        "steps": [
          {
            "do": "Substitute",
            "result": "$(2(1)+2-5)^2$",
            "why": "plug in parameters"
          },
          {
            "do": "Simplify inside",
            "result": "$(-1)^2$",
            "why": "residual"
          },
          {
            "do": "Square",
            "result": "$1$",
            "why": "loss"
          },
          {
            "do": "Interpret",
            "result": "nonnegative error",
            "why": "squared loss"
          }
        ],
        "answer": "$1$."
      },
      {
        "problem": "Find where $h(x,y)=1/(x+y)$ is defined.",
        "steps": [
          {
            "do": "Identify denominator",
            "result": "$x+y$",
            "why": "division restriction"
          },
          {
            "do": "Exclude zero",
            "result": "$x+y\\ne0$",
            "why": "no division by zero"
          },
          {
            "do": "Solve line",
            "result": "$y\\ne -x$",
            "why": "excluded line"
          },
          {
            "do": "State domain",
            "result": "all points not on $y=-x$",
            "why": "allowed region"
          }
        ],
        "answer": "$\\{(x,y):x+y\\ne0\\}$."
      },
      {
        "problem": "For $f(x,y,z)=x+2y+3z$, compute $f(1,0,4)$.",
        "steps": [
          {
            "do": "Substitute",
            "result": "$1+2(0)+3(4)$",
            "why": "weighted sum"
          },
          {
            "do": "Multiply",
            "result": "$1+0+12$",
            "why": "component weights"
          },
          {
            "do": "Add",
            "result": "$13$",
            "why": "score"
          },
          {
            "do": "Interpret",
            "result": "linear feature score",
            "why": "one scalar output"
          }
        ],
        "answer": "$13$."
      }
    ],
    "applications": [
      {
        "title": "Machine learning model geometry",
        "background": "Multivariable Function appears when feature vectors, parameters, or losses need a geometric reading.",
        "numbers": "For features $\\langle2,3\\rangle$ and weights $\\langle0.5,1\\rangle$, the score is $4$."
      },
      {
        "title": "Computer graphics",
        "background": "Graphics uses multivariable function ideas to place objects, trace rays, or measure surfaces.",
        "numbers": "A point $(1,2,3)$ shifted by $\\langle4,0,-1\\rangle$ becomes $(5,2,2)$."
      },
      {
        "title": "Robotics",
        "background": "Robots use multivariable function calculations to update position, direction, and local motion.",
        "numbers": "Velocity $\\langle3,4\\rangle$ has speed $5$ per second."
      },
      {
        "title": "Optimization",
        "background": "Training algorithms rely on multivariable function structure to decide how parameters should move.",
        "numbers": "With learning rate $0.1$ and gradient $\\langle4,-2\\rangle$, the update is $\\langle-0.4,0.2\\rangle$."
      },
      {
        "title": "Data visualization",
        "background": "Plots and maps use multivariable function to turn tables of numbers into shapes a person can read.",
        "numbers": "A contour value $10$ for $x+y$ includes $(4,6)$ and $(7,3)$."
      },
      {
        "title": "Similarity search",
        "background": "Search systems compare numerical objects, and multivariable function gives one of the basic comparison languages.",
        "numbers": "Distance from $(0,0)$ to $(6,8)$ is $10$."
      }
    ],
    "applicationsClose": "The same idea keeps changing clothes: geometry, data, and optimization all use this structure once the numbers are in place.",
    "takeaways": [
      "Functions of several variables has a definition you can compute directly.",
      "The geometric interpretation is as important as the arithmetic.",
      "Small numerical examples are the safest way to build intuition.",
      "The same concept reappears in optimization, graphics, and ML data."
    ]
  },
  "math-02-09": {
    "id": "math-02-09",
    "title": "Level sets and contour maps",
    "tagline": "A level set collects all inputs that give the same output height.",
    "connections": {
      "buildsOn": [
        "Functions and their graphs",
        "Points and vectors in Rⁿ",
        "single-variable limits"
      ],
      "leadsTo": [
        "Partial derivatives",
        "The gradient",
        "Directional derivatives"
      ],
      "usedWith": [
        "domains",
        "surfaces",
        "contours",
        "paths"
      ]
    },
    "motivation": "<p>You already have the coordinate tools from the previous lessons. Now we use them to read level set as something concrete rather than as a symbol to memorize.</p><p>The goal is steady and practical: compute carefully, then ask what the result says about direction, shape, rate, or data.</p>",
    "definition": "<p>A <b>level set</b> of $f$ at value $c$ is the set of inputs satisfying $f(x,y)=c$. For two-input functions, level sets are contour curves in the input plane.</p><p>Contours are a top-down view of a surface: instead of drawing height directly, they connect points of equal height.</p><p><b>Assumptions that matter:</b> the level value must be attainable; contours live in input space; and close contours signal rapid change.</p>",
    "worked": {
      "problem": "Describe the level set $x^2+y^2=25$ and find two points on it.",
      "skills": [
        "level set",
        "calculation",
        "interpretation"
      ],
      "strategy": "Use the definition one piece at a time, then read the result geometrically.",
      "steps": [
        {
          "do": "Recognize the form",
          "result": "$x^2+y^2=5^2$",
          "why": "circle equation"
        },
        {
          "do": "State the center",
          "result": "$(0,0)$",
          "why": "no shifts appear"
        },
        {
          "do": "State the radius",
          "result": "$5$",
          "why": "square root of 25"
        },
        {
          "do": "Find one point",
          "result": "$(5,0)$",
          "why": "$25+0=25$"
        },
        {
          "do": "Find another point",
          "result": "$(3,4)$",
          "why": "$9+16=25$"
        }
      ],
      "verify": "The result matches the expected type and passes the built-in sanity check for this concept.",
      "answer": "It is the circle of radius $5$ centered at the origin; $(5,0)$ and $(3,4)$ lie on it.",
      "connects": "This is the central move for understanding level set in later ML examples."
    },
    "practice": [
      {
        "problem": "Find the level set of $f(x,y)=x+y$ at value $4$.",
        "steps": [
          {
            "do": "Set equal to level",
            "result": "$x+y=4$",
            "why": "definition"
          },
          {
            "do": "Solve for $y$",
            "result": "$y=4-x$",
            "why": "line form"
          },
          {
            "do": "Find one point",
            "result": "$(0,4)$",
            "why": "satisfies equation"
          },
          {
            "do": "Find another point",
            "result": "$(4,0)$",
            "why": "also satisfies"
          }
        ],
        "answer": "The line $x+y=4$."
      },
      {
        "problem": "Describe $x^2+y^2=9$.",
        "steps": [
          {
            "do": "Recognize form",
            "result": "$x^2+y^2=3^2$",
            "why": "circle"
          },
          {
            "do": "Find center",
            "result": "$(0,0)$",
            "why": "no shifts"
          },
          {
            "do": "Find radius",
            "result": "$3$",
            "why": "square root of 9"
          },
          {
            "do": "Give point",
            "result": "$(0,3)$",
            "why": "on the circle"
          }
        ],
        "answer": "Circle centered at $(0,0)$ with radius $3$."
      },
      {
        "problem": "Find the contour of $f(x,y)=2x-y$ through $(1,1)$.",
        "steps": [
          {
            "do": "Compute level",
            "result": "$f(1,1)=1$",
            "why": "height at point"
          },
          {
            "do": "Set equal",
            "result": "$2x-y=1$",
            "why": "same height"
          },
          {
            "do": "Solve for $y$",
            "result": "$y=2x-1$",
            "why": "line contour"
          },
          {
            "do": "Check point",
            "result": "$1=2(1)-1$",
            "why": "verified"
          }
        ],
        "answer": "$2x-y=1$."
      },
      {
        "problem": "Describe level $4$ of $L(w,b)=(w-2)^2+(b+1)^2$.",
        "steps": [
          {
            "do": "Set equal",
            "result": "$(w-2)^2+(b+1)^2=4$",
            "why": "level set"
          },
          {
            "do": "Read center",
            "result": "$(2,-1)$",
            "why": "shifted circle"
          },
          {
            "do": "Read radius",
            "result": "$2$",
            "why": "square root of 4"
          },
          {
            "do": "Give point",
            "result": "$(4,-1)$",
            "why": "two units right"
          }
        ],
        "answer": "Circle centered at $(2,-1)$ with radius $2$."
      },
      {
        "problem": "For boundary $0.6x+0.8y=2.4$, find intercepts.",
        "steps": [
          {
            "do": "Set $y=0$",
            "result": "$0.6x=2.4$",
            "why": "x-intercept"
          },
          {
            "do": "Solve",
            "result": "$x=4$",
            "why": "divide"
          },
          {
            "do": "Set $x=0$",
            "result": "$0.8y=2.4$",
            "why": "y-intercept"
          },
          {
            "do": "Solve",
            "result": "$y=3$",
            "why": "divide"
          },
          {
            "do": "State intercepts",
            "result": "$(4,0)$ and $(0,3)$",
            "why": "boundary points"
          }
        ],
        "answer": "$(4,0)$ and $(0,3)$."
      }
    ],
    "applications": [
      {
        "title": "Machine learning model geometry",
        "background": "Level Set appears when feature vectors, parameters, or losses need a geometric reading.",
        "numbers": "For features $\\langle2,3\\rangle$ and weights $\\langle0.5,1\\rangle$, the score is $4$."
      },
      {
        "title": "Computer graphics",
        "background": "Graphics uses level set ideas to place objects, trace rays, or measure surfaces.",
        "numbers": "A point $(1,2,3)$ shifted by $\\langle4,0,-1\\rangle$ becomes $(5,2,2)$."
      },
      {
        "title": "Robotics",
        "background": "Robots use level set calculations to update position, direction, and local motion.",
        "numbers": "Velocity $\\langle3,4\\rangle$ has speed $5$ per second."
      },
      {
        "title": "Optimization",
        "background": "Training algorithms rely on level set structure to decide how parameters should move.",
        "numbers": "With learning rate $0.1$ and gradient $\\langle4,-2\\rangle$, the update is $\\langle-0.4,0.2\\rangle$."
      },
      {
        "title": "Data visualization",
        "background": "Plots and maps use level set to turn tables of numbers into shapes a person can read.",
        "numbers": "A contour value $10$ for $x+y$ includes $(4,6)$ and $(7,3)$."
      },
      {
        "title": "Similarity search",
        "background": "Search systems compare numerical objects, and level set gives one of the basic comparison languages.",
        "numbers": "Distance from $(0,0)$ to $(6,8)$ is $10$."
      }
    ],
    "applicationsClose": "The same idea keeps changing clothes: geometry, data, and optimization all use this structure once the numbers are in place.",
    "takeaways": [
      "Level sets and contour maps has a definition you can compute directly.",
      "The geometric interpretation is as important as the arithmetic.",
      "Small numerical examples are the safest way to build intuition.",
      "The same concept reappears in optimization, graphics, and ML data."
    ]
  },
  "math-02-10": {
    "id": "math-02-10",
    "title": "Limits in several variables",
    "tagline": "A multivariable limit must approach the same value along every path into the point.",
    "connections": {
      "buildsOn": [
        "Functions and their graphs",
        "Points and vectors in Rⁿ",
        "single-variable limits"
      ],
      "leadsTo": [
        "Partial derivatives",
        "The gradient",
        "Directional derivatives"
      ],
      "usedWith": [
        "domains",
        "surfaces",
        "contours",
        "paths"
      ]
    },
    "motivation": "<p>You already have the coordinate tools from the previous lessons. Now we use them to read multivariable limit as something concrete rather than as a symbol to memorize.</p><p>The goal is steady and practical: compute carefully, then ask what the result says about direction, shape, rate, or data.</p>",
    "definition": "<p>The statement $\\lim_{(x,y)\\to(a,b)}f(x,y)=L$ means $f(x,y)$ approaches $L$ as the input point approaches $(a,b)$ from every path in the domain.</p><p>One path can suggest an answer, but it cannot prove the limit. Two paths with different values prove the limit does not exist.</p><p><b>Assumptions that matter:</b> the value at the point itself is irrelevant; all paths must agree; and bounds or polar coordinates are often needed to prove existence.</p>",
    "worked": {
      "problem": "Show that $\\lim_{(x,y)\\to(0,0)}\\frac{xy}{x^2+y^2}$ does not exist.",
      "skills": [
        "multivariable limit",
        "calculation",
        "interpretation"
      ],
      "strategy": "Use the definition one piece at a time, then read the result geometrically.",
      "steps": [
        {
          "do": "Use path $y=x$",
          "result": "$\\frac{x^2}{2x^2}=\\frac12$",
          "why": "substitute and simplify"
        },
        {
          "do": "Record first path limit",
          "result": "$\\frac12$",
          "why": "as $x\\to0$"
        },
        {
          "do": "Use path $y=-x$",
          "result": "$\\frac{-x^2}{2x^2}=-\\frac12$",
          "why": "substitute and simplify"
        },
        {
          "do": "Record second path limit",
          "result": "$-\\frac12$",
          "why": "as $x\\to0$"
        },
        {
          "do": "Compare",
          "result": "$\\frac12\\ne-\\frac12$",
          "why": "path disagreement disproves the limit"
        }
      ],
      "verify": "The result matches the expected type and passes the built-in sanity check for this concept.",
      "answer": "The limit does not exist.",
      "connects": "This is the central move for understanding multivariable limit in later ML examples."
    },
    "practice": [
      {
        "problem": "Find $\\lim_{(x,y)\\to(1,2)}(x^2+y)$.",
        "steps": [
          {
            "do": "Use continuity",
            "result": "polynomial expression",
            "why": "limits equal values"
          },
          {
            "do": "Substitute $x=1$",
            "result": "$1^2+y$",
            "why": "first coordinate"
          },
          {
            "do": "Substitute $y=2$",
            "result": "$1+2$",
            "why": "second coordinate"
          },
          {
            "do": "Add",
            "result": "$3$",
            "why": "limit"
          }
        ],
        "answer": "$3$."
      },
      {
        "problem": "Show $\\lim_{(x,y)\\to(0,0)}\\frac{x^2}{x^2+y^2}$ does not exist.",
        "steps": [
          {
            "do": "Path $y=0$",
            "result": "$x^2/x^2=1$",
            "why": "first path"
          },
          {
            "do": "Path $x=0$",
            "result": "$0/y^2=0$",
            "why": "second path"
          },
          {
            "do": "Compare",
            "result": "$1\\ne0$",
            "why": "different path limits"
          },
          {
            "do": "Conclude",
            "result": "no limit",
            "why": "all paths must agree"
          }
        ],
        "answer": "Does not exist."
      },
      {
        "problem": "Evaluate $\\lim_{(x,y)\\to(0,0)}\\frac{x^2+y^2}{\\sqrt{x^2+y^2}}$.",
        "steps": [
          {
            "do": "Let $r=\\sqrt{x^2+y^2}$",
            "result": "$x^2+y^2=r^2$",
            "why": "distance to origin"
          },
          {
            "do": "Rewrite",
            "result": "$r^2/r$",
            "why": "for $r>0$"
          },
          {
            "do": "Simplify",
            "result": "$r$",
            "why": "cancel"
          },
          {
            "do": "Let $r\\to0$",
            "result": "$0$",
            "why": "approach origin"
          }
        ],
        "answer": "$0$."
      },
      {
        "problem": "Compare paths for $\\frac{x-y}{x+y}$ at $(0,0)$ along $y=0$ and $x=0$.",
        "steps": [
          {
            "do": "Path $y=0$",
            "result": "$x/x=1$",
            "why": "first path"
          },
          {
            "do": "Path $x=0$",
            "result": "$-y/y=-1$",
            "why": "second path"
          },
          {
            "do": "Compare",
            "result": "$1\\ne-1$",
            "why": "disagreement"
          },
          {
            "do": "Conclude",
            "result": "no limit",
            "why": "path test"
          }
        ],
        "answer": "Does not exist."
      },
      {
        "problem": "Use the squeeze idea for $\\frac{x^2y^2}{x^2+y^2}$ at $(0,0)$.",
        "steps": [
          {
            "do": "Observe nonnegative",
            "result": "$0\\le\\frac{x^2y^2}{x^2+y^2}$",
            "why": "squares"
          },
          {
            "do": "Bound by $y^2$",
            "result": "$\\frac{x^2y^2}{x^2+y^2}\\le y^2$",
            "why": "denominator at least $x^2$ when $x\\ne0$"
          },
          {
            "do": "Let $(x,y)\\to(0,0)$",
            "result": "$y^2\\to0$",
            "why": "upper bound shrinks"
          },
          {
            "do": "Apply squeeze",
            "result": "$0$",
            "why": "trapped between zeros"
          }
        ],
        "answer": "$0$."
      }
    ],
    "applications": [
      {
        "title": "Machine learning model geometry",
        "background": "Multivariable Limit appears when feature vectors, parameters, or losses need a geometric reading.",
        "numbers": "For features $\\langle2,3\\rangle$ and weights $\\langle0.5,1\\rangle$, the score is $4$."
      },
      {
        "title": "Computer graphics",
        "background": "Graphics uses multivariable limit ideas to place objects, trace rays, or measure surfaces.",
        "numbers": "A point $(1,2,3)$ shifted by $\\langle4,0,-1\\rangle$ becomes $(5,2,2)$."
      },
      {
        "title": "Robotics",
        "background": "Robots use multivariable limit calculations to update position, direction, and local motion.",
        "numbers": "Velocity $\\langle3,4\\rangle$ has speed $5$ per second."
      },
      {
        "title": "Optimization",
        "background": "Training algorithms rely on multivariable limit structure to decide how parameters should move.",
        "numbers": "With learning rate $0.1$ and gradient $\\langle4,-2\\rangle$, the update is $\\langle-0.4,0.2\\rangle$."
      },
      {
        "title": "Data visualization",
        "background": "Plots and maps use multivariable limit to turn tables of numbers into shapes a person can read.",
        "numbers": "A contour value $10$ for $x+y$ includes $(4,6)$ and $(7,3)$."
      },
      {
        "title": "Similarity search",
        "background": "Search systems compare numerical objects, and multivariable limit gives one of the basic comparison languages.",
        "numbers": "Distance from $(0,0)$ to $(6,8)$ is $10$."
      }
    ],
    "applicationsClose": "The same idea keeps changing clothes: geometry, data, and optimization all use this structure once the numbers are in place.",
    "takeaways": [
      "Limits in several variables has a definition you can compute directly.",
      "The geometric interpretation is as important as the arithmetic.",
      "Small numerical examples are the safest way to build intuition.",
      "The same concept reappears in optimization, graphics, and ML data."
    ]
  },
  "math-02-11": {
    "id": "math-02-11",
    "title": "Continuity in several variables",
    "tagline": "A multivariable function is continuous when nearby input points produce nearby output values.",
    "connections": {
      "buildsOn": [
        "Functions and their graphs",
        "Points and vectors in Rⁿ",
        "single-variable limits"
      ],
      "leadsTo": [
        "Partial derivatives",
        "The gradient",
        "Directional derivatives"
      ],
      "usedWith": [
        "domains",
        "surfaces",
        "contours",
        "paths"
      ]
    },
    "motivation": "<p>You already have the coordinate tools from the previous lessons. Now we use them to read multivariable continuity as something concrete rather than as a symbol to memorize.</p><p>The goal is steady and practical: compute carefully, then ask what the result says about direction, shape, rate, or data.</p>",
    "definition": "<p>A function $f(x,y)$ is <b>continuous at</b> $(a,b)$ if $f(a,b)$ is defined and $\\lim_{(x,y)\\to(a,b)}f(x,y)=f(a,b)$.</p><p>Polynomials are continuous everywhere. Quotients are continuous where their denominators are nonzero, and compositions are continuous where every piece is allowed.</p><p><b>Assumptions that matter:</b> continuity is relative to the domain; illegal operations must be excluded; and all approach paths must agree.</p>",
    "worked": {
      "problem": "Decide where $f(x,y)=\\frac{x+y}{x^2+y^2-1}$ is continuous.",
      "skills": [
        "multivariable continuity",
        "calculation",
        "interpretation"
      ],
      "strategy": "Use the definition one piece at a time, then read the result geometrically.",
      "steps": [
        {
          "do": "Identify the type",
          "result": "quotient of polynomials",
          "why": "use continuity rules"
        },
        {
          "do": "Find denominator restriction",
          "result": "$x^2+y^2-1\\ne0$",
          "why": "avoid division by zero"
        },
        {
          "do": "Solve restriction",
          "result": "$x^2+y^2\\ne1$",
          "why": "move 1"
        },
        {
          "do": "Describe excluded set",
          "result": "unit circle",
          "why": "circle of radius 1"
        },
        {
          "do": "State region",
          "result": "continuous where $x^2+y^2\\ne1$",
          "why": "quotient rule"
        }
      ],
      "verify": "The result matches the expected type and passes the built-in sanity check for this concept.",
      "answer": "It is continuous everywhere except the unit circle $x^2+y^2=1$.",
      "connects": "This is the central move for understanding multivariable continuity in later ML examples."
    },
    "practice": [
      {
        "problem": "Where is $f(x,y)=x^2+xy+y^2$ continuous?",
        "steps": [
          {
            "do": "Identify polynomial",
            "result": "sum of products and powers",
            "why": "no restrictions"
          },
          {
            "do": "Apply rule",
            "result": "continuous everywhere",
            "why": "polynomials"
          },
          {
            "do": "State domain",
            "result": "$\\mathbb R^2$",
            "why": "all pairs"
          },
          {
            "do": "Conclude",
            "result": "continuous on $\\mathbb R^2$",
            "why": "domain equals all inputs"
          }
        ],
        "answer": "Everywhere."
      },
      {
        "problem": "Where is $g(x,y)=\\sqrt{x+y}$ continuous?",
        "steps": [
          {
            "do": "Require radicand",
            "result": "$x+y\\ge0$",
            "why": "real square root"
          },
          {
            "do": "Describe domain",
            "result": "$y\\ge -x$",
            "why": "half-plane"
          },
          {
            "do": "Apply composition",
            "result": "continuous on domain",
            "why": "sqrt of continuous input"
          },
          {
            "do": "State result",
            "result": "$x+y\\ge0$",
            "why": "including boundary"
          }
        ],
        "answer": "For $x+y\\ge0$."
      },
      {
        "problem": "Is $h(x,y)=xy/(x^2+y^2)$ with $h(0,0)=0$ continuous at the origin?",
        "steps": [
          {
            "do": "Path $y=x$",
            "result": "$x^2/(2x^2)=1/2$",
            "why": "approach value"
          },
          {
            "do": "Compare to $h(0,0)$",
            "result": "$1/2\\ne0$",
            "why": "value mismatch"
          },
          {
            "do": "State limit issue",
            "result": "limit does not equal value",
            "why": "continuity fails"
          },
          {
            "do": "Conclude",
            "result": "not continuous",
            "why": "condition fails"
          }
        ],
        "answer": "No."
      },
      {
        "problem": "Where is $q(x,y)=\\ln(4-x^2-y^2)$ continuous?",
        "steps": [
          {
            "do": "Require positive log input",
            "result": "$4-x^2-y^2>0$",
            "why": "log domain"
          },
          {
            "do": "Rearrange",
            "result": "$x^2+y^2<4$",
            "why": "inside circle"
          },
          {
            "do": "Read radius",
            "result": "$2$",
            "why": "square root"
          },
          {
            "do": "State region",
            "result": "open disk of radius $2$",
            "why": "continuity domain"
          }
        ],
        "answer": "$x^2+y^2<4$."
      },
      {
        "problem": "Is $L(w,b)=(w-b)^2+0.1w^2$ continuous everywhere?",
        "steps": [
          {
            "do": "Identify operations",
            "result": "subtraction, squares, addition",
            "why": "polynomial"
          },
          {
            "do": "Check restrictions",
            "result": "none",
            "why": "no denominator or log"
          },
          {
            "do": "Apply rule",
            "result": "continuous on $\\mathbb R^2$",
            "why": "polynomial"
          },
          {
            "do": "Interpret",
            "result": "small parameter changes make small loss changes",
            "why": "optimization-friendly"
          }
        ],
        "answer": "Yes."
      }
    ],
    "applications": [
      {
        "title": "Machine learning model geometry",
        "background": "Multivariable Continuity appears when feature vectors, parameters, or losses need a geometric reading.",
        "numbers": "For features $\\langle2,3\\rangle$ and weights $\\langle0.5,1\\rangle$, the score is $4$."
      },
      {
        "title": "Computer graphics",
        "background": "Graphics uses multivariable continuity ideas to place objects, trace rays, or measure surfaces.",
        "numbers": "A point $(1,2,3)$ shifted by $\\langle4,0,-1\\rangle$ becomes $(5,2,2)$."
      },
      {
        "title": "Robotics",
        "background": "Robots use multivariable continuity calculations to update position, direction, and local motion.",
        "numbers": "Velocity $\\langle3,4\\rangle$ has speed $5$ per second."
      },
      {
        "title": "Optimization",
        "background": "Training algorithms rely on multivariable continuity structure to decide how parameters should move.",
        "numbers": "With learning rate $0.1$ and gradient $\\langle4,-2\\rangle$, the update is $\\langle-0.4,0.2\\rangle$."
      },
      {
        "title": "Data visualization",
        "background": "Plots and maps use multivariable continuity to turn tables of numbers into shapes a person can read.",
        "numbers": "A contour value $10$ for $x+y$ includes $(4,6)$ and $(7,3)$."
      },
      {
        "title": "Similarity search",
        "background": "Search systems compare numerical objects, and multivariable continuity gives one of the basic comparison languages.",
        "numbers": "Distance from $(0,0)$ to $(6,8)$ is $10$."
      }
    ],
    "applicationsClose": "The same idea keeps changing clothes: geometry, data, and optimization all use this structure once the numbers are in place.",
    "takeaways": [
      "Continuity in several variables has a definition you can compute directly.",
      "The geometric interpretation is as important as the arithmetic.",
      "Small numerical examples are the safest way to build intuition.",
      "The same concept reappears in optimization, graphics, and ML data."
    ]
  },
  "math-02-12": {
    "id": "math-02-12",
    "title": "Partial derivatives",
    "tagline": "A partial derivative measures change in one input direction while holding the others fixed.",
    "connections": {
      "buildsOn": [
        "Functions of several variables",
        "vectors",
        "derivatives"
      ],
      "leadsTo": [
        "The gradient",
        "optimization",
        "linear approximation"
      ],
      "usedWith": [
        "dot product",
        "level sets",
        "rates of change",
        "unit vectors"
      ]
    },
    "motivation": "<p>You already have the coordinate tools from the previous lessons. Now we use them to read partial derivative as something concrete rather than as a symbol to memorize.</p><p>The goal is steady and practical: compute carefully, then ask what the result says about direction, shape, rate, or data.</p>",
    "definition": "<p>The <b>partial derivative</b> $f_x(a,b)$ differentiates with respect to $x$ while holding $y$ fixed. The partial $f_y(a,b)$ holds $x$ fixed.</p><p>This is a coordinate slice of the surface. Along that slice, ordinary one-variable derivative rules apply.</p><p><b>Assumptions that matter:</b> hold every other variable constant; partials may exist even when full differentiability fails; and units are output units per chosen input unit.</p>",
    "worked": {
      "problem": "For $f(x,y)=x^2y+3y^2$, compute $f_x(2,1)$ and $f_y(2,1)$.",
      "skills": [
        "partial derivative",
        "calculation",
        "interpretation"
      ],
      "strategy": "Use the definition one piece at a time, then read the result geometrically.",
      "steps": [
        {
          "do": "Differentiate in $x$",
          "result": "$f_x=2xy$",
          "why": "treat $y$ as constant"
        },
        {
          "do": "Differentiate in $y$",
          "result": "$f_y=x^2+6y$",
          "why": "treat $x$ as constant"
        },
        {
          "do": "Evaluate $f_x$",
          "result": "$2(2)(1)=4$",
          "why": "substitute"
        },
        {
          "do": "Evaluate $f_y$",
          "result": "$2^2+6(1)=10$",
          "why": "substitute"
        },
        {
          "do": "State both partials",
          "result": "$4$ and $10$",
          "why": "coordinate rates"
        }
      ],
      "verify": "The result matches the expected type and passes the built-in sanity check for this concept.",
      "answer": "$f_x(2,1)=4$ and $f_y(2,1)=10$.",
      "connects": "This is the central move for understanding partial derivative in later ML examples."
    },
    "practice": [
      {
        "problem": "Find $f_x$ and $f_y$ for $f(x,y)=3x+4y$.",
        "steps": [
          {
            "do": "Differentiate in $x$",
            "result": "$f_x=3$",
            "why": "$4y$ constant"
          },
          {
            "do": "Differentiate in $y$",
            "result": "$f_y=4$",
            "why": "$3x$ constant"
          },
          {
            "do": "Interpret $f_x$",
            "result": "$3$ per $x$ unit",
            "why": "coordinate rate"
          },
          {
            "do": "Interpret $f_y$",
            "result": "$4$ per $y$ unit",
            "why": "coordinate rate"
          }
        ],
        "answer": "$f_x=3$, $f_y=4$."
      },
      {
        "problem": "Compute partials of $f=x^2+xy$ at $(1,3)$.",
        "steps": [
          {
            "do": "Find $f_x$",
            "result": "$2x+y$",
            "why": "differentiate in $x$"
          },
          {
            "do": "Find $f_y$",
            "result": "$x$",
            "why": "differentiate in $y$"
          },
          {
            "do": "Evaluate $f_x$",
            "result": "$2(1)+3=5$",
            "why": "substitute"
          },
          {
            "do": "Evaluate $f_y$",
            "result": "$1$",
            "why": "substitute"
          }
        ],
        "answer": "$f_x(1,3)=5$, $f_y(1,3)=1$."
      },
      {
        "problem": "For $T=20+0.5x-0.2y$, find $T_x$ and $T_y$.",
        "steps": [
          {
            "do": "Differentiate in $x$",
            "result": "$T_x=0.5$",
            "why": "coefficient of $x$"
          },
          {
            "do": "Differentiate in $y$",
            "result": "$T_y=-0.2$",
            "why": "coefficient of $y$"
          },
          {
            "do": "Attach units",
            "result": "degrees per coordinate unit",
            "why": "rate meaning"
          },
          {
            "do": "Interpret sign",
            "result": "$y$ increase lowers $T$",
            "why": "negative partial"
          }
        ],
        "answer": "$T_x=0.5$, $T_y=-0.2$."
      },
      {
        "problem": "Find $f_{xy}$ for $f=x^2y+\\sin y$.",
        "steps": [
          {
            "do": "Compute $f_x$",
            "result": "$2xy$",
            "why": "differentiate in $x$"
          },
          {
            "do": "Differentiate with respect to $y$",
            "result": "$2x$",
            "why": "now hold $x$ constant"
          },
          {
            "do": "State mixed partial",
            "result": "$f_{xy}=2x$",
            "why": "order $x$ then $y$"
          },
          {
            "do": "Evaluate at $x=3$ if needed",
            "result": "$6$",
            "why": "substitute"
          }
        ],
        "answer": "$f_{xy}=2x$."
      },
      {
        "problem": "For $L(w,b)=(2w+b-5)^2$, compute $L_w$ and $L_b$ at $(1,2)$.",
        "steps": [
          {
            "do": "Let $r=2w+b-5$",
            "result": "$L=r^2$",
            "why": "name residual"
          },
          {
            "do": "Compute $L_w$",
            "result": "$4r$",
            "why": "chain rule"
          },
          {
            "do": "Compute $L_b$",
            "result": "$2r$",
            "why": "chain rule"
          },
          {
            "do": "Evaluate $r$",
            "result": "$-1$",
            "why": "at $(1,2)$"
          },
          {
            "do": "Evaluate partials",
            "result": "$L_w=-4$, $L_b=-2$",
            "why": "multiply"
          }
        ],
        "answer": "$L_w=-4$, $L_b=-2$."
      }
    ],
    "applications": [
      {
        "title": "Machine learning model geometry",
        "background": "Partial Derivative appears when feature vectors, parameters, or losses need a geometric reading.",
        "numbers": "For features $\\langle2,3\\rangle$ and weights $\\langle0.5,1\\rangle$, the score is $4$."
      },
      {
        "title": "Computer graphics",
        "background": "Graphics uses partial derivative ideas to place objects, trace rays, or measure surfaces.",
        "numbers": "A point $(1,2,3)$ shifted by $\\langle4,0,-1\\rangle$ becomes $(5,2,2)$."
      },
      {
        "title": "Robotics",
        "background": "Robots use partial derivative calculations to update position, direction, and local motion.",
        "numbers": "Velocity $\\langle3,4\\rangle$ has speed $5$ per second."
      },
      {
        "title": "Optimization",
        "background": "Training algorithms rely on partial derivative structure to decide how parameters should move.",
        "numbers": "With learning rate $0.1$ and gradient $\\langle4,-2\\rangle$, the update is $\\langle-0.4,0.2\\rangle$."
      },
      {
        "title": "Data visualization",
        "background": "Plots and maps use partial derivative to turn tables of numbers into shapes a person can read.",
        "numbers": "A contour value $10$ for $x+y$ includes $(4,6)$ and $(7,3)$."
      },
      {
        "title": "Similarity search",
        "background": "Search systems compare numerical objects, and partial derivative gives one of the basic comparison languages.",
        "numbers": "Distance from $(0,0)$ to $(6,8)$ is $10$."
      }
    ],
    "applicationsClose": "The same idea keeps changing clothes: geometry, data, and optimization all use this structure once the numbers are in place.",
    "takeaways": [
      "Partial derivatives has a definition you can compute directly.",
      "The geometric interpretation is as important as the arithmetic.",
      "Small numerical examples are the safest way to build intuition.",
      "The same concept reappears in optimization, graphics, and ML data."
    ]
  },
  "math-02-13": {
    "id": "math-02-13",
    "title": "The gradient",
    "tagline": "The gradient packages all partial derivatives into the direction of steepest increase.",
    "connections": {
      "buildsOn": [
        "Functions of several variables",
        "vectors",
        "derivatives"
      ],
      "leadsTo": [
        "Directional derivatives",
        "optimization",
        "linear approximation"
      ],
      "usedWith": [
        "dot product",
        "level sets",
        "rates of change",
        "unit vectors"
      ]
    },
    "motivation": "<p>You already have the coordinate tools from the previous lessons. Now we use them to read gradient as something concrete rather than as a symbol to memorize.</p><p>The goal is steady and practical: compute carefully, then ask what the result says about direction, shape, rate, or data.</p>",
    "definition": "<p>For $f(x,y)$, the <b>gradient</b> is $\\nabla f=\\langle f_x,f_y\\rangle$. In more variables, it lists all partial derivatives.</p><p>Because $D_u f=\\nabla f\\cdot u$, the gradient gives the largest directional derivative when $u$ points the same way. It is also perpendicular to level sets.</p><p><b>Assumptions that matter:</b> partial derivatives should exist; steepest direction uses unit directions; and negative gradient points toward steepest local decrease.</p>",
    "worked": {
      "problem": "For $f(x,y)=x^2+xy+2y^2$, find $\\nabla f(1,2)$.",
      "skills": [
        "gradient",
        "calculation",
        "interpretation"
      ],
      "strategy": "Use the definition one piece at a time, then read the result geometrically.",
      "steps": [
        {
          "do": "Compute $f_x$",
          "result": "$2x+y$",
          "why": "differentiate in $x$"
        },
        {
          "do": "Compute $f_y$",
          "result": "$x+4y$",
          "why": "differentiate in $y$"
        },
        {
          "do": "Write the gradient",
          "result": "$\\nabla f=\\langle2x+y,x+4y\\rangle$",
          "why": "collect partials"
        },
        {
          "do": "Substitute $(1,2)$",
          "result": "$\\langle2(1)+2,1+4(2)\\rangle$",
          "why": "evaluate"
        },
        {
          "do": "Simplify",
          "result": "$\\langle4,9\\rangle$",
          "why": "gradient at the point"
        }
      ],
      "verify": "The result matches the expected type and passes the built-in sanity check for this concept.",
      "answer": "$\\nabla f(1,2)=\\langle4,9\\rangle$.",
      "connects": "This is the central move for understanding gradient in later ML examples."
    },
    "practice": [
      {
        "problem": "Find $\\nabla f$ for $f=3x+4y$.",
        "steps": [
          {
            "do": "Compute $f_x$",
            "result": "$3$",
            "why": "partial in $x$"
          },
          {
            "do": "Compute $f_y$",
            "result": "$4$",
            "why": "partial in $y$"
          },
          {
            "do": "Assemble",
            "result": "$\\langle3,4\\rangle$",
            "why": "gradient"
          },
          {
            "do": "Find length",
            "result": "$5$",
            "why": "steepest slope magnitude"
          }
        ],
        "answer": "$\\langle3,4\\rangle$."
      },
      {
        "problem": "Find $\\nabla f(2,1)$ for $f=x^2y+y^3$.",
        "steps": [
          {
            "do": "Compute $f_x$",
            "result": "$2xy$",
            "why": "partial"
          },
          {
            "do": "Compute $f_y$",
            "result": "$x^2+3y^2$",
            "why": "partial"
          },
          {
            "do": "Evaluate $f_x$",
            "result": "$4$",
            "why": "at $(2,1)$"
          },
          {
            "do": "Evaluate $f_y$",
            "result": "$7$",
            "why": "at $(2,1)$"
          },
          {
            "do": "Assemble",
            "result": "$\\langle4,7\\rangle$",
            "why": "gradient"
          }
        ],
        "answer": "$\\langle4,7\\rangle$."
      },
      {
        "problem": "For $f=x^2+y^2$, show $\\nabla f(3,4)$ is normal to the level circle.",
        "steps": [
          {
            "do": "Compute gradient",
            "result": "$\\langle2x,2y\\rangle$",
            "why": "partials"
          },
          {
            "do": "Evaluate",
            "result": "$\\langle6,8\\rangle$",
            "why": "at $(3,4)$"
          },
          {
            "do": "Choose tangent direction",
            "result": "$\\langle-4,3\\rangle$",
            "why": "perpendicular to radius"
          },
          {
            "do": "Dot",
            "result": "$6(-4)+8(3)=0$",
            "why": "normal to tangent"
          }
        ],
        "answer": "$\\langle6,8\\rangle$ is normal to the level set."
      },
      {
        "problem": "A loss has gradient $\\langle6,-2\\rangle$. Find steepest descent direction.",
        "steps": [
          {
            "do": "Start with gradient",
            "result": "$\\langle6,-2\\rangle$",
            "why": "steepest increase"
          },
          {
            "do": "Negate",
            "result": "$\\langle-6,2\\rangle$",
            "why": "steepest decrease"
          },
          {
            "do": "Find length",
            "result": "$\\sqrt{40}$",
            "why": "if unit direction needed"
          },
          {
            "do": "Normalize",
            "result": "$\\langle-6,2\\rangle/\\sqrt{40}$",
            "why": "unit descent"
          }
        ],
        "answer": "$\\langle-6,2\\rangle$, or unit direction $\\langle-6,2\\rangle/\\sqrt{40}$."
      },
      {
        "problem": "For $L=(2w+b-5)^2$, find $\\nabla L(1,2)$.",
        "steps": [
          {
            "do": "Let $r=2w+b-5$",
            "result": "$L=r^2$",
            "why": "residual"
          },
          {
            "do": "Compute partials",
            "result": "$L_w=4r$, $L_b=2r$",
            "why": "chain rule"
          },
          {
            "do": "Evaluate residual",
            "result": "$r=-1$",
            "why": "at $(1,2)$"
          },
          {
            "do": "Assemble gradient",
            "result": "$\\langle-4,-2\\rangle$",
            "why": "partials as vector"
          }
        ],
        "answer": "$\\nabla L(1,2)=\\langle-4,-2\\rangle$."
      }
    ],
    "applications": [
      {
        "title": "Machine learning model geometry",
        "background": "Gradient appears when feature vectors, parameters, or losses need a geometric reading.",
        "numbers": "For features $\\langle2,3\\rangle$ and weights $\\langle0.5,1\\rangle$, the score is $4$."
      },
      {
        "title": "Computer graphics",
        "background": "Graphics uses gradient ideas to place objects, trace rays, or measure surfaces.",
        "numbers": "A point $(1,2,3)$ shifted by $\\langle4,0,-1\\rangle$ becomes $(5,2,2)$."
      },
      {
        "title": "Robotics",
        "background": "Robots use gradient calculations to update position, direction, and local motion.",
        "numbers": "Velocity $\\langle3,4\\rangle$ has speed $5$ per second."
      },
      {
        "title": "Optimization",
        "background": "Training algorithms rely on gradient structure to decide how parameters should move.",
        "numbers": "With learning rate $0.1$ and gradient $\\langle4,-2\\rangle$, the update is $\\langle-0.4,0.2\\rangle$."
      },
      {
        "title": "Data visualization",
        "background": "Plots and maps use gradient to turn tables of numbers into shapes a person can read.",
        "numbers": "A contour value $10$ for $x+y$ includes $(4,6)$ and $(7,3)$."
      },
      {
        "title": "Similarity search",
        "background": "Search systems compare numerical objects, and gradient gives one of the basic comparison languages.",
        "numbers": "Distance from $(0,0)$ to $(6,8)$ is $10$."
      }
    ],
    "applicationsClose": "The same idea keeps changing clothes: geometry, data, and optimization all use this structure once the numbers are in place.",
    "takeaways": [
      "The gradient has a definition you can compute directly.",
      "The geometric interpretation is as important as the arithmetic.",
      "Small numerical examples are the safest way to build intuition.",
      "The same concept reappears in optimization, graphics, and ML data."
    ]
  },
  "math-02-14": {
    "id": "math-02-14",
    "title": "Directional derivatives",
    "tagline": "A directional derivative measures the slope of a function in a chosen unit direction.",
    "connections": {
      "buildsOn": [
        "Functions of several variables",
        "vectors",
        "derivatives"
      ],
      "leadsTo": [
        "Directional derivatives",
        "optimization",
        "linear approximation"
      ],
      "usedWith": [
        "dot product",
        "level sets",
        "rates of change",
        "unit vectors"
      ]
    },
    "motivation": "<p>You already have the coordinate tools from the previous lessons. Now we use them to read directional derivative as something concrete rather than as a symbol to memorize.</p><p>The goal is steady and practical: compute carefully, then ask what the result says about direction, shape, rate, or data.</p>",
    "definition": "<p>The <b>directional derivative</b> of $f$ at a point in unit direction $u$ is $D_u f=\\nabla f\\cdot u$.</p><p>The unit-vector condition matters because direction should not include step length. Only the component of the gradient aligned with $u$ contributes.</p><p><b>Assumptions that matter:</b> $u$ must have length $1$; the gradient should exist; the largest directional derivative is $\\|\\nabla f\\|$ and the smallest is $-\\|\\nabla f\\|$.</p>",
    "worked": {
      "problem": "For $f(x,y)=x^2+3y$ at $(2,1)$ in direction $\\langle3,4\\rangle$, compute the directional derivative.",
      "skills": [
        "directional derivative",
        "calculation",
        "interpretation"
      ],
      "strategy": "Use the definition one piece at a time, then read the result geometrically.",
      "steps": [
        {
          "do": "Compute the gradient",
          "result": "$\\nabla f=\\langle2x,3\\rangle$",
          "why": "partials"
        },
        {
          "do": "Evaluate at $(2,1)$",
          "result": "$\\langle4,3\\rangle$",
          "why": "local gradient"
        },
        {
          "do": "Find direction length",
          "result": "$\\sqrt{3^2+4^2}=5$",
          "why": "normalize"
        },
        {
          "do": "Write unit direction",
          "result": "$u=\\langle3/5,4/5\\rangle$",
          "why": "divide by length"
        },
        {
          "do": "Dot with gradient",
          "result": "$12/5+12/5=24/5$",
          "why": "directional derivative"
        }
      ],
      "verify": "The result matches the expected type and passes the built-in sanity check for this concept.",
      "answer": "$D_u f(2,1)=24/5$.",
      "connects": "This is the central move for understanding directional derivative in later ML examples."
    },
    "practice": [
      {
        "problem": "Find $D_u f$ for $f=3x+4y$ in direction $\\langle1,0\\rangle$.",
        "steps": [
          {
            "do": "Compute gradient",
            "result": "$\\langle3,4\\rangle$",
            "why": "partials"
          },
          {
            "do": "Check unit direction",
            "result": "$\\|\\langle1,0\\rangle\\|=1$",
            "why": "valid"
          },
          {
            "do": "Dot",
            "result": "$3$",
            "why": "directional derivative"
          },
          {
            "do": "Interpret",
            "result": "$x$-direction slope",
            "why": "same as $f_x$"
          }
        ],
        "answer": "$3$."
      },
      {
        "problem": "For $f=x^2+y^2$ at $(1,2)$ in direction $\\langle0,1\\rangle$, compute $D_u f$.",
        "steps": [
          {
            "do": "Compute gradient",
            "result": "$\\langle2x,2y\\rangle$",
            "why": "partials"
          },
          {
            "do": "Evaluate",
            "result": "$\\langle2,4\\rangle$",
            "why": "at point"
          },
          {
            "do": "Dot with direction",
            "result": "$2(0)+4(1)=4$",
            "why": "formula"
          },
          {
            "do": "Interpret",
            "result": "vertical slope",
            "why": "change in $y$"
          }
        ],
        "answer": "$4$."
      },
      {
        "problem": "Normalize $v=\\langle1,2\\rangle$ and compute $D_u(x+y)$.",
        "steps": [
          {
            "do": "Find length",
            "result": "$\\sqrt5$",
            "why": "norm of $v$"
          },
          {
            "do": "Unit direction",
            "result": "$u=\\langle1/\\sqrt5,2/\\sqrt5\\rangle$",
            "why": "normalize"
          },
          {
            "do": "Gradient of $x+y$",
            "result": "$\\langle1,1\\rangle$",
            "why": "partials"
          },
          {
            "do": "Dot",
            "result": "$3/\\sqrt5$",
            "why": "directional derivative"
          }
        ],
        "answer": "$3/\\sqrt5$."
      },
      {
        "problem": "A loss has gradient $\\langle6,8\\rangle$. Find the largest possible directional derivative.",
        "steps": [
          {
            "do": "Use maximum rule",
            "result": "$\\max D_uL=\\|\\nabla L\\|$",
            "why": "align with gradient"
          },
          {
            "do": "Compute norm",
            "result": "$\\sqrt{6^2+8^2}$",
            "why": "length"
          },
          {
            "do": "Simplify",
            "result": "$10$",
            "why": "$36+64=100$"
          },
          {
            "do": "Give unit direction",
            "result": "$\\langle0.6,0.8\\rangle$",
            "why": "gradient divided by 10"
          }
        ],
        "answer": "Largest value $10$."
      },
      {
        "problem": "For $\\nabla L=\\langle-4,-2\\rangle$, compute derivative in $u=\\langle2,1\\rangle/\\sqrt5$.",
        "steps": [
          {
            "do": "Confirm unit direction",
            "result": "$\\|u\\|=1$",
            "why": "normalized"
          },
          {
            "do": "Dot",
            "result": "$(-4)(2/\\sqrt5)+(-2)(1/\\sqrt5)$",
            "why": "formula"
          },
          {
            "do": "Add",
            "result": "$-10/\\sqrt5$",
            "why": "combine terms"
          },
          {
            "do": "Simplify",
            "result": "$-2\\sqrt5$",
            "why": "negative means decrease"
          },
          {
            "do": "Approximate",
            "result": "$-4.472$",
            "why": "rate per unit step"
          }
        ],
        "answer": "$-2\\sqrt5\\u0007pprox-4.472$."
      }
    ],
    "applications": [
      {
        "title": "Machine learning model geometry",
        "background": "Directional Derivative appears when feature vectors, parameters, or losses need a geometric reading.",
        "numbers": "For features $\\langle2,3\\rangle$ and weights $\\langle0.5,1\\rangle$, the score is $4$."
      },
      {
        "title": "Computer graphics",
        "background": "Graphics uses directional derivative ideas to place objects, trace rays, or measure surfaces.",
        "numbers": "A point $(1,2,3)$ shifted by $\\langle4,0,-1\\rangle$ becomes $(5,2,2)$."
      },
      {
        "title": "Robotics",
        "background": "Robots use directional derivative calculations to update position, direction, and local motion.",
        "numbers": "Velocity $\\langle3,4\\rangle$ has speed $5$ per second."
      },
      {
        "title": "Optimization",
        "background": "Training algorithms rely on directional derivative structure to decide how parameters should move.",
        "numbers": "With learning rate $0.1$ and gradient $\\langle4,-2\\rangle$, the update is $\\langle-0.4,0.2\\rangle$."
      },
      {
        "title": "Data visualization",
        "background": "Plots and maps use directional derivative to turn tables of numbers into shapes a person can read.",
        "numbers": "A contour value $10$ for $x+y$ includes $(4,6)$ and $(7,3)$."
      },
      {
        "title": "Similarity search",
        "background": "Search systems compare numerical objects, and directional derivative gives one of the basic comparison languages.",
        "numbers": "Distance from $(0,0)$ to $(6,8)$ is $10$."
      }
    ],
    "applicationsClose": "The same idea keeps changing clothes: geometry, data, and optimization all use this structure once the numbers are in place.",
    "takeaways": [
      "Directional derivatives has a definition you can compute directly.",
      "The geometric interpretation is as important as the arithmetic.",
      "Small numerical examples are the safest way to build intuition.",
      "The same concept reappears in optimization, graphics, and ML data."
    ]
  }
};
