/* =====================================================================
   HARDER PRACTICE PROBLEMS — MODULE 0: FOUNDATIONS
   Appended on top of the 10 basics per owned lesson id.
   Ordered: a notch above basics -> genuinely hard.
   Same formulas and notation as lessons/00-foundations.js.
   ===================================================================== */
(function(){
  var P = window.PRACTICE;
  function add(id, probs){ P[id] = (P[id]||[]).concat(probs); }

  /* ---------------- fnd-vector ---------------- */
  add("fnd-vector", [
    { q:`<p>Compute $3x - 2y$ where $x=[2,-1,4]$ and $y=[1,0,5]$.</p>`,
      steps:[
        {do:`Scale $x$: $3x = [6,-3,12]$.`, why:`Multiply each entry of $x$ by $3$.`},
        {do:`Scale $y$: $2y = [2,0,10]$.`, why:`Multiply each entry of $y$ by $2$.`},
        {do:`Subtract entry by entry: $[6-2,\\;-3-0,\\;12-10]$.`, why:`Combination lines up matching positions.`},
        {do:`Finish each slot: $[4,-3,2]$.`, why:`Do the arithmetic in every position.`}
      ],
      answer:`$3x-2y=[4,-3,2]$` },

    { q:`<p>Find the midpoint vector $\\tfrac{1}{2}(x+y)$ for $x=[2,6]$ and $y=[8,4]$.</p>`,
      steps:[
        {do:`Add: $x+y = [2+8,\\;6+4] = [10,10]$.`, why:`Add matching entries first.`},
        {do:`Halve each entry: $\\tfrac{1}{2}[10,10] = [5,5]$.`, why:`The midpoint is the average of the two vectors.`}
      ],
      answer:`$[5,5]$` },

    { q:`<p>A user vector is $[3,5,2]$. After scaling all activity by $\\tfrac{1}{2}$ and adding a bias vector $[1,1,1]$, what is the result?</p>`,
      steps:[
        {do:`Scale: $\\tfrac{1}{2}[3,5,2] = [1.5,\\;2.5,\\;1]$.`, why:`Halve every entry first.`},
        {do:`Add the bias: $[1.5+1,\\;2.5+1,\\;1+1]$.`, why:`Add the bias vector entry by entry.`},
        {do:`Finish: $[2.5,\\;3.5,\\;2]$.`, why:`Complete each slot.`}
      ],
      answer:`$[2.5,\\,3.5,\\,2]$` },

    { q:`<p>Solve for the vector $v$: $2v + [1,4] = [7,2]$.</p>`,
      steps:[
        {do:`Subtract $[1,4]$ from both sides: $2v = [7-1,\\;2-4] = [6,-2]$.`, why:`Isolate the $2v$ term.`},
        {do:`Divide each entry by $2$: $v = [3,-1]$.`, why:`Scalar division undoes the scaling by $2$.`}
      ],
      answer:`$v=[3,-1]$` },

    { q:`<p>Are $x=[2,4,6]$ and $y=[1,2,3]$ parallel? If so, what is the scale factor $c$ with $x=cy$?</p>`,
      steps:[
        {do:`Try the first entries: $2 = c\\times1$, so $c=2$.`, why:`Parallel means one is a scalar multiple of the other.`},
        {do:`Check the rest: $2\\times2=4$ ✓ and $2\\times3=6$ ✓.`, why:`The same $c$ must work for every entry.`},
        {do:`All match, so $x = 2y$.`, why:`A single consistent factor confirms they are parallel.`}
      ],
      answer:`Parallel, $c=2$` },

    { q:`<p>A photo is a $3\\times3$ grayscale grid with rows $[1,2,3]$, $[4,5,6]$, $[7,8,9]$. Flatten it row by row and give entry $x_6$.</p>`,
      steps:[
        {do:`Flatten: row 1 then row 2 then row 3 $= [1,2,3,4,5,6,7,8,9]$.`, why:`Flattening lays the grid into one fixed-order list.`},
        {do:`Count to position 6: $1,2,3,4,5,\\mathbf{6}$.`, why:`$x_i$ reads the entry at position $i$.`}
      ],
      answer:`$x_6 = 6$` },

    { q:`<p>The displacement from house A $=[2,3]$ to house B $=[7,11]$ is $B-A$. Find it.</p>`,
      steps:[
        {do:`Subtract: $B-A = [7-2,\\;11-3] = [5,8]$.`, why:`The displacement vector points from A to B.`},
        {do:`Its size would be $\\sqrt{5^2+8^2}$, the straight-line gap.`, why:`The length of the difference is the distance between the points.`}
      ],
      answer:`$B-A=[5,8]$` },

    { q:`<p>You stack $50$ users, each with $8$ features, into a dataset. Each user is a vector in which space, and how many numbers total?</p>`,
      steps:[
        {do:`Each user has $8$ features, so each vector is in $\\mathbb{R}^8$.`, why:`Feature count sets the dimension $n$.`},
        {do:`Total numbers $= 50\\times8 = 400$.`, why:`Multiply users by features per user.`}
      ],
      answer:`Each in $\\mathbb{R}^8$; $400$ numbers total` },

    { q:`<p>Combine three vectors: $a=[1,0,2]$, $b=[0,3,1]$, $c=[2,1,0]$ as $a+2b-c$.</p>`,
      steps:[
        {do:`Scale $b$: $2b = [0,6,2]$.`, why:`Apply the scalar before adding.`},
        {do:`Add $a+2b$: $[1+0,\\;0+6,\\;2+2] = [1,6,4]$.`, why:`Add entry by entry.`},
        {do:`Subtract $c$: $[1-2,\\;6-1,\\;4-0] = [-1,5,4]$.`, why:`Finish the combination.`}
      ],
      answer:`$[-1,5,4]$` },

    { q:`<p>A weighted average $0.2a + 0.8b$ uses $a=[10,0]$ and $b=[0,5]$. Compute it and confirm the weights sum to $1$.</p>`,
      steps:[
        {do:`Check weights: $0.2+0.8 = 1$.`, why:`A weighted average needs weights that total $1$.`},
        {do:`Scale: $0.2a = [2,0]$ and $0.8b = [0,4]$.`, why:`Apply each weight to its vector.`},
        {do:`Add: $[2+0,\\;0+4] = [2,4]$.`, why:`Sum the two scaled vectors.`}
      ],
      answer:`$[2,4]$` },

    { q:`<p>Find scalars $s,t$ so that $s[1,0] + t[0,1] = [4,-7]$.</p>`,
      steps:[
        {do:`First entry: $s\\times1 + t\\times0 = s = 4$.`, why:`$[1,0]$ controls only the first slot.`},
        {do:`Second entry: $s\\times0 + t\\times1 = t = -7$.`, why:`$[0,1]$ controls only the second slot.`},
        {do:`So $s=4$, $t=-7$.`, why:`These basis vectors read off the coordinates directly.`}
      ],
      answer:`$s=4,\\;t=-7$` }
  ]);

  /* ---------------- fnd-dot ---------------- */
  add("fnd-dot", [
    { q:`<p>Compute the dot product of the 3-D vectors $x=[1,2,2]$ and $y=[2,-1,3]$.</p>`,
      steps:[
        {do:`$1\\times2 = 2$.`, why:`Multiply the first entries.`},
        {do:`$2\\times(-1) = -2$.`, why:`Multiply the second entries.`},
        {do:`$2\\times3 = 6$.`, why:`Multiply the third entries.`},
        {do:`$2-2+6 = 6$.`, why:`Add all products for one number.`}
      ],
      answer:`$x^\\top y = 6$` },

    { q:`<p>Find the angle between $x=[1,0]$ and $y=[1,1]$ using $\\cos\\theta = \\dfrac{x^\\top y}{\\lVert x\\rVert\\,\\lVert y\\rVert}$.</p>`,
      steps:[
        {do:`Dot: $x^\\top y = 1\\times1 + 0\\times1 = 1$.`, why:`Multiply matching entries and add.`},
        {do:`Norms: $\\lVert x\\rVert = 1$, $\\lVert y\\rVert = \\sqrt{2}$.`, why:`Each norm is $\\sqrt{\\text{sum of squares}}$.`},
        {do:`$\\cos\\theta = \\dfrac{1}{1\\cdot\\sqrt{2}} = \\dfrac{1}{\\sqrt{2}}$.`, why:`Plug into the cosine formula.`},
        {do:`$\\theta = 45^\\circ$.`, why:`$\\cos 45^\\circ = 1/\\sqrt{2}$.`}
      ],
      answer:`$\\theta = 45^\\circ$` },

    { q:`<p>Use $\\lVert x\\rVert^2 = x^\\top x$ to find the length of $x=[2,3,6]$.</p>`,
      steps:[
        {do:`Dot $x$ with itself: $2\\times2 + 3\\times3 + 6\\times6 = 4+9+36$.`, why:`A vector dotted with itself sums the squares.`},
        {do:`$4+9+36 = 49$, so $\\lVert x\\rVert^2 = 49$.`, why:`That sum is the squared length.`},
        {do:`$\\lVert x\\rVert = \\sqrt{49} = 7$.`, why:`Take the square root for the length.`}
      ],
      answer:`$\\lVert x\\rVert = 7$` },

    { q:`<p>For what $k$ is $[k,2,1]$ perpendicular to $[3,k,-5]$?</p>`,
      steps:[
        {do:`Dot product: $k\\times3 + 2\\times k + 1\\times(-5) = 3k+2k-5$.`, why:`Multiply matching entries and add.`},
        {do:`Combine: $5k - 5$.`, why:`Add the like terms.`},
        {do:`Set $5k-5 = 0$, so $5k = 5$.`, why:`Perpendicular means dot product $0$.`},
        {do:`$k = 1$.`, why:`Divide both sides by $5$.`}
      ],
      answer:`$k = 1$` },

    { q:`<p>Expand $\\lVert x+y\\rVert^2 = (x+y)^\\top(x+y)$ in terms of $\\lVert x\\rVert^2$, $\\lVert y\\rVert^2$, and $x^\\top y$.</p>`,
      steps:[
        {do:`Expand: $(x+y)^\\top(x+y) = x^\\top x + x^\\top y + y^\\top x + y^\\top y$.`, why:`The dot product distributes like FOIL.`},
        {do:`Note $x^\\top y = y^\\top x$.`, why:`The dot product is symmetric.`},
        {do:`Combine: $\\lVert x\\rVert^2 + 2\\,x^\\top y + \\lVert y\\rVert^2$.`, why:`The two cross terms merge into $2x^\\top y$.`}
      ],
      answer:`$\\lVert x\\rVert^2 + 2\\,x^\\top y + \\lVert y\\rVert^2$` },

    { q:`<p>If $\\lVert x\\rVert = 3$, $\\lVert y\\rVert = 4$, and $x^\\top y = 0$, find $\\lVert x+y\\rVert$.</p>`,
      steps:[
        {do:`Use $\\lVert x+y\\rVert^2 = \\lVert x\\rVert^2 + 2x^\\top y + \\lVert y\\rVert^2$.`, why:`The expansion from the previous identity.`},
        {do:`Substitute: $9 + 2\\times0 + 16 = 25$.`, why:`The cross term vanishes because $x^\\top y=0$.`},
        {do:`$\\lVert x+y\\rVert = \\sqrt{25} = 5$.`, why:`Perpendicular vectors obey Pythagoras.`}
      ],
      answer:`$\\lVert x+y\\rVert = 5$` },

    { q:`<p>A model scores $s = w^\\top x + b$ with $w=[2,-1,0.5]$, $x=[3,4,8]$, bias $b=-1$. Find $s$.</p>`,
      steps:[
        {do:`$2\\times3 = 6$.`, why:`First weight times its feature.`},
        {do:`$(-1)\\times4 = -4$ and $0.5\\times8 = 4$.`, why:`The remaining weighted features.`},
        {do:`$6-4+4 = 6$ is the dot product.`, why:`Sum the products.`},
        {do:`Add bias: $6 + (-1) = 5$.`, why:`The bias shifts the score.`}
      ],
      answer:`$s = 5$` },

    { q:`<p>Two unit vectors satisfy $x^\\top y = -1$. What is the angle between them?</p>`,
      steps:[
        {do:`For unit vectors $\\cos\\theta = x^\\top y = -1$.`, why:`Norms are $1$, so the cosine equals the dot product.`},
        {do:`$\\cos\\theta = -1$ means $\\theta = 180^\\circ$.`, why:`They point in exactly opposite directions.`}
      ],
      answer:`$\\theta = 180^\\circ$ (opposite)` },

    { q:`<p>Find the scalar projection of $x=[4,3]$ onto $u=[1,0]$ using $\\dfrac{x^\\top u}{\\lVert u\\rVert}$.</p>`,
      steps:[
        {do:`Dot: $x^\\top u = 4\\times1 + 3\\times0 = 4$.`, why:`Multiply matching entries and add.`},
        {do:`$\\lVert u\\rVert = \\sqrt{1^2+0^2} = 1$.`, why:`$u$ is already a unit vector.`},
        {do:`Scalar projection $= 4/1 = 4$.`, why:`This is how far $x$ reaches along $u$'s direction.`}
      ],
      answer:`$4$` },

    { q:`<p>Cosine similarity of $x=[3,4]$ and $y=[4,3]$. Round to two decimals.</p>`,
      steps:[
        {do:`Dot: $3\\times4 + 4\\times3 = 12+12 = 24$.`, why:`Multiply matching entries and add.`},
        {do:`Norms: $\\lVert x\\rVert = \\sqrt{25} = 5$, $\\lVert y\\rVert = \\sqrt{25} = 5$.`, why:`Both have squared length $9+16=25$.`},
        {do:`$\\cos\\theta = \\dfrac{24}{5\\times5} = \\dfrac{24}{25} = 0.96$.`, why:`Divide the dot product by the product of norms.`}
      ],
      answer:`$\\cos\\theta = 0.96$` },

    { q:`<p>A prediction uses $w=[1,2,-1,3]$ and $x=[2,0,5,1]$. Compute $w^\\top x$ in 4-D.</p>`,
      steps:[
        {do:`$1\\times2 = 2$ and $2\\times0 = 0$.`, why:`First two products.`},
        {do:`$(-1)\\times5 = -5$ and $3\\times1 = 3$.`, why:`Last two products.`},
        {do:`$2+0-5+3 = 0$.`, why:`Sum all four products.`}
      ],
      answer:`$w^\\top x = 0$` },

    { q:`<p>Given $\\lVert x\\rVert = 5$, $\\lVert y\\rVert = 5$, and the angle between them is $60^\\circ$, find $x^\\top y$.</p>`,
      steps:[
        {do:`Use $x^\\top y = \\lVert x\\rVert\\,\\lVert y\\rVert\\cos\\theta$.`, why:`The geometric form of the dot product.`},
        {do:`$\\cos 60^\\circ = 0.5$.`, why:`A standard angle value.`},
        {do:`$x^\\top y = 5\\times5\\times0.5 = 12.5$.`, why:`Multiply the magnitudes and the cosine.`}
      ],
      answer:`$x^\\top y = 12.5$` }
  ]);

  /* ---------------- fnd-matrix ---------------- */
  add("fnd-matrix", [
    { q:`<p>Find $A^\\top$ for $A=\\begin{bmatrix}1&2\\\\3&4\\\\5&6\\end{bmatrix}$ and state its new shape.</p>`,
      steps:[
        {do:`Each row of $A$ becomes a column of $A^\\top$. Row $[1,2]\\to$ column 1.`, why:`The transpose swaps rows and columns.`},
        {do:`Rows $[3,4]$ and $[5,6]$ become columns 2 and 3.`, why:`Continue for every row.`},
        {do:`$A^\\top=\\begin{bmatrix}1&3&5\\\\2&4&6\\end{bmatrix}$, shape $2\\times3$.`, why:`A $3\\times2$ matrix transposes to $2\\times3$.`}
      ],
      answer:`$A^\\top=\\begin{bmatrix}1&3&5\\\\2&4&6\\end{bmatrix}$, $2\\times3$` },

    { q:`<p>Compute $2A - B$ for $A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$, $B=\\begin{bmatrix}5&0\\\\1&8\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Scale: $2A = \\begin{bmatrix}2&4\\\\6&8\\end{bmatrix}$.`, why:`Multiply every entry of $A$ by $2$.`},
        {do:`Subtract cell by cell: $\\begin{bmatrix}2-5&4-0\\\\6-1&8-8\\end{bmatrix}$.`, why:`Matrices subtract entry by entry.`},
        {do:`Finish: $\\begin{bmatrix}-3&4\\\\5&0\\end{bmatrix}$.`, why:`Complete each cell.`}
      ],
      answer:`$2A-B=\\begin{bmatrix}-3&4\\\\5&0\\end{bmatrix}$` },

    { q:`<p>A symmetric matrix satisfies $A = A^\\top$. Is $A=\\begin{bmatrix}1&5&2\\\\5&3&7\\\\2&7&9\\end{bmatrix}$ symmetric?</p>`,
      steps:[
        {do:`Check $A_{1,2}$ vs $A_{2,1}$: both $5$.`, why:`Symmetric means mirror entries across the diagonal match.`},
        {do:`Check $A_{1,3}=2=A_{3,1}$ and $A_{2,3}=7=A_{3,2}$.`, why:`Every off-diagonal pair must agree.`},
        {do:`All mirror pairs match, so $A=A^\\top$.`, why:`The matrix equals its own transpose.`}
      ],
      answer:`Yes, it is symmetric.` },

    { q:`<p>Multiply $A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$ by $B=\\begin{bmatrix}5&6\\\\7&8\\end{bmatrix}$ to get $AB$.</p>`,
      steps:[
        {do:`Entry $(1,1)$: row 1 of $A$ dot column 1 of $B$ $= 1\\times5+2\\times7 = 19$.`, why:`Each output cell is a row-times-column dot product.`},
        {do:`Entry $(1,2)$: $1\\times6+2\\times8 = 22$.`, why:`Row 1 of $A$ with column 2 of $B$.`},
        {do:`Entry $(2,1)$: $3\\times5+4\\times7 = 43$; entry $(2,2)$: $3\\times6+4\\times8 = 50$.`, why:`Row 2 of $A$ with each column of $B$.`}
      ],
      answer:`$AB=\\begin{bmatrix}19&22\\\\43&50\\end{bmatrix}$` },

    { q:`<p>Can you multiply $A$ ($2\\times3$) by $B$ ($3\\times4$)? If so, what is the shape of $AB$?</p>`,
      steps:[
        {do:`Compare inner dimensions: columns of $A = 3$, rows of $B = 3$. They match.`, why:`The inner dimensions must be equal to multiply.`},
        {do:`The result keeps the outer dimensions: $2\\times4$.`, why:`$(2\\times3)(3\\times4)$ gives a $2\\times4$ matrix.`}
      ],
      answer:`Yes, $AB$ is $2\\times4$` },

    { q:`<p>Show matrix multiplication is not commutative: compute $AB$ and $BA$ for $A=\\begin{bmatrix}0&1\\\\0&0\\end{bmatrix}$, $B=\\begin{bmatrix}0&0\\\\1&0\\end{bmatrix}$.</p>`,
      steps:[
        {do:`$AB$: entry $(1,1)=0\\times0+1\\times1=1$, all others $0$. So $AB=\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix}$.`, why:`Row-times-column for each cell.`},
        {do:`$BA$: row 2 of $B$ is $[1,0]$, column 2 of $A$ is $[1,0]$, giving entry $(2,2)=1$; others $0$. So $BA=\\begin{bmatrix}0&0\\\\0&1\\end{bmatrix}$.`, why:`Swap the order and recompute.`},
        {do:`$AB \\ne BA$.`, why:`Order matters in matrix multiplication.`}
      ],
      answer:`$AB=\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix}\\ne BA=\\begin{bmatrix}0&0\\\\0&1\\end{bmatrix}$` },

    { q:`<p>Find the trace (sum of diagonal entries) of $A=\\begin{bmatrix}4&1&0\\\\2&5&3\\\\1&0&6\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Diagonal entries: $A_{1,1}=4$, $A_{2,2}=5$, $A_{3,3}=6$.`, why:`The trace uses entries where row index equals column index.`},
        {do:`Add them: $4+5+6 = 15$.`, why:`The trace is the sum of those diagonal values.`}
      ],
      answer:`trace $= 15$` },

    { q:`<p>Compute the determinant of $A=\\begin{bmatrix}3&8\\\\4&6\\end{bmatrix}$ using $ad-bc$.</p>`,
      steps:[
        {do:`Identify $a=3$, $b=8$, $c=4$, $d=6$.`, why:`Label the four entries.`},
        {do:`$ad = 3\\times6 = 18$ and $bc = 8\\times4 = 32$.`, why:`Multiply the diagonal pairs.`},
        {do:`$\\det = 18 - 32 = -14$.`, why:`The $2\\times2$ determinant is $ad-bc$.`}
      ],
      answer:`$\\det A = -14$` },

    { q:`<p>A matrix is invertible only if its determinant is nonzero. Is $A=\\begin{bmatrix}2&4\\\\1&2\\end{bmatrix}$ invertible?</p>`,
      steps:[
        {do:`$\\det = 2\\times2 - 4\\times1 = 4 - 4 = 0$.`, why:`Compute $ad-bc$.`},
        {do:`The determinant is $0$, so $A$ is not invertible.`, why:`A zero determinant means the rows are linearly dependent.`}
      ],
      answer:`No, $\\det = 0$ (not invertible).` },

    { q:`<p>Multiply $A=\\begin{bmatrix}1&0&2\\\\0&1&3\\end{bmatrix}$ by $B=\\begin{bmatrix}1&0\\\\2&1\\\\0&1\\end{bmatrix}$ to get the $2\\times2$ product $AB$.</p>`,
      steps:[
        {do:`$(1,1)$: $1\\times1+0\\times2+2\\times0 = 1$.`, why:`Row 1 of $A$ dot column 1 of $B$.`},
        {do:`$(1,2)$: $1\\times0+0\\times1+2\\times1 = 2$.`, why:`Row 1 of $A$ dot column 2 of $B$.`},
        {do:`$(2,1)$: $0\\times1+1\\times2+3\\times0 = 2$; $(2,2)$: $0\\times0+1\\times1+3\\times1 = 4$.`, why:`Row 2 of $A$ dot each column of $B$.`}
      ],
      answer:`$AB=\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}$` },

    { q:`<p>Using $(AB)^\\top = B^\\top A^\\top$, if $A$ is $2\\times3$ and $B$ is $3\\times5$, what is the shape of $(AB)^\\top$?</p>`,
      steps:[
        {do:`$AB$ is $2\\times5$.`, why:`Inner $3$s cancel, outer dims give $2\\times5$.`},
        {do:`Transposing flips the shape to $5\\times2$.`, why:`The transpose swaps rows and columns.`}
      ],
      answer:`$(AB)^\\top$ is $5\\times2$` }
  ]);

  /* ---------------- fnd-matvec ---------------- */
  add("fnd-matvec", [
    { q:`<p>Compute $Ax$ for the $3\\times3$ matrix $A=\\begin{bmatrix}1&2&0\\\\0&1&2\\\\2&0&1\\end{bmatrix}$, $x=\\begin{bmatrix}1\\\\2\\\\3\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Row 1: $1\\times1+2\\times2+0\\times3 = 1+4+0 = 5$.`, why:`Dot row 1 with $x$.`},
        {do:`Row 2: $0\\times1+1\\times2+2\\times3 = 0+2+6 = 8$.`, why:`Dot row 2 with $x$.`},
        {do:`Row 3: $2\\times1+0\\times2+1\\times3 = 2+0+3 = 5$.`, why:`Dot row 3 with $x$.`}
      ],
      answer:`$Ax=\\begin{bmatrix}5\\\\8\\\\5\\end{bmatrix}$` },

    { q:`<p>A rotation by $90^\\circ$ uses $R=\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}$. Where does $x=\\begin{bmatrix}3\\\\0\\end{bmatrix}$ go?</p>`,
      steps:[
        {do:`Row 1: $0\\times3 + (-1)\\times0 = 0$.`, why:`Dot the first row with $x$.`},
        {do:`Row 2: $1\\times3 + 0\\times0 = 3$.`, why:`Dot the second row with $x$.`},
        {do:`So $Rx = [0,3]$ — the point rotated up onto the $y$-axis.`, why:`A $90^\\circ$ turn sends the $x$-axis to the $y$-axis.`}
      ],
      answer:`$Rx=\\begin{bmatrix}0\\\\3\\end{bmatrix}$` },

    { q:`<p>Apply two layers: first $A=\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}$ then $B=\\begin{bmatrix}2&0\\\\0&2\\end{bmatrix}$ to $x=\\begin{bmatrix}1\\\\2\\end{bmatrix}$. Compute $B(Ax)$.</p>`,
      steps:[
        {do:`$Ax$: row 1 $=1\\times1+1\\times2=3$; row 2 $=0\\times1+1\\times2=2$. So $Ax=[3,2]$.`, why:`Apply the first layer.`},
        {do:`$B(Ax)$: row 1 $=2\\times3+0\\times2=6$; row 2 $=0\\times3+2\\times2=4$.`, why:`Feed the result through the second layer.`},
        {do:`Result $[6,4]$.`, why:`Layers compose by applying one after another.`}
      ],
      answer:`$B(Ax)=\\begin{bmatrix}6\\\\4\\end{bmatrix}$` },

    { q:`<p>Solve $Ax=b$ for $x$: $A=\\begin{bmatrix}2&0\\\\0&5\\end{bmatrix}$, $b=\\begin{bmatrix}6\\\\20\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Row 1 says $2x_1 = 6$, so $x_1 = 3$.`, why:`The diagonal decouples the equations.`},
        {do:`Row 2 says $5x_2 = 20$, so $x_2 = 4$.`, why:`Solve each row independently.`},
        {do:`So $x=[3,4]$.`, why:`A diagonal system inverts entry by entry.`}
      ],
      answer:`$x=\\begin{bmatrix}3\\\\4\\end{bmatrix}$` },

    { q:`<p>Verify that $z=\\begin{bmatrix}1\\\\1\\end{bmatrix}$ satisfies $Az=2z$ for $A=\\begin{bmatrix}1&1\\\\1&1\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Row 1: $1\\times1+1\\times1 = 2$; row 2: $1\\times1+1\\times1 = 2$. So $Az=[2,2]$.`, why:`Compute $Az$ by dotting each row with $z$.`},
        {do:`$2z = 2[1,1] = [2,2]$.`, why:`Scale $z$ by $2$.`},
        {do:`They match, so $Az = 2z$.`, why:`$z$ behaves as an eigenvector with stretch $2$.`}
      ],
      answer:`Yes, $Az=2z=\\begin{bmatrix}2\\\\2\\end{bmatrix}$` },

    { q:`<p>Score a batch: $A=\\begin{bmatrix}2&1\\\\1&3\\\\0&4\\end{bmatrix}$ (3 examples, 2 features) with weights $x=\\begin{bmatrix}5\\\\2\\end{bmatrix}$. Find all three scores.</p>`,
      steps:[
        {do:`Row 1: $2\\times5+1\\times2 = 10+2 = 12$.`, why:`Score the first example.`},
        {do:`Row 2: $1\\times5+3\\times2 = 5+6 = 11$.`, why:`Score the second example.`},
        {do:`Row 3: $0\\times5+4\\times2 = 0+8 = 8$.`, why:`Score the third example.`}
      ],
      answer:`$Ax=\\begin{bmatrix}12\\\\11\\\\8\\end{bmatrix}$` },

    { q:`<p>Compute $Ax$ where $A=\\begin{bmatrix}1&-1&1\\end{bmatrix}$ ($1\\times3$) and $x=\\begin{bmatrix}4\\\\2\\\\7\\end{bmatrix}$.</p>`,
      steps:[
        {do:`There is one row: $1\\times4 + (-1)\\times2 + 1\\times7$.`, why:`A $1\\times3$ times a $3\\times1$ gives a single number.`},
        {do:`$4 - 2 + 7 = 9$.`, why:`Add the products.`}
      ],
      answer:`$Ax = [9]$` },

    { q:`<p>A shear $S=\\begin{bmatrix}1&2\\\\0&1\\end{bmatrix}$ acts on the grid point $x=\\begin{bmatrix}3\\\\4\\end{bmatrix}$. Where does it land?</p>`,
      steps:[
        {do:`Row 1: $1\\times3 + 2\\times4 = 3+8 = 11$.`, why:`The shear shifts $x_1$ by $2x_2$.`},
        {do:`Row 2: $0\\times3 + 1\\times4 = 4$.`, why:`The second coordinate is unchanged.`},
        {do:`Result $[11,4]$.`, why:`A shear slides points horizontally based on height.`}
      ],
      answer:`$Sx=\\begin{bmatrix}11\\\\4\\end{bmatrix}$` },

    { q:`<p>For $A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$ compute $A(x+y)$ with $x=[1,0]$, $y=[0,1]$, and confirm it equals $Ax+Ay$.</p>`,
      steps:[
        {do:`$x+y = [1,1]$. $A[1,1]$: row 1 $=1+2=3$, row 2 $=3+4=7$. So $[3,7]$.`, why:`Add first, then multiply.`},
        {do:`$Ax = [1,3]$ (first column), $Ay = [2,4]$ (second column).`, why:`$A$ times a basis vector picks out a column.`},
        {do:`$Ax+Ay = [1+2,\\;3+4] = [3,7]$.`, why:`Matrix-vector multiply is linear: it distributes over addition.`}
      ],
      answer:`$A(x+y)=Ax+Ay=\\begin{bmatrix}3\\\\7\\end{bmatrix}$` },

    { q:`<p>For $A$ ($m\\times n$), $Ax$ has length $m$. If $A$ is $7\\times4$ and we then apply $B$ ($2\\times7$), what is the length of $B(Ax)$?</p>`,
      steps:[
        {do:`$Ax$ has length $7$ (the row count of $A$).`, why:`$(7\\times4)$ times a length-$4$ vector gives length $7$.`},
        {do:`$B(Ax)$: $B$ is $2\\times7$ times a length-$7$ vector, giving length $2$.`, why:`Inner $7$s cancel, leaving the row count $2$.`}
      ],
      answer:`Length $2$` }
  ]);

  /* ---------------- fnd-norm ---------------- */
  add("fnd-norm", [
    { q:`<p>Find the L2 norm of the 3-D vector $x=[2,3,6]$.</p>`,
      steps:[
        {do:`Square: $2^2=4$, $3^2=9$, $6^2=36$.`, why:`L2 squares every entry.`},
        {do:`Add: $4+9+36 = 49$.`, why:`Sum the squares under the root.`},
        {do:`$\\sqrt{49} = 7$.`, why:`Take the square root.`}
      ],
      answer:`$\\lVert x\\rVert_2 = 7$` },

    { q:`<p>Normalize $x=[3,4]$ to a unit vector (divide by its L2 norm).</p>`,
      steps:[
        {do:`Norm: $\\lVert x\\rVert = \\sqrt{9+16} = 5$.`, why:`Compute the length first.`},
        {do:`Divide each entry by $5$: $[3/5,\\;4/5] = [0.6,0.8]$.`, why:`Scaling by $1/\\lVert x\\rVert$ gives length $1$.`},
        {do:`Check: $0.6^2+0.8^2 = 0.36+0.64 = 1$. ✓`, why:`Confirm the normalized vector has norm $1$.`}
      ],
      answer:`$\\hat{x}=[0.6,0.8]$` },

    { q:`<p>Compare the L1 and L2 norms of $x=[1,1,1,1]$. Which is larger?</p>`,
      steps:[
        {do:`L1: $|1|+|1|+|1|+|1| = 4$.`, why:`Add absolute values for L1.`},
        {do:`L2: $\\sqrt{1+1+1+1} = \\sqrt{4} = 2$.`, why:`Square, sum, root for L2.`},
        {do:`$4 &gt; 2$, so L1 is larger here.`, why:`L1 is at least L2 for any vector.`}
      ],
      answer:`L1 $=4$, L2 $=2$; L1 larger` },

    { q:`<p>Find the L2 distance between the 3-D points $x=[1,2,3]$ and $y=[4,6,3]$.</p>`,
      steps:[
        {do:`Difference: $x-y = [-3,-4,0]$.`, why:`Distance is the norm of the difference.`},
        {do:`Square and add: $9+16+0 = 25$.`, why:`Apply L2 to the difference.`},
        {do:`$\\sqrt{25} = 5$.`, why:`Take the root for the distance.`}
      ],
      answer:`$\\lVert x-y\\rVert_2 = 5$` },

    { q:`<p>The L-infinity norm $\\lVert x\\rVert_\\infty$ is the largest absolute entry. Find L1, L2, and L-inf of $x=[3,-4,0]$.</p>`,
      steps:[
        {do:`L1: $3+4+0 = 7$.`, why:`Sum of absolute values.`},
        {do:`L2: $\\sqrt{9+16+0} = \\sqrt{25} = 5$.`, why:`Square, sum, root.`},
        {do:`L-inf: $\\max(3,4,0) = 4$.`, why:`The biggest absolute entry.`}
      ],
      answer:`L1 $=7$, L2 $=5$, L-inf $=4$` },

    { q:`<p>If $\\lVert x\\rVert_2 = 5$, what is $\\lVert 3x\\rVert_2$?</p>`,
      steps:[
        {do:`Scaling pulls out: $\\lVert 3x\\rVert_2 = |3|\\,\\lVert x\\rVert_2$.`, why:`Norms are absolutely homogeneous.`},
        {do:`$3\\times5 = 15$.`, why:`Multiply the scalar size by the original norm.`}
      ],
      answer:`$\\lVert 3x\\rVert_2 = 15$` },

    { q:`<p>For $x=[a,a,a]$, the L2 norm equals $6$. Find the positive $a$.</p>`,
      steps:[
        {do:`Norm squared: $a^2+a^2+a^2 = 3a^2$.`, why:`Square and add the three equal entries.`},
        {do:`Set $\\sqrt{3a^2} = 6$, so $3a^2 = 36$.`, why:`Square both sides.`},
        {do:`$a^2 = 12$, so $a = \\sqrt{12} = 2\\sqrt{3}$.`, why:`Solve for the positive root.`}
      ],
      answer:`$a = 2\\sqrt{3}$` },

    { q:`<p>Ridge regularization adds $\\lVert w\\rVert_2^2$ (squared L2). For $w=[1,-2,2,4]$, compute it.</p>`,
      steps:[
        {do:`Square each entry: $1, 4, 4, 16$.`, why:`The squared L2 norm sums the squares (no root).`},
        {do:`Add: $1+4+4+16 = 25$.`, why:`This is the Ridge penalty term.`}
      ],
      answer:`$\\lVert w\\rVert_2^2 = 25$` },

    { q:`<p>The triangle inequality says $\\lVert x+y\\rVert \\le \\lVert x\\rVert + \\lVert y\\rVert$. Check it for $x=[3,0]$, $y=[0,4]$.</p>`,
      steps:[
        {do:`$\\lVert x\\rVert = 3$, $\\lVert y\\rVert = 4$, so the right side is $7$.`, why:`Add the two individual lengths.`},
        {do:`$x+y = [3,4]$, $\\lVert x+y\\rVert = \\sqrt{9+16} = 5$.`, why:`Compute the norm of the sum.`},
        {do:`$5 \\le 7$. ✓`, why:`The combined length never exceeds the sum of lengths.`}
      ],
      answer:`$5 \\le 7$, inequality holds` },

    { q:`<p>LASSO uses the L1 norm. Both $w_A=[3,0,0]$ and $w_B=[1,1,1]$ have L1 $=3$. Compare their L2 norms.</p>`,
      steps:[
        {do:`L1 check: $w_A: 3+0+0=3$; $w_B: 1+1+1=3$. Equal.`, why:`Both spend the same L1 budget.`},
        {do:`L2: $w_A=\\sqrt{9+0+0}=3$; $w_B=\\sqrt{1+1+1}=\\sqrt{3}\\approx1.73$.`, why:`Square, sum, root for each.`},
        {do:`$w_A$ has larger L2; L1 ties don't penalize the sparse $w_A$, so LASSO tolerates zeros.`, why:`L1's geometry pushes solutions onto axes where entries hit zero.`}
      ],
      answer:`$w_A$ L2 $=3$, $w_B$ L2 $=\\sqrt{3}$; L1 allows sparsity.` },

    { q:`<p>Find the unit vector pointing from $x=[1,1]$ toward $y=[4,5]$.</p>`,
      steps:[
        {do:`Direction: $y-x = [3,4]$.`, why:`Subtract to get the vector pointing from $x$ to $y$.`},
        {do:`Its norm: $\\sqrt{9+16} = 5$.`, why:`Compute the length of the direction.`},
        {do:`Divide: $[3/5,\\;4/5] = [0.6,0.8]$.`, why:`Normalizing gives a length-$1$ direction.`}
      ],
      answer:`$[0.6,0.8]$` }
  ]);

  /* ---------------- fnd-derivative ---------------- */
  add("fnd-derivative", [
    { q:`<p>For $f(x)=x^2+3x$, the derivative is $f'(x)=2x+3$. Find where the slope is zero.</p>`,
      steps:[
        {do:`Set $2x+3 = 0$.`, why:`A flat spot has slope zero.`},
        {do:`Solve: $2x = -3$, so $x = -1.5$.`, why:`This is the vertex (minimum) of the parabola.`}
      ],
      answer:`$x = -1.5$` },

    { q:`<p>Differentiate $f(x)=4x^3 - 2x^2 + 7$ using the power rule term by term.</p>`,
      steps:[
        {do:`$4x^3 \\to 4\\times3\\,x^2 = 12x^2$.`, why:`Power rule: bring down the exponent, drop it by one.`},
        {do:`$-2x^2 \\to -2\\times2\\,x = -4x$.`, why:`Same rule on the quadratic term.`},
        {do:`Constant $7 \\to 0$.`, why:`A constant has zero slope.`},
        {do:`Sum: $f'(x) = 12x^2 - 4x$.`, why:`Derivatives of summed terms add.`}
      ],
      answer:`$f'(x) = 12x^2 - 4x$` },

    { q:`<p>The product rule is $(uv)' = u'v + uv'$. Differentiate $f(x) = x^2(x+1)$.</p>`,
      steps:[
        {do:`Let $u=x^2$, $v=x+1$. Then $u'=2x$, $v'=1$.`, why:`Identify the two factors and their slopes.`},
        {do:`Apply: $2x(x+1) + x^2(1)$.`, why:`Plug into $u'v+uv'$.`},
        {do:`Expand: $2x^2+2x + x^2 = 3x^2+2x$.`, why:`Simplify the sum.`}
      ],
      answer:`$f'(x) = 3x^2 + 2x$` },

    { q:`<p>The exponential $f(x)=e^x$ is its own derivative. Find the slope of $f(x)=e^x$ at $x=0$.</p>`,
      steps:[
        {do:`$f'(x) = e^x$.`, why:`The exponential's slope equals itself.`},
        {do:`At $x=0$: $e^0 = 1$.`, why:`Anything to the power $0$ is $1$.`}
      ],
      answer:`$f'(0) = 1$` },

    { q:`<p>The sigmoid $\\sigma(x) = \\dfrac{1}{1+e^{-x}}$ has derivative $\\sigma'(x) = \\sigma(x)(1-\\sigma(x))$. Where $\\sigma(x) = 0.5$, find the slope.</p>`,
      steps:[
        {do:`Plug $\\sigma = 0.5$ into $\\sigma(1-\\sigma)$.`, why:`Use the given derivative formula.`},
        {do:`$0.5\\times(1-0.5) = 0.5\\times0.5 = 0.25$.`, why:`The sigmoid is steepest at its center.`}
      ],
      answer:`$\\sigma'(x) = 0.25$` },

    { q:`<p>A second derivative is the derivative of the derivative. For $f(x)=x^3$, find $f''(x)$.</p>`,
      steps:[
        {do:`First: $f'(x) = 3x^2$.`, why:`Power rule on $x^3$.`},
        {do:`Differentiate again: $3\\times2\\,x = 6x$.`, why:`Power rule on $3x^2$.`}
      ],
      answer:`$f''(x) = 6x$` },

    { q:`<p>Use the limit definition $\\lim_{h\\to0}\\dfrac{f(x+h)-f(x)}{h}$ to find $f'(x)$ for $f(x)=x^2$.</p>`,
      steps:[
        {do:`$f(x+h) = (x+h)^2 = x^2 + 2xh + h^2$.`, why:`Expand the shifted input.`},
        {do:`Numerator: $(x^2+2xh+h^2) - x^2 = 2xh + h^2$.`, why:`Subtract $f(x)$.`},
        {do:`Divide by $h$: $\\dfrac{2xh+h^2}{h} = 2x + h$.`, why:`Cancel one $h$.`},
        {do:`Let $h\\to0$: $2x$.`, why:`The leftover $h$ vanishes, leaving the exact slope.`}
      ],
      answer:`$f'(x) = 2x$` },

    { q:`<p>The loss $E(w) = w^2 - 6w + 5$ has $E'(w) = 2w - 6$. Find the minimizing $w$ and the minimum loss.</p>`,
      steps:[
        {do:`Set $2w-6 = 0$, so $w = 3$.`, why:`The minimum sits where the slope is zero.`},
        {do:`Plug back: $E(3) = 9 - 18 + 5 = -4$.`, why:`Evaluate the loss at the minimizer.`}
      ],
      answer:`$w=3$, minimum loss $-4$` },

    { q:`<p>ReLU is $f(x)=\\max(0,x)$. What is its slope for $x&gt;0$, and for $x&lt;0$?</p>`,
      steps:[
        {do:`For $x&gt;0$: $f(x)=x$, so slope $=1$.`, why:`On the positive side ReLU is the line $y=x$.`},
        {do:`For $x&lt;0$: $f(x)=0$, so slope $=0$.`, why:`On the negative side ReLU is flat at zero.`}
      ],
      answer:`Slope $1$ if $x&gt;0$, slope $0$ if $x&lt;0$` },

    { q:`<p>Take one gradient-descent step on $E(w)=(w-4)^2$ from $w=1$ with learning rate $\\eta=0.1$. $E'(w)=2(w-4)$.</p>`,
      steps:[
        {do:`Slope at $w=1$: $2(1-4) = -6$.`, why:`Evaluate the derivative at the current point.`},
        {do:`Update: $w \\leftarrow w - \\eta\\,E'(w) = 1 - 0.1\\times(-6)$.`, why:`Step opposite the slope, scaled by the learning rate.`},
        {do:`$1 + 0.6 = 1.6$.`, why:`The new point moves toward the minimum at $w=4$.`}
      ],
      answer:`$w = 1.6$` }
  ]);

  /* ---------------- fnd-gradient ---------------- */
  add("fnd-gradient", [
    { q:`<p>For $f(x_1,x_2,x_3)=x_1^2+2x_2^2+3x_3^2$, find $\\nabla f$.</p>`,
      steps:[
        {do:`$\\frac{\\partial f}{\\partial x_1} = 2x_1$.`, why:`Differentiate $x_1^2$, hold the others fixed.`},
        {do:`$\\frac{\\partial f}{\\partial x_2} = 4x_2$.`, why:`The $2x_2^2$ term gives $4x_2$.`},
        {do:`$\\frac{\\partial f}{\\partial x_3} = 6x_3$.`, why:`The $3x_3^2$ term gives $6x_3$.`},
        {do:`Stack: $\\nabla f = [2x_1,\\;4x_2,\\;6x_3]$.`, why:`Collect the partials into one vector.`}
      ],
      answer:`$\\nabla f = [2x_1,\\,4x_2,\\,6x_3]$` },

    { q:`<p>For $f(x_1,x_2) = x_1^2 x_2$, find $\\nabla f$ at $(2,3)$.</p>`,
      steps:[
        {do:`$\\frac{\\partial f}{\\partial x_1} = 2x_1 x_2$; at $(2,3)$: $2\\times2\\times3 = 12$.`, why:`Treat $x_2$ as a constant multiplier.`},
        {do:`$\\frac{\\partial f}{\\partial x_2} = x_1^2$; at $(2,3)$: $2^2 = 4$.`, why:`Treat $x_1^2$ as a constant coefficient on $x_2$.`},
        {do:`So $\\nabla f(2,3) = [12,4]$.`, why:`Stack the two partials.`}
      ],
      answer:`$\\nabla f(2,3) = [12,4]$` },

    { q:`<p>The squared error $f(w_1,w_2) = (w_1 + 2w_2 - 5)^2$. Find $\\nabla f$ at $(1,1)$ via the chain rule.</p>`,
      steps:[
        {do:`Inner $g = w_1+2w_2-5$; at $(1,1)$: $1+2-5 = -2$.`, why:`Evaluate the inside first.`},
        {do:`$\\frac{\\partial f}{\\partial w_1} = 2g\\times1 = 2(-2) = -4$.`, why:`Chain rule: outer $2g$ times inner slope $1$.`},
        {do:`$\\frac{\\partial f}{\\partial w_2} = 2g\\times2 = 2(-2)\\times2 = -8$.`, why:`Inner slope in $w_2$ is $2$.`},
        {do:`$\\nabla f(1,1) = [-4,-8]$.`, why:`Stack the partials.`}
      ],
      answer:`$\\nabla f(1,1) = [-4,-8]$` },

    { q:`<p>For $f(x)=x^\\top x = x_1^2 + x_2^2 + x_3^2$, show $\\nabla f = 2x$ and evaluate at $x=[1,-2,3]$.</p>`,
      steps:[
        {do:`Each partial: $\\frac{\\partial f}{\\partial x_i} = 2x_i$.`, why:`Differentiate $x_i^2$ in each slot.`},
        {do:`So $\\nabla f = [2x_1,2x_2,2x_3] = 2x$.`, why:`The gradient of $x^\\top x$ is $2x$.`},
        {do:`At $[1,-2,3]$: $2[1,-2,3] = [2,-4,6]$.`, why:`Double every entry.`}
      ],
      answer:`$\\nabla f = 2x = [2,-4,6]$` },

    { q:`<p>Take two gradient-descent steps on $f(x_1,x_2)=x_1^2+x_2^2$ from $[2,2]$ with step size $0.25$. ($\\nabla f = [2x_1,2x_2]$.)</p>`,
      steps:[
        {do:`Step 1 gradient $[4,4]$. Update: $[2,2] - 0.25[4,4] = [1,1]$.`, why:`Move against the gradient by the step size.`},
        {do:`Step 2 gradient at $[1,1]$ is $[2,2]$. Update: $[1,1] - 0.25[2,2] = [0.5,0.5]$.`, why:`Repeat the update from the new point.`},
        {do:`After two steps: $[0.5,0.5]$, closer to the minimum $[0,0]$.`, why:`Each step shrinks the distance to the bowl's bottom.`}
      ],
      answer:`$[0.5,0.5]$` },

    { q:`<p>For $f(x_1,x_2)=e^{x_1}+x_1 x_2$, find $\\nabla f$.</p>`,
      steps:[
        {do:`$\\frac{\\partial f}{\\partial x_1} = e^{x_1} + x_2$.`, why:`$e^{x_1}$ differentiates to itself; $x_1 x_2$ gives $x_2$.`},
        {do:`$\\frac{\\partial f}{\\partial x_2} = x_1$.`, why:`$e^{x_1}$ is constant in $x_2$; $x_1 x_2$ gives $x_1$.`},
        {do:`Stack: $\\nabla f = [e^{x_1}+x_2,\\;x_1]$.`, why:`Collect the partials.`}
      ],
      answer:`$\\nabla f = [e^{x_1}+x_2,\\;x_1]$` },

    { q:`<p>The directional derivative along unit vector $u$ is $\\nabla f \\cdot u$. With $\\nabla f = [3,4]$ and $u = [1,0]$, find it.</p>`,
      steps:[
        {do:`Dot: $\\nabla f \\cdot u = 3\\times1 + 4\\times0 = 3$.`, why:`The directional derivative is the gradient dotted with the direction.`},
        {do:`So moving along $u=[1,0]$ increases $f$ at rate $3$.`, why:`It measures the slope in that specific direction.`}
      ],
      answer:`$3$` },

    { q:`<p>The gradient's norm is the steepest rate of increase. For $\\nabla f = [6,8]$, find that maximum rate.</p>`,
      steps:[
        {do:`The fastest rate equals $\\lVert \\nabla f\\rVert$.`, why:`The steepest directional derivative is the gradient's length.`},
        {do:`$\\sqrt{6^2+8^2} = \\sqrt{36+64} = \\sqrt{100} = 10$.`, why:`Compute the L2 norm.`}
      ],
      answer:`Steepest rate $= 10$` },

    { q:`<p>For the linear-model loss $f(w) = \\tfrac{1}{2}(w^\\top x - y)^2$ with $x=[1,2]$, $y=3$, find $\\nabla_w f$ at $w=[1,1]$. ($\\nabla_w f = (w^\\top x - y)\\,x$.)</p>`,
      steps:[
        {do:`Prediction: $w^\\top x = 1\\times1 + 1\\times2 = 3$.`, why:`Dot the weights with the features.`},
        {do:`Residual: $w^\\top x - y = 3 - 3 = 0$.`, why:`The error between prediction and target.`},
        {do:`$\\nabla_w f = 0\\times x = [0,0]$.`, why:`A zero residual means zero gradient — the fit is perfect here.`}
      ],
      answer:`$\\nabla_w f = [0,0]$` },

    { q:`<p>For $f(x_1,x_2) = x_1^2 - x_2^2$ (a saddle), find $\\nabla f$ at $(0,0)$ and explain why it is not a minimum.</p>`,
      steps:[
        {do:`$\\frac{\\partial f}{\\partial x_1} = 2x_1 = 0$ at the origin.`, why:`Flat in the $x_1$ direction there.`},
        {do:`$\\frac{\\partial f}{\\partial x_2} = -2x_2 = 0$ at the origin.`, why:`Flat in the $x_2$ direction there.`},
        {do:`$\\nabla f(0,0) = [0,0]$, but $f$ rises along $x_1$ and falls along $x_2$.`, why:`A zero gradient marks a critical point, not necessarily a minimum — this is a saddle.`}
      ],
      answer:`$\\nabla f(0,0) = [0,0]$ (a saddle, not a minimum)` }
  ]);

  /* ---------------- fnd-chain ---------------- */
  add("fnd-chain", [
    { q:`<p>Let $u = x^2+1$ and $z = u^3$. Find $\\frac{dz}{dx}$.</p>`,
      steps:[
        {do:`Outer: $\\frac{dz}{du} = 3u^2$.`, why:`Differentiate $u^3$.`},
        {do:`Inner: $\\frac{du}{dx} = 2x$.`, why:`Differentiate $x^2+1$.`},
        {do:`Multiply: $3u^2\\cdot2x = 6x(x^2+1)^2$.`, why:`Chain rule, then substitute $u=x^2+1$.`}
      ],
      answer:`$\\frac{dz}{dx} = 6x(x^2+1)^2$` },

    { q:`<p>Differentiate $z = e^{3x}$ using the chain rule.</p>`,
      steps:[
        {do:`Let $u = 3x$, so $z = e^u$.`, why:`Name the inner function.`},
        {do:`$\\frac{dz}{du} = e^u$ and $\\frac{du}{dx} = 3$.`, why:`$e^u$ is its own derivative; $3x$ has slope $3$.`},
        {do:`Multiply: $e^u\\cdot3 = 3e^{3x}$.`, why:`Chain the slopes and substitute back.`}
      ],
      answer:`$\\frac{dz}{dx} = 3e^{3x}$` },

    { q:`<p>Four layers: $y=2x$, $u=y+1$, $v=u^2$, $z=3v$. Find $\\frac{dz}{dx}$ at $x=1$.</p>`,
      steps:[
        {do:`Local slopes: $\\frac{dy}{dx}=2$, $\\frac{du}{dy}=1$, $\\frac{dv}{du}=2u$, $\\frac{dz}{dv}=3$.`, why:`Differentiate each step on its own.`},
        {do:`At $x=1$: $y=2$, $u=3$, so $\\frac{dv}{du}=2\\times3=6$.`, why:`Evaluate the one slope that depends on the value.`},
        {do:`Multiply all: $3\\times6\\times1\\times2 = 36$.`, why:`The chain rule multiplies every local slope.`}
      ],
      answer:`$\\frac{dz}{dx} = 36$` },

    { q:`<p>The loss $L = (\\sigma(z) - y)^2$ where $\\sigma$ is the sigmoid, $\\sigma' = \\sigma(1-\\sigma)$. Find $\\frac{dL}{dz}$ when $\\sigma(z)=0.8$ and $y=1$.</p>`,
      steps:[
        {do:`Outer: $\\frac{dL}{d\\sigma} = 2(\\sigma - y) = 2(0.8-1) = -0.4$.`, why:`Differentiate the squared error in $\\sigma$.`},
        {do:`Inner: $\\sigma' = 0.8\\times(1-0.8) = 0.8\\times0.2 = 0.16$.`, why:`The sigmoid's slope at this point.`},
        {do:`Multiply: $-0.4\\times0.16 = -0.064$.`, why:`Chain rule combines the two slopes.`}
      ],
      answer:`$\\frac{dL}{dz} = -0.064$` },

    { q:`<p>Differentiate $z = \\sqrt{x^2+9}$ (i.e. $z=(x^2+9)^{1/2}$).</p>`,
      steps:[
        {do:`Let $u = x^2+9$, $z = u^{1/2}$.`, why:`Name the inside.`},
        {do:`$\\frac{dz}{du} = \\tfrac{1}{2}u^{-1/2} = \\dfrac{1}{2\\sqrt{u}}$, $\\frac{du}{dx} = 2x$.`, why:`Power rule on $u^{1/2}$ and on $x^2+9$.`},
        {do:`Multiply: $\\dfrac{1}{2\\sqrt{u}}\\cdot2x = \\dfrac{x}{\\sqrt{x^2+9}}$.`, why:`Chain and substitute $u=x^2+9$.`}
      ],
      answer:`$\\frac{dz}{dx} = \\dfrac{x}{\\sqrt{x^2+9}}$` },

    { q:`<p>Backprop through two weights: $a = w_1 x$, $b = w_2 a$, $L = b^2$. Find $\\frac{dL}{dw_1}$ in terms of $x, w_1, w_2$.</p>`,
      steps:[
        {do:`$\\frac{dL}{db} = 2b$, $\\frac{db}{da} = w_2$, $\\frac{da}{dw_1} = x$.`, why:`Local slope of each step toward $w_1$.`},
        {do:`Multiply: $2b\\,w_2\\,x$.`, why:`Chain rule along the path from $L$ to $w_1$.`},
        {do:`Substitute $b = w_2 a = w_2 w_1 x$: $2(w_2 w_1 x)w_2 x = 2w_1 w_2^2 x^2$.`, why:`Express everything in the base variables.`}
      ],
      answer:`$\\frac{dL}{dw_1} = 2w_1 w_2^2 x^2$` },

    { q:`<p>Let $z = \\ln(5x)$. Find $\\frac{dz}{dx}$. (Recall $\\frac{d}{du}\\ln u = \\frac{1}{u}$.)</p>`,
      steps:[
        {do:`Let $u = 5x$, $z = \\ln u$.`, why:`Name the inside.`},
        {do:`$\\frac{dz}{du} = \\dfrac{1}{u}$, $\\frac{du}{dx} = 5$.`, why:`Log derivative and inner slope.`},
        {do:`Multiply: $\\dfrac{1}{5x}\\cdot5 = \\dfrac{1}{x}$.`, why:`The constant $5$ cancels.`}
      ],
      answer:`$\\frac{dz}{dx} = \\dfrac{1}{x}$` },

    { q:`<p>Compute $\\frac{dz}{dx}$ for $z = (2x+1)^4$ at $x=0$.</p>`,
      steps:[
        {do:`Let $u = 2x+1$, $z = u^4$.`, why:`Name the inside.`},
        {do:`$\\frac{dz}{du} = 4u^3$, $\\frac{du}{dx} = 2$, so $\\frac{dz}{dx} = 8u^3 = 8(2x+1)^3$.`, why:`Chain the slopes.`},
        {do:`At $x=0$: $8(1)^3 = 8$.`, why:`Evaluate at the point.`}
      ],
      answer:`$\\frac{dz}{dx} = 8$` },

    { q:`<p>A path splits: $z$ depends on $x$ through both $y=x^2$ and $w=3x$, with $z = y + w$. Find $\\frac{dz}{dx}$.</p>`,
      steps:[
        {do:`Through $y$: $\\frac{dz}{dy}\\frac{dy}{dx} = 1\\times2x = 2x$.`, why:`$z$ depends on $y$ with slope $1$; $y$ on $x$ with slope $2x$.`},
        {do:`Through $w$: $\\frac{dz}{dw}\\frac{dw}{dx} = 1\\times3 = 3$.`, why:`The second path from $x$ to $z$.`},
        {do:`Add the paths: $2x + 3$.`, why:`When a variable reaches $z$ by several paths, sum their contributions (multivariable chain rule).`}
      ],
      answer:`$\\frac{dz}{dx} = 2x + 3$` },

    { q:`<p>For a two-step neuron $a = \\sigma(wx)$ with $\\sigma' = \\sigma(1-\\sigma)$, find $\\frac{da}{dw}$ when $x=2$, $\\sigma(wx)=0.5$.</p>`,
      steps:[
        {do:`Let $z = wx$, so $a = \\sigma(z)$.`, why:`Name the pre-activation.`},
        {do:`$\\frac{da}{dz} = \\sigma(1-\\sigma) = 0.5\\times0.5 = 0.25$.`, why:`Sigmoid slope at this activation.`},
        {do:`$\\frac{dz}{dw} = x = 2$, so $\\frac{da}{dw} = 0.25\\times2 = 0.5$.`, why:`Chain the activation slope with the input.`}
      ],
      answer:`$\\frac{da}{dw} = 0.5$` }
  ]);

  /* ---------------- fnd-eigen ---------------- */
  add("fnd-eigen", [
    { q:`<p>Find both eigenvalues of $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$ from $\\det(A-\\lambda I)=0$.</p>`,
      steps:[
        {do:`$A-\\lambda I = \\begin{bmatrix}2-\\lambda&1\\\\1&2-\\lambda\\end{bmatrix}$.`, why:`Subtract $\\lambda$ from the diagonal.`},
        {do:`Determinant: $(2-\\lambda)^2 - 1\\times1 = (2-\\lambda)^2 - 1$.`, why:`Use $ad-bc$.`},
        {do:`Set $(2-\\lambda)^2 = 1$, so $2-\\lambda = \\pm1$.`, why:`Solve the characteristic equation.`},
        {do:`$\\lambda = 1$ or $\\lambda = 3$.`, why:`$2-\\lambda=1$ gives $\\lambda=1$; $2-\\lambda=-1$ gives $\\lambda=3$.`}
      ],
      answer:`$\\lambda = 1,\\;3$` },

    { q:`<p>Find the eigenvector of $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$ for $\\lambda = 3$.</p>`,
      steps:[
        {do:`Solve $(A-3I)z = 0$: $\\begin{bmatrix}-1&1\\\\1&-1\\end{bmatrix}z = 0$.`, why:`Subtract $3$ from the diagonal.`},
        {do:`Row 1 says $-z_1 + z_2 = 0$, so $z_1 = z_2$.`, why:`The equation forces the entries equal.`},
        {do:`Pick $z = [1,1]$.`, why:`Any nonzero multiple works as an eigenvector.`}
      ],
      answer:`$z = [1,1]$` },

    { q:`<p>The sum of eigenvalues equals the trace. For $A=\\begin{bmatrix}4&2\\\\1&3\\end{bmatrix}$, what is $\\lambda_1+\\lambda_2$?</p>`,
      steps:[
        {do:`Trace = sum of diagonal $= 4 + 3 = 7$.`, why:`The trace adds the diagonal entries.`},
        {do:`So $\\lambda_1 + \\lambda_2 = 7$.`, why:`Eigenvalues always sum to the trace.`}
      ],
      answer:`$\\lambda_1+\\lambda_2 = 7$` },

    { q:`<p>The product of eigenvalues equals the determinant. For $A=\\begin{bmatrix}4&2\\\\1&3\\end{bmatrix}$, find $\\lambda_1\\lambda_2$.</p>`,
      steps:[
        {do:`$\\det = 4\\times3 - 2\\times1 = 12 - 2 = 10$.`, why:`Compute $ad-bc$.`},
        {do:`So $\\lambda_1\\lambda_2 = 10$.`, why:`The product of eigenvalues equals the determinant.`}
      ],
      answer:`$\\lambda_1\\lambda_2 = 10$` },

    { q:`<p>Use trace and determinant to find both eigenvalues of $A=\\begin{bmatrix}4&2\\\\1&3\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Sum $= 7$, product $= 10$.`, why:`From the trace and determinant above.`},
        {do:`Solve $\\lambda^2 - 7\\lambda + 10 = 0$.`, why:`Eigenvalues are roots of the characteristic polynomial $\\lambda^2 - (\\text{trace})\\lambda + \\det = 0$.`},
        {do:`Factor: $(\\lambda-2)(\\lambda-5) = 0$, so $\\lambda = 2,5$.`, why:`$2+5=7$ and $2\\times5=10$.`}
      ],
      answer:`$\\lambda = 2,\\;5$` },

    { q:`<p>A triangular matrix has its eigenvalues on the diagonal. Give the eigenvalues of $A=\\begin{bmatrix}3&7&2\\\\0&5&9\\\\0&0&1\\end{bmatrix}$.</p>`,
      steps:[
        {do:`The matrix is upper-triangular (zeros below the diagonal).`, why:`Triangular matrices read eigenvalues straight off the diagonal.`},
        {do:`Diagonal entries: $3, 5, 1$.`, why:`Those are the eigenvalues.`}
      ],
      answer:`$\\lambda = 3,\\;5,\\;1$` },

    { q:`<p>If $\\lambda$ is an eigenvalue of $A$ with eigenvector $z$, what is the eigenvalue of $A^2$ for the same $z$?</p>`,
      steps:[
        {do:`$A^2 z = A(Az) = A(\\lambda z) = \\lambda(Az)$.`, why:`Apply $A$ twice; pull out the scalar.`},
        {do:`$= \\lambda(\\lambda z) = \\lambda^2 z$.`, why:`Use $Az=\\lambda z$ again.`},
        {do:`So the eigenvalue of $A^2$ is $\\lambda^2$.`, why:`Squaring the matrix squares each eigenvalue, same eigenvector.`}
      ],
      answer:`$\\lambda^2$` },

    { q:`<p>A covariance matrix is $C=\\begin{bmatrix}5&0\\\\0&2\\end{bmatrix}$. Which direction is PCA's first principal component, and why?</p>`,
      steps:[
        {do:`Eigenvalues are the diagonal entries $5$ and $2$.`, why:`$C$ is diagonal, so eigenvalues sit on the diagonal.`},
        {do:`The largest eigenvalue $5$ has eigenvector $[1,0]$.`, why:`The first column axis is stretched most.`},
        {do:`PCA picks the largest-eigenvalue direction (most variance): $[1,0]$.`, why:`The top principal component is the direction of greatest spread.`}
      ],
      answer:`Along $[1,0]$ (largest eigenvalue $5$).` },

    { q:`<p>Check whether $z=[2,1]$ is an eigenvector of $A=\\begin{bmatrix}1&2\\\\2&1\\end{bmatrix}$.</p>`,
      steps:[
        {do:`$Az = \\begin{bmatrix}1\\times2+2\\times1\\\\2\\times2+1\\times1\\end{bmatrix} = \\begin{bmatrix}4\\\\5\\end{bmatrix}$.`, why:`Multiply the matrix by $z$.`},
        {do:`Is $[4,5]$ a multiple of $[2,1]$? $4/2=2$ but $5/1=5$.`, why:`An eigenvector must keep the same direction.`},
        {do:`The ratios differ, so $z$ is not an eigenvector.`, why:`$Az$ points a new way.`}
      ],
      answer:`No — $[4,5]$ is not a multiple of $[2,1]$.` },

    { q:`<p>A matrix $A$ has eigenvalues $0.5$ and $0.9$. If you apply $A$ repeatedly to a vector, what happens over time?</p>`,
      steps:[
        {do:`Each eigen-direction is scaled by its eigenvalue every application: $A^k z = \\lambda^k z$.`, why:`Powers of $A$ raise each eigenvalue to that power.`},
        {do:`Both $0.5$ and $0.9$ are less than $1$, so $\\lambda^k \\to 0$.`, why:`Powers of a number below $1$ shrink toward zero.`},
        {do:`The vector shrinks toward the zero vector.`, why:`Every component decays, so repeated application damps it out.`}
      ],
      answer:`It shrinks toward $0$ (both $|\\lambda|&lt;1$).` }
  ]);

})();
