/* =====================================================================
   REAL-WORLD WALKTHROUGHS — Module 0 (Foundations)
   Each lesson id maps to an array of exactly 3 walkthroughs.
   Each walkthrough: a real-world scenario in a distinct domain, told as
   data -> math -> code -> result. Code is runnable Python (numpy/scipy/
   sklearn/stdlib), deterministic, and the `output` is the EXACT stdout.
   ===================================================================== */
window.WALKTHROUGHS = Object.assign(window.WALKTHROUGHS || {}, {

  /* ---------------------------------------------------------------- */
  "fnd-vector": [
    {
      title: `One song becomes a feature vector`,
      domain: `Music streaming (Spotify-style)`,
      question: `How does a streaming service turn a single song into numbers a model can use?`,
      steps: [
        { title: `The data`, body: `<p>An audio analyzer measures five things about one track: danceability $0.82$, energy $0.61$, tempo $120$ BPM, loudness $-5.4$ dB, speechiness $0.10$.</p>` },
        { title: `The math`, body: `<p>Stack the five measurements, in a fixed order, into a column. That column is the vector $x = [0.82,\\, 0.61,\\, 120,\\, -5.4,\\, 0.10]$. It has $n = 5$ entries, so $x \\in \\mathbb{R}^5$.</p>` },
        { title: `Run it`, body: `<p>We build the vector, read its dimension, and pull out one entry by position.</p>`, code: `import numpy as np
# One song -> a feature vector. Spotify-style audio features.
song = np.array([0.82, 0.61, 120.0, -5.4, 0.10])  # danceability, energy, tempo, loudness, speechiness
names = ["danceability", "energy", "tempo", "loudness", "speechiness"]
np.set_printoptions(suppress=True)
print("vector x =", song)
print("dimension n =", song.shape[0])
print("x[2] (tempo) =", song[2])
print("lives in R^%d" % song.shape[0])`, output: `vector x = [  0.82   0.61 120.    -5.4    0.1 ]
dimension n = 5
x[2] (tempo) = 120.0
lives in R^5` }
      ],
      conclusion: `The song is now the vector $x \\in \\mathbb{R}^5$. Every track in the catalog becomes a point in the same 5-dimensional space, which is what lets a recommender compare and cluster them.`
    },
    {
      title: `A handwritten digit becomes 784 numbers`,
      domain: `Computer vision (MNIST)`,
      question: `How does an image classifier see a 28x28 picture as a single vector?`,
      steps: [
        { title: `The data`, body: `<p>One grayscale digit is a $28 \\times 28$ grid of pixel intensities (0 to 255). That is $28 \\times 28 = 784$ numbers.</p>` },
        { title: `The math`, body: `<p>Flatten the grid row by row into one long column. The result is a vector $x \\in \\mathbb{R}^{784}$ — one number per pixel.</p>` },
        { title: `Run it`, body: `<p>We make a fake image with a fixed seed, flatten it, and check the length.</p>`, code: `import numpy as np
# A 28x28 grayscale digit image becomes a flat vector of 784 pixels.
rng = np.random.default_rng(0)
img = rng.integers(0, 256, size=(28, 28))   # one image
x = img.reshape(-1)                          # flatten to a vector
print("image shape:", img.shape)
print("vector length n:", x.shape[0])
print("first 8 pixel values:", x[:8])
print("lives in R^%d" % x.shape[0])`, output: `image shape: (28, 28)
vector length n: 784
first 8 pixel values: [217 163 130  69  78  10  19   4]
lives in R^784` }
      ],
      conclusion: `The image is the vector $x \\in \\mathbb{R}^{784}$. Pixels are just features, so the exact same "input is a vector" idea covers houses, songs, and photographs alike.`
    },
    {
      title: `A weather station reading as a vector`,
      domain: `Environmental sensing (IoT)`,
      question: `How do we package one timestamped sensor snapshot for a forecasting model?`,
      steps: [
        { title: `The data`, body: `<p>At one instant a station reports temperature $22.5^\\circ$C, humidity $0.63$, pressure $1013.2$ hPa, wind $4.1$ m/s.</p>` },
        { title: `The math`, body: `<p>Fix the order of channels and stack them: $x = [22.5,\\, 0.63,\\, 1013.2,\\, 4.1] \\in \\mathbb{R}^4$. Entry $x_3 = 1013.2$ is always the pressure.</p>` },
        { title: `Run it`, body: `<p>We build the reading and print each labeled channel.</p>`, code: `import numpy as np
# One sensor reading from a weather station = a vector of measurements.
reading = np.array([22.5, 0.63, 1013.2, 4.1])  # temp C, humidity, pressure hPa, wind m/s
labels = ["temp", "humidity", "pressure", "wind"]
np.set_printoptions(suppress=True)
print("reading =", reading)
print("n =", len(reading))
for name, val in zip(labels, reading):
    print(f"  {name}: {val}")
print("R^%d vector" % len(reading))`, output: `reading = [  22.5     0.63 1013.2     4.1 ]
n = 4
  temp: 22.5
  humidity: 0.63
  pressure: 1013.2
  wind: 4.1
R^4 vector` }
      ],
      conclusion: `Each snapshot is a vector in $\\mathbb{R}^4$. A day of readings becomes a sequence of such vectors — the standard input shape for time-series forecasting.`
    }
  ],

  /* ---------------------------------------------------------------- */
  "fnd-dot": [
    {
      title: `Scoring a loan applicant`,
      domain: `Credit risk / fintech`,
      question: `How does a linear model turn an applicant's features into a single risk score?`,
      steps: [
        { title: `The data`, body: `<p>Applicant features: credit score $720$, income $\\$45{,}000$, open accounts $3$, years of history $8$. Model weights: $w = [0.5,\\, 0.001,\\, -2.0,\\, 1.5]$.</p>` },
        { title: `The math`, body: `<p>The score is the dot product $w^\\top x = \\sum_i w_i x_i$. Multiply matching entries: $720{\\cdot}0.5 = 360$, $45000{\\cdot}0.001 = 45$, $3{\\cdot}(-2) = -6$, $8{\\cdot}1.5 = 12$. Sum to one number.</p>` },
        { title: `Run it`, body: `<p>numpy's <code>@</code> computes the dot product directly.</p>`, code: `import numpy as np
# Credit scoring: applicant features dotted with weights -> a score.
x = np.array([720, 45000, 3, 8])      # credit_score, income, num_accounts, years_history
w = np.array([0.5, 0.001, -2.0, 1.5]) # weights (how much each counts)
np.set_printoptions(suppress=True)
score = x @ w
print("features x =", x)
print("weights  w =", w)
print("per-term products:", x * w)
print("dot product score =", score)`, output: `features x = [  720 45000     3     8]
weights  w = [ 0.5    0.001 -2.     1.5  ]
per-term products: [360.  45.  -6.  12.]
dot product score = 411.0` }
      ],
      conclusion: `The score is $w^\\top x = 360 + 45 - 6 + 12 = 411$. Having many open accounts (the $-2$ weight) pushes the score down — the dot product folds every factor into one comparable number.`
    },
    {
      title: `How similar are two documents?`,
      domain: `Search / NLP`,
      question: `How does a search engine measure whether two texts are about the same topic?`,
      steps: [
        { title: `The data`, body: `<p>Each document becomes a vector of keyword counts over the same 5 keywords. Doc A $= [3,0,1,2,0]$, Doc B $= [1,0,4,0,2]$.</p>` },
        { title: `The math`, body: `<p>Cosine similarity is a normalized dot product: $\\cos\\theta = \\dfrac{a^\\top b}{\\lVert a\\rVert\\,\\lVert b\\rVert}$. The dot product $a^\\top b$ measures raw agreement; dividing by the norms removes the effect of document length.</p>` },
        { title: `Run it`, body: `<p>We compute the dot product and divide by the two lengths.</p>`, code: `import numpy as np
# Document similarity: cosine similarity = normalized dot product of word-count vectors.
a = np.array([3, 0, 1, 2, 0])  # counts of 5 keywords in doc A
b = np.array([1, 0, 4, 0, 2])  # same keywords in doc B
dot = a @ b
cos = dot / (np.linalg.norm(a) * np.linalg.norm(b))
print("a . b =", dot)
print("|a| =", round(float(np.linalg.norm(a)), 4))
print("|b| =", round(float(np.linalg.norm(b)), 4))
print("cosine similarity =", round(float(cos), 4))`, output: `a . b = 7
|a| = 3.7417
|b| = 4.5826
cosine similarity = 0.4082` }
      ],
      conclusion: `The dot product is $7$ and cosine similarity is $0.41$ — mild overlap. A value near $1$ would mean near-identical topics; near $0$ means unrelated. Search ranking is built on exactly this dot-product score.`
    },
    {
      title: `Totaling a shopping cart`,
      domain: `E-commerce`,
      question: `Why is a cart total just a dot product?`,
      steps: [
        { title: `The data`, body: `<p>Quantities $q = [2,1,3,5]$ and unit prices $p = [4.99, 19.99, 0.99, 2.50]$.</p>` },
        { title: `The math`, body: `<p>The bill is $q^\\top p = \\sum_i q_i p_i$ — multiply each quantity by its price, then add. One dot product, one total.</p>` },
        { title: `Run it`, body: `<p>We compute line totals and their sum.</p>`, code: `import numpy as np
# Online store: cart quantities dotted with prices -> total bill.
qty   = np.array([2, 1, 3, 5])         # items in cart
price = np.array([4.99, 19.99, 0.99, 2.50])
total = qty @ price
print("quantities:", qty)
print("prices:", price)
print("line totals:", qty * price)
print("cart total = $%.2f" % total)`, output: `quantities: [2 1 3 5]
prices: [ 4.99 19.99  0.99  2.5 ]
line totals: [ 9.98 19.99  2.97 12.5 ]
cart total = $45.44` }
      ],
      conclusion: `The total is $q^\\top p = \\$45.44$. The same operation that prices a cart also powers every model prediction — weights play the role of prices, features the role of quantities.`
    }
  ],

  /* ---------------------------------------------------------------- */
  "fnd-matrix": [
    {
      title: `A customer table is a matrix`,
      domain: `Marketing analytics`,
      question: `How is a spreadsheet of customers stored so a model can work on all of them at once?`,
      steps: [
        { title: `The data`, body: `<p>Four customers, three features each (age, income, purchases). Each customer is one row.</p>` },
        { title: `The math`, body: `<p>Stack the rows into $A \\in \\mathbb{R}^{m \\times n}$ with $m = 4$ rows and $n = 3$ columns. Entry $A_{2,2}$ is customer 2's income. Column averages give per-feature summaries.</p>` },
        { title: `Run it`, body: `<p>We build the matrix, read its shape, index one cell, and average each column.</p>`, code: `import numpy as np
# A dataset of customers = a matrix: rows are customers, columns are features.
A = np.array([
    [25, 30000, 2],   # age, income, purchases
    [42, 80000, 7],
    [31, 52000, 4],
    [58, 95000, 1],
])
np.set_printoptions(suppress=True)
print("matrix shape (m x n):", A.shape)
print("number of customers m =", A.shape[0])
print("number of features  n =", A.shape[1])
print("A[1,1] (customer 2 income) =", A[1, 1])
print("column means:", A.mean(axis=0))`, output: `matrix shape (m x n): (4, 3)
number of customers m = 4
number of features  n = 3
A[1,1] (customer 2 income) = 80000
column means: [   39.  64250.      3.5]` }
      ],
      conclusion: `The dataset is the matrix $A \\in \\mathbb{R}^{4 \\times 3}$. Rows are examples, columns are features, and one call collapses a column into a summary — the everyday shape of tabular ML data.`
    },
    {
      title: `An image is a grid of pixels`,
      domain: `Computer vision`,
      question: `In what sense is a grayscale photo literally a matrix?`,
      steps: [
        { title: `The data`, body: `<p>A tiny $4 \\times 4$ grayscale patch, where each cell is a brightness from $0$ (black) to $255$ (white).</p>` },
        { title: `The math`, body: `<p>The patch is a matrix $A \\in \\mathbb{R}^{4\\times 4}$. $A_{i,j}$ is the brightness at row $i$, column $j$. Operations like max and mean run over the whole grid.</p>` },
        { title: `Run it`, body: `<p>We index a pixel and summarize the image.</p>`, code: `import numpy as np
# A grayscale image IS a matrix of pixel intensities (0=black, 255=white).
img = np.array([
    [  0,   0, 255, 255],
    [  0, 128, 128, 255],
    [255, 128,   0,   0],
    [255, 255,   0,   0],
])
print("image shape:", img.shape)
print("pixel at row 2, col 1:", img[2, 1])
print("brightest pixel value:", img.max())
print("average brightness: %.1f" % img.mean())`, output: `image shape: (4, 4)
pixel at row 2, col 1: 128
brightest pixel value: 255
average brightness: 119.6` }
      ],
      conclusion: `The photo is the matrix $A \\in \\mathbb{R}^{4 \\times 4}$. Every image-processing step — blur, edge detection, convolution — is just arithmetic on this grid of numbers.`
    },
    {
      title: `Who rated which movie?`,
      domain: `Recommender systems`,
      question: `How is the data behind a recommender organized?`,
      steps: [
        { title: `The data`, body: `<p>Three users, four movies. Entry is a 1-to-5 rating, or $0$ if unrated.</p>` },
        { title: `The math`, body: `<p>The ratings form a matrix $R \\in \\mathbb{R}^{3\\times 4}$ (users $\\times$ movies). $R_{i,j}$ is user $i$'s rating of movie $j$. Most real matrices are mostly zeros (sparse).</p>` },
        { title: `Run it`, body: `<p>We index one rating, count ratings per user, and average each movie over its rated entries.</p>`, code: `import numpy as np
# A user-by-movie rating matrix (the heart of recommender systems). 0 = unrated.
R = np.array([
    [5, 0, 3, 0],   # Alice
    [4, 0, 0, 1],   # Bob
    [0, 2, 4, 5],   # Carol
])
print("ratings matrix shape (users x movies):", R.shape)
print("Carol's rating of movie 4:", R[2, 3])
print("ratings given per user:", (R > 0).sum(axis=1))
print("average rating per movie (rated only):")
for j in range(R.shape[1]):
    col = R[:, j]
    rated = col[col > 0]
    print("  movie %d: %.2f" % (j + 1, rated.mean()))`, output: `ratings matrix shape (users x movies): (3, 4)
Carol's rating of movie 4: 5
ratings given per user: [2 2 3]
average rating per movie (rated only):
  movie 1: 4.50
  movie 2: 2.00
  movie 3: 3.50
  movie 4: 3.00` }
      ],
      conclusion: `The data is the matrix $R \\in \\mathbb{R}^{3 \\times 4}$. Recommenders predict the missing $0$ entries by factoring this matrix into smaller user and movie matrices.`
    }
  ],

  /* ---------------------------------------------------------------- */
  "fnd-matvec": [
    {
      title: `Scoring a batch of applicants at once`,
      domain: `Credit risk / fintech`,
      question: `How does a model score many applicants in a single operation instead of a loop?`,
      steps: [
        { title: `The data`, body: `<p>Three applicants stacked as rows of $X \\in \\mathbb{R}^{3\\times 3}$ (credit, income, accounts), and one weight vector $w \\in \\mathbb{R}^3$.</p>` },
        { title: `The math`, body: `<p>$Xw$ does one dot product per row: row $i$ dotted with $w$ gives applicant $i$'s score. A $(3\\times 3)$ matrix times a $(3)$ vector yields a $(3)$ vector — the inner $3$'s cancel.</p>` },
        { title: `Run it`, body: `<p>One matrix-vector multiply scores all three.</p>`, code: `import numpy as np
# Score a whole batch of loan applicants in one matrix-vector multiply.
X = np.array([
    [720, 45000, 3],   # applicant 1: credit, income, accounts
    [650, 30000, 5],
    [800, 90000, 2],
])
w = np.array([0.5, 0.001, -2.0])   # model weights
scores = X @ w                     # one dot product per row
print("X shape:", X.shape, " w shape:", w.shape)
print("scores (one per applicant):", scores)
print("approved (score > 360):", scores > 360)`, output: `X shape: (3, 3)  w shape: (3,)
scores (one per applicant): [399. 345. 486.]
approved (score > 360): [ True False  True]` }
      ],
      conclusion: `$Xw = [399, 345, 486]$ scores all three applicants at once. This batch dot product is why ML inference is fast — one matrix multiply replaces a per-row loop.`
    },
    {
      title: `Rotating a game sprite`,
      domain: `Graphics / game dev`,
      question: `How does a rotation matrix turn a point by 90 degrees?`,
      steps: [
        { title: `The data`, body: `<p>A sprite point at $(3, 1)$ and a rotation matrix $R$ for $\\theta = 90^\\circ$: $R = \\begin{bmatrix} \\cos\\theta &amp; -\\sin\\theta \\\\ \\sin\\theta &amp; \\cos\\theta \\end{bmatrix}$.</p>` },
        { title: `The math`, body: `<p>$R\\,p$ applies the rotation. At $\\theta = 90^\\circ$, $\\cos\\theta = 0$ and $\\sin\\theta = 1$, so $R = \\begin{bmatrix} 0 &amp; -1 \\\\ 1 &amp; 0 \\end{bmatrix}$ and $(x, y) \\mapsto (-y, x)$.</p>` },
        { title: `Run it`, body: `<p>We build $R$ and multiply it by the point.</p>`, code: `import numpy as np
# Rotate 2D game sprite coordinates by 90 degrees using a rotation matrix.
theta = np.pi / 2
R = np.array([[np.cos(theta), -np.sin(theta)],
              [np.sin(theta),  np.cos(theta)]])
point = np.array([3, 1])      # a point on the sprite
rotated = R @ point
print("rotation matrix:\\n", np.round(R, 2))
print("original point:", point)
print("rotated point:", np.round(rotated, 2))`, output: `rotation matrix:
 [[ 0. -1.]
 [ 1.  0.]]
original point: [3 1]
rotated point: [-1.  3.]` }
      ],
      conclusion: `$R\\,p = (-1, 3)$: the point $(3,1)$ rotates to $(-1,3)$, exactly the $(x,y)\\mapsto(-y,x)$ quarter-turn. Every rotation, scaling, and reflection in graphics is a matrix-vector product.`
    },
    {
      title: `One layer of a neural network`,
      domain: `Deep learning`,
      question: `What is the core arithmetic inside a single dense layer?`,
      steps: [
        { title: `The data`, body: `<p>A layer of $3$ neurons over $4$ inputs is a weight matrix $W \\in \\mathbb{R}^{3\\times 4}$. The input is $x \\in \\mathbb{R}^4$.</p>` },
        { title: `The math`, body: `<p>The pre-activation is $z = Wx \\in \\mathbb{R}^3$ — each neuron computes the dot product of its weight row with $x$. A nonlinearity is applied afterward.</p>` },
        { title: `Run it`, body: `<p>We draw fixed random weights and compute the layer output.</p>`, code: `import numpy as np
# One dense neural-network layer: output = W x (the core compute of every layer).
rng = np.random.default_rng(0)
W = rng.normal(size=(3, 4))    # layer with 3 neurons, 4 inputs
x = np.array([1.0, 0.5, -1.0, 2.0])   # input features
z = W @ x                      # pre-activation: one number per neuron
print("W shape (neurons x inputs):", W.shape)
print("input x:", x)
print("layer output z =", np.round(z, 4))`, output: `W shape (neurons x inputs): (3, 4)
input x: [ 1.   0.5 -1.   2. ]
layer output z = [-0.3709  0.2353 -0.6305]` }
      ],
      conclusion: `$z = Wx = [-0.371, 0.235, -0.631]$, one number per neuron. Every layer in every deep net is this matrix-vector multiply — which is exactly what GPUs are built to accelerate.`
    }
  ],

  /* ---------------------------------------------------------------- */
  "fnd-norm": [
    {
      title: `Finding the nearest customer`,
      domain: `Customer analytics (k-NN)`,
      question: `How does k-nearest-neighbors decide which existing customer is "closest"?`,
      steps: [
        { title: `The data`, body: `<p>A query customer at (age $35$, income $\\$60{,}000$) and three candidates. We want the closest by straight-line distance.</p>` },
        { title: `The math`, body: `<p>Distance is the L2 norm of the difference: $\\lVert a - q\\rVert_2 = \\sqrt{\\sum_i (a_i - q_i)^2}$. The smallest distance wins. (Income dominates here because its raw scale is huge — a hint that real pipelines normalize features first.)</p>` },
        { title: `Run it`, body: `<p>We compute the L2 distance of each row to the query.</p>`, code: `import numpy as np
# k-NN: find the nearest customer by L2 (Euclidean) distance.
query = np.array([35, 60000])           # age, income
others = np.array([
    [30, 55000],
    [50, 62000],
    [36, 59000],
])
dists = np.linalg.norm(others - query, axis=1)   # L2 distance of each row
print("distances:", np.round(dists, 2))
nearest = int(np.argmin(dists))
print("nearest neighbor index:", nearest)
print("nearest customer:", others[nearest])`, output: `distances: [5000.   2000.06 1000.  ]
nearest neighbor index: 2
nearest customer: [   36 59000]` }
      ],
      conclusion: `The smallest L2 norm ($1000$) points to candidate index $2$, customer $(36,\\,59000)$. The L2 norm is the "distance" that k-NN and k-means rely on.`
    },
    {
      title: `LASSO zeroes out useless features`,
      domain: `Statistics / feature selection`,
      question: `How does an L1 penalty automatically discard irrelevant features?`,
      steps: [
        { title: `The data`, body: `<p>Five features, but only features $0$ and $2$ truly drive $y$: $y \\approx 3x_0 - 2x_2$. The other three are noise.</p>` },
        { title: `The math`, body: `<p>LASSO minimizes squared error plus an L1 penalty $\\alpha\\lVert w\\rVert_1 = \\alpha\\sum_i \\lvert w_i\\rvert$. The L1 norm has sharp corners at zero, which pushes weak weights to exactly $0$ — built-in feature selection.</p>` },
        { title: `Run it`, body: `<p>We fit <code>Lasso</code> on data with a known sparse truth.</p>`, code: `import numpy as np
# LASSO (L1) drives useless feature weights to exactly zero -> feature selection.
from sklearn.linear_model import Lasso
rng = np.random.default_rng(0)
n = 200
X = rng.normal(size=(n, 5))
# only features 0 and 2 actually matter
y = 3.0 * X[:, 0] - 2.0 * X[:, 2] + 0.1 * rng.normal(size=n)
model = Lasso(alpha=0.1).fit(X, y)
print("learned weights:", np.round(model.coef_, 3))
print("L1 norm of weights:", round(float(np.sum(np.abs(model.coef_))), 3))
print("features kept (nonzero):", list(np.flatnonzero(model.coef_)))`, output: `learned weights: [ 2.88  -0.    -1.891 -0.    -0.   ]
L1 norm of weights: 4.771
features kept (nonzero): [0, 2]` }
      ],
      conclusion: `LASSO set three weights to exactly $0$ and kept only features $0$ and $2$ — the true drivers. The L1 norm in the penalty is what makes that automatic sparsity happen.`
    },
    {
      title: `Straight-line vs city-block distance`,
      domain: `Navigation / GPS`,
      question: `Why can two valid "distances" between the same two points differ?`,
      steps: [
        { title: `The data`, body: `<p>Start at $(0,0)$ km, destination at $(3,4)$ km, on a grid where $x$ is east and $y$ is north.</p>` },
        { title: `The math`, body: `<p>L2 is the crow-flies distance $\\lVert d\\rVert_2 = \\sqrt{3^2 + 4^2} = 5$. L1 is the city-block distance $\\lVert d\\rVert_1 = \\lvert 3\\rvert + \\lvert 4\\rvert = 7$ — what you walk when you can only go along streets.</p>` },
        { title: `Run it`, body: `<p>We compute both norms of the displacement.</p>`, code: `import numpy as np
# GPS: straight-line (L2) vs city-block (L1) distance between two locations.
a = np.array([0.0, 0.0])       # start (x east, y north), km
b = np.array([3.0, 4.0])       # destination
diff = b - a
l2 = np.linalg.norm(diff, ord=2)
l1 = np.linalg.norm(diff, ord=1)
print("displacement:", diff)
print("L2 straight-line distance (km):", l2)
print("L1 city-block distance (km):", l1)`, output: `displacement: [3. 4.]
L2 straight-line distance (km): 5.0
L1 city-block distance (km): 7.0` }
      ],
      conclusion: `Same two points, two answers: $\\lVert d\\rVert_2 = 5$ km as the crow flies, $\\lVert d\\rVert_1 = 7$ km along the grid. Choosing a norm is choosing what "distance" means for your problem.`
    }
  ],

  /* ---------------------------------------------------------------- */
  "fnd-derivative": [
    {
      title: `Velocity is the derivative of position`,
      domain: `Physics / kinematics`,
      question: `How fast is an object moving at one instant, given its position over time?`,
      steps: [
        { title: `The data`, body: `<p>A falling object's position is $s(t) = 5t^2$ meters. We want its speed exactly at $t = 3$ s.</p>` },
        { title: `The math`, body: `<p>Velocity is the derivative $\\frac{ds}{dt}$. For $s = 5t^2$ the rule gives $\\frac{ds}{dt} = 10t$, so at $t=3$ the velocity is $30$ m/s. We can also estimate it with a tiny step $h$: $\\frac{s(t+h)-s(t)}{h}$.</p>` },
        { title: `Run it`, body: `<p>We compare the exact rule against the tiny-step approximation.</p>`, code: `import numpy as np
# Physics: position s(t) = 5t^2. Velocity is the derivative ds/dt = 10t.
def s(t):
    return 5.0 * t**2
t0 = 3.0
exact = 10.0 * t0
# numerical derivative via a tiny step h
h = 1e-6
approx = (s(t0 + h) - s(t0)) / h
print("position at t=3:", s(t0))
print("exact velocity ds/dt = 10t =", exact)
print("numerical slope     =", round(approx, 4))`, output: `position at t=3: 45.0
exact velocity ds/dt = 10t = 30.0
numerical slope     = 30.0` }
      ],
      conclusion: `At $t=3$ the velocity is $\\frac{ds}{dt} = 30$ m/s, and the tiny-step estimate agrees. The derivative is exactly the instantaneous rate of change.`
    },
    {
      title: `The price that maximizes profit`,
      domain: `Business / pricing`,
      question: `At what price does profit stop rising and start falling?`,
      steps: [
        { title: `The data`, body: `<p>Profit as a function of price is $P(x) = -2x^2 + 40x - 50$ (a downward parabola).</p>` },
        { title: `The math`, body: `<p>The slope is $P'(x) = -4x + 40$. Profit peaks where the slope is zero: $-4x + 40 = 0 \\Rightarrow x = 10$. Slope positive below $10$ (still climbing), negative above (declining).</p>` },
        { title: `Run it`, body: `<p>We tabulate slope and profit across prices and solve for the flat point.</p>`, code: `import numpy as np
# Business: profit P(x) = -2x^2 + 40x - 50 vs price x. Max where dP/dx = 0.
def P(x):
    return -2.0 * x**2 + 40.0 * x - 50.0
def dP(x):
    return -4.0 * x + 40.0
xs = np.array([5.0, 8.0, 10.0, 12.0, 15.0])
print("price  slope dP/dx  profit")
for x in xs:
    print(" %4.0f   %8.1f   %7.1f" % (x, dP(x), P(x)))
x_star = 40.0 / 4.0
print("optimal price (slope=0): x =", x_star, " profit =", P(x_star))`, output: `price  slope dP/dx  profit
    5       20.0     100.0
    8        8.0     142.0
   10        0.0     150.0
   12       -8.0     142.0
   15      -20.0     100.0
optimal price (slope=0): x = 10.0  profit = 150.0` }
      ],
      conclusion: `Profit peaks at price $x = 10$, where $P'(x) = 0$ and profit is $150$. A zero derivative marks the top of the hill — the standard way to find an optimum.`
    },
    {
      title: `Walking downhill on a loss curve`,
      domain: `Machine learning (gradient descent)`,
      question: `How does a model use a slope to find the value that minimizes its error?`,
      steps: [
        { title: `The data`, body: `<p>A simple 1D loss $L(w) = (w-4)^2$, a bowl with its minimum at $w=4$. We start at $w=0$.</p>` },
        { title: `The math`, body: `<p>The slope is $L'(w) = 2(w-4)$. Gradient descent steps opposite the slope: $w \\leftarrow w - \\eta\\,L'(w)$ with learning rate $\\eta = 0.3$. Each step moves $w$ toward $4$.</p>` },
        { title: `Run it`, body: `<p>We run six descent steps and watch the loss shrink.</p>`, code: `import numpy as np
# Gradient descent on a 1D loss L(w) = (w - 4)^2 to find the minimum.
def L(w):
    return (w - 4.0)**2
def dL(w):
    return 2.0 * (w - 4.0)
w = 0.0
lr = 0.3
for step in range(6):
    print("step %d: w=%.4f  loss=%.4f  slope=%.4f" % (step, w, L(w), dL(w)))
    w = w - lr * dL(w)   # step opposite the slope
print("final w =", round(w, 4))`, output: `step 0: w=0.0000  loss=16.0000  slope=-8.0000
step 1: w=2.4000  loss=2.5600  slope=-3.2000
step 2: w=3.3600  loss=0.4096  slope=-1.2800
step 3: w=3.7440  loss=0.0655  slope=-0.5120
step 4: w=3.8976  loss=0.0105  slope=-0.2048
step 5: w=3.9590  loss=0.0017  slope=-0.0819
final w = 3.9836` }
      ],
      conclusion: `Stepping opposite the slope drove $w$ from $0$ to $3.98$ — almost the true minimum at $4$ — while the loss fell from $16$ to near zero. That single idea, "step against the derivative," trains every model.`
    }
  ],

  /* ---------------------------------------------------------------- */
  "fnd-gradient": [
    {
      title: `Fitting a sales line by gradient descent`,
      domain: `Marketing / linear regression`,
      question: `How do we learn the best line relating ad spend to sales?`,
      steps: [
        { title: `The data`, body: `<p>50 points where sales rise with ad spend, true relationship $y \\approx 2.5x + 1$ plus noise. Unknowns: intercept $w_0$ and slope $w_1$.</p>` },
        { title: `The math`, body: `<p>The loss is mean squared error. Its gradient is $\\nabla L = \\frac{2}{n} X^\\top (Xw - y)$, a vector with one slope per weight. We repeatedly step $w \\leftarrow w - \\eta\\,\\nabla L$. At the minimum the gradient is near $\\mathbf{0}$.</p>` },
        { title: `Run it`, body: `<p>We run 2000 gradient steps and read off the learned line.</p>`, code: `import numpy as np
# Linear regression by gradient descent: fit y = w1*x + w0 to ad-spend vs sales.
rng = np.random.default_rng(0)
x = np.linspace(0, 10, 50)
y = 2.5 * x + 1.0 + rng.normal(scale=0.5, size=50)   # true slope 2.5, intercept 1
w = np.array([0.0, 0.0])   # [w0 intercept, w1 slope]
lr = 0.01
n = len(x)
X = np.column_stack([np.ones(n), x])   # design matrix
for _ in range(2000):
    err = X @ w - y
    grad = (2.0 / n) * (X.T @ err)     # gradient of mean squared error
    w = w - lr * grad
print("learned intercept w0 =", round(w[0], 3))
print("learned slope     w1 =", round(w[1], 3))
print("final gradient (near zero):", np.round((2.0/n)*(X.T @ (X@w - y)), 5))`, output: `learned intercept w0 = 0.774
learned slope     w1 = 2.558
final gradient (near zero): [-1.e-05  0.e+00]` }
      ],
      conclusion: `Gradient descent recovered slope $2.56$ and intercept $0.77$, close to the truth $(2.5, 1.0)$, and the final gradient is essentially $\\mathbf{0}$ — the signature of having reached the bottom of the loss bowl.`
    },
    {
      title: `Rolling down a 2D bowl`,
      domain: `Optimization`,
      question: `How does the gradient point the way downhill when there are two inputs?`,
      steps: [
        { title: `The data`, body: `<p>A bowl-shaped loss $f(x,y) = x^2 + 2y^2$. We start at the point $(3, 2)$.</p>` },
        { title: `The math`, body: `<p>The gradient is $\\nabla f = [2x,\\, 4y]$ and points straight uphill. Stepping along $-\\nabla f$ heads toward the minimum at $(0,0)$. The steeper $y$-bowl (factor $4$) shrinks faster.</p>` },
        { title: `Run it`, body: `<p>We take five downhill steps and track the point and gradient.</p>`, code: `import numpy as np
# 2D bowl loss f(x,y) = x^2 + 2y^2. Gradient [2x, 4y] points uphill; step downhill.
def f(p):
    return p[0]**2 + 2.0 * p[1]**2
def grad(p):
    return np.array([2.0 * p[0], 4.0 * p[1]])
p = np.array([3.0, 2.0])
lr = 0.1
for step in range(5):
    g = grad(p)
    print("step %d: p=(%.3f, %.3f)  f=%.4f  grad=(%.3f, %.3f)" % (step, p[0], p[1], f(p), g[0], g[1]))
    p = p - lr * g
print("final point:", np.round(p, 4))`, output: `step 0: p=(3.000, 2.000)  f=17.0000  grad=(6.000, 8.000)
step 1: p=(2.400, 1.200)  f=8.6400  grad=(4.800, 4.800)
step 2: p=(1.920, 0.720)  f=4.7232  grad=(3.840, 2.880)
step 3: p=(1.536, 0.432)  f=2.7325  grad=(3.072, 1.728)
step 4: p=(1.229, 0.259)  f=1.6443  grad=(2.458, 1.037)
final point: [0.983  0.1555]` }
      ],
      conclusion: `Following $-\\nabla f$ drove the point from $(3,2)$ toward $(0.98, 0.16)$ and the loss from $17$ to $1.6$. The gradient is the multi-input slope, and its negative is always the downhill direction.`
    },
    {
      title: `One gradient step for a spam classifier`,
      domain: `Email / NLP (logistic regression)`,
      question: `How does logistic regression know which way to nudge its weights?`,
      steps: [
        { title: `The data`, body: `<p>Four emails with two features (has_link, num_caps_words) and spam labels $y$. Weights start at $\\mathbf{0}$, so every prediction is $0.5$.</p>` },
        { title: `The math`, body: `<p>The log-loss gradient is $\\nabla L = \\frac{1}{n} X^\\top (\\sigma(Xw) - y)$, where $\\sigma$ is the sigmoid. A negative gradient component means "increase this weight." We take one step $w \\leftarrow w - \\eta\\,\\nabla L$.</p>` },
        { title: `Run it`, body: `<p>We compute the gradient and apply one update.</p>`, code: `import numpy as np
# Logistic regression gradient for spam detection (one gradient step shown).
def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))
# 4 emails, 2 features: [has_link, num_caps_words]
X = np.array([[1, 5], [0, 0], [1, 8], [0, 1]], dtype=float)
y = np.array([1, 0, 1, 0], dtype=float)   # spam labels
w = np.array([0.0, 0.0])
n = len(y)
preds = sigmoid(X @ w)
grad = (1.0 / n) * (X.T @ (preds - y))    # gradient of log-loss
print("initial predictions:", np.round(preds, 3))
print("gradient of loss:", np.round(grad, 4))
w_new = w - 0.5 * grad
print("updated weights:", np.round(w_new, 4))`, output: `initial predictions: [0.5 0.5 0.5 0.5]
gradient of loss: [-0.25 -1.5 ]
updated weights: [0.125 0.75 ]` }
      ],
      conclusion: `The gradient $[-0.25, -1.5]$ is negative, so both weights increase to $[0.125, 0.75]$ — the model learns that links and capitalized words signal spam. Repeating this step is how the classifier trains.`
    }
  ],

  /* ---------------------------------------------------------------- */
  "fnd-chain": [
    {
      title: `Backprop through one neuron`,
      domain: `Deep learning`,
      question: `How does backpropagation get the slope of the loss with respect to a weight?`,
      steps: [
        { title: `The data`, body: `<p>One neuron: input $x=2$, weight $w=0.5$, target $y=1$. It computes $z = wx$, then $a = \\sigma(z)$, then loss $= (a-y)^2$.</p>` },
        { title: `The math`, body: `<p>The value passes through three steps, so chain them: $\\frac{dL}{dw} = \\frac{dL}{da}\\cdot\\frac{da}{dz}\\cdot\\frac{dz}{dw}$, where $\\frac{dL}{da} = 2(a-y)$, $\\frac{da}{dz} = a(1-a)$, and $\\frac{dz}{dw} = x$. Multiply the three local slopes.</p>` },
        { title: `Run it`, body: `<p>We compute each local slope and their product.</p>`, code: `import numpy as np
# Backprop through one neuron: z = w*x, a = sigmoid(z), loss = (a - y)^2.
def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))
x, w, y = 2.0, 0.5, 1.0
z = w * x
a = sigmoid(z)
loss = (a - y)**2
# chain rule: dL/dw = dL/da * da/dz * dz/dw
dL_da = 2.0 * (a - y)
da_dz = a * (1.0 - a)
dz_dw = x
dL_dw = dL_da * da_dz * dz_dw
print("z=%.4f  a=%.4f  loss=%.4f" % (z, a, loss))
print("dL/da=%.4f  da/dz=%.4f  dz/dw=%.4f" % (dL_da, da_dz, dz_dw))
print("dL/dw (product of slopes) =", round(dL_dw, 6))`, output: `z=1.0000  a=0.7311  loss=0.0723
dL/da=-0.5379  da/dz=0.1966  dz/dw=2.0000
dL/dw (product of slopes) = -0.211508` }
      ],
      conclusion: `Multiplying the three local slopes gives $\\frac{dL}{dw} = -0.2115$. Backprop is exactly this: chain together each layer's local slope to learn how every weight affects the loss.`
    },
    {
      title: `Sensitivity of compound growth`,
      domain: `Finance`,
      question: `How much does a 10-year balance change per unit change in the interest rate?`,
      steps: [
        { title: `The data`, body: `<p>A balance grows as $B(r) = (1+r)^{10}$ over ten years. We evaluate the sensitivity at $r = 5\\%$.</p>` },
        { title: `The math`, body: `<p>Let the inner step be $u = 1+r$ and outer $B = u^{10}$. The chain rule gives $\\frac{dB}{dr} = \\frac{dB}{du}\\cdot\\frac{du}{dr} = 10u^9 \\cdot 1 = 10(1+r)^9$.</p>` },
        { title: `Run it`, body: `<p>We compare the chain-rule formula against a tiny-step numerical check.</p>`, code: `import numpy as np
# Finance: compound growth. balance = (1 + r)^10. d(balance)/dr via chain rule.
def balance(r):
    return (1.0 + r)**10
r0 = 0.05
# let u = 1+r, B = u^10. dB/dr = 10*u^9 * 1
exact = 10.0 * (1.0 + r0)**9
h = 1e-7
approx = (balance(r0 + h) - balance(r0)) / h
print("balance at r=5%%: %.4f" % balance(r0))
print("chain-rule dB/dr = 10(1+r)^9 = %.4f" % exact)
print("numerical check         = %.4f" % approx)`, output: `balance at r=5%: 1.6289
chain-rule dB/dr = 10(1+r)^9 = 15.5133
numerical check         = 15.5133` }
      ],
      conclusion: `At $r = 5\\%$ the sensitivity is $\\frac{dB}{dr} = 10(1.05)^9 \\approx 15.51$, and the numerical check matches. The chain rule splits a nested formula into outer and inner slopes you simply multiply.`
    },
    {
      title: `A two-stage temperature pipeline`,
      domain: `Process control / engineering`,
      question: `How does turning a dial change a downstream cost through two conversions?`,
      steps: [
        { title: `The data`, body: `<p>A dial $d$ sets Celsius $C = 2d$. Then Fahrenheit $F = 1.8C + 32$. A cost penalizes deviation from $70^\\circ$F: $\\text{cost} = (F-70)^2$. Evaluate at $d=5$.</p>` },
        { title: `The math`, body: `<p>Three stacked steps, so chain three slopes: $\\frac{d\\,\\text{cost}}{dd} = \\frac{d\\,\\text{cost}}{dF}\\cdot\\frac{dF}{dC}\\cdot\\frac{dC}{dd} = 2(F-70)\\cdot 1.8 \\cdot 2$.</p>` },
        { title: `Run it`, body: `<p>We run the pipeline and multiply the three local slopes.</p>`, code: `import numpy as np
# Two-layer chain: temperature in Celsius -> Fahrenheit -> a cost. Stacked rates.
# C depends on dial d: C = 2*d. F = 1.8*C + 32. cost = (F - 70)^2.
def pipeline(d):
    C = 2.0 * d
    F = 1.8 * C + 32.0
    cost = (F - 70.0)**2
    return C, F, cost
d0 = 5.0
C, F, cost = pipeline(d0)
# dcost/dd = dcost/dF * dF/dC * dC/dd
dcost_dF = 2.0 * (F - 70.0)
dF_dC = 1.8
dC_dd = 2.0
dcost_dd = dcost_dF * dF_dC * dC_dd
print("C=%.1f  F=%.1f  cost=%.2f" % (C, F, cost))
print("local slopes: dcost/dF=%.2f, dF/dC=%.1f, dC/dd=%.1f" % (dcost_dF, dF_dC, dC_dd))
print("dcost/dd (multiply all) =", dcost_dd)`, output: `C=10.0  F=50.0  cost=400.00
local slopes: dcost/dF=-40.00, dF/dC=1.8, dC/dd=2.0
dcost/dd (multiply all) = -144.0` }
      ],
      conclusion: `Multiplying the three stage slopes gives $\\frac{d\\,\\text{cost}}{dd} = -40 \\cdot 1.8 \\cdot 2 = -144$: nudging the dial up lowers the cost. Any pipeline of steps differentiates this way — which is all backprop is.`
    }
  ],

  /* ---------------------------------------------------------------- */
  "fnd-eigen": [
    {
      title: `Finding the main axis of data (PCA)`,
      domain: `Dimensionality reduction`,
      question: `Which direction captures most of the spread in a 2D point cloud?`,
      steps: [
        { title: `The data`, body: `<p>300 points stretched mostly along one diagonal direction, with a little noise off it.</p>` },
        { title: `The math`, body: `<p>PCA forms the covariance matrix $\\Sigma$ and solves $\\Sigma z = \\lambda z$. The eigenvector with the largest eigenvalue is the direction of greatest variance; its eigenvalue is how much variance lies along it.</p>` },
        { title: `Run it`, body: `<p>We compute the covariance and its eigenvectors.</p>`, code: `import numpy as np
# PCA: find the main axis of spread in 2D data via the covariance eigenvectors.
rng = np.random.default_rng(0)
n = 300
t = rng.normal(size=n)
# data stretched along the (1, 0.5) direction
data = np.column_stack([2.0 * t, 1.0 * t]) + 0.2 * rng.normal(size=(n, 2))
cov = np.cov(data.T)
vals, vecs = np.linalg.eigh(cov)   # ascending eigenvalues
order = np.argsort(vals)[::-1]
vals, vecs = vals[order], vecs[:, order]
print("covariance matrix:\\n", np.round(cov, 3))
print("eigenvalues (variance per axis):", np.round(vals, 3))
print("top eigenvector (main axis):", np.round(vecs[:, 0], 3))
print("variance explained by top axis: %.1f%%" % (100 * vals[0] / vals.sum()))`, output: `covariance matrix:
 [[4.22  2.08 ]
 [2.08  1.071]]
eigenvalues (variance per axis): [5.254 0.037]
top eigenvector (main axis): [-0.895 -0.445]
variance explained by top axis: 99.3%` }
      ],
      conclusion: `The top eigenvector $[-0.90, -0.45]$ captures $99.3\\%$ of the variance, so the 2D data is nearly 1D along that axis. Keeping only the top eigenvectors is how PCA compresses data.`
    },
    {
      title: `Ranking web pages (PageRank)`,
      domain: `Search engines`,
      question: `How does the importance of web pages emerge from their link structure?`,
      steps: [
        { title: `The data`, body: `<p>Four pages and a transition matrix $M$ describing where a random surfer goes next. A damping factor of $0.85$ keeps the walk well-behaved.</p>` },
        { title: `The math`, body: `<p>Importance is the steady state of the surfer: the vector $r$ with $A r = r$, i.e. the eigenvector of $A$ with eigenvalue $\\lambda = 1$. We extract it and normalize to sum to $1$.</p>` },
        { title: `Run it`, body: `<p>We build $A$, find the eigenvalue nearest $1$, and read its eigenvector.</p>`, code: `import numpy as np
# PageRank: the steady-state importance is the dominant eigenvector of the link matrix.
# 4 pages. Column-stochastic transition matrix M (where surfers go next).
M = np.array([
    [0.0, 0.0, 1.0, 0.5],
    [0.5, 0.0, 0.0, 0.0],
    [0.5, 1.0, 0.0, 0.5],
    [0.0, 0.0, 0.0, 0.0],
])
# damping to keep it well-behaved
d = 0.85
N = 4
A = d * M + (1 - d) / N * np.ones((N, N))
vals, vecs = np.linalg.eig(A)
idx = int(np.argmin(np.abs(vals - 1.0)))   # eigenvalue closest to 1
rank = np.real(vecs[:, idx])
rank = rank / rank.sum()
print("dominant eigenvalue:", round(float(np.real(vals[idx])), 4))
print("PageRank scores:", np.round(rank, 4))
print("most important page:", int(np.argmax(rank)) + 1)`, output: `dominant eigenvalue: 1.0
PageRank scores: [0.3797 0.1989 0.3839 0.0375]
most important page: 3` }
      ],
      conclusion: `The eigenvector for $\\lambda = 1$ gives PageRank scores $[0.38, 0.20, 0.38, 0.04]$, ranking page 3 highest. Google's original ranking was literally this dominant-eigenvector computation.`
    },
    {
      title: `Natural frequencies of a structure`,
      domain: `Mechanical engineering`,
      question: `At what frequencies does a two-mass spring system naturally vibrate?`,
      steps: [
        { title: `The data`, body: `<p>Two masses linked by springs give a stiffness matrix $K = \\begin{bmatrix} 2 &amp; -1 \\\\ -1 &amp; 2 \\end{bmatrix}$.</p>` },
        { title: `The math`, body: `<p>Vibration modes solve $Kz = \\lambda z$. Each eigenvalue $\\lambda$ gives a natural frequency $\\sqrt{\\lambda}$; each eigenvector $z$ is the shape (mode) in which the masses move together.</p>` },
        { title: `Run it`, body: `<p>We find the eigenvalues and verify $Kz = \\lambda z$ for the first mode.</p>`, code: `import numpy as np
# Vibration / structural engineering: natural frequencies are eigenvalues of the system.
# Two masses on springs -> stiffness matrix K. eig gives modes of vibration.
K = np.array([[2.0, -1.0],
              [-1.0, 2.0]])
vals, vecs = np.linalg.eigh(K)
print("stiffness matrix K:\\n", K)
print("eigenvalues (mode stiffness):", np.round(vals, 4))
print("natural frequencies sqrt(lambda):", np.round(np.sqrt(vals), 4))
print("mode shapes (columns):\\n", np.round(vecs, 3))
# verify K z = lambda z for the first mode
z = vecs[:, 0]
print("check K z =", np.round(K @ z, 4), " vs lambda z =", np.round(vals[0] * z, 4))`, output: `stiffness matrix K:
 [[ 2. -1.]
 [-1.  2.]]
eigenvalues (mode stiffness): [1. 3.]
natural frequencies sqrt(lambda): [1.     1.7321]
mode shapes (columns):
 [[-0.707 -0.707]
 [-0.707  0.707]]
check K z = [-0.7071 -0.7071]  vs lambda z = [-0.7071 -0.7071]` }
      ],
      conclusion: `The eigenvalues $1$ and $3$ give natural frequencies $1$ and $\\sqrt{3}\\approx 1.73$, and $Kz$ exactly equals $\\lambda z$ for the first mode. Engineers find resonance this way — the same $Az = \\lambda z$ that powers PCA and PageRank.`
    }
  ]

});
