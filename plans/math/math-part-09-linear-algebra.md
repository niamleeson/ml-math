# Math · Part 09 — Linear algebra  (deep-authored reference)

> **Per-section execution plan.** Load together with the master
> [`../math-track-explanation-improvements.md`](../math-track-explanation-improvements.md) for the four exposition principles and Definition of Done. Every numeric claim below was checked with `python3` using `sympy 1.14.0` and `numpy 1.26.4`; key checks include Gaussian elimination, inverses, determinants, eigenvalues, diagonalization, QR, SVD, projections, least squares, pseudoinverses, PCA covariance eigensystems, matrix norms, condition numbers, Kronecker products, and low-rank ranks.

**Section:** Linear algebra · **Lessons:** 39 · **Breadcrumb:** `Mathematics · Algebra` · **Priority:** HIGH

## Scorecard (current defects)

| Defect | Count |
|---|---:|
| §5 boilerplate — lessons `math-09-07`, `math-09-08`, `math-09-11`, `math-09-12`, `math-09-13` share _Feature spaces · Embeddings · Dimensionality reduction · Solving constraints · Data rank · Model identifiability_ | 5 / 39 |
| Templated / thin motivation (stock opener or ≤45 words) | 6 / 39 |
| Key formula not in display form (`$$…$$`) | 24 / 39 |
| Genuine LaTeX bugs: unclosed math delimiter or lost matrix `\\` | 0 / 39 |
| Derivation action in this authored plan | 34 derivation / 5 explain-only |

**The core change:** linear algebra is the language of ML representations, regression, optimization, and compression. Every lesson below gets a concept-specific derivation when there is one to derive, a plain symbol gloss, and six applications whose numbers come from that lesson's own object.

---

## Priority & systemic issues

- **Shared §5 block — 5 lessons:** `math-09-07`, `math-09-08`, `math-09-11`, `math-09-12`, and `math-09-13` share the application titles _Feature spaces · Embeddings · Dimensionality reduction · Solving constraints · Data rank · Model identifiability_. Replace each block with applications that compute elementary matrices, LU factors, independence tests, dimensions, or four-subspace quantities respectively.
- **Linear-algebra centrality:** the current section already has some strong lessons, especially `math-09-18`, but the section needs more worked arithmetic. Learners should leave with reproducible computations for elimination, inverse solving, determinants, eigensystems, diagonalization, SVD, QR, PCA, least squares, pseudoinverses, positive definiteness, norms, and condition numbers.
- **LaTeX pass:** the current dump shows no unbalanced math-delimiter fields and no lost matrix row breaks. Keep matrix row separators as `\\` in source and flag only genuine bugs.

---

## Model entry (full prose)

### `math-09-18` — The eigenvalue equation  — **full-depth model entry**

**Connections (§1).**
> This lesson builds on matrix multiplication and linear transformations. A matrix usually turns a vector and changes its direction, but some special vectors keep their direction and only get stretched or flipped. Those vectors are eigenvectors, and the stretch factors are eigenvalues.
>
> This idea leads directly into many of the strongest tools in the rest of the section. The characteristic polynomial is how we find eigenvalues, diagonalization uses eigenvectors to simplify matrix powers, the spectral theorem explains why symmetric matrices have especially clean geometry, and PCA chooses directions by solving an eigenvalue problem for a covariance matrix.

**Motivation & Intuition (§2).**
> A matrix can mix coordinates in a way that is hard to read from its entries alone. For example,
> $A=\begin{bmatrix}4&1\\2&3\end{bmatrix}$ sends most vectors to a new direction. But the vector
> $v=\begin{bmatrix}1\\1\end{bmatrix}$ behaves simply: $Av=\begin{bmatrix}5\\5\end{bmatrix}=5v$. Along that line, the whole matrix acts like multiplication by the number $5$.
>
> That is the point of the eigenvalue equation. It searches for directions where the matrix becomes a scalar stretch. If $Av=\lambda v$, then repeated application is easy: $A^k v=\lambda^k v$. This is why eigenvalues describe growth in linear dynamical systems, variance directions in PCA, and stability of optimization updates.

**Definition & Assumptions (§3).** Display
$$
Av=\lambda v,\qquad v\ne0.
$$
Then derive the equation used to compute eigenvalues:
1. Start with $Av=\lambda v$ — this is the defining condition: the matrix output stays on the same line.
2. Move the right side to the left: $Av-\lambda v=0$ — eigenvectors are solutions of a homogeneous system.
3. Insert the identity matrix: $Av-\lambda Iv=0$ — $Iv=v$, so this only lets the scalar multiply through a matrix.
4. Factor the vector: $(A-\lambda I)v=0$ — the unknown vector is now acted on by one matrix.
5. A nonzero solution exists only if $A-\lambda I$ is singular — an invertible matrix would force $v=0$.
6. Singularity is detected by determinant zero, so $\det(A-\lambda I)=0$ — this is the eigenvalue equation.
7. For $A=\begin{bmatrix}4&1\\2&3\end{bmatrix}$, compute
   $\det\begin{bmatrix}4-\lambda&1\\2&3-\lambda\end{bmatrix}=(4-\lambda)(3-\lambda)-2=\lambda^2-7\lambda+10$.
8. Factor $\lambda^2-7\lambda+10=(\lambda-5)(\lambda-2)$ — the eigenvalues are $5$ and $2$.
9. For $\lambda=5$, solve $(A-5I)v=0$ to get $v\propto(1,1)$; for $\lambda=2$, solve $(A-2I)v=0$ to get $v\propto(1,-2)$.

**Symbols.** $A$ is the matrix or linear map; $v$ is an eigenvector and must be nonzero; $\lambda$ is the eigenvalue, the scalar stretch on that vector; $I$ is the identity matrix; $\det$ is the determinant, used here to detect when a nonzero null-space vector exists.

**Real-World Applications (§5).**
1. **PCA variance direction** — covariance $\begin{bmatrix}4&1\\1&3\end{bmatrix}$ has eigenvalues $\frac{7\pm\sqrt5}{2}\approx4.618,2.382$, so the first principal direction explains more variance.
2. **Linear dynamics** — if $x_{t+1}=Ax_t$ and $x_0=(1,1)$, then $x_3=5^3(1,1)=(125,125)$ for the worked $A$.
3. **Optimization stability** — error update $e_{t+1}=0.8e_t$ has eigenvalue $0.8$, so after $10$ steps the multiplier is $0.8^{10}\approx0.107$.
4. **Graph diffusion** — a graph operator with eigenvalue $0.5$ halves that mode each step; after $4$ steps it is $0.5^4=0.0625$ of its start.
5. **PageRank-style steady direction** — a stochastic matrix eigenvalue $1$ marks a stationary direction; $P=\begin{bmatrix}0.8&0.3\\0.2&0.7\end{bmatrix}$ has stationary vector proportional to $(3,2)$.
6. **Spectral filtering** — a filter $g(\lambda)=1/(1+\lambda)$ applied to Laplacian eigenvalue $3$ scales that component by $0.25$.

---

## Per-lesson change specs

**How to read these specs.** Each block is drafted content for one lesson. The labels are plan shorthand; in the app they become flowing prose in the same plain textbook voice as the model entry. Each Apps line has exactly six concept-specific, verified numeric uses.

### `math-09-01` — Vectors and linear combinations  · deepen derivation

**Connections (§1).**
> This lesson focuses on vectors and linear combinations as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. A vector records several coordinates as one object. Span, basis, projections, and least squares all reuse this same operation.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. A vector records several coordinates as one object. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> A linear combination scales vectors and adds them, which is the basic operation behind feature weights and embedding mixtures. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
Length and combination rule: 1. Write $v=(v_1,\dots,v_n)$ — list the coordinates. 2. In two perpendicular axes, Pythagoras gives $\lVert v\rVert^2=v_1^2+v_2^2$ — squared lengths add for right angles. 3. Add each new perpendicular coordinate the same way — this gives $\lVert v\rVert=\sqrt{\sum_i v_i^2}$. 4. For $c_1a+c_2b$, multiply each vector coordinate by its scalar — scaling changes length and direction. 5. Add matching coordinates — vector addition is coordinatewise.

**Symbols.** $v_i$ is coordinate $i$; $c_i$ are scalar weights; $\lVert v\rVert$ is Euclidean length.

**Real-World Applications (§5).**
1. Embedding mixture: $0.7(2,1)+0.3(0,3)=(1.4,1.6)$.
2. RGB blend: $0.25(255,0,0)+0.75(0,0,255)=(63.75,0,191.25)$.
3. Force sum: $(3,2)+(-1,4)=(2,6)$.
4. Linear score: $2(1,0,-1)-3(0,1,1)=(2,-3,-5)$.
5. Portfolio weights $0.6,0.4$ on returns $0.10,0.02$ give $0.068$.
6. Length of $(3,2)$ is $\sqrt{13}\approx3.606$.

### `math-09-02` — Systems of linear equations  · AUTHOR derivation

