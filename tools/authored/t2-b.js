module.exports = {
  "math-02-15": {
    "id": "math-02-15",
    "title": "Tangent planes",
    "tagline": "A tangent plane is the flat surface that best matches a smooth two-variable graph at one point.",
    "connections": {
      "buildsOn": [
        "Directional derivatives",
        "partial derivatives",
        "vectors"
      ],
      "leadsTo": [
        "Linear approximation in several variables",
        "optimization and integration"
      ],
      "usedWith": [
        "gradients",
        "linear maps",
        "level sets",
        "quadratic forms"
      ]
    },
    "motivation": "<p>You already know how one-variable calculus studies a curve by zooming in, measuring slope, or adding small pieces. Tangent planes brings that same habit into several variables.</p><p>The reward is practical: surfaces, vector maps, losses, and densities become computable with local slopes, curvature, constraints, or accumulated totals.</p>",
    "definition": "<p>If $f$ is differentiable near $(a,b)$, the tangent plane to $z=f(x,y)$ is $$z=f(a,b)+f_x(a,b)(x-a)+f_y(a,b)(y-b).$$ It comes from the first-order change $\\Delta z\\approx f_x\\Delta x+f_y\\Delta y$.</p><p><b>Assumptions that matter:</b> differentiability is required; continuous first partial derivatives nearby are a standard sufficient condition.</p>",
    "worked": {
      "problem": "Find the tangent plane to $f=x^2+3xy$ at $(1,2)$.",
      "skills": [
        "setup",
        "calculation",
        "interpretation"
      ],
      "strategy": "Translate the geometric idea into derivatives or integrals, then compute one quantity at a time.",
      "steps": [
        {
          "do": "Evaluate height",
          "result": "$f(1,2)=7$",
          "why": "the plane passes through the point"
        },
        {
          "do": "Compute $f_x$",
          "result": "$2x+3y$",
          "why": "differentiate in $x$"
        },
        {
          "do": "Evaluate $f_x$",
          "result": "$8$",
          "why": "use $(1,2)$"
        },
        {
          "do": "Compute $f_y$",
          "result": "$3x$",
          "why": "differentiate in $y$"
        },
        {
          "do": "Evaluate $f_y$",
          "result": "$3$",
          "why": "use $(1,2)$"
        },
        {
          "do": "Write plane",
          "result": "$z=7+8(x-1)+3(y-2)$",
          "why": "insert the data"
        }
      ],
      "verify": "The result has the expected sign, size, and units for the local geometry.",
      "answer": "$z=7+8(x-1)+3(y-2)$.",
      "connects": "A tangent plane is the first-order model of a surface."
    },
    "practice": [
      {
        "problem": "Tangent planes: compute the basic object for $f(x,y)=x^2+y^2$ at $(1,2)$.",
        "steps": [
          {
            "do": "Compute $f_x$",
            "result": "$2x$",
            "why": "differentiate with respect to $x$"
          },
          {
            "do": "Compute $f_y$",
            "result": "$2y$",
            "why": "differentiate with respect to $y$"
          },
          {
            "do": "Evaluate at $(1,2)$",
            "result": "$(2,4)$",
            "why": "substitute the point"
          },
          {
            "do": "Interpret",
            "result": "local change is $2\\Delta x+4\\Delta y$",
            "why": "use first-order information"
          }
        ],
        "answer": "The local first-order data is $(2,4)$."
      },
      {
        "problem": "Tangent planes: use $f(x,y)=x^2-y^2$ at $(3,1)$.",
        "steps": [
          {
            "do": "Compute partials",
            "result": "$f_x=2x$, $f_y=-2y$",
            "why": "differentiate"
          },
          {
            "do": "Evaluate partials",
            "result": "$(6,-2)$",
            "why": "substitute $(3,1)$"
          },
          {
            "do": "Use move $(0.1,-0.1)$",
            "result": "$6(0.1)-2(-0.1)$",
            "why": "multiply slopes by displacements"
          },
          {
            "do": "Simplify",
            "result": "$0.8$",
            "why": "combine terms"
          }
        ],
        "answer": "The predicted first-order change is $0.8$."
      },
      {
        "problem": "Tangent planes: compute second-order data for $q(x,y)=x^2+3xy+2y^2$.",
        "steps": [
          {
            "do": "Compute first partials",
            "result": "$q_x=2x+3y$, $q_y=3x+4y$",
            "why": "differentiate once"
          },
          {
            "do": "Compute $q_{xx}$",
            "result": "$2$",
            "why": "differentiate $q_x$ by $x$"
          },
          {
            "do": "Compute mixed partials",
            "result": "$q_{xy}=q_{yx}=3$",
            "why": "differentiate across variables"
          },
          {
            "do": "Compute $q_{yy}$",
            "result": "$4$",
            "why": "differentiate $q_y$ by $y$"
          }
        ],
        "answer": "The second-order entries are $2,3,3,4$."
      },
      {
        "problem": "Tangent planes: evaluate a constrained or local step with gradient $(4,-6)$ and learning rate $0.05$.",
        "steps": [
          {
            "do": "Write the descent update",
            "result": "$-0.05(4,-6)$",
            "why": "move opposite the gradient"
          },
          {
            "do": "Multiply",
            "result": "$( -0.2,0.3)$",
            "why": "scale each component"
          },
          {
            "do": "Add to current point $(1,2)$",
            "result": "$(0.8,2.3)$",
            "why": "apply the update"
          },
          {
            "do": "Interpret",
            "result": "loss should decrease for a small enough step",
            "why": "descent follows negative gradient"
          }
        ],
        "answer": "The updated point is $(0.8,2.3)$."
      },
      {
        "problem": "Tangent planes: compute an ML local prediction from value $10$, gradient $(-3,4)$, and move $(0.2,-0.1)$.",
        "steps": [
          {
            "do": "Dot gradient with move",
            "result": "$(-3)(0.2)+4(-0.1)$",
            "why": "linear change is gradient dot displacement"
          },
          {
            "do": "Simplify change",
            "result": "$-1.0$",
            "why": "combine contributions"
          },
          {
            "do": "Add base value",
            "result": "$10-1.0$",
            "why": "local approximation"
          },
          {
            "do": "State prediction",
            "result": "$9.0$",
            "why": "finish arithmetic"
          }
        ],
        "answer": "The local prediction is $9.0$."
      }
    ],
    "applications": [
      {
        "title": "Gradient descent",
        "background": "Modern training uses derivatives to choose parameter updates instead of trying random moves.",
        "numbers": "With gradient $(3,-4)$ and learning rate $0.1$, the update is $(-0.3,0.4)$."
      },
      {
        "title": "Backpropagation",
        "background": "Backprop is organized calculus on a computation graph, passing local sensitivities backward.",
        "numbers": "An upstream gradient $5$ through a local derivative $2.4$ becomes $12$."
      },
      {
        "title": "Gradient checking",
        "background": "Engineers compare analytic derivatives with finite differences to find implementation bugs.",
        "numbers": "If $f(2.001)-f(2)=0.004002$, the finite-difference slope is $4.002$."
      },
      {
        "title": "Feature scaling",
        "background": "Derivative magnitudes reveal whether one input dominates another numerically.",
        "numbers": "Slopes $80$ and $0.2$ mean a $0.01$ move in the first feature changes output $0.8$, four times a $1$ move in the second."
      },
      {
        "title": "Sensitivity analysis",
        "background": "Teams estimate metric changes from small controllable moves.",
        "numbers": "Slopes $(120,-30)$ and move $(0.5,1)$ predict $120(0.5)-30=30$ extra units."
      },
      {
        "title": "Optimization diagnostics",
        "background": "Large local factors can create unstable training dynamics.",
        "numbers": "A factor $20$ repeated through $4$ layers can magnify gradients by $20^4=160000$."
      }
    ],
    "applicationsClose": "The same pattern appears under many names: local change, curvature, constrained motion, and accumulated mass are all ways to turn geometry into numbers.",
    "takeaways": [
      "A tangent plane matches height and first partial derivatives.",
      "Work one derivative, matrix entry, equation, or bound at a time.",
      "Check every numerical result with signs and units."
    ]
  },
  "math-02-16": {
    "id": "math-02-16",
    "title": "Linear approximation in several variables",
    "tagline": "Linear approximation uses the tangent plane as a nearby calculator.",
    "connections": {
      "buildsOn": [
        "Tangent planes",
        "partial derivatives",
        "vectors"
      ],
      "leadsTo": [
        "The multivariable chain rule",
        "optimization and integration"
      ],
      "usedWith": [
        "gradients",
        "linear maps",
        "level sets",
        "quadratic forms"
      ]
    },
    "motivation": "<p>You already know how one-variable calculus studies a curve by zooming in, measuring slope, or adding small pieces. Linear approximation in several variables brings that same habit into several variables.</p><p>The reward is practical: surfaces, vector maps, losses, and densities become computable with local slopes, curvature, constraints, or accumulated totals.</p>",
    "definition": "<p>For differentiable $f$, $$f(a+\\Delta x,b+\\Delta y)\\approx f(a,b)+f_x(a,b)\\Delta x+f_y(a,b)\\Delta y.$$ This is the tangent plane written with displacements.</p><p><b>Assumptions that matter:</b> the move should be small, and differentiability must hold near the base point.</p>",
    "worked": {
      "problem": "Estimate $f(2.02,2.97)$ for $f=x^2+y^2$ from base $(2,3)$.",
      "skills": [
        "setup",
        "calculation",
        "interpretation"
      ],
      "strategy": "Translate the geometric idea into derivatives or integrals, then compute one quantity at a time.",
      "steps": [
        {
          "do": "Evaluate base value",
          "result": "$13$",
          "why": "$4+9=13$"
        },
        {
          "do": "Compute partials",
          "result": "$f_x=2x$, $f_y=2y$",
          "why": "differentiate"
        },
        {
          "do": "Evaluate gradient",
          "result": "$(4,6)$",
          "why": "use $(2,3)$"
        },
        {
          "do": "Compute displacement",
          "result": "$(0.02,-0.03)$",
          "why": "subtract the base point"
        },
        {
          "do": "Dot and add",
          "result": "$13+4(0.02)+6(-0.03)=12.90$",
          "why": "linear approximation"
        }
      ],
      "verify": "The result has the expected sign, size, and units for the local geometry.",
      "answer": "$12.90$.",
      "connects": "Linear approximation is the tangent plane used numerically."
    },
    "practice": [
      {
        "problem": "Linear approximation in several variables: compute the basic object for $f(x,y)=x^2+y^2$ at $(1,2)$.",
        "steps": [
          {
            "do": "Compute $f_x$",
            "result": "$2x$",
            "why": "differentiate with respect to $x$"
          },
          {
            "do": "Compute $f_y$",
            "result": "$2y$",
            "why": "differentiate with respect to $y$"
          },
          {
            "do": "Evaluate at $(1,2)$",
            "result": "$(2,4)$",
            "why": "substitute the point"
          },
          {
            "do": "Interpret",
            "result": "local change is $2\\Delta x+4\\Delta y$",
            "why": "use first-order information"
          }
        ],
        "answer": "The local first-order data is $(2,4)$."
      },
      {
        "problem": "Linear approximation in several variables: use $f(x,y)=x^2-y^2$ at $(3,1)$.",
        "steps": [
          {
            "do": "Compute partials",
            "result": "$f_x=2x$, $f_y=-2y$",
            "why": "differentiate"
          },
          {
            "do": "Evaluate partials",
            "result": "$(6,-2)$",
            "why": "substitute $(3,1)$"
          },
          {
            "do": "Use move $(0.1,-0.1)$",
            "result": "$6(0.1)-2(-0.1)$",
            "why": "multiply slopes by displacements"
          },
          {
            "do": "Simplify",
            "result": "$0.8$",
            "why": "combine terms"
          }
        ],
        "answer": "The predicted first-order change is $0.8$."
      },
      {
        "problem": "Linear approximation in several variables: compute second-order data for $q(x,y)=x^2+3xy+2y^2$.",
        "steps": [
          {
            "do": "Compute first partials",
            "result": "$q_x=2x+3y$, $q_y=3x+4y$",
            "why": "differentiate once"
          },
          {
            "do": "Compute $q_{xx}$",
            "result": "$2$",
            "why": "differentiate $q_x$ by $x$"
          },
          {
            "do": "Compute mixed partials",
            "result": "$q_{xy}=q_{yx}=3$",
            "why": "differentiate across variables"
          },
          {
            "do": "Compute $q_{yy}$",
            "result": "$4$",
            "why": "differentiate $q_y$ by $y$"
          }
        ],
        "answer": "The second-order entries are $2,3,3,4$."
      },
      {
        "problem": "Linear approximation in several variables: evaluate a constrained or local step with gradient $(4,-6)$ and learning rate $0.05$.",
        "steps": [
          {
            "do": "Write the descent update",
            "result": "$-0.05(4,-6)$",
            "why": "move opposite the gradient"
          },
          {
            "do": "Multiply",
            "result": "$( -0.2,0.3)$",
            "why": "scale each component"
          },
          {
            "do": "Add to current point $(1,2)$",
            "result": "$(0.8,2.3)$",
            "why": "apply the update"
          },
          {
            "do": "Interpret",
            "result": "loss should decrease for a small enough step",
            "why": "descent follows negative gradient"
          }
        ],
        "answer": "The updated point is $(0.8,2.3)$."
      },
      {
        "problem": "Linear approximation in several variables: compute an ML local prediction from value $10$, gradient $(-3,4)$, and move $(0.2,-0.1)$.",
        "steps": [
          {
            "do": "Dot gradient with move",
            "result": "$(-3)(0.2)+4(-0.1)$",
            "why": "linear change is gradient dot displacement"
          },
          {
            "do": "Simplify change",
            "result": "$-1.0$",
            "why": "combine contributions"
          },
          {
            "do": "Add base value",
            "result": "$10-1.0$",
            "why": "local approximation"
          },
          {
            "do": "State prediction",
            "result": "$9.0$",
            "why": "finish arithmetic"
          }
        ],
        "answer": "The local prediction is $9.0$."
      }
    ],
    "applications": [
      {
        "title": "Gradient descent",
        "background": "Modern training uses derivatives to choose parameter updates instead of trying random moves.",
        "numbers": "With gradient $(3,-4)$ and learning rate $0.1$, the update is $(-0.3,0.4)$."
      },
      {
        "title": "Backpropagation",
        "background": "Backprop is organized calculus on a computation graph, passing local sensitivities backward.",
        "numbers": "An upstream gradient $5$ through a local derivative $2.4$ becomes $12$."
      },
      {
        "title": "Gradient checking",
        "background": "Engineers compare analytic derivatives with finite differences to find implementation bugs.",
        "numbers": "If $f(2.001)-f(2)=0.004002$, the finite-difference slope is $4.002$."
      },
      {
        "title": "Feature scaling",
        "background": "Derivative magnitudes reveal whether one input dominates another numerically.",
        "numbers": "Slopes $80$ and $0.2$ mean a $0.01$ move in the first feature changes output $0.8$, four times a $1$ move in the second."
      },
      {
        "title": "Sensitivity analysis",
        "background": "Teams estimate metric changes from small controllable moves.",
        "numbers": "Slopes $(120,-30)$ and move $(0.5,1)$ predict $120(0.5)-30=30$ extra units."
      },
      {
        "title": "Optimization diagnostics",
        "background": "Large local factors can create unstable training dynamics.",
        "numbers": "A factor $20$ repeated through $4$ layers can magnify gradients by $20^4=160000$."
      }
    ],
    "applicationsClose": "The same pattern appears under many names: local change, curvature, constrained motion, and accumulated mass are all ways to turn geometry into numbers.",
    "takeaways": [
      "Linear approximation is local.",
      "Work one derivative, matrix entry, equation, or bound at a time.",
      "Check every numerical result with signs and units."
    ]
  },
  "math-02-17": {
    "id": "math-02-17",
    "title": "The multivariable chain rule",
    "tagline": "The multivariable chain rule adds every path through which change travels.",
    "connections": {
      "buildsOn": [
        "Linear approximation in several variables",
        "partial derivatives",
        "vectors"
      ],
      "leadsTo": [
        "The Jacobian matrix",
        "optimization and integration"
      ],
      "usedWith": [
        "gradients",
        "linear maps",
        "level sets",
        "quadratic forms"
      ]
    },
    "motivation": "<p>You already know how one-variable calculus studies a curve by zooming in, measuring slope, or adding small pieces. The multivariable chain rule brings that same habit into several variables.</p><p>The reward is practical: surfaces, vector maps, losses, and densities become computable with local slopes, curvature, constraints, or accumulated totals.</p>",
    "definition": "<p>If $z=f(x,y)$ with $x=x(t)$ and $y=y(t)$, then $$\\frac{dz}{dt}=f_x\\frac{dx}{dt}+f_y\\frac{dy}{dt}.$$ In matrix form, derivatives of composed maps multiply as Jacobians.</p><p><b>Assumptions that matter:</b> every component must be differentiable and every dependency path must be included.</p>",
    "worked": {
      "problem": "Let $z=x^2y$, $x=t+1$, $y=t^2$. Find $dz/dt$ at $t=2$.",
      "skills": [
        "setup",
        "calculation",
        "interpretation"
      ],
      "strategy": "Translate the geometric idea into derivatives or integrals, then compute one quantity at a time.",
      "steps": [
        {
          "do": "Evaluate inner variables",
          "result": "$x=3$, $y=4$",
          "why": "substitute $t=2$"
        },
        {
          "do": "Compute partials",
          "result": "$f_x=2xy$, $f_y=x^2$",
          "why": "differentiate outer function"
        },
        {
          "do": "Compute inner derivatives",
          "result": "$dx/dt=1$, $dy/dt=4$",
          "why": "differentiate inner functions"
        },
        {
          "do": "Apply chain rule",
          "result": "$(2\\cdot3\\cdot4)(1)+9(4)$",
          "why": "add both paths"
        },
        {
          "do": "Simplify",
          "result": "$60$",
          "why": "combine terms"
        }
      ],
      "verify": "The result has the expected sign, size, and units for the local geometry.",
      "answer": "$dz/dt=60$.",
      "connects": "Backprop is this rule repeated through a graph."
    },
    "practice": [
      {
        "problem": "The multivariable chain rule: compute the basic object for $f(x,y)=x^2+y^2$ at $(1,2)$.",
        "steps": [
          {
            "do": "Compute $f_x$",
            "result": "$2x$",
            "why": "differentiate with respect to $x$"
          },
          {
            "do": "Compute $f_y$",
            "result": "$2y$",
            "why": "differentiate with respect to $y$"
          },
          {
            "do": "Evaluate at $(1,2)$",
            "result": "$(2,4)$",
            "why": "substitute the point"
          },
          {
            "do": "Interpret",
            "result": "local change is $2\\Delta x+4\\Delta y$",
            "why": "use first-order information"
          }
        ],
        "answer": "The local first-order data is $(2,4)$."
      },
      {
        "problem": "The multivariable chain rule: use $f(x,y)=x^2-y^2$ at $(3,1)$.",
        "steps": [
          {
            "do": "Compute partials",
            "result": "$f_x=2x$, $f_y=-2y$",
            "why": "differentiate"
          },
          {
            "do": "Evaluate partials",
            "result": "$(6,-2)$",
            "why": "substitute $(3,1)$"
          },
          {
            "do": "Use move $(0.1,-0.1)$",
            "result": "$6(0.1)-2(-0.1)$",
            "why": "multiply slopes by displacements"
          },
          {
            "do": "Simplify",
            "result": "$0.8$",
            "why": "combine terms"
          }
        ],
        "answer": "The predicted first-order change is $0.8$."
      },
      {
        "problem": "The multivariable chain rule: compute second-order data for $q(x,y)=x^2+3xy+2y^2$.",
        "steps": [
          {
            "do": "Compute first partials",
            "result": "$q_x=2x+3y$, $q_y=3x+4y$",
            "why": "differentiate once"
          },
          {
            "do": "Compute $q_{xx}$",
            "result": "$2$",
            "why": "differentiate $q_x$ by $x$"
          },
          {
            "do": "Compute mixed partials",
            "result": "$q_{xy}=q_{yx}=3$",
            "why": "differentiate across variables"
          },
          {
            "do": "Compute $q_{yy}$",
            "result": "$4$",
            "why": "differentiate $q_y$ by $y$"
          }
        ],
        "answer": "The second-order entries are $2,3,3,4$."
      },
      {
        "problem": "The multivariable chain rule: evaluate a constrained or local step with gradient $(4,-6)$ and learning rate $0.05$.",
        "steps": [
          {
            "do": "Write the descent update",
            "result": "$-0.05(4,-6)$",
            "why": "move opposite the gradient"
          },
          {
            "do": "Multiply",
            "result": "$( -0.2,0.3)$",
            "why": "scale each component"
          },
          {
            "do": "Add to current point $(1,2)$",
            "result": "$(0.8,2.3)$",
            "why": "apply the update"
          },
          {
            "do": "Interpret",
            "result": "loss should decrease for a small enough step",
            "why": "descent follows negative gradient"
          }
        ],
        "answer": "The updated point is $(0.8,2.3)$."
      },
      {
        "problem": "The multivariable chain rule: compute an ML local prediction from value $10$, gradient $(-3,4)$, and move $(0.2,-0.1)$.",
        "steps": [
          {
            "do": "Dot gradient with move",
            "result": "$(-3)(0.2)+4(-0.1)$",
            "why": "linear change is gradient dot displacement"
          },
          {
            "do": "Simplify change",
            "result": "$-1.0$",
            "why": "combine contributions"
          },
          {
            "do": "Add base value",
            "result": "$10-1.0$",
            "why": "local approximation"
          },
          {
            "do": "State prediction",
            "result": "$9.0$",
            "why": "finish arithmetic"
          }
        ],
        "answer": "The local prediction is $9.0$."
      }
    ],
    "applications": [
      {
        "title": "Gradient descent",
        "background": "Modern training uses derivatives to choose parameter updates instead of trying random moves.",
        "numbers": "With gradient $(3,-4)$ and learning rate $0.1$, the update is $(-0.3,0.4)$."
      },
      {
        "title": "Backpropagation",
        "background": "Backprop is organized calculus on a computation graph, passing local sensitivities backward.",
        "numbers": "An upstream gradient $5$ through a local derivative $2.4$ becomes $12$."
      },
      {
        "title": "Gradient checking",
        "background": "Engineers compare analytic derivatives with finite differences to find implementation bugs.",
        "numbers": "If $f(2.001)-f(2)=0.004002$, the finite-difference slope is $4.002$."
      },
      {
        "title": "Feature scaling",
        "background": "Derivative magnitudes reveal whether one input dominates another numerically.",
        "numbers": "Slopes $80$ and $0.2$ mean a $0.01$ move in the first feature changes output $0.8$, four times a $1$ move in the second."
      },
      {
        "title": "Sensitivity analysis",
        "background": "Teams estimate metric changes from small controllable moves.",
        "numbers": "Slopes $(120,-30)$ and move $(0.5,1)$ predict $120(0.5)-30=30$ extra units."
      },
      {
        "title": "Optimization diagnostics",
        "background": "Large local factors can create unstable training dynamics.",
        "numbers": "A factor $20$ repeated through $4$ layers can magnify gradients by $20^4=160000$."
      }
    ],
    "applicationsClose": "The same pattern appears under many names: local change, curvature, constrained motion, and accumulated mass are all ways to turn geometry into numbers.",
    "takeaways": [
      "The chain rule sums all paths of dependence.",
      "Work one derivative, matrix entry, equation, or bound at a time.",
      "Check every numerical result with signs and units."
    ]
  },
  "math-02-18": {
    "id": "math-02-18",
    "title": "The Jacobian matrix",
    "tagline": "The Jacobian is the matrix of first derivatives for a vector-valued map.",
    "connections": {
      "buildsOn": [
        "The multivariable chain rule",
        "partial derivatives",
        "vectors"
      ],
      "leadsTo": [
        "Higher-order partial derivatives",
        "optimization and integration"
      ],
      "usedWith": [
        "gradients",
        "linear maps",
        "level sets",
        "quadratic forms"
      ]
    },
    "motivation": "<p>You already know how one-variable calculus studies a curve by zooming in, measuring slope, or adding small pieces. The Jacobian matrix brings that same habit into several variables.</p><p>The reward is practical: surfaces, vector maps, losses, and densities become computable with local slopes, curvature, constraints, or accumulated totals.</p>",
    "definition": "<p>For $F:\\mathbb{R}^n\\to\\mathbb{R}^m$, $$J_F(x)=\\left[\\frac{\\partial F_i}{\\partial x_j}\\right].$$ It gives the local linear approximation $F(x+h)\\approx F(x)+J_F(x)h$.</p><p><b>Assumptions that matter:</b> partial derivatives should exist, and differentiability makes the matrix a true local linear map.</p>",
    "worked": {
      "problem": "Find $J_F(2,3)$ for $F(x,y)=(x^2+y,xy)$.",
      "skills": [
        "setup",
        "calculation",
        "interpretation"
      ],
      "strategy": "Translate the geometric idea into derivatives or integrals, then compute one quantity at a time.",
      "steps": [
        {
          "do": "Name outputs",
          "result": "$F_1=x^2+y$, $F_2=xy$",
          "why": "compute row by row"
        },
        {
          "do": "Differentiate $F_1$",
          "result": "$(2x,1)$",
          "why": "partials with respect to $x,y$"
        },
        {
          "do": "Differentiate $F_2$",
          "result": "$(y,x)$",
          "why": "partials with respect to $x,y$"
        },
        {
          "do": "Assemble matrix",
          "result": "$J=\\begin{bmatrix}2x&1\\y&x\\end{bmatrix}$",
          "why": "rows are output gradients"
        },
        {
          "do": "Evaluate",
          "result": "$\\begin{bmatrix}4&1\\3&2\\end{bmatrix}$",
          "why": "substitute $(2,3)$"
        }
      ],
      "verify": "The result has the expected sign, size, and units for the local geometry.",
      "answer": "$J_F(2,3)=\\begin{bmatrix}4&1\\3&2\\end{bmatrix}$.",
      "connects": "A Jacobian is a local linear layer."
    },
    "practice": [
      {
        "problem": "The Jacobian matrix: compute the basic object for $f(x,y)=x^2+y^2$ at $(1,2)$.",
        "steps": [
          {
            "do": "Compute $f_x$",
            "result": "$2x$",
            "why": "differentiate with respect to $x$"
          },
          {
            "do": "Compute $f_y$",
            "result": "$2y$",
            "why": "differentiate with respect to $y$"
          },
          {
            "do": "Evaluate at $(1,2)$",
            "result": "$(2,4)$",
            "why": "substitute the point"
          },
          {
            "do": "Interpret",
            "result": "local change is $2\\Delta x+4\\Delta y$",
            "why": "use first-order information"
          }
        ],
        "answer": "The local first-order data is $(2,4)$."
      },
      {
        "problem": "The Jacobian matrix: use $f(x,y)=x^2-y^2$ at $(3,1)$.",
        "steps": [
          {
            "do": "Compute partials",
            "result": "$f_x=2x$, $f_y=-2y$",
            "why": "differentiate"
          },
          {
            "do": "Evaluate partials",
            "result": "$(6,-2)$",
            "why": "substitute $(3,1)$"
          },
          {
            "do": "Use move $(0.1,-0.1)$",
            "result": "$6(0.1)-2(-0.1)$",
            "why": "multiply slopes by displacements"
          },
          {
            "do": "Simplify",
            "result": "$0.8$",
            "why": "combine terms"
          }
        ],
        "answer": "The predicted first-order change is $0.8$."
      },
      {
        "problem": "The Jacobian matrix: compute second-order data for $q(x,y)=x^2+3xy+2y^2$.",
        "steps": [
          {
            "do": "Compute first partials",
            "result": "$q_x=2x+3y$, $q_y=3x+4y$",
            "why": "differentiate once"
          },
          {
            "do": "Compute $q_{xx}$",
            "result": "$2$",
            "why": "differentiate $q_x$ by $x$"
          },
          {
            "do": "Compute mixed partials",
            "result": "$q_{xy}=q_{yx}=3$",
            "why": "differentiate across variables"
          },
          {
            "do": "Compute $q_{yy}$",
            "result": "$4$",
            "why": "differentiate $q_y$ by $y$"
          }
        ],
        "answer": "The second-order entries are $2,3,3,4$."
      },
      {
        "problem": "The Jacobian matrix: evaluate a constrained or local step with gradient $(4,-6)$ and learning rate $0.05$.",
        "steps": [
          {
            "do": "Write the descent update",
            "result": "$-0.05(4,-6)$",
            "why": "move opposite the gradient"
          },
          {
            "do": "Multiply",
            "result": "$( -0.2,0.3)$",
            "why": "scale each component"
          },
          {
            "do": "Add to current point $(1,2)$",
            "result": "$(0.8,2.3)$",
            "why": "apply the update"
          },
          {
            "do": "Interpret",
            "result": "loss should decrease for a small enough step",
            "why": "descent follows negative gradient"
          }
        ],
        "answer": "The updated point is $(0.8,2.3)$."
      },
      {
        "problem": "The Jacobian matrix: compute an ML local prediction from value $10$, gradient $(-3,4)$, and move $(0.2,-0.1)$.",
        "steps": [
          {
            "do": "Dot gradient with move",
            "result": "$(-3)(0.2)+4(-0.1)$",
            "why": "linear change is gradient dot displacement"
          },
          {
            "do": "Simplify change",
            "result": "$-1.0$",
            "why": "combine contributions"
          },
          {
            "do": "Add base value",
            "result": "$10-1.0$",
            "why": "local approximation"
          },
          {
            "do": "State prediction",
            "result": "$9.0$",
            "why": "finish arithmetic"
          }
        ],
        "answer": "The local prediction is $9.0$."
      }
    ],
    "applications": [
      {
        "title": "Gradient descent",
        "background": "Modern training uses derivatives to choose parameter updates instead of trying random moves.",
        "numbers": "With gradient $(3,-4)$ and learning rate $0.1$, the update is $(-0.3,0.4)$."
      },
      {
        "title": "Backpropagation",
        "background": "Backprop is organized calculus on a computation graph, passing local sensitivities backward.",
        "numbers": "An upstream gradient $5$ through a local derivative $2.4$ becomes $12$."
      },
      {
        "title": "Gradient checking",
        "background": "Engineers compare analytic derivatives with finite differences to find implementation bugs.",
        "numbers": "If $f(2.001)-f(2)=0.004002$, the finite-difference slope is $4.002$."
      },
      {
        "title": "Feature scaling",
        "background": "Derivative magnitudes reveal whether one input dominates another numerically.",
        "numbers": "Slopes $80$ and $0.2$ mean a $0.01$ move in the first feature changes output $0.8$, four times a $1$ move in the second."
      },
      {
        "title": "Sensitivity analysis",
        "background": "Teams estimate metric changes from small controllable moves.",
        "numbers": "Slopes $(120,-30)$ and move $(0.5,1)$ predict $120(0.5)-30=30$ extra units."
      },
      {
        "title": "Optimization diagnostics",
        "background": "Large local factors can create unstable training dynamics.",
        "numbers": "A factor $20$ repeated through $4$ layers can magnify gradients by $20^4=160000$."
      }
    ],
    "applicationsClose": "The same pattern appears under many names: local change, curvature, constrained motion, and accumulated mass are all ways to turn geometry into numbers.",
    "takeaways": [
      "Rows are output sensitivities; columns are input sensitivities.",
      "Work one derivative, matrix entry, equation, or bound at a time.",
      "Check every numerical result with signs and units."
    ]
  },
  "math-02-19": {
    "id": "math-02-19",
    "title": "Higher-order partial derivatives",
    "tagline": "Higher-order partials measure how slopes change.",
    "connections": {
      "buildsOn": [
        "The Jacobian matrix",
        "partial derivatives",
        "vectors"
      ],
      "leadsTo": [
        "The Hessian matrix",
        "optimization and integration"
      ],
      "usedWith": [
        "gradients",
        "linear maps",
        "level sets",
        "quadratic forms"
      ]
    },
    "motivation": "<p>You already know how one-variable calculus studies a curve by zooming in, measuring slope, or adding small pieces. Higher-order partial derivatives brings that same habit into several variables.</p><p>The reward is practical: surfaces, vector maps, losses, and densities become computable with local slopes, curvature, constraints, or accumulated totals.</p>",
    "definition": "<p>Second partials include $f_{xx}$, $f_{yy}$, $f_{xy}$, and $f_{yx}$. If second partials are continuous near the point, Clairaut's theorem gives $f_{xy}=f_{yx}$.</p><p><b>Assumptions that matter:</b> equality of mixed partials needs smoothness; otherwise order can matter.</p>",
    "worked": {
      "problem": "Find the second partials of $f=x^3y+2xy^2$.",
      "skills": [
        "setup",
        "calculation",
        "interpretation"
      ],
      "strategy": "Translate the geometric idea into derivatives or integrals, then compute one quantity at a time.",
      "steps": [
        {
          "do": "Compute $f_x$",
          "result": "$3x^2y+2y^2$",
          "why": "differentiate by $x$"
        },
        {
          "do": "Compute $f_y$",
          "result": "$x^3+4xy$",
          "why": "differentiate by $y$"
        },
        {
          "do": "Compute $f_{xx}$",
          "result": "$6xy$",
          "why": "differentiate $f_x$ by $x$"
        },
        {
          "do": "Compute $f_{xy}$",
          "result": "$3x^2+4y$",
          "why": "differentiate $f_x$ by $y$"
        },
        {
          "do": "Compute $f_{yy}$",
          "result": "$4x$",
          "why": "differentiate $f_y$ by $y$"
        }
      ],
      "verify": "The result has the expected sign, size, and units for the local geometry.",
      "answer": "$f_{xx}=6xy$, $f_{xy}=f_{yx}=3x^2+4y$, $f_{yy}=4x$.",
      "connects": "Second partials prepare the Hessian."
    },
    "practice": [
      {
        "problem": "Higher-order partial derivatives: compute the basic object for $f(x,y)=x^2+y^2$ at $(1,2)$.",
        "steps": [
          {
            "do": "Compute $f_x$",
            "result": "$2x$",
            "why": "differentiate with respect to $x$"
          },
          {
            "do": "Compute $f_y$",
            "result": "$2y$",
            "why": "differentiate with respect to $y$"
          },
          {
            "do": "Evaluate at $(1,2)$",
            "result": "$(2,4)$",
            "why": "substitute the point"
          },
          {
            "do": "Interpret",
            "result": "local change is $2\\Delta x+4\\Delta y$",
            "why": "use first-order information"
          }
        ],
        "answer": "The local first-order data is $(2,4)$."
      },
      {
        "problem": "Higher-order partial derivatives: use $f(x,y)=x^2-y^2$ at $(3,1)$.",
        "steps": [
          {
            "do": "Compute partials",
            "result": "$f_x=2x$, $f_y=-2y$",
            "why": "differentiate"
          },
          {
            "do": "Evaluate partials",
            "result": "$(6,-2)$",
            "why": "substitute $(3,1)$"
          },
          {
            "do": "Use move $(0.1,-0.1)$",
            "result": "$6(0.1)-2(-0.1)$",
            "why": "multiply slopes by displacements"
          },
          {
            "do": "Simplify",
            "result": "$0.8$",
            "why": "combine terms"
          }
        ],
        "answer": "The predicted first-order change is $0.8$."
      },
      {
        "problem": "Higher-order partial derivatives: compute second-order data for $q(x,y)=x^2+3xy+2y^2$.",
        "steps": [
          {
            "do": "Compute first partials",
            "result": "$q_x=2x+3y$, $q_y=3x+4y$",
            "why": "differentiate once"
          },
          {
            "do": "Compute $q_{xx}$",
            "result": "$2$",
            "why": "differentiate $q_x$ by $x$"
          },
          {
            "do": "Compute mixed partials",
            "result": "$q_{xy}=q_{yx}=3$",
            "why": "differentiate across variables"
          },
          {
            "do": "Compute $q_{yy}$",
            "result": "$4$",
            "why": "differentiate $q_y$ by $y$"
          }
        ],
        "answer": "The second-order entries are $2,3,3,4$."
      },
      {
        "problem": "Higher-order partial derivatives: evaluate a constrained or local step with gradient $(4,-6)$ and learning rate $0.05$.",
        "steps": [
          {
            "do": "Write the descent update",
            "result": "$-0.05(4,-6)$",
            "why": "move opposite the gradient"
          },
          {
            "do": "Multiply",
            "result": "$( -0.2,0.3)$",
            "why": "scale each component"
          },
          {
            "do": "Add to current point $(1,2)$",
            "result": "$(0.8,2.3)$",
            "why": "apply the update"
          },
          {
            "do": "Interpret",
            "result": "loss should decrease for a small enough step",
            "why": "descent follows negative gradient"
          }
        ],
        "answer": "The updated point is $(0.8,2.3)$."
      },
      {
        "problem": "Higher-order partial derivatives: compute an ML local prediction from value $10$, gradient $(-3,4)$, and move $(0.2,-0.1)$.",
        "steps": [
          {
            "do": "Dot gradient with move",
            "result": "$(-3)(0.2)+4(-0.1)$",
            "why": "linear change is gradient dot displacement"
          },
          {
            "do": "Simplify change",
            "result": "$-1.0$",
            "why": "combine contributions"
          },
          {
            "do": "Add base value",
            "result": "$10-1.0$",
            "why": "local approximation"
          },
          {
            "do": "State prediction",
            "result": "$9.0$",
            "why": "finish arithmetic"
          }
        ],
        "answer": "The local prediction is $9.0$."
      }
    ],
    "applications": [
      {
        "title": "Gradient descent",
        "background": "Modern training uses derivatives to choose parameter updates instead of trying random moves.",
        "numbers": "With gradient $(3,-4)$ and learning rate $0.1$, the update is $(-0.3,0.4)$."
      },
      {
        "title": "Backpropagation",
        "background": "Backprop is organized calculus on a computation graph, passing local sensitivities backward.",
        "numbers": "An upstream gradient $5$ through a local derivative $2.4$ becomes $12$."
      },
      {
        "title": "Gradient checking",
        "background": "Engineers compare analytic derivatives with finite differences to find implementation bugs.",
        "numbers": "If $f(2.001)-f(2)=0.004002$, the finite-difference slope is $4.002$."
      },
      {
        "title": "Feature scaling",
        "background": "Derivative magnitudes reveal whether one input dominates another numerically.",
        "numbers": "Slopes $80$ and $0.2$ mean a $0.01$ move in the first feature changes output $0.8$, four times a $1$ move in the second."
      },
      {
        "title": "Sensitivity analysis",
        "background": "Teams estimate metric changes from small controllable moves.",
        "numbers": "Slopes $(120,-30)$ and move $(0.5,1)$ predict $120(0.5)-30=30$ extra units."
      },
      {
        "title": "Optimization diagnostics",
        "background": "Large local factors can create unstable training dynamics.",
        "numbers": "A factor $20$ repeated through $4$ layers can magnify gradients by $20^4=160000$."
      }
    ],
    "applicationsClose": "The same pattern appears under many names: local change, curvature, constrained motion, and accumulated mass are all ways to turn geometry into numbers.",
    "takeaways": [
      "Second derivatives describe curvature and interaction.",
      "Work one derivative, matrix entry, equation, or bound at a time.",
      "Check every numerical result with signs and units."
    ]
  },
  "math-02-20": {
    "id": "math-02-20",
    "title": "The Hessian matrix",
    "tagline": "The Hessian is the curvature matrix of a scalar function.",
    "connections": {
      "buildsOn": [
        "Higher-order partial derivatives",
        "partial derivatives",
        "vectors"
      ],
      "leadsTo": [
        "Multivariable Taylor expansion",
        "optimization and integration"
      ],
      "usedWith": [
        "gradients",
        "linear maps",
        "level sets",
        "quadratic forms"
      ]
    },
    "motivation": "<p>You already know how one-variable calculus studies a curve by zooming in, measuring slope, or adding small pieces. The Hessian matrix brings that same habit into several variables.</p><p>The reward is practical: surfaces, vector maps, losses, and densities become computable with local slopes, curvature, constraints, or accumulated totals.</p>",
    "definition": "<p>For $f:\\mathbb{R}^n\\to\\mathbb{R}$, $$H_f=\\left[\\frac{\\partial^2 f}{\\partial x_i\\partial x_j}\\right].$$ In two variables it is $\\begin{bmatrix}f_{xx}&f_{xy}\\f_{yx}&f_{yy}\\end{bmatrix}$.</p><p><b>Assumptions that matter:</b> second derivatives must exist; continuous second partials make the Hessian symmetric.</p>",
    "worked": {
      "problem": "Find the Hessian of $f=x^2+3xy+4y^2$.",
      "skills": [
        "setup",
        "calculation",
        "interpretation"
      ],
      "strategy": "Translate the geometric idea into derivatives or integrals, then compute one quantity at a time.",
      "steps": [
        {
          "do": "Compute $f_x$",
          "result": "$2x+3y$",
          "why": "first partial"
        },
        {
          "do": "Compute $f_y$",
          "result": "$3x+8y$",
          "why": "first partial"
        },
        {
          "do": "Compute $f_{xx}$",
          "result": "$2$",
          "why": "differentiate $f_x$ by $x$"
        },
        {
          "do": "Compute mixed partials",
          "result": "$f_{xy}=f_{yx}=3$",
          "why": "differentiate across variables"
        },
        {
          "do": "Compute $f_{yy}$",
          "result": "$8$",
          "why": "differentiate $f_y$ by $y$"
        }
      ],
      "verify": "The result has the expected sign, size, and units for the local geometry.",
      "answer": "$H=\\begin{bmatrix}2&3\\3&8\\end{bmatrix}$.",
      "connects": "The Hessian tells how the gradient changes."
    },
    "practice": [
      {
        "problem": "The Hessian matrix: compute the basic object for $f(x,y)=x^2+y^2$ at $(1,2)$.",
        "steps": [
          {
            "do": "Compute $f_x$",
            "result": "$2x$",
            "why": "differentiate with respect to $x$"
          },
          {
            "do": "Compute $f_y$",
            "result": "$2y$",
            "why": "differentiate with respect to $y$"
          },
          {
            "do": "Evaluate at $(1,2)$",
            "result": "$(2,4)$",
            "why": "substitute the point"
          },
          {
            "do": "Interpret",
            "result": "local change is $2\\Delta x+4\\Delta y$",
            "why": "use first-order information"
          }
        ],
        "answer": "The local first-order data is $(2,4)$."
      },
      {
        "problem": "The Hessian matrix: use $f(x,y)=x^2-y^2$ at $(3,1)$.",
        "steps": [
          {
            "do": "Compute partials",
            "result": "$f_x=2x$, $f_y=-2y$",
            "why": "differentiate"
          },
          {
            "do": "Evaluate partials",
            "result": "$(6,-2)$",
            "why": "substitute $(3,1)$"
          },
          {
            "do": "Use move $(0.1,-0.1)$",
            "result": "$6(0.1)-2(-0.1)$",
            "why": "multiply slopes by displacements"
          },
          {
            "do": "Simplify",
            "result": "$0.8$",
            "why": "combine terms"
          }
        ],
        "answer": "The predicted first-order change is $0.8$."
      },
      {
        "problem": "The Hessian matrix: compute second-order data for $q(x,y)=x^2+3xy+2y^2$.",
        "steps": [
          {
            "do": "Compute first partials",
            "result": "$q_x=2x+3y$, $q_y=3x+4y$",
            "why": "differentiate once"
          },
          {
            "do": "Compute $q_{xx}$",
            "result": "$2$",
            "why": "differentiate $q_x$ by $x$"
          },
          {
            "do": "Compute mixed partials",
            "result": "$q_{xy}=q_{yx}=3$",
            "why": "differentiate across variables"
          },
          {
            "do": "Compute $q_{yy}$",
            "result": "$4$",
            "why": "differentiate $q_y$ by $y$"
          }
        ],
        "answer": "The second-order entries are $2,3,3,4$."
      },
      {
        "problem": "The Hessian matrix: evaluate a constrained or local step with gradient $(4,-6)$ and learning rate $0.05$.",
        "steps": [
          {
            "do": "Write the descent update",
            "result": "$-0.05(4,-6)$",
            "why": "move opposite the gradient"
          },
          {
            "do": "Multiply",
            "result": "$( -0.2,0.3)$",
            "why": "scale each component"
          },
          {
            "do": "Add to current point $(1,2)$",
            "result": "$(0.8,2.3)$",
            "why": "apply the update"
          },
          {
            "do": "Interpret",
            "result": "loss should decrease for a small enough step",
            "why": "descent follows negative gradient"
          }
        ],
        "answer": "The updated point is $(0.8,2.3)$."
      },
      {
        "problem": "The Hessian matrix: compute an ML local prediction from value $10$, gradient $(-3,4)$, and move $(0.2,-0.1)$.",
        "steps": [
          {
            "do": "Dot gradient with move",
            "result": "$(-3)(0.2)+4(-0.1)$",
            "why": "linear change is gradient dot displacement"
          },
          {
            "do": "Simplify change",
            "result": "$-1.0$",
            "why": "combine contributions"
          },
          {
            "do": "Add base value",
            "result": "$10-1.0$",
            "why": "local approximation"
          },
          {
            "do": "State prediction",
            "result": "$9.0$",
            "why": "finish arithmetic"
          }
        ],
        "answer": "The local prediction is $9.0$."
      }
    ],
    "applications": [
      {
        "title": "Gradient descent",
        "background": "Modern training uses derivatives to choose parameter updates instead of trying random moves.",
        "numbers": "With gradient $(3,-4)$ and learning rate $0.1$, the update is $(-0.3,0.4)$."
      },
      {
        "title": "Backpropagation",
        "background": "Backprop is organized calculus on a computation graph, passing local sensitivities backward.",
        "numbers": "An upstream gradient $5$ through a local derivative $2.4$ becomes $12$."
      },
      {
        "title": "Gradient checking",
        "background": "Engineers compare analytic derivatives with finite differences to find implementation bugs.",
        "numbers": "If $f(2.001)-f(2)=0.004002$, the finite-difference slope is $4.002$."
      },
      {
        "title": "Feature scaling",
        "background": "Derivative magnitudes reveal whether one input dominates another numerically.",
        "numbers": "Slopes $80$ and $0.2$ mean a $0.01$ move in the first feature changes output $0.8$, four times a $1$ move in the second."
      },
      {
        "title": "Sensitivity analysis",
        "background": "Teams estimate metric changes from small controllable moves.",
        "numbers": "Slopes $(120,-30)$ and move $(0.5,1)$ predict $120(0.5)-30=30$ extra units."
      },
      {
        "title": "Optimization diagnostics",
        "background": "Large local factors can create unstable training dynamics.",
        "numbers": "A factor $20$ repeated through $4$ layers can magnify gradients by $20^4=160000$."
      }
    ],
    "applicationsClose": "The same pattern appears under many names: local change, curvature, constrained motion, and accumulated mass are all ways to turn geometry into numbers.",
    "takeaways": [
      "The Hessian is central to curvature-aware optimization.",
      "Work one derivative, matrix entry, equation, or bound at a time.",
      "Check every numerical result with signs and units."
    ]
  },
  "math-02-21": {
    "id": "math-02-21",
    "title": "Multivariable Taylor expansion",
    "tagline": "Taylor expansion approximates a function with gradient and curvature terms.",
    "connections": {
      "buildsOn": [
        "The Hessian matrix",
        "partial derivatives",
        "vectors"
      ],
      "leadsTo": [
        "Unconstrained optimization and critical points",
        "optimization and integration"
      ],
      "usedWith": [
        "gradients",
        "linear maps",
        "level sets",
        "quadratic forms"
      ]
    },
    "motivation": "<p>You already know how one-variable calculus studies a curve by zooming in, measuring slope, or adding small pieces. Multivariable Taylor expansion brings that same habit into several variables.</p><p>The reward is practical: surfaces, vector maps, losses, and densities become computable with local slopes, curvature, constraints, or accumulated totals.</p>",
    "definition": "<p>For a small vector $h$, $$f(a+h)\\approx f(a)+\\nabla f(a)^T h+\\frac12 h^T H_f(a)h.$$ The gradient gives first-order change; the Hessian gives the quadratic correction.</p><p><b>Assumptions that matter:</b> the approximation is local and needs smooth derivatives near the base point.</p>",
    "worked": {
      "problem": "Approximate $e^{x+y}$ near $(0,0)$ at $(0.1,-0.2)$ to second order.",
      "skills": [
        "setup",
        "calculation",
        "interpretation"
      ],
      "strategy": "Translate the geometric idea into derivatives or integrals, then compute one quantity at a time.",
      "steps": [
        {
          "do": "Set $h$",
          "result": "$h=(0.1,-0.2)$",
          "why": "displacement from base"
        },
        {
          "do": "Evaluate base",
          "result": "$1$",
          "why": "$e^0=1$"
        },
        {
          "do": "Evaluate gradient",
          "result": "$(1,1)$",
          "why": "both partials equal $e^{x+y}$"
        },
        {
          "do": "Evaluate Hessian",
          "result": "$\\begin{bmatrix}1&1\\1&1\\end{bmatrix}$",
          "why": "all second partials equal $1$"
        },
        {
          "do": "Compute approximation",
          "result": "$1-0.1+\\frac12(0.01)=0.905$",
          "why": "$h^T Hh=(0.1-0.2)^2=0.01$"
        }
      ],
      "verify": "The result has the expected sign, size, and units for the local geometry.",
      "answer": "About $0.905$, close to $e^{-0.1}\\approx0.9048$.",
      "connects": "Taylor expansion powers quadratic local models."
    },
    "practice": [
      {
        "problem": "Multivariable Taylor expansion: compute the basic object for $f(x,y)=x^2+y^2$ at $(1,2)$.",
        "steps": [
          {
            "do": "Compute $f_x$",
            "result": "$2x$",
            "why": "differentiate with respect to $x$"
          },
          {
            "do": "Compute $f_y$",
            "result": "$2y$",
            "why": "differentiate with respect to $y$"
          },
          {
            "do": "Evaluate at $(1,2)$",
            "result": "$(2,4)$",
            "why": "substitute the point"
          },
          {
            "do": "Interpret",
            "result": "local change is $2\\Delta x+4\\Delta y$",
            "why": "use first-order information"
          }
        ],
        "answer": "The local first-order data is $(2,4)$."
      },
      {
        "problem": "Multivariable Taylor expansion: use $f(x,y)=x^2-y^2$ at $(3,1)$.",
        "steps": [
          {
            "do": "Compute partials",
            "result": "$f_x=2x$, $f_y=-2y$",
            "why": "differentiate"
          },
          {
            "do": "Evaluate partials",
            "result": "$(6,-2)$",
            "why": "substitute $(3,1)$"
          },
          {
            "do": "Use move $(0.1,-0.1)$",
            "result": "$6(0.1)-2(-0.1)$",
            "why": "multiply slopes by displacements"
          },
          {
            "do": "Simplify",
            "result": "$0.8$",
            "why": "combine terms"
          }
        ],
        "answer": "The predicted first-order change is $0.8$."
      },
      {
        "problem": "Multivariable Taylor expansion: compute second-order data for $q(x,y)=x^2+3xy+2y^2$.",
        "steps": [
          {
            "do": "Compute first partials",
            "result": "$q_x=2x+3y$, $q_y=3x+4y$",
            "why": "differentiate once"
          },
          {
            "do": "Compute $q_{xx}$",
            "result": "$2$",
            "why": "differentiate $q_x$ by $x$"
          },
          {
            "do": "Compute mixed partials",
            "result": "$q_{xy}=q_{yx}=3$",
            "why": "differentiate across variables"
          },
          {
            "do": "Compute $q_{yy}$",
            "result": "$4$",
            "why": "differentiate $q_y$ by $y$"
          }
        ],
        "answer": "The second-order entries are $2,3,3,4$."
      },
      {
        "problem": "Multivariable Taylor expansion: evaluate a constrained or local step with gradient $(4,-6)$ and learning rate $0.05$.",
        "steps": [
          {
            "do": "Write the descent update",
            "result": "$-0.05(4,-6)$",
            "why": "move opposite the gradient"
          },
          {
            "do": "Multiply",
            "result": "$( -0.2,0.3)$",
            "why": "scale each component"
          },
          {
            "do": "Add to current point $(1,2)$",
            "result": "$(0.8,2.3)$",
            "why": "apply the update"
          },
          {
            "do": "Interpret",
            "result": "loss should decrease for a small enough step",
            "why": "descent follows negative gradient"
          }
        ],
        "answer": "The updated point is $(0.8,2.3)$."
      },
      {
        "problem": "Multivariable Taylor expansion: compute an ML local prediction from value $10$, gradient $(-3,4)$, and move $(0.2,-0.1)$.",
        "steps": [
          {
            "do": "Dot gradient with move",
            "result": "$(-3)(0.2)+4(-0.1)$",
            "why": "linear change is gradient dot displacement"
          },
          {
            "do": "Simplify change",
            "result": "$-1.0$",
            "why": "combine contributions"
          },
          {
            "do": "Add base value",
            "result": "$10-1.0$",
            "why": "local approximation"
          },
          {
            "do": "State prediction",
            "result": "$9.0$",
            "why": "finish arithmetic"
          }
        ],
        "answer": "The local prediction is $9.0$."
      }
    ],
    "applications": [
      {
        "title": "Gradient descent",
        "background": "Modern training uses derivatives to choose parameter updates instead of trying random moves.",
        "numbers": "With gradient $(3,-4)$ and learning rate $0.1$, the update is $(-0.3,0.4)$."
      },
      {
        "title": "Backpropagation",
        "background": "Backprop is organized calculus on a computation graph, passing local sensitivities backward.",
        "numbers": "An upstream gradient $5$ through a local derivative $2.4$ becomes $12$."
      },
      {
        "title": "Gradient checking",
        "background": "Engineers compare analytic derivatives with finite differences to find implementation bugs.",
        "numbers": "If $f(2.001)-f(2)=0.004002$, the finite-difference slope is $4.002$."
      },
      {
        "title": "Feature scaling",
        "background": "Derivative magnitudes reveal whether one input dominates another numerically.",
        "numbers": "Slopes $80$ and $0.2$ mean a $0.01$ move in the first feature changes output $0.8$, four times a $1$ move in the second."
      },
      {
        "title": "Sensitivity analysis",
        "background": "Teams estimate metric changes from small controllable moves.",
        "numbers": "Slopes $(120,-30)$ and move $(0.5,1)$ predict $120(0.5)-30=30$ extra units."
      },
      {
        "title": "Optimization diagnostics",
        "background": "Large local factors can create unstable training dynamics.",
        "numbers": "A factor $20$ repeated through $4$ layers can magnify gradients by $20^4=160000$."
      }
    ],
    "applicationsClose": "The same pattern appears under many names: local change, curvature, constrained motion, and accumulated mass are all ways to turn geometry into numbers.",
    "takeaways": [
      "Taylor expansion adds curvature to linear approximation.",
      "Work one derivative, matrix entry, equation, or bound at a time.",
      "Check every numerical result with signs and units."
    ]
  },
  "math-02-22": {
    "id": "math-02-22",
    "title": "Unconstrained optimization and critical points",
    "tagline": "Unconstrained optima of smooth functions occur where the gradient is zero.",
    "connections": {
      "buildsOn": [
        "Multivariable Taylor expansion",
        "partial derivatives",
        "vectors"
      ],
      "leadsTo": [
        "Saddle points",
        "optimization and integration"
      ],
      "usedWith": [
        "gradients",
        "linear maps",
        "level sets",
        "quadratic forms"
      ]
    },
    "motivation": "<p>You already know how one-variable calculus studies a curve by zooming in, measuring slope, or adding small pieces. Unconstrained optimization and critical points brings that same habit into several variables.</p><p>The reward is practical: surfaces, vector maps, losses, and densities become computable with local slopes, curvature, constraints, or accumulated totals.</p>",
    "definition": "<p>A <b>critical point</b> of differentiable $f$ satisfies $\\nabla f=0$. At an interior smooth local optimum, any nonzero gradient would give a descent or ascent direction.</p><p><b>Assumptions that matter:</b> zero gradient is necessary for smooth interior optima, but not sufficient for a minimum or maximum.</p>",
    "worked": {
      "problem": "Find the critical point of $f=(x-2)^2+(y+1)^2+3$.",
      "skills": [
        "setup",
        "calculation",
        "interpretation"
      ],
      "strategy": "Translate the geometric idea into derivatives or integrals, then compute one quantity at a time.",
      "steps": [
        {
          "do": "Compute $f_x$",
          "result": "$2(x-2)$",
          "why": "differentiate"
        },
        {
          "do": "Set $f_x=0$",
          "result": "$x=2$",
          "why": "solve first equation"
        },
        {
          "do": "Compute $f_y$",
          "result": "$2(y+1)$",
          "why": "differentiate"
        },
        {
          "do": "Set $f_y=0$",
          "result": "$y=-1$",
          "why": "solve second equation"
        },
        {
          "do": "Read value",
          "result": "$f(2,-1)=3$",
          "why": "evaluate the minimum"
        }
      ],
      "verify": "The result has the expected sign, size, and units for the local geometry.",
      "answer": "Critical point $(2,-1)$ with value $3$.",
      "connects": "Critical points start the optimization search."
    },
    "practice": [
      {
        "problem": "Unconstrained optimization and critical points: compute the basic object for $f(x,y)=x^2+y^2$ at $(1,2)$.",
        "steps": [
          {
            "do": "Compute $f_x$",
            "result": "$2x$",
            "why": "differentiate with respect to $x$"
          },
          {
            "do": "Compute $f_y$",
            "result": "$2y$",
            "why": "differentiate with respect to $y$"
          },
          {
            "do": "Evaluate at $(1,2)$",
            "result": "$(2,4)$",
            "why": "substitute the point"
          },
          {
            "do": "Interpret",
            "result": "local change is $2\\Delta x+4\\Delta y$",
            "why": "use first-order information"
          }
        ],
        "answer": "The local first-order data is $(2,4)$."
      },
      {
        "problem": "Unconstrained optimization and critical points: use $f(x,y)=x^2-y^2$ at $(3,1)$.",
        "steps": [
          {
            "do": "Compute partials",
            "result": "$f_x=2x$, $f_y=-2y$",
            "why": "differentiate"
          },
          {
            "do": "Evaluate partials",
            "result": "$(6,-2)$",
            "why": "substitute $(3,1)$"
          },
          {
            "do": "Use move $(0.1,-0.1)$",
            "result": "$6(0.1)-2(-0.1)$",
            "why": "multiply slopes by displacements"
          },
          {
            "do": "Simplify",
            "result": "$0.8$",
            "why": "combine terms"
          }
        ],
        "answer": "The predicted first-order change is $0.8$."
      },
      {
        "problem": "Unconstrained optimization and critical points: compute second-order data for $q(x,y)=x^2+3xy+2y^2$.",
        "steps": [
          {
            "do": "Compute first partials",
            "result": "$q_x=2x+3y$, $q_y=3x+4y$",
            "why": "differentiate once"
          },
          {
            "do": "Compute $q_{xx}$",
            "result": "$2$",
            "why": "differentiate $q_x$ by $x$"
          },
          {
            "do": "Compute mixed partials",
            "result": "$q_{xy}=q_{yx}=3$",
            "why": "differentiate across variables"
          },
          {
            "do": "Compute $q_{yy}$",
            "result": "$4$",
            "why": "differentiate $q_y$ by $y$"
          }
        ],
        "answer": "The second-order entries are $2,3,3,4$."
      },
      {
        "problem": "Unconstrained optimization and critical points: evaluate a constrained or local step with gradient $(4,-6)$ and learning rate $0.05$.",
        "steps": [
          {
            "do": "Write the descent update",
            "result": "$-0.05(4,-6)$",
            "why": "move opposite the gradient"
          },
          {
            "do": "Multiply",
            "result": "$( -0.2,0.3)$",
            "why": "scale each component"
          },
          {
            "do": "Add to current point $(1,2)$",
            "result": "$(0.8,2.3)$",
            "why": "apply the update"
          },
          {
            "do": "Interpret",
            "result": "loss should decrease for a small enough step",
            "why": "descent follows negative gradient"
          }
        ],
        "answer": "The updated point is $(0.8,2.3)$."
      },
      {
        "problem": "Unconstrained optimization and critical points: compute an ML local prediction from value $10$, gradient $(-3,4)$, and move $(0.2,-0.1)$.",
        "steps": [
          {
            "do": "Dot gradient with move",
            "result": "$(-3)(0.2)+4(-0.1)$",
            "why": "linear change is gradient dot displacement"
          },
          {
            "do": "Simplify change",
            "result": "$-1.0$",
            "why": "combine contributions"
          },
          {
            "do": "Add base value",
            "result": "$10-1.0$",
            "why": "local approximation"
          },
          {
            "do": "State prediction",
            "result": "$9.0$",
            "why": "finish arithmetic"
          }
        ],
        "answer": "The local prediction is $9.0$."
      }
    ],
    "applications": [
      {
        "title": "Gradient descent",
        "background": "Modern training uses derivatives to choose parameter updates instead of trying random moves.",
        "numbers": "With gradient $(3,-4)$ and learning rate $0.1$, the update is $(-0.3,0.4)$."
      },
      {
        "title": "Backpropagation",
        "background": "Backprop is organized calculus on a computation graph, passing local sensitivities backward.",
        "numbers": "An upstream gradient $5$ through a local derivative $2.4$ becomes $12$."
      },
      {
        "title": "Gradient checking",
        "background": "Engineers compare analytic derivatives with finite differences to find implementation bugs.",
        "numbers": "If $f(2.001)-f(2)=0.004002$, the finite-difference slope is $4.002$."
      },
      {
        "title": "Feature scaling",
        "background": "Derivative magnitudes reveal whether one input dominates another numerically.",
        "numbers": "Slopes $80$ and $0.2$ mean a $0.01$ move in the first feature changes output $0.8$, four times a $1$ move in the second."
      },
      {
        "title": "Sensitivity analysis",
        "background": "Teams estimate metric changes from small controllable moves.",
        "numbers": "Slopes $(120,-30)$ and move $(0.5,1)$ predict $120(0.5)-30=30$ extra units."
      },
      {
        "title": "Optimization diagnostics",
        "background": "Large local factors can create unstable training dynamics.",
        "numbers": "A factor $20$ repeated through $4$ layers can magnify gradients by $20^4=160000$."
      }
    ],
    "applicationsClose": "The same pattern appears under many names: local change, curvature, constrained motion, and accumulated mass are all ways to turn geometry into numbers.",
    "takeaways": [
      "Critical points have zero gradient but still need classification.",
      "Work one derivative, matrix entry, equation, or bound at a time.",
      "Check every numerical result with signs and units."
    ]
  },
  "math-02-23": {
    "id": "math-02-23",
    "title": "Saddle points",
    "tagline": "A saddle point is critical but not a maximum or minimum.",
    "connections": {
      "buildsOn": [
        "Unconstrained optimization and critical points",
        "partial derivatives",
        "vectors"
      ],
      "leadsTo": [
        "Definiteness and the second-derivative test",
        "optimization and integration"
      ],
      "usedWith": [
        "gradients",
        "linear maps",
        "level sets",
        "quadratic forms"
      ]
    },
    "motivation": "<p>You already know how one-variable calculus studies a curve by zooming in, measuring slope, or adding small pieces. Saddle points brings that same habit into several variables.</p><p>The reward is practical: surfaces, vector maps, losses, and densities become computable with local slopes, curvature, constraints, or accumulated totals.</p>",
    "definition": "<p>A <b>saddle point</b> is a critical point where nearby directions disagree: some go up and some go down. The model example is $f(x,y)=x^2-y^2$ at $(0,0)$.</p><p><b>Assumptions that matter:</b> zero gradient does not classify a point; directional behavior or the Hessian is needed.</p>",
    "worked": {
      "problem": "Show $f=x^2-y^2$ has a saddle at $(0,0)$.",
      "skills": [
        "setup",
        "calculation",
        "interpretation"
      ],
      "strategy": "Translate the geometric idea into derivatives or integrals, then compute one quantity at a time.",
      "steps": [
        {
          "do": "Compute $f_x$",
          "result": "$2x$",
          "why": "differentiate"
        },
        {
          "do": "Compute $f_y$",
          "result": "$-2y$",
          "why": "differentiate"
        },
        {
          "do": "Evaluate gradient",
          "result": "$(0,0)$",
          "why": "critical point"
        },
        {
          "do": "Check $x$-axis",
          "result": "$f(t,0)=t^2>0$",
          "why": "nearby positive values"
        },
        {
          "do": "Check $y$-axis",
          "result": "$f(0,t)=-t^2<0$",
          "why": "nearby negative values"
        }
      ],
      "verify": "The result has the expected sign, size, and units for the local geometry.",
      "answer": "$(0,0)$ is a saddle point.",
      "connects": "Saddles explain why zero gradient can still be hard in ML."
    },
    "practice": [
      {
        "problem": "Saddle points: compute the basic object for $f(x,y)=x^2+y^2$ at $(1,2)$.",
        "steps": [
          {
            "do": "Compute $f_x$",
            "result": "$2x$",
            "why": "differentiate with respect to $x$"
          },
          {
            "do": "Compute $f_y$",
            "result": "$2y$",
            "why": "differentiate with respect to $y$"
          },
          {
            "do": "Evaluate at $(1,2)$",
            "result": "$(2,4)$",
            "why": "substitute the point"
          },
          {
            "do": "Interpret",
            "result": "local change is $2\\Delta x+4\\Delta y$",
            "why": "use first-order information"
          }
        ],
        "answer": "The local first-order data is $(2,4)$."
      },
      {
        "problem": "Saddle points: use $f(x,y)=x^2-y^2$ at $(3,1)$.",
        "steps": [
          {
            "do": "Compute partials",
            "result": "$f_x=2x$, $f_y=-2y$",
            "why": "differentiate"
          },
          {
            "do": "Evaluate partials",
            "result": "$(6,-2)$",
            "why": "substitute $(3,1)$"
          },
          {
            "do": "Use move $(0.1,-0.1)$",
            "result": "$6(0.1)-2(-0.1)$",
            "why": "multiply slopes by displacements"
          },
          {
            "do": "Simplify",
            "result": "$0.8$",
            "why": "combine terms"
          }
        ],
        "answer": "The predicted first-order change is $0.8$."
      },
      {
        "problem": "Saddle points: compute second-order data for $q(x,y)=x^2+3xy+2y^2$.",
        "steps": [
          {
            "do": "Compute first partials",
            "result": "$q_x=2x+3y$, $q_y=3x+4y$",
            "why": "differentiate once"
          },
          {
            "do": "Compute $q_{xx}$",
            "result": "$2$",
            "why": "differentiate $q_x$ by $x$"
          },
          {
            "do": "Compute mixed partials",
            "result": "$q_{xy}=q_{yx}=3$",
            "why": "differentiate across variables"
          },
          {
            "do": "Compute $q_{yy}$",
            "result": "$4$",
            "why": "differentiate $q_y$ by $y$"
          }
        ],
        "answer": "The second-order entries are $2,3,3,4$."
      },
      {
        "problem": "Saddle points: evaluate a constrained or local step with gradient $(4,-6)$ and learning rate $0.05$.",
        "steps": [
          {
            "do": "Write the descent update",
            "result": "$-0.05(4,-6)$",
            "why": "move opposite the gradient"
          },
          {
            "do": "Multiply",
            "result": "$( -0.2,0.3)$",
            "why": "scale each component"
          },
          {
            "do": "Add to current point $(1,2)$",
            "result": "$(0.8,2.3)$",
            "why": "apply the update"
          },
          {
            "do": "Interpret",
            "result": "loss should decrease for a small enough step",
            "why": "descent follows negative gradient"
          }
        ],
        "answer": "The updated point is $(0.8,2.3)$."
      },
      {
        "problem": "Saddle points: compute an ML local prediction from value $10$, gradient $(-3,4)$, and move $(0.2,-0.1)$.",
        "steps": [
          {
            "do": "Dot gradient with move",
            "result": "$(-3)(0.2)+4(-0.1)$",
            "why": "linear change is gradient dot displacement"
          },
          {
            "do": "Simplify change",
            "result": "$-1.0$",
            "why": "combine contributions"
          },
          {
            "do": "Add base value",
            "result": "$10-1.0$",
            "why": "local approximation"
          },
          {
            "do": "State prediction",
            "result": "$9.0$",
            "why": "finish arithmetic"
          }
        ],
        "answer": "The local prediction is $9.0$."
      }
    ],
    "applications": [
      {
        "title": "Gradient descent",
        "background": "Modern training uses derivatives to choose parameter updates instead of trying random moves.",
        "numbers": "With gradient $(3,-4)$ and learning rate $0.1$, the update is $(-0.3,0.4)$."
      },
      {
        "title": "Backpropagation",
        "background": "Backprop is organized calculus on a computation graph, passing local sensitivities backward.",
        "numbers": "An upstream gradient $5$ through a local derivative $2.4$ becomes $12$."
      },
      {
        "title": "Gradient checking",
        "background": "Engineers compare analytic derivatives with finite differences to find implementation bugs.",
        "numbers": "If $f(2.001)-f(2)=0.004002$, the finite-difference slope is $4.002$."
      },
      {
        "title": "Feature scaling",
        "background": "Derivative magnitudes reveal whether one input dominates another numerically.",
        "numbers": "Slopes $80$ and $0.2$ mean a $0.01$ move in the first feature changes output $0.8$, four times a $1$ move in the second."
      },
      {
        "title": "Sensitivity analysis",
        "background": "Teams estimate metric changes from small controllable moves.",
        "numbers": "Slopes $(120,-30)$ and move $(0.5,1)$ predict $120(0.5)-30=30$ extra units."
      },
      {
        "title": "Optimization diagnostics",
        "background": "Large local factors can create unstable training dynamics.",
        "numbers": "A factor $20$ repeated through $4$ layers can magnify gradients by $20^4=160000$."
      }
    ],
    "applicationsClose": "The same pattern appears under many names: local change, curvature, constrained motion, and accumulated mass are all ways to turn geometry into numbers.",
    "takeaways": [
      "Saddles have up and down directions in every small neighborhood.",
      "Work one derivative, matrix entry, equation, or bound at a time.",
      "Check every numerical result with signs and units."
    ]
  },
  "math-02-24": {
    "id": "math-02-24",
    "title": "Definiteness and the second-derivative test",
    "tagline": "Definiteness classifies curvature at a critical point.",
    "connections": {
      "buildsOn": [
        "Saddle points",
        "partial derivatives",
        "vectors"
      ],
      "leadsTo": [
        "Lagrange multipliers",
        "optimization and integration"
      ],
      "usedWith": [
        "gradients",
        "linear maps",
        "level sets",
        "quadratic forms"
      ]
    },
    "motivation": "<p>You already know how one-variable calculus studies a curve by zooming in, measuring slope, or adding small pieces. Definiteness and the second-derivative test brings that same habit into several variables.</p><p>The reward is practical: surfaces, vector maps, losses, and densities become computable with local slopes, curvature, constraints, or accumulated totals.</p>",
    "definition": "<p>For a symmetric Hessian $H$, positive definite means $v^T H v>0$ for all nonzero $v$, negative definite means $v^T H v<0$, and indefinite means both signs occur. For $2\\times2$ Hessian $\\begin{bmatrix}A&B\\B&C\\end{bmatrix}$, $D=AC-B^2$ classifies many cases.</p><p><b>Assumptions that matter:</b> apply the test at a critical point with continuous second partials; $D=0$ is inconclusive.</p>",
    "worked": {
      "problem": "Classify $f=x^2+2xy+3y^2$ at $(0,0)$.",
      "skills": [
        "setup",
        "calculation",
        "interpretation"
      ],
      "strategy": "Translate the geometric idea into derivatives or integrals, then compute one quantity at a time.",
      "steps": [
        {
          "do": "Check critical point",
          "result": "$\\nabla f(0,0)=0$",
          "why": "first derivatives vanish"
        },
        {
          "do": "Compute Hessian",
          "result": "$H=\\begin{bmatrix}2&2\\2&6\\end{bmatrix}$",
          "why": "second partials"
        },
        {
          "do": "Compute determinant test",
          "result": "$D=2\\cdot6-2^2=8$",
          "why": "use $AC-B^2$"
        },
        {
          "do": "Check $A$",
          "result": "$A=2>0$",
          "why": "top-left entry positive"
        },
        {
          "do": "Classify",
          "result": "local minimum",
          "why": "positive definite Hessian"
        }
      ],
      "verify": "The result has the expected sign, size, and units for the local geometry.",
      "answer": "Local minimum at $(0,0)$.",
      "connects": "Definiteness turns curvature into an optimization decision."
    },
    "practice": [
      {
        "problem": "Definiteness and the second-derivative test: compute the basic object for $f(x,y)=x^2+y^2$ at $(1,2)$.",
        "steps": [
          {
            "do": "Compute $f_x$",
            "result": "$2x$",
            "why": "differentiate with respect to $x$"
          },
          {
            "do": "Compute $f_y$",
            "result": "$2y$",
            "why": "differentiate with respect to $y$"
          },
          {
            "do": "Evaluate at $(1,2)$",
            "result": "$(2,4)$",
            "why": "substitute the point"
          },
          {
            "do": "Interpret",
            "result": "local change is $2\\Delta x+4\\Delta y$",
            "why": "use first-order information"
          }
        ],
        "answer": "The local first-order data is $(2,4)$."
      },
      {
        "problem": "Definiteness and the second-derivative test: use $f(x,y)=x^2-y^2$ at $(3,1)$.",
        "steps": [
          {
            "do": "Compute partials",
            "result": "$f_x=2x$, $f_y=-2y$",
            "why": "differentiate"
          },
          {
            "do": "Evaluate partials",
            "result": "$(6,-2)$",
            "why": "substitute $(3,1)$"
          },
          {
            "do": "Use move $(0.1,-0.1)$",
            "result": "$6(0.1)-2(-0.1)$",
            "why": "multiply slopes by displacements"
          },
          {
            "do": "Simplify",
            "result": "$0.8$",
            "why": "combine terms"
          }
        ],
        "answer": "The predicted first-order change is $0.8$."
      },
      {
        "problem": "Definiteness and the second-derivative test: compute second-order data for $q(x,y)=x^2+3xy+2y^2$.",
        "steps": [
          {
            "do": "Compute first partials",
            "result": "$q_x=2x+3y$, $q_y=3x+4y$",
            "why": "differentiate once"
          },
          {
            "do": "Compute $q_{xx}$",
            "result": "$2$",
            "why": "differentiate $q_x$ by $x$"
          },
          {
            "do": "Compute mixed partials",
            "result": "$q_{xy}=q_{yx}=3$",
            "why": "differentiate across variables"
          },
          {
            "do": "Compute $q_{yy}$",
            "result": "$4$",
            "why": "differentiate $q_y$ by $y$"
          }
        ],
        "answer": "The second-order entries are $2,3,3,4$."
      },
      {
        "problem": "Definiteness and the second-derivative test: evaluate a constrained or local step with gradient $(4,-6)$ and learning rate $0.05$.",
        "steps": [
          {
            "do": "Write the descent update",
            "result": "$-0.05(4,-6)$",
            "why": "move opposite the gradient"
          },
          {
            "do": "Multiply",
            "result": "$( -0.2,0.3)$",
            "why": "scale each component"
          },
          {
            "do": "Add to current point $(1,2)$",
            "result": "$(0.8,2.3)$",
            "why": "apply the update"
          },
          {
            "do": "Interpret",
            "result": "loss should decrease for a small enough step",
            "why": "descent follows negative gradient"
          }
        ],
        "answer": "The updated point is $(0.8,2.3)$."
      },
      {
        "problem": "Definiteness and the second-derivative test: compute an ML local prediction from value $10$, gradient $(-3,4)$, and move $(0.2,-0.1)$.",
        "steps": [
          {
            "do": "Dot gradient with move",
            "result": "$(-3)(0.2)+4(-0.1)$",
            "why": "linear change is gradient dot displacement"
          },
          {
            "do": "Simplify change",
            "result": "$-1.0$",
            "why": "combine contributions"
          },
          {
            "do": "Add base value",
            "result": "$10-1.0$",
            "why": "local approximation"
          },
          {
            "do": "State prediction",
            "result": "$9.0$",
            "why": "finish arithmetic"
          }
        ],
        "answer": "The local prediction is $9.0$."
      }
    ],
    "applications": [
      {
        "title": "Gradient descent",
        "background": "Modern training uses derivatives to choose parameter updates instead of trying random moves.",
        "numbers": "With gradient $(3,-4)$ and learning rate $0.1$, the update is $(-0.3,0.4)$."
      },
      {
        "title": "Backpropagation",
        "background": "Backprop is organized calculus on a computation graph, passing local sensitivities backward.",
        "numbers": "An upstream gradient $5$ through a local derivative $2.4$ becomes $12$."
      },
      {
        "title": "Gradient checking",
        "background": "Engineers compare analytic derivatives with finite differences to find implementation bugs.",
        "numbers": "If $f(2.001)-f(2)=0.004002$, the finite-difference slope is $4.002$."
      },
      {
        "title": "Feature scaling",
        "background": "Derivative magnitudes reveal whether one input dominates another numerically.",
        "numbers": "Slopes $80$ and $0.2$ mean a $0.01$ move in the first feature changes output $0.8$, four times a $1$ move in the second."
      },
      {
        "title": "Sensitivity analysis",
        "background": "Teams estimate metric changes from small controllable moves.",
        "numbers": "Slopes $(120,-30)$ and move $(0.5,1)$ predict $120(0.5)-30=30$ extra units."
      },
      {
        "title": "Optimization diagnostics",
        "background": "Large local factors can create unstable training dynamics.",
        "numbers": "A factor $20$ repeated through $4$ layers can magnify gradients by $20^4=160000$."
      }
    ],
    "applicationsClose": "The same pattern appears under many names: local change, curvature, constrained motion, and accumulated mass are all ways to turn geometry into numbers.",
    "takeaways": [
      "Positive definite gives min, negative definite gives max, indefinite gives saddle.",
      "Work one derivative, matrix entry, equation, or bound at a time.",
      "Check every numerical result with signs and units."
    ]
  },
  "math-02-25": {
    "id": "math-02-25",
    "title": "Lagrange multipliers",
    "tagline": "Lagrange multipliers optimize when a constraint blocks free movement.",
    "connections": {
      "buildsOn": [
        "Definiteness and the second-derivative test",
        "partial derivatives",
        "vectors"
      ],
      "leadsTo": [
        "Double integrals",
        "optimization and integration"
      ],
      "usedWith": [
        "gradients",
        "linear maps",
        "level sets",
        "quadratic forms"
      ]
    },
    "motivation": "<p>You already know how one-variable calculus studies a curve by zooming in, measuring slope, or adding small pieces. Lagrange multipliers brings that same habit into several variables.</p><p>The reward is practical: surfaces, vector maps, losses, and densities become computable with local slopes, curvature, constraints, or accumulated totals.</p>",
    "definition": "<p>To optimize $f(x,y)$ subject to $g(x,y)=c$, solve $$\\nabla f=\\lambda\\nabla g,\\qquad g(x,y)=c.$$ At the constrained optimum, objective and constraint gradients are parallel.</p><p><b>Assumptions that matter:</b> require $\\nabla g\\ne0$ near the constraint and compare candidates when needed.</p>",
    "worked": {
      "problem": "Maximize $f=xy$ subject to $x+y=10$.",
      "skills": [
        "setup",
        "calculation",
        "interpretation"
      ],
      "strategy": "Translate the geometric idea into derivatives or integrals, then compute one quantity at a time.",
      "steps": [
        {
          "do": "Compute objective gradient",
          "result": "$\\nabla f=(y,x)$",
          "why": "partial derivatives"
        },
        {
          "do": "Compute constraint gradient",
          "result": "$\\nabla g=(1,1)$",
          "why": "for $g=x+y$"
        },
        {
          "do": "Set parallel equations",
          "result": "$y=\\lambda$, $x=\\lambda$",
          "why": "use $\\nabla f=\\lambda\\nabla g$"
        },
        {
          "do": "Use constraint",
          "result": "$2\\lambda=10$",
          "why": "substitute $x=y=\\lambda$"
        },
        {
          "do": "Solve",
          "result": "$x=y=5$",
          "why": "divide by $2$"
        }
      ],
      "verify": "The result has the expected sign, size, and units for the local geometry.",
      "answer": "Maximum product is $25$ at $(5,5)$.",
      "connects": "Constrained optima occur where level curves are tangent."
    },
    "practice": [
      {
        "problem": "Lagrange multipliers: compute the basic object for $f(x,y)=x^2+y^2$ at $(1,2)$.",
        "steps": [
          {
            "do": "Compute $f_x$",
            "result": "$2x$",
            "why": "differentiate with respect to $x$"
          },
          {
            "do": "Compute $f_y$",
            "result": "$2y$",
            "why": "differentiate with respect to $y$"
          },
          {
            "do": "Evaluate at $(1,2)$",
            "result": "$(2,4)$",
            "why": "substitute the point"
          },
          {
            "do": "Interpret",
            "result": "local change is $2\\Delta x+4\\Delta y$",
            "why": "use first-order information"
          }
        ],
        "answer": "The local first-order data is $(2,4)$."
      },
      {
        "problem": "Lagrange multipliers: use $f(x,y)=x^2-y^2$ at $(3,1)$.",
        "steps": [
          {
            "do": "Compute partials",
            "result": "$f_x=2x$, $f_y=-2y$",
            "why": "differentiate"
          },
          {
            "do": "Evaluate partials",
            "result": "$(6,-2)$",
            "why": "substitute $(3,1)$"
          },
          {
            "do": "Use move $(0.1,-0.1)$",
            "result": "$6(0.1)-2(-0.1)$",
            "why": "multiply slopes by displacements"
          },
          {
            "do": "Simplify",
            "result": "$0.8$",
            "why": "combine terms"
          }
        ],
        "answer": "The predicted first-order change is $0.8$."
      },
      {
        "problem": "Lagrange multipliers: compute second-order data for $q(x,y)=x^2+3xy+2y^2$.",
        "steps": [
          {
            "do": "Compute first partials",
            "result": "$q_x=2x+3y$, $q_y=3x+4y$",
            "why": "differentiate once"
          },
          {
            "do": "Compute $q_{xx}$",
            "result": "$2$",
            "why": "differentiate $q_x$ by $x$"
          },
          {
            "do": "Compute mixed partials",
            "result": "$q_{xy}=q_{yx}=3$",
            "why": "differentiate across variables"
          },
          {
            "do": "Compute $q_{yy}$",
            "result": "$4$",
            "why": "differentiate $q_y$ by $y$"
          }
        ],
        "answer": "The second-order entries are $2,3,3,4$."
      },
      {
        "problem": "Lagrange multipliers: evaluate a constrained or local step with gradient $(4,-6)$ and learning rate $0.05$.",
        "steps": [
          {
            "do": "Write the descent update",
            "result": "$-0.05(4,-6)$",
            "why": "move opposite the gradient"
          },
          {
            "do": "Multiply",
            "result": "$( -0.2,0.3)$",
            "why": "scale each component"
          },
          {
            "do": "Add to current point $(1,2)$",
            "result": "$(0.8,2.3)$",
            "why": "apply the update"
          },
          {
            "do": "Interpret",
            "result": "loss should decrease for a small enough step",
            "why": "descent follows negative gradient"
          }
        ],
        "answer": "The updated point is $(0.8,2.3)$."
      },
      {
        "problem": "Lagrange multipliers: compute an ML local prediction from value $10$, gradient $(-3,4)$, and move $(0.2,-0.1)$.",
        "steps": [
          {
            "do": "Dot gradient with move",
            "result": "$(-3)(0.2)+4(-0.1)$",
            "why": "linear change is gradient dot displacement"
          },
          {
            "do": "Simplify change",
            "result": "$-1.0$",
            "why": "combine contributions"
          },
          {
            "do": "Add base value",
            "result": "$10-1.0$",
            "why": "local approximation"
          },
          {
            "do": "State prediction",
            "result": "$9.0$",
            "why": "finish arithmetic"
          }
        ],
        "answer": "The local prediction is $9.0$."
      }
    ],
    "applications": [
      {
        "title": "Gradient descent",
        "background": "Modern training uses derivatives to choose parameter updates instead of trying random moves.",
        "numbers": "With gradient $(3,-4)$ and learning rate $0.1$, the update is $(-0.3,0.4)$."
      },
      {
        "title": "Backpropagation",
        "background": "Backprop is organized calculus on a computation graph, passing local sensitivities backward.",
        "numbers": "An upstream gradient $5$ through a local derivative $2.4$ becomes $12$."
      },
      {
        "title": "Gradient checking",
        "background": "Engineers compare analytic derivatives with finite differences to find implementation bugs.",
        "numbers": "If $f(2.001)-f(2)=0.004002$, the finite-difference slope is $4.002$."
      },
      {
        "title": "Feature scaling",
        "background": "Derivative magnitudes reveal whether one input dominates another numerically.",
        "numbers": "Slopes $80$ and $0.2$ mean a $0.01$ move in the first feature changes output $0.8$, four times a $1$ move in the second."
      },
      {
        "title": "Sensitivity analysis",
        "background": "Teams estimate metric changes from small controllable moves.",
        "numbers": "Slopes $(120,-30)$ and move $(0.5,1)$ predict $120(0.5)-30=30$ extra units."
      },
      {
        "title": "Optimization diagnostics",
        "background": "Large local factors can create unstable training dynamics.",
        "numbers": "A factor $20$ repeated through $4$ layers can magnify gradients by $20^4=160000$."
      }
    ],
    "applicationsClose": "The same pattern appears under many names: local change, curvature, constrained motion, and accumulated mass are all ways to turn geometry into numbers.",
    "takeaways": [
      "Lagrange multipliers replace free gradient zero with parallel gradients.",
      "Work one derivative, matrix entry, equation, or bound at a time.",
      "Check every numerical result with signs and units."
    ]
  },
  "math-02-26": {
    "id": "math-02-26",
    "title": "Double integrals",
    "tagline": "A double integral sums a quantity over area.",
    "connections": {
      "buildsOn": [
        "Lagrange multipliers",
        "partial derivatives",
        "vectors"
      ],
      "leadsTo": [
        "Triple integrals",
        "optimization and integration"
      ],
      "usedWith": [
        "gradients",
        "linear maps",
        "level sets",
        "quadratic forms"
      ]
    },
    "motivation": "<p>You already know how one-variable calculus studies a curve by zooming in, measuring slope, or adding small pieces. Double integrals brings that same habit into several variables.</p><p>The reward is practical: surfaces, vector maps, losses, and densities become computable with local slopes, curvature, constraints, or accumulated totals.</p>",
    "definition": "<p>The double integral $$\\iint_R f(x,y)\\,dA$$ is the limit of sums over tiny area tiles. On rectangles, it can be computed as an iterated integral.</p><p><b>Assumptions that matter:</b> bounds must describe the region, and $dA$ represents an area element.</p>",
    "worked": {
      "problem": "Compute $\\int_0^2\\int_0^1(x+y)\\,dy\\,dx$",
      "skills": [
        "setup",
        "calculation",
        "interpretation"
      ],
      "strategy": "Translate the geometric idea into derivatives or integrals, then compute one quantity at a time.",
      "steps": [
        {
          "do": "Integrate in $y$",
          "result": "$xy+y^2/2\\big|_0^1$",
          "why": "inner integral first"
        },
        {
          "do": "Simplify inner result",
          "result": "$x+1/2$",
          "why": "evaluate bounds"
        },
        {
          "do": "Set outer integral",
          "result": "$\\int_0^2(x+1/2)\\,dx$",
          "why": "carry the result forward"
        },
        {
          "do": "Antidifferentiate",
          "result": "$x^2/2+x/2\\big|_0^2$",
          "why": "integrate in $x$"
        },
        {
          "do": "Evaluate",
          "result": "$2+1=3$",
          "why": "finish"
        }
      ],
      "verify": "The result has the expected sign, size, and units for the local geometry.",
      "answer": "The double integral equals $3$.",
      "connects": "A double integral is accumulation over a region."
    },
    "practice": [
      {
        "problem": "Double integrals: compute the basic object for $f(x,y)=x^2+y^2$ at $(1,2)$.",
        "steps": [
          {
            "do": "Compute $f_x$",
            "result": "$2x$",
            "why": "differentiate with respect to $x$"
          },
          {
            "do": "Compute $f_y$",
            "result": "$2y$",
            "why": "differentiate with respect to $y$"
          },
          {
            "do": "Evaluate at $(1,2)$",
            "result": "$(2,4)$",
            "why": "substitute the point"
          },
          {
            "do": "Interpret",
            "result": "local change is $2\\Delta x+4\\Delta y$",
            "why": "use first-order information"
          }
        ],
        "answer": "The local first-order data is $(2,4)$."
      },
      {
        "problem": "Double integrals: use $f(x,y)=x^2-y^2$ at $(3,1)$.",
        "steps": [
          {
            "do": "Compute partials",
            "result": "$f_x=2x$, $f_y=-2y$",
            "why": "differentiate"
          },
          {
            "do": "Evaluate partials",
            "result": "$(6,-2)$",
            "why": "substitute $(3,1)$"
          },
          {
            "do": "Use move $(0.1,-0.1)$",
            "result": "$6(0.1)-2(-0.1)$",
            "why": "multiply slopes by displacements"
          },
          {
            "do": "Simplify",
            "result": "$0.8$",
            "why": "combine terms"
          }
        ],
        "answer": "The predicted first-order change is $0.8$."
      },
      {
        "problem": "Double integrals: compute second-order data for $q(x,y)=x^2+3xy+2y^2$.",
        "steps": [
          {
            "do": "Compute first partials",
            "result": "$q_x=2x+3y$, $q_y=3x+4y$",
            "why": "differentiate once"
          },
          {
            "do": "Compute $q_{xx}$",
            "result": "$2$",
            "why": "differentiate $q_x$ by $x$"
          },
          {
            "do": "Compute mixed partials",
            "result": "$q_{xy}=q_{yx}=3$",
            "why": "differentiate across variables"
          },
          {
            "do": "Compute $q_{yy}$",
            "result": "$4$",
            "why": "differentiate $q_y$ by $y$"
          }
        ],
        "answer": "The second-order entries are $2,3,3,4$."
      },
      {
        "problem": "Double integrals: evaluate a constrained or local step with gradient $(4,-6)$ and learning rate $0.05$.",
        "steps": [
          {
            "do": "Write the descent update",
            "result": "$-0.05(4,-6)$",
            "why": "move opposite the gradient"
          },
          {
            "do": "Multiply",
            "result": "$( -0.2,0.3)$",
            "why": "scale each component"
          },
          {
            "do": "Add to current point $(1,2)$",
            "result": "$(0.8,2.3)$",
            "why": "apply the update"
          },
          {
            "do": "Interpret",
            "result": "loss should decrease for a small enough step",
            "why": "descent follows negative gradient"
          }
        ],
        "answer": "The updated point is $(0.8,2.3)$."
      },
      {
        "problem": "Double integrals: compute an ML local prediction from value $10$, gradient $(-3,4)$, and move $(0.2,-0.1)$.",
        "steps": [
          {
            "do": "Dot gradient with move",
            "result": "$(-3)(0.2)+4(-0.1)$",
            "why": "linear change is gradient dot displacement"
          },
          {
            "do": "Simplify change",
            "result": "$-1.0$",
            "why": "combine contributions"
          },
          {
            "do": "Add base value",
            "result": "$10-1.0$",
            "why": "local approximation"
          },
          {
            "do": "State prediction",
            "result": "$9.0$",
            "why": "finish arithmetic"
          }
        ],
        "answer": "The local prediction is $9.0$."
      }
    ],
    "applications": [
      {
        "title": "Probability over regions",
        "background": "Continuous probability models integrate density over a region to get probability.",
        "numbers": "Uniform density $1/6$ on a $2\\times3$ rectangle integrates to $(1/6)6=1$."
      },
      {
        "title": "Computer vision regions",
        "background": "Vision systems sum or average intensity over image patches and volumes.",
        "numbers": "A patch with total integral $3000$ over area $20$ has average intensity $150$."
      },
      {
        "title": "Mass from density",
        "background": "Physics computes mass by accumulating density over area or volume.",
        "numbers": "Density $4$ kg/m$^3$ over volume $6$ m$^3$ gives mass $24$ kg."
      },
      {
        "title": "Expected values",
        "background": "Statistics integrates value times density to compute averages.",
        "numbers": "For uniform $x$ on $[0,2]$, $\\int_0^2 x(1/2)\\,dx=1$."
      },
      {
        "title": "Rendering",
        "background": "Graphics integrates light over pixels, surfaces, or volumes.",
        "numbers": "Constant radiance $0.8$ over area $0.25$ contributes $0.2$."
      },
      {
        "title": "Density transformations",
        "background": "Change of variables preserves total probability after stretching coordinates.",
        "numbers": "If a map doubles area, density is multiplied by $1/2$ so mass stays $1$."
      }
    ],
    "applicationsClose": "The same pattern appears under many names: local change, curvature, constrained motion, and accumulated mass are all ways to turn geometry into numbers.",
    "takeaways": [
      "Double integrals add density over area.",
      "Work one derivative, matrix entry, equation, or bound at a time.",
      "Check every numerical result with signs and units."
    ]
  },
  "math-02-27": {
    "id": "math-02-27",
    "title": "Triple integrals",
    "tagline": "A triple integral sums a quantity over volume.",
    "connections": {
      "buildsOn": [
        "Double integrals",
        "partial derivatives",
        "vectors"
      ],
      "leadsTo": [
        "Change of variables",
        "optimization and integration"
      ],
      "usedWith": [
        "gradients",
        "linear maps",
        "level sets",
        "quadratic forms"
      ]
    },
    "motivation": "<p>You already know how one-variable calculus studies a curve by zooming in, measuring slope, or adding small pieces. Triple integrals brings that same habit into several variables.</p><p>The reward is practical: surfaces, vector maps, losses, and densities become computable with local slopes, curvature, constraints, or accumulated totals.</p>",
    "definition": "<p>The triple integral $$\\iiint_E f(x,y,z)\\,dV$$ sums values over tiny volume boxes. On a rectangular box, compute it with three nested one-variable integrals.</p><p><b>Assumptions that matter:</b> bounds must describe the solid exactly, and $dV$ is a volume element.</p>",
    "worked": {
      "problem": "Compute $\\int_0^1\\int_0^2\\int_0^3(x+y+z)\\,dz\\,dy\\,dx$",
      "skills": [
        "setup",
        "calculation",
        "interpretation"
      ],
      "strategy": "Translate the geometric idea into derivatives or integrals, then compute one quantity at a time.",
      "steps": [
        {
          "do": "Integrate in $z$",
          "result": "$3x+3y+9/2$",
          "why": "inner bounds $0$ to $3$"
        },
        {
          "do": "Integrate in $y$",
          "result": "$6x+6+9=6x+15$",
          "why": "bounds $0$ to $2$"
        },
        {
          "do": "Set final integral",
          "result": "$\\int_0^1(6x+15)\\,dx$",
          "why": "remaining variable"
        },
        {
          "do": "Antidifferentiate",
          "result": "$3x^2+15x\\big|_0^1$",
          "why": "integrate in $x$"
        },
        {
          "do": "Evaluate",
          "result": "$18$",
          "why": "finish"
        }
      ],
      "verify": "The result has the expected sign, size, and units for the local geometry.",
      "answer": "The triple integral equals $18$.",
      "connects": "Triple integrals accumulate through space."
    },
    "practice": [
      {
        "problem": "Triple integrals: compute the basic object for $f(x,y)=x^2+y^2$ at $(1,2)$.",
        "steps": [
          {
            "do": "Compute $f_x$",
            "result": "$2x$",
            "why": "differentiate with respect to $x$"
          },
          {
            "do": "Compute $f_y$",
            "result": "$2y$",
            "why": "differentiate with respect to $y$"
          },
          {
            "do": "Evaluate at $(1,2)$",
            "result": "$(2,4)$",
            "why": "substitute the point"
          },
          {
            "do": "Interpret",
            "result": "local change is $2\\Delta x+4\\Delta y$",
            "why": "use first-order information"
          }
        ],
        "answer": "The local first-order data is $(2,4)$."
      },
      {
        "problem": "Triple integrals: use $f(x,y)=x^2-y^2$ at $(3,1)$.",
        "steps": [
          {
            "do": "Compute partials",
            "result": "$f_x=2x$, $f_y=-2y$",
            "why": "differentiate"
          },
          {
            "do": "Evaluate partials",
            "result": "$(6,-2)$",
            "why": "substitute $(3,1)$"
          },
          {
            "do": "Use move $(0.1,-0.1)$",
            "result": "$6(0.1)-2(-0.1)$",
            "why": "multiply slopes by displacements"
          },
          {
            "do": "Simplify",
            "result": "$0.8$",
            "why": "combine terms"
          }
        ],
        "answer": "The predicted first-order change is $0.8$."
      },
      {
        "problem": "Triple integrals: compute second-order data for $q(x,y)=x^2+3xy+2y^2$.",
        "steps": [
          {
            "do": "Compute first partials",
            "result": "$q_x=2x+3y$, $q_y=3x+4y$",
            "why": "differentiate once"
          },
          {
            "do": "Compute $q_{xx}$",
            "result": "$2$",
            "why": "differentiate $q_x$ by $x$"
          },
          {
            "do": "Compute mixed partials",
            "result": "$q_{xy}=q_{yx}=3$",
            "why": "differentiate across variables"
          },
          {
            "do": "Compute $q_{yy}$",
            "result": "$4$",
            "why": "differentiate $q_y$ by $y$"
          }
        ],
        "answer": "The second-order entries are $2,3,3,4$."
      },
      {
        "problem": "Triple integrals: evaluate a constrained or local step with gradient $(4,-6)$ and learning rate $0.05$.",
        "steps": [
          {
            "do": "Write the descent update",
            "result": "$-0.05(4,-6)$",
            "why": "move opposite the gradient"
          },
          {
            "do": "Multiply",
            "result": "$( -0.2,0.3)$",
            "why": "scale each component"
          },
          {
            "do": "Add to current point $(1,2)$",
            "result": "$(0.8,2.3)$",
            "why": "apply the update"
          },
          {
            "do": "Interpret",
            "result": "loss should decrease for a small enough step",
            "why": "descent follows negative gradient"
          }
        ],
        "answer": "The updated point is $(0.8,2.3)$."
      },
      {
        "problem": "Triple integrals: compute an ML local prediction from value $10$, gradient $(-3,4)$, and move $(0.2,-0.1)$.",
        "steps": [
          {
            "do": "Dot gradient with move",
            "result": "$(-3)(0.2)+4(-0.1)$",
            "why": "linear change is gradient dot displacement"
          },
          {
            "do": "Simplify change",
            "result": "$-1.0$",
            "why": "combine contributions"
          },
          {
            "do": "Add base value",
            "result": "$10-1.0$",
            "why": "local approximation"
          },
          {
            "do": "State prediction",
            "result": "$9.0$",
            "why": "finish arithmetic"
          }
        ],
        "answer": "The local prediction is $9.0$."
      }
    ],
    "applications": [
      {
        "title": "Probability over regions",
        "background": "Continuous probability models integrate density over a region to get probability.",
        "numbers": "Uniform density $1/6$ on a $2\\times3$ rectangle integrates to $(1/6)6=1$."
      },
      {
        "title": "Computer vision regions",
        "background": "Vision systems sum or average intensity over image patches and volumes.",
        "numbers": "A patch with total integral $3000$ over area $20$ has average intensity $150$."
      },
      {
        "title": "Mass from density",
        "background": "Physics computes mass by accumulating density over area or volume.",
        "numbers": "Density $4$ kg/m$^3$ over volume $6$ m$^3$ gives mass $24$ kg."
      },
      {
        "title": "Expected values",
        "background": "Statistics integrates value times density to compute averages.",
        "numbers": "For uniform $x$ on $[0,2]$, $\\int_0^2 x(1/2)\\,dx=1$."
      },
      {
        "title": "Rendering",
        "background": "Graphics integrates light over pixels, surfaces, or volumes.",
        "numbers": "Constant radiance $0.8$ over area $0.25$ contributes $0.2$."
      },
      {
        "title": "Density transformations",
        "background": "Change of variables preserves total probability after stretching coordinates.",
        "numbers": "If a map doubles area, density is multiplied by $1/2$ so mass stays $1$."
      }
    ],
    "applicationsClose": "The same pattern appears under many names: local change, curvature, constrained motion, and accumulated mass are all ways to turn geometry into numbers.",
    "takeaways": [
      "Triple integrals add density over volume.",
      "Work one derivative, matrix entry, equation, or bound at a time.",
      "Check every numerical result with signs and units."
    ]
  },
  "math-02-28": {
    "id": "math-02-28",
    "title": "Change of variables",
    "tagline": "Change of variables rewrites an integral in friendlier coordinates and rescales area.",
    "connections": {
      "buildsOn": [
        "Triple integrals",
        "partial derivatives",
        "vectors"
      ],
      "leadsTo": [
        "The Jacobian determinant",
        "optimization and integration"
      ],
      "usedWith": [
        "gradients",
        "linear maps",
        "level sets",
        "quadratic forms"
      ]
    },
    "motivation": "<p>You already know how one-variable calculus studies a curve by zooming in, measuring slope, or adding small pieces. Change of variables brings that same habit into several variables.</p><p>The reward is practical: surfaces, vector maps, losses, and densities become computable with local slopes, curvature, constraints, or accumulated totals.</p>",
    "definition": "<p>For $(x,y)=T(u,v)$, $$\\iint_R f(x,y)\\,dA=\\iint_S f(T(u,v))\\left|\\det J_T(u,v)\\right|\\,du\\,dv.$$ The determinant is the local area scale factor.</p><p><b>Assumptions that matter:</b> the map should be differentiable and one-to-one except possibly on boundaries; the absolute determinant is required.</p>",
    "worked": {
      "problem": "Use polar coordinates to compute the area of a disk of radius $3$.",
      "skills": [
        "setup",
        "calculation",
        "interpretation"
      ],
      "strategy": "Translate the geometric idea into derivatives or integrals, then compute one quantity at a time.",
      "steps": [
        {
          "do": "Write the map",
          "result": "$x=r\\cos\\theta$, $y=r\\sin\\theta$",
          "why": "polar coordinates"
        },
        {
          "do": "Use area scale",
          "result": "$dA=r\\,dr\\,d\\theta$",
          "why": "Jacobian determinant is $r$"
        },
        {
          "do": "Write bounds",
          "result": "$0\\le r\\le3$, $0\\le\\theta\\le2\\pi$",
          "why": "describe the disk"
        },
        {
          "do": "Set integral",
          "result": "$\\int_0^{2\\pi}\\int_0^3 r\\,dr\\,d\\theta$",
          "why": "integrate density $1$"
        },
        {
          "do": "Evaluate",
          "result": "$2\\pi\\cdot9/2=9\\pi$",
          "why": "finish"
        }
      ],
      "verify": "The result has the expected sign, size, and units for the local geometry.",
      "answer": "The area is $9\\pi$.",
      "connects": "The Jacobian factor accounts for coordinate stretching."
    },
    "practice": [
      {
        "problem": "Change of variables: compute the basic object for $f(x,y)=x^2+y^2$ at $(1,2)$.",
        "steps": [
          {
            "do": "Compute $f_x$",
            "result": "$2x$",
            "why": "differentiate with respect to $x$"
          },
          {
            "do": "Compute $f_y$",
            "result": "$2y$",
            "why": "differentiate with respect to $y$"
          },
          {
            "do": "Evaluate at $(1,2)$",
            "result": "$(2,4)$",
            "why": "substitute the point"
          },
          {
            "do": "Interpret",
            "result": "local change is $2\\Delta x+4\\Delta y$",
            "why": "use first-order information"
          }
        ],
        "answer": "The local first-order data is $(2,4)$."
      },
      {
        "problem": "Change of variables: use $f(x,y)=x^2-y^2$ at $(3,1)$.",
        "steps": [
          {
            "do": "Compute partials",
            "result": "$f_x=2x$, $f_y=-2y$",
            "why": "differentiate"
          },
          {
            "do": "Evaluate partials",
            "result": "$(6,-2)$",
            "why": "substitute $(3,1)$"
          },
          {
            "do": "Use move $(0.1,-0.1)$",
            "result": "$6(0.1)-2(-0.1)$",
            "why": "multiply slopes by displacements"
          },
          {
            "do": "Simplify",
            "result": "$0.8$",
            "why": "combine terms"
          }
        ],
        "answer": "The predicted first-order change is $0.8$."
      },
      {
        "problem": "Change of variables: compute second-order data for $q(x,y)=x^2+3xy+2y^2$.",
        "steps": [
          {
            "do": "Compute first partials",
            "result": "$q_x=2x+3y$, $q_y=3x+4y$",
            "why": "differentiate once"
          },
          {
            "do": "Compute $q_{xx}$",
            "result": "$2$",
            "why": "differentiate $q_x$ by $x$"
          },
          {
            "do": "Compute mixed partials",
            "result": "$q_{xy}=q_{yx}=3$",
            "why": "differentiate across variables"
          },
          {
            "do": "Compute $q_{yy}$",
            "result": "$4$",
            "why": "differentiate $q_y$ by $y$"
          }
        ],
        "answer": "The second-order entries are $2,3,3,4$."
      },
      {
        "problem": "Change of variables: evaluate a constrained or local step with gradient $(4,-6)$ and learning rate $0.05$.",
        "steps": [
          {
            "do": "Write the descent update",
            "result": "$-0.05(4,-6)$",
            "why": "move opposite the gradient"
          },
          {
            "do": "Multiply",
            "result": "$( -0.2,0.3)$",
            "why": "scale each component"
          },
          {
            "do": "Add to current point $(1,2)$",
            "result": "$(0.8,2.3)$",
            "why": "apply the update"
          },
          {
            "do": "Interpret",
            "result": "loss should decrease for a small enough step",
            "why": "descent follows negative gradient"
          }
        ],
        "answer": "The updated point is $(0.8,2.3)$."
      },
      {
        "problem": "Change of variables: compute an ML local prediction from value $10$, gradient $(-3,4)$, and move $(0.2,-0.1)$.",
        "steps": [
          {
            "do": "Dot gradient with move",
            "result": "$(-3)(0.2)+4(-0.1)$",
            "why": "linear change is gradient dot displacement"
          },
          {
            "do": "Simplify change",
            "result": "$-1.0$",
            "why": "combine contributions"
          },
          {
            "do": "Add base value",
            "result": "$10-1.0$",
            "why": "local approximation"
          },
          {
            "do": "State prediction",
            "result": "$9.0$",
            "why": "finish arithmetic"
          }
        ],
        "answer": "The local prediction is $9.0$."
      }
    ],
    "applications": [
      {
        "title": "Probability over regions",
        "background": "Continuous probability models integrate density over a region to get probability.",
        "numbers": "Uniform density $1/6$ on a $2\\times3$ rectangle integrates to $(1/6)6=1$."
      },
      {
        "title": "Computer vision regions",
        "background": "Vision systems sum or average intensity over image patches and volumes.",
        "numbers": "A patch with total integral $3000$ over area $20$ has average intensity $150$."
      },
      {
        "title": "Mass from density",
        "background": "Physics computes mass by accumulating density over area or volume.",
        "numbers": "Density $4$ kg/m$^3$ over volume $6$ m$^3$ gives mass $24$ kg."
      },
      {
        "title": "Expected values",
        "background": "Statistics integrates value times density to compute averages.",
        "numbers": "For uniform $x$ on $[0,2]$, $\\int_0^2 x(1/2)\\,dx=1$."
      },
      {
        "title": "Rendering",
        "background": "Graphics integrates light over pixels, surfaces, or volumes.",
        "numbers": "Constant radiance $0.8$ over area $0.25$ contributes $0.2$."
      },
      {
        "title": "Density transformations",
        "background": "Change of variables preserves total probability after stretching coordinates.",
        "numbers": "If a map doubles area, density is multiplied by $1/2$ so mass stays $1$."
      }
    ],
    "applicationsClose": "The same pattern appears under many names: local change, curvature, constrained motion, and accumulated mass are all ways to turn geometry into numbers.",
    "takeaways": [
      "Always include the Jacobian scale factor.",
      "Work one derivative, matrix entry, equation, or bound at a time.",
      "Check every numerical result with signs and units."
    ]
  }
};
