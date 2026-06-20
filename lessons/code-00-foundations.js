/* Per-lesson CODE SECTION for Module 0 — Foundations (NumPy).
   Merged into window.CODE by lesson id.
   { lib, runnable, packages?, explain(HTML), code } — runnable ones execute via
   Pyodide (only numpy / scikit-learn / scipy / pandas + stdlib available). */
window.CODE = Object.assign(window.CODE || {}, {
  "fnd-vector": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>A vector is just a 1-D NumPy array. <code>np.array([...])</code> builds one; its <code>.shape</code> tells you the length <i>n</i>, and you index entries by position.</p>`,
    code: `import numpy as np

# one house as a vector: [size_sqft, bedrooms, age_years]
x = np.array([1500.0, 3.0, 10.0])

print("vector x   :", x)
print("dtype      :", x.dtype)     # numbers it holds
print("shape      :", x.shape)     # (n,) -> a 1-D array of length n
print("n (length) :", x.shape[0])

# read entries by position (NumPy indexes from 0)
print("x[0] size     :", x[0])
print("x[1] bedrooms :", x[1])
print("x[2] age      :", x[2])

# a dataset is many such vectors; here is a second house
y = np.array([900.0, 2.0, 25.0])
print("second house :", y)`
  },
  "fnd-dot": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>The dot product multiplies matching entries and sums them into one number. Use the <code>@</code> operator (or <code>np.dot</code>); here weights dotted with features give a price prediction.</p>`,
    code: `import numpy as np

x = np.array([1500.0, 3.0, 10.0])         # a house: size, bedrooms, age
w = np.array([200.0, 10000.0, -500.0])    # price weights ($ per unit)

# dot product: multiply matching entries, then add them all up
dot = x @ w                                # same as np.dot(x, w)
print("elementwise products:", x * w)
print("w . x  (prediction) :", dot)

# the older the house, the more the negative weight pulls price down
print("matches np.dot      :", np.isclose(dot, np.dot(x, w)))

# dot product also measures agreement of direction (cosine similarity)
a = np.array([3.0, 1.0])
b = np.array([1.0, 3.0])
cos = (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))
print("cosine(a, b)        :", round(float(cos), 4))`
  },
  "fnd-matrix": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>A matrix is a 2-D NumPy array: a grid with rows and columns. <code>.shape</code> gives (rows, cols), and you index a single entry with <code>A[i, j]</code> (row first, column second).</p>`,
    code: `import numpy as np

# three houses (rows), two features each (size, bedrooms)
A = np.array([
    [1500.0, 3.0],
    [ 900.0, 2.0],
    [2200.0, 4.0],
])

print("matrix A:")
print(A)
print("shape (m rows, n cols):", A.shape)   # (3, 2)

# read one entry: row i, column j (0-indexed)
print("A[1, 0] house-2 size     :", A[1, 0])
print("A[2, 1] house-3 bedrooms :", A[2, 1])

# slice a whole row (one example) or a whole column (one feature)
print("row 0 (house 1)   :", A[0, :])
print("col 0 (all sizes) :", A[:, 0])`
  },
  "fnd-matvec": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>Matrix times vector does one dot product per row, scoring every example at once. <code>A @ x</code> turns an (m,n) matrix and length-n vector into a length-m result.</p>`,
    code: `import numpy as np

A = np.array([                 # two houses: [size, bedrooms]
    [1500.0, 3.0],
    [ 900.0, 2.0],
])
x = np.array([200.0, 10000.0])  # price weights

# matrix x vector: each row of A dotted with x
Ax = A @ x
print("Ax (price per house):", Ax)        # both predictions at once

# verify it equals the per-row dot products done by hand
print("row 0 . x :", A[0] @ x)
print("row 1 . x :", A[1] @ x)

# shape rule: (m,n) @ (n,) -> (m,)  the inner n's must match
print("A.shape =", A.shape, " x.shape =", x.shape, " -> Ax.shape =", Ax.shape)`
  },
  "fnd-norm": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>A norm measures a vector's size. <code>np.linalg.norm</code> gives the L2 (straight-line) length by default and the L1 (sum of absolute values) with <code>ord=1</code>; distance between two vectors is the norm of their difference.</p>`,
    code: `import numpy as np

x = np.array([3.0, -4.0])

# L2 = sqrt(sum of squares) = Pythagoras
l2 = np.linalg.norm(x)            # default ord=2
# L1 = sum of absolute values
l1 = np.linalg.norm(x, ord=1)
print("x   :", x)
print("L2  :", l2, " (= sqrt(9+16) = 5)")
print("L1  :", l1, " (= |3|+|-4| = 7)")

# do it by hand to see what norm() computes
print("L2 by hand:", np.sqrt(np.sum(x ** 2)))
print("L1 by hand:", np.sum(np.abs(x)))

# distance between two vectors = norm of their difference
a = np.array([0.0, 6.0, 8.0])
b = np.array([0.0, 0.0, 0.0])
print("||a - b|| :", np.linalg.norm(a - b))   # = 10`
  },
  "fnd-derivative": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>A derivative is the slope of a function. Here we compare the exact rule (slope of x&sup2; is 2x) against a tiny finite-difference estimate of the limit definition; they agree closely.</p>`,
    code: `import numpy as np