**Connections (§1).**
> This lesson focuses on systems of linear equations as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. A linear system asks for numbers that satisfy several linear constraints at once. Gaussian elimination and augmented matrices turn these constraints into a repeatable solving process.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. A linear system asks for numbers that satisfy several linear constraints at once. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> In ML, the same form appears when a model must fit multiple equations or when normal equations summarize least squares. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
Solve $2x+y=5$, $x-y=1$: 1. Write augmented matrix $\begin{bmatrix}2&1&5\\1&-1&1\end{bmatrix}$ — coefficients and outputs sit together. 2. Swap rows to put pivot $1$ first — smaller pivots simplify arithmetic. 3. Replace row 2 by row 2 minus $2$ row 1: $[0,3,3]$ — eliminate $x$ from the second equation. 4. Divide row 2 by $3$: $[0,1,1]$ — solve for $y$. 5. Substitute into row 1: $x-y=1$ gives $x=2$ — back-substitution finishes the system.

**Symbols.** $A$ is the coefficient matrix; $x$ is the unknown vector; $b$ is the right-hand side; an augmented matrix $[A\mid b]$ stores both.

**Real-World Applications (§5).**
1. Two lines meet at $(2,1)$.
2. Linear model $a+b=3$, $a+2b=4$ gives $a=2,b=1$.
3. Circuit currents satisfying $i_1+i_2=5$, $i_1-i_2=1$ give $3,2$.
4. Resource mix $2x+y=5$, $x-y=1$ gives $x=2,y=1$.
5. Calibration offsets $c_1+c_2=7$, $c_1-c_2=1$ give $4,3$.
6. Inconsistent equations $x+y=1$, $2x+2y=3$ have parallel augmented rows and no solution.

### `math-09-03` — Gaussian elimination  · AUTHOR derivation

**Connections (§1).**
> This lesson focuses on Gaussian elimination as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Gaussian elimination is a systematic way to solve a system by removing one variable at a time. The same row operations later become elementary matrices and LU factors.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Gaussian elimination is a systematic way to solve a system by removing one variable at a time. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> It turns a tangled system into triangular form, where back-substitution is direct. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
For $\begin{bmatrix}2&1\\4&3\end{bmatrix}x=(5,11)$: 1. Use the first row as pivot — it contains $2x+y=5$. 2. Replace row 2 by row 2 minus $2$ row 1 — this cancels the $4x$ term. 3. The second row becomes $y=1$ — the lower equation has one unknown. 4. Substitute $y=1$ into $2x+y=5$ — back-substitution uses the solved variable. 5. Solve $x=2$ — the solution is $(2,1)$. 6. The row operation preserves the solution set because subtracting a multiple of one true equation from another true equation gives another true equation.

**Symbols.** A pivot is the coefficient used to eliminate entries below it; an augmented row stores one equation; triangular form means zeros below pivots.

**Real-World Applications (§5).**
1. The worked system solves to $(2,1)$.
2. Elimination multiplier is $4/2=2$.
3. Residual check: $A(2,1)=(5,11)$.
4. Determinant from pivots after elimination is $2\cdot1=2$.
5. Three right-hand sides with the same $A$ reuse the same elimination.
6. A zero pivot triggers a row swap; swapping $\begin{bmatrix}0&1\\2&3\end{bmatrix}$ puts pivot $2$ first.

### `math-09-04` — Matrix algebra  · explain-only

**Connections (§1).**
> This lesson focuses on matrix algebra as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Matrix algebra defines how arrays add, scale, and multiply so they act consistently on vectors. These rules support composition, inverses, transformations, and model weight matrices.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Matrix algebra defines how arrays add, scale, and multiply so they act consistently on vectors. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> This is a language lesson: no theorem needs forcing, but the operations must be explained with concrete arithmetic. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
Explain-only: the lesson introduces operations and compatibility rules rather than a non-obvious formula. Show addition, scalar multiplication, and multiplication by examples.

**Symbols.** $A_{ij}$ is row $i$, column $j$; $A+B$ adds matching entries; $cA$ scales every entry; $AB$ is defined when columns of $A$ match rows of $B$.

**Real-World Applications (§5).**
1. $\begin{bmatrix}1&2\\3&4\end{bmatrix}+\begin{bmatrix}2&0\\1&2\end{bmatrix}=\begin{bmatrix}3&2\\4&6\end{bmatrix}$.
2. $3A=\begin{bmatrix}3&6\\9&12\end{bmatrix}$.
3. $AB=\begin{bmatrix}4&4\\10&8\end{bmatrix}$.
4. A $64\times128$ weight matrix maps $128$ features to $64$ outputs.
5. A $3\times3$ image kernel has $9$ learned numbers.
6. A $1000\times50$ data matrix has $50{,}000$ entries.

### `math-09-05` — Matrix multiplication as composition  · deepen derivation

**Connections (§1).**
> This lesson focuses on matrix multiplication as composition, as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Matrix multiplication represents doing one linear transformation after another. Layered models, Markov steps, and coordinate changes all use this composition view.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Matrix multiplication represents doing one linear transformation after another. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> The product $AB$ means apply $B$ first, then $A$. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. Let $B$ send input $x$ to $Bx$ — first transformation. 2. Apply $A$ to that output: $A(Bx)$ — second transformation. 3. The composed map is linear, so it has a matrix. 4. Its $j$th column is $A$ times the $j$th column of $B$ — columns track where basis vectors go. 5. Therefore $(AB)_{ij}=\sum_k A_{ik}B_{kj}$ — row $i$ of $A$ dots column $j$ of $B$.

**Symbols.** $A\circ B$ is composition; $AB$ is its matrix; $i,j,k$ index rows, columns, and the summed middle dimension.

**Real-World Applications (§5).**
1. $A=\begin{bmatrix}1&2\\3&4\end{bmatrix}$, $B=\begin{bmatrix}2&0\\1&2\end{bmatrix}$ gives $AB=\begin{bmatrix}4&4\\10&8\end{bmatrix}$.
2. Applying $B$ then $A$ to $(1,1)$ gives $(8,18)$.
3. A $256\times128$ layer after a $128\times64$ layer gives a $256\times64$ product.
4. Two Markov steps use $P^2$; if stay probability is $0.8$, two stays give $0.64$.
5. Rotation then scale is one matrix product.
6. Database factor product $(1000\times20)(20\times500)$ gives $1000\times500$ scores.

### `math-09-06` — Matrix inverses  · deepen derivation

**Connections (§1).**
> This lesson focuses on matrix inverses as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. An inverse matrix undoes a linear transformation. Determinants, conditioning, and pseudoinverses refine when this undoing is possible or stable.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. An inverse matrix undoes a linear transformation. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> Solving $Ax=b$ is the same as applying $A^{-1}$ when the inverse exists. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
For $A=\begin{bmatrix}2&1\\1&1\end{bmatrix}$: 1. Compute determinant $2\cdot1-1\cdot1=1$ — nonzero means invertible. 2. Swap diagonal entries and negate off-diagonal entries — the 2-by-2 adjugate rule. 3. Divide by determinant to get $A^{-1}=\begin{bmatrix}1&-1\\-1&2\end{bmatrix}$. 4. Multiply $AA^{-1}$ — the result is $I$, so the matrix really undoes $A$. 5. Solve $Ax=(5,3)$ by $x=A^{-1}b=(2,1)$.

**Symbols.** $A^{-1}$ is the inverse; $I$ is the identity; $\det A$ detects invertibility in square matrices.

**Real-World Applications (§5).**
1. Undo normalization $z=(x-10)/2$: inverse gives $x=2z+10$, so $z=3$ gives $16$.
2. The worked inverse solves $b=(5,3)$ as $(2,1)$.
3. Graphics inverse scale by $2$ is scale by $0.5$.
4. Whitening by covariance $\operatorname{diag}(4,9)$ uses inverse square roots $0.5,0.333$.
5. Control gain inverse: output $6$ through gain $3$ needs input $2$.
6. A singular matrix $\begin{bmatrix}1&2\\2&4\end{bmatrix}$ has determinant $0$ and no inverse.

### `math-09-07` — Elementary matrices  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson focuses on elementary matrices as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. An elementary matrix performs one row operation by ordinary matrix multiplication. This prepares for LU factorization, where many row operations are recorded together.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. An elementary matrix performs one row operation by ordinary matrix multiplication. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> This connects elimination to matrix algebra and explains why row operations can be stored and composed. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
Row operation $R_2\leftarrow R_2-2R_1$: 1. Start with identity $I$ — multiplying by $I$ leaves rows unchanged. 2. Perform the same row operation on $I$ to get $E=\begin{bmatrix}1&0\\-2&1\end{bmatrix}$. 3. Multiply $EA$ — row 1 stays row 1, row 2 becomes row 2 minus $2$ row 1. 4. For $A=\begin{bmatrix}2&1\\4&3\end{bmatrix}$, $EA=\begin{bmatrix}2&1\\0&1\end{bmatrix}$. 5. The inverse elementary matrix reverses the operation: $E^{-1}=\begin{bmatrix}1&0\\2&1\end{bmatrix}$.

**Symbols.** $E$ is an elementary matrix; $R_i$ is row $i$; left multiplication changes rows.

**Real-World Applications (§5).**
1. Elimination matrix above creates zero below the pivot.
2. Swap matrix $\begin{bmatrix}0&1\\1&0\end{bmatrix}$ swaps two rows and has determinant $-1$.
3. Scaling row 1 by $3$ uses $\begin{bmatrix}3&0\\0&1\end{bmatrix}$ and determinant $3$.
4. Applying $E$ to $b=(5,11)$ gives $(5,1)$.
5. Undoing the elimination applies $E^{-1}$ to recover row 2.
6. Product $E_2E_1$ stores two elimination steps for reuse.

