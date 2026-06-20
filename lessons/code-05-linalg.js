/* =====================================================================
   MODULE 5 — LINEAR ALGEBRA: per-lesson CODE SECTIONS.
   One window.CODE entry per lesson id in 05-linalg.js.
   Library: NumPy (numpy.linalg). All runnable in Pyodide.
   ===================================================================== */
window.CODE = Object.assign(window.CODE || {}, {
  "la-cofactor": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>Implement cofactor (Laplace) expansion from scratch — recurse along the first row, summing <code>sign * entry * det(minor)</code> — and check it against <code>np.linalg.det</code>.</p>`,
    code: `import numpy as np

def det_cofactor(A):
    A = np.asarray(A, dtype=float)
    n = A.shape[0]
    if n == 1:
        return A[0, 0]
    total = 0.0
    for j in range(n):                         # expand along the first row
        minor = np.delete(np.delete(A, 0, axis=0), j, axis=1)
        total += ((-1) ** j) * A[0, j] * det_cofactor(minor)   # sign * entry * minor
    return total

A = np.array([[2, 0, 1],
              [3, 1, 2],
              [1, 0, 4]], dtype=float)
print("cofactor expansion det:", det_cofactor(A))
print("numpy det:             ", round(float(np.linalg.det(A)), 6))
print("match:", np.isclose(det_cofactor(A), np.linalg.det(A)))`
  },
  "la-jacobian": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>Build the Jacobian of the polar -> Cartesian map analytically, then confirm it with finite differences. Its determinant equals <code>r</code> — the change-of-variables factor for polar integrals.</p>`,
    code: `import numpy as np

# f: (r, theta) -> (x, y) = (r cos t, r sin t)   [polar -> Cartesian]
def f(p):
    r, t = p
    return np.array([r * np.cos(t), r * np.sin(t)])

def jacobian(p):                 # analytic m x n matrix of partials
    r, t = p
    return np.array([[np.cos(t), -r * np.sin(t)],
                     [np.sin(t),  r * np.cos(t)]])

p = np.array([2.0, 0.6])
J = jacobian(p)
print("analytic Jacobian:\\n", np.round(J, 4))
print("det J =", round(float(np.linalg.det(J)), 4), " (should equal r =", p[0], ")")

# verify every partial with a central finite difference
eps = 1e-6
Jn = np.zeros((2, 2))
for j in range(2):
    d = np.zeros(2); d[j] = eps
    Jn[:, j] = (f(p + d) - f(p - d)) / (2 * eps)
print("finite-diff matches analytic:", np.allclose(J, Jn, atol=1e-4))`
  },

  "la-matmul": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>NumPy's <code>@</code> operator (or <code>np.matmul</code>) does matrix multiplication: every output entry is one row of A dotted with one column of B. We compute A@B by hand-style with the dot-product definition and confirm it matches <code>@</code>.</p>`,
    code: `import numpy as np

A = np.array([[1, 2],
              [3, 4]])
B = np.array([[5, 6],
              [7, 8]])

# @ is matrix multiply: (AB)_ij = sum_k A_ik B_kj
AB = A @ B
print("A @ B =\\n", AB)

# rebuild it entry by entry from dot products to show what @ does
m, p = A.shape[0], B.shape[1]
manual = np.array([[A[i, :] @ B[:, j] for j in range(p)] for i in range(m)])
print("manual =\\n", manual)

print("match:", np.allclose(AB, manual))
# order matters: AB != BA in general
print("AB == BA?", np.allclose(A @ B, B @ A))`
  },

  "la-transpose": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p><code>A.T</code> flips a matrix across its diagonal: entry (i,j) moves to (j,i). We verify the reversal rule (AB)áµ€ = Báµ€Aáµ€ with <code>np.allclose</code>.</p>`,
    code: `import numpy as np

A = np.array([[1, 2, 3],
              [4, 5, 6]])          # 2x3
print("A shape:", A.shape, " A.T shape:", A.T.shape)
print("A.T =\\n", A.T)

# (A.T)_ij == A_ji
print("entry swap A[0,2]==A.T[2,0]:", A[0, 2] == A.T[2, 0])

# product rule: (AB)^T = B^T A^T
B = np.array([[1, 0],
              [0, 1],
              [2, 1]])             # 3x2
