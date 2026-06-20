/* Per-lesson real-world walkthroughs. Merged into window.WALKTHROUGHS by lesson id.
   Each lesson maps to an array of >=3 walkthroughs:
   { title, domain, question, steps:[{title, body(HTML+math), code?, output?}], conclusion(HTML) } */
window.WALKTHROUGHS = Object.assign(window.WALKTHROUGHS || {}, {

  /* ============================================================ la-matmul */
  "la-matmul": [
    {
      title: `Scoring a whole batch of users at once`,
      domain: `Recommenders`,
      question: `Three users rate four genres; each genre maps to two latent traits. What is every user's score on each trait, in one shot?`,
      steps: [
        { title: `The data`, body: `<p>$U$ is a $3\\times4$ user-by-genre matrix. $G$ is a $4\\times2$ genre-by-trait matrix. We want each user's score on each trait: $S = UG$, shape $3\\times2$.</p>` },
        { title: `The math`, body: `<p>Entry $S_{ij}$ is row $i$ of $U$ (one user's genre tastes) dotted with column $j$ of $G$ (one trait's genre loadings): $S_{ij}=\\sum_k U_{ik}G_{kj}$. One matrix multiply scores all users on all traits.</p>` },
        { title: `Run it`, body: `<p>Multiply and check one entry by hand.</p>`,
          code: `import numpy as np
# 3 users rate affinity to 4 genres; 4 genres x 2 latent traits
U = np.array([[5,1,0,2],[0,4,3,1],[2,2,5,0]])     # user x genre
G = np.array([[1.0,0.0],[0.5,0.5],[0.0,1.0],[0.8,0.2]])  # genre x trait
S = U @ G                                          # user x trait scores
print("shapes:", U.shape, "@", G.shape, "=", S.shape)
print(S)
# verify one entry by hand: user0 . trait0
manual = U[0] @ G[:,0]
print("S[0,0] by hand:", manual, "matches:", np.isclose(S[0,0], manual))`,
          output: `shapes: (3, 4) @ (4, 2) = (3, 2)
[[7.1 0.9]
 [2.8 5.2]
 [3.  6. ]]
S[0,0] by hand: 7.1 matches: True` }
      ],
      conclusion: `User 0 scores high on trait 0 ($7.1$); users 1 and 2 lean to trait 1 ($5.2$ and $6.0$). The single product $S=UG$ replaced twelve separate dot products — exactly the $XW$ a model layer runs per batch.`
    },
    {
      title: `Composing two transforms into one`,
      domain: `Graphics`,
      question: `You rotate a sprite by 30 degrees, then stretch it 2x along x. Can you bake both into a single matrix and apply it once?`,
      steps: [
        { title: `The data`, body: `<p>Rotation $R$ (by $30^\\circ$) and scale $\\mathrm{Scale}=\\mathrm{diag}(2,1)$. To rotate first then scale, the combined matrix is $M=\\mathrm{Scale}\\cdot R$ (rightmost acts first).</p>` },
        { title: `The math`, body: `<p>Applying $R$ then $\\mathrm{Scale}$ to a point $p$ gives $\\mathrm{Scale}(Rp)=(\\mathrm{Scale}\\,R)p=Mp$. Matrix multiply is associative, so one precomputed $M$ does the work of two passes.</p>` },
        { title: `Run it`, body: `<p>Build $M$, transform three corner points, and confirm it matches doing the two steps in sequence.</p>`,
          code: `import numpy as np
# 2D rotation by 30 deg then scale x by 2 -> compose into ONE matrix
t = np.radians(30)
R = np.array([[np.cos(t), -np.sin(t)],[np.sin(t), np.cos(t)]])
Scale = np.array([[2.0,0.0],[0.0,1.0]])
M = Scale @ R                      # apply R first, then Scale
pts = np.array([[1,0],[0,1],[1,1]]).T   # 3 points as columns
out_compose = M @ pts
out_sequential = Scale @ (R @ pts)
print("composed M =\\n", np.round(M,3))
print("transformed points (cols):\\n", np.round(out_compose,3))
print("same as applying one-by-one:", np.allclose(out_compose, out_sequential))`,
          output: `composed M =
 [[ 1.732 -1.   ]
 [ 0.5    0.866]]
transformed points (cols):
 [[ 1.732 -1.     0.732]
 [ 0.5    0.866  1.366]]
same as applying one-by-one: True` }
      ],
      conclusion: `One matrix $M=\\begin{bmatrix}1.732 & -1\\\\ 0.5 & 0.866\\end{bmatrix}$ captures "rotate then stretch". Game engines compose entire transform chains this way so each vertex costs a single multiply.`
    },
    {
      title: `Two-day weather forecast`,
      domain: `Markov chains`,
      question: `Given today's weather transition probabilities, what is the chance of rain three days out if today is sunny?`,
      steps: [
        { title: `The data`, body: `<p>Transition matrix $P$ over states (Sunny, Rainy). Row = today, column = tomorrow. Each row sums to 1 because tomorrow must be some state.</p>` },
        { title: `The math`, body: `<p>The $n$-step transition is $P^n$: chaining one day after another is matrix multiply. Starting distribution $s_0$ times $P^3$ gives the distribution three days later, $s_3=s_0P^3$.</p>` },
        { title: `Run it`, body: `<p>Square $P$ for the 2-day map, then raise to the 3rd power from a sunny start.</p>`,
          code: `import numpy as np
# Markov chain: weather transition. States: Sunny, Rainy
P = np.array([[0.9, 0.1],
              [0.5, 0.5]])   # rows = today, cols = tomorrow
two_day = P @ P              # 2-step transition
print("2-day transition:\\n", np.round(two_day,3))
# Start Sunny, distribution after 3 days (row vector times P^3)
s0 = np.array([1.0, 0.0])
s3 = s0 @ np.linalg.matrix_power(P, 3)
print("P(state) after 3 days from Sunny:", np.round(s3,4))
# rows of a transition matrix must sum to 1
print("rows sum to 1:", np.allclose(two_day.sum(axis=1), 1))`,
          output: `2-day transition:
 [[0.86 0.14]
 [0.7  0.3 ]]
P(state) after 3 days from Sunny: [0.844 0.156]
rows sum to 1: True` }
      ],
      conclusion: `From a sunny start there is a $15.6\\%$ chance of rain three days later. Repeated matrix multiplication ($P^n$) propagates probabilities forward through time — the engine behind every Markov forecast and PageRank.`
    }
  ],

  /* =========================================================== la-transpose */
  "la-transpose": [
    {
      title: `Backprop through a dense layer`,
      domain: `Deep learning`,
      question: `A layer computes $Y=XW$. Given the gradient flowing back into $Y$, how do you route it to the inputs $X$ and the weights $W$?`,
      steps: [
        { title: `The data`, body: `<p>Batch $X$ is $4\\times3$, weights $W$ are $3\\times2$, output $Y=XW$ is $4\\times2$. Upstream gradient $\\mathrm{d}Y$ has the same shape as $Y$.</p>` },
        { title: `The math`, body: `<p>The chain rule gives $\\mathrm{d}X=\\mathrm{d}Y\\,W^\\top$ and $\\mathrm{d}W=X^\\top\\,\\mathrm{d}Y$. Transposes make the shapes line up: $\\mathrm{d}X$ must match $X$ and $\\mathrm{d}W$ must match $W$.</p>` },
        { title: `Run it`, body: `<p>Forward pass, then backward pass using $W^\\top$ and $X^\\top$.</p>`,
          code: `import numpy as np
# A dense layer: y = X W. Backprop needs gradient w.r.t. X using W^T
rng = np.random.default_rng(0)
X = rng.standard_normal((4, 3))      # batch 4, in_features 3
W = rng.standard_normal((3, 2))      # 3 in, 2 out
Y = X @ W                            # forward, shape (4,2)
dY = np.ones((4, 2))                 # upstream gradient
dX = dY @ W.T                        # gradient flows back through W transpose
dW = X.T @ dY                        # gradient of weights
print("Y shape:", Y.shape, " dX shape:", dX.shape, " dW shape:", dW.shape)
print("dX[0]:", np.round(dX[0], 3))
print("dW:\\n", np.round(dW, 3))
# shape sanity: dX matches X, dW matches W
print("shapes match:", dX.shape == X.shape and dW.shape == W.shape)`,
          output: `Y shape: (4, 2)  dX shape: (4, 3)  dW shape: (3, 2)
dX[0]: [-2.544 -1.978 -0.861]
dW:
 [[ 0.269  0.269]
 [-0.344 -0.344]
 [ 0.34   0.34 ]]
shapes match: True` }
      ],
      conclusion: `The forward weight $W$ becomes $W^\\top$ on the way back: $\\mathrm{d}X=\\mathrm{d}Y\\,W^\\top$. Every autodiff framework hides exactly this transpose inside its backward pass.`
    },
    {
      title: `Style "fingerprint" of an image`,
      domain: `Computer vision`,
      question: `Neural style transfer captures texture as a Gram matrix of feature correlations. How is it built, and why is it symmetric?`,
      steps: [
        { title: `The data`, body: `<p>$F$ is a $3\\times5$ matrix: 3 feature maps, each flattened over 5 spatial locations. The Gram matrix is $G=FF^\\top$, a $3\\times3$ summary of how feature maps co-activate.</p>` },
        { title: `The math`, body: `<p>$G_{ij}=\\sum_k F_{ik}F_{jk}$ is the correlation between map $i$ and map $j$. Because $G^\\top=(FF^\\top)^\\top=F F^\\top=G$, the Gram matrix is always symmetric. Its diagonal holds each map's squared norm.</p>` },
        { title: `Run it`, body: `<p>Compute $FF^\\top$ and confirm symmetry.</p>`,
          code: `import numpy as np
rng = np.random.default_rng(0)
F = rng.standard_normal((3, 5))      # 3 feature maps, 5 spatial locations
G = F @ F.T                          # 3x3 Gram of feature correlations
print("Gram matrix G:\\n", np.round(G, 3))
print("symmetric (G == G^T):", np.allclose(G, G.T))
print("diagonal = squared norms:", np.round(np.diag(G), 3))`,
          output: `Gram matrix G:
 [[ 0.741  1.084 -0.928]
 [ 1.084  4.825 -0.643]
 [-0.928 -0.643  7.396]]
symmetric (G == G^T): True
diagonal = squared norms: [0.741 4.825 7.396]` }
      ],
      conclusion: `The Gram matrix $FF^\\top$ is symmetric by the rule $(FF^\\top)^\\top=FF^\\top$, so it stores each pairwise feature correlation exactly once. Matching these fingerprints between two images is what transfers texture.`
    },
    {
      title: `Covariance straight from centered data`,
      domain: `Statistics`,
      question: `How does the textbook covariance formula $\\frac{1}{n-1}X_c^\\top X_c$ relate to the data, and does it match numpy?`,
      steps: [
        { title: `The data`, body: `<p>$X$ has $n=100$ rows (samples) and 3 columns (features) with very different spreads. Center each column by subtracting its mean to get $X_c$.</p>` },
        { title: `The math`, body: `<p>Covariance is $\\Sigma=\\frac{1}{n-1}X_c^\\top X_c$. The transpose turns the $n\\times3$ data into $3\\times n$, so the product is $3\\times3$ — one entry per feature pair. $\\Sigma_{ij}$ is the averaged product of centered features $i$ and $j$.</p>` },
        { title: `Run it`, body: `<p>Build it from the transpose product and compare to <code>np.cov</code>.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
rng = np.random.default_rng(0)
X = rng.standard_normal((100, 3)) * np.array([1.0, 2.0, 0.5]) + 5.0
Xc = X - X.mean(axis=0)              # center each column
Sigma = (Xc.T @ Xc) / (X.shape[0]-1)
print("covariance (manual):\\n", np.round(Sigma, 3))
print("matches np.cov:", np.allclose(Sigma, np.cov(X, rowvar=False)))`,
          output: `covariance (manual):
 [[1.195 0.055 0.002]
 [0.055 4.067 0.066]
 [0.002 0.066 0.23 ]]
matches np.cov: True` }
      ],
      conclusion: `Covariance is just $\\frac{1}{n-1}X_c^\\top X_c$. The transpose is what collapses $n$ samples into a compact $3\\times3$ matrix of feature-pair relationships — diagonal variances $1.20,4.07,0.23$ recover the planted spreads.`
    }
  ],

  /* ================================================= la-identity-diagonal */
  "la-identity-diagonal": [
    {
      title: `Standardizing features before training`,
      domain: `ML preprocessing`,
      question: `Features live on wildly different scales (price vs. fraction vs. count). How does a diagonal matrix put them all on equal footing?`,
      steps: [
        { title: `The data`, body: `<p>$X$ has 5 samples and 3 features with stds roughly $10,\\,0.1,\\,100$. Standardizing means dividing each column by its std — multiply by $D=\\mathrm{diag}(1/\\sigma_1,1/\\sigma_2,1/\\sigma_3)$.</p>` },
        { title: `The math`, body: `<p>A diagonal matrix scales each axis independently: column $j$ of $XD$ is column $j$ of $X$ divided by $\\sigma_j$, with no mixing between features. After centering and applying $D$, every column has unit standard deviation.</p>` },
        { title: `Run it`, body: `<p>Build $D$ from the per-column stds and check the result.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
# Standardize features: subtract mean, divide by std = multiply by diagonal D=diag(1/std)
rng = np.random.default_rng(0)
X = rng.standard_normal((5, 3)) * np.array([10.0, 0.1, 100.0]) + np.array([50, 0, -20])
mu, sd = X.mean(0), X.std(0)
D = np.diag(1.0 / sd)                 # diagonal scaling matrix
Xn = (X - mu) @ D                     # scale each column independently
print("per-column std after scaling:", np.round(Xn.std(0), 6))
print("D is diagonal:", np.allclose(D, np.diag(np.diag(D))))`,
          output: `per-column std after scaling: [1. 1. 1.]
D is diagonal: True` }
      ],
      conclusion: `One diagonal matrix $D=\\mathrm{diag}(1/\\sigma_j)$ rescales every feature to unit variance at once. Because $D$ is diagonal, no feature leaks into another — each axis is stretched on its own.`
    },
    {
      title: `Ridge regression rescues a singular fit`,
      domain: `Regression`,
      question: `Two features are perfectly correlated, so $X^\\top X$ is singular and the fit blows up. How does adding $\\lambda I$ fix it?`,
      steps: [
        { title: `The data`, body: `<p>20 samples, 3 features, where feature 3 equals feature 1 plus feature 2. That collinearity makes $X^\\top X$ singular ($\\det\\approx0$), so $(X^\\top X)^{-1}$ does not exist.</p>` },
        { title: `The math`, body: `<p>Ridge solves $(X^\\top X+\\lambda I)w=X^\\top y$. Adding $\\lambda I$ lifts every eigenvalue by $\\lambda$, pushing the smallest off zero and restoring invertibility. The identity is the "do nothing" matrix; scaling it by $\\lambda$ adds a uniform ridge.</p>` },
        { title: `Run it`, body: `<p>Show $\\det(X^\\top X)\\approx0$, then $\\det(X^\\top X+\\lambda I)\\neq0$.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
rng = np.random.default_rng(0)
X = rng.standard_normal((20, 3))
X[:,2] = X[:,0] + X[:,1]             # collinear -> X^T X singular
y = X @ np.array([1.0, -2.0, 0.5]) + 0.01*rng.standard_normal(20)
XtX = X.T @ X
print("det(X^T X): %.2e  (singular)" % np.linalg.det(XtX))
lam = 1.0
w = np.linalg.solve(XtX + lam*np.eye(3), X.T @ y)     # ridge solution
print("ridge weights:", np.round(w, 3))
print("det(X^T X + lambda I): %.1f  (now invertible)" % np.linalg.det(XtX + lam*np.eye(3)))`,
          output: `det(X^T X): -5.31e-12  (singular)
ridge weights: [ 1.407 -1.383  0.024]
det(X^T X + lambda I): 932.2  (now invertible)` }
      ],
      conclusion: `Adding $\\lambda I$ turned a singular $X^\\top X$ (det $\\approx10^{-12}$) into a comfortably invertible $932.2$. The identity matrix's only job here is to nudge every eigenvalue up by $\\lambda$, stabilizing the solve.`
    },
    {
      title: `Per-channel color gain on a pixel`,
      domain: `Image processing`,
      question: `A white-balance step boosts red, keeps green, dims blue. How is it a diagonal multiply, and how do you undo it exactly?`,
      steps: [
        { title: `The data`, body: `<p>Gain matrix $D=\\mathrm{diag}(1.2,1.0,0.8)$ and one RGB pixel $(100,150,200)$. Each channel is scaled by its own gain.</p>` },
        { title: `The math`, body: `<p>$Dp$ scales channel $i$ by $d_i$ with no cross-talk. The inverse of a diagonal matrix is just the reciprocals: $D^{-1}=\\mathrm{diag}(1/d_i)$, so undoing the gain is trivial and exact.</p>` },
        { title: `Run it`, body: `<p>Apply the gain, then invert it.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
# RGB channel gain in image processing: a diagonal matrix scales each color channel
gain = np.diag([1.2, 1.0, 0.8])     # boost red, keep green, dim blue
pixel = np.array([100, 150, 200])   # one RGB pixel
out = gain @ pixel
print("adjusted pixel:", out)
# undo it: inverse of a diagonal is just the reciprocals
undo = np.diag([1/1.2, 1/1.0, 1/0.8])
print("restored:", np.round(undo @ out, 6))
print("gain @ undo == I:", np.allclose(gain @ undo, np.eye(3)))`,
          output: `adjusted pixel: [120. 150. 160.]
restored: [100. 150. 200.]
gain @ undo == I: True` }
      ],
      conclusion: `The pixel becomes $(120,150,160)$, and reciprocating the diagonal restores it exactly because $D\\,D^{-1}=I$. Per-channel gains are the simplest, perfectly invertible transforms — pure axis scaling.`
    }
  ],

  /* ============================================================ la-inverse */
  "la-inverse": [
    {
      title: `How much of each alloy to melt`,
      domain: `Manufacturing`,
      question: `Two alloys have known gold/silver fractions. To hit an exact gold and silver target, how many kg of each do you melt?`,
      steps: [
        { title: `The data`, body: `<p>Alloy 1 is $30\\%$ gold / $70\\%$ silver, alloy 2 is $60\\%$ gold / $40\\%$ silver. Target: $3$ kg gold and $4$ kg silver. With unknown kg $x=(x_1,x_2)$, this is $Ax=b$.</p>` },
        { title: `The math`, body: `<p>$A=\\begin{bmatrix}0.3 & 0.6\\\\ 0.7 & 0.4\\end{bmatrix}$, $b=(3,4)$. The unique solution is $x=A^{-1}b$ — the inverse "divides" by the mixing matrix to back out the amounts.</p>` },
        { title: `Run it`, body: `<p>Solve the system and verify via the explicit inverse.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
# Mixing problem: 2 alloys, want target metal amounts. Solve A x = b
# Alloy1 is 30% gold 70% silver; Alloy2 is 60% gold 40% silver (by kg)
A = np.array([[0.30, 0.60],   # gold per kg of each alloy
              [0.70, 0.40]])  # silver per kg
b = np.array([3.0, 4.0])      # want 3 kg gold, 4 kg silver
x = np.linalg.solve(A, b)     # kg of each alloy to melt
print("kg of alloy1, alloy2:", np.round(x, 4))
print("check A x == b:", np.allclose(A @ x, b))
print("via inverse:", np.round(np.linalg.inv(A) @ b, 4))`,
          output: `kg of alloy1, alloy2: [4. 3.]
check A x == b: True
via inverse: [4. 3.]` }
      ],
      conclusion: `Melt $4$ kg of alloy 1 and $3$ kg of alloy 2. The inverse $A^{-1}$ is the concept that makes "solve $Ax=b$" exact; in practice <code>solve</code> does it without ever forming $A^{-1}$.`
    },
    {
      title: `Closed-form house-price weights`,
      domain: `Regression`,
      question: `What are the regression weights that best predict price from size and bedrooms, computed in closed form?`,
      steps: [
        { title: `The data`, body: `<p>$50$ houses with size (sqm) and bedroom count, plus a column of ones for the intercept, form the design matrix $X$ ($50\\times3$). Prices $y$ come from true weights $(20,3,10)$ plus noise.</p>` },
        { title: `The math`, body: `<p>The least-squares solution is the normal equation $w=(X^\\top X)^{-1}X^\\top y$. The inverse of the $3\\times3$ Gram matrix $X^\\top X$ sits at its heart.</p>` },
        { title: `Run it`, body: `<p>Compute the closed form and confirm it matches numpy's least-squares solver.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
# House prices: closed-form least squares w = (X^T X)^-1 X^T y
rng = np.random.default_rng(0)
n = 50
size = rng.uniform(50, 200, n)      # sqm
beds = rng.integers(1, 5, n).astype(float)
X = np.column_stack([np.ones(n), size, beds])   # intercept + 2 features
true = np.array([20.0, 3.0, 10.0])
y = X @ true + rng.standard_normal(n)*5
w = np.linalg.inv(X.T @ X) @ X.T @ y
print("fitted weights [intercept, per-sqm, per-bed]:", np.round(w, 3))
# numpy's lstsq should agree
w2, *_ = np.linalg.lstsq(X, y, rcond=None)
print("matches np.linalg.lstsq:", np.allclose(w, w2))`,
          output: `fitted weights [intercept, per-sqm, per-bed]: [17.898  3.012 10.424]
matches np.linalg.lstsq: True` }
      ],
      conclusion: `The closed form recovered $\\approx3.0$ per sqm and $\\approx10.4$ per bedroom, close to the true $(3,10)$. The inverse $(X^\\top X)^{-1}$ is the precise definition of the least-squares fit, even when we solve it more stably in practice.`
    },
    {
      title: `Mapping a world point into the camera`,
      domain: `Robotics / vision`,
      question: `Given a camera's affine pose in the world, where does a known world point land in the camera's own coordinate frame?`,
      steps: [
        { title: `The data`, body: `<p>The camera-to-world map is $\\text{world}=M\\,\\text{cam}+t$ with $M=\\begin{bmatrix}2 & 0.5\\\\0 & 1.5\\end{bmatrix}$ and origin $t=(3,-1)$. We have a world point $(7,5)$.</p>` },
        { title: `The math`, body: `<p>To invert the map, solve for cam: $\\text{cam}=M^{-1}(\\text{world}-t)$. The inverse $M^{-1}$ undoes the camera's scale and shear, sending world coordinates back into the camera frame.</p>` },
        { title: `Run it`, body: `<p>Apply $M^{-1}$, then round-trip to confirm.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
# 2D affine camera->world: world = M @ cam + t. Invert to go world->cam.
M = np.array([[2.0, 0.5],
              [0.0, 1.5]])    # scale+shear of the camera frame
t = np.array([3.0, -1.0])     # camera origin in world coords
world_pt = np.array([7.0, 5.0])
Minv = np.linalg.inv(M)
cam_pt = Minv @ (world_pt - t)         # map a world point back into the camera
print("camera-frame coords:", np.round(cam_pt, 4))
# round trip should return the world point
back = M @ cam_pt + t
print("round-trip world point:", np.round(back, 6))
print("M @ Minv == I:", np.allclose(M @ Minv, np.eye(2)))`,
          output: `camera-frame coords: [1. 4.]
round-trip world point: [7. 5.]
M @ Minv == I: True` }
      ],
      conclusion: `The world point $(7,5)$ sits at $(1,4)$ in the camera frame, and applying $M$ takes it right back. The inverse is how every robot turns "where is it in the world" into "where is it to me".`
    }
  ],

  /* ======================================================== la-determinant */
  "la-determinant": [
    {
      title: `Area of a land parcel from its corners`,
      domain: `GIS / surveying`,
      question: `Three GPS corners define a triangular plot. What is its area, using only the corner coordinates?`,
      steps: [
        { title: `The data`, body: `<p>Corners $A=(2,1)$, $B=(8,3)$, $C=(4,7)$. Build two edge vectors $B-A$ and $C-A$ as the rows of a $2\\times2$ matrix $M$.</p>` },
        { title: `The math`, body: `<p>The parallelogram spanned by the two edges has area $|\\det M|$; the triangle is half of that: $\\text{area}=\\tfrac12|\\det M|$. The determinant is exactly the signed area scale of the two edge vectors.</p>` },
        { title: `Run it`, body: `<p>Take the determinant of the edge matrix and cross-check with the shoelace formula.</p>`,
          code: `import numpy as np
# Area of a triangle (land parcel) from its 3 corners via a determinant
A = np.array([2.0, 1.0]); B = np.array([8.0, 3.0]); C = np.array([4.0, 7.0])
M = np.array([B - A, C - A])         # two edge vectors as rows
area = 0.5 * abs(np.linalg.det(M))
print("edge matrix:\\n", M)
print("triangle area:", area)
# cross-check with the shoelace formula
x1,y1=A; x2,y2=B; x3,y3=C
shoe = 0.5*abs(x1*(y2-y3)+x2*(y3-y1)+x3*(y1-y2))
print("matches shoelace:", np.isclose(area, shoe))`,
          output: `edge matrix:
 [[6. 2.]
 [2. 6.]]
triangle area: 16.0
matches shoelace: True` }
      ],
      conclusion: `The parcel covers $16$ square units, since $\\tfrac12|\\det M|=\\tfrac12\\cdot32$. The determinant turns two edge vectors directly into a (signed) area — the basis of every polygon-area routine.`
    },
    {
      title: `The volume term in a Gaussian`,
      domain: `Probability`,
      question: `A 2D Gaussian's density has a normalizing constant built from $\\det\\Sigma$. How does that constant come together, and does it match scipy?`,
      steps: [
        { title: `The data`, body: `<p>Covariance $\\Sigma=\\begin{bmatrix}2 & 0.6\\\\0.6 & 1\\end{bmatrix}$, query point $x=(1,-0.5)$, mean at the origin. We want the density there.</p>` },
        { title: `The math`, body: `<p>The Gaussian density is $\\frac{1}{\\sqrt{(2\\pi)^d\\det\\Sigma}}\\exp(-\\tfrac12 x^\\top\\Sigma^{-1}x)$. The term $\\det\\Sigma$ is the "volume" of the spread; it normalizes so the density integrates to 1.</p>` },
        { title: `Run it`, body: `<p>Compute $\\det\\Sigma$, the constant, the density, and compare with scipy.</p>`,
          code: `import numpy as np
# Multivariate Gaussian density needs det(Sigma): the "volume" of the spread
Sigma = np.array([[2.0, 0.6],
                  [0.6, 1.0]])
d = Sigma.shape[0]
x = np.array([1.0, -0.5]); mu = np.zeros(2)
detS = np.linalg.det(Sigma)
norm_const = 1.0 / np.sqrt((2*np.pi)**d * detS)
diff = x - mu
density = norm_const * np.exp(-0.5 * diff @ np.linalg.inv(Sigma) @ diff)
print("det(Sigma):", round(detS, 4))
print("normalizing constant:", round(norm_const, 6))
print("density at x:", round(density, 6))
# scipy must agree
from scipy.stats import multivariate_normal
print("matches scipy:", np.isclose(density, multivariate_normal(mu, Sigma).pdf(x)))`,
          output: `det(Sigma): 1.64
normalizing constant: 0.124279
density at x: 0.065515
matches scipy: True` }
      ],
      conclusion: `With $\\det\\Sigma=1.64$, the density at $x$ is $0.0655$, matching scipy exactly. The determinant of the covariance is the "volume" that keeps a Gaussian a valid probability distribution.`
    },
    {
      title: `Detecting a redundant feature`,
      domain: `Feature engineering`,
      question: `One feature is secretly a combination of two others. How does the determinant of the feature Gram matrix expose it?`,
      steps: [
        { title: `The data`, body: `<p>Features $f_1,f_2$ are random; $f_3=2f_1-f_2$ is an exact linear combination. Stack them into $X$ ($100\\times3$) and form the Gram matrix $G=X^\\top X$.</p>` },
        { title: `The math`, body: `<p>If the columns are linearly dependent, $G$ is singular and $\\det G=0$. A near-zero determinant flags redundancy (multicollinearity). Dropping the redundant column makes $\\det$ large and the system well-conditioned.</p>` },
        { title: `Run it`, body: `<p>Compare the determinant with and without the redundant feature.</p>`,
          code: `import numpy as np
# Feature collinearity check: det of the feature Gram matrix ~ 0 => redundant features
rng = np.random.default_rng(0)
f1 = rng.standard_normal(100)
f2 = rng.standard_normal(100)
f3 = 2*f1 - f2                       # f3 is an exact combo of f1,f2 (redundant)
X = np.column_stack([f1, f2, f3])
G = X.T @ X
print("det of feature Gram matrix: %.3e" % np.linalg.det(G))
# drop the redundant feature -> well-conditioned
X2 = np.column_stack([f1, f2])
print("det without redundant feature: %.1f" % np.linalg.det(X2.T @ X2))
print("collinear set is singular:", np.isclose(np.linalg.det(G), 0))`,
          output: `det of feature Gram matrix: 2.970e-09
det without redundant feature: 8516.9
collinear set is singular: True` }
      ],
      conclusion: `The Gram determinant collapsed to $\\sim10^{-9}$ (effectively zero) because $f_3$ adds no new direction. A vanishing determinant is the precise signal that a feature is redundant and the matrix is singular.`
    }
  ],

  /* ============================================================== la-trace */
  "la-trace": [
    {
      title: `Total variability in one number`,
      domain: `Statistics`,
      question: `Across four features, what is the dataset's total variance, and why does summing the diagonal give the same answer as summing eigenvalues?`,
      steps: [
        { title: `The data`, body: `<p>$500$ samples, 4 features with planted stds $1,3,2,0.5$. Compute the $4\\times4$ covariance $\\Sigma$.</p>` },
        { title: `The math`, body: `<p>Total variance is $\\operatorname{tr}(\\Sigma)=\\sum_i\\Sigma_{ii}$, the sum of per-feature variances. Because $\\operatorname{tr}(\\Sigma)=\\sum_i\\lambda_i$, it also equals the total variance along the principal axes — a coordinate-free quantity.</p>` },
        { title: `Run it`, body: `<p>Sum the diagonal and compare to the eigenvalue sum.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
# Total variance of a dataset = trace of covariance = sum of per-feature variances
rng = np.random.default_rng(0)
X = rng.standard_normal((500, 4)) * np.array([1.0, 3.0, 2.0, 0.5])
Sigma = np.cov(X, rowvar=False)
total_var = np.trace(Sigma)
print("per-feature variances:", np.round(np.diag(Sigma), 3))
print("total variance (trace):", round(total_var, 3))
# trace also equals sum of eigenvalues
eig = np.linalg.eigvalsh(Sigma)
print("sum of eigenvalues:", round(eig.sum(), 3))
print("trace == sum(eigenvalues):", np.isclose(total_var, eig.sum()))`,
          output: `per-feature variances: [1.043 7.93  4.15  0.259]
total variance (trace): 13.383
sum of eigenvalues: 13.383
trace == sum(eigenvalues): True` }
      ],
      conclusion: `Total variance is $13.383$, identical whether read off the diagonal or summed from the eigenvalues. PCA uses exactly this: the fraction of trace captured by the top components is the variance explained.`
    },
    {
      title: `Effective number of parameters`,
      domain: `Model complexity`,
      question: `How "many parameters" does a linear model really use? The trace of the hat matrix answers it.`,
      steps: [
        { title: `The data`, body: `<p>$40$ samples, an intercept plus 4 features ($p=5$ columns). The hat matrix $H=X(X^\\top X)^{-1}X^\\top$ maps observed $y$ to fitted $\\hat y$.</p>` },
        { title: `The math`, body: `<p>Effective degrees of freedom equal $\\operatorname{tr}(H)$. By the cyclic property $\\operatorname{tr}(X(X^\\top X)^{-1}X^\\top)=\\operatorname{tr}((X^\\top X)^{-1}X^\\top X)=\\operatorname{tr}(I_p)=p$. So a plain linear fit uses exactly $p$ degrees of freedom.</p>` },
        { title: `Run it`, body: `<p>Compute $\\operatorname{tr}(H)$ and confirm the cyclic shortcut.</p>`,
          code: `import numpy as np
# Effective degrees of freedom = trace of the hat matrix H = X (X^T X)^-1 X^T
rng = np.random.default_rng(0)
n, p = 40, 5
X = np.column_stack([np.ones(n), rng.standard_normal((n, p-1))])  # intercept + 4 features
H = X @ np.linalg.inv(X.T @ X) @ X.T
print("trace(H):", round(np.trace(H), 6))   # equals number of parameters p
print("number of parameters p:", p)
print("edf == p:", np.isclose(np.trace(H), p))
# cyclic trace trick gives the same, cheaper: tr(X (X^TX)^-1 X^T) = tr((X^TX)^-1 X^T X) = tr(I_p)
print("via cyclic trace:", round(np.trace(np.linalg.inv(X.T@X) @ (X.T@X)), 6))`,
          output: `trace(H): 5.0
number of parameters p: 5
edf == p: True
via cyclic trace: 5.0` }
      ],
      conclusion: `The hat matrix has trace $5$, exactly the parameter count $p$. The cyclic identity $\\operatorname{tr}(AB)=\\operatorname{tr}(BA)$ turned an $n\\times n$ matrix into $\\operatorname{tr}(I_p)$ — and for ridge or splines the trace gives a fractional, "effective" degrees of freedom.`
    },
    {
      title: `Reconstruction error as a trace`,
      domain: `Compression`,
      question: `When you approximate an image patch, the squared error is a Frobenius norm. Why is that the same as a trace?`,
      steps: [
        { title: `The data`, body: `<p>An $8\\times8$ image patch and a slightly lossy reconstruction. The error matrix is $E=\\text{original}-\\text{approx}$.</p>` },
        { title: `The math`, body: `<p>The squared Frobenius norm is $\\|E\\|_F^2=\\sum_{ij}E_{ij}^2=\\operatorname{tr}(E^\\top E)$, because the $i$-th diagonal entry of $E^\\top E$ is the squared norm of column $i$. The trace conveniently sums all squared entries.</p>` },
        { title: `Run it`, body: `<p>Compute the error two ways.</p>`,
          code: `import numpy as np
# Image reconstruction error as a Frobenius norm: ||E||_F^2 = trace(E^T E)
rng = np.random.default_rng(0)
original = rng.standard_normal((8, 8))         # an 8x8 image patch
approx = original + 0.1*rng.standard_normal((8, 8))   # a lossy reconstruction
E = original - approx
err_trace = np.trace(E.T @ E)                  # squared error via trace
err_fro = np.linalg.norm(E, 'fro')**2          # squared Frobenius norm
print("squared error via trace(E^T E):", round(err_trace, 6))
print("squared Frobenius norm:        ", round(err_fro, 6))
print("they match:", np.isclose(err_trace, err_fro))`,
          output: `squared error via trace(E^T E): 0.627791
squared Frobenius norm:         0.627791
they match: True` }
      ],
      conclusion: `Both routes give a squared error of $0.6278$, since $\\|E\\|_F^2=\\operatorname{tr}(E^\\top E)$. Writing reconstruction loss as a trace is what lets SVD prove its top-$k$ approximation is optimal.`
    }
  ],

  /* =================================================== la-rank-independence */
  "la-rank-independence": [
    {
      title: `Two features that say the same thing`,
      domain: `Regression`,
      question: `"Age in years" and "age in months" are both in your design matrix. How does rank reveal that one is dead weight?`,
      steps: [
        { title: `The data`, body: `<p>Columns: age (years), income, and age-in-months $=12\\times$age. Stack into $X$ ($100\\times3$). The third column is an exact multiple of the first.</p>` },
        { title: `The math`, body: `<p>Rank counts truly independent columns. Although $X$ has 3 columns, age and age-months span the same direction, so $\\operatorname{rank}(X)=2$. One singular value collapses to zero.</p>` },
        { title: `Run it`, body: `<p>Compute the rank and the singular values.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
rng = np.random.default_rng(0)
n = 100
age = rng.uniform(20, 60, n)
income = rng.uniform(30, 120, n)
age_months = age * 12               # exact linear copy of 'age'
X = np.column_stack([age, income, age_months])
print("design matrix shape:", X.shape)
print("rank:", np.linalg.matrix_rank(X), "(only 2 independent columns)")
sv = np.linalg.svd(X, compute_uv=False)
print("singular values:", np.round(sv, 4))
print("third singular value ~ 0:", np.isclose(sv[-1], 0, atol=1e-9))`,
          output: `design matrix shape: (100, 3)
rank: 2 (only 2 independent columns)
singular values: [5311.701   299.4366    0.    ]
third singular value ~ 0: True` }
      ],
      conclusion: `Rank $2$, not $3$: the zero singular value proves age-months adds no new direction. This is multicollinearity — $X^\\top X$ becomes singular and the naive regression fit is undefined.`
    },
    {
      title: `Why a few latent factors explain millions of ratings`,
      domain: `Recommenders`,
      question: `A user-item rating matrix is huge, but built from a handful of hidden tastes. What is its actual rank?`,
      steps: [
        { title: `The data`, body: `<p>Generate ratings as $R=UV$ where $U$ is $6\\times2$ (users' latent tastes) and $V$ is $2\\times5$ (items' latent loadings). $R$ is $6\\times5$ but assembled from only 2 factors.</p>` },
        { title: `The math`, body: `<p>$\\operatorname{rank}(UV)\\le\\min(\\operatorname{rank}U,\\operatorname{rank}V)=2$. So a $6\\times5$ matrix really lives in a 2-dimensional latent space — exactly two nonzero singular values.</p>` },
        { title: `Run it`, body: `<p>Check the rank and count nonzero singular values.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
# A recommender's user-item rating matrix is approximately low rank
# Build it from 2 hidden taste factors -> exact rank 2
rng = np.random.default_rng(0)
users = rng.standard_normal((6, 2))    # 6 users x 2 latent tastes
items = rng.standard_normal((2, 5))    # 2 latent tastes x 5 items
R = users @ items                      # 6x5 rating matrix
print("rating matrix is 6x5 but rank:", np.linalg.matrix_rank(R))
sv = np.linalg.svd(R, compute_uv=False)
print("singular values:", np.round(sv, 4))
print("only 2 nonzero -> 2 latent factors:", np.sum(sv > 1e-9))`,
          output: `rating matrix is 6x5 but rank: 2
singular values: [4.9601 2.1812 0.     0.     0.    ]
only 2 nonzero -> 2 latent factors: 2` }
      ],
      conclusion: `The $6\\times5$ matrix has rank just $2$. Real rating matrices are <i>approximately</i> low rank for the same reason, which is why two or three latent factors reconstruct millions of ratings (the seed of SVD recommenders).`
    },
    {
      title: `When an image is just one pattern`,
      domain: `Computer vision`,
      question: `A smooth gradient image looks complex, but how much independent structure does it actually contain?`,
      steps: [
        { title: `The data`, body: `<p>Build a $5\\times4$ image as the outer product of a vertical ramp (column) and horizontal weights (row): every column is a scaled copy of one column.</p>` },
        { title: `The math`, body: `<p>An outer product $uv^\\top$ has rank exactly 1: one direction explains the whole image. Adding an independent pattern raises the rank by the number of new directions introduced.</p>` },
        { title: `Run it`, body: `<p>Check the rank of the pure gradient, then after adding a diagonal feature.</p>`,
          code: `import numpy as np
# A flat gradient image has rank 1: every column is a multiple of one column
col = np.arange(1, 6).reshape(5, 1).astype(float)   # vertical ramp
row = np.array([[1.0, 2.0, 3.0, 4.0]])              # horizontal weights
img = col @ row                                     # outer product = rank 1
print("image:\\n", img)
print("rank of a pure gradient image:", np.linalg.matrix_rank(img))
# add one independent pattern -> rank rises to 2
img2 = img + np.eye(5, 4)
print("rank after adding a diagonal feature:", np.linalg.matrix_rank(img2))`,
          output: `image:
 [[ 1.  2.  3.  4.]
 [ 2.  4.  6.  8.]
 [ 3.  6.  9. 12.]
 [ 4.  8. 12. 16.]
 [ 5. 10. 15. 20.]]
rank of a pure gradient image: 1
rank after adding a diagonal feature: 4` }
      ],
      conclusion: `The gradient is rank $1$: one outer product captures it entirely, so it compresses to a single column and row. Rank measures how much genuinely independent structure an image holds — the basis of low-rank compression.`
    }
  ],

  /* ================================================================ la-psd */
  "la-psd": [
    {
      title: `Why portfolio variance is never negative`,
      domain: `Finance`,
      question: `Any covariance matrix of asset returns is PSD. What does that guarantee about a portfolio's variance?`,
      steps: [
        { title: `The data`, body: `<p>$250$ days of returns for 4 correlated assets. The sample covariance $\\Sigma$ is $4\\times4$. Pick portfolio weights $w$.</p>` },
        { title: `The math`, body: `<p>Portfolio variance is the quadratic form $w^\\top\\Sigma w$. Because $\\Sigma$ is PSD ($x^\\top\\Sigma x\\ge0$ for all $x$), variance can never be negative — and PSD means every eigenvalue is $\\ge0$.</p>` },
        { title: `Run it`, body: `<p>Check the eigenvalues are non-negative and compute a portfolio variance.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
# Any covariance matrix is positive semi-definite: all eigenvalues >= 0
rng = np.random.default_rng(0)
returns = rng.standard_normal((250, 4)) @ np.array([[1.0,0.5,0,0],
                                                    [0,1.0,0.3,0],
                                                    [0,0,1.0,0.2],
                                                    [0,0,0,1.0]])
Sigma = np.cov(returns, rowvar=False)
eig = np.linalg.eigvalsh(Sigma)
print("eigenvalues of covariance:", np.round(eig, 4))
print("all >= 0 (PSD):", np.all(eig >= -1e-10))
# a quadratic form w^T Sigma w is portfolio variance: never negative
w = np.array([0.4, -0.2, 0.5, 0.3])
print("portfolio variance w^T Sigma w:", round(w @ Sigma @ w, 6), ">= 0")`,
          output: `eigenvalues of covariance: [0.4718 0.8651 1.1495 1.7401]
all >= 0 (PSD): True
portfolio variance w^T Sigma w: 0.506077 >= 0` }
      ],
      conclusion: `All four eigenvalues are positive, so $\\Sigma$ is PSD and the portfolio variance $0.506$ is guaranteed non-negative. Markowitz optimization relies on this: variance is a well-behaved convex quadratic in the weights.`
    },
    {
      title: `Proving a regression loss is convex`,
      domain: `Optimization`,
      question: `Why does gradient descent on least-squares always reach the global minimum, no matter where it starts?`,
      steps: [
        { title: `The data`, body: `<p>$30$ samples, 3 features in $X$. The squared-error loss is $\\|Xw-y\\|^2$; its Hessian is the constant matrix $H=2X^\\top X$.</p>` },
        { title: `The math`, body: `<p>A function is convex iff its Hessian is PSD everywhere. Here $H=2X^\\top X$ satisfies $z^\\top Hz=2\\|Xz\\|^2\\ge0$, so it is PSD. A Cholesky factorization succeeds exactly when a matrix is positive definite.</p>` },
        { title: `Run it`, body: `<p>Check the eigenvalues and attempt a Cholesky.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
# Linear regression loss is convex: Hessian = 2 X^T X is PSD everywhere
rng = np.random.default_rng(0)
X = rng.standard_normal((30, 3))
H = 2 * X.T @ X                      # Hessian of ||X w - y||^2
eig = np.linalg.eigvalsh(H)
print("Hessian eigenvalues:", np.round(eig, 4))
print("all >= 0 -> loss is convex (PSD Hessian):", np.all(eig >= -1e-9))
# Cholesky succeeds iff a matrix is positive definite
try:
    np.linalg.cholesky(H)
    print("Cholesky succeeded -> positive definite")
except np.linalg.LinAlgError:
    print("Cholesky failed -> not PD")`,
          output: `Hessian eigenvalues: [37.1052 49.     83.2536]
all >= 0 -> loss is convex (PSD Hessian): True
Cholesky succeeded -> positive definite` }
      ],
      conclusion: `Every Hessian eigenvalue is positive, so the loss is convex with a single global minimum. PSD-ness of $X^\\top X$ is the structural reason linear and ridge regression train reliably.`
    },
    {
      title: `A valid kernel for an SVM`,
      domain: `Kernel methods`,
      question: `The RBF (Gaussian) kernel matrix must be PSD for an SVM to be well-posed. Is it?`,
      steps: [
        { title: `The data`, body: `<p>6 points in 2D. Build the RBF kernel $K_{ij}=\\exp(-\\tfrac12\\|x_i-x_j\\|^2)$, a $6\\times6$ similarity matrix.</p>` },
        { title: `The math`, body: `<p>Mercer's condition requires $K$ to be PSD: $c^\\top Kc\\ge0$ for every $c$, equivalently all eigenvalues $\\ge0$. Only then does the kernel correspond to a real inner product in some feature space, keeping the SVM convex.</p>` },
        { title: `Run it`, body: `<p>Check eigenvalues and a quadratic form.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
# An RBF (Gaussian) kernel matrix is PSD -> valid for SVM / Gaussian processes
rng = np.random.default_rng(0)
x = rng.standard_normal((6, 2))                 # 6 points in 2D
sq = np.sum((x[:,None,:] - x[None,:,:])**2, axis=2)
K = np.exp(-0.5 * sq)                            # RBF kernel, length-scale 1
eig = np.linalg.eigvalsh(K)
print("kernel eigenvalues:", np.round(eig, 4))
print("all >= 0 (valid PSD kernel):", np.all(eig >= -1e-10))
# any quadratic form c^T K c is non-negative
c = rng.standard_normal(6)
print("c^T K c:", round(c @ K @ c, 6), ">= 0")`,
          output: `kernel eigenvalues: [0.0263 0.0571 0.479  0.7891 1.2613 3.3872]
all >= 0 (valid PSD kernel): True
c^T K c: 18.047232 >= 0` }
      ],
      conclusion: `All eigenvalues are positive, so the RBF kernel is PSD and the quadratic form $18.05\\ge0$. PSD-ness is precisely what makes SVMs and Gaussian processes correspond to an honest inner-product space.`
    }
  ],

  /* =========================================================== la-spectral */
  "la-spectral": [
    {
      title: `Finding the principal axes of data`,
      domain: `PCA`,
      question: `Data is stretched along a diagonal direction. How does the spectral theorem recover that axis and the variance along it?`,
      steps: [
        { title: `The data`, body: `<p>$300$ points stretched mostly along $(1,1)$. Compute the $2\\times2$ covariance $\\Sigma$ (symmetric).</p>` },
        { title: `The math`, body: `<p>The spectral theorem writes $\\Sigma=V\\Lambda V^\\top$ with orthonormal eigenvectors $V$ (principal axes) and eigenvalues $\\Lambda$ (variances along them). PCA is just this decomposition of the covariance.</p>` },
        { title: `Run it`, body: `<p>Eigendecompose $\\Sigma$, sort by variance, and verify the reconstruction.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
# PCA = spectral theorem on the covariance matrix
rng = np.random.default_rng(0)
# data stretched along direction (1,1)
base = rng.standard_normal((300, 2))
data = base @ np.array([[3.0, 1.0],[0.0, 0.5]])
Sigma = np.cov(data, rowvar=False)
vals, vecs = np.linalg.eigh(Sigma)          # ascending eigenvalues
order = np.argsort(vals)[::-1]
vals, vecs = vals[order], vecs[:, order]
print("variances along principal axes:", np.round(vals, 3))
print("top principal direction:", np.round(vecs[:,0], 3))
# reconstruct Sigma = V diag(vals) V^T
recon = vecs @ np.diag(vals) @ vecs.T
print("V diag V^T reconstructs Sigma:", np.allclose(recon, Sigma))
print("eigenvectors orthonormal:", np.allclose(vecs.T @ vecs, np.eye(2)))`,
          output: `variances along principal axes: [10.133  0.219]
top principal direction: [-0.946 -0.326]
V diag V^T reconstructs Sigma: True
eigenvectors orthonormal: True` }
      ],
      conclusion: `The top axis holds variance $10.13$ versus $0.22$ on the second — the data is nearly one-dimensional. The spectral theorem $\\Sigma=V\\Lambda V^\\top$ with orthonormal $V$ is literally what PCA computes.`
    },
    {
      title: `Whitening: decorrelating data`,
      domain: `Preprocessing`,
      question: `How do you build $\\Sigma^{-1/2}$ to transform correlated data into clean, unit-variance, uncorrelated features?`,
      steps: [
        { title: `The data`, body: `<p>$1000$ samples passed through a mixing matrix, giving correlated covariance $\\Sigma$.</p>` },
        { title: `The math`, body: `<p>From $\\Sigma=V\\Lambda V^\\top$, any power follows: $\\Sigma^{-1/2}=V\\Lambda^{-1/2}V^\\top$. Multiplying data by $\\Sigma^{-1/2}$ makes the new covariance $I$. This works only because $V$ is orthonormal and $\\Lambda$ diagonal.</p>` },
        { title: `Run it`, body: `<p>Construct $\\Sigma^{-1/2}$ and check the whitened covariance is the identity.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
# Whitening: build Sigma^{-1/2} via the spectral theorem to decorrelate data
rng = np.random.default_rng(0)
A = np.array([[2.0, 0.8],[0.8, 1.0]])
data = rng.standard_normal((1000, 2)) @ A.T
Sigma = np.cov(data, rowvar=False)
vals, vecs = np.linalg.eigh(Sigma)
W = vecs @ np.diag(vals**-0.5) @ vecs.T     # Sigma^{-1/2}
whitened = data @ W.T
print("Sigma^{-1/2} (symmetric):\\n", np.round(W, 3))
print("covariance after whitening:\\n", np.round(np.cov(whitened, rowvar=False), 3))
print("W @ Sigma @ W == I:", np.allclose(W @ Sigma @ W, np.eye(2)))`,
          output: `Sigma^{-1/2} (symmetric):
 [[ 0.723 -0.582]
 [-0.582  1.485]]
covariance after whitening:
 [[1. 0.]
 [0. 1.]]
W @ Sigma @ W == I: True` }
      ],
      conclusion: `After multiplying by $\\Sigma^{-1/2}$, the covariance becomes the identity — features are decorrelated with unit variance. The spectral theorem makes matrix powers like $\\Sigma^{-1/2}$ as easy as taking powers of the eigenvalues.`
    },
    {
      title: `Vibration modes of a spring system`,
      domain: `Mechanical engineering`,
      question: `Two masses on springs vibrate. What are the natural frequencies and the shapes they vibrate in?`,
      steps: [
        { title: `The data`, body: `<p>The stiffness matrix $K=\\begin{bmatrix}2k & -k\\\\ -k & 2k\\end{bmatrix}$ with $k=1$ is symmetric (Newton's third law guarantees it).</p>` },
        { title: `The math`, body: `<p>The eigenvalues of $K$ are the squared natural frequencies $\\omega^2$; the orthonormal eigenvectors are the mode shapes — independent patterns the system vibrates in. Spectral theorem gives $K=V\\Lambda V^\\top$ with $V$ orthonormal.</p>` },
        { title: `Run it`, body: `<p>Eigendecompose the symmetric stiffness matrix.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
# Vibration modes of a 2-mass spring system: symmetric stiffness matrix K
# eigenvectors = mode shapes, eigenvalues = squared natural frequencies
k = 1.0
K = np.array([[2*k, -k],
              [-k,  2*k]])             # symmetric by Newton's third law
omega2, modes = np.linalg.eigh(K)
print("squared natural frequencies:", np.round(omega2, 4))
print("mode shapes (columns):\\n", np.round(modes, 3))
# modes are orthogonal -> independent vibration patterns
print("modes orthonormal:", np.allclose(modes.T @ modes, np.eye(2)))
print("K = V diag V^T:", np.allclose(modes @ np.diag(omega2) @ modes.T, K))`,
          output: `squared natural frequencies: [1. 3.]
mode shapes (columns):
 [[-0.707 -0.707]
 [-0.707  0.707]]
modes orthonormal: True
K = V diag V^T: True` }
      ],
      conclusion: `The system has two modes: $\\omega^2=1$ (masses move together) and $\\omega^2=3$ (masses move apart), with perpendicular mode shapes $(1,1)$ and $(1,-1)$. The spectral theorem turns coupled vibration into independent oscillators.`
    }
  ],

  /* ================================================================ la-svd */
  "la-svd": [
    {
      title: `Compressing an image to 20% of its size`,
      domain: `Compression`,
      question: `A mostly-smooth image is stored as a pixel matrix. How few singular values do you need to reconstruct it well?`,
      steps: [
        { title: `The data`, body: `<p>A $30\\times30$ "image" that is smooth (low rank) plus a little noise. Take its SVD $A=U\\Sigma V^\\top$.</p>` },
        { title: `The math`, body: `<p>Keeping the top $k$ singular triplets gives the best rank-$k$ approximation (Eckart-Young): $A_k=\\sum_{i=1}^{k}\\sigma_i u_i v_i^\\top$. Storing it costs $k(m+n+1)$ numbers instead of $mn$.</p>` },
        { title: `Run it`, body: `<p>Reconstruct from $k=3$ and measure error and storage.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
# Image compression: keep top-k singular values of a pixel matrix
rng = np.random.default_rng(0)
# a 30x30 "image" that is mostly smooth (low rank) plus a little noise
u = np.linspace(0, 1, 30)[:,None]
img = np.sin(3*u) @ np.cos(3*u).T + 0.05*rng.standard_normal((30,30))
U, s, Vt = np.linalg.svd(img)
k = 3
approx = (U[:,:k] * s[:k]) @ Vt[:k]
err = np.linalg.norm(img - approx) / np.linalg.norm(img)
full = 30*30
stored = k*(30 + 30 + 1)
print("top singular values:", np.round(s[:5], 3))
print("rank-%d reconstruction relative error: %.4f" % (k, err))
print("numbers stored: %d vs %d (%.0f%% of original)" % (stored, full, 100*stored/full))`,
          output: `top singular values: [15.08   0.531  0.468  0.457  0.385]
rank-3 reconstruction relative error: 0.0801
numbers stored: 183 vs 900 (20% of original)` }
      ],
      conclusion: `Three singular values reconstruct the image with $8\\%$ error using only $20\\%$ of the storage. The first singular value ($15.08$) dwarfs the rest, so the image is essentially rank-1 — SVD finds and keeps exactly that structure.`
    },
    {
      title: `Filling in missing tastes`,
      domain: `Recommenders`,
      question: `A user-item rating matrix has two taste clusters. Can SVD recover a clean low-rank version that smooths out the noise?`,
      steps: [
        { title: `The data`, body: `<p>A $5\\times4$ ratings matrix: users 0,1,4 love items 0,1; users 2,3 love items 2,3. Two latent taste groups, slightly noisy.</p>` },
        { title: `The math`, body: `<p>SVD factors $R=U\\Sigma V^\\top$. The columns of $U$ are latent user factors, the rows of $V^\\top$ latent item factors, and $\\sigma_i$ their strength. Truncating to the top 2 gives the best rank-2 reconstruction.</p>` },
        { title: `Run it`, body: `<p>Truncate to rank 2 and inspect the cleaned matrix.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
# Recommender: SVD finds latent factors and fills in a low-rank rating matrix
R = np.array([
    [5, 5, 1, 1],
    [4, 5, 1, 2],
    [1, 1, 5, 5],
    [2, 1, 4, 5],
    [5, 4, 2, 1.0]])                     # users x items, 2 taste clusters
U, s, Vt = np.linalg.svd(R, full_matrices=False)
print("singular values:", np.round(s, 3))
k = 2
approx = (U[:,:k] * s[:k]) @ Vt[:k]
print("rank-2 reconstruction:\\n", np.round(approx, 2))
err = np.linalg.norm(R - approx) / np.linalg.norm(R)
print("relative error keeping 2 factors: %.4f" % err)`,
          output: `singular values: [13.52   7.526  1.414  0.755]
rank-2 reconstruction:
 [[4.99 5.01 1.01 0.99]
 [4.52 4.48 1.47 1.52]
 [1.25 0.76 4.73 5.22]
 [1.71 1.28 4.31 4.75]
 [4.52 4.48 1.47 1.52]]
relative error keeping 2 factors: 0.1031` }
      ],
      conclusion: `The two dominant singular values ($13.5,7.5$) carry the taste clusters; truncating there reconstructs ratings within $10\\%$. This rank-2 factorization is how SVD recommenders predict the blanks in a sparse rating matrix.`
    },
    {
      title: `A numerically stable least-squares solver`,
      domain: `Regression`,
      question: `Instead of inverting $X^\\top X$, how does SVD give the regression weights directly and stably?`,
      steps: [
        { title: `The data`, body: `<p>$40$ samples, 3 features, response from true weights $(2,-1,0.5)$ plus noise. Take $X=U\\Sigma V^\\top$.</p>` },
        { title: `The math`, body: `<p>The pseudo-inverse is $X^+=V\\Sigma^{-1}U^\\top$, so the least-squares solution is $w=X^+y$. This avoids forming the ill-conditioned $X^\\top X$ and is what <code>np.linalg.lstsq</code> uses under the hood.</p>` },
        { title: `Run it`, body: `<p>Build $X^+$ from the SVD and compare against numpy's solvers.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
# SVD gives the numerically stable pseudo-inverse for least squares
rng = np.random.default_rng(0)
X = rng.standard_normal((40, 3))
true = np.array([2.0, -1.0, 0.5])
y = X @ true + 0.1*rng.standard_normal(40)
U, s, Vt = np.linalg.svd(X, full_matrices=False)
X_pinv = (Vt.T * (1/s)) @ U.T          # pseudo-inverse from SVD
w = X_pinv @ y
print("weights via SVD pseudo-inverse:", np.round(w, 3))
print("matches np.linalg.pinv:", np.allclose(X_pinv, np.linalg.pinv(X)))
print("matches np.linalg.lstsq:", np.allclose(w, np.linalg.lstsq(X, y, rcond=None)[0]))`,
          output: `weights via SVD pseudo-inverse: [ 2.026 -1.024  0.505]
matches np.linalg.pinv: True
matches np.linalg.lstsq: True` }
      ],
      conclusion: `The SVD pseudo-inverse recovers weights $(2.03,-1.02,0.51)$, matching both <code>pinv</code> and <code>lstsq</code>. SVD is the stable backbone of least squares — no risky $(X^\\top X)^{-1}$ required.`
    }
  ],

  /* =========================================================== la-jacobian */
  "la-jacobian": [
    {
      title: `Robot arm hand speed`,
      domain: `Robotics`,
      question: `A 2-joint robot arm's motors spin at set rates — how fast and which way does the hand move?`,
      steps: [
        { title: `The data`, body: `<p>A planar arm: link lengths $l_1=1.0,\\ l_2=0.8$ m, joint angles $\\theta_1=0.5,\\ \\theta_2=1.0$ rad, and the motors turn at $\\dot\\theta = (0.3,\\ -0.2)$ rad/s.</p>` },
        { title: `The math`, body: `<p>The hand position is $x=l_1\\cos\\theta_1+l_2\\cos(\\theta_1+\\theta_2)$, $y=l_1\\sin\\theta_1+l_2\\sin(\\theta_1+\\theta_2)$. The <b>Jacobian</b> $J=\\partial(x,y)/\\partial(\\theta_1,\\theta_2)$ converts joint speeds into hand speed: $\\dot{p}=J\\,\\dot\\theta$.</p>` },
        { title: `Run it`, body: `<p>Build $J$ and multiply by the joint-velocity vector.</p>`,
          code: `import numpy as np
l1, l2 = 1.0, 0.8
th1, th2 = 0.5, 1.0
J = np.array([[-l1*np.sin(th1) - l2*np.sin(th1+th2), -l2*np.sin(th1+th2)],
              [ l1*np.cos(th1) + l2*np.cos(th1+th2),  l2*np.cos(th1+th2)]])
dtheta = np.array([0.3, -0.2])      # motor speeds (rad/s)
v = J @ dtheta                       # hand velocity (m/s)
print("hand velocity:", np.round(v, 3), " speed: %.3f m/s" % np.linalg.norm(v))`,
          output: `hand velocity: [-0.224  0.269]  speed: 0.350 m/s` }
      ],
      conclusion: `The hand moves at <b>0.35 m/s</b> heading up-and-left, $(-0.22,\\ 0.27)$. The Jacobian is the exact dictionary from joint rates to hand motion — and where $\\det J=0$ the arm is "singular" and loses a direction of control.`
    },
    {
      title: `Solving a nonlinear system`,
      domain: `Numerical methods`,
      question: `Where does the circle $x^2+y^2=4$ cross the hyperbola $xy=1$? (Two equations, no clean formula.)`,
      steps: [
        { title: `The data`, body: `<p>Two equations in two unknowns: $f_1=x^2+y^2-4=0$ and $f_2=xy-1=0$. Start from a guess $(2,\\ 0.5)$.</p>` },
        { title: `The math`, body: `<p>Newton's method for systems steps with the Jacobian $J=\\begin{bmatrix}2x & 2y\\\\ y & x\\end{bmatrix}$: solve $J\\,\\Delta=-f$ and update $v\\leftarrow v+\\Delta$. The Jacobian linearizes both curves at once.</p>` },
        { title: `Run it`, body: `<p>Iterate the Newton step a few times.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
# Newton's method for a nonlinear SYSTEM: circle x^2+y^2=4 meets hyperbola xy=1
def f(v):
    x, y = v
    return np.array([x*x + y*y - 4, x*y - 1])
def J(v):
    x, y = v
    return np.array([[2*x, 2*y],
                     [y,   x]])
v = np.array([2.0, 0.5])               # initial guess
for _ in range(6):
    v = v - np.linalg.solve(J(v), f(v))   # solve J delta = -f
print("intersection point:", np.round(v, 6))
print("residual f(v):", np.round(f(v), 9))
print("on both curves:", np.allclose(f(v), 0))`,
          output: `intersection point: [1.931852 0.517638]
residual f(v): [ 0. -0.]
on both curves: True` }
      ],
      conclusion: `The curves cross at $(1.9319,\\ 0.5176)$, with residual driven to zero. Newton's method uses the Jacobian to linearize a hard nonlinear system into a sequence of easy linear solves.`
    },
    {
      title: `Area scaling under a change of variables`,
      domain: `Calculus / integration`,
      question: `Switching from polar to Cartesian coordinates, how much does a tiny area get rescaled — and can that recover the area of a disk?`,
      steps: [
        { title: `The data`, body: `<p>The map is $x=r\\cos\\theta,\\ y=r\\sin\\theta$. Its Jacobian $J=\\begin{bmatrix}\\cos\\theta & -r\\sin\\theta\\\\ \\sin\\theta & r\\cos\\theta\\end{bmatrix}$ gives the local area factor $|\\det J|$.</p>` },
        { title: `The math`, body: `<p>The change-of-variables rule says $\\mathrm{d}A=|\\det J|\\,\\mathrm{d}r\\,\\mathrm{d}\\theta$. Here $\\det J=r$, so $\\mathrm{d}A=r\\,\\mathrm{d}r\\,\\mathrm{d}\\theta$. Integrating the constant $1$ over a disk recovers its area.</p>` },
        { title: `Run it`, body: `<p>Confirm $|\\det J|=r$, then Monte-Carlo the disk area using the $r$ weight.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
# Change of variables: polar -> Cartesian. |det J| reweights area for integration.
# x = r cos(theta), y = r sin(theta);  dA = |det J| dr dtheta = r dr dtheta
def detJ(r, theta):
    J = np.array([[np.cos(theta), -r*np.sin(theta)],
                  [np.sin(theta),  r*np.cos(theta)]])
    return np.linalg.det(J)
r, theta = 2.0, np.pi/3
print("|det J| at r=2:", round(abs(detJ(r, theta)), 6), "(equals r)")
# Monte-Carlo: area of a disk of radius R via the r-weight
rng = np.random.default_rng(0)
R = 3.0; N = 200000
rr = rng.uniform(0, R, N); tt = rng.uniform(0, 2*np.pi, N)
# integrate 1 over disk: mean of |det J| times the (r,theta) box area
box = R * (2*np.pi)
area = box * np.mean(np.abs(rr))      # |det J| = r, integrand 1
print("estimated disk area:", round(area, 4))
print("true pi R^2:", round(np.pi*R*R, 4))`,
          output: `|det J| at r=2: 2.0 (equals r)
estimated disk area: 28.2336
true pi R^2: 28.2743` }
      ],
      conclusion: `The Jacobian determinant is exactly $r$, so the polar integral picks up the famous "$r\\,\\mathrm{d}r\\,\\mathrm{d}\\theta$" factor and the Monte-Carlo estimate $28.23$ matches $\\pi R^2=28.27$. This $|\\det J|$ reweighting is the heart of normalizing-flow density models.`
    }
  ],

  /* ============================================================ la-hessian */
  "la-hessian": [
    {
      title: `Newton's method converges in one step`,
      domain: `Optimization`,
      question: `For a quadratic objective, why does a single Newton step jump straight to the exact minimum, no matter where you start?`,
      steps: [
        { title: `The data`, body: `<p>Minimize $f(w)=\\tfrac12 w^\\top A w - b^\\top w$ with $A=\\begin{bmatrix}3 & 1\\\\ 1 & 2\\end{bmatrix}$, $b=(1,-1)$, starting from a bad point $w=(5,5)$.</p>` },
        { title: `The math`, body: `<p>Gradient $\\nabla f=Aw-b$, Hessian $H=A$. Newton's step is $w\\leftarrow w-H^{-1}\\nabla f$. For a quadratic the model is exact, so one step lands at the true minimizer $A^{-1}b$.</p>` },
        { title: `Run it`, body: `<p>Take one Newton step and compare to solving $Aw=b$.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
# Newton's method: one step minimizes a quadratic exactly using the Hessian
# f(w) = 0.5 w^T A w - b^T w,  grad = A w - b,  Hessian = A
A = np.array([[3.0, 1.0],
              [1.0, 2.0]])
b = np.array([1.0, -1.0])
w = np.array([5.0, 5.0])               # bad starting point
grad = A @ w - b
H = A
w_new = w - np.linalg.solve(H, grad)   # Newton step = H^-1 grad
print("Newton step lands at:", np.round(w_new, 6))
print("true minimizer (solve A w = b):", np.round(np.linalg.solve(A, b), 6))
print("converged in ONE step:", np.allclose(w_new, np.linalg.solve(A, b)))`,
          output: `Newton step lands at: [ 0.6 -0.8]
true minimizer (solve A w = b): [ 0.6 -0.8]
converged in ONE step: True` }
      ],
      conclusion: `From $(5,5)$, a single Newton step lands exactly at the minimizer $(0.6,-0.8)$. The Hessian supplies the curvature so Newton's method skips the slow zig-zag of plain gradient descent.`
    },
    {
      title: `Logistic regression is convex`,
      domain: `Machine learning`,
      question: `Why does logistic-regression training never get stuck in a bad local minimum?`,
      steps: [
        { title: `The data`, body: `<p>$50$ samples, 3 features, current weights $w=(0.5,-1,0.2)$. Predicted probabilities $p=\\sigma(Xw)$, with per-sample weights $p(1-p)$.</p>` },
        { title: `The math`, body: `<p>The log-loss Hessian is $H=X^\\top D X$ with $D=\\mathrm{diag}(p_i(1-p_i))$, all positive. So $z^\\top Hz=\\sum_i p_i(1-p_i)(x_i^\\top z)^2\\ge0$: $H$ is PSD, the loss is convex.</p>` },
        { title: `Run it`, body: `<p>Compute the Hessian, check its eigenvalues, and test positive-definiteness via Cholesky.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
# Logistic regression loss is convex: its Hessian X^T diag(p(1-p)) X is PSD
rng = np.random.default_rng(0)
X = rng.standard_normal((50, 3))
w = np.array([0.5, -1.0, 0.2])
z = X @ w
p = 1/(1+np.exp(-z))                    # predicted probabilities
W = p*(1-p)                             # diagonal weights, all > 0
H = X.T @ (W[:,None] * X)               # Hessian of the log-loss
eig = np.linalg.eigvalsh(H)
print("Hessian eigenvalues:", np.round(eig, 4))
print("all >= 0 -> log-loss is convex:", np.all(eig >= -1e-9))
print("Cholesky (PD test) succeeds:", end=" ")
try:
    np.linalg.cholesky(H); print(True)
except np.linalg.LinAlgError:
    print(False)`,
          output: `Hessian eigenvalues: [ 5.4557  7.6653 12.7818]
all >= 0 -> log-loss is convex: True
Cholesky (PD test) succeeds: True` }
      ],
      conclusion: `All Hessian eigenvalues are positive, so the logistic loss is convex with a unique global optimum. The PSD Hessian is exactly why logistic regression trains reliably from any start.`
    },
    {
      title: `Is this critical point a saddle?`,
      domain: `Calculus`,
      question: `At a flat point of a surface, how do the Hessian's eigenvalue signs tell a minimum from a maximum from a saddle?`,
      steps: [
        { title: `The data`, body: `<p>Two surfaces: $f(x,y)=x^2-y^2$ (a Pringle) and $g(x,y)=x^2+y^2$ (a bowl). Both have a flat point at the origin where $\\nabla f=0$.</p>` },
        { title: `The math`, body: `<p>Classify by the Hessian's eigenvalues: all positive $\\Rightarrow$ minimum, all negative $\\Rightarrow$ maximum, mixed signs $\\Rightarrow$ saddle. For $x^2-y^2$ the Hessian is $\\mathrm{diag}(2,-2)$ — mixed signs.</p>` },
        { title: `Run it`, body: `<p>Read off the eigenvalues and classify each point.</p>`,
          code: `import numpy as np
np.set_printoptions(suppress=True)
# Classify critical points of f(x,y) = x^2 - y^2 (a saddle) by Hessian eigenvalues
# grad = (2x, -2y) = 0 at origin; Hessian is constant
H = np.array([[2.0, 0.0],
              [0.0, -2.0]])
eig = np.linalg.eigvalsh(H)
print("Hessian eigenvalues at the critical point:", np.round(eig, 3))
if np.all(eig > 0):    kind = "local minimum"
elif np.all(eig < 0):  kind = "local maximum"
else:                  kind = "saddle point"
print("classification:", kind)
# compare a bowl f = x^2 + y^2
Hb = np.array([[2.0,0],[0,2.0]])
print("bowl eigenvalues:", np.linalg.eigvalsh(Hb), "-> local minimum")`,
          output: `Hessian eigenvalues at the critical point: [-2.  2.]
classification: saddle point
bowl eigenvalues: [2. 2.] -> local minimum` }
      ],
      conclusion: `Mixed eigenvalue signs $(-2,+2)$ mark a saddle; both-positive $(+2,+2)$ marks a minimum. The Hessian's eigenvalue signs are the second-derivative test that lets optimizers escape saddle points in deep nets.`
    }
  ]

});