### `math-09-08` — LU factorization  · rewrite §5 · AUTHOR derivation

**Connections (§1).**
> This lesson focuses on LU factorization as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. LU factorization records Gaussian elimination as $A=LU$. This factorization is a practical bridge from elimination to numerical solving.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. LU factorization records Gaussian elimination as $A=LU$. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> The upper matrix $U$ is what elimination produces, and the lower matrix $L$ stores the multipliers needed to recover $A$. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
For $A=\begin{bmatrix}2&1\\4&3\end{bmatrix}$: 1. Pivot on $2$ — first pivot. 2. Multiplier is $4/2=2$ — amount of row 1 subtracted from row 2. 3. Eliminate to get $U=\begin{bmatrix}2&1\\0&1\end{bmatrix}$. 4. Store the multiplier below the diagonal in $L=\begin{bmatrix}1&0\\2&1\end{bmatrix}$. 5. Multiply $LU$ to check $\begin{bmatrix}2&1\\4&3\end{bmatrix}$ — factorization is correct. 6. Solve $Ly=b$ then $Ux=y$ — two triangular solves replace fresh elimination.

**Symbols.** $L$ is lower triangular; $U$ is upper triangular; multipliers are entries below the diagonal of $L$.

**Real-World Applications (§5).**
1. Worked $A$ has $L=\begin{bmatrix}1&0\\2&1\end{bmatrix}$ and $U=\begin{bmatrix}2&1\\0&1\end{bmatrix}$.
2. $b=(5,11)$ gives $y=(5,1)$, then $x=(2,1)$.
3. Determinant is product of $U$ pivots: $2\cdot1=2$.
4. Ten right-hand sides reuse one LU.
5. Pivot $0$ requires row permutation $PA=LU$.
6. Triangular solve with $U$ needs back-substitution: $y=1$, then $x=2$.

### `math-09-09` — Vector spaces and subspaces  · explain-only

**Connections (§1).**
> This lesson focuses on vector spaces and subspaces as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. A vector space is a set where vectors can be added and scaled without leaving the set. Null spaces, column spaces, and solution sets all use this language.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. A vector space is a set where vectors can be added and scaled without leaving the set. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> A subspace is a smaller vector space inside a larger one, such as all solutions of a homogeneous linear system. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
Explain-only: this is a definition lesson. Teach the two closure checks with examples rather than inventing a proof.

**Symbols.** $V$ is a vector space; $W\subseteq V$ is a subspace; closure means $u+v$ and $cu$ remain in the set.

**Real-World Applications (§5).**
1. Null space of $[1\ 1]$ is $\{(t,-t):t\in\mathbb R\}$; using $t=3$ gives $(3,-3)$.
2. Plane $z=0$ is closed: $(1,2,0)+(3,4,0)=(4,6,0)$.
3. The set $x+y=1$ is not a subspace because $(0,0)$ is missing.
4. Signals spanned by two basis waves form a 2-D subspace.
5. Residuals orthogonal to two columns live in a subspace of dimension $n-2$.
6. Embedding directions satisfying $w^Tx=0$ form a hyperplane subspace.

### `math-09-10` — Span  · deepen derivation

**Connections (§1).**
> This lesson focuses on span as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. The span of vectors is everything you can build from their linear combinations. Solvability, rank, projections, and PCA all depend on knowing what a span can reach.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. The span of vectors is everything you can build from their linear combinations. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> It tells which targets a set of features or directions can represent. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. Start with vectors $v_1,\dots,v_k$ — available directions. 2. Scale them by arbitrary coefficients $c_i$ — choose how much of each direction. 3. Add them: $c_1v_1+\cdots+c_kv_k$ — this creates one reachable vector. 4. Let coefficients range over all real numbers — the collection of all reachable vectors is the span. 5. To test whether $b$ is in the span, solve $Vc=b$ — columns of $V$ are the spanning vectors.

**Symbols.** $\operatorname{span}\{v_i\}$ is all linear combinations; $c_i$ are coefficients; $V$ is the matrix with $v_i$ as columns.

**Real-World Applications (§5).**
1. $(3,7)$ is in span of $(3,2)$ and $(1,-1)$ because $2(3,2)-3(1,-1)=(3,7)$.
2. Columns $(1,0),(0,1)$ span $\mathbb R^2$.
3. One vector $(2,4)$ spans a line; $(1,3)$ is not on it.
4. Three RGB basis colors span all triples; $(128,64,0)$ uses coefficients $128,64,0$.
5. PCA with two components spans a 2-D reconstruction plane.
6. Robot motions $(1,0)$ and $(0,2)$ reach $(3,4)$ with coefficients $3,2$.

### `math-09-11` — Linear independence  · rewrite §5 · deepen derivation

**Connections (§1).**
> This lesson focuses on linear independence as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Vectors are linearly independent when none is redundant. Basis, dimension, rank, and identifiable features all rely on this nonredundancy test.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Vectors are linearly independent when none is redundant. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> In a data matrix, independence means columns carry distinct directions rather than repeating the same feature. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. Set $c_1v_1+\cdots+c_kv_k=0$ — ask whether zero can be built nontrivially. 2. If only $c_i=0$ works, the vectors are independent — no vector can be made from the others. 3. If a nonzero coefficient solution exists, isolate one vector — it is a combination of the rest. 4. For $(1,1)$ and $(1,-1)$, solve $c_1(1,1)+c_2(1,-1)=0$: equations $c_1+c_2=0$, $c_1-c_2=0$ give $c_1=c_2=0$.

**Symbols.** $c_i$ are dependence coefficients; the zero vector is the target in the test; trivial solution means all coefficients are zero.

**Real-World Applications (§5).**
1. $(1,1)$ and $(1,-1)$ are independent; determinant $-2\ne0$.
2. $(1,2)$ and $(2,4)$ are dependent because $2(1,2)-(2,4)=0$.
3. Duplicate feature columns give rank $1$ for $\begin{bmatrix}1&2\\2&4\end{bmatrix}$.
4. Three one-hot vectors in $\mathbb R^3$ are independent.
5. Basis compression removes a vector if coefficients like $(2,-1,0)$ produce zero.
6. Independent columns make a unique coordinate vector.

### `math-09-12` — Basis and dimension  · rewrite §5 · explain-only

**Connections (§1).**
> This lesson focuses on basis and dimension as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. A basis is a nonredundant set of vectors that spans a space. Rank, nullity, PCA components, and low-rank models are all dimension counts in practice.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. A basis is a nonredundant set of vectors that spans a space. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> Dimension is the number of vectors in any basis, so it counts degrees of freedom. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
Explain-only: this lesson defines a structural pair. Demonstrate the two checks, spanning and independence, with small coordinate examples.

**Symbols.** A basis is a spanning independent set; $\dim V$ is its size; coordinates are coefficients in that basis.

**Real-World Applications (§5).**
1. $\{(1,0),(0,1)\}$ is a basis of $\mathbb R^2$ and dimension is $2$.
2. Basis $\{(1,1),(1,-1)\}$ represents $(3,1)$ as $2(1,1)+1(1,-1)$.
3. A plane through the origin in $\mathbb R^3$ has dimension $2$.
4. Null space $x+y+z=0$ has dimension $2$.
5. A rank-$5$ embedding subspace needs $5$ basis vectors.
6. A $10$-feature model with rank $7$ has $7$ independent feature directions.

### `math-09-13` — The four fundamental subspaces  · rewrite §5 · deepen derivation

**Connections (§1).**
> This lesson focuses on the four fundamental subspaces as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Every matrix organizes four spaces: what its columns can produce, which inputs it kills, what its rows measure, and which output directions are unreachable. Projection, least squares, and pseudoinverses use these spaces to explain what can and cannot be solved.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Every matrix organizes four spaces: what its columns can produce, which inputs it kills, what its rows measure, and which output directions are unreachable. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> These spaces explain solvability and least squares. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
For $A\in\mathbb R^{m\times n}$: 1. Column space is $\{Ax:x\in\mathbb R^n\}$ — all reachable outputs. 2. Null space is $\{x:Ax=0\}$ — inputs erased by $A$. 3. Row space is the column space of $A^T$ — directions measured by rows. 4. Left null space is $\{y:A^Ty=0\}$ — output directions orthogonal to every column. 5. Rank-nullity gives $\dim\operatorname{col}(A)+\dim\operatorname{null}(A)=n$ — domain splits into measured and erased directions.

**Symbols.** $\mathcal C(A)$ column space; $\mathcal N(A)$ null space; $\mathcal C(A^T)$ row space; $\mathcal N(A^T)$ left null space; rank is column-space dimension.

**Real-World Applications (§5).**
1. For $A=[1\ 1]$, column space is $\mathbb R$ and null space is span of $(1,-1)$.
2. Rank is $1$, nullity is $1$, total $2$.
3. For $A=\begin{bmatrix}1&0\\0&0\end{bmatrix}$, left null space is span of $(0,1)$.
4. Least-squares residual lies in $\mathcal N(A^T)$.
5. Unidentifiable model updates live in $\mathcal N(A)$.
6. A $100\times20$ design matrix of rank $18$ has nullity $2$.

