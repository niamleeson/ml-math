module.exports = {
  "math-11-10": {
    id: "math-11-10",
    title: "The circle and ellipse",
    tagline: "Circles and ellipses are distance stories made visible in the coordinate plane.",
    connections: {
      buildsOn: ["coordinate distance", "quadratic equations", "graphs of functions"],
      leadsTo: ["The parabola and hyperbola", "Quadratic forms", "Quadric surfaces"],
      usedWith: ["distance formula", "completing the square", "symmetry", "eigenvectors"]
    },
    motivation:
      "<p>You already know how to measure distance between points. A circle simply gathers every point that stays the same distance from one center.</p>" +
      "<p>An <b>ellipse</b> relaxes that perfect roundness into two radii. It is still orderly and symmetric, but one direction is wider than the other. This is the first gentle step from simple distance to the geometry of quadratic equations.</p>",
    definition:
      "<p>A <b>circle</b> with center $(h,k)$ and radius $r>0$ is the set of points $(x,y)$ satisfying $(x-h)^2+(y-k)^2=r^2$. This comes directly from the distance formula: the squared distance from $(x,y)$ to $(h,k)$ is $(x-h)^2+(y-k)^2$.</p>" +
      "<p>An axis-aligned <b>ellipse</b> centered at $(h,k)$ has equation $\\frac{(x-h)^2}{a^2}+\\frac{(y-k)^2}{b^2}=1$, where $a,b>0$ are the horizontal and vertical semi-axis lengths. The intercepts occur by setting the other coordinate to its center value, giving $(h\\pm a,k)$ and $(h,k\\pm b)$.</p>" +
      "<p><b>Assumptions that matter:</b> these equations are axis-aligned unless a cross term is present; $r,a,b$ are positive lengths; and translating the center changes $(x,y)$ to $(x-h,y-k)$ without changing the shape.</p>",
    worked: {
      problem: "Put $x^2+y^2-6x+4y-12=0$ into circle form, then identify the center and radius.",
      skills: ["completing the square", "circle equations", "coordinate geometry"],
      strategy: "The center is hidden by linear terms - group coordinates and complete two squares.",
      steps: [
        { do: "Group the $x$ and $y$ terms", result: "$(x^2-6x)+(y^2+4y)=12$", why: "move the constant to the right" },
        { do: "Complete the $x$ square", result: "$x^2-6x+9=(x-3)^2$", why: "half of $-6$ is $-3$, and $(-3)^2=9$" },
        { do: "Complete the $y$ square", result: "$y^2+4y+4=(y+2)^2$", why: "half of $4$ is $2$, and $2^2=4$" },
        { do: "Add the same constants to the right", result: "$(x-3)^2+(y+2)^2=25$", why: "$12+9+4=25$" },
        { do: "Read the center", result: "$(3,-2)$", why: "circle form is $(x-h)^2+(y-k)^2=r^2$" },
        { do: "Read the radius", result: "$r=5$", why: "$r^2=25$" }
      ],
      verify: "The original point $(8,-2)$ is 5 units right of the center, and it satisfies the equation: $64+4-48-8-12=0$.",
      answer: "$(x-3)^2+(y+2)^2=25$; center $(3,-2)$ and radius $5$.",
      connects: "Completing the square turns a quadratic equation back into a distance statement."
    },
    practice: [
      { problem: "Find the center and radius of $(x+4)^2+(y-1)^2=36$.", steps: [
        { do: "Match the $x$ term to $(x-h)^2$", result: "$x+4=x-(-4)$", why: "the sign inside is opposite the center coordinate" },
        { do: "Read the $x$-coordinate", result: "$h=-4$", why: "$x-(-4)$ gives center coordinate $-4$" },
        { do: "Read the $y$-coordinate", result: "$k=1$", why: "$(y-1)^2$ gives center coordinate $1$" },
        { do: "Read $r^2$", result: "$r^2=36$", why: "the right side of circle form is radius squared" },
        { do: "Take the positive square root", result: "$r=6$", why: "a radius is a positive length" }
      ], answer: "Center $(-4,1)$ and radius $6$." },
      { problem: "Write the circle with center $(2,-3)$ through $(2,5)$.", steps: [
        { do: "Use the center form", result: "$(x-2)^2+(y+3)^2=r^2$", why: "insert $h=2$ and $k=-3$" },
        { do: "Compute horizontal difference", result: "$2-2=0$", why: "the point has the same $x$-coordinate as the center" },
        { do: "Compute vertical difference", result: "$5-(-3)=8$", why: "subtract center coordinate from point coordinate" },
        { do: "Compute squared distance", result: "$r^2=0^2+8^2=64$", why: "radius squared is distance squared" },
        { do: "Write the equation", result: "$(x-2)^2+(y+3)^2=64$", why: "substitute the radius squared" }
      ], answer: "$(x-2)^2+(y+3)^2=64$." },
      { problem: "For $\\frac{(x-1)^2}{9}+\\frac{(y+2)^2}{16}=1$, find the center and four vertices on the axes of symmetry.", steps: [
        { do: "Read the center", result: "$(1,-2)$", why: "the shifted terms are $x-1$ and $y+2$" },
        { do: "Read the horizontal semi-axis", result: "$a=3$", why: "$9=3^2$" },
        { do: "Read the vertical semi-axis", result: "$b=4$", why: "$16=4^2$" },
        { do: "Move horizontally from the center", result: "$(-2,-2)$ and $(4,-2)$", why: "subtract and add $3$ to the $x$-coordinate" },
        { do: "Move vertically from the center", result: "$(1,-6)$ and $(1,2)$", why: "subtract and add $4$ to the $y$-coordinate" }
      ], answer: "Center $(1,-2)$; vertices $(-2,-2)$, $(4,-2)$, $(1,-6)$, and $(1,2)$." },
      { problem: "Put $4x^2+9y^2-16x+18y-11=0$ into ellipse form.", steps: [
        { do: "Group and move the constant", result: "$4(x^2-4x)+9(y^2+2y)=11$", why: "factor the quadratic coefficients first" },
        { do: "Complete the $x$ square inside", result: "$x^2-4x+4=(x-2)^2$", why: "half of $-4$ is $-2$" },
        { do: "Complete the $y$ square inside", result: "$y^2+2y+1=(y+1)^2$", why: "half of $2$ is $1$" },
        { do: "Balance the equation", result: "$4(x-2)^2+9(y+1)^2=36$", why: "$11+4\\cdot4+9\\cdot1=36$" },
        { do: "Divide by $36$", result: "$\\frac{(x-2)^2}{9}+\\frac{(y+1)^2}{4}=1$", why: "ellipse standard form has right side $1$" }
      ], answer: "$\\frac{(x-2)^2}{9}+\\frac{(y+1)^2}{4}=1$." },
      { problem: "A 2-D feature vector is accepted when $\\frac{(x-50)^2}{100}+\\frac{(y-20)^2}{25}\\le1$. Decide whether $(58,23)$ is accepted.", steps: [
        { do: "Substitute the point", result: "$\\frac{(58-50)^2}{100}+\\frac{(23-20)^2}{25}$", why: "test whether the point lies inside the ellipse" },
        { do: "Compute the differences", result: "$\\frac{8^2}{100}+\\frac{3^2}{25}$", why: "center the features" },
        { do: "Square the differences", result: "$\\frac{64}{100}+\\frac{9}{25}$", why: "ellipse score uses squared normalized distances" },
        { do: "Convert and add", result: "$0.64+0.36=1.00$", why: "$9/25=0.36$" },
        { do: "Compare with the threshold", result: "$1.00\\le1$", why: "boundary points are included" }
      ], answer: "The point $(58,23)$ is accepted; it lies exactly on the ellipse boundary." }
    ],
    applications: [
      { title: "Anomaly detection ellipses", background: "Classical statistics draws ellipses around typical two-feature data when variation differs by direction.", numbers: "With center $(50,20)$ and scales $10,5$, point $(55,25)$ has score $25/100+25/25=1.25$, so it is outside the unit ellipse." },
      { title: "Image masks", background: "Computer vision often crops or weights a region with a circular or elliptical mask.", numbers: "A circular mask centered at $(100,80)$ with radius $20$ includes pixel $(116,92)$ because $16^2+12^2=400=20^2$." },
      { title: "Camera calibration targets", background: "Projected circles can appear as ellipses when viewed at an angle.", numbers: "An ellipse with semi-axes $30$ and $18$ has area $\\pi ab=540\\pi\\approx1696$ square pixels." },
      { title: "Feature normalization", background: "Dividing by different variances changes a circle of equal standardized distance into an ellipse in raw units.", numbers: "If standard deviations are $4$ and $2$, the standardized score for raw offset $(8,2)$ is $(8/4)^2+(2/2)^2=5$." },
      { title: "Robot safety zones", background: "Robots use circular keep-out zones when distance from a center is the risk measure.", numbers: "A robot at $(3,4)$ from a hazard at $(0,0)$ is exactly $5$ meters away, since $3^2+4^2=25$." },
      { title: "Optimization contours", background: "A quadratic loss with different curvature in two directions has elliptical level sets.", numbers: "For $L=\\frac{x^2}{4}+y^2$, the level $L=1$ has intercepts $(\\pm2,0)$ and $(0,\\pm1)$." }
    ],
    applicationsClose: "Circles and ellipses turn distance, variation, and tolerance into shapes you can compute with.",
    takeaways: [
      "A circle is all points at fixed distance from a center.",
      "An ellipse scales the squared horizontal and vertical distances separately.",
      "Completing the square reveals hidden centers and radii.",
      "Elliptical scores are common when features have different natural scales."
    ]
  },

  "math-11-11": {
    id: "math-11-11",
    title: "The parabola and hyperbola",
    tagline: "Parabolas and hyperbolas show how quadratic equations can bend, open, and split into branches.",
    connections: {
      buildsOn: ["The circle and ellipse", "quadratic equations", "completing the square"],
      leadsTo: ["Quadratic forms", "Quadric surfaces", "Hyperplanes and decision boundaries"],
      usedWith: ["focus and directrix", "asymptotes", "polynomial graphs", "coordinate transformations"]
    },
    motivation:
      "<p>You already met conics that close on themselves: circles and ellipses. But not every quadratic curve is closed.</p>" +
      "<p>A <b>parabola</b> opens like a bowl, and a <b>hyperbola</b> opens in two separated branches. These shapes are not just pictures; they encode squared distance, reciprocal tradeoffs, and asymptotic behavior.</p>",
    definition:
      "<p>A vertical parabola with vertex $(h,k)$ has form $(x-h)^2=4p(y-k)$. Its focus is $(h,k+p)$ and directrix is $y=k-p$. The equation follows from equal distance to the focus and directrix; after squaring and simplifying, the linear $y$ term remains.</p>" +
      "<p>An axis-aligned hyperbola centered at $(h,k)$ has form $\\frac{(x-h)^2}{a^2}-\\frac{(y-k)^2}{b^2}=1$ or $\\frac{(y-k)^2}{b^2}-\\frac{(x-h)^2}{a^2}=1$. The opposite signs create two branches, with asymptotes $y-k=\\pm\\frac{b}{a}(x-h)$ in the first form.</p>" +
      "<p><b>Assumptions that matter:</b> the standard forms here are axis-aligned; $p$ can be positive or negative for parabola direction; $a,b$ are positive lengths; and hyperbola asymptotes guide branches but are not usually reached.</p>",
    worked: {
      problem: "For $\\frac{(x-1)^2}{9}-\\frac{(y+2)^2}{4}=1$, find the center, vertices, and asymptotes.",
      skills: ["hyperbola standard form", "vertices", "asymptotes"],
      strategy: "The positive squared term is in $x$ - read a horizontal hyperbola and use the center shifts.",
      steps: [
        { do: "Read the center", result: "$(1,-2)$", why: "the shifted variables are $x-1$ and $y+2$" },
        { do: "Read $a^2$", result: "$a^2=9$", why: "the positive $x$ term gives the transverse semi-axis" },
        { do: "Take the square root", result: "$a=3$", why: "semi-axis lengths are positive" },
        { do: "Read $b^2$", result: "$b^2=4$", why: "the negative $y$ term gives the conjugate semi-axis" },
        { do: "Take the square root", result: "$b=2$", why: "semi-axis lengths are positive" },
        { do: "Find the vertices", result: "$(-2,-2)$ and $(4,-2)$", why: "move left and right by $a=3$ from the center" },
        { do: "Write the asymptotes", result: "$y+2=\\pm\\frac23(x-1)$", why: "horizontal hyperbola uses slopes $\\pm b/a$" }
      ],
      verify: "At the vertex $(4,-2)$, the equation gives $9/9-0=1$, so the reading is consistent.",
      answer: "Center $(1,-2)$; vertices $(-2,-2)$ and $(4,-2)$; asymptotes $y+2=\\pm\\frac23(x-1)$.",
      connects: "The sign pattern in a quadratic equation tells whether a conic opens in one bowl or two branches."
    },
    practice: [
      { problem: "For $(x-2)^2=12(y+1)$, find the vertex, $p$, focus, and directrix.", steps: [
        { do: "Match to standard form", result: "$(x-h)^2=4p(y-k)$", why: "this is a vertical parabola" },
        { do: "Read the vertex", result: "$(2,-1)$", why: "$x-2$ and $y+1=y-(-1)$ identify $(h,k)$" },
        { do: "Set $4p=12$", result: "$p=3$", why: "the coefficient equals four times focal distance" },
        { do: "Find the focus", result: "$(2,2)$", why: "add $p=3$ to the $y$-coordinate" },
        { do: "Find the directrix", result: "$y=-4$", why: "subtract $p=3$ from $k=-1$" }
      ], answer: "Vertex $(2,-1)$, $p=3$, focus $(2,2)$, directrix $y=-4$." },
      { problem: "Put $y=x^2-6x+5$ in vertex form and identify the vertex.", steps: [
        { do: "Group the square terms", result: "$y=(x^2-6x)+5$", why: "prepare to complete the square" },
        { do: "Complete the square", result: "$x^2-6x=(x-3)^2-9$", why: "add and subtract $9$" },
        { do: "Substitute the rewrite", result: "$y=(x-3)^2-9+5$", why: "replace the quadratic part" },
        { do: "Combine constants", result: "$y=(x-3)^2-4$", why: "$-9+5=-4$" },
        { do: "Read the vertex", result: "$(3,-4)$", why: "vertex form is $y=(x-h)^2+k$" }
      ], answer: "$y=(x-3)^2-4$ with vertex $(3,-4)$." },
      { problem: "For $\\frac{y^2}{25}-\\frac{x^2}{9}=1$, find the vertices and asymptotes.", steps: [
        { do: "Read the center", result: "$(0,0)$", why: "there are no shifts" },
        { do: "Read the positive term", result: "$y^2/25$", why: "positive $y$ term means vertical hyperbola" },
        { do: "Compute $b$", result: "$b=5$", why: "the vertical semi-axis squared is $25$" },
        { do: "Compute $a$", result: "$a=3$", why: "the horizontal denominator is $9$" },
        { do: "Find vertices", result: "$(0,-5)$ and $(0,5)$", why: "move vertically by $5$" },
        { do: "Write asymptotes", result: "$y=\\pm\\frac53 x$", why: "vertical form has slopes $\\pm b/a$" }
      ], answer: "Vertices $(0,\\pm5)$ and asymptotes $y=\\pm\\frac53x$." },
      { problem: "Find the equation of a horizontal parabola with vertex $(1,2)$ and focus $(5,2)$.", steps: [
        { do: "Identify the direction", result: "opens right", why: "the focus is to the right of the vertex" },
        { do: "Find $p$", result: "$p=4$", why: "the focus is 4 units from the vertex" },
        { do: "Choose horizontal form", result: "$(y-k)^2=4p(x-h)$", why: "horizontal parabolas have squared $y$" },
        { do: "Substitute the vertex", result: "$(y-2)^2=4p(x-1)$", why: "$h=1$ and $k=2$" },
        { do: "Substitute $p=4$", result: "$(y-2)^2=16(x-1)$", why: "$4p=16$" }
      ], answer: "$(y-2)^2=16(x-1)$." },
      { problem: "A loss slice is $L(w)=(w-3)^2+2$. Find its vertex and the parameters where $L(w)=11$.", steps: [
        { do: "Read the vertex form", result: "$(w-3)^2+2$", why: "the squared term is already shifted" },
        { do: "Read the vertex", result: "$(3,2)$", why: "minimum occurs when the square is zero" },
        { do: "Set the loss to $11$", result: "$(w-3)^2+2=11$", why: "solve the requested level" },
        { do: "Subtract $2$", result: "$(w-3)^2=9$", why: "isolate the square" },
        { do: "Take square roots", result: "$w-3=\\pm3$", why: "both sides of the parabola reach the same height" },
        { do: "Solve", result: "$w=0$ or $w=6$", why: "add $3$" }
      ], answer: "Vertex $(3,2)$; $L(w)=11$ at $w=0$ and $w=6$." }
    ],
    applications: [
      { title: "Parabolic loss curves", background: "The simplest smooth ML loss around a minimum looks like a parabola.", numbers: "For $L(w)=(w-4)^2+1$, losses at $w=3,4,5$ are $2,1,2$, symmetric around the minimizer." },
      { title: "Support vector hinge geometry", background: "Margin penalties often flatten on one side and grow linearly, while squared hinge versions grow parabolically inside the margin.", numbers: "For squared hinge $L=\\max(0,1-m)^2$, margin $m=0.4$ gives $0.6^2=0.36$." },
      { title: "Satellite dishes", background: "Parabolic reflectors send rays parallel to the axis toward a focus, a geometric fact used in antennas.", numbers: "For $x^2=8y$, $4p=8$, so $p=2$ and the receiver sits at $(0,2)$." },
      { title: "Hyperbolic tradeoffs", background: "Hyperbolas appear when a product is roughly constant, such as latency times throughput in simple models.", numbers: "If $xy=60$, then $x=10$ gives $y=6$, and $x=20$ gives $y=3$." },
      { title: "Asymptotic model behavior", background: "Hyperbola asymptotes teach the habit of reading long-run behavior without exact equality.", numbers: "For $y=1/x$, at $x=10$ the value is $0.1$ and at $x=100$ it is $0.01$, approaching the asymptote $y=0$." },
      { title: "Feature interaction curves", background: "A quadratic decision score with opposite signs can create hyperbola-shaped boundaries.", numbers: "The boundary $x^2-y^2=1$ includes $(\\sqrt2,1)$ because $2-1=1$ and has asymptotes $y=\\pm x$." }
    ],
    applicationsClose: "Parabolas and hyperbolas train your eye to read direction, symmetry, and asymptotes from quadratic equations.",
    takeaways: [
      "A parabola is governed by one squared direction and one linear direction.",
      "A hyperbola has squared terms with opposite signs and two branches.",
      "Completing the square reveals vertices, centers, and shifts.",
      "Parabolic losses and hyperbolic tradeoffs appear often in modeling."
    ]
  },

  "math-11-12": {
    id: "math-11-12",
    title: "Quadratic forms",
    tagline: "A quadratic form is the matrix way to describe squared geometry in many directions at once.",
    connections: {
      buildsOn: ["The circle and ellipse", "matrix multiplication", "dot products"],
      leadsTo: ["Quadric surfaces", "Projections", "Hyperplanes and decision boundaries"],
      usedWith: ["symmetric matrices", "eigenvalues", "optimization", "level sets"]
    },
    motivation:
      "<p>You already know expressions like $3x^2+2xy+y^2$. The cross term $2xy$ can feel like a nuisance because it mixes directions.</p>" +
      "<p>A <b>quadratic form</b> writes the whole expression as $\\mathbf{x}^T A\\mathbf{x}$. That compact notation reveals the geometry: the matrix decides which directions are expensive, flat, or unstable.</p>",
    definition:
      "<p>For a vector $\\mathbf{x}\\in\\mathbb{R}^n$ and a square matrix $A$, a <b>quadratic form</b> is $q(\\mathbf{x})=\\mathbf{x}^T A\\mathbf{x}$. Usually we take $A$ symmetric, because only the symmetric part $\\frac12(A+A^T)$ affects the value.</p>" +
      "<p>In two variables, if $A=\\begin{bmatrix}a&c\\\\c&b\\end{bmatrix}$ and $\\mathbf{x}=\\begin{bmatrix}x\\\\y\\end{bmatrix}$, then $\\mathbf{x}^T A\\mathbf{x}=ax^2+2cxy+by^2$. The factor $2c$ appears because the off-diagonal entries contribute $cxy$ twice.</p>" +
      "<p><b>Assumptions that matter:</b> vectors are columns; $A$ must be square; symmetric matrices give real eigenvalue directions; and positive definite means $\\mathbf{x}^T A\\mathbf{x}>0$ for every nonzero $\\mathbf{x}$.</p>",
    worked: {
      problem: "Compute $q(\\mathbf{x})=\\mathbf{x}^T A\\mathbf{x}$ for $A=\\begin{bmatrix}2&1\\\\1&3\\end{bmatrix}$ and $\\mathbf{x}=\\begin{bmatrix}4\\\\-1\\end{bmatrix}$.",
      skills: ["matrix-vector multiplication", "dot products", "quadratic forms"],
      strategy: "Do the matrix-vector product first, then dot with the original vector.",
      steps: [
        { do: "Multiply $A\\mathbf{x}$", result: "$\\begin{bmatrix}2&1\\\\1&3\\end{bmatrix}\\begin{bmatrix}4\\\\-1\\end{bmatrix}$", why: "quadratic form begins with matrix action" },
        { do: "Compute the first component", result: "$2\\cdot4+1\\cdot(-1)=7$", why: "row one dotted with the vector" },
        { do: "Compute the second component", result: "$1\\cdot4+3\\cdot(-1)=1$", why: "row two dotted with the vector" },
        { do: "Write $A\\mathbf{x}$", result: "$\\begin{bmatrix}7\\\\1\\end{bmatrix}$", why: "collect the two components" },
        { do: "Dot with $\\mathbf{x}$", result: "$\\begin{bmatrix}4&-1\\end{bmatrix}\\begin{bmatrix}7\\\\1\\end{bmatrix}$", why: "left multiplication by $\\mathbf{x}^T$ is a dot product" },
        { do: "Compute the scalar", result: "$4\\cdot7+(-1)\\cdot1=27$", why: "$28-1=27$" }
      ],
      verify: "Expanding gives $2x^2+2xy+3y^2$; at $(4,-1)$ this is $32-8+3=27$.",
      answer: "$q(\\mathbf{x})=27$.",
      connects: "A quadratic form measures a vector after the matrix has stretched and mixed its directions."
    },
    practice: [
      { problem: "Write $5x^2-6xy+2y^2$ as $\\mathbf{x}^T A\\mathbf{x}$ with symmetric $A$.", steps: [
        { do: "Match the $x^2$ coefficient", result: "$a=5$", why: "the upper-left entry multiplies $x^2$" },
        { do: "Match the $y^2$ coefficient", result: "$b=2$", why: "the lower-right entry multiplies $y^2$" },
        { do: "Match the cross term", result: "$2c=-6$", why: "symmetric off-diagonal entries contribute twice" },
        { do: "Solve for $c$", result: "$c=-3$", why: "divide by $2$" },
        { do: "Write the matrix", result: "$A=\\begin{bmatrix}5&-3\\\\-3&2\\end{bmatrix}$", why: "place $c$ in both off-diagonal entries" }
      ], answer: "$5x^2-6xy+2y^2=\\mathbf{x}^T\\begin{bmatrix}5&-3\\\\-3&2\\end{bmatrix}\\mathbf{x}$." },
      { problem: "For $A=\\begin{bmatrix}4&0\\\\0&9\\end{bmatrix}$ and $\\mathbf{x}=\\begin{bmatrix}2\\\\-3\\end{bmatrix}$, compute $\\mathbf{x}^T A\\mathbf{x}$.", steps: [
        { do: "Multiply $A\\mathbf{x}$", result: "$\\begin{bmatrix}8\\\\-27\\end{bmatrix}$", why: "diagonal entries scale coordinates" },
        { do: "Write the dot product", result: "$\\begin{bmatrix}2&-3\\end{bmatrix}\\begin{bmatrix}8\\\\-27\\end{bmatrix}$", why: "finish with $\\mathbf{x}^T$" },
        { do: "Multiply first terms", result: "$2\\cdot8=16$", why: "first coordinate contribution" },
        { do: "Multiply second terms", result: "$(-3)(-27)=81$", why: "second coordinate contribution" },
        { do: "Add", result: "$97$", why: "$16+81=97$" }
      ], answer: "$97$." },
      { problem: "Classify $q(x,y)=x^2+4xy+y^2$ by testing values at $(1,0)$ and $(1,-1)$.", steps: [
        { do: "Evaluate at $(1,0)$", result: "$1^2+4\\cdot1\\cdot0+0^2=1$", why: "one direction gives a positive value" },
        { do: "Evaluate at $(1,-1)$", result: "$1+4(1)(-1)+1$", why: "test a mixed direction" },
        { do: "Simplify the second value", result: "$-2$", why: "$1-4+1=-2$" },
        { do: "Compare signs", result: "both positive and negative values occur", why: "the form changes sign" },
        { do: "Classify", result: "indefinite", why: "indefinite forms take both signs" }
      ], answer: "The quadratic form is indefinite." },
      { problem: "For diagonal $A=\\begin{bmatrix}2&0\\\\0&8\\end{bmatrix}$, describe the level set $\\mathbf{x}^T A\\mathbf{x}=32$.", steps: [
        { do: "Write the equation", result: "$2x^2+8y^2=32$", why: "diagonal form has no cross term" },
        { do: "Divide by $32$", result: "$\\frac{x^2}{16}+\\frac{y^2}{4}=1$", why: "standard ellipse form has right side $1$" },
        { do: "Read horizontal semi-axis", result: "$4$", why: "$16=4^2$" },
        { do: "Read vertical semi-axis", result: "$2$", why: "$4=2^2$" },
        { do: "Name the shape", result: "ellipse", why: "both squared coefficients are positive" }
      ], answer: "An ellipse centered at the origin with semi-axes $4$ and $2$." },
      { problem: "A ridge penalty is $q(w_1,w_2)=0.5w_1^2+2w_2^2$. Compare penalties for $(2,1)$ and $(1,2)$.", steps: [
        { do: "Evaluate at $(2,1)$", result: "$0.5\\cdot2^2+2\\cdot1^2$", why: "substitute the first weight vector" },
        { do: "Simplify first penalty", result: "$4$", why: "$0.5\\cdot4+2=4$" },
        { do: "Evaluate at $(1,2)$", result: "$0.5\\cdot1^2+2\\cdot2^2$", why: "substitute the second vector" },
        { do: "Simplify second penalty", result: "$8.5$", why: "$0.5+8=8.5$" },
        { do: "Compare", result: "$(1,2)$ is penalized more", why: "the $w_2$ direction has larger curvature" }
      ], answer: "Penalties are $4$ and $8.5$; $(1,2)$ is penalized more." }
    ],
    applications: [
      { title: "Mahalanobis distance", background: "Statistics uses quadratic forms to measure distance after accounting for scale and correlation.", numbers: "With diagonal inverse covariance $\\operatorname{diag}(1/4,1)$, offset $(4,2)$ has squared distance $16/4+4=8$." },
      { title: "Ridge regularization", background: "L2 penalties are quadratic forms that discourage large weights.", numbers: "For $\\lambda=0.1$ and weights $(3,4)$, penalty is $0.1(3^2+4^2)=2.5$." },
      { title: "Newton optimization", background: "A Hessian matrix gives the quadratic model of a loss near a point.", numbers: "If $H=\\begin{bmatrix}4&0\\\\0&2\\end{bmatrix}$ and step $(1,-2)$, curvature contribution is $4+8=12$." },
      { title: "Principal component directions", background: "Eigenvectors of a covariance matrix point along axes of elliptical variation.", numbers: "Variances $9$ and $1$ mean a one-standard-deviation ellipse has semi-axes $3$ and $1$." },
      { title: "Energy in signals", background: "Engineering energy often appears as a weighted sum of squared samples.", numbers: "Weights $[2,1,3]$ and samples $[1,-2,1]$ give energy $2\\cdot1+1\\cdot4+3\\cdot1=9$." },
      { title: "Quadratic decision scores", background: "Some classifiers use squared features and interactions rather than only linear scores.", numbers: "Score $s=x^2-y^2$ assigns $(3,1)$ value $8$ and $(1,3)$ value $-8$, separating by sign." }
    ],
    applicationsClose: "Quadratic forms are the compact matrix language behind ellipses, penalties, curvature, and second-order models.",
    takeaways: [
      "$\\mathbf{x}^T A\\mathbf{x}$ is a scalar built from a vector, a square matrix, and the same vector again.",
      "For symmetric $2\\times2$ matrices, off-diagonal entries create the cross term twice.",
      "Positive definite forms behave like squared lengths; indefinite forms take both signs.",
      "Quadratic forms describe curvature, distance, energy, and regularization."
    ]
  },

  "math-11-13": {
    id: "math-11-13",
    title: "Quadric surfaces",
    tagline: "Quadric surfaces are the three-dimensional cousins of conics, shaped by squared coordinates.",
    connections: {
      buildsOn: ["Quadratic forms", "The circle and ellipse", "The parabola and hyperbola"],
      leadsTo: ["Projections", "Rotations, scaling, and translation", "Homogeneous coordinates"],
      usedWith: ["level sets", "eigenvalues", "3-D coordinates", "optimization geometry"]
    },
    motivation:
      "<p>You can recognize an ellipse in the plane. In three dimensions, the same squared-coordinate idea becomes an ellipsoid, a bowl, a saddle, or a cone.</p>" +
      "<p>These <b>quadric surfaces</b> help you visualize loss landscapes, constraints, and geometric models. The equation is algebra; the surface is the shape your intuition can hold.</p>",
    definition:
      "<p>A <b>quadric surface</b> in $\\mathbb{R}^3$ is the zero set or level set of a degree-two equation in $x,y,z$. Examples include ellipsoids $\\frac{x^2}{a^2}+\\frac{y^2}{b^2}+\\frac{z^2}{c^2}=1$, elliptic paraboloids $z=\\frac{x^2}{a^2}+\\frac{y^2}{b^2}$, and hyperboloids with one sign different.</p>" +
      "<p>The signs tell the story. All positive squared terms with a positive level give a closed ellipsoid. Two positive terms equaling a linear coordinate give a bowl. Mixed signs create saddles or separated sheets. Cross-sections by planes reduce the surface to conics you already know.</p>" +
      "<p><b>Assumptions that matter:</b> the simple forms here are centered and axis-aligned; translations replace variables by shifted variables; rotations can remove cross terms when the quadratic matrix is symmetric; and real surfaces require the equation to allow real coordinate values.</p>",
    worked: {
      problem: "Classify $\\frac{x^2}{4}+\\frac{y^2}{9}+\\frac{z^2}{16}=1$ and find its intercepts with the coordinate axes.",
      skills: ["standard forms", "axis intercepts", "3-D geometry"],
      strategy: "All three squared terms are positive and equal $1$ - read an ellipsoid and set two variables to zero for intercepts.",
      steps: [
        { do: "Read the sign pattern", result: "all squared terms are positive", why: "positive closed level sets suggest an ellipsoid" },
        { do: "Read the $x$ denominator", result: "$4=2^2$", why: "the $x$ semi-axis is $2$" },
        { do: "Read the $y$ denominator", result: "$9=3^2$", why: "the $y$ semi-axis is $3$" },
        { do: "Read the $z$ denominator", result: "$16=4^2$", why: "the $z$ semi-axis is $4$" },
        { do: "Set $y=z=0$", result: "$x=\\pm2$", why: "find $x$-axis intercepts" },
        { do: "Set $x=z=0$", result: "$y=\\pm3$", why: "find $y$-axis intercepts" },
        { do: "Set $x=y=0$", result: "$z=\\pm4$", why: "find $z$-axis intercepts" }
      ],
      verify: "The point $(0,0,4)$ gives $16/16=1$, and any coordinate beyond its semi-axis would exceed the level if the others are zero.",
      answer: "An ellipsoid with intercepts $(\\pm2,0,0)$, $(0,\\pm3,0)$, and $(0,0,\\pm4)$.",
      connects: "A quadric surface is a conic idea lifted into one more coordinate."
    },
    practice: [
      { problem: "Classify $z=x^2+4y^2$ and describe the cross-section at $z=4$.", steps: [
        { do: "Read the equation", result: "$z$ equals a sum of squares", why: "a linear coordinate equals positive quadratic terms" },
        { do: "Classify the surface", result: "elliptic paraboloid", why: "it opens in the positive $z$ direction" },
        { do: "Set $z=4$", result: "$x^2+4y^2=4$", why: "horizontal cross-section" },
        { do: "Divide by $4$", result: "$\\frac{x^2}{4}+y^2=1$", why: "standard ellipse form" },
        { do: "Read semi-axes", result: "$2$ in $x$ and $1$ in $y$", why: "denominators are $4$ and $1$" }
      ], answer: "An elliptic paraboloid; at $z=4$ the cross-section is an ellipse with semi-axes $2$ and $1$." },
      { problem: "Classify $x^2+y^2-z^2=1$ and find the cross-section at $z=0$.", steps: [
        { do: "Read the signs", result: "two positive terms and one negative term", why: "mixed signs create a hyperboloid" },
        { do: "Read the right side", result: "$1$", why: "positive level with two positive terms" },
        { do: "Classify", result: "hyperboloid of one sheet", why: "the positive pair forms connected circular sections" },
        { do: "Set $z=0$", result: "$x^2+y^2=1$", why: "take the central cross-section" },
        { do: "Name the cross-section", result: "circle of radius $1$", why: "standard circle equation" }
      ], answer: "A hyperboloid of one sheet; at $z=0$ it cuts a unit circle." },
      { problem: "Classify $z=x^2-y^2$ and compute $z$ at $(2,1)$ and $(1,2)$.", steps: [
        { do: "Read the sign pattern", result: "one positive square and one negative square", why: "opposite curvature directions signal a saddle" },
        { do: "Classify the surface", result: "hyperbolic paraboloid", why: "a linear coordinate equals an indefinite quadratic" },
        { do: "Evaluate at $(2,1)$", result: "$z=4-1=3$", why: "substitute into the equation" },
        { do: "Evaluate at $(1,2)$", result: "$z=1-4=-3$", why: "the other direction bends downward" },
        { do: "Compare", result: "values have opposite signs", why: "the saddle rises one way and falls the other" }
      ], answer: "A hyperbolic paraboloid; $z=3$ at $(2,1)$ and $z=-3$ at $(1,2)$." },
      { problem: "Find the semi-axis lengths of $\\frac{(x-1)^2}{25}+\\frac{(y+2)^2}{9}+\\frac{(z-3)^2}{4}=1$.", steps: [
        { do: "Read the center", result: "$(1,-2,3)$", why: "use the shifts in each coordinate" },
        { do: "Read the $x$ denominator", result: "$25$", why: "it equals the squared $x$ semi-axis" },
        { do: "Take the square root", result: "$5$", why: "$5^2=25$" },
        { do: "Read the $y$ semi-axis", result: "$3$", why: "$9=3^2$" },
        { do: "Read the $z$ semi-axis", result: "$2$", why: "$4=2^2$" }
      ], answer: "Center $(1,-2,3)$ with semi-axis lengths $5$, $3$, and $2$." },
      { problem: "A local loss model is $L(u,v)=10+2u^2+8v^2$. Describe the level set $L=18$.", steps: [
        { do: "Set the level", result: "$10+2u^2+8v^2=18$", why: "use the requested loss value" },
        { do: "Subtract $10$", result: "$2u^2+8v^2=8$", why: "isolate the quadratic terms" },
        { do: "Divide by $8$", result: "$\\frac{u^2}{4}+v^2=1$", why: "put the level curve in ellipse form" },
        { do: "Read the $u$ semi-axis", result: "$2$", why: "$4=2^2$" },
        { do: "Read the $v$ semi-axis", result: "$1$", why: "denominator $1$ gives length $1$" }
      ], answer: "The $L=18$ contour is an ellipse centered at $(0,0)$ with semi-axes $2$ and $1$." }
    ],
    applications: [
      { title: "Loss landscapes", background: "Near a smooth minimum, a multivariable loss is often approximated by a quadratic bowl.", numbers: "For $L=5+3u^2+12v^2$, offset $(1,0.5)$ gives $5+3+3=11$." },
      { title: "Confidence ellipsoids", background: "Multivariate estimates often come with ellipsoid-shaped uncertainty regions.", numbers: "The ellipsoid $x^2/4+y^2/9+z^2=1$ allows $x$ offsets up to $2$, $y$ up to $3$, and $z$ up to $1$." },
      { title: "3-D object modeling", background: "Graphics engines use quadrics for simple shapes because equations are compact and intersections are calculable.", numbers: "A unit sphere satisfies $x^2+y^2+z^2=1$; point $(0.6,0.8,0)$ lies on it because $0.36+0.64=1$." },
      { title: "Saddle points in optimization", background: "Deep learning losses can have saddle-like local geometry, not just minima.", numbers: "For $L=u^2-v^2$, point $(0.1,0)$ raises loss by $0.01$, while $(0,0.1)$ lowers it by $0.01$." },
      { title: "Physics energy surfaces", background: "Potential energy near equilibrium is often quadratic in displacement.", numbers: "With energy $E=\\frac12(4x^2+y^2+9z^2)$, displacement $(1,2,0)$ gives $E=\\frac12(4+4)=4$." },
      { title: "Clustering with Gaussian shapes", background: "A Gaussian density has ellipsoidal equal-density surfaces determined by covariance.", numbers: "If variances are $4,1,9$, the one-standard-deviation ellipsoid has semi-axes $2,1,3$." }
    ],
    applicationsClose: "Quadric surfaces make second-order geometry visible: bowls, saddles, ellipsoids, and hyperbolic shapes all come from signs and scales.",
    takeaways: [
      "Quadric surfaces are degree-two equations in three variables.",
      "All-positive squared terms produce ellipsoids or bowls, depending on the level form.",
      "Mixed signs create hyperboloids and saddles.",
      "Cross-sections reduce 3-D quadrics back to familiar conics."
    ]
  },

  "math-11-14": {
    id: "math-11-14",
    title: "Projections",
    tagline: "Projection finds the shadow of one vector on another direction or subspace.",
    connections: {
      buildsOn: ["dot products", "vectors", "least squares"],
      leadsTo: ["Reflections", "Rotations, scaling, and translation", "Hyperplanes and decision boundaries"],
      usedWith: ["orthogonality", "subspaces", "normal equations", "distance"]
    },
    motivation:
      "<p>You already know what a shadow does: it keeps the part of an object aligned with a light direction and drops the perpendicular part.</p>" +
      "<p>A <b>projection</b> is the same idea for vectors. It answers: how much of this vector lies along that direction? This becomes one of the quiet workhorses of regression, compression, and geometric distance.</p>",
    definition:
      "<p>The projection of $\\mathbf{x}$ onto a nonzero vector $\\mathbf{u}$ is $\\operatorname{proj}_{\\mathbf{u}}(\\mathbf{x})=\\frac{\\mathbf{x}^T\\mathbf{u}}{\\mathbf{u}^T\\mathbf{u}}\\mathbf{u}$. The scalar coefficient tells how many copies of $\\mathbf{u}$ best match $\\mathbf{x}$ along that line.</p>" +
      "<p>The residual $\\mathbf{x}-\\operatorname{proj}_{\\mathbf{u}}(\\mathbf{x})$ is perpendicular to $\\mathbf{u}$. That follows because $\\mathbf{u}^T(\\mathbf{x}-\\frac{\\mathbf{x}^T\\mathbf{u}}{\\mathbf{u}^T\\mathbf{u}}\\mathbf{u})=\\mathbf{u}^T\\mathbf{x}-\\mathbf{x}^T\\mathbf{u}=0$.</p>" +
      "<p><b>Assumptions that matter:</b> the direction vector must be nonzero; dot products use the usual Euclidean geometry unless stated otherwise; and projection onto a subspace uses the closest point whose residual is orthogonal to the whole subspace.</p>",
    worked: {
      problem: "Project $\\mathbf{x}=\\begin{bmatrix}3\\\\4\\end{bmatrix}$ onto $\\mathbf{u}=\\begin{bmatrix}1\\\\2\\end{bmatrix}$.",
      skills: ["dot products", "projection formula", "orthogonal residuals"],
      strategy: "Compute the projection coefficient first, then multiply the direction vector.",
      steps: [
        { do: "Compute $\\mathbf{x}^T\\mathbf{u}$", result: "$3\\cdot1+4\\cdot2=11$", why: "the numerator measures aligned amount" },
        { do: "Compute $\\mathbf{u}^T\\mathbf{u}$", result: "$1^2+2^2=5$", why: "the denominator measures direction length squared" },
        { do: "Form the coefficient", result: "$\\frac{11}{5}$", why: "divide aligned amount by direction length squared" },
        { do: "Multiply by $\\mathbf{u}$", result: "$\\frac{11}{5}\\begin{bmatrix}1\\\\2\\end{bmatrix}$", why: "the projection must lie on the line spanned by $\\mathbf{u}$" },
        { do: "Write the projected vector", result: "$\\begin{bmatrix}11/5\\\\22/5\\end{bmatrix}$", why: "scale each component" },
        { do: "Compute the residual", result: "$\\begin{bmatrix}4/5\\\\-2/5\\end{bmatrix}$", why: "$\\mathbf{x}$ minus its projection" }
      ],
      verify: "The residual is orthogonal to $\\mathbf{u}$ because $(4/5)\\cdot1+(-2/5)\\cdot2=0$.",
      answer: "$\\operatorname{proj}_{\\mathbf{u}}(\\mathbf{x})=\\begin{bmatrix}11/5\\\\22/5\\end{bmatrix}$.",
      connects: "Projection splits a vector into along-direction and perpendicular pieces."
    },
    practice: [
      { problem: "Project $\\mathbf{x}=\\begin{bmatrix}6\\\\2\\end{bmatrix}$ onto $\\mathbf{u}=\\begin{bmatrix}3\\\\0\\end{bmatrix}$.", steps: [
        { do: "Compute the numerator", result: "$\\mathbf{x}^T\\mathbf{u}=18$", why: "$6\\cdot3+2\\cdot0=18$" },
        { do: "Compute the denominator", result: "$\\mathbf{u}^T\\mathbf{u}=9$", why: "$3^2+0^2=9$" },
        { do: "Divide", result: "$18/9=2$", why: "projection coefficient" },
        { do: "Scale $\\mathbf{u}$", result: "$2\\begin{bmatrix}3\\\\0\\end{bmatrix}=\\begin{bmatrix}6\\\\0\\end{bmatrix}$", why: "the result lies on the $x$-axis" },
        { do: "Find the residual", result: "$\\begin{bmatrix}0\\\\2\\end{bmatrix}$", why: "subtract the projection from $\\mathbf{x}$" }
      ], answer: "Projection $\\begin{bmatrix}6\\\\0\\end{bmatrix}$; residual $\\begin{bmatrix}0\\\\2\\end{bmatrix}$." },
      { problem: "Find the scalar projection of $\\mathbf{x}=(2,5)$ onto unit vector $\\mathbf{e}=(0.6,0.8)$.", steps: [
        { do: "Check unit length", result: "$0.6^2+0.8^2=1$", why: "unit vectors simplify projection" },
        { do: "Dot the vectors", result: "$2\\cdot0.6+5\\cdot0.8$", why: "scalar projection onto a unit vector is the dot product" },
        { do: "Multiply terms", result: "$1.2+4.0$", why: "compute each component contribution" },
        { do: "Add", result: "$5.2$", why: "total signed length along the unit direction" },
        { do: "Write vector projection", result: "$5.2(0.6,0.8)=(3.12,4.16)$", why: "scalar times unit direction gives the shadow vector" }
      ], answer: "Scalar projection $5.2$; vector projection $(3.12,4.16)$." },
      { problem: "Project $\\mathbf{x}=\\begin{bmatrix}1\\\\2\\\\3\\end{bmatrix}$ onto the $xy$-plane.", steps: [
        { do: "Identify the target subspace", result: "vectors of the form $(a,b,0)$", why: "the $xy$-plane has zero $z$ coordinate" },
        { do: "Keep the $x$ coordinate", result: "$1$", why: "it already lies in the plane" },
        { do: "Keep the $y$ coordinate", result: "$2$", why: "it already lies in the plane" },
        { do: "Drop the $z$ coordinate", result: "$0$", why: "the perpendicular direction is the $z$-axis" },
        { do: "Write the projection", result: "$\\begin{bmatrix}1\\\\2\\\\0\\end{bmatrix}$", why: "closest point in the plane" }
      ], answer: "$\\begin{bmatrix}1\\\\2\\\\0\\end{bmatrix}$." },
      { problem: "Find the distance from $\\mathbf{x}=\\begin{bmatrix}3\\\\4\\end{bmatrix}$ to the line spanned by $\\mathbf{u}=\\begin{bmatrix}1\\\\2\\end{bmatrix}$.", steps: [
        { do: "Use the known projection", result: "$\\begin{bmatrix}11/5\\\\22/5\\end{bmatrix}$", why: "from the worked example" },
        { do: "Compute the residual", result: "$\\begin{bmatrix}3\\\\4\\end{bmatrix}-\\begin{bmatrix}11/5\\\\22/5\\end{bmatrix}$", why: "distance to a line is residual length" },
        { do: "Simplify residual", result: "$\\begin{bmatrix}4/5\\\\-2/5\\end{bmatrix}$", why: "subtract componentwise" },
        { do: "Compute squared length", result: "$(4/5)^2+(-2/5)^2=20/25$", why: "use the Euclidean norm" },
        { do: "Take square root", result: "$\\sqrt{20/25}=\\frac{2}{\\sqrt5}$", why: "distance is the norm" }
      ], answer: "Distance $\\frac{2}{\\sqrt5}\\approx0.894$." },
      { problem: "A one-feature least-squares model predicts $\\hat{\\mathbf{y}}=c\\mathbf{u}$ with $\\mathbf{u}=(1,2,2)$ and $\\mathbf{y}=(2,1,5)$. Find $c$.", steps: [
        { do: "Compute $\\mathbf{y}^T\\mathbf{u}$", result: "$2\\cdot1+1\\cdot2+5\\cdot2=14$", why: "numerator for projection coefficient" },
        { do: "Compute $\\mathbf{u}^T\\mathbf{u}$", result: "$1^2+2^2+2^2=9$", why: "denominator for projection coefficient" },
        { do: "Divide", result: "$c=14/9$", why: "least-squares coefficient for one basis vector" },
        { do: "Form the prediction", result: "$\\hat{\\mathbf{y}}=(14/9,28/9,28/9)$", why: "scale the feature vector" },
        { do: "Interpret", result: "residual is orthogonal to $\\mathbf{u}$", why: "projection gives the closest vector on the line" }
      ], answer: "$c=14/9$, so $\\hat{\\mathbf{y}}=(14/9,28/9,28/9)$." }
    ],
    applications: [
      { title: "Least-squares regression", background: "Linear regression projects the target vector onto the column space of the feature matrix.", numbers: "For one feature $u=(1,1,2)$ and target $y=(2,4,4)$, coefficient is $(10)/(6)=5/3$." },
      { title: "Dimensionality reduction", background: "PCA keeps projections onto directions of largest variance.", numbers: "Projecting $(3,4)$ onto unit direction $(0.6,0.8)$ gives scalar $5$, so all information lies along that direction." },
      { title: "Distance to a model subspace", background: "Residual norms measure how much data is not explained by a chosen subspace.", numbers: "If residual is $(0,3,4)$, unexplained distance is $5$." },
      { title: "Computer graphics shadows", background: "Flat shadows are projections of 3-D points onto a plane.", numbers: "Projecting $(2,5,7)$ onto ground plane $z=0$ gives $(2,5,0)$." },
      { title: "Signal reconstruction", background: "Fourier coefficients are projections onto sine and cosine basis functions.", numbers: "If a signal vector has dot product $12$ with a unit basis vector, its coefficient on that basis is $12$." },
      { title: "Recommendation embeddings", background: "A user's interest in a topic direction can be measured by projection onto that topic vector.", numbers: "User vector $(2,1)$ projected onto unit topic $(0.8,0.6)$ has score $2.2$." }
    ],
    applicationsClose: "Projection is the language of shadows, best approximations, residuals, and compressed coordinates.",
    takeaways: [
      "Projection keeps the component of a vector along a direction or subspace.",
      "$\\operatorname{proj}_{\\mathbf{u}}(\\mathbf{x})=\\frac{\\mathbf{x}^T\\mathbf{u}}{\\mathbf{u}^T\\mathbf{u}}\\mathbf{u}$ for nonzero $\\mathbf{u}$.",
      "The residual after projection is orthogonal to the target direction.",
      "Least squares and PCA are projection ideas in practical form."
    ]
  },

  "math-11-15": {
    id: "math-11-15",
    title: "Reflections",
    tagline: "A reflection flips space across a mirror while preserving lengths and angles.",
    connections: {
      buildsOn: ["Projections", "vectors", "dot products"],
      leadsTo: ["Rotations, scaling, and translation", "Homogeneous coordinates", "Hyperplanes and decision boundaries"],
      usedWith: ["orthogonal matrices", "symmetry", "normal vectors", "coordinate transformations"]
    },
    motivation:
      "<p>You know a mirror image when you see one: distances stay the same, but one perpendicular direction changes sign.</p>" +
      "<p>In linear algebra, a <b>reflection</b> makes that mirror exact. It keeps the component lying in the mirror and reverses the component perpendicular to it. Projection gives us the clean formula.</p>",
    definition:
      "<p>Reflection across a line through the origin with unit direction $\\mathbf{u}$ sends $\\mathbf{x}$ to $2(\\mathbf{u}^T\\mathbf{x})\\mathbf{u}-\\mathbf{x}$. It doubles the projected component along the mirror and subtracts the original vector, flipping the perpendicular component.</p>" +
      "<p>Reflection across a hyperplane through the origin with unit normal $\\mathbf{n}$ sends $\\mathbf{x}$ to $\\mathbf{x}-2(\\mathbf{n}^T\\mathbf{x})\\mathbf{n}$. The normal component changes sign; every vector in the mirror plane stays fixed.</p>" +
      "<p><b>Assumptions that matter:</b> the simple formulas use unit vectors; if the mirror does not pass through the origin, translate to the mirror first; and reflections preserve lengths but reverse orientation.</p>",
    worked: {
      problem: "Reflect $\\mathbf{x}=\\begin{bmatrix}3\\\\1\\end{bmatrix}$ across the line $y=x$.",
      skills: ["unit directions", "projection", "reflection formula"],
      strategy: "Use the unit direction of the mirror line, project onto it, then flip the perpendicular part.",
      steps: [
        { do: "Choose a unit direction", result: "$\\mathbf{u}=\\frac{1}{\\sqrt2}\\begin{bmatrix}1\\\\1\\end{bmatrix}$", why: "the line $y=x$ points equally in $x$ and $y$" },
        { do: "Compute $\\mathbf{u}^T\\mathbf{x}$", result: "$\\frac{1}{\\sqrt2}(3+1)=\\frac{4}{\\sqrt2}$", why: "find the scalar projection on the mirror" },
        { do: "Compute the projection", result: "$(\\mathbf{u}^T\\mathbf{x})\\mathbf{u}=\\begin{bmatrix}2\\\\2\\end{bmatrix}$", why: "$4/\\sqrt2$ times $1/\\sqrt2$ equals $2$" },
        { do: "Double the projection", result: "$2\\operatorname{proj}=\\begin{bmatrix}4\\\\4\\end{bmatrix}$", why: "reflection across a line uses $2\\operatorname{proj}-\\mathbf{x}$" },
        { do: "Subtract $\\mathbf{x}$", result: "$\\begin{bmatrix}4\\\\4\\end{bmatrix}-\\begin{bmatrix}3\\\\1\\end{bmatrix}=\\begin{bmatrix}1\\\\3\\end{bmatrix}$", why: "flip the perpendicular component" }
      ],
      verify: "The line $y=x$ swaps coordinates, so $(3,1)$ becoming $(1,3)$ is exactly right.",
      answer: "The reflection is $\\begin{bmatrix}1\\\\3\\end{bmatrix}$.",
      connects: "Reflection is projection plus a sign change in the perpendicular direction."
    },
    practice: [
      { problem: "Reflect $(4,-2)$ across the $x$-axis.", steps: [
        { do: "Identify the mirror", result: "$x$-axis", why: "points on the mirror have $y=0$" },
        { do: "Keep the parallel coordinate", result: "$x=4$", why: "motion along the mirror is unchanged" },
        { do: "Reverse the perpendicular coordinate", result: "$y=2$", why: "the $y$ direction is perpendicular to the $x$-axis" },
        { do: "Write the reflected point", result: "$(4,2)$", why: "combine unchanged $x$ with flipped $y$" },
        { do: "Check distance to mirror", result: "$2$ on both sides", why: "reflection preserves perpendicular distance" }
      ], answer: "$(4,2)$." },
      { problem: "Reflect $(5,1)$ across the $y$-axis.", steps: [
        { do: "Identify the mirror", result: "$y$-axis", why: "points on the mirror have $x=0$" },
        { do: "Reverse the perpendicular coordinate", result: "$x=-5$", why: "the $x$ direction is perpendicular to the $y$-axis" },
        { do: "Keep the parallel coordinate", result: "$y=1$", why: "the coordinate along the mirror stays fixed" },
        { do: "Write the reflected point", result: "$(-5,1)$", why: "combine flipped $x$ with unchanged $y$" },
        { do: "Check length", result: "$\\sqrt{26}$ before and after", why: "reflection through an origin axis preserves distance from the origin" }
      ], answer: "$(-5,1)$." },
      { problem: "Reflect $\\mathbf{x}=(2,3)$ across the line with unit direction $\\mathbf{u}=(1,0)$ using the formula.", steps: [
        { do: "Compute the dot product", result: "$\\mathbf{u}^T\\mathbf{x}=2$", why: "only the $x$ component remains" },
        { do: "Compute the projection", result: "$2(1,0)=(2,0)$", why: "scale the unit direction" },
        { do: "Double the projection", result: "$(4,0)$", why: "line reflection uses twice the projection" },
        { do: "Subtract the original vector", result: "$(4,0)-(2,3)=(2,-3)$", why: "flip the perpendicular component" },
        { do: "Interpret", result: "reflection across the $x$-axis", why: "the line direction $(1,0)$ is the $x$-axis" }
      ], answer: "$(2,-3)$." },
      { problem: "Reflect $(3,4)$ across the line $y=-x$.", steps: [
        { do: "Use a unit direction", result: "$\\mathbf{u}=\\frac{1}{\\sqrt2}(1,-1)$", why: "the line $y=-x$ points along $(1,-1)$" },
        { do: "Compute the dot product", result: "$\\mathbf{u}^T\\mathbf{x}=\\frac{3-4}{\\sqrt2}=-\\frac{1}{\\sqrt2}$", why: "project onto the mirror" },
        { do: "Compute the projection", result: "$(-1/2,1/2)$", why: "multiply the scalar by $\\mathbf{u}$" },
        { do: "Double the projection", result: "$(-1,1)$", why: "prepare $2\\operatorname{proj}-\\mathbf{x}$" },
        { do: "Subtract $\\mathbf{x}$", result: "$(-1,1)-(3,4)=(-4,-3)$", why: "complete the reflection" }
      ], answer: "$(-4,-3)$." },
      { problem: "Reflect point $(5,2)$ across the vertical line $x=1$.", steps: [
        { do: "Translate so the mirror is at the origin", result: "$x'=5-1=4$", why: "measure horizontal distance from the line" },
        { do: "Reflect the translated coordinate", result: "$x'=-4$", why: "vertical mirror flips horizontal offset" },
        { do: "Translate back", result: "$x=1+(-4)=-3$", why: "return to original coordinates" },
        { do: "Keep the vertical coordinate", result: "$y=2$", why: "vertical line reflection does not change height" },
        { do: "Write the point", result: "$(-3,2)$", why: "combine the reflected coordinates" }
      ], answer: "$(-3,2)$." }
    ],
    applications: [
      { title: "Data augmentation", background: "Computer vision often reflects images to teach models that left-right position may not change class.", numbers: "In a width-$100$ image using coordinates $0$ to $99$, horizontal flip sends $x=12$ to $87$." },
      { title: "Householder reflections", background: "Numerical linear algebra uses reflections to zero out vector components stably.", numbers: "Reflecting $(3,4)$ to align with the $x$-axis preserves length $5$, producing a vector like $(5,0)$." },
      { title: "Game physics", background: "A bouncing object reflects its velocity across a wall's tangent or normal.", numbers: "Velocity $(3,-2)$ hitting a horizontal wall becomes $(3,2)$ after reversing the normal component." },
      { title: "Symmetry checks", background: "Models and simulations can be tested by reflecting inputs when the problem has mirror symmetry.", numbers: "If a score depends on $x^2+y^2$, then $(2,5)$ and $(-2,5)$ both score $29$." },
      { title: "Mirror descent intuition", background: "Optimization algorithms sometimes transform geometry before stepping; reflection is the simplest length-preserving transformation to understand first.", numbers: "A vector of norm $\\sqrt{10}$ remains norm $\\sqrt{10}$ after reflection across any line through the origin." },
      { title: "Robotics coordinate frames", background: "Robots use reflected frames when cameras or grippers view a workspace through mirrored coordinates.", numbers: "A point $(0.4,0.1)$ meters reflected across the robot centerline becomes $(-0.4,0.1)$." }
    ],
    applicationsClose: "Reflections preserve size while changing side, which makes them useful for symmetry, stability, and geometric transformations.",
    takeaways: [
      "A reflection keeps the mirror component and reverses the perpendicular component.",
      "Across a unit-normal hyperplane, the formula is $\\mathbf{x}-2(\\mathbf{n}^T\\mathbf{x})\\mathbf{n}$.",
      "Reflections preserve lengths and angles.",
      "Projection is the tool that makes reflection formulas simple."
    ]
  },

  "math-11-16": {
    id: "math-11-16",
    title: "Rotations, scaling, and translation",
    tagline: "Geometric transformations move coordinates without losing the structure of the object.",
    connections: {
      buildsOn: ["Reflections", "matrix multiplication", "trigonometric functions"],
      leadsTo: ["Homogeneous coordinates", "Hyperplanes and decision boundaries", "feature transformations"],
      usedWith: ["linear maps", "affine maps", "coordinate frames", "matrix composition"]
    },
    motivation:
      "<p>You can slide a drawing, turn it, or resize it without changing what it is. Coordinates change, but the object remains recognizable.</p>" +
      "<p>In math and ML, <b>rotations</b>, <b>scaling</b>, and <b>translations</b> are the basic moves for data, images, embeddings, and coordinate frames. Matrix notation lets us compose those moves carefully.</p>",
    definition:
      "<p>A counterclockwise rotation by angle $\\theta$ in the plane is $R_\\theta=\\begin{bmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{bmatrix}$. Scaling by factors $s_x,s_y$ is $S=\\begin{bmatrix}s_x&0\\\\0&s_y\\end{bmatrix}$. Translation adds a vector $\\mathbf{t}$, giving $\\mathbf{x}\\mapsto A\\mathbf{x}+\\mathbf{t}$.</p>" +
      "<p>Rotations preserve lengths because the columns of $R_\\theta$ are orthonormal, so $R_\\theta^T R_\\theta=I$. Scaling changes lengths by coordinate factors. Translation is not linear because it does not send the origin to the origin, but it is affine.</p>" +
      "<p><b>Assumptions that matter:</b> angles are in radians unless stated otherwise; transformation order matters; matrices act on column vectors; and translations require affine notation or homogeneous coordinates to be represented by matrices.</p>",
    worked: {
      problem: "Rotate point $(2,1)$ by $90$ degrees counterclockwise, then translate by $(3,-2)$.",
      skills: ["rotation matrices", "translation", "transformation order"],
      strategy: "Apply the rotation first, then add the translation vector.",
      steps: [
        { do: "Write the $90$ degree rotation", result: "$R=\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}$", why: "$\\cos90=0$ and $\\sin90=1$ in degree language" },
        { do: "Apply $R$ to the point", result: "$\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}\\begin{bmatrix}2\\\\1\\end{bmatrix}$", why: "rotate before translating" },
        { do: "Compute the rotated point", result: "$\\begin{bmatrix}-1\\\\2\\end{bmatrix}$", why: "row products give $-1$ and $2$" },
        { do: "Write the translation", result: "$\\begin{bmatrix}3\\\\-2\\end{bmatrix}$", why: "translation is added after the linear map" },
        { do: "Add the translation", result: "$\\begin{bmatrix}-1\\\\2\\end{bmatrix}+\\begin{bmatrix}3\\\\-2\\end{bmatrix}=\\begin{bmatrix}2\\\\0\\end{bmatrix}$", why: "add componentwise" }
      ],
      verify: "The rotation alone preserves length: $(2,1)$ and $(-1,2)$ both have squared length $5$; translation then changes position.",
      answer: "The final point is $(2,0)$.",
      connects: "Affine transformations combine a linear change of shape or direction with a shift of location."
    },
    practice: [
      { problem: "Scale $(3,-2)$ by $s_x=2$ and $s_y=0.5$.", steps: [
        { do: "Write the scaling matrix", result: "$S=\\begin{bmatrix}2&0\\\\0&0.5\\end{bmatrix}$", why: "diagonal entries scale coordinates" },
        { do: "Multiply the first coordinate", result: "$2\\cdot3=6$", why: "horizontal scaling" },
        { do: "Multiply the second coordinate", result: "$0.5\\cdot(-2)=-1$", why: "vertical scaling" },
        { do: "Write the vector", result: "$(6,-1)$", why: "collect scaled coordinates" },
        { do: "Compare shape effect", result: "wider and vertically compressed", why: "$x$ doubled and $y$ halved" }
      ], answer: "$(6,-1)$." },
      { problem: "Rotate $(4,0)$ by $180$ degrees about the origin.", steps: [
        { do: "Write the rotation matrix", result: "$R=\\begin{bmatrix}-1&0\\\\0&-1\\end{bmatrix}$", why: "$\\cos180=-1$ and $\\sin180=0$" },
        { do: "Apply the matrix", result: "$R\\begin{bmatrix}4\\\\0\\end{bmatrix}$", why: "matrix-vector multiplication rotates the point" },
        { do: "Compute first coordinate", result: "$-4$", why: "multiply by $-1$" },
        { do: "Compute second coordinate", result: "$0$", why: "zero stays zero" },
        { do: "Write the result", result: "$(-4,0)$", why: "a half-turn reverses direction" }
      ], answer: "$(-4,0)$." },
      { problem: "Translate $(1,7)$ by vector $(-3,4)$.", steps: [
        { do: "Write the addition", result: "$(1,7)+(-3,4)$", why: "translation adds the same vector to every point" },
        { do: "Add $x$ coordinates", result: "$1+(-3)=-2$", why: "horizontal shift" },
        { do: "Add $y$ coordinates", result: "$7+4=11$", why: "vertical shift" },
        { do: "Write the result", result: "$(-2,11)$", why: "combine coordinates" },
        { do: "Check displacement", result: "$(-3,4)$", why: "new point minus old point equals translation vector" }
      ], answer: "$(-2,11)$." },
      { problem: "Apply scaling $S=\\operatorname{diag}(2,3)$, then translation $(1,-1)$, to $(2,1)$.", steps: [
        { do: "Scale first", result: "$S(2,1)=(4,3)$", why: "order says scaling happens before translation" },
        { do: "Write the translation", result: "$(4,3)+(1,-1)$", why: "add the shift after scaling" },
        { do: "Add first coordinate", result: "$5$", why: "$4+1=5$" },
        { do: "Add second coordinate", result: "$2$", why: "$3-1=2$" },
        { do: "Write the final point", result: "$(5,2)$", why: "composition is complete" }
      ], answer: "$(5,2)$." },
      { problem: "A feature vector $(10,20)$ is standardized by subtracting $(6,8)$ and scaling by $(0.5,0.25)$. Find the transformed vector.", steps: [
        { do: "Subtract the center", result: "$(10,20)-(6,8)=(4,12)$", why: "translation recenters the features" },
        { do: "Scale the first coordinate", result: "$0.5\\cdot4=2$", why: "apply the first scale" },
        { do: "Scale the second coordinate", result: "$0.25\\cdot12=3$", why: "apply the second scale" },
        { do: "Write transformed vector", result: "$(2,3)$", why: "collect scaled centered values" },
        { do: "Interpret", result: "two and three scaled units above center", why: "standardization expresses relative position" }
      ], answer: "$(2,3)$." }
    ],
    applications: [
      { title: "Image augmentation", background: "Vision models are trained with transformed images so they learn stable objects rather than one exact pose.", numbers: "A point $(10,0)$ rotated $90$ degrees becomes $(0,10)$, then shifted by $(5,5)$ becomes $(5,15)$." },
      { title: "Feature standardization", background: "ML preprocessing translates by the mean and scales by standard deviation.", numbers: "With mean $50$ and standard deviation $10$, feature $70$ becomes $(70-50)/10=2$." },
      { title: "Robotics frames", background: "A robot converts sensor coordinates into world coordinates by rotating and translating.", numbers: "Sensor point $(1,0)$ rotated $90$ degrees and translated by $(2,3)$ becomes $(2,4)$." },
      { title: "Embedding alignment", background: "Two embedding spaces can sometimes be aligned with a rotation that preserves dot products.", numbers: "Vectors $(1,0)$ and $(0,1)$ rotated together by $90$ degrees still have dot product $0$." },
      { title: "Graphics model matrices", background: "Computer graphics composes scale, rotation, and translation to place objects in a scene.", numbers: "Scaling $(1,2)$ by $3$ gives $(3,6)$; translating by $(10,0)$ gives $(13,6)$." },
      { title: "Data centering before PCA", background: "PCA first translates data to mean zero, then rotates axes to principal directions.", numbers: "Points with mean $(4,5)$ send $(7,9)$ to centered vector $(3,4)$ before rotation." }
    ],
    applicationsClose: "Rotations, scaling, and translation are the basic vocabulary for moving data and coordinates while tracking what changes and what stays fixed.",
    takeaways: [
      "Rotations preserve lengths and angles; scaling changes lengths by chosen factors.",
      "Translations add a vector and are affine rather than linear.",
      "Transformation order matters.",
      "Preprocessing, graphics, robotics, and augmentation all use these same moves."
    ]
  },

  "math-11-17": {
    id: "math-11-17",
    title: "Homogeneous coordinates",
    tagline: "Homogeneous coordinates let translations join rotations and scaling inside one matrix multiplication.",
    connections: {
      buildsOn: ["Rotations, scaling, and translation", "matrix multiplication", "coordinate transformations"],
      leadsTo: ["Hyperplanes and decision boundaries", "projective geometry", "computer vision"],
      usedWith: ["affine maps", "matrix composition", "perspective projection", "graphics pipelines"]
    },
    motivation:
      "<p>Matrix multiplication handles rotations and scaling beautifully, but translation is awkward because adding a vector is not linear.</p>" +
      "<p><b>Homogeneous coordinates</b> fix that by adding one extra coordinate. A 2-D point $(x,y)$ becomes $(x,y,1)$, and now affine transformations can be written as one matrix product. This is a small trick with enormous practical reach.</p>",
    definition:
      "<p>In 2-D homogeneous coordinates, the point $(x,y)$ is represented by $\\begin{bmatrix}x\\\\y\\\\1\\end{bmatrix}$. An affine transformation $\\mathbf{x}\\mapsto A\\mathbf{x}+\\mathbf{t}$ becomes $\\begin{bmatrix}A&\\mathbf{t}\\\\0&1\\end{bmatrix}\\begin{bmatrix}x\\\\y\\\\1\\end{bmatrix}$, where the last row keeps the homogeneous coordinate equal to $1$.</p>" +
      "<p>For projective coordinates, nonzero scalar multiples represent the same point: $(X,Y,W)$ corresponds to $(X/W,Y/W)$ when $W\\ne0$. That division is how perspective projection enters geometry.</p>" +
      "<p><b>Assumptions that matter:</b> affine point coordinates use final coordinate $1$; direction vectors often use final coordinate $0$ so translation does not move them; and converting back from projective coordinates requires $W\\ne0$.</p>",
    worked: {
      problem: "Use homogeneous coordinates to scale $(2,3)$ by $2$ in both directions and then translate by $(5,-1)$.",
      skills: ["homogeneous matrices", "affine transformations", "matrix multiplication"],
      strategy: "Build one matrix whose upper-left block scales and whose last column translates.",
      steps: [
        { do: "Write the homogeneous point", result: "$\\begin{bmatrix}2\\\\3\\\\1\\end{bmatrix}$", why: "append $1$ for a point" },
        { do: "Write the transformation matrix", result: "$\\begin{bmatrix}2&0&5\\\\0&2&-1\\\\0&0&1\\end{bmatrix}$", why: "diagonal entries scale and last column translates" },
        { do: "Compute the first coordinate", result: "$2\\cdot2+0\\cdot3+5\\cdot1=9$", why: "scale $x$ and add translation" },
        { do: "Compute the second coordinate", result: "$0\\cdot2+2\\cdot3-1\\cdot1=5$", why: "scale $y$ and add translation" },
        { do: "Compute the last coordinate", result: "$1$", why: "the last row keeps affine points as points" },
        { do: "Convert back", result: "$(9,5)$", why: "drop the final $1$" }
      ],
      verify: "Doing it without homogeneous coordinates gives $2(2,3)+(5,-1)=(4,6)+(5,-1)=(9,5)$.",
      answer: "The transformed point is $(9,5)$.",
      connects: "Homogeneous coordinates turn affine motion into ordinary matrix multiplication."
    },
    practice: [
      { problem: "Represent point $(4,-2)$ and direction vector $(4,-2)$ in homogeneous coordinates.", steps: [
        { do: "Append $1$ for the point", result: "$(4,-2,1)$", why: "points are affected by translation" },
        { do: "Append $0$ for the direction", result: "$(4,-2,0)$", why: "directions should not shift under translation" },
        { do: "Compare meanings", result: "same first two numbers, different last coordinate", why: "homogeneous coordinate stores type" },
        { do: "Apply translation idea", result: "point moves, direction does not", why: "translation column is multiplied by the last coordinate" },
        { do: "State both forms", result: "point $(4,-2,1)$; direction $(4,-2,0)$", why: "keep them distinct" }
      ], answer: "Point $(4,-2,1)$; direction $(4,-2,0)$." },
      { problem: "Apply $T=\\begin{bmatrix}1&0&3\\\\0&1&4\\\\0&0&1\\end{bmatrix}$ to point $(2,5)$.", steps: [
        { do: "Write the homogeneous point", result: "$\\begin{bmatrix}2\\\\5\\\\1\\end{bmatrix}$", why: "append $1$" },
        { do: "Compute first coordinate", result: "$1\\cdot2+3\\cdot1=5$", why: "add horizontal translation" },
        { do: "Compute second coordinate", result: "$1\\cdot5+4\\cdot1=9$", why: "add vertical translation" },
        { do: "Compute last coordinate", result: "$1$", why: "affine point remains a point" },
        { do: "Return to 2-D", result: "$(5,9)$", why: "drop the homogeneous coordinate" }
      ], answer: "$(5,9)$." },
      { problem: "Apply the same $T$ to direction $(2,5,0)$.", steps: [
        { do: "Write the multiplication", result: "$T\\begin{bmatrix}2\\\\5\\\\0\\end{bmatrix}$", why: "directions have final coordinate $0$" },
        { do: "Compute first coordinate", result: "$1\\cdot2+3\\cdot0=2$", why: "translation column vanishes" },
        { do: "Compute second coordinate", result: "$1\\cdot5+4\\cdot0=5$", why: "translation column vanishes" },
        { do: "Compute last coordinate", result: "$0$", why: "directions remain directions" },
        { do: "State the result", result: "$(2,5,0)$", why: "pure translation does not change a direction" }
      ], answer: "$(2,5,0)$." },
      { problem: "Convert homogeneous point $(6,9,3)$ back to ordinary coordinates.", steps: [
        { do: "Identify $W$", result: "$W=3$", why: "the last coordinate is the scale" },
        { do: "Check $W\\ne0$", result: "$3\\ne0$", why: "conversion is allowed" },
        { do: "Divide the first coordinate", result: "$6/3=2$", why: "ordinary $x=X/W$" },
        { do: "Divide the second coordinate", result: "$9/3=3$", why: "ordinary $y=Y/W$" },
        { do: "Write the point", result: "$(2,3)$", why: "drop the scale after division" }
      ], answer: "$(2,3)$." },
      { problem: "Compose translation by $(1,2)$ after scaling by $3$ and apply to $(2,1)$ using one homogeneous matrix.", steps: [
        { do: "Write the combined matrix", result: "$M=\\begin{bmatrix}3&0&1\\\\0&3&2\\\\0&0&1\\end{bmatrix}$", why: "scale first, then add translation" },
        { do: "Write the point", result: "$\\begin{bmatrix}2\\\\1\\\\1\\end{bmatrix}$", why: "homogeneous point" },
        { do: "Compute first coordinate", result: "$3\\cdot2+1=7$", why: "scale $x$ then translate" },
        { do: "Compute second coordinate", result: "$3\\cdot1+2=5$", why: "scale $y$ then translate" },
        { do: "Write result", result: "$(7,5)$", why: "last coordinate is $1$" }
      ], answer: "$(7,5)$." }
    ],
    applications: [
      { title: "Graphics pipelines", background: "Rendering systems compose model, view, and projection matrices using homogeneous coordinates.", numbers: "A $3\\times3$ 2-D matrix with translation column $(10,5,1)$ sends origin $(0,0,1)$ to $(10,5,1)$." },
      { title: "Computer vision perspective", background: "Cameras map 3-D points to images by dividing by depth, a homogeneous-coordinate operation.", numbers: "Point $(6,4,2)$ projects to $(6/2,4/2)=(3,2)$." },
      { title: "Robotics transformations", background: "Robot arms chain many joint transformations, each represented by a homogeneous matrix.", numbers: "Two translations $(1,0)$ and $(0,2)$ compose to move a point by $(1,2)$." },
      { title: "Image warping", background: "Augmentation and alignment use affine or projective matrices to move pixels.", numbers: "A pixel $(20,30)$ translated by matrix column $(5,-10)$ moves to $(25,20)$." },
      { title: "Directions versus points", background: "Physics and graphics distinguish locations from vectors such as velocity.", numbers: "A translation by $(7,7)$ changes point $(1,2,1)$ to $(8,9,1)$ but keeps direction $(1,2,0)$ unchanged." },
      { title: "Batch transform composition", background: "Composing transformations once is faster and less error-prone than applying many operations separately.", numbers: "Scaling by $2$ then translating by $3$ in 1-D sends $x=4$ to $11$, represented by matrix $\\begin{bmatrix}2&3\\\\0&1\\end{bmatrix}$." }
    ],
    applicationsClose: "Homogeneous coordinates package affine and projective geometry into matrix multiplication, which is why they are everywhere in vision, graphics, and robotics.",
    takeaways: [
      "A 2-D point $(x,y)$ becomes $(x,y,1)$ in homogeneous coordinates.",
      "Translations become matrix multiplications by adding one coordinate.",
      "Directions use final coordinate $0$, so translations do not move them.",
      "Projective coordinates convert back by dividing by the final coordinate when it is nonzero."
    ]
  },

  "math-11-18": {
    id: "math-11-18",
    title: "Hyperplanes and decision boundaries",
    tagline: "A hyperplane is the flat boundary where a linear score is exactly undecided.",
    connections: {
      buildsOn: ["dot products", "Projections", "Homogeneous coordinates"],
      leadsTo: ["linear classifiers", "support vector machines", "logistic regression geometry"],
      usedWith: ["normal vectors", "distance to a plane", "affine maps", "optimization"]
    },
    motivation:
      "<p>You already know a line can split the plane into two sides. In more dimensions, the same flat splitter is called a hyperplane.</p>" +
      "<p>In ML, a linear model computes a score $\\mathbf{w}^T\\mathbf{x}+b$. The <b>decision boundary</b> is where that score is zero. On one side the model predicts one class; on the other side it predicts the other class. The geometry is simple, but it powers logistic regression, perceptrons, and SVMs.</p>",
    definition:
      "<p>A <b>hyperplane</b> in $\\mathbb{R}^n$ is the set of points satisfying $\\mathbf{w}^T\\mathbf{x}+b=0$, where $\\mathbf{w}\\ne\\mathbf{0}$ is the normal vector and $b$ is the bias. The sign of $\\mathbf{w}^T\\mathbf{x}+b$ tells which side a point lies on.</p>" +
      "<p>The distance from a point $\\mathbf{x}$ to the hyperplane is $\\frac{|\\mathbf{w}^T\\mathbf{x}+b|}{\\|\\mathbf{w}\\|}$. This comes from projecting the point's offset onto the unit normal $\\mathbf{w}/\\|\\mathbf{w}\\|$. For an SVM with labels $y\\in\\{-1,1\\}$, the functional margin is $y(\\mathbf{w}^T\\mathbf{x}+b)$ and the geometric margin is that value divided by $\\|\\mathbf{w}\\|$.</p>" +
      "<p><b>Assumptions that matter:</b> $\\mathbf{w}$ must be nonzero; the sign convention can be flipped by multiplying both $\\mathbf{w}$ and $b$ by $-1$; distances use Euclidean norm; and nonlinear classifiers can still have curved boundaries after feature transformations.</p>",
    worked: {
      problem: "A linear classifier has $\\mathbf{w}=(2,-1)$ and $b=-3$. Classify $\\mathbf{x}=(4,2)$, compute its distance to the boundary, and compute its SVM geometric margin for label $y=1$.",
      skills: ["linear scores", "distance to a hyperplane", "SVM margins"],
      strategy: "Compute the signed score, then divide by the norm of the normal vector for geometric distance.",
      steps: [
        { do: "Compute the dot product", result: "$\\mathbf{w}^T\\mathbf{x}=2\\cdot4+(-1)\\cdot2=6$", why: "linear score starts with weighted features" },
        { do: "Add the bias", result: "$\\mathbf{w}^T\\mathbf{x}+b=6-3=3$", why: "bias shifts the boundary" },
        { do: "Classify by sign", result: "positive class", why: "the score is greater than zero" },
        { do: "Compute the norm of $\\mathbf{w}$", result: "$\\|\\mathbf{w}\\|=\\sqrt{2^2+(-1)^2}=\\sqrt5$", why: "distance divides by normal length" },
        { do: "Compute distance to boundary", result: "$\\frac{|3|}{\\sqrt5}=\\frac{3}{\\sqrt5}\\approx1.34$", why: "use the point-to-hyperplane distance formula" },
        { do: "Compute functional margin", result: "$y(\\mathbf{w}^T\\mathbf{x}+b)=1\\cdot3=3$", why: "label $1$ agrees with positive score" },
        { do: "Compute geometric margin", result: "$\\frac{3}{\\sqrt5}\\approx1.34$", why: "divide functional margin by $\\|\\mathbf{w}\\|$" }
      ],
      verify: "The boundary is $2x_1-x_2-3=0$. Point $(4,2)$ gives $8-2-3=3$, so it is safely on the positive side.",
      answer: "Prediction positive; distance $3/\\sqrt5\\approx1.34$; SVM geometric margin $3/\\sqrt5\\approx1.34$.",
      connects: "Linear classification is signed distance geometry with a learned normal vector."
    },
    practice: [
      { problem: "For boundary $x_1+x_2-5=0$, classify points $(2,1)$ and $(4,3)$ by sign.", steps: [
        { do: "Evaluate the first score", result: "$2+1-5=-2$", why: "substitute $(2,1)$" },
        { do: "Classify the first point", result: "negative side", why: "the score is less than zero" },
        { do: "Evaluate the second score", result: "$4+3-5=2$", why: "substitute $(4,3)$" },
        { do: "Classify the second point", result: "positive side", why: "the score is greater than zero" },
        { do: "Identify boundary status", result: "neither point is on the boundary", why: "neither score equals zero" }
      ], answer: "$(2,1)$ is negative; $(4,3)$ is positive." },
      { problem: "Find the distance from $(3,0)$ to the line $2x-y-4=0$.", steps: [
        { do: "Identify $\\mathbf{w}$ and $b$", result: "$\\mathbf{w}=(2,-1)$ and $b=-4$", why: "match $\\mathbf{w}^T\\mathbf{x}+b=0$" },
        { do: "Compute the score", result: "$2\\cdot3-0-4=2$", why: "substitute the point" },
        { do: "Take absolute value", result: "$|2|=2$", why: "distance is nonnegative" },
        { do: "Compute normal norm", result: "$\\sqrt{2^2+(-1)^2}=\\sqrt5$", why: "normal length scales the score" },
        { do: "Divide", result: "$2/\\sqrt5\\approx0.894$", why: "point-to-line distance formula" }
      ], answer: "Distance $2/\\sqrt5\\approx0.894$." },
      { problem: "A logistic model uses $p=\\sigma(0.8x_1-0.6x_2+0.2)$. Find the decision boundary and classify $(1,2)$ using threshold $0.5$.", steps: [
        { do: "Set the logit to zero", result: "$0.8x_1-0.6x_2+0.2=0$", why: "$\\sigma(z)=0.5$ when $z=0$" },
        { do: "Evaluate the logit at $(1,2)$", result: "$0.8-1.2+0.2=-0.2$", why: "substitute the features" },
        { do: "Compare with zero", result: "$-0.2<0$", why: "negative logit gives probability below $0.5$" },
        { do: "Classify", result: "negative class", why: "threshold is $0.5$" },
        { do: "Estimate probability", result: "$\\sigma(-0.2)\\approx0.45$", why: "a small negative logit is slightly below one half" }
      ], answer: "Boundary $0.8x_1-0.6x_2+0.2=0$; $(1,2)$ is classified negative with probability about $0.45$." },
      { problem: "For SVM parameters $\\mathbf{w}=(3,4)$, $b=-10$, and labeled point $\\mathbf{x}=(2,2)$ with $y=1$, compute functional and geometric margins.", steps: [
        { do: "Compute the dot product", result: "$3\\cdot2+4\\cdot2=14$", why: "weighted feature sum" },
        { do: "Add the bias", result: "$14-10=4$", why: "signed score" },
        { do: "Compute functional margin", result: "$1\\cdot4=4$", why: "multiply by the label" },
        { do: "Compute norm", result: "$\\sqrt{3^2+4^2}=5$", why: "normal length" },
        { do: "Compute geometric margin", result: "$4/5=0.8$", why: "divide by norm" }
      ], answer: "Functional margin $4$; geometric margin $0.8$." },
      { problem: "Use homogeneous coordinates to write score $2x_1-x_2-3$ as one dot product and evaluate it at $(4,2)$.", steps: [
        { do: "Append $1$ to the point", result: "$\\tilde{\\mathbf{x}}=(4,2,1)$", why: "homogeneous coordinate carries the bias" },
        { do: "Append the bias to weights", result: "$\\tilde{\\mathbf{w}}=(2,-1,-3)$", why: "bias becomes a final weight" },
        { do: "Write the dot product", result: "$\\tilde{\\mathbf{w}}^T\\tilde{\\mathbf{x}}=2\\cdot4+(-1)\\cdot2+(-3)\\cdot1$", why: "one dot product includes the affine term" },
        { do: "Simplify", result: "$8-2-3=3$", why: "compute the score" },
        { do: "Classify by sign", result: "positive side", why: "score is greater than zero" }
      ], answer: "Using $\\tilde{\\mathbf{w}}=(2,-1,-3)$ and $\\tilde{\\mathbf{x}}=(4,2,1)$, the score is $3$, so the point is positive." }
    ],
    applications: [
      { title: "Linear binary classifiers", background: "Perceptrons and logistic regression use a linear score, then choose a class from its sign or probability.", numbers: "With $s=1.5x_1-0.5x_2+1$, point $(2,4)$ gives $3-2+1=2$, a positive prediction." },
      { title: "SVM maximum margin", background: "Support vector machines choose a separating hyperplane with a large geometric margin.", numbers: "If $\\|\\mathbf{w}\\|=5$ and the closest functional margin is $1$, the geometric margin is $1/5=0.2$." },
      { title: "Distance-based confidence", background: "For a fixed linear model, larger signed distance often means greater confidence before calibration.", numbers: "Scores $0.5$ and $2.0$ with $\\|\\mathbf{w}\\|=2$ have distances $0.25$ and $1.0$ from the boundary." },
      { title: "Logistic probabilities", background: "Logistic regression turns signed distance-like scores into probabilities with the sigmoid function.", numbers: "Logit $2$ gives $\\sigma(2)\\approx0.881$, while logit $-2$ gives $0.119$." },
      { title: "Multiclass linear models", background: "Softmax classifiers compare several affine scores; boundaries occur where two class scores are equal.", numbers: "If class scores are $s_1=2x+1$ and $s_2=-x+4$, the boundary solves $2x+1=-x+4$, so $x=1$." },
      { title: "Feature engineering creates nonlinear boundaries", background: "A linear hyperplane in transformed features can become curved in original inputs.", numbers: "Using features $(x,x^2)$ and boundary $x^2-4=0$ gives original decision points $x=-2$ and $x=2$." },
      { title: "Fair threshold audits", background: "Changing the bias shifts a boundary without changing its normal direction, which changes who falls on each side.", numbers: "For score $x-0.7$, threshold boundary is $x=0.7$; changing bias to $-0.6$ moves the boundary to $x=0.6$." }
    ],
    applicationsClose: "Hyperplanes are where algebraic scores become geometric decisions: side, distance, margin, and confidence all come from the same flat boundary.",
    takeaways: [
      "A hyperplane has equation $\\mathbf{w}^T\\mathbf{x}+b=0$ with nonzero normal vector $\\mathbf{w}$.",
      "The sign of the score chooses the side of the boundary.",
      "Distance to the boundary is $|\\mathbf{w}^T\\mathbf{x}+b|/\\|\\mathbf{w}\\|$.",
      "SVM margins are signed scores normalized by the length of the weight vector.",
      "The bias can be folded into homogeneous coordinates as one more weight."
    ]
  }
};