window.WALKTHROUGHS = Object.assign(window.WALKTHROUGHS, {
  "la-cofactor": [
    {
      title: `Area of a triangle from its corners`,
      domain: `Computer graphics / GIS`,
      question: `Given a triangle's three corner points, what is its area — using only the coordinates?`,
      steps: [
        { title: `The data`, body: `<p>Three vertices: $(1,1)$, $(4,1)$, $(2,5)$. No base or height is given — only points.</p>` },
        { title: `The math`, body: `<p>Stack the points with a column of ones and take a determinant: area $= \\tfrac12\\left|\\det\\begin{bmatrix}x_1&y_1&1\\\\x_2&y_2&1\\\\x_3&y_3&1\\end{bmatrix}\\right|$. Expanding along the all-ones third column is a clean cofactor expansion into three $2\\times2$ minors.</p>` },
        { title: `Run it`, body: `<p>Cofactor-expand along the last column, then halve the absolute value.</p>`,
          code: `import numpy as np
P = np.array([[1.0,1.0],[4.0,1.0],[2.0,5.0]])      # triangle vertices
M = np.column_stack([P, np.ones(3)])                # rows [x, y, 1]
def minor(M,i,j): return np.delete(np.delete(M,i,0),j,1)
# cofactor expansion along the last column (all 1s)
det = sum(((-1)**(i+2)) * M[i,2] * np.linalg.det(minor(M,i,2)) for i in range(3))
print("det via cofactor (col 3):", round(det,4))
print("triangle area = |det|/2 :", round(abs(det)/2,4))`,
          output: `det via cofactor (col 3): 12.0
triangle area = |det|/2 : 6.0` }
      ],
      conclusion: `The triangle's area is $6$. The cofactor expansion turned three raw points into a signed determinant — the backbone of mesh area, point-in-triangle tests, and polygon winding in graphics and GIS.`
    },
    {
      title: `Solving a 3-equation system by Cramer's rule`,
      domain: `Engineering / linear systems`,
      question: `Solve three linear equations for three unknowns using determinants instead of elimination.`,
      steps: [
        { title: `The data`, body: `<p>The system $Ax=b$ with $A=\\begin{bmatrix}2&1&1\\\\1&3&2\\\\1&0&2\\end{bmatrix}$ and $b=(5,10,5)$.</p>` },
        { title: `The math`, body: `<p>Cramer's rule: $x_i = \\dfrac{\\det A_i}{\\det A}$, where $A_i$ is $A$ with column $i$ replaced by $b$. Every one of those determinants is itself a cofactor expansion.</p>` },
        { title: `Run it`, body: `<p>Loop over the columns, swap in $b$, and take the determinant ratio.</p>`,
          code: `import numpy as np
A = np.array([[2.,1.,1.],[1.,3.,2.],[1.,0.,2.]]); b = np.array([5.,10.,5.])
detA = np.linalg.det(A); x = np.empty(3)
for i in range(3):
    Ai = A.copy(); Ai[:,i] = b                       # replace column i with b
    x[i] = np.linalg.det(Ai)/detA                    # Cramer's rule
print("Cramer solution x:", np.round(x,4))
print("matches np.linalg.solve:", np.allclose(x, np.linalg.solve(A,b)))`,
          output: `Cramer solution x: [0.5556 1.6667 2.2222]
matches np.linalg.solve: True` }
      ],
      conclusion: `The solution is $x\\approx(0.556,\\,1.667,\\,2.222)$, matching a direct solver. Cramer's rule writes each unknown as a ratio of cofactor-built determinants — elegant for tiny systems (real solvers use elimination for speed).`
    },
    {
      title: `Inverting a matrix with the cofactor (adjugate) formula`,
      domain: `Numerical linear algebra`,
      question: `Build a 3x3 matrix's inverse directly from its cofactors — and check it really inverts.`,
      steps: [
        { title: `The data`, body: `<p>$A=\\begin{bmatrix}2&0&1\\\\3&1&2\\\\1&0&4\\end{bmatrix}$.</p>` },
        { title: `The math`, body: `<p>Each entry's cofactor is $C_{ij}=(-1)^{i+j}M_{ij}$. The adjugate is the transpose of the cofactor matrix, and $A^{-1}=\\dfrac{1}{\\det A}\\,\\mathrm{adj}(A)$.</p>` },
        { title: `Run it`, body: `<p>Compute every cofactor, transpose, and divide by the determinant.</p>`,
          code: `import numpy as np
A = np.array([[2.,0.,1.],[3.,1.,2.],[1.,0.,4.]]); n = 3
Cof = np.zeros((n,n))
for i in range(n):
    for j in range(n):
        minor = np.delete(np.delete(A,i,0),j,1)
        Cof[i,j] = ((-1)**(i+j)) * np.linalg.det(minor)   # signed minor
adj = Cof.T                                                # adjugate = cofactor transpose
inv = adj/np.linalg.det(A)                                 # A^-1 = adj / det
print("adjugate inverse:\\n", np.round(inv,4))
print("matches np.linalg.inv:", np.allclose(inv, np.linalg.inv(A)))`,
          output: `adjugate inverse:
 [[ 0.5714 -0.     -0.1429]
 [-1.4286  1.     -0.1429]
 [-0.1429 -0.      0.2857]]
matches np.linalg.inv: True` }
      ],
      conclusion: `The cofactor-built inverse matches NumPy exactly. This adjugate formula is why a matrix is invertible precisely when $\\det A\\neq 0$ — the inverse literally divides by the determinant.`
    }
  ]
});