### `math-09-14` — Linear transformations  · deepen derivation

**Connections (§1).**
> This lesson focuses on linear transformations as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. A linear transformation preserves addition and scaling. This connects abstract maps with the concrete matrices used in data and models.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. A linear transformation preserves addition and scaling. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> That makes it predictable from what it does to basis vectors. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. Linearity means $T(u+v)=T(u)+T(v)$ and $T(cu)=cT(u)$ — sums and scales pass through. 2. Write any $x$ in the standard basis: $x=x_1e_1+\cdots+x_ne_n$. 3. Apply $T$: $T(x)=x_1T(e_1)+\cdots+x_nT(e_n)$ — use linearity term by term. 4. Put $T(e_i)$ as columns of a matrix $A$ — then $T(x)=Ax$.

**Symbols.** $T$ is a transformation; $e_i$ are basis vectors; $A$ is the matrix representing $T$.

**Real-World Applications (§5).**
1. Rotation by $90^\circ$ sends $(1,0)$ to $(0,1)$ and $(0,1)$ to $(-1,0)$.
2. Scaling $(x,y)$ by $(2,3)$ sends $(4,5)$ to $(8,15)$.
3. Projection onto x-axis sends $(3,4)$ to $(3,0)$.
4. Audio mix matrix $\begin{bmatrix}0.5&0.5\\0.5&-0.5\end{bmatrix}$ sends $(6,2)$ to $(4,2)$.
5. Finite difference $T(x_1,x_2,x_3)=(x_2-x_1,x_3-x_2)$ sends $(1,4,9)$ to $(3,5)$.
6. Feature mixing $\begin{bmatrix}1&2\\0&1\end{bmatrix}(2,3)=(8,3)$.

### `math-09-15` — Matrix of a linear transformation  · AUTHOR derivation

**Connections (§1).**
> This lesson focuses on the matrix of a linear transformation as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Once a basis is chosen, every linear transformation has a matrix. Change of basis and similarity build on this column interpretation.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Once a basis is chosen, every linear transformation has a matrix. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> The columns are the transformed basis vectors. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. Choose basis vectors $e_1,\dots,e_n$ — these define coordinates. 2. Compute $T(e_j)$ for each basis vector — this shows where each coordinate direction goes. 3. Place $T(e_j)$ in column $j$ — column $j$ is the output caused by input coordinate $j=1$. 4. For $x=\sum_j x_je_j$, linearity gives $T(x)=\sum_j x_jT(e_j)$. 5. Matrix-column multiplication gives the same sum, so $T(x)=Ax$.

**Symbols.** $A_j$ is column $j$ of $A$; $T(e_j)$ is the image of basis vector $e_j$; coordinates depend on the chosen basis.

**Real-World Applications (§5).**
1. If $T(e_1)=(2,1)$ and $T(e_2)=(0,3)$, then $A=\begin{bmatrix}2&0\\1&3\end{bmatrix}$.
2. $T(4,5)=4(2,1)+5(0,3)=(8,19)$.
3. Dense layer with 3 inputs and 2 outputs has a $2\times3$ matrix.
4. Color transform from RGB to grayscale weights $(0.3,0.6,0.1)$ maps $(100,50,0)$ to $60$.
5. Markov transition columns summing to $1$ preserve total probability.
6. Linear regression design matrix with 100 rows and 3 features maps weights to 100 predictions.

### `math-09-16` — Change of basis  · deepen derivation

**Connections (§1).**
> This lesson focuses on change of basis as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Change of basis rewrites the same vector using a different coordinate grid. Eigenvector coordinates, PCA coordinates, whitening, and Fourier features all use this translation.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Change of basis rewrites the same vector using a different coordinate grid. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> The point does not move; only its coordinates change. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. Put new basis vectors as columns of $P$ — $P$ maps new coordinates to standard coordinates. 2. If $[x]_B$ is the coordinate vector in basis $B$, then $x=P[x]_B$ — basis vectors are combined by those coordinates. 3. Multiply by $P^{-1}$ to get $[x]_B=P^{-1}x$ — inverse converts standard coordinates back. 4. A matrix in the new basis is $P^{-1}AP$ — convert in, apply $A$, convert out.

**Symbols.** $P$ is the basis matrix; $[x]_B$ means coordinates of $x$ in basis $B$; $P^{-1}AP$ is the same transformation in the new coordinates.

**Real-World Applications (§5).**
1. Basis $b_1=(1,1)$, $b_2=(1,-1)$ represents $(3,1)$ as $(2,1)$.
2. PCA coordinates are $Q^Tx$; if $Q=I$, coordinates stay $(3,1)$.
3. Camera basis changes a world point into camera coordinates.
4. Diagonal basis for $A$ makes powers easy.
5. Whitening with standard deviations $2,3$ uses coordinates $(x_1/2,x_2/3)$.
6. Fourier basis coefficient for a normalized vector is an inner product, e.g. dot with $(1,1)/\sqrt2$ gives $4/\sqrt2\approx2.828$ for $(3,1)$.

### `math-09-17` — Determinants  · AUTHOR derivation

**Connections (§1).**
> This lesson focuses on determinants as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. The determinant measures signed area or volume scaling. This determinant test leads directly to invertibility and eigenvalue computations.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. The determinant measures signed area or volume scaling. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> It also detects whether a square linear map collapses space. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
For $2\times2$ matrix $A=\begin{bmatrix}a&b\\c&d\end{bmatrix}$: 1. Columns are edge vectors $(a,c)$ and $(b,d)$ of a parallelogram. 2. The signed area equals base-times-height with orientation. 3. Expanding that oriented area gives $ad-bc$ — the positive diagonal contribution minus the crossing contribution. 4. If $ad-bc=0$, the parallelogram has zero area — columns lie on one line. 5. Therefore a square matrix is invertible only when its determinant is nonzero.

**Symbols.** $\det A$ is signed volume scale; sign is orientation; zero determinant means collapse.

**Real-World Applications (§5).**
1. $\det\begin{bmatrix}2&1\\1&1\end{bmatrix}=1$, so invertible.
2. $\det\begin{bmatrix}1&2\\2&4\end{bmatrix}=0$, so columns are dependent.
3. Area of a unit square under $\begin{bmatrix}3&0\\0&2\end{bmatrix}$ becomes $6$.
4. Reflection has determinant $-1$.
5. Change-of-variables density under scale $2,3$ divides by $6$.
6. Triangle area from columns $(3,0),(0,4)$ is $\frac12|12|=6$.

### `math-09-18` — The eigenvalue equation  · AUTHOR derivation

**Connections (§1).**
> This lesson builds on matrix multiplication and linear transformations. A matrix usually turns a vector and changes its direction, but some special vectors keep their direction and only get stretched or flipped. Those vectors are eigenvectors, and the stretch factors are eigenvalues.
>
> This idea leads directly into many of the strongest tools in the rest of the section. The characteristic polynomial is how we find eigenvalues, diagonalization uses eigenvectors to simplify matrix powers, the spectral theorem explains why symmetric matrices have especially clean geometry, and PCA chooses directions by solving an eigenvalue problem for a covariance matrix.

**Motivation & Intuition (§2).**
> A matrix can mix coordinates in a way that is hard to read from its entries alone. For example,
> $A=\begin{bmatrix}4&1\\2&3\end{bmatrix}$ sends most vectors to a new direction. But the vector
> $v=\begin{bmatrix}1\\1\end{bmatrix}$ behaves simply: $Av=\begin{bmatrix}5\\5\end{bmatrix}=5v$. Along that line, the whole matrix acts like multiplication by the number $5$.
>
> That is the point of the eigenvalue equation. It searches for directions where the matrix becomes a scalar stretch. If $Av=\lambda v$, then repeated application is easy: $A^k v=\lambda^k v$. This is why eigenvalues describe growth in linear dynamical systems, variance directions in PCA, and stability of optimization updates.

**Definition & Assumptions (§3).** Display
$$
Av=\lambda v,\qquad v\ne0.
$$
Then derive the equation used to compute eigenvalues:
1. Start with $Av=\lambda v$ — this is the defining condition: the matrix output stays on the same line.
2. Move the right side to the left: $Av-\lambda v=0$ — eigenvectors are solutions of a homogeneous system.
3. Insert the identity matrix: $Av-\lambda Iv=0$ — $Iv=v$, so this only lets the scalar multiply through a matrix.
4. Factor the vector: $(A-\lambda I)v=0$ — the unknown vector is now acted on by one matrix.
5. A nonzero solution exists only if $A-\lambda I$ is singular — an invertible matrix would force $v=0$.
6. Singularity is detected by determinant zero, so $\det(A-\lambda I)=0$ — this is the eigenvalue equation.
7. For $A=\begin{bmatrix}4&1\\2&3\end{bmatrix}$, compute
   $\det\begin{bmatrix}4-\lambda&1\\2&3-\lambda\end{bmatrix}=(4-\lambda)(3-\lambda)-2=\lambda^2-7\lambda+10$.
8. Factor $\lambda^2-7\lambda+10=(\lambda-5)(\lambda-2)$ — the eigenvalues are $5$ and $2$.
9. For $\lambda=5$, solve $(A-5I)v=0$ to get $v\propto(1,1)$; for $\lambda=2$, solve $(A-2I)v=0$ to get $v\propto(1,-2)$.

