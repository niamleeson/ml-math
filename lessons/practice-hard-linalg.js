/* =====================================================================
   PRACTICE SET — MODULE 5 LINEAR ALGEBRA (deep dive).
   One add(...) per owned lesson id. Problems ordered easy -> hard.
   Each problem: { q, steps:[{do,why},...], answer }.
   LaTeX uses DOUBLE backslashes inside backtick template strings.
   ===================================================================== */
(function () {
  var P = window.PRACTICE;
  function add(id, probs) { P[id] = (P[id] || []).concat(probs); }

  /* ============================================================ la-matmul */
  add("la-matmul", [
    {
      q: `<p>What shape is $AB$ if $A$ is $2\\times 3$ and $B$ is $3\\times 4$?</p>`,
      steps: [
        { do: `Write the shapes next to each other: $(2\\times 3)(3\\times 4)$.`, why: `Matrix multiply lines the inner dimensions up.` },
        { do: `Check the inner numbers match: $3 = 3$. ✔`, why: `$A$'s columns must equal $B$'s rows.` },
        { do: `Keep the outer numbers $2$ and $4$.`, why: `The product's shape is (rows of $A$) × (columns of $B$).` }
      ],
      answer: `$2\\times 4$`
    },
    {
      q: `<p>Compute the entry $(AB)_{11}$ where row $1$ of $A$ is $[1,\\,2]$ and column $1$ of $B$ is $\\begin{bmatrix}3\\\\4\\end{bmatrix}$.</p>`,
      steps: [
        { do: `Dot row $1$ of $A$ with column $1$ of $B$: $1\\cdot 3 + 2\\cdot 4$.`, why: `$(AB)_{ij}=\\sum_k A_{ik}B_{kj}$.` },
        { do: `Multiply and add: $3 + 8 = 11$.`, why: `Finish the dot product.` }
      ],
      answer: `$(AB)_{11}=11$`
    },
    {
      q: `<p>Multiply the row vector $[2,\\,3]$ by the column vector $\\begin{bmatrix}5\\\\1\\end{bmatrix}$.</p>`,
      steps: [
        { do: `Pair and multiply: $2\\cdot 5$ and $3\\cdot 1$.`, why: `A $(1\\times 2)(2\\times 1)$ product is a single number.` },
        { do: `Add: $10 + 3 = 13$.`, why: `Sum the products.` }
      ],
      answer: `$13$`
    },
    {
      q: `<p>Compute $AB$ for $A=\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}$, $B=\\begin{bmatrix}7&8\\\\9&6\\end{bmatrix}$.</p>`,
      steps: [
        { do: `$A$ is the identity $I$.`, why: `1's on the diagonal, 0's elsewhere.` },
        { do: `$IB = B$.`, why: `Multiplying by the identity changes nothing.` }
      ],
      answer: `$AB=\\begin{bmatrix}7&8\\\\9&6\\end{bmatrix}$`
    },
    {
      q: `<p>Compute $AB$ for $A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$, $B=\\begin{bmatrix}5&6\\\\7&8\\end{bmatrix}$.</p>`,
      steps: [
        { do: `$(AB)_{11}=1\\cdot 5+2\\cdot 7=19$.`, why: `Row 1 dotted with column 1.` },
        { do: `$(AB)_{12}=1\\cdot 6+2\\cdot 8=22$.`, why: `Row 1 dotted with column 2.` },
        { do: `$(AB)_{21}=3\\cdot 5+4\\cdot 7=43$.`, why: `Row 2 dotted with column 1.` },
        { do: `$(AB)_{22}=3\\cdot 6+4\\cdot 8=50$.`, why: `Row 2 dotted with column 2.` }
      ],
      answer: `$AB=\\begin{bmatrix}19&22\\\\43&50\\end{bmatrix}$`
    },
    {
      q: `<p>Compute $Ax$ for $A=\\begin{bmatrix}2&1\\\\0&3\\end{bmatrix}$, $x=\\begin{bmatrix}4\\\\5\\end{bmatrix}$.</p>`,
      steps: [
        { do: `Row 1: $2\\cdot 4+1\\cdot 5=13$.`, why: `Each output entry is a row dotted with $x$.` },
        { do: `Row 2: $0\\cdot 4+3\\cdot 5=15$.`, why: `Second row dotted with $x$.` }
      ],
      answer: `$Ax=\\begin{bmatrix}13\\\\15\\end{bmatrix}$`
    },
    {
      q: `<p>Compute $A^2$ where $A=\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}$.</p>`,
      steps: [
        { do: `$A^2=AA$. $(A^2)_{11}=1\\cdot 1+1\\cdot 0=1$, $(A^2)_{12}=1\\cdot 1+1\\cdot 1=2$.`, why: `Square means multiply $A$ by itself.` },
        { do: `$(A^2)_{21}=0$, $(A^2)_{22}=0\\cdot 1+1\\cdot 1=1$.`, why: `Bottom row.` }
      ],
      answer: `$A^2=\\begin{bmatrix}1&2\\\\0&1\\end{bmatrix}$`
    },
    {
      q: `<p>For $A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$, $B=\\begin{bmatrix}5&6\\\\7&8\\end{bmatrix}$, compute $BA$ and confirm $BA\\neq AB$.</p>`,
      steps: [
        { do: `$(BA)_{11}=5\\cdot 1+6\\cdot 3=23$, $(BA)_{12}=5\\cdot 2+6\\cdot 4=34$.`, why: `Row of $B$ dotted with column of $A$.` },
        { do: `$(BA)_{21}=7\\cdot 1+8\\cdot 3=31$, $(BA)_{22}=7\\cdot 2+8\\cdot 4=46$.`, why: `Second row of $B$.` },
        { do: `Compare with $AB=\\begin{bmatrix}19&22\\\\43&50\\end{bmatrix}$; different.`, why: `Matrix multiplication is not commutative.` }
      ],
      answer: `$BA=\\begin{bmatrix}23&34\\\\31&46\\end{bmatrix}\\neq AB$`
    },
    {
      q: `<p>Multiply two diagonal matrices: $\\begin{bmatrix}2&0\\\\0&3\\end{bmatrix}\\begin{bmatrix}5&0\\\\0&4\\end{bmatrix}$.</p>`,
      steps: [
        { do: `Off-diagonal terms all involve a zero, so they stay $0$.`, why: `Each entry is a dot product with a zero-padded vector.` },
        { do: `Diagonal entries multiply: $2\\cdot 5=10$, $3\\cdot 4=12$.`, why: `Only the matching diagonal positions survive.` }
      ],
      answer: `$\\begin{bmatrix}10&0\\\\0&12\\end{bmatrix}$`
    },
    {
      q: `<p>Compute the $3\\times 3$ product entry $(AB)_{22}$ where row $2$ of $A$ is $[1,\\,0,\\,2]$ and column $2$ of $B$ is $\\begin{bmatrix}3\\\\5\\\\1\\end{bmatrix}$.</p>`,
      steps: [
        { do: `Dot: $1\\cdot 3+0\\cdot 5+2\\cdot 1$.`, why: `Sum over the shared index $k=1,2,3$.` },
        { do: `$3+0+2=5$.`, why: `Add the three products.` }
      ],
      answer: `$(AB)_{22}=5$`
    },
    {
      q: `<p>Compute the full $3\\times 3$ product $AB$ for $A=\\begin{bmatrix}1&0&2\\\\0&1&0\\\\1&1&1\\end{bmatrix}$, $B=\\begin{bmatrix}1&2&0\\\\0&1&1\\\\1&0&1\\end{bmatrix}$.</p>`,
      steps: [
        { do: `Row 1: $[1,0,2]\\cdot$ cols $= [1+0+2,\\ 2+0+0,\\ 0+0+2]=[3,2,2]$.`, why: `Dot row 1 with each column.` },
        { do: `Row 2: $[0,1,0]\\cdot$ cols $=[0,1,1]$.`, why: `Row 2 just picks out row 2 of $B$.` },
        { do: `Row 3: $[1,1,1]\\cdot$ cols $=[1+0+1,\\ 2+1+0,\\ 0+1+1]=[2,3,2]$.`, why: `Sum each column of $B$ weighted by row 3.` }
      ],
      answer: `$AB=\\begin{bmatrix}3&2&2\\\\0&1&1\\\\2&3&2\\end{bmatrix}$`
    },
    {
      q: `<p>For $A=\\begin{bmatrix}0&1\\\\-1&0\\end{bmatrix}$ (a $90^\\circ$ rotation), compute $A^2$ and interpret it.</p>`,
      steps: [
        { do: `$(A^2)_{11}=0\\cdot 0+1\\cdot(-1)=-1$, $(A^2)_{12}=0\\cdot 1+1\\cdot 0=0$.`, why: `Multiply $A$ by itself.` },
        { do: `$(A^2)_{21}=-1\\cdot 0+0\\cdot(-1)=0$, $(A^2)_{22}=-1\\cdot 1+0\\cdot 0=-1$.`, why: `Bottom row.` },
        { do: `Result is $-I$.`, why: `Two $90^\\circ$ rotations make a $180^\\circ$ rotation, which negates every vector.` }
      ],
      answer: `$A^2=\\begin{bmatrix}-1&0\\\\0&-1\\end{bmatrix}=-I$`
    },
    {
      q: `<p>If $X$ is $100\\times 50$ (a batch) and $W$ is $50\\times 10$ (weights), what shape is the layer output $XW$, and how many multiply-adds does it cost?</p>`,
      steps: [
        { do: `Shapes: $(100\\times 50)(50\\times 10)$, inner $50$ cancels.`, why: `Inner dimensions must match.` },
        { do: `Output shape is $100\\times 10$.`, why: `Outer dimensions remain.` },
        { do: `Cost: each of the $100\\cdot 10=1000$ entries is a length-$50$ dot product, so $1000\\cdot 50=50{,}000$ multiply-adds.`, why: `Each output entry sums over the shared index of size $50$.` }
      ],
      answer: `$100\\times 10$; $50{,}000$ multiply-adds`
    },
    {
      q: `<p>Compute the outer product $\\begin{bmatrix}1\\\\2\\\\3\\end{bmatrix}\\begin{bmatrix}4&5\\end{bmatrix}$.</p>`,
      steps: [
        { do: `Shapes $(3\\times 1)(1\\times 2)=(3\\times 2)$.`, why: `Inner $1$ cancels, giving a full matrix.` },
        { do: `Each entry $u_i v_j$: row $1=[4,5]$, row $2=[8,10]$, row $3=[12,15]$.`, why: `Outer product fills entry $(i,j)$ with $u_i v_j$.` }
      ],
      answer: `$\\begin{bmatrix}4&5\\\\8&10\\\\12&15\\end{bmatrix}$`
    },
    {
      q: `<p>Verify associativity numerically: for $A=\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix}$, $B=\\begin{bmatrix}1&0\\\\1&1\\end{bmatrix}$, $C=\\begin{bmatrix}2\\\\3\\end{bmatrix}$, compute $(AB)C$ and $A(BC)$.</p>`,
      steps: [
        { do: `$AB=\\begin{bmatrix}2&1\\\\1&1\\end{bmatrix}$, then $(AB)C=\\begin{bmatrix}2\\cdot 2+1\\cdot 3\\\\1\\cdot 2+1\\cdot 3\\end{bmatrix}=\\begin{bmatrix}7\\\\5\\end{bmatrix}$.`, why: `Multiply left-to-right.` },
        { do: `$BC=\\begin{bmatrix}2\\\\5\\end{bmatrix}$, then $A(BC)=\\begin{bmatrix}1\\cdot 2+1\\cdot 5\\\\0\\cdot 2+1\\cdot 5\\end{bmatrix}=\\begin{bmatrix}7\\\\5\\end{bmatrix}$.`, why: `Multiply right-to-left.` },
        { do: `Both give $\\begin{bmatrix}7\\\\5\\end{bmatrix}$.`, why: `Matrix multiplication is associative.` }
      ],
      answer: `Both equal $\\begin{bmatrix}7\\\\5\\end{bmatrix}$`
    },
    {
      q: `<p>Compute $AB$ for the non-square pair $A=\\begin{bmatrix}1&2&3\\\\4&5&6\\end{bmatrix}$ ($2\\times 3$), $B=\\begin{bmatrix}1&0\\\\0&1\\\\1&1\\end{bmatrix}$ ($3\\times 2$).</p>`,
      steps: [
        { do: `Shape: $(2\\times 3)(3\\times 2)=(2\\times 2)$.`, why: `Inner $3$ cancels.` },
        { do: `Row 1: $[1,2,3]\\cdot$ cols $=[1+0+3,\\ 0+2+3]=[4,5]$.`, why: `Dot row 1 with each column.` },
        { do: `Row 2: $[4,5,6]\\cdot$ cols $=[4+0+6,\\ 0+5+6]=[10,11]$.`, why: `Dot row 2 with each column.` }
      ],
      answer: `$AB=\\begin{bmatrix}4&5\\\\10&11\\end{bmatrix}$`
    },
    {
      q: `<p>A matrix $N=\\begin{bmatrix}0&1\\\\0&0\\end{bmatrix}$ is nilpotent. Compute $N^2$ and explain.</p>`,
      steps: [
        { do: `$(N^2)_{11}=0\\cdot 0+1\\cdot 0=0$, $(N^2)_{12}=0\\cdot 1+1\\cdot 0=0$.`, why: `Multiply $N$ by itself.` },
        { do: `Bottom row of $N$ is all zeros, so its entries stay $0$.`, why: `Any dot product with a zero row is $0$.` },
        { do: `$N^2=0$.`, why: `Nilpotent: a non-zero matrix whose power is the zero matrix.` }
      ],
      answer: `$N^2=\\begin{bmatrix}0&0\\\\0&0\\end{bmatrix}$`
    },
    {
      q: `<p>Powers of a rotation: $R=\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}$ rotates by $90^\\circ$. Find the smallest $k&gt;0$ with $R^k=I$.</p>`,
      steps: [
        { do: `$R^2=\\begin{bmatrix}-1&0\\\\0&-1\\end{bmatrix}=-I$.`, why: `Two $90^\\circ$ turns give $180^\\circ$.` },
        { do: `$R^3=R^2 R=-R$, and $R^4=(R^2)^2=(-I)^2=I$.`, why: `Four $90^\\circ$ turns is a full $360^\\circ$ rotation.` }
      ],
      answer: `$k=4$`
    },
    {
      q: `<p>Block multiply: if $A=\\begin{bmatrix}I_2 & 0\\\\ 0 & 2I_2\\end{bmatrix}$ ($4\\times 4$), what is $Ax$ for $x=(1,2,3,4)^\\top$?</p>`,
      steps: [
        { do: `Top block $I_2$ acts on $(1,2)$, leaving it unchanged: $(1,2)$.`, why: `The identity block does nothing.` },
        { do: `Bottom block $2I_2$ acts on $(3,4)$, doubling: $(6,8)$.`, why: `A scalar multiple of $I$ scales uniformly.` },
        { do: `Stack the results.`, why: `Block-diagonal matrices act on each block independently.` }
      ],
      answer: `$Ax=(1,\\,2,\\,6,\\,8)^\\top$`
    },
    {
      q: `<p>Compute $A^\\top A$ for $A=\\begin{bmatrix}1&2\\\\1&0\\\\0&1\\end{bmatrix}$, and note its shape.</p>`,
      steps: [
        { do: `$A$ is $3\\times 2$, so $A^\\top$ is $2\\times 3$ and $A^\\top A$ is $2\\times 2$.`, why: `$(2\\times 3)(3\\times 2)=(2\\times 2)$.` },
        { do: `$(A^\\top A)_{11}=1^2+1^2+0^2=2$; $(A^\\top A)_{22}=2^2+0^2+1^2=5$.`, why: `Diagonal = squared column norms.` },
        { do: `Off-diagonal $(A^\\top A)_{12}=1\\cdot 2+1\\cdot 0+0\\cdot 1=2$, equal to $(A^\\top A)_{21}$.`, why: `Column 1 dotted with column 2; $A^\\top A$ is symmetric.` }
      ],
      answer: `$A^\\top A=\\begin{bmatrix}2&2\\\\2&5\\end{bmatrix}$`
    }
  ]);

  /* ========================================================= la-transpose */
  add("la-transpose", [
    {
      q: `<p>What shape is $A^\\top$ if $A$ is $3\\times 5$?</p>`,
      steps: [
        { do: `Swap the two dimensions: $3\\times 5 \\to 5\\times 3$.`, why: `Transpose turns rows into columns.` },
        { do: `So $A^\\top$ has $5$ rows and $3$ columns.`, why: `The original $5$ columns become $5$ rows.` }
      ],
      answer: `$5\\times 3$`
    },
    {
      q: `<p>Write the transpose of $A=\\begin{bmatrix}1&2&3\\\\4&5&6\\end{bmatrix}$.</p>`,
      steps: [
        { do: `Row 1 $[1,2,3]$ becomes column 1.`, why: `Entry $(i,j)$ moves to $(j,i)$.` },
        { do: `Row 2 $[4,5,6]$ becomes column 2.`, why: `Same swap for the second row.` }
      ],
      answer: `$A^\\top=\\begin{bmatrix}1&4\\\\2&5\\\\3&6\\end{bmatrix}$`
    },
    {
      q: `<p>If $A_{2,3}=7$, where does the value $7$ end up in $A^\\top$?</p>`,
      steps: [
        { do: `$(A^\\top)_{ij}=A_{ji}$, so $A_{2,3}$ lands at $(A^\\top)_{3,2}$.`, why: `The two indices swap.` },
        { do: `Row index $2$ and column index $3$ trade places.`, why: `Transpose reflects across the diagonal.` }
      ],
      answer: `$(A^\\top)_{3,2}=7$`
    },
    {
      q: `<p>Compute $(A^\\top)^\\top$ for any matrix $A$.</p>`,
      steps: [
        { do: `Transpose swaps indices: $(i,j)\\to(j,i)$.`, why: `Definition of transpose.` },
        { do: `Doing it twice swaps back: $(j,i)\\to(i,j)$.`, why: `Two swaps cancel.` }
      ],
      answer: `$(A^\\top)^\\top=A$`
    },
    {
      q: `<p>Transpose the column vector $x=\\begin{bmatrix}1\\\\2\\\\3\\end{bmatrix}$.</p>`,
      steps: [
        { do: `A $3\\times 1$ column becomes a $1\\times 3$ row.`, why: `Transpose swaps the shape.` },
        { do: `Lay the entries $1,2,3$ out in a single row.`, why: `Each entry keeps its value; only its position changes.` }
      ],
      answer: `$x^\\top=[\\,1\\ \\ 2\\ \\ 3\\,]$`
    },
    {
      q: `<p>Is $A=\\begin{bmatrix}2&5\\\\5&3\\end{bmatrix}$ symmetric? Compute $A^\\top$ to check.</p>`,
      steps: [
        { do: `$A^\\top$ swaps off-diagonal entries: $A_{12}=5$, $A_{21}=5$.`, why: `Symmetric means $A_{ij}=A_{ji}$.` },
        { do: `Since $A_{12}=A_{21}=5$ and the diagonal is fixed, $A^\\top=A$.`, why: `Equal off-diagonals make it symmetric.` }
      ],
      answer: `Yes, symmetric ($A^\\top=A$)`
    },
    {
      q: `<p>Compute the dot product $x^\\top y$ for $x=(1,2,3)^\\top$, $y=(4,0,5)^\\top$.</p>`,
      steps: [
        { do: `$x^\\top$ is the row $[1,2,3]$; multiply by column $y$.`, why: `$x^\\top y$ is a $(1\\times 3)(3\\times 1)$ product.` },
        { do: `$1\\cdot 4+2\\cdot 0+3\\cdot 5=4+0+15=19$.`, why: `Sum the products.` }
      ],
      answer: `$x^\\top y=19$`
    },
    {
      q: `<p>For $A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$, $B=\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$, verify $(AB)^\\top=B^\\top A^\\top$.</p>`,
      steps: [
        { do: `$AB=\\begin{bmatrix}2&1\\\\4&3\\end{bmatrix}$, so $(AB)^\\top=\\begin{bmatrix}2&4\\\\1&3\\end{bmatrix}$.`, why: `Multiply, then transpose.` },
        { do: `$B^\\top=B$ (symmetric), $A^\\top=\\begin{bmatrix}1&3\\\\2&4\\end{bmatrix}$, so $B^\\top A^\\top=\\begin{bmatrix}2&4\\\\1&3\\end{bmatrix}$.`, why: `Transpose reverses the order.` },
        { do: `Both match.`, why: `$(AB)^\\top=B^\\top A^\\top$.` }
      ],
      answer: `Both equal $\\begin{bmatrix}2&4\\\\1&3\\end{bmatrix}$`
    },
    {
      q: `<p>What is $(ABC)^\\top$ in terms of $A^\\top,B^\\top,C^\\top$?</p>`,
      steps: [
        { do: `Apply the rule to $(AB)C$: $((AB)C)^\\top=C^\\top(AB)^\\top$.`, why: `Transpose reverses a product.` },
        { do: `Expand $(AB)^\\top=B^\\top A^\\top$.`, why: `Apply the rule again.` }
      ],
      answer: `$(ABC)^\\top=C^\\top B^\\top A^\\top$`
    },
    {
      q: `<p>Show $A^\\top A$ is always symmetric (for any $A$).</p>`,
      steps: [
        { do: `Transpose it: $(A^\\top A)^\\top=A^\\top (A^\\top)^\\top$.`, why: `Reverse-order rule.` },
        { do: `$(A^\\top)^\\top=A$, so $(A^\\top A)^\\top=A^\\top A$.`, why: `Double transpose returns $A$.` },
        { do: `Equal to itself transposed $\\Rightarrow$ symmetric.`, why: `Symmetry is $M^\\top=M$.` }
      ],
      answer: `$(A^\\top A)^\\top=A^\\top A$, so symmetric`
    },
    {
      q: `<p>Compute $\\operatorname{tr}(A^\\top A)$ for $A=\\begin{bmatrix}1&2\\\\0&3\\end{bmatrix}$, and note it equals the sum of squares of all entries.</p>`,
      steps: [
        { do: `Use the identity $\\operatorname{tr}(A^\\top A)=\\sum_{i,j}A_{ij}^2$.`, why: `This trace is the squared Frobenius norm — sum of all squared entries.` },
        { do: `Add the squares: $1^2+2^2+0^2+3^2=1+4+0+9=14$.`, why: `Total over all four entries.` }
      ],
      answer: `$\\operatorname{tr}(A^\\top A)=14$`
    },
    {
      q: `<p>If $A$ is symmetric and $B$ is symmetric, is $AB$ symmetric? Use $A=\\begin{bmatrix}1&1\\\\1&2\\end{bmatrix}$, $B=\\begin{bmatrix}2&0\\\\0&3\\end{bmatrix}$ to check.</p>`,
      steps: [
        { do: `$(AB)^\\top=B^\\top A^\\top=BA$ (both symmetric).`, why: `Reverse-order rule with $A^\\top=A$, $B^\\top=B$.` },
        { do: `$AB=\\begin{bmatrix}2&3\\\\2&6\\end{bmatrix}$, $BA=\\begin{bmatrix}2&2\\\\3&6\\end{bmatrix}$; $AB\\neq BA$.`, why: `Compute both products.` },
        { do: `So $(AB)^\\top=BA\\neq AB$: not symmetric.`, why: `Product of symmetrics is symmetric only when they commute.` }
      ],
      answer: `No — $AB$ is not symmetric here`
    },
    {
      q: `<p>A matrix is <i>skew-symmetric</i> if $A^\\top=-A$. What must the diagonal entries be?</p>`,
      steps: [
        { do: `Diagonal entries satisfy $A_{ii}=(A^\\top)_{ii}=-A_{ii}$.`, why: `Transpose fixes the diagonal, and skew flips sign.` },
        { do: `$A_{ii}=-A_{ii}\\Rightarrow 2A_{ii}=0\\Rightarrow A_{ii}=0$.`, why: `Only zero equals its own negative.` }
      ],
      answer: `All diagonal entries are $0$`
    },
    {
      q: `<p>Express $A=\\begin{bmatrix}2&4\\\\0&6\\end{bmatrix}$ as a symmetric part plus a skew-symmetric part using $S=\\tfrac12(A+A^\\top)$ and $K=\\tfrac12(A-A^\\top)$.</p>`,
      steps: [
        { do: `$A^\\top=\\begin{bmatrix}2&0\\\\4&6\\end{bmatrix}$; $A+A^\\top=\\begin{bmatrix}4&4\\\\4&12\\end{bmatrix}$, so $S=\\begin{bmatrix}2&2\\\\2&6\\end{bmatrix}$.`, why: `$S$ is symmetric by construction.` },
        { do: `$A-A^\\top=\\begin{bmatrix}0&4\\\\-4&0\\end{bmatrix}$, so $K=\\begin{bmatrix}0&2\\\\-2&0\\end{bmatrix}$.`, why: `$K$ is skew-symmetric.` },
        { do: `Check $S+K=\\begin{bmatrix}2&4\\\\0&6\\end{bmatrix}=A$. ✔`, why: `Every square matrix splits this way.` }
      ],
      answer: `$S=\\begin{bmatrix}2&2\\\\2&6\\end{bmatrix},\\ K=\\begin{bmatrix}0&2\\\\-2&0\\end{bmatrix}$`
    },
    {
      q: `<p>For an orthogonal matrix $Q$ (with $Q^\\top Q=I$), what is $Q^{-1}$?</p>`,
      steps: [
        { do: `$Q^\\top Q=I$ means $Q^\\top$ undoes $Q$.`, why: `Definition of the inverse: $MQ=I\\Rightarrow M=Q^{-1}$.` },
        { do: `So $Q^{-1}=Q^\\top$.`, why: `For orthogonal matrices the transpose is the inverse.` }
      ],
      answer: `$Q^{-1}=Q^\\top$`
    },
    {
      q: `<p>Prove $x^\\top A x = x^\\top A^\\top x$ for any square $A$ and vector $x$ (the quadratic form only sees the symmetric part).</p>`,
      steps: [
        { do: `$x^\\top A x$ is a $1\\times 1$ number, so it equals its own transpose.`, why: `A scalar is unchanged by transposing.` },
        { do: `$(x^\\top A x)^\\top = x^\\top A^\\top (x^\\top)^\\top = x^\\top A^\\top x$.`, why: `Reverse-order rule, and $(x^\\top)^\\top=x$.` },
        { do: `Therefore $x^\\top A x = x^\\top A^\\top x$.`, why: `Both equal the same scalar.` }
      ],
      answer: `$x^\\top A x = x^\\top A^\\top x$`
    },
    {
      q: `<p>A layer's forward pass is $y=Wx$. Backprop sends the upstream gradient $g$ back as $W^\\top g$. If $W$ is $4\\times 3$, what shapes are $x$, $y$, $g$, and the back-propagated vector?</p>`,
      steps: [
        { do: `$y=Wx$ with $W$ being $4\\times 3$ needs $x$ to be $3\\times 1$, giving $y$ of size $4\\times 1$.`, why: `Inner dimensions match; output has $4$ rows.` },
        { do: `$g$ matches $y$, so $g$ is $4\\times 1$.`, why: `The upstream gradient has the shape of the output.` },
        { do: `$W^\\top g$: $(3\\times 4)(4\\times 1)=3\\times 1$, matching $x$.`, why: `The back-propagated gradient has the shape of the input.` }
      ],
      answer: `$x:3\\times1$, $y:4\\times1$, $g:4\\times1$, $W^\\top g:3\\times1$`
    },
    {
      q: `<p>For $A=\\begin{bmatrix}1&2&0\\\\3&0&4\\end{bmatrix}$, compute $AA^\\top$ and confirm it is $2\\times 2$ and symmetric.</p>`,
      steps: [
        { do: `$A$ is $2\\times 3$, so $AA^\\top$ is $(2\\times 3)(3\\times 2)=2\\times 2$.`, why: `Inner $3$ cancels.` },
        { do: `$(AA^\\top)_{11}=1^2+2^2+0^2=5$; $(AA^\\top)_{22}=3^2+0^2+4^2=25$.`, why: `Diagonal = squared row norms.` },
        { do: `$(AA^\\top)_{12}=1\\cdot 3+2\\cdot 0+0\\cdot 4=3=(AA^\\top)_{21}$.`, why: `Row 1 dotted with row 2; symmetric.` }
      ],
      answer: `$AA^\\top=\\begin{bmatrix}5&3\\\\3&25\\end{bmatrix}$`
    }
  ]);

  /* ============================================== la-identity-diagonal */
  add("la-identity-diagonal", [
    {
      q: `<p>Write the $3\\times 3$ identity matrix $I_3$.</p>`,
      steps: [
        { do: `Put $1$ on every diagonal position $(i,i)$.`, why: `$I_{ij}=1$ when $i=j$.` },
        { do: `Put $0$ everywhere else.`, why: `$I_{ij}=0$ when $i\\neq j$.` }
      ],
      answer: `$I_3=\\begin{bmatrix}1&0&0\\\\0&1&0\\\\0&0&1\\end{bmatrix}$`
    },
    {
      q: `<p>Compute $Ix$ for $x=(7,-2,5)^\\top$ and $I=I_3$.</p>`,
      steps: [
        { do: `$I$ has $1$ on each diagonal and $0$ elsewhere, so $(Ix)_i=x_i$.`, why: `Each output coordinate copies the matching input coordinate.` },
        { do: `Therefore $Ix=x$, unchanged.`, why: `The identity is the "do nothing" transform.` }
      ],
      answer: `$Ix=(7,-2,5)^\\top$`
    },
    {
      q: `<p>Compute $Dx$ for $D=\\begin{bmatrix}2&0\\\\0&3\\end{bmatrix}$, $x=\\begin{bmatrix}4\\\\5\\end{bmatrix}$.</p>`,
      steps: [
        { do: `Scale coordinate 1 by $d_1=2$: $2\\cdot 4=8$.`, why: `$(Dx)_i=d_i x_i$.` },
        { do: `Scale coordinate 2 by $d_2=3$: $3\\cdot 5=15$.`, why: `Each axis scales independently.` }
      ],
      answer: `$Dx=\\begin{bmatrix}8\\\\15\\end{bmatrix}$`
    },
    {
      q: `<p>What is $I_{34}$ (entry row 3, column 4) and $I_{44}$?</p>`,
      steps: [
        { do: `$I_{34}$: row $\\neq$ column, so $0$.`, why: `Off-diagonal entries are zero.` },
        { do: `$I_{44}$: row $=$ column, so $1$.`, why: `Diagonal entries are one.` }
      ],
      answer: `$I_{34}=0,\\ I_{44}=1$`
    },
    {
      q: `<p>Compute the product of two diagonal matrices $\\begin{bmatrix}2&0\\\\0&5\\end{bmatrix}\\begin{bmatrix}3&0\\\\0&4\\end{bmatrix}$.</p>`,
      steps: [
        { do: `Multiply matching diagonal entries: $2\\cdot 3=6$, $5\\cdot 4=20$.`, why: `Diagonal times diagonal stays diagonal.` },
        { do: `Off-diagonal stays $0$.`, why: `No off-diagonal terms to contribute.` }
      ],
      answer: `$\\begin{bmatrix}6&0\\\\0&20\\end{bmatrix}$`
    },
    {
      q: `<p>What does $cI$ do to a vector, where $c=4$ and $I=I_2$?</p>`,
      steps: [
        { do: `$cI$ has $4$ on the diagonal.`, why: `Scalar times identity.` },
        { do: `$(cI)x=cx$: scale the whole vector by $4$.`, why: `Uniform zoom — direction unchanged, length quadrupled.` }
      ],
      answer: `Scales every vector by $4$: $(cI)x=4x$`
    },
    {
      q: `<p>Compute $D^2$ for $D=\\begin{bmatrix}2&0\\\\0&-3\\end{bmatrix}$.</p>`,
      steps: [
        { do: `Square each diagonal entry: $2^2=4$, $(-3)^2=9$.`, why: `Powers of a diagonal matrix act entrywise on the diagonal.` },
        { do: `Off-diagonal entries stay $0$.`, why: `Products of diagonal matrices remain diagonal.` }
      ],
      answer: `$D^2=\\begin{bmatrix}4&0\\\\0&9\\end{bmatrix}$`
    },
    {
      q: `<p>Find the inverse of $D=\\begin{bmatrix}5&0\\\\0&2\\end{bmatrix}$.</p>`,
      steps: [
        { do: `Reciprocate each diagonal entry: $1/5$ and $1/2$.`, why: `A diagonal matrix scales each axis; the inverse undoes each scale.` },
        { do: `Off-diagonal stays $0$.`, why: `Inverse of a diagonal is diagonal.` }
      ],
      answer: `$D^{-1}=\\begin{bmatrix}1/5&0\\\\0&1/2\\end{bmatrix}$`
    },
    {
      q: `<p>Compute $DA$ for $D=\\begin{bmatrix}2&0\\\\0&3\\end{bmatrix}$, $A=\\begin{bmatrix}1&4\\\\5&6\\end{bmatrix}$. How does left-multiplying by $D$ affect $A$?</p>`,
      steps: [
        { do: `Row 1 of $A$ scaled by $d_1=2$: $[2,8]$.`, why: `Left $D$ scales the rows of $A$.` },
        { do: `Row 2 scaled by $d_2=3$: $[15,18]$.`, why: `Each row gets its diagonal factor.` }
      ],
      answer: `$DA=\\begin{bmatrix}2&8\\\\15&18\\end{bmatrix}$`
    },
    {
      q: `<p>Compute $AD$ for the same $A=\\begin{bmatrix}1&4\\\\5&6\\end{bmatrix}$, $D=\\begin{bmatrix}2&0\\\\0&3\\end{bmatrix}$. How does right-multiplying by $D$ differ?</p>`,
      steps: [
        { do: `Column 1 of $A$ scaled by $d_1=2$: $[2,10]^\\top$.`, why: `Right $D$ scales the columns of $A$.` },
        { do: `Column 2 scaled by $d_2=3$: $[12,18]^\\top$.`, why: `Each column gets its diagonal factor.` }
      ],
      answer: `$AD=\\begin{bmatrix}2&12\\\\10&18\\end{bmatrix}$`
    },
    {
      q: `<p>Prove $AI=A$ entry by entry using the product formula.</p>`,
      steps: [
        { do: `$(AI)_{ij}=\\sum_k A_{ik} I_{kj}$.`, why: `Matrix product definition.` },
        { do: `$I_{kj}=0$ unless $k=j$, where it is $1$.`, why: `Identity is the Kronecker delta $\\delta_{kj}$.` },
        { do: `Only $k=j$ survives: $(AI)_{ij}=A_{ij}$.`, why: `The sum collapses to one term.` }
      ],
      answer: `$AI=A$`
    },
    {
      q: `<p>For diagonal $D=\\operatorname{diag}(2,3,5)$, compute $\\det D$ and $\\operatorname{tr} D$.</p>`,
      steps: [
        { do: `Determinant of a diagonal matrix is the product of diagonal entries: $2\\cdot 3\\cdot 5=30$.`, why: `No off-diagonal interference.` },
        { do: `Trace is the sum: $2+3+5=10$.`, why: `Trace adds the diagonal.` }
      ],
      answer: `$\\det D=30,\\ \\operatorname{tr} D=10$`
    },
    {
      q: `<p>Ridge regression forms $X^\\top X+\\lambda I$. If $X^\\top X=\\begin{bmatrix}4&2\\\\2&1\\end{bmatrix}$ (singular) and $\\lambda=1$, compute the regularized matrix and its determinant.</p>`,
      steps: [
        { do: `Add $\\lambda I=I$: $\\begin{bmatrix}5&2\\\\2&2\\end{bmatrix}$.`, why: `$\\lambda I$ bumps each diagonal entry by $\\lambda$.` },
        { do: `$\\det=5\\cdot 2-2\\cdot 2=10-4=6\\neq 0$.`, why: `Originally $\\det(X^\\top X)=0$ (singular); regularization made it invertible.` }
      ],
      answer: `$\\begin{bmatrix}5&2\\\\2&2\\end{bmatrix}$, $\\det=6$`
    },
    {
      q: `<p>Compute the matrix square root of $D=\\begin{bmatrix}9&0\\\\0&16\\end{bmatrix}$: a diagonal $S$ with $S^2=D$.</p>`,
      steps: [
        { do: `Take $\\sqrt{\\ }$ of each diagonal entry: $\\sqrt{9}=3$, $\\sqrt{16}=4$.`, why: `For diagonal matrices, $S^2$ squares each entry, so $S$ is the entrywise square root.` },
        { do: `Check: $S^2=\\begin{bmatrix}9&0\\\\0&16\\end{bmatrix}=D$. ✔`, why: `Confirms the square root.` }
      ],
      answer: `$S=\\begin{bmatrix}3&0\\\\0&4\\end{bmatrix}$`
    },
    {
      q: `<p>Compute $D^{10}$ where $D=\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}$.</p>`,
      steps: [
        { do: `Raise each diagonal entry to the 10th power: $1^{10}=1$, $(-1)^{10}=1$.`, why: `Diagonal powers act entrywise.` },
        { do: `Result is $I$.`, why: `An even power kills the sign.` }
      ],
      answer: `$D^{10}=\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}=I$`
    },
    {
      q: `<p>A diagonal matrix $D=\\operatorname{diag}(3,0,2)$ has a zero on the diagonal. Is it invertible? Why?</p>`,
      steps: [
        { do: `Inverting needs reciprocals $1/3,\\ 1/0,\\ 1/2$.`, why: `Diagonal inverse reciprocates each entry.` },
        { do: `$1/0$ is undefined.`, why: `A zero diagonal entry has no reciprocal.` },
        { do: `Also $\\det D=3\\cdot 0\\cdot 2=0$.`, why: `Zero determinant means singular.` }
      ],
      answer: `Not invertible (zero on the diagonal $\\Rightarrow \\det=0$)`
    },
    {
      q: `<p>Batch-norm scales feature $i$ by $\\gamma_i$. For features $(3,\\,-1,\\,2)$ scaled by $\\gamma=(2,\\,5,\\,0.5)$, write this as $D\\mathbf{x}$ and compute it.</p>`,
      steps: [
        { do: `Form $D=\\operatorname{diag}(2,5,0.5)$.`, why: `Per-feature scaling is a diagonal matrix.` },
        { do: `$(Dx)_i=\\gamma_i x_i$: $2\\cdot 3=6$, $5\\cdot(-1)=-5$, $0.5\\cdot 2=1$.`, why: `Each coordinate scaled independently.` }
      ],
      answer: `$Dx=(6,\\,-5,\\,1)^\\top$`
    },
    {
      q: `<p>Show that two diagonal matrices always commute: $D_1 D_2=D_2 D_1$ for $D_1=\\operatorname{diag}(a,b)$, $D_2=\\operatorname{diag}(c,d)$.</p>`,
      steps: [
        { do: `$D_1 D_2=\\operatorname{diag}(ac,\\,bd)$.`, why: `Diagonal product multiplies matching entries.` },
        { do: `$D_2 D_1=\\operatorname{diag}(ca,\\,db)$.`, why: `Same multiplication, other order.` },
        { do: `Scalar multiplication commutes: $ac=ca$, $bd=db$.`, why: `Real numbers commute, so the diagonal products are equal.` }
      ],
      answer: `$D_1 D_2=D_2 D_1=\\operatorname{diag}(ac,bd)$`
    }
  ]);

  /* =========================================================== la-inverse */
  add("la-inverse", [
    {
      q: `<p>Which matrices can have an inverse: any matrix, only square, or only diagonal?</p>`,
      steps: [
        { do: `An inverse must satisfy $A^{-1}A=AA^{-1}=I$, both square.`, why: `Only a square matrix can map a space onto itself reversibly.` },
        { do: `Even square matrices need $\\det\\neq 0$ to qualify.`, why: `A singular matrix collapses space and cannot be undone.` }
      ],
      answer: `Only square matrices (and only when $\\det\\neq 0$)`
    },
    {
      q: `<p>Find the inverse of $A=\\begin{bmatrix}3&0\\\\0&2\\end{bmatrix}$.</p>`,
      steps: [
        { do: `Diagonal, so reciprocate: $1/3$ and $1/2$.`, why: `Each independent scale is undone by its reciprocal.` },
        { do: `Off-diagonal stays $0$.`, why: `Inverse of a diagonal matrix is diagonal.` }
      ],
      answer: `$A^{-1}=\\begin{bmatrix}1/3&0\\\\0&1/2\\end{bmatrix}$`
    },
    {
      q: `<p>Compute $\\det A$ for $A=\\begin{bmatrix}2&1\\\\1&1\\end{bmatrix}$ to confirm an inverse exists.</p>`,
      steps: [
        { do: `$ad-bc=2\\cdot 1-1\\cdot 1=1$.`, why: `$2\\times 2$ determinant.` },
        { do: `$1\\neq 0$, so $A$ is invertible.`, why: `Non-zero determinant guarantees an inverse.` }
      ],
      answer: `$\\det A=1$, invertible`
    },
    {
      q: `<p>Find $A^{-1}$ for $A=\\begin{bmatrix}2&1\\\\1&1\\end{bmatrix}$.</p>`,
      steps: [
        { do: `$\\det=2\\cdot 1-1\\cdot 1=1$.`, why: `Need the scaling factor $\\frac{1}{ad-bc}$.` },
        { do: `Swap $a,d$ and negate $b,c$: $\\begin{bmatrix}1&-1\\\\-1&2\\end{bmatrix}$.`, why: `The $2\\times 2$ adjugate recipe.` },
        { do: `Divide by $\\det=1$ (no change).`, why: `Multiply by $\\frac{1}{\\det}$.` }
      ],
      answer: `$A^{-1}=\\begin{bmatrix}1&-1\\\\-1&2\\end{bmatrix}$`
    },
    {
      q: `<p>Find $A^{-1}$ for $A=\\begin{bmatrix}4&3\\\\2&2\\end{bmatrix}$.</p>`,
      steps: [
        { do: `$\\det=4\\cdot 2-3\\cdot 2=8-6=2$.`, why: `Compute $ad-bc$.` },
        { do: `Adjugate: $\\begin{bmatrix}2&-3\\\\-2&4\\end{bmatrix}$.`, why: `Swap diagonal, negate off-diagonal.` },
        { do: `Divide by $2$: $\\begin{bmatrix}1&-3/2\\\\-1&2\\end{bmatrix}$.`, why: `Scale by $\\frac{1}{\\det}$.` }
      ],
      answer: `$A^{-1}=\\begin{bmatrix}1&-3/2\\\\-1&2\\end{bmatrix}$`
    },
    {
      q: `<p>Verify your inverse: compute $A A^{-1}$ for $A=\\begin{bmatrix}2&1\\\\1&1\\end{bmatrix}$, $A^{-1}=\\begin{bmatrix}1&-1\\\\-1&2\\end{bmatrix}$.</p>`,
      steps: [
        { do: `$(AA^{-1})_{11}=2\\cdot 1+1\\cdot(-1)=1$; $(AA^{-1})_{12}=2(-1)+1\\cdot 2=0$.`, why: `Row of $A$ dotted with column of $A^{-1}$.` },
        { do: `$(AA^{-1})_{21}=1\\cdot 1+1(-1)=0$; $(AA^{-1})_{22}=1(-1)+1\\cdot 2=1$.`, why: `Second row.` },
        { do: `Result is $I$. ✔`, why: `Confirms $A^{-1}$ is correct.` }
      ],
      answer: `$AA^{-1}=I$ ✔`
    },
    {
      q: `<p>Why does $A=\\begin{bmatrix}2&4\\\\1&2\\end{bmatrix}$ have no inverse?</p>`,
      steps: [
        { do: `$\\det=2\\cdot 2-4\\cdot 1=4-4=0$.`, why: `Inverse formula divides by $\\det$.` },
        { do: `Dividing by zero is impossible, so no inverse.`, why: `Zero determinant = singular.` }
      ],
      answer: `$\\det=0$, so $A$ is singular (no inverse)`
    },
    {
      q: `<p>Solve $Ax=b$ with $A=\\begin{bmatrix}2&1\\\\1&1\\end{bmatrix}$, $b=\\begin{bmatrix}3\\\\2\\end{bmatrix}$, using $x=A^{-1}b$.</p>`,
      steps: [
        { do: `$A^{-1}=\\begin{bmatrix}1&-1\\\\-1&2\\end{bmatrix}$ (from before).`, why: `$\\det=1$, swap and negate.` },
        { do: `$x=A^{-1}b=\\begin{bmatrix}1\\cdot 3+(-1)\\cdot 2\\\\(-1)\\cdot 3+2\\cdot 2\\end{bmatrix}=\\begin{bmatrix}1\\\\1\\end{bmatrix}$.`, why: `Apply the inverse to $b$.` },
        { do: `Check: $A\\begin{bmatrix}1\\\\1\\end{bmatrix}=\\begin{bmatrix}3\\\\2\\end{bmatrix}=b$. ✔`, why: `Verifies the solution.` }
      ],
      answer: `$x=\\begin{bmatrix}1\\\\1\\end{bmatrix}$`
    },
    {
      q: `<p>Find the inverse of the rotation $R=\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}$.</p>`,
      steps: [
        { do: `$\\det=0\\cdot 0-(-1)\\cdot 1=1$.`, why: `Rotations have determinant $1$.` },
        { do: `Adjugate: $\\begin{bmatrix}0&1\\\\-1&0\\end{bmatrix}$, divide by $1$.`, why: `Swap diagonal, negate off-diagonal.` },
        { do: `Note $R^{-1}=R^\\top$.`, why: `Rotations are orthogonal: inverse equals transpose.` }
      ],
      answer: `$R^{-1}=\\begin{bmatrix}0&1\\\\-1&0\\end{bmatrix}$`
    },
    {
      q: `<p>Show $(AB)^{-1}=B^{-1}A^{-1}$ (state why the order reverses).</p>`,
      steps: [
        { do: `Test $B^{-1}A^{-1}$ as the inverse: $(AB)(B^{-1}A^{-1})=A(BB^{-1})A^{-1}$.`, why: `Associativity lets us group the middle.` },
        { do: `$BB^{-1}=I$, so this is $AIA^{-1}=AA^{-1}=I$.`, why: `Inverses cancel from the inside out.` },
        { do: `So $B^{-1}A^{-1}$ undoes $AB$.`, why: `$AB$ does $B$ then $A$, so undo $A$ first, then $B$.` }
      ],
      answer: `$(AB)^{-1}=B^{-1}A^{-1}$`
    },
    {
      q: `<p>The inverse of $A$ is $A^{-1}=\\begin{bmatrix}1&-1\\\\-1&2\\end{bmatrix}$. Recover $A$.</p>`,
      steps: [
        { do: `$A=(A^{-1})^{-1}$. $\\det(A^{-1})=1\\cdot 2-(-1)(-1)=2-1=1$.`, why: `Invert the inverse to get back $A$.` },
        { do: `Adjugate of $A^{-1}$: $\\begin{bmatrix}2&1\\\\1&1\\end{bmatrix}$, divide by $1$.`, why: `Swap and negate.` }
      ],
      answer: `$A=\\begin{bmatrix}2&1\\\\1&1\\end{bmatrix}$`
    },
    {
      q: `<p>If $\\det A=5$, what is $\\det(A^{-1})$?</p>`,
      steps: [
        { do: `$\\det(A)\\det(A^{-1})=\\det(AA^{-1})=\\det I=1$.`, why: `Determinant is multiplicative.` },
        { do: `So $\\det(A^{-1})=1/\\det A=1/5$.`, why: `Solve for the unknown.` }
      ],
      answer: `$\\det(A^{-1})=1/5$`
    },
    {
      q: `<p>Find the inverse of the $3\\times 3$ diagonal matrix $D=\\operatorname{diag}(2,4,5)$.</p>`,
      steps: [
        { do: `Reciprocate each diagonal entry: $1/2,\\,1/4,\\,1/5$.`, why: `Diagonal inverse reciprocates entries.` },
        { do: `Off-diagonal entries remain $0$.`, why: `The inverse of a diagonal matrix stays diagonal.` }
      ],
      answer: `$D^{-1}=\\operatorname{diag}(1/2,\\,1/4,\\,1/5)$`
    },
    {
      q: `<p>Invert the upper-triangular $A=\\begin{bmatrix}1&2\\\\0&1\\end{bmatrix}$.</p>`,
      steps: [
        { do: `$\\det=1\\cdot 1-2\\cdot 0=1$.`, why: `Triangular determinant is the diagonal product.` },
        { do: `Adjugate: swap diagonal (still $1,1$), negate off-diagonal $2\\to-2$: $\\begin{bmatrix}1&-2\\\\0&1\\end{bmatrix}$.`, why: `$2\\times 2$ recipe.` }
      ],
      answer: `$A^{-1}=\\begin{bmatrix}1&-2\\\\0&1\\end{bmatrix}$`
    },
    {
      q: `<p>Use cofactors to find $A^{-1}$ for the $3\\times 3$ $A=\\begin{bmatrix}1&0&2\\\\0&1&0\\\\0&0&1\\end{bmatrix}$.</p>`,
      steps: [
        { do: `It is upper-triangular with $1$'s on the diagonal, $\\det=1$.`, why: `Triangular determinant is the diagonal product.` },
        { do: `$A$ adds $2\\times$(coordinate 3) into coordinate 1; everything else is the identity.`, why: `Only the $(1,3)$ entry is non-trivial.` },
        { do: `So $A^{-1}$ subtracts it: place $-2$ at $(1,3)$.`, why: `Undo the shear by negating it.` }
      ],
      answer: `$A^{-1}=\\begin{bmatrix}1&0&-2\\\\0&1&0\\\\0&0&1\\end{bmatrix}$`
    },
    {
      q: `<p>Compute the full $3\\times 3$ inverse of $A=\\begin{bmatrix}2&0&0\\\\1&3&0\\\\0&1&1\\end{bmatrix}$ (lower-triangular).</p>`,
      steps: [
        { do: `$\\det=2\\cdot 3\\cdot 1=6\\neq 0$.`, why: `Lower-triangular determinant is the diagonal product.` },
        { do: `Solve $A^{-1}=M$ column by column from $AM=I$. Column 1: solve $A m=e_1$ giving $m=(1/2,\\,-1/6,\\,1/6)^\\top$.`, why: `Forward substitution down the triangle.` },
        { do: `Column 2: $Am=e_2\\Rightarrow m=(0,\\,1/3,\\,-1/3)^\\top$. Column 3: $m=(0,0,1)^\\top$.`, why: `Repeat substitution for each unit vector.` }
      ],
      answer: `$A^{-1}=\\begin{bmatrix}1/2&0&0\\\\-1/6&1/3&0\\\\1/6&-1/3&1\\end{bmatrix}$`
    },
    {
      q: `<p>The least-squares solution is $w=(X^\\top X)^{-1}X^\\top y$. With $X^\\top X=\\begin{bmatrix}2&0\\\\0&8\\end{bmatrix}$ and $X^\\top y=\\begin{bmatrix}4\\\\8\\end{bmatrix}$, solve for $w$.</p>`,
      steps: [
        { do: `$(X^\\top X)^{-1}=\\operatorname{diag}(1/2,\\,1/8)$.`, why: `Reciprocate the diagonal.` },
        { do: `$w=(X^\\top X)^{-1}(X^\\top y)=(\\tfrac12\\cdot 4,\\ \\tfrac18\\cdot 8)=(2,\\,1)$.`, why: `Apply the inverse to the right-hand side.` }
      ],
      answer: `$w=\\begin{bmatrix}2\\\\1\\end{bmatrix}$`
    },
    {
      q: `<p>For what value of $k$ does $A=\\begin{bmatrix}k&2\\\\3&6\\end{bmatrix}$ FAIL to have an inverse?</p>`,
      steps: [
        { do: `$\\det=6k-6$.`, why: `$ad-bc$ with $a=k$.` },
        { do: `Set $\\det=0$: $6k-6=0\\Rightarrow k=1$.`, why: `Singular exactly when the determinant vanishes.` }
      ],
      answer: `$k=1$`
    },
    {
      q: `<p>Newton's method needs $H^{-1}\\nabla f$. With $H=\\begin{bmatrix}4&1\\\\1&3\\end{bmatrix}$ and $\\nabla f=\\begin{bmatrix}2\\\\1\\end{bmatrix}$, compute the step $H^{-1}\\nabla f$.</p>`,
      steps: [
        { do: `$\\det H=4\\cdot 3-1\\cdot 1=11$; $H^{-1}=\\tfrac{1}{11}\\begin{bmatrix}3&-1\\\\-1&4\\end{bmatrix}$.`, why: `$2\\times 2$ inverse recipe.` },
        { do: `$H^{-1}\\nabla f=\\tfrac{1}{11}\\begin{bmatrix}3\\cdot 2-1\\cdot 1\\\\-1\\cdot 2+4\\cdot 1\\end{bmatrix}=\\tfrac{1}{11}\\begin{bmatrix}5\\\\2\\end{bmatrix}$.`, why: `Apply $H^{-1}$ to the gradient.` }
      ],
      answer: `$H^{-1}\\nabla f=\\tfrac{1}{11}\\begin{bmatrix}5\\\\2\\end{bmatrix}$`
    }
  ]);

  /* ======================================================= la-determinant */
  add("la-determinant", [
    {
      q: `<p>Compute $\\det\\begin{bmatrix}3&1\\\\1&2\\end{bmatrix}$.</p>`,
      steps: [
        { do: `$ad-bc=3\\cdot 2-1\\cdot 1$.`, why: `$2\\times 2$ determinant: main diagonal minus off-diagonal.` },
        { do: `$6-1=5$.`, why: `Subtract.` }
      ],
      answer: `$5$`
    },
    {
      q: `<p>Compute $\\det\\begin{bmatrix}2&4\\\\1&2\\end{bmatrix}$ and say if the matrix is invertible.</p>`,
      steps: [
        { do: `$2\\cdot 2-4\\cdot 1=4-4=0$.`, why: `Apply $ad-bc$.` },
        { do: `Zero determinant means singular.`, why: `No inverse when $\\det=0$.` }
      ],
      answer: `$\\det=0$, not invertible`
    },
    {
      q: `<p>What is the determinant of $I_2$? Of any identity $I_n$?</p>`,
      steps: [
        { do: `$\\det I_2=1\\cdot 1-0\\cdot 0=1$.`, why: `Diagonal product, off-diagonal zero.` },
        { do: `Generally $\\det I_n=1$.`, why: `Identity scales no area.` }
      ],
      answer: `$\\det I_n=1$`
    },
    {
      q: `<p>Compute the determinant of the diagonal matrix $D=\\operatorname{diag}(2,3,4)$.</p>`,
      steps: [
        { do: `Multiply the diagonal: $2\\cdot 3\\cdot 4$.`, why: `Determinant of a diagonal (or triangular) matrix is the product of its diagonal.` },
        { do: `$2\\cdot 3\\cdot 4=24$.`, why: `Carry out the multiplication.` }
      ],
      answer: `$24$`
    },
    {
      q: `<p>A matrix $A$ has $\\det A=3$. Geometrically, what does $A$ do to areas?</p>`,
      steps: [
        { do: `$|\\det A|=3$.`, why: `The absolute determinant is the area-scaling factor.` },
        { do: `Sign is positive, so orientation is preserved.`, why: `Positive determinant: no mirror flip.` }
      ],
      answer: `Multiplies area by $3$, orientation preserved`
    },
    {
      q: `<p>Compute $\\det\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}$ (a rotation).</p>`,
      steps: [
        { do: `$0\\cdot 0-(-1)\\cdot 1=0+1=1$.`, why: `$ad-bc$.` },
        { do: `Rotations preserve area, so $\\det=1$.`, why: `No stretching, no flip.` }
      ],
      answer: `$1$`
    },
    {
      q: `<p>Compute the $3\\times 3$ determinant $\\det\\begin{bmatrix}1&2&3\\\\0&4&5\\\\0&0&6\\end{bmatrix}$.</p>`,
      steps: [
        { do: `It is upper-triangular.`, why: `All entries below the diagonal are zero.` },
        { do: `Determinant is the diagonal product: $1\\cdot 4\\cdot 6=24$.`, why: `Triangular determinant = product of diagonal.` }
      ],
      answer: `$24$`
    },
    {
      q: `<p>Compute $\\det\\begin{bmatrix}1&2&3\\\\4&5&6\\\\7&8&10\\end{bmatrix}$ by cofactor expansion along row 1.</p>`,
      steps: [
        { do: `$1\\cdot\\det\\begin{bmatrix}5&6\\\\8&10\\end{bmatrix}-2\\cdot\\det\\begin{bmatrix}4&6\\\\7&10\\end{bmatrix}+3\\cdot\\det\\begin{bmatrix}4&5\\\\7&8\\end{bmatrix}$.`, why: `Expand along row 1 with alternating signs.` },
        { do: `Minors: $50-48=2$, $40-42=-2$, $32-35=-3$.`, why: `Each $2\\times 2$ determinant.` },
        { do: `$1\\cdot 2-2\\cdot(-2)+3\\cdot(-3)=2+4-9=-3$.`, why: `Combine with cofactor signs.` }
      ],
      answer: `$-3$`
    },
    {
      q: `<p>Compute $\\det\\begin{bmatrix}2&0&1\\\\0&3&0\\\\1&0&2\\end{bmatrix}$ expanding along the middle row.</p>`,
      steps: [
        { do: `Middle row is $[0,3,0]$; only the $3$ contributes.`, why: `Expanding along a sparse row saves work.` },
        { do: `Cofactor of the $(2,2)$ entry: $+\\det\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}=4-1=3$.`, why: `Sign $(-1)^{2+2}=+1$, delete row 2 and column 2.` },
        { do: `$3\\cdot 3=9$.`, why: `Multiply entry by its cofactor.` }
      ],
      answer: `$9$`
    },
    {
      q: `<p>$\\det A=4$ and $\\det B=5$. Find $\\det(AB)$.</p>`,
      steps: [
        { do: `$\\det(AB)=\\det A\\cdot\\det B$.`, why: `Determinant is multiplicative.` },
        { do: `$4\\cdot 5=20$.`, why: `Multiply.` }
      ],
      answer: `$20$`
    },
    {
      q: `<p>For a $3\\times 3$ matrix $A$ with $\\det A=2$, find $\\det(2A)$.</p>`,
      steps: [
        { do: `Scaling all of $A$ by $2$ scales each of the $3$ columns by $2$.`, why: `$\\det(cA)=c^n\\det A$ for an $n\\times n$ matrix.` },
        { do: `$2^3\\cdot 2=8\\cdot 2=16$.`, why: `Three columns, each contributes a factor $2$.` }
      ],
      answer: `$16$`
    },
    {
      q: `<p>Swapping two rows of a matrix does what to the determinant? Check with $\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$ vs $\\begin{bmatrix}3&4\\\\1&2\\end{bmatrix}$.</p>`,
      steps: [
        { do: `Original: $1\\cdot 4-2\\cdot 3=-2$.`, why: `$ad-bc$.` },
        { do: `Swapped: $3\\cdot 2-4\\cdot 1=2$.`, why: `Recompute.` },
        { do: `Sign flipped.`, why: `A single row swap multiplies the determinant by $-1$.` }
      ],
      answer: `It flips sign: $-2\\to+2$`
    },
    {
      q: `<p>For what value of $t$ is $\\begin{bmatrix}t&1\\\\4&t\\end{bmatrix}$ singular?</p>`,
      steps: [
        { do: `$\\det=t^2-4$.`, why: `$ad-bc$ with $a=d=t$.` },
        { do: `Set $t^2-4=0\\Rightarrow t=\\pm 2$.`, why: `Singular when the determinant is zero.` }
      ],
      answer: `$t=2$ or $t=-2$`
    },
    {
      q: `<p>Compute the eigenvalues of $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$ via $\\det(A-\\lambda I)=0$.</p>`,
      steps: [
        { do: `$A-\\lambda I=\\begin{bmatrix}2-\\lambda&1\\\\1&2-\\lambda\\end{bmatrix}$.`, why: `Subtract $\\lambda$ from the diagonal.` },
        { do: `$\\det=(2-\\lambda)^2-1=0$.`, why: `Characteristic equation.` },
        { do: `$(2-\\lambda)^2=1\\Rightarrow 2-\\lambda=\\pm 1\\Rightarrow \\lambda=1$ or $3$.`, why: `Solve for $\\lambda$.` }
      ],
      answer: `$\\lambda=1$ and $\\lambda=3$`
    },
    {
      q: `<p>Use cofactor expansion along column 1: $\\det\\begin{bmatrix}1&2&3\\\\0&1&4\\\\5&6&0\\end{bmatrix}$.</p>`,
      steps: [
        { do: `Column 1 is $[1,0,5]^\\top$; expand using its non-zero entries.`, why: `Cofactor expansion along a column.` },
        { do: `$1\\cdot\\det\\begin{bmatrix}1&4\\\\6&0\\end{bmatrix}+5\\cdot\\det\\begin{bmatrix}2&3\\\\1&4\\end{bmatrix}$.`, why: `Signs $(-1)^{1+1}=+$, $(-1)^{3+1}=+$.` },
        { do: `$1\\cdot(0-24)+5\\cdot(8-3)=-24+25=1$.`, why: `Evaluate the two minors and combine.` }
      ],
      answer: `$1$`
    },
    {
      q: `<p>The columns of $A=\\begin{bmatrix}2&4\\\\3&6\\end{bmatrix}$ are parallel. Predict and verify $\\det A$.</p>`,
      steps: [
        { do: `Column 2 $=2\\times$ column 1.`, why: `Parallel columns are linearly dependent.` },
        { do: `Dependent columns span zero area, so $\\det=0$. Check: $2\\cdot 6-4\\cdot 3=0$.`, why: `The parallelogram collapses to a line.` }
      ],
      answer: `$\\det A=0$`
    },
    {
      q: `<p>The multivariate Gaussian uses $\\det\\Sigma$. For $\\Sigma=\\begin{bmatrix}4&2\\\\2&3\\end{bmatrix}$, compute $\\det\\Sigma$.</p>`,
      steps: [
        { do: `Apply $ad-bc$: $4\\cdot 3-2\\cdot 2$.`, why: `$2\\times 2$ determinant.` },
        { do: `$12-4=8$.`, why: `$\\det\\Sigma$ is the covariance "volume" in the Gaussian density.` }
      ],
      answer: `$8$`
    },
    {
      q: `<p>A normalizing flow multiplies probability by $|\\det J|$ for Jacobian $J=\\begin{bmatrix}2&0\\\\0&0.5\\end{bmatrix}$. By what factor does volume change?</p>`,
      steps: [
        { do: `$\\det J=2\\cdot 0.5=1$.`, why: `Diagonal product.` },
        { do: `$|\\det J|=1$: volume is preserved.`, why: `Stretch in one axis is exactly cancelled by squeeze in the other.` }
      ],
      answer: `Volume unchanged ($|\\det J|=1$)`
    },
    {
      q: `<p>Compute $\\det\\begin{bmatrix}1&1&1\\\\1&2&3\\\\1&3&6\\end{bmatrix}$ by row-reducing to triangular form.</p>`,
      steps: [
        { do: `Subtract row 1 from rows 2 and 3: $\\begin{bmatrix}1&1&1\\\\0&1&2\\\\0&2&5\\end{bmatrix}$.`, why: `Adding a multiple of one row to another leaves $\\det$ unchanged.` },
        { do: `Subtract $2\\times$ row 2 from row 3: $\\begin{bmatrix}1&1&1\\\\0&1&2\\\\0&0&1\\end{bmatrix}$.`, why: `Reach upper-triangular form.` },
        { do: `Diagonal product: $1\\cdot 1\\cdot 1=1$.`, why: `Triangular determinant.` }
      ],
      answer: `$1$`
    },
    {
      q: `<p>For an orthogonal matrix $Q$ (with $Q^\\top Q=I$), what are the possible values of $\\det Q$?</p>`,
      steps: [
        { do: `Take $\\det$ of $Q^\\top Q=I$: $\\det(Q^\\top)\\det(Q)=1$.`, why: `Determinant is multiplicative; $\\det I=1$.` },
        { do: `$\\det(Q^\\top)=\\det(Q)$, so $(\\det Q)^2=1$.`, why: `Transpose preserves the determinant.` },
        { do: `$\\det Q=\\pm 1$.`, why: `$+1$ rotation, $-1$ reflection.` }
      ],
      answer: `$\\det Q=\\pm 1$`
    }
  ]);

  /* ============================================================= la-trace */
  add("la-trace", [
    {
      q: `<p>Compute $\\operatorname{tr}\\begin{bmatrix}2&7\\\\1&3\\end{bmatrix}$.</p>`,
      steps: [
        { do: `Pick out the diagonal entries $2$ and $3$.`, why: `Trace ignores off-diagonal entries.` },
        { do: `Add them: $2+3=5$.`, why: `Sum the diagonal.` }
      ],
      answer: `$5$`
    },
    {
      q: `<p>Compute the trace of $\\begin{bmatrix}1&0&0\\\\4&5&2\\\\3&1&9\\end{bmatrix}$.</p>`,
      steps: [
        { do: `Diagonal entries: $1,5,9$.`, why: `Pick out $A_{ii}$.` },
        { do: `Sum: $1+5+9=15$.`, why: `Add them.` }
      ],
      answer: `$15$`
    },
    {
      q: `<p>What is $\\operatorname{tr}(I_4)$?</p>`,
      steps: [
        { do: `Four $1$'s on the diagonal.`, why: `Identity has ones on the diagonal.` },
        { do: `$1+1+1+1=4$.`, why: `$\\operatorname{tr}(I_n)=n$.` }
      ],
      answer: `$4$`
    },
    {
      q: `<p>A $2\\times 2$ matrix has eigenvalues $3$ and $7$. What is its trace?</p>`,
      steps: [
        { do: `Trace equals the sum of eigenvalues.`, why: `$\\operatorname{tr}(A)=\\sum_i\\lambda_i$.` },
        { do: `$3+7=10$.`, why: `Add the eigenvalues.` }
      ],
      answer: `$10$`
    },
    {
      q: `<p>Compute the trace of the diagonal matrix $\\operatorname{diag}(2,-3,5,1)$.</p>`,
      steps: [
        { do: `The diagonal entries are $2,-3,5,1$.`, why: `Trace adds the diagonal directly.` },
        { do: `Sum: $2-3+5+1=5$.`, why: `Combine, watching the negative entry.` }
      ],
      answer: `$5$`
    },
    {
      q: `<p>For a triangular matrix $A=\\begin{bmatrix}2&1\\\\0&3\\end{bmatrix}$, find its eigenvalues and confirm their sum equals the trace.</p>`,
      steps: [
        { do: `Triangular eigenvalues sit on the diagonal: $2$ and $3$.`, why: `$\\det(A-\\lambda I)=(2-\\lambda)(3-\\lambda)$ for triangular $A$.` },
        { do: `Sum $=5$; trace $=2+3=5$.`, why: `Trace = sum of eigenvalues. ✔` }
      ],
      answer: `Eigenvalues $2,3$; trace $=5$`
    },
    {
      q: `<p>Verify $\\operatorname{tr}(AB)=\\operatorname{tr}(BA)$ for $A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$, $B=\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$.</p>`,
      steps: [
        { do: `$AB=\\begin{bmatrix}2&1\\\\4&3\\end{bmatrix}$, $\\operatorname{tr}=2+3=5$.`, why: `Compute then add diagonal.` },
        { do: `$BA=\\begin{bmatrix}3&4\\\\1&2\\end{bmatrix}$, $\\operatorname{tr}=3+2=5$.`, why: `Other order.` },
        { do: `Equal.`, why: `Cyclic property of the trace.` }
      ],
      answer: `Both traces $=5$`
    },
    {
      q: `<p>If $\\operatorname{tr}(A)=10$ and $A$ is $3\\times 3$ with eigenvalues $\\lambda_1=2$, $\\lambda_2=3$, find $\\lambda_3$.</p>`,
      steps: [
        { do: `$\\lambda_1+\\lambda_2+\\lambda_3=\\operatorname{tr}(A)=10$.`, why: `Trace = sum of eigenvalues.` },
        { do: `$2+3+\\lambda_3=10\\Rightarrow\\lambda_3=5$.`, why: `Solve.` }
      ],
      answer: `$\\lambda_3=5$`
    },
    {
      q: `<p>Compute $\\operatorname{tr}(A^\\top A)$ for $A=\\begin{bmatrix}1&2\\\\3&0\\end{bmatrix}$ (the squared Frobenius norm).</p>`,
      steps: [
        { do: `$\\operatorname{tr}(A^\\top A)=\\sum_{i,j}A_{ij}^2$.`, why: `This identity gives the sum of all squared entries.` },
        { do: `$1^2+2^2+3^2+0^2=1+4+9+0=14$.`, why: `Add squared entries.` }
      ],
      answer: `$14$`
    },
    {
      q: `<p>Show $\\operatorname{tr}(A+B)=\\operatorname{tr}(A)+\\operatorname{tr}(B)$.</p>`,
      steps: [
        { do: `$\\operatorname{tr}(A+B)=\\sum_i (A+B)_{ii}=\\sum_i (A_{ii}+B_{ii})$.`, why: `Diagonal of a sum is the sum of diagonals.` },
        { do: `Split the sum: $\\sum_i A_{ii}+\\sum_i B_{ii}=\\operatorname{tr}(A)+\\operatorname{tr}(B)$.`, why: `Trace is linear.` }
      ],
      answer: `$\\operatorname{tr}(A+B)=\\operatorname{tr}(A)+\\operatorname{tr}(B)$`
    },
    {
      q: `<p>A projection matrix $P$ satisfies $P^2=P$; its trace equals its rank. For $P=\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix}$, find $\\operatorname{tr}(P)$ and its rank.</p>`,
      steps: [
        { do: `$\\operatorname{tr}(P)=1+0=1$.`, why: `Sum the diagonal.` },
        { do: `Rank is the number of non-zero independent columns: $1$.`, why: `For a projection, trace = rank = dimension projected onto.` }
      ],
      answer: `$\\operatorname{tr}(P)=1$, rank $=1$`
    },
    {
      q: `<p>$A$ is $2\\times 2$ with $\\operatorname{tr}(A)=5$ and $\\det A=6$. Find its eigenvalues.</p>`,
      steps: [
        { do: `Eigenvalues satisfy $\\lambda_1+\\lambda_2=\\operatorname{tr}=5$ and $\\lambda_1\\lambda_2=\\det=6$.`, why: `Trace = sum, determinant = product of eigenvalues.` },
        { do: `Solve $\\lambda^2-5\\lambda+6=0\\Rightarrow(\\lambda-2)(\\lambda-3)=0$.`, why: `Characteristic equation from sum and product.` }
      ],
      answer: `$\\lambda=2$ and $\\lambda=3$`
    },
    {
      q: `<p>Use the cyclic property to simplify $\\operatorname{tr}(ABC)$ — name an equal expression.</p>`,
      steps: [
        { do: `Treat $A$ and $(BC)$ as two factors: $\\operatorname{tr}(A(BC))=\\operatorname{tr}((BC)A)$.`, why: `$\\operatorname{tr}(XY)=\\operatorname{tr}(YX)$.` },
        { do: `So $\\operatorname{tr}(ABC)=\\operatorname{tr}(BCA)=\\operatorname{tr}(CAB)$.`, why: `Trace is invariant under cyclic rotation of the factors.` }
      ],
      answer: `$\\operatorname{tr}(ABC)=\\operatorname{tr}(BCA)=\\operatorname{tr}(CAB)$`
    },
    {
      q: `<p>Compute $\\operatorname{tr}(x y^\\top)$ for column vectors $x=(1,2,3)^\\top$, $y=(4,5,6)^\\top$, and note what scalar it equals.</p>`,
      steps: [
        { do: `By the cyclic property, $\\operatorname{tr}(xy^\\top)=\\operatorname{tr}(y^\\top x)=y^\\top x$.`, why: `$y^\\top x$ is already a $1\\times 1$ scalar.` },
        { do: `$y^\\top x=4\\cdot 1+5\\cdot 2+6\\cdot 3=4+10+18=32$.`, why: `Compute the dot product.` }
      ],
      answer: `$\\operatorname{tr}(xy^\\top)=x^\\top y=32$`
    },
    {
      q: `<p>The total variance of data is $\\operatorname{tr}(\\Sigma)$. For $\\Sigma=\\begin{bmatrix}4&1&0\\\\1&9&2\\\\0&2&7\\end{bmatrix}$, find it.</p>`,
      steps: [
        { do: `The diagonal variances are $4,9,7$.`, why: `Diagonal of $\\Sigma$ holds each feature's variance.` },
        { do: `Sum them: $4+9+7=20$.`, why: `Trace of covariance = total variance across features.` }
      ],
      answer: `$20$`
    },
    {
      q: `<p>If $B=P^{-1}AP$ (a similarity transform), show $\\operatorname{tr}(B)=\\operatorname{tr}(A)$.</p>`,
      steps: [
        { do: `$\\operatorname{tr}(P^{-1}AP)=\\operatorname{tr}(AP P^{-1})$.`, why: `Cyclic property: rotate $P^{-1}$ to the end.` },
        { do: `$PP^{-1}=I$, so this is $\\operatorname{tr}(A)$.`, why: `Trace is similarity-invariant.` }
      ],
      answer: `$\\operatorname{tr}(B)=\\operatorname{tr}(A)$`
    },
    {
      q: `<p>A $3\\times 3$ matrix has eigenvalues $1,4,4$. Find its trace, and check it can match a diagonal $(2,3,4)$.</p>`,
      steps: [
        { do: `Trace $=1+4+4=9$.`, why: `Sum of eigenvalues.` },
        { do: `Diagonal $(2,3,4)$ sums to $9$.`, why: `Trace must equal the diagonal sum too.` },
        { do: `Consistent.`, why: `Both give $9$.` }
      ],
      answer: `Trace $=9$; consistent`
    },
    {
      q: `<p>In hat-matrix theory the effective degrees of freedom is $\\operatorname{tr}(H)$ for $H=X(X^\\top X)^{-1}X^\\top$. If $H$ has eigenvalues all either $0$ or $1$ with five $1$'s, what is $\\operatorname{tr}(H)$?</p>`,
      steps: [
        { do: `$\\operatorname{tr}(H)=\\sum_i\\lambda_i$.`, why: `Trace = sum of eigenvalues.` },
        { do: `Five eigenvalues equal $1$, the rest $0$: sum $=5$.`, why: `Counts the effective parameters used.` }
      ],
      answer: `$\\operatorname{tr}(H)=5$`
    }
  ]);

  /* ================================================ la-rank-independence */
  add("la-rank-independence", [
    {
      q: `<p>Are $\\begin{bmatrix}1\\\\0\\end{bmatrix}$ and $\\begin{bmatrix}0\\\\1\\end{bmatrix}$ linearly independent?</p>`,
      steps: [
        { do: `Neither is a scalar multiple of the other.`, why: `Independence means no vector is built from the others.` },
        { do: `They point along different axes.`, why: `They span the whole plane.` }
      ],
      answer: `Yes, independent`
    },
    {
      q: `<p>Are $\\begin{bmatrix}1\\\\2\\end{bmatrix}$ and $\\begin{bmatrix}2\\\\4\\end{bmatrix}$ independent?</p>`,
      steps: [
        { do: `Second $=2\\times$ first.`, why: `A scalar multiple is dependent.` },
        { do: `They lie on one line.`, why: `Dependence collapses to a single direction.` }
      ],
      answer: `No, dependent`
    },
    {
      q: `<p>What is the rank of $\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}$?</p>`,
      steps: [
        { do: `Neither column is a multiple of the other.`, why: `They span two independent directions.` },
        { do: `Two independent columns means rank $2$.`, why: `Rank counts independent columns.` }
      ],
      answer: `$2$`
    },
    {
      q: `<p>What is the rank of $\\begin{bmatrix}1&2\\\\2&4\\end{bmatrix}$?</p>`,
      steps: [
        { do: `Column 2 $=2\\times$ column 1.`, why: `One column is redundant.` },
        { do: `Only one independent direction remains.`, why: `Rank counts independent columns.` }
      ],
      answer: `$1$`
    },
    {
      q: `<p>What is the rank of the zero matrix $\\begin{bmatrix}0&0\\\\0&0\\end{bmatrix}$?</p>`,
      steps: [
        { do: `All columns are zero.`, why: `Zero vectors span no direction.` },
        { do: `No independent columns, so rank $0$.`, why: `Only the zero matrix has rank $0$.` }
      ],
      answer: `$0$`
    },
    {
      q: `<p>A $4\\times 6$ matrix has at most what rank?</p>`,
      steps: [
        { do: `Rank $\\le\\min(\\text{rows},\\text{cols})=\\min(4,6)$.`, why: `Rank can't exceed either dimension.` },
        { do: `$\\min(4,6)=4$.`, why: `There can be at most $4$ independent rows.` }
      ],
      answer: `At most $4$`
    },
    {
      q: `<p>Find the rank of $A=\\begin{bmatrix}1&2&3\\\\2&4&6\\end{bmatrix}$ by inspection.</p>`,
      steps: [
        { do: `Row 2 $=2\\times$ row 1.`, why: `Rows are also dependent here.` },
        { do: `Only one independent direction.`, why: `Rank = number of independent rows = number of independent columns.` }
      ],
      answer: `$1$`
    },
    {
      q: `<p>Use row reduction to find the rank of $A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$.</p>`,
      steps: [
        { do: `Row 2 $-3\\times$ row 1: $[0,\\,4-6]=[0,-2]$.`, why: `Eliminate the first column below the pivot.` },
        { do: `Two non-zero pivot rows remain: $[1,2]$ and $[0,-2]$.`, why: `Number of pivots = rank.` }
      ],
      answer: `$2$ (full rank)`
    },
    {
      q: `<p>Show that $v_3=\\begin{bmatrix}2\\\\3\\\\0\\end{bmatrix}$ depends on $v_1=\\begin{bmatrix}1\\\\0\\\\0\\end{bmatrix}$ and $v_2=\\begin{bmatrix}0\\\\1\\\\0\\end{bmatrix}$, then give the rank.</p>`,
      steps: [
        { do: `$v_3=2v_1+3v_2$.`, why: `It is a combination of the first two.` },
        { do: `So only $v_1,v_2$ are independent.`, why: `$v_3$ adds no new direction.` }
      ],
      answer: `Rank $=2$`
    },
    {
      q: `<p>Find the rank of $A=\\begin{bmatrix}1&2&1\\\\2&4&3\\\\3&6&4\\end{bmatrix}$ by row reduction.</p>`,
      steps: [
        { do: `R2 $-2$R1 $=[0,0,1]$; R3 $-3$R1 $=[0,0,1]$.`, why: `Clear column 1 below the pivot.` },
        { do: `R3 $-$ R2 $=[0,0,0]$.`, why: `Second new row is a duplicate.` },
        { do: `Pivots in rows $[1,2,1]$ and $[0,0,1]$: two of them.`, why: `Rank = number of pivots.` }
      ],
      answer: `$2$`
    },
    {
      q: `<p>For which $k$ is $A=\\begin{bmatrix}1&2\\\\2&k\\end{bmatrix}$ rank-deficient (rank $&lt;2$)?</p>`,
      steps: [
        { do: `Rank drops when columns are dependent, i.e. $\\det=0$.`, why: `Full rank $\\Leftrightarrow$ invertible $\\Leftrightarrow\\det\\neq 0$.` },
        { do: `$\\det=k-4=0\\Rightarrow k=4$.`, why: `Solve.` }
      ],
      answer: `$k=4$`
    },
    {
      q: `<p>If $A$ is $3\\times 3$ with rank $2$, is it invertible? What is $\\det A$?</p>`,
      steps: [
        { do: `Rank $2&lt;3$ means a column is dependent.`, why: `Not full rank.` },
        { do: `Dependent column $\\Rightarrow$ singular $\\Rightarrow\\det A=0$.`, why: `Some non-zero $w$ has $Aw=0$.` }
      ],
      answer: `Not invertible; $\\det A=0$`
    },
    {
      q: `<p>An outer product $A=uv^\\top$ with non-zero $u,v$ has what rank?</p>`,
      steps: [
        { do: `Every column of $A$ is $v_j\\,u$ — a scalar times $u$.`, why: `Column $j$ is $u$ scaled by $v_j$.` },
        { do: `All columns lie along $u$: one independent direction.`, why: `Outer products are rank $1$.` }
      ],
      answer: `Rank $1$`
    },
    {
      q: `<p>Find the rank of $A=\\begin{bmatrix}1&0&2\\\\0&1&3\\\\1&1&5\\end{bmatrix}$.</p>`,
      steps: [
        { do: `R3 $-$ R1 $-$ R2 $=[0,0,0]$.`, why: `Row 3 is the sum of the first two.` },
        { do: `R1 and R2 are independent (different pivot columns).`, why: `Two pivots survive.` }
      ],
      answer: `$2$`
    },
    {
      q: `<p>Multicollinearity: features $x_1,x_2$ with $x_2=3x_1$ form columns of $X$ ($n\\times 2$). What is $\\operatorname{rank}(X^\\top X)$?</p>`,
      steps: [
        { do: `Columns of $X$ are dependent, so $\\operatorname{rank}(X)=1$.`, why: `$x_2=3x_1$ collapses to one direction.` },
        { do: `$\\operatorname{rank}(X^\\top X)=\\operatorname{rank}(X)=1$.`, why: `$X^\\top X$ has the same rank as $X$.` },
        { do: `So $X^\\top X$ is singular: regression blows up.`, why: `No unique least-squares solution.` }
      ],
      answer: `Rank $1$ (singular)`
    },
    {
      q: `<p>If $\\operatorname{rank}(A)=r$ and $A$ is $m\\times n$, what is the dimension of the null space (vectors $w$ with $Aw=0$)?</p>`,
      steps: [
        { do: `Rank–nullity: $\\operatorname{rank}(A)+\\dim(\\text{null space})=n$ (number of columns).`, why: `Every input direction is either spanned or sent to zero.` },
        { do: `So $\\dim(\\text{null space})=n-r$.`, why: `Solve for the nullity.` }
      ],
      answer: `$n-r$`
    },
    {
      q: `<p>Are the rows $(1,1,0)$, $(0,1,1)$, $(1,0,-1)$ independent? Reduce the matrix with them as rows.</p>`,
      steps: [
        { do: `R3 $-$ R1 $=[0,-1,-1]$; then R3 $+$ R2 $=[0,0,0]$.`, why: `Combine rows to test dependence.` },
        { do: `A zero row appears, so the third is a combination of the first two: $(1,0,-1)=(1,1,0)-(0,1,1)$.`, why: `Dependence found.` }
      ],
      answer: `No — dependent (rank $2$)`
    },
    {
      q: `<p>A recommender's user–item matrix is approximately rank $2$. Explain what that means for storage of an $m\\times n$ matrix.</p>`,
      steps: [
        { do: `Rank $2$ means $A\\approx u_1 v_1^\\top+u_2 v_2^\\top$.`, why: `It is a sum of two rank-1 outer products.` },
        { do: `Storage drops from $mn$ to $2(m+n)$ numbers.`, why: `Two pairs of vectors of lengths $m$ and $n$.` },
        { do: `A few latent factors explain all the ratings.`, why: `Low rank = strong redundancy = compressible.` }
      ],
      answer: `Store $2(m+n)$ numbers instead of $mn$`
    }
  ]);

  /* =============================================================== la-psd */
  add("la-psd", [
    {
      q: `<p>What property must a matrix have before we even ask if it is PSD?</p>`,
      steps: [
        { do: `PSD is defined for symmetric matrices.`, why: `$x^\\top A x$ only sees the symmetric part, so we require $A^\\top=A$.` },
        { do: `Without symmetry, the eigenvalue test and bowl picture do not apply.`, why: `Symmetry guarantees real eigenvalues and orthonormal eigenvectors.` }
      ],
      answer: `It must be symmetric ($A^\\top=A$)`
    },
    {
      q: `<p>Is $A=\\begin{bmatrix}2&0\\\\0&1\\end{bmatrix}$ PSD? Use the quadratic form.</p>`,
      steps: [
        { do: `$x^\\top A x=2x_1^2+x_2^2$.`, why: `Diagonal matrix gives a sum of scaled squares.` },
        { do: `Both terms $\\ge 0$ always.`, why: `Squares are non-negative and coefficients are positive.` }
      ],
      answer: `Yes, PSD`
    },
    {
      q: `<p>Is $B=\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}$ PSD?</p>`,
      steps: [
        { do: `$x^\\top B x=x_1^2-x_2^2$.`, why: `Quadratic form.` },
        { do: `At $x=(0,1)$: value $=-1&lt;0$.`, why: `A single negative value breaks PSD.` }
      ],
      answer: `No (not PSD — a saddle)`
    },
    {
      q: `<p>A symmetric matrix has eigenvalues $4$ and $0$. Is it PSD? Positive definite?</p>`,
      steps: [
        { do: `All eigenvalues $\\ge 0$: PSD.`, why: `PSD $\\Leftrightarrow$ every $\\lambda_i\\ge 0$.` },
        { do: `One eigenvalue is exactly $0$, so not strictly positive: not positive definite.`, why: `Positive definite needs all $\\lambda_i&gt;0$.` }
      ],
      answer: `PSD but not positive definite`
    },
    {
      q: `<p>Is the diagonal matrix $\\operatorname{diag}(3,5,2)$ PSD?</p>`,
      steps: [
        { do: `Eigenvalues are the diagonal entries $3,5,2$.`, why: `Diagonal matrices have eigenvalues on the diagonal.` },
        { do: `All $\\ge 0$.`, why: `PSD test passes.` }
      ],
      answer: `Yes, PSD`
    },
    {
      q: `<p>Check whether $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$ is PSD using its eigenvalues.</p>`,
      steps: [
        { do: `$\\det(A-\\lambda I)=(2-\\lambda)^2-1=0\\Rightarrow\\lambda=1,3$.`, why: `Characteristic equation.` },
        { do: `Both $1$ and $3$ are $\\ge 0$.`, why: `All eigenvalues non-negative.` }
      ],
      answer: `Yes, PSD (eigenvalues $1,3$)`
    },
    {
      q: `<p>Use the leading-minor test on $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$ to check positive definiteness.</p>`,
      steps: [
        { do: `First leading minor: $2&gt;0$.`, why: `Top-left $1\\times 1$ block must be positive.` },
        { do: `Second leading minor: $\\det=4-1=3&gt;0$.`, why: `Full determinant must be positive.` },
        { do: `Both positive $\\Rightarrow$ positive definite.`, why: `Sylvester's criterion: all leading minors $&gt;0$.` }
      ],
      answer: `Positive definite (minors $2,\\ 3&gt;0$)`
    },
    {
      q: `<p>Is $A=\\begin{bmatrix}1&2\\\\2&1\\end{bmatrix}$ PSD? Use leading minors.</p>`,
      steps: [
        { do: `First minor: $1&gt;0$.`, why: `Top-left entry.` },
        { do: `$\\det=1-4=-3&lt;0$.`, why: `Full determinant.` },
        { do: `A negative determinant for a $2\\times 2$ symmetric matrix means one eigenvalue is negative.`, why: `$\\det=\\lambda_1\\lambda_2&lt;0$ forces opposite signs.` }
      ],
      answer: `No (one eigenvalue is negative)`
    },
    {
      q: `<p>Show that $A^\\top A$ is always PSD for any matrix $A$.</p>`,
      steps: [
        { do: `$x^\\top(A^\\top A)x=(Ax)^\\top(Ax)=\\lVert Ax\\rVert^2$.`, why: `Group as a dot product of $Ax$ with itself.` },
        { do: `A squared length is $\\ge 0$ for every $x$.`, why: `Norms are non-negative.` },
        { do: `And $A^\\top A$ is symmetric.`, why: `So it qualifies and is PSD.` }
      ],
      answer: `$x^\\top A^\\top A x=\\lVert Ax\\rVert^2\\ge 0$, so PSD`
    },
    {
      q: `<p>Is the covariance matrix $\\Sigma=\\begin{bmatrix}4&2\\\\2&3\\end{bmatrix}$ PSD? Check via leading minors.</p>`,
      steps: [
        { do: `First minor $4&gt;0$; $\\det=12-4=8&gt;0$.`, why: `Both leading minors positive.` },
        { do: `So $\\Sigma$ is positive definite, hence PSD.`, why: `Every covariance matrix is PSD (variance can't be negative).` }
      ],
      answer: `Yes, PSD (in fact positive definite)`
    },
    {
      q: `<p>For which values of $c$ is $A=\\begin{bmatrix}1&c\\\\c&1\\end{bmatrix}$ PSD?</p>`,
      steps: [
        { do: `First minor $1&gt;0$ always.`, why: `Top-left entry is positive.` },
        { do: `$\\det=1-c^2\\ge 0\\Rightarrow c^2\\le 1$.`, why: `PSD allows the determinant to be $\\ge 0$.` },
        { do: `So $-1\\le c\\le 1$.`, why: `Solve $c^2\\le 1$.` }
      ],
      answer: `$-1\\le c\\le 1$`
    },
    {
      q: `<p>If $A$ is PSD with eigenvalues $\\lambda_i\\ge 0$, show $\\operatorname{tr}(A)\\ge 0$ and $\\det A\\ge 0$.</p>`,
      steps: [
        { do: `$\\operatorname{tr}(A)=\\sum_i\\lambda_i$, a sum of non-negatives.`, why: `Trace = sum of eigenvalues.` },
        { do: `$\\det A=\\prod_i\\lambda_i$, a product of non-negatives.`, why: `Determinant = product of eigenvalues.` },
        { do: `Both are $\\ge 0$.`, why: `Sums and products of non-negatives stay non-negative.` }
      ],
      answer: `$\\operatorname{tr}(A)\\ge 0$ and $\\det A\\ge 0$`
    },
    {
      q: `<p>Test $A=\\begin{bmatrix}2&-1\\\\-1&2\\end{bmatrix}$ for positive definiteness, then evaluate $x^\\top A x$ at $x=(1,1)$.</p>`,
      steps: [
        { do: `Minors: $2&gt;0$, $\\det=4-1=3&gt;0$: positive definite.`, why: `Sylvester's criterion.` },
        { do: `$x^\\top A x=2(1)^2+2(1)^2-2(1)(1)=2+2-2=2&gt;0$.`, why: `Quadratic form $2x_1^2+2x_2^2-2x_1x_2$ at $(1,1)$.` }
      ],
      answer: `Positive definite; $x^\\top A x=2$`
    },
    {
      q: `<p>Is the $3\\times 3$ matrix $A=\\operatorname{diag}(1,0,-2)$ PSD?</p>`,
      steps: [
        { do: `Eigenvalues $1,0,-2$.`, why: `Diagonal entries are the eigenvalues.` },
        { do: `$-2&lt;0$ breaks the test.`, why: `PSD requires all $\\lambda_i\\ge 0$.` }
      ],
      answer: `No (eigenvalue $-2&lt;0$)`
    },
    {
      q: `<p>A kernel (Gram) matrix is $K_{ij}=x_i^\\top x_j$ for vectors $x_1,\\dots,x_n$. Argue $K$ is PSD.</p>`,
      steps: [
        { do: `Stack the vectors as columns of $X$, so $K=X^\\top X$.`, why: `Entry $(i,j)$ is $x_i^\\top x_j$.` },
        { do: `$c^\\top K c=c^\\top X^\\top X c=\\lVert Xc\\rVert^2\\ge 0$.`, why: `Any Gram matrix is of the form $X^\\top X$.` }
      ],
      answer: `$K=X^\\top X$ is PSD`
    },
    {
      q: `<p>If $A$ is positive definite, show $A$ is invertible.</p>`,
      steps: [
        { do: `All eigenvalues $\\lambda_i&gt;0$, hence non-zero.`, why: `Positive definite means strictly positive eigenvalues.` },
        { do: `$\\det A=\\prod_i\\lambda_i&gt;0\\neq 0$.`, why: `Product of positive numbers is positive.` },
        { do: `Non-zero determinant $\\Rightarrow$ invertible.`, why: `Singularity requires $\\det=0$.` }
      ],
      answer: `Yes — $\\det A&gt;0$, so invertible`
    },
    {
      q: `<p>If $A$ and $B$ are PSD, show $A+B$ is PSD.</p>`,
      steps: [
        { do: `$x^\\top(A+B)x=x^\\top A x+x^\\top B x$.`, why: `Quadratic form is additive.` },
        { do: `Each term is $\\ge 0$.`, why: `Both $A$ and $B$ are PSD.` },
        { do: `Sum of non-negatives is $\\ge 0$.`, why: `So $A+B$ is PSD.` }
      ],
      answer: `$A+B$ is PSD`
    },
    {
      q: `<p>Is $A=\\begin{bmatrix}1&2&0\\\\2&1&0\\\\0&0&5\\end{bmatrix}$ PSD? Use the block structure.</p>`,
      steps: [
        { do: `It is block-diagonal: a $2\\times 2$ block $\\begin{bmatrix}1&2\\\\2&1\\end{bmatrix}$ and a $1\\times 1$ block $[5]$.`, why: `PSD of a block-diagonal matrix needs each block PSD.` },
        { do: `The $2\\times 2$ block has $\\det=1-4=-3&lt;0$, so it has a negative eigenvalue.`, why: `That block alone is not PSD.` },
        { do: `One bad block ruins it.`, why: `All blocks must be PSD.` }
      ],
      answer: `No (the $2\\times2$ block is not PSD)`
    }
  ]);

  /* ========================================================== la-spectral */
  add("la-spectral", [
    {
      q: `<p>The spectral theorem applies to which matrices?</p>`,
      steps: [
        { do: `It requires $A^\\top=A$.`, why: `Only symmetric matrices are guaranteed real, orthonormal eigenvectors.` },
        { do: `Then $A=U\\Lambda U^\\top$ with orthogonal $U$.`, why: `That clean form is the content of the theorem.` }
      ],
      answer: `Symmetric matrices`
    },
    {
      q: `<p>In $A=U\\Lambda U^\\top$, what is $\\Lambda$ and what is $U$?</p>`,
      steps: [
        { do: `$\\Lambda$ is diagonal with the eigenvalues.`, why: `It holds the stretch factors.` },
        { do: `$U$ has the orthonormal eigenvectors as columns.`, why: `It rotates into eigen-coordinates.` }
      ],
      answer: `$\\Lambda$: eigenvalues; $U$: eigenvectors`
    },
    {
      q: `<p>For an orthogonal $U$ (eigenvector matrix), what is $U^\\top U$?</p>`,
      steps: [
        { do: `Columns are orthonormal, so $U^\\top U=I$.`, why: `Each column has unit length and is perpendicular to the others.` },
        { do: `This also means $U^\\top=U^{-1}$.`, why: `An orthogonal matrix is a pure rotation/reflection.` }
      ],
      answer: `$U^\\top U=I$`
    },
    {
      q: `<p>Find the eigenvalues of $A=\\begin{bmatrix}3&0\\\\0&5\\end{bmatrix}$ (already diagonal).</p>`,
      steps: [
        { do: `$A$ is already in $\\Lambda$ form with $U=I$.`, why: `A diagonal matrix is its own eigenvalue matrix.` },
        { do: `Read off the diagonal: $3$ and $5$.`, why: `Diagonal entries are the eigenvalues.` }
      ],
      answer: `$\\lambda=3$ and $\\lambda=5$`
    },
    {
      q: `<p>Find the eigenvalues of $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$.</p>`,
      steps: [
        { do: `$\\det(A-\\lambda I)=(2-\\lambda)^2-1=0$.`, why: `Characteristic equation.` },
        { do: `$(2-\\lambda)=\\pm 1\\Rightarrow\\lambda=1,3$.`, why: `Solve.` }
      ],
      answer: `$\\lambda=1$ and $\\lambda=3$`
    },
    {
      q: `<p>Find a unit eigenvector of $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$ for $\\lambda=3$.</p>`,
      steps: [
        { do: `Solve $(A-3I)v=0$: $\\begin{bmatrix}-1&1\\\\1&-1\\end{bmatrix}v=0\\Rightarrow v_1=v_2$.`, why: `Eigenvector lies in the null space of $A-\\lambda I$.` },
        { do: `Take $v=(1,1)$, normalize by $\\sqrt2$: $\\tfrac{1}{\\sqrt2}(1,1)$.`, why: `Eigenvectors in $U$ must be unit length.` }
      ],
      answer: `$\\tfrac{1}{\\sqrt2}(1,1)^\\top$`
    },
    {
      q: `<p>Verify the eigenvectors $\\tfrac{1}{\\sqrt2}(1,1)$ and $\\tfrac{1}{\\sqrt2}(1,-1)$ of a symmetric matrix are perpendicular.</p>`,
      steps: [
        { do: `Dot product: $\\tfrac12(1\\cdot 1+1\\cdot(-1))$.`, why: `Perpendicular means dot product zero.` },
        { do: `$\\tfrac12(1-1)=0$.`, why: `Symmetric matrices have orthogonal eigenvectors.` }
      ],
      answer: `Dot product $=0$ (perpendicular)`
    },
    {
      q: `<p>Write the full decomposition $A=U\\Lambda U^\\top$ for $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$.</p>`,
      steps: [
        { do: `Eigenvalues $3,1$, eigenvectors $\\tfrac{1}{\\sqrt2}(1,1)$ and $\\tfrac{1}{\\sqrt2}(1,-1)$.`, why: `Found above.` },
        { do: `$U=\\tfrac{1}{\\sqrt2}\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}$, $\\Lambda=\\begin{bmatrix}3&0\\\\0&1\\end{bmatrix}$.`, why: `Columns ordered to match eigenvalues.` }
      ],
      answer: `$U=\\tfrac{1}{\\sqrt2}\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix},\\ \\Lambda=\\begin{bmatrix}3&0\\\\0&1\\end{bmatrix}$`
    },
    {
      q: `<p>Using $A=U\\Lambda U^\\top$, why is $A^2=U\\Lambda^2 U^\\top$?</p>`,
      steps: [
        { do: `$A^2=(U\\Lambda U^\\top)(U\\Lambda U^\\top)$.`, why: `Substitute the decomposition twice.` },
        { do: `Middle $U^\\top U=I$ cancels: $U\\Lambda I\\Lambda U^\\top=U\\Lambda^2 U^\\top$.`, why: `Orthogonality collapses the inner factors.` }
      ],
      answer: `$A^2=U\\Lambda^2 U^\\top$`
    },
    {
      q: `<p>Compute the matrix square root $A^{1/2}=U\\Lambda^{1/2}U^\\top$ of $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$.</p>`,
      steps: [
        { do: `$\\Lambda=\\operatorname{diag}(3,1)$, so $\\Lambda^{1/2}=\\operatorname{diag}(\\sqrt3,1)$.`, why: `Square-root the eigenvalues.` },
        { do: `$A^{1/2}=U\\Lambda^{1/2}U^\\top$ with $U=\\tfrac{1}{\\sqrt2}\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}$.`, why: `Rotate, scale by $\\sqrt{\\lambda}$, rotate back.` },
        { do: `Multiply out: $\\tfrac12\\begin{bmatrix}\\sqrt3+1&\\sqrt3-1\\\\\\sqrt3-1&\\sqrt3+1\\end{bmatrix}$.`, why: `Same eigenvectors, square-rooted eigenvalues.` }
      ],
      answer: `$A^{1/2}=\\tfrac12\\begin{bmatrix}\\sqrt3+1&\\sqrt3-1\\\\\\sqrt3-1&\\sqrt3+1\\end{bmatrix}$`
    },
    {
      q: `<p>A symmetric $A$ has eigenvalues $4$ and $9$ along perpendicular axes. What does $A$ do to the unit circle?</p>`,
      steps: [
        { do: `It stretches by $4$ along one eigen-axis and $9$ along the other.`, why: `$\\Lambda$ scales each eigen-direction.` },
        { do: `Circle becomes an ellipse with semi-axes $4$ and $9$ aligned to the eigenvectors.`, why: `Spectral theorem: clean stretch along orthogonal axes.` }
      ],
      answer: `An ellipse with semi-axes $4$ and $9$`
    },
    {
      q: `<p>Use trace and determinant to find the eigenvalues of $A=\\begin{bmatrix}5&2\\\\2&2\\end{bmatrix}$.</p>`,
      steps: [
        { do: `$\\operatorname{tr}=7$, $\\det=10-4=6$.`, why: `Sum and product of eigenvalues.` },
        { do: `Solve $\\lambda^2-7\\lambda+6=0\\Rightarrow(\\lambda-1)(\\lambda-6)=0$.`, why: `Characteristic equation from trace and det.` }
      ],
      answer: `$\\lambda=1$ and $\\lambda=6$`
    },
    {
      q: `<p>PCA: a covariance matrix's eigenvalues are $\\lambda_1=8$, $\\lambda_2=2$. What fraction of variance does the first principal component capture?</p>`,
      steps: [
        { do: `Total variance $=\\lambda_1+\\lambda_2=10$.`, why: `Trace = total variance.` },
        { do: `Fraction $=8/10=0.8$.`, why: `Each eigenvalue is the variance along its principal axis.` }
      ],
      answer: `$80\\%$`
    },
    {
      q: `<p>Why does $U^\\top=U^{-1}$ for the eigenvector matrix of a symmetric matrix?</p>`,
      steps: [
        { do: `$U^\\top U=I$ since columns are orthonormal.`, why: `Spectral theorem gives orthonormal eigenvectors.` },
        { do: `A matrix whose transpose times itself is $I$ has its transpose as inverse.`, why: `Definition of inverse: $MU=I\\Rightarrow M=U^{-1}$.` }
      ],
      answer: `Because $U^\\top U=I$, so $U^\\top=U^{-1}$`
    },
    {
      q: `<p>Compute $A^{-1}$ of the symmetric $A=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$ via the spectral form $A^{-1}=U\\Lambda^{-1}U^\\top$.</p>`,
      steps: [
        { do: `$\\Lambda^{-1}=\\operatorname{diag}(1/3,1)$.`, why: `Reciprocate eigenvalues $3,1$.` },
        { do: `$A^{-1}=U\\Lambda^{-1}U^\\top=\\tfrac12\\begin{bmatrix}1/3+1&1/3-1\\\\1/3-1&1/3+1\\end{bmatrix}=\\tfrac13\\begin{bmatrix}2&-1\\\\-1&2\\end{bmatrix}$.`, why: `Same eigenvectors, reciprocal eigenvalues.` },
        { do: `Check vs $2\\times 2$ formula: $\\det=3$, adjugate $\\tfrac13\\begin{bmatrix}2&-1\\\\-1&2\\end{bmatrix}$. ✔`, why: `Consistent.` }
      ],
      answer: `$A^{-1}=\\tfrac13\\begin{bmatrix}2&-1\\\\-1&2\\end{bmatrix}$`
    },
    {
      q: `<p>A symmetric $3\\times3$ matrix has eigenvalues $1,1,4$. Is it PSD? Positive definite?</p>`,
      steps: [
        { do: `All eigenvalues $\\ge 0$: PSD.`, why: `PSD test.` },
        { do: `All $&gt;0$: also positive definite.`, why: `No zero eigenvalue.` }
      ],
      answer: `PSD and positive definite`
    },
    {
      q: `<p>Prove that for symmetric $A=U\\Lambda U^\\top$, the quadratic form equals $\\sum_i\\lambda_i y_i^2$ where $y=U^\\top x$.</p>`,
      steps: [
        { do: `$x^\\top A x=x^\\top U\\Lambda U^\\top x$.`, why: `Substitute the decomposition.` },
        { do: `Let $y=U^\\top x$: this becomes $y^\\top\\Lambda y$.`, why: `Rotate $x$ into eigen-coordinates.` },
        { do: `$\\Lambda$ diagonal $\\Rightarrow y^\\top\\Lambda y=\\sum_i\\lambda_i y_i^2$.`, why: `Quadratic form of a diagonal matrix.` }
      ],
      answer: `$x^\\top A x=\\sum_i\\lambda_i y_i^2$`
    },
    {
      q: `<p>Whitening uses $A^{-1/2}$. For $A=\\operatorname{diag}(4,9)$, compute $A^{-1/2}$.</p>`,
      steps: [
        { do: `$A$ is diagonal, so eigenvalues are $4,9$.`, why: `$U=I$ here.` },
        { do: `$A^{-1/2}=\\operatorname{diag}(1/\\sqrt4,\\,1/\\sqrt9)=\\operatorname{diag}(1/2,\\,1/3)$.`, why: `Reciprocal square-root of each eigenvalue.` }
      ],
      answer: `$A^{-1/2}=\\begin{bmatrix}1/2&0\\\\0&1/3\\end{bmatrix}$`
    }
  ]);

  /* =============================================================== la-svd */
  add("la-svd", [
    {
      q: `<p>The SVD factors a matrix as $A=U\\Sigma V^\\top$. Which matrices can be factored this way?</p>`,
      steps: [
        { do: `SVD works for ANY $m\\times n$ matrix.`, why: `Unlike the spectral theorem, it needs neither square nor symmetric.` },
        { do: `It uses two rotations $U,V$ instead of one.`, why: `Two different rotations handle rectangular, non-symmetric maps.` }
      ],
      answer: `Any matrix (square or rectangular)`
    },
    {
      q: `<p>What sign can singular values have, and how are they ordered?</p>`,
      steps: [
        { do: `Singular values $\\sigma_i\\ge 0$.`, why: `They are square roots of non-negative eigenvalues of $A^\\top A$.` },
        { do: `Sorted descending $\\sigma_1\\ge\\sigma_2\\ge\\cdots$.`, why: `Largest = most important direction.` }
      ],
      answer: `Non-negative, sorted largest first`
    },
    {
      q: `<p>For a diagonal matrix $A=\\operatorname{diag}(3,-5)$, what are its singular values?</p>`,
      steps: [
        { do: `Singular values are the absolute values of the diagonal entries.`, why: `$\\sigma_i\\ge 0$, so signs are absorbed into $U$.` },
        { do: `$|3|=3$, $|-5|=5$; sorted: $5,3$.`, why: `Order descending.` }
      ],
      answer: `$\\sigma=(5,\\,3)$`
    },
    {
      q: `<p>A matrix has singular values $(6,3,1)$. What fraction of its "energy" $\\sum\\sigma_i^2$ does the rank-1 approximation keep?</p>`,
      steps: [
        { do: `Total energy $=36+9+1=46$.`, why: `Energy $\\propto\\sum\\sigma_i^2$.` },
        { do: `Rank-1 keeps $\\sigma_1^2=36$; fraction $=36/46\\approx 0.78$.`, why: `Top singular value dominates.` }
      ],
      answer: `$\\approx 78\\%$`
    },
    {
      q: `<p>The singular values of $A$ are $(10,8,1,0.2)$. What is the reconstruction error $\\lVert A-A_2\\rVert$ of the best rank-2 approximation?</p>`,
      steps: [
        { do: `Eckart–Young: $\\lVert A-A_k\\rVert=\\sigma_{k+1}$.`, why: `Error equals the first dropped singular value.` },
        { do: `$k=2$, so error $=\\sigma_3=1$.`, why: `Third singular value.` }
      ],
      answer: `$\\lVert A-A_2\\rVert=\\sigma_3=1$`
    },
    {
      q: `<p>How do singular values of $A$ relate to eigenvalues of $A^\\top A$?</p>`,
      steps: [
        { do: `$A^\\top A=V\\Lambda V^\\top$ with eigenvalues $\\lambda_i\\ge 0$.`, why: `$A^\\top A$ is symmetric PSD.` },
        { do: `$\\sigma_i=\\sqrt{\\lambda_i}$.`, why: `Singular values are the square roots.` }
      ],
      answer: `$\\sigma_i=\\sqrt{\\lambda_i(A^\\top A)}$`
    },
    {
      q: `<p>Compute the singular values of $A=\\begin{bmatrix}3&0\\\\0&4\\\\0&0\\end{bmatrix}$.</p>`,
      steps: [
        { do: `$A^\\top A=\\begin{bmatrix}9&0\\\\0&16\\end{bmatrix}$.`, why: `Multiply $A^\\top$ by $A$.` },
        { do: `Eigenvalues $9,16$; $\\sigma=\\sqrt{16},\\sqrt9=4,3$.`, why: `Square-root, sort descending.` }
      ],
      answer: `$\\sigma=(4,\\,3)$`
    },
    {
      q: `<p>For a symmetric PSD matrix $A=\\begin{bmatrix}2&0\\\\0&3\\end{bmatrix}$, how do its singular values compare to its eigenvalues?</p>`,
      steps: [
        { do: `Eigenvalues $2,3$ are both positive.`, why: `PSD has non-negative eigenvalues.` },
        { do: `Singular values $=|\\lambda_i|=2,3$.`, why: `For symmetric PSD matrices, $\\sigma_i=\\lambda_i$.` }
      ],
      answer: `They are equal: $\\sigma=(3,2)$`
    },
    {
      q: `<p>For a symmetric matrix with eigenvalues $2$ and $-5$, what are the singular values?</p>`,
      steps: [
        { do: `$\\sigma_i=|\\lambda_i|$.`, why: `Singular values are non-negative; the sign of a negative eigenvalue goes into $U$.` },
        { do: `$|2|=2$, $|-5|=5$; sorted: $5,2$.`, why: `Absolute values, descending.` }
      ],
      answer: `$\\sigma=(5,\\,2)$`
    },
    {
      q: `<p>Write the rank-1 approximation $A_1=\\sigma_1 u_1 v_1^\\top$ for $\\sigma_1=10$, $u_1=(1,0)^\\top$, $v_1=(0,1)^\\top$.</p>`,
      steps: [
        { do: `Outer product $u_1 v_1^\\top=\\begin{bmatrix}0&1\\\\0&0\\end{bmatrix}$.`, why: `Entry $(i,j)=u_i v_j$.` },
        { do: `Scale by $\\sigma_1=10$: $\\begin{bmatrix}0&10\\\\0&0\\end{bmatrix}$.`, why: `Each rank-1 piece is $\\sigma_i u_i v_i^\\top$.` }
      ],
      answer: `$A_1=\\begin{bmatrix}0&10\\\\0&0\\end{bmatrix}$`
    },
    {
      q: `<p>Image compression keeps the top $k$ singular values. For a $100\\times 100$ image, how many numbers does a rank-10 approximation store?</p>`,
      steps: [
        { do: `Each rank-1 piece needs $u_i$ (length $100$), $v_i$ (length $100$), and $\\sigma_i$ (1 number): $201$.`, why: `$A_k=\\sum_{i=1}^k\\sigma_i u_i v_i^\\top$.` },
        { do: `$10\\times 201=2010$ vs $100\\times 100=10{,}000$ originally.`, why: `Roughly $5\\times$ compression.` }
      ],
      answer: `$2010$ numbers (vs $10{,}000$)`
    },
    {
      q: `<p>The rank of $A$ equals the number of non-zero singular values. If $\\sigma=(7,4,0,0)$, what is $\\operatorname{rank}(A)$?</p>`,
      steps: [
        { do: `Count non-zero $\\sigma_i$: $7$ and $4$.`, why: `Zero singular values contribute no direction.` },
        { do: `Two non-zero, so rank $=2$.`, why: `Rank = number of non-zero singular values.` }
      ],
      answer: `Rank $=2$`
    },
    {
      q: `<p>What are the singular values of an orthogonal matrix $Q$ (with $Q^\\top Q=I$)?</p>`,
      steps: [
        { do: `$Q^\\top Q=I$ has all eigenvalues $1$.`, why: `Identity.` },
        { do: `$\\sigma_i=\\sqrt{1}=1$ for all $i$.`, why: `Orthogonal matrices preserve length.` }
      ],
      answer: `All singular values are $1$`
    },
    {
      q: `<p>Energy capture: singular values $(8,6,2)$. What fraction of energy does the rank-2 approximation keep, and what is its error?</p>`,
      steps: [
        { do: `Total energy $=64+36+4=104$; kept $=64+36=100$.`, why: `Energy $\\propto\\sigma_i^2$.` },
        { do: `Fraction $=100/104\\approx 96.2\\%$.`, why: `Captured energy ratio.` },
        { do: `Error $=\\sigma_3=2$.`, why: `Eckart–Young: first dropped singular value.` }
      ],
      answer: `$\\approx 96.2\\%$ kept; error $=2$`
    },
    {
      q: `<p>How does PCA relate to the SVD?</p>`,
      steps: [
        { do: `PCA is the SVD of the centered data matrix $X$.`, why: `$X=U\\Sigma V^\\top$.` },
        { do: `Right singular vectors $V$ are the principal directions; $\\sigma_i^2$ (scaled) are the variances.`, why: `$X^\\top X\\propto$ covariance, whose eigenvectors are $V$.` }
      ],
      answer: `PCA = SVD of the centered data; $V$ gives principal axes`
    },
    {
      q: `<p>The condition number is $\\kappa=\\sigma_1/\\sigma_n$. For $\\sigma=(100,10,0.1)$, compute it and comment.</p>`,
      steps: [
        { do: `$\\kappa=\\sigma_1/\\sigma_3=100/0.1=1000$.`, why: `Ratio of largest to smallest singular value.` },
        { do: `Large $\\kappa$ means ill-conditioned: solving $Ax=b$ amplifies errors.`, why: `Tiny $\\sigma_n$ makes the inverse huge in one direction.` }
      ],
      answer: `$\\kappa=1000$ (ill-conditioned)`
    },
    {
      q: `<p>The pseudo-inverse is $A^+=V\\Sigma^+U^\\top$, where $\\Sigma^+$ reciprocates non-zero singular values. For $\\Sigma=\\operatorname{diag}(4,2,0)$, write $\\Sigma^+$.</p>`,
      steps: [
        { do: `Reciprocate the non-zero entries: $1/4$, $1/2$.`, why: `Pseudo-inverse inverts the invertible part.` },
        { do: `Leave the zero singular value as $0$.`, why: `$1/0$ is undefined, so it stays $0$.` }
      ],
      answer: `$\\Sigma^+=\\operatorname{diag}(1/4,\\,1/2,\\,0)$`
    },
    {
      q: `<p>Recommender systems factor $R\\approx U_k\\Sigma_k V_k^\\top$. If $R$ is $1000\\times 500$ and rank-20 is kept, how many numbers does the factorization store vs the full matrix?</p>`,
      steps: [
        { do: `Full: $1000\\times 500=500{,}000$.`, why: `Every entry stored.` },
        { do: `Rank-20: $20\\times(1000+500+1)=20\\times 1501=30{,}020$.`, why: `Each factor needs $u_i$ (1000), $v_i$ (500), $\\sigma_i$ (1).` },
        { do: `About $16\\times$ smaller.`, why: `Low rank $\\Rightarrow$ big compression.` }
      ],
      answer: `$\\approx 30{,}020$ vs $500{,}000$ numbers`
    }
  ]);

  /* =========================================================== la-hessian */
  add("la-hessian", [
    {
      q: `<p>The gradient gives the first derivative (slope). What does the Hessian give?</p>`,
      steps: [
        { do: `The Hessian collects all second partial derivatives into a matrix.`, why: `Entry $H_{ij}=\\partial^2 f/\\partial x_i\\partial x_j$.` },
        { do: `So it measures curvature — how the slope itself bends.`, why: `Second derivatives describe bending, not just slope.` }
      ],
      answer: `Curvature (second derivatives)`
    },
    {
      q: `<p>For $f(x_1,x_2)=x_1^2+x_2^2$, compute the Hessian.</p>`,
      steps: [
        { do: `$f_{x_1 x_1}=2$, $f_{x_2 x_2}=2$.`, why: `Second derivative of $x^2$ is $2$.` },
        { do: `Cross term $f_{x_1 x_2}=0$.`, why: `No mixing between the variables.` }
      ],
      answer: `$H=\\begin{bmatrix}2&0\\\\0&2\\end{bmatrix}$`
    },
    {
      q: `<p>For $f(x_1,x_2)=x_1^2+3x_2^2$, compute the Hessian.</p>`,
      steps: [
        { do: `$\\frac{\\partial f}{\\partial x_1}=2x_1\\Rightarrow f_{x_1x_1}=2$.`, why: `Differentiate twice in $x_1$.` },
        { do: `$\\frac{\\partial f}{\\partial x_2}=6x_2\\Rightarrow f_{x_2x_2}=6$; cross term $0$.`, why: `Differentiate twice in $x_2$; no $x_1x_2$ coupling.` }
      ],
      answer: `$H=\\begin{bmatrix}2&0\\\\0&6\\end{bmatrix}$`
    },
    {
      q: `<p>Why is the Hessian usually symmetric?</p>`,
      steps: [
        { do: `$H_{ij}=\\frac{\\partial^2 f}{\\partial x_i\\partial x_j}$ and $H_{ji}=\\frac{\\partial^2 f}{\\partial x_j\\partial x_i}$.`, why: `Definition of the entries.` },
        { do: `For smooth $f$, mixed partials are equal (Clairaut's theorem).`, why: `Order of differentiation doesn't matter, so $H_{ij}=H_{ji}$.` }
      ],
      answer: `Equal mixed partials make $H$ symmetric`
    },
    {
      q: `<p>For the convex test, what condition on $H$ means $f$ is convex?</p>`,
      steps: [
        { do: `$f$ is convex $\\Leftrightarrow$ $H\\succeq 0$ everywhere.`, why: `PSD Hessian means the function curves up in every direction.` },
        { do: `Equivalently, every eigenvalue of $H$ is $\\ge 0$ at every point.`, why: `PSD is the same as all eigenvalues non-negative.` }
      ],
      answer: `$H$ is PSD everywhere`
    },
    {
      q: `<p>For $f=x_1^2+3x_2^2$ with $H=\\begin{bmatrix}2&0\\\\0&6\\end{bmatrix}$, is $f$ convex?</p>`,
      steps: [
        { do: `Eigenvalues are $2$ and $6$, both $&gt;0$.`, why: `Diagonal eigenvalues.` },
        { do: `All $\\ge 0$: $H\\succeq 0$, so $f$ is convex.`, why: `PSD Hessian = convex bowl.` }
      ],
      answer: `Yes, convex (a bowl)`
    },
    {
      q: `<p>For $g=x_1^2-x_2^2$, compute the Hessian and classify the critical point at the origin.</p>`,
      steps: [
        { do: `$g_{x_1x_1}=2$, $g_{x_2x_2}=-2$, cross term $0$.`, why: `Second derivatives.` },
        { do: `Eigenvalues $2$ and $-2$: mixed signs.`, why: `One up-curve, one down-curve.` },
        { do: `Mixed signs $\\Rightarrow$ saddle point.`, why: `Not a min or max.` }
      ],
      answer: `$H=\\begin{bmatrix}2&0\\\\0&-2\\end{bmatrix}$, a saddle`
    },
    {
      q: `<p>Compute the Hessian of $f=4x^2+y^2$ and decide if it is convex.</p>`,
      steps: [
        { do: `$f_{xx}=8$, $f_{yy}=2$, $f_{xy}=0$.`, why: `Differentiate twice.` },
        { do: `Eigenvalues $8,2$ both positive: convex.`, why: `PSD Hessian.` }
      ],
      answer: `$H=\\begin{bmatrix}8&0\\\\0&2\\end{bmatrix}$, convex`
    },
    {
      q: `<p>Compute the Hessian of $f=x^2+xy+y^2$ (note the cross term).</p>`,
      steps: [
        { do: `$f_x=2x+y\\Rightarrow f_{xx}=2$, $f_{xy}=1$.`, why: `Differentiate $f_x$ in $x$ then $y$.` },
        { do: `$f_y=x+2y\\Rightarrow f_{yy}=2$, $f_{yx}=1$.`, why: `Symmetric mixed partials.` }
      ],
      answer: `$H=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$`
    },
    {
      q: `<p>Is $f=x^2+xy+y^2$ convex? Test the Hessian $H=\\begin{bmatrix}2&1\\\\1&2\\end{bmatrix}$ with leading minors.</p>`,
      steps: [
        { do: `First minor $2&gt;0$.`, why: `Top-left entry.` },
        { do: `$\\det=4-1=3&gt;0$.`, why: `Full determinant.` },
        { do: `Both positive $\\Rightarrow$ positive definite $\\Rightarrow$ convex.`, why: `Sylvester's criterion.` }
      ],
      answer: `Yes, strictly convex`
    },
    {
      q: `<p>For $f=x^2-3xy+y^2$, find the Hessian and classify it.</p>`,
      steps: [
        { do: `$f_x=2x-3y\\Rightarrow f_{xx}=2$, $f_{xy}=-3$.`, why: `The $-3xy$ term gives $f_{xy}=-3$.` },
        { do: `$H=\\begin{bmatrix}2&-3\\\\-3&2\\end{bmatrix}$; $\\det=4-9=-5&lt;0$.`, why: `Negative determinant.` },
        { do: `Indefinite (eigenvalues of opposite sign): saddle.`, why: `$\\det&lt;0\\Rightarrow\\lambda_1\\lambda_2&lt;0$.` }
      ],
      answer: `$H=\\begin{bmatrix}2&-3\\\\-3&2\\end{bmatrix}$, a saddle`
    },
    {
      q: `<p>Newton's method takes the step $-H^{-1}\\nabla f$. For $H=\\begin{bmatrix}2&0\\\\0&4\\end{bmatrix}$ and $\\nabla f=\\begin{bmatrix}6\\\\8\\end{bmatrix}$, compute the step.</p>`,
      steps: [
        { do: `$H^{-1}=\\operatorname{diag}(1/2,1/4)$.`, why: `Diagonal inverse.` },
        { do: `$-H^{-1}\\nabla f=-(1/2\\cdot 6,\\ 1/4\\cdot 8)=-(3,2)=(-3,-2)$.`, why: `Apply $-H^{-1}$ to the gradient.` }
      ],
      answer: `Step $=(-3,\\,-2)^\\top$`
    },
    {
      q: `<p>The second-order Taylor model is $f(x+d)\\approx f(x)+\\nabla f^\\top d+\\tfrac12 d^\\top H d$. For $f(x)=5$, $\\nabla f=(1,0)$, $H=\\begin{bmatrix}2&0\\\\0&2\\end{bmatrix}$, estimate $f$ at $d=(1,1)$.</p>`,
      steps: [
        { do: `Linear term $\\nabla f^\\top d=1\\cdot 1+0\\cdot 1=1$.`, why: `Gradient dotted with the step.` },
        { do: `Quadratic term $\\tfrac12 d^\\top H d=\\tfrac12(2\\cdot 1^2+2\\cdot 1^2)=2$.`, why: `Curvature contribution.` },
        { do: `$f\\approx 5+1+2=8$.`, why: `Sum the three pieces.` }
      ],
      answer: `$f(x+d)\\approx 8$`
    },
    {
      q: `<p>Why does $H\\succeq 0$ everywhere guarantee $f$ never dips below its tangent plane?</p>`,
      steps: [
        { do: `Taylor: $f(x+d)-[f(x)+\\nabla f^\\top d]=\\tfrac12 d^\\top H d$.`, why: `The leftover is the quadratic term.` },
        { do: `$d^\\top H d\\ge 0$ for all $d$ when $H\\succeq 0$.`, why: `PSD condition.` },
        { do: `So $f$ is always above the tangent: convex.`, why: `Definition of convexity.` }
      ],
      answer: `The leftover $\\tfrac12 d^\\top H d\\ge 0$, so $f$ stays above the tangent`
    },
    {
      q: `<p>A quadratic loss is $f(w)=\\tfrac12 w^\\top A w$ with symmetric $A=\\begin{bmatrix}3&1\\\\1&2\\end{bmatrix}$. What is its Hessian?</p>`,
      steps: [
        { do: `For $f=\\tfrac12 w^\\top A w$ with symmetric $A$, $\\nabla f=Aw$.`, why: `Gradient of a quadratic form.` },
        { do: `$H=\\nabla^2 f=A$.`, why: `The Hessian of a quadratic is the constant matrix $A$.` }
      ],
      answer: `$H=A=\\begin{bmatrix}3&1\\\\1&2\\end{bmatrix}$`
    },
    {
      q: `<p>For the loss above with $H=\\begin{bmatrix}3&1\\\\1&2\\end{bmatrix}$, is the problem convex? Will gradient descent reach the global minimum?</p>`,
      steps: [
        { do: `Minors: $3&gt;0$, $\\det=6-1=5&gt;0$: positive definite.`, why: `Sylvester's criterion.` },
        { do: `PSD (indeed PD) Hessian $\\Rightarrow$ convex.`, why: `Convexity test.` },
        { do: `Convex $\\Rightarrow$ one global minimum reachable by gradient descent.`, why: `No spurious local minima.` }
      ],
      answer: `Yes, convex; gradient descent finds the global min`
    },
    {
      q: `<p>Classify the critical point of $f=x^2+y^2-4xy$ using its Hessian eigenvalues.</p>`,
      steps: [
        { do: `$f_{xx}=2$, $f_{yy}=2$, $f_{xy}=-4$.`, why: `Second derivatives (the $-4xy$ term gives $f_{xy}=-4$).` },
        { do: `$H=\\begin{bmatrix}2&-4\\\\-4&2\\end{bmatrix}$; trace $4$, $\\det=4-16=-12$.`, why: `Eigenvalues sum to $4$, multiply to $-12$.` },
        { do: `$\\lambda^2-4\\lambda-12=0\\Rightarrow\\lambda=6,-2$: opposite signs.`, why: `Mixed signs.` }
      ],
      answer: `Saddle (eigenvalues $6$ and $-2$)`
    },
    {
      q: `<p>For $f(x,y,z)=x^2+2y^2+3z^2$, write the $3\\times 3$ Hessian and confirm convexity.</p>`,
      steps: [
        { do: `Pure second derivatives: $f_{xx}=2$, $f_{yy}=4$, $f_{zz}=6$; all cross terms $0$.`, why: `No coupling between variables.` },
        { do: `$H=\\operatorname{diag}(2,4,6)$, eigenvalues $2,4,6$ all $&gt;0$.`, why: `Diagonal Hessian.` },
        { do: `$H\\succ 0$, so $f$ is strictly convex.`, why: `Positive definite Hessian.` }
      ],
      answer: `$H=\\operatorname{diag}(2,4,6)$, strictly convex`
    }
  ]);

})();