lhs = (A @ B).T
rhs = B.T @ A.T
print("(AB)^T == B^T A^T:", np.allclose(lhs, rhs))`
  },

  "la-identity-diagonal": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p><code>np.eye(n)</code> builds the identity; <code>np.diag(d)</code> builds a diagonal matrix. We confirm AI = A and that D scales each coordinate independently: (Dx)_i = d_i x_i.</p>`,
    code: `import numpy as np

I = np.eye(3)
print("identity:\\n", I)

A = np.array([[2., 5., 1.],
              [0., 3., 4.],
              [7., 1., 6.]])
print("A @ I == A:", np.allclose(A @ I, A))   # identity does nothing

# diagonal matrix scales each axis on its own
d = np.array([2., 3., 5.])
D = np.diag(d)
x = np.array([4., 5., 6.])
print("D x =", D @ x)
print("d * x =", d * x)                        # same: (Dx)_i = d_i x_i
print("match:", np.allclose(D @ x, d * x))`
  },

  "la-inverse": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p><code>np.linalg.inv</code> computes the matrix that undoes A. We check the defining identity A·A⁻¹ = I, and solve Ax = b two ways (inverse vs the preferred <code>np.linalg.solve</code>).</p>`,
    code: `import numpy as np

A = np.array([[2., 1.],
              [1., 1.]])
Ainv = np.linalg.inv(A)
print("A^-1 =\\n", Ainv)

# defining property: A A^-1 = I
print("A @ A^-1 = I:", np.allclose(A @ Ainv, np.eye(2)))

# solve A x = b. inverse works, but solve() is faster/stabler
b = np.array([3., 2.])
x_inv = Ainv @ b
x_solve = np.linalg.solve(A, b)
print("x via inverse:", x_inv)
print("x via solve:  ", x_solve)
print("match:", np.allclose(x_inv, x_solve))`
  },

  "la-determinant": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p><code>np.linalg.det</code> returns the single number that measures area/volume scaling. We confirm the 2x2 formula ad − bc, and show a det = 0 matrix is singular (no inverse).</p>`,
    code: `import numpy as np

A = np.array([[3., 1.],
              [1., 2.]])
det = np.linalg.det(A)
print("det(A) =", round(det, 6))                 # 3*2 - 1*1 = 5
print("matches ad-bc:", np.isclose(det, 3*2 - 1*1))

# singular matrix: parallel columns -> det 0 -> no inverse
S = np.array([[2., 4.],
              [1., 2.]])
print("det(S) =", round(np.linalg.det(S), 6))    # 0
try:
    np.linalg.inv(S)
except np.linalg.LinAlgError as e:
    print("inverse failed (singular):", e)`
  },

  "la-trace": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p><code>np.trace</code> sums the diagonal. We verify the two deep facts: tr(AB) = tr(BA) (cyclic) and trace = sum of eigenvalues (from <code>np.linalg.eigvals</code>).</p>`,
    code: `import numpy as np

A = np.array([[2., 1., 0.],
              [4., 3., 5.],
              [1., 0., 6.]])
print("trace(A) =", np.trace(A))                 # 2 + 3 + 6 = 11

# trace == sum of eigenvalues
eigs = np.linalg.eigvals(A)
print("sum of eigenvalues =", round(eigs.sum().real, 6))
print("trace == sum(eig):", np.isclose(np.trace(A), eigs.sum().real))

# cyclic property: tr(AB) == tr(BA)
B = np.array([[1., 0., 2.],
              [3., 1., 0.],
              [0., 4., 1.]])
print("tr(AB) == tr(BA):", np.isclose(np.trace(A @ B), np.trace(B @ A)))`
  },

  "la-rank-independence": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p><code>np.linalg.matrix_rank</code> counts independent columns. We build a matrix whose third column is a combination of the first two and show the rank drops below full, making it singular.</p>`,
    code: `import numpy as np

# v3 = 2*v1 + 3*v2, so it adds no new direction
v1 = np.array([1., 0., 0.])
v2 = np.array([0., 1., 0.])
v3 = 2*v1 + 3*v2
A = np.column_stack([v1, v2, v3])
print("A =\\n", A)
print("rank:", np.linalg.matrix_rank(A), "of", A.shape[1], "columns")

# dependent column -> singular -> det 0
print("det ~ 0:", np.isclose(np.linalg.det(A), 0.0))

# full-rank counter-example
B = np.eye(3)
print("rank(I3):", np.linalg.matrix_rank(B), " (full)")`
  },

  "la-psd": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>A symmetric matrix is positive semi-definite when all eigenvalues are ≥ 0 (equivalently xáµ€Ax ≥ 0 for every x). We build one as Aáµ€A, check its eigenvalues with <code>np.linalg.eigvalsh</code>, and sample random vectors.</p>`,
    code: `import numpy as np