**Symbols.** $A$ is the matrix or linear map; $v$ is an eigenvector and must be nonzero; $\lambda$ is the eigenvalue, the scalar stretch on that vector; $I$ is the identity matrix; $\det$ is the determinant, used here to detect when a nonzero null-space vector exists.

**Real-World Applications (§5).**
1. **PCA variance direction** — covariance $\begin{bmatrix}4&1\\1&3\end{bmatrix}$ has eigenvalues $\frac{7\pm\sqrt5}{2}\approx4.618,2.382$, so the first principal direction explains more variance.
2. **Linear dynamics** — if $x_{t+1}=Ax_t$ and $x_0=(1,1)$, then $x_3=5^3(1,1)=(125,125)$ for the worked $A$.
3. **Optimization stability** — error update $e_{t+1}=0.8e_t$ has eigenvalue $0.8$, so after $10$ steps the multiplier is $0.8^{10}\approx0.107$.
4. **Graph diffusion** — a graph operator with eigenvalue $0.5$ halves that mode each step; after $4$ steps it is $0.5^4=0.0625$ of its start.
5. **PageRank-style steady direction** — a stochastic matrix eigenvalue $1$ marks a stationary direction; $P=\begin{bmatrix}0.8&0.3\\0.2&0.7\end{bmatrix}$ has stationary vector proportional to $(3,2)$.
6. **Spectral filtering** — a filter $g(\lambda)=1/(1+\lambda)$ applied to Laplacian eigenvalue $3$ scales that component by $0.25$.


### `math-09-19` — The characteristic polynomial  · AUTHOR derivation

**Connections (§1).**
> This lesson focuses on the characteristic polynomial as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. The characteristic polynomial packages eigenvalue finding into one scalar equation. Diagonalization, stability analysis, and recurrences all use this polynomial view.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. The characteristic polynomial packages eigenvalue finding into one scalar equation. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> Its roots are the eigenvalues. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. Start from eigenvalue equation $Av=\lambda v$. 2. Rearrange to $(A-\lambda I)v=0$. 3. Require a nonzero solution, so $A-\lambda I$ must be singular. 4. Set $p(\lambda)=\det(A-\lambda I)$. 5. For $A=\begin{bmatrix}4&1\\2&3\end{bmatrix}$, $p(\lambda)=\lambda^2-7\lambda+10$. 6. Roots $5,2$ are the eigenvalues. 7. The coefficients record trace and determinant in 2-D: $\lambda^2-\operatorname{tr}(A)\lambda+\det(A)$.

**Symbols.** $p(\lambda)$ is the characteristic polynomial; roots are eigenvalues; trace is diagonal sum.

**Real-World Applications (§5).**
1. Worked trace $7$ and determinant $10$ give $\lambda^2-7\lambda+10$.
2. Stability of update with roots $0.9,0.5$ is stable because both magnitudes are below $1$.
3. Recurrence polynomial $r^2-3r+2$ has modes $2^t$ and $1^t$.
4. Matrix with characteristic $\lambda^2+1$ has rotation eigenvalues $\pm i$.
5. Graph Laplacian polynomial with root $0$ signals a connected component.
6. Damped rotation roots $0.8e^{\pm i\theta}$ decay by $0.8^{5}\approx0.328$ after 5 steps.

### `math-09-20` — Diagonalization  · deepen derivation

**Connections (§1).**
> This lesson focuses on diagonalization as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Diagonalization rewrites a matrix in its eigenvector coordinates. Matrix powers, differential systems, PCA, and graph filters become simpler in this basis.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Diagonalization rewrites a matrix in its eigenvector coordinates. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> In that basis, the matrix only scales each coordinate. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. Put independent eigenvectors in $P$ — columns are directions where $A$ acts simply. 2. Put matching eigenvalues in diagonal $D$ — each eigenvector's stretch. 3. Since $Av_i=\lambda_i v_i$, matrix form is $AP=PD$. 4. Multiply by $P^{-1}$ to get $A=PDP^{-1}$. 5. Powers become $A^k=PD^kP^{-1}$ — middle factors cancel. 6. For $P=\begin{bmatrix}1&1\\1&-1\end{bmatrix}$ and $D=\operatorname{diag}(5,2)$, $A=\begin{bmatrix}3.5&1.5\\1.5&3.5\end{bmatrix}$.

**Symbols.** $P$ eigenvector matrix; $D$ diagonal eigenvalue matrix; diagonalizable means enough independent eigenvectors.

**Real-World Applications (§5).**
1. $A^3=P\operatorname{diag}(125,8)P^{-1}$.
2. PCA diagonalizes covariance into variances.
3. Markov chain long-run behavior keeps eigenvalue $1$ and damps $|\lambda|<1$.
4. Graph filter $g(D)$ applies one scalar per eigenmode.
5. Differential system $x'=Ax$ has $e^{At}=Pe^{Dt}P^{-1}$.
6. Anisotropy correction scales eigenvalue $5$ direction by $1/\sqrt5\approx0.447$.

### `math-09-21` — Similarity  · deepen derivation

**Connections (§1).**
> This lesson focuses on similarity as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Similar matrices describe the same linear transformation in different coordinates. Diagonalization is the central example, and invariants make coordinate changes safe.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Similar matrices describe the same linear transformation in different coordinates. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> Their entries change, but eigenvalues, trace, determinant, and rank stay the same. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. Let $x=Py$ convert new coordinates $y$ into old coordinates. 2. Apply $A$ in old coordinates: $Ax=APy$. 3. Convert back by $P^{-1}$: $y'=P^{-1}APy$. 4. Therefore the new-coordinate matrix is $B=P^{-1}AP$. 5. If $Av=\lambda v$, then $B(P^{-1}v)=\lambda(P^{-1}v)$ — eigenvalues are preserved.

**Symbols.** $B=P^{-1}AP$ is similar to $A$; $P$ is invertible; invariants are quantities unchanged by coordinate change.

**Real-World Applications (§5).**
1. Diagonalization is similarity with $B=D$.
2. Similar matrices have the same determinant; worked $D$ has determinant $10$, so $A$ does too.
3. Same trace: $5+2=7$.
4. State-space coordinate changes preserve system poles.
5. Whitening changes coordinates but not rank.
6. If $A$ has eigenvalues $5,2$, every similar $B$ has spectral radius $5$.

### `math-09-22` — The Jordan form  · deepen derivation

**Connections (§1).**
> This lesson focuses on the Jordan form as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Jordan form handles matrices that do not have enough eigenvectors to diagonalize. This explains repeated-eigenvalue behavior in powers and differential equations.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Jordan form handles matrices that do not have enough eigenvectors to diagonalize. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> It shows that a repeated eigenvalue can bring a small coupling term along with the scalar stretch. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. For a defective eigenvalue $\lambda$, find eigenvectors from $(A-\lambda I)v=0$ — there are too few. 2. Find a generalized eigenvector $w$ satisfying $(A-\lambda I)w=v$ — this creates the missing chain. 3. In basis $(v,w)$, the block becomes $J=\begin{bmatrix}\lambda&1\\0&\lambda\end{bmatrix}$. 4. Write $J=\lambda I+N$ with $N^2=0$ — split scalar part and nilpotent coupling. 5. Then $J^k=\lambda^k I+k\lambda^{k-1}N$ — binomial expansion stops at $N^2$.

**Symbols.** $J$ Jordan block; $N$ nilpotent part; generalized eigenvector extends an eigenvector chain.

**Real-World Applications (§5).**
1. $J=\begin{bmatrix}2&1\\0&2\end{bmatrix}$ has one eigenvalue $2$ repeated.
2. $J^3=\begin{bmatrix}8&12\\0&8\end{bmatrix}$.
3. $e^{Jt}=e^{2t}\begin{bmatrix}1&t\\0&1\end{bmatrix}$.
4. Defective dynamics include a $t e^{\lambda t}$ term.
5. Near repeated eigenvalues, small perturbations can change eigenvectors sharply.
6. Optimization update with Jordan block $0.9I+N$ has polynomial factor $k0.9^{k-1}$.

### `math-09-23` — Inner products  · explain-only

**Connections (§1).**
> This lesson focuses on inner products as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. An inner product generalizes the dot product. Orthogonality, projections, QR, and least squares all depend on this measurement.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. An inner product generalizes the dot product. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> It turns vectors into lengths, angles, and projections in spaces that may not look like ordinary coordinate space. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
Explain-only: this is an axiomatic definition. Explain positivity, symmetry, and linearity, then show how the usual dot product satisfies them.

**Symbols.** $\langle u,v\rangle$ is the inner product; $\lVert v\rVert=\sqrt{\langle v,v\rangle}$ is the induced norm; orthogonality means inner product zero.

**Real-World Applications (§5).**
1. Dot product $\langle(1,2),(3,4)\rangle=11$.
2. Length from inner product: $\sqrt{11}$ for $(1,\sqrt{10})$.
3. Weighted inner product with weights $(2,1)$ gives $\langle(1,2),(3,4)\rangle_W=2\cdot3+2\cdot4=14$.
4. Function inner product $\int_0^1 x\cdot x^2dx=1/4$.
5. Cosine similarity $11/(\sqrt5\sqrt{25})\approx0.984$.
6. Orthogonal residual has inner product $0$ with fitted column.

