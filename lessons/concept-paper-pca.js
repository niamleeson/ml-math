/* Paper lesson — Principal Component Analysis: Pearson (1901) "On lines and planes of closest fit
   to systems of points in space" (Philosophical Magazine) and Hotelling (1933) "Analysis of a complex
   of statistical variables into principal components" (Journal of Educational Psychology).
   No arXiv (pre-arXiv classics). Metadata + the two equivalent objectives grounded from the published
   sources and the PCA history record (Pearson 1901, DOI 10.1080/14786440109462720; Hotelling 1933,
   J. Educ. Psychol. 24(6):417–441).
   Track A (primitive): build PCA from scratch with NumPy — center, covariance, eigen-decomposition,
   project onto top-k — and VERIFY components + explained variance against sklearn.decomposition.PCA on
   a toy 2-D set; show the variance-maximizing projection and the reconstruction. Self-contained:
   lesson + CODE + CODEVIZ merged by id "paper-pca". */
(function () {
  window.LESSONS.push({
    id: "paper-pca",
    title: "PCA — On lines and planes of closest fit / Principal Components (1901 / 1933)",
    tagline: "Find the few directions along which the data varies most; project onto them to compress with the least possible loss.",
    module: "Papers · Classical ML",
    track: "primitive",

    paper: {
      authors: "Karl Pearson (1901); Harold Hotelling (1933)",
      org: "University College London; Columbia University",
      year: 1901,
      venue: "Pearson: Philosophical Magazine, Ser. 6, 2(11):559–572 (1901). Hotelling: Journal of Educational Psychology 24(6):417–441 (1933).",
      citations: "",
      arxiv: "",
      url: "https://www.tandfonline.com/doi/abs/10.1080/14786440109462720",
      code: ""
    },

    conceptLink: "ml-pca",
    partOf: [],
    prereqs: ["ml-pca", "fnd-eigen", "la-spectral", "la-svd", "prob-covariance-correlation"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> You measure many numbers per item &mdash; height and weight per person, or hundreds
       of gene readings per cell. Each item is then a <b>point</b> in a high-dimensional space (one axis per
       measured number). Most of these axes are partly redundant: tall people also tend to be heavier, so the
       cloud of points is not spread evenly &mdash; it is stretched along a few directions and thin along the
       rest.</p>
       <p><b>What was hard before.</b> Pearson (1901) asked a purely geometric question: given a cloud of points,
       what single <b>line</b> &mdash; or <b>plane</b> &mdash; passes <i>closest</i> to all of them? Ordinary
       least-squares regression answers a <i>different</i> question: it minimizes the <i>vertical</i> distance to
       a line, treating one axis as a special "output." Pearson wanted the line of <b>closest fit</b> that treats
       all axes symmetrically &mdash; minimizing the <b>perpendicular</b> (shortest) distance from each point to
       the line. That is a harder, more natural notion of "the best summary direction," and it had no clean
       recipe.</p>`,

    contribution:
      `<p>Two classic papers, the same method seen from two sides:</p>
       <ul>
         <li><b>Pearson (1901), "On lines and planes of closest fit to systems of points in space."</b> Framed it
         as <b>minimizing the sum of squared perpendicular distances</b> from the points to a line (or plane). He
         showed the best-fitting line passes through the mean of the points and points along the direction of
         greatest spread.</li>
         <li><b>Hotelling (1933), "Analysis of a complex of statistical variables into principal components."</b>
         Gave the equivalent <b>variance-maximizing</b> view and the name <b>principal components</b>: the
         directions, in order, that capture the most <b>variance</b> ("variance" = average squared spread of the
         data around its mean). He showed these directions are the <b>eigenvectors of the covariance matrix</b>,
         sorted by eigenvalue.</li>
         <li><b>The unification.</b> Minimizing perpendicular reconstruction error (Pearson) and maximizing
         projected variance (Hotelling) are the <i>same</i> problem &mdash; both solved by the top eigenvectors of
         the covariance matrix. That is the modern definition of PCA.</li>
       </ul>`,

    whyItMattered:
      `<p>PCA is the most-used dimensionality-reduction and data-compression tool in all of statistics and machine
       learning. It powers <b>visualization</b> (squash 100 dimensions to 2 to plot them), <b>denoising</b> (drop
       the low-variance directions), <b>feature extraction</b> (feed the top components to a model), and
       <b>whitening</b>. It is the linear backbone behind latent-factor recommenders, eigenfaces, market-risk
       factors, and gene-expression analysis. Modern nonlinear cousins (kernel PCA, autoencoders, t-SNE) are all
       defined by contrast with it. Every <code>sklearn.decomposition.PCA</code> call runs the recipe these two
       papers wrote.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Pearson (1901), opening pages.</b> The framing of "closest fit" as minimizing the
         <i>perpendicular</i> distance, and the contrast he draws with ordinary regression. This is the geometric
         heart.</li>
         <li><b>Hotelling (1933), Section on the first principal component.</b> The variance-maximization setup
         under a unit-length constraint, and the result that the components are eigenvectors of the
         correlation/covariance matrix ordered by eigenvalue.</li>
       </ul>
       <p><b>Skim:</b> Pearson's worked mechanical analogy (he likens the best line to a principal axis of inertia
       of the point masses) &mdash; nice intuition, not needed for the algorithm. Hotelling's factor-analysis
       motivation from psychology &mdash; the method is general, the application is incidental.</p>
       <p><b>The key takeaway both share:</b> the answer is always "take the eigenvectors of the covariance matrix,
       biggest eigenvalue first." Everything else is interpretation.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> You will take a small 2-D cloud of points that lies roughly along a diagonal,
       center it, and find its first principal component. (a) Will that first direction point along the diagonal
       (the long axis of the cloud) or across it? (b) The two eigenvalues of the covariance matrix measure the
       variance along each principal direction. If the cloud is much longer than it is wide, will the first
       eigenvalue be much larger than the second? (c) If you keep only the first component and reconstruct, the
       average squared error should equal the variance you threw away &mdash; the <i>second</i> eigenvalue. Write
       your guesses, then check the worked example.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write <code>my_pca(X, k)</code> using only NumPy (no sklearn). Given a
       data matrix <code>X</code> with one row per point:</p>
       <ul>
         <li><code># TODO: mean = X.mean(axis=0); Xc = X - mean</code> &mdash; center the data (subtract the mean so the cloud sits at the origin).</li>
         <li><code># TODO: cov = (Xc.T @ Xc) / (n - 1)</code> &mdash; the covariance matrix (how each pair of features varies together).</li>
         <li><code># TODO: w, V = np.linalg.eigh(cov)</code> &mdash; eigenvalues <code>w</code> and eigenvectors <code>V</code> of the symmetric covariance matrix.</li>
         <li><code># TODO: sort by eigenvalue descending; components = V[:, :k].T</code> &mdash; the top-k principal directions.</li>
         <li><code># TODO: Z = Xc @ components.T</code> &mdash; project each centered point onto the top-k directions (the scores / coordinates).</li>
       </ul>
       <p>The CODE cell below is the full reference, including the verification that your <code>components</code> and
       eigenvalues match <code>sklearn.decomposition.PCA</code> (up to a sign flip) &mdash; that match is the proof
       your math is exactly PCA.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>PCA turns "find the best summary directions" into an eigenvector problem in four steps.</p>
       <ol>
         <li><b>Center the data.</b> Subtract the mean of each feature so the point cloud is centred on the origin:
         $\\tilde x_i = x_i - \\bar x$. Pearson proved the best-fitting line must pass through the mean, so centring
         is not optional &mdash; it puts that point at the origin.</li>
         <li><b>Build the covariance matrix.</b> $\\Sigma = \\frac{1}{n-1}\\tilde X^\\top \\tilde X$. Entry
         $\\Sigma_{jk}$ is the covariance between feature $j$ and feature $k$: how they vary together. The diagonal
         holds each feature's variance. $\\Sigma$ is symmetric and <b>positive semi-definite</b> (its eigenvalues
         are $\\ge 0$).</li>
         <li><b>Eigen-decompose it.</b> Find unit vectors $u$ and numbers $\\lambda$ with $\\Sigma u = \\lambda u$.
         Because $\\Sigma$ is symmetric, the <b>spectral theorem</b> guarantees a full set of orthogonal
         eigenvectors with real, non-negative eigenvalues. Sort them so $\\lambda_1 \\ge \\lambda_2 \\ge \\dots$.
         The eigenvector $u_1$ is the <b>first principal component</b>; $u_2$ the second; and so on.</li>
         <li><b>Project onto the top $k$.</b> The new coordinate of a centred point along component $u_j$ is the dot
         product $\\tilde x_i^\\top u_j$. Stacking the top-$k$ eigenvectors as columns of $U_k$, the compressed
         representation is $Z = \\tilde X U_k$, and the reconstruction is $\\hat X = Z U_k^\\top + \\bar x$.</li>
       </ol>
       <p><b>Why the eigenvectors?</b> Projecting onto a unit direction $u$ gives points with variance
       $u^\\top \\Sigma u$. Hotelling's view: maximize that variance subject to $\\|u\\|=1$. Pearson's view: the
       leftover (perpendicular) distance is the <i>total</i> variance minus what you captured, so maximizing
       captured variance is the <i>same</i> as minimizing the squared perpendicular error. A Lagrange multiplier on
       $\\|u\\|=1$ turns "maximize $u^\\top \\Sigma u$" into exactly $\\Sigma u = \\lambda u$ &mdash; the eigenvector
       equation &mdash; and the variance captured is the eigenvalue $\\lambda$ itself.</p>`,

    symbols: [
      { sym: "$x_i$", desc: "the $i$-th data point: a vector of the measured features for one item (e.g. $[\\text{height},\\text{weight}]$). There are $n$ of them." },
      { sym: "$\\bar x$", desc: "the mean vector: the average of all the $x_i$, computed feature by feature. It is the centre of the cloud." },
      { sym: "$\\tilde x_i$", desc: "the centred point $x_i - \\bar x$: the data shifted so its mean sits at the origin. $\\tilde X$ stacks these as rows." },
      { sym: "$n$", desc: "the number of data points (rows). $d$ is the number of features (columns / original dimensions)." },
      { sym: "$\\Sigma$", desc: "Sigma: the $d\\times d$ covariance matrix, $\\frac{1}{n-1}\\tilde X^\\top \\tilde X$. Symmetric; entry $(j,k)$ is the covariance of features $j$ and $k$; the diagonal holds variances." },
      { sym: "$u_j$", desc: "the $j$-th principal component: a unit-length direction (eigenvector of $\\Sigma$). $U_k$ is the matrix whose columns are the top $k$ of them." },
      { sym: "$\\lambda_j$", desc: "lambda: the $j$-th eigenvalue of $\\Sigma$, equal to the variance of the data when projected onto $u_j$. Sorted $\\lambda_1\\ge\\lambda_2\\ge\\cdots\\ge 0$." },
      { sym: "$Z$", desc: "the scores: the centred data projected onto the top components, $Z=\\tilde X U_k$. The compressed, $k$-dimensional coordinates of each point." },
      { sym: "$\\hat X$", desc: "the reconstruction $Z U_k^\\top + \\bar x$: the best rank-$k$ approximation of the original data, mapped back to the original space." },
      { sym: "variance", desc: "the average squared distance of a set of numbers from their mean — how spread out they are along a direction." },
      { sym: "covariance", desc: "how two features move together: positive if they tend to be large together, negative if one is large when the other is small, zero if unrelated." },
      { sym: "eigenvector / eigenvalue", desc: "a vector $u$ that a matrix only stretches (does not rotate): $\\Sigma u=\\lambda u$. The stretch factor $\\lambda$ is the eigenvalue." },
      { sym: "positive semi-definite", desc: "a symmetric matrix whose eigenvalues are all $\\ge 0$; equivalently $u^\\top \\Sigma u\\ge 0$ for every $u$. Covariance matrices always are." }
    ],

    formula:
      `$$\\Sigma=\\frac{1}{n-1}\\tilde X^\\top \\tilde X,\\qquad
        \\Sigma\\,u_j=\\lambda_j\\,u_j,\\qquad \\lambda_1\\ge\\lambda_2\\ge\\cdots\\ge 0$$
       $$u_1=\\arg\\max_{\\|u\\|=1} u^\\top\\Sigma\\,u
        \\;=\\;\\arg\\min_{\\|u\\|=1}\\sum_{i=1}^{n}\\big\\|\\tilde x_i-(\\tilde x_i^\\top u)\\,u\\big\\|^2$$`,

    whatItDoes:
      `<p>The top line says: build the covariance matrix and take its eigenvectors, sorted by eigenvalue. The bottom
       line states the two equivalent objectives that pick the first component: <b>maximize the variance</b> of the
       projected data ($u^\\top\\Sigma u$, Hotelling 1933) is the same as <b>minimize the squared perpendicular
       distance</b> from the points to the line through the origin ($\\sum\\|\\tilde x_i-(\\tilde x_i^\\top u)u\\|^2$,
       Pearson 1901). The solution to both is the leading eigenvector $u_1$, and the variance it captures is exactly
       the eigenvalue $\\lambda_1$. The remaining components are the next eigenvectors, each orthogonal to the ones
       before.</p>`,

    derivation:
      `<p>The full "what is an eigenvector / how PCA diagonalizes the covariance" picture is owned by the
       <code>ml-pca</code> concept lesson (and <code>fnd-eigen</code>, <code>la-spectral</code>) &mdash; see those
       for the geometry. Here is the one step that ties Pearson's and Hotelling's objectives together.</p>
       <p>For a unit direction $u$, the projection of a centred point $\\tilde x_i$ onto $u$ has length
       $\\tilde x_i^\\top u$, so the projected variance is</p>
       $$\\frac{1}{n-1}\\sum_i (\\tilde x_i^\\top u)^2 = u^\\top\\!\\Big(\\tfrac{1}{n-1}\\textstyle\\sum_i \\tilde x_i \\tilde x_i^\\top\\Big)u = u^\\top \\Sigma\\, u.$$
       <p>By Pythagoras, each point splits into its projection plus the perpendicular leftover:
       $\\|\\tilde x_i\\|^2 = (\\tilde x_i^\\top u)^2 + \\|\\tilde x_i-(\\tilde x_i^\\top u)u\\|^2$. Summing,
       <b>total variance = captured variance + perpendicular error</b>. The total is fixed, so <b>maximizing</b>
       captured variance $u^\\top\\Sigma u$ is identical to <b>minimizing</b> the perpendicular error &mdash; this is
       why Pearson and Hotelling describe the same line.</p>
       <p>Now maximize $u^\\top\\Sigma u$ subject to $\\|u\\|^2=u^\\top u=1$. The Lagrangian is
       $L=u^\\top\\Sigma u-\\lambda(u^\\top u-1)$. Setting $\\partial L/\\partial u=0$ gives $2\\Sigma u-2\\lambda u=0$,
       i.e.</p>
       $$\\Sigma\\,u=\\lambda\\,u.$$
       <p>So the optimal $u$ is an eigenvector of $\\Sigma$, and at that $u$ the captured variance is
       $u^\\top\\Sigma u = u^\\top(\\lambda u)=\\lambda$. To maximize it, pick the <b>largest</b> eigenvalue. The
       second component repeats the argument among directions orthogonal to $u_1$, giving the second eigenvector,
       and so on.</p>`,

    example:
      `<p><b>Worked numbers</b> &mdash; the classic 2-D toy set (10 points, one row per point):</p>
       <p><code>X = [[2.5,2.4],[0.5,0.7],[2.2,2.9],[1.9,2.2],[3.1,3.0],[2.3,2.7],[2.0,1.6],[1.0,1.1],[1.5,1.6],[1.1,0.9]]</code></p>
       <ul>
         <li><b>Mean:</b> $\\bar x=[1.81,\\,1.91]$. Subtract it from every row to centre.</li>
         <li><b>Covariance</b> (divide by $n-1=9$): $\\Sigma=\\begin{bmatrix}0.6166 & 0.6154\\\\ 0.6154 & 0.7166\\end{bmatrix}$.
         The big off-diagonal $0.6154$ says the two features rise together &mdash; a tilted cloud.</li>
         <li><b>Eigen-decomposition:</b> $\\lambda_1=1.2840,\\ \\lambda_2=0.0491$, with eigenvectors
         $u_1=[0.6779,\\,0.7352]$ and $u_2=[-0.7352,\\,0.6779]$. $u_1$ points up-and-to-the-right, along the cloud's
         long diagonal &mdash; the first principal component.</li>
         <li><b>Explained variance:</b> $\\lambda_1/(\\lambda_1+\\lambda_2)=1.284/1.333=96.3\\%$. One direction
         captures almost all the spread.</li>
         <li><b>Keep $k=1$, reconstruct:</b> the average squared reconstruction error is $0.0442$. Notice
         $\\lambda_2\\cdot\\frac{n-1}{n}=0.0491\\cdot\\frac{9}{10}=0.0442$ &mdash; the error you pay equals the variance
         you discarded (the dropped eigenvalue). Keep $k=2$ and the error is $0$ (you kept everything).</li>
       </ul>
       <p>The CODE cell recomputes all of these and checks them against <code>sklearn.decomposition.PCA</code>.</p>`,

    recipe:
      `<p><b>PCA, as numbered steps</b> (Pearson 1901 / Hotelling 1933, modern form):</p>
       <ol>
         <li>Stack the data as a matrix $X$ ($n$ points $\\times$ $d$ features). Compute the mean $\\bar x$ and centre: $\\tilde X = X-\\bar x$.</li>
         <li>Form the covariance matrix $\\Sigma=\\frac{1}{n-1}\\tilde X^\\top \\tilde X$.</li>
         <li>Eigen-decompose $\\Sigma$ (or take the SVD of $\\tilde X$). Sort eigenvalues $\\lambda_1\\ge\\lambda_2\\ge\\cdots$ and reorder the eigenvectors to match.</li>
         <li>Pick $k$: the top-$k$ eigenvectors $U_k$ are the principal components; $\\lambda_1,\\dots,\\lambda_k$ are the variances they capture.</li>
         <li>Project: scores $Z=\\tilde X U_k$. Reconstruct (optional): $\\hat X=Z U_k^\\top+\\bar x$.</li>
       </ol>`,

    results:
      `<p>Pearson (1901) framed the result as the line/plane "for which the sum of the squares of the perpendicular
       distances&hellip; is a minimum," passing through the centroid of the points (Philosophical Magazine, Ser. 6,
       Vol. 2, 1901). Hotelling (1933) named the directions <b>principal components</b> and showed they are the
       eigenvectors of the variable correlation/covariance matrix, ordered so each successive component captures the
       greatest remaining variance (Journal of Educational Psychology 24(6):417&ndash;441). Neither paper reports a
       benchmark "accuracy" number &mdash; PCA is an exact linear algebra construction, not a trained model. The
       CODEVIZ numbers below are our own small run, not a paper number.</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> <code>sklearn.decomposition.PCA</code> ships this in two lines. Here you
       <b>build it from scratch in NumPy</b>: centre, covariance, <code>np.linalg.eigh</code>, sort, project,
       reconstruct. You import only the linear-algebra plumbing (<code>eigh</code> / matrix multiply), never the PCA
       itself. The payoff is the verification: your <code>components</code> and explained variances must match
       sklearn's <code>components_</code> and <code>explained_variance_</code> (up to a sign flip per component,
       which is meaningless for a direction). If they match, your implementation <i>is</i> PCA.</p>`,

    pitfalls:
      `<ul>
         <li><b>Forgetting to centre.</b> If you skip subtracting the mean, the first "component" just points at the
         mean and the variances are wrong. Pearson proved the best line passes through the centroid &mdash; centring
         is what enforces that.</li>
         <li><b>Sign ambiguity.</b> An eigenvector $u$ and $-u$ are the <i>same</i> direction; sklearn, LAPACK, and
         your code may pick opposite signs. Compare <code>abs(components)</code> (or flip signs to match) &mdash;
         never call a sign flip a bug.</li>
         <li><b>Eigenvalues come out ascending.</b> <code>np.linalg.eigh</code> returns eigenvalues smallest-first.
         Reverse the order (and the eigenvector columns with them) so component 1 is the largest-variance direction.</li>
         <li><b>$n$ vs $n-1$.</b> Dividing the covariance by $n$ vs $n-1$ rescales the eigenvalues by $\\frac{n-1}{n}$.
         sklearn's <code>explained_variance_</code> uses $n-1$; its reconstruction error is the $n$-denominator
         variance. Keep them straight or the worked-example numbers drift.</li>
         <li><b>PCA assumes linear, large-variance = important.</b> A low-variance direction can still carry the
         signal you care about (e.g. a tiny but discriminative feature). PCA optimizes reconstruction, not class
         separation &mdash; that is LDA's job.</li>
       </ul>`,

    recall: [
      "State the two equivalent PCA objectives (Pearson's minimize-perpendicular-error vs Hotelling's maximize-variance) and the single matrix whose eigenvectors solve both.",
      "Write the covariance matrix $\\Sigma$ in terms of the centred data $\\tilde X$, and the eigenvector equation it must satisfy.",
      "Why is the variance captured by component $u_j$ exactly equal to the eigenvalue $\\lambda_j$?",
      "If you keep $k$ of $d$ components, what does the leftover reconstruction error equal in terms of eigenvalues?"
    ],

    practice: [
      {
        q: `For the toy set, the eigenvalues are $\\lambda_1=1.2840$ and $\\lambda_2=0.0491$. What fraction of the total variance does the first principal component explain, and what does that say about reducing the data to 1-D?`,
        steps: [
          { do: `Total variance $=\\lambda_1+\\lambda_2=1.2840+0.0491=1.3331$.`, why: `Total variance is the sum of all eigenvalues (the trace of $\\Sigma$).` },
          { do: `Fraction $=\\lambda_1/1.3331=0.963$.`, why: `Explained-variance ratio of component 1.` }
        ],
        answer: `The first component explains about 96.3% of the variance. Dropping to one dimension throws away only ~3.7% of the spread, so a 1-D summary is almost lossless here — exactly why PCA is good at compression when the data is stretched along a few directions.`
      },
      {
        q: `Show why minimizing perpendicular reconstruction error is the same as maximizing projected variance.`,
        steps: [
          { do: `For a unit direction $u$, split each centred point: $\\|\\tilde x_i\\|^2=(\\tilde x_i^\\top u)^2+\\|\\tilde x_i-(\\tilde x_i^\\top u)u\\|^2$.`, why: `Pythagoras: projection plus perpendicular leftover.` },
          { do: `Sum over all points: total variance $=$ captured variance $+$ perpendicular error.`, why: `The left side does not depend on $u$.` },
          { do: `So increasing captured variance must decrease perpendicular error by the same amount.`, why: `Their sum is constant.` }
        ],
        answer: `Because total variance is fixed, captured variance and perpendicular error trade off one-for-one. Maximizing $u^\\top\\Sigma u$ (Hotelling) therefore minimizes $\\sum\\|\\tilde x_i-(\\tilde x_i^\\top u)u\\|^2$ (Pearson). They are literally the same optimization, which is why both papers land on the leading eigenvector of $\\Sigma$.`
      },
      {
        q: `Ablation: keep $k=0$, then $k=1$, then $k=2$ components and measure the mean squared reconstruction error on the toy set. Predict the three numbers from the eigenvalues and confirm the trend.`,
        steps: [
          { do: `$k=0$: reconstruct every point as the mean. Error $=$ total variance $\\cdot\\frac{n-1}{n}=1.3331\\cdot 0.9=1.1998$.`, why: `Keeping nothing pays the whole variance.` },
          { do: `$k=1$: error $=\\lambda_2\\cdot\\frac{n-1}{n}=0.0491\\cdot0.9=0.0442$.`, why: `You discard only the second direction's variance.` },
          { do: `$k=2$: error $=0$.`, why: `You kept both directions — perfect reconstruction in 2-D.` }
        ],
        answer: `Error falls 1.1998 → 0.0442 → 0 as $k$ goes 0 → 1 → 2. Each step removes the next-largest eigenvalue from the error, so the curve drops fast then flattens — the "elbow" you look for when choosing $k$. In CODEVIZ we plot exactly this reconstruction-error-vs-$k$ curve (our small run, not a paper number).`
      }
    ]
  });

  window.CODE["paper-pca"] = {
    lib: "NumPy",
    runnable: false,
    explain:
      `Build PCA from scratch in NumPy: center, covariance, eigen-decomposition (np.linalg.eigh), sort by ` +
      `eigenvalue, project onto the top-k components, and reconstruct. Then PROVE it is PCA by checking the ` +
      `components and explained variances against sklearn.decomposition.PCA (up to a sign flip per component). ` +
      `Finally recompute the worked example (means, covariance, eigenvalues, 96.3% explained, k=1 reconstruction ` +
      `error = dropped eigenvalue). Runs in Colab (numpy + scikit-learn are preinstalled).`,
    code: `import numpy as np
from sklearn.decomposition import PCA

np.set_printoptions(precision=4, suppress=True)

# ---- the classic toy 2-D set: 10 points, one row each ----
X = np.array([[2.5,2.4],[0.5,0.7],[2.2,2.9],[1.9,2.2],[3.1,3.0],
              [2.3,2.7],[2.0,1.6],[1.0,1.1],[1.5,1.6],[1.1,0.9]])
n, d = X.shape

def my_pca(X, k):
    """PCA from scratch — Pearson(1901)/Hotelling(1933): center, covariance, eigen, project."""
    mean = X.mean(axis=0)                       # 1) centroid (best line passes through it)
    Xc   = X - mean                             #    center the cloud
    cov  = (Xc.T @ Xc) / (X.shape[0] - 1)       # 2) covariance matrix Sigma (1/(n-1))
    w, V = np.linalg.eigh(cov)                  # 3) eigen-decomp of symmetric Sigma
    order = np.argsort(w)[::-1]                 #    eigh returns ascending -> sort descending
    w, V = w[order], V[:, order]
    components = V[:, :k].T                     # 4) top-k principal directions (rows)
    Z = Xc @ components.T                       #    project: scores (compressed coords)
    return mean, w, components, Z

mean, eigvals, comp, Z = my_pca(X, k=2)
print("mean:", mean)
print("eigenvalues (variance per PC):", eigvals)          # [1.2840 0.0491]
print("components (rows = PCs):\\n", comp)
print("explained variance ratio:", eigvals / eigvals.sum())  # [0.9632 0.0368]

# ---- THE ORACLE: must match sklearn.decomposition.PCA ----
skl = PCA(n_components=2).fit(X)
# eigenvector sign is arbitrary (u and -u are the same direction) -> compare magnitudes
comp_match = np.allclose(np.abs(comp), np.abs(skl.components_), atol=1e-6)
var_match  = np.allclose(eigvals, skl.explained_variance_, atol=1e-6)
print("\\ncomponents match sklearn (up to sign):", comp_match)        # True
print("explained variance matches sklearn:    ", var_match)          # True

# ---- variance-maximizing projection + reconstruction (k=1) ----
mean1, w1, comp1, Z1 = my_pca(X, k=1)
recon1 = Z1 @ comp1 + mean1                                # back to original space
mse1 = np.mean(np.sum((X - recon1)**2, axis=1))            # mean squared reconstruction error
print("\\nk=1 reconstruction MSE:", round(mse1, 4))                  # 0.0442
print("dropped eigenvalue * (n-1)/n:",
      round(eigvals[1] * (n-1)/n, 4))                       # 0.0442  -> error == discarded variance

# ---- ablation: reconstruction error vs number of components kept ----
for k in [0, 1, 2]:
    Xc = X - mean
    if k == 0:
        recon = np.tile(mean, (n, 1))
    else:
        Uk = comp[:k].T                                     # top-k eigenvectors as columns
        recon = (Xc @ Uk) @ Uk.T + mean
    err = np.mean(np.sum((X - recon)**2, axis=1))
    print(f"k={k}: reconstruction MSE = {err:.4f}")         # 1.1998, 0.0442, 0.0000`
  };

  window.CODEVIZ["paper-pca"] = {
    question: "On a toy 2-D cloud that lies along a diagonal, how much variance does each principal component capture, and how does reconstruction error fall as we keep more components (the ablation)?",
    charts: [
      {
        type: "bar",
        title: "Variance captured per principal component (eigenvalues of the covariance matrix)",
        xlabel: "principal component",
        ylabel: "explained-variance ratio",
        series: [
          {
            name: "explained variance ratio",
            color: "#7ee787",
            points: [["PC1", 0.9632], ["PC2", 0.0368]]
          }
        ]
      },
      {
        type: "line",
        title: "Ablation: mean reconstruction error vs number of components kept",
        xlabel: "k (components kept)",
        ylabel: "mean squared reconstruction error",
        series: [
          {
            name: "reconstruction MSE",
            color: "#4ea1ff",
            points: [[0, 1.1998], [1, 0.0442], [2, 0.0]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (numpy, the classic 10-point toy set), not a paper number. Left: the first principal component captures 96.3% of the variance and the second only 3.7% — the cloud is essentially 1-D, so PCA compresses 2→1 almost losslessly. Right: the ablation. Reconstruction error drops 1.1998 → 0.0442 → 0 as we keep k=0,1,2 components; each step removes the next-largest eigenvalue from the error (the k=1 error 0.0442 equals the discarded second eigenvalue times (n-1)/n). The sharp drop then flat tail is the 'elbow' used to choose how many components to keep.",
    code: `import numpy as np
X = np.array([[2.5,2.4],[0.5,0.7],[2.2,2.9],[1.9,2.2],[3.1,3.0],
              [2.3,2.7],[2.0,1.6],[1.0,1.1],[1.5,1.6],[1.1,0.9]])
n = X.shape[0]
mean = X.mean(axis=0); Xc = X - mean
cov = (Xc.T @ Xc) / (n - 1)
w, V = np.linalg.eigh(cov)
order = np.argsort(w)[::-1]; w, V = w[order], V[:, order]

print("explained variance ratio:", np.round(w / w.sum(), 4))   # [0.9632 0.0368]

for k in [0, 1, 2]:                                            # ablation: error vs k
    if k == 0:
        recon = np.tile(mean, (n, 1))
    else:
        Uk = V[:, :k]
        recon = (Xc @ Uk) @ Uk.T + mean
    err = np.mean(np.sum((X - recon)**2, axis=1))
    print(f"k={k}: reconstruction MSE = {err:.4f}")            # 1.1998, 0.0442, 0.0000`
  };
})();