rng = np.random.default_rng(0)

# any A^T A is symmetric PSD
A = rng.standard_normal((4, 3))
M = A.T @ A
print("symmetric:", np.allclose(M, M.T))

# PSD <=> all eigenvalues >= 0 (eigvalsh: symmetric solver)
w = np.linalg.eigvalsh(M)
print("eigenvalues:", np.round(w, 4))
print("all >= 0 (PSD):", np.all(w >= -1e-9))

# spot-check the quadratic form x^T M x >= 0 on random x
xs = rng.standard_normal((1000, 3))
quad = np.einsum("ni,ij,nj->n", xs, M, xs)
print("min x^T M x over samples:", round(quad.min(), 6), ">= 0")`
  },

  "la-spectral": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>The spectral theorem: every symmetric matrix factors as A = QΛQáµ€ with orthonormal eigenvectors Q and real eigenvalues Λ. We get Q, Λ from <code>np.linalg.eigh</code> and rebuild A to verify.</p>`,
    code: `import numpy as np
rng = np.random.default_rng(0)

# make a symmetric matrix
B = rng.standard_normal((3, 3))
A = B + B.T
print("symmetric:", np.allclose(A, A.T))

# eigh returns real eigenvalues w and orthonormal eigenvectors Q
w, Q = np.linalg.eigh(A)
print("eigenvalues:", np.round(w, 4))

# Q is orthogonal: Q^T Q = I
print("Q^T Q == I:", np.allclose(Q.T @ Q, np.eye(3)))

# reconstruct A = Q diag(w) Q^T
A_rebuilt = Q @ np.diag(w) @ Q.T
print("A == Q L Q^T:", np.allclose(A, A_rebuilt))`
  },

  "la-svd": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>SVD factors ANY matrix as A = UΣVáµ€ (rotate, stretch, rotate). <code>np.linalg.svd</code> gives U, the singular values, and Váµ€. We rebuild A exactly, then keep only the top singular value for a rank-1 approximation.</p>`,
    code: `import numpy as np
rng = np.random.default_rng(0)

A = rng.standard_normal((4, 3))
U, s, Vt = np.linalg.svd(A, full_matrices=False)
print("singular values:", np.round(s, 4))

# reconstruct A = U @ diag(s) @ Vt exactly
A_rebuilt = U @ np.diag(s) @ Vt
print("A == U S V^T:", np.allclose(A, A_rebuilt))

# truncate to top-1: best rank-1 approximation (Eckart-Young)
k = 1
A1 = U[:, :k] @ np.diag(s[:k]) @ Vt[:k, :]
print("rank of A1:", np.linalg.matrix_rank(A1))
err = np.linalg.norm(A - A1)
print("rank-1 error =", round(err, 4), " (= next singular value", round(s[1], 4), ")")`
  },

  "la-hessian": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>The Hessian is the matrix of second partial derivatives; it encodes curvature. For a quadratic f(x) = ½xáµ€Hx the Hessian is exactly H. We build it via finite differences, confirm it is symmetric, and read convexity off its eigenvalues.</p>`,
    code: `import numpy as np

# f(x,y) = x^2 + x*y + 2*y^2 -> true Hessian [[2,1],[1,4]]
def f(v):
    x, y = v
    return x**2 + x*y + 2*y**2

def hessian(f, v, h=1e-4):
    n = len(v)
    H = np.zeros((n, n))
    for i in range(n):
        for j in range(n):
            ei, ej = np.zeros(n), np.zeros(n); ei[i]=h; ej[j]=h
            H[i, j] = (f(v+ei+ej) - f(v+ei-ej) - f(v-ei+ej) + f(v-ei-ej)) / (4*h*h)
    return H

H = hessian(f, np.array([1.0, 1.0]))
print("Hessian ~\\n", np.round(H, 3))
print("symmetric:", np.allclose(H, H.T, atol=1e-3))

# convex <=> Hessian PSD <=> eigenvalues >= 0
w = np.linalg.eigvalsh(H)
print("eigenvalues:", np.round(w, 3), " -> convex:", np.all(w > 0))`
  }

});