### `math-09-24` — Orthogonality  · deepen derivation

**Connections (§1).**
> This lesson focuses on orthogonality as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Orthogonal vectors have zero inner product. Orthonormal bases, QR, PCA, and residual checks all use this separation.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Orthogonal vectors have zero inner product. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> They separate information cleanly because movement in one direction contributes nothing to the other. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. Start from the geometric dot product $u\cdot v=\lVert u\rVert\lVert v\rVert\cos\theta$. 2. Orthogonal means angle $90^\circ$ — directions meet at a right angle. 3. Since $\cos90^\circ=0$, $u\cdot v=0$. 4. Conversely, if nonzero vectors have dot product zero, then $\cos\theta=0$, so $\theta=90^\circ$. 5. Pythagoras follows: $\lVert u+v\rVert^2=\lVert u\rVert^2+2u\cdot v+\lVert v\rVert^2$ becomes a sum of squares.

**Symbols.** $u\perp v$ means orthogonal; $\theta$ is angle; dot product zero is the algebraic test.

**Real-World Applications (§5).**
1. $(1,1)\cdot(1,-1)=0$.
2. Pythagorean length of $(1,1)+(1,-1)=(2,0)$ is $2$.
3. Orthogonal feature columns have cross-product $X_i^TX_j=0$.
4. PCA directions are orthogonal; two components have dot $0$.
5. QR columns satisfy $q_1^Tq_2=0$.
6. Residual $r=(1,-1)$ is orthogonal to column $(1,1)$ since dot is $0$.

### `math-09-25` — Orthogonal projections  · deepen derivation

**Connections (§1).**
> This lesson focuses on orthogonal projections as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Projection finds the closest point on a line or subspace. Least squares is the same closest-point idea in a column space.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Projection finds the closest point on a line or subspace. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> It keeps the component in the chosen direction and drops the orthogonal residual. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
Projection onto nonzero $u$: 1. Seek $\hat v=cu$ on the line — any point on the line is a scalar multiple. 2. The residual $v-cu$ should be orthogonal to $u$ at the closest point. 3. Set $u^T(v-cu)=0$ — perpendicular residual condition. 4. Solve $u^Tv-c u^Tu=0$ for $c=(u^Tv)/(u^Tu)$. 5. Thus $\operatorname{proj}_u v=\frac{u^Tv}{u^Tu}u$.

**Symbols.** $\hat v$ is projected vector; $r=v-\hat v$ is residual; $u$ is the target direction.

**Real-World Applications (§5).**
1. Project $(3,4)$ onto $(1,0)$ gives $(3,0)$.
2. Project $(3,4)$ onto $(1,1)$ gives $3.5(1,1)=(3.5,3.5)$.
3. Residual from second projection is $(-0.5,0.5)$ with dot $0$.
4. Least squares projects $y$ onto column space.
5. Recommendation latent factor keeps component along user vector.
6. Cosine projection length onto unit $u=(0.6,0.8)$ is $3\cdot0.6+4\cdot0.8=5$.

### `math-09-26` — Gram–Schmidt  · deepen derivation

**Connections (§1).**
> This lesson focuses on Gram–Schmidt as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Gram–Schmidt turns independent vectors into orthonormal vectors spanning the same subspace. QR factorization stores this orthonormalization process in matrix form.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Gram–Schmidt turns independent vectors into orthonormal vectors spanning the same subspace. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> It does this by subtracting projections that point in directions already chosen. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. Set $q_1=v_1/\lVert v_1\rVert$ — normalize the first direction. 2. Remove from $v_2$ its component along $q_1$: $u_2=v_2-(q_1^Tv_2)q_1$ — subtract the projection. 3. Check $q_1^Tu_2=0$ — the remaining part is orthogonal. 4. Normalize $q_2=u_2/\lVert u_2\rVert$. 5. Repeat for later vectors by subtracting all previous projections.

**Symbols.** $v_i$ are original vectors; $q_i$ are orthonormal vectors; $u_i$ are residual directions before normalization.

**Real-World Applications (§5).**
1. From $v_1=(1,1)$, $q_1=(1,1)/\sqrt2$.
2. With $v_2=(1,-1)$, projection is $0$, so $q_2=(1,-1)/\sqrt2$.
3. For $v_2=(1,0)$ after $v_1=(1,1)$, residual is $(0.5,-0.5)$.
4. Residual norm is $\sqrt{0.5}\approx0.707$.
5. Orthonormal design columns make $X^TX=I$.
6. QR factorization stores Gram–Schmidt coefficients in $R$.

### `math-09-27` — QR factorization  · AUTHOR derivation

**Connections (§1).**
> This lesson focuses on QR factorization as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. QR factorization writes a matrix as orthonormal directions times an upper-triangular coefficient matrix. Least squares solvers and eigenvalue algorithms both use this factorization.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. QR factorization writes a matrix as orthonormal directions times an upper-triangular coefficient matrix. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> It is a stable way to solve least squares without forming $A^TA$. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. Apply Gram–Schmidt to columns of $A$ — produce orthonormal columns $q_i$. 2. Each original column $a_j$ can be expressed as $a_j=\sum_{i\le j} r_{ij}q_i$ — later columns use current and previous directions. 3. Put $q_i$ into $Q$ and coefficients $r_{ij}$ into $R$ — matrix form is $A=QR$. 4. Since $Q^TQ=I$, least squares $\min\lVert Ax-b\rVert$ becomes $\min\lVert Rx-Q^Tb\rVert$. 5. Solve triangular $Rx=Q^Tb$ by back-substitution.

**Symbols.** $Q$ has orthonormal columns; $R$ is upper triangular; $r_{ij}=q_i^Ta_j$.

**Real-World Applications (§5).**
1. For $A=\begin{bmatrix}1&1\\1&2\\1&3\end{bmatrix}$, QR has diagonal magnitudes $\sqrt3\approx1.732$ and $\sqrt2\approx1.414$.
2. $Q^TQ=I$ keeps column norms $1$.
3. Least squares via QR avoids squaring condition numbers.
4. Orthogonalizing features makes cross-products $0$.
5. QR iteration is the basis of eigenvalue algorithms.
6. A rotation matrix is already $Q$, so its $R$ is identity.

### `math-09-28` — The Spectral Theorem  · deepen derivation

**Connections (§1).**
> This lesson focuses on the spectral theorem as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Symmetric matrices have perpendicular eigenvectors and real eigenvalues. Covariance matrices, Hessians, graph Laplacians, and quadratic forms use this structure.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Symmetric matrices have perpendicular eigenvectors and real eigenvalues. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> This is why covariance matrices, Hessians, and graph Laplacians have clean geometric interpretations. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. Let $A=A^T$ and $Av=\lambda v$, $Aw=\mu w$. 2. Compute $v^TAw$ two ways: $v^TAw=\mu v^Tw$ from $Aw=\mu w$. 3. Also $v^TAw=(A v)^Tw=\lambda v^Tw$ because $A^T=A$. 4. Subtract to get $(\mu-\lambda)v^Tw=0$. 5. If $\lambda\ne\mu$, then $v^Tw=0$ — different eigenspaces are orthogonal. 6. With an orthonormal eigenbasis, $A=Q\Lambda Q^T$.

**Symbols.** Symmetric means $A=A^T$; $Q$ is orthogonal; $\Lambda$ is diagonal eigenvalue matrix.

**Real-World Applications (§5).**
1. $S=\begin{bmatrix}3&1\\1&3\end{bmatrix}$ has eigenvalues $4,2$.
2. Eigenvectors $(1,1)/\sqrt2$ and $(1,-1)/\sqrt2$ are orthogonal.
3. Covariance eigendecomposition gives PCA axes.
4. Quadratic $x^TSx$ in eigen-coordinates is $4z_1^2+2z_2^2$.
5. Graph Laplacian eigenvectors form graph Fourier modes.
6. Matrix power $S^3=Q\operatorname{diag}(64,8)Q^T$.

### `math-09-29` — Positive-definite matrices  · deepen derivation

**Connections (§1).**
> This lesson focuses on positive-definite matrices as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. A positive-definite matrix makes every nonzero quadratic form positive. Convex optimization, covariance regularization, kernels, and Cholesky factorization all use this test.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. A positive-definite matrix makes every nonzero quadratic form positive. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> In optimization, it means the local surface is a bowl. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. For symmetric $A$, spectral theorem gives $A=Q\Lambda Q^T$. 2. Write $x^TAx=x^TQ\Lambda Q^Tx$. 3. Let $z=Q^Tx$ — rotation preserves nonzero vectors. 4. Then $x^TAx=z^T\Lambda z=\sum_i\lambda_i z_i^2$. 5. This is positive for every nonzero $x$ exactly when all $\lambda_i>0$.

**Symbols.** $A\succ0$ means positive definite; $x^TAx$ is a quadratic form; $\lambda_i$ are eigenvalues.