def f(x):                 # a U-shaped bowl
    return x ** 2

def f_prime(x):           # exact derivative: slope of x^2 is 2x
    return 2 * x

# finite-difference approximation of the limit (f(x+h)-f(x))/h
h = 1e-6
xs = np.array([-2.0, 0.0, 3.0])
approx = (f(xs + h) - f(xs)) / h
exact = f_prime(xs)

for xi, ap, ex in zip(xs, approx, exact):
    print("x=%5.1f  approx slope=%8.4f  exact 2x=%6.1f" % (xi, ap, ex))

# slope is 0 at the bottom of the bowl (x=0) -> a minimum
print("close to exact?", np.allclose(approx, exact, atol=1e-3))`
  },
  "fnd-gradient": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>The gradient stacks the slope in every input direction into one vector pointing uphill. We compute it for f = x&sup2; + y&sup2; and take one downhill step along the negative gradient to shrink the value.</p>`,
    code: `import numpy as np

def f(p):                       # round bowl: x^2 + y^2
    return p[0] ** 2 + p[1] ** 2

def grad(p):                    # gradient = [2x, 2y]
    return 2 * p

p = np.array([3.0, 4.0])
g = grad(p)
print("point   :", p, " f =", f(p))
print("grad    :", g, " (points straight uphill)")

# gradient descent: step opposite the gradient to go downhill
lr = 0.1
for step in range(5):
    p = p - lr * grad(p)        # -grad heads toward the minimum (0,0)
    print("step %d  point=%s  f=%.4f" % (step + 1, np.round(p, 4), f(p)))

print("heading toward min at [0, 0]")`
  },
  "fnd-chain": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>The chain rule multiplies the slope of each nested step together — this is exactly how backprop flows gradients. Here z = (3x)&sup2;, so dz/dx = (2&middot;3x)&middot;3 = 18x, matched against a finite-difference check.</p>`,
    code: `import numpy as np

# composition: y = 3x  (inner),  z = y^2  (outer)
def inner(x):
    return 3 * x

def outer(y):
    return y ** 2

def z(x):
    return outer(inner(x))

# chain rule: dz/dx = dz/dy * dy/dx = (2y) * 3 = 6*(3x) = 18x
def dz_dx(x):
    y = inner(x)
    return (2 * y) * 3          # outer' times inner'

xs = np.array([-1.0, 0.5, 1.0])
h = 1e-6
approx = (z(xs + h) - z(xs)) / h     # numeric check of the limit
exact = dz_dx(xs)
for xi, ap, ex in zip(xs, approx, exact):
    print("x=%5.2f  chain-rule=%7.3f  numeric=%7.3f  (18x=%6.2f)" % (xi, ex, ap, 18 * xi))

print("chain rule matches numeric?", np.allclose(approx, exact, atol=1e-3))`
  },
  "fnd-eigen": {
    lib: "NumPy",
    runnable: true,
    packages: ["numpy"],
    explain: `<p>Eigenvectors are directions a matrix only stretches (never rotates); the stretch factor is the eigenvalue. <code>np.linalg.eig</code> finds them, and we verify the defining equation A z = &lambda; z.</p>`,
    code: `import numpy as np

A = np.array([
    [2.0, 0.0],
    [0.0, 3.0],
])

# eigenvalues (lambdas) and eigenvectors (columns of vecs)
vals, vecs = np.linalg.eig(A)
print("eigenvalues :", vals)            # [2., 3.]
print("eigenvectors (columns):")
print(vecs)

# check A z = lambda z for each eigenpair
for i in range(len(vals)):
    z = vecs[:, i]
    Az = A @ z
    lz = vals[i] * z
    print("pair %d  Az=%s  lambda*z=%s  match=%s"
          % (i, np.round(Az, 4), np.round(lz, 4), np.allclose(Az, lz)))

# a generic vector gets rotated; an eigenvector does not
v = np.array([1.0, 1.0])
print("A @ [1,1] =", A @ v, "-> points a new way (not an eigenvector)")`
  }
});
