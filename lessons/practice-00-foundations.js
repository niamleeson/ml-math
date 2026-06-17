/* =====================================================================
   PRACTICE PROBLEMS — MODULE 0: FOUNDATIONS
   10 problems per owned lesson id, easy -> hard.
   Same formulas and notation as lessons/00-foundations.js.
   ===================================================================== */
(function(){
Object.assign(window.PRACTICE, {

  /* ---------------- fnd-vector ---------------- */
  "fnd-vector": [
    { q:`<p>A house is size $=1200$, bedrooms $=2$, age $=5$. Write it as a vector $x$.</p>`,
      steps:[
        {do:`Pick the three numbers in order: size, bedrooms, age.`, why:`A vector is just an ordered list, so the order must be fixed.`},
        {do:`Stack them into a column: $x=\\begin{bmatrix}1200\\\\2\\\\5\\end{bmatrix}$.`, why:`We write vectors standing up as a column of numbers.`}
      ],
      answer:`$x=\\begin{bmatrix}1200\\\\2\\\\5\\end{bmatrix}$` },

    { q:`<p>For $x=[7,4,9,2]$, what is $n$ (the length)?</p>`,
      steps:[
        {do:`Count the numbers: $7,4,9,2$. That is 4 numbers.`, why:`The length $n$ is just how many numbers the vector holds.`},
        {do:`So $n=4$ and $x\\in\\mathbb{R}^4$.`, why:`$\\mathbb{R}^n$ is the set of all vectors with $n$ real numbers.`}
      ],
      answer:`$n=4$` },

    { q:`<p>For $x=[10,20,30]$, what is $x_2$?</p>`,
      steps:[
        {do:`The little $2$ means position 2. Count to the second entry.`, why:`$x_i$ is the $i$-th number inside the vector.`},
        {do:`The second entry is $20$.`, why:`Reading by position lets us pull out one value.`}
      ],
      answer:`$x_2=20$` },

    { q:`<p>A movie is [running time $=120$, rating $=8$, year $=1999$]. Give $x_1$ and $x_3$.</p>`,
      steps:[
        {do:`$x_1$ is the first entry: $120$.`, why:`Position 1 is the running time.`},
        {do:`$x_3$ is the third entry: $1999$.`, why:`Position 3 is the year.`}
      ],
      answer:`$x_1=120,\\; x_3=1999$` },

    { q:`<p>A vector lives in $\\mathbb{R}^5$. How many numbers does it have?</p>`,
      steps:[
        {do:`$\\mathbb{R}^n$ holds vectors with $n$ numbers. Here $n=5$.`, why:`The little number on $\\mathbb{R}$ is the length.`},
        {do:`So the vector has 5 numbers.`, why:`Dimension and count of entries are the same thing.`}
      ],
      answer:`$5$ numbers` },

    { q:`<p>Add the vectors $x=[1,2,3]$ and $y=[4,5,6]$.</p>`,
      steps:[
        {do:`Add position 1: $1+4=5$.`, why:`Vectors add entry by entry, matching positions.`},
        {do:`Add position 2: $2+5=7$.`, why:`Do the same for the second entries.`},
        {do:`Add position 3: $3+6=9$.`, why:`And the third entries.`}
      ],
      answer:`$x+y=[5,7,9]$` },

    { q:`<p>Multiply the vector $x=[2,-1,4]$ by the scalar $3$.</p>`,
      steps:[
        {do:`Multiply each entry by $3$: $3\\times2=6$.`, why:`A scalar scales every number in the vector.`},
        {do:`$3\\times(-1)=-3$ and $3\\times4=12$.`, why:`Do the same to the other entries.`}
      ],
      answer:`$3x=[6,-3,12]$` },

    { q:`<p>A grayscale $2\\times2$ image has pixel rows $[10,20]$ and $[30,40]$. Flatten it into one vector.</p>`,
      steps:[
        {do:`Read the first row in order: $10,20$.`, why:`Flattening lays the grid out into one long list.`},
        {do:`Then the second row: $30,40$.`, why:`We keep a fixed order so we can read pixels back later.`},
        {do:`Join them: $[10,20,30,40]$.`, why:`That single list is the image as a vector.`}
      ],
      answer:`$x=[10,20,30,40]\\in\\mathbb{R}^4$` },

    { q:`<p>Compute $2x-y$ where $x=[3,1]$ and $y=[1,4]$.</p>`,
      steps:[
        {do:`Scale: $2x=[6,2]$.`, why:`Multiply each entry of $x$ by $2$ first.`},
        {do:`Subtract entry by entry: $[6-1,\\;2-4]$.`, why:`Subtraction also lines up matching positions.`},
        {do:`That gives $[5,-2]$.`, why:`Finish the arithmetic in each slot.`}
      ],
      answer:`$2x-y=[5,-2]$` },

    { q:`<p>You have 100 houses, each described by 3 numbers. How many vectors, and what space does each live in?</p>`,
      steps:[
        {do:`Each house is one vector, so there are $100$ vectors.`, why:`Every example becomes its own vector.`},
        {do:`Each has 3 numbers, so each lives in $\\mathbb{R}^3$.`, why:`The count of features sets the dimension $n$.`}
      ],
      answer:`$100$ vectors, each in $\\mathbb{R}^3$` }
  ],

  /* ---------------- fnd-dot ---------------- */
  "fnd-dot": [
    { q:`<p>Compute the dot product of $x=[1,2]$ and $y=[3,4]$.</p>`,
      steps:[
        {do:`$x_1 y_1 = 1\\times3 = 3$.`, why:`Multiply the first entries together.`},
        {do:`$x_2 y_2 = 2\\times4 = 8$.`, why:`Do the same for the second entries.`},
        {do:`$3+8 = 11$.`, why:`Add the products to get one number.`}
      ],
      answer:`$x^\\top y = 11$` },

    { q:`<p>Compute the dot product of $[2,0,1]$ and $[3,5,4]$.</p>`,
      steps:[
        {do:`$2\\times3 = 6$.`, why:`Multiply the first entries.`},
        {do:`$0\\times5 = 0$.`, why:`A zero entry kills its term.`},
        {do:`$1\\times4 = 4$.`, why:`Multiply the third entries.`},
        {do:`$6+0+4 = 10$.`, why:`Add all the products.`}
      ],
      answer:`$x^\\top y = 10$` },

    { q:`<p>Compute the dot product of $[1,-2,3]$ and $[4,1,-1]$.</p>`,
      steps:[
        {do:`$1\\times4 = 4$.`, why:`Multiply the first entries.`},
        {do:`$(-2)\\times1 = -2$.`, why:`A negative times a positive is negative.`},
        {do:`$3\\times(-1) = -3$.`, why:`Multiply the third entries.`},
        {do:`$4-2-3 = -1$.`, why:`Add the products. The negative total means they lean apart.`}
      ],
      answer:`$x^\\top y = -1$` },

    { q:`<p>House $x=[1500,3,10]$, price weights $w=[200,10000,-500]$. Find $w^\\top x$.</p>`,
      steps:[
        {do:`$1500\\times200 = 300000$.`, why:`Dollars per sq ft times size.`},
        {do:`$3\\times10000 = 30000$.`, why:`Dollars per bedroom times bedrooms.`},
        {do:`$10\\times(-500) = -5000$.`, why:`The negative weight lowers price for age.`},
        {do:`$300000+30000-5000 = 325000$.`, why:`Add the products to get the predicted price.`}
      ],
      answer:`$w^\\top x = 325000$` },

    { q:`<p>Vector $a=[2,3]$. Which is perpendicular to it: $[3,-2]$ or $[3,2]$?</p>`,
      steps:[
        {do:`Test $[3,-2]$: $2\\times3 + 3\\times(-2) = 6-6 = 0$.`, why:`A dot product of $0$ means a right angle.`},
        {do:`Test $[3,2]$: $2\\times3 + 3\\times2 = 12 \\ne 0$.`, why:`Not zero, so that pair is not perpendicular.`}
      ],
      answer:`$[3,-2]$ is perpendicular to $a$.` },

    { q:`<p>Compute the dot product of $x=[1,2,3]$ with itself.</p>`,
      steps:[
        {do:`$1\\times1 = 1$.`, why:`Each entry multiplies itself.`},
        {do:`$2\\times2 = 4$ and $3\\times3 = 9$.`, why:`So every term is a square.`},
        {do:`$1+4+9 = 14$.`, why:`Add the squares. A vector dotted with itself gives its squared length.`}
      ],
      answer:`$x^\\top x = 14$` },

    { q:`<p>Use $\\sum_{i=1}^{n} x_i y_i$ to dot $[2,2,2]$ and $[1,3,5]$.</p>`,
      steps:[
        {do:`Term $i=1$: $2\\times1 = 2$.`, why:`The sum walks through each position $i$.`},
        {do:`Term $i=2$: $2\\times3 = 6$; term $i=3$: $2\\times5 = 10$.`, why:`Keep multiplying matching entries.`},
        {do:`$2+6+10 = 18$.`, why:`The $\\sum$ tells us to add the running total.`}
      ],
      answer:`$x^\\top y = 18$` },

    { q:`<p>Two vectors give a dot product of $-12$. Do they agree or disagree in direction?</p>`,
      steps:[
        {do:`Check the sign of the result: it is negative.`, why:`The sign tells us how the vectors point relative to each other.`},
        {do:`A negative dot product means they point in opposing directions.`, why:`Positive means agree, zero means unrelated, negative means disagree.`}
      ],
      answer:`They disagree (point opposite ways).` },

    { q:`<p>For what value of $k$ are $[1,k]$ and $[4,2]$ perpendicular?</p>`,
      steps:[
        {do:`Write the dot product: $1\\times4 + k\\times2 = 4+2k$.`, why:`Perpendicular vectors have dot product $0$.`},
        {do:`Set $4+2k = 0$, so $2k=-4$.`, why:`Solve for $k$ that makes it zero.`},
        {do:`$k = -2$.`, why:`Divide both sides by $2$.`}
      ],
      answer:`$k = -2$` },

    { q:`<p>Weights $w=[0.5,-1,2]$, features $x=[4,3,1]$. Compute the score $w^\\top x$.</p>`,
      steps:[
        {do:`$0.5\\times4 = 2$.`, why:`Multiply the first weight by its feature.`},
        {do:`$(-1)\\times3 = -3$.`, why:`The negative weight subtracts.`},
        {do:`$2\\times1 = 2$.`, why:`Multiply the last pair.`},
        {do:`$2-3+2 = 1$.`, why:`Add the products. This single number is the model's score.`}
      ],
      answer:`$w^\\top x = 1$` }
  ],

  /* ---------------- fnd-matrix ---------------- */
  "fnd-matrix": [
    { q:`<p>What is the shape ($m\\times n$) of $A=\\begin{bmatrix}1&2&3\\\\4&5&6\\end{bmatrix}$?</p>`,
      steps:[
        {do:`Count the rows: there are 2.`, why:`$m$ is the number of rows.`},
        {do:`Count the columns: there are 3.`, why:`$n$ is the number of columns.`},
        {do:`So $A\\in\\mathbb{R}^{2\\times3}$.`, why:`Shape is written rows by columns.`}
      ],
      answer:`$2\\times3$` },

    { q:`<p>In $A=\\begin{bmatrix}5&8\\\\1&9\\\\7&2\\end{bmatrix}$, what is $A_{2,1}$?</p>`,
      steps:[
        {do:`Go to row 2: $[1,9]$.`, why:`The first index is the row.`},
        {do:`Take column 1 of that row: $1$.`, why:`The second index is the column.`}
      ],
      answer:`$A_{2,1}=1$` },

    { q:`<p>Build a matrix from houses: house 1 $=[1500,3]$, house 2 $=[900,2]$. Give $A$ and its shape.</p>`,
      steps:[
        {do:`Write each house as a row and stack: $A=\\begin{bmatrix}1500&3\\\\900&2\\end{bmatrix}$.`, why:`Each row is one example, each column one feature.`},
        {do:`Count: 2 rows, 2 columns, so $A\\in\\mathbb{R}^{2\\times2}$.`, why:`Shape is rows by columns.`}
      ],
      answer:`$A=\\begin{bmatrix}1500&3\\\\900&2\\end{bmatrix},\\;2\\times2$` },

    { q:`<p>In $A=\\begin{bmatrix}1&2&3\\\\4&5&6\\\\7&8&9\\end{bmatrix}$, find $A_{3,2}$.</p>`,
      steps:[
        {do:`Row 3 is $[7,8,9]$.`, why:`Row first.`},
        {do:`Column 2 of that row is $8$.`, why:`Column second.`}
      ],
      answer:`$A_{3,2}=8$` },

    { q:`<p>A dataset has 1000 houses, each with 3 features. What is its matrix shape?</p>`,
      steps:[
        {do:`Rows = examples = $1000$.`, why:`Each example is one row.`},
        {do:`Columns = features = $3$.`, why:`Each feature is one column.`},
        {do:`So shape is $1000\\times3$.`, why:`Rows by columns.`}
      ],
      answer:`$1000\\times3$` },

    { q:`<p>Add $A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$ and $B=\\begin{bmatrix}5&6\\\\7&8\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Add matching cells of row 1: $1+5=6$, $2+6=8$.`, why:`Matrices add cell by cell.`},
        {do:`Add row 2: $3+7=10$, $4+8=12$.`, why:`Same rule for every cell.`}
      ],
      answer:`$A+B=\\begin{bmatrix}6&8\\\\10&12\\end{bmatrix}$` },

    { q:`<p>Multiply $A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$ by the scalar $2$.</p>`,
      steps:[
        {do:`Multiply every cell by $2$: row 1 becomes $2,4$.`, why:`A scalar scales each entry.`},
        {do:`Row 2 becomes $6,8$.`, why:`Same for the rest.`}
      ],
      answer:`$2A=\\begin{bmatrix}2&4\\\\6&8\\end{bmatrix}$` },

    { q:`<p>Find the transpose of $A=\\begin{bmatrix}1&2&3\\\\4&5&6\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Turn each row into a column. Row 1 $[1,2,3]$ becomes column 1.`, why:`The transpose flips rows and columns.`},
        {do:`Row 2 $[4,5,6]$ becomes column 2.`, why:`Every row stands up as a column.`},
        {do:`Result: $\\begin{bmatrix}1&4\\\\2&5\\\\3&6\\end{bmatrix}$, now $3\\times2$.`, why:`Shape flips from $2\\times3$ to $3\\times2$.`}
      ],
      answer:`$A^\\top=\\begin{bmatrix}1&4\\\\2&5\\\\3&6\\end{bmatrix}$` },

    { q:`<p>How many entries does a matrix in $\\mathbb{R}^{4\\times5}$ have?</p>`,
      steps:[
        {do:`Each row has $5$ entries, and there are $4$ rows.`, why:`Total cells = rows times columns.`},
        {do:`$4\\times5 = 20$.`, why:`Multiply to count every cell.`}
      ],
      answer:`$20$ entries` },

    { q:`<p>The main diagonal of a square matrix has entries $A_{i,i}$. List the diagonal of $A=\\begin{bmatrix}9&1&2\\\\3&8&4\\\\5&6&7\\end{bmatrix}$.</p>`,
      steps:[
        {do:`$A_{1,1}=9$.`, why:`The diagonal uses the same row and column index.`},
        {do:`$A_{2,2}=8$ and $A_{3,3}=7$.`, why:`Step down the diagonal one cell at a time.`}
      ],
      answer:`Diagonal $=[9,8,7]$` }
  ],

  /* ---------------- fnd-matvec ---------------- */
  "fnd-matvec": [
    { q:`<p>Compute $Ax$ for $A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$, $x=\\begin{bmatrix}1\\\\1\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Row 1 dot $x$: $1\\times1 + 2\\times1 = 3$.`, why:`Each output entry is one row dotted with $x$.`},
        {do:`Row 2 dot $x$: $3\\times1 + 4\\times1 = 7$.`, why:`Repeat for the next row.`}
      ],
      answer:`$Ax=\\begin{bmatrix}3\\\\7\\end{bmatrix}$` },

    { q:`<p>Two houses $A=\\begin{bmatrix}1500&3\\\\900&2\\end{bmatrix}$, weights $x=\\begin{bmatrix}200\\\\10000\\end{bmatrix}$. Find $Ax$.</p>`,
      steps:[
        {do:`Row 1: $1500\\times200 + 3\\times10000 = 300000+30000 = 330000$.`, why:`Dot the first house with the weights.`},
        {do:`Row 2: $900\\times200 + 2\\times10000 = 180000+20000 = 200000$.`, why:`Dot the second house too.`}
      ],
      answer:`$Ax=\\begin{bmatrix}330000\\\\200000\\end{bmatrix}$` },

    { q:`<p>If $A$ is $5\\times3$ and $x$ has 3 numbers, how many numbers does $Ax$ have?</p>`,
      steps:[
        {do:`Check the columns of $A$ match the length of $x$: both $3$. Good.`, why:`The inner dimensions must match to multiply.`},
        {do:`The result has one entry per row, so $5$ numbers.`, why:`$(m\\times n)$ times $(n)$ gives an $(m)$ vector.`}
      ],
      answer:`$5$ numbers` },

    { q:`<p>Compute $Ax$ for $A=\\begin{bmatrix}2&0\\\\0&3\\end{bmatrix}$, $x=\\begin{bmatrix}4\\\\5\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Row 1: $2\\times4 + 0\\times5 = 8$.`, why:`Dot row 1 with $x$.`},
        {do:`Row 2: $0\\times4 + 3\\times5 = 15$.`, why:`Dot row 2 with $x$.`}
      ],
      answer:`$Ax=\\begin{bmatrix}8\\\\15\\end{bmatrix}$` },

    { q:`<p>Compute $Ax$ for $A=\\begin{bmatrix}1&0&2\\\\0&1&1\\end{bmatrix}$, $x=\\begin{bmatrix}3\\\\4\\\\5\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Row 1: $1\\times3 + 0\\times4 + 2\\times5 = 3+0+10 = 13$.`, why:`Dot the first row with $x$.`},
        {do:`Row 2: $0\\times3 + 1\\times4 + 1\\times5 = 0+4+5 = 9$.`, why:`Dot the second row with $x$.`}
      ],
      answer:`$Ax=\\begin{bmatrix}13\\\\9\\end{bmatrix}$` },

    { q:`<p>Multiplying $A$ ($3\\times4$) by a vector $x$ requires $x$ to have how many numbers?</p>`,
      steps:[
        {do:`$x$ must match the column count of $A$, which is $4$.`, why:`Length of $x$ must equal columns of $A$.`},
        {do:`So $x$ has $4$ numbers.`, why:`Otherwise the dot products would not line up.`}
      ],
      answer:`$4$ numbers` },

    { q:`<p>Compute $Ax$ for $A=\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}$, $x=\\begin{bmatrix}5\\\\2\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Row 1: $1\\times5 + 1\\times2 = 7$.`, why:`Dot row 1 with $x$.`},
        {do:`Row 2: $1\\times5 + (-1)\\times2 = 5-2 = 3$.`, why:`Dot row 2; the $-1$ subtracts.`}
      ],
      answer:`$Ax=\\begin{bmatrix}7\\\\3\\end{bmatrix}$` },

    { q:`<p>The identity $I=\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}$ times $x=\\begin{bmatrix}6\\\\7\\end{bmatrix}$. What is $Ix$?</p>`,
      steps:[
        {do:`Row 1: $1\\times6 + 0\\times7 = 6$.`, why:`Dot row 1 with $x$.`},
        {do:`Row 2: $0\\times6 + 1\\times7 = 7$.`, why:`Dot row 2 with $x$.`},
        {do:`So $Ix = x$.`, why:`The identity matrix leaves any vector unchanged.`}
      ],
      answer:`$Ix=\\begin{bmatrix}6\\\\7\\end{bmatrix}$` },

    { q:`<p>Compute $Ax$ for $A=\\begin{bmatrix}3&1\\\\2&4\\\\1&0\\end{bmatrix}$, $x=\\begin{bmatrix}2\\\\3\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Row 1: $3\\times2 + 1\\times3 = 6+3 = 9$.`, why:`Dot row 1 with $x$.`},
        {do:`Row 2: $2\\times2 + 4\\times3 = 4+12 = 16$.`, why:`Dot row 2 with $x$.`},
        {do:`Row 3: $1\\times2 + 0\\times3 = 2$.`, why:`Dot row 3 with $x$. A $3\\times2$ matrix gives a length-3 result.`}
      ],
      answer:`$Ax=\\begin{bmatrix}9\\\\16\\\\2\\end{bmatrix}$` },

    { q:`<p>A network layer uses $A=\\begin{bmatrix}1&2\\\\0&1\\end{bmatrix}$ on input $x=\\begin{bmatrix}-1\\\\3\\end{bmatrix}$. Find the output $Ax$.</p>`,
      steps:[
        {do:`Row 1: $1\\times(-1) + 2\\times3 = -1+6 = 5$.`, why:`Dot the first row with the input.`},
        {do:`Row 2: $0\\times(-1) + 1\\times3 = 3$.`, why:`Dot the second row with the input.`}
      ],
      answer:`$Ax=\\begin{bmatrix}5\\\\3\\end{bmatrix}$` }
  ],

  /* ---------------- fnd-norm ---------------- */
  "fnd-norm": [
    { q:`<p>Find the L2 norm of $x=[3,4]$.</p>`,
      steps:[
        {do:`Square each entry: $3^2=9$, $4^2=16$.`, why:`The L2 norm squares every entry first.`},
        {do:`Add: $9+16 = 25$.`, why:`Sum the squares under the root.`},
        {do:`$\\sqrt{25} = 5$.`, why:`Take the square root for straight-line length.`}
      ],
      answer:`$\\lVert x\\rVert_2 = 5$` },

    { q:`<p>Find the L1 norm of $x=[3,-4]$.</p>`,
      steps:[
        {do:`Take absolute values: $|3|=3$, $|-4|=4$.`, why:`The L1 norm drops minus signs.`},
        {do:`Add them: $3+4 = 7$.`, why:`Sum the absolute values.`}
      ],
      answer:`$\\lVert x\\rVert_1 = 7$` },

    { q:`<p>Find the L2 norm of $x=[0,6,8]$.</p>`,
      steps:[
        {do:`Square: $0^2=0$, $6^2=36$, $8^2=64$.`, why:`Square every entry.`},
        {do:`Add: $0+36+64 = 100$.`, why:`Sum the squares.`},
        {do:`$\\sqrt{100} = 10$.`, why:`Take the root.`}
      ],
      answer:`$\\lVert x\\rVert_2 = 10$` },

    { q:`<p>Find the L1 norm of $x=[1,-2,3,-4]$.</p>`,
      steps:[
        {do:`Absolute values: $1,2,3,4$.`, why:`Strip the minus signs.`},
        {do:`Add: $1+2+3+4 = 10$.`, why:`Sum the absolute values.`}
      ],
      answer:`$\\lVert x\\rVert_1 = 10$` },

    { q:`<p>Find the L2 norm of $x=[1,2,2]$.</p>`,
      steps:[
        {do:`Square: $1^2=1$, $2^2=4$, $2^2=4$.`, why:`Square each entry.`},
        {do:`Add: $1+4+4 = 9$.`, why:`Sum the squares.`},
        {do:`$\\sqrt{9} = 3$.`, why:`Take the root.`}
      ],
      answer:`$\\lVert x\\rVert_2 = 3$` },

    { q:`<p>Find the L2 distance between $x=[1,2]$ and $y=[4,6]$.</p>`,
      steps:[
        {do:`Subtract: $x-y = [1-4,\\;2-6] = [-3,-4]$.`, why:`Distance is the norm of the difference.`},
        {do:`Square and add: $(-3)^2+(-4)^2 = 9+16 = 25$.`, why:`Apply the L2 formula to the difference.`},
        {do:`$\\sqrt{25} = 5$.`, why:`Take the root for the distance.`}
      ],
      answer:`$\\lVert x-y\\rVert_2 = 5$` },

    { q:`<p>Find both the L2 and L1 norm of $x=[5,12]$.</p>`,
      steps:[
        {do:`L2: $\\sqrt{5^2+12^2} = \\sqrt{25+144} = \\sqrt{169} = 13$.`, why:`Square, add, root for L2.`},
        {do:`L1: $|5|+|12| = 5+12 = 17$.`, why:`Add absolute values for L1.`}
      ],
      answer:`$\\lVert x\\rVert_2 = 13,\\;\\lVert x\\rVert_1 = 17$` },

    { q:`<p>A unit vector has L2 norm $1$. Is $x=[0.6,0.8]$ a unit vector?</p>`,
      steps:[
        {do:`Square and add: $0.6^2+0.8^2 = 0.36+0.64 = 1$.`, why:`Compute the L2 norm squared.`},
        {do:`$\\sqrt{1} = 1$.`, why:`The norm is exactly $1$, so yes.`}
      ],
      answer:`Yes, $\\lVert x\\rVert_2 = 1$.` },

    { q:`<p>The L2 norm of $x=[a,a]$ is $\\sqrt{2}$. What is $a$ (take the positive value)?</p>`,
      steps:[
        {do:`Norm squared: $a^2+a^2 = 2a^2$.`, why:`Square and add the entries.`},
        {do:`Set $\\sqrt{2a^2} = \\sqrt{2}$, so $2a^2 = 2$.`, why:`Square both sides to remove the root.`},
        {do:`$a^2 = 1$, so $a = 1$.`, why:`Solve for the positive value.`}
      ],
      answer:`$a = 1$` },

    { q:`<p>For weights $w=[2,-1,2]$, compute the L2 norm used in Ridge regularization.</p>`,
      steps:[
        {do:`Square: $2^2=4$, $(-1)^2=1$, $2^2=4$.`, why:`Squaring removes the minus sign.`},
        {do:`Add: $4+1+4 = 9$.`, why:`Sum the squares.`},
        {do:`$\\sqrt{9} = 3$.`, why:`Ridge penalizes this size to keep weights small.`}
      ],
      answer:`$\\lVert w\\rVert_2 = 3$` }
  ],

  /* ---------------- fnd-derivative ---------------- */
  "fnd-derivative": [
    { q:`<p>For $f(x)=x^2$, find $f'(x)$.</p>`,
      steps:[
        {do:`Use the rule: the slope of $x^2$ is $2x$.`, why:`This is the basic result for $x^2$.`},
        {do:`So $f'(x) = 2x$.`, why:`That gives the slope at any point $x$.`}
      ],
      answer:`$f'(x) = 2x$` },

    { q:`<p>For $f(x)=x^2$, find the slope at $x=3$.</p>`,
      steps:[
        {do:`The derivative is $f'(x)=2x$.`, why:`We need the slope formula first.`},
        {do:`Plug in $x=3$: $2\\times3 = 6$.`, why:`Evaluate the slope at the point.`}
      ],
      answer:`$f'(3) = 6$` },

    { q:`<p>For $f(x)=x^2$, find the slope at $x=-5$. Is it going up or down as $x$ increases?</p>`,
      steps:[
        {do:`$f'(x)=2x$, so $f'(-5) = 2\\times(-5) = -10$.`, why:`Evaluate the slope at $x=-5$.`},
        {do:`The slope is negative, so $f$ is going down as $x$ increases there.`, why:`Negative slope means downhill.`}
      ],
      answer:`$f'(-5) = -10$ (going down)` },

    { q:`<p>For $f(x)=x^2$, where is the slope zero?</p>`,
      steps:[
        {do:`Set $f'(x) = 2x = 0$.`, why:`A flat spot has slope zero.`},
        {do:`Solve: $x = 0$.`, why:`Divide by $2$. This is the bottom of the bowl.`}
      ],
      answer:`$x = 0$` },

    { q:`<p>For $f(x)=x^3$, the derivative is $f'(x)=3x^2$. Find the slope at $x=2$.</p>`,
      steps:[
        {do:`Use $f'(x)=3x^2$.`, why:`The power rule gives $3x^2$ for $x^3$.`},
        {do:`Plug in: $3\\times2^2 = 3\\times4 = 12$.`, why:`Evaluate at the point.`}
      ],
      answer:`$f'(2) = 12$` },

    { q:`<p>For $f(x)=5x$, find $f'(x)$.</p>`,
      steps:[
        {do:`A straight line $5x$ has constant slope $5$.`, why:`The slope of a line is its coefficient.`},
        {do:`So $f'(x) = 5$.`, why:`It is the same everywhere.`}
      ],
      answer:`$f'(x) = 5$` },

    { q:`<p>Estimate the slope of $f(x)=x^2$ at $x=2$ using $h=0.1$ with $\\frac{f(x+h)-f(x)}{h}$.</p>`,
      steps:[
        {do:`$f(2.1) = 2.1^2 = 4.41$ and $f(2) = 4$.`, why:`Compute the output at $x+h$ and at $x$.`},
        {do:`$\\frac{4.41-4}{0.1} = \\frac{0.41}{0.1} = 4.1$.`, why:`Rise over run gives an approximate slope.`},
        {do:`The exact slope $f'(2)=2\\times2=4$, so $4.1$ is close.`, why:`As $h\\to0$ the estimate reaches the true slope.`}
      ],
      answer:`Estimate $4.1$ (exact $4$)` },

    { q:`<p>For $f(x)=x^2+3x$, the derivative is $f'(x)=2x+3$. Find $f'(1)$.</p>`,
      steps:[
        {do:`Differentiate term by term: $x^2\\to2x$, $3x\\to3$.`, why:`Slopes of added terms add.`},
        {do:`Plug in $x=1$: $2\\times1+3 = 5$.`, why:`Evaluate at the point.`}
      ],
      answer:`$f'(1) = 5$` },

    { q:`<p>The slope of $f(x)=x^2$ equals $10$ at what $x$?</p>`,
      steps:[
        {do:`Set $f'(x)=2x = 10$.`, why:`We want where the slope hits $10$.`},
        {do:`Solve: $x = 5$.`, why:`Divide both sides by $2$.`}
      ],
      answer:`$x = 5$` },

    { q:`<p>The error of a model is $E(w)=(w-4)^2$. Its derivative is $E'(w)=2(w-4)$. To go downhill from $w=1$, which way should $w$ move?</p>`,
      steps:[
        {do:`Slope at $w=1$: $2(1-4) = 2\\times(-3) = -6$.`, why:`Evaluate the derivative at the current point.`},
        {do:`Step opposite the slope: slope is negative, so increase $w$.`, why:`Gradient descent moves against the slope to reduce error.`}
      ],
      answer:`Increase $w$ (slope $-6$, so step toward $w=4$).` }
  ],

  /* ---------------- fnd-gradient ---------------- */
  "fnd-gradient": [
    { q:`<p>For $f(x_1,x_2)=x_1^2+x_2^2$, write the gradient $\\nabla f$.</p>`,
      steps:[
        {do:`Partial in $x_1$: $\\frac{\\partial f}{\\partial x_1} = 2x_1$.`, why:`Hold $x_2$ fixed and differentiate $x_1^2$.`},
        {do:`Partial in $x_2$: $\\frac{\\partial f}{\\partial x_2} = 2x_2$.`, why:`Hold $x_1$ fixed and differentiate $x_2^2$.`},
        {do:`Stack: $\\nabla f = [2x_1,\\;2x_2]$.`, why:`The gradient collects each partial into one vector.`}
      ],
      answer:`$\\nabla f = [2x_1,\\,2x_2]$` },

    { q:`<p>For $f(x_1,x_2)=x_1^2+x_2^2$, find $\\nabla f$ at $(3,4)$.</p>`,
      steps:[
        {do:`Use $\\nabla f = [2x_1,2x_2]$.`, why:`Start from the gradient formula.`},
        {do:`Plug in $(3,4)$: $[2\\times3,\\;2\\times4] = [6,8]$.`, why:`Evaluate each partial at the point.`}
      ],
      answer:`$\\nabla f(3,4) = [6,8]$` },

    { q:`<p>For $f(x_1,x_2)=x_1^2+x_2^2$, find $\\nabla f$ at $(0,0)$. What does it mean?</p>`,
      steps:[
        {do:`$\\nabla f = [2\\times0,\\;2\\times0] = [0,0]$.`, why:`Evaluate the partials at the origin.`},
        {do:`A zero gradient means a flat spot — here the minimum.`, why:`Nowhere is downhill, so learning stops.`}
      ],
      answer:`$\\nabla f(0,0) = [0,0]$ (the minimum)` },

    { q:`<p>For $f(x_1,x_2)=3x_1+5x_2$, find $\\nabla f$.</p>`,
      steps:[
        {do:`$\\frac{\\partial f}{\\partial x_1} = 3$.`, why:`The slope in the $x_1$ direction is its coefficient.`},
        {do:`$\\frac{\\partial f}{\\partial x_2} = 5$.`, why:`Same for $x_2$.`},
        {do:`Stack: $\\nabla f = [3,5]$.`, why:`A flat plane has a constant gradient.`}
      ],
      answer:`$\\nabla f = [3,5]$` },

    { q:`<p>At a point the gradient is $\\nabla f = [6,8]$. Which direction reduces $f$ fastest?</p>`,
      steps:[
        {do:`The gradient points to steepest increase.`, why:`That is the key fact about $\\nabla f$.`},
        {do:`Go the opposite way: $-\\nabla f = [-6,-8]$.`, why:`The negative gradient is the steepest downhill direction.`}
      ],
      answer:`Step toward $-\\nabla f = [-6,-8]$.` },

    { q:`<p>For $f(x_1,x_2)=x_1^2+3x_2$, find $\\nabla f$ at $(2,7)$.</p>`,
      steps:[
        {do:`$\\frac{\\partial f}{\\partial x_1} = 2x_1$, so at $x_1=2$ it is $4$.`, why:`Differentiate $x_1^2$, hold $x_2$ fixed.`},
        {do:`$\\frac{\\partial f}{\\partial x_2} = 3$.`, why:`The $3x_2$ term has constant slope $3$.`},
        {do:`So $\\nabla f(2,7) = [4,3]$.`, why:`Stack the partials. Note $x_2$'s value did not matter here.`}
      ],
      answer:`$\\nabla f(2,7) = [4,3]$` },

    { q:`<p>For $f(x_1,x_2)=x_1 x_2$, find $\\nabla f$.</p>`,
      steps:[
        {do:`$\\frac{\\partial f}{\\partial x_1} = x_2$.`, why:`Treat $x_2$ as a constant; the slope in $x_1$ is $x_2$.`},
        {do:`$\\frac{\\partial f}{\\partial x_2} = x_1$.`, why:`Treat $x_1$ as a constant.`},
        {do:`Stack: $\\nabla f = [x_2,\\;x_1]$.`, why:`Collect both partials.`}
      ],
      answer:`$\\nabla f = [x_2,\\,x_1]$` },

    { q:`<p>For $f(x_1,x_2)=x_1 x_2$, find $\\nabla f$ at $(3,5)$.</p>`,
      steps:[
        {do:`Use $\\nabla f = [x_2,x_1]$.`, why:`Start from the gradient formula.`},
        {do:`At $(3,5)$: $[5,3]$.`, why:`Swap in the values: $x_2=5$, $x_1=3$.`}
      ],
      answer:`$\\nabla f(3,5) = [5,3]$` },

    { q:`<p>Take one gradient-descent step from $x=[3,4]$ with $\\nabla f=[6,8]$ and step size $0.5$.</p>`,
      steps:[
        {do:`Update rule: $x_{new} = x - 0.5\\,\\nabla f$.`, why:`We move against the gradient by the step size.`},
        {do:`$0.5\\times[6,8] = [3,4]$.`, why:`Scale the gradient by the step size.`},
        {do:`$[3,4] - [3,4] = [0,0]$.`, why:`Subtract to get the new point — here, the minimum.`}
      ],
      answer:`$x_{new} = [0,0]$` },

    { q:`<p>For $f(x_1,x_2)=(x_1-1)^2+(x_2+2)^2$, find $\\nabla f$ at $(1,-2)$.</p>`,
      steps:[
        {do:`$\\frac{\\partial f}{\\partial x_1} = 2(x_1-1)$; at $x_1=1$ it is $0$.`, why:`Differentiate the first squared term.`},
        {do:`$\\frac{\\partial f}{\\partial x_2} = 2(x_2+2)$; at $x_2=-2$ it is $0$.`, why:`Differentiate the second squared term.`},
        {do:`So $\\nabla f(1,-2) = [0,0]$.`, why:`Zero gradient means $(1,-2)$ is the minimum.`}
      ],
      answer:`$\\nabla f(1,-2) = [0,0]$` }
  ],

  /* ---------------- fnd-chain ---------------- */
  "fnd-chain": [
    { q:`<p>Let $y=3x$ and $z=y^2$. Use the chain rule to find $\\frac{dz}{dx}$.</p>`,
      steps:[
        {do:`Outer slope: $\\frac{dz}{dy} = 2y$.`, why:`Differentiate $y^2$ with respect to $y$.`},
        {do:`Inner slope: $\\frac{dy}{dx} = 3$.`, why:`Differentiate $3x$ with respect to $x$.`},
        {do:`Multiply: $\\frac{dz}{dx} = 2y\\cdot3 = 6y = 6(3x) = 18x$.`, why:`The chain rule multiplies the step slopes.`}
      ],
      answer:`$\\frac{dz}{dx} = 18x$` },

    { q:`<p>Let $y=2x$ and $z=y^3$. Find $\\frac{dz}{dx}$.</p>`,
      steps:[
        {do:`$\\frac{dz}{dy} = 3y^2$.`, why:`Differentiate $y^3$.`},
        {do:`$\\frac{dy}{dx} = 2$.`, why:`Differentiate $2x$.`},
        {do:`Multiply: $3y^2\\cdot2 = 6y^2 = 6(2x)^2 = 24x^2$.`, why:`Combine the slopes and substitute $y=2x$.`}
      ],
      answer:`$\\frac{dz}{dx} = 24x^2$` },

    { q:`<p>Let $y=3x$ and $z=y^2$. Find the value of $\\frac{dz}{dx}$ at $x=1$.</p>`,
      steps:[
        {do:`From the chain rule, $\\frac{dz}{dx} = 18x$.`, why:`We derived this slope formula.`},
        {do:`Plug in $x=1$: $18\\times1 = 18$.`, why:`Evaluate at the point.`}
      ],
      answer:`$\\frac{dz}{dx} = 18$` },

    { q:`<p>Let $y=x+1$ and $z=y^2$. Find $\\frac{dz}{dx}$.</p>`,
      steps:[
        {do:`$\\frac{dz}{dy} = 2y$.`, why:`Differentiate the outer $y^2$.`},
        {do:`$\\frac{dy}{dx} = 1$.`, why:`Differentiate $x+1$.`},
        {do:`Multiply: $2y\\cdot1 = 2y = 2(x+1)$.`, why:`Chain the slopes and substitute.`}
      ],
      answer:`$\\frac{dz}{dx} = 2(x+1)$` },

    { q:`<p>Let $y=5x$ and $z=4y$. Find $\\frac{dz}{dx}$.</p>`,
      steps:[
        {do:`$\\frac{dz}{dy} = 4$.`, why:`Differentiate $4y$.`},
        {do:`$\\frac{dy}{dx} = 5$.`, why:`Differentiate $5x$.`},
        {do:`Multiply: $4\\times5 = 20$.`, why:`Chained linear steps just multiply.`}
      ],
      answer:`$\\frac{dz}{dx} = 20$` },

    { q:`<p>Let $y=x^2$ and $z=3y$. Find $\\frac{dz}{dx}$.</p>`,
      steps:[
        {do:`$\\frac{dz}{dy} = 3$.`, why:`Differentiate $3y$.`},
        {do:`$\\frac{dy}{dx} = 2x$.`, why:`Differentiate $x^2$.`},
        {do:`Multiply: $3\\cdot2x = 6x$.`, why:`Combine the two slopes.`}
      ],
      answer:`$\\frac{dz}{dx} = 6x$` },

    { q:`<p>Let $y=2x$, $z=y^2$. Verify by direct substitution that $\\frac{dz}{dx}=8x$.</p>`,
      steps:[
        {do:`Substitute first: $z = (2x)^2 = 4x^2$.`, why:`We can plug $y=2x$ in before differentiating.`},
        {do:`Differentiate $4x^2$: $\\frac{dz}{dx} = 8x$.`, why:`The slope of $4x^2$ is $8x$.`},
        {do:`Chain rule check: $2y\\cdot2 = 4y = 4(2x) = 8x$.`, why:`Both methods agree, which confirms the chain rule.`}
      ],
      answer:`$\\frac{dz}{dx} = 8x$` },

    { q:`<p>Three steps: $y=2x$, $w=y+1$, $z=w^2$. Find $\\frac{dz}{dx}$.</p>`,
      steps:[
        {do:`$\\frac{dz}{dw} = 2w$.`, why:`Differentiate the outer $w^2$.`},
        {do:`$\\frac{dw}{dy} = 1$ and $\\frac{dy}{dx} = 2$.`, why:`Differentiate each inner step.`},
        {do:`Multiply all three: $2w\\cdot1\\cdot2 = 4w = 4(2x+1)$.`, why:`The chain rule extends to any number of steps.`}
      ],
      answer:`$\\frac{dz}{dx} = 4(2x+1)$` },

    { q:`<p>Let $y=3x$ and $z=y^2$. Find $\\frac{dz}{dx}$ at $x=2$.</p>`,
      steps:[
        {do:`Chain rule gives $\\frac{dz}{dx} = 18x$.`, why:`Same composition as before.`},
        {do:`Plug in $x=2$: $18\\times2 = 36$.`, why:`Evaluate at the point.`}
      ],
      answer:`$\\frac{dz}{dx} = 36$` },

    { q:`<p>A neuron computes $a=2x$ then loss $L=a^2$. By how much does $L$ change per unit of $x$ at $x=3$?</p>`,
      steps:[
        {do:`$\\frac{dL}{da} = 2a$ and $\\frac{da}{dx} = 2$.`, why:`Slopes of the loss step and the neuron step.`},
        {do:`Chain: $\\frac{dL}{dx} = 2a\\cdot2 = 4a = 4(2x) = 8x$.`, why:`Backprop multiplies the local slopes.`},
        {do:`At $x=3$: $8\\times3 = 24$.`, why:`Evaluate to get the rate of change.`}
      ],
      answer:`$\\frac{dL}{dx} = 24$` }
  ],

  /* ---------------- fnd-eigen ---------------- */
  "fnd-eigen": [
    { q:`<p>For $A=\\begin{bmatrix}2&0\\\\0&3\\end{bmatrix}$ and $z=\\begin{bmatrix}1\\\\0\\end{bmatrix}$, check if $z$ is an eigenvector.</p>`,
      steps:[
        {do:`$Az = \\begin{bmatrix}2\\times1\\\\3\\times0\\end{bmatrix} = \\begin{bmatrix}2\\\\0\\end{bmatrix}$.`, why:`Run $z$ through the matrix.`},
        {do:`This equals $2\\begin{bmatrix}1\\\\0\\end{bmatrix} = 2z$.`, why:`Same direction as $z$, just scaled.`},
        {do:`So $z$ is an eigenvector with $\\lambda = 2$.`, why:`$Az=\\lambda z$ holds with $\\lambda=2$.`}
      ],
      answer:`Yes, $\\lambda = 2$` },

    { q:`<p>For $A=\\begin{bmatrix}2&0\\\\0&3\\end{bmatrix}$, find the eigenvalue for eigenvector $z=\\begin{bmatrix}0\\\\1\\end{bmatrix}$.</p>`,
      steps:[
        {do:`$Az = \\begin{bmatrix}2\\times0\\\\3\\times1\\end{bmatrix} = \\begin{bmatrix}0\\\\3\\end{bmatrix}$.`, why:`Multiply the matrix by $z$.`},
        {do:`That is $3z$.`, why:`Same direction, stretched by $3$.`}
      ],
      answer:`$\\lambda = 3$` },

    { q:`<p>For $A=\\begin{bmatrix}5&0\\\\0&5\\end{bmatrix}$, what does $Az$ do to any vector $z$, and what is $\\lambda$?</p>`,
      steps:[
        {do:`Each entry of $z$ is multiplied by $5$: $Az = 5z$.`, why:`A scalar-multiple matrix scales every vector.`},
        {do:`So every direction is an eigenvector with $\\lambda = 5$.`, why:`The matrix only stretches, never turns.`}
      ],
      answer:`Every $z$ is an eigenvector, $\\lambda = 5$` },

    { q:`<p>Is $z=\\begin{bmatrix}1\\\\1\\end{bmatrix}$ an eigenvector of $A=\\begin{bmatrix}2&0\\\\0&3\\end{bmatrix}$?</p>`,
      steps:[
        {do:`$Az = \\begin{bmatrix}2\\times1\\\\3\\times1\\end{bmatrix} = \\begin{bmatrix}2\\\\3\\end{bmatrix}$.`, why:`Run $z$ through the matrix.`},
        {do:`Is $[2,3]$ a multiple of $[1,1]$? No, the entries scale differently.`, why:`An eigenvector must keep the same direction.`}
      ],
      answer:`No, $z$ is not an eigenvector.` },

    { q:`<p>For $A=\\begin{bmatrix}3&0\\\\0&3\\end{bmatrix}$ and $z=\\begin{bmatrix}4\\\\7\\end{bmatrix}$, find $Az$ and the eigenvalue.</p>`,
      steps:[
        {do:`$Az = \\begin{bmatrix}3\\times4\\\\3\\times7\\end{bmatrix} = \\begin{bmatrix}12\\\\21\\end{bmatrix}$.`, why:`Multiply the matrix by $z$.`},
        {do:`That is $3z$, so $\\lambda = 3$.`, why:`Same direction, stretched threefold.`}
      ],
      answer:`$Az=\\begin{bmatrix}12\\\\21\\end{bmatrix},\\;\\lambda = 3$` },

    { q:`<p>An eigenvalue is $\\lambda=-1$. What does that do to its eigenvector $z$?</p>`,
      steps:[
        {do:`$Az = -1\\,z = -z$.`, why:`The matrix scales $z$ by $-1$.`},
        {do:`A factor of $-1$ flips the vector to point the opposite way, same length.`, why:`Negative eigenvalues reverse direction.`}
      ],
      answer:`It flips $z$ (same length, opposite direction).` },

    { q:`<p>For $A=\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$, check if $z=\\begin{bmatrix}1\\\\1\\end{bmatrix}$ is an eigenvector.</p>`,
      steps:[
        {do:`$Az = \\begin{bmatrix}0\\times1+1\\times1\\\\1\\times1+0\\times1\\end{bmatrix} = \\begin{bmatrix}1\\\\1\\end{bmatrix}$.`, why:`Do the matrix-vector multiply.`},
        {do:`That equals $1\\cdot z$, so $\\lambda = 1$.`, why:`$Az$ matches $z$ exactly, eigenvalue $1$.`}
      ],
      answer:`Yes, $\\lambda = 1$` },

    { q:`<p>For $A=\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$, check if $z=\\begin{bmatrix}1\\\\-1\\end{bmatrix}$ is an eigenvector.</p>`,
      steps:[
        {do:`$Az = \\begin{bmatrix}0\\times1+1\\times(-1)\\\\1\\times1+0\\times(-1)\\end{bmatrix} = \\begin{bmatrix}-1\\\\1\\end{bmatrix}$.`, why:`Multiply the matrix by $z$.`},
        {do:`That equals $-1\\begin{bmatrix}1\\\\-1\\end{bmatrix} = -z$.`, why:`Same direction line, flipped.`}
      ],
      answer:`Yes, $\\lambda = -1$` },

    { q:`<p>For the diagonal matrix $A=\\begin{bmatrix}7&0\\\\0&2\\end{bmatrix}$, what are its two eigenvalues?</p>`,
      steps:[
        {do:`Eigenvector $[1,0]$ gives $A[1,0]=[7,0]=7[1,0]$.`, why:`The first axis is stretched by the top-left entry.`},
        {do:`Eigenvector $[0,1]$ gives $A[0,1]=[0,2]=2[0,1]$.`, why:`The second axis is stretched by the bottom-right entry.`},
        {do:`So the eigenvalues are $7$ and $2$.`, why:`For a diagonal matrix the diagonal entries are the eigenvalues.`}
      ],
      answer:`$\\lambda = 7$ and $\\lambda = 2$` },

    { q:`<p>Verify $z=\\begin{bmatrix}1\\\\1\\end{bmatrix}$ is an eigenvector of $A=\\begin{bmatrix}3&1\\\\1&3\\end{bmatrix}$ and find $\\lambda$.</p>`,
      steps:[
        {do:`$Az = \\begin{bmatrix}3\\times1+1\\times1\\\\1\\times1+3\\times1\\end{bmatrix} = \\begin{bmatrix}4\\\\4\\end{bmatrix}$.`, why:`Do the matrix-vector multiply.`},
        {do:`That equals $4\\begin{bmatrix}1\\\\1\\end{bmatrix} = 4z$.`, why:`Same direction as $z$, scaled by $4$.`},
        {do:`So $\\lambda = 4$.`, why:`$Az=\\lambda z$ holds with $\\lambda=4$.`}
      ],
      answer:`Yes, $\\lambda = 4$` }
  ]

});
})();