**Real-World Applications (§5).**
1. $\begin{bmatrix}2&1\\1&2\end{bmatrix}$ has eigenvalues $1,3$, so it is positive definite.
2. For $x=(1,2)$, $x^TAx=14$.
3. Covariance with positive variances is PSD; adding $0.1I$ makes eigenvalues at least $0.1$.
4. Hessian $\operatorname{diag}(2,200)$ gives convex quadratic.
5. Kernel Gram matrix must be PSD; negative eigenvalue fails.
6. Cholesky works on PD matrices; diagonal $4,9$ has Cholesky diagonal $2,3$.

### `math-09-30` — Quadratic forms  · deepen derivation

**Connections (§1).**
> This lesson focuses on quadratic forms as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. A quadratic form $x^TAx$ measures how a matrix weights directions. Curvature, Mahalanobis distance, and confidence ellipses are all quadratic-form ideas.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. A quadratic form $x^TAx$ measures how a matrix weights directions. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> It is the local shape of a second-order loss and the geometry of ellipses. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. Start with symmetric $A=Q\Lambda Q^T$ — rotate to eigen-directions. 2. Let $z=Q^Tx$ — express $x$ in eigen-coordinates. 3. Substitute: $x^TAx=z^T\Lambda z$. 4. Expand diagonal multiplication: $\sum_i\lambda_i z_i^2$. 5. Signs and sizes of $\lambda_i$ tell whether the form is a bowl, dome, or saddle.

**Symbols.** $x$ is the input vector; $A$ sets curvature; $\lambda_i$ are directional curvatures.

**Real-World Applications (§5).**
1. With $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$ and $x=(1,2)$, value is $14$.
2. Ridge penalty $\lambda\lVert w\rVert^2$ with $\lambda=0.1$, $\lVert w\rVert^2=25$ gives $2.5$.
3. Mahalanobis distance with covariance $\operatorname{diag}(4,9)$ and $x=(2,3)$ is $1+1=2$.
4. Confidence ellipse $x^TA^{-1}x=5.99$ is a 95% boundary in 2-D.
5. Hessian eigenvalues $1,3$ mean curvature ratio $3$.
6. Energy in spring matrix $K=2I$ at $x=(3,4)$ is $x^TKx=50$.

### `math-09-31` — Singular Value Decomposition (SVD)  · deepen derivation

**Connections (§1).**
> This lesson focuses on Singular Value Decomposition (SVD) as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. SVD decomposes any matrix into input directions, stretches, and output directions. Pseudoinverses, PCA, low-rank approximation, and conditioning all use singular values.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. SVD decomposes any matrix into input directions, stretches, and output directions. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> Unlike eigen-decomposition, it works for rectangular matrices too. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. Form $A^TA$ — it is symmetric positive semidefinite. 2. Spectral theorem gives $A^TA=V\Lambda V^T$ with orthonormal $V$. 3. Singular values are $\sigma_i=\sqrt{\lambda_i}$ — $\lambda_i$ are squared output lengths of input directions. 4. Define $u_i=Av_i/\sigma_i$ for nonzero $\sigma_i$ — normalize each output direction. 5. Then $Av_i=\sigma_i u_i$ for every singular pair. 6. Stacking these relations gives $A=U\Sigma V^T$.

**Symbols.** $U$ output singular vectors; $\Sigma$ diagonal singular-value matrix; $V$ input singular vectors; $\sigma_i$ singular values.

**Real-World Applications (§5).**
1. $A=\begin{bmatrix}3&0\\0&1\\0&0\end{bmatrix}$ has singular values $3,1$.
2. Rank-1 approximation keeps error $\sigma_2=1$ in spectral norm.
3. Explained Frobenius energy by first singular value is $9/(9+1)=0.9$.
4. Numerical rank with threshold $2$ is $1$.
5. Condition number is $3/1=3$.
6. Low-rank image compression with $100\times100$ rank $10$ stores about $10(100+100+1)=2010$ numbers.

### `math-09-32` — Least squares  · deepen derivation

**Connections (§1).**
> This lesson focuses on least squares as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. Least squares finds the vector whose predictions are closest to the data when exact equations cannot all be satisfied. QR and pseudoinverse methods solve the same fitting problem from different factorizations.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. Least squares finds the vector whose predictions are closest to the data when exact equations cannot all be satisfied. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> It is projection onto the column space of the design matrix. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. Minimize $\lVert Ax-b\rVert^2$ — squared residual length. 2. Let residual $r=b-Ax$. 3. At the closest point, residual is orthogonal to every column of $A$ — otherwise moving in that column direction would reduce error. 4. Orthogonality gives $A^Tr=0$. 5. Substitute $r=b-Ax$: $A^T(b-Ax)=0$. 6. Rearrange to normal equations $A^TAx=A^Tb$.

**Symbols.** $A$ design matrix; $x$ coefficients; $b$ observations; $r$ residual; normal equations are $A^TAx=A^Tb$.

**Real-World Applications (§5).**
1. For $A=\begin{bmatrix}1&1\\1&2\\1&3\end{bmatrix}$, $b=(1,2,2)$ gives $x=(2/3,1/2)$.
2. Predictions are $(1.167,1.667,2.167)$.
3. Residual is $(-0.167,0.333,-0.167)$ and sums to $0$.
4. Calibration line slope is $0.5$.
5. Residual norm squared is about $0.167$.
6. Ridge version adds $\lambda I$ to $A^TA$.

### `math-09-33` — The pseudoinverse  · AUTHOR derivation

**Connections (§1).**
> This lesson focuses on the pseudoinverse as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. The pseudoinverse extends inverse-like solving to rectangular or rank-deficient matrices. Least squares, minimum-norm solutions, and regularization all use this inverse-like operator.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. The pseudoinverse extends inverse-like solving to rectangular or rank-deficient matrices. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> It gives least-squares solutions and, when many exact solutions exist, chooses the minimum-norm one. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. Start with SVD $A=U\Sigma V^T$. 2. Nonzero singular directions satisfy $Av_i=\sigma_i u_i$. 3. To invert that direction, map $u_i$ back to $v_i$ and divide by $\sigma_i$. 4. Leave zero singular directions at zero — they cannot be inverted. 5. Stack those reciprocal actions in $\Sigma^+$. 6. The pseudoinverse is $A^+=V\Sigma^+U^T$. 7. Least-squares solution is $x=A^+b$.

**Symbols.** $A^+$ is pseudoinverse; $\Sigma^+$ reciprocates nonzero singular values; zero singular values stay zero.

**Real-World Applications (§5).**
1. For diagonal $A=\operatorname{diag}(3,1,0)$, $A^+=\operatorname{diag}(1/3,1,0)$.
2. $b=(6,2,5)$ maps to $x=(2,2,0)$.
3. Least-squares line example gives $A^+b=(2/3,1/2)$.
4. Minimum-norm solution of $[1\ 1]x=4$ is $(2,2)$.
5. Small singular value $0.01$ becomes reciprocal $100$, showing instability.
6. Ridge filter for singular value $3$ with $\lambda=1$ is $3/(9+1)=0.3$.

### `math-09-34` — Principal Component Analysis (PCA)  · deepen derivation

**Connections (§1).**
> This lesson focuses on Principal Component Analysis (PCA) as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. PCA finds orthogonal directions of maximum variance. Dimensionality reduction, whitening, denoising, and reconstruction all use these coordinates.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. PCA finds orthogonal directions of maximum variance. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> Algebraically, those directions are eigenvectors of the covariance matrix. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. Center data so each feature has mean zero — PCA studies variance around the mean. 2. For unit direction $u$, projected data are $Xu$. 3. Projected variance is $\frac1n\lVert Xu\rVert^2=u^T(\frac1nX^TX)u=u^TCu$. 4. Maximize $u^TCu$ subject to $u^Tu=1$. 5. Lagrange multipliers give $Cu=\lambda u$ — principal directions are covariance eigenvectors. 6. The variance in direction $u$ is the eigenvalue $\lambda$.

**Symbols.** $X$ centered data matrix; $C=X^TX/n$ covariance; $u$ principal direction; $\lambda$ explained variance.

**Real-World Applications (§5).**
1. Data $(2,0),(0,1),(-2,0),(0,-1)$ has covariance $\operatorname{diag}(2,0.5)$.
2. First PC is x-axis with variance $2$.
3. Explained variance ratio of PC1 is $2/(2+0.5)=0.8$.
4. Project point $(2,1)$ onto PC1 gives coordinate $2$.
5. Whitening scales x by $1/\sqrt2\approx0.707$ and y by $1/\sqrt{0.5}\approx1.414$.
6. Dropping PC2 leaves reconstruction $(2,0)$ for point $(2,1)$.

### `math-09-35` — Matrix norms  · deepen derivation

**Connections (§1).**
> This lesson focuses on matrix norms as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. A matrix norm measures the size of a matrix as an operator or as a collection of entries. Condition numbers and approximation errors are measured through these norms.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. A matrix norm measures the size of a matrix as an operator or as a collection of entries. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> Norms control sensitivity, regularization, and approximation error. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. The operator 2-norm is $\lVert A\rVert_2=\max_{\lVert x\rVert=1}\lVert Ax\rVert$ — maximum stretch of a unit vector. 2. Square it: $\lVert Ax\rVert^2=x^TA^TAx$. 3. The maximum Rayleigh quotient of $A^TA$ is its largest eigenvalue. 4. Therefore $\lVert A\rVert_2=\sqrt{\lambda_{\max}(A^TA)}=\sigma_{\max}$. 5. Frobenius norm sums squared entries: $\lVert A\rVert_F=\sqrt{\sum_{ij}A_{ij}^2}$.

