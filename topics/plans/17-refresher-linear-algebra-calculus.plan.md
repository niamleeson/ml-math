# Lesson Plan — 17 Refresher: Linear Algebra & Calculus

| Field | Value |
|---|---|
| Source | CS 229 |
| Content category | Formula |
| Example type | 🧮 Numeric |
| Colab notebook | No |
| Est. lesson time | 35–50 min |
| Source topic file | ../17-refresher-linear-algebra-calculus.md |

## Part 1 — Overview (plan)
Refresh the algebra and calculus operations that appear constantly in ML objectives, model updates, and diagnostics. Hook: "most ML formulas become manageable once you can track shapes, products, norms, eigen-directions, gradients, and Hessians."

## Part 2 — Key Idea (plan)
- **Focus (per category = Formula):** statements plus quick derivations for vector/matrix notation, matrix operations, matrix properties, and matrix calculus identities.
- **Core artifacts to present:** column-vector and matrix notation; identity/diagonal matrices; inner and outer products; matrix-vector and matrix-matrix multiplication; transpose/inverse/trace/determinant rules; symmetric/antisymmetric decomposition; $L^1$, $L^2$, $L^p$, and $L^\infty$ norms; linear dependence and rank; PSD tests $x^TAx\ge 0$; eigenvalue equation $Az=\lambda z$; spectral theorem $A=U\Lambda U^T$; SVD $A=U\Sigma V^T$; gradient definition $(\nabla_A f)_{ij}=\partial f/\partial A_{ij}$; Hessian definition; trace/determinant gradient identities.

## Part 3 — Worked Examples

### 🟡 Easy (5)
| # | Title | Given | Derivation focus |
|---|---|---|---|
| E1 | Matrix-vector multiplication by rows and columns | $A=\begin{pmatrix}2&-1&0\\1&3&4\end{pmatrix}$, $x=\begin{pmatrix}5\\2\\-1\end{pmatrix}$ | Compute $Ax$ two ways: row inner products and weighted column sum; check output shape $\mathbb{R}^2$. |
| E2 | Inner product, outer product, and norms | $u=(1,-2,2)^T$, $v=(3,0,-1)^T$ | Compute $u^Tv$, $uv^T$, $\lVert u\rVert_1$, $\lVert u\rVert_2$, and $\lVert u\rVert_\infty$ step by step. |
| E3 | Determinant and invertibility of a $2\times2$ matrix | $B=\begin{pmatrix}4&7\\2&6\end{pmatrix}$ | Use the determinant formula, decide whether $B^{-1}$ exists, and verify the inverse against $BB^{-1}=I$. |
| E4 | Trace and transpose identities | $C=\begin{pmatrix}1&2\\3&4\end{pmatrix}$, $D=\begin{pmatrix}0&5\\-1&2\end{pmatrix}$ | Compute $CD$, $(CD)^T$, $D^TC^T$, $\operatorname{tr}(CD)$, and $\operatorname{tr}(DC)$ to verify identities numerically. |
| E5 | Gradient of a scalar function | $f(x,y)=3x^2+2xy+y^2-4x$ at $(1,-2)$ | Compute all partial derivatives, assemble $\nabla f$, and evaluate the gradient vector at the point. |

### 🔴 Advanced (5)
| # | Title | Given | Derivation focus |
|---|---|---|---|
| A1 | Matrix-matrix multiplication and shape debugging | $A\in\mathbb{R}^{2\times3}$ with rows $(1,0,2),( -1,3,1)$ and $B\in\mathbb{R}^{3\times2}$ with columns $(2,1,0)^T,(1,-2,4)^T$ | Compute every entry of $AB$, express it as a sum of outer products, and explain why $BA$ has a different shape. |
| A2 | Eigenvalues, eigenvectors, and diagonalization check | $M=\begin{pmatrix}2&1\\1&2\end{pmatrix}$ | Solve $\det(M-\lambda I)=0$, find eigenvectors, normalize them, and reconstruct $M=U\Lambda U^T$. |
| A3 | PSD test through a quadratic form | $Q=\begin{pmatrix}2&-1\\-1&2\end{pmatrix}$ | Derive $x^TQx$, complete the square or use eigenvalues, and conclude whether $Q\succeq0$ or $Q\succ0$. |
| A4 | Hessian and convexity of a quadratic objective | $g(x)=\frac12 x^T\begin{pmatrix}4&1\\1&3\end{pmatrix}x-\begin{pmatrix}1\\2\end{pmatrix}^Tx$ | Derive $\nabla g$, $\nabla^2 g$, test positive definiteness, and solve the stationary point by hand. |
| A5 | Matrix calculus with trace and determinant | $h(A)=\operatorname{tr}(ABA^TC)+\log|A|$ for invertible $A$ | Apply $\nabla_A\operatorname{tr}(ABA^TC)=CAB+C^TAB^T$ and $\nabla_A\log|A|=(A^{-1})^T$; track shapes for each term. |

## Part 4 — Colab Notebook
N/A — 🧮 numeric topic (no notebook).