**Symbols.** $\lVert A\rVert_2$ is spectral norm; $\lVert A\rVert_F$ is Frobenius norm; $\sigma_{\max}$ is largest singular value.

**Real-World Applications (§5).**
1. For $A=\begin{bmatrix}1&2\\3&4\end{bmatrix}$, $\lVert A\rVert_2\approx5.465$.
2. Frobenius norm is $\sqrt{30}\approx5.477$.
3. Diagonal $\operatorname{diag}(3,1)$ has spectral norm $3$.
4. Gradient clipping rescales vector norm $10$ to $5$ by multiplier $0.5$.
5. Rank-1 SVD error for singular values $3,1$ is spectral norm $1$.
6. Weight decay penalty $0.01\lVert W\rVert_F^2$ with $\lVert W\rVert_F^2=30$ gives $0.3$.

### `math-09-36` — The condition number  · deepen derivation

**Connections (§1).**
> This lesson focuses on the condition number as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. The condition number measures how much a matrix can amplify relative error. Scaling, ridge regularization, and SVD diagnostics all respond to this sensitivity.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. The condition number measures how much a matrix can amplify relative error. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> Large condition numbers warn that solves and least-squares fits may be unstable. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. A perturbation in $b$ changes solution by $\delta x=A^{-1}\delta b$ — from $A(x+\delta x)=b+\delta b$. 2. Bound output error: $\lVert\delta x\rVert\le\lVert A^{-1}\rVert\lVert\delta b\rVert$. 3. Also $\lVert b\rVert=\lVert Ax\rVert\le\lVert A\rVert\lVert x\rVert$, so $1/\lVert x\rVert\le\lVert A\rVert/\lVert b\rVert$. 4. Combine to get relative error bound $\frac{\lVert\delta x\rVert}{\lVert x\rVert}\le\lVert A\rVert\lVert A^{-1}\rVert\frac{\lVert\delta b\rVert}{\lVert b\rVert}$. 5. Define $\kappa(A)=\lVert A\rVert\lVert A^{-1}\rVert$.

**Symbols.** $\kappa(A)$ is condition number; $\delta b$ input perturbation; $\delta x$ solution perturbation; norm is usually the 2-norm.

**Real-World Applications (§5).**
1. $A=\operatorname{diag}(2,0.5)$ has condition number $4$.
2. A $1\%$ input error can become about $4\%$ solution error.
3. Normal equations square conditioning: $\kappa(A^TA)=16$ for this $A$.
4. Feature scaling from standard deviations $100,1$ gives condition number $100$.
5. Ridge raises smallest singular value, reducing instability.
6. SVD singular values $10,0.01$ give $\kappa=1000$.

### `math-09-37` — Tensors  · explain-only

**Connections (§1).**
> This lesson focuses on tensors as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. A tensor is a multi-index array. Modern model activations, attention scores, and convolution kernels all have tensor shapes.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. A tensor is a multi-index array. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> Vectors have one index, matrices have two, and tensors add more axes for batches, channels, heads, time, or spatial dimensions. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
Explain-only: this lesson is about representation and indexing rather than a formula. Explain shape, axes, slicing, and contraction with concrete shapes.

**Symbols.** $T_{ijk}$ is an entry with three indices; shape lists axis lengths; contraction sums over a shared index.

**Real-World Applications (§5).**
1. Image batch shape $32\times224\times224\times3$ has $4{,}816{,}896$ numbers.
2. Transformer activations $16\times128\times768$ have $1{,}572{,}864$ numbers.
3. Conv kernel $3\times3\times64\times128$ has $73{,}728$ weights.
4. Attention scores with batch $2$, heads $8$, length $128$ have $262{,}144$ entries.
5. Bias of shape $768$ broadcasts across $16\times128$ positions.
6. Mean loss over $32$ examples sums losses then divides by $32$.

### `math-09-38` — The Kronecker product  · AUTHOR derivation

**Connections (§1).**
> This lesson focuses on the Kronecker product as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. The Kronecker product builds a large structured matrix by replacing each entry of one matrix with a scaled copy of another. Separable filters, grid covariances, and tensor-product features use this structure.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. The Kronecker product builds a large structured matrix by replacing each entry of one matrix with a scaled copy of another. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> It is how separable grids, tensor-product features, and structured covariance matrices stay manageable. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. Take matrices $A=[a_{ij}]$ and $B$ — one provides block weights, the other provides block shape. 2. Replace each scalar $a_{ij}$ by block $a_{ij}B$ — this preserves the row-column layout of $A$. 3. The resulting block matrix is $A\otimes B$. 4. Dimensions multiply: if $A$ is $m\times n$ and $B$ is $p\times q$, then $A\otimes B$ is $mp\times nq$. 5. Matrix-vector products can be interpreted as applying one factor along one tensor axis and the other factor along another.

**Symbols.** $\otimes$ is Kronecker product; blocks are scaled copies; dimensions multiply by axis.

**Real-World Applications (§5).**
1. $\begin{bmatrix}1&2\\3&4\end{bmatrix}\otimes\begin{bmatrix}0&1\\1&0\end{bmatrix}$ is $4\times4$.
2. Sum of its entries is $(1+2+3+4)(0+1+1+0)=20$.
3. Determinant rule for two $2\times2$ matrices gives $\det(A\otimes B)=\det(A)^2\det(B)^2$; with dets $-2,-1$ gives $4$.
4. Separable image filter $3\times3$ from two length-3 vectors uses $6$ parameters instead of $9$.
5. Grid covariance $20\times20$ and $30\times30$ factors produce a $600\times600$ covariance.
6. Tensor-product features of sizes $5$ and $7$ produce $35$ features.

### `math-09-39` — Weights as linear maps; low-rank factorization  · AUTHOR derivation

**Connections (§1).**
> This lesson focuses on weights as linear maps and low-rank factorization, as part of the linear-algebra toolkit. It builds on the idea that vectors and matrices can represent structured quantities, transformations, and constraints. A weight matrix is a linear map from input features to output features. Compression, adapter layers, and SVD approximations all use this factorized-map view.

**Motivation & Intuition (§2).**
> Start from computations that are already familiar: scaling quantities, adding matching coordinates, and keeping track of how inputs produce outputs. A weight matrix is a linear map from input features to output features. The new step is to treat that pattern as a reusable object rather than as one isolated calculation.
>
> Low-rank factorization replaces one large map by two smaller maps through a bottleneck. The verified work below turns this intuition into a concrete rule, definition, or computation. As you read the steps, keep track of which objects are directions, coefficients, transformations, or measurements; that bookkeeping is what makes the later applications feel like ordinary uses of the same idea.

**Definition & Assumptions (§3).** The verified derivation or explanation is kept below.
1. A dense layer computes $y=Wx$ — matrix rows are output features. 2. If $W\in\mathbb R^{m\times n}$ has rank $r$, write $W\approx AB$ with $A\in\mathbb R^{m\times r}$ and $B\in\mathbb R^{r\times n}$ — the map passes through $r$ latent coordinates. 3. Parameter count changes from $mn$ to $r(m+n)$ — count entries in both factors. 4. SVD gives best rank-$r$ approximation by keeping the top $r$ singular values. 5. The approximation error in spectral norm is the next singular value $\sigma_{r+1}$.

**Symbols.** $W$ is the weight matrix; $r$ is rank or bottleneck size; $A,B$ are low-rank factors; singular values order approximation quality.

**Real-World Applications (§5).**
1. A $1024\times1024$ dense layer has $1{,}048{,}576$ weights.
2. Rank-$8$ LoRA update stores $8(1024+1024)=16{,}384$ weights.
3. Compression ratio is $16{,}384/1{,}048{,}576=1.5625\%$.
4. Bottleneck $512\to64\to512$ stores $65{,}536$ weights instead of $262{,}144$.
5. Rank of $AB$ is at most $8$ if bottleneck is $8$.
6. SVD singular values $10,3,1$ rank-2 approximation has spectral error $1$.
---

## Build order for this section

1. **Start with `math-09-18`** to set the linear-algebra voice and notation for eigenvectors, eigenvalues, determinants, and ML applications.
2. **Replace the shared §5 block** for `09-07`, `09-08`, `09-11`, `09-12`, and `09-13`; these are the only detected copy-pasted application sets.
3. **Author the computational core derivations** in this order: elimination and inverses (`09-02`…`09-08`), determinant/eigen family (`09-17`…`09-22`), orthogonal/QR family (`09-24`…`09-28`), then SVD/least-squares/PCA (`09-31`…`09-34`).
4. **Promote formulas to display form** for the 24 flagged lessons and attach symbol glosses immediately after the formula.
5. **Keep explain-only lessons explain-only** (`09-04`, `09-09`, `09-12`, `09-23`, `09-37` if kept concept-only during implementation); do not force a proof when the lesson is defining vocabulary or data shape. This plan currently gives derivation treatment for 34 lessons and explain-only treatment for 5 lessons.
6. **Run the mechanical checks** after implementation: math-delimiter balance scan, matrix row-break scan, and numeric recheck for determinants, eigenvalues, SVD, projections, least-squares solutions, and condition numbers.
